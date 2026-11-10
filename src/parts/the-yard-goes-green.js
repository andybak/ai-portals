import*as o from"three";const Ce=["#050608","#C9D6E2","#4A5766","#FF2A1C","#19E0B0","#EAF2F8"],Ae=17,X={mirror:1,film:2,upright:3},Le=60,Me=8,Ne=16,Oe=Math.max(20,Le);function De(n,s,t,a=1){return a*(n-Math.min(.137*n,112)-20*(n/90-Math.floor(n/90))+s/3+1.33*t)}function Ge(n,s,t,a=Ae){let i=Math.imul(Math.floor(n/5)|0,374761393)^Math.imul(Math.floor(s/5)|0,668265263)^Math.imul(Math.floor(t/5)|0,1274126177)^Math.imul(a|0,1103515245);return i=Math.imul(i^i>>>13,1597334677),i=Math.imul(i^i>>>15,2246822519),i^=i>>>16,(i>>>0)/4294967296}function We(n,s,t,a,i,x){const r=x||s,m=Ge(r.x,r.y,r.z,n.salt),p=m<1/50?0:1,w=p&&m<1/50+1/30?1:0;return{turnAt:De(t,a,i,p),doubt:w,keep:p}}const q=`
uniform float uTime, uFlown, uCalm;   // uCalm (order 3, E7): the seeded weather's still water, 0 in rain, 1 after it (a number set once at the build)
uniform vec3 uInk, uPale, uShade, uRed, uGreen, uGlass, uFlood;
// THE ANSWER: x red, y green, from uFlown - turnAt alone. A turn takes 10 m: red sinks to dark, then green rises.
// A doubter (doubt 1) tries green early over d -72..-48 and falls back to red before it holds at its metre.
vec2 yardLamp(float turnAt, float doubt) {
  float d = uFlown - turnAt;
  float red = 1. - smoothstep(-10., -4., d);
  float green = smoothstep(-6., 0., d);
  float tryG = smoothstep(-72., -66., d) * (1. - smoothstep(-54., -48., d));
  float tryR = smoothstep(-78., -72., d) * (1. - smoothstep(-48., -42., d));
  return vec2(red * (1. - doubt * tryR), green + doubt * tryG);
}
vec3 yardLampColor(vec2 s) { return uRed * s.x + uGreen * s.y; }
// tone by distance alone: far lines dim to a fifth at 1.5 km, never grey
float yardTone(float dist) { return mix(1., 0.2, smoothstep(60., 1500., dist)); }
// the footprint law: a line of true half-width h (metres) at x metres from its centre, px metres to the pixel:
// it keeps minPx pixels and dims by true over drawn (never under floorS), one soft pixel of flank.
float yardLine(float x, float h, float px, float minPx, float floorS) {
  float dh = max(h, 0.5 * minPx * px);
  float m = 1. - smoothstep(dh - 0.5 * px, dh + 0.5 * px, abs(x));
  return m * max(h / max(dh, 1e-5), floorS);
}
float yardHash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
`;function qe(n={}){const s=(n.palette&&n.palette.length>=6?n.palette:Ce).map(i=>new o.Color(i)),t=(n.flood?new o.Vector3().copy(n.flood):new o.Vector3(-.5,.03,.86)).normalize(),a={uTime:{value:0},uFlown:{value:0},uCalm:{value:n.calm??0},uFlood:{value:t},uInk:{value:s[0]},uPale:{value:s[1]},uShade:{value:s[2]},uRed:{value:s[3]},uGreen:{value:s[4]},uGlass:{value:s[5]}};return{uniforms:a,flood:t,pal:s,salt:n.salt??Ae,setFlown(i){a.uFlown.value=i},setTime(i){a.uTime.value=i}}}const _e=n=>`
attribute vec3 aAxis; attribute vec4 aDir; attribute vec4 aPar; attribute vec3 aTint; attribute vec4 aLit; attribute vec3 aLit2;
varying vec4 vBar; varying vec4 vPar; varying vec3 vTint; varying float vDist; varying float vKind; varying vec2 vAz; varying vec3 vW;
varying vec4 vLv; varying vec3 vEv; varying vec3 vLs; varying vec2 vLn;
${q}
// (order 4, H1) the lit face's lamp as the shader holds it (aLit, aLit2: baked by place). A body that MOVES past
// standing lamps (the world's train) may set these in its yardMove from its own place on the world's clock: the
// nearest standing lamp to the face, the same one law, no eye
vec4 yardLit; vec3 yardLit2;
${n||"void yardMove(inout vec3 p, inout vec3 ax, inout vec3 d, inout vec3 tn) {}"}
void main() {
  float bar = step(0., aDir.w);
  yardLit = aLit; yardLit2 = aLit2;
  // a guy or a pole wire sways on the world's clock: aPar.xyz the sway at full swing, aPar.w its phase (bars only)
  vec3 sw = bar * aPar.xyz * sin(uTime * 0.9 + aPar.w) ;
  vec3 p0 = position + sw, a0 = aAxis + sw, d0 = aDir.xyz, tn = aTint;
  yardMove(p0, a0, d0, tn);
  vec4 wp = modelMatrix * vec4(p0, 1.);
  vec3 wa = (modelMatrix * vec4(a0, 1.)).xyz;
  vec3 T = normalize(mat3(modelMatrix) * d0 + vec3(0., 1e-5, 0.));
  vec3 ray = wa - cameraPosition; float dist = length(ray); ray /= max(dist, 1e-4);
  vec3 n = cross(T, ray); n /= max(length(n), 1e-4);
  vec3 v = cross(n, T);                                   // across the bar, away from the eye
  vec3 P = uFlood - T * dot(uFlood, T); P /= max(length(P), 1e-4);
  vBar = vec4(dot(wp.xyz - wa, n), aDir.w, dot(P, n), -dot(P, v));
  vPar = aPar; vTint = tn; vKind = 1. - bar; vW = position;   // the body's own frame: beads ride with a moving body
  vDist = length(wp.xyz - cameraPosition);
  // (order 3, M3) THE LIT FACE: aLit the place of this face's nearest lamp (in the body's frame) and its reach in
  // metres (0: no lamp near, the face stays black); aLit2 that lamp's turnAt, doubt and strength. vLv: from the
  // face to the lamp; vEv: from the face to the eye (BODY_FS asks it only WHICH SIDE of a plate is seen: use (1));
  // vLn: for a bar, the lamp's direction across the bar and toward the eye (as vBar.zw holds the floodlight's).
  vec3 lw = (modelMatrix * vec4(yardLit.xyz, 1.)).xyz, lb = lw - wa; float lbl = max(length(lb), 1e-4);
  vLv = vec4(mix(lw - wp.xyz, lb, bar), yardLit.w); vEv = cameraPosition - wp.xyz; vLs = yardLit2;
  vLn = vec2(dot(lb, n), -dot(lb, v)) / lbl;
  vec4 ca = projectionMatrix * viewMatrix * vec4(wa, 1.); vAz = ca.zw;   // the bar's own depth, not its carrier's
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Ve=`
varying vec4 vBar; varying vec4 vPar; varying vec3 vTint; varying float vDist; varying float vKind; varying vec2 vAz; varying vec3 vW;
varying vec4 vLv; varying vec3 vEv; varying vec3 vLs; varying vec2 vLn;
${q}
void main() {
  // (order 3, M4) a face without bands (codes 0, 0: a girder's web, a lattice leg's or the mast's black face, a deck)
  // lies some 4 cm behind its own place in depth (0.012 w^2 with the lens's near plane at 0.3 m), so that the
  // bracing drawn in its plane always stands before it and never fights it
  gl_FragDepth = vKind < 0.5 ? clamp(0.5 * vAz.x / max(vAz.y, 1e-4) + 0.5, 0., 1.) : min(gl_FragCoord.z + step(vPar.z + vPar.w, 0.2) * 0.012 * gl_FragCoord.w * gl_FragCoord.w, 1.);
  // (order 3, M3) THE LIT FACE, ONE LAW FOR EVERY FACE: a wet black face near a lamp carries that lamp's colour as a
  // FILLED PATCH WITH A SOFT FALLING EDGE: (1 - (d / reach)^2)^2 of the metres d from the lamp, nothing at its reach
  // and beyond; by that lamp's state by the same number (yardLamp); only on the side of the face that looks at the
  // lamp, and stronger the more squarely it looks. A face far from every lamp stays black; the floodlight washes no
  // face. Its colour passes through uRed and uGreen and nothing else: with both black every face is black.
  float litD = length(vLv.xyz) / max(vLv.w, 1e-3), litF = max(1. - litD * litD, 0.) * step(1e-3, vLv.w); litF *= litF;
  vec3 litC = yardLampColor(yardLamp(vLs.x, vLs.y)) * vLs.z * litF;
  vec3 gn = cross(dFdx(vEv), dFdy(vEv)); gn /= max(length(gn), 1e-12);
  float litP = dot(gn, vLv.xyz) / max(length(vLv.xyz), 1e-4) * (dot(gn, vEv) < 0. ? -1. : 1.);   // a plate: the lamp stands on the side we see
  // STEEL IS COLD: the pale band and the shade line are steel and nothing else. A lamp's colour comes onto wet steel
  // only as GLINTS (beads of water, one to a cell of the body's own frame, going to their mean by the footprint) and
  // as a line only hard by the lamp (amount squared). aTint.z < 0: a CABLE, a fifth of the steel's strength, beaded.
  float amt = abs(vTint.z), cable = step(vTint.z, -1e-3);
  vec3 lampC = yardLampColor(yardLamp(vTint.x, vTint.y)) * amt * (1. - cable);
  // (order 3, M2) FAR LINES GO TO THEIR MEAN AND GET DIMMER: a line keeps its 1.5 pixels and its strength falls as
  // true over drawn, down to a floor of 0.045 (it was 0.16): a far lattice is a few dim strokes, never a pale fuzz
  float tone = yardTone(vDist), fl = mix(0.045 * tone, 1., cable), steel = mix(1., 0.13, cable);   // (linear 0.13 of 0.6: a fifth to the eye)
  float minPx = mix(2.2, 1.5, smoothstep(40., 80., vDist));
  float pw = max(length(fwidth(vW)), 1e-5);
  vec3 bi = floor(vW / 0.16); float bh = yardHash(bi.xz + bi.y * 17.3 + 0.5);
  // (colours are linear: a mean of 0.02 already shows as a dull slab, so beads and runs are sparse and thin out with
  // distance alone, use (2), to leave a far plate black)
  float farK = mix(1., 0.25, smoothstep(30., 120., vDist));
  // (order 4, H1) NO BEAD AND NO RUN ON BLACK PLATE OR BAR: pixel-sized beads peppered on black read as render noise.
  // A bead is at its mean at every distance, and that mean on a wet black face far from a lamp is NOTHING; near a
  // lamp it is the filled patch itself (litC below: GRADED LAMP LIGHT falling from the lamp). Only a CABLE keeps its
  // few glass beads (they say it is a cable and no ruled line), going to their mean by the footprint, use (3).
  float bead = mix(step(0.9, bh), 0.1, smoothstep(0.05, 0.16, pw)) * farK;
  vec3 col = uInk;
  if (vKind < 0.5) {
    float s = vBar.x, r = vBar.y, px = max(fwidth(s), 1e-5);
    float Px = clamp(vBar.z, -1., 1.), Pv = vBar.w;
    float hb = r / 6., side = Px < 0. ? -1. : 1.;
    float sb = mix(side, Px, step(0., Pv)) * (r - hb);
    float ext = max(r, abs(sb) + max(hb, 0.5 * minPx * px)) + 0.5 * px;
    if (abs(s) > ext) discard;
    // (order 4, H3; M2's law for a far line, use (3) the footprint) A CABLE FAR OFF GOES OUT: it kept its full fifth
    // at every distance and stood as ruled grey lines across the sky 250 m away; now it holds that strength only
    // while its true width is some third of a pixel and more, and is nothing under a sixteenth
    float flb = mix(fl, smoothstep(0.06, 0.3, 2. * r / px), cable);
    float pale = yardLine(s - sb, hb, px, minPx, flb) * mix(0.45, 1., smoothstep(-0.6, 0.3, Pv));
    float shade = yardLine(s + side * r * 0.86, r / 10., px, 1.5, flb);
    float dark = shade * (1. - pale);
    col += (uPale * 0.6 * pale + uShade * 0.5 * dark) * tone * steel + lampC * dark * (0.3 * amt * amt);
    col += uGlass * tone * cable * bead * step(0.95, bh) * max(pale, shade) * 0.9;   // a cable's beads of water
    // the lit face of a round member (M3): its skin where it turns toward its lamp; a thin bar (under 0.06 m) has no
    // face to light, and under a pixel the face is its share (3)
    float nx = clamp(s / max(r, 1e-4), -1., 1.), lam = nx * vLn.x + sqrt(max(1. - nx * nx, 0.)) * vLn.y;
    float skin = (1. - smoothstep(r - px, r, abs(s))) * min(r / px, 1.) * smoothstep(0.06, 0.18, r) * (1. - cable);
    col += litC * skin * smoothstep(-0.15, 0.6, lam) * (1. - 0.7 * pale) * 0.8;
  } else {
    // A PLATE IS A BLACK MASS: a WIDE pale band (a sixth of its width, to 0.4 m; 3 pixels or more near) on the edge
    // toward the floodlight, a shade line on the other, both cold steel; its face black, with a few glass beads and,
    // where a lamp is near, thin wet runs and beads in the lamp's colour. No tint as area.
    float a = vPar.x, W = vPar.y, px = max(fwidth(a), 1e-5);
    float hb = min(W / 12., 0.2), hs = min(W / 24., 0.025), bandPx = mix(3., 1.5, smoothstep(40., 120., vDist));
    float p0 = step(0.75, vPar.z), p1 = step(0.75, vPar.w);
    float h0 = mix(hs, hb, p0), h1 = mix(hs, hb, p1);
    float l0 = yardLine(a - h0, h0, px, mix(1.5, bandPx, p0), fl) * step(0.25, vPar.z);
    float l1 = yardLine(W - a - h1, h1, px, mix(1.5, bandPx, p1), fl) * step(0.25, vPar.w);
    // the band is wet: brightest at its outer third, a second flat step inside (two flat tones, no gradient)
    float e0 = mix(1., 0.55 + 0.45 * step(a, 0.7 * h0), p0), e1 = mix(1., 0.55 + 0.45 * step(W - a, 0.7 * h1), p1);
    vec3 c0 = mix(uShade * 0.5, uPale * e0, p0) * tone, c1 = mix(uShade * 0.5, uPale * e1, p1) * tone;
    float face = 1. - max(l0, l1);
    // (order 4, H1) the face carries no bead and no run: black, or its lamp's graded patch
    col += max(c0 * l0, c1 * l1) * 0.62;
    // the lit face of a plate (M3; H1: GRADED LAMP LIGHT): the filled patch, on the side that looks at the lamp,
    // brightest hard by the lamp and falling with the metres from it to nothing at its reach
    col += litC * smoothstep(0.02, 0.3, litP) * (0.45 + 0.55 * litP) * mix(0.45, 1., face) * 0.85;
  }
  gl_FragColor = vec4(min(col, vec3(1.)), 1.);
}`;function Ye(n,s={}){return new o.ShaderMaterial({uniforms:{...n.uniforms,...s.uniforms||{}},vertexShader:_e(s.move),fragmentShader:Ve,side:o.DoubleSide})}function ke(n,s=n.flood){const t=[],a=[],i=[],x=[],r=[],m=[],p=[];let w=0;const d=new o.Vector3,y=new o.Vector3,h=new o.Vector3,e=new o.Vector3,l=[0,0,0],M=[0,0,0,0];function u(z,b,g,E={}){d.subVectors(b,z);const H=d.length();if(H<1e-6)return;d.divideScalar(H),y.set(0,1,0),Math.abs(d.y)>.9&&y.set(1,0,0),y.crossVectors(d,y).normalize(),h.crossVectors(d,y).normalize();const C=E.carrier??2*g+.9,V=E.tint||l,D=w;E.unlit||p.push(D);for(let N=0;N<2;N++){const c=N?b:z,f=(N?E.sway1:E.sway0)||M;for(let A=0;A<3;A++){const v=A*2.0943951+.5,L=Math.cos(v)*C,k=Math.sin(v)*C;t.push(c.x+y.x*L+h.x*k,c.y+y.y*L+h.y*k,c.z+y.z*L+h.z*k),a.push(c.x,c.y,c.z),i.push(d.x,d.y,d.z,g),x.push(f[0],f[1],f[2],f[3]),r.push(V[0],V[1],V[2]),w++}}for(let N=0;N<3;N++){const c=(N+1)%3;m.push(D+N,D+c,D+3+N,D+c,D+3+c,D+3+N)}}function S(z,b,g={}){const E=z.length,H=g.closed?E:E-1;for(let C=0;C<H;C++)u(z[C],z[(C+1)%E],b,g.tintAt?{...g,tint:g.tintAt(C)}:g)}function I(z,b,g,E,H={}){const C=z.distanceTo(E),V=b.distanceTo(g),D=H.tint||l,N=w;let c,f;if(H.codes)c=H.codes[0],f=H.codes[1];else{e.subVectors(z,E).add(b).sub(g);const k=e.lengthSq()>1e-9?e.normalize().dot(s):0;c=k>0?1:.5,f=k>0?.5:1}const A=H.pivot,v=H.spin,L=(k,F,B)=>{t.push(k.x,k.y,k.z),A?a.push(A.x,A.y,A.z):a.push(k.x,k.y,k.z),v?i.push(v.x,v.y,v.z,-1):i.push(0,0,0,-1),x.push(F,B,c,f),r.push(D[0],D[1],D[2]),w++};H.unlit||p.push(-1-N),L(z,0,C),L(b,0,V),L(g,V,V),L(E,C,C),m.push(N,N+1,N+2,N,N+2,N+3)}function R(z){const b=new o.BufferGeometry;b.setAttribute("position",new o.Float32BufferAttribute(t,3)),b.setAttribute("aAxis",new o.Float32BufferAttribute(a,3)),b.setAttribute("aDir",new o.Float32BufferAttribute(i,4)),b.setAttribute("aPar",new o.Float32BufferAttribute(x,4)),b.setAttribute("aTint",new o.Float32BufferAttribute(r,3)),b.setAttribute("aLit",new o.BufferAttribute(new Float32Array(w*4),4)),b.setAttribute("aLit2",new o.BufferAttribute(new Float32Array(w*3),3)),b.setIndex(m),b.computeBoundingSphere(),b.boundingSphere.radius+=2;const g=new o.Mesh(b,z||Ye(n));return g.userData.yardPrims=Int32Array.from(p),g}return{bar:u,chain:S,plate:I,build:R,indexCount:()=>m.length,triangles:()=>m.length/3}}async function $e(n,s,t={}){const a=n.geometry,i=n.userData.yardPrims,x=t.reach??9,r=12,m=4096;if(!i||!s.length)return 0;const p=a.attributes.position.array,w=a.attributes.aAxis.array,d=a.attributes.aDir.array,y=a.attributes.aLit.array,h=a.attributes.aLit2.array,e=(b,g,E)=>b+1024+(g+64)*m+(E+1024)*m*256,l=new Map,M=[],u=new o.Vector3,S=new o.Vector3;for(const b of s){u.copy(b.pos),S.copy(b.dir||S.set(0,0,0)),t.matrix&&(u.applyMatrix4(t.matrix),S.transformDirection(t.matrix));const g={x:u.x,y:u.y,z:u.z,dx:S.x,dy:S.y,dz:S.z,R:b.lit??x,bk:b.back??t.back??.45,t:b.turnAt,d:b.doubt||0,st:Math.min(1,(b.strength??1)*(t.gain??1))};if(!(g.R>0)||!(g.st>0))continue;M.push(g);const E=e(Math.floor(g.x/r),Math.floor(g.y/r),Math.floor(g.z/r));let H=l.get(E);H||l.set(E,H=[]),H.push(g)}const I=M.reduce((b,g)=>Math.max(b,g.R),0),R=b=>Math.max(0,Math.min(1,b));let z=0;for(let b=0;b<i.length;b++){t.pause&&b%500===499&&await t.pause();const g=i[b]<0,E=g?-1-i[b]:i[b],H=g?4:6;if(!g&&d[E*4+3]<.06)continue;const C=g?p:w,V=E*3,D=(E+(g?1:3))*3,N=(E+3)*3,c=C[V],f=C[V+1],A=C[V+2],v=C[D]-c,L=C[D+1]-f,k=C[D+2]-A,F=g?p[N]-c:0,B=g?p[N+1]-f:0,P=g?p[N+2]-A:0,O=v*v+L*L+k*k||1,W=F*F+B*B+P*P||1,U=c+.5*(v+F),Y=f+.5*(L+B),G=A+.5*(k+P),$=Math.min(4*r,.5*(Math.abs(v)+Math.abs(F))+I),Q=Math.min(4*r,.5*(Math.abs(L)+Math.abs(B))+I),fe=Math.min(4*r,.5*(Math.abs(k)+Math.abs(P))+I),ue=g?k*F-v*P:0,Pe=t.below&&g&&ue*ue>.72*O*W;let ve=0,K=null,xe=0;for(let j=Math.floor((U-$)/r);j<=Math.floor((U+$)/r);j++)for(let Z=Math.floor((Y-Q)/r);Z<=Math.floor((Y+Q)/r);Z++)for(let J=Math.floor((G-fe)/r);J<=Math.floor((G+fe)/r);J++){const ge=l.get(e(j,Z,J));if(ge)for(const _ of ge){const re=_.x-c,ne=_.y-f,se=_.z-A,ie=R((re*v+ne*L+se*k)/O),le=g?R((re*F+ne*B+se*P)/W):0,de=v*ie+F*le-re,he=L*ie+B*le-ne,ce=k*ie+P*le-se,te=Math.sqrt(de*de+he*he+ce*ce);if(te>=_.R||Pe&&_.y>Y-.5)continue;const we=1-te/_.R*(te/_.R),He=(de*_.dx+he*_.dy+ce*_.dz)/Math.max(te,.001),ye=_.bk+(1-_.bk)*R((He+.3)/.6),be=_.st*we*we*ye;be>ve&&(ve=be,K=_,xe=ye)}}if(!K)continue;const Ie=xe;z++;for(let j=0;j<H;j++){const Z=(E+j)*4,J=(E+j)*3;y[Z]=K.x,y[Z+1]=K.y,y[Z+2]=K.z,y[Z+3]=K.R,h[J]=K.t,h[J+1]=K.d,h[J+2]=K.st*Ie}}return z}const ze=`
attribute vec3 aQ; attribute vec4 aLamp; attribute float aReach;
varying vec3 vQ; varying vec4 vLamp; varying vec3 vE; varying vec3 vFl; varying vec3 vH; varying float vReach;
${q}
void main() {
  vReach = aReach;
  mat4 im = modelMatrix * instanceMatrix;
  vec3 X = normalize(im[0].xyz), Y = normalize(im[1].xyz), Z = normalize(im[2].xyz);
  vec4 wp = im * vec4(position, 1.);
  vec3 toEye = cameraPosition - im[3].xyz; float dist = length(toEye); toEye /= max(dist, 1e-4);
  vE = vec3(dot(X, toEye), dot(Y, toEye), dot(Z, toEye));       // (1) the direction from lamp to eye, in the lamp's frame
  vFl = vec3(dot(X, uFlood), dot(Y, uFlood), dot(Z, uFlood));
  vec3 N = X * cos(aQ.x) + Y * sin(aQ.x);                          // a hood's skin (part 1: aQ.x its angle)
  vH = vec3(dot(N, uFlood), dot(N, normalize(cameraPosition - wp.xyz + vec3(0., 1e-5, 0.))), dist);
  vQ = aQ; vLamp = aLamp;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Se=`
varying vec3 vQ; varying vec4 vLamp; varying vec3 vE; varying vec3 vFl; varying vec3 vH; varying float vReach;
uniform vec4 uShape; uniform vec2 uOff; uniform vec4 uBeam;   // uBeam: the lens's beam (1): cos lo, cos hi, floor, narrow
${q}
float lampPower() {   // strength with the eased flicker: one or two dips a second, never under 0.6 of itself
  float seed = fract(vLamp.w), flick = step(1.5, floor(vLamp.w + 1e-3));
  float ph = uTime * 1.3 + seed * 7., f = fract(ph);
  float dip = smoothstep(0., 0.12, f) * (1. - smoothstep(0.2, 0.55, f)) * step(0.3, yardHash(vec2(floor(ph), seed * 31.)));
  return vLamp.z * (1. - 0.4 * flick * dip);
}`,Xe=`
${Se}
void main() {
  vec2 st = yardLamp(vLamp.x, vLamp.y);
  float seed = fract(vLamp.w), cracked = mod(floor(vLamp.w + 1e-3), 2.);
  float power = lampPower(), on = step(0.01, vLamp.z), dist = vH.z;
  float tone = yardTone(dist), fl = 0.16 * tone, minPx = mix(2.2, 1.5, smoothstep(40., 80., dist));
  vec3 e = normalize(vE + vec3(0., 0., 1e-4));
  float beam = smoothstep(uBeam.x, uBeam.y, e.z), front = step(0., e.z);
  vec3 gC = uGreen * st.y * on, rC = uRed * st.x * on, col = uInk;
  if (vQ.z < 0.5) {
    vec2 p = vQ.xy; float px = max(0.7 * length(fwidth(p)), 1e-5);
    vec2 q = abs(p) - (uShape.xy - uShape.z); float d = length(max(q, 0.)) + min(max(q.x, q.y), 0.) - uShape.z;
    if (d > 0.) discard;
    float small = smoothstep(0.5, 1.5, uShape.x / px);           // a unit under a pixel or so goes to its halo alone
    float lit = dot(p / max(length(p), 1e-4), vFl.xy), pale = smoothstep(-0.15, 0.35, lit);
    float rim = yardLine(d + 0.028, 0.028, px, minPx, fl) * small;
    float lr = uShape.w; vec2 pg = p - vec2(0., uOff.x), pr = p + vec2(0., uOff.x);
    float rg = length(pg), rr = length(pr), rl = min(rg, rr); vec2 pl = rg < rr ? pg : pr;
    float inG = 1. - smoothstep(lr - px, lr, rg), inR = 1. - smoothstep(lr - px, lr, rr), inL = max(inG, inR);
    vec3 lampHere = gC * inG + rC * inR, glow = gC * exp(-max(rg - lr, 0.) / (0.55 * lr)) + rC * exp(-max(rr - lr, 0.) / (0.55 * lr));
    col += (mix(uShade * 0.5, uPale, pale) * tone + glow * 0.7 * power) * rim;   // the wet rim takes its lamp's light
    // the wet face: the lamp's small glow on it, and beads of rain creeping down by the world's clock
    float bc = 0.034; vec2 bp = p / bc; float colm = floor(bp.x);
    bp.y += uTime * (0.04 + 0.5 * step(0.93, yardHash(vec2(colm, seed)))) + 9. * yardHash(vec2(colm, 3.));
    vec2 bi = floor(bp), bf = fract(bp) - 0.5; float bh = yardHash(bi + seed * 17.);
    float bead = step(0.74, bh) * (1. - smoothstep(0.1, 0.2 + 0.15 * bh, length(bf - vec2(0.12, 0.1) * (bh - 0.8))));
    bead = mix(bead, 0.07, smoothstep(bc / 4., bc / 1.5, px));
    col += (1. - inL) * (1. - rim) * front * (glow * 0.5 * power + (uGlass * 0.4 * tone + glow * 1.6) * bead * 0.6);
    // the lens: a flat boss in the palette colour, ribs round it, a glint of glass toward the floodlight
    float pitch = lr / 4.5, rib = 0.5 + 0.5 * cos(6.2832 * rl / pitch), boss = 1. - smoothstep(0.3 * lr, 0.38 * lr, rl);
    rib = mix(rib, 0.5, smoothstep(pitch / 4., pitch / 1.5, px));
    // BRIGHT GLASS: the palette colour at full strength, ribbed, and a white-hot heart where the beam finds the eye (1)
    vec3 lens = lampHere * mix(0.72 + 0.28 * rib, 1., boss) * mix(max(uBeam.z, 0.55), 1., beam);
    float litHere = (st.y * inG + st.x * inR) * on;
    lens += uGlass * litHere * power * beam * beam * (0.8 * (1. - smoothstep(0.1 * lr, 0.34 * lr, rl)) + 0.22 * rib * (1. - boss));
    lens += uShade * 0.3 * rib * (1. - boss) * inL * (1. - st.x * inR * on) * (1. - st.y * inG * on) * tone;
    vec3 hv = normalize(e + vFl + vec3(0., 0., 1e-3)); vec2 pgl = pl - 0.8 * lr * hv.xy;
    float gl = (1. - smoothstep(0.05 * lr, 0.11 * lr + px, length(pgl))) + 0.5 * rib * rib * rib * exp(-dot(pgl, pgl) / (0.1 * lr * lr));
    lens += uGlass * gl * step(0., hv.z) * inL * tone * 0.9;
    vec2 qc = pl - lr * vec2(0.22, -0.18); float rq = length(qc), an = atan(qc.y, qc.x + 1e-5) * 1.1141 + seed * 5.;
    float cf = (fract(an) - 0.5 - 0.5 * (yardHash(vec2(floor(an), seed * 9.)) - 0.5)) * 0.8976 * rq;
    lens += uGlass * cracked * yardLine(cf, 0.004, px, 1.5, 0.3) * inL * (0.55 + 0.45 * power);
    col = mix(col, uInk + lens * small, inL * front);
    // (order 1, C7) a NARROW unit's deep hood hides its glass, rim and wet face from the side (use (1), the direction
    // from lamp to eye): off its beam only the hood's black skin is seen
    col = uInk + (col - uInk) * mix(1., beam, uBeam.w);
  } else {
    float a = vQ.y, px = max(fwidth(a), 1e-5), outside = step(0., vH.y);
    float lip = yardLine(a - 0.014, 0.014, px, 1.5, fl) * smoothstep(0.5, 1.5, 0.1 / px);
    col += mix(uShade * 0.5, uPale, smoothstep(-0.2, 0.4, vH.x)) * tone * lip;
    col += (1. - outside) * (gC + rC) * power * 0.34 * smoothstep(0., 0.3, a) * (1. - lip);   // the wet inside of the hood
    col = uInk + (col - uInk) * mix(1., 0.02 + 0.98 * beam, uBeam.w);   // (C7; order 4, H2: a fiftieth, it was an eighth: the dark board stood as a faint red grid) a narrow unit's hood goes out off its beam
  }
  gl_FragColor = vec4(min(col, vec3(1.)), 1.);
}`,Ue=`
${Se}
void main() {
  vec2 st = yardLamp(vLamp.x, vLamp.y);
  vec3 e = normalize(vE + vec3(0., 0., 1e-4));
  float beam = smoothstep(0., 0.5, e.z) * mix(1., smoothstep(uBeam.x, uBeam.y, e.z), uBeam.w), r = length(vQ.xy), px = max(0.7 * length(fwidth(vQ.xy)), 1e-5), lr = uShape.w;
  // THE HALO (H1 to H5): the lamp's own, on its own quad, depth-tested; it falls to nothing by about three lens
  // widths with no rim and no disc. ONE RULE for every lamp, by the footprint (3): far off the halo shrinks to the
  // lamp's own point, which keeps 3 pixels but never more than its own face (so ranks and tiers never run together).
  // (order 2, D3) THE HALO IN RANKS, the second half of the one rule, baked at the build by place: vReach is the
  // lesser of about three of the lamp's own lens widths (6.5 lens radii from its middle) and HALF THE WAY TO ITS
  // NEAREST NEIGHBOUR LAMP, in the unit's own metres (yardNeighbours); the halo is nothing from there on.
  float R = max(vReach, 1e-3), k = max(1.15 * lr, 0.8 * px), rr = max(lr, min(1.6 * px, min(0.95 * uShape.x, 0.8 * R)));
  float ring = exp(-max(r - lr, 0.) / k) * smoothstep(lr - px, lr + px, r) * mix(0.9, 0.95, smoothstep(0.4, 1.4, px / lr));
  float fill = (1. - smoothstep(rr - px, rr + px, r)) * smoothstep(0.5, 1.5, px / lr);   // far off, the halo is the lamp
  vec3 c = uGreen * st.y * step(-0.5, vQ.z - 3.) + uRed * st.x * step(vQ.z - 3., 0.5);
  float I = max(ring, fill) * (1. - smoothstep(0.55 * R, R, r)) * beam * lampPower() * yardTone(vH.z);
  gl_FragColor = vec4(c * I, 1.);
}`,Re={target:{w:.4,h:.4,cr:.4,lens:.125,off:0,hood:.165,hoodL:.32,halo:1,seg:6},board:{w:.24,h:.24,cr:.24,lens:.09,off:0,hood:.125,hoodL:.26,halo:.7,seg:6},dwarf:{w:.3,h:.6,cr:.09,lens:.125,off:.27,hood:.165,hoodL:.3,halo:1,seg:10}};function Ke(n){const s=[],t=[],a=[],i=[],x=[],r=[];s.push(-n.w,-n.h,0,n.w,-n.h,0,n.w,n.h,0,-n.w,n.h,0),t.push(-n.w,-n.h,0,n.w,-n.h,0,n.w,n.h,0,-n.w,n.h,0),a.push(0,1,2,0,2,3);const m=n.off>0?[n.off,-n.off]:[0],p=n.hood>0?n.seg||6:0;m.forEach((d,y)=>{const h=s.length/3;for(let u=0;p&&u<=p;u++){const S=-.4+(Math.PI+.8)*u/p,I=n.hoodL*(.42+.58*Math.max(0,Math.sin(S))),R=n.hood*Math.cos(S),z=d+n.hood*Math.sin(S);s.push(R,z,0,R,z,I),t.push(S,I,1,S,0,1)}for(let u=0;u<p;u++){const S=h+u*2;a.push(S,S+2,S+1,S+1,S+2,S+3)}const e=i.length/3,l=n.halo,M=3+(n.off>0?y===0?1:-1:0);i.push(-l,d-l,.012,l,d-l,.012,l,d+l,.012,-l,d+l,.012),x.push(-l,-l,M,l,-l,M,l,l,M,-l,l,M),r.push(e,e+1,e+2,e,e+2,e+3)});const w=(d,y,h)=>{const e=new o.BufferGeometry;return e.setAttribute("position",new o.Float32BufferAttribute(d,3)),e.setAttribute("aQ",new o.Float32BufferAttribute(y,3)),e.setIndex(h),e};return[w(s,t,a),w(i,x,r)]}function Qe(n){const t=new Map,a=new Set,i=[],x=(r,m,p)=>r+","+m+","+p;for(const r of n)for(const m of r)a.has(m)||(a.add(m),i.push(m));for(const r of i){const m=x(Math.floor(r.pos.x/3.5),Math.floor(r.pos.y/3.5),Math.floor(r.pos.z/3.5));let p=t.get(m);p||t.set(m,p=[]),p.push(r)}for(const r of i){const m=Math.floor(r.pos.x/3.5),p=Math.floor(r.pos.y/3.5),w=Math.floor(r.pos.z/3.5);let d=1/0;for(let y=m-1;y<=m+1;y++)for(let h=p-1;h<=p+1;h++)for(let e=w-1;e<=w+1;e++){const l=t.get(x(y,h,e));if(l)for(const M of l){if(M===r)continue;const u=Math.hypot(M.pos.x-r.pos.x,M.pos.y-r.pos.y,M.pos.z-r.pos.z);u>.05&&u<d&&(d=u)}}r.nb=d<=3.5?d:1/0}return i.length}function ae(n,s,t,a={}){const i=typeof s=="string"?Re[s]:s,x=t.length,[r,m]=Ke(i);t.some(b=>b.nb===void 0)&&Qe([t]);const p=new Float32Array(x),w=new Float32Array(x*4),d=new o.Matrix4,y=new o.Vector3,h=new o.Vector3,e=new o.Vector3(0,1,0),l=new o.Vector3,M=i.beam||[-.05,.7,.4,0],u={...n.uniforms,uShape:{value:new o.Vector4(i.w,i.h,i.cr,i.lens)},uOff:{value:new o.Vector2(i.off,i.halo)},uBeam:{value:new o.Vector4(M[0],M[1],M[2],M[3])}},S=new o.InstancedMesh(r,new o.ShaderMaterial({uniforms:u,vertexShader:ze,fragmentShader:Xe,side:o.DoubleSide}),x),I=new o.InstancedMesh(m,new o.ShaderMaterial({uniforms:u,vertexShader:ze,fragmentShader:Ue,side:o.DoubleSide,transparent:!0,depthWrite:!1,blending:o.AdditiveBlending}),x);for(let b=0;b<x;b++){const g=t[b],E=g.scale||1;y.crossVectors(g.up||e,g.dir).normalize(),h.crossVectors(g.dir,y).normalize(),d.makeBasis(y,h,g.dir).scale(l.set(E,E,E)).setPosition(g.pos),S.setMatrixAt(b,d),I.setMatrixAt(b,d),p[b]=Math.min(6.5*i.lens,i.halo,.5*g.nb/E),w.set([g.turnAt,g.doubt||0,g.strength??1,Math.min(.999,g.seed||0)+(g.cracked?1:0)+(g.flicker?2:0)],b*4)}const R=new o.InstancedBufferAttribute(w,4);r.setAttribute("aLamp",R),m.setAttribute("aLamp",R);const z=new o.InstancedBufferAttribute(p,1);return r.setAttribute("aReach",z),m.setAttribute("aReach",z),S.computeBoundingSphere(),I.computeBoundingSphere(),I.renderOrder=a.order??X.upright,{body:S,halo:I,kind:i}}const je=`
attribute vec4 aS; attribute vec4 aS2; attribute vec3 aAx; attribute vec4 aLamp; attribute vec2 aUp;
varying vec4 vS; varying vec4 vLamp; varying vec3 vB;
uniform float uTone;                                                 // 1: beam (1) and tone (2); 0: neither, full strength from everywhere (the rim's)
uniform float uBand;
${q}
void main() {
  vec3 lw = (modelMatrix * vec4(aS.xyz, 1.)).xyz;
  vec3 ax = normalize(mat3(modelMatrix) * aAx + vec3(1e-5, 0., 0.));
  vec3 toEye = cameraPosition - lw; float dist = length(toEye);
  vec2 t = vec2(-aAx.z, aAx.x); t /= max(length(t), 1e-4);
  float hw = aS.w * (4. + 2. * uBand) + dist / 260.;                 // room for the least width (3); (order 5, L7) and for the band
  float y = aS.y * mix(aS2.x, aS2.y, position.y);
  // aUp: (0, 0) a streak in a mirror group (y metres under the water); (1, top) a SMEAR on wet upright plate,
  // hung in the upright world from its lamp's image at top down the plate (makeSmears)
  vec3 p = vec3(aS.x + t.x * position.x * hw, mix(y, aUp.y - (y - aS.y), min(aUp.x, 1.)), aS.z + t.y * position.x * hw);
  // (order 2, D2) aUp (2, level): a RUN, the same reflection laid ALONG a wet surface from the lamp's image at aS.xz
  // (level aUp.y) the way aAx points (toward whoever comes), its width upright: a pile wall's long smear, a flange's line
  float isRun = step(1.5, aUp.x);
  if (isRun > 0.5) p = vec3(aS.x + aAx.x * (y - aS.y), aUp.y + position.x * hw, aS.z + aAx.z * (y - aS.y));
  vS = vec4(position.x * hw, y, aS.y, aS.w); vLamp = aLamp;
  float ez = dot(ax, toEye / max(dist, 1e-4));                       // aS2.w: a narrow beam's cosine (0: the wide beam)
  float beamK = mix(smoothstep(0., 0.7, ez) * mix(1., smoothstep(aS2.w, aS2.w + 0.08, ez), step(1e-3, aS2.w)), 1., isRun);   // a run is seen from wherever it is not hidden
  vB = vec3(mix(1., beamK * yardTone(dist), uTone), aS2.z, position.y);   // (1) (2); uTone 0: neither (the rim's)
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(p, 1.);
}`,Ze=`
varying vec4 vS; varying vec4 vLamp; varying vec3 vB;
uniform float uBand;                                                 // (order 5, L7) 1: a streak in water is a filled band with an edge
${q}
void main() {
  float a = vS.x, y = vS.y, h = max(vS.z, 0.01), hw = vS.w, seed = fract(vLamp.w);
  float px = max(fwidth(a), 1e-5), py = max(fwidth(y), 1e-5);
  // A LONG BROKEN REFLECTION: strongest at the lamp's image (y = h), drawn out toward us many lamp heights, cut
  // into dashes that lengthen toward us, each dash thrown a little aside, all shivering by the world's clock;
  // the dashes go to their mean when finer than about 3 pixels (3).
  float t = (y - h) / h, tp = max(t, 0.);
  float kindS = floor(vLamp.w + 1e-3), run = step(1.5, kindS);   // 0 a streak in water, 1 a smear down plate, 2 a run along a wet surface
  // (a run is a thin hard line on plate: three times the dashes, a third of the wander, no widening, and it is cut
  // again plate by plate, each 2.5 m of the surface giving back its own share; that cut goes to its mean, (3))
  // (order 3, M1) THE LAW OF EVERY REFLECTION: ONE COLUMN UNDER ITS LAMP, broken into A FEW LONG PIECES (four or five
  // down a streak, each many times longer than wide), shivering by the clock. Where a piece would be shorter than
  // about 4 pixels (dpx: its phase per pixel) or the column thinner than about 1.5 pixels (px over hw), the
  // reflection GOES OVER INTO ITS MEAN (3): no breaks, no wander, a smooth dim band a few pixels wide in the lamp's
  // colour; a far row of lamps lays ONE smooth dim band under the row. Never a field of dashes, at any distance.
  // (order 4, H8) A RUN IS A LONG CLEAN LINE along a waler or a flange: a few long pieces like every reflection, no
  // cut plate by plate, no step of level, hardly a wander: a hard line of the lamp's colour, never a blurred smear
  float ph = 9. * log(1. + max(y, 0.) / (0.25 * h)) + 1.1 * sin(y * 0.31 + uTime * 1.7 + seed * 23.) + seed * 31.;
  float dash = floor(ph / 6.2832), dpx = max(fwidth(ph), 1e-4);
  float mean = max(smoothstep(0.55, 1.5, dpx), smoothstep(0.55, 1.35, px / max(hw, 1e-4)));
  float pl = floor((y - h + 1.) / 2.5), plh = yardHash(vec2(pl, seed * 13.));
  // (order 3, E7) after the rain the water lies still (uCalm): a streak in it hardly wanders and is hardly broken
  float calm = uCalm * (1. - step(0.5, kindS));
  a += (1. - 0.45 * calm) * (1. - mean) * (hw * mix(0.5 + 0.25 * min(tp, 4.), 0.3, run) * sin(y * 0.9 + uTime * 2.3 + seed * 40.) + hw * 0.7 * min(tp, 2.) * (1. - run) * (1. - uBand) * (yardHash(vec2(dash, seed * 61.)) - 0.5));   // (order 5, L7) a band is not thrown aside piece by piece
  // (in its mean the column is some four pixels wide and gives back its true share of light, never less than a sixth)
  float w = max(hw * (1. + 0.2 * min(tp, 5.) * (1. - run)), mix(0.75, 2.2, mean) * px), g = exp(-(a * a) / (w * w)) * max(hw / w, mix(0.5, mix(0.16, 0.05, run), mean));   // (a far run: a twentieth: far down a wall it is a dim mean, M6)
  float plate = mix(0.25 + 0.75 * plh, 0.62, max(mean, smoothstep(0.3, 0.8, py)));   // (a 2.5 m plate under some 4 pixels: its mean)
  g *= mix(1., 0.8 + 0. * plate, run);
  float prof = (t < 0. ? exp(2.6 * t) : 1. / (1. + mix(0.6, 0.45, run) * t)) * smoothstep(0., 0.06, vB.z) * (1. - smoothstep(mix(0.6, 0.8, run), 1., vB.z));
  float smear = step(0.5, kindS) * (1. - run);   // on plate the smear is nearly whole: water runs down it, no waves cut it
  float brk = mix(mix(mix(0.1, 0.55, max(smear, run)), 1., smoothstep(-0.35, 0.2, sin(ph))), mix(0.62, 0.8, smear), mean);
  brk = mix(brk, 0.85, calm);
  // (order 5, L7) THE BAND (uBand 1, a streak in standing water only): the water mirrors its LAMP as ONE FILLED
  // SMOOTH BAND WITH AN EDGE: flat across to a soft edge (never a hair of light), whole along its length but for a
  // slow swell, its edge waving by the clock; lamps of one rank lay ONE band (the maker blends by the greater, so
  // neighbours do not add up to a comb). Thinner than about 3 pixels it goes over into its mean by the footprint,
  // use (3): a dim smooth band at its true share of light.
  float bandK = uBand * (1. - run);   // (a smear told so too: the engine's plate, order 5, L2)
  // (its shape is a SPINDLE: widest at the lamp's image, drawn to a point toward the lamp's foot and toward us, so
  // that the mirrors of a file of lamps stand apart on black water and never tile into a pane)
  float tap = t < 0. ? mix(0.22, 1., exp(3. * t)) : mix(0.3, 1., exp(-0.45 * t)), wt = hw * 1.6 * mix(tap, 1., 0.6 * uCalm);
  float wb = max(wt, 1.5 * px), eb = max(1.1 * px, 0.14 * wb);
  float gb = (1. - smoothstep(wb - eb, wb + eb, abs(a))) * min(1., max(wt / wb, 0.3)) * mix(1., 0.55, smoothstep(0.5, 1.5, 1.5 * px / max(wt, 1e-4)));
  g = mix(g, 0.8 * gb, bandK);   // (a mirror is never as bright as its lamp)
  // (a band is GRADED along its length: brightest at the lamp's image, falling smoothly to nothing toward us and
  // toward the lamp's foot, so that it lies under its lamp as a reflection and never crosses the water as a bar)
  // (after the rain, uCalm, the water lies still: the band is long and hardly drawn in, every lamp doubled at length)
  prof = mix(prof, (t < 0. ? exp(mix(4.6, 2.4, uCalm) * t) : exp(-mix(0.85, 0.3, uCalm) * t)) * smoothstep(0., 0.06, vB.z) * (1. - smoothstep(0.5, 1., vB.z)), bandK);
  brk = mix(brk, mix(0.74 + 0.26 * smoothstep(-0.6, 0.4, sin(ph * 0.5)), 0.8, mean), bandK);
  // in its mean, and on the still water after the rain, the band breathes by the clock, lamp by lamp: a slow swell
  // that travels down the column (smooth in place and time: no sparkle)
  brk *= 1. + max(max(mean * 0.16, calm * 0.38), bandK * 0.3) * sin(uTime * 1.9 + seed * 40. - y * 0.21);   // (a band breathes too: the water is never still as glass)
  gl_FragColor = vec4(yardLampColor(yardLamp(vLamp.x, vLamp.y)) * min(vLamp.z * g * prof * brk * vB.x * vB.y, 1.), 1.);   // (bounded before the colour: the palette's hue holds)
}`,me=()=>{const n=new o.BufferGeometry;return n.setAttribute("position",new o.Float32BufferAttribute([-1,0,0,1,0,0,1,1,0,-1,1,0],3)),n.setIndex([0,1,2,0,2,3]),n};function oe(n,s,t={}){const a=s.length,i=t.len||[.3,6],x=new o.InstancedBufferGeometry().copy(me()),r=new Float32Array(a*4),m=new Float32Array(a*4),p=new Float32Array(a*3),w=new Float32Array(a*4),d=new Float32Array(a*2);for(let h=0;h<a;h++){const e=s[h],l=e.seed||0,M=t.run?2:t.smear?1:0;r.set([e.pos.x,M?e.unit??t.unit??1.2:e.pos.y,e.pos.z,e.width??t.width??.3],h*4),m.set([M?.55:i[0],e.len??i[0]+(i[1]-i[0])*(.55+.45*l),(t.gain??.3)*(e.gain??1)*(t.high&&!M?1/(1+e.pos.y/t.high*(e.pos.y/t.high)):1),t.beam??0],h*4),p.set([e.dir.x,e.dir.y,e.dir.z],h*3),w.set([e.turnAt,e.doubt||0,e.strength??1,Math.min(.999,l)+M],h*4),d.set([M,M?e.pos.y:0],h*2)}x.setAttribute("aS",new o.InstancedBufferAttribute(r,4)),x.setAttribute("aS2",new o.InstancedBufferAttribute(m,4)),x.setAttribute("aAx",new o.InstancedBufferAttribute(p,3)),x.setAttribute("aLamp",new o.InstancedBufferAttribute(w,4)),x.setAttribute("aUp",new o.InstancedBufferAttribute(d,2)),x.instanceCount=a;const y=new o.Mesh(x,new o.ShaderMaterial({uniforms:{...n.uniforms,uTone:{value:t.tone??1},uBand:{value:t.band?1:0}},vertexShader:je,fragmentShader:Ze,side:o.DoubleSide,transparent:!0,depthWrite:!1,...t.band?{blending:o.CustomBlending,blendEquation:o.MaxEquation,blendSrc:o.OneFactor,blendDst:o.OneFactor}:{blending:o.AdditiveBlending}}));return y.frustumCulled=!1,y.renderOrder=t.order??(t.smear||t.run?X.upright:X.mirror),y}const Ee=18,Te=3.6,ee=2.5,Je=`
attribute vec4 aA; attribute vec4 aB; attribute vec4 aLA; attribute vec4 aLB; attribute vec4 aXA; attribute vec4 aXB;
varying vec4 vLA; varying vec4 vLB; varying vec4 vR; varying vec2 vK; varying float vH;
${q}
float rankBeam(vec3 lw, vec3 ax) { vec3 e = cameraPosition - lw; float d = length(e); return smoothstep(0., 0.7, dot(ax, e / max(d, 1e-4))) * yardTone(d); }
void main() {
  float D = max(length(aB.xz - aA.xz), 0.01), e = ${ee.toFixed(1)} / D;   // the quad runs RANK_END metres past each end lamp (room for its knot)
  float s = mix(-e, 1. + e, position.x * 0.5 + 0.5), h = max(mix(aA.y, aB.y, clamp(s, 0., 1.)), 0.05);
  float y = h * mix(0.4, ${Te.toFixed(1)}, position.y);
  vec3 p = vec3(mix(aA.x, aB.x, s), y, mix(aA.z, aB.z, s));
  vR = vec4(s * D, position.y, D, aXA.w);                            // metres along from lamp a, across 0..1, the link's metres, seed
  vH = h;
  vLA = aLA; vLB = aLB;
  vK = vec2(rankBeam((modelMatrix * vec4(aA.xyz, 1.)).xyz, normalize(mat3(modelMatrix) * aXA.xyz + vec3(1e-5, 0., 0.))),
            rankBeam((modelMatrix * vec4(aB.xyz, 1.)).xyz, normalize(mat3(modelMatrix) * aXB.xyz + vec3(1e-5, 0., 0.))));   // (1) (2), at each end's lamp
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(p, 1.);
}`,et=`
varying vec4 vLA; varying vec4 vLB; varying vec4 vR; varying vec2 vK; varying float vH;
${q}
void main() {
  float m = vR.x, v = vR.y, D = vR.z, seed = vR.w, da = abs(m), db = abs(D - m);
  float npx = 1. / max(fwidth(v), 1e-4);                             // (3) the band's depth in pixels
  float t = mix(0.4, ${Te.toFixed(1)}, v) - 1. + 0.07 * sin(m * 0.37 + uTime * 1.3 + seed * 40.) * (1. - 0.7 * uCalm);   // heights under the lamps' images; the edge waves
  float win = smoothstep(0., 0.1, v) * (1. - smoothstep(0.6, 1., v));
  // the band: brightest along the line of the lamps' images, graded to nothing toward the lamps' feet and toward us
  float prof = (t < 0. ? exp(4.2 * t) : exp(-mix(1.0, 0.6, uCalm) * t)) * win;
  // the knot under each lamp: that lamp's own image, a short bright spindle a little deeper than the band
  float kw = 0.6 + 0.07 * vH, profK = (t < 0. ? exp(6. * t) : exp(-3.2 * t)) * win;   // (a knot, not a column: gone a third of a height under the image)
  float endA = 1. - smoothstep(0.4 * ${ee.toFixed(1)}, ${ee.toFixed(1)}, -m), endB = 1. - smoothstep(0.4 * ${ee.toFixed(1)}, ${ee.toFixed(1)}, m - D);
  float fa = (0.5 * exp(-da / ${Ee.toFixed(1)}) * prof * endA * endB + exp(-(da * da) / (kw * kw)) * profK);
  float fb = (0.5 * exp(-db / ${Ee.toFixed(1)}) * prof * endA * endB + exp(-(db * db) / (kw * kw)) * profK);
  float br = 1. + 0.22 * sin(uTime * 1.9 + seed * 40. - m * 0.21);
  float k = br * min(1., npx / 3.) * smoothstep(0.5, 1.5, npx);
  vec3 ca = yardLampColor(yardLamp(vLA.x, vLA.y)) * min(vLA.z * fa * vK.x * k, 1.);
  vec3 cb = yardLampColor(yardLamp(vLB.x, vLB.y)) * min(vLB.z * fb * vK.y * k, 1.);
  gl_FragColor = vec4(max(ca, cb), 1.);
}`;function ft(n,s,t={}){const a=Math.max(1,s.length),i=new o.InstancedBufferGeometry().copy(me()),x=new Float32Array(a*4),r=new Float32Array(a*4),m=new Float32Array(a*4),p=new Float32Array(a*4),w=new Float32Array(a*4),d=new Float32Array(a*4),y=e=>[e.turnAt,e.doubt||0,(e.strength??1)*(t.gain??.34)*(e.gain??1)*(t.high?1/(1+e.pos.y/t.high*(e.pos.y/t.high)):1),0];s.forEach((e,l)=>{x.set([e.a.pos.x,e.a.pos.y,e.a.pos.z,0],l*4),r.set([e.b.pos.x,e.b.pos.y,e.b.pos.z,0],l*4),m.set(y(e.a),l*4),p.set(y(e.b),l*4),w.set([e.a.dir.x,e.a.dir.y,e.a.dir.z,e.seed??0],l*4),d.set([e.b.dir.x,e.b.dir.y,e.b.dir.z,0],l*4)});for(const[e,l]of[["aA",x],["aB",r],["aLA",m],["aLB",p],["aXA",w],["aXB",d]])i.setAttribute(e,new o.InstancedBufferAttribute(l,4));i.instanceCount=a;const h=new o.Mesh(i,new o.ShaderMaterial({uniforms:n.uniforms,vertexShader:Je,fragmentShader:et,side:o.DoubleSide,transparent:!0,depthWrite:!1,blending:o.CustomBlending,blendEquation:o.MaxEquation,blendSrc:o.OneFactor,blendDst:o.OneFactor}));return h.frustumCulled=!1,h.renderOrder=t.order??X.mirror,h}function ut(n,s,t={}){return oe(n,s,{len:[.55,8],width:.2,gain:.6,...t,run:!0})}function vt(n,s,t={}){return oe(n,s,{len:[.55,4],width:.12,gain:.5,...t,smear:!0})}const tt=`
attribute vec4 aP; attribute vec4 aLamp; attribute float aGain;
varying vec3 vP; varying vec4 vLamp; varying vec3 vE; varying vec2 vXZ;
uniform float uTone;                                                 // 1: toned by distance (2); 0: no tone at all (the rim's lane)
${q}
void main() {
  vec4 wp = modelMatrix * vec4(aP.x + position.x * aP.w, aP.y, aP.z + position.y * aP.w, 1.);
  vec3 lw = (modelMatrix * vec4(aP.xyz, 1.)).xyz;
  vec2 te = cameraPosition.xz - lw.xz; te /= max(length(te), 1e-4);
  vP = vec3(position.xy * aP.w, aP.w); vLamp = aLamp; vXZ = wp.xz;
  vE = vec3(te, aGain * mix(1., yardTone(length(cameraPosition - lw)), uTone));
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,at=`
varying vec3 vP; varying vec4 vLamp; varying vec3 vE; varying vec2 vXZ; uniform float uFill;
${q}
float poolNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(yardHash(i), yardHash(i + vec2(1., 0.)), f.x), mix(yardHash(i + vec2(0., 1.)), yardHash(i + vec2(1., 1.)), f.x), f.y);
}
void main() {
  float R = vP.z, r = length(vP.xy); if (r > R) discard;
  float q = r / R, toward = dot(vP.xy / max(r, 1e-3), vE.xy) * smoothstep(0.03, 0.2, q);
  // (order 3, M3: it overrides the islands and glints of orders 1 and 2) A POOL IS A FILLED PATCH WITH A SOFT
  // FALLING EDGE: the lamp's colour by its state, strongest at the lamp's foot, falling with the distance from it
  // to nothing at its reach (no edge, no disc, no sparkle: the ballast is at its mean); a little stronger on the
  // side toward the eye (1). uFill 1 holds the patch fuller toward its edge (a pool that is seen from high above).
  // (the strength is bounded BEFORE it meets the colour: a strong pool is the palette's colour, never a clipped one)
  float soft = max(1. - q * q, 0.); soft *= mix(soft, 1., 0.6 * uFill);
  // (order 4, H7) THE PATCH IS GRADED FROM THE LAMP OUTWARD, never one flat tone to its edge: a bright foot under the
  // lamp (it falls to a fifth of itself by half the reach) on the soft patch, which still goes to nothing at the reach
  float fillK = (0.42 * soft + 0.95 * exp(-5.5 * q * q) * soft) * (0.78 + 0.22 * toward);
  float ppx0 = max(0.5 * (fwidth(vXZ.x) + fwidth(vXZ.y)), 1e-5);
  // (order 4, H7) THE LIT GROUND HAS THINGS IN IT (no eye but uses (1) and (3)):
  //  PUDDLES, fixed in the ground by place (two grids of smooth chance, 2.7 and 1.2 m): standing water mirrors the
  //  black sky, so inside a puddle the patch is at 0.45 of itself, and the puddle's wet EDGE is a thin bright line;
  //  a puddle under some 5 pixels is at its mean (3): far off the patch is smooth
  float pn = 0.62 * poolNoise(vXZ / 2.7) + 0.38 * poolNoise(vXZ / 1.2 + 7.3), pw = max(fwidth(pn), 1e-4);
  float near = 1. - smoothstep(0.18, 0.55, ppx0), pud = smoothstep(0.57 - pw, 0.57 + pw, pn);
  float edge = (1. - smoothstep(0.6 * pw, 2.2 * pw, abs(pn - 0.57))) * near;
  //  SLOW RINGS in the puddles: a drop to a 3.1 m cell, each at its own place and phase of the world's clock,
  //  widening to 1.3 m and fading; under some 3 pixels a ring they are nothing (3)
  vec2 rc = floor(vXZ / 3.1); float rh = yardHash(rc + 4.7), rt = fract(uTime * (0.16 + 0.1 * rh) + rh * 9.), rn = floor(uTime * (0.16 + 0.1 * rh) + rh * 9.);
  vec2 ro = (vec2(yardHash(rc + rn * 0.37), yardHash(rc.yx + 2.9 + rn * 0.61)) - 0.5) * 1.6;
  float rr = length(vXZ - (rc + 0.5) * 3.1 - ro), rg = (rr - 0.1 - 1.2 * rt) / 0.07;
  float pring = exp(-rg * rg) * (1. - rt) * (1. - smoothstep(0.03, 0.09, ppx0));
  fillK *= mix(1., 0.45, pud * near) * (1. + 0.9 * edge + 0.8 * pring * mix(0.35, 1., pud));
  //  THE LAMP'S OWN LONG REFLECTION, BRIGHTEST IN THE MIDDLE: one column from the lamp's foot toward the eye (use
  //  (1): the direction from lamp to eye), in a few long pieces that shiver by the clock, falling off with the patch;
  //  a column under 1.5 pixels wide goes to its mean, a dim band (3)
  float al = dot(vP.xy, vE.xy), ac = vP.x * vE.y - vP.y * vE.x, cw0 = 0.16 + 0.035 * max(al, 0.), cw = max(cw0, 1.3 * ppx0), cm = smoothstep(1., 2.5, 1.3 * ppx0 / cw0);
  ac += (1. - cm) * 0.5 * cw0 * sin(al * 1.9 + uTime * 2.1 + vLamp.w * 40.);
  float cbrk = mix(0.3 + 0.7 * smoothstep(-0.3, 0.25, sin(4.2 * log(1. + max(al, 0.) / 0.7) + 0.6 * sin(uTime * 1.5 + vLamp.w * 23.) + vLamp.w * 31.)), 0.7, cm);
  fillK += 1.5 * exp(-(ac * ac) / (cw * cw)) * (cw0 / cw) * cbrk * smoothstep(0.15, 0.9, al) * soft;
  // the wet under the light is alive (law 3, with the eye still): two slow broad swells cross the patch by the
  // world's clock (5.3 and 8.1 m long: no sparkle); under some 8 pixels a swell they are at their mean (3)
  float ppx = max(0.5 * (fwidth(vXZ.x) + fwidth(vXZ.y)), 1e-5), rip = 1. - smoothstep(0.5, 1.4, ppx);
  // (order 3, G9) after the rain (uCalm) nothing else stirs the water, and the swells are plainer: 0.3 and 0.26
  fillK *= 1. + rip * (mix(0.13, 0.3, uCalm) * sin(dot(vXZ, vec2(0.93, 0.37)) * 1.18 - uTime * 1.7) + mix(0.11, 0.26, uCalm) * sin(dot(vXZ, vec2(-0.44, 0.9)) * 0.78 + uTime * 1.3 + 1.7));
  // (order 3, G9) AFTER THE RAIN THE YARD STILL DRIPS (uCalm, the seeded weather's number): the lamp over the patch
  // drips into it, and two rings run out from its foot through the patch by the world's clock, each fading as it
  // widens; under some 3 pixels a ring they are at their mean (3)
  float t1 = fract(uTime * 0.55 + vLamp.w * 7.), t2 = fract(t1 + 0.5);
  float g1 = (r - t1 * R * 0.85) / 0.42, g2 = (r - t2 * R * 0.85) / 0.42;
  float ringK = exp(-g1 * g1) * (1. - t1) + exp(-g2 * g2) * (1. - t2);
  fillK *= 1. + uCalm * 0.75 * ringK * (1. - smoothstep(0.12, 0.4, ppx));
  gl_FragColor = vec4(yardLampColor(yardLamp(vLamp.x, vLamp.y)) * min(vLamp.z * vE.z * fillK * 0.4, 1.), 1.);
}`;function xt(n,s,t={}){const a=s.length,i=new o.InstancedBufferGeometry;i.setAttribute("position",new o.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),i.setIndex([0,1,2,0,2,3]);const x=new Float32Array(a*4),r=new Float32Array(a*4),m=new Float32Array(a),p=t.y??0,w=t.reach??9;for(let y=0;y<a;y++){const h=s[y],e=Math.max(0,h.pos.y-p);x.set([h.pos.x,p+(t.lift??.05),h.pos.z,Math.min(w,Math.max(t.least??5,4+.8*e))],y*4),r.set([h.turnAt,h.doubt||0,h.strength??1,Math.min(.999,h.seed||0)],y*4),m[y]=(t.gain??.9)*(h.pool??1)/(1+e/7*(e/7))}i.setAttribute("aP",new o.InstancedBufferAttribute(x,4)),i.setAttribute("aLamp",new o.InstancedBufferAttribute(r,4)),i.setAttribute("aGain",new o.InstancedBufferAttribute(m,1)),i.instanceCount=a;const d=new o.Mesh(i,new o.ShaderMaterial({uniforms:{...n.uniforms,uFill:{value:t.fill??0},uTone:{value:t.tone??1}},vertexShader:tt,fragmentShader:at,side:o.DoubleSide,transparent:!0,depthWrite:!1,blending:o.CustomBlending,blendEquation:o.MaxEquation,blendSrc:o.OneFactor,blendDst:o.OneFactor}));return d.frustumCulled=!1,d.renderOrder=t.order??X.film+.2,d}const ot="varying vec3 vW; void main() { vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }",rt=(n,s)=>`
varying vec3 vW; uniform float uWet, uRings;
${q}
${s||""}
float yardWet(vec2 xz) { ${n} }
// (order 3, E1) RINGS ARE NEVER A TILE: each ring comes from its own drop, at its own place in its cell, of its own
// size and at its own phase of the world's clock, and only one cell in five holds a drop at any moment (which cells:
// by the drop's own count on the clock); two grids of unlike measure, one turned, so no rank of arcs can form.
// x: the ring's strength, y: its crest toward the floodlight. Under 3 pixels a ring is its mean, which is nothing (3).
vec2 yardRing(vec2 xz, float cs, float salt, float px) {
  vec2 ci = floor(xz / cs), cf = fract(xz / cs) - 0.5;
  float h = yardHash(ci + salt), tt = uTime * (0.3 + 0.3 * h) + h * 13., n = floor(tt), age = tt - n;
  float on = step(0.8, yardHash(ci * 1.37 + vec2(n * 0.71 + salt, n * 1.93)));
  vec2 dv = (cf - (vec2(yardHash(ci + 3.1 + n), yardHash(ci + 7.7 - n)) - 0.5) * 0.44) * cs; float rr = length(dv);
  float size = (0.1 + 0.18 * yardHash(ci + 11.3 + n)) * cs;
  float ring = yardLine(rr - (0.05 + size * age), 0.02, px, 1.5, 0.) * (1. - age) * (1. - smoothstep(0.1, 0.35, px)) * on;
  return vec2(ring, ring * smoothstep(-0.3, 0.7, dot(dv / max(rr, 1e-4), uFlood.xz)));
}
void main() {
  vec2 xz = vW.xz; float px = max(0.7 * length(fwidth(xz)), 1e-5), open = clamp(yardWet(xz), 0., 1.);
  vec2 rg = (yardRing(xz, 2.3, 0., px) + yardRing(mat2(0.7986, 0.6018, -0.6018, 0.7986) * xz, 3.7, 5.7, px)) * uRings;
  float ring = min(rg.x, 1.);
  float m = uWet * open * (1. - 0.8 * ring);
  float crest = min(rg.y, 1.) * open;
  gl_FragColor = vec4(uInk * (1. - m) + uPale * 0.5 * crest, m);
}`;function Fe(n,s={}){let t=s.geometry;t||(t=new o.PlaneGeometry(s.size||400,s.size||400),t.rotateX(-Math.PI/2));const a=new o.Mesh(t,new o.ShaderMaterial({uniforms:{...n.uniforms,uWet:{value:s.wet??.6},uRings:{value:s.rings??1},...s.uniforms||{}},vertexShader:ot,fragmentShader:rt(s.mask||"return 1.;",s.head),transparent:!0,depthWrite:!0,blending:o.CustomBlending,blendEquation:o.AddEquation,blendSrc:o.OneFactor,blendDst:o.SrcAlphaFactor}));return a.renderOrder=X.film,a}const nt=`
attribute vec4 aR; attribute vec4 aR2; attribute vec4 aR3; attribute vec3 aTint; attribute vec4 aL; attribute vec3 aLd;
varying vec4 vR; varying vec3 vTint; varying vec3 vC; varying vec4 vL; varying vec2 vY; varying vec3 vLd;
${q}
void main() {
  float drip = aR3.x, ph = fract(uTime * aR2.y / max(aR.w, 0.1) + aR2.z), fall = mix(ph, ph * ph, drip);
  vec3 wc = (modelMatrix * vec4(aR.x, aR.y - fall * aR.w, aR.z, 1.)).xyz;
  vec3 wd = normalize(mat3(modelMatrix) * mix(vec3(0.075, -1., 0.035), vec3(0., -1., 0.), drip));
  vec3 toEye = cameraPosition - wc; float dist = length(toEye);
  vec3 side = cross(wd, toEye); side /= max(length(side), 1e-4);
  float hw = 0.03 + dist / 260.;
  vec3 wp = wc + wd * (position.y * aR2.x) + side * (position.x * hw);
#ifdef YARD_RAIN_MIRROR
  // (order 3, G2/R6) THE WATER TAKES IT: in the mirror group a stroke shivers sideways by the world's clock
  wp += side * (sin(wp.y * 1.9 + uTime * 2.6 + aR2.z * 40.) * 0.07);
#endif
  vY = vec2(wp.y, aR2.z);
  // THE CONE (aL: the lamp's place and its beam's reach; aLd its axis; reach 0: no cone): a stroke is lit by its
  // lamp only while it falls through the lamp's beam, by its own place on the world's clock: a lit volume in the air
  // (order 3, G2) the cone and the law are worked out in RAIN_FS, pixel by pixel along a long stroke, from the two
  // straight-line numbers handed on here: the stroke's place from its lamp (vL) and the lamp's axis (vLd)
  // aR2.w, the stroke's kind: 0 lit along its whole fall (a drip), 1 lit inside its lamp's CONE, 2 lit by THE ONE LAW
  // OF THE RAIN (R1, RAIN_FS) round its nearest lamp; a lamp with an axis (the board's) lights only the rain before it
  float kind = aR2.w;
  vR = vec4(position.x * hw, position.y, smoothstep(0., 0.05, ph) * (1. - smoothstep(0.93, 1., ph)) * yardTone(dist), drip);
  vTint = aTint; vC = vec3(step(0.5, dot(aLd, aLd)), step(1.5, kind), step(0.5, kind) * (1. - step(1.5, kind)));
  vL = vec4(wp - (modelMatrix * vec4(aL.xyz, 1.)).xyz, max(aL.w, 0.1));
  vLd = normalize(mat3(modelMatrix) * aLd + vec3(0., 0., 1e-5));
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
}`,st=`
varying vec4 vR; varying vec3 vTint; varying vec3 vC; varying vec4 vL; varying vec2 vY; varying vec3 vLd;
${q}
void main() {
  float px = max(fwidth(vR.x), 1e-5), hw = mix(0.006, 0.012, vR.w);
  // (order 3, M2) a far stroke goes to its mean and gets DIMMER by the footprint (3): its floor of strength falls
  // where a pixel is wide, so that far rain is a few dim strokes and never grain
  float line = yardLine(vR.x, hw, px, mix(1.5, 2., vC.z), mix(0.5, 0.6, vC.z) * (1. - 0.85 * smoothstep(0.04, 0.22, px))) * smoothstep(0., 0.25, vR.y) * (1. - smoothstep(0.7, 1., vR.y)) * vR.z;
  // (order 3, G2) R1, THE ONE LAW OF THE RAIN, for every stroke of the world: a stroke is lit by its nearest lamp
  // alone, brightest beside it and gone to black at the reach (vL.w: RAIN_REACH, baked): the square of what is left
  // of the reach, over the lamp's own spreading (half at RAIN_HALF metres). No floodlight on rain: lamps off, no rain.
  float d = length(vL.xyz), q = max(0., 1. - d / max(vL.w, 0.1)), law = q * q * ${Me.toFixed(1)} / (${Me.toFixed(1)} + d);
  // THE CONE (kind 1): lit only while it falls through its lamp's beam; a lamp with an axis lights only what is before it
  float al = dot(vL.xyz, vLd), rad = length(vL.xyz - vLd * al);
  float cone = smoothstep(-0.2, 0.5, al) * (1. - smoothstep(0.7, 1., al / vL.w)) * (1. - smoothstep(0.5, 1., rad / (0.3 + 0.45 * max(al, 0.))));
  float before = mix(1., smoothstep(-0.25, 0.35, al / max(d, 1e-3)), vC.x);
  vec3 lampC = yardLampColor(yardLamp(vTint.x, vTint.y)) * vTint.z * mix(1., 2.2 * law * before, vC.y) * mix(1., 1.1 * cone, vC.z);
#ifdef YARD_RAIN_MIRROR
  // (R6) the mirror's own rule: the stroke lies in the water in a few long pieces
  float pc = abs(fract(vY.x * 0.31 + vY.y * 7. + 0.12 * sin(vY.x * 1.7 + uTime * 1.9 + vY.y * 30.)) - 0.5) * 2.;
  lampC *= 0.75 * smoothstep(0.2, 0.2 + max(fwidth(vY.x) * 0.62, 0.02), pc);
#endif
  // a drip is a bead of glass that its lamp lights: white only by the lamp's own colour
  vec3 c = mix(lampC * 0.9, lampC * (1. + 1.2 * uGlass), vR.w);
  gl_FragColor = vec4(min(c, vec3(1.)) * line, 1.);
}`;function pe(n,s,t={}){const a=s.length,i=new o.InstancedBufferGeometry().copy(me()),x=new Float32Array(a*4),r=new Float32Array(a*4),m=new Float32Array(a*4),p=new Float32Array(a*3),w=new Float32Array(a*4),d=new Float32Array(a*3);for(let h=0;h<a;h++){const e=s[h],l=e.cone?1:e.lamp?2:0;x.set([e.x,e.y,e.z,e.span],h*4),r.set([e.len,e.speed,e.phase,l],h*4),m.set([e.drip||0,0,0,0],h*4),p.set([e.turnAt||0,e.doubt||0,e.amount||0],h*3),e.cone?(w.set([e.cone.pos.x,e.cone.pos.y,e.cone.pos.z,e.cone.reach??9],h*4),d.set([e.cone.dir.x,e.cone.dir.y,e.cone.dir.z],h*3)):e.lamp&&(w.set([e.lamp.pos.x,e.lamp.pos.y,e.lamp.pos.z,e.lamp.reach??Le],h*4),e.lamp.dir&&d.set([e.lamp.dir.x,e.lamp.dir.y,e.lamp.dir.z],h*3))}i.setAttribute("aL",new o.InstancedBufferAttribute(w,4)),i.setAttribute("aLd",new o.InstancedBufferAttribute(d,3)),i.setAttribute("aR",new o.InstancedBufferAttribute(x,4)),i.setAttribute("aR2",new o.InstancedBufferAttribute(r,4)),i.setAttribute("aR3",new o.InstancedBufferAttribute(m,4)),i.setAttribute("aTint",new o.InstancedBufferAttribute(p,3)),i.instanceCount=a;const y=new o.Mesh(i,new o.ShaderMaterial({uniforms:n.uniforms,vertexShader:nt,fragmentShader:st,side:o.DoubleSide,transparent:!0,depthWrite:!1,defines:t.mirror?{YARD_RAIN_MIRROR:1}:{},blending:o.CustomBlending,blendEquation:o.MaxEquation,blendSrc:o.OneFactor,blendDst:o.OneFactor}));return y.frustumCulled=!1,y.renderOrder=t.order??X.upright,y}function gt(n,s,t,a,i=9,x=0){const r=t.pos,m=t.dir,p=m.z,w=-m.x,d={pos:r,dir:m,reach:i};for(let y=0;y<a;y++){const h=s.range(.4,i),e=s.range(-.9,.9),l=s.range(.5,3.5),M=1+1.6*s.range(1.3,2.4),u=s.range(8,11),S=s();for(let I=0;I<5;I++){const R=H=>{const C=Math.sin((y*5+I+1)*H+S*91.7)*43758.5453;return C-Math.floor(C)},z=I?.5+R(12.9898)*(i*.9-.5):Math.min(h,i*.9),b=.3+.45*z,g=I?(R(78.233)*2-1)*b:Math.sin(e)*b,E=r.y+Math.sqrt(Math.max(0,b*b-g*g))+.2+(I?R(37.71):l/3.5)*.8;n.push({x:r.x+m.x*z+p*g,y:E+1.5,z:r.z+m.z*z+w*g,span:Math.max(4,Math.min(E+1.5-x,2*b+5)),len:M,speed:u,phase:(S+I/5)%1,turnAt:t.turnAt,doubt:t.doubt||0,amount:(1-z/(i+1))*.95,cone:d,rail:x})}}}const it=`
attribute vec4 aS; attribute vec4 aS2; attribute vec3 aTint; attribute vec4 aLp; varying vec2 vM; varying vec3 vTint; varying vec3 vP; varying vec2 vQ; varying vec4 vL; varying float vLow;
${q}
void main() {
  // (a height under nought marks a LOW BANK: the sheet is as wide at its foot as at its top)
  float low = step(aS.w, 0.), hgt = abs(aS.w), y = position.y, w = aS2.x * mix(0.45 + 0.55 * y, 1., low);
  vec2 t = vec2(cos(aS2.w), sin(aS2.w));
  vec3 p = aS.xyz + vec3(t.x * position.x * w, y * hgt, t.y * position.x * w) + vec3(aS2.y, 0., aS2.z) * y * y;
  vM = vec2(position.x * w, y * hgt); vTint = aTint; vLow = low;       // metres across the sheet and up it
  vP = vec3(hgt, fract(aS.x * 0.37 + aS.z * 0.11) + floor(aS2.w + 0.5) * 0.37, aS2.x);
  vQ = position.xy;
  // (order 3, G1) its lamp (aLp: place and reach): the sheet's place from it, a straight-line number for STEAM_FS
  vec4 wp = modelMatrix * vec4(p, 1.);
  vL = vec4(wp.xyz - (modelMatrix * vec4(aLp.xyz, 1.)).xyz, max(aLp.w, 0.1));
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,lt=`
varying vec2 vM; varying vec3 vTint; varying vec3 vP; varying vec2 vQ; varying vec4 vL; varying float vLow;
${q}
// one soft piece: a bell that falls to nothing with no edge, no ring and no curl; it rises, widens, sways and thins
float puff(vec2 m, float k, float seed, float H, float W) {
  float age = fract(uTime * 0.08 + k * 0.125 + seed);
  vec2 c = vec2(0.2 * W * sin(age * 4. + k * 2.4 + seed * 9.) * age, age * H * 0.8);
  float r = min(W, 0.3 * H) * (0.09 + 0.66 * age);
  vec2 q = (m - c) / max(r, 1e-3);
  q += 0.22 * sin(q.yx * 2.3 + vec2(seed * 7. + k, k * 1.7 + age * 3.));
  float b = max(0., 1. - dot(q, q) * 0.6);
  return b * b * b * smoothstep(0., 0.07, age) * (1. - age) * (1. - age);
}
// one soft piece of a LOW BANK (steam with no pipe under it: the wet ground's own breath): it comes up anywhere along
// the bank, drifts along it and a little upward, and goes again; as soft as the plume's piece
float bank(vec2 m, float k, float seed, float H, float W) {
  // (the sheet's seed comes as a varying: it is rounded to a 64th before it is hashed, so that no last bit of it
  // shows as a stipple)
  float sq = floor(seed * 64. + 0.5) / 64.;
  float age = fract(uTime * 0.1 + k * 0.125 + sq * (1. + k)), h1 = fract(sin(k * 12.9898 + sq * 78.233) * 437.5453), h2 = fract(h1 * 7.31 + 0.17);
  vec2 c = vec2((h1 * 2. - 1.) * 0.55 * W + (h2 - 0.5) * 1.3 * W * age, H * (0.16 + 0.3 * h2 + 0.22 * age));
  vec2 q = (m - c) / max(vec2(0.62 * W, 0.34 * H) * (0.7 + 0.3 * age), vec2(1e-3));
  q += 0.2 * sin(q.yx * 2.1 + vec2(seed * 7. + k, k * 1.7 + age * 3.));
  float b = max(0., 1. - dot(q, q) * 0.7), s = sin(3.14159 * age);
  return b * b * b * s * s;
}
void main() {
  float s = fract(vP.y), H = vP.x, W = vP.z;
  float sum = puff(vM, 0., s, H, W) + puff(vM, 1., s, H, W) + puff(vM, 2., s, H, W) + puff(vM, 3., s, H, W)
    + puff(vM, 4., s, H, W) + puff(vM, 5., s, H, W) + puff(vM, 6., s, H, W) + puff(vM, 7., s, H, W);
  // the column the pieces ride in: one soft swaying stem from the source, thinning to nothing at 0.8 of the rise
  float yk = clamp(vM.y / max(0.8 * H, 1e-3), 0., 1.), rad = min(W, 0.3 * H) * (0.07 + 0.5 * yk);
  float xs = (vM.x - 0.2 * W * sin(yk * 3.2 + s * 9. + uTime * 0.22) * yk) / max(rad, 1e-3);
  float stem = max(0., 1. - xs * xs); stem *= stem * (1. - yk) * (1. - yk) * smoothstep(0., 0.04, yk);
  float dens = 1. - exp(-1.1 * sum - 1.5 * stem);
  if (vLow > 0.5) {   // a low bank: no stem, six pieces
    float sb = bank(vM, 0., s, H, W) + bank(vM, 1., s, H, W) + bank(vM, 2., s, H, W) + bank(vM, 3., s, H, W) + bank(vM, 4., s, H, W) + bank(vM, 5., s, H, W);
    dens = (1. - exp(-1.3 * sb)) * smoothstep(0., 0.1, vQ.y);
  }
  // the sheet itself ends in nothing: no edge at its sides or its top
  dens *= (1. - smoothstep(0.5, 1., abs(vQ.x))) * (1. - smoothstep(0.7, 1., vQ.y));
  // lit ONLY where its lamp catches it, by that lamp's state (the square of what is left of the lamp's reach)
  float d = length(vL.xyz), q = max(0., 1. - d / vL.w);
  // (order 5, L3) STEAM HAS AN OUTLINE: the soft field is cut at one level into ONE FILLED SHAPE WITH AN EDGE (a
  // billow, graded from its edge to its heart) and its edge is drawn as a line of its lamp's colour, some two
  // pixels wide by the footprint, use (3). No soft round patch hangs in the air: what is under the level is
  // nothing. Lit by its lamp alone, by place and by that lamp's number, as before.
  float fw = max(fwidth(dens), 1e-4), th = 0.2;
  float shape = smoothstep(th - fw, th + fw, dens), line = (1. - smoothstep(0.9, 2.1, abs(dens - th) / fw)) * step(1e-3, dens);
  dens = shape * mix(0.3, 0.85, smoothstep(th, 0.85, dens)) + 0.75 * line;
  vec3 col = yardLampColor(yardLamp(vTint.x, vTint.y)) * vTint.z * q * q * dens * 1.5;
  gl_FragColor = vec4(min(col, vec3(1.)), 1.);
}`;function wt(n,s,t={}){const a=s.length*2,i=new Float32Array(a*4),x=new Float32Array(a*4),r=new Float32Array(a*3),m=new o.InstancedBufferGeometry;m.setAttribute("position",new o.Float32BufferAttribute([-1,0,0,1,0,0,1,1,0,-1,1,0],3)),m.setIndex([0,1,2,0,2,3]);const p=new Float32Array(a*4);s.forEach((d,y)=>{for(let h=0;h<2;h++){const e=y*2+h;i.set([d.pos.x,d.pos.y,d.pos.z,d.low?-d.h:d.h],e*4),x.set([d.w,d.lean.x,d.lean.z,h*1.5708],e*4),r.set(d.lamp?d.tint||[0,0,0]:[0,0,0],e*3),p.set(d.lamp?[d.lamp.pos.x,d.lamp.pos.y,d.lamp.pos.z,d.lamp.reach??Ne]:[0,0,0,.1],e*4)}}),m.setAttribute("aLp",new o.InstancedBufferAttribute(p,4)),m.setAttribute("aS",new o.InstancedBufferAttribute(i,4)),m.setAttribute("aS2",new o.InstancedBufferAttribute(x,4)),m.setAttribute("aTint",new o.InstancedBufferAttribute(r,3)),m.instanceCount=Math.max(a,0);const w=new o.Mesh(m,new o.ShaderMaterial({uniforms:n.uniforms,vertexShader:it,fragmentShader:lt,side:o.DoubleSide,transparent:!0,depthWrite:!1,blending:o.AdditiveBlending}));return w.frustumCulled=!1,w.renderOrder=t.order??X.upright,w}const T=(n,s,t)=>new o.Vector3(n,s,t),Be={H:80,half:4.5,tiers:12,first:10,step:6,ringR:11,lampR:11.3,lamps:48,guyOut:95,guyTop:78},dt=n=>({x:n.x,y:n.y,z:n.z+820,m:820+n.z,aside:Math.abs(30-n.x)});async function ht(n,s,t){const a=n.rng.fork("lamp-tower"),i=t.site||dt,x=t.detail??1,r=Be,m=ke(s,t.flood||s.flood),p=[],w=[],d=a.range(0,6.283),y=a.range(.003,.012),h=Math.cos(d)*y,e=Math.sin(d)*y,l=(c,f,A)=>T(c+h*f,f,A+e*f),M=[],u=[];for(let c=0;c<r.tiers;c++){const f=r.first+r.step*c;M.push(f),u.push([]);for(let A=0;A<r.lamps;A++){const v=(A+.5)/r.lamps*6.2831853,L=T(Math.sin(v),0,Math.cos(v)),k=l(L.x*r.lampR,f+.62,L.z*r.lampR),F=i(k),B=We(s,F,F.m,F.aside,k.y),P=a.chance(1/60),O=P?0:a.range(.6,1),W={pos:k,dir:L,turnAt:B.turnAt,doubt:B.doubt,strength:O,seed:a()};p.push(W),u[c].push(W)}}await n.yield();const S=(c,f=1)=>{const A=Math.max(0,Math.min(r.tiers-1,Math.round((c.y-r.first)/r.step)));let v=Math.atan2(c.x-h*c.y,c.z-e*c.y);v<0&&(v+=6.2831853);const L=u[A][Math.min(r.lamps-1,Math.floor(v/6.2831853*r.lamps))],k=L.pos.distanceTo(c);return[L.turnAt,L.doubt,Math.max(0,1-k/9)*f*(L.strength>0?1:.3)]},I=new o.Vector3,R=(c,f,A,v={})=>m.bar(c,f,A,{...v,tint:S(I.addVectors(c,f).multiplyScalar(.5),v.gain??1)}),z=r.half,b=[[z,z],[-z,z],[-z,-z],[z,-z]],g=[0,4];for(let c=10;c<=76;c+=6)g.push(c);g.push(79.2);for(let c=0;c<g.length-1;c++){const f=g[c],A=g[c+1];for(let v=0;v<4;v++){const[L,k]=b[v],[F,B]=b[(v+1)%4],P=(L+F)/2,O=(k+B)/2;R(l(L,f,k),l(L,A,k),.3),m.plate(l(L*.96,f,k*.96),l(L*.96,A,k*.96),l(F*.96,A,B*.96),l(F*.96,f,B*.96),{codes:[0,0]}),c>0&&R(l(L,f,k),l(F,f,B),.13),c%2?(R(l(L,f,k),l(P,A,O),.15),R(l(F,f,B),l(P,A,O),.15)):(R(l(P,f,O),l(L,A,k),.15),R(l(P,f,O),l(F,A,B),.15))}c>1&&(R(l(z,f,z),l(-z,f,-z),.09),R(l(-z,f,z),l(z,f,-z),.09))}for(let c=0;c<4;c++){const[f,A]=b[c],[v,L]=b[(c+1)%4];R(l(f,79.2,A),l(v,79.2,L),.13),R(l(f,79.2,A),l(0,82.5,0),.13)}m.bar(l(0,82.5,0),l(0,86,0),.04);for(let c=0;c<4;c++){const[f,A]=b[c];m.bar(l(f*1.18,.5,A*1.18),l(f*.82,.5,A*.82),.5,{carrier:1.9})}await n.yield();const E=r.lamps,H=(c,f,A)=>{const v=A/E*6.2831853;return l(Math.sin(v)*c,f,Math.cos(v)*c)};for(let c=0;c<r.tiers;c++){const f=M[c],A=v=>{const L=u[c][v%E];return[L.turnAt,L.doubt,L.strength>0?1:.3]};for(let v=0;v<E;v++){const L=H(r.ringR,f,v),k=H(r.ringR,f,v+1),F=H(r.ringR-1.5,f,v),B=H(r.ringR-1.5,f,v+1),P=A(v);m.bar(L,k,.13,{tint:P,carrier:1}),m.bar(F,B,.08,{tint:[P[0],P[1],P[2]*.6],carrier:.9}),m.plate(F,B,k,L,{tint:[P[0],P[1],P[2]*.8],codes:[0,0]})}for(let v=0;v<8;v++){const L=(v+.5)/8*6.2831853,k=Math.sin(L),F=Math.cos(L),B=z/Math.max(Math.abs(k),Math.abs(F)),P=l(k*(r.ringR-.2),f-.12,F*(r.ringR-.2));R(l(k*B,f-.12,F*B),P,.11,{carrier:.9}),R(l(k*B,f-3.2,F*B),l(k*(r.ringR-1.6),f-.2,F*(r.ringR-1.6)),.07,{carrier:.9})}c%4===3&&await n.yield()}const C=r.guyOut*Math.SQRT1_2;for(let c=0;c<4;c++){const[f,A]=b[c],v=t.guyTurn||0,L=Math.sign(f)*C,k=Math.sign(A)*C,F=l(f,r.guyTop,A),B=T(L*Math.cos(v)+k*Math.sin(v),.4,k*Math.cos(v)-L*Math.sin(v)),P=[],O=a.range(1.4,2.6)*2.5,W=a.range(0,6.28),U=T(-Math.sign(A),0,Math.sign(f)).multiplyScalar(Math.SQRT1_2),Y=14;for(let G=0;G<=Y;G++){const $=G/Y,Q=F.clone().lerp(B,$);Q.y-=Math.sin($*Math.PI)*O,P.push(Q)}for(let G=0;G<Y;G++){const $=Math.sin(G/Y*Math.PI)*.3,Q=Math.sin((G+1)/Y*Math.PI)*.3;m.bar(P[G],P[G+1],.028,{tint:[0,0,-1],sway0:[U.x*$,0,U.z*$,W],sway1:[U.x*Q,0,U.z*Q,W]})}m.bar(B,T(B.x*1.03,0,B.z*1.03),.25,{carrier:1.4})}const V=m.indexCount();for(let c=0;c<r.tiers;c++){const f=M[c];for(let A=0;A<E;A++){const v=u[c][A],L=[v.turnAt,v.doubt,v.strength>0?.4:.1];m.bar(H(r.ringR-.25,f+1.25,A),H(r.ringR-.25,f+1.25,A+1),.03,{tint:L,carrier:.6}),A%4===0&&m.bar(H(r.ringR-.25,f,A),H(r.ringR-.25,f+1.25,A),.03,{tint:L,carrier:.5})}}for(let c=0;c<g.length-1;c++)for(const f of[-.3,.3])R(l(-z-.4,g[c],f),l(-z-.4,g[c+1],f),.03,{carrier:.5});await n.yield();const D=Math.round(3400*x),N=Math.min(D,Math.round(1500*(t.rain??x)));for(let c=0;c<D;c++){const f=a.int(0,r.tiers-1),A=a.range(0,6.2831853),v=Math.abs(r.lampR+(a()+a()-1)*20),L=a.range(.45,1),k=4.5+(a.range(1.5,3.2)-1.5)*2.06,F=a.range(8,11),B=a(),P=a.chance(.15);if(c>=N)continue;const O=M[f]+3+9*L,W=Math.min(O,14+(P?6:0)),U=O-.5*W-.5*k;let Y=0;for(let $=1;$<r.tiers;$++)Math.abs(M[$]+2-U)<Math.abs(M[Y]+2-U)&&(Y=$);const G=u[Y][Math.min(E-1,Math.floor(A/6.2831853*E))];w.push({x:Math.sin(A)*v+h*O,y:O,z:Math.cos(A)*v+e*O,span:W,len:k*(t.rainLen??1),speed:F,phase:B,rail:0,turnAt:G.turnAt,doubt:G.doubt,amount:G.strength>0?1:.25,lamp:{pos:G.pos,reach:t.rainReach??Oe}}),c%800===799&&await n.yield()}for(let c=0;c<r.tiers;c++)for(let f=0;f<(t.drips??3);f++){const A=a.range(0,6.2831853),v=M[c]-.2,L=u[c][Math.min(E-1,Math.floor(A/6.2831853*E))],k=Math.sin(A)*(r.ringR+.1)+h*v,F=Math.cos(A)*(r.ringR+.1)+e*v,B=Math.sqrt(2*v/9.8)*1.15,P=2+Math.floor(v/22),O=a();for(let W=0;W<P;W++)w.push({x:k,y:v,z:F,span:v,len:a.range(.6,1)*(t.dripLen??1),speed:v/B,phase:O+W/P,turnAt:L.turnAt,doubt:L.doubt,amount:.5,drip:1})}return{b:m,sites:p,strokes:w,major:V,lean:[h,e]}}function ct(n,s,t){const a=t.scale||1,i=T(Math.sin(t.yaw||0),0,Math.cos(t.yaw||0)),x=T(i.z,0,-i.x),r=t.pos.clone().add(T(0,.98*a,0)),m=[t.turnAt,t.doubt||0,.55],p=(d,y,h)=>r.clone().addScaledVector(x,d*.27*a).add(T(0,y*.57*a,0)).addScaledVector(i,(-.004-h*.34)*a);for(const d of[-1,1])n.plate(p(d,-1,0),p(d,1,0),p(d,1,1),p(d,-1,1),{tint:m});for(const d of[-1,1])n.plate(p(-1,d,0),p(1,d,0),p(1,d,1),p(-1,d,1),{tint:m});n.plate(p(-1,-1,1),p(-1,1,1),p(1,1,1),p(1,-1,1),{});const w=t.pos.clone().addScaledVector(i,-.17*a);n.bar(w.clone().add(T(0,.02,0)),w.clone().add(T(0,.41*a,0)),.065*a,{carrier:.5*a,tint:m}),n.bar(w.clone().addScaledVector(x,-.3*a).add(T(0,.07,0)),w.clone().addScaledVector(x,.3*a).add(T(0,.07,0)),.07,{carrier:.5,tint:m}),n.bar(p(.6,-1,1),t.pos.clone().addScaledVector(i,-.75*a).addScaledVector(x,.3*a),.022,{carrier:.4}),s.push({pos:r,dir:i,turnAt:t.turnAt,doubt:t.doubt||0,strength:t.strength??1,seed:t.seed||0,cracked:t.cracked,flicker:t.flicker,scale:a===1?void 0:a})}function mt(n,s,t){const a=t.right,i=t.up||T(0,1,0),x=new o.Vector3().crossVectors(a,i).normalize(),r=t.cols||10,m=t.rows||8,p=t.pitchX||.9,w=t.pitchY||1.25,d=r*p+.5,y=m*w+.5,h=(e,l,M)=>t.origin.clone().addScaledVector(a,e).addScaledVector(i,l).addScaledVector(x,M);n.plate(h(0,0,-.1),h(0,y,-.1),h(d,y,-.1),h(d,0,-.1),{codes:[0,0]}),t.frame!==!1&&n.chain([h(0,0,-.1),h(d,0,-.1),h(d,y,-.1),h(0,y,-.1)],.07,{closed:!0,carrier:.9});for(let e=0;e<m;e++){const l=.25+(e+.5)*w,M=h(d/2,l,0);let u=null;for(let S=0;S<r;S++){const I=h(.25+(S+.5)*p,l,.02),R=t.lamp(I,M,S,e);u=u||R,s.push({pos:I,dir:x,up:i,turnAt:R.turnAt,doubt:R.doubt||0,strength:R.strength??1,seed:R.seed||0})}t.rails!==!1&&n.bar(h(.2,l-.4,-.02),h(d-.2,l-.4,-.02),.03,{carrier:.6,tint:[u.turnAt,u.doubt||0,t.railTint??.8]})}}async function pt(n,s,t,a,i){const x=n.rng.fork("units"),r=ke(s),m=[],p=[],w=[];[[-1.5,700],[0,780],[1.5,900]].forEach(([e,l],M)=>ct(r,m,{pos:T(e,0,.4*M),yaw:.25-.2*M,turnAt:l,strength:x.range(.7,1),seed:x()})),r.bar(T(3.2,0,-.6),T(3.2,2.2,-.6),.09,{carrier:.6}),w.push({pos:T(3.2,2.9,-.45),dir:T(-.25,0,.968).normalize(),turnAt:700,strength:1,seed:x(),cracked:1,flicker:1,scale:2}),mt(r,p,{origin:T(-4.75,1.6,-7),right:T(1,0,0),lamp:(e,l,M,u)=>({turnAt:745+u*10,doubt:u===6?1:0,strength:x.chance(1/60)?0:x.range(.6,1),seed:x()})});for(const e of[-4.4,4.4])r.bar(T(e,0,-7.25),T(e,1.6,-7.25),.12);await n.yield();const d=r.build();a.add(d),i.add(new o.Mesh(d.geometry,d.material));for(const[e,l]of[["dwarf",m],["board",p],["target",w]]){const M=ae(s,e,l),u=ae(s,e,l,{order:X.mirror});a.add(M.body,M.halo),i.add(u.body,u.halo,oe(s,l,{len:[.6,2.5],width:.14,gain:.3}))}const y=[];for(const e of m.concat(w))for(let l=0;l<26;l++){const M=x.range(-1.2,1.2),u=x.range(.3,3.5),S=e.pos.y+x.range(1,3);y.push({x:e.pos.x+Math.sin(M)*u,y:S,z:e.pos.z+Math.cos(M)*u,span:S,len:x.range(1.2,1.8),speed:x.range(8,10),phase:x(),turnAt:e.turnAt,amount:(1-u/4)*.9,flood:.03})}a.add(pe(s,y)),t.add(i,Fe(s,{size:600,wet:.6}));const h=new o.Mesh(new o.SphereGeometry(2900,16,8),new o.MeshBasicMaterial({color:s.pal[0],side:o.BackSide,fog:!1,depthWrite:!1}));return h.renderOrder=-.5,h.frustumCulled=!1,t.add(h),{object:t,mirror:i,style:s,radius:-2.4,height:2.2,center:T(.6,1,0),ground:!1,groundY:0,anchors:{},setFlown(e){s.setFlown(e)},setProgress(e){s.setFlown(e*1250)},update(e,l){s.setTime(l)},dispose(){}}}async function yt(n,s={}){const t=!s.inWorld&&s.proof?new Map(Object.entries(s.proof)):null,a=s.style||qe({palette:s.palette,flood:s.flood,salt:s.salt}),i=t&&t.get("yard"),x=s.flown??(i==="red"?640:i==="green"?900:i&&isFinite(+i)?+i:775);a.setFlown(x);const r=new o.Group,m=new o.Group,p=new o.Group;if(p.scale.y=-1,r.add(m),t&&t.get("yardShow")==="units")return pt(n,a,r,m,p);const w=await ht(n,a,{site:s.site,flood:s.flood,guyTurn:s.guyTurn,detail:s.detail??n.quality?.detail??1,rain:s.rain,drips:s.drips,dripLen:s.dripLen,rainLen:s.rainLen,rainReach:s.rainReach});await n.yield();const d=w.b.build();m.add(d),await n.yield(),await $e(d,w.sites,{reach:s.litReach??20,back:.8,below:!0,pause:()=>n.yield()}),await n.yield();const y=ae(a,"target",w.sites);m.add(y.body,y.halo),m.add(pe(a,w.strokes)),await n.yield();const h=new o.BufferGeometry;for(const u in d.geometry.attributes)h.setAttribute(u,d.geometry.attributes[u]);h.setIndex(d.geometry.index),h.setDrawRange(0,w.major),h.boundingSphere=d.geometry.boundingSphere;const e=ae(a,{...Re.target,hood:0},w.sites,{order:X.mirror});if(p.add(new o.Mesh(h,d.material),e.body,e.halo,oe(a,w.sites,{len:[.7,1.5],width:.32,gain:.26,band:1})),s.rainMirror!==0&&p.add(pe(a,w.strokes.filter(u=>u.lamp),{mirror:1,order:X.mirror})),!s.inWorld){r.add(p,Fe(a,{size:3e3,wet:.6}));const u=new o.Mesh(new o.SphereGeometry(2900,16,8),new o.MeshBasicMaterial({color:a.pal[0],side:o.BackSide,fog:!1,depthWrite:!1}));u.renderOrder=-.5,u.frustumCulled=!1,r.add(u)}let l=1/0,M=-1/0;for(const u of w.sites)u.turnAt>0&&(l=Math.min(l,u.turnAt),M=Math.max(M,u.turnAt));return{object:r,mirror:p,style:a,sites:w.sites,radius:t&&t.get("yardR")?+t.get("yardR"):31,height:t&&t.get("yardY")?0:80,center:T(0,t&&t.get("yardY")?+t.get("yardY"):s.inWorld?40:14,0),ground:!1,groundY:0,report:{minTurnAt:l,maxTurnAt:M,lamps:w.sites.length},anchors:{leg:{origin:T(30,0,0),dir:T(0,0,1),s:820},flyThrough:[T(30,4,-170),T(30,14,-115),T(30,30,-57),T(30,24,0),T(30,6,55)],viewpoints:{far:T(30,4,-170),gasp:T(30,30,-57)},gaze:T(0,46,0),top:T(0,80,0),guyAnchors:[1,-1].flatMap(u=>[1,-1].map(S=>{const I=Be.guyOut*Math.SQRT1_2,R=s.guyTurn||0;return T((u*Math.cos(R)+S*Math.sin(R))*I,0,(S*Math.cos(R)-u*Math.sin(R))*I)}))},setFlown(u){a.setFlown(u)},setProgress(u){a.setFlown(u*1250)},update(u,S,I,R){a.setTime(S),typeof R=="number"&&a.setFlown(R)},dispose(){}}}export{Re as LAMP_KINDS,X as ORDER,Ce as PALETTE,Me as RAIN_HALF,Le as RAIN_REACH,Te as RANK_DEEP,ee as RANK_END,Ee as RANK_FALL,Ne as STEAM_REACH,q as STYLE_GLSL,Oe as TOWER_RAIN_REACH,Ae as YARD_SALT,mt as addBoardPanel,ct as addDwarfSignal,gt as addLampRain,yt as buildHero,ke as makeBodyBuilder,Ye as makeBodyMaterial,ae as makeLampUnits,xt as makePools,pe as makeRain,ft as makeRankBands,ut as makeRuns,vt as makeSmears,wt as makeSteam,oe as makeStreaks,Fe as makeWetFilm,qe as makeYardStyle,Ge as yardCell,$e as yardLightFaces,Qe as yardNeighbours,We as yardSite,De as yardTurnAt};
