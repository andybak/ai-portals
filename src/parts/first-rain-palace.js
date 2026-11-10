import*as y from"three";import{clamp as De,lerp as se,smoothstep as x0}from"../kit/core.js";const w0=["#F0A81E","#1F2A5C","#F6F1E3","#4F5D6B","#D8341F","#2F8F5B","#E9B949"],g0=new y.Vector3(0,1,0),b0=78.8,le=80,ae=26,Xe=[4.3,13.6,22.6],F0=2.6667,z=0,ie=1,ve=2,ze=3,pe=4,qe=5,me=6,y0=7,Ae=8,Re=9,We=10,_e=11,$e=12,r0=13,He=14,ye=s=>{const o=new y.Color(s);return[o.r,o.g,o.b]},ke=(s,o,n)=>[se(s[0],o[0],n),se(s[1],o[1],n),se(s[2],o[2],n)],Ee=(s,o)=>[s[0]*o,s[1]*o,s[2]*o],Je=(s,o,n)=>(s=Math.min(1,Math.abs(s)),o+n*Math.sqrt(Math.max(0,1-s*s))*(1-.16*(1-Math.abs(Math.cos(9.42478*s))))+n*.22*Math.max(0,1-5*s));function Ze(s){const o=[],n=[],f=[],a=[],i=[],e=[],m=[],U=[];let W=0,V=new y.Matrix4,_=[0,0,0,0],j=0;const K=new y.Matrix3,c=[],r=new y.Vector3,k=new y.Vector3,p=new y.Quaternion,M=new y.Matrix4,Y=new y.Vector3,E=new y.Vector3,X={get tris(){return U.length/3},push(h,w,g,H=0,S=1){return c.push(V.clone()),M.compose(E.set(h,w,g),p.setFromAxisAngle(g0,H),Y.set(S,S,S)),V.multiply(M),K.getNormalMatrix(V),X},pop(){return V=c.pop(),K.getNormalMatrix(V),X},world(h,w,g){return r.set(h,w,g).applyMatrix4(V),[r.x,r.y,r.z]},anim(h,w,g,H,S){j=h,r.set(w,g,H).applyMatrix4(V),_=[r.x,r.y,r.z,S]},vert(h,w,g,H,S,$,ne,O,F,N,Q,C,G=0){return r.set(h,w,g).applyMatrix4(V),k.set(H,S,$).applyMatrix3(K).normalize(),o.push(r.x,r.y,r.z),n.push(k.x,k.y,k.z),f.push(ne[0],ne[1],ne[2]),a.push(O,F,N,Q),i.push(C),s&&(e.push(_[0],_[1],_[2],_[3]),m.push(j,G)),W++},tri(h,w,g){U.push(h,w,g)},quad(h,w,g,H,S,$=0,ne={}){const O=[w[0]-h[0],w[1]-h[1],w[2]-h[2]],F=[H[0]-h[0],H[1]-h[1],H[2]-h[2]];let N=O[1]*F[2]-O[2]*F[1],Q=O[2]*F[0]-O[0]*F[2],C=O[0]*F[1]-O[1]*F[0];const G=Math.hypot(N,Q,C)||1;N/=G,Q/=G,C/=G;const J=Math.hypot(O[0],O[1],O[2]),te=Math.hypot(F[0],F[1],F[2]),fe=ne.u0||0,re=ne.v0||0,de=ne.wt||[0,0,0,0],ge=X.vert(h[0],h[1],h[2],N,Q,C,S,fe,re,J,te,$,de[0]),Ve=X.vert(w[0],w[1],w[2],N,Q,C,S,fe+J,re,J,te,$,de[1]),Ge=X.vert(g[0],g[1],g[2],N,Q,C,S,fe+J,re+te,J,te,$,de[2]),Ne=X.vert(H[0],H[1],H[2],N,Q,C,S,fe,re+te,J,te,$,de[3]);U.push(ge,Ve,Ge,ge,Ge,Ne)},box(h,w,g,H,S,$,ne,O=0,F={}){const N=F.tx??F.t??1,Q=F.tz??F.t??1,C=H/2,G=$/2,J=w+S,te=[[h-C,w,g+G],[h+C,w,g+G],[h+C,w,g-G],[h-C,w,g-G]],fe=[[h-C*N,J,g+G*Q],[h+C*N,J,g+G*Q],[h+C*N,J,g-G*Q],[h-C*N,J,g-G*Q]];for(let re=0;re<4;re++){const de=(re+1)%4;X.quad(te[re],te[de],fe[de],fe[re],ne,O,F)}X.quad(fe[0],fe[1],fe[2],fe[3],F.cap||ne,F.capMat??O),F.bottom&&X.quad(te[3],te[2],te[1],te[0],ne,O)},ngon(h,w,g,H,S,$,ne=0,O={}){const F=O.rot??Math.PI/h,N=(C,G,J)=>{const te=F+C/h*Math.PI*2;return[Math.sin(te)*G,J,Math.cos(te)*G]},Q=2*w*Math.sin(Math.PI/h);for(let C=0;C<h;C++)X.quad(N(C,w,H),N(C+1,w,H),N(C+1,g,S),N(C,g,S),$,ne,O.wrap?{u0:C*Q,v0:H}:{});if(O.cap!==!1&&g>.01)for(let C=1;C<h-1;C+=2)X.quad(N(0,g,S),N(C,g,S),N(C+1,g,S),N(Math.min(C+2,h-1),g,S),O.capCol||$,(O.capMat??z)+.5)},lathe(h,w,g,H=0,S={}){const $=h.length,ne=W,O=S.squash||1;for(let F=0;F<$;F++){const N=h[Math.max(0,F-1)],Q=h[Math.min($-1,F+1)];let C=Q[0]-N[0],G=Q[1]-N[1];const J=Math.hypot(C,G)||1;C/=J,G/=J;const te=S.cols?S.cols[F]:g;for(let fe=0;fe<=w;fe++){const re=fe/w*Math.PI*2,de=Math.cos(re),ge=Math.sin(re);X.vert(de*h[F][0],h[F][1],ge*h[F][0]*O,de*G,-C,ge*G,te,re,F/($-1),-1,0,H)}}for(let F=0;F<$-1;F++)for(let N=0;N<w;N++){const Q=ne+F*(w+1)+N,C=Q+1,G=Q+w+1,J=G+1;U.push(C,Q,G,C,G,J)}},archPlate(h,w,g,H,S,$={}){const ne=$.segs||14,O=h/2,F=$.z||0,N=$.shade||Ee(S,.82);for(let Q=0;Q<ne;Q++){const C=-O+Q/ne*h,G=-O+(Q+1)/ne*h,J=Je(C/O,w,g),te=Je(G/O,w,g),fe=X.vert(C,J,F,0,0,1,S,500+C,0,1e4,1e4,z),re=X.vert(G,te,F,0,0,1,S,500+G,0,1e4,1e4,z),de=X.vert(G,H,F,0,0,1,S,500+G,H-te,1e4,1e4,z),ge=X.vert(C,H,F,0,0,1,S,500+C,H-J,1e4,1e4,z);U.push(fe,re,de,fe,de,ge),$.depth&&X.quad([C,J,F],[C,J,F-$.depth],[G,te,F-$.depth],[G,te,F],N,z+.5)}},async toGeometryAsync(h){const w=new y.BufferGeometry,g=(H,S)=>new y.BufferAttribute(new Float32Array(H),S);return w.setAttribute("position",g(o,3)),await h(),w.setAttribute("normal",g(n,3)),await h(),w.setAttribute("color",g(f,3)),await h(),w.setAttribute("aUv",g(a,4)),await h(),w.setAttribute("aMat",g(i,1)),await h(),s&&(w.setAttribute("aAnim",g(e,4)),await h(),w.setAttribute("aK",g(m,2)),await h()),w.setIndex(W>65535?new y.BufferAttribute(new Uint32Array(U),1):new y.BufferAttribute(new Uint16Array(U),1)),await h(),w.computeBoundingSphere(),w},toGeometry(){const h=new y.BufferGeometry,w=(g,H)=>new y.BufferAttribute(new Float32Array(g),H);return h.setAttribute("position",w(o,3)),h.setAttribute("normal",w(n,3)),h.setAttribute("color",w(f,3)),h.setAttribute("aUv",w(a,4)),h.setAttribute("aMat",w(i,1)),s&&(h.setAttribute("aAnim",w(e,4)),h.setAttribute("aK",w(m,2))),h.setIndex(W>65535?new y.BufferAttribute(new Uint32Array(U),1):new y.BufferAttribute(new Uint16Array(U),1)),h.computeBoundingSphere(),h}};return X}const n0="float behindFront(float x) { return (uFrontX - x) * uSide; }",je={reach:16,nod:.25,slant:.45},Qe=`
attribute vec4 aUv; attribute float aMat;
#ifdef CLOTH
attribute vec4 aAnim; attribute vec2 aK; uniform float uWindX, uSide, uFrontX, uFrontRun;
${n0}
#endif
uniform float uTime; uniform vec3 uCamL;
varying vec3 vP, vN, vC, vV; varying vec4 vUv; varying float vMat, vFold;
#include <fog_pars_vertex>
void main() {
  vec3 p = position, n = normal; vFold = 0.;
  #ifdef CLOTH
  float wet = smoothstep(-14., 14., (uWindX - aAnim.x) * uSide), g = mix(1., 2.4, wet), ph = aAnim.w, k = aK.x, w = aK.y;
  vec3 r = p - aAnim.xyz;
  if (k < 1.5) {            // pennant: swings round its pole with the wind line, droops in the calm, cracks in the gust
    float l = r.x, th = mix(2.75 + 0.22 * sin(uTime * 0.8 + ph), 0.14 * sin(uTime * 3.1 + ph), wet) + 0.3 * sin(wet * 3.14159) * sin(uTime * 9. + ph);
    float arg = l * 2.4 - uTime * (4.5 + 7. * wet) + ph, wave = sin(arg) * (0.09 + 0.15 * wet) * l * 0.5;
    vec3 d = vec3(cos(th) * uSide, 0., sin(th)), s = vec3(-sin(th), 0., cos(th) * uSide);
    p = aAnim.xyz + d * l + vec3(0., r.y - mix(0.45, 0.05, wet) * l + wave * 0.3, 0.) + s * wave; n = s; vFold = cos(arg);
  } else if (k < 2.5) {     // awning: billows, harder in the gust
    float arg = uTime * 2.1 * g + ph + (p.x + p.z) * 0.7; p.y += (sin(arg) * 0.2 + sin(uTime * 5.3 + ph * 2. + (p.x + p.z) * 2.1) * 0.05 * g) * w * g * 0.6; vFold = cos(arg) * w;
  } else if (k < 3.5) {     // swing: pendulum about its beam; the scarf (w > 0) lags and flutters
    float a = 0.42 * sin(uTime * 1.45 + ph - w * 0.8) * (1. + w * 0.6), c = cos(a), s = sin(a);
    p = aAnim.xyz + vec3(r.x + w * sin(uTime * 3. + r.y * 2.) * 0.15, r.y * c - r.z * s, r.y * s + r.z * c); vFold = w * sin(uTime * 3. + r.y * 4.);
  } else if (k < 5.5) {     // garlands, fringes, saris: sway along the normal
    float arg = uTime * (1.3 + 0.5 * k) * sqrt(g) + ph + (p.x + p.z) * 1.3; p += n * (sin(arg) * 0.2 * w * g); vFold = cos(arg) * step(4.5, k) * w;
  } else if (k < 6.5) {     // peacock train: lies folded behind the bird, rises into a fan and shivers as the eye comes level
    float s = smoothstep(36., 14., abs(aAnim.x - uCamL.x)), len = length(r) + 1e-4;
    vec3 off = normalize(mix(vec3(r.x * 0.15, -0.42 * len, -0.9 * len), r, s) + vec3(0., 1e-5, 0.)) * len;
    off.x += sin(uTime * 24. + ph + r.y * 3.) * 0.03 * len * step(0.7, s); p = aAnim.xyz + off;
  } else if (k < 7.5) {     // oar: beats about its lock every 1.5 s, the blade in the water on the way back
    float sg = aAnim.x < 0. ? -1. : 1., cy = uTime * 4.18879 + ph, sw = 0.5 * sin(cy) * sg, lf = (0.2 * max(0., cos(cy)) + 0.01) * sg;
    float c = cos(sw), s = sin(sw); vec3 q = vec3(r.x * c + r.z * s, r.y, -r.x * s + r.z * c);
    c = cos(lf); s = sin(lf); p = aAnim.xyz + vec3(q.x * c - q.y * s, q.x * s + q.y * c, q.z);
  } else if (k < 8.5) {     // comma splash where a blade goes in: swells and is left behind
    float f = fract((uTime * 4.18879 + ph - 1.5708) / 6.28318), sc = f < 0.45 ? sin(f * 6.98) : 0.;
    p = aAnim.xyz + r * sc + vec3(0., 0., f * 2.4);
  } else if (k < 9.5) {     // lotus pad or flower: rocks, flips pale side up as the wind line crosses it, bounces under the rain
    float fl = sin(wet * 3.14159) * 2.7 * w + 0.07 * sin(uTime * 1.7 + ph), c = cos(fl), s = sin(fl);
    float rainy = step(0., (uWindX - aAnim.x) * uSide - 60.);
    p = aAnim.xyz + vec3(r.x, r.y * c - r.z * s, r.y * s + r.z * c) + vec3(0., abs(sin(uTime * 8. + ph * 3.)) * 0.11 * rainy + 0.25 * sin(wet * 3.14159) * w, 0.);
  } else if (k < 10.5) {    // parasol: twirls, then tilts and is drawn in under the roof as the rain arrives
    float t = smoothstep(-70., 10., (uWindX - aAnim.x) * uSide - 60.), a = 0.12 * sin(uTime * 0.9 + ph) + 1.0 * t, c = cos(a), s = sin(a);
    p = aAnim.xyz + vec3(r.x * c - r.y * s, r.x * s + r.y * c, r.z) * (1. - 0.85 * t) - vec3(0., 3.2 * t, 0.);
  } else if (k < 11.5) {    // shelduck: paddles off to the side as the prow comes up
    float fl = smoothstep(75., 12., aAnim.x - uCamL.x) * step(-30., aAnim.x - uCamL.x);
    p += vec3(fl * 5., sin(uTime * 3.3 + ph) * 0.05, (ph > 3.14159 ? 1. : -1.) * fl * 9.) + vec3(sin(uTime * 0.6 + ph) * 0.5, 0., 0.);
  } else if (k < 12.5) {    // frog: one leap off its pad when the rain reaches it
    float t = clamp(((uWindX - aAnim.x) * uSide - 60.) / 22., 0., 1.);
    p = aAnim.xyz + r * step(t, 0.995) + vec3(cos(ph) * 2.6 * t, 5.2 * t * (1. - t), sin(ph) * 2.6 * t);
  } else if (k < 13.5) {    // far boat: rows slowly back and forth across the page, further at page scale
    float sc = 1. + max(aAnim.x - 300., 0.) / 600.; p += vec3(0., sin(uTime * 1.3 + ph) * 0.12 * sc, 55. * sc * sin(uTime * 0.07 + ph));
  } else if (k < 14.5) {    // langur: runs along the cornice for cover when the wind line passes
    float t = clamp(((uWindX - aAnim.x) * uSide) / 240., 0., 1.);
    p += vec3((ph > 3.14159 ? 1. : -1.) * 46. * t, abs(sin(t * 70. + ph)) * 0.6 * step(0.001, t) * step(t, 0.999), 0.);
  } else if (k < 15.5) {    // near boat: rows to and fro along the line of travel (never across it: the lake crossing runs 0.45 across per metre up the page), nodding on each stroke
    float cy = uTime * 2.1 + ph, m = ${je.reach.toFixed(1)} * sin(uTime * 0.06 + ph) + ${je.nod} * sin(cy); p += vec3(m, 0.05 * sin(cy), ${je.slant} * m);
  } else {                  // rain-dancing peacock (16: its train, 17: its body)
    // It dances when the rain has reached ITS OWN place. RIDING, named: the fan's rise s reads the front at the bird's own pivot by
    // behindFront(), the one function live's niche lamps and eave drips call; it rises over one second of the front's travel
    // (uFrontRun, which the world sets from its own two numbers, the front's run a share of the flight over the flight's seconds).
    // The rise reads nothing of the eye and nothing of the share of the flight. The slow turn on its feet and the fan's shiver run
    // on the clock (uTime), rate and phase from each bird's own drawn phase. Before the rain the train trails closed along the wall
    // beside the bird.
    float s = smoothstep(0., uFrontRun, behindFront(aAnim.x)), a = 0.22 * s * sin(uTime * (0.35 + 0.2 * fract(ph * 1.618)) + ph * 2.3), c = cos(a), sn = sin(a);
    vec3 off = r;
    if (k < 16.5) {
      float len = length(r) + 1e-4; vec3 nh = normalize(vec3(n.x, 0., n.z) + vec3(0., 0., 1e-5)), th = vec3(nh.z, 0., -nh.x);
      off = normalize(mix(th * (0.97 * len) + vec3(0., 0.03 * len + 0.12 * r.y + 1e-5, 0.), r, s)) * len;
      off += th * (sin(uTime * 24. + ph + r.y * 3.) * 0.03 * len * step(0.7, s));
    }
    p = aAnim.xyz + vec3(off.x * c + off.z * sn, off.y, -off.x * sn + off.z * c); n = vec3(n.x * c + n.z * sn, n.y, -n.x * sn + n.z * c);
  }
  #endif
  vP = p; vN = n; vC = color; vUv = aUv; vMat = aMat; vV = uCamL - p;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,e0=`
