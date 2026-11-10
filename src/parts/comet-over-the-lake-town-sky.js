import*as t from"three";const r=Math.PI/180,se=(d,T)=>new t.Vector3(Math.sin(d*r)*Math.cos(T*r),Math.sin(T*r),-Math.cos(d*r)*Math.cos(T*r)),de=`
uniform vec3 uSunH, uZen, uMidB, uHorB, uGreen, uGold, uOrange, uSlate, uPink;
uniform float uStarGain, uSkyTime;
vec3 twSky(vec3 d) {
  float h = d.y, hh = max(h, 0.0), e = hh*57.3;                 // e: degrees up (near enough under 40)
  vec2 f = d.xz/max(length(d.xz), 1e-4);
  float ca = dot(f, uSunH.xz);
  float w = smoothstep(-0.35, 1.0, ca); w *= w;                  // toward the set sun
  float anti = 1.0 - smoothstep(-0.8, 0.15, ca);                       // away from it: the earth's own shadow rising
  vec3 c = mix(uMidB, uZen, 1.0 - exp(-hh*2.6));
  c = mix(c, uHorB, exp(-e/7.0)*0.8);
  float es = max(e - 6.5*w, 0.0);                                // the glow stands over the crater's rim, not under it
  c = mix(c, uGreen, exp(-es/19.0)*w*0.9);                       // green-blue over the gold
  c = mix(c, uGold, exp(-es/8.5)*w*0.97);                        // pale gold over the orange
  c = mix(c, uOrange, exp(-es/3.6)*w*w);                         // orange on the horizon itself
  float pe = (e - 8.0)/4.5;
  c = mix(c, uPink, exp(-pe*pe)*anti*0.62);                      // the pink band
  c = mix(c, uSlate, exp(-e/3.4)*anti*0.9);                      // over the slate-blue shadow band
  return c*mix(1.0, 0.6, 1.0 - smoothstep(-0.25, 0.0, h));
}
float twH13(vec3 p) { p = fract(p*0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y)*p.z); }
// the first stars: px is the pixel's footprint in radians, so a star is never thinner than a pixel and never shimmers
float twStars(vec3 d, float px) {
  vec3 p = d*64.0, id = floor(p);
  float hs = twH13(id);
  vec3 j = vec3(twH13(id + 7.1), twH13(id + 13.7), twH13(id + 29.3)) - 0.5;
  vec3 v = p - (id + 0.5 + j*0.55);
  float r = max(0.085, px*64.0*1.25), k = 0.085/r;
  float on = step(0.9, hs), mag = (hs - 0.9)*10.0; mag = 0.25 + 0.75*mag*mag;
  float tw = 0.82 + 0.18*sin(uSkyTime*(0.9 + hs*2.0) + hs*90.0);
  float high = smoothstep(0.16, 0.62, d.y);
  return on*mag*tw*high*k*k*exp(-dot(v, v)/(r*r));
}`,fe=`
uniform vec3 uC0, uCR, uCU;
uniform vec4 uPiece[15];            // xy: place (degrees), z: brightness, w: a phase of its own
uniform vec4 uBead[3];              // xy: where it comes away, z: period, w: offset
uniform vec4 uMet[20];               // x: seconds it takes (also its period), y: offset, z: a number of its own
uniform vec2 uMetFrom[3];           // the lowest pieces, where the falling bits come away
uniform vec2 uTrainDir;             // along the train, toward its low end
uniform float uTime, uPieceN, uCometGain, uMetGain, uKink, uMetFloor, uMetCurve, uApart, uStorm, uMetN;
const vec2 AG = vec2(0.581, 0.814);  // the tails' way: up and to the right, away from the set sun
const vec2 AP = vec2(0.814, -0.581);
const vec2 AD = vec2(0.731, 0.682);  // each piece's own tail leans a little toward the dust fan
float cmH(float n) { n = fract(n*0.1031); n *= n + 33.33; n *= n + n; return fract(n); }
float cmN(float x) { float i = floor(x), f = fract(x); f = f*f*(3.0 - 2.0*f); return mix(cmH(i), cmH(i + 1.0), f); }
float cmSq(float x) { return x*x; }
vec3 cmTails(vec2 q, float px) {
  float s = dot(q, AG), t = dot(q, AP);
  // the gas: ONE thin straight thread of pale blue, the lesser of the two tails; it runs straight away from the set sun and stands a little apart
  // from the dust fan (which leans away from it), with a faint slow ripple travelling down it
  float sk = mod(uTime*0.45 + uKink, 38.0) - 4.0, ks = s - sk;
  float tg = t - 0.12*exp(-ks*ks/6.8)*sin(ks*1.25);
  float wg = 0.035 + 0.004*max(s, 0.0) + px*0.65;
  float g = exp(-tg*tg/(wg*wg));
  float fg = smoothstep(0.6, 3.6, s)*(1.0 - smoothstep(9.0, 30.0, s))*(0.7 + 0.3*cmN(s*0.8 - uTime*0.22));
  vec3 c = vec3(0.27, 0.53, 1.0)*g*fg*0.6;                             // a pale blue, plainly bluer than the cream fan at every size
  // the dust: a broad soft banded fan that rises from the WHOLE length of the train. It has no point of its own:
  // its lines run back to a place far behind the train, and it begins along the train's own line.
  vec2 nn = vec2(uTrainDir.y, -uTrainDir.x), AQ = vec2(AD.y, -AD.x);
  float e = dot(q, nn)/max(dot(AD, nn), 0.2);                        // how far along the dust's way, past the train's line
  float ep = max(e, 0.0);
  vec2 va = q + AD*11.0; float ra = length(va) + 1e-3;
  float ph = atan(dot(va, AQ), max(dot(va, AD), 1e-3))*57.3;
  float pc = 4.5 + 0.45*ep, dw = 10.5 + 0.3*ep, a = (ph - pc)/dw;       // (the fan's middle line leans away from the gas thread, so the thread stands clear of its edge)
  float prof = max(1.0 - a*a, 0.0); prof *= prof*(0.72 + 0.55*(1.0 - smoothstep(-0.85, 0.25, a)));
  float rad = smoothstep(0.1, 3.4, e)*(1.0 - smoothstep(3.0, 26.0, ep))*(0.42 + 0.58/(1.0 + ep*0.12));
  float u = ph*0.5 - ra*0.85, fu = px*(0.5*57.3/ra + 0.85);         // the bands' line, and a pixel's reach across them
  float st = 0.5*cmN(u*1.6) + 0.32*cmN(u*3.9 + 7.0)*(1.0 - smoothstep(0.2, 0.6, fu*3.9)) + 0.18*cmN(u*8.7 + 3.0)*(1.0 - smoothstep(0.2, 0.6, fu*8.7));
  float fs = px*57.3/ra;                                             // a pixel's reach across the fine streaks
  float streak = mix(0.56 + 0.88*cmN(ph*0.9 + 11.0), 1.0, smoothstep(0.3, 0.8, fs*0.9));
  float striae = mix(1.0, 0.5 + 1.05*st, smoothstep(1.0, 8.0, ep))*streak;
  c += vec3(1.0, 0.83, 0.55)*prof*rad*striae*0.98;
  return c;
}
vec3 cmTrain(vec2 q, float px) {
  vec2 hv = vec2(dot(q, uTrainDir)/(5.2 + 4.2*uApart), dot(q, vec2(uTrainDir.y, -uTrainDir.x))/(1.7 + 1.3*uApart)); float hd = dot(hv, hv);
  vec3 c = vec3(0.72, 0.85, 1.0)*(0.15*exp(-hd) + 0.05*exp(-hd*0.22));   // the head's own soft glow, round the whole train
  for (int i = 0; i < 15; i++) {
    vec4 P = uPiece[i];
    float b = P.z*step(float(i) + 0.5, uPieceN)*(0.7 + 0.3*sin(uTime*(0.9 + P.w*1.3) + P.w*40.0));
    vec2 v = q - (P.xy*(1.0 + 0.09*sin(uTime*0.45 + P.w*9.0) + 0.8*uApart) + vec2(uTrainDir.y, -uTrainDir.x)*(P.w - 0.5)*2.6*uApart);      // the pieces creep apart and back, breathing; by the beat they drift well apart
    float d2 = dot(v, v), s = dot(v, AD), t = dot(v, vec2(AD.y, -AD.x));
    float core = exp(-d2/(0.0009 + px*px*0.45));                     // a small hard star-point
    float glow = exp(-d2/(0.008 + 0.02*P.z + 0.07*uApart));          // a soft glow of its own, wider as the pieces part
    float w = 0.03 + 0.035*max(s, 0.0) + px*0.55;
    float tail = exp(-t*t/(w*w))*smoothstep(-0.04, 0.25, s)*exp(-max(s, 0.0)/(2.4 + 5.5*P.z));   // its own fine streak, feeding the fan
    c += b*(vec3(1.0, 0.97, 0.88)*core*(2.6 + 4.4*P.z*P.z) + vec3(0.8, 0.9, 1.0)*glow*(0.2*P.z + 0.28*uApart) + vec3(1.0, 0.93, 0.78)*tail*0.4);
  }
  for (int k = 0; k < 3; k++) {                                     // a bead comes away, flares softly, slides back, fades
    vec4 B = uBead[k];
    float a = fract((uTime + B.w)/B.z);
    vec2 v = q - (B.xy*(1.0 + 0.8*uApart) + uTrainDir*2.4*a + vec2(0.0, -0.1*a));
    float env = smoothstep(0.0, 0.1, a)*(1.0 - smoothstep(0.45, 1.0, a))*(0.5 + 0.9*exp(-cmSq((a - 0.13)/0.07)));
    c += vec3(1.0, 0.95, 0.84)*env*(1.6*exp(-dot(v, v)/(0.004 + px*px*0.8)) + 0.3*exp(-dot(v, v)/0.03));
  }
  return c;
}
vec3 cmMeteors(vec2 q, float px) {
  vec3 c = vec3(0.0);
  for (int k = 0; k < 20; k++) {
    vec4 M = uMet[k];
    float tt = (uTime + M.y)/M.x, n = floor(tt), a = (tt - n)*mix(2.3, 1.15, step(10.5, float(k)));   // the first eleven are out for under half their round (three to six at once); the nine the shower adds stay out longer. The rate is each meteor's own, never the shower's amount, so none slows or runs back as the shower comes on
    float h1 = cmH(n*7.31 + M.z*19.7), h2 = cmH(n*3.17 + M.z*5.3 + 1.7), h3 = cmH(n*1.93 + M.z*11.1 + 4.1), h4 = cmH(n*5.71 + M.z*3.3 + 9.2);
    vec2 from = mix(mix(uMetFrom[0], uMetFrom[1], step(0.34, h1)), uMetFrom[2], step(0.67, h1)) *0.2 + vec2(13.0 - 37.0*h2, 0.3 + 10.0*h4);   // scattered over a third of the sky
    from.y += uMetFloor + uMetCurve*from.x*from.x;                               // every one begins above THE ONE FLOOR (that elevation's line in this plane bows up to the sides)
    vec2 dir = from/max(length(from), 1.0), nd = vec2(dir.y, -dir.x);             // away from the radiant, the broken head: rising all its way, never down toward the rim
    float big = h3*h3;
    vec2 v = q - (from + dir*(4.0 + 11.0*big)*(0.8*a + 0.2*a*a));
    float env = smoothstep(0.04, 0.3, a)*(1.0 - smoothstep(0.9, 1.0, a));
    float b = (env + 0.85*exp(-cmSq((a - 0.9)/0.045)))*(0.22 + 1.0*h1*h1)*step(a, 1.2)*step(float(k) + 0.5, uMetN)*(1.0 + 0.5*uStorm);   // born faint, brightens, burns out with a soft swell
    float s = -dot(v, dir), t = dot(v, nd), d2 = dot(v, v);
    float L = (1.2 + 12.0*big)*(0.35 + 0.65*env), sc = clamp(s/L, 0.0, 1.0), w = 0.11*(1.0 - sc) + 0.025 + px*0.65;
    float trail = exp(-t*t/(w*w))*smoothstep(-0.12, 0.2, s)*cmSq(1.0 - sc);
    vec2 b1 = v + dir*L*0.3 - nd*0.05, b2 = v + dir*L*0.52 + nd*0.04, b3 = v + dir*L*0.74 - nd*0.02;
    float bw = 0.016 + px*px;
    float beads = 0.7*exp(-dot(b1, b1)/bw) + 0.5*exp(-dot(b2, b2)/bw) + 0.35*exp(-dot(b3, b3)/bw);
    vec3 col = mix(vec3(1.0, 0.86, 0.58), vec3(0.78, 1.0, 0.86), step(0.5, h2));   // pale gold or green-white, never red
    c += col*b*(1.8*exp(-d2/(0.012 + px*px)) + 0.26*exp(-d2/0.07) + 1.0*trail + 0.8*env*beads*big);
  }
  return c;
}
// the whole comet for a direction d (unit); pxd: the pixel's footprint in degrees
vec3 cometAt(vec3 d, float pxd) {
  float z = dot(d, uC0);
  if (z < 0.35) return vec3(0.0);
  vec2 q = vec2(dot(d, uCR), dot(d, uCU))/z*57.2958;
  float px = clamp(pxd, 0.0, 1.5);
  vec3 c = (cmTails(q, px) + cmTrain(q, px))*uCometGain + cmMeteors(q, px)*uMetGain;
  c *= smoothstep(-37.0, -29.0, q.x)*(1.0 - smoothstep(32.0, 48.0, q.x))*(1.0 - smoothstep(38.0, 48.0, q.y));   // nothing reaches the patch's edge
  return c*smoothstep(0.03, 0.14, d.y);
}`,we=`
uniform vec4 uRibA[56], uRibB[56];  // A: where it begins (degrees from the radiant), length, brightness; B: period, phase, rank, tone (+2: a slow bright one)
uniform vec2 uRibBox;               // the field's lowest height in the plane, and the square of its widest reach
vec3 cmStormAt(vec3 d, float pxd) {
  if (uStorm < 0.002) return vec3(0.0);
  float z = dot(d, uC0);
  if (z < 0.2) return vec3(0.0);
  vec2 q = vec2(dot(d, uCR), dot(d, uCU))/z*57.2958;
  if (q.y < uRibBox.x || dot(q, q) > uRibBox.y) return vec3(0.0);
  float px = clamp(pxd, 0.0, 1.5);
  vec3 c = vec3(0.0);
  for (int k = 0; k < 56; k++) {
    vec4 A = uRibA[k], B = uRibB[k];
    float a = fract((uTime + B.y)/B.x)*1.25, slow = step(1.5, B.w);
    vec2 dir = A.xy/max(length(A.xy), 1.0);
    float run = (4.0 + 1.6*A.z)*(1.0 - 0.4*slow)*(0.8*a + 0.2*a*a);
    vec2 v = q - (A.xy + dir*run);
    float dx = -dot(v, dir), t = dot(v, vec2(dir.y, -dir.x));                       // degrees behind the head, and off its line
    float env = smoothstep(0.03, 0.25, a)*(1.0 - smoothstep(0.86, 1.0, a));
    float L = A.z*(0.35 + 0.65*env), w = 0.07 + 0.08*A.w, wv = w + px*0.7, tv = t/wv;
    float ac = max(1.0 - tv*tv, 0.0); ac *= ac*w/wv;                                // a pixel wider than the ribbon holds it thinner, never brighter
    float tail = clamp(1.0 - dx/max(L, 0.05), 0.0, 1.0)*step(0.0, dx); tail *= tail;
    float headG = exp(-dx*dx/(0.02 + px*px));
    float tw = 0.3*w + px*0.7, train = slow*0.3*step(0.0, dx)*clamp(1.0 - dx/max(run, 0.3), 0.0, 1.0)*max(1.0 - abs(t)/tw, 0.0)*(0.3*w/tw);
    vec3 col = mix(vec3(1.0, 0.86, 0.58), vec3(0.78, 1.0, 0.86), step(0.5, B.w - 2.0*slow));
    c += col*(env*smoothstep(B.z*0.95, B.z*0.95 + 0.05, uStorm)*A.w)*(ac*(0.9*tail + 1.8*headG) + train);
  }
  return c*uMetGain*smoothstep(0.03, 0.14, d.y);
}`,ve={early:{zen:"#10265c",midB:"#33588f",horB:"#6382ac",green:"#86b8a8",gold:"#f2ca8a",orange:"#f28c42",slate:"#40507a",pink:"#cc8e98",stars:.55,comet:.92,met:1.5,lamps:1.1},deep:{zen:"#060f2e",midB:"#16326c",horB:"#2c4a80",green:"#46868e",gold:"#cfa066",orange:"#d86a2e",slate:"#243154",pink:"#86607a",stars:1.25,comet:1.3,met:1.75,lamps:1.1}},le=-18,ge=-9,ee=2,te=19;function pe(d,T){const l=Math.round(9+6*T),M=11*r,y=[-Math.cos(M),-Math.sin(M)],q=[y[1],-y[0]],D=[],Z=l>11?5:3,k=Z===5?[.1,.27,.5,.66,.9]:[.2,.47,.83],c=new Set;for(let o=0;o<Z;o++)c.add(Math.round((k[o]+d.range(-.03,.03))*(l-1)));for(let o=0;o<l;o++){const u=d.range(-.34,.34),S=-1+2*(o+.5+u)/l,G=d(),B=d(),P=d(),W=1-Math.pow(Math.min(1,Math.abs(S)),.7),Q=c.has(o)?.84+.16*G:.17+.26*W*(.6+.6*G),V=.1*(S*S-.33)+(B-.5)*.03;D.push({x:y[0]*4*S+q[0]*V,y:y[1]*4*S+q[1]*V,b:Q,ph:P,tau:S})}const K=D.slice().sort((o,u)=>o.y-u.y).slice(0,3),O=D.slice().sort((o,u)=>u.b-o.b).slice(0,3).map(o=>new t.Vector4(o.x,o.y,d.range(17,26),d.range(0,30))),F=[];for(let o=0;o<20;o++){const u=d.range(11,19);F.push(new t.Vector4(u,d()*u,d(),0))}const L=[];for(let o=0;o<15;o++){const u=D[o];L.push(u?new t.Vector4(u.x,u.y,u.b,u.ph):new t.Vector4(0,0,0,0))}const U=d.range(0,38);return{N:l,kink:U,pieces:L,beads:O,mets:F,from:K.map(o=>new t.Vector2(o.x,o.y)),trainDir:new t.Vector2(y[0],y[1])}}function be(d,T={}){const l=ve[T.deep?"deep":"early"],M=e=>new t.Color(e),y=new t.Vector3(Math.sin(le*r),0,-Math.cos(le*r)),q=se(ee,te),D=new t.Vector3(Math.cos(ee*r),0,Math.sin(ee*r)),Z=new t.Vector3(0,1,0).addScaledVector(q,-q.y).normalize(),k=pe(d,T.dn??.5),c={uSunH:{value:y},uZen:{value:M(l.zen)},uMidB:{value:M(l.midB)},uHorB:{value:M(l.horB)},uGreen:{value:M(l.green)},uGold:{value:M(l.gold)},uOrange:{value:M(l.orange)},uSlate:{value:M(l.slate)},uPink:{value:M(l.pink)},uStarGain:{value:l.stars},uSkyTime:{value:0},uC0:{value:q},uCR:{value:D},uCU:{value:Z},uPiece:{value:k.pieces},uBead:{value:k.beads},uMet:{value:k.mets},uMetFrom:{value:k.from},uTrainDir:{value:k.trainDir},uTime:{value:0},uPieceN:{value:k.N},uCometGain:{value:l.comet},uMetGain:{value:l.met},uKink:{value:k.kink},uMetFloor:{value:14},uMetCurve:{value:0},uApart:{value:0},uStorm:{value:0},uMetN:{value:11},uRibA:{value:Array.from({length:56},()=>new t.Vector4)},uRibB:{value:Array.from({length:56},()=>new t.Vector4(10,0,2,0))},uRibBox:{value:new t.Vector2(0,1)}},K=`
    varying vec3 vDir;
    void main() { vDir = position; vec4 p = projectionMatrix*vec4(mat3(viewMatrix)*position, 1.0); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,H=new t.Mesh(new t.BoxGeometry(2,2,2),new t.ShaderMaterial({name:"LakeTownSky",uniforms:c,side:t.BackSide,depthWrite:!1,fog:!1,vertexShader:K,fragmentShader:`
      precision highp float; varying vec3 vDir;
      ${de}
      void main() {
        vec3 d = normalize(vDir);
        float px = length(fwidth(d));
        vec3 c = twSky(d) + vec3(0.86, 0.92, 1.0)*twStars(d, px)*uStarGain;
        c += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)))*43758.5453) - 0.5)*0.004;   // no banding in the long gradient
        gl_FragColor = vec4(max(c, 0.0), 1.0);
      }`}));H.frustumCulled=!1,H.renderOrder=50,H.name="twilight";const O=new t.BufferGeometry,F=[],L=[-36,84],U=[3,66],o=9,u=6,S=[];for(let e=0;e<=u;e++)for(let a=0;a<=o;a++){const n=se(L[0]+(L[1]-L[0])*a/o,U[0]+(U[1]-U[0])*e/u);F.push(n.x,n.y,n.z)}for(let e=0;e<u;e++)for(let a=0;a<o;a++){const n=e*(o+1)+a,h=n+1,v=n+o+1,b=v+1;S.push(n,h,b,n,b,v)}O.setAttribute("position",new t.Float32BufferAttribute(F,3)),O.setIndex(S);const G=new t.Mesh(O,new t.ShaderMaterial({name:"LakeTownComet",uniforms:c,side:t.DoubleSide,transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,fog:!1,vertexShader:K,fragmentShader:`
      precision highp float; varying vec3 vDir;
      ${fe}
      void main() { vec3 d = normalize(vDir); gl_FragColor = vec4(cometAt(d, length(fwidth(d))*57.2958), 1.0); }`}));G.frustumCulled=!1,G.renderOrder=60,G.name="comet";const B=d.fork("storm"),P=56,W=[],Q=new Float32Array(P*16),V=[],ae=[],oe=[];for(let e=0;e<P;e++){const a=e%11===5,n=B.range(-62,62)*r,h=B(),v=B(),b=B(),m=a?B.range(17,24):B.range(9,20),x=B()*m,p=B(),i=a?9+5*v:2+12*Math.pow(v,2.2),w=(p<.5?0:1)+(a?2:0);oe.push({th:n,off:8*h*h,len:i,bright:a?1:1/(1+3*b),slow:a});for(const s of[[0,-1],[1,-1],[1,1],[0,1]])W.push(s[0],s[1],0),V.push(m,x,(e+.5)/P,w);ae.push(e*4,e*4+1,e*4+2,e*4,e*4+2,e*4+3),c.uRibB.value[e].set(m,x,(e+.5)/P,w)}const R=new t.BufferGeometry;R.setAttribute("position",new t.Float32BufferAttribute(W,3)),R.setAttribute("aA",new t.BufferAttribute(Q,4)),R.setAttribute("aB",new t.Float32BufferAttribute(V,4)),R.setIndex(ae);const $=new t.Mesh(R,new t.ShaderMaterial({name:"LakeTownStorm",uniforms:c,side:t.DoubleSide,transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,fog:!1,vertexShader:`
      attribute vec4 aA, aB;                 // aA: where it begins (degrees from the radiant), its length, its brightness; aB: period, phase, rank, tone (and 2 more for a slow bright one)
      uniform vec3 uC0, uCR, uCU; uniform float uTime, uStorm;
      varying vec2 vUv; varying vec4 vM; varying vec3 vT;
      void main() {
        float a = fract((uTime + aB.y)/aB.x)*1.25, slow = step(1.5, aB.w);               // out for four fifths of its round
        vec2 dir = aA.xy/max(length(aA.xy), 1.0), nd = vec2(dir.y, -dir.x);               // away from the radiant
        float run = (4.0 + 1.6*aA.z)*(1.0 - 0.4*slow)*(0.8*a + 0.2*a*a);
        vec2 head = aA.xy + dir*run;
        float env = smoothstep(0.03, 0.25, a)*(1.0 - smoothstep(0.86, 1.0, a));
        float L = aA.z*(0.35 + 0.65*env) + 0.35, w = 0.07 + 0.08*aA.w;
        float Lq = mix(L, max(L, run + 0.35), slow);                                      // a slow one's ribbon reaches back to where it began, for its thin train
        vec2 q = head + dir*(0.35 - Lq*position.x) + nd*w*position.y;
        float vis = env*smoothstep(aB.z*0.95, aB.z*0.95 + 0.05, uStorm)*aA.w;
        vUv = position.xy; vM = vec4(vis, aB.w - 2.0*slow, 0.35/Lq, Lq); vT = vec3(L - 0.35, slow, run);
        vec3 d = uC0 + (uCR*q.x + uCU*q.y)/57.2958;
        vec4 p = projectionMatrix*vec4(mat3(viewMatrix)*d, 1.0); if (abs(p.w) < 1e-4) p.w = 1e-4;
        gl_Position = vis > 0.001 ? p.xyww : vec4(2.0, 2.0, 2.0, 1.0);
      }`,fragmentShader:`
      precision highp float; uniform float uMetGain; varying vec2 vUv; varying vec4 vM; varying vec3 vT;
      void main() {
        float ac = 1.0 - vUv.y*vUv.y; ac *= ac;
        float dx = (vUv.x - vM.z)*vM.w;                                                   // degrees behind the head
        float tail = clamp(1.0 - dx/max(vT.x, 0.05), 0.0, 1.0)*step(0.0, dx); tail *= tail;
        float headG = exp(-dx*dx/0.02);
        float train = vT.y*0.3*step(0.0, dx)*clamp(1.0 - dx/max(vT.z, 0.3), 0.0, 1.0)*(1.0 - smoothstep(0.1, 0.45, abs(vUv.y)));   // the thin train of a slow bright one
        vec3 col = mix(vec3(1.0, 0.86, 0.58), vec3(0.78, 1.0, 0.86), step(0.5, vM.y));   // pale gold or green-white, never red
        gl_FragColor = vec4(col*vM.x*(ac*(0.9*tail + 1.8*headG) + train)*uMetGain, 1.0);
      }`}));$.frustumCulled=!1,$.renderOrder=61,$.name="meteor storm";const E=Math.sin(te*r),_=Math.cos(te*r),J=(e,a)=>{const n=e*r,h=a*r;return Math.asin((E+_*h)/Math.sqrt(1+n*n+h*h))/r},me=(e,a)=>{const n=e*r,h=a*r,v=Math.sin(n)*Math.cos(h),b=Math.sin(h),m=Math.cos(n)*Math.cos(h),x=b*E+m*_;return[v/x/r,(b*_-m*E)/x/r]},ce=(e,a)=>Math.atan2(e*r,_-E*a*r)/r,ue=e=>{const a=Math.min(1,Math.max(0,(e-.03)/.22)),n=Math.min(1,Math.max(0,(e-.86)/.14));return a*a*(3-2*a)*(1-n*n*(3-2*n))},re=(e,a=e,n=41)=>{const h=i=>{let w=-40,s=85;for(let A=0;A<32;A++){const f=(w+s)/2;J(i,f)<e?w=f:s=f}return s},v=(i,w)=>{for(let s=1.2;s<60;s+=.25)if(J(i*s,w*s)>=a+.3)return s;return-1},b=h(0);let m=0;for(let i=4;i<=48;i+=2)m=Math.max(m,(h(i)-b)/(i*i));c.uMetFloor.value=b,c.uMetCurve.value=m;let x=1e9,p=0;oe.forEach((i,w)=>{const s=(4+1.6*i.len)*(i.slow?.6:1);let A=0,f=-1,N=0,z=1;for(let g=.03;g<=1;g+=.02)A=Math.max(A,i.len*(.35+.65*ue(g))+.35-s*(.8*g+.2*g*g));for(let g=0,X=i.th/(62*r)*80*r;g<14&&f<0;g++,X*=.8){const Y=Math.sin(X),j=Math.cos(X),ne=v(Y,j),ie=ne+A+i.off,I=ie+s;ne>0&&J(Y*I,j*I)>=a+.3&&I*r<=_*j/E&&Math.abs(ce(Y*I,j*I))<=n&&(f=ie,N=Y,z=j)}f<0&&(N=0,z=1,f=Math.max(1.2,v(0,1))+A+i.off);for(let g=0;g<4;g++)Q.set([N*f,z*f,i.len,i.bright],(w*4+g)*4);c.uRibA.value[w].set(N*f,z*f,i.len,i.bright),x=Math.min(x,z*(f-A)),p=Math.max(p,f+s+1)}),c.uRibBox.value.set(x-1.5,(p+2)*(p+2)),R.attributes.aA.needsUpdate=!0};re(30);const C=e=>c[e].value,he=new t.Color;return{U:c,dome:H,comet:G,storm:$,look:l,deal:k,colorAt:(e,a=new t.Color)=>{const n=e.y,h=Math.max(n,0),v=h*57.3,b=Math.hypot(e.x,e.z)||1e-4,m=(e.x*y.x+e.z*y.z)/b,x=(A,f,N)=>{const z=Math.min(1,Math.max(0,(N-A)/(f-A)));return z*z*(3-2*z)};let p=x(-.35,1,m);p*=p;const i=x(.15,-.8,m),w=(v-8)/4.5,s=Math.max(v-6.5*p,0);return a.copy(C("uMidB")).lerp(C("uZen"),1-Math.exp(-h*2.6)).lerp(C("uHorB"),Math.exp(-v/7)*.8).lerp(C("uGreen"),Math.exp(-s/19)*p*.9).lerp(C("uGold"),Math.exp(-s/8.5)*p*.97).lerp(C("uOrange"),Math.exp(-s/3.6)*p*p).lerp(C("uPink"),Math.exp(-w*w)*i*.62).lerp(C("uSlate"),Math.exp(-v/3.4)*i*.9),a.multiplyScalar(1-.4*x(0,-.25,n))},sunH:y,c0:q,tmp:he,setFloor:re,update(e){c.uTime.value=e,c.uSkyTime.value=e},beat(e,a){c.uApart.value=e,c.uStorm.value=a,c.uMetN.value=11+9*a}}}export{fe as COMET_GLSL,de as SKY_GLSL,we as STORM_GLSL,le as SUN_AZ,ge as SUN_EL,ee as TRAIN_AZ,te as TRAIN_EL,se as dirOf,be as makeTwilight};
