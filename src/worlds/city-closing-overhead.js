import*as k from"three";import{makePath as Re}from"../kit/core.js";import{makeFlockAsync as Pe}from"../kit/fauna.js";import{PLAN as h,B0 as Ee,bendAt as Te,makeBend as Me,makeSwayUniforms as Ae,bendMaterials as ce,Writer as Ne,makePlainBlocks as Se,PALETTES as We,planTextures as pe,makeLand as qe,WET_GLSL as Ge}from"../parts/city-closing-overhead.js";import{makeTownPlan as Oe}from"../parts/city-closing-overhead-plan.js";import{makeTown as Ie}from"../parts/city-closing-overhead-town.js";import{makeLight as _e,makeFar as Fe,makeGlow as Be}from"../parts/city-closing-overhead-light.js";import{buildLife as He}from"../parts/city-closing-overhead-life.js";const Ce=Math.PI/180,de=e=>(e=e<0?0:e>1?1:e,e*e*(3-2*e)),we=(e,s,l)=>de((e-s)/(l-s)),X=e=>new k.Color(e),T={ENTRY:0,ENTRY_X:80,ENTRY_Y:16,RING:h.RING_Z,LEVEL:h.RING_Z-120,RING_CLEAR:h.RING_Z-60,PAVING_START:-360},ge=4.25,Ve=24;function Ze(e,s){const l=(t,p,W)=>Te(s,t,0,p,W).clone(),g=e.flat.towerA,a=e.sites.towerB,d=e.squares.hanging,x=e.squares.hinge,R=e.sites.church,A=(d.a0+d.a1)/2,V=t=>e.sites.fountains.find(p=>p.square===t),M=e.cross.filter(t=>t.wide&&(t.aStart??0)<1).map(t=>(t.z0+t.z1)/2).sort((t,p)=>t-p),y=t=>M.find(p=>p>t)??t,r=t=>[...M].reverse().find(p=>p<t)??t,c=e.longs.find(t=>t.wide)||e.longs[e.longs.length-1],P={at:l,TA:g,TB:a,SQ:d,aMid:A,edgeA:t=>e.brink.edgeA?e.brink.edgeA(t):h.L,zHinge:x.paved.z0,zHingeF:(V("hinge")||{z:(x.z0+x.z1)/2}).z,zWide1:y(T.ENTRY),zA:g.z,zWideA:y(g.z),zB:a.z,zF:(V("hanging")||{z:(d.z0+d.z1)/2}).z,zSqWide:M.find(t=>t>d.z0+20&&t<d.z1-20)??(d.z0+d.z1)/2,zLastWide:r(T.LEVEL)};P.zMidWide=r(P.zLastWide),P.belfryA=new k.Vector3(g.x,h.Y0+g.h-ge,g.z),P.belfryB=l(a.a,a.h-ge,a.z),P.squareFar=l(A,0,d.z1),P.crossing=l((c.a0+c.a1)/2,0,P.zWideA);const z=(e.outskirts&&e.outskirts.fields||[]).filter(t=>t.a0>=c.a0),E=t=>(t.kind==="orchard"?0:t.kind==="plots"?1e4:2e4)+Math.abs((t.a0+t.a1)/2-A),N=z.sort((t,p)=>E(t)-E(p))[0];P.parkKind=N?N.kind:"street end",P.park=N?l((N.a0+N.a1)/2,0,(N.z0+N.z1)/2):l((c.a0+c.a1)/2,0,h.Z_FULL1);const _=e.longs.filter(t=>t.zone==="foot"),I=.4*(_.length?Math.max(..._.map(t=>t.a1)):266),S=_.sort((t,p)=>Math.abs((t.a0+t.a1)/2-I)-Math.abs((p.a0+p.a1)/2-I))[0],v=e.cross.filter(t=>(t.aStart??0)<1&&t.z0>h.RING_Z).map(t=>(t.z0+t.z1)/2).sort((t,p)=>t-p)[0];return P.rise=l(S?(S.a0+S.a1)/2:I,0,v??h.RING_Z),P}function De(e){const s=e.belfryB.x-48,l=e.belfryB.y-7,g=x=>T.ENTRY_X+(s-T.ENTRY_X)*de((x-e.zHinge)/(e.zA+70-e.zHinge))+(h.RING_X-s)*de((x-e.zF)/(e.zLastWide-e.zF)),a=x=>T.ENTRY_Y+(l-T.ENTRY_Y)*de((x-e.zWide1)/(e.zB-e.zWide1))+(h.RING_Y-l)*de((x-e.zF)/(T.LEVEL-e.zF));let d=e.zHinge;for(;d<e.zA&&a(d)<e.belfryA.y;)d+=2;return{x:g,y:a,xPass:s,yTop:l,zOverA:d}}const je=[{name:"rose",core:"#ff8f6a",band:"#d9708a"},{name:"amber",core:"#ffa24e",band:"#e08a5a"}],Ye=[{name:"thin",density:9e-4},{name:"mid",density:.0011},{name:"thick",density:.0013}];function Ue(e,s){const l=x=>s.makeRng(s.hashSeed(x+":"+e))(),g=l("closing-walls"),a=l("closing-glow"),d=l("closing-haze");return{palette:["albi","girona","evora","ferrara"][Math.min(3,Math.floor(g*4))],glow:je[a<.5?0:1],haze:Ye[Math.min(2,Math.floor(d*3))]}}const te=e=>e.flat.z1,ue=e=>({x0:h.RING_X-15,x1:h.RING_X+15,y:h.Y0+3.5,z:te(e)+.25}),oe={lampR:15,round:19.5,lampY:h.Y0+1.5,n:8},ye=e=>{const s=ue(e),l=[{x:s.x0,y:s.y,z:s.z,kind:"gate"},{x:s.x1,y:s.y,z:s.z,kind:"gate"}];for(let g=0;g<oe.n;g++){const a=(g+.5)*2*Math.PI/oe.n;l.push({x:h.RING_X+oe.lampR*Math.cos(a),y:oe.lampY,z:h.RING_Z+oe.lampR*Math.sin(a),kind:"gate"})}return l},re=e=>{const s=(e.brink&&e.brink.steps||[]).filter(l=>l.a1>l.a0);return s.length?s[s.length-1].z1:h.Z_TIP},Xe=`
uniform vec4 uLat;        // the lamps' lattice: z0, step, the left row's x, the right row's x
uniform vec4 uLatB;       // the lamps' y; the kerb's width; the street mouths' own share of the hinge line; the rows' first lattice place
uniform vec2 uMouth[32];  // the street mouths on the hinge line (the plan's cross streets that meet it): z from and to; unused ones far off
uniform vec4 uRows;       // the left row's first and last lamp's z, then the right row's (the plan's own)
uniform vec3 uString;     // the bulb strings' stretch, z from and to, and their mean on the paving
uniform vec4 uPier;       // the street's end: the two pier lanterns' x, their y and their z
uniform vec4 uOnL; uniform vec4 uOnR;   // the rows' lamps as the plan stands them: 24 lattice places a component, a bit a place, from the place uLatB.w
uniform vec2 uGapL;       // the left row's gap: the hinge square's open side, z from and to
uniform vec2 uTownZ;      // the town's first house and its last street's end: the kerb and the arcades' light lie between
uniform vec4 uPool;       // the pools' colour and gain (the land's own)
uniform vec3 uBack; uniform vec3 uBand; uniform vec2 uGlowDir; uniform vec3 uLampC;
uniform vec4 uEnd;        // the street's end: the ring's foot x and z, the radius of its ring of lamps, the paved round's edge
uniform vec4 uField;      // the setts' band: its middle (x - 90) and half width; the pools' trim; the arcades' line (x - 90)
varying vec3 vPromW;
// the share of [c - fw / 2, c + fw / 2] covered by lines w wide, one every p, centred on the multiples of p
float pmLine(float c, float p, float w, float fw) {
  float a = c - 0.5 * fw + 0.5 * w, b = c + 0.5 * fw + 0.5 * w;
  float ia = floor(a / p) * w + min(a - p * floor(a / p), w), ib = floor(b / p) * w + min(b - p * floor(b / p), w);
  return clamp((ib - ia) / fw, 0.0, 1.0);
}
float pmHash(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
float pmJoint; float pmTilt; float pmFar; vec2 pmSlab; float pmPuddle; float pmRe; vec2 pmCe;
// the share of [c - fw / 2, c + fw / 2] covered by ONE line w wide centred on c0
float pmOne(float c, float c0, float w, float fw) { return clamp((min(c + 0.5 * fw, c0 + 0.5 * w) - max(c - 0.5 * fw, c0 - 0.5 * w)) / fw, 0.0, 1.0); }
float pmNoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(pmHash(i), pmHash(i + vec2(1.0, 0.0)), f.x), mix(pmHash(i + vec2(0.0, 1.0)), pmHash(i + vec2(1.0, 1.0)), f.x), f.y); }
// a lamp of a row stands where the plan stands one: the row's own bit at that lattice place (96 places a row from the
// place uLatB.w; each component holds 24 whole bits, exact in a float)
float pmOn(float lz, vec2 rz, float side) {
  float k = floor((lz - uLat.x) / uLat.y + 0.5) - uLatB.w;
  if (k < 0.0 || k > 95.0) return 0.0;
  vec4 m = side < 0.5 ? uOnL : uOnR;
  float w = floor(k / 24.0), b = k - 24.0 * w, word = w < 0.5 ? m.x : w < 1.5 ? m.y : w < 2.5 ? m.z : m.w;
  return floor(mod(floor(word / exp2(b)), 2.0));
}
vec3 promStone(vec3 base) {
  vec2 pq = vec2(vPromW.x - 90.0, vPromW.z), fw = max(fwidth(pq), vec2(0.0005));
  // THE FIELDS (unlike panels, each a rule of the plan's own metres): a MIDDLE BAND OF SETTS 6 m wide about the promenade's
  // axis (0.24 by 0.12 m), with no line along it; either side slab fields between the band
  // courses, two fields in five laid in half-size slabs (0.6 by 0.3 m), the rest in whole ones (1.2 by 0.6 m)
  vec2 panel = floor(pq / 9.6);
  float setts = step(abs(pq.x - uField.x), uField.y), small = step(pmHash(panel + 9.0), 0.4);
  float sc = mix(mix(1.0, 0.5, small), 0.2, setts), wj = mix(0.02 / sc, 0.05, setts);
  vec2 q = pq / sc, fq = fw / sc;
  float row = floor(q.y / 0.6), off = 0.6 * mod(row, 2.0), far = clamp(fq.y / 0.6, 0.0, 1.0);
  float jz = pmLine(q.y, 0.6, wj, fq.y);
  float jx = mix(pmLine(q.x + off, 1.2, wj, fq.x), 0.5 * (pmLine(q.x, 1.2, wj, fq.x) + pmLine(q.x + 0.6, 1.2, wj, fq.x)), far);
  float joint = jz + jx - jz * jx;
  float band = pmLine(pq.y, 9.6, 0.3, fw.y) * (1.0 - setts);   // (band courses ACROSS the promenade only, as on the land's slabs: no line runs down it)
  float drain = 0.0;   // NO LINE RUNS ALONG THE PROMENADE (the auditor's AU7): the setts' band has no drain course at its edges; it is read by its grain alone
  // THE PAVED ROUND about the ring's stepped base (to uEnd.w from the ring's foot): rings of setts 0.5 m wide, each sett
  // 0.5 m of the ring's own arc, inside a border course 0.4 m wide
  pmCe = vPromW.xz - uEnd.xy; pmRe = length(pmCe);
  float fr = max(fwidth(pmRe), 0.0005), inRound = step(pmRe, uEnd.w), edge = pmOne(pmRe, uEnd.w, 0.4, fr);
  joint = mix(joint, pmLine(pmRe, 0.5, 0.03, fr), inRound); band *= 1.0 - inRound; drain *= 1.0 - inRound;
  pmSlab = mix(vec2(row, floor((q.x + off) / 1.2)) + 13.0 * panel, vec2(floor(pmRe / 0.5), floor(atan(pmCe.y, pmCe.x) * pmRe / 0.5)), inRound);
  pmTilt = 1.0 - smoothstep(0.3, 1.2, max(fq.x, fq.y));       // a slab's own tone and tilt fade to their mean under a pixel
  pmJoint = max(max(joint, band), max(drain, edge));
  pmFar = smoothstep(8.0, 32.0, fw.y);                         // a footprint as long as the lamps' spacing (16 m) and more: the rows' own mean
  // A FEW PUDDLES: THE LAND'S OWN LAW (builder A's wetPuddle, in the metres both grounds share, so a puddle runs on across
  // the hinge line with no step; about a fifteenth of the paving); none on the setts' crown or the round. Standing water
  // that holds the afterglow: no joint shows in it, the stone x 0.6, F = min(0.6, 0.08 + 0.92 f^5) as on the land
  pmPuddle = wetPuddle(pq) * (1.0 - setts) * (1.0 - inRound);
  // a slab's own tone (to its mean under a pixel), its field's (one delivery: 13 in 100 either way), the setts' and the round's darker stone
  float tone = (1.0 + 0.16 * (pmHash(pmSlab) - 0.5) * pmTilt) * (1.0 + 0.26 * (pmHash(panel + 3.0) - 0.5) * (1.0 - setts) * (1.0 - smoothstep(4.8, 19.2, max(fw.x, fw.y))));
  // (NO DARK CENTRE LINE: the setts are the slabs' own stone and tone, read by their grain alone; the drains a fifth darker)
  tone *= mix(1.0, 0.84, inRound) * mix(1.0, 1.05, small * (1.0 - setts)) * mix(1.0, 0.8, drain) * mix(1.0, 0.5, edge) * mix(1.0, 0.6, pmPuddle);
  // the kerb on the hinge line, open at the street mouths and the hinge square
  float mouth = 0.0;
  for (int i = 0; i < 32; i++) mouth = max(mouth, step(uMouth[i].x, pq.y) * step(pq.y, uMouth[i].y));
  float open = max(mouth, step(uGapL.x, pq.y) * step(pq.y, uGapL.y));
  open = mix(open, uLatB.z, smoothstep(4.0, 16.0, fw.y));      // under a long footprint the mouths' own share of the line (the plan's)
  float kerb = clamp((pq.x + uLatB.y) / fw.x + 0.5, 0.0, 1.0) * clamp(-pq.x / fw.x + 0.5, 0.0, 1.0) * (1.0 - open) * step(pq.y, uTownZ.y);
  return base * tone * mix(1.0, 0.9, band) * mix(1.0, 0.5, joint * (1.0 - pmPuddle)) * mix(1.0, 0.82, kerb);
}
vec3 promGlow(vec3 albedo) {
  vec3 V = normalize(cameraPosition - vPromW);
  float ang = 6.2831853 * pmHash(pmSlab + 17.0);
  float tilt = 0.06 * pmTilt * (1.0 - pmPuddle);              // (standing water lies level)
  vec3 Ns = normalize(vec3(tilt * cos(ang), 1.0, tilt * sin(ang)));
  vec3 R = reflect(-V, Ns);
  float f = 1.0 - max(dot(Ns, V), 0.0), f2 = f * f, F = min(0.35, 0.05 + 0.95 * f2 * f2 * f);
  F = mix(F, min(0.6, 0.08 + 0.92 * f2 * f2 * f), pmPuddle);   // (standing water: the land's own law)
  float kz = floor((vPromW.z - uLat.x) / uLat.y + 0.5), pool = 0.0, spec = 0.0;
  // THE STREAKS' LAMPS: the sight line mirrored in the level paving reaches the lamps' height over the place
  // Q = P + (P - E) h / H (h the lamps' height over the paving, H the eye's); the three lamps a side nearest Q.z are
  // the ones whose streaks can lie here (the lobe decides; a lamp not taken only leaves its streak out)
  float kq = floor((vPromW.z + (vPromW.z - cameraPosition.z) * (uLatB.x - vPromW.y) / max(cameraPosition.y - vPromW.y, 0.5) - uLat.x) / uLat.y + 0.5);
  for (int i = 0; i < 6; i++) {
    float side = i < 3 ? 0.0 : 1.0, j = float(i < 3 ? i - 1 : i - 4), lx = mix(uLat.z, uLat.w, side);
    vec2 rz = mix(uRows.xy, uRows.zw, side);
    float lz = uLat.x + (kz + j) * uLat.y, sz = uLat.x + (kq + j) * uLat.y;
    vec2 dl = vec2(lx, lz) - vPromW.xz;
    float q = 1.0 + dot(dl, dl) / 36.0;
    pool += pmOn(lz, rz, side) * max(0.0, 1.0 / (q * sqrt(q)) - 0.02372);
    vec3 Lv = vec3(lx, uLatB.x, sz) - vPromW;
    float d2 = dot(Lv, Lv);
    spec += pmOn(sz, rz, side) * pow(max(dot(R, Lv * inversesqrt(d2)), 0.0001), 220.0) * 6.0 / (1.0 + d2 / 90.0);
  }
  spec *= 1.0 - pmFar;                                         // (under a long footprint the streaks are under the sight's grain: left out, never sparkling)
  // UNDER A LONG FOOTPRINT the pools are each row's own mean along z (the law summed along the row: 12 / (1 + dx^2 / 36)
  // a lamp, one lamp in 16 m, less the cut's share), so the far paving glows evenly and never sparkles
  vec2 dxr = vec2(uLat.z, uLat.w) - vPromW.x;
  vec2 rowMean = max(vec2(0.0), 0.75 / (1.0 + dxr * dxr / 36.0) - 0.09);   // (within 0.015 of the exact sum's mean from 0.6 to 19 m off the row)
  float inL = step(uRows.x, vPromW.z) * step(vPromW.z, uRows.y) * (1.0 - step(uGapL.x, vPromW.z) * step(vPromW.z, uGapL.y));
  pool = mix(pool, inL * rowMean.x + step(uRows.z, vPromW.z) * step(vPromW.z, uRows.w) * rowMean.y, pmFar);
  // the two pier lanterns of the street's end, by the same two laws, within their pools' 20 m
  if (vPromW.z > uPier.w - 20.0) for (int i = 0; i < 2; i++) {
    vec3 Lv = vec3(i == 0 ? uPier.x : uPier.y, uPier.z, uPier.w) - vPromW;
    float dg2 = dot(Lv.xz, Lv.xz), d2 = dot(Lv, Lv), q = 1.0 + dg2 / 36.0;
    pool += max(0.0, 1.0 / (q * sqrt(q)) - 0.02372);
    spec += pow(max(dot(R, Lv * inversesqrt(d2)), 0.0001), 220.0) * 6.0 / (1.0 + d2 / 90.0);
  }
  // the bulb strings' mean over their stretch (eased over 6 m at each end, about twice the bulbs' height over the paving)
  float bulbs = uString.z * smoothstep(uString.x - 6.0, uString.x + 6.0, vPromW.z) * (1.0 - smoothstep(uString.y - 6.0, uString.y + 6.0, vPromW.z));
  float w = (1.0 - smoothstep(0.10, 0.20, R.y)) * max(0.0, dot(R.xz, uGlowDir));
  // THE RING OF LAMPS on the base's first step (8, at 45 deg, none on the ring's axis): the 3 nearest, the pool law at
  // a low lamp's 4 m
  if (pmRe < uEnd.z + 24.0) { float kk = floor(atan(pmCe.y, pmCe.x) / 0.7853982);
    for (int i = -1; i <= 1; i++) { float a = (kk + 0.5 + float(i)) * 0.7853982; vec2 dl = uEnd.z * vec2(cos(a), sin(a)) - pmCe; float q = 1.0 + dot(dl, dl) / 16.0; pool += max(0.0, 1.0 / (q * sqrt(q)) - 0.02372); } }
  // WARM LIGHT OUT OF THE ARCADES (the curl's foot row, its lit bays on the line uField.w, 6 m beyond the hinge line:
  // e-folding 7 m across the paving, none at a street mouth or along the hinge square) and out of the right-hand
  // fronts' ground floors (the paving's own right edge, e-folding 4 m), inside the town's length
  float shut = 0.0;                                            // (no arcade at a street mouth: eased over 4 m beside it)
  for (int i = 0; i < 32; i++) shut = max(shut, 1.0 - smoothstep(0.0, 4.0, max(uMouth[i].x - vPromW.z, vPromW.z - uMouth[i].y)));
  shut = max(shut, smoothstep(uGapL.x - 4.0, uGapL.x, vPromW.z) * (1.0 - smoothstep(uGapL.y, uGapL.y + 4.0, vPromW.z)));
  float inTown = smoothstep(uTownZ.x, uTownZ.x + 6.0, vPromW.z) * (1.0 - smoothstep(uTownZ.y - 6.0, uTownZ.y, vPromW.z));
  float spill = inTown * (0.9 * exp(-(uField.w + 90.0 - vPromW.x) / 7.0) * (1.0 - shut) + 0.35 * exp(-(vPromW.x - 56.0) / 4.0));
  vec3 sheen = F * (spec * uPool.rgb + mix(uBack, uBand, w));   // (the streaks in the pools' own colour, as on the land: no step at the kerb)
  return (albedo * uPool.rgb * ((min(pool, 1.0) + bulbs + spill) * uPool.w * uField.z) + sheen) * mix(1.0, 0.35, pmJoint * (1.0 - pmPuddle));
}
`;function Ke(e,s){const l=ue(e),g=e.flat.lattice,a=e.flat.x0,d=e.flat.x1,x=h.Y0,R=[],A=[],V=(o,i,w,m,f,u)=>{const ae=R.length/3;for(let q=0;q<=u;q++)for(let C=0;C<=f;C++)R.push(o+(i-o)*C/f,x,w+(m-w)*q/u);for(let q=0;q<u;q++)for(let C=0;C<f;C++){const J=ae+q*(f+1)+C,se=J+1,ie=J+f+1,le=ie+1;A.push(J,ie,se,se,ie,le)}};V(a,d,T.PAVING_START,te(e),2,Math.ceil((te(e)-T.PAVING_START)/20)),re(e)<te(e)&&V(d,d+6,re(e),te(e),1,3);const M=new k.BufferGeometry;M.setAttribute("position",new k.Float32BufferAttribute(R,3));const y=new Float32Array(R.length);for(let o=1;o<y.length;o+=3)y[o]=1;M.setAttribute("normal",new k.BufferAttribute(y,3)),M.setIndex(A),M.computeBoundingSphere();const r=e.strings.filter(o=>o.kind==="promenade"),c=r.length?[Math.min(...r.map(o=>Math.min(o.z0,o.z1))),Math.max(...r.map(o=>Math.max(o.z0,o.z1)))]:[0,0],Z=new Set(["bracket","arcade","wall"]),P=o=>Math.round((o-g.z0)/g.step),z=o=>{const i=o.filter(w=>Z.has(w.kind)).map(w=>w.z);return i.length?[Math.min(...i),Math.max(...i)]:[1,0]},E=[e.lamps.filter(o=>Z.has(o.kind)&&o.a<8),e.flat.lamps.filter(o=>Z.has(o.kind))],N=z(E[0]),_=z(E[1]),I=P(Math.min(N[0],_[0]));let S=0;const v=E.map(o=>{const i=[0,0,0,0];for(const w of o){const m=P(w.z)-I;m<0||m>95?S++:i[Math.floor(m/24)]+=2**(m%24)*(i[Math.floor(m/24)]/2**(m%24)%2<1?1:0)}return new k.Vector4(i[0],i[1],i[2],i[3])}),t=h.TOWN_Z1??re(e),p=e.cross.filter(o=>(o.aStart??0)<1&&o.z1>h.TOWN_Z0&&o.z0<t).sort((o,i)=>o.z0-i.z0),W=p.slice(0,32).map(o=>new k.Vector2(o.z0,o.z1)),b=Math.max(0,p.length-32),K=W.reduce((o,i)=>o+i.y-i.x,0)/Math.max(1,t-h.TOWN_Z0);for(;W.length<32;)W.push(new k.Vector2(1e9,-1e9));const D={uMouth:{value:W},uLat:{value:new k.Vector4(g.z0,g.step,g.xL,g.xR)},uOnL:{value:v[0]},uOnR:{value:v[1]},uLatB:{value:new k.Vector4(g.y,.3,K,I)},uRows:{value:new k.Vector4(N[0],N[1],_[0],_[1])},uString:{value:new k.Vector3(c[0],c[1],r.length?.35:0)},uGapL:{value:new k.Vector2(g.gapL[0],g.gapL[1])},uPier:{value:new k.Vector4(l.x0,l.x1,l.y,l.z)},uTownZ:{value:new k.Vector2(h.TOWN_Z0,t)},uPool:s.landUniforms.uPool,uBack:s.lit.uBack,uBand:s.lit.uBand,uGlowDir:s.lit.uGlowDir,uLampC:{value:X("#ffd9a0")},uEnd:{value:new k.Vector4(h.RING_X,h.RING_Z,oe.lampR,oe.round)},uField:{value:new k.Vector4((a+d)/2-h.HX,3,.7,6)}},H=new k.MeshLambertMaterial({color:X("#8a8078")});H.onBeforeCompile=o=>{Object.assign(o.uniforms,D),o.vertexShader=o.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vPromW;`).replace("#include <begin_vertex>",`#include <begin_vertex>
  vPromW = (modelMatrix * vec4(transformed, 1.0)).xyz;`),o.fragmentShader=o.fragmentShader.replace("#include <common>",`#include <common>
`+Ge+Xe).replace("#include <color_fragment>",`#include <color_fragment>
  diffuseColor.rgb = promStone(diffuseColor.rgb);`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
  totalEmissiveRadiance += promGlow(diffuseColor.rgb);`)},H.customProgramCacheKey=()=>"closing-promenade";const F=new k.Mesh(M,H);return F.name="closing-promenade",{mesh:F,tris:A.length/3,uniforms:D,holesOver:S,mouthsOver:b,dispose(){M.dispose(),H.dispose()}}}function Je(e,s){const l=ue(s),g=te(s),a=new Ne,d=X("#8a8078"),x=X("#a39a8c"),R=X("#4a443e"),A=X("#fff0c8"),V=X("#a39a8c").multiplyScalar(.28),M=X("#8a8078").multiplyScalar(.28),y=h.Y0,r=48,c=[16,14,12.5],Z=.4;a.body(-1,0,{x:h.RING_X,y,z:h.RING_Z,yaw:0}),a.look(0);for(let v=0;v<3;v++){const t=c[v],p=v<2?c[v+1]:0,W=Z*v,b=W+Z;for(let K=0;K<r;K++){const D=2*Math.PI*K/r,H=2*Math.PI*(K+1)/r,F=(D+H)/2,o=Math.cos(D),i=Math.sin(D),w=Math.cos(H),m=Math.sin(H);if(a.quad([t*o,W,t*i],[t*w,W,t*m],[t*w,b,t*m],[t*o,b,t*i],x,[Math.cos(F),0,Math.sin(F)]),p)a.quad([t*o,b,t*i],[t*w,b,t*m],[p*w,b,p*m],[p*o,b,p*i],d,[0,1,0]);else{a.look(7);const f=[12.5,9,5.5,2];for(let u=0;u<3;u++)a.quad([f[u]*o,b,f[u]*i],[f[u]*w,b,f[u]*m],[f[u+1]*w,b,f[u+1]*m],[f[u+1]*o,b,f[u+1]*i],(K+u)%2?V:M,[0,1,0]);a.tri([2*o,b,2*i],[2*w,b,2*m],[0,b,0],V,[0,1,0]),a.look(0)}if(v===0&&Math.abs(Math.cos(F))>.5556){const f=t-.4,u=b+.55;a.quad([t*o,b,t*i],[t*w,b,t*m],[t*w,u,t*m],[t*o,u,t*i],x,[Math.cos(F),0,Math.sin(F)]),a.quad([f*o,b,f*i],[f*w,b,f*m],[f*w,u,f*m],[f*o,u,f*i],x,[-Math.cos(F),0,-Math.sin(F)]),a.quad([t*o,u,t*i],[t*w,u,t*m],[f*w,u,f*m],[f*o,u,f*i],d,[0,1,0])}}}for(const v of ye(s).slice(2))a.body(-1,0,{x:v.x,y:y+Z,z:v.z,yaw:0}),a.look(0),a.box(-.12,.12,0,.9,-.12,.12,x),a.look(7,4),a.box(-.16,.16,.9,1.3,-.16,.16,A),a.look(0),a.pyramid(-.22,.22,-.22,.22,1.3,.15,R);const P=a.tris;a.body(-1,0,{x:0,y,z:g,yaw:0}),a.look(0);const z=s.flat.x1+6,E=Math.min(-.5,re(s)-g);a.box(45,z+.5,0,.98,0,.5,x),a.box(44.92,z+.58,.98,1.1,-.08,.58,d,!0),a.box(z,z+.5,0,.98,E+.5,0,x),a.box(z-.08,z+.58,.98,1.1,E+.58,-.08,d,!0),a.box(s.flat.x1,z+.5,0,.98,E,E+.5,x),a.box(s.flat.x1-.08,z+.58,.98,1.1,E-.08,E+.58,d,!0);for(const v of[l.x0,l.x1])a.body(-1,0,{x:v,y,z:l.z,yaw:0}),a.look(0),a.box(-.4,.4,0,3.1,-.4,.4,x),a.box(-.5,.5,3.1,3.25,-.5,.5,d,!0),a.look(7,4),a.box(-.25,.25,3.25,3.8,-.25,.25,A),a.look(0),a.pyramid(-.34,.34,-.34,.34,3.8,.2,R);const N=a.tris,_=X("#3a332c");for(const v of s.flat.trees)v.where==="promenade"&&(a.body(-1,0,{x:v.x,y,z:v.z,yaw:0}),a.look(0),a.quad([-1,.03,-1],[1,.03,-1],[1,.03,1],[-1,.03,1],x,[0,1,0]),a.quad([-.8,.05,-.8],[.8,.05,-.8],[.8,.05,.8],[-.8,.05,.8],_,[0,1,0]));const I=a.geometry();I.computeBoundingSphere();const S=new k.Mesh(I,e.house.colour);return S.name="closing-streets-end",{mesh:S,tris:N,furniture:a.tris-N,baseTris:P,dispose(){I.dispose()}}}var nt={id:"city-closing-overhead",name:"The Town That Curls Overhead",category:"screen",placeKind:"city",screen:"Inception",screenYear:"2010",screenKind:"film",media:["air","open"],weirdness:.55,async build(e){const s=new k.Scene,l=n=>e.core.makeRng(e.core.hashSeed(n+":"+e.seed)),g=e.vary||{},a=Math.min(1,Math.max(.7,g.density??1)),d=Ue(e.seed,e.core),x=We[d.palette],R=_e(e,{look:d});s.add(R.sky.object);for(const n of R.lights)s.add(n),n.target&&s.add(n.target);s.fog=new k.FogExp2(R.fogColor,d.haze.density),await e.yield();const A=Me(Ee),V=Ae(.15,.7),M={house:ce(A,"house",{night:R.night.house}),tree:ce(A,"tree",{night:R.night.tree,sway:V})};await e.yield();const y=await Oe(e);await e.yield();const r=Ze(y,A.knots),c=De(r),Z=[];for(let n=T.ENTRY;n<=T.RING+1e-6;n+=10)Z.push([c.x(n),c.y(n),n]);const P=Re(Z),z=P.length,E=(()=>{const n=[0];for(let L=1;L<=T.RING;L++)n.push(n[L-1]+Math.hypot(c.x(L)-c.x(L-1),c.y(L)-c.y(L-1),1));return L=>z*n[Math.min(T.RING,Math.max(0,Math.round(L)))]/n[T.RING]})();await e.yield();const N=await pe(y,e);await e.yield();const _=await pe(y.flat,e);await e.yield();const I=await qe(e,{bend:A,plan:y,tex:N,flatTex:_,light:R});s.add(I.group),await e.yield();const S=await Ie(e,{bend:A,plan:y,pal:x,materials:M});s.add(S.group),await e.yield();const v=await Fe(e,{light:R,plan:y});s.add(v.group),await e.yield();const t=await Be(e,{bend:A,plan:y,light:R,chimneys:S.chimneys,far:v.lights,own:ye(y)});s.add(t.group),await e.yield();const p=Ke(y,R);s.add(p.mesh),await e.yield();const W=Je(M,y);s.add(W.mesh),await e.yield();const b=40,K=600,D=-170,H=te(y),F=y.flat.x1+6,o=14,i=await Se(e,{house:M.house,tree:M.tree,pal:x,most:18e3,inside:()=>!0,dist:()=>0,areas:[[[D-b-550,D-b,h.TOWN_Z0,h.TOWN_Z0+Math.ceil((H-h.TOWN_Z0)/140)*140]],[[D-b-550,D-b-550+880,H+o,H+o+560],[F+o,F+o+660,re(y)+o,re(y)+o+560]]]});s.add(i.group),await e.yield();const w="#141a33",m=await Pe({species:"starlings",form:"murmuration",rng:l("closing-starlings"),count:Math.round(600*a),size:2,speed:12,center:[-60,96,900],radius:30,height:4,wobble:.2,spread:[20,9,16],maxSigma:3,wander:[.8,.4,.6,.4],morph:3,bands:.3,body:w,belly:w,wingC:w,trail:w,tip:w,beak:w,head:w,rim:0,translucency:0,light:{sunDir:[0,1,0],sunColor:"#000000",sunIntensity:0,sky:"#ffffff",skyIntensity:Math.PI,ground:"#ffffff",groundIntensity:Math.PI},keepClear:{path:P,dist:20,from:E(r.zSqWide)/z,to:E(T.LEVEL)/z,step:2}},e.yield);s.add(m.object),await e.yield();const f=await He(e,{bend:A,plan:y,path:P,chimneys:S.chimneys});s.add(f.group),await e.yield();const u=(n,L,G)=>new k.Vector3(n,L,G),ae=[],q=(n,L,G,O,$,ee,ne=0)=>{const Q=E(G)-ne,B=E(O),j={name:n,from:G,to:O,eyeY:[+c.y(G).toFixed(1),+c.y(O).toFixed(1)],weight:$};return ae.push(j),{at:()=>L,from:Q/z,to:B/z,fade:Math.min(.45,ee/(B-Q)),weight:$,rec:j}},C=R.lit.uGlowDir.value,J=u(c.x(r.zF),c.y(r.zF),r.zF),se=n=>{let L=-2,G=null;for(const O of v.lights){if(O.kind!==n)continue;const $=O.x-J.x,ee=O.z-J.z,ne=($*C.x+ee*C.y)/Math.hypot($,ee);ne>L&&(L=ne,G=u(O.x,O.y,O.z))}return G},ie=se("hamlet")||se("village")||se("farm")||u(J.x+3200*C.x,h.Y0+150,J.z+3200*C.y),le=[q("the ceiling's wide crossing",r.crossing,T.ENTRY,r.zHinge,.3,60,120),q("tower A's belfry",r.belfryA,r.zHinge,c.zOverA,.5,60),q("the hanging tower's belfry",r.belfryB,r.zHingeF,r.zB,.6,110),q("the hanging square's far end",r.squareFar,r.zB,r.zSqWide,.45,60),q("the open side's hills",ie,r.zF,r.zMidWide,.4,80),q("a park of the hanging town ("+r.parkKind+")",r.park,r.zSqWide,T.LEVEL,.6,110),q("the rise beside the ring",r.rise,r.zLastWide,T.RING_CLEAR,.35,60)];{const n=u(0,0,0),L=u(0,0,0),G=u(0,0,0),O=u(0,0,0),$=e.core.bell,ee=e.core.smoothstep,ne=(B,j)=>{const Y=B/z;P.posAtDist(B,n),P.posAtDist(Math.min(z,B+30),L),G.subVectors(L,n).normalize();const he=ee(0,.04,Y)*(1-ee(.93,.985,Y));for(const U of le){const fe=$(Y,U.from,U.to,U.fade)*U.weight*he;fe<=.001||(j.push(U),O.copy(U.at()).sub(n).normalize(),G.multiplyScalar(1-fe).addScaledVector(O,fe).normalize())}return Math.asin(G.y)/Ce};let Q=0;for(let B=0;B<60;B++){Q=0;let j=null;for(let Y=0;Y<=z;Y+=5){const he=[],U=ne(Y,he);U>Q&&(Q=U,j=he)}if(Q<=Ve||!j||!j.length)break;for(const Y of j)Y.weight*=.9}for(const B of le)B.rec.weight=+B.weight.toFixed(3),delete B.rec;ae.lift=+Q.toFixed(1),await e.yield()}const ve=E(r.zHinge),xe=E(r.zA),ze=E(T.LEVEL),be=E(T.RING),Le=n=>.6+.4*we(n*z,ve,xe)-.12*we(n*z,ze,be),me=new k.PerspectiveCamera(66,16/9,.5,6e3);me.position.set(c.x(0),c.y(0),0),me.lookAt(c.x(30),c.y(30),30),me.updateMatrixWorld(),await R.prewarm(e.renderer,me,s),s.userData.closing={look:d,length:z,dens:a,looks:ae,lift:ae.lift,route:{x:c.x,y:c.y,xPass:c.xPass,yTop:c.yTop},places:r,own:{promenade:p.tris,lampHolesOver:p.holesOver,mouthsOver:p.mouthsOver,streetsEnd:W.tris,furniture:W.furniture,plain:i.tris,plainCount:i.count,birds:m.triangles,birdCount:m.count,flockKept:m.kept&&{need:m.kept.need,moved:m.kept.moved,short:m.kept.short}},parts:{land:I.tris,town:S.tris,townCount:S.count,far:v.tris,glow:t.tris,glowCount:t.count},life:f.stats};function ke(n,L,G,O){V.uSwayP.value.x=L,R.update(n,L,G),t.update(L),f.update(n,L,G,O),m.update(n,L)}return{scene:s,path:P,duration:56,camera:{fov:66,near:.5,far:6e3,lookAhead:30,sway:0,bank:0},pois:le,pace:Le,portal:{shape:"circle",radius:h.RING_R,color:"#ffe4bd",glow:1},post:R.post,ride:"none",companion:"none",style:"none",update:ke,dispose(){p.dispose(),W.dispose(),m.geometry.dispose(),m.material.dispose(),f.dispose();for(const n of i.group.children)n.geometry.dispose();I.dispose(),S.dispose(),v.dispose(),t.dispose(),R.dispose();for(const n of[M.house,M.tree])n.dispose?n.dispose():(n.colour.dispose(),n.depth.dispose());N.mean.dispose(),N.cls.dispose(),_.mean.dispose(),_.cls.dispose()}}}};export{Ue as dealLooks,nt as default};
