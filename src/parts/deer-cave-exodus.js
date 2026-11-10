import*as a from"three";import{mergeGeometries as Ge}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as ae,lerp as Q,smoothstep as V}from"../kit/core.js";const Ke=["#06090A","#17424E","#62B9A1","#F3A869","#BCD6CC","#143322","#2B1D17"],ie=512,g=(w,n,x)=>new a.Vector3(w,n,x),Te=g(0,1,0);function _e(w,n){const x=w.range(-3,3),_=w.range(-8,8),A=w.chance(.5)?1:-1,C=(n.seatYaw??20)*Math.PI/180,J=g(Math.sin(C),Math.tan(3*Math.PI/180),Math.cos(C)).normalize(),S=n.seat?g(n.seat[0],n.seat[1],n.seat[2]):g(80,92,520),k=S.clone().addScaledVector(J,-96),i=S.clone().addScaledVector(J,190),z=n.lift??0,D=t=>[g(_*1.5,95,-400),g(_,96,-270),g(_*.4,98,-130),g(0,100,0),g(1,97.5+.4*t,95),g(10,89+x+t,200),g(27,85+x+t,310),k,S,i],h=n.line?n.line.map(t=>g(t[0],t[1],t[2])):D(z),m=new a.CatmullRomCurve3(h,!1,"centripetal"),o=700,u=m.getSpacedPoints(o),L=[];for(let t=0;t<=o;t++)L.push(u[Math.min(o,t+1)].clone().sub(u[Math.max(0,t-1)]).normalize());let W=u,v=L;if(z&&!n.line){W=new a.CatmullRomCurve3(D(0),!1,"centripetal").getSpacedPoints(o),v=[];for(let t=0;t<=o;t++)v.push(W[Math.min(o,t+1)].clone().sub(W[Math.max(0,t-1)]).normalize())}const I=m.getLength(),c=n.coil??16,te=n.pitch??150,ce=w.range(0,6.28),ee=h[0].z,Me=h[h.length-1].z,Ae=n.coilEnd||[330,425],ke=n.coilStart||[105,230],xe=n.flare??0,Y=n.coilNear||null,le=t=>{let l=0,q=1/0;for(let p=0;p<=o;p++){const N=u[p].distanceToSquared(t);N<q&&(q=N,l=p)}return l/o*I},ze=Y?le(g(Y.node[0],Y.node[1],Y.node[2])):0,re=Y?le(g(Y.end[0],Y.end[1],Y.end[2])):-1e9,oe=[],Fe=g(),ve=g();for(let t=0;t<=o;t++){const l=u[t],q=L[t],p=t/o*I;Fe.crossVectors(Te,q).normalize(),ve.crossVectors(q,Fe);const N=c*V(ke[0],ke[1],l.z)*(1-V(Ae[0],Ae[1],l.z))+2.5*V(ee,ee+150,l.z)*(1-V(-90,-20,l.z)),G=A*(p/te)*Math.PI*2+ce,O=l.clone();if(Y){const F=V(re-250,re,p),E=Y.r*V(Y.z[0],Y.z[1],l.z)*(1-F),U=Math.PI+(p-ze)/te*Math.PI*2,$=2.5*V(ee,ee+150,l.z)*(1-V(-90,-20,l.z));O.addScaledVector(Fe,Math.cos(U)*E+Math.cos(G)*(N-$)*F+Math.cos(G)*$).addScaledVector(ve,Math.sin(U)*E*(Y.v??.75)+Math.sin(G)*((N-$)*F+$)*(n.coilV??.8))}else O.addScaledVector(Fe,Math.cos(G)*N).addScaledVector(ve,Math.sin(G)*N*(n.coilV??.8));oe.push(O)}const pe=[0];for(let t=1;t<=o;t++)pe.push(pe[t-1]+oe[t].distanceTo(oe[t-1]));const ge=pe[o],we=(n.thickness??15)/2,H=new Float32Array(ie*4);let Z=0;for(let t=0;t<ie;t++){const l=t/(ie-1)*ge;for(;Z<o-1&&pe[Z+1]<l;)Z++;const q=ae((l-pe[Z])/Math.max(1e-4,pe[Z+1]-pe[Z]),0,1),p=Q(oe[Z].x,oe[Z+1].x,q),N=Q(oe[Z].y,oe[Z+1].y,q),G=Q(oe[Z].z,oe[Z+1].z,q),O=(G-ee)/(Me-ee);let F=we*(.35+.65*(n.line?V(ee,ee+(n.ramp??190),G):V(0,.16,O)));F*=1-.22*Math.exp(-((G/45)**2)),n.line?F*=1+xe*V(260,1e3,G):F*=1-.34*V(S.z-150,S.z-40,G),H[t*4]=p,H[t*4+1]=N,H[t*4+2]=G,H[t*4+3]=F}const de=new a.DataTexture(H,ie,1,a.RGBAFormat,a.FloatType);de.minFilter=de.magFilter=a.NearestFilter,de.generateMipmaps=!1,de.needsUpdate=!0;const d=(t,l=g())=>{const q=ae(t,0,1)*(ie-1),p=Math.min(ie-2,Math.floor(q)),N=q-p;return l.set(Q(H[p*4],H[p*4+4],N),Q(H[p*4+1],H[p*4+5],N),Q(H[p*4+2],H[p*4+6],N))};return{tex:de,data:H,length:ge,centerAt:d,radiusAt:t=>H[Math.round(ae(t,0,1)*(ie-1))*4+3],stationNear:t=>{let l=0,q=1/0;for(let F=0;F<ie;F++){const E=H[F*4]-t.x,U=H[F*4+1]-t.y,$=H[F*4+2]-t.z,se=E*E+U*U+$*$;se<q&&(q=se,l=F)}let p=l/(ie-1);const N=g();let G=Math.max(0,p-1/(ie-1)),O=Math.min(1,p+1/(ie-1));for(let F=0;F<6;F++){const E=G+(O-G)/3,U=O-(O-G)/3;d(E,N).distanceToSquared(t)<d(U,N).distanceToSquared(t)?O=U:G=E}return(G+O)/2},baseAtZ:(t,l=g(),q=null)=>{let p=0;for(;p<o-1&&W[p+1].z<t;)p++;const N=ae((t-W[p].z)/Math.max(1e-4,W[p+1].z-W[p].z),0,1);return q&&q.copy(v[p]).lerp(v[p+1],N).normalize(),l.copy(W[p]).lerp(W[p+1],N)},seat:S,dir:J,hand:A,R0:we,z0:ee,z1:Me}}function De(w){const n=[],x=g(),_=g(),A=g(),C=g(),J=[-380,-350,-310,-272,-252,-232,-212,-192,-172,-152,-130,-108,-80,-45,0,45,90,130,175,220,265,310,350,390];for(const S of J){w.baseAtZ(S,x,_),A.crossVectors(Te,_).normalize(),C.crossVectors(_,A);let k=0,i=0;if(S<0){const z=V(-272,-108,S),D=S>-272&&S<-108?(S+272)/164:S<=-272?0:1,h=Q(4,9,Math.sin(Math.PI*ae(D,0,1)))*(1-V(-108,-10,S)),m=-Math.PI/2+D*Math.PI*2*w.hand;k=Math.cos(m)*h,i=Math.sin(m)*h}else{const z=V(68,132,S)*(1-V(300,395,S));k=20*z,i=-5*z}n.push(x.clone().addScaledVector(A,k).addScaledVector(C,i))}return n.push(w.seat.clone().addScaledVector(w.dir,-96),w.seat.clone().addScaledVector(w.dir,-48),w.seat.clone()),n}const Pe=`
uniform sampler2D uLine; uniform float uLen, uTime, uTwist, uSpin, uBraid, uSpeed, uTail;
uniform vec4 uCapA[4]; uniform vec4 uCapB[4]; uniform vec4 uKink[3]; uniform vec3 uKinkDir[3];
uniform vec3 uLens; uniform vec2 uCut; uniform vec3 uLeg; uniform vec4 uSway;
// a world's own line may loop far out and come back: between the stations uLeg.x and uLeg.y (metres) the rope is not
// drawn at all, and what lies beyond uLeg.y (the leg that comes back) is drawn uLeg.z strong (0..1)
float legGate(float sM){ return 1. - smoothstep(uLeg.x, uLeg.x + 200., sM) + smoothstep(uLeg.y - 200., uLeg.y, sM) * uLeg.z; }
// rare event: a gap cut out of the rope (centre station in metres, half width; 0 = none)
float cutF(float sM){ return 1. - step(.5, uCut.y) * (1. - smoothstep(uCut.y * .55, max(uCut.y, 1.), abs(sM - uCut.x))); }
vec4 lineAt(float s){
  float f = clamp(s, 0., 1.) * ${ie-1}.; float i = floor(f);
  vec4 a = textureLod(uLine, vec2((i + .5) / ${ie}., .5), 0.);
  vec4 b = textureLod(uLine, vec2((min(i + 1., ${ie-1}.) + .5) / ${ie}., .5), 0.);
  return mix(a, b, f - i);
}
float braidEnv(float z){ return smoothstep(70., 210., z) * (1. - smoothstep(400., 490., z)); }
// Compression waves travel down the whole rope. On the first pass, seen from near, two of them, 140 m and 57 m long.
// legW is 1 on the leg that comes back (beyond uLeg.y), which is seen from half a kilometre: there a wave 57 m long
// with a threefold swing of density reads as a string of beads, so the two short waves give way (to a fifth) to
// one long slow one, 350 m from crest to crest and travelling at 22 m/s, under which the bats stand between 0.70
// and 1.74 of their mean density: a continuous body that swells and thins as the wave slides along it.
float legW(float sM){ return smoothstep(uLeg.y - 300., uLeg.y, sM); }
float waveS(float sM){
  float lw = legW(sM);
  return sM + (1. - .8 * lw) * (5. * sin(.045 * sM - .9 * uTime) + 2.5 * sin(.11 * sM - 1.7 * uTime + 2.)) + lw * 18. * sin(.018 * sM - .4 * uTime + 1.);
}
// outside the cave the whole rope undulates slowly, a ribbon in moving air: uSway = (metres up and down, metres from
// side to side, the station where it begins, 1 / the metres over which it grows). Two long waves that travel down it.
vec3 swayOff(float w, vec3 N, vec3 B){
  float g = clamp((w - uSway.z) * uSway.w, 0., 1.); g = g * g * (3. - 2. * g);
  return (B * (uSway.x * sin(w * .0205 - uTime * .62)) + N * (uSway.y * sin(w * .0131 - uTime * .41 + 1.7))) * g;
}
vec3 kinkOff(float w){
  vec3 o = vec3(0.);
  for (int i = 0; i < 3; i++) { float x = (w - uKink[i].x) / max(uKink[i].z, 1.); o += uKinkDir[i] * (uKink[i].y * 2.33 * x * exp(-x * x)); }
  return o;
}
vec3 pushCaps(vec3 p){
  for (int i = 0; i < 4; i++) {
    vec3 ab = uCapB[i].xyz - uCapA[i].xyz;
    float h = clamp(dot(p - uCapA[i].xyz, ab) / max(dot(ab, ab), 1e-4), 0., 1.);
    vec3 q = uCapA[i].xyz + ab * h; vec3 d = p - q + vec3(1e-3, 2e-3, 0.);
    float l = length(d); float R = mix(uCapA[i].w, uCapB[i].w, h);
    float ln = i < 3 ? max(l, R + l * .2857) : sqrt(l * l + R * R);      // hawk holes pile the bats they clear into a rim
    p = q + d * (ln / max(l, 1e-3));
  }
  return p;
}
float holeF(vec3 p){
  float f = 1.;
  for (int i = 0; i < 3; i++) {
    vec3 ab = uCapB[i].xyz - uCapA[i].xyz;
    float h = clamp(dot(p - uCapA[i].xyz, ab) / max(dot(ab, ab), 1e-4), 0., 1.);
    float R = mix(uCapA[i].w, uCapB[i].w, h), l = length(p - (uCapA[i].xyz + ab * h));
    f *= mix(1., smoothstep(R * .75, R * 1.25 + .01, l), step(.05, R));
  }
  return f;
}
void ropeFrame(float w, out vec4 c, out vec3 T, out vec3 N, out vec3 B){
  float s = w / uLen; c = lineAt(s);
  T = normalize(lineAt(s + .004).xyz - lineAt(s - .004).xyz + vec3(0., 0., 1e-4));
  N = normalize(cross(vec3(0., 1., 0.), T) + vec3(1e-4, 0., 0.)); B = cross(T, N);
}
// sM: station in metres; rf: radius fraction; th: angle; returns local position, F = heading
vec3 batPos(float sM, float rf, float th, float rnd, float strand, out vec3 F){
  float w = waveS(sM); vec4 c; vec3 T, N, B; ropeFrame(w, c, T, N, B);
  float a = th + uTwist * w + uSpin * uTime;
  float r = c.w * rf * (1. + .18 * sin(.03 * w - .6 * uTime + rnd * 3.));
  vec3 rad = N * cos(a) + B * sin(a), tang = -N * sin(a) + B * cos(a);
  vec3 p = c.xyz + rad * r;
  float bp = w * .057 + strand * 3.14159; p += (N * cos(bp) + B * sin(bp)) * (uBraid * braidEnv(c.z));
  p += N * (sin(uTime * 1.3 + rnd * 40.) * .5) + B * (cos(uTime * 1.7 + rnd * 70.) * .5);
  p += kinkOff(w) + swayOff(w, N, B);
  vec3 q = pushCaps(p);
  F = normalize(T + tang * (r * (uTwist + uSpin / uSpeed)) + (q - p) * .15);
  return q;
}`,Be=`
attribute vec4 aSeed; attribute vec3 aSeed2; attribute vec2 aWing;
#ifdef SQUAD
attribute vec3 aOut;
uniform vec3 uGlowDir;
#endif
uniform float uWin, uCamS, uPxK, uSize, uVar;
uniform vec3 uSqF, uSqP, uSqV; uniform float uPark, uSpread, uSqPh; uniform vec2 uMidK;
varying vec2 vWing; varying vec3 vN, vPos; varying float vRnd;
#include <fog_pars_vertex>
${Pe}
void main(){
  float rnd = aSeed.w, fade = 1.; vec3 F, p;
#ifdef SQUAD
  // the squadron holds its stations in the frame of the view (uSqV: mostly where the lens looks), so each bat keeps
  // its place in the picture, whole and off the middle; it flies the path's heading (uSqF), each a little its own way
  vec3 T = normalize(uSqF + vec3(0., 0., 1e-4)), Tv = normalize(uSqV + vec3(0., 0., 1e-4));
  vec3 R0 = normalize(cross(vec3(0., 1., 0.), Tv) + vec3(1e-4, 0., 0.)), U0 = cross(Tv, R0);
  vec3 wob = vec3(sin(uTime * .9 + rnd * 30.), sin(uTime * 1.2 + rnd * 50.), sin(uTime * .7 + rnd * 70.)) * (.16 + .03 * aSeed.z);
  // inside the cave each holds its cave station (aSeed.xyz); outside (uSpread 1) its open-air one (aOut), the nearest
  // four 2.5 to 3.3 m from the lens, one in each quarter of the frame, and every one wanders slowly round its place
  vec3 o = mix(aSeed.xyz, aOut, uSpread);
  float od = length(o);
  // (uSqPh, set from the path, turns the same wander, so two places on the path never show the same arrangement)
  float sqA = uSqPh * (.6 + .8 * fract(rnd * 13.7)), sqB = uSqPh * (.5 + .9 * fract(rnd * 29.3));
  o.xy += od * uSpread * vec2(.17 * sin(uTime * .37 + sqA + rnd * 40.) + .05 * sin(uTime * .83 + rnd * 17.), .1 * sin(uTime * .29 + sqB + rnd * 70.) + .03 * sin(uTime * .71 + rnd * 23.));
  o = normalize(o + vec3(0., 0., 1e-4)) * od + wob;
  // outside none sits in front of the moon: one whose place would is turned out to a moon's breadth beside it
  vec3 dW = R0 * o.x + U0 * o.y + Tv * o.z, dn = normalize(dW + vec3(0., 0., 1e-4));
  float mc = dot(dn, uGlowDir);
  dW += normalize(dn - uGlowDir * mc + U0 * .02) * (od * .2 * smoothstep(.962, .985, mc) * uSpread);
  p = uSqP + dW;
  fade = mix(1., step(.6, o.z), uPark);                    // parked at the path's first point while the world is seen through a portal: only those ahead of it
  vec3 Rt = normalize(cross(vec3(0., 1., 0.), T) + vec3(1e-4, 0., 0.)), Ut = cross(T, Rt);
  F = normalize(T + Rt * (.10 * cos(uTime * .9 + rnd * 30.) + .34 * (aSeed2.x - .5)) + Ut * (.08 * cos(uTime * 1.2 + rnd * 50.) + .22 * (fract(rnd * 7.31) - .5)));
  { vec3 dl = p - uLens + vec3(1e-3, 2e-3, 0.); float l = length(dl), Rl = uCapA[3].w * (1. - uSpread); p = uLens + dl * (sqrt(l * l + Rl * Rl) / max(l, 1e-3)); }      // in the cave it keeps the rope's clear space round the lens; outside its stations are its own
#else
  float spd = uSpeed * (1. - .5 * uVar + uVar * rnd);
  float sAbs = aSeed.x * uWin + uTime * spd;
  float sM = uCamS + mod(sAbs - uCamS + .5 * uWin, uWin) - .5 * uWin;
  fade = (1. - smoothstep(.40 * uWin, .5 * uWin, abs(sM - uCamS))) * smoothstep(0., 30., sM) * (1. - smoothstep(uLen - uTail, uLen, sM)) * cutF(sM) * legGate(sM);
  p = batPos(sM, aSeed.y, aSeed.z, rnd, aSeed2.z, F);
#endif
  float dist = length(p - uLens);
  fade *= smoothstep(1.0, 1.7, dist);
  vec3 Ub = normalize(vec3(0., 1., 0.) + cross(vec3(0., 1., 0.), F) * (.4 * sin(uTime * 1.1 + rnd * 30.)));
  vec3 Rb = normalize(cross(Ub, F) + vec3(1e-4, 0., 0.)); Ub = cross(F, Rb);
  // wing beat: 9 per second, own phase, with glides; two joints (shoulder, wrist), the hand folds on the upstroke, and
  // the whole wing twists about its leading edge (edge down on the downstroke, up on the upstroke; the hand more than
  // the arm), so that from behind a wing is a surface that opens and closes, never only a line
  float ph = uTime * 56.5 * (.9 + .2 * aSeed2.x) + rnd * 62.8;
  float amp = 1. - .8 * smoothstep(.8, .97, sin(uTime * .8 + rnd * 50.));
  vec3 lp = position, ln = normal;
  float side = lp.x < 0. ? -1. : 1., d = abs(lp.x);
  if (aWing.x >= 0.) {
    float A1 = amp * (.12 + .78 * sin(ph)), A2 = A1 + amp * (-.25 + .65 * sin(ph - 1.1));
    float up = max(cos(ph), 0.) * amp;
    float uu = aWing.x, le = uu < .42 ? mix(.10, .24, uu / .42) : mix(.24, -.10, (uu - .42) / .58);
    float tw = -cos(ph) * amp * (.24 + .46 * uu) + .1 * (1. - amp), c = le - lp.z;
    float d1 = clamp(d - .06, 0., .395), d2 = max(d - .455, 0.) * (1. - .32 * up);
    float A = mix(A1, A2, step(.455, d)), ty = c * sin(tw);
    lp.x = side * (.06 + cos(A1) * d1 + cos(A2) * d2 - sin(A) * ty);
    lp.y += sin(A1) * d1 + sin(A2) * d2 + cos(A) * ty;
    lp.z = le - c * cos(tw) - d2 * .3 * up;
    ln = normalize(vec3(-side * sin(A) * cos(tw), cos(A) * cos(tw), sin(tw)));
  } else { lp.y -= .035 * sin(ph) * amp; }
  float sc = uSize * (.85 + .3 * aSeed2.x) * fade * clamp(dist * uPxK * uMidK.x, 1., uMidK.y);
#ifdef SQUAD
  sc = uSize * 1.36 * (.92 + .16 * aSeed2.x) * fade;
#endif
  vec3 lpos = p + (Rb * lp.x + Ub * lp.y + F * lp.z) * sc;
  vN = Rb * ln.x + Ub * ln.y + F * ln.z; vPos = lpos; vWing = aWing; vRnd = rnd;
  vec4 mvPosition = modelViewMatrix * vec4(lpos, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ve=`
