import*as i from"three";import*as H from"../kit/interior.js";const m={SW:22,ZB:44,GRID:25,ROOF:28,PW:9.5,PH:13.5,PT:1.8,CF:-10,SLAB:.5,JOIST:.6,APRON:-3,FOOT:-2.5,PITZ:-7.5,PITY:-2.4,STALL:-1.2,HW:12.5,HZC:-20,HRZ:16,BOXD:2.6,CEIL:18.5,TIER0:2,TIERH:3.2,TIERS:4,VAULT:-3.6,CZ:-36,TRAP:[-7.5,7.5,28,40],BACK:41.2,WZ0:7,WDZ:3.2,WN:6,WX:9.5,WW:5.5,WH:9.5,WT:4.5,SZ0:9.2,SDZ:2.6,SGAP:1,SN:7,SL:9.3,SR:.5,SY:.45,SRAKE:.09,SLOT:.72,CAP:[0,15.7],CAPR:[2.451,3.119],BAR:3.5,CLOUD:[0,24.3],RING:[0,14.2,-19],RR:2.5},k=Math.PI*2,i0=e=>m.SZ0+m.SDZ*e+(e>3?m.SGAP:0),n0=e=>m.SY+m.SRAKE*e,l0=m.SZ0+m.SDZ*3.5+m.SGAP/2,I=(e,t=1)=>new i.Color(e).multiplyScalar(t),u=e=>Number(e).toFixed(3),b={PLAIN:0,WOOD:1,FABRIC:2,STONE:3,WOODX:4,WOODZ:5,BOARDS:6,BRICK:7,PALACE:8,STORM:9,SKY:10,CLOUD:11,WAVE:12,GILT:13,PLASTER:14,VELVET:15,CEIL:16,FLAGS:17,WAVEFLAT:18,HULL:19,SAIL:20,ROPED:21,BORDER:22,SUN:23,DOLPH:24,DAWN:25,SERPENT:26,BACK:27,PLANKS:28},y=(e,t=.2,l=0,p=0,r=0)=>H.surf(e,t,l,p,r),R=new i.Vector3,W=new i.Vector3,z=new i.Vector3,A=new i.Vector3,N=new i.Vector3,T=new i.Matrix4;function r0(e,t,l,p,r,n,h,a){R.set(t[0],t[1],t[2]),W.set(l[0],l[1],l[2]),N.subVectors(W,R);const o=N.length();o<1e-4||(N.multiplyScalar(1/o),A.set(n[0],n[1],n[2]),z.crossVectors(A,N),z.lengthSq()<1e-6&&z.set(1,0,0),z.normalize(),A.crossVectors(N,z),T.makeBasis(z,A,N),T.setPosition((t[0]+l[0])/2,(t[1]+l[1])/2,(t[2]+l[2])/2),e.add(new i.BoxGeometry(p,r,o),{m:T,c:h,surf:a}))}const M=16,F=6,G=43,P=`
uniform float uTime, uFoot, uWing, uHouse, uDust, uStep, uDrop, uLift, uOpen;
uniform vec4 uLan[${M}], uCh[${F}];
uniform vec2 uBox[${G}];
uniform vec3 uCandle, uGold, uStage;
uniform vec4 uGlory;
`,B=`
const float SW = ${u(m.SW)}, PW = ${u(m.PW)}, PH = ${u(m.PH)}, PT = ${u(m.PT)}, CF = ${u(m.CF)}, APRON = ${u(m.APRON)}, FOOT = ${u(m.FOOT)};
const float HW = ${u(m.HW)}, HZC = ${u(m.HZC)}, HRZ = ${u(m.HRZ)}, WZ0 = ${u(m.WZ0)}, WDZ = ${u(m.WDZ)}, WN = ${u(m.WN)};
const float TIER0 = ${u(m.TIER0)}, TIERH = ${u(m.TIERH)};
const float SZ0 = ${u(m.SZ0)}, SDZ = ${u(m.SDZ)}, SL = ${u(m.SL)}, SGAP = ${u(m.SGAP)}, SPIRAL = ${u(4.2/(2*m.SL))};
// how much of a roller's cut its carved crest leaves open over x, as the roller turns (i: its row; the angle is the capstan's, wrapped)
float asBand(float fi, float x){
  float phi = (mod(fi, 2.0) < 0.5 ? 1.0 : -1.0) * uStep * 3.0 + fi * 1.9;
  float sB = fract((phi - 1.5707963) / 6.2831853 + x * SPIRAL); return 1.0 - 0.6 * smoothstep(0.3, 1.0, abs(sB - 0.5) * 2.0);
}
const vec4 TRAP = vec4(${u(m.TRAP[0])}, ${u(m.TRAP[1])}, ${u(m.TRAP[2])}, ${u(m.TRAP[3])});
float asHash(vec3 p){ p = fract(p * 0.3183099 + vec3(0.1, 0.17, 0.23)); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float asNoise(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(asHash(i), asHash(i + vec3(1,0,0)), f.x), mix(asHash(i + vec3(0,1,0)), asHash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(asHash(i + vec3(0,0,1)), asHash(i + vec3(1,0,1)), f.x), mix(asHash(i + vec3(0,1,1)), asHash(i + vec3(1,1,1)), f.x), f.y), f.z); }
// WHERE A POINT STANDS: x of the cellar, y of the stage, z of the house (they sum to 1)
vec3 asZone(vec3 p){
  float lev = p.z > APRON - 0.1 ? -0.25 : -3.0;
  float c = 1.0 - smoothstep(lev - 0.12, lev + 0.12, p.y), s = smoothstep(-PT - 0.1, 0.1, p.z);
  return vec3(c, (1.0 - c) * s, (1.0 - c) * (1.0 - s));
}
// how far inside the house's ring of boxes a point stands (metres from the box fronts; less than nought behind them)
float asBoxDist(vec3 p){
  if (p.z > HZC) return HW - abs(p.x);
  vec2 q = vec2(p.x / HW, (p.z - HZC) / HRZ); return (1.0 - length(q)) * HW;
}
// the breathing of one candle's light on the clock, by its own phase: between 0.8 and 1.2 of its strength
float asFl(float ph){ return 0.14 * sin(uTime * 2.3 + ph) + 0.06 * sin(uTime * 5.1 + ph * 1.7); }
// the air between the eye and a thing: the cellar's dust, the stage's and the house's candle haze
vec3 asAir(vec3 col, vec3 p){
  float L = length(p - cameraPosition); vec3 z = asZone(p);
  vec3 fogc = z.x * vec3(0.04, 0.03, 0.022) + z.y * vec3(0.045, 0.036, 0.03) + z.z * vec3(0.11, 0.075, 0.04);
  float den = z.x * 0.008 + z.y * 0.006 + z.z * 0.0065;
  return mix(col, fogc, 1.0 - exp(-L * den * uDust));
}
`,Z=`
vec3 asBrick(vec2 uv, vec2 fw, vec3 alb){
  float row = floor(uv.y / 0.3), bu = uv.x / 0.9 + 0.5 * mod(row, 2.0); vec2 f = vec2(fract(bu), fract(uv.y / 0.3)), w = vec2(fw.x / 0.9, fw.y / 0.3);
  float h = asHash(vec3(floor(bu), row, 3.0));
  // (the joints' edges are as wide as the pixel's footprint at the least; far off the wall is its mean, some 0.8 brick to joint)
  vec2 e = max(vec2(0.03, 0.09), w * 1.2);
  float body = smoothstep(0.0, e.x, f.x) * (1.0 - smoothstep(1.0 - e.x, 1.0, f.x)) * smoothstep(0.0, e.y, f.y) * (1.0 - smoothstep(1.0 - e.y, 1.0, f.y));
  float lb = smoothstep(0.12, 0.5, max(w.x, w.y)); h = mix(h, 0.5, lb); body = mix(body, 0.8, lb);
  vec3 c = mix(mix(vec3(0.33, 0.3, 0.26), alb, 0.5) * 0.85, alb * (0.6 + 0.7 * h), body) * (0.82 + 0.3 * asNoise(vec3(uv * 0.23, 1.0)));
  c *= 0.8 + 0.4 * asNoise(vec3(uv * 0.9 + 11.0, 4.0));
  return c * (0.92 + 0.14 * asNoise(vec3(uv * 0.071 + 3.0, 2.0)));
}
// the swell of a painted cloud's heads (so: a number of its own board)
float asCloudH(vec2 v, float so){ return asNoise(vec3(v, so)) + 0.45 * asNoise(vec3(v * 2.3, so + 5.0)); }
// timber: p.y runs along the grain
float asGrain(vec3 p, float fp){
  float fine = 1.0 - smoothstep(0.008, 0.04, fp), lines = asNoise(vec3(p.x * 31.0, p.y * 0.7, p.z * 31.0));
  float g = 0.62 + 0.42 * asNoise(vec3(p.x * 2.6, p.y * 0.28, p.z * 2.6)) + 0.3 * (lines - 0.5) * fine;
  float knot = smoothstep(0.82, 0.9, asNoise(vec3(p.x * 1.1 + 5.0, p.y * 0.55, p.z * 1.1)));
  // (the grime of years, in broad patches)
  return g * (1.0 - 0.35 * knot) * (0.76 + 0.34 * asNoise(p * 0.37 + 7.0));
}
vec3 asDetail(float id, vec3 wp, vec3 lp, vec3 V, vec3 alb, inout vec3 n, inout float gloss, inout vec3 em){
  // the pixel's footprint on the surface, in metres (its shorter side): the fine detail of every surface below is filtered by
  // this and by nothing else of the eye. (every screen derivative is taken here, once, outside the branches below)
  float fp = min(length(dFdx(wp)), length(dFdy(wp))); vec3 fww = fwidth(wp), fwl = fwidth(lp);
  if (id < 0.5) { alb *= 0.84 + 0.28 * asNoise(wp * 1.3); }
  else if (id < 1.5) { alb *= asGrain(wp, fp); }
  else if (id < 2.5) { alb *= 0.78 + 0.26 * asNoise(wp * 3.1) + 0.2 * asNoise(wp * 0.7); }
  else if (id < 3.5) { alb *= 0.8 + 0.25 * asNoise(wp * 1.7) + 0.1 * (asHash(floor(wp * 5.0)) - 0.5) * (1.0 - smoothstep(0.01, 0.06, fp)); }
  else if (id < 4.5) { alb *= asGrain(wp.yxz, fp); }
  else if (id < 5.5) { alb *= asGrain(wp.xzy, fp); }
  else if (id < 6.5) {
    // the stage's boards: planks 0.3 m wide running up and down stage, each of its own tone, worn pale where feet and scenery go
    float px = wp.x / 0.3, e = abs(fract(px) - 0.5), h = asHash(vec3(floor(px), 2.0, 5.0));
    float joint = (1.0 - smoothstep(0.455, 0.49 + fww.x / 0.3, e)) ; joint = mix(joint, 0.93, smoothstep(0.03, 0.2, fww.x));
    alb *= (0.86 + 0.24 * mix(h, 0.5, smoothstep(0.05, 0.3, fww.x))) * mix(0.55, 1.0, joint) * asGrain(vec3(wp.x, wp.z, 0.0), fp);
    alb *= 0.94 + 0.12 * asNoise(vec3(wp.xz * 0.21, 3.0));
    // (seen from the cellar the boards are bare and dark with age)
    alb *= n.y < -0.5 ? 0.42 : 1.0;
    // (the slits the wings' masts travel in, seen from the cellar: two lines of the stage's light over each pair of rails)
    if (n.y < -0.5) { float kz = clamp(floor((wp.z - WZ0 - 0.57) / WDZ + 0.5), 0.0, WN - 1.0), dz = abs(wp.z - (WZ0 + 0.57 + WDZ * kz)), ax = abs(wp.x), hw = max(0.05, fww.z * 0.8);
      em += vec3(0.62, 0.66, 0.7) * uWing * 0.55 * (1.0 - smoothstep(hw, hw * 2.0, abs(dz - 0.3))) * min(1.0, 0.05 / hw) * smoothstep(9.3, 9.8, ax) * (1.0 - smoothstep(20.2, 20.7, ax)); }
  }
  else if (id < 7.5) {
    vec2 uv = abs(n.x) > 0.6 ? wp.zy : (abs(n.z) > 0.6 ? wp.xy : wp.xz), fw = abs(n.x) > 0.6 ? fww.zy : (abs(n.z) > 0.6 ? fww.xy : fww.xz);
    alb = asBrick(uv, fw, alb);
    // (on a wall old limewash still clings in broad soft patches)
    float lw = smoothstep(0.5, 0.8, asNoise(vec3(uv * 0.33, 5.0)) * 0.7 + asNoise(vec3(uv * 1.9, 6.0)) * 0.3);
    alb = mix(alb, vec3(0.44, 0.41, 0.37), lw * 0.4);
  }
  else if (id < 8.5) {
    // a palace wing, painted: a fluted column on its plinth before a wall of pale stone with a tall blind arch, an entablature over
    float x = lp.x, y = lp.y, br = 0.86 + 0.28 * asNoise(vec3(lp.xy * vec2(2.2, 0.7), 2.0));
    vec3 stone = vec3(0.62, 0.53, 0.39), shade = vec3(0.2, 0.19, 0.22), gold = vec3(0.62, 0.42, 0.12);
    float ax = abs(x + 1.55) , arch = y < 6.2 ? ax : length(vec2(ax, y - 6.2));
    float inArch = (1.0 - smoothstep(0.86, 0.9 + fwl.x, arch)) * smoothstep(1.3, 1.34, y);
    vec3 wall = stone * (0.82 + 0.2 * smoothstep(0.0, 9.5, y));
    // (courses of stone on the wall; through the arch a far sea under an evening sky, behind a balustrade; a keystone over it)
    float fineP = 1.0 - smoothstep(0.02, 0.09, fwl.x), crs = fract(y / 0.62), jx = fract(x / 1.1 + 0.5 * mod(floor(y / 0.62), 2.0));
    float joint = max(1.0 - smoothstep(0.0, 0.03, min(crs, 1.0 - crs) * 0.62), 1.0 - smoothstep(0.0, 0.025, min(jx, 1.0 - jx) * 1.1));
    wall *= 1.0 - 0.17 * joint * fineP;
    vec3 through = mix(vec3(0.74, 0.62, 0.48), vec3(0.24, 0.36, 0.54), smoothstep(2.9, 7.2, y));
    through = mix(vec3(0.13, 0.33, 0.36) * (0.85 + 0.35 * step(0.55, fract(y * 6.0 + 0.6 * sin(x * 7.0))) * fineP), through, smoothstep(2.86, 2.9, y));
    float bx = abs(fract(x / 0.24) - 0.5) * 0.24, bal = (1.0 - step(2.3, y)) * max(step(2.14, y), 1.0 - smoothstep(0.035, 0.05, bx * (1.0 + 0.9 * abs(y - 1.7))));
    through = mix(through, stone * (0.72 + 0.3 * step(2.14, y)), bal * mix(0.6, 1.0, fineP));
    wall = mix(wall, through, inArch);
    wall *= 1.0 - 0.3 * (1.0 - smoothstep(0.0, 0.1, abs(arch - 0.97))) * smoothstep(1.3, 1.34, y);
    float key = (1.0 - smoothstep(0.13 + (y - 6.9) * 0.12, 0.15 + (y - 6.9) * 0.12 + fwl.x, ax)) * step(6.9, y) * (1.0 - step(7.5, y));
    wall = mix(wall, stone * 1.12 * (0.85 + 0.15 * smoothstep(0.0, 0.12, ax)), key);
    float cx = (x - 0.85) / 0.62, col = 1.0 - smoothstep(0.96, 1.0 + fwl.x / 0.62, abs(cx)), shaft = step(1.25, y) * (1.0 - step(7.55, y));
    float round = sqrt(max(1.0 - cx * cx, 0.0)), fl = 0.5 + 0.5 * cos(cx * 22.0); fl = mix(fl, 0.5, smoothstep(0.02, 0.09, fwl.x));
    vec3 cc = mix(shade, stone * 1.25, clamp(0.25 + 0.75 * round * (0.6 + 0.4 * smoothstep(0.9, -0.6, cx)), 0.0, 1.0)) * (0.82 + 0.26 * fl);
    wall = mix(wall, cc, col * shaft);
    float cap = (1.0 - smoothstep(1.2, 1.26, abs(cx))) * step(7.55, y) * (1.0 - step(8.3, y)), pl = (1.0 - smoothstep(1.25, 1.3, abs(cx))) * (1.0 - step(1.25, y));
    wall = mix(wall, gold * (0.7 + 0.6 * abs(sin(x * 14.0)) * (1.0 - smoothstep(0.02, 0.09, fwl.x))), cap);
    wall = mix(wall, stone * (0.7 + 0.25 * step(0.35, y)), pl);
    float ent = step(8.3, y); wall = mix(wall, stone * (0.95 - 0.35 * step(0.5, fract((y - 8.3) / 0.4)) ), ent);
    alb = wall * br;
  }
  else if (id < 9.5) {
    // a storm wing, painted: a sea crag in broken faces, each face laid in one flat tone by the storm's light out of the upper left
    // (lit, half lit, in shade), dark clefts between the faces, hair cracks across them; spray at its foot
    float fine = 1.0 - smoothstep(0.03, 0.16, fp);
    vec2 q = lp.xy * vec2(0.8, 0.3); q += 0.3 * vec2(asNoise(vec3(q * 0.8, 3.0)), asNoise(vec3(q * 0.8, 9.0)));
    vec2 ci = floor(q), cf = fract(q), id1 = vec2(0.0); float d1 = 9.0, d2 = 9.0;
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) { vec2 g = vec2(float(i), float(j)), o = vec2(asHash(vec3(ci + g, 1.0)), asHash(vec3(ci + g, 5.0))); float d = length(g + o - cf);
      if (d < d1) { d2 = d1; d1 = d; id1 = ci + g; } else if (d < d2) d2 = d; }
    float tone = asHash(vec3(id1, 7.0)) + 0.22 * (lp.y / 9.5 - 0.5), cleft = 1.0 - smoothstep(0.0, 0.06 + fp * 0.6, d2 - d1);
    vec3 rock = tone < 0.36 ? vec3(0.045, 0.05, 0.075) : (tone < 0.72 ? vec3(0.12, 0.13, 0.155) : vec3(0.25, 0.245, 0.225));
    // (each face is worked a little from its upper edge down, as a brush lays it)
    rock *= 0.82 + 0.3 * smoothstep(0.0, 0.7, d1) + 0.1 * (asNoise(vec3(lp.xy * vec2(5.0, 2.0), 6.0)) - 0.5) * fine;
    float crack = 1.0 - smoothstep(0.0, 0.03, abs(asNoise(vec3(lp.xy * vec2(1.3, 0.9), 4.0)) - 0.5)) ;
    rock *= 1.0 - 0.7 * cleft * fine - 0.3 * crack * fine;
    rock = mix(vec3(0.14, 0.145, 0.16), rock, 0.35 + 0.65 * fine);
    float spray = (1.0 - smoothstep(0.2, 1.7, lp.y)) * (0.45 + 0.55 * asNoise(vec3(lp.x * 1.4, lp.y * 1.2, 9.0)));
    alb = mix(rock, vec3(0.26, 0.32, 0.33), spray * 0.7);
  }
  else if (id < 10.5) {
    // the backcloth, painted: a storm over a far sea. Long masses of cloud lean up to the right, modelled soft from grey to deep
    // slate, their edges toward the light crisp and pale; a rent of pale gold low on the left; slanting rain; brush strokes
    float y = wp.y, hz = 3.4, h = clamp((y - hz) / 16.0, 0.0, 1.0), fine = 1.0 - smoothstep(0.03, 0.14, fp);
    float rnx = (wp.x + 5.0) / 9.0, rny = (y - hz - 1.0) / 2.4, rent = exp(-rnx * rnx) * exp(-rny * rny);
    vec3 sky = mix(vec3(0.44, 0.49, 0.52), vec3(0.13, 0.17, 0.27), smoothstep(0.0, 0.75, h));
    sky = mix(sky, vec3(1.0, 0.87, 0.52), rent);
    vec2 wq = vec2(wp.x * 0.06 - 0.035 * y, y * 0.15);
    vec2 q = wq + 0.4 * vec2(asNoise(vec3(wq * 1.4, 2.0)) - 0.5, asNoise(vec3(wq * 1.4 + 7.3, 5.0)) - 0.5), q2 = q + vec2(-0.045, -0.05);
    float m = asNoise(vec3(q, 1.0)) * 0.55 + asNoise(vec3(q * 2.3 + 4.0, 4.0)) * 0.3 + asNoise(vec3(q * 5.1, 8.0)) * 0.15;
    float m2 = asNoise(vec3(q2, 1.0)) * 0.55 + asNoise(vec3(q2 * 2.3 + 4.0, 4.0)) * 0.3 + asNoise(vec3(q2 * 5.1, 8.0)) * 0.15;
    float cover = m + 0.3 * h - 0.14, body = smoothstep(0.4, 0.47, cover), deep = smoothstep(0.45, 0.72, cover);
    float rim = smoothstep(0.004, 0.02, m - m2) * body * (1.0 - smoothstep(0.47, 0.58, cover));
    vec3 cl = mix(vec3(0.4, 0.43, 0.47), vec3(0.09, 0.11, 0.17), deep);
    cl = mix(cl, mix(vec3(0.68, 0.68, 0.63), vec3(1.0, 0.84, 0.52), clamp(rent * 4.0, 0.0, 1.0)), rim * 0.85);
    cl *= 0.93 + 0.14 * asNoise(vec3(wp.x * 5.0 - y * 3.0, y * 11.0, 3.0)) * fine;
    sky = mix(sky, cl, body * (1.0 - 0.8 * rent));
    float rain = smoothstep(0.6, 0.68, asNoise(vec3((wp.x + y * 0.5) * 2.6, y * 0.07, 2.0))) * fine;
    sky = mix(sky, sky * 0.72 + vec3(0.07, 0.08, 0.09), rain * 0.5 * (1.0 - rent));
    float wv = asNoise(vec3(wp.x * 0.8, y * 6.0, 3.0)), capw = smoothstep(0.68, 0.7, wv) * fine;
    vec3 sea = mix(vec3(0.02, 0.075, 0.1), vec3(0.1, 0.24, 0.24), smoothstep(hz - 3.4, hz, y) * (0.45 + 0.55 * wv));
    sea += vec3(0.6, 0.55, 0.36) * rent * 1.8 * exp(-(hz - y) * 0.9) * (0.6 + 0.4 * smoothstep(0.45, 0.55, wv)); sea = mix(sea, vec3(0.6, 0.66, 0.62), capw * 0.7);
    alb = mix(sea, sky, smoothstep(hz - 0.02, hz + 0.02, y));
  }
  else if (id < 11.5) {
    // a cut cloud, painted: round heads lit from over one shoulder, grey under
    float m = asNoise(vec3(lp.xy * 0.8, 2.0 + lp.z)) * 0.6 + asNoise(vec3(lp.xy * 2.3, 5.0)) * 0.4;
    float top = smoothstep(-0.6, 0.9, m * 1.2 - 0.6 + 0.35 * sin(lp.x * 1.7 + m * 4.0) + 0.3 * sin(lp.y * 2.4 + m * 3.0));
    alb *= mix(mix(vec3(0.5, 0.53, 0.6), vec3(0.78, 0.5, 0.52), uDrop), mix(vec3(1.0, 0.97, 0.9), vec3(1.0, 0.9, 0.72), uDrop), top) * (0.9 + 0.2 * asNoise(vec3(lp.xy * 6.0, 1.0)) * (1.0 - smoothstep(0.02, 0.1, fp)));
    // (each cloud is modelled in round swelling heads: those of the glory are lit from its gilt sun, the others from over one shoulder)
    { float gl = 1.0 - step(2.0, abs(lp.z)), so = floor(lp.z * 9.0 + 40.0) * 3.7; vec2 q = lp.xy * 1.05, ex = vec2(0.09, 0.0);
      vec2 g = vec2(asCloudH(q + ex, so) - asCloudH(q - ex, so), asCloudH(q + ex.yx, so) - asCloudH(q - ex.yx, so)) / 0.18;
      vec2 ld = mix(vec2(-0.6, 0.7), vec2(0.0, 2.3) - lp.xy, gl); ld /= max(length(ld), 0.01);
      float sh = clamp(0.55 - dot(g, ld) * 0.55, 0.0, 1.25), fineh = 1.0 - smoothstep(0.03, 0.2, fp);
      alb *= mix(1.0, 0.6 + 0.52 * sh, fineh * 0.85);
      // (the clouds of the glory take the gilt sun's glow, nearest it most, and fall away to grey at its skirts)
      vec2 gd = lp.xy - vec2(0.0, 2.3); float gs = exp(-dot(gd, gd) / 10.0) * gl; alb = mix(alb, alb * vec3(1.3, 1.08, 0.7) + vec3(0.1, 0.06, 0.0), gs * 0.75);
      alb *= 1.0 - 0.2 * gl * smoothstep(3.5, 9.0, length(gd)); }
  }
  else if (id < 12.5) {
    // a roller of the sea: a carved crest winds round it; deep blue in the troughs, sea green up the crest's flanks in a painter's
    // long strokes, broken dabs of foam along its lip
    float a = atan(lp.y, lp.z) / 6.2831853, s = fract(a + lp.x * SPIRAL), cr = abs(s - 0.5) * 2.0, fine = 1.0 - smoothstep(0.02, 0.1, fp);
    float big = asNoise(vec3(lp.x * 0.7, lp.yz * 1.5) + 3.0), nz1 = asNoise(vec3(lp.x * 3.0, lp.yz * 7.0));
    vec3 deep = mix(vec3(0.014, 0.075, 0.125), vec3(0.02, 0.12, 0.15), big), green = mix(vec3(0.045, 0.23, 0.25), vec3(0.11, 0.36, 0.31), big);
    alb = mix(deep, green, smoothstep(0.25, 0.85, cr + 0.3 * (big - 0.5)));
    float streak = smoothstep(0.58, 0.72, asNoise(vec3(lp.x * 1.3, lp.yz * 6.0) + 4.0)) * fine;
    alb = mix(alb, vec3(0.2, 0.47, 0.43), streak * 0.5 * smoothstep(0.2, 0.7, cr));
    float foam = smoothstep(0.86, 0.96, cr + 0.22 * (nz1 - 0.5)) * smoothstep(0.3, 0.55, asNoise(vec3(lp.x * 1.7, lp.yz * 2.6) + 8.0) + 0.25 * (nz1 - 0.5) * fine);
    alb = mix(alb, vec3(0.78, 0.84, 0.78), foam);
  }
  else if (id < 13.5) { alb *= 0.82 + 0.3 * asNoise(wp * 2.3);
    float fine = 1.0 - smoothstep(0.01, 0.08, fp); n = normalize(n + 0.3 * fine * (vec3(asNoise(wp * 11.0), asNoise(wp * 11.0 + 7.3), asNoise(wp * 11.0 + 13.1)) - 0.5)); }
  else if (id < 14.5) {
    alb *= 0.9 + 0.16 * asNoise(wp * 0.9) + 0.06 * (asNoise(wp * 7.0) - 0.5) * (1.0 - smoothstep(0.01, 0.06, fp));
    // the walls that face the house beside and over the proscenium: panels of celadon in gilt lines, in the tiers' own courses
    if (n.z < -0.9 && wp.z > -4.6 && wp.z < 0.0) {
      vec2 pc = vec2(wp.x / 2.4, (wp.y - 2.0) / 3.2), pf = fract(pc) - 0.5; float fine = 1.0 - smoothstep(0.03, 0.2, fp);
      float bx = max(abs(pf.x) / 0.4, abs(pf.y) / 0.38), inP = 1.0 - smoothstep(0.94, 1.0, bx), fr = 1.0 - smoothstep(0.02, 0.07, abs(bx - 1.0));
      vec3 c = mix(alb, vec3(0.5, 0.6, 0.55) * (0.9 + 0.2 * pf.y), inP * 0.7); c = mix(c, vec3(0.84, 0.6, 0.22), fr);
      alb = mix(mix(alb, vec3(0.58, 0.62, 0.54), 0.4), c, fine);
    }
    // the boxes' fronts: a gilt course at the foot and at the head, and a gilt garland hung from pin to pin along the field between
    { float bdp = asBoxDist(wp), t = mod(wp.y - TIER0, TIERH);
      if (abs(bdp) < 0.35 && abs(n.y) < 0.5 && wp.y > TIER0 - 0.05 && wp.y < TIER0 + 4.0 * TIERH && t < 0.95 && wp.z < -4.0) {
        float fine = 1.0 - smoothstep(0.02, 0.14, fp), s = wp.z > HZC ? wp.z : HZC + atan(wp.x / HW, -(wp.z - HZC) / HRZ) * 14.0, f = fract(s / 1.1);
        float sag = 0.64 - 0.3 * (1.0 - (2.0 * f - 1.0) * (2.0 * f - 1.0)), gar = 1.0 - smoothstep(0.022, 0.05, abs(t - sag));
        float pin = 1.0 - smoothstep(0.045, 0.065, length(vec2((f < 0.5 ? f : f - 1.0) * 1.1, t - 0.66)));
        float band = smoothstep(0.1, 0.12, t) * (1.0 - smoothstep(0.8, 0.82, t));
        vec3 c = alb * (0.84 + 0.24 * t); c = mix(c, vec3(0.86, 0.6, 0.2), max(gar, pin) * band);
        c = mix(vec3(0.8, 0.56, 0.2) * (t < 0.2 ? 0.85 + 3.0 * t : 1.15 - (t - 0.82) * 2.5), c, band);
        c *= 1.0 - 0.5 * (1.0 - smoothstep(0.0, 0.035, abs(t - 0.115))) - 0.5 * (1.0 - smoothstep(0.0, 0.035, abs(t - 0.805)));
        alb = mix(alb, c, fine);
      }
      // the wall under the first tier: panelling of walnut in gilt lines over the dado, shaded by the tier over it
      if (abs(bdp) < 0.35 && abs(n.y) < 0.5 && wp.y < TIER0 - 0.2 && wp.y > -0.3 && wp.z < -4.0) {
        float fine = 1.0 - smoothstep(0.02, 0.14, fp), s = wp.z > HZC ? wp.z : HZC + atan(wp.x / HW, -(wp.z - HZC) / HRZ) * 14.0, f2 = fract(s / 2.2) - 0.5, v = (wp.y + 0.15) / 1.8;
        float bx = max(abs(f2) / 0.43, abs(v - 0.5) / 0.4), inP = 1.0 - smoothstep(0.94, 1.0, bx), fr = 1.0 - smoothstep(0.02, 0.07, abs(bx - 1.0));
        float gr = 0.8 + 0.4 * asNoise(vec3(s * 0.7, wp.y * 9.0, 2.0));
        vec3 c = mix(alb * 0.8, alb * 1.25 * gr, inP); c = mix(c, vec3(0.84, 0.6, 0.22), fr);
        alb = mix(alb * 1.1, c, fine);
      }
      if (abs(bdp) < 0.35 && abs(n.y) < 0.5 && wp.y < TIER0 - 0.1 && wp.z < -4.0) alb *= 0.5 + 0.5 * smoothstep(0.0, 1.1, TIER0 - 0.1 - wp.y);
      // the great columns beside the proscenium: fluted, of clouded scagliola
      float ax = abs(wp.x), cxr = ax < PW + 2.2 ? PW + 1.5 : PW + 2.9; vec2 cd = vec2(ax - cxr, wp.z + PT + 0.3);
      if (abs(length(cd) - 0.44) < 0.07 && abs(n.y) < 0.3 && wp.y > 0.6 && wp.y < PH - 0.6) {
        float a = atan(cd.y, cd.x), fl = cos(a * 20.0), fine = 1.0 - smoothstep(0.01, 0.07, fp);
        float vein = asNoise(vec3(wp.x * 1.3 + 2.0 * asNoise(wp * 0.6), wp.y * 0.4, wp.z * 1.3));
        alb = mix(alb * 0.86, alb * 1.1 + vec3(0.03, 0.03, 0.02), smoothstep(0.3, 0.7, vein)) * (0.74 + 0.3 * mix(1.0, 0.5 + 0.5 * fl, fine));
        vec3 tg = vec3(-sin(a) * (wp.x < 0.0 ? -1.0 : 1.0), 0.0, cos(a)); n = normalize(n + tg * 0.4 * sin(a * 20.0) * fine); gloss += 0.3;
      }
    }
    // the cove from the last tier up to the ceiling, painted: thirty panels of celadon in gilt frames, a gilt boss in each
    if (n.y < -0.3 && wp.y > 14.8) {
      float k = atan(wp.z + 19.0, wp.x) * 30.0 / 6.2831853, fk = fract(k) - 0.5, v = (wp.y - 14.8) / 3.7, fine = 1.0 - smoothstep(0.03, 0.2, fp);
      float bx = max(abs(fk) / 0.41, abs(v - 0.5) / 0.36), inP = 1.0 - smoothstep(0.92, 1.0, bx), fr = (1.0 - smoothstep(0.03, 0.09, abs(bx - 1.0)));
      float boss = 1.0 - smoothstep(0.1, 0.13, length(vec2(fk * 0.9, (v - 0.5) * 1.15)));
      vec3 c = mix(alb, vec3(0.42, 0.54, 0.5) * (0.85 + 0.3 * v), inP * 0.85); c = mix(c, vec3(0.86, 0.6, 0.2), max(fr, boss));
      alb = mix(mix(alb, vec3(0.5, 0.55, 0.47), 0.55), c, fine);
    }
  }
  else if (id < 15.5) {
    // red cloth: its nap, and the folds it hangs in (on what stands upright)
    float hx = wp.x * abs(n.z) + wp.z * abs(n.x), fold = 0.5 + 0.5 * sin(hx * 8.0 + 1.3 * sin(wp.y * 0.8 + hx * 0.6));
    alb *= (0.78 + 0.34 * asNoise(wp * 2.6)) * mix(1.0, 0.66 + 0.5 * fold, (1.0 - smoothstep(0.04, 0.3, fp)) * (1.0 - abs(n.y)));
  }
  else if (id < 16.5) {
    // the house's ceiling, painted: a night sky of deep blue, paler toward its rim, strewn with gilt stars, seen through an oval
    // ring of painted balusters; gilded ribs run from a rosette at its middle out to the ring
    vec2 q = vec2(wp.x / 10.6, (wp.z + 19.0) / 14.6); float r = length(q), an = atan(q.y, q.x), fr = length(fww.xz / vec2(10.6, 14.6)), fa = fr / max(r, 0.05);
    vec3 sky = mix(vec3(0.028, 0.055, 0.19), vec3(0.09, 0.19, 0.4), smoothstep(0.15, 0.8, r)) * (0.8 + 0.4 * asNoise(vec3(wp.xz * 0.3, 6.0)));
    vec2 sc = wp.xz / 0.95, ci = floor(sc), so = fract(sc) - 0.5 - 0.3 * vec2(asHash(vec3(ci, 1.0)) - 0.5, asHash(vec3(ci, 5.0)) - 0.5);
    float sr = 0.07 + 0.1 * asHash(vec3(ci, 8.0)), sa = atan(so.y, so.x), se = max(length(fww.xz) / 0.95, 0.012);
    float rad = sr * (0.3 + 0.7 * pow(abs(cos(sa * 2.0)), 5.0)), star = (1.0 - smoothstep(rad - se, rad + se, length(so))) * step(asHash(vec3(ci, 3.0)), 0.6);
    float rib = 0.5 + 0.5 * cos(an * 16.0), ribw = fa * 16.0, ribs = smoothstep(0.985 - ribw * 0.3, 0.995, rib) * smoothstep(0.13, 0.15, r);
    float ros = (1.0 - smoothstep(0.1 + 0.03 * cos(an * 12.0), 0.11 + 0.03 * cos(an * 12.0) + fr, r));
    vec3 gilt = vec3(0.9, 0.62, 0.2) * (0.8 + 0.4 * rib); float gm = max(max(ribs * 0.9, ros), star);
    sky = mix(sky, gilt, gm);
    float bal = 0.5 + 0.5 * cos(an * 64.0), bw = fa * 64.0; bal = mix(smoothstep(0.35, 0.65, bal), 0.5, smoothstep(0.5, 2.5, bw));
    float ring = smoothstep(0.8, 0.8 + fr, r) * (1.0 - smoothstep(0.925, 0.925 + fr, r));
    vec3 stone = vec3(0.82, 0.76, 0.64) * mix(0.5, 1.0, bal) * (0.9 + 0.2 * smoothstep(0.8, 0.93, r));
    stone = mix(stone, vec3(0.9, 0.66, 0.26), step(0.905, r) + (1.0 - step(0.82, r)));
    vec3 inner = mix(sky, stone, ring); float inn = 1.0 - smoothstep(0.93, 0.93 + fr, r);
    alb = mix(alb, inner, inn); em += (sky * 0.05 + gilt * 0.16 * gm) * inn * (1.0 - ring);
  }
  else if (id > 27.5) {
    // a wall of upright boards 0.3 m wide, each of its own tone, darker with smoke toward the roof
    float s = abs(n.x) > 0.6 ? wp.z : wp.x, fs = abs(n.x) > 0.6 ? fww.z : fww.x, px = s / 0.3, e = abs(fract(px) - 0.5), h = asHash(vec3(floor(px), 4.0, 9.0));
    float joint = 1.0 - smoothstep(0.45, 0.49 + fs / 0.3, e); joint = mix(joint, 0.93, smoothstep(0.03, 0.2, fs));
    alb *= (0.78 + 0.4 * mix(h, 0.5, smoothstep(0.05, 0.3, fs))) * mix(0.5, 1.0, joint) * asGrain(vec3(s, wp.y, 0.0), fp);
    alb *= (0.85 + 0.3 * asNoise(vec3(s * 0.17, wp.y * 0.11, 3.0))) * (1.0 - 0.45 * smoothstep(8.0, 24.0, wp.y));
  }
  else if (id > 26.5) {
    // the back of a painted cloth: raw canvas in widths sewn side by side, stained where the paint has struck through
    float fine = 1.0 - smoothstep(0.02, 0.12, fp), sm = abs(fract(lp.x / 0.9) - 0.5) * 2.0, seam = 1.0 - 0.3 * smoothstep(0.9, 0.98, sm) * fine;
    float st = smoothstep(0.42, 0.7, asNoise(vec3(lp.xy * 0.45, 7.0 + wp.z * 0.37)));
    alb *= (0.72 + 0.3 * asNoise(vec3(lp.xy * 1.7, 3.0))) * seam;
    alb = mix(alb, alb * vec3(0.62, 0.7, 0.8), st * 0.55);
  }
  else if (id > 25.5) {
    // a sea serpent, painted on its cut boards: green scales, each with a dark lower edge and a touch of gold at its root
    vec2 s = lp.xy / 0.24; s.x += 0.5 * mod(floor(s.y), 2.0); vec2 f = fract(s) - vec2(0.5, 1.0); float arc = length(f * vec2(1.0, 0.9)), fine = 1.0 - smoothstep(0.02, 0.1, fp);
    vec3 c = mix(vec3(0.12, 0.4, 0.24), vec3(0.03, 0.14, 0.11), smoothstep(0.3, 0.52, arc));
    c = mix(c, vec3(0.7, 0.56, 0.18), (1.0 - smoothstep(0.08, 0.16, arc)) * 0.8);
    alb = mix(vec3(0.08, 0.26, 0.17), c, fine) * (0.85 + 0.3 * asNoise(vec3(lp.xy * 1.3, 4.0)));
  }
  else if (id > 24.5) {
    // the second backcloth, a roll drop, painted: a clear dawn over a calm sea. The sky runs from gold at the horizon through rose to a
    // pale blue; long bars of lit cloud; the sun's glow low in the middle and its path on the water. Only as much of it shows as has
    // unrolled (uDrop, the flight's own: section 153)
    if (lp.y < 21.0 * (1.0 - uDrop)) discard;
    float y = lp.y, x = -lp.x, hz = 3.4, h = clamp((y - hz) / 16.0, 0.0, 1.0), fine = 1.0 - smoothstep(0.03, 0.14, fp);
    vec3 sky = mix(vec3(1.0, 0.68, 0.26), vec3(0.95, 0.46, 0.36), smoothstep(0.0, 0.24, h)); sky = mix(sky, vec3(0.26, 0.44, 0.76), smoothstep(0.16, 0.7, h));
    float glx = x / 7.5, gly = (y - hz) / 4.5, gl = exp(-(glx * glx + gly * gly));
    sky = mix(sky, vec3(1.0, 0.94, 0.72), gl * 0.9);
    vec2 q = vec2(x * 0.05, y * 0.3); float m = asNoise(vec3(q, 3.0)) * 0.6 + asNoise(vec3(q * 2.7 + 5.0, 6.0)) * 0.4;
    float bar = smoothstep(0.5, 0.6, m + 0.1 * h) * (1.0 - 0.6 * gl);
    sky = mix(sky, mix(vec3(1.0, 0.78, 0.5), vec3(0.72, 0.4, 0.5), smoothstep(0.55, 0.78, m)), bar * 0.8);
    sky *= 0.95 + 0.1 * asNoise(vec3(x * 5.0, y * 9.0, 2.0)) * fine;
    float wv = asNoise(vec3(x * 0.7, y * 7.0, 3.0));
    vec3 sea = mix(vec3(0.08, 0.24, 0.3), vec3(0.42, 0.55, 0.54), smoothstep(hz - 3.4, hz, y) * (0.5 + 0.5 * wv));
    float pwx = x / max(1.0 + (hz - y) * 1.5, 0.25), pw = exp(-pwx * pwx); sea = mix(sea, vec3(1.0, 0.86, 0.55), pw * (0.4 + 0.6 * smoothstep(0.4, 0.6, wv)));
    alb = mix(sea, sky, smoothstep(hz - 0.02, hz + 0.02, y)); em += alb * 0.12;
  }
  else if (id > 23.5) {
    // a dolphin, painted on its cut board: a slate back, a pale belly, an eye
    float r = length(lp.xy), fine = 1.0 - smoothstep(0.01, 0.05, fp);
    vec3 c = mix(vec3(0.5, 0.58, 0.58), vec3(0.07, 0.13, 0.2), smoothstep(0.97, 1.05, r + 0.03 * asNoise(vec3(lp.xy * 9.0, 1.0)) * fine));
    c = mix(c, vec3(0.3, 0.42, 0.48), smoothstep(1.08, 1.16, r) * 0.6);
    float eye = length(lp.xy - vec2(0.497, 0.886)); c = mix(c, vec3(0.85, 0.82, 0.7), 1.0 - smoothstep(0.03, 0.04, eye)); c = mix(c, vec3(0.02), 1.0 - smoothstep(0.014, 0.022, eye));
    alb = c * (0.85 + 0.3 * asNoise(vec3(lp.xy * 4.0, 3.0)));
  }
  else if (id > 22.5) {
    // the gilded sun: a boss in its middle, twenty-four rays, each ridged down its middle (one flank bright, one in shade)
    float r = length(lp.xy), k = atan(lp.y, lp.x) * 24.0 / 6.2831853, fk = fract(k);
    float emb = mix(1.25, 0.62, smoothstep(0.46, 0.54, fk)) * mix(1.0, 0.8, smoothstep(0.9, 1.0, fk) + 1.0 - smoothstep(0.0, 0.1, fk));
    float boss = 1.25 - 0.55 * smoothstep(0.0, 0.88, r) - 0.3 * (1.0 - smoothstep(0.0, 0.03, abs(r - 0.74)));
    alb *= r > 0.9 ? emb : boss;
  }
  else if (id > 21.5) {
    // a sky border, painted: storm cloud, darkest where it hangs from its batten, its sawn heads catching the light from below
    float t = clamp((17.8 - wp.y) / 3.6, 0.0, 1.0), fine = 1.0 - smoothstep(0.02, 0.1, fp);
    float m = asNoise(vec3(wp.x * 0.5, wp.y * 0.9, 2.0 + wp.z)) * 0.6 + asNoise(vec3(wp.x * 1.4, wp.y * 2.0, 5.0 + wp.z)) * 0.4;
    vec3 c = mix(vec3(0.1, 0.12, 0.18), vec3(0.3, 0.34, 0.4), smoothstep(0.2, 1.0, t + 0.4 * (m - 0.5)));
    c = mix(c, vec3(0.6, 0.6, 0.56), smoothstep(0.82, 1.08, t + 0.3 * (m - 0.5)) * 0.7);
    alb = c * (0.92 + 0.16 * asNoise(vec3(wp.x * 5.0, wp.y * 9.0, 3.0)) * fine);
    alb = mix(alb, dot(alb, vec3(0.34)) * vec3(2.3, 1.4, 1.2) + vec3(0.08, 0.02, 0.03), uDrop * 0.85);
  }
  else if (id > 20.5) {
    // rope wound on an upright drum: turns 0.08 m apart, each round, laid in strands
    float t = fract(lp.y / 0.08), an = atan(lp.z, lp.x), fine = 1.0 - smoothstep(0.012, 0.06, fp);
    float lay = 0.5 + 0.5 * sin(an * 150.0 + t * 12.566);
    alb *= mix(0.8, (0.42 + 0.66 * sin(3.14159 * t)) * (0.8 + 0.2 * lay), fine) * (0.8 + 0.4 * asNoise(lp * 1.3));
    n = normalize(n + vec3(0.0, (t - 0.5) * 1.1 * fine, 0.0));
  }
  else if (id > 19.5) {
    // a sail: cloths 0.4 m wide sewn side by side, a little darker at the seams and toward the foot
    float ac = lp.x * 0.479 + lp.z * 0.878, sm = abs(fract(ac / 0.4) - 0.5) * 2.0, seam = 1.0 - smoothstep(0.86, 0.98, sm) * (1.0 - smoothstep(0.01, 0.06, fp));
    alb *= (0.72 + 0.28 * seam) * (0.8 + 0.3 * asNoise(vec3(ac * 1.3, lp.y * 0.9, 3.0))) * (0.85 + 0.2 * asNoise(lp * 5.0));
  }
  else if (id > 18.5) {
    // the ship's side, painted: tarred below, an ochre band with dark ports, red-brown planks above with a pale line
    float hy = lp.y - 0.95, pl = abs(fract(hy / 0.13) - 0.5) * 2.0, line = 1.0 - 0.3 * smoothstep(0.8, 0.95, pl) * (1.0 - smoothstep(0.01, 0.05, fp));
    float port = (1.0 - smoothstep(0.26, 0.3, abs(fract(lp.x / 0.62) - 0.5))) * smoothstep(0.82, 0.85, hy) * (1.0 - smoothstep(1.02, 1.05, hy));
    vec3 c = mix(vec3(0.05, 0.04, 0.035), vec3(0.62, 0.42, 0.14), smoothstep(0.66, 0.69, hy));
    c = mix(c, vec3(0.03, 0.025, 0.02), port * (1.0 - smoothstep(1.4, 2.2, abs(lp.x) - 0.6)));
    c = mix(c, vec3(0.3, 0.13, 0.08), smoothstep(1.16, 1.19, hy)); c = mix(c, vec3(0.7, 0.6, 0.4), smoothstep(1.3, 1.32, hy) * (1.0 - smoothstep(1.36, 1.38, hy)));
    alb = c * line * (0.85 + 0.3 * asNoise(vec3(lp.x * 2.0, hy * 6.0, lp.z)));
  }
  else if (id > 17.5) {
    // a ground row of waves, painted on a flat: green-blue, each crest's lip pale
    float m = asNoise(vec3(lp.x * 1.1, lp.y * 3.0, 2.0)), cr = fract(lp.y * 2.2 + 0.35 * sin(lp.x * 2.6) + m * 0.5);
    alb = mix(vec3(0.015, 0.085, 0.12), vec3(0.07, 0.3, 0.32), cr) * (0.8 + 0.4 * m);
    alb = mix(alb, vec3(0.7, 0.78, 0.74), smoothstep(0.82, 0.95, cr) * (0.5 + 0.5 * m));
  }
  else {
    // the cellar's floor: brick laid flat in courses across the house, dark with age and dust
    alb = asBrick(wp.xz * 2.6, fww.xz * 2.6, alb) * (0.55 + 0.6 * asNoise(vec3(wp.xz * 0.31, 2.0)));
    // (where the walkers tread, a ring worn smooth and pale)
    float tr = length(wp.xz - vec2(${u(m.CAP[0])}, ${u(m.CAP[1])})), worn = smoothstep(2.0, 2.4, tr) * (1.0 - smoothstep(3.3, 3.8, tr));
    alb *= 1.0 + 0.4 * worn; gloss += 0.3 * worn;
    // (the soft shade each walker casts at his feet goes round with him: the capstan's own angle, wrapped)
    vec2 dc = wp.xz - vec2(${u(m.CAP[0])}, ${u(m.CAP[1])}); float la = atan(dc.y, dc.x) + uStep, shd = 0.0;
    for (int k = 0; k < 2; k++) { float rk = k == 0 ? ${u(m.CAPR[0])} : ${u(m.CAPR[1])}, da = mod(la - 0.5 / rk + 0.3926991, 0.7853982) - 0.3926991;
      shd = max(shd, 1.0 - smoothstep(0.1, 0.7, length(vec2(da * rk * 0.7, tr - rk)))); }
    alb *= 1.0 - 0.55 * shd;
  }
  return alb;
}
// the row of lamps behind the shield at the lift's front edge: they rise with it and light what stands on it from below
vec3 asFloat(vec3 wp, vec3 n){
  vec3 q = vec3(clamp(wp.x, -2.5, 6.85), uLift + 0.2, 33.4) - wp; float q2 = dot(q, q); q /= sqrt(max(q2, 1e-3));
  return uCandle * 8.0 / (q2 + 4.0) * clamp(dot(n, q) * 0.7 + 0.3, 0.0, 1.0) * (1.0 - smoothstep(60.0, 220.0, q2));
}
vec3 asLight(vec3 wp, vec3 n, vec3 V, vec3 alb, float gloss, float metal){
  vec3 zn = asZone(wp); float up = n.y * 0.5 + 0.5;
  vec3 R = reflect(-V, n); float sp = 8.0 + 90.0 * gloss; vec3 lit = vec3(0.0), spec = vec3(0.0);
  // THE CELLAR: its lanterns, and what the stage lets fall through the open floor behind the sea
  if (zn.x > 0.003) {
    vec3 c = vec3(0.03, 0.027, 0.025) * (0.5 + up), s = vec3(0.0);
    for (int i = 0; i < ${M}; i++) {
      vec3 d = uLan[i].xyz - wp; float d2 = dot(d, d); d /= sqrt(max(d2, 1e-3)); float k = uLan[i].w * 1.4 / (d2 + 1.5) * (1.0 - smoothstep(36.0, 400.0, d2));
      c += uCandle * k * clamp(dot(n, d) * 0.75 + 0.25, 0.0, 1.0); s += uCandle * k * pow(max(dot(R, d), 0.0), sp);
    }
    vec2 tq = max(vec2(TRAP.x, TRAP.z) - wp.xz, wp.xz - vec2(TRAP.y, TRAP.w)); float td = length(max(tq, 0.0));
    c += vec3(0.42, 0.5, 0.6) * uFoot * (0.15 + 0.85 * uOpen) * (1.0 - smoothstep(0.0, 9.0, td)) * (0.25 + 0.75 * up) * smoothstep(CF, CF + 9.0, wp.y + 4.0);
    // what falls through the floor's cuts under the sea's rollers: a line of light under each, in bands that travel as its crest turns
    for (int i = 0; i < ${m.SN}; i++) {
      vec3 q = vec3(clamp(wp.x, -SL, SL), -0.4, SZ0 + SDZ * float(i) + (i > 3 ? SGAP : 0.0)) - wp; float q2 = dot(q, q); q /= sqrt(max(q2, 1e-3));
      // (near the floor's underside it spreads; farther down it falls as a stripe under its cut)
      float near = 1.7 / (q2 + 6.0), stripe = 13.0 / (q2 * 0.15 + 6.0) * (1.0 - smoothstep(0.06, 0.2, abs(q.z) / max(q.y, 0.05)));
      float band = mix(asBand(float(i), wp.x), 0.7, 0.5 * smoothstep(1.0, 81.0, q2));
      c += vec3(0.5, 0.62, 0.8) * uFoot * (near + stripe * band) * clamp(dot(n, q) * 0.8 + 0.2, 0.0, 1.0) * smoothstep(0.1, 0.6, q.y);
    }
    // what falls through the slits the wings' masts travel in: a line of light under each pair, to either hand
    { float kz = clamp(floor((wp.z - WZ0 - 0.57) / WDZ + 0.5), 0.0, WN - 1.0), dz = wp.z - (WZ0 + 0.57 + WDZ * kz), dn = max(-1.1 - wp.y, 0.0), ax = abs(wp.x), w = 0.4 + 0.09 * dn;
      c += vec3(0.6, 0.64, 0.7) * uWing * 1.1 * exp(-dz * dz / (w * w)) / (1.0 + 0.1 * dn) * (0.35 + 0.65 * up) * smoothstep(9.0, 10.0, ax) * (1.0 - smoothstep(20.0, 21.0, ax)); }
    // (corners gather the dark: by the side walls, and at the foot of whatever stands)
    c *= (0.7 + 0.3 * smoothstep(0.0, 2.6, SW - abs(wp.x))) * (n.y > 0.5 ? 1.0 : 0.62 + 0.38 * smoothstep(CF, CF + 1.3, wp.y));
    c += asFloat(wp, n);
    lit += c * zn.x; spec += s * zn.x;
  }
  // THE STAGE: the footlights, the ladders of lamps behind the wings, a little of the house
  if (zn.y > 0.003) {
    float low = 1.0 - 0.72 * smoothstep(9.0, 20.0, wp.y);
    vec3 c = vec3(0.05, 0.056, 0.068) * (0.4 + up) * low, s = vec3(0.0);
    vec3 fq = vec3(clamp(wp.x, -PW + 0.5, PW - 0.5), 0.25, FOOT) - wp; float f2 = dot(fq, fq); fq /= sqrt(max(f2, 1e-3));
    float fk = uFoot * 17.0 / (f2 * 0.1 + 1.5 * sqrt(f2) + 5.0) * smoothstep(FOOT - 0.1, FOOT + 0.7, wp.z);
    c += uStage * fk * clamp(dot(n, fq) * 0.7 + 0.3, 0.0, 1.0); s += uStage * fk * pow(max(dot(R, fq), 0.0), sp);
    float k = clamp(floor((wp.z + 1.6 * n.z - WZ0 - 1.4) / WDZ + 0.5), 0.0, WN - 1.0), sg = wp.x < 0.0 ? -1.0 : 1.0;
    for (int i = 0; i < 2; i++) {
      float sd = i == 0 ? sg : -sg; vec3 lq = vec3(sd * (PW + 1.1), clamp(wp.y, 1.2, 8.2), WZ0 + 1.4 + WDZ * k) - wp; float l2 = dot(lq, lq); lq /= sqrt(max(l2, 1e-3));
      float lk = uWing * 7.0 / (l2 * 0.25 + 1.2 * sqrt(l2) + 3.0) * smoothstep(-10.0, 1.0, PW + 1.1 - sd * wp.x);
      c += uStage * lk * clamp(dot(n, lq) * 0.7 + 0.3, 0.0, 1.0); s += uStage * lk * pow(max(dot(R, lq), 0.0), sp);
    }
    float kb = clamp(floor((wp.z + 1.6 * n.z - WZ0 - 1.4) / WDZ + 0.5), 0.0, 4.0);
    vec3 hq = vec3(clamp(wp.x, -12.0, 12.0), 15.4, WZ0 + 2.35 + WDZ * kb) - wp; float h2 = dot(hq, hq); hq /= sqrt(max(h2, 1e-3));
    c += uStage * vec3(0.8, 0.9, 1.08) * uWing * 6.0 / (h2 * 0.12 + 1.0 * sqrt(h2) + 4.0) * clamp(dot(n, hq) * 0.6 + 0.4, 0.0, 1.0) * (0.5 + 0.5 * smoothstep(3.0, 9.0, wp.y));
    vec3 bq = vec3(clamp(wp.x, -13.0, 13.0), 0.3, ${u(m.BACK-.9)}) - wp; float b2 = dot(bq, bq); bq /= sqrt(max(b2, 1e-3));
    c += uStage * vec3(0.8, 0.9, 1.08) * uFoot * 16.0 / (b2 * 0.12 + 1.2 * sqrt(b2) + 4.0) * clamp(dot(n, bq) * 0.6 + 0.4, 0.0, 1.0) * smoothstep(${u(m.BACK-2.5)}, ${u(m.BACK-.5)}, wp.z);
    c += uStage * vec3(0.55, 0.7, 0.9) * uFoot * 0.65 * clamp(n.z * 0.6 + 0.4, 0.0, 1.0) * smoothstep(4.0, 30.0, wp.z) * low;
    c += uGold * uHouse * 0.05 * exp(-max(wp.z, 0.0) / 9.0) * clamp(-n.z * 0.6 + 0.4, 0.0, 1.0);
    // (the lamps along the fly galleries: each lights the wall and the gallery by it)
    { vec3 gq = vec3((wp.x < 0.0 ? -19.5 : 19.5), 13.75, clamp(5.0 + 4.4 * floor((wp.z - 5.0) / 4.4 + 0.5), 5.0, 35.8)) - wp; float g2 = dot(gq, gq); gq /= sqrt(max(g2, 1e-3));
      c += uCandle * uWing * 4.0 / (g2 + 4.0) * clamp(dot(n, gq) * 0.7 + 0.3, 0.0, 1.0); }
    // (the lamps behind the cloud machine's gilt sun light what faces it: the clouds about it, the sky's borders, the walls)
    { vec3 gq = uGlory.xyz - wp; float g2 = dot(gq, gq); gq /= sqrt(max(g2, 1e-3));
      c += vec3(1.0, 0.74, 0.4) * uGlory.w * 9.0 / (g2 + 14.0) * clamp(dot(n, gq) * 0.6 + 0.4, 0.0, 1.0); }
    // (a lantern hung in either corner by the proscenium's wall)
    { vec3 kq = vec3(wp.x < 0.0 ? -16.0 : 16.0, 5.2, 1.3) - wp; float k2 = dot(kq, kq); kq /= sqrt(max(k2, 1e-3));
      c += uCandle * uWing * 5.0 / (k2 + 5.0) * clamp(dot(n, kq) * 0.7 + 0.3, 0.0, 1.0); }
    c *= mix(vec3(1.0), vec3(1.22, 0.96, 0.72), uDrop);
    c += asFloat(wp, n);
    lit += c * zn.y; spec += s * zn.y;
  }
  // THE HOUSE: its chandeliers, the candles along its boxes, and the lit stage in its frame
  if (zn.z > 0.003) {
    // (by candlelight: the candles along the boxes light their fronts and die away into the boxes' depths and toward the ceiling;
    // each hoop lights what hangs near it; the lit stage glows on whatever faces it)
    float bd = asBoxDist(wp), hgt = 1.0 - 0.6 * smoothstep(12.5, 18.5, wp.y);
    vec3 c = uGold * uHouse * (0.03 + 0.035 * up) + uCandle * uHouse * 0.1 * exp(-abs(bd) / 1.7) * (0.55 + 0.45 * (1.0 - up)) * hgt, s = vec3(0.0);
    // (the candle on its bracket at each box: the nearest one lights its own bay, on its own tier)
    float flick = 1.0;
    { float m2 = 1e6, m2b = 1e6, mi = 0.0, mib = 0.0; vec2 mb = vec2(0.0);
      for (int i = 0; i < ${G}; i++) { vec2 q = uBox[i] - wp.xz; float q2 = dot(q, q); if (q2 < m2) { m2b = m2; mib = mi; m2 = q2; mb = q; mi = float(i); } else if (q2 < m2b) { m2b = q2; mib = float(i); } }
      float ty = TIER0 + 0.49 + TIERH * clamp(floor((wp.y - TIER0 - 0.49) / TIERH + 0.5), 0.0, 3.0);
      vec3 cq = vec3(mb.x, ty - wp.y, mb.y); float c2 = dot(cq, cq); cq /= sqrt(max(c2, 1e-3));
      float ck = uHouse * 1.0 / (c2 + 0.6) * (1.0 - smoothstep(9.0, 70.0, c2));
      // (each candle's light breathes with its own flame, softly, on the clock: no two alike, never the whole house at once; between
      // two candles and between two tiers the one breathing passes over into the other, so that no seam shows)
      float wb = 0.5 * smoothstep(0.25, 0.5, m2 / (m2 + m2b + 1e-4)), tf = clamp((wp.y - TIER0 - 0.49) / TIERH, 0.0, 3.0), ta = floor(tf), tb = min(ta + 1.0, 3.0), wt = smoothstep(0.3, 0.7, tf - ta);
      float pa = mi * 2.39996, pb = mib * 2.39996;
      flick = 1.0 + mix(mix(asFl(pa + ta * 5.7), asFl(pb + ta * 5.7), wb), mix(asFl(pa + tb * 5.7), asFl(pb + tb * 5.7), wb), wt); ck *= flick;
      c += uCandle * ck * clamp(dot(n, cq) * 0.7 + 0.3, 0.0, 1.0); s += uCandle * ck * (pow(max(dot(R, cq), 0.0), sp) + 0.25 * metal * pow(max(dot(R, cq), 0.0), 5.0)); }
    // (inside a box its candle's light hangs warm on the red walls)
    c += uCandle * uHouse * 0.3 * smoothstep(0.2, 1.4, -bd) * hgt * flick;
    // (the sconces along the wall under the first tier wash it warm)
    c += uCandle * uHouse * 0.3 * exp(-abs(bd) / 1.1) * (1.0 - smoothstep(TIER0 - 0.6, TIER0 - 0.1, wp.y)) * smoothstep(-1.4, -0.6, wp.y) * flick;
    for (int i = 0; i < ${F}; i++) {
      vec3 d = uCh[i].xyz - wp; float d2 = dot(d, d); d /= sqrt(max(d2, 1e-3)); float k = uHouse * uCh[i].w * 0.75 / (d2 + 20.0) * (0.5 + 0.5 * (1.0 - smoothstep(16.0, 260.0, d2)));
      c += uCandle * k * clamp(dot(n, d) * 0.7 + 0.3, 0.0, 1.0); s += uCandle * k * (pow(max(dot(R, d), 0.0), sp) + 0.25 * metal * pow(max(dot(R, d), 0.0), 5.0));
    }
    vec3 sq = vec3(clamp(wp.x, -6.0, 6.0), 5.0, 3.0) - wp; float s2 = dot(sq, sq); sq /= sqrt(max(s2, 1e-3));
    c += vec3(0.82, 0.8, 0.74) * uFoot * (130.0 / (s2 + 250.0) + 20.0 / (s2 + 40.0)) * clamp(dot(n, sq) * 0.75 + 0.25, 0.0, 1.0);
    // (the candles at the music desks in the pit light the forestage's front and the foot of the proscenium from below)
    { vec3 pq = vec3(clamp(wp.x, -8.0, 8.0), -1.0, -5.2) - wp; float p2 = dot(pq, pq); pq /= sqrt(max(p2, 1e-3));
      c += uCandle * uHouse * 2.4 / (p2 + 5.0) * clamp(dot(n, pq) * 0.7 + 0.3, 0.0, 1.0); }
    lit += c * zn.z; spec += s * zn.z;
  }
  vec3 col = alb * lit * (1.0 - 0.55 * metal);
  float nv = max(dot(n, V), 0.0), fr = pow(clamp(1.0 - nv, 0.0, 1.0), 5.0);
  vec3 f0 = mix(vec3(0.04), alb, metal), F = f0 + (1.0 - f0) * fr;
  // what a bright surface mirrors: the warm dark of its own room, brighter upward, and its lights
  vec3 env = (zn.x * vec3(0.02, 0.014, 0.01) + zn.y * vec3(0.05, 0.04, 0.03) * uFoot + zn.z * uGold * uHouse * 0.12) * (0.4 + 0.6 * smoothstep(-0.3, 0.8, R.y));
  col += F * gloss * env * (1.0 + 2.0 * metal) + (f0 + 0.1) * gloss * spec * 1.6;
  return col;
}
`,_=`
attribute vec4 surf;
varying vec3 vW, vN, vC, vO; varying vec4 vS;
void main(){
  vO = position; vS = surf; vC = color;
#ifdef USE_INSTANCING
  mat4 mm = modelMatrix * instanceMatrix;
#else
  mat4 mm = modelMatrix;
#endif
  vec4 w = mm * vec4(position, 1.0);
  float sw = 1.0 - surf.w;
  // (what hangs stirs on the clock: at most 0.12 m along x and along z, less by the share typed for the thing)
  if (sw > 0.0) { float ph = floor(w.z / 3.0 + 0.5) * 1.7 + floor(w.x / 4.0 + 0.5) * 0.9; w.xz += sw * 0.12 * vec2(sin(uTime * 0.83 + ph), cos(uTime * 0.61 + ph * 1.3)); }
  vW = w.xyz; vN = normalize(mat3(mm) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,D=`
