import{GLSL_HASH as p,GLSL_VALUE_NOISE as x,GLSL_FBM as w}from"../kit/fx.js";const g=p+x+w,y=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uGndCol, uFogCol, uAirCol, uLampCol, uTurf;
uniform float uFogDen, uTime, uLit, uDew, uFarSeed;
uniform vec2 uWind;
uniform sampler2D uShade; uniform vec4 uShadeBox;
vec3 landShade(vec2 xz){ vec2 uv = (xz - uShadeBox.xy) * uShadeBox.zw; return texture2D(uShade, clamp(uv, 0., 1.)).rgb; }
// a matt surface under the scene's sun and fill: alb its colour, n its normal, sun how much of the sun reaches it,
// open how much of the sky
vec3 landLight(vec3 alb, vec3 n, float sun, float open){
  vec3 irr = uSunCol * max(dot(n, uSunDir), 0.) * sun + mix(uGndCol, uSkyCol, .5 + .5 * n.y) * open;
  return alb * irr * .31831;
}
// grass is glossy: it throws back a little of the sky, most at a low angle of view, so shade and distance are cooler
// and paler (v: the unit vector from the place to the eye)
vec3 landSheen(vec3 n, vec3 v, float open){ float g = 1. - max(dot(n, v), 0.); g *= g; return uSkyCol * (open * (.012 + .045 * g * g)); }
// the sward's own colour: short turf, and long grass yellower and paler (longK 0 short to 1 long; var a patch's own number)
vec3 landSward(float longK, float var){ return mix(uTurf * (.88 + .24 * var), uTurf * vec3(1.36, 1.16, .6) * (.9 + .2 * var), longK); }
// the air by distance: over the far country (air 0..1: how far a place is the far country's) the thin blue of
// distance, then everywhere the scene's own haze (the same law as the scene's fog)
vec3 landFog(vec3 c, float depth, float air){
  c = mix(c, uAirCol, (1. - exp(-depth * .0004)) * air * .8);
  float f = 1. - exp(-uFogDen * uFogDen * depth * depth); return mix(c, uFogCol, clamp(f, 0., 1.));
}
// slow cloud shadows drifting downwind over the land, by place and the world's clock: how much of the sun a place
// gets, 1 in the open sun down to a little over half under a cloud, in soft patches a furlong across
float landCloud(vec2 xz){
  vec2 q = xz - uWind * uTime * 1.8;
  return 1. - .44 * smoothstep(.45, .66, vnoise(q * .0062 + 11.) * .7 + vnoise(q * .017 + 3.) * .3);
}
// the wind over the land: gusts running downwind as long fronts, 0..1, by place and the world's clock
float landGust(vec2 xz){
  vec2 q = xz - uWind * uTime * 2.2;
  float a = vnoise(vec2(dot(q, uWind) * .045, dot(q, vec2(-uWind.y, uWind.x)) * .016));
  float b = vnoise(q * .11 + 7.3);
  return clamp(a * .75 + b * .35, 0., 1.);
}
`;function S(r,n,a){return{uSunDir:{value:n.sun.clone()},uSunCol:{value:n.sunLight.clone()},uSkyCol:{value:n.skyLight.clone()},uGndCol:{value:n.groundLight.clone()},uFogCol:{value:a.color.clone()},uFogDen:{value:a.density},uAirCol:{value:n.air.clone()},uLampCol:{value:n.lamp.clone()},uTurf:{value:n.turf.clone()},uTime:{value:0},uLit:{value:n.lit},uDew:{value:n.dew},uWind:{value:new r.Vector2(n.wind[0],n.wind[1])},uShade:{value:null},uShadeBox:{value:new r.Vector4(0,0,1,1)},uFarSeed:{value:n.farSeed}}}const e={size:92,c:.8,s:.6,warp:.3,a:[1.31,.7,.73,2.1],b:[1.17,4.2,.61,1.3],hay:.56,corn:.8,mown:.93},o=r=>r.toFixed(3);function b(r,n,a){let t=(e.c*r-e.s*n)/e.size,s=(e.s*r+e.c*n)/e.size;const c=e.warp*(Math.sin(s*e.a[0]+e.a[1])+.5*Math.sin(t*e.a[2]+e.a[3])),l=e.warp*(Math.sin(t*e.b[0]+e.b[1])+.5*Math.sin(s*e.b[2]+e.b[3]));t+=c,s+=l;const u=Math.floor(t),i=Math.floor(s),h=t-u,f=s-i,d=Math.min(h,1-h),v=Math.min(f,1-f);return a.gx=u,a.gy=i,a.e=Math.min(d,v)*e.size,a.across=d<v,a}function C(r,n,a){let t=r,s=n;for(let c=0;c<7;c++){const l=e.warp*(Math.sin(s*e.a[0]+e.a[1])+.5*Math.sin(t*e.a[2]+e.a[3])),u=e.warp*(Math.sin(t*e.b[0]+e.b[1])+.5*Math.sin(s*e.b[2]+e.b[3]));t=r-l,s=n-u}return a.x=e.size*(e.c*t+e.s*s),a.z=e.size*(-e.s*t+e.c*s),a}function L(r,n,a){const t=r*.3719+n*.6113+.1731*r*n+a;return t-Math.floor(t)}const $=`
vec2 farCell(vec2 p){
  vec2 q = vec2(${o(e.c)} * p.x - ${o(e.s)} * p.y, ${o(e.s)} * p.x + ${o(e.c)} * p.y) / ${o(e.size)};
  return q + ${o(e.warp)} * vec2(sin(q.y * ${o(e.a[0])} + ${o(e.a[1])}) + .5 * sin(q.x * ${o(e.a[2])} + ${o(e.a[3])}),
    sin(q.x * ${o(e.b[0])} + ${o(e.b[1])}) + .5 * sin(q.y * ${o(e.b[2])} + ${o(e.b[3])}));
}
float farKind(vec2 g){ return fract(g.x * .3719 + g.y * .6113 + .1731 * g.x * g.y + uFarSeed); }
vec3 landFar(vec2 p, float steep, float px){
  vec2 q = farCell(p), g = floor(q), f = fract(q);
  float h = farKind(g), h2 = hash12(g + 41.), h3 = hash12(g + 87.);
  vec3 c = uTurf * mix(vec3(.8, .95, 1.), vec3(1.16, 1.06, .78), h2);
  c = mix(c, uTurf * vec3(1.5, 1.24, .6), step(${o(e.hay)}, h));
  c = mix(c, uTurf * vec3(2.05, 1.5, .62), step(${o(e.corn)}, h));
  c = mix(c, uTurf * vec3(1.7, 1.46, .9), step(${o(e.mown)}, h));
  // the field's own grain (mowing lines, drill rows) while it is wider than the pixel
  float rows = sin(dot(p, vec2(cos(h3 * 6.283), sin(h3 * 6.283))) * 1.4);
  c *= 1. + .07 * rows * step(${o(e.hay)}, h) * (1. - smoothstep(1., 3., px));
  c *= .88 + .24 * vnoise(p * .045);
  float e = min(min(f.x, 1. - f.x), min(f.y, 1. - f.y)) * ${o(e.size)};
  float w = 2.2 + 1.6 * h2 + 5.5 * smoothstep(.5, .8, vnoise(p * .06 + 31.));
  float hedge = 1. - smoothstep(w - px, w + px + .6, e);
  c = mix(c, uTurf * vec3(.3, .42, .34), hedge * .9 * (1. - smoothstep(10., 40., px)));
  float wood = smoothstep(.56, .66, vnoise(p * .0052 + 3.) * .7 + steep * 1.6 + vnoise(p * .021) * .16);
  c = mix(c, uTurf * vec3(.27, .42, .33) * (.75 + .5 * vnoise(p * .09)), wood);
  return c;
}
`,F=`
// a drystone face: courses of flat stones some forty centimetres high and of uneven lengths, c.x metres along the
// face and c.y metres up; x: 1 on a stone and 0 in a joint (joints no finer than the pixel px), y: the stone's own number
vec2 stoneFace(vec2 c, float px){
  float row = floor(c.y / .42), x = c.x / .95 + .5 * mod(row, 2.) + 3.7 * hash11(row + 3.);
  x += .27 * sin(x * 2.1 + row * 1.7);
  vec2 g = vec2(floor(x), row), f = vec2(fract(x), fract(c.y / .42));
  float j = min(min(f.x, 1. - f.x) * .95, min(f.y, 1. - f.y) * .42), w = .03 + px;
  return vec2(smoothstep(w * .4, w * 1.6, j), hash12(g + 2.));
}
`;export{e as FAR,$ as LAND_FAR,g as LAND_NOISE,y as LAND_PARS,F as LAND_STONE,b as farField,L as farKind,C as farPoint,S as landUniforms};
