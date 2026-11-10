import*as T from"three";import{makePath as Ke}from"../kit/core.js";import{makeSky as je}from"../kit/sky.js";import*as v from"../parts/flavian-amphitheatre.js";const fe=v.SEATING,Ae=v.ARENA,M=v.M,Mt=v.DEG,ne=u=>new T.Color(u),Ye="#ffdfb4",Ze=1.42,Xe="#92abda",Qe=.3,Je="#e6c99c",et=.18,tt="#c6ccd4",ot=11e-5,at=0,oe={EL:[32,34.4],BEARING:[86,88]},Ee="#e8dfc9",Me="#cfae70",Ne="#b07a66",_e="#8a6252",st=.3;var Nt={id:"flavian-amphitheatre",name:"The New Amphitheatre",category:"wonders",placeKind:"city",place:"Rome",year:"AD 80",media:["air"],weirdness:.1,async build(u){const{clamp:D,smoothstep:K}=u.core,B=F=>u.core.makeRng(u.core.hashSeed("amphitheatre-"+F+":"+u.seed)),H={vary:B("vary"),cloth:B("cloth"),town:B("town"),hills:B("hills"),far:B("far-city"),people:B("people-outside"),sky:B("sky"),shade:B("cloud-shade"),arcades:B("arcades"),air:B("air"),altar:B("altar")},N=u.vary||{},$=D(N.density??1,.7,1.3),_=u.quality?u.quality.detail:1,O=H.vary(),C=N.mood??O,r=!!N.rare;let A=H.vary.range(oe.EL[0],oe.EL[1]);(N.hour==="dawn"||N.hour==="golden")&&(A=oe.EL[0]+(A-oe.EL[0])*.3),N.hour==="day"&&(A=oe.EL[0]+(oe.EL[1]-oe.EL[0])*.7+(A-oe.EL[0])*.3);const k=oe.BEARING[0]+(A-oe.EL[0])/(oe.EL[1]-oe.EL[0])*(oe.BEARING[1]-oe.BEARING[0]),U=new T.Vector3(...v.sunVector(A,k)),W=r?1.2:M.CLOTH_DRAW_MIN+($-.7)/.6*(M.CLOTH_DRAW_MAX-M.CLOTH_DRAW_MIN),d=C<.8?2:3,b=H.cloth()<.62,m=st*(1-C),y=F=>"#"+ne(F).lerp(ne(Ee),m).getHexString(),w=(b?[Me,Ne,_e]:[Ne,Me,_e]).map(y),P=v.clothRuns(H.cloth,d),x=(()=>{const F=ne(Ee),L=v.RIG.SHADE.TINT;return .2126*Math.pow(F.r,L)+.7152*Math.pow(F.g,L)+.0722*Math.pow(F.b,L)})(),I=new T.Scene,e={uSun:{value:U},uSunCol:{value:ne(Ye).multiplyScalar(Ze)},uSkyCol:{value:ne(Xe).multiplyScalar(Qe)},uBounceCol:{value:ne(Je).multiplyScalar(et)},uHaze:{value:new T.Vector4(...ne(tt).toArray(),ot)},uTime:{value:0},uCloth:{value:new T.Vector4(1-W/v.RIG.SPAN,v.RIG.SHADE.THROUGH,1/x,0)},uClothCol:{value:w.map(F=>ne(F))},uClothTex:{value:null},uArc:{value:new T.Vector4(v.ARC.c2,v.ARC.c4,0,0)},uCloudAt:{value:new T.Vector2(H.shade()*64,H.shade()*64)}};{const F=new Uint8Array(M.MASTS*4),L=[ne(Ee),...w.map(Y=>ne(Y))];for(let Y=0;Y<M.MASTS;Y++){const q=L[P.kind[Y]],ee=P.tone[Y];F[Y*4]=Math.min(255,Math.round(q.r*ee*255)),F[Y*4+1]=Math.min(255,Math.round(q.g*ee*255)),F[Y*4+2]=Math.min(255,Math.round(q.b*ee*255)),F[Y*4+3]=255}const V=new T.DataTexture(F,M.MASTS,1,T.RGBAFormat);V.magFilter=V.minFilter=T.NearestFilter,V.generateMipmaps=!1,V.needsUpdate=!0,e.uClothTex.value=V}await u.yield();const c=je({rng:H.sky,preset:"day",sunDirection:U,zenith:"#143c98",mid:"#4d82d2",horizon:"#c6d6e8",horizonPow:4.4,scatterColor:"#fbe7c6",scatter:.8,scatterPow:3.2,scatterHigh:.2,sunColor:"#ffe9c4",sunSize:1.4,sunIntensity:9,sunGlow:.7,clouds:{coverage:.36,softness:.3,scale:.34,opacity:.96,detail:.5,haze:.13,absorb:1.9,lit:"#fff5e4",shade:"#74819f"},clouds2:!1});I.add(c.object),I.fog=null,await u.yield();const h=Ke(v.routePoints()),n=h.length,s=v.flightPlan(h),o=s.place,p=s.pace,S=s.pois;await u.yield();const f={U:e,sunV:U,draw:W,rare:r,mood:C,density:$,detail:_,seats:fe.READY!==!0},l=await v.buildHero(u,f);I.add(l.object);const a=()=>({object:new T.Group,info:{triangles:0,calls:0,pieces:{},people:{}},update(){},dispose(){}});await u.yield();const t=fe.READY===!0?await fe.buildSeating(u,l,f):a();I.add(t.object),await u.yield();const i=Ae.READY===!0?await Ae.buildArena(u,l,f):a();I.add(i.object),await u.yield();const E={marks:new Float32Array(4*me),uMarks:{value:null},uMarkN:{value:0},uCrowd:{value:fe.READY===!0?1:0}};E.uMarks.value=E.marks;const g=await kt(u,{U:e,R:H,stream:B,density:$,detail:_,path:h,scene:I,water:E});return await u.yield(),{scene:I,path:h,duration:s.duration,pace:p,pois:S,style:"none",ride:"none",companion:"none",camera:{near:.5,far:9e3,sway:.6,bank:.5},portal:{shape:"circle",radius:M.RING_R,color:"#ffc76a",glow:.8,tilt:!0},post:{exposure:1,bloom:{strength:.16,radius:.5,threshold:1.25},grade:{saturation:1.05,contrast:1.05,tint:"#fffaf0",shadowTint:"#0a1230",vignette:.2,grain:.015,aberration:0}},info:{length:n,PLACE:o,sunEl:A,sunBearing:k,draw:W,rare:r,mood:C,density:$,parts:l.info,valley:g.info,seating:t.info,arena:i.info,seatingReady:fe.READY===!0,arenaReady:Ae.READY===!0},update(F,L,V){e.uTime.value=L,i.marks&&(E.uMarkN.value=Math.min(me,i.marks(L,E.marks)|0)),c.update(F,L,V),l.update(F,L,V),t.update(F,L,V),i.update(F,L,V),g.update(F,L,V)},dispose(){c.dispose?.(),e.uClothTex.value?.dispose(),l.dispose(),t.dispose(),i.dispose(),g.dispose()}}}};const z=v.VALLEY,pe=`
uniform sampler2D uTownH; uniform vec4 uTownBox;
float townSun(vec3 P) {
  vec2 uv = (P.xz - uTownBox.xy) * uTownBox.zw;
  if (uv.x < 0. || uv.x > 1. || uv.y < 0. || uv.y > 1.) return 1.;
  vec2 dir = normalize(uSun.xz); float k = uSun.y / max(length(uSun.xz), 1e-3), lit = 1.;
  for (int i = 0; i < 5; i++) {
    float t = float(i), sl = 1.1 + t * (1.2 + t * .45);
    float h = texture2D(uTownH, (P.xz + dir * sl - uTownBox.xy) * uTownBox.zw).r * 63.75;
    lit = min(lit, smoothstep(-.7, .25, P.y + k * sl - h));
  }
  return lit;
}`,Re={SLOW:.029,QUICK:.013,SHRUB:.35},Le=(()=>{const u=v.SKYSHADE.DRIFT,D=Math.hypot(u[0],u[1]),K=B=>B.toFixed(4);return`
vec2 stir(vec2 p, float t) { return vec2(${K(u[0]/D)}, ${K(u[1]/D)}) * (${K(Re.SLOW*D)} * sin(t * 1.3 + p.x * .13 + p.y * .09) + ${K(Re.QUICK*D)} * sin(t * 3.1 + p.x * .7 + p.y * .5)); }`})(),Pe=`
${Le}
vec3 gardenAlb(vec2 q, vec2 bed) {
  vec2 c = floor(q / bed), f = q - c * bed; float h = hash21(c + 3.7), fw = max(fwidth(q.x), fwidth(q.y));
  float path = 1. - smoothstep(.7, .95 + fw, min(min(f.x, bed.x - f.x), min(f.y, bed.y - f.y)));
  vec3 gravel = vec3(.58, .53, .43), earth = vec3(.4, .33, .24), lawn = vec3(.2, .26, .11), plant = vec3(.09, .14, .06);
  // (order three, addendum 6, point 5: A BED IS A BED: a clipped box edging round it, dark and
  // 0.8 m wide, and inside it shrubs in round clumps on dark earth or on grass, or plain grass; no stripes)
  float inner = min(min(f.x, bed.x - f.x), min(f.y, bed.y - f.y));
  float box = (1. - smoothstep(1.65, 1.8 + fw, inner)) * (1. - path);
  vec2 cq = f / 2.3, ci = floor(cq), cf = fract(cq) - .5 - (vec2(hash21(ci + c * 7.1), hash21(ci + c * 3.3 + 5.1)) - .5) * .45;
  // the shrubs stir in the wind by the one law (stir): a clump leans by its freedom, STIR.SHRUB, at its own place
  cf -= stir(c * bed + (ci + .5) * 2.3, uTime) * ${(Re.SHRUB/2.3).toFixed(4)};
  float clump = mix(1. - smoothstep(.2, .36, length(cf)), .4, smoothstep(.4, 1.6, fw));
  vec3 bedc = h < .4 ? mix(earth * .8, plant * 1.3, clump) : h < .72 ? lawn * (.85 + .3 * vnoise(q * .8)) : mix(lawn, plant * 1.25, clump);
  bedc = mix(bedc, vec3(.065, .115, .05) * (.85 + .3 * vnoise(q * 2.3)), box);
  return mix(bedc, gravel, path) * (.9 + .2 * vnoise(q * .35));
}`,re=v.marketPlan(),$e=v.marketMore(),nt=`  // the stalls of the rows beside the way: the same square shade, a row by its place across the way and its first and last stall
  for (int j = 0; j < 2; j++) {
    vec2 q = p - sd * (j == 0 ? 2.4 : 1.2) * k - w0; float t = dot(q, wa), sx = q.x * wa.y - q.y * wa.x, tk = (t - ${(v.MARKET.STALL.W/2).toFixed(2)}) / ${v.MARKET.STALL.EVERY.toFixed(2)};
${$e.rows.map(u=>`    { float kk = clamp(floor(tk + .5), ${u.k0.toFixed(1)}, ${u.k1.toFixed(1)}); lit = min(lit, .3 + .7 * smoothstep(-.15, .3, max(abs(tk - kk) * ${v.MARKET.STALL.EVERY.toFixed(2)} - ${(v.MARKET.STALL.W/2).toFixed(2)}, abs(sx - ${u.s.toFixed(2)}) - ${(v.MARKET.STALL.D/2).toFixed(2)}))); }`).join(`
`)}
  }
`,it=`
float pineRowShade(vec2 p, vec4 row, vec3 par) {
  vec2 o = row.xy, a = row.zw, sd = -uSun.xz / max(length(uSun.xz), 1e-3); float k = length(uSun.xz) / max(uSun.y, .1), lit = 1.;
  float k0 = floor(dot(p - sd * ${(.86*(v.MARKET.PINE.H[0]+v.MARKET.PINE.H[1])/2).toFixed(1)} * k - o, a) / par.x + .5);
  for (int i = -1; i <= 1; i++) {
    float kk = k0 + float(i);
    if (kk < 0. || kk > par.y - .5) continue;
    float h = ${v.MARKET.PINE.H[0].toFixed(1)} + ${(v.MARKET.PINE.H[1]-v.MARKET.PINE.H[0]).toFixed(1)} * fract(kk * .618034 + par.z);
    float r = ${v.MARKET.PINE.R[0].toFixed(2)} + ${(v.MARKET.PINE.R[1]-v.MARKET.PINE.R[0]).toFixed(2)} * fract(kk * .414214 + par.z * 2.3);
    vec2 foot = o + a * kk * par.x, c = p - foot; float along = dot(c, sd), miss = abs(c.x * sd.y - c.y * sd.x), reach = h * .86 * k;
    // the crown: a disc, a little longer along the sun's way (its depth), its rim broken by the needles' tufts
    vec2 e = vec2((along - reach) / (r * 1.22), miss / r); float dd = length(e) + .1 * (vnoise(p * .9) - .5);
    lit = min(lit, .22 + .78 * smoothstep(.8, 1.06, dd));
    // the stem
    if (along > 0. && along < reach) lit = min(lit, .3 + .7 * smoothstep(.22, .55, miss));
  }
  return lit;
}
float marketSun(vec2 p) {
  float lit = 1.;
${re.rows.map(u=>`  lit = min(lit, pineRowShade(p, vec4(${u.ox.toFixed(3)}, ${u.oz.toFixed(3)}, ${u.ax.toFixed(5)}, ${u.az.toFixed(5)}), vec3(${u.every.toFixed(1)}, ${u.n.toFixed(1)}, ${u.phase.toFixed(2)})));`).join(`
`)}
  // the stalls: in the way's own measures (t along it, s across it); a stall's cloth 2.4 m up throws its square
  vec2 w0 = vec2(${re.way.x.toFixed(3)}, ${re.way.z.toFixed(3)}), wa = vec2(${re.way.dx.toFixed(5)}, ${re.way.dz.toFixed(5)});
  vec2 sd = -uSun.xz / max(length(uSun.xz), 1e-3); float k = length(uSun.xz) / max(uSun.y, .1);
  for (int j = 0; j < 2; j++) {
    vec2 q = p - sd * (j == 0 ? 2.4 : 1.2) * k - w0; float t = dot(q, wa), sx = q.x * wa.y - q.y * wa.x;
    float tk = (t - ${(v.MARKET.STALL.W/2).toFixed(2)}) / ${v.MARKET.STALL.EVERY.toFixed(2)}, kk = floor(tk + .5);
    if (kk < 0. || kk > ${(re.stalls.length/2-1).toFixed(1)}) continue;
    float da = abs(tk - kk) * ${v.MARKET.STALL.EVERY.toFixed(2)} - ${(v.MARKET.STALL.W/2).toFixed(2)}, ds = abs(abs(sx) - ${(v.MARKET.WAY+v.MARKET.STALL.D/2).toFixed(2)}) - ${(v.MARKET.STALL.D/2).toFixed(2)};
    lit = min(lit, .3 + .7 * smoothstep(-.15, .3, max(da, ds)));
  }
${nt}  return lit;
}
// dark basalt paving: many sided blocks about 1.1 m across, each its own tone, the joints filled with pale dust
// (the blocks melt into one tone where a block is under a pixel)
vec3 basaltAt(vec2 p) {
  vec2 q = p / 1.15, i = floor(q), f = fract(q); float d1 = 9., d2 = 9., id = 0.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y)); float d = length(g + .15 + .7 * vec2(hash21(i + g), hash21(i + g + 17.3)) - f);
    if (d < d1) { d2 = d1; d1 = d; id = hash21(i + g + 5.1); } else if (d < d2) d2 = d;
  }
  float joint = 1. - smoothstep(.03, .12, d2 - d1), melt = smoothstep(.25, .8, fwidth(q.x) + fwidth(q.y));
  vec3 stone = vec3(.205, .21, .225) * (.74 + .52 * id);
  return mix(mix(stone, vec3(.36, .33, .28), joint * .8), vec3(.225, .225, .232), melt) * (.86 + .28 * fbm2(p * .045 + 3.));
}`,rt=`
varying vec3 vW;
${v.LIGHT_GLSL}
${v.NOISE_GLSL}
${pe}
${Pe}
${it}
void main() {
  float d = famD(vW.xz, 60.);
  if (d < ${(M.RING_DEPTH-1).toFixed(1)}) discard;
  float e = d - ${M.RING_DEPTH.toFixed(1)};
  vec2 p = vW.xz;
  vec3 N = normalize(cross(dFdx(vW), dFdy(vW))); if (N.y < 0.) N = -N;
  // the travertine pavement, 17.5 m wide, in slabs; grey basalt paving beyond the posts over the whole open ground and
  // along the wider street to the east gate
  float ang = atan(p.y, p.x);
  // (slabs about 3.3 m by 2.9 m in six courses round the building: CHOSEN, the research gives the band's width
  // alone; each its own tone, the joints melted where a slab is under a few pixels)
  vec2 slab = vec2(ang * 30. + .5 * floor(e / 2.917), e / 2.917);
  vec2 sf = abs(fract(slab) - .5);
  float joint = smoothstep(.45, .5, max(sf.x, sf.y)) * (1. - smoothstep(.1, .45, max(fwidth(slab.x), fwidth(slab.y))));
  vec3 trav = vec3(.73, .685, .585) * (.86 + .24 * hash21(floor(slab))) * (.95 + .1 * vnoise(p * .7)) * (1. - .34 * joint);
  vec3 basalt = basaltAt(p);
  float pave = 1. - smoothstep(${M.PAVE_W.toFixed(1)} - .15, ${M.PAVE_W.toFixed(1)} + .15, e);
  float plaza = 1. - smoothstep(${(z.PLAZA-2).toFixed(1)}, ${(z.PLAZA+1).toFixed(1)}, e);
  float street = (1. - smoothstep(${z.STREET_HALF.toFixed(1)} - .3, ${z.STREET_HALF.toFixed(1)} + .3, abs(p.y))) * step(0., p.x) * (1. - smoothstep(${(z.TOWN.X1-40).toFixed(1)}, ${z.TOWN.X1.toFixed(1)}, p.x));
  // the town's lanes: trodden earth and rough paving, mostly in the houses' shade
  float inTown = step(${z.TOWN.XW.toFixed(1)}, p.x) * step(p.x, ${z.TOWN.X1.toFixed(1)}) * step(${z.TOWN.Z0.toFixed(1)}, p.y) * step(p.y, ${z.TOWN.Z1.toFixed(1)});
  inTown *= max(step(${z.TOWN.X0.toFixed(1)}, p.x), step(${z.S_FOOT.toFixed(1)}, p.y));
  // (order two: trodden pale earth and worn paving stones, a darker wet line down the lane's middle)
  vec3 lane = mix(vec3(.47, .42, .34), vec3(.36, .34, .32), smoothstep(.35, .7, vnoise(p * .45))) * (.82 + .36 * vnoise(p * 2.3));
  // the hills' slopes (grass, scrub and garden earth) and their level tops (gravel and beaten earth)
  float slope = 1. - smoothstep(.985, .998, N.y);
  vec3 green = mix(vec3(.2, .24, .11), vec3(.33, .31, .17), fbm2(p * .06));
  vec3 earth = mix(vec3(.36, .32, .25), vec3(.46, .41, .32), fbm2(p * .05));
  // the far city: roofs in haze, drawn flat (terracotta, ochre and plaster in small cells with the lanes dark between)
  vec2 rc = p / 13. + .35 * vec2(vnoise(p * .011), vnoise(p * .011 + 5.));
  vec2 rf = abs(fract(rc) - .5); float rh = hash21(floor(rc));
  vec3 roofs = mix(vec3(.5, .27, .17), vec3(.62, .46, .3), rh) * (1. - .55 * smoothstep(.36, .5, max(rf.x, rf.y)));
  roofs = mix(roofs, green, step(.82, hash21(floor(rc / 5.) + 3.)));
  float r = length(p);
  // (painted flat only beyond the true far roofs, which stand to ${v.FARCITY.R_END} m: nearer, the ground between them is yards'
  // trodden earth and garden green)
  float city = smoothstep(${(v.FARCITY.WIDE.end-160).toFixed(1)}, ${(v.FARCITY.WIDE.end+40).toFixed(1)}, r) * (1. - inTown) * (1. - smoothstep(3200., 5600., r));
  city *= smoothstep(.16, .4, fbm2(p * .0016 + 2.));
  // (order three, addendum 8: far off the single roofs melt: whole quarters each in its own tone with the wider streets
  // dark between them and gardens' trees in clumps, so that the far town reads as built ground into the haze)
  vec2 qc = p / vec2(96., 71.) + .6 * vec2(vnoise(p * .004), vnoise(p * .004 + 5.)); vec2 qf = abs(fract(qc) - .5); float qh = hash21(floor(qc) + 11.);
  roofs = mix(roofs, mix(vec3(.47, .25, .16), vec3(.66, .52, .36), qh) * (1. - .4 * smoothstep(.4, .5, max(qf.x, qf.y))), smoothstep(1400., 2600., r));
  roofs = mix(roofs, vec3(.13, .19, .09), smoothstep(.56, .66, fbm2(p * .011 + 4.)) * .85);
  vec3 fields = mix(vec3(.3, .33, .16), vec3(.52, .47, .29), fbm2(p * .004));   // (THE FIELDS BEYOND THE FAR CITY: INVENTED, OURS)
  vec3 alb = mix(earth, green, max(slope, smoothstep(600., 1800., r) * .7));
  alb = mix(alb, fields, smoothstep(1500., 3000., r));
  alb = mix(alb, roofs, city * (1. - slope));
  float yards = smoothstep(${(M.RIM_A+z.PLAZA).toFixed(1)}, ${(M.RIM_A+z.PLAZA+60).toFixed(1)}, r) * (1. - smoothstep(${(v.FARCITY.WIDE.end-160).toFixed(1)}, ${(v.FARCITY.WIDE.end+40).toFixed(1)}, r)) * (1. - slope * (1. - smoothstep(900., 1100., r)));
  alb = mix(alb, mix(lane * 1.05, green * 1.1, smoothstep(.42, .6, fbm2(p * .012 + 9.))), yards * .8);
  // (addendum 8: beyond 600 m the yards between the far roofs carry trees in dark clumps and trodden lanes)
  alb = mix(alb, vec3(.13, .19, .09), yards * smoothstep(600., 900., r) * smoothstep(.5, .62, fbm2(p * .019 + 4.)) * .8);
  // the north hill's level top between the Baths and the palace wing: a garden, its avenue a gravel walk
  float gx = step(${v.GARDEN.X[0].toFixed(1)}, p.x) * step(p.x, ${v.GARDEN.X[1].toFixed(1)}) * step(${(z.PALACE.Z+z.PALACE.PORTICO_D).toFixed(1)}, p.y) * step(p.y, ${z.N_TOP.toFixed(1)});
  if (gx > .5) { alb = gardenAlb(p + vec2(0., ${(-z.N_TOP).toFixed(1)}), vec2(30., 16.)); alb = mix(alb, vec3(.58, .53, .43), 1. - smoothstep(${(v.GARDEN.AVENUE_HALF-2.5).toFixed(1)}, ${(v.GARDEN.AVENUE_HALF-2).toFixed(1)}, abs(p.y - ${v.GARDEN.AVENUE_Z.toFixed(1)}))); }
  float lit = 1.;
  if (inTown > .5) { alb = lane; }
  if (street > .5) { alb = basalt; lit = 1.; }
  // (order three: the open paved ground between the terrace's front and the building's own)
  float fore = step(${z.FORE.X0.toFixed(1)}, p.x) * (1. - smoothstep(${(z.FORE.X1-1).toFixed(1)}, ${(z.FORE.X1+.5).toFixed(1)}, p.x)) * smoothstep(${(z.FORE.Z0-1.5).toFixed(1)}, ${z.FORE.Z0.toFixed(1)}, p.y) * step(p.y, ${z.FORE.Z1.toFixed(1)});
  plaza = max(plaza, fore);
  // (beyond the posts the whole open ground is DARK BASALT PAVING: the research has basalt beyond the posts only as
  // NOT CHECKED, 2.23; its reach over the open ground is ours; the market's pines and stalls shade it)
  alb = mix(alb, basalt, plaza); lit = mix(lit, 1., plaza);
  alb = mix(alb, trav, pave);
  lit *= mix(1., marketSun(p), plaza * (1. - pave));
  // the houses' shade lies on the lanes, the courts and the open ground's edge
  lit *= townSun(vW + vec3(0., .1, 0.));
  vec3 sun = sunAt(vW + vec3(0., .05, 0.)) * uSunCol * max(dot(N, uSun), 0.) * lit;
  // (between the houses less of the sky is seen, and the walls' warm light comes down instead)
  vec3 col = alb * (sun + uSkyCol * .85 * (1. - .4 * inTown * (1. - street)) + uBounceCol * (.2 + .9 * inTown));
  gl_FragColor = vec4(hazed(col, vW), 1.);
}`,Ie="varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",me=24,ue={SHOAL:.2,BANK:.2,BANK_W:12,PALE:.22,GRAIN:.055},lt=`
varying vec3 vW;
${v.LIGHT_GLSL}
${v.NOISE_GLSL}
uniform vec4 uMarks[${me}]; uniform float uMarkN; uniform float uCrowd;
// the bowl's large shape: the stone's height at d metres out from the arena wall (the section's own figures)
float secY(float d) {
  if (d < 0.) return 0.;
  if (d < ${M.PODIUM_D.toFixed(2)}) return ${M.PODIUM_H.toFixed(2)} + d * ${((M.PODIUM_TOP-M.PODIUM_H)/M.PODIUM_D).toFixed(4)};
  if (d < ${v.SECTION.Z1_D1.toFixed(2)}) return ${v.SECTION.Z1_Y0.toFixed(2)} + (d - ${M.PODIUM_D.toFixed(2)}) * ${(M.ROW_H/M.ROW_D).toFixed(4)};
  if (d < ${v.SECTION.Z2_D0.toFixed(2)}) return ${v.SECTION.Z2_Y0.toFixed(2)};
  if (d < ${M.WALL5_D0.toFixed(2)}) return ${v.SECTION.Z2_Y0.toFixed(2)} + (d - ${v.SECTION.Z2_D0.toFixed(2)}) * ${(M.ROW_H/M.ROW_D).toFixed(4)};
  if (d < ${(M.RING_DEPTH-1.8).toFixed(1)}) return ${M.ROOF_Y.toFixed(1)};
  return ${M.WALL_H.toFixed(1)};
}
// the ripples' slope at the plan point p: six plain waves of 3.7 m to 0.41 m, each melted where its length is under
// two pixels (fp: metres of water under one pixel), their strength wandering slowly from place to place
#define WAVE(kx, kz, L, A, w) { float ph = (p.x * kx + p.y * kz) * (6.2831853 / L) + t * w; s += vec2(kx, kz) * (A * cos(ph) * (1. - smoothstep(.22 * L, .6 * L, fp))); }
vec2 ripple(vec2 p, float t, float fp) {
  vec2 s = vec2(0.);
  WAVE(.80, .60, 3.7, .008, .9)
  WAVE(-.35, .94, 2.3, .007, -1.2)
  WAVE(.96, -.28, 1.45, .006, 1.6)
  WAVE(-.71, -.70, .93, .0038, -2.1)
  WAVE(.26, .97, .61, .0025, 2.7)
  WAVE(-.92, .39, .41, .0016, -3.4)
  s *= .65 + .7 * vnoise(p * .21 + vec2(t * .05, -t * .04));
  s += (vec2(vnoise(p * 5.1 + vec2(t * .5, 0.)), vnoise(p * 5.1 + vec2(7.3, -t * .45))) - .5) * .0015 * (1. - smoothstep(.05, .18, fp));
  return s;
}
void main() {
  vec3 V = normalize(vW - cameraPosition);
  vec2 p = vW.xz; float t = uTime;
  float fp = max(length(dFdx(p)), length(dFdy(p)));
  vec2 sl = ripple(p, t, fp);
  // (order three, addendum 6, point 2: the water is never one flat tone. THE WIND'S SKIN: soft bands where the light air ruffles the
  // surface, drifting across the long axis on the world's clock; in a band the ripples stand higher and the water
  // mirrors more of what is over it. No white in it anywhere. ADDENDUM 7 (a), a law of the water: its own ripples
  // stay UNDER the oar rings' strength (a ring's slope is 0.021 at a boat's mark of 0.3; the ripples' own reach 0.013
  // in a band and half of that between), so the rings read on it.)
  float ruff = smoothstep(.38, .72, vnoise(vec2(p.x * .09 + t * .05, p.y * .23 + t * .16)) * .65 + vnoise(vec2(p.x * .31 - t * .07, p.y * .6 + t * .22) + 3.) * .35);
  sl *= .5 + .75 * ruff;
  float nearBeast = 99.;
  // lane B's marks: soft rings spreading from where a boat or a beast stands (x, z, radius, strength)
  for (int i = 0; i < ${me}; i++) {
    if (float(i) >= uMarkN) break;
    vec4 m = uMarks[i]; vec2 dv = p - m.xy; float r = length(dv) + 1e-3;
    sl += dv / r * (.07 * m.w * smoothstep(m.z, .25 * m.z, r) * smoothstep(0., .35, r) * cos(7.5 * r - 4.2 * t));
    if (m.w < .2) nearBeast = min(nearBeast, r);   // (an animal's mark is the faint one: 0.14 walking, 0.1 standing)
  }
  vec3 N = normalize(vec3(-sl.x, 1., -sl.y));
  vec3 R = reflect(V, N); R.y = max(R.y, .02);
  // THE MIRROR. The way of the mirrored sight against the bowl's section (a march, then one step back by the rule of
  // three so that the place it meets the stone is not stepped)
  float run = length(R.xz) + 1e-4, sHit = -1., sPrev = 0., gPrev = -1., dh = 0., gMax = -9., sMax = 0., dMax = 0.;
  for (int i = 1; i <= 16; i++) {
    float s = float(i) * 6.5 / run;
    vec3 q = vW + R * s;
    float dq = famD(q.xz, 20.), gq = secY(dq) - q.y;
    if (sHit < 0. && gq > 0.) { sHit = mix(sPrev, s, clamp(-gPrev / max(gq - gPrev, 1e-4), 0., 1.)); dh = dq; }
    if (sHit < 0.) { sPrev = s; gPrev = gq; if (gq > gMax) { gMax = gq; sMax = s; dMax = dq; } }
  }
  float up = clamp(R.y / run, 0., 1.);
  vec3 sky = mix(vec3(.74, .82, .93), vec3(.2, .4, .8), pow(up, .55)) * 1.1;
  // past the bowl: the cloths, strip by strip, or the sky through the bare ropes and the eye
  vec3 mir = sky;
  {
    float s = (42. - vW.y) / R.y, d = 27.;
    for (int i = 0; i < 3; i++) { d = famD(vW.xz + R.xz * s, d); s = (${M.RINGROPE_Y.toFixed(1)} + ${(M.MAST_TOP-M.RINGROPE_Y).toFixed(1)} * clamp((d - ${v.RIG.D_RING.toFixed(1)}) / ${v.RIG.SPAN.toFixed(1)}, -.2, 1.2) - vW.y) / R.y; }
    vec2 h = vW.xz + R.xz * s;
    float tau = (d - ${v.RIG.D_RING.toFixed(1)}) / ${v.RIG.SPAN.toFixed(1)};
    // (the mirror is soft: the smallest ripples blur an edge, the larger make it waver)
    float on = smoothstep(uCloth.x - .045, uCloth.x + .045, tau) * (1. - smoothstep(.97, 1.01, tau));
    float ang = atan(h.y / (FA_B + FA_K * d), h.x / (FA_A + d));
    float jf = fract(ang / 6.2831853 + uArc.x * sin(2. * ang) + uArc.y * sin(4. * ang)) * ${M.MASTS.toFixed(1)};
    float j = floor(jf - .5), a = jf - .5 - j;
    float belly = .74 + .26 * sin(3.14159 * fract(jf));        // each strip's own belly between its two ropes
    vec3 cp = vec3(h.x, ${M.RINGROPE_Y.toFixed(1)} + ${(M.MAST_TOP-M.RINGROPE_Y).toFixed(1)} * tau + 2., h.y);
    float lit = sunAt(cp).x;                                   // the wall's shade on the cloth's upper side
    float lift = clothLiftG(a, 1. - tau, j, uTime);
    vec3 cc = mix(clothColour(mod(j, ${M.MASTS.toFixed(1)})), clothColour(mod(j + 1., ${M.MASTS.toFixed(1)})), smoothstep(.15, .85, a)) * (uSunCol * uCloth.y * 1.5 * lit * (.75 + .4 * lift) + uSkyCol * .5) * belly;
    mir = mix(sky, cc, on);
  }
  // the stone before them; a sight that only just clears the stone's edge takes a share of it (the mirrored edge is
  // soft, as ripples make it)
  float graze = smoothstep(-1.6, 0., gMax);
  if (sHit < 0. && graze > 0.) { sHit = sMax; dh = dMax; } else graze = 1.;
  if (sHit > 0.) {
    vec3 hp = vW + R * sHit;
    vec2 rad = normalize(hp.xz / vec2((FA_A + dh) * (FA_A + dh), (FA_B + FA_K * dh) * (FA_B + FA_K * dh)));
    float wallish = step(dh, .15) + smoothstep(${(M.WALL5_D0-1.2).toFixed(1)}, ${M.WALL5_D0.toFixed(1)}, dh);
    vec3 nS = normalize(vec3(-rad.x, mix(1.7, .05, clamp(wallish, 0., 1.)), -rad.y));
    vec3 zone = mix(vec3(${v.COLOUR.MARBLE.map(u=>u.toFixed(3)).join(", ")}), vec3(.34, .29, .23), smoothstep(${(M.WALL5_D0-1).toFixed(1)}, ${(M.WALL5_D0+1.5).toFixed(1)}, dh));
    // the rows' people (lane C's, from the hour its part stands): a broken darker tone on the two zones and the podium
    float crowd = uCrowd * (1. - smoothstep(${(M.WALL5_D0-1).toFixed(1)}, ${(M.WALL5_D0+1.5).toFixed(1)}, dh)) * step(.2, dh);
    // (addendum 6, point 2: the crowd's colours in the far water: wedge by wedge a warmer or a cooler cloth, darker
    // high up, as the seating's own rings of dress go)
    float cw = hash21(floor(vec2(atan(hp.z, hp.x) * 13., dh * .22)));
    vec3 dress = mix(mix(vec3(.74, .7, .64), vec3(.62, .36, .26), smoothstep(.55, .8, cw)), vec3(.36, .3, .26), smoothstep(${(M.WALL5_D0-9).toFixed(1)}, ${(M.WALL5_D0-2).toFixed(1)}, dh));
    zone = mix(zone, dress * (.8 + .4 * hash21(floor(vec2(atan(hp.z, hp.x) * 90., dh * 1.4)))), crowd * .85);
    zone = mix(zone, vec3(${v.COLOUR.TRAVERTINE.map(u=>u.toFixed(3)).join(", ")}), smoothstep(${(M.STAND_D1+2).toFixed(1)}, ${(M.STAND_D1+5).toFixed(1)}, dh));
    vec3 sunS = sunAt(hp + vec3(0., .3, 0.)) * uSunCol * max(dot(nS, uSun), 0.);
    // (addendum 2, point 5: the ripples turn a third of such a sight on up into the sky: the stone's mirror is the
    // stone's own tone paled toward the sky, never a browner band)
    mir = mix(mir, mix(zone * (sunS + uSkyCol * (.55 + .3 * nS.y) + uBounceCol * .6), sky, .34), graze);
  }
  // (ADDENDUM 8: OUT. RING_MIRROR is nought and the glow below adds nothing; the law stands for the day it is wanted.)
  // THE RING'S MIRROR (order three: no outline; addendum 4 (a): ONE SOFT PALE GLOW, no bright broken strips: there is
  // no foam at the animals before the ring's foot, and nothing may look like it): the leaning ring is a glowing thing over the water
  // (its lower rim 1.5 m clear of the surface); the water gives it back as one faint even glow about the mirrored
  // sight's place on the ring's own plane, widest at the middle, gone before one and a half of the ring's radius
  float ringGlow = 0.;
  {
    vec3 rc = vec3(${M.RING.map(u=>u.toFixed(2)).join(", ")}), rn = vec3(${(-Math.cos(v.ROUTE.DOWN_DEG*v.DEG)).toFixed(5)}, ${(-Math.sin(v.ROUTE.DOWN_DEG*v.DEG)).toFixed(5)}, 0.);
    vec3 Rg = reflect(V, vec3(0., 1., 0.));
    float dn = dot(Rg, rn), tr = dot(rc - vW, rn) / (abs(dn) > 1e-3 ? dn : 1e-3);
    float rr = length(vW + Rg * tr - rc);
    // (addendum 6, point 2: GOLD, and drawn out toward the lens as the ripples draw a light's mirror out: one soft
    // road, three times as long as it is wide, no strips in it)
    vec3 dv = vW + Rg * tr - rc; float along = dv.x * ${Math.sin(v.ROUTE.DOWN_DEG*v.DEG).toFixed(5)} - dv.y * ${Math.cos(v.ROUTE.DOWN_DEG*v.DEG).toFixed(5)};
    rr = length(vec2(dv.z, along / 3.6));
    if (tr > 0.) { float g = 1. - smoothstep(0., ${(M.RING_R*1.4).toFixed(2)}, rr); ringGlow = g * g * ${at.toFixed(2)}; }
  }
  // THE BOTTOM: packed sand a metre down, seen where the bent sight meets it, through the water's own colour (the red
  // goes first), lit by the one law; the sun's moving net of light where the sun reaches it
  float c = clamp(dot(-V, N), 0., 1.);
  vec2 bp = p + V.xz / max(-V.y, .3) * ${(M.WATER_DEEP*.55).toFixed(2)} + sl * 6.;
  vec3 sunB = sunAt(vec3(bp.x, vW.y + .05, bp.y));
  // (order three, addendum 2, point 3: THE LIT WATER IS THE CLEAREST AND MOST COLOURED WATER IN THE BOWL. The cloths'
  // pale mirror must not lie as a milky sheet over a dark floor, nor the sun's patch be only blue: the floor is PALE
  // packed sand; a metre of clear water over
  // it in the sun is green-blue and bright, with the sun's net of light moving on the sand (meshes about a metre: they
  // show from the line); in the shade the same floor stands in the fill alone, dim; and the mirror takes the share
  // water gives it: little where the sight is steep, growing as the sight flattens toward the far ledge.)
  float n1 = vnoise(bp * 2.1 + vec2(t * .3, t * .2)), n2 = vnoise(bp * 2.6 + vec2(-t * .26, t * .23) + 11.);
  float net = pow(1. - abs(n1 - n2), 10.);
  float caust = mix(.88 + .66 * net, 1., smoothstep(.2, .7, fp));
  vec3 sand = vec3(.52, .475, .4) * (.84 + .32 * fbm2(bp * .31));
  // (THE FLOOR'S LIE, IN THE TONE ALONE; see WATER_LIE above this shader)
  float lie = clamp((fbm2(bp * ${ue.GRAIN.toFixed(3)} + vec2(3.7, 9.1)) - .5) * 5., -1., 0.);
  float bank = 1. - smoothstep(0., ${ue.BANK_W.toFixed(1)}, -(famD(bp, -4.) + 1.5));
  float deep = ${M.WATER_DEEP.toFixed(1)} * (1. + ${ue.SHOAL.toFixed(2)} * lie) * (1. - ${ue.BANK.toFixed(2)} * bank);
  sand *= 1. - ${ue.PALE.toFixed(2)} * lie;
  float way = deep * (1. / max(uSun.y, .3) + 1. / mix(.72, 1., c));
  // (addendum 6, point 2: THE SHADED WATER KEEPS ITS COLOUR: the sky's fill through the eye and the day thrown back
  // by the lit stands reach the floor under the shade too: shade on clear water, not a grey half)
  vec3 fillB = uSkyCol * 1.15 + uBounceCol * .9;
  // (THE WATER'S LOSS OF COLOUR, a metre of the light's way, red first: .43, .092, .06. The part's arena section
  // holds the same figure by hand, WATER_LOSS, for the pool under an animal: the figures stand by hand in both files
  // and each MUST FOLLOW the other.)
  vec3 bottom = sand * exp(-vec3(.43, .092, .06) * way) * (sunB * uSunCol * uSun.y * caust + fillB);
  // the water's own colour: the light scattered back out of its depth (more where the sun is in it)
  bottom += vec3(.01, .05, .075) * (.85 + 1.0 * dot(sunB, vec3(.3333)));
  // the mirror's share by the eye's direction (the plain surface's, a little of the ripple's)
  float cF = mix(clamp(-V.y, 0., 1.), c, .35);
  // (addendum 6, point 2: the far water, where the sight is flat, mirrors the stands, the crowd and the cloths; a
  // ruffled band mirrors a little more; and the ripples' slopes take the day's light and lose it, facet by facet)
  float F = .07 + .93 * pow(1. - cF, 2.6);
  // (by the ripples' own law: the smooth lanes between the wind's bands show the floor more clearly and a ruffled
  // band mirrors more: .78 + 1.1 times the ruffle; at a mean ruffle of .4 that is 1.22 times the plain surface's share)
  F = min(1., F * (.78 + 1.1 * ruff) + .05 * ruff);
  vec3 col = mix(bottom, mir, F);
  col *= 1. + 9. * dot(sl, normalize(uSun.xz)) * (1. - smoothstep(.3, 1.2, fp));
  // the glints where the sun lies on the water (order three: fewer, larger, moving, in the sun's patch alone): short
  // bright streaks on the ripples' crests, each drifting with the ripples and turning in and out of the sun on the
  // world's clock, one cell in six at a time; IN THE SUN'S ROAD ALONE (addenda 2 and 4: no fine white
  // speckle over the lit water): where the eye looks toward the sun's own mirror, and none where it looks down the sun (the
  // line flies west with the morning sun behind it: from the line the lit water shows its pale floor and the sun's
  // net, not glitter; this is a law of the water and holds over its whole face); far off, where a streak is under a
  // pixel, their mean as a soft shimmer
  vec3 sunW = sunAt(vW + vec3(0., .05, 0.));
  vec2 gq = vec2(p.x / 1.5 - t * .12, p.y / .7 + t * .05), gc = floor(gq); float gh = hash21(gc);
  float tw = pow(max(sin(t * (1.1 + 1.7 * gh) + gh * 40.), 0.), 6.) * step(.83, hash21(gc + 1.3));
  vec2 gd = fract(gq) - .5 - (vec2(hash21(gc + 3.1), hash21(gc + 7.7)) - .5) * .5;
  float dot1 = smoothstep(.2, .02, length(gd * vec2(1., 2.6)));
  float lobe = pow(max(dot(normalize(R), uSun), 0.), 4.);
  float glint = mix(tw * dot1 * 2.6, .1 * (.5 + vnoise(p * 1.7 + vec2(t * .9, -t * .6))), smoothstep(.1, .5, fp));
  // (addendum 7 (a), a law of the water: no glint within 3 m of an animal's mark: nothing splashes at a wading body)
  col += sunW * uSunCol * glint * lobe * smoothstep(3., 4.5, nearBeast);
  // (addendum 7: it must read as THE GOLD RING'S MIRROR, not as white water: the ring's own gold, full, never pale)
  col = mix(col, vec3(1., .6, .15) * 1.02, ringGlow * max(F, .8));
  // the wet edge: darker where the water lies against the ledge's wall, its border wavering with the ripples
  float e = famD(p, -4.) + 1.5 + .12 * sin(p.x * 2.1 + t * 1.3) * sin(p.y * 1.7 - t * 1.1);
  col *= 1. - .5 * smoothstep(-.8, -.05, e);
  gl_FragColor = vec4(hazed(col, vW), 1.);
}`,ht=`
attribute vec3 aCol; attribute vec3 aUV;
uniform float uTime;
varying vec3 vW; varying vec3 vN; varying vec3 vCol; varying vec3 vUV;
${Le}
void main() {
  vec3 p = position;
  if (aUV.z > 2.5) p.y += .09 * aUV.y * sin(uTime * 1.3 + position.x * .7 + position.z * .3) + .05 * aUV.y * sin(uTime * 2.9 + position.x * 1.9);
  if (aUV.z > 1.5 && aUV.z < 2.5) p.xz += stir(position.xz, uTime) * aUV.y * aUV.y;   // a court's tree: the one law of stirring
  vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz; vN = normal; vCol = aCol; vUV = aUV; gl_Position = projectionMatrix * viewMatrix * w;
}`,dt=`
varying vec3 vW; varying vec3 vN; varying vec3 vCol; varying vec3 vUV;
${v.LIGHT_GLSL}
${v.NOISE_GLSL}
${pe}
void main() {
  vec3 N = normalize(vN), alb = vCol; float ao = 1., lit = 1., cloud = cloudSun(vW);
  vec2 key = floor(vCol.rg * 96. + .5);                      // the house's own number (a varying's last bits waver)
  if (vUV.z > 2.5) {
    // a hung cloth: lit from above or through its weave from below, both plainly
    if (!gl_FrontFacing) N = -N;
    alb *= .92 + .08 * sin(vUV.x * 9.);
    vec3 c = alb * (uSunCol * (.35 + .65 * abs(N.y)) * townSun(vW + vec3(0., .3, 0.)) * cloud + uSkyCol * .9 + uBounceCol * .5);
    gl_FragColor = vec4(hazed(c, vW), 1.); return;
  } else if (vUV.z > 1.5) {
    // a tree: leaves in clumps, darker inside and below
    alb *= (.7 + .6 * vnoise(vW.xz * 1.7 + vW.y * 1.3)) * (.6 + .4 * vUV.y);
    lit = .55 + .45 * vnoise(vW.xy * 2.3 + 7.);
  } else if (vUV.z > .5) {
    // a roof: small pan tiles, a rib every 0.3 m down the slope, a course every 0.36 m, every tile a little its own
    // tone, older and paler patches, the ridge tiles' line along the top
    float fw = fwidth(vUV.x), fwv = fwidth(vUV.y), rib = abs(fract(vUV.x / .3) - .5) * 2.;
    float near = 1. - smoothstep(.07, .26, max(fw, fwv));
    float ribs = mix(.9, 1. - .34 * smoothstep(.5, .92, rib), near);
    float course = 1. - .16 * smoothstep(.72, 1., fract(vUV.y / .36)) * near;
    float tileTone = mix(1., .82 + .36 * hash21(floor(vec2(vUV.x / .3, vUV.y / .36)) + key * 1.37), near);
    float patchy = .78 + .44 * vnoise(vW.xz * .55 + key * .61);
    float lichen = smoothstep(.62, .85, vnoise(vW.xz * 1.9 + 11.)) * .3;
    alb = mix(alb * ribs * course * tileTone * patchy, vec3(.45, .42, .34), lichen);
    float ridge = 1. - smoothstep(.16, .3, vUV.y);
    alb = mix(alb, vCol * 1.12 * (.9 + .2 * step(.5, fract(vUV.x / .42))), ridge * .8);
  } else {
    // a wall: plaster with streaks, a darker foot, small shuttered windows high up and doors on the lane
    alb *= .9 + .2 * vnoise(vec2(vUV.x * .8, vUV.y * 2.5));
    float wx = abs(fract(vUV.x / 3.1) - .5) * 3.1, upper = step(abs(vUV.y - 4.6), .5) + step(abs(vUV.y - 7.9), .5) * step(9., vCol.r * 0. + vUV.y + 1.6);
    float win = step(wx, .32) * min(upper, 1.) * step(.3, hash21(floor(vec2(vUV.x / 3.1, vUV.y / 3.3)) + key * 1.91));
    float door = step(abs(fract(vUV.x / 6.2 + .25) - .5) * 6.2, .6) * step(vUV.y, 2.2);
    alb = mix(alb, vec3(.07, .06, .05), max(win, door) * (1. - .7 * smoothstep(.2, .7, fwidth(vUV.x))));
    alb *= 1. - .25 * (1. - smoothstep(0., 1.2, vUV.y));
    ao = mix(.5, 1., smoothstep(0., 7., vUV.y));
    // the neighbours' shade on it (the wall's own house stands behind it)
    lit = townSun(vW + N * .6);
  }
  vec3 sun = uSunCol * max(dot(N, uSun), 0.) * lit * cloud;
  vec3 col = alb * (sun + uSkyCol * (.55 + .35 * N.y) * ao + uBounceCol * (.9 - .5 * N.y) * ao * (.55 + .45 * cloud));
  gl_FragColor = vec4(hazed(col, vW), 1.);
}`,ct=[[.7,.53,.3],[.78,.71,.56],[.55,.3,.22]],Ce=[.53,.31,.2];async function ft(u,D,K=[],B=async()=>{}){const H=[],N=[],$=[],_=[],O=[];let C=0;const r=(d,b,m,y,w,P,x)=>{for(const[I,e]of[[d,x[0]],[b,x[1]],[m,x[2]],[y,x[3]]])H.push(I[0],I[1],I[2]),N.push(w[0],w[1],w[2]),$.push(P[0],P[1],P[2]),_.push(e[0],e[1],e[2]);O.push(C,C+1,C+2,C,C+2,C+3),C+=4},A=(d,b,m,y,w,P)=>{[d,b,m].forEach((x,I)=>{H.push(x[0],x[1],x[2]),N.push(y[0],y[1],y[2]),$.push(w[0],w[1],w[2]),_.push(P[I][0],P[I][1],P[I][2])}),O.push(C,C+1,C+2),C+=3};let k=0;for(const d of[...u,...K]){++k%130===0&&await B();const{x0:b,x1:m,z0:y,z1:w,base:P,eave:x,ridge:I}=d,e=m-b,c=w-y,h=x-P,n=d.no||"",s=.88+.24*D(),o=ct[d.tone].map(t=>t*s),p=.78+.4*D(),S=D()*D(),f=Ce.map((t,i)=>(t+([.44,.37,.29][i]-t)*S)*p*(i===0?1:.9+.2*D()));n.includes("f")||r([b,P,w],[m,P,w],[m,x,w],[b,x,w],[0,0,1],o,[[0,0,0],[e,0,0],[e,h,0],[0,h,0]]),n.includes("b")||r([m,P,y],[b,P,y],[b,x,y],[m,x,y],[0,0,-1],o,[[0,0,0],[e,0,0],[e,h,0],[0,h,0]]),n.includes("r")||r([m,P,w],[m,P,y],[m,x,y],[m,x,w],[1,0,0],o,[[0,0,0],[c,0,0],[c,h,0],[0,h,0]]),n.includes("l")||r([b,P,y],[b,P,w],[b,x,w],[b,x,y],[-1,0,0],o,[[0,0,0],[c,0,0],[c,h,0],[0,h,0]]);const l=.45,a=I-x;if(d.axis===0){const t=(y+w)/2,i=c/2,E=Math.hypot(i+l,a*(i+l)/i),g=i/Math.hypot(i,a),F=a/Math.hypot(i,a),L=x-a*l/i;r([b-l,L,w+l],[m+l,L,w+l],[m+l,I,t],[b-l,I,t],[0,g,F],f,[[0,E,1],[e,E,1],[e,0,1],[0,0,1]]),r([m+l,L,y-l],[b-l,L,y-l],[b-l,I,t],[m+l,I,t],[0,g,-F],f,[[0,E,1],[e,E,1],[e,0,1],[0,0,1]]),n.includes("r")||A([m,x,w],[m,x,y],[m,I,t],[1,0,0],o,[[0,h,0],[c,h,0],[i,h+a,0]]),n.includes("l")||A([b,x,y],[b,x,w],[b,I,t],[-1,0,0],o,[[0,h,0],[c,h,0],[i,h+a,0]])}else{const t=(b+m)/2,i=e/2,E=Math.hypot(i+l,a*(i+l)/i),g=i/Math.hypot(i,a),F=a/Math.hypot(i,a),L=x-a*l/i;r([m+l,L,w+l],[m+l,L,y-l],[t,I,y-l],[t,I,w+l],[F,g,0],f,[[0,E,1],[c,E,1],[c,0,1],[0,0,1]]),r([b-l,L,y-l],[b-l,L,w+l],[t,I,w+l],[t,I,y-l],[-F,g,0],f,[[0,E,1],[c,E,1],[c,0,1],[0,0,1]]),n.includes("f")||A([b,x,w],[m,x,w],[t,I,w],[0,0,1],o,[[0,h,0],[e,h,0],[i,h+a,0]]),n.includes("b")||A([m,x,y],[b,x,y],[t,I,y],[0,0,-1],o,[[0,h,0],[e,h,0],[i,h+a,0]])}}await B();for(const d of u.courts){const b=Math.min(d.r*.72,3.4)*(.8+.4*D()),m=d.base+2.2+b*.5,y=m+b*.75,w=.22,P=.8+.4*D(),x=[.062*P,.082*P,.04*P],I=[.25,.2,.15],e=d.x+(D()-.5)*d.r*.5,c=d.z+(D()-.5)*d.r*.5;for(let o=0;o<4;o++){const p=Math.PI/2*o,S=Math.PI/2*(o+1),f=[e+w*Math.cos(p),c+w*Math.sin(p)],l=[e+w*Math.cos(S),c+w*Math.sin(S)],a=(p+S)/2;r([l[0],d.base,l[1]],[f[0],d.base,f[1]],[f[0],m,f[1]],[l[0],m,l[1]],[Math.cos(a),0,Math.sin(a)],I,[[0,0,2],[0,0,2],[0,.4,2],[0,.4,2]])}const h=8,n=[[-.92,.38],[-.45,.88],[.1,1],[.6,.78],[.97,.25]],s=C;for(let o=0;o<n.length;o++)for(let p=0;p<h;p++){const S=Math.PI*2*(p+.5*(o%2))/h,f=.82+.36*D(),l=n[o][1]*b*f,a=n[o][0]*b*.85*(.9+.2*D()),t=l*Math.cos(S),i=l*Math.sin(S),E=Math.hypot(t,a*1.2,i)||1;H.push(e+t,y+a,c+i),N.push(t/E,a*1.2/E,i/E),$.push(x[0],x[1],x[2]),_.push(0,.5+.5*n[o][0],2)}C+=n.length*h;for(let o=0;o+1<n.length;o++)for(let p=0;p<h;p++){const S=s+o*h+p,f=s+o*h+(p+1)%h,l=s+(o+1)*h+p,a=s+(o+1)*h+(p+1)%h;O.push(S,l,f,f,l,a)}for(let o=1;o+1<h;o++){O.push(s,s+o,s+o+1);const p=s+(n.length-1)*h;O.push(p,p+o+1,p+o)}}const U=[[.72,.68,.58],[.62,.48,.25],[.5,.27,.2],[.36,.4,.45]];for(const d of u.hung){const b=U[d.tone<.45?0:d.tone<.65?1:d.tone<.83?2:3],m=d.x-d.w/2,y=d.x+d.w/2,w=(d.z0+d.z1)/2,P=d.y-.3-.3*d.tone;r([m,d.y,d.z0],[m,P,w],[y,P,w],[y,d.y,d.z0],[0,1,0],b,[[0,0,3],[0,1,3],[d.w,1,3],[d.w,0,3]]),r([m,P,w],[m,d.y,d.z1],[y,d.y,d.z1],[y,P,w],[0,1,0],b,[[0,1,3],[0,0,3],[d.w,0,3],[d.w,1,3]])}await B();const W=new T.BufferGeometry;return W.setAttribute("position",new T.Float32BufferAttribute(H,3)),W.setAttribute("normal",new T.Float32BufferAttribute(N,3)),await B(),W.setAttribute("aCol",new T.Float32BufferAttribute($,3)),await B(),W.setAttribute("aUV",new T.Float32BufferAttribute(_,3)),W.setIndex(O),await B(),W}const ut=1024;function vt(u){const D=z.TOWN,K=D.XW-12,B=D.Z0-12,H=D.X1-D.XW+24,N=D.Z1-D.Z0+24,$=ut,_=new Uint8Array($*$);for(const C of u){const r=Math.min(255,Math.round((C.eave+(C.ridge-C.eave)*.4)/.25)),A=Math.max(0,Math.floor((C.x0-K)/H*$)),k=Math.min($-1,Math.ceil((C.x1-K)/H*$)),U=Math.max(0,Math.floor((C.z0-B)/N*$)),W=Math.min($-1,Math.ceil((C.z1-B)/N*$));for(let d=U;d<W;d++)_.fill(r,d*$+A,d*$+k)}const O=new T.DataTexture(_,$,$,T.RedFormat);return O.magFilter=O.minFilter=T.LinearFilter,O.generateMipmaps=!1,O.needsUpdate=!0,{uTownH:{value:O},uTownBox:{value:new T.Vector4(K,B,1/H,1/N)}}}const G={WALL:0,COLONNADE:1,ARCADE:2,TILE:3,STAIR:4,TOP:5,SHADE:6,GARDEN:7,LEAF:8,COLUMN:9,CLOTH:10,CELLA:11,ENTAB:12},pt=`
attribute vec3 aCol; attribute vec3 aUV; attribute vec4 aPar;
varying vec3 vW; varying vec3 vN; varying vec3 vCol; varying vec3 vUV; varying vec4 vPar;
uniform float uTime;
// THE WIND STIRS THE TREES by the one law (stir): a leaf's vertex leans by the square of its height in its crown
${Le}
void main() {
  vec3 p = position;
  if (aUV.z > ${(G.LEAF-.5).toFixed(1)} && aUV.z < ${(G.LEAF+.5).toFixed(1)}) { float h = clamp(aUV.y, 0., 1.); p.xz += stir(position.xz, uTime) * h * h; }
  vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz; vN = normal; vCol = aCol; vUV = aUV; vPar = aPar; gl_Position = projectionMatrix * viewMatrix * w; }`,De=v.terraceRows(),we=De.find(u=>u.walk).walk,xe=v.hillMasses().temple,mt=`
float spindle(float v) { return v < .05 ? .5 : v < .36 ? mix(.5, 1., (v - .05) / .31) : v < .74 ? mix(1., .6, (v - .36) / .38) : mix(.6, 0., (v - .74) / .26); }
float rowShade(vec2 p, vec4 row, vec3 par) {
  vec2 sd = uSun.xz; float sl = max(length(sd), 1e-3); sd /= sl; float k = uSun.y / sl;
  vec2 o = row.xy, a = row.zw, q = o - p;
  float den = sd.x * a.y - sd.y * a.x;
  if (abs(den) < 1e-3) return 1.;
  float s = (q.x * sd.y - q.y * sd.x) / den, k0 = floor(s / par.x + .5), lit = 1.;
  for (int i = -1; i <= 1; i++) {
    float kk = k0 + float(i);
    if (kk < 0. || kk > par.y - .5) continue;
    float h = ${v.GARDEN.ROW_H[0].toFixed(1)} + ${(v.GARDEN.ROW_H[1]-v.GARDEN.ROW_H[0]).toFixed(1)} * fract(kk * .618034 + par.z);
    float r = ${v.GARDEN.ROW_R[0].toFixed(2)} + ${(v.GARDEN.ROW_R[1]-v.GARDEN.ROW_R[0]).toFixed(2)} * fract(kk * .414214 + par.z * 2.3);
    vec2 c = o + a * kk * par.x - p;
    float along = dot(c, sd), miss = abs(c.x * sd.y - c.y * sd.x), y = along * k;
    if (along < 0. || y > h) continue;
    float prof = r * spindle(y / h);
    lit = min(lit, smoothstep(prof - .3, prof + .3, miss));
  }
  return lit;
}
float terraceSun(vec2 p) {
  float lit = 1.;
${De.map(u=>`  lit = min(lit, rowShade(p, vec4(${u.ox.toFixed(3)}, ${u.oz.toFixed(3)}, ${u.ax.toFixed(5)}, ${u.az.toFixed(5)}), vec3(${u.every.toFixed(1)}, ${u.n.toFixed(1)}, ${u.phase.toFixed(2)})));`).join(`
`)}
  return lit;
}`,ze=[.6,.3],wt=`    if (vPar.x < 0.) {
      vec2 bq = vec2(u / -vPar.x + .5 * floor(v / vPar.y), v / vPar.y), bf = abs(fract(bq) - .5);
      float seen = 1. - smoothstep(.15, .5, max(fwidth(u) / -vPar.x, fwidth(v) / vPar.y));
      alb *= mix(1., .94 + .1 * hash21(floor(bq)), seen) * (1. - .16 * smoothstep(.44, .5, max(bf.x, bf.y)) * seen);
    }
`,xt=`
varying vec3 vW; varying vec3 vN; varying vec3 vCol; varying vec3 vUV; varying vec4 vPar;
${v.LIGHT_GLSL}
${v.NOISE_GLSL}
${Pe}
${mt}
void main() {
  vec3 N = normalize(vN), alb = vCol; float kind = floor(vUV.z + .5), shade = 1., amb = 1., wrap = 0.;
  float u = vUV.x, v = vUV.y;
  if (kind == ${G.COLONNADE}.) {
    // a portico's front: columns, the dark walk behind them, a plain beam over each storey
    float sv = mod(v, vPar.z), cu = abs(fract(u / vPar.x) - .5) * vPar.x;
    float open = step(vPar.w * .5, cu) * step(sv, vPar.y);
    alb = mix(alb, vCol * .3, open); shade = 1. - open;
    alb *= 1. - .18 * step(vPar.y, sv) * step(sv, vPar.y + .25);
  } else if (kind == ${G.ARCADE}.) {
    // arches between piers, row on row
    float sv = mod(v, vPar.z), cu = abs(fract(u / vPar.x) - .5) * vPar.x, hw = (vPar.x - vPar.w) * .5, spring = vPar.y - hw;
    float open = step(cu, hw) * (sv < spring ? 1. : step(length(vec2(cu, sv - spring)), hw));
    alb = mix(alb, vCol * .26, open); shade = 1. - open;
    alb *= 1. - .15 * step(vPar.z - .5, sv);
    amb = 1.3;                                                  // (a pale front in its own shade stands in the sky's light)
  } else if (kind == ${G.TILE}.) {
    amb = 1.25;
    float rib = abs(fract(u / .5) - .5) * 2.;
    alb *= mix(1. - .3 * smoothstep(.55, .9, rib), .87, smoothstep(.12, .45, fwidth(u))) * (.85 + .3 * vnoise(vW.xz * .7));
  } else if (kind == ${G.STAIR}.) {
    // a flight of steps: each tread lit, each riser a thin dark line (melting where a step is under a pixel)
    alb *= mix(1. - .4 * step(.72, fract(v / vPar.x)), .9, smoothstep(.15, .5, fwidth(v) / vPar.x));
  } else if (kind == ${G.TOP}.) {
    alb *= .9 + .2 * fbm2(vW.xz * .07);
    alb = mix(alb, vec3(.22, .27, .12), vPar.x * smoothstep(.45, .6, fbm2(vW.xz * .03 + 4.)));
  } else if (kind == ${G.SHADE}.) {
    // the wall at the back of a portico's walk, under its roof: no sun, less sky; a plain door now and then
    float cu = abs(fract(u / 9.4) - .5) * 9.4;
    // (ashlar courses 0.6 m high, the joints melted where one is under a pixel)
    vec2 cq = vec2(u / 1.5 + .5 * floor(v / .6), v / .6), cf = abs(fract(cq) - .5);
    alb *= (.94 + .1 * hash21(floor(cq))) * (1. - .16 * smoothstep(.44, .5, max(cf.x, cf.y)) * (1. - smoothstep(.15, .5, max(fwidth(cq.x), fwidth(cq.y)))));
    alb = mix(alb * .8, vCol * .16, step(cu, .75) * step(v, 2.7) * (1. - smoothstep(.3, 1., fwidth(u))));
    shade = 0.; amb = .62;
  } else if (kind == ${G.GARDEN}.) {
    alb = gardenAlb(vUV.xy, vPar.xy);
    if (vPar.z > .5) {
      // the temple's terrace (order three): a gravel walk across its garden along the row of cypresses, a paved border
      // round the temple and along the walks under the porticoes, and the rows' long shadows
      vec2 wq = vW.xz - vec2(${we.x.toFixed(3)}, ${we.z.toFixed(3)}), wa = vec2(${we.dx.toFixed(5)}, ${we.dz.toFixed(5)});
      float wd = abs(wq.x * wa.y - wq.y * wa.x), fw = fwidth(wd);
      vec3 gravel = vec3(.6, .55, .45) * (.9 + .2 * vnoise(vW.xz * 2.1)) * (.94 + .12 * vnoise(vW.xz * 9.));
      alb = mix(alb, gravel, 1. - smoothstep(${v.GARDEN.WALK.HALF.toFixed(1)} - .1, ${v.GARDEN.WALK.HALF.toFixed(1)} + .1 + fw, wd));
      alb = mix(alb, vec3(.5, .47, .41), (1. - smoothstep(.16, .22 + fw, abs(wd - ${(v.GARDEN.WALK.HALF+.2).toFixed(1)}))) * .8);
      vec2 tq = abs(vW.xz - vec2(${((xe[0]+xe[1])/2).toFixed(1)}, ${((xe[4]+xe[5])/2).toFixed(1)})) - vec2(${(z.TERRACE.TEMPLE_W/2).toFixed(1)}, ${(z.TERRACE.TEMPLE_L/2).toFixed(1)});
      float round_ = max(tq.x, tq.y);
      vec2 sf = abs(fract(vW.xz / 1.5) - .5);
      vec3 flags = vec3(.66, .62, .54) * (.92 + .1 * hash21(floor(vW.xz / 1.5))) * (1. - .2 * smoothstep(.44, .49, max(sf.x, sf.y)) * (1. - smoothstep(.2, .6, fwidth(vW.x))));
      float edge = min(min(vUV.x, ${z.TERRACE.W.toFixed(1)} - vUV.x), min(vUV.y, ${z.TERRACE.D.toFixed(1)} - vUV.y));
      alb = mix(alb, flags, max(1. - smoothstep(5.5, 5.8, round_), 1. - smoothstep(${(z.TERRACE.PORTICO_D+4).toFixed(1)}, ${(z.TERRACE.PORTICO_D+4.3).toFixed(1)}, edge)));
      // the rows' shadows, and the east walk's own (its roof's edge ${(z.TERRACE.PORTICO_H+1.2).toFixed(1)} m over the floor)
      shade = terraceSun(vW.xz);
      float px = ${(z.TERRACE.CX+z.TERRACE.W/2-z.TERRACE.PORTICO_D-.5).toFixed(1)} - vW.x;
      shade = min(shade, smoothstep(-.4, .4, px * uSun.y / max(uSun.x, .05) - ${(z.TERRACE.PORTICO_H-.6).toFixed(1)}));
    }
  } else if (kind == ${G.LEAF}.) {
    // a tree's leaf: clumps, darker low and inside, finer sprays where the eye is near
    // (order three, addendum 2: the sun lights one side and the light goes round into the sprays: a soft edge between
    // the lit side and the shaded one; the shaded side stands in the sky's light)
    alb *= (.72 + .56 * vnoise(vW.xz * 1.3 + vW.y * .9)) * (.6 + .4 * v) * (.82 + .36 * vnoise(vW.xz * 6.1 + vW.y * 4.3));
    // (tufts: darker hollows between the sprays, seen where the eye is near)
    alb *= 1. - .45 * smoothstep(.42, .7, vnoise(vW.xz * .85 + vW.y * 1.7 + 11.)) * (1. - smoothstep(.2, .8, fwidth(vW.x) + fwidth(vW.z)));
    // (the needles' grain: fine pale and dark flecks along the sprays, seen where the eye is near; and the sprays'
    // own relief: the face turns a little this way and that, so that a pad or a spindle is rough, not a smooth lump)
    float nearLeaf = 1. - smoothstep(.06, .4, fwidth(vW.x) + fwidth(vW.z));
    alb *= 1. + .8 * (vnoise(vec2(vW.x * 7.3 + vW.y * 2.1, vW.z * 7.3 - vW.y * 1.7)) - .5) * nearLeaf;
    vec3 q3 = vW * 1.7;
    N = normalize(N + nearLeaf * (1.1 * vec3(vnoise(q3.xz + q3.y) - .5, 0., vnoise(q3.zx * 1.1 + q3.y + 5.) - .5) + .7 * vec3(vnoise(q3.xz * 3.1 + 2.) - .5, 0., vnoise(q3.zx * 3.1 + 9.) - .5)));
    amb = 1.05; wrap = 1.;
  } else if (kind == ${G.CELLA}.) {
    // THE TEMPLE'S ROOM WALL behind its columns (order three, addendum 2, point 2): coursed stone in the sun that comes
    // in between the columns, each column's shade a soft upright band on it, the entablature's shade along its top;
    // what the sun does not reach stands in the warm light thrown back by the sunlit floor and shafts. par: the
    // columns' spacing, the first column's place along the wall (world x or z), the walk's depth from the wall to
    // the columns' line, the columns' height over the floor. On the front wall (par.x under 0: -spacing) a tall door.
    float sp = abs(vPar.x), along = abs(N.x) > .5 ? vW.z : vW.x, ln = max(dot(N, uSun), 0.);
    vec2 cq = vec2(u / 1.8 + .5 * floor(v / .6), v / .6), cf = abs(fract(cq) - .5);
    alb *= vec3(1., .95, .86) * (.9 + .14 * hash21(floor(cq))) * (1. - .2 * smoothstep(.43, .5, max(cf.x, cf.y)) * (1. - smoothstep(.12, .5, max(fwidth(cq.x), fwidth(cq.y)))));
    if (ln > .02) {
      float shift = vPar.z * (abs(N.x) > .5 ? uSun.z : uSun.x) / ln, rise = vPar.z * uSun.y / ln;
      float cu = abs(fract((along + shift - vPar.y) / sp + .5) - .5) * sp;
      shade = min(smoothstep(.6, 1.05, cu), 1. - smoothstep(vPar.w - .5, vPar.w + .4, v + rise));
    } else shade = 0.;
    if (vPar.x < 0.) { vec2 dq = abs(vec2(u - 10.4, v - 4.6)) - vec2(2.1, 4.6); float door = 1. - smoothstep(-.05, .05, max(dq.x, dq.y)); alb = mix(alb, vec3(.2, .13, .07) * (.8 + .4 * step(.5, fract(u * 1.9 + .2))), door); shade *= 1. - door; }
    amb = 1.25;
  } else if (kind == ${G.ENTAB}.) {
    // an entablature 3 m high: two bands of the beam, the plain frieze, the cornice standing out over its own shade
    // with a row of small blocks under it (melted where one is under a pixel)
    float fw = fwidth(v);
    alb *= 1. - .16 * (1. - smoothstep(.03, .06 + fw, abs(v - .5))) - .16 * (1. - smoothstep(.03, .06 + fw, abs(v - 1.05)));
    alb *= mix(1., .93, step(1.1, v) * step(v, 2.));
    float under = smoothstep(1.86, 2., v) * (1. - smoothstep(2.36, 2.44, v));
    alb *= 1. - under * mix(.5 + .3 * step(.5, fract(u / .55)), .62, smoothstep(.12, .4, fwidth(u) / .55));
    alb *= 1. - .12 * (1. - smoothstep(.02, .05 + fw, abs(v - 2.72)));
  } else if (kind == ${G.CLOTH}.) {
    // a stall's cloth: plain woven stuff, a fold every hand's breadth across it, lit from above and through
    if (dot(N, uSun) < 0.) N = -N;
    alb *= (.93 + .07 * sin(u * 26.)) * (.94 + .1 * vnoise(vW.xz * 3.)); amb = 1.2; wrap = .6;
  } else if (kind == ${G.COLUMN}.) {
    // a column's shaft: twenty flutes (melted where one is under a pixel), a little weather
    float fl = abs(fract(u * 20.) - .5) * 2.;
    alb *= (.94 + .1 * vnoise(vec2(u * 40., v * .4))) * mix(1. - .22 * smoothstep(.45, .95, fl), .9, smoothstep(.15, .5, fwidth(u * 20.)));
  } else {
    // a plain wall: courses, weather, and where asked a row of windows (par: bay, window's height, sill, window's width)
    alb *= (.92 + .12 * vnoise(vec2(u * .5, v * 1.5))) * (1. - .1 * step(.9, fract(v / 1.2)) * (1. - smoothstep(.1, .4, fwidth(v))));
${wt}    if (vPar.x > 0.) { float cu = abs(fract(u / vPar.x) - .5) * vPar.x; float win = step(cu, vPar.w * .5) * step(vPar.z, v) * step(v, vPar.z + vPar.y); alb = mix(alb, vCol * .14, win); shade = 1. - win; }
  }
  float nl = dot(N, uSun);
  vec3 sun = sunAt(vW + N * .1) * uSunCol * mix(max(nl, 0.), max(nl * .62 + .38, 0.), wrap) * shade;
  // a pale front in shade still stands in the light of the sky and of the sunlit ground before it
  vec3 col = alb * (sun + (uSkyCol * (.8 + .35 * N.y) + uBounceCol * (1.6 - 1. * N.y)) * amb);
  gl_FragColor = vec4(hazed(col, vW), 1.);
}`;function bt(){const u=[],D=[],K=[],B=[],H=[],N=[];let $=0;const _=[0,0,0,0],O=(e,c,h,n,s,o,p,S)=>{const f=[c[0]-e[0],c[1]-e[1],c[2]-e[2]],l=[n[0]-e[0],n[1]-e[1],n[2]-e[2]],a=f[1]*l[2]-f[2]*l[1],t=f[2]*l[0]-f[0]*l[2],i=f[0]*l[1]-f[1]*l[0],E=Math.hypot(a,t,i)||1;[e,c,h,n].forEach((g,F)=>{u.push(g[0],g[1],g[2]),D.push(a/E,t/E,i/E),K.push(s[0],s[1],s[2]),B.push(S[F][0],S[F][1],o),H.push(p[0],p[1],p[2],p[3])}),N.push($,$+1,$+2,$,$+2,$+3),$+=4},C=(e,c,h,n,s,o,p,S)=>{const f=c-e,l=o-s,a=n-h,t=i=>[i.c||S,i.k||0,i.p||_];p.f&&O([e,h,o],[c,h,o],[c,n,o],[e,n,o],...t(p.f),[[0,0],[f,0],[f,a],[0,a]]),p.b&&O([c,h,s],[e,h,s],[e,n,s],[c,n,s],...t(p.b),[[0,0],[f,0],[f,a],[0,a]]),p.r&&O([c,h,o],[c,h,s],[c,n,s],[c,n,o],...t(p.r),[[0,0],[l,0],[l,a],[0,a]]),p.l&&O([e,h,s],[e,h,o],[e,n,o],[e,n,s],...t(p.l),[[0,0],[l,0],[l,a],[0,a]]),p.t&&O([e,n,o],[c,n,o],[c,n,s],[e,n,s],...t(p.t),[[0,0],[f,0],[f,l],[0,l]])},r=(e,c,h,n,s,o,p,S,f)=>{const l=G.TILE,a=G.WALL;if(p===0){const t=(h+n)/2,i=Math.hypot((n-h)/2,o-s),E=c-e;O([e,s,n],[c,s,n],[c,o,t],[e,o,t],S,l,_,[[0,i],[E,i],[E,0],[0,0]]),O([c,s,h],[e,s,h],[e,o,t],[c,o,t],S,l,_,[[0,i],[E,i],[E,0],[0,0]]),O([c,s,n],[c,s,h],[c,o,t],[c,o,t],f,a,_,[[0,0],[1,0],[1,1],[0,1]]),O([e,s,h],[e,s,n],[e,o,t],[e,o,t],f,a,_,[[0,0],[1,0],[1,1],[0,1]])}else{const t=(e+c)/2,i=Math.hypot((c-e)/2,o-s),E=n-h;O([c,s,n],[c,s,h],[t,o,h],[t,o,n],S,l,_,[[0,i],[E,i],[E,0],[0,0]]),O([e,s,h],[e,s,n],[t,o,n],[t,o,h],S,l,_,[[0,i],[E,i],[E,0],[0,0]]),O([e,s,n],[c,s,n],[t,o,n],[t,o,n],f,a,_,[[0,0],[1,0],[1,1],[0,1]]),O([c,s,h],[e,s,h],[t,o,h],[t,o,h],f,a,_,[[0,0],[1,0],[1,1],[0,1]])}},A=(e,c,h,n,s,o=_)=>(u.push(e[0],e[1],e[2]),D.push(c[0],c[1],c[2]),K.push(h[0],h[1],h[2]),B.push(n[0],n[1],s),H.push(o[0],o[1],o[2],o[3]),$++),k=(e,c,h,n,s,o)=>{const p=$;e.forEach((S,f)=>A(S,c,h,o[f],n,s)),N.push(p,p+1,p+2,p,p+2,p+3)},U=(e,c,h,n,s,o,p=6)=>{const S=$;for(let f=0;f<p;f++){const l=Math.PI*2*f/p,a=Math.cos(l),t=Math.sin(l);A([e+s*a,h,c+s*t],[a,0,t],o,[f/p,0],G.COLUMN),A([e+s*.86*a,n,c+s*.86*t],[a,0,t],o,[f/p,n-h],G.COLUMN)}for(let f=0;f<p;f++){const l=S+2*f,a=S+2*((f+1)%p);N.push(l,a,l+1,a,a+1,l+1)}},W=(e,c,h,n,s,o,p,S,f,l,a,t=!0)=>{const i=p==="f"||p==="b",E=i?c-e:n-h,g=i?n-h:c-e,F=Math.min(1.3,o*.16),L=g*.3,V=s+o,Y=p==="f"?[0,0,1]:p==="b"?[0,0,-1]:p==="r"?[1,0,0]:[-1,0,0],q=(Z,J,se)=>p==="f"?[e+Z,se,h+J]:p==="b"?[e+Z,se,n-J]:p==="r"?[e+J,se,h+Z]:[c-J,se,h+Z];k([q(0,.05,s),q(E,.05,s),q(E,.05,V+L),q(0,.05,V+L)],Y,l,G.SHADE,_,[[0,0],[E,0],[E,o+L],[0,o+L]]),k([q(0,g,V-F),q(E,g,V-F),q(E,g,V),q(0,g,V)],Y,l,G.WALL,_,[[0,0],[E,0],[E,F],[0,F]]);const ee=Math.hypot(g+.5,L),ae=Math.hypot(L,g);k([q(0,g+.5,V-.1),q(E,g+.5,V-.1),q(E,0,V+L),q(0,0,V+L)],[Y[0]*L/ae,g/ae,Y[2]*L/ae],a,G.TILE,_,[[0,ee],[E,ee],[E,0],[0,0]]);const ie=Math.max(2,Math.round(E/S))+1;for(let Z=0;Z<ie;Z++){const J=q(f+Z*(E-2*f)/(ie-1),g-f-.1,s);U(J[0],J[2],s,V-F,f,l)}if(t)for(const[Z,J]of[[0,-1],[E,1]]){const se=i?[J,0,0]:[0,0,J];k([q(Z,0,s),q(Z,g,s),q(Z,g,V),q(Z,0,V+L)],se,l,G.WALL,_,[[0,0],[g,0],[g,o],[0,o+L]])}return ie},d=(e,c,h,n,s,o,p,S,f)=>{const l=$;n.forEach(([t,i,E],g)=>{for(let F=0;F<s;F++){const L=Math.PI*2*(F+.5*(g%2))/s,V=i*(1-S+2*S*p()),Y=Math.cos(L),q=Math.sin(L),ee=g===0?-.5:g===n.length-1?.7:.25,ae=Math.hypot(1,ee);A([e+V*Y,c+t,h+V*q],[Y/ae,ee/ae,q/ae],o,[F/s,E],G.LEAF)}});for(let t=0;t+1<n.length;t++)for(let i=0;i<s;i++){const E=l+t*s+i,g=l+t*s+(i+1)%s;N.push(E,E+s,g,g,E+s,g+s)}for(let t=1;t+1<s;t++)N.push(l,l+t,l+t+1);const a=l+(n.length-1)*s;if(f!==void 0){const t=A([e,c+f,h],[0,1,0],o,[0,1],G.LEAF);for(let i=0;i<s;i++)N.push(a+i,t,a+(i+1)%s)}else for(let t=1;t+1<s;t++)N.push(a,a+t+1,a+t)},b=(e,c)=>{const h=.8+.4*c(),n=e.fine?[.115*h,.17*h,.075*h]:[.05*h,.072*h,.04*h];if(e.fine){d(e.x,e.y+e.h*.02,e.z,[[0,e.r*.42,0],[e.h*.1,e.r*.8,.15],[e.h*.34,e.r,.4],[e.h*.56,e.r*.86,.62],[e.h*.76,e.r*.6,.82],[e.h*.9,e.r*.3,.94]],9,n,c,.1,e.h*.98);return}d(e.x,e.y,e.z,[[e.h*.05,e.r*.5,0],[e.h*.36,e.r,.4],[e.h*.74,e.r*.6,.8]],5,n,c,.08,e.h)},m=(e,c,h,n,s,o,p)=>{const S=$,f=8,l=p()*Math.PI*2,a=o.map(g=>g*.55),t=(g,F,L,V,Y)=>{for(let q=0;q<f;q++){const ee=l+Math.PI*2*q/f,ae=F*(.88+.24*p()),ie=Math.cos(ee),Z=Math.sin(ee),J=Math.hypot(1,L);A([e+ae*ie,c+g,h+ae*Z],[ie/J,L/J,Z/J],Y,[q/f,V],G.LEAF)}};t(-s*.5,n*.5,-3,0,a),t(-s*.12,n*.9,-.6,.25,a),t(s*.2,n*.86,.5,.7,o),t(s*.62,n*.5,2.2,.95,o);for(let g=0;g<3;g++)for(let F=0;F<f;F++){const L=S+g*f+F,V=S+g*f+(F+1)%f;N.push(L,L+f,V,V,L+f,V+f)}for(let g=1;g+1<f;g++)N.push(S,S+g,S+g+1);const i=S+3*f,E=A([e,c+s*.8,h],[0,1,0],o,[0,1],G.LEAF);for(let g=0;g<f;g++)N.push(i+g,E,i+(g+1)%f)},y=(e,c,h,n,s)=>{const o=$,p=[c[0]-e[0],c[1]-e[1],c[2]-e[2]],S=Math.hypot(p[0],p[2])||1,f=-p[2]/S,l=p[0]/S;for(let a=0;a<4;a++){const t=Math.PI/2*a,i=Math.cos(t),E=Math.sin(t),g=f*i+p[0]/S*E*.3,F=l*i+p[2]/S*E*.3,L=-E;A([e[0]+h*g,e[1]+h*L*.6,e[2]+h*F],[g,L,F],s,[a/4,0],G.COLUMN),A([c[0]+n*g,c[1]+n*L*.6,c[2]+n*F],[g,L,F],s,[a/4,3],G.COLUMN)}for(let a=0;a<4;a++){const t=o+2*a,i=o+2*((a+1)%4);N.push(t,i,t+1,i,i+1,t+1)}};return{quad:O,mass:C,gable:r,face:k,vert:A,column:U,portico:W,cypress:b,pine:(e,c)=>{const h=.8+.4*c(),n=[.07*h,.105*h,.045*h],s=[.3,.22,.16],o=e.y+e.h*.72,p=.3;for(let S=0;S<4;S++){const f=Math.PI/2*S,l=f+Math.PI/2,a=f+Math.PI/4;k([[e.x+p*Math.cos(f),e.y,e.z+p*Math.sin(f)],[e.x+p*Math.cos(l),e.y,e.z+p*Math.sin(l)],[e.x+p*Math.cos(l),o,e.z+p*Math.sin(l)],[e.x+p*Math.cos(f),o,e.z+p*Math.sin(f)]],[Math.cos(a),0,Math.sin(a)],s,G.WALL,_,[[0,0],[.4,0],[.4,9],[0,9]])}d(e.x,e.y+e.h*.82,e.z,[[-e.r*.3,e.r*.6,.15],[0,e.r,.6],[e.r*.34,e.r*.5,1]],7,n,c,.16)},finePine:(e,c)=>{const h=.85+.3*c(),n=[.095*h,.165*h,.07*h],s=[.36,.25,.17],o=e.r,p=e.y+e.h,S=p-o*.95,f=$;for(let t=0;t<6;t++){const i=Math.PI/3*t,E=Math.cos(i),g=Math.sin(i);A([e.x+.42*E,e.y,e.z+.42*g],[E,0,g],s,[t/6,0],G.COLUMN),A([e.x+.3*E,S,e.z+.3*g],[E,0,g],s,[t/6,9],G.COLUMN)}for(let t=0;t<6;t++){const i=f+2*t,E=f+2*((t+1)%6);N.push(i,E,i+1,E,E+1,i+1)}const l=c()*Math.PI*2,a=o*.24;m(e.x,p-a*.8,e.z,o*.5,a,n,c);for(let t=0;t<5;t++){const i=l+Math.PI*2*t/5,E=o*(.36+.06*c()),g=o*.94-E*1,F=p-a*(1.25+.5*c());m(e.x+g*Math.cos(i),F,e.z+g*Math.sin(i),E,a*.9,n.map(L=>L*(.9+.2*c())),c)}for(let t=0;t<3;t++){const i=l+.6+Math.PI*2*t/3,E=o*(.3+.05*c()),g=o*.42,F=p-a*(2.1+.4*c());m(e.x+g*Math.cos(i),F,e.z+g*Math.sin(i),E,a*.8,n.map(L=>L*.82),c),y([e.x,S-.4,e.z],[e.x+g*Math.cos(i),F-a*.3,e.z+g*Math.sin(i)],.24,.12,s)}y([e.x,S-.4,e.z],[e.x,p-a*1.1,e.z],.26,.14,s)},stall:(e,c,h)=>{const n=v.MARKET.STALL,s=n.W/2,o=n.D/2,p=-e.fz,S=e.fx,f=(t,i,E)=>[e.x+p*t+e.fx*i,E,e.z+S*t+e.fz*i];for(const[t,i,E]of[[-s,o,n.FRONT],[s,o,n.FRONT],[-s,-o,n.BACK],[s,-o,n.BACK]]){const g=f(t,i,0);C(g[0]-.05,g[0]+.05,0,E,g[2]-.05,g[2]+.05,{f:{},b:{},l:{},r:{}},h)}const l=.3,a=(t,i)=>[[0,0],[t,0],[t,i],[0,i]];O(f(s+l,o+l,n.FRONT+.06),f(-s-l,o+l,n.FRONT+.06),f(-s-l,-o-l,n.BACK),f(s+l,-o-l,n.BACK),c,G.CLOTH,_,a(n.W+2*l,n.D+2*l)),O(f(-s-l,o+l,n.FRONT-.34),f(s+l,o+l,n.FRONT-.34),f(s+l,o+l,n.FRONT+.06),f(-s-l,o+l,n.FRONT+.06),c,G.CLOTH,_,a(n.W+2*l,.4)),O(f(s,-o,.5),f(-s,-o,.5),f(-s,-o,n.BACK),f(s,-o,n.BACK),c.map(t=>t*.8),G.CLOTH,_,a(n.W,n.BACK)),O(f(s-.2,o-.2,n.TABLE),f(-s+.2,o-.2,n.TABLE),f(-s+.2,o-1.1,n.TABLE),f(s-.2,o-1.1,n.TABLE),h,G.WALL,_,a(n.W,.9)),O(f(-s+.2,o-.2,.1),f(s-.2,o-.2,.1),f(s-.2,o-.2,n.TABLE),f(-s+.2,o-.2,n.TABLE),h.map(t=>t*.8),G.WALL,_,a(n.W,.75))},geometry:()=>{const e=new T.BufferGeometry;return e.setAttribute("position",new T.Float32BufferAttribute(u,3)),e.setAttribute("normal",new T.Float32BufferAttribute(D,3)),e.setAttribute("aCol",new T.Float32BufferAttribute(K,3)),e.setAttribute("aUV",new T.Float32BufferAttribute(B,3)),e.setAttribute("aPar",new T.Float32BufferAttribute(H,4)),e.setIndex(N),e},NONE:_}}const gt=11,He={FOOT_W:.21,FOOT_D:.15,SHOULDER_W:.25,SHOULDER_D:.15,SHOULDER_Y:1.44,HEAD_Y:1.585,HEAD_R:.125,HEAD_H:.135};function yt(){const u=He,D=[],K=[],B=[],H=[];let N=0;const $=(W,d,b,m)=>{const y=[d[0]-W[0],d[1]-W[1],d[2]-W[2]],w=[b[0]-W[0],b[1]-W[1],b[2]-W[2]],P=y[1]*w[2]-y[2]*w[1],x=y[2]*w[0]-y[0]*w[2],I=y[0]*w[1]-y[1]*w[0],e=Math.hypot(P,x,I)||1;for(const c of[W,d,b])D.push(c[0],c[1],c[2]),K.push(P/e,x/e,I/e),B.push(m);H.push(N,N+1,N+2),N+=3},_=[[-u.FOOT_W,0,-u.FOOT_D],[u.FOOT_W,0,-u.FOOT_D],[0,0,u.FOOT_D*1.2]],O=[[-u.SHOULDER_W,u.SHOULDER_Y,-u.SHOULDER_D],[u.SHOULDER_W,u.SHOULDER_Y,-u.SHOULDER_D],[0,u.SHOULDER_Y,u.SHOULDER_D*1.3]];for(let W=0;W<3;W++){const d=(W+1)%3;$(_[d],_[W],O[W],0),$(_[d],O[W],O[d],0)}$(O[0],O[2],O[1],0);const C=u.HEAD_Y,r=u.HEAD_R*1.15,A=[[-r,C-.03,-r*.6],[r,C-.03,-r*.6],[0,C-.03,r]],k=[0,C+u.HEAD_H*1.1,0];for(let W=0;W<3;W++){const d=(W+1)%3;$(A[d],A[W],k,1)}$(A[0],A[1],A[2],1);const U=new T.InstancedBufferGeometry;return U.setAttribute("position",new T.Float32BufferAttribute(D,3)),U.setAttribute("normal",new T.Float32BufferAttribute(K,3)),U.setAttribute("aPart",new T.Float32BufferAttribute(B,1)),U.setIndex(H),U}function At(){const u=v.OUTSIDE.LITTER,D=[],K=[],B=[],H=[];let N=0;const $=(b,m,y,w,P,x)=>{for(const I of[b,m,y,w])D.push(I[0],I[1],I[2]),K.push(P[0],P[1],P[2]),B.push(x);H.push(N,N+1,N+2,N,N+2,N+3),N+=4},_=u.HALF_W,O=u.LEN/2,C=u.FLOOR,r=u.TOP,A=u.POLE_LEN/2,k=.04;for(const b of[-1,1]){const m=b*u.POLE_X,y=u.POLE_Y;$([m-k,y+k,-A],[m+k,y+k,-A],[m+k,y+k,A],[m-k,y+k,A],[0,1,0],2),$([m+b*k,y-k,-A],[m+b*k,y+k,-A],[m+b*k,y+k,A],[m+b*k,y-k,A],[b,0,0],2),$([m*.82,C,-O],[m*.82,r,-O],[m*.82,r,O],[m*.82,C,O],[b,0,0],3)}for(const b of[-1,1])$([-_,C,b*O],[_,C,b*O],[_,r,b*O],[-_,r,b*O],[0,0,b],3);$([-_,C,-O],[_,C,-O],[_,C,O],[-_,C,O],[0,-1,0],2);const U=[[-_-.06,r],[-_*.5,r+u.ROOF],[_*.5,r+u.ROOF],[_+.06,r]],W=O+.08;for(let b=0;b<3;b++){const m=U[b],y=U[b+1],w=-(y[1]-m[1]),P=y[0]-m[0],x=Math.hypot(w,P);$([m[0],m[1],-W],[y[0],y[1],-W],[y[0],y[1],W],[m[0],m[1],W],[w/x,P/x,0],4)}const d=new T.InstancedBufferGeometry;return d.setAttribute("position",new T.Float32BufferAttribute(D,3)),d.setAttribute("normal",new T.Float32BufferAttribute(K,3)),d.setAttribute("aPart",new T.Float32BufferAttribute(B,1)),d.setIndex(H),d}const Ue=`
attribute float aPart; attribute vec4 aLine; attribute vec4 aWho; attribute vec4 aAt;
varying vec3 vW; varying vec3 vN; varying vec3 vWho;
uniform float uTime; uniform vec3 uSun;
void main() {
  // aAt: the floor's y under the figure; x 1 a figure that stands (it faces along its line from the first point and
  // shifts its weight now and then) or 0 one that walks its line; the share of open sun for a figure in an arcade
  // (under 0: the place's own light by the one law)
  vec2 a = aLine.xy, b = aLine.zw, dir = b - a; float len = max(length(dir), 1.); dir /= len;
  float stand = step(.5, aAt.y);
  float f = fract(aWho.x + uTime * aWho.y / len) * (1. - stand);
  // it slows toward its line's end by aAt.w (from 1 + w of its pace at the start to 1 - w at the end): they bunch at
  // the posts and the arches
  f += aAt.w * (f - f * f);
  vec2 at = a + dir * len * f;
  // the step's small rise and fall (two steps to 1.5 m of way)
  float bob = .025 * abs(sin(f * len * 2.1 + aWho.x * 40.)) * (1. - stand);
  vec3 p = position * aWho.z;
  p.x += stand * .05 * sin(uTime * (.5 + .5 * aWho.w) + aWho.x * 50.) * p.y;
  vec3 w = vec3(at.x + p.x * dir.y + p.z * dir.x, aAt.x + p.y + bob, at.y - p.x * dir.x + p.z * dir.y);
  vN = vec3(normal.x * dir.y + normal.z * dir.x, normal.y, -normal.x * dir.x + normal.z * dir.y);
  vW = w; vWho = vec3(aPart, aWho.w, aAt.z);
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
}`,Be=`
varying vec3 vW; varying vec3 vN; varying vec3 vWho;
${v.LIGHT_GLSL}
${pe}
void main() {
  vec3 N = normalize(vN);
  // white wool for most, dark cloaks for the rest; the head a plain brown (no face)
  float t = vWho.y;
  // (order three: on the paved ground a figure reads by its dress: half in white wool, the rest in undyed wool, brown,
  // dull red, ochre, grey blue and dark cloaks)
  // (addendum 8: no two figures alike in a row of whites: two in five in white wool, each its own white from fresh to worn grey; the
  // rest in undyed wool, brown, dull red, ochre, green, grey blue and dark cloaks, each a little lighter or darker)
  vec3 cloth = t < .4 ? mix(vec3(.62, .58, .5), vec3(.88, .86, .8), fract(t * 37.)) : t < .56 ? vec3(.56, .47, .34) : t < .68 ? vec3(.3, .22, .16) : t < .77 ? vec3(.56, .17, .12) : t < .85 ? vec3(.68, .47, .15) : t < .9 ? vec3(.3, .4, .2) : t < .95 ? vec3(.24, .32, .46) : vec3(.17, .16, .17);
  cloth *= .82 + .36 * fract(t * 173.);
  vec3 alb = vWho.x > .5 ? mix(vec3(.4, .27, .19), vec3(.2, .15, .12), step(.5, fract(t * 91.))) : cloth * (.75 + .25 * smoothstep(0., 1.2, vW.y));
  // a litter: timber poles, drawn curtains of a plain dyed or undyed cloth hanging in folds, a dark roof
  if (vWho.x > 1.5) {
    vec3 curtain = t < .4 ? vec3(.74, .7, .6) : t < .62 ? vec3(.5, .22, .17) : t < .82 ? vec3(.66, .52, .26) : vec3(.3, .34, .4);
    alb = vWho.x < 2.5 ? vec3(.34, .24, .15) : vWho.x < 3.5 ? curtain * (.82 + .18 * sin((vW.x + vW.z) * 23.)) : curtain * .55;
  }
  // (a figure in an arcade takes the sun that comes in at its opening: its own share; the others the place's light)
  vec3 sun = (vWho.z < 0. ? sunAt(vW + vec3(0., .1, 0.)) * townSun(vW) : vec3(vWho.z)) * uSunCol * max(dot(N, uSun), 0.);
  float inside = step(0., vWho.z);
  vec3 col = alb * (sun + uSkyCol * (.7 + .3 * N.y) * (1. - .45 * inside) + uBounceCol * (1.2 - .6 * N.y));
  gl_FragColor = vec4(hazed(col, vW), 1.);
}`,Et=`
attribute vec4 aLine; attribute vec4 aWho; attribute vec4 aAt;
varying vec3 vW; varying vec2 vQ;
uniform float uTime; uniform vec3 uSun;
void main() {
  vec2 a = aLine.xy, b = aLine.zw, dir = b - a; float len = max(length(dir), 1.); dir /= len;
  float f = fract(aWho.x + uTime * aWho.y / len) * (1. - step(.5, aAt.y));
  f += aAt.w * (f - f * f);
  vec2 at = a + dir * len * f;
  vec2 sd = -uSun.xz / max(length(uSun.xz), 1e-3), across = vec2(-sd.y, sd.x);
  float reach = ${He.HEAD_Y.toFixed(2)} * aWho.z * length(uSun.xz) / max(uSun.y, .1);
  vec2 q = at + across * position.x * (.66 - .26 * position.y) + sd * (position.y * reach - .08);
  vW = vec3(q.x, aAt.x + .04, q.y); vQ = position.xy;
  gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.);
}`,Rt=`
varying vec3 vW; varying vec2 vQ;
${v.LIGHT_GLSL}
${pe}
void main() {
  float lit = sunAt(vW).g * townSun(vW);
  float a = .72 * lit * (1. - smoothstep(.55, 1., abs(vQ.x) * 2.)) * (1. - .4 * smoothstep(.5, 1., vQ.y));
  gl_FragColor = vec4(vec3(.05, .06, .09), a);
}`,be=7,Lt=`
attribute vec3 aSrc; attribute vec3 aP;
uniform float uTime; uniform vec3 uWind;
varying vec3 vW; varying vec3 vP;
void main() {
  float h = aP.x, sd = aP.z, H = 9. + 7. * fract(sd * 7.13), t = uTime;
  vec3 c = aSrc + vec3(0., h * H, 0.);
  c.xz += uWind.xz * (h * h) * H * .6 + vec2(sin(t * .5 + sd * 40. + h * 3.1), cos(t * .43 + sd * 23. + h * 2.3)) * (.2 + 1.1 * h) * h;
  vec3 axis = normalize(vec3(uWind.x * h * 1.2, 1., uWind.z * h * 1.2));
  vec3 side = normalize(cross(axis, normalize(cameraPosition - c)));
  vec3 p = c + side * aP.y * (.55 + 2.3 * h);
  vW = p; vP = aP;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,Tt=`
