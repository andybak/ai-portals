import*as a from"three";import{clamp as ee,lerp as Le,smoothstep as je}from"../kit/core.js";const Ie=["#E2F8E6","#F7FFF4","#A6E0BC","#1FA862","#12402E","#2A84E0","#D9A93A"],S=Math.PI*2,me=10,f=65,D=72,l=(s=0,c=0,t=0)=>new a.Vector3(s,c,t),de=`
  uniform vec3 uColPos[${me}];
  uniform vec4 uColQuat[${me}];
  uniform float uTime;
  uniform float uResY;
  uniform vec3 uFocus;
  vec3 qrot(vec4 q, vec3 v) { return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v); }
  float focusF(float d) { return smoothstep(uFocus.x, uFocus.y, d) * uFocus.z; }
  float pixelSize(float viewZ) { return max(-viewZ, 0.0) * 2.0 / (projectionMatrix[1][1] * uResY); }
`,oe=`
  float fogF() {
    #ifdef USE_FOG
      #ifdef FOG_EXP2
        return 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
      #else
        return smoothstep(fogNear, fogFar, vFogDepth);
      #endif
    #else
      return 0.0;
    #endif
  }
`,te=`
  uniform vec3 uField;
  uniform vec3 uRim;
  uniform vec3 uTint;
  uniform vec3 uLine;
  vec4 glassOut(vec3 T, vec3 add) {
    T = clamp(T, 0.0, 1.0);
    float a = min(T.r, min(T.g, T.b));
    return vec4((T - a) * uField + add, a);
  }
`,Ae=`
  attribute vec3 iPos;
  attribute vec4 iData;       // colony, radius, seed, kind (0 bead, 1 gonidium, 2 envelope, 3 sheath disc)
  uniform vec3 uLampLocal;
  varying vec2 vQ;
  varying vec3 vN;
  varying vec4 vD;            // seed, kind, focus, lamp glow
  varying float vFace;
  #include <fog_pars_vertex>
  ${de}
  void main() {
    int ci = int(iData.x + 0.5);
    float kind = iData.w;
    vec3 lp = qrot(uColQuat[ci], iPos);
    vec3 nl = normalize(lp + vec3(1e-4, 2e-4, 3e-4));
    float sd = iData.z;
    vec3 wp = uColPos[ci] + lp;
    if (kind < 1.5) wp += iData.y * 0.07 * vec3(sin(uTime * 3.1 + sd * 50.0), sin(uTime * 2.6 + sd * 91.0), sin(uTime * 3.7 + sd * 13.0));
    vec4 mvPosition = modelViewMatrix * vec4(wp, 1.0);
    float sc = length(modelViewMatrix[0].xyz);
    vec3 nv = normalize(mat3(modelViewMatrix) * nl);
    vec3 ray = normalize(mvPosition.xyz - vec3(0.0, 0.0, 1e-4));
    vFace = 1.0;
    vQ = position.xy * 1.06;
    if (kind > 2.5) {
      vec3 t1 = normalize(cross(nl, vec3(0.31, 0.55, 0.77)) + vec3(1e-5, 0.0, 0.0));
      vec3 t2 = cross(nl, t1);
      mvPosition = modelViewMatrix * vec4(wp + (t1 * position.x + t2 * position.y) * iData.y, 1.0);
      vFace = abs(dot(nv, ray));
      vQ = position.xy;
    } else {
      mvPosition.xy += position.xy * iData.y * sc * 1.06;
    }
    vN = nv;
    vec3 lampV = normalize(mat3(modelViewMatrix) * uLampLocal);
    float glow = max(dot(ray, lampV), 0.0);
    vD = vec4(sd, kind, focusF(length(mvPosition.xyz)), glow * glow * glow);
    gl_Position = projectionMatrix * mvPosition;
    #ifdef OPAQUE_PASS
      if (kind > 1.5) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    #endif
    #include <fog_vertex>
  }
`,Ue=`
  uniform vec3 uEmerald;
  uniform vec3 uEmeraldHi;
  uniform vec3 uEye;
  uniform vec3 uHaze;
  varying vec2 vQ;
  varying vec3 vN;
  varying vec4 vD;
  varying float vFace;
  #include <fog_pars_fragment>
  void main() {
    vec2 q = vQ;
    float r2 = dot(q, q);
    if (r2 > 1.0) discard;
    float kind = vD.y;
    vec3 n = normalize(vN + vec3(0.0, 0.0, 1e-4));
    // chord of the view ray through the chloroplast: a cup (a ball with a smaller ball scooped out
    // of its outer side), so it reads as a ring from outside, a disc from inside, a crescent side-on
    float ri = kind > 0.5 ? 0.93 : 0.86;
    float hi2 = ri * ri - r2;
    float thick = 0.0;
    if (hi2 > 0.0) {
      float hi = sqrt(hi2);
      thick = 2.0 * hi;
      if (kind < 0.5) {
        vec3 c = n * 0.44;
        vec2 hq = q - c.xy;
        float hs2 = 0.62 * 0.62 - dot(hq, hq);
        if (hs2 > 0.0) { float hs = sqrt(hs2); thick -= max(min(hi, c.z + hs) - max(-hi, c.z - hs), 0.0); }
      }
    }
    float dens = 1.0 - exp(-max(thick, 0.0) * 2.4);
    float eye = 0.0;
    if (kind < 0.5) {
      vec3 e = normalize(n + vec3(cos(vD.x * 40.0), sin(vD.x * 40.0), 0.3) * 0.55);
      eye = 1.0 - smoothstep(0.13, 0.2, length(q - e.xy * 0.74));
    }
    if (dens < 0.25 && eye < 0.5) discard;
    vec3 col = mix(uEmeraldHi, uEmerald, smoothstep(0.25, 0.85, dens));
    float core = 1.0 - smoothstep(0.0, 0.5, sqrt(r2));
    col *= 1.0 + 0.3 * core;                                         // brightened core
    col *= 1.0 + vD.w * 0.8;                                          // stained glass toward the lamp
    col = mix(col, uEye * (1.0 + vD.w), eye);
    col = mix(col, uHaze, vD.z);
    gl_FragColor = vec4(col, 1.0);
    #include <fog_fragment>
  }
`,Ye=`
  varying vec2 vQ;
  varying vec3 vN;
  varying vec4 vD;
  varying float vFace;
  #include <fog_pars_fragment>
  ${oe}
  ${te}
  void main() {
    float kind = vD.y;
    float r = length(vQ);
    float fw = max(fwidth(r), 1e-4);
    if (r > 1.0 + fw) discard;
    float f = vD.z;
    float keep = (1.0 - smoothstep(1.0 - fw, 1.0 + fw, r)) * (1.0 - f) * (1.0 - fogF());
    vec3 T = vec3(1.0);
    float line = 0.0;
    if (kind < 2.5) {
      bool env = kind > 1.5;
      float wp = 1.6 * fw;                                   // rim never thinner than ~1.6 px ...
      float small = smoothstep(0.1, 0.28, wp);               // ... but a far bead keeps its green heart
      float w = max(env ? 0.02 : 0.085, min(wp, 0.3)) * (1.0 + 1.5 * f);
      float mu = sqrt(max(1.0 - r * r, 0.0));
      float rim = smoothstep(1.0 - w, 1.0 - 0.35 * w, r);
      line = smoothstep(1.0 - 2.5 * w, 1.0 - 1.9 * w, r) * (1.0 - smoothstep(1.0 - 1.5 * w, 1.0 - w, r));
      T = vec3(1.0) - (vec3(1.0) - uTint) * mu * (env ? 1.15 : 1.0);
      T = mix(T, uRim, rim * (env ? 0.6 : 0.85) * (1.0 - 0.45 * small));
      line *= (env ? 0.6 : 1.0) * (1.0 - small);
    } else {
      float w = max(0.045, 1.6 * fw);
      float rim = smoothstep(1.0 - w, 1.0 - 0.4 * w, r);
      float face = smoothstep(0.06, 0.4, vFace);
      T = mix(vec3(1.0) - (vec3(1.0) - uTint) * 0.25, uRim, rim * 0.36);
      T = mix(vec3(1.0), T, face);
    }
    T = mix(vec3(1.0), T, keep);
    gl_FragColor = glassOut(T, uLine * line * keep);
  }
`,We=`
  attribute vec3 iA;
  attribute vec3 iB;
  attribute vec3 iT;          // colony, half width, seed
  varying vec3 vL;            // across, coverage, focus
  #include <fog_pars_vertex>
  ${de}
  void main() {
    int ci = int(iT.x + 0.5);
    vec3 a = (modelViewMatrix * vec4(uColPos[ci] + qrot(uColQuat[ci], iA), 1.0)).xyz;
    vec3 b = (modelViewMatrix * vec4(uColPos[ci] + qrot(uColQuat[ci], iB), 1.0)).xyz;
    vec4 mvPosition = vec4(mix(a, b, position.x), 1.0);
    vec3 side = normalize(cross(b - a, mvPosition.xyz) + vec3(1e-6, 2e-6, 0.0));
    float sc = length(modelViewMatrix[0].xyz);
    float w = iT.y * sc;
    float hw = max(w, 0.62 * pixelSize(mvPosition.z));
    mvPosition.xyz += side * position.y * hw;
    vL = vec3(position.y, w / max(hw, 1e-5), focusF(length(mvPosition.xyz)));
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`,Ze=`
  varying vec3 vL;
  #include <fog_pars_fragment>
  ${oe}
  ${te}
  void main() {
    float prof = 1.0 - smoothstep(0.35, 1.0, abs(vL.x));
    float dark = 0.74 * prof * pow(vL.y, 0.8) * (1.0 - vL.z) * (1.0 - fogF());
    gl_FragColor = glassOut(mix(vec3(1.0), uRim, dark), vec3(0.0));
  }
`,Je=`
  attribute vec3 iPos;
  attribute vec4 iF;          // seed, which (+-1), length, bead radius
  varying vec4 vF;            // across, coverage, s, phase
  varying float vFoc;
  #include <fog_pars_vertex>
  ${de}
  vec3 whip(float s, vec3 base, vec3 n, vec3 t1, vec3 t2, float ph0) {
    float L = iF.z;
    float ph = ph0 - s * 3.4;
    float env = pow(max(s, 0.0), 1.25);
    return base + n * (L * s * (1.0 - 0.18 * s))
      + t2 * (sin(ph) * 0.30 * env * L + 0.24 * L * s * s)
      + t1 * (iF.y * 0.24 * L * s + cos(ph + iF.x * 6.0) * 0.11 * env * L);
  }
  void main() {
    vec3 n = normalize(iPos);
    vec3 back = vec3(0.0, 0.0, -1.0);
    vec3 t2 = normalize(back - n * dot(back, n) + vec3(1e-5, 0.0, 0.0));
    vec3 t1 = cross(n, t2);
    float s = position.x;
    float ph0 = uTime * 6.6 - iPos.z * 0.33 + 2.0 * atan(iPos.y, iPos.x + 1e-4) + iF.x * 0.9;
    vec3 base = iPos + n * iF.w * 0.8 + t1 * iF.y * iF.w * 0.35;
    vec3 p0 = whip(s, base, n, t1, t2, ph0);
    vec3 p1 = whip(s + 0.03, base, n, t1, t2, ph0);
    vec4 mvPosition = modelViewMatrix * vec4(uColPos[0] + qrot(uColQuat[0], p0), 1.0);
    vec3 m1 = (modelViewMatrix * vec4(uColPos[0] + qrot(uColQuat[0], p1), 1.0)).xyz;
    vec3 side = normalize(cross(m1 - mvPosition.xyz, mvPosition.xyz) + vec3(1e-6, 2e-6, 0.0));
    float sc = length(modelViewMatrix[0].xyz);
    float w = mix(0.12, 0.04, s) * sc;
    float hw = max(w, 0.6 * pixelSize(mvPosition.z));
    mvPosition.xyz += side * position.y * hw;
    vF = vec4(position.y, pow(w / max(hw, 1e-5), 0.55), s, ph0 - s * 3.4);
    vFoc = focusF(length(mvPosition.xyz));
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`,Xe=`
  varying vec4 vF;
  varying float vFoc;
  #include <fog_pars_fragment>
  ${oe}
  ${te}
  void main() {
    float prof = 1.0 - smoothstep(0.3, 1.0, abs(vF.x));
    float keep = prof * vF.y * (1.0 - vFoc) * (1.0 - fogF());
    float dark = 0.8 * keep * (1.0 - 0.4 * vF.z);
    float g = max(sin(vF.w), 0.0);
    g = g * g; g = g * g; g = g * g;
    float glint = g * smoothstep(0.15, 0.5, vF.z) * (1.0 - smoothstep(0.85, 1.0, vF.z));
    gl_FragColor = glassOut(mix(vec3(1.0), uRim, dark), uLine * glint * keep * 1.3);
  }
`,Ke=`
  uniform vec4 uTear;         // lobe centre xy, main radius, lobe radius
  uniform vec3 uRag;          // ragged edge phases, mouth radius
  float openDist(vec3 p) {    // metres to the edge of the nearest opening (< 0 inside it)
    if (abs(p.z) < 40.0) return 99.0;
    float l = length(p.xy);
    if (p.z > 0.0) return l - uRag.z;
    float th = atan(p.y, p.x + 1e-4);
    float rag = 1.0 + 0.10 * sin(3.0 * th + uRag.x) + 0.06 * sin(7.0 * th + uRag.y);
    return min(l - uTear.z * rag, length(p.xy - uTear.xy) - uTear.w);
  }
`,eo=`
  varying vec3 vP;
  varying vec3 vNv;
  varying vec3 vV;
  uniform vec3 uFocus;
  varying float vFoc;
  #include <fog_pars_vertex>
  void main() {
    vP = position;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNv = normalMatrix * normal;
    vV = mvPosition.xyz;
    vFoc = smoothstep(uFocus.x, uFocus.y, length(mvPosition.xyz)) * uFocus.z;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`,oo=`
  varying vec3 vP;
  varying vec3 vNv;
  varying vec3 vV;
  varying float vFoc;
  #include <fog_pars_fragment>
  ${oe}
  ${te}
  ${Ke}
  void main() {
    float d = openDist(vP);
    if (d < 0.0) discard;
    float mu = abs(dot(normalize(vNv + vec3(0.0, 0.0, 1e-5)), normalize(vV - vec3(0.0, 0.0, 1e-4))));
    float keep = (1.0 - vFoc) * (1.0 - fogF());
    float rim = 1.0 - smoothstep(0.0, 0.34, mu);
    float lip = 1.0 - smoothstep(0.0, 1.7, d);
    float line = smoothstep(0.15, 0.3, d) * (1.0 - smoothstep(0.45, 0.7, d));
    vec3 T = vec3(1.0) - (vec3(1.0) - uTint) * min(0.3 / max(mu, 0.15), 1.0) * 0.6;
    T = mix(T, uRim, max(rim * 0.5, lip * 0.55));
    T = mix(vec3(1.0), T, keep);
    gl_FragColor = glassOut(T, uLine * line * keep * 0.8);
  }
`,to=`
  varying vec3 vDir;
  void main() {
    vDir = normalize(mat3(modelMatrix) * position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,io=`
  uniform vec3 uField;
  uniform vec3 uLampCol;
  uniform vec3 uFar;
  uniform vec3 uLampWorld;
  varying vec3 vDir;
  void main() {
    float l = dot(normalize(vDir), uLampWorld);
    vec3 c = mix(uField, uLampCol, 0.7 * smoothstep(0.6, 0.995, l));
    c = mix(c, uFar, 0.22 * smoothstep(0.3, -1.0, l));
    gl_FragColor = vec4(c, 1.0);
  }
