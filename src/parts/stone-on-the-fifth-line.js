import*as e from"three";const S=140,N=[15,10],le=[[16,4,0],[4,16,1],[3,4,0],[17,16,1],[15,16,0],[15,17,1],[14,17,0],[16,17,1],[3,14,0],[6,17,1],[13,16,0],[17,14,1],[9,3,0],[4,10,1],[16,15,0],[17,15,1],[3,16,0],[3,17,1],[2,17,0],[3,15,1],[2,16,0],[2,15,1],[4,15,0],[2,14,1],[4,17,0],[5,16,1],[4,18,0],[3,13,1],[10,16,0],[3,7,1],[5,4,0],[17,6,1],[17,5,0],[16,6,1],[14,4,0],[16,9,1]],Pe=[[15,16],[15,17],[16,17],[16,15],[14,17],[16,9]],Y=(s,p)=>[(s-10)*S,(p-10)*S],W=Math.PI/180,ze=new e.Vector3(Math.cos(14*W)*Math.sin(356*W),Math.sin(14*W),-Math.cos(14*W)*Math.cos(356*W)),$=new e.Vector2(Math.sin(176*W),-Math.cos(176*W)),be=1/Math.tan(14*W),y=94.7,ie=63,Z=24,ye=48,ce=30,me=s=>((s+4.4)%ce+ce)%ce,_e=s=>s*s*(3-2*s);function j(s){const p=me(s);if(p<=6)return 0;if(p<=16)return 526*_e(Math.pow((p-6)/10,2.2));const m=ce-p;if(m<=8)return 18*m;const l=(m-8)/6,h=108/382;return 144+382*(h*l+(3-2*h)*l*l+(h-2)*l*l*l)}const Be=s=>(j(s-.05)-j(s+.05))*10,De=["kerb","ring","dust","ground","ripple","plum","slate","slateLit","sheen","shell","shellShade","channel","violet"],Ue=["#FFF3D0","#FFE2A6","#F2C36B","#EBD0AE","#D9B68E","#8A6A66","#1E1B2A","#4A4460","#7C7896","#FBF3E2","#B9A9B8","#3A2A3C","#8C7FA6"],Se={gold:{apricot:"#F6B36A",rose:"#D99A8C"},rose:{apricot:"#F3A586",rose:"#CF8FA0",ground:"#EBCBB6",ripple:"#D9AE98"},grey:{apricot:"#E8C48C",rose:"#C9A9A0",ground:"#E4D6B8",ripple:"#CEBB97"}},J=`vec4 wm = vec4(w.x, w.y * uMir, w.z, w.w);
  if (uMir < 0.) {
    float sway = min(w.y, 600.) * (.012 * sin(dot(w.xz, vec2(.11, .05)) + w.y * .22 - uTime * 1.3) + .007 * sin(dot(w.xz, vec2(-.04, .17)) - uTime * 2.1));
    wm.x += .94 * sway; wm.z += .342 * sway;
  }
  gl_Position = projectionMatrix * viewMatrix * wm;`,Q=`
uniform vec3 uSun;
uniform vec4 uStone;   // x, underside height, z of the falling stone; w: seconds since the touch
uniform float uTime;
uniform sampler2D tBoard; uniform vec2 uShDir;
// How far a ray from p toward the sun runs inside the lens standing on foot (below zero: it misses).
float lensOver(vec3 p, vec3 foot){
  vec3 a = p - foot - vec3(0., ${(ye-y).toFixed(1)}, 0.), b = p - foot - vec3(0., ${y.toFixed(1)}, 0.);
  float ba = dot(a, uSun), bb = dot(b, uSun);
  float da = ba * ba - dot(a, a) + ${(y*y).toFixed(2)}, db = bb * bb - dot(b, b) + ${(y*y).toFixed(2)};
  if (da <= 0. || db <= 0.) return -1.;
  float sa = sqrt(max(da, 0.)), sb = sqrt(max(db, 0.));
  return min(-ba + sa, -bb + sb) - max(max(-ba - sa, -bb - sb), 0.);
}
float castOver(vec3 p){ return lensOver(p, vec3(uStone.x, uStone.y, uStone.z)); }
// The same for the standing stones: the two crossings whose stone could stand between p and the sun are
// looked up in the board's table (red: 1 a standing stone, .5 the seat of the falling one). self: a foot to skip.
float standAt(vec3 p, vec2 c, vec2 self){
  if (c.x < -.5 || c.x > 18.5 || c.y < -.5 || c.y > 18.5) return -1.;
  vec2 foot = (c - 9.) * ${S.toFixed(1)};
  if (textureLod(tBoard, (c + .5) / 19., 0.).r < .75 || abs(foot.x - self.x) + abs(foot.y - self.y) < 1.) return -1.;
  return lensOver(p, vec3(foot.x, 0., foot.y));
}
float standOver(vec3 p, vec2 self){
  vec2 g = p.xz + uShDir * (max(p.y, 0.) * ${be.toFixed(3)});
  float j = floor((g.y + 14.) / ${S.toFixed(1)} + 9.);
  float za = g.y - (j - 9.) * ${S.toFixed(1)}, k = uShDir.x / max(uShDir.y, 1e-3) / ${S.toFixed(1)};
  vec2 ca = vec2(floor(g.x / ${S.toFixed(1)} + 9.5 - za * k), j), cb = vec2(floor(g.x / ${S.toFixed(1)} + 9.5 - (za + ${S.toFixed(1)}) * k), j - 1.);
  return max(standAt(p, ca, self), standAt(p, cb, self));
}
float castShade(vec3 p){ return step(0.02, max(castOver(p), standOver(p, vec2(1e6)))); }
vec3 inkStep(vec3 n, vec3 lit, vec3 mid, vec3 dark, float shd){
  float d = dot(n, uSun);
  return d > .42 && shd < .5 ? lit : (d > .02 && shd < .5 ? mid : dark);
}
`,pe=`
uniform float uMir, uTime;
varying vec3 vW; varying vec3 vN;
#ifdef USE_COLOR
varying vec3 vC;
#endif
void main(){
  vec4 p = vec4(position, 1.); vec3 n = normal;
  #ifdef USE_INSTANCING
  p = instanceMatrix * p; n = mat3(instanceMatrix) * n;
  #endif
  #ifdef USE_COLOR
  vC = color;
  #endif
  vec4 w = modelMatrix * p; vW = w.xyz; vN = mat3(modelMatrix) * n;
  ${J}
}
`;function we(s=112,p=0){const m=p||Math.max(6,Math.round(s/9)),l=s>=96?5:3,h=1,E=y-Z,A=Math.sqrt((y-h)*(y-h)-E*E),x=ie/(A+h),z=Math.atan2(A,E),L=[];for(let i=0;i<=m;i++){const c=z*i/m;L.push([y*Math.sin(c),y*(1-Math.cos(c)),Math.sin(c),-Math.cos(c)])}for(let i=1;i<l;i++){const c=(-1+2*i/l)*(Math.PI/2-z);L.push([A+h*Math.cos(c),Z+h*Math.sin(c),Math.cos(c),Math.sin(c)])}for(let i=m;i>=0;i--){const c=z*i/m;L.push([y*Math.sin(c),ye-y*(1-Math.cos(c)),Math.sin(c),Math.cos(c)])}const M=L.length,C=new Float32Array(M*(s+1)*3),T=new Float32Array(M*(s+1)*3),O=[];for(let i=0;i<M;i++)for(let c=0;c<=s;c++){const B=c/s*Math.PI*2,I=Math.cos(B),P=Math.sin(B),V=(i*(s+1)+c)*3,G=L[i];C[V]=G[0]*x*I,C[V+1]=G[1],C[V+2]=G[0]*x*P,T[V]=G[2]*I,T[V+1]=G[3],T[V+2]=G[2]*P}for(let i=0;i<M-1;i++)for(let c=0;c<s;c++){const B=i*(s+1)+c,I=B+s+1;i>0&&O.push(B,I,B+1),i<M-2&&O.push(B+1,I,I+1)}const a=new e.BufferGeometry;return a.setAttribute("position",new e.BufferAttribute(C,3)),a.setAttribute("normal",new e.BufferAttribute(T,3)),a.setIndex(O),a.boundingSphere=new e.Sphere(new e.Vector3(0,Z,0),ie+1),a}const He=`
attribute float aInk; uniform float uMir, uTime;
varying vec3 vW; varying vec3 vN; varying vec3 vL; varying float vInk;
void main(){
  vec4 p = vec4(position, 1.); vL = position; vInk = aInk; vN = normal;
  #ifdef USE_INSTANCING
  p = instanceMatrix * p; vN = mat3(instanceMatrix) * normal;   // a tilted stone of a heap keeps its true normals
  #endif
  vec4 w = modelMatrix * p; vW = w.xyz;
  ${J}
}
`,je=`
${Q}
uniform vec3 cSlate, cSlateHalf, cSlateLit, cSheen, cShell, cShellHalf, cShellShade, cWhite, cViolet, cGround, cKerb;
varying vec3 vW; varying vec3 vN; varying vec3 vL; varying float vInk;
float lcov(float dist, float hw, float f){ return clamp((max(hw, .6 * f) - dist) / f + .5, 0., 1.) * clamp(2.4 * hw / f, 0., 1.); }
void main(){
  vec3 n = vN / max(length(vN), 1e-4);
  float dry = step(3.5, vInk), kind = vInk - 4. * dry;
  bool slate = kind < .5 || kind > 1.5, upper = vL.y > ${Z.toFixed(1)};
  vec2 foot = floor((vW.xz - vL.xz) / ${S.toFixed(1)} + .5) * ${S.toFixed(1)};     // the stone's own crossing
  float shd = step(.3, max(kind > 1.5 ? -1. : castOver(vW), standOver(vW, foot)));
  float d0 = dot(n, uSun), fy = max(fwidth(vL.y), 1e-4);
  float ang = atan(vL.z, abs(vL.x) < 1e-4 ? 1e-4 : vL.x), hs = fract(sin(dot(foot, vec2(.0131, .0173))) * 91.7);
  // the bands: slate's strata rings (level, each wandering a little), shell's grain (parallel, in a direction fixed
  // by the stone's own place)
  float ga = hs * 6.2832;
  float g = slate ? (vL.y + .9 * sin(ang * 3. + vL.y * .3) + .5 * sin(ang * 7. + 2.)) / 4.6
                  : (dot(vL.xz, vec2(cos(ga), sin(ga))) + vL.y * .45 + 2.2 * sin(vL.y * .21 + ga)) / 3.4;
  float fg = max(fwidth(g), 1e-4), bid = floor(g + .5);
  // the light over the domes: the steps between the tones glide a few metres to and fro as the light breathes, in
  // slow waves that drift down the wind across the board, by place and clock; and the edge's own fine waver (wv:
  // -1..1, gone where a pixel is wider than a crest; 0.0032 of the step is 0.3 m on a cap of this radius)
  float fp = fwidth(vL.x) + fwidth(vL.y) + fwidth(vL.z);
  float wv = (.55 * sin(dot(vL, vec3(2., .9, 1.)) + 6.2832 * g) + .45 * sin(dot(vL, vec3(-1.2, 1.4, 2.5)) - 3.1416 * g + 1.7)) * clamp(1.6 - fp * 1.3, 0., 1.);
  float d = d0 + .065 * sin(uTime - dot(vW.xz, vec2(.94, .342)) * .018) + .028 * sin(uTime * 1.9 + dot(vW.xz, vec2(-.342, .94)) * .031)
    + .0032 * sqrt(max(1. - d0 * d0, 0.)) * wv;
  float ny = n.y + .0014 * wv;
  // the tone: slate 4 sheen, 3 lit, 2 half, 1 shade; shell 4 lit, 3, 2 half, 1, 0 shade (5 the sheen);
  // on the underside 2 half, 0 the near bounce, -1 the deep bounce
  float t;
  if (upper) {
    if (slate) {
      t = (d > .42 && ny < .9) ? 3. : ((d > .03 || ny > .9) ? 2. : 1.);
      if (d > .5 && d < .6 && n.y > .88) t = 4.;
      if (shd > .5) t = 1.;
    } else {
      t = d > .2 ? 4. : (d > -.05 ? 3. : (d > -.25 ? 2. : (d > -.4 ? 1. : 0.)));
      if (d > .5 && d < .6 && n.y > .88) t = 5.;
      if (shd > .5) t = 0.;
    }
  } else {
    t = d > .25 ? 2. : (d > -.12 ? 0. : -1.);
    if (shd > .5) t = -1.;
  }
  float rim = clamp((max(.5, .5 * fy) - abs(vL.y - ${Z.toFixed(1)})) / fy + .5, 0., 1.) * clamp(1.2 / fy, .5, 1.) * max(step(.3, d0), dry) * (1. - shd);
  // the fields of the veins, the growth rings and the water light, with their footprints: taken here, for every
  // pixel, so that no derivative is asked for inside a branch
  vec2 vd = vec2(cos(ga * 1.7 + 1.), sin(ga * 1.7 + 1.));
  float v1 = dot(vL.xz, vd) + 7. * sin(dot(vL.xz, vec2(-vd.y, vd.x)) * .06 + ga) + vL.y * .7 - 30. * (hs - .5);
  float v2 = dot(vL.xz, vec2(-vd.y, vd.x)) * .8 + dot(vL.xz, vd) * .6 + 5. * sin(vL.y * .2 + ga * 3.) + 22.;
  float fv1 = max(fwidth(v1), 1e-4), fv2 = max(fwidth(v2), 1e-4);
  float rr = length(vL.xz) + 1.3 * sin(ang * 5. + ga) + .8 * sin(ang * 9. - ga * 2.), fr = max(fwidth(rr), 1e-4);
  vec2 q = (vL.xz + foot * .37) * .36; float T = uTime * .5;
  float a = sin(q.x + 1.5 * sin(q.y * .63 + T) + .6 * sin(q.y * 1.9 - T * 1.3)), b = sin(q.y * 1.13 + 1.5 * sin(q.x * .71 - T * .8) + 2. + .6 * sin(q.x * 2.1 + T * 1.1));
  float fa = max(fwidth(a), 1e-4), fb = max(fwidth(b), 1e-4);
  vec3 col, netA, netB, wet;
  if (slate) {
    float wd = .055 + .03 * sin(bid * 3.7);
    float ring = (1. - smoothstep(wd, wd + fg, abs(fract(g) - .5))) * clamp(1.2 - fg * 1.5, .3, 1.);
    vec3 bounce = mix(cSlate, cGround, .2), deep = mix(cSlate, cGround, .09);
    col = t > 3.5 ? cSheen : (t > 2.5 ? cSlateLit : (t > 1.5 ? cSlateHalf : (t > .5 ? cSlate : (t > -.5 ? bounce : deep))));
    vec3 up = t > 2.5 ? cSheen : (t > 1.5 ? cSlateLit : (t > .5 ? cSlateHalf : (t > -.5 ? mix(cSlate, cGround, .34) : bounce)));
    col = mix(col, up, ring);
    // a pale vein across the stone, and on every other stone a second one, each wandering
    float vein = max(lcov(abs(v1), .5, fv1), step(.5, fract(hs * 7.)) * lcov(abs(v2), .38, fv2));
    col = mix(col, mix(cSheen, cKerb, .3), .8 * vein * (upper ? 1. : .5));
    col = mix(col, mix(cSheen, cKerb, .2), rim);
    netA = mix(cSlateLit, cKerb, .6); netB = mix(cSlate, cGround, .42); wet = cSlate * .55;
  } else {
    float wd = .13 + .05 * sin(bid * 2.4 + ga);
    float line = (1. - smoothstep(wd, wd + fg, abs(fract(g) - .5))) * clamp(1. - fg * 1.6, .32, 1.);
    vec3 bounce = mix(cShellShade, cGround, .5), deep = mix(cShellShade, cGround, .22), dark = mix(cShellShade, cViolet, .4);
    vec3 s3 = mix(cShell, cShellHalf, .5), s1 = mix(cShellHalf, cShellShade, .5);
    col = t > 4.5 ? cWhite : (t > 3.5 ? cShell : (t > 2.5 ? s3 : (t > 1.5 ? cShellHalf : (t > .5 ? s1 : (t > -.25 ? (upper ? cShellShade : bounce) : deep)))));
    vec3 dn = t > 4.5 ? cShell : (t > 3.5 ? cShellHalf : (t > 2.5 ? s1 : (t > 1.5 ? cShellShade : (t > .5 ? dark : (t > -.25 ? (upper ? dark : deep) : mix(cShellShade, cViolet, .3))))));
    col = mix(col, dn, line * (upper && t > 3.5 ? .4 : .8));
    // three broad growth rings round the crown, each wandering, in a warm pale tone of what they cross
    if (upper) {
      float grow = max(max(lcov(abs(rr - 13.), .8, fr), lcov(abs(rr - 26.), 1., fr)), lcov(abs(rr - 40.), .8, fr));
      col = mix(col, mix(col, cGround, .55) * .96, grow);
    }
    col = mix(col, mix(cShell, cKerb, .6), rim);
    netA = mix(cShell, cKerb, .5); netB = mix(cShell, cGround, .3); wet = mix(cShellShade, cViolet, .55) * .8;
  }
  if (!upper && dry < .5) {
    // water light under the eave: two sets of wavering bright bands that cross as a net and slide slowly, by the
    // stone's own place and the clock; the bands are widest at the waterline
    float lift = kind > 1.5 ? exp(-uStone.y / 45.) : 1.;
    float hw = (.3 - .24 * clamp(vL.y / ${Z.toFixed(1)}, 0., 1.)) * lift * (1. - .5 * shd);
    float core = max(lcov(abs(a), hw * .45, fa), lcov(abs(b), hw * .45, fb)), halo = max(lcov(abs(a), hw, fa), lcov(abs(b), hw, fb));
    col = mix(col, netB, .75 * halo); col = mix(col, netA, .9 * core);
    // the wet band and the tide line
    float hh = vL.y + .5 * sin(ang * 6. + ga) + .3 * sin(ang * 13. - ga);
    col = mix(col, wet, .6 * clamp((6.5 - hh) / fy + .5, 0., 1.));
    col = mix(col, mix(cShell, cWhite, .4), lcov(abs(hh - 7.6), .42, fy) * (1. - .4 * shd));
  }
  gl_FragColor = vec4(col, 1.);
}
`,Ke=`
${Q}
uniform vec3 cLit, cHalf, cShade; uniform float uMir;
varying vec3 vW; varying vec3 vN;
#ifdef USE_COLOR
varying vec3 vC;
#endif
void main(){
  vec3 n = vN / max(length(vN), 1e-4);
  #ifdef DOUBLE_SIDED
  if (gl_FrontFacing == (uMir < 0.)) n = -n;       // a two-sided ink: the face turned away takes the normal turned over
  #endif
  vec3 col = inkStep(n, cLit, cHalf, cShade, castShade(vW));
  #ifdef USE_COLOR
  col *= vC;
  #endif
  gl_FragColor = vec4(col, 1.);
}
`,Ie=`
float h1(vec2 v){ return fract(sin(dot(v, vec2(12.9898, 78.233))) * 43758.5453); }
float cov(float d, float hw, float f){ return clamp((hw - d) / f + .5, 0., 1.); }
`,Xe=`
${Q}
${Ie}
uniform vec3 cWater, cBar, cFoam, cShadow, cDark; uniform float uOpacity; uniform vec2 uLand;
varying vec3 vW;
// ripple bars: thin pale crests lying across the breeze that comes over the water from the north, travelling
// down it, each a row of lengths with gaps: a sparse set 30 m apart everywhere, and a fainter fine set 7.5 m apart
// shown only inside wide patches that drift down the breeze at 4 m a second (where a breath of wind touches the
// still water)
float crest(float al, float ac, float gap, float hw, float v, float fa){
  float c = (al - uTime * v + .3 * gap * sin(ac * .33 / gap + gap)) / gap, n = floor(c);
  float cut = step(.42, fract(ac / (4. * gap + 60.) + h1(vec2(n, gap)) * 5. + uTime * .01 * v));      // each crest is a row of lengths
  return cut * cov(abs(c - n - .5) * gap, max(hw, .5 * fa), fa) * clamp(3.4 * hw / fa, 0., 1.);
}
float bars(vec2 p){
  vec2 wd = vec2(.17, .985);
  float al = dot(p, wd), ac = dot(p, vec2(-wd.y, wd.x)), fa = max(fwidth(al), 1e-3);
  vec2 g = vec2(al - uTime * 4., ac) / vec2(170., 260.);
  float gust = sin(g.x * 1.7 + 1.3 * sin(g.y * 2.1 + .6)) + sin(g.y * 2.9 + 1.1 * sin(g.x * 1.3 + 2.));
  // and one more sparse set, fainter, 38 m apart, coming across the first from the east
  vec2 we = vec2(-.96, .28);
  float bl = dot(p, we), fb = max(fwidth(bl), 1e-3);
  return max(max(.5 * smoothstep(.3, .7, gust) * crest(al, ac, 7.5, .3, 1.8, fa), crest(al, ac + 300., 30., .24, 2.4, fa)),
    .6 * crest(bl, dot(p, vec2(-we.y, we.x)) + 170., 38., .22, 2., fb));
}
void lay(inout vec3 C, inout float T, vec3 c, float a){ C = C * (1. - a) + c * a; T *= 1. - a; }
void main(){
  vec2 p = vW.xz;
  vec2 f2 = max(fwidth(p), vec2(1e-3)); float fc = max(f2.x, f2.y);
  vec2 q = p / ${S.toFixed(1)} + 9.;
  vec2 cell = clamp(floor(q + .5), 0., 18.);
  vec2 d = (q - cell) * ${S.toFixed(1)};
  float r = length(d);
  vec4 brd = textureLod(tBoard, (cell + .5) / 19., 0.);
  vec3 P = vec3(p.x, 0., p.y);
  float ov = max(castOver(P), standOver(P, vec2(1e6)));
  float sh = clamp(ov / max(fwidth(ov), .05), 0., 1.);            // 1 under a stone's shadow, its edge one pixel soft
  vec3 C = cWater * uOpacity; float T = 1. - uOpacity;

  // a causeway's own shadow: 0.6 m of wall lays 2.4 m of shade on the water along the south bank of one running east
  float bank = cov(abs(d.y - 3.7), 1.2, f2.y) * clamp(2.4 / f2.y, 0., 1.) * (1. - cov(abs(d.x), 2.5, f2.x));
  lay(C, T, cShadow, .5 * max(sh, bank));                         // the shadow lies on the sheet, under every mark
  lay(C, T, cBar, .6 * (1. - .3 * sh) * bars(p));

  // the wave: a swell running out from the rim at 90 m a second and fading with its age (to less than half its
  // strength by 20 s after the touch): a pale face 13 to 31 m wide before a bright crest, a darker trough 11 to
  // 25 m wide behind it, a second thinner crest behind the trough and one faint ring following; the widths swell
  // and thin round the ring by place and the whole ring wanders up to 3 m off the round. No crest is drawn
  // thinner than a pixel, no band thinner than four.
  vec2 wq = p - uLand;
  float dl = length(wq), fl = max(fwidth(dl), 1e-3), front = ${ie.toFixed(1)} + 90. * uStone.w;
  float wa = atan(wq.y, abs(wq.x) < 1e-4 ? 1e-4 : wq.x);
  float swell = .5 + .5 * sin(wa * 5. + 1.3 + .35 * sin(wa * 11.)), swell2 = .5 + .5 * sin(wa * 8. - 2.1);
  float lw = max(3.2, 1.05 * fl), st = (1. - .4 * smoothstep(900., 2000., dl)) * (1. - .55 * smoothstep(5., 20., uStone.w));
  float wr = dl - front - 3. * sin(wa * 9. + .7) * clamp(3.2 / fl, 0., 1.);
  float face = max(6.5 + 9. * swell, 2. * fl), trough = max(5.5 + 7. * swell2, 2. * fl);
  lay(C, T, cFoam, .3 * st * cov(abs(wr - face), face, fl));
  lay(C, T, cDark, .5 * st * cov(abs(wr + trough), trough, fl));
  float crest = cov(abs(wr), lw * (.55 + .9 * swell), fl), crest2 = cov(abs(wr + 2. * trough + lw), lw * (.55 + .4 * swell2), fl);
  lay(C, T, cFoam, st * max(max(.9 * crest, .6 * crest2), .3 * cov(abs(wr + 2. * trough + 18.), .55 * lw, fl)));
  // where it crosses a causeway it breaks: white flecks on the water for some metres either side, each lasting a
  // third of a second; where a fleck is smaller than a pixel, their mean
  float nearC = 1. - smoothstep(4., 11., min(abs(d.x), abs(d.y))), brk = cov(abs(wr + trough), trough + lw, fl);
  if (nearC * brk > 0.) {
    float fk = step(.52, h1(floor(p / 1.7) + floor(uTime * 3.) * 7.31)) * cov(length(fract(p / 1.7) - .5) * 1.7, .55, fc);
    lay(C, T, cFoam, st * nearC * brk * mix(fk, .3, smoothstep(.6, 1.6, fc / 1.7)));
  }

  // salt: a thin pale line along both waterlines of every causeway, wandering a little, and round each platform
  vec2 sw = 2.95 + .22 * sin(p.yx * .9 + cell * 1.7) + .12 * sin(p.yx * 2.3);
  vec2 sl2 = vec2(cov(abs(abs(d.x) - sw.x), max(.2, .5 * f2.x), f2.x) * clamp(.8 / f2.x, 0., 1.), cov(abs(abs(d.y) - sw.y), max(.2, .5 * f2.y), f2.y) * clamp(.8 / f2.y, 0., 1.));
  float starW = step(abs(fract((cell.x - 3.) / 6. + .5) - .5), .05) * step(abs(fract((cell.y - 3.) / 6. + .5) - .5), .05);
  float salt = max(sl2.x * step(sw.y, abs(d.y)), sl2.y * step(sw.x, abs(d.x))) * (1. - starW * step(r, 18.4));
  salt = max(salt, starW * cov(abs(r - 18.5), max(.22, .5 * fc), fc) * clamp(.8 / fc, 0., 1.) * step(3., min(abs(d.x), abs(d.y))));
  lay(C, T, cFoam, .8 * salt * (1. - .35 * sh));

  // foam where a stone's underside meets the water: a thin wandering ring; a second ring runs out from it when the
  // wave reaches that stone. The falling stone has its ring only while it is seated.
  float ang = atan(d.y, abs(d.x) < 1e-4 ? 1e-4 : d.x);
  float has = brd.r > .75 ? 1. : (brd.r > .25 ? step(uStone.y, .6) : 0.);
  float r0 = 11.6 + .55 * sin(ang * 5. + uTime * .6 + cell.x * 1.7) + .3 * sin(ang * 11. - uTime * .9 + cell.y);
  float foam = cov(abs(r - r0), max(.42, .5 * fc), fc) * clamp(1.7 / fc, 0., 1.);
  float tc = uStone.w - (length((cell - 9.) * ${S.toFixed(1)} - uLand) - ${ie.toFixed(1)}) / 90.;
  if (tc > 0. && tc < 4.) foam = max(foam, (1. - tc / 4.) * cov(abs(r - r0 - tc * 7.), max(.5, .5 * fc), fc) * clamp(1.7 / fc, 0., 1.));
  lay(C, T, cFoam, has * foam);

  // under the lifting stone: small rings where its falling water strikes the sheet
  float env = smoothstep(6.3, 7.2, uStone.w) * (1. - smoothstep(12., 13.8, uStone.w));
  if (env > 0. && dl < 58.) {
    vec2 g = (p - uLand) / 7., id = floor(g);
    float tt = fract(uTime * .8 + h1(id) * 7.);
    float ring = cov(abs(length((g - id - .5) * 7.) - tt * 3.2), max(.25, .5 * fc), fc) * (1. - tt) * step(.35, h1(id + 3.)) * clamp(1.2 / fc, 0., 1.);
    lay(C, T, cFoam, ring * env);
  }
  gl_FragColor = vec4(C, 1. - T);
}
`,Ye=`
${Q}
${Ie}
uniform vec3 cChan, cChan2, cKerb, cShell, cShadeMul; uniform vec2 uLand;
varying vec3 vW;
void main(){
  vec2 p = vW.xz;
  vec2 f2 = max(fwidth(p), vec2(1e-3)); float fc = max(f2.x, f2.y);
  vec2 q = p / ${S.toFixed(1)} + 9.;
  vec2 cell = clamp(floor(q + .5), 0., 18.);
  vec2 d = (q - cell) * ${S.toFixed(1)}, ad = abs(d);
  float r = length(d);
  float star = step(abs(fract((cell.x - 3.) / 6. + .5) - .5), .05) * step(abs(fract((cell.y - 3.) / 6. + .5) - .5), .05);
  vec2 hw = max(vec2(2.5), f2 * .78);
  vec2 fade = 1. - .4 * smoothstep(vec2(30.), vec2(150.), f2);
  float wX = cov(ad.x, hw.x, f2.x) * fade.x, wZ = cov(ad.y, hw.y, f2.y) * fade.y;
  float eX = cov(abs(d.x + 2.), max(.4, .5 * f2.x), f2.x) * clamp(1.1 / f2.x, 0., 1.);
  float eZ = cov(abs(d.y + 2.), max(.4, .5 * f2.y), f2.y) * clamp(1.3 / f2.y, 0., 1.);
  float edge = max(eX * (1. - cov(ad.y, 1.6, f2.y)), eZ * (1. - cov(ad.x, 1.6, f2.x)));
  float disc = star * cov(r, max(18., .9 * fc), fc);
  float rim = star * cov(abs(r - 17.3), max(.8, .55 * fc), fc) * clamp(3.2 / fc, .5, 1.);
  float a = max(max(wX, wZ), disc);
  edge = max(edge * (1. - star * cov(r, 16.4, fc)), rim);
  // the paving: slabs by place. On a causeway: the place along it and the row across it; on a platform: rings 3 m
  // wide cut into slabs round the centre
  bool nx = wX > wZ; float alo = nx ? p.y : p.x, acr = nx ? d.x : d.y, id = nx ? cell.x : cell.y + 31.;
  float row = step(0., acr), sl = alo / 3.6 + row * .5, fs = (nx ? f2.y : f2.x) / 3.6;
  float tone = h1(vec2(floor(sl), id + row * 7.)), joint = max(cov(.5 - abs(fract(sl) - .5), .022, fs), cov(abs(acr), .08, nx ? f2.x : f2.y));
  if (star * cov(r, 17., fc) > .5) {
    float ri = floor(r / 3.), n = 5. + 6. * ri, an = atan(d.y, abs(d.x) < 1e-4 ? 1e-4 : d.x) / 6.2832 * n + ri * .37;
    fs = fc * n / (6.2832 * max(r, 1.));
    tone = h1(vec2(floor(an), ri + cell.x * 3. + cell.y * 11.));
    joint = max(cov(.5 - abs(fract(an) - .5), .012 * n / max(r, 1.), fs), cov(.5 - abs(fract(r / 3.) - .5), .027, fc / 3.));
  }
  float fine = clamp(1.7 - fs * 4.2, 0., 1.);                    // 1 where a slab is plain to see, 0 where it is under two and a half pixels
  vec3 top = mix(mix(cChan, cChan2, .5), mix(tone > .5 ? cChan2 : cChan, cChan * .62, joint), fine);
  // lengths of the kerb course take the paler ink in turn, sliding slowly along the bank
  vec3 ecol = mix(cKerb, cShell, step(.5, fract(alo / 31. + h1(vec2(id, 2.)) * 7. - uTime * .09)));
  vec3 col = mix(top, ecol, edge);
  // (the wave's ring as the water sheet draws it: wandering up to 3 m off the round, breaking over its trough)
  vec2 wq = p - uLand;
  float dl = length(wq), fl = max(fwidth(dl), 1e-3), front = ${ie.toFixed(1)} + 90. * uStone.w, lw = max(3.2, 1.05 * fl);
  float wa = atan(wq.y, abs(wq.x) < 1e-4 ? 1e-4 : wq.x);
  float wr = dl - front - 3. * sin(wa * 9. + .7) * clamp(3.2 / fl, 0., 1.), trough = max(5.5 + 7. * (.5 + .5 * sin(wa * 8. - 2.1)), 2. * fl);
  float brk = cov(abs(wr + trough), trough + lw, fl) * (1. - .4 * smoothstep(900., 2000., dl)) * (1. - .55 * smoothstep(5., 20., uStone.w));
  col = mix(col, cShell, brk * mix(step(.42, h1(floor(p / 1.4) + floor(uTime * 3.) * 5.17)), .55, smoothstep(.6, 1.6, fc / 1.4)));
  vec3 P = vec3(p.x, .6, p.y);
  float ov = max(castOver(P), standOver(P, vec2(1e6)));
  col = mix(col, col * cShadeMul, clamp(ov / max(fwidth(ov), .05), 0., 1.));
  if (a < .004) discard;                                         // after every derivative above
  gl_FragColor = vec4(col, a);
}
`,Ze=`
uniform vec3 uSun; uniform vec3 cApricot, cRose, cViolet, cKerb, cWater, cDust, cMist; uniform float uMir, uTime;
varying vec3 vP;
void main(){
  vec3 dir = vP / max(length(vP), 1e-3); dir.y *= uMir;
  if (uMir < 0.) {                       // the image wavers: its heights go up and down a little by bearing and clock
    float az = atan(dir.z, abs(dir.x) < 1e-5 ? 1e-5 : dir.x);
    dir.y += .008 * sin(az * 23. + dir.y * 9. - uTime * 1.1) + .004 * sin(az * 61. - uTime * 1.7);
    dir = dir / max(length(dir), 1e-4);
  }
  float e = degrees(asin(clamp(dir.y, -1., 1.))), fe = max(fwidth(e), 1e-4);
  vec3 col = cMist;
  col = mix(col, cApricot, clamp((e + .0) / fe + .5, 0., 1.));
  col = mix(col, mix(cApricot, cRose, .45), clamp((e - 4.) / fe + .5, 0., 1.));
  col = mix(col, cRose, clamp((e - 9.) / fe + .5, 0., 1.));
  col = mix(col, mix(cRose, cViolet, .4), clamp((e - 16.) / fe + .5, 0., 1.));
  col = mix(col, mix(cRose, cViolet, .72), clamp((e - 26.) / fe + .5, 0., 1.));
  col = mix(col, cViolet, clamp((e - 40.) / fe + .5, 0., 1.));
  float a = degrees(acos(clamp(dot(dir, uSun), -1., 1.))), fa = max(fwidth(a), 1e-4), up = step(0., e);
  col = mix(col, cApricot, up * clamp((16. - a) / fa + .5, 0., 1.));
  col = mix(col, cDust, up * clamp((9.5 - a) / fa + .5, 0., 1.));
  col = mix(col, cWater, up * clamp((5. - a) / fa + .5, 0., 1.));
  col = mix(col, cKerb, up * clamp((2. - a) / fa + .5, 0., 1.));
  gl_FragColor = vec4(col, 1.);
}
`;function Je(s,p={}){const m=p.palette&&p.palette.length>=13?p.palette:Ue,l=(s.rng.fork?s.rng.fork("hour"):s.rng)(),h=Se[p.hour]?p.hour:l<.5?"gold":l<.8?"rose":"grey",E={};De.forEach((o,n)=>{E[o]=new e.Color(m[n])});for(const o in Se[h])E[o]=new e.Color(Se[h][o]);const A=(o,n,v)=>o.clone().lerp(n,v),[x,z]=Y(N[0],N[1]),L=new Uint8Array(361*4),M=(o,n)=>((n-1)*19+(o-1))*4;for(const[o,n]of le)L[M(o,n)]=255;L[M(N[0],N[1])]=128;const C=new e.DataTexture(L,19,19,e.RGBAFormat,e.UnsignedByteType);C.magFilter=C.minFilter=e.NearestFilter,C.generateMipmaps=!1,C.needsUpdate=!0;const T={uSun:{value:ze.clone()},uShDir:{value:$.clone()},uTime:{value:0},uMir:{value:1},uStone:{value:new e.Vector4(x,0,z,0)},uFall:{value:0},tBoard:{value:C}},O=o=>{const n={...T};for(const v in o)n[v]={value:o[v]};return n},a=E;a.water=A(a.rose,new e.Color("#C98FA0"),.5);const i=new e.Color(.5,.42,.5),c=(o={})=>new e.ShaderMaterial({uniforms:O({cLit:o.lit||a.shell,cHalf:o.half||A(o.lit||a.shell,o.shade||a.shellShade,.5),cShade:o.shade||a.shellShade}),vertexShader:pe,fragmentShader:Ke,vertexColors:!!o.vertexColors,side:o.side??e.FrontSide}),B=new e.ShaderMaterial({uniforms:O({cSlate:a.slate,cSlateHalf:A(a.slate,a.slateLit,.36),cSlateLit:a.slateLit,cSheen:a.sheen,cShell:a.shell,cShellHalf:A(a.shell,a.shellShade,.53),cShellShade:a.shellShade,cWhite:new e.Color("#FFFFFF"),cViolet:a.violet,cGround:a.ground,cKerb:a.kerb}),vertexShader:He,fragmentShader:je}),I=new e.ShaderMaterial({uniforms:O({cWater:a.water,cBar:A(a.shell,new e.Color("#FFFFFF"),.3),cFoam:A(a.shell,new e.Color("#FFFFFF"),.5),cShadow:A(a.plum,a.channel,.6),cDark:A(a.water,a.channel,.6),uOpacity:.28,uLand:new e.Vector2(x,z)}),vertexShader:pe,fragmentShader:Xe,transparent:!0,depthWrite:!1,blending:e.CustomBlending,blendEquation:e.AddEquation,blendSrc:e.OneFactor,blendDst:e.OneMinusSrcAlphaFactor}),P=new e.ShaderMaterial({uniforms:O({cChan:a.channel,cChan2:A(a.channel,a.plum,.3),cKerb:a.kerb,cShell:a.shell,cShadeMul:i,uLand:new e.Vector2(x,z)}),vertexShader:pe,fragmentShader:Ye,transparent:!0,depthWrite:!1}),V=new e.ShaderMaterial({vertexShader:"void main(){ vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }",fragmentShader:"void main(){ gl_FragColor = vec4(0.); gl_FragDepth = 1.; }",colorWrite:!1,depthFunc:e.AlwaysDepth,side:e.DoubleSide}),G=(o,n=-6)=>{const v=o.material,g=v.clone();g.uniforms={...v.uniforms,uMir:{value:-1}},g.side=v.side===e.FrontSide?e.BackSide:v.side===e.BackSide?e.FrontSide:e.DoubleSide;const d=o.isInstancedMesh?new e.InstancedMesh(o.geometry,g,o.count):new e.Mesh(o.geometry,g);return o.isInstancedMesh&&(d.instanceMatrix=o.instanceMatrix),d.position.copy(o.position),d.quaternion.copy(o.quaternion),d.scale.copy(o.scale),d.frustumCulled=!1,d.renderOrder=n,d.name=(o.name||"body")+"-image",d},_=(o=9*S+150)=>{const n=new e.PlaneGeometry(o*2,o*2,1,1);n.rotateX(-Math.PI/2);const v=new e.Group;v.name="pan";const g=new e.Mesh(n,V);g.renderOrder=-8,g.name="window";const d=new e.Mesh(n,I);d.renderOrder=1,d.name="water";const w=new e.Mesh(n,P);w.position.y=.6,w.renderOrder=2,w.name="lines";for(const b of[g,d,w])b.frustumCulled=!1,v.add(b);return v},ee=(o=11,n=2.6)=>{const v=o*be,g=$.y,d=-$.x,w=new e.BufferGeometry,b=[-g*n/2,.06,-d*n/2,g*n/2,.06,d*n/2,$.x*v+g*n*.15,.06,$.y*v+d*n*.15,$.x*v-g*n*.15,.06,$.y*v-d*n*.15];return w.setAttribute("position",new e.Float32BufferAttribute(b,3)),w.setAttribute("normal",new e.Float32BufferAttribute([0,1,0,0,1,0,0,1,0,0,1,0],3)),w.setIndex([0,2,1,0,3,2]),w},te=(o=6e4)=>{const n=b=>({uSun:T.uSun,cApricot:{value:a.apricot},cRose:{value:a.rose},cViolet:{value:a.violet},cKerb:{value:a.kerb},cWater:{value:a.ring},cDust:{value:a.dust},cMist:{value:A(a.apricot,a.shell,.55)},uMir:{value:b},uTime:T.uTime}),v=b=>new e.ShaderMaterial({uniforms:n(b),fragmentShader:Ze,side:e.BackSide,depthWrite:b>0,vertexShader:`varying vec3 vP; void main(){ vP = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = vec4(p.xy, p.w * ${b<0?".999996":".99999"}, p.w); }`}),g=new e.Group;g.name="sky";const d=new e.Mesh(new e.SphereGeometry(o,48,24),v(1));d.renderOrder=-10,d.name="sky-dome";const w=new e.Mesh(new e.SphereGeometry(o,48,12,0,Math.PI*2,Math.PI/2,Math.PI/2),v(-1));w.renderOrder=-7,w.name="sky-image";for(const b of[d,w])b.frustumCulled=!1,g.add(b);return g};return{hour:h,palette:E,sun:ze.clone(),shadowDir:$.clone(),SHADOW:be,SP:S,TABLE:le,LANDING:N,at:Y,height:j,tau:me,speed:Be,shadeMul:i,uniforms:T,glsl:Q,vert:pe,proj:J,board:C,ink:c,lensGeometry:we,lensMaterial:B,waterMaterial:I,linesMaterial:P,makeWater:_,streakGeometry:ee,makeSky:te,mirror:G,update(o,n){T.uTime.value=n,T.uFall.value=(j(n-.8)-j(n))/.8,T.uStone.value.set(x,j(n),z,me(n))},dispose(){C.dispose()}}}const Qe=`
attribute vec4 aCr; attribute vec4 aCr2;
uniform vec4 uStone; uniform float uTime, uMir; uniform vec2 uLand;
varying vec3 vS;
void main(){
  float v = aCr.y, s = aCr.z, sd = aCr.w, t = uStone.w - aCr2.y;
  float k = clamp(t / max(aCr2.z, .1), 0., 1.), on = step(0., t) * step(t, aCr2.z);
  float q = 1. - clamp(k / .35, 0., 1.), rise = 1. - q * q, sink = 1. - smoothstep(.45 + .25 * fract(sd * 3.), 1., k);
  float curl = step(.62, fract(sd * 5.)), H = aCr2.x * rise * sink;
  float rc = min(3.4, .12 * H) * curl, vs = min(v, .7) / .7, phi = 2.5 * max(v - .7, 0.) / .3;
  float y = mix(v * H, vs * (H - 2.5 * rc) + rc * sin(phi), curl);
  float wide = 1.7 * s * aCr2.w * pow(max(1. - v, 1e-4), .6), tw = sd * 6.2832 + 2.5 * v;
  float a = aCr.x + wide * cos(tw) / 66.;
  vec3 rad = vec3(cos(a), 0., sin(a));
  float ro = 64.6 + (1.2 + mix(8., 2.4, curl) * v * v) * rise + rc * (1. - cos(phi)) + .5 * sin(v * 7. - uTime * 3. + sd * 20.) * v
    + wide * sin(tw) * (1. - .5 * v);
  vec3 p = vec3(uLand.x, 0., uLand.y) + on * (rad * ro + vec3(0., y, 0.));
  vec4 w = modelMatrix * vec4(p, 1.);
  vS = vec3(s, v, sd);
  ${J}
}
`,et=`
uniform vec3 cPale, cUnder; uniform float uTime;
varying vec3 vS;
void main(){
  float s = vS.x, v = vS.y, sd = vS.z, fs = max(fwidth(s), 1e-3), fv = max(fwidth(v), 1e-4);
  float mid = clamp((.26 - abs(s)) / fs + .5, 0., 1.);
  float top = .55 + .3 * fract(sd * 7.);
  float side = clamp((.13 - abs(abs(s) - .68)) / fs + .5, 0., 1.) * clamp((top - v) / fv + .5, 0., 1.);
  float run = fract(v * 3. - uTime * .8 + sd * 5.), dash = .55 + .45 * smoothstep(0., .1, run) * (1. - smoothstep(.6, .8, run));
  float wash = .36 * (1. - .6 * v), line = max(.84 * mid * dash, .6 * side);
  float cover = max(wash, line);
  if (cover < .004) discard;                                     // after every derivative above
  gl_FragColor = vec4(.84 * mid * dash > max(wash, .6 * side) ? cPale : cUnder, cover);
}
`,tt=`
attribute vec4 aVeil; attribute float aLines;
uniform vec4 uStone; uniform float uTime, uMir; uniform vec2 uLand;
varying vec3 vV; varying vec2 vId;
void main(){
  float a = aVeil.x + position.x * aVeil.z, r = aVeil.y;
  float yU = uStone.y + ${y.toFixed(1)} - sqrt(max(${(y*y).toFixed(2)} - r * r, 0.));
  vV = vec3((position.x + 1.) * aVeil.z * r, (1. - position.y) * yU, yU);   // metres along the veil, metres under the underside, the underside's height
  vId = vec2(aVeil.w, aLines);
  float env = smoothstep(6.3, 7.2, uStone.w) * (1. - smoothstep(11.8, 13.6, uStone.w));
  vec4 w = modelMatrix * vec4(uLand.x + cos(a) * r, position.y * yU * step(.001, env), uLand.y + sin(a) * r, 1.);
  ${J}
}
`,at=`
uniform vec4 uStone; uniform float uTime; uniform vec3 cPale, cUnder;
varying vec3 vV; varying vec2 vId;
float vh(float x){ return fract(sin(x * 127.1 + 3.7) * 43758.5453); }
void main(){
  float s = vV.x, d = vV.y, yU = vV.z, fs = max(fwidth(s), 1e-3), fd = max(fwidth(d), 1e-3);
  float env = smoothstep(6.3, 7.2, uStone.w) * (1. - smoothstep(11.8, 13.6, uStone.w));
  float i0 = floor(s / 1.5), core = 0., sheet = 0., tone = 0., drop = 0., seed = floor(vId.x + .5) * .091, lines = floor(vId.y + .5);
  for (int j = -1; j <= 1; j++) {
    float i = i0 + float(j);
    if (i < 0. || i > lines - .5) continue;
    float sd = vh(i * 1.37 + seed);
    float len = min(yU, (30. + 50. * vh(sd * 7.3 + 1.)) * (.82 + .18 * sin(uTime * (1.1 + sd) + sd * 40.)));
    float t = clamp(d / max(len, .1), 0., 1.), off = abs(s - (i + .5) * 1.5), in1 = clamp((len - d) / fd + .5, 0., 1.);
    float hw = (.25 + .75 * vh(sd * 3.1 + 2.)) * pow(max(1. - t, 0.), .6);
    float run = fract((d - uTime * (16. + 10. * sd)) / (18. + 14. * sd) + sd * 5.);
    float c = clamp((hw - off) / fs + .5, 0., 1.) * in1 * (.4 + .6 * smoothstep(0., .08, run) * (1. - smoothstep(.55, .75, run)));
    float g = len + 1. + 1.4 * vh(sd * 5. + 3.);
    float dr = clamp((.17 - off) / fs + .5, 0., 1.) * max(clamp((.55 - abs(d - g)) / fd + .5, 0., 1.), clamp((.4 - abs(d - g - 2.4)) / fd + .5, 0., 1.)) * clamp(1.4 / fd, 0., 1.);
    if (c > core) { core = c; tone = step(.4, vh(sd * 9. + 4.)); }
    sheet = max(sheet, clamp((.95 - off) / fs + .5, 0., 1.) * (1. - smoothstep(.55, .8, t)));
    drop = max(drop, dr);
  }
  float wash = smoothstep(.2, .7, fs / 1.5), a = max(max(.78 * core, .24 * sheet), .9 * drop);
  float cover = mix(a, .3, wash) * env;
  if (cover < .004) discard;                                     // after every derivative above
  vec3 col = .78 * core > .24 * sheet ? mix(cPale, cUnder, tone) : cUnder;
  gl_FragColor = vec4(mix(.9 * drop > max(.78 * core, .24 * sheet) ? cPale : col, mix(cPale, cUnder, .6), wash), cover);
}
`,ot=`
attribute vec4 aRib; attribute vec3 aRib2;
uniform vec4 uStone; uniform float uTime, uFall, uMir;
varying vec3 vW; varying vec3 vN; varying vec3 vR;
void main(){
  float v = aRib.y, sd = aRib.w, sp = clamp(uFall, 0., 40.), s2 = fract(sd * 7.3);
  vec3 rad = vec3(cos(aRib.x), 0., sin(aRib.x)), tn = vec3(-rad.z, 0., rad.x);
  vec3 across = aRib2.y < .5 ? tn : rad;
  float len = sp * (2.3 + 1.7 * s2);
  float wob = sin(v * 5. - uTime * 2.2 + sd * 30.) * v * (1.2 + 1.6 * s2) * clamp(sp / 5., 0., 1.);
  float wide = (1.1 + .6 * sd) * (1. - .72 * v) * clamp(sp / 5., 0., 1.);
  vec3 lean = rad * .13 + vec3(.2, 0., .11);
  vec3 p = vec3(uStone.x, uStone.y + aRib2.z, uStone.z) + rad * aRib2.x + across * (aRib.z * wide) + tn * wob
    + vec3(0., v * len, 0.) + lean * (v * v * len);
  vec4 w = modelMatrix * vec4(p, 1.);
  vW = w.xyz; vN = aRib2.y < .5 ? -rad : tn; vR = vec3(v, aRib.z, sd);
  ${J}
}
`,nt=`
${Q}
uniform vec3 cLit, cHalf, cShade; uniform float uMir;
varying vec3 vW; varying vec3 vN; varying vec3 vR;
void main(){
  float v = vR.x;
  if (fract(v * 4.5 + vR.z * 9. - uTime * 1.3) < .55 * v * v) discard;      // torn into dashes toward the tip
  vec3 n3 = vN / max(length(vN), 1e-4);
  if (gl_FrontFacing == (uMir < 0.)) n3 = -n3;
  gl_FragColor = vec4(inkStep(n3, cLit, cHalf, cShade, 0.), 1.);
}
`;async function rt(s,p={}){const m=p.style||Je(s,p),l=s.rng,h=m.palette,E=m.uniforms,A=Math.min(1,Math.max(.6,p.detail??s.quality?.detail??1)),x=new e.Group;x.name="stone-on-the-fifth-line";const[z,L]=Y(N[0],N[1]),M=()=>s.yield?s.yield():Promise.resolve();p.ground!==!1&&x.add(m.makeWater()),p.sky&&x.add(m.makeSky()),await M();const C=(t,r)=>Pe.some(f=>f[0]===t&&f[1]===r),T=we(112);await M();const O=we(48);await M();const a=we(72);await M();const i=new e.Matrix4,c=[],B=[],I=(t,r,f)=>{t.setAttribute("aInk",new e.InstancedBufferAttribute(new Float32Array(r.map(u=>u[2])),1));const F=new e.InstancedMesh(t,m.lensMaterial,r.length);r.forEach((u,D)=>{const[R,q]=Y(u[0],u[1]);F.setMatrixAt(D,i.makeTranslation(R,u[3]||0,q))}),F.instanceMatrix.needsUpdate=!0,F.frustumCulled=!1,F.name="stones",x.add(F);const k=m.mirror(F);return f&&(f.setAttribute("aInk",t.attributes.aInk),k.geometry=f),x.add(k),B.push(F,k),F},P=le.filter(t=>C(t[0],t[1])),V=I(T,[[N[0],N[1],2],...P],a),G=I(O,le.filter(t=>!C(t[0],t[1])));for(const t of le){const[r,f]=Y(t[0],t[1]);c.push({foot:new e.Vector3(r,0,f),ink:t[2]?"shell":"slate",col:t[0],row:t[1]})}await M();const _=Math.PI*2,ee=(t,r,f)=>t.clone().lerp(r,f),te=t=>{const r={...E};for(const f in t)r[f]={value:t[f]};return r},o=new e.Vector2(z,L),n=[],v=[],g=[],d=16,w=2,b=(t,r)=>{const f=Math.sin(t*12.9898+r*78.233)*43758.5453;return f-Math.floor(f)},Me=(t,r,f,F)=>{const k=l();for(let u=0;u<3;u++){const D=n.length/4,R=(k+u*.37+b(k,u)*.2)%1,q=t+(u-1+(b(k,u+7)-.5)*.5)*3.9/64.6,qe=1.25+.75*b(k,u+3),Ge=r*(u===1?1:.55+.4*b(k,u+11)),Ne=f+.25*b(k,u+5),$e=F-.25;for(let U=0;U<=d;U++)for(let H=0;H<=w;H++)n.push(q,U/d,H/w*2-1,R),v.push(Ge,Ne,$e,qe);for(let U=0;U<d;U++)for(let H=0;H<w;H++){const X=D+U*(w+1)+H;g.push(X,X+1,X+w+1,X+1,X+w+2,X+w+1)}}};for(let t=0;t<13;t++)Me((t+l()*.6)*_/13,12+l()*10,l()*.3,3.2+l()*1.3,3+l()*2.2);for(let t=0;t<7;t++){const r=1.9+l()*.5;Me((180+(t+l()*.7)*10-90)*W,46+l()*44,r,8.9-r-l()*.6,9+l()*4)}const ae=new e.BufferGeometry;ae.setAttribute("aCr",new e.Float32BufferAttribute(n,4)),ae.setAttribute("aCr2",new e.Float32BufferAttribute(v,4)),ae.setAttribute("position",new e.Float32BufferAttribute(new Float32Array(n.length/4*3),3)),ae.setIndex(g);const oe=new e.Mesh(ae,new e.ShaderMaterial({uniforms:te({cPale:h.shell,cUnder:ee(h.shell,h.shellShade,.5),uLand:o}),vertexShader:Qe,fragmentShader:et,side:e.DoubleSide,transparent:!0,depthWrite:!1}));oe.frustumCulled=!1,oe.renderOrder=4,oe.name="crown",x.add(oe),x.add(m.mirror(oe)),await M();const Fe=[],xe=[],ge=[3,5,6],ke=14,Ee=Math.round(ke*A);let fe=0;for(let t=0,r=0;t<3;t++){const f=[26,40,52][t],F=l()*_;fe++;for(let k=0;k<ge[t];k++,r++){const u=8+Math.floor(l()*13),D=F+(k+.5*l())*_/ge[t],R=l();fe+=3,r*5%ke<Ee&&(Fe.push(D,f,Math.min(u*.75/f,.42*_/ge[t]),Math.floor(R*1e3)),xe.push(u))}}for(;fe<3040;fe++)l();const de=8,Ae=[],Ce=[];for(let t=0;t<=de;t++)Ae.push(t/de*2-1,1,0,t/de*2-1,0,0);for(let t=0;t<de;t++){const r=t*2;Ce.push(r,r+1,r+2,r+1,r+3,r+2)}const K=new e.InstancedBufferGeometry;K.setAttribute("position",new e.Float32BufferAttribute(Ae,3)),K.setIndex(Ce),K.setAttribute("aVeil",new e.InstancedBufferAttribute(new Float32Array(Fe),4)),K.setAttribute("aLines",new e.InstancedBufferAttribute(new Float32Array(xe),1)),K.instanceCount=xe.length;const ne=new e.Mesh(K,new e.ShaderMaterial({uniforms:te({cPale:h.shell,cUnder:ee(h.shell,h.shellShade,.5),uLand:o}),vertexShader:tt,fragmentShader:at,side:e.DoubleSide,transparent:!0,depthWrite:!1}));ne.frustumCulled=!1,ne.renderOrder=4.1,ne.name="curtains",x.add(ne),x.add(m.mirror(ne,-5.9)),await M();const he=[],Le=[],Te=[],ve=14;for(let t=0;t<9;t++){const r=(t+l()*.7)*_/9,f=l(),F=14+42*Math.sqrt(l()),k=ye-(y-Math.sqrt(y*y-F*F))+12;for(let u=0;u<2;u++){const D=he.length/4;for(let R=0;R<=ve;R++)he.push(r,R/ve,-1,f,r,R/ve,1,f),Le.push(F,u,k,F,u,k);for(let R=0;R<ve;R++){const q=D+R*2;Te.push(q,q+1,q+2,q+1,q+3,q+2)}}}const re=new e.BufferGeometry;re.setAttribute("aRib",new e.Float32BufferAttribute(he,4)),re.setAttribute("aRib2",new e.Float32BufferAttribute(Le,3)),re.setAttribute("position",new e.Float32BufferAttribute(new Float32Array(he.length/4*3),3)),re.setIndex(Te);const ue=new e.Mesh(re,new e.ShaderMaterial({uniforms:te({cLit:h.shell,cHalf:ee(h.shell,h.shellShade,.5),cShade:h.shellShade}),vertexShader:ot,fragmentShader:nt,side:e.DoubleSide}));ue.frustumCulled=!1,ue.name="streamers",x.add(ue),x.add(m.mirror(ue)),await M();const se=(t,r,f)=>new e.Vector3(t,r,f),[Ve,We]=Y(16,9),Oe={landing:se(z,0,L),neighbour:se(Ve,0,We),portalSeat:{position:se(880.6,18,-298.2),facing:se(Math.sin(315*W),0,-Math.cos(315*W))},stones:c},Re=(t,r)=>{m.update(t,r),V.setMatrixAt(0,i.makeTranslation(z,E.uStone.value.y,L)),V.instanceMatrix.needsUpdate=!0};return Re(0,0),{object:x,radius:100,height:110,center:se(z,30,L),anchors:Oe,style:m,update:Re,event:{height:j,tau:me,speed:Be,PERIOD:ce},dispose(){for(const t of B)t.dispose();p.style||m.dispose()},ground:!1,groundY:0}}export{N as LANDING,ce as PERIOD,J as PROJ,S as SP,le as TABLE,Y as at,rt as buildHero,j as height,Je as makeStyle,Be as speed,me as tau};