varying vec3 vW; varying vec3 vP;
${v.LIGHT_GLSL}
${v.NOISE_GLSL}
void main() {
  float h = vP.x, x = vP.y;
  float n = fbm2(vec2(x * 1.3 + vP.z * 9., h * 5.5 - uTime * .22));
  // (order three: a thick foot and a thinning, leaning plume)
  float a = .8 * pow(max(1. - x * x, 0.), 1.5) * smoothstep(0., .04, h) * pow(max(1. - h, 0.), 1.6) * (.45 + 1.1 * n);
  vec3 col = vec3(.62, .64, .7) * (uSunCol * .5 + uSkyCol * 1.5);
  gl_FragColor = vec4(hazed(col, vW), a);
}`,Ft=`
attribute vec4 aFlock; attribute vec4 aOval; attribute vec4 aBird;
uniform float uTime;
varying vec3 vW; varying float vTone;
void main() {
  // aFlock: the oval's centre and its turn (radians a second); aOval: its two radii, the bird's size, its tone;
  // aBird: its place on the oval (radians), out or in from it, above or under it, its own beat
  float t = uTime, ang = aBird.x + t * aFlock.w + .25 * sin(t * .31 + aBird.w * 6.);
  float out_ = aBird.y + 1.6 * sin(t * .23 + aBird.w * 9.), sgn = sign(aFlock.w);
  vec3 c = aFlock.xyz + vec3(cos(ang) * (aOval.x + out_), aBird.z + .8 * sin(t * .4 + aBird.w * 4.), sin(ang) * (aOval.y + out_));
  vec3 fwd = normalize(vec3(-sin(ang) * aOval.x, 0., cos(ang) * aOval.y)) * sgn, right = vec3(-fwd.z, 0., fwd.x);
  // the wings: a beat for a few strokes, then a glide (position.x: -1 or 1 a wing's tip, 0 the body; position.z: along)
  float beat = sin(t * (9. + 3. * fract(aBird.w * 3.7)) + aBird.w * 20.) * smoothstep(-.2, .3, sin(t * .7 + aBird.w * 11.));
  float tip = abs(position.x);
  vec3 p = c + (right * position.x * (1. - .25 * tip * abs(beat)) + fwd * position.z + vec3(0., tip * (.12 + .55 * beat), 0.)) * aOval.z;
  vW = p; vTone = aOval.w;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,St=`
varying vec3 vW; varying float vTone;
${v.LIGHT_GLSL}
void main() {
  vec3 col = mix(vec3(.07, .07, .08), vec3(.34, .33, .34), vTone) * (uSunCol * .6 + uSkyCol * 1.2);
  gl_FragColor = vec4(hazed(col, vW), 1.);
}`;async function kt(u,D){const{U:K,scene:B,R:H}=D,N={triangles:0,calls:0,pieces:{}},$=[H.far()*40,H.far()*40],_=(r,A,k)=>(A.name=r,A.matrixAutoUpdate=!1,A.updateMatrix(),B.add(A),N.triangles+=k,N.calls+=1,N.pieces[r]=k,A),O=v.townPlan(H.town,$);await u.yield();const C=vt(O);await u.yield();{const r=[30,96];for(;r[r.length-1]<420;)r.push(r[r.length-1]+12);for(;r[r.length-1]<7e3;)r.push(Math.min(7e3,r[r.length-1]*1.28));const A=128,k=[],U=[];for(let b=0;b<r.length;b++)for(let m=0;m<=A;m++){const y=m/A*Math.PI*2,w=Math.cos(y)*r[b],P=Math.sin(y)*r[b];k.push(w,v.groundY(w,P,$),P)}for(let b=0;b+1<r.length;b++)for(let m=0;m<A;m++){const y=b*(A+1)+m,w=y+A+1;U.push(y,y+1,w,y+1,w+1,w)}const W=new T.BufferGeometry;W.setAttribute("position",new T.Float32BufferAttribute(k,3)),W.setIndex(U);const d=new T.ShaderMaterial({uniforms:{...K,...C},vertexShader:Ie,fragmentShader:rt,extensions:{derivatives:!0}});_("ground",new T.Mesh(W,d),U.length/3).frustumCulled=!1}await u.yield();{let r;{const U=v.farRoofSteps(H.far,$);let W=U.next();for(;!W.done;)await u.frame(),W=U.next();r=W.value}await u.yield();const A=await ft(O,H.town,r,()=>u.yield()),k=new T.ShaderMaterial({uniforms:{...K,...C},vertexShader:ht,fragmentShader:dt,extensions:{derivatives:!0},side:T.DoubleSide});_("town",new T.Mesh(A,k),A.index.count/3).frustumCulled=!1,N.houses=O.length,N.farRoofs=r.length}await u.yield();{const r=bt(),A=v.hillMasses(),k=z.BATHS,U=z.PALACE,W=z.TERRACE,d=G,b=[.76,.7,.58],m=v.COLOUR.TRAVERTINE,y=[.8,.78,.73],w=Ce,P=[.56,.51,.41],x={k:d.WALL},I={k:d.TILE,c:w};let e=A.baths;r.mass(...e,{f:x,b:x,l:{k:d.WALL,p:[10.5,7,6,4.4]},r:{k:d.WALL,p:[10.5,7,6,4.4]}},b);for(let R=0;R<3;R++)r.gable(e[0]+(e[1]-e[0])*R/3,e[0]+(e[1]-e[0])*(R+1)/3,e[4],e[5],e[3],e[3]+5.5,1,w,b);e=A.bathsHall,r.mass(e[0],e[1],e[2],e[3]-4,e[4],e[5],{f:{k:d.WALL,p:[11.3,2.6,.8,5]},b:x,l:{k:d.WALL,p:[11.6,2.6,.8,5]},r:{k:d.WALL,p:[11.6,2.6,.8,5]}},b),r.gable(e[0],e[1],e[4],e[5],e[3]-4,e[3],1,w,b),e=A.bathsFront;let c=r.portico(e[0],e[1],e[4],e[5],e[2],k.FRONT_H-2.4,"f",4.2,.5,y,w);const h=k.CX-k.STAIR_W/2,n=k.CX+k.STAIR_W/2,s=z.N_TOP,o=k.STAIR_Z1,p=z.N_Y+k.STAIR_LIFT,S=Math.hypot(o-s,p);r.quad([h,.05,o],[n,.05,o],[n,p,s],[h,p,s],m,d.STAIR,[.62,0,0,0],[[0,0],[k.STAIR_W,0],[k.STAIR_W,S],[0,S]]),r.quad([h,-.5,s],[h,-.5,o],[h,.05,o],[h,p,s],m,d.WALL,r.NONE,[[0,0],[58,0],[58,1],[0,18]]),r.quad([n,-.5,o],[n,-.5,s],[n,p,s],[n,.05,o],m,d.WALL,r.NONE,[[0,0],[58,0],[58,18],[0,1]]),e=A.bathsFoot,c+=r.portico(e[0],e[1],e[4],e[5],e[2],6,"f",4.5,.42,y,w),e=A.palace,r.mass(e[0],e[1],e[2],e[3],e[4],e[5],{f:{k:d.WALL,p:[5.2,2.2,8.4,1.6]},r:x,b:x},b),r.gable(e[0],e[1],e[4],e[5],e[3],e[3]+3,0,w,b),e=A.palacePortico,c+=r.portico(e[0],e[1],e[4],e[5],e[2],5.4,"f",3.6,.36,y,w),e=A.terrace;const f={k:d.WALL,c:w,p:[-ze[0],ze[1],0,0]};r.mass(e[0],e[1],-2-.2,e[3],e[4],e[5],{l:{k:d.ARCADE,p:[6,7.4,(e[3]+.2)/2,2.4]},b:f,r:x,f:x,t:{k:d.GARDEN,c:P,p:[23,17,1,0]}},m),r.mass(e[0],e[1],e[3],e[3]+1.05,e[4],e[4]+.5,{f:x,b:x,t:x},m);const l=z.S_Y+W.PARAPET,a=W.PORTICO_H,t=W.PORTICO_D;c+=r.portico(e[1]-t,e[1],e[4],e[5],l,a-1.4,"l",3.5,.38,y,w),c+=r.portico(e[0],e[0]+t,e[4],e[5],l,a-1.4,"r",3.5,.38,y,w),c+=r.portico(e[0]+t,e[1]-t,e[5]-t,e[5],l,a-1.4,"b",3.5,.38,y,w,!1),e=A.temple;const i=[.69,.615,.5],E=l+W.PODIUM,g=E+W.COLUMN,F=g+W.ENTAB;r.mass(e[0],e[1],l,E,e[4],e[5],{f:x,b:x,l:x,r:x,t:{k:d.TOP,c:i}},i),r.quad([e[1],l,e[4]-8],[e[0],l,e[4]-8],[e[0],E,e[4]],[e[1],E,e[4]],i,d.STAIR,[.6,0,0,0],[[0,0],[30,0],[30,9],[0,9]]);{const R=v.altarPlan().box;r.mass(R[0],R[1],R[2],R[3],R[4],R[5],{f:x,b:x,l:x,r:x,t:{k:d.TOP,c:i}},i)}const L=.78,V={k:d.SHADE},Y=(R,j)=>{r.column(R,j,E+.5,g-1.5,L,i,12),r.mass(R-L*1.3,R+L*1.3,E,E+.5,j-L*1.3,j+L*1.3,{f:x,b:x,l:x,r:x,t:x},i),r.column(R,j,g-.35,g-1.5,L*1.28,i,8),r.mass(R-L*1.25,R+L*1.25,g-.35,g,j-L*1.25,j+L*1.25,{f:x,b:x,l:x,r:x},i)};for(let R=0;R<6;R++)for(const j of[e[4]+L+.2,e[5]-L-.2])Y(e[0]+L+.2+R*(e[1]-e[0]-2*L-.4)/5,j);for(let R=1;R<10;R++)for(const j of[e[0]+L+.2,e[1]-L-.2])Y(j,e[4]+L+.2+R*(e[5]-e[4]-2*L-.4)/10);c+=30;const q=(e[5]-e[4]-2*L-.4)/10,ee=(e[1]-e[0]-2*L-.4)/5,ae=e[4]+L+.2,ie=e[0]+L+.2,Z=W.COLUMN,J=[.74,.67,.56];r.mass(e[0]+4.6,e[1]-4.6,E,g,e[4]+9.5,e[5]-4.6,{r:{k:d.CELLA,p:[q,ae,4.6-L-.2,Z]},l:{k:d.CELLA,p:[q,ae,4.6-L-.2,Z]},b:{k:d.CELLA,p:[-ee,ie,9.5-L-.2,Z]},f:{k:d.CELLA,p:[ee,ie,4.6-L-.2,Z]}},J),r.mass(e[0],e[1],g,F,e[4],e[5],{f:{k:d.ENTAB},b:{k:d.ENTAB},l:{k:d.ENTAB},r:{k:d.ENTAB}},i),r.mass(e[0]-.5,e[1]+.5,F-.6,F,e[4]-.5,e[5]+.5,{f:x,b:x,l:x,r:x},i),r.quad([e[0]-.5,F-.6,e[4]-.5],[e[1]+.5,F-.6,e[4]-.5],[e[1]+.5,F-.6,e[5]+.5],[e[0]-.5,F-.6,e[5]+.5],i,d.WALL,r.NONE,[[0,0],[31,0],[31,53],[0,53]]),r.quad([e[0],g,e[4]],[e[1],g,e[4]],[e[1],g,e[5]],[e[0],g,e[5]],i.map(R=>R*.92),d.WALL,r.NONE,[[0,0],[30,0],[30,52],[0,52]]),r.gable(e[0],e[1],e[4],e[5],F,F+W.PEDIMENT,1,w,i),await u.yield();const se=v.gardenPlan(H.hills),ge=[.72,.64,.52],Ge=[26,(z.N_FOOT-z.N_TOP)/v.GARDEN.TERRACES,0,0];for(const R of se.terraces){const j=R.x1-R.x0,te=R.y1-R.y0+.8,X=R.zf-R.zb;r.face([[R.x0,R.y0,R.zf],[R.x1,R.y0,R.zf],[R.x1,R.y1+.8,R.zf],[R.x0,R.y1+.8,R.zf]],[0,0,1],ge,d.WALL,r.NONE,[[0,0],[j,0],[j,te],[0,te]]),r.face([[R.x0,R.y1,R.zf],[R.x1,R.y1,R.zf],[R.x1,R.y1,R.zb],[R.x0,R.y1,R.zb]],[0,1,0],ge,d.GARDEN,Ge,[[0,0],[j,0],[j,X],[0,X]]);for(const[Q,le]of[[R.x0,-1],[R.x1,1]])r.face([[Q,R.y0,R.zf],[Q,R.y1,R.zf],[Q,R.y1,R.zb],[Q,R.y1,R.zb]],[le,0,0],ge,d.WALL,r.NONE,[[0,0],[0,3],[X,3],[X,3]])}await u.yield();for(const R of se.trees)(R.kind===0?r.cypress:r.pine)(R,H.hills);await u.yield();{const R=[[.8,.76,.66],[.72,.52,.24],[.6,.27,.2],[.36,.42,.5],[.6,.52,.38],[.84,.8,.7]],j=[.36,.27,.18],te=[...re.stalls,...$e.stalls];for(const X of te)r.stall(X,R[Math.floor(X.tone*R.length)%R.length],j);for(const X of re.rows)for(let Q=0;Q<X.n;Q++)r.finePine({...v.pineTree(X,Q),y:0},H.hills);N.stalls=te.length,N.pines=re.rows.reduce((X,Q)=>X+Q.n,0)}await u.yield(),N.trees=se.trees.length,N.columns=c;const Te=v.ellipseSteps(M.RIM_A,M.RIM_B,M.BAYS,-.5),Ve=M.POST_H,ve=.25,Fe=v.COLOUR.TIMBER,Se=R=>[R.x+R.nx*M.PAVE_W,R.z+R.nz*M.PAVE_W];for(let R=0;R<M.BAYS;R++){const[j,te]=Se(Te[R]);if(r.mass(j-ve,j+ve,0,Ve,te-ve,te+ve,{f:x,b:x,l:x,r:x,t:x},m),R%2===1){const[X,Q]=Se(Te[(R+1)%M.BAYS]),le=Math.hypot(X-j,Q-te),he=-(Q-te)/le*.06,de=(X-j)/le*.06;for(const[We,Oe,ce]of[[1,1.12,1],[1,1.12,-1]])r.quad([j+he*ce,We,te+de*ce],[X+he*ce,We,Q+de*ce],[X+he*ce,Oe,Q+de*ce],[j+he*ce,Oe,te+de*ce].map(ye=>ye),Fe,d.WALL,r.NONE,[[0,0],[le,0],[le,.12],[0,.12]].map(ye=>ye));r.quad([j-he,1.12,te-de],[X-he,1.12,Q-de],[X+he,1.12,Q+de],[j+he,1.12,te+de],Fe,d.WALL,r.NONE,[[0,0],[le,0],[le,.12],[0,.12]])}}const ke=r.geometry(),qe=new T.ShaderMaterial({uniforms:{...K},vertexShader:pt,fragmentShader:xt,extensions:{derivatives:!0},side:T.DoubleSide});_("hills' masses and posts",new T.Mesh(ke,qe),ke.index.count/3).frustumCulled=!1}await u.yield();{const r=v.outsidePlan(H.people,D.density,O.lanes),A=v.arcadePlan(H.arcades,D.density),k=yt();await u.yield();const U=await v.groundPlan(r,D.stream("p1-ground"),D.density,O.lanes,()=>u.yield(),()=>u.frame()),W=U.line,d=U.slow;await u.yield();const b=await v.terracePlan(D.stream("p1-entry"),D.density,()=>u.yield()),m=[U.more,b.open,b.roofed],y=b.roofed.n;N.peopleTerrace=b.open.n+b.roofed.n,await u.yield();const w=r.n+m.reduce((a,t)=>a+t.n,0),P=w+A.n,x=new Float32Array(P*4),I=new Float32Array(P*4),e=new Float32Array(P*4);x.set(W),I.set(r.who),x.set(A.line,w*4),I.set(A.who,w*4);for(let a=0;a<r.n;a++)e[a*4+1]=r.stand[a],e[a*4+2]=-1,e[a*4+3]=d[a];{let a=r.n;for(const t of m){x.set(t.line,a*4),I.set(t.who,a*4);for(let i=0;i<t.n;i++,a++)e[a*4]=t.y[i],e[a*4+1]=t.stand[i],e[a*4+2]=t.sun[i],e[a*4+3]=t.slow[i]}}const c=K.uSun.value;for(let a=0;a<A.n;a++){const t=(w+a)*4,i=A.at[a*4+2]*c.x+A.at[a*4+3]*c.z;e[t]=A.at[a*4],e[t+1]=A.at[a*4+1],e[t+2]=i>.12?A.at[a*4+1]>.5?1:.3:0}k.setAttribute("aLine",new T.InstancedBufferAttribute(x,4)),k.setAttribute("aWho",new T.InstancedBufferAttribute(I,4)),k.setAttribute("aAt",new T.InstancedBufferAttribute(e,4)),k.instanceCount=P,r.n=P,N.peopleArcades=A.n;const h=new T.ShaderMaterial({uniforms:{...K,...C},vertexShader:Ue,fragmentShader:Be});_("people outside",new T.Mesh(k,h),r.n*gt).frustumCulled=!1,N.peopleOutside=P-A.n;{const a=new T.InstancedBufferGeometry;a.setAttribute("position",new T.Float32BufferAttribute([-.5,0,0,.5,0,0,.5,1,0,-.5,1,0],3)),a.setIndex([0,1,2,0,2,3]),a.setAttribute("aLine",k.getAttribute("aLine")),a.setAttribute("aWho",k.getAttribute("aWho")),a.setAttribute("aAt",k.getAttribute("aAt")),a.instanceCount=P-A.n-y;const t=new T.ShaderMaterial({uniforms:h.uniforms,vertexShader:Et,fragmentShader:Rt,transparent:!0,depthWrite:!1,side:T.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),i=_("people's shadows",new T.Mesh(a,t),(P-A.n-y)*2);i.frustumCulled=!1,i.renderOrder=1}const n=At(),s=(a,t)=>{const i=new Float32Array(a.length+t.length);return i.set(a),i.set(t,a.length),i},o=r.litters,p=U.litters,S={n:o.n+p.n,line:s(o.line,p.line),who:s(o.who,p.who),slow:s(o.slow,p.slow),y:s(new Float32Array(o.n),p.y)},f=new Float32Array(S.n*4);for(let a=0;a<S.n;a++)f[a*4]=S.y[a],f[a*4+2]=-1,f[a*4+3]=S.slow[a];n.setAttribute("aLine",new T.InstancedBufferAttribute(S.line,4)),n.setAttribute("aWho",new T.InstancedBufferAttribute(S.who,4)),n.setAttribute("aAt",new T.InstancedBufferAttribute(f,4)),n.instanceCount=S.n;const l=new T.ShaderMaterial({uniforms:h.uniforms,vertexShader:Ue,fragmentShader:Be,side:T.DoubleSide});_("litters",new T.Mesh(n,l),S.n*(n.index.count/3)).frustumCulled=!1,N.litters=S.n}await u.yield();{const r=[],A=[],k=[];let U=0;const W=(H.air()*.36+.32)*Math.PI,d=.5+.5*H.air();for(const w of[...O.smoke,{...v.altarPlan().smoke,altar:!0}]){const P=w.altar?H.altar():H.air();for(let x=0;x<=be;x++)for(const I of[-1,1])r.push(w.x,w.y,w.z),A.push(x/be,I,P);for(let x=0;x<be;x++){const I=U+x*2;k.push(I,I+1,I+2,I+1,I+3,I+2)}U+=(be+1)*2}const b=new T.BufferGeometry;b.setAttribute("position",new T.Float32BufferAttribute(r,3)),b.setAttribute("aSrc",new T.Float32BufferAttribute(r,3)),b.setAttribute("aP",new T.Float32BufferAttribute(A,3)),b.setIndex(k);const m=new T.ShaderMaterial({uniforms:{...K,uWind:{value:new T.Vector3(-Math.cos(W)*d,0,-Math.sin(W)*d*.6)}},vertexShader:Lt,fragmentShader:Tt,transparent:!0,depthWrite:!1,side:T.DoubleSide}),y=_("roofs' smoke",new T.Mesh(b,m),k.length/3);y.frustumCulled=!1,y.renderOrder=2,N.smokes=O.smoke.length+1}{const r=v.flockPlan(D.stream),A=[],k=[],U=[];let W=0;for(const m of r)for(let y=0;y<m.n;y++){const w=m.birds.subarray(y*5,y*5+5);A.push(m.x,m.y,m.z,m.turn),k.push(m.rx,m.rz,.42+.2*w[4],m.wall?.1*w[3]:w[3]*w[3]),U.push((m.phase||0)+w[0]*Math.PI*2*(m.wall?.16:.34),(w[1]*2-1)*m.spread,(w[2]*2-1)*v.AIR.RISE*.7,w[3]),W++}const d=new T.InstancedBufferGeometry;d.setAttribute("position",new T.Float32BufferAttribute([0,0,.5,0,0,-.45,-1,0,-.15,1,0,-.15],3)),d.setIndex([0,2,1,0,1,3]),d.setAttribute("aFlock",new T.InstancedBufferAttribute(new Float32Array(A),4)),d.setAttribute("aOval",new T.InstancedBufferAttribute(new Float32Array(k),4)),d.setAttribute("aBird",new T.InstancedBufferAttribute(new Float32Array(U),4)),d.instanceCount=W;const b=new T.ShaderMaterial({uniforms:{...K},vertexShader:Ft,fragmentShader:St,side:T.DoubleSide});_("birds",new T.Mesh(d,b),W*2).frustumCulled=!1,N.birds=W,N.flocks=r.length}await u.yield();{const r=new T.CircleGeometry(1,72);r.rotateX(-Math.PI/2),r.scale(M.WATER_A,1,M.WATER_B),r.translate(0,M.WATER_Y,0);const A=new T.ShaderMaterial({uniforms:{...K,uMarks:D.water.uMarks,uMarkN:D.water.uMarkN,uCrowd:D.water.uCrowd},vertexShader:Ie,fragmentShader:lt});_("water",new T.Mesh(r,A),72).frustumCulled=!1}return await u.yield(),{info:N,update(){},dispose(){C.uTownH.value.dispose()}}}export{Nt as default};
