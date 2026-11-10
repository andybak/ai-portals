import*as e from"three";import{mergeGeometries as j}from"three/addons/utils/BufferGeometryUtils.js";const Le=["#F1E7CC","#E3CC96","#A9CDB0","#5B2A8C","#7A5230","#1F2C44","#C8281E"],h={rows:140,pitch:14,x0:-973,speed:20,recLen:4096,margin:2.6,shortArm:{py:34,pz:-84},longArm:{py:150,pz:-158},bulbLift:1.6,bridge:36,sheetHalf:2700},J=h.sheetHalf+6,_=(()=>{const o=h.longArm.py+h.bulbLift+1.2+4.5+5.22+.72;return{web:9,wid:4.6,flange:1.44,foot:o,top:o+h.bridge}})(),Y=(()=>{const t=_,a=J,r=t.foot-t.flange-2*t.web*.58,o=t.wid*1.5*.5;return{lo:[-a,r,h.longArm.pz-o],hi:[a,t.top+t.flange,h.longArm.pz+o]}})(),ut=(t,a,r)=>Math.hypot(Math.max(Y.lo[0]-t,t-Y.hi[0],0),Math.max(Y.lo[1]-a,a-Y.hi[1],0),Math.max(Y.lo[2]-r,r-Y.hi[2],0)),ee=t=>new e.Color(t),Z=`
uniform sampler2D uRec;      // 4096 x 140 half float: R quiet trace (m), G spare, B blot radius (m)
uniform float uScroll;       // metres of paper gone by, wrapped to 4096
uniform float uS;            // flight seconds (the quake's clock)
uniform vec4 uQuake;         // t0 (s), height (m), sustain (s), decay rate
uniform vec4 uQuakeF;        // three swing rates (Hz) and the sharpness mix
uniform vec4 uQuake2;        // the last shock: t0, height, sustain, decay
uniform vec4 uQuake3;        // the aftershock: t0, height, sustain, decay (height 0 = none)
uniform vec3 uQuake2F;       // the last shock: swing rate scale, body 0..1, how much of the fast swings
uniform vec4 uFoot;          // paper tones this far toward the shade (x) over this many metres below its line (y), and z more over w metres
uniform vec4 uCap;           // rows at x = uCap.x and uCap.y are held under uCap.z (uCap.w: 0 off, 1 on, up to 2 = pressed against the cap)
uniform vec4 uRank;          // the ranks beside the gap: row n (1, 2, 3 ...) from the gap crests at uCap.z + x n + y n^2 + z n^3; w = fullness of the crest
uniform vec4 uFin;           // the east flank's fins over its pressed line: height (m), they stand from z = y to z = z; w = the west flank's cap, metres from uCap.z
uniform vec4 uCapBox;        // x0, x1, z0, z1: every row inside is held under uCapBoxH
uniform float uCapBoxH;
uniform float uEyeCap;       // the height the ranks are counted from (the eye); the flank cap uCap.z comes down to it
uniform float uRankBase;     // metres over the cap at which the ranks begin (negative once the eye is up among them: the near ranks crest under it)
uniform float uRankFloor;    // how far the ranks' saddles are filled (0 = they dip to the sheet, 1 = level crests)
uniform float uDrop;         // the two flanking pens' cap sinks by this much (m) once the eye has passed their nibs
uniform vec2 uOldRamp;       // the old ranges stand up between these two z
uniform vec4 uStarveA;       // row v, z where starving began, z of the refill, strength
uniform vec4 uStarveB;
uniform vec4 uDry;           // the dry pen: row v, z where the ink ran out, z of the refill, strength
uniform vec4 uHole;          // the punched hole in the sheet: centre, radius (0 = none)
uniform vec3 uShade;         // what paper tones toward down a sheet: straw, a little browned
uniform vec3 uPaper, uStraw, uPrint, uInkV, uInkT, uInkR, uSepia, uPlum, uThread, uSteel, uBrass;
uniform float uFox, uTime;
uniform vec4 uTone;          // row behind row: a sheet n rows from the eye is aged x * ((1 - exp(-y n)) + (1 - exp(-n / 10))) toward uDeep; z = the same for the floor's lanes; w = least half width of an ink line in pixels, near
uniform vec3 uDeep;          // the oldest paper: straw well browned
uniform vec2 uAge;           // sheets age this far toward uDeep by 520 m downstream (x); the old ranges this much more (y)
uniform vec4 uRankB;         // the ranks' steps up among them (as uRank), where z is below uRankZ.y
uniform vec4 uRankZ;         // the ranks stand as at the gap's mouth above z = x and as up among them below z = y; z = their base there (m over the eye's line), w = saddle fill there
uniform vec4 uRankE;         // the height the ranks are counted from, a fixed line up the gap: x at z >= y, rising w per metre upstream of y, never over z
uniform vec4 uFinT;          // the red row's first peaks: height (m), and the quake seconds y..z over which they end

float wrHash(float n) { return fract(sin(n * 12.9898) * 43758.5453); }
float wrHash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float wrVNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(wrHash2(i), wrHash2(i + vec2(1., 0.)), f.x), mix(wrHash2(i + vec2(0., 1.)), wrHash2(i + vec2(1., 1.)), f.x), f.y);
}
// a pen on an arm of length L pivoted at height py: how far downstream the nib stands when it is at height y
float wrArc(float y, float L, float py) {
  float a = clamp(y - py, -L, L);
  return sqrt(max(L * L - a * a, 0.)) - sqrt(max(L * L - py * py, 0.));
}
// the lean a sheet takes from its arm: wrArc made piecewise linear through fixed heights lev (the last slope runs on),
// the same for every column of a row, so paper never folds over its neighbour
float wrLean(float y, vec4 lev, float L, float py) {
  float a1 = wrArc(lev.x, L, py), a2 = wrArc(lev.y, L, py), a3 = wrArc(lev.z, L, py), a4 = wrArc(lev.w, L, py);
  float z = a1 / max(lev.x, 1e-3) * clamp(y, 0., lev.x);
  z += (a2 - a1) / max(lev.y - lev.x, 1e-3) * clamp(y - lev.x, 0., lev.y - lev.x);
  z += (a3 - a2) / max(lev.z - lev.y, 1e-3) * clamp(y - lev.y, 0., lev.z - lev.y);
  z += (a4 - a3) / max(lev.w - lev.z, 1e-3) * max(y - lev.z, 0.);
  return z;
}
vec4 wrRec(float v, float rec) { return textureLod(uRec, vec2((rec + .5) / 4096., v), 0.); }
float wrSpike(float x) { float t = 1. - abs(fract(x) * 2. - 1.); return t * t * (1.6 - .6 * t); }
float wrEnv(float w, float sustain, float decay) {
  return smoothstep(0., .45, w) * exp(-max(w - sustain, 0.) * decay);
}
// one shock: w is seconds since this row's pen began to thrash, ph the row's phase, returns 0..1
float wrShock(float w, float ph, vec4 q, vec3 fb) {
  // a shock builds: its first fins are a third of the height, the full range stands after five seconds (100 m of paper),
  // so from downstream the range is foothills first, rank behind rank, summits inside the frame
  float e = wrEnv(w, q.z, q.w) * (.3 + .7 * smoothstep(0., 5., w));
  float a = uQuakeF.w * fb.z;
  float ws = w * fb.x;
  float s = (1. - .42 * a) * wrSpike(uQuakeF.x * ws + ph) + .30 * a * wrSpike(uQuakeF.y * ws + ph * 2.7) + .10 * a * wrSpike(uQuakeF.z * ws + ph * 5.3);
  return e * (fb.y + (1. - fb.y) * s);
}
float wrSoftCap(float h, float cap, float over) {      // over: how far the tallest peaks still stand above the cap (m)
  float k = 6.;
  float o = max(h - (cap - k), 0.);
  return min(h, cap - k) + k * (1. - exp(-o / k)) + over * (1. - exp(-o / 140.));
}
// row = (x, v in the record texture, class 0 tide 1 now 2 old range 3 barograph, phase)
// row2 = (quake delay in s or -1, quake gain, arm length, pivot height)
float wrHeight(vec4 row, vec4 row2, float z) {
  float rec = z - uScroll;
  float h = wrRec(row.y, rec).r;
  float old = step(1.5, row.z) * step(row.z, 2.5);
  float ramp = clamp((z - uOldRamp.x) / max(uOldRamp.y - uOldRamp.x, 1e-3), 0., 1.);
  h *= mix(1., .04 + .96 * ramp * ramp * (3. - 2. * ramp), old);
  float on = step(0., row2.x);
  float w = uS - z / 20. - row2.x;
  // each row's range has its own great summits, 300 m of paper apart and a third of a swing from its neighbour's: seen slantwise,
  // down the rows, the massif is broad peaks side by side, not a comb of slabs
  float slow = .34 + .66 * wrSpike(.07 * (w - uQuake.x) + row.x * .0236);
  float q = uQuake.y * slow * wrShock(w - uQuake.x, row.w, uQuake, vec3(1., .16, 1.))
    + uQuake3.y * wrShock(w - uQuake3.x, row.w + .9, uQuake3, vec3(.7, .5, .6));
  // the last shock is seen from the west gap: its rows step up away from it (x -35 a third of the height, x 49 and beyond the whole),
  // so it stands ridge behind ridge, each sheet over the one in front
  float g2 = min(1., .031 * exp((row.x + 35.) * .03)) * (.9 + .2 * fract(row.w * 7.31));   // 8 m at x -35, half as high again each row east
  float hq = on * (row2.y * q + g2 * uQuake2.y * wrShock(w - uQuake2.x, row.w + 1.7, uQuake2, uQuake2F));
  // rank behind rank: while the flank cap holds, the n-th row from the gap is written lower, cresting n steps over the eye,
  // so the massif is an amphitheatre round the gap. The trace keeps its fins and saddles (a fuller curve of the same swing).
  float rn = (abs(row.x - .5 * (uCap.x + uCap.y)) - 7.) / 14.;
  float kz = 1. - smoothstep(uRankZ.y, uRankZ.x, z);           // 0 at the gap's mouth, 1 up among the ranks
  vec4 rk = mix(uRank, uRankB, kz);
  float rbase = uRankZ.z * kz, eyeZ = clamp(uRankE.x + uRankE.w * (uRankE.y - z), uRankE.x, uRankE.z);
  float off = rbase + rn * (rk.x + rn * (rk.y + rn * rk.z)), offLo = rbase - 5. - (eyeZ - uRankE.x);
  float pk = max(uQuake.y * row2.y, 1.);
  float rb = on * min(uCap.w, 1.) * step(.5, rn) * (1. - smoothstep(5.2, 6.4, rn));      // five ranks each side, whatever the row's own gain
  float rr = clamp(hq / pk, 0., 1.);
  float full = (1. - exp(-rk.w * rr)) / max(1. - exp(-rk.w), 1e-3);
  // the swing shapes only what stands over the eye: a rank's saddles dip toward the cap, never under it, on both sides of the gap
  // (only where this shock stands, and only while the cap is down at the eye: before that the rows stand free)
  float envQ = wrEnv(w - uQuake.x, uQuake.z, uQuake.w);
  // the ranks are a fixed landscape the record streams through: their line climbs with the gap (eyeZ), so nothing written is
  // ever rewritten in view; a rank stands wherever this shock stands, from the first moment it is seen
  float gate = smoothstep(.03, .3, envQ);
  rb *= gate;
  // a rank's fins are the swing itself, pointed (uRank.w mixes in the fuller curve), some summits greater than others; the
  // range builds over its first 50 m of paper, foothills first
  float wr0 = w - uQuake.x;
  float fin = (.68 * wrSpike(uQuakeF.x * wr0 + row.w) + .32 * wrSpike(uQuakeF.y * wr0 + row.w * 2.7)) * (.6 + .4 * slow);
  fin = mix(fin, full, clamp(rk.w - 1., 0., 1.));
  float hr = eyeZ + offLo + (off - offLo) * mix(fin, 1., mix(uRankFloor, uRankZ.w, kz));
  h += mix(hq, max(hr * mix(.1, 1., smoothstep(0., 2.5, wr0)), 4.), rb);
  float isFlank = max(1. - step(.5, abs(row.x - uCap.x)), 1. - step(.5, abs(row.x - uCap.y)));
  float flank = isFlank * min(uCap.w, 1.) * gate;      // (only where this shock stands: the last shock's rows stand free)
  // uCap.w above 1: the two flanking pens are driven against their stops while the quake lasts, and write a clipped line just under the cap
  float press = max(uCap.w - 1., 0.) * on * smoothstep(.2, .6, wrEnv(w - uQuake.x, uQuake.z, uQuake.w));
  float capF = max(uCap.z - uDrop, 8.);
  float hf = max(h, (capF + 4. + 3. * sin(w * 7. + row.w * 6.)) * press);
  float capW = capF + uFin.w * (1. - step(.5, abs(row.x - uCap.x)));     // the west flank is held lower: its line runs under the eye
  h = mix(h, wrSoftCap(hf + uFin.w * (1. - step(.5, abs(row.x - uCap.x))), capW, 1.5), flank);
  // the red row's fins: over its pressed line the east pen still throws a fin at each swing (they stand a little way downstream)
  // (how tall is settled when a fin is written, never afterwards: the shock's first red peaks are great ones, then a tooth
  // every 27 m of paper until the quake second uFin.z, after which the pen runs level as we come abreast of it)
  float wq = w - uQuake.x;
  float fs = wrSpike(.75 * wq + row.w);
  float fs2 = wrSpike(.3 * wq + row.w * .37 + .25);
  float finA = uFin.x * (1. - smoothstep(uFin.y, uFin.z, wq)) * fs * sqrt(max(fs, 0.))
    + uFinT.x * smoothstep(.2, 1.2, wq) * (1. - smoothstep(uFinT.y, uFinT.z, wq)) * fs2 * fs2 * fs2 * fs2 * fs2 * fs2;
  h += (1. - step(.5, abs(row.x - uCap.y))) * press * finA;
  float inBox = step(uCapBox.x, row.x) * step(row.x, uCapBox.y) * smoothstep(uCapBox.z - 40., uCapBox.z, z) * (1. - smoothstep(uCapBox.w, uCapBox.w + 40., z));
  h = mix(h, wrSoftCap(h, uCapBoxH, 5.), inBox * step(.5, uCapBoxH));
  return max(h, 0.) * (1. - smoothstep(1400., 1530., z));
}
// distance is age: 0 new, 1 old. Paper yellows, ink browns.
float wrPaperAge(float z, float x) { return clamp((z + .5 * abs(x)) / 1400., 0., 1.); }
vec3 wrPaper(float age) { return mix(uPaper, uStraw, age); }
// printed rulings: coordinate c in metres, period p, line width lw; finer than 3 px it becomes its flat average
float wrRule(float c, float p, float lw, float fw) {
  fw = max(fw, 1e-4);
  float d = abs(fract(c / p + .5) - .5) * p;
  float w = max(lw, 1.5 * fw);
  float line = (1. - smoothstep(w * .5 - fw * .5, w * .5 + fw * .5, d)) * min(1., lw / max(w, 1e-4) + .25);
  float flatAvg = lw / p;
  return mix(line, flatAvg, smoothstep(p / 6., p / 3., fw));
}
`,me=t=>h.x0+t*h.pitch;function Ee(t){const a=me(t),r=Math.abs(a);return a>=-119&&a<=-49?0:a>=-35&&a<=119?1:r>=133&&r<=245?2:3}const ne=new Float32Array(4096);for(let t=0;t<4096;t++)ne[t]=Math.sin(t/4096*Math.PI*2);const Pe=t=>{const a=1-Math.abs((t-Math.floor(t))*2-1);return a*a*(1.6-.6*a)};async function je(t,a,r){const n=h.rows,m=e.DataUtils.toHalfFloat,p=new Uint16Array(4096*n*4),v=new Float32Array(4096),w={};let f=0;const s=[];for(let g=0;g<40;g++)s.push(Math.round(g*102.4));for(let g=0;g<n;g++){const L=Ee(g),M=me(g),k=a.fork("row"+g),B=[],x=(i,A)=>B.push([Math.max(1,Math.round(i)),A,k.int(0,4095)]);let F=0,z=null,T=null;if(L===1){F=r.storm?8:3.6;const i=r.storm?1.3:1;x(k.range(90,140),.9*i),x(k.range(190,260),.7*i),x(k.range(380,520),.5*i),x(k.range(900,1300),.28*i),x(k.range(1500,1900),.2),T=[Math.round(k.range(9,17)),k.int(0,4095)]}else if(L===0){const i=r.spring?2:1;F=5.4*i;const A=(r.spring?22:36)+(g-61)*0;x(A,2.1*i),x(A*2+1,.45*i),x(k.range(230,300),.22),x(k.range(700,900),.1),B[0][2]=1200+(g-61)*190&4095,B[1][2]=700+(g-61)*310&4095}else if(L===2){const i=(Math.abs(M)-133)/112,A=.45+.55*Math.sin(Math.PI*(.12+.8*i));z={H:Math.min(280,(M>0?240:190)*A*r.oldGain),k1:k.range(9,13),k2:k.range(25,37),p1:k.range(0,1)+i*.6,p2:k(),ke:k.int(3,6),pe:k.int(0,4095)},x(k.range(400,600),.5),x(k.range(1200,1600),.25)}else{const i=Math.min(g,n-1-g);if(i<12)F=46*(r.storm?.8:1),x(k.int(3,5),9),x(k.int(7,11),5),x(k.int(17,26),1.2),B[0][2]=k.int(0,500)+i*260&4095;else{const A=1-(i-12)/40;F=4+7*A,x(k.int(6,11),1.6+3*A),x(k.int(15,28),.8+A),x(k.range(300,500),.2)}}for(let i=0;i<4096;i++){let A=F;for(let S=0;S<B.length;S++){const I=B[S];A+=I[1]*ne[I[0]*i+I[2]&4095]}if(T&&(A=F+(A-F)*(.55+.45*ne[T[0]*i+T[1]&4095])*1.5),z){const S=i/4096,I=.62+.38*ne[z.ke*i+z.pe&4095];A+=z.H*I*(.26+.5*Pe(z.k1*S+z.p1)+.24*Pe(z.k2*S+z.p2))}v[i]=Math.max(.6,A)}const Q=L===3?2.2:1.4;for(const i of s)v[i&4095]+=Q,v[i+1&4095]+=Q;const E=g*4096*4,G=(L===3?.2:L===2?.8:.3)*r.blots;for(let i=0;i<4096;i++){const A=v[i],S=v[i+4096-1&4095],I=v[i+1&4095];let O=0;A>S&&A>=I&&2*A-S-I>(L===2?.5:L===1?.3:.1)&&k()<G&&(O=k.range(.3,.6)*(L===2?1.5:1)),p[E+i*4]=m(A),p[E+i*4+1]=0,p[E+i*4+2]=m(O),p[E+i*4+3]=m(1)}if(L===0){w[g]=Float32Array.from(v);for(let i=0;i<4096;i++)f=Math.max(f,v[i])}await t.yield()}const d=new e.DataTexture(p,4096,n,e.RGBAFormat,e.HalfFloatType);return d.wrapS=e.RepeatWrapping,d.wrapT=e.ClampToEdgeWrapping,d.magFilter=e.LinearFilter,d.minFilter=e.LinearFilter,d.generateMipmaps=!1,d.needsUpdate=!0,{texture:d,tide:w,tideMax:f}}function Ye(t=Le){const a=t.map(ee);return{uRec:{value:null},uScroll:{value:0},uS:{value:0},uTime:{value:0},uQuake:{value:new e.Vector4(19,300,10,.45)},uQuakeF:{value:new e.Vector4(.3,.8,1.7,1)},uQuake2:{value:new e.Vector4(-47,260,11,.5)},uQuake3:{value:new e.Vector4(1e4,0,5,.5)},uQuake2F:{value:new e.Vector3(.22,.4,.3)},uFoot:{value:new e.Vector4(.4,10,.5,110)},uShade:{value:a[1].clone().lerp(a[4],.32)},uCap:{value:new e.Vector4(35,49,40,0)},uCapBox:{value:new e.Vector4(-42,42,200,400)},uCapBoxH:{value:0},uDrop:{value:0},uRankFloor:{value:0},uRankBase:{value:0},uEyeCap:{value:40},uRank:{value:new e.Vector4(1.2,2.2,.35,1.5)},uFin:{value:new e.Vector4(0,55,95,0)},uRankB:{value:new e.Vector4(1.2,2.2,.35,1.5)},uRankZ:{value:new e.Vector4(1e4,9e3,0,0)},uRankE:{value:new e.Vector4(40,0,40,0)},uFinT:{value:new e.Vector4(0,4,7,0)},uAge:{value:new e.Vector2(.3,.25)},uPx:{value:new e.Vector2(1.1,.0027)},uOldRamp:{value:new e.Vector2(50,210)},uStarveA:{value:new e.Vector4(-1,0,0,0)},uStarveB:{value:new e.Vector4(-1,0,0,0)},uDry:{value:new e.Vector4(-1,0,0,0)},uHole:{value:new e.Vector4(0,0,0,0)},uPaper:{value:a[0]},uStraw:{value:a[1]},uPrint:{value:a[2]},uInkV:{value:a[3]},uSepia:{value:a[4]},uInkT:{value:a[5]},uInkR:{value:a[6]},uPlum:{value:a[3].clone().lerp(a[4],.5)},uThread:{value:a[3].clone().lerp(ee("#ffffff"),.62)},uSteel:{value:ee("#2E3F5C")},uBrass:{value:ee("#B8923A")},uFox:{value:0},uTone:{value:new e.Vector4(.45,.45,.3,1.45)},uDeep:{value:a[1].clone().lerp(a[4],.5)}}}const Qe=.4,Xe=`
attribute vec4 aRow; attribute vec4 aRow2; attribute vec4 aLev; attribute float aInk;
varying vec4 vA; varying vec4 vB; varying vec4 vRow;
${Z}
void main() {
  float sp = position.z;
  float zc = position.x + sp * fract(uScroll / max(sp, 1e-3));
  float e = max(.5, .5 * sp);
  float h = wrHeight(aRow, aRow2, zc);
  float sl = (wrHeight(aRow, aRow2, zc + e) - wrHeight(aRow, aRow2, zc - e)) / (2. * e);
  float y = mix(min(position.y, h), h + ${h.margin.toFixed(1)}, step(5000., position.y));   // fixed levels, so every column shears alike
  float z = zc + wrLean(y, aLev, aRow2.z, aRow2.w);
  vA = vec4(y, h, sl, z);
  vB = vec4(zc, uS - zc / 20. - aRow2.x, step(0., aRow2.x) * aRow2.y, aRow.w);
  vRow = vec4(aRow.x, aRow.y, aInk, aRow.z);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(aRow.x, y, z, 1.);
}`,Ke=`
varying vec4 vA; varying vec4 vB; varying vec4 vRow;
${Z}
// a disc of ink standing on a crest: a = metres along the record from the crest, up = metres above the local trace
// returns metres inside the disc's edge (negative outside; -4 where there is no blot), so the edge can be filtered by its own derivative
float wrBlot(float a, float up, float sl, float r) {
  float b = up - abs(sl * a) - .55 * r;
  return mix(-4., r - length(vec2(a, b)), step(.05, r));
}
float wrStarve(vec4 s, float v, float z) {
  float m = 1. - step(.003, abs(v - s.x));
  return ${Qe.toFixed(2)} * m * s.w * clamp((s.y - z) / 150., 0., 1.) * step(s.z, z);
}
void main() {
  float y = vA.x, h = vA.y, sl = vA.z, z = vA.w, zc = vB.x;
  float inv = inversesqrt(1. + sl * sl);
  float dv = h - y;
  float d = dv * inv;
  float px = max(max(fwidth(y), fwidth(z)), 1e-4);       // metres per pixel on the paper
  // d is a distance on the paper, so it cannot change faster than the paper's metres per pixel: where columns are finer than
  // a pixel (a fin seen edge-on) the raw derivative jumps from column to column and would draw the ink as a lattice
  float fw = clamp(length(vec2(dFdx(dv), dFdy(dv))) * inv, 1e-4, 1.5 * px);
  float near = 1. - smoothstep(.02, .09, px);
  float recC = zc - uScroll;                                // where on the chart this point of paper lies
  float recU = recC;
  // the ink: the top 0.3 m, feathered below when seen close, never thinner than 1.5 px
  float w = vB.y - uQuake.x;
  float heavy = clamp(3. * vB.z * wrEnv(w, uQuake.z, uQuake.w * .5) * (1. - smoothstep(uQuake.z + 4., uQuake.z + 12., w)), 0., 1.);   // the quake is written with a loaded pen
  float flk = max(1. - step(.5, abs(vRow.x - uCap.x)), 1. - step(.5, abs(vRow.x - uCap.y)));   // the two lines beside the route
  float fea = (wrVNoise(vec2(recU * 5., d * 2.5)) - .5) * mix(.11, .2, flk) * near;   // tongues of ink bleeding down the fibre, not specks
  float half0 = .15 + .22 * heavy * (1. - .82 * flk);
  // a starving line narrows and skips: broken dashes of full-strength ink getting thinner, never a paler tint
  float isDry = (1. - step(.003, abs(vRow.y - uDry.x))) * uDry.w;
  float dry = isDry * step(uDry.z, zc) * (1. - smoothstep(uDry.y - 36., uDry.y, zc));   // the line starves to nothing
  float st = max(max(wrStarve(uStarveA, vRow.y, zc), wrStarve(uStarveB, vRow.y, zc)), dry);
  float present = smoothstep(st * 1.2 - .12, st * 1.2, wrVNoise(vec2(recC * .9, 3.7 + vRow.x)));
  // a steep flank on columns finer than a pixel (the sheet seen edge-on): the trace sweeps the whole height the pixel's footprint
  // covers, so the stroke is drawn whole across it, never as a lattice of dots
  float pz = fwidth(zc);
  float minPx = mix(uTone.w, 1.2, smoothstep(250., 700., 1. / max(gl_FragCoord.w, 1e-4)));   // near lines hold three pixels, far ones two and a half
  float th = max(half0 * (1. - .7 * st), minPx * fw) + .5 * abs(sl) * inv * pz * smoothstep(.25, .8, pz);
  float dd = d - half0;
  float ink = (1. - smoothstep(th - .5 * fw, th + .5 * fw, abs(dd + fea * step(0., dd)))) * present;
  vec3 toEye = cameraPosition - vec3(vRow.x, y, z);
  float eyeD = max(length(toEye), 1e-3), graze = abs(toEye.x) / eyeD;
  // (and where a pixel covers more than a metre of the record on a sheet seen slantwise within 400 m, as from the beam: its own ink
  // would break into dots beside the ribbon)
  float coarse = smoothstep(.7, 1.6, pz) * (1. - smoothstep(.3, .5, graze)) * (1. - smoothstep(350., 500., eyeD));
  ink *= mix(1., smoothstep(.03, .09, graze) * (1. - coarse), 1. - step(1.5, vRow.w));
  float paperCov = smoothstep(-.5 * fw, .5 * fw, dd);
  // blots thrown where the pen reversed
  float up = -dv, bf = -4.;
  float i0 = floor(recC + .5);
  float bsz = 1. - .45 * flk;                                // (the two lines beside the route are seen from 5 m: their blots are smaller)
  bf = max(bf, wrBlot(recC - (i0 - 1.), up, sl, wrRec(vRow.y, i0 - 1.).b * bsz));
  bf = max(bf, wrBlot(recC - i0, up, sl, wrRec(vRow.y, i0).b * bsz));
  bf = max(bf, wrBlot(recC - (i0 + 1.), up, sl, wrRec(vRow.y, i0 + 1.).b * bsz));
  float qe = wrEnv(w, uQuake.z, uQuake.w) * vB.z;
  float qa = (fract(uQuakeF.x * w + vB.w) - .5) / max(uQuakeF.x, 1e-3) * 20.;
  bf = max(bf, wrBlot(qa, up, sl, min(.8, 2.6 * qe) * (1. - .6 * flk)));
  float qb = (fract(uQuakeF.y * w + vB.w * 2.7) - .5) / max(uQuakeF.y, 1e-3) * 20.;   // and smaller ones at the quicker swing
  bf = max(bf, wrBlot(qb, up, sl, min(.5, 1.5 * qe) * step(.35, wrHash(floor(uQuakeF.y * w + vB.w * 2.7) + 3. * floor(vRow.x / 14. + .25)))));
  bf = max(bf, wrBlot(zc - uStarveA.z, up, sl, .42 * uStarveA.w * (1. - step(.003, abs(vRow.y - uStarveA.x))) * step(1., uStarveA.z)));
  // the disc's edge is one pixel of its own field wide: where the sheet is seen edge-on a wider edge would be a stipple above the paper
  float ab = clamp(.75 * (fwidth(recC) * (1. + 2. * abs(sl)) + fwidth(y)), .004, .5);   // from smooth quantities: fwidth(bf) jumps where two discs meet
  float blot = smoothstep(-ab, ab, bf) * (1. - smoothstep(.35, .8, sqrt(fwidth(y) * fwidth(zc))));
  blot *= 1. - dry;
  // the dry pen's line comes back with one great blot: it hangs below the line, soaked into the sheet, its rim feathered along the fibre
  // and the paper's grain showing through its edge
  float bq = length(vec2(zc - uDry.z, up - abs(sl * (zc - uDry.z)) + 1.8));
  float bd = 2.5 + .8 * (wrVNoise(vec2(recC * .8, y * .8)) - .5) + .28 * (wrVNoise(vec2(recC * 3.1, y * 3.1)) - .5) - bq;
  bd += (wrVNoise(vec2(recC * 9., y * 31.)) - .72) * .5 * (1. - smoothstep(0., .7, bd)) * near;
  bd = mix(-4., bd, isDry * step(1., uDry.z));
  blot = max(blot, smoothstep(-ab, ab, bd) * (1. - smoothstep(1.5, 4., px)));
  // paper: palest under its line, toned toward straw below; yellowing with distance; print in metres
  float age = wrPaperAge(zc, vRow.x);
  // distance is age across the rows too: the sheet beside the eye is the newest and palest, each one behind it a visible step older,
  // so a stack of ridges is a stack of tones (and every sheet still tones toward its foot, darker than the top of the one behind)
  float rn = abs(vRow.x - cameraPosition.x) / 14.;
  float rm = max(rn - .7, 0.);
  float rowAge = uTone.x * ((1. - exp(-uTone.y * rm)) + (1. - exp(-.1 * rm)));     // quick steps over the first five rows, slow ones beyond
  // and down the stream: paper that has stood a while is a deeper stock than the fresh sheet at the pens, the old ranges deepest of all
  rowAge = min(rowAge + uAge.x * smoothstep(100., 520., zc) + uAge.y * step(1.5, vRow.w) * step(vRow.w, 2.5), 1.);
  vec3 paper = mix(mix(wrPaper(age), uDeep, rowAge), mix(uShade, uDeep * .86, rowAge), uFoot.x * clamp(dv / max(uFoot.y, 1.), 0., 1.) + uFoot.z * clamp(dv / max(uFoot.w, 1.), 0., 1.));
  float fru = fwidth(recU);
  float pr = max(wrRule(y, 10., .2, fwidth(y)), wrRule(recU, 20., .34, fru));
  // at reading distance a sheet is unmistakably a strip of chart: the fine rulings print at full strength and the fibre shows
  float near2 = 1. - smoothstep(.03, .14, px);
  float near3 = 1. - smoothstep(.12, .34, px);                 // to about 60 m the fine rulings are heavy enough to read
  pr = max(pr, max(wrRule(y, 50., .3, fwidth(y)), wrRule(recU, 4., mix(.07, .13, near3), fru) * mix(.7, 1., near3)));   // the fine arcs ride the paper too
  pr = max(pr, wrRule(y, 2.5, mix(.06, .12, near3), fwidth(y)) * mix(.7, 1., near3));                                 // and the fine level rulings
  pr = max(pr, max(wrRule(y, .5, .03, fwidth(y)), wrRule(recU, 1., .034, fru)) * .75 * near2);      // and the chart's finest graduations, to about 30 m
  paper = mix(paper, mix(uPrint, uStraw, age * .75) * mix(1., .8, rowAge) * (1. - .1 * near2), pr * .9);
  float fib = wrVNoise(vec2(recU * 1.3, y * 34.)) + wrVNoise(vec2(recU * 21., y * 2.5)) - 1.;
  paper *= 1. - mix(.05, .1, near2) * fib * max(near, .6 * near2);
  float fox = smoothstep(.80, .87, wrVNoise(vec2(recU, y) * 2.3 + vRow.x)) * smoothstep(.45, .75, wrVNoise(vec2(recU, y) * .13 + vRow.x)) * uFox;
  paper = mix(paper, uSepia, .3 * fox * (1. - smoothstep(.06, .25, px)));
  // ink colour: its own pigment, darker and threaded while wet, browning with age
  float za = (zc + 16. * rn) * (1. - .8 * heavy);              // and its ink a step browner
  float isT = step(.5, vRow.z) * (1. - step(1.5, vRow.z));
  float wet = max(1. - smoothstep(mix(18., 70., isT), mix(42., 140., isT), zc), heavy);   // (the tide's heavy line keeps its thread longer)
  vec3 cv = mix(mix(uInkV, uPlum, smoothstep(40., 150., za)), uSepia, smoothstep(140., 300., za));
  vec3 ct = mix(uInkT, uSepia, .45 * smoothstep(200., 700., za));
  vec3 cr = mix(uInkR, uSepia, .5 * smoothstep(250., 800., za));
  vec3 ic = mix(cv, ct, step(.5, vRow.z) * (1. - step(1.5, vRow.z)));
  ic = mix(ic, cr, step(1.5, vRow.z));
  vec3 thread = mix(uThread, ic + (1. - ic) * .38, step(.5, vRow.z));
  ic *= mix(1., .7, wet);
  float tw = max(.02, 1.2 * fw);                             // the thread holds two to three pixels out to about 30 m
  float tl = (1. - smoothstep(tw - .5 * fw, tw + .5 * fw, abs(dd))) * wet * (1. - smoothstep(.05, .12, fw)) * step(tw * 2.5, th);
  ic = mix(ic, thread, max(tl, .08 * wet * smoothstep(.03, .12, fw)));
  ic = mix(ic, uStraw, smoothstep(1300., 1520., zc));
  float inkS = ink;
  float inkA = max(ink, blot);
  vec3 col = mix(paper, ic, inkA);
  float alpha = max(max(inkS, paperCov), step(.5, blot));   // the silhouette is whole: a faded blot or a thinned line is a paler tint, never a stipple
  if (alpha < .35) discard;
  gl_FragColor = vec4(col, alpha);
}`,Je=`
attribute vec4 aRow; attribute vec4 aRow2; attribute vec4 aLev; attribute float aInk;
varying vec4 vB; varying vec4 vRow;
${Z}
uniform vec2 uPx;            // half width of the ribbon in pixels; the size of a pixel at 1 m
void main() {
  float sp = position.z;
  float zc = position.x + sp * fract(uScroll / max(sp, 1e-3));
  float h = wrHeight(aRow, aRow2, zc);
  vec3 c = vec3(aRow.x, h, zc + wrLean(h, aLev, aRow2.z, aRow2.w));
  float vd = length((modelViewMatrix * vec4(c, 1.)).xyz);
  c.x += position.y * vd * uPx.x * uPx.y;
  vB = vec4(zc, uS - zc / 20. - aRow2.x, step(0., aRow2.x) * aRow2.y, h);
  vRow = vec4(aRow.x, aRow.y, aInk, aRow.z);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(c, 1.);
}`,et=`
varying vec4 vB; varying vec4 vRow;
${Z}
float wrStarve(vec4 s, float v, float z) {
  float m = 1. - step(.003, abs(v - s.x));
  return ${Qe.toFixed(2)} * m * s.w * clamp((s.y - z) / 150., 0., 1.) * step(s.z, z);
}
void main() {
  float zc = vB.x, w = vB.y - uQuake.x;
  if (vB.w < .05) discard;
  // the same pigment the sheet's own edge is drawn in (see CURTAIN_FRAG): wet, heavy, browning with age, starving in dashes
  float heavy = clamp(3. * vB.z * wrEnv(w, uQuake.z, uQuake.w * .5) * (1. - smoothstep(uQuake.z + 4., uQuake.z + 12., w)), 0., 1.);
  float isDry = (1. - step(.003, abs(vRow.y - uDry.x))) * uDry.w;
  float dry = isDry * step(uDry.z, zc) * (1. - smoothstep(uDry.y - 36., uDry.y, zc));
  float st = max(max(wrStarve(uStarveA, vRow.y, zc), wrStarve(uStarveB, vRow.y, zc)), dry);
  if (wrVNoise(vec2((zc - uScroll) * .9, 3.7 + vRow.x)) < st * 1.2 - .06) discard;
  float rn = abs(vRow.x - cameraPosition.x) / 14.;
  float za = (zc + 16. * rn) * (1. - .8 * heavy);
  float isT = step(.5, vRow.z) * (1. - step(1.5, vRow.z));
  float wet = max(1. - smoothstep(mix(18., 70., isT), mix(42., 140., isT), zc), heavy);
  vec3 cv = mix(mix(uInkV, uPlum, smoothstep(40., 150., za)), uSepia, smoothstep(140., 300., za));
  vec3 ct = mix(uInkT, uSepia, .45 * smoothstep(200., 700., za));
  vec3 cr = mix(uInkR, uSepia, .5 * smoothstep(250., 800., za));
  vec3 ic = mix(mix(cv, ct, isT), cr, step(1.5, vRow.z));
  ic *= mix(1., .7, wet);
  ic = mix(ic, uStraw, smoothstep(1300., 1520., zc));
  gl_FragColor = vec4(ic, 1.);
}`;function tt(t,a,r,o){const n=[];let m=0;for(const[s,d]of a){for(let g=0;g<s;g++)n.push([m+g*d,d]);m+=s*d}const p=new Float32Array(n.length*6),v=[];n.forEach((s,d)=>{p.set([s[0],-1,s[1],s[0],1,s[1]],d*6)});for(let s=0;s<n.length-1;s++)v.push(2*s,2*s+2,2*s+1,2*s+1,2*s+2,2*s+3);const w=new e.InstancedBufferGeometry;w.setAttribute("position",new e.BufferAttribute(p,3)),w.setIndex(v),X(w,r,o);const f=new e.Mesh(w,new e.ShaderMaterial({uniforms:t,vertexShader:Je,fragmentShader:et,side:e.DoubleSide}));return f.frustumCulled=!1,f}function at(t){return new e.ShaderMaterial({uniforms:t,vertexShader:Xe,fragmentShader:Ke,side:e.DoubleSide,alphaToCoverage:!0})}function ie(t,a=[]){const r=[0,...a,1e4],o=r.length-1,n=[[0,0]];let m=0;for(const[f,s]of t){for(let d=0;d<f;d++)n.push([m+d*s,s]);m+=f*s}const p=new Float32Array(n.length*(o+1)*3),v=[];n.forEach((f,s)=>{for(let d=0;d<=o;d++)p.set([f[0],r[d],f[1]],(s*(o+1)+d)*3)});for(let f=0;f<n.length-1;f++)for(let s=0;s<o;s++){const d=f*(o+1)+s,g=d+o+1;v.push(d,g,d+1,d+1,g,g+1)}const w=new e.InstancedBufferGeometry;return w.setAttribute("position",new e.BufferAttribute(p,3)),w.setIndex(v),w}function le(t,a,r,o){const n=r.length,m=new Float32Array(n*4),p=new Float32Array(n*4),v=new Float32Array(n),w=new Float32Array(n*4);r.forEach((s,d)=>{m.set(o[s].row,d*4),p.set(o[s].row2,d*4),v[d]=o[s].ink,w.set(o[s].lev,d*4)}),t.setAttribute("aLev",new e.InstancedBufferAttribute(w,4)),t.setAttribute("aRow",new e.InstancedBufferAttribute(m,4)),t.setAttribute("aRow2",new e.InstancedBufferAttribute(p,4)),t.setAttribute("aInk",new e.InstancedBufferAttribute(v,1)),t.instanceCount=n;const f=new e.Mesh(t,a);return f.frustumCulled=!1,f}function ot(t){return new e.ShaderMaterial({uniforms:t,side:e.DoubleSide,vertexShader:`
attribute float aS; varying vec3 vW; varying float vS;
void main() { vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vS = aS; gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`
varying vec3 vW; varying float vS;
${Z}
void main() {
  float hd = length(vW - uHole.xyz);
  if (hd < uHole.w) discard;
  // the punch drew the paper in: within 60 m of the hole the chart is pulled toward it, so its rulings bend in and crowd at the lip
  float hon = step(.5, uHole.w);
  float holeS = -100. - 300. * asin(clamp((-100. - uHole.z) / 300., -1., 1.));      // where the hole lies along the paper (the drum: z -100, radius 300)
  vec2 hv = vec2(vW.x - uHole.x, vS - holeS);
  float hl = max(length(hv), 1e-3), hr = max(hl - uHole.w, 0.);
  float pull = hon * 26. * (1. - exp(-hr / 9.)) * exp(-hr / 45.);
  vec2 pc = vec2(uHole.x, holeS) + hv * (1. + pull / hl);                             // where this point of paper lay on the chart before the punch
  float px = mix(vW.x, pc.x, hon), ps = mix(vS, pc.y, hon);
  float rec = ps - uScroll;
  float fx = max(fwidth(px), 1e-4), fs = max(fwidth(ps), 1e-4);
  float near = 1. - smoothstep(.02, .09, max(fx, fs));
  float hy = clamp(vW.y / 600., 0., 1.), ageZ = wrPaperAge(max(vW.z, 0.), 0.);      // height as a share of the vault's 600 m; the age the floor has this far downstream
  float age = ageZ * (1. - hy);      // yellowing belongs to the floor, which carries the record away: full on the floor, none at the vault, the unwritten supply, which keeps the sheet's colour all the way; the walls that close the world grade from the floor's straw at their feet up to the vault
  vec3 paper = wrPaper(age);
  // the cross-rulings are arcs, lane by lane, because a pen swings on an arm (a lane is the 14 m between two rows' feet)
  float lx = (fract(px / 14.) - .5) * 14.;
  float arcC = rec - (12.5 - sqrt(max(156.25 - lx * lx, 0.)));
  float fa = max(fwidth(arcC), 1e-4);
  fa = mix(fa, fs, step(4. * fs + .5, fa));     // the seam between two lanes: no derivative spike
  float pr = max(wrRule(px, 7., .12, fx), wrRule(arcC, 20., .2, fa));
  pr = max(pr, max(wrRule(rec, 102.4, .34, fs), wrRule(px, 1.75, .05, fx) * .7));
  pr = max(pr, wrRule(arcC, 4., .05, fa) * .7);
  pr = max(pr, max(wrRule(px, 56., .5, fx), wrRule(rec + 30., 51.2, .5, fs)) * .8);   // the heavy rulings: they carry the print to the vault and up the drum
  paper = mix(paper, mix(uPrint, mix(wrPaper(age), uStraw, 1. - hy), ageZ * .75), pr * .9);      // the print pales downstream toward its own paper: the straw on the floor, the fresh sheet on the vault
  float fib = wrVNoise(vec2(rec * 1.3, vW.x * 34.)) + wrVNoise(vec2(rec * 21., vW.x * 2.5)) - 1.;
  paper *= 1. - .05 * fib * near;
  float fox = smoothstep(.80, .87, wrVNoise(vec2(rec, vW.x) * 2.3)) * smoothstep(.45, .75, wrVNoise(vec2(rec, vW.x) * .13)) * uFox;
  paper = mix(paper, uSepia, .3 * fox * (1. - smoothstep(.06, .25, max(fx, fs))));
  // the punch's dimple: three flat steps of tone, each darker toward the bruised lip, each with a drawn edge a pixel or two wide
  // (never a soft band); their edges wander round the hole and breathe as the sheet passes over the drum
  float ang = atan(hv.x + 1e-3, hv.y);
  float fh = max(fwidth(hl), 1e-4) * .75;
  float w1 = 2.2 * sin(ang * 5. + 1.) + 1.1 * sin(ang * 9. - uTime * .35);
  float w2 = 3.6 * sin(ang * 4. + 2.7) + 1.6 * sin(ang * 7. + uTime * .3);
  float w3 = 5.5 * sin(ang * 3. + 4.1) + 2.4 * sin(ang * 6. - uTime * .25);
  float e1 = 8. * (1. + .09 * sin(uTime * .9)) + w1, e2 = 22. * (1. + .07 * sin(uTime * .9 - 1.1)) + w2, e3 = 46. * (1. + .05 * sin(uTime * .9 - 2.2)) + w3;
  float e4 = 78. + 1.5 * w3 + 3. * sin(uTime * .9 - 3.3);
  float lvl = (1. - smoothstep(e1 - fh, e1 + fh, hr)) + (1. - smoothstep(e2 - fh, e2 + fh, hr)) + (1. - smoothstep(e3 - fh, e3 + fh, hr)) + .7 * (1. - smoothstep(e4 - fh, e4 + fh, hr));
  paper = mix(paper, mix(uShade, uSepia, .22), hon * .27 * lvl);
  paper = mix(paper, mix(uShade, uSepia, .3), (1. - smoothstep(1.4 - fh, 1.4 + fh, hr)) * hon);   // the bruised lip of the hole
  gl_FragColor = vec4(paper, 1.);
}`})}const ve=`
attribute float aTone;
varying vec3 vN; varying vec3 vO; varying vec4 vT;   // vT: tone, ink index, ink level, bulb y
${Z}
`,rt=`
varying vec3 vN; varying vec3 vO; varying vec4 vT;
${Z}
void main() {
  vec3 n = vN / max(length(vN), 1e-4);
  float tone = vT.x;
  float t5 = step(4.5, tone) * (1. - step(5.5, tone)), t6 = step(5.5, tone);      // a paler turned band of brass; a knurled blued ring
  vec3 metal = mix(uSteel, uBrass, max(step(.5, tone) * (1. - step(1.5, tone)), t5));
  // a drawn highlight and a drawn underside: two flat tints of the same pigment, fixed to the object, not light
  float hi = step(.72, n.y), lo = step(n.y, -.6);
  float isBr = max(step(.5, tone) * (1. - step(1.5, tone)), t5);
  vec3 col = mix(metal, min(metal * mix(1.75, 1.22, isBr) + mix(.03, 0., isBr), vec3(1.)), hi) * (1. - .2 * lo);
  // girder: brass rivets every 2 m, drawn in metres
  float fx = max(fwidth(vO.x), 1e-4);
  float side = step(abs(n.y), .5);                          // the web's faces; the flanges are riveted too, seen from below
  vec2 rp = vec2(fract(vO.x / 2.) * 2. - 1., (fract(mix(vO.z, vO.y, side) / 1.5 + .5) - .5) * 1.5);
  float riv = 1. - smoothstep(.27 - fx, .27 + fx, length(rp));
  riv = mix(riv, .1, smoothstep(.35, 1., fx));
  // splice plates at every saddle (14 m): a paler blued strap with its own rivets
  float sx = abs(fract(vO.x / 14. + .5) - .5) * 14.;
  float strap = 1. - smoothstep(1.1 - fx, 1.1 + fx, sx);
  strap = mix(strap, .16, smoothstep(1., 3., fx));
  float girder = step(2.5, tone) * (1. - step(3.5, tone));
  // the long girder is a box of plate with lightening holes, two to a bay, flanged in brass: the ruled vault shows through them
  float gh = girder * step(100., vO.y), horiz = step(.5, abs(n.y));
  // the bridge (up): every fragment of the girder's steel that lies over the top of the girder's top flange, which is the bridge
  // plate's two faces and two ends, in courses the web's depth, and all six faces of the cap flange on it. The holes, their rims and
  // their far-off paling stay on the girder's own course (lc: its holed web and its two flanges). The bridge's upright faces carry
  // rows of the same rivets .75 m either side of each course joint and none between: a double seam at each joint within the bridge
  // plate, one row over its foot, one under the cap and one along the cap's edge. A seam's band is the 1.5 m either side of its joint,
  // taken as the share of it under the pixel (sb: metres of band below each end of the pixel's reach), so far off a seam is its flat average
  float up = gh * step(${(_.foot+.001).toFixed(3)}, vO.y), lc = gh - up;
  // the bridge is one flat pigment on every face: it takes neither the paler tint of faces that look up nor the darker tint of
  // undersides, so the cap's top and its underside are the bridge plate's steel; its straps and rivets are drawn on that below
  col = mix(col, metal, up);
  float cj = (fract((vO.y - ${_.foot.toFixed(2)}) / ${_.web.toFixed(1)} + .5) - .5) * ${_.web.toFixed(1)}, fy = max(fwidth(vO.y), 1e-3);
  vec2 sb = vO.y - ${(_.foot-1.5).toFixed(2)} + vec2(-.5, .5) * fy, sk = floor(sb / ${_.web.toFixed(1)});
  sb = 3. * sk + min(sb - ${_.web.toFixed(1)} * sk, 3.);
  float seam = 1. - smoothstep(.27 - fx, .27 + fx, length(vec2(rp.x, abs(cj) - .75)));
  seam = mix(seam, .1, smoothstep(.35, 1., fx)) * clamp((sb.y - sb.x) / fy, 0., 1.);
  vec2 hq = vec2((fract(vO.x / 7.) - .5) * 7., mix(vO.y - ${(h.longArm.py+h.bulbLift+5.7).toFixed(1)}, vO.z - ${h.longArm.pz.toFixed(1)}, horiz));
  float hdist = length(max(abs(hq) - mix(vec2(1.5, 1.7), vec2(1.5, .55), horiz), 0.)) - .7;
  if (lc > .5 && hdist < 0. && fx < .45) discard;
  riv *= mix(1., mix(step(3.3, abs(hq.y)), step(1.95, abs(hq.y)), horiz), gh);      // the girder's own rivets: on upright faces only above and below its holed web's holes (its flanges' edges, the web's two edges), on flat faces only outside the slots
  riv = mix(riv, seam, up * (1. - horiz));                  // the bridge's upright faces take the seams in their place; the cap's flat faces keep the flanges' rule
  col = mix(col, min(uSteel * 1.55 + .02, vec3(1.)), strap * girder * .9);
  col = mix(col, uBrass, riv * girder);
  col = mix(col, uBrass, lc * (1. - smoothstep(.15 - fx, .15 + fx, abs(hdist - .14))) * (1. - smoothstep(.3, .7, fx)));      // the holes' rolled rims
  col = mix(col, uPaper * .94, lc * .85 * mix(step(hdist, 0.), .22, smoothstep(.8, 2., fx)) * smoothstep(.3, .45, fx));     // far off: pale ovals, then their flat average
  col = mix(col, min(uBrass * 1.3, vec3(1.)), t5);
  float kn = step(.5, fract(atan(vO.z, vO.y + 1e-4) * 5.1 + vO.x * 1.3));
  col = mix(col, mix(uSteel * .78, min(uSteel * 1.6 + .02, vec3(1.)), mix(kn, .45, smoothstep(.12, .4, fx))), t6);
  // an arm is a riveted tube: four seams of brass rivets every 1.2 m along it, drawn in metres
  float seamD = length(vec2((fract(vO.x / 1.2) - .5) * 1.2, min(abs(vO.y), abs(vO.z))));
  float srv = 1. - smoothstep(.1 - fx, .1 + fx, seamD);
  srv = mix(srv, .03, smoothstep(.08, .3, fx));
  col = mix(col, uBrass, srv * step(6.5, vT.z) * step(tone, .5));
  // glass bulb: its own ink below the level, pale glass above, a cream glint
  vec3 ink = mix(mix(uInkV, uInkT, step(.5, vT.y) * (1. - step(1.5, vT.y))), uInkR, step(1.5, vT.y));
  vec3 glass = mix(uPaper, uSteel, .2);
  float lvl = vT.z + .04 * sin(vO.z * 5. + uTime * 3.) ;
  vec3 bulb = mix(glass, ink, step(vT.w, lvl));
  bulb = mix(bulb, uPaper, step(.55, n.y) * step(n.x, -.25) * step(-.75, n.x) * .85);
  col = mix(col, bulb, step(1.5, tone) * (1. - step(2.5, tone)));
  col = mix(col, ink, step(3.5, tone) * (1. - step(4.5, tone)));
  gl_FragColor = vec4(col, 1.);
}`,st=ve+`
attribute vec4 aRow; attribute vec4 aRow2; attribute vec4 aLev; attribute float aInk;
void main() {
  float L = aRow2.z, py = aRow2.w;
  float h = wrHeight(aRow, aRow2, 0.);
  float vel = (h - wrHeight(aRow, aRow2, 3.)) / .15;
  float lift = ${h.bulbLift.toFixed(1)};
  vec3 P = vec3(0., py + lift, -sqrt(max(L * L - py * py, 0.)));
  vec3 T = vec3(0., h + lift, wrLean(h, aLev, L, py));
  vec3 dir = (T - P) / max(length(T - P), 1e-3);
  vec3 n2 = vec3(0., dir.z, -dir.y);
  float t = position.z, tc = clamp(t, 0., 1.);
  float fat = mix(1., mix(2.2, 1., smoothstep(0., .9, tc)), step(150., L));
  // the two arms beside the route are the heaviest of the instrument: they stay stout to within a few metres of the nib
  float isF = max(1. - step(.5, abs(aRow.x - uCap.x)), 1. - step(.5, abs(aRow.x - uCap.y)));
  fat *= 1. + isF * .7 * smoothstep(.08, .45, tc) * (1. - .93 * smoothstep(.8, .965, tc));   // (and fine again at the nib: the bulb is not hidden by its own arm)
  float flex = clamp(vel * .012, -1., 1.) * L * .014 * sin(3.14159 * tc);
  // far off a long arm never thins below four pixels (a short one three), and beyond 700 m the arms close up into one flat
  // blued band: never stripes and dots
  vec3 ctr = P + dir * (t * L) + vec3(aRow.x, 0., 0.);
  float vd = length((modelViewMatrix * vec4(ctr, 1.)).xyz);
  float rmin = vd * mix(.0036, .0056, step(150., L)) + 7. * smoothstep(650., 1100., vd);
  fat *= clamp(rmin / max(length(position.xy) * fat, 1e-3), 1., 60.);
  vec3 p = P + dir * (t * L) + vec3(position.x * fat, 0., 0.) + n2 * (position.y * fat - flex);
  vN = vec3(normal.x, normal.y * dir.z, -normal.y * dir.y);
  vO = vec3(t * L, position.y * fat, position.x * fat); vT = vec4(aTone, aInk, 7., 0.);   // vT.z 7 marks an arm (it holds no ink)
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p.x + aRow.x, p.y, p.z, 1.);
}`,nt=ve+`
attribute vec4 aRow; attribute vec4 aRow2; attribute vec4 aLev; attribute float aInk;
void main() {
  float h = wrHeight(aRow, aRow2, 0.);
  vec3 T = vec3(aRow.x, h, wrLean(h, aLev, aRow2.z, aRow2.w));
  vN = normal; vO = position;
  float lvl = mix(-.75, .8, fract(aRow.w * 7.31 - uTime * .011));
  vT = vec4(aTone, aInk, lvl, (position.y - ${h.bulbLift.toFixed(1)}) / .6);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position + T, 1.);
}`,it=ve+`
uniform vec4 uInstr;   // ink index, ink level, 0, 0 for this object
void main() {
  vN = normal; vO = position; vT = vec4(aTone, uInstr.x, uInstr.y, position.y);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`;function he(t,a="static"){const r=a==="static"?{...t,uInstr:{value:new e.Vector4(1,.2,0,0)}}:t;return new e.ShaderMaterial({uniforms:r,vertexShader:a==="arm"?st:a==="nib"?nt:it,fragmentShader:rt})}const R=(t,a,r)=>(r&&t.applyMatrix4(r),t.deleteAttribute("uv"),t.setAttribute("aTone",new e.BufferAttribute(new Float32Array(t.attributes.position.count).fill(a),1)),t),C=(t,a,r,o=0,n=0,m=0,p=1)=>new e.Matrix4().compose(new e.Vector3(t,a,r),new e.Quaternion().setFromEuler(new e.Euler(o,n,m)),new e.Vector3(p,p,p));function de(t,a,r){const o=B=>B/r,n=r>150?2.2:1,m=a?[[o(-3.2),1.2,o(-1.2),1.2,1,1],[o(-1.2),.75,.5,.5,0,1],[.5,.5,.985,.25,0,1]]:[...r>150?[[o(-4.75*n),.2,o(-4.4*n),.2,0,1],[o(-4.4*n),.46,o(-4.15*n),.46,1,1],[o(-4.15*n),.2,o(-3.5*n),.2,0,1],[o(-3.5*n),.95,o(-3.25*n),1.25,5,1],[o(-3.25*n),1.25,o(-2.62*n),1.25,1,1],[o(-2.62*n),1.37,o(-2.2*n),1.37,6,1],[o(-2.2*n),1.25,o(-1.55*n),1.25,1,1],[o(-1.55*n),1.25,o(-1.3*n),.95,5,1]]:[[o(-3.4*n),1.25,o(-1.3*n),1.25,1,1]],[o(-1.3*n),.7,o(-.9),.7,0,1],[o(-.9),1.5,o(.9),1.5,1,1],...r>150?[[o(.9),.8,.07,.76,0,1],[.07,.95,.07+o(1.6),.95,1,1],[.07+o(1.6),.75,.14,.72,0,1],[.14,.9,.14+o(1.4),.9,1,1],[.14+o(1.4),.71,.22,.67,0,1],[.22,.86,.22+o(1.2),.86,1,1],[.22+o(1.2),.66,.3,.62,0,1]]:[[o(.9),.8,.3,.62,0,2]],[.3,.84,.3+o(.7),.84,1,1],[.3+o(.7),.6,.64,.42,0,2],[.64,.62,.64+o(.6),.62,1,1],[.64+o(.6),.41,1-o(2.6),.25,0,2],[1-o(2.6),.36,1-o(1.7),.31,1,1],[1-o(1.7),.22,1-o(1.05),.2,0,1]],p=[],v=[],w=[],f=[],s=(B,x,F)=>{for(let z=0;z<t;z++){const T=z/t*Math.PI*2;p.push(Math.cos(T)*x,Math.sin(T)*x,B),v.push(Math.cos(T),Math.sin(T),0),w.push(F)}return p.length/3-t},d=(B,x)=>{for(let F=0;F<t;F++){const z=(F+1)%t;f.push(B+F,x+F,B+z,B+z,x+F,x+z)}};let g=null;for(const[B,x,F,z,T,Q]of m){if(g&&!a){const G=g[1]>x?g[2]:T;d(s(g[0],g[1],G),s(B,x,G))}g=[F,z,T];let E=s(B,x,T);for(let G=1;G<=Q;G++){const i=G/Q,A=s(B+(F-B)*i,x+(z-x)*i,T);d(E,A),E=A}}const L=s(m[0][0],.001,m[0][4]);if(d(L,0),!a&&r>150){const B=(x,F,z,T,Q,E)=>{const i=p.length/3;for(let S=0;S<2;S++)for(let I=0;I<8;I++){const O=I/8*Math.PI*2,$=Math.cos(O),H=Math.sin(O),ae=S?z:F;x===0?(p.push(ae,$*T,E+H*T*n/r),v.push(0,$,0)):(p.push($*T,ae,E+H*T*n/r),v.push($,.3,0)),w.push(Q)}for(let S=0;S<8;S++){const I=(S+1)%8;f.push(i+S,i+8+S,i+I,i+I,i+8+S,i+8+I)}const A=p.length/3;p.push(x===0?z:0,x===0?0:z,E),v.push(x===0?.6:0,1,0),w.push(Q);for(let S=0;S<8;S++)f.push(i+8+S,A,i+8+(S+1)%8)};B(0,-1.95,1.95,.24,0,0),B(0,1.5,1.95,.4,1,0),B(0,-1.5,-1.95,.4,1,0),B(1,1.3,1.85,.2,0,o(-2.41*n)),B(1,1.78,1.98,.34,1,o(-2.41*n))}const k=new e.InstancedBufferGeometry;return k.setAttribute("position",new e.Float32BufferAttribute(p,3)),k.setAttribute("normal",new e.Float32BufferAttribute(v,3)),k.setAttribute("aTone",new e.Float32BufferAttribute(w,1)),k.setIndex(f),k}function Ge(t){const a=h.bulbLift,r=[];if(r.push(R(new e.SphereGeometry(.6,t?6:28,t?4:18),2,C(0,a,0))),!t){r.push(R(new e.CylinderGeometry(.64,.64,.13,28,1,!0),1,C(0,a,0))),r.push(R(new e.CylinderGeometry(.17,.33,.26,20,1,!1),1,C(0,a+.64,0))),r.push(R(new e.CylinderGeometry(.1,.1,.2,8,1,!1),0,C(0,a+.84,0))),r.push(R(new e.CylinderGeometry(.2,.2,.07,16,1,!1),1,C(0,a+.96,0))),r.push(R(new e.CylinderGeometry(.36,.3,.5,20,1,!1),1,C(0,a,-.84,Math.PI/2))),r.push(R(new e.CylinderGeometry(.12,.22,.26,8,1,!0),1,C(0,a-.68,0)));const f=new e.ConeGeometry(.13,.4,4,1,!1);f.scale(1.5,1,.4),r.push(R(f,1,C(0,.2,.05,Math.PI))),r.push(R(new e.SphereGeometry(.1,6,4),4,C(0,.06,.03)))}const o=new e.CatmullRomCurve3([new e.Vector3(0,a-.62,0),new e.Vector3(0,a-1,.16),new e.Vector3(0,.34,.2),new e.Vector3(0,.1,.07),new e.Vector3(0,0,0)]),n=new e.TubeGeometry(o,t?3:8,.085,t?3:6,!1),m=n.attributes.position,p=n.attributes.normal;for(let f=0;f<m.count;f++){const s=m.getY(f)+p.getY(f)*-.085,d=.25+.75*Math.min(1,Math.max(0,s/(a-.62)));m.setXYZ(f,m.getX(f)-p.getX(f)*.085*(1-d),m.getY(f)-p.getY(f)*.085*(1-d),m.getZ(f)-p.getZ(f)*.085*(1-d))}r.push(R(n,1));const v=j(r),w=new e.InstancedBufferGeometry;return w.setAttribute("position",v.attributes.position),w.setAttribute("normal",v.attributes.normal),w.setAttribute("aTone",v.attributes.aTone),w.setIndex(v.index),w}function X(t,a,r){const o=a.length,n=new Float32Array(o*4),m=new Float32Array(o*4),p=new Float32Array(o),v=new Float32Array(o*4);return a.forEach((w,f)=>{n.set(r[w].row,f*4),m.set(r[w].row2,f*4),p[f]=r[w].ink,v.set(r[w].lev,f*4)}),t.setAttribute("aLev",new e.InstancedBufferAttribute(v,4)),t.setAttribute("aRow",new e.InstancedBufferAttribute(n,4)),t.setAttribute("aRow2",new e.InstancedBufferAttribute(m,4)),t.setAttribute("aInk",new e.InstancedBufferAttribute(p,1)),t.instanceCount=o,t}function ue(t,a,r,o,n,m,p){const v=a-t,w=(t+a)/2,f=[],s=r+p+n*.5+1.2;return f.push(R(new e.BoxGeometry(v,n,m),3,C(w,s,o))),f.push(R(new e.BoxGeometry(v,n*.16,m*1.5),3,C(w,s+n*.58,o))),f.push(R(new e.BoxGeometry(v,n*.16,m*1.5),3,C(w,s-n*.58,o))),j(f)}function xe(t,a,r){const o=a-t,n=(t+a)/2,m=_,p=new e.BoxGeometry(o,h.bridge,m.wid);p.setIndex(p.groups.filter(w=>w.materialIndex!==2&&w.materialIndex!==3).flatMap(w=>Array.from(p.index.array.slice(w.start,w.start+w.count))));const v=new e.BoxGeometry(o,m.flange,m.wid*1.5);return j([R(p,3,C(n,m.foot+h.bridge*.5,r)),R(v,3,C(n,m.top+m.flange*.5,r))])}function lt(){const t=[],a=Math.PI/2;t.push(R(new e.CylinderGeometry(.72,.72,2.3,12,1,!0),1,C(0,-1.55,0,0,0,a))),t.push(R(new e.SphereGeometry(.72,12,5,0,Math.PI*2,0,a),1,C(1.15,-1.55,0,0,0,-a))),t.push(R(new e.SphereGeometry(.72,12,5,0,Math.PI*2,0,a),1,C(-1.15,-1.55,0,0,0,a)));for(const r of[-.8,0,.8])t.push(R(new e.CylinderGeometry(.76,.76,.1,12,1,!0),0,C(r,-1.55,0,0,0,a)));t.push(R(new e.CylinderGeometry(.22,.3,.3,8),1,C(.55,-.72,0))),t.push(R(new e.CylinderGeometry(.11,.11,1.15,6),2,C(-.35,-1.5,.78)));for(const r of[-.9,-2.1])t.push(R(new e.CylinderGeometry(.15,.15,.1,6),1,C(-.35,r,.78)));for(const r of[-.95,.95]){t.push(R(new e.BoxGeometry(.14,1,.5),0,C(r,-.42,0)));for(const o of[-.32,.32])t.push(R(new e.CylinderGeometry(.3,.3,.1,10),1,C(r,.12,o,a)))}return t.push(R(new e.BoxGeometry(.5,.3,.9),0,C(0,-2.35,.25))),j(t)}const qe={cream:null,buff:["#E9D9B4","#D2B67C","#C99A7E","#2B2A33","#8A4B2A","#1F2C44","#C8281E"],ledger:["#DCE3E6","#BEB698","#93A3AD","#0F4A32","#5F5D27","#1F2C44","#C8281E"]},ye={sharp:{q:[19,300,10,.45],f:[.3,.8,1.7,1]},swarm:{q:[19,190,12,.5],f:[.1,.5,1.3,1.2]},giant:{q:[19,300,10,.42],f:[.2,.45,1,.7]}},ge=[{levels:[],knots:[70,71,72,73]},{levels:[45,105,190],knots:[45,105,190,330]},{levels:[120],knots:[120,300,301,302]},{levels:[],knots:[110,111,112,113]}],te=[66,63,65,61,64,62],fe=9,De=1.6;async function ft(t,a={}){const r=t.rng.fork?t.rng.fork("written-range-hero"):t.rng,o=Math.min(1,Math.max(.6,a.detail??t.quality?.detail??1)),n=a.stock??r.pick(["cream","cream","buff","ledger"]),m=a.record??r.pick(["calm","calm","storm","spring"]),p=a.shock??r.pick(["sharp","sharp","swarm","giant"]),v=a.hour??"day",w=a.density??r.range(.7,1.3),f=qe[n]||a.palette||Le,s=Ye(f);!qe[n]&&f[3].toUpperCase()==="#5B2A8C"&&(s.uThread.value=ee("#B79BE0")),s.uFox.value=v==="night"?1:0,(v==="golden"||v==="night")&&(s.uPaper.value=s.uPaper.value.clone().lerp(s.uStraw.value,v==="night"?.36:.26)),s.uQuake.value.fromArray(ye[p].q),s.uQuakeF.value.fromArray(ye[p].f),r.chance(.5);const d=-1,g=Math.hypot(h.shortArm.py,h.shortArm.pz),L=Math.hypot(h.longArm.py,h.longArm.pz),M=[],k=r(),B=l=>d>0?l-67:78-l;for(let l=0;l<h.rows;l++){const u=Ee(l),c=me(l),b=u===1||u===2;let V=-1,P=0;if(u===1){const q=B(l);V=r.range(0,.25),P=(.72+.28*Math.sin((q+.5)/12*Math.PI))*r.range(.9,1.06);const D=Math.abs(c-(a.gapX??42));P*=D<10?1:D<24?.4:D<38?.62:D<52?.84:1}M.push({x:c,cls:u,row:[c,(l+.5)/h.rows,u,u===1?k-B(l)*1.2*ye[p].f[0]+r.range(-.05,.05):r()],row2:[V,P,b?L:g,b?h.longArm.py:h.shortArm.py],ink:u===0||u===3?1:c===49?2:0,lev:ge[u].knots})}await t.yield();const x=await je(t,r.fork?r.fork("record"):r,{storm:m==="storm",spring:m==="spring",oldGain:.85+.3*r(),blots:w});s.uRec.value=x.texture,await t.yield();const F=new e.Group;F.name="written-range-hero";const z=l=>M.map((u,c)=>u.cls===l?c:-1).filter(u=>u>=0),T=a.rows??"all",Q=at(s),E=Math.round(384*(o<.8?.5:1)),G=o<.8?2:1,i=[];i.push(le(ie([[E,G],[96,4],[96,8]],ge[1].levels),Q,z(1),M)),await t.yield(),i.push(le(ie([[E,G],[96,4],[96,8]]),Q,z(0),M)),T==="all"&&(i.push(le(ie([[128,4],[128,8]],ge[2].levels),Q,z(2),M)),await t.yield(),i.push(le(ie(o<.8?[[48,32]]:[[96,16]]),Q,z(3),M)));for(const l of i)F.add(l);await t.yield(),F.add(tt(s,[[E,G],[96,4],[96,8]],z(1).concat(z(0)),M)),await t.yield();const A=z(0).concat(z(1),T==="all"?z(2):[]),S=T==="all"?z(3):[],I=he(s,"arm"),O=he(s,"nib"),$=he(s,"static");for(const l of[I,O,$])l.side=e.DoubleSide;const H=(l,u)=>{const c=new e.Mesh(l,u);return c.frustumCulled=!1,F.add(c),c},ae=A.filter(l=>M[l].cls===0),be=A.filter(l=>M[l].cls!==0);H(X(de(6,!1,g),ae,M),I),await t.yield(),be.length&&H(X(de(32,!1,L),be,M),I),await t.yield(),H(X(Ge(!1),A,M),O),await t.yield(),S.length&&(H(X(de(4,!0,g),S,M),I),H(X(Ge(!0),S,M),O)),await t.yield();const N=h.x0-30,U=x.tideMax+7.2,W=2.4,pe=[ue(N,-N,h.shortArm.py,h.shortArm.pz,2.2,1.6,h.bulbLift),ue(N,-N,h.longArm.py,h.longArm.pz,9,4.6,h.bulbLift),xe(N,-N,h.longArm.pz),ue(-J,N,h.longArm.py,h.longArm.pz,9,4.6,h.bulbLift),ue(-N,J,h.longArm.py,h.longArm.pz,9,4.6,h.bulbLift),xe(-J,N,h.longArm.pz),xe(-N,J,h.longArm.pz),R(new e.BoxGeometry(82.5,.22,.16),0,C(-85.25,U+.02,W-.32)),R(new e.BoxGeometry(82.5,.22,.16),0,C(-85.25,U+.02,W+.32))];await t.yield();for(const l of[-126,-106,-86,-65,-44.5]){const u=new e.Vector3(l,h.shortArm.py+h.bulbLift+1.4,h.shortArm.pz),c=new e.Vector3(l,U,W),b=u.distanceTo(c),V=new e.CylinderGeometry(.11,.11,b,5,1,!0);V.applyQuaternion(new e.Quaternion().setFromUnitVectors(new e.Vector3(0,1,0),u.clone().sub(c).normalize())),V.translate((u.x+c.x)/2,(u.y+c.y)/2,(u.z+c.z)/2),pe.push(R(V,0)),pe.push(R(new e.BoxGeometry(.3,.3,.95),1,C(l,U+.1,W)))}await t.yield(),H(j(pe),$),await t.yield();const oe=he(s,"static");oe.side=e.DoubleSide;const ce=H(lt(),oe),we=H(j([R(new e.CylinderGeometry(.075,.075,1,6,1,!0),1,C(0,-.5,0)),R(new e.CylinderGeometry(.13,.05,.12,6,1,!1),1,C(0,-1,0))]),oe);if(ce.position.set(M[te[0]].x,U,W),await t.yield(),a.floor!==!1){const l=new e.PlaneGeometry(2200,1700,1,1);l.rotateX(-Math.PI/2),l.translate(0,0,750);const u=l.attributes.position,c=new Float32Array(u.count);for(let b=0;b<u.count;b++)c[b]=u.getZ(b);l.setAttribute("aS",new e.BufferAttribute(c,1)),H(l,ot(s))}let re=null,ke=!1;const se=(l,u,c)=>{const b=Math.min(1,Math.max(0,(c-l)/(u-l)));return b*b*(3-2*b)},He=(l,u,c)=>{const b=Math.min(u,Math.max(-u,l-c));return Math.sqrt(Math.max(u*u-b*b,0))-Math.sqrt(Math.max(u*u-c*c,0))},ze=(l,u)=>{const c=x.tide[l];if(!c)return 5;const b=(-u%4096+4096)%4096,V=Math.floor(b),P=b-V;return c[V&4095]*(1-P)+c[V+1&4095]*P},K=l=>te[(l%te.length+te.length)%te.length],Re=(l,u,c)=>{const b=u*fe,V=20*(c-(b-6)),P=c>b+De?20*(c-b-De):0,q=c>b-6&&c<b+12;l.set(M[K(u)].row[1],Math.max(V,0),P,q?1-se(b+9,b+12,c):0)};function Ae(l,u,c){const b=u*h.speed%h.recLen;s.uTime.value=u,s.uScroll.value=b;const V=re??12+u%40;s.uS.value=V;const P=re??u,q=Math.floor(P/fe),D=P-q*fe,Se=(q%2+2)%2===0;Re(Se?s.uStarveA.value:s.uStarveB.value,q,P),Re(Se?s.uStarveB.value:s.uStarveA.value,D<3?q-1:q+1,P);const Ce=M[K(q)].x,Oe=M[K(q+1)].x;ce.position.x=Ce+(Oe-Ce)*se(3,7.6,D);const Be=D<2.2?1:D<3?1-se(2.2,3,D):D>7.8?se(7.8,9,D):0,_e=D>5?K(q+1):K(q),Fe=ze(_e,b),$e=ce.position.x,Me=U-2.45,Te=W+.25,Ue=Fe+h.bulbLift+.92,We=He(70,g,h.shortArm.py)*Fe/70,Ie=Ue-Me,Ve=We-Te,Ze=Math.hypot(Ie,Ve);we.position.set($e,Me,Te),we.rotation.x=Math.atan2(-Ve,-Ie)*Be,we.scale.set(1,.35+(Ze-.35)*Be,1),oe.uniforms.uInstr.value.set(1,-1-.95*((P/(fe*6)%1+1)%1),0,0)}Ae(0,0,null);const y=(l,u,c)=>new e.Vector3(l,u,c),Ne={portalSeat:{position:y(168,88,-312),facing:y(0,-Math.SQRT1_2,-Math.SQRT1_2),radius:10,eyelet:10.6},drum:{z:-100,radius:300,centre:y(0,300,-100)},flyThrough:[y(-45.5,8.5,-16),y(-44,8.5,0),y(-42,10,60),y(-42,14,300),y(0,20,342),y(42,18,300),y(42,16,140),y(45.4,80,25),y(45.4,86,0),y(45,115,-84),y(42,139,-160),y(77,145,-191),y(118,146,-178),y(168,139,-248),y(168,130,-270),y(168,88,-312)],viewpoints:{entry:{eye:y(-45.5,8.5,-16),look:y(-20,40,600)},nibClose:{eye:y(-47.2,8.5,-6),look:y(-49,6.5,1)},broadside:{eye:y(20,20,335),look:y(190,90,330)},valleyHead:{eye:y(42,16,250),look:y(42,110,0)},insideRange:{eye:y(42,40,90),look:y(60,120,0)},nibPass:{eye:y(42,80,12),look:y(49,82,0)}},gapWest:y(-42,0,0),gapEast:y(42,0,0),redRow:y(49,0,0),entryNib:y(-49,ze(66,0),0),shortBeam:y(0,h.shortArm.py+h.bulbLift+1.2,h.shortArm.pz),longBeam:y(0,h.longArm.py+h.bulbLift+1.2,h.longArm.pz),carRail:y(-85.25,U,W)};return{object:F,radius:a.viewRadius??150,height:a.viewHeight??200,center:a.viewCenter??y(42,70,60),anchors:Ne,ground:!1,groundY:0,uniforms:s,rows:M,variation:{stock:n,record:m,shock:p,hour:v,density:w},tideMax:x.tideMax,setFlightSeconds(l){re=l},setProgress(l,u=44){re=l*u},setFlankCap(l,u=1,c=35,b=49){s.uCap.value.set(c,b,l,u),s.uEyeCap.value=l,ke||(s.uRankE.value.x=l,s.uRankE.value.z=l)},setRankLine(l,u,c,b){ke=!0,s.uRankE.value.set(l,u,c,b)},setBoxCap(l,u,c,b,V){s.uCapBox.value.set(l,u,c,b),s.uCapBoxH.value=V},update:Ae,dispose(){x.texture.dispose()}}}export{ge as LEVELS,C as M4,Z as STYLE_GLSL,h as WR,Le as WR_PALETTE,ft as buildHero,ie as curtainGeometry,at as curtainMaterial,le as curtainMesh,lt as inkCarGeometry,he as instrumentMaterial,Ye as makeStyleUniforms,tt as ribbonMesh,ot as sheetMaterial,ut as steelGap,R as toned};
