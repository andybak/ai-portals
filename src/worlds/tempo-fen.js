import*as a from"three";import{makePath as Ba,clamp as ge,lerp as U,smoothstep as r}from"../kit/core.js";import{buildHero as ra,GLSL_COMMON as ia}from"../parts/tempo-fen.js";const K=1175,la=K+5,io=K-25,vt=705,Qe=46,Ae=96,ee=256,Ye=46,ca=["#DCE6EA","#9FB4BE","#3E5560","#5A2A1C","#C9A04A","#F4E3B0","#1B2226"],re=n=>-40*r(60,320,n)*(1-r(330,640,n))+26*r(330,480,n)*(1-r(500,640,n)),Wa=n=>3-.8*r(40,75,n)*(1-r(110,150,n))+2*r(165,300,n)+46*r(318,468,n)*(1-r(540,664,n))-2*r(660,760,n)+4.5*r(900,1060,n),Wt=n=>U(4.7,8,r(930,1e3,n));function Ga(n,C){const O=Math.abs(n-re(C)),I=Wt(C),B=1-r(I,I+1.2,O),E=1-r(Qe-3,Qe+2,Math.hypot(n,(C-vt)*.62)),f=(1-r(38,44,Math.abs(n)))*(1-r(40,46,Math.abs(C-K))),u=1-r(.7,1.1,Math.hypot((n+9)/6,(C-40)/24)),v=1-r(.7,1.1,Math.hypot((n-dt)/7,(C-207)/20)),g=1-r(.7,1.1,Math.hypot((n-9.5)/6.5,(C-941)/13));return{chan:B,open:Math.max(B,E,f,u,v,g),d:O}}const dt=re(207)-9.5,fa=`
uniform sampler2D uTile;
uniform float uTear, uClear; uniform vec3 uTearCol;
uniform float uT, uTime, uU, uFront, uGust, uLull, uCross, uBeat, uSpacing, uFogK, uMist, uPxAng, uFrost, uSwingAmp;
uniform vec3 uCam, uFogCol, uMistCol, uBrass, uSteel, uFoot, uPadCol, uGlint, uGold; uniform vec3 uBand;
const float HZ = ${K.toFixed(1)}, LAGZ = ${vt.toFixed(1)}, LAGR = ${Qe.toFixed(1)};
float pathX(float z){ return -40. * smoothstep(60., 320., z) * (1. - smoothstep(330., 640., z)) + 26. * smoothstep(330., 480., z) * (1. - smoothstep(500., 640., z)); }
// x: channel only, y: any open water
vec2 openWater(vec2 p){
  float d = abs(p.x - pathX(p.y));
  float hw = mix(4.7, 8., smoothstep(930., 1000., p.y));
  float chan = 1. - smoothstep(hw, hw + 1.2, d);
  float lag = 1. - smoothstep(LAGR - 3., LAGR + 2., length(vec2(p.x, (p.y - LAGZ) * .62)));
  float bas = (1. - smoothstep(38., 44., abs(p.x))) * (1. - smoothstep(40., 46., abs(p.y - HZ)));
  float bay = 1. - smoothstep(.7, 1.1, length(vec2((p.x + 9.) / 6., (p.y - 40.) / 24.)));
  bay = max(bay, 1. - smoothstep(.7, 1.1, length(vec2((p.x - ${dt.toFixed(2)}) / 7., (p.y - 207.) / 20.))));
  bay = max(bay, 1. - smoothstep(.7, 1.1, length(vec2((p.x - 9.5) / 6.5, (p.y - 941.) / 13.))));
  return vec2(chan, max(max(chan, bay), max(lag, bas)));
}
// reed density 0..1 at a point of the fen: tussocks with leads between, big meres, islands in open water
float reedDens(vec2 p){
  vec2 ow = openWater(p);
  vec4 t = textureLod(uTile, p / ${Ae.toFixed(1)}, 0.);
  float mere = textureLod(uTile, p.yx / 1040. + .37, 0.).g;
  float lined = 1. - smoothstep(14., 28., abs(p.x - pathX(p.y)));           // the channel is always reed-lined
  float bed = t.r * max(smoothstep(.10, .20, mere), lined);
  float isl = t.r * step(.72, t.g) * (1. - ow.x);
  return mix(bed, isl, ow.y);
}
// how far the reeds at p are in step: the gust front, lulls drifting downwind, faint wind patches
float lockC(vec2 p){
  float front = uFront + 40. * (vn(p / 60.) * 2. - 1.);
  float G = uGust * smoothstep(0., 80., front - p.y);
  float L = uLull * smoothstep(.64, .88, vn((p - vec2(0., 12. * uTime)) / 105. + 5.3));
  float W = smoothstep(.62, .9, vn(p / 85. + vec2(3.7, -uTime * .04)));
  return clamp(G - .38 * L * G + .3 * W, 0., 1.);
}
// 1 where the gust has passed (the water there is ruffled dark, in step or not)
float gustAt(vec2 p){ return uGust * smoothstep(0., 80., uFront + 40. * (vn(p / 60.) * 2. - 1.) - p.y); }
// the moment the gust front passes a place: one eased pulse about a second long, travelling with the front
float gustPulse(vec2 p){
  float x = uFront + 40. * (vn(p / 60.) * 2. - 1.) - p.y;
  return uGust * smoothstep(0., 12., x) * (1. - smoothstep(16., 52., x));
}
// the common beat: wavy lines uSpacing apart racing downwind; the rare cross-gust sends a second set from port
float commonT(vec2 p, float h, float t){
  float c1 = sin(6.2832 * (t / uBeat - (p.y + 34. * (vn(p / 150.) * 2. - 1.) + 9. * sin(p.x / 41.)) / uSpacing));
  float c2 = sin(6.2832 * (t / uBeat + (p.x + 30. * (vn(p.yx / 200. + 9.) * 2. - 1.)) / uSpacing));
  return mix(c1, c2, uCross * step(.5, h));
}
float commonS(vec2 p, float h){ return commonT(p, h, uT); }
// swing of one wand, -1..1 (+ leans toward the sun at +X). a: rate hash, b: phase hash
float swingS(vec2 p, float a, float b, out float C){
  C = lockC(p);
  float own = sin(6.2832 * ((.58 - .16 * a) * uT + b));
  return mix(own, commonS(p, b), C);
}
float glintOf(float s){ return smoothstep(.82, .98, s); }
// a line of glitter rides the crest of the common beat, about a third of the spacing wide; its cat's-paw (dark
// ruffled water) runs a quarter of a spacing behind it
// (uBand = the beat's value at 20 m and at 8 m from the crest, so a line is the same width at every tempo)
float lineBand(float cs){ return smoothstep(mix(uBand.x, max(uBand.x, .68), uCross), mix(uBand.y, max(uBand.y, .97), uCross), cs); }
// largo's lines are 180 m apart: a fainter off-beat line runs halfway between them (uBand.z, 0 at other tempi)
float halfLine(vec2 p){
  float c = sin(6.2832 * 2. * (uT / uBeat - (p.y + 34. * (vn(p / 150.) * 2. - 1.) + 9. * sin(p.x / 41.)) / uSpacing) - 1.5708);   // crests on the lines and halfway between
  return uBand.z * smoothstep(.72, .96, c) * (1. - uCross) * (1. - smoothstep(.0, .5, commonS(p, 0.)));   // (only the off-beat crests)
}
// the tear of clear sky low to port (+X): 0..1 for a direction; the water mirrors it as a warm sheen
float tearAmt(vec3 d){
  float az = d.x / max(length(d.xz), 1e-4);
  return smoothstep(-.12, .42, az) * smoothstep(.012, .05, d.y) * (1. - smoothstep(.11, .27, d.y + .06 * (fbm(d.xz * 5. + uTime * .004) - .5)));
}
float lineAt(vec2 p){ return max(max(lineBand(commonS(p, 0.)), uCross * lineBand(commonS(p, 1.))), halfLine(p)); }
float pawAt(vec2 p){
  float t = uT - .22 * uBeat;
  return max(smoothstep(.50, .94, commonT(p, 0., t)), uCross * smoothstep(.50, .94, commonT(p, 1., t)));
}
// glitter as separate sparks: one per screen cell a few pixels across, each twinkling on its own slow beat
// (fc = gl_FragCoord.xy; k = share of the cells alight). Under one flash a second per spark, eased.
float sparkLayer(vec2 g, float k, float seed){
  vec2 ci = floor(g), cf = fract(g) - .5;
  float ha = h21(ci + seed), hb = h21(ci + 31.7 + seed);
  float tw = .5 + .5 * sin(uTime * (2.4 + 2.8 * ha) + hb * 6.2832);
  float lit = smoothstep(1. - k, 1.2 - k, tw * (.55 + .45 * hb));
  float r = .17 + .20 * ha;                                      // unequal sparks, each well inside its cell
  return lit * smoothstep(r, r * .3, length(cf - (vec2(hb, fract(ha * 7.3)) - .5) * (1. - 2. * r)));
}
float sparks(vec2 fc, float k){
  vec2 g = fc / max(.0078 / max(uPxAng, 1e-5), 2.6);             // two turned grids, so no rows or columns show
  return max(sparkLayer(vec2(.83 * g.x - .56 * g.y, .56 * g.x + .83 * g.y), k, 0.),
    sparkLayer(vec2(.47 * g.x + .88 * g.y, -.88 * g.x + .47 * g.y) * .58, k * .75, 5.));
}
// haze: exponential distance fog plus the ground mist lying in the reeds (thick below ~5 m)
vec3 fenFog(vec3 col, vec3 wp){
  vec3 dv = wp - uCam; float dist = length(dv);
  float f = 1. - exp(-dist * uFogK);
  float hy = max(.5 * (wp.y + uCam.y), 0.);
  float m = 1. - exp(-dist * uMist * exp(-hy / 3.2));
  col = mix(col, uMistCol, m * .92);
  return mix(col, uFogCol, f);
}
`;async function Ka(n,C){const I=Ae/16,B=new Float32Array(256),E=new Float32Array(256),f=new Float32Array(256);for(let h=0;h<256;h++)B[h]=C.range(.12,.88),E[h]=C.range(.12,.88),f[h]=C();const u=new Uint8Array(ee*ee*4);for(let h=0;h<ee;h++){const m=(h+.5)/ee*Ae,A=Math.floor(m/I);for(let W=0;W<ee;W++){const Z=(W+.5)/ee*Ae,y=Math.floor(Z/I);let b=1e9,z=1e9,G=0;for(let j=-1;j<=1;j++)for(let S=-1;S<=1;S++){const d=y+S,P=A+j,Q=(P+16)%16*16+(d+16)%16,N=(d+B[Q])*I-Z,be=(P+E[Q])*I-m,te=Math.sqrt(N*N+be*be);te<b?(z=b,b=te,G=f[Q]):te<z&&(z=te)}const c=.5+1.3*G,D=r(c*.5,c*.5+.9,z-b)*(G<.1?0:1),w=(h*ee+W)*4;u[w]=Math.round(D*255),u[w+1]=Math.round(G*255),u[w+2]=Math.round(ge(b/I,0,1)*255),u[w+3]=255}h%8===7&&await n.yield()}const v=new a.DataTexture(u,ee,ee,a.RGBAFormat,a.UnsignedByteType);v.wrapS=v.wrapT=a.RepeatWrapping,v.magFilter=v.minFilter=a.LinearFilter,v.generateMipmaps=!1,v.needsUpdate=!0;const g=(h,m,A)=>{const W=(Math.floor(h*ee)%ee+ee)%ee,Z=(Math.floor(m*ee)%ee+ee)%ee;return u[(Z*ee+W)*4+A]/255};return{tex:v,reedDens:(h,m)=>{const A=Ga(h,m),W=g(h/Ae,m/Ae,0),Z=g(h/Ae,m/Ae,1),y=g(m/1040+.37,h/1040+.37,1),b=W*Math.max(r(.1,.2,y),1-r(14,28,A.d)),z=W*(Z>=.72?1:0)*(1-A.chan);return U(b,z,A.open)},cellHash:(h,m)=>g(h/Ae,m/Ae,1)}}const Ea=`
varying vec3 vDir;
void main(){
  vDir = position;
  vec4 p = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.);
  if (abs(p.w) < 1e-4) p.w = 1e-4;
  gl_Position = p.xyww;
}`,Ra=`
varying vec3 vDir;
void main(){
  vec3 d = normalize(vDir + vec3(0., 1e-5, 0.));
  vec3 c = skyCol(d, uClear * .5);
  float az = d.x / max(length(d.xz), 1e-4), ov = 1. - .6 * uClear;
  // a light side and a dark side: brighter toward the sun to port, slate low to starboard and behind the Maelzel
  c *= 1. + (.22 * az - .07) * (1. - d.y) * ov;
  c = mix(c, uSlate * 1.02, (1. - smoothstep(.04, .26, d.y)) * (1. - smoothstep(-.55, .30, az)) * .46 * (1. - uClear));
  c = mix(c, uHor * .80, smoothstep(.972, .999, d.z / max(length(d.xz), 1e-4)) * (1. - smoothstep(.03, .24, d.y)) * .32 * (1. - uClear));   // a paler slot straight downwind: the Maelzel stands against it
  // long bars of overcast converging downwind, toward the Maelzel, with finer drift across them
  vec2 sp = d.xz / (abs(d.y) + .16);
  float st = fbm(vec2(sp.x * 2.2 + 2.2 * vn(sp * .30) + .8 * vn(sp * 1.1 + 5.), sp.y * .42) + vec2(3., uTime * .004));
  float st2 = fbm(vec2(sp.x * 6.1, sp.y * .75) + vec2(11., uTime * .006));
  float cl = fbm(d.xz / (abs(d.y) + .3) * 1.7 + vec2(0., uTime * .006));
  c *= 1. + ((smoothstep(.30, .72, st) - .5) * .30 + (st2 - .5) * .12 + (cl - .5) * .20) * smoothstep(.0, .14, d.y) * ov;
  // the tear: a long low lens of clear pale warm sky to port
  vec3 tc = mix(uTearCol * vec3(1.05, 1.04, 1.02), uTearCol * vec3(.98, .84, .70), smoothstep(.04, .22, d.y));   // pale at the horizon, peach-gold above
  c = mix(c, tc, tearAmt(d) * uTear * (1. - .55 * smoothstep(.42, .74, st) * smoothstep(.06, .16, d.y)) * (.86 + .14 * st2));   // bars of overcast cross it
  // low gold light spilling out of the tear: warm haze round it and along the undersides of the overcast to port
  c += uGold * (.13 * smoothstep(-.45, .75, az) * (1. - smoothstep(.05, .62, d.y)) + .05 * smoothstep(.2, .9, az)) * smoothstep(-.01, .03, d.y);
  // frosty dawn: a rose band above the horizon opposite and under the sun
  c = mix(c, c * vec3(1.16, .98, .93), uClear * (1. - smoothstep(.02, .34, abs(d.y - .04))));
  gl_FragColor = vec4(mix(c, uFogCol, (1. - smoothstep(-.01, .10, d.y)) * .85 * step(-.02, d.y) * (1. - .7 * tearAmt(d) * uTear)), 1.);
}`,La=`
varying vec3 vW;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,Va=`
uniform vec3 uPeat; uniform float uMirrorZone, uLoom;
varying vec3 vW;
float hgt(vec2 p){ return vn(p * 1.9 + vec2(.0, -uTime * .9)) + .6 * vn(p * 4.3 + vec2(uTime * .7, uTime * .4)); }
void main(){
  vec2 p = vW.xz;
  vec3 Vv = uCam - vW; float dist = max(length(Vv), .01); vec3 V = Vv / dist;
  float C = lockC(p);
  float cs = commonS(p, 0.), cs2 = commonS(p, 1.);
  float gp = gustPulse(p);
  float band = lineAt(p), paw = pawAt(p) * (1. - band);
  float ruffle = max(C * paw, gp * .9);
  // two scrolling ripple layers, flattened with distance; ruffled under each line of glitter (cat's-paws)
  float amp = (.035 + .11 * ruffle) / (1. + dist * .02);
  float h0 = hgt(p), hx = hgt(p + vec2(.12, 0.)), hz = hgt(p + vec2(0., .12));
  vec3 n = normalize(vec3((h0 - hx) * amp * 8., 1., (h0 - hz) * amp * 8.));
  vec3 R = reflect(-V, n); R.y = abs(R.y) + .002; R = normalize(R);
  vec3 sky = skyCol(R, .12 + .4 * ruffle) * 1.12;
  float tear = tearAmt(R) * uTear;
  sky = mix(sky, uTearCol * 1.04, tear * .85);                     // the tear's warm sheen on the water to port
  // (p2) the dome's long bars of overcast, mirrored: the first bar term of SKY_FRAG (its st) on R in place of d, with
  // live's uTime drift and at the dome's own strength, so the water is lighter where the dome is lighter and darker
  // where it is darker. One law on all water. No broad water is lifted above the horizon's 0.84 (the brief: 'Pale values
  // clip: horizon at 0.84'): a bar may raise a channel to 0.84 and no further; where live's own value already stood over
  // that, live's stands and a bar can only darken it
  vec2 barP = R.xz / (abs(R.y) + .16);
  float barS = fbm(vec2(barP.x * 2.2 + 2.2 * vn(barP * .30) + .8 * vn(barP * 1.1 + 5.), barP.y * .42) + vec2(3., uTime * .004));
  float barM = (smoothstep(.30, .72, barS) - .5) * .30 * smoothstep(.0, .14, R.y) * (1. - .6 * uClear);
  sky = min(sky * (1. + barM), max(sky, vec3(.84)));
  float fr = .34 + .66 * pow(1. - clamp(V.y, 0., 1.), 3.);
  vec3 col = mix(uPeat, sky, fr);
  col = mix(col, col * vec3(.60, .68, .74), ruffle * .75);
  col *= mix(1., .70, smoothstep(60., 300., dist));
  // skim ice (frosty dawn): matte pale plates with dark cracks, broken where the reeds tick
  vec4 tl = textureLod(uTile, p / 47. + .21, 0.);
  float crack = smoothstep(.0, .18, tl.r) * (1. - smoothstep(.18, .46, tl.r)) * .55;   // hairline cracks either side of a refrozen lead, not mortar
  vec3 iceCol = mix(uZen, uHor, .35) * (.50 + .16 * tl.g) * mix(.9, 1., smoothstep(.0, .3, tl.r)) + sky * .22;
  float dens = reedDens(p);
  col = mix(col, mix(iceCol, uPeat * 2.2, crack * .8), uFrost * .78 * (1. - .7 * dens));
  // the reed bed: under the stems the water is slate; far off it becomes a combed, breathing nap sown with sparks
  float far = smoothstep(30., 95., dist);
  float comb = .82 + .18 * vn(vec2(p.x * 2.6, p.y * .35));
  vec3 nap = uSlate * (.40 + .20 * comb) * (1. + .16 * cs * C) * (1. + .32 * C * far * (1. - paw)) + uFogCol * .03;   // in step, the plain fen between lines is a step lighter than the cat's-paws
  nap = mix(nap, uZen * .5, uFrost * .25);
  nap += uTearCol * .07 * tear;
  col = mix(col, nap, dens * mix(.74, .9, far));
  // once the fen is in step the open water is ruffled slate, so no mere outshines a line; each cat's-paw is darker still
  float farW = smoothstep(40., 150., dist);
  col = mix(col, col * vec3(.50, .57, .64), max(C, .9 * gustAt(p)) * (1. - dens) * farW * .85);
  // (p2) the cat's-paw: under its own line of glitter (live's paw once the reeds are in step, C * paw) open water is a step
  // darker than live's, and never darker than the dark comb of the reed nap beside it (the nap at comb .82, uSlate *
  // (.40 + .20 * .82), lit in step, frosted and warmed by the tear as the nap is); where live's own water is already
  // under that it stays live's. The water between the lines (paw 0) and the reed bed (dens 1) are live's
  vec3 combDark = uSlate * .564 * (1. + .16 * cs * C) + uFogCol * .03;
  combDark = mix(combDark, uZen * .5, uFrost * .25) + uTearCol * .07 * tear;
  col = mix(col, max(col * vec3(.77, .79, .84), min(col, combDark)), C * paw * (1. - dens) * .75);
  col *= 1. - .64 * (1. - .35 * uCross) * C * paw * far;
  // glitter. Near: one spark per 1.3 m cell with its own beat. Far: the lines themselves, as bands of separate
  // sparks carried across reeds and open water alike (sun-glitter on the ruffle), faded to a steady sheen where
  // the lines would fall only a few pixels apart
  float cell = 1.3; vec2 ci = floor(p / cell), cf = fract(p / cell) - .5;
  float ha = h21(ci), hb = h21(ci + 17.3);
  float own = sin(6.2832 * ((.58 - .16 * ha) * uT + hb));
  float s = mix(own, mix(cs, cs2, step(.5, hb)), C);
  float pxm = dist * uPxAng / max(V.y, .03);                      // metres of water per pixel (along the view)
  float dotm = (1. - smoothstep(.12, .42, length(cf - (vec2(ha, hb) - .5) * .5)));
  float gNear = max(glintOf(s), .75 * gp) * dotm * 2.6 * dens;
  float lineW = uSpacing / max(pxm, 1e-3);                         // pixels between lines
  float lf = smoothstep(2.5, 7., lineW);
  float spk = sparks(gl_FragCoord.xy, .62), spk2 = sparks(gl_FragCoord.xy + 91., .16);
  float lineG = C * mix(.5 * band * mix(.55, 1., dens), mix(2.1, 1., dens) * sparks(gl_FragCoord.xy, .06 + .62 * band) * 1.7 * smoothstep(0., .2, band) + .34 * band, lf);
  float loose = (1. - C) * dens * spk2 * 1.3 + .04 * dens;        // out of step: brass sparks at random
  float gFar = lineG + loose + gp * (spk * 1.6 + .25);
  float nearK = (1. - smoothstep(.5, 1.4, pxm / cell)) * (1. - smoothstep(30., 75., dist));
  float gg = mix(gFar, gNear + gFar * .3, nearK) * far;
  float goldPath = tear * (sparks(gl_FragCoord.xy + 37., .34) * 1.1 + .12) * (1. - .75 * dens) * smoothstep(8., 30., dist);
  vec3 outc = fenFog(col, vW) + (uGlint * gg + uGold * goldPath) * exp(-dist * (uFogK * .45 + uMist * .05));
  // the Maelzel's mirror image shows through the water: on the approach, and from the first frame wherever this bit of
  // water mirrors the Maelzel as seen from here (similar triangles: the height and the offset on the Maelzel it reflects)
  float dp = max(p.y - uCam.z, 1.), hm = uCam.y * max(HZ - p.y, 0.) / dp, xm = uCam.x + (p.x - uCam.x) * (HZ - uCam.z) / dp;
  float mir2 = (1. - smoothstep(150. * uLoom, 185. * uLoom, hm)) * (1. - smoothstep(42. * uLoom, 70. * uLoom, abs(xm))) * smoothstep(8., 30., p.y - uCam.z);
  float a = 1. - uMirrorZone * max(.5 * (1. - smoothstep(48., 80., abs(p.x))) * smoothstep(HZ - 760., HZ - 520., p.y), .62 * mir2) * (1. - dens * .7);
  gl_FragColor = vec4(outc, a);
}`,ha=`
attribute vec3 aPA; attribute vec4 aI; attribute float aJ;
vec3 reedPos(vec3 pos, float sw, out float s, out float C, out float th){
  vec2 base = aI.xy; float H = aI.z, bf = .55 + .30 * aI.w;
  s = swingS(base, aI.w, aJ, C);
  th = (s * radians(22. + 8. * C) * (1. - .5 * gustPulse(base)) + radians(27.) * gustPulse(base)) * uSwingAmp * sw;
  vec3 p = pos;
  if (aPA.y > .5 && aPA.y < 1.5) p.y = .25 + pos.y * (H - .25);
  else if (aPA.y > 1.5 && aPA.y < 2.5) p.y += .25 + bf * (H - .25);
  else if (aPA.y > 2.5 && aPA.y < 3.5) p.y += H;
  else if (aPA.y > 3.5) { p.y = .02 + pos.y * H * .62; th = (aPA.x - .5) * .9 + s * .06 + .34 * gustPulse(base); }
  return p;
}
vec3 rotZ(vec3 p, float th){ float c = cos(th), sn = sin(th); float y = p.y - .25; return vec3(p.x * c + y * sn, .25 - p.x * sn + y * c, p.z); }
`,Na=`
${ha}
varying vec3 vW, vN; varying vec2 vUv; varying float vMat, vG;
void main(){
  float s, C, th; float sw = aPA.x > .99 ? 1. : 0.;
  vec3 p = reedPos(position, sw, s, C, th);
  vec3 root = vec3(aI.x, 1.5, aI.y);
  float dist = length(root - uCam);
  if (aPA.z > .5 && aPA.z < 1.5) p.x *= max(.016, .8 * dist * uPxAng);      // the wand never thinner than ~1.5 px
  vUv = vec2(position.x, p.y);
  p = rotZ(p, th);
  vec3 n = normalize(rotZ(normal + vec3(0., .25, 0.), th) - vec3(0., .25, 0.) + vec3(0., 1e-4, 0.));
  vW = vec3(aI.x + p.x, p.y, aI.y + p.z); vN = n; vMat = aPA.z; vG = max(glintOf(s), gustPulse(aI.xy));
  gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.);
}`,_a=`
varying vec3 vW, vN; varying vec2 vUv; varying float vMat, vG;
void main(){
  vec3 N = normalize(vN); vec3 V = normalize(uCam - vW);
  if (!gl_FrontFacing) N = -N;
  float key = max(dot(N, uSunDir), 0.), wrap = .5 + .5 * dot(N, uSunDir);
  vec3 fill = mix(uSlate * .55, uZen * .8, .5 + .5 * N.y);
  vec3 col;
  if (vMat < .5) {                                        // the foot: wood pyramid with a brass edge
    col = uFoot * (fill * 1.3 + uSunCol * key * 1.1);
    col = mix(col, uBrass * (.25 + .9 * wrap), step(vUv.y, .045));
  } else if (vMat < 1.5) {                                // steel wand: one thin sky line, a notched tempo scale
    float line = (1. - smoothstep(.0, .35, abs(vUv.x + .3)));
    float notch = step(.2, vUv.x) * step(fract(vUv.y / .11), .4);
    col = uSteel * (.10 + .30 * wrap) + (uHor * .16 + uGold * .62) * line;
    col *= 1. - .6 * notch;
    col = mix(col, vec3(.74, .80, .84), uFrost * (.04 + .40 * line));
  } else if (vMat < 2.5) {                                // brass bob: satin, one facet cut to flash at the sun
    vec3 R = reflect(-V, N);
    col = uBrass * (.16 + .55 * wrap + .5 * skyCol(R, .5));
    col += uGlint * 3.8 * vG * smoothstep(.35, .8, N.x);
    col = mix(col, vec3(.7, .76, .8), uFrost * .25 * (1. - vG));
  } else if (vMat < 3.5) {                                // the wedge weight at the tip, like a seed head
    col = uSteel * vec3(.42, .5, .62) * (.35 + .8 * wrap) + uGold * .22;
  } else {                                                // blank blades
    col = mix(uSlate * .34, uSteel * .40, wrap) * (.6 + .5 * smoothstep(0., 2., vW.y));
    col += uGold * .20 * smoothstep(.8, 2.4, vW.y);
    col = mix(col, vec3(.7, .76, .8), uFrost * .18);
  }
  gl_FragColor = vec4(fenFog(col, vW), 1.);
}`,qa=`
${ha}
varying vec2 vUv; varying vec4 vK; varying vec3 vW;
void main(){
  float s, C, th; vec2 base = aI.xy; float H = aI.z, bf = .55 + .30 * aI.w;
  s = swingS(base, aI.w, aJ, C);
  th = (s * radians(22. + 8. * C) * (1. - .5 * gustPulse(base)) + radians(27.) * gustPulse(base)) * uSwingAmp;
  float dist = length(vec3(aI.x, 1.5, aI.y) - uCam);
  vec3 w; vUv = position.xy; vK = vec4(aPA.z, 0., 0., 0.);
  if (aPA.z < 4.5) {                                      // 4: ripple ring on the water, born at each tick
    float lo = uT - .06, own0 = sin(6.2832 * ((.58 - .16 * aI.w) * lo + aJ));
    float sPrev = mix(own0, commonT(base, aJ, lo), C);
    float fall = step(abs(s), abs(sPrev));                 // |s| shrinking: the tick has just happened
    float age = 1. - abs(s);
    float rad = mix(.12, .95, age) * (.7 + .5 * aI.w);
    w = vec3(aI.x + position.x * rad * 1.25, .012, aI.y + position.y * rad * 1.25);
    vK.y = rad; vK.z = (1. - age) * sqrt(max(age, 0.)) * 2.6 * fall * (1. - smoothstep(12., 60., dist));
  } else if (aPA.z < 5.5) {                               // 5: glint star, camera-facing, never under 1.5 px
    vec3 c = rotZ(vec3(0., .25 + bf * (H - .25), 0.), th) + vec3(aI.x, 0., aI.y);
    float g = max(glintOf(s), gustPulse(base)), sz0 = .16, sz = max(sz0, 1.8 * dist * uPxAng);
    vec3 cr = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), cu = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
    w = c + (cr * position.x + cu * position.y) * sz * (.5 + .8 * g);
    vK.z = g * (sz0 * sz0) / (sz * sz);
  } else {                                                // 6: the wand mirrored in the water
    vec3 p = vec3(position.x * max(.014, .9 * dist * uPxAng), .25 + position.y * (H - .25), 0.);
    p = rotZ(p, th); p.y = -p.y;
    p.x += sin(p.y * 5. + uTime * 2.6 + aJ * 20.) * .035 * (-p.y);
    w = vec3(aI.x + p.x, p.y * .96, aI.y + p.z); vK.z = .55 * (1. - .25 * position.y);
  }
  vW = w;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
  if (aPA.z > 5.5) gl_Position.z -= .0005 * gl_Position.w;
}`,Ua=`
varying vec2 vUv; varying vec4 vK; varying vec3 vW;
void main(){
  vec3 dv = vW - uCam; float f = exp(-length(dv) * uFogK);
  if (vK.x < 4.5) {
    float r = length(vUv) * 1.25, ring = (1. - smoothstep(.0, .09, abs(r - vK.y) / max(vK.y, .05) * .35)) ;
    float a = ring * vK.z * f * step(r, 1.24);
    gl_FragColor = vec4(mix(uHor, uSunCol, .3) * a * .55, a * .25);
  } else if (vK.x < 5.5) {
    float r = length(vUv), core = (1. - smoothstep(0., 1., r)); core *= core;
    float star = max(0., 1. - abs(vUv.x) * 9.) * max(0., 1. - abs(vUv.y)) + max(0., 1. - abs(vUv.y) * 9.) * max(0., 1. - abs(vUv.x));
    gl_FragColor = vec4(mix(uGlint, uSunCol, .3) * (core * 3.2 + star * 1.6) * vK.z * f, 0.);
  } else {
    float a = vK.z * f * (1. - smoothstep(.5, 1., abs(vUv.x)));
    gl_FragColor = vec4(uSlate * .45 * a, a);
  }
}`,$e=4.6,ja=`
attribute vec4 aI;
varying vec2 vQ; varying vec4 vI; varying vec3 vW; varying vec3 vS; varying float vP; varying vec3 vL;
void main(){
  float H = aI.z + .5;
  vQ = vec2(position.x * ${($e/2+1.6).toFixed(2)}, position.y * H);
  vW = vec3(aI.x + vQ.x, vQ.y, aI.y);
  vI = aI;
  float C = lockC(aI.xy);
  float dist = length(vec3(aI.x, 2., aI.y) - uCam);
  vS = vec3(C, dist * uPxAng, exp(-dist * uFogK));
  vP = gustPulse(aI.xy);
  float bnd = lineAt(aI.xy);
  float farK = smoothstep(30., 95., dist);
  vL = vec3(bnd * C * farK, pawAt(aI.xy) * (1. - bnd) * C * farK, farK);
  gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.);
}`,Ha=`
varying vec2 vQ; varying vec4 vI; varying vec3 vW; varying vec3 vS; varying float vP; varying vec3 vL;
void main(){
  float C = vS.x, px = max(vS.y, 1e-4);
  float mir = step(vQ.y, 0.);
  vec2 q = vec2(vQ.x, abs(vQ.y));
  q.x += mir * (sin(q.y * 4. + uTime * 2.3 + vI.w * 30.) * .07 + sin(q.y * 9.5 - uTime * 3.1 + vQ.x * 2.) * .035) * q.y;
  float cov = 0., bob = 0., glint = 0., tipc = 0.;
  float hw = max(.016, .62 * px), thin = clamp(.016 / (.62 * px), .0, 1.);
  float br = max(.075, .9 * px), gr = max(.16, 1.7 * px);
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    float ha = fract(vI.w * 7.13 + fi * .618), hb = fract(vI.w * 3.71 + fi * .377 + ha * 5.);
    vec2 foot = vec2((fi + .2 + .6 * ha - 3.) * ${($e/6).toFixed(3)}, .22);
    float H = (vI.z - .22) * (.55 + .45 * hb);
    vec2 wp = vI.xy + vec2(foot.x, (ha - .5) * 3.);
    float own = sin(6.2832 * ((.58 - .16 * ha) * uT + hb));
    float s = mix(own, commonS(wp, hb), C);
    float th = (s * radians(22. + 8. * C) * (1. - .5 * vP) + radians(27.) * vP) * uSwingAmp;
    vec2 dir = vec2(sin(th), cos(th));
    vec2 d = q - foot; float t = clamp(dot(d, dir), 0., H);
    float dl = length(d - dir * t);
    cov = max(cov, smoothstep(hw + px * .6, hw - px * .4, dl));
    vec2 bc = foot + dir * H * (.55 + .30 * ha);
    float db = length(q - bc);
    bob = max(bob, smoothstep(br + px * .5, br - px * .5, db));
    float g = max(glintOf(s), vP), fall = max(1. - db / gr, 0.);
    glint += g * fall * fall * (.16 * .16) / (gr * gr);
    tipc = max(tipc, smoothstep(.09 + px, .09 - px, length(q - foot - dir * H)));
    cov = max(cov, smoothstep(.13 + px, .13 - px, abs(d.x) + max(d.y, 0.) * .6 + max(-d.y, 0.) * 9.) * step(-.2, d.y));
  }
  // the sedge: three ranks of blank blades under a ragged dome (tallest in the middle, single blades at both ends),
  // rear ranks standing higher on the card and darker, the front rank a step lighter and broken by slots of water
  float xn = vQ.x / ${($e/2+1.6).toFixed(2)};
  float dome = sqrt(max(1. - xn * xn, 0.)) * (1. - smoothstep(.82, 1., abs(xn)));
  float rag = .50 + .85 * vn(vec2(vQ.x * .8 + vI.w * 40., vI.w * 9.)) * (.7 + .6 * vn(vec2(vQ.x * 2.7 + vI.w * 71., 3.)));
  float env = vI.z * .64 * dome * rag;
  float slot = smoothstep(.56, .70, vn(vec2(vQ.x * 1.5 + vI.w * 23., 7.)));
  float wl = .34 * vn(vec2(vQ.x * .9 + vI.w * 5., 2.)) + .14 * vn(vec2(vQ.x * 3.3 + vI.w * 15., 4.)) - .08;   // a waterline that wanders
  float sedge = 0., sh = .6;
  for (int j = 0; j < 3; j++) {
    float fj = float(j), fr = 3.6 + 2.6 * fj;
    float xx = (q.x + vI.w * 17. + fj * 3.3) * fr;
    float bi = floor(xx), bf = fract(xx) - .5, hh = h21(vec2(bi, vI.w * 51. + fj));
    float y0 = ((2. - fj) * .13 + .10 * h21(vec2(bi + 3., vI.w * 29. + fj)) + wl) * (1. - .8 * mir) + slot * (fj > 1.5 ? 9. : .16 * fj);
    float bh = env * (.28 + .72 * hh) * (1. - .16 * fj), yy = q.y - y0;
    float t = yy / max(bh, .05);
    float lean = (h21(vec2(bi + 7., vI.w * 13. + fj)) - .5) * .8;
    float wdt = .44 * (1. - t), pxb = px * fr * 1.2;
    float b = smoothstep(wdt + pxb, wdt - pxb, abs(bf - lean * t)) * step(0., yy) * step(yy, bh);
    // where the blades fall under a pixel: the share of blades taller than this height, so the top stays ragged and soft
    float bfar = (1. - smoothstep(.22, 1., yy / max(env * (1. - .16 * fj), .05))) * step(0., yy) * .85;
    b = mix(b, bfar, smoothstep(.22, .55, pxb));
    sh = mix(sh, .62 + .30 * fj + .25 * (hh - .5), b);
    sedge = max(sedge, b);
  }
  bob *= clamp(.075 / (.9 * px), 0., 1.);
  float lit = .5 + .5 * smoothstep(0., 3., q.y);
  vec3 dark = mix(uSlate * .34, uSteel * .42, .30 * lit);
  dark = mix(dark, vec3(.62, .69, .74), uFrost * (.04 + .22 * smoothstep(1.2, 3.5, q.y)));
  dark *= (1. - .60 * (1. - .35 * uCross) * vL.y) * (1. + .28 * vS.x * vL.z * (1. - vL.y));   // under a cat's-paw the bed is darker; the plain fen between lines a step lighter
  vec3 col = mix(dark * sh, dark * 1.1, cov);
  col += uGold * (.17 * smoothstep(.45, 1., q.y / max(env, .3)) * (1. - cov) + .20 * cov * smoothstep(.8, 2.6, q.y)) * (1. - .6 * mir) * (1. - .85 * smoothstep(9., 30., uCam.y));   // (from above the bed stays slate, so the lines carry)
  col = mix(col, uBrass * .5, bob);
  // the reflection wobbles and fades out downward
  float mirA = mix(1., .55 * (1. - smoothstep(.15, 1., q.y / max(env * 1.5 + .5, .3))), mir);
  float a = max(max(cov * mix(.7, 1., thin), sedge * .96), bob) * mirA;
  a = max(a, tipc * (1. - mir));
  vec3 fogged = fenFog(col, vec3(vW.x, abs(vW.y), vW.z));
  float gf = vS.z * mix(1., .35, mir);
  // the line of glitter crossing this clump: sparks at bob height over the whole crown, so a line holds from above
  float crown = smoothstep(.30, .62, q.y / max(vI.z, .5)) * (1. - smoothstep(.80, 1.05, q.y / max(vI.z, .5)))
    * smoothstep(${($e/2+1.5).toFixed(2)}, ${($e/2-.3).toFixed(2)}, abs(vQ.x)) * (1. - mir);
  float lk = max(vL.x, vP * vL.z);                                 // a line of glitter, or the gust's own bar of glints as it passes
  float lineG = (crown * (sparks(gl_FragCoord.xy, .06 + .62 * lk) * 1.6 * smoothstep(0., .2, lk) + .2 * lk) + .26 * vL.x * a * (1. - mir))
    * exp(-vS.y / max(uPxAng, 1e-6) * (uFogK * .45 + uMist * .05));
  gl_FragColor = vec4(fogged * a + mix(uGlint, uSunCol, .3) * 3.4 * min(glint, 1.5) * gf + uGlint * lineG, a);
}`,ua=`
attribute vec4 aI; attribute vec3 aK;        // aI = (x, z, radius, hash); aK = (petal 0/1, tip 0/1, petal angle)
uniform float uBloomAll;
varying vec3 vW, vN; varying vec2 vUv; varying float vPetal;
void main(){
  vec2 base = aI.xy; float h = aI.w;
  float C = lockC(base), cs = commonS(base, h);
  vec3 p = position * aI.z; vec3 n = vec3(0., 1., 0.);
  float open = max(uBloomAll, C * smoothstep(-.3, .7, cs));
  if (aK.x > .5) {                          // a petal: hinge at the centre, 82 degrees up when shut, 24 when open
    float up = radians(mix(82., 24., open)), r = aK.y * .42 * aI.z, yaw = aK.z;
    float side = position.x;                // -1, 0, 1 across the petal
    vec3 out2 = vec3(cos(yaw), 0., sin(yaw)), tng = vec3(-sin(yaw), 0., cos(yaw));
    p = out2 * (r * cos(up) + .05) + vec3(0., r * sin(up) + .03, 0.) + tng * side * .09 * aI.z * (1. - aK.y * .8);
    n = normalize(out2 * -sin(up) + vec3(0., cos(up), 0.) + vec3(0., .3, 0.));
  }
#ifdef P2
  // (p2) a pad of the new rafts is turned about its centre by an angle from its own hash (live's notch always faces +X)
  if (aK.x < .5) { float tu = 6.2832 * h; p.xz = mat2(cos(tu), sin(tu), -sin(tu), cos(tu)) * p.xz; }
#endif
  float rock = sin(uTime * (1.1 + h) + h * 40.) * .05 + .05 * sin(uTime * 2.3 + base.x) * C;
  p.y += p.x * rock + p.z * rock * .6 + .035;
  vUv = position.xz; vPetal = aK.x;
  vW = vec3(base.x + p.x, p.y, base.y + p.z); vN = n;
  gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.);
}`,va=`
varying vec3 vW, vN; varying vec2 vUv; varying float vPetal;
void main(){
  vec3 N = normalize(vN);
  float key = max(dot(N, uSunDir), 0.) * 1.6 + .25;
  vec3 col;
  if (vPetal > .5) col = vec3(.90, .84, .66) * (.45 + .5 * key) + uSunCol * .12;
  else {
    float r = length(vUv), ang = atan(vUv.y, vUv.x + 1e-5);
    float vein = smoothstep(.75, 1., abs(sin(ang * 5.))) * smoothstep(.1, .6, r);
    col = uPadCol * (.70 + .50 * key) * (1. - .22 * vein) * (.82 + .3 * r);
    col += uHor * .10 * pow(1. - max(normalize(uCam - vW).y, 0.), 3.);
    col = mix(col, vec3(.72, .78, .8), uFrost * .45 * smoothstep(.5, 1., r));
  }
#ifdef P2
  if (vPetal > .5) col = min(col, vec3(.98));   // (p2) a new bud's petal stops under white
#endif
  gl_FragColor = vec4(fenFog(col, vW), 1.);
}`,Oa=`
attribute vec3 aP, iC; attribute vec4 iA, iB, aAx, aBx; attribute float aTone;
varying vec3 vW; varying float vTone;
vec3 rx(vec3 p, vec3 o, float a){ float c = cos(a), s = sin(a); vec3 d = p - o; return o + vec3(d.x, d.y * c - d.z * s, d.y * s + d.z * c); }
vec3 rzz(vec3 p, vec3 o, float a){ float c = cos(a), s = sin(a); vec3 d = p - o; return o + vec3(d.x * c - d.y * s, d.x * s + d.y * c, d.z); }
void main(){
  vec3 hub = vec3(0., 1.15, 0.), p = position;
  float sc = max(iC.z, .1);
  // no strut or slat ever thinner than ~2.6 pixels either way: a heron is a solid, lit object at any range
  float mw = 1.3 * length(iA.xyz + vec3(0., 1.5 * sc, 0.) - uCam) * uPxAng / sc;
  mw *= mix(1., .55, step(.5, aTone));                             // (nickel fittings stay small: bright points, not blobs)
  p += aAx.xyz * (max(1., mw / max(aAx.w, 1e-3)) - 1.) + aBx.xyz * (max(1., mw / max(aBx.w, 1e-3)) - 1.);
  float part = aP.x, fl = iB.w, open = iB.z;
  vec3 nd = vec3(0., .96, .28), dors = vec3(0., .28, -.96);    // the shaft's axis, and the back of the bird once it leans into flight
  if (part > .5 && part < 2.5) {
    float sgn = part < 1.5 ? 1. : -1.;
    float lift = max(sgn * cos(iB.x), 0.) * (1. - fl);
    if (aP.z > .5) p = rx(p, vec3(sgn * .17, .62, -.20), .55 * lift + .85 * fl);   // the knee folds as the foot lifts; in flight the leg trails straight
    p = rx(p, hub, sgn * .40 * sin(iB.x) * (1. - fl));
  } else if (part > 2.5 && part < 3.5) {
    p = rx(p, hub, .10 * sin(iB.x * 2.) * (1. - fl) - fl * .95);
  } else if (part > 4.5 && part < 6.5) {
    p += nd * .55 * iB.y;
  } else if (part > 6.5) {
    // a slat: modelled along +Y from the origin, hinged at the shoulders. Folded, the nine lie back along the body as a
    // wedge of folded wings; opened, they fan out behind the neck; flying, they are two wings of four with the ninth as the tail
    float k = aP.y / 4.;
    vec3 sh = hub + nd * .42;
    float ph = radians(20. + 3.6 * aP.y);
    vec3 fd = vec3(0., -sin(ph), -cos(ph)), fu = vec3(0., cos(ph), -sin(ph));
    vec3 F = sh + vec3(aP.y * .028 + p.z, .03, -.09) + fd * (p.y * .68) + fu * p.x;
    vec3 q = rzz(p, vec3(0.), -k * radians(78.));
    q = rx(q, vec3(0.), radians(-10.));
    q += sh + vec3(0., .02, -.07 - .004 * aP.y);
    // each wing: four slats side by side like a blind, swept back a little and splayed toward the tip, the rear ones shorter
    float sd = sign(aP.y), j = abs(aP.y);
    float sw = radians(8. + 6. * (j - 1.)), fa = .24 + .62 * sin(iC.x - .18 * j), len = 1. - .09 * (j - 1.);
    vec3 lat = vec3(sd * cos(fa), 0., 0.) + dors * sin(fa);
    vec3 dir = lat * cos(sw) - nd * sin(sw), wd = nd * cos(sw) + lat * sin(sw), nr = cross(dir, wd);
    vec3 root = sh + nd * (.22 - .125 * (j - 1.)) + vec3(sd * .07, 0., 0.);
    if (j < .5) { dir = -nd; wd = vec3(1., 0., 0.); nr = dors; root = sh - nd * .25; len = .8; }
    vec3 w3 = root + dir * (p.y * len) + wd * p.x + nr * p.z;
    p = mix(mix(F, q, open), w3, fl);
  }
  if (part > 3.5) p = rx(p, hub, iC.y * .62 * (1. - fl));        // the strike: the whole shaft pitches forward
  p = rx(p, hub, fl * radians(62.));                              // in flight the body lies forward: neck out ahead, legs trailing
  p = rzz(p, hub, -fl * iB.x);                                     // and banks (in flight iB.x is the bank, port wing down, not the stride)
  p *= sc;
  float c = cos(iA.w), s = sin(iA.w);
  vW = vec3(p.x * c + p.z * s, p.y, -p.x * s + p.z * c) + iA.xyz;
  vTone = aTone;
  gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.);
}`,Za=`
varying vec3 vW; varying float vTone;
void main(){
  vec3 N = normalize(cross(dFdx(vW), dFdy(vW)) + vec3(0., 1e-6, 0.));
  vec3 V = normalize(uCam - vW); if (dot(N, V) < 0.) N = -N;
  float key = max(dot(N, uSunDir), 0.), rim = 1. - max(dot(N, V), 0.); rim = rim * rim * rim;
  float top = smoothstep(.30, .95, N.y), port = smoothstep(.66, 1., N.x);     // the sky lies along every upper edge; the gold light comes from port (+X)
  vec3 R = reflect(-V, N);
  float spec = max(dot(R, uSunDir), 0.); spec *= spec; spec *= spec; spec *= spec; spec *= spec;
  vec3 skyc = mix(uHor, uZen, .45);
  // black lacquer: almost no colour of its own, but it mirrors the sky above and the warm light to port
  vec3 lac = vec3(.012, .014, .018) + skyc * (.19 * top + .07 * rim) + uGold * .30 * port + uSunCol * (.05 * key + .26 * spec);
  // nickel joints, feet and slat caps: a step brighter than the lacquer, with a glint that comes and goes
  float tw = .5 + .5 * sin(uTime * 2.3 + vW.x * 3.1 + vW.z * 2.3 + vW.y * 5.);
  vec3 nick = vec3(.34, .36, .38) * (.22 + .65 * top + .7 * key + .3 * rim) + uGold * .22 * port + mix(uGlint, uSunCol, .4) * (1.1 * spec + .10 * tw * tw * tw * tw);
  gl_FragColor = vec4(fenFog(mix(lac, nick, vTone), vW), 1.);
}`;function Xa(){const n=[],C=[],O=[],I=[],B=[],E=[],f=(b,z,G)=>new a.Vector3(b,z,G),u=new a.Vector3,v=new a.Vector3,g=new a.Vector3,l=(b,z,G,c,D,w=0,j=0,S=0)=>{u.subVectors(z,b).normalize(),v.set(1,0,0),Math.abs(u.x)>.9&&v.set(0,0,1),g.crossVectors(u,v).normalize(),v.crossVectors(g,u).normalize();const d=n.length/3;for(const P of[b,z])for(const[Q,N]of[[-1,-1],[1,-1],[1,1],[-1,1]])n.push(P.x+v.x*Q*G+g.x*N*c,P.y+v.y*Q*G+g.y*N*c,P.z+v.z*Q*G+g.z*N*c),C.push(D,w,S),O.push(j),B.push(v.x*Q*G,v.y*Q*G,v.z*Q*G,G),E.push(g.x*N*c,g.y*N*c,g.z*N*c,c);for(let P=0;P<4;P++){const Q=(P+1)%4;I.push(d+P,d+Q,d+4+Q,d+P,d+4+Q,d+4+P)}I.push(d,d+2,d+1,d,d+3,d+2,d+4,d+5,d+6,d+4,d+6,d+7)},h=f(0,1.15,0),m=f(0,.96,.28),A=(b,z=0)=>h.clone().addScaledVector(m,b).add(f(z,0,0));l(f(0,1,0),f(0,1.32,0),.07,.07,0),l(f(0,.97,0),f(0,1.02,0),.088,.088,0,0,1),l(f(0,1.3,0),f(0,1.35,0),.088,.088,0,0,1);for(const[b,z]of[[1,1],[2,-1]]){const G=f(z*.17,.62,-.2),c=f(z*.24,.05,.1);l(h,G,.036,.036,b),l(G.clone().add(f(-.05*z,0,0)),G.clone().add(f(.05*z,0,0)),.055,.055,b,0,1),l(G,c,.03,.03,b,0,0,1),l(c,f(z*.24,.02,.5),.028,.022,b,0,.75,1),l(c,f(z*.08,.02,.4),.024,.02,b,0,.75,1),l(c,f(z*.42,.02,.38),.024,.02,b,0,.75,1),l(c,f(z*.25,.02,-.12),.024,.02,b,0,.75,1)}l(h,f(0,.84,-1.05),.034,.034,3),l(f(0,.84,-1.05),f(0,.8,-1.26),.05,.022,3,0,1),l(h,A(.8),.042,.042,4),l(A(.73),A(.85),.06,.06,4,0,1),l(A(.3),A(1.02),.028,.028,5),l(A(.97),A(1.22),.085,.07,5),l(A(1.1,-.11),A(1.1,.11),.034,.034,5,0,1);const W=A(1.12),Z=f(0,-.442,.897);l(W.clone().addScaledVector(Z,.05),W.clone().addScaledVector(Z,.46),.036,.034,5),l(W.clone().addScaledVector(Z,.42),W.clone().addScaledVector(Z,.82),.021,.02,5,0,.55);for(let b=-4;b<=4;b++)l(f(0,0,0),f(0,1.62,0),.042,.009,7,b),l(f(-.058,1.59,0),f(.058,1.59,0),.024,.013,7,b,1),l(f(-.07,.8,0),f(.07,.8,0),.014,.011,7,b,.7);const y=new a.InstancedBufferGeometry;return y.setAttribute("position",new a.Float32BufferAttribute(n,3)),y.setAttribute("aP",new a.Float32BufferAttribute(C,3)),y.setAttribute("aTone",new a.Float32BufferAttribute(O,1)),y.setAttribute("aAx",new a.Float32BufferAttribute(B,4)),y.setAttribute("aBx",new a.Float32BufferAttribute(E,4)),y.setIndex(I),y}const Qa=`
attribute vec3 aK; attribute vec4 aI; attribute float aS;
uniform vec3 uSquad; uniform vec4 uSquadDir;     // xz = heading, w = presence 0..1
varying vec2 vUv; varying vec3 vK; varying vec3 vW;
void main(){
  float h = aI.w, t = uTime;
  vec3 c; vec2 fw;
  if (aS < -.5) {
    // hover, then dart: a new perch every few seconds, eased
    float per = 2.6 + 2. * h, ph = t / per + h * 7., k = floor(ph), f = smoothstep(.62, 1., fract(ph));
    vec3 a = vec3(h21(vec2(k, h * 91.)), h21(vec2(k, h * 37. + 3.)), h21(vec2(k + 5., h * 53.))) - .5;
    vec3 b = vec3(h21(vec2(k + 1., h * 91.)), h21(vec2(k + 1., h * 37. + 3.)), h21(vec2(k + 6., h * 53.))) - .5;
    vec3 off = mix(a, b, f) * vec3(16., 2.4, 16.);
    c = aI.xyz + off + vec3(0., .12 * sin(t * 5. + h * 60.), 0.);
    vec2 dd = (b - a).xz; fw = normalize(dd + vec2(1e-3, 2e-3));
  } else {
    float slot = aS, row = floor((slot + 1.) * .5), sd = mod(slot, 2.) < .5 ? 1. : -1.;
    vec2 f2 = normalize(uSquadDir.xz + vec2(0., 1e-4)), rt = vec2(f2.y, -f2.x);
    vec2 pv = .819 * f2 + .574 * rt, fv = .574 * f2 - .819 * rt;   // our port and our forward (the nine head 55 degrees across the bow)
    // a vee seen face-on: the leader at its point, two arms trailing to starboard, one rising and one falling
    vec2 fl2 = pv * (-row * 1.9) + fv * (row * .5);
    vec3 form = vec3(fl2.x, .12 * sin(t * 2.2 + slot * 1.7) + row * .8 * sd, fl2.y);
    c = uSquad + form + vec3(0., (1. - uSquadDir.w) * 40. + (1. - step(.004, uSquadDir.w)) * 600., 0.);   // (gone for good once they have left: never a speck in a corner)
    fw = f2;
  }
  vec3 p = position; vUv = uv; vK = aK;
  float big = aS < -.5 ? 1. : 2.5;                               // the five that pace us are the big ones
  vec3 w;
  if (aK.x < 1.5) {
    if (aK.x > .5) p.x += sin(t * 61. + aK.z * 2.1 + h * 30.) * .05 * (1. - smoothstep(-.3, 0., p.z));
    float nod = -p.z * .10 + .03 * sin(t * 3.1 + h * 20.) * p.z;
    p = (aK.x > .5 ? vec3(0., p.x + p.y * 1.3 + nod, p.z) : vec3(-p.y, p.x + nod, p.z)) * (aS < -.5 ? vec3(1.) : vec3(.72, .72, 1.));   // flown level and on edge: side-on, two tines one above the other
    p *= big;
    w = c + vec3(p.x * fw.y + p.z * fw.x, p.y, -p.x * fw.x + p.z * fw.y);
  } else if (aK.x < 2.5) {
    vec3 cr = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), cu = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
    float s0 = .52 * big, sz = max(s0, 3. * length(c - uCam) * uPxAng);     // the wings: a blurred pair, half a fork long each
    w = c + vec3(0., .22 * big, 0.) + (cr * p.x + cu * p.y * .6) * sz;
    vK.y = (s0 * s0) / (sz * sz);
  } else {
    w = vec3(c.x + p.x * .6 * big, .015, c.z + p.y * .6 * big);
    vK.y = 1. - smoothstep(1., 5.5, c.y);
  }
  vW = w;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
  if (aS > 4.5) gl_Position = vec4(2., 2., 2., 1.);                // (the vee is five strong: the other four slots are never drawn)
}`,Ya=`
varying vec2 vUv; varying vec3 vK; varying vec3 vW;
void main(){
  float f = exp(-length(vW - uCam) * uFogK);
  if (vK.x < .5) {
    // polished steel bar, lit as a round: dark underside, the sky as a bright line along its upper edge, a glint that runs along it
    float up = vUv.x, line = exp(-(up - .45) * (up - .45) * 22.);
    float run = .5 + .5 * sin(vUv.y * 2.4 + uTime * 2.6 + vW.x * .7 + vW.z * .5); run *= run; run *= run;
    vec3 col = uSteel * (.08 + .42 * smoothstep(-.5, .6, up)) + mix(uHor, uZen, .3) * .55 * line + mix(uGlint, uSunCol, .5) * line * run * .9 + uGold * .10 * smoothstep(-.2, .8, up);
    if (vK.y > .5) { if (dot(vUv, vUv) > 1.) discard; col = vec3(.62, .65, .68) * (.50 + .5 * smoothstep(-.6, .7, vUv.x)) + uHor * .2; }   // the ball end: nickel
    gl_FragColor = vec4(fenFog(col, vW), 1.);
  }
  else if (vK.x < 1.5) { float a = .36; gl_FragColor = vec4(fenFog(uSteel * .22, vW) * a, a); }
  else if (vK.x < 2.5) {
    // glass wings beating too fast to see: two pale lobes, brightest along their leading edge, veined, flickering
    vec2 e = vec2(abs(vUv.x), vUv.y + .55);                       // each wing springs from the yoke, up and outward
    vec2 q = vec2(dot(e, vec2(.766, .643)), dot(e, vec2(-.643, .766)));
    q = vec2((q.x - .62) / .60, q.y / .20);
    float d = length(q), lead = smoothstep(-.9, .6, q.y);
    float a = (1. - smoothstep(.6, 1., d)) * (.10 + .34 * lead * lead + .22 * smoothstep(.55, .95, d)) * min(vK.y, 1.);
    a *= .72 + .28 * sin(q.x * 9. + uTime * 14.);
    gl_FragColor = vec4((mix(uHor, uSunCol, .35) * .8 + uGold * .25) * a * f, a * .22);
  } else {
    float r = length(vUv), a = (1. - smoothstep(.6, 1., r)) * (.5 + .5 * sin(r * 34. - uTime * 9.)) * vK.y * .36 * f;
    gl_FragColor = vec4(uHor * a * .7, a * .3);
  }
}`;function $a(){const n=[],C=[],O=[],I=[],B=(u,v,g=0,l=0)=>{const h=n.length/3;u.forEach((m,A)=>{n.push(m[0],m[1],m[2]),C.push(A===0||A===3?-1:1,A<2?-1:1),O.push(v,g,l)}),I.push(h,h+1,h+2,h,h+2,h+3)},E=(u,v,g,l,h,m=0)=>{B([[u-l,0,v],[u+l,0,v],[u+l,0,g],[u-l,0,g]],h,0,m),B([[u,-l,v],[u,l,v],[u,l,g],[u,-l,g]],h,0,m)};E(0,.1,.46,.03,0),E(-.1,-.5,0,.03,0),E(.1,-.5,0,.03,0);for(let u=0;u<6;u++){const v=u/6*Math.PI,g=(u+1)/6*Math.PI,l=.03,h=Math.cos(v),m=Math.sin(v),A=Math.cos(g),W=Math.sin(g);B([[(.1-l)*h,0,(.1-l)*m],[(.1+l)*h,0,(.1+l)*m],[(.1+l)*A,0,(.1+l)*W],[(.1-l)*A,0,(.1-l)*W]],0),B([[.1*h,-l,.1*m],[.1*h,l,.1*m],[.1*A,l,.1*W],[.1*A,-l,.1*W]],0)}B([[-.05,0,.44],[.05,0,.44],[.05,0,.54],[-.05,0,.54]],0,1),B([[0,-.05,.44],[0,.05,.44],[0,.05,.54],[0,-.05,.54]],0,1);for(let u=0;u<2;u++)for(const v of[-.1,.1])B([[v,-.03,-.5],[v,.03,-.5],[v,.03,0],[v,-.03,0]],1,0,u*3+(v>0?1:0));B([[-1,-1,0],[1,-1,0],[1,1,0],[-1,1,0]],2),B([[-1,-1,0],[1,-1,0],[1,1,0],[-1,1,0]],3);const f=new a.InstancedBufferGeometry;return f.setAttribute("position",new a.Float32BufferAttribute(n,3)),f.setAttribute("uv",new a.Float32BufferAttribute(C,2)),f.setAttribute("aK",new a.Float32BufferAttribute(O,3)),f.setIndex(I),f}const Ja=`
attribute vec4 aI;
varying vec2 vUv; varying vec3 vW; varying float vA;
void main(){
  float front = uFront + 40. * (vn(aI.xy / 60.) * 2. - 1.);
  float tear = uGust * smoothstep(-20., 140., front - aI.y);
  vec3 c = vec3(aI.x + sin(uTime * .05 + aI.w * 9.) * 6., 2.2 + aI.w * 1.6, aI.y + uTime * .8 + tear * tear * 260.);
  vec2 sz = vec2(aI.z * (1. + .7 * tear), aI.z * .16 * (1. - .5 * tear));
  vW = c + vec3(position.x * sz.x, position.y * sz.y, 0.);
  vUv = position.xy; 
  float dist = length(c - uCam);
  vA = (1. - tear) * (1. - tear) * smoothstep(aI.z * .6 + 10., aI.z * .6 + 60., dist) * exp(-dist * uFogK * .5);
  vA *= mix(1., .14, smoothstep(6., 26., uCam.y));              // from above a card is a veil, never a white lid
  // no card stands between us and the Maelzel while it is far off: its foot is dark against the mist, not lost in it
  vec2 hv = vec2(0., HZ) - uCam.xz; float hD = max(length(hv), 1.); hv /= hD;
  vec2 cv = c.xz - uCam.xz; float lane = 50. * max(dot(cv, hv), 0.) / hD + .55 * sz.x;
  vA *= mix(1., smoothstep(lane, lane * 1.7 + 8., abs(cv.x * hv.y - cv.y * hv.x)), smoothstep(200., 450., hD));
  gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.);
}`,eo=`
uniform float uMistCards;
varying vec2 vUv; varying vec3 vW; varying float vA;
void main(){
  float e = (1. - vUv.x * vUv.x) * (1. - vUv.y * vUv.y);
  float n = fbm(vec2(vW.x * .04 + uTime * .02, vW.y * .3 + vW.z * .01));
  float a = e * smoothstep(.2, .75, n + e * .3) * vA * uMistCards * .9;
  gl_FragColor = vec4(uMistCol * a, a);
}`;function to(){const n=[],C=[],O=[],I=new a.Vector3,B=new a.Vector3,E=new a.Vector3,f=(c,D,w,j,S=null)=>{S?E.set(S[0],S[1],S[2]):(I.set(D[0]-c[0],D[1]-c[1],D[2]-c[2]),B.set(w[0]-c[0],w[1]-c[1],w[2]-c[2]),E.crossVectors(I,B).normalize());for(const d of[c,D,w])n.push(d[0],d[1],d[2]),C.push(E.x,E.y,E.z),O.push(j[0],j[1],j[2])},u=.13,v=[0,.25,0],g=[[-u,0,-u],[u,0,-u],[u,0,u],[-u,0,u]];for(let c=0;c<4;c++)f(g[(c+1)%4],g[c],v,[0,0,0]);f([-1,0,0],[1,0,0],[1,1,0],[1,1,1],[0,0,1]),f([-1,0,0],[1,1,0],[-1,1,0],[1,1,1],[0,0,1]);const l=.085,h=.1,m=[[l,0,0],[0,0,l],[-l,0,0],[0,0,-l]];for(let c=0;c<4;c++)f(m[c],[0,h,0],m[(c+1)%4],[1,2,2]),f(m[(c+1)%4],[0,-h,0],m[c],[1,2,2]);f([-.05,.04,0],[.05,.04,0],[0,-.13,0],[1,3,3],[0,0,1]),f([0,.04,-.05],[0,.04,.05],[0,-.13,0],[1,3,3],[1,0,0]),f([-.035,0,.03],[.035,0,.03],[0,1,.03],[.18,4,4],[0,0,1]),f([-.035,0,-.04],[.035,0,-.04],[0,.8,-.04],[.84,4,4],[0,0,1]),f([-.03,0,.06],[.03,0,.06],[0,.62,.06],[.36,4,4],[0,0,1]),f([-.03,0,-.07],[.03,0,-.07],[0,.7,-.07],[.66,4,4],[0,0,1]);const A=[[-.52,.1,.07,.92,.3],[.47,-.16,.06,.74,.72],[-.24,.22,.055,.55,.58],[.26,.26,.065,1,.4],[-.4,-.24,.06,.66,.78],[.6,.05,.05,.48,.22],[-.1,-.3,.07,.86,.5],[.12,.34,.05,.4,.64]];for(const[c,D,w,j,S]of A)f([c-w,0,D],[c+w,0,D],[c+(S-.5)*.25,j,D],[S,4,4],[0,0,1]);const W=new a.InstancedBufferGeometry;W.setAttribute("position",new a.Float32BufferAttribute(n,3)),W.setAttribute("normal",new a.Float32BufferAttribute(C,3)),W.setAttribute("aPA",new a.Float32BufferAttribute(O,3));const Z=[],y=[],b=[],z=(c,D)=>{const w=Z.length/3;Z.push(-1,c,0,1,c,0,1,1,0,-1,1,0);for(let j=0;j<4;j++)y.push(1,0,D);b.push(w,w+1,w+2,w,w+2,w+3)};z(0,6),z(-1,4),z(-1,5);const G=new a.InstancedBufferGeometry;return G.setAttribute("position",new a.Float32BufferAttribute(Z,3)),G.setAttribute("aPA",new a.Float32BufferAttribute(y,3)),G.setIndex(b),{solid:W,over:G}}function ao(){const n=[],C=[],B=Math.PI*2-.7;for(let g=0;g<9;g++){const l=.35+B*g/9,h=.35+B*(g+1)/9;n.push(0,0,0,Math.cos(h),0,Math.sin(h),Math.cos(l),0,Math.sin(l));for(let m=0;m<3;m++)C.push(0,0,0)}const E=new a.InstancedBufferGeometry;E.setAttribute("position",new a.Float32BufferAttribute(n,3)),E.setAttribute("aK",new a.Float32BufferAttribute(C,3));const f=[],u=[];for(let g=0;g<2;g++)for(let l=0;l<6;l++){const h=(l+g*.5)/6*Math.PI*2,m=g?.72:1;f.push(-1,0,0,1,0,0,0,0,0),u.push(1,0,h,1,0,h,1,m,h)}const v=new a.InstancedBufferGeometry;return v.setAttribute("position",new a.Float32BufferAttribute(f,3)),v.setAttribute("aK",new a.Float32BufferAttribute(u,3)),{pad:E,bud:v}}async function Pe(n,C,O,I,B,E,f,u,v=0){const g=new Map;for(let h=0;h<I.length;h+=B){const m=Math.floor(I[h+1]/f);g.has(m)||g.set(m,[]),g.get(m).push(h)}const l=[];for(const[h,m]of g){const A=new a.InstancedBufferGeometry;A.index=C.index;for(const c of Object.keys(C.attributes))A.setAttribute(c,C.attributes[c]);let W=1e9,Z=-1e9,y=0;for(const[c,D,w]of E){const j=new Float32Array(m.length*D);for(let S=0;S<m.length;S++)for(let d=0;d<D;d++)j[S*D+d]=I[m[S]+w+d];A.setAttribute(c,new a.InstancedBufferAttribute(j,D))}for(const c of m)W=Math.min(W,I[c]),Z=Math.max(Z,I[c]);A.instanceCount=m.length;const b=(h+.5)*f,z=(W+Z)/2;A.boundingSphere=new a.Sphere(new a.Vector3(z,0,b),Math.hypot((Z-W)/2+6,f/2+6,u));const G=new a.Mesh(A,O);G.renderOrder=v,l.push(G),y++,await n.yield()}return l}const oo={silver:{zen:"#9FB4BE",hor:"#DCE6EA",slate:"#3E5560",sun:"#FFF0D2",fog:"#B4C2C9",mist:"#C3CED3",fogK:[.0016,5e-4],mist0:.01,clear:0,frost:0,tear:"#F4DCA8"},frost:{zen:"#6A8FBA",hor:"#E8CDBE",slate:"#3F5470",sun:"#FFD6A6",fog:"#B3AEBB",mist:"#C4BDC6",fogK:[.0011,4e-4],mist0:.005,clear:1,frost:1,tear:"#F3DCC0"},mist:{zen:"#B3C1C7",hor:"#E1E8EA",slate:"#4A5F69",sun:"#FFF4E0",fog:"#C4CED2",mist:"#CCD5D8",fogK:[.0052,9e-4],mist0:.022,clear:0,frost:0,tear:"#F2DDB0"}},so={andante:[2,120],largo:[3,180],allegretto:[1.3,80]};var lo={id:"tempo-fen",name:"The Tempo Fen",category:"bizarre",weirdness:.85,media:["air","water"],async build(n){const C=n.rng,O=n.vary||{},I=n.quality?.detail??1,B=ge(O.density??1,.7,1.3),E=C(),f=C();let u=E<.46?"silver":E<.74?"frost":"mist";O.hour==="dawn"?u="frost":O.hour==="day"&&(u=E<.6?"silver":"mist");const v=O.hour==="golden",g=f<.5?"andante":f<.76?"largo":"allegretto",l=ge(Math.round(C.range(0,7)*B),0,7),h=C.chance(.78),m=C.chance(.35),A=C.chance(.3),W=!!O.rare,Z=C.range(0,1e3),y=oo[u],[b,z]=so[g],G=C.fork("tile"),c=C.fork("reeds"),D=C.fork("pads"),w=C.fork("cast"),j=new a.Vector3(.975,v?.15:.21,-.06).normalize(),S=e=>new a.Color(e),d=new a.Scene;d.fog=new a.FogExp2(S(y.fog),y.fogK[0]),await n.yield();const P=await ra(n,{palette:ca,sunDir:j.toArray(),keySide:-1,duration:Ye,beat:b,lineSpacing:z,lineSpeed:z/b,reflection:.62,downwind:[0,1]});P.object.position.set(0,0,K),P.object.rotation.y=Math.PI,d.add(P.object),P.setSky(y.zen,y.hor,y.slate),P.setSun(j,v?"#FFD9A0":y.sun),await n.yield();const Q={mahogany:["#C9A04A","#8FA3AD","#5A2A1C"],ebony:["#C2C8CC","#77858F","#1E1B20"],pearwood:["#C27A48","#8FA3AD","#7A5030"]}[P.cabinet]||["#C9A04A","#8FA3AD","#5A2A1C"];let N=null;A&&(N=await ra(n,{palette:ca,sunDir:j.toArray(),keySide:-1,duration:Ye,beat:b*2/3,lineSpacing:z,lineSpeed:z/b,reflection:!1,cabinet:P.cabinet==="ebony"?"mahogany":"ebony"}),N.object.scale.setScalar(60/140),N.object.position.set(-250,0,930),N.object.rotation.y=Math.PI*.86,d.add(N.object),N.setSky(y.zen,y.hor,y.slate),N.setSun(j,v?"#FFD9A0":y.sun),await n.yield());const be=P.uniforms,te=await Ka(n,G),Y={uZen:be.uZen,uHor:be.uHor,uSlate:be.uSlate,uSunCol:be.uSunCol,uSunDir:be.uSunDir,uDarkCol:be.uDarkCol,uDownwind:be.uDownwind,uMirror:{value:1},uDim:{value:1},uWaterY:{value:0},uHeroInv:{value:new a.Matrix4},uTile:{value:te.tex},uT:{value:0},uTime:{value:0},uU:{value:0},uFront:{value:-300},uGust:{value:1},uLull:{value:1},uCross:{value:0},uBeat:{value:b},uSpacing:{value:z},uBand:{value:new a.Vector3(Math.cos(Math.min(6.2832*20/z,1.5)),Math.cos(6.2832*8/z),g==="largo"?.7:0)},uFogK:{value:y.fogK[0]},uMist:{value:y.mist0},uPxAng:{value:.002},uFrost:{value:y.frost},uSwingAmp:{value:1},uCam:{value:new a.Vector3},uFogCol:{value:S(y.fog)},uMistCol:{value:S(y.mist)},uBrass:{value:S(Q[0])},uGold:{value:S(v?"#FFB85C":"#FFC46C").multiplyScalar(y.clear?.5:1)},uGlint:{value:P.cabinet==="ebony"?S("#EBCB86"):S(Q[0]).lerp(S(v?"#FFD9A0":y.sun),.22)},uSteel:{value:S(Q[1])},uFoot:{value:S(Q[2])},uPadCol:{value:S("#5E7F6A")},uTear:{value:y.clear?.35:1},uClear:{value:y.clear},uTearCol:{value:S(y.tear).multiplyScalar(y.clear?.84:.97)},uPeat:{value:S("#141C1F")},uMirrorZone:{value:1},uLoom:{value:1},uBloomAll:{value:m?1:0},uMistCards:{value:1},uSquad:{value:new a.Vector3(0,60,0)},uSquadDir:{value:new a.Vector4(0,0,1,0)}};v&&(Y.uFogCol.value.lerp(S("#D8C4A8"),.35),Y.uMistCol.value.lerp(S("#E2CFB2"),.35),Y.uTearCol.value.set("#E8CFA0")),d.fog.color.copy(Y.uFogCol.value).lerp(S(y.clear?"#3A4A78":y.slate),y.clear?.62:.66);const Me=(e,t,i={})=>new a.ShaderMaterial({uniforms:{...Y},vertexShader:ia+fa+e,fragmentShader:ia+fa+t,...i}),Je={transparent:!0,depthWrite:!1,blending:a.CustomBlending,blendEquation:a.AddEquation,blendSrc:a.OneFactor,blendDst:a.OneMinusSrcAlphaFactor,blendSrcAlpha:a.OneFactor,blendDstAlpha:a.OneMinusSrcAlphaFactor},pt=new a.Mesh(new a.SphereGeometry(1,32,16),Me(Ea,Ra,{side:a.BackSide,depthWrite:!1}));pt.frustumCulled=!1,pt.renderOrder=-1,d.add(pt);const Gt=new a.PlaneGeometry(9e3,9e3,1,1);Gt.rotateX(-Math.PI/2);const et=new a.Mesh(Gt,Me(La,Va,{transparent:!0,depthWrite:!1}));et.position.set(0,0,600),et.renderOrder=1,et.frustumCulled=!1,d.add(et),await n.yield();const da=P.anchors.feet.map(e=>[-e.x,K-e.z]),Be=(e,t,i)=>{for(const o of da)if(Math.hypot(e-o[0],t-o[1])<i)return!0;if(A&&Math.hypot(e+250,t-930)<22||Math.abs(t-K)<34&&Math.abs(Math.abs(e)-32)<5||t>K+24&&t<K+40&&Math.abs(e)<36||Math.abs(t-(K-32))<5&&Math.abs(e)>17&&Math.abs(e)<36)return!0;for(const o of[K-21.6,K-7.5])if(Math.hypot(Math.abs(e)-13,t-o)<i-1)return!0;return Math.abs(t-(K+9.5))<3.2+i*.3&&Math.abs(Math.abs(e)-19.2)<9.5},Kt=(e,t,i)=>{const o=te.cellHash(e,t),k=r(900,990,t);return U(1.5+2.5*(.35*i+.65*o),3.5+.6*i,k)},tt=[],pa=6e3;for(let e=0;e<9e4&&tt.length<pa*5;e++){const t=-14+(K+30)*c(),i=c()<.5?-1:1,o=c(),k=Wt(t),M=re(t)+i*(k+.2+9.6*o*Math.sqrt(o)),T=c(),x=c(),F=c();te.reedDens(M,t)>.5&&!Be(M,t,5.5)&&Math.abs(M-re(t))>4.6&&tt.push(M,t,Kt(M,t,F),T,x),e%500===499&&await n.yield()}await n.yield();const Et=to(),ma=Me(Na,_a,{side:a.DoubleSide}),ga=Me(qa,Ua,{...Je,side:a.DoubleSide}),ya=Me(ja,Ha,{...Je,side:a.DoubleSide}),Rt=[["aI",4,0],["aJ",1,4]];await n.yield();for(const e of await Pe(n,Et.solid,ma,tt,5,Rt,150,5))d.add(e);await n.yield();for(const e of await Pe(n,Et.over,ga,tt,5,Rt,150,5,2))d.add(e);await n.yield();const mt=[],wa=Math.round(3e4*ge(I,.5,1)*(.85+.15*B));for(let e=0;e<16e4&&mt.length<wa*4;e++){const t=-60+1640*c(),i=c()<.5?-1:1,o=c(),k=Wt(t),M=c(),T=c(),x=Math.max(k+2.6,6.4)+46*(Math.exp(o*Math.log(1+430/46))-1),F=re(ge(t,0,K))+i*x;te.reedDens(F,t)>.45&&!Be(F,t,7)&&mt.push(F,t,Kt(F,t,M)*(x>60?1.1:1),T),e%500===499&&await n.yield()}const gt=new a.InstancedBufferGeometry;gt.setAttribute("position",new a.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),gt.setIndex([0,1,2,0,2,3]),await n.yield();for(const e of await Pe(n,gt,ya,mt,4,[["aI",4,0]],200,6,3))d.add(e);await n.yield();const ie=[],yt=[],xa=Math.round(2200*I*B);for(let e=0;e<4e4&&ie.length<xa*4;e++){const t=D(),i=D(),o=D(),k=D(),M=D(),T=D();let x,F;if(t<.5)F=-20+(K+10)*i,x=re(F)+(o*2-1)*(t<.3?9:40);else if(t<.8){const L=i*6.283,ue=Math.sqrt(o)*Qe;x=Math.cos(L)*ue,F=vt+Math.sin(L)*ue/.62}else x=(i*2-1)*42,F=K-60+o*105;if(te.reedDens(x,F)>.12||Be(x,F,4))continue;const H=.25+.55*k*k+(t>=.5?.12:0);ie.push(x,F,H,M),T<(t>=.5&&t<.8?.3:.125)&&yt.push(x,F,H,M),e%500===499&&await n.yield()}await n.yield();for(let e=0;e<Math.round(150*Math.max(I,.7));e++){const t=D(),i=D(),o=D(),k=D(),M=D(),T=3+125*t*t,x=re(T)+(i*2-1)*4.4;if(te.reedDens(x,T)>.12)continue;const F=.3+.6*o*o;ie.push(x,T,F,k),M<.16&&yt.push(x,T,F,k)}await n.yield();const at=ao(),Lt=Me(ua,va,{side:a.DoubleSide,transparent:!0});for(const e of await Pe(n,at.pad,Lt,ie,4,[["aI",4,0]],300,2,1.4))d.add(e);await n.yield();for(const e of await Pe(n,at.bud,Lt,yt,4,[["aI",4,0]],600,2,1.5))d.add(e);await n.yield();const Vt=e=>new a.Vector3(-e.x,e.y,K-e.z),wt=[new a.Vector3(36.5,0,K-37),new a.Vector3(-36.5,0,K-37),Vt(P.anchors.roosts[5]),Vt(P.anchors.roosts[6]),new a.Vector3(6.6,0,905),new a.Vector3(-6.7,0,990),new a.Vector3(6.8,0,1068)],ba=(e,t)=>{let i=0;for(let o=0;o<=5;o++){const k=-.8+o*.76,M=e+k,T=t+Math.sin(ge(k,0,2.2)*.9)*.4;for(const x of[-1.2,0,1.2])i=Math.max(i,te.reedDens(M,T+x));if(o>0&&o<5)for(const x of[16,24,32])for(let F=6;F<20;F++)i=Math.max(i,te.reedDens(U(re(x),M,F/20),U(x,T,F/20)))}return i};let xt=[-6.9,45],bt=9;for(const e of[45,49,41,53,37])for(const t of[-6.9,-6.2,-5.6,-5.2]){const i=ba(t,e);bt>.3&&i<bt&&(bt=i,xt=[t,e])}const We=[{role:"stride",x:xt[0],z:xt[1],y:0,head:.1,ph:w()*6,sc:1.6},{role:"fly",x:-7,z:684.4,y:0,head:2.3,ph:w()*6,u0:.566,sc:1.5},{role:"fly",x:-11,z:707.7,y:0,head:2,ph:w()*6,u0:.588,sc:1.5},{role:"gate",x:6.6,z:K-86,y:0,head:-2.8,ph:w()*6,sc:1.6},{role:"gate",x:-5,z:K-84,y:0,head:2.8,ph:w()*6,sc:1.6}];We.push({role:"show",x:dt+5.9,z:201.9,y:0,head:2.53,ph:1.7,from:.128,to:.215},{role:"watch",x:5.7,z:937.5,y:0,head:-Math.PI/2,ph:4.1,at:.79,sc:1.3},{role:"show",x:-6.9,z:1062,y:0,head:Math.PI*.94,ph:3.3,from:.845,to:.93,sc:1.5});const Ma=w.shuffle?w.shuffle(wt.map((e,t)=>t)):wt.map((e,t)=>t);for(let e=0;e<Math.min(l,5);e++){const t=wt[Ma[e]];We.push({role:"roost",x:t.x,y:t.y,z:t.z,head:Math.PI+(w()-.5)*1.6,ph:w()*6})}const Ge=We.length,Ke=Xa(),ot=new a.InstancedBufferAttribute(new Float32Array(Ge*4),4),st=new a.InstancedBufferAttribute(new Float32Array(Ge*4),4),nt=new a.InstancedBufferAttribute(new Float32Array(Ge*3),3);ot.setUsage(a.DynamicDrawUsage),st.setUsage(a.DynamicDrawUsage),nt.setUsage(a.DynamicDrawUsage),Ke.setAttribute("iA",ot),Ke.setAttribute("iB",st),Ke.setAttribute("iC",nt),Ke.instanceCount=Ge;const Nt=new a.Mesh(Ke,Me(Oa,Za,{side:a.DoubleSide}));Nt.frustumCulled=!1,d.add(Nt),await n.yield();const rt=h?Math.round(240*I*B):0,_t=new Float32Array((rt+9)*4),Mt=new Float32Array(rt+9);for(let e=0;e<rt+9;e++){const t=w(),i=w(),o=w(),k=w();let M,T,x;if(e<9)M=0,T=0,x=0,Mt[e]=e;else if(Mt[e]=-1,t<.2)M=(i<.5?-1:1)*(8+Math.abs(i*2-1)*18),T=46+o*38,x=K-34-k*8;else{x=20+(K-60)*i;const F=o<.5?-1:1;M=re(x)+F*(17+70*k*k),T=2.2+5*(o*2%1)}_t.set([M,T,x,w()],e*4)}const it=$a();it.setAttribute("aI",new a.InstancedBufferAttribute(_t,4)),it.setAttribute("aS",new a.InstancedBufferAttribute(Mt,1)),it.instanceCount=rt+9;const Ct=new a.Mesh(it,Me(Qa,Ya,{...Je,side:a.DoubleSide}));Ct.frustumCulled=!1,Ct.renderOrder=5,d.add(Ct);const At=Math.round(60*ge(I,.6,1)*(u==="mist"?1.3:1)),qt=new Float32Array(At*4);for(let e=0;e<At;e++){const t=60+1050*w(),i=w()<.5?-1:1;qt.set([re(t)+i*(22+130*w()),t,34+40*w(),w()],e*4)}const Ee=new a.InstancedBufferGeometry;Ee.setAttribute("position",new a.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),Ee.setIndex([0,1,2,0,2,3]),Ee.setAttribute("aI",new a.InstancedBufferAttribute(qt,4)),Ee.instanceCount=At;const Ft=new a.Mesh(Ee,Me(Ja,eo,{...Je,side:a.DoubleSide}));Ft.frustumCulled=!1,Ft.renderOrder=4,d.add(Ft),await n.yield();const Ut=[];for(const e of[0,30,60,100,145,190,235,280,325,370,415,460,505,550,595,640,685,730,775,820,865,910,955,1e3,1045,1090,1135,la])Ut.push([re(e)+2.3*r(35,85,e)*(1-r(110,160,e)),Wa(e),e]);const ke=Ba(Ut),we=D.fork("p2"),jt=[],Ht=[];{const e=.2*Math.max(I,.7),t=15,i=15,o=42,k=4.4,M=.25,T=Math.hypot(2,M/2)+.005,x=1.166*.1,F=Math.sin(82*Math.PI/180),H=Math.cos(82*Math.PI/180),L=Math.ceil(ke.length/M)+1,ue=new Float64Array(L),Ce=new Float64Array(L),ae=new Float64Array(L),le=new a.Vector3,R=Math.floor(la)+2,ve=new Int32Array(R).fill(L),Ie=new Int32Array(R).fill(-1);for(let s=0;s<L;s++){ke.posAtDist(Math.min(s*M,ke.length),le),ue[s]=le.x,Ce[s]=le.y,ae[s]=le.z;const p=ge(Math.floor(le.z),0,R-1);ve[p]=Math.min(ve[p],s),Ie[p]=s,s%800===799&&await n.yield()}const Ne=(s,p,_,V)=>{let q=1e9,ce=L,pe=-1;for(let oe=ge(Math.floor(p-_-T),0,R-1);oe<=ge(Math.floor(p+_+T),0,R-1);oe++)ce=Math.min(ce,ve[oe]),pe=Math.max(pe,Ie[oe]);for(let oe=ce;oe<=pe;oe++){const ze=ue[oe]-s,fe=ae[oe]-p,$=Math.max(Math.sqrt(ze*ze+fe*fe)-_,0),X=Math.max(Ce[oe]-V,0),me=$*$+X*X;me<q&&(q=me)}return Math.sqrt(q)},_e=(s,p)=>p>=i&&p<i+o*t&&Math.abs(s-re(p))<k&&te.reedDens(s,p)<.12?Math.floor((p-i)/t):-1,De=(s,p,_,V)=>{const q=Math.round((p-s)/M)+1;return{zA:s,n:q,side:_,cen:V,iv:Array.from({length:q*(2*_+1)},()=>[])}},ht=k-.01,xe=(s,p,_,V,q)=>{for(let ce=Math.max(Math.ceil((_-V-s.zA)/M),0);ce<s.n&&s.zA+ce*M<_+V;ce++){const pe=s.zA+ce*M,oe=Math.sqrt(Math.max(V*V-(pe-_)*(pe-_),0)),ze=s.cen(pe);for(let fe=Math.max(Math.floor((p-oe-ze)/(2*k)+.5),-s.side);fe<=s.side&&ze+(2*fe-1)*k<p+oe;fe++){const $=s.iv[ce*(2*s.side+1)+fe+s.side];let X=Math.max(p-oe,ze+(2*fe-1)*k),me=Math.min(p+oe,ze+(2*fe+1)*k),He=me-X;if(!(me<=X))if(q){for(let he=$.length-2;he>=0;he-=2)$[he]<=me&&$[he+1]>=X&&(X=Math.min(X,$[he]),me=Math.max(me,$[he+1]),$.splice(he,2));$.push(X,me)}else{for(let he=0;he<$.length;he+=2)He+=$[he+1]-$[he]-Math.max(0,Math.min(me,$[he+1])-Math.max(X,$[he]));if(He>ht)return!1}}}return!0},kt=De(3,i+o*t+3.5,0,re),St=De(630,780,5,()=>0),It=De(630,780,6,()=>k),Pt=new Float64Array(o),de=[];let Tt=.8;for(let s=0;s<ie.length;s+=4){const p=_e(ie[s],ie[s+1]);p>=0&&(Pt[p]+=Math.PI*ie[s+2]*ie[s+2]),de.push(ie[s],ie[s+1],ie[s+2]),Tt=Math.max(Tt,ie[s+2]);const _=Math.fround(ie[s]),V=Math.fround(ie[s+1]),q=Math.fround(ie[s+2]);xe(kt,_,V,q,!0),xe(St,_,V,q,!0),xe(It,_,V,q,!0),s%2e3===1996&&await n.yield()}await n.yield();const Qt=16,Pa=10,Yt=(s,p,_,V,q,ce,pe,oe,ze)=>{const fe=[],$=2.6+.8*(.8+V+Math.max(Tt,.8+V));for(let X=0;X<de.length;X+=3)Math.abs(de[X]-s)<$&&Math.abs(de[X+1]-p)<$&&fe.push(de[X],de[X+1],de[X+2]);for(let X=0;X<_&&pe[oe]<ze;X++){const me=we(),He=we(),he=we(),J=Math.fround(.25+.55*me*me+V);let se=0,ne=0,Oe=!1;for(let Ze=0;Ze<Pa&&!Oe;Ze++){const ta=6.2832*we(),aa=2.6*we();se=Math.fround(s+Math.cos(ta)*aa),ne=Math.fround(p+Math.sin(ta)*aa),Oe=!0;for(let Xe=0;Xe<fe.length&&Oe;Xe+=3){const oa=se-fe[Xe],sa=ne-fe[Xe+1],na=.8*(J+fe[Xe+2]);oa*oa+sa*sa<na*na&&(Oe=!1)}}if(!Oe||!q(se,ne)||We.some(Ze=>Math.hypot(se-Ze.x,ne-Ze.z)<2.4)||Ne(se,ne,J,x*J+.035)<T||!xe(kt,se,ne,J)||!xe(St,se,ne,J)||!xe(It,se,ne,J))continue;jt.push(se,ne,J,He),de.push(se,ne,J),fe.push(se,ne,J),xe(kt,se,ne,J,!0),xe(St,se,ne,J,!0),xe(It,se,ne,J,!0);const ea=ce(se,ne);ea>=0&&(pe[ea]+=Math.PI*J*J),he<.125&&Ne(se,ne,.42*J+.05,.42*J*F+.03+.035+x*(.42*J*H+.05))>=T&&Ht.push(se,ne,J,He)}},$t=e*t*2*k,Ta=(s,p)=>p>=i&&!(te.reedDens(s,p)>.12||Be(s,p,4));for(let s=0;s<o;s++){const p=i+s*t;for(let _=0;_<Qt&&Pt[s]<$t;_++){const V=we(),q=p+t*we(),ce=re(q)+(2*V-1)*3.4;Yt(ce,q,8+Math.floor(7*we()),0,Ta,_e,Pt,s,$t),await n.yield()}}const Da=.28*Math.max(I,.7),qe=-52.5,Ue=630,ye=7,je=10,ut=(s,p)=>Math.hypot(s,(p-vt)*.62)<Qe&&te.reedDens(s,p)<.12&&!Be(s,p,4),Jt=(s,p)=>s>=qe&&s<qe+ye*t&&p>=Ue&&p<Ue+je*t&&ut(s,p)?Math.floor((s-qe)/t)+ye*Math.floor((p-Ue)/t):-1,Dt=new Float64Array(ye*je),Bt=new Float64Array(ye*je);for(let s=0;s<ye*je;s++){const p=qe+s%ye*t,_=Ue+Math.floor(s/ye)*t;for(let V=0;V<t;V++)for(let q=0;q<t;q++)ut(p+V+.5,_+q+.5)&&Dt[s]++;s%ye===ye-1&&await n.yield()}for(let s=0;s<de.length;s+=3){const p=Jt(de[s],de[s+1]);p>=0&&(Bt[p]+=Math.PI*de[s+2]*de[s+2])}await n.yield();for(let s=0;s<ye*je;s++){const p=qe+s%ye*t,_=Ue+Math.floor(s/ye)*t,V=Da*Dt[s];if(!(Dt[s]<20))for(let q=0;q<Qt&&Bt[s]<V;q++){const ce=p+t*we(),pe=_+t*we();ut(ce,pe)&&(Yt(ce,pe,8+Math.floor(7*we()),.12,ut,Jt,Bt,s,V),await n.yield())}}}const Ot=Me(`#define P2
`+ua,`#define P2
`+va,{side:a.DoubleSide,transparent:!0});for(const e of await Pe(n,at.pad,Ot,jt,4,[["aI",4,0]],300,2,1.4))d.add(e);await n.yield();for(const e of await Pe(n,at.bud,Ot,Ht,4,[["aI",4,0]],600,2,1.5))d.add(e);await n.yield();const Ca=new a.Vector3,Aa=new a.Vector3,Fa=new a.Vector3,Fe=new a.Vector3,Te=new a.Vector3,za=new a.Vector3(0,60,K-20),Re=new a.Vector3,Le=new a.Vector3,zt=new a.Vector3,Zt=new a.Vector2,lt=new a.Vector3,ka=e=>U(y.fogK[0],y.fogK[1],r(u==="mist"?.24:.1,u==="mist"?.46:.34,e)),Sa=e=>e<.2?U(-500,150,e/.2):e<.24?U(150,300,(e-.2)/.04):e<.25?U(300,336,(e-.24)/.01):e<.27?U(336,400,(e-.25)/.02):e<.48?U(400,K+120,(e-.27)/.21):K+120+(e-.48)*4e3;let Se=0,Ve=-1,ct=-1;const ft=2*b;function Ia(e,t){for(let i=0;i<Ge;i++){const o=We[i];let k=o.x,M=o.y,T=o.z,x=o.head,F=0,H=.3+.3*Math.sin(e*.5+o.ph),L=0,ue=0,Ce=0,ae=0;const le=(e*.16+o.ph)%1;if(o.role==="stride"){const R=(e*.42+o.ph)*(Math.PI/6),ve=1.1*(1-Math.cos(R)),Ie=Math.sin(R);k+=ve,T+=Math.sin(ve*.9)*.4,F=ve*3.4+o.ph,x=Math.PI/2*(2*r(-.2,.2,Ie)-1),ae=.8*r(.026,.031,t)*(1-r(.036,.046,t)),H=U(.55+.25*Math.sin(e*.5+o.ph),1,ae)}else if(o.role==="fly"){const R=Math.max(t-o.u0,0)/.01,ve=R<1?.5*R*R:R-.5;L=r(o.u0-.055,o.u0-.012,t),H=U(H,.9,L),ue=r(0,.9,R),k+=4*ve,T+=9.2*ve,M+=3.5*r(0,2.5,R)-.25*Math.max(R-3,0),x=U(o.head,.72+.04*R,r(0,.9,R)),Ce=e*6.5+o.ph,F=.28*r(.5,2.2,R),R<=0&&(ae=.5*r(.8,.86,le)*(1-r(.9,.99,le))*(1-L))}else if(o.role==="show")ae=.9*r(o.from-.035,o.from-.022,t)*(1-r(o.from-.016,o.from-.004,t)),L=r(o.from,o.from+.022,t)*(1-r(o.to,o.to+.03,t))*(.92+.08*Math.sin(e*1.9+o.ph)),H=U(H,1,Math.max(L,ae));else if(o.role==="watch"){const R=r(o.at-.05,o.at-.02,t);H=U(H,.95,R),ae=.75*r(o.at-.008,o.at-.001,t)*(1-r(o.at+.012,o.at+.03,t))+.12*R*Math.sin(e*.8+o.ph)}else o.role==="gate"?(L=r(.862,.893,t)*(.9+.1*Math.sin(e*1.3+o.ph)),H=U(H,1,L)):(L=.5*r(.6,.9,Math.sin(e*.23+o.ph*3)),ae=.25*r(.84,.9,le)*(1-r(.92,.99,le)));ot.setXYZW(i,k,M,T,x),st.setXYZW(i,F,H,L,ue),nt.setXYZ(i,Ce,ae,o.sc||1)}ot.needsUpdate=!0,st.needsUpdate=!0,nt.needsUpdate=!0}function Xt(e,t,i,o){o=ge(o??0,0,1);const k=ct<0?0:ge(t-ct,0,.25);if(Ve<0||Math.abs(o-Ve)>.02)Se=o*Ye;else if(o!==Ve){const xe=((o*Ye-Se)%ft+ft*1.5)%ft-ft/2;Se+=k*(1+ge(xe*1.5,-.3,.3))}else Se+=k;Ve=o,ct=t;const M=i.matrixWorld.elements;Le.set(M[12],M[13],M[14]),zt.set(-M[8],-M[9],-M[10]),n.renderer.getDrawingBufferSize(Zt);const T=i.projectionMatrix.elements;Y.uPxAng.value=2/Math.max(T[5],.05)/Math.max(Zt.y,1),Y.uCam.value.copy(Le),Y.uT.value=Se,Y.uTime.value=t,Y.uU.value=o,Y.uFront.value=Sa(o),Y.uLull.value=1-r(.55,.8,o),Y.uCross.value=W?r(.33,.37,o)*(1-r(.5,.57,o)):0;const x=ka(o);Y.uFogK.value=x,d.fog.density=U(Math.min(.36*x,7e-4),x,r(.05,.32,o));const F=1+.3*(1-r(.02,.45,o));P.object.scale.setScalar(F),Y.uLoom.value=F;const H=r(.19,.27,o);Y.uMist.value=y.mist0*U(1,u==="mist"?.4:.22,H),P.setTime(Se),P.setLock(r(.3,.48,o)),P.setFogK(x),P.update(e,t,i),N&&(N.setTime(Se),N.setLock(1),N.setFogK(x),N.update(e,t,i));const L=r(.615,.66,o)*(1-r(.725,.77,o)),ue=zt.x,Ce=zt.z,ae=Math.max(Math.hypot(ue,Ce),.001),le=ue/ae,R=Ce/ae,ve=R,Ie=-le,Ne=le*.574+ve*.819,_e=R*.574+Ie*.819,De=U(-3,-1.9,r(.62,.76,o));lt.set(Le.x+le*7.4+ve*De,Le.y-.75-(1-L)*6,Le.z+R*7.4+Ie*De);const ht=(1-L)*150;Y.uSquad.value.set(lt.x+Ne*ht,Math.max(lt.y,2),lt.z+_e*ht),Y.uSquadDir.value.set(Ne,0,_e,L),Ia(t,o)}return await n.yield(),Xt(0,0,{matrixWorld:new a.Matrix4().makeRotationY(Math.PI).setPosition(0,3,0),projectionMatrix:new a.Matrix4().makePerspective(-1,1,.6,-.6,1,100)},0),Ve=-1,ct=-1,{scene:d,path:ke,duration:Ye,pace:e=>1+.2*r(.1,.16,e)*(1-r(.28,.34,e))-.12*r(.36,.4,e)*(1-r(.48,.53,e))-.22*r(.64,.69,e)*(1-r(.82,.88,e)),title:u==="frost"?"The Tempo Fen, Rimed":u==="mist"?"The Tempo Fen in Mist":"The Tempo Fen",camera:{fov:62,near:.3,far:4e3,lookAhead:24,sway:.6,bank:.6},pois:[{at:(e,t)=>za.set(0,U(24,60,r(.5,.8,t??0)),K-20),from:.3,to:.85,weight:.5},{at:(e,t)=>{const i=(t??0)*1207+130;return Ca.set(re(i)*.6,-18,i)},from:.27,to:.55,fade:.22,weight:.55},{at:(e,t)=>{const i=(t??0)*1207+15;return Aa.set(re(i)+12*(1-r(.07,.13,t??0)),2.6,i)},from:.04,to:.14,weight:.62},{at:(e,t)=>{const i=(t??0)*1207;return Fa.set(re(i)+150,-12,i+150)},from:.285,to:.385,weight:.5},{at:(e,t)=>{const i=t??0,o=i*ke.length;ke.posAtDist(o,Fe),ke.posAtDist(o+24,Te).sub(Fe);const k=Math.atan2(Te.x,Te.z),M=Math.atan2(Te.y,Math.max(Math.hypot(Te.x,Te.z),.001)),T=r(.135,.165,i),x=1-r(.172,.215,i);let F=k-.593*x,H=U(M,-.175,x);if(T<1){const ue=dt+5.9-Fe.x,Ce=1.7-Fe.y,ae=Math.max(201.9-Fe.z,1),le=Math.hypot(ue,ae);F=U(Math.atan2(ue,ae),F,T),H=U(Math.atan2(Ce,le),H,T)}const L=Math.cos(H)*40;return Fe.set(Fe.x+Math.sin(F)*L,Fe.y+Math.sin(H)*40,Fe.z+Math.cos(F)*L)},from:.115,to:.23,fade:.2217,weight:.5},{at:[-75,-4,720],from:.48,to:.575,fade:.45,weight:.45},{at:()=>(P.bobCenter(Re),Re.set(-Re.x,Re.y,K-Re.z)),from:.93,to:.96,weight:.5}],portal:{shape:"circle",radius:7,color:"#F4E3B0",glow:1,revealDistance:420},post:{exposure:1,bloom:{strength:.5,radius:.55,threshold:1},grade:{saturation:1.06,contrast:1.05,tint:"#ffffff",shadowTint:"#0b1418",vignette:.3,grain:.02,aberration:0}},ride:"none",update:Xt,dispose(){P.dispose(),N&&N.dispose(),te.tex.dispose()}}}};export{lo as default};