uniform vec3 uKey, uCool, uUmber, uGold, uInk, uVerm, uYellow, uPearl, uRows, uWash;
uniform float uTime, uFrontX, uLamp, uSide, uLampAll;
${n0}
varying vec3 vP, vN, vC, vV; varying vec4 vUv; varying float vMat, vFold;
#include <fog_pars_fragment>
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float cusp(vec2 q, float hw, float spring, float rise) {
  float s = clamp(abs(q.x) / hw, 0., 1.);
  float top = spring + rise * sqrt(max(1. - s * s, 0.)) * (1. - 0.16 * (1. - abs(cos(9.42478 * s)))) + rise * 0.22 * max(0., 1. - 5. * s);
  return min(min(hw - abs(q.x), q.y), top - q.y);
}
float aaLine(float d, float fw) { return 1. - smoothstep(0.7 * fw, 1.5 * fw, abs(d)); }
// A rain streak on a wall: dx metres across from its middle, d metres below its head, w0 wide at the head, L long. ONE FLAT TINT over the
// whole mark (this page has no gradients): only its shape tapers, to half its width at the foot; head and foot are hard. fx, fy: the
// pixel's footprint along and up the wall (the streak is box-filtered across over fx, its head and its foot are eased over fy and over
// nothing more), so it is drawn as the thing at every distance.
float streak(float dx, float d, float w0, float L, float fx, float fy) {
  float t = clamp(d / L, 0., 1.), hw = 0.5 * w0 * (1. - 0.5 * t);
  float cov = clamp((min(dx + 0.5 * fx, hw) - max(dx - 0.5 * fx, -hw)) / fx, 0., 1.);
  return cov * smoothstep(0., fy, d) * smoothstep(0., fy, L - d);
}
void main() {
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(vV + vec3(0., 1e-5, 0.));
  float id = floor(vMat + 0.25), line = 0., glow = 0.;
  bool edges = fract(vMat + 0.25) < 0.5, smoothS = vUv.z < 0.;
  vec3 col = vC; vec2 uv = vUv.xy, fw = max(fwidth(uv), vec2(1e-5));
  if (id == 1. || id == 7.) {                       // marble wall: rain streaks, repair patches, course lines, cusped lamp niches (7: a pier, one niche centred on its face)
    float wu = vP.x * N.z - vP.z * N.x, ff = max(fwidth(wu), fwidth(vP.y)) + 1e-5, fx = fwidth(wu) + 1e-5, fy = fwidth(vP.y) + 1e-5;
    bool pier = id == 7., upright = abs(N.y) < 0.5;
    // the niche cell this fragment lies in: its number and the metres across from its middle (a pier's one cell is centred on its face)
    float ncell = floor(wu / 2.6667), nq = (fract(wu / 2.6667) - 0.5) * 2.6667;
    if (pier) { nq = uv.x - 0.5 * vUv.z; ncell = floor((wu - nq) / 2.6667); }
    // rain streaks: one under a course line in 45 of 100 of the wall's 0.9 m columns, one under half the niche sills at a foot of the opening
    if (upright) {
      float kc = ceil((vP.y - 1.875) / 3.75), cc = floor(wu / 0.9), st = 0.; vec2 hc = vec2(cc, kc);
      if (hash(hc + 31.) > 0.55) st = streak(wu - (cc + 0.5 + (hash(hc + 7.3) - 0.5) * 0.5) * 0.9, 1.875 + 3.75 * kc - vP.y, 0.15 + 0.3 * hash(hc + 13.1), 1.2 + 2. * hash(hc + 19.7), fx, fy);
      vec3 ds = uRows + 0.03 - vP.y; float d2 = -1., rw = 0.;
      if (ds.x > 0. && ds.x < 2.) d2 = ds.x; else if (ds.y > 0. && ds.y < 2.) { d2 = ds.y; rw = 1.; } else if (ds.z > 0. && ds.z < 2.) { d2 = ds.z; rw = 2.; }
      if (pier && (rw > 0.5 || vUv.z < 2.5)) d2 = -1.;
      vec2 hn = vec2(ncell, rw * 5. + 2.);
      if (d2 > 0. && hash(hn) > 0.5) st = max(st, streak(nq - (hash(hn + 3.7) > 0.5 ? 0.62 : -0.62), d2, 0.15 + 0.2 * hash(hn + 5.9), 0.8 + 1.2 * hash(hn + 8.3), fx, fy));
      col *= mix(vec3(1.), vec3(0.9, 0.925, 0.95), st * (1. - smoothstep(0.3, 0.6, fx)));
    }
    // repair patches: the old cells and tone, the step eased over the pixel's footprint, a ruled hairline round each (the neighbour cell
    // across the nearest edge is asked whether it is a patch too, so the line is drawn from both sides and not between two patches)
    vec2 pc = vec2(wu / 5.3, vP.y / 3.1), pi = floor(pc), pf = fract(pc), pn = pi + vec2(pf.x > 0.5 ? 1. : -1., pf.y > 0.5 ? 1. : -1.);
    float p0 = step(0.94, hash(pi + vec2(0., 9.))), pX = step(0.94, hash(vec2(pn.x, pi.y + 9.))), pY = step(0.94, hash(vec2(pi.x, pn.y + 9.)));
    float dX = min(pf.x, 1. - pf.x) * 5.3, dY = min(pf.y, 1. - pf.y) * 3.1, eX = smoothstep(-0.5 * fx, 0.5 * fx, dX), eY = smoothstep(-0.5 * fy, 0.5 * fy, dY);
    float pcov = p0 > 0.5 ? mix(eX, 1., pX) * mix(eY, 1., pY) : max(pX * (1. - eX), pY * (1. - eY));
    col *= mix(vec3(1.), vec3(1., 0.965, 0.9), pcov);
    if (upright) line = max(line, 0.4 * max(abs(p0 - pX) * aaLine(dX, fx), abs(p0 - pY) * aaLine(dY, fy)));
    line = max(line, 0.3 * aaLine(fract(vP.y / 3.75) - 0.5, ff / 3.75) * step(abs(N.y), 0.5));
    vec3 dr = vP.y - uRows; float ry = -1.;
    if (dr.x > 0. && dr.x < 1.9) ry = dr.x; else if (dr.y > 0. && dr.y < 1.9) ry = dr.y; else if (dr.z > 0. && dr.z < 1.9) ry = dr.z;
    if (pier && (dr.x <= 0. || dr.x >= 1.9 || vUv.z < 2.5)) ry = -1.;
    if (ry >= 0. && abs(N.y) < 0.5) {
      float cell = ncell; vec2 q = vec2(nq, ry - 0.12);
      float f = cusp(q, 0.62, 0.8, 0.62), inside = smoothstep(-0.5 * ff, 0.5 * ff, f);
      col = mix(col, uInk, inside); line = max(line, aaLine(f, ff));
      line = max(line, 0.4 * aaLine(min(ry - 0.03, 1.87 - ry), ff));
      float loz = 0.13 - abs(abs(q.x) - 1.3333) - abs(q.y - 0.72) * 0.7; col = mix(col, uVerm, smoothstep(-0.5 * ff, 0.5 * ff, loz) * 0.85);
      float lit = max(step(4. + hash(vec2(cell, floor(vP.y))) * 20., behindFront(vP.x)), step(hash(vec2(cell, floor(vP.y) + 3.)), uLampAll)) * uLamp, big = 1. + clamp(ff * 9., 0., 2.2);
      vec2 fp = (q - vec2(0., 0.14)) / big;
      if (abs(fp.x) < 0.17 && abs(fp.y) < 0.035) col = mix(col, uGold * 0.7, inside);
      float lean = 0.12 * sin(uTime * 7. + cell * 1.7) + 0.06, tl = (fp.y - 0.04) / 0.42;
      if (tl > 0. && tl < 1. && lit > 0.5) {
        float hwid = 0.286 * sqrt(tl) * (1. - tl) * (0.9 + 0.1 * sin(uTime * 13. + cell)), fl = hwid - abs(fp.x - lean * tl * tl * 0.5);
        if (fl > 0.) { col = fl > 0.45 * hwid ? uGold * 3.2 : uVerm; glow = 1.; line = 0.; }
      }
    }
  } else if (id == 2.) {                            // pierced jali screen
    vec2 q = uv / 0.4, fq = max(fwidth(q), vec2(1e-5)), c = fract(q) - 0.5; float fm = max(fq.x, fq.y), fade = 1. - smoothstep(0.25, 0.6, fm);
    float alt = mod(floor(q.x) + floor(q.y), 2.), hole = mix(length(c) - 0.31, abs(c.x) + abs(c.y) - 0.37, alt);
    float border = step(0.17, min(min(uv.x, vUv.z - uv.x), min(uv.y, vUv.w - uv.y)));
    col = mix(col, uInk, mix(0.4, 1. - smoothstep(-fm, fm, hole), fade) * border); line = max(line, 0.5 * aaLine(hole, fm) * fade * border);
  } else if (id == 3.) {                            // lotus-petal moulding
    float h = vUv.w, s = abs(fract(uv.x / 0.8) - 0.5) * 2., pt = h * (0.95 - 0.75 * s * s), fl = fw.y + fw.x * h * 1.5;
    col = mix(mix(col, uVerm, 0.7), col, smoothstep(-fl, fl, pt - uv.y));
    line = max(line, aaLine(pt - uv.y, fl)); line = max(line, 0.45 * aaLine(pt * 0.55 - uv.y, fl) * step(s, 0.6));
  } else if (id == 4.) {                            // gold leaf: the only thing above 1.0, with a leaf shimmer that follows the eye
    float hsh = hash(floor(vP.xy * 40. + vP.z * 23.)), s = 0.5 + 0.5 * sin(dot(V, vec3(13., 7., 11.)) * 5. + hsh * 6.283 + uTime * 1.3);
    col = mix(uGold, vec3(1.0, 0.9, 0.55), 0.6 * s * s * s) * 1.12; glow = 1.;
    if (!smoothS) {                                 // an umber hairline round gold beams wide enough to carry one
      vec2 gd = min(uv, vUv.zw - uv) / fw; float gs = min(vUv.z / fw.x, vUv.w / fw.y);
      col = mix(col, uUmber, 0.4 * (1. - smoothstep(0.65, 1.45, min(gd.x, gd.y))) * clamp((gs - 6.) / 3., 0., 1.));
    }
  } else if (id == 5.) {                            // kangura parapet
    float h = vUv.w, s = abs(fract(uv.x / 1.25) - 0.5) * 2., top = h * (0.42 + 0.58 * sqrt(max(1. - s * s * 1.2, 0.)));
    if (uv.y > top) discard;
    line = max(line, aaLine(top - uv.y, fw.y + fw.x * 1.5));
  } else if (id == 6.) {                            // striped cloth
    float sx = uv.x / 0.55, st = smoothstep(0.5 - fw.x * 2., 0.5 + fw.x * 2., abs(fract(sx) - 0.5) * 2.);
    col = mix(col, uYellow, st * 0.9); if (vFold > 0.25) col *= uCool;
  } else if (id == 8.) {                            // chequered marble paving
    vec2 q = vP.xz / 2.5; float fq = max(fwidth(q.x), fwidth(q.y)), ch = mod(floor(q.x) + floor(q.y), 2.);
    col *= mix(vec3(1.), vec3(0.86, 0.89, 0.94), mix(0.5, ch, 1. - smoothstep(0.2, 0.6, fq)));
  } else if (id == 9.) {                            // dome: gores and a lotus collar
    float gr = abs(sin(uv.x * 8.)), yb = 0.82 + 0.07 * gr, fy = max(fwidth(uv.y), 1e-5);
    line = max(line, 0.45 * aaLine(gr, max(fwidth(gr), 1e-4)) * step(uv.y, yb));
    col = mix(col, mix(col, uVerm, 0.45), smoothstep(-fy, fy, uv.y - yb)); line = max(line, aaLine(uv.y - yb, fy)); line = max(line, 0.6 * aaLine(uv.y - 0.07, fy));
  } else if (id == 10. || id == 12.) {              // dotted water: fountain arcs, and eave drips once the front has passed
    if (fract(uv.y / 0.9 - uTime * 2.4 + hash(vec2(vUv.w, 2.))) > 0.5) discard;
    if (id == 12. && behindFront(vP.x) < 3.) discard;
    col = uPearl; glow = 1.;
  } else if (id == 11.) {                           // marigold garland beads
    float b = floor(uv.x / 0.28); col = mod(b, 3.) < 1. ? uVerm : col; line = max(line, 0.5 * aaLine(fract(uv.x / 0.28) - 0.5, fw.x / 0.28 * 0.8));
  } else if (id == 14.) {                           // peacock feather: gold-ringed indigo eye, a rachis line
    float d = length((uv - vec2(vUv.z * 0.5, vUv.w * 0.8)) / vec2(vUv.z * 0.42, vUv.w * 0.15));
    if (d < 1.) col = d < 0.5 ? uInk : uGold * 0.9;
    line = max(line, 0.5 * aaLine(uv.x - vUv.z * 0.5, fw.x));
  } else if (id == 15.) {                           // far house: a white cube with a few dark windows and a door
    float rows = clamp(floor(vUv.w / max(vUv.z, 1e-3) * 2.2 + 0.5), 1., 4.), ch = vUv.w / rows, cols = max(1., floor(vUv.z / ch + 0.5));
    vec2 q = vec2(uv.x / vUv.z * cols, uv.y / ch), c = fract(q) - vec2(0.5, 0.45), fq = max(fwidth(q), vec2(1e-5));
    float hh = hash(floor(q) + floor(vP.xz * 0.02)), wd = max(abs(c.x) - 0.16, abs(c.y) - 0.24 + 0.1 * step(0.6, hh));
    if (abs(N.y) < 0.5 && hh > 0.22) { col = mix(col, hh > 0.9 ? uVerm : uInk, 1. - smoothstep(-fq.y, fq.y, wd)); }
    line = max(line, 0.35 * aaLine(fract(q.y) - 0.02, fq.y) * step(abs(N.y), 0.5));
  } else if (id == 17.) {                           // painted ground and hills: rows of darker tufts
    vec2 q = uv / vUv.z; q.x += 0.5 * mod(floor(q.y), 2.); vec2 c = fract(q) - 0.5; float fq = max(max(fwidth(q.x), fwidth(q.y)), 1e-4);
    float tuft = (1. - smoothstep(0.2, 0.2 + fq * 1.5, length(c * vec2(1., 1.7)))) * (1. - smoothstep(0.3, 0.8, fq));
    col *= mix(1., 0.78, tuft * step(0.25, hash(floor(q))));
  } else if (id == 18.) {                           // lotus pad: a notched disc, pale underneath
    vec2 c = uv / max(vUv.zw, vec2(1e-4)) - 0.5; float r = length(c), fr = max(fwidth(r), 1e-4);
    if (r > 0.5 || (c.x > 0.03 && abs(c.y) < c.x * 0.22)) discard;
    if (!gl_FrontFacing) col = mix(col, uPearl, 0.62);
    line = max(line, aaLine(r - 0.48, fr)); line = max(line, 0.35 * aaLine(abs(c.y) - abs(c.x) * 0.9, fr) * step(r, 0.4));
  } else if (id == 19.) {                           // lotus flower: a fan of pink petals
    vec2 c = vec2(uv.x / max(vUv.z, 1e-4) - 0.5, uv.y / max(vUv.w, 1e-4)); float r = length(c), a = atan(c.x, c.y + 1e-4), fr = max(fwidth(r), 1e-4);
    float edge = 0.5 + 0.45 * abs(cos(a * 2.6)); if (r > edge) discard;
    col = mix(mix(uVerm, uPearl, 0.5), uPearl, smoothstep(0.35, 0.95, r)); line = max(line, 0.8 * aaLine(r - edge + fr, fr));
  } else if (id == 20.) {                           // canopy valance: scalloped lower edge with a gold band
    float s = abs(fract(uv.x / 0.8) - 0.5) * 2., low = 0.42 * (1. - sqrt(max(1. - s * s, 0.)));
    if (uv.y < low) discard;
    if (uv.y < low + 0.09) { col = uGold * 1.12; glow = 1.; } else line = max(line, aaLine(uv.y - low - 0.13, fw.y));
  } else if (id == 13.) {                           // painted foliage: darker leaf rosettes
    vec2 q = vec2(uv.x * 2.9, uv.y * 7.); q.x += 0.5 * mod(floor(q.y), 2.); vec2 c = fract(q) - 0.5; float fq = max(fwidth(uv.y) * 7., 1e-4);
    col *= mix(1., 0.66, (1. - smoothstep(0.26, 0.26 + fq, length(c))) * (1. - smoothstep(0.25, 0.7, fq)));
  }
  if (id != 6. && vFold > 0.25) col *= uCool;       // drawn folds in cloth
  if (smoothS) {
    float ndv = abs(dot(N, V)), fn = max(fwidth(ndv), 1e-4);
    line = max(line, (1. - smoothstep(0.9, 1.9, ndv / fn)) * (1. - smoothstep(0.25, 0.6, fn)));
  } else if (edges) {
    vec2 d2 = min(uv, vUv.zw - uv) / fw; float sz = min(vUv.z / fw.x, vUv.w / fw.y);
    line = max(line, (1. - smoothstep(0.65, 1.45, min(d2.x, d2.y))) * clamp((sz - 2.) / 3., 0., 1.));
  }
  if (glow < 0.5) {
    col = mix(col * uCool, col, step(0., dot(N, uKey)));                   // one hard cool step, no gradient
    col *= 0.975 + 0.04 * hash(floor(gl_FragCoord.xy * 0.5));               // paper tooth
    col = mix(col, uUmber, line * 0.9) * uWash;
  }
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,s0=`varying vec3 vP;
#include <fog_pars_vertex>
void main() { vP = position; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,l0=`
uniform vec3 uSlate, uLake, uLakeHi, uIndigo, uPearl, uCamL, uWash, uVerm, uYellow, uInk, uRBc[22], uRBh[22], uRBk[22];
uniform vec3 uFwd; uniform float uTime, uFrontX, uWindX, uSide, uPx, uRefl, uReflWet;
varying vec3 vP;
#include <fog_pars_fragment>
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float sdSeg(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0., 1.)); }
// THE PAINTED MIRROR: what a ray leaving the water at o along d (d.y > 0) meets, as one flat colour: the island palace and the boxes the
// world hands over (gate, kiosks, garden island, pavilion, court walls, the portal). w says how thickly it is dabbed (0: nothing there, the
// water keeps its own colour); the foot of a thing is mirrored thickly and its top thinly, so a reflection thins out toward the eye.
vec3 mirror(vec3 o, vec3 d, out float w) {
  vec3 ds = d + (1. - step(1e-5, abs(d))) * 1e-5, c = uLake; w = 0.;
  float tb = 1e9, pw = 0.; vec3 kb = vec3(0.);
  for (int i = 0; i < 22; i++) {
    vec3 t1 = (uRBc[i] - uRBh[i] - o) / ds, t2 = (uRBc[i] + uRBh[i] - o) / ds, lo = min(t1, t2), hi = max(t1, t2);
    float tn = max(max(lo.x, lo.y), lo.z), tx = min(min(hi.x, hi.y), hi.z);
    if (uRBh[i].x > 0. && tx > max(tn, 0.) && tn < tb) { tb = max(tn, 0.); kb = uRBk[i]; pw = 0.92 * (1. - 0.45 * clamp((o.y + d.y * tb) / max(2. * uRBh[i].y, 0.1), 0., 1.)); }
  }
  vec3 t1 = (vec3(-80., 0., -80.) - o) / ds, t2 = (vec3(80., 27.5, 80.) - o) / ds, lo = min(t1, t2), hi = max(t1, t2);
  float tn = max(max(lo.x, lo.y), lo.z), tx = min(min(hi.x, hi.y), hi.z);
  if (tx > max(tn, 0.) && tn < tb) {      // the island palace: marble, its niche rows as ink dabs, blinds and awnings as vermilion and saffron flecks
    vec3 hp = o + d * max(tn, 0.), dr = hp.y - vec3(4.3, 13.6, 22.6); float wu = (abs(abs(hp.x) - 80.) < 0.5 ? hp.z : hp.x) / 2.6667, hh = hash(vec2(floor(wu), floor(hp.y / 3.)));
    bool row = (dr.x > 0.2 && dr.x < 1.7) || (dr.y > 0.2 && dr.y < 1.7) || (dr.z > 0.2 && dr.z < 1.7);
    tb = max(tn, 0.); kb = row && abs(fract(wu) - 0.5) < 0.25 ? uInk : hh > 0.84 && hp.y > 6. && hp.y < 21. ? (hh > 0.92 ? uVerm : uYellow) : uPearl; pw = 0.94 * (1. - 0.55 * clamp(hp.y / 27.5, 0., 1.));
  }
  if (tb < 1e8) { c = kb; w = pw; }
  return c;
}
float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y); }
float weave(vec2 q, vec2 fq) {
  vec2 f = fract(q); float fl = fq.y * 3.; if (mod(floor(q.x) + floor(q.y), 2.) > 0.5) { f = f.yx; fl = fq.x * 3.; }
  return (1. - smoothstep(0.35 * fl, 0.95 * fl, abs(fract(f.y * 3.) - 0.5))) * step(0.1, f.x) * step(f.x, 0.9) * (1. - smoothstep(0.22, 0.45, fl));
}
void main() {
  vec2 p = vP.xz; float behind = (uFrontX - p.x) * uSide, wet = step(0., behind), wind = smoothstep(-16., 16., (uWindX - p.x) * uSide);
  float kd = 1. + length(vP - uCamL) / 170.;                                   // far features drawn larger so they survive
  float band = wet * step(behind, (52. + 7. * abs(sin(p.y * 0.21))) * min(kd, 4.));
  // the water itself: a flat jade-teal with broad drifting pools of a deeper tone (two flat tones, one hard edge)
  float pn = vnoise(p / vec2(34., 21.) + vec2(uTime * 0.013, 0.)) + 0.5 * vnoise(p / vec2(13., 8.) - vec2(0., uTime * 0.02)), pf = max(fwidth(pn), 1e-4);
  vec3 col = mix(uLake, uLakeHi, smoothstep(-pf, pf, pn - 0.9));
  col = mix(col, uLake * 0.6 + uIndigo * 0.25, band);
  // basket-weave ripple lines: blocks of three strokes, alternately along and across; tighter and faster behind the wind line
  vec2 q = p / mix(5.2, 2.9, step(0.5, wind)) + vec2(uTime * 0.11, uTime * 0.05) * (1. + 2.5 * wind);
  vec2 fq2 = fwidth(q), jx = dFdx(q), jy = dFdy(q); float fq = 2. * sqrt(abs(jx.x * jy.y - jx.y * jy.x) + 1e-12), lod = max(log2(fq * 30.), -1.), l0 = exp2(floor(lod));   // re-ruled by footprint; lines too close to rule fade
  float wl = mix(weave(q / l0, fq2 / l0), weave(q / (l0 * 2.), fq2 / (l0 * 2.)), fract(lod));
  // the painted mirror: level rows of lens-shaped strokes (the rows are ruled across the line of travel and grow toward the eye), each row
  // slipped sideways by the ripples. A stroke is ONE flat colour, taken where the mirrored ray from its middle lands, so it tapers at both
  // ends and is never cut; strokes lie only under the things they mirror. Calm water carries them thickly, the wind line chops them and the
  // rain thins them. Far off, where a row is thinner than two pixels, the mirror is one thin wash.
  vec3 vd = vP - uCamL; float hl = length(vd.xz) + 1e-4, el = atan(-vd.y, hl);
  if (el > 0.002 && vP.y < 0.3 && uRefl > 0.) {
    // a row is never thinner than about three pixels where the palace stands, whatever the size of the picture
    float hgt = max(-vd.y, 1e-3), k = clamp(0.6 * sqrt(max(uPx, 1e-6)), 0.018, 0.03), kk = 2. * k * k, g = sqrt(atan(hgt, max(dot(vd.xz, uFwd.xz), 0.05))) / k, ri = floor(g), fr = fract(g), ppr = kk * max(g, 0.5) / max(uPx, 1e-6), hr = hash(vec2(ri, 3.7));
    float az = atan(vd.z, vd.x + (abs(vd.x) + abs(vd.z) < 1e-5 ? 1e-5 : 0.)), wa = kk * (ri + 0.5) * 9.;
    float slip = hr * 37. + 0.3 * sin(uTime * (0.5 + hr) + hr * 40.) * (1. + wind), qx = az / wa + slip, cj = floor(qx), fx = fract(qx);
    float h2 = hash(vec2(cj, ri)), h3 = hash(vec2(cj + 17., ri + 5.)), lens = 0.;
    float azc = (cj + 0.5 - slip) * wa, thc = min(k * (ri + 0.5) * k * (ri + 0.5), 1.5), wgt = 0.;
    vec2 dc = vec2(cos(azc), sin(azc)); float hlc = hgt / max(tan(thc), 1e-4) / max(dot(dc, uFwd.xz), 0.05);
    vec3 rc = mirror(vec3(uCamL.x + dc.x * hlc, 0., uCamL.z + dc.y * hlc), normalize(vec3(dc.x * hlc, hgt, dc.y * hlc)), wgt);
    // a stroke is a thin lens, shorter the higher up its thing the mirrored ray lands (a reflection tapers toward the eye)
    float ln = 0.5 + 0.55 * wgt; lens = 1. - (2. * fx - 1.) * (2. * fx - 1.) / (ln * ln);
    float dd = (0.17 + 0.09 * h2) * sqrt(max(lens, 0.)) - abs(fr - 0.5), dab = smoothstep(-0.5 / ppr, 0.5 / ppr, dd) * step(0., lens);
    float cover = wgt * (1. - 0.3 * wind) * (1. - uReflWet * wet) * (1. - 0.75 * smoothstep(0.1, 0.4, el)) * uRefl, m = mix(cover * 0.45, dab * step(h3, cover), smoothstep(1.4, 2.6, ppr));
    col = mix(col, mix(rc, uLake, 0.46), m * 0.92);
  }
  col = mix(col, mix(uLake, uPearl, 0.34), wl * 0.62);
  // rings where the drops land: every cell under the band, some of them behind it
  vec2 rq = p / 3.4; float fr = fwidth(rq.x) + fwidth(rq.y); vec2 rc = floor(rq), rf = fract(rq) - 0.5; float h = hash(rc), ph = fract(uTime * 0.9 + h * 7.);
  rf -= (vec2(hash(rc + 1.3), hash(rc + 2.7)) - 0.5) * 0.36;
  float ring = (1. - smoothstep(0.5 * fr, 1.1 * fr, abs(length(rf) - (0.07 + 0.3 * ph)))) * step(ph, 0.8) * step(0.45 - band, h) * wet, rfade = 1. - smoothstep(0.12, 0.3, fr);
  col = mix(col, uPearl, ring * rfade + (1. - rfade) * wet * 0.1);
  // scalloped spray line at the foot of the front, and a row of thrown drops ahead of it
  float a = -behind / kd, sc = abs(sin(p.y * 3.14159 / (7. * kd)));
  float spray = step(-1.5, a) * step(a, 0.5 + 3.2 * sc);
  vec2 dq = vec2(a - 5.2, mod(p.y / kd, 3.5) - 1.75); spray = max(spray, step(length(dq), 0.5));
  col = mix(col, uPearl, spray);
  col *= (0.975 + 0.04 * hash(floor(gl_FragCoord.xy * 0.5))) * uWash;
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,q0=`
attribute vec2 aS; uniform vec3 uCamL; uniform float uFrontX, uSide, uLift, uTop; varying vec3 vP; varying vec2 vH; varying float vWall, vCs;
#include <fog_pars_vertex>
void main() {
  vec3 p; float y = position.y * uTop;
  if (aS.x < 0.5) { p = vec3(uFrontX - aS.y * uSide, y + uLift, (position.x * 2. - 1.) * 1100.); vH = vec2(p.z, y); }
  else { p = vec3(uFrontX - position.x * 1700. * uSide, y, aS.y); vH = vec2(p.x * uSide, y); }
  vWall = aS.x < 0.5 && aS.y < 1. ? 1. : 0.; vCs = aS.x > 1.5 ? 0.5 : mix(1., 0.72, vWall);
  // far off the front is ONE ruled wall: the cards behind it and the cards along the line only stand once it is within 600 m
  if (vWall < 0.5 && (uCamL.x - uFrontX) * uSide > 600.) p = vec3(uCamL.x, -900., uCamL.z);
  vP = p;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,k0=`
uniform vec3 uPearl, uSlate, uCamL; uniform float uTime, uTop; varying vec3 vP; varying vec2 vH; varying float vWall, vCs;
#include <fog_pars_fragment>
void main() {
  // ruled rows of slanted strokes, re-ruled by distance: each doubling keeps every other row and column and lets the rest shrink away
  vec2 hv = vec2(vH.x + vH.y * 0.364, vH.y + uTime * 9.); float px = max(fwidth(hv.x), fwidth(hv.y)) + 1e-5;
  // a card seen edge-on would pile its strokes into shards: it is not drawn there at all
  float an = fwidth(hv.x) / max(fwidth(hv.y), 1e-5); if (an > 2.5 || an < 0.4) discard;
  float lod = max(log2(px * 30. / 3.), 0.), l0 = floor(lod), f = lod - l0;      // a cell never narrower than about 30 pixels
  vec2 cs = vec2(3.0, 2.6) * exp2(l0) * vCs, g = hv / cs, i = floor(g), fr = fract(g) - 0.5;
  float keep = step(mod(i.x, 2.), 0.5) * step(mod(i.y, 2.), 0.5), size = mix(1. - f, 1. + f, keep);
  float hw = max(0.8 * px, 0.011) * min(size * 3., 1.), ax = abs(fr.x) * cs.x, ay = abs(fr.y) * cs.y;
  float len = step(ay, 0.2 * cs.y * size) * step(0.02, size) * (1. - smoothstep(0.82 * uTop, uTop, vH.y));
  float a = (1. - smoothstep(hw - 0.5 * px, hw + 0.5 * px, ax)) * len, rim = (1. - smoothstep(1.8 * hw - 0.5 * px, 1.8 * hw + 0.5 * px, ax)) * len;
  if (rim < 0.35) discard;
  gl_FragColor = vec4(a < 0.35 ? mix(uSlate, uPearl, 0.3) : uPearl, 1.);
  #include <fog_fragment>
}`,M0=`
attribute vec3 aCell; uniform vec3 uCamL; uniform float uTime, uFrontX, uPx, uSide, uRainAmt; varying float vX;
#include <fog_pars_vertex>
void main() {
  vec3 box = vec3(54., 36., 54.), base = aCell * vec3(4.5, 4., 4.5);
  base.y -= uTime * 9.; base.x += uTime * 9. * 0.364 * uSide;
  vec3 rel = mod(base - uCamL + box * 0.5, box) - box * 0.5, p = uCamL + rel;
  vec3 axis = vec3(0.342 * uSide, -0.94, 0.), side = normalize(cross(axis, rel) + vec3(1e-5, 0., 0.));
  float dist = length(rel), fade = smoothstep(27., 19., max(abs(rel.x), abs(rel.z))) * smoothstep(18., 13., abs(rel.y));
  float on = step(0., (uFrontX - p.x) * uSide) * step(1.3, p.y) * step(2.5, dist) * step(fract(sin(dot(aCell, vec3(12.9898, 78.233, 37.719))) * 43758.5453), uRainAmt);
  p += axis * (position.y * 1.05 * clamp(dist / 9., 0.3, 1.) * fade * on) + side      // shorter close to the eye: no stroke is drawn much over 60 pixels long
    * (position.x * max(0.016, dist * uPx * 1.3) * on); vX = position.x;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,A0=`uniform vec3 uPearl, uSlate; varying float vX;
#include <fog_pars_fragment>
void main() { gl_FragColor = vec4(abs(vX) > 0.5 ? mix(uSlate, uPearl, 0.3) : uPearl, 1.);   // a slate rim, so a stroke also reads on white marble
  #include <fog_fragment>
}`,i0=`
attribute vec3 aDir; attribute vec2 aT; uniform vec3 uCamL; uniform float uPx, uFade, uWide; varying float vT, vS;
void main() {
  vec3 rel = position - uCamL, side = normalize(cross(aDir, rel) + vec3(0., 1e-5, 0.));
  vec3 p = position + side * (aT.y * max(2.6, length(rel) * uPx * 3.2) * uFade * uWide);
  vT = aT.x; vS = sign(aT.y); gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
}`,f0=`uniform vec3 uGold, uDark; uniform float uDraw, uGlint, uHalo; varying float vT, vS;
void main() { if (vT > uDraw) discard; float g = (vT - uGlint) * 16., e = exp(-g * g);
  gl_FragColor = vec4(mix(uGold * (1.15 + 0.6 * e), uDark, uHalo), 1.); }`,P0="varying vec3 vD; void main() { vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",z0=`
uniform vec3 uGround, uCloud, uEdge, uGold, uCamL, uLake, uWash, uRainSky; uniform float uCloudX, uTime, uSide, uStars, uPx; varying vec3 vD;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main() {
  vec3 d = normalize(vD + vec3(0., 1e-6, 0.)); float dy = max(d.y, 0.012), t = (400. - uCamL.y) / dy;
  // over the far ramp the rain-sky follows the slope of the page, 400 m above it
  float den = dy + 0.2493 * uSide * d.x;
  if (-uSide * (uCamL.x + d.x * t) > 340.) t = den > 0.004 ? (400. + 0.2493 * (-uSide * uCamL.x - 340.) - uCamL.y) / den : 1e5;
  vec2 c = uCamL.xz + d.xz * t; float e = (uCloudX - c.x) * uSide / 230., fe = fwidth(e) + 1e-5;
  // behind the one straight leading edge: a slate-indigo carpet (the indigo herd walks on it and still reads against it), one paler flat
  // tone, then the flat pearl rain-sky.
  // The bands are measured on the picture (e over its own change per pixel, times a pixel's angle), so the carpet is a band about a
  // degree and a half thick wherever the edge stands: far up the page under the herd's feet, or straight overhead
  float ang = max(e, 0.) / fe * uPx, aa = 1.5 * uPx;
  vec3 col = uGround;
  // gold dot stars on a night ground
  vec2 sq = vec2(atan(d.z, d.x + 1e-5) * 9., d.y * 16.), sf = fract(sq) - 0.5; float sh = hash(floor(sq));
  col = mix(col, uGold * 1.6, uStars * step(0.72, sh) * step(length(sf + (vec2(hash(floor(sq) + 2.), hash(floor(sq) + 5.)) - 0.5) * 0.5), 0.05 + 0.03 * sin(uTime * (1. + sh) + sh * 40.)));
  vec3 cl = mix(mix(uCloud, uRainSky, 0.42), mix(uCloud, uRainSky, 0.74), smoothstep(0.026, 0.026 + aa, ang)); cl = mix(cl, uRainSky, smoothstep(0.046, 0.046 + aa, ang));
  if (t > 9e4) cl = uRainSky;
  col = mix(col, cl, smoothstep(-fe, fe, e));
  col = mix(col, uEdge, 1. - smoothstep(0.7 * fe, 1.6 * fe, abs(e)));
  if (d.y < 0.) col = uLake * uWash;      // below the horizon there is only lake: whatever the page does not cover reads as water
  gl_FragColor = vec4(col, 1.);
}`,Ie=[[.86,0],[.98,.14],[1,.32],[.93,.52],[.76,.72],[.52,.9],[.28,1.03],[.1,1.12],[0,1.16]],a0=(s,o)=>s.map(([n,f])=>[n*o,f*o]);function we(s,o,n,f,a,i=z){const e=new y.Vector3(n[0]-o[0],n[1]-o[1],n[2]-o[2]).normalize(),m=new y.Vector3(1,0,0);Math.abs(e.x)>.9&&m.set(0,0,1);const U=new y.Vector3().crossVectors(e,m).normalize().multiplyScalar(f),W=new y.Vector3().crossVectors(e,U).normalize().multiplyScalar(f),V=[[1,1],[-1,1],[-1,-1],[1,-1]].map(([_,j])=>[U.x*_+W.x*j,U.y*_+W.y*j,U.z*_+W.z*j]);for(let _=0;_<4;_++){const j=V[_],K=V[(_+1)%4];s.quad([o[0]+j[0],o[1]+j[1],o[2]+j[2]],[o[0]+K[0],o[1]+K[1],o[2]+K[2]],[n[0]+K[0],n[1]+K[1],n[2]+K[2]],[n[0]+j[0],n[1]+j[1],n[2]+j[2]],a,i+.5)}}function Pe(s,o,n){s.lathe(a0([[.02,0],[.3,.04],[.36,.22],[.22,.4],[.07,.48],[.07,.66],[.17,.78],[.06,.9],[.015,1.2]],n),6,o.gold,pe)}function Me(s,o,n,f=4,a=!0){const i=1.25*n,e=o.marble;s.ngon(f,i*1.3,i*1.24,0,.3*n,e);for(let m=0;m<f;m++){const U=Math.PI/f+m/f*Math.PI*2;if(s.push(Math.sin(U)*i,.3*n,Math.cos(U)*i),s.ngon(6,.12*n,.1*n,0,1.75*n,e,z,{cap:!1}),s.box(0,1.75*n,0,.36*n,.15*n,.36*n,e),s.pop(),a){const W=U+Math.PI/f,V=i*Math.cos(Math.PI/f);s.push(Math.sin(W)*V,.3*n,Math.cos(W)*V,W),s.archPlate(2*i*Math.sin(Math.PI/f)-.2*n,1.3*n,.42*n,1.92*n,e,{segs:f>4?8:10}),s.pop()}}s.ngon(f,i*1.12,i*1.12,2.2*n,2.42*n,e),s.ngon(f,i*1.85,i*1.2,2.34*n,2.62*n,o.marbleB,z,{capCol:e}),s.push(0,2.62*n,0,0,i*.98),s.lathe(Ie,10,e,Re),s.pop(),s.push(0,2.62*n+1.14*i*.98,0),Pe(s,o,.9*n),s.pop()}function Se(s,o,n,f,a){const i=n/2,e=2.7,m=o.marble,U=f-.3,W=7,V=c=>-1.4*(1-c)-.2*Math.sin(6.2832*c)*(1-.3*c),_=1e4;for(const c of[-i+.3,0,i-.3]){for(let r=0;r<W;r++){const k=r/W,p=(r+1)/W,M=U*k,Y=U*p,E=V(k),X=V(p);s.quad([c-.18,E,M],[c+.18,E,M],[c+.18,X,Y],[c-.18,X,Y],o.marbleB,z+.5);for(const h of[-1,1]){const w=c+h*.18,g=s.vert(w,E,M,h,0,0,m,500+M,0,_,_,z),H=s.vert(w,X,Y,h,0,0,m,500+Y,0,_,_,z),S=s.vert(w,0,Y,h,0,0,m,500+Y,-X,_,_,z),$=s.vert(w,0,M,h,0,0,m,500+M,-E,_,_,z);h>0?(s.tri(g,S,H),s.tri(g,$,S)):(s.tri(g,H,S),s.tri(g,S,$))}}s.push(c,-.42,U-.05),s.lathe([[0,0],[.1,.1],[.12,.24],[0,.42]],5,o.gold,pe),s.pop()}s.quad([-i-.15,-.32,f-.22],[i+.15,-.32,f-.22],[i+.15,0,f+.075],[-i-.15,0,f+.075],m,ze+.5),s.box(0,0,f/2,n+.3,.22,f+.15,m),s.quad([-i,.22,f],[i,.22,f],[i,1.1,f],[-i,1.1,f],m,ve),s.quad([i,.22,f],[i,.22,0],[i,1.1,0],[i,1.1,f],m,ve),s.quad([-i,.22,0],[-i,.22,f],[-i,1.1,f],[-i,1.1,0],m,ve);for(const[c,r]of[[-i+.12,f-.12],[i-.12,f-.12],[-i+.12,.15],[i-.12,.15]])s.push(c,.22,r),s.ngon(6,.11,.09,0,e-.22,m,z,{cap:!1}),s.pop();s.push(0,.22,f-.12),s.archPlate(n-.24,1.7,.62,e+.03,m,{segs:12}),s.pop(),s.push(i-.12,.22,f/2,Math.PI/2),s.archPlate(f-.3,1.85,.45,e+.03,m,{segs:8}),s.pop(),s.push(-i+.12,.22,f/2,-Math.PI/2),s.archPlate(f-.3,1.85,.45,e+.03,m,{segs:8}),s.pop(),s.quad([-i+.4,.22,.04],[i-.4,.22,.04],[i-.4,e-.1,.04],[-i+.4,e-.1,.04],o.ink);const j=a.range(.5,1.5);s.quad([-i+.25,e-j,f-.3],[i-.25,e-j,f-.3],[i-.25,e+.2,f-.3],[-i+.25,e+.2,f-.3],o.verm,me);const K=e+.25;if(s.box(0,K,f/2-.1,n+1.5,.28,f+1,o.marbleB,z,{tx:(n+.3)/(n+1.5),tz:(f+.2)/(f+1),cap:m}),a.chance(.62)){const c=Math.min(n*.5,f*.62)*.9;s.push(0,K+.28,f/2-.1,0,c),s.lathe(Ie,10,m,Re,{squash:Math.min(1,f*.56/c)}),s.pop(),s.push(0,K+.28+1.14*c,f/2-.1),Pe(s,o,.62),s.pop()}else{const c=f+.1,r=-0,k=f/2,p=6,M=X=>K+1.25-.55*(X/i)*(X/i),Y=X=>K+.28+.25-.3*(X/i)*(X/i),E=i+.15;for(let X=0;X<p;X++){const h=-E+X/p*2*E,w=-E+(X+1)/p*2*E;s.quad([h,Y(h),c],[w,Y(w),c],[w,M(w),k],[h,M(h),k],m,z+.5),s.quad([w,Y(w),r],[h,Y(h),r],[h,M(h),k],[w,M(w),k],m,z+.5)}s.quad([E,Y(E),c],[E,Y(E),r],[E,M(E),k],[E,M(E),k],o.marbleB),s.quad([-E,Y(E),r],[-E,Y(E),c],[-E,M(E),k],[-E,M(E),k],o.marbleB);for(const X of[-i*.45,i*.45])s.push(X,M(X)-.05,k),Pe(s,o,.5),s.pop()}}function Oe(s,o,n,f){s.ngon(5,.16*n,.11*n,0,1.3*n,o.umber,z,{cap:!1});const a=f?[[.02,0],[.55,.3],[.8,.8],[.7,1.4],[.42,2],[.16,2.5],[0,2.8]]:[[.02,0],[.7,.2],[1,.6],[1,1.05],[.72,1.5],[.3,1.78],[0,1.85]];s.push(0,1.1*n,0,0,n),s.lathe(a,9,o.mala,r0),s.pop()}function t0(s,o,n,f,a,i,e=6){const m=ke(n.indigo,n.mala,.45);s.push(f[0],f[1],f[2],0,a),s.lathe([[.02,0],[.2,.08],[.27,.3],[.22,.55],[.1,.72],[.06,.8]],7,m,z,{squash:1.25}),s.push(0,.72,.1),s.ngon(5,.075,.05,0,.52,n.mala,z,{cap:!1}),s.pop(),s.push(0,1.2,.12),s.lathe([[.01,0],[.08,.05],[.09,.12],[.05,.2],[0,.22]],6,n.mala,z,{squash:1.3}),s.pop(),we(s,[0,1.3,.2],[0,1.27,.36],.02,n.saffron);for(const V of[-.07,0,.07])we(s,[0,1.4,.1],[V,1.64,.06],.014,n.gold,pe);s.pop(),o.push(f[0],f[1],f[2],0,a),o.anim(e,0,.3,-.14,i);const U=13,W=1.55;for(let V=0;V<U;V++){const _=(-84+168*V/(U-1))*Math.PI/180,j=Math.sin(_),K=Math.cos(_),c=K,r=-j,k=-.2-V%2*.012,p=W*(.9+.1*Math.cos(_*2.2)),M=.05,Y=.17;o.quad([-c*M,.3-r*M,k],[c*M,.3+r*M,k],[j*p+c*Y,.3+K*p+r*Y,k],[j*p-c*Y,.3+K*p-r*Y,k],n.mala,He)}o.pop()}function u0(s,o,n){s.lathe(a0([[.12,0],[.3,.12],[.34,.3],[.22,.46],[.14,.52],[.2,.6]],n),7,o.brass)}function h0(s,o,n,f){s.ngon(8,2.6*n,2.45*n,0,.6*n,o.marble,z,{capCol:o.slate}),s.ngon(6,.3*n,.18*n,.6*n,1.5*n,o.marble),s.ngon(8,.8*n,.9*n,1.5*n,1.7*n,o.marbleB,z,{capCol:o.slate}),s.quad([-.09,1.7*n,0],[.09,1.7*n,0],[.09,5.6*n,0],[-.09,5.6*n,0],o.pearl,We+.5),s.quad([0,1.7*n,-.09],[0,1.7*n,.09],[0,5.6*n,.09],[0,5.6*n,-.09],o.pearl,We+.5);for(let a=0;a<f;a++){const i=a/f*Math.PI*2+.3,e=Math.cos(i),m=Math.sin(i),U=7,W=V=>{const _=.3+2*n*V,j=1.7*n+2.6*n*4*V*(1-V)-1.1*n*V;return[e*_,j,m*_]};for(let V=0;V<U;V++){const _=W(V/U),j=W((V+1)/U);s.quad([_[0],_[1]-.12,_[2]],[j[0],j[1]-.12,j[2]],[j[0],j[1]+.12,j[2]],[_[0],_[1]+.12,_[2]],o.pearl,We+.5)}}}function c0(s,o,n,f,a,i){s.anim(1,o[0],o[1],o[2],i);const e=6,m=_=>f*(1-.3*_)/2,U={wt:[0,0,0,0]};for(let _=0;_<e-1;_++){const j=_/e*n,K=(_+1)/e*n,c=m(_/e),r=m((_+1)/e);s.quad([o[0]+j,o[1]-c,o[2]],[o[0]+K,o[1]-r,o[2]],[o[0]+K,o[1]+r,o[2]],[o[0]+j,o[1]+c,o[2]],a,z+.5,U)}const W=(e-1)/e*n,V=m((e-1)/e);s.quad([o[0]+W,o[1],o[2]],[o[0]+n,o[1]+V*.75,o[2]],[o[0]+n,o[1]+V*.75,o[2]],[o[0]+W,o[1]+V,o[2]],a,z+.5,U),s.quad([o[0]+W,o[1]-V,o[2]],[o[0]+n,o[1]-V*.75,o[2]],[o[0]+n,o[1]-V*.75,o[2]],[o[0]+W,o[1],o[2]],a,z+.5,U)}function Ue(s,o,n,f,a,i,e,m,U,W,V){const K=e/2;o.anim(2,f,a,i,V);for(let c=0;c<4;c++)for(let r=0;r<3;r++){const k=f-K+c/4*e,p=f-K+(c+1)/4*e,M=r/3,Y=(r+1)/3;o.quad([k,a-U*Y,i+m*Y],[p,a-U*Y,i+m*Y],[p,a-U*M,i+m*M],[k,a-U*M,i+m*M],W,me+.5,{wt:[Y,Y,M,M]})}o.anim(5,f,a,i,V+1.7);for(let c=0;c<8;c++){const r=f-K+c/8*e,k=r+e/8,p=a-U,M=i+m;o.quad([r,p-.5,M],[k,p-.5,M],[k,p,M],[r,p,M],c%2?n.saffron:n.verm,z,{wt:[1,1,.3,.3]})}for(const c of[-1,1])we(s,[f+c*(K-.1),a-U-2.3,i+.5],[f+c*(K-.1),a-U+.05,i+m-.05],.05,n.gold,pe)}async function T0(s,o={}){const n=s.rng.fork?s.rng.fork("first-rain-palace"):s.rng,f=(o.palette&&o.palette.length>=7?o.palette:w0).map(ye),a={saffron:f[0],indigo:f[1],marble:f[2],slate:f[3],verm:f[4],mala:f[5],gold:f[6],marbleB:[f[2][0]*.95,f[2][1]*.92,f[2][2]*.86],pearl:f[2],ink:ke(f[1],f[3],.35),brass:Ee(f[6],.7),umber:ye("#4a2b14")},i=o.pass==="right"?1:-1,e=Ze(!1),m=Ze(!0),U=[],W=[],V=[],_=[],j=[],K=[],c=b0,r=le,k=18,p=3.85,M=Math.PI,Y=[a.verm,a.saffron,a.mala,a.verm,a.indigo,a.saffron],E=async()=>{s.yield&&await s.yield()};async function X(l){const A=l===0,B=l!==2,v=n.fork?n.fork("face"+l):n;e.push(0,0,0,l*M/2),m.push(0,0,0,l*M/2),e.quad([-le,0,le],[le,0,le],[le,3,le],[-le,3,le],a.marble,ie+.5),e.quad([-le,3,le],[le,3,le],[le,p,79.2],[-le,p,79.2],a.marble,ze+.5),e.quad([-le,p,79.2],[le,p,79.2],[le,p,c],[-le,p,c],a.marbleB,z+.5);const ee=[],P=[];for(const t of[-1,1]){const u=t>0?k:-le,x=t>0?le:-k,R=(u+x)/2,T=x-u;e.quad([u,p,c],[x,p,c],[x,ae,c],[u,ae,c],a.marble,ie+.5),e.box(R,11,c+.12,T,.3,.3,a.marbleB),e.box(R,19.6,c+.12,T,.3,.3,a.marbleB),e.box(R,ae-.3,c+.55,T,.3,1.5,a.marbleB,z,{tz:.4,cap:a.marble}),e.quad([u,ae,c+.05],[x,ae,c+.05],[x,ae+1.7,c+.05],[u,ae+1.7,c+.05],a.marble,qe+.5);for(let b=u+2;b<x-2;b+=v.range(2.6,4.4)){const I=v.pick([20.2,20.2,14.5,11.6]);e.quad([b-.07,I,c+1.3],[b+.07,I,c+1.3],[b+.07,ae-.3,c+1.3],[b-.07,ae-.3,c+1.3],a.pearl,$e+.5)}for(let b=0;b<5;b++)(B||v.chance(.6))&&ee.push(t*(24.5+11*b)+v.range(-.5,.5));for(let b=0;b<4;b++){const I=t*(30+11*b)+v.range(-.4,.4);(B||v.chance(.5))&&P.push(I);const D=v.chance(.5)?a.ink:a.verm;e.quad([I-1.5,p,c+.03],[I+1.5,p,c+.03],[I+1.5,7.1,c+.03],[I-1.5,7.1,c+.03],D,D===a.verm?me:z),e.push(I,p,c+.14),e.archPlate(3,2.2,.85,3.6,a.marble,{segs:10}),e.pop(),e.box(I,p,c+.35,3.6,.25,.7,a.marbleB),(B||v.chance(.4))&&Ue(e,m,a,I,7.6,c+.1,4.4,3.2,1.5,v.pick([a.saffron,a.verm,a.saffron]),v.range(0,6.28)),b===1&&await E()}await E();for(const b of[27,52])e.push(t*b,ae,c-2.4),Me(e,a,v.range(1.45,1.8),4,B),e.pop(),W.push({k:l,p:e.world(t*(b+6.5),ae+1.75,c)});for(let b=0;b<6;b++)if(B?A||b<4:b===1||b===4){const I=t*(21+9.2*b),D=v.range(5.6,7.2);we(e,[I,ae,c-.4],[I,ae+D,c-.4],.06,a.gold,pe),U.push(e.world(I,ae+D-.5,c-.4))}}await E();for(const t of ee){await E();const u=v.range(4,5),x=v.range(3,3.4);e.push(t,7.6,c),Se(e,a,u,x,v);for(const R of[-1,1])e.quad([R*(u/2+.6)-.06,-2.2-v.range(0,2),x+.4],[R*(u/2+.6)+.06,-2.2,x+.4],[R*(u/2+.6)+.06,3,x+.4],[R*(u/2+.6)-.06,3,x+.4],a.pearl,$e+.5);if(e.pop(),v.chance(B?.55:.25)){const R=t+v.range(-.8,.8),T=v.range(.9,1.5),b=c+x+.07,I=v.pick(Y);m.anim(5,R,8.75,b,v.range(0,6.28));for(let D=0;D<2;D++)m.quad([R-T/2,8.75-.9*(D+1),b],[R+T/2,8.75-.9*(D+1),b],[R+T/2,8.75-.9*D,b],[R-T/2,8.75-.9*D,b],I,me,{wt:[(D+1)/2,(D+1)/2,D/2,D/2]})}}for(const t of P)await E(),e.push(t,17.2,c),Se(e,a,v.range(3.8,4.6),v.range(2.6,3),v),e.pop();if(B){const t=ee.slice().sort((u,x)=>u-x);for(let u=0;u<t.length-1;u++)if(t[u+1]-t[u]<12.5){const x=t[u]+2.2,R=t[u+1]-2.2,T=7,b=c+2.9;m.anim(4,(x+R)/2,7.5,b,v.range(0,6.28));for(let I=0;I<T;I++){const D=I/T,oe=(I+1)/T,ue=Math.sin(D*M),Z=Math.sin(oe*M),ce=se(x,R,D),xe=se(x,R,oe),be=7.5-1.1*ue,he=7.5-1.1*Z;m.quad([ce,be-.14,b],[xe,he-.14,b],[xe,he+.14,b],[ce,be+.14,b],a.saffron,_e+.5,{wt:[ue,Z,Z,ue]})}}}await E();const d=a.marble;e.quad([k,p,r],[k,p,c-4],[k,29.5,c-4],[k,29.5,r],d,ie+.5),e.quad([-k,p,c-4],[-k,p,r],[-k,29.5,r],[-k,29.5,c-4],d,ie+.5);for(const t of[-15.625,15.625])e.box(t,p,r-.9,4.75,5.75,1.8,d,y0),_.push([l,t]);for(const t of[-4.75,4.75])e.box(t,p,r-.9,2,5.75,1.8,d,ie);for(const t of[-9.5,0,9.5])e.push(t,p,r+.01),e.archPlate(7.5,3.3,1.9,5.75,d,{segs:16,depth:1.8}),e.pop();if(A){e.quad([13.25,p,60],[13.25,p,r-1.8],[13.25,9.6,r-1.8],[13.25,9.6,60],d,ie+.5),e.quad([-13.25,p,r-1.8],[-13.25,p,60],[-13.25,9.6,60],[-13.25,9.6,r-1.8],d,ie+.5),e.quad([-13.25,9.6,60],[13.25,9.6,60],[13.25,9.6,r],[-13.25,9.6,r],a.marbleB,Ae+.5);for(const t of[-1,1])e.quad([t*13.2,p,t>0?60:r-1.8],[t*13.2,p,t>0?r-1.8:60],[t*13.2,p+.42,t>0?r-1.8:60],[t*13.2,p+.42,t>0?60:r-1.8],a.verm,z+.5);e.quad([-13.25,p+.01,r],[13.25,p+.01,r],[13.25,p+.01,60],[-13.25,p+.01,60],d,Ae+.5);for(const t of[-4.75,4.75])e.box(t,p,70,1.4,5.75,1.4,d),e.box(t,p,60.6,2,5.75,1.2,d);for(const t of[-9.5,0,9.5])e.push(t,p,60,M),e.archPlate(7.5,3.3,1.9,5.75,d,{segs:14,depth:1.2}),e.pop()}else{e.quad([-13.25,p,r-1.7],[13.25,p,r-1.7],[13.25,9.6,r-1.7],[-13.25,9.6,r-1.7],a.ink,z+.5);for(const t of[-9.5,0,9.5])e.quad([t-2.2,p,r-1.6],[t+2.2,p,r-1.6],[t+2.2,8,r-1.6],[t-2.2,8,r-1.6],a.verm,me)}e.box(0,9.6,r-2.7,2*k+.8,.3,7.8,a.marbleB,z,{cap:d,capMat:Ae+.5,bottom:!0});for(const t of[-1,1]){e.quad([t>0?14:-k,9.9,r],[t>0?k:-14,9.9,r],[t>0?k:-14,17.8,r],[t>0?14:-k,17.8,r],d,ie+.5),t>0?e.quad([14,9.9,r-6],[14,9.9,r],[14,17.8,r],[14,17.8,r-6],d,ie+.5):e.quad([-14,9.9,r],[-14,9.9,r-6],[-14,17.8,r-6],[-14,17.8,r],d,ie+.5);for(const u of[4.7,14])e.push(t*u,9.9,r-.35),e.ngon(8,.34,.27,0,5.3,d,z,{cap:!1}),e.box(0,5.3,0,.9,.3,.9,a.marbleB),e.pop();e.push(t*12,29.5,r-2.6),Me(e,a,1.7,4,!0),e.pop();for(const u of[5.6,13.3])e.push(t*u,20.3,r),Se(e,a,4.2,2.7,v),e.pop();we(e,[t*17,29.5,r-.5],[t*17,36.5,r-.5],.07,a.gold,pe),U.push(e.world(t*17,36,r-.5)),W.push({k:l,p:e.world(t*6,31.25,r)})}await E();for(const t of[-9.35,0,9.35])e.push(t,9.9,r),e.archPlate(9,5.3,1.7,7.9,d,{segs:18,depth:.7}),e.pop();e.quad([-14,9.9,r-6],[14,9.9,r-6],[14,17.8,r-6],[-14,17.8,r-6],d,ie+.5),e.quad([-14,17.8,r-6],[14,17.8,r-6],[14,17.8,r],[-14,17.8,r],a.marbleB,z+.5);const q=ke(a.verm,a.marble,.7),L=ke(a.indigo,a.marble,.78);for(let t=0;t<12;t++){const u=-14+t/12*28,x=u+28/12;e.quad([u+.2,17.7,r-5.9],[x-.2,17.7,r-5.9],[x-.2,17.7,r-.75],[u+.2,17.7,r-.75],t%2?L:q,z),t&&e.box(u,17.3,r-3.3,.36,.5,5.4,a.marble,z,{bottom:!0})}e.quad([-14,9.92,r-5.96],[14,9.92,r-5.96],[14,11.3,r-5.7],[-14,11.3,r-5.7],a.marble,ze+.5);for(const t of[-9.35,0,9.35]){e.quad([t-1.5,11.3,r-5.9],[t+1.5,11.3,r-5.9],[t+1.5,15.4,r-5.9],[t-1.5,15.4,r-5.9],a.ink,z+.5),e.quad([t-1.4,14,r-5.82],[t+1.4,14,r-5.82],[t+1.4,15.4,r-5.82],[t-1.4,15.4,r-5.82],t===0?a.saffron:a.verm,me),e.push(t,11.3,r-5.74),e.archPlate(3.2,2.9,.9,4.6,d,{segs:10}),e.pop();for(const u of[-3.4,3.4])e.quad([t+u-.9,11.55,r-5.9],[t+u+.9,11.55,r-5.9],[t+u+.9,13.4,r-5.9],[t+u-.9,13.4,r-5.9],d,ve)}for(let t=0;t<4;t++)e.quad([-k+t*9,9.9,r+1],[-k+(t+1)*9,9.9,r+1],[-k+(t+1)*9,10.9,r+1],[-k+t*9,10.9,r+1],d,ve);if(e.quad([-k,17.8,r],[k,17.8,r],[k,29.5,r],[-k,29.5,r],d,ie+.5),e.box(0,17.6,r+.15,2*k+.4,.35,.4,a.marbleB),e.quad([-k,29.5,r],[k,29.5,r],[k,29.5,c-4],[-k,29.5,c-4],d,Ae+.5),e.quad([k,ae,c-4],[-k,ae,c-4],[-k,29.5,c-4],[k,29.5,c-4],d,ie+.5),e.box(0,29.2,r+.5,2*k+1.4,.3,1.4,a.marbleB,z,{tz:.45,cap:d}),e.quad([-k,29.5,r+.05],[k,29.5,r+.05],[k,31.3,r+.05],[-k,31.3,r+.05],d,qe+.5),e.push(0,29.5,r-3.2),e.ngon(8,3.5,3.4,0,2.2,d,z,{cap:!1}),e.ngon(8,4.2,3.5,2,2.4,a.marbleB,z,{capCol:d}),e.push(0,2.4,0,0,3.6),e.lathe(Ie,16,d,Re),e.pop(),e.push(0,2.4+1.13*3.6,0),Pe(e,a,2.3),e.pop(),e.pop(),await E(),B){for(let t=0;t<4;t++)e.box(0,0,r+.3+t*.6,26,3-t*.7,.6,t%2?a.marbleB:d,z,{cap:d});for(let t=0;t<6;t++){const u=v.int(0,3),x=v.range(-11.5,11.5);A&&j.push([x,u]),e.push(x,3-u*.7,r+.3+u*.6,0,v.range(.75,1.2)),u0(e,a,1),e.pop()}for(let t=0;t<3;t++){const u=v.int(1,3),x=v.range(-10,8),R=3-u*.7+.02,T=r+u*.6,b=v.range(2.2,3.4);e.quad([x,R,T+.58],[x+b,R,T+.58],[x+b,R,T+.04],[x,R,T+.04],v.pick(Y),me)}for(const t of[-1,1])e.push(t*14.4,0,r+1.5),e.ngon(6,.17,.14,0,4.3,a.verm,z,{cap:!1}),e.push(0,4.3,0),Pe(e,a,.55),e.pop(),e.pop()}if(A){const t=-9.35*i,u=r-3,x=16.5,R=v.range(0,6.28);we(e,[t-2.4,x,u],[t+2.4,x,u],.09,a.gold,pe),m.anim(3,t,x,u,R),m.box(t,10.95,u,2.6,.16,.95,a.gold,pe),m.box(t,11.11,u,2.3,.2,.8,a.verm,z),m.quad([t-1.25,11.1,u-.45],[t+1.25,11.1,u-.45],[t+1.25,11.95,u-.5],[t-1.25,11.95,u-.5],a.saffron,me);for(const T of[-1,1])for(const b of[-1,1])we(m,[t+T*1.22,11,u+b*.42],[t+T*1.22,x,u],.04,a.gold,pe);for(let T=0;T<6;T++){const b=t+.9+T*.62,I=b+.62,D=.15+T*.17,oe=D+.17,ue=11.45-T*.07,Z=ue-.07;m.quad([b,ue-.26,u+.3],[I,Z-.26,u+.3],[I,Z+.26,u+.3],[b,ue+.26,u+.3],a.pearl,me+.5,{wt:[D,oe,oe,D]})}Ue(e,m,a,t,17.7,r+.1,8.8,3,1.2,a.verm,R+2),h.swing=e.world(t,11.1,u)}e.pop(),m.pop()}const h={};for(let l=0;l<4;l++)await X(l),await E();for(let l=0;l<4;l++){await E(),e.push(0,0,0,l*M/2),m.push(0,0,0,l*M/2);const A=l===0?[[-60,-13.25,p],[13.25,60,p],[-13.25,13.25,9.6]]:[[-60,60,p]];for(const[B,v,ee]of A)e.quad([v,ee,60],[B,ee,60],[B,ae,60],[v,ae,60],a.marble,ie+.5);e.quad([60,ae,59.95],[-60,ae,59.95],[-60,ae+1.5,59.95],[60,ae+1.5,59.95],a.marble,qe+.5),e.quad([-c,ae,c],[c,ae,c],[60,ae,60],[-60,ae,60],a.marble,Ae+.5);for(const B of[-36,36])e.push(B+n.range(-3,3),12,60,M),Se(e,a,4.4,2.8,n),e.pop();Ue(e,m,a,n.range(-8,8),12.6,-14.05-0,6.5,-3,1.3,n.pick([a.saffron,a.verm]),n.range(0,6.28));for(const B of[-66,-40,40,66]){const v=[B+n.range(-2,2),ae,69+n.range(-1.5,1.5)];V.push(e.world(v[0],v[1],v[2])),n.chance(.6)&&(e.push(v[0],v[1],v[2],n.range(0,6),n.range(2,3)),Oe(e,a,1,n.chance(.3)),e.pop())}e.pop(),m.pop()}e.quad([-60,p,60],[60,p,60],[60,p,-60],[-60,p,-60],a.marble,Ae+.5);for(const l of[-1,1])for(const A of[-1,1]){await E(),e.push(l*77,0,A*77),K.push(e.world(0,0,0)),e.ngon(8,6.3,5.5,0,p,a.marble,ie,{cap:!1}),e.ngon(8,5.5,5.4,p,28.6,a.marble,ie,{cap:!1}),e.ngon(8,5.85,5.85,10.9,11.3,a.marbleB,z,{cap:!1}),e.ngon(8,5.8,5.8,19.5,19.9,a.marbleB,z,{cap:!1}),e.ngon(8,6.8,5.6,28.3,28.9,a.marbleB,z,{capCol:a.marble}),e.ngon(8,5.55,5.55,28.9,30.4,a.marble,qe,{cap:!1}),e.push(0,28.9,0),Me(e,a,1.78,8,!0),e.pop();for(let B=0;B<8;B++){const v=M/8+(B+.5)*M/4;for(const[d,q,L]of[[7.5,2,5.17],[16.3,1.8,5.14]])e.push(Math.sin(v)*L,d,Math.cos(v)*L,v),e.quad([-1.1,0,0],[1.1,0,0],[1.1,q,0],[-1.1,q,0],a.marble,ve),e.box(0,-.3,.12,2.9,.3,.5,a.marbleB,z,{cap:a.marble}),e.quad([-1.45,q+.05,.75],[1.45,q+.05,.75],[1.45,q+.65,.02],[-1.45,q+.65,.02],(B+(d>10?1:0))%2?a.saffron:a.verm,me),e.pop();e.push(Math.sin(v)*5.1,25.3,Math.cos(v)*5.1,v),e.quad([-1.5,0,0],[1.5,0,0],[1.5,1.5,0],[-1.5,1.5,0],a.marble,ve),e.pop();const ee=d=>(6.3-.2078*d)*.9239+.05,P=(d,q,L,t,u,x=0)=>e.quad([-d,q,ee(q)],[d,q,ee(q)],[d,L,ee(L)+x],[-d,L,ee(L)+x],t,u);if(e.push(0,0,0,v),m.push(l*77,0,A*77,v),P(2,.3,1,a.verm,me),P(2.05,2.95,3.8,a.marble,ze+.5,.26),B%2)P(1.25,1.35,2.7,a.marble,ve);else{P(.85,1.4,2.65,B/2%2?a.saffron:a.verm,He);for(const[d,q]of[[[-.98,1.28],[.98,1.28]],[[.98,1.28],[.98,2.78]],[[.98,2.78],[-.98,2.78]],[[-.98,2.78],[-.98,1.28]]])we(e,[d[0],d[1],ee(d[1])+.04],[q[0],q[1],ee(q[1])+.04],.045,a.gold,pe)}{m.anim(4,0,7.05,5.36,B*1.7+l+A*2);for(let t=0;t<6;t++){const u=t/6,x=(t+1)/6,R=Math.sin(u*M),T=Math.sin(x*M),b=se(-1.9,1.9,u),I=se(-1.9,1.9,x),D=7.05-.75*R,oe=7.05-.75*T;m.quad([b,D-.14,5.36],[I,oe-.14,5.36],[I,oe+.14,5.36],[b,D+.14,5.36],a.saffron,_e+.5,{wt:[R,T,T,R]})}}e.pop(),m.pop()}W.push({k:A>0?0:2,p:e.world(l*3.2,30.45,A*4.4)}),e.pop()}await s.yield?.();const w=n.range(8.6,9.6);e.box(0,p,0,28,20.2,28,a.marble,ie,{capMat:Ae+.5});for(let l=0;l<4;l++){await E(),e.push(0,0,0,l*M/2);for(const A of[-8.5,0,8.5])e.quad([A-3,p,14.03],[A+3,p,14.03],[A+3,p+6.3,14.03],[A-3,p+6.3,14.03],A===0?a.verm:a.ink,A===0?me:z),e.push(A,p,14.14),e.archPlate(6.4,4,1.7,6.6,a.marble,{segs:14}),e.pop();e.box(0,23.75,14.4,29.6,.3,1.2,a.marbleB,z,{tz:.4,cap:a.marble}),e.box(0,11.4,14.1,28.2,.3,.3,a.marbleB),e.quad([-14,24.05,14.02],[14,24.05,14.02],[14,25.6,14.02],[-14,25.6,14.02],a.marble,qe+.5),e.push(11.4,24.05,11.4),Me(e,a,1.5,4,!0),e.pop(),e.pop()}e.push(0,24.05,0),e.ngon(8,8.9,8.6,0,6,a.marble,ie,{cap:!1}),e.ngon(8,10.2,8.9,5.8,6.3,a.marbleB,z,{capCol:a.marble}),e.push(0,6.3,0,0,w),e.lathe(Ie,24,a.marble,Re),e.pop(),e.push(0,6.3+1.13*w,0),Pe(e,a,6.4),e.pop(),e.pop(),await E();for(const[l,A,B,v]of[[0,43,46,24],[-40,-40,26,26],[40,-40,26,26],[-41,36,22,26],[41,36,22,26],[0,-40,30,20]])e.quad([l-B/2,p+.03,A+v/2],[l+B/2,p+.03,A+v/2],[l+B/2,p+.03,A-v/2],[l-B/2,p+.03,A-v/2],Ee(a.mala,.92),z);for(const[l,A,B,v]of[[-9.5,66,.8,6],[0,66,.9,6],[9.5,66,.8,6],[-40,-40,1.25,8],[40,-40,1.25,8],[-40,36,1.2,8],[40,36,1.2,8]])e.push(l,p,A),h0(e,a,B,v),e.pop();for(const l of[-11.6,-7.2,-2.2,2.3,7.4,11.5])e.push(l,p,54.5-Math.abs(l%2),l*1.7,2.3+.25*Math.abs(l%3)),Oe(e,a,1,Math.abs(l)>5&&Math.abs(l)<9),e.pop();for(const[l,A]of[[-27,47],[27,47],[-47,-22],[47,-22],[-24,-47],[24,-47],[-47,12],[47,12]])n.chance(.8)&&(e.push(l+n.range(-2,2),p,A+n.range(-2,2),n.range(0,6),n.range(2.6,3.8)),Oe(e,a,1,n.chance(.4)),e.pop());if(await E(),h.kiosks=[],o.kiosks!==!1)for(const l of[60,20,-20,-60])e.push(l,0,o.kioskZ??102),e.ngon(8,3.3,3,0,2.4,a.marble,z,{cap:!1}),e.ngon(8,3.3,3.3,2.4,2.75,a.marbleB),e.push(0,2.75,0),Me(e,a,1.45,8,!0),e.pop(),h.kiosks.push(e.world(0,0,0)),W.push({k:0,p:e.world(0,2.75,-2.85)}),e.pop();if(await E(),o.waterGate!==!1){const l=(P,d,q,L,t)=>{const u=(P+d)/2,x=Math.abs(d-P),R=Math.max(2,Math.round(x/6));e.box(u,0,q,x,2.4,.9,a.marble,z),e.quad([P,2.4,q],[d,2.4,q],[d,4.15,q],[P,4.15,q],a.marble,ve),e.quad([P,4.15,q],[d,4.15,q],[d,6.35,q],[P,6.35,q],a.marble,ie+.5),e.quad([P,6.35,q],[d,6.35,q],[d,L,q],[P,L,q],a.marble,ve),e.box(u,4.05,q,x,.14,.24,a.marbleB),e.box(u,6.3,q,x,.14,.24,a.marbleB),e.box(u,L,q,x,.3,.6,a.marbleB),e.quad([P,L+.3,q],[d,L+.3,q],[d,L+1.6,q],[P,L+1.6,q],a.marble,qe+.5);for(let T=0;T<=R;T++){const b=se(P,d,T/R);e.box(b,0,q,.9,L+.9,1.1,a.marbleB,z,{cap:a.marble}),e.push(b,L+.9,q),Pe(e,a,.85),e.pop()}for(let T=0;T<R;T++){const b=se(P,d,T/R)+.6,I=se(P,d,(T+1)/R)-.6,D=7;for(const oe of[q+.62,q-.62]){m.anim(4,(b+I)/2,8.1,oe,t+T*1.9);for(let ue=0;ue<D;ue++){const Z=ue/D,ce=(ue+1)/D,xe=Math.sin(Z*M),be=Math.sin(ce*M),he=se(b,I,Z),Le=se(b,I,ce),Fe=8.1-1*xe,Te=8.1-1*be;m.quad([he,Fe-.15,oe],[Le,Te-.15,oe],[Le,Te+.15,oe],[he,Fe+.15,oe],a.saffron,_e+.5,{wt:[xe,be,be,xe]})}}}};l(i>0?-110.7:82.3,i>0?-82.3:110.7,77,8.6,.7),await E(),e.push(-112*i,0,88,-M/2),m.push(-112*i,0,88,-M/2);for(const P of[-1,1])e.box(P*7.75,0,0,2.5,15,2.6,a.marble,ie),e.push(P*7.75,15.5,0),Me(e,a,1,4,!0),e.pop();e.push(0,0,1.3),e.archPlate(13,7.2,4.4,15,a.marble,{segs:22,depth:1.3}),e.pop(),e.push(0,0,-1.3,M),e.archPlate(13,7.2,4.4,15,a.marble,{segs:22,depth:1.3}),e.pop(),e.box(0,15,0,18.6,.5,3.3,a.marbleB,z,{cap:a.marble});for(const P of[-1.5,1.5])e.quad([-9,15.5,P],[9,15.5,P],[9,17,P],[-9,17,P],a.marble,qe+.5);e.push(0,15.5,0),Me(e,a,1.35,4,!0),e.pop();const A=n.fork?n.fork("water-gate"):n,B=(P,d,q,L,t,u,x)=>e.quad([P,q,t],[d,q,t],[d,L,t],[P,L,t],u,x),v=(P,d,q,L,t)=>{for(const[u,x]of[[[P,q],[d,q]],[[d,q],[d,L]],[[d,L],[P,L]],[[P,L],[P,q]]])we(e,[u[0],u[1],t],[x[0],x[1],t],.05,a.gold,pe)},ee=(P,d,q,L,t,u)=>{m.anim(4,(P+d)/2,q,L,u);for(let R=0;R<9;R++){const T=R/9,b=(R+1)/9,I=Math.sin(T*M),D=Math.sin(b*M),oe=se(P,d,T),ue=se(P,d,b),Z=q-t*I,ce=q-t*D;m.quad([oe,Z-.17,L],[ue,ce-.17,L],[ue,ce+.17,L],[oe,Z+.17,L],a.saffron,_e+.5,{wt:[I,D,D,I]})}};for(const[P,d,q]of[[1.3,0,0],[-1.3,M,1]]){e.push(0,0,P,d),m.push(0,0,P,d);for(const L of[-4.3,0,4.3])B(L-1.25,L+1.25,L===0?12.95:12.4,14.2,.05,a.marble,ve);for(const L of[-2.15,2.15])B(L-.3,L+.3,12.9,14.1,.06,a.gold,pe);B(-9,9,14.3,15,.06,a.verm,me),e.box(0,12.15,.12,13.4,.16,.24,a.marbleB);for(const L of[-1,1]){const t=L*5.25,u=11,x=.75,R=.95;e.quad([t,u-R,.05],[t+x,u,.05],[t,u+R,.05],[t-x,u,.05],a.verm,z+.5);for(const[D,oe]of[[[0,-R],[x,0]],[[x,0],[0,R]],[[0,R],[-x,0]],[[-x,0],[0,-R]]])we(e,[t+D[0],u+D[1],.09],[t+oe[0],u+oe[1],.09],.045,a.gold,pe);const T=L>0?6.5:-9,b=L>0?9:-6.5,I=L*7.75;B(T,b,.25,1.05,.05,a.verm,me),e.quad([T,1.2,.3],[b,1.2,.3],[b,2.4,.05],[T,2.4,.05],a.marble,ze+.5),B(I-.95,I+.95,2.8,6,.05,a.marble,ve),B(I-.85,I+.85,7.1,9.2,.05,L>0==(q===0)?a.verm:a.saffron,He),v(I-.95,I+.95,7,9.3,.09),e.push(I,10.6,0),Se(e,a,2.2,1.4,A),e.pop(),Ue(e,m,a,I,6.75,.08,2.3,1.5,.75,a.saffron,1.3+L+q*2.2)}ee(-5.7,5.7,11.5,.42,1.6,.9+q*2.4),e.pop(),m.pop(),await E()}for(const P of[-1,1])e.push(P*6.5,0,0,-P*M/2),B(-1.25,1.25,.25,1.05,.04,a.verm,me),e.quad([-1.3,1.2,.2],[1.3,1.2,.2],[1.3,2.4,.04],[-1.3,2.4,.04],a.marble,ze+.5),B(-.9,.9,2.65,4.05,.04,a.marble,ve),B(-.8,.8,6.5,7.1,.04,P>0?a.saffron:a.verm,me),e.pop();we(e,[0,12.5,0],[0,11.2,0],.03,a.gold,pe),e.push(0,10.35,0),e.lathe([[0,0],[.3,.14],[.4,.42],[.18,.74],[0,.86]],6,a.gold,pe),e.pop(),l(9,23.5,0,8.6,2.9),h.screenPerch=e.world(13.375,10.2,0),e.push(27,0,0),e.ngon(8,4.6,4.1,0,11,a.marble,ie,{cap:!1}),e.ngon(8,5,4.2,10.6,11.1,a.marbleB,z,{capCol:a.marble}),e.ngon(8,4.15,4.15,11.1,12.5,a.marble,qe,{cap:!1}),e.push(0,11.1,0),Me(e,a,1.45,8,!0),e.pop(),W.push({k:0,p:e.world(0,12.55,3.6)}),e.pop(),we(e,[-8.9,17,0],[-8.9,23,0],.07,a.gold,pe),U.push(e.world(-8.9,22.5,0)),W.push({k:0,p:e.world(5.2,15.5,0)}),e.pop(),m.pop()}if(await E(),o.peacocks!==!1)for(const l of W)l.k===0&&t0(e,m,a,l.p,n.range(1.5,1.9),n.range(0,6.28));for(const l of U)c0(m,l,n.range(4.6,6.8),n.range(1.2,1.7),n.pick([a.verm,a.saffron,a.verm,a.mala]),n.range(0,6.28));if(h.screenPerch&&o.peacocks!==!1){const l=h.screenPerch;e.push(l[0],l[1],l[2],i*M/2),m.push(l[0],l[1],l[2],i*M/2),t0(e,m,a,[0,0,0],1.75,2.1),e.pop(),m.pop()}for(const[l,A]of _)e.push(0,0,0,l*M/2),e.box(A,p,r+.12,4.75,.3,.3,a.marbleB),e.pop();await s.yield?.();const g=l=>new y.Vector3(l[0],l[1],l[2]),H=g(o.keyDir||[.59*i,.766,.25]).normalize(),S={uTime:{value:0},uCamL:{value:new y.Vector3(0,30,300)},uFrontX:{value:-400},uFrontRun:{value:1},uWindX:{value:-340},uLamp:{value:1},uPx:{value:.001},uSide:{value:i},uDraw:{value:0},uGlint:{value:0},uFade:{value:1},uLift:{value:0},uTop:{value:400},uLampAll:{value:o.lampAll||0},uCloudX:{value:-640},uRainAmt:{value:1},uRainSky:{value:g(Ee(ke([.78,.86,1.08].map((l,A)=>l*se(f[2][A],f[3][A],.45)),ye(o.cloud||"#1F2A5C"),.1),o.rainSky??1))},uStars:{value:o.stars||0},uWash:{value:g(ye(o.wash||"#ffffff"))},uGround:{value:g(ye(o.skyGround||"#F0A81E"))},uCloud:{value:g(ye(o.cloud||"#1F2A5C"))},uCloudHi:{value:g(ke(ye(o.cloud||"#1F2A5C"),f[2],.3))},uEdge:{value:g(ye(o.cloudEdge||"#F6F1E3"))},uKey:{value:H},uCool:{value:g(o.cool||[.8,.86,.97])},uRows:{value:new y.Vector3(Xe[0],Xe[1],Xe[2])},uUmber:{value:g(a.umber)},uGold:{value:g(a.gold)},uInk:{value:g(a.ink)},uVerm:{value:g(a.verm)},uYellow:{value:g(a.saffron)},uPearl:{value:g(a.pearl)},uSlate:{value:g(a.slate)},uIndigo:{value:g(a.indigo)},uLake:{value:g(o.lake?ye(o.lake):a.slate)},uLakeHi:{value:g(o.lakeDeep?ye(o.lakeDeep):ke(a.slate,a.indigo,.2))},uReflWet:{value:.5},uMala:{value:g(a.mala)},uFwd:{value:new y.Vector3(-i,0,0)},uHerd:{value:new y.Vector4(0,0,0,0)},uHerdGap:{value:690},uHerdRare:{value:0},uRefl:{value:o.reflections??1},uRBc:{value:Array.from({length:22},()=>new y.Vector3)},uRBh:{value:Array.from({length:22},()=>new y.Vector3)},uRBk:{value:Array.from({length:22},()=>new y.Vector3)}};let $=0;const ne=(l,A,B,v,ee,P,d)=>$>=22?!1:(S.uRBc.value[$].set(l,A,B),S.uRBh.value[$].set(v,ee,P),S.uRBk.value[$].set(d[0],d[1],d[2]),$++,!0);for(const l of h.kiosks)ne(l[0],5.2,l[2],3.3,5.2,3.3,a.marble);const O=(l,A,B={})=>new y.ShaderMaterial({uniforms:{...y.UniformsUtils.clone(y.UniformsLib.fog),...S},vertexShader:l,fragmentShader:A,fog:!0,...B}),F=new y.Group;F.name="first-rain-palace";const N=new y.Mesh(await e.toGeometryAsync(E),O(Qe,e0,{vertexColors:!0,side:y.DoubleSide})),Q=new y.Mesh(await m.toGeometryAsync(E),O(Qe,e0,{vertexColors:!0,side:y.DoubleSide,defines:{CLOTH:1}}));Q.frustumCulled=!1,F.add(N,Q);let C=e.tris+m.tris;if(o.water!==!1){const l=new y.CircleGeometry(1700,72);l.rotateX(-M/2);const A=new y.Mesh(l,O(s0,l0));A.position.y=.04,A.frustumCulled=!1,F.add(A),C+=72}if(o.rain!==!1){const l=[[0,340],[0,170],[0,60],[0,0],[1,-180],[1,-96],[1,330],[1,200],[2,90.6]],A=[],B=[],v=[];l.forEach(([t,u],x)=>{for(const[R,T]of[[0,0],[1,0],[1,1],[0,1]])A.push(R,T,0),B.push(t,u);v.push(x*4,x*4+1,x*4+2,x*4,x*4+2,x*4+3)});const ee=new y.BufferGeometry;ee.setAttribute("position",new y.Float32BufferAttribute(A,3)),ee.setAttribute("aS",new y.Float32BufferAttribute(B,2)),ee.setIndex(v);const P=new y.Mesh(ee,O(q0,k0,{side:y.DoubleSide,depthWrite:!1}));P.frustumCulled=!1,P.renderOrder=8,F.add(P),C+=l.length*2;const d=new y.InstancedBufferGeometry;d.setAttribute("position",new y.Float32BufferAttribute([-1,0,0,1,0,0,1,1,0,-1,1,0],3)),d.setIndex([0,1,2,0,2,3]);const q=[];for(let t=0;t<12;t++)for(let u=0;u<9;u++)for(let x=0;x<12;x++)q.push(t,u,x);d.setAttribute("aCell",new y.InstancedBufferAttribute(new Float32Array(q),3)),d.instanceCount=q.length/3;const L=new y.Mesh(d,O(M0,A0,{side:y.DoubleSide,depthWrite:!1}));L.frustumCulled=!1,L.renderOrder=8.1,F.add(L),C+=q.length/3*2}const G=[];if(o.lightning!==!1){const l=n.fork?n.fork("bolt"):n;for(let A=0;A<2;A++){const B=[],v=[],ee=[],P=[];let d=0;const q=(Z,ce,xe,be)=>{for(let he=0;he<Z.length;he++){const Le=Z[Math.max(0,he-1)],Fe=Z[Math.min(Z.length-1,he+1)],Te=new y.Vector3(Fe[0]-Le[0],Fe[1]-Le[1],Fe[2]-Le[2]).normalize(),p0=se(ce,xe,he/(Z.length-1)),m0=be*(1-.6*(he/(Z.length-1)));for(const v0 of[-1,1])B.push(Z[he][0],Z[he][1],Z[he][2]),v.push(Te.x,Te.y,Te.z),ee.push(p0,v0*m0);he&&P.push(d-2,d-1,d,d-1,d+1,d),d+=2}},L=A===0?o.bolt0Jit??1:1,t=A===0&&o.bolt0X!==void 0,u=[],x=A===0?[t?o.bolt0X+0*l.range(-60,60):i*(-560+l.range(-60,60)),o.bolt0Y??405,(o.bolt0Z??600)+(t?0:1)*l.range(-80,80)]:[i*(-760+l.range(-50,50)),300,330+l.range(-40,40)],R=[x[0]+i*l.range(20,90)*L,A===0?o.bolt0End??80:85,x[2]+(t?o.bolt0Dz??0:0)-l.range(20,90)*L],T=22;for(let Z=0;Z<=T;Z++){const ce=Z/T,xe=Z===0?0:1;u.push([se(x[0],R[0],ce)+l.range(-16,16)*xe*(t?.2:1),se(x[1],R[1],ce),se(x[2],R[2],ce)+l.range(-16,16)*xe*L])}q(u,0,1,1);for(const Z of[5,10,15]){const ce=[u[Z]],xe=l.sign();for(let be=1;be<=6;be++){const he=ce[be-1];ce.push([he[0]+l.range(-8,8),he[1]-l.range(8,16)*L,he[2]+xe*l.range(10,22)*L])}q(ce,Z/T,Z/T+.3,.6)}const b=new y.BufferGeometry;b.setAttribute("position",new y.Float32BufferAttribute(B,3)),b.setAttribute("aDir",new y.Float32BufferAttribute(v,3)),b.setAttribute("aT",new y.Float32BufferAttribute(ee,2)),b.setIndex(P);const I=A===0?o.bolt0Wide??1:1,D={uCamL:S.uCamL,uPx:S.uPx,uGold:S.uGold,uDark:{value:g(ke(ye(o.cloud||"#1F2A5C"),a.umber,.35))},uDraw:{value:0},uGlint:{value:0},uFade:{value:0},uWide:{value:I},uHalo:{value:0}},oe=new y.Mesh(b,new y.ShaderMaterial({uniforms:D,vertexShader:i0,fragmentShader:f0,side:y.DoubleSide}));oe.frustumCulled=!1,oe.renderOrder=9,F.add(oe);const ue=new y.Mesh(b,new y.ShaderMaterial({uniforms:{...D,uWide:{value:1.75*I},uHalo:{value:1}},vertexShader:i0,fragmentShader:f0,side:y.DoubleSide,depthWrite:!1}));ue.frustumCulled=!1,ue.renderOrder=8.9,F.add(ue),C+=P.length/3*2,G.push({u:D,p:0,meshes:[oe,ue]}),A===0?h.lightning=u[Math.floor(T/2)]:h.lightning2=u[Math.floor(T/2)]}}let J=null;o.sky!==!1&&(J=new y.Mesh(new y.SphereGeometry(1,32,16),new y.ShaderMaterial({uniforms:S,vertexShader:P0,fragmentShader:z0,side:y.BackSide,depthWrite:!1,depthTest:!1})),J.renderOrder=-.5,J.frustumCulled=!1,F.add(J),C+=960);const te=l=>-l[0]*i,fe=l=>[l[0]*i,l[1],l[2]];Object.assign(h,{placement:{position:[0,0,460],rotationY:i*M/2,pathX:i*88},flyThrough:[[460,2.6,0],[400,2.6,0],[270,2.6,34],[140,2.6,70],[80,2.6,88],[-80,2.6,88],[-112,2.6,88],[-190,2.6,88]].map(fe),portalSeat:{position:[-190*i,2.6,88],facing:[i,0,0],radius:7},hit:[170*i,2.6,62],faceLook:[0,12,le],waterGate:{position:[-112*i,2.6,88],width:13,height:12,axis:[1,0,0]},peacockPerches:W.filter(l=>l.k===0).sort((l,A)=>te(l.p)-te(A.p)).map(l=>l.p).slice(0,14),allPerches:W.map(l=>l.p),gardenSpots:V,landingPots:j,towerFeet:K,pennants:U,frontAxis:[i,0,0],side:i,keyDir:[H.x,H.y,H.z],lampRows:Xe,bounds:{min:[-117,0,-84],max:[84,50,121]}});let re=-400,de=null,ge=!1;const Ve=l=>i*(l<.12?se(-1440,-240,l/.12):l<.45?se(-240,170,(l-.12)/.33):170+(l-.45)*1320),Ge=l=>{ge=!0,re=l},Ne=l=>{de=l},Ke=(l,A=0)=>{ge=!0,G[A]&&(G[A].p=De(l,0,1))},d0=l=>{ge=!0,re=Ve(De(l,0,1)),Ke((l-.31)/.12,0),Ke((l-.84)/.13,1)},Ye=new y.Matrix4,Ce=new y.Vector3,Be=new y.Vector3,o0=new y.Vector2(1920,1080);return{object:F,radius:78,height:38,center:new y.Vector3(0,14,0),anchors:h,uniforms:S,triangles:C,makeMaterial:O,colors:a,setProgress:d0,setFront:Ge,setCloud:Ne,setLightning:Ke,frontOfU:Ve,reflBox:ne,boltMeshes:G.map(l=>l.meshes),update(l,A,B){if(F.updateWorldMatrix(!0,!1),Ye.copy(F.matrixWorld).invert(),Ce.setFromMatrixPosition(B.matrixWorld).applyMatrix4(Ye),S.uCamL.value.copy(Ce),S.uTime.value=A,Be.set(0,0,-1).transformDirection(B.matrixWorld).transformDirection(Ye),Be.y=0,Be.lengthSq()<1e-6&&Be.set(-i,0,0),S.uFwd.value.copy(Be.normalize()),s.renderer&&s.renderer.getDrawingBufferSize&&s.renderer.getDrawingBufferSize(o0),S.uPx.value=2*Math.tan((B.fov||60)*M/360)/Math.max(o0.y,1),!ge){let v=Math.atan2(Ce.x,Ce.z);v<-.8&&(v+=M*2),re=i*se(-330,300,De((v+.3)/4.7,0,1)),G[0]&&(G[0].p=A%8/8)}S.uFrontX.value=re,S.uWindX.value=re+60*i,S.uCloudX.value=de===null?re+240*i:de;for(let v=0;v<G.length;v++){const ee=G[v],P=ee.p;ee.u.uDraw.value=De(P/.23,0,1),ee.u.uGlint.value=P<.23?2:(P-.23)/.2%1.3,ee.u.uFade.value=P<=0?0:1-x0(.62,1,P)}J&&(J.position.copy(Ce),J.scale.setScalar((B.far||6e3)*.9))},dispose(){},ground:!1,groundY:0}}const S0={makeAcc:Ze,NEAR_BOAT:je,GOUACHE_VERT:Qe,GOUACHE_FRAG:e0,LAKE_VERT:s0,LAKE_FRAG:l0,DOME_PROF:Ie,scaleProf:a0,archY:Je,lin:ye,mixc:ke,mulc:Ee,beam:we,finial:Pe,chhatri:Me,jharokha:Se,tree:Oe,peacock:t0,pot:u0,fountain:h0,pennant:c0,awning:Ue,M:{PLAIN:z,WALL:ie,JALI:ve,LOTUS:ze,GOLD:pe,KANG:qe,STRIPE:me,TILE:Ae,DOME:Re,DASH:We,BEAD:_e,DRIP:$e,LEAF:r0,FEATHER:He,HOUSE:15,HILL:17,PAD:18,FLOWER:19,SCALLOP:20}};export{T0 as buildHero,S0 as gouache};
