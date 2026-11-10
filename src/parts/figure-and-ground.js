import*as e from"three";const be=["#0E0C0A","#EFE6D2","#D9381E","#E3D8BF","#1D1916"],E=8,I=5,U=16;function ke(a){const t=()=>a.range(.74,1.26),o=a.range(-.03,.03),r={A:[[.09,.3*t(),.07],[.31+o,-.46*t(),.13],[.66+o,.56*t(),.14]],B:[[.13,-.34*t(),.08],[.52+o,.4*t(),.2]],C:[[.48-o,.38*t(),.2],[.87,-.32*t(),.08]],D:[[.34-o,.54*t(),.14],[.69-o,-.46*t(),.13],[.91,.3*t(),.07]]},s={W:[-4,0],N:[0,2.5],E:[4,0],S:[0,-2.5]},i={A:["W","N"],B:["N","E"],C:["E","S"],D:["S","W"]},l={};for(const n of"ABCD"){const f=s[i[n][0]],u=s[i[n][1]],m=u[0]-f[0],g=u[1]-f[1],P=Math.hypot(m,g),x=-g/P,h=m/P,v=[];for(let w=0;w<=U;w++){const k=w/U;let C=0;for(const[d,A,M]of r[n])C+=A*Math.exp(-.5*((k-d)/M)**2);const L=Math.min(1,k/.07)*Math.min(1,(1-k)/.07);C*=L*L*(3-2*L),v.push([f[0]+m*k+x*C,f[1]+g*k+h*C])}l[n]=v}return l}function ze(a){const t=[],o=[];for(const s of"ABCD")for(let i=0;i<U;i++)t.push(new e.Vector2(a[s][i][0],a[s][i][1]));const r=(s,i,l)=>{for(let n=U;n>0;n--)o.push(new e.Vector2(a[s][n][0]+i,a[s][n][1]+l))};return r("C",-4,2.5),r("D",4,2.5),r("A",4,-2.5),r("B",-4,-2.5),{fish:t,goose:o}}function Pe(a){const t=e.ShapeUtils.triangulateShape(a,[]),o=new Float32Array(a.length*3);a.forEach((i,l)=>{o[l*3]=i.x,o[l*3+1]=0,o[l*3+2]=i.y});const r=[];for(const i of t)r.push(i[0],i[1],i[2]);const s=new e.BufferGeometry;return s.setAttribute("position",new e.BufferAttribute(o,3)),s.setIndex(r),s}function Ce(a){const t=a.slice(),o=a.length,r=o/2,s=[];for(let n=1;n<U;n++)s.push(t.length),t.push(new e.Vector2(4-8*n/U,0));const i=[],l=[];for(let n=0;n<=r;n++)i.push(n);i.push(...s);for(let n=r;n<o;n++)l.push(n);return l.push(0,...s.slice().reverse()),de(t,[i,l])}function Le(a,t=.9){const o=[],r=a.length;let s=0;for(let f=0;f<r;f++){const u=a[f],m=a[(f+1)%r];o.push(u);for(const g of[t,-t])if((u.y-g)*(m.y-g)<0){const P=(g-u.y)/(m.y-u.y);o.push(new e.Vector2(u.x+(m.x-u.x)*P,g)),s++}}if(s!==4)return Pe(a);const i=[],l=[],n=[];return o.forEach((f,u)=>{f.y>=t-1e-9&&i.push(u),f.y<=-t+1e-9&&l.push(u),Math.abs(f.y)<=t+1e-9&&n.push(u)}),de(o,[i,n,l])}function Fe(a){const t=[[3.9,0],[3,.1],[2.1,.13],[1.1,.36],[-.2,.42],[-1.6,.3],[-3,.1],[-3.9,0],[-3.2,-.14],[-2.2,-.46],[-.9,-.86],[.3,-.9],[1.2,-.52],[1.9,-.2],[3,-.13]].map(n=>new e.Vector2(n[0],n[1])),o=a.getAttribute("position").array,r=o.length/3,s=new Float32Array(o.length+t.length*3);s.set(o),t.forEach((n,f)=>{s[(r+f)*3]=n.x,s[(r+f)*3+1]=n.y});const i=Array.from(a.index.array);for(const n of e.ShapeUtils.triangulateShape(t,[]))i.push(r+n[0],r+n[1],r+n[2]);const l=new e.BufferGeometry;return l.setAttribute("position",new e.BufferAttribute(s,3)),l.setIndex(i),l}function de(a,t){const o=new Float32Array(a.length*3),r=[];a.forEach((i,l)=>{o[l*3]=i.x,o[l*3+2]=i.y});for(const i of t)for(const l of e.ShapeUtils.triangulateShape(i.map(n=>a[n]),[]))r.push(i[l[0]],i[l[1]],i[l[2]]);const s=new e.BufferGeometry;return s.setAttribute("position",new e.BufferAttribute(o,3)),s.setIndex(r),s}async function Re(a,t,o=320,r=200){const s=a.length,i=new Float32Array(s),l=new Float32Array(s),n=new Float32Array(s),f=new Float32Array(s),u=new Float32Array(s),m=new Float32Array(s),g=new Float32Array(s);for(let h=0;h<s;h++){const v=a[h],w=a[(h+1)%s];i[h]=v.x,l[h]=v.y,n[h]=w.x-v.x,f[h]=w.y-v.y,u[h]=(v.x+w.x)/2,m[h]=(v.y+w.y)/2,g[h]=1/Math.max(1e-9,n[h]*n[h]+f[h]*f[h])}const P=new Uint16Array(o*r);for(let h=0;h<r;h++){(h&3)===0&&await t.yield?.();const v=((h+.5)/r-.5)*I;for(let w=0;w<o;w++){const k=((w+.5)/o-.5)*E;let C=1e9,L=!1;for(let d=0;d<s;d++){let A=k-u[d],M=v-m[d];A-=E*Math.round(A/E),M-=I*Math.round(M/I);const T=A+u[d]-i[d],G=M+m[d]-l[d];let q=(T*n[d]+G*f[d])*g[d];q=q<0?0:q>1?1:q;const _=T-n[d]*q,W=G-f[d]*q,S=_*_+W*W;S<C&&(C=S);const p=l[d],z=l[d]+f[d];p>v!=z>v&&k<i[d]+n[d]*(v-p)/(z-p)&&(L=!L)}P[h*o+w]=e.DataUtils.toHalfFloat((L?1:-1)*Math.sqrt(C))}}const x=new e.DataTexture(P,o,r,e.RedFormat,e.HalfFloatType);return x.wrapS=x.wrapT=e.RepeatWrapping,x.minFilter=x.magFilter=e.LinearFilter,x.generateMipmaps=!1,x.needsUpdate=!0,x}const ne=`
vec2 swellAt(vec2 p) {
  float env = smoothstep(40., 150., length(p));
  return uSwell.z * env * vec2(-uSwell.y, uSwell.x) * sin(dot(p, uSwell.xy) * .0209 - uTime * .52);
}
`,pe=`
// THE LIFT: where the plane gives up its geese in ranks. A rule of the place, in metres of the plane, the same over the
// whole plane. The ring's avenue (the line through the ring along its facing, z = 0) is kept clear; on both sides of
// it lanes run along the birds' heading (+X), uLiftA.y apart, the first uLiftA.x from the avenue's line. On every lane
// one lift-off front in uLiftB.z carries a rank (which one: uLiftB.x on the -z side, uLiftB.y on the +z side, and it
// moves on by one from lane to lane, so the ranks along a front stand uLiftB.z lanes apart).
// Returns (lane index or -1, metres from the lane's centre line, metres the lane's last rank front is past this point).
uniform vec4 uLiftA;     // first lane's centre line from the avenue, lane pitch, seed, 1 when the world has the lift
uniform vec4 uLiftB;     // rank phase of the -z lanes, of the +z lanes, fronts from one rank of a lane to its next, front speed
uniform vec4 uLiftR;     // the ring's place (xyz) and the reach of its pull in metres
vec3 liftLane(vec2 c) {
  float az = abs(c.y);
  float i = floor((az - uLiftA.x) / uLiftA.y + .5);
  if (i < 0. || uLiftA.w < .5) return vec3(-1., 1e3, -1.);
  float s = uWave.z - dot(c, uWave.xy);
  float k = floor(s / uWave.w);                     // the front that passed here last
  float r = mod(i + (c.y > 0. ? uLiftB.y : uLiftB.x) + k, uLiftB.z);
  return vec3(i, az - (uLiftA.x + uLiftA.y * i), s - k * uWave.w + r * uWave.w);
}
// which cells of a lane give their geese to the rank: every fifth along the heading, the same in its three files, so
// the birds stand three abreast, wingtip to wingtip
float liftPick(float i, float side) { return mod(2. * i + (side > 0. ? 1. : 0.), 5.); }
// 1 on the cells that give their goose to the lane's rank (L from liftLane of the cell's centre c)
float liftPicked(vec3 L, vec2 c) {
  float f = floor(L.y / 10. + .5);
  return (L.x >= 0. && abs(L.y) < 12.6 && abs(L.y - 10. * f) < 1. && abs(mod((c.x - 4.) / 8. - liftPick(L.x, c.y) + .5, 5.) - .5) < .25) ? 1. : 0.;
}
// 1 where the cell at c gives its goose to a rank and the front that passed it last is that rank's: its goose IS the
// rank's bird (the hero's own goose of that cell is not drawn for that pass)
float liftGives(vec2 c) {
  vec3 L = liftLane(c);
  return liftPicked(L, c) * step(L.z, uWave.w - .001);
}
`,K=`
uniform sampler2D uSdf;
uniform vec3 uSwell;     // xy direction of travel, z amplitude in metres
uniform float uTime;
${ne}
uniform vec3 uInk, uPaper, uAccent;
uniform float uFront, uFog;
uniform vec4 uWave;      // xy front normal (XZ), z metres travelled, w spacing in metres
uniform vec2 uHole, uRed;
uniform float uRedOpen;   // 1: the accent fish cell is still empty (the world's mount has not locked into it yet)
uniform vec3 uCamL;   // camera in hero-local space

float sdfAt(vec2 p) { return texture2D(uSdf, p / vec2(8., 5.) + .5).r; }
// 1 on a line of width w repeated every per, antialiased by aa (all in the units of x)
float lineT(float x, float per, float w, float aa) {
  float d = abs(fract(x / per + .5) - .5) * per;
  return 1. - smoothstep(w * .5 - aa, w * .5 + aa, d);
}
// coverage of a line of width w repeated every per; stays right when the line or the gap between lines goes to nothing
float band(float x, float per, float w, float aa) {
  float d = abs(fract(x / per + .5) - .5) * per;
  float c = clamp((w * .5 - d) / (2. * aa) + .5, 0., 1.);
  c *= clamp(w / (2. * aa), 0., 1.);
  return 1. - (1. - c) * clamp((per - w) / (2. * aa), 0., 1.);
}
// straight cut lines across x whose width carries the tone (duty = share of ink). The period starts at P0 and doubles
// with every octave of the pixel footprint fx: every other line thins out and goes while its neighbours widen, so
// the far field is a few bold bars 12 to 24 pixels apart to the horizon. A bar is never thinner than 2.5 pixels,
// nor is the gap between two bars: below that the bar ends (or the gap closes), so nothing can shimmer.
float boldBand(float x, float per, float w, float f) {
  float d = abs(fract(x / per + .5) - .5) * per;
  float m = 2.5 * f;
  float ww = clamp(w, m, max(per - m, m));
  float c = clamp((ww * .5 - d) / (1.2 * f) + .5, 0., 1.);
  return max(c * step(.9 * f, w), step(per - .9 * f, w));
}
float octLines(float x, float fx, float P0, float duty) {
  float f = max(fx, 1e-5);
  float oc = max(0., log2(f * 24. / P0));
  float n = floor(oc), fo = fract(oc);
  float P = P0 * exp2(n);
  float a = boldBand(x - P0 * .5, 2. * P, P * duty * (1. + fo), f);
  float b = boldBand(x - P0 * .5 + P, 2. * P, P * duty * (1. - fo), f);
  return max(a, b);
}
float gooseAge(vec2 c) { return mod(uWave.z - dot(c, uWave.xy), uWave.w); }
float vacancy(float g) { return 1. - smoothstep(.42, .9, g / uWave.w); }

${pe}
// 1 where the goose of the cell at c has gone with its lane's rank: the gap is bare paper. The cells that give a
// bird empty 22 m behind the front, under the bird that lies thickened in its cell before it leaves, the rest of the
// lane's band cell by cell just behind them; each is inked again, cell by cell, before the lane's next rank comes.
float liftGone(vec2 c) {
  vec3 L = liftLane(c);
  if (L.x < 0. || abs(L.y) > 12.6) return 0.;
  float pick = liftPicked(L, c);
  float h = fract(sin(dot(c, vec2(12.9898, 78.233)) + uLiftA.z) * 43758.5453);
  return step(22. + 30. * h * (1. - pick), L.z) * step(L.z, uWave.w * (1.1 + .9 * h));
}
// the same wake where the tiling is too far to cut: a paler band along the lane behind its rank
float liftWake(vec2 p) {
  vec3 L = liftLane(p);
  if (L.x < 0.) return 0.;
  return (1. - smoothstep(11., 14., abs(L.y))) * smoothstep(22., 52., L.z) * (1. - smoothstep(uWave.w * 1.1, uWave.w * 2., L.z));
}

// ivory fish with black cut lines. q: metres from the cell centre, sd: distance inside the outline.
float fishTone(vec2 q, float sd, float aa, float det, float isRed, out float red) {
  float lw = max(.045, aa * 1.2);
  float key = smoothstep(lw - aa, lw + aa, sd);
  float inner = smoothstep(.10, .16, sd);
  float m = 0.;
  // scale rows over the back, cut heavier toward the dorsal edge, fading over the belly
  float back = smoothstep(-.9, 1.5, q.y);
  float bodyM = smoothstep(-2.5, -2.0, q.x) * (1. - smoothstep(1.0, 1.5, q.x));
  float duty = (.10 + .50 * back * back + .30 * (1. - smoothstep(.1, .7, sd))) * bodyM;
  m = max(m, lineT(q.x + .42 * (q.y - .2) * (q.y - .2), .40, .40 * duty, aa));
  // lateral line
  m = max(m, lineT(q.y - .08 - .04 * sin(q.x * 1.3), 40., .035 + aa * .5, aa) * bodyM * step(.5, fract(q.x * 1.6)));
  // tail fin rays
  float den = max(.25, -(q.x + 1.75));
  float tailM = 1. - smoothstep(-2.75, -2.45, q.x);
  m = max(m, lineT(q.y / den, .26, .085, aa / den) * tailM);
  // dorsal and belly fin rays
  float finM = smoothstep(1.25, 1.45, q.y) + (1. - smoothstep(-1.7, -1.45, q.y));
  m = max(m, lineT(q.x + .7 * q.y, .21, .07, aa) * finM);
  // gill arc
  float dg = length(q - vec2(3.05, .05));
  m = max(m, (1. - smoothstep(.03, .03 + aa, abs(dg - 1.5) - .01)) * step(q.x, 2.1) * (1. - smoothstep(1.0, 1.2, abs(q.y))));
  m *= inner * det;
  // eye: ring and pupil
  float de = length(q - vec2(2.62, .28));
  float ring = 1. - smoothstep(.035, .035 + aa, abs(de - .25));
  float pupil = 1. - smoothstep(.11 - aa, .11 + aa, de);
  float detE = 1. - smoothstep(.15, .5, aa);
  m = max(m, max(ring, pupil * (1. - isRed)) * detE);
  red = isRed * max(pupil * detE, smoothstep(1.32, 1.36, q.y) * smoothstep(.07, .09, sd) * (1. - lineT(q.x + .7 * q.y, .42, .05, aa) * det));
  return key * (1. - m);
}

// a fish at depth: cov 1 (near, solid) .. 0 (gone). Returns the paper mask to keep (under .5: leave to the black) and
// con, the paper contour. The body lines are never closer than four pixels nor thinner than a pixel and drop out one
// by one and leave the contour: lines and an outline, never a patch of static.
float farFish(vec2 q, float sd, float fw, float aa, float cov, float tone, out float con) {
  float thin = 1. - smoothstep(.55, .97, cov);
  float P = .5 * exp2(ceil(log2(max(fw * 4. / .5, 1.))));
  float u = q.y + .1 * sin(q.x * 1.4);
  float li = floor(u / P + .5);
  float lw = P * (.06 + .6 * cov) * (.6 + .8 * fract(sin(li * 12.9898) * 43758.5453));
  float ln = lineT(u, P, max(lw, 1.3 * fw), aa) * step(.7 * fw, lw);
  float cw = max(.10, 1.3 * fw);
  con = (1. - smoothstep(cw, cw + aa, sd)) * smoothstep(.3, .5, thin);
  return max(mix(1., ln, thin) * mix(1., tone, thin), con);
}

// black goose with ivory cut lines. sg: distance inside the goose outline. vac: 0 goose present .. 1 just left.
// hv: hatch coordinate for the vacated state (metres across the hatching).
float gooseTone(vec2 q, float sg, float aa, float det, float vac, float hv, float isRed, out float red) {
  float inner = smoothstep(.11, .17, sg);
  float az = abs(q.y);
  float wingM = smoothstep(.55, .85, az) * step(q.x, 1.9);
  // flight feathers: long cuts running back along the wing, coverts as short scallops
  float m = lineT(az + .42 * q.x, .44, .055 + aa * .4, aa) * wingM * step(q.x, .15 + .25 * az);
  m = max(m, lineT(q.x - .55 * az, .50, .05 + aa * .4, aa) * wingM * step(.15 + .25 * az, q.x) * step(.5, fract(az * 2.2 + .25)));
  // tail fan, neck ring, spine dashes, eye
  m = max(m, lineT(q.y, .24, .05 + aa * .4, aa) * (1. - smoothstep(-2.7, -2.5, q.x)));
  m = max(m, lineT(q.x - 1.95, 40., .07 + aa * .5, aa) * (1. - wingM));
  m = max(m, lineT(q.y, 40., .04 + aa * .5, aa) * step(.5, fract(q.x * 1.25)) * step(-2.2, q.x) * step(q.x, 1.2));
  float eye = 1. - smoothstep(.055 - aa, .055 + aa, length(vec2(q.x - 3.02, az - .11)));
  m = max(m, eye * (1. - smoothstep(.1, .3, aa)));
  float gone = smoothstep(0., .04, vac);
  m *= det * inner * (1. - gone);
  // vacated: parallel hatching whose line width carries the tone
  // (three bold cuts a cell; from further off the cell stays solid ink)
  float hatch = lineT(hv, 1.6, max(1.6 * (.10 + .25 * vac), 2.5 * aa), aa) * gone * smoothstep(.07, .12, sg) * (1. - smoothstep(.12, .2, aa));
  red = isRed * smoothstep(3.28, 3.32, q.x) * (1. - gone);
  return max(m, hatch);
}

// one point of the infinite tiling. p in lattice metres. lockAll > .5 ignores the locking front.
// returns tone; red = accent mask; hole = 1 inside the open cell.
float tilingTone(vec2 p, float aa, float det, float lockAll, vec2 vacCell, out float red, out float hole) {
  float sd = sdfAt(p);
  float s = (p.x * .25 + p.y * .4) * .5, t = (p.x * .25 - p.y * .4) * .5;
  float i = floor(s + .5), j = floor(t + .5);
  vec2 c = vec2(4. * (i + j), 2.5 * (i - j));
  vec2 q = p - c;
  bool rhFish = mod(i + j, 2.) < .5;
  bool fish = sd > 0.;
  if (fish != rhFish) { c += vec2(q.x > 0. ? 4. : -4., q.y > 0. ? 2.5 : -2.5); q = p - c; }
  red = 0.; hole = 0.;
  float tone;
  if (fish) {
    float isRed = (abs(c.x - uRed.x) < .5 && abs(c.y - uRed.y) < .5) ? 1. : 0.;
    float lk = max(lockAll, step(c.x, uFront) * (1. - isRed * uRedOpen));
    tone = fishTone(q, sd, aa, det, isRed * (1. - lockAll), red) * lk;
    red *= lk;
    // the lift: beside a gap that is bare paper the fish has no key line to print (paper against paper; a line left
    // there would be a net of outlines a pixel thin from the middle distance on): its hatching alone cuts it
    if (lockAll < .5) {
      float kb = max(.045, aa * 1.2) + aa;
      tone = max(tone, liftGone(c + vec2(q.x > 0. ? 4. : -4., q.y > 0. ? 2.5 : -2.5)) * lk * step(0., uCamL.y) * (1. - smoothstep(kb, kb + aa, sd)));
    }
  } else {
    if (lockAll < .5 && abs(c.x - uHole.x) < .5 && abs(c.y - uHole.y) < .5) hole = 1.;
    float lk = max(lockAll, step(c.x + 4., uFront));
    float vac = vacancy(gooseAge(c)) * step(0., uCamL.y);   // from below the gaps stay solid ink
    if (lockAll > .5) {   // ring: vacCell = (progress, count); innermost geese leave one by one
      float w = clamp((vacCell.x * (vacCell.y + 5.) - mod(floor(c.x / 8.) * 7., vacCell.y)) / 5., 0., 1.);
      vac = abs(c.y - 2.5) < .5 ? step(.001, w) * .75 : 0.;
    }
    float hv = lockAll > .5 ? (p.x + p.y) * .7071 : dot(p, vec2(-uWave.y, uWave.x));
    float r2;
    tone = gooseTone(q, -sd, aa, det, vac, hv, 0., r2) * lk;
    // the lift: a gap whose goose has gone with a rank is bare paper (from below the gaps stay solid ink)
    if (lockAll < .5) tone = max(tone, liftGone(c) * lk * step(0., uCamL.y));
  }
  return tone;
}
`,O="#include <fog_pars_vertex>",Z="#include <fog_pars_fragment>",H=`vec3 preFog = gl_FragColor.rgb;
#include <fog_fragment>
gl_FragColor.rgb = mix(preFog, gl_FragColor.rgb, uFog);`;function Ae(a){return new e.ShaderMaterial({uniforms:Object.assign(e.UniformsUtils.merge([e.UniformsLib.fog]),a),fog:!0,side:e.DoubleSide,vertexShader:`varying vec3 vP;
${O}
      void main() { vP = position; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`varying vec3 vP;
${Z}
${K}
      void main() {
        vec2 p = vP.xz - swellAt(vP.xz);
        float fx = fwidth(p.x), fz = fwidth(p.y);
        float fw = max(fx, fz);
        float aa = clamp(fw * .75, .002, .6);
        float det = 1. - smoothstep(.07, .3, fw);
        float red, hole;
        float tone = tilingTone(p, aa, det, 0., vec2(0.), red, hole);
        if (hole > .5) discard;
        // unlaid sea: ink with a few level cuts
        float lockP = step(p.x, uFront);
        float row = floor(p.y / 1.9 + .5);
        float sea = lineT(p.y + .12 * sin(p.x * .5 + row), 1.9, .05 + aa * .5, aa) * step(.72, sin(p.x * .35 + row * 2.4)) * det * (1. - lockP);
        tone = max(tone, sea);
        // at a grazing angle the footprint is long one way and the isotropic edge width blurs the other: cut it back to a pixel
        float e = clamp(.5 * min(fx, fz) / max(fw, 1e-5) * (fw * .75 / aa), .09, .5);
        float T = smoothstep(.5 - e, .5 + e, tone);
        // far field: the ranks of the tiling become level cut lines of the same average tone. The hand-over is cut, not
        // blended: lines open across the fish and close across the geese until both carry the same hatching.
        float w = max(smoothstep(1.0, 2.1, fx), smoothstep(.8, 1.6, fz)) * lockP;
        float age = mod(uWave.z - dot(p, uWave.xy), uWave.w);
        float vacP = vacancy(age) * step(0., uCamL.y);
        // every lift-off front is a line of tone to the horizon: a dark edge where the geese stand up, a pale wake behind it
        float duty = .5 - .24 * vacP + .42 * (1. - smoothstep(6., 70., age)) * step(0., uCamL.y);
        duty -= .30 * liftWake(p) * step(0., uCamL.y);      // the lane a rank has left: paler
        float inkF = octLines(p.x, fx, 8., duty * w);
        float inkG = octLines(p.x, fx, 8., 1. - (1. - duty) * w);
        float ink = mix(1. - inkG, 1. - inkF, T);
        ink = mix(T, ink, step(.001, w));
        vec3 col = mix(uInk, uPaper, ink);
        col = mix(col, uAccent, red * (1. - w));
        gl_FragColor = vec4(col, 1.);
        ${H}
      }`})}function Me(a,t){return new e.ShaderMaterial({uniforms:Object.assign(e.UniformsUtils.merge([e.UniformsLib.fog]),a,t),fog:!0,side:e.DoubleSide,vertexShader:`attribute vec4 aCell;
      uniform vec2 uFocus; uniform vec2 uFishP; uniform float uTime, uFront; uniform vec2 uRed; uniform vec3 uSwell;
      varying vec2 vQ; varying float vCov, vRed, vUp;
${O}
${ne}
      void main() {
        float P = uFishP.x, PZ = uFishP.y;
        float cz = aCell.y + PZ * floor((uFocus.y - aCell.y) / PZ + .5);
        float cx = aCell.x + P * ceil((uFront - aCell.x) / P);
        float r1 = aCell.z, r2 = aCell.w;
        float e = clamp((cx - uFront) / P, 0., 1.);            // 1 deep in the shoal .. 0 locked
        float run = 64. + 30. * r1, depth = 44. + 30. * r2;
        vec3 off = vec3(-run * e, -depth * pow(e, 1.7), 0.);
        float loose = smoothstep(.22, .75, e);
        float ph = uTime * .33 + cx * .045 + cz * .02;
        off.z += loose * (16. * (r2 - .5) + 7. * sin(ph + r1 * 6.));
        off.y += loose * 4. * sin(uTime * .29 + r2 * 31.);
        off.x += loose * 6. * cos(ph * .8 + r1 * 17.);
        off.y = min(off.y, -.04);
        float dpt = -off.y;
        float pitch = atan(depth * 1.7 * pow(e, .7) / run) * smoothstep(.3, 4., dpt);
        float yaw = loose * .45 * cos(ph + r1 * 6.);
        // roll: upright while swimming, a quarter turn flat in the last 6 m, never poking through the plane
        float flat_ = smoothstep(-6., -.25, off.y);
        float rho = min((1. - flat_) * 1.5708, asin(clamp((dpt - .04) / 2.8, 0., 1.)));
        vec3 lp = position;
        float swim = 1. - flat_;
        float w = swim * (.10 + .34 * (1. - smoothstep(-4., 1.5, lp.x))) * sin(lp.x * 1.1 + uTime * (5. + 2. * r1) + r2 * 20.);
        float pec = swim * .25 * sin(uTime * 7. + r1 * 9.) * (1. - smoothstep(-2.2, -1.2, lp.z)) * step(-1., lp.x);
        w += pec;
        vec3 b = vec3(lp.x, lp.z * sin(rho) + w * cos(rho), lp.z * cos(rho) - w * sin(rho));
        float cp = cos(pitch), sp = sin(pitch);
        b = vec3(b.x * cp - b.y * sp, b.x * sp + b.y * cp, b.z);
        float cy = cos(yaw), sy = sin(yaw);
        b = vec3(b.x * cy + b.z * sy, b.y, -b.x * sy + b.z * cy);
        vec2 sw = swellAt(vec2(cx, cz));
        vec3 lctr = vec3(cx + sw.x, 0., cz + sw.y) + off;
        float dist = distance((modelMatrix * vec4(lctr, 1.)).xyz, cameraPosition);
        vCov = (1. - smoothstep(34., 175., dist)) * (1. - smoothstep(.9, 1., e)) * (1. - smoothstep(.40, .5, abs(cz - uFocus.y) / PZ));
        // at the end of its range a fish dwindles away whole (a locked fish is always full size)
        vec3 lpos = lctr + b * mix(1., smoothstep(0., .2, vCov), step(.001, e));
        vec4 wp = modelMatrix * vec4(lpos, 1.);
        vQ = position.xz;
        vUp = wp.y - cameraPosition.y + 1.5;
        vRed = (abs(cx - uRed.x) < .5 && abs(cz - uRed.y) < .5) ? 1. : 0.;
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        if (uFront > 1e5 || vCov <= .001 || vRed > .5) gl_Position = vec4(2., 2., 2., 1.);
        #include <fog_vertex>
      }`,fragmentShader:`varying vec2 vQ; varying float vCov, vRed, vUp;
${Z}
${K}
      void main() {
        float fw = max(fwidth(vQ.x), fwidth(vQ.y));
        float aa = clamp(fw * .75, .002, .6);
        // a body seen edge-on carries no cuts (they would beat against the pixels): plain ivory and its key line
        float det = (1. - smoothstep(.07, .3, fw)) * smoothstep(.12, .3, min(fwidth(vQ.x), fwidth(vQ.y)) / max(fw, 1e-5));
        float red;
        float sd = sdfAt(vQ);
        float tone = fishTone(vQ, sd, aa, det, vRed, red);
        // depth is size and overlap: a far fish is a solid paper silhouette inside an ink key line, which parts it from
        // the fish behind it and from the ceiling. Never an outline: hundreds of those tangle into a net.
        float thin = 1. - smoothstep(.55, .97, vCov);
        float cw = max(.12, 1.6 * fw);
        tone = mix(tone, smoothstep(cw, cw + aa, sd), smoothstep(0., .45, thin));
        red *= 1. - thin;
        // the one cut the plane makes, made here too. aa is sized for the longer axis of the footprint, so on a sheet seen
        // at a grazing angle every edge was spread over several pixels along the axis that is well resolved, and the key
        // line and the silhouette ran into each other: a soft grey smear instead of ink and paper. Cut back to a pixel.
        float eg = clamp(.5 * min(fwidth(vQ.x), fwidth(vQ.y)) / max(fw, 1e-5) * (fw * .75 / aa), .09, .5);
        tone = smoothstep(.5 - eg, .5 + eg, tone);
        vec3 col = mix(uInk, uPaper, tone);
        col = mix(col, uAccent, red);
        gl_FragColor = vec4(col, 1.);
        ${H}
      }`})}function me(a,t,o){return new e.ShaderMaterial({uniforms:Object.assign(e.UniformsUtils.merge([e.UniformsLib.fog]),a,t),fog:!0,side:e.DoubleSide,vertexShader:o||`attribute vec4 aCell;
      uniform vec2 uFocus; uniform vec4 uGooseP;   // period X, period Z, front speed, skein spacing
      uniform float uTime, uFront, uRiseX; uniform vec4 uWave; uniform vec3 uCamL, uCamD; uniform vec3 uSwell; uniform vec2 uFocusG;
      varying vec2 vQ; varying float vCov, vKeel, vNear;
${O}
${ne}
      ${pe}
      void main() {
        float PX = uGooseP.x, PZ = uGooseP.y;
        float cx = aCell.x + PX * floor((uFocusG.x - aCell.x) / PX + .5);
        float cz = aCell.y + PZ * floor((uFocusG.y - aCell.y) / PZ + .5);
        float r1 = aCell.z, r2 = aCell.w;
        float g = mod(uWave.z - dot(vec2(cx, cz), uWave.xy), uWave.w);
        float tt = g / uGooseP.z;                 // seconds since the front passed this cell
        // every goose swells and beats on the plane; most then thin into strokes where they stand and two in five
        // go on up, so the lifted flock has air between its birds and reads bird by bird
        float del = .9 * fract(r1 * 7.31);         // they do not all leave on the same beat
        float riser = (r1 <= .42 && cx < uRiseX) ? 1. : 0.;
        float life = mix(.85 + del, 4.5 + 1.5 * r2 + del, riser);
        // peel away: climb, run ahead, close toward the skein line, far birds fall back into a chevron
        float tf = max(tt - 1.05 - del, 0.);
        float SK = uGooseP.w;
        float dzs = cz - SK * floor(cz / SK + .5);
        float conv = smoothstep(0., 1.7, tf);
        // they gather speed to a little more than ours and hold it, so a risen flock stays about us for seconds
        float run = mix(11. * tf * tf, 28.6 * tf - 18.59, step(1.3, tf));
        vec3 off = vec3(run - abs(dzs) * .85 * conv, 8. * pow(tf, 1.55) + r2 * 1.5 * conv, -dzs * .42 * conv);
        vec2 sw = swellAt(vec2(cx, cz));
        vec3 ctr = vec3(cx + sw.x, 0., cz + sw.y) + off;
        // airborne birds keep about 11 m from the line of travel (uCamD, the way the camera is heading): they part
        // round it as round a tube
        vec3 dv = ctr - uCamL;
        float al = dot(dv, uCamD);
        vec3 perp = dv - uCamD * al + vec3(0., r2 - .3, r1 - .21) * .05;
        float pl = max(length(perp), 1e-3);
        ctr += perp / pl * (sqrt(pl * pl + 120.) - pl) * (1. - smoothstep(10., 42., abs(al))) * smoothstep(0., .35, tf);
        ctr.y = max(ctr.y, off.y * .35);
        float dc = distance(ctr, uCamL);
        vec3 lp = position;
        float sgn = lp.z < 0. ? -1. : 1.;
        float az = abs(lp.z);
        float swell = smoothstep(0., .3, tt), unfold = smoothstep(.5 + del, 1.4 + del, tt);   // wings open as it leaves the plane
        float beatP = 6.2832 * 1.9 * (tt - .28) + r1 * .6;
        float beat = sin(beatP) * smoothstep(.25, .5, tt);
        float ang = (beat * mix(.58, .4, smoothstep(55., 95., dc)) + .14) * unfold;   // beats about a raised V, never a tent
        float arm = max(az - .9, 0.) * (1. + 1.25 * unfold);        // 5 m folded -> 9 m span, rigid about the hinge
        float y = max(arm * sin(ang), -.9 * (.5 * swell + off.y));   // on the plane the wings beat upward only: nothing dips through it
        float span = min(az, .9) + arm * cos(ang);
        float x = lp.x - unfold * arm * .22;                        // tips sweep back
        y += .05 + .5 * swell - .22 * beat + lp.y * swell * (.55 + .45 * unfold) * 1.5;
        vKeel = abs(lp.y) > 1e-4 ? 1. : 0.;
        float pitch = .12 * swell + .38 * smoothstep(0., .5, tf) * (1. - .6 * smoothstep(1., 1.8, tf));
        vec3 b = vec3(x * cos(pitch) - y * sin(pitch), x * sin(pitch) + y * cos(pitch), sgn * span);
        // the lens stays clear: nothing passes within 6 m of it, and only a few birds within 16 m; far off the
        // flock is thinned so the birds read one by one
        float nearK = smoothstep(3.2, 5.8, dc);
        float sc = mix(1., nearK, smoothstep(.1, .5, tt)) * (r1 > .5 ? 1. - smoothstep(95., 130., dc) : 1.);
        vNear = 1. - smoothstep(10., 40., dc);
        vec3 lpos = ctr + b * sc;
        vec4 wp = modelMatrix * vec4(lpos, 1.);
        float dist = distance(wp.xyz, cameraPosition);
        float edge = max(abs(cx - uFocusG.x) / PX, abs(cz - uFocusG.y) / PZ);
        vCov = (1. - smoothstep(mix(.60, .84, riser), 1., tt / life)) * (1. - smoothstep(140., 420., dist) * .7) * (1. - smoothstep(.40, .5, edge));
        vQ = position.xz;
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        // from below the plane no goose is drawn: wings and keels would poke through the ceiling
        if (cx + 4. >= uFront || tt >= life || vCov <= .001 || uCamL.y < 0. || sc < .02) gl_Position = vec4(2., 2., 2., 1.);
        if (liftGives(vec2(cx, cz)) > .5) gl_Position = vec4(2., 2., 2., 1.);   // the lift: this cell's goose is the rank's bird
        #include <fog_vertex>
      }`,fragmentShader:`varying vec2 vQ; varying float vCov, vKeel, vNear;
${Z}
${K}
      void main() {
        float fx = fwidth(vQ.x), fz = fwidth(vQ.y);
        float fw = max(fx, fz);
        float aa = clamp(fw * .75, .002, .6);
        // feather cuts only where the wing is seen broadly enough to carry them: a wing seen steeply stays plain ink
        float det = (1. - smoothstep(.03, .10, fw)) * smoothstep(.12, .3, min(fx, fz) / max(fw, 1e-5));
        float red;
        float sg = -sdfAt(vQ + vec2(4., 2.5));
        // the birds that pass close keep their feather cuts whatever the angle of the wing
        det = max(det, vNear * (1. - smoothstep(.10, .22, fw)));
        float tone = vKeel > .01 ? 0. : gooseTone(vQ, sg, aa, det, 0., 0., 0., red);
        // a paper key line round every lifted bird, so black wings over black wings still read as birds
        float kw = max(.12, min(aa * 1.5, .32)) + .28 * vNear;
        tone = max(tone, vKeel > .01 ? 0. : 1. - smoothstep(kw - aa, kw + aa, sg));
        // far geese thin into a few black strokes, like the horizon band they fly into
        float thin = 1. - smoothstep(.45, .8, vCov);
        float keep = mix(1., lineT(abs(vQ.y) + .42 * vQ.x, .44, .44 * (.10 + .90 * vCov / .8), aa), thin);
        if (thin > .02 && keep < .5) discard;
        tone = smoothstep(.3, .7, tone);
        gl_FragColor = vec4(mix(uInk, uPaper, tone), 1.);
        ${H}
      }`})}function ve(a,t,o,r,s,i){const l=new e.InstancedBufferGeometry;l.index=a.index,l.setAttribute("position",a.getAttribute("position"));const n=t*o,f=new Float32Array(n*4);let u=0;for(let m=0;m<o;m++)for(let g=0;g<t;g++)f[u++]=r+g*E,f[u++]=s+(m-Math.floor(o/2))*I,f[u++]=i(),f[u++]=i();return l.setAttribute("aCell",new e.InstancedBufferAttribute(f,4)),l.instanceCount=n,l}function Te(a,t){return new e.ShaderMaterial({uniforms:Object.assign(e.UniformsUtils.merge([e.UniformsLib.fog]),a,t),fog:!0,side:e.DoubleSide,vertexShader:`varying vec2 vR;
${O}
      void main() { vR = position.xy; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`varying vec2 vR; uniform vec4 uRing; uniform float uRout;
${Z}
${K}
      void main() {
        float r = max(length(vR), .01);
        float kap = uRing.y * 8. / 6.2831853;
        float th = atan(vR.y, vR.x) + uRing.z;
        vec2 p = vec2(th * kap, log(r / uRing.x) * kap);
        float sc = kap / r;
        float fl = max(fwidth(vR.x), fwidth(vR.y));
        float fw = fl * sc;
        float aa = clamp(fw * .75, .002, .6);
        float det = 1. - smoothstep(.07, .3, fw);
        float red, hole;
        float tone = tilingTone(p, aa, det, 1., vec2(uRing.w, uRing.y), red, hole);
        float din = r - uRing.x, dout = uRout - r, al = fl * .75 + 1e-4;
        tone *= smoothstep(.20, .20 + al * 2., min(din, dout));
        // the accent hairline is never under 2.5 pixels wide
        float hw = max(.08, 2.5 * fl);
        float hair = smoothstep(.03, .03 + al, din) * (1. - smoothstep(.03 + hw, .03 + hw + al, din));
        // far away the tiling is too fine to cut: there the ring is a solid ink annulus with one inner band of bold
        // paper teeth, one to a tile. The hand-over is a cut: it goes tooth by tooth, never through a blend.
        float wf = smoothstep(.5, 1.2, fw);
        float ts = th * uRing.y / 6.2831853;
        float tid = floor(ts);
        float tf = abs(fract(ts) - .5);
        float ta = max(fwidth(ts), 1e-4);
        ta = ta > .5 ? 1e-4 : ta;                         // the seam of atan
        float bandW = .40 * (uRout - uRing.x);
        float teeth = (1. - smoothstep(.27 - ta, .27 + ta, tf)) * smoothstep(.55 + hw, .55 + hw + 2. * al, din) * (1. - smoothstep(bandW, bandW + 2. * al, din));
        float pickT = step(fract(sin(mod(tid, uRing.y) * 12.9898 + 4.1) * 43758.5453), wf * 1.02 - .01);
        tone = mix(tone, teeth, pickT);
        vec3 col = mix(uInk, uPaper, tone);
        col = mix(col, uAccent, hair);
        gl_FragColor = vec4(col, 1.);
        ${H}
      }`})}const qe=`attribute vec2 aK;
  uniform vec4 uRing; uniform float uTime;
  varying vec2 vQ; varying float vCov, vKeel, vNear;
${O}
  void main() {
    float n = uRing.y, kap = n * 8. / 6.2831853;
    float w = clamp((uRing.w * (n + 5.) - mod(aK.x * 7., n)) / 5., 0., 1.);
    vec2 L = vec2(8. * aK.x + 4., 2.5);
    // locked: the exact log-polar image of the table position
    float th = (L.x + position.x) / kap - uRing.z, r = uRing.x * exp((L.y + position.z) / kap);
    vec3 R0 = vec3(r * cos(th), r * sin(th), .02);
    // leaving: unfold, beat, turn the bill through the opening and go
    float thc = L.x / kap - uRing.z, rc = uRing.x * exp(L.y / kap), sc = rc / kap;
    vec3 rad = vec3(cos(thc), sin(thc), 0.), tang = vec3(-rad.y, rad.x, 0.);
    float u = smoothstep(0., .35, w), turn = smoothstep(.05, .55, w);
    vec3 d = normalize(mix(tang, vec3(-rad.xy, -.3), turn));
    vec3 wa = normalize(rad - d * dot(rad, d) + tang * turn * .6);
    vec3 nrm = cross(wa, d);
    float az = abs(position.z), sgn = position.z < 0. ? -1. : 1.;
    float beatP = w * 34. + aK.y * 6.;
    float ang = (sin(beatP) * .5 + .45) * u;     // wings stay raised: never a flat sheet seen edge-on
    float arm = max(az - .9, 0.) * (1. + 1.5 * u);
    float span = min(az, .9) + arm * cos(ang);
    float y = arm * sin(ang) + position.y * u * 1.5;
    vKeel = abs(position.y) > 1e-4 ? 1. : 0.;
    // they stay on the camera's side of the portal surface and shrink into its centre
    vec3 C = rad * rc * (1. - smoothstep(.08, 1., w)) * (1. + .12 * sin(6.2832 * w)) + vec3(0., 0., .15 + 3. * sin(3.1416 * w));
    vec3 F = C + sc * (1. + 1.1 * u) * (1. - smoothstep(.6, .9, w)) * (position.x * d + sgn * span * wa + y * nrm);
    vec3 lpos = mix(R0, F, smoothstep(0., .12, w));
    vCov = 1.; vNear = 0.;
    vQ = position.xz;
    vec4 mvPosition = modelViewMatrix * vec4(lpos, 1.);
    gl_Position = projectionMatrix * mvPosition;
    if (w <= 0. || w >= .9) gl_Position = vec4(2., 2., 2., 1.);
    #include <fog_vertex>
  }`;async function Se(a,t={}){const o=a.rng,r=t.palette&&t.palette.length>=3?t.palette:be,s=t.edition||"day";let i=new e.Color(r[0]),l=new e.Color(s==="golden"?"#C9B48A":r[1]);s==="night"&&([i,l]=[l,i]);const n=t.accent||o.pick([r[2],r[2],r[2],"#1F4E8C","#D9A21E"]),f=new e.Color(n),u=ke(o),m=ze(u);await a.yield?.();const g=await Re(m.fish,a);await a.yield?.();const P=Ce(m.fish);await a.yield?.();const x=Fe(Le(m.goose));await a.yield?.();const h=o.sign()*e.MathUtils.degToRad(o.range(27,33)),v=new e.Vector2(Math.cos(h),Math.sin(h)),w=40,k=Math.round(o.range(150,172)),C=o.pick([30,35,40]),L=t.fishCols||16,d=t.fishRows||44,A=t.gooseCols||20,M=t.gooseRows||36,T=o.pick([20,24]),G=7,q=T*8/(Math.PI*2),_=G*Math.exp(15/q),W=new e.Vector3(0,0,0),S=new e.Vector3(4,0,2.5),p={uSdf:{value:g},uInk:{value:i},uPaper:{value:l},uAccent:{value:f},uTime:{value:0},uFront:{value:0},uFog:{value:t.fog??1},uWave:{value:new e.Vector4(v.x,v.y,0,k)},uHole:{value:new e.Vector2(S.x,S.z)},uRed:{value:new e.Vector2(W.x,W.z)},uRedOpen:{value:0},uCamL:{value:new e.Vector3(0,20,0)},uFocus:{value:new e.Vector2},uCamD:{value:new e.Vector3(1,0,0)},uFocusG:{value:new e.Vector2},uRiseX:{value:1e9},uSwell:{value:new e.Vector3(Math.cos(h*-1.7+.5),Math.sin(h*-1.7+.5),t.swell??.5)},uLiftA:{value:new e.Vector4(67.5,150,0,0)},uLiftB:{value:new e.Vector4(0,1,2,w)},uLiftR:{value:new e.Vector4(1e6,0,0,1)}},z=new e.Group;z.name="figure-and-ground-hero";const se=new e.CircleGeometry(t.planeRadius||2600,64);se.rotateX(-Math.PI/2);const j=new e.Mesh(se,Ae(p));j.frustumCulled=!1,j.renderOrder=0,z.add(j),await a.yield?.();const Y=new e.Mesh(ve(P,L,d,0,0,o),Me(p,{uFishP:{value:new e.Vector2(L*E,d*I)}}));Y.frustumCulled=!1,z.add(Y),await a.yield?.();const J=new e.Mesh(ve(x,A,M,4,2.5,o),me(p,{uGooseP:{value:new e.Vector4(A*E,M*I,w,C)}}));J.frustumCulled=!1,z.add(J),await a.yield?.();const B={value:new e.Vector4(G,T,0,0)},D=new e.Group;D.rotation.y=-Math.PI/2;const ge=new e.Mesh(new e.RingGeometry(G,_,96,1),Te(p,{uRing:B,uRout:{value:_}}));D.add(ge);const Q=new e.InstancedBufferGeometry;Q.index=x.index,Q.setAttribute("position",x.getAttribute("position"));const ee=new Float32Array(T*2);for(let c=0;c<T;c++)ee[c*2]=c,ee[c*2+1]=o();Q.setAttribute("aK",new e.InstancedBufferAttribute(ee,2)),Q.instanceCount=T;const ie=new e.Mesh(Q,me(p,{uRing:B},qe));ie.frustumCulled=!1,D.add(ie),z.add(D),await a.yield?.();const le=2+_,N={position:new e.Vector3,facing:new e.Vector3(-1,0,0)},te=[];function re(c,y,R){D.position.set(c,y,R),N.position.set(c,y,R);const b=S.z;te.length=0,te.push(new e.Vector3(-230,-60,b),new e.Vector3(-170,-60,b),new e.Vector3(-100,-42,b),new e.Vector3(-34,-13.8,b),new e.Vector3(S.x,0,b),new e.Vector3(26,7,b),new e.Vector3(Math.min(70,c*.4),8,b-8),new e.Vector3(c*.7,10,R+6),new e.Vector3(c-60,y,R),new e.Vector3(c,y,R))}re(t.portalDistance??150,le,0);let X=!1,fe=0,oe=t.demo??!0;const V=new e.Vector3,F=new e.Vector3,ae=new e.Matrix4,we=60,xe=40,ye=new e.Vector3(0,2,0);return{object:z,radius:we,height:xe,center:ye,ground:!1,groundY:0,edition:s,accent:n,outline:m,sdfTexture:g,glsl:K,uniforms:p,portalRing:D,geo:{fish:P,goose:x},plane:j,fish:Y,geese:J,anchors:{crossingFish:W,crossingGoose:S,crossingDir:new e.Vector3(Math.cos(.349),Math.sin(.349),0),flyThrough:te,portalSeat:N,viewBelow:{position:new e.Vector3(-70,-30,2.5),target:new e.Vector3(0,0,2.5)},viewAbove:{position:new e.Vector3(40,8,-4),target:new e.Vector3(160,2,0)},viewPortal:{position:new e.Vector3(N.position.x-45,le,0),target:N.position},frontDir:new e.Vector3(v.x,0,v.y),frontSpeed:w,frontSpacing:k,ringInner:G,ringOuter:_},setLockFront(c){!X&&oe&&(B.value.w=0),X=!0,p.uFront.value=c},setFrontPhase(c){fe=c},setHole(c,y){p.uHole.value.set(c,y)},setRedFish(c,y){p.uRed.value.set(c,y)},setRedOpen(c){p.uRedOpen.value=c?1:0},setFrontSpacing(c){p.uWave.value.w=c},setRiseLimit(c){p.uRiseX.value=c},setPortalProgress(c){B.value.w=Math.min(1,Math.max(0,c)),oe=!1},placePortal:re,update(c,y,R){if(p.uTime.value=y,p.uWave.value.z=y*w+fe,B.value.z=y*e.MathUtils.degToRad(3),X||(p.uFront.value=-60+y*6%130),oe&&!X&&(B.value.w=y*.05%1),R){z.updateWorldMatrix(!0,!1),ae.copy(z.matrixWorld).invert(),V.setFromMatrixPosition(R.matrixWorld).applyMatrix4(ae),R.getWorldDirection(F).transformDirection(ae),p.uCamL.value.copy(V);const b=Math.hypot(F.x,F.z);let $=45;Math.abs(F.y)>.001&&-V.y/F.y>0&&($=Math.min(60,-V.y/F.y*b));const ce=b>.001?F.x/b:1,he=b>.001?F.z/b:0;p.uFocus.value.set(V.x+ce*$,V.z+he*$);const ue=t.gooseBack??0;p.uFocusG.value.set(V.x+ce*($-ue),V.z+he*($-ue)),p.uCamD.value.copy(F)}},dispose(){}}}export{Se as buildHero};