`;function ke(s,c,t,h,g=.1){const u=Math.PI*(3-Math.sqrt(5)),G=Math.sqrt(4*Math.PI*t*t/c*2/Math.sqrt(3)),L=s()*S,z=g*G/t,y=[];for(let R=0;R<c;R++){let M=1-2*(R+.5)/c;const V=Math.sqrt(Math.max(0,1-M*M)),F=R*u+L;let x=V*Math.cos(F)+(s()-.5)*2*z,P=V*Math.sin(F)+(s()-.5)*2*z;M+=(s()-.5)*2*z*V;const k=Math.hypot(x,P,M)||1;x=x/k*t,P=P/k*t,M=M/k*t,!(h&&h(x,P,M))&&y.push(x,P,M)}return{pts:y,n:y.length/3,spacing:G}}function no(s){const{pts:c,n:t,spacing:h}=s,g=h*1.32,u=g*g,G=g*1.6,L=new Uint8Array(t),z=[];for(let y=0;y<t;y++){const R=c[y*3],M=c[y*3+1],V=c[y*3+2];for(let F=y+1;F<t;F++){const x=V-c[F*3+2];if(x>G)break;const P=R-c[F*3],k=M-c[F*3+1];P*P+k*k+x*x<u&&L[y]<6&&L[F]<6&&(L[y]++,L[F]++,z.push(y,F))}}return{pairs:z,deg:L}}function ao(){const s=new a.InstancedBufferGeometry;return s.setAttribute("position",new a.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),s.setIndex([0,1,2,0,2,3]),s}function Ee(s){const c=new a.InstancedBufferGeometry,t=[],h=[];for(let g=0;g<=s;g++)t.push(g/s,-1,0,g/s,1,0);for(let g=0;g<s;g++){const u=g*2;h.push(u,u+1,u+3,u,u+3,u+2)}return c.setAttribute("position",new a.Float32BufferAttribute(t,3)),c.setIndex(h),c}const Q=(s,c,t,h)=>s.setAttribute(c,new a.InstancedBufferAttribute(new Float32Array(t),h));async function lo(s,c={}){const t=s.rng.fork?s.rng.fork("volvox"):s.rng,h=(c.palette&&c.palette.length>=7?c.palette:Ie).map(e=>new a.Color(e)),g=!!c.backdrop,u=l(0,D,0),G=h[0].clone(),L=h[1].clone(),z=h[2].clone(),y=h[3].clone().offsetHSL(t.range(-.035,.03),0,t.range(-.02,.03)),R=y.clone().lerp(new a.Color(.3,.95,.25),.42),M=h[4].clone().lerp(G,.27),V=new a.Color(1-.17*(1-z.r),1-.17*(1-z.g),1-.17*(1-z.b)),F=h[6].clone().lerp(new a.Color(1,.3,.03),t.range(.45,.7)).multiplyScalar(1.15),x=l(...c.lampDir||[-.45,-.75,-.5]).normalize(),P=10,k=t.range(-1.2,.15),fe=15.5,w={cx:Math.cos(k)*fe,cy:Math.sin(k)*fe,r1:10.5,r2:8.6,pa:t()*S,pb:t()*S},pe=(e,o,i)=>{if(Math.abs(i)<40)return 99;const r=Math.hypot(e,o);if(i>0)return r-P;const n=Math.atan2(o,e+1e-4),v=1+.1*Math.sin(3*n+w.pa)+.06*Math.sin(7*n+w.pb);return Math.min(r-w.r1*v,Math.hypot(e-w.cx,o-w.cy)-w.r2)},he=[],ie=[],ge=[],ye=[],ne=[],xe=[],ae=[],B=(e,o,i,r,n,v)=>{he.push(o,i,r),ie.push(e,n,t(),v)},we=(e,o,i,r,n,v,m,d)=>{ge.push(o,i,r),ye.push(n,v,m),ne.push(e,d,t())},Fe=(e,o,i,r)=>{const{pairs:n,deg:v}=no(o),m=o.pts;for(let d=0;d<n.length;d+=2){const p=n[d]*3,b=n[d+1]*3,A=m[b]-m[p],T=m[b+1]-m[p+1],$=m[b+2]-m[p+2],He=Math.hypot(A,T,$)||1,H=Math.min(.35,i*.75/He);we(e,m[p]+A*H,m[p+1]+T*H,m[p+2]+$*H,m[b]-A*H,m[b+1]-T*H,m[b+2]-$*H,r)}return v},Ce=Math.round(ee(c.beads??t.int(1800,2200),600,2600)),_=ke(t,Ce,f,(e,o,i)=>pe(e,o,i)<1,.1),Se=t.range(4.8,6.4),be=t.range(.95,1.06),Re=new Float32Array(_.n);for(let e=0;e<_.n;e++){const o=_.pts[e*3],i=_.pts[e*3+1],r=_.pts[e*3+2],n=be*t.range(.86,1.12)*(1+.1*je(20,-60,r));Re[e]=n,B(0,o,i,r,n,0),B(0,o,i,r,_.spacing*t.range(.5,.55),3);for(const v of[-1,1])xe.push(o,i,r),ae.push(t(),v,Se*t.range(.82,1.18),n)}const qe=Fe(0,_,be,.075);for(let e=0;e<_.n;e++){const o=_.pts[e*3],i=_.pts[e*3+1],r=_.pts[e*3+2];if(r>0||qe[e]>4||pe(o,i,r)>6)continue;const n=t.int(1,2);for(let v=0;v<n;v++){const m=Math.atan2(-i,-o)+t.range(-.9,.9),d=t.range(1.6,4.2),p=t.range(-.25,.45),b=o+Math.cos(m)*d-o/f*p*d,A=i+Math.sin(m)*d-i/f*p*d,T=r-r/f*p*d;we(0,o,i,r,b,A,T,.06)}}await s.yield();const Ge=9,j=e=>l(-Ge*(1-e/f*(e/f)),0,e),ze=[];for(let e=0;e<=64;e++)ze.push(j(Le(f,-f,e/64)));const Ve=e=>{let o=1e9;for(const i of ze)o=Math.min(o,i.distanceTo(e));return o},Me=[15,12.5,11,9.5,8.5,7.5,7].map((e,o)=>o?e*t.range(.92,1.08):t.range(14,15)),N=[],re=l(w.cx,w.cy,-f+9),se=7;for(let e=0;e<Me.length;e++){let o=Me[e],i=null;for(let r=0;r<600&&!i;r++){r&&r%150===0&&(o*=.9);let n;if(e===0){const v=t.range(-22,8),m=t.range(-1.9,.4);n=j(v).add(l(Math.cos(m),Math.sin(m),0).multiplyScalar(o+9.2))}else{const v=t.range(-1,1),m=t()*S,d=Math.sqrt(1-v*v),p=(f-4-o)*Math.cbrt(t());if(n=l(d*Math.cos(m)*p,d*Math.sin(m)*p,v*p),Ve(n)<o+9.6)continue}n.length()+o>f-4||n.distanceTo(re)<o+se+3||N.some(v=>v.pos.distanceTo(n)<v.r+o+3)||(i=n)}i&&N.push({pos:i,r:o})}N.push({pos:re.clone(),r:se,born:!0});const Pe=t.sign();N.forEach((e,o)=>{const i=e.born?8:o+1;e.slot=i;const r=Math.round(ee(150+e.r*18,200,420)),n=ke(t,r,e.r,null,.12),v=n.spacing*.28;for(let d=0;d<n.n;d++)B(i,n.pts[d*3],n.pts[d*3+1],n.pts[d*3+2],v*t.range(.88,1.12),0);Fe(i,n,v,Math.max(.028,n.spacing*.014)),B(i,0,0,0,e.r+v*1.7,2);const m=e.r>9?t.int(5,9):t.int(2,4);for(let d=0;d<m;d++){const p=t.range(-1,1),b=t()*S,A=Math.sqrt(1-p*p),T=e.r*.66*Math.cbrt(t()),$=e.r*t.range(.06,.1);B(i,A*Math.cos(b)*T,A*Math.sin(b)*T,p*T,$,1),B(i,A*Math.cos(b)*T,A*Math.sin(b)*T,p*T,$*1.35,2)}e.axis=l(t.range(-.5,.5),t.range(-.5,.5),1).normalize(),e.rate=-Pe*t.range(.14,.3)*(11/e.r),e.q0=new a.Quaternion().setFromUnitVectors(l(0,0,1),l(t.gauss(),t.gauss(),t.gauss()).normalize()),e.ph=[t()*S,t()*S,t()*S]}),await s.yield();const le=[],ce=[];for(let e=0;e<me;e++)le.push(u.clone()),ce.push(new a.Vector4(0,0,0,1));const E={uColPos:{value:le},uColQuat:{value:ce},uTime:{value:0},uResY:{value:1080},uFocus:{value:l(120,520,.55)},uLampLocal:{value:x.clone()},uField:{value:G},uRim:{value:M},uTint:{value:V},uLine:{value:L.clone().multiplyScalar(.6)},uEmerald:{value:y},uEmeraldHi:{value:R},uEye:{value:F},uHaze:{value:z},uTear:{value:new a.Vector4(w.cx,w.cy,w.r1,w.r2)},uRag:{value:l(w.pa,w.pb,P)}},I=(e,o,i,r={})=>new a.ShaderMaterial({uniforms:{...a.UniformsLib.fog,...E},vertexShader:e,fragmentShader:o,fog:!0,...i?{transparent:!0,depthWrite:!1,blending:a.CustomBlending,blendEquation:a.AddEquation,blendSrc:a.OneFactor,blendDst:a.SrcAlphaFactor,blendSrcAlpha:a.ZeroFactor,blendDstAlpha:a.OneFactor}:{},...r}),Oe=new a.Sphere(u.clone(),96),O=new a.Group;O.name="pond-drop-volvox";const W=(e,o,i,r)=>{r!==void 0&&(e.instanceCount=r),e.boundingSphere=Oe;const n=new a.Mesh(e,o);return n.renderOrder=i,O.add(n),n},Z=ao();Q(Z,"iPos",he,3),Q(Z,"iData",ie,4);const Te=ie.length/4;W(Z,I(Ae,Ue,!1,{defines:{OPAQUE_PASS:1}}),0,Te);const Qe=new a.SphereGeometry(f+1.15,72,40),J=new a.Mesh(Qe,I(eo,oo,!0,{side:a.DoubleSide}));J.position.copy(u),J.renderOrder=1,O.add(J);const X=Ee(1);Q(X,"iA",ge,3),Q(X,"iB",ye,3),Q(X,"iT",ne,3),W(X,I(We,Ze,!0,{side:a.DoubleSide}),2,ne.length/3);const ue=Ee(8);Q(ue,"iPos",xe,3),Q(ue,"iF",ae,4),W(ue,I(Je,Xe,!0,{side:a.DoubleSide}),3,ae.length/4),W(Z,I(Ae,Ye,!0),4,Te),await s.yield();let q=null;g&&(q=new a.Mesh(new a.SphereGeometry(2400,32,16),new a.ShaderMaterial({side:a.BackSide,depthWrite:!1,depthTest:!1,fog:!1,vertexShader:to,fragmentShader:io,uniforms:{uField:E.uField,uLampCol:{value:L},uFar:{value:z},uLampWorld:{value:x.clone()}}})),q.renderOrder=-.5,q.frustumCulled=!1,O.add(q));const Be=c.rollPeriod??24;let K=ee(c.progress??.45,0,1);const U=new a.Quaternion,ve=new a.Quaternion,C=l(),Ne=l(0,0,1),$e=new a.Vector2,_e=(e,o,i)=>{le[e].copy(o),ce[e].set(i.x,i.y,i.z,i.w)},De=e=>{U.setFromAxisAngle(Ne,Pe*e*S/Be),_e(0,u,U),J.quaternion.copy(U);for(const o of N){const i=e,r=o.born?.4:.55;if(C.set(Math.sin(i*.21+o.ph[0]),Math.sin(i*.17+o.ph[1]),Math.sin(i*.19+o.ph[2])).multiplyScalar(r),ve.setFromAxisAngle(o.axis,o.rate*e).multiply(o.q0),o.born){const n=K*K*(3-2*K);C.add(o.pos),C.z=Le(-f+9,-f-12-o.r,n)+C.z-o.pos.z,C.applyQuaternion(U).add(u),ve.premultiply(U)}else C.add(o.pos).add(u);o.live=(o.live||l()).copy(C),_e(o.slot,C,ve)}};De(0);const Y=N.filter(e=>!e.born);return{object:O,radius:f+7,height:2*(f+7),center:u.clone(),ground:!1,groundY:0,uniforms:E,anchors:{center:u.clone(),axis:l(0,0,-1),nearPole:{position:l(0,D,f),normal:l(0,0,1),radius:P},farPole:{position:l(0,D,-f),normal:l(0,0,-1),radius:w.r1},portalSeat:{position:l(0,D,-f-16),normal:l(0,0,-1),radius:7},flyThrough:[l(0,D,190),l(0,D,120),...[1,.75,.5,.25,0,-.25,-.5,-.75,-1].map(e=>j(e*f).add(u)),l(0,D,-95),l(0,D,-130)],viewpoints:{reveal:l(45,D+20,255),threeQuarter:l(150,D+45,125),inside:l(-6,D+2,32),wall:j(0).add(u),tearFrame:j(-12).add(u)},daughters:Y.map(e=>({center:e.pos.clone().add(u),radius:e.r})),largest:Y.length?{center:Y[0].pos.clone().add(u),radius:Y[0].r}:null,newborn:{center:re.clone().add(u),radius:se},lampDir:x.clone()},daughterPosition(e,o=l()){const i=Y[e];return i&&i.live?o.copy(i.live):o.copy(u)},setProgress(e){K=ee(e,0,1)},setLamp(e){x.copy(e).normalize(),E.uLampLocal.value.copy(x),q&&q.material.uniforms.uLampWorld.value.copy(x)},setFocus(e,o,i=.55){E.uFocus.value.set(e,o,i)},setField(e,o){E.uField.value.set(e),o&&E.uHaze.value.set(o)},update(e,o,i){E.uTime.value=o,s.renderer&&s.renderer.getDrawingBufferSize&&(E.uResY.value=Math.max(240,s.renderer.getDrawingBufferSize($e).y)),De(o),q&&i&&(O.updateWorldMatrix(!0,!1),q.position.copy(O.worldToLocal(i.getWorldPosition(C))))},dispose(){}}}export{lo as buildHero};
