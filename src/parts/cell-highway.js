import*as e from"three";import{mergeGeometries as pe,mergeVertices as fe}from"three/addons/utils/BufferGeometryUtils.js";const Ae={get NOISE(){return ve},get VERT_PARS(){return Z},get VERT_END(){return oe},get FRAG_PARS(){return J},get FRAG_END(){return te},wcMaterial:(...f)=>ee(...f)},ge=["#F4ECDC","#7FBFA8","#B9A3D9","#F4B899","#2F6F73","#4A4A52","#E2432A"],$=260,he=40*Math.PI/180,ve=`
float h31(vec3 p){ p=fract(p*vec3(.1031,.1030,.0973)); p+=dot(p,p.yxz+33.33); return fract((p.x+p.y)*p.z); }
float vn(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x),mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x),mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm(vec3 p){ float a=.5,s=0.; for(int i=0;i<4;i++){ s+=a*vn(p); p=p*2.03+17.1; a*=.5; } return s; }
`,te=`
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float fogF = 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
    #else
      float fogF = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    if (uFogD > 0.) fogF = 1. - exp(-pow(max(vFogDepth, 0.)/uFogD, 1.5));
    vec3 fogTo = fogColor;
    if (uBgK > .001) fogTo = mix(fogColor, backdrop(normalize((vec4(vVP, 0.)*viewMatrix).xyz + vec3(0., 1e-6, 0.))), uBgK);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogTo, fogF);
  #endif
  gl_FragColor.rgb = paperize(gl_FragColor.rgb);
`,xe=`
uniform vec3 uBgA, uBgB, uBgMoon; uniform float uBgK, uFogD, uFrame, uPoolK, uBgDeep;
vec3 backdrop(vec3 d){
  float w1 = vn(d*2.3 + vec3(0., uTime*.008, 3.)), w2 = vn(d*6.1 + 11.);
  float low = smoothstep(.30 + (w1 - .5)*.36, -.40, d.y);
  float pool = smoothstep(-.18, -.85, d.y + (w2 - .5)*.16);                 // the wash pools darker toward the bottom of the sheet
  float dens = low*(.60 + .34*w2) + .62*pool + .12*(1. - smoothstep(0., .05, abs(low - .12)));
  // THE GROUND IS LAID DEEPER (uBgDeep: the day, dawn and golden sheets; 0 leaves the sheet as it was, and the night sheet is
  // left so). The lower wash no longer thins away to nothing at the level line: it stops at a clear edge, where its pigment
  // has pooled, and has its body from there down; over it, past a sliver of bare paper, the second wash (uBgB) is laid
  // across the upper sheet, with lights left in it.
  float eg = .24 + (w1 - .5)*.36 + (vn(d*.9 + vec3(31., 0., 4.)) - .5)*.62, under = eg - d.y;   // the edge wanders up and down the sheet: a wash's edge, not a level line
  float densD = smoothstep(0., .03, under)*mix(.36, .74, smoothstep(0., .42, under))*(.86 + .28*w2) + .62*pool + .20*(1. - smoothstep(0., .035, abs(under - .022)));
  dens = mix(dens, densD, uBgDeep);
  vec3 c = mix(uPaper, uBgA, clamp(dens, 0., .88));
  c = mix(c, c*mix(vec3(1.), uGlaze*2.1, .5), .5*pool*uPoolK);
  float w3 = vn(d*1.6 + vec3(5., 0., uTime*.006)), over = -under - .05;
  float upD = smoothstep(0., .03, over)*(.40 + .26*w2)*(1. - .80*smoothstep(.52, .70, w3)) + .16*(1. - smoothstep(0., .03, abs(over - .02)));
  c = mix(c, uBgB, clamp(upD, 0., .8)*uBgDeep);
  float lb = smoothstep(.72, .97, dot(d, uBgMoon) + (w1 - .5)*.12);
  return mix(c, uBgB, lb*.8);
}
vec3 paperize(vec3 c){
  vec2 fc = gl_FragCoord.xy * uPx;
  float g = vn(vec3(fc*.55, 1.3))*.6 + vn(vec3(fc*.21, 7.7))*.4, g2 = vn(vec3(fc.x*.05, fc.y*.9, 3.1));
  vec3 dc = c - uPaper; float amt = clamp(length(dc)*3., 0., 1.);
  // A FULL DARK WASH FLOODS THE TOOTH: where the paint is laid much darker than the paper (never on the night sheet, whose
  // paint is lighter than its paper) the sheet's tooth shows finer and quieter through it, and the dry brush leaves no
  // sparkle: the grain of a thin wash on a rough sheet is not the grain of a full one
  float full = smoothstep(.22, .50, dot(uPaper - c, vec3(.3, .5, .2)));
  float gt = mix(g, vn(vec3(fc*.55, 1.3))*.6 + .2, full);
  c = uPaper + dc*(1. + (.55 - .25*uWet)*(1. - .55*full)*(gt - .5));
  c = mix(c, uPaper, (1. - uWet)*.5*amt*(1. - .85*full)*smoothstep(.60, .74, g*.7 + g2*.3));
  c *= 1. - .07*(g - .5) - .03*(g2 - .5);
  vec2 nd = vClip.xy / max(abs(vClip.z), 1e-4), q = abs(nd);
  float br = vn(vec3(nd.x*2.5, nd.y*10., 2.))*.55 + vn(vec3(nd*4., 9.))*.3 + vn(vec3(nd.x*3., nd.y*33., 4.))*.15;
  float fr = smoothstep(.955, 1.0, max(q.x + (br - .5)*.075, q.y + (vn(vec3(nd.x*4., nd.y*2., 5.)) - .5)*.05));
  // one more wet wash laid over the lower corners of the sheet, pooling darker toward them (fixed to the sheet, like its tooth)
  float pw = vn(vec3(nd*1.7, 6.))*.7 + vn(vec3(nd*5.3, 2.))*.3;
  float pl = -nd.y*.62 + q.x*.60 - .30 + (pw - .5)*.34, pk = smoothstep(.10, .95, pl) + .22*(1. - smoothstep(0., .035, abs(pl - .13)));
  c *= mix(vec3(1.), mix(vec3(1.), uBgA, .62)*(1. - .05*(g - .5)), min(pk, 1.)*.62*uPoolK);
  return max(mix(c, uPaper*(1. - .07*(g - .5)), fr*uFrame), vec3(0.));
}
`,Z=`
varying vec3 vOP; varying vec3 vN; varying vec3 vVN; varying vec3 vVP; varying vec3 vClip;
uniform float uTime;
#include <fog_pars_vertex>
`,oe=`
  vOP = p; vN = n; vVN = normalMatrix * n;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0); vVP = mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition; vClip = gl_Position.xyw;
  #include <fog_vertex>
`,J=`
uniform vec3 uPaper, uGlaze, uPencil, uLight, uHi; uniform float uTime, uWet, uPx, uGouK, uBody;
varying vec3 vOP; varying vec3 vN; varying vec3 vVN; varying vec3 vVP; varying vec3 vClip;
#include <fog_pars_fragment>
${ve}
float edgeOf(vec3 vn_){ return 1. - abs(dot(normalize(vn_), normalize(-vVP + vec3(0.,0.,1e-5)))); }
// THE PAINT HAS BODY. One more charge of the same paint darkens every channel by the same share (.6 a layer: the -.737
// is its log2), so a pigment deepens in its own hue by even steps whatever it is: sea-green to viridian, lilac to
// violet. A pigment that is dark already (the tubes, the wells: strongest channel under .59) has that much less charge
// to take, so none runs to black. A warm pigment takes .4 of the charge, keeps more of its red (.75 a layer) and loses
// more of the two others (.48): charged as the cool ones are, peach turns to brown; charged in full, to a coral as hot
// as the walker. wcNear: a form within 120 m of the eye takes the full charge; by 360 m only its thin first wash
// is left and the pencil is down to .15 (at 300 m a sixth of the charge is left). It is a law
// of distance only; k is clamped, so an undefined edge cannot reach the colour. uBody is the sheet's own share: 1 by day, less on the diluted dawn sheet, 0 on the night sheet
// (gouache is body colour already, light on dark: charging it would darken it).
float wcNear(){ return 1. - smoothstep(120., 360., length(vVP)); }
float wcWarm(vec3 pig){ return clamp((pig.r - pig.g)*2.5, 0., 1.); }
vec3 charge(vec3 pig, float k, float warm){
  return pig*exp2(mix(vec3(-.737), vec3(-.415, -1.059, -1.059), warm)*(clamp(k, 0., 2.)*min(1., max(pig.r, max(pig.g, pig.b))*1.7)*(1. - .6*warm)*uBody));
}
// three-band wash: pigment over paper. n = hero-local normal, edge 0..1 pooling, sc = noise scale, hi = highlight amount
vec3 wcWarmGlaze = vec3(.55,.55,.80);   // the glaze laid over warm pigments in shadow; a material may set it before wash()
vec3 wash(vec3 pig, vec3 n, float edge, vec3 op, float sc, float hi){
  float bn = fbm(op*sc), gr = fbm(op*sc*11. + 5.), creep = vn(op*sc*2.3 + vec3(0., uTime*.06, 0.));
  float l = dot(n, uLight) + (bn-.5)*(.45 + .5*uWet) + (creep-.5)*(.08 + .16*uWet);
  float mid = smoothstep(.40,.27,l), sh = smoothstep(-.10,-.24,l), hl = smoothstep(.80,.86,l)*hi;
  float near = wcNear(), nb = .15*near*uBody, warm = wcWarm(pig);          // warm pigments take a cool lilac-grey glaze: teal over peach is mud
  float dens = mix(.70 + nb + (.28 - nb)*mid, .92 - .24*mid, uGouK); dens *= .80 + .40*gr; dens += edge*edge*.34; dens = clamp(dens, 0., 1.);
  // the charge: some in the first wash, twice that in the mid wash, more again in the shadow and where the paint pools at an edge
  vec3 c = mix(uPaper, charge(pig, near*(.5 + .55*mid + .2*sh + .4*edge*edge)*(.80 + .40*gr), warm), dens);
  c = mix(c, c*mix(vec3(1.), mix(uGlaze*2.2, wcWarmGlaze, warm), .74), sh*.92);
  c = mix(c, uHi, hl);
  float jit = h31(vec3(floor(uTime*4.), 1.7, 2.3));
  float ln = smoothstep(.80,.90, edge + (vn(op*sc*3. + jit*9.)-.5)*.14);
  return mix(c, uPencil, ln*(.15 + .45*near)*(1.-hl));
}
${xe}
`;function ee(f,s,d,r,t={}){return new e.ShaderMaterial({uniforms:{...e.UniformsUtils.clone(e.UniformsLib.fog),...f,...s},vertexShader:d,fragmentShader:r,fog:!0,...t})}const h=(f,s,d)=>new e.Vector3(f,s,d),H=f=>new e.Color(f);function we(f,s,d,r,t){const c=new e.IcosahedronGeometry($,16),w=h(t.range(-.7,.7),t.range(0,.6),1).normalize(),g=ee(f,{uLilac:{value:s.lilac},uPeach:{value:s.peach},uGreen:{value:s.green},uPortal:{value:r},uNucleolus:{value:w},uHole:{value:Math.cos(7.15/$)}},`
    ${Z}
    void main(){ vec3 p = position; vec3 n = normalize(position); ${oe} }`,`
    ${J}
    uniform vec3 uLilac, uPeach, uGreen, uPortal, uNucleolus; uniform float uHole;
    void main(){
      vec3 n = normalize(vN);
      float dp = dot(n, uPortal); if (dp > uHole) discard;
      float m = fbm(vOP*.012 + 3.), m2 = fbm(vOP*.035 - 7.);
      vec3 pig = mix(uLilac, uPeach, smoothstep(.52,.78,m)*.45);
      pig = mix(pig, uGreen, smoothstep(.05,-.75,n.y)*.28);                 // green reflected up from the ribbons
      pig *= mix(vec3(1.), vec3(.80,.74,.92), smoothstep(.45,.7,m2)*.6);   // chromatin blotches
      pig *= 1. - .30*smoothstep(.42,.68,fbm(vOP*.13 + vec3(21., uTime*.22, 21.))) + .06*(vn(vOP*.6 + vec3(0., 0., uTime*.5)) - .5);   // finer mottling for the close pass
      float nu = smoothstep(.80,.93, dot(n,uNucleolus) + (m-.5)*.12);       // nucleolus showing through
      pig = mix(pig, pig*vec3(.52,.42,.68), nu*.8);
      float e = edgeOf(vVN);
      vec3 c = wash(pig, normalize(mix(n, uLight, .18)), e, vOP, .02, .55);
      float tl = dot(n, uLight) + (m - .5)*.34 + (m2 - .5)*.12;               // a painted terminator: an indigo glaze on the limb away
      c = mix(c, c*vec3(.66,.68,.90), .92*smoothstep(.10, -.62, tl));        // from the light, paper showing through on the limb toward it
      c = mix(c, uHi, .30*smoothstep(.30, .92, tl));
      float ring = smoothstep(uHole - .006, uHole, dp);                     // pigment pooled round the open pore
      c = mix(c, c*vec3(.55,.5,.62), ring);
      vec3 pr = n - uPortal*dp; float dM = length(pr)*${$}. + step(dp, 0.)*1e4, fwM = fwidth(dM);   // metres from the pore's centre, on the face
      if (dM < 34.) {
        vec3 t1 = normalize(cross(uPortal, vec3(0., 1., 0.))), t2 = cross(uPortal, t1);
        float halo = 1. - smoothstep(8., 24. + 5.*vn(vOP*.11), dM);
        c = mix(c, c*vec3(.80,.70,.88), halo*.45);                           // a darker lilac pool the petals sit in
        float phi = atan(dot(pr, t2), dot(pr, t1) + 1e-6)*11.459 + (vn(vOP*.09) - .5)*.8;     // 72 radial pencil strokes
        // by day the strokes are lifted out of the dark pool to the paper's light, as a brush lifts wet paint (pencil on a full
        // dark wash is dark on dark); on the night sheet they stay the pale pencil they were
        float sd = abs(fract(phi) - .5)*dM*.0873, lw = mix(max(.105, fwM*.95), max(.09, fwM*.9), uGouK);
        float len = 13. + 12.*h31(vec3(floor(phi), 3., 7.));
        float hatch = (1. - smoothstep(lw*.6, lw*1.4, sd))*smoothstep(7.4, 9.5, dM)*(1. - smoothstep(len*.7, len, dM - 7.))
          *smoothstep(.30, .50, vn(vOP*.45 + floor(uTime*4.)*.11));
        float thin = mix(pow(min(1., .105/max(fwM*.95, 1e-4)), .6), 1., uGouK);   // a lifted stroke narrower than a pixel is diluted by the pixel's own width: far off the rays are a soft light round the pore, not a burr
        c = mix(c, mix(uPaper, uPencil, uGouK), mix(.62*thin, .42, uGouK)*hatch);
      }
      gl_FragColor = vec4(c, 1.);
      ${te}
    }`),l=new e.Mesh(c,g);return l.position.copy(d),l.name="nucleus",l}function de(f,s,d){const r=[],t=[],c=[];for(let l=0;l<8;l++){const p=l*Math.PI/4,b=r.length/3;for(let z=0;z<=s;z++)for(let x=0;x<=f;x++){const M=x/f*2-1,m=z/s*2-1,y=M*Math.sqrt(1-m*m/2),B=m*Math.sqrt(1-M*M/2),I=Math.min(1,y*y+B*B),C=p+y*.335*(1-.12*B),F=8.65+B*1.75+.3*(1-y*y),S=2*Math.pow(1-I,.55)-.3;r.push(Math.cos(C)*F,Math.sin(C)*F,S),c.push(0,I,p)}for(let z=0;z<s;z++)for(let x=0;x<f;x++){const M=b+z*(f+1)+x,m=M+1,y=M+f+1,B=y+1;t.push(M,B,m,M,y,B)}}const w=r.length/3;r.push(0,0,.1),c.push(1,0,0);for(let l=0;l<d;l++){const p=l/d*Math.PI*2;r.push(Math.cos(p)*7.4,Math.sin(p)*7.4,.3),c.push(1,1,0)}for(let l=0;l<d;l++)t.push(w,w+1+l,w+1+(l+1)%d);const g=new e.BufferGeometry;return g.setAttribute("position",new e.Float32BufferAttribute(r,3)),g.setAttribute("aAux",new e.Float32BufferAttribute(c,3)),g.setIndex(t),g.computeVertexNormals(),g}function be(f,s,d,r,t,c){const w=t.int(396,444),g=Math.PI*(3-Math.sqrt(5)),l=[];for(let T=0;T<w;T++){const A=1-2*(T+.5)/w,k=Math.sqrt(1-A*A),V=T*g;l.push(h(Math.cos(V)*k,A,Math.sin(V)*k))}let p=0,b=-2;l.forEach((T,A)=>{const k=T.dot(r);k>b&&(b=k,p=A)});const z=new e.Quaternion().setFromUnitVectors(l[p],r);l.forEach(T=>T.applyQuaternion(z).normalize());const x=ee(f,{uRose:{value:s.rose},uTeal:{value:s.teal},uOpen:c},`
    ${Z}
    attribute vec3 aAux; attribute vec3 aInst; uniform float uOpen;
    varying vec3 vAux; varying vec3 vInst; varying vec2 vL;
    void main(){
      vec3 lp = position, ln = normal; vAux = aAux; vInst = aInst; vL = position.xy;
      if (aAux.x < .5) {            // petals breathe; the portal's petals fold outward with uOpen, flattening as they do
        lp.z *= 1. - .5*aInst.y*uOpen;
        float th = .07 + .09*sin(uTime*1.3 + aInst.x*6.283 + aAux.z) + aInst.y*uOpen*.50;
        vec2 er = vec2(cos(aAux.z), sin(aAux.z)); float cr = dot(lp.xy, er) - 10.4; vec2 tg = lp.xy - er*dot(lp.xy, er);
        float c = cos(th), s = sin(th); vec2 rz = vec2(c*cr + s*lp.z, -s*cr + c*lp.z);
        lp = vec3(tg + er*(rz.x + 10.4), rz.y);
        float nr = dot(ln.xy, er); vec2 nt = ln.xy - er*nr; vec2 nz = vec2(c*nr + s*ln.z, -s*nr + c*ln.z);
        ln = vec3(nt + er*nz.x, nz.y);
      } else { lp *= 1. - aInst.y; }  // the portal pore has no well
      vec3 p = (instanceMatrix * vec4(lp, 1.)).xyz; vec3 n = normalize(mat3(instanceMatrix) * ln);
      ${oe}
    }`,`
    ${J}
    uniform vec3 uRose, uTeal; varying vec3 vAux; varying vec3 vInst; varying vec2 vL;
    void main(){
      vec3 n = normalize(vN) * (gl_FrontFacing ? 1. : -1.); vec3 c;
      if (vAux.x < .5) {
        vec2 er = vec2(cos(vAux.z), sin(vAux.z)); float rd = dot(vL, er), tg = dot(vL, vec2(-er.y, er.x));
        vec3 pig = uRose * mix(vec3(.74,.62,.80), vec3(.95,.78,.88), vInst.z);
        pig *= 1. - .34*(1. - smoothstep(7.1, 8.9, rd + (vn(vOP*.6) - .5)*.8));         // the wash pooled at the petal's foot
        if (!gl_FrontFacing) { pig = mix(pig, uPaper, .34)*vec3(.90,.82,.95); n = normalize(mix(n, uLight, .6)); }   // the pale inside of the petal
        float e = max(smoothstep(.30, 1., vAux.y), edgeOf(vVN)*.8);
        c = wash(pig, n, e, vOP, .22, 1.);
        float fan = max(rd - 4.6, .6), vv = tg/fan*2.6;                                  // three pencil veins fanning from the foot
        float vd = abs(fract(vv + .5) - .5)/2.6*fan, vw = max(.09, fwidth(tg)*1.3);
        float vein = (1. - smoothstep(vw*.6, vw*1.5, vd))*step(abs(vv), 1.45)*(1. - smoothstep(.45, .85, vAux.y))
          *smoothstep(.28, .5, vn(vOP*.9 + vInst.x*9.));
        c = mix(c, uPencil, .5*vein);
      } else {
        float r = length(vL)/7.4; float ang = r > .01 ? atan(vL.y, vL.x) : 0.;
        vec3 pig = uTeal * mix(1.25, .8, smoothstep(.2, 1., r));
        c = wash(pig, n, smoothstep(.72, 1., r), vOP, .15, 0.);
        c = mix(c, uPaper, .16*smoothstep(.55,.0,r));
        float sp = abs(fract(ang*1.2732 + .5) - .5) * r * 5.81;            // metres from the nearest of 8 spokes
        float lw = max(.16, .9*fwidth(sp));
        float line = (1. - smoothstep(lw*.6, lw*1.3, sp)) * step(.16, r);
        float rg = abs(r - .2)*7.4; line = max(line, 1. - smoothstep(lw*.6, lw*1.3, rg));
        c = mix(c, uPencil*.75, line*.8*clamp(.2/lw, .25, 1.));
      }
      gl_FragColor = vec4(c, 1.);
      ${te}
    }`,{side:e.DoubleSide}),M=[],m=[];l.forEach((T,A)=>(T.dot(r)>Math.cos(.5)?M:m).push(A));const y=new e.Matrix4,B=new e.Quaternion,I=h(0,0,1),C=h(1,1,1),F=h(),S=new e.Quaternion,v=(T,A)=>{const k=new e.InstancedMesh(A,x,T.length),V=new Float32Array(T.length*3);return T.forEach((R,_)=>{const P=l[R];B.setFromUnitVectors(I,P),S.setFromAxisAngle(I,t()*Math.PI),B.multiply(S),F.copy(P).multiplyScalar($-.12).add(d);const N=R===p?1:t.range(.92,1.06);y.compose(F,B,C.set(N,N,1)),k.setMatrixAt(_,y),V[_*3]=t(),V[_*3+1]=R===p?1:0,V[_*3+2]=t()}),A.setAttribute("aInst",new e.InstancedBufferAttribute(V,3)),k.frustumCulled=!1,k.instanceMatrix.needsUpdate=!0,k};return{meshes:[v(M,de(8,4,28)),v(m,de(3,2,10))],dirs:l,portalIndex:p}}function ye(f,s,d,r,t){const c=t.int(13,16),w=c+t.int(7,10),g=[],l=[],p=[],b=[],z=h(),x=h(),M=h(),m=new Uint8Array(160),y=new e.Quaternion().setFromRotationMatrix(new e.Matrix4().makeBasis(h(0,Math.cos(he),Math.sin(he)),h(-1,0,0),r));for(let F=0;F<w+2;F++){const S=F>=w,v=S?.05:.125,T=S?.03:.06,A=F%c,k=S?F===w?.07:-.07:-1.22+(A+t.range(.1,.9))*(1.16/c),V=S?t.range(150,200):t.range(170,300),R=t.range(40,56),_=R*t.range(.07,.1),P=t()*6.28,N=S?t.range(-.08,.08):F<2?t.sign()*t.range(.25,.5):t.gauss()*1.15,j=S?t.range(-.03,.03):t.range(-.22,.22),W=S?t.range(1.5,2.5):t.range(6,9),a=t.range(.88,1.08),o=t()*50,n=Math.floor(V/2.2),i=g.length/3;for(let u=0;u<=n;u++){const G=u*2.2,U=G/R*Math.PI*2+P,O=G+_*Math.sin(2*U)-V/2,q=u/n,D=Math.min(1,.25+Math.min(q,1-q)*9),E=k+j*(O/V)+W*Math.cos(U)/$*(.3+.7*D),L=N+O/($*Math.cos(k)),K=.62+.22*Math.sin(G*.021+P),Q=Math.cos(K),ne=Math.sin(K),Y=$+2.6+6*Q*D;z.set(Math.cos(E)*Math.sin(L),Math.sin(E),Math.cos(E)*Math.cos(L)),x.set(-Math.sin(E)*Math.sin(L),Math.cos(E),-Math.sin(E)*Math.cos(L)),S&&(z.applyQuaternion(y),x.applyQuaternion(y));const ae=Math.acos(Math.min(1,Math.max(-1,z.dot(r)))),se=Math.min(1,Math.max(0,(ae-v)/T)),ue=se*se*(3-2*se);m[u]=ae<v+.004?1:0;for(let ie=0;ie<4;ie++){const le=-1+ie*2/3,X=6*le*D*ue;M.copy(z).multiplyScalar(Y+X*Q).addScaledVector(x,X*ne).add(d),g.push(M.x,M.y,M.z),l.push(G,le),p.push(a,o,0)}}for(let u=0;u<n;u++)if(!(m[u]||m[u+1]))for(let G=0;G<3;G++){const U=i+u*4+G,O=U+1,q=U+4,D=q+1;b.push(U,q,O,O,q,D)}}const B=new e.BufferGeometry;B.setAttribute("position",new e.Float32BufferAttribute(g,3)),B.setAttribute("uv",new e.Float32BufferAttribute(l,2)),B.setAttribute("aTint",new e.Float32BufferAttribute(p,3)),B.setIndex(b),B.computeVertexNormals();const I=ee(f,{uGreen:{value:s.green},uPeach:{value:s.peach}},`
    ${Z}
    attribute vec3 aTint; varying vec2 vUv; varying vec3 vTint;
    void main(){ vUv = uv; vTint = aTint; vec3 n = normal;
      vec3 p = position + normal * sin(uTime*.55 + uv.x*.06 + aTint.y) * .7; ${oe} }`,`
    ${J}
    uniform vec3 uGreen, uPeach; varying vec2 vUv; varying vec3 vTint;
    void main(){
      vec3 n = normalize(vN) * (gl_FrontFacing ? 1. : -1.);
      vec3 pig = uGreen * vec3(.68,.88,.80) * vTint.x;
      float e = max(smoothstep(.70, 1., abs(vUv.y)), edgeOf(vVN)*.55);
      vec3 c = wash(pig, n, e, vOP, .09, .22);
      float Y = (vUv.y*.5 + .5)*12., row = floor(Y/2.4);                    // ribosomes: running peach beads
      float spd = (mod(row, 2.) < .5 ? 1. : -1.) * (1.6 + 1.8*h31(vec3(row, vTint.y, 3.)));
      float gx = (vUv.x + uTime*spd)/2.4, cell = floor(gx);
      float on = step(.38, h31(vec3(cell, row, vTint.y)));
      float dd = length(vec2(fract(gx) - .5, fract(Y/2.4) - .5))*2.4;
      float aa = max(.08, fwidth(dd));
      float dotm = (1. - smoothstep(.70 - aa, .70 + aa, dd)) * on;
      vec3 dc = mix(uPaper, uPeach, .9) * (1. - .38*smoothstep(.38, .7, dd)) * (.8 + .2*smoothstep(-.2, .3, dot(n, uLight)));
      dc = mix(dc, uPaper, (1. - smoothstep(.12, .26, length(vec2(fract(gx) - .62, fract(Y/2.4) - .62))*2.4))*.8);
      c = mix(c, dc, dotm);
      gl_FragColor = vec4(c, 1.);
      ${te}
    }`,{side:e.DoubleSide}),C=new e.Mesh(B,I);return C.name="reticulum",C.frustumCulled=!1,C}function Me(f,s,d,r,t,c){const w=c.shuffle(t.dirs.map((T,A)=>A).filter(T=>{const A=t.dirs[T],k=A.dot(r);return T!==t.portalIndex&&A.z>.05&&k<.985&&A.y>-.72})),g=c.int(7,10),l=[],p=[],b=[],z=[],x=h(),M=h(),m=h(),y=h(),B=h(),I=96;let C=0;for(const T of w){if(C>=g)break;const A=t.dirs[T],k=c.range(90,210),V=c()*6.28,R=c()*6.28,_=c();M.set(c.gauss(),c.gauss(),c.gauss()).cross(A).normalize(),m.copy(A).cross(M),y.set(c.range(-.5,.5),c.range(-.7,.1),c.range(.2,.8));const P=[];let N=!0;for(let a=0;a<=I+1;a++){const o=a/I;x.copy(A).multiplyScalar($+.4+k*o*(.5+.5*(1-o*.6))).add(d).addScaledVector(M,Math.sin(o*6+V)*k*.11*o).addScaledVector(m,Math.sin(o*9+R)*k*.07*o).addScaledVector(y,o*o*k*.45),B.copy(x).sub(d);const n=B.length(),i=B.dot(r),u=Math.sqrt(Math.max(0,n*n-i*i));if(i>$-20&&u<22||a>3&&n<$+3){N=!1;break}P.push(x.clone())}if(!N)continue;const j=l.length/3;let W=0;for(let a=0;a<=I;a++){a>0&&(W+=P[a].distanceTo(P[a-1]));for(const o of[-1,1])l.push(P[a].x,P[a].y,P[a].z),p.push(P[a+1].x,P[a+1].y,P[a+1].z),b.push(o,W,a/I,_);if(a<I){const o=j+a*2;z.push(o,o+1,o+2,o+1,o+3,o+2)}}C++}const F=new e.BufferGeometry;F.setAttribute("position",new e.Float32BufferAttribute(l,3)),F.setAttribute("aNext",new e.Float32BufferAttribute(p,3)),F.setAttribute("aSide",new e.Float32BufferAttribute(b,4)),F.setIndex(z);const S=ee(f,{uPeach:{value:s.peach}},`
    ${Z}
    attribute vec3 aNext; attribute vec4 aSide; varying vec4 vS;
    void main(){
      vS = aSide; float t = aSide.z, ph = aSide.w;
      vec3 sw = vec3(sin(uTime*.5 + ph*6. + t*4.), cos(uTime*.4 + ph*5. + t*5.), sin(uTime*.45 + ph*3. + t*3.)) * t*t*7.;
      vec3 p = position + sw;
      vec4 mvPosition = modelViewMatrix * vec4(p, 1.); vec4 mn = modelViewMatrix * vec4(aNext + sw, 1.);
      vec3 tv = normalize(mn.xyz - mvPosition.xyz + vec3(1e-5, 0., 0.));
      vec3 sdv = normalize(cross(tv, normalize(mvPosition.xyz)) + vec3(0., 1e-5, 0.));
      mvPosition.xyz += sdv * aSide.x * 1.3;
      vOP = p; vN = vec3(0., 1., 0.); vVN = vec3(0., 0., 1.); vVP = mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition; vClip = gl_Position.xyw;
      #include <fog_vertex>
    }`,`
    ${J}
    uniform vec3 uPeach; varying vec4 vS;
    void main(){
      float x = vS.x * 1.3, fw = fwidth(x);
      float lw = max(.10, .62*fw);
      float line = (1. - smoothstep(lw*.6, lw*1.25, abs(x))) * (1. - smoothstep(.9, 1., vS.z));
      float bx = (fract((vS.y - uTime*5.)/11. + vS.w) - .5)*11.;
      float bd = length(vec2(bx, x)), bead = (1. - smoothstep(.8, .95, bd)) * step(fw, .9) * step(.04, vS.z);
      if (max(line, bead) < .5) discard;
      vec3 c = mix(mix(uPencil, uPaper, clamp(.18 + fw*.5, .18, .55)), mix(uPaper, uPeach, .9) * (1. - .4*smoothstep(.5, .9, bd)), bead);
      gl_FragColor = vec4(c, 1.);
      ${te}
    }`,{side:e.DoubleSide}),v=new e.Mesh(F,S);return v.name="messenger",v.frustumCulled=!1,v}function Pe(f,s,d,r,t){const c=()=>r.range(-1,1),w=[[30+14*c(),16+4*c(),480],[22+10*c(),24+3*c(),400],[9+5*c(),35+2*c(),322],[0,46.8,245.1],[-42,40,214],[-104,22+6*c(),168],[-172,2+8*c(),98],[-232,-18+8*c(),0]];let g=0,l=null;if(t){const o=(t.bearingDeg??30)*Math.PI/180,n=w[2][0]-w[1][0],i=w[2][2]-w[1][2],u=Math.hypot(n,i),G=(n*Math.cos(o)-i*Math.sin(o))/u,U=(n*Math.sin(o)+i*Math.cos(o))/u,O=58,q=Math.max(2,Math.round(t.length/O));w.shift();const D=w[0];for(let E=1;E<=q;E++)w.unshift([D[0]-G*O*E+(E>1?5*c():0),D[1]-3.2*E+(E>1?2*c():0),D[2]-U*O*E]);g=q-1,l={position:h(D[0],D[1],D[2]),mainDir:h(G,.04,U).normalize()}}const p=3+g,b=w.map((o,n)=>{const i=h(o[0],o[1],o[2]);return n>p&&(i.sub(d),i.length()<324&&i.setLength(324),i.add(d)),i}),z=new e.CatmullRomCurve3(b,!1,"centripetal");z.arcLengthDivisions=600;const x=z.getLength(),M=Math.round(x/1.2),m=14,y=2.5;let B=0,I=1e9;const C=h(),F=h(),S=h(),v=h(),T=h(0,1,0);for(let o=0;o<=800;o++){z.getPointAt(o/800,C);const n=C.distanceTo(b[p]);n<I&&(I=n,B=o/800*x)}const A=(o,n)=>{const i=Math.min(1,Math.max(0,o/x));z.getPointAt(i,n.P),z.getTangentAt(i,n.T),n.S.crossVectors(n.T,T).normalize(),n.U.crossVectors(n.S,n.T);const u=o-i*x;return u!==0&&n.P.addScaledVector(n.T,u),n},k=[],V=[],R=[],_=[],P={P:C,T:F,S,U:v};for(let o=0;o<=M;o++){const n=o/M*x;A(n,P);for(let i=0;i<=m;i++){const u=i/m*Math.PI*2,G=Math.cos(u),U=Math.sin(u),O=S.x*G+v.x*U,q=S.y*G+v.y*U,D=S.z*G+v.z*U;k.push(C.x+O*y,C.y+q*y,C.z+D*y),V.push(O,q,D),R.push(n,u)}if(o<M)for(let i=0;i<m;i++){const u=o*(m+1)+i,G=u+1,U=u+m+1,O=U+1;_.push(u,U,G,G,U,O)}}const N=new e.BufferGeometry;N.setAttribute("position",new e.Float32BufferAttribute(k,3)),N.setAttribute("normal",new e.Float32BufferAttribute(V,3)),N.setAttribute("aSU",new e.Float32BufferAttribute(R,2)),N.setIndex(_);const j=[0,1,2,3].map(()=>new e.Vector4(0,0,-1,0)),W=ee(f,{uGreen:{value:s.green},uLen:{value:x},uFoot:{value:j}},`
    ${Z}
    attribute vec2 aSU; uniform float uLen; varying vec2 vSU;
    void main(){ vSU = aSU; vec3 n = normal;
      float cap = 1. - smoothstep(0., 7., min(aSU.x, uLen - aSU.x));
      vec3 p = position + normal * (.10*cos(aSU.x*1.309) - 2.45*cap*cap);
      ${oe} }`,`
    ${J}
    uniform vec3 uGreen; uniform vec4 uFoot[4]; varying vec2 vSU;
    void main(){
      vec3 n = normalize(vN); float s = vSU.x, a = vSU.y, b = s/4.8;
      vec3 pig = mix(uGreen, uGlaze, .68) * vec3(.9,1.,.95);
      pig *= mix(.9, 1.08, step(.5, fract(b*.5)));                           // alternate sleepers
      float braid = abs(fract(a*2.069 + s*.11) - .5);                        // 13 twisting strands
      pig *= 1. - .22*(1. - smoothstep(.04, .16, braid));
      float joint = abs(fract(b + .5) - .5)*4.8;                             // band every 4.8 m
      float e = max(edgeOf(vVN), .85*(1. - smoothstep(.10, .42, joint)));
      vec3 c = wash(pig, n, e, vOP, .22, .3);
      float top = smoothstep(0., .5, sin(a));
      for (int i = 0; i < 4; i++) {                                          // wet footprints that dry behind us
        vec4 f = uFoot[i]; float age = f.z;
        float dist = length(vec2(s - f.x, cos(a)*2.5 - f.y));
        float rr = .9 + age*.45, fade = step(0., age) * clamp(1. - age/4., 0., 1.);
        float m = (1. - smoothstep(rr*.55, rr, dist)) + .6*(1. - smoothstep(0., .22, abs(dist - rr)));
        c *= mix(vec3(1.), vec3(.42,.64,.62), clamp(m, 0., 1.)*fade*top);
      }
      gl_FragColor = vec4(c, 1.);
      ${te}
    }`),a=new e.Mesh(N,W);return a.name="microtubule",a.frustumCulled=!1,{mesh:a,curve:z,length:x,releaseS:B,frame:A,feet:j,radius:y,junction:l}}class me extends e.Curve{constructor(s){super(),this.ph=s}getPoint(s,d=new e.Vector3){const r=s*34+this.ph;return d.set(.085*Math.cos(r),s,.085*Math.sin(r))}}function ce(f,s,d,r,t,c){const w=f.index?f:fe(f),g=w.attributes.position.count,l=new Float32Array(g*2),p=new Float32Array(g*3);for(let b=0;b<g;b++){l[b*2]=s,l[b*2+1]=d;const z=1+t*(c()-.5);p[b*3]=r.r*z,p[b*3+1]=r.g*z,p[b*3+2]=r.b*z}return w.setAttribute("aPart",new e.Float32BufferAttribute(l,2)),w.setAttribute("color",new e.Float32BufferAttribute(p,3)),w.deleteAttribute("uv"),w}function Se(f,s,d,r,t){const c=[],w=s.vermilion,g=w.clone().multiplyScalar(.8),l=w,p=[[.001,0],[.34,.04],[.52,.28],[.53,.55],[.36,.86],[.16,1.1],[.115,1.45],[.14,1.62],[.27,1.74],[.29,1.88],[.18,2],[.001,2.04]].map(a=>new e.Vector2(a[0],a[1])),b=new e.LatheGeometry(new e.SplineCurve(p).getPoints(22),16);b.scale(1.1,1,.85),b.computeVertexNormals(),c.push(ce(b,0,0,w,.06,r));for(let a=0;a<2;a++){const o=new e.SphereGeometry(1,16,10),n=o.attributes.position;for(let i=0;i<n.count;i++){let u=n.getX(i)*.36,G=n.getY(i)*.3,U=n.getZ(i)*.8;const O=U/.8;u*=1-.22*O*O+.12*O,u+=(a?-1:1)*.1*(O*O-.4),G=Math.max(G,-.14)+.14+.1*Math.max(0,O)*Math.max(0,O),n.setXYZ(i,u,G,U)}o.computeVertexNormals(),c.push(ce(o,0,1+a,g,.06,r))}for(let a=0;a<2;a++){const o=new e.CylinderGeometry(1,1,1,7,18,!0);o.translate(0,.5,0);const n=o.attributes.position;for(let i=0;i<n.count;i++){const u=n.getY(i),G=.115+.04*Math.sin(u*44)+.045*Math.pow(Math.abs(u-.5)*2,3);n.setX(i,n.getX(i)*G),n.setZ(i,n.getZ(i)*G)}o.computeVertexNormals(),c.push(ce(o,1,a,w.clone().multiplyScalar(.62),.05,r))}c.push(ce(new e.TubeGeometry(new me(0),56,.05,4),1,2,s.pencil,0,r)),c.push(ce(new e.TubeGeometry(new me(Math.PI),56,.06,4),1,2,s.teal.clone().lerp(s.green,.5),0,r));const z=t.cargoColors||[s.peach,s.lilac,s.green,s.peach,s.lilac];if(t.bubble!==!1)for(let a=0;a<5;a++){const o=new e.SphereGeometry(r.range(.08,.15),9,7),n=r.range(.5,.82),i=(a%2?1:-1)*(.16+.1*a+r.range(0,.08)),u=r.range(2.9,3.12);o.translate(u*Math.sin(n)*Math.sin(i),u*Math.cos(n),u*Math.sin(n)*Math.cos(i)),c.push(ce(o,0,3,z[a],.04,r))}const x=pe(c),M=[0,1,2,3].map(()=>new e.Matrix4),m=Array.from({length:9},()=>h()),y={value:1},B={value:1},I=ee(f,{uM:{value:M},uBz:{value:m},uTether:y,uWs:B},`
    ${Z}
    attribute vec2 aPart; attribute vec3 color; uniform mat4 uM[4]; uniform vec3 uBz[9]; uniform float uTether, uWs; varying vec3 vCol;
    void main(){
      vec3 p, n; int k = int(aPart.y + .5); vCol = color;
      if (aPart.x < .5) {
        mat4 M = uM[k]; vec3 lp = position;
        if (k == 3) lp += .14*sin(uTime*vec3(5.1, 6.3, 4.7) + position.yzx*4.);       // cargo jiggle
        p = (M*vec4(lp, 1.)).xyz; n = normalize(mat3(M)*normal);
      } else {
        vec3 A = uBz[k*3], B = uBz[k*3 + 1], Cc = uBz[k*3 + 2]; float t = position.y, w = 1.;
        if (k == 2) { t = 1. - (1. - t)*uTether; w = smoothstep(0., .15, uTether); } else w = uWs;
        float u = 1. - t; vec3 ctr = u*u*A + 2.*u*t*B + t*t*Cc;
        vec3 tg = normalize(2.*u*(B - A) + 2.*t*(Cc - B) + vec3(0., 1e-4, 0.));
        vec3 e1 = normalize(cross(tg, uM[0][0].xyz) + vec3(1e-4, 0., 0.)), e2 = cross(e1, tg);
        p = ctr + (e1*position.x + e2*position.z)*w; n = normalize(e1*normal.x + e2*normal.z + tg*normal.y);
      }
      ${oe}
      vOP = position*1.3 + aPart.y*3.7 + aPart.x*11.;
    }`,`
    ${J}
    varying vec3 vCol;
    void main(){
      vec3 n = normalize(vN);
      vec3 c = wash(vCol, n, edgeOf(vVN), vOP, .9, .7);
      c = mix(c, vCol*(.60 + .40*smoothstep(-.4, .5, dot(n, uLight))), .5);   // the accent is laid on thick
      gl_FragColor = vec4(c, 1.);
      ${te}
    }`),C=new e.Mesh(x,I);C.name="walker",C.frustumCulled=!1;const F=new e.Group;F.name="vehicle",F.add(C);let S=null;if(t.bubble!==!1){const a=ee(f,{uGreen:{value:t.bubbleTint?H(t.bubbleTint):s.green},uForm:{value:1},uLat:{value:0},uGouache:{value:t.gouache?1:0}},`
      ${Z}
      void main(){ vec3 n = normal;
        vec3 p = position * (1. + .018*sin(uTime*2.3 + position.y*1.4) + .012*sin(uTime*3.1 + position.x*1.9)); ${oe} }`,`
      ${J}
      uniform vec3 uGreen; uniform float uForm, uLat, uGouache;
      float hexEdge(vec2 p){ vec2 r = vec2(1., 1.732), h = r*.5; vec2 a = mod(p, r) - h, b = mod(p - h, r) - h;
        vec2 gv = abs(dot(a, a) < dot(b, b) ? a : b); return .5 - max(dot(gv, vec2(.5, .866)), gv.x); }
      void main(){
        vec3 n = normalize(vN); float e = edgeOf(vVN);
        float l = dot(n, uLight) + (fbm(vOP*.5) - .5)*.5;
        float dens = .12 + .12*smoothstep(.3, .1, l) + .62*e*e*e + .10*vn(vOP*3.);
        dens *= 1. - smoothstep(.62, .74, l);                                          // paper crescent
        dens *= uForm;
        vec3 tint = mix(vec3(1.), charge(uGreen*vec3(.8, 1., .95), wcNear()*(.25 + .75*e*e*e), 0.), clamp(dens, 0., 1.));   // the same charge as every wash: deepest where it pools at the rim
        tint *= 1. - .46*smoothstep(.86, .95, e + (vn(vOP*1.5 + floor(uTime*4.)*3.) - .5)*.1);   // pencil rim
        vec3 dd = normalize(vOP + vec3(1e-4, 0., 0.));                                 // pencil hexagons: the coat it is sketched in
        float he = hexEdge(vec2(atan(dd.z, dd.x)*2.865, asin(clamp(dd.y, -1., 1.))*3.3));
        tint *= 1. - .5*uLat*(1. - smoothstep(.035, .09, he + (vn(vOP*2. + floor(uTime*4.)*5.) - .5)*.04))*smoothstep(1., .8, abs(dd.y));
        float ff = 0.;
        #ifdef USE_FOG
          #ifdef FOG_EXP2
            ff = 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
          #else
            ff = smoothstep(fogNear, fogFar, vFogDepth);
          #endif
        #endif
        if (uGouache > .5) gl_FragColor = vec4(uGreen*(1. - min(tint.r, min(tint.g, tint.b)))*(1. - ff)*.9, 1.);   // pale body colour, screened on
        else gl_FragColor = vec4(mix(tint, vec3(1.), ff), 1.);
      }`,{transparent:!0,depthWrite:!1,blending:e.CustomBlending,blendEquation:e.AddEquation,blendSrc:t.gouache?e.OneMinusDstColorFactor:e.ZeroFactor,blendDst:t.gouache?e.OneFactor:e.SrcColorFactor,blendSrcAlpha:e.ZeroFactor,blendDstAlpha:e.OneFactor});S=new e.Mesh(new e.SphereGeometry(3.5,36,22),a),S.frustumCulled=!1,S.name="bubble",S.renderOrder=5,F.add(S)}const v={P:h(),T:h(),S:h(),U:h()},T=h(),A=[h(),h()],k=h(),V=h(),R=new e.Matrix4,_=h(),P=.35,N=a=>a*a*(3-2*a),j={s:0,position:h(),lens:h()};function W(a,o,n={}){const i=a/4.8,u=n.walker??1;j.s=a,B.value=u,d.frame(a,v);const G=.13*Math.cos(i*Math.PI*2),U=.12*Math.sin(i*Math.PI);T.copy(v.P).addScaledVector(v.U,d.radius+(1.22+G)*u).addScaledVector(v.S,U),M[0].makeBasis(_.copy(v.S).negate(),v.U,v.T).multiply(R.makeRotationX(.16+.08*Math.sin(i*Math.PI*2))).scale(k.setScalar(u)).setPosition(T),j.position.copy(T),j.lens.copy(v.P).addScaledVector(v.T,-7).addScaledVector(v.U,7.5);for(let L=0;L<2;L++){const K=L?1:-1,Q=i-L,ne=Math.floor(Q/2),Y=Q-2*ne,ae=(2*ne+L+1)*4.8;let se=ae,ue=0,ie=K*.55*u,le=0;if(Y>2-P){const X=(Y-(2-P))/P,re=Math.max(0,X-.72)/.28;se=ae+9.6*N(X),ue=1.5*Math.sin(Math.PI*X)*(1-.25*X),ie+=K*.75*Math.sin(Math.PI*X)+.22*Math.sin(re*16)*re*(1-re)*4,le=-.42*Math.sin(Math.PI*Math.min(1,X*1.3))+.3*Math.sin(re*14)*re*(1-re)*4}d.frame(se,v),k.copy(v.P).addScaledVector(v.U,d.radius+.08+ue).addScaledVector(v.S,ie),M[1+L].makeBasis(_.copy(v.S).negate(),v.U,v.T).multiply(R.makeRotationX(le)).scale(_.setScalar(u)).setPosition(k),A[L].copy(k).addScaledVector(v.U,.42*u).addScaledVector(v.T,-.12),d.feet[L*2].set(ae,K*.55*u,Y,0),d.feet[L*2+1].set(ae-9.6,K*.55*u,Y+2,0),Y>2-P&&(d.feet[L*2].z=Y)}d.frame(a,v);for(let L=0;L<2;L++){const K=L?1:-1,Q=m[L*3],ne=m[L*3+1];Q.copy(T).addScaledVector(v.S,K*.3*u).addScaledVector(v.U,.18*u);const Y=Q.distanceTo(A[L]);ne.copy(Q).add(A[L]).multiplyScalar(.5).addScaledVector(v.U,.5+.22*Y).addScaledVector(v.S,K*.3),m[L*3+2].copy(A[L])}n.bubble?V.copy(n.bubble):(d.frame(a-10.5-.4*Math.sin(i*Math.PI*2+1.2),v),V.copy(v.P).addScaledVector(v.U,6.4+.18*Math.sin(o*1.9)).addScaledVector(v.S,.3*Math.sin(o*1.1)));const O=n.scale??1;n.bubbleBasis?M[3].copy(n.bubbleBasis).setPosition(V):M[3].makeTranslation(V.x,V.y,V.z),O!==1&&M[3].scale(k.setScalar(Math.max(O,.001))),S&&(S.position.copy(V),S.scale.setScalar(Math.max(O,.001))),y.value=n.tether??1;const q=m[6],D=m[7],E=m[8];q.set(0,1.98,0).applyMatrix4(M[0]),E.copy(q).sub(V).normalize().multiplyScalar(3.45*O).add(V),D.copy(q).add(E).multiplyScalar(.5),D.y-=.5+.45*Math.sin(i*Math.PI*2+.6)}return{object:F,walker:C,bubble:S,pose:W,state:j}}async function Fe(f,s={}){const d=f.rng,r=s.palette&&s.palette.length>=7?s.palette:ge,t=(P,N,j,W)=>P.clone().offsetHSL(N,j,W),c=d.range(-.018,.018),w=d.range(-.02,.02),g={paper:H(r[0]),green:t(H(r[1]),c,0,0),lilac:t(H(r[2]),w,0,0),peach:t(H(r[3]),c*.5,0,0),teal:H(r[4]),pencil:H(r[5]),vermilion:H(r[6])};g.rose=g.lilac.clone().lerp(g.peach,d.range(.3,.45)).offsetHSL(0,.08,-.03);const l={uTime:{value:0},uPaper:{value:g.paper},uGlaze:{value:g.teal},uPencil:{value:g.pencil},uLight:{value:h(-.55,.72,.42).normalize()},uHi:{value:H(s.highlight||r[0])},uWet:{value:s.wet??.5},uPx:{value:1},uBgA:{value:H(r[1])},uBgB:{value:H(r[2])},uBgMoon:{value:h(0,.3,-1).normalize()},uBgK:{value:0},uFogD:{value:0},uFrame:{value:s.gouache?.45:.8},uPoolK:{value:s.gouache?0:1},uBgDeep:{value:0},uGouK:{value:s.gouache?1:0},uBody:{value:s.gouache?0:1}},p=h(0,$,0),b=h(0,-Math.sin(he),Math.cos(he)),z={value:0},x=new e.Group;x.name="cell-highway-hero",await f.yield?.(),x.add(we(l,g,p,b,d.fork("nucleus"))),await f.yield?.();const M=be(l,g,p,b,d.fork("pores"),z);M.meshes.forEach(P=>x.add(P)),await f.yield?.(),x.add(ye(l,g,p,b,d.fork("ribbons"))),await f.yield?.(),x.add(Me(l,g,p,b,M,d.fork("threads"))),await f.yield?.();const m=Pe(l,g,p,d.fork("tube"),s.lead);x.add(m.mesh),await f.yield?.();const y=s.vehicle===!1?null:Se(l,g,m,d.fork("vehicle"),s);y&&x.add(y.object),await f.yield?.();const B=p.clone().addScaledVector(b,$+.2);let I=null;s.portalStandIn!==!1&&(I=new e.Mesh(new e.CircleGeometry(7.4,40),ee(l,{uA:{value:g.peach},uB:{value:g.lilac}},`
      ${Z}
      varying vec2 vL;
      void main(){ vL = position.xy; vec3 p = position; vec3 n = normal; ${oe} }`,`
      ${J}
      uniform vec3 uA, uB; varying vec2 vL;
      void main(){
        float r = length(vL)/7.4; vec3 q = vec3(vL*.22, uTime*.12);
        float a = fbm(q + fbm(q*1.7 + 4.)*1.5), b = fbm(q*1.3 - 9.);
        vec3 c = mix(vec3(1., .78, .36), vec3(.30, .78, 1.), smoothstep(.38, .62, a));
        c = mix(c, vec3(1., .42, .62), smoothstep(.48, .7, b)*.7);
        c *= 1.15 * (1. - .4*r*r);
        gl_FragColor = vec4(c, 1.);
        ${te}
      }`)),I.position.copy(p).addScaledVector(b,$-.9),I.quaternion.setFromUnitVectors(h(0,0,1),b),I.name="portalStandIn",x.add(I));const C=p.clone().addScaledVector(b,$+60),F={P:h(),T:h(),S:h(),U:h()},S=[];for(let P=0;P<m.releaseS-20;P+=30)m.frame(P,F),S.push(F.P.clone().addScaledVector(F.U,7.5));S.push(C.clone(),p.clone().addScaledVector(b,$+30),B.clone()),m.frame(m.releaseS-120,F);const v={portalSeat:{position:B.clone(),normal:b.clone(),radius:7,pitchDeg:40},release:C,flyThrough:S,tube:{curve:m.curve,length:m.length,radius:m.radius,releaseS:m.releaseS,bandLength:4.8},viewpoints:{reveal:{position:F.P.clone().addScaledVector(F.U,7.5),target:p.clone().add(h(0,-60,0))},lowFront:{position:h(0,30,560),target:p.clone()},side:{position:h(430,190,340),target:p.clone()}},lensOffset:{behind:7,above:7.5},nucleus:{center:p.clone(),radius:$}};let T=!1,A=0,k={};const V=30,R=m.releaseS+50-V,_={object:x,radius:300,height:2*$,center:p.clone(),anchors:v,ground:!1,groundY:0,vehicle:y?{object:y.object,walker:y.walker,bubble:y.bubble,state:y.state}:null,portalStandIn:I,shared:l,pal:g,tubeFrame:m.frame,junction:m.junction,setProgress(P){z.value=Math.min(1,Math.max(0,P))},setWalker(P,N={}){T=!0,A=P,k=N},update(P,N){l.uTime.value=N,y&&(T?y.pose(A,N,k):y.pose(V+N*12%R,N))},dispose(){}};return _.update(0,0),_}export{Ae as WC,Fe as buildHero};
