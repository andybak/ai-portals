import*as e from"three";import{mergeGeometries as eo}from"three/addons/utils/BufferGeometryUtils.js";import{makePath as to,makeRng as ut,hashSeed as dt,clamp as pe,lerp as $,smoothstep as j}from"../kit/core.js";import*as T from"../kit/fx.js";import{buildHero as Ro,PROFILES as qo,bottleMesh as Po,glassMaterial as Go,enamelMaterial as Fo,rbox as U,paint as Gt,tube as vt,rod as tt,knob as Ft,GLSL_LIGHT as mt,GLSL_BEADS as _o,GLSL_FOOT as To}from"../parts/the-light-comes-on.js";const ue=Math.PI*2,ot=["#04080B","#0E2A33","#7FD6E8","#EAF6FF","#5BE6B4","#FFB45A","#C8324A"],at=-240,de=[320,215,110],Ve=-180,he=[-89,345],oo=40,be=[95,404,-150],Se=[14,406.6,-73],ao=.093,so=.1,no=.55,ro=[.8,.9],io=21.5,No="#18313a",lo=.0038,He=(r,c,p,n=.3)=>j(c,c+(p-c)*n,r)*(1-j(p-(p-c)*n,p,r)),we=[-.7606,0,.6493],Ee=r=>[75+we[0]*r,352,-140+we[2]*r],co=[Ee(0),Ee(40),Ee(80),Ee(120),Ee(150),[-58,353,-29],[-78,357,-22],[-98,365,-22],[-116,376,-30],[-124,387,-46],[-120,396,-63],[-106,401,-76],[-88,400,-86],[-66,390,-103],[-43,366,-122],[-27,349.5,-133.5],[-13,344.5,-139.5],[14,344,-140],[64,347,-134],[104,347,-136],[128,345.5,-157],[128,342,-184],[114,328,-197],[98,303,-203.5],[82,271,-203.5],[68,244,-203.5],[50,223,-205],[22,200.5,-208],[-18,166,-213.5],[-58,128,-229],[-95,92,-248],[-122.5,82,-254.5],[-150,72,-261]],pt=1005.41,ho=467.8,_t=518.7,fo=to(co).length,uo=1-(pt-_t)/fo,Vo=uo-(_t-ho)/fo,bt=[[0,0],[.16,.16],[Vo,ho/pt],[uo,_t/pt],[1,1]];function vo(r,c,p){let n=0;for(;n<bt.length-2&&r>bt[n+1][c];)n++;const h=bt[n],o=bt[n+1];return h[p]+(o[p]-h[p])*pe((r-h[c])/Math.max(o[c]-h[c],1e-6),0,1)}const Tt=r=>vo(pe(r,0,1),0,1),Re=r=>vo(pe(r,0,1),1,0),Ue=[[.2,-95,-3],[.214,-92,-1],[.232,-26,-11],[.25,36,-20],[.27,22,-24],[.3,19,-25],[.33,18,-25],[.35,16,-25],[.385,24,-15],[.4275,24,-8],[.447,28,-6],...[[.479,46,-5],[.497,4,-1],[.518,-12,1.5],[.536,-36,3],[.55,-45,3],[.585,-52,-1],[.61,-68,-8],[.64,-80,-22],[.67,-84,-20],[.7,-92,-13],[.735,-93,-12],[.76,-92,-14],[.79,-90,-17],[.82,-90,-18],[.85,-92,-17],[.87,-92,-16],[.9,-85,-12],[.93,-77,-5],[.97,-76.7,-6]].map(r=>[Re(r[0]),r[1],r[2]])],ye={rose:[0,.235],gazeA:[.185,.5,.1],gazeB:[.45,.97,.058],portal:[Re(.78),.96],crisper:[Re(.8),Re(.92)]};function Ho(r,c){const p=Ue.length;let n=0;for(;n<p-2&&r>Ue[n+1][0];)n++;const h=Ue[n],o=Ue[n+1],m=Ue[Math.max(n-1,0)],B=Ue[Math.min(n+2,p-1)],k=o[0]-h[0],M=pe((r-h[0])/k,0,1),W=M*M,V=W*M,f=l=>{const u=(o[l]-m[l])/Math.max(o[0]-m[0],1e-6)*k,y=(B[l]-h[l])/Math.max(B[0]-h[0],1e-6)*k;return(2*V-3*W+1)*h[l]+(V-2*W+M)*u+(-2*V+3*W)*o[l]+(V-W)*y},t=f(1)*Math.PI/180,s=f(2)*Math.PI/180;return c.set(Math.sin(t)*Math.cos(s),Math.sin(s),-Math.cos(t)*Math.cos(s))}const xe=T.GLSL_HASH+T.GLSL_VALUE_NOISE+T.GLSL_FBM+mt+_o+T.GLSL_FOG_PARS_FRAG,Ie=`
  vec3 Vv = cameraPosition - vW; float dist = max(length(Vv), 1e-3); vec3 V = Vv/dist;
  vec3 P = vW - uOrigin;
  vec3 Lb = uBulbPos - vW; float db = max(length(Lb), 1.); Lb /= db; float att = lcBulbAtt(db);
  vec3 Ld = uDiodePos - vW; Ld = Ld/max(length(Ld), 1.);
  vec3 Hb = normalize(Lb + V + vec3(0., 1e-3, 0.)), Hd = normalize(Ld + V + vec3(0., 1e-3, 0.));
  float dio = uDiode*(1. - .6*uBulb);
  float mpp = max(length(fwidth(vW)), 1e-4);
`,Eo=`
float lcGlintK(vec2 uv, vec3 N, vec3 H, float aa, float lo){
  uv = mat2(.819, .574, -.574, .819)*uv + 3.7;
  vec2 id = floor(uv), f = fract(uv) - .5;
  vec3 r = hash33(vec3(id, 7.3)) - .5;
  vec3 n = normalize(r*2. + N*.7);
  float s = smoothstep(lo, .995, dot(n, H));
  float rad = .08 + .16*fract(r.z*7.3 + r.x*3.1 + .5);
  float d = length(f - r.xy*.44);
  return s*s*(1. - smoothstep(rad*.35, min(rad + aa, .27), d))*(1. - smoothstep(.22, .6, aa));
}
float lcGlint(vec2 uv, vec3 N, vec3 H, float aa){ return lcGlintK(uv, N, H, aa, .9); }
`,Oe=`
  attribute vec2 aSw; uniform float uTime;
  varying vec3 vW, vN, vCol, vO;
  ${T.GLSL_FOG_PARS_VERT}
  void main(){
    vec3 p = position; vO = position;
    #ifdef USE_COLOR
      vCol = color;
    #else
      vCol = vec3(1.);
    #endif
    #ifdef USE_SWAY
      p += vec3(sin(uTime*1.7 + aSw.y), .35*sin(uTime*2.3 + aSw.y*1.3), cos(uTime*1.3 + aSw.y*.7))*aSw.x;
    #endif
    #ifdef USE_INSTANCING
      vec4 w = modelMatrix*instanceMatrix*vec4(p, 1.); vN = mat3(modelMatrix)*(mat3(instanceMatrix)*normal);
    #else
      vec4 w = modelMatrix*vec4(p, 1.); vN = mat3(modelMatrix)*normal;
    #endif
    vW = w.xyz;
    vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
    ${T.GLSL_FOG_VERT}
  }`,Ge={transparent:!0,premultipliedAlpha:!0,depthWrite:!1,blending:e.CustomBlending,blendSrc:e.OneFactor,blendDst:e.OneMinusSrcAlphaFactor},mo={transparent:!0,depthWrite:!1,blending:e.CustomBlending,blendSrc:e.OneFactor,blendDst:e.OneFactor};function Io(r,c){const p=()=>T.fogUniforms(),n=o=>new e.ShaderMaterial({fog:!0,...o,uniforms:{...p(),...r,...o.uniforms||{}}}),h={};return h.plate=n({uniforms:{uFrost:{value:c.frost},uRose:{value:new e.Vector3(he[0],he[1],oo)},uGain:{value:c.plateGain}},vertexShader:Oe,fragmentShader:`
      varying vec3 vW, vN; uniform float uFrost, uGain; uniform vec3 uRose;
      ${xe}${Eo}
      void main(){
        ${Ie}
        #ifdef LC_WALL
          vec2 q = vec2(vW.z, vW.y), bq = vec2(uBulbPos.z, uBulbPos.y);
        #else
          vec2 q = vW.xy, bq = uBulbPos.xy;
        #endif
        vec2 rq = q - uRose.xy; float r = length(rq);
        float ang = atan(rq.y, rq.x + (abs(rq.x) + abs(rq.y) < 1e-3 ? 1e-3 : 0.));
        float n1 = fbm(q*.03 + 7.1), n2 = fbm(q*.11 + 1.7);
        #ifdef LC_WALL
          // the crust runs on round the corner from the rosette and thins toward the door
          float rose = 0.;
          float crust = (1. - smoothstep(26., 150., -vW.z + (n2 - .5)*46.))*smoothstep(236., 322., vW.y + (n1 - .5)*70.);
        #else
          float rose = 1. - smoothstep(uRose.z*.5, uRose.z*1.55, r + (n2 - .5)*26.);
          float crust = (1. - smoothstep(40., 150., vW.x + 150. + (n2 - .5)*46.))*smoothstep(236., 322., vW.y + (n1 - .5)*70.)*.8;
        #endif
        float cover = clamp(max(max(rose, crust), smoothstep(.64 - .34*uFrost, .92 - .2*uFrost, n1 + q.y/420.*.2)), 0., 1.);
        float arms = abs(sin(ang*9. + (n2 - .5)*5. + r*.05));
        float fern = (1. - smoothstep(0., .55, arms))*rose;
        float fine = 1. - smoothstep(.3, 1.2, mpp);
        // the crust: feathers of ice laid along two grains that cross, on a warped domain, so no lattice shows
        vec2 wq = q + 7.*vec2(fbm(q*.06 + 3.1), fbm(q*.06 + 9.7));
        vec2 w1 = mat2(.766, .643, -.643, .766)*wq, w2 = mat2(.5, -.866, .866, .5)*wq;
        float f1 = fbm(vec2(w1.x*.17, w1.y*1.25)), f2 = fbm(vec2(w2.x*.17, w2.y*1.25) + 5.3);
        float grainMix = smoothstep(.38, .62, fbm(q*.021 + 8.));
        float feather = mix(f1, f2, grainMix);
        float crystal = mix(.6, smoothstep(.2, .8, feather)*.75 + fbm(mat2(.6, .8, -.8, .6)*wq*2.3)*.25, fine);
        vec3 enamel = vec3(.5, .58, .63)*(.9 + .1*n2);
        enamel *= 1. - .14*smoothstep(.42, .5, abs(fract(q.x/30. + .5) - .5));
        vec3 ice = vec3(.8, .88, .93)*(.7 + .3*crystal);
        ice = mix(ice, vec3(.93, .97, 1.), fern*.6);
        vec3 alb = mix(enamel, ice, cover);
        #ifndef LC_WALL
          // lit, the wheel is an eye with spokes: between the fern's arms the plate lies in the needles' blue shade
          alb *= mix(vec3(1.), vec3(.34, .52, .74), uBulb*rose*(1. - fern)*.66);
        #endif
        // in the dark the crust keeps its face nearly flat: the diode finds points on it, never a marbled sheen
        vec2 gq = vec2(f1 - .5, f2 - .5)*(.45*(.12 + .88*uBulb));
        #ifdef LC_WALL
          vec3 N0 = vec3(1., 0., 0.);
          vec3 N = normalize(vec3(1., gq.y*1.7*cover*fine, gq.x*1.7*cover*fine));
        #else
          vec3 N0 = vec3(0., 0., -1.);
          vec3 N = normalize(vec3(gq*1.7*cover*fine, -1.));
        #endif
        // the needles' long blue shadows, raking away from the bulb
        vec2 bd = q - bq; bd = bd/max(length(bd), 1.);
        vec2 sq = vec2(dot(q, vec2(-bd.y, bd.x)), dot(q, bd));
        float streak = vnoise(vec2(sq.x*.55, sq.y*.035 + 4.))*vnoise(vec2(sq.x*.21 + 9., sq.y*.02));
        float shadow = smoothstep(.16, .4, streak)*cover*(.4 + .6*uFrost)*(1. - uBulb);   // (a painted stand-in, kept for the dark: lit, every needle throws its own shadow, see M.needle)
        #ifdef LC_WALL
          float lift = 1. + uGain*cover*.1;
        #else
          float lift = 1. + uGain*cover*(1. - .5*rose*(1. - fern));
        #endif
        #ifdef LC_WALL
          // beside the slot the kitchen light lies on the wall: the gold is brightest at the slot and gone a shelf's depth in
          float inBar = lcBar(P)*exp(-max(P.z, 0.)/30.), inBarFar = lcBar(P)*exp(-max(P.z, 0.)/110.);
          shadow *= 1. - inBar;
        #endif
        // before the bulb the plate has no sheen to speak of: specular amount rises with the light
        vec3 col = lcShade(vW, N, V, alb*(1. - .6*shadow), 28., mix(.05, .35 + cover*.5, uBulb))*lift;
        col += mix(uShadowCol, vec3(.2, .05, .3), .55*smoothstep(.35, .65, n2))*alb*(uBulb*shadow*1.3);
        #ifdef LC_WALL
          // below the top terrace this wall stands in the shade of the shelves and what is on them: it falls away to teal
          float shelfShade = uBulb*(1. - smoothstep(196., 336., P.y + (n1 - .5)*30.));
          col = mix(col, alb*uShadowCol*(.12 + uKey.y*.2), .9*shelfShade);
        #endif
        // IN THE BULB'S LIGHT the crust has relief. Its slope is taken over .3 m toward the bulb's foot on this surface (a third
        // of a feather's .8 m, so that a feather's flank is in shade and not half the crust): flanks that face the bulb are the
        // brightest of the plate, lee flanks lie at .24 of them (two stops) and go blue; the edge of every patch of crust has its
        // lit side and its shade side. Then the body is held under the bloom pass (lcCap): the glints added below are what goes over it.
        #ifndef LC_WALL
          col *= 1. - .3*uBulb;                                 // lit, the plate is seen from close: held under the tone map's shoulder
        #endif
        {
          vec2 wqU = wq - bd*.3;
          vec2 w1u = mat2(.766, .643, -.643, .766)*wqU, w2u = mat2(.5, -.866, .866, .5)*wqU;
          float featherU = mix(fbm(vec2(w1u.x*.17, w1u.y*1.25)), fbm(vec2(w2u.x*.17, w2u.y*1.25) + 5.3), grainMix);
          vec2 dqx = dFdx(q), dqy = dFdy(q); float det = dqx.x*dqy.y - dqx.y*dqy.x; det = abs(det) < 1e-7 ? 1e-7 : det;
          float cvx = dFdx(cover), cvy = dFdy(cover);
          float slopeC = dot(vec2(cvx*dqy.y - cvy*dqx.y, cvy*dqx.x - cvx*dqy.x)/det, bd)*(1. - smoothstep(.15, .6, mpp));
          float rel = (smoothstep(.2, .8, feather) - smoothstep(.2, .8, featherU))*cover + clamp(slopeC, -.4, .4)*1.2;
          float leeK = 1. - smoothstep(-.3, -.06, rel), crestK = smoothstep(.05, .28, rel), relK = uBulb*cover*fine;
          col *= mix(1., 1. + .14*crestK - .76*leeK, relK);
          col = mix(col, alb*lcShadeTip(), relK*leeK*.5);
          #ifdef LC_WALL
            // the moulded runners throw theirs: one every 26 m from y 28, standing 4.6 m off the wall (the stout rails under the
            // shelves 7.6 m). Under each lies its shadow, as tall as the runner stands off times (404 - y)/50: the bulb's foot on
            // this wall is at y 404, and the light is taken to stand 50 m off it (as for the needles)
            float yr = 28. + 26.*ceil((vW.y - 28.)/26.), hlf = 1.7, off = 4.6, zEnd = -221.;
            if (abs(yr - 314.) < 1. || abs(yr - 210.) < 1. || abs(yr - 106.) < 1.) { yr = yr > 300. ? ${(de[0]-7.5).toFixed(1)} : (yr > 200. ? ${(de[1]-7.5).toFixed(1)} : ${(de[2]-7.5).toFixed(1)}); hlf = 3.2; off = 7.6; zEnd = -183.; }
            float sLen = off*max(uBulbPos.y - vW.y, 0.)/50., st = (yr - hlf - vW.y)/max(sLen, .05);
            float rs = smoothstep(-.03, .04, st)*(1. - smoothstep(.55, 1., st))*step(yr, 400.)*smoothstep(zEnd - 3., zEnd + 3., vW.z)*step(.1, sLen);
            rs *= .9*uBulb*lcHood(vW)*(1. - shelfShade)*(1. - inBar);
            col = mix(col, min(col, alb*mix(lcShadeRoot(), lcShadeTip(), smoothstep(0., .8, st))), rs);
          #endif
          // colour soaked into the ice itself: green from above where the diode hangs, the kitchen's colour low on the slot side
          // (part of the body, so under the same ceiling)
          float gw = exp(-length(vW - uDiodePos)/190.), kw = uBar.w*uWarm*exp(-max(vW.x + 150., 0.)/120.)*smoothstep(-40., -190., vW.z)*.8;
          vec3 soak = alb*cover*uBulb*(uGreenCol*uGreenCol*(gw*.9*clamp(dot(N, Ld)*.7 + .5, 0., 1.)) + uWarmCol*kw*.3);
          #ifndef LC_WALL
            soak *= 1. - .3*uBulb;
          #endif
          col += soak;
          col = mix(col, lcCap(col, .9), uBulb);
        }
        #ifndef LC_WALL
          float keep = 1. - .3*uBulb;                           // (the glints are scaled as they always were)
        #else
          float keep = 1.;
        #endif
        vec3 body = col; col = vec3(0.);
        float aa = mpp/1.6, near = 1. - smoothstep(.35, .9, aa);
        float gB = lcGlint(q/1.6, N, Hb, aa)*near + lcGlint(q/4.3 + 31., N, Hb, aa*.37) + lcGlint(q/9.1 + 57., N, Hb, aa*.176)*.7;
        // the diode's glints: sparse points that travel as the eye moves, densest in the rosette
        float gD = lcGlintK(q/1.6 + 11., N0, Hd, aa, .955)*near + lcGlintK(q/3.1 + 5., N0, Hd, aa*.52, .962)*.8;
        float tw = .7 + .3*sin(uTime*3. + (f1 + f2)*37.);
        // the crust shimmers in waves, and not in white alone: a share of its points throw back the diode's green, the
        // kitchen's colour and whatever colour the bulb's light picked up on its way through the glass
        vec3 thr = lcThrown(vW);
        float hue = fract((f1*3.1 + f2*2.3)*7. + floor(q.x/4.3)*.37 + floor(q.y/4.3)*.61);
        vec3 gcol = hue < .4 ? uBulbCol : (hue < .72 ? mix(uGreenCol, vec3(.7, 1., .9), .25)*1.25 : mix(uWarmCol, uBulbCol, .2)*1.2);
        col += gcol*thr*(uBulb*att*gB*8.*cover*(.55 + .45*sin(uTime*2.7 + (f1 + f2)*61.)));
        col += mix(uDiodeCol, vec3(.8, 1., .95), .35)*(dio*gD*7.*tw*(cover*.7 + rose*.5 + .1));
        col += uDiodeCol*(dio*(.006 + .2*fern)*cover*pow(max(dot(N0, Hd), 0.), 6.));
        col += vec3(.62, 1., .9)*((1. - uBulb)*uDiode*(rose*(.06 + .3*fern + .14*crystal*crystal) + cover*(1. - rose)*.014*(.4 + .6*crystal)));
        col = body + col*keep;
        #ifdef LC_WALL
          col = col*(1. - .3*inBar) + alb*uWarmCol*(uWarm*inBar*(.16 + .2*cover));   // the light runs along this wall, not onto it
          vec3 Hk = normalize(LC_KITCHEN + V + vec3(0., 1e-3, 0.));
          col += uWarmCol*(uWarm*inBarFar*5.*cover*(lcGlint(q/1.6 + 19., N, Hk, aa)*near + lcGlint(q/4.3 + 41., N, Hk, aa*.37) + .6*lcGlint(q/9.1 + 23., N, Hk, aa*.176)));
          col += alb*uWarmCol*(uWarm*inBarFar*.12*cover*(.4 + .6*crystal));
          col *= 1. - .3*smoothstep(.5, 1., cos((vW.y - 20.)*6.2832/26.))*(1. - cover*.6)*(1. - inBar)*(1. - uBulb);   // (a painted band under each runner, for the dark: lit, the runners throw their own shadows, above)
        #endif
        gl_FragColor = vec4(fxApplyFog(max(col, vec3(0.))), 1.);
      }`}),h.wall=n({defines:{LC_WALL:1},uniforms:h.plate.uniforms,vertexShader:Oe,fragmentShader:h.plate.fragmentShader}),h.needle=n({...Ge,depthWrite:!0,uniforms:{uShiver:{value:0},uGain:{value:c.needleGain}},vertexShader:`
      attribute vec3 aBase, aAxis; attribute vec2 aWr; attribute float aFace;
      uniform float uShiver, uTime; uniform vec3 uBulbPos;
      varying vec3 vW, vSh; flat varying vec2 vId; varying float vH;
      ${T.GLSL_FOG_PARS_VERT}
      void main(){
        float L = max(length(aAxis), 1e-3); vec3 ax = aAxis/L;
        vec3 t1 = cross(ax, vec3(.37, .81, .45)); t1 = t1/max(length(t1), 1e-3); vec3 t2 = cross(ax, t1);
        float isSh = step(11.5, aFace);
        vec3 pu = isSh > .5 ? (aFace < 12.5 ? ${Nt[0]} : (aFace < 13.5 ? ${Nt[1]} : ${Nt[2]})) : position;
        vec3 p = (t1*pu.x + ax*pu.y + t2*pu.z)*L;
        p += t1*(sin(uTime*41. + aWr.y*60.)*uShiver*pu.y*L*.05);
        vId = vec2(aWr.y, aFace); vH = isSh > .5 ? 0. : position.y; vSh = vec3(0.);
        vec3 q = aBase + p;
        if (isSh > .5) {
          // the surface: its normal into the box, how far root and tip stand off it, the bulb's foot on it, the light's stand-off
          vec3 nrm = vec3(0.), foot = uBulbPos; float hr = 0., ht = 0., S = 50.;
          if (aBase.y > 419.5) { nrm = vec3(0., -1., 0.); hr = 420. - aBase.y; ht = 420. - q.y; foot.y = 420.; S = max(420. - uBulbPos.y, 4.); }
          else if (aBase.x < -144. && aBase.z < -1.) { nrm = vec3(1., 0., 0.); hr = aBase.x + 150.; ht = q.x + 150.; foot.x = -150.; }
          else if (aBase.z > -4.) { nrm = vec3(0., 0., -1.); hr = -aBase.z; ht = -q.z; foot.z = 0.; }
          vec3 Lp = foot + nrm*S;
          hr = clamp(hr, 0., S*.8); ht = clamp(ht, 0., S*.8);
          vec3 rS = aBase + (aBase - Lp)*(hr/(S - hr)), tS = q + (q - Lp)*(ht/(S - ht));
          vec3 dir = tS - rS; dir -= nrm*dot(dir, nrm);
          float len = length(dir), maxL = 6.*max(ht - hr, 0.);
          vec3 dn = dir/max(len, 1e-3);
          len = min(len, maxL)*step(.5, dot(nrm, nrm));
          vec3 side = cross(nrm, dn);
          float wd = L*(aFace < 12.5 ? ${Fe[0][3].toFixed(3)} : (aFace < 13.5 ? ${Fe[1][3].toFixed(3)} : ${Fe[2][3].toFixed(3)}))*1.8*step(1e-3, len);   // (1.8: the spike's own width and, beyond it, the soft edge the bulb's 10 m of glass gives a shadow)
          q = rS + dn*(len*position.y) + side*(wd*position.x) + nrm*(.06 + .006*floor(fract(aWr.y*57.3)*24.));
          vSh = vec3(1., position.y, position.x);
        }
        vec4 w = modelMatrix*vec4(q, 1.); vW = w.xyz;
        vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
        ${T.GLSL_FOG_VERT}
      }`,fragmentShader:`
      varying vec3 vW, vSh; flat varying vec2 vId; varying float vH; uniform float uGain;
      ${xe}
      void main(){
        ${Ie}
        vec3 N = cross(dFdx(vW), dFdy(vW)); N = N/max(length(N), 1e-9);
        if (dot(N, V) < 0.) N = -N;
        if (vSh.x > .5) {
          // a spike's shadow on the plate: the look's shade, deep teal at its root going blue toward its tip, where it thins away;
          // soft at its sides. As much of it as there is bulb light on the surface to take away (none before the bulb, none
          // in the shade of the shelves, none where the kitchen's bar lies on the wall)
          float along = vSh.y, across = abs(vSh.z)/max(1. - along, 1e-3);
          float sa = .82*(1. - smoothstep(.4, 1., along))*(1. - smoothstep(.3, 1., across))*uBulb*lcHood(vW);
          float onWall = 1. - step(-149.5, vW.x);
          sa *= 1. - onWall*(1. - smoothstep(196., 336., vW.y)*(1. - lcBar(P)*exp(-max(P.z, 0.)/30.)));
          vec3 sc = mix(lcShadeRoot(), lcShadeTip(), smoothstep(0., .8, along));
          gl_FragColor = vec4(fxFogPremult(sc*sa, sa), sa);
          return;
        }
        vec3 alb = vec3(.78, .87, .93)*(.85 + .3*fract(vId.x*7.3));
        float deep = smoothstep(0., .4, vH);
        // seen from close the thicket is not one white: each spike has a lit face and a blue one, a pale tip and a root in shade
        float nearK = uBulb*(1. - smoothstep(60., 170., dist)), lam = clamp(dot(N, Lb)*.75 + .4, 0., 1.);
        vec3 col = lcShade(vW, N, V, alb, 50., 1.2)*(uGain*mix(.5, 1., deep)*(1. - .25*nearK)) + uShadowCol*alb*(uBulb*(1. - deep)*uKey.y);
        float back = clamp(dot(-V, Lb)*.5 + .5, 0., 1.), fres = pow(max(1. - abs(dot(N, V)), 0.), 2.);
        float hood = lcHood(vW);
        vec3 thr = lcThrown(vW);
        col += uBulbCol*thr*(uBulb*att*(back*back*.5 + fres*.4)*deep*(1. - .4*nearK));
        col += alb*uBulbCol*thr*(uBulb*att*hood*mix(.5 + .85*deep, (.1 + .95*deep*deep)*mix(.3, 1.05, lam), nearK));        // ice scatters the bulb's light: from afar no needle is darker than its wall
        col = mix(col, col*vec3(.62, .8, 1.05), nearK*(1. - lam)*.7);
        // every needle is a prism: one in three flashes green, one in four the kitchen's colour
        float hue = fract(vId.x*17.3 + vId.y*.31);
        vec3 gcol = hue < .42 ? uBulbCol : (hue < .76 ? mix(uGreenCol, vec3(.7, 1., .9), .2)*1.3 : mix(uWarmCol, uBulbCol, .15)*1.25);
        vec3 soak = alb*uBulb*deep*(uGreenCol*uGreenCol*(exp(-length(vW - uDiodePos)/190.)*1.5*clamp(dot(N, Ld)*.8 + .35, 0., 1.)) + uWarmCol*(uBar.w*uWarm*exp(-max(vW.x + 150., 0.)/120.)*smoothstep(-40., -190., vW.z)*.3));
        col += soak;
        // IN THE BULB'S LIGHT a spike has a lit flank and a shade flank. What the bulb strikes squarely is hard blue-white and the
        // brightest thing on the wall, each face a little different and the ice's grain showing along it, the tip palest; what is
        // turned away is blue, two stops under; inside the rosette the roots stand in the thicket's own shade, deep teal. The
        // body is held under the bloom pass (lcCap): only the glints below go over it. All of it comes in with the bulb.
        {
          float inRose0 = 1. - smoothstep(48., 74., length(vW.xy - vec2(${he[0].toFixed(1)}, ${he[1].toFixed(1)})) + vW.z*-.5);
          float litF = smoothstep(-.15, .45, dot(N, Lb));
          float occl = (1. - smoothstep(0., .55, vH))*mix(.3, 1., inRose0);
          float facet = .86 + .28*fract(vId.y*.37 + vId.x*5.3), grain = .93 + .07*sin(vH*38. + vId.x*61.);
          vec3 iceL = alb*uBulbCol*thr*(min(att*hood*2.6, 1.5)*facet*grain*(.84 + .22*smoothstep(.55, 1., vH))*(.6 + .4*clamp(dot(N, Lb), 0., 1.)));   // (a face square to the bulb is the brightest; one that the light only grazes has .6 of it)
          vec3 shadeN = mix(lcShadeTip(), lcShadeRoot(), occl)*(.75 + .5*facet*grain);
          vec3 lit = mix(shadeN, iceL, litF*(1. - occl)) + uBulbCol*thr*(att*hood*fres*.14) + soak*.5;
          col = mix(col, lcCap(lit, .9), uBulb);
        }
        vec3 rn = normalize(N + (hash33(vec3(vId.x*91.7, vId.y, 3.)) - .5)*1.2);
        float wob = .05*sin(uTime*2.5 + vId.x*40. + vId.y);
        float gB = smoothstep(.93, .998, dot(rn, Hb) + wob), gD = smoothstep(.9, .998, dot(rn, Hd) + wob);
        float tw = .75 + .25*sin(uTime*2.3 + vId.x*50.);
        // a face that flashes far off is a spark, and flashes at 6 as it always did; within 40 m of the eye it is a pane of light
        // several pixels wide, and is held at 1.4, just over the bloom's threshold (from 140 m a face is under a pixel)
        col += gcol*thr*(uBulb*att*gB*gB*mix(1.4, 6., smoothstep(40., 140., dist)));
        float inRose = 1. - smoothstep(48., 74., length(vW.xy - vec2(${he[0].toFixed(1)}, ${he[1].toFixed(1)})) + vW.z*-.5);
        col += mix(uDiodeCol, vec3(.8, 1., .95), fract(vId.x*3.1)*.75)*(dio*(gD*gD*7.*tw + (.13 + .5*pow(max(dot(N, Hd), 0.), 3.) + .2*(1. - uBulb))*mix(.12, 1., inRose)));
        vec3 Lk = vec3(-146., vW.y, uOrigin.z) - vW; Lk = Lk/max(length(Lk), 1.);
        float gK = smoothstep(.9, .998, dot(rn, normalize(Lk + V + vec3(0., 1e-3, 0.))) + wob);
        col += uWarmCol*(uDark.x*gK*gK*5.*step(.7, fract(vId.x*23.7)));
        gl_FragColor = vec4(fxApplyFog(max(col, vec3(0.))), 1.);
      }`}),h.veg=n({vertexColors:!0,side:e.DoubleSide,defines:{USE_SWAY:1},uniforms:{uTrans:{value:.6},uBloom:{value:.3}},vertexShader:Oe,fragmentShader:`
      varying vec3 vW, vN, vCol; uniform float uTrans, uBloom;
      ${xe}
      void main(){
        ${Ie}
        vec3 N = vN/max(length(vN), 1e-4); if (dot(N, V) < 0.) N = -N;
        vec3 col = lcShade(vW, N, V, vCol, 14., .14);
        float fres = pow(max(1. - abs(dot(N, V)), 0.), 2.5), back = clamp(dot(-V, Lb)*.5 + .5, 0., 1.);
        col += vCol*uBulbCol*(uBulb*att*back*back*uTrans);
        col += vec3(.7, .82, .9)*(uBulb*att*fres*uBloom) + uDiodeCol*(dio*fres*.05);
        col += vCol*uWarmCol*(uWarm*lcBar(P)*fres*.6);
        gl_FragColor = vec4(fxApplyFog(col), 1.);
      }`}),h.fly=n({vertexColors:!0,uniforms:{uTrans:{value:.25},uBloom:{value:.9}},vertexShader:Oe,fragmentShader:h.veg.fragmentShader}),h.pane=n({...Ge,vertexShader:Oe,fragmentShader:`
      varying vec3 vW, vN;
      ${xe}
      void main(){
        ${Ie}
        vec3 N = vN/max(length(vN), 1e-4);
        vec2 q = P.xy;
        float mist = fbm(vec2(q.x*.05, q.y*.028 + uTime*.045));
        float track = smoothstep(.7, .9, vnoise(vec2(q.x*.46, q.y*.011 + uTime*.018)))*smoothstep(.3, .6, vnoise(vec2(q.x*.07, 5.) + .3));
        float a = clamp(.36 + .34*mist - .34*track, .08, .85);
        a *= .55 + .45*smoothstep(0., 30., 104. - q.y) ;
        vec3 haze = uBulbCol*(uBulb*att*.5) + mix(uDarkCol*.4, uShadowCol*(1.05*uKey.y), uBulb);
        haze = mix(haze, uWarmCol*(uWarm*.75) + haze*.15, lcBar(P)*.85);
        vec3 bd = lcBeads(q/2.2, .42, uTime*.4, mpp/2.2)*(1. - smoothstep(90., 220., dist));
        float fres = pow(max(1. - abs(dot(N, V)), 0.), 3.);
        vec3 col = haze*(.55 + .6*mist)*a;
        col += (uBulbCol*(uBulb*att*1.6) + uWarmCol*(uWarm*lcBar(P)) + uDiodeCol*(dio*.8))*bd.y;
        col += uBulbCol*(uBulb*att*fres*.3) + uDiodeCol*(dio*fres*.06);
        a = clamp(a + bd.x*.2 + fres*.3, 0., 1.);
        gl_FragColor = vec4(fxFogPremult(col, a), a);
      }`}),h.jelly=n({uniforms:{uJelly:{value:new e.Color(c.jelly)},uWob:{value:new e.Vector4(.2,.15,0,0)},uSize:{value:new e.Vector2(15,14)}},vertexShader:`
      uniform vec4 uWob; uniform vec2 uSize; uniform float uTime;
      varying vec3 vW, vN; varying float vH;
      ${T.GLSL_FOG_PARS_VERT}
      void main(){
        vec3 p = position; float h = clamp(p.y/uSize.y, 0., 1.); vH = h;
        float s1 = sin(uTime*5.3)*uWob.x + uWob.z, s2 = sin(uTime*7.9 + 1.)*uWob.y + uWob.w;
        p.xz += vec2(.8, .6)*(s1*h*h*2.2);
        p.xz *= 1. + s2*.06*h; p.y *= 1. - s2*.05;
        vec4 w = modelMatrix*vec4(p, 1.); vW = w.xyz; vN = mat3(modelMatrix)*normal;
        vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
        ${T.GLSL_FOG_VERT}
      }`,fragmentShader:`
      varying vec3 vW, vN; varying float vH; uniform vec3 uJelly;
      ${xe}
      void main(){
        ${Ie}
        vec3 N = vN/max(length(vN), 1e-4);
        float ndv = abs(dot(N, V)), fres = pow(max(1. - ndv, 0.), 3.), back = clamp(dot(-V, Lb)*.5 + .5, 0., 1.);
        vec3 j = max(uJelly, vec3(1e-3));
        vec3 body = mix(j, j*j*j*.7, ndv*.8);
        float bar = lcBar(P);
        vec3 E = uBulbCol*(uBulb*att*(.6 + 1.5*back*back + .5*vH)) + mix(uDarkCol*.4, uShadowCol*uKey.y, uBulb) + uWarmCol*(uWarm*bar*.9);
        vec3 col = body*E*1.3;
        col += j*uBulbCol*(uBulb*att*fres*.9) + uBulbCol*(uBulb*att*(fres*fres*.5 + pow(max(dot(N, Hb), 0.), 90.)*3.5));
        col += uDiodeCol*(dio*(pow(max(dot(N, Hd), 0.), 80.)*2.5 + fres*.08));
        col += uWarmCol*(uWarm*bar*fres*.6);
        gl_FragColor = vec4(fxApplyFog(col), 1.);
      }`}),h.ice=n({vertexShader:`
      attribute float aSeed;
      varying vec3 vW, vN, vO, vVo, vR0, vR1, vR2; varying float vSeed;
      ${T.GLSL_FOG_PARS_VERT}
      void main(){
        vO = position; vSeed = aSeed;
        mat3 m3 = mat3(modelMatrix)*mat3(instanceMatrix);
        float sc = max(length(m3[0]), 1e-4);
        vR0 = m3[0]/sc; vR1 = m3[1]/sc; vR2 = m3[2]/sc;                 // the cube's own axes in the world
        vec4 w = modelMatrix*instanceMatrix*vec4(position, 1.);
        vW = w.xyz; vN = m3*normal;
        vec3 e = cameraPosition - w.xyz;
        vVo = vec3(dot(e, vR0), dot(e, vR1), dot(e, vR2));              // toward the eye, in the cube's own space
        vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
        ${T.GLSL_FOG_VERT}
      }`,fragmentShader:`
      varying vec3 vW, vN, vO, vVo, vR0, vR1, vR2; varying float vSeed;
      ${xe}
      // where a ray from p (in or on the unit cube) along d leaves it: the distance, and n = that face's inward normal
      float lcBoxOut(vec3 p, vec3 d, out vec3 n){
        vec3 ds = vec3(abs(d.x) < 1e-4 ? 1e-4 : d.x, abs(d.y) < 1e-4 ? 1e-4 : d.y, abs(d.z) < 1e-4 ? 1e-4 : d.z);
        vec3 sg = sign(ds), t3 = (sg*.5 - p)/ds;
        float t = min(t3.x, min(t3.y, t3.z));
        n = t3.x <= t ? vec3(-sg.x, 0., 0.) : (t3.y <= t ? vec3(0., -sg.y, 0.) : vec3(0., 0., -sg.z));
        return max(t, 0.);
      }
      // the room as a block of ice sees it, by direction
      vec3 lcIceRoom(vec3 d, vec3 Pw, float att){
        float hl = max(length(d.xz), 1e-3), el = d.y/hl;
        vec3 c = mix(uDarkCol*.4, uShadowCol*uKey.y, uBulb)*(.22 + .75*smoothstep(-.7, .6, d.y));
        // the lit back of the box, and its ceiling
        c += uBulbCol*(uBulb*att*(.2*smoothstep(.1, .8, d.z)*(.5 + .5*vnoise(d.xy*5. + 2.)) + .1*smoothstep(.5, .95, d.y)));
        // the door's racks: backlit bottles, upright bands of orange, lime, cyan and milk; a second rank below
        float az = atan(d.x, -d.z + (abs(d.x) + abs(d.z) < 1e-3 ? 1e-3 : 0.));
        float face = smoothstep(.05, .5, -d.z/hl);
        float bc = az*6.5 + .35*sin(el*2.6 + az*3.), bh = hash11(floor(bc)*1.7 + 3.1), bf = abs(fract(bc) - .5);
        float rack = smoothstep(-.42, -.22, el)*(1. - smoothstep(.3, .8, el)) + .55*smoothstep(-1.7, -1.3, el)*(1. - smoothstep(-.85, -.6, el));
        vec3 liqc = bh < .36 ? vec3(1., .5, .07) : (bh < .66 ? vec3(.5, .95, .16) : (bh < .84 ? vec3(.1, .7, 1.) : vec3(.8, .9, .9)));
        // (looked at steeply from above, the lower rank is a soft pale glow, not upright bands: bands drawn by compass bearing would
        // close into a wheel round the straight-down direction)
        float steep = smoothstep(.55, 1.05, -el);
        c += mix(liqc, vec3(.72, .8, .52), steep)*uBulbCol*(uBulb*att*1.25*face*rack*mix(1. - smoothstep(.2, .44, bf), .5, steep));
        // the kitchen's bar, standing in the slot
        vec3 P = Pw - uOrigin;
        vec2 ts = vec2(-146. - P.x, -40. - P.z); ts = ts/max(length(ts), 1.);
        float bar = max(dot(d.xz/hl, ts), 0.); bar *= bar; bar *= bar; bar *= bar; bar *= bar; bar *= bar;
        c += (uWarmCol*uWarmCol*.7 + uWarmCol*.5)*(uWarm*uBar.w*bar*1.6*(1. - smoothstep(.6, 1.5, abs(el))));
        // the shelf's burning edge, below
        c += uGreenCol*uGreenCol*(uBulb*1.4*face*exp(-(el + .95)*(el + .95)*30.));
        // the bulb: a soft bloom round one hard point
        vec3 Lb = uBulbPos - Pw; Lb = Lb/max(length(Lb), 1.);
        float bd = max(dot(d, Lb), 0.), b2 = bd*bd, b8 = b2*b2*b2*b2, b64 = b8*b8*b8*b8*b8*b8*b8*b8;
        c += uBulbCol*(uBulb*att*(.5*b8*b8 + 14.*b64*b64*b64*b64));
        return c;
      }
      void main(){
        ${Ie}
        vec3 N = vN/max(length(vN), 1e-4);
        vec3 No = vec3(dot(N, vR0), dot(N, vR1), dot(N, vR2));
        vec3 Vo = vVo/max(length(vVo), 1e-4);
        // no face is optically flat: slow swells, melted smooth
        vec3 wq = vO*3.1 + vSeed*13.;
        vec3 Nb = normalize(No + (vec3(vnoise(wq), vnoise(wq + 5.7), vnoise(wq + 11.3)) - .5)*.16);
        float ndv = max(dot(Nb, Vo), 0.), f1 = 1. - ndv, fr = .03 + .97*f1*f1*f1*f1*f1;
        vec3 T = refract(-Vo, Nb, 1./1.31);
        T = dot(T, T) < 1e-6 ? -Vo : T;
        vec3 n1; float t1 = lcBoxOut(vO, T, n1);
        vec3 p1 = vO + T*t1;
        // the milky heart: a soft white cloud in the middle of the block, a little off centre and lobed, with a few fine bubbles in it
        vec3 hc = (vec3(fract(vSeed*7.3), fract(vSeed*13.7), fract(vSeed*29.1)) - .5)*.12;
        float cloud = 0., spark = 0.;
        for (int i = 0; i < 6; i++) {
          vec3 q = vO + T*(t1*(float(i) + .5)/6.) - hc;
          float r = length(q);
          cloud += 1. - smoothstep(.1, .3 + .1*vnoise(q*4. + vSeed*17.), r);
          spark += smoothstep(.86, .95, vnoise(q*21. + vSeed*3.))*(1. - smoothstep(.12, .3, r));
        }
        cloud = 1. - exp(-cloud*t1*.75);
        // two fine cracks through the heart: ragged white veils, each met once by the ray where it crosses the crack's plane
        vec3 k1 = normalize(vec3(.62, .31, -.72) + (vec3(fract(vSeed*3.7), fract(vSeed*9.1), fract(vSeed*17.3)) - .5)), k2 = normalize(vec3(-.4, .82, .41) + (vec3(fract(vSeed*23.9), fract(vSeed*5.9), fract(vSeed*41.3)) - .5));
        float d1 = dot(T, k1), d2 = dot(T, k2);
        float tk1 = (.04 - dot(vO, k1))/(abs(d1) < 1e-3 ? 1e-3 : d1), tk2 = (-.05 - dot(vO, k2))/(abs(d2) < 1e-3 ? 1e-3 : d2);
        vec3 qk1 = vO + T*tk1 - hc, qk2 = vO + T*tk2 - hc;
        float veil = step(0., tk1)*step(tk1, t1)*smoothstep(.42, .7, vnoise(qk1*5. + vSeed*29.))*(1. - smoothstep(.2, .46, length(qk1)))
                   + step(0., tk2)*step(tk2, t1)*smoothstep(.42, .7, vnoise(qk2*5. + vSeed*7.))*(1. - smoothstep(.2, .46, length(qk2)));
        // out through the far face, bent again; past the critical angle it glances off that face and leaves by the next
        vec3 wq1 = p1*2.7 + vSeed*7.;
        vec3 n1b = normalize(n1 + (vec3(vnoise(wq1 + 3.), vnoise(wq1 + 9.), vnoise(wq1 + 15.)) - .5)*.22);
        vec3 T2 = refract(T, n1b, 1.31);
        float pathLen = t1;
        vec3 a1 = abs(p1); float farEdge = smoothstep(.38, .49, a1.x + a1.y + a1.z - max(a1.x, max(a1.y, a1.z)) - min(a1.x, min(a1.y, a1.z)));
        if (dot(T2, T2) < 1e-6) {
          vec3 Tr = reflect(T, n1), n2; float t2 = lcBoxOut(p1, Tr, n2);
          T2 = refract(Tr, n2, 1.31); T2 = dot(T2, T2) < 1e-6 ? reflect(Tr, n2) : T2;
          pathLen += t2;
        }
        vec3 dW = vR0*T2.x + vR1*T2.y + vR2*T2.z; dW = dW/max(length(dW), 1e-4);
        // what lies beyond, bent and blue: ice takes the red out of what comes through it, the more the further it has come, and
        // scatters a little of the bulb's cold light on the way. Each block has a blue of its own, so one stands off the next
        vec3 tint = mix(vec3(.5, .8, 1.), vec3(.74, .94, 1.), fract(vSeed*5.3));
        vec3 through_ = lcIceRoom(dW, vW, att)*exp(-pathLen*vec3(.85, .3, .14))*tint*1.25
                      + uBulbCol*vec3(.2, .46, .74)*(uBulb*(.14 + .36*att)*(1. - exp(-pathLen*.9)));
        vec3 Nw = vR0*Nb.x + vR1*Nb.y + vR2*Nb.z; Nw = Nw/max(length(Nw), 1e-4);
        vec3 shade = mix(uDarkCol*.4, uShadowCol*uKey.y, uBulb);
        vec3 heart = uBulbCol*vec3(.9, .96, 1.)*(uBulb*(.3 + .7*att)*(.84 + .2*clamp(Nw.y, 0., 1.))) + shade*1.1 + uWarmCol*(uWarm*uBar.w*.1);
        vec3 col = mix(through_, heart, clamp(cloud*.92 + veil*.5*(1. - cloud), 0., 1.)) + uBulbCol*(uBulb*att*spark*.25);
        // the wet skin mirrors the room, most at a glancing angle
        col = mix(col, lcIceRoom(reflect(-V, Nw), vW, att)*1.1 + uBulbCol*(uBulb*att*.12), fr);
        // edges. Just inside each edge the light is turned back into the block: a darker, bluer line. The edge itself gathers light:
        // white where it is turned to the bulb, a thin cold line where it is not. The far edges show through the body as pale lines
        vec3 ao = abs(vO); float mid = ao.x + ao.y + ao.z - max(ao.x, max(ao.y, ao.z)) - min(ao.x, min(ao.y, ao.z));
        float bevel = smoothstep(.43, .475, mid), inner = smoothstep(.25, .42, mid)*(1. - bevel);
        col *= vec3(1.) - inner*vec3(.3, .19, .12)*(1. - cloud*.5);
        float toBulb = smoothstep(-.15, .6, dot(Nw, Lb)), back = clamp(dot(-V, Lb)*.5 + .5, 0., 1.);
        float kf = clamp(dot(Nw, LC_KITCHEN)*.8 + .3, 0., 1.)*min(uWarm*uBar.w, 1.);                 // the edges turned to the slot take the kitchen's colour
        col += uBulbCol*(uBulb*att*(bevel*(.16 + 1.5*toBulb + .5*back*toBulb)*(1. - .8*kf) + farEdge*(1. - cloud)*(1. - bevel)*.2));
        col += (uWarmCol*uWarmCol*.7 + uWarmCol*.4)*(uWarm*uBar.w*(bevel*(.1 + 1.6*kf) + .4*fr));
        // a few frost needles on one face (the block's own top): fine white strokes growing in from one corner, a quarter fan of
        // about six, each 11 cm wide at its root (.012 of the 9 m block) and tapering to nothing a fifth to two thirds of the way across
        vec2 fqn = vO.xz + .47; float fln = max(length(fqn), 1e-3), fan = atan(fqn.y, fqn.x + (abs(fqn.x) + abs(fqn.y) < 1e-4 ? 1e-3 : 0.));
        float cn = fan*7. + floor(vSeed*11.), hn = hash11(floor(cn)*1.9 + floor(vSeed*97.)), reachN = .2 + .5*hn, wn = min(.012*7./fln, .3)*max(1. - fln/reachN, 0.), aaN = clamp(mpp*.78/fln, 1e-3, .5);   // 7 places to a radian; .78 = 7/9, a pixel in those places on a 9 m block
        float needles = (1. - smoothstep(wn - aaN, wn + aaN, abs(fract(cn) - .5)))*step(fln, reachN)*step(.4, hn)*smoothstep(.8, .95, No.y)*smoothstep(.03, .09, fln)*(1. - smoothstep(.25, .6, aaN));
        col = mix(col, uBulbCol*(uBulb*(.4 + .6*att)*1.05) + shade, needles*.75);
        // one hard highlight, and the wet film's small glints along the rims
        float nh = max(dot(Nw, Hb), 0.), nh2 = nh*nh, nh8 = nh2*nh2*nh2*nh2, nh64 = nh8*nh8*nh8*nh8*nh8*nh8*nh8*nh8;
        col += uBulbCol*(uBulb*att*(9.*nh64*nh64*nh64*nh64*nh64*nh64 + .8*bevel*toBulb*smoothstep(.9, .96, vnoise(vO*23. + V*2. + uTime*.3))));
        col += uDiodeCol*(dio*(fr*.4 + bevel*.12));
        gl_FragColor = vec4(fxApplyFog(max(col, vec3(0.))), 1.);
      }`}),h.drip=n({...mo,vertexShader:`
      attribute vec4 aD; uniform float uTime;
      varying vec2 vUv; varying vec3 vW; varying float vA;
      ${T.GLSL_FOG_PARS_VERT}
      void main(){
        float t = fract(aD.z + uTime*aD.w);
        float hang = smoothstep(0., .4, t), fall = max(t - .4, 0.)/.6;
        vec3 c = vec3(aD.x, aD.y - 1.2 - hang*.8 - fall*fall*96., ${(Ve-1.2).toFixed(1)});
        vec3 toCam = cameraPosition - c; float d = max(length(toCam), 1e-3);
        vec3 r = cross(vec3(0., 1., 0.), toCam/d); r = r/max(length(r), 1e-3);
        float wdt = max(mix(.35, 1., hang), d*.0028), hgt = wdt*(1.15 + 3.2*min(fall*3., 1.));
        vec3 p = c + r*(position.x*wdt) + vec3(0., position.y*hgt, 0.);
        vUv = position.xy*2.; vW = p; vA = (1. - smoothstep(.9, 1., t))*smoothstep(0., .08, t)*min(1., mix(.35, 1., hang)/max(d*.0028, 1e-4));
        vec4 mvPosition = viewMatrix*vec4(p, 1.); gl_Position = projectionMatrix*mvPosition;
        ${T.GLSL_FOG_VERT}
      }`,fragmentShader:`
      varying vec2 vUv; varying vec3 vW; varying float vA;
      ${xe}
      void main(){
        vec3 P = vW - uOrigin;
        float a = (1. - smoothstep(.25, 1., length(vUv)))*vA;
        float att = lcBulbAtt(length(uBulbPos - vW));
        vec3 c = uBulbCol*(uBulb*att*1.6) + uWarmCol*(uWarm*lcBar(P)*3.2) + uDiodeCol*(uDiode*(1. - uBulb)*.25);
        gl_FragColor = vec4(c*(a*(1. - fxFog())), 0.);
      }`}),h.strap=n({side:e.DoubleSide,vertexShader:`
      attribute vec3 aS, aW, aNn; uniform float uTime;
      varying vec3 vW, vNo, vS;
      ${T.GLSL_FOG_PARS_VERT}
      void main(){
        float free = smoothstep(.04, .5, aS.x);                       // held at the top, loose from there down
        vec3 p = position + aW*(free*(.16*sin(uTime*9. + aS.x*15.) + .42*sin(uTime*1.7 + aS.x*5.5))) + aNn*(free*.3*sin(uTime*2.3 + aS.x*7.));
        vS = aS; vNo = mat3(modelMatrix)*aNn;
        vec4 w = modelMatrix*vec4(p, 1.); vW = w.xyz;
        vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
        ${T.GLSL_FOG_VERT}
      }`,fragmentShader:`
      varying vec3 vW, vNo, vS;
      ${xe}
      void main(){
        ${Ie}
        vec3 n = cross(dFdx(vW), dFdy(vW)); n = n/max(length(n), 1e-9);
        if (dot(n, V) < 0.) n = -n;
        vec3 ns = vNo/max(length(vNo), 1e-3); if (dot(ns, V) < 0.) ns = -ns;
        n = normalize(n*.6 + ns);
        float fc = -cos((vS.y*.5 + .5)*25.1327);                      // 1 on each of the four ridges, -1 in the folds between (as the strip is built)
        float fold = mix(.6, .42 + .58*smoothstep(-1., 1., fc), vS.z);
        vec3 alb = vec3(.44, .48, .5)*fold*(.9 + .1*sin(vS.x*61. + vS.y*9.));
        vec3 col = lcShade(vW, n, V, alb, 14., .16);
        float fres = pow(max(1. - abs(dot(n, V)), 0.), 3.);
        // the box's own light on the rubber (the bulb is hooded from the door's side, so this is bounce off the white walls)
        col += alb*uBulbCol*(uBulb*(.07 + .26*att)*(.55 + .45*fold)) + uBulbCol*(uBulb*.1*fres);
        float ridge = smoothstep(.1, 1., fc)*vS.z; ridge *= ridge;
        float bar = min(lcBar(P) + .5*lcOutside(P) + .35*uBar.w, 1.);
        col += uBulbCol*(uBulb*(.25 + .6*att)*ridge*.5) + uWarmCol*(uWarm*bar*(ridge*.3 + fres*.5));
        gl_FragColor = vec4(fxApplyFog(max(col, vec3(0.))), 1.);
      }`}),h.mist=n({...Ge,uniforms:{uBreath:{value:0},uMistAmt:{value:c.fogAmt}},vertexShader:`
      attribute vec4 aC, aR; uniform vec3 uFalls; uniform float uTime, uBreath, uMistAmt, uBulb;
      varying vec2 vUv; varying vec3 vW; varying vec3 vP; varying float vUp;
      ${T.GLSL_FOG_PARS_VERT}
      void main(){
        float ph = aR.x*6.2832, kind = aR.w;
        vec3 c = aC.xyz + vec3(sin(uTime*.21 + ph), .35*sin(uTime*.33 + ph*1.7), .6*cos(uTime*.17 + ph*.6))*aR.y;
        float amt = kind < .5 ? uFalls.x : (kind < 1.5 ? uFalls.y : (kind < 3.5 ? uFalls.z : 1.));
        amt = kind > 3.5 ? 1. : smoothstep(.5, 1., amt);
        if (kind > 4.5) { amt = uBreath; c.x += uBreath*26.*(.4 + aR.x); }
        if (kind > 5.5) {
          // the river: along the canyon floor, humping up through the foot of the slot under the portal, then out and down
          float tt = fract(aR.x + uTime*.03), k = 1. - tt;
          c = k*k*k*vec3(-6., 15., -212.) + 3.*k*k*tt*vec3(-98., 27., -224.) + 3.*k*tt*tt*vec3(-160., 96., -262.) + tt*tt*tt*vec3(-236., -30., -322.)
            + aC.xyz*(1. - .4*tt) + vec3(sin(uTime*.21 + ph), .35*sin(uTime*.33 + ph*1.7), .6*cos(uTime*.17 + ph*.6))*aR.y;
          amt = smoothstep(.5, 1., uFalls.z)*smoothstep(0., .1, tt)*(1. - smoothstep(.8, 1., tt));
        }
        if (kind > 6.5) {
          // cold rolling off the ice: it gathers behind the tray's rail, creeps over it and sinks down its front to the shelf
          float tt = fract(aR.x + uTime*(.035 + .012*aR.y)), over = smoothstep(.3, .66, tt);
          c = aC.xyz + vec3(sin(uTime*.21 + ph)*aR.y, .9*sin(tt*3.1416) - 12.*over*over, -2.5 + 14.*tt);
          amt = uBulb*smoothstep(0., .14, tt)*(1. - smoothstep(.72, 1., tt));
        }
        vec4 mvPosition = viewMatrix*modelMatrix*vec4(c, 1.);
        float rot = aR.x*6.2832 + uTime*.12*(aR.z - .5), size = aC.w*(1. + .12*sin(uTime*.4 + ph*2.));
        vec2 q = mat2(cos(rot), sin(rot), -sin(rot), cos(rot))*position.xy*size;
        vUp = q.y/max(size*.5, 1e-3);
        float a = amt*uMistAmt*aR.z*mix(smoothstep(14., 70., -mvPosition.z), smoothstep(6., 22., -mvPosition.z), step(6.5, kind));
        vW = (modelMatrix*vec4(c, 1.)).xyz + vec3(q, 0.)*mat3(viewMatrix);
        mvPosition.xy += q;
        vUv = position.xy*2.; vP = vec3(a, aR.x, kind);
        gl_Position = a < .003 ? vec4(2., 2., 2., 1.) : projectionMatrix*mvPosition;
        ${T.GLSL_FOG_VERT}
      }`,fragmentShader:`
      varying vec2 vUv; varying vec3 vW; varying vec3 vP; varying float vUp;
      ${xe}${To}
      void main(){
        vec3 P = vW - uOrigin;
        float r = length(vUv);
        float n = fbmLo(vUv*1.4 + vP.y*23. + vec2(0., uTime*.085));
        float d = (1. - r*r)*(.3 + 1.3*n) - .22 - .16*vnoise(vUv*4.6 + vP.y*51. - vec2(0., uTime*.15));
        float a = smoothstep(0., .95, d)*vP.x;
        // the fog that creeps on the top shelf (kind 4) lies low on its bare glass: full to 5 m above it (the glass is at y ${de[0]}),
        // gone by 18 m, the shoulders of the lowest jars. Back from the lip (z ${Ve}) and short of the ice trays, which stand from
        // x 55 and carry their own cold higher
        a *= 1. - step(3.5, vP.z)*step(vP.z, 4.5)*smoothstep(${(Ve-2).toFixed(1)}, ${(Ve+4).toFixed(1)}, vW.z)*(1. - smoothstep(40., 52., vW.x))*smoothstep(5., 18., vW.y - ${de[0].toFixed(1)});
        float att = lcBulbAtt(length(uBulbPos - vW));
        // lit from above: a bright crown and a teal underside give each billow its roundness
        float crown = smoothstep(-.75, .65, vUp + (n - .5)*.9);
        vec3 c = uBulbCol*(uBulb*(.42 + .58*att)*mix(.46, 1.14, crown))*mix(vec3(.58, .86, 1.), vec3(1.), n*crown);
        c += mix(uDarkCol, uShadowCol*(1.1*uKey.y), uBulb)*.7;
        #ifdef USE_FOG
          c += (fogColor*1.2 + uDiodeCol*(uDiode*.02*crown))*(1. - uBulb);                         // before the bulb mist is a shade paler than the air it hangs in
        #endif
        c = mix(c, uWarmCol*(uWarm*.85)*mix(.32, 1.1, crown) + c*mix(.55, .1, crown), lcBar(P)*.9*mix(.5, 1., crown));   // gold on the crowns, the undersides stay teal
        c *= .8 + .28*n;
        // at the foot of the slot (lcFoot in the hero) every billow shows its lobes, turning over as the river leaves: thin in the
        // creases, the crowns cold where the bulb reaches them, gold below where the bar crosses. (Not the cat's breath, kind 5.)
        float foot = lcFoot(P)*(1. - step(4.5, vP.z)*step(vP.z, 5.5)), roll = lcRoll(vUv*1.5 + vP.y*37., uTime);
        a *= mix(1., .66 + .48*roll, foot);
        c = mix(c*mix(1., .7 + .42*roll, foot), uBulbCol*vec3(.8, .93, 1.)*(uBulb*(.42 + .5*att)), foot*.3*roll*roll*smoothstep(.2, .9, crown));
        gl_FragColor = vec4(fxFogPremult(max(c, vec3(0.))*a, a), a);
      }`}),h.caustic=n({...Ge,side:e.DoubleSide,vertexShader:`
      attribute vec4 aJ, aK; uniform vec3 uBulbPos;
      varying vec2 vUv, vC; varying vec3 vW, vLiq;
      ${T.GLSL_FOG_PARS_VERT}
      void main(){
        vec2 dir = aJ.xy - uBulbPos.xz; float dl = max(length(dir), 1.); dir /= dl;
        float len = clamp(aK.w*dl/max(uBulbPos.y - aJ.w - aK.w*.6, 20.), aJ.z*1.5, 150.);
        float s = mix(-aJ.z*1.6, len, position.x + .5), tWide = position.y*2.*aJ.z*mix(1.6, 1.6, position.x + .5);
        vec3 p = vec3(aJ.x + dir.x*s - dir.y*tWide, aJ.w + .14, aJ.y + dir.y*s + dir.x*tWide);
        vUv = vec2((s + aJ.z*1.1)/max(len + aJ.z*1.1, 1.), position.y*2.*1.28); vLiq = aK.rgb; vC = (p.xz - aJ.xy)/max(aJ.z, 1.);
        vec4 w = modelMatrix*vec4(p, 1.); vW = w.xyz;
        vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
        ${T.GLSL_FOG_VERT}
      }`,fragmentShader:`
      varying vec2 vUv, vC; varying vec3 vW, vLiq;
      ${xe}
      void main(){
        float inside = step(abs(vW.x), 147.)*step(${Ve.toFixed(1)}, vW.z)*step(vW.z, -1.);
        float b = abs(vUv.y), a0 = vUv.x;
        float sh = (1. - smoothstep(.55, 1., b))*smoothstep(0., .06, a0)*(1. - smoothstep(.45, 1., a0));
        // where the jar meets the glass: a soft dark ring all round its foot
        float cd = length(vC), contact = (1. - smoothstep(.85, 1.5, cd))*smoothstep(.5, .8, cd);
        // a ring of water where the cold glass has stood, broken here and there, catching the light
        float wet = (1. - smoothstep(.03, .1, abs(cd - 1.34 - .06*vnoise(vC*2.3 + vLiq.rg*9.))))*smoothstep(.3, .55, vnoise(vC*1.1 + vLiq.gb*7.));
        float ripple = .45 + .75*vnoise(vec2(a0*12. - uTime*.5, vUv.y*4. + uTime*.2));
        float ca = exp(-b*b*9.)*smoothstep(.08, .24, a0)*(1. - smoothstep(.3, .95, a0))*ripple;
        float pool = exp(-b*b*2.6)*smoothstep(.05, .2, a0)*(1. - smoothstep(.5, 1., a0))*(.7 + .3*ripple);
        float att = lcBulbAtt(length(uBulbPos - vW));
        vec3 lq = max(vLiq, vec3(.02)); lq = lq*lq/max(max(lq.r, max(lq.g, lq.b)), .05);      // the liquid's colour, deepened
        vec3 c = lq*uBulbCol*(uBulb*att*(ca*4.2 + pool*1.7)*(1. + .9*uDark.y)) + uBulbCol*(uBulb*att*(ca*ca*.6 + wet*.55)) + uShadowCol*lq*(uBulb*sh*.5);
        float al = max(max(sh*(.6 + .3*uDark.y), contact*.84), max(pool*.5, wet*.3))*uBulb*inside;
        gl_FragColor = vec4(fxFogPremult(max(c, vec3(0.))*inside, al), al);
      }`}),h.refl=n({...Ge,vertexShader:`
      attribute vec4 aJ, aK, aM;
      varying vec2 vQ; varying vec3 vW; varying vec4 vJ, vLiq, vM;
      ${T.GLSL_FOG_PARS_VERT}
      void main(){
        vec2 toCam = cameraPosition.xz - aJ.xy; float D = max(length(toCam), 1.); vec2 dir = toCam/D;
        float c = cameraPosition.y - aJ.w, H = aK.w;
        float len = min(D*H/max(c + H, 1.), max(D - 3., 0.));          // where the jar's top is mirrored
        float s = position.y + .5; vec2 sd = vec2(-dir.y, dir.x);
        vec2 xz = aJ.xy + dir*(s*len) + sd*(position.x*2.4*aJ.z);
        vQ = vec2(position.x*2.4, s*len);
        vJ = vec4(D, c, H, aJ.z); vLiq = vec4(aK.rgb, smoothstep(5., 24., c)); vM = aM;
        vec4 w = modelMatrix*vec4(xz.x, aJ.w + .1, xz.y, 1.); vW = w.xyz;
        vec4 mvPosition = viewMatrix*w; gl_Position = vLiq.a < .003 ? vec4(2., 2., 2., 1.) : projectionMatrix*mvPosition;
        ${T.GLSL_FOG_VERT}
      }`,fragmentShader:`
      varying vec2 vQ; varying vec3 vW; varying vec4 vJ, vLiq, vM;
      ${xe}
      void main(){
        float d = vQ.y, D = vJ.x, c = max(vJ.y, .5), H = max(vJ.z, 1.);
        float hN = d*c/max(D - d, .5)/H;                                 // the height on the jar that is mirrored here
        float hc = clamp(hN, 0., 1.), shape = vM.w;
        float x = abs(vQ.x + (vnoise(vW.xz*.3) - .5)*.34*hc*(1. - .6*uDark.y));            // frost on the sheet smears the picture
        float w = shape > 1.5 ? sqrt(max(1. - hc*hc, 0.)) : mix(1., .44, smoothstep(.48, .76, hc)*step(.5, shape));
        float aa = max(fwidth(vQ.x), 1e-3)*1.5 + .05 + .14*hc;
        float inside = (1. - smoothstep(w - aa, w + aa, x))*(1. - smoothstep(.95, 1.03, hN));
        float rim = smoothstep(w - aa*2.5 - .14, w - aa*.5, x)*inside;
        float inLiq = 1. - smoothstep(vM.x - .03, vM.x + .03, hN);
        float elev = c/max(length(vec2(D, c)), 1.);                      // sine of the eye's height above the sheet
        float k = (mix(.22, .5, uBulb) + .7*pow(max(1. - elev, 0.), 2.5))*vLiq.a*mix(1., .5, hc);
        float inShelf = step(abs(vW.x), 147.)*step(${Ve.toFixed(1)}, vW.z)*step(vW.z, -1.);
        vec3 liq = max(vLiq.rgb, vec3(1e-3)); float milk = vM.y, dkn = 1. - uBulb;
        float att = lcBulbAtt(length(uBulbPos - vW))*vM.z;
        vec3 hue = lcDarkHue(liq, milk);
        vec3 lit = (liq*uBulbCol*(uBulb*att*(1.5 + .9*(1. - hc)))*inLiq + uBulbCol*(uBulb*att*(.12*(1. - inLiq) + .9*rim)))*(1. + .8*uDark.y);
        vec3 dark = hue*(dkn*uDark.z*(.05 + .1*(1. - hc)))*inLiq + mix(uDiodeCol, hue, .7)*(dkn*uDiode*.36*rim);
        float ripple = .7 + .3*vnoise(vec2(vW.x*.8 + vW.z*.3, vW.z*.8));
        float m = k*inside*inShelf;
        vec3 col = (lit + dark)*(m*ripple);
        float a = m*.55*(.2 + .8*uBulb);
        gl_FragColor = vec4(fxFogPremult(max(col, vec3(0.)), a), a);
      }`}),h}function Oo(r,c){const p=h=>new e.ShaderMaterial({...h,uniforms:{...T.fogUniforms(),...r,...h.uniforms||{}}}),n={};return n.kitchen=p({...Ge,fog:!1,side:e.DoubleSide,uniforms:{uLook:{value:c.index}},vertexShader:`
      attribute vec3 aL; varying vec3 vL, vKw;
      void main(){ vL = aL; vec4 w = modelMatrix*vec4(position, 1.); vKw = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`
      varying vec3 vL, vKw; uniform float uLook;
      ${T.GLSL_HASH}${T.GLSL_VALUE_NOISE}${T.GLSL_FBM}${mt}
      float sq(float x){ return x*x; }
      // the shadow of a leafy twig: one cell holds a stem with five leaves set left and right along it, all swaying together
      float lcTwig(vec2 p, float sw){
        vec2 id = floor(p), f = fract(p) - .5; float h = hash12(id + 3.7), h2 = hash12(id*1.7 + 9.1);
        float ang = (h - .5)*2.4 + sw*(.6 + .8*h2);
        float c = cos(ang), s = sin(ang); vec2 q = vec2(c*f.x + s*f.y, -s*f.x + c*f.y);
        float sh = (1. - smoothstep(.006, .034, abs(q.y + .05*sin(q.x*5. + h*9.))))*(1. - smoothstep(.36, .44, abs(q.x)));
        for (int i = 0; i < 5; i++) {
          float fi = float(i), sd = mod(fi, 2.)*2. - 1., la = sd*(.75 + .3*h2) + sw*1.5*sd;
          vec2 lp = q - vec2(-.34 + fi*.17, 0.);
          float cl = cos(la), sl = sin(la); vec2 l = vec2(cl*lp.x + sl*lp.y, -sl*lp.x + cl*lp.y) - vec2(.125, 0.);
          sh = max(sh, 1. - smoothstep(.55, 1.2, length(l/vec2(.135, .05 + .012*fi))));
        }
        return sh*step(.22, h2);
      }
      vec3 blob(float a, float y, float ph, vec3 c){
        vec2 g = vec2(.55 + .24*sin(uTime*.17 + ph), 250. + 190.*sin(uTime*.13 + ph*1.7));
        return c*exp(-(sq((a - g.x)*7.) + sq((y - g.y)/190.)));
      }
      void main(){
        float a = vL.x, y = vL.y, layer = vL.z;
        vec3 col = vec3(0.); float al = 1.;
        float blot = fbm(vec2(a*6., y*.004) + 3.);
        float lamp = smoothstep(.36, .95, a)*(.4 + .6*smoothstep(-220., 480., y))*(1. - .5*smoothstep(520., 900., y));
        // seen from the terrace the slot looks out at the lamplit side of the kitchen (a near .5): a glowing wall, its shapes
        // only darker blurs on it. From the canyon and the exit line (a under .3) it looks at the shadowed side wall
        float band = exp(-sq((a - .53)/.13)), shady = 1. - smoothstep(.3, .5, a);
        float rise = .45 + .55*smoothstep(-420., 520., y + 90.*sin(a*23.));
        if (layer < .5) {
          float low = exp(-sq((y + 40.)/300.));
          if (uLook < .5) col = mix(mix(vec3(.11, .052, .045), vec3(.034, .04, .11), shady)*(.75 + .5*blot) + vec3(.2, .095, .04)*low*(1. - .7*shady), vec3(1.2, .6, .18)*1.05, lamp*(.65 + .55*blot)) + vec3(1.5, .7, .19)*(band*rise*(.75 + .35*blot));
          else if (uLook < 1.5) {
            // a sunlit wall: pale gold, cooler and dimmer toward the top, with the soft shadow of leaves and twigs swaying on it
            vec2 lq = vec2(a*10., y*.0042);
            float sw = .16*sin(uTime*.7 + a*9.) + .07*sin(uTime*1.3 + y*.004);
            float leaf = max(lcTwig(lq + vec2(sw*.12, 0.), sw), .8*lcTwig(lq*1.6 + vec2(4.3, 1.7) - vec2(sw*.1, 0.), -sw));
            float bough = smoothstep(.3, .55, fbm(lq*.45 + 7.));
            leaf = clamp(leaf*(.45 + .55*bough) + .3*bough*smoothstep(.45, .7, fbm(lq*1.3 + 2.)), 0., 1.);
            vec3 wallc = vec3(1.22, 1., .64)*(1. - .34*smoothstep(-100., 800., y))*(.9 + .1*lamp);
            col = mix(wallc, vec3(.4, .5, .36), .7*leaf);
          } else {
            col = vec3(.085, .05, .12)*(.75 + .5*blot) + vec3(.12, .06, .1)*low + vec3(.5, .3, .14)*(lamp*.45);
            col += blob(a, y, 0., vec3(1., .32, .5)) + blob(a, y, 2.1, vec3(1., .72, .25)) + blob(a, y, 4.2, vec3(.55, .35, 1.)) + uWarmCol*(band*rise*.6);
          }
        } else if (layer < 1.5) {
          float cup = smoothstep(.5, .535, a)*(1. - smoothstep(.72, .84, a))*(1. - smoothstep(400., 520., y));
          float inset = smoothstep(.535, .56, a)*(1. - smoothstep(.69, .77, a))*smoothstep(-170., -60., y)*(1. - smoothstep(300., 380., y));
          float win = smoothstep(.3, .38, a)*(1. - smoothstep(.485, .515, a))*smoothstep(300., 400., y)*(1. - smoothstep(690., 900., y));
          win *= 1. - .45*(1. - smoothstep(.0, .012, abs(a - .47)));                    // a glazing bar
          // a tall cupboard on the shadowed side, seen through the slot from the canyon
          float cup2 = smoothstep(.01, .13, a)*(1. - smoothstep(.15, .28, a))*(1. - smoothstep(250., 480., y));
          float inset2 = smoothstep(.06, .13, a)*(1. - smoothstep(.16, .23, a))*smoothstep(-220., -40., y)*(1. - smoothstep(190., 360., y));
          cup = max(cup, cup2); inset = max(inset, inset2*.8);
          vec3 cc = uLook < .5 ? mix(vec3(.62, .34, .13), vec3(.13, .1, .24), shady)*(.5 + .35*inset) : (uLook < 1.5 ? vec3(.78, .7, .56)*(.75 + .2*inset) : vec3(.26, .14, .22)*(.6 + .4*inset));
          vec3 wc = uLook < .5 ? vec3(.035, .07, .19) : (uLook < 1.5 ? vec3(.62, .82, 1.08) : vec3(.05, .05, .2));
          wc *= .8 + .2*smoothstep(.33, .43, a);
          al = max(cup, win)*(1. - .55*band); col = mix(wc, cc*(.6 + .8*lamp), cup);
        } else {
          float top = 108. + 9.*sin(a*5.);
          al = (1. - smoothstep(top - 75., top + 75., y))*smoothstep(0., .17, a)*(1. - .5*band);
          vec3 edge = (uLook < 1.5 ? uWarmCol : vec3(.8, .5, .7))*exp(-sq((y - top + 8.)/62.))*(.3 + .5*lamp)*(1. - .8*shady);
          float doors = .8 + .2*smoothstep(.02, .32, abs(fract(a*11.) - .5))*smoothstep(0., 170., top - y);
          col = (uLook > .5 && uLook < 1.5 ? vec3(.2, .22, .24) : (uLook < .5 ? mix(vec3(.075, .04, .032), vec3(.03, .032, .075), shady) : vec3(.055, .034, .07)))*doors + edge;
        }
        // the slot is a source of light, not a painted wall: across it (from the cabinet's edge to the door's) the glow has a
        // hot core and falls away to both edges, and it is brightest at lamp height. Worked out along the eye's own ray,
        // so the core stays in the middle of the bar from wherever it is seen.
        vec2 sA = vec2(-150., uOrigin.z), sE = vec2(150. - 300.*cos(uDoor), uOrigin.z - 300.*sin(uDoor)), se = sE - sA;
        vec2 rr = vKw.xz - cameraPosition.xz, ac = sA - cameraPosition.xz;
        float den = rr.x*se.y - rr.y*se.x; den = abs(den) < 1e-3 ? 1e-3 : den;
        float sp = clamp((ac.x*rr.y - ac.y*rr.x)/den, 0., 1.);
        float prof = sin(sp*3.14159); prof = prof*sqrt(max(prof, 0.));
        float ty = clamp((ac.x*se.y - ac.y*se.x)/den, 0., 1.), ySlot = cameraPosition.y + (vKw.y - cameraPosition.y)*ty;     // the height at which this ray leaves the box
        float vert = .3 + .7*exp(-sq((ySlot - 300.)/170.));
        float inBox = smoothstep(-6., 16., cameraPosition.z - uOrigin.z);                              // from outside (the last metres) there is no slot to look through
        float gk = uLook < .5 ? .85 : (uLook < 1.5 ? .4 : .7);
        col = mix(col, col*mix(.3, 1.05, prof)*mix(.55, 1.1, vert) + uWarmCol*uWarmCol*(prof*prof*vert*gk), inBox);
        al = mix(al, max(al, prof*prof*vert*.85), inBox);
        al *= uBar.w;
        gl_FragColor = vec4(col*al, al);
      }`}),n.cat=p({...Ge,fog:!0,side:e.DoubleSide,uniforms:{uCat:{value:new e.Vector4(0,1,1.2,0)}},vertexShader:`
      varying vec2 vUv;
      ${T.GLSL_FOG_PARS_VERT}
      void main(){ vUv = position.xy; vec4 mvPosition = viewMatrix*modelMatrix*vec4(position, 1.); gl_Position = projectionMatrix*mvPosition; ${T.GLSL_FOG_VERT} }`,fragmentShader:`
      varying vec2 vUv; uniform vec4 uCat;
      ${T.GLSL_HASH}${T.GLSL_VALUE_NOISE}${T.GLSL_FBM}${mt}${T.GLSL_FOG_PARS_FRAG}
      float lcEar(vec2 e){ return max(abs(e.x)*1.3 + e.y*.62 - 9.5, -e.y - 14.)/16.; }
      float lcSmin(float a, float b, float k){ float h = clamp(.5 + .5*(b - a)/k, 0., 1.); return mix(b, a, h) - k*h*(1. - h); }
      void main(){
        vec2 p = vUv, hc = vec2(8., -5.);
        float head = length((p - hc)/vec2(30., 26.)) - 1.;
        float ears = min(lcEar(p - (hc + vec2(-17., 27.))), lcEar(p - (hc + vec2(17., 28.))));
        float body = length((p - (hc + vec2(6., -76.)))/vec2(40., 50.)) - 1.;
        float d = lcSmin(lcSmin(head, ears, .28), body, .3);
        d += (fbm(p*.11) - .5)*.09 + (vnoise(p*.9) - .5)*.035;                // fur: a soft, broken edge
        float inside = 1. - smoothstep(-.04, .04, d);
        vec2 up = (p - hc)/max(length(p - hc), 1e-3);
        float upness = smoothstep(-.75, .25, up.y);
        float rim = exp(-abs(d + .03)*7.)*upness;
        float soak = exp(-max(-d, 0.)*3.2)*upness;                             // moonlight soaking a little way into the fur
        vec3 col = (vec3(.006, .007, .012) + vec3(.06, .09, .17)*soak)*inside + vec3(.5, .66, .95)*(rim*.95);
        float r = length(p)/11.;
        float ang = atan(p.y, p.x + (abs(p.x) + abs(p.y) < 1e-3 ? 1e-3 : 0.));
        float iris = 1. - smoothstep(.93, 1.03, r);
        vec3 ic = mix(vec3(1., .74, .1), vec3(.2, .86, .3), smoothstep(.2, .95, r))*(.72 + .28*vnoise(vec2(ang*9., r*3.)));
        float pw = mix(.08, .52, uCat.y);
        float pupil = 1. - smoothstep(1., 1.3, length(vec2(p.x/(11.*pw), p.y/(11.*.88))));
        ic *= 1. - pupil;
        ic *= 1. - .65*smoothstep(.78, 1., r);
        ic += vec3(1., 1., .92)*((1. - smoothstep(0., .13, length(p/11. - vec2(-.3, .36))))*.9);
        float lids = 1. - smoothstep(uCat.z, uCat.z + .14, abs(p.y)/11.);
        col = mix(col, ic*(.5 + .75*uBulb), iris*lids*inside);
        float al = clamp(max(inside, rim*.8), 0., 1.)*uCat.x*smoothstep(-112., -48., p.y);
        // out in the kitchen air, not in the box's haze: only a third of the fog, so the head stays a dark shape
        vec3 fogged = fxFogPremult(col*uCat.x, al);
        gl_FragColor = vec4(max(mix(col*uCat.x, fogged, .3), 0.), al);
      }`}),n.lamp=h=>p({fog:!0,uniforms:{uCol:{value:new e.Color(h)},uLevel:{value:0}},vertexShader:Oe,fragmentShader:`
      varying vec3 vW, vN; uniform vec3 uCol; uniform float uLevel;
      ${T.GLSL_FOG_PARS_FRAG}
      void main(){
        vec3 V = normalize(cameraPosition - vW); float ndv = abs(dot(vN/max(length(vN), 1e-4), V));
        gl_FragColor = vec4(fxApplyFog(uCol*(uLevel*(.45 + .55*ndv*ndv)) + uCol*.004), 1.);
      }`}),n.barGlow=p({...mo,fog:!1,depthTest:!1,uniforms:{uGlow:{value:0}},vertexShader:`
      uniform float uDoor; uniform vec3 uOrigin;
      varying vec2 vQ; varying float vY;
      void main(){
        vec2 E = vec2(150. - 300.*cos(uDoor), uOrigin.z - 300.*sin(uDoor));
        vec3 c = vec3((E.x - 150.)*.5, position.y, (E.y + uOrigin.z)*.5);
        vec2 toCam = cameraPosition.xz - c.xz; float d = max(length(toCam), 1e-3);
        vec3 p = c + vec3(-toCam.y, 0., toCam.x)/d*(position.x*110.);
        vQ = vec2(position.x*2., d); vY = position.y;
        gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.);
      }`,fragmentShader:`
      varying vec2 vQ; varying float vY; uniform float uGlow;
      ${T.GLSL_HASH}${T.GLSL_VALUE_NOISE}${mt}
      void main(){
        float g = exp(-vQ.x*vQ.x*9.) + .35*exp(-vQ.x*vQ.x*2.2);
        float open = smoothstep(uBar.y - 16., uBar.y + 12., vY);
        float vert = smoothstep(2., 46., vY)*(1. - smoothstep(372., 418., vY));
        float drift = .78 + .22*vnoise(vec2(vQ.x*2.3, vY*.012 - uTime*.05));
        float a = g*(.2 + .8*open)*vert*drift*uBar.w*uWarm*uGlow*smoothstep(60., 170., vQ.y);
        gl_FragColor = vec4((uWarmCol*uWarmCol*.5 + uWarmCol*.2)*(a*1.7), 0.);
      }`}),n.wing=p({...Ge,fog:!0,vertexColors:!0,side:e.DoubleSide,vertexShader:Oe,fragmentShader:`
      varying vec3 vW, vCol;
      ${xe}
      void main(){
        vec3 P = vW - uOrigin; float att = lcBulbAtt(length(uBulbPos - vW));
        float beat = .5 + .5*sin(uTime*19. + vCol.g*6.2832), edge = vCol.r*vCol.r;
        float a = (.2 + .55*edge)*(.7 + .3*beat);
        vec3 light = uBulbCol*(uBulb*(.4 + .6*att)) + uDiodeCol*(uDiode*(1. - uBulb)*.3) + uWarmCol*(uWarm*lcBar(P)*.6) + mix(uDarkCol, uShadowCol*uKey.y, uBulb);
        vec3 c = light*mix(vec3(.4, .52, .6), vec3(1.05, 1.12, 1.18), edge);
        gl_FragColor = vec4(fxFogPremult(c*a, a), a);
      }`}),n}const le=new e.Color(.76,.81,.84),gt=new e.Color(.72,.79,.83),De=new e.Color(.62,.7,.74),po=new e.Color(.5,.7,.8),Do=new e.Color(.2,.4,.5),$o=new e.Color(.02,.03,.035),bo=new e.Color(.2,.3,.34),O=j;function Ye(r,c,p){const n=[150-Math.abs(r),Math.min(c,420-c),Math.min(-p,240+p)].sort((h,o)=>h-o);return .46+.54*O(0,52,n[1])}function fe(r,c,p,n,h=0,o=0,m=0){return o&&r.rotateX(o),m&&r.rotateZ(m),h&&r.rotateY(h),r.translate(c,p,n),r}function wt(r){const c=r.map(n=>n.index?n.toNonIndexed():n),p=eo(c,!1);for(const n of r)n.dispose();for(const n of c)n.dispose();return p}async function go(r,c){const p=[];for(let h=0;h<c.length;h++){const o=c[h];p.push(o.index?o.toNonIndexed():o),(h&7)===7&&await r.yield()}await r.yield();const n=eo(p,!1);for(const h of c)h.dispose();for(const h of p)h.dispose();return n}async function Ko(r,c){const p=[],n=(f,t,s=0,l=null)=>(p.push(Gt(f,t,s,l)),f),h=(f,t,s,l)=>new e.PlaneGeometry(f,t,s,l);n(fe(h(240,420,16,28),150,210,-120,-Math.PI/2),le,0,Ye),n(fe(h(300,240,20,16),0,420,-120,0,Math.PI/2),le,0,Ye),n(fe(h(300,240,12,10),0,0,-120,0,-Math.PI/2),gt,4,(f,t,s)=>.6*Ye(f,t,s)),await r.yield();for(const f of[-1,1]){for(let t=28;t<410;t+=26)de.some(s=>Math.abs(t-(s-7))<12)||n(U(f*147.7,t,-112,4.6,3.4,218,1.5,1),le,0,(s,l,u)=>Ye(s,l,u)*(l<t?.62:1)*(f<0?.3+.7*O(196,336,l):1));for(const t of de)n(U(f*146.2,t-7.5,-94,7.6,6.4,178,2.2,1),le,0,(s,l,u)=>Ye(s,l,u)*(l<t-8?.55:.95)*(f<0?.3+.7*O(196,336,l):1));await r.yield()}for(const f of[-30,-90,-150,-210])n(U(0,418.2,f,292,3.6,6,1.5,1),le,0,(t,s,l)=>Ye(t,400,l)*.9);const[o,m,B]=be;n(U(o,417.4,B,42,5.2,32,2.2,2),le,0);{const f=new e.CylinderGeometry(8.4,11,9.5,28,4,!0),t=f.attributes.position;for(let s=0;s<t.count;s++){const l=t.getX(s),u=t.getZ(s),y=Math.atan2(u,l),b=1+.07*Math.cos(y*14);t.setXYZ(s,l*b,t.getY(s),u*b)}f.computeVertexNormals(),n(fe(f,o,410.4,B),gt,0,(s,l)=>.7+.3*O(406,415,l))}for(let f=0;f<3;f++){const t=f/3*Math.PI,s=Math.cos(t)*9.6,l=Math.sin(t)*9.6;n(vt([[o-s,411,B-l],[o-s*.92,402,B-l*.92],[o-s*.5,396.6,B-l*.5],[o,395.2,B],[o+s*.5,396.6,B+l*.5],[o+s*.92,402,B+l*.92],[o+s,411,B+l]],.42,5),De,1)}await r.yield(),n(U(0,413.2,-60,56,13.6,42,3.4,2),gt,0,(f,t)=>.72+.28*O(406,418,t));{const f=new e.CylinderGeometry(8.2,8.8,3.4,30,1),t=f.attributes.position;for(let s=0;s<t.count;s++){const l=t.getX(s),u=t.getZ(s);if(Math.hypot(l,u)>4){const b=1+.045*Math.cos(Math.atan2(u,l)*15);t.setXYZ(s,l*b,t.getY(s),u*b)}}f.computeVertexNormals(),n(fe(f,-11,404.9,-60),le,0,()=>.9)}n(U(-11,403,-56.5,1.4,1,7,.4,1),De,1),n(U(Se[0],406,Se[2],7,1.4,7,.6,1),De,1);for(let f=0;f<5;f++)n(U(8+f*3.2,405.9,-47,1.3,1,9,.4,1),gt,0,()=>.6);await r.yield();const[k,M]=he;n(fe(new e.CircleGeometry(13.4,36),k,M,-.35,Math.PI),$o,4),n(fe(new e.TorusGeometry(13.8,1.5,8,44),k,M,-1.9),le,0),n(fe(new e.TorusGeometry(16.4,.7,6,44),k,M,-.5),le,0,()=>.8);for(let f=-3;f<=3;f++){const t=f*3.55,s=Math.sqrt(13.6*13.6-t*t);n(U(k,M+t,-3.1,2*s,1.15,1.5,.5,1),le,0)}n(U(k,M,-3.5,1.7,27,1.1,.5,1),le,0),n(fe(new e.CylinderGeometry(2.6,2.6,1.4,16),k,M,-4,0,Math.PI/2),De,1),await r.yield();for(const f of[-75,75]){const t=(s,l,u)=>.55+.45*O(0,60,l);n(U(f,101.4,-176,143,6,6.4,2.2,1),le,0,t),n(U(f,5.6,-176,143,6,6.4,2.2,1),le,0,t);for(const s of[-1,1])n(U(f+s*69.6,53.5,-176,5.2,92,6.4,2.2,1),le,0,t);n(U(f,88,-181,76,3.4,3.2,1.3,2),po,3);for(const s of[-1,1])n(U(f+s*34,88,-178.6,3,3,4,1,1),po,3)}n(fe(h(292,100,12,6),0,54,-122,Math.PI),new e.Color(.34,.47,.5),4,(f,t)=>.45+.55*O(0,100,t)),n(U(0,54,-150,4.6,100,56,1.6,1),le,0,(f,t)=>.5+.4*O(0,100,t)),await r.yield();const W=(f,t,s,l)=>{const u=new e.Matrix4().makeRotationY(l).setPosition(f,t,s),y=(b,x=1)=>{b.applyMatrix4(u),n(b,Do,3,()=>x)};y(U(0,.8,0,46,1.6,23,.6,1),.8);for(const b of[-1,1])y(U(0,3.6,b*11,46,7.2,1.3,.55,1)),y(U(b*22.5,3.6,0,1.3,7.2,23,.55,1));y(U(0,3.3,0,45,6.4,1.1,.5,1),.9);for(let b=-1;b<=1;b++)y(U(b*11.2,3.3,0,1.1,6.4,22,.5,1),.9);y(U(-25.2,6.4,0,4.4,1.2,9,.5,1))};for(const f of c.trays)W(f[0],f[1],f[2],f[3]),await r.yield();const V=(f,t,s,l)=>n(fe(new e.LatheGeometry([[.01,.9],[l*.82,.9],[l,2.2],[l*1.02,2],[l*.86,0],[.01,0]].map(u=>new e.Vector2(u[0],u[1])),40),f,t,s),le,0,(u,y,b)=>.6+.4*O(l*.6,l,Math.hypot(u-f,b-s)));for(const f of c.saucers)V(f[0],f[1],f[2],f[3]);if(n(U(-140.9,177,-233,1.4,7,5.5,.6,1),new e.Color(.5,.53,.55),4),c.spoon){const[f,t]=c.spoon;n(tt(f,t,.95,7),De,1),n(Ft(t[0],t[1],t[2],1.6),De,1);const s=new e.SphereGeometry(3.4,12,8);s.scale(1,1.5,.35),n(fe(s,f[0],f[1]-2,f[2]),De,1)}return go(r,p)}function Uo(){const r=[[-140.5,176,-233],[-140.3,160,-233.5],[-139.6,146,-234.5],[-138,134,-236.5],[-136.4,126,-239.5],[-136.2,120,-243],[-137.6,117,-246],[-139.6,118.5,-246.5],[-140,122.5,-244.5]],c=new e.CatmullRomCurve3(r.map(S=>new e.Vector3(S[0],S[1],S[2]+(S[0]+139)*.9)),!1,"catmullrom",.5),p=48,n=4,h=n*6,o=2.7,m=[];for(let S=0;S<=h;S++)m.push([S/h*2-1,.3+.55*(.5-.5*Math.cos(S/h*n*ue)),1]);m.push([1,-.4,0],[-1,-.4,0]);const B=m.length,k=[],M=[],W=[],V=[],f=[],t=new e.Vector3,s=new e.Vector3,l=new e.Vector3(0,0,1),u=new e.Vector3,y=new e.Vector3,b=new e.Quaternion;for(let S=0;S<=p;S++){const g=S/p;c.getPointAt(g,y),c.getTangentAt(g,t),S>0&&l.applyQuaternion(b.setFromUnitVectors(s,t)),l.addScaledVector(t,-l.dot(t)).normalize(),u.crossVectors(l,t).normalize(),s.copy(t);const z=1-.45*j(.9,1,g);for(const R of m)k.push(y.x+l.x*R[0]*o*z+u.x*R[1],y.y+l.y*R[0]*o*z+u.y*R[1],y.z+l.z*R[0]*o*z+u.z*R[1]),M.push(g,R[0],R[2]),W.push(l.x,l.y,l.z),V.push(u.x,u.y,u.z)}for(let S=0;S<p;S++)for(let g=0;g<B;g++){const z=S*B+g,R=(S+1)*B+g,H=S*B+(g+1)%B,Y=(S+1)*B+(g+1)%B;f.push(z,R,H,R,Y,H)}const x=new e.BufferGeometry;return x.setAttribute("position",new e.Float32BufferAttribute(k,3)),x.setAttribute("aS",new e.Float32BufferAttribute(M,3)),x.setAttribute("aW",new e.Float32BufferAttribute(W,3)),x.setAttribute("aNn",new e.Float32BufferAttribute(V,3)),x.setIndex(f),x.computeBoundingSphere(),x.boundingSphere.radius+=2,x}function Yo(){const r=[];for(let c=0;c<5;c++){const p=new e.PlaneGeometry(1,1,6,4),n=p.attributes.position;for(let h=0;h<n.count;h++){const o=n.getX(h)+.5,m=n.getY(h),B=2.2+o*10,k=2.4+4.2*Math.sin(Math.PI*pe(o*.8+.12,0,1)),M=.8-.4*o;n.setXYZ(h,B+.9*m*o,m*k*Math.cos(M),-m*k*Math.sin(M)+.7*(1-4*m*m)*o)}p.computeVertexNormals(),Gt(p,bo,1,(h,o)=>(.4+.95*O(-2.6,2.6,o))*(.7+.45*O(2,12,h))),p.rotateZ(c/5*ue),r.push(p)}{const c=new e.CylinderGeometry(2.4,2.4,1.6,14);c.rotateX(Math.PI/2),r.push(Gt(c,bo,1))}return wt(r)}const yt=new e.Color;function ae(r,c,p=0,n=0){const h=r.index?r.toNonIndexed():r;h!==r&&r.dispose();const o=h.attributes.position,m=o.count,B=new Float32Array(m*3),k=new Float32Array(m*2);for(let M=0;M<m;M++){const W=o.getX(M),V=o.getY(M),f=o.getZ(M);c(W,V,f,yt),B[M*3]=yt.r,B[M*3+1]=yt.g,B[M*3+2]=yt.b,k[M*2]=typeof p=="function"?p(W,V,f):p,k[M*2+1]=n+(W+f)*.07}return h.setAttribute("color",new e.BufferAttribute(B,3)),h.setAttribute("aSw",new e.BufferAttribute(k,2)),h.attributes.uv&&h.deleteAttribute("uv"),h}async function Jo(r,c,p,n){const h=[],o=async(t,s,l,u,y=0,b=0,x=0)=>{h.push(fe(t,s,l,u,y,b,x)),await r.yield()},m=(t,s,l,u=1,y=1)=>{const b=new e.SphereGeometry(t,16,11);b.scale(u,y,1);const x=p()*9;return ae(b,(S,g,z,R)=>{const H=pe(.5+.5*g/t+.35*n.n3(S*.12+x,g*.12,z*.12),0,1);R.setRGB($(s[0],l[0],H),$(s[1],l[1],H),$(s[2],l[2],H))})},B=(t,s,l,u,y,b)=>{const x=new e.PlaneGeometry(t,s,2,4),S=x.attributes.position;for(let g=0;g<S.count;g++){const z=S.getX(g),R=S.getY(g)+s/2,H=R/s;S.setXYZ(g,z*Math.sin(Math.PI*pe(H*.94+.06,0,1))*1.25,R,.09*R*R/s*4-Math.abs(z)*.25)}return x.computeVertexNormals(),ae(x,(g,z,R,H)=>{const Y=z/s;H.setRGB($(l[0],u[0],Y),$(l[1],u[1],Y),$(l[2],u[2],Y))},(g,z)=>y*(z/s)*(z/s),b)},k=(t,s,l,u)=>{const y=new e.PlaneGeometry(1,1,8,16),b=y.attributes.position;for(let x=0;x<b.count;x++){const S=b.getX(x)*2,g=b.getY(x)+.5,z=Math.pow(Math.sin(Math.PI*pe(g*.9+.07,0,1)),.75)*(1+.05*Math.sin(g*44)),R=S*z*t*.5;b.setXYZ(x,R,g*s,-.24*Math.abs(R)+.07*S*S*t+.2*g*g*s+.025*t*Math.sin(g*9+S*3))}return y.computeVertexNormals(),ae(y,(x,S,g,z)=>{const R=S/s,H=Math.abs(x)/(t*.5+1e-6),te=(1-.42*Math.max(1-O(0,.1,H),.7*O(.7,.95,Math.sin((R*4.5-H*1.3)*ue)*.5+.5)*O(.05,.2,H)))*(.82+.3*H);z.setRGB($(.09,.27,R)*te,$(.36,.76,R)*te,$(.15,.31,R)*te)},(x,S)=>l*(S/s)*(S/s),u)},M=(t,s)=>{const l=new e.IcosahedronGeometry(1,3),u=l.attributes.position,y=l.attributes.normal;for(let b=0;b<u.count;b++){const x=u.getX(b),S=u.getY(b),g=u.getZ(b),z=1+.3*n.fbm3(x*1.5+s,S*1.5,g*1.5,3)+.09*n.n3(x*4.2,S*4.2+s,g*4.2);u.setXYZ(b,x*z*t,S*z*t*.82,g*z*t),y.setXYZ(b,x,S,g)}return ae(l,(b,x,S,g)=>{const z=pe(x/(t*.82)*.5+.5,0,1),R=n.n3(b*.16+s,x*.16,S*.16)*.5+.5;g.setRGB($(.13,.5,z*R),$(.33,.74,z),$(.08,.22,R))},.22,s)};await o(M(20,1.3),-110,24,-150),await o(M(21.5,4.1),-66,26,-145),await o(M(19,7.7),-27,23,-151),await o(m(8.5,[.75,.55,.08],[1,.86,.22],1.28),-126,13,-166,.3),await o(m(8,[.7,.5,.08],[1,.84,.2],1.28),-90,12.5,-167,-.5),await o(m(7.5,[.2,.06,.2],[.5,.2,.42]),-48,12,-167),await o(m(7,[.22,.07,.22],[.52,.22,.4]),-36,11.5,-164),await o(m(7.2,[.2,.06,.2],[.48,.2,.4]),-41,23,-165);for(let t=0;t<5;t++){const s=new e.CylinderGeometry(3.1,3.8,84,10,6);await o(ae(s,(l,u,y,b)=>{const x=O(-20,30,u);b.setRGB($(.78,.2,x),$(.8,.5,x),$(.66,.14,x))}),62+p.range(-3,3),9+t%2*6.5+(t>3?6:0),-146-t*3.2+t%2*4,0,0,Math.PI/2+p.range(-.05,.05));for(let l=0;l<2;l++)await o(B(7,30,[.16,.44,.12],[.3,.62,.2],.5,t+l),104+p.range(-2,2),9+t%2*6.5,-146-t*3.2,p.range(-.4,.4),0,-Math.PI/2+p.range(-.35,.5))}for(let t=0;t<4;t++)await o(m(7.6,[.6,.06,.04],[.95,.2,.1],1,.9),22+t*14.5,11.6+t%2*1.2,-167+t%2*2.5);await o(ae(vt([[14,20,-167],[30,21.5,-166],[48,20.5,-167],[70,21,-166]],.8,5),(t,s,l,u)=>u.setRGB(.2,.42,.12)),0,0,0);{const t=new e.SphereGeometry(9,18,9,0,ue,0,Math.PI/2);await o(ae(t,(l,u,y,b)=>b.setRGB(.3,.6,.12)),104,14,-161,0,Math.PI/2+.25);const s=new e.CircleGeometry(8.8,24);await o(ae(s,(l,u,y,b)=>{const x=Math.hypot(l,u)/8.8,S=Math.atan2(u,l),g=Math.abs(Math.cos(S*4.5)),z=x>.86?.5:g<.12||x<.1?1:.72;b.setRGB(.62*z+.2,.86*z+.1,.34*z+.08)}),104,14,-161.2,Math.PI,-.25)}for(let t=0;t<46;t++){const s=p()*ue,l=p.range(0,11),u=p.range(0,34),y=p()<.5;await o(B(y?7.5:5,y?10:7.5,[.1,.36,.14],y?[.26,.66,.3]:[.34,.7,.2],p.range(.4,1.1),t),126+Math.cos(s)*l,34+u,-160+Math.sin(s)*l*.6,s,p.range(-.9,.4),p.range(-.5,.5))}for(let t=0;t<7;t++)await o(ae(tt([124+t*.8,6,-160],[122+t*1.6+p.range(-3,3),44+p.range(0,14),-160+p.range(-4,4)],.55,5),(s,l,u,y)=>y.setRGB(.18,.4,.14),(s,l)=>.3*O(6,50,l),t),0,0,0);const[W,V,f]=c.bowl;c.fruitTops=[];for(let t=0;t<12;t++){const s=t<7?0:t<11?1:2,l=[7,4,1][s],u=t-[0,7,11][s],y=u/l*ue+s*.6,b=[10.2,5.4,0][s],x=p.range(5.2,6.2),S=p()<.35,g=W+Math.cos(y)*b,z=V+6.5+s*6.6,R=f+Math.sin(y)*b;await o(S?m(x*.9,[.2,.06,.22],[.5,.22,.46],1,1.08):m(x,[.86,.3,.12],[1,.68,.34],1,.94),g,z,R,p()*ue,p.range(-.3,.3)),c.fruitTops.push([g,z+x*.95,R])}if(c.cherries){const[t,s,l]=c.cherries,u=ut(dt("lco-cherries")),y=x=>{const S=new e.SphereGeometry(x,14,10),g=u()*9;return ae(S,(z,R,H,Y)=>{const te=R/x,D=.5+.5*n.n3(z*.2+g,R*.2,H*.2),ze=O(.9,.985,(z*.42+R*.8-H*.42)/x),ne=$(.42,1,O(-.8,.7,te))*(.8+.3*D);Y.setRGB($(.38*ne,1.5,ze),$(.006*ne,1.3,ze)+.008*D*ne,$(.03*ne,1.3,ze))})},b=[[9,12.2,0],[6,6.4,5.6],[3,2.6,10.6]];for(const[x,S,g]of b)for(let z=0;z<x;z++){const R=z/x*ue+g*.4+u.range(-.12,.12),H=u.range(4.5,5.3),Y=t+Math.cos(R)*S,te=s+6.2+g+u.range(-.4,.4),D=l+Math.sin(R)*S;if(await o(y(H),Y,te,D,u()*ue,u.range(-.4,.4)),u()<.7){const ze=u()*ue,ne=u.range(8,11.5),X=Math.cos(ze)*ne*.45,me=Math.sin(ze)*ne*.45;await o(ae(vt([[Y,te+H*.86,D],[Y+X*.3,te+H+ne*.5,D+me*.3],[Y+X,te+H+ne,D+me]],.34,5),(i,L,q,F)=>F.setRGB(.2,.26,.07),(i,L)=>.25*O(te+H,te+H+ne,L),z),0,0,0)}}}if(c.cake){const[t,s,l]=c.cake;await o(ae(new e.CylinderGeometry(11.5,12,9,32,2),(u,y,b,x)=>{const S=Math.abs(y)<.9;x.setRGB(S?.7:.93,S?.2:.86,S?.26:.76)}),t,s+7,l),await o(ae(new e.TorusGeometry(10,1.5,8,30),(u,y,b,x)=>x.setRGB(.98,.93,.86)),t,s+11.6,l,0,Math.PI/2);for(let u=0;u<8;u++){const y=u/8*ue;await o(m(1.9,[.5,.02,.06],[.9,.1,.16]),t+Math.cos(y)*10,s+13.4,l+Math.sin(y)*10)}}if(c.mint){const[t,s,l,u]=c.mint,y=[[t-2,s+3,l],[t,s+u*.6,l+1],[t+3,s+u+8,l-1],[t+5,s+u+17,l-2]];await o(ae(vt(y,.7,6),(b,x,S,g)=>g.setRGB(.2,.46,.2),(b,x)=>.5*O(s+u*.8,s+u+16,x),2),0,0,0);for(let b=0;b<4;b++){const x=b/3,S=s+u*.8+16.5*x,g=t+1.2+3.6*x,z=l-.4-1.5*x;for(const R of[0,1])await o(k(9.5-3.6*x,14-5*x,.3+.35*x,b*2+R),g,S,z,b*1.45+R*Math.PI+.5,.95-.3*x)}for(let b=0;b<4;b++)await o(k(3.4,5.4,.7,9+b),t+5,s+u+16.5,l-2,b*1.571+.3,.42)}return go(r,h)}function Xo(){const r=[],c=[.62,.4,.13],p=(o,m,B,k,M,W,V,f,t=null)=>{const s=new e.SphereGeometry(o,18,12);if(t){const l=s.attributes.position;for(let u=0;u<l.count;u++){const y=t(l.getX(u)/o,l.getY(u)/o,l.getZ(u)/o);l.setXYZ(u,y[0]*o,y[1]*o,y[2]*o)}}s.scale(M,W,V),t&&s.computeVertexNormals(),r.push(fe(ae(s,f),m,B,k))};p(.64,0,-.02,-.72,1,.94,1.7,(o,m,B,k)=>{const M=Math.sin(B*8.2+.6)>.15&&m>-.2?.3:1,W=O(-.5,-1.05,B),V=O(.1,-.5,m);k.setRGB($(c[0]*M,.16,W)+.22*V,$(c[1]*M,.09,W)+.2*V,$(c[2]*M,.04,W)+.1*V)},(o,m,B)=>{const k=1-.42*O(.1,-1,B);return[o*k,m*k-.16*O(0,-1,B),B]}),p(.6,0,.14,.34,1.02,1.06,1.12,(o,m,B,k)=>{const M=m>.3&&Math.abs(Math.abs(o)-.2)<.07?.6:1;k.setRGB(.5*M,.31*M,.12*M)}),p(.4,0,.1,1.06,1.18,1,.86,(o,m,B,k)=>k.setRGB(.46,.3,.12));for(const o of[-1,1]){p(.33,o*.36,.17,1.13,.86,1.16,1.02,(m,B,k,M)=>{const W=.75+.5*O(-.1,.5,B);M.setRGB(1.25*W,.07*W,.03*W)}),r.push(fe(ae(Ft(0,0,0,.085),(m,B,k,M)=>M.setRGB(.3,.2,.08)),o*.12,.2,1.44));for(let m=0;m<3;m++){const B=[o*.34,-.22,.74-m*.4],k=[o*(.98+.05*m),-.5,1.08-m*.66],M=[o*(1.14+.1*m),-1.22,1.3-m*.9],W=(V,f,t,s)=>s.setRGB(.16,.1,.045);r.push(ae(tt(B,k,.08,5),W),ae(tt(k,M,.055,5),W),ae(Ft(k[0],k[1],k[2],.09),W))}}r.push(ae(tt([0,-.08,1.3],[0,-.52,1.44],.075,5),(o,m,B,k)=>k.setRGB(.3,.2,.08)));const n=wt(r),h=[];for(const o of[-1,1])for(let m=0;m<3;m++){const B=new e.PlaneGeometry(1,1,7,2),k=B.attributes.position,M=new Float32Array(k.count*3),W=3.5,V=1.45,f=o*[.86,.28,-.3][m];for(let t=0;t<k.count;t++){const s=k.getX(t)+.5,l=k.getY(t),u=Math.pow(Math.sin(Math.PI*(s*.9+.05)),.7),y=o*s*W,b=l*V*u-.42*s*W;k.setXYZ(t,y*Math.cos(f)+o*.3,y*Math.sin(f)+.52,b+.42),M[t*3]=Math.max(Math.abs(l)*2,s>.93?1:0)*O(.02,.2,s),M[t*3+1]=m/3+(o>0?0:.5),M[t*3+2]=0}B.setAttribute("color",new e.BufferAttribute(M,3)),B.deleteAttribute("uv"),B.computeVertexNormals(),h.push(B)}return{body:n,wings:wt(h)}}const Fe=[[0,0,1,.062],[.5,.7,.62,.052],[.62,3.6,.48,.046]],Nt=Fe.map(r=>`vec3(${(Math.sin(r[0])*Math.cos(r[1])*r[2]).toFixed(4)}, ${(Math.cos(r[0])*r[2]).toFixed(4)}, ${(Math.sin(r[0])*Math.sin(r[1])*r[2]).toFixed(4)})`);function Zo(){const r=[],c=[],p=new e.Vector3,n=new e.Vector3,h=new e.Vector3,o=(m,B,k,M,W)=>{p.set(Math.sin(m)*Math.cos(B),Math.cos(m),Math.sin(m)*Math.sin(B)),n.set(.3,.1,.9).cross(p).normalize(),h.copy(p).cross(n);const V=[];for(let f=0;f<4;f++){const t=f/4*ue+.6;V.push([n.x*Math.cos(t)*M+h.x*Math.sin(t)*M,n.y*Math.cos(t)*M+h.y*Math.sin(t)*M,n.z*Math.cos(t)*M+h.z*Math.sin(t)*M])}for(let f=0;f<4;f++)r.push(...V[f],...V[(f+1)%4],p.x*k,p.y*k,p.z*k),c.push(W+f,W+f,W+f)};for(let m=0;m<3;m++)o(Fe[m][0],Fe[m][1],Fe[m][2],Fe[m][3],m*4);for(let m=0;m<3;m++)r.push(1,0,0,-1,0,0,0,1,0),c.push(12+m,12+m,12+m);return{pos:r,face:c}}const $e={milk:[.86,.9,.9,1],lime:[.62,.86,.3,.15],soda:[.2,.78,.92,0],amber:[1,.62,.16,.08],marmalade:[1,.5,.08,.2],honey:[1,.68,.1,.12],ruby:[.8,.09,.15,.06],water:[.42,.8,.92,0],brine:[.5,.84,.62,.06],cobalt:[.1,.34,.96,0],magenta:[.92,.13,.5,.04],olive:[.56,.64,.12,.08],claret:[.95,.1,.17,.03],lemon:[1,.9,.42,.06]},jo=[[[62,-168,"soda",9,72,"cobalt",.74,1.3,1],[34,-169,"swing",9,62,"ruby",.74,1.15,0],[-32,-167,"swing",10.5,88,"claret",.72,1.35,0],[-96,-168,"swing",9,72,"magenta",.7,1.4,0],[-120,-167,"soda",9,76,"cobalt",.76,1.5,1],[46,-138,"carafe",12,62,"amber",.6,1.2,0],[18,-125,"soda",9.5,78,"magenta",.72,1.2,1],[-10,-124,"swing",10,82,"amber",.66,1.3,0],[-46,-134,"carafe",13,60,"olive",.62,1.3,0],[-88,-132,"soda",9.5,74,"cobalt",.74,1.2,1],[-112,-140,"jam",14,38,"ruby",.78,1.5,0],[-128,-117,"swing",9.5,80,"lime",.66,1.2,0]],[[44,-168,"swing",9.5,72,"amber",.7,1.3,0],[20,-169,"soda",9,80,"cobalt",.76,1.5,1],[-4,-167,"pickle",12,56,"lime",.82,1.3,0],[-52,-163,"pickle",17,84,"lemon",.9,1.25,5],[-84,-168,"swing",9.5,76,"magenta",.7,1.5,0],[58,-140,"milk",11.5,62,"milk",.6,.9,0],[30,-138,"carafe",13.5,62,"olive",.6,1.3,0],[-20,-136,"swing",10,84,"claret",.7,1.6,0],[-74,-132,"soda",9.5,78,"cobalt",.76,1.5,1],[-102,-138,"honey",13,36,"honey",.78,1.5,0],[-129,-128,"swing",9,70,"amber",.66,1.5,0]]],_e=[-119,-161],Je=[[.7,.76,.78],[.82,.62,.3],[.55,.68,.78],[.3,.72,.56],[.8,.82,.8]],Qo=[.27,.29,.31,.33,.35],wo=70,ea=[[-31,-169,"soda",{R:6.5,H:72,fill:.72,lit:.95}],[-30,-151,"pickle",{R:8,H:52,liq:"lime",fill:.8}],[-3,-116,"soda",{R:8,H:66,fill:.72}],[-122,-142,"carafe",{R:9,H:64,liq:"amber",fill:.6}],[-129,-166,"swing",{profile:"sauce",R:8.5,H:58,liq:"ruby",fill:.7}],[-110,-167,"swing",{R:6.5,H:60,liq:"lime",fill:.66}],[131,-126,"swing",{R:8.5,H:72,liq:"amber",fill:.68}],[112.5,-168.5,"swing",{R:6.3,H:60,liq:"amber",fill:.7,lit:1}],[112,-100,"soda",{R:9.5,H:80,fill:.7}],[128,-76,"carafe",{R:13,H:76,liq:"amber",fill:.55}],[96,-68,"swing",{R:9.5,H:84,liq:"lime",fill:.62}]],ve=[-98,-72,.2756,-.9613,22,.08],ta=[[.352,-1,15,"swing","lime"],[.352,1,17,"honey","honey"],[.374,-1,14,"jam","marmalade"],[.374,1,15,"soda","soda"],[.396,-1,14,"soda","soda"],[.396,1,15,"carafe","amber"],[.418,-1,15,"pickle","brine"],[.418,1,14,"swing","lime"],[.436,1,16,"milk","milk"]],Vt=[-6,-164.5],oa=[18,-165],aa=[42,-167],Ht=[{p:"milk",R:[10,13],H:[52,78],fill:[.45,.75],liq:["milk"],fizz:0,w:3},{p:"swing",R:[9,11],H:[66,85],fill:[.5,.7],liq:["lime","amber"],fizz:0,w:2},{p:"soda",R:[9,10.5],H:[64,82],fill:[.6,.8],liq:["soda"],fizz:1,w:3},{p:"pickle",R:[11,14],H:[55,80],fill:[.7,.85],liq:["brine","lime"],fizz:0,w:2},{p:"carafe",R:[13,15.5],H:[55,78],fill:[.4,.65],liq:["milk","lime","amber"],fizz:0,w:2},{p:"jam",R:[13,16.5],H:[30,42],fill:[.6,.8],liq:["amber","marmalade"],fizz:0,w:2,low:1},{p:"honey",R:[12,15],H:[30,38],fill:[.6,.8],liq:["honey"],fizz:0,w:1.5,low:1},{p:"tumbler",R:[10,12],H:[30,36],fill:[.3,.6],liq:["water"],fizz:0,w:1,low:1}];async function sa(r,c,p,n){const h=[],o={trays:[[78,320,-167.5,0],[80,327.3,-167,.1]],saucers:[],spoon:null,mint:null,cake:null},m=[];for(let i=0;i<=300;i++){const L=p.pointAt(i/300*Re(.66));m.push(L.x,L.z)}const B=(i,L)=>{let q=1e9;for(let F=0;F<m.length;F+=2){const C=m[F]-i,se=m[F+1]-L,re=C*C+se*se;re<q&&(q=re)}return Math.sqrt(q)},k=(i,L)=>{const q=pe((i-75)*we[0]+(L+140)*we[2],0,215);return Math.hypot(i-75-we[0]*q,L+140-we[2]*q)},M=(i,L)=>pe((i-75)*we[0]+(L+140)*we[2],0,215),W=i=>Ht.find(L=>L.p===i),V=(i,L,q,F,C={})=>{const se=C.R??c.range(i.R[0],i.R[1]),re=C.H??c.range(i.H[0],i.H[1]);return{profile:C.profile||i.p,x:L,y:q,z:F,R:se,H:re,fill:C.fill??c.range(i.fill[0],i.fill[1]),liq:$e[C.liq||c.pick(i.liq)],cap:c.pick(Je),fizz:C.fizz??i.fizz,phase:c(),lit:C.lit??c.range(.8,1),shelf:q}},f=(i,L,q=2.5)=>L.every(F=>F.shelf!==i.shelf||Math.hypot(F.x-i.x,F.z-i.z)>F.R+i.R+q),t=i=>Math.abs(i.x)<139-i.R&&i.z>-177+i.R&&i.z<-13-i.R,s=[],l=i=>s.every(L=>L[0]!==i.shelf||Math.hypot(L[1]-i.x,L[2]-i.z)>L[3]+i.R),u=Qo.map(i=>p.pointAt(i)),y=de[0],b=(i,L,q)=>{let F=90;for(const C of u){if(L>C.z+12)continue;const se=Math.hypot(i-C.x,L-C.z),re=C.y-y;F=Math.min(F,re-se*Math.tan(Math.atan2(re,se)-q*wo*Math.PI/180));const ie=(C.z+250)/Math.max(C.z-L,1);Math.abs(C.x+(i-C.x)*ie)<150&&(F=Math.min(F,(350-C.y)/ie+re))}return F},x=i=>{const L=i.x-ve[0],q=i.z-ve[1],F=L*ve[2]+q*ve[3];if(F>-24&&Math.abs(L*ve[3]-q*ve[2])<ve[4]+ve[5]*Math.max(F,0)+i.R)return!1;for(let C=0;C<4;C++)if(Math.hypot(i.x-u[C].x,i.z-u[C].z)<50+i.R)return!1;return!0},S=(i,L=.29)=>{const q=b(i.x,i.z,L)*(.88+.12*i.phase);if(i.H>q){const F=Math.max(q,22)/i.H;i.H*=F,F<.85&&i.R>7&&(i.R=Math.max(i.R*Math.pow(F,.7),6.5))}return i},g=(i,L=9.5,q=!1)=>t(i)&&f(i,h)&&l(i)&&(i.shelf!==y||x(i))&&k(i.x,i.z)>i.R+11+.15*M(i.x,i.z)&&(!L||B(i.x,i.z)>i.R+L)?(h.push(i),!0):!1,z=de[0];s.push([z,79,-167.5,25.5],[z,97.5,-176,8],[z,60.5,-149.5,7],[z,93,-148.5,7]);{const i=Ee(100),L=Ee(124),q=V(W("swing"),i[0]+we[2]*13,z,i[2]-we[0]*13,{R:8.4,H:47,liq:"lime"}),F=V(W("milk"),L[0]-we[2]*13.5,z,L[2]+we[0]*13.5,{R:8.8,H:45});q.liq=$e.ruby,q.fill=Math.max(q.fill,.64),F.liq=$e.amber,F.fill=Math.max(F.fill,.6),h.push(q,F)}const R=(i,L,q,F,C={},se=!1)=>{const re=p.pointAt(i),ie=p.tangentAt(i),Te=Math.hypot(ie.x,ie.z)||1,st=-ie.z/Te,nt=ie.x/Te,Be=V(F,0,z,0,C);return Be.x=re.x+st*L*(q+Be.R),Be.z=re.z+nt*L*(q+Be.R),g(S(Be),0,se)?Be:null},H=(i,L,q,F)=>{const C=S(V(L,i[0],z,i[1],q),F);return g(C,0)?C:null},Y=n.heroJar==="honey"?H(Vt,W("honey"),{R:12,H:37,fill:.78,fizz:4,liq:"honey"}):n.heroJar==="cherries"?H(Vt,W("pickle"),{R:12,H:40,fill:.84,fizz:3,liq:"ruby"}):H(Vt,W("jam"),{profile:"jamopen",R:12,H:39,fill:.76,fizz:2,liq:"marmalade"});H(aa,W("soda"),{R:9.4,H:74,fill:.74,lit:.9},.31),Y&&n.heroJar==="marmalade"&&(o.spoon=[[Y.x+2,z+Y.H*.42,Y.z+1],[Y.x+9,z+Y.H+17,Y.z-3]]);const te=H(oa,W("tumbler"),{R:10.5,H:32,fill:.5});te&&(o.mint=[te.x,z,te.z,te.H]);for(const i of ea)H(i,W(i[2]),i[3]);for(const i of ta)R(i[0],i[1],i[2],W(i[3]),{liq:i[4]});for(const i of[[.462,1,"carafe"],[.483,1,"swing"],[.5,1,"soda"],[.517,1,"milk"],[.535,1,"pickle"]])R(Re(i[0]),i[1],c.range(11,15),W(i[2]),{},!0);const D=i=>{const L=i?Ht.filter(C=>C.low):Ht;let q=0;for(const C of L)q+=C.w;let F=c()*q;for(const C of L)if(F-=C.w,F<=0)return C;return L[0]},ze=h.length+Math.round(24*n.density),ne=[];for(let i=0;i<9;i++)ne.push([c.range(-120,125),c.range(-150,-30)]);for(let i=0;i<900&&h.length<ze;i++){(i&31)===0&&await r.yield();const L=c.pick(ne),q=(i&1)===1,F=q?c.range(-136,136):L[0]+c.gauss()*24,C=q?c.range(-172,-16):L[1]+c.gauss()*20;g(S(V(D(!1),F,z,C)),8.5,!0)}o.topCount=h.length;const X=de[1],me=de[2];o.jelly=[2,X,-160],o.bowl=[-66,X+2.2,-158],s.push([X,2,-160,27],[X,-66,-158,24]),o.saucers.push([2,X,-160,21.5],[-66,X,-158,14]),h.push({profile:"bowl",x:-66,y:X+2,z:-158,R:17.5,H:11.5,fill:0,liq:$e.water,cap:Je[0],fizz:0,phase:.3,lit:.75,shelf:X,noShadow:!0}),n.variant==="party"&&(o.cake=[54,X+2.2,-158],s.push([X,54,-158,22]),o.saucers.push([54,X,-158,17.5]),h.push({profile:"cloche",x:54,y:X+2.2,z:-158,R:15.5,H:25,fill:0,liq:$e.water,cap:Je[0],fizz:0,phase:.6,lit:.8,shelf:X,noShadow:!0}));{const i=ut(dt("lco-street:"+r.seed)),L={[X]:[[2,-160,21.5],[-66,-158,17.5]],[me]:[]};o.cake&&L[X].push([54,-158,34]),o.cherries=[_e[0],me+2,_e[1]],o.saucers.push([_e[0],me,_e[1],15]),h.push({profile:"bowl",x:_e[0],y:me+2,z:_e[1],R:19,H:12.5,fill:0,liq:$e.water,cap:Je[0],fizz:0,phase:.8,lit:1.2,shelf:me,noShadow:!0}),L[me].push([_e[0],_e[1],19]),[X,me].forEach((q,F)=>{for(const C of jo[F])L[q].every(se=>Math.hypot(se[0]-C[0],se[1]-C[1])>se[2]+C[3]+.5)&&h.push({profile:C[2],x:C[0],y:q,z:C[1],R:C[3],H:C[4]*(.96+.08*i()),fill:C[6],liq:$e[C[5]==="ruby"&&n.jellyKind==="ruby"?"amber":C[5]],cap:Je[Math.floor(i()*Je.length)],fizz:C[8],phase:i(),lit:C[7],shelf:q})})}for(const[i,L,q]of[[X,Math.round(18*n.density),.62],[me,Math.round(14*n.density),.46]]){const F=h.length+L;for(let C=0;C<500&&h.length<F;C++){(C&31)===0&&await r.yield();const se=D(!1),re=V(se,c.range(-134,134),i,-162+Math.pow(c(),1.6)*130,{lit:q*c.range(.85,1.1)});re.H=Math.min(re.H,88),g(re,0)}}return{jars:h,L:o}}const na={midnight:{index:0,fogLit:"#0f3540",fogDensity:.0019,fogAmt:1,portal:"#ffc27a",plateGain:.9,needleGain:1.2,post:{exposure:1,bloom:{strength:.42,radius:.72,threshold:1},grade:{saturation:1.16,contrast:1.08,tint:"#e2f0ff",shadowTint:"#021119",vignette:.44,grain:.03,aberration:0}}},morning:{index:1,fogLit:"#4a8c80",fogDensity:.0013,fogAmt:.8,portal:"#fff0c4",plateGain:.8,needleGain:1.3,post:{exposure:.9,bloom:{strength:.32,radius:.7,threshold:1.12},grade:{saturation:1.24,contrast:1.2,tint:"#f3fff6",shadowTint:"#1c4a42",vignette:.2,grain:.02,aberration:0}}},party:{index:2,fogLit:"#131a3c",fogDensity:.0019,fogAmt:1,portal:"#ff9fc4",plateGain:.9,needleGain:1.2,post:{exposure:.95,bloom:{strength:.42,radius:.74,threshold:1.05},grade:{saturation:1.2,contrast:1.12,tint:"#e8ecff",shadowTint:"#0a0f24",vignette:.42,grain:.03,aberration:0}}}};var ca={id:"the-light-comes-on",name:"The Light Comes On",category:"domestic",weirdness:.2,media:["tiny","interior"],async build(r){const{rng:c,noise:p}=r,n=r.quality&&r.quality.detail||1,h=r.vary||{},o=new e.Scene,m=to(co),B=m.length/io,k=pt/io,M=h.hour||"any",W=ut(dt("lco-b:"+r.seed))(),V=c.fork("variety"),f=M==="dawn"||M==="day"?"morning":M==="golden"?"party":M==="night"?W<.55?"midnight":"party":W<.4?"midnight":W<.7?"morning":"party",t={...na[f],variant:f,density:pe(h.density??1,.7,1.3),frost:V.range(.25,1),heroJar:V.pick(["marmalade","marmalade","honey","cherries"]),jellyKind:V.pick(["ruby","ruby","lime","amber"]),rare:!!h.rare};t.jelly={ruby:"#d8203c",lime:"#9be03a",amber:"#ffa62a"}[t.jellyKind];const s=new e.Color(No),l=new e.Color(t.fogLit),u=s.clone();o.background=u,o.fog=new e.FogExp2(u,lo);const y=await Ro(r,{palette:ot,variant:f,density:t.density,frost:t.frost,duration:k,shelfDepth:180,progress:0,bulbPos:[be[0],be[1],be[2]-at],diodePos:[Se[0],Se[1]-1.2,Se[2]-at],lane:[ve[0],ve[1]-at,ve[2],ve[3],ve[4],ve[5]]});y.object.position.set(0,0,at),o.add(y.object),y.setBulb(0),y.setProgress(0),y.update(0,0,null);const b=y.uniforms,x=y.anchors,S=b.uKey.value.w;b.uSlosh.value.w=.034,await r.yield();const g=Io(b,t),z=Oo(b,t);await r.yield();const R=Fo(b,t.frost),H=new e.Vector4(0,0,0,.03),Y=Go({...b,uSlosh:{value:H}});await r.yield();const{jars:te,L:D}=await sa(r,c.fork("jars"),m,t);await r.yield();const ze=new e.Mesh(await Ko(r,D),R);o.add(ze),await r.yield();const ne=new e.Mesh(Yo(),R);ne.position.set(he[0],he[1],-1.6),o.add(ne),o.add(new e.Mesh(Uo(),g.strap));const X=new e.Mesh(new e.PlaneGeometry(300,420).rotateY(Math.PI).translate(0,210,0),g.plate);o.add(X);const me=new e.Mesh(new e.PlaneGeometry(240,420).rotateY(Math.PI/2).translate(-150,210,-120),g.wall);o.add(me),await r.yield();for(const a of Object.keys(qo)){const v=te.filter(P=>P.profile===a);if(!v.length)continue;const d=Po(a,v,Y,a==="bowl"||a==="cloche"?36:34);d.geometry.boundingSphere=new e.Sphere(new e.Vector3(0,230,-95),260),o.add(d),await r.yield()}await r.yield();{const a=te.filter(A=>!A.noShadow),v=a.length+1,d=new e.InstancedBufferGeometry;d.setAttribute("position",new e.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),d.setIndex([0,1,2,0,2,3]);const P=new Float32Array(v*4),w=new Float32Array(v*4),N=new e.Color(t.jelly);a.forEach((A,J)=>{P.set([A.x,A.z,A.R,A.shelf],J*4),w.set([A.liq[0],A.liq[1],A.liq[2],A.H*(.35+.65*A.fill)],J*4)}),P.set([D.jelly[0],D.jelly[2],18,D.jelly[1]+1.2],(v-1)*4),w.set([N.r,N.g,N.b,14],(v-1)*4),d.setAttribute("aJ",new e.InstancedBufferAttribute(P,4)),d.setAttribute("aK",new e.InstancedBufferAttribute(w,4)),d.instanceCount=v,d.boundingSphere=new e.Sphere(new e.Vector3(0,215,-90),260);const Z=new e.Mesh(d,g.caustic);Z.renderOrder=1.5,o.add(Z);const _={milk:1,swing:1,soda:1,sauce:1,carafe:1,champagne:1},E=new e.InstancedBufferGeometry,K=new Float32Array(v*4),Q=new Float32Array(v*4);E.setAttribute("position",d.attributes.position),E.setIndex(d.index),a.forEach((A,J)=>{Q.set([A.liq[0],A.liq[1],A.liq[2],A.H],J*4),K.set([A.profile==="tumbler"?A.fill*.9:A.fill*.93,A.liq[3],Math.min(A.lit,1),_[A.profile]?1:0],J*4)}),Q.set([N.r,N.g,N.b,16.8],(v-1)*4),K.set([1,0,.9,2],(v-1)*4),E.setAttribute("aJ",d.attributes.aJ),E.setAttribute("aK",new e.InstancedBufferAttribute(Q,4)),E.setAttribute("aM",new e.InstancedBufferAttribute(K,4)),E.instanceCount=v,E.boundingSphere=d.boundingSphere;const G=new e.Mesh(E,g.refl);G.renderOrder=1.6,G.frustumCulled=!1,o.add(G)}await r.yield();let i;{const a=Zo(),v=new e.InstancedBufferGeometry,d=c.fork("frost");v.setAttribute("position",new e.Float32BufferAttribute(a.pos,3)),v.setAttribute("aFace",new e.Float32BufferAttribute(a.face,1));const P=Math.round(5900*n*(.72+.4*t.frost)),w=[],N=[],Z=[],_=new e.Vector3,E=(I,ee,oe,ce,We,ft,Pe)=>{const Pt=Math.hypot(ce,We,ft)||1;ce/=Pt,We/=Pt,ft/=Pt;const Qt=m.distanceTo(I+ce*Pe,ee+We*Pe,oe+ft*Pe);Qt<8&&(Pe=Math.max(1.2,Pe-(8-Qt))),w.push(I,ee,oe),N.push(ce*Pe,We*Pe,ft*Pe),Z.push(1,d())},K=Math.round(P*.45),Q=Math.round(P*.25),G=Math.round(P*.21),A=P-K-Q-G;for(let I=0;I<K;I++){(I&511)===0&&await r.yield();const ee=d()*ue,oe=Math.pow(d(),.75),ce=16.5+oe*(oo*1.25-16.5),We=$(.35,1.25,oe)*d.range(.6,1.2);E(he[0]+Math.cos(ee)*ce,he[1]+Math.sin(ee)*ce,0,Math.cos(ee)*We+d.range(-.25,.25),Math.sin(ee)*We+d.range(-.25,.25),-1,$(9,2.4,oe*oe)*d.range(.55,1))}for(let I=0,ee=0;I<Q&&ee<Q*12;ee++){(ee&511)===0&&await r.yield();const oe=d.range(-147,147),ce=20+Math.pow(d(),.6)*396;p.fbm2(oe*.02+5,ce*.02,3)<.12-.3*t.frost||(E(oe,ce,0,d.range(-.7,.7),d.range(-.7,.7),-1,d.range(2,6.5)),I++)}await r.yield();for(let I=0;I<G;I++)E(-150,416-Math.pow(d(),1.3)*150,-2-Math.pow(d(),1.35)*128,1,d.range(-.7,.7),d.range(-.7,.7),d.range(2,6));await r.yield();for(let I=0;I<A;I++)E(d.range(-146,60),420,-1-Math.pow(d(),1.6)*70,d.range(-.4,.4),-1,d.range(-.4,.4),d.range(2,7));for(let I=0,ee=Math.round(240*n);I<ee;I++){const oe=d()*ue,ce=d()<.55?14.6:16.9,We=Math.sin(oe)>-.2?.6:0;E(he[0]+Math.cos(oe)*ce,he[1]+Math.sin(oe)*ce,-2.4,Math.cos(oe)*.7+d.range(-.3,.3),Math.sin(oe)*.7+We,-.9,d.range(1.8,4.6))}for(let I=0,ee=Math.round(260*n);I<ee;I++){const oe=[236,262,288,340,366,392][d.int(0,5)],ce=-3-Math.pow(d(),1.5)*110;E(-147.7+d.range(-1.8,2.2),oe+1.6,ce,d.range(-.1,.5),1,d.range(-.4,.4),d.range(1.2,3.4))}if(await r.yield(),t.frost>.55)for(const I of de)for(let ee=0,oe=Math.round(60*n*t.frost);ee<oe;ee++)E(d.range(-146,146),I-3.8,Ve+d.range(0,1.6),d.range(-.08,.08),-1,d.range(-.08,.08),d.range(3,9));await r.yield();const J=w.length/3;v.setAttribute("aBase",new e.InstancedBufferAttribute(new Float32Array(w),3)),v.setAttribute("aAxis",new e.InstancedBufferAttribute(new Float32Array(N),3)),v.setAttribute("aWr",new e.InstancedBufferAttribute(new Float32Array(Z),2)),v.instanceCount=J,v.boundingSphere=new e.Sphere(new e.Vector3(0,230,-100),300),i=new e.Mesh(v,g.needle),i.renderOrder=-.5,o.add(i)}await r.yield();const L=new e.Mesh(await Jo(r,D,c.fork("veg"),p),g.veg);o.add(L),await r.yield();{const a=[];for(const d of[-75,75])a.push(new e.PlaneGeometry(134,90,1,1).rotateY(Math.PI).translate(d,53.5,-177.4));const v=new e.Mesh(wt(a),g.pane);v.renderOrder=3,o.add(v)}let q;{const a=[[.01,14],[3,13.9],[6.5,13.2],[9.6,11.6],[11.6,9.2],[12.9,6.2],[14,3],[15,.6],[15,0]].map(N=>new e.Vector2(N[0],N[1])).reverse(),v=new e.LatheGeometry(a,56),d=v.attributes.position,P=new e.Vector3(-9.4,9.6,-6.2),w=new e.Vector3;for(let N=0;N<d.count;N++){w.fromBufferAttribute(d,N);const Z=Math.atan2(w.z,w.x),_=Math.hypot(w.x,w.z),E=1+.055*Math.cos(Z*12)*O(.5,4,w.y)*(1-O(10.5,13.6,w.y));w.x*=E,w.z*=E;const K=w.distanceTo(P);if(K<6.2&&_>.1){const Q=Math.sqrt(38.440000000000005-K*K)*.85/_;w.x-=w.x*Q*.75,w.z-=w.z*Q*.75,w.y-=Math.sqrt(6.2*6.2-K*K)*.3}d.setXYZ(N,w.x,w.y,w.z)}v.computeVertexNormals(),v.deleteAttribute("uv"),q=new e.Mesh(v,g.jelly),q.position.set(D.jelly[0],D.jelly[1]+1.2,D.jelly[2]),q.rotation.y=2.2,q.scale.setScalar(1.2),o.add(q)}await r.yield();const F=()=>{const a=new e.InstancedBufferGeometry;return a.setAttribute("position",new e.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),a.setIndex([0,1,2,0,2,3]),a},C=new e.Sphere(new e.Vector3(0,200,-150),420),se=9,re=new e.Matrix4().makeRotationY(D.trays[1][3]).setPosition(D.trays[1][0],D.trays[1][1],D.trays[1][2]),ie=c.fork("ice"),Te=[],st=[];for(let a=0;a<4;a++)for(const v of[-1,1]){const d=v>0&&a===2,P=new e.Vector3(-16.8+a*11.2+(d?1.2:0),d?9.2:7.3+ie.range(-.3,.5),v*5.5).applyMatrix4(re);v<0&&a>0?st.push({start:P,hang:new e.Vector3(79+a*6,339-a%2*7,-189-a*1.6),axis:new e.Vector3(ie.range(-1,1),ie.range(-.4,.4),ie.range(-1,1)).normalize(),spin:ie.range(.9,1.5)}):Te.push([P,.1+ie.range(-.2,.2),d?.42:ie.range(-.1,.1),d?.2:ie.range(-.1,.1)])}Te.push([new e.Vector3(93,325.1,-148.5),.7,0,0],[new e.Vector3(97.5,325.1,-176),.2,0,0],[new e.Vector3(60.5,325.1,-149.5),.5,0,0]);const nt=U(0,0,0,1,1,1,.1,2),Be=Te.length+3;{const a=new Float32Array(Be);for(let v=0;v<Be;v++)a[v]=ie();nt.setAttribute("aSeed",new e.InstancedBufferAttribute(a,1))}const Xe=new e.InstancedMesh(nt,g.ice,Be);Xe.frustumCulled=!1;const rt=new e.Matrix4,Ke=new e.Quaternion,yo=new e.Euler,Et=new e.Vector3(se,se,se),ke=new e.Vector3,Me=new e.Vector3,Ze=new e.Vector3;Te.forEach((a,v)=>{Xe.setMatrixAt(v+3,rt.compose(a[0],Ke.setFromEuler(yo.set(a[2],a[1],a[3])),Et))}),o.add(Xe),await r.yield();{const a=Math.round(150*n),v=F(),d=new Float32Array(a*4),P=c.fork("drips");for(let N=0;N<a;N++)d.set([P.range(-146,146),de[N%3]-4,P(),P.range(.12,.22)],N*4);v.setAttribute("aD",new e.InstancedBufferAttribute(d,4)),v.instanceCount=a,v.boundingSphere=C;const w=new e.Mesh(v,g.drip);w.renderOrder=6.5,o.add(w)}{const a=Math.round(60*n),v=F(),d=new Float32Array(a*4),P=ut(dt("lco-bar-drips:"+r.seed));for(let N=0;N<a;N++)d.set([P.range(-146.5,-99),de[[2,1,2,1,0][N%5]]-4,P(),P.range(.12,.22)],N*4);v.setAttribute("aD",new e.InstancedBufferAttribute(d,4)),v.instanceCount=a,v.boundingSphere=C;const w=new e.Mesh(v,g.drip);w.renderOrder=6.5,o.add(w)}{const a=c.fork("mist"),v=[],d=[],P=(_,E,K,Q,G,A,J)=>{v.push(_,E,K,Q),d.push(a(),A,G,J)},w=n<.9?.7:1;x.fallFeet.forEach((_,E)=>{const K=E===2;for(let Q=0;Q<Math.round((K?38:34)*w);Q++)P(a.range(-142,142),_.y+(K?a.range(-4,12):a.range(-3,7)),_.z+at+(K?a.range(-12,8):a.range(-9,2)),K?a.range(26,44):a.range(15,25),K?a.range(.2,.32):a.range(.34,.52),K?a.range(4,8):a.range(2.5,4.5),E)});for(let _=0;_<Math.round(34*w);_++)P(a.range(-140,140),a.range(6,20),a.range(-240,-188),a.range(40,64),a.range(.2,.34),a.range(4,9),3);for(let _=0;_<Math.round(170*w);_++)P(a.range(-12,12),a.range(-4,9),a.range(-42,42),a.range(26,44),a.range(.4,.58),a.range(2,4),6);for(let _=0;_<Math.round(36*w);_++)P(a.range(-12,12),a.range(-6,5),a.range(-66,-28),a.range(26,40),a.range(.36,.5),a.range(2,4),6);for(let _=0;_<Math.round(30*w);_++)P(a.range(-136,40),a.range(323,328),a.range(-178,-150),a.range(20,34),a.range(.16,.27)*.45,a.range(4,8),4);for(let _=0;_<Math.round(26*w);_++)P(a.range(52,140),a.range(326,336),a.range(-178,-150),a.range(13,24),a.range(.2,.32),a.range(4,7),4);for(let _=0;_<Math.round(16*w);_++)P(a.range(10,128),a.range(334,374),a.range(-224,-198),a.range(26,40),a.range(.12,.2),a.range(8,13),4);for(let _=0;_<Math.round(80*w);_++){const E=a.range(56,104);P(E,333.6+a.range(-.6,.8),-155.4-.1*(E-80)+a.range(-1,1),a.range(7,11.5),a.range(.42,.64),a.range(1.2,2.4),7)}for(let _=0;_<12;_++)P(-158+a.range(-5,5),a.range(110,134),-264+a.range(-8,8),a.range(12,20),a.range(.3,.42),a.range(3,6),5);for(let _=0;_<Math.round(16*w);_++)P(a.range(-146,-104),a.range(318,352),a.range(-232,-184),a.range(15,27),a.range(.2,.34),a.range(4,8),4);const N=F();N.setAttribute("aC",new e.InstancedBufferAttribute(new Float32Array(v),4)),N.setAttribute("aR",new e.InstancedBufferAttribute(new Float32Array(d),4)),N.instanceCount=v.length/4,N.boundingSphere=C;const Z=new e.Mesh(N,g.mist);Z.renderOrder=5.6,o.add(Z)}await r.yield();{const a=[],v=[],d=[];[900,700,500].forEach((E,K)=>{const Q=a.length/3;for(let G=0;G<=30;G++){const A=G/30,J=(-205+150*A)*Math.PI/180;for(const I of[-2400,960])a.push(-146+Math.cos(J)*E,I,-276+Math.sin(J)*E),v.push(A,I,K)}for(let G=0;G<30;G++){const A=Q+G*2;d.push(A,A+1,A+2,A+1,A+3,A+2)}});const Z=new e.BufferGeometry;Z.setAttribute("position",new e.Float32BufferAttribute(a,3)),Z.setAttribute("aL",new e.Float32BufferAttribute(v,3)),Z.setIndex(d);const _=new e.Mesh(Z,z.kitchen);_.renderOrder=-3,_.frustumCulled=!1,o.add(_)}{const a=new e.Mesh(new e.PlaneGeometry(1,420,1,6).translate(0,210,0),z.barGlow);a.renderOrder=6.2,a.frustumCulled=!1,o.add(a)}const je=new e.Vector3(-168,152,-266),xo=new e.Vector3(20,200,-221),Mo=.62;let ge=null,It=null;t.rare&&(ge=new e.Mesh(new e.PlaneGeometry(190,220,1,1).translate(14,-58,0),z.cat),ge.renderOrder=-1,ge.frustumCulled=!1,ge.position.copy(je),ge.lookAt(xo),ge.scale.setScalar(Mo),ge.updateMatrix(),It=new e.Vector3().setFromMatrixColumn(ge.matrix,0).normalize(),o.add(ge)),await r.yield();const Ot=z.lamp(ot[3]),Dt=z.lamp(ot[4]);{const a=new e.Mesh(new e.SphereGeometry(5.2,20,14).scale(1,1.22,1),Ot);a.position.set(be[0],be[1],be[2]),o.add(a);const v=new e.Mesh(new e.SphereGeometry(1.5,12,8),Dt);v.position.set(Se[0],Se[1]-1,Se[2]),o.add(v)}const Le={value:0};await r.yield();const xt=T.makeGlow({rng:c.fork("dg"),position:[Se[0],Se[1]-1.6,Se[2]],color:ot[4],size:3.4,intensity:1.8,time:Le,fogAmount:.5});await r.yield();const Mt=T.makeGlow({rng:c.fork("bg"),position:[be[0],be[1]-2,be[2]],color:"#cfeaff",size:70,intensity:0,time:Le,fogAmount:.4});await r.yield();const St=T.makeGodRays({rng:c.fork("rays"),position:[be[0],be[1]-6,be[2]],direction:[-.5,-.62,.6],radius:7,count:10,length:250,width:[3,26],color:"#cfeeff",intensity:0,falloff:1.4,time:Le}),zt=T.makeGlow({rng:c.fork("eg"),position:m.pointAt(1).toArray(),color:t.portal,size:150,intensity:0,time:Le,fogAmount:.2});o.add(xt.object,Mt.object,St.object,zt.object),await r.yield();const So=new e.Color("#e4f7ff"),zo=new e.Color(ot[4]),it=T.makeParticles({rng:c.fork("motes"),preset:"dust",count:Math.round(2200*n),box:[130,84,130],size:[.1,.34],colors:["#e4f7ff","#a6e8f4","#ffffff"],intensity:.9,velocity:[-1.6,-1.1,-2.2],velocityRandom:[1.2,.6,1.2],turbulence:[1.6,.8,.12],time:Le,renderOrder:7});await r.yield();const Bt=T.makeParticles({rng:c.fork("shed"),preset:"snow",follow:!1,center:[-58,326,-17],box:[190,160,30],count:Math.round(1300*n),size:[.25,.8],colors:["#ffffff","#bfeeff","#e9fbff"],intensity:1.6,velocity:[0,-2.4,-.6],velocityRandom:[.6,.8,.6],twinkle:1,time:Le,renderOrder:7}),kt=T.makeParticles({rng:c.fork("cone"),preset:"dust",follow:!1,center:[52,338,-104],box:[120,120,110],count:Math.round(520*n),size:[.1,.34],colors:["#ffffff","#cfefff","#eaffff"],intensity:1.5,velocity:[-.8,-1.4,.9],velocityRandom:[.8,.5,.8],turbulence:[1.2,.6,.15],twinkle:1,time:Le,renderOrder:7});await r.yield();const Ct=T.makeParticles({rng:c.fork("bar"),preset:"dust",follow:!1,center:[-118,220,-170],box:[56,380,150],count:Math.round(900*n),size:[.12,.46],colors:[t.portal,"#ffffff",t.portal],intensity:1.5,velocity:[.9,-1.2,1.6],velocityRandom:[.8,.5,.8],turbulence:[1.2,.6,.15],twinkle:1,time:Le,renderOrder:7});o.add(it.object,Bt.object,kt.object,Ct.object),await r.yield();const $t=Xo(),lt=new e.InstancedMesh($t.body,g.fly,3),Qe=new e.InstancedMesh($t.wings,z.wing,3);lt.frustumCulled=!1,Qe.frustumCulled=!1,Qe.renderOrder=6,o.add(lt,Qe),await r.yield();const Lt=new e.Vector3(D.bowl[0],D.bowl[1]+15,D.bowl[2]),At=new e.Vector3().fromArray(D.fruitTops[11]),Wt=[new e.Vector3,new e.Vector3,new e.Vector3],Ne=[new e.Vector3(0,0,1),new e.Vector3(0,0,1),new e.Vector3(0,0,1)],Kt=new e.Vector3(0,1,0),Ut=new e.Matrix4,Yt=new e.Vector3,ct=new e.Vector3,Rt=new e.Vector3,Jt=(a,v,d,P,w)=>{Ut.lookAt(Me.set(0,0,0),Ze.copy(d).multiplyScalar(-1),Kt),Ke.setFromRotationMatrix(Ut),lt.setMatrixAt(a,rt.compose(v,Ke,Me.set(P,P,P))),Qe.setMatrixAt(a,rt.compose(v,Ke,Me.set(w,w,w)))},Xt=m.pointAt(1),Bo=new e.Vector3,qt=new e.Vector3,ko=new e.Vector3,Zt=(a,v)=>(Ho(v,qt),t.rare&&(qt.y+=.05*He(Tt(v),.66,.92,.3)),Bo.copy(m.pointAt(v,ko)).addScaledVector(qt,120)),Co=[{at:new e.Vector3(he[0],he[1],-4),from:ye.rose[0],to:ye.rose[1],weight:.5},{at:Xt,from:ye.portal[0],to:ye.portal[1],weight:.5},t.rare?{at:new e.Vector3(je.x,je.y+10,je.z),from:Re(.66),to:Re(.93),weight:.4}:{at:new e.Vector3(-96,58,-178),from:ye.crisper[0],to:ye.crisper[1],weight:.22},{at:Zt,from:ye.gazeA[0],to:ye.gazeA[1],weight:.9,fade:ye.gazeA[2]},{at:Zt,from:ye.gazeB[0],to:ye.gazeB[1],weight:.9,fade:ye.gazeB[2]}],Lo=[[ao,1],[.245,.4],[.495,.45],[no+.02,.5],[.71,.3],[.805,.3]],et=(a,v,d,P)=>{let w=0;for(const N of Lo){const Z=(a-N[0])*k;Z>0&&(w+=N[1]*Math.exp(-Z*d)*Math.sin(Z*v+P))}return w};let ht=null,Ae=0,Ce=0;const jt=b.uKey.value.x,qe=[.2,.262,.352,.44],Ao=f==="morning"?.5:.17,Wo=f==="morning"?.3:1.25;return{scene:o,path:m,duration:B,camera:{fov:wo,near:.8,far:2600,lookAhead:22,sway:.6,bank:.35},pace:a=>1-.45*He(a,.255,.375,.3)-.22*He(Tt(a),.655,.86,.25),pois:Co,portal:{shape:"circle",radius:12,color:t.portal,glow:.7,revealDistance:420,tilt:!0,dewash:0},post:t.post,ride:"none",companion:"none",style:"none",update(a,v,d,P){Le.value=v;const w=Tt(P);ht===null&&P>=so&&(ht=v-(P-so)*B);const N=ht===null?-1:v-ht;N>0&&(Ae=Math.max(Ae,j(0,.35,N)),Ce=Math.max(Ce,j(0,.6,N))),y.setDiode(1.3+.22*Math.sin(v*.8)),y.setBulb(Ae),y.setProgress(w),y.update(a,v,d);const Z=j(qe[0],qe[1],P)*(1-.86*j(qe[2],qe[3],P)),_=j(qe[0],qe[1],P)*(1-j(qe[2],qe[3],P));b.uKey.value.x=$(jt+(.9-jt)*Z,Ao,_),b.uDark.value.y=_,b.uDark.value.x=1-Ae,z.barGlow.uniforms.uGlow.value=.25+.75*Z+Wo*_,o.fog.density=$(lo,t.fogDensity,Ce)*(1-.3*_),b.uKey.value.w=S*(1-.8*j(.58,.72,w)),u.copy(s).lerp(l,Ce),o.fog.color.copy(u);const E=(w-ao)*k;g.needle.uniforms.uShiver.value=E>0?Math.exp(-E*2.6):0,H.x=.35*et(w,2.6,.5,.3),H.y=.35*et(w,1.9,.4,1.5),H.z=.006*et(w,9,2.2,0),g.jelly.uniforms.uWob.value.z=.55*et(w,10,1.1,0),g.jelly.uniforms.uWob.value.w=.5*et(w,14,1.3,1),ne.rotation.z=v*2.3,Ot.uniforms.uLevel.value=.012+6.2*Ae,Dt.uniforms.uLevel.value=(2.4+.9*Math.sin(v*.8))*(1-.6*Ae),xt.uniforms.uIntensity.value=(1.1+.5*Math.sin(v*.8))*(1-.7*Ae),Mt.uniforms.uIntensity.value=.5*Ae,St.uniforms.uIntensity.value=.08*Ce,it.uniforms.uColorA.value.copy(zo).lerp(So,Ae),it.setOpacity((.16+.2*Ce)*(1-.8*j(.84,.95,w))),d.getWorldPosition(Me);const K=Me.distanceTo(Xt);zt.uniforms.uIntensity.value=4.6*Ce*j(100,250,K)*j(.5,.6,w),zt.update(a,v,d),Bt.setOpacity(Ce*(.55+.45*Math.exp(-Math.max(N,0)*.25))),kt.setOpacity(.6*Ce),Ct.setOpacity(.6*Ce*b.uBar.value.w),kt.update(a,v,d),Ct.update(a,v,d),xt.update(a,v,d),Mt.update(a,v,d),St.update(a,v,d),it.update(a,v,d),Bt.update(a,v,d);for(let G=0;G<3;G++){const A=st[G],J=no+G*.008,I=j(J,J+.034,w),ee=j(.596,.668,w);m.pointAt(Re(pe(.648+.009*G+(w-.615)*.3,0,1)),ke),ke.y-=9.5+3*G,ke.z+=11.5+.6*G,Me.lerpVectors(A.start,A.hang,I),Me.y+=Math.sin(Math.min(I*1.6,1)*Math.PI)*5-26*j(.585,.66,w)*(1-ee),ke.lerpVectors(Me,ke,ee),Ke.setFromAxisAngle(A.axis,Math.max(w-J,0)*k*A.spin),Xe.setMatrixAt(G,rt.compose(ke,Ke,Et))}Xe.instanceMatrix.needsUpdate=!0;const Q=He(w,ro[0],ro[1],.3);d.getWorldPosition(Yt),d.getWorldDirection(ct),Rt.crossVectors(ct,Kt).normalize();for(let G=0;G<2;G++){const A=v*(G?.7:.9)+G*2.1,J=Wt[G];ke.set(Lt.x+Math.cos(A)*(G?20:26),Lt.y+(G?6:9)+4.5*Math.sin(A*2+G),Lt.z+Math.sin(A)*(G?13:16)),G===0&&Q>0&&(Me.copy(Yt).addScaledVector(ct,25).addScaledVector(Rt,-5.5+Math.sin(v*1.3)*1.1),Me.y+=-3.2+Math.sin(v*2.3)*.8,ke.lerp(Me,Q)),Ze.subVectors(ke,J),a>0&&Ze.lengthSq()>1e-6&&Ze.lengthSq()<400&&Ne[G].lerp(Ze.normalize(),1-Math.pow(1-.35,a*60)).normalize(),G===0&&Q>.5&&(Ne[0].copy(Rt).multiplyScalar(.84).addScaledVector(ct,-.42),Ne[0].y+=.12,Ne[0].normalize()),J.copy(ke),Jt(G,J,Ne[G],G?1:1.35,G?1:1.35)}{const G=v*.3,A=Math.floor(G)*2.4+j(.15,.85,G-Math.floor(G))*2.4;Wt[2].set(At.x+Math.cos(A)*2.3,At.y+.55,At.z+Math.sin(A)*2.3),Ne[2].set(-Math.sin(A),0,Math.cos(A)),Jt(2,Wt[2],Ne[2],1,.001)}if(lt.instanceMatrix.needsUpdate=!0,Qe.instanceMatrix.needsUpdate=!0,ge){const G=j(.6,.67,w),A=j(.93,.975,w),J=1-G+A;ge.position.copy(je).addScaledVector(It,J*70),ge.position.y-=J*90+22*j(.8,.92,w);const I=z.cat.uniforms.uCat.value;I.x=G*(1-A),I.y=1-.86*j(.69,.785,w),I.z=1.25-1.25*He(w,.795,.82,.4),g.mist.uniforms.uBreath.value=He(w,.725,.78,.35)+He(w,.82,.875,.35)}},dispose(){}}}};export{ca as default};
