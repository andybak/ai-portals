import*as a from"three";import{clamp as ee,smoothstep as Ae}from"../kit/core.js";const ve=["#08070A","#2A1418","#8E1F14","#E8611C","#FFC65A","#FFF3D0","#B9B4C8"],ue=6*Math.PI/180,ge=4*Math.PI/180,le=1.2,we=4,xe=12*Math.PI/180,be=`
float hash21(vec2 p){ p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(hash21(i), hash21(i+vec2(1.,0.)), f.x), mix(hash21(i+vec2(0.,1.)), hash21(i+vec2(1.,1.)), f.x), f.y); }
float fbm3(vec2 p){ float a = .5, s = 0.; s += a*vnoise(p); p = p*2.03+17.1; a *= .5; s += a*vnoise(p); p = p*2.01+9.7; a *= .5; s += a*vnoise(p); return s / .875; }
// crust that froze in polygons: x = distance to the nearest cell centre, y = 0 on the joint between two cells rising into each, z = the cell's own random number
// (polish 3) Not every joint is open: four in ten pairs of neighbours froze together, so the net is irregular blocks of one
// to four cells with cracks that end at junctions, not a honeycomb. The pair's number is symmetric (the sum of the two cells).
vec3 voro(vec2 p){ vec2 i = floor(p), f = fract(p); float f1 = 9., f2 = 9., id = 0.; vec2 c1 = vec2(0.), c2 = vec2(0.);
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) { vec2 g = vec2(float(x), float(y)), c = i + g;
    float d = length(g + 0.12 + 0.76 * vec2(hash21(c), hash21(c + 17.3)) - f);
    if (d < f1) { f2 = f1; c2 = c1; f1 = d; c1 = c; id = hash21(c + 5.7); } else if (d < f2) { f2 = d; c2 = c; } }
  float fused = step(hash21(c1 + c2 + 0.37), 0.40);
  return vec3(f1, mix(f2 - f1, 1., fused), mix(id, hash21(c1 + c2 + 9.1), fused * 0.5)); }
`,ce=`
uniform vec4 uSwell;
float swellS(vec2 xz){ return -xz.y - uSwell.x + uSwell.w * xz.x; }
float swellH(vec2 xz){ return uSwell.y * 0.5 * (1. + cos(3.14159265 * clamp(swellS(xz) / max(uSwell.z, 1.), -1., 1.))); }
`,se=()=>({value:new a.Vector4(0,0,625,0)}),ye=`
uniform sampler2D uMoonTex; uniform float uMoonT; uniform float uEarthGlow; uniform vec3 uMoonSun;
uniform vec3 uMoonCol[6]; // ember, crack, raft cold, raft warm, crescent cool, crescent hot
uniform vec4 uMoonScar;   // rare event: disc uv of a strike (xy), scar radius in disc units (z), spark 0..1 (w)
vec4 moonShade(vec2 uv, float lod){
  float r2 = dot(uv, uv);
  float r = sqrt(max(r2, 0.));
  float nz = sqrt(max(1. - r2, 0.));
  vec3 n = vec3(uv, nz);
  // heat shimmer on the lowest degree of the disc
  float low = smoothstep(-0.70, -1.0, uv.y);
  vec2 w = uv + low * vec2(sin(uv.y * 70. + uMoonT * 2.3) * 0.012, sin(uv.x * 46. - uMoonT * 1.7) * 0.006);
  // sphere mapping: texture radius follows the angle from the disc centre, so features crowd toward the limb
  float rr = clamp(length(w), 0., 0.9995);
  float k = rr < 1e-3 ? 1. : asin(rr) / rr;
  float dr = uMoonT * 0.0016, cd = cos(dr), sd = sin(dr);                 // the face drifts a few degrees in a flight
  vec2 tuv = mat2(cd, -sd, sd, cd) * (w * k) * (0.5 / 1.5708) * 0.94 + 0.5;
  vec4 t = textureLod(uMoonTex, tuv, lod);
  float limb = 0.22 + 0.78 * pow(max(nz, 0.), 0.6);
  // cracks open and heal: the width threshold breathes with a phase that varies slowly across the face
  float ph = t.b * 6.2832 * 2.;
  float open = 0.5 + 0.5 * sin(uMoonT * 0.21 + ph);
  float wdt = mix(0.02, 0.11, open * open);
  float crack = 1. - smoothstep(wdt * 0.25, wdt, t.r);
  float halo = 1. - smoothstep(0., wdt * 3.2 + 0.05, t.r);
  // rafts of new crust: threshold drifts a little so their shores creep
  float rth = 0.47 + 0.03 * sin(uMoonT * 0.13 + ph * 0.5);
  float raft = smoothstep(rth, rth + 0.035, t.g);
  float shore = smoothstep(rth - 0.10, rth, t.g) * (1. - raft);
  crack *= 1. - raft * 0.85; halo *= 1. - raft;
  vec3 ember = uMoonCol[0] * (0.50 + 0.55 * t.a + 0.55 * t.b);
  ember += uMoonCol[1] * halo * 0.12 * (0.4 + open);
  ember += uMoonCol[1] * shore * 0.30;
  vec3 raftC = mix(uMoonCol[2], uMoonCol[3], uEarthGlow) * (0.55 + 0.5 * t.a);
  vec3 col = mix(ember, raftC, raft * 0.95);
  col += uMoonCol[1] * crack * (0.35 + 1.1 * open);
  // a strike on the dark face: the crust founders outward from the point, ragged at its edge, hot in the middle
  float sdist = length(uv - uMoonScar.xy), sr = max(uMoonScar.z, 1e-4);
  float scar = (1. - smoothstep(sr * 0.5, sr, sdist + (t.a - 0.5) * sr * 0.7)) * step(1e-3, uMoonScar.z);
  col = mix(col, uMoonCol[1] * (0.9 + 0.9 * t.b) + uMoonCol[5] * 0.5 * (1. - smoothstep(0., sr * 0.5, sdist)), scar * (1. - 0.45 * raft));
  col += uMoonCol[1] * 0.5 * scar * (1. - smoothstep(0., 0.05, abs(sdist - sr * 0.8 + (t.a - 0.5) * sr * 0.7)));
  col += uMoonCol[5] * 3.0 * uMoonScar.w * exp(-sdist * sdist / 0.0016);
  col *= limb;
  // sunlit part: fixed sun direction, bone-violet run hot at the limb
  float sun = max(dot(n, uMoonSun), 0.);
  float cres = smoothstep(0.0, 0.42, sun);
  vec3 cc = mix(uMoonCol[4], uMoonCol[5], smoothstep(0.25, 0.9, sun)) * (0.55 + 1.5 * sun) * (0.8 + 0.4 * t.a) * mix(0.42, 1.0, clamp(-uMoonSun.z / 0.7, 0., 1.));
  col = mix(col, cc, cres);
  float cov = 1. - smoothstep(0.985, 1.0, r);
  return vec4(col, cov);
}
`;function Ce(u){const n=o=>new a.Color(o);return[n(u[2]).multiplyScalar(1.05),n(u[3]).multiplyScalar(1.25),n("#5A1A16").multiplyScalar(.8),n("#7A2418").multiplyScalar(1.1),n(u[6]).multiplyScalar(1),n(u[5]).multiplyScalar(1.25)]}async function Me(u,n=512){const o=u.rng.fork("moonface"),r=u.noise,l=z=>{const c=new Float32Array(z*z*3);for(let k=0;k<z*z;k++)c[k*3]=.12+.76*o(),c[k*3+1]=.12+.76*o(),c[k*3+2]=o();return c},h=9+o.int(0,3),w=23+o.int(0,5),j=10+o.int(0,2),m=l(h),M=l(w),i=l(j),q=o.range(0,50),B=o.range(0,50),T=[0,0,0],p=(z,c,k,S)=>{const L=k*c,W=S*c,C=Math.floor(L),E=Math.floor(W);let _=9,O=9,F=0;for(let b=-1;b<=1;b++)for(let V=-1;V<=1;V++){const D=C+V,d=E+b;if(D<0||d<0||D>=c||d>=c)continue;const v=(d*c+D)*3,A=D+z[v]-L,H=d+z[v+1]-W,Y=A*A+H*H;Y<_?(O=_,_=Y,F=z[v+2]):Y<O&&(O=Y)}T[0]=Math.sqrt(_),T[1]=Math.sqrt(O),T[2]=F},R=new Uint8Array(n*n*4);for(let z=0;z<n;z++){z%5===0&&await u.yield();for(let c=0;c<n;c++){const k=(c+.5)/n,S=(z+.5)/n,L=r.n2(k*5+q,S*5+B)*.022,W=r.n2(k*5+B+9,S*5+q)*.022,C=ee(k+L,0,.9999),E=ee(S+W,0,.9999);p(m,h,C,E);const _=T[1]-T[0];p(M,w,C,E);const O=(T[1]-T[0])*.75+.07;p(i,j,C,E);const F=T[2]<.42,b=T[1]-T[0],V=.5+.5*r.fbm2(k*3.1+q,S*3.1-B,3),D=.5+.5*r.fbm2(k*26-q,S*26+B,3),d=F?.44+b*.9+(D-.5)*.16:.3-b*.3+(D-.5)*.1,v=(z*n+c)*4;R[v]=ee(Math.min(_,O)*1.5,0,1)*255,R[v+1]=ee(d,0,1)*255,R[v+2]=ee(V,0,1)*255,R[v+3]=ee(D,0,1)*255}}const x=new a.DataTexture(R,n,n,a.RGBAFormat,a.UnsignedByteType);return x.wrapS=x.wrapT=a.ClampToEdgeWrapping,x.minFilter=a.LinearMipmapLinearFilter,x.magFilter=a.LinearFilter,x.generateMipmaps=!0,x.colorSpace=a.NoColorSpace,x.needsUpdate=!0,x}function Re(u,n,o){const r=o==="half"?new a.Vector3(-.95,-.28,.06):o==="unlit"?new a.Vector3(0,0,-1):new a.Vector3(-.5,-.56,-.7);return{uMoonTex:{value:u},uMoonT:{value:0},uEarthGlow:{value:0},uMoonSun:{value:r.normalize()},uMoonCol:{value:Ce(n)},uMoonScar:{value:new a.Vector4(.2,.2,0,0)},uMoonDir:{value:new a.Vector3(0,Math.sin(ue),-Math.cos(ue))},uMoonRight:{value:new a.Vector3(1,0,0)},uMoonUp:{value:new a.Vector3(0,Math.cos(ue),Math.sin(ue))}}}function ke(u,n){const o=new a.ShaderMaterial({uniforms:{...u,uDist:{value:n},uHalf:{value:Math.tan(ge)*n*1.3}},transparent:!0,depthWrite:!1,fog:!1,vertexShader:`
      uniform vec3 uMoonDir, uMoonRight, uMoonUp; uniform float uDist, uHalf; varying vec2 vUv;
      void main(){ vUv = position.xy;
        vec3 wp = cameraPosition + uMoonDir * uDist + (uMoonRight * position.x + uMoonUp * position.y) * uHalf;
        gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.); }`,fragmentShader:`
      varying vec2 vUv;
      ${ye}
      void main(){ vec2 uv = vUv * 1.3; vec4 m = moonShade(uv, 0.);
        // a faint ember halo just outside the limb so the disc sits in thin vapour, not cut out of card
        float r = length(uv);
        float halo = exp(-max(r - 0.985, 0.) * 13.) * (1. - smoothstep(1.2, 1.3, r));
        vec3 hc = uMoonCol[0] * 0.22 * halo;
        gl_FragColor = vec4(mix(hc, m.rgb, m.a), max(m.a, halo * 0.55)); }`}),r=new a.Mesh(new a.PlaneGeometry(2,2),o);return r.frustumCulled=!1,r.renderOrder=-.5,r.name="emberMoon",r}function he(u,n={}){const o=n.ribDir??0,r=n.rng,l=n.thick??we,h=n.freeboard??le,w=h-l,j=n.ribW??1;let m=u.map(t=>[t[0],t[1]]),M=0;const i=m.length;for(let t=0;t<i;t++){const e=m[t],s=m[(t+1)%i];M+=e[0]*s[1]-s[0]*e[1]}M<0&&m.reverse();let q=0,B=0;for(const t of m)q+=t[0],B+=t[1];q/=i,B/=i;const T=new Float32Array(i),p=new Float32Array(i),R=new Float32Array(i);let x=0;for(let t=0;t<i;t++){const e=m[(t+i-1)%i],s=m[(t+1)%i];let y=s[0]-e[0],G=s[1]-e[1];const P=Math.hypot(y,G)||1;y/=P,G/=P,T[t]=G,p[t]=-y,R[t]=x;const K=m[t];x+=Math.hypot(s[0]-K[0],s[1]-K[1])}const z=Math.max(3,Math.round(x/j)),c=[],k=[],S=[],L=t=>{const e=c.length/3;for(let s=0;s<i;s++)t(s);return e},W=(t,e,s,y,G,P)=>{c.push(t,e,s),k.push(y,G,P)},C=(t,e)=>{for(let s=0;s<i;s++){const y=(s+1)%i;S.push(t+s,t+y,e+s,t+y,e+y,e+s)}},E=t=>{const e=c.length/3,s=n.shaderRibs?i+1:i;for(let y=0;y<s;y++)t(y%i,y);return e},_=(t,e)=>{if(!n.shaderRibs)return C(t,e);for(let s=0;s<i;s++)S.push(t+s,t+s+1,e+s,t+s+1,e+s+1,e+s)},O=(t,e)=>{for(let s=0;s<i;s++)S.push(t+s,t+(s+1)%i,e)},F=[],b=new Float32Array(i),V=new Float32Array(i),D=new Float32Array(i),d=new Float32Array(i);let v=0,A=0;for(let t=0;t<i;t++){v<=0&&r()<.05&&(v=1+Math.floor(r()*4),A=.15+r()*.5),b[t]=v>0?A*(.6+.4*r()):r()*.05,v--;const e=R[t]/x*z,s=Math.abs(Math.sin(e*Math.PI));V[t]=n.shaderRibs?.1:(1-s)*.32,d[t]=n.shaderRibs?-1:s,D[t]=(r()-.5)*.12}const H=(t,e)=>{const s=m[t],y=q-s[0],G=B-s[1],P=Math.hypot(y,G)||1,K=Math.min(e,P*.92)/P;return[s[0]+y*K,s[1]+G*K]},Y=(t,e)=>[m[t][0]-T[t]*e,m[t][1]-p[t]*e];let te=S.length;const oe=[0,.7,2.4,7].map((t,e)=>L(s=>{const y=e===0?Y(s,b[s]):H(s,t+b[s]);W(y[0],h-(e===0?.05:0)+(e>1?D[s]*.5:0),y[1],0,t,d[s])}));for(let t=0;t<oe.length-1;t++)C(oe[t],oe[t+1]);W(q,h,B,0,30,0),O(oe[oe.length-1],c.length/3-1),F.push([te,S.length,0]),te=S.length;const $=[[h-.05,0,0,1],[h-.14,-.05,0,.97],[h-.3,.03,0,.93],[h-.36,.3,.5,.9],[h-1.3,.22,1,.66],[h-2.3,.1,1,.42],[h-3.2,.34,.8,.2],[w,.85,.4,0]],Z=n.shaderRibs?i+1:i,N=$.map((t,e)=>E((s,y)=>{const G=t[1]+(e<3?b[s]:Math.max(b[s]-.2,0)*.4)+V[s]*t[2]+(e>2?D[s]:0),P=Y(s,G);W(P[0],(e<4?t[0]:h-(h-t[0])*(l/we))+(e>3&&e<7?D[s*7%i]:0),P[1],1,t[3],n.shaderRibs?-1-(y<i?R[y]:x)/x*z:d[s])}));for(let t=0;t<N.length-1;t++)_(N[t],N[t+1]);F.push([te,S.length,1]),te=S.length;const g=[.85,2.5,8].map((t,e)=>L(s=>{const y=e===0?Y(s,t+V[s]*.4+D[s]):H(s,t);W(y[0],w-(e>0?.15+D[s]:0),y[1],2,t,o)}));for(let t=0;t<g.length-1;t++)C(g[t],g[t+1]);W(q,w-.3,B,2,30,o),O(g[g.length-1],c.length/3-1),F.push([te,S.length,2]);for(const[t,e,s]of F){let y=0;for(let G=t;G<Math.min(e,t+600);G+=3){const P=S[G]*3,K=S[G+1]*3,ne=S[G+2]*3,X=c[K]-c[P],U=c[K+1]-c[P+1],Q=c[K+2]-c[P+2],J=c[ne]-c[P],ie=c[ne+1]-c[P+1],de=c[ne+2]-c[P+2],Se=U*de-Q*ie,pe=Q*J-X*de,ze=X*ie-U*J;y+=s===0?pe:s===2?-pe:Se*(c[P]-q)+ze*(c[P+2]-B)}if(y<0)for(let G=t;G<e;G+=3){const P=S[G+1];S[G+1]=S[G+2],S[G+2]=P}}const f=new a.BufferGeometry;return f.setAttribute("position",new a.Float32BufferAttribute(c,3)),f.setAttribute("aSlab",new a.Float32BufferAttribute(k,3)),f.setIndex(c.length/3>65535?new a.Uint32BufferAttribute(S,1):new a.Uint16BufferAttribute(S,1)),f.computeVertexNormals(),f.userData={centre:[q,B],perimeter:x,tris:S.length/3},f}function fe(u,n,o,r={}){const l=(h,w=1)=>({value:new a.Color(h).multiplyScalar(w)});return new a.ShaderMaterial({fog:!0,uniforms:{...a.UniformsLib.fog,...u,...r.uniforms||{},uTime:n.uTime,uSeaY:n.uSeaY,uOpen:n.uOpen,uSwell:n.uSwell||(n.uSwell=se()),uHeat:{value:r.heat??1},uAsh:{value:r.ash??0},uRough:{value:r.rough??.06},uRibW:{value:r.ribW??1},uThreads:{value:r.threads??0},uWallHeat:{value:r.wallHeat??1},uMirror:{value:r.mirror??1},uSheen:{value:r.sheen??0},uDrip:{value:r.drip??0},uStretch:{value:r.stretch??1},uCrescent:{value:new a.Vector3(-.55,.25,-.8).normalize()},uLamp:{value:new a.Vector4(0,0,0,0)},uFire:{value:[0,1,2,3].map(()=>new a.Vector4(0,0,1,0))},uStars:{value:r.stars??0},uVent:{value:new a.Vector4(0,0,1,0)},uBlack:l(o[0]),uGarnet:l(o[1]),uRed:l(o[2]),uOrange:l(o[3]),uGold:l(o[4]),uCream:l(o[5]),uCool:l(o[6])},vertexShader:`
      attribute vec3 aSlab; varying vec3 vWorld, vN, vSlab, vLocal, vNl; varying float vSeaY, vOpen;
      uniform float uSeaY, uOpen, uTime;
      #include <fog_pars_vertex>
      ${ce}
      ${r.xformPars||""}
      void main(){
        vec4 lp = vec4(position, 1.); vec3 n = normal; vec3 lpos = position; float open = uOpen;
        ${r.xformMain||""}
        #ifdef USE_INSTANCING
          lp = instanceMatrix * lp; n = mat3(instanceMatrix) * n;
        #endif
        vec4 wp = modelMatrix * lp; float lift = swellH(wp.xz); wp.y += lift; vSeaY = uSeaY + lift; vOpen = open;
        vWorld = wp.xyz; vN = mat3(modelMatrix) * n; vSlab = aSlab; vLocal = lpos; vNl = normal;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime, uSeaY, uOpen, uHeat, uAsh, uRough, uRibW, uThreads, uWallHeat, uMirror, uSheen, uDrip, uStretch; uniform vec3 uCrescent, uMoonDir, uMoonRight, uMoonUp; uniform vec4 uLamp; uniform vec4 uFire[4]; uniform float uStars; uniform vec4 uVent;
      uniform vec3 uBlack, uGarnet, uRed, uOrange, uGold, uCream, uCool;
      varying vec3 vWorld, vN, vSlab, vLocal, vNl; varying float vSeaY, vOpen;
      #include <fog_pars_fragment>
      ${be}
      ${ye}
      vec3 moonMirror(vec3 R, float lod){ // the Moon seen along a reflected ray
        float d = dot(R, uMoonDir); if (d <= 0.) return vec3(0.);
        vec2 uv = vec2(dot(R, uMoonRight), dot(R, uMoonUp)) / ${Math.sin(ge).toFixed(5)};
        if (dot(uv, uv) >= 1.) return vec3(0.);
        vec4 m = moonShade(uv, lod); return m.rgb * m.a; }
      void main(){
        vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
        vec3 Vv = cameraPosition - vWorld; vec3 V = Vv / max(length(Vv), 1e-3);
        // With antialiasing on, a far plate thinner than a pixel is shaded at the pixel's centre, which can lie far outside
        // the triangle: its varyings are then extrapolated, and an edge distance of minus many metres sent exp() to infinity
        // (one such sample turned the whole picture white through the resolve and the glow). So every varying that feeds
        // exp() or an unbounded sum is clamped to the range it has inside a triangle (use e and openC below, never
        // vSlab.y or vOpen directly), and the result is bounded. KEEP THIS: tools/dt/aacheck.mjs tests it.
        float h = vWorld.y - vSeaY, part = vSlab.x, e = max(vSlab.y, 0.), rib = vSlab.z, openC = clamp(vOpen, 0., 1.);
        float seaLit = exp(-max(h, 0.) / 7.);
        // rib coordinates and how fast they run across the screen, taken here, outside every branch: ribs finer than
        // about three pixels melt into their mean instead of shimmering
        float cua = cos(vSlab.z), sua = sin(vSlab.z);
        float lzS = vLocal.z * uStretch;      // (polish 5) the tent's side slabs are seen along their length, at a glancing angle: their crust broke in slabs longer that way (uStretch 0.42), so from the approach the net reads as polygons and not as parallel strokes
        vec2 uq = vec2(cua * vLocal.x + sua * lzS, -sua * vLocal.x + cua * lzS);          // underside: ribs run along uq.x
        vec2 uc = uq / 7.0 + (vec2(vnoise(uq * 0.045 + 3.), vnoise(uq * 0.045 + 41.)) - .5) * 1.3;     // underside: slabs of crust about 7 m across, their joints bent
        float uFw = fwidth(uc.x) + fwidth(uc.y), uKeep = 1. - smoothstep(0.16, 0.45, uFw), uKeepB = 1. - smoothstep(0.06, 0.17, uFw);
        float wAx = abs(vNl.x) > abs(vNl.z) ? vLocal.z : vLocal.x;      // (polish 4) along the wall, from the position alone: the fluted walls' normals swing from rib to rib, and a tangent taken from them tore the blocks into vertical streaks
        vec2 wq = vec2(wAx / 2.0, vLocal.y / 1.3);                                                     // wall: fracture blocks about 2 m by 1.3 m
        float wFw = fwidth(wq.x) + fwidth(wq.y), wKeepB = 1. - smoothstep(0.38, 0.95, wFw);      // (polish 4) the blocks hold to about 350 m: their joints widen to the pixel (below), so a far wall is still broken rock and not an even orange band
        float wKeep = 1. - smoothstep(0.22, 0.55, fwidth(vSlab.z));
        vec3 Rt0 = reflect(-V, N); float fs0 = 0.22 + 0.78 * (1. - clamp(dot(N, V), 0., 1.)) * (1. - clamp(dot(N, V), 0., 1.));
        vec2 sFw = fwidth(vec2(Rt0.x / max(abs(Rt0.z), 0.35), Rt0.y / max(length(Rt0.xz), 0.2)) * 85.);      // (polish 4) the mirrored stars: how wide a pixel is in their cells
        float eFw = min(fwidth(vSlab.y), 8.);      // (polish 5) how many metres of the rim coordinate one pixel covers: a shut joint thinner than the pixel is not drawn as a ruled line
        float tFw = min((fwidth(vLocal.x) + fwidth(vLocal.z)) / 9.0, 0.5);      // (polish 5) the top skin's sheets: how much of a sheet one pixel covers                                                                    // drip lines (the tent): how wide a pixel is across them
        float gGain = 0.7;
        if (rib < -0.5) { // ribs from the perimeter coordinate: columns of unequal width, not every joint alight, fading before they alias
          float rcw = -rib - 1.; rcw += 0.32 * sin(rcw * 1.7) + 0.24 * sin(rcw * 0.61 + 2.);
          gGain = 0.12 + 0.88 * hash21(vec2(floor(rcw), 3.)); rib = mix(0.62, abs(sin(rcw * 3.14159)), wKeep); }
        rib = clamp(rib, 0., 1.);
        vec3 col;
        if (part < 0.5) {
          // black glass skin: a rough mirror for the Moon (the glitter road), glow bleeding in from every edge
          vec2 q = vLocal.xz;
          float n1 = fbm3(q * 0.33), n2 = vnoise(q * 2.3);
          vec3 pn = vec3(vnoise(q * 1.3 + 3.1) - .5 + (vnoise(q * 6.1) - .5) * .6, 0., vnoise(q * 1.3 + 11.7) - .5 + (vnoise(q * 6.1 + 5.) - .5) * .6);
          float tw = uTime * 0.55 + vnoise(q * 0.7 + 9.) * 12.; pn += vec3(sin(tw), 0., cos(tw * 0.83 + 1.7)) * 0.24;   // heat off the crust: the glitter shimmers in place
          vec3 vT = voro(q / 9.0 + (vec2(vnoise(q * 0.05 + 3.), vnoise(q * 0.05 + 41.)) - .5) * 1.6 + (vec2(vnoise(q * 0.31 + 7.), vnoise(q * 0.31 + 23.)) - .5) * 0.30);   // sheets about 9 m across, edges wandering     // the skin froze in sheets about 6 m across
          vec3 fn = vec3(hash21(vec2(vT.z, 1.)) - .5, 0., hash21(vec2(vT.z, 2.)) - .5);                    // each at its own slight tilt
          float fsl = clamp(length(N.xz) / max(N.y, 0.05), 0., 1.);
          vec3 n = normalize(N + (pn * uRough + fn * 0.045) * (1. - 0.7 * uAsh));
          vec3 R = reflect(-V, n);
          float fres = 0.22 + 0.78 * pow(1. - clamp(dot(n, V), 0., 1.), 3.);
          float ml = max(dot(R, uMoonDir), 0.);
          float dv = length(Vv);
          col = uBlack * 1.1 + uGarnet * 0.05 * (0.6 + 0.8 * n1);
          vec3 mm = moonMirror(R, 2.5); mm = mix(mm, min(mm, uRed * 1.1), smoothstep(450., 1100., dv));      // (polish 4) far off the mirror keeps the Moon's red and drops its white limb: a pale half disc on the horizon read as a stray dome
          col += (mm * 1.15 + uMoonCol[0] * 0.30 * pow(ml, 160.)) * fres * (1. - 0.8 * uAsh) * uMirror;
          col += uCool * 0.05 * fres * max(dot(reflect(-V, N), uCrescent), 0.);
          { // (polish 4) THE BLACK MIRROR. Glass mirrors whatever stands over it, not the Moon alone: under every fountain a
            // column of gold glitter runs toward us (the rough skin breaks it, as it breaks the Moon's road), and where the
            // glass looks up past the Moon it carries the stars, each sheet shifting them by its own tilt.
            float rl = max(length(R.xz), 1e-3); vec2 rh = R.xz / rl; float tanE = max(R.y, 0.) / rl; float fireK = 0.;
            for (int i = 0; i < 4; i++) {
              vec2 fd = uFire[i].xy - vWorld.xz; float fl = max(length(fd), 1.); vec2 fdn = fd / fl;
              float sd = rh.x * fdn.y - rh.y * fdn.x, wA = 0.010 + 7. / fl, top = uFire[i].z / fl;
              fireK += exp(-min(sd * sd / (wA * wA), 30.)) * step(0., dot(rh, fdn)) * (1. - smoothstep(top * 0.35, top * 1.1, tanE)) * uFire[i].w * (1. - smoothstep(900., 1500., fl));
            }
            col += (uOrange * 0.5 + uGold * 1.5 + uCream * 0.5) * min(fireK, 1.5) * fres * (1. - 0.8 * uAsh) * uMirror;
            vec3 Rt = reflect(-V, normalize(N + fn * 0.06)); float rz = max(length(Rt.xz), 0.2);
            vec2 suv = vec2(Rt.x / max(abs(Rt.z), 0.35), Rt.y / rz) * 85.; vec2 sid = floor(suv), sf = fract(suv) - 0.5;
            float sh = hash21(sid + 3.1), sb = sh * sh; sb *= sb; sb *= sb;
            vec2 so = (vec2(hash21(sid + 7.7), hash21(sid + 19.3)) - 0.5) * 0.6;
            float sr = clamp(0.8 * (sFw.x + sFw.y), 0.09, 0.30);
            col += mix(vec3(1., 0.86, 0.74), vec3(0.80, 0.84, 1.0), hash21(sid + 5.)) * sb * step(0.60, sh) * (1. - smoothstep(sr * 0.4, sr, length(sf - so))) * min(1., 0.10 / sr + 0.2)
              * 1.1 * uStars * fs0 * smoothstep(0.02, 0.10, Rt.y) * (1. - uAsh) * (0.35 + 0.65 * (1. - openC));
          }
          vec3 Rs = reflect(-V, N); float fs = 0.22 + 0.78 * pow(1. - clamp(dot(N, V), 0., 1.), 3.);                    // from the smooth normal: a sheen, not a glitter
          // the skin is not one sheet of glass: flow bands and patches of duller crust take the horizon's garnet glow differently
          float streak = vnoise(q * vec2(0.07, 0.45) + 31.), gloss = (0.22 + 1.0 * n1 * n1 + 0.45 * streak * streak) * (0.45 + 1.1 * vT.z);
          col += (uBlack * 0.6 + (uGarnet * 0.85 + uRed * 0.07) * (0.15 + 0.85 * exp(-max(Rs.y, 0.) / 0.22))) * fs * uSheen * gloss * (1. - 0.6 * uAsh);
          // crazing: a net of fine cooling cracks, dull red while the crust is hot, never thinner than a pixel
          float cw = max(0.022 + dv * 0.00016, 0.7 * tFw);      // (polish 5) never thinner than the pixel's footprint: at a glancing angle the net is soft bands, not hairlines
          float craze = (1. - smoothstep(cw * 0.35, cw, vT.y)) * min(1., 0.022 / cw + 0.04) * smoothstep(0.6, 3.0, e) * (0.15 + 0.85 * smoothstep(0.35, 0.6, vnoise(q * 0.045 + 17.))) * (0.35 + 0.65 * smoothstep(0.3, 0.55, vnoise(q * 0.4 + 61.)));      // crazed in patches, each crack broken along its length
          float glowIn = exp(-max(vT.y, 0.) / 0.07) * smoothstep(0.6, 3.0, e) * (0.10 + 0.55 * fsl) * openC;          // a standing plate is hot inside: its joints shine
          col = mix(col, uBlack * 0.5, 0.5 * clamp(craze, 0., 1.)) + (uRed * (0.20 + 0.45 * openC + 0.9 * fsl * openC) + uOrange * 0.55 * fsl * openC) * craze * (0.4 + 0.6 * n2) * (1. - 0.7 * uAsh) + uRed * 0.30 * glowIn * (0.5 + n2);
          // fissures: in patches the skin has torn along the sheets' edges and the melt shines up through it, orange to gold
          float fis = (1. - smoothstep(cw * 1.2, cw * 4.5 + 0.02, vT.y)) * smoothstep(0.30, 0.62, vnoise(q * 0.06 + 71.)) * smoothstep(0.8, 3.5, e) * min(1., 0.05 / cw + 0.25);
          col += (uOrange * 0.85 + uGold * 0.5 * n2) * fis * (0.03 + 0.97 * openC * openC) * (1. - 0.7 * uAsh) * (1. - fsl) * (1. - fsl);      // (a standing plate keeps its dull red net: wide gold seams made it a giraffe)
          { // (polish 5) ONE LIT THING ON THE DARK FLOOR OF THE OPENING: a place where the skin has thinned over a welling of the melt
            // and its sheets are outlined in orange and gold (uVent: world x, z, radius, strength; 0 everywhere but the world's crust)
            vec2 vd = vWorld.xz - uVent.xy; float vk = exp(-min(dot(vd, vd) / max(uVent.z * uVent.z, 1.), 30.)) * uVent.w * (1. - openC) * (1. - 0.7 * uAsh);
            float vnet = (1. - smoothstep(0.02, 0.085, vT.y)) + 0.85 * exp(-max(vT.y, 0.) / 0.26);
            col += ((uOrange * 0.95 + uGold * 0.60 * n2) * vnet * (0.55 + 0.45 * sin(uTime * 0.8 + vT.z * 30.)) + uRed * 0.30 + uOrange * 0.10 * n1) * min(vk * 1.6, 1.) * smoothstep(0.3, 2.0, e);
          }
          col += uCool * (0.012 + 0.10 * smoothstep(0.72, 1.0, hash21(vec2(vT.z, 5.))) * fs0) * max(dot(N, uCrescent) + 0.35, 0.) * (0.5 + n1);      // the crescent's cool light: a glint on the sheets that face it (polish 4: it was an even wash, and the black mirror read as a grey pane)
          col = mix(col, uCool * 0.16 * (0.5 + n1), uAsh * smoothstep(0.8, 4., e));
          { // the tent's ring lays a road of cool glitter on its raft (uLamp.w is 0 on every other plate)
            vec3 Ld = uLamp.xyz - vWorld; float ld2 = dot(Ld, Ld); vec3 L = Ld / sqrt(max(ld2, 1e-4));
            float sp = max(dot(R, L), 0.); sp *= sp; sp *= sp; sp *= sp; sp *= sp; sp *= sp;
            col += uCool * uLamp.w * (3.0 * sp * fres + 0.035 * max(L.y, 0.) + 0.010) / (1. + ld2 / 5000.);
          }
          float jv = smoothstep(0.42, 0.80, vnoise(q * 0.19 + 13.)), jh = smoothstep(0.62, 0.9, vnoise(q * 0.47 + 29.)) * jv;      // (polish 4) a joint is not a ruled line: it glows in stretches, with hot spots where the melt stands close under it
          float lineK = mix(1. - smoothstep(0.07, 0.30, eFw), 1., openC), bleedK = mix(1. - smoothstep(0.35, 1.5, eFw), 1., openC);      // (polish 5) seen flat across the frame a shut joint was a straight red rule on the dark glass: it fades before it is thinner than the pixel
          float bleed = exp(-e / 1.25) * (0.05 + 0.30 * jv * (1. - openC) * bleedK + 0.95 * openC);
          col += mix(uRed, uOrange, exp(-e / 0.35)) * bleed * 1.2 * (0.6 + 0.8 * n2);
          col += (uRed * (0.05 + 1.3 * jv * jv + 0.9 * openC) + (uOrange * 0.9 + uGold * 0.5) * jh * (1. - openC)) * smoothstep(0.30, 0.0, e) * lineK;      // hairline joint, always
          if (uThreads > 0.01) { // an old raft: long red joints
            float jn = smoothstep(0.012, 0.0, abs(fbm3(q * 0.03 + 3.3) - 0.5));
            col += uRed * 0.45 * jn * uThreads * smoothstep(1.0, 4.0, e);
            col += (uRed * 0.50 + uOrange * 0.22) * exp(-e / 4.5) * uThreads * (0.45 + 0.9 * n1);      // (polish 5) the raft's shore is hot: its light reaches some metres in over the glass, so the dark island sits in the sea it floats on and is not a cut-out laid on it
          }
          { // spatter that has landed, cooling from white through red to black (everywhere once the crust has opened)
            vec2 cq = q / 4.4, ci = floor(cq), cf = fract(cq) - 0.5;
            float hh = hash21(ci), rr = 0.05 + 0.13 * hash21(ci + 7.);
            vec2 off = vec2(hash21(ci + 3.), hash21(ci + 5.)) * 0.5 - 0.25;
            float age = fract(hh * 7. + uTime * 0.05), spot = (1. - smoothstep(rr * 0.6, rr, length(cf - off))) * step(0.78, hh);
            vec3 sc = uOrange * 0.9;      // (no white-hot phase: one white dot on a dark plate, flattened by the view, read as a dash) sc = mix(sc, uRed * 0.45, smoothstep(0.08, 0.3, age)); sc = mix(sc, uBlack, smoothstep(0.3, 0.8, age));
            col = mix(col, sc, spot * max(uThreads, 0.65 * openC));
          }
          // flooding: the melt laps up a tilted plate in tongues that wander a metre or two and breathe, a wet sheen behind them
          float fh = clamp(0.7 * fsl, 0.035, 0.3);       // the advancing line stays a line on a nearly level plate
          float lapN = fbm3(q * 0.21 + 5.) - 0.5 + 0.35 * (vnoise(q * 0.9 + 2.) - 0.5);
          float hF = h - min(fsl, 0.3) * (lapN * 5.5 + 0.5 + 0.45 * sin(uTime * 0.9 + n1 * 9.) + 0.25 * sin(uTime * 1.7 + q.x * 0.4));
          float lapOn = smoothstep(0.03, 0.10, fsl);
          float fhL = max(fh, tFw * 9. * (0.35 + 2. * min(fsl, 0.3)));
          vec3 lapC = mix(uOrange * 0.78 + uGold * 0.12, uGold * 1.05 + uCream * 0.25, n2 * n2);
          col = mix(col, lapC, smoothstep(fh * 0.5, -fh * 0.5, hF) * lapOn);
          col += uOrange * 0.36 * smoothstep(0.3 + 1.2 * fsl, 0.0, hF) * (0.6 + 0.8 * n2) + (uGold * 0.9 + uCream * 0.55) * (1. - smoothstep(0., fhL, abs(hF))) * min(1., fh / fhL + 0.15);      // (polish 5) the lapping line is never thinner than the pixel's footprint: on a flooding plate seen flat it was a white hairline wandering across the rock
        } else if (part < 1.5) {
          // the wall: black glass lip, dark red ribbed band, orange, white-gold foot at the waterline
          float v = e;
          vec3 vW = voro(wq);
          // (polish 4) THE WALL IS ROCK: fracture blocks of dark crust, each with its own shade and a smooth grain, the melt's light
          // in every joint (white-gold and wide at the foot, a red thread under the lip); the face itself glows only in its
          // lowest quarter. It was an even orange bar with a stretched, blocky noise on it, which close up read as a smear.
          float jw = 0.05 + 0.13 * (1. - v);
          float jwE = max(jw, 0.9 * min(wFw, 2.));
          float joint = mix(0.30, (1. - smoothstep(jwE * 0.35, jwE, vW.y)) * min(1., jw / jwE + 0.15), wKeepB), blockV = mix(0.5, vW.z, wKeepB);
          float groove = joint, gr = joint, face = 1. - joint;
          float rk = fbm3(vec2(wAx * 0.9, vLocal.y * 1.4) + blockV * 17.);
          float rkH = fbm3(vec2(wAx * 0.31, vLocal.y * 0.45) + 3.);      // (polish 5) the heat climbs the face as one wavering field: taken block by block, the white foot ended in a staircase
          float heat = smoothstep(0.05, 1.0, (1. - v) * 0.85 + (rkH - .5) * 0.34);
          float stretch = smoothstep(0.30, 0.68, vnoise(vec2((vLocal.x - vLocal.z) * 0.085, 3.7)));          // whole stretches of a wall have cooled: it is not one even bar of light
          heat *= 1. - 0.40 * smoothstep(4., 22., h);                                                         // an edge lifted high above the melt has cooled: orange, not white
          heat = max(heat * uWallHeat * (0.58 + 0.52 * stretch), smoothstep(1.5, 0.0, h) * 0.88 * (0.5 + 0.5 * uWallHeat));
          vec3 g = mix(uRed * 0.5, uOrange * 1.0, smoothstep(0.25, 0.58, heat));
          g = mix(g, uGold * 1.5, smoothstep(0.6, 0.86, heat));
          g = mix(g, uCream * 1.55 + uGold * 0.35, smoothstep(0.9, 1.0, heat));      // (polish 5: was cream at 2.3; the foot of a wall seen end-on clipped to flat white boxes with a stepped outline)
          float crust = face * (1. - smoothstep(0.66, 0.96, heat)) * (0.74 + 0.26 * blockV);
          vec3 rock = (uGarnet * 0.60 + uRed * 0.10) * (0.35 + 1.1 * rk) * (0.55 + 0.9 * blockV) + g * 0.09 + uCool * 0.035 * max(dot(N, uCrescent), 0.) * blockV;
          g = mix(g * (1. + 0.8 * gr), rock, crust);
          g += uGold * 0.12 * seaLit * max(-N.y + 0.3, 0.);
          vec3 R = reflect(-V, N);
          vec3 lip = uBlack * 1.4 + uMoonCol[0] * 0.9 * pow(max(dot(R, uMoonDir), 0.), 30.)
            + uCool * 0.55 * max(dot(N, uCrescent), 0.) * (0.4 + 0.6 * pow(1. - clamp(dot(N, V), 0., 1.), 2.))
            + uGold * 0.9 * max(-N.y, 0.) * seaLit + uRed * 0.25 * groove + uRed * 0.50 * (1. - openC) * (1. - smoothstep(35., 120., length(Vv)));      // (polish 3) while the crust is shut a joint is a red hairline, not a black bar
          col = mix(g, lip, smoothstep(0.895, 0.93, v));
        } else {
          // underside: a ceiling of crust that froze in slabs about 7 m across and is coming apart: dark polygons, each at
          // its own tilt, the melt shining through every joint (white-gold where it has just left the sea, dull red toward
          // the lip), finer cracks in patches. No ruled ribs: seen close it must read as broken rock, not as stripes.
          vec3 vA = voro(uc), vB = voro(uc * 2.7 + 7.3);
          float patchy = fbm3(uq * 0.045 + 7.3);
          float grade = mix(1.30, 0.30, smoothstep(0., 24., h));                           // hottest where it has just left the melt
          float heat = uHeat * grade * (0.40 + 1.25 * smoothstep(0.18, 0.82, patchy)), hk = clamp(heat, 0., 1.4);
          float wA = 0.035 + 0.075 * hk, wB = 0.05 + 0.07 * hk;
          float uPx = 0.9 * min(uFw, 0.5), wAe = max(wA, uPx), wBe = max(wB, uPx * 2.7);      // (polish 5) a joint is never thinner than the pixel's footprint: seen far off or at a glancing angle it is a wider, dimmer band, not a bright hairline (the foot of the gate read as white scratches)
          float cA = (1. - smoothstep(wAe * 0.3, wAe, vA.y)) * min(1., wA / wAe + 0.12);                                                  // the wide joints between slabs
          float cB = (1. - smoothstep(wBe * 0.3, wBe, vB.y)) * min(1., wB / wBe + 0.12) * smoothstep(0.38, 0.62, vnoise(uq * 0.08 + 5.) + hk * 0.25) * uKeepB;   // finer cracks, in patches
          float halo = exp(-max(vA.y, 0.) / (0.06 + 0.07 * hk));
          float crack = mix(0.20, max(cA, cB * 0.6) + 0.30 * halo, uKeep);               // far off, the net melts into its mean
          float facet = mix(0.6, 0.30 + 0.60 * vA.z + 0.35 * vB.z * uKeepB + 0.17 * (1. - uKeepB), uKeep);                             // every polygon froze at its own tilt and takes the sea's light differently
          float T = heat * (0.16 * facet + 1.05 * crack) + 0.42 * facet * smoothstep(1.0, 2.1, heat);      // (polish 5) where it has just left the melt the rock itself still glows: the joints are brighter lines on orange, not white lines on black
          col = (uGarnet * 0.42 + uRed * 0.05) * (0.35 + 0.9 * facet) * (0.75 + 0.5 * vnoise(uq * 2.3));
          col = mix(col, uRed * 0.80, smoothstep(0.10, 0.34, T));
          col = mix(col, uOrange * 0.95, smoothstep(0.34, 0.68, T));
          col = mix(col, uGold * 1.12, smoothstep(0.70, 1.15, T));
          col = mix(col, mix(uGold * 1.25 + uOrange * 0.2, uCream * 1.6, uKeepB * smoothstep(0.5, 1.0, cA)), smoothstep(1.3, 2.0, T));      // (polish 5) white only in the body of a wide joint seen close: a fine crack or a far one stops at gold (white hairlines at the foot of the gate read as scratches)
          col += uOrange * 0.07 * seaLit * facet;
          // the ring's cool light on the rock round it (the tent only: uLamp.w is 0 elsewhere)
          vec3 Ld = uLamp.xyz - vWorld; float ld2 = dot(Ld, Ld);
          col += uCool * uLamp.w * (0.25 + 0.9 * facet) * (1. - 0.6 * crack) * max(dot(N, Ld) / sqrt(max(ld2, 1e-4)), 0.) / (1. + ld2 / 900.);
          if (uDrip > 0.01) { // (polish 5) THE TENT'S UNDERSIDES ARE ROCK WITH LIGHT COMING THROUGH. The weeping threads of polish 3 and 4
            // read, close, as a stretched texture of parallel scratches. They are gone. The cooled ceiling is the broken crust it
            // is everywhere else (slabs about 7 m across, each at its own tilt, a grain at two scales), and the melt behind it
            // shows through the wide joints as gold, joint by joint, each breathing slowly on its own, with a soft halo on the
            // rock either side; the sea's light climbs the faces from the foot.
            float br = 0.5 + 0.5 * sin(uTime * 0.6 + vA.z * 40. + patchy * 9.);
            float lit = smoothstep(0.34, 0.74, vnoise(uq * 0.11 + 19.) + 0.22 * br - 0.10) * mix(0.30, 1., smoothstep(0.10, 0.36, abs(dot(N, V))));
            float jwT = 0.070, jwE = max(jwT, uPx), cT = (1. - smoothstep(jwE * 0.25, jwE, vA.y)) * min(1., jwT / jwE + 0.12) * uKeep;                 // joints about half a metre wide
            float seamH = exp(-max(vA.y, 0.) / 0.17) * uKeep;                                           // and a metre of their light on the rock either side
            float fine = (1. - smoothstep(0.02, 0.07, vB.y)) * uKeepB;                                  // the second scale: hair fractures across each slab, dark
            float grainR = fbm3(uq * 0.9 + vA.z * 31.), pit = vnoise(uq * 4.3 + vA.z * 9.);
            col *= (0.40 + 1.05 * vA.z) * (0.46 + 0.95 * grainR) * (0.74 + 0.52 * pit * pit * uKeepB) * (1. - 0.60 * fine);
            col = mix(col, uBlack * 0.5, 0.75 * cT);
            col += ((uRed * 0.62 + uOrange * 0.50) * cT * (0.45 + 0.75 * patchy) + (uOrange * 0.45 + uGold * 1.00) * cT * lit
              + (uRed * 0.40 + uOrange * 0.34) * seamH * lit + uRed * 0.13 * seamH) * uDrip * smoothstep(0.5, 2.5, e);
            col += (uOrange * 0.055 + uGold * 0.025) * (0.3 + vA.z) * exp(-max(h, 0.) / 16.) * uDrip;
          }
          col += uOrange * 0.9 * exp(-e / 1.4) * clamp(heat + 0.25, 0., 1.);
          col += uGold * 0.16 * seaLit * max(-N.y, 0.) + uCream * 2.0 * smoothstep(0.4, 0.0, h);
        }
        gl_FragColor = vec4(clamp(col, 0., 40.), 1.);
        #include <fog_fragment>
      }`})}function Te(u,n,o,r){const l=[],h=u.length;for(let w=0;w<h;w++){const j=u[w],m=u[(w+1)%h],M=n*j[0]+o*j[1]-r,i=n*m[0]+o*m[1]-r;if(M<=0&&l.push(j),M<0&&i>0||M>0&&i<0){const q=M/(M-i);l.push([j[0]+(m[0]-j[0])*q,j[1]+(m[1]-j[1])*q])}}return l}function Fe(u,n){const o=p=>n.range(-p,p),r=o(5),l=n.chance(.5)?1:-1,h=[[-40+o(2),r+o(3),0,"gateL"],[40+o(2),r+o(3),0,"gateR"],[o(1.5),r,-480,"corridor"],[-36+o(4),104+o(5),40,"tipper"],[-55+o(8),-78+o(8),0,""],[6+o(8),-84+o(8),0,""],[62+o(8),-74+o(8),0,""],[-116+o(8),-42+o(8),0,""],[116+o(8),-36+o(8),0,""],[-120+o(6),34+o(8),0,""],[120+o(6),38+o(8),0,""],[-112+o(6),96+o(8),0,""],[84+o(6),90+o(8),0,""],[-52+o(8),166+o(6),0,""],[50+o(8),162+o(6),0,""],[o(10),-148+o(6),0,""],[-92+o(8),-128+o(6),0,""],[96+o(8),-122+o(6),0,""],[32+o(5),114+o(6),0,""]],w=152,j=178,m=14,M=[];for(let p=0;p<40;p++){const R=p/40*Math.PI*2,x=1+o(.035);M.push([Math.cos(R)*w*x,m+Math.sin(R)*j*x])}const i=[];for(let p=0;p<3;p++)i.push([n.range(.035,.06)*(p+1),n.range(0,6.28),n.range(1.6,2.6)/(p+1),n.range(.035,.06)*(p+1),n.range(0,6.28),n.range(1.6,2.6)/(p+1)]);const q=(p,R)=>{let x=0,z=0;for(const c of i)x+=Math.sin(R*c[0]+c[1])*c[2],z+=Math.sin(p*c[3]+c[4])*c[5];return[p+x,R+z]},B=u.noise,T=[];for(let p=0;p<h.length;p++){let R=M.slice();const x=h[p];for(let O=0;O<h.length&&R.length>2;O++){if(O===p)continue;const F=h[O],b=2*(F[0]-x[0]),V=2*(F[1]-x[1]),D=F[0]*F[0]+F[1]*F[1]-x[0]*x[0]-x[1]*x[1]-F[2]+x[2];R=Te(R,b,V,D)}if(R.length<3)continue;const z=x[3],c=z==="gateL"||z==="gateR"||z==="tipper"?.6:z==="corridor"?1.2:2.2,k=[];for(let O=0;O<R.length;O++){const F=R[O],b=R[(O+1)%R.length],V=Math.hypot(b[0]-F[0],b[1]-F[1]),D=Math.max(1,Math.round(V/c));for(let d=0;d<D;d++){const v=F[0]+(b[0]-F[0])*d/D,A=F[1]+(b[1]-F[1])*d/D,H=q(v,A);k.push([H[0]+B.n2(H[0]*.075+11,H[1]*.075)*2.6+B.n2(H[0]*.31,H[1]*.31)*.7+B.n2(H[0]*1.3+40,H[1]*1.3)*.16,H[1]+B.n2(H[0]*.075,H[1]*.075+23)*2.6+B.n2(H[0]*.31+90,H[1]*.31+20)*.7+B.n2(H[0]*1.3,H[1]*1.3+70)*.16])}}let S=1e9,L=-1e9,W=1e9,C=-1e9,E=0,_=0;for(const O of k)S=Math.min(S,O[0]),L=Math.max(L,O[0]),W=Math.min(W,O[1]),C=Math.max(C,O[1]),E+=O[0],_+=O[1];E/=k.length,_/=k.length,T.push({role:z,seed:[x[0],x[1],x[2]],pts:k,cx:E,cz:_,minX:S,maxX:L,minZ:W,maxZ:C})}return{plates:T,seeds:h,warp:i,mirror:l,gz:r}}function Be(u,n,o,r){const l=u.seeds.length,h=(M,i=1)=>({value:new a.Color(M).multiplyScalar(i)}),w=new a.ShaderMaterial({fog:!0,transparent:!0,uniforms:{...a.UniformsLib.fog,uTime:n.uTime,uOpen:n.uOpen,uGold2:n.uGold2,uRadius:{value:r},uSwell:n.uSwell||(n.uSwell=se()),uSeeds:{value:u.seeds.map(M=>new a.Vector3(M[0],M[1],M[2]))},uWarpA:{value:u.warp.map(M=>new a.Vector3(M[0],M[1],M[2]))},uWarpB:{value:u.warp.map(M=>new a.Vector3(M[3],M[4],M[5]))},uBlack:h(o[0]),uGarnet:h(o[1]),uRed:h(o[2]),uOrange:h(o[3]),uGold:h(o[4]),uCream:h(o[5])},vertexShader:`
      varying vec2 vP; varying vec3 vWorld;
      #include <fog_pars_vertex>
      ${ce}
      void main(){ vP = position.xz; vec4 wp = modelMatrix * vec4(position, 1.); wp.y += swellH(wp.xz); vWorld = wp.xyz;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime, uOpen, uGold2, uRadius; uniform vec3 uSeeds[${l}]; uniform vec3 uWarpA[3]; uniform vec3 uWarpB[3];
      uniform vec3 uBlack, uGarnet, uRed, uOrange, uGold, uCream;
      varying vec2 vP; varying vec3 vWorld;
      #include <fog_pars_fragment>
      ${be}
      void main(){
        vec2 p = vP, u = p;
        for (int k = 0; k < 3; k++) { u.x -= sin(p.y * uWarpA[k].x + uWarpA[k].y) * uWarpA[k].z; u.y -= sin(p.x * uWarpB[k].x + uWarpB[k].y) * uWarpB[k].z; }
        float b1 = 1e9, b2 = 1e9; vec2 s1 = vec2(0.), s2 = vec2(1., 0.);
        for (int i = 0; i < ${l}; i++) { vec3 s = uSeeds[i]; vec2 d = u - s.xy; float pd = dot(d, d) - s.z;
          if (pd < b1) { b2 = b1; s2 = s1; b1 = pd; s1 = s.xy; } else if (pd < b2) { b2 = pd; s2 = s.xy; } }
        float bd = (b2 - b1) / (2. * max(length(s2 - s1), 1.));
        float er = length(vec2(u.x / 152., (u.y - 14.) / 178.));
        float inPatch = 1. - smoothstep(0.84, 0.93, er);
        bd = mix(40., bd, inPatch);
        // the melt: slow bright streams
        vec2 fl = p * 0.045 + uTime * vec2(0.035, 0.012);
        float m1 = fbm3(fl), m2 = fbm3(fl * 2.7 - uTime * vec2(0.02, 0.05) + 4.);
        vec3 melt = mix(uRed * 0.55 + uOrange * 0.16, uOrange * 0.72 + uGold * 0.14, smoothstep(0.3, 0.85, m1 * 0.55 + m2 * 0.55));
        // skin: black feathers that freeze across open melt and tear again
        vec2 sp = p * 0.085 + uTime * vec2(0.05, 0.018);
        float sk = fbm3(sp) * 0.7 + fbm3(sp * 3.1 + 7. - uTime * 0.03) * 0.3;
        float feather = vnoise(p * vec2(0.55, 2.1) + sk * 6.) * 0.10 + vnoise(p * 3.7) * 0.04;
        float th = 0.54 - 0.06 * uGold2 + 0.035 * sin(uTime * 0.23 + m1 * 9.);
        float sd = sk + feather - th;                     // < 0 skin, > 0 open
        float skin = 1. - smoothstep(-0.015, 0.015, sd);
        float tear = exp(-abs(sd) * 160.) + smoothstep(0.02, 0.0, abs(fract(sk * 11. + feather * 4.) - 0.5)) * skin * 0.35;
        // joints and leads between plates: white-gold, widening as the crust opens
        float lead = (1. - smoothstep(0.15, 0.8 + 2.2 * uOpen, bd)) * (1. - 0.85 * uGold2);
        skin *= 1. - lead;
        vec3 skinC = uBlack * 1.5 + uGarnet * 0.22 * (0.5 + m2) + uRed * 0.25 * smoothstep(0.05, 0.0, -sd);
        vec3 col = mix(melt, skinC, skin * 0.96);
        col += (uOrange * 1.1 + uGold * 0.9) * tear * (1. - lead);
        col = mix(col, mix(uOrange * 1.0 + uGold * 0.4, uGold * 1.5 + uCream * 0.6, lead * lead * lead), lead * 0.9);
        float a = 1. - smoothstep(0.90, 1.0, length(p) / uRadius);
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
      }`}),j=new a.RingGeometry(.01,r,72,14);j.rotateX(-Math.PI/2);const m=new a.Mesh(j,w);return m.name="meltSea",m.renderOrder=1,m}const me=`
  float fogK = 0.;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      fogK = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      fogK = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #endif`;function Ge(u,n,o,r,l=1){const h=(L,W=1)=>({value:new a.Color(L).multiplyScalar(W)}),w=Math.round(600*l),j=u.length*w,m=new Float32Array(j*4),M=new Float32Array(j*4);for(let L=0;L<u.length;L++)for(let W=0;W<w;W++){const C=(L*w+W)*4,E=u[L];m[C]=E.x,m[C+1]=E.y??0,m[C+2]=E.z,m[C+3]=E.height,M[C]=r(),M[C+1]=r(),M[C+2]=r(),M[C+3]=r()}const i=new a.InstancedBufferGeometry;i.setAttribute("position",new a.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),i.setIndex([0,1,2,0,2,3]),i.setAttribute("aBase",new a.InstancedBufferAttribute(m,4)),i.setAttribute("aRnd",new a.InstancedBufferAttribute(M,4)),i.instanceCount=j;const q={...a.UniformsLib.fog,uTime:n.uTime,uResY:n.uResY,uFount:n.uFount,uSwell:n.uSwell||(n.uSwell=se()),uOrange:h(o[3]),uGold:h(o[4]),uCream:h(o[5]),uRed:h(o[2])},B=new a.Mesh(i,new a.ShaderMaterial({uniforms:q,fog:!0,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,vertexShader:`
      attribute vec4 aBase, aRnd; uniform float uTime, uResY, uFount; varying vec2 vC; varying float vAge, vSz;
      #include <fog_pars_vertex>
      ${ce}
      void main(){
        const float G = 9.8;
        float jet = floor(aRnd.z * 5.), jr = fract(sin(jet * 12.9898 + aBase.x) * 43758.5453);   // five wandering jets throw the arcs
        float H = aBase.w * (0.74 + 0.26 * jr) * (0.84 + 0.16 * aRnd.x);
        float v0 = sqrt(2. * G * max(H, 0.1)), T = 2. * v0 / G;
        float t = fract(uTime / T + aRnd.y) * T, te = uTime - t;
        float br = (0.88 + 0.12 * (0.5 + 0.5 * sin(te * 1.885 + aBase.x))) * uFount;   // height breathes at 0.3 Hz, set at launch
        v0 *= br;
        float fat = step(0.72, aRnd.w);                                                 // one drop in four is a fat gob of melt
        float ang = jet * 1.2566 + jr * 3. + sin(te * 0.5 + jet) * 0.35 + (aRnd.w - 0.5) * 0.20;       // each jet throws one sheet
        float vh = (0.09 + 0.20 * fract(jr * 7.3) + 0.05 * (aRnd.x - 0.5)) * v0;       // heavy low arcs
        vec3 vel0 = vec3(cos(ang) * vh, v0, sin(ang) * vh);
        vec3 p = aBase.xyz + vel0 * t - vec3(0., 0.5 * G * t * t, 0.);
        vec3 vel = vel0 - vec3(0., G * t, 0.);
        float alive = step(aBase.y - 0.5, p.y) * step(0.02, uFount) * smoothstep(0.0, 0.05, t / T);   // nothing piles up at the vent
        vec4 wb = modelMatrix * vec4(aBase.xyz, 1.); vec4 wq = modelMatrix * vec4(p, 1.); wq.y += swellH(wb.xz);
        vec4 mv = viewMatrix * wq;
        vec2 dir = (viewMatrix * modelMatrix * vec4(vel, 0.)).xy; float sp = length(dir);
        dir = sp > 1e-3 ? dir / sp : vec2(0., 1.);
        float px = -mv.z * 2. / (projectionMatrix[1][1] * max(uResY, 100.));
        float land = smoothstep(0.955, 1.0, t / T);                                    // the last instant: it spreads where it lands
        float w = max((0.14 + 0.36 * aRnd.y * aRnd.w + 0.75 * fat * aRnd.y) * (0.6 + 0.4 * aBase.w / 50.) * (1. + 3.5 * land), px * (1. + 0.6 * fat)) * alive;
        float len = (w + clamp(sp * (0.16 + 0.10 * fat), 0.1, 7.0) * (1. - 0.8 * land)) * alive;
        dir = normalize(mix(dir, vec2(1., 0.), land * 0.999) + vec2(0., 1e-4));
        mv.xy += dir * position.y * len + vec2(dir.y, -dir.x) * position.x * w;
        vC = position.xy; vAge = t / T; vSz = land;
        vec4 mvPosition = mv; gl_Position = projectionMatrix * mv;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uOrange, uGold, uCream, uRed; varying vec2 vC; varying float vAge, vSz;
      #include <fog_pars_fragment>
      void main(){
        float hy = vC.y * 0.5 + 0.5;                                   // 0 tail .. 1 head: a teardrop along its velocity
        float d = (1. - smoothstep(0.35, 1.0, abs(vC.x) / mix(0.3, 1.0, hy * hy))) * (1. - smoothstep(0.8, 1.0, hy)) * mix(0.15, 1.0, hy * hy);
        vec3 col = mix(uCream * 1.6 + uGold * 0.8, uGold * 2.0, smoothstep(0.0, 0.3, vAge));
        col = mix(col, uOrange * 1.6, smoothstep(0.5, 0.85, vAge)); col = mix(col, uRed * 1.2, smoothstep(0.88, 0.96, vAge) * (1. - vSz));
        col = mix(col, uGold * 1.5 + uCream * 0.5, vSz * (1. - vSz) * 3.);                // a splash of gold as it lands
        ${me}
        gl_FragColor = vec4(col * d * 0.7 * (1. - fogK), 1.);
      }`}));B.frustumCulled=!1,B.name="fountainDrops",B.renderOrder=3;const T=14,p=[],R=[],x=[],z=[];for(let L=0;L<u.length;L++)for(let W=0;W<3;W++){const C=u[L],E=r()*6.283,_=r()*10,O=.62+.3*r(),F=p.length/3;for(let b=0;b<=T;b++)for(let V=-1;V<=1;V+=2)p.push(V,b/T,0),R.push(C.x,C.y??0,C.z,C.height*O),x.push(E,_,W);for(let b=0;b<T;b++){const V=F+b*2;z.push(V,V+1,V+2,V+1,V+3,V+2)}}const c=new a.BufferGeometry;c.setAttribute("position",new a.Float32BufferAttribute(p,3)),c.setAttribute("aBase",new a.Float32BufferAttribute(R,4)),c.setAttribute("aRnd",new a.Float32BufferAttribute(x,3)),c.setIndex(z);const k=new a.Mesh(c,new a.ShaderMaterial({uniforms:q,fog:!0,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,side:a.DoubleSide,vertexShader:`
      attribute vec4 aBase; attribute vec3 aRnd; uniform float uTime, uFount; varying vec2 vUv; varying float vH, vPh;
      #include <fog_pars_vertex>
      ${ce}
      void main(){
        float v = position.y, br = (0.88 + 0.12 * (0.5 + 0.5 * sin(uTime * 1.885 + aBase.x - v * 2.5))) * uFount;
        float H = aBase.w * br * br;
        vec3 lean = vec3(cos(aRnd.x), 0., sin(aRnd.x));
        vec3 p = aBase.xyz + vec3(0., v * H, 0.) + lean * (v * v * aBase.w * 0.10 + sin(v * 5. - uTime * 2.6 + aRnd.y) * 0.5 * v);
        vec3 right = normalize(vec3(viewMatrix[0][0], 0., viewMatrix[2][0]) + vec3(1e-5, 0., 0.));
        float w = mix(7.0, 0.7, pow(clamp(v, 0., 1.), 0.5)) * (0.45 + 0.55 * aBase.w / 50.) * (1. - 0.25 * aRnd.z) * step(0.02, uFount);
        vec4 wb = modelMatrix * vec4(aBase.xyz, 1.); vec4 wp = modelMatrix * vec4(p, 1.); wp.y += swellH(wb.xz); wp.xyz += right * position.x * w;
        vUv = vec2(position.x, v); vH = aBase.w; vPh = aRnd.y;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime; uniform vec3 uOrange, uGold, uCream; varying vec2 vUv; varying float vH, vPh;
      #include <fog_pars_fragment>
      float h1(float x){ return fract(sin(x * 127.1) * 43758.5453); }
      float n1(float x){ float i = floor(x), f = fract(x); f = f * f * (3. - 2. * f); return mix(h1(i), h1(i + 1.), f); }
      void main(){
        float prof = 1. - vUv.x * vUv.x; prof *= prof;
        float flow = 0.55 + 0.45 * n1(vUv.y * vH * 0.35 - uTime * 4.5 + vPh * 3.) * (0.6 + 0.4 * n1(vUv.x * 2. + vUv.y * 9. + vPh));
        vec3 col = mix(uCream * 1.5 + uGold * 0.9, uGold * 1.6, smoothstep(0.0, 0.6, vUv.y)); col = mix(col, uOrange * 1.3, smoothstep(0.6, 1.0, vUv.y));
        float a = 0.80 * prof * flow * (1. - smoothstep(0.7, 1.0, vUv.y)) * smoothstep(0.0, 0.03, vUv.y);
        ${me}
        gl_FragColor = vec4(col * a * (1. - fogK), 1.);
      }`}));k.frustumCulled=!1,k.name="fountainCores",k.renderOrder=3;const S=new a.Group;return S.add(B,k),S.name="fountains",S}const I=Ae;async function qe(u,n={}){const o=n.palette&&n.palette.length>=7?n.palette:ve,r=ee(n.detail??u.quality?.detail??1,.6,1),l=u.rng.fork("ember-moon-hero"),h=n.moonPhase??(l()<.64?"crescent":l()<.5?"half":"unlit"),w=n.crust??(l()<.6?"glass":l()<.5?"ash":"young"),j=n.seaRadius??260,m=new a.Group;m.name="emberMoonTide";const M=await Me(u,384),i=Re(M,o,h),q={dir:i.uMoonDir.value.clone(),right:i.uMoonRight.value.clone(),up:i.uMoonUp.value.clone()};await u.yield();let B=null;n.moon!==!1&&(B=ke(i,4500),m.add(B));const T={uTime:{value:0},uSeaY:{value:0},uOpen:{value:0},uGold2:{value:0},uResY:{value:1080},uFount:{value:0},uSwell:se()},p=fe(i,T,o,{heat:1,ash:w==="ash"?.8:0,rough:w==="young"?.09:.06,ribW:1}),R=w==="ash"?8:w==="young"?4.5:6.5,x=Fe(u,l);await u.yield();const z=[],c={};for(const g of x.plates){const f=g.role,t=g.maxX-g.minX,e={role:f,sh:l.range(.04,.1),bobW:6.283/l.range(5,8),bobP:l.range(0,6.283),bobA:l.range(.2,.45),tiltBob:l.range(.008,.022),bobAx:l.range(0,6.283),ang:0,p0:.2,sink:0,ps:2,drift:[0,0],px:g.cx,pz:g.cz,rx:1,rz:0,L:0};let s=-1;if(f==="gateL"||f==="gateR"){const U=l.range(46,60)*Math.PI/180;e.rx=(f==="gateL"?1:-1)*Math.cos(U),e.rz=Math.sin(U),s=3,e.sh=.03,e.bobA=.12,e.tiltBob=.006,c[f]={k:e,pl:g}}else if(f==="tipper")e.rx=-Math.cos(xe),e.rz=-Math.sin(xe),e.px=g.cx-e.rx*t*.16,e.pz=g.cz-e.rz*t*.16,e.sh=.03;else if(f==="corridor")e.rx=0,e.rz=l.chance(.5)?1:-1,e.ang=l.range(.05,.12),e.sink=9,e.ps=.1,e.sh=.12;else{const U=l.range(0,6.283),Q=Math.hypot(g.cx,g.cz);e.rx=Math.cos(U),e.rz=Math.sin(U),e.ang=l.range(.05,.24),e.p0=l.range(.1,.45);const J=l.range(2,9)/Math.max(Q,1);e.drift=[g.cx*J,g.cz*J],l.chance(.36)&&(e.sink=l.range(7,11),e.ps=l.range(.55,.82)),Math.abs(g.cx)<48&&g.cz<-40&&(e.sink=11,e.ps=.33,e.ang=Math.min(e.ang,.09))}if(s>=0){let U=1e9,Q=-1e9;for(const J of g.pts){const ie=(J[0]-g.cx)*e.rx+(J[1]-g.cz)*e.rz;U=Math.min(U,ie),Q=Math.max(Q,ie)}e.px=g.cx+e.rx*(U+s),e.pz=g.cz+e.rz*(U+s),e.L=Q-U-s,e.ang=Math.min(Math.asin(ee(l.range(27,30)/e.L,0,.6)),.5)}const y=-Math.atan2(e.rz,e.rx),G=Math.cos(y),P=Math.sin(y);e.qYaw=new a.Quaternion().setFromAxisAngle(new a.Vector3(0,1,0),y);const K=g.pts.map(U=>{const Q=U[0]-e.px,J=U[1]-e.pz;return[Q*G-J*P,Q*P+J*G]}),ne=he(K,{rng:l,thick:R,ribW:R/4,ribDir:s>=0?Math.atan2(G,-P):0,shaderRibs:!(f==="gateL"||f==="gateR"||f==="tipper")}),X=new a.Mesh(ne,p);X.name="plate-"+(f||z.length),X.position.set(e.px,0,e.pz),X.frustumCulled=!1,m.add(X),z.push({mesh:X,k:e,pl:g}),s>=0&&(c[f].mesh=X,c[f].outline=K,c[f].centre=ne.userData.centre),await u.yield()}const k=[c.gateL,c.gateR].filter(Boolean),S=Le(k,T,o,l,r,le-R);m.add(S.mesh);let L=null;j>0&&(L=Be(x,T,o,j),m.add(L));const W=-80+l.range(-5,5),C=-78+l.range(-8,8),E=l.range(46,58),_=[{x:W,y:0,z:C,height:E},{x:96+l.range(-8,8),y:0,z:-92+l.range(-8,8),height:l.range(20,30)}],O=Ge(_,T,o,l,r);m.add(O),await u.yield();let F=-1,b=-1;const V=new a.Quaternion,D=new a.Quaternion,d=new a.Vector3,v=new a.Vector2,A=Math.PI/180,H=new a.Vector3(0,0,1),Y=(g,f,t)=>{const e=g.k,s=g.mesh,y=I(.03,.35,f);let G=0,P=Math.sin(t*e.bobW+e.bobP)*e.bobA*y,K=0,ne=0,X=1-e.sh*I(.05,.5,f);e.role==="gateL"||e.role==="gateR"?G=e.ang*I(.2,.6,f)*(1-.1*I(.86,1,f)):e.role==="tipper"?(G=(40*I(.02,.22,f)+24*I(.24,.5,f))*A,P-=75*I(.22,.5,f),K=14*I(.2,.5,f)):(G=e.ang*I(e.p0,e.p0+.3,f)*(1+1.2*I(e.ps,e.ps+.22,f)),P-=e.sink*I(e.ps,e.ps+.22,f),K=e.drift[0]*I(.1,.7,f),ne=e.drift[1]*I(.1,.7,f)),V.setFromAxisAngle(H,G),d.set(Math.cos(e.bobAx),0,Math.sin(e.bobAx)),D.setFromAxisAngle(d,Math.sin(t*e.bobW*.83+e.bobP*1.7)*e.tiltBob*y),s.quaternion.copy(D).multiply(e.qYaw).multiply(V),s.position.set(e.px+K,P,e.pz+ne),s.scale.set(X,1,X)},te=(g,f,t)=>{const e=f%40,s=F>=0?F:ee(Math.min(e/17.6,(40-e)/12),0,1);T.uTime.value=f,i.uMoonT.value=f,T.uOpen.value=I(.03,.42,s),T.uGold2.value=I(.42,.85,s),T.uFount.value=I(.28,.5,s),i.uEarthGlow.value=b>=0?b:I(.15,1,s),m.updateWorldMatrix(!0,!1),T.uSeaY.value=m.matrixWorld.elements[13],i.uMoonDir.value.copy(q.dir).transformDirection(m.matrixWorld),i.uMoonRight.value.copy(q.right).transformDirection(m.matrixWorld),i.uMoonUp.value.copy(q.up).transformDirection(m.matrixWorld),u.renderer&&(u.renderer.getDrawingBufferSize(v),T.uResY.value=v.y);for(let y=0;y<z.length;y++)Y(z[y],s,f);for(let y=0;y<k.length;y++){const G=k[y].mesh;G.updateMatrix(),S.uGateM.value[y].copy(G.matrix)}};te(0,0,null);const ae=c.gateL,oe=c.gateR,$=g=>{if(!g)return new a.Vector3;const f=g.k,t=Math.cos(f.ang),e=Math.sin(f.ang);return new a.Vector3(f.px+f.rx*(f.L*t-le*e),f.L*e+le*t,f.pz+f.rz*(f.L*t-le*e))},Z=z.find(g=>g.k.role==="tipper"),N=(g,f,t)=>new a.Vector3(g,f,t),re={flyThrough:[N(0,16,240),N(-2,16,130),N(-6,16,55),N(0,16,0),N(5,16,-55),N(1,16,-130),N(0,16,-240)],gateLeft:$(ae),gateRight:$(oe),tipper:Z?N(Z.pl.cx,0,Z.pl.cz):N(0,0,100),fountain:N(W,0,C),fountainHeight:E,fountain2:N(_[1].x,0,_[1].z),moonDir:q.dir.clone(),patchRadiusX:152,patchRadiusZ:178,patchCentre:N(0,0,14),viewpoints:[{position:N(0,16,200),target:N(0,20,0)},{position:N(-2,16,100),target:N(0,18,-40)},{position:N(60,9,150),target:N(-20,14,0)}]};return{object:m,radius:130,height:34,center:new a.Vector3(0,10,0),anchors:re,patchRadius:180,update:te,dispose(){},ground:!1,groundY:0,setProgress(g){F=ee(g,0,1)},setEarthGlow(g){b=ee(g,0,1)},uniforms:{moon:i,shared:T},moon:B,sea:L,fountains:O,plates:z.map(g=>g.mesh),slabMaterial:p,variant:{phase:h,crust:w}}}async function We(u,n={}){const o=n.palette&&n.palette.length>=7?n.palette:ve,r=u.rng.fork("ember-moon-tent"),l=u.noise,h=new a.Group;h.name="emberTent";let w,j,m=!1,M=null;n.hero&&n.hero.uniforms?(w=n.hero.uniforms.moon,j=n.hero.uniforms.shared.uTime):(m=!0,w=Re(await Me(u,384),o,n.moonPhase??"crescent"),j={value:0},M={dir:w.uMoonDir.value.clone(),right:w.uMoonRight.value.clone(),up:w.uMoonUp.value.clone()},n.moon!==!1&&h.add(ke(w,4500))),await u.yield();const i={uTime:j,uSeaY:{value:0},uOpen:{value:.6},uSwell:n.hero&&n.hero.uniforms?n.hero.uniforms.shared.uSwell:se()},q=fe(w,i,o,{heat:.3,rough:.06,wallHeat:.42,drip:1,stretch:.42}),B=fe(w,i,o,{heat:.3,rough:.06,wallHeat:.42,drip:1});B.uniforms.uLamp=q.uniforms.uLamp,B.uniforms.uSheen=q.uniforms.uSheen;const T=fe(w,i,o,{heat:.4,rough:.07,threads:1}),p=90+r.range(-4,4),R=r.range(-.012,.012),x=(d,v,A)=>[d+l.n2(d*.07+A,v*.07)*2.2+l.n2(d*.5,v*.5+A)*.35,v+l.n2(d*.07,v*.07+A+30)*2.2+l.n2(d*.5+A,v*.5)*.35],z=(d,v,A)=>[d+l.n2(d*.07+A,v*.07)*2.4+l.n2(d*.21+A,v*.21+11)*1.1+l.n2(d*.6,v*.6+A)*.4,v+l.n2(d*.07,v*.07+A+30)*2.4+l.n2(d*.21+17,v*.21+A)*1.1+l.n2(d*.6+A,v*.6)*.4],c=(d,v,A,H,Y,te)=>{const ae=[[0,v]];for(const $ of H)ae.push([d*$[1],v+(A-v)*$[0]]);ae.push([0,A]);const oe=[];for(let $=0;$<ae.length;$++){const Z=ae[$],N=ae[($+1)%ae.length],re=Math.max(2,Math.round(Math.hypot(N[0]-Z[0],N[1]-Z[1])/Y));for(let g=0;g<re;g++){const f=g/re;oe.push(z(Z[0]+(N[0]-Z[0])*f,Z[1]+(N[1]-Z[1])*f,te))}}return oe},k=[],S=[{name:"tentLeft",wid:54,lean:52,x:-30,yaw:-.09,zA:-p/2,zB:p/2+10,seed:10,prof:[[0,.84],[.16,.97],[.42,1],[.54,.91],[.64,.97],[.73,.72],[.78,.4],[.85,.5],[.93,.2]],ribDir:.3},{name:"tentRight",wid:41-r.range(0,2),lean:58,x:23.5,yaw:Math.PI+.07,zA:p/2+3,zB:-.2*p,seed:110,prof:[[0,.72],[.22,.93],[.5,1],[.63,.86],[.72,.52],[.8,.6],[.9,.26]],ribDir:-.4}];for(const d of S){const v=he(c(d.wid,d.zA,d.zB,d.prof,.9,d.seed),{rng:r,ribW:1,ribDir:d.ribDir,shaderRibs:!0}),A=new a.Mesh(v,q);A.name=d.name,A.frustumCulled=!1,A.quaternion.setFromAxisAngle(new a.Vector3(0,1,0),d.yaw+R).multiply(new a.Quaternion().setFromAxisAngle(new a.Vector3(0,0,1),d.lean*Math.PI/180)),A.position.set(d.x,1,0),h.add(A),k.push(A),await u.yield()}const L=70+r.range(-3,3),W=44+r.range(-2,2),C=new a.Mesh(he(c(W,-L/2,L/2,[[0,.72],[.28,1],[.6,.93],[.72,.7],[1,.8]],1.1,140),{rng:r,ribW:1,ribDir:1.15,shaderRibs:!0}),B);C.name="tentBack",C.frustumCulled=!1,C.quaternion.setFromAxisAngle(new a.Vector3(0,1,0),-Math.PI/2+.16+r.range(-.04,.04)).multiply(new a.Quaternion().setFromAxisAngle(new a.Vector3(0,0,1),52*Math.PI/180)),C.position.set(3+r.range(-1.5,1.5),1,-p/2-20),h.add(C),k.push(C),await u.yield();const E=74+r.range(-4,6),_=100+r.range(-4,6),O=[];for(let d=0;d<230;d++){const v=d/230*6.2832,A=1+l.n2(Math.cos(v)*1.7+5,Math.sin(v)*1.7)*.13;O.push(x(Math.cos(v)*E*A,-2+Math.sin(v)*(_+8+(Math.sin(v)>0?46:0))*A,9))}const F=new a.Mesh(he(O,{rng:r,shaderRibs:!0}),T);F.name="tentRaft",F.frustumCulled=!1,h.add(F),await u.yield();const b=(d,v,A)=>new a.Vector3(d,v,A),V={portalSeat:{position:b(0,9.2,-p/2+8),facing:b(0,0,1)},mouth:b(0,0,p/2),crest:b(0,41,0),flyThrough:[b(0,16,330),b(0,15,190),b(0,11,p/2+30),b(0,9.2,10),b(0,9.2,-p/2+8)],viewpoints:[{position:b(0,16,390),target:b(0,12,0)},{position:b(0,10,110),target:b(0,10,-40)}]},D=(d,v)=>{h.updateWorldMatrix(!0,!1),i.uSeaY.value=h.matrixWorld.elements[13];const A=Math.sin(v*.9)*.12;F.position.y=A,k[0].position.y=1+A,k[1].position.y=1+A*.9,k[2].position.y=1+A,m&&(j.value=v,w.uMoonT.value=v,w.uMoonDir.value.copy(M.dir).transformDirection(h.matrixWorld),w.uMoonRight.value.copy(M.right).transformDirection(h.matrixWorld),w.uMoonUp.value.copy(M.up).transformDirection(h.matrixWorld))};return D(0,0),{object:h,radius:60,height:42,center:b(0,14,0),anchors:V,update:D,dispose(){},ground:!1,groundY:0,slabs:k,raft:F}}function Le(u,n,o,r,l,h){const w=Math.round(120*l),j=u.length*w,m=new Float32Array(j*4),M=new Float32Array(j*2);for(let R=0;R<u.length;R++){const x=u[R].outline,z=u[R].centre;for(let c=0;c<w;c++){const k=x[Math.floor(r()*x.length)],S=.04+.9*r()*r(),L=(R*w+c)*4;m[L]=k[0]+(z[0]-k[0])*S,m[L+1]=h-.2,m[L+2]=k[1]+(z[1]-k[1])*S,m[L+3]=R,M[(R*w+c)*2]=r(),M[(R*w+c)*2+1]=r()}}const i=new a.InstancedBufferGeometry;i.setAttribute("position",new a.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),i.setIndex([0,1,2,0,2,3]),i.setAttribute("aStart",new a.InstancedBufferAttribute(m,4)),i.setAttribute("aRnd",new a.InstancedBufferAttribute(M,2)),i.instanceCount=j;const q=(R,x=1)=>({value:new a.Color(R).multiplyScalar(x)}),B={value:[new a.Matrix4,new a.Matrix4]},T=new a.ShaderMaterial({uniforms:{...a.UniformsLib.fog,uTime:n.uTime,uResY:n.uResY,uGateM:B,uSwell:n.uSwell||(n.uSwell=se()),uOrange:q(o[3]),uGold:q(o[4]),uCream:q(o[5])},fog:!0,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,vertexShader:`
      attribute vec4 aStart; attribute vec2 aRnd; uniform mat4 uGateM[2]; uniform float uTime, uResY; varying vec2 vC; varying float vAge, vDim;
      #include <fog_pars_vertex>
      ${ce}
      void main(){
        vec4 s0 = aStart.w < 0.5 ? uGateM[0] * vec4(aStart.xyz, 1.) : uGateM[1] * vec4(aStart.xyz, 1.);
        float hgt = max(s0.y, 0.);
        float T = sqrt(2. * hgt / 9.8) + 0.25 + aRnd.y * 1.6;          // fall time plus a wait while the bead gathers
        float t = fract(uTime / max(T, 0.3) + aRnd.x) * T - (0.25 + aRnd.y * 1.6);
        float fall = max(t, 0.);
        vec3 p = s0.xyz - vec3(0., 4.9 * fall * fall, 0.);
        float alive = step(2.0, hgt) * step(0., p.y) * smoothstep(0., 0.25, t) * step(0.4, fract(aRnd.x * 7.31 + aRnd.y * 3.7));      // (polish 5) a bead is not seen until it falls: the waiting ones were a sparkle of white points on the rock
        vec4 wq = modelMatrix * vec4(p, 1.); wq.y += swellH(wq.xz);
        vec4 mv = viewMatrix * wq;
        float px = -mv.z * 2. / (projectionMatrix[1][1] * max(uResY, 100.));
        float w = max(0.10 + 0.07 * aRnd.x, px * 1.3) * alive;
        float len = (0.45 + 9.8 * fall * 0.09) * alive;                // a drop with a short tail, not a streak
        vec3 upv = (viewMatrix * modelMatrix * vec4(0., 1., 0., 0.)).xyz;
        mv.xyz += upv * position.y * len; mv.x += position.x * w;
        vC = position.xy; vAge = clamp(fall * 0.6, 0., 1.); vDim = clamp((0.10 + 0.07 * aRnd.x) / max(w, 1e-4), 0.2, 1.) * (0.4 + 0.6 * aRnd.y);
        vec4 mvPosition = mv; gl_Position = projectionMatrix * mv;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uOrange, uGold, uCream; varying vec2 vC; varying float vAge, vDim;
      #include <fog_pars_fragment>
      void main(){
        float d = vDim * (1. - vC.x * vC.x) * smoothstep(-1.0, -0.72, vC.y) * (1. - smoothstep(-0.6, 1.0, vC.y)) * 0.9;      // a drop: bright head below, a tail fading upward
        vec3 col = mix(uGold * 1.5 + uCream * 0.3, uGold * 1.1 + uOrange * 0.5, smoothstep(0.0, 0.5, vAge)); col = mix(col, uOrange * 1.2, smoothstep(0.5, 1.0, vAge));
        ${me}
        gl_FragColor = vec4(col * d * (1. - fogK), 1.);
      }`}),p=new a.Mesh(i,T);return p.frustumCulled=!1,p.name="gateDrips",p.renderOrder=3,{mesh:p,uGateM:B}}export{ye as MOON_GLSL,ce as SWELL_GLSL,Me as bakeMoonTexture,qe as buildHero,We as buildTent,Ge as makeFountains,he as makeSlabGeometry,fe as makeSlabMaterial};
