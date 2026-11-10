import*as n from"three";import{makePath as $o,clamp as ee,lerp as Q,smoothstep as L}from"../kit/core.js";import{buildHero as Xo,GLSL_COMMON as o0,chamferBox as X,domeGeo as po,leafGeo as I0,trs as g}from"../parts/paper-boat-rapids.js";const G=Math.PI,ae=G*2,d=n.Vector3,Zo={dusk:["#1A2130","#2A3152","#56607A","#9AA6BC","#F2A53A","#F5F1E6","#E5432F"],night:["#0F1422","#1B2140","#3C4560","#8490AA","#F2A53A","#F5F1E6","#E5432F"],dawn:["#252C3C","#48536E","#76829A","#B4BECE","#F4BC72","#F5F1E6","#E5432F"]},y0=25*G/180,Fe=300,qe=390,ge=(qe-Fe)/y0,G0=-ge,a0=900-qe,Ke=Math.cos(y0),Ee=Math.sin(y0),Q0=G0+ge*Ke,Y0=a0+ge*Ee,De=754;function ke(f,P){if(f>=qe)P.x=0,P.z=900-f,P.hx=0,P.hz=-1;else if(f>=Fe){const R=(qe-f)/ge,m=Math.cos(R),q=Math.sin(R);P.x=G0+ge*m,P.z=a0+ge*q,P.hx=q,P.hz=-m}else P.hx=Ee,P.hz=-Ke,P.x=Q0-(Fe-f)*Ee,P.z=Y0+(Fe-f)*Ke;return P}const F={x:0,z:0,hx:0,hz:-1},Jo={s:0,d:0};function Z(f,P,R,m){return ke(f,F),m.set(F.x-F.hz*P,R,F.z+F.hx*P)}function Se(f,P,R=Jo){if(P<=a0)return R.s=900-P,R.d=f,R;const m=f-G0,q=P-a0,Y=Math.atan2(q,m);if(Y>=0&&Y<=y0)return R.s=qe-Y*ge,R.d=Math.hypot(m,q)-ge,R;const U=f-Q0,le=P-Y0;return R.s=Fe+U*Ee-le*Ke,R.d=U*Ke+le*Ee,R}const ho=f=>20*ee(1-f/754,0,1.1),J=f=>ho(f)+6*(1-L(588,618,f)),fo=597,ea=615,pe=f=>ho(f)+6*(1-L(fo,ea,f)),b0=f=>15+30*L(415,435,f)*(1-L(555,575,f)),g0=f=>15+15*(1-L(45,75,f))+50*L(632,652,f)*(1-L(692,710,f)),n0=f=>f<410||f>580,vo=f=>{const P=Math.sin((f-615.5)*.349);return(P>0?2.2:1.2)*P*L(608,617,f)*(1-L(634,648,f))};function $0(f,P){const R=J(f);if(P>=0){const q=g0(f);return R-3+5.4*L(q-3,q+5,P)}if(n0(f))return P<-16.5?R+11.6:R-3;const m=b0(f);return R-3+5.4*L(m-3,m+5,-P)}const ta=(f,P)=>Math.sin(f*.023+1.3)*Math.sin(P*.019+.4)+.55*Math.sin(f*.047-P*.037+2.1)+.3*Math.sin(f*.011+P*.09),I=f=>Number(f).toFixed(4),B0=`
vec4 crs(float s){
  if (s >= ${I(qe)}) return vec4(0.0, 900.0 - s, 0.0, -1.0);
  if (s >= ${I(Fe)}) { float a = (${I(qe)} - s) / ${I(ge)}; float c = cos(a), n = sin(a); return vec4(${I(G0)} + ${I(ge)} * c, ${I(a0)} + ${I(ge)} * n, n, -c); }
  return vec4(${I(Q0)} - (${I(Fe)} - s) * ${I(Ee)}, ${I(Y0)} + (${I(Fe)} - s) * ${I(Ke)}, ${I(Ee)}, ${I(-Ke)});
}
float gBase(float s){ return 20.0 * clamp(1.0 - s / 754.0, 0.0, 1.1); }
float gW(float s){ return gBase(s) + 6.0 * (1.0 - smoothstep(597.0, 615.0, s)); }
float gG(float s){ return gBase(s) + 6.0 * (1.0 - smoothstep(588.0, 618.0, s)); }
float gWr(float s){ return 15.0 + 15.0 * (1.0 - smoothstep(45.0, 75.0, s)) + 50.0 * smoothstep(632.0, 652.0, s) * (1.0 - smoothstep(692.0, 710.0, s)); }
float gStand(float s){ float f = sin((s - 615.5) * 0.349); return mix(1.2, 2.2, step(0.0, f)) * f * smoothstep(608.0, 617.0, s) * (1.0 - smoothstep(634.0, 648.0, s)); }
`,He=o0+`
uniform vec3 uLP[2]; uniform vec3 uLC[2]; uniform float uLR[2]; uniform vec3 uSkyC; uniform vec3 uGndC; uniform float uRib; uniform vec3 uWash;
float qAtt(float d, float r){ float k = d / r; return 1.0 / (1.0 + k * k * k * k); }
vec3 qLamp(vec3 alb, vec3 N, vec3 V, vec3 P, vec3 Lp, vec3 Lc, float range, float sp, float sk){
  vec3 L = Lp - P; float d = length(L); L /= d;
  float nl = max(dot(N, L), 0.0);
  return Lc * qAtt(d, range) * (alb * nl + pow(max(dot(N, normalize(L + V)), 0.0), sp) * sk * step(0.0, nl));
}
// the stretched reflection of a lamp on a wet, roughly level surface (same term as the hero's water)
float qRibbon(vec3 R, vec3 P, vec3 Lp, float tight){
  vec3 Lv = Lp - P; float ld = length(Lv); vec3 L = Lv / ld;
  vec3 az = normalize(vec3(L.x, 0.0, L.z)), lat = vec3(az.z, 0.0, -az.x);
  float dl = dot(R, lat) - dot(L, lat), dv = R.y - L.y;
  return (exp(-dl * dl * tight) * exp(-dv * dv * 1.3) * step(0.0, dot(R, az)) + 3.0 * pow(max(dot(R, L), 0.0), 220.0)) / (1.0 + ld * ld / 360000.0);
}
vec3 qShade(vec3 alb, vec3 N, vec3 P, float rough){
  vec3 V = normalize(cameraPosition - P);
  float sp = mix(260.0, 10.0, sqrt(rough)), sk = (1.0 - rough) * (1.0 - rough) * 3.2;
  vec3 c = alb * mix(uGndC, uSkyC, 0.5 + 0.5 * N.y);
  c += qLamp(alb, N, V, P, uLampPos, uLampCol, 430.0, sp, sk);
  c += qLamp(alb, N, V, P, uLP[0], uLC[0], uLR[0], sp, sk);
  c += qLamp(alb, N, V, P, uLP[1], uLC[1], uLR[1], sp, sk);
  c += qLamp(alb, N, V, P, uShopP, uShopC, 300.0, sp * 0.35, sk * 0.3) * pbSS(-233.0, -222.0, P.x);       // the corner shop's window
  vec3 R = reflect(-V, N);
  float fr = 1.0 - max(dot(N, V), 0.0);
  c += uSkyC * 1.6 * fr * fr * fr * fr * fr * (1.0 - rough) * smoothstep(-0.1, 0.5, R.y);
  // the street's windows: a low amber wash on upright faces and an amber rim on every wet edge
  c += uWash * (alb * (0.4 + 0.9 * (1.0 - abs(N.y))) + 1.5 * fr * fr * fr * (1.0 - 0.6 * rough));
  return c;
}`,_e=`#include <common>
#include <fog_pars_vertex>
`,je=`#include <common>
#include <fog_pars_fragment>
`,S0=_e+`
attribute float aRough; varying vec3 vP; varying vec3 vN; varying vec3 vC; varying float vR; varying vec3 vO; varying vec2 vLf;
void main(){
  vec3 p = position, n = normal; vO = position; vLf = position.xz;
  #ifdef USE_INSTANCING
    mat3 im = mat3(instanceMatrix);
    n = im * (n / vec3(dot(im[0], im[0]), dot(im[1], im[1]), dot(im[2], im[2])));
    p = (instanceMatrix * vec4(p, 1.0)).xyz; vO = p;
  #endif
  vec4 wp = modelMatrix * vec4(p, 1.0); vP = wp.xyz; vN = normalize(mat3(modelMatrix) * n);
  vC = color; vR = aRough;
  #ifdef USE_INSTANCING_COLOR
    vC *= instanceColor;
  #endif
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,r0=je+He+B0+`
uniform float uThin; uniform float uFloor; uniform float uPrint; uniform float uPlain;
// the place along the course (s) of a point of the street (the inverse of crs)
float qS(vec2 p){
  if (p.y <= ${I(a0)}) return 900.0 - p.y;
  vec2 q = p - vec2(${I(G0)}, ${I(a0)}); float a = atan(q.y, q.x);
  if (a >= 0.0 && a <= ${I(y0)}) return ${I(qe)} - a * ${I(ge)};
  return ${I(Fe)} + (p.x - ${I(Q0)}) * ${I(Ee)} - (p.y - ${I(Y0)}) * ${I(Ke)};
}
varying vec3 vP; varying vec3 vN; varying vec3 vC; varying float vR; varying vec3 vO; varying vec2 vLf;
void main(){
  if (vR < 0.0) { gl_FragColor = vec4(vC * (-vR), 1.0); }
  else {
    vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
    float m = mix(pbFbm(vO.xz * 0.9 + vO.y * 0.7), 0.56, uPlain), g = mix(pbNoise(vO.xz * 6.0 + vO.yy * 5.0), 0.5, uPlain);
    vec3 alb = vC * (0.72 + 0.5 * m) * (0.9 + 0.2 * g);
    // (polish 3) kerb stones (aRough 2..3): wet speckled granite, dark mica and pale quartz flecks, drip
    // streaks down the face, a rain-glazed top
    float kind = floor(vR * 0.5 + 0.25), stone = step(0.5, kind) * step(kind, 1.5), rr = vR - 2.0 * kind;
    vec3 thrown = vec3(0.0);
    if (kind > 4.5) {
      // (repair 2) a plane leaf (aRough 10.x; 12.x the raft, twelve times the size): five pale midribs from the
      // stalk to the lobes' tips with fine side veins off them, the blade blotched and browner toward its
      // edge, and wet: glossy where the rain lies on it (its paler rim, where the water meets it, is in its
      // vertex colours)
      vec2 lf = vLf / mix(1.0, 12.0, step(5.5, kind));
      float lr = length(lf), la = atan(-lf.y, lf.x), da = abs(mod(la, 1.2566) - 0.6283);
      float across = lr * sin(da), along = lr * cos(da);
      float rib = smoothstep(0.016 * (1.0 - lr * 1.6) + 0.005, 0.002, across);
      float sv = smoothstep(0.012, 0.004, abs(fract(along * 10.0 - across * 7.0) - 0.5) * 0.082) * smoothstep(0.012, 0.04, across) * smoothstep(0.5, 0.2, lr);
      float blot = pbFbm(lf * 8.0 + vC.r * 30.0), speck = pbNoise(lf * 37.0 + 5.0);
      alb = vC * (0.66 + 0.62 * blot) * (1.0 - 0.28 * smoothstep(0.2, 0.5, lr)) * (1.0 - 0.3 * smoothstep(0.7, 0.86, speck));
      alb = mix(alb, alb * 1.55 + 0.03, max(rib, 0.55 * sv));
      rr = mix(0.36, 0.7, smoothstep(0.3, 0.7, blot));
      N = normalize(N + 0.3 * vec3(pbNoise(lf * 21.0) - 0.5, 0.0, pbNoise(lf * 21.0 + 9.0) - 0.5) + 0.25 * (rib - sv) * vec3(0.0, 1.0, 0.0));      // the wet blade is never one mirror: its gloss breaks into small glints
      kind = 0.0;
    }
    if (kind > 1.5 && kind < 3.5) {
      // (repair 2) folded paper (aRough 4.x the hull's sheets, 6.x sail and floor): no stone in it, only a soft
      // grain of fibres; the soaked band with its creeping, uneven edge and a tide line; and on the hull the
      // folds, each a fine shadow with a lit shoulder beside it that catches the lamps
      float fib = pbNoise(vO.xy * vec2(6.0, 23.0) + vO.z * 3.1) - 0.5, cl = pbNoise(vO.xy * 1.6 + vO.z * 1.2) - 0.5;
      alb = vC * (1.0 + 0.13 * fib + 0.12 * cl);
      float wick = 1.3 + 0.55 * (pbNoise(vec2(vO.x * 1.2 + vO.z * 0.8, 3.0)) - 0.5) + 0.2 * (pbNoise(vO.xz * 5.0) - 0.5);
      float soak = 1.0 - smoothstep(wick - 0.08, wick + 0.2, vO.y);
      alb *= mix(1.0, 0.55, soak) * (1.0 - 0.2 * exp(-pbSq((vO.y - wick - 0.16) / 0.08)));
      rr = mix(rr, 0.3, soak);
      if (kind < 2.5) {
        float ax = abs(vO.x), brim = 2.45 + 0.027 * vO.x * vO.x - vO.y, ends = smoothstep(4.6, 5.6, ax);
        float d0 = vO.x, d1 = ax - 3.5 + 0.1 * (vO.y + 0.6), d2 = brim - 0.62, d3 = vO.z;
        float fold = exp(-pbSq(d0 / 0.075)) + exp(-pbSq(d1 / 0.075)) + 0.8 * exp(-pbSq(d2 / 0.06)) * (1.0 - ends) + exp(-pbSq(d3 / 0.07)) * step(3.4, ax);
        float lit = exp(-pbSq((d0 - 0.17) / 0.1)) + exp(-pbSq((d1 - 0.17) / 0.1)) + 0.8 * exp(-pbSq((d2 + 0.14) / 0.08)) * (1.0 - ends);
        alb *= (1.0 - 0.42 * min(fold, 1.0)) * (1.0 + 0.3 * min(lit, 1.0) * (1.0 - soak));
        alb *= 1.0 + 0.1 * smoothstep(0.62, 0.5, brim) * (1.0 - ends) + 0.35 * smoothstep(0.09, 0.02, brim);      // the turned brim is double paper; its cut edge is pale
      }
    }
    if (stone > 0.5) {
      float f1 = pbNoise(vP.xz * 7.0 + vP.y * 5.3), f2 = pbNoise(vP.zx * 13.0 - vP.y * 9.1 + 31.0), mt = pbFbm(vP.xz * 0.22 + vP.y * 0.31);
      float face = 1.0 - smoothstep(0.3, 0.7, abs(N.y)), al = vP.z + vP.x * 0.35;
      float drip = pbSS(0.56, 0.8, pbNoise(vec2(al * 0.5, 2.7))) * pbSS(0.2, 0.6, pbNoise(vec2(al * 0.5 + 40.0, vP.y * 0.1))) * face;
      alb *= (0.7 + 0.62 * mt) * (1.0 - 0.55 * pbSS(0.64, 0.8, f1)) * (1.0 + 1.1 * pbSS(0.68, 0.86, f2));
      alb = mix(alb, alb * vec3(0.42, 0.45, 0.55), drip * 0.85);
      rr *= mix(1.0, mix(0.7, 0.25, step(2.38, vR)), max(drip, (1.0 - face) * (0.5 + 0.5 * mt)));      // (repair 2: the rapid's cobbles, 2.3, are wet but not glazed: no white glare beside the tongue)
      // (repair 2) a kerb face is never one dark tone: the lit water throws its light up the stone in a slow
      // rippling net (strongest at the waterline, gone by the arris), the tooled face shows its strokes and a
      // darker soaked foot, each drip has a wet glint down its middle, and the rounded arris along the top
      // edge carries a wet amber line (all of it the street's own amber: the lamps and the windows' wash)
      float sK = qS(vP.xz), hw = vP.y - gW(sK), tool = pbFbm(vec2(sK * 1.3, vP.y * 0.7 + 9.0));
      vec3 glow = uLampCol * qAtt(distance(uLampPos, vP), 300.0) * 0.8 + uLC[0] * qAtt(distance(uLP[0], vP), uLR[0] * 1.3) + uLC[1] * qAtt(distance(uLP[1], vP), uLR[1]) + uWash * 1.2;
      float n1 = pbNoise(vec2(sK * 0.42 + uTime * 0.45, vP.y * 0.5 - uTime * 0.3)), n2 = pbNoise(vec2(sK * 0.3 - uTime * 0.35 + 17.0, vP.y * 0.36 + uTime * 0.2));
      // (repair 3) the kerb along the run, varied as a street's kerb is: the water's net of light is soft and
      // stays by the water (it climbs a third of the face and fades; it was a hard scribble over the whole
      // wall); the soaked foot stands higher here and lower there; the top arris is chipped in places (a
      // shallow bite out of the edge and a little way down the face, dull and dry-looking) and the wet
      // shine of the lamps runs along it between the chips, brighter where the rain lies deeper on the top
      float net = (pbSS(0.17, 0.0, abs(n1 - n2)) + 0.4 * pbSS(0.12, 0.0, abs(n1 + n2 - 1.0))) * pbSS(5.5, 0.5, hw + 1.5 * (mt - 0.5));
      float reach = face * (0.3 + 0.7 * pbSS(10.0, 0.4, hw)) * pbSS(-0.6, 0.6, hw);
      float kst = step(2.38, vR), ht = gG(sK) + 12.0 - vP.y, arris = kst * pbSS(0.3, 0.55, N.y) * pbSS(0.97, 0.8, N.y);
      float chipN = pbSS(0.56, 0.7, pbNoise(vec2(sK * 0.8, 4.0))) * pbSS(0.42, 0.62, pbNoise(vec2(sK * 0.19 + 8.0, 1.0)));
      float chipD = 1.25 + 1.7 * chipN, chipK = kst * pbSS(0.0, 0.25, chipN) * step(-0.6, ht), bite = chipK * pbSS(chipD, chipD - 0.45, ht);
      float wetTop = 0.3 + 0.6 * pbSS(0.3, 0.75, pbNoise(vec2(sK * 0.13, 7.0)));
      alb *= (0.88 + 0.24 * tool) * mix(1.0, 0.62, face * pbSS(2.6, 0.2, hw - 2.6 * pbNoise(vec2(sK * 0.06, 12.0)) + 1.2 * (mt - 0.5))) * mix(1.0, 0.5 + 0.35 * f1, bite);
      rr = mix(rr, 0.85, bite);
      thrown = glow * (alb * reach * (0.26 + 0.55 * net * reach) + face * drip * 0.22 * pbSS(0.7, 0.86, pbNoise(vec2(al * 0.5, 2.7)))
        + wetTop * arris * (1.0 - bite) * (0.5 + 0.8 * f2));      // (the arris: kerb stones only, 2.4 and up; the cobbles of the rapid are 2.3)
      // (round 2) beside the rapid the white water lights the stone: the foam's pale light is thrown up the kerb's
      // face (and the tilted cobble's flank) from the lip to the end of the standing waves, so the wall behind the
      // boats there is wet lit granite with its joints and drips, not a dark block
      float fw = pbSS(578.0, 594.0, sK) * (1.0 - pbSS(644.0, 664.0, sK));      // (from the first stone of the resumed kerb, s 580: it stands beside the lip)
      // (repair 3) less of it, and laid on evenly: the wall beside the rapid stands back in tone, a quiet wet stone
      // behind the boats (it was as pale as the paper and scribbled with light, and the hulls were lost against it)
      thrown += alb * (uSkyC * 2.4 + glow) * fw * face * 0.36 * pbSS(24.0, 3.0, hw);
    }
    // newsprint: columns of grey type, a heavier headline band
    float ink = step(0.38, fract(vO.y * 2.6)) * step(0.14, fract(vO.x * 0.62 + 0.07)) * step(0.3, pbNoise(vec2(vO.x * 3.1, floor(vO.y * 2.6) * 7.3)));
    alb *= 1.0 - uPrint * (0.55 * ink + 0.3 * step(0.86, fract(vO.x * 0.31 + vO.y * 0.11)));
    // (repair 2) what looks down at the wet street is lit by it: the amber lying on the water and the wet stones
    // comes back up under the tram's frame, its wheels' rims, a hull's turn
    thrown += (alb + 0.04 * (1.0 - rr)) * max(-N.y, 0.0) * (uWash * 3.0 + uLC[1] * qAtt(distance(uLP[1], vP), uLR[1]) * 0.4
      + uLampCol * qAtt(distance(uLampPos, vP), 430.0) * 0.25 + uLC[0] * qAtt(distance(uLP[0], vP), uLR[0]) * 0.25);
    vec3 c = qShade(alb, N, vP, clamp(rr * (0.6 + 0.9 * m), 0.08, 1.0)) + alb * uFloor + thrown;
    if (kind > 3.5) {
      // (repair 2) a raindrop (aRough 8.x) is a lens of clear water, the styleNote's 'spheres big enough to see':
      // pale and bright, the light it gathers lying as a crescent in its lower half, a thin darker edge above
      // that keeps it round, the sky on its rim and the lamps' hot points on its skin (never a dark olive)
      vec3 Vd = normalize(cameraPosition - vP); float rim = 1.0 - max(dot(N, Vd), 0.0);
      vec3 lampAll = uLampCol * qAtt(distance(uLampPos, vP), 430.0) + uLC[0] * qAtt(distance(uLP[0], vP), uLR[0]) + uLC[1] * qAtt(distance(uLP[1], vP), uLR[1]) + uWash * 3.0;
      float cres = smoothstep(0.1, -0.85, N.y), cap = smoothstep(0.2, 0.9, N.y);
      c = vC * (0.8 + 1.5 * cres) + lampAll * (0.16 + 0.5 * cres + 0.12 * cap) + uSkyC * 2.2 * rim * rim * rim;
      c *= 1.0 - 0.4 * smoothstep(0.72, 0.9, rim) * (1.0 - cres);
      c += qShade(vec3(0.0), N, vP, 0.03);
    }
    // thin things (paper, leaves, petals) let the lamps glow through from behind
    c += uThin * alb * (uLampCol * qAtt(distance(uLampPos, vP), 430.0) * max(dot(-N, normalize(uLampPos - vP)), 0.0)
                      + uLC[0] * qAtt(distance(uLP[0], vP), uLR[0]) * max(dot(-N, normalize(uLP[0] - vP)), 0.0)
                      + uLC[1] * qAtt(distance(uLP[1], vP), uLR[1]) * max(dot(-N, normalize(uLP[1] - vP)), 0.0)
                      + uShopC * qAtt(distance(uShopP, vP), 300.0) * max(dot(-N, normalize(uShopP - vP)), 0.0));
    gl_FragColor = vec4(c, 1.0);
  }
  #include <fog_fragment>
}`,oa=_e+`
attribute vec2 aK; varying vec3 vP; varying vec3 vNg; varying vec2 vK;
void main(){ vP = position; vNg = normal; vK = aK;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,aa=je+He+`
uniform vec3 uCob; uniform vec3 uViolet; uniform vec3 uPale; uniform vec3 uDirt; uniform vec3 uMoss; uniform vec3 uFlag;
varying vec3 vP; varying vec3 vNg; varying vec2 vK;
void main(){
  vec3 N = normalize(vNg), alb; float rough, pud = 0.0;
  float dist = distance(cameraPosition, vP);
  if (vK.x > 0.5) {                       // pavement: big wet flagstones, each with its own sheen, dark joints
    vec2 fq = vP.xz / vec2(66.0, 46.0); fq.x += 0.5 * floor(fq.y); vec2 fi = floor(fq), ff = abs(fract(fq) - 0.5);
    float fh = pbHash(fi * 1.31 + 4.7), joint = smoothstep(0.455, 0.49, max(ff.x, ff.y)) * (1.0 - smoothstep(300.0, 700.0, dist));
    alb = uFlag * (0.8 + 0.4 * pbFbm(vP.xz * 0.05)) * (0.78 + 0.5 * fh) * (1.0 - 0.5 * joint); rough = mix(0.2 + 0.4 * fract(fh * 7.7), 0.7, joint);
    N = normalize(N + vec3(0.05 * (fh - 0.5), 0.0, 0.05 * (fract(fh * 3.3) - 0.5)));
  }
  else {
    float P = 10.6, r = floor((vP.z + 122.0) / P + 0.5);
    vec2 c = vec2(12.0 + mod(r, 2.0) * P * 0.5, -122.0 + r * P); c.x += floor((vP.x - c.x) / P + 0.5) * P;
    vec2 q = (vP.xz - c) / 4.8; float h = pbHash(c * 0.37 + 1.7);
    float rho = pow(pow(abs(q.x), 4.0) + pow(abs(q.y), 4.0), 0.25) * (0.9 + 0.2 * fract(h * 3.9));
    float dome = 1.0 - smoothstep(0.82, 1.04, rho);
    vec3 cob = mix(uCob, mix(uViolet, uPale, step(0.5, h)), 0.34 * fract(h * 7.3)) * (0.62 + 0.7 * fract(h * 13.7)) * (0.78 + 0.5 * pbFbm(vP.xz * 0.012 + 11.0));
    float moss = smoothstep(0.35, 0.7, pbFbm(vP.xz * 0.035 + 3.0));
    alb = mix(mix(uDirt, uMoss, moss * 0.8), cob, dome); rough = mix(0.7, 0.26 + 0.22 * fract(h * 5.1), dome);
    float k = smoothstep(0.25, 1.0, rho) * 1.3 * dome * (1.0 - smoothstep(220.0, 620.0, dist));
    float bed = smoothstep(1.2, -0.8, vK.y);
    alb = mix(alb, uDirt * 0.8, bed); rough = mix(rough, 0.5, bed);
    // puddles (polish 2): hollows where the stones lie under a flat film that mirrors the sky and the lamps
    pud = sin(vP.x * 0.023 + 1.3) * sin(vP.z * 0.019 + 0.4) + 0.55 * sin(vP.x * 0.047 - vP.z * 0.037 + 2.1) + 0.3 * sin(vP.x * 0.011 + vP.z * 0.09);
    pud = pbSS(0.56, 0.72, pud + 0.3 * (pbFbm(vP.xz * 0.06) - 0.5)) * (1.0 - bed);
    alb = mix(alb, uDirt * 0.5 + cob * 0.3 * dome, pud * 0.85); rough = mix(rough, 0.04, pud);
    N = normalize(N + vec3(q.x, 0.0, q.y) * k * (1.0 - bed) * (1.0 - pud));
  }
  float m = pbFbm(vP.xz * 0.9);
  alb *= (0.72 + 0.5 * m);
  vec3 col = qShade(alb, N, vP, clamp(rough * (0.6 + 0.9 * m), 0.08, 1.0));
  // wet film: the lamps' long broken reflections
  vec3 V = normalize(cameraPosition - vP), R = reflect(-V, normalize(mix(vec3(0.0, 1.0, 0.0), N, 0.55)));
  float wet = (1.0 - rough) * (0.5 + 0.8 * m) * step(0.5, N.y);
  float frp = 1.0 - max(dot(N, V), 0.0); col += pud * (uSkyC * 0.55 + uWash * 1.6) * (0.1 + 0.9 * frp * frp);
  col += wet * uRib * (uLampCol * qRibbon(R, vP, uLampPos, 70.0) + uLC[0] * qRibbon(R, vP, uLP[0], 70.0) + uLC[1] * 0.6 * qRibbon(R, vP, uLP[1], 30.0)
                      + uShopC * 0.6 * qRibbon(R, vP, uShopP, 30.0) * qAtt(distance(uShopP, vP), 520.0));
  // (repair 3) the lamp's amber pooled on the wet road round its foot (the same pool as on the drain's own stones)
  col += uLampCol * exp(-(pbSq(vP.x - 10.0) + pbSq(vP.z + 70.0)) / 22500.0) * 0.05 * (1.0 - rough) * (0.5 + m) * step(0.5, N.y);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,na=_e+o0+B0+`
attribute vec2 aSD; attribute vec4 aA; attribute vec2 aHd;
uniform vec3 uSurge; uniform vec4 uSplash;
varying vec3 vP; varying vec2 vSD; varying vec4 vA; varying vec2 vHd; varying float vLift;
void main(){
  vec3 p = position; vec2 q = vec2(aSD.y, 900.0 - aSD.x);
  float sg = uSurge.y * exp(-pbSq((aSD.x - uSurge.x) / uSurge.z));
  float rr = distance(p.xz, uSplash.xy), R = uSplash.z * 70.0;
  float sw = uSplash.w * sin((rr - R) * 0.35) * exp(-pbSq((rr - R) / 12.0));
  vLift = sg * 0.2 + abs(sw) * 0.6 + abs(gStand(aSD.x)) * 0.55;
  p.y += (pbNoise(q * 0.11 + vec2(0.0, uTime * 0.9)) - 0.5) * 0.55 * min(aA.x * 0.2, 1.0) + gStand(aSD.x) + sg + sw
       + aA.y * 0.14 * sin(aSD.x * 0.9 + aSD.y * 0.5 - uTime * 7.0) * (1.0 - pbSS(593.0, 598.0, aSD.x) * (1.0 - pbSS(613.0, 618.0, aSD.x)));
  vP = p; vSD = aSD; vA = aA; vHd = aHd;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ra=je+He+B0+`
uniform vec3 uSkyLo; uniform vec3 uSkyHi; uniform vec3 uDeep; uniform vec3 uCream;
uniform vec3 uSurge; uniform vec3 uBoat[3]; uniform vec3 uBoatD[3]; uniform vec4 uStrip; uniform vec3 uStripC; uniform vec3 uPipe; uniform vec4 uSplash; uniform vec3 uCoin; uniform float uIce; uniform float uRainK; uniform float uWin; uniform float uRush;
varying vec3 vP; varying vec2 vSD; varying vec4 vA; varying vec2 vHd; varying float vLift;
float wRings(vec2 p){
  vec2 c = floor(p / 15.0), f = p / 15.0 - c;
  float h = pbHash(c), t = fract(uTime * 0.6 + h);
  vec2 o = vec2(pbHash(c + 3.1), pbHash(c + 7.7)) * 0.5 + 0.25;
  float d = length(f - o) * 15.0, r = t * 6.5;
  return sin((d - r) * 2.4) * exp(-abs(d - r) * 0.9) * (1.0 - t) * (1.0 - t);
}
float wH(vec2 p, float spd){
  float t = uTime * 0.8, a = fract(t), b = fract(t + 0.5), w = abs(1.0 - 2.0 * a);
  vec2 f = vec2(0.0, -1.0);
  vec2 q1 = p - f * spd * (a - 0.5) * 1.25, q2 = p - f * spd * (b - 0.5) * 1.25 + 17.3;
  float h1 = pbFbm(q1 * 0.2) + 0.35 * pbNoise(q1 * 0.75);
  float h2 = pbFbm(q2 * 0.2) + 0.35 * pbNoise(q2 * 0.75);
  return mix(h1, h2, w) + 0.3 * uRainK * wRings(p);
}
void main(){
  vec2 p = vec2(vSD.y, 900.0 - vSD.x); float spd = vA.x * uRush, e = 0.35, h0 = wH(p, spd);
  float str = 0.75 + 0.9 * vA.y;
  vec3 Nl = vec3(-(wH(p + vec2(e, 0.0), spd) - h0) / e * str, 1.0, -(wH(p + vec2(0.0, e), spd) - h0) / e * str);
  // the rapid has a shape of its own: the tongue's fall and the standing waves tilt the surface (before, the
  // rapid was shaded as if it lay flat, which is why its foam read as a slab); the tongue itself runs glassy
  float sR = vSD.x, tongue = pbSS(595.0, 599.0, sR) * (1.0 - pbSS(612.0, 616.5, sR));
  Nl.xz *= mix(1.0, 0.4, tongue);
  Nl.z += (gW(sR + 0.4) + gStand(sR + 0.4) - gW(sR - 0.4) - gStand(sR - 0.4)) * 1.25;
  vec2 rt = vec2(-vHd.y, vHd.x);
  // surface tension: the water bulges against kerb, cobbles, paper and leaf
  float menL = pbSS(2.2, 0.2, vA.z), menR = pbSS(2.2, 0.2, vA.w), men = menL + menR;
  Nl.x += (menR - menL) * 0.9;
  vec3 N = vec3(Nl.x * rt.x - Nl.z * vHd.x, Nl.y, Nl.x * rt.y - Nl.z * vHd.y);
  float hull = 0.0, wake = 0.0, occ = 1.0;
  for (int i = 0; i < 3; i++) {
    vec2 v = vP.xz - uBoat[i].xy; float r0 = length(v) + 1e-3;
    float r = length(vec2(dot(v, uBoatD[i].xy) * uBoatD[i].z, dot(v, vec2(-uBoatD[i].y, uBoatD[i].x)))) + 1e-3;
    float ring = exp(-pbSq((r - uBoat[i].z) / 1.1)); hull += ring;
    float lx = dot(v, uBoatD[i].xy), ly = abs(dot(v, vec2(-uBoatD[i].y, uBoatD[i].x)));
    wake += step(lx, 0.0) * exp(-pbSq((ly - uBoat[i].z * 0.8 + lx * 0.28) / 0.9)) * exp(lx * 0.09) * pbSS(uBoat[i].z * 0.8, uBoat[i].z * 1.6, r0);
    N.xz += v / r0 * (ring * 1.3 + sin(r * 1.4 - uTime * 7.0) * exp(-r * 0.11) * 0.2 * step(uBoat[i].z, r));
    occ *= 1.0 - 0.78 * pbSS(uBoat[i].z * 3.4, uBoat[i].z * 1.3, r);      // (polish 3) a hull blocks the lamp's ribbon: dark water round it, the boat stays solid
  }
  float pr = distance(vP.xz, uPipe.xy);
  N.xz += (vP.xz - uPipe.xy) / (pr + 0.01) * sin(pr * 1.1 - uTime * 9.0) * exp(-pr * 0.07) * 0.5 * uPipe.z;
  float rr = distance(vP.xz, uSplash.xy), SR = uSplash.z * 70.0, sring = uSplash.w * exp(-pbSq((rr - SR) / 9.0));
  N.xz += (vP.xz - uSplash.xy) / (rr + 0.01) * sring * 0.6;
  N = normalize(N);
  vec3 V = normalize(cameraPosition - vP);
  float fr = 0.035 + 0.965 * pow(clamp(1.0 - max(dot(N, V), 0.0), 0.0, 1.0), 5.0);
  vec3 R = reflect(-V, N);
  // water that slopes away from the lens (the tongue's face, the back of a standing wave) mirrors the water
  // below it, not the sky: it stays dark glass, and only its highlights are bright
  float away = pbSS(-0.02, -0.3, R.y) * pbSS(594.0, 598.0, sR) * (1.0 - pbSS(646.0, 652.0, sR));
  R.y = abs(R.y);
  vec3 col = mix(uDeep * (0.55 + 0.5 * h0), mix(mix(uSkyLo, uSkyHi, clamp(R.y * 1.3, 0.0, 1.0)), uDeep * 1.5 + uSkyLo * 0.35, away * 0.85), fr);
  // lit windows mirrored as soft amber dabs at grazing angles
  col += uLampCol * uWin * fr * pbSS(0.62, 0.9, pbNoise(vec2(p.x * 0.05 + R.x * 4.0, p.y * 0.012))) * 0.16;
  // a dropped coin on the bed of the still pool
  vec2 cq = vSD - uCoin.xy + (N.xz) * 2.5; float coin = pbSS(3.3, 2.5, length(cq)) * uCoin.z;
  col += (uLampCol * 0.35 + uSkyHi) * coin * (1.0 - fr) * (0.6 + 0.4 * sin(cq.x * 3.0 + cq.y * 2.0));
  float nearK = mix(0.45, 1.0, pbSS(8.0, 45.0, distance(cameraPosition, vP)));      // (polish 2) no glare sheet right under the lens
  occ *= 1.0 - 0.6 * max(away, tongue * 0.7);
  col += uLampCol * (occ * qRibbon(R, vP, uLampPos, 190.0) * mix(0.75, 1.3, smoothstep(640.0, 754.0, vSD.x)) * mix(nearK, mix(0.6, 1.0, nearK), smoothstep(640.0, 754.0, vSD.x)) + 0.012 * pbLampAtt(distance(uLampPos, vP)));
  col += occ * (uLC[0] * qRibbon(R, vP, uLP[0], 190.0) * 0.8 * nearK + uLC[1] * qRibbon(R, vP, uLP[1], 60.0) * 0.3);
  col += uShopC * qRibbon(R, vP, uShopP, 200.0) * 0.35 * qAtt(distance(uShopP, vP), 520.0);
  // the tram's window strip: one bar of amber per window, lying on the water beside the cars and sweeping
  // across the sheet (and the boats) with them, the cars' own shadow between
  { vec2 sv = vP.xz - uStrip.xy, sh = vec2(cos(uStrip.z), -sin(uStrip.z)); float la = dot(sv, sh), lt = abs(dot(sv, vec2(-sh.y, sh.x)));
    float bar = 0.5 + 0.5 * sin(la * 0.1745 + 1.5708);
    col += uStripC * uStrip.w * occ * pbSS(360.0, 290.0, abs(la)) * pbSS(58.0, 80.0, lt) * exp(-max(lt - 75.0, 0.0) * 0.011) * (0.16 + 0.84 * bar * bar) * (0.45 + 0.55 * h0); }
  // foam: banks, rapids, rail grooves, the downpipe's boil, hull wakes, the splash ring
  float bank = men * pbSS(0.5, 0.8, pbNoise(p * 0.8 + vec2(0.0, uTime * 2.0)));
  float rapid = pbSS(595.0, 599.0, sR) * (1.0 - pbSS(647.0, 655.0, sR));
  float fast = pbSS(0.25, 1.0, vA.y + vLift * 0.5) * pbSS(0.5, 0.85, pbNoise(vec2(p.x * 0.7, p.y * 0.22 + uTime * (1.0 + spd * 0.12)))) * (1.0 - rapid);
  // white water drawn as white water (the design: 'a rapid over one broken, tilted cobble ... bow up and slapping
  // down through two standing waves'): a breaking roller at the tongue's foot, foam on the second crest, foam
  // carried down behind each, a collar round the cobble
  float wob = (pbNoise(vec2(p.x * 0.45, uTime * 0.9)) - 0.5) * 3.0 + (pbNoise(vec2(p.x * 1.7 + 5.0, uTime * 1.7)) - 0.5) * 1.6 + (pbNoise(vec2(p.x * 4.3 + 9.0, uTime * 2.3)) - 0.5) * 0.9;
  float rockR = mix(3.0, 7.2, pbSS(598.0, 611.0, sR)), rockD = length(vec2((sR - 606.0) * 0.92, vSD.y - 10.0));
  // (round 2) one cobble only; in the lee between the standing waves, against the kerb, an eddy: one foam line wound slowly round
  vec2 ev = vec2(sR - 629.0, vSD.y + 11.0); float ed = length(ev);
  float collar = exp(-pbSq((rockD - rockR - 0.5) / 1.1)) * pbSS(597.0, 600.0, sR) * (1.0 - pbSS(613.0, 617.0, sR)) * 0.8
               + pbSS(0.45, 0.95, 0.5 + 0.5 * sin(atan(ev.y, ev.x) + ed * 1.5 - uTime * 1.3)) * pbSS(4.6, 3.0, ed) * pbSS(0.3, 1.2, ed) * 0.62;
  // (repair 3) the foam is drawn, not sprinkled: it was one pale patch cut into hard white cells with dark specks.
  // Now each fall of white water has a front edge of soft lobes (the roller at the tongue's foot, the second
  // crest), and behind it the foam is combed out by the flow into long lines that slide downstream and thin as
  // they go; fine lines run down the tongue's own face; every edge is soft
  float lob = abs(sin(p.x * 0.62 + 2.4 * pbNoise(vec2(p.x * 0.21, uTime * 0.35)))), lob2 = abs(sin(p.x * 0.8 + 1.7 + 2.0 * pbNoise(vec2(p.x * 0.25 + 4.0, uTime * 0.3))));
  float jd = sR + 0.5 * wob - (612.6 + 3.4 * lob), cd2 = sR + 0.5 * wob - (634.4 + 2.6 * lob2);
  float ln1 = pbSS(0.32, 0.7, pbNoise(vec2(p.x * 1.5, sR * 0.11 - uTime * (0.9 + spd * 0.03)))), ln2 = pbSS(0.4, 0.75, pbNoise(vec2(p.x * 4.2 + 3.0, sR * 0.27 - uTime * (1.5 + spd * 0.05))));
  // (each line of foam behind a roller has its own length, 5 to 17 units for the first and 3 to 9 for the second,
  // so the foam ends downstream in fingers, and the froth itself is clotted, thick here and open there)
  float fl1 = mix(5.0, 17.0, pbNoise(vec2(p.x * 0.9, uTime * 0.2))), fl2 = mix(3.0, 9.0, pbNoise(vec2(p.x * 1.1 + 6.0, uTime * 0.25)));
  float froth = 0.5 + 0.5 * pbSS(0.3, 0.7, pbFbm(vec2(p.x * 0.8, sR * 0.45 - uTime * (1.4 + spd * 0.04))));
  float roller = pbSS(-0.4, 1.0, jd) * (1.0 - pbSS(1.6, 5.5, jd)), tail1 = pbSS(1.0, 4.0, jd) * (1.0 - pbSS(fl1 * 0.45, fl1, jd)) * (1.0 - pbSS(631.0, 636.0, sR));
  float roll2 = pbSS(-0.4, 0.9, cd2) * (1.0 - pbSS(1.2, 4.0, cd2)) * 0.8, tail2 = pbSS(0.8, 3.0, cd2) * (1.0 - pbSS(fl2 * 0.45, fl2, cd2));
  float tface = tongue * pbSS(0.6, 0.86, pbNoise(vec2(p.x * 2.3 + 11.0, sR * 0.07 - uTime * 1.9))) * 0.4;
  float wsoft = rapid * clamp(max(max(roller, roll2) * (0.55 + 0.25 * ln2 + 0.2 * froth), max((tail1 + tail2) * froth * (0.3 + 0.45 * ln1 + 0.25 * ln1 * ln2), max(collar * (0.45 + 0.55 * ln1), tface))), 0.0, 1.0);
  float white = wsoft, bubble = 0.62 + 0.14 * pbNoise(vec2(p.x * 0.9, sR * 0.5 - uTime * 2.0)) + 0.1 * ln2;      // (the foam's own soft shading: cream in the street's light, never a white sheet)
  float rail = (exp(-pbSq((vSD.x - 445.0) / 2.2)) + exp(-pbSq((vSD.x - 545.0) / 2.2))) * (0.4 + 0.6 * pbNoise(vec2(p.x * 0.5 - uTime * 3.0, p.y)));
  float boil = uPipe.z * pbSS(15.0, 2.0, pr) * (0.35 + 0.65 * pbNoise(vP.xz * 0.6 + uTime * 3.0));
  float foam = clamp(bank * 0.5 + fast * 0.7 + rail * 0.6 + boil + hull * 0.5 + wake * 0.5 * pbSS(0.3, 0.7, pbNoise(p * 0.9 + vec2(0.0, uTime * 1.5))) + sring * 0.6 * pbSS(0.35, 0.8, pbNoise(vP.xz * 0.4)), 0.0, 0.85);
  foam = max(foam, white * 0.96);
  // (repair 3) the wave that lifts us carries a foam line (the journey: 'its wake surge lifts us over the rail
  // grooves'): a ragged line of soft lobes along its crest, where the hull rides, wisps of it trailing down its back
  // (it is lit as the rapid's white water is: left in the plain foam's dim tone it lay on the amber sheet as a dull line)
  float sgk = clamp(uSurge.y / 1.3, 0.0, 1.0), sgd = sR - (uSurge.x - 0.2 * uSurge.z) - 2.0 * lob;
  // (a line, not a band: narrow, broken here and there along its length, an older, thinner line left a little behind it)
  float sgap = pbSS(0.22, 0.5, pbNoise(vec2(p.x * 0.45 + 2.0, uTime * 0.25))), sgap2 = pbSS(0.3, 0.6, pbNoise(vec2(p.x * 0.6 + 9.0, uTime * 0.2)));
  float sfoam = 0.95 * sgk * max(max(pbSS(0.9, 0.15, abs(sgd)) * sgap * (0.7 + 0.3 * ln2), 0.7 * pbSS(0.6, 0.1, abs(sgd + 3.0 - 1.5 * lob2)) * sgap2),
    0.4 * pbSS(-9.0, -1.0, sgd) * pbSS(0.4, -1.0, sgd) * ln1 * ln2);
  foam = max(foam, sfoam);
  // the tongue: a curled glassy lip, amber on its face, combed by the flow
  { float la = pbLampAtt(distance(uLampPos, vP)), curl = exp(-pbSq((sR - 598.4) / 1.0));
    float comb = pbSS(0.58, 0.9, pbNoise(vec2(p.x * 3.4, p.y * 0.1 + uTime * 2.5))) + 0.6 * pbSS(0.66, 0.92, pbNoise(vec2(p.x * 8.0 + 3.0, p.y * 0.16 + uTime * 3.4)));
    col += (uSkyHi * 0.3 + uLampCol * (0.02 + 0.12 * la)) * curl * (0.4 + 0.6 * pbNoise(vec2(p.x * 1.3, uTime * 0.8)));
    col += tongue * ((uLampCol * (0.012 + 0.07 * la)) * (0.4 + 0.8 * h0) + (uSkyHi * 0.12 + uLampCol * (0.01 + 0.09 * la)) * comb); }
  col = mix(col, uCream * (uSkyC * 1.15 + uLampCol * (0.02 + 0.3 * pbLampAtt(distance(uLampPos, vP))) + uLC[0] * 0.26 * qAtt(distance(uLP[0], vP), uLR[0]) + uLC[1] * 0.2 * qAtt(distance(uLP[1], vP), uLR[1])) * mix(1.0, 2.1 * bubble, max(white, sfoam)), foam);
  col += (uSkyHi * 0.5 + uLampCol * 0.1 * pbLampAtt(distance(uLampPos, vP))) * hull;    // the meniscus round each hull catches the light
  col += uSkyHi * men * 0.2;
  // winter: a thin rim of ice along the kerb
  float ice = uIce * pbSS(5.5 + 2.0 * pbNoise(p * 0.3), 3.5, vA.z);
  col = mix(col, uSkyHi * (1.3 + 0.8 * pbNoise(p * 2.0)) + uLampCol * 0.03, ice * 0.8);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,sa=_e+He+`
attribute vec4 aS; uniform vec3 uBox; uniform vec3 uVel; uniform vec3 uLen; varying vec3 vC; varying vec2 vUv;
vec3 cone(vec3 c, vec3 Lp, vec3 Lc, vec3 view){
  vec3 v = Lp - c; float d = length(v); v /= d;
  float fs = pbSq(max(dot(view, v), 0.0));
  return Lc * pbSS(0.5, 0.92, v.y) * (0.25 + 1.5 * fs) / (1.0 + d * d / 70000.0);
}
void main(){
  float sp = 0.75 + 0.5 * aS.w;
  vec3 vel = uVel * sp, c = aS.xyz * uBox + vel * uTime;
  c = mod(c - cameraPosition + uBox * 0.5, uBox) - uBox * 0.5 + cameraPosition;
  vec3 ax = normalize(vel), toC = cameraPosition - c; float dist = length(toC); toC /= dist;
  vec3 side = normalize(cross(ax, toC));
  vec3 p = c + ax * position.y * uLen.x * (0.6 + 0.8 * aS.w) + side * position.x * max(uLen.y, dist * 0.0028);
  vUv = position.xy * 2.0;
  vec3 view = -toC;
  vC = uSkyC * uLen.z * 0.5 + cone(c, uLampPos, uLampCol, view) + cone(c, uLP[0], uLC[0], view)
     + uLC[1] * qAtt(distance(c, uLP[1]), uLR[1]) * 0.4 + uShopC * qAtt(distance(c, uShopP), 150.0) * 0.3;      // the sky: 'bright amber needles wherever they cross a lamp cone or a lit window'
  vC *= pbSS(5.0, 26.0, dist) * 0.6;
  vec4 mvPosition = viewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ia=je+`
varying vec3 vC; varying vec2 vUv;
void main(){
  float a = (1.0 - min(vUv.x * vUv.x, 1.0)) * (1.0 - pow(min(abs(vUv.y), 1.0), 3.0));
  gl_FragColor = vec4(vC * a, 1.0);
  #ifdef USE_FOG
    gl_FragColor.rgb *= 1.0 - (1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth)) * 0.7;
  #endif
}`,la=_e+He+B0+`
attribute vec4 aS; attribute float aT; uniform float uCamS; varying vec3 vC; varying vec3 vUv;
void main(){
  float T = 1.1 + aS.z, cyc = uTime / T + aS.w, id = floor(cyc), ph = fract(cyc);
  float h1 = pbHash(vec2(id * 0.137, aS.x * 91.7)), h2 = pbHash(vec2(id * 0.211 + 3.3, aS.y * 57.3));
  float s = uCamS - 60.0 + mod(h1 * 300.0 - (uCamS - 60.0), 300.0);
  float d = aS.x < 0.62 ? (h2 * 2.0 - 1.0) * 13.5 : 19.0 + h2 * h2 * 150.0;
  float onW = step(d, gWr(s) - 0.5);
  float y = mix(gG(s) + 4.2, gW(s) + gStand(s), onW);
  vec4 c4 = crs(s); vec3 c = vec3(c4.x - c4.w * d, y, c4.y + c4.z * d);
  float alive = step(-45.0, s) * step(s, 893.0);
  vec3 p; float a;
  if (aT < 0.5) {                                  // ring lying on the surface
    float rad = (0.5 + ph * (2.0 + 2.6 * aS.z)) * mix(0.55, 1.0, onW);
    p = c + vec3(position.x, 0.0, position.y) * rad * 2.0; p.y += 0.2; a = (1.0 - ph) * (1.0 - ph) * 0.4;
  } else {                                         // the crown itself, alive for the first fifth of the cycle
    float k = clamp(ph * 5.0, 0.0, 1.0);
    vec3 rt = normalize(cross(vec3(0.0, 1.0, 0.0), cameraPosition - c));
    p = c + rt * position.x * (1.3 + 1.7 * k) + vec3(0.0, 1.0, 0.0) * (position.y + 0.5) * (0.3 + 1.9 * sin(3.1416 * sqrt(k)));
    a = (1.0 - k) * 0.5;
  }
  vUv = vec3(position.xy * 2.0, aT);
  float dist = distance(cameraPosition, c);
  vC = (uSkyC * 0.8 + uLampCol * 0.5 * pbLampAtt(distance(c, uLampPos)) + uLC[0] * 0.5 * qAtt(distance(c, uLP[0]), uLR[0]) + uLC[1] * 0.4 * qAtt(distance(c, uLP[1]), uLR[1]))
     * a * alive * pbSS(3.0, 12.0, dist);
  vec4 mvPosition = viewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ca=je+`
float pbSq(float x){ return x * x; }
varying vec3 vC; varying vec3 vUv;
void main(){
  float a;
  if (vUv.z < 0.5) { float r = length(vUv.xy); a = exp(-pbSq((r - 0.84) / 0.09)) + 0.35 * exp(-pbSq((r - 0.5) / 0.07)); }
  else {
    float x = clamp(vUv.x, -1.0, 1.0), y = clamp(vUv.y, -1.0, 1.0) * 0.5 + 0.5;
    a = exp(-x * x * 34.0) * (1.0 - y) * 1.3                                    // the rebound jet
      + (1.0 - smoothstep(0.1, 0.32, y)) * (1.0 - pow(abs(x), 4.0)) * 0.55;       // the low rim of the crater
    a += exp(-(x * x * 30.0 + (y - 0.95) * (y - 0.95) * 180.0)) * 1.5;      // the bead thrown off the top
  }
  gl_FragColor = vec4(vC * a, 1.0);
  #ifdef USE_FOG
    gl_FragColor.rgb *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #endif
}`,ua="varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",da=o0+`
uniform vec3 uSkyA; uniform vec3 uSkyB; uniform vec3 uFogC; uniform float uBreak; varying vec3 vDir;
void main(){
  vec3 d = normalize(vDir); float up = max(d.y, 0.0);
  vec2 q = d.xz / (up + 0.3);
  float n = pbFbm(q * 1.3 + vec2(uTime * 0.012, uTime * 0.02)), n2 = pbFbm(q * 3.1 - uTime * 0.025);
  vec3 c = mix(uSkyA, uSkyB, pbSS(0.3, 0.75, n * 0.7 + n2 * 0.3));
  c += uSkyB * uBreak * pbSS(0.5, 0.8, n) * 1.6;
  gl_FragColor = vec4(mix(uFogC, c, pbSS(0.02, 0.5, d.y)), 1.0);
}`,pa=_e+`
attribute float aSeed; varying vec2 vUv; varying float vSeed; varying vec3 vP; varying vec3 vN;
void main(){ vUv = uv; vSeed = aSeed; vP = position; vN = normal;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ha=je+He+`
uniform float uLit; uniform vec3 uWall; uniform vec3 uWinC; uniform vec3 uOne;
varying vec2 vUv; varying float vSeed; varying vec3 vP; varying vec3 vN;
void main(){
  vec2 cell = vec2(190.0, 290.0), g = vUv / cell, idc = floor(g), id = idc + floor(vSeed * 64.0 + 0.5) * 3.0, f = fract(g) - 0.5;
  float h = pbHash(id), h2 = pbHash(id + 9.1), ground = step(vUv.y, 290.0);
  vec2 half2 = mix(vec2(0.22, 0.30), vec2(0.36, 0.27), ground);
  vec2 a = abs(f - vec2(0.0, -0.04 * ground)) - half2; float sd = max(a.x * 190.0, a.y * 290.0);
  float nearK = pbSS(900.0, 180.0, distance(cameraPosition, vP));
  float win = 1.0 - pbSS(mix(-5.0, -20.0, nearK), mix(12.0, 34.0, nearK), sd);
  float lit = max(step(h, uLit), step(abs(idc.x - uOne.x) + abs(idc.y - uOne.y) + abs(vSeed - uOne.z) * 50.0, 0.5));
  vec3 glass = uWinC * (0.35 + 0.95 * h2) * (1.0 + 0.04 * sin(uTime * 3.0 + h * 40.0)) * (0.7 + 0.3 * cos(f.y * 5.0));
  float fy = (f.y + 0.04 * ground) / half2.y;                           // -1 sill .. 1 lintel
  glass *= (0.62 + 0.38 * pbSS(-1.0, 0.7, fy)) * (1.0 - 0.25 * nearK);  // brighter toward the lamp inside, dimmer close to
  glass *= 1.0 - 0.5 * step(0.45, h2) * pbSS(0.25 + 0.5 * fract(h * 9.7), 0.45 + 0.5 * fract(h * 9.7), fy);     // a blind drawn part-way
  glass *= 1.0 - 0.35 * step(h2, 0.45) * pbSS(0.55, 0.95, abs(f.x) / half2.x);                                   // or curtains at the sides
  glass *= 1.0 - mix(1.0, 0.45, nearK) * (0.45 * pbSS(4.0 + 6.0 * nearK, 1.0, abs(f.x) * 190.0) + 0.3 * pbSS(4.0 + 6.0 * nearK, 1.0, abs(f.y - 0.06) * 290.0));
  // now and then somebody crosses behind a blind
  float sh = step(0.55, h2) * pbSS(0.17, 0.03, abs(f.x - 0.34 * sin(uTime * 0.33 + h * 30.0))) * pbSS(0.28, -0.12, f.y);
  glass *= 1.0 - 0.75 * sh;
  vec3 wall = uWall * (0.7 + 0.5 * pbFbm(vUv * 0.02 + vSeed * 9.0)) * (0.9 + 0.1 * step(0.5, fract(vUv.y / 14.0)));
  wall *= 1.0 - 0.35 * pbSS(940.0, 1000.0, vUv.y);
  vec3 col = qShade(wall, normalize(vN), vP, 0.85) + wall * 0.05 + uWinC * 0.06 * lit * exp(-max(sd, 0.0) / 34.0);
  col = mix(col, mix(uSkyC * 0.7, glass, lit), win);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
  gl_FragColor.rgb += glass * win * lit * 0.3;       // lit windows carry through the mist as soft panels
}`,fa=`
attribute vec3 aPos; attribute vec4 aCol; varying vec2 vUv; varying vec3 vC;
void main(){
  vec4 mv = viewMatrix * vec4(aPos, 1.0); float dist = max(-mv.z, 1.0);
  mv.xy += position.xy * aCol.w * (0.35 + dist / 450.0);
  vUv = position.xy * 2.0; vC = aCol.rgb * exp(-dist * 0.0006) / (0.7 + dist / 600.0);
  gl_Position = projectionMatrix * mv;
}`,va=`
varying vec2 vUv; varying vec3 vC;
void main(){ float d = length(vUv);
  float a = smoothstep(1.0, 0.84, d) * (0.5 + 0.5 * smoothstep(0.55, 0.95, d)) + 0.7 * exp(-d * d * 5.0);
  gl_FragColor = vec4(vC * a, 1.0);
}`,ma=_e+`
attribute vec2 aF; varying vec2 vUv; varying vec2 vF; varying vec3 vP;
void main(){ vUv = vec2(position.x * 2.0, position.y); vF = aF;
  vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0); vP = wp.xyz;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,wa=je+He+`
uniform vec3 uCream; varying vec2 vUv; varying vec2 vF; varying vec3 vP;
void main(){
  float r = length(vUv), ang = atan(vUv.x, vUv.y), crown = step(1.5, vF.x), a, lit = 1.0;
  if (crown > 0.5) {      // the boot's soft splash crown, as it was
    float mask = pbSS(1.0, 0.4, r) * pbSS(1.3, 0.2, abs(ang)) * pbSS(0.0, 0.16, r);
    a = mask * pbSS(0.2, 0.85, pbFbm(vec2(ang * 2.6 + vF.x * 13.0, r * 2.4 - uTime * 2.2)) * 1.25) * vF.y * 0.7;
  } else {
    // (repair 3) thrown water with a drawn shape (it was a burst of straight spikes): a thin sheet flung up from
    // the wheel's foot, thick at its root and streaked the way it was thrown; its upper edge cut into teeth with
    // a thickened bright rim, as the edge of a splash crown is; and beyond the edge the teeth break into separate
    // round drops that fly on outward, each with its own highlight. Still the design's 'fan-shaped quads with a
    // scrolling noise mask': the streaks, the edge and the drops all scroll outward from the foot
    float ph = vF.x * 40.0, side = pbSS(1.25, 0.75, abs(ang));
    float edge = 0.55 + 0.1 * sin(ang * 6.5 + ph) + 0.06 * sin(ang * 15.0 - ph * 1.7 + uTime * 1.3) + 0.1 * (pbNoise(vec2(ang * 2.5 + ph, uTime * 0.9)) - 0.5);
    float sheet = pbSS(edge, edge - 0.05, r) * pbSS(0.0, 0.1, r) * side, streak = pbNoise(vec2(ang * 13.0 + ph, r * 3.2 - uTime * 3.6));
    float rim = exp(-pbSq((r - edge) / 0.03)) * side;
    vec2 g = vec2(ang * 8.0 + ph, (r - uTime * 0.55) * 8.5), gi = floor(g), gf = fract(g) - 0.5;
    float h = pbHash(gi + 3.7), h2 = pbHash(gi * 1.7 + 9.1), rad = mix(0.5, 1.25, h2 * h2);
    vec2 dv = vec2((gf.x - (h - 0.5) * 0.5) * r * 5.6, (gf.y - (h2 - 0.5) * 0.5) * 4.7);      // from the drop's middle, in world units near enough
    float drop = pbSS(rad, rad * 0.55, length(dv)) * step(0.4, h) * pbSS(edge - 0.05, edge + 0.05, r) * pbSS(1.0, 0.8, r) * side;
    float glint = pbSS(rad * 0.5, 0.0, length(dv - vec2(-0.3, 0.35) * rad));
    a = (sheet * (0.28 + 0.35 * streak * streak + 0.3 * pbSS(0.35, 0.0, r)) + rim * 0.85 + drop * 0.95) * vF.y;
    lit = 0.7 + 0.5 * streak * sheet + 0.8 * rim + drop * (0.2 + 1.5 * glint);
  }
  if (a < 0.004) discard;
  // (repair 2) a wheel's fan stands in the tram's own window light and the street's: lit amber spray, bright at its thick root
  vec3 col = uCream * (uSkyC * 1.6 + uLampCol * pbLampAtt(distance(vP, uLampPos)) * mix(0.45, 0.25, crown) + uLC[0] * qAtt(distance(vP, uLP[0]), uLR[0]) * mix(0.45, 0.25, crown)
    + uLC[1] * qAtt(distance(vP, uLP[1]), uLR[1]) * mix(1.0, 0.5, crown) + uWash * 2.5 * (1.0 - crown));
  col *= mix(lit, 1.0, crown);
  gl_FragColor = vec4(col, min(a, 1.0) * mix(0.86, 0.42, crown));
  #include <fog_fragment>
}`,ya=_e+`
varying vec3 vP; varying vec3 vN; varying vec2 vUv;
void main(){ vUv = uv; vec4 wp = modelMatrix * vec4(position, 1.0); vP = wp.xyz; vN = normalize(mat3(modelMatrix) * normal);
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ba=je+He+`
uniform vec3 uCream; uniform vec3 uDeep; varying vec3 vP; varying vec3 vN; varying vec2 vUv;
void main(){
  // (repair 3) the strands run down the fall (they used to run round it), and the foot of the column frays into drops
  float st = pbNoise(vec2(vUv.y * 13.0, vUv.x * 5.0 - uTime * 3.6)) * 0.6 + 0.4 * pbNoise(vec2(vUv.y * 5.0 + 3.0, vUv.x * 2.4 - uTime * 2.5));
  float fray = mix(1.0, pbSS(0.3, 0.62, pbNoise(vec2(vUv.y * 9.0, vUv.x * 34.0 - uTime * 10.0))), pbSS(0.74, 1.0, vUv.x));
  vec3 V = normalize(cameraPosition - vP); float rim = 1.0 - abs(dot(normalize(vN), V));
  vec3 lam = uLampCol * pbLampAtt(distance(vP, uLampPos)) + uLC[0] * qAtt(distance(vP, uLP[0]), uLR[0]) + uLC[1] * qAtt(distance(vP, uLP[1]), uLR[1]);
  float r2 = rim * rim;
  vec3 col = uDeep * 0.25 + uSkyC * (0.2 + 3.0 * r2) + lam * (0.08 + 0.7 * st * st + 0.9 * r2) + uCream * uSkyC * 2.0 * pbSS(0.6, 0.95, st);
  gl_FragColor = vec4(col, clamp(0.16 + 0.55 * st * st + 0.75 * r2, 0.0, 1.0) * fray);
  #include <fog_fragment>
}`,ga=_e+o0+B0+`
attribute float aRough; attribute vec4 aS; uniform float uFlow;
varying vec3 vP; varying vec3 vN; varying vec3 vC; varying float vR; varying vec3 vO; varying vec2 vLf;
void main(){
  vLf = position.xz;
  float L = 735.0, s = -30.0 + mod(aS.x * L + uTime * uFlow * (0.75 + 0.5 * aS.w), L);
  float sc = aS.z * smoothstep(-30.0, -18.0, s) * (1.0 - smoothstep(684.0, 694.0, s));
  float d = aS.y > 0.0 ? mix(8.0, gWr(s) - 2.5, aS.y) : -mix(8.0, 12.5, -aS.y);
  float rot = aS.w * 6.283 + uTime * 0.5 * (aS.w - 0.5) + s * 0.015, cr = cos(rot), sr = sin(rot);
  vec3 p = vec3(position.x * cr - position.z * sr, position.y, position.x * sr + position.z * cr) * sc;
  vec3 n = vec3(normal.x * cr - normal.z * sr, normal.y, normal.x * sr + normal.z * cr);
  vec4 c4 = crs(s);
  p += vec3(c4.x - c4.w * d, gW(s) + gStand(s) + 0.25 + 0.2 * sin(uTime * 2.3 + aS.w * 40.0), c4.y + c4.z * d);
  vO = position * aS.z + aS.w * 50.0; vP = p; vN = n; vC = color * (0.7 + 0.6 * fract(aS.w * 7.7)); vR = aRough;
  vec4 mvPosition = viewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;function K(){const f=[],P=[],R=[],m=[],q=new d,Y=new d,U=new n.Matrix3,le=new n.Matrix4,H={add(_,T,O,xe=.5,$={}){T=T||le;const Ae=_.attributes.position,ve=_.attributes.normal,me=_.index,s0=me?me.count:Ae.count;U.getNormalMatrix(T);const D=T.determinant()<0,ne=typeof O=="function",Ge=W=>{const Ue=me?me.getX(W):W;q.fromBufferAttribute(Ae,Ue);const i0=ne?O(q):O;q.applyMatrix4(T),Y.fromBufferAttribute(ve,Ue).applyMatrix3(U).normalize();const Ie=$.shade?$.shade(q.x,q.y,q.z):1;f.push(q.x,q.y,q.z),P.push(Y.x,Y.y,Y.z),R.push(i0.r*Ie,i0.g*Ie,i0.b*Ie),m.push(xe)};for(let W=0;W<s0;W+=3)Ge(W),D?(Ge(W+2),Ge(W+1)):(Ge(W+1),Ge(W+2));return _.dispose(),H},tri(_,T,O,xe,$=.5){if(Y.subVectors(T,_).cross(q.subVectors(O,_)),Y.lengthSq()<1e-10)return H;Y.normalize();for(const Ae of[_,T,O])f.push(Ae.x,Ae.y,Ae.z),P.push(Y.x,Y.y,Y.z),R.push(xe.r,xe.g,xe.b),m.push($);return H},get count(){return m.length},build(){const _=new n.BufferGeometry;return _.setAttribute("position",new n.Float32BufferAttribute(f,3)),_.setAttribute("normal",new n.Float32BufferAttribute(P,3)),_.setAttribute("color",new n.Float32BufferAttribute(R,3)),_.setAttribute("aRough",new n.Float32BufferAttribute(m,1)),_}};return H}const X0=(f,P=1)=>new n.Color(f).multiplyScalar(P),zt=(f,P)=>{const R=.2126*f.r+.7152*f.g+.0722*f.b;return f.lerp(new n.Color(R,R,R),P)},E=(f,P,R,m=1)=>f.clone().lerp(P,R).multiplyScalar(m);function B(f,P,R,m,q,Y=.35,U=6,le=m){const H=new d().subVectors(R,P),_=H.length(),T=new n.Matrix4().compose(new d().addVectors(P,R).multiplyScalar(.5),new n.Quaternion().setFromUnitVectors(new d(0,1,0),H.normalize()),new d(1,1,1));f.add(new n.CylinderGeometry(le,m,_,U,1),T,q,Y)}function mo(f,P){const R=new n.InstancedBufferGeometry,m=new n.PlaneGeometry(1,1);R.index=m.index,R.setAttribute("position",m.attributes.position),R.setAttribute("uv",m.attributes.uv);for(const q in P)R.setAttribute(q,new n.InstancedBufferAttribute(P[q].array,P[q].size));return R.instanceCount=f,R}function Sa(f){const P=f.rng.fork("look"),R=f.vary||{},m=R.hour,q=m==="night"?"night":m==="dawn"||m==="day"?"dawn":m==="golden"?"dusk":P.pick(["dusk","night","dawn"]),Y=P.pick({dusk:["downpour","downpour","drizzle","clearing"],night:["downpour","downpour","downpour","drizzle"],dawn:["clearing","clearing","drizzle","downpour"]}[q]),U=P.pick({dusk:["autumn","autumn","spring","winter"],night:["autumn","winter","winter","spring"],dawn:["spring","spring","autumn","winter"]}[q]),le=P.pick(["red","red","newsprint","walnut","duck"]),H=P.chance(.72)?"tram":"cart",_=ee(R.density??1,.6,1.4),T=ee(f.quality?.detail??1,.4,1),O={dusk:{fog:"#2A3152",fogK:.8,skyA:"#2A3152",skyB:"#56607A",skyK:1,hemi:1.25,lit:.5,lampGain:1,exposure:1.12,win:1},night:{fog:"#141A30",fogK:.7,skyA:"#141A30",skyB:"#2C3452",skyK:.8,hemi:.6,lit:0,lampGain:1.12,exposure:1.25,win:.15},dawn:{fog:"#66728A",fogK:.8,skyA:"#6B7790",skyB:"#AEB8C8",skyK:1,hemi:2.7,lit:.1,lampGain:.5,exposure:.98,win:.35}}[q],xe={downpour:{rain:1,crowns:1,fogD:.002,brk:0,len:20},drizzle:{rain:.5,crowns:.45,fogD:.0026,brk:0,len:11},clearing:{rain:.16,crowns:.22,fogD:.0015,brk:.6,len:16}}[Y];return{hour:q,rain:Y,season:U,rival:le,vehicle:H,density:_,detail:T,rare:!!R.rare,...O,...xe,rainWord:Y}}var Aa={id:"paper-boat-rapids",name:"Paper Boat Rapids",category:"domestic",weirdness:.1,media:["water","tiny"],async build(f){const P=f.rng,R=f.noise,m=Sa(f),q=t=>f.core.makeRng(f.core.hashSeed(t+":"+f.seed)),Y=Zo[m.hour],[U,le,H,_,T,O,xe]=Y.map(t=>new n.Color(t)),$=new n.Scene,Ae=X0(m.fog,m.fogK);$.background=Ae.clone(),$.fog=new n.FogExp2(Ae.clone(),m.fogD),$.add(new n.HemisphereLight(H,U,m.hemi));const ve=await Xo(f,{palette:Y,portalGlow:!1,apron:!1,lampGain:m.lampGain,mist:Math.round(60*(m.rainWord==="drizzle"?1.2:1))});$.add(ve.object);const me=ve.uniforms,s0=ve.anchors;await f.yield();const D=new d,ne=new d,Ge=new d,W=new n.Matrix4,Ue=new n.Quaternion,i0=new n.Euler,Ie=new d(1,1,1),Pt=262,x0=Z(Pt,-50,J(Pt)+12,new d),Ct=x0.clone().setY(x0.y+376),kt=T.clone().lerp(O,P.range(0,.18)).multiplyScalar(2.1*m.lampGain),At=kt.clone(),Z0=new d(-2e3,240,405),Lt=T.clone().multiplyScalar(m.vehicle==="tram"?1.9:1),T0=Lt.clone(),wo={uLP:{value:[Ct,Z0]},uLC:{value:[At,T0]},uLR:{value:[340,320]},uSkyC:{value:zt(H.clone(),.3).multiplyScalar(m.hemi/G)},uGndC:{value:zt(U.clone(),.3).multiplyScalar(m.hemi/G*.6)},uRib:{value:1},uWash:{value:T.clone().multiplyScalar(.085*(.45+.55*m.win)*(m.hour==="dawn"?1.6:1))}},ue=(t,e,o={},s={})=>new n.ShaderMaterial({uniforms:{...n.UniformsUtils.clone(n.UniformsLib.fog),...me,...wo,...s},vertexShader:t,fragmentShader:e,fog:!0,...o}),Qe=(t,e=0,o=0,s=0)=>({uThin:{value:t},uFloor:{value:e},uPrint:{value:o},uPlain:{value:s}}),de=ue(S0,r0,{vertexColors:!0},Qe(0)),M0=ue(S0,r0,{vertexColors:!0,side:n.DoubleSide},Qe(.55)),Rt=ue(S0,r0,{vertexColors:!0,side:n.DoubleSide},Qe(.4,.14)),yo=ue(S0,r0,{vertexColors:!0,side:n.DoubleSide},Qe(.25,.1,1)),bo=ue(S0,r0,{vertexColors:!0},Qe(0,.22,0,.85)),we=(t,e,o=0,s=!1)=>{const a=new n.Mesh(t,e);return a.renderOrder=o,a.frustumCulled=s,$.add(a),a},z={dirt:E(U,H,.25,.55),moss:X0("#3A4A44",.75),cobble:E(H,le,.3,.62),granite:E(H,_,.38,.76),flag:E(H,le,.3,.52),iron:E(U,H,.22,.75),rust:E(U,T,.3,.6),steel:E(H,_,.5,.7),wall:zt(E(U,H,.45,1.3),.6),leaf:E(T,_,.5,.3),paper:O.clone().multiplyScalar(.78),red:xe.clone().multiplyScalar(.85),glass:T.clone()};await f.yield();{const t=[],e=[],o=[],s=new d,a=[];for(let y=-80;y<De;y+=6)a.push(y);a.push(409.5,410.5,579.5,581.2,581.8,De),a.sort((y,r)=>y-r);const c=y=>y>580&&y<581.5?580:y,h=[-1500,-900,-500,-330,-240,-190,-150,-110],l=y=>y<95?-60:y<300?-240:y<390?-190:y<=630?-1500:-240,i=y=>{const r=l(y),p=n0(y)?15:b0(y),v=g0(y);return[...h,-(p+50),-(p+25),-(p+13),-(p+9.5),-(p+5),-(p+3),-(p+1)].map(S=>Math.max(S,r)).concat([-(p-1),-(p-3),-p/2,0,v/2,v-3,v-1,v+1,v+3,v+5,v+10,v+20,v+40,130,180,260,400,700])};let u=0;for(const y of a){const r=c(y),p=i(r);u=p.length;for(const v of p){const S=$0(r,v)+J(y)-J(r);Z(y,v,S,s),t.push(s.x,s.y,s.z),e.push(v<-16.5&&n0(r)?1:0,S-J(y))}}for(let y=0;y<a.length-1;y++)for(let r=0;r<u-1;r++){const p=y*u+r,v=p+1,S=p+u,M=S+1;o.push(p,v,S,v,M,S)}const w=(y,r,p,v,S,M)=>{const k=t.length/3;for(const[V,j]of[[y,v],[r,v],[y,p],[r,p]]){const se=S(V,j);t.push(V,se,j),e.push(M,M?11.6:2.4)}o.push(k,k+1,k+2,k+1,k+3,k+2)};w(-240,-126,-126,146,()=>11.6,1),w(126,700,-126,146,()=>2.4,0),w(-240,36,-1700,-126,()=>11.6,1),w(36,700,-1700,-126,()=>2.4,0);const b=[-1500,-900,-500,-330,-270,-230,-190,-150],x=[486,500,510,520,530,545],C=(y,r)=>J(Se(y,r).s)+11.3;for(let y=0;y<b.length-1;y++)for(let r=0;r<x.length-1;r++)w(b[y],b[y+1],x[r],x[r+1],C,1);const A=new n.BufferGeometry;A.setAttribute("position",new n.Float32BufferAttribute(t,3)),A.setAttribute("aK",new n.Float32BufferAttribute(e,2)),A.setIndex(o),A.computeVertexNormals(),we(A,ue(oa,aa,{},{uCob:{value:z.cobble},uViolet:{value:le},uPale:{value:_},uDirt:{value:z.dirt},uMoss:{value:z.moss},uFlag:{value:z.flag}}))}await f.yield();const Le={uSurge:{value:new d(0,0,30)},uSplash:{value:new n.Vector4(0,0,0,0)},uBoat:{value:[new d(0,0,4),new d(0,0,4),new d(0,0,4)]},uBoatD:{value:[new d(1,0,1),new d(1,0,1),new d(1,0,1)]},uRush:{value:1},uPipe:{value:new d(0,0,1)},uCoin:{value:new d(672,22,1)},uStrip:{value:new n.Vector4(-2e3,405,0,0)},uStripC:{value:T.clone().multiplyScalar(.55)},uIce:{value:m.season==="winter"?1:0},uRainK:{value:.3+.9*m.crowns},uWin:{value:m.win}},Nt=t=>{let e=10;return e=Q(3,e,L(40,80,t)),e=Q(e,24,L(590,604,t)*(1-L(640,655,t))),e=Q(e,2.5,L(645,660,t)*(1-L(690,702,t))),Q(e,17,L(698,708,t)*(1-L(725,752,t)))};{const t=[],e=[],o=[],s=[],a=[],c=new d,h=20;let l=0;for(let u=-46;;u+=u>=596&&u<612?1:u>=612&&u<650?1.25:2.5){u>De+.6&&(u=De+.6);const w=n0(u),b=(pe(u)-J(u))*1.2,x=w?-15.4:-(b0(u)+1.3+b),C=g0(u)+1.3+b,A=L(596,606,u)*(1-L(640,652,u))+.7*L(697,703,u)*(1-L(706,718,u)),y=Nt(u);ke(u,F);const r=F.hx,p=F.hz;for(let v=0;v<=h;v++){const S=Q(x-1.5,C+2.5,v/h);Z(u,S,pe(u),c),t.push(c.x,c.y,c.z),e.push(u,S),o.push(y,A,S-x,C-S),s.push(r,p)}if(l++,u>=De+.6)break}for(let u=0;u<l-1;u++)for(let w=0;w<h;w++){const b=u*(h+1)+w,x=b+1,C=b+h+1,A=C+1;a.push(b,x,C,x,A,C)}const i=new n.BufferGeometry;i.setAttribute("position",new n.Float32BufferAttribute(t,3)),i.setAttribute("aSD",new n.Float32BufferAttribute(e,2)),i.setAttribute("aA",new n.Float32BufferAttribute(o,4)),i.setAttribute("aHd",new n.Float32BufferAttribute(s,2)),i.setIndex(a),we(i,ue(na,ra,{},Le),1)}await f.yield();{const t=po(),e=t.attributes.position.count,o=10.6,s=[],a=[],c=new n.Color,h=P.fork("domes");t.setAttribute("color",new n.Float32BufferAttribute(new Float32Array(e*3).fill(1),3)),t.setAttribute("aRough",new n.Float32BufferAttribute(new Float32Array(e).fill(.38),1));for(let i=26;i<=97;i++){i%10===5&&await f.yield();for(let u=-42;u<=26;u++){const w=12+i%2*o*.5+u*o+h.range(-.5,.5),b=-122+i*o+h.range(-.5,.5),x=Se(w,b),C=x.s,A=x.d;if(C<-55||C>=De+3)continue;const y=A>g0(C)+1.6&&A<g0(C)+85,r=!n0(C)&&-A>b0(C)+1.6&&-A<b0(C)+75;if(!y&&!r)continue;const p=ta(w,b)>.66,v=$0(C,A)-(p?2.6:0),S=h.range(9,10.1);c.copy(z.cobble).lerp(h()<.5?le:_,h.range(0,.28)).multiplyScalar(h.range(.75,1.15)),s.push(g(w,v-1.3,b,h.range(-.05,.05),h.range(-.12,.12),h.range(-.05,.05),S,h.range(3,3.6),S*h.range(.94,1.04))),a.push(c.r,c.g,c.b),h.chance(.3*m.density*m.detail)&&Math.abs(A)<70&&(c.copy(z.moss).multiplyScalar(h.range(.7,1.2)),s.push(g(w+o*.5,v-.6,b+o*.5,0,h.range(0,6),0,h.range(3.5,5.5),h.range(1.8,2.8),h.range(3.5,5.5))),a.push(c.r,c.g,c.b))}}await f.yield();const l=new n.InstancedMesh(t,de,s.length);s.forEach((i,u)=>l.setMatrixAt(u,i)),l.instanceColor=new n.InstancedBufferAttribute(new Float32Array(a),3),l.frustumCulled=!1,$.add(l)}await f.yield();const N=K(),re=P.fork("solids"),te=(t,e,o,s=new d)=>Z(t,e,J(t)+o,s),J0=g(...te(606,10,-4).toArray(),.2,.5,.34,14.5,9,12.5),Be=()=>z.iron.clone().lerp(z.rust,re.range(0,.25)).multiplyScalar(re.range(.9,1.15));{const t=E(H,_,.7,.5*ee(m.hemi/1.25,.55,1.15)).lerp(T,.12),e=q("paper-boat-rapids:kerb-moss"),o=(a,c,h,l,i,u=null)=>{const w=g(a,i+4.2+re.range(-.25,.1),c,re.range(-.012,.012),h,re.range(-.01,.01));if(N.add(X(l,15.6,12,1.3),w,z.granite.clone().multiplyScalar(.68+(re.range(.82,1.15)-.82)*1.7),2+re.range(.4,.6),{shade:(b,x)=>.7+.3*L(i-1,i+6,x)}),u!==null&&u>-46&&(u<596||u>652)){const b=Math.atan((pe(u+1)-pe(u-1))/2);N.add(new n.BoxGeometry(l-3.2,.42,.3),w.clone().multiply(g(0,pe(u)+.3-(i+4.2),6,0,0,b)),t,-1)}},s=(a,c)=>{for(let h=a,l=a;h<c-1;){const i=Math.min(re.range(34,50),c-h),u=h+i/2;if(ke(u,F),o(F.x+F.hz*21.4,F.z-F.hx*21.4,Math.atan2(-F.hz,F.hx),i-.9,J(u),u),h>-40&&h>a){ke(h,F);const w=Math.atan2(-F.hz,F.hx),b=e(),x=Math.floor(1+b*b*6.5),C=Math.min(J(l),J(u)),A=(y,r,p)=>Z(y,r,C+p,new d);N.add(new n.BoxGeometry(1.7,14.6,1),g(...A(h,-16.35,4.1).toArray(),0,w,0),z.granite.clone().multiplyScalar(.6),2.45);for(let y=0;y<x;y++){const r=e.chance(.4),p=r?e.range(.55,1.1):e.range(.32,.72),v=r?A(h+e.range(-2.4,2.4),-15.7-e.range(0,2.2),11.7):A(h+e.range(-.45,.45),-15.5,e.range(.5,10.3));N.add(new n.SphereGeometry(1,6,3),g(v.x,v.y,v.z,0,w,0,p*(r?1.5:.95),p*(r?.5:1.05),p*(r?1.1:.5)),z.moss.clone().multiplyScalar(e.range(.85,1.5)),.95)}}h+=i,l=u}};s(-80,410),await f.yield(),s(580,De),await f.yield(),await f.yield();for(const[a,c]of[[496.4,J(404)],[313.6,J(586)]])for(let h=-27;h>-430;){const l=re.range(34,50);o(h-l/2,a,0,l-.9,c),h-=l}for(let a=-126;a>-700;){const c=re.range(32,46);o(30,a-c/2,G/2,c-.9,0),a-=c}N.add(po(),J0,z.cobble.clone().multiplyScalar(1.1),2.3);for(let a=0;a<2;a++)for(let c=-80-a*22;c<95;){const h=Math.min(re.range(40,56),96-c),l=c+h/2;ke(l,F),N.add(X(h-.8,21,7,1.2),g(F.x+F.hz*36.5,J(l)+22.5+a*21.8,F.z-F.hx*36.5,0,Math.atan2(-F.hz,F.hx),0),z.granite.clone().lerp(le,.3).multiplyScalar(re.range(.7,1)),re.range(.45,.65)),c+=h}}await f.yield();{const t=x0.x,e=x0.y,o=x0.z,s=(a,c,h,l,i)=>N.add(new n.CylinderGeometry(a,c,h,l,1),g(t,e+i+h/2,o),Be(),.3);s(15,18,10,8,0),s(11,13,13,8,10),s(7.6,9.6,40,12,23),s(4.3,7,283,12,63),s(9,4.3,10,12,346),N.add(X(46,2.2,2.2,.7),g(t,e+312,o,0,1.1,0),Be(),.3);for(let a=0;a<6;a++){const c=a/6*ae;B(N,new d(t+Math.cos(c)*9,e+359,o+Math.sin(c)*9),new d(t+Math.cos(c)*15.5,e+389,o+Math.sin(c)*15.5),.8,Be(),.3,4)}N.add(new n.CylinderGeometry(14.6,8.4,29,6,1,!0),g(t,e+374,o,0,G/6,0),T.clone().lerp(O,.2),-2.6*m.lampGain),N.add(new n.ConeGeometry(17.5,14,6,1),g(t,e+397,o,0,G/6,0),Be(),.3),N.add(new n.SphereGeometry(2.8,8,6),g(t,e+407,o),Be(),.25)}const q0=te(222,-5,59),l0=new d;ke(222,F),l0.set(F.hx,0,F.hz).applyAxisAngle(new d(0,1,0),.5).applyAxisAngle(new d(-F.hz,0,F.hx),-.26).normalize(),await f.yield();{const t=te(240,-23,104),e=te(292,-46,100),o=te(281,-44,46),s=te(320,-52,47),a=z.iron.clone().multiplyScalar(1.3);for(const h of[-1,1])B(N,q0.clone().addScaledVector(l0,h*4),t.clone().addScaledVector(l0,h*2).setY(t.y-14),1.3,a,.25);B(N,t.clone().setY(t.y-16),t.clone().setY(t.y+10),2,a,.25),B(N,t.clone().addScaledVector(l0,-24).setY(t.y+12),t.clone().addScaledVector(l0,24).setY(t.y+9),1.3,z.steel,.15),B(N,t,e,1.7,a,.25),B(N,t.clone().setY(t.y-12),o,1.9,a,.25),B(N,e,o,1.7,a,.25),B(N,e,s,1,a,.25),B(N,o,s,1.1,a,.25),B(N,e,e.clone().setY(e.y+12),1.5,z.steel,.2),N.add(new n.SphereGeometry(1,10,6),g(e.x,e.y+14,e.z,0,.4,0,13,3,7),z.iron.clone().multiplyScalar(.7),.3),ke(320,F);const c=new n.Matrix4().lookAt(new d,new d(-F.hz,.12,F.hx),new d(0,1,0)).setPosition(s);N.add(new n.TorusGeometry(35,2,6,40),c,z.iron.clone().multiplyScalar(.6),.4),N.add(new n.TorusGeometry(32.6,.9,5,40),c,z.steel,.15);for(let h=0;h<14;h++){const l=h/14*ae;B(N,s,new d(Math.cos(l)*32,Math.sin(l)*32,0).applyMatrix4(c),.3,z.steel,.15,3)}}const Me=te(76,-20,19),Re=Z(80,-8.5,pe(80),new d);await f.yield();{const t=te(72,-36,620),e=te(72,-36,30);B(N,e,t,5.5,Be(),.3,10),B(N,e,Me,5.5,Be(),.3,10,6.2),N.add(new n.SphereGeometry(6.2,10,8),new n.Matrix4().setPosition(e),Be(),.3);for(const i of[150,320,500])N.add(new n.TorusGeometry(6.4,1.5,6,14),g(...te(72,-36,i).toArray(),G/2,0,0),Be(),.3);const o=Me.clone().sub(e).normalize(),s=new n.Quaternion().setFromUnitVectors(new d(0,0,1),o),a=Me.clone().addScaledVector(o,-5.5),c=q("paper-boat-rapids:downpipe-shoe"),h=()=>z.iron.clone().lerp(z.rust,c.range(0,.25)).multiplyScalar(c.range(.9,1.15));N.add(new n.TorusGeometry(6.2,.9,6,16),W.compose(Me,s,Ie),h(),.25),N.add(new n.CircleGeometry(5.5,16),W.compose(D.copy(Me).addScaledVector(o,.12),s,Ie),U.clone().multiplyScalar(.25),.9),N.add(new n.TorusGeometry(6.3,1.1,6,16),W.compose(a,s,Ie),h(),.3);const l=Z(Se(a.x,a.z).s,Se(a.x,a.z).d,J(76)+12,new d);B(N,l,a.clone().setY(a.y-5.6),1,h(),.3,6),N.add(X(5,.9,5,.3),g(l.x,l.y+.4,l.z,0,.4,0),h(),.3);for(const i of[-1,1])N.add(new n.SphereGeometry(.7,6,4),g(l.x+i*1.6,l.y+.9,l.z+i*1.1),h(),.2)}await f.yield();const D0=1740,Ft=200*G/2,Ye=(t,e)=>{if(t<D0)e.x=-1700+t,e.z=405,e.hx=1,e.hz=0;else if(t<D0+Ft){const o=(t-D0)/200;e.x=40+200*Math.sin(o),e.z=205+200*Math.cos(o),e.hx=Math.cos(o),e.hz=-Math.sin(o)}else e.x=240,e.z=205-(t-D0-Ft),e.hx=0,e.hz=-1;return e},Gt=(t,e)=>{const o=Se(t,e);return e<146?2.75:Math.max($0(o.s,o.d)+.35,pe(o.s)-.4)},et=(t,e)=>e<146?2.75:J(Se(t,e).s)+2.75;{const t={x:0,z:0,hx:1,hz:0},e=z.iron.clone().multiplyScalar(.25),o=z.steel.clone().multiplyScalar(.45),s=[-4,-1.4,1.4,4],a=[o,e,o];for(const l of[-50,50]){let i=null;for(let u=900;u<=3300;u+=u>=1630&&u<1742?4:14){Ye(u,t);const w=s.map(b=>{const x=t.x-t.hz*(l+b),C=t.z+t.hx*(l+b);return new d(x,Gt(x,C)-(b===-1.4||b===1.4?.5:0),C)});if(i)for(let b=0;b<3;b++)N.tri(i[b],i[b+1],w[b],a[b],b===1?.5:.12),N.tri(i[b+1],w[b+1],w[b],a[b],b===1?.5:.12);i=w}}const c=z.iron.clone().multiplyScalar(.5);let h=null;for(let l=700;l<=3300;l+=110){Ye(l,t);const i=new d(t.x,492+5*Math.sin(l*.057),t.z);h&&B(N,h,i,1.3,c,.4,4),h=i}for(const[l,i,u,w]of[[-232,180,650,200],[-232,-120,650,-90],[-232,-520,650,-560],[-330,270,-360,540],[-800,270,-820,540],[-236,600,650,560]]){const b=new d((l+u)/2,505,(i+w)/2);B(N,new d(l,560,i),b,1.3,c,.4,4),B(N,b,new d(u,560,w),1.3,c,.4,4)}}const z0=te(150,-14.5,38);await f.yield();{const t=te(150,-19.5,12),e=te(150,-18.5,26),o=z.moss.clone().multiplyScalar(1.5);B(N,t,e,.55,o,.6,5),B(N,e,z0,.45,o,.6,5),N.add(new n.SphereGeometry(1.1,8,6),new n.Matrix4().setPosition(z0),o,.6);const s=new d;for(let a=0;a<46;a++)s.set(re.gauss(),re.gauss(),re.gauss()).normalize(),B(N,z0,z0.clone().addScaledVector(s,4.6),.07,O.clone().multiplyScalar(.5),-.45,3,.5)}await f.yield();const Bt={uLit:{value:m.lit},uWall:{value:z.wall},uWinC:{value:T.clone().multiplyScalar(m.hour==="dawn"?.7:1)},uOne:{value:new d(1,1,0)}};{const t=[],e=[],o=[],s=[],a=[],c=new d,h=(x,C,A,y,r)=>{const p=Math.hypot(A-x,y-C),v=re(),S=t.length/3;c.set(-(y-C),0,A-x).normalize();const M=Se((x+A)/2+c.x,(C+y)/2+c.z),k=Math.abs(M.d);Math.abs(Se((x+A)/2-c.x,(C+y)/2-c.z).d)<k&&c.negate();const V=J(Se(x,C).s)-4,j=J(Se(A,y).s)-4;t.push(x,V,C,A,j,y,x,V+r,C,A,j+r,y),e.push(0,0,p,0,0,r,p,r);for(let se=0;se<4;se++)o.push(c.x,c.y,c.z),s.push(v);return a.push(S,S+1,S+2,S+1,S+3,S+2),v},l=(x,C)=>Z(x,C,0,new d),i=(x,C)=>x.slice(1).map((A,y)=>h(x[y].x,x[y].z,A.x,A.z,C[y%C.length])),u=l(258,-232);i([l(-200,-40),l(95,-40),l(95,-232),l(180,-232),u,new d(-900,0,u.z),new d(-1700,0,u.z)],[760,760,1e3,880,1040,900]),i([new d(-1700,0,270),new d(-800,0,270),new d(-232,0,270),new d(-232,0,-230),new d(-232,0,-820),new d(-232,0,-1700)],[940,1020,900,1060,960]);const w=i([l(-200,650),l(60,650),l(300,650),l(345,650),l(390,650),new d(650,0,40),new d(650,0,-500),new d(650,0,-1100),new d(650,0,-1700)],[900,1040,980,980,1010,880,1060,940]);i([new d(-232,0,-1700),new d(220,0,-1700),new d(650,0,-1700)],[1e3,900]),Bt.uOne.value.set(1,1,w[4]);const b=new n.BufferGeometry;b.setAttribute("position",new n.Float32BufferAttribute(t,3)),b.setAttribute("normal",new n.Float32BufferAttribute(o,3)),b.setAttribute("uv",new n.Float32BufferAttribute(e,2)),b.setAttribute("aSeed",new n.Float32BufferAttribute(s,1)),b.setIndex(a),we(b,ue(pa,ha,{side:n.DoubleSide},Bt))}await f.yield();const c0=(m.hour==="night"?0:m.hour==="dawn"?.55:1)*m.lampGain;{const e=J(710)+11.6,o=T.clone().lerp(O,.14);if(c0>0){const s=new n.Mesh(new n.PlaneGeometry(172,232).rotateY(G/2),new n.ShaderMaterial({uniforms:{uTime:me.uTime,uC:{value:o.clone().multiplyScalar(c0)},uFogD:{value:m.fogD},uPh:{value:q("paper-boat-rapids:shop-shadow")()*ae}},vertexShader:"varying vec2 vQ; varying vec3 vW; void main(){ vQ = position.zy; vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }",fragmentShader:o0+`
            uniform vec3 uC; uniform float uFogD; uniform float uPh; varying vec2 vQ; varying vec3 vW;
            void main(){
              float fall = pbSS(86.0, 34.0, abs(vQ.x)) * pbSS(116.0, 46.0, abs(vQ.y));
              float b = 0.34 + 0.16 * pbSS(-84.0, 84.0, vQ.y);
              b += 0.6 * (exp(-(pbSq(vQ.x + 38.0) + pbSq(vQ.y - 40.0)) / 1200.0) + exp(-(pbSq(vQ.x) + pbSq(vQ.y - 40.0)) / 1200.0) + exp(-(pbSq(vQ.x - 38.0) + pbSq(vQ.y - 40.0)) / 1200.0));
              b *= 1.0 - 0.4 * pbSS(26.0, 4.0, abs(vQ.x - 70.0 * sin(uTime * 0.19 + uPh))) * pbSS(36.0, -30.0, vQ.y);
              float d = distance(cameraPosition, vW);
              gl_FragColor = vec4(uC * b * fall * fall * exp(-uFogD * uFogD * d * d), 1.0);
            }`,transparent:!0,depthWrite:!1,blending:n.AdditiveBlending,fog:!1,side:n.DoubleSide}));s.position.set(-229.4,e+112,181),s.renderOrder=2,s.frustumCulled=!1,$.add(s)}N.add(new n.BoxGeometry(16,4.2,36),g(-229.4+8,e+1.1,104),z.granite.clone().multiplyScalar(.85),.45);{let s=9173;const a=()=>(s=s*1664525+1013904223>>>0,s/4294967296),c=-229.4+.3,h=U.clone().multiplyScalar(.55),l=z.iron.clone().multiplyScalar(.8),i=T.clone().lerp(O,.3),u=(w,b,x,C,A,y,r=.4,p=c)=>N.add(new n.BoxGeometry(A,b-w,C-x),g(p+A/2,(w+b)/2,(x+C)/2),y,r);N.add(new n.PlaneGeometry(134,168,14,10).rotateY(G/2),g(c,e+110,191),c0>0?w=>{let b=.42+.2*L(-84,84,w.y);for(const x of[-44,0,44])b+=.75*Math.exp(-((w.z-x)**2+(w.y-42)**2)/1100);return i.clone().multiplyScalar(b)}:h,c0>0?-1.55*c0:.4),u(e+22,e+26,120,262,5,l),u(e+194,e+199,120,262,4,l);for(const w of[121.5,168.5,213.5,260.5])u(e+24,e+196,w-1.6,w+1.6,3.5,l);u(e+150,e+153,122,260,2.5,l),u(e,e+23,118,264,3,z.granite.clone().multiplyScalar(.7),.5),await f.yield();for(const[w,b]of[[e+26,13],[e+92,10]]){w>e+60&&u(w-2.5,w,124,258,2,h,.6,c+.4);for(let x=0;x<b;x++){const C=128+(x+.5)*(126/b)+(a()-.5)*3,A=5+a()*4.5,y=15+a()*24,r=a();u(w,w+y,C-A/2,C+A/2,1.6,h,.6,c+.5),r>.45&&u(w+y,w+y+4+a()*6,C-A*.22,C+A*.22,1.6,h,.6,c+.5)}}}me.uShopP.value.set(-196,e+112,191),me.uShopC.value.copy(o).multiplyScalar(1.25*c0)}await f.yield();const go=we(new n.SphereGeometry(3400,24,12),new n.ShaderMaterial({uniforms:{uTime:me.uTime,uSkyA:{value:X0(m.skyA,m.skyK*.8)},uSkyB:{value:X0(m.skyB,m.skyK*1.15)},uFogC:{value:Ae},uBreak:{value:m.brk}},vertexShader:ua,fragmentShader:da,side:n.BackSide,depthWrite:!1,fog:!1}),-1),$e=new d(P.range(-1,1),0,P.range(-.3,.8)).normalize().multiplyScalar(P.range(20,60)),tt=(t,e,o,s)=>{const a=P.fork(s),c=new Float32Array(t*4);for(let h=0;h<t*4;h++)c[h]=a();return we(mo(t,{aS:{array:c,size:4}}),ue(sa,ia,{transparent:!0,depthWrite:!1,blending:n.AdditiveBlending},{uBox:{value:new d(420,300,420)},uVel:{value:e},uLen:{value:o}}),6)},Tt=m.rainWord==="drizzle",So=m.hour==="dawn"?.22:m.hour==="night"?.1:.14;tt(Math.round(1500*m.rain*m.density*m.detail),new d($e.x,Tt?-190:-310,$e.z),new d(m.len,Tt?.32:.45,So),"rain"),m.season==="winter"&&tt(Math.round(520*m.density*m.detail),new d($e.x*.6,-85,$e.z*.6),new d(2.4,1.1,.5),"sleet"),m.season==="spring"&&tt(Math.round(240*m.density*m.detail),new d($e.x*.5,-32,$e.z*.5),new d(2.2,1.5,.55),"petals");const qt={uCamS:{value:0}};{const t=Math.max(60,Math.round(600*m.crowns*m.density*m.detail)),e=P.fork("crowns"),o=new Float32Array(t*4);for(let c=0;c<t*4;c++)o[c]=e();const s=new n.InstancedBufferGeometry,a=[-.5,-.5,0,.5,-.5,0,-.5,.5,0,.5,.5,0];s.setAttribute("position",new n.Float32BufferAttribute([...a,...a],3)),s.setAttribute("aT",new n.Float32BufferAttribute([0,0,0,0,1,1,1,1],1)),s.setIndex([0,1,2,2,1,3,4,5,6,6,5,7]),s.setAttribute("aS",new n.InstancedBufferAttribute(o,4)),s.instanceCount=t,we(s,ue(la,ca,{transparent:!0,depthWrite:!1,blending:n.AdditiveBlending,side:n.DoubleSide},qt),5)}const _0=(t,e)=>{const o=t.attributes.uv,s=t.attributes.position,a=[],c=new n.Color,h=e.clone().multiply(new n.Color(1.7,1.8,2.1));for(let l=0;l<s.count;l++)o.getX(l)>.99&&a.push([Math.atan2(-s.getZ(l),s.getX(l)),Math.hypot(s.getX(l),s.getZ(l)),o.getY(l)]);return l=>{const i=Math.atan2(-l.z,l.x),u=Math.hypot(l.x,l.z);let w=a[0],b=9;for(const x of a){let C=Math.abs(x[0]-i);C>G&&(C=ae-C),C<b&&(b=C,w=x)}return c.copy(e).lerp(h,u>.9*w[1]?.8*(1-w[2]):0)}};{const t=P.fork("floaters"),e=K(),o=m.season==="spring";if(o)e.add(new n.CircleGeometry(1,9).rotateX(-G/2).scale(1,1,.62),null,O.clone().lerp(_,.25).multiplyScalar(.7),.5);else{const l=I0(q("paper-boat-rapids:floating-leaf-shape"),30);e.add(l,null,_0(l,z.leaf.clone().multiplyScalar(1.2)),10.42)}const s=e.build(),a=Math.round((o?120:m.season==="autumn"?38:12)*m.density*m.detail),c=new Float32Array(a*4);for(let l=0;l<a;l++)c[l*4]=t(),c[l*4+1]=t.range(-1,1),c[l*4+2]=o?t.range(1.3,2.4):t.range(5,10),c[l*4+3]=t();const h=new n.InstancedBufferGeometry;for(const l of["position","normal","color","aRough"])h.setAttribute(l,s.attributes[l]);h.setAttribute("aS",new n.InstancedBufferAttribute(c,4)),h.instanceCount=a,we(h,ue(ga,r0,{vertexColors:!0,side:n.DoubleSide},{...Qe(.5),uFlow:{value:9}}),2)}await f.yield();const he=(t,e=de)=>we(t.build(),e,0,!0),ot=(t,e,o)=>{const s=K(),a=(r,p,v)=>new d(r,p,v),c=1.3,h=t.clone().multiplyScalar(.5),l=(r,p,v,S,M=4.6)=>s.tri(r,p,v,S,M),i=(r,p,v,S,M,k)=>{l(r,p,v,M,k),l(r,v,S,M,k)},u=16,w=3,b=(r,p,v)=>{const S=ee(r*3.5/3.2,-3.5,3.5);return v.set(S,-.6,(.85+.2*(1-(S/3.5)**2))*p)},x=(r,p,v)=>v.set(r,2.45+.027*r*r,2.6*(1-Math.pow(Math.abs(r)/6.2,1.7))*p),C=[1,-1].map(r=>{const p=[],v=[],S=a(0,0,0),M=a(0,0,0);for(let oe=0;oe<=u;oe++){const Ce=-6.2+12.4*oe/u;b(Ce,r,S),x(Ce,r,M);for(let ie=0;ie<=w;ie++)p.push(Q(S.x,M.x,ie/w),Q(S.y,M.y,ie/w),Q(S.z,M.z,ie/w))}for(let oe=0;oe<u;oe++)for(let Ce=0;Ce<w;Ce++){const ie=oe*(w+1)+Ce,w0=ie+w+1;r>0?v.push(ie,w0,ie+1,w0,w0+1,ie+1):v.push(ie,ie+1,w0,w0,ie+1,w0+1)}const k=new n.BufferGeometry;k.setAttribute("position",new n.Float32BufferAttribute(p,3)),k.setIndex(v),k.computeVertexNormals(),s.add(k,null,t,4.6);const V=a(0,c+.25,1.5*r),j=a(0,6.3,0);l(j,a(2.6,c,0),V,e,6.6),l(j,V,a(-2.6,c,0),e,6.6);const se=[-6.2,6.2].map(oe=>b(oe,r,a(0,0,0))),be=[-6.2,6.2].map(oe=>x(oe,r,a(0,0,0))),j0=se.map((oe,Ce)=>oe.clone().lerp(be[Ce],(c-oe.y)/(be[Ce].y-oe.y)));return{K:se,G:be,D:j0}}),[A,y]=C;for(const r of[0,1])i(A.K[r],y.K[r],y.D[r],A.D[r],t),l(A.D[r],y.D[r],A.G[r],t);return i(A.D[0],A.D[1],y.D[1],y.D[0],h,6.5),o&&(B(s,a(0,6.2,0),a(0,8.6,0),.1,O.clone().multiplyScalar(.5),.6,4),l(a(0,8.5,0),a(0,7.4,0),a(-2.1,7.95,.35),o,-.55)),s},Ve=he(ot(z.paper,z.paper.clone().multiplyScalar(1.1),null),Rt);Ve.name="cream-boat",await f.yield();let Xe;if(m.rival==="walnut"){const t=K(),e=E(z.rust,_,.25,.9);t.add(new n.SphereGeometry(1,14,8,0,ae,G/2,G/2),g(0,2.2,0,0,0,0,5.6,2.9,3.7),o=>e.clone().multiplyScalar(.7+.3*Math.sin(o.x*9)*Math.sin(o.z*7+o.y*5)),.35),B(t,new d(0,0,0),new d(.3,8.5,0),.22,O.clone().multiplyScalar(.6),.6,5),t.add(new n.SphereGeometry(.5,6,5),g(.3,8.6,0),z.red,.4),t.tri(new d(.3,7.6,0),new d(.3,2.6,0),new d(-3.4,3.2,.9),z.red,.6),Xe=he(t,M0)}else if(m.rival==="duck"){const t=K();t.add(new n.SphereGeometry(1,14,10),g(0,1.6,0,0,0,0,5.2,2.6,3.2),z.red,.18),t.add(new n.SphereGeometry(1,12,8),g(3.4,5,0,0,0,0,2.1,2,1.9),z.red,.18),t.add(new n.ConeGeometry(.9,2.2,8),g(5.6,4.7,0,0,0,-G/2,1,1,1.4),T.clone().multiplyScalar(.6),.25),t.add(new n.ConeGeometry(1.5,3.2,8),g(-4.9,3.3,0,0,0,.9),z.red.clone().multiplyScalar(.8),.2);for(const e of[1,-1])t.add(new n.SphereGeometry(.42,6,5),g(4.5,5.6,1.25*e),U,.1);Xe=he(t)}else{const t=m.rival==="newsprint",e=E(O,_,.45,.7);Xe=he(t?ot(e,e.clone().multiplyScalar(1.08),xe):ot(z.red,z.red.clone().multiplyScalar(1.12),null),t?yo:Rt)}Xe.name="rival-boat",await f.yield();const xo=(()=>{const t=K();t.add(X(5.4,1.7,3.7,.2),g(0,.7,0),E(le,H,.5,.8),.5),t.add(X(4.6,1.2,3.3,.15),g(1.6,.75,0),O.clone().multiplyScalar(.5),.6);for(let e=0;e<3;e++)B(t,new d(-1.2,1.75,-1+e),new d(3.6,1.75+.12*e,-1.1+e*1.05),.2,O.clone().multiplyScalar(.55),.6,4),t.add(new n.SphereGeometry(.34,6,5),g(3.7,1.8+.12*e,-1.1+e*1.05),z.rust,.5);return he(t)})(),Dt=(()=>{const t=K(),e=E(T,_,.45,.42);return t.add(new n.CylinderGeometry(1.25,1.15,4.5,14,3),g(0,0,0,G/2,0,0),o=>e.clone().multiplyScalar(.75+.35*R.n3(o.x*2,o.y*2,o.z*2)+(Math.atan2(o.z,o.x)>2?-.25:0)),.75),he(t)})();await f.yield();const _t=(()=>{const t=K(),e=new n.CylinderGeometry(2.7,3,.7,21,1),o=e.attributes.position;for(let s=0;s<o.count;s++){const a=Math.atan2(o.getZ(s),o.getX(s));if(Math.hypot(o.getX(s),o.getZ(s))>.1&&o.getY(s)<0){const h=1+.06*Math.cos(a*21);o.setX(s,o.getX(s)*h),o.setZ(s,o.getZ(s)*h)}}return e.computeVertexNormals(),t.add(e,null,z.steel,.14),t.add(new n.CylinderGeometry(1.7,1.7,.74,16),null,z.red.clone().lerp(z.iron,.75),.25),he(t)})(),at=(()=>{const t=K(),e=E(z.rust,U,.3,1.1);return t.add(new n.SphereGeometry(2,14,10),null,o=>o.y>1.45?_.clone().multiplyScalar(.5):e,.12),he(t)})();await f.yield();const Mo=(()=>{const t=K(),e=new d(0,0,0);t.add(new n.TorusGeometry(35,2,6,44),null,z.iron.clone().multiplyScalar(.6),.4),t.add(new n.TorusGeometry(32.6,.9,5,44),null,z.steel,.14),t.add(new n.CylinderGeometry(2.4,2.4,9,8),g(0,0,0,G/2,0,0),z.steel,.2);for(let s=0;s<20;s++){const a=s/20*ae;B(t,e.clone().setZ(s%2?3:-3),new d(Math.cos(a)*32,Math.sin(a)*32,0),.3,z.steel,.12,3)}t.add(X(5,2.2,1.2,.3),g(22,0,0),T,-.9);const o=he(t);return o.position.copy(q0),o})(),Ut=new n.Quaternion().setFromUnitVectors(new d(0,0,1),l0),Vt=44,Ot=(()=>{const t=new n.SphereGeometry(1,10,7),e=t.attributes.position.count,o=E(_,H,.4,.5),s=new Float32Array(e*3);for(let c=0;c<e;c++)s[c*3]=o.r,s[c*3+1]=o.g,s[c*3+2]=o.b;t.setAttribute("color",new n.Float32BufferAttribute(s,3)),t.setAttribute("aRough",new n.Float32BufferAttribute(new Float32Array(e).fill(8.05),1));const a=new n.InstancedMesh(t,ue(S0,r0,{vertexColors:!0},Qe(0,.3,0,1)),Vt);return a.frustumCulled=!1,$.add(a),a})(),u0=(t,e,o,s,a,c=1)=>{W.makeScale(a,a*c,a).setPosition(e,o,s),Ot.setMatrixAt(t,W)};await f.yield();const nt=40,U0=new Float32Array(nt*3),P0=new Float32Array(nt*4),Te=(t,e,o,s,a)=>{U0[t*3]=e.x,U0[t*3+1]=e.y,U0[t*3+2]=e.z,P0[t*4]=o.r*s,P0[t*4+1]=o.g*s,P0[t*4+2]=o.b*s,P0[t*4+3]=a},V0=T.clone().lerp(O,.15);{let t=18;const e=m.lampGain;if(Te(t++,Ct,V0,1.5*e,46),Te(t++,s0.lampHead,V0,1.6*e,54),m.hour!=="night")for(const[o,s,a]of[[-90,400,-560],[-90,400,-1050],[-90,400,-1540],[590,392,330],[590,388,-250],[590,388,-820],[590,388,-1400],[-600,396,505],[-1150,396,505],[470,410,760]])Te(t++,D.set(o,s,a),V0,1.25*e,60)}const rt=mo(nt,{aPos:{array:U0,size:3},aCol:{array:P0,size:4}});we(rt,new n.ShaderMaterial({vertexShader:fa,fragmentShader:va,transparent:!0,depthWrite:!1,blending:n.AdditiveBlending,fog:!1}),7);{const t=Me.clone().lerp(Re,.5);t.y=Me.y-7.5,t.x=Q(Me.x,Re.x,.72),t.z=Q(Me.z,Re.z,.72);const e=new n.QuadraticBezierCurve3(Me.clone().setY(Me.y-3.4),t,Re.clone().setY(Re.y-1)),o=new n.TubeGeometry(e,14,1.5,10,!1),s=o.attributes.position,a=new d;for(let c=0;c<=14;c++){e.getPointAt(c/14,a);const h=c/14,l=Q(2.3,.95,L(0,.4,h))*Q(1,1.3,L(.75,1,h)),i=Q(.42,1,L(0,.4,h));for(let u=0;u<=10;u++){const w=c*11+u;s.setXYZ(w,a.x+(s.getX(w)-a.x)*l,a.y+(s.getY(w)-a.y)*l*i,a.z+(s.getZ(w)-a.z)*l)}}we(o,ue(ya,ba,{transparent:!0,depthWrite:!1}),3,!0),Le.uPipe.value.set(Re.x,Re.z,1)}await f.yield();const fe=[],ce=[];let zo=690,Wt=95,st=1,Ze=null;const Kt=new n.Quaternion,Po=new n.Quaternion,Co=new d(1,1,1),ko=new d(0,1,0);if(m.vehicle==="tram"){const t=K(),e=E(H,_,.35,.9),o=z.iron.clone().multiplyScalar(1.1),s=T.clone().lerp(O,.12);for(const i of[-46,0,46])t.add(X(204,6,i?7:12,1.5),g(0,54,i),o,.5);for(const i of[-96,-28,28,96])for(const u of[-46,46])t.add(X(7,17,7,1.5),g(i,43.5,u),o,.45);t.add(X(220,68,150,7),g(0,91,0),e,.3),t.add(X(221,8,151,2),g(0,123,0),O.clone().multiplyScalar(.6),.25),t.add(X(221.4,4,151.4,1.4),g(0,59.5,0),E(_,T,.45,1.25),.1);for(let i=-99;i<=99;i+=22)for(const u of[-75.3,75.3])t.add(new n.BoxGeometry(1.1,50,.9),g(i,92,u),o.clone().multiplyScalar(.7),.5);for(const i of[-75.4,75.4])t.add(new n.BoxGeometry(206,1.6,1),g(0,110,i),O.clone().multiplyScalar(.42),.2),t.add(new n.BoxGeometry(150,12,1),g(0,96,i),E(H,U,.5,.8),.35);for(const i of[-73.1,73.1])for(const[u,w]of[[-88,52],[-58,58],[-20,49],[12,56],[50,51],[84,57]])t.add(new n.CircleGeometry(8.5,12),g(u,130+w,i+.25*Math.sign(i),0,i<0?G:0,0,1,1.15,1),U.clone().multiplyScalar(.5),-1),t.add(new n.CircleGeometry(15,12),g(u,130+w-22,i+.2*Math.sign(i),0,i<0?G:0,0,1,1,1),U.clone().multiplyScalar(.5),-1);for(let i=-90;i<=90;i+=36)for(const u of[-75.8,75.8])t.add(new n.BoxGeometry(16,5,1.6),g(i,74,u),s,-1.3);for(const i of[-110.6,110.6])t.add(new n.BoxGeometry(1.6,9,60),g(i,108,0),s,-1.4);await f.yield(),t.add(new n.BoxGeometry(215,134,146),g(0,193,0),s,-1.7);for(let i=-108;i<=108;i+=36)for(const u of[-74.5,74.5])t.add(new n.BoxGeometry(7,136,4),g(i,193,u),e,.3);for(const i of[-109,109])for(const u of[-50,0,50])t.add(new n.BoxGeometry(4,136,9),g(i,193,u),e,.3);for(const i of[-74.6,74.6])t.add(new n.BoxGeometry(216,4,3),g(0,232,i),e,.3);t.add(X(222,28,152,5),g(0,273,0),e,.3),t.add(X(212,16,132,6),g(0,294,0),o,.4),t.add(X(160,12,70,4),g(0,307,0),o,.4);for(const i of[-62,62]){t.add(X(86,12,74,2),g(i,30,0),o,.4),t.add(new n.CylinderGeometry(3.2,3.2,104,8),g(i,26,0,G/2,0,0),o,.3);for(const u of[-50,50])ce.push({x:i,z:u})}for(const i of[-112,112])t.add(new n.SphereGeometry(7,10,8),g(i,95,0),T.clone().lerp(O,.15),-3);B(t,new d(-10,312,0),new d(-86,486,0),1.8,o,.3,5),B(t,new d(-86,486,-9),new d(-86,486,9),2.2,o,.3,5);const a=t.build(),c=ce.splice(0);for(let i=0;i<3;i++){const u=new n.Mesh(a,de);u.frustumCulled=!1,$.add(u),fe.push({obj:u,off:110+i*230,half:62,spin:[],legs:[]});for(const w of c)ce.push({car:i,x:w.x,z:w.z})}{const i=K(),u=z.steel.clone().multiplyScalar(.75),w=E(z.steel,_,.5,1.2);i.add(new n.TorusGeometry(22.6,3.3,5,28),g(0,0,0,0,0,0,1,1,1.25),u,.2),i.add(new n.CylinderGeometry(26,26,9,28,1,!0),g(0,0,0,G/2,0,0),w,.12);for(const b of[-4.6,4.6])i.add(new n.TorusGeometry(25.2,1.5,3,28),g(0,0,b),w,.1);for(let b=0;b<8;b++){const x=b/8*ae;i.add(new n.CylinderGeometry(1.7,2.3,15,6,1,!0),g(-Math.sin(x)*13.2,Math.cos(x)*13.2,0,0,0,x),u,.25)}i.add(new n.CylinderGeometry(7,7,12,10),g(0,0,0,G/2,0,0),o,.3);for(const b of[-6,6])i.add(new n.SphereGeometry(3.6,7,4),g(0,0,b,0,0,0,1,1,.5),w,.15);Ze=new n.InstancedMesh(i.build(),de,ce.length),Ze.frustumCulled=!1,$.add(Ze)}await f.yield();const h=new n.PlaneGeometry(250,520,1,1).rotateX(-G/2),l=new n.ShaderMaterial({uniforms:{uTime:me.uTime,uC:{value:s.clone().multiplyScalar(.55*(.5+.5*m.win)+.25)}},vertexShader:"varying vec2 vQ; varying vec3 vW; void main(){ vQ = position.xz; vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }",fragmentShader:o0+`
          uniform vec3 uC; varying vec2 vQ; varying vec3 vW;
          void main(){
            float az = abs(vQ.y), out1 = max(az - 70.0, 0.0);
            float g = exp(-out1 * 0.012) * pbSS(60.0, 80.0, az) * pbSS(125.0, 96.0, abs(vQ.x));
            g *= 0.55 + 0.45 * sin(vQ.x * 0.1745 + 1.5708);                                    // one bar of light per window
            g *= 0.35 + 0.65 * pbSS(0.25, 0.75, pbFbm(vW.xz * 0.11 + vec2(0.0, uTime * 0.15))); // broken by the wet cobbles
            g += 0.5 * exp(-out1 * 0.05) * pbSS(60.0, 76.0, az) * pbSS(118.0, 100.0, abs(vQ.x));
            g *= 1.0 - pbSS(-50.0, -44.0, vW.x) * pbSS(19.0, 14.0, vW.x);                             // the gutter's water carries the strip itself (WATER_FRAG)
            gl_FragColor = vec4(uC * g * pbSS(260.0, 180.0, az), 1.0);
          }`,transparent:!0,depthWrite:!1,blending:n.AdditiveBlending,fog:!1});for(const i of fe){const u=new n.Mesh(h,l);u.position.y=1.2,u.renderOrder=2,u.frustumCulled=!1,i.obj.add(u)}}else{zo=520,Wt=150,st=-1;const t=E(z.rust,H,.4,.8),e=z.iron.clone().multiplyScalar(.5),o=K(),s=K();o.add(X(290,14,124,3),g(0,100,0),t,.6);for(const y of[-62,62])o.add(X(290,34,6,2),g(0,122,y),t.clone().multiplyScalar(.8),.6);for(const y of[-95,95])B(o,new d(y,48,-66),new d(y,48,66),5,e,.3,8);for(let y=0;y<4;y++)o.add(new n.CylinderGeometry(34,34,92,14),g(-90+y*62,153,(y%2?1:-1)*6,0,0,0),t.clone().multiplyScalar(.6+.12*y),.5);for(const y of[-40,40])B(o,new d(140,100,y),new d(330,120,y),3.5,t,.5,6);o.add(new n.SphereGeometry(9,10,8),g(150,150,66),T,-3.2),B(o,new d(145,107,62),new d(150,142,66),1.5,e,.3,4),s.add(new n.TorusGeometry(46,3.2,6,30),null,z.steel.clone().multiplyScalar(.7),.2),s.add(new n.CylinderGeometry(8,8,12,10),g(0,0,0,G/2,0,0),e,.4);for(let y=0;y<12;y++){const r=y/12*ae;B(s,new d(0,0,0),new d(Math.cos(r)*45,Math.sin(r)*45,0),2.2,t,.5,5,1.6)}const a=new n.Group,c=s.build(),h=new n.Mesh(o.build(),de),l=[];h.frustumCulled=!1,a.add(h);for(const y of[-95,95])for(const r of[-66,66]){const p=new n.Mesh(c,de);p.position.set(y,48,r),p.frustumCulled=!1,a.add(p),l.push(p),ce.push({car:1,x:y,z:r})}const i=K(),u=E(z.rust,U,.35,.9),w=K();i.add(new n.SphereGeometry(1,14,10),g(0,165,0,0,0,0,78,44,38),u,.5),B(i,new d(55,180,0),new d(100,250,0),26,u,.5,8,17),i.add(new n.SphereGeometry(1,10,8),g(118,262,0,0,0,-.5,32,17,15),u,.5),B(i,new d(-74,180,0),new d(-96,110,0),5,U,.6,5,2),B(w,new d(0,0,0),new d(4,-66,0),12,u,.5,6,8),B(w,new d(4,-66,0),new d(0,-128,0),8,u,.5,6,7),w.add(new n.CylinderGeometry(9,12,14,8),g(1,-133,0),U,.3);const b=new n.Group,x=new n.Mesh(i.build(),de),C=w.build(),A=[];x.frustumCulled=!1,b.add(x);for(const y of[-50,50])for(const r of[-20,20]){const p=new n.Mesh(C,de);p.position.set(y,140,r),p.frustumCulled=!1,b.add(p),A.push(p),ce.push({car:0,x:y,z:r})}$.add(b,a),fe.push({obj:b,off:110,half:50,spin:[],legs:A},{obj:a,off:370,half:95,spin:l,legs:[]})}await f.yield();const it=ce.length+14,d0=new Float32Array(it*2),C0=(()=>{const t=new n.PlaneGeometry(1,1).translate(0,.5,0);t.setAttribute("aF",new n.InstancedBufferAttribute(d0,2));const e=new n.InstancedMesh(t,ue(ma,wa,{transparent:!0,depthWrite:!1,side:n.DoubleSide}),it);return e.frustumCulled=!1,e.renderOrder=4,$.add(e),e})();for(let t=0;t<ce.length+12;t++)d0[t*2]=P()+(t>=ce.length?2:0);{const t=q("paper-boat-rapids:slap-fans");for(let e=ce.length+12;e<it;e++)d0[e*2]=t()}await f.yield();const Et=(()=>{const t=new n.Group,e=K(),o=K(),s=E(H,_,.5,.75),a=E(z.rust,T,.25,.9);e.add(new n.SphereGeometry(1,12,8),g(0,.7,0,0,0,0,4.6,1,1.5),s,.15),e.add(new n.SphereGeometry(1,10,8),g(3.6,1.3,0,0,0,.5,1.6,1,1),s,.15),e.add(new n.SphereGeometry(2.6,14,10),g(-.6,3,0,0,0,0,1,1,.72),l=>a.clone().multiplyScalar(.7+.4*Math.sin(Math.hypot(l.x,l.y)*5)),.2),B(o,new d(0,0,0),new d(0,3,0),.26,s,.2,5,.18),o.add(new n.SphereGeometry(.36,6,5),g(0,3.1,0),U,.15),t.add(new n.Mesh(e.build(),de));const c=o.build(),h=[];for(const l of[-.5,.5]){const i=new n.Mesh(c,de);i.position.set(4.4,1.9,l),i.rotation.set(l*.9,0,-.45),t.add(i),h.push(i)}return ke(282,F),te(282,-18,12,t.position),t.rotation.y=Math.atan2(-F.hz,F.hx),$.add(t),{g:t,horns:h}})();await f.yield();const Ht=(()=>{const t=new n.Group,e=K(),o=K(),s=E(z.rust,H,.35,1.1),a=E(_,O,.3,.6);e.add(new n.SphereGeometry(1,12,9),g(0,0,0,0,0,.25,7.2,4.6,4.6),l=>l.y<-.25?a:s,.7),e.add(new n.SphereGeometry(3.1,10,8),g(5.6,3.6,0),l=>l.y<-.6?a:s.clone().multiplyScalar(.8),.7),e.add(new n.ConeGeometry(1,2.6,6),g(8.9,3.3,0,0,0,-G/2),U,.3);for(const l of[-1.5,1.5])e.add(new n.SphereGeometry(.45,6,5),g(7.3,4.5,l),U,.08);e.add(X(8,.6,3.6,.2),g(-9,.4,0,0,0,.12),s.clone().multiplyScalar(.7),.7);for(const l of[-1.4,1.4])B(e,new d(.5,-3.6,l),new d(1.5,-6.6,l),.3,U,.4,4);o.tri(new d(3.5,0,0),new d(-4.5,0,0),new d(-2,0,11),s.clone().multiplyScalar(.8),.7).tri(new d(3.5,0,0),new d(-2,0,11),new d(2,0,7),s,.7),t.add(new n.Mesh(e.build(),de));const c=o.build(),h=[];for(const l of[1,-1]){const i=new n.Mesh(c,M0);i.position.set(0,2.2,2.6*l),i.scale.z=l,t.add(i),h.push(i)}return t.traverse(l=>{l.frustumCulled=!1}),$.add(t),{g:t,wings:h}})();await f.yield();const jt=(()=>{const t=K(),e=U.clone().multiplyScalar(.8);t.add(new n.SphereGeometry(1,8,6),g(0,1.1,0,0,0,0,2.6,.45,.55),e,.3);for(const o of[1,-1])for(const[s,a,c]of[[1.4,5.5,3.2],[0,.3,6.2],[-1.2,-5.2,4.2]])B(t,new d(s,1.1,0),new d((s+a)/2,2.1,c*o*.5),.14,e,.3,4),B(t,new d((s+a)/2,2.1,c*o*.5),new d(a,.1,c*o),.14,e,.3,4),t.add(new n.CircleGeometry(1.1,10).rotateX(-G/2),g(a,.05,c*o),O.clone().lerp(T,.3),-1.3);return he(t)})();await f.yield();const It=(()=>{const t=K(),e=E(z.rust,_,.45,.9),o=[],s=new d(0,1,0).applyMatrix4(J0);for(let i=0;i<=10;i++){const u=-.41+.82*i/10,w=.07*Math.sin(i*.9)-.05,b=(u*u+w*w)*4;o.push(new d(u,Math.pow(Math.sqrt(Math.max(1-b,.03)),.55)+.07,w).applyMatrix4(J0).sub(s))}const a=new n.CatmullRomCurve3(o),c=a.getSpacedPoints(96),h=i=>{let u=0,w=1e9;for(let b=0;b<=96;b++){const x=c[b].distanceToSquared(i);x<w&&(w=x,u=b)}return u/96};t.add(new n.TubeGeometry(a,96,.62,8,!1),null,i=>{const u=h(i),w=L(.26,.29,u)*(1-L(.37,.4,u));return e.clone().multiplyScalar(Q(.74+.2*L(-.5,.5,Math.sin(u*24*ae)),1.2,w)*(.85+.15*Math.sin(u*G)))},.22);const l=he(t);return l.position.copy(s),l.frustumCulled=!1,l})();await f.yield();const ze=P.fork("dam"),Qt=(()=>{const t=K(),e=K(),o=E(xe,z.rust,.86,.42);{const c=I0(ze);t.add(c,g(0,0,0,0,0,0,12,6,12),_0(c,z.leaf.clone().multiplyScalar(1.3)),12.42)}e.add(new n.SphereGeometry(1,10,6,0,ae,0,G/2),g(1.5,.4,.8,0,0,0,.6,.42,.5),c=>Math.abs(Math.sin(c.x*5.5)*Math.sin(c.z*6))>.8?U:o,.8),e.add(new n.SphereGeometry(.22,8,6),g(2.05,.5,.8),U,.6);const s=he(t,M0),a=new n.Mesh(e.build(),de);return a.frustumCulled=!1,s.add(a),s})();await f.yield();const O0=12,Yt=(()=>{const t=K(),e=I0(ze);t.add(e,null,_0(e,new n.Color(1,1,1)),10.42);const o=new n.InstancedMesh(t.build(),M0,O0),s=new n.Color;for(let a=0;a<O0;a++)o.setColorAt(a,s.copy(z.leaf).multiplyScalar(ze.range(.8,1.35)).lerp(z.rust,ze.range(.1,.5)));return o.frustumCulled=!1,$.add(o),o})(),Ao=Array.from({length:O0},(t,e)=>({d:-13+e*2.36,ds:ze.range(-2.5,2.5),rx:ze.range(-.7,.7),rz:ze.range(-.6,.6),ry:ze.range(0,ae),sc:ze.range(9,12.5),sp:ze.range(.8,1.22),lane:(e%2?1:-1)*ze.range(10,12.5)}));await f.yield();{let t=40507;const e=()=>(t=t*1664525+1013904223>>>0,t/4294967296),o=Math.round((m.season==="autumn"?84:m.season==="winter"?26:14)*m.density*m.detail),s=K(),a=I0(q("paper-boat-rapids:stuck-leaf-shape"),20,[.88,1]);s.add(a,null,_0(a,new n.Color(1,1,1)),10.4);const c=new n.InstancedMesh(s.build(),M0,o+2),h=new n.Color;{const l=q("paper-boat-rapids:kerb-leaf"),i=new d(0,1,0),u=new n.Quaternion;for(let w=0;w<2;w++){const b=l.range(80+160*w,240+160*w),x=l.range(5.2,5.9);Z(b,-15.2,pe(b)+l.range(5.8,6.1),D),ne.set(-F.hz,0,F.hx),Ue.setFromUnitVectors(i,ne).multiply(u.setFromAxisAngle(i,l.range(0,ae))),W.compose(D,Ue,ne.set(x,x*.3,x)),c.setMatrixAt(o+w,W),c.setColorAt(o+w,h.copy(z.leaf).multiplyScalar(l.range(1.4,1.9)).lerp(z.rust,l.range(.1,.4)))}}for(let l=0;l<o;l++){const i=30+700*e(),u=e()*e(),w=e()<.72,b=7.5+5.5*e(),x=w?g0(i)+7+95*u:-(n0(i)?24+90*u:b0(i)+8+70*u);Z(i,x,$0(i,x)+(w||!n0(i)?3.1:.5),D),W.compose(D,Ue.setFromEuler(i0.set((e()-.5)*.3,e()*ae,(e()-.5)*.3)),ne.set(b,b*.45,b)),c.setMatrixAt(l,W),c.setColorAt(l,h.copy(z.leaf).multiplyScalar(.75+.6*e()).lerp(z.rust,.1+.45*e()))}c.frustumCulled=!1,$.add(c)}await f.yield();for(let t=0;t<3;t++)B(N,te(703+t,-15,.9+t*.5),te(705-t,15.5,.2+t*.4),.28,z.rust.clone().multiplyScalar(.35),.7,5);const Lo=Z(670,96,J(670)+2.5,new d),W0=Z(675,34,J(675)-2.7,new d),Ma=Z(686,80,J(686)+2.5,new d),p0=W0.clone().setY(0),Ro=Z(640,12,pe(640)+46,new d),lt=m.rare?(()=>{const t=K(),e=new n.Color(T.r,T.g*1.12,T.b*.6).multiplyScalar(.88),o=e.clone().multiplyScalar(.4),s=E(U,H,.4,.9);t.add(X(25,9.5,11,4),g(5.5,5.4,0),e,.15),t.add(new n.SphereGeometry(1,12,8),g(15,5.4,0,0,0,0,6.5,5.2,5.7),e,.15),t.add(new n.CylinderGeometry(6.6,5.4,31,16,1),g(-3.5,23,0),e,.15),t.add(new n.TorusGeometry(6.5,.9,6,18),g(-3.5,38.5,0,G/2,0,0),e.clone().multiplyScalar(1.15),.15),t.add(X(27.5,2.2,12,.8),g(6,1.1,0),o,.4),t.add(X(9,3.4,11.5,.8),g(-4.5,1.7,0),o,.4),t.add(new n.CylinderGeometry(4.6,4,150,10,6),g(-3.5,112,0),s,.8,{shade:(l,i)=>1-.9*L(60,150,i)});const a=t.build(),c=[0].map(()=>{const l=new n.Mesh(a,bo);return l.frustumCulled=!1,$.add(l),l});ke(676,F);const h=Math.atan2(-F.hz,F.hx)+G/2+.35;return c[0].rotation.y=h+.5,{boots:c}})():null;await f.yield();const K0=(()=>{const t=K(),e=U.clone().multiplyScalar(.5);t.add(new n.SphereGeometry(58,14,6,0,ae,0,G/2.4),g(0,168,-8,-.21,0,0,1,.5,1),e,.3),B(t,new d(9,118,-6),new d(3,197,-14),1.2,e,.5,4),t.add(new n.CylinderGeometry(12,17,66,8),g(0,108,0),e,.8),t.add(new n.SphereGeometry(1,10,6),g(0,141,0,0,0,0,19,7,11),e,.8),t.add(new n.SphereGeometry(9,10,8),g(0,157,-1),e,.6),B(t,new d(15,138,0),new d(10,116,-7),4,e,.8,5);const o=he(t),s=[];for(const a of[-6.5,6.5]){const c=K();B(c,new d(0,0,0),new d(0,-78,0),6,e,.8,6,7),c.add(X(9,5,17,1.5),g(0,-76,-4),e,.5);const h=new n.Mesh(c.build(),de);h.position.set(a,78,0),o.add(h),s.push(h)}return{m:o,legs:s}})();await f.yield();const No=we(new n.PlaneGeometry(1,1),new n.ShaderMaterial({uniforms:{...me,uK:{value:0}},vertexShader:`uniform float uK; varying vec2 vUv; varying float vF;
        void main(){ vUv = vec2(position.x * 2.0, position.y + 0.5);
          vec3 c = vec3(0.0, -6.0, -24.0), tc = cameraPosition - c; float dist = length(tc);
          vec3 rt = normalize(vec3(tc.z, 0.0, -tc.x) + 1e-5);
          vec3 p = c + rt * position.x * 130.0 + vec3(0.0, 1.0, 0.0) * (position.y + 0.5) * 210.0;
          vF = uK * smoothstep(60.0, 190.0, dist) * exp(-dist * 0.0012);
          gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0); }`,fragmentShader:o0+`
        varying vec2 vUv; varying float vF;
        void main(){
          float w = 0.16 + 0.6 * vUv.y, x = vUv.x / w;
          float n = pbFbm(vec2(vUv.x * 3.0, vUv.y * 2.2 - uTime * 0.22));
          float g = 0.4 * exp(-x * x * 3.4) * pbSS(0.62, 0.0, vUv.y) * pbSS(0.62, 0.0, vUv.y) * pbSS(0.0, 0.05, vUv.y) * (0.55 + 0.9 * n);      // (polish 3) a low glow over the mouth, not a column
          g += 1.6 * exp(-(vUv.x * vUv.x * 60.0 + vUv.y * vUv.y * 900.0));            // the bright mouth itself
          gl_FragColor = vec4(mix(uPortalCol, uLampCol * 0.4, 0.35) * g * vF * (0.85 + 0.15 * sin(uTime * 0.9)), 1.0);
        }`,transparent:!0,depthWrite:!1,depthTest:!0,blending:n.AdditiveBlending,fog:!1}),6).material.uniforms;await f.yield(),we(N.build(),de),await f.yield();const $t=10,E0=t=>(2.4*Math.sin(t*.021+1)+5*(1-L(20,75,t))-5.6*Math.exp(-(((t-606)/22)**2)))*(1-L(650,740,t)),H0=[[10,-4,16.5,6.2,0,16,.23,.37],[60,-5,15.5,6,-4,10,.23,.36],[152,10,25.5,3.4,-5,8,.4,.45],[197,10,25.5,3.4,-5,8,.4,.45],[238,24,21,4.2,12,6,.25,.33],[260,24,21,4.2,12,6,.25,.33],[328,8,16.5,6.8,0,22,.2,.235],[388,8,16.5,6.8,0,22,.2,.235],[408,12,19,6,-16,4,.22,.3],[486,-12,14.5,4.4,8,8,.25,.36],[538,-12,14.5,4.4,8,8,.25,.36],[566,12,14.5,4.8,10,6,.27,.34],[fo-14.5,12,14.5,4.8,10,6,.27,.34],[618,14,22,6,-6,8,.24,.34],[690,8,22,7,-6,8,.24,.34],[De-15,-30,17.5,4.4,7,6,.25,.34],[810,-30,17.5,4.4,7,6,.25,.34],[850,0,19,7,0,22,.23,.37]],k0=new Float32Array(8),ct=t=>{let e=1;for(;e<H0.length-1&&t>H0[e][0];)e++;const o=H0[e-1],s=H0[e],a=L(o[0],s[0],t);for(let c=1;c<8;c++)k0[c]=Q(o[c],s[c],a);return k0[1]*=G/180,k0[4]*=G/180,k0[5]*=G/180,k0},Xt=t=>{const e=ct(t);return e[2]*Math.cos(e[1])},ut=[];for(let t=$t;t<=850;t+=t>=560&&t<640?5:10){const e=ct(t);ut.push(Z(t,E0(t)+e[2]*Math.sin(e[1]),pe(t)+.5*vo(t)+e[3],new d))}for(const t of s0.flyThrough.slice(2))ut.push(t.clone());const Je=$o(ut),dt=Je.length;await f.yield();const pt=new Float32Array(257);for(let t=0;t<=256;t++)Je.pointAt(t/256,D),pt[t]=D.z<=146?900-D.z:Se(D.x,D.z).s;const Zt=t=>{const e=ee(t,0,1)*256,o=Math.min(255,Math.floor(e));return Q(pt[o],pt[o+1],e-o)},za=t=>ee((t-$t)/dt,0,1),Jt=dt/40,A0=(t,e,o)=>{if(t<=e[0][0])return e[0][1];for(let s=1;s<e.length;s++)if(t<=e[s][0]){let a=(t-e[s-1][0])/(e[s][0]-e[s-1][0]);return o&&(a=a*a*(3-2*a)),Q(e[s-1][1],e[s][1],a)}return e[e.length-1][1]},h0=(t,e)=>{const o=Math.sin(t*12.9898+e*78.233)*43758.5453;return o-Math.floor(o)},Pe=(t,e,o,s)=>L(e,e+s,t)*(1-L(o-s,o,t)),Oe={x:0,y:0,z:17},ht=new d,eo=(t,e,o)=>(o.x=e+4,o.y=Math.max(1.3*Pe(t,392,545,40),m.rare?1.8*L(636,660,t)*(1-L(880,900,t)):0),o.z=17,o),ye=(t,e,o,s=Oe)=>{const a=s.y*Math.exp(-(((t-s.x)/s.z)**2));return t>De?(Z(t,e,0,ht),ve.waterHeight(ht.x,ht.z)+a):pe(t)+vo(t)+a+.12*Math.sin(o*2.1+t*.25)},Fo=t=>G*(1-L(26,71,t)),Go=(t,e)=>.1+.006*Nt(t)+.3*Math.abs(e),L0=(t,e,o,s,a,c,h=0,l=null,i=Oe)=>{let u,w,b;if(e<=898){let x=ye(e,o,s,i);a<2&&(x=Math.max(x,.5*(ye(e-4.5,o,s,i)+ye(e+4.5,o,s,i)))),Z(e,o,x+c,t.position),ke(e,F);const C=ye(e+5,o,s,i)-ye(e-5,o,s,i),A=C/10;u=Math.atan2(-F.hz,F.hx)+h+Go(e,A)*R.n2(s*.45,a*7.1),l&&(u+=Fo(e)-Math.atan((l(e+1)-l(e-1))/2)),w=(a<2?ee(Math.atan2(C,10),-.4,.38):ee(Math.atan2(ye(e+3,o,s,i)-ye(e-3,o,s,i),6)*1.3,-.72,.62))+.06*Math.sin(s*3.1+a),b=.12*R.n2(s*.6+5,a*3.3)+.05*Math.sin(s*2.3+a*2)}else{const x=e-898;let C=-.7-.05*x*x;u=G/2+.3*Math.sin(x*.2+a),w=-Math.min(x*.075,1.35),b=.3*Math.sin(x*.3+a),C<-44.3&&(C=-44.3+.5*Math.sin(s*3+a),w=.25*Math.sin(s*2.2+a),u+=s*.8),t.position.set(o*(1-Math.min(x/40,.6)),C+c,2-Math.min(x*.8,24+a*3))}t.rotation.set(b,u,w,"YZX")};ve.uniforms.uHull&&(ve.uniforms.uHull.value=Le.uBoat.value,ve.uniforms.uHullD.value=Le.uBoatD.value);const ft=(t,e,o,s)=>{const a=e.rotation.y;Le.uBoat.value[t].set(e.position.x,e.position.z,o),Le.uBoatD.value[t].set(Math.cos(a),-Math.sin(a),s)},vt=612,to=50,R0=60,oo=[[R0,to-R0],[156,-6],[239,0],[Fe,9],[qe,9-8*y0],[445,11],[606,14],[672,-3],[703,-1],[860,5.5],[900,7]],Bo=t=>{if(t<=R0)return to;const e=oo[1][0]-R0,o=ee((t-R0)/e,0,1);return t+A0(t,oo,!0)-e*o*(1-o)*(1-o)},ao=t=>E0(t)+Q(8,1.5,L(560,590,t)*(1-L(606,625,t)))+9*(1-L(38,62,t)),mt=m.vehicle==="tram"?[[80,-360],[320,1655],[404,2367],[520,3050],[650,3740],[900,4400]]:[[90,-350],[328,1655],[404,2200],[520,2850],[650,3440],[900,3900]],To=m.rival==="walnut"?-.35:m.rival==="duck"?-.2:-.6,no=(t,e,o,s)=>L0(t,e,E0(e),o,0,-.6+.7*Pe(e,598,654,8),0,E0,s),qo=(t,e,o,s)=>{const a=Bo(e);return L0(t,a,ao(a),o,1,To+.6*Pe(a,598,654,8),0,ao,s),a},Do=(t,e,o,s,a)=>{const c=Math.min(1,fe.length-1),h=fe[c],l=A0(t,mt)-h.off;Ye(l+h.half,s),Ye(l-h.half,a);const i=(s.x+a.x)/2,u=(s.z+a.z)/2;return o.set(i,et(i,u)+(h.legs.length?0:.3*Math.sin(e*7+c)),u)},_o=m.rare?640:668,e0=te(716,-22,18.6),Uo=te(588,34,33),wt=te(640,0,48),yt=te(520,70,200),ro=(t,e)=>{if(t<600){const o=L(552,600,t);e.lerpVectors(Uo,e0,o),e.y+=12*Math.sin(G*o)*(1-o)}else if(t<692)e.copy(e0);else{const o=ee((t-692)/40,0,1.6),s=(1-o)*(1-o),a=2*o*(1-o),c=o*o;e.set(e0.x*s+wt.x*a+yt.x*c,e0.y*s+wt.y*a+yt.y*c,e0.z*s+wt.z*a+yt.z*c)}return e},Ne={x:0,z:0,hx:1,hz:0},N0={x:0,z:0,hx:1,hz:0},We=new d,Pa=new d(0,1,0),so=new d(0,0,1),Vo=$e.clone().normalize(),io=.3,Oo=[[300,0],[345,.26],[400,.2],[455,.08],[520,.16],[600,0],[640,.22],[700,.22],[730,0]],f0=new d,bt=new d,v0=new d,gt=new d,St=new d,t0=new d,m0=new d,Wo=new d(0,170,-84),Ko=m.rare?W0.clone().setY(W0.y+16):e0.clone().setY(e0.y+4),xt={position:new d,rotation:new n.Euler},lo={x:0,y:0,z:17},Mt=new d,Eo={x:0,z:0,hx:1,hz:0},Ho={x:0,z:0,hx:1,hz:0},F0=(t,e)=>(e>.001&&(St.copy(t).sub(f0).normalize(),gt.addScaledVector(St,e)),e);function jo(t,e){const o=Zt(e),s=ee(e,0,1)*dt;Je.posAtDist(s,f0),Je.posAtDist(s+34,bt),bt.y+=2.4,gt.set(0,0,0);let a=F0(q0,.25*Pe(o,125,214,25));const c=o+Xt(o);eo(o,c,lo),no(xt,c,t,lo),Do(o,t,Mt,Eo,Ho),Mt.y+=14,a+=F0(Mt,.3*Pe(o,296,436,26)),a+=F0(Wo,A0(o,Oo)),a+=F0(Ko,(m.rare?.3:.22)*Pe(o,m.rare?588:604,m.rare?650:696,20)),a+=F0(s0.viewpoints.approach.at,.3*Pe(o,730,880,40));const h=a>io?io/a:1;v0.copy(bt).sub(f0).normalize().multiplyScalar(1-a*h).addScaledVector(gt,h).normalize();const l=1-L(866,884,o);if(l>0){const i=xt.position;t0.copy(i).sub(f0),t0.y+=2;const u=Math.atan2(t0.y,Math.hypot(t0.x,t0.z)),w=Math.asin(ee(v0.y,-1,1)),b=Math.atan2(t0.x,t0.z);let C=Math.atan2(v0.x,v0.z)-b;C-=ae*Math.round(C/ae);const A=ct(o),y=A[4],r=A[5],p=A[6],v=A[7],S=b+Q(C,ee(C,-y-r,-y+r),l),M=(oe,Ce)=>{let ie=Math.atan2(oe,Ce)-S;return ie-=ae*Math.round(ie/ae),Math.atan(.53*Math.cos(ee(ie,-1.3,1.3)))};let k=9;for(const oe of[-6,6])m0.set(oe,-.3,0).applyEuler(xt.rotation).add(i).sub(f0),k=Math.min(k,Math.atan2(m0.y,Math.max(Math.hypot(m0.x,m0.z),1))+M(m0.x,m0.z));const V=Math.min(u+v,k),j=Math.max(u+.208,Math.min(u+p,k)),se=Math.max(j,V),be=Q(w,ee(w,j,se),l),j0=Math.cos(be);v0.set(Math.sin(S)*j0,Math.sin(be),Math.cos(S)*j0)}return St.copy(f0).addScaledVector(v0,100)}const Io=Ot.instanceMatrix,Qo=C0.instanceMatrix,Yo=Yt.instanceMatrix,co=Ze?Ze.instanceMatrix:null;function uo(t,e,o,s){const a=Zt(s),c=a+Xt(a);ve.setProgress(L(560,900,a)),ve.update(t,e,o),go.position.setFromMatrixPosition(o.matrixWorld),At.copy(kt).multiplyScalar(1+.07*Math.sin(e*10.7)*Math.sin(e*2.9)+.04*Math.sin(e*21.3+2)),qt.uCamS.value=Math.min(a,900),eo(a,c,Oe),Le.uSurge.value.set(Oe.x,Oe.y,Oe.z),Le.uRush.value=Q(.7,1.9,L(0,900,a)),no(Ve,c,e,Oe);const h=qo(Xe,c,e,Oe);ft(0,Ve,2.1,.42),ft(1,Xe,m.rival==="walnut"?3.4:m.rival==="duck"?3:2.1,m.rival==="walnut"||m.rival==="duck"?.66:.42),L0(xo,80+.68*a,-9.5,e,3,.25),L0(Dt,Math.min(250+.62*a,694),-9,e,4,.2,G/2),Dt.rotation.z=-e*2.2;{const r=e*.9,p=34+6*Math.cos(r),v=17+6*Math.sin(r);Z(p,v,ye(p,v,e)+.35,_t.position),_t.rotation.set(.06*Math.sin(e*5),e*3.1,.06*Math.cos(e*4.3))}te(58,20,0,at.position),at.position.y=ye(58,20,e)+.2+.3*Math.sin(e*2.2),at.rotation.set(.3*Math.sin(e*1.3),e*.4,.3*Math.sin(e*1.7)),Mo.quaternion.copy(Ut).multiply(Ue.setFromAxisAngle(so,e*.45));for(let r=0;r<4;r++){const v=(e/1.9+r*.27)%1*1.9,S=-G/2+(r-1.5)*.3;We.set(Math.cos(S)*35,Math.sin(S)*35,0).applyQuaternion(Ut).add(q0);const M=We.y-190*v*v;u0(r,We.x,M,We.z,M>pe(222)?.95:0,1+v*1.4)}for(let r=0;r<10;r++){const p=.7+.05*r,v=e/p+r*.37,S=v-Math.floor(v),M=r*2.4+Math.floor(v)*1.7,k=S*(6+r%3*3.5);u0(4+r,Re.x+Math.cos(M)*k,Re.y+30*S*(1-S)*(1+r%4*.5),Re.z+Math.sin(M)*k,.32)}for(let r=0;r<14;r++){const p=1.2+.09*r,v=e/p+r*.61,S=Math.floor(v),M=v-S,k=a-15+((h0(S,r)*130-(a-15))%130+130)%130,V=(h0(S+.5,r)*2-1)*13;if(k>890){u0(14+r,0,0,0,0);continue}Z(k,V,ye(k,V,e)+95*(1-M*M),We),u0(14+r,We.x,We.y,We.z,.2+.08*h0(r,3),1+1.6*M)}const l=A0(a,mt),i=(A0(a+1,mt)-l)*Jt;for(let r=0;r<fe.length;r++){const p=fe[r],v=l-p.off;Ye(v+p.half,Ne),Ye(v-p.half,N0),p.obj.position.set((Ne.x+N0.x)/2,0,(Ne.z+N0.z)/2),p.obj.position.y=et(p.obj.position.x,p.obj.position.z)+(p.legs.length?0:.3*Math.sin(e*7+r)),p.obj.rotation.y=Math.atan2(-(Ne.z-N0.z),Ne.x-N0.x);for(const S of p.spin)S.rotation.z=-v/48;for(let S=0;S<p.legs.length;S++)p.legs[S].rotation.z=.55*Math.sin(v*.03+(S%2?G:0)+(S>1?1.2:0));p.yaw=p.obj.rotation.y}const u=fe[Math.min(1,fe.length-1)].obj.position;if(Z0.set(u.x,u.y+(m.vehicle==="tram"?235:150),u.z),T0.copy(Lt),Le.uStrip.value.set(u.x,u.z,fe[Math.min(1,fe.length-1)].yaw,m.vehicle==="tram"?1:0),lt){const r=L(552,564,a),p=Math.abs(1-2*r)*Math.abs(1-2*L(730,760,a));r>.5&&a<745&&(Z0.copy(Ro),T0.copy(T).multiplyScalar(1.2*m.lampGain)),T0.multiplyScalar(p)}if(Ye(l+4,Ne),Te(0,D.set(Ne.x,et(Ne.x,Ne.z)+Wt,Ne.z),V0,2,26),st>=0){const r=fe[st],p=Math.cos(r.yaw),v=Math.sin(r.yaw),S=Math.pow(Math.max(0,Math.sin(e*4.1)*Math.sin(e*1.7+1)),3)*ee(i/120,0,1);ne.set(r.obj.position.x-86*p,r.obj.position.y+488,r.obj.position.z+86*v),Te(1,ne,O,3.2*S,20);for(let M=0;M<12;M++){const k=(e*1.15+M%4*.25+Math.floor(M/4)*.09)%1,V=(M%2?1:-1)*(100+14*(M%3))*k,j=(M-5.5)*5*k;Te(M<4?2+M:26+M,D.set(ne.x+p*j+v*V,ne.y-486*k*k,ne.z-v*j+p*V),O,2.4*(1-.8*k*k)*ee(i/120,0,1),4.5)}}else{for(let r=1;r<6;r++)Te(r,D.set(0,-500,0),O,0,1);for(let r=30;r<38;r++)Te(r,D.set(0,-500,0),O,0,1)}const w=ee(i/(m.vehicle==="tram"?130:220),0,1);for(let r=0;r<ce.length;r++){const p=ce[r],v=fe[p.car],S=Math.cos(v.yaw),M=Math.sin(v.yaw),k=v.obj.position.x+p.x*S+p.z*M,V=v.obj.position.z-p.x*M+p.z*S,j=Se(k,V),se=j.s>415&&j.s<575&&j.d>-50&&j.d<20?1:.8,be=w*se;W.makeBasis(D.set(S*90,0,-M*90),ne.set(M*8*Math.sign(p.z),22+34*be,S*8*Math.sign(p.z)),Ge.set(M,0,S)).setPosition(k-S*30,Gt(k,V)+.5,V+M*30),C0.setMatrixAt(r,W),d0[r*2+1]=be,Ze&&(Kt.setFromAxisAngle(ko,v.yaw).multiply(Po.setFromAxisAngle(so,-(l-v.off)/26)),Ze.setMatrixAt(r,W.compose(D.set(k,v.obj.position.y+26,V),Kt,Co)))}co&&(co.needsUpdate=!0);const b=L(212,276,a);for(let r=0;r<2;r++){const p=Et.horns[r];p.scale.y=.12+.88*b,p.rotation.x=(r?.45:-.45)+.12*Math.sin(e*1.1+r*2)}Et.g.position.y=J(282)+12+.05*Math.sin(e*.7);{const r=Ht.g,p=a<600||a>=692;r.visible=!m.rare&&a>554&&a<758,ro(a,r.position),p?(ro(a+.6,D),D.sub(r.position),r.rotation.set(0,Math.atan2(-D.z,D.x),Math.atan2(D.y,Math.hypot(D.x,D.z))*.6,"YZX")):(ke(716,F),r.rotation.set(0,Math.atan2(-F.hx,-F.hz)+.25*Math.sin(e*.9),-.95*(Pe(a,640,656,5)+Pe(a,664,682,5))+.05*Math.sin(e*9),"YZX"));const v=p?Math.sin(e*26)*.95:-.15;for(let S=0;S<2;S++){const M=Ht.wings[S];M.rotation.x=(S?1:-1)*v,M.scale.z=(S?-1:1)*(p?1:.28),M.rotation.y=p?0:(S?-1:1)*1.2}}{const r=e*.8,p=Math.floor(r),v=r-p,S=1-(1-v)**3,M=668+11*R.n2(p*7.3,1.1),k=38+14*R.n2(p*3.7,9.2),V=668+11*R.n2((p+1)*7.3,1.1),j=38+14*R.n2((p+1)*3.7,9.2),se=Q(M,V,S),be=Q(k,j,S);Z(se,be,ye(se,be,e)+.1,jt.position),Z(V,j,0,D),Z(M,k,0,ne),jt.rotation.y=Math.atan2(-(D.z-ne.z),D.x-ne.x)}It.scale.x=1+.07*Math.sin(e*1.6),It.scale.z=1-.09*Math.sin(e*1.6+.8);const x=Math.max(0,a-_o),C=L(0,28,x);for(let r=0;r<O0;r++){const p=Ao[r],v=703+p.ds+x*p.sp,S=Q(p.d,p.lane,C),M=1-C;let k=ye(Math.min(v,897),S,e)+.4+(1.2+Math.abs(p.rx)*3)*M,V=p.sc;v>897&&(k-=.05*(v-897)**2,k<-46&&(V=0)),Z(Math.min(v,898+(v-898)*.5),S,k,D),W.compose(D,Ue.setFromEuler(i0.set(p.rx*M+.1*Math.sin(e*2+r),p.ry+x*.02*(r%2?1:-1),p.rz*M)),ne.set(V,V*.5,V)),Yt.setMatrixAt(r,W)}{const r=Math.min(Q(704.5+x*.9,c-6,L(10,60,x)),893);L0(Qt,r,-9.5,e,6,.35,.6+x*.01),ft(2,Qt,6.5,1)}let A=0,y=0;if(lt){const r=L(vt-44,vt,a),p=r*r*r,v=lt.boots[0];v.position.lerpVectors(Lo,W0,p),v.position.y+=34*Math.sin(G*Math.pow(p,.6))*(1-p),v.rotation.z=-.5*Math.sin(G*Math.pow(p,.6))*(1-p),y=(a-vt)/55,A=y>0&&y<1.4?1.6*(1-y/1.4):0}Le.uSplash.value.set(p0.x,p0.z,Math.max(y,0),A);for(let r=0;r<12;r++){const p=ce.length+r,v=r/12*ae+.26,S=7+26*y,M=ee(1-y/1.4,0,1),k=A>0?M*M*1.5:0,V=(26+12*(r%3))*(1-y*.45);W.makeBasis(D.set(-Math.sin(v)*26,0,Math.cos(v)*26),ne.set(Math.cos(v)*12,V,Math.sin(v)*12),Ge.set(Math.cos(v),0,Math.sin(v))).setPosition(p0.x+Math.cos(v)*S,pe(675)-.3,p0.z+Math.sin(v)*S),C0.setMatrixAt(p,W),d0[p*2+1]=k;const j=ee(y*1.8-r%3*.08,0,1),se=8+(30+9*(r%4))*j;u0(28+r,p0.x+Math.cos(v+.3)*se,pe(675)+(70+20*(r%3))*j*(1-j),p0.z+Math.sin(v+.3)*se,A>0&&j<1?.75:0)}for(let r=0;r<2;r++){const p=r?Xe:Ve,v=Pe(r?h:c,621,637,4),S=p.rotation.y,M=Math.cos(S),k=Math.sin(S);W.makeBasis(D.set(k*14,0,M*14),ne.set(M*3,6+6*v,-k*3),Ge.set(M,0,-k)).setPosition(p.position.x+M*4.5,p.position.y+.3,p.position.z-k*4.5),C0.setMatrixAt(ce.length+12+r,W),d0[(ce.length+12+r)*2+1]=1.3*v}for(let r=40;r<Vt;r++){const p=ee((c-622)/13,0,1),v=r%2?1:-1,S=2+(5+2*(r-40))*p,M=Ve.rotation.y,k=Math.cos(M),V=Math.sin(M);u0(r,Ve.position.x+k*(4+3*p)+V*v*S,Ve.position.y+1+(16+4*(r-40))*p*(1-p),Ve.position.z-V*(4+3*p)+k*v*S,p>0&&p<1?.5:0)}Io.needsUpdate=!0,Qo.needsUpdate=!0,C0.geometry.attributes.aF.needsUpdate=!0,Yo.needsUpdate=!0;for(let r=0;r<12;r++){const v=(a-110)/(3.4*Jt),S=v-Math.floor(v),M=h0(r,5)*.35,k=(S-M)*3.4;D.copy(z0),k>0&&(D.addScaledVector(Vo,k*(7+5*h0(r,7))),D.y+=4.6+k*(2.5+3*h0(r,9))+Math.sin(k*2+r),D.x+=Math.sin(k*1.7+r*2)*1.5),Te(6+r,D,O,k>0?.9*(1-S):0,1.5)}rt.attributes.aPos.needsUpdate=!0,rt.attributes.aCol.needsUpdate=!0,K0.m.position.set(-95,12,Math.max(-1100,-420-e*2.4)),K0.m.rotation.y=.05*Math.sin(e*.5),K0.m.position.y=12+1.5*Math.abs(Math.sin(e*3.2));for(let r=0;r<2;r++)K0.legs[r].rotation.x=(r?1:-1)*.45*Math.sin(e*3.2);No.uK.value=.5*L(380,600,a)*(1-.75*L(760,860,a))*(m.hour==="dawn"?.6:1)}return uo(0,0,{position:Je.start,matrixWorld:new n.Matrix4().setPosition(Je.start)},0),{scene:$,path:Je,duration:40,pace:t=>1-.12*Pe(t,.36,.5,.04),ride:"none",style:"none",camera:{fov:62,near:.3,far:5e3,lookAhead:34,sway:.5,bank:.1},pois:[{at:jo,from:-1,to:2,fade:.01,weight:.96}],portal:{shape:"circle",radius:s0.portalSeat.radius,color:"#FFD9A0",glow:1,revealDistance:300},post:{exposure:m.exposure,bloom:{strength:.75,radius:.8,threshold:.82},grade:{saturation:.98,contrast:1,tint:"#fff7ec",shadowTint:"#10141e",vignette:.42,grain:.03,aberration:0}},update:uo,dispose(){ve.dispose()}}}};export{Aa as default};
