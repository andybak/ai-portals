import*as n from"three";const t={storeX0:-40,storeX1:240,storeHalf:30,storeCrown:48,rankZ:[9,16,23],colStep:6,colX0:-37,colN:46,storeWheels:40,storeR:.9,storeFoot:2,storeBand:.6,ribDeep:2.5,crossX1:300,fly:{x:270,y:9,z:-28,R:13,rim:2.3,hub:1.7,turn:9},cx:420,cz:0,drumR:75,archW:345,archE:495,lanternY:72,lanternR:15,clerY:43,millWheels:50,millR:1.2,millFoot:6,millBand:.6,ribR:[21,27,33],spindleOff:1.9,ribBearings:[42,66,90,114,138,222,246,270,294,318],barrelZ:[-11,0,11],barrelR:4,barrelTop:[48,56,48],barrelFoot:4,postR:17.5,hangStep:8,footCol:1.56,footSpindle:.45,footPost:.8,footBarrel:4.7,midPostZ:5.5,cardX0:540,cardX1:740,cardHalf:20,cardHigh:56,galY:[8,17,26,35,44],galDeep:4,loomX0:740,loomX1:942.2,loomHalf:40,loomHigh:74,loomX:940,fellY:52,beamY:62,warpTop:60.5,rollY:25.5,warpHalf:23,gateW:16,gateH:20,postZ:10.8,postHalf:1.2,breastTop:22,outerZ:[31.6,39.4],outerY:[5,67],fallZ:[12.3,24.8],fallTop:24.2,fallX:937.6};function _e(e={}){const s=p=>new n.Color(p);return{uTime:{value:0},uSunDir:{value:(e.sunDir||new n.Vector3(.807,.407,.429)).clone().normalize()},uSunCol:{value:s(e.sunColor||"#fff1cf").multiplyScalar(e.sunPower??3)},uSkyCol:{value:s(e.sky||"#cfdcec")},uFloorCol:{value:s(e.bounce||"#5a4a38")},uFogCol:{value:s(e.fog||"#c9d3dc")},uFogDen:{value:e.fogDensity??.0011},uRanks:{value:e.ranks??3},uClothA:{value:s(e.clothA||"#1c2f5e")},uClothB:{value:s(e.clothB||"#d9a520")},uClothC:{value:s(e.clothC||"#b3202e")},uClothD:{value:s(e.clothD||"#1f6b5a")},uTempo:{value:e.tempo??1},uWheel:{value:e.wheel??0},uDots:{value:Array.from({length:24},()=>new n.Vector3(1.2,0,0))},uAbreast:{value:e.abreast??5}}}const a=e=>Number.isInteger(e)?e+".":String(e),Oe=.35,V=`
uniform float uTime, uFogDen, uRanks, uTempo;
uniform vec3 uSunDir, uSunCol, uSkyCol, uFloorCol, uFogCol, uClothA, uClothB, uClothC, uClothD;
uniform vec3 uDots[24]; uniform float uAbreast, uWheel;
const vec2 MILL_C = vec2(${a(t.cx)}, ${a(t.cz)});
float gap(float v, float period, float halfBar){
  float d = abs(fract(v/period) - .5)*period;
  return smoothstep(halfBar, halfBar + .22, d);
}
float hash11(float n){ return fract(sin(n*127.1 + 3.7)*43758.5453); }
float hash21(vec2 v){ return fract(sin(dot(v, vec2(127.1, 311.7)))*43758.5453); }
// A CHAIN'S STEP at clock t: x = how far through the step (0..1, signed by its sense), y = the count of cards gone by,
// z = seconds since the step began. backed 0: the chain runs on. backed b >= 1: it goes back four steps in every
// twelve and runs them again, and its round of twelve is counted from its own dealt number b - 1 (0 to 11).
vec3 chainStep(float t, float period, float phase, float backed){
  float tau = t + phase, n = floor(tau/period), f = tau - n*period;
  float isB = step(.5, backed), m = n + max(backed - 1., 0.);
  float r = mod(m, 12.), q = floor(m/12.);
  float dir = mix(1., r < 8. ? 1. : -1., isB);
  float gone = mix(n, 4.*q + (r <= 8. ? r : 16. - r), isB);
  return vec3(dir*smoothstep(0., ${a(Oe)}, f), gone, f);
}
// THE CLOTH'S LIGHT as it lies on a face (w: metres across the cloth and up it): the ground's colour, with soft
// patches of the two flower colours, a row to about every five metres of cloth (the cloth's own repeat), going down
// with the weave as it creeps (the world's clock, the cloth's own creep)
vec3 clothLight(vec2 w){
  float t = uTime*uTempo*.3;
  float a = .5 + .5*sin(w.x*.61 + 2.*sin(w.y*.17 + 1.))*cos((w.y + t)*1.2);
  float b = .5 + .5*sin(w.x*.47 + 2.3 + 2.*sin(w.y*.13))*cos((w.y + t)*1.05 + 2.);
  return uClothA*3.6 + uClothB*1.1*smoothstep(.55, .95, a) + uClothC*1.1*smoothstep(.6, 1., b) + .02;
}
float inDrum(vec3 p){ return 1. - smoothstep(75.7, 77.7, length(p.xz - MILL_C)); }
float millDark(vec3 p){ return 1. - smoothstep(75.7, 79.5, length(p.xz - MILL_C)); }
float rankShade(vec3 p, float zr){
  float t = (zr - p.z)/max(uSunDir.z, .08);
  vec3 q = p + uSunDir*t;
  float dx = abs(fract((q.x - ${a(t.colX0)})/6. + .5) - .5)*6.;
  float hit = (1. - smoothstep(.72, 1.02, dx))*step(1.3, t)*step(q.y, 26.3)*step(${a(t.colX0-1)}, q.x)*step(q.x, 234.);
  return 1. - hit;
}
// THE FLYWHEEL'S SHADE: the wheel stands in the sun in its own plane; north of it the sun is cut by its rim, its hub
// and its eight spokes, which turn with the wheel (the wheel's own dealt phase, on the world's clock): a great
// turning shade on the bay's floor and back wall. Its edge is the softer the farther the shade falls.
float wheelShade(vec3 p){
  float back = ${a(t.fly.z)} - p.z, t = back/max(uSunDir.z, .08);
  vec2 d = (p + uSunDir*t).xy - vec2(${a(t.fly.x)}, ${a(t.fly.y)});
  float r = length(d), w = .15 + .02*t, R = ${a(t.fly.R)}, ri = ${a(t.fly.R-t.fly.rim)};
  float ang = atan(d.y, d.x + 1e-5) - 6.2831853*(uTime*uTempo + uWheel)/${a(t.fly.turn)};
  float off = abs(fract(ang/.7853982 + .5) - .5)*.7853982*r;
  float rim = smoothstep(ri - w, ri + w, r)*(1. - smoothstep(R - w, R + w, r));
  float spoke = (1. - smoothstep(.5 - w, .5 + w, off))*(1. - smoothstep(ri - w, ri + w, r));
  float hub = 1. - smoothstep(${a(t.fly.hub)} - w, ${a(t.fly.hub)} + w, r);
  return 1. - max(rim, max(spoke, hub))*step(2., back);
}
// THE RIBS' SHADE. Every rib of the Store's vault is an iron arch with a web ${a(t.ribDeep)} m deep under the glass, on a pier
// a metre deep, fourteen metres from the next. The morning sun comes slanting along the nave, so the ribs cut it as
// the slats of a blind do: where the ray from a place to the sun leaves the vault within a rib's depth of the rib
// behind it, the place is in that rib's shade. The shade lies in bands across the floor, one to a rib, and in bands
// down every column (the lower the sun, the deeper the bands); it stands still in the world. A ray that leaves by
// the south wall under the vault's foot is cut by the rib's pier instead, as broad along the hall as the sun's
// slant makes a metre of depth.
float ribShade(vec3 p){
  if (p.z > 29.5) return 1.;
  float sx = max(uSunDir.x, .05), a = uSunDir.y/sx, b = max(uSunDir.z, .02)/sx;
  float sw = (30. - p.z)/b;
  if (p.y + a*sw < 30.) {
    float c = p.x + sw - .5/b, d = abs(fract((c + 3.5)/14.) - .5)*14.;
    return smoothstep(.55 + .5/b, 1.45 + .5/b, d);
  }
  float py = p.y - 30.;
  float A = a*a/324. + b*b/900., B = py*a/324. + p.z*b/900., C = py*py/324. + p.z*p.z/900. - 1.;
  float s = (-B + sqrt(max(B*B - A*C, 0.)))/A, ze = p.z + b*s;
  // how fast the ray closes on the vault as it goes (metres of depth to a metre along the hall)
  float g = max(a + .02*ze/sqrt(max(1. - ze*ze/900., .02))*b, .06), D = ${a(t.ribDeep)}/g, e = .3 + .12*D;
  float w = fract((p.x + s + 38.5)/14.)*14.;
  return 1. - clamp(1. - smoothstep(D - e, D + e, w) + smoothstep(13.2, 13.8, w), 0., 1.);
}
float storeSun(vec3 p){
  float t = (30. - p.z)/max(uSunDir.z, .08);
  vec3 e = p + uSunDir*t;
  float m = gap(e.x, 7., .2)*gap(e.x + 3.5, 14., .65)*gap(e.y, 6., .16)*smoothstep(5.6, 6.2, e.y)*ribShade(p);
  m *= rankShade(p, 9.)*rankShade(p, 16.)*mix(1., rankShade(p, 23.), step(2.5, uRanks));
  return m*wheelShade(p);
}
float cardSun(vec3 p){
  float t = (20. - p.z)/max(uSunDir.z, .08);
  vec3 e = p + uSunDir*t;
  float gy = mod(e.y - 8., 9.);
  float drop = 4.*uSunDir.y/max(uSunDir.z, .08);
  float win = gap(e.x, 5., .28)*smoothstep(max(1.3, drop), max(1.3, drop) + .3, gy)*(1. - smoothstep(7.5, 7.8, gy))*step(8., e.y);
  win = mix(win, gap(e.x, 5., .2), smoothstep(55., 57., e.y));
  // the hung chains between the windows and this place: ribbons of cards three metres broad, a metre apart, and
  // the sun through their holes; the holes are dealt by a hash and step on with the step of the very chain that
  // hangs there (its own dealt period and phase; a backed chain's dots go back with it)
  float h = 31. - p.y;
  float xs = p.x + h*uSunDir.x/max(uSunDir.y, .1), zs = p.z + h*uSunDir.z/max(uSunDir.y, .1);
  float curtain = floor((xs - 560.)/40.), o = (xs - 560. - curtain*40. - 20.)/4. + uAbreast*.5, slot = floor(o);
  float zone = step(0., curtain)*step(curtain, 3.5)*step(0., slot)*step(slot, uAbreast - .5)*step(0., h)*step(abs(zs), 15.);
  float onCard = step(.125, fract(o))*step(fract(o), .875);
  vec3 ch = uDots[int(clamp(curtain*6. + slot, 0., 23.))];
  float stepN = floor(chainStep(uTime*uTempo, ch.x, ch.y, ch.z).y + .5);
  float rib = curtain*6. + slot;
  vec2 cell = vec2(floor(xs/.5), floor(zs/.5) + stepN);
  vec2 cf = vec2(fract(xs/.5), fract(zs/.5)) - .5;
  float hole = step(.45, hash21(cell + rib*17.))*(1. - smoothstep(.2, .3, length(cf)));
  return win*mix(1., mix(1., .16 + .84*hole, onCard), zone);
}
vec3 loomSun(vec3 p){
  // the south wall: glass from its plinth to y 72 between oak posts sixteen metres apart, barred every eight
  float t2 = (40. - p.z)/max(uSunDir.z, .08);
  vec3 e2 = p + uSunDir*t2;
  float south = step(742., e2.x)*step(e2.x, ${a(t.loomX1-1.2)})*smoothstep(6., 6.4, e2.y)*(1. - smoothstep(71.6, 72., e2.y))
    *gap(e2.x - 736., 16., .55)*gap(e2.x - 740., 8., .22)*gap(e2.y - 6., 11., .2);
  // the roof's ridge strip of glass, sixteen metres broad: its bars every eight metres, a roof beam every sixteen
  float t3 = (${a(t.loomHigh)} - p.y)/max(uSunDir.y, .1);
  vec3 e3 = p + uSunDir*t3;
  float ridge = step(742., e3.x)*step(e3.x, ${a(t.loomX1-1.2)})*step(abs(e3.z), 8.)*gap(e3.x, 8., .25)*gap(e3.z, 8., .25)*gap(e3.x - 736., 16., .5);
  // THE END WALL IS OAK: its one opening is the window behind the loom's cloth, so the only sun from the east is what
  // has passed the silk. It is soft (silk scatters it): it lies in the cloth's colours on the polished floor, the
  // ground's with the figures' colour coming and going, and is a faint warmth on whatever stands higher.
  // (the same for the two outer lengths that hang before their own windows beside the loom)
  vec3 q = p + uSunDir*((${a(t.loomX)} - p.x)/max(uSunDir.x, .2));
  float qz = abs(q.z);
  float inLoom = step(qz, ${a(t.warpHalf)})*step(${a(t.rollY+1.2)}, q.y)*step(q.y, ${a(t.fellY)});
  float inOuter = step(${a(t.outerZ[0])}, qz)*step(qz, ${a(t.outerZ[1])})*step(${a(t.outerY[0])}, q.y)*step(q.y, ${a(t.outerY[1])});
  float inCloth = max(inLoom, inOuter)*step(p.x, ${a(t.loomX-.6)});
  vec3 through = clothLight(q.zy)*mix(1., .2, smoothstep(0., 3., p.y));
  return vec3(min(south + ridge, 1.)) + inCloth*through;
}
// the two glazed links beside the Mill (30 m broad, 44 m high): the sun through a link's south wall and roof of
// glass, and through the east link's open end from the Cards' own windows; none inside the drum
float linkSun(vec3 p){
  float x0 = p.x < 420. ? 300. : 494.6, x1 = p.x < 420. ? 345.4 : 540.;
  float t = (15. - p.z)/max(uSunDir.z, .08);
  vec3 e = p + uSunDir*t;
  float m = step(x0, e.x)*step(e.x, x1)*step(6.2, e.y)*step(e.y, 44.)*gap(e.x - x0 - 3.75, 7.5, .38)*gap(e.y - 6., 9.5, .2);
  float t2 = (44. - p.y)/max(uSunDir.y, .1);
  vec3 r = p + uSunDir*t2;
  m += step(x0, r.x)*step(r.x, x1)*step(abs(r.z), 15.)*gap(r.x - x0 - 3.75, 7.5, .38)*gap(r.z, 7.5, .2);
  vec3 q = p + uSunDir*((540. - p.x)/max(uSunDir.x, .2));
  m += step(420., p.x)*step(abs(q.z), 15.)*step(q.y, 44.)*cardSun(vec3(540.5, q.y, q.z));
  return clamp(m, 0., 1.)*(1. - inDrum(p));
}
vec3 sunAt(vec3 p){
  if (p.x < 300.) return vec3(storeSun(p));
  if (p.x < 540.) return vec3(linkSun(p));
  if (p.x < 740.) return vec3(cardSun(p));
  return loomSun(p);
}
`,ae=`
// THE FILL: the sky's light from the glass overhead (the more of it the higher a thing stands), and the floor's warm
// bounce (the stronger the nearer the floor, on upright and downward faces); an upright face's last metre and a half
// over the floor stands in its own foot's shade
vec3 fillAt(vec3 N, vec3 p){
  // (the Store and its crossing stand under a whole vault of glass: the sky's fill is the fuller there, and its floor
  // lies in the sun from wall to wall, so what the floor sends back is the stronger: most on the upright faces of
  // whatever stands low over it, one law for the whole Store as far as its vault goes, to the crossing's east wall;
  // it dies away inside the west link's first thirty metres)
  float store = 1. - smoothstep(300., 330., p.x);
  // THE NAVE IS DEEPER TOWARD THE CROSSING: its west end is a whole wall of glass under the vault's own line, and the
  // sky's fill is fullest there; it falls along the nave to the crossing, whose east end is the Mill's dark arch
  float west = 1. - smoothstep(${a(t.storeX0)}, ${a(t.storeX1)}, p.x);
  float k = mix(1., .72, millDark(p))*(1. + store*(.2 + .45*west));
  float upright = 1. - abs(N.y), low = 1. - smoothstep(0., 20., p.y);
  vec3 sky = uSkyCol*(.5 + .5*N.y)*(.86 + .3*smoothstep(0., 40., p.y));
  // AMONG THE RANKS the sky's light reaches a face only after glancing off the brass about it: it is the warmer and
  // the deeper there (from the innermost rank outward to the outermost that stands on this visit, under the beds)
  float az = abs(p.z), zOut = uRanks > 2.5 ? ${a(t.rankZ[2]+1.5)} : ${a(t.rankZ[1]+1.5)};
  float among = smoothstep(${a(t.rankZ[0]-3.5)}, ${a(t.rankZ[0]-1)}, az)*(1. - smoothstep(zOut, zOut + 2.5, az))*(1. - smoothstep(26., 30., p.y))*(1. - smoothstep(${a(t.storeX1-5)}, ${a(t.storeX1-1)}, p.x));
  sky *= mix(vec3(1.), vec3(.95, .7, .42), .7*among);
  // (the Cards' floor lies in the south windows' sun from end to end: what it sends up to a face turned downward,
  // a loop's underside or a gallery's, is the stronger there)
  // and the hall's long south wall of windows lights such a face from the side with the sky's own colour
  float cards = smoothstep(536., 544., p.x)*(1. - smoothstep(736., 744., p.x));
  // (the two links are tunnels of glass too, their floors in the sun from wall to wall: what the floor sends back
  // onto the upright faces low over it, the plinths under the glass and the legs that stand there, is as the Store's)
  float links = (1. - smoothstep(15.5, 17., abs(p.z)))*(smoothstep(${a(t.crossX1-4)}, ${a(t.crossX1)}, p.x)*(1. - smoothstep(${a(t.archW)}, ${a(t.archW+4)}, p.x))
    + smoothstep(${a(t.archE-4)}, ${a(t.archE)}, p.x)*(1. - smoothstep(${a(t.cardX0)}, ${a(t.cardX0+4)}, p.x)));
  vec3 bounce = uFloorCol*((.5 - .5*N.y)*.8*(1. + 3.5*store + 1.2*cards) + .5*low*upright*(1. + 13.5*max(store, links)))
    + uSkyCol*(.5 - .5*N.y)*.3*cards;
  // (what the Store's floor sends up comes from the floor about a thing's own foot: where that floor lies in a
  // rib's band of shade the bounce is the less, so a column in a band stands in soft shade beside its lit neighbours)
  bounce *= mix(1., mix(.35, 1., ribShade(vec3(p.x, 0., p.z))), store);
  float foot = mix(1., mix(.62, 1., smoothstep(0., 1.6, p.y)), upright);
  // (the Loom hall's south wall is glass from its plinth to its eaves: it lights the hall's downward faces, the
  // roof's boards and the galleries' undersides, from the side with the sky's own colour)
  bounce += uSkyCol*(.5 - .5*N.y)*.3*smoothstep(736., 744., p.x);
  return (sky + bounce)*k*.82*foot;
}
// THE LANTERN'S DAYLIGHT IS MORNING LIGHT: sunlit glass, most of it the sun's own colour and a little the sky's
vec3 lanternCol(){ return uSkyCol*.15 + uSunCol*.31; }
vec3 millLight(vec3 p, vec3 N){
  vec2 d = p.xz - MILL_C; float r = length(d);
  vec3 toL = vec3(MILL_C.x, ${a(t.lanternY)}, MILL_C.y) - p; float dl = max(length(toL), 1.); toL /= dl;
  float shaft = exp(-r*r/(21.*21.));
  float lant = (710.*max(toL.y, 0.)/(dl*dl))*(.25 + .75*max(dot(N, toL), 0.))*7.2 + shaft*(.3 + .7*max(dot(N, toL), 0.))*1.9;
  vec3 toC = vec3(d/max(r, 1.)*(75. - r), ${a(t.clerY)} - p.y); float dc = max(length(toC), 1.); toC /= dc;
  float cler = (.2 + .8*max(dot(N, toC), 0.))*clamp(34./dc, .3, 1.6)*1.75;
  // what the lit floor under the lantern sends back up to the dome and the beds' undersides
  float pool = max(-N.y, 0.)*(.2 + .6*exp(-r*r/(45.*45.)))*.6;
  // the lantern's daylight is the one warm light of the room (lanternCol); the clerestory's is the sky's own blue
  // the brass's own bounce: among the fans the air is a little warm with what thirty lit columns send to one another
  float among = exp(-(r - 27.)*(r - 27.)/(14.*14.))*(1. - smoothstep(30., 44., p.y))*(1. - abs(N.y)*.6);
  return (lanternCol()*(lant + pool) + uSkyCol*cler + vec3(.95, .66, .28)*among*.3)*inDrum(p);
}
vec3 envAt(vec3 R, vec3 p){
  vec3 roof = uSkyCol*mix(1.75, 1.3, smoothstep(250., 300., p.x))*(.5 + .5*gap(p.x + R.x/max(R.y, .15)*30., 7., 1.3));
  // (the Store's walls are glass to the floor's plinth: a face turned level shows the bright glass, not a dark wall)
  float glassy = 1. - smoothstep(250., 300., p.x);
  vec3 wall = mix(uFloorCol*.85, uSkyCol*(.85 + .25*glassy), smoothstep(-.1 - .15*glassy, .3 - .25*glassy, R.y));
  vec3 lit = mix(wall, roof, smoothstep(.3, .62, R.y));
  lit = mix(lit, (uFloorCol*.5 + uSkyCol*.2)*(1. + 4.6*glassy), smoothstep(-.05, -.5, R.y));
  float r = length(p.xz - MILL_C);
  vec3 mill = mix(vec3(.07, .084, .105), vec3(.24, .18, .09), exp(-(r - 27.)*(r - 27.)/(16.*16.)));
  mill += uSkyCol*.95*smoothstep(.06, .16, R.y)*(1. - smoothstep(.34, .5, R.y));
  mill += uSkyCol*1.7*smoothstep(.8, .93, R.y)*exp(-r*r/(46.*46.));
  mill = mix(mill, uFloorCol*.2 + uSkyCol*.07, smoothstep(0., -.4, R.y));
  return mix(lit, mill, millDark(p));
}
// the gate's lamp: a standing light of the place about the gate's own middle under the loom, the same at every clock
// and from every place; it falls on the foot posts' inner faces, the roller's underside and the floor before the gate
vec3 ringLamp(vec3 p, vec3 N){
  vec3 to = vec3(${a(t.loomX)}, ${a(t.gateH/2)}, 0.) - p; float d = length(to);
  return vec3(1., .86, .62)*(max(dot(N, to/max(d, .5)), 0.)*.75 + .25)*2.6/(1. + d*d/150.)*(1. - smoothstep(34., 46., d));
}
// the sun that reaches the place last shaded (kept for a material that adds to it: the wheels' broad highlight)
vec3 gSun = vec3(0.);
vec3 lightWith(vec3 N, vec3 p, vec3 sun){
  return fillAt(N, p) + sun*max(dot(N, uSunDir), 0.) + millLight(p, N) + ringLamp(p, N);
}
vec3 lightAt(vec3 N, vec3 p){
  gSun = uSunCol*sunAt(p);
  return lightWith(N, p, gSun);
}
vec3 shadeMetal(vec3 F0, vec3 N, vec3 p, float polish){
  vec3 V = normalize(cameraPosition - p);
  vec3 R = reflect(-V, N);
  float glint = pow(clamp(dot(R, uSunDir), 0., 1.), 48.)*3.;
  float edge = pow(clamp(1. - dot(N, V), 0., 1.), 4.);
  gSun = uSunCol*sunAt(p);
  vec3 c = F0*(lightWith(N, p, gSun)*(.62 - .3*polish) + envAt(R, p)*(.38 + .5*polish) + gSun*glint*polish);
  return c + envAt(R, p)*edge*.22;
}
vec3 shadeDull(vec3 alb, vec3 N, vec3 p, float gloss){
  vec3 V = normalize(cameraPosition - p);
  vec3 R = reflect(-V, N);
  float edge = pow(clamp(1. - dot(N, V), 0., 1.), 3.);
  return alb*lightAt(N, p) + envAt(R, p)*(.07 + .42*edge)*gloss;
}
vec3 hazed(vec3 c, vec3 p){
  float d = distance(cameraPosition, p)*uFogDen;
  vec3 air = mix(uFogCol, uFogCol*.42, millDark(p)*.6);
  return mix(c, air, 1. - exp(-d*d));
}
// teeth painted along a bar: they fade to their mean tone before they are finer than the picture's grain
float toothBand(float v, float period){
  float w = fwidth(v)/period;
  return mix(step(.5, fract(v/period)), .5, smoothstep(.3, .7, w));
}
`,he=.03,He=.9,Qe=.6,qe=40,Ge=.8,re=0,Ve=1e3,Xe=.85,Se=`
float restAt(float n, float k, float seed){
  return 2.*floor(5.*hash21(vec2(n*1.37 + seed*9.17, k*2.11 + seed))) + mod(n, 2.);
}
// how high wave m of a column climbs: every fourth wave of a column stops part way up (at three tenths to nine tenths
// of the stack), the others go over the top. Which round of four is a column's short one goes by its part of the
// period (so a rib's three columns never stop short in the same round); how high, by plain arithmetic on the wave's
// count and the column's own number (on a grid of eighths). The processor counts the same waves (stopOf below).
float stopOf(float m, vec4 col, float seed, float nW){
  float q = floor(seed*8. + .5), part = floor(col.w/max(col.z, 1e-3)*15.);
  float h = fract((m*13. + q*7.)/29.);
  return mod(m + part, 4.) < .5 ? floor(nW*(.3 + .6*h) + .5) : nW + 1.;
}
// seconds since the carry last reached wheel k; reach is 1 when that wave came as high as k (a column with no
// spindle, wave period 0: reach 0, and the carry is long ago)
float carrySince(vec4 col, float seed, float nW, float k, float t, out float reach){
  float lag = k*${a(he)}, has = step(1e-3, col.z), P = max(col.z, 1e-3);
  float m = floor((t + col.w - lag)/P);
  reach = has*step(k + .5, stopOf(m, col, seed, nW));
  return has > .5 ? t - (m*P - col.w + lag) : ${a(Ve)};
}
// where wheel k stands at clock t, in scallops (a tenth of a turn each); act is 1 at the jump and dies away
float wheelTurn(vec4 col, float seed, float nW, float k, float t, out float act){
  float Pr = col.x, rlag = k/nW*${a(Qe)}, lag = k*${a(he)};
  float tr = t + col.y - rlag;
  float n = floor(tr/Pr), s = tr - n*Pr, Sn = t - s;
  float has = step(1e-3, col.z), P = max(col.z, 1e-3);
  float mPrev = ceil((Sn - Pr + col.w - lag)/P);
  float aPrev = mPrev*P - col.w + lag;
  float cPrev = has*step(aPrev, Sn - 1e-4)*step(k + .5, stopOf(mPrev, col, seed, nW));
  float a0 = restAt(n - 1., k, seed) + cPrev;
  float delta = mod(restAt(n, k, seed) - a0, 10.);
  float e = smoothstep(0., 1., clamp(s/${a(He)}, 0., 1.));
  float reach;
  float since = carrySince(col, seed, nW, k, t, reach);
  float cNow = reach*step(Sn, t - since);
  float jump = 1. - exp(-since*${a(qe)})*cos(since*55.);
  act = cNow*exp(-since*7.);
  return a0 + delta*e + cNow*jump;
}
`;function vt(e,s,p,b){if(!(s[2]>re))return 0;const m=Math.floor(Math.fround(p)*8+.5),y=Math.floor(Math.fround(s[3])/Math.fround(s[2])*15),i=(e*13+m*7)/29,M=i-Math.floor(i);return((e+y)%4+4)%4<.5?Math.floor(b*(.3+.6*M)+.5):b+1}function xt(e,s){return e[2]>re?s*e[2]-e[3]:1/0}function wt(e,s,p,b){if(!(e[2]>re))return 0;const m=Math.ceil((p-s*he*.3+e[3])/e[2]),y=Math.floor((b+e[3])/e[2]);return Math.max(0,y-m+1)}function oe(){const e=[],s=[],p=[],b=[],m=[],i={count:0,dress:[0,0,0,0]},M=(h,d,w,$,g)=>{e.push(h[0],h[1],h[2]),s.push(d[0],d[1],d[2]),p.push(w[0],w[1],w[2]),b.push($[0],$[1]),m.push(g[0],g[1],g[2],g[3])};return i.tri=(h,d,w,$,g,o=i.dress,f=null)=>{let u=f;o=o||i.dress;const R=d[0]-h[0],L=d[1]-h[1],B=d[2]-h[2],P=w[0]-h[0],S=w[1]-h[1],A=w[2]-h[2],x=L*A-B*S,l=B*P-R*A,c=R*S-L*P,v=Math.hypot(x,l,c)||1,C=Array.isArray(o[0])?o:[o,o,o];if(!u)u=[x/v,l/v,c/v],u=[u,u,u];else if(x*u[0][0]+l*u[0][1]+c*u[0][2]<0){M(h,u[0],$,g,C[0]),M(w,u[2],$,g,C[2]),M(d,u[1],$,g,C[1]),i.count++;return}M(h,u[0],$,g,C[0]),M(d,u[1],$,g,C[1]),M(w,u[2],$,g,C[2]),i.count++},i.quad=(h,d,w,$,g,o,f=i.dress,u=null)=>{const R=f&&Array.isArray(f[0]);i.tri(h,d,w,g,o,R?[f[0],f[1],f[2]]:f,u&&[u[0],u[1],u[2]]),i.tri(h,w,$,g,o,R?[f[0],f[2],f[3]]:f,u&&[u[0],u[2],u[3]])},i.box=(h,d,w,$,g,o,f,u,R={})=>{const L=R.ry||0,B=Math.cos(L),P=Math.sin(L),S=R.paint||i.dress,A=R.skip||"",x=(D,E,T)=>[h+D*B+T*P,d+E,w-D*P+T*B],l=$/2,c=g/2,v=o/2,C=(D,E,T,O)=>{if(!R.arris||D[1]===E[1]&&E[1]===T[1]&&T[1]===O[1])return i.quad(x(...D),x(...E),x(...T),x(...O),f,u,S);const W=Math.hypot(E[0]-D[0],E[2]-D[2]);i.quad(x(...D),x(...E),x(...T),x(...O),f,u,[[12,0,W,-1],[12,0,W,1],[12,0,W,1],[12,0,W,-1]])};A.includes("+x")||C([l,-c,v],[l,-c,-v],[l,c,-v],[l,c,v]),A.includes("-x")||C([-l,-c,-v],[-l,-c,v],[-l,c,v],[-l,c,-v]),A.includes("+y")||C([-l,c,v],[l,c,v],[l,c,-v],[-l,c,-v]),A.includes("-y")||C([-l,-c,-v],[l,-c,-v],[l,-c,v],[-l,-c,v]),A.includes("+z")||C([-l,-c,v],[l,-c,v],[l,c,v],[-l,c,v]),A.includes("-z")||C([l,-c,-v],[-l,-c,-v],[-l,c,-v],[l,c,-v])},i.rod=(h,d,w,$,g,o,f={})=>{const u=f.r2??w,R=f.paint||i.dress,L=new n.Vector3(d[0]-h[0],d[1]-h[1],d[2]-h[2]),B=L.length();L.divideScalar(B||1);const P=new n.Vector3(0,1,0);Math.abs(L.y)>.9&&P.set(1,0,0);const S=new n.Vector3().crossVectors(L,P).normalize(),A=new n.Vector3().crossVectors(L,S).normalize(),x=(l,c,v)=>{const C=v/$*Math.PI*2+(f.twist||0),D=Math.cos(C),E=Math.sin(C);return[[l[0]+(S.x*D+A.x*E)*c,l[1]+(S.y*D+A.y*E)*c,l[2]+(S.z*D+A.z*E)*c],[S.x*D+A.x*E,S.y*D+A.y*E,S.z*D+A.z*E]]};for(let l=0;l<$;l++){const[c,v]=x(h,w,l),[C,D]=x(h,w,l+1),[E]=x(d,u,l),[T]=x(d,u,l+1),O=f.flat?null:[v,D,D,v];if(f.arris&&f.flat){const W=Math.hypot(C[0]-c[0],C[1]-c[1],C[2]-c[2]);i.quad(c,C,T,E,g,o,[[12,0,W,-1],[12,0,W,1],[12,0,W,1],[12,0,W,-1]],O)}else i.quad(c,C,T,E,g,o,R,O);f.capA&&i.tri(h,C,c,g,o,R),f.capB&&i.tri(d,E,T,g,o,R)}},i.build=()=>{const h=new n.BufferGeometry;return h.setAttribute("position",new n.BufferAttribute(new Float32Array(e),3)),h.setAttribute("normal",new n.BufferAttribute(new Float32Array(s),3)),h.setAttribute("color",new n.BufferAttribute(new Float32Array(p),3)),h.setAttribute("aSurf",new n.BufferAttribute(new Float32Array(b),2)),h.setAttribute("aPaint",new n.BufferAttribute(new Float32Array(m),4)),h.computeBoundingSphere(),h.computeBoundingBox(),h},i}const Q=(e,s=1)=>{const p=new n.Color(e);return[p.r*s,p.g*s,p.b*s]};function Ye(e,s,p){const b=[];for(let m=0;m<10;m++){const y=m*36;p===3?b.push([y-7,e,m],[y+7,e,m],[y+18,e-s,m]):b.push([y,e,m],[y+18,e-s,m])}return b.map(([m,y,i])=>({x:Math.cos(m*Math.PI/180)*y,z:Math.sin(m*Math.PI/180)*y,r:y,i,crest:y>=e-1e-6}))}function fe(e){const s=[],p=[],b=[],m=[],y=[],i=(o,f,u,R,L)=>{s.push(o[0],o[1],o[2]),p.push(f[0],f[1],f[2]),b.push(u),m.push(R),y.push(L)},M=(o,f,u,R,L,B,P)=>{let S=P;if(!S){const A=f[0]-o[0],x=f[1]-o[1],l=f[2]-o[2],c=u[0]-o[0],v=u[1]-o[1],C=u[2]-o[2],D=x*C-l*v,E=l*c-A*C,T=A*v-x*c,O=Math.hypot(D,E,T)||1;S=[D/O,E/O,T/O],S=[S,S,S]}i(o,S[0],R,L[0],B),i(f,S[1],R,L[1],B),i(u,S[2],R,L[2],B)},h=Ye(e.R,e.depth,e.segs),d=h.length;for(let o=0;o<e.wheels;o++){const f=e.y0+o*e.pitch,u=f+e.thick;for(let R=0;R<d;R++){const L=h[R],B=h[(R+1)%d],P=e.segs===3?L.i===0&&L.crest&&B.crest?1:0:L.i===0&&L.crest?1:0,S=L.crest?1:0,A=B.crest?1:0,x=[L.x,f,L.z],l=[B.x,f,B.z],c=[B.x,u,B.z],v=[L.x,u,L.z];M(x,c,l,o,[S,A,A],P),M(x,v,c,o,[S,S,A],P)}if(e.capped)for(let R=0;R<10;R++){const L=h[R*3%d],B=h[(R*3+1)%d],P=h[(R*3+2)%d],S=h[(R*3-1+d)%d];for(const[A,x]of[[u,1],[f,0]]){const l=[S.x,A,S.z],c=[L.x,A,L.z],v=[B.x,A,B.z],C=[P.x,A,P.z],D=[0,x?1:-1,0],E=[D,D,D];x?(M(l,v,c,o,[0,1,1],0,E),M(l,C,v,o,[0,0,1],0,E)):(M(l,c,v,o,[0,1,1],0,E),M(l,v,C,o,[0,1,0],0,E))}}}const w=(o,f,u,R,L,B,P,S)=>{for(let A=0;A<L;A++){const x=A/L*Math.PI*2,l=(A+1)/L*Math.PI*2,c=Math.cos(x),v=Math.sin(x),C=Math.cos(l),D=Math.sin(l),E=[c*u,o,v*u],T=[C*u,o,D*u],O=[C*R,f,D*R],W=[c*R,f,v*R],U=[c,0,v],te=[C,0,D];M(E,O,T,-1,[.5,.5,.5],B,[U,te,te]),M(E,W,O,-1,[.5,.5,.5],B,[U,U,te]),P&&M([0,f,0],O,W,-1,[.5,.5,.5],B,[[0,1,0],[0,1,0],[0,1,0]]),S&&M([0,o,0],E,T,-1,[.5,.5,.5],B,[[0,-1,0],[0,-1,0],[0,-1,0]])}},$=e.y0+e.wheels*e.pitch;e.bare?w(.02,e.thick-.02,e.R-e.depth-.012,e.R-e.depth-.012,10,2,!0,!0):(w(e.foot*.5,$,e.R-e.depth-.012,e.R-e.depth-.012,12,2,!1,!1),w(0,e.foot*.55,e.R*1.3,e.R*1.18,12,3,!0,!1),w(e.foot*.55,e.y0-.06,e.R*.86,e.R*.8,12,3,!0,!1),w($-.1,$+(e.cap??1.2),e.R*.82,e.R*.6,12,3,!0,!1),e.topRod&&w($+(e.cap??1.2),$+(e.cap??1.2)+e.topRod,.16,.16,6,2,!1,!1));const g=new n.BufferGeometry;return g.setAttribute("position",new n.BufferAttribute(new Float32Array(s),3)),g.setAttribute("normal",new n.BufferAttribute(new Float32Array(p),3)),g.setAttribute("aBand",new n.BufferAttribute(new Float32Array(b),1)),g.setAttribute("aRim",new n.BufferAttribute(new Float32Array(m),1)),g.setAttribute("aFace",new n.BufferAttribute(new Float32Array(y),1)),g.userData={wheels:e.wheels,R:e.R,top:$+(e.cap??1.2)+(e.topRod||0),triangles:s.length/9},g}const ke=`
float rackSlide(float seed, float t){
  float P = 2.6 + 1.6*hash11(seed*3.1 + .7), amp = 3. + 2.*hash11(seed*1.3 + 2.);
  float s = mod(t + hash11(seed*7.7)*P, P);
  float x = sin(3.14159265*clamp(s/1.7, 0., 1.));
  return amp*x*x;
}
`,de=.32,ze=[1.32,.82],je=1.28,Ue=`
float lineAt(float v, float halfW){
  float w = fwidth(v);
  return (1. - smoothstep(halfW - w, halfW + w, abs(fract(v) - .5)))*clamp(halfW*2./max(w, 1e-4), 0., 1.);
}
vec3 grainAt(vec4 q, vec3 p, vec3 N){
  vec2 f = abs(N.y) > .7 ? p.xz : (abs(N.x) > abs(N.z) ? p.zy : p.xy);
  if (q.x > 8.5) { vec2 d = p.xz - MILL_C; f = vec2(atan(d.y, d.x + 1e-4)*length(d), p.y); }
  if (q.x < 6.5 || q.x > 8.5) {
    // plates: a dark joint, a paler chamfer beside it, a row of rivets inside every joint
    vec2 size = vec2(max(q.y, .5), max(q.z, .5)), g = f/size + .5, id = floor(g), w = fwidth(g);
    float joint = max(lineAt(g.x, .012), lineAt(g.y, .012));
    vec2 e = (abs(fract(g) - .5))*size;
    float nearEdge = min(e.x, e.y);
    vec2 rv = vec2(fract(f.x/.6) - .5, fract(f.y/.6) - .5)*.6;
    float along = e.x < e.y ? abs(rv.y) : abs(rv.x);
    float fineness = clamp(max(w.x*size.x, w.y*size.y)/.09, 0., 1.);
    float rivet = (1. - smoothstep(.05, .09, length(vec2(nearEdge - .22, along))))*(1. - fineness);
    float tone = .9 + .2*hash21(id*1.7 + 3.1);
    // (on the Mill's round wall each plate is a SUNK PANEL IN A RAISED FRAME: a rail WALL_RAIL to either hand of
    // every level joint, a stile beside every upright one (the joints stand behind a pilaster or a bay's rack by
    // turns: the stile is what shows beside each). The frame is the lighter iron; the panel's field is lighter
    // toward its head, where the light comes from; the lower rail's top edge and the stiles' edges catch the light
    // as lit arrises, and the upper rail keeps a band of shade under it. Each goes to its mean before the grain
    // is coarser than it.)
    if (q.x > 8.5) {
      float atPilaster = mod(floor(f.x/size.x + .5), 2.), stile = mix(${a(ze[0])}, ${a(ze[1])}, atPilaster);
      float wx = max(w.x*size.x, 1e-4), wy = max(w.y*size.y, 1e-4), seenX = clamp(.2/wx, 0., 1.), seenY = clamp(.2/wy, 0., 1.);
      float up = fract(g.y + .5), yIn = up*size.y, dx = e.x - stile;
      float inX = smoothstep(-wx, wx, dx), inY = smoothstep(-wy, wy, e.y - ${a(de)}), field = inX*inY;
      tone = mix(1., tone, field)*mix(${a(je)}, .74 + .5*up, field);
      // the lower rail's top edge (the light falls on it) and the shade under the upper rail
      float ledge = (1. - smoothstep(.1 - wy, .1 + wy, abs(yIn - ${a(de)})))*inX*seenY;
      float under = (1. - smoothstep(0., .9, size.y - ${a(de)} - yIn))*field*seenY;
      // a stile's edge is a lit arris, and the field beside it lies a hand in its shade
      float arris = (1. - smoothstep(.07 - wx, .07 + wx, abs(dx)))*inY*seenX;
      float beside = (1. - smoothstep(0., .35, dx))*field*seenX;
      tone *= (1. + 1.1*ledge + .8*arris)*(1. - .38*under)*(1. - .22*beside);
    }
    return vec3(tone*(1. - .5*joint)*(1. + .5*rivet)*(1. - .12*smoothstep(.5, .1, nearEdge)*(1. - fineness)));
  }
  if (q.x < 7.5) {
    // boards: lying (along the face's first axis) or upright; each its own tone, butt joints staggered, a long streak
    vec2 b = q.w > .5 ? f.yx : f;
    float wB = max(q.y, .1), row = floor(b.y/wB), jx = b.x/7. + hash11(row*1.3)*5.;
    float joint = max(lineAt(b.y/wB + .5, .03), lineAt(jx + .5, .004)*step(fwidth(b.y/wB), .5));
    float tone = .82 + .36*hash21(vec2(row, floor(jx))*1.9 + 7.);
    float fine = clamp(fwidth(b.y/wB)/.6, 0., 1.);
    float streak = .94 + .12*sin(b.x*1.7 + row*2.1 + 2.*sin(b.x*.31 + row))*(1. - fine);
    return vec3(mix(tone, 1., fine)*streak*(1. - .45*joint));
  }
  // brick: courses in running bond, each brick its own tone, pale joints
  float hC = max(q.y, .2), course = floor(f.y/hC), bx = f.x/(hC*3.) + .5*mod(course, 2.);
  float joint = max(lineAt(f.y/hC + .5, .05), lineAt(bx + .5, .017)*step(fwidth(f.y/hC), .5));
  float fine = clamp(fwidth(f.y/hC)/.6, 0., 1.);
  float tone = mix(.78 + .44*hash21(vec2(floor(bx), course)*1.3 + 2.), 1., fine);
  return vec3(tone) + vec3(.35, .32, .28)*joint;
}
`,Y=(e,s=1)=>{const p=Q(e,s);return`vec3(${p[0].toFixed(4)}, ${p[1].toFixed(4)}, ${p[2].toFixed(4)})`},ne=`
const vec3 BRASS = ${Y("#c9a04a")}; const vec3 BRASS_EDGE = ${Y("#f0d48a")}; const vec3 BRASS_DARK = ${Y("#6e5320")};
const vec3 BLUE_STEEL = ${Y("#3d5f8f")}; const vec3 STEEL = ${Y("#8e9cae")}; const vec3 IRON = ${Y("#16191f")};
const vec3 IRON_EDGE = ${Y("#5c6a7c")};
`;function Ae(e,s={}){return new n.ShaderMaterial({uniforms:{...e,uY0:{value:s.y0??2}},side:n.DoubleSide,vertexShader:`
      attribute float aBand, aRim, aFace;
      attribute vec4 aCol; attribute vec2 aMeta;
      uniform float uY0;
      varying vec3 vW, vN, vRad; varying float vRim, vFace, vAct, vTint, vEdge;
      ${V}
      ${Se}
      ${ke}
      void main(){
        vec3 p = position, n = normal; float act = 0., tint = 1., edge = 0., pin = 0.;
        if (aBand > -.5) {
          float turn = wheelTurn(aCol, aMeta.x, max(aMeta.y, 1.), aBand, uTime*uTempo, act);
          // a pinion (a single wheel at a rack; its count of wheels is given as -1) turns as its rack slides past it
          pin = step(aMeta.y, 0.);
          turn = mix(turn, rackSlide(aMeta.x, uTime*uTempo)*aCol.x, pin); act *= 1. - pin;
          // a wheel on a turning shaft (its count given as -2) turns steadily, aCol.x scallops a second
          turn = mix(turn, uTime*uTempo*aCol.x + aCol.y, step(aMeta.y, -1.5));
          float a = turn*.62831853, c = cos(a), s = sin(a);
          p.xz = vec2(c*p.x - s*p.z, s*p.x + c*p.z);
          n.xz = vec2(c*n.x - s*n.z, s*n.x + c*n.z);
          tint = .86 + .28*hash21(vec2(aBand*1.7, aMeta.x*3.3));
          edge = (position.y - uY0 - aBand*.6)*4. - 1.;
        }
        vec4 w = modelMatrix*instanceMatrix*vec4(p, 1.);
        vW = w.xyz; vN = normalize(mat3(modelMatrix)*mat3(instanceMatrix)*n);
        vRad = mat3(modelMatrix)*mat3(instanceMatrix)*vec3(position.x, 0., position.z);
        // (a pinion is seen on its face: its face is as bright as a worn rim)
        vRim = mix(aRim, max(aRim, .62), pin); vFace = aFace; vAct = act; vTint = tint; vEdge = edge;
        gl_Position = projectionMatrix*viewMatrix*w;
      }`,fragmentShader:`
      varying vec3 vW, vN, vRad; varying float vRim, vFace, vAct, vTint, vEdge;
      ${V}
      ${ae}
      ${ne}
      void main(){
        vec3 N = normalize(vN); float back = gl_FrontFacing ? 0. : 1.;
        N = mix(N, -N, back);
        vec3 col;
        if (vFace < 1.5) {
          float worn = smoothstep(.8, 1., clamp(abs(vEdge), 0., 1.));
          float wear = clamp(vRim*.7 + worn*.45, 0., 1.);
          vec3 F0 = mix(mix(BRASS_DARK, BRASS, .4), BRASS, smoothstep(0., .55, wear));
          F0 = mix(F0, BRASS_EDGE, smoothstep(.72, 1.1, wear));
          F0 = mix(F0*vTint, BLUE_STEEL*1.5, step(.5, vFace));
          col = shadeMetal(F0, N, vW, .5 + .35*wear);
          // THE STACK AS A ROUND: by the stack's own radial direction (not a scallop's), a broad soft highlight down
          // it where it turns between the sun and the eye, and a darker edge where it turns away from the eye
          vec3 Nr = normalize(vRad + vec3(1e-4, 0., 0.)), V = normalize(cameraPosition - vW);
          float facing = clamp(dot(Nr, V), 0., 1.);
          float broad = pow(clamp(dot(Nr, normalize(uSunDir + V)), 0., 1.), 5.);
          col = col*mix(.5, 1.08, smoothstep(.05, .7, facing)) + F0*gSun*broad*.55*vRim;
          // a wheel's rim stands in the shade of the wheel over it: darker toward its under edge
          col *= mix(.5, 1., smoothstep(0., .7, vRim))*mix(1., .3, back)*mix(.8, 1.12, smoothstep(-1., .6, vEdge));
          // THE WAVE'S KNOT: a wheel the carry has just thrown stands bright, its rim taking the lantern's light full
          // and its marked tooth flashing as it goes round; the glow dies in a fifth of a second (six wheels of climb).
          // THE KNOT STAYS BRASS: a thrown wheel's light is held under white (its strongest colour at KNOT_TOP and
          // the others in their measure), so it stands as bright gold; a wheel at rest is not touched.
          float act = clamp(vAct, 0., 1.);
          vec3 knot = col*(1. + 2.2*act) + mix(BRASS_EDGE, vec3(.75, .86, 1.), step(.5, vFace))*(uSkyCol*.5 + uSunCol*.14)*act*mix(1.2, 3.2, step(.5, vFace))*vRim;
          col = knot/max(1., mix(1., max(knot.r, max(knot.g, knot.b))/${a(Xe)}, smoothstep(0., .1, act)));
        } else if (vFace < 2.5) col = shadeMetal(STEEL, N, vW, .6)*.7;
        else col = shadeDull(IRON, N, vW, 1.) + IRON_EDGE*.04;
        gl_FragColor = vec4(hazed(col, vW), 1.);
      }`})}function pe(e,s,p){const b=new n.BufferGeometry;for(const d of["position","normal","aBand","aRim","aFace"])b.setAttribute(d,e.getAttribute(d));const m=p.length,y=new Float32Array(m*4),i=new Float32Array(m*2),M=new n.InstancedMesh(b,s,m),h=new n.Matrix4;return p.forEach((d,w)=>{y.set(d.col,w*4),i[w*2]=d.seed,i[w*2+1]=e.userData.wheels,M.setMatrixAt(w,h.makeTranslation(d.x,d.y||0,d.z))}),b.setAttribute("aCol",new n.InstancedBufferAttribute(y,4)),b.setAttribute("aMeta",new n.InstancedBufferAttribute(i,2)),b.userData={...e.userData},M.instanceMatrix.needsUpdate=!0,M.computeBoundingSphere(),M.computeBoundingBox(),M.userData={kind:"wheels",R:e.userData.R*1.3,top:e.userData.top,columns:p},M}const ie={knee:.64,top:.9,dyeKnee:.68,dyeTop:1.04,roof:[.72,1.02]},Ze=`
vec3 underTop(vec3 col, float knee, float top){
  float m = max(col.r, max(col.g, col.b)), over = max(m - knee, 0.);
  return col*((min(m, knee) + (top - knee)*(1. - exp(-over/(top - knee))))/max(m, 1e-4));
}
`,H=.11,Ke=.7,Je=1.6,et=6,j=.07,ue=.12,Me=1.2,Re=3.75,tt=.9,at=1.5;function ot(e,s={}){return new n.ShaderMaterial({uniforms:{...e},side:s.side??n.FrontSide,vertexShader:`
      attribute vec3 color; attribute vec2 aSurf; attribute vec4 aPaint;
      varying vec3 vW, vN, vC; varying vec2 vS; varying vec4 vQ;
      void main(){
        vec4 lp = vec4(position, 1.); vec3 ln = normal;
        #ifdef USE_INSTANCING
        lp = instanceMatrix*lp; ln = mat3(instanceMatrix)*ln;
        #endif
        vec4 w = modelMatrix*lp;
        vW = w.xyz; vN = normalize(mat3(modelMatrix)*ln); vC = color; vS = aSurf; vQ = aPaint;
        #ifdef USE_INSTANCING_COLOR
        vC *= instanceColor;
        #endif
        gl_Position = projectionMatrix*viewMatrix*w;
      }`,fragmentShader:`
      varying vec3 vW, vN, vC; varying vec2 vS; varying vec4 vQ;
      ${V}
      ${ae}
      ${ke}
      ${Ue}
      ${Ze}
      void main(){
        vec3 N = normalize(vN); N = gl_FrontFacing ? N : -N;
        vec2 d = vW.xz - MILL_C;
        vec3 alb = vC;
        float pile = step(12.5, vQ.x);
        if (pile > .5) {
          // A PILE OF CARDS (aPaint 13): the chain lies folded on itself. On the pile's upright faces every card's
          // edge is a fine course, and every FOLD_N courses a deeper line stands where the chain turns back; the
          // bundle between two folds is lighter at its head than at its foot. On its two long faces stand the two
          // rows of lace knots, a knot to a course (the laces lie 1.25 m to either hand of a card's middle). Each
          // goes to its mean before it is finer than the grain.
          float up = 1. - smoothstep(.3, .7, abs(N.y));
          float c = vW.y/max(vQ.y, .02), b = c/${a(et)}, wb = fwidth(b), fb = fract(b);
          float fold = (1. - smoothstep(.02, .1 + wb, min(fb, 1. - fb)))*clamp(.3/max(wb, 1e-4), 0., 1.);
          float bundle = mix(1., .78 + .34*fb, clamp(.5/max(wb, 1e-4), 0., 1.));
          alb *= mix(1., (1. - .3*lineAt(c, .14))*(1. - .55*fold)*bundle, up);
          float isZ = mod(vQ.w, 2.), ivoryLace = step(1.5, mod(vQ.w, 4.));
          float along = abs(mix(vW.x, vW.z, isZ) - vQ.z), wa = fwidth(along);
          float knot = (1. - smoothstep(.07, .07 + wa, abs(along - 1.25)))*(1. - smoothstep(.2, .3 + fwidth(c), abs(fract(c) - .5)))*clamp(.14/max(wa, 1e-4), 0., 1.);
          alb = mix(alb, mix(vec3(.6, .03, .05), vec3(.807, .738, .565), ivoryLace), knot*up*mix(abs(N.z), abs(N.x), isZ));
        }
        else if (vQ.x > 11.5) {
          // A PIER (aPaint 12): a sunk panel between two lit arrises. vQ.w runs from -1 to 1 across the face, vQ.z is
          // the face's breadth: the arris is ARRIS broad whatever the pier's size, and fades before the grain is coarser.
          // A BROAD PIER (a jamb of the Mill's arches: its face over PIER_BROAD) IS MOULDED: inside the arris a quirk
          // (a line of shade, QUIRK broad) and a bead (a second lit roll, BEAD broad), and its sunk panel is crossed
          // every PIER_RAIL metres by a raised rail whose top edge catches the light and which keeps a band of shade
          // under it. Inside the Mill a pier stands in the clerestory's light, which falls down it: its head is
          // brighter than its foot (PIER_FOOT to PIER_HEAD of its tone).
          float hb = max(vQ.z, .05)*.5, edge = (1. - abs(vQ.w))*hb, wE = max(fwidth(vQ.w)*hb, 1e-4), seen = clamp(${a(H)}/wE, 0., 1.);
          float arris = (1. - smoothstep(${a(H)} - wE, ${a(H)} + wE, edge))*seen;
          float broad = smoothstep(${a(Me)} - .1, ${a(Me)}, hb*2.);
          float quirk = smoothstep(${a(H)} - wE, ${a(H)} + wE, edge)*(1. - smoothstep(${a(H+j)} - wE, ${a(H+j)} + wE, edge))*seen*broad;
          float bead = smoothstep(${a(H+j)} - wE, ${a(H+j)} + wE, edge)*(1. - smoothstep(${a(H+j+ue)} - wE, ${a(H+j+ue)} + wE, edge))*seen*broad;
          float inner = mix(${a(H)}, ${a(H+j+ue)}, broad);
          float sunk = smoothstep(inner, inner + ${a(H*1.2)} + wE, edge)*clamp(hb/(4.*wE), 0., 1.);
          float ym = (fract(vW.y/${a(Re)} + .5) - .5)*${a(Re)}, wy = max(fwidth(vW.y), 1e-4), seenY = clamp(.16/wy, 0., 1.);
          float rail = (1. - smoothstep(.16 - wy, .16 + wy, abs(ym)))*broad*seenY;
          float ledge = (1. - smoothstep(.05 - wy, .05 + wy, abs(ym - .16)))*broad*seenY;
          float under = smoothstep(-.8, -.16, ym)*(1. - smoothstep(-.16 - wy, -.16 + wy, ym))*broad*seenY;
          sunk *= 1. - rail;
          alb *= (1. + 1.5*arris + 1.1*bead + 1.2*ledge*sunk)*(1. - .4*quirk)*(1. - mix(.34, .26, broad)*sunk)*(1. - .34*under*sunk)*(1. - .4*lineAt(vW.y/3.75 + .5, .012)*(1. - broad));
          alb *= mix(1., mix(${a(tt)}, ${a(at)}, smoothstep(2., 40., vW.y)), inDrum(vW));
        }
        else if (vQ.x > 5.5) {
          alb *= grainAt(vQ, vW, N);
          // THE MILL'S ROUND WALL (aPaint 9) in the clerestory's light, which falls down it: its head is brighter
          // than its foot
          if (vQ.x > 8.5) alb *= mix(${a(Ke)}, ${a(Je)}, smoothstep(2., 40., vW.y));
        }
        else if (vQ.x > .5) {
          float along = vQ.x < 1.5 ? vW.x : (vQ.x < 2.5 ? length(d) : (vQ.x < 3.5 ? atan(d.y, d.x + 1e-4)*72. : vW.y));
          // (a bar's number lies on a grid of eighths: rounded back to it here, no smear across a face reaches the slide)
          float tb = toothBand(along - rackSlide(floor(vQ.z*8. + .5)/8., uTime*uTempo)*vQ.w, max(vQ.y, .05));
          float soft = step(3.5, vQ.x)*(1. - step(4.5, vQ.x));
          alb *= mix(mix(.25, .74, soft), mix(1.3, 1.05, soft), tb);
        }
        vec3 col = vS.x > .5 ? shadeMetal(alb, N, vW, vS.y) : shadeDull(alb, N, vW, vS.y);
        // (a pile is pasteboard: its lit faces stay under white as its chain's cards do, a dyed pile under its own top)
        if (pile > .5) { float dyed = step(3.5, vQ.w), pv = max(vC.r, max(vC.g, vC.b)); col = underTop(col, mix(${a(ie.knee)}, ${a(ie.dyeKnee)}*pv, dyed), mix(${a(ie.top)}, ${a(ie.dyeTop)}*pv, dyed)); }
        gl_FragColor = vec4(hazed(col, vW), 1.);
      }`})}const le=1.1,G=36,J=48,Ne=11,st=.42,rt=1.45;function nt(e,s){return new n.ShaderMaterial({uniforms:{...e,uStuds:{value:s}},vertexShader:`
      attribute vec3 color; attribute vec2 aSurf; attribute vec4 aPaint;
      varying vec3 vW, vN, vC, vL; varying vec2 vS, vAxis; varying vec4 vQ;
      void main(){
        vec4 lp = vec4(position, 1.); vec3 ln = normal;
        #ifdef USE_INSTANCING
        lp = instanceMatrix*lp; ln = mat3(instanceMatrix)*ln;
        #endif
        vec4 w = modelMatrix*lp;
        vW = w.xyz; vN = normalize(mat3(modelMatrix)*ln); vC = color; vS = aSurf; vQ = aPaint; vL = lp.xyz;
        vAxis = (modelMatrix*vec4(0., 0., 0., 1.)).xz;
        gl_Position = projectionMatrix*viewMatrix*w;
      }`,fragmentShader:`
      varying vec3 vW, vN, vC, vL; varying vec2 vS, vAxis; varying vec4 vQ;
      uniform sampler2D uStuds;
      ${V}
      ${ae}
      ${ne}
      void main(){
        vec3 N = normalize(vN), alb = vC, V = normalize(cameraPosition - vW);
        float drum = step(9.5, vQ.x)*(1. - step(10.5, vQ.x)), stud = step(10.5, vQ.x), upright = 1. - smoothstep(.3, .7, abs(N.y))*drum;
        // the drum's own measure: metres round it and up it, and the stud's place nearest
        float ang = atan(-vL.z, vL.x), cellA = ang*${a(G/(2*Math.PI))}, i = floor(cellA + .5);
        float fx = (cellA - i)*${a(2*Math.PI*t.barrelR/G)}, row = (vL.y - ${a(t.barrelFoot+1)})/${a(le)}, k = floor(row + .5), fy = (row - k)*${a(le)};
        float grain = max(fwidth(vL.y), fwidth(cellA)*${a(2*Math.PI*t.barrelR/G)});
        float has = step(.5, texture2D(uStuds, (vec2(mod(i + ${a(G)}, ${a(G)}), vQ.y*${a(J)} + clamp(k, 0., ${a(J-1)})) + .5)/vec2(${a(G)}, ${a(3*J)})).r)*step(-.5, k);
        float shed = has*(1. - smoothstep(.1, .34, abs(fx)))*smoothstep(-.8, -.5, fy)*(1. - smoothstep(-.2, -.05, fy))*(1. - clamp(grain/.3, 0., 1.));
        // the hoops and the head rim
        float hv = (vL.y - ${a(t.barrelFoot+1-le/2)})/${a(Ne)}, hd = (fract(hv + .5) - .5)*${a(Ne)}, hw = fwidth(vL.y);
        float hoop = (1. - smoothstep(.3 - hw, .3 + hw, abs(hd)))*clamp(.6/max(hw, 1e-4), 0., 1.);
        float rd = vL.y - (vQ.z - .3), rim = (1. - smoothstep(.3 - hw, .3 + hw, abs(rd)))*clamp(.6/max(hw, 1e-4), 0., 1.);
        float band = max(hoop, rim)*drum*upright, bd = mix(hd/.3, rd/.3, step(hoop, rim));
        float under = max((1. - smoothstep(.0, .28, abs(hd + .5)))*clamp(.4/max(hw, 1e-4), 0., 1.), (1. - smoothstep(.0, .28, abs(rd + .5)))*clamp(.4/max(hw, 1e-4), 0., 1.))*(1. - band);
        alb = mix(alb, STEEL*(.7 + .35*bd), band);
        alb *= 1. - drum*upright*(.5*shed + .5*under);
        vec3 col = vS.x > .5 ? shadeMetal(alb, N, vW, vS.y) : shadeDull(alb, N, vW, vS.y);
        // the flanks: lit toward the sun's side, shaded on the lee
        vec2 S = normalize(uSunDir.xz), radial = normalize(vW.xz - vAxis + vec2(1e-4, 0.));
        float flank = mix(${a(st)}, ${a(rt)}, smoothstep(-.7, .7, dot(radial, S)));
        col *= mix(1., flank, max(drum*upright, stud));
        // a stud's own light: its upper faces lit, its under faces in its own shade
        col *= mix(1., mix(.42, 1.7, smoothstep(-.35, .35, N.y)), stud);
        // the steel's long highlight on the lit flank and the pale edge at either limb
        vec2 H = normalize(S + V.xz/max(length(V.xz), 1e-3) + vec2(1e-4, 0.));
        float streak = pow(clamp(dot(radial, H), 0., 1.), 40.), limb = pow(clamp(1. - dot(N, V), 0., 1.), 3.);
        col += drum*upright*(uSkyCol*.55 + uSunCol*.08)*inDrum(vW)*(streak*.5 + limb*.28)*(1. - .6*band);
        gl_FragColor = vec4(hazed(col, vW), 1.);
      }`})}const ce={iron:[Q("#16191f",2.4),[0,1]],ironLit:[Q("#2c343f",1.5),[0,1]],steel:[Q("#8e9cae"),[1,.6]],blueSteel:[Q("#3d5f8f",1.4),[1,.7]],brass:[Q("#c9a04a"),[1,.6]],brassEdge:[Q("#f0d48a"),[1,.8]],timber:[Q("#b98a55"),[0,.25]],oak:[Q("#4a3524"),[0,.5]],ivory:[Q("#e9dfc6"),[0,.15]],crimson:[Q("#b3202e"),[0,.2]]};function Ee(e=!0){const s=oe(),p=[.56,.61,.68],b=[.79,.63,.29];s.box(.33,0,0,.54,.26,.09,p,[0,0],{skip:"-x"}),e&&s.rod([.63,-.15,0],[.63,.15,0],.075,6,b,[1,0],{capB:!0});const m=s.build();return m.setAttribute("aPart",m.getAttribute("aSurf")),m}const it=20*Math.PI/180;function lt(e){return new n.ShaderMaterial({uniforms:{...e},vertexShader:`
      attribute vec2 aPart; attribute vec4 aCol; attribute vec3 aMeta;
      varying vec3 vW, vN; varying float vFlick, vBrass;
      ${V}
      ${Se}
      void main(){
        float reach;
        float since = carrySince(aCol, aMeta.x, aMeta.y, aMeta.z, uTime*uTempo + .02, reach);
        float flick = reach*smoothstep(0., .035, since)*(1. - smoothstep(.06, .12, since));
        float a = ${a(it)}*(1. - flick), c = cos(a), s = sin(a);
        vec3 p = position, n = normal;
        p.xz = vec2(c*p.x - s*p.z, s*p.x + c*p.z);
        n.xz = vec2(c*n.x - s*n.z, s*n.x + c*n.z);
        vec4 w = modelMatrix*instanceMatrix*vec4(p, 1.);
        vW = w.xyz; vN = normalize(mat3(modelMatrix)*mat3(instanceMatrix)*n);
        vFlick = flick + reach*exp(-max(since, 0.)*9.)*.6; vBrass = aPart.x;
        gl_Position = projectionMatrix*viewMatrix*w;
      }`,fragmentShader:`
      varying vec3 vW, vN; varying float vFlick, vBrass;
      ${V}
      ${ae}
      ${ne}
      void main(){
        vec3 N = normalize(vN);
        vec3 F0 = mix(STEEL*1.2, BRASS_EDGE, step(.5, vBrass));
        vec3 col = shadeMetal(F0, N, vW, .9);
        // the blade turns its bright face to the lantern as it flicks: a glint of the place's own light
        col += F0*(uSkyCol*.7 + uSunCol*.2)*clamp(vFlick, 0., 1.6)*6.;
        gl_FragColor = vec4(hazed(col, vW), 1.);
      }`})}function $e(e,s,p){const b=new n.BufferGeometry;for(const o of["position","normal","aPart"])b.setAttribute(o,e.getAttribute(o));const m=p.length,y=new Float32Array(m*4),i=new Float32Array(m*3),M=new n.InstancedMesh(b,s,m),h=new n.Matrix4,d=new n.Quaternion,w=new n.Vector3(0,1,0),$=new n.Vector3(1,1,1),g=new n.Vector3;return p.forEach((o,f)=>{y.set(o.col,f*4),i[f*3]=o.seed,i[f*3+1]=o.nW,i[f*3+2]=o.k,M.setMatrixAt(f,h.compose(g.set(o.x,o.y,o.z),d.setFromAxisAngle(w,o.yaw),$))}),b.setAttribute("aCol",new n.InstancedBufferAttribute(y,4)),b.setAttribute("aMeta",new n.InstancedBufferAttribute(i,3)),M.instanceMatrix.needsUpdate=!0,M.computeBoundingSphere(),M.computeBoundingBox(),M.userData={kind:"instanced",reach:.25},M}const ee=3,ct=1.2;function ht(e,s,p){const b=(e+s)/ee,m=Math.floor(b),y=(b-m)*ee,i=Math.min(1,y/ct);return p*(Math.PI/6)*(m+i*i*(3-2*i))}function ft(){const e=oe(),s=ce.steel;return e.box(.5,0,0,1,.34,.16,s[0],s[1],{skip:"-x+x"}),e.build()}function dt(e){return new n.ShaderMaterial({uniforms:{...e},vertexShader:`
      attribute vec4 aLev;
      varying vec3 vW, vN; varying float vX;
      ${V}
      void main(){
        // aLev: the arm's length, its barrel's phase and its own lag, the sense of its rocking, its tip block's size
        float s = mod(uTime*uTempo + aLev.y, ${a(ee)});
        float rock = sin(3.14159265*clamp(s/.6, 0., 1.));
        float a = .1047*rock*rock*aLev.z, c = cos(a), sn = sin(a);
        vec3 p = position, n = normal;
        p.x *= aLev.x; p.y *= 1. + aLev.w*smoothstep(.8, 1., position.x);
        p.xy = vec2(c*p.x - sn*p.y, sn*p.x + c*p.y);
        n.xy = vec2(c*n.x - sn*n.y, sn*n.x + c*n.y);
        vec4 w = modelMatrix*instanceMatrix*vec4(p, 1.);
        vW = w.xyz; vN = normalize(mat3(modelMatrix)*mat3(instanceMatrix)*n); vX = position.x*aLev.x;
        gl_Position = projectionMatrix*viewMatrix*w;
      }`,fragmentShader:`
      varying vec3 vW, vN; varying float vX;
      ${V}
      ${ae}
      ${ne}
      void main(){
        vec3 N = normalize(vN);
        vec3 col = shadeMetal(STEEL*1.1, N, vW, .8);
        gl_FragColor = vec4(hazed(col, vW), 1.);
      }`})}function pt(e,s,p){const b=new n.BufferGeometry;for(const o of["position","normal"])b.setAttribute(o,e.getAttribute(o));const m=p.length,y=new Float32Array(m*4),i=new n.InstancedMesh(b,s,m),M=new n.Matrix4,h=new n.Quaternion,d=new n.Vector3(0,1,0),w=new n.Vector3(1,1,1),$=new n.Vector3;let g=0;return p.forEach((o,f)=>{y.set([o.len,o.phase,o.sense,1.2],f*4),g=Math.max(g,o.len),i.setMatrixAt(f,M.compose($.set(o.x,o.y,o.z),h.setFromAxisAngle(d,o.yaw),w))}),b.setAttribute("aLev",new n.InstancedBufferAttribute(y,4)),i.instanceMatrix.needsUpdate=!0,i.boundingSphere=new n.Sphere(new n.Vector3(t.cx,22,t.cz),40),i.userData={kind:"levers",levers:p,reach:g*.11},i}function ut(){return{ribs:t.ribBearings.map((s,p)=>{const b=s*Math.PI/180,m=Math.cos(b),y=Math.sin(b),i=s<180,M=t.ribR.map((g,o)=>({x:t.cx+m*g,z:t.cz+y*g,r:g,c:o,rib:p,south:i,spindle:[t.cx+m*(g+t.spindleOff),t.cz+y*(g+t.spindleOff)]})),h=i?2:0,d=[t.cx+m*t.postR,t.cz+y*t.postR],w=[t.cx-d[0],t.cz+t.barrelZ[h]-d[1]],$=Math.hypot(w[0],w[1]);return{rib:p,deg:s,b,dx:m,dz:y,south:i,columns:M,post:d,barrel:h,armDir:[w[0]/$,w[1]/$],armLen:$-t.barrelR-.3}})}}function mt(e,s){const p=e.range(3,3.7),b=[];for(let m=0;m<30;m++){const y=e.range(2.5,4),i=e.range(0,y),M=s?.5:e(),h=e.range(1,90),d=Math.floor(m%15/3),w=m%3,$=(5*w+(s?d:2*d))%15,g=p*Ge;b.push({col:[y,i,g,($+.05+.9*M)/15*g],seed:h})}return b}async function gt(e,s={}){const p=s.shared||_e(),b=s.rng||e.rng.fork("mill"),m=s.rare??!1,y=new n.Group,i=ut(),M=mt(b,m),h=b.range(0,ee),d=t.millWheels,w=t.millFoot,$={wheels:d,R:t.millR,depth:.25,pitch:t.millBand,thick:.5,foot:w,y0:w,cap:2,topRod:2},g=fe({...$,segs:3,capped:(s.detail??1)>=1}),o=fe({...$,segs:2,capped:!1}),f=s.wheelMaterial||Ae(p,{y0:w}),u=[];i.ribs.forEach(r=>r.columns.forEach(k=>{const z=M[r.rib*3+k.c];u.push({...k,col:z.col,seed:z.seed})}));const R=u.filter(r=>r.south),L=u.filter(r=>!r.south),B=pe(g,f,R),P=pe(o,f,L);y.add(B,P),await e.yield();const S=oe(),A=ce.steel,x=ce.iron,l=[],c=[];for(const r of u){const[k,z]=r.spindle;S.rod([k,.6,z],[k,w+d*t.millBand+1.2,z],.15,8,A[0],A[1],{capB:!0}),S.rod([k,0,z],[k,.6,z],t.footSpindle,8,x[0],x[1],{capB:!0,r2:.3});const N=Math.atan2(-(r.z-z),r.x-k);for(let F=0;F<d;F++)(r.south?l:c).push({x:k,y:w+F*t.millBand+.25,z,yaw:N,col:r.col,seed:r.seed,nW:d,k:F})}const v=lt(p);y.add($e(Ee(!0),v,l),$e(Ee(!1),v,c)),await e.yield();const C=s.plainMaterial||ot(p),D=[],E=oe(),T=ce.brass;{const r=[0,-.2,-.2],k=[0,-.2,.2],z=[0,.2,.2],N=[0,.2,-.2],F=[.36,0,0],I=[11,0,0,0];E.tri(r,F,k,T[0],T[1],I),E.tri(k,F,z,T[0],T[1],I),E.tri(z,F,N,T[0],T[1],I),E.tri(N,F,r,T[0],T[1],I)}const O=new Uint8Array(G*3*J),W=new n.DataTexture(O,G,3*J,n.RedFormat,n.UnsignedByteType);W.magFilter=W.minFilter=n.NearestFilter,W.generateMipmaps=!1;const U=nt(p,W),te=E.build(),Le=new n.Matrix4,Ce=new n.Quaternion,De=new n.Vector3(0,1,0),Be=new n.Vector3(1,1,1),Te=new n.Vector3;for(let r=0;r<3;r++){const k=t.barrelTop[r],z=t.barrelR,N=new n.Group;N.position.set(t.cx,0,t.cz+t.barrelZ[r]);const F=oe(),I=[Q("#3d5f8f",.55),[1,.5]];F.rod([0,t.barrelFoot,0],[0,k,0],z,32,I[0],I[1],{capB:!0,paint:[10,r,k,0]}),F.rod([0,k,0],[0,k+1.5,0],.5,8,A[0],A[1],{capB:!0}),N.add(new n.Mesh(F.build(),U));const q=[];for(let X=t.barrelFoot+1,Z=0;X<k-.5;X+=le,Z++)for(let K=0;K<G;K++)b()<.6&&(q.push([X,K/G*Math.PI*2]),O[(r*J+Z)*G+K]=255);const _=new n.InstancedMesh(te,U,q.length);q.forEach(([X,Z],K)=>_.setMatrixAt(K,Le.compose(Te.set(Math.cos(Z)*z,X,-Math.sin(Z)*z),Ce.setFromAxisAngle(De,Z),Be))),_.instanceMatrix.needsUpdate=!0,_.computeBoundingSphere(),N.add(_),N.userData={kind:"spin",R:z+.45,y0:t.barrelFoot,y1:k+1.5};for(const X of N.children)X.userData=N.userData;S.rod([N.position.x,0,N.position.z],[N.position.x,t.barrelFoot,N.position.z],t.footBarrel,16,x[0],x[1],{capB:!0,r2:z+.25}),y.add(N),D.push({group:N,phase:h+r,dir:r===1?-1:1}),W.needsUpdate=!0,r%2===0&&await e.yield()}const me=[],ve=r=>.1*r,se=(r,k,z,N,F,I,q)=>me.push({x:r,y:k,z,yaw:Math.atan2(-N[1],N[0]),len:F,phase:I,sense:q});for(const r of i.ribs){const[k,z]=r.post;S.box(k,19.7,z,.7,39.4,.7,x[0],x[1],{ry:-r.b,skip:"-y"}),S.rod([k,0,z],[k,1.1,z],t.footPost,4,x[0],x[1],{flat:!0,r2:.5,twist:Math.PI/4-r.b});for(let N=0;N<12;N++){const F=35.5-2.5*N,I=D[r.barrel].phase-ve(N)+ee;se(k,F,z,r.armDir,r.armLen,I,1),se(k,F,z,[r.dx,r.dz],2.3,I,-1)}}for(const r of[-t.midPostZ,t.midPostZ]){S.box(t.cx,19,t.cz+r,.5,38,.5,x[0],x[1],{skip:"-y"}),S.rod([t.cx,0,t.cz+r],[t.cx,.9,t.cz+r],.6,4,x[0],x[1],{flat:!0,r2:.36,twist:Math.PI/4});for(let k=0;k<12;k++){const z=35.5-2.5*k,N=D[1].phase-ve(k)+ee;se(t.cx,z,t.cz+r,[0,1],1.4,N,1),se(t.cx,z,t.cz+r,[0,-1],1.4,N,-1)}}y.add(pt(ft(),dt(p),me)),await e.yield();const Fe=r=>r>56?46+11*(75-r)/19:57+9*(56-r)/20,Pe=fe({wheels:1,R:.8,depth:.2,pitch:.6,thick:.5,segs:3,capped:!0,bare:!0,foot:0,y0:0}),xe=s.rackSalt||0,we=[],ge=(r,k)=>[r,.5,k+xe,1];for(const r of i.ribs){const k=t.postR-.6,z=71,N=(k+z)/2,F=z-k,I=t.cx+r.dx*N,q=t.cz+r.dz*N;S.box(I,40.2,q,F,1.6,1.5,x[0],x[1],{ry:-r.b});for(let _=t.ribR[2]+t.hangStep;_<z-3;_+=t.hangStep)S.rod([t.cx+r.dx*_,41,t.cz+r.dz*_],[t.cx+r.dx*_,Fe(_)-.2,t.cz+r.dz*_],.13,4,x[0],x[1],{flat:!0});for(const _ of[-1,1])S.box(I-r.dz*_*.95,39.55,q+r.dx*_*.95,F,.5,.4,A[0],A[1],{ry:-r.b,paint:ge(2,40+r.rib)});for(const _ of r.columns)we.push({x:_.x,y:38.45,z:_.z,col:[1/(.8*.6283),0,re,0],seed:40+r.rib+xe})}for(const[r,k]of[[26,154],[206,334]])for(let z=r;z<k-.01;z+=4){const N=(z+2)*Math.PI/180,F=t.cx+Math.cos(N)*72,I=t.cz+Math.sin(N)*72,q=144*Math.sin(2*Math.PI/180)+.12;S.box(F,40.2,I,1.5,1.6,q,x[0],x[1],{ry:-N}),S.box(F-Math.cos(N)*.95,39.55,I-Math.sin(N)*.95,.4,.5,q,A[0],A[1],{ry:-N,paint:ge(3,r>180?61:60)})}const We=s.pinionMaterial||Ae(p,{y0:0}),be=pe(Pe,We,we);be.geometry.getAttribute("aMeta").array.forEach((r,k,z)=>{k%2===1&&(z[k]=-1)}),y.add(be);const ye=new n.Mesh(S.build(),C);ye.userData={kind:"still"},y.add(ye);const Ie=p.uTempo;return{object:y,radius:40,height:58,center:new n.Vector3(t.cx,24,t.cz),ground:!0,groundY:0,shared:p,layout:i,columns:u,barrels:D,anchors:{centre:new n.Vector3(t.cx,0,t.cz)},update(r,k){s.shared||(p.uTime.value=k);for(const z of D)z.group.rotation.y=ht(k*Ie.value,z.phase,z.dir)},dispose(){}}}export{st as BARREL_LEE,rt as BARREL_LIT,ee as BARREL_ROUND,ct as BARREL_TURN,Ue as GRAIN_GLSL,Ne as HOOP_STEP,qe as JUMP_RATE,V as LIGHT_GLSL,Ve as LONG_AGO,ce as MATTER,re as NO_WAVE,ie as PASTE,Ze as PASTE_GLSL,t as PLAN,ke as RACK_GLSL,He as RUN_LEN,Qe as RUN_PASS,ae as SHADE_GLSL,Oe as STEP_LEN,G as STUD_N,J as STUD_ROWS,le as STUD_STEP,Ge as WAVE_SHARE,he as WAVE_STEP,Se as WHEEL_GLSL,ht as barrelAngle,gt as buildHero,Ee as fingerGeometry,ft as leverGeometry,Q as lin,nt as makeBarrelMaterial,lt as makeFingerMaterial,$e as makeFingers,dt as makeLeverMaterial,pt as makeLevers,oe as makeMesher,ot as makePlainMaterial,_e as makeShared,pe as makeWheelColumn,Ae as makeWheelMaterial,mt as millDraws,ut as millLayout,vt as stopOf,xt as waveBegins,wt as wavesWithin,Ye as wheelOutline,fe as wheelStackGeometry};
