import*as k from"three";const J="#FBFAF2",Q="#17171C",Y=["#FBFAF2","#E9362B","#F6902A","#F8DD3A","#57BA46","#24B9B6","#2D55CC","#F272AB","#7C4ABB"],ae={none:0,scarlet:1,orange:2,lemon:3,green:4,turquoise:5,blue:6,pink:7,violet:8},oe={plain:0,sea:1,ring:2,flame:3,cloud:4,flag:5,sun:6,ground:7},C={place:0,clock:1,full:2,boat:3},l=.42,y=.16,$=`
attribute vec3 aUV; attribute vec3 aSize; attribute vec4 aInk; attribute vec4 aFill; attribute vec4 aEdge;
#ifdef INST
attribute vec4 aInst;
#endif
uniform float uS, uTime, uStroke;
varying vec3 vUV; varying vec3 vSize; varying vec4 vInk; varying vec4 vEdge; varying float vProg; varying vec3 vWorld; varying float vPerm; varying vec3 vStk;
void main() {
  vec3 p = position; float kind = aSize.z;
  float fu = aUV.x / max(aUV.z, 1e-4);
  if (kind == 5.) p += normal * sin(uTime * 5.5 - fu * 5. + aInk.w * 40.) * .08 * aSize.x * fu;      // a flag in the wind: still at its u0 side
  float ip = 0.; vPerm = 0.;
#ifdef INST
  ip = aInst.x; vPerm = aInst.y;
#endif
  float m = aFill.w, prog;
  if (m < .5) prog = clamp((uS - aFill.x) / max(aFill.y, .001), 0., 1.);
  else if (m < 1.5) prog = .62 + .38 * smoothstep(0., .6, fract(uTime / max(aFill.y, .001) + aFill.x));
  else if (m < 2.5) prog = 1.;
  else prog = clamp((ip - aFill.x) / max(aFill.y, .001), 0., 1.);
  vProg = prog * aFill.z; vUV = aUV; vSize = aSize; vInk = aInk; vEdge = aEdge;
  // the strokes of this cell: how many fit across it, its width across them, its length along them (a broader pen for the wake; the sea and the sand do not read it)
  float a = aInk.z, sw = uStroke * (kind == 2. ? 1.6 : 1.);
  float across = abs(sin(a)) * aSize.x + abs(cos(a)) * aSize.y, along = abs(cos(a)) * aSize.x + abs(sin(a)) * aSize.y;
  vStk = vec3(max(2., floor(across / sw + .5)), across, along);
#ifdef INST
  vec4 w = modelMatrix * instanceMatrix * vec4(p, 1.);
#else
  vec4 w = modelMatrix * vec4(p, 1.);
#endif
  vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w;
}`,ee=`
uniform vec3 uPens[9]; uniform vec3 uPaper, uLine; uniform float uTime, uS; uniform vec4 uRing, uBox; uniform vec3 uLead; uniform sampler2D uRoute;
varying vec3 vUV; varying vec3 vSize; varying vec4 vInk; varying vec4 vEdge; varying float vProg; varying vec3 vWorld; varying float vPerm; varying vec3 vStk;
float hash(float n) { return fract(sin(n * 127.1 + 3.7) * 43758.5453); }
vec3 penCol(float k) { float pm = floor(vPerm + .5), i = k; if (pm > .5 && k > .5) i = mod(k - 1. + pm, 8.) + 1.; return max(uPens[int(clamp(i, 0., 8.) + .5)], vec3(.02)); }
// a tongue of flame's half width at the share v of its height (0 at its foot and at its tip)
float tongue(float v) { return pow(max(0., sin(3.14159265 * pow(clamp(v, 0., 1.), .55))), .9) * (1. - .3 * v); }
float edge(float d, float w) { float fw = max(fwidth(d) * .9, 1e-6); float h = max(w, fw); return w > 0. ? 1. - smoothstep(h - fw, h + fw, d) : 0.; }
void main() {
  float kind = floor(vSize.z + .5), pen = floor(vInk.x + .5), coatsN = floor(vInk.y + .5), seed = floor(vInk.w * 4096. + .5) / 4096.;
  vec4 rf = texture2D(uRoute, (vWorld.xz - uBox.xy) * uBox.zw);        // the route's field; read before any cut (the cut is made last)
  // u is carried as (u q, q): for a plain quad q is 1; for a tapering side of a drum q is the side's width at that
  // height over its mean width, so that lines of equal u run to the apex on both of the quad's triangles alike, and sx
  // is the side's true width there
  vec3 col = uPaper; vec2 uv = vec2(vUV.x / max(vUV.z, 1e-4), vUV.y); float sx = vSize.x * vUV.z, line = 0., lu = 0., lv = 0.; bool cut = false, pair = false;
  if (kind == 4.) {            // a cloud: four lobes on a flat foot, cut out of its quad with a gap of white left round it
    float asp = vSize.x / vSize.y, hw = asp * .5 - .34; vec2 q = vec2((uv.x - .5) * asp, uv.y - .3);
    float d = length(q - vec2(-.62 * hw, .0)) - .2;
    d = min(d, length(q - vec2(-.2 * hw, .14)) - .32); d = min(d, length(q - vec2(.24 * hw, .1)) - .28); d = min(d, length(q - vec2(.64 * hw, -.01)) - .19);
    d = max(d, -.17 - q.y);
    cut = d > .09; line = edge(abs(d) * vSize.y, max(vEdge.x, .001));
  } else if (kind == 6.) {     // the sun: a disc and its rays, cut out of its quad
    vec2 q = uv - .5; float r = length(q), a = atan(q.y, q.x), ray = abs(fract(a * 14. / 6.2831853) - .5);
    float dr = (ray - .16 * (1. - (r - .26) / .26)) * r * .4488;     // a ray's flank as a length (a fourteenth of the round at r)
    float d = min(r - .2, max(max(.26 - r, r - .47), dr)), w = max(vEdge.x, .001);
    cut = d > 0.; line = max(edge(abs(r - .2) * vSize.x, w), edge(abs(d) * vSize.x, w * .2));      // the rays in a line a fifth of the disc's
  } else if (kind == 3.) {     // a flame, wavering by the clock: three tongues one inside the other, three cells: scarlet, orange, a lemon core
    float v = uv.y, xx = abs(uv.x - .5 - (.1 * sin(v * 6. - uTime * 8. + seed * 40.) + .05 * sin(v * 13. - uTime * 13. + seed * 70.)) * v);
    float d1 = xx - .4 * tongue(v), d2 = v < .68 ? xx - .25 * tongue(v / .68) : xx + (v - .68), d3 = v < .4 ? xx - .13 * tongue(v / .4) : xx + (v - .4);
    cut = d1 > 0.; pen = d3 < 0. ? 3. : d2 < 0. ? 2. : 1.;
    float w = max(vEdge.x, .001); line = max(edge(-d1 * vSize.x, w), max(edge(abs(d2) * vSize.x, w * .6), edge(abs(d3) * vSize.x, w * .6)));
  } else {
    lu = max(edge(uv.x * sx, vEdge.x), edge((1. - uv.x) * sx, vEdge.y)); lv = max(edge(uv.y * vSize.y, vEdge.z), edge((1. - uv.y) * vSize.y, vEdge.w));
    line = max(lu, lv); pair = true;      // the lines at u0 and u1, and the lines at v0 and v1
  }
  if (kind == 1. || kind == 7.) {
    // THE SEA AND THE SAND are coloured in the world's own plan, not tile by tile. THE LAGOON (the sea inside uRing.w
    // metres of its middle) and the bar of sand round it (to 80 m beyond) are coloured at every metre, the lagoon round
    // and round. Everywhere else the pen goes ALONG THE ROUTE in strokes side by side, each stroke as far as its own
    // tip: on the sand the tip of a stroke lies uLead.y metres of route ahead of the eye, on the sea at uLead.z times the
    // metres flown and uLead.x more (the colouring of the sea runs on ahead of us), less the stroke's own lag (up to about 250 m on the
    // sea, a third of that on the sand: a lag of its own and a slow wave from stroke to stroke; its end is rounded like
    // a nib's), so the edge of the colouring is a fringe of stroke ends that goes before the eye. The strokes have no end to either side: beyond the field's
    // box its edge value stands, so the far sea is coloured with the nearest part that the field knows. Where the nearest
    // part of the route changes (the field's ridge) two runs of strokes meet at an angle, and early in the flight a
    // coloured run meets one not yet reached: the hand's own joins (each a band as wide as a cell of the field). The circle
    // where the lagoon's law meets the sea's (uRing.w from its middle) lies under the bar of sand, but for the bar's
    // mouth, where the two meet in a plain join. The strokes of BOTH laws and their footprints are worked out for every
    // pixel before the choice between them: no derivative is taken inside a branch that changes from pixel to pixel.
    if (pen > .5) {
      vec3 ink = penCol(pen); float coats = 0., cov = 1., y, fw; vec2 lg = vWorld.xz - uRing.xy; float rl = length(lg);
      float ang = atan(lg.x, lg.y) / 6.2831853, yL = rl / 13. + .1 * sin(ang * 56.5486678), SW = kind == 1. ? 15. : 12., yS = rf.g / SW + .1 * sin(rf.r * .045);
      float fwL = max(fwidth(yL), 1e-6), fwS = max(fwidth(yS), 1e-6);
      if (kind == 1. && rl < uRing.w) {
        y = yL; fw = fwL;
        float f = y - floor(y);
        // this ring's stroke, the one before and the one after: each lies from .04 to 1.17 of its own breadth, its two
        // ends soft by a pixel's footprint; with all three counted the coats have no jump where one cell meets the next
        for (int k = -1; k < 2; k++) { float fj = f + float(k); coats += smoothstep(.04 - fw, .04 + fw, fj) * (1. - smoothstep(1.17 - fw, 1.17 + fw, fj)); }
      } else {
        float lag = kind == 1. ? 1. : .33;
        float lead = (kind == 1. ? uS * uLead.z + uLead.x : uS + uLead.y) + (kind == 7. && rl < uRing.w + 80. ? 1e5 : 0.) - rf.r;
        y = yS; fw = fwS;
        float j = floor(y), f = y - j;
        for (int k = -1; k < 2; k++) {          // this stroke, the one before and the one after
          float jj = j - float(k), h = hash(jj * 1.3 + 2.), fj = f + float(k), fk = 2. * fj - 1.;
          float on = step((130. * h + 110. * (.5 + .5 * sin(jj * .21 + 1.3)) + 9. * min(fk * fk, 1.5)) * lag, lead);
          coats += on * smoothstep(.04 - fw, .04 + fw, fj) * (1. - smoothstep(1.17 - fw, 1.17 + fw, fj));
        }
        cov = clamp(lead / (240. * lag), 0., 1.);
      }
      col = mix(uPaper * pow(ink, vec3(coats)), mix(uPaper, uPaper * pow(ink, vec3(1.04)), cov), smoothstep(.2, .55, fw));
    }
  } else if (pen > .5 && vProg > .001 && kind != 4.) {
    float a = vInk.z, ca = cos(a), sa = sin(a); vec2 m = (uv - .5) * vSize.xy, q = vec2(ca * m.x + sa * m.y, -sa * m.x + ca * m.y);
    float N = floor(vStk.x + .5), W = vStk.y / N;
    float y = q.y / W + N * .5 + .1 * sin(q.x * 2.2 / W + seed * 9.);          // the hand's waver
    float i = clamp(floor(y), 0., N - 1.), f = y - i, x = q.x / vStk.z + .5, fw = max(fwidth(y), 1e-6), front = vProg * (N + .35);
    vec3 ink = penCol(pen); float coats = 0.;
    // this stroke, the one before it, whose edge laps over this one, and the one after, whose soft start reaches back
    // into this cell (not on the wake, whose strokes start hard at their own edge)
    for (int k = -1; k < 2; k++) {
      float j = i - float(k);
      if (j >= 0. && j <= N - 1. && (k >= 0 || kind != 2.)) {
        float t = front - j, h = hash(j + seed * 31.), h2 = hash(j * 1.7 + seed * 17.);
        float dir = mod(j, 2.) < 1. ? x : 1. - x;
        float lo = h > .55 ? .02 + .09 * h2 : -.01, hi = h2 > .5 ? .98 - .1 * h : 1.01;     // a stroke stops short: a sliver of paper
        if (kind == 2.) { lo = -.01; hi = 1.01; }                                           // (not on the wake: it is gone over too often)
        float on = step(1e-4, t) * step(dir, clamp(t, 0., 1.) * 1.02) * step(lo, x) * step(x, hi);
        float fj = f + float(k), gap = kind == 2. ? -1. : .03 + .11 * step(.7, h) * h2;
        coats += on * smoothstep(gap - fw, gap + fw, fj) * (1. - smoothstep(1.16 - fw, 1.16 + fw, fj));
      }
    }
    float full = coatsN;
    if (kind == 2.) {           // the wake: coat on coat, the newest behind the boat
      float da = fract((uRing.z - atan(vWorld.x - uRing.x, vWorld.z - uRing.y)) / 6.2831853);
      full *= 1.5 + 1.3 * (1. - da) * (1. - da);
    }
    // far off, strokes draw as their mean (from about five pixels a stroke, wholly under two): the cell coloured as far as the hand has come
    // the front a stroke wide and never under two pixels, its window kept inside the cell: a finished cell is whole and a
    // cell smaller than the window is coloured by the share the hand has come
    float mw = .5 * max(1., 2. * fw), mlo = max(y - mw, 0.), mhi = min(y + mw, N);
    vec3 mean = mix(uPaper, uPaper * pow(ink, vec3(1.04 * full)), clamp((front - mlo) / max(mhi - mlo, 1e-4), 0., 1.));
    col = mix(uPaper * pow(ink, vec3(coats * full)), mean, smoothstep(.2, .55, fw));
  }
  if (kind == 1.) {             // the sea's printed lines: rows of scallops 16 m deep that slide against each other
    // one print; it pales where a pixel covers more than 1.2 m of sea and is gone at 3.2 m (the head, filter 4): the far
    // sea is the pen alone
    float fwd = fwidth(vWorld.z) + fwidth(vWorld.x) * .5, R = 16.;
    float row = floor(vWorld.z / R), f = fract(vWorld.z / R), dirn = mod(row, 2.) * 2. - 1.;
    float fx = fract((vWorld.x + dirn * uTime * 2.4 + hash(row + R) * 40.) / 34.), c = .22 + .5 * sin(3.14159265 * fx);
    float d = abs(f - c) * R, on = clamp(1.6 - fwd * .5, 0., 1.);
    line = max(line, (1. - smoothstep(.14, .14 + fwd, d)) * on * .9);
  } else {
    // two lines that face each other less than 3.6 pixels apart (each about a pixel at least) would be half of the
    // quad and more: that pair goes over into its mean, the lines' true share of the quad's breadth (a 0.9 m board
    // between two bold lines stays nine tenths ink at any distance; a far mast a third); the pair that runs along the
    // quad stays; a cut-out's one line pales by the lesser side (the head, filter 2). pu, pv: the quad's u and v spans in pixels
    float pu = vSize.x / max(fwidth(uv.x * vSize.x), 1e-5), pv = vSize.y / max(fwidth(uv.y * vSize.y), 1e-5);
    line = pair ? max(mix(clamp((vEdge.x + vEdge.y) / max(sx, 1e-5), 0., 1.), lu, smoothstep(1., 3.6, pu)), mix(clamp((vEdge.z + vEdge.w) / max(vSize.y, 1e-5), 0., 1.), lv, smoothstep(1., 3.6, pv))) : line * smoothstep(1., 3.6, min(pu, pv));
  }
  if (cut) discard;
  gl_FragColor = vec4(mix(col, uLine, line), 1.);
}`;function ne(d={}){const n={uS:{value:0},uTime:{value:0},uStroke:{value:d.stroke||2.8},uRing:{value:new k.Vector4(0,0,0,0)},uBox:{value:new k.Vector4(0,0,1,1)},uLead:{value:new k.Vector3(900,400,2.6)},uRoute:{value:null},uPens:{value:Y.map(i=>new k.Color(i))},uPaper:{value:new k.Color(J)},uLine:{value:new k.Color(Q)}},h=(i,f)=>new k.ShaderMaterial({uniforms:n,vertexShader:$,fragmentShader:ee,side:f??k.DoubleSide,defines:i?{INST:1}:{}}),s=h(!1),a=h(!0);return{uniforms:n,sheet:()=>{const i=[],f=[],g=[],v=[],m=[],r=[],p=[],b=[];let u=0;return{quad:(c,w,q,S,x={})=>{const P=w[0]-c[0],I=w[1]-c[1],z=w[2]-c[2],F=S[0]-c[0],N=S[1]-c[1],B=S[2]-c[2];let L=I*B-z*N,U=z*F-P*B,W=P*N-I*F;const V=Math.hypot(L,U,W)||1;L/=V,U/=V,W/=V;const K=x.size?x.size[0]:.5*(Math.hypot(P,I,z)+Math.hypot(q[0]-S[0],q[1]-S[1],q[2]-S[2])),_=x.size?x.size[1]:.5*(Math.hypot(F,N,B)+Math.hypot(q[0]-w[0],q[1]-w[1],q[2]-w[2])),A=x.edge||[y,y,y,y],T=x.fill||[0,1,1,C.full],X=Math.round((x.seed??u*.6180339%1)*4096)/4096,D=[c,w,q,S],H=[0,0,1,0,1,1,0,1],Z=x.q||[1,1];for(let E=0;E<4;E++){const O=Z[E>>1];i.push(D[E][0],D[E][1],D[E][2]),f.push(L,U,W),g.push(H[2*E]*O,H[2*E+1],O),v.push(Math.max(K,.01),Math.max(_,.01),x.kind||0);const R=x.fills?x.fills[E]:T;m.push(x.pen||0,x.coats||1,x.dir||0,X),r.push(R[0],R[1],R[2],R[3]),p.push(A[0],A[1],A[2],A[3])}b.push(4*u,4*u+1,4*u+2,4*u,4*u+2,4*u+3),u++},geometry:()=>{const c=new k.BufferGeometry,w=(q,S)=>new k.BufferAttribute(new Float32Array(q),S);return c.setAttribute("position",w(i,3)),c.setAttribute("normal",w(f,3)),c.setAttribute("aUV",w(g,3)),c.setAttribute("aSize",w(v,3)),c.setAttribute("aInk",w(m,4)),c.setAttribute("aFill",w(r,4)),c.setAttribute("aEdge",w(p,4)),c.setIndex(u*4>65535?new k.BufferAttribute(new Uint32Array(b),1):new k.BufferAttribute(new Uint16Array(b),1)),c.computeBoundingSphere(),c},count:()=>u}},mesh:(i,f)=>{const g=new k.Mesh(i.geometry(),s);return g.name=f||"sheet",g.frustumCulled=!1,g},fleet:(i,f,g)=>{const v=i.geometry(),m=new k.InstancedBufferAttribute(new Float32Array(f*4),4);m.setUsage(k.DynamicDrawUsage),v.setAttribute("aInst",m);const r=new k.InstancedMesh(v,a,f);return r.name=g||"fleet",r.frustumCulled=!1,r.instanceMatrix.setUsage(k.DynamicDrawUsage),{mesh:r,inst:m}},plain:s}}const te=(d,n,h,s=0,a=1)=>{const o=Math.cos(s),t=Math.sin(s);return(e,i,f)=>[d+a*(o*e+t*f),n+a*i,h+a*(-t*e+o*f)]};function se(d,n,h,s,a,o={}){const t=h/2,e=a/2,i=o.pens||[0,0,0,0,0],f=o.edge||[l,l,l,l],g=m=>o.fills?o.fills[m]:o.fill,v=(m,r,p,b,u,M)=>d.quad(m,r,p,b,{pen:i[u],coats:M,dir:o.dir??Math.PI/2,fill:g(u),edge:f,seed:o.seed!=null?o.seed+u*.13:void 0});v(n(-t,0,e),n(t,0,e),n(t,s,e),n(-t,s,e),0,1),v(n(t,0,e),n(t,0,-e),n(t,s,-e),n(t,s,e),1,2),v(n(t,0,-e),n(-t,0,-e),n(-t,s,-e),n(t,s,-e),2,2),v(n(-t,0,-e),n(-t,0,e),n(-t,s,e),n(-t,s,-e),3,1),o.top!==!1&&v(n(-t,s,e),n(t,s,e),n(t,s,-e),n(-t,s,-e),4,1)}function ie(d,n,h,s,a={}){for(const[o,t,e,i,f,g]of s)for(let v=0;v<h;v++){const m=v/h*Math.PI*2,r=(v+1)/h*Math.PI*2,p=Math.cos(m),b=Math.sin(m),u=Math.cos(r),M=Math.sin(r);d.quad(n(e*p,o,e*b),n(e*u,o,e*M),n(i*u,t,i*M),n(i*p,t,i*b),{pen:typeof f=="function"?f(v):f,coats:v/h>.5&&v/h<.92?2:1,q:e===i?void 0:[Math.max(.002,2*e/(e+i)),Math.max(.002,2*i/(e+i))],dir:a.dir??Math.PI/2,fill:g||a.fill,edge:[a.rib??0,a.rib??0,a.hoop??l,a.hoop??l],seed:((a.seed||0)+o*.01+v*.07)%1})}}function re(d,n,h,s,a,o,t={}){for(let e=0;e<h;e++){const i=e/h*Math.PI*2,f=(e+1)/h*Math.PI*2,g=n(0,s,0);d.quad(n(a*Math.cos(i),s,a*Math.sin(i)),n(a*Math.cos(f),s,a*Math.sin(f)),g,g,{pen:typeof o=="function"?o(e):o,dir:t.dir??0,fill:t.fill,edge:[0,2*(t.spoke??0),t.rim??l,0],seed:((t.seed||0)+e*.07)%1,coats:t.coats,size:[2*a*Math.sin(Math.PI/h)*Math.cos(Math.PI/h),a*Math.cos(Math.PI/h)]})}}const G=(d,n,h,s)=>{const a=Math.hypot(n[0]-d[0],n[1]-d[1],n[2]-d[2]),o=Math.hypot(h[0]-s[0],h[1]-s[1],h[2]-s[2]);return[Math.max(.002,2*a/(a+o)),Math.max(.002,2*o/(a+o))]};function le(d,n={}){const h=te(0,0,0),s=(r,p,b=1)=>[r,p,b,C.boat],a=[[-6,0,-13],[-7,5,-14],[0,0,15],[0,6,17],[6,0,-13],[7,5,-14]],[o,t,e,i,f,g]=a;d.quad(e,o,t,i,{pen:1,dir:0,fill:s(.05,.12),edge:[l,l,l,l]}),d.quad(e,f,g,i,{pen:1,dir:0,coats:2,fill:s(.08,.12),edge:[l,l,l,l]}),d.quad(o,f,g,t,{pen:1,dir:0,coats:2,fill:s(.1,.1),edge:[l,l,l,l]}),d.quad(t,g,i,i,{pen:0,edge:[0,0,y,0],size:[14,31]}),d.quad([-.5,5,2],[.5,5,2],[.5,52,1],[-.5,52,1],{pen:0,edge:[y,y,0,y]}),d.quad([0,5,1.5],[0,5,2.5],[0,52,1.5],[0,52,.5],{pen:0,edge:[y,y,0,y]});const v=n.lean??3.2,m=5;for(let r=0;r<m;r++){const p=8+r/m*42,b=8+(r+1)/m*42,u=z=>19*(1-z)+.9*z,M=z=>v*(Math.sin(Math.PI*z)+.5*(1-z)),j=u(r/m),c=u((r+1)/m),w=M(r/m),q=M((r+1)/m),S=[.6,p,1.6],x=[.6+w,p,1.6-j],P=[.6+q,b,1.6-c],I=[.6,b,1.6];d.quad(S,x,P,I,{pen:2+r%2*3,dir:0,fill:s(.18+.1*r,.12,r===2?.75:1),edge:[l,l,r?y:l,r===m-1?l:y],q:G(S,x,P,I),seed:.1+.17*r})}{const r=[[7,15,11,1.6],[24,8.5,5.5,1.2],[41,2,.8,.8]];for(let p=0;p<2;p++){const[b,u,M,j]=r[p],[c,w,q,S]=r[p+1],x=[-.6,b,u],P=[-.6-j,b,u-M],I=[-.6-S,c,w-q],z=[-.6,c,w];d.quad(x,P,I,z,{pen:7,dir:0,fill:s(.72+.08*p,.12),edge:[l,l,p?y:l,p?l:y],q:G(x,P,I,z),seed:.6+.2*p})}}return d}function fe(d){const s=(a,o)=>{const t=a/3-.5,e=o/3,i=22*Math.sin(Math.PI*(.12+.88*e)*.92)*(e<.5?1:1.06-.3*(e-.5));return[t*i*1.25,10+e*38,16+11*Math.cos(t*2.6)*Math.sin(Math.PI*Math.min(1,.15+e))]};for(let a=0;a<3;a++)for(let o=0;o<3;o++){const t=s(a,o),e=s(a+1,o),i=s(a+1,o+1),f=s(a,o+1);d.quad(t,e,i,f,{pen:1+(a*3+o*2)%8,dir:Math.PI/2,fill:[.02+.05*(a+o),.3,1,C.boat],edge:[a?y:l,a===2?l:y,o?y:l,o===2?l:y],q:G(t,e,i,f),seed:.3+.11*a+.07*o})}return d}export{l as BOLD,oe as KIND,Q as LINE,C as MODE,J as PAPER,ae as PEN,Y as PENS,y as THIN,se as box,le as dinghy,re as disc,ie as drum,te as frame,ne as makeBook,fe as spinnaker};
