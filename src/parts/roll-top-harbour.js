import*as y from"three";import"three/addons/utils/BufferGeometryUtils.js";const J={holly:0,sycamore:1,oak:2,pear:3,walnut:4,rosewood:5,harewood:6,bogoak:7,ebony:8,boxwood:9},ie=["#F1E8D3","#E0CFA6","#C89A56","#B9774A","#6E4628","#8C9685","#1C1410"],Z={rosewood:"#5A2A22",bogoak:"#33291F",boxwood:"#DDBB62"},k={flat:560,R:260,lipAngle:2.335,halfWidth:550,stave:.35,draw:5,swellH:.9,swellL:36,swellC:9,phase0:2.37};k.len=k.flat+k.R*k.lipAngle;const X=new y.Vector3(Math.sin(55*Math.PI/180)*Math.cos(38*Math.PI/180),Math.sin(38*Math.PI/180),Math.cos(55*Math.PI/180)*Math.cos(38*Math.PI/180)),te=[.59719,.076,.0284,.35458,.90834,.13383,.04823,.01566,.83777],ae=[1.60475,-.10208,-.00327,-.53108,1.10813,-.07276,-.07367,-.00605,1.07602],Y=d=>new y.Matrix3().fromArray(d).invert(),oe=d=>"mat3("+d.elements.map(o=>o.toFixed(6)).join(",")+")";function le(d=1){return`
  uniform float uCeil;
  // the palest woods under full sheen keep their colour: the largest channel is eased toward the ceiling (never a
  // per-channel clip, which turned holly to white paper), and the grain streaks are laid back on top of the shoulder
  vec3 toScene(vec3 D){
    float gk = clamp(1. + gGrainK, .5, 1.5), top = .955*uCeil, knee = .76*top;
    D = max(D, 0.)/gk;
    float m = max(D.r, max(D.g, D.b));
    if (m > knee) D *= (knee + (.95*top - knee)*(1. - exp(-(m - knee)/(.95*top - knee))))/m;
    D *= gk; m = max(D.r, max(D.g, D.b));
    D *= min(1., top/max(m, 1e-4));
    vec3 y = clamp(${oe(Y(ae))}*clamp(D, 0., uCeil), 0.0004, 0.97);
    vec3 A = 0.983729*y - 1., B = 0.432951*y - 0.0245786, C = 0.238081*y + 0.000090537;
    vec3 v = (-B - sqrt(max(B*B - 4.*A*C, 0.)))/(2.*A);
    return max(${oe(Y(te))}*v, 0.)*${(.6/d).toFixed(5)};
  }`}function he(d,o=1){const t=new y.Vector3(Math.min(d.r,.95),Math.min(d.g,.95),Math.min(d.b,.95)).applyMatrix3(Y(ae)),r=["x","y","z"].map(n=>{const p=Math.min(.97,Math.max(4e-4,t[n])),m=.983729*p-1,c=.432951*p-.0245786,l=.238081*p+90537e-9;return(-c-Math.sqrt(Math.max(c*c-4*m*l,0)))/(2*m)}),a=new y.Vector3(r[0],r[1],r[2]).applyMatrix3(Y(te)).multiplyScalar(.6/o);return new y.Color(Math.max(a.x,0),Math.max(a.y,0),Math.max(a.z,0))}async function ce(d,o){const r=new Uint8Array(262144),a=Math.floor(o()*1e6),n=(l,h,i)=>{let g=Math.imul(l,374761393)+Math.imul(h,668265263)+Math.imul(i+a,2147483647)|0;return g=Math.imul(g^g>>>13,1274126177),((g^g>>>16)>>>0)/4294967296},p=(l,h,i,g,T)=>{const z=Math.floor(l),A=Math.floor(h),P=l-z,e=h-A,w=P*P*(3-2*P),E=e*e*(3-2*e),s=n((z%i+i)%i,(A%g+g)%g,T),v=n(((z+1)%i+i)%i,(A%g+g)%g,T),b=n((z%i+i)%i,((A+1)%g+g)%g,T),u=n(((z+1)%i+i)%i,((A+1)%g+g)%g,T);return s+(v-s)*w+(b-s)*E+(s-v-b+u)*w*E},m=[];for(let l=0;l<9;l++)m.push([o()*256,o()*256,6+o()*10]);for(let l=0;l<256;l++){l%8===0&&await d.yield();for(let h=0;h<256;h++){const i=h/256,g=l/256,T=(l*256+h)*4,z=g*256+5*(p(i*4,g*6,4,6,1)-.5);let A=.5*p(i*2,z/21.33,2,12,2)+.3*p(i*3,z/8,3,32,3)+.2*p(i*4,z/3.2,4,80,4);const P=Math.abs(((z/32+.6*p(i*2,g*4,2,4,5))%1+1)%1-.5)*2;A=(.6*A+.4*P*P-.42)*2.3+.5;const e=n(Math.floor(h/9),l,6)>.86&&n(Math.floor(h/9),l,7)>i*0+.3?1:0,w=.5+.5*Math.sin(i*Math.PI*2*3+2.2*Math.sin(g*Math.PI*2)+3*p(i*3,g*3,3,3,8));let E=0;for(const s of m){let v=Math.abs(h-s[0]),b=Math.abs(l-s[1]);v=Math.min(v,256-v),b=Math.min(b,256-b);const u=Math.hypot(v,b)/s[2];u<1.6&&(E=Math.max(E,u<.35?1:.5+.5*Math.cos(u*9)*(1-u/1.6)))}r[T]=Math.round(255*Math.min(1,Math.max(0,A))),r[T+1]=e*255,r[T+2]=Math.round(255*w),r[T+3]=Math.round(255*E)}}const c=new y.DataTexture(r,256,256,y.RGBAFormat,y.UnsignedByteType);return c.wrapS=c.wrapT=y.RepeatWrapping,c.magFilter=y.LinearFilter,c.minFilter=y.LinearMipmapLinearFilter,c.generateMipmaps=!0,c.anisotropy=4,c.colorSpace=y.NoColorSpace,c.needsUpdate=!0,c}const se=`
  uniform sampler2D uGrain; uniform vec3 uWood[10]; uniform vec3 uSun; uniform float uTime; uniform float uGrainScale;
  float gGrainK = 0.;      // the grain streak of the last woodColor(), for toScene's shoulder
  vec3 woodBase(float sp){ return uWood[int(clamp(sp + .5, 0., 9.))]; }
  // g: metres in the piece plane, x ALONG the grain. rnd 0..1 per piece. fid returns the fiddleback figure (0..1)
  vec3 woodColor(float sp, vec2 g, float rnd, out float fid){
    vec2 q = vec2(g.x/12., g.y)*uGrainScale + vec2(rnd*7.31, rnd*3.17);
    vec4 t = texture2D(uGrain, q), t2 = texture2D(uGrain, q*.131 + vec2(.37, rnd));
    fid = t2.b;
    float dark = smoothstep(3.5, 5.5, sp)*(1. - step(5.5, sp)*step(sp, 6.5));      // walnut, rosewood, bog oak, ebony
    float k = (t.r - .5)*mix(.46, .6, dark) + (t2.r - .5)*.24 - t.g*.15;
    vec3 c = woodBase(sp)*(1. + k); gGrainK = k;
    float h = fract(rnd*7.7) - .5;
    c *= 1. + (rnd - .5)*.16; c.r *= 1. + h*.07; c.b *= 1. - h*.10;
    return c;
  }
  // chatoyance: 0..1; T grain direction, B across the grain in the piece plane, V to the eye (all world, unit)
  float sheenTerm(vec3 T, vec3 B, vec3 V, float wob){
    vec3 Tw = T + B*wob; Tw /= max(length(Tw), 1e-4);
    vec3 H = uSun + V; H /= max(length(H), 1e-4);
    float th = dot(Tw, H), s = clamp(1. - th*th, 0., 1.); s = s*s*s;
    return s*s;
  }
  float sheenGain(float s){ return mix(.6, 1.7, s); }
  // glue line: d = metres to the piece edge, px = metres per pixel there (fwidth), w = half width in metres.
  // Never thinner than 1.5 px; fade = 1 near, 0 where the joint must dissolve (callers pass their own rule)
  float kerfMask(float d, float px, float w, float fade){
    px = max(px, 1e-6); float hw = max(w, .75*px);
    return (1. - smoothstep(hw - .5*px, hw + .5*px, d))*fade*min(1., w/max(.75*px, 1e-5) + .45);
  }
  vec3 glue(){ return uWood[8]*.8; }
`,fe=`
  attribute vec3 aT; attribute vec2 aUv; attribute vec2 aBox; attribute vec2 aGr; attribute vec4 aSr;
  uniform float uTime;
  varying vec3 vW; varying vec3 vT; varying vec3 vN; varying vec2 vUv; varying vec2 vBox; varying vec2 vGr; varying vec4 vSr;
  void main(){
    vec4 lp = vec4(position, 1.); vec3 lt = aT, ln = normal;
    #ifdef USE_INSTANCING
      lp = instanceMatrix*lp; lt = mat3(instanceMatrix)*lt; ln = mat3(instanceMatrix)*ln;
    #endif
    // aSr.w: pieces that breathe (sails, lifted corners): bow along the normal, pinned at the piece's u edges
    float pin = 1. - min(1., abs(aUv.x)/max(aBox.x, 1e-3)); 
    lp.xyz += ln*aSr.w*pin*(.75 + .25*sin(uTime*1.1 + aSr.y*40.) + .08*sin(uTime*3.7 + aUv.y*.9));
    vec4 wp = modelMatrix*lp; vW = wp.xyz;
    vT = mat3(modelMatrix)*lt; vN = mat3(modelMatrix)*ln;
    vUv = aUv; vBox = aBox; vGr = aGr; vSr = aSr;
    gl_Position = projectionMatrix*viewMatrix*wp;
  }`,ue=d=>`
  ${se}
  ${d}
  uniform float uKerf; uniform float uKerfFar;
  varying vec3 vW; varying vec3 vT; varying vec3 vN; varying vec2 vUv; varying vec2 vBox; varying vec2 vGr; varying vec4 vSr;
  void main(){
    vec3 T = vT/max(length(vT), 1e-4), N = vN/max(length(vN), 1e-4);
    vec3 B = cross(N, T); B /= max(length(B), 1e-4);
    vec3 Vv = cameraPosition - vW; float dist = length(Vv); Vv /= max(dist, 1e-4);
    vec2 g = vec2(vUv.x*vGr.x + vUv.y*vGr.y, vUv.y*vGr.x - vUv.x*vGr.y);
    float fid; vec3 c = woodColor(vSr.x, g, vSr.y, fid);
    float cup = (vUv.y*vGr.x - vUv.x*vGr.y)/max(max(vBox.x, vBox.y), 1e-3);      // big panels are a little cupped
    float s = sheenTerm(T, B, Vv, (fid - .5)*.5 + cup*.22);
    c *= sheenGain(s);
    vec2 e = vBox - abs(vUv); float d = min(e.x, e.y);
    float px = max(fwidth(vUv.x), fwidth(vUv.y));
    c *= 1. - vSr.z*.5*(1. - smoothstep(0., .22*min(vBox.x, vBox.y) + .02, d));       // sand-scorched fringe of inlaid shadows
    float gap = 1. + 1.6*step(.967, fract(vSr.y*31.7));                              // one joint in thirty stands open
    float small = min(vBox.x, vBox.y)/max(px, 1e-5);                                 // piece half-size in pixels
    float fade = (1. - smoothstep(uKerfFar*.7, uKerfFar, dist))*smoothstep(1.5, 3., small);
    c = mix(c, glue(), kerfMask(d, px, uKerf*gap, fade));
    gl_FragColor = vec4(toScene(c), 1.);
  }`;async function de(d,o={}){const t=(o.palette&&o.palette.length>=7?o.palette:ie).map(h=>new y.Color(h)),r=d.rng.fork("marquetry-style"),a=r.range(-.035,.035),n=[t[0],t[1],t[2],t[3],t[4],new y.Color(Z.rosewood),t[5],new y.Color(Z.bogoak),t[6],new y.Color(Z.boxwood)].map((h,i)=>i===0||i===8?h.clone():h.clone().offsetHSL(a*.3,0,a*.4)),p=o.exposure??1,m=le(p),c={uGrain:{value:await ce(d,r)},uWood:{value:n},uSun:{value:X.clone()},uTime:{value:0},uGrainScale:{value:o.grainScale??.4},uKerf:{value:o.kerf??.012},uKerfFar:{value:250},uCeil:{value:o.ceil??.78}};return{uniforms:c,woods:n,tone:m,exposure:p,SPECIES:J,pieceMaterial(h={}){return new y.ShaderMaterial({uniforms:c,vertexShader:fe,fragmentShader:ue(m),side:h.side??y.DoubleSide,fog:!1,toneMapped:!1})},sceneColor(h,i=1){return he(n[h].clone().multiplyScalar(i),p)},builder(){return new we}}}const pe=new y.Vector3,me=new y.Vector3,ve=new y.Vector3,H=new y.Vector3;class we{constructor(){this.P=[],this.N=[],this.T=[],this.U=[],this.B=[],this.G=[],this.S=[],this.I=[],this.nv=0,this.seq=.137}_rnd(){return this.seq=(this.seq*97.13+.618034)%1,this.seq}_v(o,t,r,a,n,p,m,c,l,h,i){return this.P.push(o.x,o.y,o.z),this.N.push(t.x,t.y,t.z),this.T.push(r.x,r.y,r.z),this.U.push(a,n),this.B.push(p,m),this.G.push(c,l),this.S.push(h.sp??1,i,h.scorch??0,h.move??0),this.nv++}quad(o,t,r,a,n={}){const p=pe.subVectors(t,o),m=me.subVectors(a,o),c=p.length(),l=m.length();if(c<1e-6||l<1e-6)return this;if(p.multiplyScalar(1/c),H.crossVectors(p,m),H.lengthSq()<1e-12)return this;H.normalize();const h=ve.crossVectors(H,p),i=n.ang??0,g=Math.cos(i),T=Math.sin(i),z=new y.Vector3().copy(p).multiplyScalar(g).addScaledVector(h,T),A=H.clone(),P=n.uv||[-c/2,-l/2,c/2,l/2],e=n.box||[c/2,l/2],w=n.rnd??this._rnd(),E=this._v(o,A,z,P[0],P[1],e[0],e[1],g,T,n,w),s=this._v(t,A,z,P[2],P[1],e[0],e[1],g,T,n,w),v=this._v(r,A,z,P[2],P[3],e[0],e[1],g,T,n,w),b=this._v(a,A,z,P[0],P[3],e[0],e[1],g,T,n,w);return this.I.push(E,s,v,E,v,b),this}strip(o,t,r={}){let a=0;const n=[0];for(let h=1;h<o.length;h++)a+=.5*(o[h].distanceTo(o[h-1])+t[h].distanceTo(t[h-1])),n.push(a);let p=0;for(let h=0;h<o.length;h++)p+=o[h].distanceTo(t[h]);p/=o.length;const m=r.rnd??this._rnd(),c={...r,rnd:m,box:[a/2,p/2]},l=this.nv;for(let h=0;h+1<o.length;h++)c.uv=[n[h]-a/2,-p/2,n[h+1]-a/2,p/2],this.quad(o[h],o[h+1],t[h+1],t[h],c);if(r.move){let h=0,i=0,g=0;for(let z=l;z<this.nv;z++)h+=this.N[z*3],i+=this.N[z*3+1],g+=this.N[z*3+2];const T=Math.hypot(h,i,g)||1;for(let z=l;z<this.nv;z++)this.N[z*3]=h/T,this.N[z*3+1]=i/T,this.N[z*3+2]=g/T}return this}block(o,t,r,a,n={}){const p=t/2,m=r/2,c=a/2,l=(i,g,T)=>new y.Vector3(i,g,T).applyMatrix4(o),h=(i,g,T,z,A)=>{const P=i.distanceTo(g)>=i.distanceTo(z),e={...n,sp:A??n.sp,rnd:void 0,ang:(n.alt?Math.PI/2:0)+(n.ang??0)};return P?this.quad(i,g,T,z,e):this.quad(g,T,z,i,e)};return h(l(-p,m,c),l(p,m,c),l(p,m,-c),l(-p,m,-c),n.top),h(l(-p,-m,-c),l(p,-m,-c),l(p,-m,c),l(-p,-m,c),n.bottom??n.top),h(l(-p,-m,c),l(p,-m,c),l(p,m,c),l(-p,m,c),n.sides),h(l(p,-m,-c),l(-p,-m,-c),l(-p,m,-c),l(p,m,-c),n.sides),h(l(p,-m,c),l(p,-m,-c),l(p,m,-c),l(p,m,c),n.ends??n.sides),h(l(-p,-m,-c),l(-p,-m,c),l(-p,m,c),l(-p,m,-c),n.ends??n.sides),this}mark(){return this.nv}applyMatrix(o,t=0){const r=new y.Matrix3().getNormalMatrix(o),a=new y.Vector3;for(let n=t;n<this.nv;n++)a.fromArray(this.P,n*3).applyMatrix4(o).toArray(this.P,n*3),a.fromArray(this.N,n*3).applyMatrix3(r).normalize().toArray(this.N,n*3),a.fromArray(this.T,n*3).transformDirection(o).toArray(this.T,n*3);return this}get triangles(){return this.I.length/3}build(){const o=new y.BufferGeometry,t=(r,a)=>new y.Float32BufferAttribute(r,a);return o.setAttribute("position",t(this.P,3)),o.setAttribute("normal",t(this.N,3)),o.setAttribute("aT",t(this.T,3)),o.setAttribute("aUv",t(this.U,2)),o.setAttribute("aBox",t(this.B,2)),o.setAttribute("aGr",t(this.G,2)),o.setAttribute("aSr",t(this.S,4)),o.setIndex(this.nv>65535?new y.Uint32BufferAttribute(this.I,1):new y.Uint16BufferAttribute(this.I,1)),o.computeBoundingSphere(),o}}function xe(d,o={}){const t=Math.min(k.lipAngle+.25,Math.max(0,(d-k.flat)/k.R));return o.z=Math.min(d,k.flat)+k.R*Math.sin(t),o.y=k.R*(1-Math.cos(t)),o.th=t,o}function ne(d,o,t,r={}){const a=Math.PI*2/k.swellL,n=1.1*Math.sin(o*.0105+d*.0031)+.6*Math.sin(o*.027-1.3)+1.4*Math.sin(o*.05+.6)+.7*Math.sin(o*.093-d*.011+2.1),p=a*(d-k.swellC*t)+n+k.phase0,m=k.swellH*.5*(.75+.25*Math.sin(o*.006+d*.012))*(.3+.7*Math.min(1,Math.max(0,(d+5)/40)));return r.h=m*Math.sin(p)+.1*Math.sin(p*2.7+o*.05+1.7),r.slope=m*a*Math.cos(p)+.27*a*Math.cos(p*2.7+o*.05+1.7),r.ph=p,r}const K=d=>d.toFixed(5),re=`
  uniform float uDrawn; uniform float uSeaT; uniform float uSwell;
  const float FLAT = ${K(k.flat)}, RAD = ${K(k.R)}, LIP = ${K(k.lipAngle)}, KW = ${K(Math.PI*2/k.swellL)}, W0 = ${K(k.stave)};
  float hash11(float p){ p = fract(p*.1031); p *= p + 33.33; p *= p + p; return fract(p); }
  float seaTheta(float s){ return clamp((s - FLAT)/RAD, 0., LIP + .25); }
  // course-frame position on the sheet at arc length s, lifted h along the sheet normal
  vec3 seaPos(float s, float x, float h){
    float th = seaTheta(s), c = cos(th), sn = sin(th);
    return vec3(x, RAD*(1. - c) + h*c, min(s, FLAT) + RAD*sn - h*sn);
  }
  float swellPhase(float s, float x){ return KW*(s - ${K(k.swellC)}*uSeaT) + 1.1*sin(x*.0105 + s*.0031) + .6*sin(x*.027 - 1.3) + 1.4*sin(x*.05 + .6) + .7*sin(x*.093 - s*.011 + 2.1) + ${K(k.phase0)}; }
  // x = lift, y = slope along s
  vec2 swell(float s, float x){
    float ph = swellPhase(s, x);
    float amp = uSwell*.5*(.75 + .25*sin(x*.006 + s*.012))*(.3 + .7*clamp((s + 5.)/40., 0., 1.));
    return vec2(amp*sin(ph) + .1*sin(ph*2.7 + x*.05 + 1.7), amp*KW*cos(ph) + .27*KW*cos(ph*2.7 + x*.05 + 1.7));
  }`,ge=`
  ${re}
  uniform vec3 uSun; uniform vec4 uWin;     // near window: s0, s1, x centre, x half length
  #ifdef NEAR
    attribute float aIdx; attribute vec2 aC; uniform float uWinK; uniform float uNearR;
  #endif
  varying float vS; varying float vX; varying vec3 vPc; varying vec3 vCamC; varying vec3 vSunC;
  void main(){
    #ifdef NEAR
      float id = aIdx + uWinK, sc = (id + .5)*W0 + uDrawn, x = position.x + uWin.z;
      vec2 sw = swell(sc, x);
      vec3 cc = (cameraPosition - modelMatrix[3].xyz)*mat3(modelMatrix);
      // each stave rocks on its canvas. Real staves exist only inside uNearR of the eye (where one is 3 px or
      // more: beyond it the scored sheet takes over, or sub-pixel tilted faces would boil at the grazing angle),
      // and their own tilt, lift and bevel ease out toward that edge so the two meet without a step
      float nearF = 1. - smoothstep(.3*uNearR, .75*uNearR, length(vec2(x - cc.x, sc - cc.z)));
      float r1 = hash11(id), rho = sw.y*(1. + .7*nearF) + (r1 - .5)*.22*nearF;
      float s = sc + aC.x*cos(rho);
      vec3 pc = seaPos(s, x, sw.x + aC.x*sin(rho) + (aC.y*.8 + .15 + (hash11(id + 7.7) - .5)*.045)*nearF - .03*(1. - nearF));     // real staves ride 15 cm proud of their canvas (in a blow a rocked edge dips 6 cm and the canvas, a coarser grid, stands as much off the true sheet: at 5 cm it came through the joints as rows of pale dots)
      vS = sc + aC.x*.996;
    #else
      float s = position.z, x = position.x;
      vec2 sw = swell(s, x);
      vec3 pc = seaPos(s, x, sw.x - .03);
      vS = s;
    #endif
    vX = x; vPc = pc;
    mat3 R = mat3(modelMatrix);
    vCamC = (cameraPosition - modelMatrix[3].xyz)*R;       // world -> course frame (rigid placement assumed)
    vSunC = uSun*R;
    gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4(pc, 1.);
  }`,ye=d=>`
  ${se}
  ${d}
  ${re}
  uniform vec4 uWin; uniform float uPhase; uniform float uGroove[6]; uniform float uGrooveEnd[6]; uniform vec4 uShadow[12]; uniform float uShSide; uniform float uPale; uniform float uNearR; uniform float uRel;
  varying float vS; varying float vX; varying vec3 vPc; varying vec3 vCamC; varying vec3 vSunC;
  // a real stave's joint is cut wide enough to lie on its top face as well as its bevel, so it never hides behind a
  // rocked neighbour; toward the edge of the real staves it narrows to the scored sheet's (set in main)
  float gKmin = .019;
  // one cut into staves of width w (level lvl). Returns x tint, y kerf, z bevel light, w sycamore share;
  // sp = the arc length at which this stave takes its place in the swell (its own centre while it is a real stave,
  // the pixel's once staves are wide), rock = how far real neighbours differ in tilt
  vec4 staveCut(float w, float lvl, float fs, float fsA, float fx, float rock, out float sp){
    float q = (vS - uDrawn)/w, id = floor(q), f = q - id, e = f*w, sc = (id + .5)*w + uDrawn;
    // a wide stave takes its wood from its first real stave (leaf), so as two staves merge with range one of them
    // never changes and the other fades into it: no unrelated stripes between levels
    float leaf = id*exp2(lvl), rnd = hash11(leaf*1.13 + 5.7), wpx = w/fs, wpxA = w/fsA;
    // uRel: metres the sheet slides under the eye per frame. A stave that passes in under three frames cannot show
    // its own tint, accent or tilt without strobing, so those ease to the mean; kerf, bevel and swell tone stay
    float vary = 1. - smoothstep(.12, .38, uRel/w);
    float tint = 1. + ((rnd - .5)*.13/(1. + .5*lvl) + (hash11(id) - .5)*rock)*vary;
    tint *= 1. + (hash11(floor(leaf*.25)*2.39 + 1.7) - .5)*.2*smoothstep(5., 10., 4.*W0/fs)*(1. - smoothstep(.12, .38, uRel/(4.*W0)));
    float acc = mix(.1, step(.875, hash11(leaf*1.7 + 3.1)), vary)*mix(1., .3, clamp(lvl/2., 0., 1.));
    float k0 = max(gKmin, .6*fs), bw = max(.05, 1.6*fs);
    // a joint is drawn where its stave, lying calm, is wide enough on screen to own one (wpxA): the swell passing
    // through never switches a joint on and off along its length (that broke the joints into rows of dashes); on a
    // face turned from the eye the line only weakens, and with range it thins and is gone
    float kerf = (1. - smoothstep(k0 - .5*fs, k0 + .5*fs, min(e, w - e)))*mix(.9, .52, clamp(lvl/5., 0., 1.))*smoothstep(3.2, 5.5, wpxA)*mix(.3, 1., smoothstep(1.4, 4.5, wpx));
    // the bevel's pale line: one continuous line, never under 1.5 px
    float bev = smoothstep(k0, k0 + .5*fs, e)*(1. - smoothstep(k0 + bw, k0 + bw + .5*fs, e))*smoothstep(5., 9., wpxA)*smoothstep(2.5, 5., wpx);
    // butt joints of the staves themselves: staggered stave to stave, none within 4.5 m of the course
    float Lj = 70. + 60.*hash11(leaf + 9.1), jf = fract((vX + rnd*977.)/Lj), dj = min(jf, 1. - jf)*Lj;
    kerf = max(kerf, kerfMask(dj, fx, .013, smoothstep(6., 12., wpxA)*step(lvl, 1.5)*vary*step(4.5, abs(vX))));
    sp = mix(vS, sc, clamp(1.5 - .5*lvl, 0., 1.));
    return vec4(tint, kerf, bev, acc);
  }
  // THE SWELL AS THE STYLE DOES ROUNDNESS: graded strips. u runs 0..1 through one swell, away from the eye, from
  // the upper near face of a crest: a firm band of full sheen up to just over the crest (u < .22: the part of a swell the
  // eye sees widest), the far face behind it one step darker (.22-.44), the sheet at rest, then the foot of the next
  // near face one step paler (.74-1). x = tone, y = band.
  // fu = u per pixel (firm edges, 1 px)
  vec2 swellTone(float u, float fu){
    float e1 = smoothstep(.22 - fu, .22 + fu, u), e2 = smoothstep(.44 - fu, .44 + fu, u), e3 = smoothstep(.74 - fu, .74 + fu, u);
    float band = (1. - e1)*smoothstep(0., 2.*fu, u)*(1. - smoothstep(1. - 2.*fu, 1., u));
    return vec2(.64 + .2*e2 + .13*e3, band);
  }
  // ONE CUT, WHOSE PIECES CHANGE SIZE WITH RANGE (never two cuts cross-faded: that gave every ring a ghost).
  // ph = swells (cycles), fu = cycles per pixel, m 0..1: 0 near, every swell carries its band (.22 of a swell), the
  // darker far face behind it and the paler foot of the next near face; as m goes to .5 the bands of three swells in
  // four narrow to nothing; from .5 to 1 the fourth (the sets) widens to .88 of a swell with its dark face as wide
  // again and a long pale foot before the next. Every edge is a hard cut at every m. x = tone, y = band.
  float cutE(float e, float x, float fu){ return clamp((x - e)/max(fu, 1e-5) + .5, 0., 1.); }
  vec2 swellCut(float ph, float fu, float m){
    float U = mod(ph, 4.), j = floor(U), f = U - j, a = clamp(2.*m, 0., 1.), b = clamp(2.*m - 1., 0., 1.);
    // the set (swell 0 of four): band, then its dark face (running on into swell 1 once that has lost its own)
    float bE = mix(.22, .88, b), dE = mix(.44, 1.76, b);
    float band = (1. - cutE(bE, U, fu))*cutE(0., U, fu);
    float dark = cutE(bE, U, fu)*(1. - cutE(dE, U, fu));
    // the other three: band and dark face narrowing to nothing
    float w1 = .22*(1. - a), on = step(.5, j)*step(.004, w1);
    band = max(band, on*cutE(0., f, fu)*(1. - cutE(w1, f, fu)));
    dark = max(dark, on*cutE(w1, f, fu)*(1. - cutE(2.*w1, f, fu)));
    // the paler foot of the next near face: three shrink away, the one before the set grows long
    float foot = step(j, 2.5)*step(a, .98)*cutE(.74 + .26*a, f, fu);
    foot = max(foot, cutE(mix(3.74, 2.96, b), U, fu));
    band = max(band, max(cutE(4., U, fu), step(j, 2.5)*step(.004, w1)*cutE(1., f, fu)));      // the half pixel before each band's near edge
    return vec2(mix(mix(.84, .97, foot*(1. - band)), .64, dark), band);
  }
  // inlaid shadow of a ship: a hull wedge and three sail blocks of darker harewood beside her keel, on the side away from
  // the sun, cut in rows of staves. S = keel x, s of her middle, height of the shadow, half length (sign: bow toward +s)
  float shipShadow(out float edge){
    float sh = 0.; edge = 1.;
    for (int i = 0; i < 12; i++){
      vec4 S = uShadow[i]; float hl = max(abs(S.w), 1.), q = W0*exp2(floor(log2(hl/(13.*W0)) + .5));
      float sq = (floor((vS - uDrawn)/q) + .5)*q + uDrawn, hr = .5*q/hl;
      float u = (sq - S.y)/hl*(S.w < 0. ? -1. : 1.), hgt = max(S.z, 1e-3), v = (S.x - vX)*uShSide/hgt;
      // the silhouette of the ship herself, laid over on the staves: hull with its sterncastle and rising bow, three
      // masts (each one row of staves), main and fore sails bellied toward the bow, the lateen on its slanting yard
      float hTop = (.17 + .06*step(u, -.52) - .05*step(.74, u))*clamp((1. - u)/.1, 0., 1.);
      float hull = step(abs(u), 1.)*step(v, hTop);
      float t1 = clamp((v - .25)/.73, 0., 1.), s1 = step(.25, v)*step(v, .98)*step(-.15 + .05*t1, u)*step(u, .34 - .05*t1 + .06*sin(3.1416*t1));
      float t2 = clamp((v - .25)/.47, 0., 1.), s2 = step(.25, v)*step(v, .72)*step(.47 + .04*t2, u)*step(u, .82 - .04*t2 + .05*sin(3.1416*t2));
      float t3 = (u + .93)/.5, s3 = step(0., t3)*step(t3, 1.)*step(.23, v)*step(v, .27 + .33*t3);
      float mast = max(step(v, 1.)*step(abs(u - .1), hr), max(step(v, .76)*step(abs(u - .65), hr), step(v, .62)*step(abs(u + .64), hr)));
      float inside = step(-.04, v)*max(max(hull, s1), max(max(s2, s3), mast));
      float d = mix(.07, min(v + .04, hTop - v), hull)*hgt, row = (.5 - abs(fract((vS - uDrawn)/q) - .5))*q;
      if (inside > .5 && S.z > .5){ sh = 1.; edge = min(edge, min(d, row + .25*q)/(.1*hgt + .4)); }
    }
    return sh;
  }
  void main(){
    float fs = max(fwidth(vS), 1e-5), fx = max(fwidth(vX), 1e-5);
    vec3 Vv = vCamC - vPc; float D = max(length(Vv), 1e-4); vec3 V = Vv/D;
    float front = gl_FrontFacing ? 1. : 0.;
    // the cut is chosen from the footprint a pixel would have on the sheet lying calm (eye, range and the sheet's own
    // curve only), so a swell passing through never changes which staves are drawn and no joint breaks into dashes
    float th = seaTheta(vS), cth = cos(th), sth = sin(th);
    float pa = max(max(length(dFdx(V)), length(dFdy(V))), 1e-6), iso = D*pa;
    float cN = max(abs(V.y*cth - V.z*sth), .012), vs = V.y*sth + V.z*cth, vt = max(length(vec2(vs, V.x)), 1e-4);
    float an = length(vec2(vs/(vt*cN), V.x/vt)), fsA = max(iso*an, 1e-6), graze = smoothstep(4., 11., an);
    float L = max(0., log2(max(5.5*fsA/W0, 1.)));
    float l0 = mix(6., min(floor(L), 7.), front), t = smoothstep(.35, 1., L - l0)*front, flatK = smoothstep(7.9, 8.6, L)*front;
    float dEye = length(vec2(vX - vCamC.x, vS - vCamC.z));
    #ifdef NEAR
      gKmin = mix(.046, .019, smoothstep(.45, .9, dEye/max(uNearR, 1.)));
    #endif
    float rock = .45*smoothstep(3., 7., W0/fs)*front, p0, p1, fsE = fs;
    #ifdef NEAR
      // on a real stave the screen derivative of vS jumps wherever a pixel straddles the crease between its bevel and
      // its top face, which broke the pale bevel line into a row of dots: there the line widths are taken from the
      // footprint on the calm sheet, held within a factor of the true one
      fsE = clamp(fs, .6*fsA, 1.8*fsA);
    #endif
    vec4 c0 = staveCut(W0*exp2(l0), l0, fsE, fsA, fx, rock, p0), c1 = staveCut(W0*exp2(l0 + 1.), l0 + 1., fsE, fsA, fx, 0., p1);
    vec4 cut = mix(mix(c0, c1, t), vec4(1., 0., 0., .075), flatK);
    float sp = mix(mix(p0, p1, t), vS, flatK);
    // the swell: graded strips and a firm band of sheen on every crest while a swell is wide enough on screen to
    // carry them; beyond that every fourth swell (the sets) is one broad pale piece and the rest lie at the mean
    // (the regime is taken from the swell as it really stands on screen: the near face of a crest in a blow is many
    // pixels tall where the calm sheet would give it one, and that is where its band lies)
    float lam = ${K(k.swellL)}/fsA, fph = max(fwidth(swellPhase(vS, vX)*.15915494), 1e-5);
    float perPx = clamp(.5*(l0 + t) - .25, 0., 1.), fu = clamp(fph*perPx, .0015, .2);
    // m: how far the cut has gone, from a band on every swell to the sets alone. Taken from the swell's size on the calm sheet
    // (smooth, no pixel of it depends on the crest's own bends) and from the place: the curve and the wall always
    // carry the sets, at any range, so the wall close to is the wall of the reveal, only larger
    float mCut = max(1. - smoothstep(3., 8., .22*lam), smoothstep(FLAT - 150., FLAT - 40., vS));
    float farK = smoothstep(1.2, 3., .88*lam);
    // while staves are real pieces the strips end in butt joints (a crest line crossing the staves at a slant is cut
    // in clear steps): long slats, 11.2 m, the joints staggered from one pair of staves to the next and never within
    // 3 m of the course; with range the cut follows the crest itself
    float rowJ = floor((vS - uDrawn)/(2.*W0)), cx = (vX + (hash11(rowJ*1.37 + 2.9) - .5)*4.8)/11.2 + .5, ci = floor(cx), qK = 1. - perPx;
    float xq = mix(vX, vX + (ci + .5 - cx)*11.2, qK);
    vec2 sw = mix(vec2(.84, 0.), swellCut(swellPhase(sp, xq)*.15915494 - .06, fu, mCut), farK);
    float tone = sw.x, band = sw.y*front;
    // grain: fine streaks of each stave near, only the slow figure of the sheet far
    float sl = vS - uDrawn, grK = 1. - smoothstep(.3, 1.3, L), id0 = floor(sl/W0);
    vec2 gq = vec2(vX/12., sl)*uGrainScale;
    vec4 g1 = texture2D(uGrain, gq + hash11(id0)*vec2(7.31, 3.17)*grK), g2 = texture2D(uGrain, gq*.131 + vec2(.37, .11));
    float k = ((g1.r - .5)*.46 - g1.g*.15)*grK + (g2.r - .5)*.14;
    float edge, sh = shipShadow(edge)*front;
    // under the roll the sheet has turned over toward us: three graded steps down to walnut, and little sheen
    float uth = seaTheta(sp), un1 = step(1.8, uth)*front, un2 = step(1.93, uth)*front, un3 = step(2.06, uth)*front;
    vec3 hare = woodBase(6.), base = mix(hare, woodBase(1.), .6*cut.w*(1. - band));
    base *= 1. + (.09*step(.42, uth) + .09*step(.92, uth) - .11*step(1.42, uth))*front;
    base = mix(base, hare*.7, un1); base = mix(base, mix(hare*.7, woodBase(4.), .55), un2); base = mix(base, woodBase(4.)*1.05, un3);
    // inlaid wave bands: of every twenty-four pairs of staves ten carry a stepped zigzag of sycamore two pairs thick with
    // a walnut edge behind it (the cabinetmaker's sign for water), each piece ending in butt joints; only where a pair
    // of staves is about 3 px or more, beyond that the band is the sheet's own tone
    // (a frieze: of every thirty-two pairs of staves, a straight sycamore string with a walnut line outside it, the
    // zigzag in long stepped slats, and the same string again; fifteen pairs of plain sea between two friezes)
    float zr = floor(sl/(2.*W0)), zj = mod(zr, 32.);
    // (now all straight banding, every slat whole from end to end: outer strings at pairs 30 and 12 with a walnut line
    // outside each, and between them a band of two sycamore pairs, a walnut line, two sycamore pairs, walnut lined)
    float zK = (1. - smoothstep(1.8, 2.6, L))*front*(1. - sh)*(1. - un1);
    float zStrP = (step(29.5, zj)*step(zj, 30.5) + step(11.5, zj)*step(zj, 12.5) + step(2.5, zj)*step(zj, 4.5) + step(5.5, zj)*step(zj, 7.5))*zK;
    float zStrD = (step(28.5, zj)*step(zj, 29.5) + step(12.5, zj)*step(zj, 13.5) + step(1.5, zj)*step(zj, 2.5) + step(4.5, zj)*step(zj, 5.5) + step(7.5, zj)*step(zj, 8.5))*zK;
    base = mix(base, woodBase(1.)*1.04, zStrP); base = mix(base, mix(hare*.6, woodBase(4.), .45), zStrD);
    base = mix(base, woodBase(1.), max(uPale, 1. - front));                       // the canvas side: plain pale boards
    // round 8: a ship's shadow on the sea is a darker step of the sea's own harewood, the same hard-edged piece: the wood let in is 0.8
    // of the stave's at its fringe to 0.67 inside, and the next line's gain (live's) scorches it darker toward its edges, so on screen it
    // is about 0.6 of the lit sea beside it, darkest at its fringe (it was walnut and bog oak, near black, which strangers read as black slabs
    // and a rendering fault; two typed numbers tuned on the whole sea for no still, after a plain look four of four preferred).
    // Where the sheet has turned over under the roll its staves are hare*.7 (un1): the shadow steps down from that wood too,
    // so it is nowhere paler than its ground
    base = mix(base, mix(hare*.8, hare*.62, .7*smoothstep(0., 1., edge))*(1. - .3*un1), sh);
    float gain = mix(.864, mix(tone, mix(1.42, 2.05, smoothstep(1.2, 3.6, L)), band*(1. - .55*un1)), front);
    gain = mix(gain, .84*(1. - .42*(1. - smoothstep(0., 1., edge))), sh);        // sand-scorched toward its edges
    vec3 c = base*(1. + k)*cut.x*gain;
    c *= 1. + mix(.75, .4, band)*cut.z*(1. - sh);
    // a joint seen face on is a glue line; at a grazing angle it is only the shade between two staves
    c = mix(c, mix(glue(), base*gain*.52, graze), cut.y*(1. - .85*graze*smoothstep(.6, 2.4, L)));
    // the grooves the caravels run in: a routed slot, two kerf-thin edges and a dark floor through which the stave
    // joints still run; far off (under 3 px) one line of its average tint, never under 1.5 px
    float gF = 0., gE = 0., ghw = min(.17, 2.6*fx), gke = max(.022, .6*fx), gWide = smoothstep(2.5, 4.5, 2.*ghw/fx), ghf = max(ghw, .75*fx);
    for (int i = 0; i < 6; i++){
      float d = abs(vX - uGroove[i]), on = step(vS, min(uGrooveEnd[i], FLAT + RAD*LIP - 6.));
      gF = max(gF, on*(1. - smoothstep(ghf - .5*fx, ghf + .5*fx, d)));
      gE = max(gE, on*(1. - smoothstep(gke - .5*fx, gke + .5*fx, abs(d - ghw))));
    }
    c = mix(c, mix(c*.62, uWood[7], .22), gF*front*mix(.85, 1., gWide));
    c = mix(c, glue(), gE*gWide*front*.85);
    #ifdef NEAR
      if (dEye > uNearR) discard;
    #else
      // under the real staves the sheet is their canvas: dark harewood in whatever crack opens between two rocking staves
      // (only well inside the window: toward its edge, where the real staves settle onto the sheet, the canvas is the
      // sheet's own picture, so no dark crack or dash can show where the two meet)
      if (vS > uWin.x && vS < uWin.y && abs(vX - uWin.z) < uWin.w) c = mix(c, hare*.4, 1. - smoothstep(.35*uNearR, .62*uNearR, dEye));
    #endif
    gl_FragColor = vec4(toScene(c), 1.);
  }`;function be(d,o,t){const r={...d.uniforms,uDrawn:{value:0},uSeaT:{value:0},uSwell:{value:k.swellH},uWin:{value:new y.Vector4(0,1,0,1)},uWinK:{value:0},uPhase:{value:t.range(0,Math.PI)},uGroove:{value:[-310,-190,-75,60,170,330].map(f=>f+Math.round(t.range(-22,22)))},uGrooveEnd:{value:[1e6,1e6,1e6,1e6,1e6,1e6]},uShadow:{value:Array.from({length:12},()=>new y.Vector4(0,-9999,0,1))},uShSide:{value:1},uPale:{value:0},uNearR:{value:12},uRel:{value:0}},a=f=>new y.ShaderMaterial({uniforms:r,vertexShader:ge,fragmentShader:ye(d.tone),defines:f?{NEAR:1}:{},side:f?y.FrontSide:y.DoubleSide,fog:!1,toneMapped:!1}),n=[];for(let f=-6;f<k.flat;f+=3)n.push(f);for(let f=k.flat;f<k.len;f+=4.5)n.push(f);n.push(k.len);const p=144,m=new Float32Array(n.length*(p+1)*3),c=[];for(let f=0;f<n.length;f++)for(let x=0;x<=p;x++){const N=(f*(p+1)+x)*3;m[N]=-k.halfWidth+2*k.halfWidth*x/p,m[N+1]=0,m[N+2]=n[f]}for(let f=0;f+1<n.length;f++)for(let x=0;x<p;x++){const N=f*(p+1)+x,C=N+1,R=N+p+1,B=R+1;c.push(N,R,C,C,R,B)}const l=new y.BufferGeometry;l.setAttribute("position",new y.BufferAttribute(m,3)),l.setIndex(c);const h=new y.Mesh(l,a(!1));h.frustumCulled=!1,h.material.polygonOffset=!0,h.material.polygonOffsetFactor=3,h.material.polygonOffsetUnits=3;const i=140,g=Math.round(34*o/2)*2,T=51,z=k.stave,A=[[-z/2,-.045],[-z/2+.028,0],[z/2-.028,0],[z/2,-.045]],P=new Float32Array(i*(g+1)*4*3),e=new Float32Array(i*(g+1)*4),w=new Float32Array(i*(g+1)*4*2),E=[];let s=0;for(let f=0;f<i;f++)for(let x=0;x<=g;x++)for(let N=0;N<4;N++,s++)if(P[s*3]=-T/2+T*x/g,e[s]=f,w[s*2]=A[N][0],w[s*2+1]=A[N][1],x<g&&N<3){const C=s,R=s+4,B=s+1,M=s+5;E.push(C,B,R,R,B,M)}const v=new y.BufferGeometry;v.setAttribute("position",new y.BufferAttribute(P,3)),v.setAttribute("aIdx",new y.BufferAttribute(e,1)),v.setAttribute("aC",new y.BufferAttribute(w,2)),v.setIndex(E);const b=new y.Mesh(v,a(!0));b.frustumCulled=!1;const u=z*16384;return{far:h,near:b,uniforms:r,dir:1,update(f,x,N=0){if(N>1e-4&&this._z!==void 0){const D=Math.min(40,Math.abs((x.z-this._z)/N-k.draw*this.dir))/60;r.uRel.value+=(D-r.uRel.value)*Math.min(1,N*3)}this._z=x.z;const C=(k.draw*f*this.dir%u+u)%u;r.uDrawn.value=C,r.uSeaT.value=f*this.dir;const R=Math.min(k.flat-i*z-4,Math.max(-3,x.z-23.5)),B=Math.floor((R-C)/z),M=18,j=Math.max(-k.halfWidth+T/2,Math.min(k.halfWidth-T/2,Math.round(x.x/M)*M))+.5*T/g;r.uWinK.value=B,r.uWin.value.set(B*z+C,(B+i)*z+C,j,T/2),r.uNearR.value=Math.min(21,Math.max(8,Math.sqrt(44*Math.max(1.5,x.y))))}}}const V=(d,o,t)=>new y.Vector3(d,o,t);function $(d,o,t){const r=Math.min(k.lipAngle+.25,Math.max(0,(d-k.flat)/k.R)),a=Math.cos(r),n=Math.sin(r);return V(o,k.R*(1-a)+t*a,Math.min(d,k.flat)+k.R*n-t*n)}function O(d,o,t=0){const r=d.dot(o);return r>.62?0:r>.3?t?2:1:r>.02?t?3:2:r>-.3?4:r>-.65?5:7}async function Me(d,o,t,r){const a=J,n=k.halfWidth,p=36,m=4;for(const s of[1,-1]){const v=s*(n-1.5),b=s*(n+26),u=[v,v+s*7,v+s*8.4,b],f=12;let x=0;for(let W=-12;W<k.len+8;W+=p,x++){const G=Math.min(W+p,k.len+8),S=(I,U)=>{const L=[];for(let _=0;_<=m;_++)L.push($(W+(G-W)*_/m,I,U));return L},q=s>0,F=(I,U,L)=>q?o.strip(I,U,L):o.strip(U,I,L);F(S(u[0],f),S(u[1],f),{sp:a.rosewood,ang:x%2?0:.5}),F(S(u[1],f),S(u[2],f),{sp:a.holly}),F(S(u[2],f),S(u[3],f),{sp:x%2?a.rosewood:a.walnut,ang:x%2?.5:0}),F(S(u[0],3.4),S(u[0],f),{sp:a.rosewood,ang:x%2?1.57:0}),F(S(u[0],2.2),S(u[0],3.4),{sp:a.ebony}),F(S(u[0],-14),S(u[0],2.2),{sp:a.bogoak,scorch:1}),F(S(u[3],f),S(u[3],-2),{sp:x%2?a.walnut:a.rosewood}),F(S(u[3],-2),S(u[3],-14),{sp:a.bogoak}),F(S(u[3],-14),S(u[0],-14),{sp:a.walnut,ang:1.57})}await d.yield();const N=$(k.len+6,0,-3),C=46,R=24,B=s*(n-4),M=s*(n+32),j=[0,10,13,29,33,C],D=[a.holly,a.ebony,-1,a.holly,a.rosewood];for(const W of[B,M])for(let G=0;G<5;G++)for(let S=0;S<R;S++){const q=S/R*Math.PI*2,F=(S+1)/R*Math.PI*2,I=(_,ee)=>V(W,N.y+_*Math.cos(ee),N.z+_*Math.sin(ee)),U=D[G]>=0?D[G]:S%2?a.pear:a.walnut,L=[I(j[G],q),I(j[G],F),I(j[G+1],F),I(j[G+1],q)];G===0?o.quad(L[3],L[2],L[1],L[0],{sp:U,ang:1.57}):o.quad(L[0],L[1],L[2],L[3],{sp:U,ang:G===2?1.57:0})}for(let W=0;W<R;W++){const G=W/R*Math.PI*2,S=(W+1)/R*Math.PI*2,q=(G+S)/2,F=V(0,Math.cos(q),Math.sin(q)),I=(U,L)=>V(U,N.y+C*Math.cos(L),N.z+C*Math.sin(L));o.quad(I(B,G),I(M,G),I(M,S),I(B,S),{sp:O(F,r,1),ang:W%2?0:1.57})}}await d.yield();const c=k.len,l=40,h=$(c,0,0),i=$(c+1,0,0).sub(h).normalize(),g=$(c,0,1).sub(h).normalize(),T=[[-1,-6],[-1,6],[5,9],[12,6],[12,-6]];for(let s=0;s<l;s++){const v=-n+2*n*s/l,b=-n+2*n*(s+1)/l;for(let u=0;u<T.length;u++){const f=T[u],x=T[(u+1)%T.length],N=(R,B)=>V(R,h.y,h.z).addScaledVector(i,B[0]).addScaledVector(g,B[1]),C=V().crossVectors(V(1,0,0),N(0,x).sub(N(0,f))).normalize();o.quad(N(v,f),N(b,f),N(b,x),N(v,x),{sp:u===4?a.bogoak:(s+u)%2?a.rosewood:O(C,r,1)===0?a.pear:a.walnut,ang:(s+u)%2?0:.35})}}const z=V(0,h.y,h.z).addScaledVector(i,5).addScaledVector(g,29),A=12,P=2*n/10,e=[[0,7.2],[4,7.2],[5.5,4.8],[8,6.4],[10.5,4.4],[20,4.9],[P/2-8,5.8],[P/2-4.5,7.4],[P/2,7.9]],w=[];for(let s=0;s<10;s++){const v=-n+s*P;for(const b of e)w.push([v+b[0],b[1]]);for(let b=e.length-2;b>=1;b--)w.push([v+P-e[b][0],e[b][1]])}w.push([n,7.2]);const E=(s,v)=>{const b=v/A*Math.PI*2;return V(s[0],z.y,z.z).addScaledVector(i,s[1]*Math.cos(b)).addScaledVector(g,s[1]*Math.sin(b))};for(let s=0;s<A;s++){const v=(s+.5)/A*Math.PI*2,b=V().addScaledVector(i,Math.cos(v)).addScaledVector(g,Math.sin(v)),u=O(b,r,1);for(let f=0;f+1<w.length;f+=4){const x=[],N=[];for(let C=f;C<=Math.min(f+4,w.length-1);C++)x.push(E(w[C],s)),N.push(E(w[C],s+1));o.strip(x,N,{sp:u})}s%4===3&&await d.yield()}for(let s=0;s<=10;s++)for(let v=0;v<8;v++){const b=-n+s*P+(s===0?2:s===10?-2:0),u=v/8*Math.PI*2,f=(v+1)/8*Math.PI*2,x=(u+f)/2,N=V(Math.cos(x),0,0).addScaledVector(i,Math.sin(x)),C=O(N,r,0),R=(W,G,S)=>V(b+S*Math.cos(W),h.y,h.z).addScaledVector(i,5+S*Math.sin(W)).addScaledVector(g,G),B=[8,11.5,14.5,17.5,23.5],M=[5.6,3.2,4.6,3,4.2],j=B.map((W,G)=>R(u,W,M[G])),D=B.map((W,G)=>R(f,W,M[G]));o.strip(j,D,{sp:C})}return{lip:h,lipT:i,lipN:g,railC:z}}function Se(d,o){const t=J,r=14,a=7,n=30,p=e=>4.5*Math.min(1,.62+2.1*e)*Math.pow(Math.max(0,1-Math.pow(e,2.6)),.8)+.12,m=e=>3.1+3.4*(1-e)*(1-e)*(1-e)+1.9*e*e*e,c=(e,w,E)=>V(-n/2+n*e+2.8*w*e*e-1.3*w*(1-e)*(1-e),m(e)*w,E*p(e)*(.7+.3*Math.pow(w,.6))),l=[t.walnut,t.walnut,t.pear,t.walnut,t.pear,t.ebony,t.oak],h=[t.bogoak,t.bogoak,t.walnut,t.rosewood,t.walnut,t.ebony,t.pear];for(const e of[1,-1])for(let w=0;w<a;w++){const E=w*3%5;let s=0;for(;s<r;){const v=Math.min(r,s===0?3+E:s+5),b=[],u=[];for(let f=s;f<=v;f++)b.push(c(f/r,w/a,e)),u.push(c(f/r,(w+1)/a,e));e>0?d.strip(b,u,{sp:l[w],ang:.03*(w%3-1)}):d.strip(u,b,{sp:h[w],ang:.03*(w%3-1)}),s=v}}for(let e=0;e<a;e++)d.quad(c(0,e/a,-1),c(0,e/a,1),c(0,(e+1)/a,1),c(0,(e+1)/a,-1),{sp:e===4?t.holly:e%2?t.pear:t.walnut});for(let e=0;e<r;e++){const w=(E,s,v)=>{const b=c(E,.88,s);return b.z*=v,b};for(const[E,s,v]of[[-1,-.18,t.oak],[-.18,.18,t.holly],[.18,1,t.oak]])d.quad(w(e/r,1,E),w((e+1)/r,1,E),w((e+1)/r,1,s),w(e/r,1,s),{sp:v,ang:e%2?0:.06})}const i=(e,w,E,s,v,b,u)=>d.block(new y.Matrix4().makeTranslation(e,w,E),s,v,b,u);i(-11.2,m(.12)+1.2,0,6.4,2.6,6.6,{sp:t.pear,top:t.oak,ends:t.walnut,sides:t.pear}),i(-11.2,m(.12)+2.7,0,7,.4,7.2,{sp:t.ebony,top:t.oak,sides:t.ebony});for(const e of[-3.32,3.32])for(const w of[-12.8,-11.2,-9.6])i(w,m(.12)+1.3,e,.9,1.1,.06,{sp:t.holly,sides:t.holly});i(11.6,m(.9)+.5,0,4.4,1,3.6,{sp:t.walnut,top:t.oak,sides:t.rosewood}),i(-15.5,2,0,1.3,4,.3,{sp:t.walnut,sides:t.walnut,ends:t.ebony});const g=(e,w,E,s,v,b)=>{const u=V().subVectors(w,e).normalize(),f=V().crossVectors(u,Math.abs(u.z)>.9?V(0,1,0):V(0,0,1)).normalize(),x=V().crossVectors(u,f);for(let N=0;N<4;N++){const C=[f,x,f.clone().negate(),x.clone().negate()][N],R=[x,f.clone().negate(),x.clone().negate(),f][N];d.quad(e.clone().addScaledVector(C,E),w.clone().addScaledVector(C,s),w.clone().addScaledVector(R,s),e.clone().addScaledVector(R,E),{sp:N<2?v:b})}},T=m(.5)*.88,z=[[1.5,27,.55,15,.52],[9.5,20,.45,11,.5]];for(const[e,w,E,s,v]of z){g(V(e,T,0),V(e,w,0),E,E*.45,t.pear,t.walnut);const b=w*.9,u=T+2.6,f=6,x=6,N=s*.2;g(V(e+.5,b,-s/2-.8),V(e+.5,b,s/2+.8),.34,.34,t.rosewood,t.ebony);const C=(M,j)=>{const D=-.5+M/f,W=j/x,G=s*(1-.1*W);return V(e+.9+N*Math.sin(Math.PI*Math.min(1,W*1.08))*(1-1.6*D*D),b+(u-b)*W,D*G)};for(let M=0;M<f;M++){const j=[],D=[];for(let W=0;W<=x;W++)j.push(C(M+1,W)),D.push(C(M,W));d.strip(j,D,{sp:M%2?t.holly:t.sycamore,move:s*.045})}const R=[],B=[];for(let M=0;M<=3;M++)R.push(V(e+M*1.5,w-.2-M*.12,0)),B.push(V(e+M*1.5,w-1.3+M*.1,0));d.strip(R,B,{sp:v>.51?t.pear:t.holly,move:.5})}const A=V(-13.5,m(.12)+4.5,.5),P=V(-4.5,m(.12)+16,.5);g(V(-9.5,m(.12)+2.9,0),V(-9.5,m(.12)+13,0),.4,.22,t.pear,t.walnut),g(A,P,.28,.2,t.rosewood,t.ebony);for(let e=0;e<4;e++){const w=[],E=[],s=(v,b)=>{const u=V().lerpVectors(A,P,v),f=V(-13.5+3*v,m(.12)+4.2,.5),x=V().lerpVectors(u,f,b);return x.z+=1.6*Math.sin(Math.PI*b)*Math.sin(Math.PI*Math.min(1,v+.15)),x};for(let v=0;v<=4;v++)w.push(s((e+1)/4,v/4)),E.push(s(e/4,v/4));d.strip(w,E,{sp:e%2?t.sycamore:t.holly,move:.35})}return d}function ke(d,o,t,r,a,n=1){const m=6.300000000000001,c=-new y.Box3().setFromBufferAttribute(o.getAttribute("position")).min.x,l=4,h=160,i=l*h,g=k.flat-70-c*(m-4.2),T=new y.Group,z=[],A=[r.range(-150,-40),r.range(60,190),r.range(-260,-170)],P=[205+(-A[0]-40)*.6,-(215+(A[1]-60)*.6),250+(-A[2]-170)*.7,-(232+.3*(A[1]+A[0]+90))];for(let R=0;R<l;R++){const B=new y.Mesh(o,t);B.matrixAutoUpdate=!1,B.frustumCulled=!1,T.add(B),z.push(B)}const e=new y.Vector3,w=new y.Vector3,E=new y.Vector3,s=new y.Vector3,v={},b={},u=new y.Quaternion,f=new y.Quaternion,x=new y.Vector3,N=new y.Matrix4,C=[];return{group:T,state:C,dir:1,update(R){for(let M=0;M<l;M++){const j=((M*h+k.draw*R*this.dir)%i+i)%i,D=g+j,W=P[M];xe(D,b),ne(D,W,R*this.dir,v);const G=b.th+Math.atan(v.slope)*.8,S=Math.cos(b.th),q=Math.sin(b.th);s.set(W,b.y+v.h*S,b.z-v.h*q),e.set(0,-Math.sin(G),-Math.cos(G)),w.set(0,Math.cos(G),-Math.sin(G)),E.crossVectors(e,w),N.makeBasis(e,w,E),u.setFromRotationMatrix(N);const F=Math.min(Q(j/18),1-Q((j-(i-30))/22));f.setFromAxisAngle(e.set(0,1,0),(W<0?.32:-.32)*F),u.multiply(f),f.setFromAxisAngle(e.set(1,0,0),(1-F)*Math.PI*.5+.05*Math.sin(R*.6+M*2.1)*F),u.multiply(f);const I=.04+.96*(1-Q((j-(i-30))/22));x.set(m*I,m*I,m*I*(.04+.96*F)),z[M].matrix.compose(s,u,x),z[M].matrixWorldNeedsUpdate=!0,C[M]={s:D,x:W,theta:b.th,up:F,tr:j}}let B=0;for(let M=1;M<l;M++)C[M].tr>C[B].tr&&(B=M);a.uShSide.value=n;for(let M=1;M<l;M++){const j=C[(B+M)%l];a.uShadow.value[M-1].set(j.x,j.s,26*m*j.up*(M===l-1?C[B].up:1),-15*m)}}}}const Q=d=>(d=Math.min(1,Math.max(0,d)),d*d*(3-2*d));function ze(d,o,t,r){const a=J,n=24,p=8,m=9.15,c=1.65,l=1.3,h=13,i=(A,P)=>{const e=A/n*Math.PI*2+Math.PI/n,w=P/p*Math.PI*2+Math.PI/p,E=m+c*Math.cos(w);return V(r.x+E*Math.sin(e),r.y+E*Math.cos(e),r.z+c*Math.sin(w))};for(let A=0;A<n;A++)for(let P=0;P<p;P++){const e=[i(A,P),i(A+1,P),i(A+1,P+1),i(A,P+1)],E=V().crossVectors(e[1].clone().sub(e[0]),e[3].clone().sub(e[0])).normalize().dot(t)>.05;d.quad(e[0],e[1],e[2],e[3],{sp:(A+P)%2?a.boxwood:E?a.ebony:a.bogoak,ang:(A+P)%4<2?0:1.57})}for(const A of[-1,1])d.block(new y.Matrix4().makeTranslation(r.x+A*5.6,l+1,r.z),3.2,2,4.6,{sp:a.pear,top:a.holly,sides:A>0?a.pear:a.walnut,ends:a.rosewood});const g=28,T=-1.2,z=[[T,.2,-1],[.2,.55,a.ebony],[.55,l-.25,-1],[l-.25,l,a.holly]];for(let A=0;A<g;A++){const P=A/g*Math.PI*2,e=(A+1)/g*Math.PI*2,w=(P+e)/2,E=V(Math.sin(w),0,Math.cos(w)),s=(u,f,x=h)=>V(r.x+x*Math.sin(u),f,r.z+x*Math.cos(u));for(const[u,f,x]of z)d.quad(s(P,u),s(e,u),s(e,f),s(P,f),{sp:x>=0?x:O(E,t,1),ang:x>=0?0:1.57});const v=[0,4.5,5.1,9.6,10.2,h],b=[a.pear,a.ebony,-1,a.ebony,a.oak];for(let u=0;u<5;u++){const f=b[u]>=0?b[u]:A%2?a.holly:a.walnut,x=[s(P,l,v[u]),s(e,l,v[u]),s(e,l,v[u+1]),s(P,l,v[u+1])];u===0?d.quad(x[2],x[3],x[0],x[1],{sp:f,ang:1.57}):d.quad(x[1],x[0],x[3],x[2],{sp:f,ang:u===2?1.57:0})}A===0&&d.quad(V(r.x-3.5,l+.02,r.z-1.9),V(r.x-3.5,l+.02,r.z+2.1),V(r.x-11.8,l+.02,r.z+4.4),V(r.x-11.8,l+.02,r.z+.4),{sp:a.bogoak,scorch:1})}}async function Ne(d,o={}){const t=Math.min(1,Math.max(.6,o.detail??d.quality?.detail??1)),r=!o.style,a=o.style||await de(d,{palette:o.palette,exposure:o.exposure}),n=d.rng.fork("roll-top-hero"),p=o.frame==="course",m=new y.Group,c=new y.Group;m.add(c),p||(c.rotation.y=Math.PI,c.position.set(0,0,(k.flat+k.R)/2)),c.updateMatrix();const l=(S,q,F)=>new y.Vector3(S,q,F).applyMatrix4(c.matrix),h=(S,q,F)=>new y.Vector3(S,q,F).transformDirection(c.matrix);await d.yield();const i=be(a,t,n);c.add(i.far,i.near),await d.yield();const g=[],T=X.clone(),z=a.builder(),A=await Me(d,z,n,T),P=new y.Vector3(0,12,o.ringZ??285);o.ring!==!1&&ze(z,n,T,P),await d.yield();const e=new y.Mesh(z.build(),a.pieceMaterial());e.frustumCulled=!1,c.add(e);const w=e.material,E=a.builder();Se(E,n.fork("caravel"));const s=E.build(),v=s.clone(),b=v.getAttribute("aSr").clone(),u=[0,1,1,1,2,3,6,4,8,9];for(let S=0;S<b.count;S++)b.setX(S,u[Math.round(b.getX(S))]);v.setAttribute("aSr",b),await d.yield(),await d.yield();const f=ke(a,v,w,n,i.uniforms,o.sunSide??1);c.add(f.group),g.push(f);const x=new y.Vector3,N=new y.Vector3,C=new y.Vector3,R=new y.Matrix3,B=A.lip,M=(S,q,F)=>l(S,q,F),j={},D={portalSeat:{position:M(P.x,P.y,P.z),facing:h(0,0,-1),radius:7},flyThrough:[M(0,5,-8),M(0,3.4,26),M(0,3,70),M(0,3,150),M(0,7,195),M(0,12,225),M(0,12,255),M(0,12,P.z)],quayEdge:{position:M(0,0,0),seaward:h(0,0,1),port:h(1,0,0)},viewpoints:{lowOnStaves:M(0,3,110),lookUpFrom:M(0,3,170),frontFar:M(0,60,-220)},poiCurve:M(0,150,k.flat+225),poiLip:M(0,B.y,B.z),wallFoot:M(0,0,k.flat),wallFace:M(0,k.R,k.flat+k.R),runnerPort:M(k.halfWidth,0,0),runnerStarboard:M(-k.halfWidth,0,0),grooves:i.uniforms.uGroove.value.map(S=>M(S,0,0)),sun:h(X.x,X.y,X.z)},W={object:m,inner:c,style:a,sea:i.uniforms,anchors:D,radius:400,height:440,center:l(0,150,k.flat-100),ground:!1,groundY:0,curveShips:f.state,makeCaravel(){return new y.Mesh(s,w)},seaHeight(S,q,F){return ne(q,S,F*i.dir,j).h*(i.uniforms.uSwell.value/k.swellH)},setDraw(S){i.dir=S<0?-1:1,f.dir=i.dir},setSeaShadow(S,q,F,I,U=3){i.uniforms.uShadow.value[U].set(S,q,F,I)},setSwell(S){i.uniforms.uSwell.value=S},setProgress(S){G=S},update(S,q,F){a.uniforms.uTime.value=q,c.updateWorldMatrix(!0,!1),F?x.setFromMatrixPosition(F.matrixWorld):x.set(0,10,0),N.copy(x),c.worldToLocal(N),r&&(R.setFromMatrix4(c.matrixWorld),a.uniforms.uSun.value.copy(C.copy(X).applyMatrix3(R).normalize())),i.update(q,N,S);for(const I of g)I.update(q,S)},dispose(){r&&a.uniforms.uGrain.value.dispose()}};let G=0;return W}export{we as PieceBuilder,k as SEA,J as SPECIES,se as STYLE_GLSL,Se as buildCaravel,Ne as buildHero,de as createStyle,xe as seaCurveJS,ne as swellJS,he as toSceneJS,le as toneGLSL};
