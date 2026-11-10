import*as C from"three";const Me=["#24160E","#6E4424","#F3E9D2","#2FA58A","#3E7B3C","#D8A12C","#B5245C"],j=32,z=16,H=52,A=76,W=480,X=40,oe=12,ae=20,Q=28,D=z+Q,he=[-120,-320,-400],we=[5,8],ne=[4,10],Ge=Math.hypot(j,A-H),xe=23.95,ge=9.4,ee=[0,24.5,-556,13],de=22,F={vine:0,star:1,hibiscus:2,louvre:3,diamond:4,slat:5,sunburst:6,lozenge:7,gate:8},O={timber:0,boards:1,pierced:2,relief:3,tiles:4,gilt:5,paint:6,iron:7},_=(t,v,d)=>new C.Vector3(t,v,d),re=(t,v,d)=>{const m=Math.min(1,Math.max(0,(d-t)/(v-t)));return m*m*(3-2*m)};class Pe{constructor(){this.p=[],this.n=[],this.c=[],this.uv=[],this.m=[],this.count=0}quad(v,d,m,M,l,a,i,y,h,n,o){const x=this.p,p=this.n,u=this.c,L=this.uv,P=this.m,w=[v,d,m,v,m,M],V=[i,y,h,i,h,n];for(let e=0;e<6;e++){x.push(w[e][0],w[e][1],w[e][2]),p.push(l[0],l[1],l[2]);const r=Array.isArray(a[0])?a[e===0||e===3?0:e===1?1:e===2||e===4?2:3]:a;u.push(r[0],r[1],r[2]),L.push(V[e][0],V[e][1]),P.push(o[0],o[1],o[2],o[3])}this.count+=2}panel(v,d,m,M,l,a,i,y=[0,0]){const h=v,n=[v[0]+d[0]*M,v[1]+d[1]*M,v[2]+d[2]*M],o=[n[0]+m[0]*l,n[1]+m[1]*l,n[2]+m[2]*l],x=[v[0]+m[0]*l,v[1]+m[1]*l,v[2]+m[2]*l],p=[d[1]*m[2]-d[2]*m[1],d[2]*m[0]-d[0]*m[2],d[0]*m[1]-d[1]*m[0]];this.quad(h,n,o,x,p,a,y,[y[0]+M,y[1]],[y[0]+M,y[1]+l],[y[0],y[1]+l],i)}beam(v,d,m,M,l,a,i,y=.12,h=!0){const n=[d[0]-v[0],d[1]-v[1],d[2]-v[2]],o=Math.hypot(n[0],n[1],n[2])||1;n[0]/=o,n[1]/=o,n[2]/=o;let x=n[1]*l[2]-n[2]*l[1],p=n[2]*l[0]-n[0]*l[2],u=n[0]*l[1]-n[1]*l[0];const L=Math.hypot(x,p,u)||1;x/=L,p/=L,u/=L;const P=p*n[2]-u*n[1],w=u*n[0]-x*n[2],V=x*n[1]-p*n[0],e=m/2,r=M/2,N=Math.min(y,e*.45,r*.45),g=N>0?[[-e+N,-r],[e-N,-r],[e,-r+N],[e,r-N],[e-N,r],[-e+N,r],[-e,r-N],[-e,-r+N]]:[[-e,-r],[e,-r],[e,r],[-e,r]],k=(f,T)=>{const q=T?d:v;return[q[0]+x*f[0]+P*f[1],q[1]+p*f[0]+w*f[1],q[2]+u*f[0]+V*f[1]]};let s=0;const S=g.length;for(let f=0;f<S;f++){const T=g[f],q=g[(f+1)%S],b=q[0]-T[0],B=q[1]-T[1],I=Math.hypot(b,B)||1,G=B/I,Y=-b/I,K=[x*G+P*Y,p*G+w*Y,u*G+V*Y];this.quad(k(T,0),k(T,1),k(q,1),k(q,0),K,a,[0,s],[o,s],[o,s+I],[0,s+I],i),s+=I}if(h)for(let f=0;f<2;f++){const T=f?n:[-n[0],-n[1],-n[2]],q=[i[0],i[1],i[2],i[3]+7.3];for(let b=1;b+1<S;b+=2){const B=[g[0],g[b],g[b+1],g[(b+2)%S]],I=B.map(Y=>k(Y,f)),G=B.map(Y=>[Y[0]+40,Y[1]+40]);f?this.quad(I[3],I[2],I[1],I[0],T,a,G[3],G[2],G[1],G[0],q):this.quad(I[0],I[1],I[2],I[3],T,a,G[0],G[1],G[2],G[3],q)}}}geometry(){const v=new C.BufferGeometry;return v.setAttribute("position",new C.Float32BufferAttribute(this.p,3)),v.setAttribute("normal",new C.Float32BufferAttribute(this.n,3)),v.setAttribute("color",new C.Float32BufferAttribute(this.c,3)),v.setAttribute("aUV",new C.Float32BufferAttribute(this.uv,2)),v.setAttribute("aMat",new C.Float32BufferAttribute(this.m,4)),v.computeBoundingSphere(),v.computeBoundingBox(),v}}const be=`
#define GATE_UV_Y ${(xe-z).toFixed(2)}
#define GATE_RR ${ge.toFixed(2)}
uniform vec3 uSun;          // unit vector toward the sun (x < 0, y > 0, z > 0)
uniform vec3 uSunCol;       // sun colour x intensity inside the hall
uniform vec3 uOutSun;       // sun colour x intensity on outside surfaces
uniform vec3 uAmbDark;      // what a shut bay has
uniform vec3 uBounce;       // amber bounce off a lit floor
uniform vec3 uJade;         // light off the sea through the right wall
uniform vec3 uSkyIn;        // sky light through the left openings
uniform vec3 uOutAmb;       // shade outside (verandah, right wall, under the eaves)
uniform vec3 uUnder;        // under the house
uniform vec4 uBayL[13];     // per bay, left wall: pattern, reveal mode, seed, open (index 0 = the front door)
uniform float uOpenR[13];   // per bay, right wall: open
uniform float uOpenRoof[13];// per bay, roof flaps: open (only the flap bays ever rise)
uniform vec4 uHos;          // time, sheen, door open, end wall open
uniform vec4 uGate;         // the portal beyond the end wall: centre y, z, radius; w = radius of the moon gate that frames it
uniform vec3 uPortalCol;    // the portal's light (colour x strength)
uniform vec4 uScr;          // xyz: how far the three cross screens have folded (0..1): what stands between a board and the gate; w: bounce filling the boards of an opened bay
uniform vec4 uLook2;        // sun kept on upright timber indoors, bounce reaching the roof, jade reaching the roof, daylight through the gate
float hosWallK = 1.;         // set to uLook2.x by the timber shaders: only the boards take the full sun
float hosSoft = 0.;          // 1 = replace the carving by its average opening (the shafts use this)
float hosExtT = 1.;          // the world's own shadow term (set before hosShade)
float hosHash(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float hosNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hosHash(i), hosHash(i + vec2(1., 0.)), f.x), mix(hosHash(i + vec2(0., 1.)), hosHash(i + vec2(1., 1.)), f.x), f.y); }
float hosAtan(float y, float x){ return atan(y, (abs(x) < 1e-5 && abs(y) < 1e-5) ? 1e-5 : x); }
// Carving. q in metres on the panel; returns a signed size in metres, > 0 inside a hole.
float pierce(vec2 q, float type, float seed){
  float h;
  if (type < .5) {                       // vine scroll: warped leaf-shaped cuts
    vec2 a = q * 1.57 + seed;
    vec2 w = a + .95 * vec2(sin(a.y * 1. + seed), sin(a.x * 1. - seed * 1.7));
    float f = cos(w.x) * cos(w.y);
    h = (abs(f) - .68) * .7;
    h = max(h, .16 - length(fract(a / 3.1416 + .5) - .5) * 2.);     // a bud where four leaves meet
  } else if (type < 1.5) {               // eight-pointed stars and dots
    vec2 c = (fract(q / 3.2) - .5) * 3.2;
    float th = hosAtan(c.y, c.x), r = length(c);
    h = .62 + .3 * cos(8. * th) - r;
    vec2 d = abs(c) - 1.6; h = max(h, .3 - length(d));
  } else if (type < 2.5) {               // hibiscus rosettes, rows staggered
    vec2 g = q / 4.4; g.x += .5 * floor(g.y);
    vec2 c = (fract(g) - .5) * 4.4;
    float th = hosAtan(c.y, c.x), r = length(c);
    h = min(.5 + .95 * abs(cos(2.5 * th + seed)) - r, r - .34);
    vec2 d = abs(c) - 2.2; h = max(h, .26 - length(d));
  } else if (type < 3.5) {               // louvre: horizontal slits
    h = .27 - abs(fract(q.y / 1.5) - .5) * 1.5;
    h = min(h, abs(fract(q.x / 10. ) - .5) * 10. - .45);
  } else if (type < 4.5) {               // diamond lattice
    float d1 = abs(fract((q.x + q.y) / 2.6) - .5) * 2.6, d2 = abs(fract((q.x - q.y) / 2.6) - .5) * 2.6;
    h = (min(d1, d2) - .62) * .7;
  } else if (type < 5.5) {               // slatted grille: tall slots between rails
    h = .3 - abs(fract(q.x / 2.6) - .5) * 2.6;
    h = min(h, abs(fract(q.y / 7.) - .5) * 7. - .5);
  } else if (type < 6.5) {               // sunburst: rays from the foot of the doorway
    vec2 c = vec2(mod(q.x, 22.) - 11., q.y + .5);
    float th = hosAtan(c.y, c.x), r = length(c);
    h = min((cos(th * 18.) - .42) * r * .055, abs(fract(r / 6.5) - .5) * 6.5 - .5);
    h = min(h, r - 3.2);
  } else if (type > 7.5) {               // the end panel: diamond lattice with a solid collar where the moon gate is cut
    float d1 = abs(fract((q.x + q.y) / 2.6) - .5) * 2.6, d2 = abs(fract((q.x - q.y) / 2.6) - .5) * 2.6;
    h = (min(d1, d2) - .62) * .7;
    h = min(h, length(q - vec2(15., GATE_UV_Y)) - (GATE_RR + 1.));
  } else {                               // lozenge rows
    vec2 g = q / vec2(2.3, 3.6); g.x += .5 * floor(g.y);
    vec2 c = (fract(g) - .5) * vec2(2.3, 3.6);
    h = (1. - abs(c.x) / .72 - abs(c.y) / 1.25) * .5;
  }
  return h;
}
float hosRoofY(float x){ return 52. + 24. * (1. - min(abs(x) / 32., 1.4)); }
// How much of an opening its leaves have uncovered: q in opening coords (0..20, 0..28), o = open 0..1.
float hosReveal(vec2 q, float mode, float o){
  float d;
  if (mode < .5) d = o * 10.4 - abs(q.x - 10.);                               // paired leaves part in the middle
  else if (mode < 1.5) d = o * 29. - q.y;                                      // top-hung: daylight climbs from the sill
  else if (mode < 2.5) d = q.y < 10. ? o * 10.6 - (10. - q.y) : o * 18.6 - (q.y - 10.);   // split: flap drops, leaf lifts
  else if (mode < 3.5) d = abs(fract(q.x / 4.) - .5) * 4. - (1. - o) * 2.1;    // vanes pivot together
  else d = q.y < 14. ? o * 14.6 - (14. - q.y) : -1.;                             // drop flaps under a fixed grille
  return smoothstep(-.5, .5, d) * step(.004, o);
}
// transmission of the left wall at a point of its plane
float hosWallT(vec3 q){
  float kf = floor(-q.z / 40.);
  if (q.z > 0. || kf > 11.5 || q.y < 16. || q.y > 51.6) return 0.;
  vec4 B = uBayL[int(kf) + 1];
  vec2 o = vec2(-40. * kf - 10. - q.z, q.y - 16.);
  float hole = mix(smoothstep(-.12, .14, pierce(o, B.x, B.z)), .16, hosSoft);
  if (q.y > 44.6) return hole * step(abs(o.x - 10.), 17.6) * smoothstep(0., .4, min(q.y - 44.6, 51.6 - q.y));
  if (q.y > 44.) return 0.;
  float inside = smoothstep(0., .5, min(min(o.x, 20. - o.x), min(o.y + .3, 28. - o.y)));
  return inside * max(hosReveal(o, B.y, B.w), hole);
}
// transmission of the left roof slope: flaps in the flap bays, a few slipped tiles elsewhere
float hosRoofT(vec3 q){
  float kf = floor(-q.z / 40.);
  if (q.z > 0. || kf > 11.5) return 0.;
  float s = (q.x + 32.) * 1.25;                           // metres up the slope, 0..40
  float zl = -40. * kf - q.z;                             // 0..40 along the bay
  float open = uOpenRoof[int(kf) + 1];
  float has = step(-.5, open); open = max(open, 0.);     // -1 = this bay has no flaps
  vec2 l = vec2(zl - 20., s - 19.);
  l -= vec2(9., 8.) * sign(l);                            // four flaps 12 m square, centres +-9 and +-8; l = flap-local
  float inside = smoothstep(0., .5, 6. - max(abs(l.x), abs(l.y)));
  vec2 f = vec2(zl, s);
  float star = mix(smoothstep(-.1, .12, pierce(l + 1.6, 1., 3.)), .12, hosSoft);
  float flap = has * inside * max(smoothstep(-.5, .5, open * 12.8 - (l.y + 6.)) * step(.004, open), star);
  vec2 tc = f / vec2(1.6, 1.9);
  float leak = step(.972, hosHash(floor(tc) + kf * 7.)) * (1. - smoothstep(.12, .26, length((fract(tc) - .5) * vec2(1.6, 1.9))));
  return max(flap, leak * (1. - hosSoft));
}
// palm fronds tossing between the sun and whatever they shade: a moving dapple
float hosPalm(vec2 q){
  float n = hosNoise(vec2(q.x * .075 + uHos.x * .55, q.y * .12 - uHos.x * .21)) * .65 + hosNoise(vec2(q.x * .31 - uHos.x * .9, q.y * .22)) * .35;
  return 1. - .5 * smoothstep(.5, .66, n);
}
// the net shed in front (slatted floor at y = 16, z 92..170): sun stripes between the slats, running along the lane
float hosShed(vec3 P){
  if (P.y > 15.9) return 1.;
  float t = (16. - P.y) / max(uSun.y, .05); vec3 q = P + uSun * t;
  float in_ = smoothstep(0., 1.5, min(min(q.x + 29., 29. - q.x), min(q.z - 91., 171. - q.z)));
  float w = .03 + t * .0035;
  float stripe = smoothstep(.3 - w, .3 + w, abs(fract(q.x / 3.) - .5));
  stripe = max(stripe, .5 * smoothstep(.47, .5, abs(fract(q.z / 19.5 + .2) - .5)));     // a gap between two runs of slats
  return 1. - in_ * (1. - stripe) * .95;
}
// Sun reaching a point (0..1). P is hero-local and already pushed a little off its surface.
float hosSunT(vec3 P){
  float roofY = hosRoofY(P.x);
  if (P.y < 15.6 && abs(P.x) < 33. && P.z < 1. && P.z > -481.) return 0.;            // under the house
  if (P.z < -480.3) {                                                                 // beyond the end wall: the house's shadow
    float t = (-480. - P.z) / max(uSun.z, .05); vec3 q = P + uSun * t;
    return smoothstep(-1., 1.5, max(abs(q.x) - 32., q.y - hosRoofY(q.x)));
  }
  if (P.y > roofY + .25 && abs(P.x) < 34.) return 1.;                                 // on the roof
  if (P.z > .3) return hosShed(P);                                                    // the front, the stair, the net shed
  if (P.x > 32.3) {                                                                   // the seaward side: the house's own shadow
    float sx = max(-uSun.x, .05); vec3 q = P + uSun * ((P.x - 32.) / sx), q0 = P + uSun * (P.x / sx);
    float clear = min(q.y - 52., q0.y - 76.);
    float zin = smoothstep(-2., 2., min(-q.z, q.z + 480.));
    return 1. - zin * (1. - smoothstep(-1., 2.5, clear));
  }
  if (P.x < -32.3) return P.y < 30. ? hosPalm(vec2(P.z + P.x * .5, P.x * .7 + P.y)) : 1.;   // the sunny wall and the sand under the grove
  float tW = (P.x + 32.) / max(-uSun.x, .05), tF = -P.z / max(uSun.z, .05);
  if (tF < tW) {                                                                      // out through the front: the door
    vec3 q = P + uSun * tF; vec2 o = vec2(q.x + 11., q.y - 16.);
    if (abs(q.x) > 11. || o.y < 0. || o.y > 28.) return 0.;
    float hole = mix(smoothstep(-.12, .14, pierce(o, 6., 1.)), .16, hosSoft);
    float rev = smoothstep(-.5, .5, uHos.z * 11.5 - abs(q.x)) * step(.004, uHos.z);
    return max(rev, hole) * smoothstep(0., .5, min(11. - abs(q.x), 28. - o.y));
  }
  vec3 q = P + uSun * tW;
  if (q.y < 52.) return hosWallT(q) * hosPalm(q.zy);
  float tR = (.6 * (P.x + 32.) - .8 * (P.y - 52.)) / max(dot(vec3(-.6, .8, 0.), uSun), .05);
  q = P + uSun * tR;
  if (q.x > 0.) return 0.;
  return hosRoofT(q);
}
// The whole light. alb = albedo, P, N = hero-local position and facing normal, V = unit vector to the eye.
vec3 hosShade(vec3 alb, vec3 P, vec3 N, vec3 V, float gloss){
  vec3 Ps = P + N * .45;
  vec3 fp = fwidth(P); hosSoft = max(hosSoft, smoothstep(.7, 2.4, length(fp)));   // far away the carving becomes its average
  float inside = step(15.6, Ps.y) * step(abs(Ps.x), 32.3) * step(Ps.z, .3) * step(-480.3, Ps.z) * step(Ps.y, hosRoofY(Ps.x) + .25);
  float under = step(Ps.y, 15.6) * step(abs(Ps.x), 33.) * step(Ps.z, 1.) * step(-481., Ps.z);
  float T = hosSunT(Ps) * hosExtT;
  T *= mix(1., mix(hosWallK, 1., smoothstep(.5, .9, N.y)), inside);                // upright timber never blooms; the slab on the boards may
  float ndl = max(dot(N, uSun), 0.);
  vec3 Hv = uSun + V; Hv /= max(length(Hv), 1e-3);
  float spec = pow(max(dot(N, Hv), 0.), 26.) * gloss;
  vec3 sunc = mix(uOutSun, uSunCol, inside);
  vec3 col = sunc * T * (alb * ndl + vec3(1., .95, .88) * (spec * .22 + inside * uHos.y * ndl * .05));
  // ambient: a shut bay is nearly black; every open leaf adds amber from the boards, sky from the left, jade from the sea
  float zf = clamp(-P.z / 40. + .5, 0., 12.), i0 = floor(min(zf, 11.999)), fr = zf - i0; fr = fr * fr * (3. - 2. * fr);
  int k0 = int(i0);
  float oL = mix(uBayL[k0].w, uBayL[k0 + 1].w, fr), oR = mix(uOpenR[k0], uOpenR[k0 + 1], fr);
  int kb = k0 > 0 ? k0 - 1 : 0;                                                     // the bay behind us (already open): its lit boards reach this bay's truss
  float oLb = mix(uBayL[kb].w, uBayL[k0].w, fr), oRb = mix(uOpenR[kb], uOpenR[k0], fr);
  float hgt = clamp((P.y - 16.) / 60., 0., 1.);
  vec3 amb = uAmbDark * (.6 + .4 * N.y);
  float up = smoothstep(.42, .8, hgt);                                              // the truss and the roof over an opened bay
  float oLu = mix(oL, max(oL, .8 * oLb), up), oRu = mix(oR, max(oR, .8 * oRb), up);
  amb += uBounce * oLu * (.6 - .4 * N.y) * mix(1. - .55 * hgt, uLook2.y, up);
  amb += uBounce * oL * uScr.w * max(N.y, 0.) * (1. - up);                          // the boards of an opened bay are never black
  amb += uSkyIn * oL * max(.1, .3 - N.x * .7 + N.y * .2) * (.55 + .45 * hgt);
  float rip = .72 + .28 * sin(P.z * .31 + P.y * .22 + uHos.x * 2.1) * sin(P.z * .12 - P.x * .17 - uHos.x * 1.4);
  float rip2 = .55 + .45 * sin(P.z * .47 + P.x * .31 + uHos.x * 2.6) * sin(P.z * .19 - P.x * .43 - uHos.x * 1.7);
  amb += uJade * oRu * max(.08 + .34 * up * step(N.y, .2), .25 + N.x * .7 - N.y * .45) * mix(rip, rip2, up) * (.45 + .55 * hgt) * (1. + uLook2.z * up);
  amb += uSkyIn * uHos.z * exp(min(P.z, 0.) / 70.) * max(.08, N.z) * .5;
  amb += uSkyIn * uHos.w * exp(min(-480. - P.z, 0.) / 60.) * max(.08, -N.z) * .8;
  // the moon gate: a pool of daylight on the boards inside it, and the portal's colour laid down the boards toward
  // the eye like a moon path (the mirror image of the ring, drawn out by the grain of the floor)
  float gz = max(P.z + 480., 0.);
  amb += uSkyIn * uLook2.w * (1. - uHos.w) * exp(-gz / 24.) * exp(-P.x * P.x / (70. + gz * 7.)) * (.35 + .65 * max(N.y, 0.));
  vec3 streak = vec3(0.);
  if (inside > .5 && N.y > .6 && V.z > .02) {
    float tp = (P.z - uGate.y) / V.z, tw = (P.z + 480.) / V.z;                      // along the mirrored view ray: to the portal, to the end wall
    vec2 hp = vec2(P.x - V.x * tp, P.y + V.y * tp - uGate.x);
    float R = uGate.z;
    float wx = exp(-hp.x * hp.x / (R * R * .45));
    float wy = smoothstep(-2.4 * R, -.7 * R, hp.y) * exp(-max(hp.y - .4 * R, 0.) / (R * 5.));
    float gate = mix(1. - smoothstep(uGate.w - 2.5, uGate.w, abs(P.x - V.x * tw)), 1., uHos.w);
    float fres = .12 + .88 * pow(1. - clamp(V.y, 0., 1.), 3.);
    float seen = mix(uScr.x, 1., step(P.z, -120.)) * mix(uScr.y, 1., step(P.z, -320.)) * mix(uScr.z, 1., step(P.z, -400.));
    streak = uPortalCol * (wx * wy * gate * fres * seen) * (.03 + alb * 2.6) * smoothstep(.6, .9, N.y);
  }
  vec3 out_ = uOutAmb * (.62 + .38 * N.y) + uOutSun * .2 * max(-N.y, 0.);
  amb = mix(mix(out_, uUnder * (.75 - .25 * N.y), under), amb, inside);
  return col + alb * amb + streak;
}
`,Le=`
uniform vec3 uGold; uniform vec3 uLeak; uniform vec3 uOil;   // uOil: oiled chengal weathers darker and warmer out of doors
void hosSurface(vec2 uv, vec4 mat, vec3 vc, vec3 P, vec3 N, float px, out vec3 alb, out vec3 emis, out float gloss){
  float kind = mat.x, seed = mat.w;
  emis = vec3(0.); gloss = .5;
  float g1 = hosNoise(vec2(uv.x * .22 + seed * 3.1, uv.y * 7. + seed));
  float g2 = hosNoise(vec2(uv.x * 1.1 - seed, uv.y * 23. + seed * 5.));
  float grain = .78 + .3 * g1 + .14 * g2;
  alb = vc * grain;
  if (kind < .5) {                                    // plain timber, a darker check line here and there
    alb *= 1. - .35 * smoothstep(.62, .7, hosNoise(vec2(uv.x * .09 + seed * 9., uv.y * 3.1 + seed * 2.)));
  } else if (kind < 1.5) {                            // boards: width mat.z across v, butt joints along u, pegs
    float bw = max(mat.z, .2), bi = floor(uv.y / bw), bf = fract(uv.y / bw);
    float hb = hosHash(vec2(bi, seed * 17. + 3.));
    float ju = uv.x / 13. + hb * 7.; float jf = fract(ju), ji = floor(ju);
    float tint = hosHash(vec2(bi * 3.7 + ji, seed + 11.));
    alb = vc * (.74 + .34 * hosNoise(vec2(uv.x * .22 + hb * 40., uv.y * 7.)) + .14 * g2) * (.72 + .5 * tint);
    alb = mix(alb, vec3(dot(alb, vec3(.4, .4, .2))), .3 * step(.7, tint));        // a weathered board now and then
    float aa = min(1., .1 / (px + .05));               // keep the seam's coverage when it is thinner than a pixel
    float seam = (1. - smoothstep(0., .04 + px * .6, min(bf, 1. - bf) * bw)) * aa;
    float joint = (1. - smoothstep(0., .04 + px * .6, min(jf, 1. - jf) * 13.)) * aa;
    float sj = max(seam, joint);
    alb *= 1. - .7 * sj;
    vec2 pg = vec2(min(jf, 1. - jf) * 13. - .45, (bf - .5) * bw); pg.y = abs(pg.y) - bw * .28;
    alb *= 1. - .6 * (1. - smoothstep(.07, .12 + px, length(pg))) * (1. - smoothstep(.04, .16, px));
    alb *= .9 + .1 * smoothstep(0., .25, min(bf, 1. - bf));                 // cupped boards: edges a little darker
    emis += uLeak * seam * step(.01, mat.y) * mat.y * smoothstep(.45, .9, hosNoise(vec2(bi * 1.7, uv.x * .21)));   // floor seams lit from the sand below
    gloss = .9;
  } else if (kind < 3.5) {                            // carving: pierced (2) or relief (3)
    float h = pierce(uv, mat.y, mat.z);
    if (kind < 2.5) {
      float cover = smoothstep(.25, .9, px);          // too far to resolve: glow by the open share instead of sparkling
      vec2 gc = uv - vec2(15., GATE_UV_Y); float gr = mat.y > 7.5 ? length(gc) : 1e3;
      if (gr < GATE_RR) discard;                      // the moon gate: always clear, whatever the distance
      if (h > 0. && hosHash(gl_FragCoord.xy) >= cover) discard;
      float rim = smoothstep(-.3, -.03, h);
      alb = mix(alb, vc * 1.5 + .02, rim * .5);
      alb *= .8 + .2 * smoothstep(-.9, -.4, h) + .25 * smoothstep(-.7, -.62, h) * (1. - smoothstep(-.56, -.48, h));
      float collar = 1. - smoothstep(GATE_RR + .78, GATE_RR + .92, gr);                // a gilt collar round the gate, beaded
      float bead = .7 + .3 * sin(hosAtan(gc.y, gc.x) * 44.) * smoothstep(GATE_RR + .2, GATE_RR + .4, gr);
      alb = mix(alb, uGold * bead * (.6 + .4 * smoothstep(GATE_RR, GATE_RR + .3, gr)), collar);
      emis += uGold * .1 * collar;
      rim *= 1. - collar;
      emis += uLeak * (rim * .22 + cover * .5 * step(0., h));
    } else {
      float cut = smoothstep(-.12, .06, h);           // sunk ground of the relief
      alb *= 1. - .4 * cut;
      alb += vc * .5 * smoothstep(-.2, -.1, h) * (1. - smoothstep(-.1, -.02, h));
    }
    gloss = .35;
  } else if (kind < 4.5) {                            // singgora tiles: pointed clay scales, rows staggered
    vec2 t = uv / vec2(1.7, 2.1); t.x += .5 * floor(t.y);
    vec2 ti = floor(t), tf = fract(t);
    float th = hosHash(ti + seed), th2 = hosHash(ti * 1.7 + 5.);
    float tip = tf.y - abs(tf.x - .5) * .9;           // lower pointed end of each scale
    vec3 clay = vc * (.62 + .6 * th);
    clay = mix(clay, clay.rrr * vec3(.55, .6, .5), .5 * step(.72, th2) * hosNoise(uv * .6));   // lichen and weather
    alb = clay * (.55 + .45 * smoothstep(-.05, .28, tip)) * (.8 + .25 * hosNoise(uv * vec2(.7, 2.)));
    alb *= .93 + .07 * smoothstep(.0, .1, abs(tf.x - .5));
    if (N.y < 0.) {                                   // seen from inside: battens and the pale backs of the tiles
      float bat = smoothstep(.0, .1, tf.y) * (1. - smoothstep(.86, .96, tf.y));
      alb = mix(vec3(.2, .13, .08), vec3(.36, .23, .135) * (.7 + .5 * th), bat) * (.8 + .3 * hosNoise(uv * vec2(.5, 3.)));
    }
    gloss = .25;
  } else if (kind < 5.5) {                            // gilt
    float h = pierce(uv, mat.y, mat.z);
    alb = uGold * (.5 + .5 * smoothstep(-.25, .05, h)) * (.85 + .3 * g2);
    emis = uGold * .22 * smoothstep(-.1, .1, h);
    gloss = 1.3;
  } else if (kind < 6.5) {                            // paint, worn at the grain
    alb = mix(vc, vc * .55, smoothstep(.55, .8, g1) * .6) * (.9 + .15 * g2);
    gloss = .7;
  } else { alb = vc * (.8 + .3 * g2); gloss = 1.6; }  // iron, brass
}
`,Re=`
attribute vec2 aUV; attribute vec4 aMat;
varying vec3 vP; varying vec3 vN; varying vec3 vC; varying vec3 vV; varying vec2 vUV; varying vec4 vMat;
#include <fog_pars_vertex>
void main(){
  vP = position; vN = normal; vC = color; vUV = aUV; vMat = aMat;
  vec4 wp = modelMatrix * vec4(position, 1.);
  vV = cameraPosition - wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Se=`
