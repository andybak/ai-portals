import*as g from"three";import{clamp as se,lerp as J}from"../kit/core.js";const g0=["#14246A","#0C0D12","#E23B2A","#F2C230","#F3EEDD","#8A3B1E","#2F9A6B"],be=32*Math.PI/180,me=480,Ze=6,f0=78,P=[0,Math.sin(be),-Math.cos(be)],v=[0,Math.cos(be),Math.sin(be)],R=(s,u,t)=>[u,P[1]*s+v[1]*t,P[2]*s+v[2]*t],ae=s=>5+4*(s/me);function we(){const s=[];return{d:s,get count(){return s.length/20},push(u,t,O,j,U,D){s.push(u[0],u[1],u[2],t[0],t[1],t[2],O[0],O[1],O[2],j[0],j[1],j[2],j[3],U[0],U[1],U[2],U[3],D[0],D[1],D[2])}}}const $=[0,0,0,0],ke=(s,u,t=.5)=>[J(s[0],u[0],t),J(s[1],u[1],t),J(s[2],u[2],t)],a=(s,u,t=1)=>[s[0]+u[0]*t,s[1]+u[1]*t,s[2]+u[2]*t],Be=(s,u)=>[s[0]-u[0],s[1]-u[1],s[2]-u[2]],Ye=s=>Math.hypot(s[0],s[1],s[2]),W=s=>{const u=Ye(s)||1;return[s[0]/u,s[1]/u,s[2]/u]},ee=(s,u)=>[s[1]*u[2]-s[2]*u[1],s[2]*u[0]-s[0]*u[2],s[0]*u[1]-s[1]*u[0]];async function Je(s,u){const O=new Float32Array(16384),j=new Uint8Array(4096*4);for(let D=0;D<O.length;D++)O[D]=s();u&&await u.yield();for(let D=0;D<64;D++){u&&D%22===21&&await u.yield();for(let A=0;A<64;A++)for(let N=0;N<4;N++){let te=0;for(let H=-1;H<=1;H++)for(let E=-1;E<=1;E++)te+=O[((D+H+64)%64*64+(A+E+64)%64)*4+N]*(E===0&&H===0?4:E===0||H===0?2:1);j[(D*64+A)*4+N]=Math.round(se((te/16-.5)*1.9+.5,0,1)*255)}}const U=new g.DataTexture(j,64,64,g.RGBAFormat,g.UnsignedByteType);return U.wrapS=U.wrapT=g.RepeatWrapping,U.magFilter=g.LinearFilter,U.minFilter=g.LinearFilter,U.generateMipmaps=!1,U.needsUpdate=!0,U}const Ae=`
  attribute vec3 iA, iB, iC, iQ; attribute vec4 iW, iOwn;
  uniform float uTime, uHop; uniform vec2 uRes, uFlex; uniform vec3 uA, uN;
  uniform vec4 uPiv[5], uAxs[5], uCen[5], uNr[5], uArm[5];
  vec3 rotK(vec3 v, vec3 k, float a) { float c = cos(a), s = sin(a); return v * c + cross(k, v) * s + k * dot(k, v) * (1. - c); }
  vec3 moveP(vec3 p) {
    int g = int(iW.z + 0.5); int mode = int(iW.w + 0.5);
    bool spin = g >= 8; if (spin) g -= 8;
    g = g > 4 ? 4 : g;
    if (g > 0) {
      if (spin) p = uCen[g].xyz + rotK(p - uCen[g].xyz, uNr[g].xyz, uCen[g].w);
      vec3 r = p - uPiv[g].xyz;
      float lever = clamp(dot(r, uArm[g].xyz) / max(uArm[g].w, 1.), -1.2, 1.2);   // +1 at the sign, -1 at the counterweight
      p = uPiv[g].xyz + rotK(r, uAxs[g].xyz, uPiv[g].w) + uN * (uAxs[g].w * lever);
    }
    if (mode == 1) {
      float d = length(p - iOwn.xyz);
      p += (vec3(1., 0., 0.) * sin(uTime * 0.9 + iOwn.w) + uA * cos(uTime * 0.7 + iOwn.w * 1.7)) * min(d * d * 0.006, d * 0.11);
    } else if (mode == 2) {
      vec3 foot = iOwn.xyz;
      float k = mod(uHop + iOwn.w, 77.), n = floor(k), f = k - n;
      float air = smoothstep(0.3, 0.8, f), arc = sin(3.14159 * air);
      float c1 = smoothstep(0.03, 0.27, f) * (1. - smoothstep(0.27, 0.4, f));
      float c2 = smoothstep(0.78, 0.86, f) * (1. - smoothstep(0.86, 1., f));
      float leg = 1. - 0.6 * c1 - 0.45 * c2 + 0.3 * arc;
      float h = dot(p - foot, uN), top = 0.6;
      float h2 = h < top ? h * leg : h - top * (1. - leg);
      p += uN * (h2 - h) + uA * (max(h - top, 0.) * 0.22 * arc);
      float sc = smoothstep(0., 0.7, k) * (1. - smoothstep(76.2, 77., k));
      p = foot + (p - foot) * sc;
      p += uA * (6. * (1. + n + air)) + uN * (1.5 * arc);
    } else if (mode == 3) {
      // resident tender: keeps its rung, hopping to and fro along it. iOwn.w = phase + 100 * (ten times its scale - 10)
      vec3 foot = iOwn.xyz;
      float q = floor(iOwn.w / 100.), sc = 1. + 0.1 * q;
      float k = uTime * 0.8 + (iOwn.w - 100. * q), n = floor(k), f = k - n;
      float air = smoothstep(0.3, 0.8, f), arc = sin(3.14159 * air);
      float c1 = smoothstep(0.03, 0.27, f) * (1. - smoothstep(0.27, 0.4, f));
      float c2 = smoothstep(0.78, 0.86, f) * (1. - smoothstep(0.86, 1., f));
      float leg = 1. - 0.6 * c1 - 0.45 * c2 + 0.3 * arc;
      float h = dot(p - foot, uN), top = 0.8 * sc;
      float h2 = h < top ? h * leg : h - top * (1. - leg);
      float to = mod(n, 2.) < 0.5 ? air : 1. - air;
      p += uN * (h2 - h + 1.1 * sc * arc) + vec3(1., 0., 0.) * ((to - 0.5) * 2.2 * sc + max(h - top, 0.) * 0.16 * arc * (mod(n, 2.) < 0.5 ? 1. : -1.));
    }
    float s = max(dot(p, uA), 0.) / 480.;
    return p + (vec3(1., 0., 0.) * uFlex.x + uN * uFlex.y) * (s * s);
  }
`,Re=Ae+`
  uniform vec2 uWave;                       // waver cycles along one stroke
  varying vec2 vSV; varying vec4 vInfo;     // vSV: across, cap.  vInfo: along (widths), seed, coverage, nearness
  void main() {
    vec3 a = moveP(iA), b = moveP(iB), c = moveP(iC);
    float t = position.x, m = 1. - t, seed = iW.y;
    vec3 p = a * m * m + b * (2. * m * t) + c * (t * t);
    vec3 tg = mix(b - a, c - b, t);
    float tl = length(tg); tg = tl > 1e-5 ? tg / tl : vec3(0., 1., 0.);
    vec4 c0 = projectionMatrix * modelViewMatrix * vec4(p, 1.);
    vec4 c1 = projectionMatrix * modelViewMatrix * vec4(p + tg, 1.);
    vec2 d = (c1.xy * c0.w - c0.xy * c1.w) * uRes;
    float dl = length(d); d = dl > 1e-6 ? d / dl : vec2(1., 0.);
    vec2 nrm = vec2(-d.y, d.x);
    float w = max(abs(c0.w), 1e-3);
    float pxPerM = projectionMatrix[1][1] * uRes.y * 0.5 / w;
    float env = sin(3.14159 * t);
    float breathe = 1. + 0.25 * sin(t * uWave.y * 4.1 + seed * 7.3) * env + 0.22 * smoothstep(0.78, 1., abs(2. * t - 1.)) * (1. - iQ.z);
    float taper = mix(1., 1. - 0.8 * t, iQ.y);
    float halfM = iW.x * 0.5 * breathe * taper;
    float truePx = halfM * pxPerM, floorPx = abs(iQ.x) * 0.5;
    float halfPx = max(truePx, floorPx);
    float wav = (sin(t * uWave.x * 6.283 + seed * 5.1 + uTime * 1.05) + 0.7 * sin(t * uWave.y * 6.283 - seed * 3.7 - uTime * 0.8)) * env * (1. - 0.55 * iQ.z);
    vec2 off = (nrm * (position.y + wav * 0.45) + d * position.z) * halfPx;
    c0.xy += off * 2. / uRes * w;
    gl_Position = c0;
    vSV = position.yz;
    float along = t * length(c - a) / max(iW.x, 0.02);
    float ratio = truePx / max(floorPx, 1e-3);
    float cov = iQ.x < 0. ? smoothstep(0.2, 1., ratio) : clamp(ratio, 0.78, 1.);       // negative floor: fade right out when tiny
    if (iW.w < 0.5 && iOwn.x > 0.) cov *= smoothstep(2., 5., iOwn.x * pxPerM);        // repeated strokes (rungs) fade as their spacing closes
    vInfo = vec4(along, seed, cov, smoothstep(1.5, 5., truePx));
  }
`,Te=`
  uniform sampler2D uNoise; uniform float uInk;
  varying vec2 vSV; varying vec4 vInfo;
  void main() {
    vec2 sv = clamp(vSV, -1., 1.);                                               // across and cap, held to their own range before they are squared
    float d = length(sv), aa = max(fwidth(d) * 1.2, 1e-3);
    float n = texture2D(uNoise, vec2(vInfo.x * 0.021 + vInfo.y * 0.37, sv.x * 0.11 + vInfo.y * 1.7)).r;
    float n2 = texture2D(uNoise, vec2(vInfo.x * 0.006 + vInfo.y * 0.61, sv.x * 0.42 + vInfo.y * 2.3)).g;
    float edge = 1. - (0.12 + (n - 0.5) * 0.38) * vInfo.w;                       // ragged brush edge up close
    float cov = 1. - smoothstep(edge - aa, edge, d);
    float brk = smoothstep(0.6, 0.78, n2) * smoothstep(0.15, 0.85, abs(sv.x)) * vInfo.w;   // dry-brush streaks
    cov *= (1. - 0.6 * brk) * vInfo.z;
    gl_FragColor = vec4(vec3(cov * uInk), 1.);
  }
`,Se=Ae+`
  varying vec2 vUv; varying vec4 vInfo; varying vec3 vCol;   // vInfo: shape, seed, coverage, ragged
  uniform vec3 uCol[7];
  void main() {
    vec3 cen = moveP(iA);
    vec3 pu = moveP(iA + iB) - cen, pv = moveP(iA + iC) - cen;
    vec4 mv; float cov = 1.;
    if (iQ.z > 0.5) {
      float r = length(pu);
      mv = modelViewMatrix * vec4(cen, 1.);
      float rpx = r * projectionMatrix[1][1] * uRes.y * 0.5 / max(-mv.z, 1e-3);
      float k = max(rpx, 1.1) / max(rpx, 1e-4);
      cov = iQ.z > 1.5 ? smoothstep(0.3, 1., rpx / 1.1) : clamp(rpx / 1.1, 0.4, 1.);   // 2: vanish when tiny, 1: stay as a pale speck
      mv.xy += position.xy * r * min(k, 400.);
    } else {
      mv = modelViewMatrix * vec4(cen + pu * position.x + pv * position.y, 1.);
    }
    gl_Position = projectionMatrix * mv;
    vUv = position.xy;
    vInfo = vec4(iQ.x, iW.y, cov, iW.x);
    vCol = uCol[int(clamp(iQ.y, 0., 6.) + 0.5)];
  }
`,Ie=`
  uniform sampler2D uNoise; uniform float uInk, uUseCol, uGain;
  varying vec2 vUv; varying vec4 vInfo; varying vec3 vCol;
  float sdSeg(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0., 1.); return length(pa - ba * h); }
  void main() {
    vec2 uv = vUv; float seed = vInfo.y, rag = vInfo.w; int shape = int(vInfo.x + 0.5);
    vec2 so = vec2(fract(seed * 0.731), fract(seed * 1.37));
    float n1 = texture2D(uNoise, uv * 0.13 + so).r - 0.5;
    float n2 = texture2D(uNoise, uv * 0.47 + so.yx).g - 0.5;
    vec2 sq = abs(uv.x) + abs(uv.y) < 1e-3 ? vec2(1e-3, 0.) : uv;
    // dry-brush grain: isotropic on the earth, streaks that run round the edge on every other blot
    vec2 guv = shape == 6 ? uv * 5.5 : vec2(atan(sq.y, sq.x) * 0.31831, length(uv) * 1.4);
    float n3 = texture2D(uNoise, guv + so).b;
    float grain0 = 1. - smoothstep(0.2, 0.7, length(fwidth(uv)) * 0.47 * 24.);
    float d;
    if (shape == 1) {
      d = max(length(uv) - 0.92, -(length(uv - vec2(0.37, 0.03)) - 0.80));
    } else if (shape == 2) {
      d = (abs(uv.x) / 0.56 + abs(uv.y) / 0.92 - 1.) * 0.46;
    } else if (shape == 3) {
      float cap = length(vec2(uv.x * 0.9, max(abs(uv.y) - 0.62, 0.) * 2.4)) - 0.74;     // rounded outer ends
      d = max(cap, abs(uv.x) - (0.075 + 0.62 * uv.y * uv.y + 0.16 * abs(uv.y)));
    } else if (shape == 4) {
      d = 1e3;
      for (int i = 0; i < 4; i++) {
        float fi = float(i), an = fi * 0.7854 + sin(seed * (3.1 + fi * 1.7)) * 0.15;
        vec2 dir = vec2(cos(an), sin(an));
        float L = 0.79 + 0.13 * sin(seed * 5.3 + fi * 2.1), al = dot(uv, dir);
        float hw = 0.05 + 0.017 * sin(al * 7. + seed + fi * 1.3) + 0.035 * smoothstep(0.5, 1., abs(al) / L);
        d = min(d, sdSeg(uv, -dir * L, dir * L) - hw);
      }
    } else if (shape == 5) {
      d = length(uv * vec2(1., 1.22) + vec2(0., 0.2 * sin(uv.x * 2.2 + seed))) - 0.84;
    } else if (shape == 6) {
      d = length(uv * vec2(1., 1.12)) - 0.6 + n1 * 0.55 + n2 * 0.2 * grain0;
    } else {
      d = length(uv) - 0.9;
    }
    d += (n1 * 0.075 + n2 * 0.035) * rag;
    float aa = max(fwidth(d) * 0.75, 1e-4);
    float cov = 1. - smoothstep(-aa, aa, d);
    float band = smoothstep(-0.06 * max(rag, 0.3) * (shape == 6 ? 5. : 1.), 0.005, d);   // dry-brush fringe just inside the edge
    float grain = 1. - smoothstep(0.5, 1.6, length(fwidth(uv)) * (shape == 6 ? 5.5 : 1.4) * 64.);   // no speckle once the noise is under a pixel
    cov *= 1. - band * smoothstep(0.45, 0.55, n3) * min(rag, 1.) * 0.9 * grain;
    vec3 col = mix(vec3(uInk), vCol * uGain * (1. - 0.09 * n2), uUseCol);
    gl_FragColor = vec4(min(col * (cov * vInfo.z), vec3(1.)), 1.);
  }
`;function ze(s){const u=[[0,-1]];for(let U=0;U<=s;U++)u.push([U/s,0]);u.push([1,1]);const t=[],O=[];u.forEach(([U,D],A)=>{if(t.push(U,-1,D,U,1,D),A>0){const N=(A-1)*2;O.push(N,N+2,N+1,N+1,N+2,N+3)}});const j=new g.BufferGeometry;return j.setAttribute("position",new g.Float32BufferAttribute(t,3)),j.setIndex(O),j}function $e(){const s=new g.BufferGeometry;return s.setAttribute("position",new g.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),s.setIndex([0,1,2,0,2,3]),s}function xe(s,u){const t=new g.InstancedBufferGeometry;t.index=s.index,t.setAttribute("position",s.getAttribute("position"));const O=new g.InstancedInterleavedBuffer(new Float32Array(u.d),20);return t.setAttribute("iA",new g.InterleavedBufferAttribute(O,3,0)),t.setAttribute("iB",new g.InterleavedBufferAttribute(O,3,3)),t.setAttribute("iC",new g.InterleavedBufferAttribute(O,3,6)),t.setAttribute("iW",new g.InterleavedBufferAttribute(O,4,9)),t.setAttribute("iOwn",new g.InterleavedBufferAttribute(O,4,13)),t.setAttribute("iQ",new g.InterleavedBufferAttribute(O,3,17)),t.instanceCount=u.count,t.boundingSphere=new g.Sphere(new g.Vector3(0,130,-200),420),t}function ge(s,u,t,O){return new g.ShaderMaterial({vertexShader:s,fragmentShader:u,uniforms:t,fog:!1,side:g.DoubleSide,depthTest:!0,depthWrite:!1,transparent:!0,blending:g.CustomBlending,blendEquation:g.AddEquation,blendSrc:O==="stain"?g.OneMinusDstColorFactor:g.ZeroFactor,blendDst:g.OneMinusSrcColorFactor,blendSrcAlpha:g.ZeroFactor,blendDstAlpha:g.OneFactor,toneMapped:!1})}async function v0(s,u={}){const t=s.rng.fork?s.rng.fork("long-ladder"):s.rng,O=u.palette&&u.palette.length>=7?u.palette:g0,j=se(u.detail??s.quality?.detail??1,.6,1),U=u.gain??1,D=u.duration??45,A=we(),N=we(),te=we(),H=we(),E=()=>t.range(0,40),B=(e,n,i,c,o,r={})=>e.push(n,a(ke(n,i),c||[0,0,0]),i,[o,E(),r.group||0,r.mode||0],r.own||(r.spacing?[r.spacing,0,0,0]:$),[r.minPx??2,r.taper||0,r.chain?1:0]),I=(e,n,i={})=>te.push(e,[n,0,0],[0,n,0],[i.rag??.7,E(),i.group||0,i.mode||0],i.own||$,[0,0,i.keep?1:2]),X=(e,n,i,c,o,r={})=>(o===0?te:H).push(e,n,i,[r.rag??1,E(),r.group||0,r.mode||0],r.own||$,[c,o,0]),fe=48,ie=me/fe,pe=[-1,1].map(e=>{const n=[],i=[];for(let c=0;c<=ie;c++){const o=c*fe,r=c===0||c===ie;n.push(R(o,e*(ae(o)+(r?0:t.range(-.4,.4))),r?0:t.range(-.3,.3)))}for(let c=0;c<ie;c++)i.push(a(a(ke(n[c],n[c+1]),[e*t.range(-.3,1.1),0,0]),v,t.range(-.6,.6)));return{side:e,nodes:n,ctrls:i}}),ce=(e,n)=>{const i=pe[e],c=se(Math.floor(n/fe),0,ie-1),o=se((n-c*fe)/fe,0,1),r=1-o,l=i.nodes[c],b=i.ctrls[c],f=i.nodes[c+1];return[l[0]*r*r+b[0]*2*r*o+f[0]*o*o,l[1]*r*r+b[1]*2*r*o+f[1]*o*o,l[2]*r*r+b[2]*2*r*o+f[2]*o*o]};for(const e of pe)for(let n=0;n<ie;n++)if(N.push(e.nodes[n],e.ctrls[n],e.nodes[n+1],[.6,E(),0,0],$,[5.5,0,0]),n>0){const i=e.nodes[n];I(i,.62,{rag:1.2});for(let c=-2;c<=2;c++){const o=c*.34+t.range(-.05,.05);B(A,a(a(i,[.62,0,0]),P,o-.3),a(a(i,[-.62,0,0]),P,o+.3),a([0,0,0],v,.5),.13,{minPx:-1.3})}for(const c of[-1,1]){const o=a(a(a(i,[e.side*t.range(1.2,2.4),0,0]),P,c*t.range(.8,2)),v,t.range(.3,1.4));B(A,i,o,a([0,0,0],v,t.range(.4,1.2)),.12,{minPx:-1.3,taper:.7})}}await s.yield();const e0=new Set([t.int(8,24),t.int(26,44),t.int(46,70)]);for(let e=1;e<=f0;e++){const n=e*Ze,i=e0.has(e)?t.range(1.2,2.2)*t.sign():0,c=ce(0,n-Math.max(i,0)),o=ce(1,n-Math.max(-i,0));B(A,c,o,a(a([0,0,0],P,-1.2+t.range(-.25,.25)),v,t.range(-.25,.25)),.42,{spacing:Ze});for(const[r,l]of[[c,-1],[o,1]]){I(r,.4+t.range(-.04,.07),{rag:1.1});const b=j<.8?2:3;for(let f=0;f<b;f++){const S=(f-(b-1)/2)*.36+t.range(-.06,.06),p=.34*(f%2?-1:1);B(A,a(a(r,[l*.62,0,0]),P,S-p),a(a(r,[-l*.62,0,0]),P,S+p),a([0,0,0],v,.45),.11,{minPx:-1.3})}}}await s.yield();const le=[1,0,0],Oe=W(a(v,P,.28));for(const e of pe){const n=e.side,i=e.nodes[ie],c=4.5,o=1.8,r=17,l=o*Math.PI*2,b=a(R(me+3.2,n*(9+c),0),Oe,5.2),f=(p,d=1)=>{const m=c*(1-.8*p/l)*d;return a(a(b,le,-n*Math.cos(p)*m),Oe,Math.sin(p)*m)},S=f(0);N.push(i,a(a(ke(i,S),P,2.2),v,-2.4),S,[.5,E(),0,0],$,[2,0,1]);for(let p=0;p<r;p++){const d=p/r*l,m=(p+1)/r*l,w=(m-d)/2;A.push(f(d),f(d+w,1/Math.cos(w)),f(m),[J(.5,.2,(p+.5)/r),E(),0,0],$,[2,0,1])}I(f(l),.5,{rag:1.2}),I(i,.55,{rag:1.2})}for(const e of pe){const n=[e.nodes[0][0],.08,e.nodes[0][2]];I(a(n,[0,.3,0]),.75,{rag:1.3});const i=3,c=t.range(0,Math.PI*2);for(let o=0;o<i;o++){const r=c+o/i*Math.PI*2+t.range(-.4,.4),l=t.range(5,9.5),b=t.sign(),f=[n[0]+Math.cos(r)*l+e.side*3,.08,n[2]+Math.sin(r)*l+2.5],S=Math.atan2(n[2]-f[2],n[0]-f[0]),p=Math.hypot(n[0]-f[0],n[2]-f[2]),d=t.range(1.7,2.5),m=d*Math.PI*2,w=M=>{const T=p*(1-.86*M/m);return[f[0]+Math.cos(S+b*M)*T,.08,f[2]+Math.sin(S+b*M)*T]};B(N,n,w(1.5),Be(w(.75),ke(n,w(1.5))).map(M=>M*2),.16,{minPx:1.6,taper:.8});let h=.25,k=0;for(;h<m;){const M=h/m,T=p*(1-.86*M),z=J(.3,.11,M)*t.range(.8,1.2);t()<j&&I(a(w(h),[0,z,0]),z,{rag:.9}),h+=(.5+z*1.6)/Math.max(T,.5),k++}I(a(f,[0,.25,0]),.3,{rag:1})}}u.earth!==!1&&X([0,.03,-14],[84,0,0],[0,0,-78],6,5,{rag:1}),await s.yield();const Ue=Math.round(24*j)+t.int(0,5),t0=[[0,2],[0,2],[2,3],[4,3],[4,3],[0,2],[1,0],[3,6]];for(let e=0;e<Ue;e++){const n=t.chance(.5)?0:1,i=pe[n].side,c=J(22,455,(e+t.range(.1,.9))/Ue),o=ce(n,c),r=i<0&&c<345,l=r?t.range(-1,-.35):t.range(-.3,1.1),b=t.range(6.5,12.5)*(r?.8:1),f=W(a(a([i*Math.cos(l),0,0],v,Math.sin(l)),P,t.range(.15,.8))),S=W(ee(f,a(v,P,t.range(-.5,.5)))),p=[o[0],o[1],o[2],t.range(0,6.28)],d=a(a([0,0,0],P,t.range(.6,2.2)),v,t.range(-1,1)),m={own:p,mode:1},w=(F,Y)=>a(a(a(o,f,b*F),S,Y*J(.85,.5,F)),d,4*F*(1-F)*.5);for(const F of[-1,1])A.push(w(0,F*.3),a(w(.5,F),d,.5),w(1,F),[.2,E(),0,1],p,[2,.25,0]);for(let F=1;F<=3;F++){const Y=F/3.6+t.range(-.03,.03),de=w(Y,-1),oe=w(Y,1);B(A,de,oe,a([0,0,0],f,-.3),.13,{...m,minPx:-1.4}),I(de,.17,m),I(oe,.17,m)}const h=w(1,t.sign()),k=t.pick(t0),M=t.range(1,2.3)*(k[0]===4?1.25:1),T=a(a(a(h,f,t.range(1.5,3.5)),v,t.range(-1.5,2.5)),[i*t.range(0,2),0,0]);B(A,h,T,a(a([0,0,0],v,t.range(-1.5,1.5)),P,t.range(-1,1)),.1,{...m,minPx:1.6});const z=W(a(a(P,le,t.range(-.7,.7)),v,t.range(-.5,.2))),x=W(ee(v,z)),_=ee(z,x),G=t.range(-.6,.6),y=a(x.map(F=>F*Math.cos(G)*M),_,Math.sin(G)*M),V=a(x.map(F=>-F*Math.sin(G)*M),_,Math.cos(G)*M);X(T,y,V,k[0],k[1],{...m,rag:1.1}),I(a(h,f,-.2),.2,m)}await s.yield();const We=t.shuffle([[0,2],[2,3],[1,0],[4,3],[0,2],[3,6],[2,3],[5,2],[4,3]]);for(let e=0;e<We.length;e++){const n=e%2?-1:1,i=n<0?0:1,c=se(52+e*37+t.range(-9,9),40,392),[o,r]=We[e],l=ce(i,c),b=n<0&&c<350,f=[l[0],l[1],l[2],t.range(0,6.28)],S={own:f,mode:1},p=R(c+t.range(2,10),n*(ae(c)+t.range(11,24)),b?t.range(-22,-9):t.range(5,22)),d=t.range(4.2,8.5)*(o===4?1.25:1)*(o===1?1.2:1),m=W(a(a([0,0,0],P,-1),[t.range(-.35,.35),0,0])),w=W(ee(v,m)),h=W(ee(w,m)).map(x=>-x),k=t.range(-.5,.5),M=a(w.map(x=>x*Math.cos(k)*d),h,Math.sin(k)*d),T=a(w.map(x=>-x*Math.sin(k)*d),h,Math.cos(k)*d);X(p,o===3?M.map(x=>x*.72):M,T,o,r,{...S,rag:1.3}),B(N,l,p,a([0,0,0],v,(b?-1:1)*t.range(5,10)),.26,{...S,taper:.45}),I(l,.6,{rag:1.2}),I(p,.55,S);const z=a(a(l,[-n*t.range(4,8),0,0]),v,(b?1:-1)*t.range(3,7));B(A,l,z,a([0,0,0],P,t.range(-1.5,1.5)),.18,{...S,taper:.3}),I(z,t.range(.7,1.15),{...S,rag:1.1,keep:!0});for(let x=0,_=d*.9+1;x<5;x++){const G=J(.5,.2,x/5);I(a(p,[Math.sin(x*1.7)*.3,-_,0]),G,S),_+=1.1+G*2.2}}await s.yield();const n0=16,De=[],Z=.75;for(let e=0;e<n0;e++){const n=(e%2?1:-1)*t.range(3.1,4.1),i=R(0,n,0),c=[i[0],i[1],i[2],(e*5+t.int(0,1))%77+t()],o={own:c,mode:2},r=t.sign(),l=(h,k=0,M=0)=>a(a(a(i,v,h*Z),le,k*Z),P,M*Z);for(let h=0;h<5;h++)B(A,l(h*.16,h===0?0:h%2?.36:-.36),l((h+1)*.16,h===4?0:h%2?-.36:.36),null,.1,{...o,minPx:1.5});const b=t.range(.25,.5)*t.sign(),f=l(3.2,b*.3);B(A,l(.8),f,[b,0,0],.24,{...o,minPx:2});const S=l(3.2+t.range(.1,.5),b*.3+r*t.range(.7,.95));B(A,f,S,a([0,0,0],v,.35),.08,{...o,minPx:1.5}),I(S,.25,{...o,rag:.8,keep:!0});const p=l(t.range(1.7,2.3),b*.5-r*.15,-.12),d=t.range(.6,.8)*Z,m=t.range(-.7,.7);X(p,a([Math.cos(m)*d,0,0],P,Math.sin(m)*d),a([0,0,0],v,d),5,t.chance(.55)?2:3,{...o,rag:1});const w=e%5!==3&&t.chance(.7);if(w){const h=l(4.5,b*.3-r*.5),k=t.range(.7,.95),M=t.range(-.6,.6);B(A,f,h,[-r*.3,0,0],.05,{...o,minPx:1.5}),X(h,a([Math.cos(M)*k,0,0],P,Math.sin(M)*k),a([0,0,0],v,k),4,3,{...o,rag:.6})}De.push({lane:n,phase:c[3],carries:w})}await s.yield();const C=()=>new g.Vector4(0,1,0,0),L={piv:[C(),C(),C(),C(),C()],axs:[C(),C(),C(),C(),C()],cen:[C(),C(),C(),C(),C()],nr:[C(),C(),C(),C(),C()],arm:[C(),C(),C(),C(),C()]},ne=[],ye=t.range(.93,1.07),o0=[{name:"sun",g:1,ri:0,s:300,c:[-70,9],half:39*ye,bow:[-12,-22],cw:[17,19,2.7],amp:.6,per:26,ph:2.78,dipPh:.4},{name:"crescent",g:2,ri:1,s:360,c:[55,16],half:23*ye,bow:[12,20],cw:[-5,-15,2.2],amp:.5,per:22,ph:1.1,dipPh:2.1},{name:"star",g:3,ri:1,s:400,c:[-24,40],half:22*ye,bow:[-6,0],cw:[24,-11,2],amp:.5,per:29,ph:4,dipPh:3.3},{name:"hourglass",g:4,ri:0,s:440,c:[-25,15],half:15*ye,bow:[-9,18],cw:[-1,21,1.7],amp:.25,per:24,ph:5.2,dipPh:5}];for(const e of o0){const n=e.g,i=ce(e.ri,e.s),c=W(a(v,[t.range(-.06,.06),0,0])),o=R((e.cs??e.s)+t.range(-4,4),e.c[0],e.c[1]),r=Be(o,i),l=r[0]*c[0]+r[1]*c[1]+r[2]*c[2],b=Be(r,c.map(y=>y*l)),f=Ye(b),S=W(b);L.piv[n].set(i[0],i[1],i[2],0),L.axs[n].set(c[0],c[1],c[2],0),L.cen[n].set(o[0],o[1],o[2],0),L.arm[n].set(S[0],S[1],S[2],f);const p={group:n},d=W(a(a([0,0,0],P,-1),[t.range(-.15,.15),0,0])),m=W(ee(v,d)),w=W(ee(m,d)).map(y=>-y),h=m.map(y=>y*e.half),k=w.map(y=>y*e.half),M=(y,V)=>a(a(o,m,y*e.half),w,V*e.half);let T=d,z=o;if(e.name==="sun"){X(o,h,k,0,2,{group:n,rag:1.7}),z=M(.42,.12);const y=t.range(.3,.6)*t.sign(),V=W(a(m.map(q=>q*Math.cos(y)),w,Math.sin(y))),F=W(a(m.map(q=>-q*Math.sin(y)),w,Math.cos(y))),Y=W(a(F.map(q=>q*.31),d,.95)),de=e.half*1.13,oe=(q,Xe=1)=>a(a(o,V,Math.cos(q)*de*Xe),Y,Math.sin(q)*de*Xe),He=10,ue=Math.PI/He;for(let q=0;q<He;q++)N.push(oe(q*2*ue),oe(q*2*ue+ue,1/Math.cos(ue)),oe(q*2*ue+2*ue),[.2,E(),8+n,0],$,[2,0,1]);H.push(oe(.5),[4.6,0,0],[0,4.6,0],[1.2,E(),8+n,0],$,[0,3,1]),te.push(oe(.5+Math.PI),[1.5,0,0],[0,1.5,0],[.8,E(),8+n,0],$,[0,0,1]),T=W(ee(V,Y))}else if(e.name==="crescent")X(o,h.map(y=>-y),k,1,0,{group:8+n,rag:1.2}),z=M(.55,0),I(M(-.2,.05),1.6,{group:8+n,rag:1});else if(e.name==="star"){X(o,h,k,4,3,{group:8+n,rag:.8});const y=M(.34,-.5);H.push(y,[3.4,0,0],[0,3.4,0],[1.2,E(),n,0],$,[0,2,1]),B(N,o,y,m.map(V=>V*4),.14,{...p,minPx:1.6})}else X(o,h.map(y=>y*.72),k,3,6,{group:8+n,rag:1.1}),I(M(0,0),.9,{group:n});L.nr[n].set(T[0],T[1],T[2],0),B(N,i,z,a(a([0,0,0],le,e.bow[0]-(i[0]+z[0])*.5+i[0]),v,e.bow[1]),.42,{...p,taper:.45}),I(i,.8,{rag:1.3}),I(z,1.1,{...p,rag:1.1});for(let y=-1;y<=1;y++)B(A,a(a(i,[.8,0,0]),P,y*.42-.35),a(a(i,[-.8,0,0]),P,y*.42+.35),a([0,0,0],v,.7),.14,{minPx:-1.3});const x=a(a(i,le,e.cw[0]-i[0]),v,e.cw[1]);B(N,i,x,a(a([0,0,0],v,e.cw[1]*.55),P,t.range(-2,2)),.3,{...p,taper:.4}),I(x,e.cw[2],{...p,rag:1.2,keep:!0});const _=M(t.range(-.3,.3),e.name==="star"?-.2:-.8),G=t.int(6,9);for(let y=0,V=2;y<G;y++){const F=J(.95,.3,y/G);I(a(_,[Math.sin(y*1.3)*.5,-V,0]),F,{...p,rag:.9}),V+=1.6+F*2.4}ne.push({...e,P:i,K:c,C:o,armL:f,U:h,V:k,fn:d,attach:z})}await s.yield();{const e=t.fork?t.fork("residents"):t,n=(o,r,l,b)=>{const f=R(o-.6*(1-r*r/(ae(o)*ae(o))),r,.15),S=[f[0],f[1],f[2],e.range(0,20)+100*Math.round(l*10-10)],p={own:S,mode:3},d=e.sign(),m=(x,_=0,G=0)=>a(a(a(f,v,x*l),le,_*l),P,G*l);for(let x=0;x<5;x++)B(A,m(x*.16,x===0?0:x%2?.4:-.4),m((x+1)*.16,x===4?0:x%2?-.4:.4),null,.13*l,{...p,minPx:1.8});const w=e.range(.3,.55)*e.sign(),h=m(3.2,w*.3);B(A,m(.8),h,[w*l,0,0],.3*l,{...p,minPx:2.4});const k=m(3.2+e.range(.1,.5),w*.3+d*e.range(.8,1.05));B(A,h,k,a([0,0,0],v,.35*l),.1*l,{...p,minPx:1.6}),I(k,.36*l,{...p,rag:.8,keep:!0});const M=m(e.range(1.7,2.2),w*.5-d*.2,-.12),T=e.range(.7,.9)*l,z=e.range(-.5,.5);if(X(M,a([Math.cos(z)*T,0,0],P,Math.sin(z)*T),a([0,0,0],v,T),5,e.chance(.55)?2:3,{...p,rag:1}),b){const x=m(4.7,w*.3-d*.6),_=e.range(.85,1.1)*l,G=e.range(-.6,.6);B(A,h,x,[-d*.3*l,0,0],.07*l,{...p,minPx:1.6}),X(x,a([Math.cos(G)*_,0,0],P,Math.sin(G)*_),a([0,0,0],v,_),4,3,{...p,rag:.6})}};for(const[o,r]of[[18,-2.2],[30,2.6],[48,-1.4],[66,2]])n(o,r,Z,o!==30);for(let o=96,r=0;o<=276;o+=12,r++)n(o,r%2?e.range(-.8,1.2):-e.range(2.4,4),Z,r%3!==2);for(let o=294,r=0;o<=354;o+=18,r++)n(o,e.range(4.6,6),Z,!1);for(let o=372,r=0;o<=432;o+=12,r++)n(o,(r%2?1:-1)*e.range(5.6,6.4),Z,r%2===0);n(444,-5.7,Z,!0),n(450,5.5,Z,!1),n(462,-6.6,Z,!0);const i=[[407,19,13,2,3,3.6],[413,-20,12,0,2,3.4],[421,24,18,1,0,4.2],[456,-22,15,4,3,4.6],[459,23,12,0,2,3],[465,-28,9,2,3,3.4],[469,29,15,1,0,4.2],[477,17,23,0,2,2.8],[479,-15,25,2,3,3]],c=s.core.makeRng(s.core.hashSeed("long-ladder-crown:"+s.seed));for(const[o,r,l,b,f,S]of i){if(o>474)continue;const p=r<0?-1:1,d=ce(p<0?0:1,Math.min(o-6,476)),m=[d[0],d[1],d[2],c.range(0,6.28)],w={own:m,mode:1},h=R(o+c.range(-1.5,1.5),r+c.range(-1.5,1.5),l+c.range(-1.5,1.5)),k=S*c.range(.9,1.15),M=W(a(a([0,0,0],P,-1),[c.range(-.2,.2),0,0])),T=W(ee(v,M)),z=W(ee(T,M)).map(V=>-V),x=c.range(-.5,.5),_=a(T.map(V=>V*Math.cos(x)*k),z,Math.sin(x)*k),G=a(T.map(V=>-V*Math.sin(x)*k),z,Math.cos(x)*k);X(h,b===3?_.map(V=>V*.72):_,G,b,f,{...w,rag:1.2}),B(N,d,h,a([0,0,0],v,c.range(3,6)),.24,{...w,taper:.45,minPx:2.4}),I(d,.55,{rag:1.2}),I(h,.5,w);const y=a(a(d,[-p*c.range(2.5,4.5),0,0]),v,-c.range(2.5,5));B(A,d,y,a([0,0,0],P,c.range(-1,1)),.17,{...w,taper:.3,minPx:2}),I(y,c.range(.6,.95),{...w,rag:1.1,keep:!0});for(let V=0,F=k*.9+.8;V<4;V++){const Y=J(.42,.18,V/4);I(a(h,[Math.sin(V*1.7)*.25,-F,0]),Y,w),F+=.9+Y*2.2}}}await s.yield();const Ee=u.noiseTex||await Je(t.fork?t.fork("noise"):t,s),a0=!u.noiseTex,r0=O.slice(0,7).map(e=>{const n=new g.Color(e);return new g.Vector3(n.r,n.g,n.b)}),K={uTime:{value:0},uHop:{value:0},uRes:{value:new g.Vector2(800,450)},uFlex:{value:new g.Vector2},uA:{value:new g.Vector3(...P)},uN:{value:new g.Vector3(...v)},uNoise:{value:Ee},uPiv:{value:L.piv},uAxs:{value:L.axs},uCen:{value:L.cen},uNr:{value:L.nr},uArm:{value:L.arm},uCol:{value:r0},uGain:{value:U}},Ce=new g.Group;Ce.name="long-ladder";const Qe=ze(6),Ge=ze(24),Ne=$e(),he=(e,n,i,c)=>{const o=new g.Mesh(e,n);return o.renderOrder=i,o.frustumCulled=!1,o.name=c,Ce.add(o),o},Le=xe(Ne,H);he(Le,ge(Se,Ie,{...K,uInk:{value:1},uUseCol:{value:0}},"mul"),3,"knock-out"),he(Le,ge(Se,Ie,{...K,uInk:{value:1},uUseCol:{value:1}},"stain"),4,"stain"),await s.yield(),he(xe(Ne,te),ge(Se,Ie,{...K,uInk:{value:u.ink??.975},uUseCol:{value:0}},"mul"),5,"ink-dots"),he(xe(Qe,A),ge(Re,Te,{...K,uInk:{value:u.ink??.975},uWave:{value:new g.Vector2(.8,1.7)}},"mul"),5,"ink-short"),he(xe(Ge,N),ge(Re,Te,{...K,uInk:{value:u.ink??.975},uWave:{value:new g.Vector2(2.3,5.1)}},"mul"),5,"ink-long"),await s.yield();let Ve=-1;const Fe=new g.Vector2,ve=Math.PI*2,re={ang:[0,0,0,0,0],dip:[0,0,0,0,0]},_e=e=>{for(const n of ne)re.ang[n.g]=n.amp*Math.sin(ve*e/n.per+n.ph),re.dip[n.g]=3*Math.sin(ve*e/(n.per*.62)+n.dipPh),L.piv[n.g].w=re.ang[n.g],L.axs[n.g].w=re.dip[n.g];L.cen[1].w=.2*e,L.cen[2].w=.38*Math.sin(ve*e/17+1),L.cen[3].w=.09*e,L.cen[4].w=.15*e+.4},je=(e,n)=>n.set(4.2*Math.sin(.23*e)+1.6*Math.sin(.41*e+1),1.8*Math.sin(.19*e+2));_e(0);const qe=new g.Vector3,Me=new g.Vector3,Pe=new g.Quaternion,Ke=(e,n,i,c,o)=>{const r=ne[e];Me.set(...r.K),Pe.setFromAxisAngle(Me,n),qe.set(r.C[0]-r.P[0],r.C[1]-r.P[1],r.C[2]-r.P[2]).applyQuaternion(Pe),o.set(r.P[0],r.P[1],r.P[2]).add(qe).addScaledVector(K.uN.value,i);const l=Math.max(o.dot(K.uA.value),0)/me;return o.x+=c.x*l*l,o.addScaledVector(K.uN.value,c.y*l*l),o},s0=(e,n=new g.Vector3)=>Ke(e,re.ang[ne[e].g],re.dip[ne[e].g],K.uFlex.value,n),i0=new g.Vector2,c0=(e,n,i,c=new g.Vector3)=>{const o=ne[e],r=se(n,0,1)*D;return Ke(e,o.amp*Math.sin(ve*r/o.per+o.ph),3*Math.sin(ve*r/(o.per*.62)+o.dipPh),je(i,i0),c)},l0=(e,n=new g.Vector3)=>{const i=ne[e];return Me.set(...i.K),Pe.setFromAxisAngle(Me,re.ang[i.g]),n.set(i.fn[0],i.fn[1],i.fn[2]).applyQuaternion(Pe)},Q=e=>new g.Vector3(e[0],e[1],e[2]),u0={axis:Q(P),normal:Q(v),at:(e,n=0,i=0)=>Q(R(e,n,i)),foot:Q([0,0,0]),top:Q(R(me,0,0)),portalSeat:{position:Q(R(474,0,5)),facing:Q(P),normal:Q(P).negate(),up:Q(v),radius:7},flyThrough:[R(40,-ae(40)-12,4),R(120,-ae(120)-12,4),R(200,-ae(200)-12,4),R(248,-ae(248)-11,4),R(292,-11,4.5),R(326,-2,5),R(360,0,5),R(420,0,5),R(474,0,5),R(505,0,5)].map(Q),viewpoints:{entry:Q([-150,14,300]),alongside:Q(R(150,-20,4)),mobile:Q(R(285,-14,4)),axisRun:Q(R(340,0,5))},signs:ne.map(e=>({name:e.name,center:Q(e.C),radius:e.half*.92,pivot:Q(e.P),hold:Q(e.attach)})),tenderLanes:De.map(e=>e.lane)};return{object:Ce,radius:200,height:262,center:new g.Vector3(0,135,-215),anchors:u0,ground:!1,groundY:0,counts:{short:A.count,long:N.count,inkQuads:te.count,blots:H.count,triangles:A.count*16+N.count*52+(te.count+H.count*2)*2},setProgress(e){Ve=e==null?-1:se(e,0,1)},signPose:s0,signPoseAt:c0,signNormal:l0,update(e,n,i){K.uTime.value=n%3600,K.uHop.value=n*.55%77,je(n,K.uFlex.value),_e(Ve>=0?Ve*D:n),s.renderer&&s.renderer.getDrawingBufferSize&&(s.renderer.getDrawingBufferSize(Fe),Fe.y>0&&K.uRes.value.copy(Fe))},dispose(){a0&&Ee.dispose(),Qe.dispose(),Ge.dispose(),Ne.dispose()}}}const d0={collector:we,instanced:xe,passMaterial:ge,strokeGeometry:ze,quadGeometry:$e,makeNoiseTex:Je,strokeVert:s=>s+Re.slice(Ae.length),quadVert:s=>s+Se.slice(Ae.length),STROKE_FRAG:Te,QUAD_FRAG:Ie};export{v0 as buildHero,d0 as inkKit};
