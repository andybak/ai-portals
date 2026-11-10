import*as _ from"three";import{clamp as j,lerp as P,smoothstep as U}from"../kit/core.js";import*as e from"../parts/where-the-lattice-grows.js";const lo={any:[.0105,.0062,.0034],day:[.0105,.0062,.0034],night:[.008,.005,.003],dawn:[.0125,.007,.0034],golden:[.0125,.007,.0034]},aa=2.4,na=3,sa=-.15,ia=.75,ra=.09,la=[.013,.0232,.0678],ha=[.0509,.0237,.1117],ca=[.0239,.0789,.0881],fa=[.045,.016,.022],da=.34,ua=.36,pa=.6,Ce=.036,ma=.5,ya=.0022,wa=.16,va={frost:"#F2F8FF",blue:"#E6F0FF",snow:"#F8FBFF"},ga="#C4DCFF",Sa=7.5,ho=c=>(c-1)%4,co=6,Be=2.6,xa=3,Ea=2.4,Aa=.9,Ra=.9,fo=[.55,4],Ma=.56,Fa=.7,_a=`
varying vec3 vDir;
void main(){
  vDir = position;
  vec4 p = projectionMatrix * vec4(mat3(viewMatrix) * position, 1.);
  if (abs(p.w) < 1e-4) p.w = 1e-4;
  gl_Position = p.xyww;
}`,ba=`
uniform vec3 uAmber, uSpark, uBlue, uViolet, uTeal, uRose, uDrift; uniform vec4 uBreath; uniform float uTime, uLift;
varying vec3 vDir;
float glow(float c, float ph){ return exp(-(1. - clamp(c, 0., 1.)) / .012) * (1. + .2 * sin(uTime * .698 + ph)); }
float h3(vec3 q){ q = fract(q * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float vn(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f * f * f * (f * (f * 6. - 15.) + 10.);
  return mix(mix(mix(h3(i), h3(i + vec3(1., 0., 0.)), f.x), mix(h3(i + vec3(0., 1., 0.)), h3(i + vec3(1., 1., 0.)), f.x), f.y),
             mix(mix(h3(i + vec3(0., 0., 1.)), h3(i + vec3(1., 0., 1.)), f.x), mix(h3(i + vec3(0., 1., 1.)), h3(i + vec3(1., 1., 1.)), f.x), f.y), f.z);
}
float cloud(vec3 q){ return .57 * vn(q) + .29 * vn(q * 2.03 + 7.1) + .14 * vn(q * 4.1 + 13.7); }
// FAR SMALL LAMPS: fine points in rank on the deep, by the direction's bearing round the level and its height over it
// (t: the direction's share of the cold deep)
vec3 farLamps(vec3 d, float t){
  float el = asin(clamp(d.y, -1., 1.)), az = atan(d.x, d.z + sign(d.z) * 1e-5), row = floor(el / ${(Ce*.866).toFixed(5)} + .5);
  float off = .5 * mod(row, 2.), col = floor(az / ${Ce.toFixed(4)} - off + .5);
  vec2 v = vec2((az - (col + off) * ${Ce.toFixed(4)}) * cos(el), el - row * ${(Ce*.866).toFixed(5)});
  float h = h3(vec3(col, row, 3.7)), on = step(h, ${ma.toFixed(2)}), k = h3(vec3(row, col, 9.1));
  float s = ${ya.toFixed(4)} * (.7 + .6 * k), a = exp(-dot(v, v) / (s * s)) * on * (.25 + .75 * k * k) * (.8 + .2 * sin(uTime * (.4 + k) + 40. * h));
  return mix(vec3(1., .78, .5), vec3(.74, .76, 1.), t) * (${wa.toFixed(2)} * a);
}
void main(){
  vec3 d = vDir / max(length(vDir), 1e-4), p = cameraPosition;
  vec3 s = uSpark - p; float t = dot(s, d), deep = (1. - smoothstep(25., 70., length(s - d * max(t, 0.)))) * step(0., t);
  float n1 = cloud(d * 1.5 + uDrift + vec3(.017, .004, -.011) * uTime), n2 = cloud(d * 1.1 + uDrift.zxy - vec3(.009, .003, .013) * uTime);
  // the warm side: amber dusk, a shade lighter toward the level
  vec3 warm = uAmber * (1. + ${(na-1).toFixed(2)} * exp(-d.y * d.y / .1) * (.5 + n1));
  // the cold side: deep blue going to violet upward (and by the clouds), darker straight down; the teal a soft glow low on that side
  vec3 cold = mix(uBlue, uViolet, clamp(.8 * smoothstep(-.3, .6, d.y) + .7 * (n2 - .5), 0., 1.)) * (.65 + .7 * n1) * (1. - .45 * smoothstep(.35, 1., -d.y));
  float q = (d.y + ${da.toFixed(2)}) / ${ua.toFixed(2)};
  cold += uTeal * (${pa.toFixed(2)} * exp(-q * q) * (.45 + .8 * n2));
  // the going-over, through rose-brown, in the eye's own measure: no edge of tone
  float go = smoothstep(${sa.toFixed(2)}, ${ia.toFixed(2)}, d.x + .14 * (n2 - .5));
  vec3 gw = pow(max(warm, vec3(1e-5)), vec3(.4545)), gc = pow(max(cold, vec3(1e-5)), vec3(.4545)), gr = pow(max(uRose * (.7 + .6 * n1), vec3(1e-5)), vec3(.4545));
  vec3 col = pow(max(gw * ((1. - go) * (1. - go)) + gr * (2. * go * (1. - go)) + gc * (go * go), vec3(0.)), vec3(2.2));
  // the thin veil of the cold deep's violet over every direction
  col += uViolet * (${ra.toFixed(2)} * (.6 + .8 * n2));
  float g = glow(d.z, uBreath.x) + glow(-d.z, uBreath.y) + glow(abs(d.x), uBreath.z)
    + .6 * (glow(abs(.5 * d.x + .866 * d.y), uBreath.w) + glow(abs(.5 * d.x - .866 * d.y), uBreath.w + 2.1));
  col *= 1. + (uLift - 1.) * clamp(g * (1. - deep), 0., 1.);
  col += farLamps(d, go) * (1. - deep);
  gl_FragColor = vec4(col, 1.);
}`,Ia=`
attribute vec3 aP0, aP1; attribute vec4 aInfo;   // spoke, metres from the rim where this piece begins, its standing strength, 1 for a lamp
varying vec4 vS; varying vec2 vM; varying float vW, vR;
${e.GLSL_LAWS}
void main(){
  float m = 38. * mod(uTime - .18 * aInfo.x, 1.1); vW = 0.; vR = 0.;
  // heat, IN THE SHEET'S OWN PLANE: everything of the spark's sheet that this mesh draws (the six threads, the six lamps,
  // the rose) trembles along x and y only, so that no part of it ever stands before its own sheet's plane (the spark's
  // sheet z 560; round r11: a ring's own sheet)
  vec3 tA = tremble(aP0), tB = tremble(aP1);
  vec3 A = aP0 + vec3(tA.xy, 0.) * step(6., length(aP0.xy - uSpark.xy)), B = aP1 + vec3(tB.xy, 0.);
  vec3 ax = B - A; float len = length(ax); ax /= max(len, 1e-4);
  vec3 P = A + ax * (len * position.x);
  vec4 mv = modelViewMatrix * vec4(P, 1.);
  vec3 toP = P - cameraPosition; float d = length(toP), gain = hazeGold(d, hollowLen(cameraPosition, toP / max(d, 1e-3), d));
  if (aInfo.w > 3.5) {
    // A BEAD OF A BEADED RING (round r9): a small lamp behind the ring's own line by its reach, drawn at its true size, its
    // light the ring's own (the ring's strength, colour and pulse)
    mv.xy += position.yz * ${Be.toFixed(1)};
    vS = vec4(position.y * ${Be.toFixed(1)}, position.z * ${Be.toFixed(1)}, aInfo.z, 4.); m = aInfo.x; vR = aInfo.x;
  } else if (aInfo.w > 2.5) {
    // THE ROSE: a band of light lying FLAT in its own ring's sheet (round r11; no part of it before that plane), 1.4 m wide on the first
    // ring and thinner ring by ring to 1 m on the last. A PULSE OF WHITE RUNS INWARD RING BY RING on the world clock, one
    // every ROSE_S seconds, a ring at a time (every clock alike: there is always one ring lit by it)
    vec3 side = cross(ax, vec3(0., 0., 1.));
    mv = modelViewMatrix * vec4(P + side * (position.y * mix(.7, .5, aInfo.x) * 2.5), 1.);
    // ITS LIGHT IS A LAW OF ITS OWN PLACE: the ring's own strength (aInfo.z, by the ring's number), its colour and the pulse;
    // between it and the eye stands only the haze every lamp of the net has (gain, counted above by the lamps' own law)
    vS = vec4(position.x * len, position.y * 2.5, aInfo.z, 3.); m = aInfo.x;
    // THE PULSE'S PLACE (round r9): a ring has it by its number; a thread through the rings (aInfo.y 1) by its own
    // distance from the spark, so that on the six threads the white is seen to run inward from ring to ring
    vW = aInfo.y; vR = aInfo.y > .5 ? (length(P.xy - uSpark.xy) / ${e.SIDE.toFixed(1)} - 1.) / ${(e.ROSE_RINGS-1).toFixed(1)} : aInfo.x;
  } else if (aInfo.w < .5) {
    // a thread of the spark's node: its ribbon lies flat in the plane z 560, as the rose's bands do (it never turns to the eye)
    vec3 side = cross(ax, vec3(0., 0., 1.));
    float hw = aInfo.z > 0. ? .12 : .08;
    mv = modelViewMatrix * vec4(P + side * (position.y * hw * 2.5), 1.);
    vS = vec4(aInfo.y + position.x * len, position.y * 2.5, aInfo.z, 0.);
  } else if (aInfo.w < 1.5) {
    // a lamp of the hexagon: its core 0.55 m, drawn at its true size
    float cd = .55, r = 4.;
    mv.xy += position.yz * r;
    vS = vec4(position.y * r, position.z * r, cd, 1.);
  } else {
    // the spark's stand-in light: a flat patch in the plane z 560.3 of the world, facing -Z (nothing of it is seen from behind)
    mv = modelViewMatrix * vec4(aP0 + vec3(position.y * 4., position.z * 4., 0.), 1.); gain = step(cameraPosition.z, aP0.z);
    vS = vec4(position.y * 4., position.z * 4., 0., 2.);
  }
  vM = vec2(m, gain);
  gl_Position = projectionMatrix * mv;
}`,La=`
uniform vec3 uWhiteGold, uRoseWhite; uniform float uTime; varying vec4 vS; varying vec2 vM; varying float vW, vR;
float pulse(float x, float m){ float q = (x - m) / 2.2; return exp(-q * q) + .35 * exp(-max(m - x, 0.) / 7.) * step(x, m); }
// the rose's white pulse at a share of the way out (0 at the first ring, 1 at the last): it comes inward, one every ROSE_S seconds
float rosePulse(float sh){ float ph = fract(uTime / ${Sa.toFixed(1)} + .9 * sh); ph = min(ph, 1. - ph); return exp(-ph * ph / .0032); }
// the rose's colour at a share of the way out, lifted and whitened by the pulse
vec3 roseCol(float q, float w){
  vec3 col = mix(uRoseWhite, uWhiteGold, smoothstep(0., .25, q));
  col = mix(col, vec3(1., .5, .1), smoothstep(.2, .56, q));
  col = mix(col, vec3(.75, .1, .02), smoothstep(.56, 1., q));
  return mix(col, uRoseWhite, min(.6 * w, 1.)) * (1. + .9 * w);
}
void main(){
  float k;
  if (vS.w > 3.5) {
    // a bead: a small hot core in a short soft skirt that is nothing at its card's rim
    float r2 = dot(vS.xy, vS.xy);
    gl_FragColor = vec4(roseCol(clamp(vM.x, 0., 1.), rosePulse(vR)) * (vS.z * (1.7 * exp(-r2 / .3) + .3 * exp(-r2 / 1.6) * (1. - smoothstep(3.6, 6.76, r2))) * vM.y), 1.);
    return;
  }
  if (vS.w > 2.5) {
    // the rose (vM.x: 0 at the first ring, 1 at the last): ice blue white at the spark, through white gold (a quarter of
    // the way out) to gold (by the sixth ring) and ember at the outermost ring; its colours are its own, the same on every
    // visit (the join: nothing of it is dealt). The pulse lifts a ring by 0.9 and whitens it.
    // A BAND HAS A CORE (round r8): along its middle runs a bright line a tenth of the band broad (the band is five of
    // these units across); the band's own soft body is lowered by a fifth, so the ring gives the light it gave
    float y2 = vS.y * vS.y, prof = (.8 * exp(-1.1 * y2) + .9 * exp(-y2 / .09)) * (1. - smoothstep(4., 6.25, y2)), q = clamp(vM.x, 0., 1.);
    // (a thread through the rings takes the pulse THREAD_PULSE times as strongly as a ring: there the white runs)
    gl_FragColor = vec4(roseCol(q, rosePulse(vR) * (1. + ${(Ea-1).toFixed(1)} * vW)) * (vS.z * prof * vM.y), 1.);
    return;
  }
  if (vS.w < .5) {
    float x = vS.x, far = 1. - clamp((x - 19.) / 48., 0., 1.);
    float p = pulse(x, vM.x) + pulse(x, vM.x + 41.8);
    // across: a hot fine core in a faint sheath
    float y2 = vS.y * vS.y, prof = 1.3 * exp(-9. * y2) + .22 * exp(-1.2 * y2);
    // (round r9: the rose's inward pulse runs on down the thread from the first ring to the rim)
    float pin = rosePulse(((${e.RIM.toFixed(1)} + x) / ${e.SIDE.toFixed(1)} - 1.) / ${(e.ROSE_RINGS-1).toFixed(1)}) * step(.5, vS.z);
    k = (vS.z + p * (x < 19. ? 1.8 : .75 * far) + 1.6 * pin) * prof * vM.y;
  } else if (vS.w > 1.5) {
    // the spark's stand-in light: soft, 1.8 m in size (a sigma), nothing from 4 m
    float r2 = dot(vS.xy, vS.xy);
    k = 3. * exp(-r2 / 6.48) * (1. - smoothstep(9., 16., r2)) * vM.y;
  } else {
    // a lamp of the hexagon: a large white gold lamp that stands, and flares as the pulse reaches it
    float cd = max(vS.z, 1e-3), r2 = dot(vS.xy, vS.xy), q = r2 / (cd * cd), s = clamp(1. - sqrt(r2) / max(4., cd * 6.3), 0., 1.);
    float q1 = (vM.x - 19.) / 5., q2 = (vM.x + 41.8 - 19.) / 5., fl = exp(-q1 * q1) + exp(-q2 * q2);
    k = (2.6 * (exp(-1.4 * q) + .28 * exp(-q / 7.) * smoothstep(0., .35, s)) + 1.2 * exp(-18. * q) + (.4 + 1.6 * fl) * s * s * s) * vM.y;
  }
  gl_FragColor = vec4(uWhiteGold * k, 1.);
}`,Ge=46,Oa=`
attribute vec4 aSeed;   // where in the box's depth it starts (0 to 1), its y and z, its speed in metres a second
attribute vec2 aPh;
uniform vec3 uRoute[${Ge}];
varying vec2 vP; varying float vK, vIce;
${e.GLSL_LAWS}
void main(){
  vec3 p = vec3(HOL_C.x + HOL_R.x - mod((1. - aSeed.x) * HOL_R.x + aSeed.w * uTime, HOL_R.x), aSeed.y + 6. * sin(uTime * .21 + aPh.x), aSeed.z + 6. * sin(uTime * .17 + aPh.y));
  vec3 q = (p - HOL_C) / HOL_R; float rho = max(length(q), 1e-4), g = max(length(q / HOL_R) / rho, 1e-6);
  float fade = smoothstep(2., 16., min(p.x - HOL_C.x, (1. - rho) / g));
  float d2 = 1e9;
  for (int i = 0; i < ${Ge-1}; i++) {
    vec3 a = uRoute[i], ab = uRoute[i + 1] - a, w = p - a;
    w -= ab * clamp(dot(w, ab) / max(dot(ab, ab), 1e-6), 0., 1.);
    d2 = min(d2, dot(w, w));
  }
  float dl = sqrt(d2); fade *= smoothstep(4., 9., dl);
  // dark round the crystal: none shows within SNOW_CLEAR metres of its sheet
  fade *= smoothstep(${e.SNOW_CLEAR.toFixed(1)}, ${(e.SNOW_CLEAR+15).toFixed(1)}, abs(p.z - ${e.SNOW_AT[2].toFixed(1)}));
  // LARGE AND FEW NEAR THE LINE, by the point's own place: within 70 m of the route's line a point grows (to one and a half times
  // its size at 12 m from it) and two in five of them are lit there
  float byLine = 1. - smoothstep(12., 70., dl);
  fade *= mix(1., step(fract(aPh.y * 3.17), .4), byLine);
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  vec3 toP = p - cameraPosition; float d = length(toP);
  float r0 = (.3 + .42 * fract(aPh.x * 7.31)) * (1. + .5 * byLine), r = r0;
  fade *= hazeCold(d, hollowLen(cameraPosition, toP / max(d, 1e-3), d)) * (.7 + .3 * sin(uTime * 2.3 + aPh.y * 5.));
  mv.xy += position.xy * (r * 3. * step(.003, fade));
  gl_Position = projectionMatrix * mv;
  vP = position.xy * 3.; vK = fade; vIce = step(.8, fract(aPh.x * 3.71));
}`,Ta=`
varying vec2 vP; varying float vK, vIce;
void main(){
  // pale gold (#FFD98A), one in five ice blue (#9CC4FF)
  float r2 = dot(vP, vP), g = clamp(1. - sqrt(r2) / 3., 0., 1.);
  vec3 col = mix(vec3(1., .69, .25), vec3(.26, .44, .8), vIce);
  gl_FragColor = vec4(col * ((1.6 * exp(-1.3 * r2) + .18 * g * g) * vK), 1.);
}`;function Pa(){const c=[],oe=[],W=[],X=[],v=[],p=e.SPARK,D=(g,z,O,E,A,I,R=I?1:0)=>{const M=c.length/3,L=I?[[0,-1,-1],[0,1,-1],[0,1,1],[0,-1,1]]:[[0,-1,0],[1,-1,0],[1,1,0],[0,1,0]];for(const b of L)c.push(b[0],b[1],b[2]),oe.push(g[0],g[1],g[2]),W.push(z[0],z[1],z[2]),X.push(O,E,A,R);v.push(M,M+1,M+2,M,M+2,M+3)};for(let g=0;g<6;g++){const z=I=>[Math.cos((g+I)*Math.PI/3),Math.sin((g+I)*Math.PI/3)],O=z(0),E=I=>[p[0]+O[0]*I,p[1]+O[1]*I,p[2]],A=E(e.SIDE);D(E(e.RIM),A,g,0,1.3,!1);for(const I of[0,1,-1]){const R=z(I);D(A,[A[0]+R[0]*e.SIDE,A[1]+R[1]*e.SIDE,A[2]],g,e.SIDE-e.RIM,0,!1)}D(E(2*e.SIDE),E(3*e.SIDE),g,2*e.SIDE-e.RIM,0,!1),D(A,[A[0]+1,A[1],A[2]],g,0,0,!0)}for(let g=1;g<=e.ROSE_RINGS;g++){const z=(g-1)/(e.ROSE_RINGS-1),O=g*e.SIDE,E=e.roseRing(g);let A=0;for(let R=1;R<=g;R++)(R-1)/(e.ROSE_RINGS-1)>Ma&&A++;const I=Aa*Math.pow(Ra,g-1-A)*Math.pow(Fa,A)*P(fo[0],1,U(1,fo[1],g));for(let R=0;R<6;R++){const M=[...E.corners[R],E.z],L=[...E.corners[(R+1)%6],E.z],b=E.sides[R];for(let T=0;T<b;T++)D([P(M[0],L[0],T/b),P(M[1],L[1],T/b),M[2]],[P(M[0],L[0],(T+1)/b),P(M[1],L[1],(T+1)/b),M[2]],z,0,I,!1,3);if(g>1){const T=Math.cos(R*Math.PI/3),H=Math.sin(R*Math.PI/3);D([p[0]+(O-e.SIDE)*T,p[1]+(O-e.SIDE)*H,p[2]],[p[0]+O*T,p[1]+O*H,p[2]],z,1,.6*I,!1,3)}if(ho(g)===3)for(let T=0;T<b*e.SIDE/co;T++){const H=(T+.5)*co/(b*e.SIDE),q=[P(M[0],L[0],H),P(M[1],L[1],H),M[2]+Be];D(q,[q[0]+1,q[1],q[2]],z,0,xa*I,!0,4)}}}D([p[0],p[1],p[2]+.3],[p[0]+1,p[1],p[2]+.3],0,0,0,!0,2);const k=new _.BufferGeometry;return k.setAttribute("position",new _.Float32BufferAttribute(c,3)),k.setAttribute("aP0",new _.Float32BufferAttribute(oe,3)),k.setAttribute("aP1",new _.Float32BufferAttribute(W,3)),k.setAttribute("aInfo",new _.Float32BufferAttribute(X,4)),k.setIndex(v),k}const uo=[6,1],za=[8,4.5],po=6,Da=1.8,ka=.05,mo=[1.6,3];async function Na(c,oe){const W=e.SPARK,X=.6180339887,v=(p,D,k)=>{const[g,z,O]=p,E=z[0]-g[0],A=z[1]-g[1],I=z[2]-g[2],R=O[0]-g[0],M=O[1]-g[1],L=O[2]-g[2];let b=[A*L-I*M,I*R-E*L,E*M-A*R];const T=Math.hypot(b[0],b[1],b[2])||1;b=b.map(H=>H/T*(b[2]>0?-1:1)),c.face(p,b,D,[],k,mo[0],mo[1])};for(let p=1;p<=e.ROSE_RINGS;p++){const D=e.roseRing(p),k=D.z+ka,g=ho(p),z=p*X%1;for(let O=0;O<6&&g===1;O++){const[E,A]=D.corners[O],I=Math.atan2(A-W[1],E-W[0]),R=uo[0]+uo[1]*(p-2),M=(L,b,T)=>[E+L*Math.cos(I+b*Math.PI/3),A+L*Math.sin(I+b*Math.PI/3),k+T];v([0,1,2,3,4,5].map(L=>M(.5*R,L,0)),[0,0,0,0,0,0],z);for(let L=0;L<6;L++)v([M(.5*R,L,0),M(R,L,.3*R),M(R,L+1,.3*R),M(.5*R,L+1,0)],[0,1,1,0],z)}for(let O=0;O<6&&g===2;O++){const E=D.corners[O],A=D.corners[(O+1)%6],I=Math.hypot(A[0]-E[0],A[1]-E[1]),R=(A[0]-E[0])/I,M=(A[1]-E[1])/I,L=(E[0]+A[0])/2-W[0],b=(E[1]+A[1])/2-W[1],T=-M*L+R*b>0?1:-1,H=-M*T,q=R*T;for(let ce=0;ce<I/po;ce++){const fe=(ce+.5)*po/I,de=P(E[0],A[0],fe)+H*.6,ue=P(E[1],A[1],fe)+q*.6,Y=za[ce&1],J=Da/2,We=[de-R*J,ue-M*J,k],N=[de+R*J,ue+M*J,k],K=[de+H*Y,ue+q*Y,k],ye=[de,ue,k+.6*J];v([We,ye,K],[0,0,1],z),v([ye,N,K],[0,0,1],z)}}await oe.yield()}}var Ba={id:"where-the-lattice-grows",name:"Where the Lattice Grows",category:"bizarre",media:["space"],weirdness:.5,async build(c){const{core:oe}=c,W=c.vary||{},X=c.quality?.detail??1,v=new _.Scene;v.background=new _.Color(0,0,0);const p=t=>oe.makeRng(oe.hashSeed("where-the-lattice-grows:"+t+":"+c.seed)),D=p("cold"),k=p("shape"),g=e.snowFork(c.seed),z=Math.round(34*j(W.density??1,.7,1.3)*X),O=[];for(let t=0;t<z;t++)O.push(p("small-fern-"+t));const E=p("free"),A=p("fault"),I=p("glow"),R=p("red"),M=p("waves"),L=p("frost-air"),b=p("flakes"),T=p("deep"),H=p("plate"),q=p("frost-glow"),ce=p("lesser-plates"),fe=p("net-rest"),de=D.pick(["frost","frost","blue","snow"]),ue=k.pick(["mixed","mixed","broad","needles"]),Y=P(.75,1.35,j(((W.density??1)-.7)/.6,0,1)),J=P(14,6,j(W.mood??.5,0,1)),We=lo[W.hour]||lo.any,N=e.makeShared(va[de]);N.uWavePh.value.set(M()*6.2832,M()*6.2832,M()*6.2832);const K=e.makeMaterials(N),ye=N.uCold.value,Ke={transparent:!0,depthWrite:!1,depthTest:!0,blending:_.AdditiveBlending,side:_.DoubleSide};await c.yield();const u=await e.primeRouteLine(c),we=u.path,pe=t=>({value:new _.Vector3(t[0],t[1],t[2])}),yo={...N,uAmber:pe(We),uLift:{value:aa},uBlue:pe(la),uViolet:pe(ha),uTeal:pe(ca),uRose:pe(fa),uDrift:pe([T()*40,T()*40,T()*40]),uBreath:{value:new _.Vector4(I()*6.28,I()*6.28,I()*6.28,I()*6.28)}},He=new _.Mesh(new _.BoxGeometry(2,2,2),new _.ShaderMaterial({...Ke,uniforms:yo,vertexShader:_a,fragmentShader:ba}));He.renderOrder=-1,He.frustumCulled=!1,v.add(He);const $e=new _.Mesh(Pa(),new _.ShaderMaterial({...Ke,uniforms:{...N,uRoseWhite:{value:new _.Color(ga)}},vertexShader:Ia,fragmentShader:La}));$e.frustumCulled=!1,$e.renderOrder=2,v.add($e),await c.yield();{const t=e.facetBatch();await Na(t,c);const o=t.mesh(K.facet);o.name="rose ice",o.renderOrder=2,v.add(o)}await c.yield();const ae=await e.buildHero(c,{shared:N,materials:K,rng:g});v.add(ae.object);const wo=await e.buildFrostAir(c,L,N,Math.round(e.AIR_N*j(X,.5,1)));v.add(wo.mesh);const ct=await e.buildFrostGlow(c,q,N);ct.mesh.renderOrder=-.25,v.add(ct.mesh),await c.yield();const $=e.buildPlate(K.facetBody,H());v.userData.plate=$.spec,$.mesh.renderOrder=1,v.add($.mesh),await c.yield();const Ve=await e.lesserPlates(ce,c);await c.yield();const vo=Ve.map(t=>{const o=e.buildPlate(K.facetBody,t.phase,t,t.habit,t.turn);return o.mesh.renderOrder=1,o.mesh.name="lesser plate",v.add(o.mesh),o});v.userData.lesser=Ve.map(t=>[...t.at.map(o=>Math.round(o)),Math.round(2*t.R),+t.line.toFixed(1),+t.sight.toFixed(1)]),await c.yield();const je=e.companySpecs();await c.yield();const go=je.map(t=>{const o=e.buildPlate(K.facetBody,t.phase,t,t.habit,t.turn);return o.mesh.renderOrder=1,o.mesh.name="company",v.add(o.mesh),o});v.userData.company=je.map(t=>[...t.at.map(o=>Math.round(o)),Math.round(2*t.R),+t.line.toFixed(1)]);const ft=[...Ve,...je],ve=(t,o,a)=>ft.some(n=>Math.hypot(t-n.at[0],o-n.at[1],a-n.at[2])<n.R+e.LESSER_NET);await c.yield(),await e.primeFarWall(c);const dt=e.buildMist(N);dt.mesh.renderOrder=-.25,v.add(dt.mesh),await c.yield();const ut=[fe.range(0,3e3),fe.range(0,3e3),fe.range(0,3e3)],pt=(t,o=t.k)=>!e.netStands(t.c,t.j,o,t.x,t.y,t.z,ut),So=1.5,mt=8,Ue=[0,1,2].map(t=>$.at[t]-$.axis.getComponent(t)*$.R),xo=(t,o,a)=>Math.hypot(t-Ue[0],o-Ue[1],a-Ue[2])<So*$.R,yt=t=>xo(t.x,t.y,t.z)&&e.siteHash(t.c,t.j,t.k,511)<.5,qe=(t,o,a,n=mt)=>e.plateClear(t,o,a)<n,Ye=(t,o,a)=>e.snowClear(ae.figure,t,o,a)<e.SNOW_CLEAR,wt=9,vt=6.5,Re=14,Eo=(()=>{const t=new _.Color("#E0452B");return[t.r*2.2,t.g*2.2,t.b*2.2]})(),Ao=77+R.int(0,900),Ro=!!W.rare,gt=[...e.K_BEHIND];for(let t=e.K_FIRST;t<=e.K_LAST;t++)gt.push(t);const Me=e.lampBatch(!1),St=e.threadBatch(!1),ne=e.lampBatch(!0),se=e.threadBatch(!0),Fe=[],ge=(t,o,a,n)=>!e.offRouteBox(t,o,a,n)&&e.pointClear(t,o,a,n)<n,ie=90,V=[1e9,-1e9,1e9,-1e9,1e9,-1e9],_e={ferns:0,threads:0};let Z=0;for(;Z<u.n-1&&e.hollowDepth(u.fine[Z*3],u.fine[Z*3+1],u.fine[Z*3+2])>0;)Z++;for(let t=0;t<=Z;t+=4)for(let o=0;o<3;o++){const a=u.fine[t*3+o];V[o*2]=Math.min(V[o*2],a),V[o*2+1]=Math.max(V[o*2+1],a)}const be=(t,o,a,n=ie)=>{if(t<V[0]-n||t>V[1]+n||o<V[2]-n||o>V[3]+n||a<V[4]-n||a>V[5]+n)return n;let h=n*n;for(let i=0;i<=Z;i+=4){const s=u.fine[i*3]-t,r=u.fine[i*3+1]-o,f=u.fine[i*3+2]-a,m=s*s+r*r+f*f;m<h&&(h=m)}return Math.sqrt(h)},me=t=>be(t.x,t.y,t.z)<ie;await c.yield();const xt=(t,o,a)=>ge(t,o,a,wt),Ze=e.threadColourOf(0);for(const t of gt){const o=e.latticeSites(t),a=new Map,n=t>=e.K_FAULT-3&&t<e.K_FAULT;for(const i of o)i.state===e.RIND_LIVE||xt(i.x,i.y,i.z)||yt(i)||ve(i.x,i.y,i.z)||pt(i,t)||(i.thin=e.netThin(i.x,i.y,i.depth),e.netThinStands(i.c,i.j,t,i.thin)&&(i.edge=e.netEdge(i.c,i.j,t,i.x,i.y,i.z,i.depth),i.edge>0&&a.set(e.siteKey(i.c,i.j,t),i)));let h=null;for(let i=0;i<o.length;i++){const s=o[i];if(i%20===19&&await c.yield(),!a.has(e.siteKey(s.c,s.j,t))||t===e.K_FAULT&&Math.hypot(s.x,s.y)<e.SIDE+1)continue;const r=!h||h.j!==s.j||s.c!==h.c+2,f=r?s.x<e.BOUNDS.x0+30:h.faulty;r&&(h={j:s.j,y:s.y,z:s.z,x0:s.x,x1:s.x,last:-1,faulty:f},f&&t>=e.K_FIRST&&Fe.push(h)),h.c=s.c;const m=Ro&&s.state===e.FINISHED&&s.depth<144&&e.siteHash(s.c,s.j,t,Ao)<1/30&&Math.hypot(s.x,s.y)>60&&Math.atan2(Math.hypot(s.x,s.y),s.z)>24*Math.PI/180;h.last=Me.count,h.x1=s.x;const y=e.lampSize(s.c,s.j,t),d=P(Math.min(y,1)*e.NET_SMALL,y,s.thin),l=d>1?e.LAMP_GREAT_LIGHT:1;if(Me.add(s.x,s.y,s.z,r&&f?1:0,m?Eo:e.netThinColour(e.lampColourOf(s.depth),e.PALE,e.NET_FROST,s.thin).map(S=>S*s.edge*l),s.state===e.FINISHED?1:U(22,48,s.depth),null,null,e.lampAux(s.x,s.y,s.z,d)),!(t<e.K_FIRST||!ge(s.x,s.y,s.z,240)))for(let S=0;S<3;S++){const x=s.c+e.STEPS[S][0],F=s.j+e.STEPS[S][1],w=a.get(e.siteKey(x,F,t));if(!w)continue;const B=[s.x,s.y,s.z],G=[w.x,w.y,w.z];if(e.lineClear(B[0],B[1],B[2],G[0],G[1],G[2],32)<vt)continue;const he=S===0&&h.faulty&&!a.has(e.siteKey(x+2,F,t)),C=e.threadNear(B,G),Ae=n?1-U(24,30,e.lineClear(B[0],B[1],B[2],G[0],G[1],G[2],32)):0,lt=C.light*(1+Ae),ht=e.netThinColour(e.threadColourOf((s.depth+w.depth)/2),e.THREAD_PALE,e.NET_FROST_THREAD,Math.min(s.thin,w.thin));St.add(B,G,he?1:0,C.width,[P(ht[0],Ze[0],Ae)*lt,P(ht[1],Ze[1],Ae)*lt,P(ht[2],Ze[2],Ae)*lt],null,null,0,[0,C.vane,.5*Ae,C.near])}}if(await c.yield(),t>=e.K_FIRST){const i=r=>!xt(r.x,r.y,r.z)&&!Ye(r.x,r.y,r.z)&&!yt(r)&&!ve(r.x,r.y,r.z)&&!pt(r,t),s=e.rindSet(t,Y,()=>!0,()=>!0,o);await c.yield(),s.sites=s.sites.filter(i),s.threads=s.threads.filter(([r,f])=>i(r)&&i(f)&&ge(r.x,r.y,r.z,300)&&e.lineClear(r.x,r.y,r.z,f.x,f.y,f.z,32)>=(r.clock[0]>0||f.clock[0]>0?Re:vt));{const r=s.threads.length;s.threads=s.threads.filter(([f,m])=>!me(f)&&!me(m)),_e.threads+=r-s.threads.length}await c.yield(),e.addGrowth(ne,se,s,ye),await c.yield()}}const Se=260,Mo=.5,Fo=60,Et=new Set;for(let t=0,o=null,a=0;t<u.n;t++){const n=Math.floor(u.fine[t*3+2]/e.GAP);n!==o?(o=n,a=t):(t-a)*.25>Fo&&Et.add(n)}const At=[[12,e.ROW/3,1/3],[12,-e.ROW/3,2/3]],_o=[...At,[12,-e.ROW/3,1/6],[0,0,1/2],[12,e.ROW/3,5/6]];for(let t=e.K_FIRST;t<e.K_LAST;t++){const o=Math.ceil(e.BOUNDS.y0/e.ROW-1),a=Math.floor(e.BOUNDS.y1/e.ROW+1);for(let n=o;n<=a;n++){const h=e.rowY(n,t);let i=Math.ceil(e.BOUNDS.x0/12);(i&1)!==(n&1)&&i++;for(let s=0;12*i<=e.BOUNDS.x1;i+=2,s++){s%12===11&&await c.yield();for(const[r,f,m]of Et.has(t)?_o:At){const y=12*i+r,d=h+f,l=e.GAP*(t+m);if(e.offRouteBox(y,d,l,Se))continue;const S=e.pointClear(y,d,l,Se);if(S>=Se||S<wt)continue;const x=e.hollowDepth(y,d,l);if(x<26||e.gateDist(y,d,l)<e.SIDE||ve(y,d,l))continue;const F=Math.hypot(y,d)<e.RANK_CORE?0:e.netBay(y,d,l);if(x<=F||!e.netStands(i,n,t,y,d,l,ut))continue;const w=e.netThin(y,d,x);if(!e.netThinStands(i,n,t+100,w))continue;const B=e.netThinColour(e.lampColourOf(x),e.PALE,e.NET_FROST,w),G=.6*(1-U(.6*Se,Se,S))*(F>0?U(0,e.EDGE_SOFT,x-F):1);Me.add(y,d,l,0,[B[0]*G,B[1]*G,B[2]*G],.5,null,null,[Mo*P(e.NET_SMALL,1,w),.5,0,0,0])}}await c.yield()}}const Rt=await Me.meshInSteps(c,K.lamp),bo=Rt.geometry.getAttribute("aSite");for(const t of Fe)t.last>=0&&bo.setW(t.last,2);v.add(Rt),await c.yield();const Io=await St.meshInSteps(c,K.thread);v.add(Io),await c.yield();const Lo=70,Oo=24,re=[],Ie=(t,o,a)=>e.stateAt(t,o,a)===e.BEYOND&&!ge(t,o,a,Oo)&&!Ye(t,o,a)&&!e.byGate(t,o,a)&&!qe(t,o,a)&&!ve(t,o,a);{const t=[];let o=e.hollowDepth(u.fine[0],u.fine[1],u.fine[2])>0;for(let a=4;a<u.n;a+=4){const n=u.fine[a*3],h=u.fine[a*3+1],i=u.fine[a*3+2],s=e.hollowDepth(n,h,i)>0;s!==o&&t.push([n,h,i]),o=s}await c.yield();for(let a=e.K_FIRST;a<e.K_FAULT;a++)for(const n of t){if(Math.abs(e.GAP*a-n[2])>Lo)continue;const h=e.SNOW_AT[2]-n[2],i=e.GAP*a-n[2],s=i*h>0&&Math.abs(i)<Math.abs(h);for(let r=-2;r<=2;r++){if(s&&Math.abs(r)<2)continue;const f=Math.round(n[1]/e.ROW-(e.isB(a)?0:2/3))+r,m=e.rowY(f,a),y=e.GAP*a;let d=1+(f&1?0:1),l=null;for(;12*d<200&&e.stateAt(12*d,m,y)!==e.BEYOND;d+=2)l=d;if(l===null||12*d>=200)continue;const S=w=>e.siteHash(l,f,a,410+w),x=e.wallFern([12*l,m,y],[0,0,1,5][Math.floor(4*S(0))],3+Math.floor(5*S(1)),[(20+20*S(2))/Y,S(3)],Ie);if(x.sites.length<3)continue;const F=x.sites[x.root[0]];if(!(e.lineClear(F.x,F.y,F.z,x.root[1][0],x.root[1][1],x.root[1][2],32)<Re)){if(x.sites.some(me)){_e.ferns++;continue}e.addSnow(ne,se,x,!0);for(const w of x.sites)re.push(w)}}await c.yield()}}const Xe=[25,45],Mt=ie+Xe[1],To=6,Je=[];{const t=new Map,o=(a,n)=>{const h=a*16+n;return t.has(h)||t.set(h,e.wallFern([0,0,0],a,n,null,()=>!0).sites.length),t.get(h)};for(let a=e.K_FIRST;a<e.K_FAULT&&Je.length<To;a++){const n=e.GAP*a;if(n<V[4]-ie||n>V[5]+ie)continue;let h=null;for(let i=-3;i<=3;i++){const s=Math.round(-(e.isB(a)?0:.6666666666666666))+i,r=e.rowY(s,a);let f=1+(s&1?0:1),m=null;for(;12*f<200&&e.stateAt(12*f,r,n)!==e.BEYOND;f+=2)m=f;if(!(m===null||12*f>=200||be(12*m,r,n,Mt+1)>Mt)){for(const y of[0,1,5])for(let d=7;d>=4;d--){const l=w=>e.siteHash(m,s,a,430+7*y+w),S=e.wallFern([12*m,r,n],y,d,[(20+20*l(1))/Y,l(2)],Ie);if(S.sites.length<o(y,d)||S.sites.some(me))continue;let x=null;for(const w of S.sites)w.rank===0&&(x=w);const F=Math.hypot(x.x-12*m,x.y-r);if(!(F<Xe[0]||F>Xe[1])){(!h||l(0)>h.score)&&(h={score:l(0),fig:S,long:F,at:[12*m,r,n],d:y,tip:x});break}}await c.yield()}}if(h){e.addSnow(ne,se,h.fig,"great");for(const i of h.fig.sites)re.push(i);Je.push([h.at[0],Math.round(h.at[1]),h.at[2],h.d,Math.round(h.long),Math.round(be(h.at[0],h.at[1],h.at[2],99)),Math.round(e.pointClear(h.tip.x,h.tip.y,h.tip.z,99))])}}}const Po=6,zo=.5,Qe=[7,10],Do=14,ko=7,No=3,et=[];{const t=new Map,o=n=>(t.has(n)||t.set(n,e.wallFern([0,0,0],3,n,null,()=>!0).sites.length),t.get(n));let a=-99;for(let n=e.K_FIRST;n<e.K_FAULT&&et.length<Po;n++){const h=x=>e.siteHash(0,0,n,610+x),i=e.GAP*n;if(h(0)>zo||i<e.FAR_Z[0]+40||i>e.FAR_Z[1]-40||n-a<No)continue;const s=Math.round(-(e.isB(n)?0:2/3))+Math.floor(5*h(1))-2,r=e.rowY(s,n),f=e.farWall().farX(i)+ko;let m=f-e.SNOW.pitch,y=0;for(;y<4&&!Ie(m-e.SNOW.pitch,r,i);)m-=e.SNOW.pitch,y++;if(y>=4)continue;const d=Qe[0]+Math.floor((Qe[1]-Qe[0]+.999)*h(2)),l=e.wallFern([m,r,i],3,d,[(20+20*h(3))/Y,h(4)],Ie);if(await c.yield(),l.sites.length<o(d)||!l.root||l.sites.some(me))continue;l.root=[l.root[0],[f+Do,r,i]],e.addSnow(ne,se,l,"great");for(const x of l.sites)re.push(x);let S=null;for(const x of l.sites)x.rank===0&&(S=x);a=n,et.push([Math.round(m),Math.round(r),i,d,Math.round(e.pointClear(S.x,S.y,S.z,199))])}}v.userData.iceFerns=et,v.userData.wayIn={metres:Z*.25,great:Je,cut:_e};const Co=(t,o,a)=>{for(const n of re)if(Math.abs(n.z-a)<1&&Math.hypot(n.x-t,n.y-o)<14)return!0;return!1},Ft=new Set,Q=e.HOLLOW,Le=t=>e.hollowHigh(e.GAP*t),_t=t=>e.hollowDeep(e.GAP*t),Oe=(t,o)=>Math.round(t/e.ROW-(e.isB(o)?0:2/3)),Te=(t,o)=>{let a=Math.round(t/12);return(a^o)&1&&a++,[a,o]},tt=[];for(let t=e.K_FIRST;t<=e.K_LAST;t++)Le(t)>=2*e.SIDE&&tt.push(t);const bt=[5,9],It=[4,12],Lt=[6,8],Bo=16,Ot=10,Go=4,Tt=20,Pe=[],Pt=e.iceBatch();{const t=[],o=ae.center;for(let i=0;i<u.n;i+=8){const s=u.fine[i*3],r=u.fine[i*3+1],f=u.fine[i*3+2];e.hollowDepth(s,r,f)<=0&&t.push([o.x-s,o.y-r,o.z-f,s,r,f])}await c.yield();const a=(i,s,r)=>{let f=1e9;for(const[m,y,d,l,S,x]of t){const F=j(((i-l)*m+(s-S)*y+(r-x)*d)/(m*m+y*y+d*d),0,1),w=Math.hypot(l+m*F-i,S+y*F-s,x+d*F-r);w<f&&(f=w)}return f},n=b.int(bt[0],bt[1]),h=new Set([e.SNOW.k]);for(let i=0;i<80*n&&Pe.length<n;i++){const s=b.pick(tt),r=b.range(It[0],It[1]),f=b.int(Lt[0],Lt[1]),m=b(),y=b(),d=r/2;if(i%6===5&&await c.yield(),h.has(s))continue;const l=e.GAP*s,[S,x]=Te(Q.x+P(.08,.92,m)*_t(s),Oe(P(-.85,.85,y)*Le(s),s)),F=12*S,w=e.rowY(x,s);if(e.hollowDepth(F,w,l)>-(Bo+d)||e.pointClear(F,w,l,Ot+d+4)<Ot+d||e.snowClear(ae.figure,F,w,l,e.SNOW_CLEAR+d+1)<e.SNOW_CLEAR+d||e.byGate(F,w,l)||re.some(C=>Math.abs(C.z-l)<1&&Math.hypot(C.x-F,C.y-w)<14+d)||qe(F,w,l,mt+d)||ft.some(C=>Math.hypot(F-C.at[0],w-C.at[1],l-C.at[2])<C.R+e.LESSER_NET+d)||be(F,w,l,ie+d+1)<ie+d||e.roseClear(F,w,l,Tt+d+1)<Tt+d)continue;const B=a(F,w,l);if(B<Go+d)continue;const G=d/f/e.SNOW.pitch,he=e.snowFigure(null,{at:[F,w,l],pitch:d/f,arm:f,salt:Pe.length+1});e.addSnow(ne,se,he,!1,G),e.addIce(Pt,he,G),re.push(he.sites[0]);for(const C of he.spines)re.push(he.sites[C[C.length-1]]);h.add(s),Pe.push([F,Math.round(w),l,Math.round(r*10)/10,f,Math.round(e.pointClear(F,w,l,99)),Math.round(B)])}}v.userData.flakes=Pe;const zt=Pt.mesh(K.ice);zt.name="flake ice",v.add(zt),await c.yield();const Dt=[];for(let t=0;t<z;t++){const o=O[t],a=o.int(0,3),n=o.pick(tt),h=o.range(20,50),i=o.chance(.5)?ue:"sprig",s=o.chance(.5),r=o.chance(.5),f=a<2?o.range(-.8,.8)*Le(n):Q.x+o.range(.15,.75)*_t(n),m=a===0?{root:Te(36,Oe(f,n)),a:0}:a===1?{root:Te(e.BOUNDS.x1,Oe(f,n)),a:3}:{root:Te(f,Oe((s?1:-1)*(Le(n)+2*e.ROW),n)),a:s?r?4:5:r?1:2},y=e.fernFigure({k0:n,half:0,...m,ribbon:!1,len:h,shape:i,period:[20,40],rate:Y},o);if(t%4===3&&await c.yield(),!y.sites.length||y.sites.some(l=>e.byGate(l.x,l.y,l.z)||Ye(l.x,l.y,l.z)||ge(l.x,l.y,l.z,Re)||qe(l.x,l.y,l.z)||ve(l.x,l.y,l.z)||Co(l.x,l.y,l.z)||Ft.has(e.siteKey(l.c,l.j,l.k))))continue;const d=e.fernSet(y,Y);if(!d.threads.some(([l,S])=>e.lineClear(l.x,l.y,l.z,S.x,S.y,S.z,32)<Re)){if(y.sites.some(me)){_e.ferns++;continue}for(const l of y.sites)Ft.add(e.siteKey(l.c,l.j,l.k));e.addGrowth(ne,se,d,ye),Dt.push([a,e.GAP*n,Math.round(h)])}}v.userData.smallFerns=Dt,v.add(ne.mesh(K.lampGrowth)),await c.yield(),v.add(se.mesh(K.threadGrowth)),await c.yield();const ze=Math.round(1400*j(W.density??1,.7,1.3)*X),Wo=Q.z-Q.az+5;{const t=new _.InstancedBufferGeometry,o=new Float32Array(ze*4),a=new Float32Array(ze*2);t.setAttribute("position",new _.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),t.setIndex([0,1,2,0,2,3]);for(let r=0;r<ze;r++)o[r*4]=E(),o[r*4+1]=E.range(-Q.ay+5,Q.ay-5),o[r*4+2]=E.range(Wo,Q.z+Q.az-5),o[r*4+3]=E.range(2,5),a[r*2]=E()*6.2832,a[r*2+1]=E()*6.2832;t.setAttribute("aSeed",new _.InstancedBufferAttribute(o,4)),t.setAttribute("aPh",new _.InstancedBufferAttribute(a,2)),t.instanceCount=ze;let n=0,h=0;for(let r=0;r<u.n;r++)u.fine[r*3]>=50&&(n||(n=r),h=r);const i=[];for(let r=0;r<Ge;r++){const f=Math.round(P(n,h,r/(Ge-1)));i.push(new _.Vector3(u.fine[f*3],u.fine[f*3+1],u.fine[f*3+2]))}const s=new _.Mesh(t,new _.ShaderMaterial({...Ke,uniforms:{...N,uRoute:{value:i}},vertexShader:Oa,fragmentShader:Ta}));s.frustumCulled=!1,v.add(s)}await c.yield();const kt=[],Nt=[];for(let t=0;t<Fe.length;t++){const o=Fe[t],a=Math.round(o.z/e.GAP);if(t%50===49&&await c.yield(),o.last<0||e.byGate(j(0,o.x0,o.x1),o.y,o.z))continue;let n=1/0;for(let h=0;h<u.n;h+=16){const i=Math.max(0,u.fine[h*3]-o.x1),s=u.fine[h*3+1]-o.y,r=u.fine[h*3+2]-o.z;n=Math.min(n,i*i+s*s+r*r)}n>=400&&n<=48400&&kt.push(o),n>=400&&n<=8100&&o.x1<e.BOUNDS.x1-30&&Nt.push(o)}const Ko=t=>(t.x1-t.x0+20)/120+150/90+.35,Ct=t=>t.reduce((o,a)=>Math.max(o,Ko(a)),0),Bt=kt,Gt=Nt,Wt=Math.max(J,Ct(Bt)),Kt=Math.max(J*.61,Ct(Gt)),Ht=A.int(0,1e5),Ho=A()*Wt,$o=A()*Kt;await c.yield();const $t=62,le=we.length,xe=t=>{for(let o=0;o<u.n;o++)if(t(u.fine[o*3],u.fine[o*3+1],u.fine[o*3+2],o))return o*.25;return le},Vo=60,jo=(t,o,a,n)=>({at:t,from:o/le,to:a/le,weight:n,fade:Math.min(.5,Vo/Math.max(1,a-o))}),Uo=30,Vt=1/Math.sin($t/2*Math.PI/180),qo=50,Yo=.75,ee=ae.center.clone(),jt=new _.Vector3(e.SPARK[0],e.SPARK[1],e.SPARK[2]),Ee=new _.Vector3($.at[0],$.at[1],$.at[2]),Ut=new _.Vector3,De=new _.Vector3,qt=new _.Vector3,Yt=(t,o)=>xe((a,n,h)=>Math.hypot(t.x-a,t.y-n,t.z-h)<Vt*o),Zt=Math.max(...ae.figure.sites.map(t=>Math.hypot(t.x-ee.x,t.y-ee.y,t.z-ee.z))),ot=Yt(Ee,$.R),Xt=Yt(ee,Zt),Jt=u.fine[Math.round(Xt*4)*3+2],Qt=xe((t,o,a)=>a>e.PASS_Z-2&&t<e.TURN_R),Zo=(t,o)=>{const a=Math.min(u.n-1,t+8),n=Math.atan2(o.x-u.fine[t*3],o.z-u.fine[t*3+2])-Math.atan2(u.fine[a*3]-u.fine[t*3],u.fine[a*3+2]-u.fine[t*3+2]);return Math.abs(Math.atan2(Math.sin(n),Math.cos(n)))*180/Math.PI};let ke=0,at=1/0;for(let t=0;t<u.n;t+=4){const o=Math.hypot(Ee.x-u.fine[t*3],Ee.y-u.fine[t*3+1],Ee.z-u.fine[t*3+2]);o<at&&(at=o,ke=t)}let Ne=ke;for(;Ne<u.n-9&&Zo(Ne,jt)>1;)Ne++;const eo=Ne*.25;await c.yield();const Xo=(t,o)=>(qt.set(Math.min(t.x-Uo,ee.x),ee.y,ee.z),De.copy(ee).lerp(qt,U(Jt,e.PASS_Z,t.z)),De.lerpVectors(Ee,De,U(ot,ot+qo,o)),De.lerp(jt,U(eo,Qt,o))),Jo=(t,o)=>{const a=j(o,0,1)*le;return we.posAtDist(a,Ut),Xo(Ut,a)},te=xe((t,o,a)=>a>=e.RANK_OUT),to=xe((t,o,a,n)=>n*.25>te&&a>e.PASS_Z&&Math.hypot(t,o)<e.SIDE*Math.sqrt(3)/6);v.userData.look={lookFrom:te,plateFit:ot,snowFit:Xt,snowFitZ:Jt,snowReach:Zt,fit:Vt,platePass:ke*.25,passD:at,roseFrom:eo,turnFrom:Qt,lookTo:to};const Qo=[jo(Jo,te,to,Yo)];await c.yield();const nt=new Float32Array(129),oo=new _.Vector3,ao=new _.Vector3;for(let t=0;t<=128;t++){const o=le*t/128;let a=0;for(let n=-3;n<=3;n++){const h=j(o+n*4,6,le-6);we.tangentAtDist(h-6,oo),we.tangentAtDist(h+6,ao),a+=oo.angleTo(ao)/12}nt[t]=1-.15*j(a/7*44,0,1),t%32===31&&await c.yield()}const no=1.7,ea=30,st=.78,so=60,it=Z*.25,rt=xe((t,o,a,n)=>n*.25>ke*.25&&a>e.PASS_Z-e.GAP&&e.hollowDepth(t,o,a)>0),ta=t=>t<te?P(no,1,U(te-ea,te,t)):t<it?P(1,st,U(te,it,t)):P(st,1,U(rt,rt+so,t));v.userData.pace={rankOut:te,mouth:it,passEnd:rt,ramp:so,rank:no,crystals:st};const oa=t=>{const o=j(t,0,1)*128,a=Math.min(127,Math.floor(o));return P(nt[a],nt[a+1],o-a)*ta(j(t,0,1)*le)};await c.yield();const io=(t,o)=>e.siteHash(t&1023,t>>10&1023,0,o),ro=(t,o,a,n,h,i)=>{if(!o.length)return;const s=Math.floor(n/a),r=o[Math.min(o.length-1,Math.floor(io(s,h)*o.length))],f=io(s+7919,h)<.5?1:-1,m=N.uFaultX.value;t.value.set(r.z,r.y,(f>0?r.x0-10:r.x1+10)+f*120*(n-s*a),f),i?(m.z=r.x0,m.w=r.x1):(m.x=r.x0,m.y=r.x1)};return{scene:v,path:we,duration:38,style:"none",camera:{fov:$t,near:.3,far:1500,lookAhead:20},portal:{shape:"circle",radius:5,style:"ring",color:"#FFF1C8",veil:"#F0D9A0",glow:1,halo:!0,revealDistance:60,blendDistance:25},post:{exposure:1.25,bloom:{strength:.55,radius:.7,threshold:.85},grade:{saturation:1.08,contrast:1,vignette:.35,grain:.02}},pois:Qo,pace:oa,update(t,o,a){N.uTime.value=o,ro(N.uFault,Bt,Wt,o+Ho,Ht,0),ro(N.uFaultB,Gt,Kt,o+$o,Ht+31,1),ae.update(t,o,a),$.update(o);for(const n of vo)n.update(o);for(const n of go)n.update(o)}}}};export{Ba as default};
