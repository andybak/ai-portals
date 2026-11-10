import*as y from"three";const A={HX:90,Y0:7,L:596.5,N:64,Z_NEAR:-700,Z_FULL0:-400,Z_FULL1:1460,Z_TIP:1535,QUAY0:70,QUAY1:90,WALL_H:7,PARAPET:1,RING_X:72,RING_Z:1200,RING_Y:22,RING_R:12,TOWN_Z0:-60,TOWN_Z1:1300,TEX_W:597,TEX_H:2235,OUT:255};A.TIP_MARGIN=A.Z_TIP-A.Z_FULL1,A.ROLL_TOWN_Z1=A.Z_TIP-A.TIP_MARGIN,A.H=A.L/A.N;const oe={LONG:1,CROSS:2,SLAB:3,YARD:4,GARDEN:5,COURT:6},St={SETT:1,DRAIN_A:2,DRAIN_Z:3,WORN:4,FLAG:5,BED:6,GRASS:7,PATH:8,HEDGE:9,GUTTER:10},Ie=`
float wetHash(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
float wetNoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(wetHash(i), wetHash(i + vec2(1.0, 0.0)), f.x), mix(wetHash(i + vec2(0.0, 1.0)), wetHash(i + 1.0), f.x), f.y); }
// NO WATER STANDS ON OPEN PAVING (it read as dark blots, and as reddish ones where it mirrored the afterglow): wetPuddle is 0
// everywhere, its name kept for the promenade's program; water lies only in a kerb's gutter, wetGutter: m.x metres across the
// gutter's own metre (0 to 1), m.y along it; a broken line of water 0.7 m wide
float wetPuddle(vec2 m) { return 0.0; }
float wetGutter(vec2 m, float w) { return smoothstep(0.42, 0.58, wetNoise(vec2(m.y / 5.0, 17.0))) * clamp((min(m.x - 0.15, 0.85 - m.x) + 0.5 * w) / max(w, 0.001), 0.0, 1.0); }
`,se=n=>(n=n<0?0:n>1?1:n,n*n*(3-2*n));function ce(n){return n<=A.Z_NEAR||n>=A.Z_TIP?0:n<A.Z_FULL0?A.L*se((n-A.Z_NEAR)/300):n<=A.Z_FULL1?A.L:A.L*(1-se((n-A.Z_FULL1)/75))}const ee=1/75,ne=1/800,xe=100/75*.5,ve=xe+117/75,Ue=ve+60/75+(ne-ee)*60*.5;function be(n){if(n<=0)return 0;if(n>A.L&&(n=A.L),n<100){const e=n/100;return 100/75*(e*e*e-e*e*e*e/2)}if(n<217)return xe+(n-100)/75;if(n<277){const e=(n-217)/60;return ve+(n-217)/75+(ne-ee)*60*(e*e*e-e*e*e*e/2)}return Ue+(n-277)/800}function Ze(n){return n<=0?0:n<100?ee*se(n/100):n<217?ee:n<277?ee+(ne-ee)*se((n-217)/60):ne}const Y=.12,fe=1/(1-Y),he=1,Ct=0;function Ft(n){if(n<=0)return 0;if(n>=1)return 1;if(n<Y){const e=n/Y;return fe*Y*(e*e*e-e*e*e*e/2)}if(n>1-Y){const e=(1-n)/Y;return 1-fe*Y*(e*e*e-e*e*e*e/2)}return fe*(n-Y/2)}const Tt=()=>he,We=[-.9602898564975363,-.7966664774136267,-.525532409916329,-.1834346424956498,.1834346424956498,.525532409916329,.7966664774136267,.9602898564975363],ye=[.1012285362903763,.2223810344533745,.3137066458778873,.362683783378362,.362683783378362,.3137066458778873,.2223810344533745,.1012285362903763];function ue(n,e=new Float32Array(4*(A.N+1))){const o=A.H;let t=A.HX,a=A.Y0;for(let s=0;s<=A.N;s++){if(s>0){const i=(s-1)*o,l=o/2,f=i+l;let m=0,u=0;for(let h=0;h<8;h++){const c=n*be(f+l*We[h]);m+=ye[h]*Math.cos(c),u+=ye[h]*Math.sin(c)}t+=l*m,a+=l*u}const r=n*be(s*o);e[4*s]=t,e[4*s+1]=a,e[4*s+2]=Math.cos(r),e[4*s+3]=Math.sin(r)}return e}function de(n,e,o){const t=A.H,a=Math.min(Math.max(e,0),A.L),s=Math.min(Math.max(Math.floor(a/t),0),A.N-1),r=a/t-s,i=4*s,l=i+4,f=r*r,m=f*r,u=2*m-3*f+1,h=m-2*f+r,c=-2*m+3*f,d=m-f;o[0]=u*n[i]+h*t*n[i+2]+c*n[l]+d*t*n[l+2],o[1]=u*n[i+1]+h*t*n[i+3]+c*n[l+1]+d*t*n[l+3];let P=n[i+2]+(n[l+2]-n[i+2])*r,v=n[i+3]+(n[l+3]-n[i+3])*r;const b=1/Math.sqrt(Math.max(P*P+v*v,1e-6));return o[2]=P*b,o[3]=v*b,o}const ge=new Float64Array(4);function Et(n,e,o,t,a,s=new y.Vector3){if(e<0)return s.set(o,t,a);const r=de(n,e,ge);return s.set(r[0]+o*r[2]-t*r[3],r[1]+o*r[3]+t*r[2],a)}function Bt(n,e,o=new y.Vector3){const t=de(n,e,ge);return o.set(-t[3],t[2],0)}const Ve=`
uniform vec4 uBendK[65];
attribute float aAnchor;
vec2 bendC; vec2 bendF;
void bendFrameAt(float aA) {
  const float bh = 9.3203125;                         // L / 64
  float a = clamp(aA, 0.0, 596.5);
  int i = clamp(int(floor(a / bh)), 0, 63);
  float s = a / bh - float(i);
  vec4 k0 = uBendK[i]; vec4 k1 = uBendK[i + 1];
  float s2 = s * s, s3 = s2 * s;
  bendC = (2.0 * s3 - 3.0 * s2 + 1.0) * k0.xy + (s3 - 2.0 * s2 + s) * bh * k0.zw + (-2.0 * s3 + 3.0 * s2) * k1.xy + (s3 - s2) * bh * k1.zw;
  vec2 f = mix(k0.zw, k1.zw, s);
  bendF = f * inversesqrt(max(dot(f, f), 1e-6));
}
vec3 bendPoint(vec3 p) { return aAnchor < 0.0 ? p : vec3(bendC + p.x * bendF + p.y * vec2(-bendF.y, bendF.x), p.z); }
`,qe=`
attribute vec2 aSway;
uniform vec4 uSwayP;                                  // x the clock, y the wind's reach at the top (m), zw its way in the body's flat frame
vec3 swayOffset() {
  float t = uSwayP.x, s = uSwayP.y * aSway.x * (sin(t * 1.3 + aSway.y) + 0.35 * sin(t * 2.9 + aSway.y * 1.7));
  return vec3(s * uSwayP.z, 0.0, s * uSwayP.w);
}
`,Ke=`
uniform sampler2D uPlanMean; uniform sampler2D uPlanClass; uniform vec3 uPaving;
varying vec2 vPlan;
`,Ye=`
  { ivec2 bpT = ivec2(clamp(floor(vPlan.x), 0.0, ${(A.TEX_W-1).toFixed(1)}), clamp(floor(vPlan.y + ${(-A.Z_NEAR).toFixed(1)}), 0.0, ${(A.TEX_H-1).toFixed(1)}));
    if (texelFetch(uPlanClass, bpT, 0).r > 0.9) discard; }
`,$e=y.ShaderChunk.lights_fragment_begin.replace("getDirectionalLightInfo( directionalLight, directLight );",`getDirectionalLightInfo( directionalLight, directLight );
		directLight.color *= smoothstep( 0.02, 0.10, dot( geometryNormal, directLight.direction ) );
		directLight.color *= closingCloudSun();`),Xe=`varying vec3 vCloudW;
`,Qe=`
uniform sampler2D uCloudTex; uniform vec4 uCloudP; uniform vec4 uCloudQ; varying vec3 vCloudW;
float closingCloudSun() {                             // P + L (1800 - y) / L.y, in metres; uCloudQ: (L.x / L.y, L.z / L.y, depth, 0)
  vec2 q = vCloudW.xz + uCloudQ.xy * max(1800.0 - vCloudW.y, 0.0);
  vec2 n = texture(uCloudTex, q * uCloudP.z + uCloudP.xy).rg;
  return 1.0 - uCloudQ.z * smoothstep(uCloudP.w - 0.07, uCloudP.w + 0.07, 0.68 * n.r + 0.32 * n.g);
}
`,Ae={uCloudTex:{value:null},uCloudP:{value:new y.Vector4(0,0,0,2)},uCloudQ:{value:new y.Vector4(0,0,0,0)}};function Me(n){for(const e in Ae)n.uniforms[e]||(n.uniforms[e]=Ae[e]);n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
`+Qe).replace("#include <lights_fragment_begin>",$e)}const Pe=n=>n.replace("#include <common>",`#include <common>
`+Xe).replace("#include <project_vertex>",`vCloudW = (modelMatrix * vec4(transformed, 1.0)).xyz;
#include <project_vertex>`),Je=`
#if ( NUM_HEMI_LIGHTS > 0 ) && ( NUM_DIR_LIGHTS > 0 ) && defined( RE_IndirectDiffuse )
  irradiance += hemisphereLights[ 0 ].groundColor * (0.5 - 0.5 * dot(geometryNormal, hemisphereLights[ 0 ].direction)) * (1.0 - smoothstep(0.02, 0.10, dot(geometryNormal, directionalLights[ 0 ].direction)));
#endif
`,ke=`
attribute vec4 aFac; attribute vec2 aKind; varying vec4 vFac; varying vec2 vKind;
`,me=`
float fcHash(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float fcBox(float x, float a, float b, float w) { float k = 1.0 / max(w, 0.001); return clamp((x - a) * k + 0.5, 0.0, 1.0) * clamp((b - x) * k + 0.5, 0.0, 1.0); }
float fcLines(float x, float w, float f) {               // (and to the mean outright from a footprint of 0.8 periods: no moire)
  float n = 1.0 / f, a = x + 0.5 * w, b = x - 0.5 * w;
  float c = clamp((floor(a) + min(fract(a) * n, 1.0) - floor(b) - min(fract(b) * n, 1.0)) / max(n * w, 0.0001), 0.0, 1.0);
  return mix(c, f, smoothstep(0.35, 0.8, w));
}
// coursed masonry: bed joints every rh, perpends every bl staggered course by course (the perpends to their mean once the
// courses are under the footprint); the units toned so that the whole keeps the face's own colour as its mean
vec3 fcCourses(vec3 base, vec3 mortar, float s, float h, float ws, float wh, float rh, float bl, float fb, float fp) {
  float bed = fcLines(h / rh, wh / rh, fb), pf = smoothstep(0.35, 0.8, wh / rh);
  float per = mix(fcLines(s / bl + 0.5 * mod(floor(h / rh), 2.0), ws / bl, fp), fp, pf);
  float mort = bed + per * (1.0 - bed), mm = fb + fp * (1.0 - fb);
  return mix(max((base - mortar * mm) / (1.0 - mm), vec3(0.0)), mortar, mort);
}
`,ze=`
uniform vec3 uShutA; uniform vec3 uShutB; uniform vec3 uShutC; uniform vec3 uTrim;
varying vec4 vFac; varying vec2 vKind;
${me}
vec3 facadeColour(vec3 base, float ws, float wh) {
  float cls = floor(vKind.x + 0.5);
  if (cls < 0.5 || abs(cls - 5.0) < 0.5) return base;                    // plain, and the hedges
  float seed = vKind.y, s = vFac.x, h = vFac.y, W = vFac.z, E = vFac.w;
  if (cls > 8.5) {
    // CANAL TILES: the shade between the tiles' rounded backs every 0.21 m along the eaves, the lap of each course every
    // 0.15 m of rise, each course's tiles a little varied; and (S9) each roof's PATCHES of older and newer tiles, 2.4 by 1.8 m
    // cells, about 15 in 100 greyer and darker, 15 in 100 fresher (the second hash; the two shares even, so the mean is the
    // roof's own colour), faded out by fwidth like the tiles
    float rib = fcLines(s / 0.21, ws / 0.21, 0.35), lap = fcLines(h / 0.15, wh / 0.15, 0.2);
    float tf = smoothstep(0.3, 0.8, max(ws / 1.05, wh / 0.3)), pf = smoothstep(0.3, 0.8, max(ws / 2.4, wh / 1.8));
    float tv = (fcHash(floor(vec2(s / 1.05, h / 0.3)) + seed * 37.0) - 0.5) * (1.0 - tf);
    float ph = fcHash(floor(vec2(s / 2.4, h / 1.8)) + seed * 53.0 + 11.0);
    vec3 pt = ph > 0.85 ? vec3(0.86, 0.87, 0.90) : ph < 0.15 ? vec3(1.14, 1.08, 1.0) : vec3(1.0);
    return base * mix(pt, vec3(1.0), pf) * ((1.0 - 0.22 * rib - 0.12 * lap) / 0.899) * (1.0 + 0.22 * tv);
  }
  vec3 mortar = vec3(0.50, 0.45, 0.36), tile = vec3(0.32, 0.12, 0.055);
  float brick = (cls < 1.5 || abs(cls - 6.0) < 0.5 || abs(cls - 8.0) < 0.5) ? 1.0 : 0.0, hall = abs(cls - 8.0) < 0.5 ? 1.0 : 0.0;
  vec3 col = base;
  if (brick > 0.5) col = fcCourses(base, mortar, s, h, ws, wh, 0.075, 0.30, 0.16, 0.04);     // thin red brick (Albi, Ferrara)
  else if (cls < 3.5) {                                                    // stucco and lime wash (Girona, Evora): a soft unevenness
    float mf = smoothstep(0.15, 0.6, max(ws, wh) / 2.5);
    float mo = (sin(s * 1.31 + seed * 23.0) * sin(h * 1.73 + s * 0.41) + 0.6 * sin(s * 0.53 - h * 0.37 + seed * 9.0)) * (1.0 - mf);
    col = base * (1.0 + 0.05 * mo);
    col = mix(col, cls > 2.5 ? uTrim : base * 0.8, fcBox(h, -3.0, 0.5, wh));               // the socle: ochre on lime, darker on stucco
  } else col = fcCourses(base, mortar, s, h, ws, wh, 0.30, 0.55, 0.08, 0.05);              // a garden wall's coursed rubble
  if (abs(cls - 6.0) > 0.5) col = mix(col, tile, 0.75 * fcBox(h, E - 0.3, E + 0.02, wh));  // the eaves' two tile courses; a wall's coping
  if (W > 2.4) {
    // OPENINGS, cell by cell along the face and floor by floor (3.1 m): a window 1.0 by 1.35 m with its surround (ochre on lime,
    // a paler band on stucco, a stone sill on brick), shut shutters on some, a door on the ground floor; a hall one tall window
    float nC = max(1.0, floor(W / mix(2.9, 3.6, hall))), cw = max(W, 2.4) / nC;
    float ci = clamp(floor(s / cw), 0.0, nC - 1.0), x = s - (ci + 0.5) * cw, fi = max(floor(h / 3.1), 0.0);
    float y = mix(h - fi * 3.1, h, hall), hw = mix(0.5, 0.65, hall), y0 = mix(1.0, 3.0, hall), y1 = mix(2.35, max(E - 1.4, 4.0), hall);
    float isDoor = (1.0 - hall) * (1.0 - step(0.5, fi)) * (1.0 - step(0.5, abs(ci - floor(seed * nC))));
    float win = fcBox(x, -hw, hw, ws) * fcBox(y, y0, y1, wh) * (1.0 - isDoor);
    float inner = fcBox(x, -hw + 0.08, hw - 0.08, ws) * fcBox(y, y0 + 0.08, y1 - 0.08, wh) * (1.0 - isDoor);
    float ring = fcBox(x, -hw - 0.15, hw + 0.15, ws) * fcBox(y, y0 - 0.15, y1 + 0.15, wh) * (1.0 - isDoor);
    float sill = fcBox(x, -hw - 0.1, hw + 0.1, ws) * fcBox(y, y0 - 0.13, y0, wh) * (1.0 - isDoor);
    float door = isDoor * fcBox(x, -0.6, 0.6, ws) * fcBox(h, -1.0, 2.3, wh), dring = isDoor * fcBox(x, -0.76, 0.76, ws) * fcBox(h, -1.0, 2.46, wh);
    float shareShut = (1.0 - hall) * mix(0.55, 0.35, brick);
    float shut = step(fcHash(vec2(ci + 13.0 * seed, fi + W)), shareShut);
    vec3 sh = seed < 0.333 ? uShutA : (seed < 0.667 ? uShutB : uShutC);
    vec3 frameC = vec3(0.50, 0.47, 0.42), glass = vec3(0.03, 0.035, 0.045);
    vec3 trimC = brick > 0.5 ? vec3(0.60, 0.55, 0.46) : (cls < 2.5 ? min(base * 1.3 + 0.04, vec3(0.9)) : uTrim);
    float trimA = brick > 0.5 ? max(sill, dring) : max(ring, dring);
    vec3 pc = mix(col, trimC, trimA);
    pc = mix(pc, mix(frameC, sh, shut), win);
    pc = mix(pc, mix(glass, sh * (1.0 - 0.45 * fcBox(x, -0.03, 0.03, ws)), shut), inner);
    pc = mix(pc, vec3(0.09, 0.055, 0.03) * (0.8 + 0.5 * seed), door);
    // their mean over a cell, taken as the footprint grows past a share of the cell
    float cellA = cw * mix(3.1, max(E, 3.0), hall), aWin = 2.0 * hw * (y1 - y0) / cellA;
    float aTrim = brick > 0.5 ? 2.0 * (hw + 0.1) * 0.13 / cellA : 2.0 * (hw + 0.15) * (y1 - y0 + 0.3) / cellA - aWin;
    vec3 mean = mix(mix(col, trimC, aTrim), mix(mix(frameC, glass, 0.7), sh, shareShut), aWin);
    col = mix(pc, mean, smoothstep(0.2, 0.5, max(ws / cw, wh / 3.1)));
  }
  return col;
}
`,et=`
uniform sampler2D uFloorTex;
varying vec4 vFac; varying vec2 vKind;
${me}
vec3 stCoursed(vec2 p, vec2 w, float rh, float bl, float jf) {      // (joint, the unit's tone faded to its mean, the unit's die)
  float row = floor(p.y / rh), bx = p.x / bl + fcHash(vec2(row, 17.0));
  float fr = smoothstep(0.35, 0.8, w.y / rh), fb = smoothstep(0.3, 0.8, max(w.x / bl, w.y / rh)), jbf = jf * rh / bl;
  float jr = fcLines(p.y / rh, w.y / rh, jf), jb = mix(fcLines(bx, w.x / bl, jbf), jbf, fr), d = fcHash(vec2(floor(bx), row));
  return vec3(jr + jb * (1.0 - jr), (d - 0.5) * (1.0 - fb), d);
}
vec3 stoneColour(vec3 base, vec2 w) {
  float cls = floor(vKind.x + 0.5);
  vec2 p = vFac.xy, fuv = p / 48.0, gx = dFdx(fuv), gy = dFdy(fuv);   // (the gradients taken outside every branch)
  if (cls < 9.5) return base;
  if (cls < 12.5) {
    vec4 ft = textureGrad(uFloorTex, fuv, gx, gy);
    if (cls > 11.5) return base * (0.8 + 0.4 * ft.a);
    // a second read of the same texture turned 37 deg and at 48 / 41 of the scale, mixed in by broad soft fields of 90 to 270 m:
    // no two tiles alike, so the tile never shows
    const mat2 rot = mat2(0.7986, 0.6018, -0.6018, 0.7986);
    vec4 f2 = textureGrad(uFloorTex, rot * fuv * 1.1707 + vec2(0.37, 0.71), rot * gx * 1.1707, rot * gy * 1.1707);
    float m = smoothstep(0.3, 0.7, 0.5 + 0.5 * sin(p.x * 0.067 + 2.1 * sin(p.y * 0.019)) * sin(p.y * 0.041 + 1.6 * sin(p.x * 0.029)));
    vec3 fl = mix(ft.rgb, f2.rgb, m) * 1.88;     // (its mean 0.5 times 2 times 0.94: the 10 m fields' tones average 0.51, the floor 0.48)
    if (cls < 10.5) return base * fl;
    // a bar (11): the floor's own stone at its foot, its cobbles from its crest's weight (the third coordinate) of 0.4 up
    return base * mix(fl, vec3(0.35 + 1.3 * ft.a), smoothstep(0.0, 0.4, vFac.z));
  }
  if (cls < 13.5) { vec3 c = stCoursed(p, w, 0.45, 0.85, 0.06); return mix(base * (1.0 + 0.26 * c.y), base * 0.62, c.x); }
  return fcCourses(base, vec3(0.50, 0.45, 0.36), p.x, p.y, w.x, w.y, 0.075, 0.30, 0.16, 0.04);
}
`,tt=`
vec3 riverWall(vec3 base, vec2 w) {
  float cls = floor(vKind.x + 0.5);
  if (abs(cls - 15.0) > 0.5) return stoneColour(base, w);
  float s = vFac.x, h = vFac.y, ws = w.x, wh = w.y, sA = s + vKind.y * 10000.0 - 1000.0;
  vec3 mortar = vec3(0.47, 0.42, 0.34);
  vec3 col = fcCourses(base, mortar, s, h, ws, wh, 0.066, 0.42, 0.2, 0.05);
  float pf = 1.0 - smoothstep(0.25, 0.6, max(ws / 5.3, wh / 2.1)), hp = fcHash(floor(vec2(sA / 5.3, h / 2.1)) + 0.5);
  col *= mix(vec3(1.0), hp > 0.89 ? vec3(1.13, 1.07, 1.02) : vec3(0.85, 0.79, 0.77), step(0.78, hp) * pf * step(0.9, h) * (1.0 - step(6.72, h)));
  col = mix(col, fcCourses(vec3(0.40, 0.36, 0.30), mortar * 0.8, s, h, ws, wh, 0.30, 0.55, 0.08, 0.05), fcBox(h, -2.0, 0.9, wh));
  col = mix(col, vec3(0.50, 0.46, 0.38), fcBox(h, 6.72, 7.0, wh));
  float dx = mod(sA + 7.0, 31.7) - 15.85, df = 1.0 - smoothstep(0.3, 1.0, max(ws / 0.7, wh / 0.7));
  col *= 1.0 - 0.85 * df * fcBox(dx, -0.3, 0.3, ws) * fcBox(h, 1.15, 1.75, wh);
  col *= 1.0 - 0.35 * df * fcBox(dx, -0.36, 0.36, ws) * fcBox(h, 0.0, 1.15, wh) * (0.6 + 0.4 * smoothstep(0.0, 1.1, h));
  col *= mix(0.86, 1.0, smoothstep(0.4, 2.6, h)) * (1.0 + 0.05 * sin(sA * 0.9 + 2.0 * sin(sA * 0.23)) * (1.0 - smoothstep(0.3, 0.8, ws / 3.0)));
  return col;
}
`;function Rt(n=he){const e=ue(n),o={uBendK:{value:e}};let t=n;return{knots:e,uniforms:o,get b(){return t},set(a){a!==t&&(t=a,ue(a,e))}}}function Nt(n,e){return{uSwayP:{value:new y.Vector4(0,n,Math.cos(e),Math.sin(e))}}}function _e(n,e,o,t,a){const s=e==="tree",r=e==="land",i=o==="colour",l=e==="house"&&i,f=i&&a.night?a.night:null,m=r&&!i&&!!(a.night&&a.night.uniforms&&a.night.uniforms.uPlanClass);return n.onBeforeCompile=u=>{Object.assign(u.uniforms,t.uniforms),s&&Object.assign(u.uniforms,a.sway),r&&Object.assign(u.uniforms,a.plan),l&&!f&&Object.assign(u.uniforms,a.facade),f&&f.uniforms&&Object.assign(u.uniforms,f.uniforms),m&&(u.uniforms.uPlanClass=a.night.uniforms.uPlanClass,u.uniforms.uPlanBox=a.night.uniforms.uPlanBox);let h=u.vertexShader.replace("#include <common>",`#include <common>
`+Ve+(s?qe:"")+(r?`varying vec2 vPlan;
`:"")+(l?ke:f?Le:""));i&&(h=h.replace("#include <beginnormal_vertex>",`
      vec3 objectNormal = vec3( normal );
      #define BEND_FRAMED
      bendFrameAt(aAnchor);
      if (aAnchor >= 0.0) objectNormal = vec3(objectNormal.x * bendF.x - objectNormal.y * bendF.y, objectNormal.x * bendF.y + objectNormal.y * bendF.x, objectNormal.z);`)),h=h.replace("#include <begin_vertex>",`
      #ifndef BEND_FRAMED
      bendFrameAt(aAnchor);
      #endif
      vec3 transformed = bendPoint(position${s?" + swayOffset()":""});${r?`
      vPlan = vec2(aAnchor < 0.0 ? 56.0 - position.x : aAnchor, position.z);`:""}${l?`
      vFac = aFac; vKind = aKind;`:f?s?ot:st:""}`),i&&!f&&(h=Pe(h)),u.vertexShader=h;let c=u.fragmentShader;l&&!f&&(c=c.replace("#include <common>",`#include <common>
`+ze).replace("#include <color_fragment>",`#include <color_fragment>
      { vec2 fcW = fwidth(vFac.xy); diffuseColor.rgb = facadeColour(diffuseColor.rgb, fcW.x, fcW.y); }`)),f&&(c=c.replace("#include <common>",`#include <common>
`+Le+(f.pars||"")).replace("#include <color_fragment>",`#include <color_fragment>
`+(f.colour||"")).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
`+(f.emit||""))),r&&f?c=c.replace(/}\s*$/,`  if (landCut) discard;
}
`):m?c=c.replace("#include <common>",`#include <common>
uniform sampler2D uPlanClass; uniform vec4 uPlanBox; varying vec2 vPlan;
`).replace(/}\s*$/,`  { ivec2 bpT = ivec2(clamp(floor(vec2(vPlan.x, vPlan.y - uPlanBox.x)), vec2(0.0), uPlanBox.yz - 1.0)); if (texelFetch(uPlanClass, bpT, 0).r * 255.0 > 250.0) discard; }
}
`):r&&!f&&(c=c.replace("#include <common>",`#include <common>
`+Ke),i&&(c=c.replace("#include <color_fragment>",`#include <color_fragment>
        vec3 bpCol = texture(uPlanMean, vec2(vPlan.x / ${A.TEX_W.toFixed(1)}, (vPlan.y + ${(-A.Z_NEAR).toFixed(1)}) / ${A.TEX_H.toFixed(1)})).rgb;
        diffuseColor.rgb *= gl_FrontFacing ? bpCol : uPaving;   // the land's back in the ground's own paving colour`)),c=c.replace(/}\s*$/,Ye+`}
`)),u.fragmentShader=c,i&&!f&&Me(u)},n.customProgramCacheKey=()=>"closing-bend-"+e+"-"+o+(l?"-facade":"")+(f?"-night-"+(f.key||""):""),n}const Le=`varying vec4 vFac; varying vec2 vKind;
`,ot=`
      vFac = vec4(0.0, aAnchor < 0.0 ? position.y - 7.0 : position.y, 0.0, 0.0); vKind = vec2(0.0, aSway.y);`,st=`
      vFac = vec4(vPlan.x, 0.0, 0.0, 0.0); vKind = vec2(0.0);`;function Dt(n){const e=n.shut.map(o=>new y.Color(o));return{uShutA:{value:e[0]},uShutB:{value:e[1]},uShutC:{value:e[2]},uTrim:{value:new y.Color("#cfa14c")}}}function nt(n,e,o={}){const t=e==="land",a=_e(new y.MeshLambertMaterial(t?{color:16777215,side:y.DoubleSide}:{vertexColors:!0}),e,"colour",n,o),s=_e(new y.MeshDepthMaterial({depthPacking:y.RGBADepthPacking,side:t?y.DoubleSide:y.FrontSide}),e,"depth",n,o);return a.userData.depthMaterial=s,{colour:a,depth:s,dispose(){a.dispose(),s.dispose()}}}function Ht(n={}){const e=new y.MeshLambertMaterial({vertexColors:!0}),o={uFloorTex:{value:n.floor||null}},t=!!n.wall;return e.onBeforeCompile=a=>{Object.assign(a.uniforms,o,n.cloud||{}),a.vertexShader=Pe(a.vertexShader.replace("#include <common>",`#include <common>
`+ke).replace("#include <begin_vertex>",`#include <begin_vertex>
  vFac = aFac; vKind = aKind;`)),a.fragmentShader=a.fragmentShader.replace("#include <common>",`#include <common>
`+et+(t?tt:"")).replace("#include <color_fragment>",`#include <color_fragment>
  { vec2 stW = fwidth(vFac.xy); diffuseColor.rgb = `+(t?"riverWall(diffuseColor.rgb, stW)":"stoneColour(diffuseColor.rgb, stW)")+"; }"),Me(a),t&&(a.fragmentShader=a.fragmentShader.replace("#if defined( RE_IndirectSpecular )",Je+"#if defined( RE_IndirectSpecular )"))},e.customProgramCacheKey=()=>t?"closing-flat-wall":"closing-flat-stone",e.userData.floor=o,e}class Q{constructor(e){this.per=e,this.v=new Float32Array(e*1024),this.len=0}grow(e){const o=new Float32Array(this.per*e);o.set(this.v.subarray(0,this.len)),this.v=o}out(){return this.v.slice(0,this.len)}}class Se{constructor(e=!1,o=!1){this.soft=o,this.p=new Q(9),this.n=new Q(9),this.c=new Q(9),this.a=new Q(3),this.s=e?new Q(6):null,this.f=e?null:new Q(12),this.k=e?null:new Q(6),this.tris=0,this.cap=1024,this._ext=null,this._kept=!0,this.body(0,0)}_grow(){this.cap*=2;for(const e of[this.p,this.n,this.c,this.a,this.s,this.f,this.k])e&&e.grow(this.cap)}body(e,o,t=null,a=null){return this.aA=t?-1:e,this.zc=o,this.fl=t,this.sw=a,t&&(this.cy=Math.cos(t.yaw||0),this.sy=Math.sin(t.yaw||0)),this.look(0)}look(e,o=0,t=0,a="none"){return this.cls=e,this.seed=o,this.eav=t,this.open=a,this}_facet(e,o){const t=o[0],a=o[1],s=o[2],r=Math.abs(t)+Math.abs(s)<1e-9,i=this.cls,l=r||i>=10&&i<=12,f=Math.abs(t)>=Math.abs(s),m=l?r&&i<10?0:i:a!==0&&i>0&&i<9?9:i,u=!l&&f?2:0;let h=1/0,c=-1/0;if(this._ext&&!l)h=this._ext[0],c=this._ext[1];else for(let g=0;g<3;g++){const x=e[g][u];h=Math.min(h,x),c=Math.max(c,x)}const P=a===0&&(this.open==="all"||this.open==="u"&&f||this.open==="z"&&!f)&&m>0&&m<9?c-h:0,v=l?0:h,b=ft;b.cls=m;for(let g=0;g<3;g++){const x=e[g];b.s[g]=x[u]-v,b.h[g]=l?x[2]:x[1],b.w[g]=l?x[3]||0:P}return b}_w(e,o){if(!this.fl)return o[0]=e[0],o[1]=e[1],o[2]=this.zc+e[2],o;const t=this.fl;return o[0]=t.x+e[0]*this.cy+e[2]*this.sy,o[1]=t.y+e[1],o[2]=t.z-e[0]*this.sy+e[2]*this.cy,o}tri(e,o,t,a,s){const r=this._w(e,at),i=this._w(o,rt),l=this._w(t,it);let f=i[0]-r[0],m=i[1]-r[1],u=i[2]-r[2],h=l[0]-r[0],c=l[1]-r[1],d=l[2]-r[2],P=m*d-u*c,v=u*h-f*d,b=f*c-m*h,g=s[0],x=s[2];if(this.fl){const B=g*this.cy+x*this.sy;x=-g*this.sy+x*this.cy,g=B}const M=!(P*g+v*s[1]+b*x<0);M||(P=-P,v=-v,b=-b);const p=1/(Math.hypot(P,v,b)||1);P*=p,v*=p,b*=p;const w=lt,_=ct;w[0]=r,w[1]=M?i:l,w[2]=M?l:i,_[0]=e,_[1]=M?o:t,_[2]=M?t:o;const E=Array.isArray(a),T=this.f?this._facet(_,s):null;this._kept=M,this.tris>=this.cap&&this._grow();const S=this.p,L=this.n,F=this.c,D=this.a,G=this.s,H=this.f,j=this.k;for(let B=0;B<3;B++){const I=E?a[B===0||M?B:3-B]:a,C=w[B];let k=S.len;if(S.v[k]=C[0],S.v[k+1]=C[1],S.v[k+2]=C[2],L.v[k]=P,L.v[k+1]=v,L.v[k+2]=b,F.v[k]=I.r,F.v[k+1]=I.g,F.v[k+2]=I.b,S.len=L.len=F.len=k+3,D.v[D.len++]=this.aA,this.soft&&!this.fl&&(S.v[k]=0,D.v[D.len-1]=Math.min(Math.max(this.aA+C[0],0),A.L)),G){const N=this.sw,O=_[B][1];k=G.len,G.v[k]=N?Math.max(0,O/N.H)**2*N.k:0,G.v[k+1]=N?N.phase:0,G.len=k+2}T&&(k=H.len,H.v[k]=T.s[B],H.v[k+1]=T.h[B],H.v[k+2]=T.w[B],H.v[k+3]=this.eav,H.len=k+4,k=j.len,j.v[k]=T.cls,j.v[k+1]=this.seed,j.len=k+2)}this.tris++}triN(e,o,t,a,s){const r=[s[0][0]+s[1][0]+s[2][0],s[0][1]+s[1][1]+s[2][1],s[0][2]+s[1][2]+s[2][2]],i=this.n.len;this.tri(e,o,t,a,r);const l=this._kept?[0,1,2]:[0,2,1],f=this.n.v;for(let m=0;m<3;m++){let[u,h,c]=s[l[m]];if(this.fl){const P=u*this.cy+c*this.sy;c=-u*this.sy+c*this.cy,u=P}const d=1/(Math.hypot(u,h,c)||1);f[i+3*m]=u*d,f[i+3*m+1]=h*d,f[i+3*m+2]=c*d}}quad(e,o,t,a,s,r){if(this.f){const l=Math.abs(r[0])>=Math.abs(r[2]),f=[e,o,t,a].map(m=>l?m[2]:m[0]);this._ext=[Math.min(...f),Math.max(...f)]}const i=Array.isArray(s);this.tri(e,o,t,i?[s[0],s[1],s[2]]:s,r),this.tri(e,t,a,i?[s[0],s[2],s[3]]:s,r),this._ext=null}box(e,o,t,a,s,r,i,l=!1){this.quad([o,t,s],[o,a,s],[o,a,r],[o,t,r],i,[1,0,0]),this.quad([e,t,s],[e,a,s],[e,a,r],[e,t,r],i,[-1,0,0]),this.quad([e,t,r],[o,t,r],[o,a,r],[e,a,r],i,[0,0,1]),this.quad([e,t,s],[o,t,s],[o,a,s],[e,a,s],i,[0,0,-1]),this.quad([e,a,s],[o,a,s],[o,a,r],[e,a,r],i,[0,1,0]),l&&this.quad([e,t,s],[o,t,s],[o,t,r],[e,t,r],i,[0,-1,0])}gable(e,o,t,a,s,r,i,l,f,m,u=i){const h=Math.tan(r);if(f==="z"){const v=(e+o)/2,b=s+(o-e)/2*h,g=s-i*h;return this.quad([e-i,g,t-u],[v,b,t-u],[v,b,a+u],[e-i,g,a+u],l,[-1,1,0]),this.quad([o+i,g,t-u],[v,b,t-u],[v,b,a+u],[o+i,g,a+u],l,[1,1,0]),this.tri([e,s,t],[o,s,t],[v,b,t],m,[0,0,-1]),this.tri([e,s,a],[o,s,a],[v,b,a],m,[0,0,1]),b}const c=(t+a)/2,d=s+(a-t)/2*h,P=s-i*h;return this.quad([e-u,P,t-i],[e-u,d,c],[o+u,d,c],[o+u,P,t-i],l,[0,1,-1]),this.quad([e-u,P,a+i],[e-u,d,c],[o+u,d,c],[o+u,P,a+i],l,[0,1,1]),this.tri([e,s,t],[e,s,a],[e,d,c],m,[-1,0,0]),this.tri([o,s,t],[o,s,a],[o,d,c],m,[1,0,0]),d}hipEnds(e,o,t,a,s,r,i,l,f,m,u,h){const c=f==="z",d=(S,L,F)=>c?[S,L,F]:[F,L,S],P=c?e:t,v=c?o:a,b=c?t:e,g=c?a:o,x=Math.tan(r),M=(P+v)/2,p=s+(v-P)/2*x,w=s-i*x,_=Math.min((v-P)/2,.45*(g-b)),E=u?b+_:b,T=h?g-_:g;for(const S of[-1,1]){const L=S<0?P-i:v+i,F=S<0?P:v,D=d(S,1,0);this.quad(d(L,w,b),d(M,p,E),d(M,p,T),d(L,w,g),l,D),u&&this.tri(d(L,w,b),d(F,s,b),d(M,p,E),l,D),h&&this.tri(d(L,w,g),d(F,s,g),d(M,p,T),l,D)}return u?this.tri(d(P,s,b),d(v,s,b),d(M,p,E),l,d(0,1,-1)):this.tri(d(P,s,b),d(v,s,b),d(M,p,b),m,d(0,0,-1)),h?this.tri(d(P,s,g),d(v,s,g),d(M,p,T),l,d(0,1,1)):this.tri(d(P,s,g),d(v,s,g),d(M,p,g),m,d(0,0,1)),p}hip(e,o,t,a,s,r,i,l){e-=i,o+=i,t-=i,a+=i;const f=Math.tan(r),m=o-e,u=a-t,h=s-i*f,c=h+Math.min(m,u)/2*f,d=(e+o)/2,P=(t+a)/2,v=u>=m?[d,c,t+m/2]:[e+u/2,c,P],b=u>=m?[d,c,a-m/2]:[o-u/2,c,P],g=[e,h,t],x=[o,h,t],M=[o,h,a],p=[e,h,a];return u>=m?(this.quad(g,v,b,p,l,[-1,1,0]),this.quad(x,v,b,M,l,[1,1,0]),this.tri(g,x,v,l,[0,1,-1]),this.tri(p,M,b,l,[0,1,1])):(this.quad(g,v,b,x,l,[0,1,-1]),this.quad(p,v,b,M,l,[0,1,1]),this.tri(g,p,v,l,[-1,1,0]),this.tri(x,M,b,l,[1,1,0])),c}pyramid(e,o,t,a,s,r,i){const l=[(e+o)/2,s+r,(t+a)/2];this.tri([e,s,t],[o,s,t],l,i,[0,1,-1]),this.tri([e,s,a],[o,s,a],l,i,[0,1,1]),this.tri([e,s,t],[e,s,a],l,i,[-1,1,0]),this.tri([o,s,t],[o,s,a],l,i,[1,1,0])}lump(e,o,t,a,s,r,i){const l=[[e+a,o,t],[e-a,o,t]],f=[[e,o+s,t],[e,o-s,t]],m=[[e,o,t+r],[e,o,t-r]];for(let u=0;u<2;u++)for(let h=0;h<2;h++)for(let c=0;c<2;c++){const d=l[u],P=f[h],v=m[c];this.triN(d,P,v,i,[[1-2*u,0,0],[0,1-2*h,0],[0,0,1-2*c]])}}trunk(e,o,t,a,s,r){const i=[0,1,2].map(l=>[e+s*Math.cos(l*2.0944+.5),o+s*Math.sin(l*2.0944+.5)]);for(let l=0;l<3;l++){const f=i[l],m=i[(l+1)%3],u=(f[0]+m[0])/2-e,h=(f[1]+m[1])/2-o;this.quad([f[0],t,f[1]],[m[0],t,m[1]],[m[0],a,m[1]],[f[0],a,f[1]],r,[u,0,h])}}geometry(){const e=new y.BufferGeometry;return e.setAttribute("position",new y.BufferAttribute(this.p.out(),3)),e.setAttribute("normal",new y.BufferAttribute(this.n.out(),3)),e.setAttribute("color",new y.BufferAttribute(this.c.out(),3)),e.setAttribute("aAnchor",new y.BufferAttribute(this.a.out(),1)),this.s&&e.setAttribute("aSway",new y.BufferAttribute(this.s.out(),2)),this.f&&(e.setAttribute("aFac",new y.BufferAttribute(this.f.out(),4)),e.setAttribute("aKind",new y.BufferAttribute(this.k.out(),2))),e}}const at=[0,0,0],rt=[0,0,0],it=[0,0,0],lt=[null,null,null],ct=[null,null,null],ft={cls:0,s:[0,0,0],h:[0,0,0],w:[0,0,0]},ht=(n,e)=>Ze(Math.min(Math.max(217,n),e));function Gt(n,e,o,t,a){const s=Math.max(0,n)*ht(t,a);return s*(e+o)/2/(1-s)+.2}const q=n=>new y.Color(n),jt={albi:{brick:.55,stucco:.2,lime:.25,shut:["#56704f","#5f7383","#7b8872"]},girona:{brick:.15,stucco:.6,lime:.25,shut:["#4f6b48","#5b6f80","#5b6f80"]},evora:{brick:.15,stucco:.2,lime:.65,shut:["#7b8872","#7b8872","#56704f"]},ferrara:{brick:.4,stucco:.4,lime:.2,shut:["#56704f","#7b8872","#5f7383"]}},ae={brick:["#9c5a3c","#a8623f","#93533a","#ad6b49","#a05d44"].map(q),stucco:["#c99a5b","#b8683f","#c78e7c","#9a7552","#d2b274","#c4825a"].map(q),lime:["#e2dac8","#ded3bd","#e6dfcf","#d9cdb4"].map(q)},re=["#a5603f","#8d5a45","#b2714f","#77574a","#8b7d71","#96523b","#a8856a","#6b5247"].map(q),ut=["#c3906f","#b6998a","#cba184","#a97f69","#d0ad8f"].map(q),dt=q("#b67c66"),Ce=q("#d8ccb3"),mt=q("#6e4332"),pt=q("#8a5a44"),Ot=["#a9724f","#b88f6c","#9d6a4c","#c2a37f"].map(q),It=["#5a7440","#617a44","#55703d"].map(q);function wt(n,e){const o=n(),t=n(),a=o<e.brick?"brick":o<e.brick+e.stucco?"stucco":"lime",s=ae[a];return s[Math.floor(t*s.length)]}const Fe=n=>ae.brick.includes(n)?1:ae.stucco.includes(n)?2:3;function Ut(n,e){const o=n<e.lime?"lime":n<e.lime+e.brick?"brick":"stucco",t=ae[o];return{col:t[Math.floor(n*7.31%1*t.length)],cls:o==="brick"?1:o==="stucco"?2:3}}const Zt=(n,e)=>{const o=e?ut:re;return o[Math.floor(n()*o.length)]};function ie(n,e,o,t,a,s,r,i){n.quad([o,t,s],[o,a,s],[o,a,r],[o,t,r],i,[1,0,0]),n.quad([e,t,s],[e,a,s],[e,a,r],[e,t,r],i,[-1,0,0]),n.quad([e,t,r],[o,t,r],[o,a,r],[e,a,r],i,[0,0,1]),n.quad([e,t,s],[o,t,s],[o,a,s],[e,a,s],i,[0,0,-1])}function xt(n,e,o,t,a,s,r,i,l,f=-1.3,m={}){const u=m.ends&&(m.ends[0]||m.ends[1]);n.look(m.cls||Fe(r),m.seed||0,t,u?"all":m.open||(s==="z"?"u":"z")),ie(n,-e/2,e/2,f,t,-o/2,o/2,r);const h=u?n.hipEnds(-e/2,e/2,-o/2,o/2,t,a,.4,i,s,r,m.ends[0],m.ends[1]):n.gable(-e/2,e/2,-o/2,o/2,t,a,.4,i,s,r,0);if(l){const c=s==="z"?e*.12:(l-.5)*e*.6,d=s==="z"?(l-.5)*o*.6:o*.12;n.look(1,0,h+.9),n.box(c-.4,c+.4,h-1.2,h+.9,d-.4,d+.4,pt)}return h}function Wt(n,e,o,t,a,s,r,i=-1.3,l=0){return n.look(Fe(s),l,t,"all"),ie(n,-e/2,e/2,i,t,-o/2,o/2,s),n.hip(-e/2,e/2,-o/2,o/2,t,a,.4,r)}function vt(n,e,o,t=-1.3){const a=o-6.5,s=Math.max(1.1,e*.2),r=e/2;n.look(6,0,a),ie(n,-r,r,t,a,-r,r,dt),n.look(0);for(const[i,l]of[[-1,-1],[1,-1],[1,1],[-1,1]])ie(n,i>0?r-s:-r,i>0?r:-r+s,a,a+4.5,l>0?r-s:-r,l>0?r:-r+s,Ce);n.quad([-r+s,a,-r+s],[r-s,a,-r+s],[r-s,a,r-s],[-r+s,a,r-s],mt,[0,1,0]),n.box(-r-.3,r+.3,a+4.5,a+5.3,-r-.3,r+.3,Ce,!0),n.look(6,0,a),n.pyramid(-r-.3,r+.3,-r-.3,r+.3,a+5.3,1.2,re[3])}function Vt(n,e,o,t,a,s,r,i,l=1.2){const f=a[0]-t[0],m=a[1]-t[1],u=Math.hypot(f,m)||1,h=-m/u*r/2,c=f/u*r/2,d=[[t[0]-e+h,t[1]-o+c],[a[0]-e+h,a[1]-o+c],[a[0]-e-h,a[1]-o-c],[t[0]-e-h,t[1]-o-c]],P=-l,v=s,b=(d[0][0]+d[2][0])/2,g=(d[0][1]+d[2][1])/2;for(let x=0;x<4;x++){const M=d[x],p=d[(x+1)%4];n.quad([M[0],P,M[1]],[p[0],P,p[1]],[p[0],v,p[1]],[M[0],v,M[1]],i,[(M[0]+p[0])/2-b,0,(M[1]+p[1])/2-g])}n.quad([d[0][0],v,d[0][1]],[d[1][0],v,d[1][1]],[d[2][0],v,d[2][1]],[d[3][0],v,d[3][1]],i,[0,1,0])}const Te={plane:{H:[14,22],crown:.3,base:.38,cols:["#4a6a30","#42612f","#557538","#b09a3e"]},lime:{H:[9,18],crown:.34,base:.34,cols:["#3f6034","#466a39","#38562f"]},orange:{H:[3,5],crown:.5,base:.3,cols:["#3d5a2b","#45622e","#38532a"]},lemon:{H:[3,4.5],crown:.5,base:.3,cols:["#43652f","#4b6a30"]},fig:{H:[8,11],crown:.42,base:.3,cols:["#456a33","#4f7239"]},olive:{H:[8,10],crown:.42,base:.3,cols:["#68785a","#5f7056"]},walnut:{H:[9,12],crown:.45,base:.32,cols:["#4c6c36","#56743b","#456231"]},pear:{H:[6,8],crown:.38,base:.32,cols:["#537338","#5b7a3c","#4b6c38"]},quince:{H:[4,5.5],crown:.45,base:.3,cols:["#557236","#62783b"]},cypress:{H:[10,16],crown:.11,base:.06,cols:["#2f4126","#33462a"],narrow:!0},poplar:{H:[12,15],crown:.16,base:.12,cols:["#617a38","#557034","#6a843d","#a39a42"],narrow:!0},nettle:{H:[10,14],crown:.36,base:.33,cols:["#4b6f3a","#557a3c"]},oleander:{H:[2.2,2.9],crown:.55,base:.15,cols:["#3f5a30","#4a6534"]},pine:{H:[12,18],crown:.34,base:.6,cols:["#3d5430","#465b31"],flat:!0}},bt=q("#5a4636");function yt(n,e,o,t,a=3){const s=Te[e],r=o*s.crown,i=o*s.base,l=[];for(let f=0;f<a*5;f++)l.push(t());n.trunk(0,0,-.6,i+(o-i)*.35,Math.max(.12,o*.022),bt);for(let f=0;f<a;f++){const m=l.slice(f*5,f*5+5),u=q(s.cols[Math.floor(m[4]*s.cols.length)]);if(s.narrow){const v=f/Math.max(1,a-1);n.lump((m[0]-.5)*r*.3,i+(o-i)*(.32+.38*v),(m[1]-.5)*r*.3,r*(1.1-.4*v),(o-i)*(.34-.06*v),r*(1.1-.4*v),u);continue}const h=f/a*6.283+m[0]*1.2,c=f===0?0:r*(.35+.25*m[1]),d=i+(o-i)*(f===0?.55:.4+.25*m[2]),P=r*(f===0?1:.7+.2*m[3]);n.lump(Math.cos(h)*c,d,Math.sin(h)*c,P,Math.min(P*(s.flat?.36:.85),(o-i)*.5),P,u)}}const gt=Math.PI/180,J=[A.Z_NEAR,58,353,648,943,1238,A.Z_TIP],qt=n=>{let e=0;for(;e<J.length-2&&n>=J[e+1];)e++;return e};async function Kt(n,e){const o=f=>n.core.makeRng(n.core.hashSeed(f+":"+n.seed)),t=o("closing-plain"),a=o("closing-plain-crowns"),s=new y.Group;s.name="closing-plain";const r={houses:0,towers:0,trees:0,cells:0},i={houses:0,trees:0};for(let f=0;f<e.areas.length;f++){const m=new Se,u=new Se(!0),h=110,c=140,d=()=>i.houses+i.trees+m.tris+u.tris;for(const[v,b,g,x]of e.areas[f]){const M=[],p=[];for(let w=g+t.range(80,300);w<x;w+=t.range(300,500))M.push(w);for(let w=v+t.range(60,250);w<b;w+=t.range(300,500))p.push(w);for(let w=g;w+c<=x+1e-6;w+=c){for(let _=v;_+h<=b+1e-6;_+=h){const E=t(),T=t(),S=t.int(3,4),L=[0,1].map(()=>({n:t.int(2,4),s:t.range(0,30),hs:[0,1,2,3,4,5].map(()=>[t.range(6,10),t.range(10,12),t.int(2,3),t.range(20,24),t(),t(),t(),t()])})),F=[t(),t()],D=[0,1,2,3,4].map(()=>[t(),t(),t(),t()]),G=_+h/2,H=w+c/2,j=_+7,B=_+h-7,I=w+7,C=w+c-7,k=.55-.42*Math.min(1,Math.max(0,(e.dist(G)-400)/1400)),N=!0,O=e.inside(_,w)&&e.inside(_+h,w)&&e.inside(_,w+c)&&e.inside(_+h,w+c),R=O&&M.some(U=>U>=w&&U<w+c)&&p.some(U=>U>=_&&U<_+h);if(R&&N){const U=6+F[0]*2,Z=24+F[1]*10;m.body(-1,0,{x:G,y:A.Y0,z:H,yaw:0}),vt(m,U,Z,-.7),r.towers++}if(O&&E<k&&N&&(r.cells++,L.forEach((U,Z)=>{let V=I+U.s,W=0;const te=[];for(;W<U.n&&W<6;W++){const K=U.hs[W];if(V+K[0]>C)break;te.push({s:V,h:K}),V+=K[0]+.06}te.forEach(({s:K,h:X},z)=>{const[we,le,Ee,Be,Re,Ne,,De]=X,He=Z?B-le/2:j+le/2,Ge=[Re,De],je=wt(()=>Ge.shift(),e.pal),Oe=re[Math.floor(Ne*re.length)];m.body(-1,0,{x:He,y:A.Y0,z:K+we/2,yaw:0}),xt(m,le,we,Ee*3.1,Be*gt,"z",je,Oe,0,-.7,{seed:X[6],ends:[z===0,z===te.length-1]}),r.houses++})})),O&&T<.1&&!R&&N)for(let U=0;U<S;U++){const[Z,V,W,te]=D[U],K=Z<.35?"pine":Z<.7?"cypress":"poplar",X=Te[K],z=X.H[0]+(X.H[1]-X.H[0])*te;u.body(-1,0,{x:G-25+50*V,y:A.Y0,z:H-40+80*W,yaw:0},{H:z,k:Math.min(1.6,z/14),phase:a()*6.283}),yt(u,K,z,a,X.narrow?2:1),r.trees++}}await n.yield()}}const P=(v,b,g)=>{if(!v.tris)return 0;const x=v.geometry();x.computeBoundingSphere(),x.boundingSphere.radius+=40;const M=new y.Mesh(x,b);return M.name=g,M.receiveShadow=!0,s.add(M),v.tris};i.houses+=P(m,e.house.colour,"plain-houses-"+(f+1)),i.trees+=P(u,e.tree.colour,"plain-trees-"+(f+1))}const l=i.houses+i.trees;return{group:s,count:r,tris:i,most:e.most,over:e.most===void 0?0:Math.max(0,l-e.most)}}const $=20,At=Math.pow(1+$/6*($/6),-1.5);async function Yt(n,e){const o=n.f1!==void 0,t=o?n.f1:A.TEX_W,a=o?n.z0:A.Z_NEAR,s=o?n.z1-n.z0:A.TEX_H,r=new Uint8Array(t*s*4),i=new Uint8Array(t*s*2),l=new Uint8Array(t*s),f=new Float32Array(t*s),m=64,u=Math.ceil(s/m),h=()=>e&&e.yield?e.yield():null;await h(),n.places&&(n.places(),await h());for(let x=0;x<m;x++){const M=x*u,p=Math.min(s,M+u);for(const w of n.fills){const _=o?w.f0:w.a0,E=o?w.f1:w.a1,T=(_+E)/2,S=!w.plain&&(w.cls===oe.LONG||w.cls===oe.CROSS),L=Math.max(0,Math.round(_)),F=Math.min(t,Math.round(E)),D=Math.max(M,Math.round(w.z0-a)),G=Math.min(p,Math.round(w.z1-a));if(G<=D||F<=L)continue;const H=(w.z0+w.z1)/2-a,j=w.cls===oe.CROSS,B=w.cls,I=w.rgb[0],C=w.rgb[1],k=w.rgb[2],N=R=>Math.max(0,Math.min(255,Math.round(2*R)+128));let O=null;if(S&&!j){O=new Uint8Array(F-L);for(let R=L;R<F;R++)O[R-L]=N(R+.5-T)}for(let R=D;R<G;R++){const U=S&&j?N(R+.5-H):w.sub===void 0?255:w.sub;for(let Z=L,V=R*t+L,W=V*4;Z<F;Z++,V++,W+=4)l[V]=B,r[W]=I,r[W+1]=C,r[W+2]=k,i[2*V+1]=O?O[Z-L]:U}}if(!o)for(let w=M;w<p;w++){const _=Math.max(0,Math.min(t,(n.brink.edgeA||n.brink.cutA)(a+w+.5))),E=(w*t+Math.max(0,_-1))*4;for(let T=_;T<t;T++){const S=w*t+T,L=S*4;l[S]=A.OUT,r[L]=r[E],r[L+1]=r[E+1],r[L+2]=r[E+2]}}await h()}const c=n.lamps.map(x=>[o?56-x.x:x.a,x.z-a,1]);for(const x of!o&&n.strings||[]){const M=Math.hypot(x.a1-x.a0,x.z1-x.z0),p=Math.max(1,Math.floor(M/1.5));for(let w=1;w<p;w++){const _=x.a0+(x.a1-x.a0)*w/p;_>=0&&c.push([_,x.z0+(x.z1-x.z0)*w/p-a,1/12])}}const d=c.length;for(let x=0;x<d;x++){const M=c[x][0],p=c[x][1],w=c[x][2],_=Math.max(0,Math.floor(M-$)),E=Math.min(t-1,Math.ceil(M+$)),T=Math.max(0,Math.floor(p-$)),S=Math.min(s-1,Math.ceil(p+$));for(let L=T;L<=S;L++)for(let F=_;F<=E;F++){const D=F+.5-M,G=L+.5-p,H=D*D+G*G;if(H>=$*$)continue;const j=1+H/36;f[L*t+F]+=w*(1/(j*Math.sqrt(j))-At)}x%25===24&&await h()}const P=oe.YARD,v=oe.GARDEN;for(let x=0;x<24;x++){for(let M=Math.floor(t*s*x/24),p=Math.floor(t*s*(x+1)/24);M<p;M++){const w=l[M],_=w===P||w===v?.25:w===A.OUT?0:1;r[4*M+3]=Math.round(255*Math.min(1,f[M])*_),i[2*M]=w}await h()}const b=new y.DataTexture(r,t,s,y.RGBAFormat,y.UnsignedByteType);b.colorSpace=y.SRGBColorSpace,b.generateMipmaps=!0,b.minFilter=y.LinearMipmapLinearFilter,b.magFilter=y.LinearFilter,b.anisotropy=Math.min(8,e&&e.renderer&&e.renderer.capabilities?e.renderer.capabilities.getMaxAnisotropy():1),b.wrapS=b.wrapT=y.ClampToEdgeWrapping,b.needsUpdate=!0;const g=new y.DataTexture(i,t,s,y.RGFormat,y.UnsignedByteType);return g.minFilter=g.magFilter=y.NearestFilter,g.generateMipmaps=!1,g.unpackAlignment=1,g.needsUpdate=!0,{mean:b,cls:g,classData:l,box:{z0:a,w:t,h:s,flat:o}}}const Mt=ue(he),pe=new Float64Array(4);function Pt(n){let e=1/0,o=-1/0,t=1/0,a=-1/0,s=1/0,r=-1/0;const i=(l,f,m,u)=>{const h=(m||0)+2;let c,d;u!==void 0?(c=u,d=A.Y0):(de(Mt,l,pe),c=pe[0],d=pe[1]),e=Math.min(e,c-h),o=Math.max(o,c+h),t=Math.min(t,d-h),a=Math.max(a,d+h),s=Math.min(s,f-h),r=Math.max(r,f+h)};if(n.length&&typeof n[0]=="number")for(let l=0;l+2<n.length;l+=3)i(n[l],n[l+1],n[l+2]);else for(const l of n)Array.isArray(l)?i(l[0],l[1],l[2]):(l.a===void 0||l.a<0)&&l.x!==void 0?i(0,l.z,l.radius,l.x):i(l.a,l.z,l.radius);return e>o?new y.Sphere(new y.Vector3(A.HX,A.Y0,0),1):new y.Sphere(new y.Vector3((e+o)/2,(t+a)/2,(s+r)/2),Math.hypot(o-e,a-t,r-s)/2)}const kt=`
uniform sampler2D uPlanMean; uniform sampler2D uPlanClass; uniform vec4 uPlanBox; uniform vec4 uPool; uniform vec3 uBack;
uniform vec3 uBand; uniform vec2 uGlowDir; uniform vec3 uLampC; uniform float uTrim;
varying vec2 vPlan;
float landPool; float landSheen; float landPud; vec2 landW; bool landCut;
${me}
${Ie}
`,_t=`
  {
    vec2 pq = vec2(vPlan.x, vPlan.y - uPlanBox.x);              // metres in the plan's own texture
    ivec2 pt = ivec2(clamp(floor(pq), vec2(0.0), uPlanBox.yz - 1.0));
    vec2 pk = texelFetch(uPlanClass, pt, 0).rg * 255.0;         // the class, and the place across a street
    landCut = pk.x > 250.0;                                     // past the cut: the discard itself is the program's LAST line (patch)
    vec4 pm = texture(uPlanMean, pq / uPlanBox.yz);
    landPool = pm.a;
    vec2 pw = fwidth(vPlan); landW = pw; landPud = 0.0;
    float pfar = smoothstep(0.5, 1.2, max(pw.x, pw.y));
    vec3 pcol = pm.rgb;
    landSheen = pk.x < 3.5 ? 1.0 : 0.0;                         // paved ground alone takes the sheen
    if (pfar < 1.0) {
      vec3 pat = pm.rgb;
      if (pk.x < 2.5) {                                         // setts: s along the street, t across it
        bool lg = pk.x < 1.5;
        float s = lg ? vPlan.y : vPlan.x, ws = lg ? pw.y : pw.x, t = lg ? vPlan.x : vPlan.y, wt = lg ? pw.x : pw.y;
        pat = fcCourses(pat, pat * 0.55, t, s, wt, ws, 0.24, 0.16, 0.14, 0.14);
        float band = fcLines(s / 6.4, ws / 6.4, 0.078);
        float d = (pk.y - 128.0) * 0.5 + fract(t) - 0.5;        // metres from the street's middle
        float mid = pk.y > 254.0 || pk.y < 1.0 ? 0.0 : fcBox(d, -0.45, 0.45, wt);
        pat *= mix(1.0, 1.22, band) * mix(1.0, 0.74, mid) / 1.017;
      } else if (pk.x < 3.5) {                                  // slabs, laid as the promenade's: rows 0.6 m of z, joints every 1.2 m of a
        float row = floor(vPlan.y / 0.6), bed = fcLines(vPlan.y / 0.6 + 0.0167, pw.y / 0.6, 0.0333);
        float per = mix(fcLines(vPlan.x / 1.2 + 0.5 * mod(row, 2.0) + 0.0083, pw.x / 1.2, 0.0167), 0.0167, smoothstep(0.35, 0.8, pw.y / 0.6));
        float joint = bed + per - bed * per;
        // (band courses ACROSS the way only, every 9.6 m of z: none runs along a square or the promenade, so no line stands down a square's middle)
        float grid = fcLines((vPlan.y + 0.15) / 9.6, pw.y / 9.6, 0.03125);
        vec2 sl = vec2(row, floor(vPlan.x / 1.2 + 0.5 * mod(row, 2.0)));
        float tone = 1.0 + 0.16 * (fcHash(sl) - 0.5) * (1.0 - smoothstep(0.3, 1.2, max(pw.x, pw.y)));
        // (and its panel's tone, the stone between four band courses: one delivery; the promenade's own figures and hash)
        tone *= 1.0 + 0.09 * (wetHash(floor(vPlan / 9.6) + 3.0) - 0.5) * (1.0 - smoothstep(4.8, 19.2, max(pw.x, pw.y)));
        pat *= tone * mix(1.0, 0.9, grid) * mix(1.0, 0.5, joint) / 0.969;
        landSheen = mix(mix(1.0, 0.35, max(joint, grid)), 1.0, pfar);   // stone always shows: a joint takes a third of the sheen
      } else if (pk.y < 4.5) {                                  // A COURT'S SETTS (smaller than a street's: 0.14 by 0.2 m), its drain, its worn path
        pat = fcCourses(pat, pat * (pk.y > 3.5 ? 0.8 : 0.6), vPlan.x, vPlan.y, pw.x, pw.y, 0.14, 0.2, 0.14, 0.1);
        if (pk.y > 1.5 && pk.y < 3.5) {                         // the drain: a dark channel 0.24 m wide down the middle of its metre
          bool da = pk.y < 2.5; pat *= mix(1.0, 0.5, fcBox(fract(da ? vPlan.y : vPlan.x) - 0.5, -0.12, 0.12, da ? pw.y : pw.x));
        }
      } else if (pk.y < 5.5) {                                  // FLAGS 0.9 by 0.6 m, broken bond, each its own tone
        float fr = floor(vPlan.y / 0.6); vec2 fq = vec2(vPlan.x / 0.9 + 0.5 * mod(fr, 2.0), vPlan.y / 0.6);
        float fj = max(fcLines(fq.x + 0.015, pw.x / 0.9, 0.03), fcLines(fq.y + 0.02, pw.y / 0.6, 0.04));
        pat *= (1.0 + 0.24 * (fcHash(floor(fq) + 7.0) - 0.5) * (1.0 - smoothstep(0.3, 0.9, max(pw.x, pw.y)))) * mix(1.0, 0.55, fj) / 0.969;
      } else if (pk.y < 250.0) {                                // EARTH (clods 0.45 m), GRASS (tufts 1.3 m), GRAVEL (0.25 m), A HEDGE (0.7 m): grained
        float cell = pk.y < 6.5 ? 0.45 : pk.y < 7.5 ? 1.3 : pk.y < 8.5 ? 0.25 : 0.7, amp = pk.y < 6.5 ? 0.36 : pk.y < 7.5 ? 0.26 : pk.y < 8.5 ? 0.16 : 0.5;
        float gr = wetNoise(vPlan / cell + pk.y * 13.0) - 0.5 + 0.5 * (wetNoise(vPlan / (0.31 * cell) + 5.0) - 0.5);
        pat *= 1.0 + amp * gr * (1.0 - smoothstep(0.4, 1.2, max(pw.x, pw.y) / cell));   // (to its mean once a grain is under the footprint)
      }
      pcol = mix(pat, pm.rgb, pfar);
    }
    landSheen *= 1.0 - smoothstep(30.0, 60.0, vPlan.x);         // the sheen fades out up the ground: a law of the place
    if (landSheen > 0.0) {                                      // WATER LIES IN A KERB'S GUTTER ALONE (the plan's GUTTER metre, 0.7 m of it): never on open paving
      landPud = pk.x > 2.5 && pk.y > 9.5 && pk.y < 10.5 ? wetGutter(vec2(fract(vPlan.x), vPlan.y), pw.x) * (1.0 - smoothstep(2.0, 6.0, max(pw.x, pw.y))) : 0.0;
      pcol *= mix(1.0, 0.6, landPud); landSheen = mix(landSheen, 1.0 - smoothstep(30.0, 60.0, vPlan.x), landPud);
    }
    diffuseColor.rgb = gl_FrontFacing ? pcol : vec3(0.0);
  }
`,Lt=`
  // (the pools take the promenade's own trim on the hinge line and ease to their own over the sheen's 60 m: one light over the hinge)
  totalEmissiveRadiance += gl_FrontFacing ? diffuseColor.rgb * uPool.rgb * (uPool.a * landPool * mix(uTrim, 1.0, smoothstep(0.0, 60.0, vPlan.x))) : uBack;
  if (gl_FrontFacing && landSheen > 0.0) {                      // THE SHEEN, a reflection: the promenade's own law of F and of the afterglow
    vec3 lsV = normalize(vViewPosition);
    float lsf = 1.0 - max(dot(normal, lsV), 0.0), lsf2 = lsf * lsf, lsf5 = lsf2 * lsf2 * lsf;
    float lsF = min(0.35, 0.05 + 0.95 * lsf5); lsF = mix(lsF, max(lsF, 0.16), landPud);   // (shallow water over stone: a sixth at the least, as the promenade's)
    vec3 lsR = inverseTransformDirection(reflect(-lsV, normal), viewMatrix);
    float lsw = (1.0 - smoothstep(0.10, 0.20, lsR.y)) * max(0.0, dot(lsR.xz, uGlowDir));
    // (a gutter's level water mirrors the afterglow from steeper sight lines too, to 35 deg: the promenade's own)
    lsw = mix(lsw, (1.0 - smoothstep(0.25, 0.6, lsR.y)) * max(0.0, dot(normalize(lsR.xz + vec2(0.00001)), uGlowDir)), landPud);
    // THE LAMPS' STREAKS: the sight line mirrored in the ground runs on along the ground, away from the eye, and stands one
    // lamp's height (5 m) up after 5 / tan(its angle to the ground) metres; wet stone's grain draws a lamp's image out along
    // that line, so the pools' own texture (every lamp of the plan: its alpha is 1 at a lamp's foot) is read at 0.5 to 1.9
    // of that run; each reading cubed (a lamp's foot, 3 m about it) x the promenade's own falloff 6 / (1 + d^2 / 90)
    vec3 lsVw = inverseTransformDirection(lsV, viewMatrix), lsNw = inverseTransformDirection(normal, viewMatrix);
    vec3 lsTa = uPlanBox.w * cross(lsNw, vec3(0.0, 0.0, 1.0));  // the plan's first axis on the bent ground (a; f under the flat town)
    vec2 lsT = vec2(dot(lsVw, lsTa), lsVw.z);
    float lsl = max(length(lsT), 0.001), lsRun = 5.0 * lsl / max(dot(lsNw, lsVw), 0.03), lsS = 0.0;
    vec2 lsD = -lsT / lsl, lsP = vec2(vPlan.x, vPlan.y - uPlanBox.x);
    float lsLod = log2(max(1.0, 0.75 * max(landW.x, landW.y))); // (a footprint over 4 m blurs the lamps' feet away: no sparkle far off)
    for (int i = 0; i < 5; i++) {
      float lsk = 0.5 + 0.35 * float(i), lsd = lsRun * lsk / lsl;
      float lsa = textureLod(uPlanMean, (lsP + lsD * (lsRun * lsk)) / uPlanBox.yz, lsLod).a;
      lsS += lsa * lsa * lsa * 6.0 / (1.0 + lsd * lsd / 90.0);
    }
    // (x 0.9: two of the five readings meet a lamp's foot, so a streak's middle stands as bright as the promenade's lobe)
    totalEmissiveRadiance += lsF * (mix(uBack, uBand, lsw) + 0.9 * lsS * uLampC) * landSheen;
  }
`;async function $t(n,e){const o=e.light&&e.light.landUniforms||{},t=new y.Color("#ffb057"),a=o.uPool||{value:new y.Vector4(t.r,t.g,t.b,1.6)},s=o.uBack||{value:new y.Color("#323e76")},r=e.light&&e.light.lit||{},i=r.uBand||{value:new y.Color("#ff9a55")},l=r.uGlowDir||{value:new y.Vector2(-.4226,.9063)},f=r.uLampC||{value:new y.Color("#ffd9a0")},m={value:e.trim===void 0?.7:e.trim},u=p=>nt(e.bend,"land",{plan:{},night:{pars:kt,colour:_t,emit:Lt,key:"land",uniforms:{uPlanMean:{value:p.mean},uPlanClass:{value:p.cls},uPlanBox:{value:new y.Vector4(p.box.z0,p.box.w,p.box.h,p.box.flat?-1:1)},uPool:a,uBack:s,uBand:i,uGlowDir:l,uLampC:f,uTrim:m}}}),h=u(e.tex),c=u(e.flatTex),d=[];for(let p=0;p<=60;p++)d.push(p*A.H/2);for(let p=31;p<=A.N;p++)d.push(p*A.H);const P=[];for(let p=0;p<=12;p++)P.push(A.Z_NEAR+25*p);for(let p=1;p<=5;p++)P.push(J[p]);for(let p=0;p<=13;p++)P.push(A.Z_FULL1+5.5*p);P.push(A.Z_TIP);const v=new y.Group;v.name="closing-land";const b=[],g={land:0,flat:0},x=d.length;for(let p=0;p<6;p++){const w=P.filter(C=>C>=J[p]-1e-6&&C<=J[p+1]+1e-6),_=w.length*x,E=e.plan.brink&&e.plan.brink.rim,T=E?Math.max(J[p],E.z0):0,S=E?Math.min(J[p+1],E.z1):0,L=E&&S>T?12:0,F=new Float32Array((_+L)*3),D=new Float32Array((_+L)*3),G=new Float32Array(_+L),H=[],j=[];w.forEach((C,k)=>{const N=ce(C);for(let O=0;O<x;O++){const R=k*x+O;F[R*3+2]=C,D[R*3+1]=1,G[R]=Math.min(d[O],N)}});for(let C=0;C+1<w.length;C++){const k=Math.max(ce(w[C]),ce(w[C+1]));for(let N=0;N+1<x&&!(d[N]>=k);N++){const O=C*x+N,R=O+x;H.push(O,R,O+1,O+1,R,R+1)}}if(L){const k=E.wall.h,N=(E.wall.a0+E.wall.a1)/2;[[[-.3,0,T],[-.3,0,S],[-.3,k,S],[-.3,k,T],[-1,0]],[[.3,0,T],[.3,k,T],[.3,k,S],[.3,0,S],[1,0]],[[-.3,k,T],[-.3,k,S],[.3,k,S],[.3,k,T],[0,1]]].forEach((R,U)=>{const Z=_+4*U;for(let V=0;V<4;V++){const W=Z+V;F[W*3]=R[V][0],F[W*3+1]=R[V][1],F[W*3+2]=R[V][2],D[W*3]=R[4][0],D[W*3+1]=R[4][1],G[W]=N}H.push(Z,Z+1,Z+2,Z,Z+2,Z+3)})}for(let C=0;C<x;C++)j.push(d[C],w[0],0,d[C],w[w.length-1],0);const B=new y.BufferGeometry;B.setAttribute("position",new y.BufferAttribute(F,3)),B.setAttribute("normal",new y.BufferAttribute(D,3)),B.setAttribute("aAnchor",new y.BufferAttribute(G,1)),B.setIndex(H),B.boundingSphere=Pt(j);const I=new y.Mesh(B,h.colour);I.customDepthMaterial=h.depth,I.name="closing-land-"+(p+1),v.add(I),b.push(I),g.land+=H.length/3,n&&n.yield&&await n.yield()}{const p=e.plan.flat,w=56-p.f1,_=56,E=p.z0,T=p.z1,S=2,L=12,F=[],D=[],G=[],H=[];for(let I=0;I<=L;I++)for(let C=0;C<=S;C++)F.push(w+(_-w)*C/S,A.Y0,E+(T-E)*I/L),D.push(0,1,0),G.push(-1);for(let I=0;I<L;I++)for(let C=0;C<S;C++){const k=I*(S+1)+C,N=k+S+1;H.push(k,N,k+1,k+1,N,N+1)}const j=new y.BufferGeometry;j.setAttribute("position",new y.Float32BufferAttribute(F,3)),j.setAttribute("normal",new y.Float32BufferAttribute(D,3)),j.setAttribute("aAnchor",new y.Float32BufferAttribute(G,1)),j.setIndex(H),j.computeBoundingSphere();const B=new y.Mesh(j,c.colour);B.customDepthMaterial=c.depth,B.name="closing-flat-ground",v.add(B),b.push(B),g.flat=H.length/3}const M=()=>{for(const p of b)p.geometry.dispose();h.dispose(),c.dispose();for(const p of[e.tex,e.flatTex])p.mean.dispose(),p.cls.dispose()};return{group:v,meshes:b,tris:g.land+g.flat,trisBy:g,materials:[h,c],dispose:M}}export{he as B0,J as BAND_Z,Ve as BEND_GLSL,Ct as BEND_METRE,oe as GROUND_CLS,St as GROUND_SUB,ce as Lz,jt as PALETTES,A as PLAN,Te as TREE_KINDS,Ie as WET_GLSL,Se as Writer,Tt as bAt,qt as bandOf,Et as bendAt,de as bendFrame,Gt as bendGap,ue as bendKnots,nt as bendMaterials,Bt as bendNormal,Dt as facadeUniforms,Me as fadeSun,Ht as flatMaterial,Ut as gardenWall,Wt as hipHouse,Ze as k1,ht as kMax,Rt as makeBend,$t as makeLand,Kt as makePlainBlocks,Nt as makeSwayUniforms,Yt as planTextures,Ft as rampR,Zt as roofColour,xt as rowHouse,Vt as segWall,Pt as sweepSphere,be as theta1,vt as tower,yt as tree,Fe as wallClass,wt as wallColour,ie as walls4};
