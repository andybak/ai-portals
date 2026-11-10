import*as t from"three";const fe=Math.PI*2,g=(w,V,W)=>{const L=Math.min(1,Math.max(0,(W-w)/(V-w)));return L*L*(3-2*L)},S=(w,V,W)=>w+(V-w)*W,R=w=>.2126*w.r+.7152*w.g+.0722*w.b,Z=32,he=14,Ae=8,pe=14,ke=3,Fe=30;function Ie(){const w=[],V=[],W=[],L=[],$=[],a=[];let N=0;const m=(e,o,i,n,v,c=0,s=0,h=0,b=0)=>(w.push(e[0],e[1],e[2]),V.push(o[0],o[1],o[2]),W.push(i,n),L.push(v),$.push(c,s,h,b),N++),A=(e,o,i,n)=>a.push(e,o,i,e,i,n),te=N;for(let e=0;e<=he;e++)for(let o=0;o<=Z;o++)m([0,0,0],[0,1,0],o/Z,e/he,0);for(let e=0;e<he;e++)for(let o=0;o<Z;o++){const i=te+e*(Z+1)+o;A(i,i+1,i+Z+2,i+Z+1)}const F=(e,o,i,n)=>{const v=N;for(let c=0;c<e.length;c++){const[s,h]=e[c],b=e[Math.max(0,c-1)],k=e[Math.min(e.length-1,c+1)];let B=-(k[0]-b[0]),E=k[1]-b[1];const le=Math.hypot(B,E)||1;B/=le,E/=le;for(let H=0;H<=o;H++){const re=H/o*fe,ie=Math.cos(re),_=Math.sin(re);m([ie*s,h,_*s],[ie*E,B,_*E],H/o,c/(e.length-1),i,c/(e.length-1))}}for(let c=0;c<e.length-1;c++)for(let s=0;s<o;s++){const h=v+c*(o+1)+s;A(h,h+1,h+o+2,h+o+1)}if(n){const c=m([0,e[0][1],0],[0,-1,0],.5,0,i);for(let s=0;s<o;s++)a.push(c,v+s,v+s+1)}},ae=[];for(let e=0;e<=5;e++){const o=e/5*fe;ae.push([.15+Math.cos(o)*.013,-.3+Math.sin(o)*.013])}F(ae,20,1,!1),F([[.012,-.315],[.04,-.305],[.044,-.272],[.03,-.268]],8,1,!0),F([[.05,.332],[.034,.35],[.014,.372],[0,.376]],8,1,!1);const K=(e,o,i,n,v,c)=>{const s=[[e,i,v],[o,i,v],[o,n,v],[e,n,v],[e,i,c],[o,i,c],[o,n,c],[e,n,c]],h=[[0,3,2,1,0,0,-1],[4,5,6,7,0,0,1],[0,1,5,4,0,-1,0],[3,7,6,2,0,1,0],[0,4,7,3,-1,0,0],[1,2,6,5,1,0,0]];for(const b of h){const k=[b[4],b[5],b[6]];A(m(s[b[0]],k,0,0,1),m(s[b[1]],k,0,0,1),m(s[b[2]],k,0,0,1),m(s[b[3]],k,0,0,1))}};K(-.15,.15,-.304,-.296,-.004,.004),K(-.004,.004,-.304,-.296,-.15,.15);const oe=[];for(let e=0;e<=6;e++){const o=e/6;oe.push([.036*Math.sin(Math.PI*Math.pow(o,.62))+.001,-.272+.14*o])}F(oe,8,2,!1);for(let e=0;e<Ae;e++){const o=N;for(let i=0;i<=pe;i++){const n=i/pe;m([0,0,0],[0,1,0],0,n,3,e,n,-1),m([0,0,0],[0,1,0],1,n,3,e,n,1)}for(let i=0;i<pe;i++){const n=o+i*2;A(n,n+1,n+3,n+2)}}for(let e=0;e<ke;e++){const o=m([0,0,-.7],[0,1,0],.5,0,4,e,0),i=m([0,0,.6],[0,1,0],.5,1,4,e,0),n=m([-1,0,.25],[0,1,0],0,.5,4,e,1),v=m([1,0,.25],[0,1,0],1,.5,4,e,1);a.push(o,i,n,o,v,i)}const x=new t.BufferGeometry;return x.setAttribute("position",new t.Float32BufferAttribute(w,3)),x.setAttribute("normal",new t.Float32BufferAttribute(V,3)),x.setAttribute("aUV",new t.Float32BufferAttribute(W,2)),x.setAttribute("aPart",new t.Float32BufferAttribute(L,1)),x.setAttribute("aRib",new t.Float32BufferAttribute($,4)),x.setIndex(a),x}const Me=`
#ifdef USE_FOG
  uniform vec3 fogColor;
  #ifdef FOG_EXP2
    uniform float fogDensity;
  #else
    uniform float fogNear; uniform float fogFar;
  #endif
  float fogAmount(float d){
    #ifdef FOG_EXP2
      return 1. - exp(-fogDensity * fogDensity * d * d);
    #else
      return smoothstep(fogNear, fogFar, d);
    #endif
  }
#endif`,Te=`
attribute vec2 aUV; attribute float aPart; attribute vec4 aRib;
uniform float uTime, uForm, uScale, uFlick;
uniform vec3 uWind;
varying vec3 vW, vN; varying vec2 vUV; varying float vPart, vDepth, vAux, vId;
const float TAU = 6.2831853;

// the paper bag (form 0) or the jelly's bell (form 1); a = turn 0..1, v = mouth 0 .. crown 1
vec3 bodyPos(float a, float v){
  float ang = a * TAU;
  float rl = mix(0.15, 0.278, smoothstep(0., 0.62, v)) * sqrt(max(0., 1. - pow(max(0., (v - 0.5) / 0.5), 2.6)));
  rl *= 1. - 0.05 * (1. - abs(cos(ang * 4.)));                      // eight panels between bamboo ribs
  rl *= 1. + 0.014 * sin(uTime * 1.7 + v * 4. + ang * 2.);            // the paper breathes
  float yl = -0.30 + 0.64 * v;
  float c = 0.5 + 0.5 * sin(uTime * 2.2 - v * 1.8); c *= c;           // the bell's pulse
  float h = v * 1.5707;
  float rj = 0.31 * pow(max(cos(h), 0.), 0.72);
  rj *= 1. - 0.24 * c * (1. - v);
  rj *= 1. + 0.06 * cos(ang * 8.) * (1. - v) * (1. - v);
  rj *= 1. - 0.22 * c * (1. - smoothstep(0., 0.22, v));
  float yj = -0.07 + 0.27 * sin(h) * (1. + 0.2 * c);
  float r = mix(rl, rj, uForm);
  return vec3(cos(ang) * r, mix(yl, yj, uForm), sin(ang) * r);
}

void main(){
  vec3 P = position, N = normal; vec3 W; bool world = false;
  vAux = aRib.y; vId = aRib.x;
  if (aPart < 0.5) {
    float e = 0.008;
    P = bodyPos(aUV.x, aUV.y);
    vec3 du = bodyPos(aUV.x + e, aUV.y) - bodyPos(aUV.x - e, aUV.y);
    vec3 dv = bodyPos(aUV.x, min(aUV.y + e, 1.)) - bodyPos(aUV.x, max(aUV.y - e, 0.));
    N = cross(dv, du);
    N = dot(N, N) > 1e-12 ? normalize(N) : vec3(0., 1., 0.);
  } else if (aPart < 1.5) {
    P = mix(P, vec3(0., 0.06, 0.), uForm);                             // the frame folds away underwater
  } else if (aPart < 2.5) {
    float t = aRib.x;
    vec3 q = P - vec3(0., -0.272, 0.);
    q.y *= uFlick * (1. + 0.22 * sin(uTime * 17. + 1.3)) ;
    q.xz += vec2(sin(uTime * 13. + t * 5.), cos(uTime * 11. + t * 4.)) * 0.012 * t * t;
    vec3 heart = vec3(q.x * 2.6, (q.y - 0.07) * 1.5 * (1. + 0.15 * sin(uTime * 2.2)) + 0.07, q.z * 2.6);
    P = mix(q + vec3(0., -0.272, 0.), heart, uForm);
    vAux = t;
  } else if (aPart < 3.5) {
    float i = aRib.x, s = aRib.y, side = aRib.z;
    float odd = mod(i, 2.), jit = fract(i * 0.618);
    // paper: one long streamer, three shorter tails of different lengths, four tassels between them
    float Ll = i < 0.5 ? 1.3 : (i < 2.5 ? (odd > 0.5 ? 0.2 : 0.5) : (i < 4.5 ? (odd > 0.5 ? 0.26 : 0.82) : (odd > 0.5 ? 0.17 : (i < 6.5 ? 0.34 : 0.22))));
    Ll *= 0.92 + 0.16 * jit;
    float wl = (odd > 0.5 ? 0.017 : (Ll > 0.7 ? 0.024 : 0.03)) * (1. - 0.35 * s);
    // jelly: four long tentacles (even) and four frilled oral arms (odd)
    float Lj = odd > 0.5 ? 0.4 + 0.12 * jit : 0.85 + 0.5 * jit;
    float wj = odd > 0.5 ? 0.062 * (0.35 + sin(s * 3.1416)) * (1. + 0.28 * sin(s * 17. - uTime * 3.4 + i))
                         : 0.034 * (1. - 0.5 * s);
    float L = mix(Ll, Lj, uForm) * uScale;
    float w = mix(wl, wj, uForm) * uScale;
    vec3 rootL = bodyPos(i / 8., 0.); rootL.y -= 0.01;
    rootL.xz *= mix(1., odd > 0.5 ? 0.3 : 0.86, uForm);
    vec3 root = (modelMatrix * vec4(rootL, 1.)).xyz;
    vec3 objUp = normalize(modelMatrix[1].xyz);
    vec3 radial = normalize(mat3(modelMatrix) * vec3(rootL.x, 0., rootL.z) + vec3(1e-5));
    vec3 down = normalize(mix(vec3(0., -1., 0.), -objUp, 0.3 + 0.55 * uForm));
    float ph = i * 1.7 + jit * 3.;
    vec3 dir = normalize(down + radial * mix(0.3, 0.16, uForm) * (1. - 0.6 * s) + uWind * (0.3 + 0.8 * s) * (0.8 + 0.4 * jit));
    vec3 t1 = normalize(cross(dir, vec3(0.31, 0.9, 0.23))), t2 = cross(dir, t1);
    float wv = uTime * mix(4.6, 2.4, uForm) * (0.85 + 0.3 * jit) - s * mix(6.4, 5., uForm) + ph;
    vec3 p = root + dir * L * s + (t1 * sin(wv) + t2 * cos(wv * 0.8 + 1.)) * L * s * mix(0.13, 0.11, uForm);
    vec3 bill = normalize(cross(dir, normalize(cameraPosition - p)));
    float tw = ph + s * 3.2 + sin(uTime * 1.3 + ph) * 0.9;
    vec3 fl = t1 * cos(tw) + t2 * sin(tw);
    vec3 wd = normalize(fl + bill * (1.1 + 2.5 * uForm) * (dot(bill, fl) >= 0. ? 1. : -1.));
    W = p + wd * side * w; world = true;
  } else {
    float id = aRib.x, ph = id * 2.1 + 1.3, dirn = mod(id, 2.) < 0.5 ? 1. : -1.;
    float a = dirn * uTime * (1.7 + 0.45 * id) + ph;
    float R = 0.6 + 0.1 * sin(uTime * 0.9 + ph * 2.) + 0.1 * uForm;
    vec3 c = vec3(cos(a) * R, -0.16 + 0.2 * sin(uTime * 1.3 + ph) + 0.09 * sin(a * 2.), sin(a) * R);
    vec3 fwd = dirn * vec3(-sin(a), 0., cos(a)), right = vec3(cos(a), 0., sin(a));
    float flap = sin(uTime * mix(27., 9., uForm) + ph * 3.) * mix(1.1, 0.35, uForm);
    vec3 wing = mix(right * cos(flap) * P.x + vec3(0., 1., 0.) * abs(P.x) * sin(flap),      // a moth's wings beat
                    vec3(0., 1., 0.) * P.x * 0.55 + right * P.z * flap * 0.5, uForm);       // a fry is a little upright diamond that wags
    P = c + (fwd * (-P.z) * mix(1., 1.7, uForm) + wing) * mix(0.09, 0.075, uForm);
  }
  if (!world) W = (modelMatrix * vec4(P, 1.)).xyz;
  vW = W; vN = normalize(mat3(modelMatrix) * N); vUV = aUV; vPart = aPart;
  vec4 mv = viewMatrix * vec4(W, 1.);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}`,Ue=`
uniform vec3 uKey, uAmb, uKeyDir, uExtraFill, uFlameW;
uniform float uDark, uForm, uFlare, uTime, uFlick, uScale, uLead;
varying vec3 vW, vN; varying vec2 vUV; varying float vPart, vDepth, vAux, vId;
${Me}
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y); }

void main(){
  vec3 V = normalize(cameraPosition - vW);
  vec3 N = normalize(vN);
  if (vPart > 2.5) N = normalize(cross(dFdx(vW), dFdy(vW)));
  float inside = 0.;
  if (dot(N, V) < 0.) { N = -N; inside = 1.; }
  float ndl = dot(N, uKeyDir);
  vec3 light = uAmb * (0.78 + 0.22 * N.y) + uKey * (max(ndl, 0.) * 0.85 + 0.12);
  float fres = pow(1. - max(dot(N, V), 0.), 2.5);
  // how close this pixel's line of sight passes to the flame: the hot spot seen through the paper
  vec3 oc = uFlameW - cameraPosition; float tt = dot(oc, -V);
  float dray = length(oc + V * tt) / max(uScale, 1e-3);
  float hot = exp(-dray * dray / 0.014);
  float gl = mix(0.3, 1., uDark) * uFlick * (1. + 0.5 * uFlare);
  float form = uForm;

  vec3 alb = vec3(0.5), emi = vec3(0.), trans = vec3(0.);
  if (vPart < 0.5) {
    float v = vUV.y;
    float rb = abs(fract(vUV.x * 8. + 0.5) - 0.5);
    float rib = 1. - smoothstep(0.02, 0.065, rb);
    float fib = 0.82 + 0.18 * vnoise(vec2(vUV.x * 90., v * 22.)) * (0.6 + 0.8 * vnoise(vec2(vUV.x * 14., v * 60.)));
    float trim = max(1. - smoothstep(0.035, 0.055, v), smoothstep(0.925, 0.945, v));
    float gilt = (1. - smoothstep(0.008, 0.02, abs(v - 0.085))) + (1. - smoothstep(0.008, 0.02, abs(v - 0.895)));
    // ---- paper lantern
    vec3 paper = mix(vec3(0.84, 0.27, 0.07), vec3(0.72, 0.07, 0.035), smoothstep(0.05, 0.85, v)) * fib;
    vec3 albL = paper * (1. - 0.72 * rib);
    albL = mix(albL, vec3(0.20, 0.045, 0.03), trim);
    albL = mix(albL, vec3(0.85, 0.6, 0.2), gilt * 0.8);
    albL *= 1. - 0.5 * uLead;                                           // against the portal: a deep vermilion shape
    vec3 glowL = mix(vec3(1.0, 0.50, 0.13) * 2.0, vec3(1.0, 0.13, 0.03) * 0.95, smoothstep(0., 0.8, v));
    glowL *= (1. - 0.82 * rib) * (1. - 0.88 * trim) * (1. - 0.5 * gilt) * fib * (1. + 0.7 * inside);
    glowL *= mix(vec3(1.), vec3(1.3, 0.5, 0.28), uLead);                 // against the portal's bloom: hotter and redder, never cream
    glowL += vec3(1.0, 0.66, 0.28) * mix(1.9, 1.2, uLead) * hot * (1. - 0.6 * rib) * (1. - 0.8 * trim);
    glowL *= 1. - 0.35 * fres;                                           // the rim turns away: a rounder, deeper edge
    vec3 transL = albL * uKey * max(-ndl, 0.) * 0.4;                    // sunlight coming through the far side
    // ---- jelly bell
    float canal = (1. - smoothstep(0.01, 0.06, rb)) * smoothstep(1., 0.55, v);
    float spots = smoothstep(0.62, 0.9, vnoise(vec2(vUV.x * 26., v * 9.)));
    vec3 albJ = vec3(0.035, 0.11, 0.2);
    vec3 glowJ = mix(vec3(0.12, 0.62, 1.0), vec3(1.0, 0.22, 0.70), 1. - smoothstep(0.05, 0.6, v));
    glowJ *= 0.13 + 1.4 * fres + 0.9 * canal + 0.4 * spots + 0.3 * inside;
    glowJ *= 0.75 + 0.45 * (0.5 + 0.5 * sin(uTime * 2.2 - v * 1.8));                // light runs up the bell with each pulse
    glowJ += vec3(1.0, 0.25, 0.7) * 1.5 * hot * hot;
    glowJ = mix(glowJ, vec3(1.0, 0.1, 0.5) * (0.34 + 0.4 * fres + 0.35 * canal + 0.7 * hot), 0.85 * uLead);
    alb = mix(albL, albJ, form); emi = mix(glowL, glowJ * 1.8, form) * gl; trans = transL * (1. - form);
  } else if (vPart < 1.5) {
    alb = vec3(0.17, 0.09, 0.05);
    emi = vec3(1.0, 0.5, 0.15) * 0.5 * gl * (1. - form);
  } else if (vPart < 2.5) {
    alb = vec3(0.);
    vec3 fl = mix(vec3(1.0, 0.86, 0.5) * 7., vec3(1.0, 0.36, 0.06) * 4., smoothstep(0.2, 1., vAux));
    emi = mix(fl, vec3(1.0, 0.3, 0.75) * 2.0, form) * uFlick * (1. + uFlare);
  } else if (vPart < 3.5) {
    float s = vAux;
    vec3 albL = mix(vec3(0.80, 0.12, 0.05), vec3(0.88, 0.62, 0.2), smoothstep(0.9, 0.93, s) * step(vId, 0.5));
    albL *= 1. - 0.4 * uLead;
    vec3 emiL = vec3(1.0, 0.30, 0.07) * (0.10 + 0.6 * (1. - s) * (1. - s)) * gl * mix(vec3(1.), vec3(1.3, 0.5, 0.3), uLead);
    float run = 0.5 + 0.5 * sin(uTime * 3. - s * 9.);
    float ed = 1. - pow(abs(vUV.x * 2. - 1.), 2.);                       // soft-edged, brightest down the middle
    float arm = step(0.5, mod(vId, 2.));
    vec3 emiJ = mix(vec3(1.0, 0.3, 0.8), vec3(0.3, 0.8, 1.0), mix(s, 0.25 * s, arm)) * (0.5 + 1.3 * run * run) * (0.2 + 1.0 * ed) * gl;
    emiJ = mix(emiJ, vec3(1.0, 0.12, 0.5) * (0.25 + 0.5 * ed) * gl, 0.8 * uLead);
    alb = mix(albL, vec3(0.05, 0.14, 0.24), form); emi = mix(emiL, emiJ, form);
    trans = albL * uKey * max(-ndl, 0.) * 0.5 * (1. - form);
  } else {
    alb = mix(vec3(0.82, 0.76, 0.6), vec3(0.6, 0.72, 0.8), form);
    emi = mix(vec3(1.0, 0.62, 0.26) * 1.6, vec3(0.3, 0.9, 1.0) * 1.3, form) * mix(0.4, 1., uDark) * uFlick;
  }
  vec3 col = alb * (light + uExtraFill) + trans + emi;
  #ifdef USE_FOG
    col = mix(col, fogColor, fogAmount(vDepth) * 0.8 * (1. - uLead));
  #endif
  gl_FragColor = vec4(col, 1.);
}`,We=`
attribute vec4 aI;                       // kind (0 wide halo, 1 near glow, 2 spark), three random numbers
uniform vec3 uPos, uFlameW, uWind;
uniform float uTime, uScale, uBurst, uForm;
varying vec2 vQ; varying float vK, vA, vDepth;
void main(){
  vec3 c = uPos; float size = 3.4 * uScale, a = 1.;
  if (aI.x > 1.5) {
    float life = mix(1.5, 3.1, aI.y), ph = fract(uTime / life + aI.z), age = ph * life;
    vec3 rd = normalize(vec3(sin(aI.w * 40.), cos(aI.y * 31.) * 0.7 + 0.3, sin(aI.z * 53.)));
    vec3 o = vec3(0., mix(0.34, 0.6, uForm), 0.) * age + uWind * age * (0.45 + 0.7 * aI.w) * mix(1., 0.3, uForm)
           + rd * (0.07 + 0.26 * ph + uBurst * 1.7 * sqrt(ph))
           + vec3(sin(uTime * 2.1 + aI.y * 20.), 0., cos(uTime * 1.7 + aI.z * 20.)) * 0.09 * age;
    c = uFlameW + o * uScale;
    a = smoothstep(0., 0.07, ph) * (1. - ph) * (1. - ph) * (0.55 + 0.45 * sin(uTime * (9. + aI.y * 8.) + aI.z * 30.));
    size = mix(0.04, 0.085, aI.w) * uScale * (1. + 0.8 * uBurst) * mix(1., 1.25, uForm);
  } else if (aI.x > 0.5) { size = 1.15 * uScale; }
  vQ = position.xy * 2.; vK = aI.x; vA = a;
  vec4 mv = viewMatrix * vec4(c, 1.);
  mv.xy += position.xy * size;
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}`,ze=`
uniform vec3 uHaloCol, uSparkCol;
uniform float uHalo, uSpark, uForm, uLead;
varying vec2 vQ; varying float vK, vA, vDepth;
${Me}
void main(){
  float r = length(vQ);
  if (r > 1.) discard;
  float edge = 1. - smoothstep(0.55, 1., r);
  vec3 col;
  if (vK < 0.5) col = uHaloCol * uHalo * (exp(-r * r * 7.) * 0.55 + exp(-r * r * 26.) * 0.5) * edge;
  else if (vK < 1.5) col = uHaloCol * uHalo * 1.0 * exp(-r * r * 6.) * edge;
  else {
    float core = exp(-r * r * 6.) * edge;
    float ring = mix(0., smoothstep(0.45, 0.75, r) * (1. - smoothstep(0.75, 0.95, r)) * 0.6, uForm);   // bubbles underwater
    col = uSparkCol * uSpark * vA * (core * (1. - 0.6 * uForm) + ring);
  }
  #ifdef USE_FOG
    col *= 1. - fogAmount(vDepth) * 0.8 * (1. - uLead);
  #endif
  gl_FragColor = vec4(col, 1.);
}`;var Ce={id:"wandering-lantern",name:"The Wandering Lantern",async build(w){const{rng:V,fill:W}=w,L=new t.Group,$=()=>t.UniformsUtils.clone(t.UniformsLib.fog),a={...$(),uExtraFill:W,uKey:{value:new t.Color(1,1,1)},uKeyDir:{value:new t.Vector3(.4,.8,.4)},uAmb:{value:new t.Color(.4,.4,.4)},uDark:{value:0},uForm:{value:0},uFlare:{value:0},uTime:{value:0},uFlick:{value:1},uScale:{value:1},uWind:{value:new t.Vector3(0,0,1)},uFlameW:{value:new t.Vector3},uLead:{value:0}},N=new t.ShaderMaterial({uniforms:a,vertexShader:Te,fragmentShader:Ue,side:t.DoubleSide,fog:!0}),m=new t.Mesh(Ie(),N);m.frustumCulled=!1,L.add(m);const A=new t.InstancedBufferGeometry;A.setAttribute("position",new t.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),A.setIndex([0,1,2,0,2,3]);const te=[0,0,0,0,1,0,0,0];for(let f=0;f<Fe;f++)te.push(2,V.range(0,1),V.range(0,1),V.range(0,1));A.setAttribute("aI",new t.InstancedBufferAttribute(new Float32Array(te),4)),A.instanceCount=Fe+2;const F={...$(),uPos:{value:new t.Vector3},uFlameW:a.uFlameW,uWind:a.uWind,uTime:a.uTime,uScale:a.uScale,uForm:a.uForm,uLead:a.uLead,uBurst:{value:0},uHalo:{value:.1},uSpark:{value:1},uHaloCol:{value:new t.Color(1,.55,.2)},uSparkCol:{value:new t.Color(1,.6,.25)}},ae=new t.ShaderMaterial({uniforms:F,vertexShader:We,fragmentShader:ze,blending:t.AdditiveBlending,depthWrite:!1,transparent:!0,fog:!0}),K=new t.Mesh(A,ae);K.frustumCulled=!1,K.renderOrder=3,L.add(K);const oe=1.3,x=new t.Vector3(0,1,0),e=new t.Vector3,o=new t.Vector3,i=new t.Vector3,n=new t.Vector3,v=new t.Vector3,c=new t.Vector3,s=new t.Vector3,h=new t.Vector3,b=new t.Vector3,k=new t.Quaternion,B=new t.Quaternion,E=new t.Color(1,.55,.2),le=new t.Color(.2,.75,1),H=new t.Color(1,.62,.25),re=new t.Color(.55,.95,1),ie=new t.Color(1,.2,.65),_=new t.Color("#9fd0ff");let me="#9fd0ff",ne=null,C=1,q=1,G=0,d=-1;const Se=f=>{const l=f.world||{},r=l.id||"";ne=r;let p=0;for(let y=0;y<r.length;y++)p=p*31+r.charCodeAt(y)|0;C=p&2?1:-1;const P=l.media||[];q=l.category==="interior"||l.category==="domestic"||P.includes("interior")||P.includes("tiny")?.7:1,G=P.includes("underwater")||/kelp|sunken|undersea|abyss|reef|under-ice|deep|trench/.test(r)?1:0},ge=(f,l,r)=>{const p=l.u,P=Math.max(l.entered,l.dist/14),y=1-g(14,62,l.remaining),T=1-g(13,26,l.remaining);let u=C*(1.95+.45*Math.sin(f*.23+1)),U=1+.32*Math.sin(f*.52)+.12*Math.sin(f*1.31+2),M=7.6+.9*Math.sin(f*.17);const j=g(.36,.47,p),I=g(.55,.66,p),z=Math.sin(Math.PI*j)+Math.sin(Math.PI*I);u*=1-2*j+2*I,U+=1.9*z+.35*(j-I),M+=2.4*z+1.4*(j-I);const se=f*1.5,Y=2.4*y*(1-y);u=S(u,C*S(1.1,.42,T),y)+Math.cos(se)*Y,U=S(U,S(.75,.5,T),y)+Math.sin(se)*Y*.7,M=S(M,S(9.5,12.5,T),y);const ee=1-g(0,4.5,P),D=ee*ee;u+=Math.cos(f*1.6)*D*2-C*1.2*D,U+=2.6*D+Math.sin(f*1.6)*D*.8,M+=3.2*D;const O=1-l.presence;U+=O*O*5,M+=O*4,u+=C*O*1.5,M+=.16*Math.sin(f*2.2-.9)*G,M=Math.max(4.5,M)*(q<1?.75:1);const J=Math.min(Math.max(l.dist+M,0),l.length);return l.path.posAtDist(J,o),l.path.tangentAtDist(J,i),n.crossVectors(i,x),n.lengthSq()<1e-6&&n.set(1,0,0),n.normalize(),r.copy(o).addScaledVector(n,u*q).addScaledVector(x,U*q),l.remaining-M},Le=f=>{const l=f.light,r=L.parent;let p;if(l&&l.has){a.uKey.value.copy(l.key).multiplyScalar(Math.min(l.keyIntensity,1.5)),a.uAmb.value.copy(l.ambient);const u=R(a.uAmb.value);u>.9&&a.uAmb.value.multiplyScalar(.9/u),l.keyIntensity>.01?a.uKeyDir.value.copy(l.keyDir):a.uKeyDir.value.set(.3,.9,.3),p=1-g(.25,.9,l.level)}else{let u=.3;r&&r.fog?u=R(r.fog.color):r&&r.background&&r.background.isColor&&(u=R(r.background)),p=1-g(.04,.4,u),a.uKey.value.setRGB(1,.96,.9).multiplyScalar(.9-.7*p),a.uAmb.value.setScalar(.4-.25*p),a.uKeyDir.value.set(.35,.85,.4)}a.uKeyDir.value.normalize();const P=R(a.uAmb.value)+R(a.uKey.value);P>1.15&&(a.uAmb.value.multiplyScalar(1.15/P),a.uKey.value.multiplyScalar(1.15/P));const y=R(a.uAmb.value)+.5*R(a.uKey.value),T=.16;if(y<T){const u=T-y;a.uAmb.value.r+=u,a.uAmb.value.g+=u,a.uAmb.value.b+=u*1.1}return p};return{object:L,update(f,l,r){if(!r.path)return;(ne===null||r.world&&r.world.id!==ne)&&Se(r),d=d<0?G:d+(G-d)*(1-Math.exp(-Math.min(f,.1)*1.6)),Math.abs(d-G)<.003&&(d=G);const p=Le(r),P=r.u,y=Math.max(r.entered,r.dist/14),T=.1,u=1-g(14,62,r.remaining),U=1-g(13,26,r.remaining),M=Math.max(-.5,Math.min(.5,r.turn||0)),j=ge(l+T,r,e);v.copy(e),ge(l,r,e),v.sub(e).multiplyScalar(1/T);const I=r.camera;if(I){I.getWorldDirection(c),s.subVectors(e,I.position);const de=s.length();if(de>1){s.multiplyScalar(1/de);const be=Math.max(-1,Math.min(1,s.dot(c))),Q=Math.acos(be);h.copy(s).addScaledVector(c,-be),h.lengthSq()<1e-5&&h.crossVectors(c,x).multiplyScalar(C).addScaledVector(x,.5),h.normalize();const ye=.17,we=.4;let X=Q;Q<ye?X=ye:Q>we&&(X=Q-Math.min(Q-we,.8)),X=S(Q,X,1-U),e.copy(c).multiplyScalar(Math.cos(X)).addScaledVector(h,Math.sin(X)).multiplyScalar(de).add(I.position)}s.subVectors(e,I.position);const ue=s.length(),xe=4.2*q;ue<xe&&ue>.001&&e.addScaledVector(s,(xe-ue)/ue)}const z=Math.max(1e-4,oe*q*S(1,1.35,d)*S(1,1.45,u)*S(1,1.2,U)*r.presence*g(0,.9,y)*g(-.4,1.6,j)),se=1-g(0,4.5,y),Y=g(.36,.47,P),ee=g(.55,.66,P),D=Math.max(-.3,Math.min(.3,-v.dot(n)*.07)),O=Math.max(-.3,Math.min(.3,-v.dot(i)*.07));b.copy(x).addScaledVector(n,D+M*.35+.09*Math.sin(l*.9)+se*.45*Math.sin(l*3.1)).addScaledVector(i,O-.07+.07*Math.sin(l*.7+1)+.95*d).normalize(),k.setFromUnitVectors(x,b),B.setFromAxisAngle(x,l*.32+fe*(Y+ee)+C*2.5*u),m.position.copy(e),m.quaternion.copy(k).multiply(B),m.scale.setScalar(z);const J=Math.sin(Math.PI*Y)+Math.sin(Math.PI*ee),ve=r.prev?1-g(0,2.6,r.entered):0,Pe=1-g(.5,16,j),ce=Math.max(ve,Pe);a.uTime.value=l,a.uForm.value=d,a.uScale.value=z,a.uDark.value=p,a.uFlick.value=.9+.07*Math.sin(l*11.3)+.05*Math.sin(l*23.7+1)+.25*J,a.uFlare.value=ce,a.uLead.value=u,r.portalColor!==me&&(me=r.portalColor,_.set(me||"#9fd0ff")),a.uFlameW.value.set(0,S(-.2,.07,d),0).applyQuaternion(m.quaternion).multiplyScalar(z).add(e);const Ve=Math.min(1.35,Math.max(.7,(r.speed||10)/11));a.uWind.value.copy(i).multiplyScalar(-Ve).addScaledVector(v,-.3).addScaledVector(n,-M*.6+.4*Math.sin(l*.37+.6)+.15*Math.sin(l*1.1)),a.uWind.value.length()>1.8&&a.uWind.value.setLength(1.8),F.uPos.value.set(0,S(-.02,.06,d),0).applyQuaternion(m.quaternion).multiplyScalar(z).add(e),F.uBurst.value=ce,F.uHalo.value=(.05+.3*p)*(1+.5*J+.8*ve)*(1-.85*u)*a.uFlick.value*S(1,.9,d),F.uSpark.value=(1.6+2.6*p)*(1+2*ce+.6*J),F.uHaloCol.value.copy(E).lerp(le,d*(1-.7*u)).lerp(_,.4*ve),d>0&&F.uHaloCol.value.lerp(ie,d*.7*u),F.uSparkCol.value.copy(H).lerp(re,d).lerp(_,.5*ce),L.visible=r.presence>.01&&z>.004},onSwap(){ne=null,d=-1}}}};export{Ce as default};