varying vec3 vW, vN, vC, vO; varying vec4 vS;
void main(){
  vec3 n = normalize(vN);
#ifndef AS_NOFLIP
  if (!gl_FrontFacing) n = -n;
#endif
  vec3 V = normalize(cameraPosition - vW), base = vC;
  float id = floor(vS.x), gloss = clamp((fract(vS.x) - 0.02) / 0.95, 0.0, 1.0), metal = vS.y;
  vec3 em = vec3(0.0), alb = asDetail(id, vW, vO, V, base, n, gloss, em);
  vec3 col = asLight(vW, n, V, alb, gloss, metal) + em + alb * vS.z;
  gl_FragColor = vec4(asAir(col, vW), 1.0);
}
`,V=`
attribute vec4 surf; attribute vec4 aPh;
varying vec3 vW, vN, vC, vO; varying vec4 vS;
void main(){
  // aPh: his own phase; whether he walks; a number of his own (0 to 1); the steps he takes for each turn of uStep
  // aPh.y: 0 he stands, 1 he walks at a bar, 2 he turns a crank
  float part = floor((1.0 - surf.w) * 4.0 + 0.5), walk = (aPh.y > 0.5 && aPh.y < 1.5) ? 1.0 : 0.0, crank = aPh.y > 1.5 ? 1.0 : 0.0, ph = uStep * aPh.w + aPh.x, own = aPh.z;
  vec3 p = position, n = normal;
  // (two in five go bare-headed: the hat is drawn to nothing)
  if (part == 5.0 && fract(own * 11.3) < 0.4) p = vec3(0.0, 1.66, -0.02);
  float sgn = part == 1.0 ? 1.0 : (part == 2.0 ? -1.0 : 0.0);
  // the knee: the lower leg folds back while its leg swings forward
  float kb = 0.8 * max(0.0, sgn * cos(ph)) * walk * (1.0 - step(0.5, p.y));
  { float c = cos(kb), s = -sin(kb); vec3 q = p - vec3(0.0, 0.5, 0.0); p = vec3(q.x, 0.5 + q.y * c - q.z * s, q.y * s + q.z * c); n = vec3(n.x, n.y * c - n.z * s, n.y * s + n.z * c); }
  float a = sgn * (0.4 + 0.16 * own) * sin(ph) * walk;
  float c = cos(a), s = sin(a); vec3 q = p - vec3(0.0, 0.9, 0.0);
  p = vec3(q.x, 0.9 + q.y * c - q.z * s, q.y * s + q.z * c); n = vec3(n.x, n.y * c - n.z * s, n.y * s + n.z * c);
  p.y += 0.022 * abs(cos(ph)) * walk;
  // a man at a bar leans his whole length into it, each by his own measure: his hands stay on the bar, his feet trail, his head is down
  p.z -= ((p.y - 1.05) * (0.3 + 0.14 * fract(own * 3.7)) + max(p.y - 1.46, 0.0) * 0.5) * walk; p.y -= max(p.y - 1.46, 0.0) * 0.25 * walk;
  // a man at a crank: his hands go round with it (0.2 m), his back gives a little
  float cph = uTime * 1.6 + aPh.x, wA = part == 3.0 ? smoothstep(1.42, 1.08, p.y) : 0.0;
  p.y += 0.2 * sin(cph) * wA * crank; p.z += (0.2 * cos(cph) * wA + 0.05 * cos(cph) * smoothstep(0.9, 1.5, p.y)) * crank;
  // standing: a breath and a shift of weight, by the clock, at most 0.025 m at the head
  p.x += 0.012 * sin(uTime * 0.9 + aPh.x * 9.0) * (1.0 - walk) * p.y; p.z += 0.006 * sin(uTime * 1.4 + aPh.x * 5.0) * (1.0 - walk) * smoothstep(0.9, 1.5, p.y);
  vec4 w = modelMatrix * instanceMatrix * vec4(p, 1.0);
  vW = w.xyz; vO = w.xyz; vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * n);
  vC = color * mix(instanceColor * ((part == 1.0 || part == 2.0) ? mix(0.5, 0.95, fract(own * 5.3)) : 1.0), vec3(1.0), surf.y);
  // hair: powdered pale, grey, brown or dark, by his own number
  if (part == 4.0) { float hk = fract(own * 7.3), pw = aPh.w < -0.5 ? 0.16 : 0.06; vC = hk < pw ? vec3(0.4, 0.39, 0.37) : (hk < pw + 0.2 ? vec3(0.2, 0.17, 0.14) : (hk < 0.8 ? vec3(0.1, 0.07, 0.045) : vec3(0.035, 0.03, 0.028))); }
  // (some go in their shirts, without a waistcoat)
  if (part == 0.0 && surf.y < 0.5 && position.y > 0.95 && position.y < 1.6 && fract(own * 13.7) < 0.3) vC = vec3(0.4, 0.37, 0.31) * (0.8 + 0.3 * fract(own * 3.1));
  vS = vec4(surf.x, 0.0, 0.0, 1.0);
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,$=`
attribute vec3 aDir; attribute float aSide, aRun, aLen; uniform vec2 uRes; uniform float uPx; varying vec3 vW; varying float vA, vL, vR;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vL = aLen; vR = aRun;
  vec4 c0 = projectionMatrix * viewMatrix * w, c1 = projectionMatrix * viewMatrix * vec4(w.xyz + mat3(modelMatrix) * aDir, 1.0);
  vec2 d = (c1.xy / max(c1.w, 0.05) - c0.xy / max(c0.w, 0.05)) * uRes; float dl = length(d); d = dl > 1e-5 ? d / dl : vec2(1.0, 0.0);
  float wpx = 0.045 * uPx / max(c0.w, 0.1), px = max(wpx, 1.25); vA = clamp(wpx / 1.25, 0.3, 1.0);
  c0.xy += vec2(-d.y, d.x) * aSide * px / uRes * c0.w;
  gl_Position = c0;
}
`,j=`
uniform vec3 uRopeCol; varying vec3 vW; varying float vA, vL, vR;
void main(){
  // the rope's lay: a twist every 0.12 m, which runs along a hauled rope on the clock (0.5 m a second at the most; it moves no body)
  float fl = fwidth(vL), tw = 0.88 + 0.12 * mix(sin((vL - uTime * 0.5 * vR) * 52.36), 0.0, smoothstep(0.02, 0.07, fl));
  vec3 z = asZone(vW);
  vec3 lit = z.x * vec3(0.16, 0.11, 0.07) + z.y * vec3(0.3, 0.24, 0.17) * uFoot + z.z * uGold * uHouse * 0.4;
  gl_FragColor = vec4(asAir(uRopeCol * lit * tw, vW), vA);
}
`,K=`
attribute vec4 aAt; varying float vH; varying vec3 vW;
void main(){
  float ph = aAt.w * 40.0, h = position.y;
  vec3 p = position; p.y *= 1.0 + 0.14 * sin(uTime * 5.3 + ph) + 0.07 * sin(uTime * 11.0 + ph * 1.7);
  p.x += h * h * 1.8 * sin(uTime * 3.1 + ph * 0.7) * 0.6; p.z += h * h * 1.8 * cos(uTime * 2.3 + ph) * 0.5;
  vec4 w = modelMatrix * vec4(aAt.xyz + p, 1.0); vW = w.xyz; vH = clamp(h / 0.075, 0.0, 1.0);
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,U=`
varying float vH; varying vec3 vW;
void main(){
  vec3 c = mix(vec3(1.15, 0.78, 0.32), vec3(1.0, 0.42, 0.08), smoothstep(0.35, 1.0, vH)) * (0.85 + 0.15 * smoothstep(0.0, 0.25, vH));
  gl_FragColor = vec4(c, 1.0);
}
`,Y=`
attribute vec4 aAt; uniform float uPx; varying float vK;
void main(){
  vec4 mv = viewMatrix * modelMatrix * vec4(aAt.xyz, 1.0); gl_Position = projectionMatrix * mv; float d = max(-mv.z, 0.1);
  float px = 0.6 * uPx / d; gl_PointSize = clamp(px, 3.0, 90.0);
  vK = (0.8 + 0.2 * sin(uTime * 2.7 + aAt.w * 40.0)) * min(1.0, px / 3.0) * exp(-d * 0.006);
}
`,X="varying float vK; void main(){ float d = length(gl_PointCoord - 0.5) * 2.0, a = 1.0 - smoothstep(0.0, 1.0, d); gl_FragColor = vec4(vec3(1.0, 0.58, 0.22) * 0.2 * a * a * vK, 1.0); }",J=`
attribute vec4 aSeed; uniform float uPx; varying vec3 vCol;
void main(){
  vec3 p = position + 0.3 * vec3(sin(uTime * 0.11 + aSeed.x * 40.0), sin(uTime * 0.09 + aSeed.y * 23.0), cos(uTime * 0.1 + aSeed.z * 31.0));
  vec4 mv = viewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv; float d = max(-mv.z, 0.1);
  float px = (0.015 + 0.02 * aSeed.w) * uPx / d, fill = min(1.0, px / 1.5); gl_PointSize = max(px, 1.5);
  float k = 0.0; for (int i = 0; i < ${M}; i++) { vec3 q = uLan[i].xyz - p; k += uLan[i].w / (dot(q, q) + 2.5); }
  vCol = uCandle * min(k, 1.2) * 0.2 * fill * fill * (0.6 + 1.2 * aSeed.w);
}
`,Q="varying vec3 vCol; void main(){ float d = length(gl_PointCoord - 0.5) * 2.0; gl_FragColor = vec4(vCol * (1.0 - smoothstep(0.2, 1.0, d)), 1.0); }",e0="varying vec3 vW, vO; void main(){ vO = position; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",t0=`
varying vec3 vW, vO;
void main(){
  float r = length(vO.xy), a = atan(vO.y, vO.x);
  float rays = (0.5 + 0.5 * sin(a * 16.0 + mod(uTime * 0.07, 6.2831853))) * (0.6 + 0.4 * sin(a * 7.0 - mod(uTime * 0.05, 6.2831853)));
  float k = (0.5 * exp(-r * r / 14.0) + 0.5 * rays * exp(-r / 4.2) * smoothstep(0.6, 2.5, r)) * (1.0 - smoothstep(7.5, 9.0, r));
  float L = length(vW - cameraPosition);
  gl_FragColor = vec4(vec3(1.0, 0.7, 0.3) * 0.55 * k * smoothstep(0.4, 3.2, L), 1.0);
}
`,O="varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",o0=`
varying vec3 vW;
void main(){
  float zi = vW.z < SZ0 + 3.5 * SDZ ? (vW.z - SZ0) / SDZ : (vW.z - SZ0 - SGAP) / SDZ, fi = floor(zi + 0.5), dn = -1.1 - vW.y;
  float band = mix(asBand(fi, vW.x), 0.7, 0.3 * smoothstep(0.0, 9.0, dn)); band *= band;
  float fall = exp(-dn * 0.24) * smoothstep(-0.2, 0.3, dn);
  float dust = 0.55 + 0.9 * asNoise(vec3(vW.x * 0.9, vW.y * 0.7 + uTime * 0.05, fi * 3.0 + uTime * 0.02));
  float ends = 1.0 - smoothstep(SL - 1.2, SL + 0.4, abs(vW.x)), L = length(vW - cameraPosition);
  gl_FragColor = vec4(vec3(0.5, 0.62, 0.8) * 0.06 * uFoot * band * fall * dust * ends * smoothstep(0.4, 3.2, L), 1.0);
}
`,s0=`
varying vec3 vW;
void main(){
  float top = smoothstep(CF, -0.6, vW.y), ex = smoothstep(TRAP.x - 0.3, TRAP.x + 1.6, vW.x) * (1.0 - smoothstep(TRAP.y - 1.6, TRAP.y + 0.3, vW.x));
  float ez = sin(3.14159 * clamp((vW.z - TRAP.z) / (TRAP.w - TRAP.z), 0.0, 1.0));
  float dust = 0.5 + 1.0 * asNoise(vec3(vW.x * 0.6, vW.y * 0.45 + uTime * 0.04, vW.z * 0.8 + uTime * 0.015));
  float L = length(vW - cameraPosition);
  gl_FragColor = vec4(vec3(0.55, 0.66, 0.8) * 0.03 * uFoot * uOpen * (0.3 + 0.7 * top) * ex * (0.4 + 0.6 * ez) * dust * smoothstep(0.4, 3.2, L), 1.0);
}
`,a0=`
varying vec3 vW;
void main(){
  float dn = -1.1 - vW.y, ax = abs(vW.x), fall = exp(-dn * 0.22) * smoothstep(-0.2, 0.3, dn);
  float dust = 0.5 + 1.0 * asNoise(vec3(vW.x * 0.8, vW.y * 0.6 + uTime * 0.045, vW.z * 0.7 + uTime * 0.02));
  float ends = smoothstep(9.4, 10.6, ax) * (1.0 - smoothstep(19.4, 20.8, ax)), L = length(vW - cameraPosition);
  gl_FragColor = vec4(vec3(0.6, 0.64, 0.7) * 0.05 * uWing * fall * dust * ends * smoothstep(0.4, 3.2, L), 1.0);
}
`;function c0(){const e={uTime:{value:0},uDrop:{value:0},uLift:{value:-9.7},uOpen:{value:1},uFoot:{value:1},uWing:{value:1},uHouse:{value:1},uDust:{value:1},uLan:{value:Array.from({length:M},()=>new i.Vector4(0,-50,0,0))},uBox:{value:Array.from({length:G},()=>new i.Vector2(0,99))},uCh:{value:Array.from({length:F},()=>new i.Vector4(0,50,0,0))},uGlory:{value:new i.Vector4(0,40,0,1)},uCandle:{value:I("#ffcf9c",1)},uGold:{value:I("#f2c986",1)},uStage:{value:I("#fff0dc",1)},uRes:{value:new i.Vector2(1920,1080)},uPx:{value:900},uStep:{value:0},uRopeCol:{value:I("#b39a6c")}},t=new Map,l=(d,w)=>(t.has(d)||t.set(d,w()),t.get(d)),p=P+B;return{uniforms:e,surface:(d={})=>l("s"+(d.side??i.FrontSide),()=>new i.ShaderMaterial({uniforms:e,vertexColors:!0,side:d.side??i.FrontSide,vertexShader:P+_,fragmentShader:p+Z+D})),figure:()=>l("fig",()=>new i.ShaderMaterial({uniforms:e,vertexColors:!0,side:i.DoubleSide,defines:{AS_NOFLIP:1},vertexShader:P+V,fragmentShader:p+Z+D})),rope:()=>l("rope",()=>new i.ShaderMaterial({uniforms:e,side:i.DoubleSide,transparent:!0,depthWrite:!1,vertexShader:P+$,fragmentShader:p+j})),flame:()=>l("flame",()=>new i.ShaderMaterial({uniforms:e,side:i.DoubleSide,vertexShader:P+K,fragmentShader:U})),halo:()=>l("halo",()=>new i.ShaderMaterial({uniforms:e,transparent:!0,depthWrite:!1,blending:i.AdditiveBlending,vertexShader:P+Y,fragmentShader:X})),motes:()=>l("motes",()=>new i.ShaderMaterial({uniforms:e,transparent:!0,depthWrite:!1,blending:i.AdditiveBlending,vertexShader:P+J,fragmentShader:Q})),veil:()=>l("veil",()=>new i.ShaderMaterial({uniforms:e,side:i.DoubleSide,transparent:!0,depthWrite:!1,blending:i.AdditiveBlending,vertexShader:O,fragmentShader:p+o0})),shaft:()=>l("shaft",()=>new i.ShaderMaterial({uniforms:e,side:i.DoubleSide,transparent:!0,depthWrite:!1,blending:i.AdditiveBlending,vertexShader:O,fragmentShader:p+s0})),slit:()=>l("slit",()=>new i.ShaderMaterial({uniforms:e,side:i.DoubleSide,transparent:!0,depthWrite:!1,blending:i.AdditiveBlending,vertexShader:O,fragmentShader:p+a0})),glow:()=>l("glow",()=>new i.ShaderMaterial({uniforms:e,side:i.FrontSide,transparent:!0,depthWrite:!1,blending:i.AdditiveBlending,vertexShader:P+e0,fragmentShader:P+t0})),dispose(){for(const d of t.values())d.dispose()}}}const L={OAK:"#7d664b",PINE:"#b0915f",DARK:"#4c3c2d",IRON:"#2a2c30",BRICK:"#8a6450",GOLD:"#d8a23c",CREAM:"#ddd3bd",CELADON:"#a7beb4",RED:"#6a1420",SKIN:"#b08a6a",CANVAS:"#8d7c62",ROPE:"#b39a6c"};function p0(){const e=H.makeBuilder(),t="#ffffff",l="#a89e88",p="#8c8474",r=(o,s,c,x,f,v,d=9,w=1)=>{R.set(o[0],o[1],o[2]),W.set(s[0],s[1],s[2]),A.subVectors(W,R);const g=A.length();A.multiplyScalar(1/g),z.set(1,0,0),N.crossVectors(z,A).normalize(),z.crossVectors(A,N),T.makeBasis(z,A,N.multiplyScalar(w)),T.setPosition((o[0]+s[0])/2,(o[1]+s[1])/2,(o[2]+s[2])/2),e.add(new i.CylinderGeometry(x,c,g,d,1,!0),{m:T,c:f,surf:v})},n=(o,s)=>{r([o*.095,.92,0],[o*.1,.5,-.01],.1,.066,t,y(b.PLAIN,.12,0,0,s),10),r([o*.1,.5,-.01],[o*.1,.34,.012],.058,.066,p,y(b.PLAIN,.12,1,0,s),10),r([o*.1,.34,.012],[o*.1,.08,.01],.066,.04,p,y(b.PLAIN,.12,1,0,s),10),e.add(new i.SphereGeometry(1,8,5),{p:[o*.1,.045,-.045],s:[.055,.045,.135],c:"#1c1a18",surf:y(b.PLAIN,.3,1,0,s)})};n(-1,.25),n(1,.5),e.add(new i.SphereGeometry(1,9,5),{p:[0,.94,0],s:[.185,.14,.125],c:t,surf:y(b.PLAIN,.12)}),r([0,.99,0],[0,.79,0],.168,.2,t,y(b.PLAIN,.12),14,.72),r([0,.96,0],[0,1.2,-.01],.16,.185,t,y(b.PLAIN,.12),14,.68),r([0,1.2,-.01],[0,1.43,-.015],.185,.2,t,y(b.PLAIN,.12),14,.62),e.add(new i.SphereGeometry(1,9,4),{p:[0,1.43,-.015],s:[.215,.07,.115],c:l,surf:y(b.PLAIN,.12,1)});const h=y(b.PLAIN,.12,1,0,.75),a=y(b.PLAIN,.2,1,0,.75);for(const o of[-1,1])r([o*.215,1.41,-.01],[o*.26,1.17,-.1],.066,.056,l,h),r([o*.26,1.17,-.1],[o*.2,1.07,-.3],.047,.04,L.SKIN,a),e.add(new i.SphereGeometry(.048,6,4),{p:[o*.2,1.055,-.32],c:L.SKIN,surf:a});return r([0,1.45,-.015],[0,1.54,-.02],.055,.05,L.SKIN,y(b.PLAIN,.2,1),6),e.add(new i.SphereGeometry(1,12,9),{p:[0,1.62,-.025],s:[.094,.112,.104],c:L.SKIN,surf:y(b.PLAIN,.2,1)}),e.add(new i.SphereGeometry(1,9,5,0,k,0,Math.PI*.56),{p:[0,1.645,-.01],s:[.104,.1,.116],c:t,surf:y(b.PLAIN,.15,1,0,1)}),r([0,1.6,.095],[0,1.44,.12],.03,.016,t,y(b.PLAIN,.15,1,0,1),5),e.add(new i.SphereGeometry(1,10,5,0,k,0,Math.PI*.5),{p:[0,1.7,-.02],s:[.105,.075,.115],c:"#6a6660",surf:y(b.PLAIN,.1,0,0,1.25)}),e.add(new i.CylinderGeometry(.165,.165,.014,12),{p:[0,1.703,-.025],c:"#6a6660",surf:y(b.PLAIN,.1,0,0,1.25)}),e.build()}function h0(e=0){const t=H.makeBuilder(),l="#ffffff";t.add(new i.SphereGeometry(1,7,4),{p:[0,.07,-.2],s:[e?.3:.2,.1,.27],c:l,surf:y(b.PLAIN,.12,0,0,.25)}),t.add(new i.CylinderGeometry(.165,e?.2:.185,.3,8,1,!0),{p:[0,.22,0],c:l,surf:y(b.PLAIN,.12)}),t.add(new i.CylinderGeometry(e?.15:.19,.165,.2,8,1,!0),{p:[0,.47,0],c:l,surf:y(b.PLAIN,.12)}),t.add(new i.SphereGeometry(1,8,4),{p:[0,.56,0],s:[e?.2:.255,.075,.13],c:l,surf:y(b.PLAIN,.12)});for(const p of[-1,1])t.add(new i.CylinderGeometry(.045,.055,.36,6,1,!0),{p:[p*(e?.2:.235),.4,-.06],r:[.45,0,p*.12],c:l,surf:y(b.PLAIN,.12)});return t.add(new i.SphereGeometry(1,7,3),{p:[0,.585,-.04],s:[e?.13:.075,.035,.085],c:e?L.SKIN:"#d8d0c0",surf:y(b.PLAIN,.15,1)}),t.add(new i.CylinderGeometry(.042,.05,.1,6,1,!0),{p:[0,.63,-.005],c:L.SKIN,surf:y(b.PLAIN,.2,1)}),t.add(new i.SphereGeometry(1,8,6),{p:[0,.735,-.012],s:[.078,.098,.088],c:"#9a7a60",surf:y(b.PLAIN,.2,1)}),e?t.add(new i.SphereGeometry(1,8,5),{p:[0,.82,.03],s:[.115,.13,.12],c:l,surf:y(b.PLAIN,.12,1,0,1)}):(t.add(new i.SphereGeometry(1,8,4,0,k,0,Math.PI*.58),{p:[0,.762,.008],s:[.104,.1,.116],c:l,surf:y(b.PLAIN,.12,1,0,1)}),t.add(new i.CylinderGeometry(.03,.016,.16,5,1,!0),{p:[0,.65,.105],c:l,surf:y(b.PLAIN,.12,1,0,1)})),t.build()}function f0(e){const t=[],l=[],p=[],r=[],n=[],h=[];for(const o of e){const s=t.length/3,c=o.run||0;let x=0;for(let f=0;f<o.length;f++){const v=o[Math.max(0,f-1)],d=o[Math.min(o.length-1,f+1)],w=d[0]-v[0],g=d[1]-v[1],S=d[2]-v[2],C=Math.hypot(w,g,S)||1;f>0&&(x+=Math.hypot(o[f][0]-o[f-1][0],o[f][1]-o[f-1][1],o[f][2]-o[f-1][2]));for(const q of[-1,1])t.push(o[f][0],o[f][1],o[f][2]),l.push(w/C,g/C,S/C),p.push(q),r.push(c),n.push(x);if(f<o.length-1){const q=s+f*2;h.push(q,q+1,q+2,q+1,q+3,q+2)}}}const a=new i.BufferGeometry;return a.setAttribute("position",new i.Float32BufferAttribute(t,3)),a.setAttribute("aDir",new i.Float32BufferAttribute(l,3)),a.setAttribute("aSide",new i.Float32BufferAttribute(p,1)),a.setAttribute("aRun",new i.Float32BufferAttribute(r,1)),a.setAttribute("aLen",new i.Float32BufferAttribute(n,1)),a.setIndex(h),a.computeBoundingSphere(),a}function m0(e,t,l=0,p=8,r=0){const n=[];for(let h=0;h<=p;h++){const a=h/p;n.push([e[0]+(t[0]-e[0])*a,e[1]+(t[1]-e[1])*a-l*4*a*(1-a),e[2]+(t[2]-e[2])*a])}return n.run=r,n}function v0(e,t,l,p=3.6,r=96,n=16){const h=[],a=[],o=[],s=(v,d)=>{const w=((d/k+v/(2*e)*p)%1+1)%1,g=Math.abs(w-.5)*2;return t+l*Math.pow(Math.max(0,(g-.35)/.65),1.6)},c=(v,d)=>{const w=-e+2*e*v/r,g=d/n*k,S=s(w,g);return[w,Math.sin(g)*S,Math.cos(g)*S]};for(let v=0;v<=r;v++)for(let d=0;d<=n;d++){const w=c(v,d),g=c(v+.05,d),S=c(v,d+.05);R.set(g[0]-w[0],g[1]-w[1],g[2]-w[2]),W.set(S[0]-w[0],S[1]-w[1],S[2]-w[2]),z.crossVectors(W,R).normalize(),z.y*Math.sin(d/n*k)+z.z*Math.cos(d/n*k)<0&&z.negate(),h.push(w[0],w[1],w[2]),a.push(z.x,z.y,z.z)}const x=n+1;for(let v=0;v<r;v++)for(let d=0;d<n;d++){const w=v*x+d,g=w+1,S=w+x+1,C=w+x;o.push(w,S,g,w,C,S)}const f=new i.BufferGeometry;return f.setAttribute("position",new i.Float32BufferAttribute(h,3)),f.setAttribute("normal",new i.Float32BufferAttribute(a,3)),f.setIndex(o),f}function d0(){const e=new i.BufferGeometry,t=.016,l=[],p=[];for(let r=0;r<4;r++){const n=r/4*k;l.push(Math.cos(n)*t,.024,Math.sin(n)*t)}l.push(0,0,0,0,.075,0);for(let r=0;r<4;r++){const n=(r+1)%4;p.push(r,n,5,n,r,4)}return e.setAttribute("position",new i.Float32BufferAttribute(l,3)),e.setIndex(p),e}const E=(e,t,l=-1)=>{const p=new i.BufferGeometry,r=[];for(let n=0;n<e.length/3;n++)r.push(0,0,l);{let n=0,h=0;for(;n<t.length&&Math.abs(h)<1e-9;){const a=t[n]*3,o=t[n+1]*3,s=t[n+2]*3;h=(e[o]-e[a])*(e[s+1]-e[a+1])-(e[o+1]-e[a+1])*(e[s]-e[a]),n+=3}if(h*l<0)for(let a=0;a<t.length;a+=3){const o=t[a+1];t[a+1]=t[a+2],t[a+2]=o}}return p.setAttribute("position",new i.Float32BufferAttribute(e,3)),p.setAttribute("normal",new i.Float32BufferAttribute(r,3)),p.setIndex(t),p};function x0(e,t=-1){let l=0,p=0;for(const a of e)l+=a[0],p+=a[1];l/=e.length,p/=e.length;const r=[l,p,0],n=[],h=e.length;for(const a of e)r.push(a[0],a[1],0);for(let a=0;a<h;a++)n.push(0,1+(a+1)%h,1+a);return E(r,n,t)}function u0(e,t,l,p=9,r=72){const n=l()*k,h=.1+.08*l(),a=[];for(let o=0;o<r;o++){const s=-o/r*k,c=1+h*Math.abs(Math.sin(s*p/2+n))+.07*Math.sin(s*3+n*2),x=Math.sin(s)<0?.62:1;a.push([Math.cos(s)*e/2*c,Math.sin(s)*t/2*c*x])}return a}function w0(e,t,l,p,r,n,h=96,a=-1){const o=[],s=[],c=n()*k,x=r?1:-1;for(let f=0;f<=h;f++){const v=-e/2+e*f/h,d=f/h*p*Math.PI+c,w=r?t-l+l*Math.pow(Math.abs(Math.sin(d)),.7)*(.7+.3*Math.sin(d*.37+1)):t-l+l*Math.abs(Math.sin(d))*(.75+.25*Math.sin(d*.31+c));o.push(v,0,0,v,x*w,0)}for(let f=0;f<h;f++){const v=f*2;s.push(v,v+1,v+2,v+1,v+3,v+2)}return E(o,s,a)}function b0(){const e=[],t=[],r=s=>.03+.17*Math.pow(Math.sin(Math.PI*Math.pow(Math.min(1,Math.max(0,(s-.06)/.9)),.8)),.8),n=(s,c)=>{const x=-.68+1.36*s;return[Math.sin(x)*c,Math.cos(x)*c]};for(let s=0;s<=22;s++){const c=s/22,x=r(c),f=n(c,1+x),v=n(c,1-x*.85);e.push(f[0],f[1],0,v[0],v[1],0)}for(let s=0;s<22;s++){const c=s*2;t.push(c,c+1,c+2,c+1,c+3,c+2)}const h=(s,c,x)=>{const f=e.length/3;e.push(s[0],s[1],0,c[0],c[1],0,x[0],x[1],0),t.push(f,f+1,f+2)};h(n(.4,1+r(.4)-.02),n(.56,1+r(.56)-.02),n(.36,1+r(.4)+.2)),h(n(.03,1),n(-.1,1+.2),n(-.04,1)),h(n(.03,1),n(-.04,1),n(-.1,1-.2)),h(n(.985,1+.045),n(.985,1-.04),n(1.07,1-.03));for(let s=0;s<t.length;s+=3){const c=t[s]*3,x=t[s+1]*3,f=t[s+2]*3;if((e[x]-e[c])*(e[f+1]-e[c+1])-(e[x+1]-e[c+1])*(e[f]-e[c])>0){const v=t[s+1];t[s+1]=t[s+2],t[s+2]=v}}const a=new i.BufferGeometry,o=[];for(let s=0;s<e.length/3;s++)o.push(0,0,-1);return a.setAttribute("position",new i.Float32BufferAttribute(e,3)),a.setAttribute("normal",new i.Float32BufferAttribute(o,3)),a.setIndex(t),a}function y0(e,t,l,p,r,n=-1,h=28){const a=[],o=[];for(let s=0;s<=h;s++){const c=t*s/h,x=s/h,f=e/2-p*(1.5*x*x+.55*Math.abs(Math.sin(x*9+r))+.3*Math.sin(x*23+r*2)*x+.2);a.push(l*e/2,c,0,-l*(p>0?f:e/2),c,0)}for(let s=0;s<h;s++){const c=s*2;o.push(c,c+1,c+2,c+1,c+3,c+2)}return E(a,o,n)}function g0(e=.42){const t=[],l=[],r=a=>{const o=a/3.2,s=e*Math.pow(Math.max(0,1-Math.pow(Math.abs(o),3.2)),.6)+.02,c=.55*o*o*(o>0?1.15:.7),x=1.25+.5*o*o+(o<-.55?.75:0)+(o>.7?.3:0);return[[-s,x],[-s*.96,c+.5],[-s*.6,c+.12],[0,c],[s*.6,c+.12],[s*.96,c+.5],[s,x]]};for(let a=0;a<=18;a++){const o=-3.2+6.4*a/18,s=r(o);for(const c of s)t.push(o,c[1],c[0])}for(let a=0;a<18;a++)for(let o=0;o<6;o++){const s=a*7+o,c=s+7;l.push(s,s+1,c,s+1,c+1,c)}const n=t.length/3;for(let a=0;a<=18;a++){const o=-3.2+6.4*a/18,s=r(o);t.push(o,s[0][1]-.12,s[0][0],o,s[6][1]-.12,s[6][0])}for(let a=0;a<18;a++){const o=n+a*2;l.push(o,o+2,o+1,o+1,o+2,o+3)}const h=new i.BufferGeometry;return h.setAttribute("position",new i.Float32BufferAttribute(t,3)),h.setIndex(l),h.computeVertexNormals(),h}function z0(e,t,l){const p=new i.PlaneGeometry(e,t,6,5),r=p.attributes.position;for(let n=0;n<r.count;n++){const h=r.getX(n)/(e/2),a=r.getY(n)/(t/2);r.setZ(n,l*(1-h*h)*(1-.6*a*a)),r.setY(n,r.getY(n)-t/2)}return p.rotateY(Math.PI/2),p.computeVertexNormals(),p}function S0(e,t,l,p,r,n,h,a=0){const o=new i.TorusGeometry(t,l*.5,6,20);e.add(o,{p:r,r:[0,a,0],c:n,surf:h});for(let s=0;s<p;s++){const c=s/p*Math.PI;e.add(new i.BoxGeometry(2*t,l*.5,l*.5),{p:r,r:[0,a,c],c:n,surf:h})}}export{G as NBOX,F as NCH,M as NLAN,l0 as SHIPZ,b as SID,m as TH,L as TONE,h0 as bustGeometry,u0 as cloudOutline,x0 as cutGeometry,b0 as dolphinGeometry,p0 as figureGeometry,d0 as flameGeometry,m0 as hang,g0 as hullGeometry,c0 as makeStageLight,v0 as rollerGeometry,f0 as ropeGeometry,z0 as sailGeometry,w0 as sawnStrip,n0 as seaY,i0 as seaZ,y as sf,r0 as strut,S0 as wheelInto,y0 as wingGeometry};
