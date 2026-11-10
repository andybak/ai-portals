import*as a from"./valley-inside-the-works-plan.js";function i(o,r){const s={uSweetTime:{value:0},uSwSky:{value:r.sky.clone()},uSwSkyDir:{value:new o.Vector3(0,a.LIGHT_DIR[1],a.LIGHT_DIR[2]).normalize()}},t=new o.MeshStandardMaterial({roughness:.2,metalness:0});return t.userData.uniforms=s,t.onBeforeCompile=e=>{Object.assign(e.uniforms,s),e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
        attribute vec4 aS; attribute vec3 aO; attribute vec3 aA; attribute vec3 aB; attribute vec4 aV;
        uniform float uSweetTime; varying vec4 vSw; varying vec3 vSwA; varying vec3 vSwB; varying float vSwK;`).replace("#include <beginnormal_vertex>",`#include <beginnormal_vertex>
        float swT = aV.z + aV.w * uSweetTime, swC = cos(swT), swS = sin(swT);
        objectNormal = vec3(swC * objectNormal.x + swS * objectNormal.z, objectNormal.y, swC * objectNormal.z - swS * objectNormal.x);`).replace("#include <begin_vertex>",`#include <begin_vertex>
        transformed.y += aS.w * (aV.x - 1.0); transformed += aO * aV.y;
        transformed = vec3(swC * transformed.x + swS * transformed.z, transformed.y, swC * transformed.z - swS * transformed.x);
        // what the paint is handed: (u, v, part) and one number more: a gumdrop's size in metres, a lollipop's hand
        vSw = vec4(aS.xyz, aS.z > 5.5 ? 1.0 / aV.y : (aV.w < 0.0 ? -1.0 : 1.0));
        if (aS.z > 0.5 && aS.z < 1.5) vSw.x += aS.w * (aV.x - 1.0);      // (a cane's stripe runs on up the lengthened stick)
        vSwA = aA; vSwB = aB; vSwK = aV.z;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
        varying vec4 vSw; varying vec3 vSwA; varying vec3 vSwB; varying float vSwK; uniform vec3 uSwSky, uSwSkyDir;
        // sweetHash: BROUGHT IN, it follows "Hash without Sine" (c)2014 David Hoskins, MIT License; see the head of this file
        vec3 sweetHash(vec2 p) { vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yxz + 33.33); return fract((q.xxy + q.yzz) * q.zyx); }
        vec3 swCol; float swRough, swThrough;
        // the angle of p about the middle. At the middle itself (both its parts under 1e-6) atan has no answer to give
        // and is not asked: the angle of (1, 0), nought, is taken.
        float swAngle(vec2 p) { vec2 s = max(abs(p.x), abs(p.y)) < 1e-6 ? vec2(1.0, 0.0) : p; return atan(s.y, s.x); }
        // (every edge of the paint is as soft as a grain of the picture, w, and a pattern too fine for the picture
        // gives way to its own mean colour)
        void sweetPaint() {
          float part = vSw.z; vec2 q = vSw.xy;
          swCol = vSwB; swRough = 0.2; swThrough = 0.16;
          if (part < 0.5) { swCol = vec3(0.6, 0.58, 0.53); swRough = 0.45; }
          else if (part < 1.5) {
            float ph = q.x / 2.8 + q.y, w = clamp(fwidth(ph), 0.0005, 0.5), s = abs(fract(ph) - 0.5);
            float on = 1.0 - smoothstep(0.17 - w, 0.17 + w, s) + smoothstep(0.27 - w, 0.27 + w, s) - smoothstep(0.32 - w, 0.32 + w, s);
            swCol = mix(vSwB, vSwA, mix(clamp(on, 0.0, 1.0), 0.44, smoothstep(0.15, 0.4, w)));
          } else if (part < 2.5) {
            float r = length(q), ph = vSw.w * swAngle(q) / 6.2832 + 2.6 * r;
            float w = clamp(max(fwidth(q.x), fwidth(q.y)) * sqrt(0.0253 / max(r * r, 0.0004) + 6.76), 0.0005, 0.5);
            float t = abs(fract(ph) - 0.5) * 2.0, mean = smoothstep(0.12, 0.3, w);
            float groove = 1.0 - 0.3 * (1.0 - smoothstep(0.0, 0.2 + 2.0 * w, abs(t - 0.5) * 2.0)) * (1.0 - mean);
            swCol = mix(mix(vSwA, vSwB, smoothstep(0.5 - 2.0 * w, 0.5 + 2.0 * w, t)), 0.5 * (vSwA + vSwB), mean) * groove;
          } else if (part < 3.5) {
            vec2 c = q / 0.4, ci = floor(c); vec3 h = sweetHash(ci + 7.0 + floor(vSwK * 40.0));
            float rad = 0.14 + 0.2 * h.z, d = length(c - ci - 0.5 - (h.xy - 0.5) * 0.28), w = clamp(max(fwidth(c.x), fwidth(c.y)), 0.001, 0.5);
            swCol = mix(vSwA, vSwB, (1.0 - smoothstep(rad - w, rad + w, d)) * step(fract(h.x * 17.3 + h.z * 5.1), 0.85));
          } else if (part < 4.5) {
            swCol = vSwB * (0.82 + 0.06 * cos(q.x * 56.5)); swRough = 0.35;
          } else if (part < 5.5) {
            float r = length(q), a = swAngle(q) / 6.2832 * 56.0, w = max(fwidth(q.x), fwidth(q.y)) * 8.9 / max(r, 0.02);
            swCol = vSwB * 0.6 * mix(0.62 + 0.3 * abs(fract(a) - 0.5) * 2.0, 0.77, smoothstep(0.2, 0.6, w)); swRough = 0.6;
          } else if (part > 6.5) {
            swCol = vSwA * (0.8 + 0.35 * q.y); swRough = 0.07; swThrough = 0.8;
          } else {
            vec2 c = q * vSw.w / 0.02, ci = floor(c); vec3 h = sweetHash(ci + 3.0 + floor(vSwK * 40.0));
            float mean = smoothstep(0.3, 1.0, max(fwidth(c.x), fwidth(c.y)));
            swCol = mix(vSwA, vec3(0.62, 0.6, 0.56), 0.4 * mix(step(0.5, h.x) * (0.3 + 0.7 * h.y), 0.325, mean));
            swRough = mix(mix(0.16, 0.75, h.z), 0.5, mean); swThrough = 0.55;
          }
        }`).replace("#include <color_fragment>",`#include <color_fragment>
        sweetPaint(); diffuseColor.rgb = swCol;`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
        roughnessFactor = swRough;`).replace("#include <lights_fragment_begin>",`#include <lights_fragment_begin>
        #if NUM_DIR_LIGHTS > 0
          reflectedLight.directDiffuse += swThrough * max(dot(-normal, directionalLights[0].direction), 0.0) * lightBar(vValleyBar) * directionalLights[0].color * swCol * RECIPROCAL_PI;
        #endif
        {
          // (No vector is divided by a length that can be nought: the sky's direction in the eye's space, and the half
          // vector between it and the eye's direction, which is nought when the two are opposite, are each divided by
          // their length held above 1e-4.)
          vec3 swL = (viewMatrix * vec4(uSwSkyDir, 0.0)).xyz; swL /= max(length(swL), 1e-4);
          vec3 swH = swL + geometryViewDir; float swNH = max(dot(normal, swH / max(length(swH), 1e-4)), 0.0);
          reflectedLight.indirectSpecular += uSwSky * (1.0 - swRough) * step(0.0, dot(normal, swL)) * (0.9 * pow(swNH, 90.0) + 0.07 * pow(swNH, 10.0));
        }`)},t.customProgramCacheKey=()=>"valley-meadow-sweets",a.barMaterial(t)}export{i as sweetsMaterial};
