import*as t from"three";const M=Math.PI*2,nt=(a,e,r)=>Math.min(r,Math.max(e,a)),z=(a,e,r)=>a+(e-a)*r,P=(a,e,r)=>{const o=nt((r-a)/(e-a),0,1);return o*o*(3-2*o)},ge=["#B9D532","#6DB33F","#1E5B3C","#7B4A2A","#3E8FC6","#E1262D","#F6EED8"];function Re(a=ge){const e=a&&a.length>=7?a:ge,r={lime:e[0],spring:e[7]||"#8FC741",leaf:e[1],fern:e[8]||"#3D8B40",bottle:e[2],bark:e[3],mist:"#FBFAF4",stream:e[4],scarlet:e[5],cream:e[6],stain:"#C9CCD8"},o={hex:r};for(const i in r)o[i]=new t.Color(r[i]);return o}function Pe(){return{uTime:{value:0},uU:{value:0},uSun:{value:new t.Vector3(-.5,.42,.75).normalize()},uCream:{value:new t.Color("#F6EED8")},uStain:{value:new t.Color("#C9CCD8")},uPx:{value:.0026},uTint:{value:new t.Vector2(150,400)},uFrost:{value:0}}}const ye=`
uniform float uTime, uU, uPx;
uniform vec3 uSun, uCream;
uniform vec2 uTint;
vec3 quillTint(vec3 paper, float stepSel, float dist) {
  float s = stepSel < 0. ? smoothstep(uTint.x - 12., uTint.x + 12., dist) + smoothstep(uTint.y - 20., uTint.y + 20., dist) : stepSel;
  float k = 0.27 * min(s, 1.) + 0.2 * clamp(s - 1., 0., 1.);   // the two paler tints, held full enough that the far wood keeps its greens
  // mixed as pigments on the screen (in gamma space): a far paper is the same paper printed paler, a far green still green and a
  // far bark still brown (a linear mix let the cream's light swamp the dark papers into grey)
  return pow(mix(pow(max(paper, vec3(1e-5)), vec3(0.4545)), pow(max(uCream, vec3(1e-5)), vec3(0.4545)), k), vec3(2.2));
}
float quillThick(float nominal, float maxT, float dist) {
  return min(max(nominal, 2.2 * uPx * dist), max(maxT, nominal));
}
// tight windings: when the gap between turns is under ~3 pixels the caps close up into one flat lid in the
// average tint (returned in solid 0..1), so a far peg is a flat disc and never a moire.
float quillThickP(float nominal, float pitch, float dist, out float solid) {
  float px = max(uPx * dist, 1e-5);
  solid = 1. - smoothstep(2.6, 4.0, pitch / px);
  float open = min(max(nominal, 2.2 * px), max(min(0.5 * pitch, 0.9), nominal));
  return mix(open, pitch * 1.2, solid);
}
// a tight coil let go: leaps, overshoots, settles in three wobbles. x = time since release / spring time.
float quillSpring(float x) {
  float t = max(x, 0.);
  return x <= 0. ? 0. : 1. - exp(-4.2 * t) * cos(9.2 * t);
}
// an open frond rolling itself shut: eases in, snaps the last of the way, one small rebound. x as above.
float quillWind(float x) {
  float t = clamp(x, 0., 1.), r = max(x - 1., 0.);
  return t * t * (3. - 2. * t) + 0.05 * exp(-5. * r) * sin(11. * r);
}
`,Me=`
uniform float uTime, uPx;
uniform vec3 uSun, uCream, uStain;
uniform float uFrost;
uniform vec2 uTint;
varying vec3 vPaper, vWN, vWP;
varying vec4 vSurf;
varying float vSolid;
vec3 quillLighter(vec3 c, float steps) { return pow(max(c, vec3(1e-4)), vec3(pow(0.787, steps))); }
vec3 quillGlow(vec3 c) { return mix(c, pow(max(c, vec3(1e-4)), vec3(0.6)) * mix(vec3(1.06, 1.0, 0.72), vec3(0.9, 1.0, 0.97), uFrost), mix(0.6, 0.35, uFrost)); }
float quillHash(float n) { return fract(sin(n * 91.345) * 47453.5453); }
vec3 quillShade() {
  vec3 toCam = cameraPosition - vWP;
  float dist = length(toCam);
  vec3 V = toCam / max(dist, 1e-4);
  float nl = length(vWN);
  vec3 N = nl > 1e-5 ? vWN / nl : vec3(0., 1., 0.);
  if (dot(N, V) < 0.) N = -N;                      // the side of the paper we are looking at
  // first frost whitens every top edge; far off it is held to less than half, so a far coil is still a green loop
  // vSolid carries two things: 0..1 how far the windings have closed into a lid, and +2 for a strip that keeps its own
  // paper's edge in first frost (the exit ring). Scarlet paper never frosts either: the butterflies stay the one accent.
  float noFrost = step(1.5, vSolid), solidK = clamp(vSolid - 2. * noFrost, 0., 1.);
  float scarlet = smoothstep(6., 12., vPaper.r / max(vPaper.g, 1e-3));
  float frostK = uFrost * (1. - noFrost) * (1. - 0.85 * scarlet);
  vec3 edge = mix(quillLighter(vPaper, 2.), vec3(0.965, 0.955, 0.905), frostK * (1. - 0.6 * smoothstep(uTint.x * 0.45, uTint.x, dist)));
  float lidK = 1. - solidK;                           // where the windings have closed into a flat lid, no line and no burr
  if (vSurf.z > 0.5) return mix(edge, mix(vPaper, edge, 0.3), solidK);   // top edge: the style's line
  vec3 col = vPaper;
  // the hand: every 131 m of strip a glued overlap, double paper (no glow) with a step at its end
  float sp = mod(vSurf.x, 131.), fx = max(fwidth(vSurf.x), 1e-5), fy = max(fwidth(vSurf.y), 1e-5);
  float lap = step(sp, 2.2) * step(8., vSurf.w);
  // glow-through: sun on the far side of this face, eased as the face turns
  float back = smoothstep(0.08, 0.75, -dot(N, uSun)) * (1. - 0.75 * lap);
  col = mix(col, quillGlow(col), back);
  col *= 1. - 0.16 * lap * (1. - smoothstep(0.05, 0.05 + fx * 1.5, abs(sp - 2.2)));
  // laid paper: close lines along the strip, chain lines across it, a faint tooth; gone by 80 m
  float near = 1. - smoothstep(25., 80., dist), close = 1. - smoothstep(6., 30., dist);
  float ly = abs(fract(vSurf.y / 0.3) - 0.5) * 0.3;
  float laid = (1. - smoothstep(0.025, 0.025 + fy * 1.5, ly)) * (1. - smoothstep(0.06, 0.15, fy));
  float lx = abs(fract(vSurf.x / 2.6) - 0.5) * 2.6;
  float chain = (1. - smoothstep(0.035, 0.035 + fx * 1.5, lx)) * (1. - smoothstep(0.1, 0.4, fx));
  vec2 tc = floor(vec2(vSurf.x, vSurf.y) / 0.045);
  float tooth = quillHash(tc.x * 1.37 + tc.y * 57.1) * (1. - smoothstep(0.012, 0.04, max(fx, fy)));
  float wide = clamp(vSurf.w / 9., 0.25, 1.);
  col *= 1. - wide * near * (0.08 + 0.05 * close) * laid - wide * near * (0.10 + 0.05 * close) * chain - close * 0.07 * (tooth - 0.5);
  // burr: the cut edges catch the light, raggedly
  float cell = vSurf.x / 0.31;
  float rag = mix(quillHash(floor(cell)), quillHash(floor(cell) + 1.), smoothstep(0., 1., fract(cell)));
  float bw = (0.07 + 0.3 * rag * rag) * min(vSurf.w / 4., 1.5) + fy * 1.5;
  float burr = (1. - smoothstep(bw * 0.55, bw, vSurf.w - vSurf.y)) + 0.7 * (1. - smoothstep(bw * 0.4, bw * 0.8, vSurf.y));
  col = mix(col, edge, clamp(burr, 0., 1.) * 0.7 * (1. - smoothstep(70., 160., dist)) * lidK);
  // the line: the top cap lies flat and a low or distant eye sees it edge-on, thinner than a pixel, so the top of the
  // face carries the same light edge, never under 2.3 pixels: a far coil is drawn as its edge line at any height of eye
  float lw = min(max(0.1, 2.3 * fy), 0.45 * vSurf.w);
  col = mix(col, edge, (1. - smoothstep(lw, lw + fy, vSurf.w - vSurf.y)) * lidK);
  // under a closed lid the top of every face takes the lid's own tint, so nothing darker or lighter peeps between the caps
  col = mix(col, mix(vPaper, edge, 0.3), (1. - lidK) * smoothstep(0.5, 0.7, vSurf.y / max(vSurf.w, 1e-4)));
  return col;
}
`;function Nt(a=40,e=!1,r=1){const o=e?2:6,i=a+1,c=new Float32Array(i*o*4),h=[];for(let u=0;u<i;u++){const b=Math.pow(u/a,r),s=u*o*4;if((e?[[-1,1,1],[1,1,1]]:[[1,0,0],[1,1,0],[-1,0,0],[-1,1,0],[1,1,1],[-1,1,1]]).forEach((m,x)=>{c[s+x*4]=b,c[s+x*4+1]=m[0],c[s+x*4+2]=m[1],c[s+x*4+3]=m[2]}),u<a){const m=u*o,x=m+o;e?h.push(m,m+1,x,x,m+1,x+1):h.push(m,x,m+1,m+1,x,x+1,m+2,m+3,x+2,x+2,m+3,x+3,m+4,m+5,x+4,x+4,m+5,x+5)}}const w=new t.BufferGeometry;return w.setAttribute("aQ",new t.BufferAttribute(c,4)),w.setAttribute("position",new t.BufferAttribute(new Float32Array(i*o*3),3)),w.setIndex(h),w.boundingSphere=new t.Sphere(new t.Vector3,1e5),w}const Ce=`
attribute vec4 aQ, iA, iB, iC, iD, iE, iPaper;
varying vec3 vPaper, vWN, vWP;
varying vec4 vSurf;
varying float vSolid;
vec3 quillCoil(float t, float o) {
  float T = mix(iC.x, iA.x, o), R = mix(iC.y, iA.y, o);
  float rin = mix(0.12, iC.z, o);
  float ph = 6.2831853 * T * t;
  float r = R * mix(1., rin, t);
  float ecc = iB.z * o;
  vec2 p = r * vec2(cos(ph), sin(ph)) + vec2(ecc * (R - r), 0.);
  float late = smoothstep(0.45, 1., o);
  float xn = clamp((R - p.x) / max(2. * R, 1e-4), 0., 1.);
  float tear = min(1.3 * pow(xn + 1e-4, 0.7), 1.);
  float marq = pow(4. * xn * (1. - xn) + 1e-4, 0.6);
  p.y *= mix(1., tear, iB.x * late) * mix(1., marq, iB.y * late);
  float el = mix(1., iC.w, late);
  p.x = (R - p.x) * el - R * (1. - ecc) ;           // glue point at the origin when eccentric, centre when not
  float rr = clamp(r / max(R, 1e-4), 0., 1.);
  float prof = iB.w < 0. ? sqrt(max(1. - rr * rr, 0.)) : 1. - rr;   // lift > 0: cone; lift < 0: dome of that height
  return vec3(p, abs(iB.w) * prof * mix(0.2, 1., o));
}
vec2 quillSpiralArm(float tau, float o) {
  float T = max(mix(iC.x, iA.x, o), 0.02), Th = 6.2831853 * T;
  float rt = mix(iC.y, iA.y, o), L = iE.y * (iE.x > 2.5 ? mix(1., smoothstep(0.08, 0.95, o), iE.z) : 1.);   // a frond that winds shut draws its stem in
  float th = Th * tau, k = 1. - tau;
  float r = rt * mix(1., 0.25, tau) + L * k * k * k;
  float r0 = rt + L, dr0 = -3. * L / Th - 0.75 * rt / Th;
  vec2 q = r * vec2(cos(th), sin(th)) - vec2(r0, 0.);
  float il = 1. / max(length(vec2(dr0, r0)), 1e-4);
  float c = dr0 * il, s = r0 * il;                    // rotate so the arm leaves the origin along +X
  return vec2(c * q.x + s * q.y, -s * q.x + c * q.y);
}
vec3 quillShape(float t, float o) {
  if (iE.x < 0.5) return quillCoil(t, o);
  if (iE.x > 2.5) return vec3(quillSpiralArm(t, o), 0.);
  float sg = t < 0.5 ? -1. : 1.;
  float oa = iE.x < 1.5 ? clamp(o + sg * iE.z * sin(uTime * 0.33 + iD.w), 0.04, 1.3) : o;   // S scroll: one end rolls up as the other unrolls
  vec2 q = quillSpiralArm(abs(2. * t - 1.), oa);
  if (iE.x < 1.5) return vec3(sg * q, 0.);            // S scroll: point symmetry
  float ca = cos(iE.z), sa = sin(iE.z);
  vec2 a = vec2(ca * q.x - sa * q.y, sa * q.x + ca * q.y);   // V scroll: mirrored arms, coils rolled outward
  a.y *= sg;
  return vec3(a, 0.);
}
void main() {
  float o = iD.x;
  if (iD.y >= 0.) {
    float sx = (uU - iD.y) / max(abs(iD.z), 1e-4);
    // springU > 0: a tight coil let go (the king's own); springU < 0: an open one winding shut as we pass
    // once shut it is shy: it peeps out a quarter of the way and rolls back, each to its own slow beat (time)
    float peek = 0.25 * (0.5 + 0.5 * sin(uTime * 1.3 + iD.w * 1.7)) * smoothstep(1.2, 2.4, sx);
    o = iD.z < 0. ? max(mix(1., iD.x + peek, quillWind(sx)), 0.) : mix(o, 1., quillSpring(sx));
  }
  o *= 1. + 0.035 * iE.w * sin(uTime * (0.9 + 0.5 * max(iE.w - 2., 0.)) + iD.w) * smoothstep(0.2, 0.4, o);   // crowns in the rush (breath over 2) toss faster
  float t = aQ.x;
  // shrink (iE.z on a coil): a leaflet that is drawn in to nothing as it winds shut
  float sc = iE.x < 0.5 ? mix(1., smoothstep(0.1, 0.9, o), iE.z) : 1.;
  vec3 p = quillShape(t, o) * sc;
  float e = 0.004;
  vec3 pa = quillShape(max(t - e, 0.), o) * sc, pb = quillShape(min(t + e, 1.), o) * sc;
  vec2 tg = pb.xy - pa.xy;
  float tl = length(tg);
  tg = tl > 1e-6 ? tg / tl : vec2(1., 0.);
  vec2 nrm = vec2(-tg.y, tg.x);
  mat4 M = modelMatrix * instanceMatrix;
  vec3 org = (M * vec4(0., 0., 0., 1.)).xyz;
  float dist = length(cameraPosition - (M * vec4(p, 1.)).xyz);
  float Tn = mix(iC.x, iA.x, o), Rn = mix(iC.y, iA.y, o);
  float pitch = iE.x < 0.5 ? Rn * (1. - mix(0.12, iC.z, o)) / max(Tn, 0.05) : max(4., 0.6 * Rn / max(Tn, 0.05));   // a scroll's tip coil; the sky's cloud scrolls are wound 20 m apart
  float solid = 0.;
  float th = quillThickP(iA.w, pitch, dist, solid);
  float keep = step(9.5, iPaper.a);                    // tint + 10: this strip keeps its own edge in first frost
  vSolid = solid + 2. * keep;
  vec3 lp = p + vec3(nrm * (aQ.y * th * 0.5 * min(sc * 4., 1.)), aQ.z * iA.z * sc);
  lp.xy += tg * ((aQ.z - 0.5) * min(0.2 * iA.z, 0.5) * sc * (step(t, 0.0005) - step(0.9995, t)));   // the hand: ends cut a little off square
  vec4 wp = M * vec4(lp, 1.);
  vWP = wp.xyz;
  vWN = mat3(M) * (aQ.w > 0.5 ? vec3(0., 0., 1.) : vec3(nrm * aQ.y, 0.));
  float len = 6.2831853 * mix(iC.x, iA.x, o) * mix(iC.y, iA.y, o) * 0.6 + iE.y;
  vSurf = vec4(t * len + iD.w * 3.7, aQ.z * iA.z, aQ.w, iA.z);
  vPaper = quillTint(iPaper.rgb, iPaper.a - 10. * keep, length(cameraPosition - org));
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;function qe(a,e={}){return new t.ShaderMaterial({uniforms:{...a,...e},vertexShader:ye+Ce,fragmentShader:Me+"void main(){ gl_FragColor = vec4(quillShade(), 1.); }",side:t.DoubleSide})}const Be={coil:0,s:1,v:2,arc:3};function It(a,e,r){const o=a.clone(),i=["iA","iB","iC","iD","iE","iPaper"],c={};for(const u of i)c[u]=new Float32Array(r*4),o.setAttribute(u,new t.InstancedBufferAttribute(c[u],4));const h=new t.InstancedMesh(o,e,r);h.frustumCulled=!1;const w=new t.Matrix4().makeScale(0,0,0);for(let u=0;u<r;u++)h.setMatrixAt(u,w);return o.getAttribute("iD").setUsage(t.DynamicDrawUsage),{mesh:h,count:r,set(u,b,s={}){h.setMatrixAt(u,b);const y=s.paper||new t.Color("#6DB33F"),m=u*4,x=s.turns??4,B=s.radius??2;c.iA.set([x,B,s.width??3,s.thick??.12],m),c.iB.set([s.tear??0,s.marquise??0,s.ecc??0,s.lift??0],m),c.iC.set([s.tightTurns??x*1.8,s.tightRadius??B*.35,s.inner??.3,s.elong??1],m),c.iD.set([s.open??1,s.trigger??-1,s.springU??.012,s.phase??u*1.7],m),c.iE.set([Be[s.kind]??0,s.stem??0,s.kind==="v"?s.vAngle??.5:s.kind==="s"?s.sway??0:s.shrink??0,s.breath??1],m),c.iPaper.set([y.r,y.g,y.b,(s.tint??-1)+(s.noFrost?10:0)],m)},openness(u,b){c.iD[u*4]=b},commit(){o.getAttribute("iD").needsUpdate=!0},commitAll(){for(const u of i)o.getAttribute(u).needsUpdate=!0;h.instanceMatrix.needsUpdate=!0}}}const Qt=Math.PI/6,_t=44,St=9,pt=new t.Vector3(1,0,0),lt=new t.Vector3(0,Math.sin(Qt),-Math.cos(Qt)),At=new t.Vector3(0,Math.cos(Qt),Math.sin(Qt)),ct=62,Kt=14,Vt=19,Ht=35,ee=.84,xt=Kt/M,ae=(ct-Vt)/xt,Ut=M*1.75,ue=a=>ct*a-.5*xt*a*a,jt=ue(ae),ft=ue(Ut),vt=205,De=Math.PI*(ct-xt*Ut),Ne=(a,e)=>a<=0?0:a<e?a*a/(2*e):a-e/2,Yt=a=>.153*Ne(a-70,50),Ie=1.15,be=a=>vt*(1-Math.pow(1-a,Ie)),_e=.3,Ue=.1,We=.5,Oe=4.2,Se=a=>z(Vt+.5,3.6,nt(Math.pow(nt(a,0,1),.6)+.2*P(0,.06,a)*(1-P(.08,.4,a)),0,1))*(1-.5*P(.9,1,a)),Le=a=>z(1.5,1.8,P(0,.3,a)),oe=a=>a<=0?0:1-Math.exp(-4.2*a)*Math.cos(9.2*a),Xt=a=>Qt*P(40,95,a),Wt=(a,e)=>e.copy(At).multiplyScalar(Math.cos(a)).addScaledVector(lt,Math.sin(a)),Ge=.42,de=1.3,Rt=48,Qe=.25/(Math.PI/(2*9.2)),Ae=Qe/12;function Ke(a,e,r){const o=new Float32Array(Rt+1),i=e+r+1,c=36+Math.floor(a()*5),h=-Math.PI/2+a.range(.3,1),w=[a.range(0,M),a.range(0,M),a.range(.6,1.1)],u=new Float32Array(i),b=new Float32Array(i),s=new Float32Array(i),y=new Float32Array(i),m=ee/(4*Math.PI),x=n=>(Ht-Math.sqrt(Math.max(Ht*Ht-4*m*n,0)))/(2*m),B=x(jt),K=Ht-ee*B/M;for(let n=0;n<i;n++)if(n<=e)u[n]=ae*n/e,b[n]=ue(u[n]),s[n]=x(b[n]),y[n]=0;else{const A=(n-e)/r;y[n]=A,u[n]=ae+A*M*c,s[n]=B+A*M*c,b[n]=jt+A*600}const $=new Float64Array(i),V=new Float64Array(i),D=new Float64Array(i),C=new Float64Array(i),I=new Float64Array(i),ht=new Float64Array(i),H=new Float64Array(i),R=new Float64Array(i),rt=new Float64Array(i),ot=new Float64Array(i);let _=!1;const O=()=>{_=!0;for(let n=0;n<i;n++){const A=Math.min(b[n]/jt,1),k=y[n],E=k>0?z(K,.7,k):Ht-ee*s[n]/M,W=.48*P(1,.92,k),q=M*E/4.3+w[1],F=E+W*Math.sin(q),Z=1+.035*w[2]*Math.sin(u[n]*.37+w[0])*(1-k),T=.42*P(0,.05,k)*P(1,.9,k),at=M*z(Vt,.6,k)/4.2+w[0],yt=k>0?z(Vt,.6,k)+T*Math.sin(at):(ct-xt*u[n])*(1+(Z-1)*P(Ut*1.03,Ut*1.3,u[n])),it=k>0?1:Math.pow(u[n]/ae,2.6),st=A*(1-A)*4*(1-k);$[n]=A,V[n]=F,D[n]=yt,C[n]=it,I[n]=st,ht[n]=1-P(ft-150,ft-20,b[n]),H[n]=h-s[n],R[n]=-Math.PI/2-u[n],rt[n]=ee*Math.max(1+W*M/4.3*Math.cos(q),.25),ot[n]=k>0?Vt/c*Math.max(1+T*M/4.2*Math.cos(at),.3):Kt}},tt=new Float64Array(i),l=new Float64Array(i),U=new Float64Array(i);let G=NaN;const d=Math.ceil(vt*2)+2,p=new Float32Array(d),f=new Float32Array(d),J=new Float32Array(d);{let n=ct-xt*Ut,A=0,k=-Math.PI/2;for(let E=0;E<d;E++){p[E]=n,f[E]=A,J[E]=k;const W=E*.5,q=-(1/(ct-xt*Ut))*Math.max(1-W/De,0);k+=q*.25,n+=Math.cos(k)*.5,A+=Math.sin(k)*.5,k+=q*.25}}const L=(n,A)=>{const k=nt(n*2,0,d-1.001),E=Math.floor(k),W=k-E;return A.x=z(p[E],p[E+1],W),A.y=z(f[E],f[E+1],W),A.a=z(J[E],J[E+1],W),A},S={x:0,y:0,a:0},Y=new Float32Array(i),N=new Float32Array(i),v=new Float32Array(i),X=new Float32Array(i),et=new Float32Array(i);function Q(n){const A=(.28+.72*P(.3,.62,n.spring))*(1-P(0,.1,n.unroll))*(n.breath??1),k=.42*Math.sin(n.time*M/6.4)*A,E=.03*Math.sin(n.time*M/4.3+1.3)*A,W=.022*Math.sin(n.time*M/2.3+.7)*P(.02,.14,n.unroll)*(n.breath??1),q=n.unroll,F=be(q),Z=n.letGo??Ae,T=P(0,Z,q),at=F/vt,yt=z(1,1.2,at),it=Se(at),st=z((Vt+.5-1)/(c+1.95),Le(at),T),Ct=2,qt=z(_e,Ue,P(.3,.62,q))*P(.03,.3,q)*(1+.14*Math.sin(n.time*6.3)*P(.1,.3,q)),Mt=Math.max(st,Ge*it*oe(q/Z)*(1-P(.9,1,q))),ne=(Mt-st)*de,bt=g=>it-st*g-ne*(1-Math.exp(-g/de));let mt=(it-yt)/st;{let g=0,j=mt;for(let wt=0;wt<18;wt++){const ut=(g+j)*.5;bt(ut)>yt?g=ut:j=ut}mt=g}const Bt=mt*M;{let g=0;o[0]=0;for(let j=1;j<=Rt;j++)g+=M*bt(mt*(j-.5)/Rt)*mt/Rt,o[j]=g}L(F,S);const Dt=S.x+it*Math.sin(S.a),Tt=S.y-it*Math.cos(S.a),Ot=Math.atan2(- -Math.cos(S.a),-Math.sin(S.a)),Ft=g=>{if(g<=0)return 0;if(g>=o[Rt])return Bt;let j=0,wt=Rt;for(;wt-j>1;){const ut=j+wt>>1;o[ut]>g?wt=ut:j=ut}return Bt*(j+(g-o[j])/Math.max(o[wt]-o[j],1e-6))/Rt},dt=Ft(Math.max(jt-ft-F,0)),fe=Yt(F),re={x:0,y:0,a:0},Jt=Xt(F),Ee=Math.sin(Jt),ze=Math.cos(Jt);if(_||O(),n.spring!==G){G=n.spring;for(let g=0;g<i;g++){const j=oe(n.spring*2.7-$[g]*1.25);tt[g]=z(V[g],D[g],j),l[g]=z(H[g],R[g],j),U[g]=z(rt[g],ot[g],nt(j,0,1))}}for(let g=0;g<i;g++){const j=y[g],wt=I[g];let ut=tt[g]*(1-E*wt-W*wt*ht[g]),Lt=l[g]-k*C[g],Et,zt,$t=0,te=0,ie=U[g];if(T>0&&b[g]>ft){const Gt=b[g]-ft;let se,le,ce=st;if(j===0&&Gt<=F)Et=ut*Math.cos(Lt),zt=ut*Math.sin(Lt),L(Gt,re),se=re.x,le=re.y,$t=Yt(Gt),ce=4,te=Xt(Gt);else{const he=j>0?dt+j*(Bt-dt):Ft(Gt-F),me=bt(he/M),Ve=Ot-he,we=qt*(it-me);ce=st+(Mt-st)*Math.exp(-he/(M*de));const xe=z(ut,me,T),ve=z(Lt,Ve-M*Ct,T);Et=Dt*T+xe*Math.cos(ve),zt=Tt*T+xe*Math.sin(ve)+we*Ee*T,se=Et,le=zt,$t=fe+we*ze,te=Jt}Et=z(Et,se,T),zt=z(zt,le,T),$t*=T,te*=T,ie=z(ie,ce,T)}else Et=ut*Math.cos(Lt),zt=ut*Math.sin(Lt);Y[g]=Et,N[g]=zt,v[g]=$t,X[g]=ie,et[g]=te}return{F,R:it,cx:Dt,cy:Tt,hF:fe,gx:S.x,gy:S.y,ga:S.a,twF:Jt,pu:q,bx:Dt*T,by:Tt*T}}return{N:i,NS:e,NH:r,mm:b,thS:u,hq:y,px:Y,py:N,pz:v,pt:X,ptw:et,compute:Q,G:L,heartTurns:c}}const He=ye+`
attribute vec4 aQ, n0a, n0b, n1a, n1b;
uniform vec3 uPaper, uHub, uE1, uE2, uEN;
uniform float uWidth, uThick, uMA, uRollF, uWidthTip, uRun, uTip, uReal;
uniform vec3 uTipAt, uTipAxis, uBandC;
vec3 kingTip(vec3 v, float ang) { float c = cos(ang), s = sin(ang); return v * c + cross(uTipAxis, v) * s + uTipAxis * dot(uTipAxis, v) * (1. - c); }
varying vec3 vPaper, vWN, vWP;
varying vec4 vSurf;
varying float vSolid, vBand, vGap;
void main() {
  vec4 a = mix(n0a, n1a, aQ.x), b = mix(n0b, n1b, aQ.x);
  // the room between this turn and the next, in metres: the node's own pitch of the winding (the strip's state, not the eye's) on the REAL PAPER;
  // the heart's own nodes (paper coordinate beyond the real paper's length) carry none: their stated pitch runs ahead of their turns as they let go
  vGap = mix(n0b.z > uReal ? 0. : n0a.w, n1b.z > uReal ? 0. : n1a.w, aQ.x);
  // THE WOUND LID IS BANDED: where the windings close into one flat tint the hand's bunched turns still show, as rings
  // 4.2 m wide about the hub, alternately the lid's tint and one step lighter. Worked out from the node's radius, so the
  // rings are whole turns (clean ellipses), stand still while the heart swings and cannot alias at any distance.
  vBand = clamp(sin(6.2831853 * length(a.xy - uBandC.xy) / 8.4 + 0.9) * 3., -1., 1.) * uBandC.z;
  vec2 nr = b.xy;
  float nl = length(nr);
  nr = nl > 1e-5 ? nr / nl : vec2(1., 0.);
  vec3 c = uHub + uE1 * a.x + uE2 * a.y + uEN * a.z;
  vec3 wc = (modelMatrix * vec4(c, 1.)).xyz;
  float solid = 0.;
  // once the heart lets go the paper of the frond and of the roll shows a heavier edge (0.36 m), so the frond's top edge is
  // a line that carries to the roll and the roll's wound top reads as loops of light edge from a following eye
  float kd = length(cameraPosition - wc);
  float th = quillThickP(uThick + 0.2 * uRun * smoothstep(uMA - 20., uMA + 20., b.z) + 0.26 * uRun * smoothstep(uMA + uRollF - 3., uMA + uRollF + 3., b.z), a.w, kd, solid);   // round 6: what is wound in the roll shows a heavier edge still (0.62 m), a spiral of light line
  // The wound heart's caps are polygons, and where they have only half closed the slivers of gap left between them
  // show as rows of dark teeth. So the lid's COLOUR closes first: by the time the turns are 4 pixels apart the edge line
  // and the gap are one flat tint, and the caps then close under it unseen.
  vSolid = max(solid, 1. - smoothstep(4.0, 5.6, a.w / max(uPx * kd, 1e-5)));
  vec3 nrm = uE1 * nr.x + uE2 * nr.y;
  // the cut ends are a little off square
  float endCut = (1. - smoothstep(0., 1.5, b.z)) * 0.9;
  vec3 tang = uE1 * nr.y - uE2 * nr.x;
  vec3 wd = uEN * cos(b.w) + uE2 * sin(b.w);           // the strip's width: the disc's normal, twisted upright along the frond
  vec3 fn = nrm - wd * dot(nrm, wd);                    // the face normal stays square to the width
  float fl = length(fn);
  fn = fl > 1e-4 ? fn / fl : nrm;
  // the frond tapers toward its tip (the top edge keeps its line, the foot rises); what is still wound in the roll is
  // as wide as the strip where the roll runs, so the roll grows lower as it runs out
  float wT = clamp(clamp(b.z - uMA, 0., uRollF) / 175., 0., 1.);
  float wNow = mix(uWidth, uWidthTip, wT * (1.6 - 0.6 * wT));   // round 6: it tapers from the anchor on, so the roll is lower from the start
  vec3 lp = c + fn * (aQ.y * th * 0.5) + wd * (0.5 * uWidth - (1. - aQ.z) * wNow) + tang * endCut * (aQ.z - 0.5);
  // the running roll leans back against its run (uTip: an attitude of its own, the same from wherever it is seen), about the
  // line from where the strip's top edge meets it through its middle (the last metres of strip twist into it)
  float tipA = uTip * smoothstep(uMA + uRollF - 6., uMA + uRollF + 0.5, b.z);
  lp = uTipAt + kingTip(lp - uTipAt, tipA);
  vec4 wp = modelMatrix * vec4(lp, 1.);
  vWP = wp.xyz;
  vWN = mat3(modelMatrix) * kingTip(aQ.w > 0.5 ? wd : fn * aQ.y, tipA);
  vSurf = vec4(b.z, aQ.z * wNow, aQ.w, wNow);
  vPaper = uPaper;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;function je(a,e,r){const o=new t.InstancedBufferGeometry,i=[[0,1,0,0],[0,1,1,0],[1,1,0,0],[1,1,1,0],[0,-1,0,0],[0,-1,1,0],[1,-1,0,0],[1,-1,1,0],[0,1,1,1],[0,-1,1,1],[1,1,1,1],[1,-1,1,1],[0,1,0,1],[0,-1,0,1],[1,1,0,1],[1,-1,0,1]];o.setAttribute("aQ",new t.BufferAttribute(new Float32Array(i.flat()),4)),o.setAttribute("position",new t.BufferAttribute(new Float32Array(48),3)),o.setIndex([0,2,1,1,2,3,4,5,6,6,5,7,8,10,9,9,10,11]);const c=new Float32Array((a.N+1)*8),h=new t.InstancedInterleavedBuffer(c,8,1);h.setUsage(t.DynamicDrawUsage),o.setAttribute("n0a",new t.InterleavedBufferAttribute(h,4,0)),o.setAttribute("n0b",new t.InterleavedBufferAttribute(h,4,4)),o.setAttribute("n1a",new t.InterleavedBufferAttribute(h,4,8)),o.setAttribute("n1b",new t.InterleavedBufferAttribute(h,4,12)),o.instanceCount=a.N-1,o.boundingSphere=new t.Sphere(new t.Vector3(0,_t,0),400);const w=new t.ShaderMaterial({uniforms:{...r,uPaper:{value:e},uHub:{value:new t.Vector3(0,_t,0)},uE1:{value:pt},uE2:{value:lt},uEN:{value:At},uWidth:{value:St},uThick:{value:.16},uMA:{value:ft},uReal:{value:jt},uRollF:{value:0},uRun:{value:0},uTip:{value:0},uTipAt:{value:new t.Vector3},uTipAxis:{value:new t.Vector3(1,0,0)},uBandC:{value:new t.Vector3(0,0,1)},uWidthTip:{value:Oe}},vertexShader:He,side:t.DoubleSide,fragmentShader:Me+`varying float vBand, vGap;
      void main() {
        vec3 c = quillShade();
        float sk = clamp(vSolid, 0., 1.);
        // THE WIDE PAPER READS AS A STRIP ON EDGE from the climb and the lip: its lower cut edge and its outer cut end carry the
        // light line too (never under two pixels), and the chain lines of the laid paper are drawn every 2.6 m as marks that
        // carry (never under a pixel, gone before they would crowd), so a flank is never one flat dark shape
        float kfx = max(fwidth(vSurf.x), 1e-5), kfy = max(fwidth(vSurf.y), 1e-5), kface = (1. - step(0.5, vSurf.z)) * (1. - sk);
        vec3 kedge = mix(quillLighter(vPaper, 2.), vec3(0.965, 0.955, 0.905), uFrost * 0.7);
        float klx = abs(fract(vSurf.x / 2.6) - 0.5) * 2.6, kcw = max(0.05, 1.1 * kfx);
        c *= 1. - 0.085 * (1. - smoothstep(kcw, kcw + kfx, klx)) * (1. - smoothstep(0.35, 0.8, kfx)) * kface;
        float klw = min(max(0.1, 2.1 * kfy), 0.3 * max(vSurf.w, 1e-3));
        c = mix(c, kedge, (1. - smoothstep(klw, klw + kfy, vSurf.y)) * kface * 0.85);
        float kle = max(0.16, 2.1 * kfx);
        c = mix(c, kedge, (1. - smoothstep(kle, kle + kfx, vSurf.x)) * kface);
        // THE KING'S TOP EDGE ON ITS FACES, pale and in the king's own proportion: an ordinary 3 m strip carries a top line of 0.1 m, so the 9 m
        // strip carries 0.3 m (never over 0.45 of the width; no floor in pixels: thinner than a pixel it thins away by its share of that pixel, and
        // the line as quillShade drew it stands), in the cap's own pale mix, so cap and line are one pale edge
        float ktw = min(0.3, 0.45 * max(vSurf.w, 1e-3));
        vec3 ktop = mix(kedge, vec3(0.965, 0.955, 0.905), 0.4);
        // THE PALE BAND STANDS ONLY WHERE THERE IS ROOM FOR IT BETWEEN THE TURNS: whole at a gap of 1.2 m (four times the band), absent at 0.6 m
        // (twice the band), where the face keeps the line as quillShade drew it, so close turns are still told apart by cap and face
        c = mix(c, ktop, (1. - smoothstep(ktw, ktw + kfy, vSurf.w - vSurf.y)) * min(1., ktw / kfy) * kface * smoothstep(0.6, 1.2, vGap));
        c = mix(c, vec3(0.965, 0.955, 0.905), 0.4 * step(0.5, vSurf.z) * (1. - sk));      // the king's cut edge shows the paper's pale core: its line stands whiter than a small coil's
        vec3 lite = mix(quillLighter(c, 1.25), vec3(0.965, 0.955, 0.905), 0.3 * uFrost);
        c = mix(c, vBand > 0. ? lite : mix(c, vPaper, 0.7), abs(vBand) * sk);
        gl_FragColor = vec4(c, 1.);
      }`}),u=new t.Mesh(o,w);u.frustumCulled=!1;function b(){const{N:s,px:y,py:m,pz:x,pt:B,mm:K,ptw:$}=a;for(let V=0;V<s;V++){const D=V>0?V-1:0,C=V<s-1?V+1:s-1,I=V*8,ht=y[C]-y[D],H=m[C]-m[D];c[I]=y[V],c[I+1]=m[V],c[I+2]=x[V],c[I+3]=B[V],c[I+4]=-H,c[I+5]=ht,c[I+6]=K[V],c[I+7]=$[V]}h.needsUpdate=!0}return{mesh:u,upload:b,mat:w}}const Zt=new t.Vector3,Pt=new t.Matrix4,ke=new t.Vector2,gt=new t.Vector3,kt=(a,e,r,o)=>o.set(0,_t,0).addScaledVector(pt,a).addScaledVector(lt,e).addScaledVector(At,r);async function ta(a,e={}){const r=a.rng.fork?a.rng.fork("king-crozier"):a.rng,o=nt(e.detail??a.quality?.detail??1,.6,1),i=Re(e.palette),c=e.uniforms??Pe();c.uCream.value.copy(i.cream),c.uStain.value.copy(i.stain),e.sun&&c.uSun.value.copy(e.sun).normalize();const h=e.springAt??[.1,.22],w=e.unrollAt??[.665,.9],u=e.laneAt??[.255,.665],b=new t.Group;b.name="king-crozier";const s={rng:r,detail:o,papers:i,object:b,Q:c,mat:qe(c),springAt:h,unrollAt:w,laneAt:u,opts:e,hooks:[]},y=Ke(r,900,1660),m=je(y,i.bottle,c);b.add(m.mesh),s.king=y,await a.yield(),await Ye(a,s),await a.yield(),await Ze(a,s),await a.yield(),await Je(a,s),await a.yield();const x=$e(s);let B=e.progress??null;const K=e.card!==!1?new URLSearchParams(globalThis.location?.search??""):null,$=K?K.get("kview"):null;K&&K.get("ku")!=null&&(B=parseFloat(K.get("ku")));const D={lane:[x.lane[12],9,12],wall:[x.wallCloseUp,3,6],heart:[x.hub,22,30],frond:[x.frond[9],14,16],exit:[x.portalSeat.position,16,14],foot:[new t.Vector3(0,6,0),12,14]}[$]||[new t.Vector3(0,44,0),80,96],C={spring:0,unroll:0,time:0,breath:1,u:0,F:0,letGo:Ae},I=H=>{const R=H%40;return R<4?.08:R<9?z(.1,.22,(R-4)/5):R<22?z(.22,.665,(R-9)/13):R<34?z(.665,.9,(R-22)/12):z(.9,1,(R-34)/6)};function ht(H,R,rt){const ot=B??I(R);C.u=ot,C.time=R,C.spring=nt((ot-h[0])/(h[1]-h[0]),0,1),C.unroll=nt((ot-w[0])/(w[1]-w[0]),0,1);const _=y.compute(C);C.F=_.F,C.info=_,m.upload();{const O=m.mat.uniforms,tt=Wt(_.twF,gt);O.uRollF.value=_.F,O.uRun.value=P(0,.08,C.unroll),O.uBandC.value.set(_.bx,_.by,1-P(.3,.5,C.unroll)),kt(_.gx,_.gy,_.hF,O.uTipAt.value).addScaledVector(tt,St*.5),Zt.set(0,0,0).addScaledVector(pt,Math.cos(_.ga)).addScaledVector(lt,Math.sin(_.ga)),O.uTipAxis.value.crossVectors(Zt,tt).normalize(),O.uTip.value=We*P(0,C.letGo,_.pu)*(1-P(.93,1,_.pu))*(1+.05*Math.sin(R*5.1))}c.uTime.value=R,c.uU.value=ot,rt&&a.renderer&&(a.renderer.getDrawingBufferSize(ke),c.uPx.value=2/(Math.max(Math.abs(rt.projectionMatrix.elements[5]),.001)*Math.max(ke.y,1)));for(const O of s.hooks)O(C,H,rt)}return ht(0,0,null),{object:b,radius:D[1],height:D[2],center:D[0].clone(),anchors:x,update:ht,setProgress(H){B=H},dispose(){},setLetGo(H){C.letGo=nt(H,.01,1)},leafletsClearOf(H){b.updateMatrixWorld(!0);const R=new t.Matrix4().copy(b.matrixWorld).invert();s.clearOf(H.map(rt=>rt.clone().applyMatrix4(R)))},rollAt(H,R){const rt=nt((H-w[0])/Math.max(w[1]-w[0],1e-4),0,1),ot=be(rt),_=ot/vt,O=Se(_),tt=y.G(ot,{x:0,y:0,a:0}),l=P(0,C.letGo,rt);return kt((tt.x+O*Math.sin(tt.a))*l,(tt.y-O*Math.cos(tt.a))*l,Yt(ot)*l,R),O},ground:!1,groundY:0,papers:i,uniforms:c,material:s.mat}}function pe(a,e,r=1){const o=new t.IcosahedronGeometry(1,r),i=new t.ShaderMaterial({uniforms:{...a},vertexShader:`
      varying vec3 vN; varying vec3 vWP;
      void main() { mat4 M = modelMatrix * instanceMatrix; vec4 wp = M * vec4(position, 1.); vWP = wp.xyz; vN = mat3(M) * normal; gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`
      uniform vec3 uSun, uCream; varying vec3 vN; varying vec3 vWP;
      void main() { float l = length(vN); vec3 N = l > 1e-5 ? vN / l : vec3(0., 1., 0.);
        // the fleck is the bead's glint: it sits on the side we see, drawn a little toward the sun and low (the coil covers the bead's top)
        vec3 tc = cameraPosition - vWP; float tl = length(tc); vec3 V = tl > 1e-4 ? tc / tl : vec3(0., 1., 0.);
        vec3 f = normalize(V + vec3(0.42 * uSun.x, -0.6, 0.42 * uSun.z));
        float fl = smoothstep(0.925, 0.95, dot(N, f));
        vec3 c = mix(uCream * vec3(0.76, 0.79, 0.78), vec3(1.), fl);
        gl_FragColor = vec4(c, 1.); }`}),c=new t.InstancedMesh(o,i,e);c.frustumCulled=!1;const h=new t.Matrix4().makeScale(0,0,0);for(let w=0;w<e;w++)c.setMatrixAt(w,h);return c}async function Ye(a,e){const{rng:r,king:o,papers:i,object:c}=e,h=[],w=l=>{let U=0,G=o.NS;for(;G-U>1;){const d=U+G>>1;o.mm[d]<l?U=d:G=d}return U};for(let l=5;l<ft-3;l+=5.5/e.detail)h.push({m:l+r.range(-.8,.8),side:h.length%2?1:-1,pair:!1});for(let l=4;l<vt-3;l+=5.2/e.detail){const U=r.range(-.3,.3);h.push({m:ft+l+U,side:1,pair:!0},{m:ft+l+U+.5,side:-1,pair:!0})}const u=h.filter(l=>!l.pair).length,b=h.length-u,s=It(Nt(48,!1,1.6),e.mat,Math.max(u,1)),y=It(Nt(34,!1,1.5),e.mat,Math.max(b,1));let m=0,x=0;const B=pe(e.Q,Math.max(u,1)),K=pe(e.Q,Math.max(b,1),0),$=new t.Matrix4;h.forEach((l,U)=>{if(l.node=w(l.m),l.th=o.thS[l.node]%M,l.size=r.range(.85,1.12),l.sweep=r.range(.85,1.05),l.pair){l.sweep*=1.08;const G=l.m-ft;l.size*=z(.5,1,P(15,65,G))*z(1,.8,P(150,200,G))}l.B=l.pair?y:s,l.bi=l.pair?x++:m++,l.B.set(l.bi,$,l.pair?{paper:r.chance(.3)?i.spring:i.lime,tint:0,turns:2,radius:1.7*l.size,width:1.05,thick:.09,tear:1,ecc:1,elong:1.9,inner:.34,tightTurns:2,tightRadius:.8*l.size,open:0,phase:r.range(0,M),breath:2}:{paper:r.chance(.3)?i.spring:i.lime,tint:0,turns:2.8,radius:1.5*l.size,width:1.25,thick:.13,tear:1,ecc:1,elong:1.7,inner:.26,tightTurns:2,tightRadius:1.12*l.size,open:0,phase:r.range(0,M),breath:2})}),s.commitAll(),y.commitAll(),c.add(s.mesh,y.mesh,B,K);const V=new t.Vector3,D=new t.Vector3,C=new t.Vector3,I=new t.Vector3;e.leaflets=h;const ht=24,H=14;for(const l of h)l.rS=ct-xt*o.thS[l.node];let R=null;const rt=l=>{if(!R)return z(-.3,M*.75,nt((l.u-e.laneAt[0])/Math.max(e.laneAt[1]-e.laneAt[0],1e-4),0,1));const U=nt(l.u,0,1)*(R.length-1),G=Math.min(Math.floor(U),R.length-2),d=R[G],p=R[G+1];let f=Math.abs(p-d)<Math.PI?z(d,p,U-G):d;return l.u>=e.laneAt[1]&&(f=f<Math.PI?M:Math.max(f,M*.75)),f};e.clearOf=l=>{R=l.map(p=>{const f=p.x,J=p.y-_t,L=p.z,S=f*pt.x+J*pt.y+L*pt.z,Y=f*lt.x+J*lt.y+L*lt.z,N=-Math.PI/2-Math.atan2(Y,S);return N-M*Math.floor((N+.6)/M)}),o.compute({spring:1,unroll:0,time:0,breath:0});const U=new t.Vector3,G=new t.Vector3,d=new t.Vector3;for(const p of h){if(p.pair)continue;const f=p.node,J=Math.max(f-1,0),L=Math.min(f+1,o.N-1);kt(o.px[f],o.py[f],o.pz[f],U).addScaledVector(At,St*.5);let S=1e9,Y=null;for(const N of l){const v=N.distanceTo(U);v<S&&(S=v,Y=N)}if(Y&&S<11){const N=o.px[L]-o.px[J],v=o.py[L]-o.py[J];G.set(0,0,0).addScaledVector(pt,-v).addScaledVector(lt,N),p.side=d.subVectors(Y,U).dot(G)>0?-1:1}}};const ot=l=>l<=0?0:1-Math.exp(-2.5*l)*Math.cos(9.2*l),_=new t.Vector3,O=new t.Vector3,tt=new t.Vector3;e.hooks.push(l=>{const{px:U,py:G,pz:d,ptw:p,N:f}=o,J=l.F-.5+(l.unroll>=1?40:0),L=P(.02,.05,l.unroll),S=rt(l),Y=l.spring>=1?1:0;for(let N=0;N<h.length;N++){const v=h[N],X=v.node,et=Math.max(X-1,0),Q=Math.min(X+1,f-1);let n=U[Q]-U[et],A=G[Q]-G[et];const k=Math.hypot(n,A)||1;n/=k,A/=k;let E=oe((ht-(v.th-S)*v.rS)/H)*Y,W=1;const q=v.m-ft;l.unroll>0&&(q>0?(E=z(E*(1-P(0,.03,l.unroll)),1,nt(ot((J-q)/40),0,1.3)),W=1-L*(1-P(-1.5,1.5,l.F-q))):E*=1-P(.12,.34,l.unroll-v.th*.012));const F=P(.5,1,E),Z=v.sweep*F*v.side*(1+.27*Math.sin(l.time*4.2+N*1.7)*(v.pair?1:.4)),T=Math.cos(Z),at=Math.sin(Z),yt=n*T-A*at,it=A*T+n*at;Wt(p[X],I),V.set(0,0,0).addScaledVector(pt,yt).addScaledVector(lt,it),V.addScaledVector(I,-V.dot(I)).normalize();const st=v.pair?(.27+.15*Math.sin(l.time*3.6+N*2.3))*F:.46+.08*Math.sin(l.time*2.9+N*2.3)*nt(E*2,0,1),Ct=Math.cos(st),qt=Math.sin(st);_.copy(V).multiplyScalar(Ct).addScaledVector(I,qt),O.copy(I).multiplyScalar(Ct).addScaledVector(V,-qt),D.crossVectors(O,_),kt(U[X]-A*v.side*.12*F,G[X]+n*v.side*.12*F,d[X],C).addScaledVector(I,St*.5+.06),Pt.makeBasis(_,D,O).scale(tt.set(W,W,W)).setPosition(C),v.B.mesh.setMatrixAt(v.bi,Pt),v.B.openness(v.bi,nt(E,0,1.2));const Mt=(v.pair?.42:.5)*W;Pt.makeScale(Mt,Mt,Mt).setPosition(C.x-I.x*.12,C.y-I.y*.12,C.z-I.z*.12),(v.pair?K:B).setMatrixAt(v.bi,Pt)}s.mesh.instanceMatrix.needsUpdate=!0,y.mesh.instanceMatrix.needsUpdate=!0,B.instanceMatrix.needsUpdate=!0,K.instanceMatrix.needsUpdate=!0,s.commit(),y.commit()})}function Te(a,e,r,o){const i=a.G(e,{x:0,y:0,a:0});return kt(i.x,i.y,Yt(e),o).addScaledVector(Wt(Xt(e),gt),St*.5+r)}function Xe(a){const e=Te(a,vt-60,3,new t.Vector3),r=Te(a,vt,0,new t.Vector3),o=Wt(Xt(vt),new t.Vector3),i=r.clone().addScaledVector(o,8),c=i.clone().sub(e).normalize(),h=new t.Vector3().crossVectors(c,o).normalize(),w=new t.Vector3().crossVectors(h,c).normalize();return i.copy(r).addScaledVector(w,1.25+.88*7.63),{from:e,tip:r,seat:i,dir:c,side:h,up:w}}async function Ze(a,e){const{rng:r,papers:o,object:i}=e,c=20+Math.floor(r()*5),h=r.range(6.2,7.2),w=It(Nt(560),e.mat,2),u=new t.Matrix4().makeRotationX(-Math.PI/2);w.set(0,u.clone().multiply(new t.Matrix4().makeRotationZ(r.range(0,M))),{paper:o.bark,tint:0,turns:c,radius:h,width:3.2,thick:.14,lift:36.6,inner:.13,open:1,tightTurns:c,tightRadius:h,phase:0,breath:0});const b=Xe(e.king),s=b.tip.clone().addScaledVector(b.up,.1).addScaledVector(b.side,2.4),y=Math.max(s.y-3,6);w.set(1,new t.Matrix4().makeTranslation(s.x,0,s.z).multiply(u),{paper:o.bark,tint:0,turns:26,radius:3.4,width:3,thick:.12,lift:y,inner:.1,open:1,tightTurns:26,tightRadius:3.4,phase:2,breath:0}),w.commitAll(),i.add(w.mesh),e.exit=b,e.hoopFoot=s,await a.yield();const m=14,x=It(Nt(36),e.mat,m);for(let B=0;B<m;B++){const K=B/m*M+r.range(-.2,.2),$=h+r.range(2.5,9),V=B%3,D=new t.Matrix4().makeTranslation(Math.sin(K)*$,0,Math.cos(K)*$).multiply(new t.Matrix4().makeRotationY(K+r.range(-.5,.5))).multiply(u);V===0?x.set(B,D,{kind:"s",paper:o.bark,turns:1.6,radius:r.range(.9,1.4),stem:r.range(3,5),width:r.range(1.6,2.4),tightTurns:1.6,tightRadius:1.1,open:1}):V===1?x.set(B,D,{kind:"v",paper:r.chance(.5)?o.fern:o.leaf,turns:1.5,radius:r.range(.7,1.1),stem:r.range(2.5,4.5),vAngle:r.range(.35,.6),width:r.range(1.8,2.6),tightTurns:2.6,tightRadius:.5,open:1}):x.set(B,D,{paper:o.lime,turns:3,radius:r.range(1.3,2),width:r.range(2.2,3),inner:.25,tightTurns:5,tightRadius:.5,open:1,phase:r.range(0,.1)*60,lift:.8})}x.commitAll(),i.add(x.mesh)}function Fe(a){return new t.ShaderMaterial({uniforms:{...a},vertexShader:"attribute float aSoft; varying float vS; void main(){ vS = aSoft; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform vec3 uStain; varying float vS; void main(){ float a = smoothstep(0., 1., vS); gl_FragColor = vec4(mix(vec3(1.), uStain, a), 1.); }",blending:t.CustomBlending,blendEquation:t.MinEquation,blendSrc:t.OneFactor,blendDst:t.OneFactor,depthWrite:!1,transparent:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})}async function Je(a,e){const{rng:r,papers:o,object:i,king:c,exit:h}=e,w=It(Nt(180),e.mat,1),u=4,b=new t.Matrix4().makeBasis(h.up,h.side.clone().negate(),h.dir).setPosition(h.tip.clone().addScaledVector(h.up,1.25).addScaledVector(h.dir,-u/2)),s=7.63,y=d=>{const p=z(10.6,13.3,d),f=z(3,3.75,d);w.set(0,b,{paper:o.bottle,tint:0,noFrost:!0,turns:f,radius:p,inner:s/p,ecc:.88,width:u,thick:.42,tightTurns:f,tightRadius:p,open:1,breath:0,phase:1}),w.commitAll()};y(0),i.add(w.mesh);let m=0;e.hooks.push(d=>{const p=Math.round((oe((d.u-(e.unrollAt[1]-.045))/.06)+.07*Math.sin(d.time*1.3))*500)/500;p!==m&&(m=p,y(p))});const x=pe(e.Q,6),B=(d,p,f)=>x.setMatrixAt(d,Pt.makeScale(f,f,f).setPosition(p));B(0,new t.Vector3(0,40.2,0),.9),B(1,e.hoopFoot.clone().addScaledVector(h.up,.3),.6),B(2,h.tip.clone().addScaledVector(h.up,.25),.55),i.add(x),await a.yield();const K=3,$=Math.floor((c.N-1)/K)+1,V=new t.BufferGeometry,D=new Float32Array($*3*3),C=new Float32Array($*3),I=[];for(let d=0;d<$;d++)if(C[d*3]=0,C[d*3+1]=1,C[d*3+2]=0,d<$-1){const p=d*3,f=p+3;I.push(p,f,p+1,p+1,f,f+1,p+1,f+1,p+2,p+2,f+1,f+2)}const ht=new t.BufferAttribute(D,3);ht.setUsage(t.DynamicDrawUsage),V.setAttribute("position",ht),V.setAttribute("aSoft",new t.BufferAttribute(C,1)),V.setIndex(I),V.boundingSphere=new t.Sphere(new t.Vector3,600);const H=new t.Mesh(V,Fe(e.Q));H.frustumCulled=!1,H.renderOrder=-5,i.add(H);const R=new t.Vector3,rt=new t.Vector3,ot=new t.Matrix4;e.hooks.push(()=>{i.updateWorldMatrix(!0,!1);const d=Zt.copy(e.Q.uSun.value).transformDirection(ot.copy(i.matrixWorld).invert()),p=Math.hypot(d.x,d.z)||1,f=-d.x/p,J=-d.z/p,{px:L,py:S,pz:Y,N}=c,v=pt.x,X=pt.y,et=pt.z,Q=lt.x,n=lt.y,A=lt.z,k=At.x,E=At.y,W=At.z;for(let q=0;q<$;q++){const F=Math.min(q*K,N-1),Z=Math.min(F+K,N-1),T=Math.max(F-K,0),at=Y[F]-St*.5,yt=0+v*L[F]+Q*S[F]+k*at,it=_t+X*L[F]+n*S[F]+E*at,st=0+et*L[F]+A*S[F]+W*at,Ct=0+v*L[Z]+Q*S[Z]+k*Y[Z],qt=0+et*L[Z]+A*S[Z]+W*Y[Z],Mt=0+v*L[T]+Q*S[T]+k*Y[T],ne=0+et*L[T]+A*S[T]+W*Y[T];let bt=Ct-Mt,mt=qt-ne;const Bt=Math.hypot(bt,mt)||1;bt/=Bt,mt/=Bt;const Dt=it*.42,Tt=yt+f*Dt,Ot=st+J*Dt,Ft=2.2+it*.035,dt=q*9;D[dt]=Tt-mt*Ft,D[dt+1]=.06,D[dt+2]=Ot+bt*Ft,D[dt+3]=Tt,D[dt+4]=.06,D[dt+5]=Ot,D[dt+6]=Tt+mt*Ft,D[dt+7]=.06,D[dt+8]=Ot-bt*Ft}ht.needsUpdate=!0});{const p=new t.BufferGeometry,f=new Float32Array(57),J=new Float32Array(19),L=[];J[0]=1.5;for(let v=0;v<18;v++)L.push(0,1+v,1+(v+1)%18);const S=new t.BufferAttribute(f,3);S.setUsage(t.DynamicDrawUsage),p.setAttribute("position",S),p.setAttribute("aSoft",new t.BufferAttribute(J,1)),p.setIndex(L),p.boundingSphere=new t.Sphere(new t.Vector3,600);const Y=Fe(e.Q);Y.uniforms.uStain={value:new t.Color("#B2B6C8")};const N=new t.Mesh(p,Y);N.frustumCulled=!1,N.renderOrder=-5,i.add(N),e.hooks.push(v=>{const X=v.info;if(!X)return;const et=Zt.copy(e.Q.uSun.value).transformDirection(ot.copy(i.matrixWorld).invert()),Q=Math.hypot(et.x,et.z)||1,n=-et.x/Q,A=-et.z/Q;kt(X.bx,X.by,X.hF,R);const k=Math.max((v.unroll>0?X.R:Vt)*.8*(1-P(.8,1,v.unroll)),.01),E=R.y*.42,W=R.x+n*E,q=R.z+A*E;f[0]=W,f[1]=.07,f[2]=q;for(let F=0;F<18;F++){const Z=F/18*M,T=(F+1)*3;f[T]=W+Math.cos(Z)*k,f[T+1]=.07,f[T+2]=q+Math.sin(Z)*k}S.needsUpdate=!0})}const _=Math.round(46*e.detail),O=It(Nt(14),e.mat,_),tt=[];for(let d=0;d<_;d++)tt.push({m0:r.range(0,1),v:r.range(2.2,3.6),r:r.range(.32,.5)*.56}),O.set(d,new t.Matrix4,{paper:o.stream,tint:0,turns:1.3,radius:tt[d].r,width:.3,thick:.05,inner:.3,tightTurns:1.3,tightRadius:tt[d].r,open:1,breath:0});O.commitAll(),i.add(O.mesh);const l=new t.Vector3,U=new t.Vector3,G=new t.Vector3;if(e.hooks.push(d=>{const{px:p,py:f,pz:J,ptw:L,mm:S,NS:Y}=c,N=ft+Math.min(d.F,vt-8)-6;for(let v=0;v<_;v++){const X=tt[v],et=3+(X.m0*N+d.time*X.v)%N;let Q=0,n=Y;for(;n-Q>1;){const at=Q+n>>1;S[at]<et?Q=at:n=at}const A=nt((et-S[Q])/Math.max(S[n]-S[Q],1e-4),0,1),k=z(p[Q],p[n],A),E=z(f[Q],f[n],A),W=z(J[Q],J[n],A);let q=p[n]-p[Q],F=f[n]-f[Q];const Z=Math.hypot(q,F)||1;q/=Z,F/=Z,Wt(L[Q],gt),l.set(0,0,0).addScaledVector(pt,q).addScaledVector(lt,F),l.addScaledVector(gt,-l.dot(gt)).normalize(),U.crossVectors(gt,l);const T=d.spring>.6?1:.001;kt(k,E,W,G).addScaledVector(gt,St*.5+.03),Pt.makeBasis(l,U,gt).scale(Zt.set(T,T,T)).setPosition(G),O.mesh.setMatrixAt(v,Pt)}O.mesh.instanceMatrix.needsUpdate=!0}),e.opts.card!==!1){const d=new t.MeshBasicMaterial({color:o.cream}),p=new t.Mesh(new t.CircleGeometry(2400,48),d);p.rotation.x=-Math.PI/2,p.renderOrder=-.4;const f=new t.Mesh(new t.SphereGeometry(2600,24,12),new t.MeshBasicMaterial({color:o.cream,side:t.BackSide,depthWrite:!1,fog:!1}));f.renderOrder=-.5,d.fog=!1,i.add(f,p)}}function $e(a){const e=a.king,r=a.exit,o=(s,y,m)=>kt(s,y,m,new t.Vector3),i=[];for(let s=0;s<=24;s++){const y=s/24*M*.75,m=ct-xt*y-Kt/2,x=-Math.PI/2-y;i.push(o(m*Math.cos(x),m*Math.sin(x),0))}const c=o(-22,-(ct-Kt/2)-4,0),h=o(-60,-(ct-Kt/2)-20,-2),w=[],u={x:0,y:0,a:0};for(let s=12;s<=vt-60;s+=12){e.G(s,u);const y=1-P(0,55,s);w.push(o(u.x-Math.sin(u.a)*7*y,u.y+Math.cos(u.a)*7*y,Yt(s)).addScaledVector(Wt(Xt(s),gt),(St*.5+3)*(1-y)))}w.push(r.from.clone());const b=r.seat.clone().addScaledVector(r.dir,12);return{hub:new t.Vector3(0,_t,0),discNormal:At.clone(),discUphill:lt.clone(),lowLip:o(0,-ct,0),highLip:o(0,ct,0),approach:h,laneEntry:c,lane:i,frond:w,flyThrough:[h,c,...i,...w,r.seat.clone(),b],portalSeat:{position:r.seat.clone(),facing:r.dir.clone(),up:r.up.clone(),radius:7},exitStraightFrom:r.from.clone(),frondTip:r.tip.clone(),hoopFoot:a.hoopFoot.clone(),wallCloseUp:o((ct-xt*M*1.5)*Math.cos(-Math.PI/2-M*.5),(ct-xt*M*1.5)*Math.sin(-Math.PI/2-M*.5),0),viewFromStream:new t.Vector3(0,2.4,190),timing:{springAt:a.springAt,laneAt:a.laneAt,unrollAt:a.unrollAt}}}export{ge as DEFAULT_PALETTE,Qe as LET_GO_SECONDS,Me as QUILL_FRAG_GLSL,ye as QUILL_VERT_GLSL,pe as beadMesh,ta as buildHero,Re as makePapers,Pe as makeQuillUniforms,It as quillBatch,Nt as quillGeometry,qe as quillMaterial,Fe as stainMaterial};
