import{LIGHT_BAR_GLSL as i}from"./valley-inside-the-works-plan.js";const e=`
uniform vec3 uSun, uSky, uGround, uLightDir;
${i}
// (brought in: "Hash without Sine", David Hoskins, MIT; see the head of this file)
float vh(vec3 p) { p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yxz + 33.33); return fract((p.x + p.y) * p.z); }
float vn(vec3 p) {
  vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(vh(i), vh(i + vec3(1.0, 0.0, 0.0)), f.x), mix(vh(i + vec3(0.0, 1.0, 0.0)), vh(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
             mix(mix(vh(i + vec3(0.0, 0.0, 1.0)), vh(i + vec3(1.0, 0.0, 1.0)), f.x), mix(vh(i + vec3(0.0, 1.0, 1.0)), vh(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z);
}
vec3 hemi(vec3 n) { return mix(uGround, uSky, 0.5 + 0.5 * n.y); }
`,t=`
#ifdef USE_FOG
  uniform vec3 fogColor; uniform float fogDensity; varying float vFogDepth;
  float fogAmount() { return 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth); }
#else
  const vec3 fogColor = vec3(0.0);
  float fogAmount() { return 0.0; }
#endif
`,o=`
varying vec3 vWorld, vN;
#ifdef USE_FOG
  varying float vFogDepth;
#endif
`,a=`
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz; vN = mat3(modelMatrix) * normal;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #ifdef USE_FOG
    vFogDepth = -mvPosition.z;
  #endif
`,n=`
uniform vec3 uChoc; uniform vec3 uBrown[3];
vec3 lighter(vec3 col) { return col * 1.45 + vec3(0.03, 0.016, 0.007); }
vec3 liquidLight(vec3 col, vec3 N, vec3 world) {
  float ndl = clamp(dot(N, uLightDir) * 0.6 + 0.4, 0.0, 1.0);
  vec3 lit = col * (mix(uGround, uSky, 0.5 + 0.5 * N.y) + uSky * 0.3 + uSun * 0.12 + 0.75 * uSun * ndl * lightBar(world)) * 0.3183;
  float tb = clamp(dot(lit, vec3(0.2126, 0.7152, 0.0722)) / 0.085, 0.12, 1.7);   // (the river's own bounds)
  return tb < 0.6 ? mix(uBrown[0], uBrown[1], (tb - 0.12) / 0.48) : mix(uBrown[1], uBrown[2], tb - 0.6);
}
`,r=`
attribute vec4 aFlow; varying vec4 vFlow;
${o}
void main() {
  vFlow = aFlow;
${a}
}`,h=`
uniform float uSpeed, uTime;
varying vec3 vWorld, vN; varying vec4 vFlow;
${e}
${n}
${t}
// Streaks carried by the stream (they show that it races): the bore is ruled into lanes round the pipe and stretches
// along it, and in most stretches of a lane lies one thin streak with a clean head (downstream) and a tail drawn out
// behind it. The place round the bore is taken round and round (its fraction), so the lanes close on themselves
// with no seam anywhere round the pipe, and every streak lies wholly inside its own lane.
float streaks(float q, float ang, float lanes, float cell, float seed) {
  float al = fract(ang) * lanes, lane = min(floor(al), lanes - 1.0), lf = al - lane - 0.5;
  float qq = q / cell + vh(vec3(lane, seed, 1.0)) * 7.0;
  float id = floor(qq), f = fract(qq);
  float h1 = vh(vec3(id, lane, seed)), h2 = vh(vec3(id, lane, seed + 5.0)), h3 = vh(vec3(id, lane, seed + 9.0));
  float len = 0.3 + 0.55 * h1, start = (0.97 - len) * h2;
  float t = clamp((f - start) / len, 0.0, 1.0);
  float along = smoothstep(0.0, 0.8, t) * (1.0 - smoothstep(0.93, 1.0, t));
  float w = 0.17 + 0.2 * h3;
  float across = 1.0 - smoothstep(0.5 * w, w, abs(lf - (h3 - 0.5) * 0.26));
  return along * across * step(0.62, h1 + h3 * 0.5) * (0.6 + 0.4 * h2);
}
void main() {
  vec3 N = vN / max(length(vN), 1e-4);
  float s = vFlow.x, pipe = floor(vFlow.w + 0.5);
  vec2 rd = vFlow.yz;
  float foot = fwidth(s);                                     // metres of pipe under one pixel
  float ang = atan(rd.y, rd.x) / 6.2832 + 0.5;                // the place round the bore, 0 to 1 (rd is never zero)
  // the stream's own coordinates: everything painted is carried along the pipe at uSpeed (the middle of the stream
  // a little faster than its edge)
  float q = s - uSpeed * uTime + pipe * 17.3, q2 = s - 1.16 * uSpeed * uTime + pipe * 9.1;
  // streaks, two sets; the finer set fades out where a pixel is too coarse for it
  float fine = 1.0 - smoothstep(0.1, 0.3, foot);
  float streak = streaks(q, ang, 4.0, 3.2, pipe + 0.5) + 0.75 * streaks(q2, ang + 0.13, 6.0, 2.1, pipe + 31.5) * fine;
  // the brown itself is never flat: a slow, quiet marbling drawn out along the stream, about the river's own tone
  float marble = vn(vec3(q * 0.22, rd * 1.3 + pipe * 3.7));
  vec3 col = uChoc * (0.88 + 0.24 * marble);
  // a streak is the same chocolate a shade or two lighter: never cream, never white, and nothing else is carried in
  // the stream. Then the light, and by its brightness the river's own brown for the hour (liquidLight)
  col = mix(col, lighter(col), clamp(streak, 0.0, 1.0) * 0.7);
  gl_FragColor = vec4(mix(liquidLight(col, N, vWorld), fogColor, fogAmount()), 1.0);
}`,v=`
attribute vec4 aAxis; varying vec3 vAxis; varying float vCore;
${o}
void main() {
  vAxis = mat3(modelMatrix) * aAxis.xyz; vCore = aAxis.w;
${a}
}`,l=`
// The long highlight of a round pipe under a long light: where the pipe's round (N) meets the half way direction
// between the light and the eye, taken across the pipe only. It lies where the light and the eye put it and nowhere
// else: it moves round the pipe as the eye's place changes, and a stretch of pipe whose half way direction points to
// its far side shows none. Its width is 5 degrees of the round, or a pixel and a half when the pipe is small, and
// then it is fainter by as much as it is wider (the same light over more of the pipe): a far pipe shows no pale
// stripe along it, only its brown.
float lineAcross(vec3 N, vec3 T, vec3 toLight, vec3 V, float foot) {
  vec3 H = toLight + V; H -= T * dot(H, T);
  float hl = length(H); H /= max(hl, 1e-3);
  float d = 1.0 - clamp(dot(N, H), 0.0, 1.0), w = max(0.085, 0.8 * foot);
  return exp(-2.0 * d / (w * w)) * (0.085 / w) * smoothstep(0.03, 0.2, hl);
}
`,d=`
uniform vec3 uGlass;
varying vec3 vWorld, vN, vAxis; varying float vCore;
${e}
${t}
${l}
void main() {
  vec3 N = vN / max(length(vN), 1e-4), T = vAxis / max(length(vAxis), 1e-4);
  vec3 E = cameraPosition - vWorld, V = E / max(length(E), 1e-4);
  float foot = clamp(length(fwidth(N)), 0.0, 1.5);           // how much of the pipe's round one pixel spans
  // across the pipe as seen (0 on its middle line, 1 at its edge), whatever the slant we see the pipe at: taken from
  // the view direction with its part along the pipe removed
  vec3 Vp = V - T * dot(V, T); Vp /= max(length(Vp), 1e-3);
  float ndv = clamp(abs(dot(N, Vp)), 0.0, 1.0);
  float x = sqrt(max(1.0 - ndv * ndv, 0.0));
  float fx = clamp(foot * ndv, 0.0, 0.5);                    // one pixel, in the same measure
  // THE WALL OF THE TUBE, seen edge on outside the chocolate. Glass has thickness: the brown core is narrower than
  // the pipe (vCore of its radius), and from the liquid's edge out to the pipe's own the wall shows as a clear
  // grey-green band (uGlass: the tint of thick glass seen edge on), which lets what is behind it through and is a
  // little denser and darker at the very edge, where the glass is seen through its greatest depth. Never a white
  // band. It keeps its true width at every distance (softened by the pixel's footprint, never widened). Inside it,
  // seen from near, the thin dark line where the liquid meets the glass.
  float wall = smoothstep(vCore - 0.5 * fx, vCore + 0.06 + 0.5 * fx, x), edge = smoothstep(0.86, 1.0, x);
  float meet = (1.0 - smoothstep(0.015, 0.045 + fx, abs(x - vCore))) * (1.0 - smoothstep(0.08, 0.24, foot));
  float bar = lightBar(vWorld);
  float line = lineAcross(N, T, uLightDir, V, foot);
  vec3 sky = uSky * 0.3183, sun = uSun * 0.3183;
  vec3 wallCol = (sky * (0.8 - 0.3 * edge) + sun * bar * 0.05) * uGlass;
  float aWall = wall * (0.4 + 0.3 * edge), aMeet = 0.45 * meet, aLine = 0.8 * line;
  vec3 col = wallCol * aWall + sky * 0.04 * aMeet + (sky * 0.95 + sun * bar * 1.2) * line + sky * 0.012;
  float alpha = clamp(1.0 - (1.0 - aWall) * (1.0 - aMeet) * (1.0 - aLine) * 0.98, 0.0, 0.95);
  float fa = fogAmount();
  gl_FragColor = vec4(mix(col, fogColor * alpha, fa), alpha);
}`,f=`
attribute vec3 aColor; attribute vec3 aPaint; varying vec3 vColor, vPaint;
${o}
void main() {
  vColor = aColor; vPaint = aPaint;
${a}
}`,c=`
varying vec3 vWorld, vN, vColor, vPaint;
${e}
${t}
void main() {
  float footP = fwidth(vPaint.x) + fwidth(vPaint.y);          // the paint's coordinates under one pixel (before any branch)
  vec3 N = vN / max(length(vN), 1e-4);
  if (!gl_FrontFacing) N = -N;
  float kind = vPaint.z, stone = 1.0 - step(-0.5, kind);       // (kind -1: dressed stone, the pads under the pipes' shoes)
  // bare steel is told from the paint by its colour (the paints are green, blue under green; steel is not), and the
  // duller steel of a fitting from the bright steel of a clamp's strap by its tone
  float bare = smoothstep(-0.05, -0.01, vColor.b - vColor.g), dull = bare * (1.0 - smoothstep(0.45, 0.65, vColor.r));
  float steel = bare - 0.65 * dull;
  // worn paint: a slow mottle, and chips down to dark iron (on a fitting's steel, which has no paint to chip, the
  // mottle and a few rust spots only; on stone the mottle only)
  vec3 base = vColor * (0.8 + 0.4 * vn(vWorld * 1.7) * (1.0 - 0.5 * dull));
  base = mix(base, vec3(0.075, 0.062, 0.052), smoothstep(0.7, 0.8, vn(vWorld * 4.3 + 7.0)) * (0.5 - 0.38 * dull) * (1.0 - stone));
  // a joint's rim: the dark seam between its two rings
  float seam = (1.0 - smoothstep(0.08, 0.2, abs(vPaint.x))) * step(0.5, kind) * step(kind, 1.5);
  base *= 1.0 - 0.65 * seam;
  // a joint's face: eight bolts on their circle. On a face the radius is never under 0.5, so the angle is defined;
  // on every other kind of face the angle is taken of a fixed place, (1, 0), and no bolt is painted
  float face = step(1.5, kind) * step(kind, 2.5);
  vec2 fp = mix(vec2(1.0, 0.0), vPaint.xy, face); float r = max(length(fp), 0.3), ang = atan(fp.y, fp.x);
  float dBolt = length(vec2((fract(ang * 1.2732 + 0.5) - 0.5) * 0.7854 * r * 0.74, (r - 0.82) * 0.74));
  float onFace = face * (1.0 - smoothstep(0.03, 0.1, footP));
  float bolt = (1.0 - smoothstep(0.055, 0.085, dBolt)) * onFace, boltShade = (1.0 - smoothstep(0.085, 0.13, dBolt)) * onFace - bolt;
  // a riveted plate: rows of rivet heads 0.44 m apart
  float off = max(kind - 3.0, 0.0);
  float dRiv = length(vec2((fract(vPaint.x / 0.44) - 0.5) * 0.44, abs(vPaint.y) - off));
  float onPlate = step(2.5, kind) * (1.0 - smoothstep(0.05, 0.14, footP));
  float rivet = (1.0 - smoothstep(0.045, 0.07, dRiv)) * onPlate, rivetShade = (1.0 - smoothstep(0.07, 0.11, dRiv)) * onPlate - rivet;
  base *= (1.0 - 0.45 * (boltShade + rivetShade)) * (1.0 + 0.5 * (bolt + rivet));
  // the light: the sky's fill; the sun in the bars; a dull gloss on the paint and a brighter one on bare steel
  // (none on stone)
  float bar = lightBar(vWorld);
  vec3 E = cameraPosition - vWorld, V = E / max(length(E), 1e-4);
  vec3 H = uLightDir + V; H /= max(length(H), 1e-3);
  float ndl = max(dot(N, uLightDir), 0.0);
  float gloss = pow(max(dot(N, H), 1e-4), mix(18.0, 56.0, steel)) * mix(0.12, 0.7, steel) * bar;
  float graze = pow(max(1.0 - max(dot(N, V), 0.0), 1e-4), 4.0) * mix(0.07, 0.3, steel);
  vec3 c = base * (hemi(N) + uSun * ndl * bar) * 0.3183 + (uSun * gloss + uSky * graze) * 0.3183 * (1.0 - stone);
  gl_FragColor = vec4(mix(c, fogColor, fogAmount()), 1.0);
}`;export{h as CORE_FRAG,r as CORE_VERT,t as FOG_FRAG,l as GLASS_LINE,c as IRON_FRAG,f as IRON_VERT,e as LIGHT,n as LIQUID,d as SHELL_FRAG,v as SHELL_VERT};
