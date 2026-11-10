import*as I from"three";import{clamp as oe,lerp as $,smoothstep as Y}from"../kit/core.js";import{makeSky as He,makeLightRig as Ze}from"../kit/sky.js";import*as je from"../kit/terrain.js";import*as ne from"../kit/flora.js";import*as we from"../kit/fauna.js";import*as Ce from"../kit/fx.js";import*as Fe from"../kit/water.js";import{layoutSteps as Xe,makeEstateUniforms as Ee,makeBankMaterials as We,buildBank as Se,driveUniforms as Oe,lifeCourses as Ve,stoneRows as Ue,ESTATE_GLSL as ae,DRIVE_GLSL as _e,BANK_GLSL as Ae,PLACE as _,BEHIND as De,VERGE as Pe,TAU as U,lin as Ne,vaultTrunks as Qe,gapField as Ye}from"../parts/red-drive-down-to-the-sea.js";const he={wave:.052,bend:.5,bendWave:.05,about:[.55,.85],heads:.311},$e=(u,p)=>Math.sin((u-_.entry[0])*he.wave+he.bend*Math.sin(p*he.bendWave)),Ke=(u,p,D,e)=>{const r=p/Math.max(e.y,.25);return Y(he.about[0],he.about[1],Ye(u-e.x*r,D-e.z*r))},Je={morning:{preset:"day",elevation:42,azimuth:135,sun:"#fff1d8",sunI:3.4,sky:"#a9c8ea",gnd:"#5a6a3c",fillI:2.2,fog:"#b9cfe0",fogD:.0011,exposure:1.1,leafFill:"#a4bf8a",skyOpts:{zenith:"#1c58b8",horizon:"#a8cdea"}},gold:{preset:"goldenHour",elevation:18,azimuth:212,sun:"#ffc98a",sunI:4,sky:"#a9b6e0",gnd:"#6a5a3c",fillI:2.6,fog:"#e2c9a4",fogD:.0012,exposure:1.2,leafFill:"#bcb884",skyOpts:{sunIntensity:9,sunGlow:.55,scatter:.5}},haze:{preset:"day",elevation:30,azimuth:135,sun:"#fff6ea",sunI:2.5,sky:"#d0dce2",gnd:"#6a7250",fillI:2.6,fog:"#dfe6e6",fogD:.0022,exposure:1.1,leafFill:"#aec49a",skyOpts:{zenith:"#8fb0cc",mid:"#c2d4de",horizon:"#e4eaea",ground:"#c9d2d2",sunIntensity:7,sunGlow:1,sunGlowTight:.2,scatter:.5,scatterColor:"#fff6e6",clouds:{coverage:.3,softness:.6,opacity:.5},clouds2:{opacity:.5}}}};var Rt={id:"red-drive-down-to-the-sea",name:"The Red Drive Down to the Sea",category:"books",placeKind:"domestic",book:"Rebecca",author:"Daphne du Maurier, 1907 to 1989",media:["air"],weirdness:.25,async build(u){const p=new I.Scene,D=u.core,e=u.vary||{},r=oe(u.quality&&u.quality.detail||1,.4,1),w=q=>D.makeRng(D.hashSeed(q+":"+u.seed)),L={};for(const q of["hour","sky","bank-left","bank-right","outliers","glades","vault-places","vault-forms","vault-depth","fronds","crowns","forest","ferns","house","cedar-places","cedar-shapes","roses","azaleas","birches","stream","falling","pigeons","rooks","swallows","gulls","bees","butterflies","wagtails","petals","leaves","smoke","shafts","far","border","casements","cloud-shade","azaleas-head","birches-head","thin-left","thin-right","thin-outliers","thin-azaleas","thin-head","rock-shapes","row-stones","bank-stones","stream-ferns","flank-rocks","crags","ring-rocks","sea","gulls-left","gulls-right","fallen-heads","birches-again","pools","shingle-stones","flower-border","floor-ferns"])L[q]=w(q);const P=e.hour==="day"?"morning":e.hour==="golden"||e.hour==="night"?"gold":e.hour==="dawn"?"haze":(()=>{const q=L.hour();return q<.45?"morning":q<.75?"gold":"haze"})(),f=Je[P],z=e.hour==="night",W=!!e.rare,b=oe(e.density??1,.7,1.3),S=e.mood??.5,l=$(.6,1.4,S),o=$(.25,.75,S),a=$(.6,1.2,S),n=["white","gold","salmon"][Math.floor(S*2.999)];await u.yield();const h=Xe(u.seed);let s=h.next();for(;!s.done;)await u.yield(),s=h.next();const g=s.value,t=g.path,m=g.places,k=t.length;await u.yield();const A=z?10:f.elevation,d=He({rng:L.sky,preset:f.preset,sunElevation:A,sunAzimuth:f.azimuth,lightColor:z?"#ffb884":f.sun,lightIntensity:f.sunI,ambientColor:f.sky,groundLight:f.gnd,ambientIntensity:f.fillI,lightElevationMin:8,clouds:{coverage:$(.28,.5,o),softness:.3},...f.skyOpts});p.add(d.object);const x=Ze(d,{intensity:1,ambient:1,bounce:.2});p.add(x.object);const M=new I.Color(f.fog);p.fog=new I.FogExp2(M,f.fogD);const F=d.lightDirection.clone().normalize(),B=new I.Color(z?"#ffb884":f.sun).multiplyScalar(f.sunI),y=new I.Color(f.sky).multiplyScalar(f.fillI),c=new I.Color(f.gnd).multiplyScalar(f.fillI),i=new I.Color(f.leafFill).multiplyScalar(f.fillI*1.9),v=[.924,-.383],C=[-560,-260,600,320],N=Ee({sunDir:[F.x,F.y,F.z],sunColor:[B.r,B.g,B.b],skyColor:[y.r,y.g,y.b],groundColor:[c.r,c.g,c.b],fogColor:[M.r,M.g,M.b],fogDensity:f.fogD,leafFill:[i.r,i.g,i.b],cloud:[P==="haze"?.3:$(.5,.72,o),90,1],wind:[v[0],v[1],l,1],placeBox:[C[0],C[1],1/(C[2]-C[0]),1/(C[3]-C[1])],place:null,canopy:[43,50],cloudOffset:[L["cloud-shade"].range(0,2e3),L["cloud-shade"].range(0,2e3)]});return await u.yield(),ot({ctx:u,scene:p,R:L,fork:w,Lo:g,path:t,M:m,PL:k,HR:f,heavy:W,density:b,detail:r,windK:l,swellK:a,lead:n,sky:d,rig:x,sunDir:F,U:N,BOX:C})}};function et(u,p,D){const e=p*D,r=new Float32Array(e),w=new Float32Array(e).fill(-50),L=new Float32Array(e),P=new Float32Array(e),f=new Uint8Array(e),z=(u[2]-u[0])/p,W=(u[3]-u[1])/D,b=o=>Math.floor((o-u[0])/z),S=o=>Math.floor((o-u[1])/W),l=(o,a,n,h)=>{for(let s=Math.max(0,S(a-n));s<=Math.min(D-1,S(a+n));s++)for(let g=Math.max(0,b(o-n));g<=Math.min(p-1,b(o+n));g++)h(s*p+g,Math.hypot(u[0]+(g+.5)*z-o,u[1]+(s+.5)*W-a))};return{W:p,H:D,cw:z,ch:W,cover:r,occ:w,red:L,pale:P,live:f,centre:o=>[u[0]+(o%p+.5)*z,u[1]+(Math.floor(o/p)+.5)*W],raise(o,a,n,h=0){if(h>0)l(o,a,h,(s,g)=>{g<=h&&n>w[s]&&(w[s]=n)});else{const s=b(o),g=S(a);s>=0&&g>=0&&s<p&&g<D&&n>w[g*p+s]&&(w[g*p+s]=n)}},dome(o,a,n,h,s){l(o,a,n,(g,t)=>{if(t<=n){const m=s+(h-s)*Math.sqrt(1-(t/n)**2);m>w[g]&&(w[g]=m)}})},disc(o,a,n,h,s,g,t){l(a,n,s,(m,k)=>{const A=1-Y(h,s,k);t?o[m]=Math.min(o[m],$(1,g,A)):o[m]=Math.max(o[m],g*A)})},cells:e,bake(o,a,n,h){const s=Math.hypot(o.x,o.z)||1e-6,g=o.x/s,t=o.z/s,m=o.y/s,k=z,A=Math.min(30,Math.ceil(27/Math.max(m,.05)/k)),d=a.image.data;for(let x=n;x<Math.min(h,e);x++){let M=-10;if(f[x]){const F=x%p,B=Math.floor(x/p);for(let y=2;y<=A;y++){const c=Math.round(F+g*y),i=Math.round(B+t*y);if(c<0||i<0||c>=p||i>=D)break;const v=w[i*p+c]-y*k*m;v>M&&(M=v)}}d[x*4]=Math.round(oe(r[x],0,1)*255),d[x*4+1]=Math.round(oe((M+10)/80,0,1)*255),d[x*4+2]=Math.round(oe(L[x],0,1)*255),d[x*4+3]=Math.round(oe(P[x],0,1)*255)}a.needsUpdate=!0}}}function tt(u,p){const D=(w,L=1)=>({value:new I.Vector3(...Ne(w)).multiplyScalar(L)}),e={...u,...Oe(),uLitterA:D("#46382a"),uLitterB:D("#7c6040"),uMoss:D("#3c6628"),uLawnA:D("#48773a"),uLawnB:D("#6f9a44"),uEarth:D("#6a5c46"),uShingle:D("#e6e2d6",.84),uRock:D("#8e867a"),uPetalCol:D("#f3ead6",.9),uStripe:{value:new I.Vector3(p.stripe[0],p.stripe[1],Math.PI/2)},uPetal:{value:p.petals},uRedAll:{value:p.heavy?1:0},uPools:{value:p.pools.map(w=>new I.Vector4(w.x,w.z,w.r,w.turn))},tShade:{value:p.shade.tex},uShadeBox:{value:new I.Vector4(...p.shade.box)}},r=new I.ShaderMaterial({uniforms:e,fog:!1,vertexColors:!0,defines:{RING_R:_.ringRadius.toFixed(1)},vertexShader:`
      attribute vec4 aPlace; attribute vec2 aShade, aHeath, aSide;
      varying vec3 vW, vN, vZone; varying vec4 vPl; varying float vAo; varying vec2 vHeath, vSide;
      void main(){
        vec4 wp = modelMatrix * vec4(position, 1.);
        vW = wp.xyz; vN = normal; vZone = color; vPl = aPlace; vAo = aShade.y; vHeath = aHeath; vSide = aSide;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:ae+Ae+_e+`
      uniform vec3 uLitterA, uLitterB, uMoss, uLawnA, uLawnB, uEarth, uShingle, uRock, uPetalCol, uStripe; uniform float uPetal, uRedAll;
      uniform vec4 uPools[2], uShadeBox; uniform sampler2D tShade;
      varying vec3 vW, vN, vZone; varying vec4 vPl; varying float vAo; varying vec2 vHeath, vSide;
      void main(){
        vec2 p = vW.xz; vec4 pl = esPlace(vW); vec3 n = normalize(vN);
        // (the vault's measure: 1 under the drive's great beeches, 0 everywhere else; see the light's law)
        float vlt = esVault(pl);
        float lawn = vZone.r, val = vZone.g, shin = vZone.b, wood = clamp(1. - lawn - val - shin, 0., 1.);
        float near = 1. - smoothstep(30., 90., length(vW - cameraPosition));
        float fine = esN(p * 6.) * .6 + esN(p * 21.) * .4, mossy = esF(p * .23);
        // the wood's floor: last year's copper leaves, moss in patches
        vec4 lf = esCell(p / .19);
        vec3 floorC = mix(uLitterA, uLitterB, mix(.5, lf.z * smoothstep(.0, .1, lf.w), near)) * (.8 + .4 * fine);
        // moss in cushions, stippled; close to, its edge is ragged (it stops at a leaf's edge), never a soft smear
        floorC = mix(floorC, uMoss * (.55 + .5 * esN(p * 27.)) * (.8 + .4 * fine), mix(smoothstep(.5, .68, mossy + (fine - .5) * .2), step(.6, mossy + (lf.z - .5) * .22), near));
        // under the vault last year's leaves lie in copper drifts some metres across, leaf by leaf close to. Far off
        // the drifts keep the weight they have close to: the mean of the near weight over the leaves' own pattern,
        // 0.783 (.25 + .6 times the mean of the seam term, 0.888, counted over six million places of the cells by a
        // mirror of esCell in node): the grain goes with the distance, the tone does not
        floorC = mix(floorC, vec3(.3, .14, .055) * (.78 + .4 * lf.z) * (.85 + .3 * fine), vlt * smoothstep(.42, .62, esF(p * .13 + 9.)) * mix(.783, .25 + .6 * smoothstep(0., .1, lf.w), near));
        // WHERE THE LIGHT LANDS, under the vault (every term carries the vault's measure: elsewhere the floor is what
        // it was). about: 1 in a pool of light, thinning to nothing round it (the roof's standing gaps at the foot of
        // the sun's ray: the dapple's own field, so the pool, the shaft over it and what grows in it are one law);
        // stretch: the three kinds of floor along the drive (see FLOOR); the flowers and the ferny moss keep off the drive and its verge (clearD), the mast lies on to the verge as the leaves do
        if (vlt > 0.) {
          float gapF = esGap(p - uSunDir.xz * (vW.y / max(uSunDir.y, .25))), about = smoothstep(${he.about[0]}, ${he.about[1]}, gapF) * vlt;
          float stretch = sin((p.x - ${_.entry[0].toFixed(1)}) * ${he.wave} + ${he.bend} * sin(p.y * ${he.bendWave})), ferny = smoothstep(.25, .55, stretch), flowery = smoothstep(.25, .55, -stretch);
          float clearD = smoothstep(vPl.y + 2.6, vPl.y + 3.8, mix(vPl.x, abs(vSide.x), step(.999, vSide.y)));
          // low woodland flowers in drifts in and about the pools (in the flowers' stretch the drifts run on further
          // round each pool; few on the ferny bank): white, yellow or blue-violet, each drift of one kind over its
          // own green; a head to a cell close to (three cells in four), the drift's mean colour far off (the heads'
          // counted share, so the tone holds)
          float wide = smoothstep(.38, .7, gapF) * vlt * flowery;
          float dens = max(about * (.3 + .7 * flowery) * (1. - .8 * ferny), wide) * (.35 + .65 * smoothstep(.25, .55, esF(p * .31 + 61.))) * clearD, sort = esN(p * .09 + 23.);
          vec3 headC = mix(mix(vec3(.9, .9, .8), vec3(.92, .66, .1), smoothstep(.38, .46, sort)), vec3(.2, .13, .85), smoothstep(.6, .68, sort));
          vec4 fc = esCell(p / .17 + 41.);
          floorC = mix(floorC, mix(vec3(.09, .22, .06) * (.8 + .4 * fine), headC, mix(${he.heads}, step(.25, fc.z) * (1. - smoothstep(.28, .46, length(fc.xy))), near)), dens);
          // the ferny bank: the litter lies green with moss between the clumps
          floorC = mix(floorC, uMoss * (.6 + .5 * esN(p * 27.)) * (.8 + .4 * fine), ferny * vlt * clearD * .45 * smoothstep(.3, .6, esF(p * .4 + 17.)));
          // the bare stretches: beech mast among the leaves, one leaf's place in eight a dark husk (far off, their
          // mean: .12 of the places times the seam term's mean, 0.888)
          floorC = mix(floorC, vec3(.07, .045, .03), (1. - ferny) * (1. - flowery) * vlt * .8 * mix(.12 * .888, step(.88, fract(lf.z * 9.)) * smoothstep(0., .1, lf.w), near));
        }
        // the lawn: fine sward, paler and darker in soft drifts, a faint change of tone every 2 m where the mower went,
        // moss in the damp places, daisies in drifts (each a white head with a yellow eye; far off, their drift's pale haze)
        float stripe = sin(dot(p, uStripe.xy) * uStripe.z);
        vec3 lawnC = mix(uLawnA, uLawnB, .5 + .05 * stripe + .7 * (esF(p * .05 + 7.) - .5)) * (.88 + .24 * fine) * (.93 + .14 * esN(p * .3 + 5.));
        lawnC = mix(lawnC, uMoss * 1.25 * (.8 + .4 * fine), smoothstep(.56, .74, esF(p * .13 + 31.)) * .5);
        // the sward is no one green: clover in darker rounds one to three metres across, paler sun-dried patches between
        float clover = smoothstep(.58, .7, esN(p * .47 + 17.) * .7 + esN(p * 1.3 + 2.) * .3);
        lawnC = mix(lawnC, lawnC * vec3(.62, .8, .66), clover * .75);
        lawnC *= mix(1.1, .9, smoothstep(.35, .65, esF(p * .21 + 3.7)));
        float drift = smoothstep(.4, .62, esF(p * .1 + 13.));
        vec4 dz = esCell(p / .22);
        float dr = length(dz.xy), isDaisy = step(1. - .3 * drift, dz.z), nearD = 1. - smoothstep(14., 46., length(vW - cameraPosition));
        vec3 daisyC = mix(vec3(.96, .8, .2), vec3(.95, .95, .9), smoothstep(.07, .12, dr));
        lawnC = mix(lawnC, mix(vec3(.9, .9, .82), daisyC, nearD), mix(.035 * drift, isDaisy * (1. - smoothstep(.2, .27, dr)), nearD));
        // the flower borders' beds (the garden's map, b): dark dug earth, a crisp edge to the turf
        vec3 gard = texture2D(tShade, (p - uShadeBox.xy) * uShadeBox.zw).rgb;
        lawnC = mix(lawnC, uEarth * (.42 + .3 * fine), smoothstep(.4, .55, gard.b + (fine - .5) * .1));
        // the valley's floor: earth and grass, a trodden path beside the stream, pale petals lying
        vec3 valC = mix(uEarth * (.8 + .4 * fine), esGrass(p) * .85, smoothstep(.16, .42, esF(p * .4 + 3.)));
        float onPath = (1. - smoothstep(.3, .7, abs(vPl.z + 3.4) + (esN(p * 1.7) - .5) * .5)) * smoothstep(14., 24., vPl.w);
        valC = mix(valC, uEarth * 1.5 * (.85 + .3 * fine), onPath * .8);
        // THE BROOK'S BANKS (bz: metres from the brook's middle, the line a little ragged; the water's edge lies 1.2 m
        // out, see makeBrook): the turf comes down green and lush to a lip over the water, dark earth in the lip's
        // shadow, and below it stones and gravel, each stone round (lit on its crown, dark in the chink about it), the
        // darker the nearer the water wets them. No band of bare rock: the bed is under the water
        float bz = abs(vPl.z) + (esN(p * 1.1 + 3.) - .5) * .3, brookIn = smoothstep(10., 16., vPl.w);
        vec4 bst = esCell(p / .21);
        vec3 stoneC = mix(mix(vec3(.14, .13, .115), vec3(.36, .33, .27), bst.z), vec3(.06, .06, .065), step(.86, bst.z)) * mix(.4, 1.05, smoothstep(0., .16, bst.w)) * (.8 + .4 * fine);
        valC = mix(valC, esGrass(p) * vec3(.74, .92, .62), (1. - smoothstep(1.8, 2.3, bz)) * brookIn * .75);
        valC = mix(valC, uEarth * .3 * (.7 + .6 * fine), (1. - smoothstep(1.56, 1.62, bz + (fine - .5) * .12)) * brookIn);
        valC = mix(valC, stoneC * mix(.6, 1., smoothstep(1.15, 1.42, bz)), (1. - smoothstep(1.42, 1.5, bz + (fine - .5) * .12)) * brookIn);
        valC = mix(valC, uPetalCol, esFallenAt(p + 31., clamp(pl.a * uPetal, 0., 1.)) * near + pl.a * uPetal * .22 * (1. - near));
        // THE SHINGLE, in world metres: pebbles (0.16 m) and cobbles (to half a metre) of unlike greys, buffs and whites,
        // each round (lit on its crown, dark in the chink about it), sorted by the sea into long ridges, coarser on the crests
        vec3 shC = vec3(0.); vec4 pc = vec4(0.); float wet = 0., foamOn = 0., poolIn = 0., strewn = 0.;
        if (shin > 0.) {
          pc = esCell(p / .16); vec4 pc2 = esCell(p / .62 + 3.);
          // (yb: the height over the tide, a little uneven along the shore, so that every line the sea leaves wanders)
          float yb = vW.y + (esN(p * .21) - .5) * .16 + (esN(p * .9 + 5.) - .5) * .05;
          // THE SEA SORTS ITS SHORE: cobbles thrown high (the storm beach, bleached and dry), pebbles below them, and
          // below the wrack firm damp sand, ribbed by the last tide, with runnels draining down it to the water
          float high = smoothstep(1.2, 2.8, yb), sand = 1. - smoothstep(.8, 1.08, yb + (esN(p * .37) - .5) * .22);
          float berm = esN(vec2(vPl.w * .33, dot(p, vec2(.03, .05)))), bermFine = esN(vec2(vPl.w * 1.3, dot(p, vec2(.09, .16))));
          float close = 1. - smoothstep(34., 100., length(vW - cameraPosition));
          vec3 tintP = mix(vec3(.62, .64, .68), vec3(1.02, .96, .84), pc.z);
          tintP = mix(tintP, vec3(.34, .36, .4), step(.86, pc.z));
          vec3 pebble = tintP * mix(.42, 1.06, smoothstep(.0, .16, pc.w)) * (.86 + .28 * esN(p * 2.3));
          float cr = length(pc2.xy) / mix(.22, .42, fract(pc2.z * 13.7)), isCob = step(.92 - .4 * berm - .4 * high, fract(pc2.z * 5.3));
          vec3 tintC = mix(vec3(.66, .67, .7), vec3(1.06, 1., .88), pc2.z);
          vec3 cobble = mix(tintC, vec3(.4, .4, .43), step(.84, pc2.z)) * mix(1.14, .62, smoothstep(.2, 1., cr));
          pebble = mix(pebble * mix(1., .5, isCob * (1. - smoothstep(1., 1.3, cr))), cobble, isCob * (1. - smoothstep(.9, 1., cr)));
          shC = uShingle * mix(vec3(.8, .8, .79) * (.9 + .2 * pc2.z), pebble, close) * (.6 + .5 * berm + .16 * bermFine) * mix(vec3(.9, .95, 1.04), vec3(1.06, 1., .9), berm);
          // THE SUN DRIES THE SHORE (dry: 0 while the sun stands lower than 21 degrees, 1 from 38 degrees up; the
          // sun's own height, the same on every seed): under a low sun the shore lies damp as the tide left it; under
          // a high one the shingle dries as pale as the storm beach above it, and the pebbles stand out of the sand
          float dry = smoothstep(.36, .62, uSunDir.y);
          // (damp, the middle beach is darker and warmer than the bleached top; the sand a wet ochre, ribbed a hand apart)
          shC *= mix(vec3(.74, .7, .63), vec3(1.), max(high, dry));
          vec3 sandC = vec3(.46, .38, .27) * (.86 + .22 * esN(p * 1.1)) * (.93 + .14 * fine) * (.9 + .16 * sin(yb * 60. + esN(p * .6) * 7.));
          // PEBBLES STAND OUT OF THE DRIED SAND: of the shingle's own pebbles six in ten just under the pebble bank,
          // one in three by the water (the pebble's own number says which), and none while the shore lies damp; the
          // sand lies between them. Far off, where the pebbles are no longer drawn one by one, the sand gives way by
          // their mean share (0.866 of such a pebble's cell is pebble, counted over the cells' own pattern at four
          // million places), so the tone holds as the grain goes
          float strewShare = mix(.34, .6, smoothstep(.2, 1., yb)) * dry;
          strewn = sand * mix(strewShare * .866, step(1. - strewShare, fract(pc.z * 7.)) * smoothstep(.02, .1, pc.w), close);
          shC = mix(shC, sandC, (sand - strewn) * .9);
          // the wrack at the last high water: dark weed in ragged heaps along one line, white shells among it; an older,
          // thinner line lies higher up the beach
          float heap = smoothstep(.3, .46, esF(p * 1.3 + 9.));
          float wrack = (1. - smoothstep(.05, .2, abs(yb - 1.1))) * heap + (1. - smoothstep(.0, .07, abs(yb - 1.52))) * heap * .6;
          wrack *= smoothstep(2.5, 6., abs(vPl.z));
          shC = mix(shC, mix(mix(vec3(.05, .05, .03), vec3(.14, .08, .04), esN(p * 3.1)), vec3(.09, .12, .04), step(.62, esN(p * 5.3 + 3.))) * (.6 + .8 * fine), wrack * .94);
          vec4 sc = esCell(p / .13 + 17.);
          float shell = step(.9, sc.z) * (1. - smoothstep(.22, .34, length(sc.xy))) * (1. - smoothstep(.08, .24, abs(yb - 1.1))) * smoothstep(2.5, 6., abs(vPl.z)) * close;
          shC = mix(shC, vec3(1.25, 1.2, 1.08), shell);
          // the rock pools at the headlands' feet (uPools: middle x, z; half length; turn): still water in a hollow of
          // the shingle, a dark weedy rim about it
          float poolRim = 0.;
          for (int k = 0; k < 2; k++) {
            vec2 q = p - uPools[k].xy; float cs = cos(uPools[k].w), sn = sin(uPools[k].w);
            float d = length(vec2(q.x * cs + q.y * sn, (q.y * cs - q.x * sn) * 1.7)) / uPools[k].z + (esN(p * .8 + 3.) - .5) * .35;
            poolIn = max(poolIn, 1. - smoothstep(.86, .94, d)); poolRim = max(poolRim, (1. - smoothstep(1., 1.35, d)) * smoothstep(.8, .92, d));
          }
          shC = mix(shC, vec3(.12, .13, .07) * (.7 + .6 * fine), poolRim * .8);
          shC = mix(shC, shC * vec3(.3, .42, .36), poolIn);
          // the band the sea wets: dark and smooth below a scalloped edge where the last waves reached; and three thin
          // lines of surf running up it and sliding back, each on its own time, laced, leaving a film of foam behind
          // (the damp sand above the wet band shines a little; a runnel's thread of water shines as the wet band does)
          float runnel = (1. - smoothstep(.0, .07, abs(esN(vec2(vPl.z * .33 + esN(p * .23) * 1.6, yb * 1.1)) - .5))) * sand * smoothstep(2.5, 5., abs(vPl.z));
          wet = max(max(1. - smoothstep(.62, .78, yb), sand * .3), runnel * .85);
          shC *= mix(vec3(1.), vec3(.4, .47, .52), wet);
          for (int k = 0; k < 3; k++) {
            float fk = float(k), ph = uTime * (.5 + .07 * fk) + fk * 2.1 + 5. * esN(vec2(vPl.z * .045, fk * 7.));
            float reach = .1 + .1 * fk + .22 * (.5 + .5 * sin(ph)), up = .5 + .5 * cos(ph);
            float lace = smoothstep(.25, .6, esN(p * 2.7 + vec2(fk * 9., uTime * .2)));
            float line = (1. - smoothstep(.0, .03, abs(yb - reach))) * mix(.45, 1., up) * mix(.5, 1., lace);
            float film = (1. - smoothstep(.0, .16, reach - yb)) * step(yb, reach) * lace * .4 * up;
            foamOn = max(foamOn, max(line, film));
          }
          shC = mix(shC, vec3(1.5, 1.52, 1.55), foamOn);
        }
        // the headlands and the land by the sea: wind-cut turf, rock where it steepens
        float coast = smoothstep(214., 240., vPl.w);
        float strata = esN(vec2(vW.y * 2.4 + esN(p * .12) * 4., dot(p, vec2(.06, .04))));
        vec4 rc = esCell(vec2(p.x + p.y * .6, vW.y * 1.6) / 1.7);
        vec3 rockC = uRock * (.55 + .5 * strata + .3 * esF(vec2(p.x * .3 + p.y * .2, vW.y * 1.4))) * (.8 + .4 * fine) * mix(.5, 1., smoothstep(0., .12, rc.w));
        // the beds of the rock: a dark parting every metre or so up the face, dipping a little along it, warm and cool beds
        float bedY = vW.y * .9 + dot(p, vec2(.035, .02)) + esN(p * .08) * 1.5;
        rockC *= mix(.4, 1., smoothstep(0., .1, abs(fract(bedY) - .5)));
        rockC *= mix(vec3(1.12, 1.02, .88), vec3(.86, .92, 1.0), esH(vec2(floor(bedY + .5), 3.)));
        // rain-dark seams down the faces, pale lichen toward the tops
        rockC *= mix(.5, 1.08, smoothstep(.3, .62, esF(vec2(dot(p, vec2(.33, .26)), vW.y * .22))));
        rockC = mix(rockC, uRock * vec3(1.25, 1.2, .98), smoothstep(.55, .75, esF(p * .5 + 17.)) * smoothstep(6., 14., vW.y) * .6);
        // thrift in flower on the turf of the headlands
        vec4 tf = esCell(p / .55 + 11.);
        vec3 turfC = mix(esGrass(p) * vec3(1.05, 1., .8), vec3(.84, .5, .64), (1. - smoothstep(.1, .22, length(tf.xy))) * step(.7, tf.z) * smoothstep(.42, .56, esN(p * .1 + 3.)) * near);
        vec3 turf = mix(turfC, rockC, 1. - smoothstep(.9, .975, n.y + (mossy - .5) * .08));
        floorC = mix(floorC, turf, coast);
        // the fall to the sea: rough turf, bents bleached by the wind, dark heather in patches, thrift in flower near the brow
        float hp = esF(p * .09 + 21.), hq = esF(p * .37 + 4.);
        vec3 heathC = mix(esGrass(p) * vec3(1.02, 1., .78), vec3(.36, .34, .17) * (.8 + .4 * fine), smoothstep(.38, .62, hq));
        heathC = mix(heathC, vec3(.17, .12, .13) * (.7 + .6 * fine), smoothstep(.52, .66, hp) * .85);
        vec4 th = esCell(p / .6);
        heathC = mix(heathC, vec3(.8, .46, .6), (1. - smoothstep(.1, .22, length(th.xy))) * step(.72, th.z) * smoothstep(.4, .55, esN(p * .12 + 8.)) * near);
        heathC = mix(heathC, rockC, 1. - smoothstep(.82, .93, n.y + (mossy - .5) * .08));
        floorC = mix(floorC, heathC, vHeath.x);
        // bluebells in and about the wood's great glade: a blue-violet haze over their green, flower by flower close to
        float blue = vHeath.y * smoothstep(.2, .45, esF(p * .21 + 40.) + vHeath.y * .4);
        vec4 bc = esCell(p / .15);
        vec3 bellC = mix(vec3(.1, .26, .07), vec3(.17, .1, .95), mix(.7, step(.3, bc.z) * (1. - smoothstep(.2, .36, length(bc.xy))), near * .8));
        floorC = mix(floorC, bellC * (.8 + .4 * fine), blue);
        vec3 a = floorC * wood + lawnC * lawn + valC * val + shC * shin;
        // thrift along the turf's edge above the shingle: grey-green cushions, each set with pink heads
        float edgeT = smoothstep(.04, .22, shin) * (1. - smoothstep(.45, .8, shin));
        if (edgeT > 0.) {
          vec4 tc = esCell(p / .8 + 23.), th2 = esCell(p / .13);
          float cu = length(tc.xy) / mix(.3, .46, fract(tc.z * 9.1));
          vec3 cushion = mix(vec3(.1, .17, .08), vec3(.2, .3, .14), 1. - cu) * (.8 + .4 * fine);
          cushion = mix(cushion, vec3(.95, .34, .56), mix(.3, step(.5, th2.z) * (1. - smoothstep(.22, .36, length(th2.xy))), near) * (1. - smoothstep(.6, .9, cu)));
          a = mix(a, cushion, edgeT * step(.5, tc.z) * (1. - smoothstep(.85, 1., cu)));
        }
        // the drive, its grass verges, and the spent red flowers lying thick at the banks' feet
        // (aPlace carries the metres to the gravel's middle WITHOUT their side: between two corners of a 2 m cell on
        // either side of the middle that number never reaches 0, which broke the wood's narrow drive into pale blobs and
        // stretched streaks. Along the wood's drive aSide carries the metres to the LEFT of the middle, with their sign,
        // and the side is dropped here, pixel by pixel; its second number is 1 only at corners of the wood's drive, so
        // the cut, the lawn and every other drive take the number they took before)
        float d = mix(vPl.x, abs(vSide.x), step(.999, vSide.y)), hw = vPl.y, cut = pl.b;
        float verge = 1. - smoothstep(hw + mix(1.3, 9.5, cut), hw + mix(2.6, 11., cut), d + (esN(p * .9) - .5) * 1.2);
        // under the trees the verge is moss and litter, and the drive is darker worn gravel: leaves lying on it, two wheel
        // lines worn paler, moss creeping in from its edges
        float inWood = wood * smoothstep(.3, .7, pl.r);
        float vergeW = mix(verge, step(.5, verge + (lf.z - .5) * .5), near * inWood);
        a = mix(a, mix(esGrass(p), mix(floorC, uMoss * (.5 + .5 * esN(p * 27.)), .5), inWood), vergeW * (1. - lawn) * (1. - shin));
        float edge = hw + (esN(p * 1.3) - .5) * .5;
        vec3 grav = esGravel(p), gw = grav * vec3(.36, .33, .27);
        gw = mix(gw, grav * .82, (1. - smoothstep(.1, .34, abs(d - .8))) * .55);
        gw = mix(gw, uLitterB * (.7 + .5 * lf.z), mix(.14, step(.74, lf.z) * smoothstep(0., .1, lf.w) * .6, near));
        gw = mix(gw, uMoss * (.7 + .5 * fine), smoothstep(hw - .8, hw - .1, d + (mossy - .5) * .8) * .8);
        // under the vault the drive is two wheel ruts worn pale with a green crown between them, tuft by tuft
        gw = mix(gw, grav * .95, vlt * (1. - smoothstep(.1, .3, abs(d - .8))) * .4);
        gw = mix(gw, mix(uMoss, esGrass(p), .45) * (.7 + .6 * fine), vlt * (1. - smoothstep(.2, .46, d + (esN(p * 2.3) - .5) * .3)) * smoothstep(.3, .55, esN(p * 5.) * .6 + fine * .4));
        a = mix(a, mix(grav, gw, inWood), (1. - smoothstep(edge - .12, edge + .16, d)) * (1. - shin));
        float redHere = cut * mix(mix(.1, .78, smoothstep(1.5, 10., d)), 1., uRedAll);
        a = mix(a, uFallen * (.75 + .5 * esH(floor(p / .17))), mix(redHere * .45, esFallenAt(p, redHere), near));
        // rock where the land is steep
        float rock = 1. - smoothstep(.7, .84, n.y);
        a = mix(a, mix(uRock * (.7 + .6 * esF(vec2(p.x * .3 + p.y * .2, vW.y * 1.4))), rockC, coast), rock);
        vec3 c = esLight(a, n, vW, vAo, 0.);
        // the garden's own fine shade on the lawn (tShade): the sun's part of the light goes out of a clipped thing's
        // shadow, and some of the sky's out of the ground close under it
        if (lawn > 0.) {
          vec2 sd = gard.rg * lawn;
          vec3 sunE = uSunCol * (clamp(dot(n, uSunDir), 0., 1.) * esSun(vW, pl)), fillE = esFill(n, pl) * (vAo * (.6 + .4 * esCloudShade(vW)));
          c *= (sunE * (1. - sd.r) + fillE * (1. - .6 * sd.g)) / max(sunE + fillE, vec3(1e-4));
        }
        vec3 v = normalize(cameraPosition - vW);
        // by the sea the light comes back off the water: a flank turned from the sun is not left dark
        c += a * (uSkyCol + uSunCol * .12) * (.16 * coast * clamp(.6 - dot(n, uSunDir), 0., 1.));
        // THE MIRROR'S LAW (the wet band and the rock pools alike): what lies wet throws back the sky along its mirrored
        // sight line (haze at the horizon, the sky's own colour above), the sun where its image falls and the ring where
        // its image falls (a disc of the ring's own size, and a soft glow about it); more of it the flatter the sight
        // line lies. The wet pebbles break the image (each tilts its own way); a pool lies still but for the wind's ripple
        float mir = max(wet * (1. - foamOn), poolIn) * shin;
        if (mir > 0.) {
          vec3 tilt = vec3(pc.x, 0., pc.y) * (.22 * (1. - poolIn)) + vec3(esN(p * 2.1 + uTime * .5) - .5, 0., esN(p * 2.1 + 9. - uTime * .4) - .5) * (.05 * poolIn);
          vec3 r = reflect(-v, normalize(n + tilt)); r.y = abs(r.y);
          float fres = .07 + .8 * pow(1. - clamp(dot(n, v), 0., 1.), 3.) + .25 * poolIn;
          vec3 toRing = uPortal.xyz - vW; float rl = length(toRing), ca = dot(r, toRing / rl), ra2 = RING_R * RING_R / (rl * rl);
          vec3 img = mix(uFogCol, uSkyCol * .3183, smoothstep(.02, .55, r.y)) + uSunCol * (.6 * pow(clamp(dot(r, uSunDir), 0., 1.), 180.));
          img += uPortalCol * (.9 * smoothstep(1. - ra2 * .9, 1. - ra2 * .35, ca) + .22 * pow(clamp(ca, 0., 1.), 24.));
          c = mix(c, img, mir * min(fres, 1.));
        }
        // A WET PEBBLE IS ROUND: somewhere on it the sun's own image stands, a point of light, whichever way the sun stands
        // (where the pebble's face turns half way between the sun and the eye): the strewn pebbles of the wet band
        // and, fainter, of the sand above it, at the hours when pebbles stand out of the sand (none while the sun is under 21 degrees)
        float glint = strewn * wet * (1. - foamOn) * shin;
        if (glint > 0.) c += uSunCol * (glint * esSun(vW, pl) * 1.2 * pow(clamp(dot(normalize(vec3(-pc.x * 2.4, 1., -pc.y * 2.4)), normalize(v + uSunDir)), 0., 1.), 260.));
        gl_FragColor = vec4(esFog(c, vW), 1.);
      }`});return r.detailMap=u.tPlace.value,r}async function ot(u){const{ctx:p,R:D,Lo:e,M:r,BOX:w}=u,L=_,P=[0,0,0],f=[0,0],z=et(w,384,192),W=[],b=e.tables,S=(l,o,a,n,h)=>{const s=b.B+Math.round(l),g=Math.min(s+2,b.n-1),t=b.X[g]-b.X[s],m=b.Z[g]-b.Z[s],k=Math.hypot(t,m)||1;W.push({x:b.X[s]+m/k*o*a,z:b.Z[s]-t/k*o*a,r:n,m:l,side:o,off:a,blue:h,tx:t/k,tz:m/k})};for(let l=r.straight+D.glades.range(28,44);l<r.east-24;l+=D.glades.range(28,44)){const o=D.glades.chance(.5)?1:-1,a=D.glades.range(13,21),n=D.glades.range(7,10.5);W.length?S(l,o,a,n,!1):S(l,o,25,15,!0)}u.gaps=W;for(let l=0;l<z.H;l++){for(let o=0;o<z.W;o++){const a=l*z.W+o,n=z.centre(a),h=n[0],s=n[1];e.routeAt(h,s,P);const g=e.lawnIn(h,s),t=P[0]<71;if(!t&&g<.02){z.cover[a]=h>-330?.9:0;continue}z.live[a]=1,z.occ[a]=e.ground(h,s);const m=e.woodIn(h,s),k=e.toValley(h,s),A=Math.abs(k[1]-e.lr(k[0])-2.5);z.cover[a]=(t&&P[1]<r.east-12?1-.08*oe((P[1]-r.east+36)/24,0,1):.92)*m,t&&P[1]===P[1]&&(z.red[a]=e.cutSpan(P[1])*(1-Y(30,40,P[0])));const d=Y(e.headS-4,e.headS+14,k[0])*(1-Y(205,222,k[0]))*Y(3,7,A)*(1-Y(46,60,A));z.pale[a]=d,z.cover[a]=Math.max(z.cover[a],.4*d)}l%8===7&&await p.yield()}for(const l of W)z.disc(z.cover,l.x,l.z,l.r*.55,l.r*1.25,.08,!0);return await p.yield(),at({...u,PM:z,ra:P,da:f})}function Le(u){const p=u.flatMap(L=>L.chunks),D=L=>{const P=new Float32Array(p.reduce((z,W)=>z+W[L].length,0));let f=0;for(const z of p)P.set(z[L],f),f+=z[L].length;return P},e=new I.BufferGeometry,r=[];let w=0;for(const L of["position","normal","aUv","aMask"]){const P=p[0].geometry.attributes[L].itemSize,f=new Float32Array(p.reduce((W,b)=>W+b.geometry.attributes[L].array.length,0));let z=0;for(const W of p)f.set(W.geometry.attributes[L].array,z),z+=W.geometry.attributes[L].array.length;e.setAttribute(L,new I.BufferAttribute(f,P))}for(const L of p){const P=L.geometry.index.array;for(let f=0;f<P.length;f++)r.push(P[f]+w);w+=L.geometry.attributes.position.count,L.geometry.dispose()}return e.setIndex(r),e.computeBoundingSphere(),{chunks:[{geometry:e,heads:D("heads"),headTint:D("headTint"),leaves:D("leaves"),leafTint:D("leafTint"),sphere:e.boundingSphere}]}}function Be(u,p){const D=u.reduce((r,w)=>r+w.heads.length/16,0);if(D<=p)return;const e=p/D;for(const r of u){let w=0;for(let L=0,P=r.heads.length/16;L<P;L++){const f=L*16;let z=Math.imul(Math.round(r.heads[f+12]*1e3),73856093)^Math.imul(Math.round(r.heads[f+13]*1e3),19349663)^Math.imul(Math.round(r.heads[f+14]*1e3),83492791);z=Math.imul(z^z>>>15,739982445),z=Math.imul(z^z>>>12,695872825),!(((z^z>>>15)>>>0)/4294967296>=e)&&(r.heads.copyWithin(w*16,f,f+16),r.headTint.copyWithin(w*4,L*4,L*4+4),w++)}r.heads=r.heads.slice(0,w*16),r.headTint=r.headTint.slice(0,w*4)}}async function at(u){const{ctx:p,scene:D,R:e,Lo:r,M:w,heavy:L,density:P,detail:f,U:z,PM:W}=u,b=r.tables,S=We(z,{heavy:L}),l=We(z,{heavy:L,bush:!0}),o=[];for(let F=w.east;F<=w.west;F++)o.push([b.X[b.B+F],b.Z[b.B+F]]);const a=w.west-w.east,n=[];for(const[F,B,y]of[[1,e["bank-left"],0],[-1,e["bank-right"],700]]){const c=await Se({line:o,side:F,rng:B,heavy:L,uvOffset:y,groundAt:r.ground,chunk:32,thin:e[F>0?"thin-left":"thin-right"],lineDist:r.routeDist,headNear:14,headFar:21,headSize:[.3,.84],foot:v=>11+6*Y(a-30,a-6,v),thick:v=>12+1.6*Math.sin(v*.07+y),tall:v=>1-.36*Y(a-34,a-8,v)},p.yield);Be(c.chunks,44*a);const i=S.assemble(c);D.add(i.group),n.push({bank:c,built:i,side:F}),c.eachVertex((v,C,N)=>W.raise(v,N,C,1.6)),await p.yield()}const h=[0,1,2,3].map(()=>({m:[],t:[]})),s=new I.Matrix4,g=new I.Quaternion,t=new I.Euler,m=new I.Vector3,k=new I.Vector3;for(let F=0,B=e["fallen-heads"],y=Math.round((L?4400:3e3)*f);F<y;F++){const c=B.range(0,a),i=B.sign(),v=10.6*Math.pow(B(),.6),C=B.range(.13,.24),N=B.range(0,U),q=B.range(-.5,.5),G=B.range(.7,1.15),R=b.B+w.east+Math.floor(c),H=b.X[R+1]-b.X[R],X=b.Z[R+1]-b.Z[R],O=Math.hypot(H,X)||1,V=b.X[R]+X/O*i*v,K=b.Z[R]-H/O*i*v,T=h[Math.min(3,Math.floor(c/a*4))];t.set(q,N,q*.7),s.compose(m.set(V,r.ground(V,K)+.03,K),g.setFromEuler(t),k.set(C,C*.6,C));for(let Z=0;Z<16;Z++)T.m.push(s.elements[Z]);T.t.push(G,.3,.85,0),F%800===799&&await p.yield()}const A=new I.Group;D.add(A);for(const F of h){const B=S.headGeometry.clone(),y=new I.InstancedMesh(B,S.head,F.m.length/16);B.setAttribute("aTint",new I.InstancedBufferAttribute(new Float32Array(F.t),4)),y.instanceMatrix=new I.InstancedBufferAttribute(new Float32Array(F.m),16),y.computeBoundingSphere(),A.add(y)}await p.yield();const d=[],x=[];for(const F of u.gaps){if(F.blue)continue;const B=Y(u.gaps[0].m,w.east,F.m),y=1+(e.outliers.chance($(.4,.9,B)*P)?1:0)+(e.outliers.chance($(.15,.6,B)*P)?1:0);for(let c=0;c<y;c++){const i=c===0?$(4.6,9.5,B)*e.outliers.range(.9,1.1):e.outliers.range(3.2,3.6+2.4*B),v=i*e.outliers.range(1.15,1.45),C=e.outliers.range(0,U),N=c===0?0:(c===1?-1:1)*e.outliers.range(5.5,8.5),q=c===0?0:e.outliers.range(1.5,5),G=b.B+Math.round(F.m),R=Math.min(G+2,b.n-1),H=b.X[R]-b.X[G],X=b.Z[R]-b.Z[G],O=Math.hypot(H,X)||1,V=F.x+H/O*N+X/O*F.side*q,K=F.z+X/O*N-H/O*F.side*q,T=v*.9,Z=await Se({line:[[V-Math.cos(C)*T/2,K-Math.sin(C)*T/2],[V+Math.cos(C)*T/2,K+Math.sin(C)*T/2]],side:0,rng:u.fork("outlier-"+d.length),heavy:L,uvOffset:1400+d.length*40,groundAt:r.ground,chunk:999,cell:.9,rows:18,thick:()=>v,domeHalf:[T,T],domeHigh:[i,i],lean:0,lumps:1.2,perM2:1.5,leafM2:.6,thin:e["thin-outliers"],lineDist:r.routeDist,headNear:18,headFar:32},null);d.push(Z),x.push({x:V,z:K,r:v*.5,h:i}),Z.eachVertex((E,Q,j)=>W.raise(E,j,Q,1.6)),W.disc(W.red,V,K,v*.5+1,v*.5+4,.85,!1),d.length%3===0&&await p.yield()}}Be(d.flatMap(F=>F.chunks),12*(w.east-w.straight));const M=l.assemble(Le(d));return D.add(M.group),u.spots=x,st({...u,banks:n,outliers:M,lyingGroup:A})}async function st(u){const{ctx:p,scene:D,R:e,Lo:r,path:w,heavy:L,U:P,PM:f,da:z}=u,W=_,b=new I.DataTexture(new Uint8Array(f.W*f.H*4),f.W,f.H,I.RGBAFormat);b.magFilter=b.minFilter=I.LinearFilter,b.wrapS=b.wrapT=I.ClampToEdgeWrapping,b.generateMipmaps=!1,P.tPlace.value.dispose(),P.tPlace.value=b;const S=(A,d,x,M,F)=>{const B=r.toValley(A,d),y=B[0],c=B[1]-r.lr(y)-2.5,i=Math.abs(c)+r.flankInset(y,c>0),v=Y(212,222,y)*(1-Y(r.floorHalf(y),r.floorHalf(y)+4,i)),C=Y(r.headS-10,r.headS+6,y)*(1-Y(52,64,i))*(1-v)*(1-Y(236,246,y)),N=r.lawnIn(A,d)*(1-C)*(1-v)*(1-r.seaFall(y,B[1]));return F.setRGB(N,C,v)},l=[1,-1].map(A=>{const d=e.pools.range(236,252),x=A*(r.floorHalf(d)-r.flankInset(d,A>0)-e.pools.range(2.5,5)),M=r.fromValley(d,r.lr(d)+2.5+x);return{x:M[0],z:M[1],r:e.pools.range(3,4.2),turn:Math.atan2(W.valleyAxis[1],W.valleyAxis[0])+e.pools.range(-.3,.3)}}),o=bt(u.sunDir),a=tt(P,{stripe:W.houseFront,petals:L?1:.34,heavy:L,pools:l,shade:o}),n=[];for(let A=10;A<=De;A+=20)n.push([W.entry[0]+A,W.entry[1],2]);for(let A=250;A<=350;A+=20)for(const d of[45,65,85])for(const x of[-1,1]){const M=r.fromValley(A,r.lr(A)+2.5+x*d);n.push([M[0],M[1],2])}await p.yield();const h=await je.makeTerrainAsync({rng:e.far,noise:p.noise,path:w,height:r.ground,corridor:!1,bounds:[-720,-420,960,540],cell:2,near:11,levels:5,refine:2,refineDistance:300,maxTriangles:64e3,color:S,materialInstance:a,ao:.4,focus:n},p.yield,2),s=h.geometry.attributes.position,g=new Float32Array(s.count*4),t=new Float32Array(s.count*2),m=new Float32Array(s.count*2),k=u.ra;for(let A=0;A<s.count;A++){const d=s.getX(A),x=s.getZ(A),M=r.toValley(d,x);r.drive(d,x,z),g[A*4]=Math.min(z[0],60),g[A*4+1]=z[1],g[A*4+2]=M[1]-r.streamAt(M[0]),g[A*4+3]=M[0],z[0]<6&&(r.routeAt(d,x,k),m[A*2]=k[2],m[A*2+1]=k[1]<u.M.east-4&&Math.abs(Math.abs(k[2])-z[0])<.01?1:0),t[A*2]=r.seaFall(M[0],M[1]);for(const F of u.gaps)if(F.blue){const B=d-F.x,y=x-F.z;t[A*2+1]=Math.max(t[A*2+1],1-Y(F.r*.5,F.r*1.8,Math.hypot((B*F.tx+y*F.tz)*.5,y*F.tx-B*F.tz)))}(A&1023)===1023&&await p.yield()}return h.geometry.setAttribute("aPlace",new I.BufferAttribute(g,4)),h.geometry.setAttribute("aHeath",new I.BufferAttribute(t,2)),h.geometry.setAttribute("aSide",new I.BufferAttribute(m,2)),h.object.name="ground",D.add(h.object),await p.yield(),ht({...u,placeTex:b,pools:l,lawnShade:o,surface:h.surfaceAt})}function nt(u,p){return new I.ShaderMaterial({uniforms:{...u,map:{value:p}},fog:!1,side:I.DoubleSide,vertexColors:!0,vertexShader:ae+`
      attribute vec4 wind; attribute vec4 aTint;
      varying vec3 vW, vN, vC; varying vec2 vUvF, vF;
      void main(){
        mat4 im = modelMatrix * instanceMatrix;
        vec3 org = im[3].xyz; float sc = length(im[1].xyz);
        vec4 wp = im * vec4(position, 1.);
        float ph = dot(org.xz, uWind.xy) * .09 - uTime * uWind.w * .8;
        float g = .55 + .45 * (sin(ph) * .6 + sin(ph * 2.3 + 1.7) * .4);
        vec2 bend = uWind.xy * g + vec2(sin(uTime * 1.3 + org.x), cos(uTime * 1.1 + org.z * 1.3)) * .24;
        float a = wind.x * sc * uWind.z;
        wp.xyz += vec3(bend.x * a, -dot(bend, bend) * a * .12, bend.y * a);
        float f1 = sin(uTime * 5.3 + wp.x * 2.1 + wp.y * 1.3 + wp.z * 1.7), f2 = cos(uTime * 4.1 + wp.z * 2.3 + wp.x * 1.1 - wp.y * .7);
        wp.xyz += vec3(f1, f2 * .7, f1 * f2) * (wind.y * .045 * uWind.z * (.4 + g) * min(sc, 2.5));
        vW = wp.xyz; vN = normalize(mat3(im) * normal); vC = color * aTint.rgb; vUvF = uv; vF = vec2(min(wind.z, 1.), aTint.a);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:ae+`
      uniform sampler2D map;
      varying vec3 vW, vN, vC; varying vec2 vUvF, vF;
      void main(){
        vec4 tx = texture2D(map, vUvF);
        if (tx.a < .4) discard;
        float leaf = clamp(vF.x, 0., 1.);
        vec3 n = normalize(vN);
        if (!gl_FrontFacing && leaf < .5) n = -n;
        float bark = esN(vec2(vW.x + vW.z, vW.y * .35) * 7.) * .6 + esN(vec2(vW.x - vW.z, vW.y * .2) * 19.) * .4;
        vec3 alb = vC * tx.rgb * mix(.62 + .7 * bark, 1., leaf);
        vec4 pl = esPlace(vW);
        vec3 c = esLight(alb, n, vW, vF.y, mix(.1, .7, leaf));
        vec3 v = normalize(cameraPosition - vW);
        float vl = clamp(dot(-v, uSunDir), 0., 1.);
        float thru = clamp(.25 - dot(n, uSunDir) * .75, 0., 1.) * (.35 + .65 * vl * vl);
        c += uSunCol * alb * vec3(.85, 1., .48) * (thru * leaf * .9 * .3183 * esSun(vW, pl));
        gl_FragColor = vec4(esFog(c, vW), 1.);
      }`})}function rt(u,p,D,e,r,w){const L=u.attributes.position,P=u.attributes.normal,f=u.attributes.color,z=u.attributes.uv,W=u.attributes.wind,b=u.index.array;let S=0;for(;S<L.count-1&&W.getZ(S)>.5;)S++;const l=9,o=[0,.05,.14,.34,.68,1],a=p+D,n=L.count,h=l*o.length,s=w.range(0,U),g=3+Math.floor(w()*3),t=new Float32Array((n+h)*3),m=new Float32Array((n+h)*3),k=new Float32Array((n+h)*3),A=new Float32Array((n+h)*2),d=new Float32Array((n+h)*4),x=[];t.set(L.array),m.set(P.array),k.set(f.array),A.set(z.array),d.set(W.array);for(let F=0;F<n;F++)t[F*3+1]+=p;for(let F=0;F<b.length;F+=3){const B=b[F],y=b[F+1],c=b[F+2];L.getY(B)<D&&L.getY(y)<D&&L.getY(c)<D&&W.getZ(B)<.5||x.push(B,y,c)}for(let F=0;F<o.length;F++)for(let B=0;B<l;B++){const y=n+F*l+B,c=B/l*U,i=o[F]*a,v=Math.exp(-i/1.3),C=(e+(r-e)*v)*(1+.22*v*Math.sin(c*g+s)+.05*Math.sin(c*2+i*.6+s));t[y*3]=Math.cos(c)*C,t[y*3+1]=i-.3,t[y*3+2]=Math.sin(c)*C,m[y*3]=Math.cos(c),m[y*3+1]=.25*v,m[y*3+2]=Math.sin(c);const N=.62+.38*Y(0,3,i);if(k[y*3]=f.getX(S)*N,k[y*3+1]=f.getY(S)*N,k[y*3+2]=f.getZ(S)*N,A[y*2]=z.getX(S),A[y*2+1]=z.getY(S),F>0){const q=(B+1)%l,G=n+(F-1)*l;x.push(G+B,G+l+B,G+q,G+q,G+l+B,G+l+q)}}const M=new I.BufferGeometry;return M.setAttribute("position",new I.BufferAttribute(t,3)),M.setAttribute("normal",new I.BufferAttribute(m,3)),M.setAttribute("color",new I.BufferAttribute(k,3)),M.setAttribute("uv",new I.BufferAttribute(A,2)),M.setAttribute("wind",new I.BufferAttribute(d,4)),M.setIndex(x),u.dispose(),M}function ue(u,p,D,e){const r=new Map;for(const S of D){const l=(S.c||0)*16+(S.v||0);r.has(l)||r.set(l,[]),r.get(l).push(S)}const w=new I.Matrix4,L=new I.Quaternion,P=new I.Euler,f=new I.Vector3,z=new I.Vector3,W=[];let b=0;for(const[S,l]of r){const o=p[S%16],a=new I.BufferGeometry;for(const s in o.attributes)a.setAttribute(s,o.attributes[s]);a.setIndex(o.index);const n=new Float32Array(l.length*4),h=new I.InstancedMesh(a,u,l.length);l.forEach((s,g)=>{P.set(s.lx||0,s.rot||0,s.lz||0,"YXZ"),w.compose(f.set(s.x,s.y,s.z),L.setFromEuler(P),z.set(s.s,s.sy||s.s,s.s)),h.setMatrixAt(g,w);const t=s.tint||[1,1,1];n[g*4]=t[0],n[g*4+1]=t[1],n[g*4+2]=t[2],n[g*4+3]=s.ao??1}),a.setAttribute("aTint",new I.InstancedBufferAttribute(n,4)),h.computeBoundingSphere(),h.boundingSphere.radius+=2,e.add(h),W.push(h),b+=o.index.count/3*l.length}return{meshes:W,triangles:b}}function lt(){let u=new Float32Array(12288),p=new Float32Array(12288),D=new Float32Array(12288),e=new Float32Array(16384),r=0;const w=[],L=z=>{const W=new Float32Array(z.length*2);return W.set(z),W},P=(z,W,b,S,l,o,a,n,h,s,g)=>{r*3===u.length&&(u=L(u),p=L(p),D=L(D),e=L(e));const t=r*3,m=r*4;return u[t]=z,u[t+1]=W,u[t+2]=b,p[t]=S,p[t+1]=l,p[t+2]=o,D[t]=a[0],D[t+1]=a[1],D[t+2]=a[2],e[m]=n,e[m+1]=h,e[m+2]=s,e[m+3]=g,r++};return{count:()=>w.length/3,tube(z,W,b,S,l){const o=r;for(let a=0;a<z.length;a++){const n=z[a],h=z[Math.max(a-1,0)],s=z[Math.min(a+1,z.length-1)];let g=s[0]-h[0],t=s[1]-h[1],m=s[2]-h[2];const k=Math.hypot(g,t,m)||1;g/=k,t/=k,m/=k;let A=t,d=-g,x=0;Math.abs(t)>.9&&(A=1,d=0,x=0);const M=A*g+d*t+x*m;A-=g*M,d-=t*M,x-=m*M;const F=Math.hypot(A,d,x)||1;A/=F,d/=F,x/=F;const B=t*x-m*d,y=m*A-g*x,c=g*d-t*A;for(let i=0;i<=W;i++){const v=i/W*U,C=S?1+S*Math.exp(-Math.max(n[4],0)/.55)*(.5+.5*Math.sin(v*n[5]+l)):1,N=Math.cos(v),q=Math.sin(v),G=n[3]*C,R=A*N+B*q,H=d*N+y*q,X=x*N+c*q;P(n[0]+R*G,n[1]+H*G,n[2]+X*G,R,H,X,b,i/W,n[4]??0,0,0)}}for(let a=0;a<z.length-1;a++)for(let n=0;n<W;n++){const h=o+a*(W+1)+n,s=h+W+1;w.push(h,h+1,s,h+1,s+1,s)}},card(z,W,b,S,l,o,a,n,h,s){const g=S[1]*l[2]-S[2]*l[1],t=S[2]*l[0]-S[0]*l[2],m=S[0]*l[1]-S[1]*l[0],k=t<0?-1:1,A=r;for(const[d,x]of[[0,0],[1,0],[1,1],[0,1]]){const M=(d*2-1)*o,F=(x*2-1)*a;P(z+S[0]*M+l[0]*F,W+S[1]*M+l[1]*F,b+S[2]*M+l[2]*F,g*k,t*k,m*k,n,d,x,h,s)}w.push(A,A+1,A+2,A,A+2,A+3)},ribbon(z,W,b,S,l,o){const a=r;for(const n of z)P(n[0]-W,n[1],n[2]-b,n[3],n[4],n[5],S,0,n[6],l,o),P(n[0]+W,n[1],n[2]+b,n[3],n[4],n[5],S,1,n[6],l,o);for(let n=0;n<z.length-1;n++){const h=a+n*2;w.push(h,h+1,h+2,h+1,h+3,h+2)}},mesh(z){const W=new I.BufferGeometry;return W.setAttribute("position",new I.Float32BufferAttribute(u.subarray(0,r*3),3)),W.setAttribute("normal",new I.Float32BufferAttribute(p.subarray(0,r*3),3)),W.setAttribute("color",new I.Float32BufferAttribute(D.subarray(0,r*3),3)),W.setAttribute("aData",new I.Float32BufferAttribute(e.subarray(0,r*4),4)),W.setIndex(w),W.computeBoundingSphere(),W.computeBoundingBox(),new I.Mesh(W,z)}}}const be=[[0,0,.62],[.1,.3,.5],[.28,.6,.36],[.55,.85,.22],[.8,.96,.12],[1,1,.05]],Ie=[be[0],be[2],be[4],be[5]];function Te(u,p,D,e,r,w){const L=w.r,P=w.fork,f=p.range(0,U),z=4+Math.floor(p()*3),W=p.range(0,U),b=Math.cos(W)*w.lean,S=Math.sin(W)*w.lean;u.tube([-.5,.05,.35,.9,2.2,P*.55,P].map(m=>[D+b*m,r+m,e+S*m,L*(1+.5*Math.exp(-Math.max(m,0)/.8))*(1-.18*m/P),m,z]),w.sides,w.bark,.42,f);const l=w.boughs,o=p.range(0,U),a=D+b*P,n=e+S*P,h=[0,0,0],s=[0,0,0],g=[0,0,0],t=(m,k,A,d,x,M,F)=>{const B=p.range(0,U),y=p.range(0,U),c=p.range(.78,1.16)*M,i=p.range(.85,1.2);if(w.keep&&!w.keep(m,A,d*1.281+.45))return;h[0]=Math.sin(x)*Math.cos(y),h[1]=Math.cos(x),h[2]=Math.sin(x)*Math.sin(y);const v=Math.cos(B),C=Math.sin(B),N=v*h[0]+C*h[2];s[0]=v-h[0]*N,s[1]=-h[1]*N,s[2]=C-h[2]*N;const q=Math.hypot(s[0],s[1],s[2]);s[0]/=q,s[1]/=q,s[2]/=q,g[0]=h[1]*s[2]-h[2]*s[1],g[1]=h[2]*s[0]-h[0]*s[2],g[2]=h[0]*s[1]-h[1]*s[0],u.card(m,k,A,s,g,d,d*.8,[w.leaf[0]*c*i,w.leaf[1]*c,w.leaf[2]*c],1+d/16,F)};for(let m=0;m<l;m++){const k=o+m/l*U+p.range(-.4,.4),A=m===0&&w.toward,d=A?w.toward[0]:Math.cos(k),x=A?w.toward[1]:Math.sin(k),M=A?w.reach:w.reach*p.range(.55,1),F=w.top*p.range(.86,1)-P,B=(v,C)=>!w.keep||[.3,.68,1].every(N=>w.keep(a+v*M*N,n+C*M*N)),y=B(d,x)?1:B(-d,-x)?-1:0,c=d*y,i=x*y;if(y){u.tube(w.limb.map(([v,C,N])=>[a+c*M*v,r+P-.4+F*C,n+i*M*v,L*N,5,0]),w.boughSides,w.bark,0,0);for(let v=0,C=A?Math.round(w.sprays*1.5):w.sprays;v<C;v++){const N=p.range(.3,1.12),q=N<.28?.6:N<.55?$(.6,.85,(N-.28)/.27):$(.85,1,Math.min(1,(N-.55)/.45)),G=p.range(-1,1)*(1+2.6*N),R=p.range(-.6,1)+2.6*p()*p(),H=w.spray*p.range(.75,1.2),X=p.chance(.6)?p.range(.1,.4):p.range(.5,1);t(a+c*M*N-i*G,r+P-.4+F*q-R,n+i*M*N+c*G,H,X,$(1,.72,oe(R/3,0,1)),6+8*N)}}}for(let m=0;m<w.roof;m++){const k=p.range(0,U),A=w.reach*Math.sqrt(p())*.95,d=r+w.top*p.range(.9,1.06);t(a+Math.cos(k)*A,d,n+Math.sin(k)*A,w.spray*p.range(1.3,1.7),p.range(.03,.3),1.08,12)}for(let m=0;m<w.under;m++){const k=p.range(0,U),A=p.range(1.5,.75*w.reach);t(a+Math.cos(k)*A,r+P+p.range(0,4),n+Math.sin(k)*A,w.spray*p.range(.6,.85),p.range(.1,.6),.7,5)}}function qe(u,p,D,e,r,w){const L=5+Math.floor(p()*3),P=p.range(0,U),f=w>1?4:3,z=[];for(let W=0;W<L;W++){const b=P+W/L*U+p.range(-.5,.5),S=w*p.range(.75,1.25),l=p.range(.85,1.3),o=p.range(1.3,1.9),a=p.range(.75,1.2),n=Math.cos(b),h=Math.sin(b);z.length=0;for(let s=0,g=0,t=-.05;s<f;s++){const m=l-o*s/(f-1),k=l-o*(s+.5)/(f-1),A=S/(f-1);z.push([D+n*g,r+t,e+h*g,-Math.sin(m)*n,Math.cos(m),-Math.sin(m)*h,s/(f-1)]),g+=Math.cos(k)*A,t+=Math.sin(k)*A}u.ribbon(z,-h*S*.2,n*S*.2,[.12*a,.26*a,.06*a],2,2.5)}}function it(u){return new I.ShaderMaterial({uniforms:u,fog:!1,side:I.DoubleSide,vertexColors:!0,vertexShader:ae+`
      attribute vec4 aData; varying vec3 vW, vN, vC; varying vec4 vD;
      void main(){
        vec4 wp = modelMatrix * vec4(position, 1.);
        float leafy = step(.5, aData.z), frond = step(1.5, aData.z);
        wp.xyz += esSway(wp.xyz, aData.w * mix(1., aData.y, frond)) * leafy;
        wp.y += leafy * (1. - frond) * .05 * sin(uTime * 2.3 + wp.x * 1.7 + wp.z * 1.3);
        vW = wp.xyz; vN = normalize(mat3(modelMatrix) * normal); vC = color; vD = aData;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:ae+Ae+`
      varying vec3 vW, vN, vC; varying vec4 vD;
      void main(){
        vec3 n = normalize(vN), v = normalize(cameraPosition - vW), c; vec4 pl = esPlace(vW);
        float dist = length(vW - cameraPosition);
        if (vD.z < .5) {
          vec2 bq = vec2(vD.x * 6.2, vD.y);
          float rings = smoothstep(.55, .75, esN(vec2(bq.x * .35, vD.y * 5.5 + esN(bq * .8) * 2.)));
          float blot = esF(bq * .55 + 3.);
          // smooth grey bark: fine rings round the stem, rain-dark streaks down it, pale lichen in blots; the foot dark
          // with moss to a man's height; and the stem's own form (a round thing darkens toward its edges)
          float streak = esN(vec2(bq.x * 2.3, vD.y * .22 + 7.));
          vec3 alb = vC * (.86 + .2 * esN(bq * 3.)) * (1. - .16 * rings) * mix(.74, 1.06, smoothstep(.25, .7, streak));
          alb = mix(alb, vec3(.5, .56, .44), smoothstep(.52, .7, blot) * .3);
          alb = mix(alb, vec3(.1, .18, .06) * (.7 + .6 * esN(bq * 6.)), (1. - smoothstep(.4, 2.6, vD.y + (blot - .5) * 1.6)) * .85);
          if (!gl_FrontFacing) n = -n;
          c = esLight(alb, n, vW, mix(.5, 1., smoothstep(0., 2.5, vD.y)), .25) * mix(.5, 1., pow(clamp(dot(n, v), 0., 1.), .7));
        } else if (vD.z < 1.5) {
          // a spray: an uneven outline, leaves in clumps with gaps between. Close to, its leaves are drawn one by one, in
          // two layers; far off, the clumps alone. Both let the same share of the sky through: 0.376 of a card is leaf
          // either way. Counted by a mirror of this law in node over 12,000 cards of the sizes the build deals (1.8 to
          // 5.6 m): 0.452 of a card lies within its outline and its clumps; close to, 0.83 of that is leaf of one layer
          // or the other, 0.376 of the card; far off the clumps are cut again at .414, which leaves 0.375 (at the .42
          // that stood here: 0.371). Only the grain changes with the distance
          // (size: the card's half size in metres, carried by its kind; its clumps and leaves keep their own size by it)
          vec2 q = vD.xy * 2. - 1.; float seed = vC.g * 61., size = (vD.z - 1.) * 16.;
          float rim = .64 + .36 * esN(vec2(atan(q.y, q.x + 1e-5) * 2.4 + seed, seed));
          float clump = esN(vD.xy * (1.5 * size) + seed);
          vec4 lc = esCell(vD.xy * (6.8 * size) + seed), lc2 = esCell(vD.xy * (6.8 * size) + seed + vec2(5.37, 9.13));
          float ang = lc.z * 6.2832, ca = cos(ang), sa = sin(ang), ang2 = lc2.z * 6.2832, ca2 = cos(ang2), sa2 = sin(ang2);
          vec2 lq = vec2(lc.x * ca + lc.y * sa, -lc.x * sa + lc.y * ca) / vec2(.62, .4), lq2 = vec2(lc2.x * ca2 + lc2.y * sa2, -lc2.x * sa2 + lc2.y * ca2) / vec2(.62, .4);
          float upper = step(dot(lq, lq), 1.) * step(.1, lc.z), under = step(dot(lq2, lq2), 1.) * step(.1, lc2.z) * (1. - upper);
          float leaf = upper + under, fineK = 1. - smoothstep(22., 55., dist);
          if (length(q) > rim || clump < .3 || mix(step(.414, clump), leaf, fineK) < .5) discard;
          lq = mix(lq, lq2, under); lc.z = mix(lc.z, lc2.z, under);
          vec3 alb = vC * (.8 + .4 * lc.z) * mix(1., (.78 + .3 * smoothstep(0., .6, lq.x * lq.x)) * (1. - .2 * under), fineK);
          if (n.y < 0.) n = -n;
          // A spray seen from below shows its underside, which takes the wood's shade alone and stands dark; where the
          // sun reaches its upper side (at a gap of the vault, or in the roof where the cover thins) the light comes
          // through its leaves green-gold. Seen from above it is lit as any leaf is.
          float below = step(dot(n, v), 0.), sunUp = clamp(dot(n, uSunDir) * .6 + .4, 0., 1.) * esSun(vW, pl);
          vec3 shade = esFill(mix(n, -n, below), pl) * (.6 + .4 * esCloudShade(vW)) + esPortal(vW, n);
          c = alb * (shade + uSunCol * mix(vec3(1.), vec3(1.4, 1.5, .6), below) * sunUp) * .3183;
        } else {
          float axd = abs(vD.x - .5) * 2., w = (1. - vD.y) * .95 + .03, pinna = .3 + .7 * smoothstep(.1, .55, abs(fract(vD.y * 19.) - .5) * 2.);
          if (axd > w * pinna) discard;
          vec3 alb = mix(vC * (.8 + .4 * esN(vW.xz * 5.)), vec3(.22, .2, .08), 1. - smoothstep(.02, .07, axd));
          if (n.y < 0.) n = -n;
          c = esLight(alb, n, vW, .55 + .45 * vD.y, .5);
          c += uSunCol * alb * vec3(.9, 1., .4) * (clamp(-dot(n, v), 0., 1.) * .1 * esSun(vW, pl));
        }
        gl_FragColor = vec4(esFog(c, vW), 1.);
      }`})}async function ht(u){const{ctx:p,scene:D,R:e,Lo:r,M:w,density:L,U:P}=u,f=r.tables,z=u.ra;await ne.prepareLeafTexture({},p.yield,12);const W=nt(P,ne.makeLeafTexture({})),b=new I.Group,S=await ct(u);D.add(b);const l=[{leaf:"#3f7a2c",bark:"#6e5c4a"},{leaf:"#4a8a30",leafLight:"#7fb84a",bark:"#8a8880",barkDark:"#5a5a54"},{leaf:"#37702a",bark:"#66564a"}],o=[];for(let c=0;c<3;c++)o.push(rt(ne.oakGeometry({rng:e.crowns,height:16.5+c*1.5,detail:0,...l[c]}),8.5+c*.5,3,.95,1.5,e.crowns)),await p.yield();for(let c=0;c<2;c++)o.push(ne.fernGeometry({rng:e.ferns,size:1.25,detail:1,leaf:"#4a9a3c"}));for(let c=0;c<2;c++)o.push(ne.bushGeometry({rng:e.ferns,size:2.2,detail:0,leaf:"#3f7a34",leafDark:"#24502a"}));await p.yield();for(let c=0;c<2;c++)o.push(ne.oakGeometry({rng:e.crowns,height:17+c*2.5,detail:0,fullness:1.25,...l[c*2]})),await p.yield();const a=[],n=(c,i,v)=>u.gaps.every(C=>Math.hypot(c-C.x,i-C.z)>C.r+v),h=c=>{const i=c.range(.82,1.08);return[i*c.range(.92,1.06),i,i*c.range(.9,1.05)]},s=(c,i,v)=>{const C=f.B+Math.round(c),N=Math.min(C+2,f.n-1),q=f.X[N]-f.X[C],G=f.Z[N]-f.Z[C],R=Math.hypot(q,G)||1;return[f.X[C]+G/R*i*v,f.Z[C]-q/R*i*v,G/R*i,-(q/R)*i]},g=[],t=c=>{const i=c<0?oe(Math.floor((c+De)/100),0,3):4+Math.floor(c/50);return g[i]||(g[i]=lt())},m=[.4,.375,.37],k=[.13,.3,.065],A=(c,i)=>{const v=c-_.entry[0],C=Math.abs(i-_.entry[1]);return v>0?C-4.6-15*v/340:Math.hypot(v,Math.max(C-4.6,0))},d=(c,i,v=0)=>n(c,i,.5)&&A(c,i)>=v,x=Qe(r,w,u.gaps,e["vault-places"],e["vault-depth"],L),M=e["vault-forms"];for(let c=0,i=0;c<x.length;c++){const v=x[c],C=v.m<-40,N=M.range(.88,1.1),q=r.ground(v.x,v.z),G=m.map(R=>R*N);if(v.great)Te(t(v.m),M,v.x,v.z,q,{r:v.r,lean:M.range(.01,.045),fork:M.range(8.5,12),top:M.range(21,27),reach:v.m<0?M.range(7,9):Math.hypot(v.x-f.X[f.B+Math.round(v.m)],v.z-f.Z[f.B+Math.round(v.m)])+M.range(.5,2.5),toward:v.m<0?null:[v.nx,v.nz],boughs:C?3:4+Math.floor(M()*2),boughSides:C?4:5,sides:C?6:10,sprays:C?5:8,roof:C?8:20,under:C?2:6,spray:3,limb:C?Ie:be,bark:G,leaf:k,keep:d});else{const R=v.m<0||v.d>35;Te(t(v.m),M,v.x,v.z,q,{r:v.r,lean:M.range(.01,.06),fork:M.range(8,11.5),top:M.range(19,25),reach:M.range(5,7.5),boughs:(R?1:2)+Math.floor(M()*2),boughSides:4,sides:R?5:6,sprays:R?3:5,roof:R?6:10,under:R?2:4,spray:3.3,limb:Ie,bark:G,leaf:k,keep:d})}(i+=x[c].great?4:1)>=80&&(i=0,await p.yield())}const F=16;for(let c=-260,i=0;c<320;c+=F,i++){for(let v=-560;v<930;v+=F){const C=v+e.forest.range(1,F-1),N=c+e.forest.range(1,F-1),q=e.forest(),G=Math.floor(e.forest()*3),R=e.forest.range(.8,1.2),H=e.forest.range(0,U),X=h(e.forest),O=v+e.forest.range(1,F-1),V=c+e.forest.range(1,F-1),K=7+Math.floor(e.forest()*2),T=e.forest.range(.85,1.3),Z=h(e.forest),E=(j,ee,J)=>Math.max(r.lawnIn(j+J,ee),r.lawnIn(j-J,ee),r.lawnIn(j,ee+J),r.lawnIn(j,ee-J))>.5;if(r.woodIn(O,V)>.6&&E(O,V,26)&&a.push({x:O,y:r.ground(O,V)-.25,z:V,s:T,rot:H,v:K,c:8+Math.floor((O+560)/320)+10*Math.floor((V+260)/320),tint:Z}),r.woodIn(C,N)<.5)continue;r.routeAt(C,N,z);let Q=0;if(C>_.entry[0]){const j=C-_.entry[0],ee=Math.abs(N-_.entry[1]);Q=ee>8.5+15*j/340&&ee<56?.35:0}else if(z[0]<71)Q=z[0]>13.5?$(1,.4,Y(25,70,z[0])):0;else{const j=r.toValley(C,N);Q=E(C,N,48)?1:j[0]>-30&&j[0]<300&&Math.abs(j[1])<125?.6:0}C>_.entry[0]||z[0]<71&&z[1]<w.east-8||S.at(C,N)||q>=Q*L||!n(C,N,2)||a.push({x:C,y:r.ground(C,N)-.25,z:N,s:R,rot:H,v:G,c:8+Math.floor((C+560)/320)+10*Math.floor((N+260)/320),tint:X})}i%6===5&&await p.yield()}for(let c=-40,i=0;c<w.east-2;c+=.8){const v=e.ferns.chance(.5)?1:-1,C=e.ferns(),N=e.ferns.chance(.11),q=e.ferns.range(.8,1.5),G=Math.floor(e.ferns()*2),R=N?10+22*C:4.2+12.3*Math.pow(C,1.6),H=s(c,v,R);n(H[0],H[1],N?2.5:-2)&&(N?a.push({x:H[0],y:r.ground(H[0],H[1])-.05,z:H[1],s:q,rot:e.ferns.range(0,U),v:5+G,c:Math.floor((c+40)/120),tint:h(e.ferns)}):qe(t(c),e.fronds,H[0],H[1],r.ground(H[0],H[1]),(G?1.45:.75)*q),++i%150===0&&await p.yield())}for(let c=2,i=0,v=e["floor-ferns"];c<w.east-16;c+=.25){const C=v.chance(.5)?1:-1,N=v(),q=v(),G=v.range(.55,.9),R=s(c,C,5.3+12*Math.pow(N,1.4)),H=r.ground(R[0],R[1]),X=Ke(R[0],H,R[1],u.sunDir),O=$e(R[0],R[1]),V=Y(.25,.55,O),K=Y(.25,.55,-O);q>=V*(.45+.55*X)+(1-V)*X*(.5-.3*K)||!n(R[0],R[1],-2)||(qe(t(c),v,R[0],R[1],H,G),++i%40===0&&await p.yield())}await p.yield();const B=it(P);for(const c of g)c&&c.count()&&(b.add(c.mesh(B)),b.children.length%3===0&&await p.yield());ue(W,o,a,b),await p.yield();const y=await ft(u,b,S);return vt({...u,floraMat:W,geoms:o,wood:b,deepWood:y})}async function ct(u){const{ctx:p,Lo:D,M:e}=u,r=16,w=-576,L=-272,P=95,f=38,z=new Uint8Array(P*f),W=[0,0,0],b=(l,o)=>D.woodIn(l,o)>.5;for(let l=0;l<f;l++){for(let o=0;o<P;o++){const a=w+(o+.5)*r,n=L+(l+.5)*r;if(D.routeAt(a,n,W),W[1]>e.east+6&&W[1]<e.west-30&&W[0]>=34&&W[0]<71){z[l*P+o]=1;continue}!b(a,n)||!b(a+24,n)||!b(a-24,n)||!b(a,n+24)||!b(a,n-24)||(a>_.entry[0]?Math.abs(n-_.entry[1])<62:D.routeDist(a,n)<58)||(z[l*P+o]=1)}l%16===15&&await p.yield()}return{deep:z,C:r,X0:w,Z0:L,NX:P,NZ:f,at:(l,o)=>{const a=Math.floor((l-w)/r),n=Math.floor((o-L)/r);return a>=0&&n>=0&&a<P&&n<f&&z[n*P+a]===1}}}async function ft(u,p,D){const{Lo:e,U:r}=u,{deep:w,C:L,X0:P,Z0:f,NX:z,NZ:W}=D,b=[],S=[],l=[],o=[],a=(m,k)=>m<0||k<0||m>=z||k>=W||w[k*z+m],n=(m,k)=>{const A=P+m*L,d=f+k*L;let x=0,M=0;for(const[F,B]of[[-1,-1],[0,-1],[-1,0],[0,0]])a(m+F,k+B)&&(x+=F?-1:1,M+=B?-1:1);return[A+5*(e.noise.n2(A*.07,d*.07)-.5),d+5*(e.noise.n2(A*.07+40,d*.07)-.5),Math.sign(x),Math.sign(M)]},h=(m,k,A,d)=>{const x=b.length/3;for(const M of[m,k]){const F=e.ground(M[0],M[1]),B=23;for(const y of[-1,B*.5,B])b.push(M[0]+M[2]*y*.12,F+y,M[1]+M[3]*y*.12),S.push(A,.2,d),l.push((M[0]+M[1])*1,y)}o.push(x,x+3,x+1,x+1,x+3,x+4,x+1,x+4,x+2,x+2,x+4,x+5)};for(let m=0;m<W;m++)for(let k=0;k<z;k++)w[m*z+k]&&(a(k+1,m)||h(n(k+1,m),n(k+1,m+1),1,0),a(k-1,m)||h(n(k,m+1),n(k,m),-1,0),a(k,m+1)||h(n(k+1,m+1),n(k,m+1),0,1),a(k,m-1)||h(n(k,m),n(k+1,m),0,-1));const s=new I.BufferGeometry;s.setAttribute("position",new I.Float32BufferAttribute(b,3)),s.setAttribute("normal",new I.Float32BufferAttribute(S,3)),s.setAttribute("aUv",new I.Float32BufferAttribute(l,2)),s.setIndex(o);const g=new I.ShaderMaterial({uniforms:r,fog:!1,side:I.DoubleSide,vertexShader:`attribute vec2 aUv; varying vec3 vW, vN; varying vec2 vQ;
      void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vN = normal; vQ = aUv; gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:ae+`
      varying vec3 vW, vN; varying vec2 vQ;
      // the wall ends upward in crowns: round heads of differing height side by side, in two ranks
      float crownTop(float u, float w, float k){ float f = fract(u / w) - .5; return (4. + 5.5 * esH(vec2(floor(u / w), k))) * sqrt(max(0., 1. - 4. * f * f)); }
      // one rank of stems along the wall: a stem in most of its places (w apart, each a little off its place), so many metres from its middle to its edge
      float rank(float u, float w, float wide, float k){ float c = floor(u / w), f = (fract(u / w) - .5 + (esH(vec2(c, k)) - .5) * .5) * w; return (1. - smoothstep(wide * .6, wide, abs(f))) * step(.22, esH(vec2(c, k + 5.))); }
      void main(){
        vec2 q = vec2(vW.x + vW.z, vW.y);
        float leafy = esF(q * .22 + 3.) * .6 + esN(q * 1.7) * .4;
        float topLine = 12.5 + max(crownTop(vQ.x, 9., 3.), crownTop(vQ.x + 4.1, 6.5, 8.));
        if (vQ.y > topLine + (esN(q * 1.3) - .5) * 1.6) discard;
        // what stands behind the avenue: stems receding into a green haze. Three ranks of them, each further rank closer
        // set, thinner and paler into the haze (the haze lies lightest over the floor); leaves close over them from 7 m up
        vec3 haze = mix(vec3(.14, .23, .1), vec3(.05, .095, .04), smoothstep(0., 9., vQ.y));
        float up = 1. - smoothstep(6., 11., vQ.y + (leafy - .5) * 4.);
        vec3 alb = mix(haze, mix(haze, vec3(.3, .33, .26), .3), rank(vQ.x + .6, 2.3, .13, 3.));
        alb = mix(alb, mix(haze, vec3(.3, .33, .26), .6), rank(vQ.x + 1.7, 3.4, .2, 2.));
        alb = mix(alb, vec3(.33, .36, .28) * (.75 + .5 * esN(vec2(vQ.x * 3., vQ.y * .4))), rank(vQ.x, 5.2, .3, 1.));
        alb = mix(mix(vec3(.03, .06, .025), vec3(.11, .2, .06), smoothstep(.3, .75, leafy)), alb, up);
        alb = mix(alb, vec3(.15, .28, .08) * (.7 + .6 * leafy), smoothstep(topLine - 7., topLine - 1., vQ.y) * .7) * .62;
        vec3 n = normalize(vN + vec3(0., leafy - .5, 0.));
        gl_FragColor = vec4(esFog(esLight(alb, n, vW, .55 + .45 * smoothstep(2., 14., vQ.y), .6), vW), 1.);
      }`}),t=new I.Mesh(s,g);return p.add(t),{mesh:t,mat:g,cells:D}}function dt(u){const p=u.houseCentre,D=u.houseAxis,e=u.houseFront,r=u.groundLawn,w=[],L=[],P=[],f=[],z=(l,o,a)=>[p[0]+D[0]*l+e[0]*a,r+o,p[1]+D[1]*l+e[1]*a],W=(l,o,a)=>{const n=Math.hypot(l,o,a)||1;return[(D[0]*l+e[0]*a)/n,o/n,(D[1]*l+e[1]*a)/n]},b=(l,o,a,n,h)=>{const s=w.length/3,g=W(o[0],o[1],o[2]);l.forEach((t,m)=>{const k=z(t[0],t[1],t[2]);w.push(k[0],k[1],k[2]),L.push(g[0],g[1],g[2]),P.push(a[m][0],a[m][1],n,h)}),f.push(s,s+1,s+2),l.length===4&&f.push(s,s+2,s+3)},S={W:z,quad:b,wall(l,o,a,n,h,s,g){const t=Math.hypot(a-l,n-o);b([[l,h,o],[a,h,n],[a,s,n],[l,s,o]],[-(n-o),0,a-l],[[0,h],[t,h],[t,s],[0,s]],g,t)},box(l,o,a,n,h,s,g,t=2){S.wall(l,n,o,n,h,s,g),S.wall(o,n,o,a,h,s,g),S.wall(o,a,l,a,h,s,g),S.wall(l,a,l,n,h,s,g),b([[l,s,a],[o,s,a],[o,s,n],[l,s,n]],[0,1,0],[[l,a],[o,a],[o,n],[l,n]],t,o-l)},roof(l,o,a,n,h,s,g,t=.45,m=2){if(g){const k=(a+n)/2,A=Math.hypot(k-a+t,s-h),d=l-t,x=o+t,M=(s-h)*t/(k-a);b([[d,h-M,n+t],[x,h-M,n+t],[x,s,k],[d,s,k]],[0,k-a,s-h],[[d,0],[x,0],[x,A],[d,A]],3,x-d),b([[x,h-M,a-t],[d,h-M,a-t],[d,s,k],[x,s,k]],[0,k-a,-(s-h)],[[x,0],[d,0],[d,A],[x,A]],3,x-d),b([[l,h,a],[l,h,n],[l,s,k]],[-1,0,0],[[0,h],[n-a,h],[(n-a)/2,s]],m,n-a),b([[o,h,n],[o,h,a],[o,s,k]],[1,0,0],[[0,h],[n-a,h],[(n-a)/2,s]],m,n-a)}else{const k=(l+o)/2,A=Math.hypot(k-l+t,s-h),d=a-t,x=n+t,M=(s-h)*t/(k-l);b([[o+t,h-M,d],[o+t,h-M,x],[k,s,x],[k,s,d]],[s-h,k-l,0],[[d,0],[x,0],[x,A],[d,A]],3,x-d),b([[l-t,h-M,x],[l-t,h-M,d],[k,s,d],[k,s,x]],[-(s-h),k-l,0],[[x,0],[d,0],[d,A],[x,A]],3,x-d),b([[l,h,n],[o,h,n],[k,s,n]],[0,0,1],[[0,h],[o-l,h],[(o-l)/2,s]],m,o-l),b([[o,h,a],[l,h,a],[k,s,a]],[0,0,-1],[[0,h],[o-l,h],[(o-l)/2,s]],m,o-l)}},geometry(){const l=new I.BufferGeometry;return l.setAttribute("position",new I.Float32BufferAttribute(w,3)),l.setAttribute("normal",new I.Float32BufferAttribute(L,3)),l.setAttribute("aSurf",new I.Float32BufferAttribute(P,4)),l.setIndex(f),l}};return S}function ut(u){const p=dt(u),D=u.houseLength/2,e=u.houseDepth/2,r=1.6,w=10,L=15,P=1.6,f=4.5,z=[-34,-17,0,17,34];p.box(-D-.3,D+.3,-e-.3,e+.3,-.5,r,2);let W=-D;for(const b of z)p.wall(W,e,b-f,e,r,w,0),W=b+f;p.wall(W,e,D,e,r,w,0),p.wall(D,e,D,-e,r,w,0),p.wall(D,-e,-D,-e,r,w,0),p.wall(-D,-e,-D,e,r,w,5),p.roof(-D,D,-e,e,w,L,!0,.45,0);for(const b of z)p.wall(b-f,e,b-f,e+P,r,w,2),p.wall(b+f,e+P,b+f,e,r,w,2),p.wall(b-f,e+P,b+f,e+P,r,w,1),p.roof(b-f,b+f,.5,e+P,w,17,!1,.4,1);for(const b of[-27,27])p.wall(b+5,-e,b+5,-e-22,r,w-1,0),p.wall(b+5,-e-22,b-5,-e-22,r,w-1,0),p.wall(b-5,-e-22,b-5,-e,r,w-1,0),p.roof(b-5,b+5,-e-22,-1,w-1,14,!1,.4,0);return p}function pt(u,p,D){const e=p.houseLength/2,r=p.houseDepth/2,w=1.6,L=r+12,P=[],f=[];u.box(-e-3,e+3,r+.3,L,-.5,w,2,4);for(let S=1;S<=5;S++)u.box(-4,4,L,L+.55*S,-.5,w-.27*S,2,4);const z=(S,l,o,a)=>{const n=Math.hypot(o-S,a-l),h=(o-S)/n,s=(a-l)/n,g=Math.abs(h)>.5,t=(k,A,d,x,M,F)=>{const B=S+h*k,y=S+h*A,c=l+s*k,i=l+s*A;g?u.box(Math.min(B,y),Math.max(B,y),c-d,c+d,x,M,2,F):u.box(B-d,B+d,Math.min(c,i),Math.max(c,i),x,M,2,F)};t(0,n,.17,w,w+.18,2),t(0,n,.19,w+.86,w+1,2);const m=Math.max(1,Math.round(n/8.5));for(let k=0;k<=m;k++){const A=n*k/m;t(A-.27,A+.27,.27,w,w+1.16,2),g&&f.push([S+h*A,l+s*A,w+1.16])}for(let k=.42;k<n-.2;k+=.42)Math.abs(k/(n/m)-Math.round(k/(n/m)))*(n/m)<.4||t(k-.07,k+.07,.07,w+.18,w+.86,2)};z(-e-2.7,L-.3,-4.4,L-.3),z(4.4,L-.3,e+2.7,L-.3),z(-e-2.7,r+.6,-e-2.7,L-.3),z(e+2.7,r+.6,e+2.7,L-.3);const W=[-39,-28.5,-19.5,-8.5,8.5,19.5,28.5,39],b=[1+Math.floor(D()*2),4+Math.floor(D()*3)];return W.forEach((S,l)=>{const o=S+D.range(-.8,.8),a=D.range(19.4,20.3),n=D.range(.95,1.25);u.box(o-n,o+n,-2.3,-.9,12.6,a,2),u.box(o-n-.14,o+n+.14,-2.44,-.76,a,a+.3,2);for(const h of[-.5,.5])u.box(o+h*n-.2,o+h*n+.2,-1.8,-1.4,a+.3,a+.95,2);b.includes(l)&&P.push(u.W(o+.5*n,a+1,-1.6))}),u.wall(-e-3.2,-2.6,-e-3.2,2.6,0,4.6,5),u.wall(-e,-2.6,-e-3.2,-2.6,0,4.6,2),u.wall(-e-3.2,2.6,-e,2.6,0,4.6,2),u.roof(-e-3.2,-e+1,-2.6,2.6,4.6,6.6,!0,.3,5),{smoke:P,piers:f}}function mt(u){const p=e=>({value:new I.Vector3(...Ne(e))}),D=new I.DataTexture(new Uint8Array([0,0,0,0]),1,1,I.RGBAFormat);return D.needsUpdate=!0,new I.ShaderMaterial({uniforms:{...u,tPlace:{value:D},uStone:p("#bdb39e"),uSlate:p("#5a6472"),uDoor:p("#33261a")},fog:!1,side:I.DoubleSide,vertexShader:`attribute vec4 aSurf; varying vec3 vW, vN; varying vec4 vS;
      void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vN = normal; vS = aSurf; gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:ae+Ae+`
      uniform vec3 uStone, uSlate, uDoor;
      varying vec3 vW, vN; varying vec4 vS;
      vec3 esAshlar(vec2 uv){
        float row = floor(uv.y / .36);
        vec2 b = vec2(uv.x / .92 + .5 * mod(row, 2.) + esH(vec2(row, 1.)) * .3, uv.y / .36), f = fract(b);
        float joint = smoothstep(0., .04, f.x) * (1. - smoothstep(.96, 1., f.x)) * smoothstep(0., .1, f.y) * (1. - smoothstep(.9, 1., f.y));
        return uStone * (.8 + .34 * esH(floor(b))) * mix(.7, 1., joint);
      }
      // a mullioned window, q measured from the middle of its sill: x its glass, y its stone, z which light
      vec3 esWin(vec2 q, float hw, float h, float n){
        float inX = 1. - smoothstep(hw - .02, hw + .02, abs(q.x)), inY = smoothstep(-.02, .02, q.y) * (1. - smoothstep(h - .02, h + .02, q.y));
        float outX = 1. - smoothstep(hw + .2, hw + .24, abs(q.x)), outY = smoothstep(-.22, -.18, q.y) * (1. - smoothstep(h + .26, h + .3, q.y));
        float lw = 2. * hw / n, lx = mod(q.x + hw, lw) - lw * .5;
        float bar = max(smoothstep(lw * .5 - .08, lw * .5 - .055, abs(lx)), 1. - smoothstep(.05, .075, abs(q.y - h * .66)));
        float inside = inX * inY;
        return vec3(inside * (1. - bar), max(outX * outY - inside, inside * bar), floor((q.x + hw) / lw));
      }
      void main(){
        vec3 n = normalize(vN);
        float kind = floor(vS.z + .5), a = vS.x, h = vS.y, span = vS.w, ao = 1., lx = a - span * .5, wn = 0.;
        vec3 v = normalize(cameraPosition - vW), alb, w = vec3(0.);
        if (kind > 2.5 && kind < 3.5) {
          float row = floor(h / .3);
          vec2 b = vec2(a / .26 + .5 * mod(row, 2.), h / .3), f = fract(b);
          alb = uSlate * (.78 + .4 * esH(floor(b))) * mix(.62, 1., smoothstep(0., .08, f.x) * smoothstep(0., .14, f.y));
          // lichen on the slates: ochre in patches, grey-white in spots
          alb = mix(alb, vec3(.42, .4, .2), smoothstep(.5, .8, esF(vW.xz * .35 + 5.)) * .5);
          alb = mix(alb, vec3(.56, .58, .5), smoothstep(.6, .8, esF(vW.xz * 1.1 + 11.)) * .35);
        } else if (kind > 3.5 && kind < 4.5) {
          vec2 b = vec2(a, h) / 1.1;
          b.x += .5 * mod(floor(b.y), 2.);
          vec2 f = fract(b);
          alb = uStone * 1.05 * (.86 + .2 * esH(floor(b))) * mix(.72, 1., smoothstep(0., .03, f.x) * smoothstep(0., .03, f.y));
        } else {
          alb = esAshlar(vec2(a, h));
          alb *= mix(1., .78, smoothstep(.45, .8, esF(vec2(a * .7, h * .12) + 2.)));
          alb = mix(alb, vec3(.5, .47, .3), smoothstep(.5, .8, esF(vec2(a, h) * .4 + 9.)) * .3 * (1. - smoothstep(1., 6., h)));
          ao = mix(.7, 1., smoothstep(0., 1.2, h));
          if (kind < .5) {
            float bay = 3.4, nw = max(1., floor((span - 1.2) / bay)), x = a - span * .5 + (nw - 1.) * .5 * bay;
            wn = clamp(floor(x / bay + .5), 0., nw - 1.);
            lx = x - wn * bay;
            w = esWin(vec2(lx, h - 2.7), 1., 2.8, 3.) + esWin(vec2(lx, h - 6.6), 1., 2.4, 3.);
            ao *= mix(.72, 1., smoothstep(0., 1.3, 10. - h));
          } else if (kind < 1.5) {
            w = esWin(vec2(lx, h - 2.5), 1.7, 3.1, 5.) + esWin(vec2(lx, h - 6.5), 1.7, 2.6, 5.) + esWin(vec2(lx, h - 11.6), .7, 1.7, 2.);
          } else if (kind > 4.5) {
            float arch = 2.3 + sqrt(max(0., .9 - lx * lx));
            float door = (1. - smoothstep(.93, .96, abs(lx))) * (1. - smoothstep(arch - .02, arch + .02, h));
            alb = mix(alb, uStone * 1.1, (1. - smoothstep(1.2, 1.24, abs(lx))) * (1. - smoothstep(arch + .28, arch + .32, h)));
            alb = mix(alb, uDoor * (.8 + .4 * esN(vec2(lx * 9., h * .7))) * (.75 + .25 * smoothstep(.0, .03, abs(fract(lx / .31) - .5))), door);
          }
          alb = mix(alb, uStone * 1.12, clamp(w.y, 0., 1.));
          // creeper and climbing roses on the walls that carry windows: they climb from the foot in patches of unlike
          // height along the house's length, keep off the glass and thin over the windows' stone
          if (kind < 1.5) {
            float cu = dot(vW.xz, vec2(-.865, .502)), reach = 1.5 + 9.5 * smoothstep(.42, .78, esF(vec2(cu * .055, 9.)));
            float cm = (1. - smoothstep(reach - 2., reach, h + (esF(vec2(cu, h) * .9) - .5) * 3.)) * smoothstep(.42, .56, esF(vec2(cu * .16, h * .16 + 4.)) + .22 * (1. - h / 12.));
            cm *= (1. - clamp(w.x, 0., 1.)) * (1. - .7 * clamp(w.y, 0., 1.));
            vec4 lfc = esCell(vec2(cu, h) / .3);
            vec3 leafC = mix(vec3(.035, .085, .03), vec3(.11, .2, .065), lfc.z) * mix(.55, 1., smoothstep(0., .14, lfc.w));
            vec4 rs = esCell(vec2(cu, h) / .8 + 7.);
            float rose = (1. - smoothstep(.12, .2, length(rs.xy))) * step(.62, rs.z) * (1. - smoothstep(5., 8.5, h));
            leafC = mix(leafC, mix(vec3(.95, .9, .74), vec3(.94, .68, .72), step(.8, rs.z)), rose);
            alb = mix(alb, leafC, cm);
            ao *= mix(1., .86, cm);
          }
        }
        vec3 c = esLight(alb, n, vW, ao, 0.);
        // GLASS, in leaded lights: behind it the dark of the room, and in some lights a blind half drawn, which stands in
        // the room's shade (a dim cloth seen through the glass, never a lit patch); on it the sky, mirrored by the angle
        // of sight (little of it seen square on, most of it along the wall); over all of it the leading; and the sun's
        // flash only in the quarries that throw it at the eye (each quarry of a leaded light lies a little its own way)
        float gl = clamp(w.x, 0., 1.);
        if (gl > .001) {
          vec4 pl = esPlace(vW);
          vec2 qa = vec2((lx + h) / .19, (lx - h) / .19), tip = esH2(floor(qa) + wn * 17.) - .5;
          vec3 nq = normalize(n + vec3(tip.x, tip.y, -tip.x) * .05), r = reflect(-v, nq);
          float fres = .1 + .7 * pow(1. - clamp(dot(n, v), 0., 1.), 3.);
          float hb = esH(vec2(wn * 3.1 + floor(h / 4.) * 7.3 + w.z, floor(span * 3.)));
          float top = h < 6. ? 5.5 : 9.;
          vec3 room = mix(vec3(.02, .024, .03), vec3(.62, .58, .48) * (uSkyCol + uSunCol * .25) * .035, step(.6, hb) * smoothstep(top - 2.6 * hb, top - 2.6 * hb + .04, h));
          vec3 g = mix(room, mix(uGndCol, uSkyCol, smoothstep(-.1, .3, r.y)) * .45, fres);
          float lead = max(smoothstep(.4, .5, abs(fract(qa.x) - .5)), smoothstep(.4, .5, abs(fract(qa.y) - .5)));
          g *= 1. - .55 * lead;
          g += uSunCol * (.5 * pow(clamp(dot(r, uSunDir), 0., 1.), 500.) * esSun(vW, pl));
          c = mix(c, g, gl);
        }
        gl_FragColor = vec4(esFog(c, vW), 1.);
      }`})}async function vt(u){const{ctx:p,scene:D,R:e,U:r,PM:w}=u,L=_,P=ut(L),{smoke:f,piers:z}=pt(P,L,e.house),W=L.houseLength/2,b=L.houseDepth/2,S=new I.Mesh(P.geometry(),mt(r));D.add(S);for(let l=-W;l<=W;l+=2)for(let o=-b;o<=b+1.6;o+=2){const a=P.W(l,0,o);w.raise(a[0],a[2],L.groundLawn+10+5*(1-Math.min(1,Math.abs(o)/b)),1.5)}for(const l of[-27,27])for(let o=-b-22;o<-b;o+=2)for(let a=l-5;a<=l+5;a+=2.5){const n=P.W(a,0,o);w.raise(n[0],n[2],L.groundLawn+9+5*(1-Math.abs(a-l)/5),1.5)}return await p.yield(),gt({...u,house:S,smoke:f,piers:z,masonry:P,plain:Ge(r)})}async function gt(u){const{ctx:p,scene:D,R:e,Lo:r,PM:w,floraMat:L}=u,P=_,f=new I.Group;D.add(f);const z=r.tables,W=e["cedar-places"],b=P.houseLength/2,S=P.houseDepth/2+12,l=[],o=[],a=[],n=(B,y)=>{const c=z.B+Math.round(B),i=z.X[c+2]-z.X[c],v=z.Z[c+2]-z.Z[c],C=Math.hypot(i,v)||1;return[z.X[c]+v/C*y,z.Z[c]-i/C*y]},h=(B,y)=>{const c=r.toValley(B,y),i=(B-P.houseCentre[0])*P.houseAxis[0]+(y-P.houseCentre[1])*P.houseAxis[1],v=(B-P.houseCentre[0])*P.houseFront[0]+(y-P.houseCentre[1])*P.houseFront[1],C=Math.hypot(Math.max(0,Math.abs(i)-b-3),Math.max(0,Math.abs(v)-S));return r.lawnIn(B,y)>.9&&r.seaFall(c[0],c[1])<.02&&c[0]<r.headS-12&&r.routeDist(B,y)>=26&&C>=30&&a.every(N=>Math.hypot(N[0]-B,N[1]-y)>=50)};for(const[B,y]of[[u.M.west,u.M.turn],[u.M.onFront,u.M.houseW],[u.M.houseW,u.M.holdEnd]])for(let c=0;c<12;c++){const i=n(W.range(B,y),W.range(26,46));if(h(i[0],i[1])){a.push(i);break}}for(let B=0;B<a.length;B++){const y=a[B],c=y[0],i=y[1],v=e["cedar-shapes"].range(22,26),C=r.ground(c,i);l.push(ne.pineGeometry({rng:e["cedar-shapes"],height:v,detail:2,leaf:"#2a5a48",leafLight:"#4f8a66",leafDark:"#173a30",bark:"#6a5a50"})),o.push({x:c,y:C-.2,z:i,s:1.5,sy:1,rot:e["cedar-shapes"].range(0,U),v:B,c:0}),w.dome(c,i,14,C+v,C+v*.5),await p.yield()}ue(L,l,o,f),await p.yield();const s=[-35,-100],g=P.houseAxis,t=P.houseFront,m=(B,y)=>[s[0]+g[0]*B+t[0]*y,s[1]+g[1]*B+t[1]*y],k=Re(r,P,u.lawnShade),A=(s[0]-P.houseCentre[0])*g[0]+(s[1]-P.houseCentre[1])*g[1],d=(s[0]-P.houseCentre[0])*t[0]+(s[1]-P.houseCentre[1])*t[1],x=(B,y,c,i)=>k.hedge(A+B,A+y,d+c,d+i,1.5,[.1,.2,.09],[[0,0],[.08,.72],[.3,1]]);for(const B of[-1,1])x(-20,-2,B*15-.5,B*15+.5),x(2,20,B*15-.5,B*15+.5),x(B*20-.5,B*20+.5,-15,-2),x(B*20-.5,B*20+.5,2,15);f.add(k.mesh(u.plain));const M=["#f3e6c8","#f2c4c0"].map(B=>ne.bushGeometry({rng:e.roses,size:1.25,detail:0,flowers:.9,flowerColor:B,leaf:"#2f6a30"})),F=[];for(let B=-17.5;B<=17.5;B+=2.9)for(let y=-12.5;y<=12.5;y+=2.9){const c=e.roses.range(-.5,.5),i=e.roses.range(-.5,.5),v=e.roses.chance(.5)?0:1,C=e.roses.range(.8,1.15),N=e.roses.range(0,U);if(Math.abs(B+c)<2||Math.abs(y+i)<2)continue;const q=m(B+c,y+i);F.push({x:q[0],y:r.ground(q[0],q[1])-.05,z:q[1],s:C,rot:N,v,c:0})}return ue(L,M,F,f),await p.yield(),await wt(u,f),await p.yield(),yt({...u,lawn:f})}async function wt(u,p){const{ctx:D,R:e,Lo:r,PM:w,floraMat:L,plain:P,piers:f}=u,z=_,W=z.houseLength/2,b=z.houseDepth/2+12,S=z.frontDistance,l=Re(r,z,u.lawnShade),o=[.085,.16,.085],a=[.12,.24,.09],n=[.5,.48,.42],h=(i,v,C)=>{l.turned(i,v,[[1.05*C,0],[1.1*C,.5*C],[.82*C,1.6*C],[.42*C,2.7*C],[.02,3.5*C]],10,o);const N=l.at(i,v);w.raise(N[0],N[1],z.groundLawn+3*C,1)},s=S+15,g=S+16.5;for(const i of[-1,1]){const v=7*i,C=(W-2)*i;l.hedge(Math.min(v,C),Math.max(v,C),s,g,1.9,o);for(let N=12.5;N<W-3;N+=11)l.hedge(N*i-.9,N*i+.9,s-.25,g+.25,3,o,[[0,0],[.1,.62],[.82,1]]);l.hedge(Math.min(C,C+1.5*i),Math.max(C,C+1.5*i),s-6,s,1.9,o);for(let N=7;N<=W-2;N+=2){const q=l.at(N*i,s+.75);w.raise(q[0],q[1],z.groundLawn+1.9,1)}h(7*i,s+.75,1.1),h(5.9*i,b+4.2,.9),h((W+5.2)*i,b+1.6,1)}const t=r.tables;for(let i=u.M.west+20;i<u.M.turn-4;i+=14){const v=t.B+Math.round(i),C=t.X[v+2]-t.X[v],N=t.Z[v+2]-t.Z[v],q=Math.hypot(C,N);for(const G of[-1,1]){const R=t.X[v]+N/q*G*7.5-z.houseCentre[0],H=t.Z[v]-C/q*G*7.5-z.houseCentre[1];h(R*z.houseAxis[0]+H*z.houseAxis[1],R*z.houseFront[0]+H*z.houseFront[1],.85)}}const m=S+10.5;l.turned(0,m,[[1,0],[1,.14],[.72,.14],[.72,.28],[.24,.3],[.17,.52],[.2,.98],[.36,1.04],[.36,1.1],[.01,1.1]],12,n),l.box(-.03,.03,m-.26,m+.2,.28,[.2,.24,.2],1.08);const k=new Set;for(const i of f){const v=Math.round(i[0]*4)+":"+Math.round(i[1]*4);k.has(v)||(k.add(v),l.turned(i[0],i[1],[[.17,0],[.11,.1],[.12,.2],[.3,.42],[.33,.58],[.27,.62],[.01,.62]],8,n,i[2]),l.turned(i[0],i[1],[[.2,.56],[.33,.72],[.34,.92],[.2,1.1],[.01,1.14]],8,a,i[2]))}p.add(l.mesh(P)),await D.yield();const A=["#6f74d8","#f4f1e6","#f0b4c8"].map(i=>ne.bushGeometry({rng:e.border,size:1,detail:0,flowers:3,flowerColor:i,leaf:"#3a7434"})),d=[];for(const[i,v]of[[b+.9,0],[b+2,.6]])for(let C=-W-3+v;C<=W+3;C+=1.6){const N=e.border.range(-.3,.3),q=e.border.range(-.25,.25),G=Math.floor(e.border()*3),R=e.border.range(.55,1)*(v?.8:1.1),H=e.border.range(0,U);if(Math.abs(C+N)<5.3)continue;const X=l.at(C+N,i+q);d.push({x:X[0],y:r.ground(X[0],X[1])-.05,z:X[1],s:R,rot:H,v:G,c:0})}ue(L,A,d,p),await D.yield();const x=e["flower-border"],M=[["#6f74d8",-.5,.12,.95],["#f4f1e6",-.15,-.2,.6],["#ee8fb4",.2,.16,.75],["#f0c23a",.52,-.12,.5]],F=[0,1].map(()=>xt(M.map(([i,v,C,N])=>[ne.flowerGeometry({rng:x,color:i,cards:2,width:.8,height:N,root:"#2c5a26"}),v+x.range(-.08,.08),C+x.range(-.08,.08)]))),B=[],y=(i,v,C)=>{B.push({x:i,y:r.ground(i,v)-.03,z:v,s:x.range(.9,1.2),rot:C+(x.chance(.5)?Math.PI:0),v:x.chance(.5)?0:1,c:0}),u.lawnShade.bed(i,v,.75)};for(let i=u.M.west+10;i<u.M.turn-2;i+=1.25){const v=t.B+Math.round(i),C=t.X[v+2]-t.X[v],N=t.Z[v+2]-t.Z[v],q=Math.hypot(C,N);for(const G of[-1,1]){const R=G*(3.4+x.range(-.12,.12));y(t.X[v]+N/q*R,t.Z[v]-C/q*R,Math.atan2(-N,C))}}await D.yield();for(let i=0,v=0,C=r.sweep;i<C.length-1;i++){const N=C[i+1][0]-C[i][0],q=C[i+1][1]-C[i][1],G=Math.hypot(N,q);for(;v<G;v+=1.25)for(const R of[-1,1]){const H=R*(3.4+x.range(-.12,.12)),X=C[i][0]+N/G*v+q/G*H,O=C[i][1]+q/G*v-N/G*H;Math.hypot(X-r.forecourt[0],O-r.forecourt[1])>r.forecourt[2]+3&&r.drive(X,O,u.da)[0]>3.2&&r.routeDist(X,O)>3.2&&y(X,O,Math.atan2(-q,N))}v-=G}for(let i=-W-3;i<=W+3;i+=1.25){if(Math.abs(i)<5.6)continue;const v=l.at(i+x.range(-.15,.15),b+3.1+x.range(-.12,.12));y(v[0],v[1],Math.atan2(-z.houseAxis[1],z.houseAxis[0]))}for(const i of d)u.lawnShade.bed(i.x,i.z,.8);await D.yield();const c=(i,v,C,N)=>{for(let q=-3.6;q<=3.61;q+=1.2)for(const G of[-.75,.75]){const R=q+x.range(-.25,.25),H=G+x.range(-.2,.2);y(i+C*R-N*H,v+N*R+C*H,Math.atan2(-N,C))}for(let q=-3.2;q<=3.21;q+=.8)u.lawnShade.bed(i+C*q,v+N*q,1.7)};for(let i=u.M.west+27;i<u.M.turn-12;i+=28){const v=t.B+Math.round(i),C=t.X[v+2]-t.X[v],N=t.Z[v+2]-t.Z[v],q=Math.hypot(C,N);for(const G of[-1,1])c(t.X[v]+N/q*G*14,t.Z[v]-C/q*G*14,C/q,N/q)}for(const i of[-31,-15,15,31]){const v=l.at(i,S+8);c(v[0],v[1],z.houseAxis[0],z.houseAxis[1])}for(let i=u.M.houseW+12;i<u.M.holdEnd;i+=20){const v=t.B+Math.round(i),C=t.X[v+2]-t.X[v],N=t.Z[v+2]-t.Z[v],q=Math.hypot(C,N),G=t.X[v]-N/q*12,R=t.Z[v]+C/q*12,H=r.toValley(G,R);r.lawnIn(G,R)>.9&&r.seaFall(H[0],H[1])<.02&&H[0]<r.headS-6&&c(G,R,C/q,N/q)}await D.yield(),ue(L,F,B,p),await D.yield(),u.lawnShade.bake()}function bt(u){const L=new Uint8Array(748800),P=new I.DataTexture(L,520,360,I.RGBAFormat);P.magFilter=P.minFilter=I.LinearFilter,P.wrapS=P.wrapT=I.ClampToEdgeWrapping,P.generateMipmaps=!1;const f=Math.hypot(u.x,u.z)||1,z=Math.min(f/Math.max(u.y,.05),5),W=-u.x/f*z,b=-u.z/f*z,S=(o,a,n,h)=>{if(o>0&&a>0&&o<519&&a<359){const s=(a*520+o)*4+n;h>L[s]&&(L[s]=h)}},l=(o,a,n,h,s)=>{for(let g=Math.floor((a- -140)/.5);g<=Math.ceil((h- -140)/.5);g++)for(let t=Math.floor((o- -215)/.5);t<=Math.ceil((n- -215)/.5);t++)s(-215+(t+.5)*.5,-140+(g+.5)*.5,t,g)};return{tex:P,box:[-215,-140,1/(520*.5),1/(360*.5)],round(o,a,n,h){const s=W*h,g=b*h,t=s*s+g*g||1,m=n+1.6;l(Math.min(o,o+s)-m,Math.min(a,a+g)-m,Math.max(o,o+s)+m,Math.max(a,a+g)+m,(k,A,d,x)=>{const M=oe(((k-o)*s+(A-a)*g)/t,0,1),F=Math.hypot(k-o-s*M,A-a-g*M)-n*(1-M),B=Math.hypot(k-o,A-a)-n;S(d,x,0,255*oe(.5-F/.5,0,1)),S(d,x,1,255*oe(1-B/1.3,0,1))})},block(o,a){const n=Math.hypot(o[1][0]-o[0][0],o[1][1]-o[0][1]),h=Math.hypot(o[3][0]-o[0][0],o[3][1]-o[0][1]),s=[(o[1][0]-o[0][0])/n,(o[1][1]-o[0][1])/n],g=[(o[3][0]-o[0][0])/h,(o[3][1]-o[0][1])/h],t=W*a,m=b*a,k=t*s[0]+m*s[1],A=t*g[0]+m*g[1],d=o.flatMap(F=>[F[0],F[0]+t]),x=o.flatMap(F=>[F[1],F[1]+m]),M=(F,B,y)=>Math.abs(y)<1e-6?F>=0&&F<=B?[0,1]:[1,0]:y>0?[(F-B)/y,F/y]:[F/y,(F-B)/y];l(Math.min(...d)-1.6,Math.min(...x)-1.6,Math.max(...d)+1.6,Math.max(...x)+1.6,(F,B,y,c)=>{const i=(F-o[0][0])*s[0]+(B-o[0][1])*s[1],v=(F-o[0][0])*g[0]+(B-o[0][1])*g[1],C=M(i,n,k),N=M(v,h,A);Math.max(C[0],N[0],0)<=Math.min(C[1],N[1],1)&&S(y,c,0,255),S(y,c,1,255*oe(1-Math.hypot(Math.max(-i,i-n,0),Math.max(-v,v-h,0))/1.3,0,1))})},bed(o,a,n){l(o-n-1,a-n-1,o+n+1,a+n+1,(h,s,g,t)=>S(g,t,2,255*oe((n-Math.hypot(h-o,s-a))/.5+.5,0,1)))},bake(){const o=L.slice();for(let a=1;a<359;a++)for(let n=1;n<519;n++){const h=(a*520+n)*4;let s=0;for(let g=-1;g<=1;g++)for(let t=-1;t<=1;t++)s+=o[h+(g*520+t)*4];L[h]=s/9}P.needsUpdate=!0}}}function xt(u){const p=new I.BufferGeometry,D=[];let e=0;for(const r of Object.keys(u[0][0].attributes)){const w=u[0][0].attributes[r].itemSize,L=[];for(const[P,f,z]of u){const W=P.attributes[r].array;for(let b=0;b<W.length;b++)L.push(W[b]+(r==="position"?b%3===0?f:b%3===2?z:0:0))}p.setAttribute(r,new I.Float32BufferAttribute(L,w))}for(const[r]of u){for(const w of r.index.array)D.push(w+e);e+=r.attributes.position.count}return p.setIndex(D),p.computeBoundingBox(),p.computeBoundingSphere(),p}function Re(u,p,D){const e=[],r=[],w=[],L=[],P=p.houseCentre,f=p.houseAxis,z=p.houseFront,W=(S,l)=>[P[0]+f[0]*S+z[0]*l,P[1]+f[1]*S+z[1]*l],b=(S,l,o,a,n,h,s)=>{e.push(S,l,o),r.push(a,n,h),w.push(s[0],s[1],s[2])};return{at:W,box(S,l,o,a,n,h,s){const g=[W(S,o),W(l,o),W(l,a),W(S,a)],t=[[0,-1],[1,0],[0,1],[-1,0]],m=A=>s===void 0?u.ground(A[0],A[1])-.1:p.groundLawn+s;s===void 0&&D&&D.block(g,n);for(let A=0;A<4;A++){const d=g[A],x=g[(A+1)%4],M=e.length/3,F=f[0]*t[A][0]+z[0]*t[A][1],B=f[1]*t[A][0]+z[1]*t[A][1];b(d[0],m(d),d[1],F,.15,B,h),b(x[0],m(x),x[1],F,.15,B,h),b(x[0],m(x)+n,x[1],F,.4,B,h),b(d[0],m(d)+n,d[1],F,.4,B,h),L.push(M,M+2,M+1,M,M+3,M+2)}const k=e.length/3;for(const A of g)b(A[0],m(A)+n,A[1],0,1,0,h);L.push(k,k+2,k+1,k,k+3,k+2)},hedge(S,l,o,a,n,h,s=[[0,0],[.14,.7],[.42,1]]){const g=[[0,-1],[1,0],[0,1],[-1,0]],t=s.map(([d,x])=>[[S+d,o+d],[l-d,o+d],[l-d,a-d],[S+d,a-d]].map(M=>{const F=W(M[0],M[1]);return[F[0],F[1],x*n]})),m=t[0].map(d=>u.ground(d[0],d[1])-.1);D&&D.block(t[0],n);for(let d=0;d<s.length-1;d++)for(let x=0;x<4;x++){const M=t[d][x],F=t[d][(x+1)%4],B=t[d+1][x],y=t[d+1][(x+1)%4],c=e.length/3,i=s[d+1][0]-s[d][0],v=(s[d+1][1]-s[d][1])*n,C=Math.hypot(i,v)||1,N=(f[0]*g[x][0]+z[0]*g[x][1])*v/C,q=(f[1]*g[x][0]+z[1]*g[x][1])*v/C;b(M[0],m[x]+M[2],M[1],N,i/C,q,h),b(F[0],m[(x+1)%4]+F[2],F[1],N,i/C,q,h),b(y[0],m[(x+1)%4]+y[2],y[1],N,i/C,q,h),b(B[0],m[x]+B[2],B[1],N,i/C,q,h),L.push(c,c+2,c+1,c,c+3,c+2)}const k=e.length/3;t[s.length-1].forEach((d,x)=>b(d[0],m[x]+d[2],d[1],0,1,0,h)),L.push(k,k+2,k+1,k,k+3,k+2)},turned(S,l,o,a,n,h){const s=W(S,l),g=h===void 0?u.ground(s[0],s[1])-.05:p.groundLawn+h,t=e.length/3;h===void 0&&D&&D.round(s[0],s[1],Math.max(...o.map(m=>m[0])),o[o.length-1][1]);for(let m=0;m<o.length;m++){const k=o[Math.max(m-1,0)],A=o[Math.min(m+1,o.length-1)],d=A[1]-k[1],x=A[0]-k[0],M=Math.hypot(d,x)||1;for(let F=0;F<=a;F++){const B=F/a*U;b(s[0]+Math.cos(B)*o[m][0],g+o[m][1],s[1]+Math.sin(B)*o[m][0],Math.cos(B)*d/M,-x/M,Math.sin(B)*d/M,n)}}for(let m=0;m<o.length-1;m++)for(let k=0;k<a;k++){const A=t+m*(a+1)+k,d=A+a+1;L.push(A,d,A+1,A+1,d,d+1)}},mesh(S){const l=new I.BufferGeometry;return l.setAttribute("position",new I.Float32BufferAttribute(e,3)),l.setAttribute("normal",new I.Float32BufferAttribute(r,3)),l.setAttribute("color",new I.Float32BufferAttribute(w,3)),l.setIndex(L),new I.Mesh(l,S)}}}async function yt(u){const{ctx:p,scene:D,R:e,Lo:r,U:w,heavy:L,density:P,lead:f,floraMat:z}=u,W=new I.Group;D.add(W);const b={white:["#f4f1e6","#fff8e0"],gold:["#f0c23a","#f6dc7a"],salmon:["#f09a78","#f6bca0"],pink:["#f2c0cc","#f8dce2"]},S=[f].concat(Object.keys(b).filter(d=>d!==f)),l=S.map(()=>[[],[],[],[],[]]),o=7,a=[{off:[9.8,12.8],h:[1.5,2.2],step:5},{off:[14.2,17.8],h:[2.2,3],step:6.5},{off:[19.5,24.7],h:[3,4],step:8},{off:[29,34.2],h:[3.4,4],step:10}];let n=0;const h=async(d,x,M,F,B)=>{for(let y=F+d.range(0,M.step);y<B;y+=M.step*d.range(.8,1.25)/P){const c=d.range(M.h[0],M.h[1])*(L?1.08:1),i=d.range(1.25,1.6),v=d.range(0,U),C=d.range(-1,1.4),N=d(),q=N*7.31%1,G=q<.2?$(3,4,q/.2):q>.8?c*.55:c,R=G*(q<.2?1.05:q>.8?i*1.5:i),H=M.off[x>0?1:0]+C,X=r.fromValley(y,r.lr(y)+x*H),O=R*.9,V=r.routeDist(X[0],X[1]);if(V-R*.5<o||x>0&&H-R*.5<r.streamAt(y)-r.lr(y)+1.3)continue;const K=await Se({line:[[X[0]-Math.cos(v)*O/2,X[1]-Math.sin(v)*O/2],[X[0]+Math.cos(v)*O/2,X[1]+Math.sin(v)*O/2]],side:0,rng:u.fork((d===e.azaleas?"azalea-":"azalea-head-")+l.flat(2).length),heavy:L,uvOffset:l.flat(2).length*23,groundAt:r.ground,chunk:999,cell:.9,rows:12,thick:()=>R,domeHalf:[O,O],domeHigh:[G,G],lean:0,lumps:1.2,lumpAmp:.3,feet:[.15,.6],perM2:1.7,leafM2:.25,headSize:[.26,.46],thin:d===e.azaleas?e["thin-azaleas"]:e["thin-head"],lineDist:r.routeDist,headNear:12,headFar:22},null);let T=V;const Z=(V-o)*(V-o);V-R<o&&K.eachVertex((E,Q,j)=>{T>=o&&(E-X[0])*(E-X[0])+(j-X[1])*(j-X[1])>Z&&(T=Math.min(T,r.routeDist(E,j)))}),++n%12===0&&await p.yield(),!(T<o)&&l[N<.46?0:N<.64?1:N<.82?2:3][y<0?0:1+Math.min(3,Math.floor(y/52))].push(K)}};for(const d of[1,-1])for(const x of a)await h(e.azaleas,d,x,8,209);for(const d of[1,-1])for(const x of a)await h(e["azaleas-head"],d,x,r.headS,8);Be(l.flat(2).flatMap(d=>d.chunks),36*(209-r.headS));const s=[];for(let d=0;d<S.length;d++){const x=S[d],M=l[d].filter(y=>y.length);if(!M.length)continue;const B=We(w,{red:b[x][0],rose:b[x][1],redGain:.8,through:.7,through2:b[x][1],leaf:"#3f6e34",full:1.25,headR:.5,heavy:L,bush:!0}).assemble({chunks:M.flatMap(y=>Le(y).chunks)});W.add(B.group),s.push(B),await p.yield()}await p.yield();const g=[0,1,2].map(d=>ne.birchGeometry({rng:e.birches,height:12.5+d*1.6,detail:1})).concat([0,1].map(d=>ne.birchGeometry({rng:e.birches,height:13+d*2.5,detail:0}))),t=[];await p.yield();const m=g.map(d=>{const x=d.attributes.position;let M=0,F=0;for(let B=0;B<x.count;B++)M=Math.max(M,Math.hypot(x.getX(B),x.getZ(B))),F=Math.max(F,x.getY(B));return[M,F]}),k=(d,x,M)=>{const F=d.range(x,M),B=d.chance(.5)?1:-1,y=7.5+40*Math.pow(d(),1.3),c=d(),i=d.range(.9,1.12),v=d.range(0,U),C=d.range(-.05,.05),N=r.fromValley(F,r.lr(F)+B*y),q=y<22?Math.floor(c*3):3+Math.floor(c*2);return Math.abs(B*y-(r.streamAt(F)-r.lr(F)))<1.6?null:r.routeDist(N[0],N[1])<o+(m[q][0]+Math.abs(C)*m[q][1])*i?0:{x:N[0],y:r.ground(N[0],N[1])-.15,z:N[1],s:i,rot:v,v:q,c:F<0?0:1+Math.min(3,Math.floor(F/52)),lz:C}},A=(d,x,M,F)=>{for(let B=0;B<x;B++){let y=k(d,M,F);for(let c=0;y===0&&c<4;c++)y=k(e["birches-again"],M,F);y&&t.push(y)}};return A(e.birches,Math.round(60*P),-4,210),A(e["birches-head"],Math.round(9*P),r.headS,-4),await p.yield(),ue(z,g,t,W),await p.yield(),Ct({...u,valley:W,azaleas:s})}function Ge(u,p){return new I.ShaderMaterial({uniforms:u,fog:!1,vertexColors:!0,defines:p?{ROCK:1}:{},vertexShader:`varying vec3 vW, vN, vC;
      void main(){
        vec4 p = vec4(position, 1.);
        #ifdef USE_INSTANCING
          p = instanceMatrix * p;
          vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
        #else
          vN = normalize(mat3(modelMatrix) * normal);
        #endif
        vec4 wp = modelMatrix * p; vW = wp.xyz; vC = color; gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:ae+`
      varying vec3 vW, vN, vC;
      void main(){
        vec3 n = normalize(vN);
        float g = esN(vW.xz * 3.1 + vW.y * 2.3) * .5 + esN(vW.xz * 11. + vW.y * 7.) * .5;
        vec3 alb = vC * (.72 + .5 * g);
        // clipped yew and box (the green tints): a grain of small leaves in world metres, lighter where the shears left
        // the young growth on top
        float clip = step(vC.r * 1.4, vC.g), lv = esN(vW.xz * 23. + vW.y * 17.) * .6 + esN(vW.xz * 47. - vW.y * 31.) * .4, lv2 = esN(vW.xz * 1.3 + vW.y * .9);
        alb *= mix(1., (.7 + .6 * lv) * (.85 + .3 * lv2) * mix(.9, 1.3, clamp(n.y, 0., 1.)), clip);
        // wet and dark where the sea reaches
        alb *= mix(vec3(.55, .6, .62), vec3(1.), smoothstep(.3, 1.6, vW.y));
        vec3 c = esLight(alb, n, vW, .6 + .4 * clamp(n.y * .5 + .5, 0., 1.), .15);
        #ifdef ROCK
          // a boulder: beds a hand or two thick with dark partings, pale lichen above the splash, dark weed at the water;
          // the light off the sea on its shaded side
          float bedY = vW.y * 1.7 + dot(vW.xz, vec2(.09, .05)) + esN(vW.xz * .3) * .8;
          alb *= mix(.55, 1., smoothstep(0., .14, abs(fract(bedY) - .5))) * mix(vec3(1.1, 1.02, .9), vec3(.88, .93, 1.), esH(vec2(floor(bedY + .5), 5.)));
          alb = mix(alb, vec3(.6, .58, .4), smoothstep(.55, .75, esF(vW.xz * .7 + vW.y * .4)) * smoothstep(1.4, 3.5, vW.y) * .5);
          alb = mix(alb, vec3(.05, .065, .04), (1. - smoothstep(.35, 1.1, vW.y + (g - .5) * .5)) * .75);
          c = esLight(alb, n, vW, .6 + .4 * clamp(n.y * .5 + .5, 0., 1.), .15);
          c += alb * (uSkyCol + uSunCol * .12) * (.14 * clamp(.6 - dot(n, uSunDir), 0., 1.));
        #endif
        gl_FragColor = vec4(esFog(c, vW), 1.);
      }`})}function Mt(u,p){const D=[],e=[],r=[];p.forEach((P,f)=>{const z=D.length/3,W=P.r*1.9+1.2;for(const[b,S]of[[-1,-1],[1,-1],[1,1],[-1,1]])D.push(P.x+b*W,.16,P.z+S*W),e.push(b,S,P.r/W,f*1.7);r.push(z,z+2,z+1,z,z+3,z+2)});const w=new I.BufferGeometry;w.setAttribute("position",new I.Float32BufferAttribute(D,3)),w.setAttribute("aRing",new I.Float32BufferAttribute(e,4)),w.setIndex(r);const L=new I.Mesh(w,new I.ShaderMaterial({uniforms:u,fog:!1,transparent:!0,depthWrite:!1,vertexShader:"attribute vec4 aRing; varying vec4 vR; varying vec3 vW; void main(){ vR = aRing; vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }",fragmentShader:ae+`
      varying vec4 vR; varying vec3 vW;
      void main(){
        float d = length(vR.xy), breathe = .5 + .5 * sin(uTime * .9 + vR.w);
        float band = smoothstep(vR.z * .75, vR.z, d) * (1. - smoothstep(vR.z + .12 + .3 * breathe, 1., d));
        float lace = smoothstep(.35, .6, esN(vW.xz * 2.3 + vec2(uTime * .3, vR.w)) * .6 + esN(vW.xz * 6.1 - vec2(0., uTime * .5)) * .4 + .25 * band);
        vec3 c = vec3(.95, .97, 1.) * (uSkyCol * .6 + uSunCol * .3 * esCloudShade(vW)) * .3183;
        gl_FragColor = vec4(esFog(c, vW), band * lace * .9);
      }`}));return L.renderOrder=2,L.name="surf",L}function kt(u,p=1){const D=new I.IcosahedronGeometry(1,p),e=D.attributes.position,r=new Float32Array(e.count*3),w=[u.range(0,9),u.range(0,9),u.range(0,9)];for(let f=0;f<e.count;f++){const z=e.getX(f),W=e.getY(f),b=e.getZ(f),S=1+.28*Math.sin(z*2.1+w[0])*Math.sin(W*2.7+w[1])+.2*Math.sin(b*3.3+w[2]+z);e.setXYZ(f,z*S,W*S*.72,b*S);const l=.36+.1*Math.sin(w[0]+f);r[f*3]=l,r[f*3+1]=l*.97,r[f*3+2]=l*.92}D.setAttribute("color",new I.BufferAttribute(r,3));const L=D.attributes.normal,P=new I.Vector3;for(let f=0;f<e.count;f++)P.set(e.getX(f),e.getY(f)/.52,e.getZ(f)).normalize(),L.setXYZ(f,P.x,P.y,P.z);return D}function zt(u,p,D){const w=_.valleyAxis,L=14,P=236,f=(g,t)=>{const m=p.fromValley(g,p.streamAt(g)+t);return D(m[0],m[1])},z=[],W=[],b=[],S=[],l=[];for(let g=L-1;g<=P+1;g+=.5)z.push(Math.min(f(g,-.6),f(g,-.3),f(g,0),f(g,.3),f(g,.6)));for(let g=L,t=2;g<=P;g++,t+=2)W.push(Math.max(z[t-1],z[t],z[t+1])+Math.max(.05,.4*(Math.min(f(g,2.1),f(g,-2.1))-z[t])));W[W.length-1]=Math.max(W[W.length-1],.2);for(let g=W.length-2;g>=0;g--)W[g]=Math.max(W[g],W[g+1]);W.forEach((g,t)=>{const m=L+t,k=p.pool(m);for(let A=0;A<=6;A++){const d=(A/6*2-1)*1.5,x=p.fromValley(m,p.streamAt(m)+d);b.push(x[0],g,x[1]),S.push(d,m,k)}if(t)for(let A=0;A<6;A++){const d=t*7+A,x=d-6-1;l.push(x,d,x+1,x+1,d,d+1)}});const o=new I.BufferGeometry;o.setAttribute("position",new I.Float32BufferAttribute(b,3)),o.setAttribute("aBrook",new I.Float32BufferAttribute(S,3)),o.setIndex(l),o.computeBoundingSphere();const a=[];for(let g=0;g<36;g++)a.push(new I.Vector3(-999,0,.5));const n={...u,uAxes:{value:new I.Vector4(w[0],w[1],w[1],-w[0])},uStones:{value:a},uFalls:{value:new I.Vector3(...p.falls)}},h=new I.ShaderMaterial({uniforms:n,fog:!1,transparent:!0,depthWrite:!1,side:I.DoubleSide,vertexShader:`
      attribute vec3 aBrook; varying vec3 vW, vB;
      void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vB = aBrook; gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:ae+Ae+`
      // uAxes: the valley's axis (x, z) and its left (x, z); uStones: metres down the axis, metres left of the brook's
      // middle, radius; uFalls: the three falls' metres down the axis. vB: metres left of the middle, metres down the
      // axis, 1 along the pool
      uniform vec4 uAxes; uniform vec3 uStones[36], uFalls;
      varying vec3 vW, vB;
      void main(){
        vec2 p = vW.xz; float a = vB.x, s = vB.y, t = uTime;
        // (the water's edge wanders as the banks' line does: the same number as the ground's)
        float bz = abs(a) + (esN(p * 1.1 + 3.) - .5) * .3;
        // dn: the water's depth as a share of its depth mid-stream (the bed's own section), 0 at its edge
        float dn = clamp(1. - smoothstep(.5, 2.1, bz) * 2.5, 0., 1.);
        float al = smoothstep(0., .25, dn) * smoothstep(14., 20., s) * (1. - smoothstep(232., 236., s));
        if (al <= 0.) discard;
        // where it breaks: the falls, and the stones of the rows
        float brk = 0.;
        for (int k = 0; k < 3; k++) { float d = s - uFalls[k]; brk = max(brk, smoothstep(-.5, -.2, d) * (1. - smoothstep(.9, 4.2, d))); }
        for (int k = 0; k < 36; k++) {
          vec3 st = uStones[k]; float d = s - st.x, r = st.z, w = r * (.8 + .3 * max(d, 0.));
          brk = max(brk, smoothstep(-r - .25, -r * .5, d) * (1. - smoothstep(r * .5, r + 2.2, d)) * (1. - smoothstep(w * .6, w, abs(a - st.y))));
        }
        float lace = esN(vec2(a * 4.5, (s - t * 2.3) * 1.5)) * .6 + esN(vec2(a * 11. + 5., (s - t * 3.) * 3.3)) * .4;
        float white = smoothstep(.95 - .75 * brk, 1.15 - .75 * brk, lace) * smoothstep(0., .15, brk);
        // flow lines (their slope across the run) and wavelets (their slope along it): the middle runs faster
        vec2 qm = vec2(a * 6.5 + .5 * sin(s * .45), s * .42 - t * .62), qe = vec2(a * 9. + 4., s * .6 - t * .3);
        float slA = mix(esN(qe + vec2(.04, 0.)) - esN(qe - vec2(.04, 0.)), esN(qm + vec2(.04, 0.)) - esN(qm - vec2(.04, 0.)), dn) * 1.3;
        // (the wavelets run askew of the bed, two sets crossing, so no patch of them lies square to the run)
        vec2 qw = vec2(a * 2.3 + s * .8 + 1.7, s * 3.4 - t * 2.4), qv = vec2(a * 3.9 - s * 1.3 + 8., s * 5.3 - t * 3.4);
        float slS = (esN(qw + vec2(0., .04)) - esN(qw - vec2(0., .04)) + (esN(qv + vec2(0., .04)) - esN(qv - vec2(0., .04))) * .7) * 1.6 * (.6 + 1.2 * brk) * (1. - .6 * vB.z);
        vec2 tilt = uAxes.zw * slA + uAxes.xy * slS;
        vec3 up = vec3(0., 1., 0.), N = normalize(vec3(tilt.x, 1., tilt.y));
        // the bed, seen through the moving water
        vec4 bc = esCell((p + tilt * .5) / .21);
        // (beach: where it crosses the shingle, the ground's own line 212 to 222 m down the axis: there it runs thin
        // and clear over the beach's own pale pebbles, wet; no weed, little depth of colour, the pale shore to mirror)
        float beach = smoothstep(212., 222., s), deep = dn * (1. - .6 * beach);
        vec3 bedC = mix(mix(mix(vec3(.14, .13, .115), vec3(.36, .33, .27), bc.z), mix(vec3(.25, .25, .23), vec3(.4, .37, .28), bc.z), beach), vec3(.06, .06, .065), step(.86, bc.z)) * mix(.4, 1.05, smoothstep(0., .16, bc.w));
        bedC = mix(bedC, vec3(.05, .08, .03), smoothstep(.45, .7, esN(p * .9 + 11.)) * .6 * (1. - beach));
        bedC = bedC * mix(vec3(.8, .9, .74), vec3(.22, .52, .42), deep * (.8 + .2 * vB.z)) + vec3(.008, .05, .04) * deep;
        // the light of the place (the ground's own: sun through the leaves, cloud, sky, the ring)
        vec4 pl = esPlace(vW); float sv = esSun(vW, pl);
        vec3 E = (uSunCol * (uSunDir.y * sv) + esFill(up, pl) * (.6 + .4 * esCloudShade(vW)) + esPortal(vW, up)) * .3183;
        vec3 V = normalize(cameraPosition - vW), R = reflect(-V, N); R.y = abs(R.y);
        float fres = min(.02 + .98 * pow(1. - clamp(dot(N, V), 0., 1.), 5.), .3);
        vec3 img = mix(mix(vec3(.1, .22, .08), vec3(.3, .29, .25), beach) * E, mix(uFogCol, uSkyCol * .3183, .75), smoothstep(.2, .48, R.y) * (.4 + .6 * dn));
        img += uSunCol * (sv * pow(clamp(dot(R, uSunDir), 0., 1.), 300.));
        vec3 c = mix(mix(bedC * E, img, fres), vec3(.92) * E, white);
        gl_FragColor = vec4(esFog(c, vW), al * mix(.93, 1., white));
      }`}),s=new I.Mesh(o,h);return s.name="brook",{object:s,wakes(g){g.slice(0,36).forEach((t,m)=>{const k=p.toValley(t.x,t.z);a[m].set(k[0],k[1]-p.streamAt(k[0]),t.r)})},update(){}}}async function Ct(u){const{ctx:p,scene:D,R:e,Lo:r,U:w,sky:L,swellK:P}=u,f=_,z=new I.Group;D.add(z);const W=Fe.waterLight(L),b=zt(w,r,u.surface);u.valley.add(b.object),await p.yield();const S=(y,c)=>-r.ground(y,c),l=[-760,-400,-240,440],o=128,a=await Fe.oceanDepthAsync({depthAt:S,depthRect:l,depthRes:o},p.yield),n=Fe.makeOcean({rng:e.sea,light:W,preset:P>.9?"swell":"breeze",level:0,radius:3200,rings:76,segments:96,windAngle:Math.atan2(-f.valleyAxis[1],-f.valleyAxis[0]),depthAt:S,depthRect:l,depthRes:o,depthData:a,shoalDepth:5,shoalWidth:26,foam:.8,deep:"#0b4c8e",scatter:"#35c2b0",shallowColor:"#6fe0b8",glitter:1,shallows:[{x:r.tide[0],z:r.tide[1],radius:46,falloff:60}]}),h=new I.Group;h.add(n.object),D.add(h),await p.yield();const s=Ge(w,!0),g=[1,1,1,2,2,2].map(y=>kt(e["rock-shapes"],y)),t=[],m=new I.Matrix4,k=new I.Quaternion,A=new I.Euler,d=new I.Vector3,x=new I.Vector3,M=(y,c,i,v,C)=>t.push({x:c,y:i,z:v,r:C,v:Math.floor(y()*3)+(C>=1.2?3:0),rx:y.range(-.4,.4),ry:y.range(0,U),k:y.range(.7,1.3)}),F=(y,c,i,v,C)=>M(y,c,r.ground(c,i)-C*v,i,v);for(const y of Ue(p.seed))for(let c=0;c<4;c++){const i=r.fromValley(y+e["row-stones"].range(-.8,.8),r.streamAt(y)+e["row-stones"].range(-1.5,1.5));F(e["row-stones"],i[0],i[1],e["row-stones"].range(.35,.8),.25)}b.wakes(t);for(let y=0,c=e["bank-stones"];y<130;y++){const i=c.range(16,232),v=r.fromValley(i,r.streamAt(i)+c.sign()*c.range(1.2,2.8));F(c,v[0],v[1],c.range(.2,.55),.35)}const B=[];for(let y=0,c=e["stream-ferns"];y<150;y++){const i=c.range(16,214),v=r.fromValley(i,r.streamAt(i)+c.sign()*c.range(1.5,3.3)),C=c.range(.7,1.25),N=c.range(0,U),q=3+Math.floor(c()*2);r.routeDist(v[0],v[1])>=3.5&&B.push({x:v[0],y:r.ground(v[0],v[1])-.05,z:v[1],s:C,rot:N,v:q,c:i<110?0:1})}ue(u.floraMat,u.geoms,B,u.valley),await p.yield();for(let y=0,c=e["flank-rocks"];y<90;y++){const i=c.range(222,330),v=c.sign(),C=r.lr(i)+2.5+v*(r.floorHalf(i)+c.range(-5,9)),N=r.fromValley(i,C),q=c.range(.7,3.4);r.ground(N[0],N[1])>-2.6&&F(c,N[0],N[1],q,.3)}for(let y=0,c=e.crags;y<46;y++){const i=c.range(226,345),v=c.sign(),C=r.fromValley(i,r.lr(i)+2.5+v*(r.floorHalf(i)+c.range(3,30))),N=c.range(2.6,7);r.ground(C[0],C[1])>-1.5&&F(c,C[0],C[1],N,.3)}for(let y=0,c=e["ring-rocks"];y<14;y++){const i=c.range(262,306),v=c.sign(),C=r.fromValley(i,r.lr(i)+v*c.range(13,30)),N=c.range(1.3,3.1);M(c,C[0],Math.max(r.ground(C[0],C[1]),-1.1)-.1*N,C[1],N)}for(let y=0,c=e["shingle-stones"];y<34;y++){const i=c.range(224,262),v=c.range(-1,1)*(r.floorHalf(i)-3),C=r.fromValley(i,r.lr(i)+2.5+v);F(c,C[0],C[1],c.range(.2,.6),.3)}for(const y of u.pools)for(let c=0;c<7;c++){const i=(c+e.pools.range(0,.8))/7*U,v=y.r*e.pools.range(.75,1.2),C=Math.cos(y.turn),N=Math.sin(y.turn),q=Math.cos(i)*v,G=Math.sin(i)*v/1.7;F(e.pools,y.x+C*q-N*G,y.z+N*q+C*G,e.pools.range(.35,1),.3)}await p.yield();for(let y=0;y<6;y++){const c=t.filter(v=>v.v===y),i=new I.InstancedMesh(g[y],s,Math.max(1,c.length));c.forEach((v,C)=>{A.set(v.rx,v.ry,0),i.setMatrixAt(C,m.compose(d.set(v.x,v.y,v.z),k.setFromEuler(A),x.set(v.r*v.k,v.r,v.r/v.k)))}),i.count=c.length,i.computeBoundingSphere(),z.add(i)}return h.add(Mt(w,t.filter(y=>y.r>=.9&&y.y<.5&&r.ground(y.x,y.z)<.35))),await p.yield(),At({...u,water:z,seaGroup:h,stream:b,sea:n})}async function At(u){const{ctx:p,scene:D,R:e,Lo:r,density:w,detail:L,banks:P}=u,f=we.makeFauna(D,{light:we.lightFrom(D)}),z=Ve(r),W=h=>z.find(s=>s.name===h),b=[],S=(h,s,g)=>b.push({o:h.object,pts:s.flatMap(t=>[t[0],t[1]+g,t[2]]),skip:0,live:!0}),l=(h,s,g)=>{const t=W(h),m=we.makeFlock({rng:s,route:t.pts,closed:!0,start:s(),spread:t.spread,wander:[t.wander[0],t.wander[1],t.wander[2],.3],...g});f.add(m),S(m,t.pts,t.spread[1]+t.wander[1])};l("pigeons",e.pigeons,{species:"crows",count:12,size:.9,speed:11,body:"#8a8f98",wingC:"#6f757e",belly:"#b9a7a4",tip:"#2a2c30",head:"#7f8792",beak:"#d8b070"}),l("rooks",e.rooks,{species:"crows",count:25,speed:9}),l("swallows",e.swallows,{species:"swifts",count:20,speed:13,body:"#1c2238",wingC:"#1a2034",belly:"#f0ece0"}),await p.yield(),l("gulls-sea",e.gulls,{species:"gulls",count:12,speed:9}),l("gulls-left",e["gulls-left"],{species:"gulls",count:9,speed:8}),l("gulls-right",e["gulls-right"],{species:"gulls",count:9,speed:8}),l("wagtails",e.wagtails,{species:"swifts",count:5,size:.45,speed:4,body:"#3a3a3a",wingC:"#2c2c2c",belly:"#e8e4d0"}),await p.yield();const o=[];for(const h of P)for(const s of h.bank.edge){const g=e.bees.range(.4,1.6),t=e.bees.range(.5,6),m=s[0]-s[3]*g,k=s[2]-s[4]*g;e.bees.chance(.5)&&r.routeDist(m,k)>=4.5+1.5&&o.push([m,s[1]-t,k])}if(o.length){const h=we.makeBees({rng:e.bees,positions:o,count:Math.round(120*w*L),size:2.6,roam:[1.3,.9,2.4,.06]});f.add(h),S(h,o,1)}const a=[];for(let h=0;h<60;h++){const s=e.butterflies.range(10,206),g=e.butterflies.sign(),t=e.butterflies.range(8,30)+(g>0?5:0),m=r.fromValley(s,r.lr(s)+g*t),k=e.butterflies.range(2,4.5);r.routeDist(m[0],m[1])>=8&&a.push([m[0],r.ground(m[0],m[1])+k,m[1]])}const n=we.makeButterflies({rng:e.butterflies,positions:a,count:Math.round(110*w*L),size:2.4,roam:[1.8,1,.55,.03]});return f.add(n),S(n,a,1.5),await p.yield(),St({...u,fauna:f,lifeSight:b})}function Ft(u,p,D,e,r){const w=[],L=[],P=[];for(let b=0;b<r;b++){const S=p[b%p.length],l=S.bank.edge[Math.floor(D()*S.bank.edge.length)],o=D.range(.5,1.5),a=D.range(0,.5),n=D.range(-.6,.6),h=l[0]-l[3]*o,s=l[2]-l[4]*o,g=l[1]-D.range(.3,2.5),t=D.range(15,27),m=D(),k=D.range(.6,1.6)*D.sign();e.routeDist(h,s)<6+a||(w.push(h,g,s),L.push(Math.max(1,g-e.ground(h,s)-.1),t,m,k),P.push(-(l[3]*Math.cos(n)-l[4]*Math.sin(n))*a,-(l[3]*Math.sin(n)+l[4]*Math.cos(n))*a))}const f=new I.InstancedBufferGeometry;f.setAttribute("position",new I.Float32BufferAttribute([-.5,0,-.5,.5,0,-.5,.5,0,.5,-.5,0,.5,0,.32,0],3)),f.setIndex([0,1,4,1,2,4,2,3,4,3,0,4]),f.setAttribute("aFrom",new I.InstancedBufferAttribute(new Float32Array(w),3)),f.setAttribute("aFall",new I.InstancedBufferAttribute(new Float32Array(L),4)),f.setAttribute("aOut",new I.InstancedBufferAttribute(new Float32Array(P),2)),f.instanceCount=w.length/3;const z=new I.ShaderMaterial({uniforms:{...u,uRed:{value:new I.Vector3(...Ne("#b8141e"))}},fog:!1,side:I.DoubleSide,vertexShader:ae+`
      attribute vec3 aFrom; attribute vec4 aFall; attribute vec2 aOut;
      varying vec3 vW, vN; varying float vTone;
      void main(){
        // a third of each flower's period is its fall, the rest it waits unseen on the bank
        float c = fract(uTime / aFall.y + aFall.z), t = clamp(c / .34, 0., 1.);
        float size = .26 * smoothstep(0., .06, t) * (1. - smoothstep(.985, 1., t)) * step(c, .34);
        float ang = aFall.w * t * 14. + aFall.z * 40., ca = cos(ang), sa = sin(ang);
        vec3 q = position * size;
        q = vec3(q.x * ca - q.y * sa, q.x * sa + q.y * ca, q.z);
        vec3 nn = vec3(-sa, ca, 0.);
        float flut = sin(t * 17. + aFall.z * 60.) * .22 * t;
        vec3 wp = aFrom + vec3(aOut.x * t + aOut.y * flut, -aFall.x * (.3 * t + .7 * t * t), aOut.y * t - aOut.x * flut) + q;
        vW = wp; vN = nn; vTone = .75 + .5 * fract(aFall.z * 17.);
        gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
      }`,fragmentShader:ae+`
      uniform vec3 uRed; varying vec3 vW, vN; varying float vTone;
      void main(){ vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n; gl_FragColor = vec4(esFog(esLight(uRed * vTone, n, vW, 1., .5), vW), 1.); }`}),W=new I.Mesh(f,z);return W.frustumCulled=!1,W}const ce={x0:_.eastMouth[0]-20,step:8,n:Math.ceil((_.entry[0]-_.eastMouth[0]+20)/8)+2};function Wt(u){const{Lo:p,M:D,U:e,sunDir:r}=u,w=p.tables,L=[0,0,0],P=[],f=[],z=[],W=[],b=[],S=new Float32Array(ce.n),l=Math.max(r.y,.25),o=Math.hypot(r.x,l,r.z),a=[r.x/o,l/o,r.z/o],n=Math.hypot(r.x,r.z)||1,h=r.x/n,s=r.z/n,g=14,t=Math.min(19,40*a[1]/Math.hypot(a[0],a[2])),m=t/a[1];for(const[x,M,F]of[[-s,h,22],[h,s,18]]){const B=-M,y=x,c=Math.hypot(M*a[1],M*a[0]-x*a[2],x*a[1]),i=-M*a[1]/c,v=(M*a[0]-x*a[2])/c,C=x*a[1]/c;for(let N=Math.floor(-700/F);N*F<700;N++)for(let q=Math.floor(-700/g);q*g<700;q++){const G=(q+(N&1)*.5)*g,R=x*G+B*N*F,H=M*G+y*N*F,X=R+a[0]*m*.5,O=H+a[2]*m*.5;if(p.routeAt(X,O,L),!(L[0]<16&&L[1]<D.east-12)||p.woodIn(X,O)<.5||!u.gaps.every(T=>Math.hypot(X-T.x,O-T.z)>T.r))continue;const V=p.ground(R,H)+.15,K=P.length/3;for(const[T,Z]of[[-1,1],[1,1],[1,0],[-1,0]]){const E=(1-Z)*m;P.push(R+x*T*g/2+a[0]*E,V+a[1]*E,H+M*T*g/2+a[2]*E),f.push(T,Z),z.push(i,v,C)}W.push(K,K+1,K+2,K,K+2,K+3),b.push(X,V+t*.5,O)}}for(let x=0,M=w.B+D.east+60;x<ce.n;x++){const F=ce.x0+x*ce.step;for(;M>0&&w.X[M]<F;)M--;S[x]=$(w.Z[M],w.Z[M+1],(w.X[M]-F)/(w.X[M]-w.X[M+1]))}const k=new I.BufferGeometry;k.setAttribute("position",new I.Float32BufferAttribute(P,3)),k.setAttribute("aQ",new I.Float32BufferAttribute(f,2)),k.setAttribute("aN",new I.Float32BufferAttribute(z,3)),k.setIndex(W);const A=new I.ShaderMaterial({uniforms:{...e,uLane:{value:S}},fog:!1,side:I.DoubleSide,transparent:!0,depthWrite:!1,blending:I.AdditiveBlending,vertexShader:`attribute vec2 aQ; attribute vec3 aN; varying vec3 vW, vN; varying vec2 vQ;
      void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vQ = aQ; vN = mat3(modelMatrix) * aN; gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:ae+`
      uniform float uLane[${ce.n}];
      varying vec3 vW, vN; varying vec2 vQ;
      // (the square of a place's level distance from one length of the drive's line)
      float laneSeg(vec2 p, int i){
        vec2 ab = vec2(${ce.step.toFixed(1)}, uLane[i + 1] - uLane[i]), w = p - vec2(${ce.x0.toFixed(1)} + ${ce.step.toFixed(1)} * float(i), uLane[i]);
        w -= ab * clamp(dot(w, ab) / dot(ab, ab), 0., 1.);
        return dot(w, w);
      }
      void main(){
        // (the lane: how far this place of the sheet lies from the drive's middle line on the level, less the opening
        // camera's reach behind the entry)
        vec2 p = vec2(min(vW.x, ${_.entry[0].toFixed(1)}), vW.z);
        int i = int(clamp((p.x - ${ce.x0.toFixed(1)}) / ${ce.step.toFixed(1)}, 1., ${(ce.n-2.001).toFixed(3)}));
        float off = sqrt(min(laneSeg(p, i - 1), min(laneSeg(p, i), laneSeg(p, i + 1)))) - max(vW.x - ${_.entry[0].toFixed(1)}, 0.) * ${(15/340).toFixed(5)};
        // (the sheet's own edges and the lane come first: where they leave no light the pixel is done, before any
        // lookup of the light's field or of the air)
        float w = (1. - smoothstep(.6, 1., abs(vQ.x))) * smoothstep(0., .15, vQ.y) * (1. - smoothstep(.8, 1., vQ.y)) * smoothstep(${Pe.toFixed(1)}, ${(2*Pe).toFixed(1)}, off);
        if (w <= 0.) discard;
        vec3 e = vW - cameraPosition; float d = length(e);
        // (the light scattered toward the eye is strongest looking up the shaft toward the sun)
        float a = smoothstep(.6, 1., esDapple(vW, 1.)) * esVault(esPlace(vW)) * esCloudShade(vW) * (.45 + 1.6 * pow(clamp(dot(e / d, uSunDir), 0., 1.), 3.));
        a *= w;
        // (no gap of the leaves here, or no vault: nothing to add, and the air is not asked)
        if (a <= 0.) discard;
        // (the length of the eye's line inside the sheet, by the sheet's own normal: it is handed in with the sheet,
        // so it stands where the sheet is met edge-on too)
        a *= min(1., .45 / max(abs(dot(normalize(vN), e / d)), .01));
        // (a gap of the leaves is many small gaps: the light of a wide one comes down as a sheaf of thin rays, by the
        // same field of the rays' feet that the dapple is laid on, read finer)
        vec2 q = vW.xz - uSunDir.xz * (vW.y / max(uSunDir.y, .25));
        a *= .25 + 1.1 * smoothstep(.35, .8, esN(q * 1.7 + 31.) * .65 + esN(q * 4.3 + 7.) * .35);
        // (what the air lets through of a light, taken once: see esAir beside esFog)
        gl_FragColor = vec4(uSunCol * vec3(1., .92, .68) * (.045 * a) * esAir(vW), 1.);
      }`}),d=new I.Mesh(k,A);return d.renderOrder=2,{mesh:d,mids:b}}async function St(u){const{ctx:p,scene:D,R:e,Lo:r,M:w,U:L,HR:P,heavy:f,detail:z,windK:W,sunDir:b,banks:S,smoke:l}=u,o=r.tables,a=new I.Group,n=[];D.add(a),a.add(Ft(L,S,e.falling,r,f?720:240));const h=[.924*W,0,-.383*W],s=P.sun,g=(M,F)=>[o.X[o.B+Math.round(M)],o.Y[o.B+Math.round(M)]+F,o.Z[o.B+Math.round(M)]],t=[],m=(M,F)=>{t.push({o:M.object,pts:F.flat(),skip:0}),n.push(M)},k=(M,F)=>[0,.5].flatMap(B=>[-.5,0,.5].flatMap(y=>[-.5,0,.5].map(c=>[M[0]+y*F[0],M[1]+B*F[1],M[2]+c*F[2]])));for(let M=38;M<=w.east;M+=76){const F=g(M,7);m(Ce.makeParticles({rng:e.leaves,preset:"leaves",follow:!1,center:F,box:[80,20,80],count:Math.round(240*z),colors:["#86b04c","#a9b94e","#c6a64a"],size:[.1,.2],velocity:[h[0]*.5,-.9,h[2]*.5],lightDir:[b.x,b.y,b.z]}),k(F,[80,20,80]))}await p.yield();for(const M of[.16,.5,.84]){const F=g($(w.head,w.mouth,M),4);m(Ce.makeParticles({rng:e.petals,preset:"petals",follow:!1,center:F,box:[76,18,76],count:Math.round((f?1500:700)*z),colors:["#fbf4e2","#f6d6dc","#f4dc9a"],size:[.13,.26],velocity:[h[0]*.7,-.6,h[2]*.7],lightDir:[b.x,b.y,b.z]}),k(F,[76,18,76]))}for(const M of l)m(Ce.makeSmokeColumn({rng:e.smoke,position:M,height:11,radius:[.2,1.1],size:[.6,2.4],count:26,color:"#c6cfdb",colorTop:"#e2e8ee",shadowColor:"#a3adbd",ambient:"#5c6470",opacity:.2,wind:[h[0]*1.5,0,h[2]*1.5],bend:1.1,sunDir:[b.x,b.y,b.z],sunColor:s}),[0,6,12].map(F=>[M[0]+h[0]*F*.3,M[1]+F,M[2]+h[2]*F*.3]));await p.yield();const A=b.y/Math.hypot(b.x,b.z),d=Math.hypot(b.x,b.z);for(const M of u.gaps){const B=Math.min(15/A,44),y=Math.min(15,B*A),c=r.ground(M.x,M.z),i=[M.x+b.x/d*B,c+y,M.z+b.z/d*B];m(Ce.makeGodRays({rng:e.shafts,position:i,direction:[-b.x,-b.y,-b.z],radius:M.r*.5,count:3,length:Math.hypot(B,y)+2,width:[.7,1.9],color:s,intensity:.3,speed:.6}),[i,[M.x,c+1,M.z],[(i[0]+M.x)/2,c+1+y/2,(i[2]+M.z)/2]])}for(const M of n)a.add(M.object);const x=Wt(u);return a.add(x.mesh),t.push({o:x.mesh,pts:x.mids,skip:0}),await p.yield(),Nt({...u,tick:n,fallSight:t})}async function Nt(u){const{ctx:p,scene:D,U:e,masonry:r,plain:w,Lo:L}=u,P=_,f=P.houseDepth/2,z=new I.Group;D.add(z);const W=[],b=P.houseLength/2,S=4.5,l=[-b].concat([-34,-17,0,17,34].flatMap(i=>[i-S,i+S]),[b]);for(let i=0;i<l.length;i+=2){const v=l[i+1]-l[i],C=Math.max(1,Math.floor((v-1.2)/3.4));for(let N=0;N<C;N++){const q=l[i]+v/2+(N-(C-1)/2)*3.4;q<b/2&&W.push(q)}}const o=[],a=3+Math.floor(u.R.casements()*2);for(let i=0;i<a&&W.length;i++)o.push({u:W.splice(Math.floor(u.R.casements()*W.length),1)[0],swing:u.R.casements.range(1.1,1.45),phase:u.R.casements.range(0,U)});const n=[],h=[],s=[],g=[],t=[],m=[],k=[],A=6,d=9;for(const i of o){for(const C of[-1,1]){const N=i.u+C*.98,q=N+C*.62*Math.cos(i.swing),G=f+.62*Math.sin(i.swing),R=n.length/3;for(const H of[r.W(N,6.65,f+.02),r.W(q,6.65,G),r.W(q,8.95,G),r.W(N,8.95,f+.02)])n.push(H[0],H[1],H[2]),h.push(P.houseAxis[0]*-C,.2,P.houseAxis[1]*-C),s.push(.5,.52,.5);g.push(R,R+1,R+2,R,R+2,R+3,R,R+2,R+1,R,R+3,R+2)}const v=m.length/3;for(let C=0;C<=d;C++)for(let N=0;N<=A;N++){const q=r.W(i.u+(N/A-.5)*1.5,8.9-C/d*2,f+.12);m.push(q[0],q[1],q[2]),t.push(C/d,N/A,i.phase)}for(let C=0;C<d;C++)for(let N=0;N<A;N++){const q=v+C*(A+1)+N,G=q+A+1;k.push(q,G,q+1,q+1,G,G+1)}}const x=new I.BufferGeometry;x.setAttribute("position",new I.Float32BufferAttribute(n,3)),x.setAttribute("normal",new I.Float32BufferAttribute(h,3)),x.setAttribute("color",new I.Float32BufferAttribute(s,3)),x.setIndex(g),z.add(new I.Mesh(x,w));const M=new I.BufferGeometry;M.setAttribute("position",new I.Float32BufferAttribute(m,3)),M.setAttribute("aHang",new I.Float32BufferAttribute(t,3)),M.setIndex(k);const F=new I.Mesh(M,new I.ShaderMaterial({uniforms:{...e,uOut:{value:new I.Vector3(P.houseFront[0],0,P.houseFront[1])}},fog:!1,side:I.DoubleSide,vertexShader:ae+`
      attribute vec3 aHang; uniform vec3 uOut; varying vec3 vW, vN; varying float vFold;
      void main(){
        float h = pow(clamp(aHang.x, 0., 1.), 1.3);
        float gust = .55 + .3 * sin(uTime * 1.1 + aHang.y * 2.4 + aHang.z) + .15 * sin(uTime * 2.7 + aHang.x * 5. + aHang.y * 7. + aHang.z * 1.7);
        float b = h * gust * (.6 + .5 * uWind.z);
        vec3 wp = position + uOut * b + vec3(0., .42 * b * h, 0.);
        vW = wp; vN = normalize(uOut + vec3(0., .6 * b, 0.)); vFold = sin(aHang.y * 25. + aHang.x * 3.);
        gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
      }`,fragmentShader:ae+`
      varying vec3 vW, vN; varying float vFold;
      void main(){ vec3 c = esLight(vec3(.8, .76, .66) * (.82 + .18 * vFold), normalize(vN), vW, 1., .7); gl_FragColor = vec4(esFog(c, vW), 1.); }`}));F.frustumCulled=!1,z.add(F);const B=L.ring,y=new I.Color("#cfeee6");e.uPortal.value.set(B[0],P.ringHeight,B[1],40),e.uPortalCol.value.set(y.r,y.g,y.b).multiplyScalar(3);const c=new I.Mesh(new I.CircleGeometry(30,48).rotateX(-Math.PI/2),new I.ShaderMaterial({uniforms:e,fog:!1,transparent:!0,depthWrite:!1,blending:I.AdditiveBlending,vertexShader:"varying vec3 vW; void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }",fragmentShader:ae+`
      varying vec3 vW;
      void main(){
        vec2 d = vW.xz - uPortal.xz; float r = length(d) / 30.;
        float rip = esN(vW.xz * .9 + vec2(uTime * .7, 0.)) * esN(vW.xz * 2.3 - vec2(0., uTime * .9));
        float k = exp(-r * r * 5.) * (.25 + 1.6 * rip) * (1. - smoothstep(.8, 1., r));
        gl_FragColor = vec4(uPortalCol * (.085 * k), 1.);
      }`}));return c.position.set(B[0],.55,B[1]),c.renderOrder=2,z.add(c),await p.yield(),Lt(u)}async function Bt(u,p,D,e){const{ctx:r,Lo:w,BOX:L,banks:P}=u,f=_,z=4,W=L[0],b=L[1],S=Math.ceil((L[2]-L[0])/z),l=Math.ceil((L[3]-L[1])/z),o=new Float32Array(S*l),a=(g,t,m)=>{const k=Math.floor((g-W)/z),A=Math.floor((t-b)/z);k>=0&&A>=0&&k<S&&A<l&&m>o[A*S+k]&&(o[A*S+k]=m)};for(let g=0;g<l;g+=2){for(let t=0;t<S;t+=2){const m=w.ground(W+(t+1)*z,b+(g+1)*z);for(const k of[0,1,S,S+1])g*S+t+k<o.length&&(o[g*S+t+k]=m)}g%24===22&&await r.yield()}const n=u.deepWood.cells;for(let g=0;g<n.NZ;g++)for(let t=0;t<n.NX;t++)if(n.deep[g*n.NX+t])for(let m=2;m<n.C;m+=z)for(let k=2;k<n.C;k+=z){const A=n.X0+t*n.C+m,d=n.Z0+g*n.C+k,x=Math.floor((A-W)/z),M=Math.floor((d-b)/z);x>=0&&M>=0&&x<S&&M<l&&(o[M*S+x]+=14)}for(const g of P)g.bank.eachVertex((t,m,k)=>a(t,k,m-2));for(let g=-f.houseLength/2+2;g<f.houseLength/2;g+=3)for(let t=-f.houseDepth/2+2;t<f.houseDepth/2;t+=3)a(f.houseCentre[0]+f.houseAxis[0]*g+f.houseFront[0]*t,f.houseCentre[1]+f.houseAxis[1]*g+f.houseFront[1]*t,f.groundLawn+9);await r.yield();const s=((g,t)=>{const m=new Float32Array(g.length),k=new Float32Array(g.length);for(let A=0;A<l;A++)for(let d=0;d<S;d++){let x=g[A*S+d];for(let M=Math.max(0,d-t);M<=Math.min(S-1,d+t);M++){const F=g[A*S+M];F<x&&(x=F)}m[A*S+d]=x}for(let A=0;A<l;A++)for(let d=0;d<S;d++){let x=m[A*S+d];for(let M=Math.max(0,A-t);M<=Math.min(l-1,A+t);M++){const F=m[M*S+d];F<x&&(x=F)}k[A*S+d]=x}return k})(o,1);return await r.yield(),await r.yield(),Pt(u,p,D,e,{H1:s,C:z,X0:W,Z0:b,NX:S,NZ:l})}function Dt(u,p,D){const e=[],r=new I.Matrix4,w=new I.Vector3,L=8;for(const P of u)P.updateMatrixWorld(!0),P.traverse(f=>{if(!f.isMesh||p.includes(f)||!f.geometry.attributes.position)return;const z=[];if(f.isInstancedMesh){f.geometry.boundingBox||f.geometry.computeBoundingBox();const W=f.geometry.boundingBox,b=f.count,S=Math.max(W.max.x-W.min.x,W.max.z-W.min.z)<1.5,l=S?Math.max(1,Math.floor(b/40)):1,o=.8*Math.max(W.max.x,-W.min.x),a=.8*Math.max(W.max.z,-W.min.z),n=.75*W.max.y,h=Math.SQRT1_2,s=[[0,W.max.y,0]],g=[...s,[o,n,0],[-o,n,0],[0,n,a],[0,n,-a]],t=[...g,[o*h,n,a*h],[-o*h,n,a*h],[o*h,n,-a*h],[-o*h,n,-a*h]];for(let m=0;m<b;m+=l){f.getMatrixAt(m,r);const k=S?0:Math.max(o,a)*Math.hypot(r.elements[0],r.elements[1],r.elements[2]);for(const[A,d,x]of k>5?t:k>2.5?g:s)w.set(A,d,x).applyMatrix4(r).applyMatrix4(f.matrixWorld),z.push(w.x,w.y,w.z)}b&&e.push({o:f,pts:z,skip:8,of:D.piece.get(D.of.get(f))})}else{const W=f.geometry.attributes.position,b=W.array;let S=1/0,l=1/0,o=-1/0,a=-1/0;for(let t=0;t<W.count;t++){const m=b[t*3],k=b[t*3+2];m<S&&(S=m),m>o&&(o=m),k<l&&(l=k),k>a&&(a=k)}const n=Math.floor((o-S)/L)+1,h=Math.floor((a-l)/L)+1,s=new Float32Array(n*h).fill(-1e9),g=new Int32Array(n*h).fill(-1);for(let t=0;t<W.count;t++){const m=Math.floor((b[t*3+2]-l)/L)*n+Math.floor((b[t*3]-S)/L);b[t*3+1]>s[m]&&(s[m]=b[t*3+1],g[m]=t)}for(let t=0;t<n*h;t++)g[t]>=0&&(w.fromBufferAttribute(W,g[t]).applyMatrix4(f.matrixWorld),z.push(w.x,w.y,w.z));if(e.push({o:f,pts:z,skip:8}),D.masses.has(f)){const t={o:null,pts:z.map((m,k)=>k%3===1?m+.7:m),skip:8};e.push(t),D.piece.set(f,t)}}});return e}async function Pt(u,p,D,e,r){const{ctx:w,Lo:L,PL:P}=u,f=L.tables,z=20,W=2.5,b=1.5,S=Math.ceil(P/z),l=[];for(const T of p){for(const Z of Dt([T],D,u.ride))l.push(Z);await w.yield()}for(const T of e)l.push(T);const{H1:o,C:a,X0:n,Z0:h,NX:s,NZ:g}=r,t=[0,0,0],m=1/a,k=T=>{const Z=oe(T,-340,f.N-1)+f.B,E=Math.floor(Z),Q=Z-E;t[0]=$(f.X[E],f.X[E+1],Q),t[1]=$(f.Y[E],f.Y[E+1],Q),t[2]=$(f.Z[E],f.Z[E+1],Q)},A=(T,Z,E,Q,j,ee,J,pe)=>{const re=E-t[0],se=j-t[2],ge=Math.sqrt(re*re+se*se),me=Math.floor((ge-ee)*m),ve=1/ge,de=(t[0]-n)*m,xe=t[1]+Z,ye=(t[2]-h)*m,Me=re*ve,ke=se*ve,ze=(Q-t[1])*a*ve;if(J>0){if(J>=pe&&J+1<me){const te=Math.floor(de+Me*J),fe=Math.floor(ye+ke*J),le=Math.floor(de+Me*(J+1)),ie=Math.floor(ye+ke*(J+1));if(te>=0&&fe>=0&&te<s&&fe<g&&le>=0&&ie>=0&&le<s&&ie<g&&xe+ze*J<T[fe*s+te]&&xe+ze*(J+1)<T[ie*s+le])return J}for(let te=Math.max(pe,J-2),fe=0;te<=J+4&&te<me;te++){const le=Math.floor(de+Me*te),ie=Math.floor(ye+ke*te);if(le>=0&&ie>=0&&le<s&&ie<g&&xe+ze*te<T[ie*s+le]){if(++fe>=2)return te-1}else fe=0}}for(let te=pe,fe=0;te<me;te++){const le=Math.floor(de+Me*te),ie=Math.floor(ye+ke*te);if(le>=0&&ie>=0&&le<s&&ie<g&&xe+ze*te<T[ie*s+le]){if(++fe>=2)return te-1}else fe=0}return 0},d=f.X[f.B]-f.X[f.B+1],x=f.Z[f.B]-f.Z[f.B+1],M=Math.hypot(d,x),F=f.X[f.B],B=f.Z[f.B],y=-d/M,c=-x/M,i=(T,Z,E,Q)=>{const j=T.pts,ee=T.at;for(let J=0,pe=ee.length,re=T.first;J<pe;J++,re=re+1<pe?re+1:0){const se=re*3;let ge=3;if(Q>0&&j[se+1]>t[1]){const ve=j[se]-t[0],de=j[se+2]-t[2];ge=Math.max(3,Math.ceil(Math.sqrt(ve*ve+de*de)*m*Q/(Q+(j[se]-F)*y+(j[se+2]-B)*c)))}const me=A(Z,E,j[se],j[se+1],j[se+2],T.skip,ee[re],ge);if(ee[re]=me,!me)return T.first=re,!0}return!1};for(const T of l)T.raw=new Uint8Array(S),T.first=0,T.behind=0,T.at=new Int16Array(T.pts.length/3);await w.yield();for(let T=0;T<S;T++){for(let Z=T*z+W/2;Z<(T+1)*z;Z+=W){k(Z);for(const E of l)!E.raw[T]&&(!E.of||E.of.raw[T])&&i(E,o,b,0)&&(E.raw[T]=1);if(Z<W)for(const E of l)E.at0=E.at.slice()}T%4===2&&await w.yield()}await w.yield();const v=l.filter(T=>!(T.raw[0]|T.raw[1])),C=v.filter(T=>{for(let Z=0;Z<T.pts.length;Z+=3)if((T.pts[Z]-F)*y+(T.pts[Z+2]-B)*c<8)return!0;return!1}),N=[],q=new Set(C);for(let T=2.5;T<=340;T+=5)N.push(T);const G=T=>Math.max(2,15*T/340),R=(T,Z)=>{t[0]=F+(d*T-x*Z)/M,t[1]=f.Y[f.B],t[2]=B+(x*T+d*Z)/M},H=[];{const T=N[0],Z=N[N.length-1],E=Math.ceil(G(T)/5),Q=Math.ceil(G(Z)/5);for(let j=-E;j<=E;j++)H.push([T,G(T)*j/E]);for(let j=1;j<N.length-1;j++)H.push([N[j],G(N[j])]);for(let j=Q;j>=-Q;j--)H.push([Z,G(Z)*j/Q]);for(let j=N.length-2;j>=1;j--)H.push([N[j],-G(N[j])])}const X=T=>!T.of||T.of.behind||T.of.raw[0]||T.of.raw[1];for(const T of v)T.at.set(T.at0),T.first=0;for(let T=0;T<H.length;T++){R(H[T][0],H[T][1]);for(const Z of v)!Z.behind&&X(Z)&&i(Z,o,b,q.has(Z)?0:H[T][0])&&(Z.behind=1);T%36===35&&await w.yield()}for(const T of C)T.at.set(T.at0),T.first=0;for(let T=0;T<N.length&&C.length;T++){const Z=N[T],E=G(Z),Q=Math.ceil(E/5);for(let j=-Q+1;j<=Q-1;j++){R(Z,E*(T%2?-j:j)/Q);for(const ee of C)!ee.behind&&X(ee)&&i(ee,o,b,0)&&(ee.behind=1)}T%8===7&&await w.yield()}await w.yield();for(const T of l){T.see=new Uint8Array(S+1);for(let Z=0;Z<S;Z++)T.see[Z+1]=T.raw[Math.max(Z-1,0)]|T.raw[Z]|T.raw[Math.min(Z+1,S-1)];T.see[0]=T.see[1]|T.behind,delete T.raw,delete T.at,delete T.at0}let O=-1;const V=l.filter(T=>!T.live&&T.o),K=l.filter(T=>T.live);return{pieces:l,set(T){const Z=T>0?1+oe(Math.floor(T*P/z),0,S-1):0;if(Z!==O){O=Z;for(const E of V)E.o.visible=E.see[Z]===1}},life(){for(const T of K)T.see[Math.max(O,0)]!==1&&(T.o.visible=!1)}}}async function Lt(u){const{ctx:p,scene:D,Lo:e,path:r,M:w,PL:L,HR:P,sky:f,rig:z,sunDir:W,U:b,PM:S,placeTex:l,banks:o}=u,a=_;for(let y=0;y<S.cells;y+=24576)S.bake(W,l,y,y+24576),await p.yield();await f.prewarm(p.renderer,null,D);const n=[];for(let y=150;y<=930;y+=60)for(let c=-700;c<=320;c+=60){const i=e.fromValley(y,c);e.ground(i[0],i[1])<-.5&&n.push(i[0],.5,i[1])}const h={masses:new Set,of:new Map,piece:new Map};for(const y of[...o.map(c=>c.built),u.outliers,...u.azaleas])for(const c of y.parts)h.masses.add(c.mass),h.of.set(c.heads,c.mass),h.of.set(c.leaves,c.mass);u.ride=h;const s=await Bt(u,[u.wood,...o.map(y=>y.built.group),u.lyingGroup,u.outliers.group,u.valley,u.house,u.lawn,u.water],[u.deepWood.mesh],[{o:u.seaGroup,pts:n,skip:0},...u.lifeSight,...u.fallSight]),g=y=>{const c=y*L;let i=$(1.15,1,Y(w.east-40,w.east,c));return i=$(i,.75,Y(w.bend-40,w.bend-20,c)),i=$(i,.9,Y(w.west,w.west+30,c)),i=$(i,.8,Y(w.turn,w.onFront,c)),$(i,1,Y(w.holdEnd,w.corner,c))},t=a.houseCentre,m=a.houseAxis,k=a.houseFront,A=60,d=900,x=Math.cos(A*Math.PI/180),M=Math.sin(A*Math.PI/180),B=[{at:[t[0]+m[0]*(a.houseLength/2+d*x)+k[0]*(a.houseDepth/2-d*M),6,t[1]+m[1]*(a.houseLength/2+d*x)+k[1]*(a.houseDepth/2-d*M)],from:w.west/L,to:w.corner/L,fade:(w.corner-w.houseW)/(w.corner-w.west),weight:.75}];return{scene:D,path:r,duration:48,pace:g,pois:B,camera:{fov:62,near:.3,far:4200,lookAhead:26,sway:.7,bank:.5,nearThrough:.3},portal:{shape:"circle",radius:a.ringRadius,color:"#cfeee6",glow:1,revealDistance:300},post:{exposure:P.exposure,bloom:{strength:.3,radius:.6,threshold:1},grade:{saturation:1.04,contrast:1.03,vignette:.22,grain:.02}},update(y,c,i,v){b.uTime.value=c,s.set(v),f.update(y,c,i),z.update(y,c,i),u.stream.update(y,c,i),u.sea.update(y,c,i),u.fauna.update(y,c,i,v),s.life();for(const C of u.tick)C.update(y,c,i)},dispose(){f.dispose?.()}}}export{Rt as default};
