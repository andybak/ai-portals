import*as e from"three";import{clamp as k,smoothstep as te}from"../kit/core.js";const ve=["#2A2350","#7A3B78","#E85A5A","#FF9A45","#FFE08A","#B8687E","#0E0B12"],W=40,B=.12,T=(p,n,s)=>new e.Vector3(s,n,390-p);function we(p){const n=p.range(-12,12),s=8+p.range(-1,1);return[{t0:18.5,ts:20,a:new e.Vector3(638+p.range(-8,8),184,n-20),s:new e.Vector3(670,70,n)},{t0:25.7,ts:27,a:new e.Vector3(457,150,s+14),s:new e.Vector3(500,54,s)}]}function oe(p){let n=0;const s=24,m=k(p,31.3,41);for(let y=0;y<s;y++){const u=31.3+(m-31.3)*(y+.5)/s,r=k((u-32)/8,0,1),d=60*Math.pow(.1667,r);n+=Math.min(Math.PI,30/d)*(m-31.3)/s}return n}const ge=`
uniform vec4 uA;        // show T, ambient time, flow phase, torus spin
uniform vec4 uB;        // the same a moment later (for headings)
uniform vec4 uVar;      // per-seed variety
uniform vec3 uStO[2];   // stoop strike points
uniform float uStT[2];  // seconds since each strike (negative = not yet)
uniform vec3 uFA[2];    // falcon line start
uniform vec3 uFD[2];    // falcon line direction
uniform vec2 uFL[2];    // distance travelled, hole strength
uniform vec3 uCam;      // camera in brief space
uniform vec3 uPump;     // windpump wx, n, clearance radius
uniform float uBubble;  // camera bubble radius (0 = off)
uniform float uErupt;   // 1 = dawn: the ribbon lifts out of the reedbed roost
uniform float uRare;    // 1 = rare event: a third of the birds arrive as a second flock from the north

float tri(float x){ return abs(fract(x) * 2. - 1.); }

vec3 sRibbon(vec4 sd, float ph, float T, float tm){
  float u = fract(ph);
  float tp = pow(max(sin(3.14159 * u), 0.), .4);
  // at the very start the densest 250 m hangs just ahead of the entry, so it reads through the portal
  float open = smoothstep(0., 3., T);
  float wx = 40. + mix(250. * u, 12. * T + 400. * u, open);
  float n = (44. + 10. * uVar.x) * sin(u * (6.5 + 2. * uVar.y) + tm * .33 + uVar.z * 6.)
          + 15. * sin(u * 17. - tm * .52 + uVar.w * 6.);
  float y = mix(18., 14., open) + 3.5 * sin(u * 12. - tm * .7 + uVar.x * 9.);
  float ang = 6.2832 * sd.y + u * 9. + tm * .3, rr = pow(sd.z, .6);
  n += cos(ang) * rr * 14. * tp;
  y += sin(ang) * rr * 6. * tp;
  if (uErupt > .5) {
    // the far end of the ribbon is still pouring up out of the reeds
    float up_ = smoothstep(0., 1., T / 2.6 + .9 - 1.6 * u);
    y = mix(2.4 + 1.6 * sd.z + 5. * up_ * (1. - up_) * sd.w, y, up_);
  }
  return vec3(wx, y, n);
}

vec3 sTear(vec4 sd, float ph, float T, float tm){
  float hf = step(.5, fract(ph));
  float q = pow(tri(ph), .4);
  float y, r;
  float wx = 215. + 135. * pow(q, .8) + 18. * uVar.x * q;
  float n = (26. * sin(q * 5. + tm * .4 + uVar.z * 6.) + 30. * uVar.y) * (1. - q * .8);
  if (q < .5) { y = 9. + 86. * pow(q / .5, 1.35); }
  else { y = 95. + 155. * (q - .5) / .5; }
  float s = clamp((q - .5) / .5 * 2. - 1., -1., 1.);
  float rb = 82. * sqrt(max(0., 1. - s * s)) * (.82 + .18 * s);
  r = mix(4.5 + 6. * q, rb, smoothstep(.44, .62, q));
  r *= 1. + .07 * sin(tm * 1.3 + q * 6.);
  float ang = 3.14159 * (sd.y + hf) + tm * .25 + q * 2.5, rr = pow(sd.z, .42);
  wx += cos(ang) * rr * r;
  n += sin(ang) * rr * r;
  y += (sd.w - .5) * 5. * step(q, .5);
  return vec3(wx, y, n);
}

vec3 sHour(vec4 sd, float ph, float T, float tm){
  float hf = step(.5, fract(ph));
  float p = tri(ph) * 2. - 1.;
  float sg = p < 0. ? -1. : 1.;
  float ap = pow(abs(p), .75);
  float lobe = max(sin(3.14159 * ap), 0.) * (1. + .16 * sg * uVar.x);
  float pinch = smoothstep(20.1, 20.6, T) * (1. - smoothstep(21.5, 22.6, T));
  float split = smoothstep(20.4, 20.9, T) * (1. - smoothstep(21.1, 21.8, T));
  float nearW = 1. - smoothstep(0., .45, ap);
  float rl = 54. * lobe + 15. * nearW * (1. - .93 * pinch);
  // the body lies across the view (yawed off the flight line and slowly turning) so the whole
  // 600 m is seen broadside against the sun from the reveal point
  float al = sg * ap * 250. + sg * 24. * split * nearW;
  float y = 70. + 11. * sin(tm * .5 + sg * 1.3 + uVar.z * 6.) * ap;
  float lt = 22. * sin(ap * 3. + tm * .3 + uVar.w * 6.) * sg * ap;
  float ang = 3.14159 * (sd.y + hf) + tm * .22 * sg + ap * 2., rr = pow(sd.z, .36);
  lt += cos(ang) * rr * rl;
  y += sin(ang) * rr * rl * .5;
  float psi = (uVar.y > 0. ? 1. : -1.) * (1.3 + .035 * (T - 17.));
  float cp = cos(psi), sp = sin(psi);
  float cx = 670.;
  return vec3(cx + al * cp - lt * sp, y, al * sp + lt * cp);
}

// The wave is a barrel lying ALONG the flight line and keeping pace with the camera: its face stands
// out of the flood on the south (left), arches over the line and the lip falls on the north (right),
// over the windpump. The camera dives through the roof and rides the tube toward the sun, so the
// sheet is always seen edge-on (dense) and its arch frames the sun; far ahead it rears taller and
// has not yet curled over.
vec3 sWave(vec4 sd, float ph, float T, float tm){
  float hf = step(.5, fract(ph)) * 2. - 1.;
  float a = sd.y;
  float wx = 410. + 27. * (T - 25.) + 400. * a;
  float grow = 1. + .5 * a;
  float q = pow(tri(ph), .8);
  float rear = smoothstep(25.2, 27., T);
  float curlEnd = mix(1.9, mix(-.8, .7, smoothstep(.25, 1., a)), rear);
  float n, y, th; vec2 nr;
  if (q < .38) {
    float s = q / .38;
    n = -25. - 52. * (1. - s) * (1. - s); y = 4. + 58. * pow(s, 1.2); th = mix(4., 7., s);
    nr = normalize(vec2(-1., .9 * (1. - s)));
  } else {
    float v = (q - .38) / .62;
    float phi = mix(3.14159, curlEnd, v), rad = 45. * (1. - .3 * v);
    nr = vec2(cos(phi), sin(phi));
    n = 20. + nr.x * rad; y = 62. + nr.y * rad; th = mix(7., 3.5, v * v);
  }
  float off = th * hf * pow(sd.z, .7);
  n += nr.x * off; y += nr.y * off;
  n = n * grow + 12. * sin(wx * .016 + tm * .45 + uVar.z * 6.) * a + 5. * uVar.x;
  y = 5. + (y - 5.) * grow * (1. + .08 * sin(wx * .023 - tm * .7));
  return vec3(wx, y, n);
}

vec3 sTorus(vec4 sd, float T, float tm, float spin){
  float k = clamp((T - 32.) / 8., 0., 1.);
  float R = 60. * pow(.1667, k);
  float th = 6.2832 * sd.x + spin * (.9 + .2 * sd.w);
  float minor = mix(15., 3., k);
  float ang = 6.2832 * sd.y + th * 2. + tm * .6, rr = sqrt(sd.z);
  float radial = R + cos(ang) * rr * minor;
  float ax = sin(ang) * rr * minor * 1.7;
  float wx = 752. + 8. * k + ax;
  // drain: each bird leaves the ring at its own moment, spirals inside the portal rim and through
  float td = 35.6 + 3.9 * fract(sd.w * 7.31 + sd.x);
  float g = clamp((T - td) / 1.3, 0., 1.);
  float gs = g * g * (3. - 2. * g);
  radial = mix(radial, 1.2 + 4.6 * sqrt(sd.z), gs);
  wx += g * g * 70.;
  float sy = sin(th), cy = cos(th);
  float squash = sy < 0. ? min(1., 33. / max(radial, 1.)) : 1.;
  return vec3(wx, 40. + sy * radial * squash, cy * radial);
}
`,xe=`
vec3 flockPos(vec4 sd, vec4 A){
  float T = A.x, tm = A.y;
  float ph = sd.x + A.z * (.6 + .8 * sd.w);
  float Tb = T - .5 * fract(sd.x * 3. + sd.w * 1.7);
  vec3 p; float m = 0.;
  if (Tb < 10.3) {
    p = sRibbon(sd, ph, T, tm);
    if (Tb > 9.) { m = smoothstep(9., 10.3, Tb); p = mix(p, sTear(sd, ph, T, tm), m); }
  } else if (Tb < 18.3) {
    p = sTear(sd, ph, T, tm);
    if (Tb > 17.) { m = smoothstep(17., 18.3, Tb); p = mix(p, sHour(sd, ph, T, tm), m); }
  } else if (Tb < 26.3) {
    p = sHour(sd, ph, T, tm);
    if (Tb > 25.) { m = smoothstep(25., 26.3, Tb); p = mix(p, sWave(sd, ph, T, tm), m); }
  } else if (Tb < 32.4) {
    p = sWave(sd, ph, T, tm);
    if (Tb > 31.3) { m = smoothstep(31.3, 32.4, Tb); p = mix(p, sTorus(sd, T, tm, A.w), m); }
  } else {
    p = sTorus(sd, T, tm, A.w);
  }
  p.y += sin(3.14159 * m) * 14. * (sd.z - .35);
  // rare event: a second body comes in from the north, passes through the first like smoke and merges
  if (uRare > .5 && fract(sd.w * 3.77 + sd.y * 5.31) < .34) {
    float ra = 1. - smoothstep(2., 14.5, T);
    float rb = smoothstep(11.5, 16., T) * (1. - smoothstep(17.5, 23.5, T));
    p.z += 420. * ra - 135. * rb;
    p.y += 34. * ra + 16. * rb + 20. * sin(ra * 3.14159);
    p.x += 70. * ra - 30. * rb;
  }
  // turbulence: two octaves of swirling displacement, a travelling density wave, personal wander
  float calm = 1. - .75 * smoothstep(34., 38., T);
  vec3 tb = 5. * sin(p.yzx * .045 + tm * .6 + vec3(0., 2., 4.) + uVar.xyz * 6.)
          + 2. * sin(p.zxy * .13 - tm * 1.1 + sd.w * .6);
  tb.y *= .4;
  p += tb * calm;
  vec3 d1 = normalize(vec3(1., .15, .45));
  p += d1 * 5. * calm * sin(dot(p, d1) * .085 - tm * 2.2);
  p += .9 * sin(tm * vec3(1.3, 1.7, 1.1) * (.6 + sd.w) + sd.xyz * 40.);
  // falcon holes: a capsule of empty air that follows each stoop
  for (int i = 0; i < 2; i++) {
    float hs = uFL[i].y;
    if (hs > 0.) {
      vec3 v = p - uFA[i];
      float t = clamp(dot(v, uFD[i]), max(0., uFL[i].x - 110.), uFL[i].x);
      vec3 d = v - uFD[i] * t;
      float dl = length(d) + 1e-3;
      float ps = max(0., 13.5 - dl);
      p += d / dl * ps * (.55 + .45 * ps / 13.5) * hs;
    }
  }
  // the windpump column
  vec2 dp = p.xz - uPump.xy; float dpl = length(dp) + 1e-3;
  p.xz += dp / dpl * max(0., uPump.z - dpl) * (1. - smoothstep(14., 24., p.y));
  // bird-free bubble round the camera
  vec3 dc = p - uCam; float dcl = length(dc) + 1e-3;
  p += dc / dcl * max(0., uBubble - dcl);
  p.y = max(p.y, 2.2 + 1.6 * sd.z);
  return p;
}

// bank angle: travelling bands at all times plus the stoop shock shells
float bankAt(vec3 p, float tm, vec4 sd){
  vec3 d2 = normalize(vec3(.8, .25, -.55));
  float w = sin(dot(p, d2) * .034 - tm * 1.7 + 2. * sin(tm * .21 + uVar.w * 6.));
  float bk = 1.05 * smoothstep(.55, .95, w) + .18 * sin(tm * .9 + sd.w * 30.);
  for (int i = 0; i < 2; i++) {
    float ts = uStT[i];
    if (ts > 0. && ts < 7.) {
      float sh = 1. - smoothstep(0., 7.5, abs(length(p - uStO[i]) - 80. * ts));
      bk = mix(bk, 1.22, sh * (1. - smoothstep(5., 7., ts)));
    }
  }
  return bk;
}
`,ae=`
attribute vec4 aSeed;
uniform float uViewH, uMirror, uMinPx, uNearCull;
uniform vec3 uSun;
varying float vGl;
#include <common>
#include <fog_pars_vertex>
${ge}
${xe}
vec3 toLocalDir(vec3 v){ return vec3(v.z, v.y * uMirror, -v.x); }
//@MIRROR_PARS
void main(){
  vec3 p0 = flockPos(aSeed, uA), p1 = flockPos(aSeed, uB);
  vec3 f = normalize(p1 - p0 + vec3(1e-4, 0., 0.));
  vec3 r = normalize(cross(f, vec3(0., 1., 0.)) + vec3(0., 0., 1e-4));
  vec3 up = cross(r, f);
  float bk = bankAt(p0, uA.y, aSeed);
  r = r * cos(bk) + up * sin(bk);
  up = cross(r, f);
  vec3 vd = normalize(uCam - p0);
  float facing = dot(up, vd);
  float flat_ = abs(facing);
  vGl = pow(max(dot(up * sign(facing), uSun), 0.), 3.);
  float id = position.x;
  vec3 lp = vec3(p0.z, p0.y * uMirror, 390. - p0.x);
  vec4 mvPosition = modelViewMatrix * vec4(lp, 1.);
  float dist = max(-mvPosition.z, .05);
  float hsh = fract(aSeed.w * 91.7 + aSeed.y * 13.3);
  bool offWater = false;
  //@MIRROR_MAIN
  // one-triangle darts never come close to the eye: only folded birds fly in the near field
  bool gone = offWater || (uA.x > 32. && p0.x > 780.) || dist < uNearCull * (.55 + .45 * hsh);
  float S = 1. + 2. * smoothstep(60., 320., dist);
  if (dist < 55. + 50. * hsh) {
    // near: a real folded bird, the fold is the wingbeat (12 Hz with short glides)
    float fl = sin(uA.y * 75.4 + aSeed.w * 44.);
    float gl = smoothstep(.5, .7, sin(uA.y * 1.9 * (.7 + aSeed.z * .6) + aSeed.y * 40.));
    float fa = mix(fl * .85, .14, gl);
    vec3 o;
    if (id < .5) o = f * .19;
    else if (id < 1.5) o = f * .02;
    else o = ((id < 2.5 ? -1. : 1.) * r * cos(fa) + up * sin(fa)) * .23 - f * .15;
    mvPosition = modelViewMatrix * vec4(lp + toLocalDir(o) * S, 1.);
    gl_Position = projectionMatrix * mvPosition;
  } else {
    // far: a screen-facing dart whose width follows how flat the wings lie to the eye
    gl_Position = projectionMatrix * mvPosition;
    vec2 hv = (modelViewMatrix * vec4(toLocalDir(f), 0.)).xy;
    hv = length(hv) > 1e-3 ? normalize(hv) : vec2(0., 1.);
    vec2 pv = vec2(-hv.y, hv.x);
    float ppm = projectionMatrix[1][1] * uViewH * .5 / dist;
    float wpx = .38 * S * ppm * mix(.3, 1., flat_);
    float lpx = .33 * S * ppm;
    // density waves: slow folds of thick and thin flock that drift through the body
    vec3 dq = p0 * vec3(.021, .034, .026);
    float dens = .5 + .25 * sin(dq.x + 1.7 * sin(dq.z - uA.y * .23) + uA.y * .5 + uVar.z * 6.)
                    + .25 * sin(dq.y * 1.3 - dq.z * .8 - uA.y * .37 + 1.3 * sin(dq.x * .7));
    float keep = mix(.6, 1., smoothstep(.2, .75, dens)) * mix(1., .55 + .45 * smoothstep(.2, .75, dens), smoothstep(100., 300., dist));
    if (wpx < uMinPx) {
      keep *= clamp(wpx / uMinPx * 3.4, .16, 1.);
      wpx = uMinPx;
    }
    if (hsh > keep) gone = true;
    lpx = max(lpx, uMinPx * 1.25);
    vec2 o;
    if (id < .5) o = hv * lpx * .55;
    else if (id < 1.5) o = -hv * lpx * .3;
    else o = (id < 2.5 ? -1. : 1.) * pv * wpx * .5 - hv * lpx * .32;
    float asp = projectionMatrix[1][1] / projectionMatrix[0][0];
    gl_Position.xy += o * 2. / vec2(uViewH * asp, uViewH) * gl_Position.w;
  }
  if (gone) gl_Position = vec4(2., 2., 2., 1.);
  #include <fog_vertex>
}
`,se=`
uniform vec3 uInk, uRim;
varying float vGl;
#include <common>
#include <fog_pars_fragment>
void main(){
  gl_FragColor = vec4(uInk + uRim * vGl * .1, 1.);
  #include <fog_fragment>
}
`,ye=`
attribute vec4 aOff;     // station in camera frame (right, up, ahead) and phase
attribute float aWing;   // 0 on the body, signed span fraction on the wings
uniform vec3 uCP, uCR, uCU, uCF;
uniform float uTime, uAmt, uShow;
varying float vGl;
#include <common>
#include <fog_pars_vertex>
void main(){
  float ph = aOff.w * 6.2832;
  vec3 st = aOff.xyz + vec3(sin(uTime * .7 + ph * 3.), sin(uTime * .9 + ph * 5.) * .6, sin(uTime * .5 + ph * 7.) * 1.4) * .7;
  st.xy += 2.5 * vec2(sin(uTime * .13 + uShow * .37 + ph * 11.), sin(uTime * .11 + uShow * .29 + ph * 13.)) * min(1., aOff.z * .2);
  st.x += 1.5 * sin(uShow * .21 + ph * 29.);
  st.z *= 1. + .35 * sin(uTime * .09 + uShow * .23 + ph * 17.);
  float stay = clamp((uAmt - aOff.w * .96) * 7., 0., 1.);
  st.xy *= 1. + (1. - stay) * 2.5;
  st.y -= (1. - stay) * (1. - stay) * 22.;
  st.z += (1. - stay) * 16.;
  float fl = sin(uTime * 75.4 + ph * 9.);
  float gl = smoothstep(.45, .7, sin(uTime * 1.7 * (.7 + aOff.w * .6) + ph * 4.));
  float fa = mix(fl * .95 - .1, .16, gl);
  float roll = .35 * sin(uTime * .8 + ph * 2.);
  vec3 q = position;
  float a = fa * (.75 * min(abs(aWing) * 2.2, 1.) + .3 * abs(aWing));
  float sx = sign(aWing);
  // fold the wing about the shoulder
  float sh = .018 * sx;
  float dx = q.x - sh;
  q.x = sh + dx * cos(a);
  q.y += abs(dx) * sin(a);
  q.y += -.012 * fl * (1. - gl) * (1. - min(abs(aWing) * 4., 1.));   // body bobs against the beat
  float cr = cos(roll), sr = sin(roll);
  q.xy = vec2(q.x * cr - q.y * sr, q.x * sr + q.y * cr);
  vec3 wp = uCP + uCR * (st.x + q.x) + uCU * (st.y + q.y) + uCF * (st.z - q.z);
  vGl = .5 * abs(aWing) * max(0., sin(a + .6));
  vec4 mvPosition = viewMatrix * vec4(wp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  if (stay < .002) gl_Position = vec4(2., 2., 2., 1.);
  #include <fog_vertex>
}
`;function be(){const p=[],n=[],s=(l,b,M,h=0,v=0,q=0)=>{p.push(...l,...b,...M),n.push(h,v,q)},m=[0,.004,-.115],y=(l,b,M,h)=>[[0,M+h,l],[b,h,l],[0,-M*.9+h,l],[-b,h,l]],u=y(-.045,.024,.022,.002),r=y(.035,.019,.017,-.002);for(let l=0;l<4;l++){const b=(l+1)%4;s(m,u[b],u[l]),s(u[l],u[b],r[b]),s(u[l],r[b],r[l])}const d=[-.026,-.002,.105],g=[.026,-.002,.105];s(r[0],r[1],g),s(r[0],g,d),s(r[0],d,r[3]),s(r[2],g,r[1]),s(r[2],d,g),s(r[2],r[3],d);for(const l of[-1,1]){const b=[.018*l,.008,-.05],M=[.018*l,.006,.03],h=[.085*l,.01,-.058],v=[.08*l,.008,.022],q=[.19*l,.008,.012];s(b,h,v,0,.45*l,.42*l),s(b,v,M,0,.42*l,0),s(h,q,v,.45*l,1*l,.42*l)}const w=new e.BufferGeometry;return w.setAttribute("position",new e.Float32BufferAttribute(p,3)),w.setAttribute("aWing",new e.Float32BufferAttribute(n,1)),w}function Te(){const p=[],n=[[-.26,0],[-.2,.022],[-.1,.05],[.02,.075],[.12,.068],[.2,.04],[.245,.016],[.26,0]],s=8,m=(u,r)=>{const d=r/s*Math.PI*2,[g,w]=n[u];return[Math.cos(d)*w*1.25,Math.sin(d)*w*.8,g]};for(let u=0;u<n.length-1;u++)for(let r=0;r<s;r++){const d=m(u,r),g=m(u,r+1),w=m(u+1,r+1),l=m(u+1,r);u>0&&p.push(...d,...g,...w),u<n.length-2&&p.push(...d,...w,...l)}for(const u of[-1,1]){const r=[.1*u,.01,.13],d=[.27*u,0,0],g=[.13*u,.012,-.44],w=[.05*u,.03,0];p.push(...r,...d,...w,...d,...g,...w,...r,...w,...d,...d,...w,...g)}p.push(-.045,.01,-.2,.045,.01,-.2,.03,.012,-.47,-.045,.01,-.2,.03,.012,-.47,-.03,.012,-.47);const y=new e.BufferGeometry;return y.setAttribute("position",new e.Float32BufferAttribute(p,3)),y}function ne(p,n,s){const m=new e.InstancedBufferGeometry,y=s?[0,1,2,3]:[0,2,3];m.setAttribute("position",new e.Float32BufferAttribute(y.flatMap(r=>[r,0,0]),3)),m.setIndex(s?[0,1,2,0,3,1]:[0,1,2]);const u=new Float32Array(n*4);for(let r=0;r<u.length;r++)u[r]=p();return m.setAttribute("aSeed",new e.InstancedBufferAttribute(u,4)),m.instanceCount=n,m.boundingSphere=new e.Sphere(new e.Vector3(0,100,0),900),m}async function ze(p,n={}){const s=p.rng.fork?p.rng.fork("murmuration"):p.rng,m=n.palette&&n.palette.length>=7?n.palette:ve,y=new e.Color(m[6]),u=new e.Color(m[3]),r=Math.max(1e3,Math.floor(n.quads??36e3)),d=Math.max(1e3,Math.floor(n.darts??7e4)),g=Math.floor(n.wingmen??90),w=(n.sunDir?n.sunDir.clone():new e.Vector3(0,.03,-1)).normalize(),l=n.autoplay??1,b=n.startT??0;let M=n.viewportHeight??1080;const h=new e.Group;h.name="the-murmuration-hero";const v=we(s);for(const t of v)t.dir=t.s.clone().sub(t.a),t.len=t.dir.length(),t.dir.normalize();const q=new e.Vector4(s.range(-1,1),s.chance(.5)?s.range(.3,1):-s.range(.3,1),s(),s()),z={...e.UniformsUtils.clone(e.UniformsLib.fog),uA:{value:new e.Vector4},uB:{value:new e.Vector4},uVar:{value:q},uStO:{value:v.map(t=>t.s.clone())},uStT:{value:[-1,-1]},uFA:{value:v.map(t=>t.a.clone())},uFD:{value:v.map(t=>t.dir.clone())},uFL:{value:[new e.Vector2,new e.Vector2]},uCam:{value:new e.Vector3(0,-9999,0)},uPump:{value:new e.Vector3(590,30,9)},uBubble:{value:3.2},uRare:{value:n.rare?1:0},uErupt:{value:n.erupt?1:0},uViewH:{value:M},uMirror:{value:1},uMinPx:{value:1.5},uNearCull:{value:0},uSun:{value:new e.Vector3(-w.z,w.y,w.x)},uInk:{value:y},uRim:{value:u}},re=new e.Vector2;function D(t,i,f,a,o){if(n.viewportHeight)return;const c=t.getRenderTarget(),x=c?c.height:t.getDrawingBufferSize(re).y;x>0&&o.uniforms.uViewH.value!==x&&(o.uniforms.uViewH.value=x,o.uniformsNeedUpdate=!0)}const L=(t,i=ae)=>new e.ShaderMaterial({uniforms:t,vertexShader:i,fragmentShader:se,fog:!0,side:e.DoubleSide}),ie=L(z),E=(t,i,f,a)=>{const o=new e.Mesh(ne(s,t,i),f);return o.frustumCulled=!1,o.name=a,o.onBeforeRender=D,o};h.add(E(r,!0,ie,"flock-quads")),await p.yield?.();const N=L({...z,uNearCull:{value:n.dartNearCull??42},uViewH:{value:M}});h.add(E(d,!1,N,"flock-darts")),await p.yield?.();const le=new e.MeshBasicMaterial({color:y.clone().multiplyScalar(.8),fog:!0,side:e.DoubleSide}),ue=Te(),fe=n.raptor==="harrier"?new e.Vector3(2.3,1,1.25):n.raptor==="sparrowhawk"?new e.Vector3(1.5,1,.9):new e.Vector3(1,1,1),U=v.map((t,i)=>{const f=new e.Mesh(ue,le);return f.name="falcon-"+i,f.visible=!1,f.frustumCulled=!1,h.add(f),f});let C=null,j=1;const S={...e.UniformsUtils.clone(e.UniformsLib.fog),uCP:{value:new e.Vector3},uCR:{value:new e.Vector3(1,0,0)},uCU:{value:new e.Vector3(0,1,0)},uCF:{value:new e.Vector3(0,0,-1)},uTime:{value:0},uAmt:{value:1},uShow:{value:0},uInk:{value:y},uRim:{value:u}};if(g>0){const t=be(),i=new e.InstancedBufferGeometry;i.setAttribute("position",t.getAttribute("position")),i.setAttribute("aWing",t.getAttribute("aWing"));const f=new Float32Array(g*4);for(let a=0;a<g;a++){let o,c,x,V=0;do{const G=a<36?s.range(3.2,8):s.range(6,14.5),ee=s.range(-1.05,1.05),O=s.range(-.5,.5);o=Math.sin(ee)*Math.cos(O)*G,c=Math.sin(O)*G-.2,x=Math.cos(ee)*Math.cos(O)*G}while(Math.hypot(o,c)<1+.12*x&&++V<20);f.set([o,c,x,(a+.5)/g],a*4)}i.setAttribute("aOff",new e.InstancedBufferAttribute(f,4)),i.instanceCount=g,C=new e.Mesh(i,new e.ShaderMaterial({uniforms:S,vertexShader:ye,fragmentShader:se,fog:!0,side:e.DoubleSide})),C.frustumCulled=!1,C.name="wingmen",h.add(C)}const R=new e.Vector3,H=new e.Vector3;function I(t,i,f){const a=v[t];if(i<a.t0-3.2||i>a.ts+5)return!1;if(i<a.t0){const o=(i-(a.t0-3.2))/3.2,c=o*(.35+.65*o);f.set(a.a.x-185,a.a.y+42,a.a.z+(t?6:-10)).lerp(a.a,c),f.y+=Math.sin(o*Math.PI)*10}else if(i<a.ts)f.copy(a.a).addScaledVector(a.dir,80*(i-a.t0));else{const o=i-a.ts,c=1.2,x=Math.min(o,c);if(f.set(a.s.x+a.dir.x*80*o,a.s.y+a.dir.y*80*(x-x*x/(2*c)),a.s.z+a.dir.z*80*o),o>c){const V=o-c;f.x+=45*V,f.y+=7*V*V}}return!0}function ce(t,i,f){return I(t,i,R)?(f.set(R.z,R.y,390-R.x),!0):!1}const K=[[0,0,2.5,0],[3,58,2.5,0],[6,118,3,0],[9,172,30,4],[12,225,72,10],[14,262,105,6],[16,298,160,0],[17.5,322,205,-4],[19,345,222,-4],[20.6,372,226,-2],[22.2,400,215,0],[24,430,182,0],[26.2,478,70,0],[28.5,530,22,0],[31,585,25,0],[32,610,34,0],[34,660,40,0],[36,705,40,0],[38,745,40,0],[40,780,40,0]],pe={portalSeat:{position:T(780,40,0),facing:new e.Vector3(0,0,1)},flyThrough:K.map(t=>T(t[1],t[2],t[3])),flyTimes:K.map(t=>t[0]),revealLook:T(670,70,0),forms:{ribbon:T(300,14,0),teardrop:T(323,172,0),hourglass:T(670,70,0),wave:T(560,60,0),torus:T(756,40,0)},stoop1:T(v[0].s.x,v[0].s.y,v[0].s.z),stoop2:T(v[1].s.x,v[1].s.y,v[1].s.z),windpump:T(590,0,30),viewpoints:{reveal:T(372,226,-2),outside:T(380,60,-420),low:T(120,4,-60)}};let F=null,$=null;const _=new e.Vector3,Q=new e.Vector3,Y=new e.Vector3,J=new e.Vector3,A=new e.Vector3,P=new e.Vector3,me=new e.Matrix4,X=.036;function de(t){return F!==null?F:l>0?(b+t*l)%W:b}function Z(t,i,f){const a=de(i);z.uA.value.set(a,i,i*X,oe(a)),z.uB.value.set(a+B,i+B,(i+B)*X,oe(a+B));for(let o=0;o<2;o++){const c=v[o];z.uStT.value[o]=a-c.ts;const x=te(c.t0+.5,c.t0+1,a)*(1-te(c.ts+1.2,c.ts+3.4,a));z.uFL.value[o].set(k(80*(a-c.t0),0,c.len+60),x);const V=U[o];V.visible=I(o,a,A),V.visible&&(I(o,Math.min(a+.05,c.ts+5),P),V.position.set(A.z,A.y,390-A.x),H.set(P.z,P.y,390-P.x),H.distanceToSquared(V.position)>1e-6&&V.lookAt(h.localToWorld(H)))}if(f){h.updateMatrixWorld(),f.getWorldPosition(_),A.copy(_).applyMatrix4(me.copy(h.matrixWorld).invert()),z.uCam.value.set(390-A.z,A.y,A.x);for(const o of U)if(o.visible){const c=o.getWorldPosition(P).distanceTo(_);o.scale.copy(fe).multiplyScalar(Math.max(2.2,c*.009))}if(C){const o=f.matrixWorld.elements;Q.set(o[0],o[1],o[2]).normalize(),Y.set(o[4],o[5],o[6]).normalize(),J.set(-o[8],-o[9],-o[10]).normalize();const x=$!==f||S.uCP.value.distanceToSquared(_)>400?1:1-Math.exp(-Math.min(t,.1)*5);S.uCP.value.copy(_),S.uCR.value.lerp(Q,x).normalize(),S.uCU.value.lerp(Y,x).normalize(),S.uCF.value.lerp(J,x).normalize(),S.uAmt.value=j,S.uTime.value=i,S.uShow.value=a,$=f}}}Z(0,0,null);function he(t=15e3,i={}){const f={...z,...i.maskUniforms||{},uNearCull:{value:0},uMirror:{value:-1},uBubble:{value:0},uMinPx:{value:1.1},uViewH:{value:M}};i.ink&&(f.uInk={value:new e.Color(i.ink)});let a=ae;i.maskGLSL&&(a=a.replace("//@MIRROR_PARS",i.maskGLSL).replace("//@MIRROR_MAIN",`{
        vec3 cl = vec3(uCam.z, uCam.y, 390. - uCam.x);
        vec3 xs = mix(cl, lp, clamp(cl.y / max(cl.y - lp.y, 1e-3), 0., 1.));
        offWater = mirrorMask(xs.xz) > 0.;
      }`));const o=new e.Mesh(ne(s,Math.floor(t),!1),L(f,a));return o.frustumCulled=!1,o.name="flock-mirror",o.onBeforeRender=D,o}return{object:h,radius:400,height:260,center:new e.Vector3(0,90,-40),anchors:pe,uniforms:z,showSeconds:W,setProgress(t){F=k(t,0,1)*W},setShowTime(t){F=k(t,0,W)},setViewportHeight(t){t>0&&(M=t,n.viewportHeight=t,z.uViewH.value=t,N.uniforms.uViewH.value=t)},setWingmen(t){j=k(t,0,1)},makeMirror:he,falconAt:ce,update:Z,dispose(){},ground:!0,groundY:0}}export{ze as buildHero};
