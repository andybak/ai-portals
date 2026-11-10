import*as a from"three";import{makeSky as Be}from"../kit/sky.js";import{BEND_GLSL as He,B0 as Oe,bendKnots as Te,bendAt as qe,PLAN as L}from"./city-closing-overhead.js";const U=Math.PI,W=U/180,s=f=>new a.Color(f),le=205,Ae=-5,Ue=6,de={rose:{core:"#ff8f6a",band:"#d9708a"},amber:{core:"#ffa24e",band:"#e08a5a"}},I={old:"#ffb057",halo:"#ff8a3a",pale:"#ffd9a0",cool:"#dfe8ff"},We=["#ffbe6e","#ff9a48","#ffe2b0","#bfdcff"],Ne=`
uniform float uClock; uniform vec3 uWash; uniform vec3 uFlood; uniform float uPaneGain; uniform vec3 uPaneC[4];
uniform vec3 uRimAt; uniform vec3 uRimC; uniform vec3 uGlow3;
uniform vec4 uRollAir; uniform vec2 uRollAt; uniform vec4 uRingAt; uniform vec3 uRingC; uniform vec3 uShade;
vec3 ntGlow;
float ntHash(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
// a box-filtered pulse: 1 where a < x < b, softened over the footprint w
float ntBox(float x, float a, float b, float w) { float k = 1.0 / max(w, 0.001); return clamp((x - a) * k + 0.5, 0.0, 1.0) * clamp((b - x) * k + 0.5, 0.0, 1.0); }
// box-filtered lines of width f (a share of the period) on a period-1 coordinate; their own mean f from 0.8 periods
float ntLines(float x, float w, float f) {
  float n = 1.0 / f, a = x + 0.5 * w, b = x - 0.5 * w;
  float c = clamp((floor(a) + min(fract(a) * n, 1.0) - floor(b) - min(fract(b) * n, 1.0)) / max(n * w, 0.0001), 0.0, 1.0);
  return mix(c, f, smoothstep(0.35, 0.8, w));
}
`,De=`
  {
    float nCls = floor(vKind.x + 0.5), nSeed = vKind.y;
    float nS = vFac.x, nH = vFac.y, nW = vFac.z, nE = vFac.w;
    vec2 nFw = fwidth(vFac.xy); float ws = max(nFw.x, 0.0005), wh = max(nFw.y, 0.0005);
    vec3 nBase = diffuseColor.rgb, nCol = nBase;
    ntGlow = vec3(0.0);
    if (nCls > 8.5) {
      // ROOF TILES: the shade between the tiles' backs every 0.21 m along the eaves, each course's lap every 0.15 m of
      // rise, and patches of older and newer tiles (2.4 by 1.8 m cells), all faded to their mean by the footprint
      float rib = ntLines(nS / 0.21, ws / 0.21, 0.35), lap = ntLines(nH / 0.15, wh / 0.15, 0.2);
      float pf = smoothstep(0.3, 0.8, max(ws / 2.4, wh / 1.8));
      float ph = ntHash(floor(vec2(nS / 2.4, nH / 1.8)) + nSeed * 53.0 + 11.0);
      vec3 pt = ph > 0.85 ? vec3(0.86, 0.87, 0.90) : (ph < 0.15 ? vec3(1.14, 1.08, 1.0) : vec3(1.0));
      nCol = nBase * mix(pt, vec3(1.0), pf) * ((1.0 - 0.22 * rib - 0.12 * lap) / 0.899);
    } else if (abs(nCls - 7.0) < 0.5) {
      ntGlow = nBase * (nSeed > 1.0 ? nSeed : 2.5);
    } else if (nCls > 0.5 && abs(nCls - 5.0) > 0.5) {
      float brick = (nCls < 1.5 || nCls > 5.5) ? 1.0 : 0.0, hall = nCls > 7.5 ? 1.0 : 0.0, lamped = nCls > 5.5 ? 1.0 : 0.0;
      if (nCls > 1.5 && nCls < 3.5) {
        float mf = smoothstep(0.15, 0.6, max(ws, wh) / 2.5);
        float mo = (sin(nS * 1.31 + nSeed * 23.0) * sin(nH * 1.73 + nS * 0.41) + 0.6 * sin(nS * 0.53 - nH * 0.37 + nSeed * 9.0)) * (1.0 - mf);
        nCol = nBase * (1.0 + 0.05 * mo);
        nCol = mix(nCol, nCls > 2.5 ? vec3(0.62, 0.36, 0.07) : nBase * 0.8, ntBox(nH, -3.0, 0.5, wh));
      } else if (nCls > 3.5 && nCls < 4.5) {
        nCol = nBase * (1.0 - 0.3 * (ntLines(nH / 0.30, wh / 0.30, 0.1) - 0.1));
      }
      if (nCls < 5.5 || hall > 0.5) nCol = mix(nCol, vec3(0.32, 0.12, 0.055), 0.75 * ntBox(nH, nE - 0.3, nE + 0.02, wh));
      nCol *= mix(0.7, 1.0, smoothstep(0.0, 0.6, nH));
      if (lamped > 0.5) {
        // A TOWER'S AND THE HALL'S BRICK IS ONE TONE on every face (no patch, no band, no hole): only its COURSES, at
        // their true size (a course 0.075 m with its 0.01 m bed joint; bricks 0.25 m long, each course half a brick
        // along from the one under it; the mortar the brick's own tone, 0.22 darker), to their mean by the footprint:
        // they read near the way and are one plain tone from farther off
        float bed = ntLines(nH / 0.075, wh / 0.075, 0.133);
        float hdj = ntLines(nS / 0.25 + 0.5 * step(0.5, fract(0.5 * floor(nH / 0.075))), ws / 0.25, 0.04);
        nCol *= (1.0 - 0.22 * max(bed, mix(hdj, 0.04, smoothstep(0.35, 0.8, wh / 0.075)))) / 0.963;
      }
      if (nW > 1.2) {
        float d1 = fract(nSeed * 7.31 + 0.137), d2 = fract(nSeed * 13.73 + 0.291), d3 = fract(nSeed * 29.17 + 0.713);
        float d4 = fract(nSeed * 53.9 + 0.419), d5 = fract(nSeed * 3.77 + 0.61), d6 = fract(nSeed * 17.3 + 0.2);
        float share = mix(0.60, 0.95, d1), dark = step(d2, 0.05), shut = step(0.05, d2) * step(d2, 0.15) * (1.0 - hall);
        float rad = mix(2.5, 5.0, d3) * uPaneGain;
        // A HOUSE'S OWN ROOM TONE: 92 in 100 warm, anywhere from deep amber through gold to honey by its die; 8 a cool white
        float tw = d4 / 0.92;
        vec3 pc = d4 < 0.92 ? (tw < 0.5 ? mix(uPaneC[1], uPaneC[0], tw * 2.0) : mix(uPaneC[0], uPaneC[2], tw * 2.0 - 1.0)) : uPaneC[3];
        float nC = max(1.0, floor(nW / mix(2.6, 3.6, hall) + 0.35)), cw = nW / nC;
        float ci = clamp(floor(nS / cw), 0.0, nC - 1.0), x = nS - (ci + 0.5) * cw, fi = max(floor(nH / 3.1), 0.0);
        float y = mix(nH - fi * 3.1, nH, hall), hw = min(0.65, 0.5 * cw - 0.22);
        float y0 = mix(0.95, 3.0, hall), y1 = mix(2.65, max(nE - 1.4, 4.0), hall);
        float whole = mix(step((fi + 1.0) * 3.1, nE + 0.25), 1.0, hall);       // only a whole floor under the eaves holds a pane
        float isDoor = (1.0 - hall) * (1.0 - step(0.5, fi)) * (1.0 - step(0.5, abs(ci - floor(d5 * nC))));
        float cell = whole * (1.0 - isDoor);
        float L = 0.80 + 0.15 * (1.0 - exp(-clamp(uClock, 0.0, 4000.0) / 40.0)), on = 1.0 - dark;
        float pLit = clamp(L * share / 0.775, 0.0, 1.0) * on;
        float hsh = ntHash(vec2(ci + 13.0 * nSeed, fi + nW));
        float lit = smoothstep(0.0, 0.004, L * share / 0.775 - hsh) * on;
        float drawn = mix(0.55, 1.0, fract(hsh * 7.3));                       // a room's own brightness (curtains, a small lamp): steady
        // THE PANE'S OWN FOOTPRINT (not its cell's): a pane 3 pixels wide begins to give way to ITS ROW'S MEAN GLOW (the
        // house's lit share x its panes' share of the wall), one under 1.2 pixels wide, a dot, is that mean alone: a far
        // row of the hanging town is a calm band of warm wall, never a shimmer of dots
        float nFar = smoothstep(0.33, 0.85, max(ws / (2.0 * hw), wh / max(y1 - y0, 0.5)));
        float aWin = 2.0 * hw * (y1 - y0) / (cw * mix(3.1, max(nE, 3.0), hall));
        float win = ntBox(x, -hw, hw, ws) * ntBox(y, y0, y1, wh) * cell;
        float ring = ntBox(x, -hw - 0.12, hw + 0.12, ws) * ntBox(y, y0 - 0.14, y1 + 0.12, wh) * cell;
        float fine = 1.0 - smoothstep(0.04, 0.16, max(ws, wh));
        // A WINDOW, not a lit rectangle (all of it to its mean by the footprint): a timber frame 0.05 m inside the pane's
        // edge; GLAZING BARS 0.04 m, two lights across and three or four up by the house's die (a hall's tall pane six up);
        // A ROOM'S CLOTH by the room's own die: 35 in 100 curtains drawn back to the sides (the outer 0.4 of each half, folds
        // every 0.07 m), 25 a blind half drawn (its hem 0.35 to 0.6 of the way down, a lath at the hem), 40 bare. Cloth
        // lets 0.62 of the room's light through. Nothing lettered; no figure and no shadow of one: cloth and light alone.
        float nv = mix(d6 < 0.5 ? 3.0 : 4.0, 6.0, hall), pv = (y1 - y0) / nv, cd = fract(hsh * 13.7);
        float hem = y1 - (y1 - y0) * mix(0.35, 0.6, fract(hsh * 29.3)), isBlind = step(0.35, cd) * step(cd, 0.60) * (1.0 - hall);
        float frame = 1.0 - ntBox(x, -hw + 0.05, hw - 0.05, ws) * ntBox(y, y0 + 0.05, y1 - 0.05, wh);
        float bars = max(max(ntBox(x, -0.02, 0.02, ws), ntLines((y - y0) / pv + 0.02 / pv, wh / pv, 0.04 / pv)), max(frame, isBlind * ntBox(y, hem - 0.02, hem + 0.02, wh))) * fine;
        float curt = step(cd, 0.35) * (1.0 - hall) * (1.0 - ntBox(x, -0.6 * hw, 0.6 * hw, ws));
        float cloth = max(curt * (0.78 + 0.22 * sin(x * 90.0)), isBlind * ntBox(y, hem, y1 + 1.0, wh));
        float clothK = mix(0.90, 1.0 - 0.38 * cloth, fine);                    // (0.90: the cloth's mean over a front)
        float door = isDoor * ntBox(x, -0.55, 0.55, ws) * ntBox(nH, -1.0, 2.3, wh) * (1.0 - nFar);
        float fan = isDoor * step(d6, 0.333) * (1.0 - dark) * ntBox(x, -0.55, 0.55, ws) * ntBox(nH, 2.38, 2.88, wh) * (1.0 - nFar);
        vec3 trimC = brick > 0.5 ? vec3(0.60, 0.55, 0.46) : min(nBase * 1.3 + 0.04, vec3(0.9));
        vec3 shutC = d3 < 0.4 ? vec3(0.030, 0.070, 0.045) : (d3 < 0.75 ? vec3(0.100, 0.045, 0.022) : vec3(0.050, 0.085, 0.130));
        vec3 inC = mix(vec3(0.03, 0.035, 0.045), shutC * (1.0 - 0.45 * ntBox(x, -0.03, 0.03, ws) * fine), shut);
        float mask = mix(win, aWin * cell, nFar);
        nCol = mix(nCol, trimC, 0.8 * mix(ring, min(1.0, aWin * 1.4) * cell, nFar));
        nCol = mix(nCol, inC, mask);
        nCol = mix(nCol, vec3(0.023, 0.012, 0.007), door);
        // a room is brightest under its ceiling and in the pane's middle, its curtains drawn back to the sides (mean 1)
        float grad = mix((0.55 + 0.9 * clamp((y - y0) / max(y1 - y0, 0.1), 0.0, 1.0)) * (1.15 - 0.45 * (x / hw) * (x / hw)), 1.0, nFar);
        // shut shutters let the room's light through their louvres: slats every 0.12 m, 3 parts in 10 open, 0.8 of the light
        float through = mix(1.0, 0.8 * mix(ntLines(y / 0.12, wh / 0.12, 0.3), 0.3, nFar), shut);
        ntGlow += pc * rad * (mix(lit * drawn, pLit * 0.775, nFar) * mask * mix(1.0 - bars, 0.88, nFar) * clothK * grad * through + 0.8 * fan);
        // THE REVEAL LIT BY ITS PANE: the 0.12 m band round a lit pane (the surround, or a set-back pane's own reveal
        // faces, which carry this band's s or h) takes 0.16 of the room's light (a third through shut shutters)
        ntGlow += pc * rad * (0.16 * lit * drawn * max(ring - win, 0.0) * (1.0 - nFar) * (1.0 - 0.67 * shut));
      }
      float nUp = max(nH, 0.0);
      ntGlow += nCol * mix(uWash * exp(-nUp / 3.0), uFlood * (1.2 / (1.0 + nUp * nUp / 400.0)), lamped);
    } else if (nCls < 0.5 && nE > 0.5) {
      // A LEVEL FACE OF A WALLED BODY (the writer gives every level face of a body the plain class and leaves its
      // wall's eaves in vFac.w: a ledge's or a course's top and soffit, a sill, a cornice, a pot's top): it stands in
      // its own wall's shade. Its own tone under the town's warm bounce and a share of its street's lamps (uShade),
      // given as radiance, and the rig's light taken off it: no strip of the sky's blue along a lamp-lit wall
      ntGlow = nBase * uShade; nCol = vec3(0.0);
    }
    diffuseColor.rgb = nCol;
  }
`,ze=(f,o)=>`    {
      float aUp = max(${f}.y - uRollAt.y, 0.0);
      float aD = aUp + max(uRollAt.x - ${f}.x, 0.0) * clamp((aUp - 60.0) / 90.0, 0.0, 1.0);
      float aS = 1.0 - exp(-min(aD * uRollAir.w, 20.0));
      diffuseColor.rgb *= 1.0 - aS;
      ${o} = ${o} * (1.0 - aS) + uRollAir.rgb * aS;
    }`,_e=`
  {
    vec3 rW = cameraPosition - vViewPosition * mat3(viewMatrix);
    vec3 rN = normal * mat3(viewMatrix);
    vec2 rD = (rW.xy - uRimAt.xy) / max(uRimAt.z, 1.0);
    float rFall = exp(-min(dot(rD, rD), 20.0)) * smoothstep(-0.6, 0.4, dot(rN, uGlow3));   // whole on what faces the glow, a half on a roof that looks straight away from its ground (the band's low light and the lit land's bounce), nothing on a face turned from it
    ntGlow += uRimC * (0.18 + 0.8 * diffuseColor.rgb) * rFall;   // a tile's or a wall's own colour and its grazing sheen
    // THE RING'S PLACE (the plan's: uRingAt = the ring's foot x, the paving's y, the ring's z, 1 / (30 m)^2): the light
    // about the ring's base washes the fronts beside it, by the face's own place: whole at the foot, 0.64 at 20 m (the
    // fronts of the two rows), 0.37 at 30 m, gone by 60; a third 13 m up a front
    vec2 gD = rW.xz - uRingAt.xz;
    ntGlow += diffuseColor.rgb * uRingC * (exp(-min(dot(gD, gD) * uRingAt.w, 20.0)) * exp(-clamp(rW.y - uRingAt.y, 0.0, 240.0) / 12.0));
${ze("rW","ntGlow")}
  }
  totalEmissiveRadiance += ntGlow;
`,Ie=`uniform vec3 uWash; uniform vec4 uRollAir; uniform vec2 uRollAt;
`,Ve=`
  totalEmissiveRadiance += diffuseColor.rgb * uWash * (0.4 * exp(-clamp(vFac.y, 0.0, 60.0) / 3.5));
  {
    vec3 tW = cameraPosition - vViewPosition * mat3(viewMatrix);   // the leaf's own place in the world
${ze("tW","totalEmissiveRadiance")}
  }
`;function Qe(f={}){const o=f.glow,v=String(typeof o=="string"?o:o&&(o.name||o.id||o.key)||"").toLowerCase(),y=de[v]||(o&&o.core&&o.band?{core:o.core,band:o.band}:de.amber),i=f.haze,R=typeof i=="number"?i:i&&typeof i.density=="number"?i.density:.0011;return{glow:y,density:Math.min(.0013,Math.max(9e-4,R))}}const O={zenith:"#0b1b4d",mid:"#2a479c",horizon:"#6a5aa8",horizonPow:20,midPow:1.5,scatter:2,scatterPow:4,scatterFall:9},Le=1.25;function Re(f,o,v,y=new a.Color){const i=1-Math.min(1,Math.max(0,f));return y.copy(s(O.zenith)).lerp(s(O.mid),Math.pow(i,O.midPow)).lerp(s(O.horizon),Math.pow(i,O.horizonPow)),y.lerp(v,Math.min(1,Math.max(0,Math.pow(o,O.scatterPow)*Math.pow(i,O.scatterFall)*O.scatter)))}function je(f){const o=new a.Color(0,0,0),v=new a.Color,y=Math.sin(2*W),i=Math.cos(2*W);for(let R=0;R<=6;R++){const b=(90+30*R)*W;Re(y,.5+.5*Math.cos(b)*i*Math.cos(Ae*W),f,v),o.r+=v.r/7,o.g+=v.g/7,o.b+=v.b/7}return o}function lt(f,o={}){const v=B=>f.core.makeRng(f.core.hashSeed(B+":"+f.seed)),y=Qe(o.look),i=s(y.glow.band).multiplyScalar(Le),R=s(y.glow.core),b=je(i),E=Be({rng:v("closing-skydome"),preset:"blueHour",bake:!0,renderer:f.renderer,zenith:O.zenith,mid:O.mid,horizon:O.horizon,ground:b.clone(),horizonPow:O.horizonPow,midPow:O.midPow,scatterColor:i.clone(),scatter:O.scatter,scatterPow:O.scatterPow,scatterHigh:0,scatterFall:O.scatterFall,sunElevation:Ae,sunAzimuth:le,sunColor:R.clone(),sunIntensity:0,sunGlow:1.6,sunGlowTight:.3,stars:.35,starDensity:.15,twinkle:0,milkyWay:0,bodies:[],clouds:!1,clouds2:!1}),c=new a.HemisphereLight(s("#5f7fd6"),s("#a8705a"),.8*U),m=new a.DirectionalLight(s("#ff9a70"),.5*U),M=le*W,k=Ue*W;m.position.set(Math.sin(M)*Math.cos(k),Math.sin(k),-Math.cos(M)*Math.cos(k)).multiplyScalar(1e3),m.castShadow=!1;const n={uClock:{value:0},uWash:{value:s(I.old).multiplyScalar(.52)},uFlood:{value:s("#ffc890")},uPaneGain:{value:.4},uPaneC:{value:We.map(s)},uPool:{value:new a.Vector4().fromArray([...s(I.old).toArray(),1.3])},uBand:{value:i.clone()},uBack:{value:b.clone().multiplyScalar(.8)},uGlowDir:{value:new a.Vector2(Math.sin(M),-Math.cos(M))},uLampOld:{value:s(I.old)},uLampHalo:{value:s(I.halo)},uLampPale:{value:s(I.pale)},uLampCool:{value:s(I.cool)},uSprite:{value:new a.Vector4(3,.36,.4,2.5)},uGlow3:{value:new a.Vector3(Math.sin(M)*Math.cos(k),Math.sin(k),-Math.cos(M)*Math.cos(k))},uRimC:{value:i.clone().multiplyScalar(1.4)},uRimAt:{value:new a.Vector3},uRollAir:{value:new a.Vector4(b.r,b.g,b.b,1/3e3)},uRollAt:{value:new a.Vector2(L.HX,L.Y0)},uRingAt:{value:new a.Vector4(L.RING_X,L.Y0,L.RING_Z,1/900)},uRingC:{value:s(I.old).multiplyScalar(.3)},uShade:{value:s("#a8705a").multiplyScalar(.8*.6).add(s(I.old).multiplyScalar(.52*.3))}},Y=qe(Te(Oe),595,0,0,0);n.uRimAt.value.set(Y.x,Y.y,70);const T={uPool:n.uPool,uBack:n.uBack,uRollAir:n.uRollAir,uRollAt:n.uRollAt},C={house:{pars:Ne,colour:De,emit:_e,key:"closing-night-house-4",uniforms:{uClock:n.uClock,uWash:n.uWash,uFlood:n.uFlood,uPaneGain:n.uPaneGain,uPaneC:n.uPaneC,uRimAt:n.uRimAt,uRimC:n.uRimC,uGlow3:n.uGlow3,uRollAir:n.uRollAir,uRollAt:n.uRollAt,uRingAt:n.uRingAt,uRingC:n.uRingC,uShade:n.uShade}},tree:{pars:Ie,colour:"",emit:Ve,key:"closing-night-tree-3",uniforms:{uWash:n.uWash,uRollAir:n.uRollAir,uRollAt:n.uRollAt}}};return{sky:E,fogColor:b,fogDensity:y.density,lights:[c,m],post:{exposure:1.04,bloomStrength:.38,bloomThreshold:.9,bloomRadius:.6,contrast:1,saturation:1.06,vignette:.22,grain:.02},night:C,landUniforms:T,lit:n,glow:y.glow,update(B,N,q){n.uClock.value=N,E.update(B,N,q)},prewarm(B,N,q){return E.prewarm(B,N,q)},dispose(){E.dispose()}}}const r={cx:20,cz:600,y:6.6,sheetR:2500,farm:340,village:60,hedges:150},xe=[{r0:1600,rc:2e3,h0:60,h1:150,cols:96},{r0:2700,rc:3200,h0:150,h1:270,cols:72},{r0:4e3,rc:4500,h0:270,h1:420,cols:72}],pe={turn:17*W,row:90,len0:110,len1:170},Fe=["#3e3a56","#243642","#5a5368","#111830","#746f8a"],Ke={x0:-170,x1:215,z0:-60},Ye=`
attribute vec4 aTone; attribute vec3 aUv;             // aTone: a tone and the kind (0 plain, 1 ridge, 2 hedgerow); aUv: metres along a flat, its height's share, its phase
varying vec4 vTone; varying vec3 vUv3; varying vec2 vW; varying float vFarD;
void main() {
  vTone = aTone; vUv3 = aUv; vW = position.xz;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vFarD = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`,Ze=`
#ifdef USE_FOG
uniform vec3 fogColor; uniform float fogDensity;
#endif
uniform vec3 uField[5];
varying vec4 vTone; varying vec3 vUv3; varying vec2 vW; varying float vFarD;
float frHash(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
void main() {
  vec3 c = vTone.rgb; float kind = vTone.a, air = 1.0;
#ifdef USE_FOG
  float fd = fogDensity * max(vFarD, 0.0); air = exp(-min(fd * fd, 40.0));
#endif
  if (kind < 0.5) {
    // the fields' lattice: turned 17 deg (cos 0.9563, sin 0.2924), rows 90 m deep, a row's fields 110 to 170 m long
    vec2 q = vec2(0.9563 * vW.x + 0.2924 * vW.y, -0.2924 * vW.x + 0.9563 * vW.y);
    float fw = max(max(fwidth(q.x), fwidth(q.y)), 0.01);
    float row = floor(q.y / 90.0), rh = frHash(vec2(row, 3.0)), len = 110.0 + 60.0 * rh, u = q.x / len + rh * 7.0;
    float h = frHash(vec2(floor(u), row));
    vec3 tone = h < 0.4 ? uField[0] : (h < 0.75 ? uField[1] : uField[2]);
    vec3 mean = 0.4 * uField[0] + 0.35 * uField[1] + 0.25 * uField[2];
    // furrows and drill rows every 6 m, along or across the row by the field's own die: land that is worked, never water
    float fur = sin((frHash(vec2(floor(u), row) + 9.0) < 0.5 ? q.x : q.y) * 1.05) * (1.0 - smoothstep(1.5, 5.0, fw));
    tone = mix(tone * (1.0 + 0.10 * fur), mean, smoothstep(40.0, 110.0, fw));
    float dE = min(len * (0.5 - abs(fract(u) - 0.5)), 90.0 * (0.5 - abs(fract(q.y / 90.0) - 0.5)));   // metres to the field's edge
    float hedge = mix(1.0 - smoothstep(2.0 - 0.5 * fw, 2.0 + 0.5 * fw + 0.01, dE), 0.075, smoothstep(6.0, 24.0, fw));
    float li = floor(q.y / 90.0 + 0.5), dl = abs(q.y - li * 90.0), isLane = 1.0 - step(0.5, li - 3.0 * floor(li / 3.0));
    float lane = isLane * mix(1.0 - smoothstep(2.5 - 0.5 * fw, 2.5 + 0.5 * fw + 0.01, dl), 0.055, smoothstep(6.0, 24.0, fw));
    c = mix(mix(tone, uField[3], hedge * (1.0 - isLane * step(dl, 6.0))), uField[4], lane);
#ifdef USE_FOG
    c = mix(fogColor, c, air);
#endif
  } else if (kind > 1.5) {
    // a hedgerow's crowns: their outline along the flat (vUv3.x metres, .y the height's share, .z its phase), one gap in five
    float s = vUv3.x + vUv3.z * 61.0;
    float top = 0.66 + 0.17 * sin(s * 0.9) * sin(s * 0.37 + 1.3) + 0.13 * sin(s * 2.3 + vUv3.z * 9.0);
    float gap = step(frHash(vec2(floor(s / 9.0), 5.0)), 0.2);
    if (vUv3.y > mix(top, 0.22, gap)) discard;
#ifdef USE_FOG
    c = mix(fogColor, c, air);
#endif
  }
  gl_FragColor = vec4(c, 1.0);
}
`;function st(f,o={}){const v=t=>f.core.makeRng(f.core.hashSeed(t+":"+f.seed)),y=new a.Group;y.name="closing-far";const i=o.light||{},R=i.fogColor?i.fogColor.clone():s("#3f4d93"),b=i.lit&&i.lit.uBand?i.lit.uBand.value.clone():s(de.amber.band).multiplyScalar(Le),E=o.plan&&o.plan.flat&&o.plan.flat.z1>0?o.plan.flat.z1:Math.max(L.Z_TIP+12,L.RING_Z+22),c={...Ke,z1:E},m=[],M=[],k=[],n=[],Y=new a.Color(0,0,0),T=(t,w,x,g,S,H=0,_=0,V=0)=>(m.push(t,w,x),M.push(g.r,g.g,g.b,S),k.push(H,_,V),m.length/3-1),C=-160,B=80,N=-80,q=E-10,D=[];for(let t=0;t<16;t++)D.push([C+(B-C)*t/16,N]);for(let t=0;t<16;t++)D.push([B,N+(q-N)*t/16]);for(let t=0;t<16;t++)D.push([B-(B-C)*t/16,q]);for(let t=0;t<16;t++)D.push([C,q-(q-N)*t/16]);const X=(C+B)/2,se=(N+q)/2;for(let t=0;t<D.length;t++){const[w,x]=D[t],g=Math.hypot(w-X,x-se);T(w,r.y,x,Y,0),T(X+(w-X)/g*r.sheetR,r.y,se+(x-se)/g*r.sheetR,Y,0);const S=2*t,H=2*((t+1)%D.length);n.push(S,S+1,H,H,S+1,H+1)}const j=v("closing-ridge"),fe=Math.sin(le*W),we=-Math.cos(le*W),re=s("#141a33"),ee=[];xe.forEach((t,w)=>{const x=[j()*2*U,j()*2*U,j()*2*U,j()*2*U,j()*2*U],g=[];for(let h=0;h<t.cols;h++)g.push((j()-.5)*.24);const S=h=>t.h0+(t.h1-t.h0)*Math.min(1,Math.max(0,.5+.26*Math.sin((3+w)*h+x[0])+.16*Math.sin((7+2*w)*h+x[1])+.08*Math.sin(13*h+x[2]))),H=h=>t.rc+100*Math.sin(5*h+x[3]),_=h=>(t.r0+H(h))/2+40*Math.sin(9*h+x[4]);ee.push({crestAt:S,rmAt:_});const V=.75*(1-Math.exp(-t.rc/2600)),K=m.length/3;for(let h=0;h<t.cols;h++){const z=h/t.cols*2*U,P=Math.cos(z),Q=Math.sin(z),$=_(z),he=H(z),ce=Math.min(t.h1,Math.max(t.h0,S(z)+g[h]*(t.h1-t.h0))),ae=Re(Math.sin(1.5*W),.5+.5*(P*fe+Q*we),b);T(r.cx+t.r0*P,r.y,r.cz+t.r0*Q,w===0?R:re.clone().lerp(ae,Math.min(1,V+.16)),1),T(r.cx+$*P,r.y+.45*ce,r.cz+$*Q,re.clone().lerp(ae,Math.min(1,V+.08)),1),T(r.cx+he*P,r.y+ce,r.cz+he*Q,re.clone().lerp(ae,V),1)}for(let h=0;h<t.cols;h++){const z=K+3*h,P=K+3*((h+1)%t.cols);n.push(z,z+1,P,P,z+1,P+1,z+1,z+2,P+1,P+1,z+2,P+2)}});const J=(t,w)=>Math.hypot(Math.max(c.x0-t,0,t-c.x1),Math.max(c.z0-w,0,w-c.z1)),e=(t,w)=>w<c.z0&&t>20&&t<130,l=v("closing-hedgerows"),d=Math.cos(pe.turn),A=Math.sin(pe.turn),p=s(Fe[3]);for(let t=0,w=0;t<40*r.hedges&&w<r.hedges;t++){const x=l()*2*U,g=100+1500*Math.sqrt(l()),S=60+100*l(),H=7+6*l(),_=l(),V=l(),K=r.cx+g*Math.cos(x),h=r.cz+g*Math.sin(x),z=d*K+A*h,P=Math.round((-A*K+d*h)/pe.row)*pe.row,Q=ne=>[d*(z+ne)-A*P,A*(z+ne)+d*P];let $=V<1/(1+(J(K,h)/500)**2);for(let ne=-.5;ne<=.5;ne+=.25){const[Se,Me]=Q(ne*S),ke=J(Se,Me);(ke<60||ke>900||e(Se,Me))&&($=!1)}if(!$)continue;const[he,ce]=Q(-S/2),[ae,ye]=Q(S/2),be=T(he,r.y,ce,p,2,0,0,_),Pe=T(ae,r.y,ye,p,2,S,0,_),Ce=T(ae,r.y+H,ye,p,2,S,1,_),Ee=T(he,r.y+H,ce,p,2,0,1,_);n.push(be,Pe,Ce,be,Ce,Ee),w++}const u=v("closing-farms"),F=[];for(let t=0,w=16*r.farm;t<w&&F.length<r.farm;t++){const x=u()*2*U,g=100+1750*Math.sqrt(u()),S=1+Math.floor(u()*4),H=u(),_=[u(),u(),u(),u(),u(),u(),u(),u()],V=r.cx+g*Math.cos(x),K=r.cz+g*Math.sin(x),h=J(V,K);if(!(h<60||h>1200||e(V,K)||H>1/(1+(h/350)**2)))for(let z=0;z<S&&F.length<r.farm;z++){const P=V+(_[2*z]-.5)*50,Q=K+(_[2*z+1]-.5)*50,$=J(P,Q);$>=60&&$<=1200&&F.push({x:P,y:r.y+4,z:Q,kind:"farm"})}}const G=v("closing-villages"),te=150+300*G(),Z=(G()-.5)*60*W,ue=400+400*G(),ie=c.z0+(c.z1-c.z0)*(.25+.5*G());for(const[t,w]of[[72+te*Math.sin(Z),c.z1+te*Math.cos(Z)],[c.x0-ue,ie]])for(let x=0;x<18;x++){const g=G()*2*U,S=90*Math.sqrt(G());F.push({x:t+S*Math.cos(g),y:r.y+3+3*G(),z:w+S*Math.sin(g),kind:"hamlet"})}for(let t=0;t<4;t++){const w=(t+.2+.6*G())/4*2*U;for(let x=0;x<6;x++){const g=w+(G()-.5)*.09,S=.1+.5*G(),H=xe[0].r0+(ee[0].rmAt(g)-xe[0].r0)*S;F.push({x:r.cx+H*Math.cos(g),y:r.y+.45*ee[0].crestAt(g)*S+4,z:r.cz+H*Math.sin(g),kind:"village"})}}const oe=new a.BufferGeometry;oe.setAttribute("position",new a.Float32BufferAttribute(m,3)),oe.setAttribute("aTone",new a.Float32BufferAttribute(M,4)),oe.setAttribute("aUv",new a.Float32BufferAttribute(k,3)),oe.setIndex(n);const Ge=Object.assign(a.UniformsUtils.clone(a.UniformsLib.fog),{uField:{value:Fe.map(s)}}),ge=new a.ShaderMaterial({uniforms:Ge,vertexShader:Ye,fragmentShader:Ze,fog:!0,side:a.DoubleSide}),me=new a.Mesh(oe,ge);return me.name="closing-farland",me.frustumCulled=!1,me.castShadow=!1,y.add(me),{group:y,lights:F,tris:n.length/3,dispose(){oe.dispose(),ge.dispose()}}}const $e=`
${He}
attribute vec2 aCorner; attribute vec4 aQ;            // a lamp: (core radius, halo radius, tint, 0 a lantern or 0.25 a plain point); a puff: (its life s, its phase, its size's die, 1 or, near the way, 2); a pool of light: (its radius, its lamp's height over its ground, tint, MINUS its gain)
uniform vec4 uSprite; uniform float uGlowT; uniform float uViewH; uniform vec3 uGlow3;
uniform vec3 uLampOld; uniform vec3 uLampHalo; uniform vec3 uLampPale; uniform vec3 uLampCool; uniform vec3 uSmokeC;
#ifdef USE_FOG
uniform float fogDensity;
#endif
varying vec2 vM; varying vec4 vP; varying vec3 vC; varying vec3 vH; varying vec2 vS; varying vec4 vL; varying vec3 vG; varying vec3 vU;
void main() {
  bendFrameAt(aAnchor);
  vec3 p = position;
  float smoke = step(0.5, aQ.w), nigh = step(1.5, aQ.w), pool = step(aQ.w, -0.01), age = 0.0;
  if (smoke > 0.5) {
    age = fract(uGlowT / max(aQ.x, 1.0) + aQ.y);
    p.y += 8.0 * age * (1.6 - 0.6 * age);               // away from its own ground, in its house's own up: 8 m in a life
    p.z += 0.8 * aQ.x * (age - 0.25 * (1.0 - exp(-4.0 * age)));   // then toward +z: its speed grows from 0 to 0.8 m/s as it leaves (3 to 4.2 m in its 5 to 7 s)
  }
  if (pool > 0.5) p += vec3(aCorner.x * aQ.x, 0.0, -aCorner.y * aQ.x);   // a pool lies IN ITS OWN GROUND'S PLANE (the bend's frame at its lamp's a): never turned to the eye
  vec4 mv = modelViewMatrix * vec4(bendPoint(p), 1.0);
  // UP for this lamp or puff is its own ground's normal (THE ONE RULE), here in the eye's frame
  vec3 upV = (modelViewMatrix * vec4(aAnchor < 0.0 ? vec3(0.0, 1.0, 0.0) : vec3(-bendF.y, bendF.x, 0.0), 0.0)).xyz;
  float u2 = dot(upV.xy, upV.xy), ul = sqrt(max(u2, 0.000001));
  float depth = max(-mv.z, 0.1);
  float mpp = depth * 2.0 / max(projectionMatrix[1][1] * uViewH, 1.0);   // metres a pixel at the lamp's depth
  float air = 1.0;
#ifdef USE_FOG
  float fd = fogDensity * depth * mix(uSprite.z, 1.0, max(smoke, pool));   // (a pool is lit ground: the air's whole law)
  air = exp(-min(fd * fd, 40.0));
#endif
  float rc, rh, hf, form = 0.0;
  if (smoke > 0.5) {
    rh = 0.5 * mix(1.0, 3.0, age) * (0.85 + 0.3 * aQ.z) * (1.0 + 0.2 * nigh); rc = rh; hf = rh;   // a pot's breath 1 m across; 3 m (3.6 near the way) where it ends
    float fade = smoothstep(0.0, 0.08, age) * (1.0 - age) * (1.0 - age);   // whole from its first metre, a quarter by half its life, nothing at its end: a short soft plume, never a streak
    vP = vec4(rh, rh, (0.5 + 0.1 * nigh) * fade, 0.0); vC = uSmokeC; vH = uSmokeC;
  } else {
    float least = 0.5 * uSprite.w * mpp;                // the least drawn radius: 2.5 pixels across
    float kc = max(1.0, least / max(aQ.x, 0.01)), kh = max(1.0, least / max(aQ.y, 0.01));
    rc = aQ.x * kc; rh = aQ.y * kh; hf = max(rh, rc);
    vP = vec4(rc, rh, uSprite.x / (kc * kc), uSprite.y / (kh * kh));
    vC = aQ.z < 0.5 ? uLampOld : (aQ.z < 1.5 ? uLampPale : uLampCool);
    vH = aQ.z < 0.5 ? uLampHalo : mix(vC, uLampHalo, 0.35);
    // THE LANTERN'S FORM, by the footprint ALONE: whole while a pixel is under 0.05 m there (its 0.6 m is 12 pixels),
    // its point from 0.16 m a pixel (under 4); no turn of the gaze changes it
    form = (1.0 - step(0.1, aQ.w)) * (1.0 - smoothstep(0.05, 0.16, mpp));
  }
  if (pool > 0.5) { hf = 0.0; form = 0.0; vP = vec4(aQ.x, aQ.y, -aQ.w, 0.0); }
  vM = aCorner * mix(hf, aQ.x, pool); vS = vec2(smoke + 2.0 * pool, air); vU = upV;
  // the form's up on the sprite's plane: the lamp's own up as it falls there, always of length 1 (where that up lies
  // dead along the sprite's normal it has no fall: the sprite's own up then, so the form is never stretched)
  vL = vec4(u2 > 0.000001 ? upV.xy / ul : vec2(0.0, 1.0), mpp, form);
  vG = (viewMatrix * vec4(uGlow3, 0.0)).xyz;            // the way to the afterglow's light, in the eye's frame (a puff's shading)
  gl_Position = projectionMatrix * (mv + vec4(aCorner * hf, 0.0, 0.0));
  vec3 toEye = mv.xyz * inversesqrt(max(dot(mv.xyz, mv.xyz), 0.0001));
  // THE DEPTH TEST'S PLACE: a lamp's own CORE RADIUS in true metres (aQ.x, the same at every distance) nearer the eye
  // than its middle, so the bracket it hangs by does not cut the lantern; a puff, a ball, by its own radius in metres;
  // a pool, a face of its ground, by nothing
  float poleBy = mix(aQ.x, rh, smoke) * (1.0 - pool);
  vec4 pole = projectionMatrix * vec4(mv.xyz - toEye * min(poleBy, 0.5 * depth), 1.0);
  gl_Position.z = pole.z / max(pole.w, 0.0001) * gl_Position.w;
}
`,Xe=`
#ifdef USE_FOG
uniform vec3 fogColor;
#endif
uniform vec3 uSmokeG; uniform vec3 uSmokeW;
varying vec2 vM; varying vec4 vP; varying vec3 vC; varying vec3 vH; varying vec2 vS; varying vec4 vL; varying vec3 vG; varying vec3 vU;
float gBox(float x, float a, float b, float w) { float k = 1.0 / max(w, 0.0005); return clamp((x - a) * k + 0.5, 0.0, 1.0) * clamp((b - x) * k + 0.5, 0.0, 1.0); }
void main() {
  float r = sqrt(max(dot(vM, vM), 0.000001));
  if (vS.x > 1.5) {
    // A POOL OF LIGHT on its own ground: a lamp h metres over level ground lights it by h^3 / (h^2 + r^2)^1.5 (a point's
    // own law: whole straight under it, a half 0.77 h out, a tenth 1.9 h out), eased to nothing over the outer 0.4 of
    // the pool's radius. vM: metres in the ground's plane from the point under the lamp; vP: radius, h, gain
    float hh = vP.y * vP.y, q = hh / max(hh + r * r, 0.0001);
    float e = q * sqrt(q) * (1.0 - smoothstep(0.6, 1.0, r / max(vP.x, 0.01)));
    gl_FragColor = vec4(vC * (vP.z * e * vS.y), 0.0);
  } else if (vS.x > 0.5) {
    float q = clamp(1.0 - r / max(vP.x, 0.01), 0.0, 1.0), a = q * q * (3.0 - 2.0 * q) * vP.z;
    vec2 n2 = vM / max(vP.x, 0.01); vec3 n = vec3(n2, sqrt(max(1.0 - dot(n2, n2), 0.0)));
    vec3 c = vC + uSmokeG * max(dot(n, vG), 0.0) + uSmokeW * max(-dot(n, vU), 0.0);
#ifdef USE_FOG
    c = mix(fogColor, c, vS.y);
    a *= vS.y;                                          // the air takes the puff itself too: far off it thins away, never a pale patch on what stands behind it
#endif
    gl_FragColor = vec4(c * a, a);
  } else {
    float core = 1.0 - smoothstep(0.55, 1.0, r / max(vP.x, 0.01)), hq = clamp(1.0 - r / max(vP.y, 0.01), 0.0, 1.0);
    vec3 lightC = vC * (vP.z * core * (1.0 - vL.w)) + vH * (vP.w * hq * hq);
    float cover = 0.0;
    if (vL.w > 0.001) {
      vec2 l = vec2(vM.x * vL.y - vM.y * vL.x, dot(vM, vL.xy)) / 1.3; float px = max(vL.z / 1.3, 0.0005);
      float w = 0.19 + 0.13 * l.y, wc = 0.29 - 1.9 * (l.y - 0.31);
      float glass = gBox(l.x, -w, w, px) * gBox(l.y, -0.31, 0.31, px);
      float iron = max(gBox(l.x, -wc, wc, px) * gBox(l.y, 0.31, 0.43, px), gBox(l.x, -0.17, 0.17, px) * gBox(l.y, -0.36, -0.29, px));
      iron = max(iron, gBox(l.x, -0.012, 0.012, px) * gBox(l.y, 0.43, 0.80, px));   // the rod it hangs by, from its wall's bracket or its arcade's vault: no post stands under it
      float bars = max(1.0 - gBox(l.x, -w + 0.03, w - 0.03, px), gBox(l.x, -0.012, 0.012, px));
      float heart = exp(-min(dot(l, l) / 0.0081, 20.0));
      vec3 lit = vC * (0.6 * (1.0 - 0.75 * bars) * (0.7 + 0.3 * clamp(1.0 - abs(l.y) / 0.31, 0.0, 1.0)) + 6.0 * heart);
      lightC += mix(lit * glass, vec3(0.012, 0.011, 0.012), iron) * vL.w;
      cover = vL.w * max(glass, iron);
    }
    gl_FragColor = vec4(lightC * vS.y, cover);
  }
}
`,ve={street:[.25,2.4,0,0],wide:[.25,2.4,0,0],gate:[.25,2.4,0,0],post:[.25,2.4,0,0],square:[.25,2.4,1,0],bracket:[.25,2.4,1,0],wall:[.25,2.4,1,0],arcade:[.2,2,1,0],bulb:[.08,.4,0,.25],farm:[1.5,6,0,.25],village:[2,8,0,.25],hamlet:[1,4,0,.25]};function Je(f){const o=f.length,v=new Float32Array(o*12),y=new Float32Array(o*4),i=new Float32Array(o*8),R=new Float32Array(o*16),b=o*4>65535?new Uint32Array(o*6):new Uint16Array(o*6),E=[-1,-1,1,-1,1,1,-1,1];for(let m=0;m<o;m++){const M=f[m];for(let k=0;k<4;k++){const n=m*4+k;v[n*3]=M.x,v[n*3+1]=M.y,v[n*3+2]=M.z,y[n]=M.anchor,i[n*2]=E[k*2],i[n*2+1]=E[k*2+1],R[n*4]=M.q[0],R[n*4+1]=M.q[1],R[n*4+2]=M.q[2],R[n*4+3]=M.q[3]}b.set([m*4,m*4+1,m*4+2,m*4,m*4+2,m*4+3],m*6)}const c=new a.BufferGeometry;return c.setAttribute("position",new a.BufferAttribute(v,3)),c.setAttribute("aAnchor",new a.BufferAttribute(y,1)),c.setAttribute("aCorner",new a.BufferAttribute(i,2)),c.setAttribute("aQ",new a.BufferAttribute(R,4)),c.setIndex(new a.BufferAttribute(b,1)),c}const et=3600,tt=150,ot=7;function rt(f,o={}){const v=e=>f.core.makeRng(f.core.hashSeed(e+":"+f.seed)),y=new a.Group;y.name="closing-glow";const i=o.plan||{},R=i.flat||{},b=o.light&&o.light.lit||{},E=[],c=(e,l,d,A,p,u)=>{if(E.length>=et)return!1;const F=ve[p]||ve.street;return E.push({anchor:e,x:l,y:d,z:A,q:[F[0],F[1],u===void 0?F[2]:u,F[3]]}),!0},m=[],M={bracket:1,wall:1,arcade:1},k=(e,l,d,A,p,u,F,G)=>m.push({anchor:e,x:l,y:d,z:A,q:[p,u,G,-F]});let n=0,Y=0;for(const e of i.lamps||[]){e.kind==="bulb"&&n++,e.kind==="bracket"&&Y++;const l=Math.min(596.5,Math.max(0,e.a));c(l,0,e.h,e.z,e.kind),M[e.kind]&&k(l,0,.08,e.z,1.6*e.h,e.h,.5,1)}const T=v("closing-lampcool");for(const e of R.lamps||[]){const l=T()<.14285714285714285,d=e.kind||"street";if(d==="bulb"&&n++,d==="bracket"&&Y++,c(-1,e.x,e.y,e.z,d,l&&(d==="street"||d==="wide")?2:void 0),M[d]){const A=Math.max(2,e.y-L.Y0);k(-1,e.x,L.Y0+.08,e.z,1.6*A,A,.5,1)}}const C=R.lattice;if(C&&!Y)for(let e=C.z0-C.step*Math.floor((C.z0+60)/C.step);e<=(L.TOWN_Z1||L.RING_Z-10);e+=C.step){const l=C.y-L.Y0,d=Math.max(0,C.xL-L.HX);C.gapL&&e>C.gapL[0]&&e<C.gapL[1]||(c(d,0,l,e,"bracket"),k(d,0,.08,e,1.6*l,l,.5,1)),c(-1,C.xR,C.y,e,"bracket"),k(-1,C.xR,L.Y0+.08,e,1.6*l,l,.5,1)}for(const e of o.own||[])c(-1,e.x,e.y,e.z,ve[e.kind]?e.kind:"gate");{const e=L.RING_Y-L.Y0;k(-1,L.RING_X,L.Y0+.1,L.RING_Z,3*e,e,.7,0)}for(const e of o.far||[])c(-1,e.x,e.y,e.z,ve[e.kind]?e.kind:"farm");if(!n)for(const e of i.strings||[]){const l=Math.hypot(e.a1-e.a0,e.z1-e.z0),d=Math.max(1,Math.floor(l/1.5));for(let A=1;A<d;A++){const p=A/d,u=e.a0+(e.a1-e.a0)*p,F=e.z0+(e.z1-e.z0)*p,G=e.h0===void 0?e.h:e.h0,te=e.h1===void 0?e.h:e.h1,Z=G+(te-G)*p-.3*4*p*(1-p);u>=0?c(u,0,Z,F,"bulb"):c(-1,90+u,7+Z,F,"bulb")}}const B=v("closing-smoke"),N=B(),q=[],D=(o.chimneys||[]).filter(e=>!(e.a>=0&&e.a<60)),X=Math.min(tt,D.length);for(let e=0;e<X;e++){const l=D[Math.min(D.length-1,Math.floor((e+N)*D.length/X))],d=5+2*B(),A=B(),p=B(),u=l.a>=0,F=u?0:l.x,G=u?l.top:l.y,te=l.z,Z=(u?l.a+18:Math.abs(l.x-72))<150,ue=Z?10:ot;for(let ie=0;ie<ue;ie++)q.push({anchor:u?Math.min(596.5,l.a):-1,x:F,y:G,z:te,q:[d,A+ie/ue,p,Z?2:1]})}const se=o.bend&&o.bend.uniforms?o.bend.uniforms.uBendK:{value:new Float32Array(260)},j=Object.assign(a.UniformsUtils.clone(a.UniformsLib.fog),{uBendK:se,uGlowT:{value:0},uViewH:{value:450},uSprite:b.uSprite||{value:new a.Vector4(3,.36,.4,2.5)},uLampOld:b.uLampOld||{value:s(I.old)},uLampHalo:b.uLampHalo||{value:s(I.halo)},uLampPale:b.uLampPale||{value:s(I.pale)},uLampCool:b.uLampCool||{value:s(I.cool)},uSmokeC:{value:s("#9a96b4").multiplyScalar(.45)},uSmokeG:{value:(b.uBand?b.uBand.value.clone():s(de.amber.band)).multiplyScalar(.7)},uSmokeW:{value:s("#c88a6a").multiplyScalar(.22)},uGlow3:b.uGlow3||{value:new a.Vector3(Math.sin(le*W),.1,-Math.cos(le*W))}}),fe=new a.ShaderMaterial({uniforms:j,vertexShader:$e,fragmentShader:Xe,fog:!0,transparent:!0,depthWrite:!1,depthTest:!0,blending:a.CustomBlending,blendEquation:a.AddEquation,blendSrc:a.OneFactor,blendDst:a.OneMinusSrcAlphaFactor,blendSrcAlpha:a.OneFactor,blendDstAlpha:a.OneMinusSrcAlphaFactor}),we=new a.Vector2,re=e=>{const l=e.getRenderTarget();j.uViewH.value=l?l.height:e.getDrawingBufferSize(we).y},ee=[],J=(e,l,d)=>{const A=Je(e),p=new a.Mesh(A,fe);return ee.push(A),p.name=l,p.frustumCulled=!1,p.renderOrder=d,p.castShadow=!1,p.onBeforeRender=re,y.add(p),p};return J(m.concat(E),"closing-lamps",5),J(q,"closing-smoke",6),{group:y,count:E.length,pools:m.length,smoking:X,tris:2*(E.length+m.length+q.length),update(e){j.uGlowT.value=e},dispose(){for(const e of ee)e.dispose();fe.dispose()}}}export{de as GLOWS,le as GLOW_AZIMUTH,Ue as GLOW_LIGHT_UP,Ae as SUN_UNDER,st as makeFar,rt as makeGlow,lt as makeLight};
