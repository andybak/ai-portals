import*as g from"three";import{makePath as jo,makeRng as _o,hashSeed as Ko,clamp as X0,lerp as K0,smoothstep as B0}from"../kit/core.js";import*as A0 from"../kit/interior.js";import*as Vo from"../kit/fx.js";import{buildHero as Uo,makeGlassKit as Wo,GLSL_GUST as dt}from"../parts/to-the-brim.js";const I=Math.PI,J=I*2,Wt=["#F3E3BF","#7A0F1E","#E8A23A","#1A120C","#3A2416","#C9A24A","#16233F"],Oo=[[-29.2,8.3,207.548],[-12.93,8.6,195.96],[-3.88,8.6,185.33],[-.22,8.35,171.86],[-1.32,7.43,147.6],[0,7.4,132],[10,9.4,90],[20,11.6,44],[26,13,4],[27.5,13.4,-30],[24,12.2,-62],[15,9.8,-90],[5.5,7.9,-112],[.3,7.35,-127],[-1,7.6,-138],[-.9,8.3,-147],[.6,9.4,-154.5],[2.9,10.5,-161],[5,11.1,-167],[5.9,11.5,-173],[4.6,11.8,-179],[3.3,11.4,-185],[1.8,10.3,-192],[.6,8.75,-199],[.05,7.6,-206],[0,7.2,-218],[0,7.2,-231],[0,7.2,-240],[0,7.2,-249.6]],Be=[-22,-11,0,11,22],fe=21.6,Zo=20.8,H0=3.2,Ot=[196,164,132,100,68],_0={x:0,z:-30,tiers:10},se=t=>3+1.8*t,ne=t=>20-1.9*t,Xo=t=>5*Math.max(2,Math.round(J*(ne(t)-.5)/6.5)),Zt=t=>32+16*t,Xt=t=>-88-16*t,U0=0,P0=1,Yt=2,je=3,ht=4,Q=5,t0=6,mt=7,L=(t,e=0,s=0,n=0)=>[t,e,s,n],_e=`
float h11(float p){ p = fract(p*0.1031); p *= p+33.33; p *= p+p; return fract(p); }
float h31(vec3 p){ p = fract(p*0.1031); p += dot(p, p.zyx+31.32); return fract((p.x+p.y)*p.z); }
float vnoise(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x), mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x), f.y),
             mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x), mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x), f.y), f.z); }
float breath(vec3 fp, float t){ float k = h31(floor(fp*7.0)+3.0);
  return 1.0 + 0.045*sin(t*(3.1+3.0*k)+k*40.0) + 0.025*sin(t*(5.3+2.6*k)+k*17.0); }
`,Ke=`
const vec2 GB = vec2(0.309, 0.951);
`,Jt=`
uniform vec3 uMoonDir; uniform float uMoonI, uDawn, uSkyGain;
vec3 nightSkyH(vec3 d, float t, float hk){                                   // (hk: how much of the moon's wide halo is shown; the disc is always whole)
  float up = clamp(d.y, -0.2, 1.0);
  vec3 col = mix(vec3(0.030,0.052,0.125), vec3(0.006,0.011,0.034), smoothstep(-0.05,0.7,up));
  col += uDawn*vec3(0.05,0.16,0.52)*(0.25+0.75*smoothstep(-0.5,0.9,d.x))*exp(-max(up,0.0)*1.3);
  col += uDawn*vec3(0.30,0.20,0.16)*smoothstep(0.2,1.0,d.x)*exp(-max(up,0.0)*9.0);
  vec3 q = d*70.0; vec3 g = floor(q), f = fract(q)-0.5; float h = h31(g);
  float star = step(0.90,h)*(1.0-smoothstep(0.0,0.30,length(f)))*(0.6+0.4*sin(t*(1.0+3.0*h)+h*90.0));
  vec2 cp = d.xz/(abs(d.y)+0.35); float cl = vnoise(vec3(cp*1.6+vec2(t*0.012,0.0), 3.0))*0.6+vnoise(vec3(cp*4.1+vec2(t*0.02,1.7), 7.0))*0.4;
  float band = smoothstep(0.52,0.78,cl)*smoothstep(0.02,0.2,up)*(1.0-smoothstep(0.45,0.8,up));
  float md = max(dot(d,uMoonDir),0.0); float m2 = md*md; float m8 = m2*m2*m2*m2;
  float disc = smoothstep(0.99905,0.99940,md);
  col += (1.0-band)*(1.0-uDawn*0.7)*star*vec3(1.5,1.6,2.0)*(0.7+h*1.3);
  col = mix(col, vec3(0.085,0.105,0.17)+uMoonI*vec3(0.10,0.12,0.16)*m8+uDawn*vec3(0.06,0.10,0.22), band*0.75);
  col += uMoonI*((vec3(0.16,0.19,0.26)*m8*m8*m8 + vec3(0.07,0.09,0.15)*m2)*hk + disc*vec3(2.3,2.2,1.9)*(1.0-band*0.5)*(0.82+0.18*vnoise(d*38.0)));
  return col*uSkyGain;
}
vec3 nightSky(vec3 d, float t){ return nightSkyH(d, t, 1.0); }`,Yo=`
#include <common>
#include <fog_pars_vertex>
attribute vec3 color; attribute vec4 surf;
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying vec4 vS;
void main(){
  vec3 p = position; vec3 n = normal;
  #ifdef USE_INSTANCING
    p = (instanceMatrix*vec4(p,1.0)).xyz; n = mat3(instanceMatrix)*n;
  #endif
  vec4 wp = modelMatrix*vec4(p,1.0);
  vW = wp.xyz; vN = normalize(mat3(modelMatrix)*n + vec3(0.0,1e-6,0.0)); vC = color; vS = surf;
  #ifdef USE_INSTANCING_COLOR
    if (surf.x > 5.5) vC *= instanceColor;                                  // (an instance's colour dyes its cloth, wax and leaf; its metal and wood keep their own)
  #endif
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Jo=`
#include <common>
#include <fog_pars_fragment>
uniform float uTime, uLat, uTabI, uChI, uPyI, uTrI, uStub, uGain, uPool, uBase, uIsle, uPaneGain, uGustAmp, uGustTail, uBlueE, uWall, uCross, uTierFill, uSheen, uPairE, uRivE, uPix, uGwPaneW;
uniform vec3 uFlameCol, uAmb, uFill, uFillDir, uTierDir, uMoonCol, uRunCol, uChSway, uChSway2, uGwE, uGwW, uWineC, uChoir, uGwGlassW; uniform vec4 uGapE;
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying vec4 vS;
// the sway of the chandelier that hangs at z (the rows hang in two sets that sway apart: the nave's rows of z 196, 132
// and 68 and the choir's first and last in one, the rows of z 164 and 100 and the choir's middle one in the other)
vec3 chSw(float z){ bool two = z > 0.0 ? mod(floor((196.0-z)/32.0+0.5), 2.0) > 0.5 : abs(z+155.0) < 1.0; return two ? uChSway2 : uChSway; }
`+_e+Ke+dt+Jt+`
float wrapL(vec3 N, vec3 L, float d){ return max(dot(N,L)/max(d,1e-3)*0.78+0.22, 0.0); }
// the transepts' round tables stand as one company either side, in three lines along z 8.1 m apart (x 38.4 and 54.6: three
// each, z -21.6, -31, -40.4; x 46.5: four, z -16.9 to -45.1), 9.4 m apart in a line: the table nearest p (x, z)
vec2 roundAt(vec2 p){ float c = clamp(floor((abs(p.x)-38.4)/8.1+0.5), 0.0, 2.0), mid = 1.0-abs(c-1.0), z0 = mix(-21.6, -16.9, mid);
  return vec2((p.x > 0.0 ? 1.0 : -1.0)*(38.4+8.1*c), z0-9.4*clamp(floor((z0-p.y)/9.4+0.5), 0.0, 2.0+mid)); }
void pointL(vec3 P, vec3 N, vec3 q, float I, float k, inout float E, inout vec3 Ld){
  vec3 L = q-P; float d2 = dot(L,L); float d = sqrt(max(d2,1e-4));
  float e = I*wrapL(N,L,d)/(1.0+d2*k); E += e; Ld += L/d*e; }
void lineZ(vec3 P, vec3 N, vec3 q0, float z1, float I, float k, inout float E, inout vec3 Ld){
  vec3 q = vec3(q0.x, q0.y, clamp(P.z, q0.z, z1)); vec3 L = q-P; float d = sqrt(max(dot(L,L),1e-4));
  float e = I*wrapL(N,L,d)/(1.0+d*k); E += e; Ld += L/d*e; }
// every candle the hall holds, found by arithmetic on the place. The nave's and the pyramid's candles (En) do not
// reach round the crossing into the choir: there the dais is the one lit island, the avenue's trees make pools along
// the carpet, the two side tables run as lit roads down the walls (the west one unlit north of z -172: the dark end).
void hallLight(vec3 P, vec3 N, float kind, out float E, out vec3 Ld){
  E = 0.0; Ld = vec3(0.0,1e-4,0.0);
  float En = 0.0; vec3 Ln = vec3(0.0);
  float fy = 4.3-uStub; float isLinen = step(2.5,kind)*step(kind,3.5);
  for (int i = 0; i < 5; i++) {
    float x = float(i-2)*11.0; float dx = abs(P.x-x);
    float hgt = P.y + (fy-P.y)*clamp((dx-2.4)/max(dx,1e-3), 0.0, 1.0);      // the table hides its own candles from below
    float vis = P.y > 2.95 ? 1.0 : smoothstep(2.7,3.5,hgt);
    float own = 1.0-isLinen*step(dx,2.6)*step(2.9,P.y);
    lineZ(P,N, vec3(x,fy,20.0), 200.0, uTabI*vis*own, 0.55, En, Ln);
    lineZ(P,N, vec3(x,15.2,60.0), 204.0, uChI*0.6, 0.16, En, Ln);
  }
  float cx = clamp(floor(P.x/11.0+0.5), -2.0, 2.0)*11.0, cz = 68.0+32.0*clamp(floor((P.z-68.0)/32.0+0.5), 0.0, 4.0);
  pointL(P,N, vec3(cx,14.8,cz)+chSw(cz), uChI*4.4, 0.022, En, Ln);          // the nearest chandelier: its pool sways with it
  if (kind < 3.5 || kind > 4.5) {                                          // THE CROSSING: the pyramid's three hundred flames, the corona and
    vec3 q = vec3(0.0, clamp(P.y,6.0,30.0), -30.0); vec3 L = q-P;         // the ring of trees are together one great soft lamp, which picks the
    float d2 = dot(L,L); float d = sqrt(max(d2,1e-4));                    // transept walls, the piers and the beamed ceiling out of the dark
    float e = uPyI*uCross*wrapL(N,L,d)/(1.0+d2*0.00042); En += e; Ln += L/d*e; }
  if (kind < 1.5) {                                                       // the five linen roads glow upward on the nave's walls and roof
    float e = uTabI*0.26*(0.62-0.38*N.y)*smoothstep(-6.0,34.0,P.z)*(1.0-0.5*smoothstep(204.0,236.0,P.z))/(1.0+max(P.y-4.0,0.0)*0.016);
    En += e; Ln += vec3(-P.x*0.03,-1.0,0.0)*e; }
  pointL(P,N, vec3(0.0,34.0,-30.0), uPyI*4.5, 0.008, En, Ln);              // the corona
  float sx = P.x > 0.0 ? 32.3 : -32.3;
  pointL(P,N, vec3(sx,10.5, clamp(24.0+16.0*floor((P.z-24.0)/16.0+0.5), 24.0, 216.0)), 1.9, 0.05, En, Ln);
  { vec2 r = P.xz-vec2(0.0,-30.0); float ta = (floor(atan(r.y, r.x+1e-5)/0.5235988)+0.5)*0.5235988;   // the ring of twelve trees round the pyramid
    pointL(P,N, vec3(24.0*cos(ta),8.6,-30.0+24.0*sin(ta)), uTrI*2.6, 0.06, En, Ln);
    float rl = max(length(r),1e-3); vec3 q = vec3(r.x/rl*24.0, 8.6, -30.0+r.y/rl*24.0); vec3 L = q-P; float d = sqrt(max(dot(L,L),1e-4));
    float e = uTrI*1.0*wrapL(N,L,d)/(1.0+d*0.3); En += e; Ln += L/d*e; }
  pointL(P,N, vec3(P.x > 0.0 ? 60.3 : -60.3, 10.5, P.z > -31.0 ? -5.0 : -57.0), 2.6, 0.03, En, Ln);          // the sconces of the transepts' dressers: by each great window,
  pointL(P,N, vec3(P.x > 0.0 ? 41.0 : -41.0, 10.5, P.z > -31.0 ? 8.3 : -70.3), 2.2, 0.04, En, Ln);          // and on the side walls by the crossing
  pointL(P,N, vec3(P.x > 0.0 ? 56.0 : -56.0, 10.8, P.z > -31.0 ? 8.7 : -70.7), 2.2*step(36.0,abs(P.x)), 0.07, En, Ln);   // the mirror sconces under the verdures of the transepts' outer bays
  { float ax = abs(P.x), sx = P.x > 0.0 ? 1.0 : -1.0;                       // the transepts' round tables: the candelabrum of the nearest and of the nearest in the next line
    vec2 r1 = roundAt(P.xz), r2 = roundAt(vec2(P.x+(ax > abs(r1.x) ? 8.1 : -8.1)*sx, P.z));
    pointL(P,N, vec3(r1.x, 7.7, r1.y), uTrI*2.0*step(30.0,ax), 0.07, En, Ln);
    pointL(P,N, vec3(r2.x, 7.7, r2.y), uTrI*2.0*step(30.0,ax)*step(0.5,abs(r2.x-r1.x)), 0.07, En, Ln); }
  float nave = mix(0.08, 1.0, smoothstep(-106.0,-60.0,P.z));
  E += En*nave; Ld += Ln*nave;
  // THE CHOIR: three chandeliers that light little but themselves, the dais ranks, the side tables along the walls
  { float kc = clamp(floor((-92.0-P.z)/63.0+0.5),0.0,2.0);                    // (the one before the north door hangs 3.5 m higher)
    pointL(P,N, vec3(0.0, kc > 1.5 ? 21.3 : 17.8, -92.0-63.0*kc)+chSw(-92.0-63.0*kc), uChI*2.6, 0.03, E, Ld); }
  for (int i = 0; i < 2; i++) {
    float x = float(i)*10.0-5.0; float dx = abs(P.x-x);
    float own = 1.0-isLinen*step(dx,1.7)*step(5.9,P.y);
    float vis = P.y > 5.95 ? 1.0 : smoothstep(1.5,3.4,dx);
    lineZ(P,N, vec3(x,7.3-uStub,-168.4), -130.0, uTabI*uIsle*own*vis, 0.42, E, Ld); }
  pointL(P,N, vec3(-2.9,7.6,-178.4), 4.2, 0.05, E, Ld);                    // the six candle stands of the great glass (on the west half of its plinth), felt from their middle
  { float tx = P.x > 0.0 ? 17.2 : -17.2;                      // the four trees on the dais's corners
    pointL(P,N, vec3(tx,11.6, P.z > -158.0 ? -126.0 : -190.0), uTrI*3.0*(P.x < 0.0 && P.z <= -158.0 ? 0.0 : 1.0), 0.07, E, Ld); }   // (the north-west one stands unlit: THE DARK END)
  // THE CHOIR'S SIDE TABLES (x 26.5 and -26.5, a low candle every 3.2 m from z -81.6 to -228.8): two more lit roads past the
  // dais to the north door. THE DARK END (the west side north of z -172): the west one carries no lit candle from z -172
  // to its north end, so that the great glass's brim stands against dark as seen from the line's east pass
  { float tx = P.x > 0.0 ? 26.5 : -26.5; float dx = abs(P.x-tx); float fyc = 4.3-uStub;
    float hgt = P.y + (fyc-P.y)*clamp((dx-2.4)/max(dx,1e-3), 0.0, 1.0);
    float vis = P.y > 2.95 ? 1.0 : smoothstep(2.7,3.5,hgt);
    float own = 1.0-isLinen*step(dx,2.6)*step(2.9,P.y);
    float I = uTabI*vis*own*0.8;
    if (P.x > 0.0) lineZ(P,N, vec3(tx,fyc,-228.8), -81.6, I, 0.55, E, Ld);
    else lineZ(P,N, vec3(tx,fyc,-171.2), -81.6, I, 0.55, E, Ld); }
  // THE AVENUE. Its candle trees (x 12.5 and -12.5): every 9 m from z -62.5 to z -107.5 before the dais steps (the east row
  // stops where the flown line crosses it: uPairE = its last station) and from z -210.5 to -228.5 before the north door
  // (the two trees of the row that a place stands between, so that the light's way does not jump abreast of a tree's neighbour)
  { float z0 = P.z > -160.0 ? -62.5 : -210.5, kn = P.z > -160.0 ? (P.x > 0.0 ? uPairE : 5.0) : 2.0, k0 = clamp(floor((z0-P.z)/9.0), 0.0, max(kn-1.0, 0.0));
    for (int i = 0; i < 2; i++) { float kk = k0+float(i);
      pointL(P,N, vec3(P.x > 0.0 ? 12.5 : -12.5, 9.4, z0-9.0*kk), uTrI*3.0*step(kk, kn+0.5)*(P.x < 0.0 && P.z <= -160.0 ? 0.0 : 1.0), 0.07, E, Ld); } }   // (the west row before the door: THE DARK END, unlit)
  // its orange trees' lanterns (rows at x 9 and 16 either side, a ring of five 8.6 m up): the nearest tree of the nearer row,
  // every 9 m from z -58 to -112 and from z -206 to -233 (the east rows have their gaps where the line crosses: uGapE; the
  // west rows before the north door are of THE DARK END: unlit)
  { float xr = abs(P.x) < 12.5 ? 9.0 : 16.0, kk = P.z > -160.0 ? clamp(floor((-58.0-P.z)/9.0+0.5), 0.0, 6.0) : clamp(floor((-206.0-P.z)/9.0+0.5), 0.0, 3.0);
    vec2 gp = xr < 12.0 ? uGapE.xy : uGapE.zw; float on = (P.x > 0.0 && P.z > -160.0 && kk >= gp.x && kk <= gp.y) || (P.x < 0.0 && P.z < -160.0) ? 0.0 : 1.0;
    pointL(P,N, vec3(P.x > 0.0 ? xr : -xr, 8.6, (P.z > -160.0 ? -58.0 : -206.0)-9.0*kk), 1.5*on, 0.09, E, Ld); }
  // THE RIVER OF LIGHT: low candles in cups along the carpet (x 3.1 and -3.1 from z -58 to -115, the east row to uRivE; 5.2 m
  // either side of the axis from z -201 to -237): two lit lines on the floor
  { float sx = P.x > 0.0 ? 1.0 : -1.0;
    if (P.z > -160.0) lineZ(P,N, vec3(sx*3.1,0.4, P.x > 0.0 ? uRivE : -115.0), -58.0, uTabI*0.8, 1.5, E, Ld);
    else lineZ(P,N, vec3(sx*5.2,0.4,-237.0), -201.0, uTabI*0.8, 1.5, E, Ld); }
  { vec2 c = vec2(P.x, P.z+158.0), hb = vec2(21.4, 40.0), qd = clamp(c, -hb, hb);      // the massed candles on the dais steps: a band of light all
    vec2 de = hb-abs(c);                                                               // round the dais (x 21.4 and -21.4, z -118 and -198, 3.2 m up),
    if (de.x > 0.0 && de.y > 0.0) { if (de.x < de.y) qd.x = c.x > 0.0 ? hb.x : -hb.x; else qd.y = c.y > 0.0 ? hb.y : -hb.y; }   // felt from its nearest place
    vec3 L = vec3(qd.x, 3.2, qd.y-158.0)-P; float d = sqrt(max(dot(L,L),1e-4));
    float dkE = qd.x < 0.0 && qd.y < -12.0 && (qd.x < -21.0 || qd.y < -39.5) ? 0.0 : 1.0;   // (THE DARK END: the north-west quarter carries no candle)
    float e = dkE*uTabI*1.5*wrapL(N,L,d)/(1.0+d*0.5); E += e; Ld += L/d*e; }
  // and each cluster's own pool, on its tread and on the riser behind it: the nearest cluster of this place's tread (tread
  // t, 0 to 2, lies at y t + 1; the riser from y t + 1 to t + 2 stands behind it) on the south or north flight (every 2.5 m
  // from 4.4 + 0.8 t m either side of the axis) and on the side flight (every 2.5 m from z -118.6 - t), felt 0.8 m up
  if (P.y > 0.6 && P.y < 4.4 && P.z < -114.0 && P.z > -202.0 && abs(P.x) < 24.0) {
    float ti = clamp(floor(P.y+0.02), 1.0, 3.0)-1.0, sx = P.x > 0.0 ? 1.0 : -1.0, x0 = 4.4+0.8*ti, z0 = -118.6-ti;
    float xj = x0+2.5*clamp(floor((abs(P.x)-x0)/2.5+0.5), 0.0, floor((20.7-0.7*ti-x0)/2.5+0.001)), zf = P.z > -158.0 ? -117.5-ti : -198.5+ti;
    float zj = z0-2.5*clamp(floor((z0-P.z)/2.5+0.5), 0.0, floor((z0+197.4-ti)/2.5+0.001));
    pointL(P,N, vec3(sx*xj, ti+1.8, zf), uTabI*(sx < 0.0 && zf < -170.0 ? 0.0 : 1.7), 1.5, E, Ld);
    pointL(P,N, vec3(sx*(21.75-0.7*ti), ti+1.8, zj), uTabI*(sx < 0.0 && zj < -170.0 ? 0.0 : 1.7), 1.5, E, Ld); }
  float wz = clamp(-96.0-16.0*floor((-96.0-P.z)/16.0+0.5), -240.0, -80.0);                  // the sconces of every bay (dressers and verdures)
  pointL(P,N, vec3(P.x > 0.0 ? 32.7 : -32.7, 10.8, wz), (wz < -168.0 && (wz > -200.0 || (P.x < 0.0 && wz > -232.0))) ? 0.0 : 2.4, 0.09, E, Ld);   // (none abreast of the great glass, z -176 and -192; none on the west wall at z -208 and -224: THE DARK END)
  pointL(P,N, vec3(P.x > 0.0 ? 12.5 : -12.5, 8.6, -238.0), uTrI*3.2, 0.08, E, Ld);           // the two trees at the doorway
  pointL(P,N, vec3((P.x > 0.0 ? 1.0 : -1.0)*(14.5+8.25*clamp(floor((abs(P.x)-14.5)/8.25+0.5),0.0,2.0)), 16.6, -243.8), 2.4*step(P.z,-200.0), 0.1, E, Ld);   // the sconces of the shelved north wall
  pointL(P,N, vec3((P.x > 0.0 ? 1.0 : -1.0)*(14.5+8.25*clamp(floor((abs(P.x)-14.5)/8.25+0.5),0.0,2.0)), 8.1, -244.4), 3.0*step(P.z,-200.0), 0.12, E, Ld);    // and the three-candle sconces of the gilt pilasters under them
  if (P.z < -222.0) {                                                           // the ring of cups round the north arch (up both jambs at x 9.4 and -9.4, round the head 9.4 m from (0, 11)): felt from its nearest place
    vec2 a2 = vec2(P.x, max(P.y-11.0, 0.0)); float al = max(length(a2),1e-3);
    vec3 q = P.y > 11.0 ? vec3(a2.x/al*9.4, 11.0+a2.y/al*9.4, -244.6) : vec3(P.x > 0.0 ? 9.4 : -9.4, max(P.y,1.2), -244.6);
    pointL(P,N, q, uTabI*2.0, 0.45, E, Ld); }
  E *= 1.0 + 0.065*sin(uTime*2.3+P.z*0.21+P.x*0.13) + 0.045*sin(uTime*3.7-P.z*0.33+P.y*0.4);  // the flames breathe together in slow waves
}
// 1 between a and b, 0 outside, its edges fa wide
float bnd(float a, float b, float x, float fa){ return smoothstep(a-fa,a+fa,x)*(1.0-smoothstep(b-fa,b+fa,x)); }
// A ROW OF FLAMES in the polished floor: flames every lat metres along z at x0 (the lattice through z0, lit from za to zb),
// each a streak wl wide and wa long toward the eye (vd: the eye's bearing in plan; h: where the mirrored ray meets the flames'
// height). The whole row is summed, not its nearest few: where the streaks overlap they run into one unbroken road of
// light (the lattice's sum taken as its mean and first harmonic), where they stand apart each is its own (the nearest
// three); a lone streak's peak is 1 and a full road's level is 1
float rowStreak(vec2 h, float x0, float z0, float lat, float za, float zb, vec2 vd, float wl, float wa){
  float dx = h.x-x0, iw = 1.0/(wl*wl), ia = 1.0/(wa*wa);
  float A = vd.x*vd.x*iw + vd.y*vd.y*ia, B = dx*vd.x*vd.y*(ia-iw);
  float zc = h.y + B/A;                                                       // the place on the row whose streak passes through here
  float core = exp(-dx*dx*iw*ia/A), dens = sqrt(3.14159/A)/lat, g = exp(-9.8696/(A*lat*lat));
  float k0 = floor((zc-z0)/lat+0.5), nr = 0.0;
  for (int j = -1; j <= 1; j++) { float t = zc-(z0+lat*(k0+float(j))); nr += exp(-A*t*t); }
  float s = mix(dens*(1.0+2.0*g*cos(6.2831853*(zc-z0)/lat)), nr, smoothstep(0.3,0.45,g));
  return s*core/sqrt(1.0+dens*dens)*smoothstep(za-0.5*lat, za, zc)*(1.0-smoothstep(zb, zb+0.5*lat, zc)); }
// the rare breath: its front travels south (gustD, the part file's: the front's measure as a flame at z feels it, the same
// metres flown to come and to go wherever the front is). Where it passes, flames gutter low in a band and lean on the
// breath's one bearing behind it, recovering over uGustTail of that measure; their pools slide and dip with them
float gustLean(float z){ float dz = gustD(z); return uGustAmp*(dz > 0.0 ? exp(-dz*dz/60.0) : exp(dz/max(uGustTail,1.0))); }
float gustGut(float z){ float dz = gustD(z)+7.0; return uGustAmp*exp(-dz*dz/260.0); }
float flameE(vec3 P, vec3 N, vec3 fp, inout vec3 Ld){
  float gu = min(gustLean(fp.z),1.2), gt = min(gustGut(fp.z),1.0); float sk = h31(floor(fp*7.0)+3.0);
  vec3 L = fp+vec3(1.58*GB.x*gu+0.17*sin(uTime*(1.3+1.2*sk)+sk*50.0),-0.2*gu,1.58*GB.y*gu+0.17*cos(uTime*(1.1+1.0*sk)+sk*23.0))-P; float d2 = dot(L,L); float d = sqrt(max(d2,1e-4));
  float e = (1.0-0.5*gt)*breath(fp,uTime)*max(dot(N,L)/d*0.8+0.2,0.0)/(1.0+d2*0.55)*exp(-(L.x*L.x+L.z*L.z)*0.42); Ld += L/d*e; return e; }
// a flame's image in the polished floor: a soft streak stretched toward the eye (h = where the mirrored ray meets the
// flame's height, f = the flame in plan, vd = the eye's bearing in plan)
float streak(vec2 h, vec2 f, vec2 vd, float wl, float wa){
  vec2 d = h-f; float a = dot(d,vd), l = dot(d,vec2(-vd.y,vd.x)); return exp(-l*l/(wl*wl)-a*a/(wa*wa)); }
float latticePool(vec3 P, vec3 N, float cx, float z0, float z1, float fy, float lat, inout vec3 Ld){
  float k0 = floor((P.z-z0)/lat+0.5); float s = 0.0;
  for (int j = -1; j <= 1; j++) { float zf = z0+lat*(k0+float(j));
    s += step(z0-0.1,zf)*step(zf,z1+0.1)*flameE(P,N,vec3(cx,fy,zf),Ld); }
  return s; }
float tierPool(vec3 P, vec3 N, float R, float n, float fy, inout vec3 Ld){
  vec2 r = P.xz-vec2(0.0,-30.0); float ang = atan(r.y, r.x+1e-5); float st = 6.2831853/max(n,1.0); float k0 = floor(ang/st+0.5); float s = 0.0;
  for (int j = -1; j <= 1; j++) { float a = st*(k0+float(j)); s += flameE(P,N,vec3(R*cos(a),fy,-30.0+R*sin(a)),Ld); }
  return s*step(0.5,n); }
// THE GREAT WINDOWS of the transepts' end walls (x 62 and -62, centred on z -31): the opening with its bars as light sees
// it (dz: metres from the window's middle, hy: height; soft: how blurred). Four mullions, two transoms, three lesser
// mullions in the head: the same measures as greatWindow() builds
float gwShape(float dz, float hy, float soft){
  float az = abs(dz); float r = hy > 27.0 ? length(vec2(dz, hy-27.0)) : az;
  float inside = smoothstep(0.0,soft,11.0-r)*smoothstep(7.0,7.0+soft,hy);
  float mull = smoothstep(0.35,0.35+soft, min(abs(az-2.2), abs(az-6.6)));
  float tr = smoothstep(0.3,0.3+soft, min(abs(hy-17.0), abs(hy-27.0)));
  float sub = mix(1.0, smoothstep(0.2,0.2+soft, min(az, abs(az-4.4))), step(27.0,hy));
  return inside*mull*tr*sub; }
// THE COLD LIGHT of a great window, in every look: the night's own light falls steeply through it (down 0.72, inward 0.69)
// and lies on the transept's floor and table tops as one long blue-silver patch with the bars' shadows in it, reaching
// toward the pyramid and dying before it (gone 36 m from the wall); whatever faces the window takes a cool edge that
// falls off with the distance from the glass. gwc: its colour and strength on this side (uGwE east, uGwW west)
float gwLight(vec3 P, vec3 N, out vec3 gwc){
  float sd = P.x > 0.0 ? 1.0 : -1.0; gwc = P.x > 0.0 ? uGwE : uGwW;
  float d = 62.0-abs(P.x); float inT = step(-71.8,P.z)*step(P.z,9.8)*step(0.4,d);
  float pat = gwShape(P.z+31.0, P.y+0.72*d/0.69, 0.25+0.035*d)*(1.0-smoothstep(20.0,36.0,d))*smoothstep(0.3,0.8,N.y);
  float nf = max(dot(N, vec3(sd*0.94,0.34,0.0)), 0.0);
  float edge = nf*nf*exp(-d*0.045)*0.55*(1.0-smoothstep(27.0,34.0,d));
  return inT*(pat+edge); }
// the moon through the west windows: long silver bars
float winShape(float du, float hy){ float dy = max(hy-25.4,0.0); float hw = sqrt(max(6.76-dy*dy,0.0)); float au = abs(du);     // a side window as light sees it: 5.2 m wide, two mullions, a transom
  return smoothstep(0.0,0.6,hw-au)*smoothstep(12.0,12.6,hy)*smoothstep(0.12,0.4,abs(au-0.87))*smoothstep(0.1,0.35,abs(hy-20.3)); }
float moonBar(vec3 P, vec3 N){
  float nd = max(dot(N,uMoonDir),0.0); nd = nd*(0.3+0.7*nd)+0.5*max(N.y,0.0);
  float mx = min(uMoonDir.x,-1e-3);
  float t = (-34.0-P.x)/mx; vec3 h = P+uMoonDir*max(t,0.0);
  float inRange = step(24.0,h.z)*step(h.z,232.0) + step(-240.0,h.z)*step(h.z,-80.0); inRange *= step(0.5,t);
  float hzw = h.z + (h.z < -72.0 ? 8.0 : 0.0);                               // (the choir's windows stand 8 m off the nave's lattice of 16 m)
  float bar = winShape(hzw-16.0*floor(hzw/16.0+0.5), h.y)*inRange*step(-33.8,P.x);
  // THE CROSSING: the moon stands in the west great window (x -62) and lays its tracery in silver over the crossing floor,
  // the pyramid's west flank and on into the east transept
  float t3 = (-62.0-P.x)/mx; vec3 h3 = P+uMoonDir*max(t3,0.0);
  bar += gwShape(h3.z+31.0, h3.y, 0.3+0.006*t3)*step(0.5,t3)*step(-71.8,P.z)*step(P.z,9.8);
  return nd*min(bar,1.0)*uMoonI; }
float damask(vec2 p){ float f = sin(p.x*3.0+sin(p.y*2.0)*1.2)*sin(p.y*3.0+cos(p.x*2.0)*1.2); return smoothstep(0.05,0.35,f); }   // (its mean: 0.34)
// A PATTERN IS FILTERED BY A PIXEL'S FOOTPRINT, never by distance. foot = how many metres of the surface one pixel covers
// (the screen derivative of the world position: the pattern's own coordinate). lineCov: how much of a pixel w wide a line of
// half-width h covers at d from its middle (its average over d is 2h for every w, so a line keeps its tone as it thins);
// toMean: 1 where the pixel is finer than a quarter of the pattern's period T, 0 where it is as wide as the period, and
// every pattern is mixed toward ITS OWN MEAN by it, as a texture is: no lighter and no darker with distance
float lineCov(float d, float h, float w){ float ww = max(w,1e-4); return clamp((h+0.5*ww-d)/ww, 0.0, min(1.0, 2.0*h/ww)); }
float toMean(float foot, float T){ return 1.0-smoothstep(0.25*T, T, foot); }
// figCov: a small figure cut with a soft edge fa wide either side of its outline, d = its radius here less its outline's
// radius (0 on the outline), A = its true area in the coordinates d is measured in. The soft edge alone would add
// 0.6283 fa fa to that area (two pi times the edge's first moment, 0.1 fa fa), so the cut is dimmed by A/(A+0.6283 fa fa):
// the figure gives the light of its true area at every footprint, while fa stays about under the figure's own radius
float figCov(float d, float fa, float A){ return (1.0-smoothstep(-fa,fa,d))*A/(A+0.6283*fa*fa); }
// PETALS THAT LIE WHERE THEY FELL (on the carpets, the treads of the dais steps and the tops of the cloths): sparse, by
// place: one cell in three of a lattice 0.9 m square holds one, 0.26 m long and 0.2 m wide, lying as dealt; under a
// pixel wider than 0.14 m they are at their mean: 0.0166 of the surface in their colour, at their mean pink (0.53, whose
// square is the mean of theirs). Returns (how much of the pixel it covers, how pink it is: 0 white to 1)
vec2 lyingPetal(vec2 p, float foot){ vec2 ci = floor(p/0.9); float h = h11(ci.x*12.7+ci.y*31.3), h2 = h11(ci.x*5.1+ci.y*17.9+3.0);
  vec2 q = (fract(p/0.9)-0.5)*0.9 - 0.5*(vec2(h2, fract(h*17.0))-0.5); float an = h*39.0, ca = cos(an), sa = sin(an); q = vec2(ca*q.x+sa*q.y, ca*q.y-sa*q.x);
  float fa = clamp(foot*6.0, 0.03, 0.8), r = length(q/vec2(0.13,0.10+0.03*q.x/0.13));
  float pm = 1.0-smoothstep(0.06,0.14,foot);
  return vec2(mix(0.0166, step(h, 0.33)*figCov(r-1.0, fa, 3.14), pm), mix(0.53, fract(h*7.3), pm)); }
// the linen's woven damask: a leaf in a diaper 0.25 m apart, 1 on the leaf (0.4 at its heart), 0 off it; its mean 0.31
float diaper(vec2 p, float foot){ vec2 q = vec2(p.x+p.y, p.x-p.y)*17.77; float m = sin(q.x)*sin(q.y); float w = clamp(foot*14.0,0.02,1.0);
  return mix(0.31, smoothstep(0.18-w,0.18+w,m)-0.6*smoothstep(0.82-w,0.82+w,m), toMean(foot,0.25)); }
// A VINE FRIEZE's relief (0 ground, 1 highest): q = the place along the frieze and above its middle line, in the frieze's own
// unit (1.3 m on the wainscot, 1.6 m on the doorway's pelmet). A stem that waves once every 2 units (0.26 up and down); in
// the hollow of each wave by turns a five-lobed vine leaf and a bunch of grapes
// THE BROCADE's figure (p: metres along the cloth and the height in the hall; f a pixel's footprint): a repeat 3 m wide,
// in columns 1.5 m wide that hold by turns A POMEGRANATE (a round body 0.5 m across with a crown of points, split down
// its middle to show its seeds, two pointed leaves with their midribs under it) and A ROSE of eight petals 0.72 m
// across with a ringed heart, a bud above and below it; each stands in a pointed oval of two lines 1.3 m high (its
// middle at y 4.9, 1.1 m under a rank's top); where two ovals meet, a small flower of four petals and a bead above
// and below it. 1 on the woven figure, 0 on the ground; its mean over what shows of it, between the border band and the linen, is 0.209. Every figure is cut with figCov, so it gives the gold of its true area at every footprint
float brocade(vec2 p, float f){
  float cl = floor(p.x/1.5), odd = mod(cl, 2.0), w = clamp(f, 0.004, 0.1);
  vec2 q = vec2(p.x-(cl+0.5)*1.5, p.y-4.9);
  float ov = 0.69*sqrt(max(1.0-q.y*q.y/0.4225, 0.0));                          // the oval's half width at this height (0.69 at its middle; it closes 0.65 m above and below)
  float frame = mix(0.0731, min(lineCov(abs(abs(q.x)-ov), 0.016, f)+lineCov(abs(abs(q.x)-ov+0.07), 0.008, f), 1.0), toMean(f,0.4))*step(abs(q.y), 0.65);     // (under a pixel 0.4 m wide the oval's two lines are at their mean: 0.0731 of what the figures leave open)
  float fig;
  if (odd < 0.5) {
    vec2 b0 = q-vec2(0.0,-0.06); float body = figCov(length(b0)-0.25, w, 0.196);
    float crown = figCov(max(abs(q.x)-0.14, q.y-0.3-0.13*abs(cos(q.x*33.6))), w, 0.070)*step(0.12,q.y);       // (what shows of the crown over the body is 0.058; its soft edge adds 0.52 w w, and 0.070 is the area that dims it by just that)
    float split = figCov((length(b0/vec2(0.08,0.17))-1.0)*0.08, w, 0.0201);       // (an oval cut across its short axis: its soft edge adds long/short times a disc's, so its area, 0.0427, is given times short/long)
    vec2 sd = (fract(b0/0.06)-0.5)*0.06; float seeds = mix(0.349, figCov(length(sd)-0.02, min(w,0.01), 0.00126), toMean(f,0.06));       // (seeds 0.04 m across every 0.06 m: mean 0.349)
    fig = max(body*(1.0-split*(1.0-seeds)), crown);
    vec2 lq = vec2(abs(q.x)-0.3, q.y+0.38); lq = vec2(lq.x*0.766+lq.y*0.643, -lq.x*0.643+lq.y*0.766);
    float leaf = figCov(length(lq/vec2(0.2,0.08))*0.08-0.08*(1.0-0.5*abs(lq.x)/0.2), w, 0.0201)*mix(0.859, 1.0-lineCov(abs(lq.y), 0.008, f), toMean(f,0.16));       // (a leaf's area is 0.0303; its soft edge adds 1.5 times a disc's, so it is given as 0.0201; its midrib takes 0.141 of it)
    fig = max(fig, leaf);
  } else {
    float rl = length(q), th = atan(q.y, q.x+1e-5);
    float rose = figCov(rl-0.36*(0.7+0.3*cos(8.0*th)), w, 0.218)*(0.45+0.55*smoothstep(0.1,0.16,rl))*mix(0.915, 1.0-0.8*lineCov(abs(rl-0.2), 0.012, f), toMean(f,0.2));       // (the ring takes 0.085 of the rose's tone)
    vec2 bq = vec2(abs(q.x), abs(q.y)-0.5); float bud = figCov(length(bq/vec2(0.06,0.1))*0.06-0.06, w, 0.0113);       // (its area, 0.0188, times short/long)
    fig = max(rose, bud);
  }
  vec2 jq = vec2(0.75-abs(q.x), q.y); float jl = length(jq), ja = atan(jq.y, jq.x+1e-5);
  float joint = figCov(jl-0.1*(0.6+0.4*cos(4.0*ja)), w, 0.0138);
  vec2 jb = vec2(jq.x, abs(q.y)-0.42); joint = max(joint, figCov(length(jb)-0.045, min(w,0.0675), 0.00636));
  return clamp(1.0-(1.0-max(fig, joint))*(1.0-frame), 0.0, 1.0); }       // (the frame's lines cover their share of what the figures leave)
float vineH(vec2 q){
  float kx = floor(q.x), xl = q.x-kx-0.5, sgn = mod(kx,2.0) < 0.5 ? 1.0 : -1.0;
  float stem = 1.0-smoothstep(0.025,0.07,abs(q.y-0.26*sgn*cos(xl*3.14159))*0.8);
  vec2 lp = vec2(xl, q.y+0.1*sgn); float th = atan(lp.y, lp.x+1e-5), ll = length(lp);
  float leaf = (1.0-smoothstep(-0.05,0.0,ll-0.21*(0.72+0.28*cos(5.0*th+1.57))))*(0.7+0.3*abs(cos(th*2.5+0.78)))*(0.6+0.4*smoothstep(0.0,0.12,ll));
  float v = (q.y+0.1*sgn+0.17)/0.34; vec2 gp = vec2(xl, q.y)/0.085; gp.x += 0.5*mod(floor(gp.y),2.0); vec2 gc = fract(gp)-0.5;
  float grape = sqrt(max(1.0-5.2*dot(gc,gc),0.0))*step(abs(xl),0.17*v+0.03)*step(0.0,v)*step(v,1.0);
  return max(stem*0.55, sgn > 0.0 ? leaf*0.85 : grape); }
// the frieze lit as relief: x = its height at q, y = how far its slope there turns toward the light L (along the frieze, upward)
vec2 vineLit(vec2 q, vec2 L){ float e = 0.02, h0 = vineH(q);
  return vec2(h0, clamp(((vineH(q+vec2(e,0.0))-h0)*L.x + (vineH(q+vec2(0.0,e))-h0)*L.y)*1.2, -0.5, 0.5)); }
// THE ROOF'S LIGHT, from where the lights hang: a warm pool above every row of chandeliers of the nave (five hoops across at
// y 14.8, rows at z 68 to 196 every 32 m), above the choir's two free chandeliers (z -92 and -218; the middle one hangs under
// the canopy), above the pyramid and its corona (the crossing's ceiling) and above each transept's middle round table; a
// pool is as wide as the light hangs deep below the boards; between the pools the low glow of the tables, dimmer toward the ridge
float roofLight(vec3 P){
  float e = uTabI*0.2*(1.0-0.4*smoothstep(30.0,46.0,P.y)), cI = 0.12+uChI;
  float zr = 68.0+32.0*clamp(floor((P.z-68.0)/32.0+0.5), 0.0, 4.0);
  for (int j = -1; j <= 1; j++) { float zz = zr+32.0*float(j); vec3 L = vec3(clamp(P.x,-22.0,22.0), 14.8, zz)+chSw(zz)-P; float h2 = L.y*L.y;
    e += step(60.0,zz)*step(zz,200.0)*step(10.0,P.z)*cI*36.0/(1.0+h2*0.03)*exp(-(L.x*L.x+L.z*L.z)/(0.3*h2)); }
  { vec3 L = (P.z > -155.0 ? vec3(0.0, 17.8, -92.0) : vec3(0.0, 21.3, -218.0))+uChSway-P; float h2 = L.y*L.y;
    e += step(P.z,-72.0)*cI*44.0/(1.0+h2*0.03)*exp(-(L.x*L.x+L.z*L.z)/(0.3*h2+60.0)); }
  { vec3 L = vec3(0.0, 34.0, -30.0)-P; float h2 = L.y*L.y;
    e += step(abs(P.x),34.5)*step(-72.5,P.z)*step(P.z,10.5)*uPyI*12.0/(1.0+h2*0.03)*exp(-(L.x*L.x+L.z*L.z)/(0.3*h2+900.0)); }
  { vec3 L = vec3(P.x > 0.0 ? 46.0 : -46.0, 7.7, -31.0)-P; float h2 = L.y*L.y;
    e += step(34.5,abs(P.x))*uTrI*30.0/(1.0+h2*0.03)*exp(-(L.x*L.x+L.z*L.z)/(0.3*h2)); }
  return e; }
void main(){
  float kind = floor(vS.x+0.5); bool leafy = kind > 5.5 && vS.z > 11.5;       // (a leaf mass carries its own round normal on both faces of every card)
  vec3 N = normalize(vN); if (!gl_FrontFacing && !leafy) N = -N;
  vec3 P = vW; vec3 Vv = cameraPosition-P; float vd = length(Vv); vec3 V = Vv/max(vd,1e-3);
  vec2 dSu = fwidth(vS.yw); float leafF = dSu.x+dSu.y;                         // a pixel's footprint in a card's own coordinates
  vec3 dP = fwidth(P); float foot = max(dP.x, max(dP.y, dP.z));             // a pixel's footprint on this surface, in metres
  vec3 col;
  if (kind > 6.5) {                                                        // window glass in small leaded squares (the great windows) or diamonds (the side windows)
    float u = abs(N.x) > 0.5 ? P.z : P.x; vec2 g = vec2(u, P.y)/0.9; vec2 gf = (0.5-abs(fract(g)-0.5))*0.9;      // metres from the nearest lead
    float lead = 1.0-(1.0-lineCov(gf.x,0.03,foot))*(1.0-lineCov(gf.y,0.03,foot)); lead = mix(0.13, lead, toMean(foot,0.9));       // (leads 0.06 m wide every 0.9 m: mean 0.13; two crossed families of lines cover 1-(1-a)(1-b) of a pixel)
    float rip = 0.8+0.4*vnoise(vec3(floor(g)*1.7, 2.0));
    float east = P.x > 30.0 ? 1.0 : (P.x < -30.0 ? uBlueE : 0.6);                                // the east walls' panes, the west walls', the rest
    vec3 glow = vec3(0.0), stain = vec3(1.0);
    if (vS.y < 0.5) {
      // A SIDE WINDOW: diamond panes 0.62 m wide and 1.0 m tall in leads 0.05 m wide, each pane's tone its own (0.7 to 1.3);
      // the night behind it a luminous deep blue, paler toward the sill, plainly blue on every look; in the head (above the
      // springing, y 25.4) a roundel of deep red in a ring of gold, and the panes round it red, blue, gold or clear by their own number
      float du = u-vS.z, hy = P.y; vec2 dg = vec2(du/0.62+hy, du/0.62-hy); vec2 df = (0.5-abs(fract(dg)-0.5))*0.527;        // (0.527: a diamond's lattice step, across its leads)
      lead = 1.0-(1.0-lineCov(df.x,0.025,foot))*(1.0-lineCov(df.y,0.025,foot)); lead = mix(0.18, lead, toMean(foot,0.6));           // (mean 0.18)
      float id = h11(floor(dg.x)*7.31+floor(dg.y)*3.17+vS.z*0.37);
      rip = mix(1.0, 0.7+0.6*id, toMean(foot,0.6));
      float low = 1.0-smoothstep(12.0,27.0,hy);
      glow = (vec3(0.022,0.050,0.165) + vec3(0.050,0.085,0.17)*low*low)*(0.75+0.5*east);
      float rl2 = length(vec2(du, hy-26.3)); float inHead = smoothstep(25.4,25.6,hy);
      float pick = h11(id*91.7+3.3);
      vec3 pc = pick < 0.3 ? vec3(0.75,0.05,0.04) : (pick < 0.55 ? vec3(0.08,0.2,1.0) : (pick < 0.75 ? vec3(1.0,0.62,0.1) : vec3(1.0)));
      stain = mix(vec3(1.0), mix(vec3(1.11,0.702,0.851), pc*1.6, toMean(foot,0.6)), inHead);          // (the panes' mean colour: 1.11, 0.702, 0.851)
      stain = mix(stain, vec3(1.3,0.8,0.12), inHead*(1.0-smoothstep(0.78,0.82,rl2)));
      stain = mix(stain, vec3(0.9,0.05,0.04), inHead*(1.0-smoothstep(0.56,0.60,rl2)));
      lead = max(lead, inHead*lineCov(abs(rl2-0.8),0.03,foot));
    }
    // (the west great window: its glass shows uGwPaneW of the moon's wide halo and its own colour uGwGlassW: under the
    // full moon 0.22 and a deep blue, so that the glass is as deep as the others and the moon stands in it as a clear
    // disc in a soft halo; in the other looks the whole sky and the window's own cold light)
    vec3 sky = nightSkyH(-V, uTime, vS.y > 0.5 && vS.y < 1.5 && P.x < 0.0 ? uGwPaneW : 1.0);
    col = (sky*uPaneGain*east + glow)*stain*rip*(1.0-0.85*lead) + uAmb*0.03 + uFlameCol*0.011*(1.0-lead)*rip;   // (and the candle-lit hall, faint in the glass)
    if (vS.y > 0.5) {                                                      // a great window: the night luminous behind it, plainly blue, paler low down
      vec3 gwc = vS.y > 1.5 ? 0.5*(uGwE+uGwW) : (P.x > 0.0 ? uGwE : uGwGlassW); float lowd = 1.0-smoothstep(7.0,30.0,P.y);   // (2: the wheel window over the north door)
      col += (gwc*(0.9+1.1*lowd) + dot(gwc,vec3(0.3333))*vec3(0.5,0.55,0.6)*lowd*lowd)*rip*(1.0-0.85*lead);
    }
  } else {
    if (kind > 5.5 && !leafy && dot(N,V) < 0.0) N = -N;                     // leaves and cloth are lit on the side the eye sees
    // A HANGING CLOTH (a table's linen below its top) is lit as the smooth pleat it hangs in, never as the facet it is
    // drawn by: its normal is worked from the pleats' own law, the geometry's (the cloth stands out from the table's
    // edge by 0.05 m + amp (0.5 - 0.5 cos) along each pleat, times how far down it hangs: a long table's pleats 1.6 m
    // apart, amp 0.21; a rank's 0.8 m apart, each of its own depth; a round table's skirt by 0.24 cos(12 a))
    if (kind > 2.5 && kind < 3.5 && N.y < 0.5) {
      float rnd3 = step(abs(vS.w-vS.z), 0.01), rk3 = step(abs(vS.y),8.0)*step(P.z,-100.0), vy3 = clamp(((rk3 > 0.5 ? 6.0 : 3.0)-P.y)/(rnd3 > 0.5 ? 2.96 : 2.4), 0.0, 1.0);
      if (rnd3 > 0.5) { vec2 rr = P.xz-vec2(vS.y,vS.z); float rl = max(length(rr),1e-3), sl = 12.0*0.24*vy3*sin(12.0*atan(rr.y, rr.x+1e-5))/rl; vec2 rh = rr/rl;
        N = normalize(vec3(rh.x-rh.y*sl, 0.1, rh.y+rh.x*sl)); }
      else { bool az = abs(N.x) > abs(N.z); float c3 = az ? P.z : P.x, pt = rk3 > 0.5 ? 0.8 : 1.6, am = rk3 > 0.5 ? 0.3*(0.45+0.9*h11(floor(c3/0.8))) : 0.21;
        float fs = am*3.14159/pt*sin(6.2831853*c3/pt)*vy3, so = az ? sign(N.x) : sign(N.z);
        N = normalize(az ? vec3(so, 0.1, -fs) : vec3(-fs, 0.1, so)); } }
    float E; vec3 Ld; hallLight(P,N,kind,E,Ld);
    vec3 alb = vC; vec3 extra = vec3(0.0), linWarm = vec3(1.0); float spec = 0.0, bar = moonBar(P,N), amb = 0.7+0.3*abs(N.y), linLit = -1.0, roofK = 0.0, fillK = 1.0, tierMix = 0.0, damK = 0.0, boardK = 0.0, paintK = 0.0; vec3 ambT = vec3(1.0), tierImg = vec3(0.0); vec4 tierPaint = vec4(0.0);
    if (kind < 1.5) amb *= mix(4.4, kind < 0.5 ? 4.2 : 3.2, smoothstep(27.0,33.0,P.y));     // stone and oak keep a floor of warm underlight: umber, never black; the roof timbers dimmer than the walls
    float fw = max(dot(N,uTierDir)*0.5+0.5, 0.0); fw = fw*fw*fw;          // the pyramid's cool flank: what faces east in the blue hour, west under the moon
    if (kind < 0.5) {                                                      // stone: coursed blocks
      // large quiet ashlar: blocks 3.2 m by 1.6 m in joints 0.04 m wide (their mean 0.0372), each block's tone a little its own
      float u = P.x+P.z; float row = floor(P.y/1.6); vec2 b = vec2(u/3.2+row*0.5, P.y/1.6); vec2 bf = 0.5-abs(fract(b)-0.5);
      float joint = mix(0.0372, 1.0-(1.0-lineCov(bf.x*3.2,0.02,foot))*(1.0-lineCov(bf.y*1.6,0.02,foot)), toMean(foot,1.6));
      float tone = mix(0.5, h11(floor(b.x)*7.13+row*3.7), toMean(foot,3.2));
      alb *= (0.95+0.10*tone)*(1.0-0.3*joint)*(0.86+0.28*vnoise(P*vec3(0.7,1.1,0.7)));          // the courses are texture, not pattern
      // THE PAINTED FIELDS over the four crossing arches (surf.y = 1; surf.z = the wall's half width; surf.w = 1 where it
      // runs along z): each wall from its arch to the ceiling is painted as the roof is, a deep blue-green sown with
      // small gilt stars 0.75 m apart under a gilt and red line at the wall's head (y 45.0); in each of its two upper
      // corners (0.76 of the half width out, y 40.2) a gilt roundel 2.5 m in radius, embossed with a rose of eight
      // petals, in a great wreath of bay 1.6 m wide (2.85 to 4.45 m out) with fruit in it, red and gold, every 30 degrees,
      // and a gilt line round the wreath 4.95 m out
      if (vS.y > 0.5) {
        float la = vS.w < 0.5 ? P.x : P.z+31.0, fa = clamp(foot,0.006,0.3);
        vec2 wc = vec2(abs(la)-0.76*vS.z, P.y-40.2); float wr = length(wc), wa = atan(wc.y, wc.x+1e-5);
        vec2 gc = fract(vec2(la+P.y, la-P.y)/1.06)-0.5; float gl = length(gc)*0.75, th = atan(gc.y, gc.x+1e-5);
        float star = figCov(gl-0.2*(0.55+0.45*cos(5.0*th)), min(fa,0.15), 0.0507)*smoothstep(5.0,5.4,wr);
        vec3 pa = vec3(0.022,0.082,0.098)*(0.82+0.36*vnoise(vec3(la,P.y,3.0)*0.55));
        pa = mix(pa, vec3(0.62,0.42,0.13), mix(0.0902*smoothstep(5.0,5.4,wr), star, toMean(foot,0.75)));
        pa = mix(pa, vec3(0.36,0.06,0.045), lineCov(abs(P.y-44.5),0.07,foot));
        pa = mix(pa, vec3(0.5,0.34,0.1), max(lineCov(abs(P.y-45.0),0.2,foot), lineCov(abs(wr-4.95),0.07,foot)));
        // the wreath: pairs of leaves 1 m long lying outward and inward of its stem, 24 pairs round; a fruit at every second
        float sa = wa*3.8197186, ci = floor(sa+0.5), su = (sa-ci)*0.9556, tt = wr-3.65, sg = tt < 0.0 ? -1.0 : 1.0;
        vec2 lq = vec2(su*0.82+(abs(tt)-0.42)*0.57, -su*0.57+(abs(tt)-0.42)*0.82);
        float leaf = figCov(length(lq/vec2(0.5,0.19))-1.0, fa, 3.14);
        float stem = 1.0-smoothstep(-fa,fa, abs(tt)-0.2), lh = h11(mod(ci+12.0, 24.0)*3.7+sg*1.3);
        vec3 lc = mix(vec3(0.07,0.17,0.05), vec3(0.20,0.33,0.09), lh)*(1.0-0.5*lineCov(lq.y,0.012,foot));
        pa = mix(pa, vec3(0.04,0.10,0.035), stem*step(abs(tt),0.9)); pa = mix(pa, lc, leaf*step(abs(tt),0.95));
        float fo = mod(ci+12.0, 2.0) < 0.5 ? 1.0 : 0.0; vec2 fq = vec2(su, tt-0.12*(lh-0.5)); float fr = length(fq);
        float fruit = fo*figCov(fr-0.33, fa, 0.342);
        pa = mix(pa, mix(vec3(0.42,0.05,0.035), vec3(0.66,0.4,0.08), step(0.5,lh))*(0.55+0.75*(1.0-smoothstep(0.0,0.3,length(fq-vec2(-0.08,0.1))))), fruit);
        // the roundel: gilt, a rose of eight petals raised on it, a red line and a dark groove within its rim
        float ros = figCov(wr-1.9*(0.6+0.4*abs(cos(4.0*wa))), fa, 8.46)*(0.55+0.45*smoothstep(0.2,0.5,wr));
        vec3 rd = vec3(0.52,0.35,0.10)*(0.62+0.38*ros+0.25*(1.0-smoothstep(0.0,0.45,wr)));
        rd = mix(rd, vec3(0.34,0.06,0.045), lineCov(abs(wr-2.18),0.05,foot)); rd *= 1.0-0.5*lineCov(abs(wr-2.36),0.03,foot);
        pa = mix(pa, rd, figCov(wr-2.5, fa, 19.6));
        alb = pa; paintK = 1.0; spec = 0.3+1.0*max(figCov(wr-2.5, fa, 19.6), star);
      }
      // THE PAINTED WALLS of the nave (the wall planes at x -34 and 34 south of z 10 and the south wall, over the wainscot): on the stone, warmed,
      // a diaper in dull red and gold: a lattice of red lines 0.12 m wide in lozenges 2 m wide and 3 m high, a gold knot
      // where two lines cross, a gold flower of four petals in every lozenge. It is whole over the wainscot and fades
      // upward from y 22 into the cornice (gone by 28.8); under a pixel as wide as the lattice's step (1.664 m) the lines go to their mean (0.134: laid under the gold's mean it shows the red's true share; the lines' own cover is 0.139), under one 2 m wide the gold to its (0.123).
      // The transepts' walls (x -62 and 62, and z 10 and -72 beyond x 34) carry no diaper: their stone is warmed alike and no more
      float onW = step(abs(N.y),0.5)*max(step(abs(abs(P.x)-34.0),0.05)*step(10.0,P.z), step(abs(P.z-240.0),0.05));
      float onT = step(abs(N.y),0.5)*max(step(abs(abs(P.x)-62.0),0.05), step(34.0,abs(P.x))*max(step(abs(P.z-10.0),0.05), step(abs(P.z+72.0),0.05)));
      if (onT > 0.5 && P.y > 10.0) alb *= mix(vec3(1.0), vec3(1.12,1.0,0.84), (1.0-smoothstep(22.0,28.8,P.y))*smoothstep(10.2,10.5,P.y));
      if (onW > 0.5 && P.y > 10.0) {
        float fade = (1.0-smoothstep(22.0,28.8,P.y))*smoothstep(10.2,10.5,P.y), fa = clamp(foot,0.006,0.3);
        vec2 dq = vec2(u/2.0+P.y/3.0, u/2.0-P.y/3.0), fq = fract(dq)-0.5, df = (0.5-abs(fq))*1.664;
        float ln = 1.0-(1.0-lineCov(df.x,0.06,foot))*(1.0-lineCov(df.y,0.06,foot));
        vec2 cq = vec2(fq.x+fq.y, (fq.x-fq.y)*1.5); float fl4 = figCov(length(cq)-0.36*(0.5+0.5*abs(cos(2.0*atan(cq.y, cq.x+1e-5)))), fa, 0.282);
        float knot = figCov(length(df)-0.16, fa, 0.0804);
        alb *= mix(vec3(1.0), vec3(1.10,1.0,0.86), fade);
        float gm = fade*0.9*mix(0.123, max(fl4,knot), toMean(foot,2.0)); ln = mix(ln, clamp((ln-0.678*fade*knot)/max(1.0-gm,0.1), 0.0, 1.0), smoothstep(0.006,0.03,fa)); alb = mix(alb, vec3(0.34,0.10,0.07), fade*0.7*mix(0.134, ln, toMean(foot,1.664)));     // (past a 0.03 m footprint the red as its share of what the gold over it leaves; 0.678: the gold's 0.9 of the 0.753 of a knot that lies on the lines)
        alb = mix(alb, vec3(0.66,0.47,0.15), fade*0.9*mix(0.123, max(fl4,knot), toMean(foot,2.0))); }
    } else if (kind < 1.5) {                                               // oak; surf.y = 1: linenfold panelling, 2: the wainscot, 3: a fluted pilaster
      float u = P.x+P.z; float g = abs(N.y) > 0.5 ? vnoise(vec3(P.x*9.0,P.y,P.z*0.8)) : vnoise(vec3(u*1.6,P.y*0.55,u*9.0)*vec3(1.0,1.0,0.12)+vec3(0.0,0.0,P.y*7.0));
      alb *= vS.y > 3.5 && vS.y < 4.5 ? 1.0 : 0.84+0.32*g;
      if (vS.y > 3.5) {
        // THE PAINTED ROOF. surf.y = 4: the boarded field between the timbers (surf.z = 0: a slope of the nave or the choir, 1: of
        // a transept, 2: the crossing's flat ceiling), painted a deep blue-green and divided by ribs into panels about 4 m
        // square: each rib dull gold, 0.32 m wide, with a red line 0.12 m wide beside it; in every panel a gilt rosette
        // (1.2 m across) and round it small gilt stars on a diaper 0.75 m apart. surf.y = 5: a timber, in its own paint.
        // Ribs and red lines keep their cover as they thin (the ribs as two crossed families, the red lines as their share of what the ribs leave) and go to their means under a pixel as wide as a panel; stars and rosettes go to their means under a wide pixel (each its mean cover of
        // the part of a panel that rib and red line leave open, by the kind of panel, since the ribs are painted over them)
        roofK = 1.0;
        if (vS.y < 4.5) {
          vec2 pm = vS.z < 0.5 ? vec2(P.z, (P.y-30.0)*2.349) : (vS.z < 1.5 ? vec2(P.x, (P.y-30.0)*2.751) : vec2(P.z+31.0, P.x));
          vec2 ps = vS.z < 0.5 ? vec2(4.0, 4.176) : (vS.z < 1.5 ? vec2(4.0, 4.001) : vec2(3.9, 4.85));
          vec2 cu = pm/ps, cf = (0.5-abs(fract(cu)-0.5))*ps; float dr = min(cf.x, cf.y), fa = clamp(foot, 0.004, 0.2);
          vec2 kr = 1.0-vec2(lineCov(cf.x,0.16,foot), lineCov(cf.y,0.16,foot)), ka = 1.0-vec2(lineCov(cf.x,0.28,foot), lineCov(cf.y,0.28,foot)), kb = 1.0-vec2(lineCov(cf.x,0.40,foot), lineCov(cf.y,0.40,foot)); float tpn = toMean(foot,4.0), rib = mix(1.0-(1.0-0.32/ps.x)*(1.0-0.32/ps.y), 1.0-kr.x*kr.y, tpn), red = min(mix((1.0-0.56/ps.x)*(1.0-0.56/ps.y)-(1.0-0.8/ps.x)*(1.0-0.8/ps.y), ka.x*ka.y-kb.x*kb.y, tpn)/max(1.0-rib,1e-3), 1.0);
          vec2 gc = fract(vec2(pm.x+pm.y, pm.x-pm.y)/1.06)-0.5; float gl = length(gc)*0.75, th = atan(gc.y, gc.x+1e-5);
          vec2 pc = (fract(cu)-0.5)*ps; float pl = length(pc), pt = atan(pc.y, pc.x+1e-5);
          float star = figCov(gl-0.2*(0.55+0.45*cos(5.0*th)), min(fa,0.15), 0.0507)*smoothstep(0.5,0.62,dr)*smoothstep(0.9,1.0,pl);
          float ros = figCov(pl-0.6*(0.62+0.38*abs(cos(4.0*pt))), fa, 0.856)*(0.45+0.55*smoothstep(0.1,0.2,pl));
          float gold = min(mix(vS.z < 0.5 ? 0.0429 : (vS.z < 1.5 ? 0.0412 : 0.0471), star, toMean(foot,0.75)) + mix(vS.z < 0.5 ? 0.0650 : (vS.z < 1.5 ? 0.0683 : 0.0565), ros, toMean(foot,4.0)), 1.0);
          float bj = (0.5-abs(fract(pm.x/0.4)-0.5))*0.4;                              // the boards: a joint every 0.4 m (its mean 0.06)
          alb = vC*vec3(0.024,0.092,0.108)*(0.82+0.36*vnoise(vec3(pm*0.55, 3.0)))*(1.0-0.3*mix(0.06, lineCov(bj,0.012,foot), toMean(foot,0.4)));
          alb = mix(alb, vec3(0.62,0.42,0.13), gold); alb = mix(alb, vec3(0.36,0.06,0.045), red); alb = mix(alb, vec3(0.5,0.34,0.1), rib);
          spec = 0.3+1.2*max(gold, rib);
        } else spec = 0.5;
      } else if (vS.y > 1.5) {
        // THE WAINSCOT (surf.y = 2) and its PILASTERS (3). The relief is lit as relief: every slope is shaded by where the
        // candles stand (Lt, Ly: the light's bearing along the wall and upward), so it holds at a grazing eye; it goes to
        // its mean where a pixel is wider than a panel's mouldings
        // (surf.w = 0: the wall runs along z; 1: along x. ua = metres along it)
        vec3 Lq = normalize(Ld); float ua = vS.w < 0.5 ? P.z : P.x, Lt = vS.w < 0.5 ? Lq.z : Lq.x, Ly = Lq.y, rel = toMean(foot,0.8), sh = 1.0;
        float rk = P.z > -71.99 ? 1.9 : 1.0;                                   // (the nave's and the transepts' wainscot is cut deeper: its relief nearly twice as strong)
        if (vS.y > 2.5) {                                                    // a pilaster (surf.z = its middle along the wall): four flutes 0.2 m apart between y 1.6 and y 9.0
          float lo = ua-vS.z, fl = fract(lo/0.2), on = smoothstep(1.5,1.7,P.y)*(1.0-smoothstep(8.9,9.1,P.y))*step(abs(lo),0.4);
          sh = 1.0 + on*mix(-0.125, 0.55*sin(fl*6.2831853)*Lt - 0.25*(0.5-0.5*cos(fl*6.2831853)), toMean(foot,0.2));      // (a flute's mean shade: -0.125)
        } else if (P.y < 8.5) {
          // raised-and-fielded panels 1.6 m wide (ten to a bay) in two tiers (y 0.8 to 5.4, 5.4 to 8.5): a frame 0.16 m wide, a
          // bevel 0.2 m wide rising to the field, a dark line at the bevel's foot
          float a = fract(ua/1.6+0.5)*1.6, y0 = P.y < 5.4 ? 0.8 : 5.4, H = P.y < 5.4 ? 4.6 : 3.1, c = P.y-y0;
          float ex = min(a, 1.6-a), ey = min(c, H-c), d = min(ex,ey)-0.16, aa = clamp(foot,0.008,0.1);
          float bev = smoothstep(-aa,aa,d)*(1.0-smoothstep(0.2-aa,0.2+aa,d));
          float tu = ex < ey ? (a < 0.8 ? -1.0 : 1.0) : 0.0, ty = ex < ey ? 0.0 : (c < H*0.5 ? -1.0 : 1.0);
          sh = 1.0 + rk*mix(P.y < 5.4 ? 0.0172-0.0136*rk : 0.0126-0.0147*rk, 0.8*bev*(tu*Lt+ty*Ly) - 0.3*lineCov(abs(d),0.015*rk,foot) + 0.07*smoothstep(0.2-aa,0.2+aa,d) - 0.06*(1.0-smoothstep(-aa,aa,d)), rel);     // (far off, the panel's mean shade: its field's lift less its frame's shade and its line's, by tier and by the depth of the cut)
        } else {
          // THE FRIEZE (y 8.5 to 10.2): a vine and its grapes carved in relief between two mouldings
          vec2 vl = vineLit(vec2(ua, P.y-9.35)/1.3, vec2(Lt,Ly));
          float band = smoothstep(8.62,8.68,P.y)*(1.0-smoothstep(10.02,10.08,P.y));
          float mould = lineCov(abs(P.y-8.62),0.05,foot)+lineCov(abs(P.y-10.08),0.05,foot);
          float rf = toMean(foot,0.25);
          sh = 1.0 + rk*band*mix(-0.0901, 0.32*vl.x - 1.4*vl.y - 0.12, rf) + 0.22*mould*Ly*rel + 0.1*mould;      // (the relief's mean over the band: -0.0901)
        }
        alb *= clamp(sh, rk > 1.5 ? 0.25 : 0.4, rk > 1.5 ? 2.0 : 1.7);
      } else if (vS.y < -0.5) {
        // THE BACK BOARD of a dresser (surf.y = -1: honey-coloured oak that stands in its sconces' light, boardK, the nave's
        // and the transepts'; -2: the choir's dark oak, in the hall's own light) or of the shelved north wall (-3);
        // surf.w = its middle along its wall. A soft shadow under each shelf. PLATE: gilt and silver chargers stand on edge
        // against it on every shelf that carries no glasses (a dresser's base, third and top shelves: y 4, 9, 14; the north
        // wall's shelves at y 11, 16, 18.5 and 23.5), painted: a round dish 1.24 m (gilt) or 1.0 m (silver) across, a
        // raised rim, a dished well; gilt and silver by turns along a shelf and from shelf to shelf; three to a dresser's
        // shelf, six to a bay of the wall's. surf.z = 1: on all those shelves; 2: on a dresser's third shelf alone (real
        // plate stands on its base and its top shelf); 3: none painted
        float lo = (abs(N.x) > 0.5 ? P.z : P.x)-vS.w, fa = clamp(foot,0.004,0.15), nw = step(vS.y,-2.5); boardK = step(-1.5,vS.y);
        float jb = mix(4.0,11.0,nw), jn = mix(4.0,5.0,nw), js = clamp(floor((P.y-jb)/2.5), 0.0, jn), y0 = jb+2.5*js;
        float sy = js > jn-0.5 ? mix(15.65,26.0,nw) : y0+2.28;
        alb *= 0.62+0.38*smoothstep(0.0,0.7,sy-P.y);
        float has = nw > 0.5 ? step(0.5,abs(js-1.0))*step(0.5,abs(js-4.0)) : (1.0-step(0.5,mod(js,2.0)))*(vS.z > 1.5 ? step(abs(js-2.0),0.5) : 1.0);
        if (vS.z > 2.5) {                                                    // (3: a dresser near the flown line: the board painted a dark blue-green in panels 1.3 m wide between the shelves, a gilt line 0.12 m inside each; all its plate is real)
          float px = (0.5-abs(fract(lo/1.3)-0.5))*1.3, py = min(P.y-y0, sy-P.y), dpn = min(px-0.12, py-0.14);
          float gln = mix((1.0-0.212/1.3)*(1.0-0.252/(sy-y0))-(1.0-0.268/1.3)*(1.0-0.308/(sy-y0)), (1.0-lineCov(px,0.106,foot))*(1.0-lineCov(py,0.126,foot))-(1.0-lineCov(px,0.134,foot))*(1.0-lineCov(py,0.154,foot)), toMean(foot,1.3)); alb *= 0.85+0.3*smoothstep(0.0,0.06,dpn); alb = mix(alb, vec3(0.62,0.44,0.14), 0.85*gln); spec = max(spec, 0.8*gln);     // (the gilt line: the panel within its outer edge less the panel within its inner edge; under a pixel as wide as a panel, its mean cover of the bay)
        } else if (vS.z > 0.5 && has > 0.5) {
          float ci = nw > 0.5 ? floor(lo/2.6)+0.5 : floor(lo/2.6+0.5), xc = ci*2.6, sv = mod(floor(ci+4.0)+floor(js*0.5+0.25)+nw*js, 2.0);
          float rc = sv < 0.5 ? 0.5 : 0.62, inb = step(abs(xc), mix(2.7,6.6,nw)); vec2 cq = vec2(lo-xc, P.y-y0-rc-0.02); float cr = length(cq);
          float disc = figCov(cr-rc, fa, 3.1416*rc*rc)*inb;
          vec3 metal = sv < 0.5 ? vec3(0.62,0.62,0.60) : vec3(0.66,0.48,0.17);
          float shadeC = 0.55+0.5*smoothstep(0.55,0.95,cr/rc) - 0.25*lineCov(abs(cr-rc*0.62),0.012,foot) + 0.5*exp(-dot(cq-vec2(-0.3,0.3)*rc, cq-vec2(-0.3,0.3)*rc)/(0.05*rc*rc));
          alb = mix(alb*(1.0-0.4*inb*exp(-max(cr-rc,0.0)/0.08)), metal*mix(0.8, shadeC, toMean(foot,0.3)), disc); spec = max(spec, disc*1.5); }
      } else if (vS.y > 0.5) {
        float f = fract(u/2.0), gy = fract(P.y/4.7);
        float inP = smoothstep(0.08,0.11,f)*(1.0-smoothstep(0.89,0.92,f))*smoothstep(0.07,0.10,gy)*(1.0-smoothstep(0.90,0.93,gy));
        float fold = abs(sin((f-0.1)/0.8*12.566)); float ends = smoothstep(0.10,0.16,gy)*(1.0-smoothstep(0.84,0.90,gy));
        alb *= mix(1.08, 0.72+0.4*mix(1.0-fold, fold, ends), inP);
        alb *= 1.0-0.5*(1.0-inP)*(1.0-smoothstep(0.0,0.02,min(min(f,1.0-f),min(gy,1.0-gy))));
      }
      if (roofK < 0.5) spec = max(spec, 0.25);
    } else if (kind < 2.5) {                                               // the polished floors: oak boards (the nave) and marble (the crossing, the transepts, the choir, the dais)
      // THE MARBLE: every floor north of z 10 (the crossing, the transepts, the choir), the dais floor and its treads. A
      // chequer of two marbles laid on the diagonal, squares 2 m (a warm cream and a deep green-black; the treads cream
      // alone), veined; a border band of dull red where it meets the carpet, the steps, the walls and the nave's boards
      // (0.7 m wide; 1.1 m along the transepts' walls). The chequer goes to its mean (the two marbles half and half) where a pixel is as wide as two squares
      float aX = abs(P.x), fa = clamp(foot, 0.004, 0.5), tone = 0.5, joint = 0.0;
      float mar = P.y > 0.5 ? 1.0 : step(P.z,10.0);
      float chr = (1.0-smoothstep(-76.0,-58.0,P.z))*step(P.y,0.5);            // (the choir takes little of the nave's light)
      if (mar > 0.5) {
        vec2 q = vec2(P.x+P.z, P.x-P.z)/2.8284; vec2 tq = abs(fract(q*0.5)*2.0-1.0)-0.5; float w = max(foot/2.0, 0.002);
        float chk = mix(0.5, 0.5+0.5*clamp(tq.x/w,-1.0,1.0)*clamp(tq.y/w,-1.0,1.0), toMean(foot,4.0));
        if (P.y > 0.5 && P.y < 2.5) chk = 1.0;
        vec2 cid = floor(q); float v1 = vnoise(vec3(P.xz*0.8+cid*3.7, 5.0)), v2 = vnoise(vec3(P.xz*0.33+cid.yx*1.9, 9.0));
        float vein = mix(0.0836, 1.0-smoothstep(0.0,0.05,abs(v2-0.5)), toMean(foot,0.6));                    // (the veins' mean: 0.0836)
        vec3 cream = vec3(0.50,0.41,0.29)*(0.86+0.28*v1)*(1.0-0.3*vein), dark = vec3(0.030,0.052,0.044)*(0.7+0.6*v1) + vec3(0.10,0.12,0.10)*vein;
        alb = mix(dark, cream, chk);
        float dR = max(aX-22.1, max(P.z+117.0, -199.0-P.z));                   // metres outside the foot of the dais steps
        float bd = bnd(2.75,3.45,aX,fa)*step(-238.7,P.z)*step(P.z,-57.0) + bnd(0.0,0.7,dR,fa) + smoothstep(32.9-fa,32.9+fa,aX)*step(aX,34.0)*step(P.z,-57.0) + smoothstep(9.3-fa,9.3+fa,P.z)
          + (1.0-smoothstep(-245.2-fa,-245.2+fa,P.z)) + bnd(-239.4,-238.7,P.z,fa)*step(aX,3.45)
          + step(34.0,aX)*max(smoothstep(60.9-fa,60.9+fa,aX), max(smoothstep(8.9-fa,8.9+fa,P.z), 1.0-smoothstep(-70.9-fa,-70.9+fa,P.z)));
        if (P.y < 0.5) alb = mix(alb, vec3(0.30,0.075,0.055)*(0.8+0.4*v1), clamp(bd,0.0,1.0));
        // THE GREAT STAR inlaid under the pyramid's foot (its middle the pyramid's, x 0, z -30), reaching 8 m beyond it: on a
        // round field of the green-black marble (to 28.6 m), sixteen points that widen inward under the pyramid: eight long
        // ones to 28 m (6.6 m wide at the pyramid's foot), each half cream and half dull red about its own axis, and
        // between them eight short ones to 24.5 m, half cream and half a grey-green; a brass line round the pyramid's foot
        // (20.1 to 20.6 m) and a brass band (28.6 to 29.1 m) inside a red one (to 29.8 m) round the whole
        if (P.y < 0.5) { vec2 pc = P.xz-vec2(0.0,-30.0); float pr = length(pc);
          if (pr < 29.8) { float sa = atan(pc.y, pc.x+1e-5)/0.7853982, d8 = fract(sa)-0.5, d8s = fract(sa+0.5)-0.5;
            float eL = 5.8*(28.0-pr)/14.0-abs(d8)*0.7853982*pr, eS = 5.8*(24.5-pr)/10.5-abs(d8s)*0.7853982*pr;
            vec3 field = dark*0.55, mk = (0.86+0.28*v1)*(1.0-0.3*vein)*vec3(1.0);
            vec3 cL = (d8 > 0.0 ? vec3(0.52,0.43,0.30) : vec3(0.30,0.075,0.055))*mk, cS = (d8s > 0.0 ? vec3(0.50,0.41,0.29) : vec3(0.16,0.20,0.17))*mk;
            vec3 star = mix(mix(field, cS, smoothstep(-fa,fa,eS)), cL, smoothstep(-fa,fa,eL));
            star = mix(star, vec3(0.34,0.23,0.08), bnd(20.1,20.6,pr,fa)+bnd(28.6,29.1,pr,fa));
            star = mix(star, vec3(0.30,0.075,0.055)*(0.8+0.4*v1), bnd(29.1,29.8,pr,fa));
            alb = star; } }
        tone = v1;
      } else {                                                               // oak boards in a herringbone
        float w = 2.2; float t = P.x/w; float tri = abs(fract(t*0.5)*2.0-1.0)*w; float c = (P.z+tri)/0.56;
        tone = h11((floor(c)+floor(t)*17.0)*1.37+3.1);
        joint = 1.0-(1.0-lineCov((0.5-abs(fract(c)-0.5))*0.56, 0.02, foot))*(1.0-lineCov((0.5-abs(fract(t)-0.5))*w, 0.012, foot));
        joint = mix(0.08, joint, toMean(foot,0.56)); tone = mix(0.5, tone, toMean(foot,1.1));      // (joints 0.04 m wide every 0.56 m and 0.024 every 2.2 m: mean 0.08)
        alb *= (0.88+0.2*tone)*(1.0-0.5*joint)*(0.85+0.3*vnoise(vec3(P.x*0.8,c*5.0,P.z*0.8)));
      }
      // THE FLAMES IN THE FLOOR: no noise, each a long soft streak toward the eye, wavering a little by the clock. A row of
      // flames (the low candles of a table, of a rank) is summed whole (rowStreak): one unbroken road of light where the eye
      // looks along it, a comb of streaks where it looks across
      vec3 R = vec3(-V.x, max(V.y,0.03), -V.z); float ry = R.y; float nv = 1.0-max(V.y,0.0); nv *= nv;
      float fr = (0.035+0.03*chr+0.05*mar+0.9*nv*nv)*(0.9+0.2*tone)*(1.0-0.5*joint);
      vec2 vp = V.xz/max(length(V.xz),1e-3); float wav = 0.92+0.16*vnoise(vec3(P.xz*0.12, uTime*0.85));
      float low = step(P.y,2.0);
      float lng = 5.0/max(V.y,0.1);                                            // a streak stands about five times taller than wide on the screen
      float t1 = max(4.3-uStub-P.y,0.0)/ry; vec3 H = P+R*t1; float sw = (0.4+0.04*t1)*wav; float st = 0.0;
      for (int i = 0; i < 5; i++) st += rowStreak(H.xz, float(i-2)*11.0, 21.6, uLat, 21.6, 197.6, vp, sw, sw*lng);
      { float cs = H.x > 0.0 ? rowStreak(H.xz, 26.5, -228.8, 3.2, -228.8, -81.6, vp, sw, sw*lng)                                    // the choir's side tables: two more
          : rowStreak(H.xz, -26.5, -228.8, 3.2, -171.2, -81.6, vp, sw, sw*lng);                                                    // rows (the west one dark north of z -172)
        st = (st+cs)*low*uTabI/(1.0+t1*0.025); }
      float t2 = (14.8-P.y)/ry; vec3 H2 = P+R*t2;
      vec2 cc = vec2(clamp(floor(H2.x/11.0+0.5),-2.0,2.0)*11.0, 68.0+32.0*clamp(floor((H2.z-68.0)/32.0+0.5),0.0,4.0));
      float dd = (length(H2.xz-cc-chSw(cc.y).xz)-4.0)/(0.6+0.03*t2); float st2 = exp(-dd*dd)*uChI*1.4/(1.0+t2*0.012);
      vec3 H5 = P+R*((17.8-P.y)/ry); vec2 c5 = vec2(0.0, -92.0-63.0*clamp(floor((-92.0-H5.z)/63.0+0.5),0.0,1.0));
      float dd5 = (length(H5.xz-c5-chSw(c5.y).xz)-4.0)/(0.7+0.03*t2); st2 += exp(-dd5*dd5)*uChI*1.6/(1.0+t2*0.012);
      vec3 H5n = P+R*((21.3-P.y)/ry); float dd5n = (length(H5n.xz-vec2(0.0,-218.0)-uChSway.xz)-4.0)/(0.7+0.03*t2); st2 += exp(-dd5n*dd5n)*uChI*1.6/(1.0+t2*0.012);
      vec3 H3 = P+R*((20.0-P.y)/ry); float d3 = length(H3.xz-vec2(0.0,-30.0)); float st3 = exp(-d3*d3/90.0)*uPyI*0.9*low;
      // candle trees: the avenue of pairs, the ring of twelve, the two at the doorway, four on the dais
      float t4 = (8.4-P.y)/ry; vec3 H4 = P+R*t4; float w4 = (0.45+0.006*t4)*wav, a4l = w4*lng;
      vec2 r4 = H4.xz-vec2(0.0,-30.0); float ac4 = floor(atan(r4.y, r4.x+1e-5)/0.5235988);
      float px4 = H4.x > 0.0 ? 12.5 : -12.5;
      float st4 = streak(H4.xz,vec2(px4,-238.0),vp,w4,a4l) + rowStreak(H4.xz, px4, -62.5, 9.0, -62.5-9.0*(H4.x > 0.0 ? uPairE : 5.0), -62.5, vp, w4, a4l)
        + step(0.0,H4.x)*rowStreak(H4.xz, px4, -210.5, 9.0, -228.5, -210.5, vp, w4, a4l);   // (the west row before the door stands unlit)
      for (int j = -2; j <= 2; j++) { float aj = (ac4+float(j)+0.5)*0.5235988; st4 += streak(r4,24.0*vec2(cos(aj),sin(aj)),vp,w4,a4l); }
      // the orange trees' lanterns (the nearer row on the eye's side: every 9 m, the east rows with their gaps) and the river's cups
      { float xr = abs(H4.x) < 12.5 ? 9.0 : 16.0, sg = H4.x > 0.0 ? 1.0 : -1.0; vec2 gp = xr < 12.0 ? uGapE.xy : uGapE.zw; float wo = w4*0.8;
        float so = sg > 0.0 ? rowStreak(H4.xz, xr, -58.0, 9.0, -58.0-9.0*(gp.x-1.0), -58.0, vp, wo, wo*lng)*step(0.5,gp.x) + rowStreak(H4.xz, xr, -58.0, 9.0, -112.0, -58.0-9.0*(gp.y+1.0), vp, wo, wo*lng)*step(gp.y,5.5)*step(gp.x,50.0)
          : rowStreak(H4.xz, -xr, -58.0, 9.0, -112.0, -58.0, vp, wo, wo*lng);
        st4 += 0.5*(so + (sg > 0.0 ? rowStreak(H4.xz, xr, -206.0, 9.0, -233.0, -206.0, vp, wo, wo*lng) : 0.0));
        float tr = max(0.4-P.y,0.0)/ry; vec3 Hr = P+R*tr; float wr = 0.16*wav, sr = Hr.x > 0.0 ? 1.0 : -1.0;
        st4 += 0.7*uTabI*(rowStreak(Hr.xz, sr*3.1, -58.0, 1.5, sr > 0.0 ? uRivE : -115.0, -58.0, vp, wr, wr*lng) + rowStreak(Hr.xz, sr*5.2, -201.0, 1.5, -237.0, -201.0, vp, wr, wr*lng)); }
      st4 *= low*uTrI*2.4/(1.0+t4*0.008);
      float t7 = max(11.4-P.y,0.0)/ry; vec3 H7 = P+R*t7; float w7 = (0.45+0.006*t7)*wav;
      float s7 = streak(H7.xz,vec2(H7.x > 0.0 ? 17.2 : -17.2,-126.0),vp,w7,w7*lng) + step(0.0,H7.x)*streak(H7.xz,vec2(17.2,-190.0),vp,w7,w7*lng);
      st4 += s7*uTrI*2.4*(0.4*step(-120.5,P.z)*low + 0.6*step(2.5,P.y));
      // the transepts' round tables (the candelabra of the nearest, of the nearest in the next line and of the next in its own line)
      // and the three sconces of the shelved north wall on the eye's side of the door
      float t9 = max(7.7-P.y,0.0)/ry; vec3 H9 = P+R*t9; float w9 = (0.4+0.006*t9)*wav, sx9 = H9.x > 0.0 ? 1.0 : -1.0;
      vec2 q1 = roundAt(H9.xz), q2 = roundAt(vec2(H9.x+(abs(H9.x) > abs(q1.x) ? 8.1 : -8.1)*sx9, H9.z)), q3 = roundAt(vec2(q1.x, q1.y+(H9.z > q1.y ? 9.4 : -9.4)));
      float s9 = streak(H9.xz,q1,vp,w9,w9*lng) + step(0.5,abs(q2.x-q1.x))*streak(H9.xz,q2,vp,w9,w9*lng) + step(0.5,abs(q3.y-q1.y))*streak(H9.xz,q3,vp,w9,w9*lng);
      float t10 = max(16.6-P.y,0.0)/ry; vec3 H10 = P+R*t10; float w10 = (0.4+0.006*t10)*wav, sx10 = H10.x > 0.0 ? 1.0 : -1.0;
      float s10 = streak(H10.xz,vec2(sx10*14.5,-243.8),vp,w10,w10*lng) + streak(H10.xz,vec2(sx10*22.75,-243.8),vp,w10,w10*lng) + streak(H10.xz,vec2(sx10*31.0,-243.8),vp,w10,w10*lng);
      st4 += s9*uTrI*2.0*low*step(30.0,abs(P.x))/(1.0+t9*0.008) + s10*1.5*low*step(P.z,-196.0)/(1.0+t10*0.008);
      // the dais ranks: every low flame, on the dais floor and in the floor before the steps
      float t6 = max(7.3-uStub-P.y,0.0)/ry; vec3 H6 = P+R*t6; float w6 = (0.3+0.005*t6)*wav;
      float st6 = rowStreak(H6.xz, H6.x > 0.0 ? 5.0 : -5.0, -130.0, 3.2, -168.4, -130.0, vp, w6, w6*lng);
      float tsh = P.y > 2.5 ? 0.3+0.7*smoothstep(1.5,3.0,abs(abs(P.x)-5.0)) : 1.0;      // the dais floor lies in shadow close under the ranks' cloths
      st6 *= uTabI*(step(2.5,P.y)*tsh + 0.25*low*step(-120.5,P.z));
      // the massed candles of the dais steps, in the floor round the dais: a row along each flight (clusters 2.5 m apart)
      { float t8 = max(3.2-P.y,0.0)/ry; vec3 H8 = P+R*t8; float w8 = (0.5+0.006*t8)*wav, sg8 = H8.x > 0.0 ? 1.0 : -1.0;
        float s8 = rowStreak(H8.zx, P.z > -158.0 ? -118.5 : -197.5, sg8*4.4, 2.5, sg8 > 0.0 ? 4.4 : -20.6, sg8 > 0.0 ? 20.6 : -4.4, vp.yx, w8, w8*lng)*(P.z > -158.0 || sg8 > 0.0 ? 1.0 : 0.0)
          + rowStreak(H8.xz, sg8*21.4, -119.0, 2.5, sg8 > 0.0 ? -197.0 : -169.0, -119.0, vp, w8, w8*lng);       // (the north-west quarter carries none)
        st4 += s8*uTabI*0.9*low/(1.0+t8*0.01); }
      float shim = 0.84+0.32*vnoise(vec3(P.xz*0.06+vec2(uTime*0.05,uTime*0.11), uTime*0.9));      // the streaks shiver as the flames do, softly: no blotches
      float room = mix(0.85, 1.0, smoothstep(-106.0,-60.0,P.z));                                   // the dim room, mirrored at a grazing eye
      extra = uFlameCol*fr*(st*1.6+st2+st3+(st4+st6*2.4)*shim + uSheen*room*vec3(1.0,0.72,0.5));
      E *= P.y > 0.5 ? (P.y > 2.5 ? 0.5*tsh : 1.5) : mix(1.0, 0.5, chr);    // the choir floor falls to deep umber; the steps and the dais take their candles' pools
      E = E*1.05/(1.0+0.22*E);
      amb = mar > 0.5 ? 1.7 : mix(3.6, 2.8, chr);
      spec = 0.5;
    } else if (kind < 4.5) {                                               // LINEN: a table's cloth (3); a tier of the pyramid (4: walnut, gilt, mirror, and a strip of the same linen)
      // THE LINEN'S RANGE: the tops ivory, nearly white under each flame (linLit 1); the hanging cloth cooler and darker, in
      // real pleats (phi: 0 in a valley, 1 on a ridge, the same smooth law the geometry was built by), with a soft shadow
      // in each fold, under the table's edge and at the hem, an embroidered gold band above the hem, a lace edge where
      // the top overhangs. THE RANKS' hanging cloth is a crimson and old-gold brocade under a short white linen cloth
      float top = step(0.5,N.y); float pool, yT, yH, phi, hco, edgeIn, sideL, rankK = 0.0, roundK = 0.0; vec2 dp = P.xz;
      if (kind < 3.5) {
        float isRound = step(abs(vS.w-vS.z), 0.01), isRank = step(abs(vS.y),8.0)*step(P.z,-100.0);   // a round table (one place); the dais ranks (tops at y 6)
        float lat = vS.z < 0.0 ? 3.2 : uLat, hw = isRank > 0.5 ? 1.5 : 2.4; rankK = isRank; roundK = isRound;
        vec2 rr = P.xz-vec2(vS.y,vS.z); float ra = atan(rr.y, rr.x+1e-5), rx = abs(P.x-vS.y);
        yT = isRank > 0.5 ? 6.0 : 3.0; yH = isRound > 0.5 ? 0.04 : yT-2.4;
        pool = top*latticePool(P,N,vS.y,vS.z,vS.w,P.y+1.3-uStub,lat,Ld);
        if (isRound > 0.5) pool = top*(0.42+0.7*exp(-dot(rr,rr)*0.1))*breath(vec3(vS.y,7.0,vS.z),uTime);   // its candelabrum stands high: the pool is broad, ivory-white to the edge in every look
        if (vS.y < -25.0 && vS.z < -100.0) pool *= 1.0-step(P.z,-172.8);                       // THE DARK END: the west side table's unlit stretch
        hco = isRound > 0.5 ? ra*3.3 : (abs(N.x) > 0.5 ? P.z : P.x);
        phi = isRound > 0.5 ? 0.5+0.5*cos(12.0*ra) : 0.5-0.5*cos(6.2831853*hco/(isRank > 0.5 ? 0.8 : 1.6));
        edgeIn = isRound > 0.5 ? 3.2-length(rr) : hw-rx;
        float run = top*(1.0-smoothstep(0.74,0.78,rx))*(1.0-isRound); damK = 1.0-isRound;
        float weave = 0.8+0.2*sin(P.z*31.0)*sin(P.x*31.0)*toMean(foot,0.2);       // (its mean: 0.8)
        vec3 runC = uRunCol*weave;
        if (isRound < 0.5) {
          // THE RUNNER of every long table and of the ranks, on every visit: 1.5 m wide, in the visit's runner colour (old gold
          // on a visit whose dealt runner is none), embroidered in the other (crimson on gold, gold on crimson): a six-petalled flower every 0.8 m, a waving stem either
          // side of it and a border line; the embroidery goes to its mean (0.180) under a wide pixel
          float zl = (fract(P.z/0.8)-0.5)*0.8, fl2 = length(vec2(rx, zl)), ft = atan(zl, rx+1e-5), f2 = clamp(foot,0.003,0.2);
          float fig = figCov(fl2-0.2*(0.62+0.38*cos(6.0*ft)), f2, 0.0574)*(0.5+0.5*smoothstep(0.04,0.08,fl2))
            + lineCov(abs(rx-0.46-0.07*sin(P.z*7.854)), 0.022, foot) + lineCov(abs(rx-0.66), 0.03, foot) + lineCov(abs(rx-0.86), 0.03, foot);     // (the border line and the same line mirrored in the runner's edge, 0.76: what its soft edge throws past the edge comes back)
          runC = mix(uRunCol*weave*0.8, uRunCol.g > 0.2 ? vec3(0.34,0.05,0.06) : vec3(0.66,0.47,0.15), mix(0.180, min(fig,1.0), toMean(foot,0.8))); }
        alb = mix(alb, runC, run); spec = run*0.9;
        { float zl2 = P.z-vS.z-3.2*floor((P.z-vS.z)/3.2+0.5), on2 = top*(1.0-isRound)*step(vS.z-1.7,P.z)*step(P.z,vS.w+1.7);
          // (a soft shadow under every low candle's foot and, midway between each two, under the dish that stands there)
          alb *= 1.0-on2*(0.26*exp(-max(length(vec2(rx, abs(zl2)-1.6))-0.42,0.0)/0.22)+0.3*exp(-max(length(vec2(rx, zl2))-0.2,0.0)/0.12)); }
        float sz = (fract(P.z/4.8+0.5)-0.5)*4.8, sx = abs(rx-1.5);                  // creases where the cloth was folded
        alb *= 1.0+top*(1.0-run)*(1.0-isRound)*(0.10*exp(-(sz-0.03)*(sz-0.03)*900.0)-0.14*exp(-(sz+0.03)*(sz+0.03)*900.0)-0.10*exp(-sx*sx*700.0));
        // A LAID TABLE: at every chair (every 3.2 m; both sides of a long table, the outer side of a rank) a gilt plate, a
        // silver knife and fork 0.6 m long laid either side of it, and a folded napkin in a gilt ring, each with its soft
        // contact shadow; edges as wide as a pixel's footprint
        { float zc = vS.z+3.2*floor((P.z-vS.z)/3.2+0.5); float on = top*(1.0-isRound)*step(vS.z-0.1,zc)*step(zc,vS.w+0.1);
          if (isRank > 0.5) on *= step(0.0,(P.x-vS.y)*vS.y);
          float rp = isRank > 0.5 ? 0.36 : 0.42; vec2 q = vec2(rx-(isRank > 0.5 ? 1.05 : 1.55), P.z-zc); float ql = length(q), fa = clamp(foot,0.004,0.2);
          float disc = figCov(ql-rp, fa, 3.1416*rp*rp);
          float rim = lineCov(abs(ql-rp*0.9),rp*0.085,foot), well = lineCov(abs(ql-rp*0.6),0.012,foot);
          vec2 nq = abs(q)-vec2(0.105,0.25); float nap = figCov(max(nq.x,nq.y), fa, 0.0825);       // (a box's soft edge adds 0.8 fa fa: its area 0.105 is given as 0.105 pi/4)
          float ring = nap*lineCov(abs(q.y),0.035,foot), creaseN = nap*lineCov(abs(abs(q.x)-0.035),0.006,foot);
          float shd = on*(1.0-disc)*0.34*exp(-max(ql-rp,0.0)/0.07);
          vec3 plate = mix(vec3(0.60,0.43,0.14)*(1.0-0.3*well), vec3(0.78,0.58,0.2), rim);
          plate = mix(plate*(1.0-0.25*exp(-max(max(nq.x,nq.y),0.0)/0.03)), vec3(0.80,0.78,0.72)*(1.0-0.3*creaseN), nap);       // (the napkin's own shadow on the plate)
          plate = mix(plate, vec3(0.62,0.44,0.13), ring);
          alb = mix(alb*(1.0-shd), plate, on*disc); spec = max(spec, on*disc*(rim*1.4+ring*1.2+0.8)*(1.0-nap*(1.0-ring)));
          float kn = on*lineCov(abs(abs(q.y)-0.52),0.02,foot)*(1.0-smoothstep(0.28,0.32,abs(q.x)));
          alb = mix(alb, vec3(0.70,0.71,0.74), kn); spec = max(spec, kn*1.3); }
        if (isRound > 0.5) {                                                 // a round table's eight places (the first 22.5 degrees round from +x): a gilt plate before each chair, 2.6 m out
          float ak = (floor(ra/0.7853982)+0.5)*0.7853982, rl6 = length(rr); vec2 q = vec2(rl6*cos(ra-ak)-2.6, rl6*sin(ra-ak)); float ql = length(q), fa = clamp(foot,0.004,0.2);
          float disc = top*figCov(ql-0.42, fa, 0.554), rim = lineCov(abs(ql-0.378),0.036,foot), well = lineCov(abs(ql-0.252),0.012,foot);
          alb = mix(alb*(1.0-top*(1.0-disc)*0.34*exp(-max(ql-0.42,0.0)/0.07)), mix(vec3(0.60,0.43,0.14)*(1.0-0.3*well), vec3(0.78,0.58,0.2), rim), disc); spec = max(spec, disc*(rim*1.4+0.8)); }
        float isR = isRank;
        sideL = mix(0.1+0.9*smoothstep(yT-2.4,yT,P.y), 0.4+0.6*smoothstep(yT-2.4,yT,P.y), isR)*(0.62+0.38*cos((P.z-vS.z)/lat*6.2831853))*uTabI*(isR > 0.5 ? 0.95 : 0.36);   // (a rank's cloth keeps its candles' warmth to the hem)
        // (a rank's cloth stays its candles' warm ivory in every look: the look's cool light catches only a thin rim of it, the
        // top 0.07 m of the hanging cloth and the outer 0.07 m of the top, and it gives the hall's underlight back warm)
        if (isRank > 0.5) { fillK = 0.05+0.95*mix(smoothstep(yT-0.09,yT-0.02,P.y), smoothstep(hw-0.07,hw-0.01,rx), top); ambT = vec3(1.16,1.0,0.74); }
        if (isRound > 0.5) sideL = (0.95+0.75*smoothstep(0.0,3.0,P.y))*uTabI*0.5;     // a round table's skirt hangs in its own candelabrum's light to the floor
        float pl2 = pool*uPool; if (isRank > 0.5) pl2 = 1.25*pl2/(1.0+1.1*pl2); if (isRound > 0.5) pl2 = 1.2*pl2/(1.0+0.7*pl2);     // (the ranks are passed at arm's length: their tops stay a warm ivory under the flames, never a clipped white)
        E = (E*uBase*mix(1.0,0.6,top) + pl2)*mix(1.0, 0.62, isRank*top) + (1.0-top)*sideL;
      } else {
        vec2 r = P.xz-vec2(0.0,-30.0); float rl = length(r), ang = atan(r.y, r.x+1e-5);
        float fp = max(dot(r/max(rl,1e-3), uTierDir.xz/max(length(uTierDir.xz),1e-3)), 0.0); fw = mix(fw, 0.8*fp*fp, top);    // the tier tops of the cool flank take a wash of it
        float nB = floor(vS.z+0.25);                                        // (the ring's candles; a fraction of one half says that its first candle is a tall one)
        pool = tierPool(P,N,vS.y,nB,vS.w+1.3-uStub,Ld);
        // a tier's own radius and top, from what it carries (a tread carries its own ring; a riser the ring of the tier below
        // and the height 1.8 m under its own top)
        float rT = top > 0.5 ? vS.y+0.5 : (vS.y > 0.5 ? vS.y-1.4 : 20.0);
        yT = top > 0.5 ? P.y : vS.w+1.8; yH = vS.w;
        phi = 0.5; hco = ang*rT;
        edgeIn = rT-rl;
        float under = 0.5+0.5*smoothstep(0.2,1.0,rl-(rT-1.9));               // the top lies in soft shadow close under the tier above
        float vy0 = clamp((P.y-vS.w)/1.8, 0.0, 1.0); float has = step(0.5,nB);
        float ringv = mix(0.8, 0.74+0.26*cos(ang*nB), has);
        float soft = uPool*mix(0.26, 0.34, has)*ringv*(0.5+0.5*exp(-(vy0-0.55)*(vy0-0.55)*5.0))*(1.0+0.07*sin(uTime*2.1+r.x*0.9+r.y*0.7+P.y));
        float cool = fw*min(uTierFill*0.2,1.0); soft *= 1.0-0.6*cool; pool *= (1.0-0.35*cool)*mix(1.0,under,top);
        E = E*uBase*0.55*mix(1.0,under,top) + mix(soft + 0.12*pool*uPool, pool*uPool, top);
        // THE PYRAMID IS A TIERED BUFFET of dark polished walnut. A TREAD: walnut, and under the ring of glasses a strip of
        // ivory damask 0.72 m wide with its lace edges (the linen's own law below). A RISER, 1.8 m high under the gilt
        // rim (hh = height over its foot): a base rail of walnut to 0.14; plates of old mirror from 0.14 to 1.30, each
        // in a gilt fillet 0.035 m wide, between walnut stiles 0.26 m wide that stand midway between the candles of the
        // ring before it; a walnut rail; from 1.40 to 1.70 a gilt band carved with the vine in relief between two beads.
        // The lowest tier stands on a plinth of walnut 1.2 m high (hh under 0) in sunk panels.
        vec3 walnut = vec3(0.20,0.105,0.055)*(0.6+0.8*vnoise(vec3(ang*rl*(top > 0.5 ? 0.8 : 7.0), top > 0.5 ? rl*9.0 : P.y*0.9, 3.0)));
        float fa0 = clamp(foot,0.004,0.12);
        if (top > 0.5) { float sd = abs(rl-(rT-0.5))-0.36; tierMix = smoothstep(-fa0,fa0,sd); edgeIn = -sd; tierPaint = vec4(walnut, 1.6); damK = 1.0; }
        else {
          float hh = P.y-vS.w, stl = 6.2831853/max(nB > 0.5 ? nB : floor(rl/1.035+0.5), 1.0), su = abs(fract(ang/stl)-0.5)*stl*rl;
          float pe = min(su-0.13, min(hh-0.14, 1.30-hh));
          float plate = smoothstep(-fa0,fa0,pe), mirK = smoothstep(-fa0,fa0,pe-0.035);
          float bandK = smoothstep(-fa0,fa0,hh-1.40), bead = lineCov(abs(hh-1.42),0.02,foot)+lineCov(abs(hh-1.68),0.02,foot)+lineCov(abs(hh),0.025,foot);
          vec3 Lq = normalize(Ld); vec2 vl = vineLit(vec2(ang*rl, hh-1.55)/0.42, vec2(dot(Lq.xz, vec2(-sin(ang),cos(ang))), Lq.y));
          vec3 gilt = vec3(0.50,0.36,0.13)*mix(1.0, clamp(1.0 + mix(-0.133, 0.5*vl.x - 1.6*vl.y - 0.22, toMean(foot,0.3)), 0.35, 1.8), bandK*(1.0-min(bead,1.0)));     // (the relief's mean between the beads: -0.133)
          float gk = max(max(bandK, min(bead,1.0)), plate-mirK);
          float groove = mix(0.0667+0.0133/(stl*rl), lineCov(abs(min(su-0.34, min(-0.16-hh, hh+1.04))),0.02,foot), toMean(foot,stl*rl))*step(hh,0.0);     // (a sunk panel's outline; under a pixel as wide as a panel, its mean cover of the plinth)
          tierPaint = vec4(mix(walnut*(1.0-0.55*groove), gilt, gk), mix(1.3, 3.2, gk)); tierMix = 1.0;
          // THE OLD MIRROR gives back what stands before it, painted by the law of a mirror: the sight line is turned on the
          // drum's own round and followed out to the ring of the tier before it: there each candle's flame (its glow, and
          // its wax below it), each glass's wine in the visit's own colour (uWineC), and, where the line comes down on the tread, the ivory of the
          // strip; the silvering is foxed in blotches and gives back half. Under a wide pixel the plate shows its mean
          vec3 Nc = vec3(r.x,0.0,r.y)/max(rl,1e-3), Rm = reflect(-V,Nc); vec2 dm = Rm.xz; float aa = max(dot(dm,dm),1e-4), bb = dot(r,dm), cc = rl*rl-vS.y*vS.y;
          float tt = (-bb+sqrt(max(bb*bb-aa*cc,0.0)))/aa; vec3 H = vec3(r.x,P.y,r.y)+Rm*tt; float ha = atan(H.z, H.x+1e-5);
          float ci = floor(ha/stl+0.5), tall = mod(ci+step(0.25,fract(vS.z))+64.0, 2.0), du = (ha-ci*stl)*vS.y, hy = H.y-vS.w, dy = hy-(1.18-uStub+0.6*tall);
          float flm = 2.2*exp(-du*du/0.012-dy*dy/0.05) + 0.3*exp(-(du*du+dy*dy)/0.5);
          float wax = exp(-du*du/0.008)*step(0.5+0.6*tall,hy)*step(dy,-0.16)*0.4;
          float sg = stl/max(floor(stl*vS.y/0.85+0.5),1.0), dg = (fract(ha/sg)-0.5)*sg*vS.y;
          float ruby = exp(-dg*dg/0.02)*smoothstep(0.36,0.46,hy)*(1.0-smoothstep(0.64,0.74,hy));
          float tp = (vS.w-P.y)/min(Rm.y,-1e-3), strip = step(hy,0.0)*step(abs(length(r+dm*tp)-vS.y),0.36);
          vec3 img = (vec3(1.0,0.70,0.36)*flm + vec3(1.0,0.88,0.66)*wax + uWineC*1.3*ruby + vec3(0.5,0.42,0.3)*strip)*has*uPyI
            + vec3(0.05,0.035,0.022)*(1.0+smoothstep(-0.2,0.6,Rm.y));
          float fox = vnoise(vec3(ang*rl*1.7, P.y*1.7, 5.0)), fox2 = vnoise(vec3(ang*rl*9.0, P.y*9.0, 9.0));
          img *= (0.34+0.3*fox)*(0.7+0.3*smoothstep(0.25,0.5,fox2+0.5*smoothstep(0.0,0.3,pe)));
          tierImg = mirK*mix(vec3(0.085,0.058,0.034)*(0.4+0.6*has*uPyI), img, toMean(foot,0.3));
          tierPaint = vec4(mix(tierPaint.rgb, vec3(0.03,0.028,0.025), mirK), mix(tierPaint.a, 0.0, mirK));
        }
      }
      linLit = top*smoothstep(0.1,1.0,pool*uPool); alb *= mix(vec3(1.0), rankK > 0.5 ? vec3(1.04,1.04,1.02) : (damK > 0.5 ? vec3(1.08,1.09,1.10) : vec3(1.10,1.16,1.30)), linLit);
      if (rankK > 0.5) alb *= vec3(1.0,0.94,0.82);                             // (the ranks' cloth is ivory;
      else if (damK > 0.5) alb *= vec3(1.0,0.965,0.89);                       // the long tables' a paler ivory)
      linWarm = mix(mix(rankK > 0.5 ? vec3(1.0,0.86,0.66) : vec3(0.80,0.72,0.64), vec3(1.0,0.80,0.56), top), rankK > 0.5 ? vec3(1.0,0.90,0.72) : vec3(1.0,0.95,0.87), linLit);     // the light the linen gives back: a cool hw shadow on the hanging cloth, warm ivory on the top, nearly white under a flame
      // the top: a fine woven damask (leaves in a diaper 0.25 m apart) and, on the outer 0.24 m, a lace edge: a row of eyelets,
      // a row of smaller ones, a scalloped line. Each crisp near and at its own mean where a pixel is wider than it
      { float dmk = diaper(dp, foot);
        float c1 = (fract(hco/0.16)-0.5)*0.16, c2 = (fract(hco/0.16+0.5)-0.5)*0.16, fa = clamp(foot,0.003,0.05);
        float holes = figCov(length(vec2(c1,edgeIn-0.09))-0.034, fa, 0.00363) + figCov(length(vec2(c2,edgeIn-0.18))-0.018, min(fa,0.027), 0.00102)
          + lineCov(abs(edgeIn-0.215-0.018*cos(hco*39.27)),0.006,foot);
        float lc = mix(0.17*(1.0-smoothstep(0.24-fa,0.24+fa,edgeIn)), min(holes,1.0), toMean(foot,0.16));       // (the lace lies within the outer 0.24 m; its mean, 0.17 of that strip, is laid on the strip's true width)
        float dm2 = mix(0.34, damask(dp*2.4), toMean(foot,0.9));                  // the damask of the ranks and of every long table: a larger woven figure over the diaper
        alb *= mix(1.0, (1.0+0.07*(dmk-0.31)+max(rankK*0.42, damK*0.34)*(dm2-0.34))*(1.0-0.36*lc), top); }
      // the hanging cloth
      { float vy = clamp((yT-P.y)/max(yT-yH,0.1), 0.0, 1.0), hh = P.y-yH;
        float dk = rankK > 0.5 ? 0.45+0.9*h11(floor(hco/0.8)) : 1.0;              // (a rank's pleats are of unequal depth, each its own: the geometry's law)
        float ridge = mix(1.0, mix(1.0-0.6*min(dk,1.1),1.0+0.14*dk,phi), smoothstep(0.02,0.3,vy));      // a soft shadow in each fold
        float shd = (0.7+0.3*smoothstep(0.0,0.18,yT-P.y))*(0.6+0.4*smoothstep(0.0,0.4,hh));
        float bl = lineCov(abs(hh-0.32),0.014,foot)+lineCov(abs(hh-0.60),0.014,foot)+lineCov(abs(hh-0.46-0.075*sin(hco*15.708))*0.7,0.014,foot);
        vec2 bq = vec2((fract(hco/0.2)-0.5)*0.2, hh-0.46+0.05*sign(sin(hco*15.708))); float bf = clamp(foot*0.5,0.003,0.03);
        bl += figCov(length(bq)-0.022, bf, 0.00152);
        float bm = smoothstep(0.29-0.5*foot,0.30+0.5*foot,hh)-smoothstep(0.62-0.5*foot,0.63+0.5*foot,hh);       // (the band's extent, 0.295 to 0.625: each soft edge centred on its true edge)
        float bandC = mix(0.314*bm, min(bl,1.0), toMean(foot,0.4));                // (the lines and dots lie within the band; their mean, 0.314 of it, is laid on its true extent)
        float sdm = 1.0+0.05*(diaper(vec2(hco,P.y), foot)-0.31);
        vec3 sideA = alb*ridge*shd*sdm;
        if (rankK > 0.5) {
          // A RANK'S HANGING CLOTH: a brocade of deep crimson figured in old gold (a repeat 3 m wide: a pomegranate and a
          // rose of eight petals by turns, each in a pointed oval; its mean far off), its border a band 0.56 m high above
          // the hem embroidered in gold (a vine between two lines), a gold fringe 0.12 m long at the hem. Over it, from the table's edge, the white linen top cloth hangs
          // 0.42 to 0.5 m down: its edge in scallops 0.4 m wide, a row of eyelets and a line along it, its shadow on the brocade
          float dn = yT-P.y, sc = 0.42+0.08*sqrt(max(1.0-(fract(hco/0.4)*2.0-1.0)*(fract(hco/0.4)*2.0-1.0), 0.0)), fa = clamp(foot,0.003,0.05);
          float lin = 1.0-smoothstep(sc-fa, sc+fa, dn);
          float fg = mix(0.209, brocade(vec2(hco, P.y), foot), toMean(foot,1.5)), th = 0.85+0.3*sin(P.y*190.0)*toMean(foot,0.03);
          vec3 broc = mix(vec3(0.15,0.015,0.024), vec3(0.62,0.43,0.14)*th, fg)*ridge*shd;
          float vn = vineH(vec2(hco, hh-0.4)/0.5); bm = smoothstep(0.12,0.13,hh)*(1.0-smoothstep(0.68-0.5*foot,0.69+0.5*foot,hh));
          bandC = bm*mix(0.286, max(smoothstep(0.25,0.4,vn), min(lineCov(abs(abs(hh-0.4)-0.25),0.02,foot)+lineCov(abs(hh-0.10),0.02,foot)+lineCov(abs(hh-0.72),0.02,foot), 1.0)), toMean(foot,0.6));      // (the band's mean: 0.286. Its upper edge is soft about its true height, 0.685; its lower edge, under the fringe, stays; each line with the same line mirrored in the band's nearer edge)
          broc = mix(broc, mix(vec3(0.34,0.035,0.045), vec3(0.72,0.50,0.15), bandC/max(bm,1e-3))*(0.55+0.6*phi)*shd, bm);
          float fr = 1.0-smoothstep(0.11,0.13,hh), thr = mix(0.773, 0.35+0.65*smoothstep(0.2,0.5,abs(fract(hco/0.035)-0.5)*2.0), toMean(foot,0.035));       // (the threads' mean: 0.773)
          broc = mix(broc, vec3(0.66,0.47,0.14)*thr*(0.6+0.5*phi)*(0.5+0.5*smoothstep(0.0,0.12,hh)), fr);
          broc *= 1.0-0.5*(1.0-lin)*(1.0-smoothstep(0.0,0.07,dn-sc));
          float c1 = (fract(hco/0.1)-0.5)*0.1, eye = figCov(length(vec2(c1, dn-sc+0.09))-0.02, min(fa,0.03), 0.00126);
          float lace = mix(0.0923, min(eye+lineCov(abs(dn-sc+0.16),0.008,foot)+lineCov(abs(dn-sc+0.025),0.008,foot)+lineCov(abs(dn-sc-0.025),0.008,foot),1.0), toMean(foot,0.1));     // (the lace's mean over the hanging linen: 0.0923; its hem line with the same line mirrored in the linen's edge)
          sideA = mix(broc, sideA*(1.0-0.3*lace)*1.06, lin);
          spec = mix(spec, mix(0.25+0.7*max(fg, bandC), 0.0, lin), 1.0-top);
        } else if (roundK > 0.5) {
          // A ROUND TABLE'S HANGING CLOTH: a damask to the floor in the table's own dye (deep crimson, old gold or dark
          // green by turns: the cloth's own colour), its woven figure a tone lighter (1.1 m to a repeat; its mean far
          // off), the gold band above the hem; over it, from the table's edge, the white top cloth hangs 0.5 to 0.62 m
          // down, its edge in lace: scallops 0.42 m wide, a row of eyelets and two lines along it, its shadow on the damask
          float dn = yT-P.y, sc = 0.5+0.12*sqrt(max(1.0-(fract(hco/0.42)*2.0-1.0)*(fract(hco/0.42)*2.0-1.0), 0.0)), fa = clamp(foot,0.003,0.05);
          float lin = 1.0-smoothstep(sc-fa, sc+fa, dn);
          float dmf = mix(0.339, damask(vec2(hco, P.y)*1.6), toMean(foot,0.9));
          vec3 dyed = sideA*(0.72+0.95*dmf);
          dyed = mix(dyed, vec3(0.60,0.42,0.12)*(0.55+0.6*phi)*shd, bandC*0.92);
          dyed *= 1.0-0.5*(1.0-lin)*(1.0-smoothstep(0.0,0.09,dn-sc));
          float c1 = (fract(hco/0.105)-0.5)*0.105, eye = figCov(length(vec2(c1, dn-sc+0.1))-0.022, min(fa,0.03), 0.00152);
          float lace = mix(0.0849, min(eye+lineCov(abs(dn-sc+0.18),0.009,foot)+lineCov(abs(dn-sc+0.03),0.009,foot)+lineCov(abs(dn-sc-0.03),0.009,foot),1.0), toMean(foot,0.1));     // (the lace's mean over the hanging linen: 0.0849; its hem line with the same line mirrored in the linen's edge)
          sideA = mix(dyed, vec3(0.81,0.78,0.73)*ridge*shd*sdm*(1.0-0.3*lace)*1.06, lin);
          spec = mix(spec, mix(0.2+0.5*max(dmf-0.3, bandC), 0.0, lin), 1.0-top);
        } else {
          sideA = mix(sideA, vec3(0.60,0.42,0.12)*(0.55+0.6*phi)*shd, bandC*0.92);
          spec = mix(spec, bandC*0.5, 1.0-top); }
        alb = mix(sideA, alb, top); }
      if (kind > 3.5) { alb = mix(alb, tierPaint.rgb, tierMix); spec = mix(spec, tierPaint.a, tierMix); if (tierMix > 0.5) linLit = -1.0; }
      // where a moon bar crosses a rank the glasses throw pale stars on the cloth
      vec2 sg = vec2((P.x-vS.y)/0.8, (P.z-20.8)/1.6); vec2 sf = fract(sg+uMoonDir.xz*-0.6)-0.5;
      extra = uMoonCol*bar*top*step(kind,3.5)*exp(-dot(sf,sf)*38.0)*1.2 + tierImg;
    } else if (kind < 5.5) { spec = 1.0+2.5*vS.y; amb = 0.5;                // gilt, silver, iron
      if (vS.z > 2.5) {
        // AN ARCH OF THE PORCH (surf.z = 3; surf.w = its opening's half width: 8.3, 7.3 or 6.3 m; its head springs at
        // y 10, 8.6 or 7.2; its band 0.9 or 1.2 m wide and 1.5 m deep). dn: metres out from the opening's edge;
        // along: metres along the band from its east springing. ITS FACE: a roll at each edge, a groove inside each
        // roll, and between them the vine carved in relief, lit from where the candles stand. ITS SOFFIT: lined in
        // deep blue with small gilt stars (as the niches are; they go to their mean under a wide pixel), a gilt line
        // 0.15 m in from each edge; it takes the candles' light and, toward the back, the portal's pale blue
        float ar = vS.w, ay = 10.0-1.4*(8.3-ar), aw = ar > 8.0 ? 0.9 : 1.2; bool head = P.y > ay;
        float rr = head ? length(vec2(P.x, P.y-ay)) : abs(P.x), dn = rr-ar, Rm = ar+0.5*aw;
        float along = head ? atan(P.y-ay, P.x)*Rm : (P.x > 0.0 ? P.y-ay : 3.14159*Rm+ay-P.y);
        if (N.z > 0.5) {
          vec2 outw = head ? vec2(P.x, P.y-ay)/max(rr,1e-3) : vec2(P.x > 0.0 ? 1.0 : -1.0, 0.0), tang = vec2(-outw.y, outw.x);
          vec3 Lq = normalize(Ld); vec2 vl = vineLit(vec2(along, dn-0.5*aw)/0.9, vec2(dot(Lq.xy,tang), dot(Lq.xy,outw)));
          float groove = mix(0.12/aw, min(lineCov(abs(dn-0.16),0.03,foot)+lineCov(abs(dn+0.16),0.03,foot)+lineCov(abs(dn-aw+0.16),0.03,foot)+lineCov(abs(dn-aw-0.16),0.03,foot), 1.0), toMean(foot,aw));     // (each groove and the same groove mirrored in the band's nearer edge; under a pixel as wide as the band, their mean cover of it)
          float roll = max(1.0-smoothstep(0.10,0.13,dn), smoothstep(aw-0.13,aw-0.10,dn));
          alb *= clamp(1.0 + mix(ar > 8.0 ? -0.152 : -0.173, 0.5*vl.x - 1.6*vl.y - 0.22, toMean(foot,0.3))*(1.0-roll), 0.35, 1.8)*(1.0+0.22*roll)*(1.0-0.65*groove);    // (the relief's mean between the rolls: -0.152 on a band 0.9 m wide, -0.173 on one 1.2 m wide)
        } else if (abs(N.z) < 0.5 && dn < 0.05) {
          float fa = clamp(foot, 0.004, 0.2), ze = fract((P.z+245.45)/1.5)*1.5; vec3 gold = alb;
          vec2 gc = fract(vec2(along+P.z, along-P.z)/0.78)-0.5; float gl = length(gc)*0.78, th = atan(gc.y, gc.x+1e-5);
          float star = figCov(gl-0.11*(0.55+0.45*cos(5.0*th)), min(fa,0.085), 0.0153);
          alb = vec3(0.022,0.04,0.12)*(0.85+0.3*vnoise(vec3(along*1.3, P.z*1.3, 5.0)));
          alb = mix(alb, gold, mix(0.0252, star, toMean(foot,0.55)));
          float zq = ze-1.5*step(0.75,ze); alb = mix(alb, gold, mix(0.08, min(lineCov(abs(zq-0.15),0.03,foot)+lineCov(abs(zq+0.15),0.03,foot), 1.0), toMean(foot,1.5)));     // (each line and the same line mirrored in the soffit's nearer edge; under a pixel as wide as the soffit, their mean cover of it, 0.08)
          spec = 0.4; extra = alb*(uFlameCol*uTabI*1.2 + vec3(0.56,0.77,1.0)*(1.0-smoothstep(-250.0,-245.4,P.z))); }
      } else if (vS.z > 1.5) {                                                    // surf.z = 2: a carved band (the cornice at the wall head, a riser of the dais steps): the vine
        if (abs(N.y) < 0.5) {                                              // frieze in relief on its upright face, 0.9 m to a wave; surf.w = the band's middle height
          vec3 Lq = normalize(Ld); bool az = abs(N.x) > abs(N.z); vec2 vl = vineLit(vec2(az ? P.z : P.x, P.y-vS.w)/0.9, vec2(az ? Lq.z : Lq.x, Lq.y));
          alb *= clamp(1.0 + mix(-0.166, 0.5*vl.x - 1.6*vl.y - 0.22, toMean(foot,0.3)), 0.35, 1.8); }     // (the relief's mean over the face: -0.165 on the cornice, -0.167 on a riser; the typed -0.166 stands between the two)
      } else if (vS.z > 0.5 && N.z > 0.5) {                                // surf.z = 1: the doorway's pelmet board, a vine frieze carved in relief on its face
        vec3 Lq = normalize(Ld); vec2 vl = vineLit(vec2(P.x, P.y-24.2)/1.6, Lq.xy);
        alb *= clamp(1.0 + mix(-0.176, 0.5*vl.x - 1.6*vl.y - 0.22, toMean(foot,0.4)), 0.35, 1.8); }       // (the relief's mean over the board's face: -0.176)
    } else {                                                               // plain: wax (surf.y = its glow), cloth, leaf
      extra = vC*uFlameCol*vS.y*0.9;                                        // (glowing wax glows as it glows, at every distance)
      if (vS.z < -1.5) {
        // A NICHE of the north wall (surf.z = -2; surf.w = its middle along the wall; 3 m wide, from y 1.2 to a round head
        // at y 9.4): lined in deep blue with small gilt five-pointed stars on a diaper 0.55 m apart (they go to their mean
        // under a wide pixel) and a gilt line 0.14 m inside its edge. It is painted as a hollow: darker toward its sides
        // and its head, and warm low down where the candles of its sill and its stand light it
        float nu = (P.x-vS.w)/1.5, hy = max(P.y-7.9, 0.0), pe = 1.5-length(vec2(P.x-vS.w, hy)), fa = clamp(foot, 0.004, 0.2);
        vec2 gc = fract(vec2(P.x+P.y, P.x-P.y)/0.78)-0.5; float gl = length(gc)*0.78, th = atan(gc.y, gc.x+1e-5);
        float star = figCov(gl-0.11*(0.55+0.45*cos(5.0*th)), min(fa,0.085), 0.0153);
        float hollow = sqrt(max(1.0-nu*nu, 0.0))*(1.0-0.45*smoothstep(7.0,9.4,P.y));
        alb = vec3(0.022,0.04,0.12)*(0.85+0.3*vnoise(vec3(P.x*1.3, P.y*1.3, 5.0)));
        alb = mix(alb, vec3(0.62,0.43,0.13), mix(0.0252, star, toMean(foot,0.55)));
        alb = mix(alb, vec3(0.62,0.43,0.13), lineCov(abs(pe-0.14),0.03,foot));
        alb *= 0.35+0.65*hollow; spec = 0.4; amb = 0.5;
        extra = alb*uFlameCol*uTabI*1.6*exp(-(P.y-3.6)*(P.y-3.6)/9.0)*hollow;
      } else if (vS.z < -0.5) {
        // PILLAR WAX (surf.z = -1; surf.w = how far this place lies below the candle's top, in metres; surf.y = its glow): warm
        // and translucent. The flame shines down into it: the glow is whole at the top and gone 0.4 m down; a darker melted
        // rim round the top's edge; runs of wax down the side, each from the rim to its own length (0.1 to 0.6 m), a
        // little paler than the wax with a shadow beside it. The runs go to their mean under a wide pixel
        float dw = vS.w, sharp = toMean(foot,0.03);
        float st = vnoise(vec3(P.x*42.0, 3.7, P.z*42.0)), ln = 0.1+0.5*vnoise(vec3(P.x*42.0+11.0, 9.1, P.z*42.0));
        float run = smoothstep(0.56,0.66,st)*(1.0-smoothstep(ln-0.04,ln,dw));
        float edge = smoothstep(0.46,0.56,st)*(1.0-smoothstep(0.56,0.66,st))*(1.0-smoothstep(ln-0.04,ln,dw));
        alb *= 1.0 + sharp*(0.22*run - 0.25*edge);
        alb *= 1.0-0.42*(1.0-smoothstep(0.0,0.035,dw))*step(0.004,dw);
        extra *= (0.12+0.88*exp(-dw*dw/0.05))*(1.0+0.3*mix(0.29*(1.0-smoothstep(0.12,0.55,dw)), run, sharp));      // (the runs' mean at this depth: 0.29 at the top, none 0.55 m down)
        alb = mix(alb, alb*vec3(1.0,0.8,0.56), 0.5*exp(-dw/0.25)); spec = 0.35; amb = 0.6;
      } else if (vS.z > 11.5) {
        // A LEAF MASS (an orange tree's head, an urn's flowers, the north arch's swag, the pyramid's garlands): a dark lumpy
        // core (surf.z = 12) under many small cards, each cut to its own outline (surf.y, surf.w: the card's own
        // coordinates, -1 to 1): 13 a spray of five pointed leaves with their midribs, 14 a round fruit, 15 a cluster of
        // four small five-petalled blossoms, 16 a full rose. The fraction of surf.z (over 0.9) is how much the mass's
        // own lanterns light this part from within. The normal a card carries is the mass's own round, so the whole is
        // lit as one body: warm on the side where candles stand, deep green on the far side; no moon bar is laid on it.
        // Under a wide pixel the cut goes to a plain round (four rounds for the blossom) OF THE SAME AREA as the true cut,
        // and the markings to their means over it: a card far off is no larger and no brighter than near
        // (a card's kind is a whole number carried to the pixel: 0.02 is added before it is read, so that a card with no
        // light from within, whose number is exactly whole, is never read as the kind below it)
        float zk = vS.z+0.02, ty = floor(zk), lit = max(fract(zk)-0.02, 0.0)/0.9; vec2 cu = vec2(vS.y, vS.w); float cr = length(cu), ca = atan(cu.y, cu.x+1e-5), det = 1.0-smoothstep(0.25,0.7,leafF);
        extra = vec3(0.0); spec = 0.0;
        if (ty < 12.5) { alb *= 0.5+0.7*vnoise(P*3.1); }
        else if (ty < 13.5) {
          float k5 = floor(ca/1.2566+0.5), ph = ca-k5*1.2566, la = cr*cos(ph), lb = cr*sin(ph);
          float wl = 0.30*pow(max(sin(3.14159*clamp(la,0.0,1.0)),0.0),0.7);
          if (mix(cr-0.785, abs(lb)-wl, det) > 0.0) discard;
          alb *= mix(0.868, (lb > 0.0 ? 1.2 : 0.78)*(1.0-0.4*(1.0-smoothstep(0.0,0.04,abs(lb))))*(0.8+0.4*fract(k5*0.37+0.2))*(0.72+0.3*la), det);
          spec = 0.6*det;
        } else if (ty < 14.5) {
          if (cr > 1.0) discard;
          vec2 hq = cu-vec2(-0.3,0.35); alb = alb*(0.42+0.72*sqrt(max(1.0-cr*cr,0.0))) + vec3(0.5,0.42,0.3)*exp(-dot(hq,hq)*9.0)*0.35;
        } else if (ty < 15.5) {
          vec2 fq = abs(cu)-0.46; float fr5 = length(fq), fa5 = atan(fq.y, fq.x+1e-5);
          if (mix(fr5-0.2703, fr5-0.40*(0.62+0.38*cos(5.0*fa5)), det) > 0.0) discard;
          alb = mix(alb*0.787+vec3(0.62,0.42,0.10)*0.084, mix(vec3(0.62,0.42,0.10), alb, smoothstep(0.06,0.12,fr5))*(0.75+0.3*smoothstep(0.1,0.4,fr5)), det);
        } else {
          if (cr-mix(0.9411, 0.94*(1.0+0.07*cos(7.0*ca)), det) > 0.0) discard;
          alb *= mix(0.762, (0.62+0.38*smoothstep(-0.2,0.6,sin(cr*11.0+ca*2.0)))*(0.75+0.35*cr), det);
        }
        E = E*1.3/(1.0+0.9*E) + lit*uTrI*1.5; amb = 0.6; bar = 0.0;
      } else if (vS.z > 5.5 && vS.z < 6.5) {
        // FOLIAGE in the mass (surf.z = 6): the dais's garlands (surf.w = 1). Dark glossy leaves in clumps, lit on the edge
        // that turns from the eye; in it, in cells 0.55 m apart, round things 0.26 m across: white flowers, dusky red
        // and purple fruit in six cells of ten. Leaves and flowers go to their means under a wide pixel
        // (a mass is a round thing drawn in few faces: a pixel's footprint on it is worked from the round's own normal, ff)
        float ff = vd*uPix/max(dot(N,V),0.2);
        float lf = vnoise(P*5.0), lf2 = vnoise(P*13.0+7.0), frac = 0.6;
        float cs6 = 0.55, r6 = 0.13, f3 = clamp(ff,0.004,0.1);
        vec3 cq = P/cs6, ci = floor(cq); float ch = h31(ci+11.0), kf = h31(ci+17.0);
        float cd = length(fract(cq)-0.5-0.2*(vec3(h31(ci+3.0),h31(ci+5.0),kf)-0.5))*cs6;
        float spot = mix(4.19*r6*r6*r6/(cs6*cs6*cs6)*frac, figCov(cd-r6, f3, 1.047*r6*r6)*step(ch,frac), toMean(ff,cs6));     // (a ball's soft edge adds 0.6 f f/(r r) of its volume: 1.047 r r given as the area dims it by just that)
        vec3 fc = kf < 0.55 ? vec3(0.80,0.78,0.70) : (kf < 0.8 ? vec3(0.45,0.07,0.06) : vec3(0.20,0.07,0.18));
        float rim = 1.0-abs(dot(N,V));
        alb *= mix(0.72, (0.22+1.0*lf)*(0.75+0.5*lf2), toMean(ff,0.25))*(1.0+1.3*rim*rim);
        alb = mix(alb, fc*(0.75+0.5*lf2), spot); spec = 0.9*(1.0-spot)*lf; amb = 0.6; E = E*1.3/(1.0+0.9*E);
      } else if (vS.z > 7.5) {
        // A VERDURE (surf.z = 8 to 11: its design; surf.w: its middle along the wall, which runs along z, or along x where the
        // cloth faces north or south; surf.y: its foot; it hangs to y 21.8, 7.6 m wide; it stirs). Woven foliage and nothing else: two layers of pointed leaves in three greens, each with its midrib;
        // flowers of six petals in ivory, rose and old gold; in designs 0 and 1 three fruiting trees across (a waving trunk, a
        // round crown, oranges in it on design 0, pomegranates on design 1); a flowered border 0.7 m wide (a waving stem, a
        // rosette every 0.7 m, a gold line either side) and a gold fringe at the foot. Grounds: 0 a deep blue-green, 1 wine,
        // 2 a deep green, 3 the darkest blue-green, its leaves dim (THE DARK END's). Under a wide pixel it goes to its mean
        float d = floor(vS.z-7.5), hu = (abs(N.z) > 0.7 ? P.x : P.z)-vS.w, hv = P.y, yb = vS.y, f8 = clamp(foot,0.004,0.4), lb = d > 2.5 ? 0.4 : 1.0; extra = vec3(0.0);
        float stir = sin(hu*2.3+sin(uTime*0.7+P.z*0.1)*1.6+hv*0.25) + 0.5*sin(hv*1.1-uTime*1.1+hu*0.6);
        vec3 ground = d < 0.5 ? vec3(0.030,0.085,0.090) : (d < 1.5 ? vec3(0.150,0.030,0.040) : (d < 2.5 ? vec3(0.045,0.095,0.050) : vec3(0.012,0.032,0.038)));
        vec3 cc = ground;
        for (int i = 0; i < 2; i++) { float sc = i == 0 ? 1.5 : 0.85; vec2 q = vec2(hu, hv)/sc + float(i)*7.3 + d*3.1, ci = floor(q);
          float h1 = h11(ci.x*7.13+ci.y*3.71+d), h2 = h11(ci.x*3.17+ci.y*9.2+1.7), an = h1*6.2832, ca = cos(an), sa = sin(an);
          vec2 l0 = fract(q)-0.5-0.22*(vec2(h1,h2)-0.5), lp = vec2(ca*l0.x+sa*l0.y, ca*l0.y-sa*l0.x)*sc; float la = 0.62*sc, lx = lp.x/la;
          float lf = figCov(abs(lp.y)-0.2*sc*(1.0-lx*lx), f8, 0.858*sc*sc)*step(abs(lx),1.0);     // (a pointed leaf's soft edge adds area only at its two points: 0.858 sc sc is the area that dims it rightly, by measure; its own area is 0.331 sc sc)
          cc = mix(cc, mix(vec3(0.10,0.17,0.07), vec3(0.24,0.27,0.11), h2)*(lp.y > 0.0 ? 1.15 : 0.8)*(1.0-0.5*lineCov(abs(lp.y),0.012,foot))*lb, lf); }
        { float xt = floor(hu/2.6+0.5)*2.6, th = h11(xt*1.7+vS.w*0.13+d), cy = 16.6+2.4*th, tw = d < 1.5 ? 1.0 : 0.0; vec2 cp = vec2(hu-xt, hv-cy);
          float trunk = lineCov(abs(hu-xt-0.14*sin(hv*0.9+th*6.0)), 0.09, foot)*step(hv,cy)*tw;
          float crown = (1.0-smoothstep(-f8,f8, length(cp)-1.25*(1.0+0.12*sin(atan(cp.y,cp.x+1e-5)*7.0+th*9.0))))*tw;
          vec2 fq = cp/0.42, fi = floor(fq); float fh = h11(fi.x*5.3+fi.y*8.7+xt), fruit = figCov(length(fract(fq)-0.5)*0.42-0.11, min(f8,0.12), 0.038)*step(0.45,fh)*crown;
          cc = mix(cc, vec3(0.16,0.09,0.04), trunk); cc = mix(cc, vec3(0.07,0.13,0.06)*(0.8+0.4*fh), crown*0.85);
          cc = mix(cc, d < 0.5 ? vec3(0.62,0.30,0.05) : vec3(0.50,0.09,0.07), fruit); }
        { vec2 q = vec2(hu, hv)/1.05 + 3.3 + d, ci = floor(q); float h1 = h11(ci.x*4.7+ci.y*6.1+d*2.0), h2 = h11(ci.x*8.3+ci.y*2.9);
          vec2 fp = (fract(q)-0.5-0.25*(vec2(h1,h2)-0.5))*1.05; float fr8 = length(fp);
          float flw = figCov(fr8-0.2*(0.62+0.38*cos(6.0*atan(fp.y, fp.x+1e-5)+h1*6.0)), min(f8,0.2), 0.0574)*step(h2, d > 2.5 ? 0.25 : (d > 1.5 ? 0.8 : 0.45));
          cc = mix(cc, (h1 < 0.4 ? vec3(0.62,0.56,0.42) : (h1 < 0.7 ? vec3(0.50,0.16,0.14) : vec3(0.55,0.40,0.12)))*lb, flw);
          cc = mix(cc, vec3(0.45,0.30,0.08)*lb, mix((1.0-smoothstep(-min(f8,0.05),min(f8,0.05), fr8-0.05))*flw, figCov(fr8-0.05, min(f8,0.075), 0.00785)*step(h2, d > 2.5 ? 0.25 : (d > 1.5 ? 0.8 : 0.45)), smoothstep(0.004,0.02,f8))); }     // (the eye: under a pixel wider than 0.02 m it is its own disc at its true area, for the flower's soft edge over it would dim it)
        // (the field's mean colour, by design: ground, leaves, trees and flowers together)
        vec3 mc = d < 0.5 ? vec3(0.125,0.155,0.0811) : (d < 1.5 ? vec3(0.157,0.125,0.0651) : (d < 2.5 ? vec3(0.125,0.163,0.0746) : vec3(0.0421,0.0604,0.0368)));
        float dx8 = 3.8-abs(hu), dy8 = min(21.8-hv, hv-yb), de = min(dx8, dy8);
        if (de < 0.7) {                                                      // the border
          float t = dx8 < dy8 ? hv : hu; vec2 bq = vec2((fract(t/0.7)-0.5)*0.7, de-0.38); float br = length(bq), par = mod(floor(t/0.7),2.0);
          float ros = figCov(br-0.19*(0.62+0.38*cos(6.0*atan(bq.y, bq.x+1e-5))), min(f8,0.19), 0.0518);
          vec3 bg = d > 0.5 && d < 1.5 ? vec3(0.02,0.04,0.10) : vec3(0.11,0.022,0.03);
          cc = mix(bg, vec3(0.12,0.18,0.07), lineCov(abs(de-0.38-0.13*sin(t*8.976)), 0.025, foot));
          cc = mix(cc, par < 0.5 ? vec3(0.62,0.56,0.42) : vec3(0.52,0.17,0.15), ros)*lb;
          cc = mix(cc, vec3(0.50,0.34,0.10), min(lineCov(abs(de-0.05),0.03,foot)+lineCov(abs(de+0.05),0.03,foot)+lineCov(abs(de-0.6775),0.0225,foot)+lineCov(abs(de-0.7225),0.0225,foot), 1.0));     // (each gold line and the same line mirrored in the border's nearer edge, 0 and 0.7 m: what a soft edge throws past the border comes back, and the lines keep their 0.15 of it)
          mc = d < 0.5 ? vec3(0.219,0.116,0.0721) : (d < 1.5 ? vec3(0.157,0.129,0.120) : (d < 2.5 ? vec3(0.219,0.116,0.0721) : vec3(0.130,0.0753,0.0373))); }      // (the border's mean colour, by design)
        if (hv-yb < 0.3) { cc = vec3(0.50,0.34,0.10)*(0.5+0.7*step(0.5,fract(hu/0.06))); mc = vec3(0.50,0.34,0.10)*0.85; }
        alb = mix(mc, cc, toMean(foot,1.5))*(0.92+0.08*sin(hv*70.0)*toMean(foot,0.09))*(0.8+0.18*stir);
        alb = mix(alb*0.22, alb, smoothstep(0.03,0.6,E)); amb = 0.6;
      } else if (vS.z > 6.5 && vS.z < 7.5) {
        // THE GREAT CARPET of the dais (x -18.5 to 18.5, z -121.5 to -194.5; a fringe 0.45 m long at its two ends). A deep crimson
        // field under an all-over arabesque 2.4 m to a repeat (a gold stem in rounded lozenges, an ivory flower of eight petals
        // in each, a dark blue four-leaved form between); a lobed centre medallion 17 m by 24 m in dark blue, edged in gold,
        // with a ring of sixteen ivory petals and a crimson heart, a lesser one north and south of it and a quarter of one in
        // each corner; a border 3.4 m wide: a guard of ivory beads on blue, a blue band with a waving gold vine and ivory
        // flowers, an inner guard of blue beads on ivory. Under a wide pixel every part goes to its own mean
        vec2 c = vec2(P.x, P.z+158.0), hc = vec2(18.5, 36.5), ac = abs(c); float f7 = clamp(foot,0.004,0.5), rel = toMean(foot,2.4);
        float pile = 0.88+0.12*sin(P.x*43.0)*sin(P.z*43.0)*toMean(foot,0.15);
        vec3 crim = vec3(0.26,0.028,0.035), gold = vec3(0.52,0.36,0.11), blue = vec3(0.022,0.045,0.14), ivory = vec3(0.62,0.56,0.44), cc, mc;
        float de = min(hc.x-ac.x, hc.y-ac.y);
        if (de < 0.0) {                                                      // the fringe
          cc = ivory*(0.45+0.75*step(0.5,fract(P.x/0.07))); mc = ivory*0.82; rel = toMean(foot,0.07);
        } else if (de < 3.4) {
          float t = hc.x-ac.x < hc.y-ac.y ? c.y : c.x, v = de-1.7, j = floor(t/1.1), sg = mod(j,2.0) < 0.5 ? 1.0 : -1.0, tl = (fract(t/1.1)-0.5)*1.1;
          float vine = lineCov(abs(v-0.75*sin(t*2.856))*0.6, 0.05, foot);
          vec2 fp = vec2(tl, v+0.35*sg); float fr7 = length(fp), fa7 = atan(fp.y, fp.x+1e-5);
          float fl7 = figCov(fr7-0.42*(0.62+0.38*cos(6.0*fa7)), min(f7,0.3), 0.253), ey = figCov(fr7-0.12, min(f7,0.25), 0.0452);
          float bead = figCov(length(vec2((fract(t/0.45)-0.5)*0.45, abs(v)-1.47))-0.13, min(f7,0.13), 0.0531);
          cc = mix(mix(mix(blue, gold, vine), ivory, fl7), gold, ey);
          cc = mix(cc, gold, bnd(1.1,1.25,abs(v),f7));
          cc = mix(cc, v < 0.0 ? mix(blue, ivory, bead) : mix(ivory, blue, bead), smoothstep(1.25-f7,1.25+f7,abs(v)));
          mc = mix(vec3(0.168,0.148,0.158), v < 0.0 ? vec3(0.181,0.182,0.220) : vec3(0.461,0.423,0.360), step(1.25,abs(v)));     // (the means of the band and of either guard)
        } else {
          vec2 fq = c/2.4, f1 = fract(fq)-0.5, f2 = fract(fq+0.5)-0.5; float r1 = length(f1)*2.4, a1 = atan(f1.y, f1.x+1e-5), r2 = length(f2)*2.4, a2 = atan(f2.y, f2.x+1e-5);
          float g = cos(fq.x*6.2832)+cos(fq.y*6.2832), gg = 2.618*length(vec2(sin(fq.x*6.2832), sin(fq.y*6.2832)));
          float stem = lineCov(abs(g-0.6)/max(gg,0.6), 0.04, foot);
          float flo = figCov(r1-0.44*(0.6+0.4*cos(8.0*a1)), min(f7,0.44), 0.268), eye = figCov(r1-0.13, min(f7,0.26), 0.0531);
          float lea = figCov(r2-0.52*(0.3+0.7*abs(cos(2.0*a2+0.785))), f7, 0.512);
          cc = mix(mix(mix(mix(crim, gold, stem), blue, lea), ivory, flo), gold, eye);
          mc = vec3(0.270,0.0731,0.0649);                                    // (the field's mean colour)
          // the medallions: the great one in the middle, a lesser one at 15.6 m north and south of it, a quarter one in each corner
          vec2 mq = vec2(c.x, c.y*0.708); float mr = length(mq), ma = atan(mq.y, mq.x+1e-5), ed = 8.6*(1.0+0.05*cos(16.0*ma))-mr;
          vec2 lq = vec2(c.x, ac.y-15.6), kq = ac-(hc-3.4);
          float l2 = 2.3*(1.0+0.1*cos(8.0*atan(lq.y, lq.x+1e-5)))-length(lq), k2 = 5.6*(1.0+0.06*cos(12.0*atan(kq.y, kq.x+1e-5)))-length(kq);
          float em = max(ed, max(l2, k2));
          if (em > 0.0) {
            float pet = 1.0-smoothstep(-f7,f7, abs(mr-5.2)-0.95*abs(cos(8.0*ma)));
            float ray = lineCov(abs(sin(8.0*ma+1.5708))*mr*0.12, 0.05, foot)*step(2.4,mr)*step(mr,7.6);
            cc = mix(mix(mix(blue, gold, ray), ivory, pet*step(0.0,ed)), gold, 1.0-smoothstep(0.3-f7,0.3+f7,em));
            cc = mix(cc, mix(crim, ivory, figCov(mr-1.25*(0.6+0.4*cos(8.0*ma)), f7, 2.16)), (1.0-smoothstep(2.3-f7,2.3+f7,mr))*step(0.0,ed));
            mc = ed > 0.0 ? vec3(0.196,0.169,0.184) : l2 > 0.0 ? vec3(0.143,0.122,0.133) : vec3(0.074,0.078,0.137);     // (each medallion's own mean colour: the great one, a lesser one, a corner quarter)
          }
        }
        alb = mix(mc, cc, rel)*pile*(0.9+0.2*vnoise(P*1.1));
        alb = mix(alb*0.3, alb, smoothstep(0.03,0.6,E)); E = E*0.9/(1.0+0.5*E); amb = 0.6;
      } else if (vS.z > 0.5 && vS.z < 1.5) {                               // carpet: a dusky crimson, duller than the wine, a woven border
        float pile = 0.86+0.14*sin(P.x*41.0)*sin(P.z*41.0)*toMean(foot,0.15) + 0.1*(vnoise(P*1.3)-0.5);      // (its mean: 0.86)
        float ax = abs(P.x)/1.41; float bord = smoothstep(1.28,1.34,ax)*(1.0-smoothstep(1.52,1.58,ax));
        float leaf = smoothstep(0.3,0.5,sin(P.z*5.2)*sin(ax*10.4+1.57))*(1.0-smoothstep(1.05,1.2,ax));
        alb = mix(alb*pile*(1.0-0.14*leaf), vec3(0.42,0.27,0.07)*pile, bord);
        alb = mix(vec3(0.085,0.03,0.022)*pile, alb, smoothstep(0.04,0.7,E)); E = E*0.7/(1.0+0.6*E); amb = 0.55;   // lit only near candles; dark wine-brown between
      } else if (vS.z > 4.5) {                                             // velvet (the canopy's valance and curtains, the doorway's): deep folds that stir, a soft sheen at the turn of a fold
        float hu = abs(N.x) > 0.7 ? P.z : P.x;
        // (a deep crimson: the folds' hollows dark, the nap lit at the turn of a fold only near a flame; the folds, 1.43 m
        // apart, go to their mean under a wide pixel)
        float fo = mix(0.5, 0.5+0.5*sin(hu*4.4+sin(P.y*0.6)*0.9+0.3*sin(uTime*0.6+hu*0.27+P.y*0.2)), toMean(foot,1.4));
        float nv = 1.0-abs(dot(N,V)), nearF = smoothstep(0.12,0.9,E);
        alb *= (0.2+0.8*fo*fo + 0.1*(1.0-toMean(foot,1.4)*toMean(foot,1.4)))*(0.75+1.5*nv*nv*nearF);          // (the folds' tone keeps its mean, 0.5, as they go)
        alb = mix(vec3(0.034,0.010,0.011)*(0.35+0.65*fo), alb, smoothstep(0.03,0.6,E)); amb = 0.32; spec = 0.2*nearF;
      } else if (vS.z > 3.5) {                                             // the canopy's lining: a painted night sky
        // THE TESTER'S LINING: a painted night sky, as the roof's panels are: a deep blue field with gilt stars of three
        // sizes, one to a cell 1.9 m wide and each in its own place there (five-pointed, 0.2 to 0.62 m across; one cell in
        // nine holds a great one with a ring round it); EIGHT BROAD GILT RIBS 0.7 m wide with a red line either side, from
        // the gilt boss the chandelier hangs from (x 0, z -155) to the four corners and to the four sides; a gold
        // galloon round the boss, 2.3 m out; a border of gilt leaf work 1.5 m wide along the four edges (a running stem
        // with a leaf either side every 0.75 m) inside a red line. It is lit warm from the candles under it: brightest
        // over the two ranks (x 5 and -5, z -130 to -168.4, 19 m below), darker toward its edges. Stars and leaves go
        // to their means under a wide pixel; ribs keep their tone as they thin
        vec2 rr = vec2(P.x, P.z+155.0); float rl = max(length(rr),1e-3), fa = clamp(foot, 0.004, 0.3), ax = abs(rr.x);
        vec3 gold = vec3(0.62,0.43,0.13), red = vec3(0.36,0.06,0.045);
        float xr = P.x > 0.0 ? 5.0 : -5.0, zr = clamp(P.z,-168.4,-130.0); vec2 toR = vec2(xr-P.x, zr-P.z);
        float lit = 1.0/(1.0+dot(toR,toR)/70.0);
        vec2 ci = floor(P.xz/1.9); float h1 = h11(ci.x*12.7+ci.y*31.3+5.0), h2 = h11(ci.x*5.1+ci.y*17.9+1.0), h3 = h11(ci.x*3.3+ci.y*7.7+9.0);
        float sr = h3 > 0.89 ? 0.31 : (h3 > 0.55 ? 0.18 : 0.10);
        vec2 sq = (fract(P.xz/1.9)-0.5)*1.9-(vec2(h1,h2)-0.5)*(1.9-2.0*sr-0.5); float sl = length(sq), sa = atan(sq.y, sq.x+1e-5)+h1*6.28;
        float star = figCov(sl-sr*(0.5+0.5*pow(abs(cos(2.5*sa)),0.7)), min(fa,1.5*sr), 2.34*sr*sr);
        star = min(star + step(0.89,h3)*lineCov(abs(sl-sr*1.45), 0.025, foot), 1.0);
        float gs = mix(0.0246, star, toMean(foot,1.2));                           // (the mean cover of the stars and rings dealt to this lining: 0.0246)
        float dc = rr.y > 0.0 ? abs(ax*27.0-rr.y*17.0)/31.906 : abs(ax*33.0+rr.y*17.0)/37.121, dRib = min(min(ax, abs(rr.y)), dc);
        alb = vec3(0.020,0.040,0.125)*(0.8+0.4*vnoise(vec3(P.xz*0.45, 7.0)))*(1.0+0.6*exp(-rl*rl/160.0));
        alb = mix(alb, gold*(0.85+0.3*h2), gs);
        alb = mix(alb, red, min((lineCov(abs(dRib-0.5), 0.07, foot)+lineCov(dRib+0.5, 0.07, foot))/max(1.0-lineCov(dRib, 0.35, foot), 1e-3), 1.0)*smoothstep(2.3,2.6,rl));     // (a rib's two red lines, as their share of what the rib painted over them leaves: it hides none of their cover)
        alb = mix(alb, gold*(0.8+0.3*vnoise(P*5.0)), lineCov(dRib, 0.35, foot)*smoothstep(1.8,2.1,rl));
        alb = mix(alb, gold*1.15, 0.9*lineCov(abs(rl-2.3),0.13,foot));
        float eb = min(17.0-abs(P.x), min(P.z+188.0, -128.0-P.z));
        if (eb < 1.75) { float eu = (17.0-abs(P.x) < min(P.z+188.0, -128.0-P.z) ? P.z : P.x)/0.75, ev = (eb-0.75)/0.75;
          float lu = fract(eu)-0.5, stem = lineCov(abs(ev-0.16*sin(eu*6.2832)), 0.06, foot*1.33);
          vec2 lq = vec2(lu, abs(ev)-0.42); float leaf = figCov(length(lq*vec2(1.0,1.7))-0.26, min(fa*1.33,0.26), 0.212);
          float gl = mix(0.185, min(stem+leaf,1.0), toMean(foot,0.75));
          vec3 bd = mix(vec3(0.05,0.035,0.03), gold*(0.9+0.3*mix(0.675, mix(leaf, leaf/max(stem+leaf,1e-3), smoothstep(0.004,0.02,fa)), toMean(foot,0.75))), gl);     // (the leaves are 0.675 of the gold; its tone is the leaf's share of it once the edge is soft)
          alb = mix(alb, bd, 1.0-smoothstep(1.5,1.56,eb)); alb = mix(alb, red, lineCov(abs(eb-1.62),0.06,foot)); }
        E = E*0.35 + uTabI*uIsle*1.5*lit; spec = 0.3+0.9*max(gs, lineCov(dRib, 0.35, foot)); amb = 0.3;
      } else if (vS.z > 2.5) {                                             // a wall hanging: crimson damask, a gold leaf border, a fringe; it stirs
        // (surf.w = its middle along a wall that runs along z, or that middle + 1000 on a wall along x; it hangs from y 21.8 to y 11.4, 5.2 m wide.
        // The border is 0.6 m wide at the sides, 0.8 m at the head and 0.9 m at the foot, the lowest 0.35 m of it a fringe)
        float hax = step(500.0,vS.w), hu = (hax < 0.5 ? P.z : P.x)-(vS.w-1000.0*hax), hv = P.y, hz = P.z+P.x;
        float stir = sin(hu*4.6+sin(uTime*0.8+hz*0.1)*2.1+hv*0.25) + 0.5*sin(hv*1.3-uTime*1.4+hu*0.8+hz*0.2);
        float inb = smoothstep(2.0,2.08,abs(hu)) + smoothstep(21.0,21.08,hv) + (1.0-smoothstep(12.3,12.38,hv));
        float sc = mix(0.3, smoothstep(0.1,0.45,sin(hv*3.1+sin(hu*6.0)*1.3)*sin(hu*5.2+0.7)), toMean(foot,0.5));
        float fringe = (1.0-smoothstep(11.75,11.8,hv))*mix(0.5, step(0.0,sin(hu*38.0)), toMean(foot,0.08));
        alb = mix(alb*(0.75+0.5*mix(0.34, damask(vec2(hu,hv)*1.15), toMean(foot,1.0))), vec3(0.50,0.33,0.09)*(0.45+0.9*sc), clamp(inb,0.0,1.0));
        alb = mix(alb, vec3(0.55,0.36,0.1), fringe);
        alb *= 0.78+0.2*stir; alb = mix(vec3(0.07,0.026,0.02), alb, smoothstep(0.03,0.6,E)); amb = 0.55;
      } else if (vS.z > 1.5) { spec = 0.55; alb *= 0.85+0.3*vnoise(P*6.0); }
    }
    // (the petals that lie: on a cloth's top, a carpet, a tread of the dais steps)
    if (N.y > 0.9 && ((kind > 2.5 && kind < 3.5) || (kind > 5.5 && kind < 6.5 && (abs(vS.z-1.0) < 0.5 || abs(vS.z-7.0) < 0.5))
        || (kind > 1.5 && kind < 2.5 && P.y > 0.5 && P.y < 2.5 && P.z < -116.0 && P.z > -200.0))) {
      vec2 lp = lyingPetal(P.xz, foot); alb = mix(alb, mix(vec3(0.84,0.80,0.74), vec3(0.84,0.60,0.60), lp.y*lp.y), lp.x*0.9); }
    if (kind < 1.5) {                                                      // walls: a warm pool round each flame, falling off upward to deep umber at the wall head; the roof dimmer still
      E *= (1.0-mix(0.5, 0.68, smoothstep(-112.0,-66.0,P.z))*smoothstep(7.0,30.0,P.y))*(1.0-0.4*smoothstep(29.0,35.0,P.y))*mix(1.1, 1.0, smoothstep(-112.0,-66.0,P.z));
      E = E*sqrt(E)*uWall/(1.0+0.14*E);
      if (boardK > 0.5) E = 1.1*E+0.1;                                        // (a dresser's back board stands in its own sconces' light)
      // the roof takes its own light (roofLight); a timber catches it on its underside and, less, on its flanks
      if (roofK > 0.5) { float fl = 1.0 + 0.065*sin(uTime*2.3+P.z*0.21+P.x*0.13) + 0.045*sin(uTime*3.7-P.z*0.33+P.y*0.4);
        E = roofLight(P)*fl*(vS.y < 4.5 ? 1.0 : 0.3+0.9*smoothstep(-0.3,0.8,-N.y)); bar = 0.0; amb = vS.y < 4.5 ? 2.4 : 1.5; }
      else if (kind < 0.5) { vec3 Lc = vec3(0.0,34.0,-30.0)-P;                  // the gables stand in the roof's light; the walls over the four crossing arches in the corona's
        float cor = step(abs(P.x),34.5)*step(-72.5,P.z)*step(P.z,10.5)*uPyI*3.2*max(dot(N,normalize(Lc))*0.7+0.3,0.0)/(1.0+dot(Lc,Lc)*0.004);
        E += smoothstep(24.0,32.0,P.y)*(0.45*roofLight(P) + cor);
        // (a painted field stands in the roof's light and the corona's, brightest low down where the light comes from)
        if (paintK > 0.5) { E = (0.4*roofLight(P)+0.7*cor)*(1.3-0.5*smoothstep(30.0,46.0,P.y)); bar = 0.0; amb = 2.0; } } }
    vec3 Ln = normalize(Ld); vec3 Rv = reflect(-V,N); float rl = max(dot(Rv,Ln),0.0); float r2 = rl*rl; float r8 = r2*r2*r2*r2;
    // (silver and gilt are small things: the sharp highlight is whole where a piece 0.36 m wide is 12 pixels across and at
    // its mean where it is 3, as on the glasses)
    float sp = spec*(kind > 4.5 ? mix(0.15, r8*r2*2.2, 1.0-smoothstep(0.03,0.12,vd*uPix))+r2*0.35 : r8*r8*0.6);
    vec3 warm = mix(uFlameCol*mix(vec3(1.0,0.84,0.62), vec3(1.0), smoothstep(0.03,0.45,E)), vec3(1.0,0.92,0.78), smoothstep(0.4,1.3,E)*0.7);
    if (linLit > -0.5) warm = linWarm;
    float dif = kind > 4.5 && kind < 5.5 ? 0.45 : 1.0;
    float fl = max(dot(N,uFillDir),0.0); fl = fl*fl*(0.4+0.6*fl) + 0.03;                       // the look's cool light: an edge on what faces it, not a wash
    vec3 albA = kind < 2.5 && roofK < 0.5 ? mix(alb, vec3(dot(alb,vec3(0.3333))), 0.3) : alb;       // stone and oak in the underlight alone: umber, not maroon
    vec3 gwc; float gw = gwLight(P,N,gwc);                                                       // the great windows' cold light
    // THE CHOIR'S OWN LIGHT, the hall's second colour (uChoir: silver under the moon, deep blue at midnight, pale blue
    // at the blue hour): north of the crossing's north arch (it comes on from z -72 to z -92) the night's light from
    // the choir's windows lies on everything, most on what faces up or across the hall, least on an underside; under
    // the canopy (x -17 to 17, z -128 to -188) a quarter of it, so that the dais stays the warm heart; in THE DARK END
    // (west of x -6, z -172 to -236) half of it. It shows a thing in its own colour, paled. Where it lies, the candles'
    // far wash is held back (to 0.35 of itself where E is under 0.15, whole from E 1) so that their pools stand as warm
    // islands in it, and the hall's underlight goes over to its colour
    float chK = 1.0-smoothstep(-92.0,-72.0,P.z);
    float canK = (1.0-smoothstep(14.0,20.0,abs(P.x)))*smoothstep(-191.0,-185.0,P.z)*(1.0-smoothstep(-131.0,-125.0,P.z))*step(P.y,26.2);
    float dkK = (1.0-smoothstep(-9.0,-3.0,P.x))*(1.0-smoothstep(-175.0,-169.0,P.z))*smoothstep(-239.0,-233.0,P.z);
    float chL = chK*(1.0-0.75*canK);
    float Ew = E*mix(1.0, 0.35+0.65*smoothstep(0.15,1.0,E), chL);
    vec3 ambC = mix(uAmb, uChoir*(dot(uAmb,vec3(0.3333))/max(dot(uChoir,vec3(0.3333)),1e-3)), chL);
    col = alb*(warm*Ew*uGain*(dif+sp) + uFill*(kind > 3.5 && kind < 4.5 ? uTierFill*fw : fl*fillK) + uMoonCol*bar + gwc*gw*(kind > 1.5 && kind < 2.5 ? 4.0 : 2.4)) + albA*ambC*ambT*amb + extra
      + (kind > 1.5 && kind < 2.5 ? gwc*gw*0.25 : vec3(0.0));                                  // (the polished floor gives the cold light back as its own colour)
    col += (alb*0.7+vec3(0.05))*uChoir*(chL*(1.0-0.5*dkK)*(0.5+0.3*N.y+0.25*abs(N.x)));
  }
  gl_FragColor = vec4(col,1.0);
  #include <fog_fragment>
}`,ut=`
  #ifdef USE_FOG
    col *= exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  #endif`,Qo=`
varying vec3 vDir;
void main(){ vDir = position; vec4 p = projectionMatrix*viewMatrix*vec4(position+cameraPosition,1.0);
  if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,$o=`
uniform float uTime; varying vec3 vDir;
`+_e+Jt+`
void main(){ vec3 d = normalize(vDir+vec3(0.0,1e-5,0.0)); gl_FragColor = vec4(nightSky(d,uTime),1.0); }`,ea=`
#include <common>
#include <fog_pars_vertex>
uniform float uTime, uPix, uGustAmp, uGustTail; varying vec2 vUv; varying float vI;
`+_e+Ke+dt+`
void main(){
  vec3 c = instanceMatrix[3].xyz; float base = length(instanceMatrix[0].xyz);
  vec4 wc = modelMatrix*vec4(c,1.0); vec4 mv = viewMatrix*wc; float dist = max(-mv.z,0.1);
  float size = max(base, dist*uPix*2.4); float k = base/size;
  float dz = gustD(wc.z); float lean = uGustAmp*(dz > 0.0 ? exp(-dz*dz/60.0) : exp(dz/max(uGustTail,1.0)));
  float dg = dz+7.0; float gut = min(uGustAmp*exp(-dg*dg/260.0),1.0);
  // the breath lays every flame's light over on its one bearing: the halo is drawn out along that lean
  vec3 lv = (viewMatrix*vec4(vec3(1.28*GB.x,-0.16,1.28*GB.y)*lean*base*3.6, 0.0)).xyz;
  float ll = length(lv.xy); float bl = clamp(lean*2.5, 0.0, 1.0);
  vec2 along = normalize(vec2(0.0,1.0-bl) + lv.xy/max(ll,1e-4)*bl + vec2(1e-4,0.0)); vec2 perp = vec2(along.y,-along.x);
  float str = 1.0 + bl*ll/size;
  float hk = h31(floor(c*5.0)+7.0);
  vI = breath(c,uTime)*(1.0+0.09*sin(uTime*(2.0+2.6*hk)+hk*60.0))*k*k*(1.0-0.5*gut)*(1.0+0.5*lean)/sqrt(str);
  vec2 q = (uv-0.5)*2.0;
  mv.xy += lv.xy*0.5*bl + (perp*q.x + along*q.y*str*(1.0-0.25*gut))*size; vUv = uv;
  vec4 mvPosition = mv; gl_Position = projectionMatrix*mv;
  #include <fog_vertex>
}`,ta=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uFlameCol; uniform float uHalo; varying vec2 vUv; varying float vI;
void main(){ vec2 q = (vUv-0.5)*2.0; float r2 = dot(q,q); float g = exp(-r2*5.5)*0.55+exp(-r2*30.0)*0.75;
  vec3 col = uFlameCol*vec3(1.0,0.78,0.5)*g*vI*uHalo*(1.0-smoothstep(0.7,1.0,r2));
  `+ut+`
  gl_FragColor = vec4(col,1.0); }`,oa=`
#include <common>
#include <fog_pars_vertex>
uniform float uTime, uGustAmp, uGustTail; varying vec2 vUv; varying float vK;
`+_e+Ke+dt+`
void main(){
  vec3 c = instanceMatrix[3].xyz; float h = length(instanceMatrix[1].xyz); float k = h31(floor(c*3.0)+1.0);
  vec4 wc = modelMatrix*vec4(c,1.0); float y = uv.y; float dz = gustD(wc.z); float gust = uGustAmp*(dz > 0.0 ? exp(-dz*dz/60.0) : exp(dz/max(uGustTail,1.0)));
  vec3 toC = cameraPosition-wc.xyz; vec2 f = toC.xz/max(length(toC.xz),1e-3); vec3 right = vec3(f.y,0.0,-f.x);
  float t = uTime*(0.5+0.4*k); float w = 0.16+1.25*y*y;
  vec3 p = wc.xyz + vec3(0.0,y*h,0.0) + right*(uv.x-0.5)*w
    + vec3(sin(y*5.0-t*1.9+k*20.0), 0.0, cos(y*4.1-t*1.6+k*11.0))*0.16*y*y*h*0.4 + vec3(1.06*GB.x,-0.5*y,1.06*GB.y)*gust*1.7*y*h;      // the breath bends it flat on its one bearing
  vUv = uv; vK = k;
  vec4 mvPosition = viewMatrix*vec4(p,1.0); gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,aa=`
#include <common>
#include <fog_pars_fragment>
uniform float uTime; uniform vec3 uFlameCol; varying vec2 vUv; varying float vK;
void main(){ float x = abs(vUv.x-0.5)*2.0; float a = exp(-x*x*3.2)*(1.0-x*x)*smoothstep(0.0,0.14,vUv.y)*(1.0-smoothstep(0.25,1.0,vUv.y));
  a *= 0.65+0.35*sin(vUv.y*9.0-uTime*(1.6+vK)+vK*30.0+x*2.0);
  vec3 col = (uFlameCol*0.055+vec3(0.034,0.035,0.04))*a;
  `+ut+`
  gl_FragColor = vec4(col,1.0); }`,sa=`
#include <common>
#include <fog_pars_vertex>
attribute vec4 aS; attribute float aK; uniform float uTime, uGustZ, uGustS, uPix; uniform vec3 uLine[60]; varying vec2 vUv; varying float vA;
`+Ke+`
void main(){
  vec3 dir = normalize(vec3(GB.x,-0.05,GB.y));
  float dz = mod(aS.z + uTime*(5.0+5.0*aK) + 52.0, 60.0) - 52.0;            // streaming through the band behind the front
  vec3 c = vec3(aS.x + dz*GB.x/GB.y, aS.y + 0.4*sin(uTime*1.7+aK*40.0) + 0.02*dz, uGustZ + dz);
  vec3 toC = cameraPosition-c; float dist = max(length(toC),0.1);
  float env = (1.0-smoothstep(0.0,6.0,dz))*smoothstep(-52.0,-22.0,dz);
  float dl = 1e3;                                                            // distance to the flown line, by place
  for (int i = 0; i < 59; i++) { vec3 a = uLine[i], ab = uLine[i+1]-a; vec3 q = c-a-ab*clamp(dot(c-a,ab)/max(dot(ab,ab),1e-4), 0.0, 1.0); dl = min(dl, dot(q,q)); }
  env *= smoothstep(12.25,17.64,dl);                                         // (squares of 3.5 m and 4.2 m)
  vec3 side = normalize(cross(dir,toC)+vec3(0.0,1e-5,0.0));
  float w0 = 0.022;
  vec3 p = c + dir*(uv.x-0.5)*aS.w + side*(uv.y-0.5)*w0*2.0;
  float dxl = c.x-11.0*clamp(floor(c.x/11.0+0.5),-2.0,2.0), hy = c.y-4.4;      // from the nearest row of low flames (the nave, z 20 to 200)
  float lit = step(20.0,c.z)*step(c.z,200.0)*1.5/(1.0+0.16*(dxl*dxl+hy*hy));
  vec3 pv = c-vec3(0.0,12.0,-30.0); lit = max(lit, 1.1/(1.0+0.004*dot(pv,pv)));  // or from the pyramid's flames
  vA = uGustS*env*lit*smoothstep(0.4, 0.6, 2.0*w0/max(dist*uPix, 1e-7))*(0.5+0.5*aK); vUv = uv;
  vec4 mvPosition = viewMatrix*vec4(p,1.0); gl_Position = projectionMatrix*mvPosition;
  if (uGustS < 0.002) gl_Position = vec4(0.0,0.0,2.0,1.0);                   // no streaks: nothing is drawn
  #include <fog_vertex>
}`,na=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uFlameCol; varying vec2 vUv; varying float vA;
void main(){ float y = abs(vUv.y-0.5)*2.0; float x = vUv.x;
  float a = (1.0-y*y)*smoothstep(0.0,0.5,x)*(1.0-smoothstep(0.82,1.0,x));       // a bright head to the south, a tail behind it
  vec3 col = vec3(1.0,0.88,0.66)*a*vA*0.6;
  `+ut+`
  gl_FragColor = vec4(col,1.0); }`,ra=`
#include <common>
#include <fog_pars_vertex>
attribute vec4 aS; attribute vec4 aK; attribute float aF; uniform float uTime, uPix, uTabI, uChI, uPyI, uGain; uniform vec3 uFlameCol, uChoir; varying vec2 vUv; varying vec3 vCol; varying float vA;
void main(){
  float f = fract(uTime/aK.x + aK.y), ph = aK.y*40.0, y = mix(aS.y, aF, f);
  vec3 c = vec3(aS.x + aS.w*(0.7*sin(uTime*0.43+ph) + 0.3*sin(uTime*1.1+ph*1.7)), y, aS.z + aS.w*(0.7*cos(uTime*0.37+ph*1.3) + 0.3*sin(uTime*0.9+ph*2.3)));
  float a1 = uTime*(1.1+0.9*aK.w)+ph, a2 = uTime*(0.7+0.5*aK.w)+ph*0.6;
  vec3 n = normalize(vec3(sin(a1)*cos(a2), 0.35+0.8*cos(a1), sin(a1)*sin(a2)) + vec3(0.0,0.001,0.0));
  vec3 U = normalize(cross(n, vec3(cos(a2*1.3), 0.21, sin(a2*1.3))) + vec3(0.0,0.002,0.0)), W = cross(n, U);
  vec3 wp = c + (U*(uv.x*2.0-1.0) + W*(uv.y*2.0-1.0))*aK.z;
  float dist = max(length(cameraPosition-c), 0.1);
  float q1 = (y-15.0)/7.0, q2 = (y-26.0)/16.0, q3 = (y-8.0)/9.0;
  float E = 0.38*uTabI*exp(-y/7.0) + 0.5*(0.12+uChI)*step(10.0,c.z)*exp(-q1*q1)
    + 0.75*uPyI*exp(-(c.x*c.x+(c.z+30.0)*(c.z+30.0))/1400.0)*exp(-q2*q2) + 0.6*uTabI*step(c.z,-112.0)*step(-204.0,c.z)*exp(-q3*q3)*exp(-c.x*c.x/500.0);
  // (a petal is pale and a little translucent: white to shell pink; it gathers the hall's light from all round, so its
  // darkest is about half of white linen there; the candles stand below it and above it, so it takes most of their
  // light where it lies flat and most of the light that comes through it where it stands on edge: its shade follows
  // its own turning, not the eye; in the choir it takes the choir's own cool light as well)
  float fc = abs(n.y), face = 0.8+0.2*fc;
  vec3 thru = (uFlameCol*0.34*uGain + vec3(0.05,0.055,0.07) + uChoir*0.22*(1.0-smoothstep(-92.0,-72.0,c.z)))*(1.25-0.35*fc);
  vCol = mix(vec3(0.97,0.95,0.92), vec3(0.98,0.84,0.82), aK.w)*(uFlameCol*E*uGain*1.5*face + thru);
  vA = smoothstep(0.4, 0.6, 2.0*aK.z/(dist*uPix))*smoothstep(0.0,0.04,f)*(1.0-smoothstep(0.97,1.0,f)); vUv = uv*2.0-1.0;
  vec4 mvPosition = viewMatrix*vec4(wp,1.0); gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ia=`
#include <common>
#include <fog_pars_fragment>
varying vec2 vUv; varying vec3 vCol; varying float vA;
void main(){
  float r = length(vec2(vUv.x*1.12, vUv.y+0.3*vUv.x*vUv.x-0.12));            // a petal: broad, its far edge a little hollowed
  float a = (1.0-smoothstep(0.74,0.9,r))*vA; if (a < 0.02) discard;
  gl_FragColor = vec4(vCol*(0.86+0.14*vUv.y), a*0.88);
  #include <fog_fragment>
}`,la=(t,e)=>new g.Vector2(Math.max(t,1e-4),e),V0=(t,e,s)=>new g.BoxGeometry(t,e,s),p0=(t,e,s,n=8,r=!1)=>new g.CylinderGeometry(t,e,s,n,1,r),fa={E:[[1,-1,1],[1,-1,-1],[1,1,-1],[1,1,1],[1,0,0]],W:[[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1],[-1,0,0]],U:[[-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1],[0,1,0]],D:[[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1],[0,-1,0]],S:[[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1],[0,0,1]],N:[[1,-1,-1],[-1,-1,-1],[-1,1,-1],[1,1,-1],[0,0,-1]]};function k0(t,e,s,n="",r=null){const o=[],a=[],f=[],i=[];let u=0;for(const S of"EWUDSN"){if(n.includes(S))continue;const d=fa[S],h=r&&r[S];for(let T=0;T<4;T++)o.push(d[T][0]*t/2,d[T][1]*e/2,d[T][2]*s/2),a.push(d[4][0],d[4][1],d[4][2]),f.push(h?h.r:1,h?h.g:1,h?h.b:1);i.push(u,u+1,u+2,u,u+2,u+3),u+=4}const P=new g.BufferGeometry;return P.setAttribute("position",new g.Float32BufferAttribute(o,3)),P.setAttribute("normal",new g.Float32BufferAttribute(a,3)),r&&P.setAttribute("color",new g.Float32BufferAttribute(f,3)),P.setIndex(i),P}const Z=(t,e=10)=>new g.LatheGeometry(t.map(s=>la(s[0],s[1])),e);function r0(t,e,s,n=.12,r="y"){const o=new g.Shape,a=r==="y"||r==="z"?t/2:s/2,f=r==="y"?s/2:e/2,i=Math.min(n,a*.45,f*.45);o.moveTo(-a+i,-f),o.lineTo(a-i,-f),o.lineTo(a,-f+i),o.lineTo(a,f-i),o.lineTo(a-i,f),o.lineTo(-a+i,f),o.lineTo(-a,f-i),o.lineTo(-a,-f+i);const u=r==="y"?e:r==="z"?s:t,P=new g.ExtrudeGeometry(o,{depth:u,bevelEnabled:!1,steps:1});return P.translate(0,0,-u/2),r==="y"?P.rotateX(-I/2):r==="x"&&P.rotateY(I/2),P}function ce(t,e,s,n,r=8){const o=new g.Shape,a=t/2,f=e-a;o.moveTo(-a-s,0),o.lineTo(-a-s,f);for(let u=0;u<=r;u++){const P=I-u/r*I;o.lineTo(Math.cos(P)*(a+s),f+Math.sin(P)*(a+s))}o.lineTo(a+s,0),o.lineTo(a,0),o.lineTo(a,f);for(let u=0;u<=r;u++){const P=u/r*I;o.lineTo(Math.cos(P)*a,f+Math.sin(P)*a)}o.lineTo(-a,0),o.lineTo(-a-s,0);const i=new g.ExtrudeGeometry(o,{depth:n,bevelEnabled:!1,steps:1,curveSegments:1});return i.translate(0,0,-n/2),i}function Ve(t,e,s=8){const n=new g.Shape,r=t/2,o=e-r;n.moveTo(-r,0),n.lineTo(r,0),n.lineTo(r,o);for(let a=1;a<=s;a++){const f=a/s*I;n.lineTo(Math.cos(f)*r,o+Math.sin(f)*r)}return n.lineTo(-r,0),new g.ShapeGeometry(n,1)}const xe=t=>new g.Color(t),s0=(t,e)=>new g.Color(t).multiplyScalar(e);function h0(t,e,s,n,r,o,a,f){const i=s[0]-e[0],u=s[1]-e[1],P=s[2]-e[2],S=r[0]-e[0],d=r[1]-e[1],h=r[2]-e[2],T=u*h-P*d,v=P*S-i*h,m=i*d-u*S;T*(o[0]-e[0])+v*(o[1]-e[1])+m*(o[2]-e[2])>=0?t.quad(e,s,n,r,a,f):t.quad(e,r,n,s,a,f)}const y={stone:"#5d5247",stoneD:"#453c34",oak:"#6a523a",oakD:"#4a3828",roof:"#6c5a4a",floor:"#66503a",linen:"#e8dfcc",linenD:"#cfc8bb",gilt:"#b8923f",seat:"#521019",silver:"#cfcac0",iron:"#2c2520",wax:"#efe2c4",pom:"#7a2a22",grape:"#3a1a30"};function de(t,e,s,n,r,o,a=30){const f=Math.hypot(n-e,r-s),i=-(r-s)/f,u=(n-e)/f,P=i*(o[0]-e)+u*(o[2]-s)>=0?1:-1,S=i*P*.35,d=u*P*.35;h0(t,[e,0,s],[n,0,r],[n,a,r],[e,a,s],o,y.stone,L(U0)),h0(t,[e+S,0,s+d],[n+S,0,r+d],[n+S,10.2,r+d],[e+S,10.2,s+d],o,y.oak,L(P0,2,0,Math.abs(n-e)>Math.abs(r-s)?1:0));const h=Math.atan2(-(r-s),n-e);t.add(r0(f,.5,.9,.16,"x"),{p:[(e+n)/2+S,10.35,(s+r)/2+d],r:[0,h,0],c:y.oak,surf:L(P0)}),t.add(r0(f,.8,.7,.2,"x"),{p:[(e+n)/2+S*.6,.4,(s+r)/2+d*.6],r:[0,h,0],c:y.oakD,surf:L(P0)}),t.add(r0(f,1.5,1.5,.36,"x"),{p:[(e+n)/2,a-.35,(s+r)/2],r:[0,h,0],c:y.gilt,surf:L(Q,.6,2,a-.35)})}function Ae(t,e,s,n,r){const o=Math.abs(n)>.5,a=L(P0,3,o?s:e,o?0:1),f=Math.atan2(n,r);t.add(k0(1.2,8.4,.12,"NUD"),{p:[e+n*.06,5,s+r*.06],r:[0,f,0],c:y.oak,surf:a}),t.add(k0(1.5,1.3,.24,"ND"),{p:[e+n*.12,.65,s+r*.12],r:[0,f,0],c:y.oakD,surf:L(P0)}),t.add(k0(1.5,.9,.26,"NU"),{p:[e+n*.13,9.65,s+r*.13],r:[0,f,0],c:s0(y.oak,1.12),surf:L(P0)})}const pt=5.2,Qt=16,$t=12;function ca(){const t=A0.makeBuilder(),e=L(U0),s=8,n=Qt-pt/2,r=a=>{const f=[[-a,0],[-a,n]];for(let i=1;i<s;i++){const u=I-i/s*I;f.push([Math.cos(u)*a,n+Math.sin(u)*a])}return f.push([a,n],[a,0]),f},o=(a,f,i,u,P,S)=>{const d=r(a),h=r(i);for(let T=0;T<d.length-1;T++){const v=(d[T][0]+d[T+1][0])/2,m=(d[T][1]+d[T+1][1])/2;h0(t,[d[T][0],d[T][1],f],[d[T+1][0],d[T+1][1],f],[h[T+1][0],h[T+1][1],u],[h[T][0],h[T][1],u],S===0?[v,m,99]:S<0?[0,Math.min(m,n),3]:[v*10,m<n?m:n+(m-n)*10,.5],P,e)}};o(2.6,.1,3.1,1,y.stone,-1),o(3.1,1,3.5,1,y.stoneD,0),o(3.5,1,3.5,0,y.stoneD,1);for(const a of[-.87,.87])t.add(k0(.3,15.85,.4,"NUD"),{p:[a,15.85/2,.32],c:y.stoneD,surf:e});t.add(k0(pt,.3,.4,"NEW"),{p:[0,8.3,.32],c:y.stoneD,surf:e}),t.add(r0(7,.5,1.5,.16,"x"),{p:[0,-.25,.75],c:y.stone,surf:e});for(const a of[-2.6,2.6])t.add(V0(.5,.9,.9),{p:[a,-.95,.45],c:y.stoneD,surf:e,tint:(f,i,u,P,S,d,h)=>{d<0&&h>0&&P.multiplyScalar(.7)}});return t.build()}function vt(t,e,s,n,r,o){const a=Math.atan2(r,o);t.add(e,{p:[s,$t,n],r:[0,a,0]}),t.add(Ve(pt,Qt),{p:[s+r*.1,$t,n+o*.1],r:[0,a,0],c:"#ffffff",surf:L(mt,0,Math.abs(r)>.5?n:s)})}function da(t,e){const s=L(U0),n=a=>e*(62-a),r=-e*I/2,o=a=>27+Math.sqrt(Math.max(121-a*a,0));t.add(ce(22,31,1.8,2.6,16),{p:[n(1.3),7,-31],r:[0,r,0],c:y.stone,surf:s}),t.add(ce(20.6,30.3,.7,.9,16),{p:[n(1),7,-31],r:[0,r,0],c:y.stoneD,surf:s}),t.add(Ve(22,31,16),{p:[n(.5),7,-31],r:[0,r,0],c:"#ffffff",surf:L(mt,1)}),t.add(r0(3.4,1,27.2,.3,"z"),{p:[n(1.6),6.5,-31],c:y.stone,surf:s});for(const a of[-6.6,-2.2,2.2,6.6]){const f=o(a)-7+.3;t.add(r0(1.3,f,.7,.2,"y"),{p:[n(1.1),7+f/2,-31+a],c:y.stone,surf:s})}for(const a of[-4.4,0,4.4]){const f=o(a)-27+.3;t.add(r0(.9,f,.4,.12,"y"),{p:[n(1),27+f/2,-31+a],c:y.stone,surf:s})}for(const a of[17,27]){t.add(r0(1.1,.6,22,.16,"z"),{p:[n(1),a,-31],c:y.stone,surf:s});for(let f=-2;f<=2;f++)t.add(new g.TorusGeometry(1.6,.22,4,6,I),{p:[n(1),a-1.9,-31+f*4.4],r:[0,r,0],c:y.stoneD,surf:s})}}function ha(t,e,s,n,r){const o=Math.atan2(n,r);t.add(ce(5.6,9,.9,1.3),{p:[e+n*.6,0,s+r*.6],r:[0,o,0],c:y.stone,surf:L(U0)}),t.add(Ve(5.6,9),{p:[e+n*.5,0,s+r*.5],r:[0,o,0],c:y.oakD,surf:L(P0),tint:(a,f,i,u)=>{const P=Math.floor((a+i)/.7);u.multiplyScalar(.75+.5*(P*7919%5)/5)}});for(const a of[1.6,4.4,6.4])t.add(V0(5.2,.28,.12),{p:[e+n*.58,a,s+r*.58],r:[0,o,0],c:y.iron,surf:L(Q,.2)});t.add(new g.TorusGeometry(.34,.07,5,10),{p:[e+n*.7-r*.5,4,s+r*.7+n*.5],r:[0,o,0],c:y.gilt,surf:L(Q,.7)})}const re=[P0,5,0,0],Ge=new g.Color("#4e2218"),ie=new g.Color("#94702c");function eo(t,e){const s=(o,a,f,i,u=.85)=>{const P=Math.hypot(f-o,i-a),S=Math.atan2(i-a,f-o),d=Math.cos(S),h=Math.abs(d)<.05,T={S:Ge,N:Ge,U:h||d>=0?Ge:ie,D:h||d<0?Ge:ie};t.add(k0(P,u,u*.8,h?"EW":d>=0?"EWU":"EWD",T),{p:[(o+f)/2,(a+i)/2,e],r:[0,0,S],surf:re})},n=L(Q,.7),r=(o,a,f)=>t.add(Z([[0,-.8*f],[.65*f,-.1*f],[0,.35*f]],4),{p:[o,a,e],r:[0,I/4,0],c:y.gilt,surf:n});for(const o of[-1,1]){s(o*34,30,o*.2,45.9,1.3),s(o*34,30.2,o*25.5,30.2,1.4),s(o*25.8,30.6,o*25.8,33.6,1.1);let a=o*33.6,f=23.5;for(let i=1;i<=3;i++){const u=i/3*I/2,P=o*(33.6-7.6*Math.sin(u)),S=23.5+6.2*(1-Math.cos(u));s(a,f,P,S,.9),a=P,f=S}a=o*25.8,f=31;for(let i=1;i<=5;i++){const u=i/5*I/2,P=o*(25.8-25.8*Math.sin(u)),S=31+8.6*Math.sin(u)*(.55+.45*Math.sin(u));s(a,f,P,S,1),a=P,f=S}t.add(Z([[0,-1.4],[.42,-.9],[.22,-.5],[.62,0],[0,.15]],4),{p:[o*25.5,29.5,e],r:[0,I/4,0],c:y.gilt,surf:n}),r(o*12.8,39.4,.8),t.add(r0(1.2,6.4,.7,.2,"y"),{p:[o*33.6,26.7,e],c:y.stone,surf:L(U0)}),t.add(Z([[0,0],[.5,.2],[.95,.9],[1.1,1.3],[0,1.3]],4),{p:[o*33.5,22.2,e],c:y.stoneD,surf:L(U0)})}s(-12.8,40,12.8,40,1.2),s(0,40.6,0,45.6,1),r(0,39.1,1.25)}function to(t,e,s){const n=[0,20,(e+s)/2],r=Math.abs(s-e);for(const o of[-1,1]){h0(t,[o*34,30,e],[o*34,30,s],[0,46,s],[0,46,e],n,"#ffffff",L(P0,4,0));for(const a of[.33,.66])t.add(r0(.9,.9,r,.18,"z"),{p:[o*34*(1-a),30+16*a-.6,(e+s)/2],c:ie,surf:re})}t.add(r0(1.1,1.1,r,.22,"z"),{p:[0,45.4,(e+s)/2],c:ie,surf:re})}const wt=t=>43-15.2*Math.pow(Math.abs(t),1.5)-2.2*(1-Math.sqrt(Math.max(1-Math.pow(t,8),0)));function oo(t,e,s){const n=e-1.6,r=14,o=[];for(let P=-r;P<=r;P++){const S=Math.sin(P/r*I/2);o.push([S*n,wt(S)])}const a=new g.Shape;a.moveTo(-e,25.6),a.lineTo(-e,46),a.lineTo(e,46),a.lineTo(e,25.6);for(let P=o.length-1;P>=0;P--)a.lineTo(o[P][0],o[P][1]);a.lineTo(-e,25.6);const f=new g.Shape,i=[];for(let P=0;P<o.length;P++){const S=o[Math.max(P-1,0)],d=o[Math.min(P+1,o.length-1)],h=Math.hypot(d[0]-S[0],d[1]-S[1])||1;i.push([o[P][0]-(d[1]-S[1])/h*1.3,o[P][1]+(d[0]-S[0])/h*1.3])}f.moveTo(o[0][0],o[0][1]);for(let P=1;P<o.length;P++)f.lineTo(o[P][0],o[P][1]);for(let P=i.length-1;P>=0;P--)f.lineTo(i[P][0],i[P][1]);f.lineTo(o[0][0],o[0][1]);const u=(P,S)=>{const d=new g.ExtrudeGeometry(P,{depth:S,bevelEnabled:!1,steps:1,curveSegments:1});return d.translate(0,0,-S/2),d};t.add(u(a,2.4),{...s,c:y.stone,surf:L(U0,1,e,s.r?1:0)}),t.add(u(f,3),{...s,c:y.stoneD,surf:L(U0)}),t.add(r0(2.2,3.4,3.5,.3,"z"),{...s,p:[s.p[0],43.6,s.p[2]],c:y.stone,surf:L(U0)})}async function ma(t,e,s,n){const r=L(Yt),o=L(U0),a=[0,100,0];h0(e,[-34,0,10],[34,0,10],[34,0,246],[-34,0,246],a,y.floor,r),h0(s,[-62,0,-72],[62,0,-72],[62,0,10],[-62,0,10],a,y.floor,r),h0(n,[-34,0,-246],[34,0,-246],[34,0,-72],[-34,0,-72],a,y.floor,r);for(const i of[-1,1])de(e,i*34,10,i*34,240,[0,0,100]);de(e,-34,240,34,240,[0,0,100],30),h0(e,[-34,30,240],[34,30,240],[0,46,240],[0,46,240],[0,0,100],y.stoneD,o),to(e,10,240);const f=ca();for(let i=0;i<13;i++){for(const u of[-1,1])vt(e,f,u*34,Zt(i),-u,0);eo(e,24+16*i),await t.yield()}for(const i of[-1,1])for(const u of[88,168])ha(e,i*34,u,-i,0);await t.yield();for(const i of[-1,1]){de(s,i*34,10,i*62,10,[i*48,0,-30]),de(s,i*34,-72,i*62,-72,[i*48,0,-30]),de(s,i*62,10,i*62,-72,[0,0,-30]),h0(s,[i*62,30,10],[i*62,30,-72],[i*62,46,-31],[i*62,46,-31],[0,0,-30],y.stoneD,o);for(const u of[10,-72])h0(s,[i*34,30,u],[i*62,30,u],[i*62,46,-31],[i*34,46,-31],[i*48,20,-31],"#ffffff",L(P0,4,1));for(const u of[10,-72])h0(s,[i*34,30,u],[i*34,46,u],[i*34,46,-31],[i*34,46,-31],[0,30,-31],y.stoneD,o),h0(s,[i*34,30,u],[i*34,46,u],[0,46,u],[0,46,u],[0,30,-31],y.stoneD,o);da(s,i);for(const u of[10,-72])vt(s,f,i*48,u,0,u>0?-1:1);for(const u of[41,48,55])s.add(r0(.8,.8,44,.16,"z"),{p:[i*u,37.4,-31],c:Ge,surf:re});s.add(r0(28,.9,.9,.18,"x"),{p:[i*48,45.5,-31],c:ie,surf:re}),await t.yield()}h0(s,[-34,46,-72],[34,46,-72],[34,46,10],[-34,46,10],[0,0,-30],"#ffffff",L(P0,4,2));for(let i=-3;i<=3;i++){s.add(r0(1.3,1.6,82,.25,"z"),{p:[i*9.7,45.2,-31],c:ie,surf:re}),s.add(r0(68,1.3,1.2,.22,"x"),{p:[0,45,-31+i*11.7],c:ie,surf:re});for(let u=-3;u<=3;u++)(i+u)%2===0&&(i||u)&&s.add(Z([[0,-.9],[.7,-.1],[0,.3]],4),{p:[i*9.7,44.4,-31+u*11.7],r:[0,I/4,0],c:y.gilt,surf:L(Q,.7)})}for(const i of[-1,1])for(const u of[-1,1])s.add(r0(1.1,1.5,49,.22,"z"),{p:[i*16.6,45.05,-31+u*20],r:[0,i*u*Math.atan2(34,41),0],c:ie,surf:re});{const i=Z([[.02,-3],[.9,-2.75],[1.3,-2.2],[1.1,-1.7],[2.6,-1.2],[3.8,-.5],[3.5,.1],[.02,.2]],16),u=i.attributes.position;for(let P=0;P<u.count;P++){const S=Math.hypot(u.getX(P),u.getZ(P)),d=1+.07*Math.cos(8*Math.atan2(u.getZ(P),u.getX(P)))*B0(1.2,3,S);u.setXYZ(P,u.getX(P)*d,u.getY(P),u.getZ(P)*d)}i.computeVertexNormals(),s.add(i,{p:[0,46,-31],c:y.gilt,surf:L(Q,.7)})}await t.yield();for(const i of[10,-72])for(const u of[-1,1])s.add(r0(3.2,30,3.2,.7,"y"),{p:[u*34,15,i],c:y.stone,surf:o}),s.add(r0(4,1.2,4,.5,"y"),{p:[u*34,10.6,i],c:y.stoneD,surf:o}),s.add(r0(4.2,1.6,4.2,.6,"y"),{p:[u*34,.8,i],c:y.stoneD,surf:o}),s.add(r0(4.2,1.4,4.2,.6,"y"),{p:[u*34,29.6,i],c:y.stoneD,surf:o}),s.add(r0(4.6,1.2,4.6,.5,"y"),{p:[u*34,25,i],c:y.stoneD,surf:o});for(const i of[10,-72])oo(s,34,{p:[0,0,i]});for(const i of[-1,1])oo(s,41,{p:[i*34,0,-31],r:[0,I/2,0]});await t.yield();for(const i of[-1,1])de(n,i*34,-72,i*34,-246,[0,0,-160]);to(n,-72,-246);for(let i=0;i<10;i++){for(const u of[-1,1])vt(n,f,u*34,Xt(i),-u,0);eo(n,-80-16*i),(i&3)===3&&await t.yield()}for(const i of[-1,1])de(n,i*34,-246,i*9.6,-246,[0,0,-160]);{const i=new g.Shape;i.moveTo(-9.6,11),i.lineTo(-9.6,30),i.lineTo(0,46),i.lineTo(9.6,30),i.lineTo(9.6,11);for(let u=1;u<=16;u++){const P=u/16*I;i.lineTo(Math.cos(P)*9,11+Math.sin(P)*9)}i.lineTo(-9.6,11),n.add(new g.ShapeGeometry(i,1),{p:[0,0,-246],c:y.stone,surf:o})}for(const i of[-1,1])h0(n,[i*9.6,30,-246],[i*34,30,-246],[0,46,-246],[0,46,-246],[0,0,-160],y.stoneD,o);n.add(ce(18,20,1.5,4.4,20),{p:[0,0,-247.6],c:y.stone,surf:o}),n.add(ce(18.9,20.45,.9,1,20),{p:[0,0,-245.2],c:y.stoneD,surf:o});for(const i of[-1,1])n.add(r0(2.6,1.6,5.2,.4,"z"),{p:[i*10,.8,-247.4],c:y.stoneD,surf:o}),n.add(r0(2.4,1,5,.3,"z"),{p:[i*9.9,11.2,-247.4],c:y.stoneD,surf:o});h0(n,[-40,-.02,-330],[40,-.02,-330],[40,-.02,-246],[-40,-.02,-246],a,y.stoneD,o),f.dispose(),n.add(r0(60,.5,1,.16,"x"),{p:[0,4.2,-292],c:y.stone,surf:o}),n.add(r0(60,.6,1.2,.2,"x"),{p:[0,.3,-292],c:y.stoneD,surf:o});for(let i=-13;i<=13;i++)n.add(Z([[.4,0],[.56,.5],[.26,1.3],[.58,2.4],[.26,3.3],[.4,3.6]],4),{p:[i*2.2,.5,-292],c:y.stone,surf:o});for(const i of[-1,1])n.add(Z([[.9,0],[1,.5],[.4,1.2],[1.3,2.6],[1.7,4.2],[1.3,4.5],[0,4.5]],10),{p:[i*14.5,4.4,-292],c:y.stone,surf:o});await t.yield()}function gt(t,e,s,n,r,o,a,f,i,u=1.6){const P=y.linen,S=y.linenD,d=[e,100,0],h=u>1?u/2:u/4,T=w=>(w%1+1)%1,v=w=>(w=T(w*.1031),w*=w+33.33,w*=w+w,T(w)),m=w=>u>1?.21:.3*(.45+.9*v(Math.floor(w/u))),M=w=>.05+m(w-1e-4)*(.5-.5*Math.cos(J*T(w/u))),x=(w,C)=>{const N=[w];for(let R=Math.ceil(w/h+1e-6);R<=Math.floor(C/h-1e-6);R++)N.push(R*h);return N.push(C),N};h0(t,[e-r,o,s],[e+r,o,s],[e+r,o,n],[e-r,o,n],d,P,f);const k=x(s,n),p=x(e-r,e+r);for(const w of[-1,1])for(let C=0;C<k.length-1;C++){const N=k[C],R=k[C+1],H=e+w*r;h0(t,[H,o,N],[H,o,R],[H+w*M(R),a,R],[H+w*M(N),a,N],[e+w*50,o,N],S,f)}for(const[w,C]of[[s,-1],[n,1]])for(let N=0;N<p.length-1;N++){const R=p[N],H=p[N+1];h0(t,[R,o,w],[H,o,w],[H,a,w+C*M(H)],[R,a,w+C*M(R)],[R,o,w+C*50],S,f)}t.add(V0(r*2-.9,a-i+.3,n-s-.9),{p:[e,(a+i+.3)/2,(s+n)/2],c:"#1c120b",surf:L(P0)})}function ua(t,e){const s=[],n=e/2;for(let o=0;o<t.length-1;o++){const a=t[o],f=t[o+1];s.push(0,0,n,a[0],a[1],n,f[0],f[1],n,0,0,-n,f[0],f[1],-n,a[0],a[1],-n),e>.02&&s.push(a[0],a[1],n,a[0],a[1],-n,f[0],f[1],-n,a[0],a[1],n,f[0],f[1],-n,f[0],f[1],n)}const r=new g.BufferGeometry;return r.setAttribute("position",new g.Float32BufferAttribute(s,3)),r.computeVertexNormals(),r}function pa(){const t=A0.makeBuilder(),e=L(Q,.6),s=L(t0,0,2),n="#a8853c",r="#641622";for(const o of[-1,1])for(const a of[-.8,.76])t.quad([o*.8-.08,0,a-o*.08],[o*.8+.08,0,a+o*.08],[o*.8+.08,1.72,a+o*.08],[o*.8-.08,1.72,a-o*.08],n,e);t.add(V0(1.84,.4,1.78),{p:[0,1.9,0],c:r,surf:s,tint:(o,a,f,i,u,P)=>{P<0&&i.multiplyScalar(.5)}}),t.add(V0(1.84,1.3,.14),{p:[0,2.96,-.86],c:n,surf:e}),t.quad([-.7,2.5,-.78],[.7,2.5,-.78],[.7,3.42,-.78],[-.7,3.42,-.78],r,s);{const o=new g.BufferGeometry;o.setAttribute("position",new g.Float32BufferAttribute([-.8,3.6,-.86,.8,3.6,-.86,0,3.97,-.86,-.8,3.6,-.86,-.5,3.6,-.86,-.62,3.84,-.86,.8,3.6,-.86,.62,3.84,-.86,.5,3.6,-.86],3)),o.computeVertexNormals(),t.add(o,{c:n,surf:e})}for(const o of[-1,1])t.add(new g.ConeGeometry(.11,.4,3,1,!0),{p:[o*.86,3.8,-.86],c:n,surf:e});return t.build()}function va(){const t=A0.makeBuilder(),e=L(Q,.6),s=L(t0,0,2),n="#a8853c",r="#641622";for(const o of[-1,1])for(const a of[-.8])t.quad([o*.8-.08,0,a-o*.08],[o*.8+.08,0,a+o*.08],[o*.8+.08,1.72,a+o*.08],[o*.8-.08,1.72,a-o*.08],n,e);t.add(k0(1.84,.4,1.78,"DS"),{p:[0,1.9,0],c:r,surf:s,tint:(o,a,f,i,u,P)=>{P<0&&i.multiplyScalar(.5)}}),t.add(k0(1.84,1.3,.14,"EWUD"),{p:[0,2.96,-.86],c:n,surf:e}),t.quad([-.7,2.5,-.78],[.7,2.5,-.78],[.7,3.42,-.78],[-.7,3.42,-.78],r,s);{const o=new g.BufferGeometry;o.setAttribute("position",new g.Float32BufferAttribute([-.8,3.6,-.86,.8,3.6,-.86,0,3.97,-.86],3)),o.computeVertexNormals(),t.add(o,{c:n,surf:e})}return t.build()}function wa(){const t=A0.makeBuilder(),e=L(Q,.95),s=L(t0,0,2),n="#c29a46",r="#8a6c30",o="#6e1824";for(const a of[-1,1])t.add(p0(.085,.11,3.62,4,!0),{p:[a*.86,1.81,-.86],r:[0,I/4,0],c:n,surf:e,tint:(f,i,u,P,S,d)=>{d<0&&P.set(r)}}),t.add(p0(.1,.055,1.7,4,!0),{p:[a*.8,.85,.76],r:[0,I/4,0],c:r,surf:e}),t.add(new g.OctahedronGeometry(1,0),{p:[a*.86,3.8,-.86],s:[.12,.2,.12],c:n,surf:e});t.add(V0(1.86,.18,1.8),{p:[0,1.76,0],c:r,surf:e}),t.add(r0(1.9,.46,1.84,.18,"x"),{p:[0,2.06,.02],c:o,surf:s,tint:(a,f,i,u,P,S,d)=>{u.multiplyScalar(S>.1?1.25-.3*Math.abs(d):.7)}});for(const a of[2.42,3.5])t.add(V0(1.62,.16,.1),{p:[0,a,-.86],c:n,surf:e});return t.add(V0(1.6,.96,.15),{p:[0,2.96,-.86],c:o,surf:s,tint:(a,f,i,u,P,S,d)=>{d<0&&u.multiplyScalar(.55)}}),t.add(ua([[-.78,0],[-.72,.2],[-.5,.12],[-.25,.2],[0,.39],[.25,.2],[.5,.12],[.72,.2],[.78,0]],.1),{p:[0,3.58,-.86],c:n,surf:e}),t.build()}function ao(t,e,s,n,r,o,a,f){const i=Math.max(4,Math.round(r*1.1)),u=xe(a),P=new g.Color,S=r+.2,d=x=>o-.2-.5*Math.abs(Math.sin(x*i*I)),h=i*6,T=s0(a,.42),v=L(t0);for(let x=0;x<h;x++){const k=x/h,p=(x+1)/h,w=k*J,C=p*J,N=d(k),R=d(p);h0(t,[s+Math.cos(w)*S,N-.13,n+Math.sin(w)*S],[s+Math.cos(C)*S,R-.13,n+Math.sin(C)*S],[s+Math.cos(C)*S,R+.13,n+Math.sin(C)*S],[s+Math.cos(w)*S,N+.13,n+Math.sin(w)*S],[s+Math.cos(w)*99,N,n+Math.sin(w)*99],T,v)}const m=new g.BufferGeometry;m.setAttribute("position",new g.Float32BufferAttribute([-.5,0,0,0,-.2,.05,.5,0,0,0,.2,.05],3)),m.setAttribute("normal",new g.Float32BufferAttribute([0,0,1,0,0,1,0,0,1,0,0,1],3)),m.setIndex([0,1,2,0,2,3]);const M=Math.max(i*4,Math.round(r*J/.4*f));for(let x=0;x<M;x++){const k=(x+e.range(-.25,.25))/M,p=k*J,w=Math.cos(p),C=Math.sin(p),N=S+.05+x%3*.02,R=-.5*i*I*Math.cos(k*i*I)*Math.sign(Math.sin(k*i*I)||1)/(r*J);P.copy(u).multiplyScalar(e.range(.7,1.35)),P.g*=e.range(.92,1.15),t.add(m,{p:[s+w*N,d(k)+(x&1?.07:-.07),n+C*N],r:[e.range(-.25,.25),Math.atan2(w,C),-Math.atan(R)+(x&1?.55:-.55)+e.range(-.2,.2)],s:e.range(.6,.8),c:P,surf:v})}for(let x=0;x<i;x+=3){const k=x/i*J,p=[s+Math.cos(k)*(S+.16),o-.24,n+Math.sin(k)*(S+.16)],w=e.range(.19,.24);t.add(new g.SphereGeometry(w,6,4),{p,c:s0(y.pom,e.range(.9,1.4)),surf:L(Q,.15)}),t.add(p0(w*.34,w*.2,w*.3,5,!0),{p:[p[0],p[1]-w*.95,p[2]],r:[I,0,0],c:s0(y.pom,.7),surf:v})}m.dispose()}function be(t,e=0,s=!1,n=!1){const r=A0.makeBuilder(),o=.94-t+e,a=L(Q,.9),f=L(t0,.55);if(n)return r.add(Z([[.29,0],[.07,.3+e*.8],[.21,.5+e]],3),{c:y.silver,surf:a}),r.add(p0(.07,.078,o-.5-e,3,!0),{p:[0,(o+.5+e)/2,0],c:y.wax,surf:f,grad:[o-.15,o,.5,1.5]}),r.build();if(!s)return r.add(Z([[.29,0],[.08,.14],[.065,.36+e],[.21,.5+e]],3),{c:y.silver,surf:a}),r.add(p0(.07,.078,o-.5-e,3,!0),{p:[0,(o+.5+e)/2,0],c:y.wax,surf:f,grad:[o-.15,o,.5,1.5]}),r.add(new g.ConeGeometry(.07,.02,3,1,!0),{p:[0,o,0],c:y.wax,surf:L(t0,1)}),r.build();r.add(Z([[.3,0],[.2,.06],[.08,.14],[.06,.24+e*.5],[.11,.3+e*.5],[.06,.36+e],[.245,.48+e],[.09,.5+e]],5),{c:y.silver,surf:a}),r.add(p0(.07,.078,o-.52-e,5,!0),{p:[0,(o+.52+e)/2,0],c:y.wax,surf:f,grad:[o-.15,o,.5,1.5]}),r.add(new g.ConeGeometry(.07,.03,5,1,!0),{p:[0,o-.015,0],r:[I,0,0],c:s0(y.wax,1.2),surf:L(t0,1)}),r.add(p0(.007,.011,.075,3,!0),{p:[.004,o+.015,0],r:[.2,0,.12],c:"#140e0a",surf:L(t0)});const i=t>.1?[[.6,.2],[2.9,.26],[4.6,.16]]:[[.6,.3],[3.4,.17]];for(const[u,P]of i.slice(0,2))r.add(p0(.015,.024,Math.min(P,o-.56-e),3,!0),{p:[Math.cos(u)*.078,o-.02-Math.min(P,o-.56-e)/2,Math.sin(u)*.078],c:s0(y.wax,1.08),surf:L(t0,.4)});return r.build()}function Va(t,e,s,n,r){t.add(new g.ConeGeometry(r,.03,5,1,!0),{p:[e,s-.015,n],r:[I,0,0],c:s0(y.wax,1.2),surf:L(t0,1)}),t.add(new g.ConeGeometry(.011,.08,3,1,!0),{p:[e+.004,s+.02,n],r:[.2,0,.12],c:"#140e0a",surf:L(t0)});for(const[o,a]of[[.6,.3],[3.4,.17]])t.add(p0(.015,.026,a,3,!0),{p:[e+Math.cos(o)*r,s-.02-a/2,n+Math.sin(o)*r],c:s0(y.wax,1.08),surf:L(t0,.4)})}function so(t,e,s,n,r,o={}){const a=(o.size||.42)*1.15,f=[0,0,0],i=[0,1,0];for(let u=0;u<n;u++){s(u/n,f,i);const P=e.range(0,J),S=e.range(.1,.5),d=i[1]>.5,h=Math.cos(P),T=Math.sin(P),v=[f[0]+e.range(-.16,.16),f[1]+(d?.02:0),f[2]+e.range(-.16,.16)];if(d?r.push(v[0],v[1],v[2],h,S,T,0,1,0,a*e.range(.7,1.3),u%3):r.push(v[0],v[1],v[2]+.04,h,T,S*.6,i[0],i[1],i[2],a*e.range(.7,1.3),u%3),o.fruit&&e.chance(o.fruit))if(e.chance(.5)){const m=e.range(.16,.21),M=[f[0]+e.range(-.3,.3),f[1]+m*.92,f[2]+e.range(-.3,.3)];t.add(new g.SphereGeometry(m,6,4),{p:M,c:s0(y.pom,e.range(.8,1.3)),surf:L(Q,.15)}),t.add(p0(m*.34,m*.2,m*.3,5,!0),{p:[M[0]+m*.5,M[1]+m*.75,M[2]],r:[0,0,-.6],c:s0(y.pom,.7),surf:L(t0)})}else for(let m=0;m<5;m++)t.add(new g.SphereGeometry(.075,4,3),{p:[f[0]+e.range(-.16,.16),f[1]+.07+(m>2?.1:0),f[2]+e.range(-.16,.16)],c:s0(y.grape,e.range(.8,1.5)),surf:L(Q,.5)})}}function ga(t,e,s,n,r,o,a,f,i=!1){const u=L(Q,.95),P=a?12:5,S=(d=0)=>({p:[s,n+d,r],c:y.silver,surf:u});if(o===0&&i){const d=[[.62,0],[.68,.025],[.66,.05],[.6,.06],[.56,.05],[.52,.07],[.52,.1]];for(let h=1;h<=5;h++){const T=h*I/12;d.push([.5*Math.cos(T),.1+.52*Math.sin(T)])}d.push([.04,.63],[.035,.68],[.09,.73],[.1,.77],[.06,.81],[0,.83]),t.add(Z(d,14),S())}else if(o===0)t.add(Z(a?[[.6,0],[.66,.03],[.64,.06],[.52,.05],[.5,.09],[.49,.3],[.38,.52],[.2,.64],[.05,.68],[.035,.74],[.08,.8],[0,.84]]:[[.64,0],[.5,.06],[.45,.38],[.2,.63],[0,.72]],P),S());else if(o===1){const d=Z(a?[[.3,0],[.32,.03],[.2,.1],[.24,.14],[.56,.3],[.63,.48],[.64,.55],[.6,.57],[.5,.7],[.26,.82],[.06,.86],[.09,.93],[0,.98]]:[[.3,0],[.2,.1],[.6,.4],[.6,.57],[.26,.82],[0,.92]],P);if(t.add(d,{...S(),s:[1,1,.72],r:[0,I/2,0]}),a)for(const h of[-1,1])t.add(new g.TorusGeometry(.13,.03,4,6,I),{p:[s,n+.46,r+h*.63],r:[0,I/2,h>0?-I/2:I/2],c:y.silver,surf:u})}else{t.add(Z(a?[[.36,0],[.38,.03],[.3,.07],[.08,.15],[.06,.4],[.12,.5],[.6,.6],[.66,.65],[.6,.64],[.3,.6]]:[[.36,0],[.08,.15],[.08,.45],[.64,.63],[.3,.6]],P),S());const d=a?7:4;for(let h=0;h<d;h++){const T=h>=d-(a?2:1),v=h*2.4+e.range(-.2,.2),m=T?.12:.36,M=e.range(.15,.185),x=[s+Math.cos(v)*m,n+(T?.86:.63),r+Math.sin(v)*m];a?lo(t,e,x,M,e.int(0,3),h%2?f:null):t.add(new g.OctahedronGeometry(M*1.15,0),{p:[x[0],x[1]+M,x[2]],c:s0(yt[e.int(0,3)][0],1.1),surf:L(Q,.25)})}}}const ya=[1.5,.95,.56,.4,.9,.6],Me=[["#8a2a22",1],["#9a7a2a",1.25],["#c06a1c",1]];function xa(t,e,s,n,r,o,a){const f=L(Q,.95),i=L(t0),u=e.range(0,J),P=(d,h)=>({p:[s,n,r],c:d,surf:h}),S=(d,h,T,v,m,M,x=1,k=5)=>t.add(new g.SphereGeometry(d,k,k>4?3:2),{p:[h,T,v],r:[0,e.range(0,J),0],s:[1,x,1],c:m,surf:L(Q,M)});if(o===0){t.add(Z([[.34,0],[.1,.13],[.07,.5],[.6,.6],[.62,.64],[.07,.66],[.06,1.06],[.38,1.13],[.4,1.17],[0,1.15]],7),P(y.silver,f));for(let d=0;d<9;d++){const h=d>5,T=u+d*(h?J/3:J/6),v=h?.2:.42,m=n+(h?1.17:.64),M=e.int(0,3),x=e.range(.13,.16),k=s+Math.cos(T)*v,p=r+Math.sin(T)*v;if(M===3)for(let w=0;w<4;w++)S(.07,k+e.range(-.08,.08),m+.06+(w>1?.09:0),p+e.range(-.08,.08),s0(y.grape,e.range(.9,1.6)),.5,1,4);else S(x,k,m+x*Me[M][1]*.95,p,s0(Me[M][0],e.range(.85,1.2)),.3,Me[M][1])}S(.15,s,n+1.32,r,s0(Me[0][0],1.1),.25)}else if(o===1){t.add(Z([[.2,0],[.22,.04],[.1,.1],[.12,.2],[.5,.44],[.56,.52],[.48,.5]],8),P(y.silver,f));for(let d=0;d<8;d++){const h=d>5,T=u+d*1.05,v=h?.14:.36,m=e.range(.17,.21);t.add(new g.IcosahedronGeometry(1,0),{p:[s+Math.cos(T)*v,n+.58+(h?.2:.02*(d%3)),r+Math.sin(T)*v],r:[e.range(-.4,.4),e.range(0,J),e.range(-.4,.4)],s:[m,m*.8,m],c:"#e9e2d0",surf:i,tint:(M,x,k,p,w,C,N)=>{p.multiplyScalar(.62+.5*Math.abs(Math.sin(Math.atan2(N,w)*2.5+C*3)))}}),h||a.push(s+Math.cos(T+.5)*.46,n+.5,r+Math.sin(T+.5)*.46,Math.cos(T+.5),.15,Math.sin(T+.5),0,1,0,.44,d)}}else if(o===2)t.add(Z([[.72,0],[.74,.03],[.5,.02]],10),P(s0(y.silver,.85),f)),t.add(Z([[.5,.02],[.47,.34],[.55,.38],[.54,.44],[.46,.42],[.3,.52],[.05,.56],[.05,.5]],10),{...P("#a8743a",L(Q,.12)),tint:(d,h,T,v,m,M,x)=>{v.multiplyScalar(M>.36&&M<.46?.7+.55*Math.abs(Math.sin(Math.atan2(x,m)*5)):M>.46?1.12:.85)}});else if(o===3){t.add(V0(.86,.07,1.3),{p:[s,n+.035,r],r:[0,e.range(-.15,.15),0],c:"#5a4026",surf:L(P0)});for(let d=0;d<3;d++){const h=e.range(.23,.27);t.add(new g.SphereGeometry(h,6,3),{p:[s+(d===1?.12:-.1),n+.07+h*.5,r+(d-1)*.42],r:[0,e.range(0,J),0],s:[1,.62,1],c:"#a67238",surf:i,tint:(T,v,m,M,x,k)=>{M.multiplyScalar(k>h*.4?Math.abs(x)<h*.35?1.45:1:.72)}})}}else if(o===4){t.add(Z([[.26,0],[.28,.03],[.07,.12],[.07,.3],[.5,.38],[.52,.42]],8),P(y.silver,f)),t.add(Z([[.44,.42],[.45,.5],[.45,.74],[.4,.82],[0,.84]],8),{...P("#efe9da",i),tint:(d,h,T,v,m,M,x)=>{M>.56&&M<.78&&v.multiplyScalar(.78+.3*Math.abs(Math.sin(Math.atan2(x,m)*4)))}});for(let d=0;d<7;d++){const h=u+d*J/6,T=d<6?.3:0;S(d<6?.07:.1,s+Math.cos(h)*T,n+.87+(d<6?0:.04),r+Math.sin(h)*T,d%2?"#8a1420":"#c06a1c",.5,1,4)}}else{t.add(Z([[0,.02],[.52,.02],[.72,.07],[.74,.07]],10),{...P(y.silver,f),s:[.74,1,1]});const d=e.chance(.5),h=d?"#7a3a2a":"#8a5222",T=L(Q,.45);if(t.add(new g.SphereGeometry(.33,6,4),{p:[s,n+.3,r],s:d?[.85,.8,1.2]:[.95,.82,1.25],c:h,surf:T,tint:(v,m,M,x,k,p)=>{x.multiplyScalar(.72+.5*Math.max(p/.33,0))}}),d)t.add(p0(.03,.045,.34,4,!0),{p:[s,n+.36,r+.5],r:[1.25,0,0],c:"#e6dcc6",surf:i}),t.add(new g.ConeGeometry(.09,.12,5,1,!0),{p:[s,n+.34,r+.4],r:[-1.9,0,0],c:"#efe9da",surf:i});else for(const v of[-1,1])t.add(new g.ConeGeometry(.1,.36,4),{p:[s+v*.2,n+.32,r+.34],r:[1.1,v*.4,0],c:h,surf:T});for(let v=0;v<4;v++){const m=.6+v*1.3+(v>1?.6:0);S(.085,s+Math.cos(m)*.4,n+.14,r+Math.sin(m)*.62,v%2?"#c06a1c":"#6a7a2c",.3,1,4)}}}const no=[1.6,1.25,.92,.86,.92,.84,.56,.4,.62],ba=[[0,1],[2,3,4,5],[6,7,8]];function Ma(t,e,s,n,r,o,a){const f=L(Q,.95),i=L(Q,.2),u=L(t0),P=e.range(0,J),S=(v,m,M)=>({p:[s,n,r],r:[0,P,0],c:v,surf:m,tint:M}),d=()=>s0(Me[e.int(0,2)][0],e.range(.9,1.25)),h=(v,m)=>(M,x,k,p,w,C)=>{C>v&&p.set(m)},T=(v,m,M,x,k,p=[1,1,1],w=L(Q,.3))=>{const C=new g.OctahedronGeometry(v,0);C.setAttribute("normal",C.attributes.position.clone()),t.add(C,{p:[s+m,n+M,r+x],r:[0,e.range(0,J),0],s:p,c:k,surf:w})};if(!a){o===0?t.add(Z([[.34,0],[.07,.3],[.6,.64],[.25,.9],[.42,1.18],[0,1.42]],3),S(y.silver,L(Q,.6),(v,m,M,x,k,p)=>{p>.7&&x.set(p>1.2?"#9a7a2a":"#8a2a22")})):o===1?t.add(Z([[.36,0],[.08,.3],[.62,.63],[.3,.98],[0,1.25]],3),S(y.silver,L(Q,.6),(v,m,M,x,k,p)=>{p>.7&&x.set(p>1.1?"#c06a1c":"#8a2a22")})):o===2?t.add(Z([[.2,0],[.1,.1],[.55,.5],[.36,.8],[0,.9]],3),S(y.silver,L(Q,.5),h(.6,"#d8d1bd"))):o===3?t.add(Z([[.26,0],[.07,.2],[.5,.42],[.44,.8],[0,.84]],3),S(y.silver,L(Q,.5),h(.6,"#efe9da"))):o===4?t.add(Z([[.3,0],[.2,.1],[.62,.5],[0,.92]],3),{...S(y.silver,f),s:[1,1,.72]}):o===5?t.add(Z([[.64,0],[.46,.4],[0,.8]],4),S(y.silver,f)):o===6?t.add(Z([[.74,.02],[.5,.04],[.5,.4],[0,.56]],4),S("#a8743a",i)):o===7?(t.add(V0(.86,.07,1.3),{p:[s,n+.035,r],c:"#5a4026",surf:L(P0)}),T(.26,0,.2,0,"#a67238",[1,.62,2.2],u)):(t.add(Z([[0,.02],[.72,.05]],4),S(y.silver,f)),T(.33,0,.3,0,"#7f4526",[.9,.8,1.2],L(Q,.45)));return}if(o===0){t.add(Z([[.34,0],[.08,.14],[.07,.5],[.58,.62],[.07,.68],[.06,1.06],[.4,1.15]],5),S(y.silver,f));for(let v=0;v<7;v++){const m=v>3,M=P+v*(m?J/2:J/4),x=v===6?0:m?.2:.4,k=m?.13:.15;T(k,Math.cos(M)*x,(v===6?1.34:m?1.15:.62)+k,Math.sin(M)*x,d())}}else if(o===1){t.add(Z([[.36,0],[.08,.15],[.08,.45],[.64,.63]],5),S(y.silver,f)),t.add(Z([[.56,.63],[.44,.86],[.2,1.1],[0,1.25]],5),S("#8a2a22",L(Q,.3),(v,m,M,x,k,p,w)=>{x.set(Me[Math.floor(Math.abs(Math.sin(k*9+w*7+p*5))*2.99)][0])}));for(let v=0;v<3;v++){const m=P+v*2.1;T(.16,Math.cos(m)*.36,.78+.1*v,Math.sin(m)*.36,d())}}else if(o===2){t.add(Z([[.2,0],[.1,.1],[.5,.44],[.56,.52]],6),S(y.silver,f));const v=O0(()=>e.range(0,1));v.core(Z([[.5,.52],[.4,.72],[0,.84]],5),()=>1,"#141f12",null);for(let m=0;m<9;m++){const M=P+m*2.4,x=m<6?.55:1.25,k=[Math.cos(M)*Math.cos(x),Math.sin(x),Math.sin(M)*Math.cos(x)],p=[k[0]*.44,.5+k[1]*.42,k[2]*.44];m%2?v.card(p,k,.2,13,le[m%4],.95,.8):v.card(p,k,.15,16,"#e6dfcc",1,.3)}t.add(v.geo(),{p:[s,n,r]})}else if(o===3)t.add(Z([[.26,0],[.07,.12],[.07,.3],[.5,.38],[.52,.42]],6),S(y.silver,f)),t.add(Z([[.44,.42],[.45,.74],[.4,.82],[0,.84]],7),S("#efe9da",u,(v,m,M,x,k,p,w)=>{p>.5&&p<.78&&x.multiplyScalar(.78+.3*Math.abs(Math.sin(Math.atan2(w,k)*3.5)))})),T(.09,0,.9,0,"#8a1420");else if(o===4)t.add(Z([[.3,0],[.2,.1],[.56,.3],[.64,.52],[.5,.7],[.26,.82],[.06,.86],[0,.92]],6),{...S(y.silver,f),s:[1,1,.72]});else if(o===5)t.add(Z([[.64,0],[.5,.06],[.49,.3],[.38,.52],[.2,.64],[.05,.68],[.08,.8],[0,.84]],6),S(y.silver,f));else if(o===6)t.add(Z([[.74,.02],[.5,.02],[.48,.34],[.55,.4],[.3,.52],[0,.56]],7),S(s0(y.silver,.85),i,(v,m,M,x,k,p,w)=>{p>.03&&x.set("#a8743a").multiplyScalar(p>.36&&p<.46?.7+.55*Math.abs(Math.sin(Math.atan2(w,k)*3.5)):p>.46?1.12:.85)}));else if(o===7){t.add(V0(.86,.07,1.3),{p:[s,n+.035,r],c:"#5a4026",surf:L(P0)});for(let v=0;v<3;v++){const m=e.range(.23,.27);t.add(new g.SphereGeometry(m,5,3),{p:[s+(v===1?.12:-.1),n+.07+m*.5,r+(v-1)*.42],r:[0,e.range(0,J),0],s:[1,.62,1],c:"#a67238",surf:u,tint:(M,x,k,p,w,C)=>{p.multiplyScalar(C>m*.4?Math.abs(w)<m*.35?1.45:1:.72)}})}}else{const v=e.chance(.5),m=v?"#7a3a2a":"#8a5222",M=L(Q,.45);if(t.add(Z([[0,.02],[.52,.02],[.74,.07]],7),{p:[s,n,r],s:[.74,1,1],c:y.silver,surf:f}),t.add(new g.SphereGeometry(.33,6,3),{p:[s,n+.3,r],s:v?[.85,.8,1.2]:[.95,.82,1.25],c:m,surf:M,tint:(x,k,p,w,C,N)=>{w.multiplyScalar(.72+.5*Math.max(N/.33,0))}}),v)t.add(p0(.03,.045,.34,3,!0),{p:[s,n+.36,r+.5],r:[1.25,0,0],c:"#e6dcc6",surf:u});else for(const x of[-1,1])t.add(new g.ConeGeometry(.1,.36,3),{p:[s+x*.2,n+.32,r+.34],r:[1.1,x*.4,0],c:m,surf:M});for(let x=0;x<3;x++){const k=.6+x*2;T(.085,Math.cos(k)*.4,.14,Math.sin(k)*.62,x%2?"#c06a1c":"#6a7a2c")}}}const ro=t=>[[0,2.3+.5*t,0],...[0,1,2,3].map(e=>[Math.cos(e*I/2+I/4)*.46,1.95+.45*t,Math.sin(e*I/2+I/4)*.46])];function Pa(t=1){const e=A0.makeBuilder(),s=L(Q,.95),n=ro(t);e.add(Z([[.32,0],[.34,.04],[.12,.14],[.05,.4],[.11,.55],[.045,.7],[.045,1.5],[.13,1.62],[.05,1.74],[.05,2.2],[.15,2.28],[.05,2.3]],6),{c:y.silver,surf:s});for(let r=0;r<4;r++){const o=new g.TorusGeometry(.23,.028,3,4,I);o.rotateZ(I),o.translate(.23,1.78,0),e.add(o,{r:[0,-(r*I/2+I/4),0],c:y.silver,surf:s})}for(let r=0;r<5;r++){const o=n[r],a=r?1.95:2.3;r&&e.add(p0(.028,.028,.16,3,!0),{p:[o[0],1.85,o[2]],c:y.silver,surf:s}),e.add(new g.ConeGeometry(.13,.07,5,1,!0),{p:[o[0],a-.03,o[2]],r:[I,0,0],c:y.silver,surf:s}),e.add(p0(.04,.04,o[1]-a,4,!0),{p:[o[0],(o[1]+a)/2,o[2]],c:y.wax,surf:L(t0,.55),grad:[o[1]-.15,o[1],.5,1.5]}),e.add(new g.ConeGeometry(.009,.06,3,1,!0),{p:[o[0],o[1]+.02,o[2]],c:"#140e0a",surf:L(t0)})}return e.build()}function za(t){const e={glasses:[],sticks:[],flames:[],smoke:[],bares:[],glows:[],fy:.98-t,bare(s,n,r,o=.4,a=.15){e.bares.push(s,n,r,o,a)},glow(s,n,r,o){e.glows.push(s,n,r,o)},glass(s,n,r,o,a,f,i=1,u=1){e.glasses.push(s,n,r,o,a,f,i,u)},stick(s,n,r,o=!0,a=.36,f=.13,i=0,u=1){e.sticks.push(s,n,r,i,u),o&&e.flames.push(s,n+e.fy+i*.6,r,a,f)},flame(s,n,r,o=.36,a=.13){e.flames.push(s,n,r,o,a)}};return e}const Ue=t=>Xo(t)/5,io=.78,ka=t=>Ue(t)*Math.round(J*(ne(t)-.5)/(.85*Ue(t))),yt=[["#8a2a22",1,.25],["#9a7a2a",1.2,.2],["#3c1c34",.9,.5],["#6a7a2c",1.1,.2]];function lo(t,e,s,n,r,o,a){const f=yt[r%yt.length],i=e.range(0,J);t.add(new g.SphereGeometry(n,6,4),{p:[s[0],s[1]+n*f[1]*.92,s[2]],s:[1,f[1],1],c:s0(f[0],e.range(.85,1.25)),surf:L(Q,f[2]),tint:(u,P,S,d,h,T)=>{d.multiplyScalar(.72+.4*(T/n*.5+.5))}}),t.add(p0(n*.05,n*.09,n*.5,3,!0),{p:[s[0]+Math.cos(i)*n*.1,s[1]+n*f[1]*1.9+n*.15,s[2]+Math.sin(i)*n*.1],r:[.3,i,0],c:"#2a1c10",surf:L(t0)}),o&&o.push(s[0]+Math.cos(i)*n*.5,s[1]+n*f[1]*1.9,s[2]+Math.sin(i)*n*.5,Math.cos(i),.35,Math.sin(i),0,1,0,n*2.2,2)}async function Sa(t,e,s,n,r,o,a,f,i){const u=_0.x,P=_0.z,S=r==="blue"?.4:1,d="#33190e",h=L(Q,.85),T={garland:1e9,gap:1e9},v=(R,H,D)=>[u+Math.cos(R)*H,D,P+Math.sin(R)*H],m=O0(()=>f.range(0,1)),M=Math.min(1,Math.max(o,.6)),x=["#8a2a22","#b08a2c","#c06a1c"];for(let R=0;R<_0.tiers;R++){const H=ne(R),D=se(R),W=R===0?0:se(R-1),e0=R<9?ne(R+1)-.1:0,U=Ue(R),B=ka(R),F=B/U,j=Math.max(20,Math.round(H*3.2)),_=L(ht,H-.5,U,D),O=R===0?L(ht,0,0,D-1.8):L(ht,ne(R-1)-.5,Ue(R-1)+(R&1?0:.5),D-1.8);for(let X=0;X<j;X++){const l0=X/j*J,o0=(X+1)/j*J,y0=(l0+o0)/2;h0(e,v(l0,e0,D),v(o0,e0,D),v(o0,H+.08,D),v(l0,H+.08,D),[u,100,P],y.linen,_),h0(e,v(l0,H,W),v(o0,H,W),v(o0,H,D-.1),v(l0,H,D-.1),v(y0,99,D),d,O),h0(e,v(l0,H,D-.1),v(o0,H,D-.1),v(o0,H+.08,D-.045),v(l0,H+.08,D-.045),v(y0,99,D-60),y.gilt,h),h0(e,v(l0,H+.08,D-.045),v(o0,H+.08,D-.045),v(o0,H+.08,D),v(l0,H+.08,D),v(y0,99,D),s0(y.gilt,1.15),h)}const i0=H-.5;T.gap=Math.min(T.gap,2*i0*Math.sin(I/(2*B))-.15-.3*io);for(let X=0;X<U;X++){const l0=v(J*X/U,i0,D),o0=X+R&1;s.stick(l0[0],D,l0[2],!0,.52,.17,o0,io),(X+R*2)%5===0&&s.smoke.push(l0[0],D+s.fy+.55+o0*.6,l0[2],2.6+X%3*.5)}for(let X=0;X<B;X++){const l0=Math.round((X+.5)/F)%U,o0=l0+R&1,y0=v(J*(X+.5)/B,i0,D),I0=v(J*l0/U,i0,D+s.fy+.16+o0*.6);s.glass(y0[0],D,y0[2],I0[0],I0[1],I0[2],1)}const z0=Math.max(3,Math.round(J*H/4.3)),x0=H+.22,C0=R&1?"#8a1a26":"#e6dfcc";for(let X=0;X<z0;X++){const l0=[],o0=J*(X+.5)/z0;for(let j0=0;j0<=6;j0++){const J0=j0/6,pe=v(J*(X+J0)/z0,x0,D-.34-3.2*J0*(1-J0));l0.push([pe[0],pe[1],pe[2],.75+1.8*J0*(1-J0)])}m.rope(l0,.22,2,[Math.cos(o0),0,Math.sin(o0)],{leaf:3.6*M,rose:.45*M,fruit:.6*M,bloom:.25*M,fruitHex:x,roseHex:C0});const y0=J*X/z0,I0=[Math.cos(y0),0,Math.sin(y0)],ue=v(y0,x0+.16,D-.4);m.card(ue,I0,.2,16,C0,1.05,.2);for(const j0 of[-1,1])m.card([ue[0]-Math.sin(y0)*j0*.2,ue[1]-.16,ue[2]+Math.cos(y0)*j0*.2],I0,.24,13,le[(X+(j0>0?1:0))%4],.9,.5)}await t.yield()}T.garland=await m.leastBy(i,t),e.add(m.geo(),{}),await t.yield();const k=se(9),p=L(Q,.95);e.add(Z([[1,0],[1.05,.1],[.5,.3],[.2,.6],[.3,.9],[.14,1.2],[.14,1.75],[.25,1.85],[1.2,2.04],[1.3,2.14],[1.22,2.12],[.3,2.06],[.12,2.3],[.12,3],[.34,3.2],[.12,3.42],[.1,3.9],[.3,4.05],[.11,4.15]],8),{p:[u,k,P],c:y.silver,surf:p});for(let R=0;R<9;R++){const H=R*J/6+(R>5?.5:0),D=R>5?.3:.78;lo(e,n,[u+Math.cos(H)*D,k+(R>5?2.45:2.1),P+Math.sin(H)*D],R>5?.3:.33,R,R%2?a:null)}const w=[[0,4.15+.9*S,0]];for(let R=0;R<6;R++){const H=(R+.5)*J/6,D=new g.TorusGeometry(.75,.05,3,5,I);D.rotateZ(I),D.scale(1,.45,1),D.translate(.75+.2,3.25,0),e.add(D,{p:[u,k,P],r:[0,-H,0],c:y.silver,surf:p}),e.add(new g.ConeGeometry(.26,.14,6,1,!0),{p:[u+Math.cos(H)*1.7,k+3.3,P+Math.sin(H)*1.7],r:[I,0,0],c:y.silver,surf:p}),w.push([Math.cos(H)*1.7,3.36+.7*S,Math.sin(H)*1.7])}for(let R=0;R<7;R++){const H=w[R],D=R?3.34:4.13;e.add(p0(.075,.08,H[1]-D,5,!0),{p:[u+H[0],k+(H[1]+D)/2,P+H[2]],c:y.wax,surf:L(t0,.6),grad:[k+H[1]-.25,k+H[1],.75,1.3]}),s.flame(u+H[0],k+H[1]+.04,P+H[2],R?.46:.6,R?.16:.2)}s.smoke.push(u,k+w[0][1]+.6,P,3.2);const C=L(Q,.3),N=L(Q,.6);e.add(new g.TorusGeometry(9,.2,5,60),{p:[u,34,P],r:[I/2,0,0],c:y.gilt,surf:N}),e.add(new g.TorusGeometry(5.4,.14,4,40),{p:[u,36.4,P],r:[I/2,0,0],c:y.iron,surf:C});for(let R=0;R<12;R++){const H=R/12*J;e.add(r0(4.4,.16,.16,.05,"x"),{p:[u+Math.cos(H)*7.2,35.2,P+Math.sin(H)*7.2],r:[0,-H,.58],c:y.iron,surf:C}),R%2===0&&e.add(r0(.14,9.8,.14,.04,"y"),{p:[u+Math.cos(H)*5.4,41.2,P+Math.sin(H)*5.4],c:y.iron,surf:C})}for(let R=0;R<60;R++){const H=R/60*J,D=u+Math.cos(H)*9,W=P+Math.sin(H)*9;e.add(p0(.085,.085,.7*S,5,!0),{p:[D,34.2+.35*S,W],c:y.wax,surf:L(t0,.6)}),e.add(new g.ConeGeometry(.24,.12,6,1,!0),{p:[D,34.2,W],r:[I,0,0],c:y.gilt,surf:N}),s.flame(D,34.22+.7*S,W,.44,.16)}return T}const W0=-130,he=13;async function Ta(t,e,s,n,r,o,a){const f=[0,100,-160],i=L(Yt),u=L(P0),P=L(t0,0,1),S="#521a22",d=L(Q,.6),h=M=>L(Q,.6,2,M-.5);h0(e,[-20,3,-196],[20,3,-196],[20,3,-120],[-20,3,-120],f,y.floor,i);for(let M=0;M<3;M++){const x=M+1,k=22.1-.7*M,p=k-.7,w=-117-M,C=-199+M;for(const[N,R,H]of[[w,w-1,-1],[C,C+1,1]])h0(e,[-k,x,N],[k,x,N],[k,x,R],[-k,x,R],f,y.floor,i),h0(e,[-k,x-1,N],[k,x-1,N],[k,x,N],[-k,x,N],[0,x,N-H*50],y.gilt,h(x)),e.add(r0(k*2+.3,.2,.34,.07,"x"),{p:[0,x-.05,N-H*.08],c:s0(y.gilt,1.15),surf:d}),h0(e,[-2.4,x-1,N-H*.03],[2.4,x-1,N-H*.03],[2.4,x-.12,N-H*.03],[-2.4,x-.12,N-H*.03],[0,x,N-H*50],S,P);for(const N of[-1,1])h0(e,[N*p,x,w-1],[N*k,x,w-1],[N*k,x,C+1],[N*p,x,C+1],f,y.floor,i),h0(e,[N*k,x-1,w],[N*k,x-1,C],[N*k,x,C],[N*k,x,w],[N*60,x,-158],y.gilt,h(x)),e.add(r0(.34,.2,w-C+.3,.07,"z"),{p:[N*(k+.08),x-.05,-158],c:s0(y.gilt,1.15),surf:d});await t.yield()}const T=[[.17,0],[.21,.14],[.09,.42],[.21,.82],[.09,1.12],[.17,1.3]];for(const M of[-1,1]){for(let x=1;x<38;x++)e.add(Z(T,3),{p:[M*19.6,3.15,-120-2*x],c:y.gilt,surf:d});e.add(r0(.5,.26,74.6,.08,"z"),{p:[M*19.6,4.58,-158],c:y.gilt,surf:L(Q,.75)}),e.add(r0(.5,.16,74.6,.05,"z"),{p:[M*19.6,3.08,-158],c:y.gilt,surf:d});for(const x of[-120.6,-195.4]){e.add(r0(1.3,2.3,1.3,.22,"y"),{p:[M*19.4,4.15,x],c:y.oak,surf:L(P0,1)}),e.add(r0(1.6,.24,1.6,.1,"y"),{p:[M*19.4,5.3,x],c:y.gilt,surf:d}),e.add(Z([[.42,0],[.48,.15],[.18,.36],[.25,.54],[.69,1.08],[.78,1.5],[.66,1.65],[.72,1.74],[0,1.74]],8),{p:[M*19.4,5.42,x],c:y.gilt,surf:d});for(let k=0;k<5;k++)e.add(new g.SphereGeometry(.27,6,4),{p:[M*19.4+Math.cos(k*1.257)*(k<4?.34:0),7.3+(k<4?0:.3),x+Math.sin(k*1.257)*(k<4?.34:0)],c:s0(y.pom,1+.12*k),surf:L(Q,.15)});ao(e,n,M*19.4,x,.72,5.3,r,o),await t.yield()}}const v=(M,x,k)=>{h0(e,[-2.4,k+.03,M],[2.4,k+.03,M],[2.4,k+.03,x],[-2.4,k+.03,x],[0,100,M],S,P);for(const p of[-1,1])h0(e,[p*2.4,k+.035,M],[p*2.75,k+.035,M],[p*2.75,k+.035,x],[p*2.4,k+.035,x],[0,100,M],y.gilt,L(Q,.3))};{const M=L(t0,0,7);h0(e,[-18.5,3.04,-194.95],[18.5,3.04,-194.95],[18.5,3.04,-121.05],[-18.5,3.04,-121.05],f,"#ffffff",M)}for(const[M,x]of[[-120,-121.05],[-194.95,-196]])v(M,x,3);for(let M=0;M<3;M++)v(-117-M,-118-M,M+1),v(-199+M,-198+M,M+1);v(-199,-238,0),v(-54,-117,0),await t.yield();const m=W0-3.2*(he-1);for(const M of[-5,5]){gt(e,M,m-2.2,W0+2.2,1.5,6,3.6,L(je,M,m,W0),3,.8),await t.yield();for(let x=0;x<he;x++){const k=W0-3.2*x;s.stick(M,6,k,!0,.46,.16),x%2===0&&s.smoke.push(M,6+s.fy+.42,k,3)}for(let x=0;x<he*2;x++){const k=W0+.8-1.6*x,p=W0-3.2*Math.floor(x/2);for(const w of[-1,1])s.glass(M+w*.9,6,k,M,6+s.fy+.16,p,1,1)}}}const fo=[[.2,.46,0,.5,.19],[.13,.78,0,.42,.15],[.08,.94,.14,.36,.12]],Ca=[[.02,.13,2],[-.36,-.05,0],[.33,-.03,1],[.56,.12,1],[-.57,.13,2]];function La(t,e){const s=[6,4,3][e],n=L(Q,.7),r=(f,i,u,P)=>{const S=f.attributes.position,d=new Float32Array(S.count*4),h=new Float32Array(S.count*3),T=xe(P);for(let v=0;v<S.count;v++){d.set([t0,u,-1,Math.max(i-S.getY(v),0)],v*4);const m=X0(1-(i-S.getY(v))/.3,0,1);h.set([T.r*(.8+.45*m),T.g*(.8+.4*m),T.b*(.8+.3*m)],v*3)}return f.setAttribute("surf",new g.BufferAttribute(d,4)),f.setAttribute("color",new g.BufferAttribute(h,3)),f},o=fo.map(([f,i,u])=>{const P=i*t,S=u+P,d=A0.makeBuilder();if(d.add(r(Z(e===2?[[f,u],[f*.96,S]]:[[f,u],[f,u+P*.6],[f*.96,S]],s),S,.5,y.wax),{}),e===2)d.add(r(new g.CircleGeometry(f*.96,3).rotateX(-I/2).translate(0,S,0),S+.2,.8,y.wax),{});else{const h=new g.ConeGeometry(f*.96,.035,s,1,!0).rotateX(I).translate(0,S-.0175,0);r(h,S,.9,y.wax);const T=h.attributes.color,v=h.attributes.position;for(let m=0;m<v.count;m++)Math.hypot(v.getX(m),v.getZ(m))>f*.5&&T.setXYZ(m,T.getX(m)*.5,T.getY(m)*.42,T.getZ(m)*.32);d.add(h,{})}return e||d.add(new g.ConeGeometry(.012,.09,3,1,!0),{p:[.005,S+.02,0],r:[.2,0,.12],c:"#140e0a",surf:L(t0)}),u>0&&e<2&&d.add(Z([[.17,.02],[.06,.06],[.045,.1],[.13,u]],s),{c:y.gilt,surf:n}),u===0&&f>.15&&e<2&&d.add(p0(f+.08,f+.04,.3,s,!0),{p:[0,.19,0],c:"#e0a860",surf:L(t0,.45)}),d.build()}),a=A0.makeBuilder();return e===2?a.add(new g.CircleGeometry(.68,6).rotateX(-I/2),{p:[0,.07,0],s:[1,1,.62],c:s0(y.gilt,.9),surf:n}):a.add(Z([[0,.05],[.58,.05],[.66,.11],[.69,.1],[.66,0]],e?6:10),{s:[1,1,.62],c:y.gilt,surf:n}),{candles:o,tray:a.build()}}function qa(t){const e=O0(t),s=(r,o,a)=>.8+.1*Math.sin(3.4*r+1)*Math.cos(2.9*a+2);e.core(new g.IcosahedronGeometry(.8,0),s,"#141f12",null);const n=(r,o)=>{const a=1-1.1*(r+.5)/o,f=Math.sqrt(Math.max(1-a*a,0)),i=r*2.39996+t()*.5;return[Math.cos(i)*f,a,Math.sin(i)*f]};for(let r=0;r<12;r++){const o=n(r,12),a=.95+.14*t();e.card([o[0]*a,o[1]*a*.8,o[2]*a],o,.34+.08*t(),13,le[r%4],(.6+.25*t())*(.8+.2*o[1]),.9)}for(let r=0;r<5;r++){const o=n(r,5);e.card([o[0]*1.02,o[1]*.86,o[2]*1.02],o,.22+.05*t(),16,"#e6dfcc",.8+.2*t(),.35)}return e.scale(1/e.reach()),e.geo()}async function Ea(t,e,s,n,r,o){const a=o<1?.6:1,f=[0,1,2].map(m=>La(a,m)),i=n.fork("bowls"),u=[0,1].map(()=>qa(()=>i.range(0,1)));let P=1e9,S=0,d=0,h=1e9,T=0;const v=(m,M,x,k,p,w)=>{const C=r.nearestXZ(m,x).dist,N=C<7?0:C<13?1:2,R=n.int(3,5),H=k?0:I/2;if(m<0&&x<-170){(T++&1)===0&&(e.add(Z([[.2,0],[.27,.04],[.2,.1],[.5,.32],[.56,.34]],5),{p:[m,M,x],c:"#4a3a22",surf:L(Q,.35)}),e.add(u[d&1],{p:[m,M+.36,x],r:[0,i.range(0,J),0],s:[.6,.5,.6]}),d++,h=Math.min(h,r.distanceTo(m,M+.5,x)-.62));return}e.add(f[N].tray,{p:[m,M,x],r:[0,H,0]});for(let D=0;D<R;D++){const[W,e0,U]=Ca[D],[B,F,j,_,O]=fo[U],i0=j+F*a,z0=m+(k?W:-p*e0),x0=x+(k?-w*e0:W);e.add(f[N].candles[U],{p:[z0,M+.05,x0],r:[0,n.range(0,J),0]}),s.bare(z0,M+.05+i0+.02,x0,_,O),N<2&&s.glow(z0,M+.05+i0+.2,x0,.75),P=Math.min(P,r.distanceTo(z0,M+.05+i0+_+.04,x0)-.15)}s.glow(m,M+.3+.7*a,x,2),S++};for(let m=0;m<3;m++){const M=m+1,x=22.1-.7*m;for(const[k,p]of[[-117.5-m,1],[-198.5+m,-1]])for(const w of[-1,1])for(let C=4.4+.8*m;C<=x-1.4;C+=2.5)v(w*C,M,k,!0,0,p);await t.yield();for(const k of[-1,1]){for(let p=-118.6-m;p>=-197.4+m;p-=2.5)v(k*(x-.35),M,p,!1,k,0);await t.yield()}}for(const m of f){m.tray.dispose();for(const M of m.candles)M.dispose()}for(const m of u)m.dispose();return{least:P,count:S,bowls:d,bowlLeast:h}}function co(t,e,s,n,r,o){t.add(r0(1.5,1,1.5,.2,"y"),{p:[s,n+.5,r],c:y.oakD,surf:L(P0,1)}),t.add(Z([[.45,0],[.5,.1],[.2,.3],[.28,.5],[.8,1],[.9,1.45],[.74,1.6],[.82,1.7]],8),{p:[s,n+1,r],c:y.gilt,surf:L(Q,.7)}),t.add(o,{p:[s,n+2.95,r],r:[0,e.range(0,J),0],s:[1.15,1.15,1.15],c:s0("#ffffff",e.range(.92,1.08))})}function Aa(t,e=10,s=5){const n=[],r=[];for(let a=0;a<t.length;a++)for(let f=0;f<e;f++){const i=f/e*J,u=t[a][1]*(1+.28*Math.cos(s*i+a*.9));n.push(Math.cos(i)*u,t[a][0],Math.sin(i)*u)}for(let a=0;a<t.length-1;a++)for(let f=0;f<e;f++){const i=a*e+f,u=a*e+(f+1)%e;r.push(i,u,i+e,u,u+e,i+e)}const o=new g.BufferGeometry;return o.setAttribute("position",new g.Float32BufferAttribute(n,3)),o.setIndex(r),o.computeVertexNormals(),o}const ho=[[26.3,1.5],[22,1.25],[17,.95],[12,.62],[9.6,.46],[9,.4],[8.3,.5],[6,.7],[3.1,.85]];function Ga(t){const e=L(t0,0,5),s=L(t0,0,4),n=L(t0,0,2),r=L(Q,.7),o="#6a1420",a="#9a7430",f=17,i=-128,u=-188;t.quad([-f,26,u],[f,26,u],[f,26,i],[-f,26,i],"#8a6a2c",s),h0(t,[-f,26.5,u],[f,26.5,u],[f,26.5,i],[-f,26.5,i],[0,99,-158],o,e);const P=(S,d,h,T)=>{for(let v=0;v<h*4;v++){const m=v/(h*4),M=(v+1)/(h*4),x=N=>[S[0]+(d[0]-S[0])*N,S[1]+(d[1]-S[1])*N],k=x(m),p=x(M),w=23.9-1.3*Math.abs(Math.sin(m*h*I)),C=23.9-1.3*Math.abs(Math.sin(M*h*I));h0(t,[k[0],26.5,k[1]],[p[0],26.5,p[1]],[p[0],C,p[1]],[k[0],w,k[1]],T,o,e),h0(t,[k[0],w,k[1]],[p[0],C,p[1]],[p[0],C-.4,p[1]],[k[0],w-.4,k[1]],T,a,n)}};P([-f,i],[f,i],10,[0,24,99]),P([-f,u],[f,u],10,[0,24,-999]);for(const S of[-1,1])P([S*f,i],[S*f,u],18,[S*999,24,-158]);{const S=f-.7,d=i-.7,h=u+.7,T=Z([[.02,-.9],[.17,-.8],[.09,-.16],[.02,0]],3),v=(M,x,k,p)=>{for(let w=0;w<k*4;w++){const C=W=>[M[0]+(x[0]-M[0])*W,M[1]+(x[1]-M[1])*W],N=w/(k*4),R=(w+1)/(k*4),H=C(N),D=C(R);h0(t,[H[0],26,H[1]],[D[0],26,D[1]],[D[0],24.9-.7*Math.abs(Math.sin(R*k*I)),D[1]],[H[0],24.9-.7*Math.abs(Math.sin(N*k*I)),H[1]],p,"#b08a3a",n)}for(let w=0;w<k;w++){const C=m(M,x,(w+.5)/k);t.add(T,{p:[C[0],24.2,C[1]],c:o,surf:e,grad:[24,24.2,1,3.2]})}},m=(M,x,k)=>[M[0]+(x[0]-M[0])*k,M[1]+(x[1]-M[1])*k];v([-S,d],[S,d],10,[0,25,-158]),v([-S,h],[S,h],10,[0,25,-158]);for(const M of[-1,1])v([M*S,d],[M*S,h],18,[0,25,-158]);T.dispose(),t.add(Z([[2,0],[1.92,-.14],[1.5,-.22],[1.25,-.5],[.72,-.62],[.5,-.86],[.18,-.95]],12),{p:[0,26,-155],c:s0(y.gilt,1.25),surf:L(Q,.8),tint:(M,x,k,p,w,C,N)=>{p.multiplyScalar(.62+.55*Math.abs(Math.sin(Math.atan2(N,w)*6)))}})}for(const S of[-1,1])for(const d of[i-.6,u+.6])t.add(Aa(ho),{p:[S*(f-.6),0,d],c:o,surf:e}),t.add(new g.TorusGeometry(.52,.1,4,10),{p:[S*(f-.6),9,d],r:[I/2,0,0],c:y.gilt,surf:r}),t.add(Z([[.02,-1.1],[.2,-.9],[.12,-.3],[.2,-.1],[.02,0]],5),{p:[S*(f-.6+.6),8.9,d],c:a,surf:n});for(const S of[-128,-144,-160,-176,-192])for(const d of[-f,0,f]){const h=d?33:39.5,T=Math.max(S,u+.5),v=Math.hypot(h-26.5,S-T);t.add(r0(.22,v,.22,.06,"y"),{p:[d,(h+26.5)/2,(S+T)/2],r:[Math.atan2(S-T,h-26.5),0,0],c:y.gilt,surf:r})}}const me=[14.5,22.75,31],xt=[11,13.5,16,18.5,21,23.5];async function Na(t,e,s,n,r,o){const a=L(t0,0,5),f=L(t0,0,2),i=L(Q,.7),u=L(P0),P=L(U0),S="#6a1420",d="#9a7430",h=-244.3;e.add(r0(27.2,2.4,.9,.3,"x"),{p:[0,24.2,h],c:y.gilt,surf:L(Q,.7,1)}),e.add(r0(27.6,.3,1.1,.1,"x"),{p:[0,25.2,h],c:s0(y.gilt,.8),surf:i}),e.add(r0(28.2,.5,1.4,.16,"x"),{p:[0,25.5,h],c:y.gilt,surf:L(Q,.85)}),e.add(r0(28.8,.22,1.7,.08,"x"),{p:[0,25.86,h],c:s0(y.gilt,1.1),surf:L(Q,.85)}),e.add(r0(27.5,.24,1.05,.1,"x"),{p:[0,23.05,h],c:s0(y.gilt,.85),surf:i}),e.add(new g.SphereGeometry(1,9,3,0,I,0,I/2),{p:[0,25.7,h-.3],s:[3,2,1],c:y.gilt,surf:i,tint:(D,W,e0,U,B,F,j)=>{U.multiplyScalar(.55+.6*Math.abs(Math.sin(Math.atan2(j,-B)*4.5)))}});for(const D of[-1,1])e.add(Z([[.3,0],[.45,.4],[.15,.8],[.34,1.3],[0,1.9]],6),{p:[D*13.4,25.7,h],c:y.gilt,surf:i});for(const D of[-1,1]){const W=[[24,9.5,13.4],[20,9.9,13.4],[15,10.7,13.4],[11,11.6,13.3],[9.5,11.9,13.1],[8.6,11.7,13.2],[5,11.2,13.4],[.05,10.9,13.5]],e0=12,U=[],B=[];for(let j=0;j<W.length;j++)for(let _=0;_<=e0;_++){const O=_/e0;U.push(D*(W[j][1]+(W[j][2]-W[j][1])*O),W[j][0],h+.1+.34*Math.sin(O*6*I+j*.5))}for(let j=0;j<W.length-1;j++)for(let _=0;_<e0;_++){const O=j*(e0+1)+_,i0=O+e0+1;B.push(O,O+1,i0,O+1,i0+1,i0)}const F=new g.BufferGeometry;F.setAttribute("position",new g.Float32BufferAttribute(U,3)),F.setIndex(B),F.computeVertexNormals(),e.add(F,{c:S,surf:a});for(let j=0;j<W.length-1;j++)h0(e,[D*W[j][1],W[j][0],h+.47],[D*(W[j][1]+.3),W[j][0],h+.47],[D*(W[j+1][1]+.3),W[j+1][0],h+.47],[D*W[j+1][1],W[j+1][0],h+.47],[0,10,0],d,f);e.add(r0(1.5,.3,.9,.1,"x"),{p:[D*12.5,9.5,h+.1],c:y.gilt,surf:i}),e.add(Z([[.02,-1.2],[.22,-1],[.13,-.3],[.22,-.1],[.02,0]],5),{p:[D*13.5,9.3,h+.5],c:d,surf:f})}await t.yield();{const D=new g.CircleGeometry(5.5,24);e.add(D,{p:[0,33,-245.7],c:"#ffffff",surf:L(mt,2)}),e.add(new g.TorusGeometry(5.7,.6,4,24),{p:[0,33,-245.5],c:y.stone,surf:P}),e.add(new g.TorusGeometry(1.5,.4,4,12),{p:[0,33,-245.5],c:y.stone,surf:P});for(let W=0;W<8;W++){const e0=(W+.5)*I/4;e.add(r0(.5,3.9,.7,.12,"y"),{p:[Math.cos(e0)*3.55,33+Math.sin(e0)*3.55,-245.5],r:[0,0,e0-I/2],c:y.stone,surf:P})}}let T=1e9;{const D=n.fork("archswag"),W=O0(()=>D.range(0,1)),e0=[],U=["#8a2a22","#b08a2c","#c06a1c"];for(let B=0;B<=60;B++){const F=B/60,j=F*I,_=Math.abs(Math.sin(F*5*I)),O=11.3-.75*_,i0=Math.cos(j)*O;e0.push([i0,11+Math.sin(j)*O,-243.9+.85*B0(8.2,10.2,Math.abs(i0)),(.5+.25*_)/.75])}W.rope(e0,.75,5,[0,0,1],{leaf:4.2,rose:.8,fruit:.7,bloom:.45,fruitHex:U});for(const B of[-1,1])W.rope([[B*11.3,11.2,-243.05,.7],[B*11.25,9.8,-243.05,.74],[B*11.1,8.2,-243.05,.68],[B*11.1,6.4,-243.05,.56],[B*11.1,4.8,-243.05,.42],[B*11.1,3.4,-243.05,.24]],.75,4,[0,0,1],{leaf:5.5,rose:.9,fruit:.7,bloom:.5,fruitHex:U});T=W.least(o),e.add(W.geo(),{})}for(const D of[-1,1]){await t.yield(),h0(e,[D*14.5,10.4,-245.6],[D*31,10.4,-245.6],[D*31,26,-245.6],[D*14.5,26,-245.6],[0,15,0],s0(y.oakD,.8),L(P0,-3,1,D*22.75));for(const W of xt)e.add(k0(16.5,.22,1.4,"NEW"),{p:[D*22.75,W-.11,-245.2],c:y.oak,surf:u});e.add(r0(18.2,.7,1.9,.2,"x"),{p:[D*22.75,26.3,-245.1],c:y.oak,surf:u});for(const W of me)e.add(r0(1,15.8,1.1,.16,"y"),{p:[D*W,18.2,-245],c:y.oak,surf:L(P0,1)}),e.add(r0(.14,.14,.9,.04,"z"),{p:[D*W,16,-244.2],c:y.iron,surf:L(Q,.3)}),e.add(new g.ConeGeometry(.3,.16,7,1,!0),{p:[D*W,16.1,-243.8],r:[I,0,0],c:y.gilt,surf:i}),e.add(p0(.08,.08,.62*r,5,!0),{p:[D*W,16.14+.31*r,-243.8],c:y.wax,surf:L(t0,.6)}),s.flame(D*W,16.16+.62*r,-243.8,.4,.15);for(let W=0;W<2;W++)for(const e0 of[xt[1],xt[4]])for(let U=0;U<10;U++){const B=D*(me[W]+.975+.7*U),F=D*me[U<5?W:W+1];s.glass(B,e0,-245.2,F,16.33+.62*r,-243.8,3.2,0)}}await t.yield();let v=1e9,m=1e9,M=0,x=1e9,k=0;const p=[],w=ce(3,8.2,.24,.5,10),C=Ve(3,8.2,10),N=Z([[.5,0],[.55,.08],[.2,.2],[.12,.6],[.2,1],[.12,1.2],[1.05,1.26],[1.08,1.3],[.15,1.3],[.1,1.7],[.18,2.3],[.1,2.9],[.62,2.96],[.65,3],[.12,3],[.08,3.5],[.2,4],[.26,4.3],[0,4.32]],8);for(const D of[-1,1]){for(let W=0;W<2;W++)for(const e0 of[-1,1]){const U=D*((me[W]+me[W+1])/2+e0*1.85),B=e0*(W?1:-1)>0;e.add(w,{p:[U,1.2,-245.2],c:s0(y.gilt,1.1),surf:i}),e.add(C,{p:[U,1.2,-245.44],c:"#ffffff",surf:L(t0,0,-2,U)}),e.add(k0(3.5,1.2,1.4,"ND"),{p:[U,.6,-245.2],c:y.stoneD,surf:P});for(const F of[-1,1]){const j=U+F*1.3,_=-244.8;e.add(new g.ConeGeometry(.2,.12,5,1,!0),{p:[j,1.26,_],r:[I,0,0],c:y.gilt,surf:i}),e.add(p0(.075,.075,.6*r,4,!0),{p:[j,1.3+.3*r,_],c:y.wax,surf:L(t0,.6)}),s.flame(j,1.32+.6*r,_,.38,.14),x=Math.min(x,o(j,1.8+.6*r,_)-.15)}if(B){const j=5.54+.7*r;e.add(N,{p:[U,1.2,-245],c:s0(y.gilt,1.15),surf:i}),e.add(p0(.09,.09,.7*r,5,!0),{p:[U,5.52+.35*r,-245],c:y.wax,surf:L(t0,.6)}),s.flame(U,j,-245,.42,.15);for(let _=0;_<6;_++){const O=(-75+30*_)*I/180;s.glass(U+Math.sin(O)*.86,2.5,-245+Math.cos(O)*.86,U,j,-245,3.2,0)}for(let _=0;_<4;_++){const O=(-66+44*_)*I/180;s.glass(U+Math.sin(O)*.44,4.2,-245+Math.cos(O)*.44,U,j,-245,3.2,0)}x=Math.min(x,o(U,4,-245)-2.6),k+=10}else p.push([U,1.2,-245])}for(const W of me){const e0=D*W;e.add(k0(1,10.3,.5,"ND"),{p:[e0,5.15,-245.35],c:y.gilt,surf:L(Q,.6)}),e.add(k0(1.3,.45,.7,"N"),{p:[e0,10.1,-245.3],c:s0(y.gilt,1.15),surf:i}),e.add(Z([[.02,-.7],[.4,-.3],[.5,.4],[.02,1.1]],4),{p:[e0,7.2,-245.08],s:[1,1,.25],c:s0(y.gilt,1.2),surf:i});for(const U of[-1,0,1]){const B=e0+U*.5,F=-244.45+.12*Math.abs(U),j=7.3+(U?0:.35);e.add(k0(.09,.09,.62,"SN"),{p:[B,j-.12,F-.3],c:y.gilt,surf:i}),e.add(new g.ConeGeometry(.24,.14,5,1,!0),{p:[B,j,F],r:[I,0,0],c:y.gilt,surf:i}),e.add(p0(.075,.075,.6*r,4,!0),{p:[B,j+.04+.3*r,F],c:y.wax,surf:L(t0,.6)}),s.flame(B,j+.06+.6*r,F,.38,.14),v=Math.min(v,o(B,j+.5+.6*r,F)-.15)}}}await t.yield();{const D=new g.CylinderGeometry(.16,.1,.24,4,1,!0),W=L(t0,.75),e0=(U,B,F)=>{e.add(D,{p:[U,B+.12,F],r:[0,I/4,0],c:"#e0a860",surf:W}),e.add(new g.ConeGeometry(.2,.3,3,1,!0),{p:[U,B-.15,F-.05],r:[I,0,0],c:y.gilt,surf:i}),s.bare(U,B+.2,F,.28,.1),(M++&1)===0&&s.glow(U,B+.34,F,1),m=Math.min(m,o(U,B+.5,F)-.2)};for(const[U,B,F]of[[9.2,-245.2,0],[9.62,-244.5,.5]]){const _=Math.round(I*U/1.05);for(const O of[-1,1])for(let i0=0;i0<10;i0++)e0(O*U,1.2+(i0+F)*.98,B);for(let O=0;O<_;O++){const i0=(O+.5)*I/_;e0(Math.cos(i0)*U,11+Math.sin(i0)*U,B)}}D.dispose()}let R=1e9,H=0;{const D=new g.CylinderGeometry(.13,.08,.2,4,1,!0),W=L(t0,.75);for(const[e0,U,B,F]of[[0,16.6,18.3,.9],[1,14.6,15.9,1.2],[2,12.6,13.5,1.2]]){const j=-245.45-1.5*e0,_=U/2,O=B-_;e.add(ce(U,B,F,1.5,16),{p:[0,0,j-.75],c:s0(y.gilt,.8-.09*e0),surf:L(Q,.75,3,_)});for(let X=0;X<=16;X++){const l0=X/16*I;R=Math.min(R,o(Math.cos(l0)*_,O+Math.sin(l0)*_,j),o(Math.cos(l0)*_,O+Math.sin(l0)*_,j-1.5))}for(let X=0;X<=O;X+=1.2)R=Math.min(R,o(_,X,j),o(-_,X,j),o(_,X,j-1.5),o(-_,X,j-1.5));if(!e0)continue;const i0=_+F*.5,z0=Math.floor((O-1.6)/1.6)+1,x0=Math.round(I*i0/1.6),C0=(X,l0)=>{e.add(D,{p:[X,l0+.1,j+.12],r:[0,I/4,0],c:"#e0a860",surf:W}),s.bare(X,l0+.17,j+.12,.24,.09),(H++&1)===0&&s.glow(X,l0+.3,j+.12,.8)};for(const X of[-1,1])for(let l0=0;l0<z0;l0++)C0(X*i0,1.6+1.6*l0);for(let X=0;X<x0;X++){const l0=(X+.5)*I/x0;C0(Math.cos(l0)*i0,O+Math.sin(l0)*i0)}}D.dispose()}return w.dispose(),C.dispose(),N.dispose(),{garland:T,sconce:v,cups:m,nCups:M,niche:x,nicheGlasses:k,urns:p,porch:R}}const mo=[4.9,-5,-13.6,-48.4,-57,-66.9];function bt(t,e,s,n,r,o,a=!1){const f=e-n*.5,i=L(Q,.7);h0(t,[f,o,s-3.8],[f,o,s+3.8],[f,21.8,s+3.8],[f,21.8,s-3.8],[0,15,s],"#ffffff",L(t0,o,8+r,s)),t.add(p0(.13,.13,8.4,a?4:5,!0),{p:[f,21.95,s],r:[I/2,0,0],c:y.gilt,surf:i});for(const u of[-1,1])t.add(Z([[.02,-.3],[.28,0],[.02,.3]],a?3:4),{p:[f,21.95,s+u*4.35],r:[I/2,0,0],c:y.gilt,surf:i})}function Mt(t,e,s,n,r,o){const a=s+n*.5,f=L(Q,.7);h0(t,[e-3.8,o,a],[e+3.8,o,a],[e+3.8,21.8,a],[e-3.8,21.8,a],[e,15,a+n*9],"#ffffff",L(t0,o,8+r,e)),t.add(p0(.13,.13,7.9,4,!0),{p:[e,21.95,a],r:[0,0,I/2],c:y.gilt,surf:f});for(const i of[-1,1])t.add(Z([[.02,-.3],[.28,0],[.02,.3]],3),{p:[e+i*4.1,21.95,a],r:[0,0,I/2],c:y.gilt,surf:f})}const uo=[4,6.5,9,11.5,14];function po(t=1,e=!1){const s=A0.makeBuilder(),n=L(P0),r=L(Q,.55);s.add(k0(8.2,3.7,1.9,"ND"),{p:[0,1.85,.95],c:y.oak,surf:L(P0,1)}),s.add(k0(8.6,.3,2.2,"ND"),{p:[0,3.85,1.05],c:y.oakD,surf:n});for(let a=1;a<5;a++)s.add(k0(8,.22,1.5,"NEW"),{p:[0,uo[a]-.11,.85],c:y.oak,surf:n});const o=[];for(let a=0;a<=4;a++)o.push([a%2===1?.25:.13,4+a/4*11.7]);for(const a of[-1,1])s.add(Z(o,5),{p:[a*3.98,0,1.5],c:y.oak,surf:n}),s.add(k0(.3,11.7,1.4,"NUD"),{p:[a*4,9.85,.8],c:y.oakD,surf:n});if(s.add(k0(8.9,.6,2.2,"N"),{p:[0,15.95,1],c:y.oak,surf:n}),e){const a=[],f=[],u=[[.16,0],[.6,.3],[1,.16]];for(let S=0;S<3;S++)for(let d=0;d<=14;d++){const h=I*d/14,T=u[S][0]*(d&1?1:.86),v=u[S][1]+(d&1?.1*u[S][0]:0);a.push(-Math.cos(h)*T*2.7,Math.sin(h)*T*1.9,v)}for(let S=0;S<2;S++)for(let d=0;d<14;d++){const h=S*15+d,T=h+14+1;f.push(h,T,h+1,h+1,T,T+1)}const P=new g.BufferGeometry;P.setAttribute("position",new g.Float32BufferAttribute(a,3)),P.setIndex(f),P.computeVertexNormals(),s.add(P,{p:[0,16.25,.5],c:y.gilt,surf:L(Q,.7)})}else s.add(new g.SphereGeometry(1,9,3,0,I,0,I/2),{p:[0,16.25,.2],s:[2.7,1.7,1.3],c:y.oak,surf:n,tint:(a,f,i,u,P,S,d)=>{u.multiplyScalar(.6+.62*Math.abs(Math.sin(Math.atan2(d,-P)*4.5)))}});s.add(new g.SphereGeometry(.42,5,2,0,I,0,I/2),{p:[0,16.25,1.45],c:y.gilt,surf:r});for(const a of[-1,1])s.add(Z([[.2,0],[.3,.3],[.1,.6],[.22,.9],[0,1.3]],4),{p:[a*3.9,16.25,1.3],c:y.gilt,surf:r}),s.add(k0(.16,.16,.9,"SN"),{p:[a*4.9,10,.55],c:y.iron,surf:L(Q,.3)}),s.add(Z([[.02,-.5],[.34,-.1],[.42,.3],[.02,.9]],5),{p:[a*4.9,10,.16],s:[1,1,.25],c:y.gilt,surf:r}),s.add(new g.ConeGeometry(.3,.16,7,1,!0),{p:[a*4.9,10.1,.95],r:[I,0,0],c:y.gilt,surf:r}),s.add(p0(.08,.08,.62*t,5,!0),{p:[a*4.9,10.14+.31*t,.95],c:y.wax,surf:L(t0,.55),grad:[10.14+.62*t-.15,10.14+.62*t,.5,1.5]}),s.add(new g.ConeGeometry(.011,.08,3,1,!0),{p:[a*4.9,10.16+.62*t,.95],c:"#140e0a",surf:L(t0)});return s.build()}function Ne(t,e,s,n,r,o,a,f=1,i=0,u=!1){const P=Math.atan2(o,a),S=a,d=-o,h=(v,m)=>[n+o*m+S*v,r+a*m+d*v];t.add(e,{p:[n,0,r],r:[0,P,0]});{const v=h(-4,.14),m=h(4,.14),M=Math.abs(o)>.5;h0(t,[v[0],0,v[1]],[m[0],0,m[1]],[m[0],15.7,m[1]],[v[0],15.7,v[1]],[n+o*9,8,r+a*9],i===3?"#0d2b29":i?"#6e4f2a":s0(y.oakD,.8),L(P0,i?-1:-2,i===3?3:i===2?2:1,M?r:n))}if(i>=2){const v=L(Q,.75),m=L(Q,.95);for(const M of i===3?[4,9,14]:[4,14]){for(let x=-1;x<=1;x++){const k=x?.62:.5,p=h(x*2.6,.2+.12*k),w=new g.CircleGeometry(k,8);t.add(w,{p:[p[0],M+k+.02,p[1]],r:[-.12,P,0],c:x?s0(y.gilt,3):s0(y.silver,2.4),surf:x?v:m,tint:(C,N,R,H,D,W)=>{const e0=Math.hypot(D,W)/k;H.multiplyScalar(e0<.1?.7:1.1)}})}for(const x of[-1,1]){const k=h(x*1.3,.42);M>10?t.add(Z([[.2,0],[.1,.15],[.33,.55],[.1,1],[.17,1.25]],4),{p:[k[0],M,k[1]],r:[0,P+.6*x,0],c:s0(y.gilt,3),surf:v}):M>6?t.add(Z([[.25,0],[.42,.2],[.45,.42],[.3,.5],[.34,.56],[.2,.72],[.06,.8],[.09,.9],[0,.94]],5),{p:[k[0],M,k[1]],r:[0,P+.6*x,0],c:s0(x>0?y.silver:y.gilt,x>0?2.4:3),surf:x>0?m:v}):t.add(Z([[.2,0],[.06,.25],[.27,.6],[.27,.85],[0,1.1]],4),{p:[k[0],M,k[1]],r:[0,P+.6*x,0],c:s0(y.silver,2.4),surf:m})}}}if(i===3)for(const v of[-1,1]){const m=h(v*3.45,1.35);t.add(Z([[.2,0],[.07,.15],[.11,.5],[.06,.8],[.16,1],[.09,1.05]],5),{p:[m[0],4,m[1]],c:s0(y.gilt,2.6),surf:L(Q,.75)}),t.add(p0(.07,.07,.6*f,4,!0),{p:[m[0],5.05+.3*f,m[1]],c:y.wax,surf:L(t0,.6)}),s.flame(m[0],5.07+.6*f,m[1],.38,.14)}const T=[-1,1].map(v=>{const m=h(v*4.9,.95);return n<-6&&r<-172&&r>-236||s.flame(m[0],10.16+.62*f,m[1],.4,.15),m});for(const v of u?[3]:[1,3])for(let m=0;m<10;m++){const M=h(-3.15+.7*m,.85),x=T[m<5?0:1];s.glass(M[0],uo[v],M[1],x[0],10.33+.62*f,x[1],3.2,0)}}function Ia(){const t=A0.makeBuilder(),e=L(Q,.65),s=L(P0),n="#1c2a1e",r="#2c4030";t.add(k0(1.7,1.25,1.7,"D"),{p:[0,.875,0],c:n,surf:s});for(let o=0;o<4;o++){const a=o*I/2;t.add(k0(1.3,.85,.02,"NEWUD"),{p:[Math.sin(a)*.86,.875,Math.cos(a)*.86],r:[0,a,0],c:s0(y.gilt,.9),surf:e}),t.add(k0(1.18,.73,.05,"NEWUD"),{p:[Math.sin(a)*.885,.875,Math.cos(a)*.885],r:[0,a,0],c:r,surf:s})}t.add(k0(1.86,.14,1.86,"D"),{p:[0,1.5,0],c:y.gilt,surf:e}),t.add(k0(1.8,.1,1.8,"UD"),{p:[0,.3,0],c:s0(y.gilt,.85),surf:e});for(const o of[-1,1])for(const a of[-1,1]){const f=new g.OctahedronGeometry(.17,0);f.setAttribute("normal",f.attributes.position.clone()),t.add(f,{p:[o*.66,.15,a*.66],c:s0(y.gilt,1.1),surf:e})}return t.build()}function Da(t,e,s,n,r,o=1){const a=[],f=[],i=[],u=e.length,P=new g.Vector3,S=new g.Vector3,d=new g.Vector3;for(let T=0;T<u;T++){const v=e[Math.max(T-1,0)],m=e[Math.min(T+1,u-1)],M=e[T],x=s*(M[3]===void 0?1:M[3]);P.set(m[0]-v[0],m[1]-v[1],m[2]-v[2]).normalize(),Math.abs(P.y)>.9?d.set(1,0,0):d.set(0,1,0),S.crossVectors(P,d).normalize(),d.crossVectors(P,S);for(let k=0;k<n;k++){const p=k/n*J,w=Math.cos(p),C=Math.sin(p),N=S.x*w+d.x*C,R=S.y*w+d.y*C,H=S.z*w+d.z*C;a.push(M[0]+N*x,M[1]+R*x,M[2]+H*x),f.push(N,R,H)}}for(let T=0;T<u-1;T++)for(let v=0;v<n;v++){const m=T*n+v,M=T*n+(v+1)%n;i.push(m,M,M+n,m,M+n,m+n)}const h=new g.BufferGeometry;h.setAttribute("position",new g.Float32BufferAttribute(a,3)),h.setAttribute("normal",new g.Float32BufferAttribute(f,3)),h.setIndex(i),t.add(h,{c:r,surf:L(t0,0,6,o)})}const le=["#31502a","#263f22","#3f5a2a","#1f3a22"];function O0(t){const e=[],s=[],n=[],r=[],o=[],a=new g.Color,f=new g.Vector3,i=new g.Vector3,u=new g.Vector3,P=new g.Vector3,S={card(d,h,T,v,m,M=1,x=.8,k=0,p=h){P.set(h[0],h[1],h[2]).normalize(),f.set(t()-.5,t()-.5,t()-.5),f.addScaledVector(P,-f.dot(P)).normalize(),u.copy(P).addScaledVector(f,x*t()).normalize(),f.set(t()-.5,t()-.5,t()-.5),f.addScaledVector(u,-f.dot(u)).normalize(),i.crossVectors(u,f),a.set(m).multiplyScalar(M);const w=e.length/3,C=v+.9*X0(k,0,.99);for(const[N,R]of[[-1,-1],[1,-1],[1,1],[-1,1]])e.push(d[0]+(f.x*N+i.x*R)*T,d[1]+(f.y*N+i.y*R)*T,d[2]+(f.z*N+i.z*R)*T),s.push(p[0],p[1],p[2]),n.push(a.r,a.g,a.b),r.push(t0,N,C,R);o.push(w,w+1,w+2,w,w+2,w+3)},core(d,h,T,v){const m=d.attributes.position,M=d.index,x=e.length/3;a.set(T);for(let k=0;k<m.count;k++){const p=m.getX(k),w=m.getY(k),C=m.getZ(k),N=Math.hypot(p,w,C)||1,R=h(p/N,w/N,C/N);e.push(p*R,w*R,C*R),s.push(p/N,w/N,C/N),n.push(a.r,a.g,a.b),r.push(t0,0,12+.9*X0(v?v(p*R,w*R,C*R):0,0,.99),0)}if(M)for(let k=0;k<M.count;k++)o.push(x+M.getX(k));else for(let k=0;k<m.count;k++)o.push(x+k);d.dispose()},rope(d,h,T,v,m){const M=d.length,x=new g.Vector3,k=new g.Vector3,p=new g.Vector3,w=new g.Vector3(v[0],v[1],v[2]).normalize(),C=[],N=e.length/3;a.set("#141f12");for(let e0=0;e0<M;e0++){const U=d[Math.max(e0-1,0)],B=d[Math.min(e0+1,M-1)],F=d[e0],j=.62*h*(F[3]===void 0?1:F[3]);x.set(B[0]-U[0],B[1]-U[1],B[2]-U[2]).normalize(),k.copy(w).addScaledVector(x,-w.dot(x)),k.lengthSq()<1e-4&&k.set(x.y,-x.x,0),k.normalize(),p.crossVectors(x,k),C.push([k.x,k.y,k.z,p.x,p.y,p.z]);for(let _=0;_<T;_++){const O=(_+(T===2?.5:0))/T*J,i0=Math.cos(O),z0=Math.sin(O),x0=k.x*i0+p.x*z0,C0=k.y*i0+p.y*z0,X=k.z*i0+p.z*z0;e.push(F[0]+x0*j,F[1]+C0*j,F[2]+X*j),T===2?s.push(k.x,k.y,k.z):s.push(x0,C0,X),n.push(a.r,a.g,a.b),r.push(t0,0,12,0)}}for(let e0=0;e0<M-1;e0++)for(let U=0;U<(T===2?1:T);U++){const B=N+e0*T+U,F=N+e0*T+(U+1)%T;o.push(B,F,F+T,B,F+T,B+T)}const R=[[13,m.leaf||0],[16,m.rose||0],[14,m.fruit||0],[15,m.bloom||0]],H=[.5,.3,.6,.8],D=m.fruitHex||["#d0661a"];let W=0;for(let e0=0;e0<M-1;e0++){const U=d[e0],B=d[e0+1],F=Math.hypot(B[0]-U[0],B[1]-U[1],B[2]-U[2]),j=C[e0];for(let _=0;_<4;_++)for(H[_]+=F*R[_][1];H[_]>=1;){H[_]-=1,W++;const O=t(),i0=(t()-.5)*(_?2.4:3.6),z0=Math.cos(i0),x0=Math.sin(i0),C0=[j[0]*z0+j[3]*x0,j[1]*z0+j[4]*x0,j[2]*z0+j[5]*x0],X=h*K0(U[3]===void 0?1:U[3],B[3]===void 0?1:B[3],O),l0=_===0&&W%4===3,o0=X*(_?1.08:l0?.72:.9+.2*t()),y0=[K0(U[0],B[0],O)+C0[0]*o0,K0(U[1],B[1],O)+C0[1]*o0,K0(U[2],B[2],O)+C0[2]*o0],I0=.78+.22*C0[1];_===0?S.card(y0,C0,X*(.5+.2*t()),13,le[W%4],(l0?.55:.85+.3*t())*I0,l0?.5:.9):_===1?S.card(y0,C0,X*(.3+.08*t()),16,m.roseHex||"#e6dfcc",(.85+.25*t())*I0,.35):_===2?S.card(y0,C0,X*(.2+.05*t()),14,D[W%D.length],(.9+.3*t())*I0,.25):S.card(y0,C0,X*(.3+.06*t()),15,"#d9d2bd",(.85+.25*t())*I0,.4)}}},least(d,h=[0,0,0]){let T=1e9;for(let v=0;v<e.length;v+=3)T=Math.min(T,d(e[v]+h[0],e[v+1]+h[1],e[v+2]+h[2]));return T},async leastBy(d,h,T=900){let v=1e9;for(let m=0,M=0;m<e.length;m+=3)v=Math.min(v,d(e[m],e[m+1],e[m+2])),++M%T===0&&await h.yield();return v},reach(){let d=0;for(let h=0;h<e.length;h+=3)d=Math.max(d,Math.hypot(e[h],e[h+1],e[h+2]));return d},scale(d){for(let h=0;h<e.length;h++)e[h]*=d},geo(){const d=new g.BufferGeometry;return d.setAttribute("position",new g.Float32BufferAttribute(e,3)),d.setAttribute("normal",new g.Float32BufferAttribute(s,3)),d.setAttribute("color",new g.Float32BufferAttribute(n,3)),d.setAttribute("surf",new g.Float32BufferAttribute(r,4)),d.setIndex(o),d}};return S}function Ie(t,e,s,n,r,o,a=.2){const f=O0(t),i=[t()*6,t()*6,t()*6],u=(d,h,T)=>.86+.08*Math.sin(3.1*d+i[0])*Math.cos(2.7*T+i[1])+.06*Math.sin(4.3*h+2.2*d+i[2]),P=(d,h,T)=>r?1.15*Math.exp(-(Math.pow(Math.hypot(d,T)-.6,2)+Math.pow(h+.3,2))/.1):0;f.core(new g.IcosahedronGeometry(.78,o),u,"#141f12",P);const S=(d,h)=>{const T=1-2*(d+.5)/h,v=Math.sqrt(Math.max(1-T*T,0)),m=d*2.39996+t()*.5;return[Math.cos(m)*v,T,Math.sin(m)*v]};for(let d=0;d<e;d++){const h=S(d,e),T=d%4===3,v=u(h[0],h[1],h[2])*(T?.84:.97+.11*t()),m=[h[0]*v,h[1]*v,h[2]*v];f.card(m,h,a*(1+.35*t()),13,le[d%4],(T?.55:.85+.3*t())*(.8+.2*h[1]),T?.5:.9,P(m[0],m[1],m[2]))}for(let d=0;d<s+n;d++){const h=S(d,s+n),T=u(h[0],h[1],h[2])*1.04,v=[h[0]*T,h[1]*T,h[2]*T];d*7%10*(s+n)<10*s?f.card(v,h,.058+.012*t(),14,"#d0661a",.9+.3*t(),.25,P(v[0],v[1],v[2])*.5):f.card(v,h,.11+.03*t(),15,"#d9d2bd",.85+.25*t(),.4,P(v[0],v[1],v[2])*.5)}return f.scale(1/f.reach()),f.geo()}function Pt(t,e=!1){const s=O0(t),n=[t()*6,t()*6,t()*6],r=(f,i,u)=>.8+.1*Math.sin(3.4*f+n[0])*Math.cos(2.9*u+n[1])+.07*Math.sin(4.1*i+2.6*u+n[2]);s.core(new g.IcosahedronGeometry(.8,e?0:1),r,"#141f12",null);const o=e?68:34,a=(f,i)=>{const u=1-1.5*(f+.5)/i,P=Math.sqrt(Math.max(1-u*u,0)),S=f*2.39996+t()*.5;return[Math.cos(S)*P,u,Math.sin(S)*P]};for(let f=0;f<o;f++){const i=a(f,o),u=f%4===3,P=r(i[0],i[1],i[2])*(u?.86:.98+.14*t()),S=[i[0]*P,i[1]*P,i[2]*P];s.card(S,i,(e?.185:.26)+(e?.055:.08)*t(),13,le[f%4],(u?.55:.85+.3*t())*(.8+.2*i[1]),u?.5:.9)}for(let f=0;f<14;f++){const i=a(f,14),u=r(i[0],i[1],i[2])*1.06,P=[i[0]*u,i[1]*u,i[2]*u];f%3!==2?s.card(P,i,.17+.05*t(),16,"#e6dfcc",.85+.25*t(),.35):s.card(P,i,.2+.04*t(),15,"#d9d2bd",.85+.25*t(),.4)}return s.scale(1/s.reach()),s.geo()}function vo(t,e,s,n,r,o,a,f,i){const u=s.range(.94,1.06),P=9.3+s.range(0,.5),S=2.5*u,d=s.range(0,J),h=s.range(0,J)+s.range(0,J);t.add(o,{p:[n,0,r]}),t.add(p0(.13,.19,P-1.5-S*.6,4,!0),{p:[n,(P-S*.6+1.5)/2,r],c:"#3a2a1c",surf:L(P0)}),t.add(a[i?1:0],{p:[n,P,r],r:[0,h,0],s:[S,S*.96,S],c:s0("#ffffff",s.range(.9,1.1))});const T=Math.min(f.distanceTo(n,P,r)-S,f.distanceTo(n,1,r)-1.35);for(let v=0;v<5;v++){const m=d+v*J/5,M=n+Math.sin(m)*S*.66,x=r+Math.cos(m)*S*.66,k=P-.3*S*.96;t.add(new g.OctahedronGeometry(1,0),{p:[M,k,x],s:[.12,.2,.12],c:i?"#4a3a22":"#f0c070",surf:L(t0,i?0:.9)}),i||e.flame(M,k-.06,x,.24,.1)}return T}const wo=t=>[[0,7.4+1.16*t,0],...[0,1,2,3,4,5].map(e=>[Math.cos(e*I/3)*1,7.4+.62*t,Math.sin(e*I/3)*1])];function Ra(t=1){const e=A0.makeBuilder(),s=L(Q,.6);e.add(Z([[1,0],[.85,.3],[.2,.6],[.34,1.7],[.13,2.1],[.13,4.5],[.3,4.9],[.12,5.3],[.12,6.9],[.45,7.3],[.1,7.45]],5),{c:y.gilt,surf:s}),e.add(new g.TorusGeometry(1,.07,3,12),{p:[0,7.35,0],r:[I/2,0,0],c:y.gilt,surf:s});for(let n=0;n<3;n++)e.add(k0(2,.08,.08,"EW"),{p:[0,7.35,0],r:[0,n*I/3,0],c:y.gilt,surf:s});for(const n of wo(t))e.add(p0(.08,.08,n[1]-7.4,5,!0),{p:[n[0],(n[1]+7.36)/2-.02,n[2]],c:y.wax,surf:L(t0,.55),grad:[n[1]-.19,n[1]-.04,.5,1.5]}),e.add(new g.ConeGeometry(.011,.08,3,1,!0),{p:[n[0],n[1]-.01,n[2]],c:"#140e0a",surf:L(t0)});return e.build()}const De=[];for(const t of[-1,1])for(const[e,s,n]of[[38.4,-21.6,3],[46.5,-16.9,4],[54.6,-21.6,3]])for(let r=0;r<n;r++)De.push([t*e,s-9.4*r]);const go=t=>[[0,4.25+.7*t,0],...[0,1,2,3,4].map(e=>[Math.cos(e*J/5)*1.15,3.55+.6*t,Math.sin(e*J/5)*1.15])];function yo(t=1,e=!1){const s=A0.makeBuilder(),n=L(Q,.9),r=go(t);e?s.add(Z([[.75,0],[.3,.3],[.12,.6],[.2,1.1],[.09,1.4],[.09,2.5],[.26,2.8],[.1,3.1],[.1,4.25]],4),{c:y.silver,surf:n}):s.add(Z([[.75,0],[.8,.08],[.3,.3],[.12,.6],[.2,1.1],[.09,1.4],[.09,2.5],[.26,2.8],[.1,3.1],[.1,3.9],[.3,4.15],[.1,4.25]],6),{c:y.silver,surf:n});for(let o=0;o<5;o++){const a=new g.TorusGeometry(.575,.05,3,e?3:5,I);a.rotateZ(I),a.translate(.575,3,0),s.add(a,{r:[0,-o*J/5,0],c:y.silver,surf:n})}for(let o=0;o<6;o++){const a=r[o],f=o?3.55:4.25;o&&(e||s.add(p0(.05,.05,.5,3,!0),{p:[a[0],3.25,a[2]],c:y.silver,surf:n}),s.add(new g.ConeGeometry(.24,e?.5:.12,e?4:6,1,!0),{p:[a[0],e?3.3:3.5,a[2]],r:[I,0,0],c:y.silver,surf:n})),s.add(p0(.07,.07,a[1]-f,e?3:4,!0),{p:[a[0],(a[1]+f)/2,a[2]],c:y.wax,surf:L(t0,.55),grad:[a[1]-.15,a[1],.5,1.5]}),e||s.add(new g.ConeGeometry(.011,.08,3,1,!0),{p:[a[0],a[1]+.03,a[2]],c:"#140e0a",surf:L(t0)})}return s.build()}const Fa=["#73161f","#a67c2c","#1d4a2c"];async function xo(t,e,s,n,r,o,a,f,i,u){const P=y.linen,S=y.linenD,d=L(Q,.75),h=new g.CircleGeometry(.42,6),T=new g.ConeGeometry(.17,.36,3,1,!0),v=["#d0661a","#a02a22","#c9a030","#7a1a30"],m=go(a),M=["#8a2a22","#b08a2c","#c06a1c"];let x=1e9,k=1e9,p=0;for(const[w,C,N]of i){const R=f.nearestXZ(w,C).dist,H=R<16?60:R<60?48:36,D=N?.3:1,W=L(je,w,C,C),e0=new g.CircleGeometry(3.2,24);e0.rotateX(-I/2),e.add(e0,{p:[w,3,C],c:P,surf:W});const U=(B,F)=>{const j=(3-F)/2.96,_=3.2+.22*j+.24*j*Math.cos(12*B);return[w+Math.cos(B)*_,F,C+Math.sin(B)*_]};for(let B=0;B<H;B++){const F=B/H*J,j=(B+1)/H*J;h0(e,U(F,3),U(j,3),U(j,.04),U(F,.04),[w+Math.cos(F)*99,3,C+Math.sin(F)*99],Fa[p%3],W)}e.add(o[R<16&&!N?0:1],{p:[w,3,C],s:[1,D,1]});for(const B of m)s.flame(w+B[0],3+B[1]*D,C+B[2],.46,.16),k=Math.min(k,f.distanceTo(w+B[0],3+B[1]*D+.46,C+B[2]));for(let B=0;B<12;B++){const F=B*J/12;k=Math.min(k,f.distanceTo(w+Math.cos(F)*3.2,3,C+Math.sin(F)*3.2))}N&&3+m[0][1]*D+.46>5&&console.warn("to-the-brim: a low candelabrum stands taller than 5 m",w,C),s.smoke.push(w,3+m[0][1]*D+.5,C,3);for(let B=0;B<8;B++){const F=(B+.5)*J/8+.2;s.glass(w+Math.cos(F)*2.35,3,C+Math.sin(F)*2.35,w,3+m[0][1]*D+.16,C,1,1)}{const B=O0(()=>n.range(0,1)),F=[];for(let j=0;j<=12;j++){const _=j*J/12;F.push([w+Math.cos(_)*1.05,3.12,C+Math.sin(_)*1.05,1])}B.rope(F,.25,2,[0,1,0],{leaf:3.2,rose:.6,fruit:.8,bloom:.3,fruitHex:M}),x=Math.min(x,B.least(f.distanceTo)),e.add(B.geo(),{})}if(!N){const B=O0(()=>r.range(0,1));for(let F=0;F<18;F++){const j=F*J*2.5/18+r.range(-.2,.2),_=3+(.55+2.2*F/17)*D,O=[Math.cos(j),.35,Math.sin(j)],i0=[w+O[0]*.24,_,C+O[2]*.24];F%3===1?B.card(i0,O,.13,16,"#e6dfcc",.9+.2*r.range(0,1),.35):B.card(i0,O,.2+.05*r.range(0,1),13,le[F%4],.85+.3*r.range(0,1),.9)}x=Math.min(x,B.least(f.distanceTo)),e.add(B.geo(),{})}for(let B=0;B<8;B++){const F=B*J/8+.2,j=w+Math.cos(F)*2.6,_=C+Math.sin(F)*2.6;e.add(h,{p:[j,3.02,_],r:[-I/2,0,0],c:s0(y.gilt,1.5),surf:d}),e.add(T,{p:[j,3.2,_],r:[0,u.range(0,J),0],c:"#efe9dc",surf:L(t0,.2)})}if(p%2===0){const B=O0(()=>u.range(0,1)),F=1.5*(N?.6:1);for(let j=0;j<40;j++){const _=(j+.5)/40,O=j*2.39996,i0=.8*(1-_)+.06,z0=3.05+F*_,x0=[Math.cos(O),.5,Math.sin(O)],C0=[w+x0[0]*i0,z0,C+x0[2]*i0];j%5===4?B.card(C0,x0,.2,13,le[j%4],.9+.3*u.range(0,1),.9):B.card(C0,x0,.15+.03*u.range(0,1),14,v[j%4],.9+.3*u.range(0,1),.25)}x=Math.min(x,B.least(f.distanceTo)),e.add(B.geo(),{})}(++p&3)===0&&await t.yield()}return h.dispose(),T.dispose(),{wreath:x,body:k}}function Ha(){const t=[],e=(p,w,C)=>t.push([p,w,C]),s=[];for(let p=-20;p<=20;p++){const w=p/20;for(const C of[10,-72])s.push([w*32.4,wt(w),C]);for(const C of[-1,1])s.push([C*34,wt(w),-31+w*39.4])}for(let p=0;p<=25;p+=2.5)for(const w of[-1,1]){for(const C of[10,-72])s.push([w*32.4,p,C]);for(const C of[-1,1])s.push([w*34,p,-31+C*39.4])}e("a crossing arch",6,s);const n=[],r=[],o=[],a=[],f=[],i=[],u=[],P=[];for(const p of[-1,1]){for(let w=7;w<=38;w+=3)for(const C of[-1,1])n.push([p*59.4,w,-31+C*11]);for(const w of[7.45,-69.45])for(let C=0;C<=17;C+=4.25)r.push([p*36.55,C,w]);for(const w of[-5,-57])r.push([p*59.45,16,w+4.45],[p*59.45,16,w-4.45]);for(let w=-80;w>=-232;w-=1.6)for(const C of[-1,1])o.push([p*26.5+C*4.1,4.2,w]);for(let w=-120;w>=-196;w-=2)a.push([p*19.35,4.72,w]);for(const w of[-120.6,-195.4])a.push([p*18.7,7.9,w]);for(let w=-128;w>=-188;w-=2)f.push([p*17,22.2,w]);for(const w of[-128.6,-187.4])for(const[C,N]of[[26.3,1.92],[17,1.22],[9,.52],[6,.9],[3.1,1.09]])f.push([p*(16.4-N),C,w+(w>-158?-N:N)],[p*(16.4-N),C,w]);for(const[w,C]of[[24,9.5],[20,9.9],[15,10.7],[11,11.6],[9.5,11.9],[8.6,11.7],[5,11.2],[.05,10.9]])i.push([p*C,w,-243.86]);for(let w=10.4;w<=26;w+=2.6)P.push([p*14,w,-244.5])}for(let p=-17;p<=17;p+=1)f.push([p,22.2,-128],[p,22.2,-188]);for(let p=-13.6;p<=13.6;p+=.8)u.push([p,23,-243.85]);u.push([0,26.7,-244.9]),e("a great window",6,n),e("a transept dresser",6,r),e("a chair of the choir's side tables",2,o);{const p=[[0,24.4,-155]],w=[[0,43,-31]],C=[];for(let N=-16.3;N<=16.3;N+=1.63)p.push([N,23.3,-128.7],[N,23.3,-187.3]);for(let N=-128.7;N>=-187.3;N-=1.628)p.push([-16.3,23.3,N],[16.3,23.3,N]);for(let N=.1;N<=1;N+=.1)for(const R of[-1,1])for(const H of[-1,1])w.push([R*34*N,44.3,-31+H*41*N]);for(const N of[-1,1])for(const R of[...me,18.6,26.9])for(let H=0;H<=10;H+=2.5)C.push([N*R,H,-245]);e("the canopy's inner valance, tassels and boss",6,p),e("the crossing ceiling's great boss and ribs",6,w),e("a gilt pilaster or a niche frame of the north wall",6,C)}e("the dais balustrade",6,a),e("the canopy",6,f),e("a curtain of the doorway",2.5,i),e("the pelmet or the wheel window",2.5,u),e("the shelved north wall",6,P);const S=[],d=[],h=[],T=[],v=[],m=(p,w,C,N)=>{const R=N,H=-C;for(const D of[-3.5,0,3.5]){S.push([p+C*1.5+R*D,11.75,w+N*1.5+H*D]);for(let W=12;W<=28;W+=4)S.push([p+C+R*D,W+(D?0:.4),w+N+H*D])}};for(const p of[-1,1]){for(let w=0;w<13;w++){m(p*34,Zt(w),-p,0);for(const C of[-4.95,4.95])for(let N=0;N<=10;N+=2.5)d.push([p*33.39,N,24+16*w+C])}for(let w=0;w<10;w++)m(p*34,Xt(w),-p,0);for(let w=0;w<11;w++)for(const C of[-4.95,4.95])for(let N=0;N<=10;N+=2.5)d.push([p*33.39,N,-80-16*w+C]);m(p*48,10,0,-1),m(p*48,-72,0,1);for(const w of[-.05,-9.95,-52.05,-61.95])d.push([p*61.39,5,w]);for(const w of mo)for(const C of[-4.5,0,4.5])for(const N of[10.7,16.6,22.1])v.push([p*61,N,w+C]);for(const w of[45.95,50.05])d.push([p*w,5,9.39],[p*w,5,-71.39]);for(let w=0;w<11;w++)for(const C of[-4.5,0,4.5])for(const N of[10.7,16.6,22.1])h.push([p*33,N,-80-16*w+C]);for(const w of[9,-71]){for(const C of[40.1,56])for(const N of[-4.3,0,4.3])for(const R of[11.4,16.6,22.1])v.push([p*C+N,R,w]);for(const C of[-.76,.76])T.push([p*56+C,10.9,w>0?8.6:-70.6])}}const M=[];for(const p of[-1,1])for(let w=0;w<13;w++)for(const C of[-4.5,0,4.5])for(const N of[10.7,16.6,22.1])M.push([p*33,N,24+16*w+C]);e("a verdure of the nave",4,M),e("a side window's frame or sill",3,S),e("a pilaster of the wainscot",6,d),e("a wall hanging",6,h),e("a mirror sconce of the transepts",6,T),e("a verdure of the transepts",6,v);const x=[],k=[];for(let p=0;p<_0.tiers;p++)for(let w=0;w<96;w++){const C=w/96*J,N=ne(p)+.08;for(const R of[se(p),se(p)-.1])x.push([_0.x+Math.cos(C)*N,R,_0.z+Math.sin(C)*N])}for(let p=0;p<12;p++){const w=p/12*J;for(const C of[2.1,3.3,5.2])k.push([_0.x+Math.cos(w)*1.96,se(9)+C,_0.z+Math.sin(w)*1.96])}return k.push([_0.x,se(9)+5.2,_0.z]),e("a tier of the pyramid, at its gilt rim",2,x),e("the epergne",2,k),t}const We=3.85;function Oe(t=1,e=26,s=!1,n=!1){const r=A0.makeBuilder(),o=L(Q,.8),a="#c8a04a",f="#9a7a34",i=(d,h,T,v)=>{const m=h[0]-d[0],M=h[2]-d[2],x=Math.hypot(m,M)||1,k=-M/x*T,p=m/x*T;r.quad([d[0]-k,d[1],d[2]-p],[d[0]+k,d[1],d[2]+p],[h[0]+k,h[1],h[2]+p],[h[0]-k,h[1],h[2]-p],v,o)},u=(d,h,T)=>{const v=new g.Vector3(h[0]-d[0],h[1]-d[1],h[2]-d[2]),m=v.length(),M=p0(T,T,m,3,!0);M.applyQuaternion(new g.Quaternion().setFromUnitVectors(new g.Vector3(0,1,0),v.normalize())),r.add(M,{p:[(d[0]+h[0])/2,(d[1]+h[1])/2,(d[2]+h[2])/2],c:a,surf:o})};s?r.add(Z([[4,.055],[4.1,.12],[4.145,.2],[4.1,.28],[4,.345],[3.9,.28],[3.86,.2],[3.9,.12],[4,.055]],28),{c:a,surf:o}):r.add(Z([[4,.055],[4.145,.2],[4,.345],[3.86,.2],[4,.055]],16),{c:a,surf:o}),s?r.add(new g.TorusGeometry(2.1,.09,3,16),{p:[0,2.6,0],r:[I/2,0,0],c:a,surf:o}):r.add(new g.TorusGeometry(2.1,.11,2,10),{p:[0,2.6,0],r:[I/2,0,0],s:[1,1,.3],c:a,surf:o});for(let d=0;d<6;d++){const h=d/6*J+.26,T=Math.cos(h),v=Math.sin(h),m=[T*3.95,.3,v*3.95],M=[T*2.1,2.6,v*2.1],x=[T*.3,5.9,v*.3];if(s){u(m,M,.05),u(M,x,.04);for(const k of[.33,.66])r.add(new g.OctahedronGeometry(.12,0),{p:[K0(m[0],M[0],k),K0(m[1],M[1],k),K0(m[2],M[2],k)],s:[1,1.5,1],c:a,surf:o})}else i(m,M,.07,a),i(M,x,.06,a)}r.add(Z(s?[[.02,5.6],[.2,5.7],[.2,5.9],[.06,6],[.44,6.1],[.52,6.3],[.36,6.4],[.5,6.7],[.2,6.8],[.05,6.9]]:[[.02,5.6],[.22,5.8],[.06,6],[.5,6.2],[.4,6.6],[.05,6.9]],n?16:s?6:4),{c:a,surf:o});const P=s?.5:1,S=Math.round(e/P);for(let d=0;d<S;d++){const h=6.85+d*e/S,T=h+e/S+.06,v=(h+T)/2,m=.12,M=d&1;n&&d<16?r.add(new g.TorusGeometry(.2,.034,3,8),{p:[0,v,0],r:[0,M?I/2:0,0],s:[.6,1.3,1],c:d%2?a:f,surf:o}):r.quad([0,h,0],[M?0:m,v,M?m:0],[0,T,0],[M?0:-m,v,M?-m:0],d%2?a:f,o)}for(let d=0;d<24;d++){const h=d/24*J,T=Math.cos(h)*We,v=Math.sin(h)*We;r.add(new g.ConeGeometry(.22,.1,s?5:3,1,!0),{p:[T,.42,v],r:[I,0,0],c:a,surf:o}),s&&r.add(p0(.1,.08,.14,4,!0),{p:[T,.5,v],c:f,surf:o}),r.add(p0(.065,.07,.6*t,s?4:3,!0),{p:[T,.46+.3*t,v],c:y.wax,surf:L(t0,.6),grad:[.46+.6*t-.15,.46+.6*t,.6,1.4]}),s&&r.add(new g.ConeGeometry(.011,.08,3,1,!0),{p:[T,.48+.6*t,v],c:"#140e0a",surf:L(t0)})}return r.build()}const Ba={midnight:{tab:1,ch:.42,py:.8,base:.36,pool:2.3,isle:1.7,stub:0,lat:H0,dawn:0,moon:0,sky:1,pane:.95,paneW:1,gwE:[.03,.055,.15],gwW:[.03,.055,.15],fill:[0,0,0],fillDir:[1,.3,0],kitFill:null,kitAmt:0,wall:1.2,cross:1,tierFill:0,tierDir:[1,.3,0],sheen:.05,amb:[.08,.068,.056],choir:[.3,.52,1.45],moonCol:0,fog:"#170e08",tint:"#f9f5ee",shadow:"#0b0705",exposure:1.08,title:"To the Brim"},blue:{tab:.8,ch:.34,py:.7,base:.3,pool:2.2,isle:1.6,stub:.34,lat:H0,dawn:1,moon:0,sky:1,pane:.8,paneW:.5,gwE:[.075,.17,.46],gwW:[.035,.07,.19],fill:[.07,.17,.56],fillDir:[1,.3,-.12],kitFill:"#3f6fd0",kitAmt:1.6,wall:1.35,cross:1.15,tierFill:1,tierDir:[1,.3,-.12],sheen:.05,amb:[.07,.068,.082],choir:[.62,1.02,2],moonCol:0,fog:"#0d0e18",tint:"#f1eff6",shadow:"#07080c",exposure:1.08,title:"To the Brim, Before Dawn"},moon:{tab:.62,ch:.16,py:.6,base:.26,pool:2.3,isle:1.5,stub:0,lat:H0*2,dawn:0,moon:1,sky:1.3,pane:1,paneW:1.25,gwE:[.04,.075,.19],gwW:[.17,.21,.31],fill:[.05,.062,.095],fillDir:[-.97,.3,.05],kitFill:"#aebfe0",kitAmt:.9,wall:1.5,cross:1.25,tierFill:26,tierDir:[-1,.25,-.15],sheen:.055,amb:[.068,.067,.08],choir:[1.05,1.3,1.75],moonCol:2.6,fog:"#100e10",tint:"#f3f1f0",shadow:"#08080b",exposure:1.1,title:"To the Brim, Full Moon"}},ja=t=>11-1.5*B0(203,262,t)-.5*B0(296,332,t)-2*B0(350,380,t)-3.2*B0(378,390,t)+6.2*B0(416,436,t);var Ua={id:"to-the-brim",name:"To the Brim",category:"interior",weirdness:.15,media:["interior","air"],async build(t){const{rng:e}=t,s=t.quality?.detail??1,n=t.vary||{},r=X0(n.density??1,.7,1.3);let o=e.fork("look").pick(["blue","moon","midnight","midnight","moon"]);n.hour==="dawn"?o="blue":n.hour==="night"&&o==="blue"&&(o="midnight");const a=Ba[o],f=e.fork("swaps"),i=f.pick(["ruby","ruby","gold","rose","ruby"]),u=f.pick(["gold","crimson","gold","none"]),P=f.pick(["bay","ivy","bay","none"]),S=P==="bay"?"#66763a":P==="ivy"?"#33603a":null,d=!!n.rare,h=new g.Scene,T=new g.Color(a.fog);h.background=T.clone().multiplyScalar(.6),h.fog=new g.FogExp2(T,.0021);const v=jo(Oo),m=v.length;await t.yield();const M=Math.ceil(m/.25),x=new Float32Array((M+1)*3);{const l=new g.Vector3;for(let c=0;c<=M;c++)v.posAtDist(m*c/M,l),x[c*3]=l.x,x[c*3+1]=l.y,x[c*3+2]=l.z,(c&255)===255&&await t.yield()}const p={...v,distanceTo:(l,c,b)=>{let q=1e18;for(let G=0;G<=M;G+=8){const K=G*3,V=x[K]-l,Y=x[K+1]-c,$=x[K+2]-b,c0=V*V+Y*Y+$*$;c0<q&&(q=c0)}const z=Math.sqrt(q)+1.05,A=z*z;let E=q;for(let G=0;G<=M;G+=8){const K=G*3,V=x[K]-l,Y=x[K+1]-c,$=x[K+2]-b;if(!(V*V+Y*Y+$*$>A))for(let c0=Math.max(G-8,0);c0<Math.min(G+8,M);c0++){const d0=c0*3,f0=x[d0],u0=x[d0+1],b0=x[d0+2],q0=x[d0+3]-f0,S0=x[d0+4]-u0,m0=x[d0+5]-b0,n0=X0(((l-f0)*q0+(c-u0)*S0+(b-b0)*m0)/(q0*q0+S0*S0+m0*m0),0,1),a0=f0+q0*n0-l,M0=u0+S0*n0-c,N0=b0+m0*n0-b,g0=a0*a0+M0*M0+N0*N0;g0<E&&(E=g0)}}return Math.sqrt(E)}},w=Wo(t,{palette:Wt,wine:i}),C=w.uniforms,R={uMoonDir:{value:new g.Vector3(-.969,.245,.051).normalize()},uMoonI:{value:a.moon},uDawn:{value:a.dawn},uSkyGain:{value:a.sky}},H={...g.UniformsUtils.clone(g.UniformsLib.fog),...R,uTime:C.uTime,uFlameCol:C.uFlameCol,uGustZ:C.uGustZ,uGustM:C.uGustM,uGustAmp:C.uGustAmp,uGustTail:C.uGustTail,uPix:C.uPix,uBase:{value:a.base},uIsle:{value:a.isle},uBlueE:{value:a.paneW},uGwPaneW:{value:a.moon?.22:1},uGwGlassW:{value:new g.Color().fromArray(a.moon?[.05,.085,.2]:a.gwW)},uWall:{value:a.wall},uCross:{value:a.cross},uTierFill:{value:a.tierFill},uSheen:{value:a.sheen},uPairE:{value:1},uGapE:{value:new g.Vector4(99,-1,99,-1)},uRivE:{value:-58},uLat:{value:a.lat},uTabI:{value:a.tab},uChI:{value:a.ch},uPyI:{value:a.py},uTrI:{value:1},uStub:{value:a.stub},uRunCol:{value:xe(u==="crimson"?"#7A0F1E":"#C9A24A").multiplyScalar(u==="crimson"?.9:.8)},uWineC:{value:C.uWineBody.value},uGain:{value:1},uPool:{value:a.pool},uPaneGain:{value:a.pane},uAmb:{value:new g.Color().fromArray(a.amb)},uChoir:{value:new g.Color().fromArray(a.choir)},uFill:{value:new g.Color().fromArray(a.fill)},uFillDir:{value:new g.Vector3().fromArray(a.fillDir).normalize()},uTierDir:{value:new g.Vector3().fromArray(a.tierDir).normalize()},uMoonCol:{value:new g.Color(.4,.48,.66).multiplyScalar(a.moonCol)},uChSway:{value:new g.Vector3},uChSway2:{value:new g.Vector3},uGwE:C.uGwE,uGwW:C.uGwW};C.uGwE.value.fromArray(a.gwE),C.uGwW.value.fromArray(a.gwW);const D=new g.ShaderMaterial({uniforms:H,vertexShader:Yo,fragmentShader:Jo,fog:!0,side:g.DoubleSide}),W={...g.UniformsUtils.clone(g.UniformsLib.fog),uTime:C.uTime,uFlameCol:C.uFlameCol,uGustZ:C.uGustZ,uGustM:C.uGustM,uGustAmp:C.uGustAmp,uGustTail:C.uGustTail,uPix:C.uPix,uHalo:{value:.34}},e0={transparent:!0,depthWrite:!1,blending:g.AdditiveBlending,fog:!0},U=new g.ShaderMaterial({uniforms:W,vertexShader:ea,fragmentShader:ta,...e0}),B=new g.ShaderMaterial({uniforms:W,vertexShader:oa,fragmentShader:aa,...e0,side:g.DoubleSide});await t.yield();const F=za(a.stub),j=A0.makeBuilder(),_=A0.makeBuilder(),O=A0.makeBuilder(),i0=A0.makeBuilder(),z0=A0.makeBuilder();await ma(t,j,_,O);const x0=e.fork("garlands"),C0=e.fork("silver"),X=[];let l0=1e9;const o0={},y0=_o(Ko("to-the-brim:company:"+(t.seed??1))),I0=[];{let l=1e9;const c=[];for(let b=0;b<13;b++)c.push(24+16*b);for(let b=0;b<10;b++)c.push(-80-16*b);for(const b of c)for(const q of[-1,1])for(const z of[[q*25.5,28.1],[q*30.9,25.2],[q*25.8,30.5],[q*20.5,33.2],[q*12.8,38.7],[q*6,39.4],[0,38.1]])l=Math.min(l,p.distanceTo(z[0],z[1],b)-.7);l<5&&console.warn("to-the-brim: a roof truss comes within 5 m of the flown line",l),o0["a roof truss (pendants, braces, bosses, collar)"]=l}const ue=(l,c,b,q,z,A,E=!1)=>{const G=C0.fork(c);for(let K=0;K<A;K++){const V=z+12.8*K,Y=G.int(0,2),$=p.distanceTo(b,q+.7,V);l0=Math.min(l0,$-.9),ga(l,G,b,q,V,Y,$<8,X,E)}};let j0=1e9;const J0=[0,0],pe=async(l,c,b,q,z)=>{const A=e.fork("larder"+l),E=[-1,-1,-1];for(let G=0;G<q;G++){const K=b+H0*G+H0/2;let V=[0,2,1,2,1][(G+2*z)%5],Y=-1,$=0;for(;V<3;V++){const d0=ba[V].filter(f0=>f0!==E[V]);if(Y=d0[A.int(0,d0.length-1)],$=Math.min(p.distanceTo(c,3+no[Y],K),p.distanceTo(c,3+no[Y]*.5,K))-.75,$>=2)break;Y=-1}if(Y<0)continue;E[V]=Y,j0=Math.min(j0,$);const c0=p.nearestXZ(c,K).dist<12;J0[c0?0:1]++,Ma(i0,A,c,3,K,Y,c0),(G&15)===15&&await t.yield()}};for(let l=0;l<5;l++){const c=Be[l];gt(i0,c,20,200,2.4,3,.6,L(je,c,fe,fe+H0*55),0),await pe("nave"+l,c,fe,55,l),await t.yield();for(let b=0;b<56;b++){const q=fe+H0*b,z=o!=="moon"||(b&1)===0;F.stick(c,3,q,z),z&&(b*7+l*3)%4===0&&F.smoke.push(c,3+F.fy+.42,q,2.2+b*13%5*.2)}await t.yield();for(let b=0;b<112;b++){let q=b>>1;o==="moon"&&q&1&&(q=X0(q+(b&1?1:-1),0,54));const z=Zo+1.6*b,A=fe+H0*q;for(const E of[-1.9,-1.1,1.1,1.9])F.glass(c+E,3,z,c,3+F.fy+.16,A,1,1)}if(await t.yield(),S){const b=Math.round(200*s*r);for(let q=0;q<4;q++)so(z0,x0,(z,A,E)=>{const G=20.6+44.7*(q+z);A[0]=c+.52*Math.sin(I*(G-fe)/H0+I/2)*(.75+.25*Math.sin(G*.7)),A[1]=3,A[2]=G,E[0]=0,E[1]=1,E[2]=0},Math.round(b/4),X,{fruit:.03,size:.46}),await t.yield()}}for(const l of[-1,1]){const c=l*26.5,b=z=>-228.8+H0*z,q=z=>l<0&&z<-172;gt(i0,c,-232,-80,2.4,3,.6,L(je,c,b(0),b(46)),0),await pe("choir"+l,c,b(0),46,l>0?1:3),await t.yield();for(let z=0;z<47;z++){const A=b(z),E=!q(A);F.stick(c,3,A,E),E&&z%6===2&&F.smoke.push(c,3+F.fy+.42,A,2.4)}for(let z=0;z<95;z++){const A=-231.2+1.6*z;let E=X0(Math.floor((A-b(0))/H0+.5),0,46);q(b(E))&&(E=A<-182?11:18);for(const G of[-1.9,-1.1,1.1,1.9])F.glass(c+G,3,A,c,3+F.fy+.16,b(E),1,1)}if(await t.yield(),S){const z=Math.round(170*s*r);for(let A=0;A<4;A++)so(z0,x0,(E,G,K)=>{const V=-231.4+37.7*(A+E);G[0]=c+.52*Math.sin(I*(V-b(0))/H0+I/2)*(.75+.25*Math.sin(V*.7)),G[1]=3,G[2]=V,K[0]=0,K[1]=1,K[2]=0},Math.round(z/4),X,{fruit:.03,size:.46}),await t.yield()}}j0<2&&console.warn("to-the-brim: a thing of the long tables' feast stands within 2 m of the flown line",j0),o0["a thing of the long tables' feast"]=j0,o0.feastFullAndLight=J0;const w0=a.stub>0?.4:1,ve=S||"#66763a";{const l=await Sa(t,_,F,x0,o,s,X,e.fork("tierswags"),p.distanceTo);l.garland<2&&console.warn("to-the-brim: a garland of the pyramid comes within 2 m of the flown line",l.garland),l.gap<.005&&console.warn("to-the-brim: a stick of the pyramid stands in a glass's foot",l.gap),o0["a garland of the pyramid (every leaf of it)"]=l.garland,o0.stickToGlassFoot=l.gap}await t.yield();const bo=O.triangles,zt={};let kt=O.triangles;const Q0=l=>{zt[l]=O.triangles-kt,kt=O.triangles};await Ta(t,O,F,x0,ve,s,w0),Q0("dais");{const l=await Ea(t,O,F,e.fork("steps"),p,w0);l.least<2&&console.warn("to-the-brim: a candle of the dais steps stands within 2 m of the flown line",l.least),l.bowlLeast<2&&console.warn("to-the-brim: a bowl of flowers on the dais steps stands within 2 m of the flown line",l.bowlLeast),o0["a candle of the dais steps, at its flame"]=l.least,o0["a bowl of flowers on the dais steps"]=l.bowlLeast,o0.stepClusters=l.count,o0.stepBowls=l.bowls}{const l=e.fork("urns"),c=[0,1].map(()=>Pt(()=>l.range(0,1))),b=y0.fork("fineurns");let q=1e9,z=0;for(let A=0;A<2;A++)c.push(Pt(()=>b.range(0,1),!0));for(const A of[-1,1])for(const[E,G]of[[4.6,-115.4],[4.6,-200.6],[23.6,-115.4],[23.6,-200.6],[10.8,-241.2]])co(O,l,A*E,0,G,c[z++%2+(p.nearestXZ(A*E,G).dist<25?2:0)]),q=Math.min(q,p.distanceTo(A*E,2.95,G)-1.15,p.distanceTo(A*E,2,G)-.95);for(const A of c)A.dispose();q<2&&console.warn("to-the-brim: a great urn stands within 2 m of the flown line",q),o0["a great urn of flowers"]=q}Q0("steps"),await t.yield();for(const l of[-5,5])ue(O,"rank"+l,l,6,W0-3.2*(he-1)+1.6+3.2,3,!0);l0<2&&console.warn("to-the-brim: a silver dish stands within 2 m of the flown line",l0);let Y0=1e9;{const l=e.fork("feast"),c=Pa(w0),b=ro(w0);for(const q of[-5,5]){let z=-1;for(let A=0;A<he-1;A++){const E=W0-1.6-3.2*A;if(A%4!==2)if(A%4===0){const G=q+Math.sign(q)*.3;O.add(c,{p:[G,6,E]});for(const K of b)F.flame(G+K[0],6+K[1]+.02,E+K[2],.34,.12),Y0=Math.min(Y0,p.distanceTo(G+K[0],6+K[1]+.36,E+K[2])-.15);Y0=Math.min(Y0,p.distanceTo(G,7,E)-.6)}else{let G=l.int(0,5);for(;G===z;)G=l.int(0,5);z=G,xa(O,l,q,6,E,G,X),Y0=Math.min(Y0,p.distanceTo(q,6+ya[G],E)-.75,p.distanceTo(q,6.2,E)-.75)}}}c.dispose()}Y0<2&&console.warn("to-the-brim: a dish or a candelabrum of the feast stands within 2 m of the flown line",Y0),o0["a dish or a candelabrum of the feast"]=Y0,Q0("feast"),await t.yield(),Ga(O),await t.yield();{let l=1e9;const c=s0(ve,.9),b=(z,A)=>{for(const E of z)l=Math.min(l,p.distanceTo(E[0],E[1],E[2])-A)};for(const z of[-1,1]){const A=[];for(let E=0;E<=72;E++){const G=Math.sin(E%4/4*I);A.push([z*19.6,4.98-.9*G,-121.6-72.8*E/72,.75+.25*G])}Da(O,A,.36,3,c,1),b(A,.36)}const q=z=>{const A=ho;for(let E=0;E<A.length-1;E++)if(z<=A[E][0]&&z>=A[E+1][0])return K0(A[E+1][1],A[E][1],(z-A[E+1][0])/(A[E][0]-A[E+1][0]));return 1};for(const z of[-1,1])for(const A of[-128.6,-187.4]){const E=[];for(let V=0;V<=28;V++){const Y=3.6+18*V/28,$=V*J/6+(z>0?0:I),c0=q(Y)*1.2+.25;E.push([z*16.4+Math.cos($)*c0,Y,A+Math.sin($)*c0,V===0||V===28?.5:1])}const G=y0.fork("cornersprays"+z+A),K=O0(()=>G.range(0,1));for(let V=0;V<7;V++){const Y=(V*4+2)*J/6+(z>0?0:I);K.rope(E.slice(V*4,V*4+5),.42,3,[Math.cos(Y),.15,Math.sin(Y)],{leaf:5,rose:.7,bloom:.5,roseHex:"#e6dfcc"})}O.add(K.geo(),{}),b(E,.42*1.75)}l<2&&console.warn("to-the-brim: a garland of the dais comes within 2 m of the flown line",l),o0["a garland of the dais (rails, canopy corners)"]=l}Q0("canopy"),await t.yield();{const l=await Na(t,O,F,x0,w0,p.distanceTo);l.garland<2&&console.warn("to-the-brim: the garland over the north arch comes within 2 m of the flown line",l.garland),l.sconce<2&&console.warn("to-the-brim: a sconce of the north wall's gilt pilasters comes within 2 m of the flown line",l.sconce),l.cups<2&&console.warn("to-the-brim: a candle cup of the north arch comes within 2 m of the flown line",l.cups),o0["the garland over the north arch (every leaf of it)"]=l.garland,o0["a sconce of the north wall's gilt pilasters"]=l.sconce,o0["a candle cup round the north arch"]=l.cups,o0.archCups=l.nCups,l.porch<2.2&&console.warn("to-the-brim: an arch of the porch comes within 2.2 m of the flown line",l.porch),o0["an arch of the porch"]=l.porch;{const c=y0.fork("nicheurns"),b=[0,1].map(()=>Pt(()=>c.range(0,1)));let q=0,z=l.niche;for(const[A,E,G]of l.urns)co(O,c,A,E,G,b[q++%2]),z=Math.min(z,p.distanceTo(A,E+2.95,G)-1.15,p.distanceTo(A,E+2,G)-.95);for(const A of b)A.dispose();z<2&&console.warn("to-the-brim: a niche of the north wall (its stand, its urn, its candles) comes within 2 m of the flown line",z),o0["a niche of the north wall (its stand, its urn, its sill candles)"]=z,o0.nicheGlasses=l.nicheGlasses}}Q0("doorway"),await t.yield();const Ze=[yo(w0),yo(w0,!0)];{const l=await xo(t,_,F,e.fork("wreaths"),y0.fork("woundflowers"),Ze,w0,p,De.map(([c,b])=>[c,b,!1]),y0.fork("rounddress"));for(const[c,b]of De)p.nearestXZ(c,b).dist<6+3.2&&console.warn("to-the-brim: a round table stands too near the flown line",c,b);(l.wreath<2||l.body<2)&&console.warn("to-the-brim: a round table of the transepts comes within 2 m of the flown line",l.wreath,l.body),o0["a wreath of a round table (every leaf of it, and the flowers wound on its candelabrum)"]=l.wreath,o0["a round table of the transepts (cloth, flame tips)"]=l.body}await t.yield();const St=po(w0);await t.yield();const we=po(w0,!0),Pe=(l,c)=>{const b=p.nearestXZ(l,c).dist;return b<16?3:b<30?2:1},ze=(l,c)=>p.nearestXZ(l,c).dist>=58;await t.yield();for(let l=0;l<13;l++){const c=24+16*l;for(const b of[-1,1])bt(j,b*33.65,c,b,(l+(b>0?1:0))%3,c===88||c===168?10.7:16.7,!0);if(!(c===88||c===168)){for(const b of[-1,1])Ne(j,we,F,b*33.65,c,-b,0,w0,Pe(b*33.65,c),ze(b*33.65,c));(l&3)===3&&await t.yield()}}for(const l of[-1,1]){for(const c of[-5,-57])Ne(_,we,F,l*61.65,c,-l,0,w0,Pe(l*61.65,c),ze(l*61.65,c));mo.forEach((c,b)=>bt(_,l*61.65,c,l,(b+(l>0?1:0))%3,c===-5||c===-57?16.7:10.7,!0)),Mt(_,l*40.1,9.65,-1,l>0?1:2,16.7),Mt(_,l*40.1,-71.65,1,l>0?2:0,16.7),Ne(_,we,F,l*41,9.65,0,-1,w0,Pe(l*41,9.65),ze(l*41,9.65)),Ne(_,we,F,l*41,-71.65,0,1,w0,Pe(l*41,-71.65),ze(l*41,-71.65))}await t.yield();for(const l of[-79.3,-96,-112,-160,-208,-224,-240.3])for(const c of[-1,1]){const b=Pe(c*33.65,l)===3;Ne(O,b?we:St,F,c*33.65,l,-c,0,w0,b?3:0,ze(c*33.65,l))}we.dispose(),await t.yield(),Q0("dressers");for(let l=0;l<11;l++)for(const c of[-1,1]){const b=-80-16*l,q=b===-128||b===-144||b===-176||b===-192;bt(O,c*33.65,l===0?-79.3:l===10?-240.3:b,c,b===-176||b===-192?3:(l+(c>0?1:0))%3,q?10.7:16.7)}for(const l of[-1,1]){for(let c=0;c<13;c++)for(const b of[-4.95,4.95])Ae(j,l*33.65,24+16*c+b,-l,0);for(let c=0;c<11;c++)for(const b of[-4.95,4.95]){const q=-80-16*c+b;q<-76&&q>-244&&Ae(O,l*33.65,q,-l,0)}for(const c of[-.05,-9.95,-52.05,-61.95])Ae(_,l*61.65,c,-l,0);for(const c of[45.95,50.05])Ae(_,l*c,9.65,0,-1),Ae(_,l*c,-71.65,0,1)}await t.yield(),Q0("pilasters");{const l=L(Q,.85);for(const c of[-1,1])for(const b of[-1,1]){const q=c*56,z=b>0?9.65:-71.65,A=-b;Mt(_,q,z,A,c*b>0?0:2,11.4),_.add(p0(.4,.4,.04,12),{p:[q,10.4,z+A*.03],r:[I/2,0,0],c:"#e9eef2",surf:L(Q,1)}),_.add(new g.TorusGeometry(.44,.07,4,12),{p:[q,10.4,z+A*.04],c:y.silver,surf:l});for(const E of[-1,1])_.add(V0(.1,.1,.8),{p:[q+E*.5,9.9,z+A*.4],c:y.silver,surf:l}),_.add(new g.ConeGeometry(.26,.14,7,1,!0),{p:[q+E*.5,10,z+A*.8],r:[I,0,0],c:y.silver,surf:l}),_.add(p0(.08,.08,.62*w0,5,!0),{p:[q+E*.5,10.04+.31*w0,z+A*.8],c:y.wax,surf:L(t0,.6)}),F.flame(q+E*.5,10.06+.62*w0,z+A*.8,.4,.15)}}St.dispose();{const l=Ra(w0),c=wo(w0),b=(z,A,E,G=0)=>{if(z.add(l,{p:[A,G,E]}),!(A<-6&&E<-172&&E>-236)){for(const K of c)F.flame(A+K[0],G+K[1],E+K[2],.5,.17);F.smoke.push(A,G+7.89+1.16*w0,E,3.4),p.distanceTo(A,8.6,E)<6&&console.warn("to-the-brim: a candle tree stands within 6 m of the flown line",A,E)}},q=[];{const z=e.fork("avenue"),A=[[1.55,0],[1.62,.12],[1.5,.2],[1.5,.8],[1.6,.86],[1.5,.9],[0,.9]];let E=-1,G=!0;const K=(n0,a0)=>p.nearestXZ(n0,a0).dist-1.62<5?!1:(q.push([n0,a0,1.62]),O.add(Z(A,10),{p:[n0,0,a0],c:y.oakD,surf:L(P0)}),ao(O,z,n0,a0,1.5,1,ve,s),b(O,n0,a0,.9),!0);for(let n0=0;n0<6;n0++){const a0=-62.5-9*n0;K(-12.5,a0),G&&K(12.5,a0)?E=n0:G=!1}for(let n0=0;n0<3;n0++)for(const a0 of[-1,1])K(a0*12.5,-210.5-9*n0);H.uPairE.value=E,E<0&&console.warn("to-the-brim: no candle tree of the avenue stands east of the carpet");const V=e.fork("orange"),Y=e.fork("leafmass"),$=()=>Y.range(0,1),c0=y0.fork("fineheads"),d0=()=>c0.range(0,1),f0=Ia();let u0=1e9,b0=0;for(const n0 of[!0,!1])Ie($,84,14,8,n0,1).dispose();const q0=[Ie(d0,168,14,8,!0,0,.14),Ie(d0,168,14,8,!1,0,.14)],S0=[Ie($,44,8,4,!0,0),Ie($,44,8,4,!1,0)];await t.yield();const m0=(n0,a0)=>{const M0=p.nearestXZ(n0,a0).dist;return M0-2.8<5?!1:(q.push([n0,a0,1.35]),u0=Math.min(u0,vo(O,F,V,n0,a0,f0,M0<25?q0:S0,p,n0<0&&a0<-197)),b0++,!0)};for(const[n0,a0]of[[0,9],[1,16]]){let M0=99,N0=-1;for(let g0=0;g0<7;g0++){const T0=-58-9*g0;m0(-a0,T0),m0(a0,T0)||(M0=Math.min(M0,g0),N0=Math.max(N0,g0))}for(let g0=M0;g0<=N0;g0++)p.nearestXZ(a0,-58-9*g0).dist-2.8>=5&&console.warn("to-the-brim: an east row of orange trees has two gaps",a0);H.uGapE.value.setComponent(n0*2,M0),H.uGapE.value.setComponent(n0*2+1,N0);for(let g0=0;g0<4;g0++)for(const T0 of[-1,1])m0(T0*a0,-206-9*g0)||console.warn("to-the-brim: an orange tree before the north door stands too near the flown line",T0*a0);await t.yield()}{const n0=e.fork("transepttrees");let a0=1e9;for(const M0 of[-1,1])for(const N0 of[4.5,-15,-47,-66.5])a0=Math.min(a0,vo(_,F,n0,M0*58.5,N0,f0,S0,p,!1));a0<2&&console.warn("to-the-brim: an orange tree of the transepts comes within 2 m of the flown line",a0),o0["an orange tree of the transepts (head, lanterns, tub)"]=a0}f0.dispose();for(const n0 of[...q0,...S0])n0.dispose();u0<2&&console.warn("to-the-brim: an orange tree comes within 2 m of the flown line",u0),o0["an orange tree (head, lanterns, tub)"]=u0,o0.orangeTrees=b0}await t.yield();{const z=new g.CylinderGeometry(.17,.11,.26,4,1,!0),A=L(t0,.75);let E=1e9,G=0,K=-58;const V=($,c0)=>p.nearestXZ($,c0).dist<5?!1:(O.add(z,{p:[$,.13,c0],r:[0,I/4,0],c:"#e0a860",surf:A}),F.bare($,.2,c0,.3,.11),F.glow($,.34,c0,.95),E=Math.min(E,p.distanceTo($,.5,c0)-.2),G++,!0);let Y=!0;for(let $=0;$<39;$++){const c0=-58-1.5*$;V(-3.1,c0),Y&&V(3.1,c0)?K=c0:Y=!1}for(let $=0;$<25;$++)for(const c0 of[-1,1])V(c0*5.2,-201-1.5*$);z.dispose(),H.uRivE.value=K,E<2&&console.warn("to-the-brim: a cup of the river of light stands within 2 m of the flown line",E),o0["a candle cup of the river of light"]=E,o0.riverCups=G}await t.yield();{const z=[...q,[0,-30,20.3]];for(let G=0;G<12;G++)z.push([24*Math.cos((G+.5)*I/6),-30+24*Math.sin((G+.5)*I/6),1.2]);for(const G of[-1,1])z.push([G*34,-72,2.4]);for(const[G,K]of De)z.push([G,K,4.6]);const A=(G,K)=>{const V=Math.abs(G);let Y=Math.min(V-3.4,K+116.8);for(const $ of z)Y=Math.min(Y,Math.hypot(G-$[0],K-$[1])-$[2]);if(K<-72){Y=Math.min(Y,33.3-V,Math.hypot(Math.max(22.6-V,0),Math.max(K+79,0)));for(const $ of[-79.3,-96,-112])Y=Math.min(Y,Math.hypot(Math.max(31.3-V,0),Math.max(Math.abs(K-$)-4.6,0)))}return Y};for(let G=1;G<8;G++)for(const K of G&1?[17.9,27.3]:[13.2,22.6])for(const V of[-1,1]){const Y=V*K,$=-54.5-8.2*G;A(Y,$)>=4.6&&I0.push([Y,$,p.nearestXZ(Y,$).dist<7])}const E=await xo(t,O,F,y0.fork("companywreaths"),y0.fork("companyflowers"),Ze,w0,p,I0,y0.fork("companydress"));for(const[G,K,V]of I0)!V&&p.nearestXZ(G,K).dist<5+1.4&&console.warn("to-the-brim: a tall candelabrum stands within 5 m of the flown line in plan",G,K);(E.wreath<2||E.body<2)&&console.warn("to-the-brim: a round table of the choir comes within 2 m of the flown line",E.wreath,E.body),o0["a round table of the choir (cloth, flame tips)"]=E.body,o0["a wreath or the wound flowers of a round table of the choir"]=E.wreath,o0.choirRoundTables=I0.length}for(const z of Ze)z.dispose();await t.yield();for(const z of[-1,1])b(O,z*12.5,-238);for(const z of[-1,1])for(const A of[-126,-190])b(O,z*17.2,A,3);for(let z=0;z<12;z++)b(_,24*Math.cos((z+.5)*I/6),-30+24*Math.sin((z+.5)*I/6));l.dispose()}Q0("avenue"),await t.yield();const Xe=[],v0={glasses:0,weights:{},clear:{},tris:{nave:j.triangles,crossing:_.triangles,choir:O.triangles,tables:i0.triangles,garlands:z0.triangles,choirShell:bo,choirBy:zt}};for(const l of[j,_,O,i0,z0]){if(!l.triangles)continue;const c=new g.Mesh(l.build(),D);h.add(c),Xe.push(c),await t.yield()}{const l=A0.makeBuilder(),c=L(Q,.55);for(const q of[-128,-144])for(const z of[-1,1]){const A=z*33.5;l.add(Z([[.02,-.7],[.4,-.3],[.56,.4],[.26,1],[.02,1.2]],6),{p:[A,10,q],s:[.25,1,1],c:y.gilt,surf:c});for(const E of[-.7,.7])l.add(r0(.9,.14,.14,.04,"x"),{p:[A-z*.5,10,q+E],c:y.iron,surf:L(Q,.3)}),l.add(new g.ConeGeometry(.3,.16,7,1,!0),{p:[A-z*.95,10.1,q+E],r:[I,0,0],c:y.gilt,surf:c}),l.add(p0(.08,.08,.62*w0,5,!0),{p:[A-z*.95,10.14+.31*w0,q+E],c:y.wax,surf:L(t0,.6)}),F.flame(A-z*.95,10.16+.62*w0,q+E,.4,.15)}const b=new g.Mesh(l.build(),D);h.add(b),Xe.push(b)}await t.yield();const E0=new g.Matrix4,$0=new g.Quaternion,ee=new g.Vector3,R0=new g.Vector3(1,1,1),Ye=new g.Vector3(0,1,0),ge=new g.Color(1,1,1),Tt=(l,c,b,q)=>{const z=c.length/b;if(!z)return null;const A=new g.InstancedMesh(l,D,z);for(let E=0;E<z;E++)q(E*b,E),A.setMatrixAt(E,E0),A.setColorAt(E,ge);return A.instanceMatrix.needsUpdate=!0,A.computeBoundingSphere(),h.add(A),A},te=e.fork("chairs"),Je=e.fork("seats"),Mo=Je,oe=[[],[],[],[]],ke=A0.makeBuilder();let Se=1e9,Ct=0,Lt=0;const Po=[ge,new g.Color(.035,5.45,2.64),new g.Color(1.35,11,.75)],Qe=(l,c,b,q,z,A,E,G,K=Mo)=>{if(K.chance(1/7)){E+=4;const V=K.range(.5,.9),Y=K.range(.25,.7)*(K.chance(.5)?1:-1);c-=Math.sin(z)*V,q-=Math.cos(z)*V,z+=Y,Ct++,Se=Math.min(Se,p.distanceTo(c,b+3.97,q)-1.3,p.distanceTo(c,b+2,q)-1.3)}if(K.chance(1/9)){const V=b+(G?2.29:2.1);if(Lt++,K.chance(1/3)){const Y=O0(()=>K.range(0,1)),$=[];for(let c0=0;c0<=6;c0++){const d0=c0*J/6;$.push([c+Math.cos(d0)*.3,V+.07,q+Math.sin(d0)*.3,1])}Y.rope($,.13,0,[0,1,0],{leaf:4.5,rose:1.4,roseHex:"#e6dfcc"}),ke.add(Y.geo(),{})}else ke.add(k0(.62,.07,.62,"D"),{p:[c,V+.035,q],r:[0,z+K.range(-.5,.5),0],c:"#e4dccb",surf:L(t0)})}oe[l].push(c,b,q,z,A,E)},qt=s<.7?2:1,zo=Je.int(0,2);for(let l=0;l<5;l++)for(let c=0;c<56;c+=qt)for(const b of[-1,1]){const q=fe+H0*c,z=Be[l]+b*(3.2+te.range(-.05,.05)),A=q+te.range(-.08,.08),E=p.distanceTo(z,2,A)<8.6?2:q>110?0:1;Qe(E,z,0,A,b>0?-I/2:I/2,te.range(-.03,.03),(l+zo)%3,E===2)}await t.yield();for(const l of[-1,1])for(let c=0;c<47;c+=qt)for(const b of[-1,1]){const q=l*26.5+b*(3.2+te.range(-.05,.05)),z=-228.8+H0*c+te.range(-.08,.08);oe[p.distanceTo(q,2,z)<8.6?2:1].push(q,0,z,b>0?-I/2:I/2,te.range(-.03,.03),0)}for(const l of[-5,5])for(let c=0;c<he;c++)oe[3].push(l+Math.sign(l)*2.35,3,W0-H0*c,l>0?-I/2:I/2,te.range(-.03,.03),0);await t.yield();for(const[l,c]of De){const b=Je.int(0,2);for(let q=0;q<8;q++){const z=(q+.5)*J/8;Qe(1,l+Math.cos(z)*4,0,c+Math.sin(z)*4,Math.atan2(-Math.cos(z),-Math.sin(z)),te.range(-.05,.05),b,!1)}}{const l=y0.fork("companychairs"),c=y0.fork("companyseats");let b=1e9;for(const[q,z]of I0){const A=c.int(0,2);for(let E=0;E<8;E++){const G=(E+.5)*J/8,K=q+Math.cos(G)*4,V=z+Math.sin(G)*4;b=Math.min(b,p.distanceTo(K,3.97,V)-.6,p.distanceTo(K,2,V)-.6),Qe(1,K,0,V,Math.atan2(-Math.cos(G),-Math.sin(G)),l.range(-.05,.05),A,!1,c)}}b<2&&console.warn("to-the-brim: a chair of the choir's round tables comes within 2 m of the flown line",b),v0.clear["a chair of the choir's round tables"]=b}if(Se<2&&console.warn("to-the-brim: a chair drawn back from its table comes within 2 m of the flown line",Se),v0.clear["a chair drawn back from its table"]=Se,v0.seats={drawnBack:Ct,napkinsAndWreaths:Lt},ke.triangles){v0.tris.seats=ke.triangles;const l=new g.Mesh(ke.build(),D);h.add(l),Xe.push(l)}await t.yield();const Et=pa(),At=wa(),Gt=va();{const l=[];for(let c=0;c<2;c++){const b=oe[c],q=[];for(let z=0;z<b.length;z+=6)(b[z+5]>3||p.distanceTo(b[z],b[z+1]+2,b[z+2])<13?q:l).push(b[z],b[z+1],b[z+2],b[z+3],b[z+4],b[z+5]);oe[c]=q}oe.push(l),v0.chairs=oe.map(c=>c.length/6)}for(let l=0;l<5;l++){const c=oe[l],b=Tt(l===4?Gt:l<2?Et:At,c,6,q=>{E0.compose(ee.set(c[q],c[q+1],c[q+2]),$0.setFromAxisAngle(Ye,c[q+3]+c[q+4]),R0)});if(b){for(let q=0;q<c.length/6;q++)b.setColorAt(q,Po[c[q*6+5]&3]);b.instanceColor.needsUpdate=!0}await t.yield()}const Nt=[be(a.stub,0,!1),be(a.stub,.6,!1),be(a.stub,0,!0),be(a.stub,.6,!0),be(a.stub,0,!1,!0),be(a.stub,.6,!1,!0)],$e=[[],[],[],[],[],[],[]];for(let l=0;l<F.sticks.length;l+=5){const c=F.sticks[l],b=F.sticks[l+1],q=F.sticks[l+2],z=F.sticks[l+3],A=p.distanceTo(c,b+1,q),E=A<9;$e[E?2+z:A>=16?5+z:z?1:q>10?0:4].push(c,b,q,F.sticks[l+4]),(l&1023)===0&&await t.yield()}v0.sticks=$e.map(l=>l.length/4);for(let l=0;l<7;l++){const c=$e[l];Tt(Nt[l===4?0:l>4?l-1:l],c,4,(b,q)=>{E0.compose(ee.set(c[b],c[b+1],c[b+2]),$0.setFromAxisAngle(Ye,q*2.399),R0.set(c[b+3],1,c[b+3]))}),R0.set(1,1,1),await t.yield()}{const l=new g.BufferGeometry;l.setAttribute("position",new g.Float32BufferAttribute([0,0,0,1,0,0,.45,.2,.09,0,0,0,.45,-.2,.09,1,0,0],3)),l.setAttribute("color",new g.Float32BufferAttribute([.45,.45,.45,1.1,1.1,1.1,.85,.85,.85,.45,.45,.45,.8,.8,.8,1.1,1.1,1.1],3)),l.setAttribute("surf",new g.Float32BufferAttribute([6,0,0,0,6,0,0,0,6,0,0,0,6,0,0,0,6,0,0,0,6,0,0,0],4)),l.computeVertexNormals();const c=X.length/11,b=new g.InstancedMesh(l,D,Math.max(c,1)),q=new g.Vector3,z=new g.Vector3,A=new g.Vector3,E=new g.Color,G=[xe(ve),s0(ve,.62),xe(ve).lerp(xe("#9aa04a"),.45)];for(let K=0;K<c;K++){const V=K*11,Y=X[V+9];q.set(X[V+3],X[V+4],X[V+5]).normalize(),A.set(X[V+6],X[V+7],X[V+8]),z.crossVectors(A,q),z.lengthSq()<1e-6&&z.set(0,1,0),z.normalize(),A.crossVectors(q,z),E0.makeBasis(q,z,A).scale(R0.set(Y,Y,Y)).setPosition(X[V],X[V+1],X[V+2]),b.setMatrixAt(K,E0),b.setColorAt(K,E.copy(G[X[V+10]%3]).multiplyScalar(.8+.4*(K*.618%1))),(K&1023)===1023&&await t.yield()}R0.set(1,1,1),b.count=c,b.instanceMatrix.needsUpdate=!0,b.instanceColor&&(b.instanceColor.needsUpdate=!0),b.computeBoundingSphere(),h.add(b),v0.leaves=c}await t.yield();const ko=2,So=5.4,To=17,F0=F.glasses,It=F0.length/8,et=new Map;let Te=1e9;for(let l=0;l<It;l++){const c=l*8,b=F0[c],q=F0[c+1],z=F0[c+2],A=p.nearestXZ(b,z).dist,E=z<-126&&z>-175&&Math.abs(b)<8,G=A<=ko&&p.distanceTo(b,q+.88,z)<4.3||E?"near":A>To?"speck":A>So?"far":"mid",K=G==="far"||G==="speck",V=K?z>10?0:1:z>110?0:z>10?1:2,Y=G+":"+V+":"+(K?0:F0[c+7]);let $=et.get(Y);$||($={w:G,caustic:!K&&F0[c+7]>0,list:[]},et.set(Y,$)),$.list.push(l),v0.weights[G]=(v0.weights[G]||0)+1,A<6&&(Te=Math.min(Te,p.distanceTo(b,q+.88,z))),(l&511)===0&&await t.yield()}const Co=[];for(const l of et.values()){(l.w==="far"||l.w==="speck")&&l.list.sort((b,q)=>F0[q*8+2]-F0[b*8+2]);const c=w.makeGlasses(l.w,l.list.length,{caustic:l.caustic});for(let b=0;b<l.list.length;b++){const q=l.list[b]*8;c.set(b,F0[q],F0[q+1],F0[q+2],F0[q+3],F0[q+4],F0[q+5],F0[q+6],l.list[b]*2.399%J),(b&255)===255&&await t.yield()}c.commit(),c.caustic&&(c.caustic.frustumCulled=!0),h.add(c.group),Co.push(c),await t.yield()}const L0=F.flames,tt=L0.length/5,ot=w.makeFlames(tt),ae=new g.InstancedMesh(new g.PlaneGeometry(1,1),U,tt),at=a.stub>0?.84:1;for(let l=0;l<tt;l++){const c=l*5;ot.set(l,L0[c],L0[c+1],L0[c+2],L0[c+3]*at,L0[c+4]);const b=L0[c+2]<-126&&L0[c+2]>-172&&Math.abs(L0[c])<8?1.6:1;E0.compose(ee.set(L0[c],L0[c+1]+L0[c+3]*.42,L0[c+2]),$0.identity(),R0.setScalar(L0[c+3]*1.5*b)),ae.setMatrixAt(l,E0),L0[c+1]<9&&p.distanceTo(L0[c],L0[c+1]+L0[c+3],L0[c+2])<2&&console.warn("to-the-brim: a flame stands within 2 m of the flown line",L0[c],L0[c+1],L0[c+2]),(l&511)===511&&await t.yield()}R0.set(1,1,1),ot.commit(),ae.instanceMatrix.needsUpdate=!0,ae.frustumCulled=!1,ae.renderOrder=4,h.add(ot.mesh,ae);{const l=F.bares,c=l.length/5,b=w.makeFlames(Math.max(c,1));for(let E=0;E<c;E++){const G=E*5;b.set(E,l[G],l[G+1],l[G+2],l[G+3]*at,l[G+4]),(E&511)===511&&await t.yield()}b.commit(),b.mesh.count=c,h.add(b.mesh);const q=F.glows,z=q.length/4,A=new g.InstancedMesh(ae.geometry,U,Math.max(z,1));for(let E=0;E<z;E++)E0.compose(ee.set(q[E*4],q[E*4+1],q[E*4+2]),$0.identity(),R0.setScalar(q[E*4+3])),A.setMatrixAt(E,E0);R0.set(1,1,1),A.count=z,A.instanceMatrix.needsUpdate=!0,A.frustumCulled=!1,A.renderOrder=4,h.add(A),v0.bares=c}Te<2&&console.warn("to-the-brim: a glass stands within 2 m of the flown line",Te),v0.glasses=It,v0.clear.glass=Te,v0.look=o,v0.rare=!!d,v0.clear["a silver piece on a table"]=l0,Object.assign(v0.clear,o0);{const l=c=>(c.index?c.index.count:c.attributes.position.count)/3;v0.glassTris={};for(const c of["near","mid","far","speck"])v0.glassTris[c]=l(w.geometry[c].shell)+l(w.geometry[c].wine)}await t.yield();const Dt=Oe(w0),Rt=Oe(w0,26,!0),Ft=Oe(w0,26,!0,!0),Ht=Oe(w0,2.2,!0),st=[];let Ce=1e9,Le=1e9,qe=1e9,Ee=1e9;v0.chandeliersFine=0,v0.chandeliersNear=0;for(let l=0;l<2;l++){const c=new g.Group,b=[];for(let f0=l;f0<5;f0+=2)for(let u0=0;u0<5;u0++)b.push(Be[u0],14,Ot[f0]);for(let f0=l;f0<3;f0+=2)b.push(0,f0===2?20.5:17,-92-63*f0);const q=b.length/3,z=new g.InstancedMesh(Dt,D,q),A=new g.InstancedMesh(Rt,D,q),E=new g.InstancedMesh(Ft,D,q),G=new g.InstancedMesh(Ht,D,1);let K=0,V=0,Y=0,$=0;const c0=w.makeFlames(q*24),d0=new g.InstancedMesh(ae.geometry,U,q*24);for(let f0=0;f0<q;f0++){const u0=b[f0*3],b0=b[f0*3+1],q0=b[f0*3+2];E0.compose(ee.set(u0,b0,q0),$0.setFromAxisAngle(Ye,f0*.7),R0);let S0=1e9;for(let m0=5.6;m0<32.9;m0+=.75)S0=Math.min(S0,p.distanceTo(u0,b0+m0,q0));u0===0&&q0===-155?(G.setColorAt(Y,ge),G.setMatrixAt(Y++,E0)):S0<8?(E.setColorAt($,ge),E.setMatrixAt($++,E0)):p.distanceTo(u0,b0,q0)<11?(A.setColorAt(V,ge),A.setMatrixAt(V++,E0)):(z.setColorAt(K,ge),z.setMatrixAt(K++,E0));for(let m0=0;m0<24;m0++){const n0=m0/24*J-f0*.7,a0=u0+Math.cos(n0)*We,M0=q0+Math.sin(n0)*We,N0=f0*24+m0;c0.set(N0,a0,b0+.48+.6*w0,M0,.38*at,.14),Ce=Math.min(Ce,p.distanceTo(a0,b0+.6,M0)),Le=Math.min(Le,p.distanceTo(u0+Math.cos(n0)*4.145,b0+.2,q0+Math.sin(n0)*4.145)),E0.compose(ee.set(a0,b0+.64+.6*w0,M0),$0.identity(),R0.setScalar(.55)),d0.setMatrixAt(N0,E0),R0.set(1,1,1)}if(p.nearestXZ(u0,q0).dist<16){for(let m0=0;m0<24;m0++){const n0=m0*J/24;for(const[a0,M0]of[[3.95,.3],[3.33,1.07],[2.72,1.83],[2.1,2.6],[1.2,4.25]])qe=Math.min(qe,p.distanceTo(u0+Math.cos(n0)*a0,b0+M0,q0+Math.sin(n0)*a0))}for(let m0=5.6;m0<32.9;m0+=.75)Ee=Math.min(Ee,p.distanceTo(u0,b0+m0,q0)-(m0<6.9?.52:.12))}}v0.chandeliersFine+=V+Y,v0.chandeliersNear+=$;for(const[f0,u0]of[[z,K],[A,V],[E,$]])f0.count=u0,f0.instanceMatrix.needsUpdate=!0,f0.computeBoundingSphere(),f0.frustumCulled=!1,u0?c.add(f0):f0.dispose();Y?(G.instanceMatrix.needsUpdate=!0,G.frustumCulled=!1,c.add(G)):G.dispose(),c0.commit(),d0.instanceMatrix.needsUpdate=!0,d0.frustumCulled=!1,d0.renderOrder=4,c.add(c0.mesh,d0),h.add(c),st.push(c),await t.yield()}v0.clear["a chandelier, at its candles"]=Ce,v0.clear["a chandelier, at its hoop's outer rim"]=Le,v0.clear["a chandelier, at its rods"]=qe,v0.clear["a chandelier, at its crown and chain"]=Ee,Math.min(Ce,Le,qe,Ee)<3&&console.warn("to-the-brim: a chandelier hangs within 3 m of the flown line",Ce,Le,qe,Ee);for(const[l,c,b]of Ha()){let q=1e9;for(const z of b)q=Math.min(q,p.distanceTo(z[0],z[1],z[2]));q<c&&console.warn("to-the-brim: "+l+" comes within "+c+" m of the flown line",q),v0.clear[l]=q,b.length>40&&await t.yield()}await t.yield();const D0=await Uo(t,{palette:Wt,wine:i,look:o,routeLength:m,kit:w,light:!1});D0.object.position.set(0,3,-179),h.add(D0.object),D0.setLight(1,a.kitFill,a.kitFill?new g.Vector3().fromArray(a.fillDir):null,a.kitAmt),D0.setMetres(0),D0.great.uCool.value.setRGB(.05,.085,.16);{const l=D0.anchors.flames,c=new g.InstancedMesh(ae.geometry,U,l.length),b=D0.object.position;l.forEach((q,z)=>{E0.compose(ee.set(b.x+q.x,b.y+q.y+.05,b.z+q.z),$0.identity(),R0.setScalar(1.25)),c.setMatrixAt(z,E0)}),R0.set(1,1,1),c.instanceMatrix.needsUpdate=!0,c.frustumCulled=!1,c.renderOrder=4,h.add(c)}{const l=D0.object.position;for(const[c,b,q]of D0.bodies){let z=1e9;for(const A of q)z=Math.min(z,p.distanceTo(l.x+A[0],l.y+A[1],l.z+A[2])-A[3]);z<b&&console.warn("to-the-brim: "+c+" comes within "+b+" m of the flown line",z),v0.clear[c]=z,await t.yield()}v0.hero=D0.info}await t.yield();const Re=[];for(let l=0;l<60;l++)Re.push(v.posAtDist(m*l/59,new g.Vector3));{let l=0;const c=new g.Vector3,b=new g.Vector3,q=new g.Line3;for(let z=0;z<=M;z++){c.set(x[z*3],x[z*3+1],x[z*3+2]);const A=Math.min(Math.floor(z*59/M),58);let E=1e9;for(let G=Math.max(A-1,0);G<=Math.min(A+1,58);G++)q.set(Re[G],Re[G+1]).closestPointToPoint(c,!0,b),E=Math.min(E,b.distanceTo(c));l=Math.max(l,E)}v0.clear["a dust streak of the breath (by its rule of place)"]=3.5-.5-l,3.5-.5-l<2.2&&console.warn("to-the-brim: a dust streak of the breath could come within 2.2 m of the flown line",3.5-.5-l)}await t.yield();let Fe=null;const Bt={value:0};if(d){C.uGustTail.value=120;const l=Math.round(560*Math.max(s,.7)),c=e.fork("gust"),b=new Float32Array(l*4),q=new Float32Array(l);for(let E=0;E<l;E++)b.set([c.range(-33,33),c.range(3.6,14),c.range(-52,8),c.range(.35,.95)],E*4),q[E]=c();const z=new g.InstancedBufferGeometry,A=new g.PlaneGeometry(1,1);z.setIndex(A.index),z.setAttribute("position",A.attributes.position),z.setAttribute("uv",A.attributes.uv),z.setAttribute("aS",new g.InstancedBufferAttribute(b,4)),z.setAttribute("aK",new g.InstancedBufferAttribute(q,1)),z.instanceCount=l,Fe=new g.Mesh(z,new g.ShaderMaterial({uniforms:{...W,uLine:{value:Re},uGustS:Bt},vertexShader:sa,fragmentShader:na,...e0,side:g.DoubleSide})),Fe.frustumCulled=!1,Fe.renderOrder=6,h.add(Fe)}await t.yield();{const l=y0.fork("petals"),c=900,b=new Float32Array(c*16),q=new Float32Array(c*16),z=new Float32Array(c*4),A=[0,-92,0,-155,0,-218],E=new Float32Array(c*12),G=new Float32Array(c*8),K=[],V=[];{const S0=new g.Vector3;for(let m0=0;m0<=m;m0+=.25)v.posAtDist(m0,S0),V.push(S0.x,S0.z)}const Y=(S0,m0)=>{let n0=1e9;for(let a0=0;a0<V.length;a0+=2){const M0=V[a0]-S0,N0=V[a0+1]-m0,g0=M0*M0+N0*N0;g0<n0&&(n0=g0)}return Math.sqrt(n0)};for(const S0 of Ot)for(const m0 of Be)A.push(m0,S0);const $=(S0,m0,n0)=>{for(let a0=0;a0<A.length;a0+=2)if(Math.hypot(S0-A[a0],m0-A[a0+1])<4.4+n0)return!0;return!1},c0=[[384,33,9,-71,0],[192,16,-129,-187,1],[156,32,-73,-245,2],[168,32,238,11,2]];let d0=0,f0=1e9,u0=0;for(const[S0,m0,n0,a0,M0]of c0)for(let N0=0;N0<S0&&u0<2e4;u0++){const g0=l.range(-m0,m0),T0=l.range(a0,n0),Kt=l.range(.2,.45),ye=Kt*1.4143,it=l.range(.13,.2),Do=l.range(0,1)*l.range(0,1),Ro=l.range(1,1.6),Fo=l.range(0,1);if(M0===2&&Math.abs(g0)<18.5+ye&&T0<-126.5+ye&&T0>-189.5-ye||M0===1&&Math.hypot(g0+2.4,T0+179)<5.6+ye)continue;const Vt=Y(g0,T0)-ye-it*1.4143;if(Vt<2.3)continue;const G0=ye+it*1.4143,lt=Math.hypot(g0-_0.x,T0-_0.z);if($(g0,T0,G0)||lt<9.4+G0)continue;const He=Math.abs(g0),ft=He<19.2-G0&&T0<-120-G0&&T0>-196+G0;if(!ft&&He<23+G0&&T0<-117+G0&&T0>-199-G0)continue;const Ho=ft&&Math.abs(He-5)<1.5+G0&&T0<W0+2.2+G0&&T0>W0-3.2*(he-1)-2.2-G0,ct=M0===0?44.5:M0===1?25.4:29+13*(1-Math.abs(g0)/34),Bo=Math.abs(g0-11*X0(Math.round(g0/11),-2,2))<2.4+G0&&T0>20-G0&&T0<200+G0||Math.abs(He-26.5)<2.4+G0&&T0>-232-G0&&T0<-80+G0,Ut=.12+(Ho?6:ft||Bo?3:lt-G0<ne(0)?se(X0(Math.floor((ne(0)-(lt-G0))/1.9),0,_0.tiers-1)):0);for(let Z0=0;Z0<4;Z0++)z[d0*4+Z0]=Ut,b.set([g0,ct,T0,Kt],d0*16+Z0*4),q.set([(ct-Ut)/Ro,Fo,it,Do],d0*16+Z0*4),E.set([g0,ct*.5,T0],d0*12+Z0*3),G.set([Z0===1||Z0===2?1:0,Z0>1?1:0],d0*8+Z0*2);K.push(d0*4,d0*4+1,d0*4+2,d0*4,d0*4+2,d0*4+3),f0=Math.min(f0,Vt),d0++,N0++}const b0=new g.BufferGeometry;b0.setAttribute("position",new g.BufferAttribute(E,3)),b0.setAttribute("uv",new g.BufferAttribute(G,2)),b0.setAttribute("aS",new g.BufferAttribute(b,4)),b0.setAttribute("aK",new g.BufferAttribute(q,4)),b0.setAttribute("aF",new g.BufferAttribute(z,1)),b0.setIndex(K);const q0=new g.Mesh(b0,new g.ShaderMaterial({uniforms:{...g.UniformsUtils.clone(g.UniformsLib.fog),uTime:C.uTime,uPix:C.uPix,uFlameCol:C.uFlameCol,uTabI:H.uTabI,uChI:H.uChI,uPyI:H.uPyI,uGain:H.uGain,uChoir:H.uChoir},vertexShader:ra,fragmentShader:ia,transparent:!0,depthWrite:!1,fog:!0,side:g.DoubleSide}));q0.frustumCulled=!1,q0.renderOrder=5,h.add(q0),(d0<c||f0<2.3)&&console.warn("to-the-brim: the petals: fewer columns than dealt for, or one within 2.3 m of the flown line",d0,f0),v0.clear["a falling petal (its column, less its sway's whole reach and its own corner, in plan)"]=f0,v0.petals=d0}await t.yield();const nt=new g.Mesh(new g.SphereGeometry(900,24,14),new g.ShaderMaterial({uniforms:{...R,uTime:C.uTime},vertexShader:Qo,fragmentShader:$o,side:g.BackSide,depthWrite:!1}));nt.frustumCulled=!1,nt.renderOrder=-1,h.add(nt),await t.yield();{const l=F.smoke,c=[];let b=1e9;const q=(G,K,V,Y)=>{let $=1e9;for(let c0=0;c0<=16;c0++){const d0=1.3*(c0/16)*1.7;for(let f0=1;f0<=16;f0++){const u0=f0/16,b0=d0*u0*Y;$=Math.min($,p.distanceTo(G+1.06*.309*b0,K+u0*Y-.5*u0*b0,V+1.06*.951*b0)-(.08+.63*u0*u0)-.064*u0*u0*Y)}}return $};for(let G=0;G<l.length;G+=4){const K=l[G],V=l[G+1],Y=l[G+2];if(v.distanceTo(K,V,Y)>14){c.push(K,V,Y,l[G+3]);continue}for(const $ of[1,.75,.55,.4]){const c0=l[G+3]*$,d0=q(K,V,Y,c0);if(d0>=2.37){c.push(K,V,Y,c0),b=Math.min(b,d0-.07);break}}await t.yield()}b<2.3&&console.warn("to-the-brim: a smoke ribbon comes within 2.3 m of the flown line",b),v0.clear["a smoke ribbon"]=b;const z=Math.max(1,Math.floor(c.length/4*(s<.7?.5:1))),A=new g.PlaneGeometry(1,1,1,6);A.translate(0,.5,0);const E=new g.InstancedMesh(A,B,z);for(let G=0;G<z;G++)E0.compose(ee.set(c[G*4],c[G*4+1],c[G*4+2]),$0.identity(),R0.set(1,c[G*4+3],1)),E.setMatrixAt(G,E0);R0.set(1,1,1),E.instanceMatrix.needsUpdate=!0,E.frustumCulled=!1,E.renderOrder=6,h.add(E)}await t.yield();const Lo=[[[0,8.5,110],[58,11,200],950],[[16,12,-34],[46,16,100],850],[[0,8.5,-160],[40,10,96],900],[[0,9,-224],[30,15,44],500],[[0,9.5,-179],[15,9,15],420],[[14,11,-30],[40,16,58],1100]],rt=[];for(const[l,c,b]of Lo){const q=Vo.makeParticles({rng:e.fork("dust"+b),preset:"dust",follow:!1,center:l,box:c,count:Math.round(b*s*r),size:b===420?[.028,.06]:[.045,.1],colors:["#ffd9a0","#e8a23a","#fff0d0"],intensity:.95,velocity:[.05,.03,.12],turbulence:[.5,.25,.25]});h.add(q.object),rt.push(q),await t.yield()}const qo=m/50,jt=new g.Vector2,Eo=new g.Vector3(0,12,-30),Ao=D0.anchors.bowl.clone().add(D0.object.position),Go=new g.Vector3,No=D0.anchors.rim.clone().add(D0.object.position),Io=(l,c)=>Go.lerpVectors(Eo,Ao,B0(262,318,c*m)),_t=l=>X0(l,0,1);return{scene:h,path:v,duration:50,title:a.title,info:v0,pace:l=>ja(l*m)/qo,camera:{fov:50,near:.3,far:1400,lookAhead:22,sway:.35,bank:.3},pois:[{at:Io,from:140/m,to:372/m,weight:.6,fade:.2},{at:No,from:330/m,to:422/m,weight:.6,fade:18/92}],portal:{shape:"circle",radius:5.5,color:"#8fc4ff",glow:1.4,revealDistance:240,blendDistance:40},post:{exposure:a.exposure,bloom:{strength:.3,radius:.6,threshold:1},grade:{saturation:1.1,contrast:1,tint:a.tint,shadowTint:a.shadow,vignette:.34,grain:.02,aberration:0}},ride:"none",style:"none",update(l,c,b,q=0){const z=q*m;if(D0.setMetres(z),D0.update(l,c,b),d){const V=z<156?K0(-262,-40,_t((z-150)/6)):z<164?K0(-40,58,(z-156)/8):z<200?K0(58,130,(z-164)/36):K0(130,320,_t((z-200)/14)),Y=1.3*B0(143,150,z)*(1-B0(204,214,z));C.uGustZ.value=V,C.uGustM.value=z,C.uGustAmp.value=Y,Bt.value=Y*B0(164,168,z)*(1-B0(195,200,z)),C.uSurge.value=B0(158,172,z)*(1-B0(192,215,z))}const A=.2*Math.sin(c*.52),E=.14*Math.sin(c*.37+1),G=.2*Math.sin(c*.47+2.1),K=.14*Math.sin(c*.41+.4);st[0].position.set(A,0,E),st[1].position.set(G,0,K),H.uChSway.value.set(A,0,E),H.uChSway2.value.set(G,0,K),t.renderer.getDrawingBufferSize(jt),C.uPix.value=2*Math.tan((b.fov||50)*I/360)/Math.max(jt.y,1);for(let V=0;V<rt.length;V++)rt[V].update(l,c,b)},dispose(){h.traverse(l=>{l.isInstancedMesh&&l.dispose()}),D0.dispose(),Et.dispose(),At.dispose(),Gt.dispose();for(const l of Nt)l.dispose();Dt.dispose(),Rt.dispose(),Ft.dispose(),Ht.dispose()}}}};export{Ua as default};
