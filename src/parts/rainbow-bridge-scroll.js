import*as v from"three";const B0=["#B79C70","#DCCBA6","#2B241C","#8E8573","#C6A568","#A7A57C","#C2371F"],j0=7,H0=20,O=3,q0=31,Ce=.29,V0=new v.Vector3(-.55,.62,.56).normalize(),d0=new v.Color("#2B241C"),D=o=>{const s=Math.pow(Math.min(Math.abs(o)/q0,1),1.5);return O+4*(1+Math.cos(Math.PI*s))},C0=o=>(D(o+.05)-D(o-.05))/.1,de=[[-21.2,2.2],[-8,9.75],[8,9.75],[21.2,2.2]],Re=[[-21,3.2],[-14.5,7.5],[0,10.25],[14.5,7.5],[21,3.2]],pe=(o,s)=>{for(let t=0;t<o.length-1;t++){const S=o[t],E=o[t+1];if(s<=E[0]||t===o.length-2)return S[1]+(E[1]-S[1])*(s-S[0])/(E[0]-S[0])}return 0},ae=(o,s,t)=>{const S=Math.min(1,Math.max(0,(t-o)/(s-o)));return S*S*(3-2*S)},d={none:0,planks:1,courses:2,lattice:3,rope:4,ticks:5,stripes:6,weave:7,tiles:8,whip:9,brocade:10};function ze(o){const s=[],t=[],S=[],E=[],B=[],r=[],i=[],n=[];let x=0,y=[0,0,0,0];const u=new v.Matrix4,a=new v.Matrix3,h=new v.Vector3,m=new v.Vector3,F=new v.Vector3,I=new v.Vector3,_=new v.Vector3,P={get count(){return n.length/3},setXf(z){z?u.copy(z):u.identity(),a.getNormalMatrix(u)},setRng(z){o=z},setAnim(z,c,l,b){y=b?[z,c,l,b]:[0,0,0,0]},tone(z,c){return c.y<-.35?z.under||(z.under=z.shade.clone().lerp(d0,.45)):c.dot(V0)>.02||c.y>.75?z.lit:z.shade},vert(z,c,l,b,A,p,w,g,k){return h.copy(z).applyMatrix4(u),m.copy(c).applyMatrix3(a).normalize(),s.push(h.x,h.y,h.z),t.push(m.x,m.y,m.z),S.push(l.r,l.g,l.b),E.push(b,A),B.push(p,w),r.push(g[0],g[1]||1,g[2]||1,k?1:0),i.push(y[0],y[1],y[2],y[3]),x++},tri(z,c,l){n.push(z,c,l)},quad(z,c,l,b,A,p=[0],w={}){const g=_.copy(F.subVectors(c,z)).cross(I.subVectors(b,z)).normalize().clone();m.copy(g).applyMatrix3(a).normalize();const k=w.col||P.tone(A,m),C=w.lu??z.distanceTo(c),T=w.lv??z.distanceTo(b),q=w.u0||0,M=w.v0||0,U=w.edges||[1,1,1,1],L=U[0]?0:.5,Z=U[1]?1:.5,G=U[2]?0:.5,Y=U[3]?1:.5,N=P.vert(z,g,k,q,M,L,G,p),Q=P.vert(c,g,k,q+C,M,Z,G,p),W=P.vert(l,g,k,q+C,M+T,Z,Y,p),J=P.vert(b,g,k,q,M+T,L,Y,p);n.push(N,Q,W,N,W,J),w.double&&n.push(N,W,Q,N,J,W)},beam(z,c,l,b,A,p=[0],w={}){const g=new v.Vector3().subVectors(c,z),k=g.length();g.normalize();const C=new v.Vector3().crossVectors(g,Math.abs(g.y)>.95?new v.Vector3(1,0,0):new v.Vector3(0,1,0)).normalize(),T=new v.Vector3().crossVectors(C,g).normalize();w.roll&&(C.applyAxisAngle(g,w.roll),T.applyAxisAngle(g,w.roll));const q=(U,L,Z)=>new v.Vector3().copy(z).addScaledVector(g,U*k).addScaledVector(C,L*l/2).addScaledVector(T,Z*b/2),M={u0:w.u0||o()*7,lu:k};P.quad(q(0,1,-1),q(1,1,-1),q(1,1,1),q(0,1,1),A,p,M),P.quad(q(1,-1,-1),q(0,-1,-1),q(0,-1,1),q(1,-1,1),A,p,M),P.quad(q(0,1,1),q(1,1,1),q(1,-1,1),q(0,-1,1),A,w.patTop||p,M),w.noBottom||P.quad(q(0,-1,-1),q(1,-1,-1),q(1,1,-1),q(0,1,-1),A,p,M),w.noEnds||(P.quad(q(0,-1,-1),q(0,1,-1),q(0,1,1),q(0,-1,1),A,[0]),P.quad(q(1,1,-1),q(1,-1,-1),q(1,-1,1),q(1,1,1),A,[0]))},box(z,c,l,b,A,p,w,g=[0],k={}){const C=k.ry||0,T=Math.cos(C),q=Math.sin(C),M=k.taper??1,U=(Z,G,Y)=>{const N=G>0?M:1,Q=Z*b/2*N,W=Y*p/2*N;return new v.Vector3(z+Q*T+W*q,c+G*A/2,l-Q*q+W*T)},L={u0:k.u0??o()*5,v0:k.v0||0};P.quad(U(-1,-1,1),U(1,-1,1),U(1,1,1),U(-1,1,1),w,g,L),P.quad(U(1,-1,-1),U(-1,-1,-1),U(-1,1,-1),U(1,1,-1),w,g,L),P.quad(U(1,-1,1),U(1,-1,-1),U(1,1,-1),U(1,1,1),w,g,L),P.quad(U(-1,-1,-1),U(-1,-1,1),U(-1,1,1),U(-1,1,-1),w,g,L),k.noTop||P.quad(U(-1,1,1),U(1,1,1),U(1,1,-1),U(-1,1,-1),w,k.patTop||[0],L),k.bottom&&P.quad(U(-1,-1,-1),U(1,-1,-1),U(1,-1,1),U(-1,-1,1),w,[0],L)},tube(z,c,l,b,A,p=[0],w={}){const g=w.sides||8,k=new v.Vector3().subVectors(c,z),C=k.length();k.normalize();const T=new v.Vector3().crossVectors(k,Math.abs(k.y)>.95?new v.Vector3(1,0,0):new v.Vector3(0,1,0)).normalize(),q=new v.Vector3().crossVectors(T,k).normalize(),M=o()*5,U=[];for(let L=0;L<=g;L++){const Z=L/g*Math.PI*2,G=new v.Vector3().addScaledVector(T,Math.cos(Z)).addScaledVector(q,Math.sin(Z));m.copy(G).applyMatrix3(a).normalize();const Y=P.tone(A,m),N=new v.Vector3().copy(z).addScaledVector(G,l),Q=new v.Vector3().copy(c).addScaledVector(G,b),W=L/g*Math.PI*2*l;U.push([P.vert(N,G,Y,M,W,.5,w.noRing?.5:0,p,!0),P.vert(Q,G,Y,M+C,W,.5,w.noRing?.5:1,p,!0),N,Q])}for(let L=0;L<g;L++)n.push(U[L][0],U[L][1],U[L+1][1],U[L][0],U[L+1][1],U[L+1][0]);for(const L of w.caps===!1?[]:[0,1]){const Z=L?c:z,G=L?k:k.clone().negate();m.copy(G).applyMatrix3(a).normalize();const Y=w.capCol||P.tone(A,m),N=P.vert(Z,G,Y,0,0,.5,.5,[0]),Q=[];for(let W=0;W<=g;W++)Q.push(P.vert(U[W][2+L],G,Y,0,0,.5,1,[0]));for(let W=0;W<g;W++)L?n.push(N,Q[W+1],Q[W]):n.push(N,Q[W],Q[W+1])}},cone(z,c,l,b,A,p,w,g={}){const k=new v.Vector3(z,c+A,l),C=g.phase||0;for(let T=0;T<p;T++){const q=C+T/p*Math.PI*2,M=C+(T+1)/p*Math.PI*2,U=b*(g.scallop,1),L=new v.Vector3(z+Math.cos(q)*U,c,l+Math.sin(q)*U),Z=new v.Vector3(z+Math.cos(M)*U,c,l+Math.sin(M)*U),G=new v.Vector3(Math.cos((q+M)/2)*A,b,Math.sin((q+M)/2)*A).normalize();m.copy(G).applyMatrix3(a).normalize();const Y=g.col||P.tone(w,m),N=g.pat||[0],Q=P.vert(k,G,Y,0,0,0,.5,N),W=P.vert(L,G,Y,0,b,0,1,N),J=P.vert(Z,G,Y,1,b,1,1,N);n.push(Q,J,W),g.double!==!1&&n.push(Q,W,J)}},build(){const z=new v.BufferGeometry;return z.setAttribute("position",new v.Float32BufferAttribute(s,3)),z.setAttribute("normal",new v.Float32BufferAttribute(t,3)),z.setAttribute("aCol",new v.Float32BufferAttribute(S,3)),z.setAttribute("aUv",new v.Float32BufferAttribute(E,2)),z.setAttribute("aEdge",new v.Float32BufferAttribute(B,2)),z.setAttribute("aPat",new v.Float32BufferAttribute(r,4)),z.setAttribute("aAnim",new v.Float32BufferAttribute(i,4)),z.setIndex(x>65535?new v.Uint32BufferAttribute(n,1):new v.Uint16BufferAttribute(n,1)),z.computeBoundingSphere(),z},async buildAsync(z){const c=new v.BufferGeometry;return c.setAttribute("position",new v.Float32BufferAttribute(s,3)),c.setAttribute("normal",new v.Float32BufferAttribute(t,3)),await z(),c.setAttribute("aCol",new v.Float32BufferAttribute(S,3)),c.setAttribute("aUv",new v.Float32BufferAttribute(E,2)),c.setAttribute("aEdge",new v.Float32BufferAttribute(B,2)),await z(),c.setAttribute("aPat",new v.Float32BufferAttribute(r,4)),await z(),c.setAttribute("aAnim",new v.Float32BufferAttribute(i,4)),await z(),c.setIndex(x>65535?new v.Uint32BufferAttribute(n,1):new v.Uint16BufferAttribute(n,1)),c.computeBoundingSphere(),c}};return P.setXf(null),P}const Fe=`
  float h11(float x) { return fract(sin(x * 127.1 + 3.7) * 43758.5453); }
  float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float deckY(float x) { float t = pow(min(abs(x) / 31.0, 1.0), 1.5); return 3.0 + 4.0 * (1.0 + cos(3.14159265 * t)); }
  // ink coverage of a line whose centre is d (pattern units) away, where one pixel is fw pattern units
  float inkLine(float d, float fw, float px) { return 1.0 - smoothstep(px * 0.5 - 0.5, px * 0.5 + 0.5, d / max(fw, 1e-6)); }
  // repeating ruled lines every period; omitted (never smeared) once they crowd under ~4 px
  float ruled(float x, float period, float fw, float px) {
    float d = abs(fract(x / period - 0.5) - 0.5) * period;
    return inkLine(d, fw, px) * smoothstep(2.6, 5.0, period / max(fw, 1e-6));
  }
`,De=`
  uniform vec4 uMist; uniform vec4 uMistBand; uniform vec4 uClip;
  // uClip (nx, nz, d, on): while on, whatever stands beyond the plane nx x + nz z + d = 0 is not drawn (see the world)
  bool clipped(vec3 w) { return uClip.w > 0.5 && dot(w.xz, uClip.xy) + uClip.z > 0.0; }
  float mistAt(vec3 w, float dist) {
    float b = 0.5 + 0.5 * sin(w.x * 0.066 + w.z * 0.013 - uMist.y) + 0.22 * sin(w.x * 0.021 - w.z * 0.031 + 1.7 + uMist.y * 0.4);
    b = smoothstep(uMistBand.x, uMistBand.y, b);
    // over the river and the first row the band lies low (5 to 15 m); behind the first row it may stand higher
    float back = smoothstep(28.0, 42.0, abs(w.z));
    float low = 1.0 - smoothstep(mix(5.0, uMistBand.z, back), mix(15.0, uMistBand.w, back), w.y);
    return uMist.x * b * low * smoothstep(uMist.z, uMist.w, dist);
  }
`,We=`
  uniform vec3 uRipple;
  float rippleY(float x) { float d = (x - uRipple.x) / max(uRipple.z, 1.0); return uRipple.y * exp(-d * d); }
`,F0=`
  attribute vec3 aCol; attribute vec2 aUv; attribute vec2 aEdge; attribute vec4 aPat; attribute vec4 aAnim;
  uniform float uTime, uSurge;
  varying vec3 vCol; varying vec2 vUv; varying vec2 vEdge; varying vec4 vPat; varying vec3 vN; varying vec3 vV;
  #include <fog_pars_vertex>
  ${We}
  void main() {
    vec3 p = position;
    float kind = aAnim.w;
    if (kind > 0.5) {
      float ph = fract(sin(dot(aAnim.xz, vec2(12.9898, 78.233))) * 43758.5453) * 6.2831;
      #ifdef USE_INSTANCING
        ph += instanceMatrix[3][0] * 0.37 + instanceMatrix[3][2] * 0.23;
      #endif
      vec3 r = p - aAnim.xyz;
      if (kind < 1.5) {                       // parasol: tilts upstream with the surge, nods a little always
        float ang = uSurge * 0.34 * (0.55 + 0.45 * sin(ph * 3.0)) + 0.04 * sin(uTime * 1.3 + ph);
        float c = cos(ang), s = sin(ang);
        r = vec3(r.x, c * r.y - s * r.z, s * r.y + c * r.z);
        p = aAnim.xyz + r;
      } else if (kind < 2.5) {                // cloth hanging below its pivot: awning valances, banners, laundry
        float w = clamp(-r.y, 0.0, 2.5);
        p.z += sin(uTime * 2.1 + ph + p.x * 0.9) * 0.13 * w;
        p.x += sin(uTime * 1.7 + ph * 2.0 + p.y) * 0.05 * w;
      } else if (kind < 3.5) {                // carried things bob
        p.y += sin(uTime * 3.2 + ph) * 0.09;
      } else {                                // wind vane swings about its pole
        float ang = 0.7 * sin(uTime * 0.31 + ph) + 0.15 * sin(uTime * 1.9 + ph * 3.0);
        float c = cos(ang), s = sin(ang);
        p = aAnim.xyz + vec3(c * r.x + s * r.z, r.y, -s * r.x + c * r.z);
      }
    }
    #ifdef USE_INSTANCING
      vec4 wp = modelMatrix * instanceMatrix * vec4(p, 1.0);
      vN = mat3(modelMatrix) * (mat3(instanceMatrix) * normal);
    #else
      vec4 wp = modelMatrix * vec4(p, 1.0);
      vN = mat3(modelMatrix) * normal;
    #endif
    wp.y += rippleY(wp.x);
    vV = cameraPosition - wp.xyz;
    vCol = aCol; vUv = aUv; vEdge = aEdge; vPat = aPat;
    vec4 mvPosition = viewMatrix * wp;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`,T0=`
  uniform vec3 uInk, uSilk, uGrey, uPale, uGold; uniform float uLinePx; uniform vec2 uFade;
  varying vec3 vCol; varying vec2 vUv; varying vec2 vEdge; varying vec4 vPat; varying vec3 vN; varying vec3 vV;
  #include <fog_pars_fragment>
  ${Fe}
  ${De}
  void main() {
    float px = uLinePx;
    vec2 fwU = vec2(length(vec2(dFdx(vUv.x), dFdy(vUv.x))), length(vec2(dFdx(vUv.y), dFdy(vUv.y))));
    vec2 fwE = vec2(length(vec2(dFdx(vEdge.x), dFdy(vEdge.x))), length(vec2(dFdx(vEdge.y), dFdy(vEdge.y))));
    vec2 e = min(vEdge, 1.0 - vEdge);
    float line = max(inkLine(e.x, fwE.x, px * 1.45), inkLine(e.y, fwE.y, px * 1.45));
    float dist = length(vV);
    // round timber: rule the silhouette (the derivative is taken outside the branch: Direct3D)
    float sil = abs(dot(normalize(vN + vec3(0.0, 1e-5, 0.0)), vV / max(dist, 1e-4)));
    float fs = length(vec2(dFdx(sil), dFdy(sil)));
    if (vPat.w > 0.5) line = max(line, inkLine(sil, fs, px * 2.0) * step(sil, 0.55));
    vec3 col = vCol;
    float id = floor(vPat.x + 0.5), pu = max(vPat.y, 1e-3), pv = max(vPat.z, 1e-3), u = vUv.x, v = vUv.y;
    bool cut = false;
    if (id == 1.0) {                          // planks: long seams, staggered butt joints
      float row = floor(v / pv);
      float l = ruled(v, pv, fwU.y, px);
      float j = ruled(u + h11(row) * pu, pu, fwU.x, px) * smoothstep(2.6, 5.0, pv / max(fwU.y, 1e-6));
      line = max(line, max(l, j * 0.9));
      col = mix(col, uGrey, 0.10 * step(0.72, h11(row + 31.0)));
    } else if (id == 2.0) {                   // masonry: ruled courses, staggered joints
      float row = floor(v / pv);
      float l = ruled(v, pv, fwU.y, px);
      float j = ruled(u + h11(row) * pu, pu, fwU.x, px) * smoothstep(2.6, 5.0, pv / max(fwU.y, 1e-6));
      line = max(line, max(l, j));
      col = mix(col, uGrey, 0.22 * step(0.8, h21(vec2(row, floor((u + h11(row) * pu) / pu)))));
    } else if (id == 3.0) {                   // open lattice
      float fw = max(fwU.x, fwU.y);
      float l = max(ruled(u + v, pu, fw * 1.41, px), ruled(u - v, pu, fw * 1.41, px));
      float open = smoothstep(2.6, 5.0, pu / max(fw * 1.41, 1e-6));
      if (open > 0.5 && max(l, line) < 0.35) cut = true;
      col = mix(col, uGrey, 0.35 * (1.0 - open));
      line = max(line, l);
    } else if (id == 4.0) {                   // rope: ruled diagonal turns
      float fw = max(fwU.x, fwU.y);
      line = max(line, ruled(u + v * 0.6, pu, fw, px));
    } else if (id == 5.0) {                   // thatch / mat ticks
      vec2 c = vec2(u / pu, v / pv), f = fract(c), ci = floor(c);
      float h = h21(ci);
      float t = inkLine(abs(f.x - 0.25 - 0.5 * h) * pu, fwU.x, px) * step(0.12, f.y) * step(f.y, 0.55 + 0.35 * h);
      line = max(line, t * smoothstep(3.0, 6.0, pu / max(fwU.x, 1e-6)) * smoothstep(3.0, 6.0, pv / max(fwU.y, 1e-6)));
    } else if (id == 6.0) {                   // plain striped cloth: grey bands, or (pv 2) a mineral wash with pale bands
      float band = mod(floor(u / pu), 2.0);
      col = pv > 1.5 ? mix(col, uPale, 0.82 * band) : mix(col, uGrey, 0.55 * band);
      line = max(line, ruled(u, pu, fwU.x, px));
    } else if (id == 7.0) {                   // woven mat: ruled both ways
      line = max(line, max(ruled(u, pu, fwU.x, px), ruled(v, pv, fwU.y, px) * 0.85));
    } else if (id == 8.0) {                   // roof tiles: ruled down the slope, a greyer tint inside
      line = max(line, ruled(v, pv, fwU.y, px));
      col = mix(col, uGrey, 0.14);
    } else if (id == 9.0) {                   // willow whip: one hair line, alternate leaf ticks, a faint stain; the rest is bare silk
      float c = u - 0.5 * pu, fw = max(fwU.x, fwU.y);
      float sg = v / pv, fv = fract(sg), sd = mod(floor(sg), 2.0) * 2.0 - 1.0;
      float l = inkLine(abs(c), fwU.x, px * 0.9);
      float tk = inkLine(abs(c - sd * (fv - 0.15) * 0.9 * pu), fw, px * 0.9) * step(0.15, fv) * step(fv, 0.6) * step(pv, 40.0) * smoothstep(3.0, 6.0, pv / max(fwU.y, 1e-6));
      line = max(l, tk) * 0.78;
      if (line < 0.3 && (abs(c) > 0.2 * pu || pv > 40.0)) cut = true;
    } else if (id == 10.0) {                  // brocade: a lozenge lattice ruled in gold, a gold dot in every cell
      float fw = max(fwU.x, fwU.y) * 1.41, a = u + v, b = u - v;
      float l = max(ruled(a, pu, fw, px * 1.3), ruled(b, pu, fw, px * 1.3));
      vec2 c = (vec2(fract(a / pu), fract(b / pu)) - 0.5) * pu;
      float dt = (1.0 - smoothstep(0.13 * pu - fw, 0.13 * pu + fw, length(c))) * smoothstep(2.6, 5.0, pu / max(fw, 1e-6));
      col = mix(col, uGold, 0.85 * max(l, dt));
    }
    if (cut || clipped(cameraPosition - vV)) discard;
    col = mix(col, uInk, clamp(line, 0.0, 1.0));
    col = mix(col, uSilk, max(smoothstep(uFade.x, uFade.y, dist), mistAt(cameraPosition - vV, dist)));   // distance and mist are omission
    gl_FragColor = vec4(col, 1.0);
    #include <fog_fragment>
  }
`,U0=`
  attribute vec4 aHome; attribute vec4 aInfo; attribute vec3 aCol;
  uniform float uTime, uSurge, uProgress; uniform vec4 uBarge;
  varying vec2 vQ; varying vec3 vCol; varying float vHat; varying float vDist; varying vec3 vW;
  #include <fog_pars_vertex>
  ${Fe}
  ${We}
  void main() {
    float kind = aInfo.x, ph = aHome.w, lean = aInfo.z;
    vec3 base = aHome.xyz;
    if (kind < 0.5) {                         // the lane: two streams shuffling past each other
      float dir = ph > 3.1416 ? 1.0 : -1.0;
      float x = mod(base.x + 29.0 + dir * uTime * (0.45 + 0.3 * fract(ph * 7.0)), 58.0) - 29.0;
      base.x = x; base.z += 0.45 * sin(uTime * 0.4 + ph * 5.0); base.y = deckY(x) + 0.03 * sin(uTime * 5.0 + ph * 9.0);
    } else if (kind < 1.5) {                  // the rail: surge to the middle, then half cross to watch us leave
      float f = fract(ph * 3.7);
      float squeeze = mix(1.0, 0.42 + 0.25 * f, uSurge);
      base.x *= squeeze;
      base.z -= uSurge * 0.9 * floor(f * 2.99) * 0.8;
      float cr = smoothstep(0.60 + f * 0.12, 0.70 + f * 0.16, uProgress) * step(0.42, f);
      base.z = mix(base.z, -base.z, cr); lean = mix(lean, -lean, cr);
      base.y = deckY(base.x) + 0.16 * uSurge * abs(sin(uTime * 2.3 + ph * 4.0));
    } else if (kind > 2.5) {                  // crew: rides the barge
      float c = cos(uBarge.w), s = sin(uBarge.w);
      base = uBarge.xyz + vec3(c * base.x + s * base.z, base.y, -s * base.x + c * base.z);
    }
    float h = aInfo.y;
    vec3 loc = base + vec3(0.0, position.y * h, lean * position.y);
    vec4 wp = modelMatrix * vec4(loc, 1.0);
    vec3 right = normalize(vec3(viewMatrix[0][0], 0.0, viewMatrix[2][0]) + vec3(1e-5, 0.0, 0.0));
    wp.xyz += right * position.x * h * 0.46;
    wp.y += rippleY(wp.x); vW = wp.xyz;
    vQ = vec2(position.x * 0.46, position.y); vCol = aCol; vHat = aInfo.w;
    vec4 mvPosition = viewMatrix * wp;
    vDist = length(mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`,p0=`
  uniform vec3 uInk, uSilk; uniform float uLinePx; uniform vec2 uFade;
  varying vec2 vQ; varying vec3 vCol; varying float vHat; varying float vDist; varying vec3 vW;
  #include <fog_pars_fragment>
  ${De}
  void main() {
    float fw = max(length(vec2(dFdx(vQ.y), dFdy(vQ.y))), 1e-6), px = uLinePx;
    float y = clamp(vQ.y / 0.76, 0.0, 1.0);
    float robe = max(abs(vQ.x) - (0.045 + 0.125 * pow(1.0 - y, 0.75)), max(-vQ.y, vQ.y - 0.76));
    float head = length(vQ - vec2(0.0, 0.85)) - 0.094;
    float hat = max(abs(vQ.x) - 0.17, abs(vQ.y - 0.93 + abs(vQ.x) * 0.35) - 0.012);
    float ink = 1.0 - smoothstep(-0.5, 0.5, head / fw);
    if (vHat > 0.5 && vHat < 1.5) ink = max(ink, 1.0 - smoothstep(px * 0.3 - 0.5, px * 0.3 + 0.5, hat / fw));
    float yoke = max(abs(vQ.x) - 0.225, abs(vQ.y - 0.73) - 0.006);                          // a shoulder pole and its two baskets
    float bsk = max(abs(abs(vQ.x) - 0.19) - 0.036, abs(vQ.y - 0.5) - 0.06);
    float cord = max(abs(abs(vQ.x) - 0.19) - 0.004, abs(vQ.y - 0.64) - 0.09);
    if (vHat > 1.5) ink = max(ink, max(1.0 - smoothstep(px * 0.3 - 0.5, px * 0.3 + 0.5, min(yoke, cord) / fw), 0.8 * (1.0 - smoothstep(-0.5, 0.5, bsk / fw))));
    float edge = 1.0 - smoothstep(px * 0.38 - 0.5, px * 0.38 + 0.5, abs(robe) / fw);
    float body = 1.0 - smoothstep(-0.5, 0.5, robe / fw);
    float a = max(body, max(edge, ink));
    if (a < 0.5 || clipped(vW)) discard;
    vec3 col = mix(vCol, uInk, max(edge, ink));
    col = mix(col, uSilk, max(smoothstep(uFade.x, uFade.y, vDist), mistAt(vW, vDist)));
    gl_FragColor = vec4(col, 1.0);
    #include <fog_fragment>
  }
`,h0=`
  attribute vec3 aDir; attribute float aSide;
  uniform vec2 uRes; uniform float uLinePx;
  #include <fog_pars_vertex>
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vec4 c0 = projectionMatrix * mvPosition;
    vec4 mv1 = modelViewMatrix * vec4(position + aDir * 0.25, 1.0);
    vec4 c1 = projectionMatrix * mv1;                 // the same arithmetic as c0, so a joining vertex (aDir = 0) has exactly no width
    vec2 s0 = c0.xy / max(abs(c0.w), 1e-4), s1 = c1.xy / max(abs(c1.w), 1e-4);
    vec2 d = (s1 - s0) * uRes; d = d / max(length(d), 1e-5);
    c0.xy += vec2(-d.y, d.x) * aSide * (uLinePx * 1.15) / uRes * c0.w * step(1e-6, dot(aDir, aDir));
    gl_Position = c0;
    #include <fog_vertex>
  }
`,m0=`
  uniform vec3 uInk;
  #include <fog_pars_fragment>
  void main() {
    gl_FragColor = vec4(uInk, 1.0);
    #include <fog_fragment>
  }
`,e=(o,s,t)=>new v.Vector3(o,s,t),Ye=[-5.25,-1.75,1.75,5.25],Ne=[-14.5,-8,0,8,14.5],b0=o=>Math.abs(o)>10?pe(Re,o)-Ce-.27:pe(de,o)-Ce-.24;async function I0(o,s,t,S){const E=[[-6.62,-6],[-4.55,-3.85,-3.15,-2.45],[-1.05,-.35,.35,1.05],[2.45,3.15,3.85,4.55],[6,6.62]];let B=0;for(const r of E)for(const i of r){B%3===0&&await S();const n=B++%2?Re:de,x=Ce*s.range(.88,1.06),y=s.range(-.04,.04);for(let u=0;u<n.length-1;u++){const a=e(n[u][0],n[u][1],i+y),h=e(n[u+1][0],n[u+1][1],i+y),m=h.clone().sub(a).normalize();u>0&&a.addScaledVector(m,-s.range(.7,1.25)),u<n.length-2&&h.addScaledVector(m,s.range(.7,1.25)),o.tube(a,h,x,x*s.range(.86,.98),t.log,[d.none],{sides:8,capCol:t.endGrain})}for(const u of Ne){const a=pe(n,u),h=(pe(n,u+.3)-pe(n,u-.3))/.6,F=n.some(_=>Math.abs(_[0]-u)<.1)?.62:.4,I=e(1,h,0).normalize();o.tube(e(u,a,i+y).addScaledVector(I,-F),e(u,a,i+y).addScaledVector(I,F),x+.075,x+.075,t.rope,[d.rope,.16,1],{sides:8,caps:!1})}}await S();for(const r of Ye){for(let i=0;i<3;i++){const n=e(de[i][0],de[i][1]-.36,r),x=e(de[i+1][0],de[i+1][1]-.36,r);i===1&&(n.x-=.5,x.x+=.5),o.beam(n,x,.62,.78,t.beam,[d.planks,9,.39],{noEnds:i!==1})}for(const i of[-1,1]){for(const n of[-.75,.75])o.box(i*8+n,9.39,r,.16,.9,.74,t.rope,[d.rope,.12,1],{bottom:!0});for(let n=0;n<3;n++){const x=3-n*.85,y=i*(20.5-x/2),u=pe(de,i*(20.4-x))-.75-.12;o.box(y,Math.min(u,3.3-n*.5)-.24+n*0,r,x,.48,.74-n*.06,t.beam,[d.none],{bottom:!0})}}}await S();for(const r of Ne){const i=b0(r),n=Math.abs(r)>10?.27:.24;o.tube(e(r,i,-8.05),e(r,i,8.05),n,n,t.log,[d.none],{sides:8,capCol:t.endGrain});for(const x of[-1,1])o.box(r,i,x*7.45,.78,.78,.3,t.beam,[d.none],{bottom:!0}),o.beam(e(r-.5,i+.32,x*7.72),e(r+.45,i+.36,x*7.72),.1,.16,t.timber)}for(const r of[-6.62,6.62])for(const i of[-1,1])for(let n=9.6;n<20;n+=1.55){const x=pe(Re,i*n)+Ce*.8,y=D(n)-.34;y-x>.25&&o.tube(e(i*n,x,r),e(i*n,y,r),.13,.11,t.log,[d.none],{sides:6,caps:!1})}}function _0(o,s,t){let i=0;for(let n=-33;n<33-.001;n+=1.5){const x=n+1.5,y=D(n),u=D(x),a=Math.hypot(1.5,u-y);o.quad(e(n,y,-7.2),e(n,y,7.2),e(x,u,7.2),e(x,u,-7.2),t.deck,[d.planks,5.2,.52],{u0:0,v0:i,lv:a,edges:[1,1,0,0]}),Math.abs(n+1.5/2)<21&&o.quad(e(n,y-.34,7.2),e(n,y-.34,-7.2),e(x,u-.34,-7.2),e(x,u-.34,7.2),t.under,[d.planks,5.2,.52],{u0:0,v0:i,lv:a,edges:[1,1,0,0]});for(const h of[-1,1]){const m=e(h>0?n:x,(h>0?y:u)-.62,h*7.2),F=e(h>0?x:n,(h>0?u:y)-.62,h*7.2);o.quad(m,F,e(F.x,F.y+.62,F.z),e(m.x,m.y+.62,m.z),t.timber,[d.planks,4.1,.31],{u0:h>0?i:-i-a,edges:[0,0,1,1]})}i+=a}for(const n of[-6.92,6.92]){const x=[];for(let y=-31.9;y<=31.91;y+=2.2)x.push(y);for(let y=0;y<x.length;y++){const u=x[y],a=D(u),h=y===0||y===x.length-1||Math.abs(u)<.2;if(o.box(u,a+(h?1.05:.85),n,h?.36:.24,h?2.1:1.7,h?.36:.24,t.timber,[d.none]),o.box(u,a+(h?2.2:1.78),n,h?.5:.34,.16,h?.5:.34,t.beam,[d.none],{bottom:!0}),y===x.length-1)break;const m=x[y+1],F=D(m);for(const _ of[1.5,.3])o.beam(e(u,a+_,n),e(m,F+_,n),.14,.18,t.timber,[d.none],{noEnds:!0});const I=n>0?[e(u,a+.38,n),e(m,F+.38,n),e(m,F+1.42,n),e(u,a+1.42,n)]:[e(m,F+.38,n),e(u,a+.38,n),e(u,a+1.42,n),e(m,F+1.42,n)];o.quad(I[0],I[1],I[2],I[3],t.rail,[d.lattice,.47,1],{u0:y*2.2,lu:2.2,lv:1.04,edges:[0,0,0,0],double:!0})}}}function E0(o,s,t,S,E){const B=[d.courses,1.55,.52];for(const r of[-1,1]){const i=l=>r*l,n=(l,b,A,p,w,g,k)=>r>0?o.quad(b,l,p,A,w,g,k):o.quad(l,b,A,p,w,g,k),m=O;n(e(i(19.2),-.8,9.3),e(i(19.2),-.8,-9.3),e(i(19.75),m,-9),e(i(19.75),m,9),t.stone,B,{u0:0}),n(e(i(22.2),-.8,9.3),e(i(19.2),-.8,9.3),e(i(19.75),m,9),e(i(22.2),m,9),t.stone,B,{u0:3}),n(e(i(19.2),-.8,-9.3),e(i(22.2),-.8,-9.3),e(i(22.2),m,-9),e(i(19.75),m,-9),t.stone,B,{u0:7}),n(e(i(19.75),m,9),e(i(19.75),m,-9),e(i(22.2),m,-9),e(i(22.2),m,9),t.stoneTop,[d.courses,1.9,1.1],{});const F=20.55,I=8.1,_=D(F)-.34,P=28.5,z=D(P)-.3;n(e(i(F),m,I),e(i(F),m,-I),e(i(F),_,-I),e(i(F),_,I),t.stone,B,{u0:1}),n(e(i(P),m,I),e(i(F),m,I),e(i(F),_,I),e(i(P),z,I),t.stone,B,{u0:2,lv:_-m}),n(e(i(F),m,-I),e(i(P),m,-I),e(i(P),z,-I),e(i(F),_,-I),t.stone,B,{u0:5,lv:_-m}),n(e(i(F),_,I),e(i(F),_,-I),e(i(P),z,-I),e(i(P),z,I),t.stoneTop,[d.none],{}),o.box(i(19.75+.05),m+.14,0,.5,.28,18+.3,t.stoneTop,[d.none],{bottom:!0});for(const l of[-1,1]){const b=l*9,A=l*22,p=e(i(22),-.8,l>0?A:b),w=e(i(22),-.8,l>0?b:A);n(p,w,e(w.x,m,w.z),e(p.x,m,p.z),t.stone,B,{u0:l*11}),o.box(i(22.15),m+.13,(b+A)/2,.7,.26,Math.abs(A-b),t.stoneTop,[d.courses,30,1.7],{bottom:!0,patTop:[d.courses,.7,1.7]});for(const g of[12.5,17.5,21]){const k=i(22.9),C=l*(g+s.range(-.6,.6)),T=s.range(-.08,.08);o.tube(e(k,m,C),e(k+T,m+1.7,C+T),.3,.24,t.log,[d.none],{sides:7,capCol:t.endGrain}),o.tube(e(k,m+.75,C),e(k+T*.6,m+1.15,C+T*.6),.36,.34,t.rope,[d.rope,.13,1],{sides:7,caps:!1}),E.mooring.push(e(k,m+1,C))}}for(const l of[-7.4,7.4])o.tube(e(i(20.3),m+.28,l),e(i(20.3),m+1.75,l),.3,.25,t.log,[d.none],{sides:7,capCol:t.endGrain}),E.mooring.push(e(i(20.3),m+1,l));const c=s.chance(.5)?1:-1;for(let l=0;l<9;l++)o.box(i(21.3),m-.2-l*.37,c*(11.2+l*.72),1.5,.4,.74,t.stoneTop,[d.none],{});for(const l of[-7.25,7.25])o.box(i(33.1),O+1.35,l,.62,2.7,.62,t.stone,[d.courses,9,.68],{}),o.box(i(33.1),O+2.85,l,.86,.3,.86,t.stoneTop,[d.none],{bottom:!0}),o.box(i(33.1),O+3.3,l,.5,.6,.5,t.stone,[d.none],{taper:.35});for(const l of[-10.2,10.2]){const b=i(29.6+s.range(-.8,.8)),A=O+s.range(13.2,15.4),p=s.range(-.12,.12);o.tube(e(b,O,l),e(b+p,A,l),.26,.11,t.log,[d.none],{sides:7});for(const T of[-1,1])o.tube(e(b+T*1.5,O,l+T*.5),e(b+p*.2,O+3.4,l),.12,.1,t.log,[d.none],{sides:5,caps:!1});o.tube(e(b,O+2.6,l),e(b+p*.24,O+3.6,l),.33,.31,t.rope,[d.rope,.13,1],{sides:7,caps:!1}),(E.vanePoles=E.vanePoles||[]).push({base:e(b,O,l),top:e(b+p,A,l)}),o.setAnim(b+p,A,l,4),o.beam(e(b+p-1.5,A-1.3,l),e(b+p+1.5,A-1.3,l),.12,.14,t.timber);for(const T of[-1.5,1.5])o.beam(e(b+p+T,A-1.3,l),e(b+p+T*.2,A-.2,l),.07,.07,t.timber,[d.none],{noEnds:!0});const w=b+p,g=A+.32,k={double:!0,col:t.cloth.lit},C=(T,q)=>e(w+T*.62,g+q*.62,l);o.quad(C(-.9,0),C(.2,-.38),C(.95,.12),C(-.1,.42),t.cloth,[d.none],k),o.quad(C(.7,.02),C(1.75,.74),C(2.35,.7),C(.8,.2),t.cloth,[d.none],k),o.quad(C(-1.7,-.3),C(-.8,-.06),C(-.75,.2),C(-1.55,.02),t.cloth,[d.none],{...k,col:t.beam.shade}),o.setAnim(0,0,0,0)}}}async function L0(o,s,t,S,E=40,B=async()=>{}){const r=()=>[d.stripes,s.range(.42,.7),1],i=(u,a,h,m,F,I)=>{o.setAnim(u,h,a,1),o.tube(e(u,h,a),e(u,h+F,a),.065,.05,t.timber,[d.none],{sides:5,caps:!1});const _=I<.36?t.cloth:I<.56?t.oiled:I<.78?t.red:I<.9?t.blue:t.greyCloth;o.cone(u,h+F-.12,a,m,m*s.range(.26,.4),12,_,{phase:s()*6}),o.box(u,h+F+m*.36,a,.16,.22,.16,t.beam,[d.none],{taper:.4}),o.setAnim(0,0,0,0)};let n=0,x=0;for(const u of[-1,1]){let a=-27.5+s.range(0,1.5);for(;a<26;){await B();const h=s.range(3,4.3),m=a+h/2,F=u*4.5,I=D(m),_=Math.min(D(a),D(a+h)),P=s(),z=F-u*1.3,c=F+u*1.25;if(Math.abs(m)<2.6&&u>0){a+=h;continue}if(P<.5){const p=s.range(4.1,4.7),w=p+s.range(.6,1.1);for(const[U,L,Z]of[[a+.15,z,p],[a+h-.15,z,p],[a+.15,c,w],[a+h-.15,c,w]])o.tube(e(U,D(U),L),e(U,_+Z,L),.085,.07,t.timber,[d.none],{sides:5,caps:!1});const g=e(a-.25,_+p,z-u*.5),k=e(a+h+.25,_+p,z-u*.5),C=e(a+h+.25,_+w,c),T=e(a-.25,_+w,c),q=r(),M=x%3===0?t.blue:x%3===1?t.cloth:t.red;x++,M!==t.cloth&&(q[2]=2),u>0?o.quad(k,g,T,C,M,q,{double:!0,u0:0}):o.quad(g,k,C,T,M,q,{double:!0,u0:0}),o.setAnim(m,_+p,z-u*.5,2),o.quad(e(g.x,g.y-.6,g.z),e(k.x,k.y-.6,k.z),k,g,M,q,{double:!0,u0:0,col:M.lit}),o.setAnim(0,0,0,0)}else if(P<.82){const p=s.range(3.8,4.3),w=p+1.1;for(const T of[a+.15,a+h-.15])for(const q of[z,c])o.tube(e(T,D(T),q),e(T,_+p,q),.1,.085,t.timber,[d.none],{sides:5,caps:!1});const g=e(a-.3,_+w,F),k=e(a+h+.3,_+w,F),C=[d.weave,.34,.34];o.quad(e(a-.3,_+p-.15,F+1.75),e(a+h+.3,_+p-.15,F+1.75),k,g,t.mat,C,{double:!0}),o.quad(e(a+h+.3,_+p-.15,F-1.75),e(a-.3,_+p-.15,F-1.75),g,k,t.mat,C,{double:!0}),o.tube(g.clone().setX(g.x-.2),k.clone().setX(k.x+.2),.09,.09,t.log,[d.none],{sides:5}),o.box(m,_+1.2,c,h-.3,2.4,.08,t.timber,[d.planks,2.7,.4],{u0:0})}else i(m,F,I,s.range(2.1,2.7),s.range(4.3,5),s()),n++;const l=h*s.range(.55,.8),b=I+1.25;o.box(m,b,z+u*.45,l,.12,.95,t.timber,[d.planks,2.2,.32],{bottom:!0,patTop:[d.planks,2.2,.32]});for(const p of[-1,1])for(const w of[-1,1])o.box(m+p*(l/2-.1),b-.66,z+u*.45+w*.38,.1,1.2,.1,t.timber,[d.none],{noTop:!0});const A=s.int(3,6);for(let p=0;p<A;p++){const w=m+(p/(A-1)-.5)*(l-.6),g=z+u*(.45+s.range(-.2,.2)),k=s();k<.4?o.tube(e(w,b+.06,g),e(w,b+s.range(.4,.7),g),.2,.27,t.mat,[d.weave,.11,.11],{sides:7,capCol:t.cloth.lit}):k<.7?(o.tube(e(w,b+.06,g),e(w,b+.6,g),.16,.24,t.stone,[d.none],{sides:7}),o.tube(e(w,b+.6,g),e(w,b+.82,g),.24,.1,t.stone,[d.none],{sides:7})):o.box(w,b+.3,g,.5,.45,.5,t.timber,[d.planks,1,.15],{patTop:[d.none]})}if(s.chance(.7))for(let p=0;p<3;p++)o.box(a+.6+p*.55,D(a+.6)+.3+(p===1?.5:0),c-u*.5,.9,.5,.6,t.cloth,[d.none],{taper:.8,ry:s.range(-.3,.3)});if(S.push({x:m+s.range(-.8,.8),y:I,z:F+u*.35,kind:2,lean:-u*.12}),n<26&&s.chance(.62))i(a+h+.5,z-u*s.range(0,.5),D(a+h+.5),s.range(1.6,2.2),s.range(4.2,5.2),s()),n++;else if(s.chance(.5)){const p=a+h+.45,w=D(p),g=s.range(6.5,8.2);o.tube(e(p,w,c),e(p,w+g,c),.09,.06,t.log,[d.none],{sides:5}),o.beam(e(p-.1,w+g-.3,c),e(p+1.5,w+g-.3,c),.07,.07,t.timber),o.setAnim(p,w+g-.3,c,2),o.quad(e(p+.2,w+g-3.4,c),e(p+1.35,w+g-3.4,c),e(p+1.35,w+g-.35,c),e(p+.2,w+g-.35,c),t.cloth,[d.stripes,.5,2],{double:!0,lu:1,lv:3,u0:0,col:n%2?t.red.lit:t.blue.lit}),o.setAnim(0,0,0,0)}a+=h+s.range(.9,2.2)}}for(await B();n<E;){n%8===0&&await B();const u=s.chance(.55),a=s.range(-24,24),h=u?s.range(5.9,6.4)*(s.chance(.8)?1:-1):s.range(-2.4,2.4);i(a,h,D(a)+.2,s.range(1.15,1.6),s.range(3.3,3.9),s()),n++,S.push({x:a+.35,y:D(a),z:h,kind:2,lean:0})}{const a=s.range(-.5,.5),h=D(2.6)+1.05;o.setAnim(2.6,h,a,3),o.box(2.6,h+.95,a,1.7,1.9,1.5,t.cloth,[d.lattice,.3,1],{bottom:!0,u0:0}),o.cone(2.6,h+1.9,a,1.45,.75,4,t.greyCloth,{phase:Math.PI/4}),o.box(2.6,h+2.72,a,.2,.26,.2,t.beam,[d.none],{taper:.3});for(const m of[-.82,.82])o.tube(e(2.6-3.4,h+.55,a+m),e(2.6+3.4,h+.55,a+m),.07,.07,t.timber,[d.none],{sides:5});o.setAnim(0,0,0,0);for(const m of[-3,3])for(const F of[-.5,.5])S.push({x:2.6+m,y:D(2.6+m),z:a+F,kind:2,lean:0})}const y=s.range(-.6,.6);for(let u=0;u<5;u++){const a=-3.2-u*3+s.range(-.3,.3),h=y+s.range(-.35,.35),m=D(a),F=Math.atan(C0(a)),I=new v.Matrix4().makeTranslation(a,m,h).multiply(new v.Matrix4().makeRotationZ(F));o.setXf(I),o.setAnim(a,m,h,3),o.box(0,1.55,0,2,.85,.72,t.greyCloth,[d.none],{bottom:!0,taper:.9});for(const _ of[-.75,.7])for(const P of[-.22,.22])o.box(_,.6,P,.13,1.2,.13,t.greyCloth,[d.none],{noTop:!0});o.beam(e(.85,1.75,0),e(1.55,2.45,0),.34,.42,t.greyCloth),o.beam(e(1.4,2.5,0),e(2.2,2.2,0),.3,.36,t.greyCloth);for(const _ of[-.1,.1])o.beam(e(1.5,2.6,_),e(1.4,3.2,_*2.2),.06,.14,t.greyCloth);o.beam(e(-1,1.7,0),e(-1.25,1,0),.07,.07,t.beam);for(const _ of[-1,1])o.box(-.1,1.75,_*.62,1.25,1,.5,t.charcoal,[d.ticks,.12,.3],{bottom:!0,taper:.85,patTop:[d.ticks,.12,.3]});o.setXf(null),o.setAnim(0,0,0,0),u%2===0&&S.push({x:a-1.6,y:D(a-1.6),z:h+1,kind:2,lean:0,hat:1})}}const K={len:25,deck:1.55,mastZ:-5.2,mastY:2.4,mastLen:15,crutch:new v.Vector3(-2.1,2.7,-8.85)},G0=o=>2.75*(1-.52*Math.pow(Math.abs(o),3)),H=o=>K.deck+(o<0?.75*o*o:1.55*o*o),Te=new v.Vector3(-1.75,H(-.848)+.3,-10.6);function M0(o,s){const t=ze(o),S=12,E=[];for(let c=0;c<=S;c++){const l=-1+2*c/S;E.push({z:l*12.5,hb:G0(l),sh:H(l),kb:-.55+.75*Math.pow(Math.abs(l),2.5)})}const B=[d.planks,3.4,.4];for(let c=0;c<S;c++){const l=E[c],b=E[c+1],A=l.z+12.5;for(const p of[-1,1]){const w=e(p*l.hb*.78,l.kb,l.z),g=e(p*b.hb*.78,b.kb,b.z),k=e(p*b.hb,b.sh,b.z),C=e(p*l.hb,l.sh,l.z),T={u0:A,lu:b.z-l.z,lv:2.2,edges:[c===0?1:0,c===S-1?1:0,0,1]};p>0?t.quad(g,w,C,k,s.hull,B,{...T,edges:[T.edges[1],T.edges[0],0,1]}):t.quad(w,g,k,C,s.hull,B,T),t.beam(e(p*(l.hb+.05),l.sh+.1,l.z),e(p*(b.hb+.05),b.sh+.1,b.z),.22,.26,s.beam,[d.none],{noEnds:c>0&&c<S-1})}t.quad(e(l.hb,l.sh,l.z),e(-l.hb,l.sh,l.z),e(-b.hb,b.sh,b.z),e(b.hb,b.sh,b.z),s.deck,[d.planks,c<2?2.5:5,.38],{v0:A,lu:5,edges:[0,0,0,0],col:c<2?s.deck.lit.clone().lerp(s.under.lit,.3):void 0})}const r=E[0],i=E[S];t.quad(e(r.hb,r.kb,r.z),e(-r.hb,r.kb,r.z),e(-r.hb,r.sh,r.z),e(r.hb,r.sh,r.z),s.hull,[d.planks,9,.4],{u0:0}),t.quad(e(-i.hb,i.kb,i.z),e(i.hb,i.kb,i.z),e(i.hb,i.sh,i.z),e(-i.hb,i.sh,i.z),s.hull,[d.planks,9,.4],{u0:0}),t.beam(e(-r.hb-.2,r.sh+.1,r.z),e(r.hb+.2,r.sh+.1,r.z),.3,.3,s.beam);const n=1.2,x=9.2,y=2.25,u=2.3,a=H(.4)-.05,h=9;for(let c=0;c<h;c++){const l=c/h*Math.PI,b=(c+1)/h*Math.PI,A=C=>[Math.cos(C)*y,a+.5+Math.sin(C)*(u-.5)],[p,w]=A(l),[g,k]=A(b);t.quad(e(p,w,x),e(p,w,n),e(g,k,n),e(g,k,x),s.mat,[d.weave,.36,.36],{u0:0,v0:c*.75,lv:.75,edges:[1,1,0,0]});for(const[C,T]of[[n,1],[x,-1]]){const q=[e(p,a,C),e(g,a,C),e(g,k,C),e(p,w,C)];T>0?t.quad(q[0],q[1],q[2],q[3],s.timber,[d.planks,9,.36],{u0:p+3,lu:g-p,edges:[0,0,1,1]}):t.quad(q[1],q[0],q[3],q[2],s.timber,[d.planks,9,.36],{u0:p+3,lu:g-p,edges:[0,0,1,1]})}}for(const c of[-1,1])t.box(c*y,a+.25,(n+x)/2,.12,.5,x-n,s.timber,[d.planks,3,.25],{});for(const c of[n+1.2,(n+x)/2,x-1.2])for(const l of[-1,1])t.beam(e(l*.2,a+u+.04,c),e(l*2.2,a+.75,c),.1,.06,s.beam,[d.none],{noEnds:!0});t.box(0,a+.95,n-.03,1,1.7,.06,s.charcoal,[d.none],{});for(let c=0;c<4;c++)for(let l=0;l<4;l++)for(let b=0;b<(c===0||c===3?1:2);b++)t.box(-1.45+l*.97+o.range(-.06,.06),K.deck+.3+b*.52,-3.2+c*.95,.9,.5,.86,s.cloth,[d.none],{taper:.82,ry:o.range(-.12,.12)});for(const c of[-1,1])t.box(c*.82,K.deck+.95,K.mastZ,.3,2.3,.6,s.beam,[d.none],{});t.tube(e(-1.15,K.mastY,K.mastZ),e(1.15,K.mastY,K.mastZ),.11,.11,s.log,[d.none],{sides:6});const m=K.crutch;t.tube(e(m.x,H(m.z/12.5)-.3,m.z),e(m.x,m.y-.7,m.z),.16,.13,s.log,[d.none],{sides:6,caps:!1});for(const c of[-1,1])t.tube(e(m.x,m.y-.75,m.z),e(m.x+c*.69,m.y+.05,m.z-c*.4),.12,.08,s.log,[d.none],{sides:6});const F=H(-.9),I=(c,l,b,A,p,w,g,k,C)=>{for(let T=0;T<g;T++){const q=T/g*Math.PI*2,M=(T+1)/g*Math.PI*2;t.quad(e(c+Math.cos(M)*p,b,l+Math.sin(M)*p),e(c+Math.cos(q)*p,b,l+Math.sin(q)*p),e(c+Math.cos(q)*w,A,l+Math.sin(q)*w),e(c+Math.cos(M)*w,A,l+Math.sin(M)*w),k,C,{u0:T*.37,edges:[0,0,1,1]})}},_=(c,l,b,A,p,w,g)=>{for(let k=0;k<p;k++){const C=k/p*Math.PI*2,T=(k+1)/p*Math.PI*2,q=e(c,b,l);t.quad(q,e(c+Math.cos(C)*A,b,l+Math.sin(C)*A),e(c+Math.cos(T)*A,b,l+Math.sin(T)*A),q.clone(),s.rope,[d.rope,g,1],{u0:0,lu:A,edges:[0,0,0,0],col:w,double:!0})}};for(let c=0;c<3;c++){const l=.74-c*.15,b=F+.02+c*.11;I(.15,-11.1,b,b+.11,l,l-.03,12,s.rope,[d.rope,.14,1]),_(.15,-11.1,b+.11,l-.03,12,c===2?s.rope.shade:s.rope.lit,.16),o()}t.tube(e(.15,F+.3,-11.1),e(.6,F+.42,-11.55),.08,.08,s.rope,[d.rope,.1,1],{sides:5});for(const c of[-1,1]){const l=H(-.95),b=c*.95,A=-11.75;t.box(b,l+.11,A,.26,.22,.26,s.beam,[d.none],{noTop:!0}),I(b,A,l+.02,l+.2,.2,.2,8,s.rope,[d.rope,.11,1]),I(b,A,l+.2,l+.28,.225,.2,8,s.red,[d.none]),I(b,A,l+.28,l+.4,.2,.14,8,s.timber,[d.none]),t.tube(e(b,l+.4,A),e(b,l+.44,A),.16,.15,{lit:s.gold.lit,shade:s.gold.lit},[d.none],{sides:8,capCol:s.gold.lit}),o()}t.box(Te.x,Te.y-.12,Te.z,.5,.16,.2,s.beam,[d.none],{u0:0,bottom:!0}),t.beam(e(-1.42,H(-.975)+.12,-12.18),e(1.42,H(-.975)+.12,-12.18),.2,.22,s.timber,[d.none]);for(let c=0;c<5;c++){const l=-12+c*.26,b=l+.26,A=c%2?1.28:.42,p=c%2?.42:1.28;t.tube(e(A*(c===0?.9:1),F+.09,l),e(p,F+.09,b),.075,.075,s.rope,[d.rope,.1,1],{sides:5})}const P=(c,l,b,A,p,w,g)=>t.tube(e(c,H(l/12.5)+.07+p,l),e(b,H(A/12.5)+.07+p,A),w,w*.8,g,[d.none],{sides:6,capCol:s.endGrain});P(-1.12,-12.45,-2.38,-7.1,0,.07,s.log),P(-1.25,-12.25,-2.5,-7,.01,.07,s.timber),P(-1.18,-12.8,-2.42,-7.4,.13,.055,s.log),t.quad(e(-1.16,H(-1)+.2,-12.86),e(-1,H(-1)+.2,-12.74),e(-.98,H(-1)+.46,-12.78),e(-1.14,H(-1)+.4,-12.9),s.charcoal,[d.none],{double:!0});for(const c of[-11.2,-8.4]){const l=-1.12+-1.2599999999999998*(c+12.45)/5.35-.06;t.tube(e(l-.02,H(c/12.5)+.02,c-.1),e(l-.04,H(c/12.5)+.02,c+.14),.19,.19,s.rope,[d.rope,.09,1],{sides:7,caps:!1})}const z=H(1);return t.quad(e(0,-.5,12.6),e(0,-.5,15.3),e(0,z-.9,14.7),e(0,z-.9,12.6),s.hull,[d.planks,9,.42],{double:!0,u0:0}),t.tube(e(0,.2,12.75),e(0,z+1.5,12.75),.16,.14,s.log,[d.none],{sides:6}),t.beam(e(0,z+1.3,12.75),e(.4,z+.9,9),.14,.16,s.timber),t.tube(e(2.1,z+1.5,9.5),e(3.4,-.3,16.5),.08,.06,s.timber,[d.none],{sides:5}),t.quad(e(3.3,.6,15.9),e(3.45,-.5,16.6),e(3.75,-.4,16.5),e(3.55,.7,15.8),s.timber,[d.none],{double:!0}),t.build()}function R0(o,s){const t=ze(o),S=K.mastLen;for(const B of[-1,1])t.tube(e(B*.55,0,0),e(B*.1,S,0),.19,.11,s.log,[d.planks,9,.5],{sides:7,capCol:s.endGrain});for(let B=1;B<=6;B++){const r=B/7*S,i=.55-.45*(B/7)+.2;t.beam(e(-i,r,0),e(i,r,0),.1,.12,s.timber)}t.box(0,S-.5,0,.6,.7,.36,s.beam,[d.none],{bottom:!0}),t.tube(e(0,S-1.6,0),e(0,S-1,0),.26,.26,s.rope,[d.rope,.12,1],{sides:7,caps:!1}),t.box(0,-.9,0,.5,1.2,.3,s.beam,[d.none],{bottom:!0});let E=0;t.setRng(()=>E++*.618034%1);for(const B of[2,4,6])for(const r of[-1,1]){const i=B/7*S,n=i/S,x=r*(.55-.45*n),y=.19-.08*n+.05,u=-r*.45*.25/S;t.tube(e(x-u,i-.25,0),e(x+u,i+.25,0),y,y,s.rope,[d.rope,.11,1],{sides:7,caps:!1})}return t.build()}const D0=[[1.6,1.75,-10.6,.15],[-1.5,1.75,-9.6,-.15],[.9,1.6,-6.4,0],[-1.2,1.6,-4.2,0],[1.9,1.6,-.6,0],[.5,3.85,6.5,0],[1.9,3.1,10.6,0]];function Qe(o,s){const t=new Float32Array(o*2*3),S=new Float32Array(o*2*3),E=new Float32Array(o*2),B=[];for(let u=0;u<o;u++)E[u*2]=-1,E[u*2+1]=1;const r=new v.BufferGeometry;r.setAttribute("position",new v.BufferAttribute(t,3).setUsage(v.DynamicDrawUsage)),r.setAttribute("aDir",new v.BufferAttribute(S,3).setUsage(v.DynamicDrawUsage));const i=new v.BufferAttribute(E,1).setUsage(v.DynamicDrawUsage);r.setAttribute("aSide",i);for(let u=0;u<o-1;u++)B.push(u*2,u*2+1,u*2+2,u*2+1,u*2+3,u*2+2);const n=new v.Uint16BufferAttribute(B,1);r.setIndex(n);const x=new v.Mesh(r,s);x.frustumCulled=!1;let y=0;return{mesh:x,begin(){y=0},line(u,a=1){if(!(y+u.length+2>o))for(let h=-1;h<=u.length;h++){const m=Math.min(u.length-1,Math.max(0,h)),F=u[m],I=u[Math.max(0,m-1)],_=u[Math.min(u.length-1,m+1)],P=h<0||h>=u.length?0:1;let z=_.x-I.x,c=_.y-I.y,l=_.z-I.z;const b=Math.hypot(z,c,l)||1;z/=b,c/=b,l/=b;for(let A=0;A<2;A++){const p=(y*2+A)*3;t[p]=F.x,t[p+1]=F.y,t[p+2]=F.z,S[p]=z*P,S[p+1]=c*P,S[p+2]=l*P}E[y*2]=-a,E[y*2+1]=a,y++}},end(){for(let u=y*6;u<t.length;u++)t[u]=0,S[u]=0;r.attributes.position.needsUpdate=!0,r.attributes.aDir.needsUpdate=!0,i.needsUpdate=!0}}}function x0(o,s){const t=o.length,S=new Float32Array(t*4),E=new Float32Array(t*4),B=new Float32Array(t*3);o.forEach((n,x)=>{S.set([n.x,n.y||0,n.z,n.ph],x*4),E.set([n.kind,n.h,n.lean||0,n.hat?1:0],x*4),B.set([n.col.r,n.col.g,n.col.b],x*3)});const r=new v.InstancedBufferGeometry;r.setAttribute("position",new v.Float32BufferAttribute([-.5,0,0,.5,0,0,.5,1,0,-.5,1,0],3)),r.setIndex([0,1,2,0,2,3]),r.setAttribute("aHome",new v.InstancedBufferAttribute(S,4)),r.setAttribute("aInfo",new v.InstancedBufferAttribute(E,4)),r.setAttribute("aCol",new v.InstancedBufferAttribute(B,3)),r.instanceCount=t;const i=new v.Mesh(r,s);return i.frustumCulled=!1,i}const W0=`
  varying vec3 vP; varying vec3 vW;
  #include <fog_pars_vertex>
  void main() {
    vP = position;
    vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz;
    vec4 mvPosition = viewMatrix * wp;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`,Y0=`
  uniform vec3 uInk, uSilk, uPale, uGrey, uSeal; uniform float uLinePx, uTime; uniform vec4 uBarge; uniform vec4 uSealAt;
  varying vec3 vP; varying vec3 vW;
  #include <fog_pars_fragment>
  ${Fe}
  float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }
  void main() {
    vec2 p = vP.xz; float px = uLinePx;
    float gx = max(length(vec2(dFdx(p.x), dFdy(p.x))), 1e-6), gz = max(length(vec2(dFdx(p.y), dFdy(p.y))), 1e-6);
    float fwp = max(gx, gz);
    vec2 pdx = dFdx(p), pdy = dFdy(p);
    float rad = length(p);
    vec3 col = uSilk;
    // foxing, long creases, pale repair patches, weave
    float fox = smoothstep(0.58, 0.86, vnoise(p * 0.045 + 3.0) * 0.7 + vnoise(p * 0.13) * 0.3);
    col = mix(col, uSilk * 0.9, fox * 0.55);
    vec2 pc = floor((p + vec2(37.0, 11.0)) / vec2(64.0, 46.0));
    vec2 pf = fract((p + vec2(37.0, 11.0)) / vec2(64.0, 46.0));
    float mend = step(0.72, h21(pc)) * step(0.2, pf.x) * step(pf.x, 0.55) * step(0.3, pf.y) * step(pf.y, 0.62);
    col = mix(col, mix(uSilk, uPale, 0.4), mend * 0.28);
    float crease = 1.0 - smoothstep(0.0, 0.5 + fwp, abs(fract((p.x * 0.22 + p.y) / 190.0 + 0.3) - 0.5) * 190.0);
    col = mix(col, uSilk * 0.86, crease * 0.5);
    float wv = (1.0 - smoothstep(0.012, 0.035, fwp)) * sin(p.x * 52.0) * sin(p.y * 52.0);
    col *= 1.0 + 0.035 * wv;
    float line = 0.0;
    float fade = 1.0 - smoothstep(95.0, 150.0, rad);
    if (vP.y < 1.0) {
      // the river: long ruled flow lines sliding downstream (-z), pinched and quickened under the bridge
      float pinch = exp(-p.y * p.y / 420.0);
      float cx = p.x * (1.0 + 0.14 * pinch) + 0.7 * sin(p.y * 0.043 + 1.3) + 0.3 * sin(p.y * 0.11);
      // the barge parts the lines
      vec2 bd = p - uBarge.xz; float bw = exp(-bd.x * bd.x / 30.0) * (1.0 - smoothstep(10.0, 22.0, abs(bd.y)));
      cx += sign(bd.x + 1e-4) * 1.6 * bw * (1.0 - smoothstep(0.0, 4.0, abs(bd.x)) * 0.5);
      float period = 2.7, lid = floor(cx / period), hh = h11(lid);
      float len = 38.0 + 30.0 * hh;
      float seg = fract((p.y + uTime * (3.0 + 1.6 * hh)) / len + hh * 9.0);
      float on = smoothstep(0.0, 0.02, seg) * (1.0 - smoothstep(0.42 + 0.3 * h11(lid + 5.0), 0.46 + 0.3 * h11(lid + 5.0), seg)) * step(0.42, h11(lid + 17.0));
      float fwc = max(length(vec2(dFdx(cx), dFdy(cx))), 1e-6);
      float water = 1.0 - smoothstep(21.0, 21.6, abs(p.x));
      line = ruled(cx, period, fwc, px * 0.85) * on * water * fade * (1.0 - 0.9 * bw);
      // whorls: ruled arcs turning in the lee of the pier noses and astern of the barge
      float c4 = cos(uBarge.w), s4 = sin(uBarge.w);
      for (int i = 0; i < 6; i++) {
        vec2 q = i == 0 ? vec2(-18.2, -10.6) : i == 1 ? vec2(18.2, -10.6) : i == 2 ? vec2(-18.4, 10.4) : i == 3 ? vec2(18.4, 10.4)
               : uBarge.xz + vec2(c4 * (i == 4 ? -2.2 : 2.2) + s4 * 14.5, c4 * 14.5 - s4 * (i == 4 ? -2.2 : 2.2));
        vec2 d = p - q; float r = length(d) + 1e-4;
        float ang = atan(d.y, d.x + 1e-5) + uTime * (i < 2 ? 0.7 : -0.6) * (mod(float(i), 2.0) < 0.5 ? 1.0 : -1.0) + r * 1.1;
        float arc = smoothstep(0.1, 0.5, sin(ang)) * (1.0 - smoothstep(2.2, 3.1, r)) * smoothstep(0.25, 0.5, r);
        vec2 dn = d / r; float fr = max(length(vec2(dot(pdx, dn), dot(pdy, dn))), 1e-6);
        line = max(line, ruled(r, 0.62, fr, px) * arc * water);
      }
    } else {
      // bank tops: one ruled edge where the embankment meets the water
      line = inkLine(abs(abs(p.x) - 22.0), gx, px * 1.2) * step(21.0, abs(p.y)) * step(2.9, vP.y) * fade;
    }
    col = mix(col, uInk, clamp(line, 0.0, 1.0));
    // a collector's seal stamped flat: square, abstract fret, four-fold symmetric, uneven ink
    vec2 sq = (p - uSealAt.xy) / uSealAt.z; float cs = cos(uSealAt.w), sn = sin(uSealAt.w);
    sq = vec2(cs * sq.x - sn * sq.y, sn * sq.x + cs * sq.y);
    vec2 aq = abs(sq); float dd = max(aq.x, aq.y), mn = min(aq.x, aq.y);
    float fs = fwp / uSealAt.z;
    float ink = smoothstep(0.80 - fs, 0.80 + fs, dd);                                                 // border
    ink = max(ink, smoothstep(0.50 - fs, 0.50 + fs, dd) * (1.0 - smoothstep(0.64 - fs, 0.64 + fs, dd)) * smoothstep(0.10 - fs, 0.10 + fs, mn));
    ink = max(ink, smoothstep(0.22 - fs, 0.22 + fs, dd) * (1.0 - smoothstep(0.36 - fs, 0.36 + fs, dd)) * smoothstep(0.07 - fs, 0.07 + fs, abs(aq.x - aq.y)));
    ink = max(ink, (1.0 - smoothstep(0.08 - fs, 0.08 + fs, dd)));
    ink = max(ink, (1.0 - smoothstep(0.045 - fs, 0.045 + fs, mn)) * smoothstep(0.36, 0.38, dd) * (1.0 - smoothstep(0.5, 0.52, dd)));
    ink *= 1.0 - smoothstep(1.0 - fs, 1.0 + fs, dd);
    float press = 0.72 + 0.28 * smoothstep(0.25, 0.6, vnoise(p * 2.3 + 9.0));
    col = mix(col, uSeal, ink * press);
    gl_FragColor = vec4(col, 1.0);
    #include <fog_fragment>
  }
`;function N0(o){const s=[],t=[];let S=0;const E=(n,x,y,u,a)=>{s.push(n,a,x,y,a,x,y,a,u,n,a,u),t.push(S,S+2,S+1,S,S+3,S+2),S+=4},B=700;E(-22,-B,22,B,0);for(const n of[-1,1]){E(n>0?22:-B,-B,n>0?B:-22,B,O-.004);const x=n*22,y=S;s.push(x,-1,-B,x,-1,B,x,O,B,x,O,-B),n>0?t.push(y,y+1,y+2,y,y+2,y+3):t.push(y,y+2,y+1,y,y+3,y+2),S+=4}const r=new v.BufferGeometry;r.setAttribute("position",new v.Float32BufferAttribute(s,3)),r.setIndex(t);const i=new v.Mesh(r,o);return i.frustumCulled=!1,i.renderOrder=-.5,i}const je=o=>o<.5?2.2*(1-ae(0,.5,o)):-4*ae(.5,1,o),He=o=>{const s=je(o+.01)-je(o-.01),t=-107*.02;return{position:new v.Vector3(je(o),0,62-107*o),yaw:Math.atan2(-s,-t)}},ke=Math.PI/180,Xe=o=>{const s=(S,E)=>{const B=Math.min(1,Math.max(0,(o-S)/(E-S)));return B*B*(1+.12*Math.sin(Math.min(1,Math.max(0,(o-E)/.02))*Math.PI))};let t=86-24*Math.min(1.06,s(.03,.082))-22*Math.min(1.06,s(.11,.16))-18*Math.min(1.06,s(.19,.243));return t-=20*ae(.8,.95,o),t*ke},v0=o=>(13*ae(.03,.245,o)+17*ae(.8,.95,o))*ke;async function X0(o,s={}){const t=o.rng,S=o.quality?.detail??1,E=(s.palette&&s.palette.length>=7?s.palette:B0).map(f=>new v.Color(f)),[B,r,i,n,x,y,u]=E,a=(f,V,j)=>f.clone().lerp(V,j),h=(f,V)=>({lit:f,shade:V}),m=s.minerals||{},F=new v.Color(m.mal||"#3F8F74"),I=new v.Color(m.azu||"#2E5E94"),_=new v.Color(m.gold||"#C9A227"),P={red:h(u.clone(),a(u,i,.22)),blue:h(I.clone(),a(I,i,.25)),green:h(F.clone(),a(F,i,.25)),gold:h(_.clone(),a(_,x,.4)),log:h(a(r,x,.25),a(n,B,.15)),endGrain:r.clone(),beam:h(a(x,B,.15),a(n,i,.2)),timber:h(a(r,x,.45),a(n,B,.2)),rope:h(r.clone(),a(x,n,.4)),deck:h(a(r,B,.2),a(n,B,.4)),under:h(a(n,B,.35),a(n,B,.35)),rail:h(a(r,B,.3),a(r,B,.3)),stone:h(r.clone(),a(n,r,.2)),stoneTop:h(r.clone(),r.clone()),cloth:h(r.clone(),a(r,n,.45)),oiled:h(x.clone(),a(x,n,.5)),greyCloth:h(a(n,r,.35),n.clone()),mat:h(a(x,B,.4),a(n,B,.35)),charcoal:h(a(n,i,.35),a(n,i,.5)),hull:h(a(x,r,.3),a(n,B,.1))};if(s.snow&&(P.deck=h(r.clone(),a(r,n,.2)),P.mat=h(r.clone(),a(r,n,.3)),P.stoneTop=h(r.clone(),r.clone())),s.litShift)for(const f in P)P[f].lit&&(P[f]=h(a(P[f].lit,n,s.litShift),P[f].shade));P.under.under=P.under.shade.clone().lerp(d0,.6);const z=new v.Group;z.name="rainbow-bridge";const c={mooring:[]},l={uInk:{value:i},uSilk:{value:B},uPale:{value:r},uGrey:{value:n},uSeal:{value:u},uGold:{value:_.clone()},uAzur:{value:I},uMal:{value:F},uLinePx:{value:s.linePx??1.9},uTime:{value:0},uSurge:{value:0},uProgress:{value:0},uFade:{value:new v.Vector2(s.fadeNear??160,s.fadeFar??220)},uBarge:{value:new v.Vector4(0,0,400,0)},uRes:{value:new v.Vector2(1280,720)},uMist:{value:new v.Vector4(0,0,45,95)},uMistBand:{value:new v.Vector4(.56,.9,5,15)},uClip:{value:new v.Vector4(0,0,0,0)},uRipple:{value:new v.Vector3(0,0,30)},uSealAt:{value:new v.Vector4(-12.5,31+t.range(-3,6),1.7,t.range(-.2,.2))}},b=(f,V,j={})=>new v.ShaderMaterial({uniforms:{...v.UniformsUtils.clone(v.UniformsLib.fog),...l},vertexShader:f,fragmentShader:V,fog:!0,...j}),A=b(F0,T0),p=b(U0,p0,{side:v.DoubleSide}),w=b(h0,m0,{side:v.DoubleSide}),g=ze(t),k=[],C=async()=>{await o.yield?.()};await C(),await I0(g,t,P,C),await C(),_0(g,t,P),await o.yield?.(),E0(g,t,P,s,c),await o.yield?.(),await L0(g,t,P,k,s.parasols??40,C),await C();const T=[],q={festoon:t.chance(.5),drapes:t.int(5,11)};Q0(g,t,P,c,T,q),await o.yield?.();const M=new v.Mesh(await g.buildAsync(C),A);M.name="bridge",z.add(M),await o.yield?.();const U=s.barge!==!1,L=M0(t,P);await o.yield?.();const Z=R0(t,P),G=new v.Group,Y=new v.Mesh(Z,A);G.add(new v.Mesh(L,A),Y),Y.position.set(0,K.mastY,K.mastZ),Y.rotation.order="YXZ";const N=ze(()=>.5);N.beam(e(-.2,0,0),e(1,0,0),.08,.08,P.timber,[d.none],{u0:1}),N.setAnim(.45,0,0,2);for(let f=0;f<3;f++)N.quad(e(.8,-.06-f*.75,0),e(.8,-.06-(f+1)*.75,0),e(.1,-.06-(f+1)*.75,0),e(.1,-.06-f*.75,0),P.red,[d.stripes,.5,2],{double:!0,u0:f*.75,col:P.red.lit,edges:[f===0?1:0,0,1,1]});N.quad(e(.1,-2.31,0),e(.1,-3,0),e(.3,-2.62,0),e(.45,-2.31,0),P.red,[d.none],{double:!0,col:P.red.lit}),N.quad(e(.45,-2.31,0),e(.6,-2.62,0),e(.8,-3,0),e(.8,-2.31,0),P.red,[d.none],{double:!0,col:P.red.lit}),N.setAnim(0,0,0,0);const Q=new v.Mesh(N.build(),A);Q.name="pennant",G.add(Q),G.visible=U,z.add(G);const W=t.chance(.5)?1:-1,J=new v.Group,Ue=new v.Mesh(Z,A);J.add(new v.Mesh(L,A),Ue),Ue.position.set(0,K.mastY,K.mastZ),Ue.rotation.set(-.06,0,.02),J.position.set(W*t.range(11.5,13.5),0,t.range(37,43)),l.uSealAt.value.x=-W*t.range(11,14),J.rotation.y=-W*t.range(.34,.5),z.add(J);const ce=new v.Mesh(L,A);ce.scale.set(.42,.5,.36),ce.position.set(-W*20.2,-.1,-15.5-t.range(0,3)),ce.rotation.y=t.range(-.08,.08)+Math.PI,z.add(ce),J.updateMatrix(),ce.updateMatrix(),await o.yield?.();const Ie=[r,a(r,x,.6),x,a(n,r,.45),n,a(B,r,.4),a(y,r,.2),a(n,i,.35),I.clone(),a(I,r,.3),F.clone(),u.clone()],Oe=[3,4,4,4,4,3,1,2,4,4,3,4],g0=Oe.reduce((f,V)=>f+V,0),y0=()=>{let f=t()*g0;for(let V=0;V<Ie.length;V++)if(f-=Oe[V],f<=0)return Ie[V];return Ie[0]};for(let f=0;f<300;f++)k.push({x:t.range(-26,26),z:6.45+t.range(-.1,.1),kind:1,lean:t.range(.6,.95)});for(let f=0;f<Math.round(240*S);f++)k.push({x:t.range(-29,29),z:t.range(-2.7,2.7),kind:0});for(let f=0;f<46;f++){const V=t.range(-25,25);k.push({x:V,y:D(V),z:-6.45+t.range(-.1,.1),kind:2,lean:-t.range(.5,.8)})}for(let f=0;f<Math.round(44*S);f++){const V=t.chance(.5)?1:-1,j=t.chance(.7)?1:-1;k.push({x:V*t.range(23.6,26.5),y:O,z:j*t.range(10,21.5),kind:2,lean:0,hat:t.chance(.3)})}for(const f of D0){U&&f[2]>-7&&k.push({x:f[0],y:f[1],z:f[2],kind:3,lean:f[3],hat:!0});const V=e(f[0],f[1],f[2]).applyMatrix4(J.matrix);k.push({x:V.x,y:V.y,z:V.z,kind:2,lean:0,hat:!0})}for(const f of k)f.ph=t()*Math.PI*2,f.h=f.h||t.range(2.35,2.85),f.col=f.col||y0(),f.hat===void 0&&(f.hat=t.chance(.22));await o.yield?.();const Ze=x0(k,p);Ze.name="crowd",z.add(Ze),await o.yield?.();const te=Qe(640,w);te.mesh.name="ropes",z.add(te.mesh);const w0=new v.ShaderMaterial({uniforms:{...w.uniforms,uInk:{value:a(x,r,.55)}},vertexShader:h0,fragmentShader:m0,fog:!0,side:v.DoubleSide}),he=Qe(32,w0);he.mesh.name="thrown-rope",he.mesh.renderOrder=1,z.add(he.mesh);const Ae=e(t.range(-2.5,-.5),D(1.5)+1.6,7.05),$e=k.filter(f=>f.kind===2&&f.lean).slice(0,12).filter((f,V)=>V%4===1).map(f=>e(f.x+.5,f.y+1.75,f.z-Math.sign(f.z)*1.2)),_e=[];for(let f=0;f<16;f++)_e.push([t.range(-9,9),t.range(-6.5,6.5),t(),t.range(.25,.5)]);const Ke=c.mooring.reduce((f,V)=>V.distanceTo(J.position)<f.distanceTo(J.position)?V:f,c.mooring[0]),Je=c.mooring.reduce((f,V)=>V.distanceTo(ce.position)<f.distanceTo(ce.position)?V:f,c.mooring[0]);let Ee=null;s.underlay!==!1&&(Ee=N0(b(W0,Y0)),Ee.name="silk",z.add(Ee));let Le=s.progress??null,Ge=null,e0=null,t0=0,ue=null,Pe=!0,o0=0;const fe=K.mastLen,Se=new v.Vector2,z0=l.uLinePx.value,n0=Te.clone(),k0=e(-2.65,H(.05)+.25,.6),A0=e(2.65,H(.05)+.25,.6),s0=e(0,3.5,K.mastZ+.7),a0=f=>e(0,f,0).applyMatrix4(Y.matrix),i0=(f,V)=>{Y.rotation.set(-(Math.PI/2-f),V,0),Y.updateMatrix()};i0(86*ke,0);const r0=a0(fe-1.3).distanceTo(n0)+.05,P0=a0(fe-.5).distanceTo(s0)+.4,Me=[],ie=[],Be=[],l0=[];let qe=0;const $=(f,V,j)=>{const ee=l0[qe]||(l0[qe]=new v.Vector3);return qe++,ee.set(f,V,j)},me=(f,V,j,ee=9)=>{const ge=f.distanceTo(V),Ve=Math.min(4.5,Math.sqrt(Math.max(0,(j-ge)*ge*.375)),Math.max(.15,(f.y+V.y)/2-.45));Me.length=0;for(let xe=0;xe<=ee;xe++){const R=xe/ee;Me.push($(f.x+(V.x-f.x)*R,f.y+(V.y-f.y)*R-4*Ve*R*(1-R),f.z+(V.z-f.z)*R))}return Me},u0=e(0,H(-1)+.4,-12.4).applyMatrix4(J.matrix),c0=e(0,H(-1)+.4,-12.4).applyMatrix4(ce.matrix);function f0(f,V){t0=f,l.uTime.value=V,l.uProgress.value=f,l.uSurge.value=ae(.15,.5,f)*(1-.55*ae(.64,.84,f));let j;if(ue)G.position.set(ue.x,0,ue.z),j=ue.yaw;else{const R=He(f);G.position.copy(R.position),j=R.yaw}G.position.y=.06*Math.sin(V*.8)-o0,G.rotation.set(.014*Math.sin(V*.9+1),j,.01*Math.sin(V*.6)),G.updateMatrix(),G.visible=U&&Pe,i0(Ge??Xe(f),e0??v0(f)),Q.position.set(0,fe+.12,0).applyMatrix4(Y.matrix),Q.scale.y=Math.min(1,Math.max(.16,(Q.position.y-2.2)/3.2)),l.uBarge.value.set(G.position.x,Pe?G.position.y:-500,U?G.position.z:400,j),J.rotation.z=.012*Math.sin(V*.5+2),J.rotation.x=.008*Math.sin(V*.7),ce.rotation.z=.03*Math.sin(V*.9),qe=0,te.begin();const ee=R=>R.applyMatrix4(G.matrix);if(U&&Pe){const R=ee($(0,fe-1.3,0).applyMatrix4(Y.matrix)),X=ee($(0,fe-.5,0).applyMatrix4(Y.matrix)),re=Ge??Xe(f),oe=1-ae(44*ke,66*ke,re),ne=ee($(0,0,0).copy(n0).lerp($(.3,1.2,0).applyMatrix4(Y.matrix),oe));te.line(me(R,ne,r0+(R.distanceTo(ne)+.05-r0)*oe)),te.line(me(R,ee($(0,0,0).copy(k0)),0)),te.line(me(R,ee($(0,0,0).copy(A0)),0)),te.line(me(X,ee($(0,0,0).copy(s0)),P0,7));const se=ae(.36,.44,f)*(1-ae(.62,.7,f));if(se>.01)for(let le=-1;le<=1;le+=2){const ye=(V*.22+(le>0?.5:0))%1,ve=$(le*1.75,3,-10.4),we=$(le*2.3,2.3,-3).lerp($(le*6.6,-.4+2.2*ae(.8,1,ye),-15.5+7*ye),se),S0=$(0,0,0).copy(ve).sub(we).multiplyScalar(.28).add(ve);ie.length=0,ie.push(ee(S0),ee(ve),ee(we)),te.line(ie,2)}}const ge=ae(.2,.4,f),Ve=ae(.74,.95,f),xe=10.5*ge*(1-.85*Ve);if(he.begin(),xe>.05){ie.length=0,Be.length=0;let R=0,X=0,re=0;for(let ne=0;ne<=15;ne++){const se=ne/15,le=.6*(1-ge)*se+.12*se;R=Ae.x+Math.sin(se*9+V*1.6)*le+.25*Math.sin(V*.8)*se*se,X=Ae.y-se*xe,re=Ae.z+.25+Math.cos(se*9+V*1.6)*le+1.1*se*(1-.5*se),ie.push($(R,X,re)),Be.push($(R,X,re+.12))}const oe=.5*(1-.6*Ve)*(1-.45*ae(.4,.5,f));for(let ne=1;ne<=11;ne++){const se=ne*.86+V*1.2,le=oe*(1-.035*ne),ye=R+Math.sin(se)*le,ve=X-oe+Math.cos(se)*le,we=re+.02*ne;ie.push($(ye,ve,we)),Be.push($(ye,ve,we+.12))}te.line(ie,3.5),he.line(Be,2.3)}he.end(),te.line(me(u0,Ke,u0.distanceTo(Ke)+1.2+.4*Math.sin(V*.5))),te.line(me(c0,Je,c0.distanceTo(Je)+.5));for(let R=0;R<T.length;R++)te.line(T[R]);for(let R=0;R<$e.length;R++)for(let X=0;X<3;X++){const re=$e[R];ie.length=0;for(let oe=0;oe<=8;oe++){const ne=oe*.75-V*1.4+X*2.1+R;ie.push($(re.x+(X-1)*.22+Math.sin(ne)*.05*oe,re.y+oe*.3,re.z+Math.cos(ne*.8)*.05*oe))}te.line(ie)}for(let R=0;R<_e.length;R++){const X=_e[R],re=(V*X[3]*.6+X[2])%1,oe=D(X[0])-.5-re*3.4;ie.length=0,ie.push($(X[0],oe,X[1]),$(X[0],oe-.3-.3*X[2],X[1])),te.line(ie)}te.end()}await o.yield?.(),f0(Le??.34,12),await o.yield?.();const be=f=>D(f)+1.55;return Object.assign(c,{flyThrough:[[2.2,70],[1.9,50],[1.1,28],[.3,12],[0,0],[-.4,-12],[-1.6,-30],[-3.3,-48],[-4,-64]].map(([f,V])=>e(f,4.2,V)),portalSeat:{position:e(0,7.5,-60),normal:e(0,0,1),radius:7},sealSight:{eye:e(0,4.2,46),through:e(0,8.2,7),target:e(0,26,-168)},viewpoints:{approach:e(2,4.2,62),mastFrame:e(1.5,4.2,34),under:e(0,4.2,3),deck:e(-6,13.5,.5),downstream:e(-4,4.2,-40)},crown:e(0,11,0),soffit:e(0,9,0),firstBeam:e(0,9,Ye[3]),beamsZ:Ye.slice().reverse(),railUp:[e(-26,be(26),6.92),e(0,be(0),6.92),e(26,be(26),6.92)],railDown:[e(-26,be(26),-6.92),e(0,be(0),-6.92),e(26,be(26),-6.92)],ropeFrom:Ae,abutments:[e(-19.2,0,0),e(19.2,0,0)],bargeAt:He,progressAt:f=>(62-f)/107,deckY:D,mastHeadAt:f=>{const V=He(f),j=Xe(f),ee=v0(f)+V.yaw;return e(V.position.x-Math.sin(ee)*Math.cos(j)*fe,K.mastY+Math.sin(j)*fe,V.position.z+K.mastZ-Math.cos(ee)*Math.cos(j)*fe)}}),{object:z,radius:30,height:18.5,center:e(0,6.5,0),anchors:c,ground:!1,groundY:0,barge:{object:G,mast:Y,crutch:K.crutch.clone(),eye:e(2,4.2,-8.5)},uniforms:l,mats:{ink:A,dab:p,rib:w},tones:P,geo:{hull:L,mast:Z},setBargePose(f,V,j){f===null?ue=null:(ue=ue||{x:0,z:0,yaw:0},ue.x=f,ue.z=V,ue.yaw=j)},setCarried(f){Pe=!!f},setSink(f){o0=f||0},setProgress(f){Le=Math.min(1,Math.max(0,f))},setMast(f,V=null){Ge=f,e0=V},get progress(){return t0},update(f,V,j){o.renderer?.getDrawingBufferSize&&(o.renderer.getDrawingBufferSize(Se),Se.y>0&&(l.uRes.value.copy(Se),l.uLinePx.value=z0*Math.min(2.2,Math.max(.85,Se.y/720)))),f0(Le??(V/40+.04)%1,V)},dispose(){}}}function Q0(o,s,t,S,E,B){for(let r=0;r<B.drapes;r++){const i=s.chance(.5)?1:-1,n=s.range(-24,24),x=s.range(1,1.9),y=s.range(.9,1.5),u=i*7.06,a=D(n)+1.56,h=D(n+x)+1.56,m=s.chance(.5);o.setAnim(n+x/2,(a+h)/2,u,2),o.quad(e(n,a-y,u),e(n+x,h-y,u),e(n+x,h,u),e(n,a,u),t.cloth,m?[d.stripes,.24,1]:[d.none],{double:!0,u0:0,col:s.chance(.5)?t.cloth.lit:r%2?t.red.lit:t.blue.lit}),o.setAnim(0,0,0,0)}for(const r of[-1,1]){const i=s.chance(.5)?1:-1,n=r*19.05,x=i*s.range(3,6);for(const y of[-.42,.42])o.beam(e(n-r*.55,-.3,x+y),e(n+r*.75,O+.9,x+y),.1,.12,t.timber,[d.none]);for(let y=0;y<7;y++){const u=(y+.7)/7.6;o.beam(e(n-r*.55+r*1.3*u,-.3+(O+1.2)*u,x-.42),e(n-r*.55+r*1.3*u,-.3+(O+1.2)*u,x+.42),.07,.07,t.timber,[d.none],{noEnds:!0})}for(let y=0;y<2;y++){const u=s.range(-8,8),a=s.range(1.1,2.1),h=r*(19.2+.55*(a+.8)/3.8)-r*.22;o.tube(e(h-r*.12,a,u),e(h+r*.12,a,u),.5,.5,t.rope,[d.rope,.14,1],{sides:10,capCol:t.rope.shade}),E.push([e(h,a+.45,u),e(r*19.8,O+.2,u)])}}for(const r of Ne)for(const i of[-1,1]){if(!s.chance(.42))continue;const n=b0(r),x=i*7.85,y=s.range(1,2.2);E.push([e(r,n-.2,x),e(r,n-y,x)]),o.setAnim(r,n,x,2),o.tube(e(r,n-y-.7,x),e(r,n-y,x),.24,.36,t.mat,[d.weave,.12,.12],{sides:7,capCol:t.cloth.shade}),o.setAnim(0,0,0,0)}o.setRng(()=>.37);for(const[r,i,n,x]of[[-4.6,-5.25,1.5,0],[-1.4,-5.25,2.1,1],[5.4,-5.25,1.7,0],[7.2,-5.25,1.1,2],[-6.2,-1.75,1.2,2],[4.3,-1.75,1.6,1]])E.push([e(r,9,i),e(r,9-n,i)]),o.setAnim(r,9,i,2),x===0?o.tube(e(r,9-n-.7,i),e(r,9-n,i),.24,.36,t.mat,[d.weave,.12,.12],{sides:7,capCol:t.cloth.shade}):x===1?(o.tube(e(r,9-n-1,i),e(r,9-n-.5,i),.12,.34,t.mat,[d.weave,.1,.1],{sides:7,capCol:t.cloth.shade}),o.tube(e(r,9-n-.5,i),e(r,9-n,i),.34,.1,t.mat,[d.weave,.1,.1],{sides:7,capCol:t.cloth.shade})):o.tube(e(r-.09,9-n-.42,i),e(r+.09,9-n-.42,i),.42,.42,t.rope,[d.rope,.13,1],{sides:10,capCol:t.rope.shade}),o.setAnim(0,0,0,0);if(B.festoon&&S.vanePoles)for(let r=0;r+1<S.vanePoles.length;r+=2){const i=S.vanePoles[r].top.clone().lerp(S.vanePoles[r].base,.42),n=S.vanePoles[r+1].top.clone().lerp(S.vanePoles[r+1].base,.42),x=13,y=[];for(let u=0;u<=x;u++){const a=u/x;y.push(e(i.x+(n.x-i.x)*a,i.y+(n.y-i.y)*a-5.2*a*(1-a),i.z+(n.z-i.z)*a))}E.push(y);for(let u=1;u<x;u++){const a=y[u],h=.42,m=s.range(1,1.5);o.setAnim(a.x,a.y,a.z,2),o.quad(e(a.x,a.y-m,a.z-.06),e(a.x,a.y-m,a.z+.06),e(a.x,a.y,a.z+h),e(a.x,a.y,a.z-h),t.cloth,[d.none],{double:!0,col:[t.cloth.lit,t.blue.lit,t.red.lit,t.gold.lit][u%4]}),o.setAnim(0,0,0,0)}}}export{p0 as DAB_FRAG,Fe as GLSL_COMMON,De as GLSL_MIST,We as GLSL_RIPPLE,d as PAT,x0 as buildCrowd,X0 as buildHero,ze as makeAcc,Qe as makeRibbons};