varying vec3 vP; varying vec3 vN; varying vec3 vC; varying vec3 vV; varying vec2 vUV; varying vec4 vMat;
#include <fog_pars_fragment>
${be}
${Le}
void main(){
  vec3 N = vN / max(length(vN), 1e-4); if (!gl_FrontFacing) N = -N;
  vec2 fw = fwidth(vUV); float px = max(fw.x, fw.y);
  vec3 alb, emis; float gloss;
  hosSurface(vUV, vMat, vC, vP, N, px, alb, emis, gloss);
  vec3 Po = vP + N * .45;
  float ins = step(15.6, Po.y) * (1. - smoothstep(31.8, 33., abs(Po.x))) * (1. - smoothstep(-.2, 1., Po.z)) * smoothstep(-481., -479.8, Po.z) * step(Po.y, hosRoofY(Po.x) + .25);
  if (vMat.x < 3.5) alb *= mix(mix(uOil, vec3(1.), .6 * smoothstep(31., 34., Po.x)), vec3(1.), ins);   // (milder on the shaded seaward side)
  vec3 V = vV / max(length(vV), 1e-3);
  hosWallK = uLook2.x;
  vec3 col = hosShade(alb, vP, N, V, gloss) + emis;
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,ze=`
uniform float uWaveZ; uniform float uChan[6]; uniform vec4 uCalm;   // uCalm.x = the lull (0..1)
// s: 0 = the gust arrives, 1 = swung (0.9 s). Spring: shove, overshoot 8 degrees, two rattles on the stay.
float hosSpring(float s){
  if (s <= 0.) return 0.;
  float x = min(s / .85, 1.);
  float a = x * x * (2.2 - 1.2 * x);
  a += .09 * sin(3.1416 * clamp((s - .85) / .4, 0., 1.));
  float r = clamp((s - 1.25) / .6, 0., 1.);
  a -= .05 * abs(sin(6.2832 * r)) * (1. - .55 * step(.5, r));
  return a;
}
// a leaf that falls under its own weight and bounces once
float hosFall(float s){
  if (s <= 0.) return 0.;
  float x = min(s, 1.);
  return x * x * (.55 + .45 * x) - .075 * sin(3.1416 * clamp((s - 1.) / .5, 0., 1.));
}`,Te=`
attribute vec2 aInset; attribute float aPart;
attribute vec4 aSize; attribute vec4 aSwing; attribute vec4 aFold; attribute vec4 aUVM; attribute vec4 aTint; attribute vec4 aTrim;
varying vec3 vP; varying vec3 vN; varying vec3 vC; varying vec3 vV; varying vec2 vUV; varying vec4 vMat;
uniform vec4 uHos;
${ze}
#include <fog_pars_vertex>
void main(){
  float L = aSize.x, S = aSize.y, is = aSize.z;
  float code = aSwing.w, curve = floor(code / 10. + .01), chan = code - curve * 10.;
  float fy = position.y;
  if (code > 14.5) fy = abs(fy - .38) < .01 ? .147 : abs(fy - .72) < .01 ? .853 : fy;    // the end panel: its two inner rails stand clear of the moon gate
  vec3 l = vec3((position.x - aSize.w) * L + aInset.x * is, fy * S + aInset.y * is, position.z * is);
  int ci = int(clamp(chan, 1., 6.) + .5) - 1;
  float s = chan < .5 ? (aSwing.y - uWaveZ) / ${de.toFixed(1)} - aSwing.z : uChan[ci] - aSwing.z;
  float a = curve < .5 ? hosSpring(s) : hosFall(s);
  float seed = aTint.w;
  if (curve < .5) {
    a *= 1. - .5 * uCalm.x * (1. - smoothstep(3.3, 4.6, s)) * step(chan, .5);
    a += .014 * sin(uHos.x * 6.3 + seed * 41.) * sin(uHos.x * 2.3 + seed * 13.) * smoothstep(1.2, 2.4, s);   // trembling in the wind
  }
  float ang = aSwing.x * a, c = cos(ang), sn = sin(ang);
  vec3 r = vec3(c * l.x + sn * l.z, l.y, -sn * l.x + c * l.z);
  r.x += aFold.x * L * (c - 1.);
  vec3 nr = vec3(c * normal.x + sn * normal.z, normal.y, -sn * normal.x + c * normal.z);
  vec4 hp = instanceMatrix * vec4(r, 1.);
  vP = hp.xyz; vN = mat3(instanceMatrix) * nr;
  // surface: 0 stile, 1 rail, 2 pierced panel, 3 iron, 4 trim bead
  vC = aTint.rgb; vMat = vec4(0., 0., 1., seed);
  vUV = aPart < .5 ? vec2(l.y, l.x + seed * 9.) : vec2(l.x, l.y + seed * 5.);
  if (aPart > 1.5 && aPart < 2.5) { vUV = aFold.zw + aUVM.xy * l.x + aUVM.zw * l.y; vMat = vec4(2., aFold.y, seed, seed); vC = aTint.rgb * 1.08; }
  else if (aPart > 2.5 && aPart < 3.5) { vC = vec3(.03, .028, .026); vMat = vec4(7., 0., 1., seed); }
  else if (aPart > 3.5) { vC = aTrim.rgb; vMat = vec4(aTrim.w, 7., seed, seed); vUV = vec2(l.x + l.y, l.z) ; }
  else if (aPart > .5) vC = aTint.rgb * .88;
  vec4 wp = modelMatrix * hp;
  vV = cameraPosition - wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;function Ne(t=!1){const v=[],d=[],m=[],M=[],a=(o,x,p)=>({x:o,y:x,z:p}),i=(o,x,p,u,L,P)=>{for(const w of[o,x,p,o,p,u])v.push(w.x[0],w.y[0],w.z),m.push(w.x[1],w.y[1]),d.push(L[0],L[1],L[2]),M.push(P)},y=(o,x,p,u,L,P,w,V=!0)=>{i(a(o,p,P),a(x,p,P),a(x,u,P),a(o,u,P),[0,0,1],w),i(a(x,p,L),a(o,p,L),a(o,u,L),a(x,u,L),[0,0,-1],w),i(a(o,p,L),a(o,p,P),a(o,u,P),a(o,u,L),[-1,0,0],w),i(a(x,p,P),a(x,p,L),a(x,u,L),a(x,u,P),[1,0,0],w),V&&(i(a(o,u,P),a(x,u,P),a(x,u,L),a(o,u,L),[0,1,0],w),i(a(o,p,L),a(x,p,L),a(x,p,P),a(o,p,P),[0,-1,0],w))};if(y([0,0],[0,.75],[0,0],[1,0],-.24,.24,0),y([1,-.75],[1,0],[0,0],[1,0],-.24,.24,0),y([0,.75],[1,-.75],[0,0],[0,.75*1.35],-.2,.2,1),y([0,.75],[1,-.75],[1,-.75],[1,0],-.2,.2,1),!t)y([0,.75],[1,-.75],[.38,-.75*.5],[.38,.75*.5],-.2,.2,1),y([0,.75],[1,-.75],[.72,-.75*.4],[.72,.75*.4],-.2,.2,1),i(a([0,.75*.5],[0,.75*.5],.1),a([1,-.75*.5],[0,.75*.5],.1),a([1,-.75*.5],[1,-.75*.5],.1),a([0,.75*.5],[1,-.75*.5],.1),[0,0,1],2),i(a([1,-.75*.5],[0,.75*.5],-.1),a([0,.75*.5],[0,.75*.5],-.1),a([0,.75*.5],[1,-.75*.5],-.1),a([1,-.75*.5],[1,-.75*.5],-.1),[0,0,-1],2);else{for(let u=0;u<18;u++){const L=.05+.9*(u+.5)/18,P=[0,.75*.8],w=[1,-.75*.8],V=[L,-.4],e=[L,.28],r=[L,-.28],N=[L,.4];i(a(w,r,-.45),a(P,r,-.45),a(P,N,.45),a(w,N,.45),[0,.798,-.603],1),i(a(P,V,-.45),a(w,V,-.45),a(w,e,.45),a(P,e,.45),[0,-.798,.603],1),i(a(P,e,.45),a(w,e,.45),a(w,N,.45),a(P,N,.45),[0,0,1],1),i(a(w,V,-.45),a(P,V,-.45),a(P,r,-.45),a(w,r,-.45),[0,0,-1],1)}y([.5,-.12],[.5,.12],[.06,0],[.94,0],.5,.72,0,!1)}const h=.16;y([0,.75],[0,.75+h],[0,.75*1.35],[1,-.75],-.3,.3,4,!1),y([1,-.75-h],[1,-.75],[0,.75*1.35],[1,-.75],-.3,.3,4,!1),y([0,.75],[1,-.75],[0,.75*1.35],[0,.75*1.35+h],-.3,.3,4,!1),y([0,.75],[1,-.75],[1,-.75-h],[1,-.75],-.3,.3,4,!1);for(const o of[.1,.5,.9])y([0,-.3],[0,.2],[o,-.6],[o,.6],-.36,.36,3);const n=new C.BufferGeometry;return n.setAttribute("position",new C.Float32BufferAttribute(v,3)),n.setAttribute("normal",new C.Float32BufferAttribute(d,3)),n.setAttribute("aInset",new C.Float32BufferAttribute(m,2)),n.setAttribute("aPart",new C.Float32BufferAttribute(M,1)),n}const ye={paired:0,tophung:1,split:2,vanes:3,dropflap:4,foldwall:0};function Ce(t){const v=["paired","tophung","split"],d=[F.vine,F.star,F.hibiscus,F.lozenge,F.diamond],m={1:["paired",F.louvre,F.vine],2:["tophung",F.star,F.star],3:["split",F.hibiscus,F.hibiscus],6:["paired",F.louvre,F.lozenge],7:["paired",F.louvre,F.diamond],9:["vanes",F.diamond,F.diamond],11:["dropflap",F.slat,F.lozenge]},M=[null];for(let l=1;l<=oe;l++){const a=m[l]||[t.pick(v),t.pick(d),t.pick(d)],i=t.range(.3,6),y=t.range(.3,6),h={type:a[0],pat:a[1],seed:i,reveal:ye[a[0]]},n=we.includes(l)?{type:"foldwall",pat:t.pick([F.vine,F.lozenge,F.hibiscus]),seed:y,reveal:0}:l===7?{type:"tophung",pat:a[2],seed:y,reveal:ye.tophung,awning:!0}:{type:a[0],pat:a[1],seed:y,reveal:ye[a[0]]},o=[1.2,.86,1.34,.98,1.26,.9,1.16,.82,1.36,.94,1.22,.88];M.push({k:l,zc:-X*l+X/2,left:h,right:n,panelPat:a[2],tone:o[l-1]*(.94+.12*(t.range(.82,1.18)-.82)/.36),warm:t.range(-1,1),nVanes:5})}return M}function Fe(t,v,d,m){const M=[],l=(e,r)=>[e[1]*r[2]-e[2]*r[1],e[2]*r[0]-e[0]*r[2],e[0]*r[1]-e[1]*r[0]],a=(e,r)=>e[0]*r[0]+e[1]*r[1]+e[2]*r[2],i=[0,1,0],y=[0,-1,0],h=(e,r)=>{const N=d.timber.clone().lerp(d.dark,.28-.16*r).multiplyScalar(e*t.range(.9,1.1));return[N.r,N.g,N.b]},n=()=>{const e=t();return e<.34?[d.gold.r,d.gold.g,d.gold.b,O.gilt]:e<.5?[d.magenta.r*.8,d.magenta.g*.8,d.magenta.b*.8,O.paint]:e<.62?[d.jade.r*.7,d.jade.g*.7,d.jade.b*.7,O.paint]:e<.74?[d.cream.r*.7,d.cream.g*.7,d.cream.b*.7,O.paint]:null},o=e=>{const r=l(e.X,e.Y),N=e.pivot?1:-Math.sign(a(r,e.out)||1),g=e.eu,k=e.ev||i,s=e.uv0||[a([e.o[0]-e.ref[0],e.o[1]-e.ref[1],e.o[2]-e.ref[2]],g),a([e.o[0]-e.ref[0],e.o[1]-e.ref[1],e.o[2]-e.ref[2]],k)],S=e.tint||h(1,0);M.push({m:[e.X[0],e.X[1],e.X[2],0,e.Y[0],e.Y[1],e.Y[2],0,r[0],r[1],r[2],0,e.o[0],e.o[1],e.o[2],1],size:[e.L,e.S,e.is||1,e.pivot||0],swing:[N*e.angle*Math.PI/180,e.phaseZ??0,e.delay||0,(e.chan||0)+10*(e.curve||0)],fold:[e.slideK||0,e.pat,s[0],s[1]],uvm:[a(e.X,g),a(e.X,k),a(e.Y,g),a(e.Y,k)],tint:[S[0],S[1],S[2],e.seed],trim:e.trim||[S[0]*.7,S[1]*.7,S[2]*.7,O.timber],kind:e.kind||"leaf",louvre:!!e.louvre})},x=(e,r)=>{const N=r<0?-j:j,g=[r,0,0],k=[0,0,-1],s=r<0?e.left:e.right,S=[N,z,e.zc+ae/2],f={out:g,eu:k,ref:S,pat:s.pat,seed:s.seed,phaseZ:e.zc},T=r<0?0:.11,q=h(e.tone,e.warm),b=n()||void 0,B=[.07,.3,.19],I=[d.cream.r*.62,d.cream.g*.6,d.cream.b*.5],G=e.k%2===1,Y=r>0?G?B:I:q,K=r>0?G?[I[0]*1.2,I[1]*1.2,I[2]*1.2,O.paint]:[B[0]*1.15,B[1]*1.15,B[2]*1.15,O.paint]:b,te=(U,J)=>[N,J,e.zc+ae/2-U];if(s.type==="paired"){const U=t.range(98,116),J=s.pat===F.louvre,le=J&&r<0?[Y[0]*.8,Y[1]*.74,Y[2]*.7]:Y;o({...f,o:te(0,z),X:k,Y:i,L:10,S:Q,angle:U,delay:T,tint:le,trim:K,louvre:J}),o({...f,o:te(ae,z),X:[0,0,1],Y:i,L:10,S:Q,angle:U-t.range(0,14),delay:T+.04,tint:le,trim:K,louvre:J})}else if(s.type==="tophung")for(let U=0;U<2;U++){const J=t.range(46,58);o({...f,o:te(U*10,D),X:y,Y:k,L:Q,S:10,angle:s.awning?73+3*U:J,delay:T+U*.05,tint:Y,trim:K})}else if(s.type==="split")o({...f,o:te(0,z),X:i,Y:k,L:10,S:ae,angle:92,curve:1,delay:T,tint:Y,trim:K}),o({...f,o:te(0,D),X:y,Y:k,L:18,S:ae,angle:t.range(62,76),delay:T+.06,tint:Y,trim:K});else if(s.type==="vanes")for(let U=0;U<5;U++)o({...f,o:te(2+4*U,z),X:k,Y:i,L:4,S:Q,pivot:.5,angle:62,delay:T+U*.02,tint:Y,trim:K,is:.7});else if(s.type==="dropflap")for(let U=0;U<2;U++)o({...f,o:te(U*10,z),X:i,Y:k,L:14,S:10,angle:96,curve:1,delay:T+U*.07,tint:Y,trim:K});else if(s.type==="foldwall"){const ie=[0,0,-1],fe=[N,z,e.zc+15],ve=[N,z,e.zc+15];for(let se=0;se<6;se++){const ce=se>>1,ue=se&1,me=ue?2*ce+2:2*ce;o({...f,ref:ve,o:[fe[0],fe[1],fe[2]+ie[2]*me*5],X:ue?[0,0,-ie[2]]:ie,Y:i,L:5,S:Q,angle:84,slideK:ue?-me:me,delay:T+.03*ce,tint:Y,trim:K||[d.gold.r,d.gold.g,d.gold.b,O.gilt]})}}if(s.type!=="foldwall")for(let U=0;U<4;U++)o({...f,o:[N+r*.35,50.2,e.zc+ae/2-(1.2+U*5.1)],X:y,Y:k,L:4.6,S:3.4,is:.4,pat:F.lozenge,angle:t.range(48,72),delay:.2+t.range(0,.12),tint:Y,kind:"vent"})};for(let e=1;e<=oe;e++)x(v[e],-1),x(v[e],1);const p=h(1.05,.5),u=[d.gold.r,d.gold.g,d.gold.b,O.gilt];for(const e of[-1,1])o({o:[e*11,z,0],X:[-e,0,0],Y:i,out:[0,0,1],eu:[1,0,0],ref:[-11,z,0],L:11,S:Q,angle:96,chan:1,delay:e>0?.05:0,pat:F.sunburst,seed:1,tint:p,trim:u,is:1.25,kind:"door"});const L=[F.vine,F.sunburst,F.lozenge];he.forEach((e,r)=>{const N=h(1.1,.3),g=t.range(.3,6);for(const k of[-1,1])for(let s=0;s<2;s++){const S=s?2:0;o({o:[k*11-k*S*5.5,z,e],X:s?[k,0,0]:[-k,0,0],Y:i,out:[0,0,1],eu:[1,0,0],ref:[-11,z,e],L:5.5,S:Q,angle:80,slideK:s?-S:S,chan:2+r,delay:(k>0?.04:0)+s*.02,pat:L[r],seed:g,tint:N,trim:r===1?u:n()||u,kind:"screen"})}});const P=[.8,.6,0],w=[-.8,-.6,0],V=[-.6,.8,0];for(const e of ne)for(const r of[-9,9])for(const N of[-8,8]){const g=19+N+6,k=20+r-6;o({o:[-j+.8*g+V[0]*.25,H+.6*g+V[1]*.25,-X*(e-1)-k],X:w,Y:[0,0,-1],out:V,eu:[0,0,-1],ev:P,uv0:[-4.4,7.6],L:12,S:12,angle:t.range(50,62),phaseZ:v[e].zc,delay:.3+t.range(0,.1),pat:F.star,seed:3,tint:h(.9,-.5),kind:"flap"})}o({o:[-15,z,-W],X:i,Y:[1,0,0],out:[0,0,-1],eu:[1,0,0],ref:[-15,z,-W],L:30,S:30,angle:109.6,chan:5,curve:1,pat:F.gate,seed:2,tint:h(1,.2),trim:u,is:1.2,kind:"endwall"});for(const[e,r]of[[0,1],[-W,-1]])for(let N=-1;N<=1;N++)o({o:[N*15-2.2*r,N?62:73.2,e+r*.4],X:y,Y:[r,0,0],out:[0,0,r],eu:[1,0,0],ref:[0,50,e],L:5.2,S:4.4,is:.45,angle:58,phaseZ:e<0?-W+20:-20,delay:.25+.03*N,pat:F.star,seed:2+N,tint:h(1,0),kind:"vent"});return M}function _e(t,v,d){const m=t.length,M=new C.InstancedMesh(v,d,m),l=(i,y)=>{const h=new Float32Array(m*y);return t.forEach((n,o)=>h.set(n[i],o*y)),new C.InstancedBufferAttribute(h,y)};v.setAttribute("aSize",l("size",4)),v.setAttribute("aSwing",l("swing",4)),v.setAttribute("aFold",l("fold",4)),v.setAttribute("aUVM",l("uvm",4)),v.setAttribute("aTint",l("tint",4)),v.setAttribute("aTrim",l("trim",4));const a=new C.Matrix4;return t.forEach((i,y)=>{a.fromArray(i.m),M.setMatrixAt(y,a)}),M.instanceMatrix.needsUpdate=!0,M.frustumCulled=!1,M}function qe(t,v){const d=[0,1,0],m=[0,0,-1],M=[1,0,0],l=(h,n)=>[h.r*n,h.g*n,h.b*n],a=(h=1,n=.35)=>{const o=v.timber.clone().lerp(v.dark,n*.8),x=h*t.range(.88,1.12);return[o.r*x,o.g*x,o.b*x]},i=()=>t.range(0,9);return{UP:d,ZM:m,XP:M,shade:l,wood:a,sd:i,T:h=>[O.timber,0,1,h??i()],rng:t}}function Oe(t,v,d,m,M,l){const{UP:a,ZM:i,shade:y,wood:h,sd:n,T:o,rng:x}=v,p=m[M],u=-X*(M-1),L=-X*M,P=p.tone,w=h(P*1.15,.12);t.panel([j,z,u],i,[-1,0,0],X,2*j,w,[O.boards,.3,1.25,3.3],[-u,0]);for(let s=0;s<5;s++){const S=u-4-s*8;t.beam([-j,z-.9,S],[j,z-.9,S],1.1,1.6,a,h(P*.8,.6),o(),.1,!1)}for(const s of[-27,-9,9,27])t.beam([s,z-2.5,u],[s,z-2.5,L],1.6,1.8,a,h(P*.8,.6),o(),.14,!1);if(l.stilts!==!1)for(const s of[-27,-9,9,27])t.beam([s,1.2,L],[s,z-3.4,L],2.4,2.4,[0,0,1],h(P*.85,.5),o(),.3,!1),t.beam([s,-.4,L],[s,1.2,L],4.2,4.2,[0,0,1],[.2,.185,.16],[O.paint,0,1,n()],.5),M===1&&(t.beam([s,1.2,u],[s,z-3.4,u],2.4,2.4,[0,0,1],h(P*.85,.5),o(),.3,!1),t.beam([s,-.4,u],[s,1.2,u],4.2,4.2,[0,0,1],[.2,.185,.16],[O.paint,0,1,n()],.5));const V=s=>{for(const f of[-1,1]){const T=f*(j-1.1),q=h(P,.3);t.beam([T,z,s],[T,H-.6,s],2,2,[0,0,1],q,o(),.24,!1),t.beam([T,z,s],[T,z+1.5,s],2.7,2.7,[0,0,1],y(d.dark,1.5),o(),.3),t.beam([T,H-3.6,s],[T,H-2.6,s],2.5,2.5,[0,0,1],y(d.gold,.55),[O.gilt,F.lozenge,1,n()],.2);const b=T-f*1,B=H-.7,I=9.5,G=10.5,Y=s+.5;t.quad([b,B,Y],[b-f*I,B,Y],[b,B-G,Y],[b,B-G,Y],[0,0,f],y(d.timber,1.15),[b,B],[b-f*I,B],[b,B-G],[b,B-G],[O.pierced,F.vine,1.3+M,n()]),t.beam([b-f*.3,B-G+.4,Y],[b-f*(I-.4),B-.5,Y],.7,.8,[0,0,1],q,o(),.1)}const S=h(P*1.05,.3);t.beam([-j,H+.5,s],[j,H+.5,s],1.7,2.3,a,S,o(),.22,!1),t.beam([0,H+1.6,s],[0,A-1.2,s],1.5,1.5,[0,0,1],S,o(),.18,!1),t.beam([0,H+1.6,s],[0,H+3.4,s],2.3,2.3,[0,0,1],y(d.gold,.5),[O.gilt,F.star,1,n()],.25);for(const f of[-1,1])t.beam([f*1,H+3.2,s],[f*15,H+11.2,s],1.1,1.3,a,S,o(),.14)};V(L),M===1&&V(u-1);for(const s of[-1,1]){t.beam([s*(j-.6),H+.3,u],[s*(j-.6),H+.3,L],1.5,1.5,a,h(P,.4),o(),.16,!1);for(const S of[10,20,30])t.beam([s*(j-.8*S),H+.6*S-1.9,u],[s*(j-.8*S),H+.6*S-1.9,L],.9,1.2,a,h(P*.9,.45),o(),.1,!1)}t.beam([0,A-1.5,u],[0,A-1.5,L],1.3,1.9,a,h(P,.4),o(),.16,!1),t.panel([j-2,z+.04,L-.6],[-1,0,0],[0,0,1],2*j-4,1.2,h(P*1.05,.16),[O.boards,0,.6,n()],[0,0]);for(const s of[-1,1])t.panel([s*36.9,46.4,u],i,a,X,2,h(P*1.05,.25),[O.pierced,F.lozenge,1.3,n()],[-u,.8]);const e=ne.includes(M),r=(s,S,f,T)=>[f*(j-.8*s)+f*.6*T,H+.6*s+.8*T,u-S],N=(s,S,f=-5,T=39.4)=>t.beam(r(f,s,S,-.75),r(T,s,S,-.75),.8,1.2,[0,0,1],h(P*.92,.5),o(),.1,!1);for(const s of[-1,1]){const S=e&&s<0?[2,20,38]:[4,12,20,28,36];for(const f of S)N(f,s);if(e&&s<0){for(const f of[4.6,17.4,22.6,35.4])N(f,s,4,34);for(const f of[4.6,17.4,20.6,33.4])t.beam(r(f,2,-1,-.75),r(f,38,-1,-.75),.8,1.2,[.6,-.8,0],h(P*.92,.5),o(),.1,!1)}}const g=s=>{const S=d.mid.clone().lerp(new C.Color(.42,.2,.11),.55).multiplyScalar(s*x.range(.9,1.1));return[S.r,S.g,S.b]},k=(s,S,f,T,q)=>{const b=r(S,T,s,0),B=[-s*.8,.6,0];s<0?t.panel(r(S,q,s,0),[0,0,1],[.8,.6,0],q-T,f-S,g(1),[O.tiles,0,1,2.2],[-(u-q),S+40]):t.panel(b,i,B,q-T,f-S,g(.92),[O.tiles,0,1,5.1],[-(u-T)+200,S+40])};if(k(1,-6,40,0,X),!e)k(-1,-6,40,0,X);else{const s=[-6,5,17,21,33,40],S=[0,5,17,23,35,X];for(let f=0;f<5;f++)for(let T=0;T<5;T++)(f===1||f===3)&&(T===1||T===3)||k(-1,s[f],s[f+1],S[T],S[T+1])}t.beam([0,A+.5,u],[0,A+.5,L],2.2,1.3,a,g(.7),[O.paint,0,1,n()],.4,!1);for(const s of[-1,1])t.beam(r(-5.6,0,s,-.5),r(-5.6,X,s,-.5),.5,1.6,[s*.6,.8,0],h(P,.5),o(),.08,!1)}function Ve(t,v,d,m,M){const{UP:l,ZM:a,shade:i,wood:y,sd:h,T:n}=v,o=m[M],x=-X*(M-1),p=o.tone;for(const u of[-1,1]){const L=u*j,P=u<0?o.left:o.right,w=P.type==="foldwall"?15:ae/2,V=X/2-w,e=X/2+w,r=(f,T)=>[L,T,x-f],N=y(p*.95,.35),g=y(p*1.1,.25);for(const[f,T]of[[1,V-.6],[e+.6,X-1]]){const q=T-f;q<1||(t.panel(r(f,z),a,l,q,6.4,y(p*.9,.4),[O.boards,0,1.3,h()],[f,0]),t.beam(r(f,z+6.7),r(T,z+6.7),1,.9,l,g,n(),.12,!1),t.panel(r(f,z+7.1),a,l,q,21,N,[O.relief,o.panelPat,P.seed,h()],[f+M*3.7,.4]),t.beam(r(f+q/2,z+7.1),r(f+q/2,D),.7,.9,[0,0,1],g,n(),.1,!1))}for(const f of[V-.8,e+.8])t.beam(r(f,z),r(f,D+.6),1.3,1.5,[0,0,1],g,n(),.16,!1);t.beam(r(1,D+.6),r(X-1,D+.6),1.3,1.2,l,g,n(),.14,!1),t.beam(r(V,z+.1),r(e,z+.1),1.7,.5,l,i(d.dark,1.6),n(),.1,!1);const k=[O.pierced,P.pat,P.seed,h()],s=y(p*1.05,.3),S=(f,T)=>t.panel(r(f,45.2),a,l,T-f,6,s,k,[f-V-(w-10),45.2-z]);if(P.type==="foldwall")S(1,X-1);else{const f=[0,1,2,3].map(q=>[11.2+q*5.1,11.2+q*5.1+3.4]);let T=1;for(const[q,b]of f)S(T,q),T=b,t.beam(r(q,45.4),r(b,45.4),.5,.5,l,g,n(),.06,!1),t.beam(r(q,50.7),r(b,50.7),.5,1,l,g,n(),.06,!1);S(T,X-1)}t.beam(r(1,51.4),r(X-1,51.4),.9,.5,l,g,n(),.08,!1)}}function He(t,v,d,m,M){const{UP:l,XP:a,shade:i,wood:y,sd:h,T:n}=d,o=y(1.05,.3),x=y(1.15,.2);for(const g of[-1,1])t.panel([g<0?-31:11.8,z,0],a,l,19.2,36,o,[O.boards,0,1.4,1.7],[g*30,0]),t.beam([g*11.8,z,.1],[g*11.8,D+1,.1],1.8,1.8,[0,0,1],x,n(),.25),t.panel([g<0?-30:13.5,z+5,.15],a,l,16.5,20,y(1,.3),[O.relief,M[1].panelPat,2.2,h()],[g*40,3]);t.panel([-11.8,D+.4,0],a,l,23.6,H-D-.4,o,[O.relief,F.lozenge,1.3,h()],[0,0]),t.beam([-13,D+1,.2],[13,D+1,.2],2,1.8,l,x,n(),.25),t.beam([-33,H+.4,.3],[33,H+.4,.3],1.4,1.8,l,x,n(),.2),t.beam([-12,z-.1,.6],[12,z-.1,.6],2.4,.8,l,i(m.dark,1.6),n(),.15);const p=(g,k,s)=>{const S=y(1,.35),f=[O.boards,0,1.4,h()],T=[-j*k,H,g],q=[0,H,g],b=[0,A,g],B=[j*k,H,g];s.quad(T,q,b,b,[0,0,k],S,[H,-j],[H,0],[A,0],[A,0],f),s.quad(q,B,b,b,[0,0,k],S,[H,0],[H,j],[A,0],[A,0],f);for(const I of[-1,1])s.beam([I*38.6,H-4.7,g+k*1.2],[0,A+.6,g+k*1.2],.9,2.6,[0,0,1],y(1.1,.2),n(),.2),s.beam([I*38.2,H-4.4,g+k*1.5],[I*2,A-.9,g+k*1.5],.5,.7,[0,0,1],i(m.gold,.7),[O.gilt,F.lozenge,1,h()],.1,!1),s.beam([I*38.4,H-4.9,g+k*1.2],[I*42.5,H-3.4,g+k*1.2],.9,2,[0,0,1],y(1.1,.2),n(),.2);s.beam([0,A-1,g+k*1.2],[0,A+7,g+k*1.2],1.2,1.2,[0,0,1],y(1.1,.2),n(),.25),s.beam([0,A+2.6,g+k*1.2],[0,A+4.4,g+k*1.2],2.1,2.1,[0,0,1],i(m.gold,.8),[O.gilt,F.star,1,h()],.5),s.beam([0,A+5.6,g+k*1.2],[0,A+6.4,g+k*1.2],1.7,1.7,[0,0,1],i(m.gold,.8),[O.gilt,F.star,1,h()],.4);for(let I=-1;I<=1;I++)s.panel([I*15-2.2*k,(I?62:73.2)-5.2,g+k*.12],[k,0,0],l,4.4,5.2,[.004,.003,.003],[O.paint,0,1,1],[0,0])};p(0,1,t);const u=10.9,L=14,P=[O.gilt,F.sunburst,1,2.5],w=[m.gold.r,m.gold.g,m.gold.b],V=.5,e=H+2.2;for(let g=0;g<L;g++){const k=Math.PI*g/L,s=Math.PI*(g+1)/L,S=[Math.cos(k)*u,e+Math.sin(k)*u,V],f=[Math.cos(s)*u,e+Math.sin(s)*u,V];t.quad([0,e,V],S,f,f,[0,0,1],w,[11,-.5],[11+S[0],S[1]-e-.5],[11+f[0],f[1]-e-.5],[11+f[0],f[1]-e-.5],P)}const r=y(1,.3),N=[O.pierced,F.lozenge,2.4,h()];for(const g of[-1,1])v.panel([g<0?-31:15.8,z,-W],a,l,15.2,36,r,N,[g*30,0]),v.beam([g*15.8,z,-W],[g*15.8,47.2,-W],1.8,1.8,[0,0,1],x,n(),.25);v.panel([-15,47.4,-W],a,l,30,H-47.4,r,[O.pierced,F.star,1.1,h()],[0,0]),v.beam([-17,46.8,-W],[17,46.8,-W],1.8,1.6,l,x,n(),.25),v.beam([-33,H+.4,-W-.3],[33,H+.4,-W-.3],1.4,1.8,l,x,n(),.2),v.beam([-16,z-.1,-W-.4],[16,z-.1,-W-.4],2,.8,l,i(m.dark,1.6),n(),.15),p(-W,-1,v)}function Ie(t,v,d,m,M,l){const{UP:a,XP:i,shade:y,wood:h,sd:n,T:o}=v,x=h(1.15,.2),p=h(1.05,.3);for(const u of[-1,1]){const L=u<0?-30.4:11.9,P=18.5;t.panel([L,z,m],i,a,P,8,h(.95,.4),[O.boards,0,1.3,n()],[L,0]),t.beam([L,z+8.4,m],[L+P,z+8.4,m],1.2,1,a,x,o(),.14,!1),t.panel([L,z+8.9,m],i,a,P,19.6,p,[O.pierced,M,l,n()],[L+11,8.9]),t.beam([L+P/2,z+8.9,m],[L+P/2,D+.4,m],.8,1,[0,0,1],x,o(),.1,!1),t.beam([u*11.9,z,m],[u*11.9,D+.8,m],1.7,1.9,[0,0,1],x,o(),.24,!1),t.beam([u*11.9,z+12,m],[u*11.9,z+13.2,m],2.2,2.4,[0,0,1],y(d.gold,.6),[O.gilt,F.lozenge,1,n()],.2)}t.beam([-30.4,D+.8,m],[30.4,D+.8,m],1.6,1.9,a,x,o(),.22,!1),t.panel([-30.4,D+1.7,m],i,a,60.8,H-D-2.6,p,[O.pierced,F.slat,1,n()],[.65,3.6]),t.beam([-11,z-.05,m],[11,z-.05,m],1.5,.5,a,y(d.dark,1.6),o(),.1,!1)}function Ee(t,v,d,m,M){const{UP:l,ZM:a,XP:i,shade:y,wood:h,sd:n,T:o}=v,x=15,p=j+.4,u=64;t.panel([u,x,m],a,[-1,0,0],m-M,u-p,h(1.2,.1),[O.boards,.12,1.25,n()],[-m,70]),t.beam([u+.2,x-.6,m],[u+.2,x-.6,M],.8,1.5,l,h(1,.4),o(),.12);const L=[.36,.17,.09];t.panel([p-.2,47.5,M],[0,0,1],[.9648,-.2631,0],m-M,36.5,L,[O.tiles,0,1,7.7],[0,0]),t.beam([u,39.1,m],[u,39.1,M],1.2,1.4,l,h(1,.3),o(),.14);for(let w=m,V=0;w>=M-.01;w-=20,V++){const e=h(1.05,.3);t.beam([u,1.2,w],[u,38.7,w],1.5,1.5,[0,0,1],e,o(),.2,!1),t.beam([u,-.4,w],[u,1.2,w],3.2,3.2,[0,0,1],[.2,.185,.16],[O.paint,0,1,n()],.4),t.beam([u,x,w],[u,x+1.2,w],2.1,2.1,[0,0,1],y(d.dark,1.5),o(),.25),t.beam([p,46.7,w],[u+3.4,37.8,w],.8,1.2,l,h(.95,.45),o(),.1),t.beam([u-.2,34.7,w],[u-4.5,38.5,w],.8,1,l,e,o(),.1),t.beam([p,x-1,w],[u,x-1,w],1,1.5,l,h(.8,.6),o(),.1,!1),w-10>M&&t.beam([p,46.7,w-10],[u+3.4,37.8,w-10],.7,1,l,h(.95,.45),o(),.08,!1)}const P=(w,V)=>{const e=h(1.1,.25),r=Math.hypot(V[0]-w[0],V[2]-w[2]),N=Math.round(r/2.5);t.beam([w[0],x+5,w[2]],[V[0],x+5,V[2]],.9,.7,l,e,o(),.12,!1),t.beam([w[0],x+.9,w[2]],[V[0],x+.9,V[2]],.6,.6,l,e,o(),.08,!1);for(let g=1;g<N;g++){const k=g/N,s=w[0]+(V[0]-w[0])*k,S=w[2]+(V[2]-w[2])*k;g%8!==0&&t.beam([s,x+.9,S],[s,x+4.7,S],.42,.42,[.7,0,.7],e,o(),g%2?0:.1,!1)}};P([u,0,m],[u,0,M]),P([p,0,m],[u,0,m]),P([p,0,M],[u,0,M])}const Be=`
varying vec3 vP; varying vec3 vV;
#include <fog_pars_vertex>
void main(){
  vP = position;
  vec4 wp = modelMatrix * vec4(position, 1.);
  vV = cameraPosition - wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,je=`
varying vec3 vP; varying vec3 vV;
uniform vec4 uShaft;        // strength, dust drift, -, -
uniform vec3 uShaftCol;
#include <fog_pars_fragment>
${be}
void main(){
  if (vP.y > hosRoofY(vP.x) - .6) discard;
  hosSoft = 1.;
  float T = hosSunT(vP);
  float d = length(vV);
  float near = smoothstep(5., 22., d);                                   // a slice never slaps the lens
  float dust = .62 + .38 * hosNoise(vP.xy * .11 + vec2(uHos.x * .05, -uHos.x * .03) + vP.z * .37);
  dust *= .8 + .2 * hosNoise(vP.xy * .6 + vP.z);
  float low = smoothstep(16., 19., vP.y);
  float far = mix(1., .28, smoothstep(50., 200., d));                    // sixty slices in line must not add up to white
  vec3 col = uShaftCol * (uShaft.x * T * near * far * dust * low);
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      col *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      col *= 1. - smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #endif
  gl_FragColor = vec4(col, 1.);
}`;function Ye(t,v){const d=[],m=Math.max(3,Math.round(6*v)),M=t.sun.y<.5;for(let a=1;a<=oe;a++){const i=M||ne.includes(a)||ne.includes(a-1),y=i?j:-j+Math.min(2*j,30*Math.abs(t.sun.x)/t.sun.y+3),h=i?A:47;for(let n=0;n<m;n++){const o=-X*(a-1)-(n+.5)*X/m;d.push(-j,z,o,y,z,o,y,h,o,-j,z,o,y,h,o,-j,h,o)}}const l=new C.BufferGeometry;return l.setAttribute("position",new C.Float32BufferAttribute(d,3)),l.computeBoundingSphere(),l}const ke={afternoon:{sun:[-.7,.64,.32],sunCol:[1,.93,.8],sunI:6.3,outI:2.4,dark:[.15,.14,.185],bounce:[1,.78,.54],bounceI:1.2,jade:null,jadeI:1.5,sky:[.5,.68,1],skyI:.6,out:[.5,.62,.74],outAmb:1.45,shaft:.038,sheen:1.25,leak:[1,.9,.75],leakI:.8,wallK:.8,roof:1.2,roofJade:1.2,gate:.9,portal:"#8ff2d2",portalI:1,floorFill:.32,oil:[.5,.37,.29]},morning:{sun:[-.865,.276,.419],sunCol:[1,.88,.72],sunI:5.2,outI:2.1,dark:[.14,.155,.21],bounce:[1,.8,.56],bounceI:.85,jade:[.5,.68,.82],jadeI:.9,sky:[.6,.76,1],skyI:.6,out:[.5,.62,.84],outAmb:1.4,shaft:.045,sheen:1.4,leak:[.95,.95,1],leakI:1.2,wallK:.6,roof:1.5,roofJade:1.2,gate:.9,portal:"#ffd9a0",portalI:1,floorFill:.12,oil:[.74,.62,.54]},copper:{sun:[-.88,.208,.427],sunCol:[1,.5,.2],sunI:7.5,outI:2.6,dark:[.115,.1,.175],bounce:[1,.6,.32],bounceI:.82,jade:[.5,.36,.78],jadeI:.7,sky:[.62,.56,.82],skyI:.5,out:[.46,.55,.78],outAmb:1.55,shaft:.05,sheen:1.2,leak:[1.1,.75,.6],leakI:1.2,wallK:.42,roof:1.5,roofJade:1.4,gate:.8,portal:"#e9a6ff",portalI:1.1,floorFill:.1,oil:[.85,.74,.72]}};async function Ue(t,v={}){const d=t.rng.fork?t.rng.fork("house-opens-seaward-hero"):t.rng,m=t.quality?.detail??1,M=v.palette&&v.palette.length>=7?v.palette:Me,l={dark:new C.Color(M[0]),mid:new C.Color(M[1]),cream:new C.Color(M[2]),jade:new C.Color(M[3]),green:new C.Color(M[4]),gold:new C.Color(M[5]),magenta:new C.Color(M[6])};l.timber=l.mid.clone().lerp(new C.Color(.27,.19,.125),.66);const a=v.look||"afternoon",i=ke[a]||ke.afternoon,y=_(i.sun[0],i.sun[1],i.sun[2]).normalize(),h={...i,sun:y},n=Ce(d),o=(c,R)=>new C.Vector3(c[0]*R,c[1]*R,c[2]*R),x=i.jade||[l.jade.r*2.2,l.jade.g*1.6,l.jade.b*1.7],p={uSun:{value:y},uSunCol:{value:o(i.sunCol,i.sunI)},uOutSun:{value:o(i.sunCol,i.outI)},uAmbDark:{value:o(i.dark,1)},uBounce:{value:o(i.bounce,i.bounceI)},uJade:{value:o(x,i.jadeI)},uSkyIn:{value:o(i.sky,i.skyI)},uOutAmb:{value:o(i.out,i.outAmb)},uUnder:{value:o([.55,.45,.3],.4)},uBayL:{value:Array.from({length:13},()=>new C.Vector4(0,0,1,0))},uOpenR:{value:new Float32Array(13)},uOpenRoof:{value:new Float32Array(13).fill(-1)},uHos:{value:new C.Vector4(0,i.sheen,0,0)},uGold:{value:new C.Vector3(l.gold.r,l.gold.g,l.gold.b)},uLeak:{value:o(i.leak,i.leakI)},uWaveZ:{value:200},uChan:{value:new Float32Array(6)},uCalm:{value:new C.Vector4(0,0,0,0)},uShaft:{value:new C.Vector4((v.shafts??1)*i.shaft,0,0,0)},uShaftCol:{value:o(i.sunCol,1)},uGate:{value:new C.Vector4(ee[1],ee[2],ee[3],ge)},uScr:{value:new C.Vector4(0,0,0,i.floorFill??.1)},uOil:{value:o(i.oil||[1,1,1],1)},uLook2:{value:new C.Vector4(i.wallK,i.roof,i.roofJade,i.gate)},uPortalCol:{value:(()=>{const c=new C.Color(i.portal);return new C.Vector3(c.r,c.g,c.b).multiplyScalar(i.portalI)})()}};p.uBayL.value[0].set(F.sunburst,0,1,0);for(let c=1;c<=oe;c++){const R=n[c].left;p.uBayL.value[c].set(R.pat,R.reveal,R.seed,0)}for(const c of ne)p.uOpenRoof.value[c]=0;const u=()=>C.UniformsUtils.merge([C.UniformsLib.fog]),L=c=>{const R=u();for(const E in p)R[E]=p[E];return Object.assign(R,c||{})},P=()=>new C.ShaderMaterial({uniforms:L(),vertexShader:Re,fragmentShader:Se,vertexColors:!0,fog:!0,side:C.DoubleSide}),w=P(),V=new C.ShaderMaterial({uniforms:L(),vertexShader:Te,fragmentShader:Se,fog:!0,side:C.DoubleSide}),e=new C.ShaderMaterial({uniforms:L(),vertexShader:Be,fragmentShader:je,fog:!0,side:C.DoubleSide,transparent:!0,depthWrite:!1,blending:C.AdditiveBlending}),r=new C.Group;r.name="house-opens-seaward-hero";const N=qe(d,l);await t.yield();const g=4,k=[];for(let c=0;c<g;c++)k.push(new Pe);const s=c=>k[Math.min(g-1,Math.floor((c-1)/3))];for(let c=1;c<=oe;c++)Oe(s(c),N,l,n,c,v),await t.yield(),Ve(s(c),N,l,n,c),await t.yield();He(k[0],k[g-1],N,l,n),await t.yield();const S=[F.vine,F.sunburst,F.lozenge];if(he.forEach((c,R)=>Ie(s(Math.round(-c/X)+1),N,l,c,S[R],d.range(.3,6))),await t.yield(),v.verandah!==!1){const c=new Pe;Ee(c,N,l,-160,-320),k.push(c)}await t.yield();let f=0;for(const c of k){const R=new C.Mesh(c.geometry(),w);R.name="hos-shell",r.add(R),f+=c.count,await t.yield()}const T=Fe(d,n,l,v);for(const c of[!1,!0]){const R=T.filter($=>$.louvre===c),E=Ne(c);if(!R.length)continue;const Z=_e(R,E,V);Z.name=c?"hos-louvres":"hos-leaves",r.add(Z),f+=R.length*(E.attributes.position.count/3)}await t.yield();const q=new C.Mesh(Ye(h,m),e);q.name="hos-shafts",q.renderOrder=5,q.frustumCulled=!1,r.add(q),await t.yield();const b={waveZ:200,chan:[0,0,0,0,0],calm:0,lead:44,driven:!1,openL:new Float32Array(13),openR:new Float32Array(13)},B=c=>{if(c<=0)return 0;const R=Math.min(c/.85,1);return Math.min(1,R*R*(2.2-1.2*R))},I=c=>1-.5*b.calm*(1-re(3.3,4.6,c)),G=()=>{p.uWaveZ.value=b.waveZ,p.uCalm.value.x=b.calm;for(let R=0;R<5;R++)p.uChan.value[R]=b.chan[R];const c=B(b.chan[0]);b.openL[0]=b.openR[0]=c,p.uBayL.value[0].w=c,p.uOpenR.value[0]=c;for(let R=1;R<=oe;R++){const E=(n[R].zc-b.waveZ)/de;b.openL[R]=B(E)*I(E),b.openR[R]=B(E-.11)*I(E-.11),p.uBayL.value[R].w=b.openL[R],p.uOpenR.value[R]=b.openR[R],p.uOpenRoof.value[R]>=0&&(p.uOpenRoof.value[R]=B(E-.3)*I(E-.3))}p.uHos.value.z=c,p.uHos.value.w=re(.2,1,b.chan[4]),p.uScr.value.x=B(b.chan[1]),p.uScr.value.y=B(b.chan[2]),p.uScr.value.z=B(b.chan[3])},Y=[[0,160],[.1,90],[.21,14],[.37,-120],[.46,-188],[.61,-302],[.7,-350],[.88,-480],[1,-556]],K=c=>{for(let R=1;R<Y.length;R++)if(c<=Y[R][0]){const E=Y[R-1],Z=Y[R];return E[1]+(Z[1]-E[1])*(c-E[0])/(Z[0]-E[0])}return-556},te=(c,R)=>{b.driven=!0;const E=R??K(c),Z=86-26*re(-120,-215,E)+40*re(-250,-290,E);b.lead=Z,b.waveZ=c<=0?200:E-Z,b.chan[0]=c<=0?0:Math.max(0,(69.3-E)/27.7),b.chan[1]=c<=0?0:Math.max(0,(he[0]-4-b.waveZ)/26),b.chan[2]=c<=0?0:Math.max(0,(-250-E)/20),b.chan[3]=c<=0?0:Math.max(0,(-258-E)/20),b.chan[4]=c<=0?0:Math.max(0,(-405-E)/42),b.calm=v.rare&&c>0?re(-357,-375,E)*(1-re(-390,-408,E)):0,G()},U=c=>{b.driven=!0,b.waveZ=c,G()},J=(c,R)=>{b.driven=!0,b.chan[c]=R,G()},le=c=>{b.calm=c,G()},ie=(c,R=-1)=>(R<0?b.openL:b.openR)[Math.max(0,Math.min(oe,c))],fe=(c,R=-1)=>{const E=Math.min(12,Math.max(0,-c/X+.5)),Z=Math.min(11,Math.floor(E)),$=E-Z,pe=R<0?b.openL:b.openR;return pe[Z]+(pe[Z+1]-pe[Z])*$*$*(3-2*$)};G();const ve={portalSeat:{position:_(ee[0],ee[1],ee[2]),normal:_(0,0,1),radius:ee[3],color:i.portal},moonGate:{center:_(0,xe,-W),radius:ge},flyThrough:[_(0,7,160),_(0,7,92),_(0,23,14),_(0,23,-60),_(0,23,-120),_(4,23,-150),_(20,23,-176),_(39,23,-190),_(47.5,23,-208),_(49.5,23,-222),_(49,23,-235),_(43.5,23,-247.5),_(33,23,-256.5),_(22,23,-264),_(12.5,23,-273.5),_(5.5,23,-285.5),_(1.5,23,-299),_(0,23,-314),_(0,23,-350),_(0,23.36,-400),_(0,23.73,-450),_(0,23.95,-480),_(0,24.2,-515),_(ee[0],ee[1],ee[2])],door:{z:0,width:22,height:Q,floorY:z},screens:he.map(c=>({z:c,width:22,height:Q})),foldingWalls:we.map(c=>({bay:c,x:j,z0:n[c].zc+15,z1:n[c].zc-15,stackZ:n[c].zc+15})),bays:n.slice(1).map(c=>({k:c.k,zc:c.zc,left:{...c.left},right:{...c.right}})),bayCenter:c=>_(0,z,-X*c+X/2),roofFlaps:ne.flatMap(c=>[-9,9].flatMap(R=>[-8,8].map(E=>_(-j+.8*(19+E),H+.6*(19+E),-X*(c-1)-20-R)))),cageHooks:[-18,-9,0,9,18].map((c,R)=>_(c,H-.8,-140+(R%2?-6:6))),cradle:_(14,21,-190),verandah:{x0:j,x1:64,y:15,z0:-160,z1:-320,railY:20,roofY0:47.5,roofY1:39},endWall:{z:-W,hinge:_(0,z,-W),width:30,height:30},rampTip:_(0,6,-508),sunDir:y.clone(),viewpoints:[{name:"entry",position:_(0,7,160),target:_(0,30,0)},{name:"three states",position:_(0,23,-40),target:_(-6,24,-130)},{name:"verandah",position:_(48,23,-215),target:_(36,26,-270)},{name:"tunnel",position:_(0,23,-332),target:_(0,24,-480)},{name:"outside, sunny side",position:_(-150,60,120),target:_(0,40,-200)}]},se=250,ce=80,ue=_(0,40,-W/2);return{object:r,radius:se,height:ce,center:ue,anchors:ve,ground:!0,groundY:0,setProgress:te,setWaveZ:U,setChannel:J,setCalm:le,bayOpen:ie,openAt:fe,light:{uniforms:p,glsl:be},woodMaterial:P,uniforms:p,plan:n,lead:()=>b.lead,stats:{triangles:f,leaves:T.length},update(c,R,E){if(p.uHos.value.x=R,!b.driven){const Z=70-R*26%760;b.waveZ=Z,b.chan[0]=Math.max(0,(20-Z)/de),b.chan[4]=Math.max(0,(-W+44-Z)/(de*1.6));for(let $=0;$<3;$++)b.chan[1+$]=Math.max(0,(he[$]+20-Z)/de);G()}},dispose(){}}}export{Ue as buildHero};
