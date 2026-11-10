import*as u from"three";import{makePath as rn,clamp as He,lerp as $,smoothstep as T,makeRng as ls,hashSeed as cs}from"../kit/core.js";import{makeSky as ln,makeCloudField as cn,skyDirection as hn}from"../kit/sky.js";import*as ft from"../kit/terrain.js";import*as hs from"../kit/water.js";import*as _e from"../kit/flora.js";import*as xt from"../kit/fauna.js";import*as ea from"../kit/fx.js";import{buildHero as un,GLSL_LEAF as Ia}from"../parts/maple-gale.js";const Ea=["#C8281C","#E8742A","#F0B428","#23262B","#55606C","#E9E4D6","#1F3A2E"],Rt=11,tt=-61.5,pe=16,Ge=-306,fn={slate:{sky:{preset:"overcast",zenith:"#3a434e",mid:"#55606C",horizon:"#87919b",ground:"#3a4048",horizonPow:3,scatterColor:"#e2d6bb",scatter:.5,scatterPow:4,sunElevation:26,sunAzimuth:190,sunIntensity:0,veil:1.1,sunGlow:.5,clouds:{coverage:.9,softness:.5,lit:"#b3b6b6",shade:"#353d47",absorb:1.8,silver:.9,scale:.8,detail:.8,wind:[.07,.016]},clouds2:{coverage:.95,softness:.6,scale:.5,stretch:.3,opacity:1,lit:"#7d8791",shade:"#3C444E",wind:[.035,.008]}},az:190,el:36,sun:"#FFE9C4",sunI:3.7,hemiSky:"#8a9cb6",hemiGround:"#5c544c",hemiI:1.36,fog:"#66727f",fogD:9e-4,patch:[110,.32],patchGain:1.7,patchLift:1.05,faunaSun:.55,exposure:1.2,bloom:.34,sat:1.12,tint:"#fff7ee",shadow:"#10161f",clouds:{lit:"#8a9199",count:7},wind:2,portal:"#ffe6b8",mist:0,snow:0,gorge:[53,.49,1],title:"The Leaf Wind"},golden:{sky:{preset:"goldenHour",zenith:"#27385e",mid:"#56688e",horizon:"#eeb078",ground:"#4a4038",scatterColor:"#ff9a3c",scatter:.6,scatterPow:6,scatterHigh:.04,sunElevation:8,sunAzimuth:215,sunIntensity:9,sunGlow:.7,clouds:{coverage:.62,softness:.4,lit:"#f6b880",shade:"#353c54",absorb:2,silver:1.5,scale:.9,wind:[.05,.012]},clouds2:{lit:"#ffd2a2",shade:"#5a5670",opacity:.35,wind:[.03,.006]}},az:212,el:26,sun:"#ffc487",sunI:3.4,hemiSky:"#8598d2",hemiGround:"#5a4a44",hemiI:1.7,fog:"#7f8498",fogD:95e-5,patch:[1e5,1],faunaSun:.9,exposure:1.14,bloom:.36,sat:1.04,tint:"#fff4e4",shadow:"#0e1430",clouds:{lit:"#e09a60",count:6},wind:1.7,portal:"#ffd9a0",mist:0,snow:0,gorge:[53,.49,.7],title:"The Leaf Wind, Evening"},squall:{sky:{preset:"overcast",zenith:"#6c747d",mid:"#8a9198",horizon:"#aeb4b9",ground:"#666c72",horizonPow:2,scatterColor:"#d8d8d2",scatter:.25,sunElevation:26,sunAzimuth:190,sunIntensity:0,veil:.3,clouds:{coverage:.98,softness:.6,lit:"#b6bbbf",shade:"#535b64",absorb:1.4,silver:.3,scale:.8,wind:[.09,.02]},clouds2:{coverage:.97,softness:.6,scale:.5,stretch:.3,opacity:1,lit:"#9aa0a6",shade:"#626a73",wind:[.05,.01]}},az:190,el:44,sun:"#e4e8ee",sunI:1.5,hemiSky:"#b4bcc8",hemiGround:"#5a5650",hemiI:1.9,fog:"#99a1a8",fogD:.0034,patch:[1e5,1],faunaSun:1,exposure:1.04,bloom:.28,sat:1.2,tint:"#f4f7ff",shadow:"#1d2430",clouds:null,wind:2.4,portal:"#fff0d0",mist:0,snow:1,gorge:[53,.49,0],title:"The Leaf Wind, First Snow"},dawn:{sky:{preset:"dawn",zenith:"#27468a",mid:"#7f8fc4",horizon:"#f4b9a2",ground:"#6c6a80",scatterColor:"#ffc890",scatter:.7,scatterPow:4,sunElevation:7,sunAzimuth:-32,sunGlow:.7,clouds:{coverage:.3,lit:"#ffd0bc",shade:"#64638e",silver:1.3,wind:[.03,.008]},clouds2:{lit:"#ffd6cc",shade:"#a28bae",opacity:.4,coverage:.55,wind:[.02,.004]}},az:-32,el:23,sun:"#ffc79c",sunI:3.3,hemiSky:"#93a6dc",hemiGround:"#7a6068",hemiI:2.25,fog:"#a9a6b8",fogD:.0014,patch:[1e5,1],faunaSun:.9,exposure:1.16,bloom:.38,sat:1.08,tint:"#fff2ea",shadow:"#161a2c",clouds:null,wind:1.3,portal:"#ffe0c0",mist:1,snow:0,gorge:[53,.49,0],title:"The Leaf Wind, Frost Dawn"}},Mt=`
  uniform vec4 uMgPatch;   // world x, z of the travelling break of sun, radius, sun gain outside it
  uniform vec3 uMgPatch2;  // the second break that rests on the great maple: x, z, radius
  float mgPatchA(vec2 w){ return 1.0 - smoothstep(uMgPatch.z - 42.0, uMgPatch.z + 8.0, distance(w, uMgPatch.xy)); }   // the travelling break alone
  float mgPatchAt(vec2 w){
    float a = 1.0 - smoothstep(uMgPatch.z - 32.0, uMgPatch.z + 32.0, distance(w, uMgPatch.xy));
    float b = 1.0 - smoothstep(uMgPatch2.z*0.55, uMgPatch2.z*1.5, distance(w, uMgPatch2.xy));
    return mix(uMgPatch.w, 1.0, max(a, b));
  }
`,i0=`
  uniform sampler2D tMgShade;
  uniform vec4 uMgShBox;    // the map's corner in world x, z; 1 / its width, 1 / its depth
  uniform vec4 uMgShSun;    // the way shadows fall (x, z: a unit vector), 1 / tan(sun elevation), the most a lit gap's sun term may be raised to (0: this look has no sun to cast shade, the squall)
  uniform vec4 uMgShK;      // the sun left in full shade, the sun's gain in the lit gaps, time, 1 where the shade lives only inside the travelling break (the slate look)
  float mgShW(float x){ if (x >= 0.0) return -1.5; if (x >= -420.0) return -1.5 - x*0.0642857; if (x >= -560.0) { float t = (-420.0 - x)/140.0; return 25.5 + 20.5*(t + 0.04*sin(t*18.85)); } return 46.0 + (-560.0 - x)*0.012; }
  float gMgSh = 0.0, gMgShK = 0.0;                     // the shade at the last point looked up (0 .. 1), and how far the map reaches it
  void mgShadeAt(vec3 w, float top){                   // top: metres above the floor at which this thing is out of the shade's reach
    gMgSh = 0.0; gMgShK = 0.0;
    float hh = max(w.y - (mgShW(w.x) + 1.0), 0.0);
    float k = step(0.001, uMgShSun.w)*(1.0 - smoothstep(top*0.5, top, hh));
    if (k <= 0.001) return;
    vec2 q = w.xz + uMgShSun.xy*(hh*uMgShSun.z);
    q += 0.4*vec2(sin(uMgShK.z*1.3 + q.x*0.13 + q.y*0.07), sin(uMgShK.z*1.05 + q.y*0.11 + q.x*0.05 + 1.7));    // the crowns heave in the wind: the shade breathes
    vec2 uv = (q - uMgShBox.xy)*uMgShBox.zw;
    vec2 e = smoothstep(vec2(0.0), vec2(0.02, 0.08), uv)*(1.0 - smoothstep(vec2(0.98, 0.92), vec2(1.0), uv));
    gMgShK = k*e.x*e.y*mix(1.0, mgPatchA(w.xz), uMgShK.w);
    gMgSh = textureLod(tMgShade, clamp(uv, 0.0, 1.0), 0.0).r;
  }
  float mgSunShade(float m, vec3 w, float top){        // the sun term m of a thing at w, with the wood's shade cast on it
    mgShadeAt(w, top);
    float lit = max(m, min(m*uMgShK.y, uMgShSun.w));
    return mix(m, mix(lit, m*uMgShK.x, gMgSh), gMgShK);
  }
`,us=`
  uniform vec4 uMgEdge;     // three phases of this visit, metres of depth the edge wanders by (0.06: on the bar's 8% beach, three quarters of a metre either way)
  float mgEdge(vec2 w){
    return 0.51*(sin(w.x*1.53 + uMgEdge.x + 0.9*sin(w.x*0.37 + uMgEdge.y)) + 0.6*sin(w.x*2.71 + w.y*0.9 + uMgEdge.z) + 0.35*sin(w.x*4.9 - w.y*1.7 + uMgEdge.x*2.0));
  }
  float mgBarX(float x, vec4 bar){ return smoothstep(bar.x - 12.0, bar.x + 4.0, x)*(1.0 - smoothstep(bar.y - 4.0, bar.y + 12.0, x)); }   // 1 along the gravel bar
`,qt=`
  float wHash(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.y); }
  float wNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
    return mix(mix(wHash(i), wHash(i + vec2(1., 0.)), f.x), mix(wHash(i + vec2(0., 1.)), wHash(i + vec2(1., 1.)), f.x), f.y); }
`,mn=`
  float wCell(vec2 p){
    vec2 i = floor(p), f = fract(p); float d1 = 8.0, d2 = 8.0;
    for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
      vec2 o = vec2(float(x), float(y)), cc = i + o;
      vec2 r = o + 0.1 + 0.8*vec2(wHash(cc), wHash(cc + 31.7)) - f; float dd = dot(r, r);
      if (dd < d1) { d2 = d1; d1 = dd; } else if (dd < d2) { d2 = dd; }
    }
    return sqrt(d2) - sqrt(d1);
  }
`,dn=`
  uniform vec4 uMgLand;    // bend offset of the stream head, water level offset, litter density, 0
  uniform vec4 uMgBar;     // the pale gravel bar: x0, x1, nearest and farthest distance left of the stream centre
  uniform vec3 uMgRamp[4];
  float mgZc(float x){ return ${pe.toFixed(1)} + uMgLand.x*(1.0 - smoothstep(-540.0, -420.0, x)); }
  float mgWater(float x){
    if (x >= 0.0) return -1.5;
    if (x >= -420.0) return -1.5 - x*0.0642857;
    if (x >= -560.0) { float t = (-420.0 - x)/140.0; return 25.5 + 20.5*(t + 0.04*sin(t*18.85)); }
    return 46.0 + (-560.0 - x)*0.012;
  }
  float mgH2(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.y); }
  float mgVn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
    return mix(mix(mgH2(i), mgH2(i + vec2(1., 0.)), f.x), mix(mgH2(i + vec2(0., 1.)), mgH2(i + vec2(1., 1.)), f.x), f.y); }
  uniform vec3 uMgFill;    // sky light added in the shade
  uniform vec4 uMgShade;   // the shadow the right wall throws: its height at the stream's centre line, its fall per metre leftward, strength, 0
  uniform vec3 uMgSheen;   // what wet rock takes from the sky
  uniform vec3 uMgFloor;   // the least light on the land (scene-linear)
  uniform vec2 uMgWall;    // the sun's gain on the left wall above the right wall's shadow: outside the travelling break, inside it
  uniform vec3 uMgWood;    // the far wood painted on the upland: metres from the stream where it begins, where it is whole, the size of a crown
  uniform vec3 uMgCrown[5];
  float gMgRk = 0.0, gMgTone = 0.5, gMgWetL = 0.0;
  vec3 mgFleck(vec2 q, float dens, float fw){          // (colour pick, shade, coverage) of the fallen leaf in this cell
    vec2 id = floor(q), f = fract(q) - 0.5; float h = mgH2(id), h2 = mgH2(id + 17.3);
    vec2 g = f - (vec2(h2, fract(h2*7.13)) - 0.5)*0.5;
    float a = h*6.283, ca = cos(a), sa = sin(a);
    g = vec2(g.x*ca + g.y*sa, -g.x*sa + g.y*ca)*vec2(1.0, 1.5);
    float leaf = (1.0 - smoothstep(0.26 - fw, 0.26 + fw, length(g)))*step(fract(h*5.3), dens);
    return vec3(h2, fract(h*13.7), leaf);
  }
`;function l0(a,b,P){const te=a.onBeforeCompile,D=a.customProgramCacheKey;return a.onBeforeCompile=function(H,B){te&&te.call(a,H,B),H.uniforms.uMgPatch=b.uPatch,H.uniforms.uMgPatch2=b.uPatch2,H.uniforms.uMgWave=b.uWave,H.uniforms.uMgPale=b.uPale,H.uniforms.uMgFront=b.uFront,H.uniforms.uMgBurst=b.uBurst,H.uniforms.tMgShade=b.tShade,H.uniforms.uMgShBox=b.uShBox,H.uniforms.uMgShSun=b.uShSun,H.uniforms.uMgShK=b.uShK;let l=H.fragmentShader,N=H.vertexShader;const ee=Mt+i0+`uniform vec4 uMgWave; uniform vec3 uMgPale; uniform vec4 uMgBurst;
`;if(P==="flora"){l=l.replace("#include <common>",`#include <common>
varying vec2 vMgB;
`+ee);const _="fWorld.xyz += floraSway(fWorld.xyz, fOrigin, wind, fScale, fGust);";N=N.replace("#include <common>",`#include <common>
uniform vec4 uMgFront, uMgBurst; varying vec2 vMgB;`);const x="(mgPatchAt(vFloraWorld.xz)*mgSunShade(1.0 + uMgBurst.y*mgPatchA(vFloraWorld.xz), vFloraWorld, 5.0))";N.includes(_)?N=N.replace(_,_+`
        {
          #ifdef USE_INSTANCING
            vec2 mgO = fOrigin.xz; float mgTree = smoothstep(2.5, 4.5, fWorld.y - fOrigin.y);
          #else
            vec2 mgO = fWorld.xz; float mgTree = 0.0;
          #endif
          vec2 mgT = uMgFront.zw;
          float mgD = dot(uMgFront.xy - mgO, mgT) - 0.8*dot(fWorld.xz - mgO, mgT);      // metres the front is past this leaf: it crosses a crown from windward to leeward
          float mgNear = 1.0 - smoothstep(26.0, 42.0, abs(dot(mgO - uMgFront.xy, vec2(-mgT.y, mgT.x))));
          float mgK = uMgBurst.x*(0.35 + 0.65*mgNear);
          float mgHv = smoothstep(-15.0, -1.0, mgD)*(1.0 - smoothstep(3.0, 20.0, mgD))*mgK;
          fWorld.xyz += vec3(mgT.x, -0.28, mgT.y)*(wind.x*fScale*uFloraWind.z*1.3*mgHv);
          vMgB = vec2(smoothstep(-9.0, -3.0, mgD)*(1.0 - smoothstep(0.0, 6.0, mgD))*mgK*mgTree, smoothstep(-4.0, 9.0, mgD)*mgNear*mgTree*uMgBurst.x);   // the flash is brief: a third of a second
        }`):N=N.replace("#include <fog_vertex>",`vMgB = vec2(0.0);
#include <fog_vertex>`),l=l.replace("#include <normal_fragment_begin>",`
        { float mgPh = fract((vFloraWorld.x + 0.35*vFloraWorld.z - uMgWave.x)/uMgWave.y) - 0.5;
          float mgBand = exp(-mgPh*mgPh*70.0)*uMgWave.z*smoothstep(0.5, 1.0, fLeaf);
          diffuseColor.rgb = mix(diffuseColor.rgb, uMgPale*(0.55 + 0.45*diffuseColor.r), mgBand*(0.35 + 0.65*vFlora.w)); }
        { // the burst: warm leaves torn out in clumps (needles stay), and the pale flash of the heave
          float mgWarm = step(vColor.g*1.02, vColor.r);
          if (fLeaf > 0.5 && vMgB.y > 0.001 && floraNoise(vFloraPos*0.85 + 3.7) < 0.44*vMgB.y*mgWarm) discard;
          float mgFl = vMgB.x*mgWarm*smoothstep(0.5, 1.0, fLeaf)*smoothstep(0.38, 0.62, floraNoise(vec3(vFloraPos.xz*1.3, uFloraTime*2.2 + vFloraPos.y*1.3)));
          diffuseColor.rgb = mix(diffuseColor.rgb, uMgPale*(0.55 + 0.45*diffuseColor.r), 0.6*mgFl); }
        #include <normal_fragment_begin>`);const O="reflectedLight.indirectDiffuse *= mix(uFloraLight.y, uFloraLight.z, fLeaf);";l.includes(O)?l=l.replace(O,"reflectedLight.directDiffuse *= "+x+`;
`+"reflectedLight.indirectDiffuse *= vec3(1.0) + uMgBurst.z*mgPatchA(vFloraWorld.xz)*vec3(1.0, 0.914, 0.769);"+`
`+O):l=l.replace("#include <aomap_fragment>",`#include <aomap_fragment>
reflectedLight.directDiffuse *= `+x+";")}else if(P==="terrain"||P==="land"){const _="gTSnow = sn; gTWet = wet; gTSpark *= 1. - rock;",x=P==="land"&&l.includes(_);if(l=l.replace("#include <common>",`#include <common>
`+ee+(x?`varying vec2 vMgBn;
`+us+dn:"")),x&&(N=N.replace("#include <common>",`#include <common>
attribute vec2 aMgB; varying vec2 vMgBn;`),N=N.replace("vTWorld = (tm * tw).xyz;","vMgBn = aMgB; vTWorld = (tm * tw).xyz;")),P==="terrain"){const O="reflectedLight.indirectSpecular *= tamb; }";l.includes(O)&&(l=l.replace(O,"reflectedLight.indirectSpecular *= tamb; reflectedLight.indirectDiffuse += diffuseColor.rgb*uMgFill*((.5 + .5*tamb)*(1. - .5*tsun)); }"),l=l.replace("#include <common>",`#include <common>
uniform vec3 uMgFill;`),H.uniforms.uMgFill=b.uRockFill)}if(l=l.replace("#include <aomap_fragment>",(x?`{ float mgM = mgPatchAt(vTWorld.xz);
          float mgDl = mgZc(vTWorld.x) - vTWorld.z;
          float mgIn = smoothstep(-45.0, -25.0, mgDl)*(1.0 - smoothstep(4.0, 16.0, vTWorld.x))*uMgShade.z;
          float mgLit = smoothstep(-3.0, 6.0, vTWorld.y - (uMgShade.x - uMgShade.y*mgDl));
          mgM *= mix(1.0, mix(0.4, 1.0, mgLit), mgIn);
          // the left wall faces the sun: above the right wall's shadow it takes what sun there is, and where the travelling
          // break lies on it, the break's whole warm light (uMgWall: the sun's gain on it outside the break, inside it)
          mgM = max(mgM, mgLit*mgIn*smoothstep(8.0, 18.0, mgDl)*(1.0 - smoothstep(100.0, 125.0, mgDl))*mix(uMgWall.x, uMgWall.y, mgPatchA(vTWorld.xz)));
          mgM *= mix(1.0, 0.5, smoothstep(12.0, 30.0, vTWorld.x)*(1.0 - smoothstep(-46.0, -6.0, vTWorld.y)));   // the bowl is deep: less of the sun gets down
          mgM = mgSunShade(mgM, vTWorld, 28.0);             // the shade of the bank trees across the banks, the bar and the foot of the walls
          reflectedLight.directDiffuse *= mgM*vec3(1.1, 1.0, 0.84); reflectedLight.directSpecular *= mgM; }`:"{ float mgM = mgSunShade(mgPatchAt(vTWorld.xz), vTWorld, 28.0); reflectedLight.directDiffuse *= mgM; reflectedLight.directSpecular *= mgM; }")+`
#include <aomap_fragment>`),x){const O="reflectedLight.indirectSpecular *= tamb; }";l.includes(O)&&(l=l.replace(O,"reflectedLight.indirectSpecular *= tamb; reflectedLight.indirectDiffuse += diffuseColor.rgb*uMgFill*((.45 + .55*tamb)*(1. - .6*tsun)*(1. + .9*smoothstep(8., 40., vTWorld.x))); }")),H.uniforms.uMgFill=b.uFill,l=l.replace("#include <opaque_fragment>",`{ vec3 mgFl = uMgFloor*(0.72 + 0.56*gMgTone)*mix(0.72, 1.0, gMgRk);
          float mgLu = max(dot(outgoingLight, vec3(0.2126, 0.7152, 0.0722)), 0.0), mgLf = max(dot(mgFl, vec3(0.2126, 0.7152, 0.0722)), 1e-5);
          outgoingLight += mgFl*exp(-2.0*mgLu/mgLf); }
          #include <opaque_fragment>`),H.uniforms.uMgFloor=b.uFloor,H.uniforms.uMgWall=b.uWall,H.uniforms.uMgWood=b.uWood,H.uniforms.uMgCrown={value:b.crownRamp},H.uniforms.uMgLand=b.uLand,H.uniforms.uMgBar=b.uBar,H.uniforms.uMgRamp={value:b.litterRamp},H.uniforms.uMgShade=b.uShade,H.uniforms.uMgSheen=b.uSheen,l=l.replace(_,`
          { // thinly bedded schist on everything steep: beds dipping down the gorge, each standing proud over the shadowed foot
            // of the next, fine laminae inside them, wet black streaks that take the cold sky
            float mgRk = rock*steep;
            // (the beds are measured on the smooth lie of the rock: the fine warp is left out of the pixel measure, or its own
            // sparkle would switch the beds off at a distance, and is itself eased away where it falls under a pixel)
            float mgS0 = wp.y + 0.14*wp.x + 0.05*wp.z, mgF0 = fwidth(mgS0);
            float mgSy = mgS0 + (tM.r - 0.5)*2.4 + (tD.r - 0.5)*0.6*(1.0 - smoothstep(0.04, 0.2, mgF0));
            // thin beds 2.3 m thick, and the benches they are gathered in, 7.6 m thick: where the thin ones fall under a few
            // pixels the benches carry the banding on, so the wall is bedded from the bank to the far end of the gorge
            float mgKb = mgSy/2.3 + 0.7*sin(mgSy*0.23), mgFr = fract(mgKb), mgId = floor(mgKb), mgFw = mgF0*0.6;
            float mgKc = mgSy/7.6 + 0.5*sin(mgSy*0.071 + 1.3), mgFc = fract(mgKc), mgIc = floor(mgKc), mgFwc = mgF0*0.17;
            float mgE = smoothstep(0.0, clamp(mgFw*1.5, 0.002, 0.5), mgFr), mgEc = smoothstep(0.0, clamp(mgFwc*1.5, 0.002, 0.5), mgFc);
            // each bed: its foot in shadow under the bed above it, its face in its own tone, its top a lit ledge
            float mgTf = mix((0.84 + 0.34*mgH2(vec2(mgId - 1.0, 7.0)))*1.26, (0.84 + 0.34*mgH2(vec2(mgId, 7.0)))*(1.0 + 0.26*smoothstep(0.84, 0.94, mgFr)), mgE);
            float mgTc = mix((0.86 + 0.3*mgH2(vec2(mgIc - 1.0, 3.0)))*1.3, (0.86 + 0.3*mgH2(vec2(mgIc, 3.0)))*(1.0 + 0.3*smoothstep(0.9, 0.96, mgFc)), mgEc);
            float mgSf = (1.0 - smoothstep(0.08, 0.32, mgFr))*mgE, mgSc = (1.0 - smoothstep(0.04, 0.17, mgFc))*mgEc;
            float mgAa = 1.0 - smoothstep(0.2, 0.5, mgFw), mgAc = 1.0 - smoothstep(0.2, 0.5, mgFwc);
            float mgProf = mix(1.0, mgTf, mgAa)*mix(1.0, mgTc, mgAc*mix(1.0, 0.45, mgAa));
            float mgSh = max(mgSf*mgAa, mgSc*mgAc*mix(1.0, 0.55, mgAa));
            float mgLam = mix(1.0, 0.88 + 0.24*mgH2(vec2(floor(mgSy/0.36), 3.0)), 1.0 - smoothstep(0.25, 0.8, mgF0/0.36));
            // THE BOWL (vMgBn, from the land's own corners: x the bench coordinate, y how far this is the bowl's stepped
            // wall). Its rock is ledged schist in four strong benches, and what marks it is the benches: here the thin beds
            // and the gathered ones of the gorge are only faint changes of tone, with no shadowed foot to any of them, so
            // no thin dark line runs round the bowl; the kit's own beds are eased toward the rock's mean in the same way.
            float mgBw = vMgBn.y, mgFb = fract(vMgBn.x), mgIb = floor(vMgBn.x);
            mgProf = mix(mgProf, 1.0 + (mgProf - 1.0)*0.2, mgBw); mgSh *= 1.0 - mgBw; mgLam = mix(mgLam, 1.0 + (mgLam - 1.0)*0.5, mgBw);
            float mgKitL = dot(mix(uTRock, st.rgb*st.rgb, uTStrata.x), vec3(0.3333)), mgEase = mix(1.0, clamp(dot(uTRock, vec3(0.3333))/max(mgKitL, 1e-3), 0.7, 1.5), 0.7*mgBw);
            float mgHor = wp.x + 0.7*wp.z;
            float mgStk = smoothstep(0.5, 0.76, mgVn(vec2(mgHor*0.37, mgSy*0.028))*0.7 + mgVn(vec2(mgHor*1.6, wp.y*0.09) + 5.0)*0.3);
            vec3 mgRc = diffuseColor.rgb*(mgEase*mgProf*mgLam*(1.0 - 0.46*mgStk));
            // the shadow under each bed is the sky's own slate-blue, never black
            mgRc *= mix(vec3(1.0), uMgFill*vec3(0.72, 0.93, 1.28)*(0.24/max(max(uMgFill.r, uMgFill.g), max(uMgFill.b, 1e-3))), mgSh);
            // ledge plants: straw fern and dark moss hanging in tufts from the lip of a bench here and there (seen from the stream)
            { float mgTu = mgVn(vec2(mgHor*0.33 + mgIc*7.1, mgIc*3.7)), mgT2 = mgVn(vec2(mgHor*1.9, mgSy*0.9) + 11.0);
              float mgPl = smoothstep(0.56, 0.7, mgTu)*smoothstep(0.86 - 0.3*mgT2*smoothstep(0.5, 0.9, mgTu), 0.93, mgFc)*mgAc*smoothstep(0.05, 0.1, mgF0)*(1.0 - mgBw);
              mgRc = mix(mgRc, mix(vec3(0.05, 0.09, 0.045), vec3(0.3, 0.23, 0.09), smoothstep(0.35, 0.7, mgVn(vec2(mgHor*0.9, mgIc*5.0) + 3.0)))*(0.6 + 0.8*mgT2), mgPl*0.85); }
            float mgUl = 0.0;
            // (mgAng: metres round the bowl at its walls; the turn of the angle lies at the low far end, where there is no wall)
            float mgAng = atan(-(wp.z - ${pe.toFixed(1)}), -(wp.x - 90.0))*62.0, mgJp = fwidth(mgAng)/8.0;
            if (mgBw > 0.002) {
              // Each riser is cut by joints every 5 to 12 m round the bowl into blocks, every block its own tone; two joints
              // in five stand open as a dark crack up from the riser's foot or down from its lip.
              // (the joints lean and wander: none is a ruled upright; a crack runs only part of the way up its riser)
              float mgJw = mgAng/8.0 + 5.0*mgH2(vec2(mgIb, 2.0)) + 0.8*sin(mgAng*0.09 + mgIb*2.3) + 0.45*sin(mgAng*0.31 + mgIb*1.1) + (mgFb - 0.5)*0.5*sin(mgAng*0.043 + mgIb*4.0) + 0.5*(tM.r - 0.5);
              float mgJi = floor(mgJw), mgJf = fract(mgJw), mgJe = mgJi + step(0.5, mgJf);
              float mgBt = 0.84 + 0.3*mgH2(vec2(mgJi, mgIb + 3.0));
              float mgCh = mgH2(vec2(mgJe, mgIb + 9.0)), mgC2 = mgH2(vec2(mgJe, mgIb + 21.0));
              float mgCr = (1.0 - smoothstep(0.0, 0.02 + mgJp, min(mgJf, 1.0 - mgJf)))*step(0.6, mgCh)*(1.0 - smoothstep(0.2, 0.5, mgJp))
                *(mgC2 < 0.5 ? 1.0 - smoothstep(0.35 + 0.8*mgC2, 0.5 + 0.8*mgC2, mgFb) : smoothstep(0.1 + 0.8*(mgC2 - 0.5), 0.25 + 0.8*(mgC2 - 0.5), mgFb));
              // under the lip of the bench above, a soft slate shadow: deepest under the lip, gone by the middle of the
              // riser, and deeper or shallower from one block to the next, so its lower edge is broken at every joint
              mgUl = smoothstep(0.4 + 0.22*mgH2(vec2(mgJi, mgIb + 5.0)), 0.95, mgFb)*(1.0 - smoothstep(0.975, 0.998, mgFb))*mgBw;
              // talus against the riser's foot: a ragged apron of broken stone, paler and mottled
              float mgTa = (1.0 - smoothstep(0.04, 0.12 + 0.18*mgVn(vec2(mgAng*0.21, mgIb*3.1)), mgFb))*smoothstep(0.003, 0.02, mgFb);
              // straw fern and dark moss hanging in tufts from the lip, here and there
              float mgTu2 = mgVn(vec2(mgAng*0.3 + mgIb*7.1, mgIb*3.7)), mgT3 = mgVn(vec2(mgAng*1.9, wp.y*0.9) + 11.0);
              float mgPlB = smoothstep(0.52, 0.66, mgTu2)*smoothstep(0.9 - 0.22*mgT3, 0.96, mgFb)*(1.0 - smoothstep(0.985, 0.999, mgFb));
              vec3 mgBc = mgRc*(mgBt*(1.0 - 0.3*mgCr));
              mgBc = mix(mgBc, mgBc*(1.0 + 0.5*mgVn(wp.xz*1.7 + wp.y*0.9)), 0.8*mgTa);
              mgBc *= mix(vec3(1.0), uMgFill*vec3(0.8, 0.95, 1.2)*(0.5/max(max(uMgFill.r, uMgFill.g), max(uMgFill.b, 1e-3))), 0.85*mgUl/max(mgBw, 1e-3));
              mgBc = mix(mgBc, mix(vec3(0.05, 0.09, 0.045), vec3(0.3, 0.23, 0.09), smoothstep(0.35, 0.7, mgVn(vec2(mgAng*0.9, mgIb*5.0) + 3.0)))*(0.6 + 0.8*mgT3), 0.85*mgPlB);
              mgRc = mix(mgRc, mgBc, mgBw);
            }
            float mgFres = 1.0 - max(dot(wnS, normalize(cameraPosition - wp)), 0.0); mgFres *= mgFres*mgFres;
            mgRc = mix(mgRc, uMgSheen, (0.04 + 0.45*mgFres)*(0.3 + 0.7*mgStk));
            diffuseColor.rgb = mix(diffuseColor.rgb, mgRc, mgRk);
            gMgRk = mgRk; gMgTone = clamp((mgProf*(1.0 - 0.6*max(mgSh, 0.7*mgUl)) - 0.68)/0.72, 0.0, 1.0);
            // (the bump is slight: a bed whose foot is turned right under loses the sun and the sky together and shows black;
            // in the bowl the beds have no relief of their own: its relief is the benches)
            bed = (clamp(bed, -0.5, 0.3) + mgRk*mgAa*(0.5*(1.0 - smoothstep(0.0, 0.3, mgFr)) - 1.2*smoothstep(0.82, 0.95, mgFr))*0.3)*(1.0 - 0.8*mgBw); }
          { float mgW = mgWater(wp.x) + uMgLand.y, mgD = abs(wp.z - mgZc(wp.x));
            float mgDry = wp.x < 13.0 ? max(smoothstep(mgW + 0.4, mgW + 1.0, wp.y), step(34.0, mgD)) : smoothstep(-60.7, -59.7, wp.y);
            float mgLat = ${pe.toFixed(1)} - wp.z;
            // (the bar's stream side is its waterline, which wanders: under the water nothing lies, so the mask needs no inner edge)
            float mgBx = mgBarX(wp.x, uMgBar), mgBarK = mgBx*smoothstep(0.0, 2.0, mgLat)*(1.0 - smoothstep(uMgBar.w - 1.5, uMgBar.w + 1.5, mgLat));
            float mgK = (1.0 - rock)*mgDry*(1.0 - 0.82*mgBarK);
            // THE WATERLINE: within a stride of the water the gravel and the stones are wet, dark and cool, the band wandering
            // with the edge (mgEdge, as the stream draws it) and breathing as the water laps; on the bar's gentle beach it
            // is two metres wide, on a steep bank a hand's breadth
            { float mgHw = wp.y - (mgW + 0.28) - uMgEdge.w*mgEdge(wp.xz)*mix(0.5, 1.0, mgBx) + 0.015*sin(uMgShK.z*1.3 + wp.x*0.9);
              gMgWetL = (1.0 - smoothstep(0.02, 0.13 + 0.07*tD.r, mgHw))*(1.0 - smoothstep(13.0, 16.0, wp.x))*(1.0 - smoothstep(26.0, 34.0, mgD));
              diffuseColor.rgb *= mix(vec3(1.0), vec3(0.4, 0.43, 0.5), gMgWetL*(1.0 - 0.5*rock)); }
            vec2 mgQ1 = wp.xz*3.1, mgQ2 = vec2(wp.x*0.8 + wp.z*0.6, -wp.x*0.6 + wp.z*0.8)*4.3 + 7.7;
            float mgF1 = fwidth(mgQ1.x) + fwidth(mgQ1.y);
            float mgDens = clamp(0.28 + 0.8*tD.r + 0.5*(tM.r - 0.5), 0.05, 0.95)*uMgLand.z;
            vec3 mgA = mgFleck(mgQ1, mgDens, mgF1*0.6), mgB = mgFleck(mgQ2, mgDens, mgF1*0.8);
            float mgFar = smoothstep(0.45, 1.5, mgF1);
            vec3 mgCa = uMgRamp[int(min(mgA.x*4.0, 3.0))]*(0.5 + 0.6*mgA.y), mgCb = uMgRamp[int(min(mgB.x*4.0, 3.0))]*(0.5 + 0.6*mgB.y);
            vec3 mgC = diffuseColor.rgb;
            mgC = mix(mgC, mgCa, mgA.z*mgK*(1.0 - mgFar));
            mgC = mix(mgC, mgCb, mgB.z*mgK*(1.0 - mgFar));
            mgC = mix(mgC, (uMgRamp[0] + uMgRamp[1] + uMgRamp[2] + uMgRamp[3])*0.2, mgFar*mgK*mgDens*0.34);
            diffuseColor.rgb = mgC; }
          { // far off, the floor of the upland is the closed wood seen from above: crowns in the leaf colours, each lit on its
            // top and dark where it meets the next (a rule in world coordinates: beyond uMgWood.x .. y metres from the stream)
            float mgAx = abs(wp.z - mgZc(wp.x));
            float mgWd = smoothstep(uMgWood.x, uMgWood.y, mgAx)*(1.0 - rock)*(1.0 - smoothstep(40.0, 70.0, wp.x));
            vec2 mgP = wp.xz/uMgWood.z;
            float mgSoft = smoothstep(0.35, 1.6, fwidth(mgP.x) + fwidth(mgP.y)), mgMot = mgVn(wp.xz*0.8);
            if (mgWd > 0.002) {
              vec2 mgI = floor(mgP), mgFp = fract(mgP), mgId = mgI; float mgD1 = 8.0, mgD2 = 8.0;
              for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
                vec2 o = vec2(float(x), float(y)), cc = mgI + o;
                vec2 r = o + 0.15 + 0.7*vec2(mgH2(cc), mgH2(cc + 31.7)) - mgFp; float dd = dot(r, r);
                if (dd < mgD1) { mgD2 = mgD1; mgD1 = dd; mgId = cc; } else if (dd < mgD2) { mgD2 = dd; }
              }
              float mgEd = sqrt(mgD2) - sqrt(mgD1), mgHh = mgH2(mgId + 5.5);
              vec3 mgCc = uMgCrown[int(min(mgHh*5.0, 4.0))]*(0.62 + 0.5*mgH2(mgId + 9.1));
              mgCc *= mix(0.42 + 0.8*smoothstep(0.0, 0.42, mgEd), 0.82, mgSoft)*(0.74 + 0.5*mgMot);
              diffuseColor.rgb = mix(diffuseColor.rgb, mgCc, mgWd);
            } }
          `+_+" gTWet = max(gTWet, 0.7*gMgWetL);"),H.uniforms.uMgEdge=b.uEdge}}else N=N.replace("#include <common>",`#include <common>
varying vec2 vMgW;`).replace("#include <project_vertex>",`#include <project_vertex>
vMgW = (cameraPosition + mvPosition.xyz*mat3(viewMatrix)).xz;`),l=l.replace("#include <common>",`#include <common>
varying vec2 vMgW;
`+ee+(P==="dome"?qt:"")),P==="dome"&&(N=N.replace("#include <common>",`#include <common>
attribute float aMgBark; varying vec3 vMgY;`).replace("#include <project_vertex>",`#include <project_vertex>
vMgY = vec3((modelMatrix*instanceMatrix*vec4(transformed, 1.0)).y, objectNormal.y, aMgBark);`),l=l.replace("#include <common>",`#include <common>
varying vec3 vMgY; uniform vec3 uMgDomeFill;`),H.uniforms.uMgDomeFill=b.uDomeFill,l=l.replace("#include <color_fragment>",`#include <color_fragment>
          { vec2 mgq = vMgW*0.5 + vMgY.x*vec2(0.37, 0.23);
            float mgm = wNoise(mgq)*0.45 + wNoise(mgq*2.6 + 5.0)*0.33 + wNoise(mgq*6.3 + 11.0)*0.22;
            float mgNdv = abs(dot(normalize(vNormal), normalize(vViewPosition)));
            // The wood round the bowl and beyond the pool (a rule in world coordinates: east of the brink) is looked down on
            // from the lip, a crown twenty or thirty pixels across: there each crown is clumps of leaves, lit on top and
            // dark in the hollows between them and beneath, sprays of leaves a metre across over the clumps, a ragged edge;
            // its trunk (aMgBark) is dark bark. So is any far crown the lens comes within 200 m of (a rule from distance:
            // on the descent the crowns of the flank stand close above us); the rest are as they were.
            float mgEast = smoothstep(70.0, 100.0, vMgW.x), mgNear = (1.0 - smoothstep(110.0, 200.0, length(vViewPosition)))*(1.0 - mgEast), mgRim = max(mgEast, mgNear), mgBk = step(0.5, vMgY.z);
            if (mgBk < 0.5 && mgNdv < 0.08 + mix(0.4, 0.62, mgRim)*wNoise(mgq*2.9 + 3.0)) discard;
            float mgOld = (0.55 + 0.85*smoothstep(0.28, 0.72, mgm))*(0.7 + 0.42*smoothstep(-0.5, 0.7, vMgY.y));
            float mgc1 = wNoise(mgq*0.56 + 17.0), mgc2 = wNoise(mgq*1.7 + 29.0), mgc3 = mix(0.5, wNoise(mgq*3.8 + 41.0), 1.0 - smoothstep(0.1, 0.26, fwidth(mgq.x) + fwidth(mgq.y)));   // (the finest eased away under a pixel: no sparkle)
            float mgCl = smoothstep(0.3, 0.7, mgc1*0.42 + mgc2*0.4 + mgc3*0.18), mgTop = smoothstep(-0.6, 0.7, vMgY.y);
            vec3 mgTex = mix(vec3(0.24, 0.2, 0.25), vec3(1.2, 1.16, 0.98), mgCl)*(mix(0.36, 1.12, mgTop)*(0.78 + 0.44*mgc3));
            mgTex *= mix(vec3(1.0), vec3(1.1, 1.18, 0.86), smoothstep(0.62, 0.92, mgCl)*mgTop);       // the lit clumps a shade toward gold
            diffuseColor.rgb *= mix(vec3(mgOld), mgTex, mgRim)*(1.0 - 0.34*mgNear);        // (close to, a tone lower: the low sun must not burn the clumps flat)
            diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.028, 0.024, 0.022), mgBk); }`)),l=l.replace("#include <aomap_fragment>","{ float mgM = mgPatchAt(vMgW)*(1.0 + uMgBurst.y*mgPatchA(vMgW)"+(P==="dome"?"*(1.0 - 0.5*smoothstep(70.0, 100.0, vMgW.x))":"")+`); reflectedLight.directDiffuse *= mgM; reflectedLight.directSpecular *= mgM; }
`+(P==="dome"?`reflectedLight.indirectDiffuse += diffuseColor.rgb*uMgDomeFill;
`:"")+"#include <aomap_fragment>");H.fragmentShader=l,H.vertexShader=N},a.customProgramCacheKey=function(){return(D?D.call(a):"")+"|mg-"+P},a.needsUpdate=!0,a}function gn(a,b){return new u.ShaderMaterial({fog:!0,side:u.DoubleSide,uniforms:{...u.UniformsUtils.clone(u.UniformsLib.fog),uTime:a.uTime,uPx:a.uPx,uMgPatch:a.uPatch,uMgPatch2:a.uPatch2,uSunCol:a.uSunCol,uSunDir:a.uSunDir,uHemiSky:a.uHemiSky,uHemiGround:a.uHemiGround,tMgShade:a.tShade,uMgShBox:a.uShBox,uMgShSun:a.uShSun,uMgShK:a.uShK,uEye:{value:b},uRiver:{value:new u.Vector4(-432,441,-1.5,27/420)},uLevel:a.uLevel,uS0:a.uS0},vertexShader:`
      attribute vec4 iA, iB; attribute vec3 iCol;
      uniform float uTime, uPx, uLevel; uniform vec3 uEye; uniform vec4 uRiver; uniform vec2 uS0;
      varying vec2 vQ, vW; varying vec3 vCol, vN; varying float vWet, vSh;
      ${Ka}
      ${Mt}
      ${i0}
      #include <fog_pars_vertex>
      void main(){
        float k = iB.x, fade = 1.0, spin = iB.z*uTime + iA.z*7.0;
        vec3 P; vec3 up = vec3(0.0, 1.0, 0.0);
        vWet = 1.0;
        if (k < 0.5) {
          float x = uRiver.x + mod(iA.x + iB.y*uTime, uRiver.y);
          P = vec3(x, uRiver.z + max(-x, 0.0)*uRiver.w + uLevel + 0.4 + 0.04*sin(uTime*3.0 + iA.z*9.0), ${pe.toFixed(1)} + iA.y + 0.5*sin(x*0.07 + iA.z*6.0));
          { vec4 wo; P.y += mgSurf(uS0.y + (x - uS0.x), P.z - ${pe.toFixed(1)}, 1.0 - smoothstep(-16.0, 3.0, x), uTime, wo) - 0.05; }   // it rides the standing waves of the stream
          fade = smoothstep(0.0, 14.0, x - uRiver.x)*(1.0 - smoothstep(uRiver.y - 6.0, uRiver.y, x - uRiver.x));
          up = normalize(vec3(0.25*sin(uTime*2.3 + iA.z*5.0), 1.0, 0.25*cos(uTime*1.9 + iA.z*3.0)));
        } else if (k < 1.5) {
          float tau = fract(iA.y + uTime*iB.y);
          float r = max(24.0*pow(1.0 - tau, 0.8) + 1.4 + iA.z*(0.4 + 1.5*(1.0 - tau)), 1.2);
          float ang = iA.x + iB.w*(0.4 + 6.0/(r + 4.0)) + 4.5*log(r + 1.0) - uTime*0.06;      // the same log spiral as the leaf mat under it
          P = uEye + vec3(cos(ang)*r, 0.06, sin(ang)*r);
          fade = smoothstep(0.0, 0.07, tau)*(1.0 - smoothstep(0.93, 1.0, tau));
        } else if (k < 2.5) {
          P = vec3(iA.x + iB.y*sin(uTime*0.11 + iA.z*6.0), uEye.y + 0.05, iA.y + iB.y*cos(uTime*0.09 + iA.z*6.0));
        } else {
          P = vec3(iA.x, iA.y + 0.05, iA.z); spin = iB.y; vWet = 0.0;
          float lift = iB.z*max(0.0, sin(uTime*(2.0 + 3.0*fract(iB.w*7.3)) + iB.w*40.0 + iA.x*0.3));
          up = normalize(vec3(0.5*sin(iB.w*31.0) + 0.8*lift, 1.0, 0.5*cos(iB.w*17.0)));
          P.y += lift*0.12;
        }
        vec3 e1 = normalize(cross(up, vec3(sin(spin), 0.0, cos(spin)))), e2 = cross(e1, up);
        vec4 mvc = viewMatrix*vec4(P, 1.0);
        float dist = length(mvc.xyz);
        float size = max(iA.w, 1.2*uPx*dist)*fade*smoothstep(0.8, 2.0, dist);
        vec3 wp = P + (position.x*e1 + position.y*e2)*size;
        vec4 mvPosition = viewMatrix*vec4(wp, 1.0);
        vQ = position.xy; vW = wp.xz; vCol = iCol; vN = up;
        vSh = mgSunShade(1.0, P, 28.0);                             // the whole leaf lies in the shade its middle lies in
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunCol, uSunDir, uHemiSky, uHemiGround;
      varying vec2 vQ, vW; varying vec3 vCol, vN; varying float vWet, vSh;
      ${Mt}
      ${Ia}
      #include <fog_pars_fragment>
      void main(){
        float d = mgLeaf(vQ);
        float fw = fwidth(d);
        d = mix(d, 0.82 - length(vQ - vec2(0.0, 0.05)), smoothstep(0.22, 0.6, fw));
        if (d < 0.0) discard;
        vec3 n = normalize(vN);
        float ax = abs(vQ.x), yy = vQ.y + 0.22;
        float vein = max(smoothstep(0.05, 0.0, ax), smoothstep(0.045, 0.0, abs(ax*0.62 - yy*0.78)*step(0.0, yy)))*(1.0 - smoothstep(0.02, 0.1, fw));
        vec3 col = vCol*(1.0 + 0.3*vein)*(0.8 + 0.2*smoothstep(0.0, 0.25, d));
        vec3 amb = mix(uHemiGround, uHemiSky, 0.5 + 0.5*n.y);
        vec3 c = col*0.3183*(uSunCol*max(dot(n, uSunDir), 0.0)*mgPatchAt(vW)*vSh + amb);
        c += vWet*amb*0.045;                                   // wet sheen takes the sky
        gl_FragColor = vec4(c, 1.0);
        #include <fog_fragment>
      }`})}function pn(a,b,P,te,D,H){return new u.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,uniforms:{...u.UniformsUtils.clone(u.UniformsLib.fog),uTime:a.uTime,uMgPatch:a.uPatch,uMgPatch2:a.uPatch2,uSunCol:a.uSunCol,uSunDir:a.uSunDir,uHemiSky:a.uHemiSky,uHemiGround:a.uHemiGround,uRamp:{value:a.ramp},uGlow:{value:b},uEyeXZ:{value:new u.Vector2(P.x,P.z)},uFoot:{value:new u.Vector2(te.x,te.z)},uSkyZ:{value:H.skyZ},uSkyH:{value:H.skyH},uRockC:{value:H.rock},uLeafA:{value:H.leafA},uLeafB:{value:H.leafB},uBody:{value:H.body},uRim:{value:H.rim??.35},uWake:{value:D},uWakeAge:a.uWakeAge,uWakeC:{value:H.wakeC},uFloorLo:{value:H.floorLo},uFloorHi:{value:H.floorHi},uSheenK:{value:H.sheenK}},vertexShader:`
      varying vec3 vWp;
      #include <fog_pars_vertex>
      void main(){ vec4 w = modelMatrix*vec4(position, 1.0); vWp = w.xyz; vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime, uWakeAge; uniform vec3 uSunCol, uSunDir, uHemiSky, uHemiGround, uRamp[4], uGlow, uSkyZ, uSkyH, uRockC, uLeafA, uLeafB, uBody; uniform vec2 uEyeXZ, uFoot; uniform float uRim, uSheenK; uniform vec3 uFloorLo, uFloorHi;
      uniform vec4 uWake[8];           // lift-off point x, z, heading, length of the pattered trail
      uniform vec3 uWakeC;             // middle of the wakes: x, z
      varying vec3 vWp;
      ${Mt}
      ${qt}
      ${mn}
      #include <fog_pars_fragment>
      void main(){
        vec2 vW = vWp.xz;
        float pxw = fwidth(vW.x) + fwidth(vW.y);                               // metres of water under one pixel
        vec2 pe = (vW - vec2(90.0, ${pe.toFixed(1)}))/vec2(74.0, 52.0);
        float re = length(pe);
        float shore = 1.0 - smoothstep(0.90, 0.955, re);
        if (re > 0.975) discard;
        vec3 amb = mix(uHemiGround, uHemiSky, 0.85);
        vec3 ambW = mix(amb, vec3(dot(amb, vec3(0.3333))), 0.65);            // the same light with its blue taken out: leaves keep their hue under it
        float sun = max(uSunDir.y, 0.0)*mgPatchAt(vW);
        // ----- the mirror: where the reflected ray meets the amphitheatre wall, rock below and the lit wood above; else sky
        vec3 V = normalize(cameraPosition - vWp);
        vec2 rip = vec2(wNoise(vW*0.55 + vec2(uTime*0.22, 0.0)), wNoise(vW*0.55 + vec2(7.0, -uTime*0.19))) - 0.5;
        rip += 0.5*(vec2(wNoise(vW*1.7 - vec2(uTime*0.4, 3.0)), wNoise(vW*1.7 + vec2(11.0, uTime*0.35))) - 0.5);
        vec3 n = normalize(vec3(rip.x*0.10, 1.0, rip.y*0.10));
        vec3 R = reflect(-V, n);
        float F = 0.02 + 0.98*pow(1.0 - max(dot(n, V), 0.0), 5.0);
        vec2 Rh = R.xz; float rl = max(length(Rh), 1e-3); vec2 D = (Rh/rl)/vec2(74.0, 52.0);
        float qa = dot(D, D), qb = dot(pe, D), qc = dot(pe, pe) - 1.0;
        float th = (-qb + sqrt(max(qb*qb - qa*qc, 0.0)))/max(qa, 1e-6);          // metres to the foot of the wall along the ray's heading
        vec2 hit = vW + (Rh/rl)*th;
        float wallH = 84.0*(1.0 - 0.9*smoothstep(50.0, 250.0, hit.x)) + 14.0*(wNoise(hit*0.04) - 0.5);
        float rise = (th + 9.0)*max(R.y, 0.0)/rl;                               // height where the ray meets it
        float wn = wNoise(hit*0.07 + rise*0.05);
        vec3 wood = mix(uLeafA, uLeafB, wn)*0.3183*(uSunCol*0.45*mgPatchAt(hit) + ambW*1.4);
        vec3 rockc = uRockC*0.3183*(uSunCol*0.22*mgPatchAt(hit) + amb*(1.0 + 0.5*wn));
        vec3 wall = mix(rockc, wood, smoothstep(0.62, 0.92, rise/max(wallH, 1.0) + 0.25*(wn - 0.5)));
        vec3 sky = mix(uSkyH, uSkyZ, smoothstep(0.0, 0.8, max(R.y, 0.0)));
        vec3 refl = mix(wall, sky, smoothstep(0.92, 1.12, rise/max(wallH, 1.0)));
        // the body: dark peat water whose surface can be seen. Its two tones are worked out in build() from this look's
        // exposure, tone curve, contrast and shadow tint, so that they show as luma 29 and 38 whatever the look: the grade's
        // contrast takes 0.03 off every tone after the tone curve, and a colour picked by eye here shows as pure black
        float bodyN = wNoise(vW*0.045 + vec2(3.0, uTime*0.006))*0.6 + wNoise(vW*0.16 - vec2(uTime*0.02, 5.0))*0.4;
        vec3 c = max(uBody*0.3183*(uSunCol*sun*0.5 + amb), mix(uFloorLo, uFloorHi, smoothstep(0.25, 0.75, bodyN))) + refl*F*(0.3 + 0.7*smoothstep(0.45, 0.85, re));
        // the wood on the rim lies mirrored round the outer third whatever the angle we look from: crowns and trunks drawn
        // inward from the shore in warm streaks, broken by the ripples; brightest under the sunlit wall
        vec2 dirN = pe/max(re, 1e-3);
        vec2 fp0 = vW - uFoot; float fd0 = length(fp0);
        float brk = smoothstep(0.3, 0.7, wNoise(vec2(fd0*1.1 - uTime*0.5, fp0.y*0.16) + rip*1.5)*0.65 + wNoise(vec2(fd0*2.9 - uTime*0.8, fp0.y*0.4 + 5.0))*0.35);   // ripple arcs running out from the fall
        float strk = wNoise(dirN*10.0 + re*0.8)*0.55 + wNoise(dirN*24.0 + 9.0 - re*1.3)*0.45;
        float band = smoothstep(0.7, 0.9, re + 0.14*(wNoise(dirN*2.6 + 4.0) - 0.5))*(1.0 - 0.6*smoothstep(0.9, 0.955, re));
        vec3 rimc = mix(uLeafA, uLeafB, smoothstep(0.3, 0.7, wNoise(dirN*4.3 + 7.0)))*0.3183*(uSunCol*0.5*mgPatchAt(vW) + vec3(1.0, 0.84, 0.66)*(dot(amb, vec3(0.3333))*1.3));
        c += rimc*(band*smoothstep(0.44, 0.66, strk)*(0.25 + 0.75*brk)*(1.0 - 0.38*smoothstep(-0.5, 0.3, pe.y))*uRim);
        // and the slate sky lies on the middle in soft cold patches
        float shn = wNoise(vW*0.04 + vec2(uTime*0.01, 3.0))*0.65 + wNoise(vW*0.11 + vec2(7.0, -uTime*0.013))*0.35;
        float finer = wNoise(vW*0.9 + vec2(uTime*0.11, -uTime*0.07) + rip*2.0);                                 // the wind's own small ripples in it
        c += mix(uSkyH, uSkyZ, 0.5)*(uSheenK*(0.1 + 0.9*smoothstep(0.36, 0.7, shn))*(1.0 - smoothstep(0.55, 0.92, re))*(0.62 + 0.38*brk)*(0.78 + 0.44*finer));
        float alpha = shore;
        // ----- the spiral of leaves and its dark eye
        vec2 vP = vW - uEyeXZ;
        float r = length(vP) + 1e-3, a = atan(vP.y, vP.x + 1e-4);
        float turn = -uTime*0.06;                                              // the whole figure turns; the leaves run in along its two arms
        float ph = 2.0*a - 9.0*log(r + 1.0) - 2.0*turn;
        float arm = 0.5 + 0.5*sin(ph);
        float ca = cos(turn), sa = sin(turn); vec2 rp = vec2(vP.x*ca + vP.y*sa, -vP.x*sa + vP.y*ca);
        float n1 = wNoise(rp*0.7), n2 = wNoise(rp*3.7);
        float mat = smoothstep(0.5, 0.86, arm + 0.3*(n1 - 0.5))*smoothstep(1.5, 4.0, r)*(1.0 - smoothstep(17.0, 27.0, r));
        mat *= 0.5 + 0.5*smoothstep(0.25, 0.6, n2);
        vec2 cell = floor(rp*5.5); float h = wHash(cell);
        vec3 lc = uRamp[int(min(h*4.0, 3.0))]*(0.55 + 0.7*wHash(cell + 7.7));
        vec3 leafc = lc*0.3183*(uSunCol*sun + ambW*1.3);
        float eye = 1.0 - smoothstep(0.6, 5.0, r);
        c = mix(c, leafc, mat*0.85);
        c = mix(c, uFloorLo*0.86, eye*0.8);
        // ----- foam: pale lace drawn out along the current that leaves the foot of the fall, the boil at the foot, ripple rings.
        // First where it lies (soft-edged, thinning with distance from the fall), then what it is: strands round dark holes of
        // water, thick where it lies thick, single threads and then flecks where it thins. Never a blotch with a hard edge.
        vec2 fp = vW - uFoot; float fd = length(fp) + 1e-3; float fa0 = atan(fp.y, fp.x + 1e-4);
        vec2 fq = vec2(fd*0.085 - uTime*0.05, fa0*(2.2 + fd*0.035));
        float fn = wNoise(fq)*0.6 + wNoise(fq*2.3 + 3.1)*0.4;
        fn += 0.22*(wNoise(vW*0.12 + vec2(uTime*0.01, 4.0)) - 0.5);
        float reach = exp(-fd/70.0);
        float clearW = 0.08 + 0.92*smoothstep(13.0, 26.0, distance(vW, uWakeC.xy));  // the ducks' water is clear of it
        float lie = smoothstep(0.58 - 0.26*reach, 0.96 - 0.26*reach, fn)*(0.25 + 0.75*reach)*smoothstep(3.0, 14.0, fd)*clearW;
        vec2 dr = vec2(uTime*0.06, uTime*0.02);
        float cellA = wNoise(vW*0.6 - dr), cellB = wNoise(vW*1.5 + dr*1.7 + 4.0), cellC = wNoise(vW*3.6 - dr*2.0 + 9.0);
        // the churn the fall drives out across the pool: a fan of white water breaking into streaks sixty metres from the foot
        float tz = fp.y/(9.0 + 0.16*max(fp.x, 0.0));
        vec2 cq = vec2(fp.x*0.3 - uTime*0.5, fp.y*0.36) + 1.6*vec2(cellA, cellB);
        float cn = wNoise(cq)*0.5 + wNoise(cq*2.7 + 5.0)*0.3 + wNoise(cq*6.1 + 11.0)*0.2, cth = 0.62 - 0.4*exp(-max(fp.x, 0.0)/26.0);
        float churn = exp(-tz*tz)*smoothstep(2.0, 14.0, fp.x)*(1.0 - smoothstep(40.0, 78.0, fp.x))*smoothstep(cth - 0.12, cth + 0.28, cn)*clearW;
        float thick = clamp(max(lie*1.25, churn*1.6), 0.0, 1.0);
        vec2 lq = vec2(fd*0.22 - uTime*0.1, fa0*fd*0.4) + 0.45*vec2(cellA, cellB);       // cells drawn out along the current that carries them from the fall
        float e1 = wCell(lq);
        // the threads between the cells are hair-fine where the foam lies thin and broaden as it thickens, until the holes
        // close into froth: so a raft has no edge, it thins away into single threads
        float s1 = 0.11 + pxw*0.5, w1 = (0.5 + s1)*thick - s1;
        float thread = 1.0 - smoothstep(w1 - s1, w1 + s1, e1);
        float lace = max(thread*(0.6 + 0.4*thick), smoothstep(0.5, 1.0, thick)*0.8);
        float fleck = smoothstep(0.74, 0.9, cellB*0.45 + cellC*0.55)*smoothstep(0.34 - 0.26*reach, 0.8 - 0.26*reach, fn)*smoothstep(3.0, 14.0, fd)*clearW*0.5;
        float boil = exp(-fd*fd/460.0)*smoothstep(0.35, 0.75, wNoise(fp*0.5 - vec2(uTime*0.8, 0.0))*0.6 + wNoise(fp*1.7 + uTime*0.5)*0.4);
        float rings = (0.5 + 0.5*sin(fd*0.9 - uTime*2.4))*exp(-fd/55.0)*smoothstep(4.0, 16.0, fd);
        float edge = smoothstep(0.9, 0.945, re)*smoothstep(0.36, 0.7, wNoise(vW*0.45 + vec2(uTime*0.07, 2.0))*0.6 + (cellA*0.45 + cellB*0.35 + cellC*0.2)*0.4)*0.7;     // a broken pale fringe along the rock
        // ----- wakes: where each duck pattered across the water and lifted off, one thin bright V, no wider than the bird
        float wk = 0.0, wsg = max(0.14, 0.7*pxw);
        for (int i = 0; i < 8; i++) {
          vec4 w = uWake[i];
          vec2 d = vW - w.xy; float cw = cos(w.z), sw = sin(w.z);
          float al = -(d.x*cw + d.y*sw), ac = abs(-d.x*sw + d.y*cw);            // metres behind the lift-off point, metres off its line
          float alp = max(al, 0.0), len = w.w*0.44, hw = 0.08 + (0.11 + 0.003*uWakeAge)*alp + 0.1*sin(al*1.3 + float(i)*2.1);
          float arms = exp(-(ac - hw)*(ac - hw)/(wsg*wsg))*smoothstep(-0.3, 0.4, al)*(1.0 - smoothstep(len*0.15, len, al))*(0.7 + 0.3*sin(al*3.1 + float(i)));
          float pat = exp(-ac*ac/(wsg*wsg))*(0.5 + 0.5*cos(al*4.6))*smoothstep(0.2, 0.8, al)*(1.0 - smoothstep(1.5, 4.5, al))*0.55;   // the last few splashes of its feet
          wk = max(wk, max(arms, pat)*(1.0 - 0.025*uWakeAge));
        }
        float white = clamp(churn + boil + wk, 0.0, 1.0);
        vec3 foamC = vec3(0.8, 0.82, 0.82)*0.3183*(uSunCol*sun + amb*(1.9 + 1.1*white));   // the churn and the wakes white, the far lace pale
        float fa = clamp(max(lace + fleck + boil*0.8 + edge, wk*0.85), 0.0, 1.0)*(1.0 - eye)*(1.0 - 0.85*mat);
        c = mix(c, foamC, fa);
        c += uHemiSky*0.3183*0.18*rings*rings*(1.0 - fa)*(1.0 - mat);          // ripple rings carry a little sky
        float g = exp(-r*r/50.0)*0.42 + exp(-r*r/120.0)*0.1;                    // the ring's light on the water: a pool of cream two rings wide
        c += uGlow*g*(0.7 + 0.3*n2);
        gl_FragColor = vec4(c, alpha);
        #include <fog_fragment>
      }`})}const Ka=`
  float mgLh(float n){ vec2 p = fract(vec2(n, n + 3.7)*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.y); }
  float mgLedgeS(float s, float lat){
    float ls = s + lat*0.3*sin(s*0.083 + 1.0) + 0.6*sin(lat*0.9 + s*0.05) + 1.5*sin(lat*0.43 + 2.6*sin(s*0.017)) + 0.45*sin(lat*2.1 + s*0.3);
    return ls + 6.0*sin(ls*0.031) + 3.2*sin(ls*0.071 + 1.7);                 // the spacing wanders: no two reaches the same length
  }
  // metres the surface stands above the mean plane of the falling water. o = (metres below the ledge, how far inside the
  // tongue 0..1, the strength of this ledge 0.5..1.1, the height of the wave train here -1..1)
  float mgSurf(float s, float lat, float k, float tm, out vec4 o){
    float q = mgLedgeS(s, lat)/11.0, lid = floor(q), p = q - lid, tt = p*11.0;
    float amp = 0.5 + 0.6*mgLh(lid);
    float gc = (mgLh(lid + 0.37) - 0.5)*6.0, gw = 1.5 + 2.2*mgLh(lid + 0.71), dl = abs(lat - gc);
    float tong = 1.0 - smoothstep(gw*0.55, gw*1.5, dl);
    float fall = p - smoothstep(0.0, 0.1, p) + 0.35;                          // the pool stands level; the ledge drops it
    float env = exp(-tt*0.2)*smoothstep(0.0, 0.9, tt)*(1.0 - smoothstep(0.72, 0.98, p));
    float tr = sin(tt*1.9 - 2.2 - 0.3*dl + 0.5*sin(lat*0.8 + lid*4.0))*env;
    float A = (0.09 + 0.37*tong)*(1.0 + 0.1*sin(tm*1.7 + lid*2.4));
    o = vec4(tt, tong, amp, tr);
    return (0.34*fall + A*tr)*amp*k;
  }
`;function wn(a,b){return new u.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,uniforms:{...u.UniformsUtils.clone(u.UniformsLib.fog),uTime:a.uTime,uMgPatch:a.uPatch,uMgPatch2:a.uPatch2,uSunCol:a.uSunCol,uSunDir:a.uSunDir,uHemiSky:a.uHemiSky,uHemiGround:a.uHemiGround,tMgShade:a.tShade,uMgShBox:a.uShBox,uMgShSun:a.uShSun,uMgShK:a.uShK,uMgBar:a.uBar,uMgEdge:a.uEdge,uSkyZ:{value:b.skyZ},uSkyH:{value:b.skyH},uWallC:{value:b.wall},uLeafA:{value:b.leafA},uLeafB:{value:b.leafB},uBirch:{value:b.birch},uMapleC:{value:b.maple},uDeep:{value:b.deep},uBedC:{value:b.bed},uFoam:{value:b.foam},uShade:{value:b.shade},uRamp:{value:a.ramp},uLeafDens:{value:b.leafDens},uFloorS:{value:b.floor},uLaneK:{value:b.laneK},uSheenS:{value:b.sheenK},uCrestK:{value:b.crestK},uWhiteK:{value:b.whiteK},uFloorR:{value:b.floorR},uCoolS:{value:b.cool}},vertexShader:`
      attribute vec4 aS;       // metres from the centre line, metres along, drop per metre, half width of the water
      attribute float aD;      // metres of water over the bed here (under zero: dry bank)
      uniform float uTime;
      varying vec4 vS; varying vec3 vWp; varying float vK, vD;
      ${Ka}
      #include <fog_pars_vertex>
      void main(){
        vS = aS; vD = aD;
        vK = clamp(aS.z/0.064, 0.15, 1.7)*(1.0 - smoothstep(-16.0, 3.0, position.x))*smoothstep(0.0, 0.9, aD);
        vec4 wo;
        vec3 p = position; p.y += mgSurf(aS.y, aS.x, vK, uTime, wo);
        vec4 w = modelMatrix*vec4(p, 1.0); vWp = w.xyz; vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime, uFoam, uShade, uLeafDens, uLaneK, uSheenS, uCrestK, uWhiteK; uniform vec4 uMgBar;
      uniform vec3 uSunCol, uSunDir, uHemiSky, uHemiGround, uSkyZ, uSkyH, uWallC, uLeafA, uLeafB, uBirch, uMapleC, uDeep, uBedC, uRamp[4], uFloorS, uFloorR, uCoolS;
      varying vec4 vS; varying vec3 vWp; varying float vK, vD;
      ${Mt}
      ${i0}
      ${us}
      ${qt}
      ${Ka}
      ${Ia}
      #include <fog_pars_fragment>
      vec3 wNoiseD(vec2 p){                                                     // value noise and its gradient
        vec2 i = floor(p), f = fract(p), u = f*f*f*(f*(f*6.0 - 15.0) + 10.0), du = 30.0*f*f*(f - 1.0)*(f - 1.0);   // quintic: the slope has no creases at the lattice
        float a = wHash(i), b = wHash(i + vec2(1., 0.)), c = wHash(i + vec2(0., 1.)), d = wHash(i + vec2(1., 1.)), k = a - b - c + d;
        return vec3(a + (b - a)*u.x + (c - a)*u.y + k*u.x*u.y, du*vec2((b - a) + k*u.y, (c - a) + k*u.x));
      }
      vec3 mgCobble(vec2 p){                                                    // the stone here (its id), and how far in from its edge
        vec2 i = floor(p), f = fract(p), id = i; float d1 = 8.0, d2 = 8.0;
        for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
          vec2 o = vec2(float(x), float(y)), cc = i + o;
          vec2 r = o + 0.12 + 0.76*vec2(wHash(cc), wHash(cc + 31.7)) - f; float dd = dot(r, r);
          if (dd < d1) { d2 = d1; d1 = dd; id = cc; } else if (dd < d2) { d2 = dd; }
        }
        return vec3(id, sqrt(d2) - sqrt(d1));
      }
      // a fallen leaf riding the water in this cell: (which colour, its shade, how much of the pixel it covers)
      vec3 mgRider(vec2 q, float dens, float pl, float spin){
        vec2 id = floor(q), f = fract(q) - 0.5; float h = wHash(id), h2 = wHash(id + 17.3);
        if (fract(h*5.3) > dens) return vec3(h2, h, 0.0);
        vec2 g = f - (vec2(h2, fract(h2*7.13)) - 0.5)*0.42;
        float a = h*6.283 + spin*(h2 - 0.5), ca = cos(a), sa = sin(a), sz = 0.16 + 0.06*fract(h*11.3);
        g = vec2(g.x*ca + g.y*sa, -g.x*sa + g.y*ca)/sz;
        float w = pl/sz;                                                        // a pixel, in the leaf's own measure
        float dl = mix(mgLeaf(g), 0.8 - length(g), smoothstep(0.25, 0.7, w));
        return vec3(h2, h, smoothstep(-0.5*w, 0.5*w, dl)*(1.0 - smoothstep(0.9, 2.2, w)));
      }
      void main(){
        float hw = vS.w, lat = clamp(vS.x, -(hw + 3.1), hw + 3.1), s = vS.y, slope = vS.z, t = uTime, k = vK;   // (lat: clamped to the ribbon's own half width, hw + 3.1 m)
        // ----- the shape of the surface in this reach: the drop at the ledge, the tongue through its gap, the waves below
        const float e = 0.3;
        vec4 wi, wj;
        float h0 = mgSurf(s, lat, k, t, wi), hs = mgSurf(s + e, lat, k, t, wj), hl = mgSurf(s, lat + e, k, t, wj);
        float tt = wi.x, tong = wi.y, lamp = wi.z, trn = wi.w, p = tt/11.0;
        // the water laps in and out along the bank
        // (and its edge wanders in scallops, the same the land's wet band follows: most along the gravel bar, on our left)
        float barX = mgBarX(vWp.x, uMgBar), barK = barX*smoothstep(0.5, -1.5, lat);
        float depth = vD + (0.05*sin(t*1.3 + s*0.9) + 0.04*sin(t*2.1 - s*1.7 + lat*0.8) + uMgEdge.w*mgEdge(vWp.xz)*mix(0.5, 1.0, barX))*(1.0 - smoothstep(0.0, 0.5, vD));
        float aEdge = smoothstep(0.0, 0.08, depth);
        if (aEdge <= 0.0) discard;
        float px = fwidth(s) + fwidth(lat);                                      // metres of water under one pixel
        float o1 = 1.0 - smoothstep(0.3, 1.0, px), o2 = 1.0 - smoothstep(0.12, 0.42, px), o3 = 1.0 - smoothstep(0.05, 0.17, px), mid = 1.0 - smoothstep(1.5, 5.0, px);
        float steep = smoothstep(0.03, 0.15, slope);
        float lid = floor(mgLedgeS(s, lat)/11.0);
        // the steep reach at the head of the gorge is cascades (casc): every ledge a white chute, dark tea in the pool below
        float casc = steep*smoothstep(1.05, 1.5, k), run = 1.0 - casc;
        float wk = smoothstep(0.15, 0.75, k);
        float chute = 1.0 - smoothstep(0.17, 0.4 + 0.08*wNoise(vec2(lat*0.6, lid*5.1)), p);
        float gapc = (mgLh(lid + 0.37) - 0.5)*6.0, gapw = 1.5 + 2.2*mgLh(lid + 0.71), dl = abs(lat - gapc);
        float tongue = mix(tong, max(smoothstep(0.45, 0.75, wNoise(vec2(lat*0.33 + lid*7.3, lid*3.1))), tong), casc);
        float brk = (1.0 - 0.88*tongue)*mix(1.0, 0.12 + 0.88*smoothstep(0.34, 0.58, wNoise(vec2(lat*0.62 + lid*3.7, lid*1.9 + 4.0))), run);   // where the ledge breaks the water white: in lengths, with dark slides between
        float lipG = smoothstep(0.84, 0.97, p);                                  // the slick that slides to the next drop
        float riffle = clamp((1.0 - smoothstep(0.05, 0.6, p))*lamp*(1.0 - 0.6*tongue) + 0.5*steep*mix(1.0, chute, casc), 0.0, 1.0)*(0.35 + 0.65*wk);
        // ----- the normal: the waves the mesh carries, then three sizes of ripple carried on the flow
        float rough = (0.3 + 0.7*riffle)*(1.0 - 0.6*lipG);
        vec3 r1 = wNoiseD(vec2((s - t*1.3)*0.85 + lat*0.2, lat*0.55));
        vec3 r2 = wNoiseD(vec2((s - t*2.4)*2.2 - lat*0.5, lat*1.8) + 7.0);
        vec3 r3 = wNoiseD(vec2((s - t*3.6)*5.6 + lat*1.3, lat*4.9) + 19.0);
        vec2 gW = clamp(vec2(hs - h0, hl - h0)/e, -1.3, 1.3)*mix(0.3, 1.0, mid);
        vec2 g = gW;
        g += vec2(r1.y*0.85, r1.y*0.2 + r1.z*0.55)*(0.05*o1*rough);
        g += vec2(r2.y*2.2, -r2.y*0.5 + r2.z*1.8)*(0.05*o2*rough);
        g += vec2(r3.y*5.6, r3.y*1.3 + r3.z*4.9)*(0.019*o3*(0.4 + 0.6*rough));
        vec3 n = normalize(vec3(-g.x, 1.0, -g.y));
        vec3 V = normalize(cameraPosition - vWp);
        float ndv = clamp(dot(n, V), 0.0, 1.0);
        float F = 0.07 + 0.93*pow(1.0 - ndv, 5.0);
        // ----- the mirror. Down the gorge the reflected ray finds the open sky: a bright lane along the middle of the stream.
        // To either side it finds the trees on the banks (crowns in leaf colours over pale trunks and the dark bank), and at
        // the far end of the straight, low on the axis, the great maple.
        vec3 R = reflect(-V, n); R.y = abs(R.y) + 0.015;
        float rh = max(length(R.xz), 1e-3), ry = R.y/rh; vec2 hd = R.xz/rh;
        float sideZ = hd.y > 0.0 ? 1.0 : -1.0;
        float tb = (12.5 - sideZ*lat)/max(abs(hd.y), 0.02);                       // metres to the bank along the ray's heading
        float bx = vWp.x + hd.x*tb, by = ry*tb;                                  // where it arrives: along the bank, above the water
        float top = (10.0 + 7.0*wNoise(vec2(bx*0.12, sideZ*3.0)))*mix(0.45, 1.0, smoothstep(0.25, 0.5, wNoise(vec2(bx*0.045, sideZ*7.0 + 2.0))));
        vec3 crown = mix(uWallC*0.5, mix(uLeafA, uLeafB, smoothstep(0.3, 0.7, wNoise(vec2(bx*0.21, by*0.25 + sideZ*5.0)))), 0.74)*(0.4 + 0.85*wNoise(vec2(bx*0.55, by*0.7)))*(sideZ > 0.0 ? 0.8 : 1.1);
        float trunk = smoothstep(0.8, 0.88, wNoise(vec2(bx*1.4, sideZ*9.0)));
        vec3 bank = mix(uWallC*(0.22 + 0.2*wNoise(vec2(bx*0.3, sideZ*4.0))), uBirch, trunk*0.6);   // the shaded foot of the bank: dark in the water, pale trunks drawn down through it
        vec3 trees = mix(bank, crown, smoothstep(3.0, 7.5, by));
        vec3 sky = mix(mix(uSkyH, uSkyZ, smoothstep(0.0, 0.9, ry)), uCoolS, 0.55);     // the open sky in dark water: this look's own slate-blue
        // straight overhead the crowns of the bank trees close over most of the sky: the water under the lens mirrors leaf
        // and shadow with gaps of sky between (the ray is followed up to the height of the crowns: each face finds its own)
        vec2 hp = vWp.xz + R.xz*(13.0/max(R.y, 0.07));
        float cano = smoothstep(0.34, 0.5, wNoise(hp*vec2(0.035, 0.09) + 5.0)*0.6 + wNoise(hp*vec2(0.09, 0.23))*0.4)*(1.0 - smoothstep(0.035, 0.13, px));
        sky = mix(sky, mix(uLeafA, uLeafB, wNoise(hp*vec2(0.05, 0.13) + 1.0))*(0.3 + 0.5*wNoise(hp*vec2(0.16, 0.4) + 9.0)), cano*0.9);
        vec3 refl = mix(trees, sky, smoothstep(top*0.55, top*1.25, by));
        float mapleK = (1.0 - smoothstep(0.03, 0.16, abs(hd.y)))*step(0.0, hd.x)*smoothstep(0.015, 0.05, ry)*(1.0 - smoothstep(0.1, 0.24, ry))*(1.0 - smoothstep(-60.0, -15.0, vWp.x));
        refl = mix(refl, uMapleC, mapleK*0.8);
        // (the bank trees' shade lies across the water too: foam and riding leaves are lit in the gaps and slate-blue in it)
        float pch = mgSunShade(mgPatchAt(vWp.xz)*uShade, vWp, 28.0), sunY = max(uSunDir.y, 0.0);
        vec3 amb = mix(uHemiGround, uHemiSky, 0.85);
        vec3 ambW = mix(amb, vec3(dot(amb, vec3(0.3333))), 0.6);
        // ----- under the surface: tea-brown water over a cobbled bed. Dark tea wherever there is half a metre of it; only
        // along the very margin, where the bed shelves up to the stones of the bank, a ragged amber shallow with the cobbles
        // dim under it. The channel's tone is worked out in build() to show as luma 25 under this look's grade: never black.
        float dv = max(depth + 0.3*(wNoise(vec2(s*0.3, lat*0.6)) - 0.5), 0.0);
        vec3 cb = mgCobble(vWp.xz*2.7 + n.xz*(0.5 + dv));
        float stone = (0.78 + 0.44*wHash(cb.xy + 3.3))*(0.84 + 0.16*smoothstep(0.0, 0.25, cb.z));
        // the bar shelves into the stream under a hand of water: there the bed is the bar's own pale cobbles, each stone
        // and the dark seam round it showing amber through the tea
        float shelf = barK*(1.0 - smoothstep(0.2, 0.6, depth));
        stone += shelf*((stone - 1.0)*0.6 - 0.22*(1.0 - smoothstep(0.0, 0.16, cb.z)));
        vec3 bed = uBedC*mix(1.0, stone, o2)*(0.42 + 0.3*wNoise(vWp.xz*0.4))*(1.0 + 0.8*shelf);
        vec3 tea = exp(-vec3(1.3, 1.8, 2.6)*dv*2.3);                             // what the water lets back up: amber over the first hand of depth, then nothing
        vec3 body = (bed*tea + uDeep*(1.0 - tea.r))*0.3183*(uSunCol*(sunY*pch*0.8) + ambW*2.6);
        body = max(body, mix(uFloorS, uFloorR, run)*(0.85 + 0.3*wNoise(vec2((s - t*1.1)*0.11, lat*0.5) + 13.0)));   // the channel: dark tea, the palette's own dark, never caramel
        body += uFloorS*vec3(1.5, 0.85, 0.3)*(0.8*lipG*lamp*(1.0 - 0.5*tongue)*run*wk);   // sliding thin over the ledge the tea is lit through: amber
        refl = max(refl, uFloorR*(1.05*run));                                             // the shaded bank in the water is dark tea, not a black bar
        float Fm = clamp(F, 0.0, 1.0)*(1.0 - 0.72*casc)*(1.0 - 0.7*run);                           // fast broken water is no mirror: the cascades are tea and white, not a sheet of sky
        vec3 c = mix(body, refl, Fm);
        // each standing wave: a trough of dark tea on the face that leans toward us, the cold sky on the back that leans away
        vec2 Vh = V.xz/max(length(V.xz), 1e-3);
        float away = dot(gW, Vh);
        float back = smoothstep(0.03, 0.42, away), face = smoothstep(0.03, 0.42, -away);
        c *= 1.0 - 0.3*face*run;
        c += uCoolS*(uCrestK*0.7*back*run*(0.45 + 0.55*smoothstep(0.3, 0.7, r2.x)));
        // down the middle of the channel the slack water mirrors the open sky between the two walls of trees: not a sheet but
        // the ripple faces that are tilted to it, wandering from side to side with the current
        float laneC = hw*0.3*sin(s*0.045 + 1.0), laneW = hw*(0.25 + 0.08*sin(s*0.021));
        float skyLane = exp(-(lat - laneC)*(lat - laneC)/(laneW*laneW));
        float facet = smoothstep(0.34, 0.68, r1.x*0.55 + r2.x*0.45);
        float laneAmt = mix(mix(0.6, 0.22 + 0.78*facet, o2), 0.7*mix(0.32, 0.04 + 0.96*facet, o2), run);
        c += uCoolS*(uLaneK*skyLane*laneAmt*(1.0 - clamp(F*1.6, 0.0, 1.0))*(1.0 - 0.6*riffle)*(1.0 - 0.6*casc));
        // the low sun down the gorge is a path of sparks on the ripple faces that find it, not a pale sheet laid over the water
        float sunR = max(dot(R, uSunDir), 0.0);
        float spark = smoothstep(0.58, 0.8, r3.x)*smoothstep(0.35, 0.65, r2.x);
        c += min(uSunCol*pch*(0.9*pow(sunR, 900.0) + pow(sunR, 110.0)*mix(0.07, 1.3*spark, o3)), vec3(0.8));      // (capped: at dawn the sun down the gorge blew a white flare 80 px across)
        // small glints where a steep ripple finds the brightest of the sky
        float gl = smoothstep(0.62, 0.9, r3.x)*smoothstep(0.5, 0.8, r2.x)*o3;
        c += uSkyH*(0.55*gl*(0.3 + 0.7*rough));
        // and soft patches of sky sheen, so the dark water between the leaves is never one flat tone
        float sheen = smoothstep(0.4, 0.85, wNoise(vec2((s - t*2.0)*0.45 + lat*0.7, lat*1.9 - s*0.17) + 33.0)*0.6 + r2.x*0.4)*o2;
        c += uCoolS*(uSheenS*sheen*(0.4 + 0.6*rough)*(1.0 - 0.5*lipG));
        // between the white the deep water is dark and cool: what it mirrors of the banks' leaves is drawn most of the way to
        // the sky's slate (the amber of the margin and of the thin slide over a ledge is left as it is)
        { const vec3 LW = vec3(0.2126, 0.7152, 0.0722);
          float lc = dot(c, LW), lf = max(dot(uFloorR, LW), 1e-4), ls = max(dot(uCoolS, LW), 1e-4);
          vec3 hue = mix(uFloorR/lf, uCoolS/ls, smoothstep(lf*1.3, lf*5.0, lc));         // the palette's dark in the troughs, its cool on the lit backs
          c = mix(c, hue*lc, 0.72*run*smoothstep(0.2, 0.7, dv)*(1.0 - 0.8*lipG*lamp)); }
        // ----- fallen leaves riding the water, gathered into lanes and rafts by the current (none in the tongues and the white
        // water: they are swept through); far off, their colour
        float cellA = 0.95, cellB = 0.74;
        vec2 qa = vec2(s - t*2.5, lat + 0.5*sin(s*0.11))/cellA, qb = vec2(s - t*3.2 + 40.0, lat*0.97 + 0.4*sin(s*0.07 + 2.0) + 13.0)/cellB;
        float lane = smoothstep(0.38, 0.66, wNoise(vec2((s - t*2.5)*0.045, lat*0.42) + 3.0))*0.7 + smoothstep(0.5, 0.8, wNoise(vec2((s - t*3.2)*0.11, lat*1.1) + 9.0))*0.5 + 0.35*(1.0 - smoothstep(0.1, 0.7, depth));
        float dens = clamp((0.04 + 0.62*lane)*uLeafDens*mix(1.0, 0.6, run), 0.0, 0.9)*(1.0 - 0.75*riffle)*(1.0 - 0.85*run*tong*(1.0 - smoothstep(5.0, 9.0, tt)));
        vec3 la = mgRider(qa, dens, px/cellA, t*0.5), lb = mgRider(qb, dens*0.8, px/cellB, -t*0.4);
        vec3 leafLight = 0.3183*(uSunCol*(sunY*pch*0.8) + ambW*1.9);              // embers on the dark water
        vec3 lca = uRamp[int(min(la.x*4.0, 3.0))]*(0.55 + 0.6*la.y)*leafLight, lcb = uRamp[int(min(lb.x*4.0, 3.0))]*(0.55 + 0.6*lb.y)*leafLight;
        float farL = smoothstep(0.35, 0.8, px);
        vec3 leafMean = (uRamp[0] + uRamp[1] + uRamp[2] + uRamp[3])*0.21*leafLight;
        // ----- white water, only where something makes it. Foam is froth: a soft-edged patch (where it lies) times a fine
        // broken texture of bubbles carried on the flow; nothing of it is drawn out along the flow longer than a stride.
        float sf = s - t*4.2;
        float frothN = wNoise(vec2(sf*2.4 + lat*1.3, lat*5.4 - sf*0.6) + 51.0)*0.55 + wNoise(vec2(sf*5.8 - lat*2.9 + 3.0, lat*12.5 + sf*1.4))*0.45;
        float froth = mix(0.7, smoothstep(0.2, 0.7, frothN), 0.5*o2);
        float patchN = wNoise(vec2(sf*0.33 + lat*0.45, lat*1.3 - sf*0.09) + 9.0)*0.6 + wNoise(vec2(sf*0.9 - lat*0.8 + 5.0, lat*3.1 + sf*0.2))*0.4;
        float str = wNoise(vec2(sf*0.5, lat*4.4))*0.5 + frothN*0.5;
        float str2 = wNoise(vec2(sf*0.6, lat*5.5) + 3.0)*0.6 + wNoise(vec2(sf*1.7, lat*13.0) + 8.0)*0.4;
        float blobN = wNoise(vec2(sf*0.55 + lat*0.2, lat*0.95) + 23.0)*0.6 + wNoise(vec2(sf*1.4 - lat*0.5, lat*2.3) + 5.0)*0.4;   // rafts: two to one along the flow
        float curtain = (1.0 - smoothstep(0.008, 0.028, p))*(1.0 - 0.92*tongue)*mix(1.0, brk, run)*smoothstep(0.5, 0.8, lamp + 0.3*steep)*(0.55 + 0.45*froth);
        // the cascades: a white chute three or four metres long under every ledge, threads of foam on the dark pool below it
        float fall = 1.0 - smoothstep(0.04, 0.2 + 0.65*steep*(1.0 - 0.7*casc), p);
        float th = mix(0.3, 0.72, smoothstep(0.02, 0.2 + 0.5*steep, p)) + 0.28*tongue - 0.14*steep - 0.06*uFoam + 0.2*(0.8 - lamp);
        float apron = fall*smoothstep(th - 0.05, th + 0.2, mix(patchN, str2, 0.65))*(0.4 + 0.6*froth);
        float rapids = max(chute*smoothstep(0.22, 0.5, mix(patchN, str2, 0.6*o1))*(1.0 - 0.75*tongue)*(0.5 + 0.5*froth),
                           (1.0 - chute)*0.55*smoothstep(0.66, 0.82, str2*0.7 + patchN*0.3)*froth);
        float crestC = smoothstep(0.12, 0.3, trn)*exp(-tt*0.15)*smoothstep(0.42, 0.7, patchN)*(1.0 - 0.6*tongue)*lamp*(0.2 + 0.8*froth)*0.8;
        float foamC = max(max(max(curtain, apron), crestC), rapids);
        // the run: the boil in the hole under each breaking ledge; white caps on the waves that stand below the tongue (the
        // first always breaks, the second where the ledge is a big one); the V of broken water down the tongue's two
        // shoulders; and the foam torn from all of these, riding down the pool in rafts and flecks that thin as they go
        float boil = smoothstep(0.1, 0.5, tt)*(1.0 - smoothstep(1.0 + 1.8*lamp*patchN, 2.0 + 3.0*lamp*patchN, tt))*brk*smoothstep(0.5, 0.8, lamp + 0.25*patchN)*(0.5 + 0.5*froth);
        float cap = smoothstep(0.36 - 0.12*lamp, 0.6, trn + 0.2*(blobN - 0.5))*smoothstep(0.15, 0.6, tong)*smoothstep(0.5, 0.75, lamp + 0.3*patchN);
        float vW = gapw*(1.05 - 0.2*tt);
        float vee = exp(-(dl - vW)*(dl - vW)/0.14)*smoothstep(0.0, 0.4, tt)*(1.0 - smoothstep(2.8, 4.6, tt))*smoothstep(0.3, 0.6, lamp)*(0.35 + 0.65*smoothstep(0.3, 0.6, blobN));
        float shed = clamp((0.2 + 0.8*brk + 0.6*tong*smoothstep(1.5, 2.6, tt))*lamp*exp(-max(tt - 2.0, 0.0)*0.28)*smoothstep(0.5, 2.0, tt), 0.0, 1.0);
        float raft = smoothstep(0.8 - 0.3*shed, 0.93 - 0.27*shed, blobN)*smoothstep(0.05, 0.3, shed)*(0.45 + 0.55*froth);
        float foamR = max(max(curtain, boil), max(max(cap, vee), raft*0.9));
        float thread = smoothstep(0.78, 0.86, wNoise(vec2((s - t*3.4)*mix(0.2, 0.62, run), lat*2.4) + 21.0)*0.8 + 0.2*str)*(0.2 + 0.3*uFoam)*(1.0 - 0.5*lipG)*(0.35 + 0.65*froth)*mix(1.0, 0.7, run);
        float bub = smoothstep(0.66, 0.74, frothN)*smoothstep(0.45, 0.7, patchN)*o3*riffle*0.6;
        float lace = (1.0 - smoothstep(0.03, 0.3, depth))*smoothstep(0.45, 0.68, wNoise(vec2(s*0.8 - t*0.5, lat*1.7)))*(0.25 + 0.75*froth)*0.7;   // a broken line of froth where it laps the stones
        float brink = smoothstep(-9.0, 9.0, vWp.x)*smoothstep(0.4, 0.62, patchN)*(0.3 + 0.7*froth)*0.85;      // drawn white as it gathers speed for the lip
        // BESIDE THE GRAVEL BAR the stream runs wide and thin over the bar's own cobbles: a riffle. Short white dashes
        // across the flow where it breaks over the stones of the shelf and, thinner, out across the run beside the bar;
        // and along the scalloped edge the lines of froth the lapping leaves behind it (eased away where they fall under
        // a pixel and a half)
        float rifN = wNoise(vec2(sf*0.8 + lat*0.6, lat*2.4) + 61.0)*0.55 + wNoise(vec2(sf*2.1 - lat*1.2, lat*5.5) + 17.0)*0.45;
        float rif = smoothstep(0.5, 0.7, rifN)*(0.4 + 0.6*froth)*max(shelf*smoothstep(0.03, 0.12, depth), 0.55*barX*smoothstep(0.36, 0.6, patchN)*(1.0 - 0.7*tongue));
        float lapL = mix(0.6, 0.5 + 0.5*sin(depth*110.0 - t*1.4 + 3.0*wNoise(vWp.xz*0.9)), 1.0 - smoothstep(0.1, 0.32, px));
        float laceB = barK*smoothstep(0.004, 0.02, depth)*(1.0 - smoothstep(0.05, 0.12, depth))*smoothstep(0.3, 0.6, wNoise(vec2(s*1.1 - t*0.4, lat*2.3) + 7.0))*lapL*(0.45 + 0.55*froth);
        float foam = clamp(mix(foamR, foamC, casc)*wk + max(max(max(max(thread, lace), brink), bub*wk), max(rif, laceB)), 0.0, 1.0);
        // seen close, foam is a lace: white strands round dark holes of water; the holes close where it lies thick, and only
        // single strands are left where it thins. Two sizes of cell, both carried downstream.
        vec2 fq = vec2(sf*1.5 + lat*0.4, lat*3.4 - sf*0.25) + 0.7*vec2(r2.x, r1.x);
        vec3 fa = mgCobble(fq), fb = mgCobble(fq*2.7 + 11.0);
        float pw = px*3.4, cv = smoothstep(0.24, 0.85, foam), w1 = 0.04 + 0.4*cv, w2 = 0.34*cv*cv;
        float strand = max(1.0 - smoothstep(w1 - 0.07 - pw, w1 + 0.07 + pw, fa.z),
                           (1.0 - smoothstep(w2 - 0.1 - pw*2.7, w2 + 0.1 + pw*2.7, fb.z))*0.8*smoothstep(0.3, 0.6, cv))*smoothstep(0.0, 0.2, cv);
        foam = mix(foam*0.62, max(max(strand*(0.55 + 0.45*cv), curtain*wk), 0.85*max(cap, boil)*wk*run*smoothstep(0.5, 0.9, foam)), o2);
        // from far off the white water is what it is in the mean: a bar of white under each ledge and under each tongue in
        // the run, broken patches (most where it is steep) in the cascades
        float farR = lamp*max(0.8*brk*(1.0 - smoothstep(1.2, 3.6, tt)), 0.65*smoothstep(0.2, 0.6, tong)*smoothstep(0.8, 2.0, tt)*(1.0 - smoothstep(2.6, 6.5, tt)))*smoothstep(0.15, 0.5, patchN + 0.2);
        float farW = mix(0.1 + 0.62*steep, 0.07 + 0.8*chute*(1.0 - 0.6*tongue), casc);     // seen from above the cascades are steps of white on dark water
        float farC = clamp(farW*wk*smoothstep(0.4, 0.62, patchN + 0.2*steep)*1.4 + max(thread, brink)*0.6, 0.0, 1.0);
        foam = mix(foam, mix(clamp(farR*wk + max(thread, brink)*0.5 + 0.3*barX*smoothstep(0.42, 0.62, patchN), 0.0, 1.0), farC, casc), smoothstep(0.9, 2.4, px));
        foam = mix((0.06 + 0.1*steep*(1.0 - 0.4*casc))*wk, foam, mid);            // farther still: its mean
        float leafA = max(la.z, lb.z)*(1.0 - farL)*(1.0 - foam);
        c = mix(c, mix(lca, lcb, step(la.z, lb.z)), leafA);
        c = mix(c, leafMean, farL*dens*0.2*mid*(1.0 - foam));
        vec3 fc = vec3(0.72, 0.75, 0.77)*0.3183*(uSunCol*sunY*pch + mix(amb, ambW, 0.5)*uWhiteK)*(0.8 + 0.34*frothN)*(0.72 + 0.5*mix(blobN, str2, casc));
        c = mix(c, fc, foam);
        float alpha = aEdge*mix(mix(0.42 + 0.3*shelf, 0.97, smoothstep(0.05, 0.9, depth)), 1.0, max(foam, max(leafA, clamp(F*1.6, 0.0, 1.0))));
        gl_FragColor = vec4(c, alpha);
        #include <fog_fragment>
      }`})}function vn(a,b,P){return new u.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,uniforms:{...u.UniformsUtils.clone(u.UniformsLib.fog),uTime:a.uTime,uMgPatch:a.uPatch,uMgPatch2:a.uPatch2,uSunCol:a.uSunCol,uSunDir:a.uSunDir,uHemiSky:a.uHemiSky,uHemiGround:a.uHemiGround,uShade:{value:b},uFloorS:{value:P}},vertexShader:`
      attribute vec3 aC;      // across (-1..1), metres along from the mouth, the fall of the bed here (0 level .. 1 sheer)
      varying vec3 vC; varying vec2 vW;
      #include <fog_pars_vertex>
      void main(){ vC = aC; vW = position.xz; vec4 mvPosition = viewMatrix*vec4(position, 1.0); gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime, uShade; uniform vec3 uSunCol, uSunDir, uHemiSky, uHemiGround, uFloorS;
      varying vec3 vC; varying vec2 vW;
      ${Mt}
      ${qt}
      #include <fog_pars_fragment>
      void main(){
        float a = vC.x, steep = smoothstep(0.18, 0.7, vC.z), px = fwidth(vC.y);
        float run = vC.y*mix(0.9, 0.35, steep) + uTime*mix(1.3, 2.6, steep);            // the pattern runs down toward the mouth
        float n1 = wNoise(vec2(a*2.6, run)), n2 = wNoise(vec2(a*7.0 + 3.0, run*2.4)), nn = mix(0.5, n1*0.6 + n2*0.4, 1.0 - smoothstep(0.6, 2.5, px));
        float white = mix(smoothstep(0.58, 0.74, nn)*0.8, smoothstep(0.22, 0.5, nn), steep);
        float edge = 1.0 - smoothstep(0.62, 1.0, abs(a) + 0.25*(n1 - 0.5));
        vec3 amb = mix(uHemiGround, uHemiSky, 0.85);
        float sun = max(uSunDir.y, 0.0)*mgPatchAt(vW)*uShade;
        vec3 fc = vec3(0.76, 0.79, 0.8)*0.3183*(uSunCol*sun + amb*1.7)*(0.72 + 0.4*n2);
        vec3 tea = max(vec3(0.035, 0.03, 0.026), uFloorS) + uHemiSky*0.3183*0.1;
        gl_FragColor = vec4(mix(tea, fc, white), edge*mix(0.8, 1.0, white));
        #include <fog_fragment>
      }`})}const fs=`
  float mgCollar(vec2 q0, float seed, float tm, out vec4 o){
    vec2 q = clamp(q0, vec2(-1.95, -3.5), vec2(6.35, 3.5));          // (the collar's own extent, in boulder radii: its rings reach 1.95, its tail 6.35 long and 3.5 to a side)
    float rho = length(q) + 1e-3, up = smoothstep(-0.25, 0.55, -q.x/rho);
    float d = (rho - 1.06)/0.27, pil = exp(-d*d)*up*(1.0 + 0.12*sin(tm*2.3 + seed*30.0));
    float xd = max(q.x, 0.0), ac = abs(q.y) - (0.95 + 0.42*xd);
    float arm = exp(-ac*ac/(0.05 + 0.02*xd))*smoothstep(-0.3, 0.6, q.x)*(1.0 - smoothstep(3.0, 6.0, q.x))*(0.55 + 0.45*cos((q.x - 0.6)*2.6 + seed*6.0));
    float hole = exp(-((q.x - 1.5)*(q.x - 1.5) + q.y*q.y*1.6)/0.5);
    o = vec4(pil, arm, hole, up);
    return 0.36*pil + 0.13*arm - 0.16*hole;
  }
`;function yn(){const a=[],b=[],P=[.8,1,1.2,1.5,1.95],te=14,D=2.2,H=9,B=6;for(let N=0;N<P.length;N++)for(let ee=0;ee<=te;ee++){const _=-D+2*D*ee/te;a.push(-Math.cos(_)*P[N],0,Math.sin(_)*P[N])}for(let N=0;N<P.length-1;N++)for(let ee=0;ee<te;ee++){const _=N*(te+1)+ee,x=_+te+1;b.push(_,x,_+1,_+1,x,x+1)}const l=a.length/3;for(let N=0;N<=H;N++)for(let ee=0;ee<=B;ee++){const _=N/H;a.push(.75+5.6*_*(.55+.45*_),0,(ee/B*2-1)*(1.6+1.9*_))}for(let N=0;N<H;N++)for(let ee=0;ee<B;ee++){const _=l+N*(B+1)+ee,x=_+B+1;b.push(_,_+1,x,_+1,x+1,x)}return{position:new u.Float32BufferAttribute(a,3),index:b}}function bn(a,b){return new u.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:u.DoubleSide,uniforms:{...u.UniformsUtils.clone(u.UniformsLib.fog),uTime:a.uTime,uMgPatch:a.uPatch,uMgPatch2:a.uPatch2,uSunCol:a.uSunCol,uSunDir:a.uSunDir,uHemiSky:a.uHemiSky,uHemiGround:a.uHemiGround,tMgShade:a.tShade,uMgShBox:a.uShBox,uMgShSun:a.uShSun,uMgShK:a.uShK,uFloorS:{value:b.floor},uSkyC:{value:b.sky},uCrestK:{value:b.crestK},uWhiteK:{value:b.whiteK},uShade:{value:b.shade}},vertexShader:`
      attribute vec4 iF;      // x, y of the water there, z, radius of the boulder
      attribute vec2 iG;      // seed, heading of the flow
      uniform float uTime;
      float mgWy(float x){ if (x >= 0.0) return -1.5; if (x >= -420.0) return -1.5 - x*0.0642857; if (x >= -560.0) { float t = (-420.0 - x)/140.0; return 25.5 + 20.5*(t + 0.04*sin(t*18.85)); } return 46.0 + (-560.0 - x)*0.012; }
      varying vec2 vP, vW, vI;
      ${fs}
      #include <fog_pars_vertex>
      void main(){
        vec2 q = position.xz;                                                     // in boulder radii: x downstream
        float ca = cos(iG.y), sa = sin(iG.y);
        vec4 co; float h = mgCollar(q, iG.x, uTime, co);
        vec3 P = iF.xyz + vec3(q.x*ca - q.y*sa, 0.0, q.x*sa + q.y*ca)*iF.w;
        P.y += mgWy(P.x) - mgWy(iF.x) + h*min(iF.w, 2.0);                          // the mesh lies on the falling water, lifted into the pillow and the arms
        vP = q; vW = P.xz; vI = vec2(iG.x, iF.w);
        vec4 mvPosition = viewMatrix*vec4(P, 1.0); gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime, uCrestK, uWhiteK, uShade; uniform vec3 uSunCol, uSunDir, uHemiSky, uHemiGround, uFloorS, uSkyC;
      varying vec2 vP, vW, vI;
      ${Mt}
      ${i0}
      ${qt}
      ${fs}
      #include <fog_pars_fragment>
      void main(){
        vec2 q = clamp(vP, vec2(-1.95, -3.5), vec2(6.35, 3.5)); float rho = length(q) + 1e-3, flow = uTime*3.4, seed = vI.x;
        vec4 co; float h = mgCollar(q, seed, uTime, co);
        float pil = co.x, arm = co.y, hole = co.z, up = co.w;
        vec2 m = q*vI.y;
        float n1 = wNoise(vec2(m.x*0.9 - flow, m.y*1.1) + seed*20.0), n2 = wNoise(vec2(m.x*2.5 - flow*1.6, m.y*2.7) + seed*9.0);
        float nn = 0.6*n1 + 0.4*n2, bil = 1.0 - abs(2.0*nn - 1.0);
        float fine = smoothstep(0.36, 0.6, wNoise(vec2(m.x*1.3 - flow*1.8, m.y*7.0) + seed*5.0)*0.6 + n2*0.4);
        // white: the torn band where the pillow breaks on the rock, a broken line at its foot, the tear round each shoulder,
        // the crests of the two arms, the boil where they close
        float brkP = smoothstep(0.84, 0.97, rho)*(1.0 - smoothstep(1.0, 1.1 + 0.24*n1, rho))*up*smoothstep(0.25, 0.6, nn + 0.3*up);
        float df = (rho - 1.44 - 0.14*n1)/0.08;
        float foot = exp(-df*df)*up*smoothstep(0.5, 0.75, n2)*0.6;
        float tear = smoothstep(0.7, 0.95, abs(q.y)/rho)*smoothstep(0.92, 1.02, rho)*(1.0 - smoothstep(1.15, 1.7, rho))*smoothstep(0.38, 0.62, nn);
        float armW = smoothstep(0.45, 0.85, arm + 0.3*nn)*arm*(0.25 + 0.75*fine);
        float xd = max(q.x, 0.0);
        float tail = exp(-q.y*q.y/(0.1 + 0.09*xd))*smoothstep(1.0, 1.8, q.x)*(1.0 - smoothstep(1.9, 3.8, q.x))*0.55*smoothstep(0.3, 0.6, nn)*(0.2 + 0.8*fine);
        float white = clamp(max(max(brkP, foot), max(max(tear, armW), tail)), 0.0, 1.0);
        // water: the glassy hump and the backs of the arms take the cold sky; the hole behind the stone is dark tea
        float body = clamp(max(pil*1.1, max(arm*0.75, hole*0.9)), 0.0, 1.0);
        vec3 amb = mix(uHemiGround, uHemiSky, 0.9);
        vec3 wc = uFloorS*(1.0 - 0.3*hole) + uSkyC*(uCrestK*(0.8*pil*smoothstep(0.95, 1.5, rho) + 0.55*arm)*(0.6 + 0.4*n2));
        vec3 fc = vec3(0.78, 0.8, 0.8)*0.3183*(uSunCol*max(uSunDir.y, 0.0)*mgSunShade(mgPatchAt(vW)*uShade, vec3(vW.x, -1e4, vW.y), 28.0) + amb*uWhiteK)*(0.76 + 0.34*bil);
        float a = max(white*0.95, 0.92*smoothstep(0.1, 0.45, body));
        gl_FragColor = vec4(mix(wc, fc, white), a);
        #include <fog_fragment>
      }`})}function ta(){const a=[],b=[],P=[],te=[],D=[],H=[];return{v(B,l,N,ee,_,x,O=.875,Q=.75){return a.push(B[0],B[1],B[2]),b.push(l[0],l[1],l[2]),P.push(N[0],N[1],N[2]),te.push(ee,_,x,0),D.push(O,Q),a.length/3-1},tri(B,l,N){H.push(B,l,N)},quad(B,l,N,ee){H.push(B,l,N,B,N,ee)},tube(B,l,N,ee,_){let x=null;for(let O=0;O<B.length;O++){const Q=B[Math.max(0,O-1)],ne=B[Math.min(B.length-1,O+1)],oe=new u.Vector3(ne[0]-Q[0],ne[1]-Q[1],ne[2]-Q[2]).normalize(),fe=new u.Vector3(.31,.12,.94).cross(oe).normalize(),ye=new u.Vector3().crossVectors(oe,fe),W=[];for(let q=0;q<N;q++){const U=q/N*Math.PI*2,V=fe.x*Math.cos(U)+ye.x*Math.sin(U),L=fe.y*Math.cos(U)+ye.y*Math.sin(U),Y=fe.z*Math.cos(U)+ye.z*Math.sin(U);W.push(this.v([B[O][0]+V*l[O],B[O][1]+L*l[O],B[O][2]+Y*l[O]],[V,L,Y],ee(O/(B.length-1),q),_(O/(B.length-1)),0,0))}if(x)for(let q=0;q<N;q++){const U=(q+1)%N;this.quad(x[q],x[U],W[U],W[q])}x=W}return x},build(B){const l=new u.BufferGeometry;return l.setAttribute("position",new u.Float32BufferAttribute(a,3)),l.setAttribute("normal",new u.Float32BufferAttribute(b,3)),l.setAttribute("color",new u.Float32BufferAttribute(P,3)),l.setAttribute("wind",new u.Float32BufferAttribute(te,4)),l.setAttribute("uv",new u.Float32BufferAttribute(D,2)),l.setIndex(a.length/3>65535?new u.Uint32BufferAttribute(H,1):new u.Uint16BufferAttribute(H,1)),l.computeBoundingSphere(),l.computeBoundingBox(),l.userData={triangles:H.length/3,glowColor:null,...B},l}}}function _a(a,b,P,te,D,H,B,l,N){const ee=(W,q=1)=>[W.r*q,W.g*q,W.b*q],_=(W,q,U)=>[W[0]+(q[0]-W[0])*U,W[1]+(q[1]-W[1])*U,W[2]+(q[2]-W[2])*U],x=new u.Vector3,O=new u.Vector3,Q=new u.Vector3,ne=new u.Vector3,oe=new u.Vector3,fe=new u.Vector3,ye=new u.Vector3;for(const W of te){const q=b.pick(D.palettes),U=ee(q[0]),V=ee(q[1]),L=ee(q[2]),Y=b.range(.85,1.15),R=N(W.c[1])+.05;for(let j=0;j<2;j++){const se=j?Math.round(D.cards*(D.inner??.38)):D.cards,Se=b.range(0,6.28),Be=j?.5:1,Ce=j?.8:1,Oe=j?1.8:1.42;for(let Ie=0;Ie<se;Ie++){if(!j&&D.thin&&b.chance(D.thin))continue;const Le=1-(Ie+.5)/se*Oe,Me=Math.sqrt(Math.max(0,1-Le*Le)),ze=Se+Ie*2.39996+b.range(-.3,.3);let be=[Math.cos(ze)*Me+b.range(-.12,.12),Le+b.range(-.12,.12),Math.sin(ze)*Me+b.range(-.12,.12)];const Re=Math.hypot(be[0],be[1],be[2])||1;be=[be[0]/Re,be[1]/Re,be[2]/Re];const Ve=b.range(.84,1.02)*Be,G=[W.c[0]+be[0]*W.r[0]*Ve,W.c[1]+be[1]*W.r[1]*Ve,W.c[2]+be[2]*W.r[0]*Ve],de=D.card*b.range(.8,1.25)*.5*(j?1.2:1);x.set(b()-.5,b()-.5,b()-.5),O.set(be[0],be[1],be[2]),Q.crossVectors(O,x).normalize(),ne.set(be[0]*.5+Q.x*.8,be[1]*.5+Q.y*.8-.2,be[2]*.5+Q.z*.8).normalize(),oe.crossVectors(ne,O).normalize(),fe.set(G[0]-H[0],(G[1]-H[1])*.8,G[2]-H[2]);const ce=fe.length()||1;ye.set(be[0]*.45+fe.x/ce*.55+b.range(-.22,.22),be[1]*.45+fe.y/ce*.55+b.range(0,.3),be[2]*.45+fe.z/ce*.55+b.range(-.22,.22)).normalize();const De=He(.5+.55*(G[1]-H[1])/l,0,1),Qe=He(.62+.45*ce/B,0,1)*Ce,$e=(De<.5?_(U,V,De*2):_(V,L,(De-.5)*2)).map(X=>X*Qe*Y*b.range(.82,1.18)),he=_($e,L.map(X=>X*Ce),.3),je=$e.map(X=>X*.82),st=b.chance(.5),nt=st?P[2]:P[0],ke=st?P[0]:P[2],Pe=[ye.x,ye.y,ye.z],Ke=a.v([G[0]-ne.x*de-oe.x*de,G[1]-ne.y*de-oe.y*de,G[2]-ne.z*de-oe.z*de],Pe,je,R,.6,1,nt,P[3]),Xt=a.v([G[0]-ne.x*de+oe.x*de,G[1]-ne.y*de+oe.y*de,G[2]-ne.z*de+oe.z*de],Pe,je,R,.6,1,ke,P[3]),kt=a.v([G[0]+ne.x*de+oe.x*de,G[1]+ne.y*de+oe.y*de,G[2]+ne.z*de+oe.z*de],Pe,he,R,1.5,1,ke,P[1]),rt=a.v([G[0]+ne.x*de-oe.x*de,G[1]+ne.y*de-oe.y*de,G[2]+ne.z*de-oe.z*de],Pe,he,R,1.5,1,nt,P[1]);a.quad(Ke,Xt,kt,rt)}}}}function ms(a,b,P){const te=ta(),D=P.H,H=P.R,B=D*.33,l=[0,D*.64,0],N=(O,Q=1)=>[O.r*Q,O.g*Q,O.b*Q],ee=O=>.3*Math.pow(O/D,2);te.tube([[0,-.4,0],[a.range(-.2,.2),D*.3,a.range(-.2,.2)],[a.range(-.4,.4),D*.62,a.range(-.4,.4)]],[D*.024,D*.017,D*.01],5,(O,Q)=>N(P.bark,Q%2?.7:1),O=>ee(O*D*.62));const _=[{c:[0,l[1]+B*.42,0],r:[H*.6,B*.6]}],x=a.range(0,6.28);for(let O=0;O<5;O++){const Q=x+O*1.2566+a.range(-.25,.25),ne=H*a.range(.46,.56);_.push({c:[Math.cos(Q)*ne,l[1]+B*a.range(-.12,.12),Math.sin(Q)*ne],r:[H*a.range(.47,.56),B*a.range(.55,.7)]})}for(let O=1;O<=Math.min(P.limbs||0,5);O++){const Q=_[O],ne=D*a.range(.3,.42),oe=D*.011;te.tube([[0,ne,0],[Q.c[0]*.5,$(ne,Q.c[1],.45),Q.c[2]*.5],[Q.c[0]*.9,Q.c[1]-Q.r[1]*.25,Q.c[2]*.9]],[oe,oe*.7,oe*.3],4,(fe,ye)=>N(P.bark,ye%2?.7:1),()=>ee(Q.c[1])*.6)}return _a(te,a,b,_,P,l,H,B,ee),te.build({height:D,radius:H,kind:P.kind||"quilt"})}function xn(a,b,P){const te=ta(),D=P.H,H=P.R,B=P.rings,l=P.sides,N=[.66,.63,.56],ee=[.035,.032,.03],_=[.16,.12,.1],x=a.range(-.5,.5),O=a.range(-.5,.5),Q=[],ne=[];for(let U=0;U<=B;U++){const V=U/B;Q.push([x*V*V*2.4+.14*Math.sin(V*5+O*9),V*D*.9-.4,O*V*V*2.4+.14*Math.cos(V*4+x*9)]),ne.push(D*$(.0165,.0045,Math.pow(V,.8))*(U===0?1.3:1))}const oe=U=>.35*Math.pow(He(U/D,0,1),2),fe=Q.map(()=>a.int(0,l-1));te.tube(Q,ne,l,(U,V)=>{const L=Math.round(U*B);return V===fe[L]&&(L&1)===0||L===0&&V%2===0?ee:N.map(Y=>Y*a.range(.86,1.06))},U=>oe(U*D*.9));const ye=[],W=a.range(0,6.28),q=P.lobes;for(let U=0;U<q;U++){const V=$(.5,.84,U/Math.max(1,q-1)),L=Math.min(B-1,Math.round(V*B)),Y=Q[L],R=W+U*2.4+a.range(-.3,.3),j=H*a.range(.42,.62)*(1-.3*(V-.5)/.34),se=[Y[0]+Math.cos(R)*j,Y[1]+D*a.range(.08,.13),Y[2]+Math.sin(R)*j];te.tube([[Y[0],Y[1],Y[2]],[Y[0]+Math.cos(R)*j*.55,Y[1]+D*.06,Y[2]+Math.sin(R)*j*.55],se],[ne[L]*.55,ne[L]*.36,ne[L]*.14],P.limbSides,Se=>Se<.4?N.map(Be=>Be*.85):_,()=>oe(Y[1])),ye.push({c:se,r:[H*a.range(.4,.5),D*a.range(.085,.115)]})}return ye.push({c:[Q[B][0],D*.92,Q[B][2]],r:[H*.4,D*.1]}),_a(te,a,b,ye,P,[0,D*.72,0],H,D*.25,oe),te.build({height:D,radius:H,kind:"birch"})}function Mn(a){const b=ta(),P=[.78,.75,.68],te=[.05,.045,.04],D=[.46,.35,.24],H=26,B=26,l=12,N=[],ee=[];for(let W=0;W<=B;W++){const q=W/B;N.push([.5*Math.sin(q*2.2)*q,q*H,.9*q*q+.25*Math.sin(q*5)]),ee.push($(1.05,.5,Math.pow(q,.9))*(W===0?1.45:W===1?1.2:W===2?1.06:1))}const _=[];for(let W=0;W<6;W++)_.push({t:a.range(.3,.95),a:a.range(-1.1,1.1),len:a.range(1.5,3.6),k:a.range(.34,.5)});const x=a.range(0,6.28),O=[];for(let W=0;W<=B;W++){const q=[],U=N[W][1];for(let V=0;V<=l;V++){const L=V/l*Math.PI*2,Y=V%l;let R=.06*Math.sin(Y*1.9+W*.83+x)+.045*Math.sin(Y*4.4-W*1.7+x*2)+.03*Math.sin(W*2.9+Y*.7);W<3&&(R+=.12*(3-W)/3*Math.cos(Y*2.6+x));for(const Se of _){const Be=(U-Se.t*H)/1.3,Ce=Math.atan2(Math.sin(L-(Math.PI/2-Se.a)),Math.cos(L-(Math.PI/2-Se.a)))/.75;R+=.2*Math.exp(-Be*Be-Ce*Ce)}const j=ee[W]*(1+R),se=.93+.12*Math.sin(Y*3.3+W*1.3+x);q.push(b.v([N[W][0]+Math.cos(L)*j,U,N[W][2]+Math.sin(L)*j],[Math.cos(L),.08,Math.sin(L)],P.map(Se=>Se*se),0,0,0,V/l*6.283*ee[W],U))}if(W)for(let V=0;V<l;V++)b.quad(O[W-1][V],O[W-1][V+1],q[V+1],q[V]);O.push(q)}const Q=O[B],ne=N[B][0],oe=N[B][2],fe=[];for(let W=0;W<l;W++){const q=(W+.5)/l*Math.PI*2,U=W%3===0?a.range(1.6,3.1):W%3===1?a.range(.25,.8):a.range(.7,1.7),V=ee[B]*a.range(.55,.9);fe.push(b.v([ne+Math.cos(q)*V*1.1+.1*U,H+U,oe+Math.sin(q)*V*1.1+.16*U],[Math.cos(q),.3,Math.sin(q)],U>1.4?[.66,.56,.42]:[.56,.45,.32],0,0,2,q*ee[B],H+U))}const ye=b.v([ne,H-.8,oe],[0,1,0],te,0,0,2,0,H);for(let W=0;W<l;W++)b.tri(Q[W],Q[W+1],fe[W]),b.tri(Q[W+1],Q[W],ye);for(const W of _){const q=Math.min(B-1,Math.floor(W.t*B)),U=N[q],V=ee[q]*W.k,L=[Math.sin(W.a)*.75,.55,Math.cos(W.a)*.75],Y=W.len;b.tube([[U[0],U[1],U[2]],[U[0]+L[0]*Y*.55,U[1]+L[1]*Y*.6,U[2]+L[2]*Y*.55],[U[0]+L[0]*Y,U[1]+L[1]*Y*1.15,U[2]+L[2]*Y]],[V,V*.72,V*.42],5,R=>R>.8?D:P.map(j=>j*(.9-.25*R)),()=>0)}for(let W=0;W<64;W++){const q=(W+a())/64*.94+.03,U=q*B,V=Math.min(B-1,Math.floor(U)),L=U-V,Y=a.range(0,6.283),R=a.sign(),j=[$(N[V][0],N[V+1][0],L),q*H,$(N[V][2],N[V+1][2],L)],se=$(ee[V],ee[V+1],L)*1.06,Se=a.range(.14,.4),Be=a.range(.2,.5),Ce=a.range(2,3.4),Oe=a.range(.95,1.08);let Ie=null;for(let Le=0;Le<=4;Le++){const Me=Le/4,ze=Me*Me*Ce,be=Math.cos(Y),Re=Math.sin(Y),Ve=Be*(Math.sin(ze)/Math.max(Ce,.5))*1.6,G=Be*(1-Math.cos(ze))/Math.max(Ce,.5)*1.6+.012,de=j[0]+be*(se+G)-Re*Ve*R,ce=j[2]+Re*(se+G)+be*Ve*R,De=be*Math.cos(ze)+Re*Math.sin(ze)*R,Qe=Re*Math.cos(ze)-be*Math.sin(ze)*R,$e=1-.8*Me,he=P.map(nt=>Math.min(.8,nt*Oe*(1.02-.1*Me))),je=b.v([de,j[1]-Se*.5*$e,ce],[De,.1,Qe],he,0,0,1,Y*se,j[1]),st=b.v([de,j[1]+Se*.5*$e+.06*Me,ce],[De,.1,Qe],he,0,0,1,Y*se,j[1]);Ie&&b.quad(Ie[0],je,st,Ie[1]),Ie=[je,st]}}return b.build({height:H,radius:2.5,kind:"snag"})}function kn(a){return new u.ShaderMaterial({fog:!0,vertexColors:!0,side:u.DoubleSide,uniforms:{...u.UniformsUtils.clone(u.UniformsLib.fog),uMgPatch:a.uPatch,uMgPatch2:a.uPatch2,uSunCol:a.uSunCol,uSunDir:a.uSunDir,uHemiSky:a.uHemiSky,uHemiGround:a.uHemiGround},vertexShader:`
      attribute vec4 wind;       // z: 0 the bark of the trunk and stubs, 1 a curl of paper, 2 the splintered wood of the break
      varying vec3 vCol, vN, vWp; varying vec3 vBk;
      #include <fog_pars_vertex>
      void main(){ vBk = vec3(uv, wind.z); vCol = color; vec4 w = modelMatrix*vec4(position, 1.0); vWp = w.xyz; vN = normalize(mat3(modelMatrix)*normal);
        vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunCol, uSunDir, uHemiSky, uHemiGround;
      varying vec3 vCol, vN, vWp; varying vec3 vBk;
      ${Mt}
      ${qt}
      #include <fog_pars_fragment>
      void main(){
        vec3 n = normalize(vN), V = normalize(cameraPosition - vWp);
        if (!gl_FrontFacing) n = -n;
        float arc = vBk.x, hy = vBk.y, kind = vBk.z;                                        // metres round the trunk, metres up it
        float pxm = max(fwidth(hy) + 0.3*fwidth(arc), 1e-4);                              // metres of bark under a pixel
        // lenticels: thin dark dashes lying level, in rows a hand apart, each row with its own dashes of its own lengths
        float row = hy/0.21, rid = floor(row), rf = abs(fract(row) - 0.5);
        float cx = arc/0.42 + wHash(vec2(rid, 3.0))*9.0, cid = floor(cx), cf = abs(fract(cx) - 0.5), ch = wHash(vec2(cid, rid)), ch2 = wHash(vec2(cid + 7.0, rid));
        float dth = max(0.05 + 0.05*ch2, pxm*3.6);                                          // (a dash is never thinner than three quarters of a pixel)
        float dash = (1.0 - smoothstep(dth, dth + pxm*4.8, rf + 0.3*(ch2 - 0.5)))*(1.0 - smoothstep(0.08 + 0.3*ch2, 0.12 + 0.3*ch2, cf))*step(0.42, ch)*(1.0 - smoothstep(0.05, 0.17, pxm));
        float mean = 0.07*smoothstep(0.05, 0.17, pxm);                                    // far off the rows are a faint grey, never stripes
        // old branch scars: a few soft black brows. Where a scrap of paper has torn away: a small patch of warm under-bark
        // (never more than a hand or two across) inside the pale lip of the tear
        float scar = smoothstep(0.72, 0.82, wNoise(vec2(arc*0.9 + 5.0, hy*0.45)))*smoothstep(0.3, 0.5, wNoise(vec2(arc*2.6, hy*1.9 + 2.0)));
        float pn = wNoise(vec2(arc*3.3 + 3.0, hy*7.4))*0.6 + wNoise(vec2(arc*8.0, hy*17.0) + 7.0)*0.4;        // tears run level round the trunk, as the paper does
        float peel = smoothstep(0.735, 0.765, pn), lip = smoothstep(0.68, 0.735, pn)*(1.0 - peel);
        // the paper itself: level bands of faintly different white, a papery grain
        float band = 0.9 + 0.12*wNoise(vec2(arc*0.6, hy*5.5)) + 0.06*wNoise(vec2(arc*3.0, hy*14.0));
        vec3 alb = mix(vCol*band, vCol*vec3(0.72, 0.54, 0.4), peel*0.85);
        alb = mix(alb, min(vCol*1.12, vec3(0.8)), lip)*(1.0 - 0.8*dash*(1.0 - peel) - mean)*(1.0 - 0.8*scar);
        if (kind > 1.5) alb = vCol*(0.8 + 0.4*wNoise(vec2(arc*9.0, hy*1.2)));               // splinters: long-grained raw wood
        else if (kind > 0.5) alb = gl_FrontFacing ? vCol*(0.96 + 0.08*wNoise(vec2(arc*4.0, vWp.y*9.0))) : vCol*vec3(0.92, 0.76, 0.62);   // a curl: paper outside, the pale salmon of fresh under-paper inside
        float wrap = max(0.0, 0.3 + 0.7*dot(n, uSunDir));
        vec3 amb = mix(mix(uHemiGround, uHemiSky, 0.7)*0.5, uHemiSky, 0.5 + 0.5*n.y);      // the underside takes the sky's slate, not the bank's brown
        vec3 c = alb*0.3183*(uSunCol*(wrap*mgPatchAt(vWp.xz)*0.6) + amb*2.6);
        float fr = 1.0 - max(dot(n, V), 0.0);
        c += uHemiSky*(0.12*fr*fr);
        gl_FragColor = vec4(c, 1.0);
        #include <fog_fragment>
      }`})}function Sn(a){return new u.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:u.DoubleSide,uniforms:{...u.UniformsUtils.clone(u.UniformsLib.fog),uPx:a.uPx,uSunCol:a.uSunCol,uSunDir:a.uSunDir,uHemiSky:a.uHemiSky,uHemiGround:a.uHemiGround,uFoot:{value:new u.Vector3},uFallDir:{value:new u.Vector3(0,0,-1)},uWindDir:{value:new u.Vector3(1,0,0)},uClock:{value:-1}},vertexShader:`
      attribute vec4 iA;      // metres up the trunk, the moment it lets go (0..1 of the fall), kind (0 bark curl, 1 dust, 2 dead leaf), seed
      attribute vec4 iB;      // the throw: x, y, z (m/s), size
      attribute vec3 iCol;
      uniform float uPx, uClock; uniform vec3 uFoot, uFallDir, uWindDir;
      varying vec2 vQ; varying vec3 vCol; varying vec4 vK;
      #include <fog_pars_vertex>
      void main(){
        float k0 = iA.y, age = (uClock - k0)*3.0;                                // seconds since it let go
        float lean = 0.87*(1.0 - pow(1.0 - clamp(k0, 0.0, 1.0), 2.2));           // how far over the trunk was then
        vec3 P = uFoot + iA.x*(sin(lean)*uFallDir + vec3(0.0, cos(lean), 0.0));
        float t = max(age, 0.0), dust = step(0.5, iA.z)*step(iA.z, 1.5);
        vec3 side = cross(uWindDir, vec3(0.0, 1.0, 0.0));
        P += (iB.x*uWindDir + vec3(0.0, iB.y, 0.0) + iB.z*side)*(1.0 - exp(-t*1.6))/1.6;      // thrown, and slowed by the air
        P += uWindDir*(mix(9.0, 5.0, dust)*t*(1.0 - exp(-t*1.2)));                            // then the gust has it
        P.y -= mix(1.5, 0.25, dust)*t*t - 0.4*sin(t*5.0 + iA.w*40.0)*(1.0 - dust);             // sinking, fluttering
        float life = smoothstep(0.0, 0.12, age)*(1.0 - smoothstep(mix(1.5, 2.2, dust), mix(2.6, 3.4, dust), age));
        vec4 mvc = viewMatrix*vec4(P, 1.0);
        float dist = length(mvc.xyz);
        float size = max(iB.w*(1.0 + dust*1.3*t), (1.0 - dust)*2.0*uPx*dist)*life*smoothstep(mix(1.0, 9.0, dust), mix(6.0, 26.0, dust), dist);
        float sp = iA.w*31.0 + t*(3.0 + 9.0*iA.w)*(1.0 - dust), cs = cos(sp), sn = sin(sp);
        vec2 q = vec2(position.x*cs - position.y*sn, position.x*sn + position.y*cs);
        mvc.xy += q*size*vec2(1.0, mix(0.55 + 0.45*cos(t*7.0 + iA.w*20.0), 1.0, dust));         // a chip turns edge-on and back
        vec4 mvPosition = mvc;
        vQ = position.xy; vCol = iCol; vK = vec4(dust, life, iA.z, iA.w);
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunCol, uSunDir, uHemiSky, uHemiGround;
      varying vec2 vQ; varying vec3 vCol; varying vec4 vK;
      ${qt}
      ${Ia}
      #include <fog_pars_fragment>
      void main(){
        float r = length(vQ), seed = vK.w, fw = max(fwidth(vQ.x) + fwidth(vQ.y), 1e-4);
        // a dead leaf has a leaf's outline; a flake of bark is a torn curl of paper, longer than wide, no two alike; dust is a soft puff
        vec2 ql = vQ*1.35 + vec2(0.0, 0.1);
        float dLeaf = mix(mgLeaf(ql), 0.8 - length(ql), smoothstep(0.12, 0.4, fw));
        float asp = 1.5 + 1.6*fract(seed*7.3), ang = seed*31.0, ca = cos(ang), sa = sin(ang);
        vec2 qb = vec2(vQ.x*ca + vQ.y*sa, -vQ.x*sa + vQ.y*ca)*vec2(1.0, asp);
        float torn = 0.3*(wNoise(qb*2.2 + seed*40.0) - 0.5) + 0.16*(wNoise(qb*6.5 + seed*9.0) - 0.5);
        float dBark = 0.74 - length(qb) + torn;
        float d = vK.z > 1.5 ? dLeaf : dBark;
        float chip = smoothstep(-fw*0.7, fw*0.7, d);
        float a = mix(chip, (1.0 - smoothstep(0.0, 1.0, r))*0.16, vK.x)*vK.y;
        if (a < 0.01) discard;
        // a curl of bark is a little roll: cream on its back, shaded along one edge, tan where the inner face shows
        float roll = clamp(qb.y*0.9 + 0.5, 0.0, 1.0);
        vec3 alb = vK.z > 1.5 ? vCol*(0.8 + 0.3*smoothstep(0.0, 0.3, dLeaf)) : mix(vCol*vec3(0.74, 0.56, 0.4), vCol, smoothstep(0.12, 0.42, roll))*(0.78 + 0.3*smoothstep(0.5, 1.0, roll));
        alb = mix(alb, vCol, vK.x);
        vec3 amb = mix(uHemiGround, uHemiSky, 0.75);
        gl_FragColor = vec4(alb*0.3183*(uSunCol*(0.3*max(uSunDir.y, 0.0)) + amb*2.4), a);
        #include <fog_fragment>
      }`})}function zn(a,b,P){const te=ta(),D=P.H,H=[P.bark.r,P.bark.g,P.bark.b],B=fe=>.55*Math.pow(He(fe/D,0,1),2),l=10,N=[],ee=[],_=a.range(.6,1.1),x=a.range(-.3,.3);for(let fe=0;fe<=l;fe++){const ye=fe/l;N.push([_*ye*ye*D*.035+.2*Math.sin(ye*5),ye*D*.96-.5,x*ye*ye*D*.035]),ee.push(D*$(.019,.0065,Math.pow(ye,.9))*(fe===0?1.4:1))}te.tube(N,ee,7,(fe,ye)=>H.map(W=>W*(ye%2?.62:1)*(.85+.3*a())),fe=>B(fe*D*.96));const O=fe=>{const ye=He(fe/.96,0,1)*l,W=Math.min(l-1,Math.floor(ye)),q=ye-W;return[$(N[W][0],N[W+1][0],q),$(N[W][1],N[W+1][1],q),$(N[W][2],N[W+1][2],q)]},Q=[],ne=P.tiers;for(let fe=0;fe<ne;fe++){const ye=fe/(ne-1),W=$(.5,.88,ye),q=O(W),U=D*$(.23,.12,Math.pow(ye,.85)),V=fe<ne-1?a.int(4,5):3,L=a.range(0,6.28);for(let Y=0;Y<V;Y++){const R=L+Y/V*6.283+a.range(-.3,.3),j=1+.42*Math.cos(R),se=U*a.range(.78,1.06)*j,Se=U*a.range(.08,.2),Be=Math.cos(R),Ce=Math.sin(R),Oe=D*$(.0055,.0032,ye);te.tube([[q[0],q[1]-U*.1,q[2]],[q[0]+Be*se*.5,q[1]-U*.06,q[2]+Ce*se*.5],[q[0]+Be*se*.92,q[1]+Se*.6,q[2]+Ce*se*.92]],[Oe,Oe*.7,Oe*.3],4,(Ie,Le)=>H.map(Me=>Me*(Le%2?.6:.9)),()=>B(q[1])*.8),Q.push({c:[q[0]+Be*se*.68,q[1]+Se*.7+D*.012,q[2]+Ce*se*.68],r:[se*a.range(.4,.5),D*a.range(.022,.03)]})}Q.push({c:[q[0],q[1]+U*.1,q[2]],r:[U*.36,D*.03]})}const oe=O(.96);return Q.push({c:[oe[0],oe[1]-D*.008,oe[2]],r:[D*.05,D*.038]}),_a(te,a,b,Q,{palettes:P.palettes,cards:P.cards,card:P.card,inner:.3},[0,D*.68,0],D*.2,D*.27,B),te.build({height:D,radius:D*.22,kind:"pine"})}function An(a,b){const P={...xt.BIRD_PRESETS.crows,len:.5,girth:.115,span:.33,chord:.31,wing:"broad",tail:.27,tailW:.11,fingers:0,...a},te=xt.birdGeometry(P,"high"),D=te.attributes.position,H=te.attributes.color,B=te.attributes.aAnim,l=P.len,N=P.girth,ee=new u.Color(b.white||"#dfe5ee"),_=new u.Color("#0b0d12");for(let x=0;x<D.count;x++){const O=D.getZ(x),Q=B.getY(x),ne=B.getW(x);if(Q!==0){const oe=B.getX(x)/P.span;b.bar&&B.getZ(x)>.5&&oe>.16&&oe<.5&&H.setXYZ(x,ee.r,ee.g,ee.b)}else ne>.7?b.tailTip&&Math.abs(D.getX(x))>P.tailW*.3&&H.setXYZ(x,ee.r,ee.g,ee.b):b.necklace&&ne===0&&Math.abs(O-.315*l)<.02*l&&H.setXYZ(x,_.r,_.g,_.b)}if(b.crest){const x=.43*l,O=.3*N,Q=.58*N,ne=new u.Color(a.head),oe=[0,O+Q*2.6,x-.17*l],fe=[-Q*.6,O+Q*.5,x-.05*l],ye=[Q*.6,O+Q*.5,x-.05*l],W=[0,O+Q*1,x+.05*l],q=[fe,oe,W,W,oe,ye,ye,oe,fe],U=D.count,V=q.length;for(const Y of Object.keys(te.attributes)){const R=te.attributes[Y],j=R.itemSize,se=new Float32Array((U+V)*j);se.set(R.array);for(let Se=0;Se<V;Se++){const Be=Y==="position"?q[Se]:Y==="color"?[ne.r*(Se%3===1?1.25:.9),ne.g*(Se%3===1?1.25:.9),ne.b*(Se%3===1?1.25:.9)]:Y==="normal"?[Se<3?-.7:Se<6?.7:0,.6,Se<6?.3:-.8]:null;if(Be)for(let Ce=0;Ce<j;Ce++)se[(U+Se)*j+Ce]=Be[Ce]}te.setAttribute(Y,new u.Float32BufferAttribute(se,j))}const L=Array.from(te.index.array);for(let Y=0;Y<V;Y++)L.push(U+Y);te.setIndex(L)}return{geometry:te,preset:P}}function ds(a){const b=[],P=[],te=[],D=[],H=!!a.calf,B=a.coat,l=a.dark,N=a.pale,ee=a.sock,_=[.012,.01,.009],x=(R,j,se)=>[R[0]+(j[0]-R[0])*se,R[1]+(j[1]-R[1])*se,R[2]+(j[2]-R[2])*se],O=1.02,Q=1.5,ne=R=>He((R-O)/.62,0,1),oe=(R,j,se,Se,Be,Ce=[0,0,1])=>{const Oe=(R.length-1)*se+1,Ie=[],Le=(Me,ze)=>{const be=Math.min(R.length-2,Math.floor(Me)),Re=Me-be,Ve=R[Math.max(0,be-1)][ze],G=R[be][ze],de=R[be+1][ze],ce=R[Math.min(R.length-1,be+2)][ze];return .5*(2*G+(-Ve+de)*Re+(2*Ve-5*G+4*de-ce)*Re*Re+(-Ve+3*G-3*de+ce)*Re*Re*Re)};for(let Me=0;Me<Oe;Me++){const ze=Me/se,be=Math.max(0,ze-.05),Re=Math.min(R.length-1,ze+.05),Ve=[Le(ze,0),Le(ze,1),Le(ze,2)],G=Math.max(.004,Le(ze,3)),de=Math.max(.004,Le(ze,4)),ce=Le(ze,5);let De=[Le(Re,0)-Le(be,0),Le(Re,1)-Le(be,1),Le(Re,2)-Le(be,2)];const Qe=Math.hypot(De[0],De[1],De[2])||1;De=[De[0]/Qe,De[1]/Qe,De[2]/Qe];const $e=Ce[0]*De[0]+Ce[1]*De[1]+Ce[2]*De[2];let he=[Ce[0]-De[0]*$e,Ce[1]-De[1]*$e,Ce[2]-De[2]*$e];const je=Math.hypot(he[0],he[1],he[2])||1;he=[he[0]/je,he[1]/je,he[2]/je];const st=[he[1]*De[2]-he[2]*De[1],he[2]*De[0]-he[0]*De[2],he[0]*De[1]-he[1]*De[0]],nt=[];for(let ke=0;ke<j;ke++){const Pe=(ke+.5)/j*Math.PI*2,Ke=Math.sin(Pe),Xt=Math.cos(Pe),kt=de*Xt*(1-ce*Math.max(Ke,0)),rt=[Ve[0]+st[0]*G*Ke+he[0]*kt,Ve[1]+st[1]*G*Ke+he[1]*kt,Ve[2]+st[2]*G*Ke+he[2]*kt],X=Se(ze,Ke,Xt,rt),ie=Be(rt);b.push(rt[0],rt[1],rt[2]),P.push(X[0],X[1],X[2]),te.push(O,Q,ie[0],ie[1]),nt.push(b.length/3-1)}Ie.push(nt)}for(let Me=0;Me<Oe-1;Me++)for(let ze=0;ze<j;ze++){const be=(ze+1)%j,Re=Ie[Me][ze],Ve=Ie[Me][be],G=Ie[Me+1][be],de=Ie[Me+1][ze];D.push(Re,G,Ve,Re,de,G)}for(const[Me,ze]of[[Ie[0],!1],[Ie[Oe-1],!0]]){let be=0,Re=0,Ve=0;for(const ce of Me)be+=b[ce*3],Re+=b[ce*3+1],Ve+=b[ce*3+2];const G=Me[0];b.push(be/j,Re/j,Ve/j),P.push(P[G*3],P[G*3+1],P[G*3+2]),te.push(te[G*4],te[G*4+1],te[G*4+2],te[G*4+3]);const de=b.length/3-1;for(let ce=0;ce<j;ce++){const De=(ce+1)%j;ze?D.push(de,Me[De],Me[ce]):D.push(de,Me[ce],Me[De])}}},fe=H?.04:.1,ye=H?.72:1,W=R=>1.62+(R-1.62)*ye,q=[[-1.31,1.52,0,.06,.05,0],[-1.22,1.47,0,.27,.22,.1],[-.96,1.41,0,.385,.31,.15],[-.55,1.385,0,.415,.345,.1],[-.1,1.38,0,.42,.36,.1],[.35,1.44,0,.47+fe*.3,.35,.28],[.7,1.53,0,.53+fe,.31,.5],[.98,1.52,0,.47+fe*.5,.25,.42],[1.16,1.5,0,.35,.185,.3],[1.4,1.53,0,.27,.15,.2],[1.62,1.55,0,.215,.13,.15],[W(1.8),1.52,0,.175,.125,.25],[W(2),1.43,0,.15,.1,.2],[W(2.2),1.31,0,.14,.092,.1],[W(2.37),1.2,0,.15,.1,0],[W(2.48),1.12,0,.11,.08,0],[W(2.53),1.08,0,.03,.03,0]];oe(q,14,3,(R,j,se,Se)=>{const Be=T(.1,-.7,j),Ce=T(1.7,1.95,Se[0]),Oe=T(W(2.2),W(2.42),Se[0]);let Ie=x(B,l,.75*Be+.35*T(.2,.8,Se[0])*(1-T(.5,1,j)));return Ie=x(Ie,x(B,N,.5),.55*T(.55,1,j)*(1-Ce)*T(-.4,.6,Se[0])),Ie=x(Ie,x(B,N,.42),.6*Ce*(1-Oe)),x(Ie,l,.5*Oe)},R=>[ne(R[0]),0]),H||oe([[1.6,1.4,0,.05,.1,0],[1.64,1.26,0,.04,.085,0],[1.67,1.1,0,.03,.06,0],[1.68,.98,0,.012,.015,0]],7,2,()=>x(B,l,.6),R=>[ne(R[0]),0],[1,0,0]);for(const R of[-1,1])oe([[W(1.7),1.66,.085*R,.022,.03,0],[W(1.66),1.79,.17*R,.02,.065,0],[W(1.6),1.93,.25*R,.008,.012,0]],6,2,(j,se)=>x(B,N,se*R>0?.15:.65),j=>[ne(j[0]),He((j[1]-1.66)/.27,0,1)],[1,0,0]);const U=R=>(j,se,Se,Be)=>Be[1]<.075?_:x(x(B,l,.55),ee,T(R+.1,R-.14,Be[1])),V=H?[[.8,.15,.1],[.8,-.15,-.06],[-.93,.16,-.12],[-.93,-.16,.08]]:[[.8,.19,.14],[.8,-.19,-.05],[-.93,.2,-.16],[-.93,-.2,.1]],L=H?.82:1;for(const[R,j,se]of V)R>0?oe([[R-.03,1.3,j*.9,.2,.11,0],[R+se*.3,.98,j,.12*L,.085*L,0],[R+se*.75,.66,j,.072*L,.06*L,0],[R+se*.8,.58,j,.062*L,.054*L,0],[R+se,.19,j,.04*L,.037*L,0],[R+se,.11,j,.052*L,.046*L,0],[R+se+.035,0,j,.07*L,.056*L,0]],7,2,U(.62),()=>[0,0],[0,0,1]):oe([[R+.02,1.34,j*.9,.25,.13,0],[R+.1+se*.3,1.02,j,.17*L,.1*L,0],[R-.07+se*.8,.72,j,.078*L,.06*L,0],[R-.09+se*.85,.64,j,.062*L,.052*L,0],[R-.01+se,.19,j,.04*L,.037*L,0],[R+se,.11,j,.052*L,.046*L,0],[R+se+.035,0,j,.07*L,.056*L,0]],7,2,U(.7),()=>[0,0],[0,0,1]);const Y=new u.BufferGeometry;return Y.setAttribute("position",new u.Float32BufferAttribute(b,3)),Y.setAttribute("color",new u.Float32BufferAttribute(P,3)),Y.setAttribute("aAnim",new u.Float32BufferAttribute(te,4)),Y.setIndex(D),Y.computeVertexNormals(),Y.computeBoundingSphere(),Y.userData={feet:V.map(([R,j,se])=>[R+se,j])},Y}function gs(a,b){return new u.ShaderMaterial({fog:!0,vertexColors:!0,uniforms:{...u.UniformsUtils.clone(u.UniformsLib.fog),uTime:a.uTime,uMgPatch:a.uPatch,uMgPatch2:a.uPatch2,uSunCol:a.uSunCol,uSunDir:a.uSunDir,uHemiSky:a.uHemiSky,uHemiGround:a.uHemiGround,tMgShade:a.tShade,uMgShBox:a.uShBox,uMgShSun:a.uShSun,uMgShK:a.uShK,uPose:{value:new u.Vector4(0,0,b.seed,0)},uLightK:{value:new u.Vector3(b.sun,b.amb,b.rim)},uRimC:{value:b.rimC}},vertexShader:`
      attribute vec4 aAnim;
      uniform float uTime; uniform vec4 uPose;
      varying vec3 vCol, vN, vWp, vL;
      #include <fog_pars_vertex>
      void main(){
        vec3 p = position, n = normal;
        float a = uPose.x*aAnim.z, ca = cos(a), sa = sin(a);
        vec2 d = p.xy - aAnim.xy;
        p.xy = aAnim.xy + vec2(d.x*ca + d.y*sa, -d.x*sa + d.y*ca);
        n.xy = vec2(n.x*ca + n.y*sa, -n.x*sa + n.y*ca);
        float fl = max(0.0, sin(uTime*1.7 + uPose.z*9.0 + sign(p.z)*1.3) - 0.6)*2.5;      // an ear flicks, now and then
        p.x -= aAnim.w*fl*0.06; p.z *= 1.0 + 0.016*sin(uTime*1.9 + uPose.z*5.0)*step(aAnim.z, 0.01)*step(0.9, p.y);   // and she breathes
        vL = position; vCol = color;
        vec4 w = modelMatrix*vec4(p, 1.0); vWp = w.xyz; vN = normalize(mat3(modelMatrix)*n);
        vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunCol, uSunDir, uHemiSky, uHemiGround, uLightK, uRimC;
      varying vec3 vCol, vN, vWp, vL;
      ${Mt}
      ${i0}
      ${qt}
      #include <fog_pars_fragment>
      void main(){
        vec3 n = normalize(vN), V = normalize(cameraPosition - vWp);
        float hair = wNoise(vec2(vL.x*26.0 + vL.z*9.0, vL.y*11.0 - vL.x*5.0))*0.6 + wNoise(vec2(vL.x*61.0, vL.y*33.0 + vL.z*40.0))*0.4;
        vec3 alb = vCol*(0.72 + 0.56*hair);
        float ndl = max(dot(n, uSunDir), 0.0), wrap = max(0.0, 0.3 + 0.7*dot(n, uSunDir));
        vec3 amb = mix(uHemiGround*1.25, uHemiSky, 0.5 + 0.5*n.y);
        vec3 c = alb*0.3183*(uSunCol*(mix(wrap, ndl, 0.5)*mgSunShade(mgPatchAt(vWp.xz), vWp, 28.0)*uLightK.x) + amb*uLightK.y);
        float fr = 1.0 - max(dot(n, V), 0.0); fr *= fr;
        c += uRimC*(fr*fr*(0.25 + 0.75*smoothstep(-0.2, 0.7, n.y))*uLightK.z)*(0.6 + 0.8*hair);      // the sky along her back
        c *= 0.55 + 0.45*smoothstep(0.0, 0.5, vL.y);                                    // her own shadow round the hooves
        gl_FragColor = vec4(c, 1.0);
        #include <fog_fragment>
      }`})}function Cn(a){return new u.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-4,uniforms:{...u.UniformsUtils.clone(u.UniformsLib.fog),uTime:a.uTime,uHemiSky:a.uHemiSky},vertexShader:`
      attribute vec4 iP;      // x, y, z, heading
      attribute vec4 iQ;      // half length, half width, kind, seed
      varying vec2 vQ; varying vec2 vK;
      #include <fog_pars_vertex>
      void main(){
        float ca = cos(iP.w), sa = sin(iP.w);
        vec2 q = position.xz*iQ.xy;
        vec3 P = vec3(iP.x + q.x*ca - q.y*sa, iP.y, iP.z + q.x*sa + q.y*ca);
        vQ = position.xz; vK = iQ.zw;
        vec4 mvPosition = viewMatrix*vec4(P, 1.0); gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime; uniform vec3 uHemiSky;
      varying vec2 vQ; varying vec2 vK;
      #include <fog_pars_fragment>
      void main(){
        float r = length(vQ);
        vec4 c;
        if (vK.x < 0.5) c = vec4(0.012, 0.012, 0.016, 0.62*(1.0 - smoothstep(0.25, 1.0, r)));
        else {
          float ph = fract(r*2.2 - uTime*0.55 + vK.y), ring = smoothstep(0.0, 0.18, ph)*(1.0 - smoothstep(0.18, 0.5, ph));
          float collar = 1.0 - smoothstep(0.1, 0.2, r);
          c = vec4(vec3(0.62, 0.66, 0.7)*0.3183*(uHemiSky*2.6 + 0.25), max(ring*0.55*(1.0 - smoothstep(0.3, 1.0, r)), collar*0.8)*smoothstep(0.05, 0.085, r));
        }
        gl_FragColor = c;
        #include <fog_fragment>
      }`})}var Hn={id:"maple-gale",name:"The Leaf Wind",category:"wilderness",weirdness:.05,media:["air"],async build(a){const b=a.rng,P=a.noise,te=a.vary||{},D=a.quality?.detail??1,H=He(te.density??1,.7,1.3),B=(e,t,o)=>new u.Vector3(e,t,o),l=e=>new u.Color(e),N=b.fork("look")(),ee=te.hour||"any",_=ee==="golden"?"golden":ee==="dawn"?"dawn":ee==="day"||ee==="night"?N<.65?"slate":"squall":N<.26?"slate":N<.48?"golden":N<.6?"dawn":N<.74?"slate":N<.82?"dawn":"squall",x=fn[_],O=b.fork("season")(),Q=O<.28?"peak":O<.55?"late":O<.77?"peak":"early",ne=b.fork("cast"),oe=ne.pick(["jays","jays","robins","ravens"]),fe=ne()>.32?"deer":"moose",ye=!!te.rare,W=ls(cs("maple-gale-extra:"+(a.seed??0))),q=e=>ls(cs(e+":"+(a.seed??0))),U=b.range(24,31),V=(H-1)*.7,L=new u.Scene,Y=1.06,R=e=>.2126*e.r+.7152*e.g+.0722*e.b,j=e=>{const t=e/255,r=((t<=.04045?t/12.92:Math.pow((t+.055)/1.055,2.4))-.5*R(l(x.shadow))-.5)/Y+.5;let s=0,g=4;for(let i=0;i<40;i++){const c=(s+g)/2;(c*(c+.0245786)-90537e-9)/(c*(.983729*c+.432951)+.238081)<r?s=c:g=c}return s*.6/(x.exposure*R(l(x.tint)))},se=(e,t)=>{const o=l(e),r=t/255,s=r<=.04045?r/12.92:Math.pow((r+.055)/1.055,2.4);o.multiplyScalar(s/Math.max(R(o),1e-5));const g=l(x.shadow),i=l(x.tint),c=.4*(1-T(0,.6,s)),f=[o.r-c*g.r,o.g-c*g.g,o.b-c*g.b].map(y=>(y-.5)/Y+.5),h=.2126*f[0]+.7152*f[1]+.0722*f[2],d=(y,F)=>{const w=Math.max(h+(y-h)/x.sat,8e-4);let n=0,m=4;for(let v=0;v<40;v++){const k=(n+m)/2;(k*(k+.0245786)-90537e-9)/(k*(.983729*k+.432951)+.238081)<w?n=k:m=k}return n*.6/(x.exposure*F)};return new u.Color(d(f[0],i.r),d(f[1],i.g),d(f[2],i.b))},Se=(e,t=1)=>new u.Vector3(1+.13*t,1,1-.16*t).multiplyScalar(j(e)/(1+.016*t)),Be=hn(x.el,x.az),Ce=ln({rng:b.fork("sky"),...x.sky,lightColor:x.sun,lightIntensity:x.sunI,ambientColor:x.hemiSky,groundLight:x.hemiGround,ambientIntensity:x.hemiI,lightElevationMin:x.el});L.add(Ce.object),await a.yield(),L.fog=new u.FogExp2(l(x.fog),x.fogD);const Oe=new u.DirectionalLight(l(x.sun),x.sunI);Oe.position.copy(Be).multiplyScalar(500),L.add(Oe);const Ie=new u.HemisphereLight(l(x.hemiSky),l(x.hemiGround),x.hemiI);L.add(Ie);const[Le,Me,ze,,,be,Re]=Ea.map(l),Ve=Q==="late"?1:Q==="early"?.55:.75,G={uTime:{value:0},uPx:{value:.0015},uLevel:{value:V},uWakeAge:{value:0},uS0:{value:new u.Vector2(-420,0)},uPatch:{value:new u.Vector4(-550,40,x.patch[0],x.patch[1])},uPatch2:{value:new u.Vector3(2,-8,62)},uWave:{value:new u.Vector4(0,110,_==="dawn"?.35:.6,0)},uFront:{value:new u.Vector4(-1e4,0,1,0)},uBurst:{value:new u.Vector4(0,x.patchGain||0,x.patchLift||0,0)},uPale:{value:be.clone().lerp(ze,.15).multiplyScalar(.75)},uSunCol:{value:l(x.sun).multiplyScalar(x.sunI)},uSunDir:{value:Be.clone()},uHemiSky:{value:l(x.hemiSky).multiplyScalar(x.hemiI)},uHemiGround:{value:l(x.hemiGround).multiplyScalar(x.hemiI)},ramp:[Le.clone().multiplyScalar(.85),Le.clone().lerp(Me,.5),Me.clone().multiplyScalar(.9),ze.clone().multiplyScalar(.85)],litterRamp:[Le.clone().multiplyScalar(.42),Le.clone().lerp(Me,.55).multiplyScalar(.5),l("#8e6a30").multiplyScalar(.8),ze.clone().multiplyScalar(.5)],uShade:{value:new u.Vector4(x.gorge[0]-60*x.gorge[1],x.gorge[1],x.gorge[2],0)},uSheen:{value:l(x.hemiSky).multiplyScalar(.9)},uFill:{value:new u.Vector3(...{slate:[.34,.4,.52],golden:[.6,.56,.6],squall:[.48,.52,.58],dawn:[.42,.41,.58]}[_])},uRockFill:{value:new u.Vector3(...{slate:[.4,.46,.58],golden:[.5,.47,.5],squall:[1,1.06,1.16],dawn:[.4,.39,.54]}[_])},uLand:{value:new u.Vector4(U,V,.55+.45*Ve,0)},uBar:{value:new u.Vector4(0,0,4.5,15.5)},uDomeFill:{value:new u.Vector3(...{slate:[.3,.25,.22],golden:[.3,.23,.2],squall:[.34,.33,.33],dawn:[.27,.23,.26]}[_])},uFloor:{value:(()=>{const e=l(x.hemiSky),t=j({slate:46,golden:34,squall:42,dawn:34}[_])/R(e);return new u.Vector3(e.r*t,e.g*t,e.b*t)})()},uWall:{value:new u.Vector2(..._==="slate"?[.8,2]:[.85,.85])},tShade:{value:null},uShBox:{value:new u.Vector4(0,0,1,1)},uShSun:{value:new u.Vector4(0,-1,1,0)},uShK:{value:new u.Vector4(1,1,0,0)},uEdge:{value:new u.Vector4(0,0,0,.045)},uWood:{value:new u.Vector3(72,108,9.5)},crownRamp:[l("#000000"),l("#000000"),l("#000000"),l("#000000"),l("#000000")]},de=[768,176],ce=[-650,pe-60,672,U+124],De=new Uint8Array(de[0]*de[1]);{const e=new u.DataTexture(De,de[0],de[1],u.RedFormat,u.UnsignedByteType);e.minFilter=e.magFilter=u.LinearFilter,e.wrapS=e.wrapT=u.ClampToEdgeWrapping,e.needsUpdate=!0,G.tShade.value=e,G.uShBox.value.set(ce[0],ce[1],1/ce[2],1/ce[3])}const Qe=(()=>{const e=Math.hypot(Be.x,Be.z)||1;return[-Be.x/e,-Be.z/e,e/Math.max(Be.y,.05)]})(),$e={slate:[1.6,.1,2,1],golden:[1.35,.1,3.4,0],squall:[0,1,1,0],dawn:[1.3,.1,3.25,0]}[_];G.uShSun.value.set(Qe[0],Qe[1],Qe[2],$e[0]),G.uShK.value.set($e[1],$e[2],0,$e[3]);const he=await un(a,{palette:Ea,season:Q,weather:_,gustLeaves:Math.round(33e3*$(.86,1.06,(H-.7)/.6)/(Q==="late"?1.12:1)),ribbonLeaves:8e3});L.add(he.object);const je=he.anchors;await a.yield();const st=-650,nt=-545,ke=e=>pe+U*(1-T(-540,-420,e)),Pe=e=>{if(e>=0)return-1.5;if(e>=-420)return-1.5-e*(27/420);if(e>=-560){const t=(-420-e)/140;return 25.5+20.5*(t+.04*Math.sin(t*18.85))}return 46+(-560-e)*.012},Ke=e=>5.5+1*P.n2(e*.021,4.4),Xt=(e,t)=>{const o=1.3*P.n2(e*.15+(t?13.1:71.7),t?3.3:8.8)+.6*P.n2(e*.37+(t?5.5:40.2),t?9.1:2.6);return(o>0?.5*o:1.25*o)*T(-650,-620,e)*(1-T(-16,0,e))},kt=(pe+U)/.8,rt=[[-700,80,kt],[-648,80,kt*648/700],[-596,79.2,kt*596/700]];rt.push([-560,72.5,ke(-560)-1],[-520,59.5,ke(-520)],[-480,45.5,ke(-480)],[-440,Pe(-440)+5.6,ke(-440)]);for(const e of[-400,-340,-280,-220,-160,-120])rt.push([e,Pe(e)+5,pe]);for(let e=5;e<je.flyThrough.length;e++){const t=je.flyThrough[e];rt.push([t.x,t.y,t.z])}const X=rn(rt),ie=X.length,Te=B(),Ee=B(),ja=new u.Color,ps=new u.Color,aa=.55,Va=X.posAtDist(aa*ie+15,B()),St=Va.x-50,Wt=Va.x+52,ws=4.5,vs=15.5;G.uBar.value.set(St,Wt,4.5,15.5);const oa=q("baredge"),mt=[oa.range(0,6.28),oa.range(0,6.28),oa.range(0,6.28)],Ua=.045;G.uEdge.value.set(mt[0],mt[1],mt[2],Ua);const Za=e=>.55*Math.sin(e*.52+mt[0]+.8*Math.sin(e*.13+mt[1]))+.3*Math.sin(e*.93+mt[2]),sa=e=>Ke(e)+1.3+Za(e),ys=(e,t)=>.51*(Math.sin(e*1.53+mt[0]+.9*Math.sin(e*.37+mt[1]))+.6*Math.sin(e*2.71+t*.9+mt[2])+.35*Math.sin(e*4.9-t*1.7+mt[0]*2)),na=e=>{const t=sa(e);return t+(Ua*ys(e,pe-t)-.02)/.075},Je=(e,t)=>{const o=pe-t,r=sa(e);return T(St-8,St+6,e)*(1-T(Wt-6,Wt+8,e))*(1-T(14,16.5,o))*T(r-4.4,r-3,o)},z0=(e,t)=>{const o=Math.abs(t-pe);let r=48.5+6.5*P.fbm2(e*.0035+11,t*.0035,3)+1.6*P.fbm2(e*.021,t*.021+5,2)+16*T(110,420,o)+10*T(-610,-410,e);const s=T(50,250,e)*(1-.72*T(80,210,o));return $(r,-57.2+2.5*P.fbm2(e*.012,t*.012+40,2)+9*T(260,420,e),s)},bs=(e,t,o)=>{const r=t-ke(e),s=Math.abs(r),g=r<0,i=Pe(e),c=Ke(e),f=Je(e,t),h=c+Xt(e,g)*(1-.8*f),y=(19+4.5*P.n2(e*.013+3,g?7.7:1.3))*$(.36,1,T(st,nt,e))+(g?26*T(-90,-20,e):7*T(-70,0,e)),F=(.45*P.fbm2(e*.09,t*.09,2)+.3*Math.max(0,P.n2(e*.031+9,t*.031))*T(c+3,c+9,s))*T(c,c+4,s)*(1-f),w=J=>{const re=i-1.75+2.5*T(h-1.6,h+2.8,J)+.03*Math.max(0,J-h-3);if(!(f>0))return re;const Z=J-sa(e),me=i+.28+V,le=Z>=0?me+.02+.075*Z+.05*P.n2(e*.3,t*.3+7)*T(.6,3,Z):me+.085*Z-1.5*T(2.4,4.2,-Z);return $(re,le,f)},n=Math.abs(e-Ge);if(s<=y)return Math.min(w(s)+F-(g?0:.6*Math.exp(-n*n/7)*T(c+.5,c+3.5,s)),o);const m=w(y);if(o<=m)return o;const v=y+41+8*P.n2(e*.009+9,g?2.2:5.5),k=He((s-y)/(v-y),0,1),z=Math.max(0,(k+.085*P.fbm2(e*.03+(g?50:0),t*.03,2))*3.3),p=Math.floor(z),S=z-p,A=Math.min(1,(p+T(.36,.7,S))/3.3),C=Math.pow(He($(k,A,.88),0,1),.8),M=Math.min(o,m+F*(1-k)+(o-m)*C);if(g||n>70)return M;const K=m+F*(1-k)+(o-m)*C-.9-(o-m)*C*.44*T(9,27,s-y)*(1-T(72,112,s-y)),ae=3+.07*(s-y);return Math.min(M,K+30*T(ae*.42,ae*3.4,n+1.6*P.n2(e*.07,t*.07+60)))},Qt=4,Gt=e=>$(.27,.74,T(13,60,e)),Oa=(e,t,o)=>(.55*P.fbm2(e*.021,t*.021+20,2)+.22*P.n2(e*.07+3,t*.07))*Math.min(1,6.4*o*(1-o)),ra=(e,t,o)=>{const r=He((o-1)/Gt(e),0,1);return He(r*Qt+Oa(e,t,r),0,Qt)},xs=(e,t,o)=>{const r=Math.hypot((e-90)/74,(t-pe)/52);if(r<=1)return tt+.5-5.5*T(1,.72,r);const s=T(13,38,e);let g=0;if(s<1){const i=He((r-1)/.27+.05*P.fbm2(e*.03,t*.03+20,2),0,1),c=i*2.6,f=Math.floor(c),h=c-f,d=Math.min(1,(f+T(.25,.75,h))/2.6);g=(1-Math.pow(1-He($(i,d,.5),0,1),2.6))*(1-s)}if(s>0){const i=He((r-1)/Gt(e),0,1),c=ra(e,t,r),f=Math.floor(c),h=c-f,d=Math.min(1,(f+T(.3,.6,h))/Qt);g+=He($(i,d,.9),0,1)*s}return $(tt+.5,o,g)},Ue=(e,t)=>{const o=z0(e,t);return Math.min(bs(e,t,o),xs(e,t,o))},Ms=l("#827e74"),Xa=l("#5f5d58"),ks=l("#d6cfbc"),Ss=l("#3c382f"),ia=l("#6e3c22"),Qa=l("#8e6a30"),$a=l("#4c3626"),A0=l("#3a5530"),zs=l("#7a3a26"),C0=l("#c9d2dc"),As=l("#6e563c"),Cs=l("#4c4d52"),Fs=l("#3a3b40"),F0=(e,t,o)=>(t<-.25?e.copy($a).lerp(ia,.3+o*.3):t<.15?e.copy(ia).lerp(zs,.4+o*.4):t<.5?e.copy(Qa).lerp(ia,.5+o*.5):e.copy(Qa).lerp($a,.3-.2*o),e.lerp(As,.55).multiplyScalar(1.12)),Ws=(e,t,o,r,s)=>{const g=Math.abs(t-ke(e)),i=Pe(e),c=P.n2(e*.13,t*.13),f=P.n2(e*.41+9,t*.41),h=P.fbm2(e*.021,t*.021+3,2);if(e>12&&o<tt+1.2)return s.copy(Ss).lerp(Xa,T(tt-.6,tt+1,o)*.8),s;if(e<14&&g<30&&o<i+3.2){const d=Je(e,t),y=1-T(i+.1+V,i+.8+V,o);s.copy(Ms).lerp(Xa,.5+.5*f).lerp(ks,d*.92);const F=T(-.15,.4,c*.7+h*.6)*T(i+.6,i+1.3,o)*(1-d)*Ve;return s.lerp(F0(ja,f,c),F*.8),s.lerp(A0,T(.3,.7,-h+.3*f)*.55*(1-d)*(1-F)),s.multiplyScalar($(1,.4,y*(1-.7*d)))}if(e>12){const d=Math.hypot((e-90)/74,(t-pe)/52),y=T(1+Gt(e)+.12,1+Gt(e)-.04,d)*T(12,20,e);if(y>0){const F=ra(e,t,d),w=F-Math.floor(F),n=w>=.6?(w-.6)/.7:w<.3?(w+.4)/.7:1,m=T(.72,.95,n)*T(-.35,.25,P.n2(e*.23+60,t*.23));s.copy(Cs).lerp(Fs,.5+.5*f).multiplyScalar((1.45-.35*T(.35,.8,n))*(1+m*(.1+.3*f)));const v=T(.25,.7,c*.4+h*.5+.2*P.n2(e*.05+40,t*.05)+.75*T(.35,.9,n))*T(.7,.92,r)*(1-.5*T(.9,1,n));if(s.lerp(F0(ja,f,c),v*.85),s.lerp(A0,T(.35,.7,-h+.4*f)*.5*(1-v)),_==="dawn"&&s.lerp(C0,.2*T(.75,.95,r)),y>=1)return s;const k=ps.copy(s);return F0(s,c+.5*h,f),s.lerp(A0,T(.2,.7,h-.4*c)*.55).multiplyScalar(.62+.16*f),s.lerp(k,y)}}return F0(s,c+.5*h,f),s.lerp(A0,T(.2,.7,h-.4*c)*.55),_==="dawn"&&s.lerp(C0,.22*T(.75,.95,r)),s.multiplyScalar((.62+.16*f)*(1-.42*T(80,125,e)))};await a.yield();const Ps=ft.makeStrata({rng:b.fork("strata"),rock:"#5e5f62",rockB:"#454649",accent:"#66594c",dark:"#3c3c40",beds:18,thickness:3.4,base:-72,contrast:.9,seams:.2});await a.yield();const la=[];for(let e=0;e<10;e++){const t=(e+.5)/10*Math.PI*2,o=90+Math.cos(t)*74*1.34,r=pe+Math.sin(t)*52*1.34;o>24&&o<170&&la.push([o,r,.6])}for(const e of[3,9,18,30,46,66])la.push([Ge,pe+21+e,.45]);const dt=await ft.makeTerrainAsync({rng:b.fork("land"),noise:P,path:X,height:Ue,corridor:!1,bounds:[-900,-340,440,372],cell:2.6,near:30,levels:5,refine:2,maxTriangles:82e3,focus:la,biome:"meadow",palette:{rock:"#5c5d60",rockB:"#434447",rockSlope:[.56,.78],strata:.66,strataScale:3,bedRelief:.8,joints:.5,patch:"#6a5a40",patchAmount:.12,tufts:0,pebbles:.75,cracks:.3,clouds:0},strata:Ps,color:Ws,sunDir:Be,shadow:_==="slate"?.5:.56,ao:.34,skirt:30,material:{bounce:_==="slate"?"#7888a8":"#8a909c",bounceAmount:_==="dawn"?7:6}},a.yield);l0(dt.material,G,"land");{const e=dt.geometry.attributes.position,t=e.count,o=new Float32Array(t*2);for(let r=0;r<t;r++){(r&4095)===4095&&await a.yield();const s=e.getX(r),g=e.getZ(r);if(s<13)continue;const i=Math.hypot((s-90)/74,(g-pe)/52);if(i<=1)continue;const c=ra(s,g,i),f=Math.floor(c);o[r*2]=f+T(.3,.6,c-f),o[r*2+1]=T(13,38,s)}dt.geometry.setAttribute("aMgB",new u.BufferAttribute(o,2))}L.add(dt.object);const xe=(e,t)=>dt.surfaceAt(e,t);await a.yield();const Bs=hs.waterLight(Ce),c0=l(x.sky.zenith).lerp(l(x.sky.mid),.5).lerp(l(x.sky.clouds.lit),.35),h0=l(x.sky.horizon).lerp(l(x.sky.mid),.35),$t=x.patch[1]<1?.75:1,Ls=l("#1c1610"),Ds=l("#9c7c54"),Hs=h0.clone().lerp(c0,.45),Ya=Se(25),Ja=(()=>{const e=se("#23262b",27);return new u.Vector3(e.r*.9,e.g,e.b*1.1)})(),W0=(()=>{const e=se("#55606c",84);return e.r*=.86,e.b*=1.14,e.multiplyScalar(R(h0.clone().lerp(c0,.3))/Math.max(R(e),1e-4))})(),It=e=>Pe(e)+.28+V,u0=[],eo=[],ca=[],to=[],ao=[],P0=[],Ts=h0.clone().lerp(c0,.3),oo=(j(96)-j(23))/R(Ts),so=2.7;{const e=[];for(let i=-770;i<-566;i+=2.5)e.push(i);for(let i=-566;i<Rt+.3;i+=.7)e.push(i);e.push(Rt+.3);const t=e.length-1,o=16,r=new Float32Array(t+1);for(let i=0,c=0;i<=t;i++)i&&(c+=Math.hypot(e[i]-e[i-1],ke(e[i])-ke(e[i-1]))),r[i]=c,e[i]<=-400&&G.uS0.value.set(e[i],c);const s=wn(G,{skyZ:c0,skyH:h0,wall:l("#3a332e").multiplyScalar($t),leafA:l("#b8481c").multiplyScalar(.2*$t),leafB:l("#c88a28").multiplyScalar(.21*$t),birch:l("#b8b2a4").multiplyScalar(.42*$t),maple:l("#d02a1c").multiplyScalar(.5),deep:Ls,bed:Ds,floor:Ya,floorR:Ja,cool:W0,laneK:(j(60)-j(23))/R(W0),sheenK:(j(38)-j(23))/R(W0),foam:$(.2,1,(H-.7)/.6),shade:x.gorge[2]>.5?.4:1,leafDens:(Q==="late"?1.25:Q==="early"?.8:1)*$(.85,1.1,(H-.7)/.6),crestK:oo,whiteK:so}),g=[0];for(let i=1;i<t-40;i++)e[i]>=-566&&i-g[g.length-1]>=120&&g.push(i);g.push(t);for(let i=0;i<g.length-1;i++){const c=g[i],f=g[i+1]-c+1,h=f*(o+1),d=new Float32Array(h*3),y=new Float32Array(h*4),F=new Float32Array(h),w=[];for(let S=0;S<f;S++){(S&15)===0&&await a.yield();const A=e[c+S],C=ke(A),M=It(A),E=Ke(A),K=E+3.1,ae=Math.max(0,(Pe(A-1.5)-Pe(A+1.5))/3);for(let J=0;J<=o;J++){const re=J/o*2-1,Z=S*(o+1)+J,me=C+K*re;d[Z*3]=A,d[Z*3+1]=M,d[Z*3+2]=me,y[Z*4]=K*re,y[Z*4+1]=r[c+S],y[Z*4+2]=ae,y[Z*4+3]=E,F[Z]=A>Rt-.4?2:M-xe(A,me)}if(S<f-1)for(let J=0;J<o;J++){const re=S*(o+1)+J,Z=re+o+1;w.push(re,re+1,Z,re+1,Z+1,Z)}}const n=new u.BufferGeometry;n.setAttribute("position",new u.BufferAttribute(d,3)),n.setAttribute("aS",new u.BufferAttribute(y,4)),n.setAttribute("aD",new u.BufferAttribute(F,1)),n.setIndex(w),n.computeBoundingSphere(),n.boundingSphere.radius+=2.5;const m=new u.Mesh(n,s);m.renderOrder=1,L.add(m);const v=[];for(let S=0;S<f-1;S+=4)v.push(S);v.push(f-1);const k=ca.length/3,z=o/2+1,p=P0.length;for(const S of v)for(let A=0;A<=o;A+=2){const C=S*(o+1)+A;ca.push(d[C*3],d[C*3+1],d[C*3+2]),to.push(y[C*4],y[C*4+1],y[C*4+2],y[C*4+3]),ao.push(F[C])}for(let S=0;S<v.length-1;S++)for(let A=0;A<z-1;A++){const C=k+S*z+A,M=C+z;P0.push(C,C+1,M,C+1,M+1,M)}u0.push({near:m,f0:p,f1:P0.length,x0:e[c],x1:e[c+f-1]})}{const i=new u.BufferAttribute(new Uint32Array(P0),1),c=new u.Float32BufferAttribute(ca,3),f=new u.Float32BufferAttribute(to,4),h=new u.Float32BufferAttribute(ao,1);for(let d=0;d<2;d++){const y=new u.BufferGeometry;y.setAttribute("position",c),y.setAttribute("aS",f),y.setAttribute("aD",h),y.setIndex(i),y.setDrawRange(0,0),y.boundingSphere=new u.Sphere(B(-300,20,pe),1);const F=new u.Mesh(y,s);F.renderOrder=1,F.visible=!1,L.add(F),eo.push(F)}}await a.yield()}{const e=pe+Ke(Ge)+.6,t=pe+19+4.5*P.n2(Ge*.013+3,1.3)+104,o=170,r=[],s=[],g=[],i=[];let c=-1e9;for(let d=0;d<=o;d++){const y=$(e,t,d/o);c=Math.max(c,Math.max(xe(Ge,y),xe(Ge-1.2,y)-.3,xe(Ge+1.2,y)-.3)+(d===0?-.2:.3)),i.push(c)}for(let d=0;d<=o;d++){const y=$(e,t,d/o),F=(t-e)/o,w=He((i[Math.min(o,d+1)]-i[Math.max(0,d-1)])/(2*F),0,1.2),n=$(2,2.9,T(.1,.2,d/o))*$(1,.6,T(.3,.45,d/o)),m=.9*P.n2(y*.09,77);for(const v of[-1,0,1])r.push(Ge+m+v*n,i[d]+(v===0?.08:0),y),s.push(v,y-e,w);if(d<o){const v=d*3;g.push(v,v+3,v+1,v+1,v+3,v+4,v+1,v+4,v+2,v+2,v+4,v+5)}}const f=new u.BufferGeometry;f.setAttribute("position",new u.Float32BufferAttribute(r,3)),f.setAttribute("aC",new u.Float32BufferAttribute(s,3)),f.setIndex(g),f.computeBoundingSphere();const h=new u.Mesh(f,vn(G,x.gorge[2]>.5?.45:1,Ya));h.renderOrder=1,L.add(h),await a.yield()}const no=-1.22+V,ro=hs.makeWaterfall({rng:b.fork("fall"),light:Bs,top:[Rt+.4,no,pe],height:no-tt,width:16,dir:[1,0,0],launch:1.2,rainbow:0,mistCount:Math.round(220*$(.7,1,D)),mistOpacity:.24,tint:"#5a4630",lipLength:4,density:.62});L.add(ro.object),await a.yield();const B0=B(je.spiralEye.x,tt,je.spiralEye.z),Fn=je.portalSeat.position,Ns=l(x.portal),f0={side:-2.6,up:-10.5,lead:14,from:.852,to:.995},L0=b.fork("wakes"),D0=[];{const e=X.posAtDist(.89*ie,B()),t=e.x+35,o=e.z-16;for(let r=0;r<8;r++)D0.push(new u.Vector4(t+(r%4-1.5)*7.6+L0.range(-1.5,1.5)+Math.floor(r/4)*3.5,o+(Math.floor(r/4)-.5)*11+L0.range(-1.5,1.5)-r%4*1.6,-2.62+L0.range(-.14,.14),L0.range(13,18)))}const ha=new u.Mesh(new u.PlaneGeometry(154,110,1,1).rotateX(-Math.PI/2),pn(G,Ns.clone().multiplyScalar(.5),B0,je.fallFoot,D0,{skyZ:c0,skyH:h0,floorLo:Se(19,.5),floorHi:Se(27,.5),sheenK:(j(46)-j(28))/R(Hs),wakeC:new u.Vector3(D0.reduce((e,t)=>e+t.x,0)/8,D0.reduce((e,t)=>e+t.y,0)/8,0),rock:l("#4a4f58"),leafA:l("#d8661c").multiplyScalar($t*(_==="golden"?.6:.85)),leafB:l("#e89a20").multiplyScalar($t*(_==="golden"?.6:.85)),body:l("#2c2218"),rim:_==="squall"?.42:_==="golden"?.15:.24}));ha.position.set(90,tt,pe),ha.renderOrder=2,L.add(ha),await a.yield();let ua=null,Yt=null,Jt=null,m0=null;const io=[],fa=[],ma=e=>{let t=-1e9;const o=e.instanceMatrix.array;for(let r=0;r<e.count;r++)t=Math.max(t,o[r*16+12]);return e.userData.xMax=t,e},d0=(e,t)=>t.x<Rt&&t.x>e.userData.xMax+60,lo=-1.2,co=(e,t)=>(lo-t-2.5)/Math.max(e-Rt,1),da=[],Et=[[-640,-470],[-470,-310],[-310,-150],[-150,10]],H0=Et.map(()=>[]),ga=[[],[]],Pt=e=>e<-470?0:e<-310?1:e<-150?2:3,ho=Re.clone().lerp(l("#35552a"),.5).multiplyScalar(.55),it=_==="squall",g0=it?1.7:1,Rs=l0(ft.makeRockMaterial({terrain:dt,top:_==="dawn"?ho.clone().lerp(C0,.4):it?l("#aab2ba"):ho,topAmount:it?.72:.8,topSlope:it?[.8,.96]:[.98,1.16]}),G,"terrain"),uo=l("#3d5a26").lerp(Re,.3).multiplyScalar(.62),fo=l0(ft.makeRockMaterial({terrain:dt,top:_==="dawn"?uo.clone().lerp(C0,.4):it?l("#aab2ba"):uo,topAmount:it?.72:.88,topSlope:it?[.8,.96]:[.84,1.06]}),G,"terrain");await a.yield();const ge=b.fork("boulders"),gt=[],pa=[],mo=e=>Math.atan2(ke(e+1)-ke(e-1),2),Bt=q("runstones");{const e=X.nearestXZ(-585,ke(-585)).u*ie,t=X.nearestXZ(-16,pe).u*ie;let o=Bt.sign();for(let r=e+Bt.range(0,8);r<t;r+=Bt.range(10,18),o=-o){X.posAtDist(r,Te);const s=Te.x,g=ke(s),i=Ke(s),c=Pe(s)+V,f=1+1.5*Math.pow(Bt(),1.7),h=Bt(),d=Bt.range(0,6.28),y=Bt();let F=!1;for(let w=0;w<5&&!F;w++){const n=Math.max(1,f*Math.pow(.82,w)),m=c-.12*n,v=Te.y-m,k=Math.max(n+1.4,Math.sqrt(Math.max(0,(4.7+1.1*n)*(4.7+1.1*n)-v*v))),z=i+.4;if(k>z)continue;const p=k+(z-k)*.7*h;for(const S of[o,-o]){const A=g+S*p;if(F||Je(s,A)>.15||Je(s,g+S*(p+n))>.15||Math.hypot(s,A)<17.5)continue;const C=X.nearestXZ(s,A);Math.hypot(C.dist,C.y-m)-n*1.1<4.5||(gt.push({x:s,y:m,z:A,r:n,near:!1,pd:C.dist,inStream:!0,yaw:d}),pa.push([s,It(s)+.05,A,n*1.08,y,mo(s)]),F=!0)}}}}await a.yield();const qs=Math.round(90*$(.75,1,D));for(let e=0,t=0;e<1400&&t<qs;e++){(e&63)===63&&await a.yield();const o=ge.range(-600,5),r=ke(o),s=Ke(o),g=ge.sign(),i=ge.chance(.5),c=i&&Bt.chance(.35),f=c?ge.range(3.2,s+1.2):ge.range(s+1,19),h=r+g*f,d=c?ge.range(.9,2.1):ge.range(.7,2.6);if(Je(o,h)>.15||Math.hypot(o,h)<17.5)continue;let y=!0;for(const m of gt)if(Math.hypot(m.x-o,m.z-h)<(m.r+d)*(c&&m.inStream?2.6:1.25)){y=!1;break}if(!y)continue;const F=Pe(o)+V,w=c?F-.12*d:Ue(o,h)+.22*d,n=X.nearestXZ(o,h);Math.hypot(n.dist,n.y-w)-d*1.1<4.5||(gt.push({x:o,y:w,z:h,r:d,near:!1,pd:n.dist,inStream:c,yaw:ge.range(0,6.28)}),t++,c&&pa.push([o,It(o)+.05,h,d*ge.range(1.02,1.14),ge(),mo(o)]))}[...gt].sort((e,t)=>e.pd-t.pd).slice(0,12).forEach(e=>{e.near=!0});for(let e=0;e<46;e++){const t=ge.range(0,6.283),o=ge.range(.985,1.07),r=90+Math.cos(t)*74*o,s=pe+Math.sin(t)*52*o,g=ge.range(1,3);r<30||gt.push({x:r,y:Math.max(Ue(r,s),tt-.5)+.2*g,z:s,r:g,near:!1,pd:99,inStream:!1,yaw:ge.range(0,6.28)})}await a.yield();{const e=ft.rockGeometry({rng:ge,kind:"boulder",radius:1,detail:3});await a.yield();const t=ft.rockGeometry({rng:ge,kind:"boulder",radius:1,detail:2});await a.yield();const o=ft.rockGeometry({rng:ge,kind:"boulder",radius:1,detail:1});await a.yield();const r=new u.Matrix4,s=new u.Quaternion,g=new u.Euler,i=new u.Color,c=[[o,gt.filter(f=>!f.near&&f.pd>=11),-1]];for(let f=0;f<Et.length;f++)c.push([e,gt.filter(h=>h.near&&Pt(h.x)===f),f],[t,gt.filter(h=>!h.near&&h.pd<11&&Pt(h.x)===f),f]);for(const[f,h,d]of c){if(!h.length)continue;const y=new u.InstancedMesh(f,fo,h.length);d>=0&&H0[d].push(y),h.forEach((F,w)=>{g.set(ge.range(-.25,.25),F.yaw,ge.range(-.25,.25)),s.setFromEuler(g);const n=F.inStream&&F.x<-412?1:0;y.setMatrixAt(w,r.compose(Te.set(F.x,F.y+n*.32*F.r,F.z),s,Ee.set(F.r*ge.range(1,1.2),F.r*(F.inStream?ge.range(1,1.25):ge.range(.72,.9)),F.r*ge.range(.9,1.1)))),y.setColorAt(w,i.setScalar((F.inStream?ge.range(.72,1):ge.range(.75,1.15))*g0*(1+.3*n)))}),y.instanceMatrix.needsUpdate=!0,y.instanceColor.needsUpdate=!0,y.computeBoundingSphere(),L.add(y),await a.yield()}}await a.yield();{const e=Math.round(1e3*D),t=ft.rockGeometry({rng:ge,kind:"rock",radius:1,detail:0}),o=Math.ceil(e*.5),r=Et.map(()=>new u.InstancedMesh(t,Rs,o+780)),s=new u.Matrix4,g=new u.Quaternion,i=new u.Euler,c=new u.Color;m0=r;let f=0;for(let h=0;h<e*5&&f<e;h++){(h&127)===0&&await a.yield();const d=ge.range(-640,8),y=Ke(d),F=ke(d)+ge.sign()*(y+.2+Math.pow(ge(),1.4)*15),w=.12+.46*Math.pow(ge(),2.2);if(Math.hypot(d,F)<13)continue;const n=xe(d,F);if(n<Pe(d)+V-.2)continue;i.set(ge.range(0,6.28),ge.range(0,6.28),ge.range(0,6.28)),g.setFromEuler(i);const m=r[Pt(d)],v=m.userData.n||0;v>=o||(m.setMatrixAt(v,s.compose(Te.set(d,n+w*.2,F),g,Ee.set(w*ge.range(1,1.5),w*ge.range(.55,.8),w))),m.setColorAt(v,c.setScalar(ge.range(.75,1.45)*g0)),m.userData.n=v+1,f++)}await a.yield();for(let h=0;h<Math.round(190*D);h++){const d=ge.range(St+4,Wt-4),y=pe-ge.range(ws+.4,vs-.4),F=.1+.3*Math.pow(ge(),1.8),w=xe(d,y);i.set(ge.range(0,6.28),ge.range(0,6.28),ge.range(0,6.28)),g.setFromEuler(i);const n=r[Pt(d)],m=n.userData.n||0;m>=o||w<Pe(d)+V-.1||(n.setMatrixAt(m,s.compose(Te.set(d,w+F*.15,y),g,Ee.set(F*ge.range(1,1.5),F*ge.range(.5,.75),F))),n.setColorAt(m,c.setScalar(ge.range(.9,1.5)*g0)),n.userData.n=m+1)}r.forEach((h,d)=>{h.count=h.userData.n||0,h.instanceMatrix.needsUpdate=!0,h.instanceColor&&(h.instanceColor.needsUpdate=!0),h.computeBoundingSphere(),L.add(h),H0[d].push(h)})}{const e=yn(),t=bn(G,{floor:Ja,sky:W0,crestK:oo,whiteK:so*.9,shade:x.gorge[2]>.5?.4:1});for(let o=0;o<2;o++){const r=pa.filter(f=>Pt(f[0])>>1===o);if(!r.length)continue;const s=new u.InstancedBufferGeometry;s.setIndex(e.index),s.setAttribute("position",e.position);const g=new Float32Array(r.length*4),i=new Float32Array(r.length*2);r.forEach((f,h)=>{g.set([f[0],f[1],f[2],f[3]],h*4),i.set([f[4],f[5]],h*2)}),s.setAttribute("iF",new u.InstancedBufferAttribute(g,4)),s.setAttribute("iG",new u.InstancedBufferAttribute(i,2)),s.instanceCount=r.length;const c=new u.Mesh(s,t);c.frustumCulled=!1,c.renderOrder=3,L.add(c),ga[o].push(c)}}await a.yield();{const e=b.fork("floaters"),t=Q==="late"?1.6:Q==="early"?.75:1,o=Math.round(1800*D*H),r=Math.round(5200*$(1,D,.5)*Math.min(t,1.3)),s=Math.round(1500*D*t),g=Math.round(17500*D*Math.min(t,1.3)),i=new u.Color,c=[[],[],[],[],[],[]];let f=c[0];const h=Me.clone().lerp(l(Ea[3]),.6),d=w=>{const n=e();return n<.34?i.copy(Le).multiplyScalar(e.range(.6,1)):n<.56?i.copy(Le).lerp(Me,.45):n<.78?i.copy(Me).multiplyScalar(.9):n<.93?i.copy(ze).multiplyScalar(.85):i.copy(h),i.multiplyScalar(e.range(.7,1.05)*w)},y=(w,n,m,v,k,z,p,S,A)=>{d(A),f.push(w,n,m,v,k,z,p,S,i.r,i.g,i.b)};for(let w=0;w<o;w++)y(e.range(0,441),e.gauss()*2.4,e(),e.range(.13,.2),0,e.range(3.5,6.5),e.range(-1.2,1.2),0,.85);await a.yield(),f=c[5];for(let w=0;w<r;w++)y(Math.floor(e()*2)*Math.PI+Math.PI/4,e(),e.gauss()*.9,e.range(.15,.24),1,e.range(.012,.02),e.range(-.3,.3),e.gauss()*.22,.9);await a.yield();for(let w=0;w<s;w++){const n=e.range(0,6.283),m=Math.sqrt(e())*.9;y(90+Math.cos(n)*74*m,pe+Math.sin(n)*52*m,e(),e.range(.14,.22),2,e.range(.4,2.5),e.range(-.2,.2),0,.85)}for(let w=0,n=0;w<g&&n<g*6;n++){(n&63)===0&&await a.yield();const m=e.range(-640,9),v=ke(m),k=Ke(m),z=e.sign(),p=z<0&&m>-95&&e.chance(.6),S=k+.5+(p?e()*46:Math.pow(e(),1.5)*17),A=v+z*S;if(Je(m,A)>.3&&e.chance(.8)||P.n2(m*.16+31,A*.16)<-.15&&e.chance(.75)||Math.hypot(m-.5,A+1)<12)continue;const C=xe(m,A);C<Pe(m)+V+.35||(f=c[1+Pt(m)],y(m,C,A,e.range(.13,.22),3,e.range(0,6.28),e.chance(.35)?e.range(.3,1):0,e(),1),w++)}{const w=q("strand"),n=Math.round(340*D);for(let m=0;m<n;m++){const v=w.range(St-2,Wt+2),k=T(-.5,.6,Za(v)),z=w.chance(.3+.7*k),p=na(v)+.1+Math.abs(w.gauss())*(.25+.3*k),S=pe-p,A=w.range(.12,.2),C=w.range(0,6.28),M=w(),E=w.range(.7,1),K=w();if(!z||Je(v,S)<.5)continue;const ae=xe(v,S);ae<Pe(v)+V+.28||(M<.4?i.copy(Le):M<.7?i.copy(Le).lerp(Me,.5):M<.9?i.copy(ze).multiplyScalar(.85):i.copy(h),i.multiplyScalar(E),c[1+Pt(v)].push(v,ae,S,A,3,C,0,K,i.r,i.g,i.b))}}const F=gn(G,B0);for(let w=0;w<c.length;w++){await a.yield();const n=c[w],m=n.length/11;if(!m)continue;const v=new Float32Array(m*4),k=new Float32Array(m*4),z=new Float32Array(m*3);for(let A=0;A<m;A++){for(let C=0;C<4;C++)v[A*4+C]=n[A*11+C],k[A*4+C]=n[A*11+4+C];for(let C=0;C<3;C++)z[A*3+C]=n[A*11+8+C]}const p=new u.InstancedBufferGeometry;p.setAttribute("position",new u.Float32BufferAttribute([-1.62,-1.02,0,1.62,-1.02,0,0,2.22,0],3)),p.setAttribute("iA",new u.InstancedBufferAttribute(v,4)),p.setAttribute("iB",new u.InstancedBufferAttribute(k,4)),p.setAttribute("iCol",new u.InstancedBufferAttribute(z,3)),p.instanceCount=m;const S=new u.Mesh(p,F);S.frustumCulled=!1,L.add(S),w===5?ua=S:w>0&&H0[w-1].push(S)}}await a.yield();const go=_e.makeWind({direction:[1,.12],strength:x.wind,speed:1.5,gustScale:.03,gustiness:.75});await a.yield();const po={wind:go,backlight:1.2,backlightTint:"#ffae58",wrap:.8,ambient:2.2,leafAmbient:1.9,sheen:.5,detail:.4};_e.prepareLeafTexture&&await _e.prepareLeafTexture(po,a.yield);const Lt=l0(_e.windMaterial(po),G,"flora");await a.yield();const Dt=b.fork("treeGeo"),wo=Q==="early",pt=Q==="late",Wn=pt?.62:1,ct=wo?{leaf:"#b8962a",leafLight:"#e8c84a",leafDark:"#3c4a16",gold:"#d8b030",crimson:"#c05a1c"}:{leaf:"#d8501c",leafLight:"#ffb23a",leafDark:"#5a1608",gold:"#f0a020",crimson:"#b0200f"},ht={leaf:"#b81a14",leafLight:"#f0502a",leafDark:"#4a0a08",gold:"#d83a1c",crimson:"#8c0f0c"},wt=pt?{leaf:"#b8742a",leafLight:"#e0a850",leafDark:"#5a3410",gold:"#c88a30",crimson:"#a0561c"}:{leaf:"#e0a020",leafLight:"#ffe070",leafDark:"#7a4a0c",gold:"#f0c038",crimson:"#c8641a"},Gs={leaf:"#34594a",leafLight:"#6c9068",leafDark:"#1c3329",bark:"#5a483c",barkDark:"#2c221c"},wa=_e.LEAF_CELLS.cluster,p0=(wo?[["#565a14","#b4ae2a","#e4dc5c"],["#6a5a12","#d0ac24","#f4dc60"]]:pt?[["#6a4a12","#c4962c","#e6c660"]]:[["#7a5a10","#e2b020","#ffe268"],["#86560e","#e69a1c","#ffd254"]]).map(e=>e.map(t=>l(t))),Is=[{rings:5,sides:5,limbSides:3,lobes:4,cards:12,card:1.5,inner:.25},{rings:8,sides:6,limbSides:3,lobes:5,cards:22,card:1.1,inner:.3},{rings:12,sides:8,limbSides:4,lobes:5,cards:30,card:.95,inner:.3}],e0=e=>[l(e.leafDark),l(e.leaf),l(e.leafLight)],t0=(e,t)=>[l(e).multiplyScalar(.4),l(e),l(t)],vo=[e0(ct),e0(ct),t0(ct.crimson,ct.leaf),t0(ct.gold,"#ffe07a")],yo=[e0(ht),e0(ht),t0(ht.crimson,ht.leaf),t0(ht.gold,ht.leafLight)],bo=[e0(wt),e0(wt),t0(wt.gold,"#ffe890"),t0(wt.crimson,wt.leaf)],Es=[{cards:20,card:1.45,inner:.25,limbs:0},{cards:30,card:.95,inner:.3,limbs:3},{cards:54,card:.68,inner:.3,limbs:5}],va=(e,t,o,r)=>ms(Dt,wa,{...Es[e],H:t,R:4.7,thin:r,bark:l("#33271f"),palettes:o,kind:"maple"}),ya=async e=>{const t=[];return t.push(va(e,11.5,vo,pt?.42:.04)),await a.yield(),t.push(va(e,10.5,yo,pt?.28:.04)),await a.yield(),t.push(va(e,11,bo,.04)),await a.yield(),t.push(xn(Dt,wa,{...Is[e],H:14,R:3.9,thin:pt?.35:.06,palettes:p0})),await a.yield(),t.push(_e.coniferGeometry({rng:Dt,detail:e,height:18,droop:1.15,slim:1.05,...Gs})),await a.yield(),pt&&(t.push(_e.mapleGeometry({rng:Dt,detail:e,height:11.5,foliage:!1})),await a.yield()),t},xo=await ya(2),ba=await ya(1),w0=await ya(0),zt=ba.map(e=>({h:e.userData.height||12,r:e.userData.radius||4})),Kt={h:19,r:6.8},Ks=e=>ms(Dt,wa,{H:Kt.h,R:Kt.r,card:1.55,cards:32,thin:pt?.3:0,bark:l("#3a2e28"),palettes:e}),xa=[];for(const e of[vo,yo,bo])xa.push(Ks(e)),await a.yield();const a0=(_==="squall"?1.7:1)/(1+(x.patchGain||0)),_s=zn(W.fork("pine"),_e.LEAF_CELLS.needle,{H:46,tiers:5,cards:30,card:2.6,bark:l("#3c2c24"),palettes:[[l("#11241e").multiplyScalar(a0),l("#1f3c30").multiplyScalar(a0),l("#2c5040").multiplyScalar(a0)],[l("#0f201c").multiplyScalar(a0),l("#1b362c").multiplyScalar(a0),l("#28483a").multiplyScalar(a0)]]});await a.yield();const Mo=.12*ie+60,ko=X.posAtDist(Mo,B()),T0=X.tangentAtDist(Mo,B());T0.y=0,T0.normalize();const So=29,_t=ko.x+T0.z*So,jt=ko.z-T0.x*So,v0=xe(_t,jt)-.4,Ma=He((X.posAtDist(.12*ie,B()).y+12.5-v0)/46,.6,1.15),ka=new u.Mesh(_s,Lt);ka.position.set(_t,v0,jt),b.range(0,6.28),ka.scale.setScalar(Ma),L.add(ka),await a.yield();const js=.62*ie+36,vt=X.posAtDist(js,B());vt.z+=10.5,vt.y=Ue(vt.x,vt.z);const Sa=.62*ie+35,at=X.posAtDist(Sa,B()),At=X.tangentAtDist(Sa,B());At.y=0,At.normalize(),at.x+=-At.z*9.5,at.z+=At.x*9.5,at.y=Ue(at.x,at.z);const Vt=B(At.z*.819+At.x*.574,0,-At.x*.819+At.z*.574),ue=b.fork("trees"),ot=[],et=[],o0=[],za=[],Ht=[],N0=X.start,Ut=je.crownCentre,Vs=Math.round(640*D),zo=24,Ao=150,Us=Math.round(138*$(.8,1,D)),Tt=(e,t,o)=>{for(const r of Ht){const s=r.x-e,g=r.z-t,i=o+r.r;if(s*s+g*g<i*i)return!1}return!0},Zs=zt[3],Os=(e,t,o)=>{const r=Math.abs(t-ke(e)),s=Ke(e);if(r<s+2.4||t>pe&&e>Ge-56&&e<Ge+13||Je(e,t)>.05||Math.hypot(e-2,t+2)<27||Math.hypot(e-vt.x,t-vt.z)<7||Math.hypot(e-_t,t-jt)<10||o&&e>-420&&e>-430*(1-r/18)-15)return;const g=X.nearestXZ(e,t),i=g.dist;if(i<7.4)return;const c=Ue(e,t);if(c>Pe(e)+5.5||g.y-c>8.5)return;const f=Math.min(ue.range(1.15,1.5),(i-4.2)/Zs.r);if(f<.88||!Tt(e,t,1.3))return;Ht.push({x:e,z:t,r:1.3});const h={x:e,y:c,z:t,s:f,rot:ue.range(0,6.28),d:i,pd:i,u:g.u,v:3};i<10.5&&et.length<zo?et.push(h):ot.push(h)};{const e=r=>X.nearestXZ(r,r<-440?ke(r):pe).u*ie,t=e(-505),o=e(-24);for(const r of[1,-1]){let s=t+(r>0?4:20)+ue.range(0,8);for(;s<o;){X.posAtDist(s,Te),X.tangentAtDist(s,Ee);const g=Math.hypot(Ee.x,Ee.z)||1,i=Ee.x/g,c=Ee.z/g,f=Te.x,h=Te.z,d=ue.chance(.4)?4:3,y=r<0&&f>St-10&&f<Wt+10;let F=r>0?ue.range(8.6,9.8):ue.range(9,10.5);r<0&&(F=Math.max(F,y?ue.range(17.5,19):0,f>-420?18*(1-(-f-15)/430)+1.2:0));const w=ue.range(2.4,3.6);for(let n=0;n<d;n++){const m=(n-(d-1)/2)*w+ue.range(-.8,.8),v=F+(n===0?0:ue.range(0,3.4));Os(f+i*m-c*v*r,h+c*m+i*v*r,r<0)}s+=ue.range(25,34)}}}await a.yield();const R0=(e,t,o)=>{const r=X.nearestXZ(e,t),s=r.dist,g=r.u*ie,i=s>135;if(i&&za.length>=Vs)return 0;const c=Ue(e,t);if(e>14&&c<tt+1)return 0;const f=ke(e),h=t-f,d=Math.abs(h),y=h<0,F=Pe(e),w=Ke(e),n=e<13&&e>-575;if(d<w+(n?2.6:.5)&&e<13||Je(e,t)>.05||Math.hypot(e-2,t+2)<27||h>0&&d<150&&(Math.abs(e-Ge)<4.5+.03*d||d<36&&e>Ge-56&&e<Ge+13)||n&&y&&d<27&&e>-420+13.65*(d-4.5)||e>-625&&e<-425&&d<11+7*T(-610,-500,e)||Math.hypot(e-_t,t-jt)<12||Math.hypot(e-vt.x,t-vt.z)<9||Math.hypot(Ue(e+1.6,t)-Ue(e-1.6,t),Ue(e,t+1.6)-Ue(e,t-1.6))/3.2>(i?1.4:.9))return 0;const v=n&&c<F+4.5&&d<30,k=n&&!v&&d<80&&c<z0(e,t)-2,z=ue();let p;if(v?p=z<.2?3:z<.66?1:4:k?p=y?z<.5?0:z<.75?2:z<.9?3:4:z<.58?4:z<.78?3:z<.9?2:0:p=z<.46?0:z<.58?1:z<.78?2:z<.9?3:4,pt&&p===0&&ue.chance(.4)&&(p=5),i){const K=ue.range(4.6,7.4);return Tt(e,t,K*.8)?(Ht.push({x:e,z:t,r:K*.8}),za.push({x:e,y:c+K*ue.range(1.2,1.9),z:t,r:K,v:p===5?2:p}),2):0}g<250&&s<34&&(p===3||p===4)&&(p=z<.5?0:2);const S=g<250&&s<64&&p<=2&&!v&&o0.length<Us;if(!S&&g>Ao-20&&g<335&&s<16)return 0;const A=S?Kt:zt[p];let C=S?ue.range(.84,1.14):(p===3?ue.range(1.1,1.45):p===4?ue.range(.95,1.3):ue.range(1.45,1.9))*(o?1.05:1);if(g<Ao){const K=r.y-11+Math.max(0,s-14)*.45;if(c+A.h*C>K&&(C=(K-ue.range(0,1.5)-c)/A.h,C<(S?.5:.7)))return 0}else if(s<A.r*C+6.5&&c+A.h*C>r.y-6.3){if(v&&s>=8.5&&c+A.h*C*.42>r.y+2.2){if(C=Math.min(C,(s-3.6)/A.r),C<.8)return 0}else if(C=Math.min(C,(r.y-6.3-ue.range(0,1.6)-c)/A.h),C<(S?.5:.72))return 0}if(e<-30){const K=(e-N0.x)/(Ut.x-N0.x),ae=$(N0.z,Ut.z,K),J=$(N0.y,Ut.y+4,K);if(K>.03&&Math.abs(t-ae)<A.r*C+5&&c+A.h*C>J-2.5&&(C=Math.min(C,(J-2.5-c)/A.h),C<(S?.5:.72)))return 0}const M=S?A.r*C*.6:Math.max(3,A.r*C*(o?.5:.56))+(s>60?1.5:0);if(!Tt(e,t,M))return 0;Ht.push({x:e,z:t,r:M});const E={x:e,y:c,z:t,s:C,rot:ue.range(0,6.28),d:s,pd:s,u:r.u,v:p};return S?o0.push(E):n&&s<10.5&&et.length<zo?et.push(E):ot.push(E),1},Aa=(e,t)=>(X.posAtDist(e,Te),X.tangentAtDist(e,Ee),[Te.x-Ee.z*t,Te.z+Ee.x*t]),y0=$(.8,1,D);for(let e=0,t=0;e<1400&&t<110*y0;e++){(e&31)===0&&await a.yield();const[o,r]=Aa(ue.range(-40,235),Math.pow(ue(),.8)*34*ue.sign());R0(o,r,!0)===1&&t++}await a.yield();for(let e=0,t=0;e<2e3&&t<140*y0;e++){(e&31)===0&&await a.yield();const[o,r]=Aa(ue.range(-45,240),ue.range(20,78)*ue.sign());R0(o,r,!0)===1&&t++}await a.yield();for(let e=0,t=0;e<2e3&&t<118*y0;e++){(e&31)===0&&await a.yield();const[o,r]=Aa(ue.range(150,ie-185),ue.range(8,74)*ue.sign());R0(o,r,!1)===1&&t++}await a.yield();for(let e=0,t=0;e<3600;e++){(e&31)===0&&await a.yield();const o=ue.range(-880,420),r=ue.range(-320,352);(t<80*y0||X.nearestXZ(o,r).dist>135?R0(o,r,!1):0)===1&&t++}await a.yield();const Ca=[];{const e=W.fork("rim"),t=Math.round(1050*$(.7,1,D));for(let o=0;o<5600&&Ca.length<t;o++){(o&63)===0&&await a.yield();const r=e.range(96,345),s=pe+e.range(-140,140),g=e.range(4.2,6.8),i=e();if(Math.hypot((r-90)/74,(s-pe)/52)<1+Gt(r)+.05||!Tt(r,s,g*.6))continue;const c=Ue(r,s);c<tt+2.5||(Ht.push({x:r,z:s,r:g*.6}),Ca.push({x:r,y:c+g*e.range(.9,1.5),z:s,r:g,v:i<.4?0:i<.6?1:i<.84?2:i<.92?3:4}))}}await a.yield();{const e=q("wallwood"),t=Math.round(30*y0);for(let o=0,r=0;o<1200&&r<t;o++){(o&31)===0&&await a.yield();const s=e.range(Ge-80,-172),g=e.range(21,76),i=ke(s)+g,c=e(),f=e.range(.52,.86),h=e.range(0,6.28);if(Math.abs(s-Ge)<12||s<Ge&&g<44)continue;const d=Ue(s,i);if(d<Pe(s)+6.5||d>z0(s,i)-2.5||Math.hypot(Ue(s+1.6,i)-Ue(s-1.6,i),Ue(s,i+1.6)-Ue(s,i-1.6))/3.2>.6||!Tt(s,i,3.4))continue;const F=X.nearestXZ(s,i);Ht.push({x:s,z:i,r:3.4}),ot.push({x:s,y:d,z:i,s:c<.76?f:f*1.5,rot:h,d:F.dist,pd:F.dist,u:F.u,v:c<.76?4:2}),r++}}await a.yield();for(const e of[et,ot])for(let t=e.length-1;t>=0;t--){const o=e[t],r=o.x-at.x,s=o.z-at.z,g=r*Vt.x+s*Vt.z,i=Math.abs(r*Vt.z-s*Vt.x);(Math.hypot(r,s)<6.5||g>0&&g<27&&i<4.5)&&e.splice(t,1)}await a.yield();{const e=q("bankstones"),t=ft.rockGeometry({rng:e,kind:"rock",radius:1,detail:0});await a.yield();const o=ft.rockGeometry({rng:e,kind:"slab",radius:1,detail:2});await a.yield();const r=new u.Matrix4,s=new u.Quaternion,g=new u.Euler,i=new u.Color,c=(n,m)=>{const v=ke(n),k=It(n);let z=Math.max(1.5,Ke(n)-3.4),p=Ke(n)+3.4;if(xe(n,v+m*z)>k)return-1;for(let S=0;S<7;S++){const A=(z+p)/2;xe(n,v+m*A)<k?z=A:p=A}return(z+p)/2},f=8,h=Array.from({length:f},()=>[]);let d=0;for(let n=-640;n<7;n+=.9)for(const m of[-1,1]){(d++&31)===0&&await a.yield();const v=n+e.range(-.4,.4),k=e.chance(.14),z=k?e.range(.55,1.05):.14+.4*Math.pow(e(),2),p=e.range(-.9,.7)-(k?.3:0),S=e.range(0,6.28),A=e.range(0,6.28),C=e.range(0,6.28),M=e.range(1,1.5),E=e.range(.55,.85),K=e.range(.9,1.55),ae=c(v,m);if(ae<0)continue;const J=ke(v)+m*(ae+p),re=xe(v,J),Z=re<It(v)+.25;re+z*E*.95<It(v)+.06||Je(v,J)>.4||Math.hypot(v,J)<13||h[He(Math.floor((v+640)/81.25),0,f-1)].push([v,re+z*.2,J,z,S,A,C,M,E,K*(Z?.82:1.1)])}t.dispose(),h.forEach((n,m)=>{const v=m0[m>>1];for(const k of n){const z=v.count;if(z>=v.instanceMatrix.count)break;g.set(k[4],k[5],k[6]),s.setFromEuler(g),v.setMatrixAt(z,r.compose(Te.set(k[0],k[1],k[2]),s,Ee.set(k[3]*k[7],k[3]*k[8],k[3]))),v.setColorAt(z,i.setScalar(k[9]*g0)),v.count=z+1}});for(const n of m0)n.instanceMatrix.needsUpdate=!0,n.instanceColor&&(n.instanceColor.needsUpdate=!0),n.computeBoundingSphere();await a.yield();const y=[[],[]],F=[...et,...ot];let w=e.sign();for(let n=-600+e.range(0,15);n<-20;n+=e.range(18,30),w=-w){const m=e.range(1.8,2.8),v=e.range(-.45,.45),k=e.range(.12,.3),z=e.range(-.1,.16),p=e.range(.5,.78),S=e.range(.72,1),A=e.range(.25,.6),C=c(n,w);if(C<0)continue;const M=ke(n)+w*(C+A*m);if(Je(n,M)>.2||Math.abs(n-Ge)<9)continue;let E=!0;for(const K of F)if(Math.abs(K.x-n)<1.4*m+.8&&Math.abs(K.z-M)<m+.8){E=!1;break}E&&y[Pt(n)>>1].push([n,It(n)+.02,M,m,v,k,z*w,p,S])}y.forEach((n,m)=>{if(!n.length)return;const v=new u.InstancedMesh(o,fo,n.length);n.forEach((k,z)=>{g.set(k[6],k[4],-k[5],"YZX"),s.setFromEuler(g),v.setMatrixAt(z,r.compose(Te.set(k[0],k[1],k[2]),s,Ee.set(k[3],k[3]*k[7],k[3]))),v.setColorAt(z,i.setScalar(k[8]*g0))}),v.instanceMatrix.needsUpdate=!0,v.instanceColor.needsUpdate=!0,v.computeBoundingSphere(),L.add(v),ga[m].push(v)})}await a.yield();{const e=he.gust.ribStep,t=Math.ceil(ie/e)+2,o=new Float32Array(t*4),r=new Float32Array(t*4),s=p=>{X.posAtDist(He(p,0,ie),Te),X.tangentAtDist(He(p,0,ie),Ee);const S=Math.hypot(Ee.x,Ee.z)||1;return[Te.x,Te.y,Te.z,-Ee.z/S,Ee.x/S]},g=(p,S,A)=>{const C=s(A);return(p-C[0])*C[3]+(S-C[2])*C[4]},i=X.nearestXZ(St,pe).u*ie,c=[.255*ie,i-32],f=[.585*ie,.785*ie],h=[.27*ie,.775*ie],d=W.fork("ribbons"),y=[...et,...ot].filter(p=>p.v===3&&p.pd<13).map(p=>({q:p,s:p.u*ie,lat:g(p.x,p.z,p.u*ie)})),F=(p,S,A,C)=>{const M=[];for(const E of[...p].sort((K,ae)=>Math.abs(K.lat)-Math.abs(ae.lat)))E.s>S&&E.s<A&&M.every(K=>Math.abs(K.s-E.s)>=C)&&M.push(E);return M.sort((E,K)=>E.s-K.s)},w=(p,S,A)=>{const C=y.filter(E=>E.lat*p>7.2&&E.lat*p<11.5&&E.s>S&&E.s<A).map(E=>E.s).sort((E,K)=>E-K),M=[S,...C,A];for(let E=0;E<M.length-1;E++){const K=M[E+1]-M[E];if(K<=46)continue;const ae=Math.floor(K/30);for(let J=1;J<=ae;J++){const re=M[E]+K*J/(ae+1),Z=s(re),me=p*d.range(8.4,9.4),le=Z[0]+Z[3]*me,we=Z[2]+Z[4]*me,We=Ue(le,we),I=Math.abs(we-ke(le));if(I<Ke(le)+2.4||We>Pe(le)+5.5||Je(le,we)>.05||!Tt(le,we,1.3)||p>0&&le>Ge-56&&le<Ge+13||p<0&&le>-420&&le>-430*(1-I/18)-15||Math.hypot(le-at.x,we-at.z)<7||Math.hypot(le-vt.x,we-vt.z)<7||Math.hypot(le-2,we+2)<27)continue;const ve={x:le,y:We,z:we,s:d.range(1.2,1.4),rot:d.range(0,6.28),d:Math.abs(me),pd:Math.abs(me),u:re/ie,v:3};et.push(ve),Ht.push({x:le,z:we,r:1.3}),y.push({q:ve,s:re,lat:me})}}};w(-1,c[0],c[1]),w(1,f[0],f[1]);const n=F(y.filter(p=>p.lat<-7.2&&p.lat>-11.5),c[0]-10,c[1]+30,21),m=F(y.filter(p=>p.lat>7.2&&p.lat<11.5),f[0]-10,f[1]+20,21);for(const p of[...n,...m])p.q.rib=!0;const v=gt.filter(p=>(p.inStream||p.pd<9)&&p.r>.95).map(p=>{const S=X.nearestXZ(p.x,p.z).u*ie;return{b:p,s:S,lat:g(p.x,p.z,S)}}).filter(p=>p.lat>(p.s<.48*ie?4.7:3.3)&&p.lat<7.6),k=F(v,h[0]-10,h[1]+20,15);for(const p of k)p.b.rib=!0;const z=(p,S,A)=>{if(!p.length)return A;if(S<=p[0].s)return $(A,p[0].lat,T(p[0].s-14,p[0].s,S));for(let C=0;C<p.length-1;C++)if(S<=p[C+1].s)return $(p[C].lat,p[C+1].lat,T(p[C].s,p[C+1].s,S));return $(p[p.length-1].lat,A,T(0,14,S-p[p.length-1].s))};for(let p=0;p<t;p++){(p&31)===0&&await a.yield();const S=p*e,A=s(S),C=T(c[0],c[0]+26,S)*(1-T(c[1]-28,c[1],S)),M=T(f[0],f[0]+24,S)*(1-T(f[1]-26,f[1],S)),E=S>(c[1]+f[0])/2,K=E?z(m,S,9.2):z(n,S,-8.8),ae=A[0]+A[3]*K,J=A[2]+A[4]*K,re=Math.max((E?1.1:.6)+.45*Math.sin(S*.052+(E?2:0)),xe(ae,J)+2.4-A[1]);o.set([K,re,E?M:C,.9],p*4);const Z=T(h[0],h[0]+24,S)*(1-T(h[1]-26,h[1],S))*(1-.5*T(.455*ie,.48*ie,S)*(1-T(.58*ie,.61*ie,S))),me=z(k,S,6.2),le=A[0]+A[3]*me,we=A[2]+A[4]*me;let We=Math.max(Pe(le)+V+.28,xe(le,we))+1.45+.25*Math.sin(S*.09)-A[1];for(const I of k){const ve=Math.exp(-((S-I.s)*(S-I.s))/11);ve>.01&&(We=Math.max(We,$(We,I.b.y+I.b.r*1.3+.75-A[1],ve)))}r.set([me,We,Z,.3],p*4)}he.gust.setRibbons({n:t,a:o,b:r})}if(await a.yield(),$e[0]>0){const e=de[0],t=de[1],o=new Float32Array(e*t).fill(1),r=e/ce[2],s=t/ce[3],g=Qe[0],i=Qe[1],c=Qe[2],f=n=>Pe(n)+1,h=pt?.7:1,d=(n,m,v,k,z,p,S)=>{const A=Math.max(m-f(n),0),C=n+g*A*c,M=v+i*A*c,E=Math.hypot(k,z*c),K=Math.max(k,E);if(C+K<ce[0]||C-K>ce[0]+ce[2]||M+K<ce[1]||M-K>ce[1]+ce[3])return!1;const ae=Math.max(0,Math.floor((C-K-ce[0])*r)),J=Math.min(e-1,Math.ceil((C+K-ce[0])*r)),re=Math.max(0,Math.floor((M-K-ce[1])*s)),Z=Math.min(t-1,Math.ceil((M+K-ce[1])*s));for(let me=re;me<=Z;me++)for(let le=ae;le<=J;le++){const we=ce[0]+(le+.5)/r,We=ce[1]+(me+.5)/s,I=we-C,ve=We-M,Fe=(I*g+ve*i)/E,Ne=(ve*g-I*i)/k,qe=Fe*Fe+Ne*Ne;if(qe>=1)continue;const Xe=p*(1-T(.72,1,Math.sqrt(qe)))*(1-S*T(-.2,.2,P.n2(we*.42+31,We*.42+7)));o[me*e+le]*=1-Xe}return!0},y=(n,m,v,k)=>{const z=Math.max(m-f(n),0),p=Math.max(k-f(n),z),S=n+g*z*c,A=v+i*z*c,C=n+g*p*c,M=v+i*p*c,E=Math.max((C-S)*(C-S)+(M-A)*(M-A),.001),K=Math.max(0,Math.floor((Math.min(S,C)-1.5-ce[0])*r)),ae=Math.min(e-1,Math.ceil((Math.max(S,C)+1.5-ce[0])*r)),J=Math.max(0,Math.floor((Math.min(A,M)-1.5-ce[1])*s)),re=Math.min(t-1,Math.ceil((Math.max(A,M)+1.5-ce[1])*s));for(let Z=J;Z<=re;Z++)for(let me=K;me<=ae;me++){const le=ce[0]+(me+.5)/r,we=ce[1]+(Z+.5)/s,We=He(((le-S)*(C-S)+(we-A)*(M-A))/E,0,1),I=Math.hypot(le-$(S,C,We),we-$(A,M,We));I<1.2&&(o[Z*e+me]*=1-.85*(1-T(.35,1.2,I)))}};let F=0;const w=async(n,m,v)=>{(F++&63)===63&&await a.yield();const k=v?0:n.v,z=m.h*n.s,p=m.r*n.s,S=n.y+z*(k===3?.72:k===4?.5:.64),A=p*(k===4?.8:.92),C=z*(k===3?.24:k===4?.42:.3);d(n.x,S,n.z,A,C,(k===3?.62:k===4?.92:k===5?.22:.86)*(k===4?1:h),k===4?.3:k===3?.75:.6)&&y(n.x,n.y,n.z,S)};for(const n of et)await w(n,zt[n.v],!1);for(const n of ot)await w(n,zt[n.v],!1);for(const n of o0)await w(n,Kt,!0);await a.yield();{const n=(je.crownTop.y-je.crownCentre.y)*1.25;d(Ut.x,Ut.y,Ut.z,n,n*.8,.7,.5)&&y(0,xe(0,0),0,Ut.y)}{const n=46*Ma;d(_t,v0+n*.62,jt,6.5*Ma,n*.3,.9,.3)&&y(_t,v0,jt,v0+n*.62)}await a.yield();for(let n=0;n<o.length;n++)De[n]=Math.round(255*(1-o[n]));G.tShade.value.needsUpdate=!0}await a.yield();const b0=X.nearestXZ(0,pe).u*ie,Co=[];{const e=q("bursts"),t=X.nearestXZ(nt,ke(nt)).u*ie,o=b0-50,r=w=>{X.posAtDist(He(w,0,ie),Te),X.tangentAtDist(He(w,0,ie),Ee);const n=Math.hypot(Ee.x,Ee.z)||1;return[Te.x,Te.y,Te.z,Ee.x/n,Ee.z/n]},s=(w,n,m)=>m<0?(w<St-8||w>Wt+8)&&n<=b0-150:w<Ge-190||w>Ge+12,g=[],i=(w,n,m)=>{if(w.v>3)return;const v=w.u*ie;if(v<t-5||v>o+5||w.pd<7.2||w.pd>30)return;const k=r(v),z=(w.x-k[0])*-k[4]+(w.z-k[2])*k[3],p=z<0?-1:1;s(w.x,v,p)&&g.push({p:w,s:v,lat:z,side:p,g:n,quilt:m,used:!1})};for(const w of et)i(w,zt[w.v],!1);for(const w of ot)i(w,zt[w.v],!1);for(const w of o0)i(w,Kt,!0);const c=[],f=(w,n)=>{let m=null,v=1e9;for(const k of g){if(k.used||Math.abs(k.s-w)>n||c.some(p=>Math.abs(p.s-k.s)<5))continue;const z=Math.abs(k.s-w)+.3*Math.abs(Math.abs(k.lat)-12);z<v&&(v=z,m=k)}return m&&(m.used=!0,c.push(m)),m};for(let w=t;w<=o;w+=10)c.some(n=>Math.abs(n.s-w)<5)||f(w,5)||f(w,8.5);const h=(w,n)=>w.clone().multiplyScalar(n),d=[[l(ct.leaf),h(l(ct.leafLight),.8),l(ct.crimson),h(l(ct.gold),.9)],[l(ht.leaf),h(l(ht.leafLight),.9),l(ht.crimson)],[h(l(wt.leaf),.9),h(l(wt.gold),.85),h(l(wt.leafLight),.75)],[h(p0[0][1],.9),h(p0[0][2],.75),h(p0[p0.length-1][1],.8)]],y=l("#f2dcae"),F=900*$(.6,1,D)*$(.9,1.08,(H-.7)/.6);for(const w of c){const n=w.p,m=w.g,v=!w.quilt&&n.v===3,k=r(w.s),z=n.y+m.h*n.s*(v?.72:.64),p=m.r*n.s*.92,S=m.h*n.s*(v?.24:.3),A=z-k[1],C=A<0,M=T(4,9,-A),E=w.side*(C?$(e.range(2.6,5.4)+.9*M,Math.abs(w.lat),.55):$(e.range(1.4,3),e.range(4.2,5.6),T(b0-190,b0-130,w.s))),K=(C?$(He(A+5.5,-17,-2.8),He(A+14,-6,.8),M):He(A*.7,4.6,7.2))+e.range(-.3,.3);Co.push({c:[n.x,z,n.z],r:p,ry:S,s:w.s,t:[k[3],k[4]],lat:E,hgt:K,n:Math.round(F*He(p/5.5,.8,1.25)*(C?1+.6*M:1)),cols:C?d[n.v].map(ae=>ae.clone().lerp(y,.06).multiplyScalar(1.12)):d[n.v],size:C?$(1.35,1.05,M):1,tight:C?.42:1,fan:C?[$(1.5,1,M),$(1,.75,M)]:null})}}await a.yield(),await he.setBursts(Co,q("burstLeaves")),await a.yield();const Fo=e=>e.v===4&&e.x>13&&e.x<215&&Math.abs(e.z-pe)<120,Wo=ot.filter(e=>e.d<34),Xs=ot.filter(e=>e.d>=34&&!Fo(e)),Qs=ot.filter(e=>e.d>=34&&Fo(e)),s0=(e,t,o,r,s)=>_e.makeScatter({rng:b.fork(e),points:t,variants:o,material:Lt,chunks:r,cullDistance:s,sink:.02,tilt:.04,tint:.2,hue:.07}),q0=s0("forest",Xs,w0,9,285);await a.yield();const G0=s0("runwood",Wo,ba,14,1/0);await a.yield();const I0=s0("runwood",Wo,w0,14,1/0);await a.yield();const E0=s0("nearwood",et,xo,8,1/0);await a.yield();const K0=s0("nearwood",et,w0,8,1/0);await a.yield();const _0=_e.makeScatter({rng:b.fork("quilt"),points:o0,variants:xa,material:Lt,chunks:7,cullDistance:300,sink:.02,tilt:.03,tint:.2,hue:.07});await a.yield(),L.add(G0.object,I0.object,K0.object);const $s=[[G0,I0,105,245],[E0,K0,62,245]].map(([e,t,o,r])=>{const s=g=>{g.updateWorldMatrix(!0,!1);const i=g.boundingSphere||g.geometry.boundingSphere;return i?{c:i.center.clone().applyMatrix4(g.matrixWorld),r:i.radius}:{c:B(),r:1e4}};return{a:e.meshes,b:t.meshes,ca:e.meshes.map(s),cb:t.meshes.map(s),D:o,cull:r,same:e.meshes.length===t.meshes.length}}),Ys=e=>{for(const t of $s){for(let o=0;o<t.a.length;o++){const r=t.ca[o],s=Math.hypot(r.c.x-e.x,r.c.y-e.y,r.c.z-e.z)-r.r,g=s<t.D;t.a[o].visible=g&&!d0(t.a[o],e),t.same&&(t.b[o].visible=!g&&s<t.cull&&!d0(t.b[o],e))}if(!t.same)for(let o=0;o<t.b.length;o++){const r=t.cb[o],s=Math.hypot(r.c.x-e.x,r.c.y-e.y,r.c.z-e.z)-r.r;t.b[o].visible=s>=t.D&&s<t.cull&&!d0(t.b[o],e)}}};L.add(q0.object,E0.object,_0.object);for(const e of[q0,_0,G0,I0,E0,K0])e.meshes.forEach(ma);fa.push(...q0.meshes,..._0.meshes),await a.yield();const Zt=[];{const e=b.fork("ledges");for(let t=0;t<700&&Zt.length<84;t++){(t&31)===31&&await a.yield();const o=e.range(0,6.283),r=e.int(1,Qt-1);let s=0,g=0,i=r/Qt;for(let y=0;y<5;y++){const F=1+Gt(s||90)*i;s=90+Math.cos(o)*74*F,g=pe+Math.sin(o)*52*F,i=He((r-.05-Oa(s,g,i))/Qt,.02,.98)}if(s<30||s>205)continue;const c=xe(s,g);if(z0(s,g)-c<6||c<tt+4||Math.max(Math.abs(xe(s+1.2,g)-xe(s-1.2,g)),Math.abs(xe(s,g+1.2)-xe(s,g-1.2)))/2.4>.75||!Tt(s,g,6.2))continue;Ht.push({x:s,z:g,r:6.2});const d=e.int(3,5);for(let y=0;y<d;y++){const F=e.range(0,6.283),w=y===0?0:e.range(1.5,3.9),n=Math.hypot(Math.sin(o)*74,Math.cos(o)*52)||1,m=-Math.sin(o)*74/n,v=Math.cos(o)*52/n;if(y!==0&&Math.abs(xe(s+Math.cos(F)*w,g+Math.sin(F)*w)-c)>1.3)continue;const k=e(),z=k<.45?3:k<.72?2:4,p=(z===3?e.range(.42,.62):z===2?e.range(.5,.74):e.range(.3,.44))*(y===0?1.1:.85),S=e.range(0,6.28),A=(y%2?1:-1)*Math.ceil(y/2)*w*1.25,C=Math.sin(F)*.9,M=s+m*A+v*C,E=g+v*A-m*C,K=y===0?c:xe(M,E);Math.abs(K-c)>2.4||Zt.push({x:M,y:K,z:E,s:p*(z===4?1.9:1.5),rot:S,d:60,pd:60,u:.9,v:z})}}}const Po=_e.coniferGeometry({rng:q("hemlock"),detail:1,height:18,droop:1.2,slim:1,leaf:it?"#35604e":"#27473a",leafLight:it?"#5c8a74":"#4a765e",leafDark:it?"#1c3329":"#142a22",bark:"#4a3a30",barkDark:"#241b16"});await a.yield();for(const e of Qs)Zt.push({x:e.x,y:e.y,z:e.z,s:e.s,rot:e.rot,d:60,pd:60,u:.9,v:4});const Fa=w0.map((e,t)=>t===4?Po:e);for(const e of Zt)e.kt=co(e.x,e.y+(Fa[e.v].userData.height||14)*e.s*1.1);Zt.sort((e,t)=>e.kt-t.kt);const Wa=s0("ledgewood",Zt,Fa,1,430);for(const e of Wa.meshes){const t=Float32Array.from(Zt.filter(o=>Fa[o.v]===e.geometry).map(o=>o.kt));t.length===e.count&&(e.userData.kt=t,da.push(e))}L.add(Wa.object),await a.yield();{const e=[...et,...ot.filter(t=>t.pd<60)].sort((t,o)=>t.x-o.x).map(t=>[t.x,t.z,1.6*t.s]);for(let t=0;t<e.length;t+=20)dt.addContact(e.slice(t,t+20),{radius:1,reach:2.2,strength:.5}),await a.yield()}await a.yield();{const e=q("crowngeo"),t=(M,E)=>{const K=[],ae=[],J=[];for(const Z of M){const me=Z.ico?new u.IcosahedronGeometry(1,0):new u.OctahedronGeometry(1,0),le=me.getAttribute("position"),we=e.range(0,6.28),We=Math.cos(we),I=Math.sin(we);for(let ve=0;ve<le.count;ve++){const Fe=le.getX(ve),Ne=le.getY(ve),qe=le.getZ(ve),Xe=1+.2*Math.sin(Fe*5.1+Ne*3.3+we)+.12*Math.cos(qe*6.7+we*2),Ze=Z.c[0]+(Fe*We-qe*I)*Xe*Z.r[0],ut=Z.c[1]+Ne*Xe*Z.r[1],lt=Z.c[2]+(Fe*I+qe*We)*Xe*Z.r[0];K.push(Ze,ut,lt),Te.set(Ze,ut*.8+.3,lt).normalize(),ae.push(Te.x,Te.y,Te.z),J.push(0)}me.dispose()}if(E)for(let Z=0;Z<5;Z++){const me=Z/5*6.283,le=(Z+1)/5*6.283,we=Math.cos(me),We=Math.sin(me),I=Math.cos(le),ve=Math.sin(le),Fe=E.r,Ne=E.r*.6,qe=E.y0,Xe=-.3;for(const[Ze,ut,lt,r0]of[[we,We,qe,Fe],[we,We,Xe,Ne],[I,ve,qe,Fe],[I,ve,qe,Fe],[we,We,Xe,Ne],[I,ve,Xe,Ne],[we,We,qe,Fe],[I,ve,qe,Fe],[we,We,Xe,Ne],[I,ve,qe,Fe],[I,ve,Xe,Ne],[we,We,Xe,Ne]])K.push(Ze*r0,lt,ut*r0),ae.push(Ze,.2,ut),J.push(1)}const re=new u.BufferGeometry;return re.setAttribute("position",new u.Float32BufferAttribute(K,3)),re.setAttribute("normal",new u.Float32BufferAttribute(ae,3)),re.setAttribute("aMgBark",new u.Float32BufferAttribute(J,1)),re.computeBoundingSphere(),re},o=e.range(0,6.28),r=t([{ico:!0,c:[0,0,0],r:[1,1]},{c:[.66*Math.cos(o),-.16,.66*Math.sin(o)],r:[.62,.6]},{c:[.6*Math.cos(o+2.5),.22,.6*Math.sin(o+2.5)],r:[.58,.56]}]),s=t([{ico:!0,c:[0,0,0],r:[1,1]}]),g=t([{c:[0,0,0],r:[1.08,1.05]}]),i=l0(new u.MeshLambertMaterial({color:16777215}),G,"dome"),c=new u.Matrix4,f=new u.Quaternion,h=new u.Euler,d=new u.Color,y=[l(ct.leaf),l(ht.leaf),l(wt.leaf),l("#d8a428"),l("#1c3026")];[l(ct.leaf),l(ht.leaf),l(wt.leaf),l("#d8a428"),l("#1c3026")].forEach((M,E)=>G.crownRamp[E].copy(M).multiplyScalar(E===4?.8:.7));const F=(M,E,K)=>{const ae=new u.InstancedMesh(M,i,Math.max(1,E.length));return E.forEach((J,re)=>{ae.setMatrixAt(re,J.m),ae.setColorAt(re,J.c)}),ae.count=E.length,ae.instanceMatrix.needsUpdate=!0,ae.instanceColor&&(ae.instanceColor.needsUpdate=!0),ae.computeBoundingSphere(),ae.name="dome",L.add(ae),K||io.push(ma(ae)),ae},w=M=>M<-430?0:M<-60?1:2,n=[[],[],[]],m=[[],[]];za.forEach(M=>{h.set(ue.range(-.2,.2),ue.range(0,6.28),ue.range(-.2,.2)),f.setFromEuler(h);const E=new u.Matrix4().compose(Te.set(M.x,M.y,M.z),f,Ee.set(M.r,M.r*ue.range(.95,1.5),M.r));d.copy(y[M.v]).multiplyScalar(ue.range(.5,.85)),M.v!==4&&ue.chance(.3)&&d.lerp(y[ue.int(0,3)],.5),(X.nearestXZ(M.x,M.z).dist>260?m[M.x<-300?0:1]:n[w(M.x)]).push({m:E,c:d.clone().multiplyScalar(M.v===4?1.25:1.1)})}),await a.yield();const v=e.range(0,6.28),k=[{ico:!0,c:[0,0,0],r:[.9,.86]},{c:[.62*Math.cos(v),.3,.62*Math.sin(v)],r:[.56,.52]},{c:[.66*Math.cos(v+1.9),-.2,.66*Math.sin(v+1.9)],r:[.6,.5]},{c:[.6*Math.cos(v+3.9),.12,.6*Math.sin(v+3.9)],r:[.54,.56]},{c:[.1,.72,-.08],r:[.5,.42]}],z=t(k),p=t(k,{r:.085,y0:-2.9}),S=q("rimtone"),A=[],C=[];Ca.forEach(M=>{h.set(ue.range(-.2,.2),ue.range(0,6.28),ue.range(-.2,.2)),f.setFromEuler(h);const E=ue.range(1,1.5);d.copy(y[M.v]).multiplyScalar(ue.range(.5,.85)),M.v!==4&&ue.chance(.3)&&d.lerp(y[ue.int(0,3)],.5);const K=S.range(.66,1.3),ae=S.range(1.05,1.5),J=S.range(-.08,.08);d.multiplyScalar((M.v===4?1.25:1.1)*K),d.r*=1+J,d.b*=1-J;const re=Math.hypot((M.x-90)/74,(M.z-pe)/52)-(1+Gt(M.x)+.05),Z=re<.34;if(Z&&P.n2(M.x*.07+5,M.z*.07)>.42)return;const me=Z?M.y+M.r*ae:M.y;(Z?C:A).push({kt:co(M.x,me+M.r*(Z?1:E)*1.3),m:new u.Matrix4().compose(Te.set(M.x,me,M.z),f,Ee.set(M.r,M.r*(Z?1:E),M.r)),c:d.clone()})}),A.sort((M,E)=>M.kt-E.kt),C.sort((M,E)=>M.kt-E.kt),Yt=F(z,A,!0),Yt.name="rim-wood",Yt.userData.kt=Float32Array.from(A.map(M=>M.kt)),Jt=F(p,C,!0),Jt.name="rim-edge",Jt.userData.kt=Float32Array.from(C.map(M=>M.kt)),da.push(Yt,Jt),await a.yield();{const M=q("flankwood"),E=17,K=[];let ae=0;for(let J=-905;J<-330;J+=E)for(const re of[-1,1])for(let Z=84;Z<335;Z+=E){(ae++&63)===0&&await a.yield();const me=J+M.range(-6,6),le=ke(me)+re*(Z+M.range(-6,6)),we=M.range(5.2,8.2),We=M.range(1,1.55),I=M.range(.95,1.45),ve=M(),Fe=M.range(.6,.92),Ne=M(),qe=M.range(0,6.28),Xe=M.range(-.2,.2),Ze=M.range(-.2,.2);if(X.nearestXZ(me,le).dist<82||!Tt(me,le,we*.62))continue;const ut=Ue(me,le),lt=ve<.42?0:ve<.58?1:ve<.8?2:ve<.9?3:4;h.set(Xe,qe,Ze),f.setFromEuler(h),d.copy(y[lt]).multiplyScalar(lt===4?Fe*1.25:Fe*1.1),lt!==4&&Ne<.3&&d.lerp(y[Math.floor(Ne*13.3)%4],.5),(Z<140?n[w(me)]:Z<240?m[0]:K).push({m:new u.Matrix4().compose(Te.set(me,ut+we*We,le),f,Ee.set(we,we*I,we)),c:d.clone()})}K.length&&F(g,K)}for(const M of n)M.length&&F(r,M);for(const M of m)M.length&&F(s,M)}await a.yield();const j0=(e,t)=>{if(e>8||e<-640)return 0;const o=Math.abs(t-ke(e)),r=Ke(e);return o<r+1.5||o>(e>-95&&t<ke(e)?50:25)||Math.hypot(e,t)<11.5||t>pe&&Math.abs(e-Ge)<3.2||fe==="moose"&&Math.hypot(e-Pa.x,t-Pa.z)<9||Ye&&Ue(e,t)>Pe(e)+V+4?0:(Ue(e,t)<Pe(e)+V+.55?0:1)*(1-.9*Je(e,t))},Pa=X.posAtDist(.54*ie+7.5,B());Pa.z-=9.5;const Ye=_==="dawn",Bo=b.fork("ferns"),Ba=[];for(const[e,t,o]of[[Ye?"#4f5848":"#9a7c34",Ye?"#76816f":"#c8ac58",Ye?"#30362b":"#5a441c"],[Ye?"#555a46":"#a4853a",Ye?"#7a8470":"#d0b460",Ye?"#343828":"#66501e"],[Ye?"#274a30":"#2c5a34",Ye?"#5c7566":"#5c8a4a","#12301c"]])Ba.push(_e.fernGeometry({rng:Dt,leaf:e,leafLight:t,leafDark:o})),await a.yield();const V0=q("wallcover"),La=[],U0=(e,t)=>Math.hypot(xe(e+1,t)-xe(e-1,t),xe(e,t+1)-xe(e,t-1))/2,Da=(e,t)=>U0(e,t)<.45&&xe(e,t)>Pe(e)+V+.55&&Math.abs(t-ke(e))>Ke(e)+1.5&&X.nearestXZ(e,t).dist>7.5&&Je(e,t)<.05,Z0=async(e,t)=>{const o=[];let r=0;for(const s of e){if(U0(s.x,s.z)<=.9)continue;(r++&15)===15&&await a.yield();const g=xe(s.x+1,s.z)-xe(s.x-1,s.z),i=xe(s.x,s.z+1)-xe(s.x,s.z-1),c=Math.hypot(g,i)||1,f=g/c,h=i/c;let d=0,y=0,F=!1;for(let m=1;m<=14&&!F;m++)for(const v of[-1,1]){const k=s.x+v*f*m*.6,z=s.z+v*h*m*.6;if(Da(k,z)){d=k,y=z,F=!0;break}}for(let m=15;m<=44&&!F;m++){const v=s.x-f*m*.6,k=s.z-h*m*.6;Da(v,k)&&(d=v,y=k,F=!0)}if(!F){const m=s.z<ke(s.x)?-1:1;d=s.x,y=ke(s.x)+m*(Ke(s.x)+5.5)}let w=null,n=7;for(const m of o){if(m.list.length>=m.cap)continue;const v=Math.hypot(m.x-d,m.z-y);v<n&&(n=v,w=m)}w||(w={x:d,z:y,ux:f,uz:h,cap:V0.int(3,6),lip:V0.chance(.35),list:[]},o.push(w)),w.list.push(s)}for(const s of o){if(!s.list.length||s.list.length>=3)continue;let g=null,i=30;for(const c of o){if(c===s||!c.list.length||c.list.length+s.list.length>6)continue;const f=Math.hypot(c.x-s.x,c.z-s.z);f<i&&(i=f,g=c)}g&&(g.list.push(...s.list),s.list=[])}for(const s of o){if(!s.list.length)continue;let g=s.x,i=s.z;if(s.lip)for(let c=0;c<12;c++){const f=g-s.ux*.35,h=i-s.uz*.35;if(U0(f,h)>.8||!Da(g,i))break;g=f,i=h}s.list.forEach((c,f)=>{let h=g,d=i;if(f>0)for(let y=0;y<4;y++){const F=V0.range(0,6.28),w=V0.range(.5,1.15)*t,n=g+(-s.uz*Math.cos(F)+s.ux*.45*Math.sin(F))*w,m=i+(s.ux*Math.cos(F)+s.uz*.45*Math.sin(F))*w;if(h=n,d=m,U0(n,m)<.9)break;h=g+(n-g)*.3,d=i+(m-i)*.3}c.x=h,c.z=d,c.y=xe(h,d),c.d=X.nearestXZ(h,d).dist}),La.push([g,i,.9*t])}await a.yield()},Lo={path:X,heightAt:xe,count:Math.round(540*D*H),radius:24,corridor:5.5,clear:0,falloff:.6,uRange:[.13,.86],density:j0,scale:Ye?[.6,1.05]:[.7,1.35]},Do=_e.scatterPoints({...Lo,rng:Bo.fork("pts")});await a.yield(),await Z0(Do,1);const Ha=_e.makeScatter({...Lo,rng:Bo,points:Do,material:Lt,sink:.02,tilt:.12,chunks:8,cullDistance:115,variants:Ba});await a.yield();const Ho=b.fork("shrubs"),To=_e.bushGeometry({rng:Dt,detail:0,size:1.5,leaf:"#6a1c22",leafLight:"#a83a30",leafDark:"#2c0c10"});await a.yield();const No=_e.bushGeometry({rng:Dt,detail:0,size:1.9,leaf:"#d8c860",leafLight:"#f4ea98",leafDark:"#7a6a28"});await a.yield();const Ro={path:X,heightAt:xe,count:Math.round(110*D),radius:25,corridor:7.5,clear:0,falloff:.5,uRange:[.14,.85],density:j0,scale:[.9,1.6],spacing:2.2},qo=_e.scatterPoints({...Ro,rng:Ho.fork("pts")});await a.yield(),await Z0(qo,1.7);const Ta=_e.makeScatter({...Ro,rng:Ho,points:qo,material:Lt,sink:.03,chunks:6,cullDistance:125,variants:[To,No]});await a.yield();const Go={path:X,heightAt:xe,wind:go,map:Lt.map,width:[.8,1.5],height:[.35,.8],flowers:0,root:Ye?"#565e50":"#5c4c26",tip:Ye?"#b2bcb4":"#c2a456",dry:Ye?"#9a9a84":"#d6bc6a",dryAmount:.4,tint:.2},O0=await _e.makeGrassAsync({...Go,rng:b.fork("sedge"),count:Math.round(6500*D*H),radius:24,bias:.9,uRange:[.13,.86],chunks:6,fade:[60,95],density:(e,t)=>j0(e,t)*T(-.5,.2,P.n2(e*.11+3,t*.11)),materialOptions:{ambient:Ye?1.3:1.6,leafAmbient:Ye?1.3:1.6}},a.yield);l0(O0.material,G,"flora"),await a.yield();const Na=(e,t)=>e>-95&&e<6&&t<ke(e)-16?j0(e,t):0,Io=await _e.makeGrassAsync({...Go,rng:b.fork("sedge2"),material:O0.material,count:Math.round(2600*D*H),radius:52,bias:.4,uRange:[.7,.86],chunks:2,fade:[60,95],density:(e,t)=>Na(e,t)*T(-.6,.1,P.n2(e*.11+3,t*.11))},a.yield);await a.yield();const Eo=b.fork("ferns2"),Ko={path:X,heightAt:xe,count:Math.round(150*D),radius:52,corridor:16,clear:0,falloff:.1,uRange:[.7,.86],density:Na,scale:[.8,1.5]},_o=_e.scatterPoints({...Ko,rng:Eo.fork("pts")});await Z0(_o,1);const jo=_e.makeScatter({...Ko,rng:Eo,points:_o,material:Lt,sink:.02,tilt:.12,chunks:2,cullDistance:130,variants:Ba});await a.yield();const Vo=b.fork("shrubs2"),Uo={path:X,heightAt:xe,count:Math.round(34*D),radius:52,corridor:16,clear:0,falloff:.1,uRange:[.7,.86],density:Na,scale:[.9,1.6],spacing:2.4},Zo=_e.scatterPoints({...Uo,rng:Vo.fork("pts")});await Z0(Zo,1.7);const Oo=_e.makeScatter({...Uo,rng:Vo,points:Zo,material:Lt,sink:.03,chunks:2,cullDistance:140,variants:[To,No]});for(let e=0;e<La.length;e+=20)dt.addContact(La.slice(e,e+20),{radius:1,reach:2.4,strength:.55}),await a.yield();L.add(Io.object,jo.object,Oo.object),await a.yield(),L.add(Ha.object,Ta.object,O0.object);for(const e of[...Ha.meshes,...Ta.meshes])fa.push(ma(e));await a.yield();const n0=xt.makeFauna(L,{light:xt.lightFrom(L,{sunIntensity:x.sunI*x.faunaSun})}),yt={jays:{count:7,size:.95,lead:6,pal:{body:"#2a62d0",belly:"#d5dbe4",wingC:"#2f6ae0",tip:"#10141e",head:"#3a70dc",tailC:"#2858c0",trail:"#2048a4",beak:"#14171c"},paint:{bar:!0,tailTip:!0,necklace:!0,crest:!0}},robins:{count:11,size:.76,lead:6.2,pal:{body:"#4c4238",belly:"#cc521c",wingC:"#3e362e",tip:"#1c1814",head:"#2a2420",tailC:"#342c26",trail:"#5a5046",beak:"#d8a020"},paint:{}},ravens:{count:2,size:1.7,lead:8.5,pal:{body:"#0d0e12",belly:"#121318",wingC:"#0b0c10",tip:"#050506",head:"#0d0e12",tailC:"#0b0c10",trail:"#16171c",beak:"#08080a"}}}[oe],Ot=yt.paint?An(yt.pal,yt.paint):null;await a.yield();const Xo=e=>{if(!Ot)return e;const t=e.geometry;t.setIndex(Ot.geometry.index);for(const o of Object.keys(Ot.geometry.attributes))t.setAttribute(o,Ot.geometry.attributes[o]);return e.uniforms.uWing.value.x=Ot.preset.span,e.uniforms.uWing.value.z=.55,e.uniforms.uWing.value.w=Ot.preset.len*.07,e},Qo=(e,t,o)=>{const r=e&&e.geometry&&e.geometry.attributes,s=e&&e.uniforms,g=e&&e.count,i=!!(r&&s&&g>0&&e.object&&e.route&&typeof e.route.pointAt=="function"&&e.route.length>0&&(!o||e.bounds&&e.bounds.radius>0)&&r.iA&&r.iB&&r.aAnim&&r.position&&r.iA.array&&r.iB.array&&r.iA.array.length===g*4&&r.iB.array.length===g*4&&s.uWander&&s.uFlap&&s.uWing&&s.uNear&&s.uScale);return i||(console.warn("maple-gale: the "+t+" flock is left out (a name this world reads of the kit's flock is absent, or an array is not of the count's length)"),e&&e.object&&e.object.parent&&e.object.parent.remove(e.object)),i},bt=n0.add(Xo(xt.makeFlock({rng:b.fork("escort"),species:"crows",count:yt.count,size:yt.size,...yt.pal,glide:.1,flap:oe==="ravens"?2.6:5.2,along:{path:X,side:oe==="ravens"?-2.4:1.3,up:oe==="ravens"?-.8:-.3,lead:yt.lead,from:.17,to:oe==="ravens"?.41:.47,drift:.4},spread:oe==="ravens"?[2.4,1,3]:oe==="jays"?[1.5,1,1.6]:[1.9,1.2,1.9],wander:[.4,.3,.4,.7]})));if(Qo(bt,"escort",!0)){const e=bt.geometry.attributes,t=e.iA.array,o=e.iB.array,r=bt.uniforms,s=r.uWander.value,g=r.uFlap.value.y,i=bt.count,c=bt.route.length,f=B(),h=B(),d=.17,y=oe==="ravens"?.41:.47,F=.4,w=yt.lead;let n=0,m=0,v=0,k=0,z=!1;for(let I=0;I<e.position.count;I++){const ve=e.aAnim.getY(I),Fe=Math.abs(ve)>.5?e.aAnim.getX(I):0;n=Math.max(n,Math.hypot(e.position.getX(I)-ve*Fe,e.position.getY(I),e.position.getZ(I))+Fe*(1+Math.hypot(.22,.25)*g)+r.uWing.value.w*g+.06*r.uWing.value.x*e.aAnim.getW(I))}const p=.05,S=1.5*s.x,A=s.y,C=s.z,M=Math.hypot(S,A,C),E=(c/((y-d)*ie)+1)*p/2,K=[],ae=[],J=[];for(let I=0;I<i;I++)ae.push(n*o[I*4]*r.uScale.value),K.push(Math.max(r.uNear.value.y,2+ae[I])+p),J.push(t[I*4+2]),m=Math.max(m,K[I]),v=Math.max(v,Math.hypot(t[I*4],t[I*4+1],o[I*4+3])),k=Math.max(k,t[I*4+2]);const re=Math.ceil(c/p),Z=new Float64Array((re+1)*3),me=v+M+m;for(let I=0;I<=re;I++)bt.route.pointAt(I*p,f),Z[I*3]=f.x,Z[I*3+1]=f.y,Z[I*3+2]=f.z;await a.yield();const le=I=>{for(let ve=0;ve<512&&I*p<=ie;ve++,I++){const Fe=(I*p/ie-d)/(y-d)*c+w-F-E;let Ne=-1/0,qe=1/0;for(let Ze=0;Ze<i;Ze++)Ne=Math.max(Ne,J[Ze]);const Xe=Math.max(0,Math.ceil((Fe-Ne)/p));if(Xe>re)return-1;X.posAtDist(I*p,f);for(let Ze=re;Ze>=Xe;Ze--){const ut=f.x-Z[Ze*3],lt=f.y-Z[Ze*3+1],r0=f.z-Z[Ze*3+2],Ga=Math.sqrt(ut*ut+lt*lt+r0*r0)-me;if(Ga>0){qe=Math.min(qe,Ga/2),Ze-=Math.floor(Ga/(2*p));continue}qe=0;const ss=Fe-Ze*p;for(let Ft=0;Ft<i;Ft++){if(ss>=J[Ft])continue;const ns=Math.max(Math.abs(ut-t[Ft*4])-S,0),rs=Math.max(Math.abs(lt-t[Ft*4+1])-A,0),is=Math.max(Math.abs(r0-o[Ft*4+3])-C,0);ns*ns+rs*rs+is*is<K[Ft]*K[Ft]&&(J[Ft]=ss)}}qe>0&&qe<1/0&&(I+=Math.floor(qe/p))}return I*p<=ie?I:-1};for(let I=le(0);I>=0;I=le(I))await a.yield();const we=(I,ve)=>{let Fe=1/0;for(let Ne=0;Ne<i;Ne++)if(Ne!==I)for(let qe=0;qe<=c;qe++)bt.route.pointAt(qe,f),bt.route.pointAt(qe+ve-t[Ne*4+2],h),Fe=Math.min(Fe,Math.hypot(f.x+t[I*4]-h.x-t[Ne*4],f.y+t[I*4+1]-h.y-t[Ne*4+1],f.z+o[I*4+3]-h.z-o[Ne*4+3]));return Fe},We=[];for(let I=0;I<i;I++){if(!(J[I]<t[I*4+2]))continue;const ve=bt.bounds.radius-k/2-Math.hypot(t[I*4],t[I*4+1],o[I*4+3])-M-ae[I];await a.yield();let Fe=J[I];for(let Ne=0;Fe>-ve&&we(I,Fe)<.41;Fe-=.01)(++Ne&3)===0&&await a.yield();Fe<=-ve&&(Fe=-ve,We.push([I,t[I*4+2],J[I],Fe])),t[I*4+2]=Fe,z=!0}z&&(e.iA.needsUpdate=!0),We.length&&(bt.object.userData.held=We)}await a.yield();const Ct=n0.add(Xo(xt.makeFlock({rng:b.fork("crossing"),species:"crows",count:oe==="ravens"?5:14,size:yt.size*(Ot?1.6:1.15),...yt.pal,glide:.2,cross:{path:X,u:.02,lead:44,angle:44,side:-1,height:0,span:230,window:.14,rise:-3},spread:[15,3,24],wander:[4,1,4,.4]})));if(Qo(Ct,"crossing")){const e=Ct.geometry.attributes,t=e.iA.array,o=e.iB.array,r=Ct.uniforms,s=r.uWander.value,g=r.uFlap.value.y,i=B();let c=0,f=0,h=0,d=0;for(let z=0;z<e.position.count;z++){const p=e.aAnim.getY(z),S=Math.abs(p)>.5?e.aAnim.getX(z):0;c=Math.max(c,Math.hypot(e.position.getX(z)-p*S,e.position.getY(z),e.position.getZ(z))+S*(1+Math.hypot(.22,.25)*g)+r.uWing.value.w*g+.06*r.uWing.value.x*e.aAnim.getW(z))}const y=[],F=1,w=1.5*s.x+F,n=s.z+F;for(let z=0;z<Ct.count;z++)y.push(Math.max(r.uNear.value.y,2+c*o[z*4]*r.uScale.value)),f=Math.max(f,y[z]),h=Math.max(h,Math.abs(t[z*4]),Math.abs(o[z*4+3]));const m=[],v=[],k=h+Math.max(w,n)+f;for(let z=0;z<=ie;z+=F)X.posAtDist(z,i),m.push(i.x,i.y,i.z);for(let z=0;z<=Ct.route.length;z+=F)Ct.route.pointAt(z,i),v.push(i.x,i.y,i.z);for(let z=0;z<v.length;z+=3)for(let p=0;p<m.length;p+=3){const S=m[p]-v[z],A=m[p+2]-v[z+2],C=Math.max(Math.abs(S),Math.abs(A))-k;if(C>=0){p+=3*Math.floor(C/(2*F));continue}const M=Math.max(m[p+1],m[Math.max(p-2,1)],m[Math.min(p+4,m.length-2)]),E=Math.min(v[z+1],v[Math.max(z-2,1)],v[Math.min(z+4,v.length-2)]);for(let K=0;K<Ct.count;K++){const ae=M-E+s.y-t[K*4+1];if(ae+y[K]<=d)continue;const J=Math.max(Math.abs(S-t[K*4])-w,0),re=Math.max(Math.abs(A-o[K*4+3])-n,0),Z=y[K]*y[K]-J*J-re*re;Z>0&&(d=Math.max(d,ae+Math.sqrt(Z)))}}Ct.object.position.y=d,Ct.object.updateMatrixWorld()}await a.yield();const Js=xt.lightFrom(L,{sunIntensity:x.sunI*x.faunaSun*(x.gorge[2]>.5?.3:.55),skyIntensity:x.hemiI*(it?1:.55),groundIntensity:x.hemiI*(it?.6:.4)});let X0,Ra=null,Q0=0,en=null;const $o=[];if(fe==="deer"){const e=aa*ie+19,t=X.posAtDist(e,B()),o=pe-t.z,r=Math.tan(3*Math.PI/180);let s=0;for(let c=-62;c<=62;c+=1){const f=t.x+c;f>St-8&&f<Wt+8&&(s=Math.max(s,na(f)+2-c*r))}const g=n0.add(xt.makeHerd({rng:b.fork("deer"),species:"deer",count:3,size:1.45,sizes:[1.12,.94,.9],varieties:.34,coat:"#352a22",belly:"#5e5448",legs:"#2a221b",sock:"#231c17",accent:"#f2eee4",horn:"#cfc4a8",pattern:"none",tints:["#ffffff","#e8e0d8"],rim:.12,mode:"migrate",gait:"run",heightAt:xe,cross:{path:X,u:aa,lead:19,angle:3,side:-1,offset:-(s-o),span:124,window:.13,bow:0,height:0},spread:[1,11]}),{light:Js});{const c=g.material,f="vec3 lit = hemi + uSunColor * dif * cau;";c&&c.isShaderMaterial&&c.fragmentShader.includes(f)&&(Object.assign(c.uniforms,{uMgPatch:G.uPatch,uMgPatch2:G.uPatch2,tMgShade:G.tShade,uMgShBox:G.uShBox,uMgShSun:G.uShSun,uMgShK:G.uShK}),c.fragmentShader=c.fragmentShader.replace(f,"vec3 lit = hemi + uSunColor * dif * cau * mgSunShade(1.0, vWorld, 28.0);").replace("void main",Mt+i0+`
void main`),c.needsUpdate=!0)}const i=B();X0=(c,f)=>(g.positionAt(c,f,i),i.y+=1.1,i),Q0=3.6}else{const e=.54*ie+7,t=X.posAtDist(e,B()),o=X.tangentAtDist(e,B());o.y=0,o.normalize();const r=m=>Pe(m)+.28+V,s=_==="golden"||_==="dawn",g={slate:3,golden:2.5,squall:1.5,dawn:2}[_],i=x.gorge[2]>.5?.3:.6,c=s?l(x.sun).multiplyScalar(.5):l(x.hemiSky).multiplyScalar(.55*x.hemiI),f=(m,v=1)=>{const k=l(m);return[k.r*v,k.g*v,k.b*v]},h=[],d=(m,v,k,z,p,S)=>{const A=t.x+o.x*z,C=-(na(A)+k-(pe-t.z)),M=A-o.z*C,E=t.z+o.z*z+o.x*C,K=Math.cos(p),ae=Math.sin(p),J=o.x*K-o.z*ae,re=o.z*K+o.x*ae,Z=We=>Math.max(xe(M+J*We*S,E+re*We*S),r(M+J*We*S)-.16),me=Z(.85),le=Z(-.93),we=new u.Mesh(m,v);we.position.set(M,le+(me-le)*.93/1.78,E),we.rotation.set(0,Math.atan2(-re,J),Math.atan2(me-le,1.78*S)),we.scale.setScalar(S),L.add(we),$o.push(we),h.push([M,xe(M,E)+.05,E,Math.atan2(re,J),1.55*S,.78*S,0,0]);for(const[We,I]of m.userData.feet){const ve=M+(J*We-re*I)*S,Fe=E+(re*We+J*I)*S;xe(ve,Fe)<r(ve)-.03&&h.push([ve,r(ve)+.03,Fe,0,.62,.62,1,h.length*.37])}return we},y=gs(G,{seed:.3,sun:i,amb:g,rim:1,rimC:c}),F=gs(G,{seed:.8,sun:i,amb:g*1.08,rim:.9,rimC:c}),w=d(ds({coat:f("#6b5444"),dark:f("#35271f"),pale:f("#a89a8a"),sock:f("#b8ab9a")}),y,-.3,0,.38,1.2);await a.yield(),d(ds({calf:!0,coat:f("#7c5a44"),dark:f("#42301f"),pale:f("#b09880"),sock:f("#b8a690")}),F,4.3,-2.2,2.5,.8),await a.yield();{const m=new u.InstancedBufferGeometry,v=new u.PlaneGeometry(2,2,1,1).rotateX(-Math.PI/2);m.index=v.index,m.setAttribute("position",v.getAttribute("position"));const k=new Float32Array(h.length*4),z=new Float32Array(h.length*4);h.forEach((S,A)=>{k.set(S.slice(0,4),A*4),z.set(S.slice(4),A*4)}),m.setAttribute("iP",new u.InstancedBufferAttribute(k,4)),m.setAttribute("iQ",new u.InstancedBufferAttribute(z,4)),m.instanceCount=h.length;const p=new u.Mesh(m,Cn(G));p.frustumCulled=!1,p.renderOrder=4,L.add(p),$o.push(p)}const n=B(w.position.x-o.x*.2-o.z*-1.6,w.position.y+1.5,w.position.z-o.z*.2+o.x*-1.6);X0=()=>n,Ra=(m,v)=>{y.uniforms.uPose.value.x=$(.92,-.06,T(.475,.515,v))+.04*Math.sin(m*.9)+(v<=0?.45*(Math.sin(m*.35)-1):0),F.uniforms.uPose.value.x=.05+.12*Math.sin(m*.7+1)},Q0=6.2}await a.yield(),n0.add(xt.makeFlock({rng:b.fork("heron"),species:"flamingos",form:"loose",count:1,size:1.75,body:"#7d90a8",belly:"#a8b4c0",wingC:"#6c80a0",trail:"#2a3442",tip:"#1c222b",head:"#e6eaec",neckC:"#b4b8b8",tailC:"#566880",beak:"#d8a030",legC:"#3a332c",flap:2.3,glide:.1,along:{path:X,side:-.9,up:-1.5,lead:7,from:.555,to:.695,drift:.3},spread:[.1,.1,.1],wander:[.4,.25,.3,.5]})),await a.yield(),n0.add(xt.makeFlock({rng:b.fork("ducks"),species:"geese",form:"loose",count:8,size:1.5,body:"#33261f",belly:"#cdbb94",wingC:"#27324a",head:"#173f2e",neckC:"#173f2e",tailC:"#1f1814",tip:"#e6e2d6",flap:6.5,glide:0,along:{path:X,side:f0.side,up:f0.up,lead:f0.lead,from:f0.from,to:f0.to,drift:.6},spread:[2.6,1,5.5],wander:[.3,.25,.4,.6]})),await a.yield();const qa=ft.makeHorizonRidges({rng:b.fork("ridges"),noise:{n2:(e,t)=>P.n2(e+211,t+97),fbm2:(e,t,o,r,s)=>P.fbm2(e+211,t+97,Math.min(o??2,2),r,s)},fog:L.fog,layers:3,radius:[1400,3200],height:[60,150],base:-90,segments:220,follow:0,jagged:.08,colorNear:"#4a3428",sunDir:Be,sunColor:x.sun,rim:.2});qa.object.position.set(-300,-90,pe),qa.object.updateMatrixWorld(!0),L.add(qa.object),await a.yield();let $0=null,Y0=null,J0=null;x.clouds&&($0=cn({rng:b.fork("scud"),sky:Ce,count:x.clouds.count,altitude:270,altitudeJitter:60,size:[260,520],height:.34,puffs:30,wind:[26,0,4.5],center:[150,0,0],extent:[3e3,2200],opacity:.72}),L.add($0.object),await a.yield()),x.snow&&(Y0=ea.makeParticles({rng:b.fork("snow"),preset:"snow",time:G.uTime,count:Math.round(3400*D),box:[64,40,64],velocity:[27,-3.4,2],velocityRandom:[6,1.6,3],turbulence:[.8,.4,.8],size:[.03,.075],opacity:.6}),L.add(Y0.object),await a.yield()),x.mist&&(J0=ea.makeMist({rng:b.fork("mist"),time:G.uTime,count:60,area:[540,6,44],center:[-285,0,pe],size:[14,30],color:"#e4e2f0",opacity:.15,drift:[1.6,0,.2],heightAt:e=>Pe(e)+1.2,lift:1.6}),L.add(J0.object),await a.yield());const Yo=ea.makeMist({rng:b.fork("fallmist"),time:G.uTime,count:x.mist?84:76,area:[x.mist?84:54,8,x.mist?60:30],center:[je.fallFoot.x+(x.mist?44:36),tt+6,pe+3],size:[5,12],color:_==="dawn"?"#f4dccf":_==="golden"?"#f2dcc0":"#dfe4ea",opacity:x.mist?.1:.12,drift:[2.4,0,.3]});L.add(Yo.object),await a.yield();const Jo=ea.makeMist({rng:W.fork("brookmist"),time:G.uTime,count:12,area:[7,5,7],center:[Ge,Pe(Ge)+3.4,pe+19+4.5*P.n2(Ge*.013+3,1.3)+5],size:[3,6.5],color:_==="dawn"?"#f4dccf":_==="golden"?"#f2dcc0":"#dfe4ea",opacity:.2,drift:[.8,0,-.3]});L.add(Jo.object),await a.yield();const Nt=new u.Group;Nt.position.copy(at),Nt.position.y-=.7,Nt.rotation.order="YXZ",Nt.rotation.y=Math.atan2(-Vt.x,-Vt.z),Nt.scale.setScalar(ye?1:.5);const tn=new u.Mesh(Mn(b.fork("snag")),kn(G));Nt.add(tn),L.add(Nt);const es=.578,ts=(Sa+9.5*.7)/ie+.004,x0=Sn(G);if(ye){const e=Math.round(520*$(.7,1,D)),t=W.fork("snagburst"),o=new Float32Array(e*4),r=new Float32Array(e*4),s=new Float32Array(e*3),g=new u.Color;for(let h=0;h<e;h++){const d=h<30?1:0,y=t.chance(.42),F=!y&&t.chance(.4),w=y?t.range(0,.1):F?t.range(.27,.44):Math.pow(t(),.8)*1.15,n=y?t.range(0,3.5):F?t.range(7,25):t.range(1,25),m=t();o.set([n,w,d?1:m>=.75?2:0,t()],h*4),r.set([t.range(-2,5),y?t.range(1,8):t.range(-1,4),t.range(-4,4),d?t.range(.9,1.9):m>=.75?t.range(.22,.4):.16+.34*Math.pow(t(),1.6)],h*4),d?g.set("#cdbfa6"):m<.55?g.set("#e6dcc6"):m<.75?g.set("#8a6a48"):g.copy(m<.9?Me:Le).multiplyScalar(.8),g.multiplyScalar(t.range(.75,1.05)),s.set([g.r,g.g,g.b],h*3)}const i=new u.InstancedBufferGeometry,c=new u.PlaneGeometry(2,2,1,1);i.index=c.index,i.setAttribute("position",c.getAttribute("position")),i.setAttribute("iA",new u.InstancedBufferAttribute(o,4)),i.setAttribute("iB",new u.InstancedBufferAttribute(r,4)),i.setAttribute("iCol",new u.InstancedBufferAttribute(s,3)),i.instanceCount=e,x0.uniforms.uFoot.value.copy(at),x0.uniforms.uFallDir.value.copy(Vt),x0.uniforms.uWindDir.value.copy(At);const f=new u.Mesh(i,x0);f.frustumCulled=!1,f.renderOrder=5,L.add(f),en=f}const M0=[{x:_t,z:jt,r:1.7,y0:-1e3,y1:1e3},{x:at.x,z:at.z,r:1.3,y0:-1e3,y1:1e3}];for(const e of gt)(e.inStream||e.pd<12)&&M0.push({x:e.x,z:e.z,r:e.r*1.15,y0:-1e3,y1:e.y+e.r*1.3,rib:!!e.rib});for(const e of et)M0.push({x:e.x,z:e.z,r:e.rib?1.45:1.05,y0:-1e3,y1:1e3,rib:!!e.rib});for(const e of ot)e.pd<30&&M0.push({x:e.x,z:e.z,r:e.rib?1.45:e.y+zt[e.v].h*e.s<X.nearestXZ(e.x,e.z).y-4?zt[e.v].r*e.s*.6:1.05,y0:-1e3,y1:e.y+zt[e.v].h*e.s,rib:!!e.rib});for(const e of o0)e.pd<30&&M0.push({x:e.x,z:e.z,r:Kt.r*e.s*.6,y0:-1e3,y1:e.y+Kt.h*e.s});if(he.setPath(X),he.setObstacles(M0),he.gust.setFloor(-3.5),await a.yield(),a.renderer&&Ce.prewarm)try{await Ce.prewarm(a.renderer,null,L)}catch{}const as=B(je.crownCentre.x,je.crownCentre.y,je.crownCentre.z),an=B(B0.x,tt+2,B0.z),k0=B(Ge,Pe(Ge)+8.5,pe+30),on=new u.Vector2,Ae=B(),os=_==="slate"?150:0,S0=B(),sn=_==="slate"?.46:x.patch[1];function nn(e,t,o,r){const s=r??0,g=s*ie;G.uTime.value=t,G.uShK.value.z=t;const i=a.renderer&&a.renderer.getDrawingBufferSize&&a.renderer.getDrawingBufferSize(on).y||1080;G.uPx.value=2/((o&&o.projectionMatrix.elements[5]||1.66)*i),X.posAtDist(Math.min(g+os+(os?6:20)*Math.sin(t*.31),ie),Ae),G.uPatch.value.x=Ae.x,G.uPatch.value.y=Ae.z+12*Math.sin(t*.23+1),he.setPatch(G.uPatch.value.x,G.uPatch.value.y,G.uPatch.value.z,sn,G.uPatch2.value.x,G.uPatch2.value.y,G.uPatch2.value.z),X.posAtDist(g,Ae),G.uWave.value.x=Ae.x+25+13*t;{const h=Math.min(g+he.frontLead,ie);X.posAtDist(h,Ae),X.tangentAtDist(h,S0);const d=Math.hypot(S0.x,S0.z)||1;G.uFront.value.set(Ae.x,Ae.z,S0.x/d,S0.z/d),G.uBurst.value.x=T(st,nt,Ae.x)}he.setProgress(s),he.setStrip((g-(b0-62))/21);const c=T(.85,.9,s);he.gust.setClear($(3.2*T(.3,.38,s),5.5,c)),he.gust.setLead($(25,12,c)),he.gust.setAhead($(.26,.16,c)),he.gust.setAmount($(.9,.24,T(.13,.27,s))+.76*T(.7,.8,s));{const h=T(.455,.48,s)*(1-T(.6,.64,s)),d=T(.3,.34,s)*(1-T(.44,.455,s));if(h>0&&o){const y=X0(t,s);Ae.setFromMatrixPosition(o.matrixWorld),he.setHold(0,y.x,y.z,Q0*h,y.y-5,y.y+6),he.setHold(1,$(Ae.x,y.x,.56),$(Ae.z,y.z,.56),Q0*.72*h*T(8,13,Math.hypot(y.x-Ae.x,y.z-Ae.z)),y.y-5,y.y+6)}else d>0&&o?(Ae.setFromMatrixPosition(o.matrixWorld),he.setHold(0,$(Ae.x,k0.x,.3),$(Ae.z,k0.z,.3),5.5*d,-1e3,1e3),he.setHold(1,$(Ae.x,k0.x,.62),$(Ae.z,k0.z,.62),8*d,-1e3,1e3)):(he.setHold(0,0,0,0),he.setHold(1,0,0,0))}if(G.uWakeAge.value=14*T(.86,1,s),o){Ae.setFromMatrixPosition(o.matrixWorld),Ys(Ae),ua&&(ua.visible=Ae.x>-330),Yt&&(Yt.visible=Ae.x>-230),Jt&&(Jt.visible=!0);for(let h=0;h<4;h++){const d=Ae.x>Et[h][0]-150&&Ae.x<Et[h][1]+70;for(const y of H0[h])y.visible=d;m0&&(m0[h].visible=d)}for(let h=0;h<2;h++){const d=Ae.x>Et[h*2][0]-150&&Ae.x<Et[h*2+1][1]+70;for(const y of ga[h])y.visible=d}{let h=-1,d=-1,y=-1,F=-1;for(let w=0;w<u0.length;w++){const n=u0[w],m=Ae.x<n.x0?n.x0-Ae.x:Ae.x>n.x1?Ae.x-n.x1:0,v=m>170;n.near.visible=!v,v&&(n.x1<Ae.x?(h<0&&(h=w),d=w):(y<0&&(y=w),F=w))}for(let w=0;w<2;w++){const n=w?y:h,m=w?F:d,v=eo[w];if(v.visible=n>=0,n>=0){const k=u0[n],z=u0[m],p=(k.x0+z.x1)/2;v.geometry.setDrawRange(k.f0,z.f1-k.f0),v.geometry.boundingSphere.center.set(p,Pe(p),ke(p)),v.geometry.boundingSphere.radius=(z.x1-k.x0)/2+60}}}}if(Ra&&Ra(t,s),he.update(e,t,o),Ce.update(e,t,o),ro.update(e,t,o),dt.update(e,t),q0.update(e,t,o),Wa.update(e,t,o),o){Ae.setFromMatrixPosition(o.matrixWorld);const h=Ae.x<Rt-8?(Ae.y-lo)/(Rt-Ae.x):1e3;for(const d of io)d.visible=!d0(d,Ae);for(const d of da){const y=d.userData.kt;let F=d.userData.kn|0;for(;F<y.length&&y[F]<h;)F++;for(;F>0&&y[F-1]>=h;)F--;d.userData.kn=F,d.count=F,F||(d.visible=!1)}}if(G0.update(e,t),I0.update(e,t),E0.update(e,t),K0.update(e,t),_0.update(e,t,o),Ha.update(e,t,o),Ta.update(e,t,o),O0.update(e,t,o),Io.update(e,t,o),jo.update(e,t,o),Oo.update(e,t,o),o)for(const h of fa)d0(h,Ae)&&(h.visible=!1);n0.update(e,t,o,s),$0&&$0.update(e,t,o),Y0&&Y0.update(e,t,o),J0&&J0.update(e,t,o),Yo.update(e,t,o),Jo.update(e,t,o);let f=.03*Math.sin(t*1.7)+.016*Math.sin(t*2.9);if(ye){const h=(s-es)/(ts-es),d=He(h,0,1),y=He((s-ts)/.035,0,1);f=f*(1-d)+.87*(1-Math.pow(1-d,2.2))+(h>0&&y<1?.012*Math.sin(t*9)*d*(1-y):0)+.7*y*y,x0.uniforms.uClock.value=s>0?h:-1}Nt.rotation.x=-f}return{scene:L,path:X,duration:40,title:x.title,pace:e=>.62+.68*T(.1,.26,e)-.2*T(.72,.8,e)-.48*T(.8,.86,e)+.33*T(.885,.93,e),camera:{fov:62,near:.3,far:4200,lookAhead:22,sway:1.5,bank:1.3},pois:[{at:as,from:0,to:.33,weight:.5},{at:k0,from:.3,to:.475,weight:.55},{at:X0,from:fe==="deer"?.44:.455,to:fe==="deer"?.6:.572,weight:.75},{at:as,from:fe==="deer"?.585:.556,to:.875,weight:.62},{at:an,from:.845,to:.975,weight:.55}],portal:{shape:"circle",radius:7,color:x.portal,glow:1,tilt:!0,revealDistance:240,blendDistance:40},post:{exposure:x.exposure,bloom:{strength:x.bloom,radius:.6,threshold:.92},grade:{saturation:x.sat,contrast:Y,tint:x.tint,shadowTint:x.shadow,vignette:.3,grain:.02,aberration:0}},ride:"none",update:nn,dispose(){Ce.dispose&&Ce.dispose(),he.dispose();for(const e of[...xo,...ba,...w0,...xa,Po])e.dispose()}}}};export{Hn as default};
