import*as s from"../kit/fx.js";import*as h from"../kit/flora.js";const f=`
  vec2 hq = vSurf.xy; float hk = floor(vSurf.z + 0.5), hH = 0.0, hB = 0.0;
  float hpx = max(max(fwidth(hq.x), fwidth(hq.y)), 1e-5);                          // metres of pattern under one pixel
  if (hk == 1.0) {            // stone in courses: each stone its own tone, worn faces, dark joints with moss, lichen
    vec2 cell = vec2(1.05, 0.46), s = hq / cell; float row = floor(s.y);
    s.x += 0.5 * mod(row, 2.0) + 0.31 * hash11(row * 1.7 + 3.0);
    vec2 id = vec2(floor(s.x), row), f = fract(s);
    float dj = min(min(f.x, 1.0 - f.x) * cell.x, min(f.y, 1.0 - f.y) * cell.y);
    float keep = clamp(1.4 - hpx * 7.0, 0.0, 1.0);                                  // the courses give way to their mean by the pattern's footprint on the picture: whole under 6 cm a pixel, gone at 20 cm (under half a course)
    float j = smoothstep(0.012, 0.05 + hpx, dj);
    float tone = 0.74 + 0.5 * hash12(id + 0.5), worn = vnoise(hq * 5.5) * 0.5 + vnoise(hq * 1.1 + 7.0) * 0.5;
    vec3 st = diffuseColor.rgb * tone * (0.82 + 0.36 * worn);
    st = mix(st, st * vec3(1.14, 1.02, 0.82), step(0.7, hash12(id + 9.1)) * 0.6);
    vec3 jc = mix(diffuseColor.rgb * 0.34, vec3(0.13, 0.2, 0.06), smoothstep(0.35, 0.7, vnoise(hq * 0.8 + 3.0)));
    float lichen = smoothstep(0.6, 0.8, vnoise(hq * 0.55 + 21.0)) * 0.5;
    st = mix(st, vec3(0.4, 0.44, 0.19) * (0.6 + 0.6 * worn), lichen);
    diffuseColor.rgb = mix(diffuseColor.rgb * 0.9, mix(jc, st, j), keep);
    hH = j * (0.55 + 0.45 * hash12(id + 4.4)) + worn * 0.25; hB = 0.06 * keep;
  } else if (hk == 2.0) {     // boards along u: joints, butt ends, long grain
    float bw = 0.46, b = hq.y / bw, id = floor(b), f = fract(b);
    float keep = clamp(1.5 - hpx * 5.0, 0.0, 1.0);
    float j = smoothstep(0.0, 0.03 + hpx, min(f, 1.0 - f) * bw);
    float e = fract(hq.x / 3.4 + hash11(id * 3.1 + 1.0));
    j *= smoothstep(0.0, (0.03 + hpx) / 3.4, min(e, 1.0 - e));
    float grain = vnoise(vec2(hq.x * 0.7 + id * 5.3, hq.y * 16.0)), knot = vnoise(vec2(hq.x * 1.9 + id * 2.7, hq.y * 5.0));
    float tone = (0.8 + 0.34 * hash11(id * 1.3 + 7.0)) * (0.84 + 0.22 * grain + 0.1 * knot);
    diffuseColor.rgb *= mix(0.92, tone * (0.4 + 0.6 * j), keep);
    hH = j * 0.8 + grain * 0.2; hB = 0.03 * keep;
  } else if (hk == 3.0) {     // roof tiles: v runs up the slope; each tile's head lies in the shade of the one above
    vec2 cell = vec2(0.52, 0.6), s = hq / cell; float row = floor(s.y); s.x += 0.5 * mod(row, 2.0);
    vec2 id = vec2(floor(s.x), row), f = fract(s);
    float keep = clamp(1.5 - hpx * 4.0, 0.0, 1.0);
    float side = smoothstep(0.0, 0.05 + hpx, min(f.x, 1.0 - f.x) * cell.x), lip = smoothstep(1.0, 0.68, f.y);
    float tone = 0.7 + 0.55 * hash12(id + 2.5);
    float moss = smoothstep(0.58, 0.82, vnoise(hq * 0.5 + 40.0) + 0.2 * (1.0 - f.y));
    vec3 tl = diffuseColor.rgb * tone * (0.9 + 0.2 * vnoise(hq * 6.0));
    tl = mix(tl, vec3(0.27, 0.33, 0.12), moss * 0.7);
    diffuseColor.rgb = mix(diffuseColor.rgb * 0.85, tl * (0.4 + 0.6 * side) * (0.45 + 0.55 * lip), keep);
    hH = (1.0 - f.y) * side; hB = 0.07 * keep;
  } else if (hk == 4.0) {     // bark: long ridges and furrows that follow the limb (u runs round it, v along it), drawn no finer than the picture holds
    float wv = hq.x * 2.6 + 1.4 * vnoise(vec2(hq.x * 0.8, hq.y * 0.16)) + 0.4 * vnoise(vec2(hq.x * 2.3, hq.y * 0.55));
    float fw = hpx * 2.6, keep = clamp(1.35 - fw * 2.6, 0.0, 1.0);                    // fw: ridges under one pixel
    float ridge = smoothstep(0.0, 0.8 + fw * 2.0, abs(fract(wv) - 0.5) * 2.0), plate = floor(wv);
    float fine = vnoise(hq * vec2(9.0, 1.6)) * clamp(1.0 - hpx * 14.0, 0.0, 1.0);     // fine grain, only where a pixel can hold it
    float tone = (0.84 + 0.24 * vnoise(hq * vec2(0.5, 0.13) + 5.0)) * (0.93 + 0.14 * hash11(plate + 2.0));
    diffuseColor.rgb *= mix(0.86, (0.56 + 0.62 * ridge + 0.1 * fine) * tone, keep);
    hH = ridge; hB = 0.1 * keep * clamp(1.0 - hpx * 22.0, 0.0, 1.0);                  // relief only near, where a ridge is many pixels wide
  } else if (hk == 5.0) {     // cloth: soft mottling and long shallow folds
    diffuseColor.rgb *= 0.88 + 0.16 * vnoise(hq * 1.6) + 0.05 * sin(hq.x * 2.4 + 3.0 * vnoise(hq * 0.4));
    hH = vnoise(hq * 1.1); hB = 0.05;
  } else if (hk == 6.0) {     // crust: baked browns, speckled
    diffuseColor.rgb *= 0.78 + 0.4 * vnoise(hq * 9.0) * vnoise(hq * 2.3 + 5.0) + 0.1 * vnoise(hq * 30.0);
  } else if (hk == 7.0) {     // straw: long streaks down v
    float keep = clamp(1.5 - hpx * 8.0, 0.0, 1.0), sk = vnoise(vec2(hq.x * 14.0, hq.y * 1.1));
    diffuseColor.rgb *= mix(0.9, 0.62 + 0.6 * sk, keep); hH = sk; hB = 0.04 * keep;
  } else {
    diffuseColor.rgb *= 0.93 + 0.14 * vnoise(hq * 2.0);
  }`,c=`
  if (hB > 0.0) {             // relief from the pattern's own height (screen-space slopes)
    float hh = hH * hB;
    vec3 hSx = dFdx(-vViewPosition), hSy = dFdy(-vViewPosition);
    vec3 hR1 = cross(hSy, normal), hR2 = cross(normal, hSx);
    float hDet = dot(hSx, hR1) * faceDirection;
    vec3 hN = abs(hDet) * normal - sign(hDet) * (dFdx(hh) * hR1 + dFdy(hh) * hR2);
    if (dot(hN, hN) > 1e-14) normal = normalize(hN);
  }`;function m(n,l){const i=new n.MeshLambertMaterial({vertexColors:!0,side:n.DoubleSide}),e={uHillLamp:{value:l.lamp}};return i.onBeforeCompile=o=>{Object.assign(o.uniforms,e),o.vertexShader=o.vertexShader.replace("#include <common>",`#include <common>
attribute vec4 surf;
varying vec4 vSurf;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vSurf = surf;`),o.fragmentShader=o.fragmentShader.replace("#include <common>",`#include <common>
varying vec4 vSurf;
uniform vec3 uHillLamp;
`+s.GLSL_HASH+s.GLSL_VALUE_NOISE).replace("#include <color_fragment>",`#include <color_fragment>
`+f).replace("#include <normal_fragment_begin>",`#include <normal_fragment_begin>
`+c).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance += diffuseColor.rgb * uHillLamp * max(vSurf.w, 0.0);`)},i.customProgramCacheKey=()=>"hill-field-solid-3",i.userData.uniforms=e,i}function d(n,l){const i={wind:l.wind,map:l.map,alphaTest:.4,backlight:1,backlightTint:"#e2f58c",wrap:.8,leafAmbient:1.5,detail:0,sheen:.3,hold:!0,glow:1},e=h.windMaterial(i),o=e.onBeforeCompile,a={uHillLamp:{value:l.lamp}};return e.onBeforeCompile=(t,r)=>{o(t,r),Object.assign(t.uniforms,a),t.fragmentShader.includes("totalEmissiveRadiance += fE;")&&(t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
uniform vec3 uHillLamp;`).replace("totalEmissiveRadiance += fE;","totalEmissiveRadiance += (fE * 0.5 + vec3(dot(fE, vec3(0.3, 0.6, 0.1)) * 0.6)) * uHillLamp;"))},e.customProgramCacheKey=()=>"hill-field-leaf-1",e}export{d as leafMaterial,m as solidMaterial};
