import*as t from"three";import{makeDetailTexture as h,makeStrata as y,cellOf as p,rngOf as w}from"./textures.js";const n=a=>a&&a.isColor?a.clone():new t.Color(a),S=`
varying vec3 vTWorld; varying vec3 vTNormal; varying vec3 vTShade;
#ifdef T_SHADE
attribute vec2 aShade;
#endif
#ifdef T_ROCK
uniform vec4 uTGround;      // contact height (x scale), contact darkening, ao relax height, sink bias
#endif
#ifdef T_SHADEMAP
uniform sampler2D tShade; uniform vec4 uTShadeBox;
#endif
`,b=`
{ vec4 tw = vec4(transformed, 1.); vec3 tn = objectNormal; mat4 tm = modelMatrix;
  #ifdef USE_INSTANCING
    tm = modelMatrix * instanceMatrix;
  #endif
  vTWorld = (tm * tw).xyz; vTNormal = mat3(tm) * tn; vTShade = vec3(1.);
  #ifdef T_SHADE
    vTShade.xy = aShade;
  #endif
  #ifdef T_ROCK
    float tsc = length(tm[1].xyz);
    vTShade.z = mix(1. - uTGround.y, 1., smoothstep(0., uTGround.x * tsc, vTWorld.y - tm[3].y + uTGround.w * tsc));
  #endif
  #ifdef T_SHADEMAP
    vec4 sm = texture2D(tShade, (vTWorld.xz - uTShadeBox.xy) * uTShadeBox.zw);
    vTShade.x = max(sm.r, smoothstep(sm.b - 1., sm.b + 7., vTWorld.y));          // sm.b: height above which the sun is visible here
    vTShade.y = mix(sm.g, 1., smoothstep(0., uTGround.z, vTWorld.y - sm.a));     // sm.a: ground height
  #endif
}`,k=`
uniform sampler2D tDetail, tCell, tStrata;
uniform vec4 uTScale;    // tiles per metre: macro, mid, fine, side
uniform vec3 uTRock, uTRockB, uTSnow, uTPatch, uTGlowColor, uTWetTint, uTTop;
uniform vec4 uTSlope;    // rock lo, rock hi, snow lo, snow hi  (thresholds on normal.y)
uniform vec4 uTSnowP;    // line (m), blend (m), noise amplitude (m), amount
uniform vec4 uTStrata;   // amount, 1 / span (1/m), warp (m), varnish
uniform vec4 uTWet;      // level (m), range (m), amount, roughness
uniform vec4 uTDetail;   // albedo strength, bump strength, patch amount, streak strength
uniform vec4 uTGlow;     // level (m), range (m), intensity, strata base (m)
uniform vec4 uTTopP;     // lo, hi, amount, crack darkening   (rock material)
uniform vec4 uTNear;     // near-field layers: pebbles, cracks, ripples, tufts
uniform vec4 uTWind;     // xy = wind direction (xz), z = 2 pi / ripple wavelength, w = sparkle
uniform vec4 uTFx;       // lee-side darkening, drifting sand / spindrift, relief of the beds, time
uniform vec4 uTCloud;    // xy = offset, z = 1 / size (1/m), w = amount
uniform vec3 uTBounce;    // irradiance bounced off sunlit ground into the shade (fills canyons with warm light)
varying vec3 vTWorld; varying vec3 vTNormal; varying vec3 vTShade;
float gTSnow = 0., gTWet = 0., gTSpark = 0.; vec3 gTGrad = vec3(0.), gTEmit = vec3(0.);
`,F=`
  normal = normalize(normal - uTDetail.y * (1. + 2. * smoothstep(60., 5., length(vViewPosition))) * (viewMatrix * vec4(gTGrad, 0.)).xyz);
`,z=`
  roughnessFactor = mix(roughnessFactor, uTWet.w, gTWet);
  roughnessFactor = mix(roughnessFactor, .72, gTSnow);
  roughnessFactor = mix(roughnessFactor, .32, gTSpark);
`,D=`
  { float tsun = vTShade.x * vTShade.z, tamb = vTShade.y * (.35 + .65 * vTShade.z);
    #ifdef T_CLOUD
      float tcl = texture2D(tDetail, vTWorld.xz * uTCloud.z + uTCloud.xy).r;
      tsun *= 1. - uTCloud.w * smoothstep(.46, .66, tcl);
    #endif
    reflectedLight.directDiffuse *= tsun; reflectedLight.directSpecular *= tsun;
    // sunlight bounced off the lit ground into the shade: scales with the scene's first directional light (none: no bounce)
    #if NUM_DIR_LIGHTS > 0
      reflectedLight.indirectDiffuse += diffuseColor.rgb * uTBounce * directionalLights[0].color * (.4 * RECIPROCAL_PI * (1. - .75 * tsun));
    #endif
    reflectedLight.indirectDiffuse *= tamb; reflectedLight.indirectSpecular *= tamb; }
`,C=`
{ vec3 wp = vTWorld; vec3 wnS = normalize(vTNormal);
  float vd = length(vViewPosition), nearK = smoothstep(95., 9., vd), midK = smoothstep(280., 30., vd);
  float steep = smoothstep(.8, .5, wnS.y), flatK = 1. - steep;
  // top projection: macro, mid and fine layers at unrelated scales (the macro layer bends the others, hiding the tiling)
  vec4 tM = texture2D(tDetail, wp.xz * uTScale.x);
  vec2 bend = vec2(tM.r, 1. - tM.r) * .6;
  vec4 tD = texture2D(tDetail, wp.xz * uTScale.y + bend * .3);
  // fine layer: top projection on flat ground, a side projection on steep ground (no vertical smearing). The choice is
  // dithered by the mid layer, so one lookup serves both without a visible seam. The mid layer smears into streaks on cliffs.
  const vec2 hA = vec2(.8, .6);
  vec2 uvF = wp.zx * uTScale.z + bend, uvT = vec2(dot(wp.xz, hA), wp.y) * uTScale.z * .41 + bend;
  bool side = steep > .2 + .6 * tD.r;
  vec2 fGx = side ? dFdx(uvT) : dFdx(uvF), fGy = side ? dFdy(uvT) : dFdy(uvF);
  vec4 tF = textureGrad(tDetail, side ? uvT : uvF, fGx * .66, fGy * .66);
  // a layer is dropped before its tile gets small enough on screen to read as a lattice of repeats (40 px), full from 160 px
  float fineK = smoothstep(.025, .00625, sqrt(length(fGx) * length(fGy)));
  float midF = smoothstep(.03, .008, sqrt(length(dFdx(wp.xz)) * length(dFdy(wp.xz))) * uTScale.y);
  tF = mix(vec4(.5, .5, .5, 0.), tF, fineK);
  // rock where it is steep, with an organic edge
  float sl = wnS.y + (tD.r - .5) * .3 + (tM.r - .5) * .12 + (tF.r - .5) * .1;
  float rock = 1. - smoothstep(uTSlope.x, uTSlope.y, sl);
  // beds from the strata table; their relief comes from the screen-space gradient of the hardness (no second lookup)
  float sy = wp.y + (tM.r - .5) * uTStrata.z + (tD.r - .5) * uTStrata.z * .15;
  vec4 st = texture2D(tStrata, vec2((sy - uTGlow.w) * uTStrata.y, .5));
  vec2 dA = vec2(dFdx(st.a), dFdy(st.a)), dY = vec2(dFdx(sy), dFdy(sy));
  float bed = clamp(dot(dA, dY) / max(dot(dY, dY), 1e-6) * .5, -1., 1.) * uTFx.z * uTStrata.x * rock * steep * smoothstep(.45, .1, length(dY));   // only while a bed spans several pixels (else it dots)
  float dR = mix(.5, tD.r, midF), fR = tF.r, fA = tF.a;
  // ----- ground
  vec3 c = diffuseColor.rgb;
  float macro = smoothstep(.36, .66, tM.r);
  c = mix(c, c * uTPatch, macro * uTDetail.z);
  c = mix(c, c * mix(vec3(1.), uTPatch, .7), smoothstep(.5, .72, tD.r) * uTDetail.z * flatK);
  vec2 wd = uTWind.xy;
  c *= 1. - uTFx.x * smoothstep(.06, .45, dot(wnS.xz, wd)) * vec3(.9, 1., 1.12) * .5;      // slip faces: darker and cooler
  vec3 gNear = vec3(0.);
  #ifdef T_NEAR
  { float gk = flatK * (1. - rock);
    vec2 uv1 = wp.xz * uTScale.z * .83 + bend.yx, uv2 = vec2(.8 * wp.x + .6 * wp.z, -.6 * wp.x + .8 * wp.z) * uTScale.z * .19 + bend * .5;
    vec2 d1x = dFdx(uv1) * .62, d1y = dFdy(uv1) * .62, d2x = dFdx(uv2) * .75, d2y = dFdy(uv2) * .75;
    float rp = dot(wp.xz, wd) * uTWind.z + tD.r * 7. + tM.r * 11. + (tF.r - .5) * 1.3;
    vec2 wd2 = vec2(wd.x * .94 - wd.y * .34, wd.x * .34 + wd.y * .94);
    float rp2 = dot(wp.xz, wd2) * uTWind.z * .21 + tM.r * 9. + tD.r * 3.;
    float rw = fwidth(rp), rw2 = fwidth(rp2);
    #ifdef T_TUFT
    vec2 uv3 = vec2(wp.x + wp.z * .35, wp.z - wp.x * .2) * uTScale.z * vec2(.85, .4) + bend, d3x = dFdx(uv3) * .7, d3y = dFdy(uv3) * .7;
    #endif
    if (gk * midK > .004) {
      vec4 c1 = textureGrad(tCell, uv1, d1x, d1y), c2 = textureGrad(tCell, uv2, d2x, d2y);
      float dens = smoothstep(.3, .72, tD.r * .6 + tM.r * .4);                       // stones gather in patches
      float p1 = smoothstep(.1, .3, c1.r) * nearK * (.3 + .7 * dens), p2 = smoothstep(.34, .5, c2.r) * midK * dens;
      float peb = max(p1, p2) * uTNear.x * gk;
      vec3 stone = mix(c, uTRock, .65) * (.72 + .55 * max(c1.r * p1, c2.r * p2) + .3 * (tF.r - .5));
      float ck = max((1. - smoothstep(.0, .1, c1.a)) * nearK, (1. - smoothstep(.0, .06, c2.a)) * midK) * uTNear.y * gk * (1. - peb) * (.35 + .65 * (1. - dens));
      c *= 1. + uTNear.y * gk * .16 * (c2.a - .55) * midK;                           // plates: lighter in the middle
      c *= 1. - .6 * ck;
      c = mix(c, stone, peb);
      vec2 g1 = (c1.gb - .5) * p1, g2 = (c2.gb - .5) * p2;
      gNear = vec3(g1.x + .8 * g2.x - .6 * g2.y, 0., g1.y + .6 * g2.x + .8 * g2.y) * (2.2 * uTNear.x * gk);
      // wind ripples: fine ones under the camera, mega-ripples for the middle distance
      float ra = uTNear.z * gk * (1. - peb) * smoothstep(1.7, .5, rw), ra2 = uTNear.z * gk * smoothstep(1.1, .3, rw2);
      c *= 1. + ra * .07 * sin(rp + .9) + ra2 * .035 * sin(rp2 + .9);
      gNear += vec3(wd.x, 0., wd.y) * (cos(rp) + .45 * cos(2. * rp + 1.)) * ra * .34 + vec3(wd2.x, 0., wd2.y) * cos(rp2) * ra2 * .13;
      gTSpark = uTWind.w * gk * nearK * smoothstep(.72, .98, c1.r * (.6 + .8 * tF.r));
      #ifdef T_TUFT
      { // tufts: elongated clumps (grass, moss, lichen), darker between, lighter tips
        vec4 tu = textureGrad(tCell, uv3, d3x, d3y);
        float tk = uTNear.w * gk * (1. - peb) * nearK, tf = smoothstep(.15, .7, tu.r) * (.6 + .8 * tF.r);
        c *= 1. + tk * (tf * .55 - .26);
        c = mix(c, c * uTPatch * 1.25, tk * smoothstep(.75, 1., tu.r * (.6 + .8 * tD.r)) * .5);
        gNear += vec3(tu.g - .5, 0., (tu.b - .5) * .4) * tk * 1.6; }
      #endif
    }
  }
  #endif
  #ifdef T_DRIFT
  { vec2 dq = vec2(dot(wp.xz, wd), dot(wp.xz, vec2(-wd.y, wd.x)));
    float dr = texture2D(tDetail, dq * vec2(1. / 110., 1. / 13.) - vec2(uTFx.w * .16, tM.r * .2)).r;
    float drift = smoothstep(.5, .78, dr) * smoothstep(.3, .62, tM.r + .25 * sin(uTFx.w * .21 + dq.x * .011)) * uTFx.y * flatK * (1. - rock);
    c = mix(c, c * 1.22 + uTPatch * .05, drift); }
  #endif
  // ----- rock: beds from the strata table, soft beds dusty, hard beds clean; varnish streaks down the steep faces
  vec3 rc = mix(uTRock, st.rgb * st.rgb, uTStrata.x);
  rc = mix(mix(rc, c, .22 * uTStrata.x), rc, st.a);
  rc *= 1. - uTStrata.w * smoothstep(.42, .82, tD.r * .75 + tM.r * .25) * steep * (.35 + .65 * st.a);
  rc *= 1. + uTDetail.w * (tD.r - .5) * .6 * steep;
  #ifdef T_JOINT
  { // joints: a net of fractures cuts the cliffs into blocks (side projection on the dominant axis; read from 20 m to ~600 m)
    bool jx = abs(wnS.x) > abs(wnS.z);
    vec2 uvJ = vec2(jx ? wp.z : wp.x, wp.y * 1.6) * uTScale.w + bend * .7;
    vec2 jdx = vec2(jx ? dFdx(wp.z) : dFdx(wp.x), dFdx(wp.y) * 1.6) * uTScale.w, jdy = vec2(jx ? dFdy(wp.z) : dFdy(wp.x), dFdy(wp.y) * 1.6) * uTScale.w;
    float jK = smoothstep(.022, .006, sqrt(length(jdx) * length(jdy))) * rock * steep * uTTopP.x;
    if (jK > .01) {
      vec4 cj = textureGrad(tCell, uvJ, jdx, jdy);
      rc *= (1. - .5 * jK * (1. - smoothstep(.0, .11, cj.a)) * (.4 + 1.2 * tM.r)) * (1. + .3 * jK * (cj.a - .5));
    } }
  #endif
  c = mix(c, rc, rock);
  // fine breakup on everything
  float grain = (dR - .5) * .7 + (fR - .5) * .9 + (macro - .5) * .16;
  c *= 1. + uTDetail.x * grain * (1. + .6 * rock);
  c *= 1. - uTDetail.x * .3 * smoothstep(.55, .95, fA) * (.1 + .9 * rock) * (.4 + 1.2 * tM.r);
  // wet shoreline
  float wet = (1. - smoothstep(uTWet.x, uTWet.x + uTWet.y, wp.y + (tD.r - .5) * uTWet.y * .8)) * uTWet.z;
  c *= mix(vec3(1.), uTWetTint, wet);
  // snow above the line, where it is not too steep; bluer where the sun does not reach
  float sn = smoothstep(uTSnowP.x - uTSnowP.y, uTSnowP.x + uTSnowP.y, wp.y + (tM.r - .5) * uTSnowP.z + (tD.r - .5) * uTSnowP.z * .35);
  sn *= smoothstep(uTSlope.z, uTSlope.w, wnS.y + (tD.r - .5) * .2 + (tF.r - .5) * .08) * uTSnowP.w;
  c = mix(c, uTSnow * mix(vec3(.8, .89, 1.03), vec3(1.), vTShade.x) * (1. + (fR - .5) * .1 + (dR - .5) * .08), sn);
  diffuseColor.rgb = c;
  gTSnow = sn; gTWet = wet; gTSpark *= 1. - rock;
  vec3 gMid = vec3(tD.g - .5, 0., tD.b - .5) * (.6 * flatK * midF);
  vec3 gFine = side ? vec3(hA.x * (tF.g - .5), tF.b - .5, hA.y * (tF.g - .5)) * 1.2 : vec3(tF.b - .5, 0., tF.g - .5) * .9;
  gTGrad = (gMid + gFine + gNear * (1. - sn) + vec3(0., bed * 1.2, 0.)) * (1. + .8 * rock) * (1. - .7 * sn);   // hard beds stand proud
  #ifdef T_GLOW
  { // glowing seams between crust plates: wide and molten in the lowest, most enclosed ground, thinning uphill
    float gy = wp.y + (tM.r - .5) * uTGlow.y * 1.4 + (vTShade.y - .85) * uTGlow.y * 2.5;
    float heat = 1. - smoothstep(uTGlow.x - uTGlow.y * .5, uTGlow.x + uTGlow.y, gy);
    vec2 gw = wp.xz + (tM.gb - .5) * 50. + (tD.gb - .5) * 5.;
    vec4 g1 = texture2D(tCell, gw * (1. / 97.) + uTFx.w * vec2(.0009, .0006));
    vec4 g2 = texture2D(tCell, vec2(.8 * gw.x + .6 * gw.y, -.6 * gw.x + .8 * gw.y) * (1. / 19.) - uTFx.w * vec2(.0035, .001));
    float w1 = mix(.015, .3, heat * heat) * (.45 + 1.1 * tD.r);
    float e1 = 1. - smoothstep(0., w1, g1.a), e2 = 1. - smoothstep(0., w1 * .8 + .015, g2.a);
    float temp = max(e1, e2 * (.25 + .5 * e1 + .5 * heat * heat)) * smoothstep(0., .12, heat);
    temp = mix(temp, heat * heat * .3, clamp(fwidth(gw.x) * .03, 0., 1.));         // far away: the average glow of the field
    temp *= .78 + .22 * sin(uTFx.w * .8 + tM.r * 14. + tD.r * 6.);
    vec3 gc = uTGlowColor, cool = gc * gc * .45, hot = mix(gc, vec3(1., .9, .66), .6);
    vec3 ramp = mix(cool, gc, smoothstep(.12, .5, temp)); ramp = mix(ramp, hot, smoothstep(.68, 1., temp)) * (1. - .28 * temp * temp);   // the core stays under the bloom's white-out
    diffuseColor.rgb *= 1. - .45 * heat * (1. - temp);                              // cooled crust is darker than the country rock
    gTEmit = (ramp * temp * uTGlow.z + gc * (diffuseColor.rgb + .03) * heat * .16 * uTGlow.z) * (1. - sn);
  }
  #endif
}`,G=`
{ vec3 wp = vTWorld;
  #ifdef FLAT_SHADED
    vec3 wn = normalize(cross(dFdx(wp), dFdy(wp)));
  #else
    vec3 wn = normalize(vTNormal);
  #endif
  float nearK = smoothstep(120., 10., length(vViewPosition));
  vec3 aw = abs(wn); aw *= aw; aw *= aw; aw /= (aw.x + aw.y + aw.z);
  float s = uTScale.y;
  vec4 tx = texture2D(tDetail, wp.zy * s), ty = texture2D(tDetail, wp.xz * s), tz = texture2D(tDetail, wp.xy * s);
  vec4 t = tx * aw.x + ty * aw.y + tz * aw.z;
  vec4 tf = texture2D(tDetail, (wp.xz + wp.yy * vec2(.83, .57)) * uTScale.z, -.5);
  vec4 tm = texture2D(tDetail, (wp.xz + wp.yy * vec2(.6, .8)) * uTScale.x);
  vec4 tc = texture2D(tCell, (wp.xz + wp.yy * vec2(.57, .83)) * uTScale.z * .45, -.5);
  vec3 c = diffuseColor.rgb;
  #ifdef T_STRATA
  { float sy = wp.y + (tm.r - .5) * uTStrata.z + (t.r - .5) * uTStrata.z * .2;
    vec2 suv = vec2((sy - uTGlow.w) * uTStrata.y, .5);
    vec4 st = texture2D(tStrata, suv);
    float lv = clamp(dot(c, vec3(.3333)) / max(dot(uTRock, vec3(.3333)), .02), .6, 1.45);
    c = mix(c, st.rgb * st.rgb * lv, uTStrata.x);
    vec2 dA = vec2(dFdx(st.a), dFdy(st.a)), dY = vec2(dFdx(sy), dFdy(sy));
    gTGrad.y = clamp(dot(dA, dY) / max(dot(dY, dY), 1e-6) * .5, -1., 1.) * uTFx.z * uTStrata.x * (1. - aw.y) * smoothstep(.45, .1, length(dY));
    // desert varnish: dark vertical streaks on the steep faces (the top projection smears into streaks there)
    c *= 1. - uTStrata.w * smoothstep(.42, .8, ty.r + .5 * aw.y) * (1. - aw.y) * (.4 + .6 * st.a); }
  #endif
  c *= 1. + uTDetail.x * ((t.r - .5) * 1.2 + (tf.r - .5) * .7 + (tm.r - .5) * .5);
  c *= 1. - uTTopP.w * smoothstep(.5, .98, max(t.a, tm.a * .8)) * (.3 + 1.4 * tm.r);
  c *= 1. - uTTopP.w * 1.6 * (1. - smoothstep(0., .07, tc.a)) * nearK * (.3 + .7 * tm.r);       // crisp joints up close
  float top = smoothstep(uTTopP.x, uTTopP.y, wn.y + (t.r - .5) * .5 + (tf.r - .5) * .2) * uTTopP.z;
  c = mix(c, uTTop * (1. + (tf.r - .5) * .3 + (tc.r - .4) * .25 * nearK), top);
  float wet = (1. - smoothstep(uTWet.x, uTWet.x + uTWet.y, wp.y + (t.r - .5) * uTWet.y)) * uTWet.z;
  c *= mix(vec3(1.), uTWetTint, wet);
  diffuseColor.rgb = c; gTWet = wet; gTSnow = top * .5;
  gTGrad += aw.x * vec3(0., tx.b - .5, tx.g - .5) + aw.y * vec3(ty.g - .5, 0., ty.b - .5) + aw.z * vec3(tz.g - .5, tz.b - .5, 0.);
  gTGrad *= 1.6 * (1. - .6 * top) * (1. - .5 * smoothstep(45., 6., length(vViewPosition)));   // close up the shared near-field boost is too much for rock
}`;function x(a,e,l,r,c){a.defines={...a.defines||{},...r},a.onBeforeCompile=o=>{Object.assign(o.uniforms,e),o.vertexShader=o.vertexShader.replace("#include <common>",`#include <common>
`+S).replace("#include <begin_vertex>",`#include <begin_vertex>
`+b),o.fragmentShader=o.fragmentShader.replace("#include <common>",`#include <common>
`+k).replace("#include <color_fragment>",`#include <color_fragment>
`+(l==="rock"?G:C)).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
`+z).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
`+F).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
  totalEmissiveRadiance += gTEmit;`).replace("#include <aomap_fragment>",`#include <aomap_fragment>
`+D)},a.customProgramCacheKey=()=>"kit-terrain2-"+l,a.userData.uniforms=e,Object.assign(a,c),a.userData.dispose=()=>{for(const o in c)c[o]&&c[o].dispose();a.dispose()}}const R=a=>{const e=a.wind??.5;return Array.isArray(e)?e:[Math.cos(e),Math.sin(e)]},g=a=>({value:new t.Vector4(0,0,1/(a.cloudSize??900),a.clouds??0)});function A(a={}){const e=a,l=e.scale??1,r=e.detailTexture||h({rng:w(e)}),c=e.strataTable||y({rng:w(e),rock:e.rock??"#8e867c",rockB:e.rockB??e.rock??"#6f6860",accent:e.strataAccent,beds:e.strataBeds,thickness:e.strataScale??7}),o=e.rockSlope||[.62,.8],f=e.snowSlope||[.45,.72],i=R(e),d=e.cloudSpeed??9,T={tDetail:{value:r},tCell:{value:p(r)},tStrata:{value:c.texture},uTScale:{value:new t.Vector4(l/173,l/23,l/3.7,l/41)},uTRock:{value:n(e.rock??"#8e867c")},uTRockB:{value:n(e.rockB??e.rock??"#6f6860")},uTSnow:{value:n(e.snow??"#d6dde9")},uTPatch:{value:n(e.patch??"#cfc49a")},uTGlowColor:{value:n(e.glow??"#ff5a1c")},uTWetTint:{value:n(e.wetTint??"#5b5f66")},uTTop:{value:n("#ffffff")},uTSlope:{value:new t.Vector4(o[0],o[1],f[0],f[1])},uTSnowP:{value:new t.Vector4(e.snowLine??1e6,e.snowBlend??14,e.snowNoise??40,e.snow===null||e.snowLine==null?0:e.snowAmount??1)},uTStrata:{value:new t.Vector4(e.strata??.6,1/c.span,e.strataWarp??5,e.varnish??.45)},uTWet:{value:new t.Vector4(e.waterLevel??-1e6,e.wetRange??1.6,e.waterLevel==null?0:e.wet??.6,e.wetRoughness??.3)},uTDetail:{value:new t.Vector4(e.detail??.6,e.bump??.8,e.patchAmount??.35,e.streaks??.6)},uTGlow:{value:new t.Vector4(e.glowLevel??0,e.glowRange??20,e.glow?e.glowIntensity??3:0,c.base)},uTTopP:{value:new t.Vector4(e.joints??.5,1,0,0)},uTNear:{value:new t.Vector4(e.pebbles??.5,e.cracks??.2,e.ripples??0,e.tufts??0)},uTWind:{value:new t.Vector4(i[0],i[1],Math.PI*2/(e.rippleLength??1.5),e.sparkle??0)},uTFx:{value:new t.Vector4(e.lee??0,e.drift??0,e.bedRelief??1.2,0)},uTCloud:e.cloudUniform||g(e),uTBounce:{value:(e.bounce!=null?n(e.bounce):c.meanColor.clone().lerp(n(e.patch??"#cfc49a"),.3)).multiplyScalar(e.bounceAmount??1)}},s=T,u={};e.shade&&(u.T_SHADE=""),s.uTNear.value.lengthSq()>0&&(u.T_NEAR=""),s.uTNear.value.w>0&&(u.T_TUFT=""),s.uTTopP.value.x>0&&(u.T_JOINT=""),s.uTFx.value.y>0&&(u.T_DRIFT=""),s.uTGlow.value.z>0&&(u.T_GLOW=""),s.uTCloud.value.w>0&&(u.T_CLOUD="");const m=new t.MeshStandardMaterial({vertexColors:!0,roughness:e.roughness??.94,metalness:0,flatShading:!!e.flat});return x(m,T,"terrain",u,{detailMap:r,cellMap:p(r),strataMap:c.texture}),m.userData.strata=c,m.userData.update=v=>{s.uTFx.value.w=v,s.uTCloud.value.x=-i[0]*d*v*s.uTCloud.value.z,s.uTCloud.value.y=-i[1]*d*v*s.uTCloud.value.z},m}function M(a={}){const e=a,l=e.scale??1,r=e.terrain||null,c=e.detailTexture||r&&r.detailTexture||h({rng:w(e)}),o=e.strataTable||r&&r.strata||null,f=e.topSlope||[.5,.85],i=e.contact||[.45,.55,-.2],d={tDetail:{value:c},tCell:{value:p(c)},tStrata:{value:o?o.texture:null},uTScale:{value:new t.Vector4(l/61,l/9.3,l/2.1,l/9.3)},uTRock:{value:o?o.meanColor.clone():n("#ffffff")},uTRockB:{value:n("#ffffff")},uTSnow:{value:n("#ffffff")},uTPatch:{value:n("#ffffff")},uTGlowColor:{value:n("#000000")},uTWetTint:{value:n(e.wetTint??"#5b5f66")},uTTop:{value:n(e.top??"#5d6b3a")},uTSlope:{value:new t.Vector4(0,1,0,1)},uTSnowP:{value:new t.Vector4(1e6,1,0,0)},uTStrata:{value:new t.Vector4(o?e.strata??.55:0,o?1/o.span:1,e.strataWarp??3,e.varnish??.35)},uTWet:{value:new t.Vector4(e.waterLevel??-1e6,e.wetRange??1.2,e.waterLevel==null?0:e.wet??.6,e.wetRoughness??.3)},uTDetail:{value:new t.Vector4(e.detail??.6,e.bump??1,0,0)},uTGlow:{value:new t.Vector4(0,1,0,o?o.base:0)},uTTopP:{value:new t.Vector4(f[0],f[1],e.top?e.topAmount??.8:0,e.cracks??.2)},uTNear:{value:new t.Vector4(0,0,0,0)},uTWind:{value:new t.Vector4(1,0,1,0)},uTFx:{value:new t.Vector4(0,0,e.bedRelief??1,0)},uTCloud:e.cloudUniform||r&&r.uniforms.uTCloud||g(e),uTGround:{value:new t.Vector4(i[0],i[1],e.aoHeight??26,-(i[2]??0))},uTBounce:r&&e.bounce==null?r.uniforms.uTBounce:{value:n(e.bounce??"#000000").multiplyScalar(e.bounceAmount??1)}},T={T_ROCK:""},s={detailMap:c,cellMap:p(c)};o&&d.uTStrata.value.x>0&&(T.T_STRATA="",s.strataMap=o.texture),d.uTCloud.value.w>0&&(T.T_CLOUD=""),r&&r.shadeMap&&e.shade!==!1&&(T.T_SHADEMAP="",d.tShade={value:r.shadeMap},d.uTShadeBox={value:r.shadeBox.clone()},s.shadeMap=r.shadeMap);const u=new t.MeshStandardMaterial({vertexColors:!0,color:n(e.color??"#ffffff"),roughness:e.roughness??.9,metalness:0,flatShading:!!e.flat});return x(u,d,"rock",T,s),u}export{M as makeRockMaterial,A as makeTerrainMaterial};
