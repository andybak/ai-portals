import*as e from"three";const v=.2,f=`
varying vec3 vDir;
void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }
`,k=`
uniform vec2 uSkySeed;
varying vec3 vDir;
// THE HIGH SKY (the dome's own): a far river of stars and gas across the sky and some three thousand stars above 40
// degrees of elevation; under that, down to 18 degrees, the river's faint skirts and a thinner sheet of stars. All
// of it stands only where the air itself is dark, so the glow round the hole stays clean and the low sky calm.
const vec3 SKY_RIVER_POLE = vec3(-0.275, 0.454, 0.847);    // the river lies on the great circle about this pole
const vec3 SKY_RIVER_UP = vec3(0.140, 0.891, -0.432);      // its highest place: 63 degrees up, 18 degrees right of the hole's bearing
const vec3 SKY_RIVER_ALONG = vec3(0.951, 0., 0.309);       // the level line it runs along
// one sheet of stars on the sky's plane overhead: cells to the unit, and the share of the cells that hold a star
// (dealt by the seed). x: the star's light, y: a draw for its tint. Each star is about a pixel wide at the least
// (and fainter for it) and twinkles slowly at its own pace and phase: an ambient loop by the clock.
vec2 skySheet(vec3 d, float cells, float share, float px, float salt) {
  vec2 g = d.xz / d.y * cells, c = floor(g), hc = c + uSkySeed + salt;
  float h = kdSkyHash(hc);
  if (h > share) return vec2(0.);
  vec2 o = 0.25 + 0.5 * vec2(kdSkyHash(hc + 17.), kdSkyHash(hc + 43.));
  vec3 sd = vec3(c.x + o.x, cells, c.y + o.y);                                 // the star's own direction
  float ang = length(d - sd * inversesqrt(dot(sd, sd))), rad = max(0.0011, 0.95 * px), mag = h / share;
  float twinkle = 0.72 + 0.28 * sin(uKdTime * (0.9 + 1.4 * kdSkyHash(hc + 71.)) + 6.2832 * kdSkyHash(hc + 5.));
  return vec2((1. - smoothstep(0.3 * rad, rad, ang)) * (0.22 + 0.78 * mag * mag) * (0.5 + 0.55 * 0.0011 / rad) * twinkle, kdSkyHash(hc + 29.));
}
vec3 skyTint(float t) {                                    // most stars blue-white, some white, a few pale gold, a very few rose
  return mix(mix(vec3(0.78, 0.87, 1.0), vec3(1.0, 0.97, 0.92), step(0.55, t)), mix(vec3(1.0, 0.86, 0.60), vec3(1.0, 0.66, 0.52), step(0.94, t)), step(0.8, t));
}
// the lower stars, down to 18 degrees of elevation: one sheet on the sky's wall (bearing and elevation; cells of a
// degree and a half, 240 round the sky). keep (0 to 1) thins them: a star stands where its own draw is under keep.
vec2 skyWall(vec3 d, float px, float keep) {
  vec2 c = floor(vec2(atan(d.x, -d.z), asin(clamp(d.y, -1., 1.))) * 38.197), hc = c + uSkySeed + 113.;
  float h = kdSkyHash(hc), r = 0.85 * kdSkyHash(hc + 91.), on = smoothstep(r, r + 0.15, keep);
  if (h > 0.4 || on <= 0.) return vec2(0.);
  vec2 o = (c + 0.25 + 0.5 * vec2(kdSkyHash(hc + 17.), kdSkyHash(hc + 43.))) / 38.197;     // the star's bearing and elevation
  vec3 sd = vec3(sin(o.x) * cos(o.y), sin(o.y), -cos(o.x) * cos(o.y));
  float ang = length(d - sd), rad = max(0.0011, 0.95 * px), mag = h / 0.4;
  float twinkle = 0.72 + 0.28 * sin(uKdTime * (0.9 + 1.4 * kdSkyHash(hc + 71.)) + 6.2832 * kdSkyHash(hc + 5.));
  return vec2((1. - smoothstep(0.3 * rad, rad, ang)) * (0.2 + 0.9 * mag * mag * mag * mag) * (0.5 + 0.55 * 0.0011 / rad) * twinkle * on, kdSkyHash(hc + 29.));
}
// calm: 1 where the air itself is dark, 0 where it is bright (in the hole's glow, and toward the horizon)
vec3 skyHigh(vec3 d, float px, float calm) {
  if (d.y <= 0.3 || calm <= 0.) return vec3(0.);
  float hi = smoothstep(0.64, 0.82, d.y), low = smoothstep(0.31, 0.74, d.y);
  // the river: a soft band of far stars and gas, in clouds, with a dark lane of dust wandering along its middle;
  // its body stands above 40 degrees, its faint skirts reach down to 18
  float lat = dot(d, SKY_RIVER_POLE), core = exp(-lat * lat / 0.034), wide = exp(-lat * lat / 0.18), n1 = 0.5;
  vec3 col = vec3(0.);
  if (wide > 0.02) {
    float lon = atan(dot(d, SKY_RIVER_UP), dot(d, SKY_RIVER_ALONG));
    n1 = kdCloudNoise(vec2(lon * 2.6 + 11., lat * 8. + 5.));
    float n2 = kdCloudNoise(vec2(lon * 7.3 + 3., lat * 21. + 9.)), n3 = kdCloudNoise(vec2(lon * 19. + 7., lat * 55. + 2.));
    float clouds = smoothstep(0.2, 0.85, 0.6 * n1 + 0.4 * n2);
    float rl = lat + 0.03 * sin(lon * 2.3 + 1.) + 0.07 * (n1 - 0.5);
    float dust = exp(-rl * rl / 0.0022) * smoothstep(0.25, 0.7, 0.55 * n2 + 0.45 * n3);
    float glow = (core * (0.4 + 0.9 * clouds) * (0.75 + 0.5 * n3) * hi + 0.3 * wide * low) * (1. - 0.75 * dust);
    col = mix(vec3(0.14, 0.21, 0.46), vec3(0.40, 0.39, 0.50), core * clouds * hi) * (0.42 * glow);
  }
  // the stars above 40 degrees: a few bright, hundreds of middling, thousands of faint ones that crowd toward the river
  if (hi > 0.) {
    vec2 a = skySheet(d, 6., 0.3, px, 0.), b = skySheet(d, 20., 0.4, px, 31.), c = skySheet(d, 50., 0.14 + 0.45 * core * (0.5 + n1), px, 77.);
    col += (skyTint(a.y) * (1.25 * a.x) + skyTint(b.y) * (0.5 * b.x) + skyTint(c.y) * (0.22 * c.x)) * hi;
  }
  // and under them the lower stars, thinning smoothly downward to none at 18 degrees (a few more near the river)
  if (hi < 1.) {
    float x = clamp((d.y - 0.3) / 0.5, 0., 1.);
    vec2 w = skyWall(d, px, min(x * sqrt(x) * (1. + 1.2 * wide), 1.) * calm);
    col += skyTint(w.y) * (0.8 * (1. - hi) * w.x);
  }
  return col * calm;
}
void main() {
  vec3 d = vDir * inversesqrt(max(dot(vDir, vDir), 1e-6));
  float px = KD_PIXEL(d), gr = max(uKdGrow, 1.);                             // gr: the hole's growth past the crest
  // the sky as kdSky lays it (the air, the hole over it, the cloud over both), with the high sky behind the cloud
  vec4 h = kdHole(d), c = kdCloud(d);
  vec3 air = kdAir(d);
  // (the stars and the river stand only where the air itself is dark: none in the hole's glow, fewer toward the horizon)
  float calm = 1. - smoothstep(0.05, 0.085, dot(air, vec3(0.3, 0.59, 0.11)));
  vec3 col = mix(air * (1. - h.a) + h.rgb + skyHigh(d, px, calm) * (1. - h.a), c.rgb, c.a);
  float hr = degrees(acos(clamp(dot(d, KD_HOLE_DIR), -1., 1.)));              // degrees from the hole's centre
  float lit = clamp(dot(col, vec3(0.3, 0.59, 0.11)) * 5., 0., 1.);            // 1 where the band of fire crosses in front
  col -= ${v.toFixed(3)} * (1. - lit) * (1. - smoothstep(KD_HOLE_SH * gr - 0.12, KD_HOLE_SH * gr + 0.04, hr));
  gl_FragColor = vec4(col, 1.);
}
`;async function m(t,c={}){const a=c.light,s=t.core.makeRng(t.core.hashSeed("knee-deep-under-the-wave:sky:"+t.seed)),r=new e.Group,d={...a.uniforms,uSkySeed:{value:new e.Vector2(Math.floor(s()*64),Math.floor(s()*64))}},n=new e.ShaderMaterial({uniforms:d,vertexShader:f,fragmentShader:a.GLSL+k,side:e.BackSide,depthWrite:!1,fog:!1}),i=new e.SphereGeometry(2e4,48,24),o=new e.Mesh(i,n);o.renderOrder=-10,o.frustumCulled=!1,r.add(o),await t.yield();function l(g,y,h){h&&o.position.setFromMatrixPosition(h.matrixWorld)}return l(0,0,null),{object:r,uniforms:d,update:l,dispose(){i.dispose(),n.dispose()}}}export{m as buildSky};