uniform vec3 uBatCol, uFurCol, uBatAmb, uBatAmbOut, uGlowCol, uSkyCol, uGlowDir, uLens; uniform float uAmb, uOpen, uRim, uThru, uDif;
vec3 shadeBat(vec3 N, vec3 V, float skin, float alb, float fuzz, float dist, float inK){
  float ndl = dot(N, uGlowDir), wrap = .5 + .5 * ndl, w3 = wrap * wrap * wrap;
  float gL = dot(uGlowCol, vec3(.3333)); vec3 gC = mix(uGlowCol, vec3(gL), .25);
  vec3 base = uFurCol * alb;
  vec3 col = base * mix(uBatAmbOut, uBatAmb, inK) * (.78 + .22 * N.y) + base * gC * (w3 * uDif);      // a bat still inside the cave takes its bounce light, one already out the night sky's
  float th = max(dot(-V, uGlowDir), 0.); th *= th; th *= th; th *= th; th *= th; th *= th;        // the wing stands in front of the glow itself (within about 12 degrees)
  col += skin * mix(vec3(.27, .2, .155), vec3(.21, .195, .185), uOpen) * (gL * uThru * (.1 * max(-ndl, 0.) + th));      // warm brown skin by the keyhole's light, slate by the moon's
  col += gC * (fuzz * uRim * w3 * (1. - smoothstep(6., 14., dist)));
  return col;
}`,We=`
varying vec2 vWing; varying vec3 vN, vPos; varying float vRnd;
#include <fog_pars_fragment>
${Ve}
void main(){
  vec3 toL = uLens - vPos; float dist = length(toL); vec3 V = toL / max(dist, 1e-3);
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.)); if (dot(N, V) < 0.) N = -N;
  float ndv = abs(dot(N, V)), fres = 1. - ndv; fres *= fres;
  float skin = 0., alb = .72, fuzz = fres * .9, nearK = 1. - smoothstep(9., 22., dist);
  if (vWing.x >= 0.) {
    float u = vWing.x, v = vWing.y;
    float f = u < .42 ? u / .42 : fract((u - .42) / .1934);
    float scal = 1. - (u < .42 ? .32 : .25) * sin(3.14159 * clamp(f, 0., 1.));
    if (v > scal) discard;                                   // scalloped trailing edge between the fingers
    float wv = .015 + .015 * v;
    float bone = 1. - smoothstep(.03, .07, v);               // arm and leading finger
    bone = max(bone, 1. - smoothstep(wv, wv * 2.2, abs(u - .42)));
    bone = max(bone, 1. - smoothstep(wv, wv * 2.2, abs(u - (.42 + .1934 * v))));
    bone = max(bone, 1. - smoothstep(wv, wv * 2.2, abs(u - (.42 + .3868 * v))));
    bone = max(bone, (1. - smoothstep(wv, wv * 2.2, abs(u - .21 * v))) * step(u, .3) * .6);
    bone *= .35 + .65 * nearK;                               // far off the bones go into the skin's tone
    skin = 1. - bone;
    float mem = mix(.86, 1.12, smoothstep(.08, .9, u)) * (1. - .12 * nearK * sin(u * 43. + v * 6.) * sin(u * 43. + v * 6.));   // thinner, paler skin toward the hand; faint creases
    alb = mix(.5, mem, skin);
    fuzz = fres * (1. - smoothstep(0., .3, v)) * .45;        // only the arm and the leading finger catch a rim
  } else if (vWing.x < -1.5) { skin = .55; alb = .95; fuzz = fres * .5; }                // ears: thin skin
  gl_FragColor = vec4(shadeBat(N, V, skin, alb * (.84 + .32 * vRnd), fuzz, dist, 1. - smoothstep(-30., 18., vPos.z)), 1.);
  #include <fog_fragment>
}`;function Ne(w){const n=[],x=[],_=[],A=[],C=(h,m,o,u,L,W,v,I)=>(n.push(h,m,o),x.push(u,L,W),_.push(v,I),n.length/3-1),J=w?[[.33,.006],[.3,.05],[.235,.092],[.17,.086],[.125,.074],[.05,.128],[-.07,.132],[-.19,.098],[-.28,.05],[-.33,.016],[-.56,.006]]:[[.32,.006],[.05,.125],[-.54,.006]],S=w?8:3,k=[];for(const[h,m]of J){const o=[];for(let u=0;u<S;u++){const L=u/S*Math.PI*2+Math.PI/S,W=Math.cos(L),v=Math.sin(L);o.push(C(W*m,v*m*.82+(h>.12&&h<.31?.014:0),h,W,v,0,-1,(.33-h)/.89))}k.push(o)}for(let h=0;h<k.length-1;h++)for(let m=0;m<S;m++){const o=k[h][m],u=k[h][(m+1)%S],L=k[h+1][m],W=k[h+1][(m+1)%S];(h>0||w)&&A.push(o,L,u),A.push(u,L,W),h===0&&!w&&A.push(o,L,u)}if(w)for(const h of[-1,1]){const m=C(h*.02,.07,.275,h,.5,.2,-2,0),o=C(h*.105,.05,.215,h,.5,.2,-2,0),u=C(h*.03,.075,.165,h,.5,.2,-2,0),L=C(h*.125,.185,.235,h,1,.2,-2,0);A.push(m,o,L,o,u,L,u,m,L)}const i=w?[0,.14,.28,.42,.56,.7,.85,1]:[0,.42,1],z=w?[0,.33,.66,1]:[0,1];for(const h of[-1,1]){const m=[];for(const o of i){const u=o<.42?Q(.1,.24,o/.42):Q(.24,-.1,(o-.42)/.58),L=o<.42?Q(-.36,-.31,o/.42):Q(-.31,-.17,Math.pow((o-.42)/.58,1.6)),W=[];for(const v of z)W.push(C(h*Q(.06,1,o),.02+(w?.045*Math.sin(Math.PI*v)*(1-o):0),Q(u,L,v),0,1,0,o,v));m.push(W)}for(let o=0;o<i.length-1;o++)for(let u=0;u<z.length-1;u++)A.push(m[o][u],m[o+1][u],m[o][u+1],m[o+1][u],m[o+1][u+1],m[o][u+1])}const D=new a.InstancedBufferGeometry;return D.setAttribute("position",new a.Float32BufferAttribute(n,3)),D.setAttribute("normal",new a.Float32BufferAttribute(x,3)),D.setAttribute("aWing",new a.Float32BufferAttribute(_,2)),D.setIndex(A),D}const Ie=`
// q: quad coords (x along the span, -1..1; y across it, -1..1); W: sin/cos of the two wing joints;
// S: (bat up . quad up, heading . quad up, minimum half thickness in quad units). Returns (wing, body).
vec2 batStroke(vec2 q, vec4 W, vec3 S){
  float ax = abs(q.x) / max(.62 + .38 * W.z, .3);
  float x1 = min(ax, .45), x2 = max(ax - .45, 0.);
  float fh = W.x * x1 + W.y * x2;                                        // height of the wing line, bat space
  float k1 = clamp(ax / .42, 0., 1.), k2 = clamp((ax - .42) / .58, 0., 1.);
  float cc = mix(-.13, -.035, k1) - .10 * k2;                            // centre of the chord, bat space (along the heading)
  float hc = mix(.23, .275, k1) * (1. - .87 * k2);                       // half chord
  float yc = S.x * fh + S.y * cc;
  float th = max(abs(S.y) * hc, S.z), e = S.z * .8 + .012;
  float wing = (1. - smoothstep(th - e, th + e, abs(q.y - yc))) * (1. - smoothstep(.9, 1., ax));
  vec2 bq = vec2(q.x, q.y + S.y * .05) / vec2(.085 + S.z * .6, max(.34 * abs(S.y), .10) + S.z * .6);
  float body = 1. - smoothstep(.6, 1., dot(bq, bq));
  return vec2(wing, body);
}`,Oe=`
attribute vec4 aSeed; attribute vec3 aSeed2;
uniform float uPxK, uSize, uVar, uWinF, uFarS, uWinFade, uIn; uniform vec3 uFarK; uniform vec4 uKeyThin;
varying vec2 vQ; varying vec4 vW; varying vec3 vS; varying float vA, vRnd, vThrough, vIn;
#include <fog_pars_vertex>
${Pe}
uniform vec3 uGlowDir;
void main(){
  float rnd = aSeed.w; vec3 F;
  float sAbs = aSeed.x * uWinF + uTime * uSpeed * (1. - .5 * uVar + uVar * rnd);
  float sM = uFarS + mod(sAbs - uFarS + .5 * uWinF, uWinF) - .5 * uWinF;                // kept in a window of rope round the lens: a bat wraps from one end to the other, where it is faded out
  float fade = smoothstep(0., 30., sM) * (1. - smoothstep(uLen - uTail, uLen, sM)) * cutF(sM) * legGate(sM) * mix(1., 1. - smoothstep(.42 * uWinF, .5 * uWinF, abs(sM - uFarS)), uWinFade);
  vec3 p = batPos(sM, aSeed.y, aSeed.z, rnd, aSeed2.z, F);
  vec3 toL = uLens - p; float dist = length(toL); vec3 Vd = toL / max(dist, 1e-3);
  // From deep inside the cave the rope is seen end on where it runs out through the keyhole: hundreds of metres of
  // it pile up on a few degrees of sky. So while the lens is inside (uIn), of the bats that cross the keyhole or
  // have left it only a share is drawn, smaller the further out they are (uKeyThin = z where the thinning begins,
  // z where it is complete, the share kept at the mouth plane, the metres over which that share dies away outside),
  // each of them a little larger: a ragged thread of separate animals on the sky, not a clot that shuts the opening.
  float kh = uIn * smoothstep(uKeyThin.x, uKeyThin.y, p.z) * smoothstep(28., 105., dist);
  float keep = mix(1., uKeyThin.z * exp(-max(p.z, 0.) / max(uKeyThin.w, 1.)) + .003, kh);
  // Outside, where the rope runs toward the lens or away from it (the near side of a turn of the corkscrew, the leg
  // where it comes straight on), a long stretch of it stands on a small patch of sky and its bats would pile into
  // a clot. So beyond 90 m the share of the far bats that is drawn falls with the sine of the angle between the
  // rope and the line of sight: every stretch puts about the same number of bats on a degree of sky, and a turn
  // seen end-on stays a swarm of separate animals.
  keep *= mix(1., clamp(length(cross(F, Vd)) * 1.25, .22, 1.), (1. - uIn) * smoothstep(90., 220., dist));
  fade *= smoothstep(.7, 1.3, keep / max(fract(rnd * 91.7 + aSeed2.x * 3.3), 1e-3));
  vec3 Rb = normalize(cross(vec3(0., 1., 0.), F) + vec3(1e-4, 0., 0.)), Ub = cross(F, Rb);
  vec3 A2 = normalize(cross(Vd, Rb) + vec3(0., 1e-3, 0.)); if (dot(A2, Ub) < 0.) A2 = -A2;
  float k = clamp(dist * uPxK * uFarK.x, 1., uFarK.y * (1. + .7 * kh));
  float hs = uSize * 1.1 * (.85 + .3 * aSeed2.x) * k;
  vec3 lpos = p + (Rb * position.x + A2 * position.y) * hs;
  float ph = uTime * 56.5 * (.9 + .2 * aSeed2.x) + rnd * 62.8;
  float amp = 1. - .8 * smoothstep(.8, .97, sin(uTime * .8 + rnd * 50.));
  float a1 = amp * (.12 + .78 * sin(ph)), a2 = a1 + amp * (-.25 + .65 * sin(ph - 1.1));
  vQ = position.xy; vRnd = rnd; vW = vec4(sin(a1), sin(a2), cos(a1), cos(a2));
  vS = vec3(dot(Ub, A2), dot(F, A2), clamp(.6 * dist * uPxK / (4.889 * hs), .03, .5));
  vA = fade * smoothstep(24., 58., dist) / pow(k, uFarK.z);                  // the mid tier carries the nearest 25 m
  float th = max(dot(-Vd, uGlowDir), 0.); th *= th; th *= th; vThrough = th * th; vIn = 1. - smoothstep(-30., 18., p.z);
  vec4 mvPosition = modelViewMatrix * vec4(lpos, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ue=`
varying vec2 vQ; varying vec4 vW; varying vec3 vS; varying float vA, vRnd, vThrough, vIn;
uniform vec3 uBatCol, uFurCol, uBatAmb, uGlowCol, uSkyCol; uniform float uAmb, uOpen, uFarLit, uThruFar, uIn;
#include <fog_pars_fragment>
${Ie}
void main(){
  vec2 wb = batStroke(vQ, vW, vS);
  float a = max(wb.x, wb.y) * vA;
  if (a < .012) discard;
  vec3 base = uBatCol * (.75 + .5 * vRnd);
  vec3 col = base * uSkyCol * (uAmb * .45 * uOpen) + base * uGlowCol * .12 + uGlowCol * (wb.x * (1. - wb.y) * (.002 + uThruFar * vThrough) + uFarLit * uOpen);      // dark on the sky: no pale wing skin, or a flock on the moon reads as stars
  col += uFurCol * uBatAmb * (uIn * vIn * (.22 + .25 * vRnd));          // in the cave: the same soot-brown as the near bats, by the cave's bounce light
  gl_FragColor = vec4(col, a);
  #include <fog_fragment>
}`,Ee=`
attribute float aS, aAng, aStr; uniform float uIn; uniform vec4 uKeyThin;
varying vec3 vN, vPos; varying vec2 vSA; varying float vDen, vLeg;
#include <fog_pars_vertex>
${Pe}
void main(){
  float w = aS * uLen; vec4 c; vec3 T, N, B; ropeFrame(w, c, T, N, B);
  vec3 rad = N * cos(aAng) + B * sin(aAng);
  float lw = legW(w);
  // the smoke is thickest where the waves draw the bats apart, so the body carries the stretches the bats thin in
  float comp = 1. - (1. - .8 * lw) * (.225 * cos(.045 * w - .9 * uTime) + .275 * cos(.11 * w - 1.7 * uTime + 2.)) - lw * .324 * cos(.018 * w - .4 * uTime + 1.);
  float be = braidEnv(c.z), thin = step(.5, uBraid) * be;
  float r = c.w * mix(1.12, .78, thin) * (1. + .10 * sin(.03 * w - .6 * uTime) + .12 * sin(aAng * 3. + w * .09));
  float bp = w * .057 + aStr * 3.14159;
  vec3 lpos = c.xyz + (N * cos(bp) + B * sin(bp)) * (uBraid * be) + kinkOff(w) + swayOff(w, N, B) + rad * r;
  vN = rad; vPos = lpos; vSA = vec2(w, aAng); vLeg = lw;
  vDen = cutF(w) * legGate(w) * holeF(lpos) / max(comp, .4) * (1. - uIn * smoothstep(uKeyThin.x - 30., uKeyThin.y - 30., c.z));      // from inside, no smoke hangs in the keyhole
  vec4 mvPosition = modelViewMatrix * vec4(lpos, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,He=`
varying vec3 vN, vPos; varying vec2 vSA; varying float vDen, vLeg;
uniform vec3 uBatCol, uGlowCol, uSkyCol, uGlowDir, uLens; uniform float uAmb, uOpen, uSmoke, uLen, uTime, uSpeed, uPulse, uFarLit, uTail, uTubeNear;
#include <fog_pars_fragment>
float h21(vec2 p){ p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
void main(){
  vec3 toL = uLens - vPos; float dist = length(toL); vec3 V = toL / max(dist, 1e-3);
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
  float ndv = abs(dot(N, V));
  float sc = vSA.x - uTime * uSpeed;
  float n = vnoise(vec2(sc * .05, vSA.y * 1.5 + sc * .03)) * .6 + vnoise(vec2(sc * .13, vSA.y * 3. - sc * .05)) * .4;   // long strands that wind round it
  float far = smoothstep(40., 190., dist);
  float grain = vnoise(vec2(sc * 1.3, vSA.y * 11.)) * .6 + vnoise(vec2(sc * 3.1 + 5., vSA.y * 23.)) * .4;            // speck grain at middle distance
  float den = ndv * ndv * (.5 + .9 * n) * vDen * mix(.5 + 1.1 * grain, .7 + .6 * vnoise(vec2(sc * .45, vSA.y * 6.)), smoothstep(110., 380., dist));
  float legK = clamp(vLeg, 0., 1.);
  den = mix(den, max(den, ndv * (.62 + .3 * n) * min(vDen, 1.)), legK);       // the leg that comes back has no thin places: one ribbon, ragged only at its edges
  // a haze behind the wings near, a body far; outside (uTubeNear) the near rope is bats alone, and on the leg that
  // comes back the body begins nearer (from 300 m), so it carries the stretches where the long wave thins the bats
  den *= mix(smoothstep(20., 64., dist), mix(smoothstep(380., 760., dist), smoothstep(300., 640., dist), legK), uOpen * uTubeNear) * mix(.85, 1.25, far) *
     smoothstep(0., 60., vSA.x) * (1. - smoothstep(uLen - uTail - 50., uLen - 10., vSA.x));
  if (uPulse > .5) den *= smoothstep(.35, .7, .5 + .5 * cos(6.28318 * uPulse * sc / uLen));
  float st = vnoise(vec2(sc * .8, vSA.y * 9.));
  den *= mix(1., .3 + 1.4 * st, (1. - ndv) * far);                        // far off its edge breaks into stipple, a swarm and not a cloud
  float a = clamp(den * uSmoke, 0., mix(.86, .94, smoothstep(300., 800., dist)));
  float sp = smoothstep(.3, .7, vnoise(vec2(sc * 2.3, vSA.y * 17.)) * .6 + vnoise(vec2(sc * 5.1 + 3., vSA.y * 37.)) * .4);
  a *= mix(1., mix(.25, .5, legK) + mix(.75, .5, legK) * sp, uOpen * uTubeNear * (1. - smoothstep(450., 1000., dist)));      // outside, at middle distance, the body is a speckle of bats with sky between, not a cloud
  if (a < .01) discard;
  float wrap = .5 + .5 * dot(N, uGlowDir);
  vec3 col = uBatCol * uSkyCol * (uAmb * .8 * uOpen) + uBatCol * uGlowCol * (.08 + .26 * wrap * wrap);
  col = col * .6 + uGlowCol * (uFarLit * uOpen * .6 * wrap);
  gl_FragColor = vec4(col, a);
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float ff = 1. - exp(-fogDensity * fogDensity * dist * dist);
    #else
      float ff = smoothstep(fogNear, fogFar, dist);
    #endif
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, clamp(ff, 0., 1.));
  #endif
}`,je=`
attribute float aI; attribute vec2 aWing; attribute float aWhite;
uniform vec4 uHawk[3]; uniform vec4 uHawkF[3]; uniform vec3 uHawkU[3]; uniform vec3 uLens; uniform float uPxK;
varying vec3 vN, vPos; varying float vWhite; varying vec2 vWing;
#include <fog_pars_vertex>
void main(){
  int i = int(aI + .5);
  vec3 P = uHawk[i].xyz; float fold = uHawk[i].w; vec3 F = normalize(uHawkF[i].xyz + vec3(0., 0., 1e-4)); float ph = uHawkF[i].w;
  vec3 Rb = normalize(cross(uHawkU[i], F) + vec3(1e-4, 0., 0.)), Ub = cross(F, Rb);          // banked: the world rolls its back toward the lens
  vec3 lp = position, ln = normal; float side = lp.x < 0. ? -1. : 1., d = abs(lp.x);
  if (aWing.x >= 0.) {
    float A1 = (1. - fold) * (.1 + .55 * sin(ph)) - fold * .25, A2 = A1 + (1. - fold) * .4 * sin(ph - 1.) - fold * .35;
    float d1 = clamp(d - .08, 0., .37), d2 = max(d - .45, 0.);
    float sw = fold * .8;                                   // hand swept back into a crescent
    lp.x = side * (.08 + cos(A1) * d1 + cos(A2) * d2 * cos(sw));
    lp.y += sin(A1) * d1 + sin(A2) * d2;
    lp.z -= d2 * sin(sw) + fold * d1 * .25;
    float A = mix(A1, A2, step(.45, d)); ln = vec3(-side * sin(A), cos(A), 0.);
  }
  float dist = length(P - uLens);
  vec3 lpos = P + (Rb * lp.x + Ub * lp.y + F * lp.z) * (.95 * clamp(dist * uPxK * 1.2, 1., 3.));
  vN = Rb * ln.x + Ub * ln.y + F * ln.z; vPos = lpos; vWhite = aWhite; vWing = aWing;
  vec4 mvPosition = modelViewMatrix * vec4(lpos, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Qe=`
varying vec3 vN, vPos; varying float vWhite; varying vec2 vWing;
#include <fog_pars_fragment>
${Ve}
void main(){
  vec3 V = normalize(uLens - vPos + vec3(1e-4, 0., 0.));
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.)); if (dot(N, V) < 0.) N = -N;
  float ndv = abs(dot(N, V)), fres = 1. - ndv; fres *= fres * fres;
  float wrap = .5 + .5 * dot(N, uGlowDir);
  vec3 amb = mix(uSkyCol, vec3(dot(uSkyCol, vec3(.333))), .5) * uAmb;
  vec3 col = vec3(.011, .011, .013) * amb * (.5 + .5 * N.y) * (.25 + .75 * uOpen) + uGlowCol * (fres * smoothstep(.02, .3, ndv) * wrap * wrap * .09);   // black, a thin rim toward the glow
  // the pale flashes that read from behind: the white throat wrapping round as a collar, and a grey bar across the base of the primaries
  float bar = step(0., vWing.x) * smoothstep(.43, .5, vWing.x) * (1. - smoothstep(.6, .68, vWing.x)) * smoothstep(.06, .25, vWing.y) * (1. - smoothstep(.7, .95, vWing.y));
  float pale = max(smoothstep(.3, .7, vWhite), .6 * bar);
  col += pale * vec3(.62, .64, .6) * (amb * (.10 * (.3 + .7 * uOpen)) + uGlowCol * (.10 + .25 * wrap));
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`;function Ye(){const w=[],n=[],x=[],_=[],A=[],C=(m,o,u,L,W,v,I,c,te=0)=>(w.push(m,o,u),n.push(L,W,v),x.push(I,c),_.push(te),w.length/3-1),J=[[.4,.004],[.345,.03],[.28,.062],[.2,.058],[.08,.092],[-.12,.086],[-.28,.05],[-.36,.022]],S=6,k=[];for(const[m,o]of J){const u=[];for(let L=0;L<S;L++){const W=L/S*Math.PI*2+Math.PI/S,v=Math.cos(W),I=Math.sin(W);u.push(C(v*o,I*o*.9,m,v,I,0,-1,0,I<.6&&m>.1&&m<.34||m>.24&&m<.32?1:0))}k.push(u)}for(let m=0;m<k.length-1;m++)for(let o=0;o<S;o++){const u=k[m][o],L=k[m][(o+1)%S],W=k[m+1][o],v=k[m+1][(o+1)%S];A.push(u,W,L,L,W,v)}const i=[C(-.05,.01,-.28,0,1,0,-1,0),C(.05,.01,-.28,0,1,0,-1,0),C(-.18,0,-.68,0,1,0,-1,0),C(0,.012,-.74,0,1,0,-1,0),C(.18,0,-.68,0,1,0,-1,0)];A.push(i[0],i[2],i[3],i[0],i[3],i[1],i[1],i[3],i[4]);const z=[0,.2,.4,.58,.76,.9,1],D=[0,.5,1];for(const m of[-1,1]){const o=[];for(const u of z){const L=.14+.1*Math.sin(u*2.2)-.42*u*u,W=.3*Math.pow(1-u,.75)+.02,v=[];for(const I of D)v.push(C(m*Q(.08,1,u),.02+.03*Math.sin(Math.PI*I)*(1-u),L-W*I,0,1,0,u,I));o.push(v)}for(let u=0;u<z.length-1;u++)for(let L=0;L<D.length-1;L++)A.push(o[u][L],o[u+1][L],o[u][L+1],o[u+1][L],o[u+1][L+1],o[u][L+1])}const h=new a.InstancedBufferGeometry;return h.setAttribute("position",new a.Float32BufferAttribute(w,3)),h.setAttribute("normal",new a.Float32BufferAttribute(n,3)),h.setAttribute("aWing",new a.Float32BufferAttribute(x,2)),h.setAttribute("aWhite",new a.Float32BufferAttribute(_,1)),h.setIndex(A),h}function qe(w){const n=[],x=i=>47.5*(.6+.4*V(-5,62,i)),_=(i,z,D,h)=>h*V(z-D,z,i)*(1-V(z,z+.22*D,i)),A=i=>_(i,96,15,5.5)+_(i,80,13,9.5)+_(i,63,9,4.5)+_(i,51,12,7)+_(i,30,16,4);for(let i=0;i<=16;i++){const z=Q(-14,72,i/16);n.push([x(z),z])}for(let i=1;i<44;i++){const z=i/44*Math.PI;n.push([47.5*Math.cos(z)*(1+.05*Math.sin(z*2)),72+48*Math.sin(z)])}for(let i=0;i<=16;i++){const z=Q(72,-14,i/16);n.push([-x(z),z])}for(const i of n)i[0]<0&&(i[0]+=A(i[1])*V(0,-12,i[0]));const C=[0];for(let i=1;i<n.length;i++)C.push(C[i-1]+Math.hypot(n[i][0]-n[i-1][0],n[i][1]-n[i-1][1]));const J=200,S=[];let k=0;for(let i=0;i<=J;i++){const z=i/J*C[C.length-1];for(;k<n.length-2&&C[k+1]<z;)k++;const D=ae((z-C[k])/Math.max(1e-4,C[k+1]-C[k]),0,1),h=Q(n[k][0],n[k+1][0],D),m=Q(n[k][1],n[k+1][1],D),o=Math.hypot(h,m-55)||1,u=w.fbm2(h*.035+7,m*.035,3)*2.6*V(-14,10,m);S.push(g(h+h/o*u,Math.min(120.5,m+(m-55)/o*u),0))}return S}async function $e(w,n,x,_=0){const{rng:A,noise:C}=w,J=new a.Group,S=qe(C),k=S.length-1,i=new a.Color(n[4]).multiplyScalar(.34),z=new a.Color(n[1]).multiplyScalar(.42),D=new a.Color(n[0]).multiplyScalar(2.2),h=new a.Color(n[5]).multiplyScalar(1.5),m=new a.Color(n[6]).multiplyScalar(1.6),o=new a.Color,u=[[4,-36],[2.2,-22],[.6,-8],[0,0],[3.5,3.2],[9,2.2],[17,-1],[27,-3.5],[39,-6.5],[53,-10],[68,-14],[82,-19],[88,-36],[4,-36]],L=d=>152+24*C.fbm2(d*.011,1.7,3)+9*C.fbm2(d*.06,8.1,2)-.0016*d*d,W=u.length,v=new Float32Array((k+1)*W*3),I=new Float32Array((k+1)*W*3),c=[],te=[];for(let d=0;d<=k;d++){const K=S[Math.max(0,d-2)],P=S[Math.min(k,d+2)],B=P.x-K.x,t=P.y-K.y,l=Math.hypot(B,t)||1;te.push([-t/l,B/l])}const ce=te[0][0]*S[0].x>0?1:-1;for(let d=0;d<=k;d++){await w.yield?.();const K=S[d],P=te[d][0]*ce,B=te[d][1]*ce;for(let t=0;t<W;t++){let[l,q]=u[t];const p=V(20,80,l),N=K.x,G=K.y-48,O=Math.hypot(N,G)||1,F=N/O,E=G/O,U=122+16*C.fbm2(d*.045,3.3,3),$=Math.min(U/Math.max(Math.abs(F),.001),E>.05?140/E:1e6),se=F*$,fe=Math.min(48+E*$,L(se)),e=Math.max(0,(l-12)/76),r=Math.min(l,12);let s=K.x+P*r*(1-e)+(se-K.x)*e,b=K.y+B*r*(1-e)+(fe-K.y)*e;K.y>78&&t>=2&&t<=5&&(q+=5.5*V(78,112,K.y)*(t===3||t===4?1:.5));const M=C.fbm3(s*.022,b*.022,q*.03+5,4),y=Math.abs(((b*.11+M*1.6)%1+1)%1-.5)*2,T=t===3?.5:Q(1.3,2.6,p),f=V(.3,.42,y),R=Math.abs(Math.sin(s*.19+M*2.2)),ue=t>3&&t<W-2?M*T*1.4+(f-.5)*2.2*V(3,14,l)+R*1.2*p:0;s+=P*M*T*.7,b+=B*M*T*.7,q+=ue,t<W-1&&(b=Math.max(b,-14));const X=(d*W+t)*3;v[X]=s,v[X+1]=b,v[X+2]=q;const j=V(.05,.55,C.fbm2(s*.09+30,b*.012,3)*.5+.5);o.copy(i).lerp(z,j*.8).lerp(m,V(.2,.7,C.n3(s*.03,b*.03,9))*.25),o.lerp(h,V(.45,.95,y)*.55*V(2,14,l)+p*.5*V(.1,.9,B)),o.multiplyScalar(.78+.4*(M*.5+.5)),t<3||t===W-1?o.multiplyScalar(t===2?.05:.02):t===3&&_>0&&o.lerp(D,_),I[X]=o.r,I[X+1]=o.g,I[X+2]=o.b}}for(let d=0;d<k;d++)for(let K=0;K<W-1;K++){const P=d*W+K,B=P+W;c.push(P,B,P+1,B,B+1,P+1)}await w.yield?.();{const d=Math.floor(k/2)*W+6;let K=0;for(let P=0;P<c.length;P+=3){const B=c[P],t=c[P+1],l=c[P+2];if(B!==d&&t!==d&&l!==d)continue;const q=v[l*3]-v[t*3],p=v[l*3+1]-v[t*3+1],N=v[B*3]-v[t*3],G=v[B*3+1]-v[t*3+1];K+=q*G-p*N}if(K<0)for(let P=0;P<c.length;P+=3){const B=c[P+1];c[P+1]=c[P+2],c[P+2]=B}}const ee=new a.BufferGeometry;{const d=c.length/3,K=new Float32Array(d*9),P=new Float32Array(d*9),B=new Float32Array(d*9);for(let t=0;t<d;t++){(t&2047)===2047&&await w.yield?.();const l=c[t*3]*3,q=c[t*3+1]*3,p=c[t*3+2]*3,N=t*9;for(let s=0;s<3;s++)K[N+s]=v[l+s],K[N+3+s]=v[q+s],K[N+6+s]=v[p+s],P[N+s]=I[l+s],P[N+3+s]=I[q+s],P[N+6+s]=I[p+s];const G=v[p]-v[q],O=v[p+1]-v[q+1],F=v[p+2]-v[q+2],E=v[l]-v[q],U=v[l+1]-v[q+1],$=v[l+2]-v[q+2];let se=O*$-F*U,fe=F*E-G*$,e=G*U-O*E;const r=Math.hypot(se,fe,e)||1;se/=r,fe/=r,e/=r;for(let s=0;s<9;s+=3)B[N+s]=se,B[N+s+1]=fe,B[N+s+2]=e}ee.setAttribute("position",new a.BufferAttribute(K,3)),ee.setAttribute("color",new a.BufferAttribute(P,3)),ee.setAttribute("normal",new a.BufferAttribute(B,3))}await w.yield?.();const Me=[ee],Ae=[],ke=new a.Matrix4,xe=new a.Quaternion,Y=new a.Euler,le=g();let ze=200;const re=[],oe=[];for(let d=0;d<=k;d++)S[d].y>74&&oe.push(d);const Fe=118;for(let d=0;d<Fe;d++){(d&3)===3&&await w.yield?.();const K=oe[Math.floor(A()*oe.length)],P=S[K],B=te[K][1]*ce,t=te[K][0]*ce,l=A()<.45?A.range(2.5,8.5):A.range(-30,1),q=(l>0,l),p=l<0?-l/40:0,N=V(.1,.95,B);let G=Q(2.2,12,Math.pow(A(),1.7))*(.35+.65*N);const O=P.x+t*(.8+p*3.2),F=P.y+B*(.8+p*3.2)+.6;if(Math.abs(O)<17&&(G=Math.min(G,F-109.2)),G<1.2)continue;const E=new a.CylinderGeometry(1,.02,1,6,4,!0),U=E.attributes.position,$=A.range(0,6.28);for(let s=0;s<U.count;s++){const b=U.getY(s),M=.5-b,y=Math.atan2(U.getZ(s),U.getX(s)),T=(Math.pow(1-M,1.5)*.9+.1*(1-M))*(1+.22*Math.sin(y*3+$)+.12*Math.sin(M*17+$));U.setXYZ(s,Math.cos(y)*T,b-.5,Math.sin(y)*T)}const se=G*A.range(.07,.12)+.25;Y.set(-A.range(.1,.26),A.range(0,6.28),A.range(-.06,.06),"XYZ"),xe.setFromEuler(Y),le.set(se,G,se),ke.compose(g(O,F,q),xe,le),E.applyMatrix4(ke);const fe=new Float32Array(U.count*3),e=A.range(.7,1.25);for(let s=0;s<U.count;s++){const b=ae((F-U.getY(s))/G,0,1);o.copy(i).lerp(z,.35+.5*b).multiplyScalar(e*(l<0?.55:1)),fe[s*3]=o.r,fe[s*3+1]=o.g,fe[s*3+2]=o.b}E.setAttribute("color",new a.BufferAttribute(fe,3)),E.deleteAttribute("uv");const r=E.toNonIndexed();r.computeVertexNormals(),Ae.push(r),Math.abs(O)<17&&(ze=Math.min(ze,F-G))}for(let d=0;d<40;d++){const K=oe[Math.floor(A()*oe.length)],P=S[K];let B=A.range(10,25);Math.abs(P.x)<18&&(B=Math.min(B,P.y-109.5)),B>2.5&&re.push({x:P.x,y:P.y+1.5,z:A.range(4,9)+5.5*V(78,112,P.y),len:B})}await w.yield?.();const ve=Ge(Me.concat(Ae),!1);await w.yield?.();const pe=new a.MeshStandardMaterial({vertexColors:!0,roughness:.86,metalness:0,side:a.DoubleSide}),ge=new a.Mesh(ve,pe);ge.frustumCulled=!1,J.add(ge);const we=12,H=[],Z=[],de=[];if(re.forEach((d,K)=>{const P=A.range(0,6.28),B=A.range(-1,1);for(let t=0;t<=we;t++)for(const l of[-1,1])H.push(d.x,d.y,d.z),Z.push(t/we,l,d.len,P+B*.001);for(let t=0;t<we;t++){const l=K*(we+1)*2+t*2;de.push(l,l+2,l+1,l+1,l+2,l+3)}}),re.length){const d=new a.BufferGeometry;d.setAttribute("position",new a.Float32BufferAttribute(H,3)),d.setAttribute("aL",new a.Float32BufferAttribute(Z,4)),d.setIndex(de);const K=new a.ShaderMaterial({fog:!0,side:a.DoubleSide,uniforms:{...a.UniformsUtils.clone(a.UniformsLib.fog),uTime:x.uTime,uLens:x.uLens,uPxK:x.uPxK,uGlowCol:x.uGlowCol,uSkyCol:x.uSkyCol,uAmb:x.uAmb,uCol:{value:new a.Color(n[5]).lerp(new a.Color(n[6]),.5)}},vertexShader:`
        attribute vec4 aL; uniform float uTime, uPxK; uniform vec3 uLens; varying float vT;
        #include <fog_pars_vertex>
        void main(){
          float t = aL.x, len = aL.z, ph = aL.w; float sw = t * t * len;
          vec3 p = position + vec3(sin(uTime * .55 + ph) * .075 * sw + sin(t * 7. + ph) * .35, -t * len, cos(uTime * .41 + ph * 1.7) * .06 * sw + cos(t * 5. + ph) * .3);
          vec3 toL = uLens - p; float dist = length(toL);
          vec3 sd = normalize(cross(toL / max(dist, 1e-3), vec3(0., 1., 0.)) + vec3(1e-4, 0., 0.));
          p += sd * aL.y * max(.07 * (1.6 - t), dist * uPxK * .16);
          vT = t;
          vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        uniform vec3 uCol, uGlowCol, uSkyCol; uniform float uAmb; varying float vT;
        #include <fog_pars_fragment>
        void main(){ vec3 col = uCol * (uSkyCol * uAmb * .5 + uGlowCol * .5) * (.7 + .5 * sin(vT * 40.) * sin(vT * 40.)); gl_FragColor = vec4(col, 1.); 
          #include <fog_fragment>
        }`}),P=new a.Mesh(d,K);P.frustumCulled=!1,J.add(P)}return{group:J,outline:S,lipTipY:Math.min(ze,119)}}const Re={afterglow:{glow:null,glowI:1.5,sky:null,amb:3.2,thin:1},day:{glow:"#ff9a52",glowI:3.2,sky:"#8fb6e8",amb:4.5,thin:1},golden:{glow:"#ff8a3c",glowI:3.4,sky:"#86a8dc",amb:4,thin:1,farLit:.05},night:{glow:"#c8d6f4",glowI:1.2,sky:"#3a548a",amb:1.25,thin:1,farLit:.002,thruFar:.012,bat:"#30313a"}};async function Je(w,n={}){const x=w.rng.fork?w.rng.fork("rope"):w.rng,_=n.palette&&n.palette.length>=7?n.palette:Ke,A=Re[n.hour]||Re.afterglow,C=n.form||"rope",J=w.quality?.detail??1,S=ae(n.density??1,.5,1.3)*A.thin,k=new a.Group;k.name="deer-cave-exodus-rope";const i=_e(x,n),z=i.length,D=Math.min(z/2,n.window??340),h=Math.min(z,n.farWindow??z),m=n.farLead??0;await w.yield?.();const o=De(i);await w.yield?.();const u=x.chance(.5)?1:-1,L=C==="pulses"?8:0,W=g(-.91,.07,.4).normalize(),v=[0,1,2,3].map(()=>new a.Vector4(0,-999,0,0)),I=[0,1,2,3].map(()=>new a.Vector4(0,-999,0,0)),c={uLine:{value:i.tex},uLen:{value:z},uTime:{value:0},uSpeed:{value:16},uVar:{value:L?.02:.3},uTwist:{value:u*(Math.PI*2/x.range(120,170))},uSpin:{value:u*x.range(.18,.3)},uBraid:{value:C==="braid"?8.5:0},uPulse:{value:L},uCapA:{value:v},uCapB:{value:I},uKink:{value:[0,1,2].map(()=>new a.Vector4(-999,0,22,0))},uKinkDir:{value:[0,1,2].map(()=>g(1,0,0))},uLens:{value:g(0,96,-380)},uCut:{value:new a.Vector2(0,0)},uLeg:{value:g(1e9,1e9,1)},uSway:{value:new a.Vector4(0,0,0,0)},uKeyThin:{value:new a.Vector4(-140,-30,1,1e6)},uWin:{value:D},uCamS:{value:D/2},uPxK:{value:.013},uSize:{value:.225},uSqF:{value:g(0,0,1)},uSqV:{value:g(0,0,1)},uSqP:{value:g(0,96,-380)},uPark:{value:0},uSpread:{value:0},uSqPh:{value:0},uFurCol:{value:new a.Color().setRGB(.051,.0465,.043)},uBatAmb:{value:new a.Color(.95,.93,.92)},uBatAmbOut:{value:new a.Color(.3,.34,.5)},uDif:{value:.5},uIn:{value:0},uWinF:{value:h},uFarS:{value:h/2},uWinFade:{value:h<z-1?1:0},uFarK:{value:g(...n.farScale||[1,2.6,1.1])},uMidK:{value:new a.Vector2(...n.midScale||[1,2.2])},uTubeNear:{value:n.tubeNear?1:0},uBatCol:{value:new a.Color(_[6]).lerp(new a.Color(A.bat||_[6]),A.bat?.7:0)},uGlowCol:{value:new a.Color(A.glow||_[3]).multiplyScalar(A.glowI)},uSkyCol:{value:new a.Color(A.sky||_[2])},uGlowDir:{value:W.clone()},uAmb:{value:A.amb},uOpen:{value:1},uRim:{value:.2},uThru:{value:.05},uFarLit:{value:A.farLit||0},uThruFar:{value:A.thruFar??.02},uSmoke:{value:.95*Math.min(1,S*1.1)},uTail:{value:n.tail??60},uHawk:{value:[0,1,2].map(()=>new a.Vector4(0,300,0,0))},uHawkF:{value:[0,1,2].map(()=>new a.Vector4(0,0,1,0))},uHawkU:{value:[0,1,2].map(()=>g(0,1,0))}},te=(e,r,s={})=>new a.ShaderMaterial({uniforms:{...a.UniformsUtils.clone(a.UniformsLib.fog),...c},vertexShader:e,fragmentShader:r,fog:!0,...s}),ce=(e,r,s=0)=>{const b=new a.Mesh(e,r);return b.frustumCulled=!1,b.renderOrder=s,k.add(b),b},ee=(e,r,s)=>{const b=new Float32Array(r*4),M=new Float32Array(r*3);for(let y=0;y<r;y++)s(y,b,M);return e.setAttribute("aSeed",new a.InstancedBufferAttribute(b,4)),e.setAttribute("aSeed2",new a.InstancedBufferAttribute(M,3)),e.instanceCount=r,e},Me=e=>(r,s,b)=>{const M=C==="braid"?x()<.5?0:1:0;let y=x(),T=Math.sqrt(x())*(.7+.62*Math.pow(x(),3)),f=x()*Math.PI*2;if(e){const R=Math.floor(x()*e);y=(R+.5+.13*x.gauss())/e,T=.82+.3*x(),R%2&&(f=x()*3.6)}C==="braid"&&(T*=.68),s[r*4]=(y%1+1)%1,s[r*4+1]=T,s[r*4+2]=f,s[r*4+3]=x(),b[r*3]=x(),b[r*3+1]=0,b[r*3+2]=M},Ae=Math.min(n.maxFar??26e3,Math.round((n.far??23e3)*S*J)),ke=Math.min(n.maxMid??4e3,Math.round((n.mid??4200)*S*J)),xe=new a.InstancedBufferGeometry;if(xe.setAttribute("position",new a.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),xe.setIndex([0,1,2,0,2,3]),ee(xe,Ae,Me(L)),ce(xe,te(Oe,Ue,{transparent:!0,depthWrite:!1,side:a.DoubleSide}),3),await w.yield?.(),ce(ee(Ne(0),ke,Me(L/2)),te(Be,We,{side:a.DoubleSide}),1),n.squadron!==!1){const e=Math.PI/180,r=[[-15,7,3.5],[18,-8,4.1],[-28,-11,4.9],[27,10,5.3],[6,16,4.6],[-9,-16,5.1],[-34,13,6.1],[35,-14,5.9]],s=[[-23,12,2.7],[24,-13,2.5],[-27,-14,3.3],[26,14,3.1],[-12,20,4.8],[9,-19,4.4],[-33,3,5.6],[32,-3,5.3]],b=60,M=new Float32Array(b*3),y=[[-27,6,2.9],[29,-5,3.2],[-38,-9,2.4],[40,8,2.7],[-23,22,3.6],[24,-23,3.3],[-36,21,4.2],[37,-21,4],[-44,2,3.5],[45,-3,3.8],[-30,-22,3],[31,23,3.1],[-12,26,4.4],[13,-27,4.1],[-41,24,4.5],[42,-25,4.3],[-25,-15,3.9],[26,15,4.2],[-44,-28.5,1.9],[44.5,-28,2.1]],T=ee(Ne(1),b,(f,R,ue)=>{let X,j,ne;if(f<r.length)[X,j,ne]=r[f];else if(f>=40)[X,j,ne]=y[f-40];else{do X=x.range(-40,40),j=x.range(-21,24);while(Math.hypot(X,j)<9);ne=Q(7,19,Math.pow(x(),1.3))}const he=Math.sin(X*e)*Math.cos(j*e)*ne,Se=Math.sin(j*e)*ne,Ce=Math.cos(X*e)*Math.cos(j*e)*ne;if(R[f*4]=he,R[f*4+1]=Se,R[f*4+2]=Ce,R[f*4+3]=x(),ue[f*3]=x(),ue[f*3+1]=f<2||f===4||f===5?1:0,ue[f*3+2]=0,f<s.length){const[be,ye,me]=s[f];M[f*3]=Math.sin(be*e)*Math.cos(ye*e)*me,M[f*3+1]=Math.sin(ye*e)*me,M[f*3+2]=Math.cos(be*e)*Math.cos(ye*e)*me}else if(f>=40){const be=X*.8+x.range(-5,5),ye=Math.max(j*.7,-12)+x.range(-3,5),me=x.range(8,16);M[f*3]=Math.sin(be*e)*Math.cos(ye*e)*me,M[f*3+1]=Math.sin(ye*e)*me,M[f*3+2]=Math.cos(be*e)*Math.cos(ye*e)*me}else M[f*3]=he*.8,M[f*3+1]=Se*.8,M[f*3+2]=Ce*.8});T.setAttribute("aOut",new a.InstancedBufferAttribute(M,3)),ce(T,te(Be,We,{side:a.DoubleSide,defines:{SQUAD:1}}),1)}await w.yield?.();{const e=C==="braid"?2:1,r=C==="braid"?240:340,s=12,b=[],M=[],y=[],T=[],f=[];for(let ue=0;ue<e;ue++){const X=ue*(r+1)*(s+1);for(let j=0;j<=r;j++)for(let ne=0;ne<=s;ne++)b.push(j/r),M.push(ne/s*Math.PI*2),y.push(ue),f.push(0,0,0);for(let j=0;j<r;j++)for(let ne=0;ne<s;ne++){const he=X+j*(s+1)+ne;T.push(he,he+s+1,he+1,he+1,he+s+1,he+s+2)}}const R=new a.BufferGeometry;R.setAttribute("position",new a.Float32BufferAttribute(f,3)),R.setAttribute("aS",new a.Float32BufferAttribute(b,1)),R.setAttribute("aAng",new a.Float32BufferAttribute(M,1)),R.setAttribute("aStr",new a.Float32BufferAttribute(y,1)),R.setIndex(T),ce(R,te(Ee,He,{transparent:!0,depthWrite:!1,side:a.DoubleSide}),2)}const Y=ae(Math.round(n.hawks??3),0,3);if(Y){const e=Ye();e.setAttribute("aI",new a.InstancedBufferAttribute(new Float32Array([0,1,2]),1)),e.instanceCount=Y,ce(e,te(je,Qe,{side:a.DoubleSide}),1)}await w.yield?.();let le=null;n.mouth!==!1&&(le=await $e(w,_,c,n.lipDark??0),k.add(le.group));const ze=le?le.outline:qe(w.noise);if(await w.yield?.(),n.mistFloor!==!1){const e=new a.PlaneGeometry(1,1,1,1);e.rotateX(-Math.PI/2);const r=ce(e,new a.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,uniforms:{...a.UniformsUtils.clone(a.UniformsLib.fog),uTime:c.uTime,uGlowCol:c.uGlowCol,uGlowDir:c.uGlowDir,uMist:{value:new a.Color(_[4])},uDeep:{value:new a.Color(_[5])}},vertexShader:`
        varying vec2 vQ; varying vec3 vL;
        #include <fog_pars_vertex>
        void main(){ vQ = position.xz; vL = (modelMatrix * vec4(position, 1.)).xyz;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        varying vec2 vQ; varying vec3 vL; uniform float uTime; uniform vec3 uGlowCol, uGlowDir, uMist, uDeep;
        #include <fog_pars_fragment>
        float h21(vec2 p){ p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
        float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
          return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
        void main(){
          float r = length(vQ) * 2.;
          vec2 q = vL.xz * .011 + vec2(uTime * .012, uTime * .007);
          float n = vn(q) * .5 + vn(q * 2.3 + 7.) * .3 + vn(q * 5.1 - uTime * .02) * .2;
          float bank = smoothstep(.28, .72, n);
          vec3 col = mix(uDeep * .55, uMist * .6, bank) + uGlowCol * (.10 * bank * (.5 - .5 * normalize(vL + vec3(1e-3)).x));
          gl_FragColor = vec4(col, 1. - smoothstep(.55, 1., r));
          #include <fog_fragment>
        }`}),0);r.scale.set(2600,1,2600),r.position.set(40,44,150)}const re=[0];for(let e=1;e<o.length;e++)re.push(re[e-1]+o[e].distanceTo(o[e-1]));const oe=(e,r=g(),s=null)=>{const b=ae(e,0,1)*re[o.length-1];let M=0;for(;M<o.length-2&&re[M+1]<b;)M++;return s&&s.copy(o[M+1]).sub(o[M]).normalize(),r.copy(o[M]).lerp(o[M+1],ae((b-re[M])/Math.max(1e-4,re[M+1]-re[M]),0,1))},ve=[[.44,7,.85,.42,-.28,0],[.48,10,-.62,.5,-.6,0],[.53,11,-.8,.52,.22,-4]].map(([e,r,s,b,M,y])=>{const T=g(),f=oe(e,g(),T).addScaledVector(T,r);f.y+=y;const R=g().crossVectors(Te,T).normalize();return{u:e,at:f,dir:g().addScaledVector(R,s).addScaledVector(T,b).addScaledVector(Te,M).normalize(),w:.045,span:110,fwd:null,speed:22,secs:2.7,home:null,hole:"wake",holeR:4.3,pitch:0}}),pe=ve.map((e,r)=>({k:0,lastK:0,tKink:-1e6,sKink:0,prev:g(0,300,0),F:g(0,0,1),circ:x.range(0,6.28)+r*2.1}));let ge=null,we=null,H=null,Z=null,de=null,d=null,K=.75;const P=n.lensClear??1.3,B=g(),t=g(),l=g(),q=g(),p=g(),N=(e,r,s)=>{const b=ve[e];q.crossVectors(b.dir,Te).normalize();const M=V(.6,1,r),y=.25+.75*b.span/110;return s.copy(b.at).addScaledVector(b.dir,(r-.45)*b.span).addScaledVector(Te,(M*M*22+(1-V(0,.3,r))*14)*y).addScaledVector(q,Math.sin(r*9)*(1-V(.05,.3,r))*16*y)},G=new a.Matrix4,O=new a.Vector2,F=c.uLens.value,E=g(0,0,1);function U(e,r,s){if(c.uTime.value=r,k.updateWorldMatrix(!0,!1),G.copy(k.matrixWorld).invert(),s){F.setFromMatrixPosition(s.matrixWorld).applyMatrix4(G);const y=s.matrixWorld.elements;E.set(-y[8],-y[9],-y[10]).transformDirection(G),w.renderer?.getDrawingBufferSize(O);const T=O.y>8?O.y:720,f=s.projectionMatrix.elements[5]||1.6;c.uPxK.value=4.4/(T*f*.45)}const b=i.stationNear(F),M=Z!==null?Z:b*z;c.uCamS.value=ae(M,D/2-40,z-D/2+40),c.uFarS.value=ae(Z!==null&&de!==null?de:M+m,Math.min(z/2,h/2-60),Math.max(z/2,z-h/2+60)),d?c.uSqF.value.copy(d):(i.centerAt(b+.004,B).sub(i.centerAt(b-.004,t)),B.lengthSq()>1e-6&&c.uSqF.value.copy(B.normalize())),we?(c.uSqP.value.copy(we),c.uSqF.value.copy(H),c.uSqV.value.copy(H),c.uPark.value=1):(c.uSqP.value.copy(F),c.uPark.value=0,c.uSqV.value.copy(c.uSqF.value).lerp(E,K).normalize()),v[3].set(F.x,F.y,F.z,P),I[3].set(F.x,F.y,F.z,0);for(let y=0;y<3;y++){const T=pe[y],f=ve[y];let R;if(ge!==null)R=ae((ge-(f.u-.45*f.w))/f.w,0,1);else{const be=(r+7.1+y*3)/9%1;R=ae(be*4.1,0,1)}y>=Y&&(R=0),R>=.45&&T.lastK<.45&&(T.tKink=r,T.sKink=i.stationNear(f.at)*z),R<.45&&T.lastK>=.45&&ge!==null&&(T.tKink=-1e6),T.lastK=R,T.k=R;const ue=r*.22+T.circ,X=V(0,.12,R)*(1-V(.9,1,R)),j=f.home||f.at;B.set(j.x+Math.cos(ue)*46,j.y+46+6*Math.sin(ue*2.3),j.z+30+Math.sin(ue)*46),N(y,R,t),B.lerp(t,X),l.copy(B).sub(T.prev),e>0&&l.lengthSq()>1e-8&&T.F.lerp(l.normalize(),1-Math.pow(.5,e*60)).normalize(),X>.6&&(N(y,R+.01,l).sub(t),f.fwd&&l.multiplyScalar(100/Math.max(f.secs,.5)).addScaledVector(f.fwd,f.speed),l.lengthSq()>1e-8&&T.F.copy(l.normalize()),f.pitch&&(T.F.y+=Q(-f.pitch,f.pitch*.7,V(.56,.8,R)),T.F.normalize()),f.aim&&T.F.copy(f.aim).normalize()),T.prev.copy(B);const ne=(f.foldMax??.72)*V(.1,.28,R)*(1-V(.56,.72,R));c.uHawk.value[y].set(B.x,y<Y?B.y:-9999,B.z,ne),c.uHawkF.value[y].set(T.F.x,T.F.y,T.F.z,r*11+y*2),l.copy(F).sub(B).normalize(),p.set(0,1,0).lerp(l,ae((f.bank||0)*X,0,1)),p.addScaledVector(T.F,-p.dot(T.F)),p.lengthSq()<1e-4&&p.set(0,1,0),c.uHawkU.value[y].copy(p.normalize());const he=f.holeR*V(.22,.38,R)*(1-V(.72,.98,R));if(f.hole==="view"){l.copy(B).sub(F);const be=l.length()||1;l.multiplyScalar(1/be);const ye=(f.holeTan??.23)*V(.22,.38,R)*(1-V(.72,.98,R)),me=Math.min(2.2,be*.4),Le=f.holeLen??85;v[y].set(F.x+l.x*me,F.y+l.y*me,F.z+l.z*me,ye*me),I[y].set(F.x+l.x*Le,F.y+l.y*Le,F.z+l.z*Le,ye*Le)}else N(y,Math.min(R+.03,1),t),v[y].set(t.x,t.y,t.z,he),N(y,Math.max(R-.42,.18),t),I[y].set(t.x,t.y,t.z,he*.15);const Se=r-T.tKink,Ce=c.uKink.value[y];Se>=0&&Se<14?(Ce.set(T.sKink+58*Se,7.5*V(0,.3,Se)*Math.exp(-Se/2.6),20+3*Se,0),c.uKinkDir.value[y].copy(f.dir)):Ce.set(-999,0,22,0)}}U(0,0,null);const $=i.seat,se=g().crossVectors(Te,i.dir).normalize(),fe={object:k,radius:46,height:60,center:g(0,93,125),anchors:{mouth:{position:g(0,60,0),width:95,height:120,normal:g(0,0,1)},mouthOutline:ze,lipTipY:le?le.lipTipY:108.6,flyThrough:o,portalSeat:{position:$.clone(),facing:i.dir.clone().negate(),direction:i.dir.clone(),radius:7,tiltDeg:3},notchLeft:$.clone().addScaledVector(se,10),notchRight:$.clone().addScaledVector(se,-10),viewpoints:{keyhole:o[0].clone(),corkscrew:o[7].clone(),threshold:o[14].clone(),flank:o[19].clone(),notch:$.clone().addScaledVector(i.dir,-60)},strikes:ve,ropeSource:i.centerAt(0),ropeEnd:i.centerAt(1),glowDir:W.clone()},strikes:ve,uniforms:c,length:z,form:C,centerAt:i.centerAt,stationNear:i.stationNear,ropeRadiusAt:i.radiusAt,setCut(e,r){c.uCut.value.set(e,r)},setPark(e,r){we=e||null,H=r||null},setWindow(e,r){Z=e??null,de=r??null},setMouthVisible(e){le&&(le.group.visible=!!e)},setSway(e,r,s,b){c.uSway.value.set(e,r,s,1/Math.max(b,1))},setKeyThin(e,r,s,b){c.uKeyThin.value.set(e,r,s,b)},setLeg(e,r,s){c.uLeg.value.set(e,r,s)},setSquadHeading(e){d=e||null},setProgress(e){ge=e==null?null:ae(e,0,1)},setLight(e={}){e.glowDir&&c.uGlowDir.value.copy(e.glowDir).normalize(),e.glowColor&&c.uGlowCol.value.copy(e.glowColor),e.skyColor&&c.uSkyCol.value.copy(e.skyColor),e.ambient!==void 0&&(c.uAmb.value=e.ambient),e.open!==void 0&&(c.uOpen.value=e.open),e.rim!==void 0&&(c.uRim.value=e.rim),e.through!==void 0&&(c.uThru.value=e.through),e.spread!==void 0&&(c.uSpread.value=e.spread),e.batAmb&&c.uBatAmb.value.copy(e.batAmb),e.batAmbOut&&c.uBatAmbOut.value.copy(e.batAmbOut),e.dif!==void 0&&(c.uDif.value=e.dif),e.inside!==void 0&&(c.uIn.value=e.inside),e.follow!==void 0&&(K=e.follow),e.phase!==void 0&&(c.uSqPh.value=e.phase)},update:U,dispose(){i.tex.dispose()},ground:!1,groundY:0};return k.userData.api=fe,fe}export{Ie as BAT_STROKE_GLSL,Je as buildHero};
