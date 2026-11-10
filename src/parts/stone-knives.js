import*as m from"three";const Jo=["#8C8F98","#F6C469","#463C68","#E8C7A0","#2FA45C","#10312A","#F4EEE2"],ft=78,Te=Math.PI/180,_=(y,b,u)=>{const D=Math.min(1,Math.max(0,(u-y)/(b-y)));return D*D*(3-2*D)},U=(y,b,u)=>y+(b-y)*u;class ve{constructor(){this.p=[],this.c=[],this.a=[],this.idx=[],this.n=0}v(b,u,D,q,ot,W,$,zt,Y=0,E=1e3){return this.p.push(b,u,D),this.c.push(q,ot,W),this.a.push($,zt,Y,E),this.n++}quad(b,u,D,q){this.idx.push(b,u,D,b,D,q)}tri(b,u,D){this.idx.push(b,u,D)}get tris(){return this.idx.length/3}build(){const b=new m.BufferGeometry;return b.setAttribute("position",new m.Float32BufferAttribute(this.p,3)),b.setAttribute("color",new m.Float32BufferAttribute(this.c,3)),b.setAttribute("aAux",new m.Float32BufferAttribute(this.a,4)),b.setIndex(this.n>65535?new m.Uint32BufferAttribute(this.idx,1):new m.Uint16BufferAttribute(this.idx,1)),b.computeVertexNormals(),b}}function Ve(y,b,u,D){const q=b.nA,ot=b.rows,W=ot.length,$=new Float32Array(q+1),zt=new Float32Array(q+1),Y=[];let E=0,Tt=u.chance(.5),oe=0;const $t=b.toothStep||2;for(;E<=q;){let B;Tt?(B=u.range(0,b.toothVar),oe=B):B=oe+u.range(.45,1)*b.toothDepth,Y.push({col:E,drop:B,r:Tt?1:0}),E+=u.int(1,$t),Tt=!Tt}Y[Y.length-1].col<q&&Y.push({col:q,drop:oe+b.toothDepth,r:0});const ut=((b.peakAt??u.range(-.45,.45))*.5+.5)*q;let nt=null;for(const B of Y)B.r===1&&(!nt||Math.abs(B.col-ut)<Math.abs(nt.col-ut))&&(nt=B);nt||(nt=Y[Math.min(Y.length-1,1)],nt.r=1);for(let B=0,L=0;B<=q;B++){for(;L<Y.length-2&&Y[L+1].col<=B;)L++;const X=Y[L],O=Y[Math.min(L+1,Y.length-1)],Q=O.col>X.col?Math.min(1,Math.max(0,(B-X.col)/(O.col-X.col))):0,wt=-1+2*B/q;$[B]=U(X.drop,O.drop,Q)+Math.pow(Math.abs(wt),b.endPow||2.4)*b.endDrop,zt[B]=U(X.r,O.r,Q)}const tt=$[nt.col];for(let B=0;B<=q;B++)$[B]=Math.max(0,$[B]-tt)+(B===nt.col?0:.05);const Dt=b.bow||0,ce=b.grow??.2,ye=b.kind||0,kt=u.range(0,6.28),Ht=(B,L,X,O,Q,wt,Z)=>{const w=D?D(B,L,X):[B,L,X];return y.v(w[0],w[1],w[2],O,O,O,Q,ye,wt,Z)};for(const B of[1,-1]){const L=y.n;for(let O=0;O<W;O++){const Q=ot[O];for(let wt=0;wt<=q;wt++){const Z=-1+2*wt/q,w=b.y1-$[wt],g=w+(b.y0-w)*Q,T=Math.sqrt(Math.max(0,1-Z*Z)),P=Z*b.len*.5*(1+ce*Q);let I=(b.tTop+(b.tBase-b.tTop)*Math.pow(Q,b.tPow||.7))*T;const R=_(0,.1,Q)*(1-.45*Q)*(b.flute??.5);I*=1-(1-zt[wt])*R,I*=1+.12*Math.sin(Q*9+Z*5+kt+B);const z=B*.5*I+Dt*(1-Z*Z)+(b.lean||0)*(1-Q),A=(.66+.34*zt[wt])*(1-.1*Q);Ht(P,g,z,O===0?1:A,P,O===0&&b.top||0,b.cut?w-g:1e3)}}const X=q+1;for(let O=0;O<W-1;O++)for(let Q=0;Q<q;Q++){const wt=L+O*X+Q,Z=wt+1,w=Z+X,g=wt+X;B>0?y.quad(wt,g,w,Z):y.quad(wt,Z,w,g)}}const se=-1+2*nt.col/q,it=[se*b.len*.5,b.y1,Dt*(1-se*se)+(b.lean||0)],Et=B=>{const L=Math.min(q,Math.max(0,(B/(b.len*.5)*.5+.5)*q)),X=Math.min(q-1,Math.floor(L));return b.y1-U($[X],$[X+1],L-X)};return{peak:D?D(it[0],it[1],it[2]):it,crestY:Et}}function Po(y,b,u,D,q=0){const ot=Math.cos(D),W=Math.sin(D);return($,zt,Y)=>{const E=Y+zt*q;return[y+$*ot+E*W,b+zt,u-$*W+E*ot]}}const ts=`
attribute vec3 color;
attribute vec4 aAux;
#ifdef USE_INSTANCING
attribute float aSeed;
#endif
uniform float uTime;
varying vec3 vPos;
varying vec3 vNrm;
varying vec3 vCol;
varying vec4 vAux;
varying float vCut;
varying float vWall;
#include <fog_pars_vertex>
float vhash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main(){
  vec3 p = position; vec3 n = normal; float seed = 0.0; float fl = aAux.x; float inst = 0.0; float wallF = aAux.z;
  #ifdef USE_INSTANCING
    seed = aSeed; inst = 1.0; wallF = 0.0;
    p.y -= aAux.z * vhash(vec2(floor(position.x * 2.0 + 40.0), seed * 91.7));
    mat3 m = mat3(instanceMatrix);
    vec3 sc = vec3(dot(m[0], m[0]), dot(m[1], m[1]), dot(m[2], m[2]));
    fl *= sqrt(sc.x);
    p = (instanceMatrix * vec4(p, 1.0)).xyz;
    n = m * (n / max(sc, vec3(1e-6)));
  #endif
  float kind = aAux.y;
  if (kind > 1.5 && kind < 2.5) {            // petals tremble
    p += aAux.x * 0.05 * vec3(sin(uTime * 7.3 + p.x * 3.0 + seed * 40.0), sin(uTime * 9.1 + p.z * 2.0), cos(uTime * 6.2 + p.y * 3.0 + seed * 17.0));
  } else if (kind > 3.5) {                   // hanging roots sway
    float w = aAux.x * aAux.x;
    p.x += w * 0.9 * sin(uTime * 0.7 + p.y * 0.07 + p.z * 0.3);
    p.z += w * 0.7 * sin(uTime * 0.9 + p.y * 0.05 + p.x * 0.3 + 1.7);
  } else if (kind > 0.5 && kind < 1.5) {     // pachypodium branches nod in gusts
    p.x += aAux.x * 0.04 * sin(uTime * 2.3 + p.z * 0.4 + seed * 30.0);
  }
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vPos = wp.xyz; vNrm = mat3(modelMatrix) * n; vCol = color; vAux = vec4(fl, kind, floor(seed * 1024.0 + 0.5) / 1024.0, inst); vCut = aAux.w; vWall = wallF;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,es=`
uniform vec3 uSun, uSunCol, uSky, uDeep, uGreen, uStone, uHazeCol, uCream, uCam, uDeepFill, uPortalCol;
uniform float uTime, uTop, uHaze, uPocket, uWet, uBandLo, uPocketAir, uFogTop, uTerm;
uniform vec4 uShadow[8];
uniform vec4 uMist;          // bottom y, top y, density, ramp width
uniform vec3 uMistCol;
uniform vec4 uMistSlot;      // the mist down in the fissure, which no sun reaches: its colour, and its density (per metre)
uniform vec4 uSlotSeg;       // the fissure's axis in plan: (x, z) of its head and of its foot
float mistR(float y, float s, float w){ float t = clamp((y - s) / w, 0.0, 1.0); return w * 0.5 * t * t + max(y - s - w, 0.0); }
float mistF(float y, float top){ return mistR(y, uMist.x, uMist.w) - mistR(y, top - uMist.w, uMist.w); }
float mistAmt(vec3 cam, vec3 pos, float dist, float top, float k){      // top: where the layer ends above this point (it billows); k: its density
  float dy = pos.y - cam.y;
  float dens = clamp(min((cam.y - uMist.x) / uMist.w, (top - cam.y) / uMist.w), 0.0, 1.0);
  float mean = abs(dy) < 0.05 ? dens : (mistF(pos.y, top) - mistF(cam.y, top)) / dy;
  return 1.0 - exp(-k * dist * max(mean, 0.0));
}
varying vec3 vPos;
varying vec3 vNrm;
varying vec3 vCol;
varying vec4 vAux;
varying float vCut;
varying float vWall;
#include <fog_pars_fragment>
float hash2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec2 hash22(vec2 p){ return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash2(i), hash2(i + vec2(1.0, 0.0)), f.x), mix(hash2(i + vec2(0.0, 1.0)), hash2(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){ return 0.55 * vnoise(p) + 0.3 * vnoise(p * 2.13 + 7.1) + 0.15 * vnoise(p * 4.7 + 3.3); }
// the same, each octave fading to its mean once its cells are smaller than a few pixels (w: noise units under one pixel)
float fbmF(vec2 p, float w){
  return 0.55 * mix(0.5, vnoise(p), 1.0 - smoothstep(0.2, 0.6, w)) + 0.3 * mix(0.5, vnoise(p * 2.13 + 7.1), 1.0 - smoothstep(0.2, 0.6, w * 2.13)) + 0.15 * mix(0.5, vnoise(p * 4.7 + 3.3), 1.0 - smoothstep(0.2, 0.6, w * 4.7));
}
// gradient noise: unlike the value noise above, its slopes show no lattice (the lit and shaded sides of the mist's billows are taken from slopes)
float gnoise(vec2 p){
  vec2 i = floor(p), f = fract(p), u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec2 ga = hash22(i) * 2.0 - 1.0, gb = hash22(i + vec2(1.0, 0.0)) * 2.0 - 1.0, gc = hash22(i + vec2(0.0, 1.0)) * 2.0 - 1.0, gd = hash22(i + vec2(1.0, 1.0)) * 2.0 - 1.0;
  return 0.5 + 0.7 * mix(mix(dot(ga, f), dot(gb, f - vec2(1.0, 0.0)), u.x), mix(dot(gc, f - vec2(0.0, 1.0)), dot(gd, f - vec2(1.0, 1.0)), u.x), u.y);
}
float gfbm(vec2 p){ return 0.55 * gnoise(p) + 0.3 * gnoise(mat2(0.8, 0.6, -0.6, 0.8) * p * 2.13 + 7.1) + 0.15 * gnoise(mat2(0.6, 0.8, -0.8, 0.6) * p * 4.7 + 3.3); }
// solution pits: a round hollow in most cells; x = how far inside one we are, y = height inside it (-1 bottom .. 1 top)
vec2 pits(vec2 p){
  vec2 g = floor(p), f = fract(p), o = hash22(g);
  float h = fract(o.x * 7.3 + o.y * 3.1);
  float r = 0.06 + 0.3 * h * h;                              // mostly small, a few three times the size
  vec2 d = f - (r + 0.04 + (0.92 - 2.0 * r) * o);            // anywhere in the cell a whole hollow fits: no rows
  float m = 1.0 - smoothstep(r * 0.5, r, length(d * vec2(1.0, 0.75 + 0.5 * o.y)));
  return vec2(m * step(0.45, fract(o.y * 5.7 + o.x)), clamp(d.y / r, -1.0, 1.0));
}
void main(){
  // the blade's own number is the same at its three corners but not bit for bit across a face once interpolated: it is snapped back
  // here, or every hash made from it flickers from pixel to pixel (a screen of dots over the stone)
  float kind = vAux.y, seed = floor(vAux.z * 1024.0 + 0.5) / 1024.0;
  if (vCut < 60.0) {                          // far blades: the teeth of the crest are cut per pixel
    float xx = vAux.x * 0.23 + seed * 53.0, x2 = xx * 2.7 + 0.37;
    float p1 = (1.0 - abs(fract(xx) - 0.5) * 2.0) * (0.45 + 0.55 * hash2(vec2(floor(xx), seed * 7.0)));
    float p2 = (1.0 - abs(fract(x2) - 0.5) * 2.0) * (0.3 + 0.55 * hash2(vec2(floor(x2), seed * 3.0)));
    float D = 4.0 + 6.0 * fract(seed * 13.7);
    if (vCut < D * (1.0 - max(p1, p2))) discard;
  }
  vec3 N = normalize(vNrm + vec3(0.0, 1e-5, 0.0));
  if (!gl_FrontFacing) N = -N;
  vec3 Ng = N;                                              // the face itself, before the flutes turn the normal
  vec3 toCam = uCam - vPos;
  float dist = length(toCam);
  vec3 V = toCam / max(dist, 1e-3);
  float y = vPos.y, X = vAux.x;
  float isRock = 1.0 - step(0.5, kind);
  float pxm = fwidth(X) + fwidth(y);                           // metres of stone under one pixel: nothing finer than that is drawn (no screen of dots, no moire)
  float fluteFade = isRock * (1.0 - smoothstep(30.0, 150.0, dist));
  float nearFade = isRock * (1.0 - smoothstep(18.0, 70.0, dist));
  float closeFade = isRock * (1.0 - smoothstep(6.0, 22.0, dist));
  float slot = 1.0 - smoothstep(58.5, 65.5, uCam.y);          // 1 once the eye is down in the fissure: there the stone is read from 3 m, not from 30
  float nearS = isRock * (1.0 - smoothstep(9.0, 30.0, dist));  // and wherever a face is within a few metres of the eye (the street between the blades): the same close reading
  float slotW = max(slot, smoothstep(0.0, 0.011, uMistSlot.a) * step(0.5, vWall));   // (the walls of the fissure are read that way from the moment the lens tips over the lip)
  float near = max(slotW, nearS);
  float down = smoothstep(0.42, 0.85, abs(V.y));               // looking down (or up) a wall its flutes foreshorten into rays: there the beds carry the wall, not the flutes
  vec3 sunH = normalize(vec3(uSun.x, 0.0, uSun.z) + vec3(1e-4, 0.0, 0.0));
  // the walls of the fissure and the canyon (and the ledges that stand out of them, vWall = 2) are read end-on in the dive and as a backdrop from the
  // floor: on them the runnels run unbroken from top to bottom, the beds show only in broken lengths and nothing closes into a cell
  float wallK = step(0.5, vWall), ledgeK = step(1.5, vWall);
  // ---- bedding: the limestone lies in beds of unequal thickness, 2 to 9 m. Each bedding plane is eaten back into a dark slit, the top edge of the
  // bed below it is a lit lip, and every bed has its own tone, its own flutes and a damp dark foot: the wall is a stack of courses.
  // The beds do not run through: every 6 to 10 m a vertical master joint cuts the wall and the beds step up or down across it.
  float colX = X * 0.12 + seed * 5.0 + 0.35 * vnoise(vec2(y * 0.045 + seed * 2.0, floor(X * 0.12 + seed * 5.0 + 0.5) * 1.7));
  float colF = fract(colX), colD = min(colF, 1.0 - colF);
  float bedF = y * 0.3 + 2.0 * vnoise(vec2(seed * 3.3 + 0.7, y * 0.066)) + 0.4 * vnoise(vec2(X * 0.05 + seed * 3.0, y * 0.03)) + 0.1 * vnoise(vec2(X * 0.83 + seed * 7.0, y * 0.21)) + mix(0.9, 0.1, wallK) * hash2(vec2(floor(colX), seed * 3.1 + 1.0));
  float bedId = floor(bedF), bfr = bedF - bedId, bd = min(bfr, 1.0 - bfr), ju = 1.0 - bfr;
  float bh = hash2(vec2(bedId, seed * 3.7 + 2.0)), bh2 = hash2(vec2(bedId * 1.7 + 5.0, seed * 9.1));
  float bw = fwidth(bedF);
  float jw = max(0.016, 1.2 * bw);
  float jointFade = isRock * (1.0 - smoothstep(60.0, 190.0, dist));
  float jOpen = 0.6 + 0.4 * smoothstep(0.3, 0.6, vnoise(vec2(X * 0.27 + seed, bedId * 3.7)));           // the slit gapes and narrows along a blade, it never closes
  jOpen = mix(jOpen, smoothstep(0.42, 0.6, vnoise(vec2(X * 0.19 + 5.0, bedId * 3.7 + 1.0))) * (1.0 - 0.75 * down), wallK);   // on a wall it shows in lengths, and looking down the wall hardly at all
  float jointS = (1.0 - smoothstep(jw * 0.5, jw * 1.5, bd)) * jointFade * jOpen * min(1.0, 0.03 / jw + 0.45);
  float jointT = (1.0 - smoothstep(0.0, 0.045, bd)) * isRock * (1.0 - smoothstep(40.0, 160.0, dist));     // over the tops: a soft line, as the beds read from afar
  float lipW = max(0.035, 2.2 * bw);
  float lip = smoothstep(jw * 0.9, jw * 1.8, ju) * (1.0 - smoothstep(lipW * 0.7, lipW * 1.7, ju)) * jointFade * jOpen * min(1.0, 0.05 / lipW + 0.3);
  float foot = (1.0 - smoothstep(0.0, 0.3, bfr)) * jointFade;                                             // the foot of each bed, set back under nothing, damp: darker
  float bd2 = abs(bfr - (0.3 + 0.4 * hash2(vec2(bedId, seed * 5.3 + 3.0))));                              // one parting inside some of the beds, at its own height, in lengths
  float jointM = 0.3 * (1.0 - smoothstep(jw * 1.0, jw * 3.0, bd2)) * nearFade * step(0.5, bh) * smoothstep(0.45, 0.6, vnoise(vec2(X * 0.3 + seed, bedId * 0.71 + 2.0)));
  float cw = max(0.006, 0.15 * fwidth(X));
  float crack = (1.0 - smoothstep(cw * 0.6, cw * 1.8, colD)) * jointFade * (1.0 - 0.8 * wallK) * smoothstep(0.36, 0.56, vnoise(vec2(floor(colX + 0.5) * 5.3 + seed, y * 0.17)));   // the master joint shows as a crack only in lengths
  float joint = max(max(mix(0.3 * jointT, 0.78 * jointS, max(near, 0.6 * jointFade)), jointM), 0.5 * crack) * (1.0 - 0.6 * down);
  // ---- flutes (rillenkarren): razor crests, narrow dark runnels, flat flanks between them. They run straight down and start
  // afresh in every bed, so no stripe is longer than a bed is thick.
  float fu = X * 2.1 + seed * 37.0 + mix(2.6, 1.2, wallK) * vnoise(vec2(X * 0.33 + seed * 11.0, y * 0.045)) + 1.1 * (bh - 0.5) * (1.0 - wallK);
  float massive = (1.0 - smoothstep(0.13, 0.2, bh2)) * near * (1.0 - wallK * down);                      // a bed in six is massive: smooth pale stone with hardly a flute on it
  float sw = sin(fu), ridge = 1.0 - abs(sw), slope1 = -sign(sw) * cos(fu);
  vec3 T = normalize(cross(vec3(0.0, 1.0, 0.0), N) + vec3(1e-4, 0.0, 0.0));
  float a1 = fluteFade * (1.0 - 0.3 * down * (1.0 - wallK)) * (1.0 - 0.6 * massive);
  N = normalize(N + T * slope1 * 0.85 * a1);
  float bedFl = mix(1.0, 0.35 + 0.9 * bh2, near) * (0.55 + 0.45 * smoothstep(0.0, 0.5, bfr));           // some beds are massive, some cut to ribbons; the flutes are sharpest under the top of a bed
  bedFl = mix(bedFl, 0.7 + 0.3 * bh2, wallK) * (1.0 - massive);
  float fu2 = fu * 3.3 + 6.283 * bh2 * (1.0 - wallK) + 1.3 * vnoise(vec2(X * 1.1 + seed * 5.0, y * mix(0.11, 0.05, wallK)));
  float sw2 = sin(fu2), ridge2 = 1.0 - abs(sw2), slope2 = -sign(sw2) * cos(fu2);
  // (on a wall seen end-on a pixel covers metres of height but only centimetres along the wall: there the flutes fade by their own width on screen, not by the pixel's footprint)
  float a2 = nearFade * bedFl * mix((1.0 - smoothstep(0.05, 0.16, pxm)) * (1.0 - 0.4 * down), 1.0 - smoothstep(0.9, 2.0, fwidth(fu2)), wallK);
  N = normalize(N + T * slope2 * mix(0.45, 0.9, nearS) * a2);
  float fu3 = fu * 8.7 + 6.283 * bh * (1.0 - wallK) + 2.0 * vnoise(vec2(X * 2.3 + 3.0, y * mix(0.31, 0.08, wallK) + seed * 7.0));
  float sw3 = sin(fu3), ridge3 = 1.0 - abs(sw3), slope3 = -sign(sw3) * cos(fu3);
  float a3 = closeFade * bedFl * mix((1.0 - smoothstep(0.018, 0.055, pxm)) * (1.0 - 0.7 * down), 1.0 - smoothstep(0.9, 2.0, fwidth(fu3)), wallK);
  N = normalize(N + T * slope3 * mix(0.3, 0.6, nearS) * a3);
  // the flank of each flute turned to the bright side of the sky is lit, the other dark, and the crest between them is a hard line
  float sK = dot(T, sunH); sK = (sK < 0.0 ? -1.0 : 1.0) * max(abs(sK), 0.55);
  float flank = clamp((slope1 * 0.6 * a1 + slope2 * 0.55 * a2 + slope3 * 0.3 * a3) * sK, -1.0, 1.0);
  float e1 = max(0.045, 1.3 * fwidth(fu)), e2 = max(0.07, 1.3 * fwidth(fu2));
  float crest = max((1.0 - smoothstep(0.0, e1, 1.0 - ridge)) * a1 * min(1.0, 0.09 / e1),
                    (1.0 - smoothstep(0.0, e2, 1.0 - ridge2)) * a2 * min(1.0, 0.14 / e2) * 0.8);
  // solution hollows, in clusters: honeycombed patches a few metres across, clean stone between them (drawn only while a hollow is wider than a pixel)
  vec2 pt = pits(vec2(X, y) * 1.9 + seed * 17.0);
  float pm = smoothstep(0.5, 0.68, vnoise(vec2(X * 0.31 + seed * 9.0, y * 0.27 + 5.0)));
  // the large hollows of a honeycombed face (tafoni, a hand to a forearm across), in patches; they read from ten metres
  vec2 pt0 = pits(vec2(X * 0.83 + y * 0.19, y * 0.9 - X * 0.11) + seed * 23.0);
  float pm0 = smoothstep(0.5 - 0.12 * down, 0.64 - 0.12 * down, vnoise(vec2(X * 0.16 + seed * 5.0, y * 0.13 + 11.0)));
  float pk = closeFade * (0.35 + 0.65 * near) * (1.0 - smoothstep(0.015, 0.05, pxm)), pk0 = near * nearFade * (1.0 - smoothstep(0.05, 0.16, pxm));
  float pit = max(pt.x * pm * pk, pt0.x * pm0 * pk0);
  float pitLit = max(pt.x * pt.y * pm * pk, pt0.x * pt0.y * pm0 * pk0);      // the upper lip of a hollow is dark, its floor catches light
  float plunge = max(slotW * smoothstep(7.0, 24.0, uCam.y), nearS);        // on the way down the fissure and along the street the walls are read from 3 m; from the canyon floor they are a backdrop again
  float gMin = mix(0.4, 0.34, plunge);
  // some runnels are cut deep: seen from inside the fissure their floors are the darkest thing on the wall, in broken lengths
  float fidR = floor(fu / 3.14159);
  float deepRun = (1.0 - smoothstep(0.04, 0.13 + 0.6 * fwidth(fu), ridge)) * step(0.36, hash2(vec2(fidR, seed * 3.0 + 5.0)))
    * smoothstep(0.3 - 0.16 * wallK, 0.5 - 0.16 * wallK, vnoise(vec2(fidR * 7.3 + seed, y * mix(0.11, 0.035, wallK) + bh * 9.0 * (1.0 - wallK)))) * plunge * fluteFade * (1.0 - 0.6 * down * (1.0 - wallK));
  float grooveAO = mix(1.0, gMin + (1.0 - gMin) * smoothstep(0.0, 0.3, ridge), a1)
    * mix(1.0, 0.5 + 0.5 * smoothstep(0.0, 0.34, ridge2), a2 * (0.6 + 0.4 * nearS))
    * mix(1.0, 0.72 + 0.28 * smoothstep(0.0, 0.4, ridge3), a3)
    * (1.0 + 0.5 * flank * (0.5 + 0.5 * near))
    * (1.0 - mix(0.45, 0.6, nearS) * pit - 0.26 * pitLit) * (1.0 - joint) * (1.0 - 0.22 * foot * (0.4 + 0.6 * near) * (1.0 - 0.5 * down)) * (1.0 + mix(0.6 + 0.5 * down, 0.5 - 0.32 * down, wallK) * lip)
    * mix(0.78 + 0.3 * vnoise(vec2(X * 0.5 + seed * 20.0, y * 0.02)), 1.0, fluteFade);
  // ---- albedo: grey limestone in courses, mottling of the same grain both ways, grey and orange lichen crusts, rust running
  // down from the bedding planes, moss in patches
  float n1 = fbm(vec2(X * 0.21 + seed * 13.0, y * 0.17));
  float n2 = fbmF(vec2(X * 0.5 + seed * 5.0, y * mix(0.11, 0.34, wallK)), pxm * 0.5);
  float m1 = fbmF(vec2(X * 0.8 + seed * 7.0, y * 0.8 + 2.0), pxm * 0.8);
  float m2 = mix(0.5, vnoise(vec2(X * 3.9 + 1.0, y * 3.9 + seed * 3.0)), 1.0 - smoothstep(0.05, 0.16, pxm));
  float m3 = mix(0.5, vnoise(vec2(X * 17.0 + 5.0, y * 17.0)), 1.0 - smoothstep(0.012, 0.04, pxm));
  vec3 alb = uStone * (0.74 + 0.5 * n1);
  alb *= mix(1.0, (0.76 + 0.48 * m1 + 0.25 * down * (m1 - 0.5)) * (0.86 + 0.28 * m2), nearFade) * mix(1.0, 0.88 + 0.24 * m3, closeFade);
  alb *= mix(1.0, 0.86 + 0.28 * bh, jointFade * (0.5 + 0.5 * near));                                         // every bed its own grey
  alb *= 1.0 + 0.14 * massive;
  alb *= mix(vec3(1.0), (0.84 + 0.3 * bh) * mix(vec3(1.07, 1.0, 0.9), vec3(0.93, 0.98, 1.1), bh2), wallK * jointFade);   // on the walls the strata differ more, some warmer, some bluer
  alb *= mix(1.0, 0.72, smoothstep(0.5, 0.85, n2) * isRock);
  float lichN = fbmF(vec2(X * 0.55 + seed * 3.0, y * 0.5 + 9.0), pxm * 0.55) + (0.1 * (m2 - 0.5) + 0.05 * (m3 - 0.5)) * nearFade;
  float lich = smoothstep(0.65 - 0.02 * nearS, 0.74 - 0.06 * nearS, lichN) * smoothstep(uTop - 30.0, uTop - 6.0, y) * isRock;
  float lichO = step(0.42, fract(seed * 7.31 + n1 + 0.35 * floor(lichN * 9.0)));                          // orange crusts and grey ones, side by side
  alb = mix(alb, mix(vec3(0.58, 0.3, 0.09), vec3(0.42, 0.44, 0.40), lichO) * (0.8 + 0.4 * m2), lich * mix(0.6, 0.72, nearS));
  float lgN = fbmF(vec2(X * 0.9 + seed * 4.0, y * 0.9 + 3.0), pxm * 0.9) + 0.08 * (m2 - 0.5);
  float lichG = smoothstep(0.585, 0.635, lgN) * smoothstep(0.4, 0.6, vnoise(vec2(X * 0.13 + 9.0, y * 0.11 + seed * 6.0))) * jointFade * (1.0 - smoothstep(0.12, 0.3, pxm));
  alb = mix(alb, uStone * vec3(1.5, 1.56, 1.42) * (0.85 + 0.3 * m2), lichG * 0.55);                        // pale grey lichen crusts, a hand to an arm across
  float rustN = vnoise(vec2(X * 1.05 + seed * 3.0 + 0.25 * vnoise(vec2(y * 0.9, seed)), bedId * 5.1 + 0.6));
  float rust = smoothstep(0.6, 0.8, rustN) * bfr * bfr * (1.0 - 0.5 * lip) * jointFade;                    // iron bleeding out of a bedding plane and running a metre or two down the bed below
  alb = mix(alb, vec3(0.4, 0.2, 0.085) * (0.75 + 0.5 * m1), rust * 0.6);
  float mossH = 1.0 - smoothstep(8.0, 58.0, y);
  float mossN = fbmF(vec2(X * 0.17 + seed * 3.0, y * 0.17 + 4.0), pxm * 0.17) + 0.3 * (m1 - 0.5) + 0.16 * (m2 - 0.5) + 0.12 * mossH + 0.07 * (1.0 - smoothstep(0.0, 0.12, bfr)) * near;
  mossN += wallK * (0.45 * smoothstep(0.3, 0.8, Ng.y) + 0.1 * (1.0 - smoothstep(1.0, 8.0, y)));          // on a wall it lies on whatever is turned up to the sky (the ledges) and climbs from the damp foot
  float moss = smoothstep(mix(0.55, 0.59, wallK), mix(0.71, 0.67, wallK), mossN + 0.07 * (m3 - 0.5)) * step(0.001, mossH) * isRock;          // soft-edged cushions, thickest in the hollows
  alb = mix(alb, mix(vec3(0.045, 0.105, 0.04), vec3(0.13, 0.215, 0.06), m2) * (0.7 + 0.6 * m3), moss * 0.88);
  alb *= mix(vCol, vec3(0.45 + 0.55 * vCol.r), wallK * (1.0 - ledgeK));                                    // (the walls' ribs are in their shape: their baked shade is halved, or it reads as streaks)
  alb *= 1.0 - 0.3 * wallK * (1.0 - smoothstep(1.0, 8.0, y + 4.0 * (m1 - 0.5)));                           // the foot of a wall is damp and dark
  if (kind > 0.5 && kind < 1.5) {             // pachypodium: silver bark studded with rows of tubercles and their spines (vCol = shade, around, along)
    vec2 q = vec2(vCol.g * 9.0, vCol.b * 6.5); q.x += 0.5 * floor(q.y);
    vec2 c = fract(q) - 0.5; float d = length(c * vec2(1.0, 1.15));
    float knob = 1.0 - smoothstep(0.1, 0.46, d);
    alb = vec3(0.40, 0.385, 0.37) * vCol.r * (0.62 + 0.5 * knob + 0.6 * knob * c.y) * (0.85 + 0.3 * n2);
    alb = mix(alb, vec3(0.05, 0.04, 0.035), (1.0 - smoothstep(0.03, 0.13, d)) * 0.9 * step(0.5, vCol.r));
    N = normalize(N + (T * c.x + vec3(0.0, 1.0, 0.0) * c.y) * knob * 0.9);
  }
  if (kind > 3.5) {                           // fig roots: brown bark in long twisted ridges
    float br = vnoise(vec2((vPos.x + vPos.z * 0.7) * 15.0 + y * 1.1, y * 0.9)), br2 = vnoise(vec2((vPos.x - vPos.z) * 31.0, y * 5.0));
    alb = vCol * vec3(0.25, 0.16, 0.085) * (0.3 + 1.2 * br) * (0.7 + 0.6 * br2);
    N = normalize(N + T * (br - 0.5) * 1.5);
  }
  alb = mix(alb, alb * 0.45, uWet * isRock);
  // ---- the sun rule: gold only in the top band, violet sky light below, green in the depths
  float bandN = vnoise(vPos.xz * 0.035) * 7.0;
  float bandK = bandN + 40.0 * slot * (1.0 - smoothstep(35.0, 110.0, length(vPos.xz)));   // from the floor the keyhole's own walls stay in shade: the ring is the light there
  float band = smoothstep(uBandLo - mix(7.0, 2.5, uTerm) + bandK, uBandLo + mix(4.0, 2.0, uTerm) + bandK, y);
  float cloud = smoothstep(0.30, 0.62, fbm(vPos.xz * 0.0042 + vec2(uTime * 0.045, uTime * 0.02)));
  float gust = smoothstep(0.28, 0.7, fbm(vPos.xz * 0.019 + vec2(uTime * 0.27, uTime * 0.11)));          // smoke haze drifting across the low sun at 15 m/s dapples the gold on the crowns
  float sunVis = band * mix(mix(0.22, 0.6, max(slot, uTerm)), 1.0, cloud) * mix(mix(0.5, 1.0, gust), 1.0, max(slot, uTerm)) * (1.0 - step(2.5, vWall));   // (a ledge on the wall that faces away from the sun is in that wall's shade)
  for (int i = 0; i < 8; i++) {
    vec4 c = uShadow[i];
    vec3 d = vPos - c.xyz;
    float along = -dot(d, uSun);
    float perp = length(d + uSun * along);
    float r = max(c.w, 1e-3);
    sunVis *= 1.0 - 0.8 * step(0.0005, c.w) * step(0.0, along) * (1.0 - smoothstep(r * 0.45, r * 1.5 + max(along, 0.0) * 0.03, perp));
  }
  float ndl = dot(N, uSun);
  float dif = clamp(ndl * 0.9 + 0.1, 0.0, 1.0);
  dif = dif * (0.35 + 0.65 * dif) * 1.12;
  dif = mix(dif, clamp(dot(Ng, uSun) * 0.95 + 0.05, 0.0, 1.0) * (0.75 + 0.25 * dif), 0.7 * slot);   // seen from the canyon floor the gold lies on the sunward wall as one band, not as stripes on every flute
  // dawn: the low sun lies flat on every face turned to it and not at all on the others: one clear terminator down each blade
  dif = mix(dif, smoothstep(-0.02, 0.14, dot(Ng, uSun)) * (0.66 + 0.34 * dif) * 1.05, uTerm);
  float fres = 1.0 - max(dot(N, V), 0.0); fres = fres * fres * fres;
  float depth = 1.0 - smoothstep(4.0, uTop - 18.0, y);
  float slotAO = grooveAO;
  float aoTop = mix(mix(0.66, 0.3, vAux.w), 1.0, smoothstep(uTop - 38.0, uTop + 1.0, y));
  float stoneL = max(dot(uStone, vec3(0.333)), 1e-3);
  float lum = dot(alb, vec3(0.333)) / stoneL;
  vec3 albR = mix(vec3(lum), alb / stoneL, 0.85 * near);
  float form = 0.5 + 0.5 * dot(N, vec3(0.305, 0.79, -0.53));   // the sky strip and the bounce off the lit tops give the shade its form
  vec3 skyFill = uSky * (0.5 + 1.05 * form);
  vec3 deepFill = uDeepFill * (0.5 + 1.0 * form);
  vec3 amb = mix(skyFill * aoTop, deepFill * 0.85, depth * 0.92) * albR;
  vec3 shade = amb * slotAO * 1.35;
  shade += uGreen * uPocket * 0.035 * moss * form;
  vec3 col = shade;
  // the razor crest of every flute catches the sky (and the sun, where the sun reaches): a hard lit edge beside the dark runnel
  float crestK = crest * (1.0 - 0.75 * moss) * (1.0 - joint) * (1.0 - 0.6 * pit);
  col += crestK * (amb * mix(0.75, 1.15, near) + alb * uSunCol * sunVis * smoothstep(-0.35, 0.25, dot(Ng, uSun)) * 0.55);
  col += alb * uSunCol * sunVis * dif * grooveAO;
  col += uSunCol * (0.30 + 0.5 * lum) * fres * sunVis * smoothstep(-0.35, 0.35, ndl) * 0.8;
  float back = max(dot(-V, uSun), 0.0);         // looking toward the sun every edge burns
  col += uSunCol * fres * sunVis * back * back * (0.35 + 0.65 * smoothstep(-0.6, 0.1, ndl)) * 0.9 * isRock;
  col += alb * uSunCol * 0.05 * band;
  // the gold that comes down off the lit top of the sunward wall: a warm wash high on the wall across from it, gone by the time it nears the floor
  col += alb * uSunCol * 0.075 * wallK * slot * smoothstep(uBandLo - 14.0, uBandLo + 16.0, y) * (1.0 - band * smoothstep(-0.02, 0.14, dot(Ng, uSun))) * (0.6 + 0.4 * form);
  col += uWet * uSky * 2.0 * fres * isRock * mix(1.0, 0.3, slot);   // from inside the fissure every flute flank is at a grazing angle: the wet sheen would stripe the whole wall white
  // first rains: thin threads of water slide down some of the runnels, beads of light running along them
  float fid = floor(fu / 3.14159);
  float tw = max(0.07, 1.5 * fwidth(fu));
  float thread = (1.0 - smoothstep(tw * 0.6, tw, abs(fu - (fid + 0.5) * 3.14159))) * step(mix(0.45, 0.8, slot), hash2(vec2(fid, seed * 3.0 + 2.0)));
  thread *= 0.4 + 0.6 * smoothstep(0.2, 0.9, sin(y * 1.7 + uTime * 3.2 + fid * 2.4));
  col += uWet * (uSky * 1.5 + uSunCol * 0.25 * sunVis) * isRock * fluteFade * thread * (0.12 + 0.88 * smoothstep(34.0, 66.0, y)) * mix(1.0, 0.3, slot);
  col = mix(col, vec3(0.0062, 0.005, 0.0175) * (1.0 + 2.0 * band),   // deep violet: after the grade about #17132A, the darkest tone on the wall
    max(deepRun, 0.3 * crack * plunge) * (1.0 - 0.6 * moss));
  vec3 pAlb = alb; float waterK = 0.0;
  if (kind > 1.5 && kind < 2.5) {             // pachypodium petals (vCol = along the petal, across, -): cream, yellow at the throat, the light coming through
    float pr = vCol.r, pa = abs(vCol.g * 2.0 - 1.0);
    vec3 pc = mix(vec3(0.95, 0.72, 0.2), uCream, smoothstep(0.12, 0.42, pr)) * (0.86 + 0.14 * smoothstep(0.0, 0.5, pa)) * (1.0 - 0.18 * smoothstep(0.75, 1.0, pa * pr));
    float lit = 0.3 + 0.5 * max(ndl, 0.0) + 0.45 * max(-ndl, 0.0);
    col = pc * (uSky * (1.5 + 1.1 * (N.y * 0.5 + 0.5)) + uSunCol * sunVis * lit * 0.8 + 0.16);
    pAlb = pc * 0.5;
  } else if (kind > 2.5 && kind < 3.5) {      // slot floor: wet black earth under leaf litter and moss, emerald glints far off, the stream
    float g = fbm(vPos.xz * 0.09);
    float canopy = smoothstep(0.42, 0.7, g);
    float nearG = 1.0 - smoothstep(16.0, 50.0, dist);
    vec2 lp = vPos.xz * 4.6, lo = hash22(floor(lp));
    vec2 ld = fract(lp) - (0.25 + 0.5 * lo); float la = lo.x * 6.283;
    ld = vec2(ld.x * cos(la) - ld.y * sin(la), ld.x * sin(la) + ld.y * cos(la));
    float leafM = (1.0 - smoothstep(0.7, 1.0, length(ld / vec2(0.36, 0.17)))) * step(0.25, lo.y);
    vec2 lp2 = vPos.xz * 9.7 + 13.0, lo2 = hash22(floor(lp2));
    vec2 ld2 = fract(lp2) - (0.25 + 0.5 * lo2);
    float leafM2 = (1.0 - smoothstep(0.6, 1.0, length(ld2 / vec2(0.3, 0.3)))) * step(0.5, lo2.y);
    vec3 leafC = mix(vec3(0.15, 0.085, 0.03), vec3(0.34, 0.24, 0.07), fract(lo.x * 9.7)) * (0.75 + 0.6 * (1.0 - smoothstep(0.0, 0.035, abs(ld.y))));
    float mossG = smoothstep(0.46, 0.6, fbm(vPos.xz * 0.45 + 3.0));
    vec3 earth = (uDeep * 2.4 + vec3(0.03, 0.026, 0.02)) * (0.3 + 0.45 * g) * (0.7 + 0.6 * vnoise(vPos.xz * 3.1));
    vec3 ground = mix(earth, vec3(0.04, 0.115, 0.045) * (0.5 + 1.0 * vnoise(vPos.xz * 7.0)), mossG * 0.85);
    vec3 gl = uDeepFill * 3.0 + uGreen * uPocket * 0.12;
    ground = mix(ground, leafC * gl, max(leafM, leafM2 * 0.7) * nearG * 0.9);
    pAlb = mix(vec3(0.05), leafC, leafM * nearG);
    col = ground + uGreen * uPocket * (0.05 + 0.5 * canopy * fbm(vPos.xz * 0.6 + uTime * 0.03)) * (1.0 - 0.8 * nearG);
    float wob = (vnoise(vec2(vAux.x * 0.35, vPos.z * 0.13 + vPos.x * 0.07)) - 0.5) * 2.2;
    float water = 1.0 - smoothstep(2.2, 3.4, abs(vAux.x + wob) + (1.0 - vCol.r) * 99.0);
    float rip = vnoise(vec2(vAux.x * 1.7, (vPos.z + vPos.x) * 0.5 - uTime * 0.9)) * vnoise(vec2(vAux.x * 4.0 + 3.0, (vPos.z - vPos.x) * 0.9 - uTime * 1.6));
    float strip = (1.0 - smoothstep(0.1, 1.25, abs(vAux.x + wob + (rip - 0.25) * 2.6))) * (0.25 + 0.75 * smoothstep(0.04, 0.3, rip));
    vec3 wcol = mix(uDeep * 1.0 + uGreen * uPocket * 0.06 + vec3(0.0, 0.012, 0.02) + uSky * 0.07, mix(uHazeCol, uSunCol * 0.4, 0.35) * (0.35 + 1.5 * rip), strip);
    col = mix(col, wcol, water);
    pAlb = mix(pAlb, vec3(0.02 + 1.5 * strip * strip), water); waterK = water;       // the portal's light rides the same rocking strip as the sky's, broken into glints
  }
  // ---- the portal's own light on the keyhole, the roots and the banks (the world sets its colour; black by default)
  vec3 toP = vec3(0.0, 4.5, 0.0) - vPos; float dP = length(toP);
  float plR = (1.0 - smoothstep(30.0, 80.0, dP)) / (1.0 + dP * dP * 0.012) * (0.3 + 0.7 * max(dot(N, toP / max(dP, 1e-3)), 0.0));   // stone warms only within a few metres of the ring
  float plW = (1.0 - smoothstep(70.0, 175.0, dP)) / (1.0 + dP * dP * 0.0005);                                                         // the water carries it far up the canyon
  col += pAlb * uPortalCol * mix(plR, plW, waterK);
  // ---- the emerald air of the pocket, when the eye and the stone are both down in it
  float pocketAir = (1.0 - exp(-dist * 0.011)) * (1.0 - smoothstep(12.0, 52.0, y)) * (1.0 - smoothstep(24.0, 62.0, uCam.y)) * uPocket;
  col = mix(col, uGreen * 0.3 + uDeep * 1.2, pocketAir * uPocketAir);
  // ---- dawn: white mist lying in the slots (an analytic layer between uMist.x and uMist.y). Seen from above it is a sea:
  // its top billows, the low sun lights the sunward slope of every billow and the blades lay long shadows across it.
  float toSun = max(dot(-V, sunH), 0.0);
  if (uMist.z > 0.0) {
    vec2 drift = vec2(uTime * 0.016, -uTime * 0.01);
    float farUp = (uMist.w + clamp(uCam.y - uMist.y - 8.0, 0.0, 13.0)) * smoothstep(60.0, 320.0, dist);   // seen from above, far off, only the teeth stand out of it
    float bF = fbm(vPos.xz * 0.047 + drift * 3.0) + 0.5 * vnoise(vPos.xz * 0.16 - drift * 8.0);          // the billows: the waterline wavers round every blade
    float mTop = uMist.y + uMist.w * 0.8 * (fbm(vPos.xz * 0.011 + drift) - 0.5) + 1.5 * (bF - 0.75) + farUp;
    // the stone, the roots and the floor of the fissure and the canyon: no sun reaches the mist that lies between those walls, so it is violet shade (not
    // a lit sea) and thin enough to read the walls through, fading them with depth
    // (so is everything else that stands within the fissure's own footprint; the world turns this on as the lens comes to the lip, uMistSlot.a > 0)
    vec2 sab = uSlotSeg.zw - uSlotSeg.xy;
    float sT = clamp(dot(vPos.xz - uSlotSeg.xy, sab) / max(dot(sab, sab), 1e-3), -0.08, 1.08);
    float sD = length(vPos.xz - uSlotSeg.xy - sab * sT);
    float slotK = max(max(wallK, 1.0 - smoothstep(14.0, 24.0, sD)), max(step(3.5, kind), step(2.5, kind) * (1.0 - step(3.5, kind)))) * smoothstep(0.0, 0.011, uMistSlot.a);
    float mst = mistAmt(uCam, vPos, dist, mTop, mix(uMist.z, uMistSlot.a, slotK));
    float inside = 1.0 - smoothstep(uMist.y - 9.0, uMist.y - 1.0, uCam.y);          // the eye down in the layer: the mist in a slot is in shade, violet, deeper below
    vec3 mCol = uMistCol * (0.6 + 0.4 * smoothstep(uMist.x, uMist.y, y)) * (0.9 + 0.4 * toSun * toSun) * mix(vec3(1.0), vec3(0.62, 0.56, 0.86), inside);
    mCol = mix(mCol, uMistSlot.rgb * (0.82 + 0.3 * smoothstep(uMist.x, uMist.y, y)), slotK);
    float above = smoothstep(1.0, 7.0, uCam.y - uMist.y) * step(y, uCam.y - 0.5) * (1.0 - slotK);
    if (above > 0.0) {
      float tq = clamp((uCam.y - uMist.y - farUp) / max(uCam.y - y, 0.5), 0.0, 1.0);
      vec2 Q = uCam.xz + (vPos.xz - uCam.xz) * tq;                                  // where the eye's ray enters the sea
      float dq = dist * tq, fine = 1.0 - smoothstep(22.0, 70.0, dq);
      vec2 Q2 = Q + sunH.xz * 2.0;
      float b0 = gfbm(Q * 0.047 + drift * 3.0) + 0.5 * gnoise(Q * 0.16 - drift * 8.0) + 0.3 * fine * gnoise(Q * 0.45 + drift * 14.0);
      float b1 = gfbm(Q2 * 0.047 + drift * 3.0) + 0.5 * gnoise(Q2 * 0.16 - drift * 8.0) + 0.3 * fine * gnoise(Q2 * 0.45 + drift * 14.0);
      float seaK = 1.0 - smoothstep(110.0, 380.0, dq);                                // far off the billows merge into the haze
      float lit = clamp(0.5 - (b1 - b0) * 5.0, 0.0, 1.0);                             // the slope of each billow turned to the low sun is lit, the other in shade
      // the long shadows of the blades: bars lying away from the sun, each sharp where it starts and thinning to its tip
      float al = dot(Q, sunH.xz), ac = dot(Q, vec2(-sunH.z, sunH.x));
      float cx = floor(ac / 13.0), fx = ac / 13.0 - cx;
      float ty = -al / 95.0 + hash2(vec2(cx, 3.0));
      float t = fract(ty);
      vec2 hc = hash22(vec2(cx, floor(ty)));
      float wd = (0.16 + 0.2 * hc.y) * (1.0 - 0.7 * t);
      float bar = (1.0 - smoothstep(wd * 0.35, wd, abs(fx - 0.5 - 0.3 * (hc.x - 0.5)))) * (1.0 - smoothstep(0.45, 0.95, t)) * smoothstep(0.0, 0.06, t) * step(0.22, hc.x) * (0.25 + 0.5 * smoothstep(30.0, 110.0, dq));   // (soft, and faint near the eye: the mist is smooth)
      vec3 sea = uMistCol * mix(vec3(0.64, 0.6, 0.88), vec3(1.14, 1.05, 0.96) + uSunCol * 0.035, lit * (1.0 - 0.85 * bar)) * (0.86 + 0.2 * b0);
      mCol = mix(mCol, mix(uMistCol * (0.92 + 0.2 * toSun * toSun), sea, seaK), above);
    }
    // stone that stands in the mist loses its fine lines before it loses its shape: no grid of joints and flutes shows through the veil
    col = mix(col, amb * 1.05, smoothstep(0.08, 0.45, mst) * isRock * (1.0 - slotK));
    col = mix(col, mCol, mst);
  }
  // ---- haze: gold toward the sun, thicker with distance (the world's own fog comes after)
  float hz = 1.0 - exp(-uHaze * dist * mix(1.0, 0.55, smoothstep(40.0, 110.0, y)));
  vec3 hazeCol = mix(uHazeCol * 0.62 + uSky * 0.55, uHazeCol * 1.05 + uSunCol * 0.12, toSun * toSun);
  col = mix(col, hazeCol, hz);
  gl_FragColor = vec4(col, 1.0);
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float fogF = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      float fogF = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    // seen from the pocket its green air lies low: the upper walls and the towers stand clear of it
    fogF *= mix(1.0, uFogTop, smoothstep(9.0, 32.0, y) * (1.0 - smoothstep(24.0, 62.0, uCam.y)));
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogF);
  #endif
}`,mt={hipX:.058,Lt:.25,Ls:.24,shX:.085,shY:.33,La:.165,Lf:.165,neckY:.405,tail:.62};function Ao(){const y=[],b=[],u=[],D=[],q=[];let ot=0;const W=[.74,.715,.63],$=[.8,.785,.715],zt=[.6,.585,.56],Y=[.74,.66,.5],E=[.028,.025,.027],Tt=[.3,.285,.28],oe=[.95,.5,.06],$t=(w,g,T)=>[w[0]+(g[0]-w[0])*T,w[1]+(g[1]-w[1])*T,w[2]+(g[2]-w[2])*T],ut=(w,g,T,P,I,R,z=0,A=-1)=>(y.push(w,g,T),b.push(P[0],P[1],P[2]),u.push(I,R,z,A),ot++),nt=(w,g,T,P,I=null)=>{const R=ot;for(const K of w)for(let It=0;It<g;It++){const bt=It/g*Math.PI*2,gt=Math.cos(bt),et=Math.sin(bt);ut(K.c[0]+K.a[0]*gt+K.b[0]*et,K.c[1]+K.a[1]*gt+K.b[1]*et,K.c[2]+K.a[2]*gt+K.b[2]*et,typeof K.col=="function"?K.col(bt,gt,et):K.col,T,P,K.tl||0)}for(let K=0;K<w.length-1;K++)for(let It=0;It<g;It++){const bt=R+K*g+It,gt=R+K*g+(It+1)%g;D.push(bt,gt,gt+g,bt,gt+g,bt+g)}const z=w[0],A=w[w.length-1],at=typeof z.col=="function"?z.col(0,1,0):z.col,Ft=typeof A.col=="function"?A.col(0,1,0):A.col,Xt=ut(z.c[0],z.c[1],z.c[2],at,T,P,z.tl||0),jt=ut(A.c[0],A.c[1],A.c[2],Ft,T,P,A.tl||0),lt=R+(w.length-1)*g;for(let K=0;K<g;K++)D.push(Xt,R+(K+1)%g,R+K),D.push(jt,lt+K,lt+(K+1)%g);I&&q.push({start:R,nr:w.length,sides:g,bone:T,side:P,fur:I})},tt=(w,g,T,P,I,R,z)=>({c:[w,g,T],a:[P,0,0],b:[0,0,I],col:R,tl:z}),Dt=(w,g,T,P,I,R)=>({c:[w,g,T],a:[P,0,0],b:[0,I,0],col:R}),ce=w=>(g,T,P)=>{const I=_(.25,.85,P),R=_(.2,.34,w)*(1-_(-.1,.5,P));return $t($t($t(W,$,_(.3,-.6,P)),Y,.3*R),zt,I*.8)};nt([[-.085,.03,.035,-.02],[-.045,.088,.09,-.02],[.03,.104,.114,-.01],[.12,.106,.122,.004],[.21,.1,.112,.004],[.29,.092,.092,-.012],[.345,.078,.07,-.02],[.385,.062,.06,-.016],[.42,.052,.052,-.004]].map(([w,g,T,P])=>tt(0,w,P,g,T,ce(w))),12,0,1,{h:.016,len:.042,flow:-1,per:3});const kt=[0,.478,.012],Ht=[.085,.078,.08];nt([[.1,.008,.006,-.034,E],[.093,.024,.018,-.032,Ht],[.078,.032,.027,-.026,Ht],[.066,.05,.05,-.006,E],[.06,.06,.06,-.002,E],[.055,.074,.072,0,$],[.036,.094,.088,.003,$],[.006,.097,.09,.005,$],[-.034,.084,.08,.004,W],[-.064,.05,.048,0,W],[-.08,.012,.012,-.004,W]].map(([w,g,T,P,I])=>Dt(kt[0],kt[1]+P,kt[2]+w,g,T,I)),10,7,1,{h:.016,len:.034,flow:1,per:2,from:5});for(const w of[-1,1]){const g=w*.031,T=kt[1]+.017,P=kt[2]+.066,I=ut(g,T,P+.008,E,7,w),R=ot;for(let A=0;A<6;A++){const at=A/6*Math.PI*2;ut(g+Math.cos(at)*.008,T+Math.sin(at)*.008,P+.007,oe,7,w)}const z=ot;for(let A=0;A<6;A++){const at=A/6*Math.PI*2;ut(g+Math.cos(at)*.021,T+Math.sin(at)*.019,P-.004,oe,7,w)}for(let A=0;A<6;A++){const at=(A+1)%6;D.push(I,R+A,R+at,R+A,z+A,z+at,R+A,z+at,R+at)}nt([Dt(w*.088,kt[1]+.03,kt[2]+.012,.015,.019,E),Dt(w*.108,kt[1]+.044,kt[2]+.008,.008,.011,E)],5,7,w)}const it=(w,g)=>(T,P,I)=>$t(g,zt,.6*_(.2,.9,w*-P)+.25*_(.2,.9,I));for(const w of[-1,1]){const g=w*mt.hipX,T=it(w,$t(W,Y,.22));nt([tt(g,.05,0,.056,.07,T),tt(g*1.1,-.04,0,.074,.094,T),tt(g*1.08,-.13,.002,.064,.078,T),tt(g,-.25,0,.036,.04,it(w,W))],8,1,w,{h:.02,len:.05,flow:1,per:2}),nt([tt(g,-.235,0,.035,.039,it(w,W)),tt(g,-.32,-.008,.031,.036,it(w,W)),tt(g,-.42,-.002,.022,.024,it(w,W)),tt(g,-.492,0,.018,.02,Tt)],8,2,w,{h:.012,len:.035,flow:1,per:2,to:2}),nt([Dt(g,-.49,-.03,.02,.022,E),Dt(g,-.5,.03,.027,.019,E),Dt(g,-.506,.085,.026,.013,E),Dt(g,-.51,.13,.014,.007,E)],6,8,w);const P=w*mt.shX,I=it(w,$t(W,Y,.16));nt([tt(P*.96,.35,0,.036,.042,I),tt(P,.26,0,.031,.035,I),tt(P,.165,0,.025,.027,it(w,W))],8,3,w,{h:.013,len:.04,flow:1,per:1}),nt([tt(P,.175,0,.025,.027,it(w,W)),tt(P,.09,.002,.022,.025,it(w,W)),tt(P,0,0,.016,.017,Tt)],8,4,w,{h:.011,len:.034,flow:1,per:1,to:1}),nt([tt(P,.008,0,.017,.015,E),tt(P,-.035,.002,.02,.012,E),tt(P,-.07,.012,.014,.009,E),tt(P,-.085,.026,.008,.006,E)],6,9,w)}const Et=[];for(let w=0;w<=10;w++){const g=w/10,T=(.024+.014*Math.sin(Math.min(1,g*1.5)*Math.PI*.75)-.016*g*g)*(w===10?.45:1);Et.push(tt(0,0,0,T,T,$t($,W,g),g))}nt(Et,8,5,1,{h:.026,len:.075,flow:1,per:3});const B=[];for(let w=0;w<=4;w++){const g=w/4*Math.PI;B.push(tt(0,.2-Math.cos(g)*.085,-.105,Math.sin(g)*.055+.003,Math.sin(g)*.05+.003,w>2?$:W))}nt(B,6,6,1);const L=new Float32Array(ot*3);for(let w=0;w<D.length;w+=3){const g=D[w]*3,T=D[w+1]*3,P=D[w+2]*3,I=y[T]-y[g],R=y[T+1]-y[g+1],z=y[T+2]-y[g+2],A=y[P]-y[g],at=y[P+1]-y[g+1],Ft=y[P+2]-y[g+2],Xt=R*Ft-z*at,jt=z*A-I*Ft,lt=I*at-R*A;for(const K of[g,T,P])L[K]+=Xt,L[K+1]+=jt,L[K+2]+=lt}for(let w=0;w<ot;w++){let g=L[w*3],T=L[w*3+1],P=L[w*3+2];u[w*4]===5&&(g=y[w*3],T=0,P=y[w*3+2],Math.hypot(g,P)<1e-5&&(g=0,P=0,T=u[w*4+2]>.5?-1:1));const I=Math.hypot(g,T,P)||1;L[w*3]=g/I,L[w*3+1]=T/I,L[w*3+2]=P/I}const X=Array.from(L);let O=12345;const Q=()=>(O=O*16807%2147483647,(O&65535)/65536),wt=(w,g,T,P,I,R,z,A,at,Ft,Xt,jt)=>{const lt=.9+.2*Q(),K=[A[0]*.9*lt,A[1]*.9*lt,A[2]*.9*lt],It=[Math.min(.9,A[0]*1.08*lt),Math.min(.9,A[1]*1.08*lt),Math.min(.9,A[2]*1.08*lt)],bt=ut(w[0]-P[0]*z-g[0]*.004,w[1]-P[1]*z-g[1]*.004,w[2]-P[2]*z-g[2]*.004,K,at,Ft,Xt,0),gt=ut(w[0]+P[0]*z-g[0]*.004,w[1]+P[1]*z-g[1]*.004,w[2]+P[2]*z-g[2]*.004,K,at,Ft,Xt,0),et=ut(w[0]+g[0]*I+T[0]*R,w[1]+g[1]*I+T[1]*R,w[2]+g[2]*I+T[2]*R,It,at,Ft,jt,1);for(let J=0;J<3;J++)X.push(g[0],g[1],g[2]);D.push(bt,gt,et)};for(const w of q){const{start:g,nr:T,sides:P,bone:I,side:R,fur:z}=w,A=z.from||0,at=Math.min(T-1,z.to??T-1);for(let Ft=A;Ft<at;Ft++)for(let Xt=0;Xt<P;Xt++)for(let jt=0;jt<z.per;jt++){const lt=g+Ft*P+Xt,K=g+Ft*P+(Xt+1)%P,It=K+P,bt=lt+P,gt=.15+.7*Q(),et=.1+.8*Q(),J=(Vt,Pt,At)=>(Vt[lt*Pt+At]*(1-gt)+Vt[K*Pt+At]*gt)*(1-et)+(Vt[bt*Pt+At]*(1-gt)+Vt[It*Pt+At]*gt)*et,pt=[J(b,3,0),J(b,3,1),J(b,3,2)];if(pt[0]+pt[1]+pt[2]<.9)continue;const xt=[J(y,3,0),J(y,3,1),J(y,3,2)],ct=[J(X,3,0),J(X,3,1),J(X,3,2)],Ne=Math.hypot(ct[0],ct[1],ct[2])||1;ct[0]/=Ne,ct[1]/=Ne,ct[2]/=Ne;{let Vt=0,Pt=0,At=0;for(let Bt=0;Bt<P;Bt++){const Qt=(g+Ft*P+Bt)*3;Vt+=y[Qt],Pt+=y[Qt+1],At+=y[Qt+2]}ct[0]*(xt[0]-Vt/P)+ct[1]*(xt[1]-Pt/P)+ct[2]*(xt[2]-At/P)<0&&(ct[0]=-ct[0],ct[1]=-ct[1],ct[2]=-ct[2])}const Ct=.7+.6*Q(),fe=.016+.01*Q();if(I===5){const Vt=u[lt*4+2]*(1-et)+u[bt*4+2]*et,Pt=Math.hypot(xt[0],xt[2])||.001,At=xt[0]/Pt,Bt=xt[2]/Pt,Qt=1-.55*Vt,je=ut(xt[0]-Bt*fe,0,xt[2]+At*fe,pt,5,1,Vt,0),Ie=ut(xt[0]+Bt*fe,0,xt[2]-At*fe,pt,5,1,Vt,0),C0=ut(At*(Pt+z.h*Ct*Qt),0,Bt*(Pt+z.h*Ct*Qt),[Math.min(.9,pt[0]*1.08),Math.min(.9,pt[1]*1.08),Math.min(.9,pt[2]*1.08)],5,1,Math.min(1,Vt+z.len*Ct/mt.tail),1);for(let be=0;be<3;be++)X.push(At,0,Bt);D.push(je,Ie,C0);continue}const ue=[y[bt*3]-y[lt*3],y[bt*3+1]-y[lt*3+1],y[bt*3+2]-y[lt*3+2]],Mt=(Math.hypot(ue[0],ue[1],ue[2])||1)*z.flow,Kt=[y[K*3]-y[lt*3],y[K*3+1]-y[lt*3+1],y[K*3+2]-y[lt*3+2]],ht=Math.hypot(Kt[0],Kt[1],Kt[2])||1;let St=1;I===1&&ct[2]<.1&&(St=1.5),I===7&&Ft<=6&&(St=1.35),I===0&&xt[1]<.02&&(St=1.3),wt(xt,ct,[ue[0]/Mt,ue[1]/Mt,ue[2]/Mt],[Kt[0]/ht,Kt[1]/ht,Kt[2]/ht],z.h*Ct*St,z.len*Ct,fe,pt,I,R,0,0)}}for(let w=0;w<18;w++){const g=w/18*Math.PI*2+.2,T=Math.cos(g),P=Math.sin(g),I=P<-.5?.6:1;wt([kt[0]+T*.071,kt[1]+P*.069,kt[2]+.052],[T*.8,P*.8,.6],[T*.8,P*.8,-.6],[-P,T,0],.01,.03*I*(.8+.4*Q()),.021,$,7,1,0,0)}const Z=new m.BufferGeometry;return Z.setAttribute("position",new m.Float32BufferAttribute(y,3)),Z.setAttribute("color",new m.Float32BufferAttribute(b,3)),Z.setAttribute("aBone",new m.Float32BufferAttribute(u,4)),Z.setAttribute("normal",new m.Float32BufferAttribute(X,3)),Z.setIndex(D),Z}const os=`
attribute vec3 color;
attribute vec4 aBone;       // bone, side (-1 | 1), fraction along the tail, -
attribute vec4 aPosYaw;     // hips (hero-local) and yaw
attribute vec4 aP1;         // hip, knee, ankle, knees turned out
attribute vec4 aP2;         // shoulder, elbow, grip, elbows turned out
attribute vec4 aP3;         // lean back, toe-in, head yaw, head pitch
attribute vec4 aP4;         // tail: angle at its root, curl, sideways sweep; left-right difference of the limbs
attribute vec2 aEx;         // size of this animal (times uSize), seed (negative: it carries an infant)
uniform float uTime, uSize;
varying vec3 vPos;
varying vec3 vNrm;
varying vec3 vCol;
varying vec3 vObj;
varying float vTuft;
#include <fog_pars_vertex>
// rX: turn in the sagittal plane, positive = forward (a hanging limb swings toward +Z); rY: yaw; rA: turn about a unit axis
vec3 rX(vec3 v, float a){ float c = cos(a), s = sin(a); return vec3(v.x, v.y * c + v.z * s, -v.y * s + v.z * c); }
vec3 rY(vec3 v, float a){ float c = cos(a), s = sin(a); return vec3(v.x * c + v.z * s, v.y, -v.x * s + v.z * c); }
vec3 rA(vec3 v, vec3 k, float a){ float c = cos(a), s = sin(a); return v * c + cross(k, v) * s + k * dot(k, v) * (1.0 - c); }
void main(){
  float bone = aBone.x, side = aBone.y;
  vec3 p = position, n = normal;
  vObj = position;
  if ((bone > 0.5 && bone < 2.5) || (bone > 7.5 && bone < 8.5)) {            // leg: thigh, shin, foot
    float H = aP1.x - 0.45 * aP4.w * side, K = aP1.y, F = aP1.z;
    vec3 hip = vec3(side * ${mt.hipX}, 0.0, 0.0), knee = hip - vec3(0.0, ${mt.Lt}, 0.0), ank = knee - vec3(0.0, ${mt.Ls}, 0.0);
    if (bone > 7.5) { p = rX(p - ank, F) + ank; n = rX(n, F); }
    if (bone > 1.5) { p = rX(p - knee, K) + knee; n = rX(n, K); }
    p = rX(p - hip, H); n = rX(n, H);
    vec3 ax = normalize(rX(vec3(0.0, -${mt.Lt}, 0.0), H) + rX(vec3(0.0, -${mt.Ls}, 0.0), H + K) + vec3(0.0, -1e-4, 0.0));   // hip to ankle: the knee swings out about it, the foot stays where it is
    p = rA(p, ax, -side * aP1.w); n = rA(n, ax, -side * aP1.w);
    p = rY(p, -side * aP3.y) + hip; n = rY(n, -side * aP3.y);
  } else if ((bone > 2.5 && bone < 4.5) || bone > 8.5) {                      // arm: upper arm, forearm, hand
    float S = aP2.x + aP4.w * side, E = aP2.y, G = aP2.z;
    vec3 sh = vec3(side * ${mt.shX}, ${mt.shY}, 0.0), el = sh - vec3(0.0, ${mt.La}, 0.0), wr = el - vec3(0.0, ${mt.Lf}, 0.0);
    if (bone > 8.5) { p = rX(p - wr, G) + wr; n = rX(n, G); }
    if (bone > 3.5) { p = rX(p - el, E) + el; n = rX(n, E); }
    p = rX(p - sh, S); n = rX(n, S);
    vec3 ax = normalize(rX(vec3(0.0, -${mt.La}, 0.0), S) + rX(vec3(0.0, -${mt.Lf}, 0.0), S + E) + vec3(0.0, -1e-4, 0.0));
    p = rA(p, ax, side * aP2.w); n = rA(n, ax, side * aP2.w);
    p = rY(p, -side * aP3.y * 1.8) + sh; n = rY(n, -side * aP3.y * 1.8);
  } else if (bone > 6.5 && bone < 7.5) {                                      // head
    vec3 nk = vec3(0.0, ${mt.neckY}, 0.0);
    p = rY(rX(p - nk, aP3.w), aP3.z) + nk; n = rY(rX(n, aP3.w), aP3.z);
  } else if (bone > 4.5 && bone < 5.5) {                                      // tail, laid along an arc of a circle
    float tl = aBone.z, phi0 = aP4.x, kap = aP4.y;
    kap = abs(kap) < 0.02 ? 0.02 : kap;
    float ph = phi0 + kap * tl;
    vec2 c = ${mt.tail} / kap * vec2(-sin(ph) + sin(phi0), -cos(ph) + cos(phi0));
    vec2 perp = vec2(sin(ph), cos(ph));
    float dz = position.z;
    p = vec3(position.x + aP4.z * tl * tl, -0.035 + c.x + perp.x * dz, -0.078 + c.y + perp.y * dz);
    n = vec3(normal.x, perp.x * normal.z - cos(ph) * normal.y, perp.y * normal.z + sin(ph) * normal.y);
    vObj = vec3(position.x, -0.1 - tl * ${mt.tail}, position.z);
  } else if (bone > 5.5 && bone < 6.5) {                                      // infant
    p = mix(vec3(0.0, 0.2, -0.06), p, step(aEx.y, -0.0001));
  }
  p = rX(p, aP3.x); n = rX(n, aP3.x);
  p *= uSize * aEx.x;
  p = rY(p, aPosYaw.w) + aPosYaw.xyz; n = rY(n, aPosYaw.w);
  vPos = p; vNrm = n; vCol = color; vTuft = aBone.w;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ss=`
uniform vec3 uSun, uSunCol, uSky, uGreen, uHazeCol, uCam, uPortalCol;
uniform float uBandLo, uHaze, uPocket, uFurKey, uFurLift, uFurBand;
uniform vec4 uMist;          // bottom y, top y, density, ramp width
uniform vec3 uMistCol;
uniform vec4 uMistSlot;      // the mist down in the fissure, which no sun reaches: its colour, and its density (per metre)
float mistR(float y, float s, float w){ float t = clamp((y - s) / w, 0.0, 1.0); return w * 0.5 * t * t + max(y - s - w, 0.0); }
float mistF(float y, float top){ return mistR(y, uMist.x, uMist.w) - mistR(y, top - uMist.w, uMist.w); }
float mistAmt(vec3 cam, vec3 pos, float dist, float top, float k){      // top: where the layer ends above this point (it billows); k: its density
  float dy = pos.y - cam.y;
  float dens = clamp(min((cam.y - uMist.x) / uMist.w, (top - cam.y) / uMist.w), 0.0, 1.0);
  float mean = abs(dy) < 0.05 ? dens : (mistF(pos.y, top) - mistF(cam.y, top)) / dy;
  return 1.0 - exp(-k * dist * max(mean, 0.0));
}
varying vec3 vPos;
varying vec3 vNrm;
varying vec3 vCol;
varying vec3 vObj;
varying float vTuft;
#include <fog_pars_fragment>
float sh2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float sn(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(sh2(i), sh2(i + vec2(1.0, 0.0)), f.x), mix(sh2(i + vec2(0.0, 1.0)), sh2(i + vec2(1.0, 1.0)), f.x), f.y);
}
void main(){
  vec3 N = normalize(vNrm + vec3(0.0, 1e-5, 0.0));
  float lock = step(-0.5, vTuft), tip = max(vTuft, 0.0);     // a lock of the coat (its normal is the skin's under it), and how far along it
  if (!gl_FrontFacing && lock < 0.5) N = -N;
  vec3 toCam = uCam - vPos; float dist = length(toCam); vec3 V = toCam / max(dist, 1e-3);
  // fur: locks lying down the body (they turn the light), finer streaks only where the animal is near enough to show them
  float nearK = 1.0 - smoothstep(6.0, 34.0, dist);
  float slot = 1.0 - smoothstep(58.5, 65.5, uCam.y);          // down in the fissure the strip of sky is the only light: bright crown, back and shoulders, violet-grey flanks
  float f0 = sn(vec2(vObj.x * 9.0 + vObj.z * 7.0, vObj.y * 2.4 + 1.7));
  float f1 = sn(vec2(vObj.x * 31.0 + vObj.z * 23.0, vObj.y * 5.0)), f2 = sn(vec2(vObj.x * 77.0 - vObj.z * 61.0, vObj.y * 11.0 + 3.0));
  float fur = 0.4 * f0 + 0.35 * f1 * (0.3 + 0.7 * nearK) + 0.25 * f2 * nearK - 0.45;
  float lumA = dot(vCol, vec3(0.333));
  float furry = smoothstep(0.08, 0.3, lumA) * (1.0 - smoothstep(0.1, 0.3, vCol.r - vCol.b - 0.25));      // bare black skin and the eyes have no coat
  N = normalize(N + vec3(fur, 0.4 * fur, -fur) * 0.7 * furry);
  float sunVis = smoothstep(uBandLo - 4.0 - uFurBand, uBandLo + 5.0 - uFurBand, vPos.y);
  float ndl = dot(N, uSun);
  float fres = 1.0 - max(dot(N, V), 0.0);
  float up = N.y * 0.5 + 0.5;
  vec3 alb = vCol * (1.0 + 0.9 * fur * furry) * (1.0 - 0.2 * (1.0 - tip) * lock);    // a lock is darker at its root: the coat has depth
  // on the tops and in the street the animal is lit by the scene: the side turned to the low sun and the bright sky round it is pale and warm,
  // the other side falls to the violet of the stone's own shade at about half the value; the sun itself only above the band it reaches
  vec3 Lk = normalize(vec3(uSun.x, max(uSun.y, 0.0) + 0.55, uSun.z));
  float sideK = smoothstep(-0.45, 0.65, dot(N, Lk));
  vec3 ambT = mix(uSky * (0.7 + 0.6 * up), uSky * (1.1 + 1.3 * up) + uHazeCol * 0.3, sideK) * uFurLift;
  ambT += uSunCol * sunVis * smoothstep(-0.1, 0.8, ndl) * 0.42;
  // in the slot and the pocket: a cream key from the strip of sky on whatever is turned up to it, the underside left in violet (or green) shade
  vec3 keyC = vec3(1.0, 0.93, 0.8) * uFurKey;
  vec3 ambS = uSky * (0.2 + 0.5 * up) + keyC * (0.16 + 0.84 * up * up * up) * 0.62 + uGreen * uPocket * 0.07 * (1.0 - up);
  vec3 col = alb * mix(ambT, ambS, slot);
  // the rim of lit fur: rose or gold on the sun side, a thin line of sky on the other; in the slot it lies along whatever edge is turned to the sky.
  // The tips of the locks on the sun side let the light through.
  float rim = fres * fres * (0.6 + 0.6 * f1 * (0.3 + 0.7 * nearK));
  vec3 rimT = uSunCol * (0.1 + 0.8 * sunVis) * smoothstep(-0.5, 0.25, ndl) * 0.9 + uSky * 0.8 * uFurLift;
  col += furry * rim * mix(rimT, (uSky * 0.7 + keyC * 0.75) * (0.25 + 1.0 * up), slot);
  col += furry * lock * tip * alb * mix(uSunCol * (0.06 + 0.5 * sunVis) * smoothstep(-0.6, 0.2, ndl) + uSky * 0.5 * sideK, keyC * 0.3 * up, slot);
  col += (1.0 - furry) * vCol * step(0.4, vCol.r) * (0.35 + 0.5 * up);                                    // the eyes catch the light
  vec3 toP = vec3(0.0, 4.5, 0.0) - vPos; float dP = length(toP);
  float pl = (1.0 - smoothstep(70.0, 150.0, dP)) / (1.0 + dP * dP * 0.0035) * (0.35 + 0.65 * max(dot(N, toP / max(dP, 1e-3)), 0.0));
  col += (alb + furry * rim * 0.5) * uPortalCol * pl * 2.8;
  float inSlot = (1.0 - smoothstep(uMist.y - 4.0, uMist.y + 1.0, vPos.y)) * smoothstep(0.0, 0.011, uMistSlot.a);                                 // an animal under the top of the layer is down between the walls: the mist there is in shade
  col = mix(col, mix(uMistCol * 0.9 * mix(vec3(1.0), vec3(0.62, 0.56, 0.86), 1.0 - smoothstep(uMist.y - 9.0, uMist.y - 1.0, uCam.y)), uMistSlot.rgb, inSlot), mistAmt(uCam, vPos, dist, uMist.y, mix(uMist.z, uMistSlot.a, inSlot)));
  float hz = 1.0 - exp(-uHaze * dist);
  col = mix(col, uHazeCol * 0.7 + uSky * 0.5, hz);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Co=(y,b,u,D,q)=>{const ot=Math.min(y+b-.004,Math.max(Math.abs(y-b)+.01,Math.hypot(u,D))),W=Math.atan2(D,-u),$=Math.acos(Math.max(-1,Math.min(1,(y*y+ot*ot-b*b)/(2*y*ot)))),zt=Math.acos(Math.max(-1,Math.min(1,(y*y+b*b-ot*ot)/(2*y*b))));return q?[W+$,-(Math.PI-zt)]:[W-$,Math.PI-zt]},P0=y=>{const[b,u]=Co(mt.Lt,mt.Ls,y.foot[0],y.foot[1],!0),[D,q]=Co(mt.La,mt.Lf+.03,y.hand[0]-mt.shY,y.hand[1],!1),ot=Math.max(-.9,Math.min(1.5,(y.sole??Math.PI/2)-b-u));return[b,u,ot,y.kneesOut,D,q,y.grip,y.elbowsOut,y.lean,y.toeIn,0,0,y.tail[0],y.tail[1],0,0]},Be={root:{back:.172,up:-.2,pose:P0({foot:[-.13,.118],hand:[.4,.128],kneesOut:.95,elbowsOut:.5,grip:1.3,lean:.05,toeIn:.26,tail:[-.42,1.25]})},wall:{back:.132,up:0,pose:P0({foot:[-.1,.112],hand:[.4,.118],kneesOut:1.15,elbowsOut:.9,grip:.5,lean:0,toeIn:0,tail:[-.3,.9]})},tip:{back:.07,up:.075,pose:P0({foot:[-.09,.07],hand:[.03,.112],kneesOut:.9,elbowsOut:.35,grip:.9,lean:-.1,toeIn:.2,tail:[-.5,1.5]})},hop:{back:0,up:.33,pose:P0({foot:[-.31,.012],hand:[.14,.1],sole:0,kneesOut:.3,elbowsOut:1,grip:.3,lean:-.08,toeIn:-.1,tail:[-1.1,.7]})}},n0={push:[.22,-.12,-.8,.18,.9,.5,.3,.7,.66,.04,0,.1,-.8,.7,0,0],tuck:[1.5,-1.8,.25,.7,1.5,.8,.3,1.1,.1,0,0,0,-1.9,1,0,0],reach:[1.36,-.55,-.25,.45,1.1,.9,.2,.8,.56,.1,0,-.2,-2.3,.9,0,0],hop:[.85,-1.2,.1,.45,1.3,.6,.2,1.2,.05,-.1,0,0,-1.5,.5,0,0]},A0=[0,.15,.43,.76,1];function So(y,b,u,D,q){let ot,W,$;if(q){const E=Be.hop.pose;$=Math.sin(Math.PI*Math.max(0,Math.min(1,b)));for(let Tt=0;Tt<16;Tt++)y[Tt]=E[Tt]+(n0.hop[Tt]-E[Tt])*$;return y}const zt=[Be[u].pose,n0.push,n0.tuck,n0.reach,Be[D].pose];let Y=0;for(;Y<3&&b>A0[Y+1];)Y++;ot=zt[Y],W=zt[Y+1],$=_(0,1,(b-A0[Y])/(A0[Y+1]-A0[Y]));for(let E=0;E<16;E++)y[E]=ot[E]+(W[E]-ot[E])*$;return y}const as={RIG:mt,SUP:Be,AIR:n0,flightPose:So,sifakaGeometry:Ao};async function ns(y,b={}){const u=y.rng.fork?y.rng.fork("stone-knives-hero"):y.rng,D=0,q=(b.palette&&b.palette.length>=7?b.palette:Jo).map(t=>new m.Color(t)),[ot,W,$,zt,Y,E,Tt]=q,oe=b.hour||"gold",$t=b.weather||"dry",ut=new m.Vector3(-.975,.21,.07);let nt=new m.Color(W.r*2.6,W.g*2.25,W.b*1.4),tt=$.clone().lerp(new m.Color(.075,.075,.085),.22),Dt=ft-13,ce=9e-4,ye=zt.clone();oe==="dawn"&&(ut.set(.96,.2,.18),nt=new m.Color("#ffc9a0").multiplyScalar(2.2),tt.lerp(new m.Color("#6d6f9a"),.5),ce=.0016,ye.lerp(new m.Color("#f3e6e0"),.6)),oe==="noon"&&(ut.set(-.25,.95,.15),nt=new m.Color("#fff4e0").multiplyScalar(2.3),tt=new m.Color("#5b6c94"),Dt=ft-34,ce=7e-4,ye=new m.Color("#cfdcec")),oe==="blue"&&(ut.set(.9,.3,.3),nt=new m.Color("#9fb4ff").multiplyScalar(.7),tt=new m.Color("#27305c"),Dt=ft-22,ce=.0012,ye=new m.Color("#4a5688")),b.sunDir&&ut.copy(b.sunDir.isVector3?b.sunDir:new m.Vector3().fromArray(b.sunDir)),ut.normalize(),b.haze!==void 0&&(ce=b.haze);const kt=[];for(let t=0;t<8;t++)kt.push(new m.Vector4(0,0,0,0));const Ht=m.UniformsUtils.merge([m.UniformsLib.fog,{}]);Object.assign(Ht,{uSun:{value:ut},uSunCol:{value:nt},uSky:{value:tt},uDeep:{value:E},uGreen:{value:Y},uStone:{value:ot.clone().multiplyScalar(.92)},uHazeCol:{value:ye},uCream:{value:Tt},uCam:{value:new m.Vector3(0,100,300)},uTime:{value:0},uTop:{value:ft},uHaze:{value:ce},uPocket:{value:b.pocket??1},uWet:{value:$t==="rain"?.6:0},uBandLo:{value:Dt},uShadow:{value:kt},uSize:{value:1},uFurKey:{value:1},uFurLift:{value:1},uFurBand:{value:0},uDeepFill:{value:new m.Color().copy(E).multiplyScalar(2.4).add(Y.clone().multiplyScalar(.3*(b.pocket??1))).add(tt.clone().multiplyScalar(.4))},uMist:{value:new m.Vector4(30,64,0,10)},uMistCol:{value:new m.Color(.86,.8,.8)},uMistSlot:{value:new m.Vector4(.2,.14,.31,0)},uSlotSeg:{value:new m.Vector4(0,0,0,1)},uPortalCol:{value:new m.Color(0,0,0)},uPocketAir:{value:.55},uFogTop:{value:1},uTerm:{value:0}});const se=new m.ShaderMaterial({uniforms:Ht,vertexShader:ts,fragmentShader:es,fog:!0,side:m.DoubleSide}),it=new m.Group;it.name="stone-knives-hero";const Et=(35+u.range(-4,4))*Te,B=Math.sin(Et),L=-Math.cos(Et),X=Math.cos(Et),O=Math.sin(Et),Q=[-70*B,-70*L],wt=b.bend??170,Z=Q[0]-wt*(1-Math.cos(Et)),w=t=>{const e=Et*t;return[Q[0]+wt*(X-Math.cos(e)),Q[1]+wt*(O-Math.sin(e))]},g=w(0)[1],T=[[Z-1.6,306],[Z-1.3,290],[Z-.6,262],[Z+.6,236],[Z-.4,205],[Z,Math.max(172,g+22)],w(0),w(.25),w(.5),w(.75),[Q[0],Q[1]],[-35*B,-35*L],[0,0],[26*B,26*L],[52*B,52*L]].map(t=>new m.Vector3(t[0],0,t[1])),P=new m.CatmullRomCurve3(T,!1,"centripetal"),I=P.getLength(),R=Math.ceil(I/1.5),z=[],A=new m.Vector3,at=new m.Vector3,Ft=new m.Vector3;for(let t=0;t<=R;t++){P.getPointAt(t/R,A),P.getTangentAt(t/R,at);const e=t/R*I,o=Math.hypot(A.x,A.z);let a=3.35+5.65*_(0,1,(284-A.z)/66);a=U(8,a,_(8,38,o)),a*=.25+.75*_(0,9,e),z.push({x:A.x,z:A.z,tx:at.x,tz:at.z,nx:-at.z,nz:at.x,hw:a,s:e})}let Xt=0;{let t=1e9;for(let e=0;e<z.length;e++){const o=z[e].x*z[e].x+z[e].z*z[e].z;o<t&&(t=o,Xt=e)}}const jt=z[Xt].s-(b.caveBack??100),lt=6.2,K=(t,e)=>lt*_(jt-34,jt-5,t)*(1-_(jt-.2,jt+.4,t))*(1-_(15,24,e)),It=(t,e)=>{let o=1e9;for(let a=0;a<z.length;a+=2){const s=z[a],n=Math.hypot(t-s.x,e-s.z)-s.hw;n<o&&(o=n)}return o},bt=new m.Vector3(z[0].x+.2,68,303.5),gt=(b.approach??11)*Te+u.range(-1,1)*Te,et=Math.sin(gt),J=-Math.cos(gt),pt=204,xt=new m.Vector3(bt.x-et*pt,81.5,bt.z-J*pt),ct=(t,e=0,o=ft)=>new m.Vector3(xt.x+et*t-J*e,o,xt.z+J*t+et*e),Ne=[];for(let t=0;t<6;t++)Ne.push(u.range(12,16));const Ct=b.crestEnd??24,fe=[Ct,47,68,86,105,122,139,156,179.5,pt],ue=[ft+.6,ft-7.4,ft-12.4,ft-13.8,ft-14.2,ft-13.7,ft-13,ft-12.2,66.4,67.1],Mt=fe.length-1,Kt=3,ht=[];for(let t=0;t<=Mt;t++){const e=t>0&&t<Mt&&t!==Kt&&t!==Kt+1,o=Ne[t%6];ht.push({s:fe[t]+(e?(o-14)*.4:0),lat:t===0||t===Mt?0:u.range(-.9,.9)*(t===Mt-1?.66:1),y:ue[t]+(t>0&&t<Mt-1?u.range(-.4,.4):0)})}for(const t of ht)t.pos=ct(t.s,t.lat,t.y);const St=(t,e)=>{const o=t-xt.x,a=e-xt.z;return{s:o*et+a*J,lat:-o*J+a*et}};await y.yield?.();const Vt=[0,.03,.075,.15,.28,.48,.74,1],Pt=[];for(let t=0;t<2;t++){const e=new ve,o=Ve(e,{len:12,y0:16,y1:ft,tTop:.12,tBase:5.6,nA:26,rows:Vt,toothDepth:2.6+t*.9,toothVar:1.6,endDrop:8+t*5,toothStep:2,grow:.22,flute:.85,bow:t?.5:-.3,peakAt:t?.25:-.1},u);Pt.push({geo:e.build(),peak:o.peak,crestY:o.crestY,bow:t?.5:-.3,tris:e.tris,list:[]})}const At=Math.atan2(-J,et),Bt=[],Qt=(t,e,o,a,s)=>{const n=Pt[t],i=Math.cos(o),h=Math.sin(o),r=n.peak[0]*a,f=n.peak[2]*s,c=e.x-(r*i+f*h),d=e.z-(-r*h+f*i);n.list.push({x:c,y:e.y-ft,z:d,yaw:o,sx:a,sz:s,seed:u()});const x=St(e.x,e.z),l=e.y-ft,p=v=>{const k=Math.max(-5.6,Math.min(5.6,n.peak[0]+v)),M=n.bow*(1-(k/6)**2);return new m.Vector3(c+k*a*i+M*s*h,n.crestY(k)+l,d-k*a*h+M*s*i)};Bt.push({pos:e.clone(),s:x.s,lat:x.lat,perch:p})};ht.forEach((t,e)=>{if(e===0)return;const o=e%2===1&&e>2?1:0;Qt(e%2,t.pos,At+(o?Math.PI/2+u.range(-.35,.35):u.range(-.3,.3)),u.range(.75,1.15),u.range(.9,1.2))});const je=[[4.4,-2.4],[10.5,-6.3],[9.6,4.3]],Ie=je.map(([t,e],o)=>[Kt,Kt+1].map(a=>ct(ht[a].s+t,e+ht[a].lat*.5,ht[a].y+.15-.35*o))),C0=Ie[0];Ie.forEach((t,e)=>t.forEach((o,a)=>Qt((a+e)%2,o,At+u.range(-.12,.12),e?.9:.8,.8)));const be=(ht[6].s+ht[7].s)/2+1.5;let $0=null;for(const t of[-1,1]){const e=u.range(1.05,1.2),o=ct(be+t*.8,t*(3.3+6.5*e),ft+u.range(2.5,4.5)),a=At+Math.PI/2+u.range(-.08,.08)+(t>0?0:Math.PI);if(b.rare&&t>0){u();const s=ct(be+4,6.1,0);$0={x:s.x,z:s.z,yaw:At-Math.PI/2,yCut:ht[6].y+4.6,s:be+4,lat:6.1};continue}Qt(t>0?0:1,o,a,e,1.25)}const Q0=Bt.length;for(let t=-8;t<pt+6;t+=15.5)for(const e of[-1,1])for(let o=0;o<2;o++){const a=t>Ct-2;if(!u.chance(a?o?.62:.86:o?.5:.62))continue;const s=e*((a?6.5:5.6)+o*7.6+u.range(-.8,1.6)),n=t+u.range(-5,5)+o*6,i=ft+u.range(-2.2,1.6),h=79-.6+u.range(-2.5,0),r=ct(n,s,a?i+(o?0:u.range(0,1.5)):Math.min(i,h));if(a&&Math.abs(n-be)<9||o===0&&s>0&&Math.abs(n-(ht[6].s+4))<7||It(r.x,r.z)<7)continue;let f=!0;for(const x of Bt)x.pos.distanceTo(r)<6.5&&(f=!1);if(!f)continue;const c=u.range(.7,1.3);let d=u.chance(.3)?Math.PI/2-.2+u.range(-.2,.2):u.range(-.25,.25);Math.abs(s)-Math.abs(Math.sin(d))*7.4*c-1.6<2.6&&(d=u.range(-.1,.1)),Qt(u.int(0,1),r,At+d+(u.chance(.5)?Math.PI:0),c,u.range(.8,1.25))}const l0=new m.Matrix4,Z0=new m.Quaternion,J0=new m.Euler,to=new m.Vector3,eo=new m.Vector3,r0=(t,e)=>{const o=new m.InstancedMesh(t,se,e.length),a=new Float32Array(e.length);return e.forEach((s,n)=>{J0.set(0,s.yaw,0),Z0.setFromEuler(J0),to.set(s.x,s.y,s.z),eo.set(s.sx,s.sy||1,s.sz),l0.compose(to,Z0,eo),o.setMatrixAt(n,l0),a[n]=s.seed}),t.setAttribute("aSeed",new m.InstancedBufferAttribute(a,1)),o.instanceMatrix.needsUpdate=!0,o.frustumCulled=!1,it.add(o),o};let he=0;const Gt={blades:[],mid:null,far:null,fixed:null,plants:null,plantList:[],sifakas:null};for(const t of Pt)Gt.blades.push(r0(t.geo,t.list)),he+=t.tris*t.list.length;await y.yield?.();let G=new ve;const i0=(Ct-3)/2,Fo=(Ct+5)/2,oo=ct(i0,0,0),so=Po(oo.x,0,oo.z,At),To=Ve(G,{len:Ct+5,y0:16,y1:ft+.6,tTop:.14,tBase:7,nA:Math.round((Ct+5)*1.26),rows:Vt,toothDepth:1.25,toothVar:.55,endDrop:5,endPow:6,toothStep:2,grow:.08,flute:.9,bow:.25,peakAt:.9},u,so),pe=t=>{const e=so(t-i0,To.crestY(t-i0),.25*(1-((t-i0)/Fo)**2));return new m.Vector3(e[0],e[1],e[2])},c0=gt+u.range(-7,7)*Te,ao=Math.sin(c0),no=-Math.cos(c0),Vo=Math.cos(c0),Bo=Math.sin(c0),No=Math.atan2(-no,ao),S0=b.towerHeight??104,F0=S0-104,T0=[{x:X*19.5,z:O*19.5,h:S0},{x:-X*19.5,z:-O*19.5,h:S0-3.5+u.range(-1.5,1.5)}],V0=[{x:B*44-X*30,z:L*44-O*30,h:93+F0*.6+u.range(-3,3)},{x:B*30+X*46,z:L*30+O*46,h:90+F0*.6+u.range(-3,3)},{x:-B*14-X*52,z:-L*14-O*52,h:87+F0*.6+u.range(-2,3)}],jo=(t,e)=>{const o=St(t,e),a=Math.max(0,-10-o.s,o.s-(pt+8)),s=Math.hypot(o.lat,a),n=Math.hypot(t,e),i=It(t,e);for(const c of T0)if(Math.hypot(t-c.x,e-c.z)<19)return 0;for(const c of V0)if(Math.hypot(t-c.x,e-c.z)<13)return 0;const h=(t-Z*.4)/400,r=(e-120)/525;return h*h+r*r>1?0:s<92||n<150||i<52?i<10.5||s<17.5&&a===0?0:1:i<17?0:2},Ge=[],h0=[],lo=async(t,e,o,a)=>{let s=0;for(let n=-620;n<=620;n+=e){(s++&1)===1&&await y.yield?.();const i=(Math.round(n/e)&1)*t*.5+u.range(-2,2);for(let h=-700;h<=700;h+=t){const r=h+i+u.range(-.3,.3)*t,f=n+u.range(-.22,.22)*e,c=r*ao+f*Vo,d=120+r*no+f*Bo;if(jo(c,d)!==o)continue;const x=u.chance(.24);a.push({x:c,z:d,y:u.range(-2.4,1.8)+(u.chance(.06)?u.range(1.5,4):0),yaw:No+(x?78*Te:0)+u.range(-.16,.16)+(u.chance(.5)?Math.PI:0),sx:(o===1?u.range(.7,1.45):u.range(.75,1.5))*(x?.7:1),sz:u.range(.8,1.3),seed:u()})}}};await lo(17,9,1,Ge),await y.yield?.(),await lo(24,11.5,2,h0);{const t=new ve;Ve(t,{len:12,y0:12,y1:ft,tTop:.2,tBase:7.5,nA:5,rows:[0,.2,1],toothDepth:2.5,toothVar:1.5,endDrop:9,toothStep:1,grow:.25,flute:.3,top:2.5,cut:!0},u),Gt.mid=r0(t.build(),Ge),he+=t.tris*Ge.length;const e=new ve;Ve(e,{len:19,y0:30,y1:ft,tTop:.3,tBase:10.5,nA:3,rows:[0,1],toothDepth:2.5,toothVar:2,endDrop:11,toothStep:1,grow:.3,flute:0,top:4.5,tPow:.85,cut:!0},u),Gt.far=r0(e.build(),h0),he+=e.tris*h0.length}await y.yield?.();const Ke=(t,e,o,a,s,n,i,h=1)=>{const r=t.n,f=new m.Vector3,c=new m.Vector3,d=new m.Vector3,x=new m.Vector3;for(let l=0;l<e.length;l++){f.subVectors(e[Math.min(e.length-1,l+1)],e[Math.max(0,l-1)]).normalize(),x.set(Math.abs(f.y)>.9?1:0,Math.abs(f.y)>.9?0:1,0),c.crossVectors(f,x).normalize(),d.crossVectors(f,c).normalize();const p=o(l),v=l*.5;for(let k=0;k<a;k++){const M=k/a*Math.PI*2+v,C=Math.cos(M)*p,N=Math.sin(M)*p*h,S=typeof n=="function"?n(l,k):n;t.v(e[l].x+c.x*C+d.x*N,e[l].y+c.y*C+d.y*N,e[l].z+c.z*C+d.z*N,S[0],S[1],S[2],i(l,k),s)}}for(let l=0;l<e.length-1;l++)for(let p=0;p<a;p++){const v=r+l*a+p,k=r+l*a+(p+1)%a;t.quad(v,k,k+a,v+a)}},Io=Math.atan2(-L,B),Ko=[0,.02,.05,.1,.18,.3,.46,.66,.84,1],ro=[],io=(t,e,o,a,s,n)=>{const i=u.range(0,6.28);for(let h=0;h<a;h++){const r=h===0,f=r?o:h===1?o-u.range(3,7):o-u.range(5,12)-h*u.range(2.2,4.2),c=r?u.range(21,25):h===1?u.range(17,21):u.range(11,18),d=r?u.range(12,14):u.range(7,10.5),x=n&&h===1,l=r?u.range(-.25,.25):x?90*Te+u.range(-.25,.25):(u.chance(.5)?0:78*Te)+u.range(-.4,.4),p=i+h/Math.max(1,a-1)*6.28+u.range(-.3,.3),v=r||x?0:s*u.range(.55,1);let k=t+Math.cos(p)*v,M=e+Math.sin(p)*v;if(n){const N=k*X+M*O,S=Math.sign(t*X+e*O)||1,V=8.8+(Math.abs(Math.sin(l))*c*.5*1.35+Math.abs(Math.cos(l))*d*.5)-N*S;V>0&&(k+=X*V*S,M+=O*V*S)}const C=Ve(G,{len:c,y0:-1.5,y1:f,tTop:.25,tBase:d,nA:14,rows:Ko,toothDepth:r?7:5,toothVar:3.5,endDrop:f*(r?.5:.42),endPow:r?1.25:1.5,toothStep:2,grow:.34,flute:.72,bow:u.range(-.8,.8),peakAt:u.range(-.25,.25),tPow:.8},u,Po(k,0,M,Io+l,u.range(-.035,.035)));r&&ro.push(new m.Vector3(C.peak[0],C.peak[1],C.peak[2]))}};T0.forEach(t=>io(t.x,t.z,t.h,7,8.5,!0)),await y.yield?.(),V0.forEach(t=>io(t.x,t.z,t.h,4,6,!1)),await y.yield?.();{const t=new m.Mesh(G.build(),se);t.frustumCulled=!1,it.add(t),Gt.towers=t,he+=G.tris,G=new ve}await y.yield?.();{const t=[];for(let e=0;e<=16;e++){const o=-1+e/8;t.push(new m.Vector3(X*o*18+B*1.5,28.2+2.6*(1-o*o)+.5*Math.sin(e*1.7),O*o*18+L*1.5))}Ke(G,t,e=>{const o=-1+e/8;return 2.7*(1+.55*o*o)*(1+.12*Math.sin(e*2.3))},8,0,(e,o)=>{const a=.7+.3*Math.abs(Math.sin(o*2.4+e));return[a,a,a]},(e,o)=>e*2.2+o*.4,1.7)}const co=y.noise?.n2||(()=>0),Nt=[1,.86,.7,.54,.4,.28,.18,.1,.045,0],ho=[[5,1.5],[20,4],[46,7]],fo=new Float32Array(z.length),uo=new Float32Array(z.length);{let t=0,e=0,o=!0;for(;t<z.length;){const a=Math.min(z.length,t+u.int(1,3)),s=o?u.range(0,2.2):e+u.range(1.5,5)+(u.chance(.12)?u.range(5,11):0);for(let n=t;n<a;n++){const i=(n-t)/(a-t);fo[n]=U(e,s,i),uo[n]=o?i:1-i}e=s,t=a,o=!o}}const Le=[[],[]];for(const t of[-1,1]){await y.yield?.();const e=G.n,o=Nt.length+ho.length;for(let a=0;a<z.length;a++){const s=z[a],n=t>0?a:(a+57)%z.length,i=U(65.5,ft+1.2*co(s.s*.03,t*9),_(2,17,s.s))-fo[n]*_(4,20,s.s),h=uo[n];for(let r=0;r<o;r++){let f,c,d;if(r<Nt.length){const x=Nt[r];f=i+(-1.5-i)*x,c=s.hw+.3+1.7*Math.pow(1-x,1.6)+1.8*(co(s.s*.045+t*31,f*.05)*.5+.5)+1.5*(1-h)*_(0,.1,x),t>0&&(c+=K(s.s,f)),x===0&&(c+=.5),d=(.62+.38*h)*(1-.1*x)}else{const x=ho[r-Nt.length];f=i-x[0],c=s.hw+3.2+x[1]+1.5*h,d=.8}r<Nt.length&&Le[t>0?1:0].push(f,c),G.v(s.x+s.nx*c*t,f,s.z+s.nz*c*t,d,d,d,s.s,0,1)}}for(let a=0;a<z.length-1;a++)for(let s=0;s<o-1;s++){const n=e+a*o+s,i=n+o;t>0?G.quad(n,i,i+1,n+1):G.quad(n,n+1,i+1,i)}}{const t=G.n,e=[-1.15,-.5,0,.5,1.15];for(let n=0;n<z.length;n+=2){const i=z[n];for(const h of e){const r=h*(i.hw+2.5+(h>1?K(i.s,0):0));G.v(i.x+i.nx*r,-.2+Math.abs(h)*.9,i.z+i.nz*r,1,1,1,r,3)}}const o=Math.ceil(z.length/2);for(let n=0;n<o-1;n++)for(let i=0;i<4;i++){const h=t+n*5+i;G.quad(h,h+5,h+6,h+1)}const a=G.v(Z*.4,-1.4,120,0,0,0,99,3),s=G.n;for(let n=0;n<28;n++){const i=n/28*6.2832;G.v(Z*.4+Math.cos(i)*450,-1.4,120+Math.sin(i)*580,0,0,0,99,3)}for(let n=0;n<28;n++)G.tri(a,s+(n+1)%28,s+n)}await y.yield?.();const Lo=(t,e,o,a=new m.Vector3)=>{t=Math.max(0,Math.min(z.length-1,Math.round(t)));const s=Le[e>0?1:0],n=t*Nt.length*2;let i=0,h=1e9;for(let c=0;c<Nt.length;c++){const d=Math.abs(s[n+c*2]-o);d<h&&(h=d,i=c)}const r=z[t],f=s[n+i*2+1];return a.set(r.x+r.nx*f*e,s[n+i*2],r.z+r.nz*f*e)},Ye=(t,e,o)=>{t=Math.max(0,Math.min(z.length-1,Math.round(t)));const a=Le[e>0?1:0],s=t*Nt.length*2;for(let n=0;n<Nt.length-1;n++){const i=a[s+n*2],h=a[s+n*2+2];if(o<=h||n===Nt.length-2){const r=Math.max(0,Math.min(1,(o-i)/Math.max(.001,h-i)));return U(a[s+n*2+1],a[s+n*2+3],r)}}return a[s+1]},De=(t,e,o,a=new m.Vector3,s=0)=>{t=Math.max(0,Math.min(z.length-1,Math.round(t)));const n=z[t],i=Ye(t,e,o)-s;return a.set(n.x+n.nx*i*e,o,n.z+n.nz*i*e)},f0=(t,e)=>{let o=0,a=1e9;for(let s=0;s<z.length;s++){const n=(z[s].x-t)**2+(z[s].z-e)**2;n<a&&(a=n,o=s)}return o},B0=f0(0,0);{const t=new m.Mesh(G.build(),se);t.frustumCulled=!1,it.add(t),Gt.fixed=t,he+=G.tris,G=new ve}await y.yield?.();const _e=(t,e)=>{const o=.75+.5*((e*7+t*3)%5)/5;return[o,o*.95,o*.9]},Do=(t,e)=>{const o=z[t],s=Le[e>0?1:0][t*Nt.length*2+(Nt.length-2)*2]-u.range(0,6),n=u.range(-1,14),i=14,h=[],r=u.range(.1,.19),f=u.range(0,6.28),c=u.range(-2.2,2.2);for(let d=0;d<i;d++){const x=d/(i-1),l=U(s,n,x),p=c*x+.35*Math.sin(x*7+f),v=t+p/1.5,k=Math.min(Ye(v,e,l),Ye(v,e,l+5),Ye(v,e,l-5))-r*.7-.22*(.5+.5*Math.sin(x*9+f))*Math.sin(x*Math.PI);h.push(new m.Vector3(o.x+o.nx*k*e+o.tx*p,l,o.z+o.nz*k*e+o.tz*p))}return Ke(G,h,d=>r*(1-.6*(d/(i-1)))+.03,7,4,_e,d=>.3*Math.sin(d/(i-1)*Math.PI)),h},Xo=[];for(let t=0;t<54;t++){const e=t<30?t%3:t<40?2:0;let o=e===0?u.int(8,60):e===1?u.int(60,B0-30):B0-u.int(5,28);o=Math.max(4,Math.min(z.length-2,o));const a=t%2?1:-1,s=Do(o,a);e===2&&a<0&&Xo.push(s),t%14===13&&await y.yield?.()}const vt=(t,e,o)=>new m.Vector3(t,e,o),Yt=ht.map(t=>t.pos),po=b.entryLift??6,de=[xt.clone().add(vt(0,po,0)),pe(Ct*.34).add(vt(0,1.5+po*.6,0)),pe(Ct*.68).add(vt(0,.95,0)),Yt[0].clone().add(vt(0,.9,0))];for(let t=1;t<=Mt;t++){const e=Yt[t-1],o=Yt[t],a=Math.max(0,e.y-o.y);de.push(e.clone().lerp(o,.5-Math.min(.12,a*.012)).add(vt(0,.9+(t<Mt-1?1.6:2.2)+a*.16,0)),o.clone().add(vt(0,.9,0)))}const Oo=de.length,Rt=(t,e)=>{const o=z[Math.max(0,Math.min(z.length-1,Math.round(t/1.5)))];return vt(o.x,e,o.z)},u0=z[B0].s;{const t=z[1],e=z[Math.min(z.length-1,Math.round(82/1.5))];Ht.uSlotSeg.value.set(t.x,t.z,e.x,e.z)}de.push(Rt(14,55),Rt(34,34),Rt(56,16),Rt(74,9),Rt(100,5.6),Rt(140,4.6),Rt(190,4.2),Rt(u0-70,4.2),Rt(u0-35,4.4),vt(0,4.5,0));const qt=new m.CatmullRomCurve3(de,!1,"centripetal",.5);qt.arcLengthDivisions=Math.max(400,de.length*60);const _t=qt.getLength(),mo=(t,e)=>{let o=1e12,a=e;for(let s=Math.floor(e/_t*2400);s<=2400;s++){qt.getPointAt(s/2400,A);const n=A.distanceToSquared(t);if(n<o)o=n,a=s/2400*_t;else if(o<1&&n>o+900)break}return a},p0=[];{let t=0;for(let e=0;e<=Mt;e++)t=mo(de[3+2*e],t),p0.push(t)}await y.yield?.();const ge=p0[Mt],N0=mo(de[Oo+3],ge),j0=(N0-ge)/4.5,I0=t=>ge+(t-19)*j0,d0=19+(.55*_t-ge)/j0,m0={uLand:p0.map(t=>t/_t),uLip:ge/_t,uBottom:N0/_t,uOut:(N0+2.25*j0)/_t,tOut:25.75};let K0=Math.floor(Math.abs(xt.x*631+gt*7717))%9973+7;const Lt=()=>(K0=K0*16807%2147483647,(K0&65535)/65536),Ho=[{bow:-.3,endDrop:8},{bow:.5,endDrop:13}],Me=(t,e,o,a)=>{for(let s=0;s<2;s++){const n=Ho[s];for(const i of Pt[s].list){const h=t-i.x,r=o-i.z;if(h*h+r*r>150)continue;const f=Math.cos(i.yaw),c=Math.sin(i.yaw),d=(h*f-r*c)/i.sx,x=(h*c+r*f)/i.sz,l=e-i.y,p=ft-n.endDrop*Math.pow(Math.min(1.2,Math.abs(d/6)),2.4)-.8;if(l>p||l<16)continue;const v=(p-l)/(p-16),k=d/(6*(1+.22*v));if(!(Math.abs(k)>=1)&&Math.abs(x-n.bow*(1-k*k))<.5*(.12+5.48*Math.pow(v,.7))*Math.sqrt(1-k*k)+a/i.sz)return!0}}return!1},Ue=[];for(let t=0;t<=320;t++)qt.getPointAt(Math.min(1,t/320*ge/_t),A),Ue.push([St(A.x,A.z).s,A.x,A.y,A.z]);const wo=(t,e)=>{let o=0;for(;o<Ue.length-2&&Ue[o+1][0]<t;)o++;const a=Ue[o],s=Ue[o+1],n=Math.max(0,Math.min(1,(t-a[0])/Math.max(.001,s[0]-a[0])));return e.set(U(a[1],s[1],n),U(a[2],s[2],n),U(a[3],s[3],n))},Zt=[];{const e=Vt.length,o=new m.Vector3,a=new m.Vector3,s=new m.Vector3,n=new m.Vector3,i=new m.Vector3;for(let h=0;h<2;h++){const r=Pt[h],f=r.geo.attributes.position.array,c=r.geo.attributes.normal.array;let d=0;for(const x of r.list){const l=St(x.x,x.z);if(l.s<14||l.s>pt+8||Math.abs(l.lat)>20)continue;++d%3===0&&await y.yield?.();const p=Math.cos(x.yaw),v=Math.sin(x.yaw),k=(M,C)=>{const N=f[M*3]*x.sx,S=f[M*3+2]*x.sz;return C.set(x.x+N*p+S*v,x.y+f[M*3+1],x.z-N*v+S*p)};for(let M=0;M<2;M++)for(let C=2;C<=24;C++)for(const N of[.3,1.5,2.7]){const S=M*e*27+C,F=(1-M)*e*27+C;k(S+81,o);const V=St(o.x,o.z);if(V.s<27||V.s>pt-3||Math.abs(V.lat)<3.2||Math.abs(V.lat)>9.5)continue;const H=wo(V.s,n).y+N;let st=1;for(;st<e-2&&x.y+f[(S+(st+1)*27)*3+1]>H;)st++;const me=x.y+f[(S+st*27)*3+1],We=x.y+f[(S+(st+1)*27)*3+1];if(H>me||H<We)continue;const ee=(me-H)/Math.max(.001,me-We),ie=(S+st*27)*3,o0=(S+(st+1)*27)*3;k(S+st*27,o).lerp(k(S+(st+1)*27,s),ee);const s0=U(c[ie],c[o0],ee)/x.sx,z0=U(c[ie+1],c[o0+1],ee),a0=U(c[ie+2],c[o0+2],ee)/x.sz;if(a.set(s0*p+a0*v,z0,-s0*v+a0*p).normalize(),k(F+st*27,i).lerp(k(F+(st+1)*27,s),ee),a.dot(i.sub(o))>0&&a.negate(),Math.abs(a.y)>.5)continue;const we=St(o.x,o.z);if(Math.abs(we.lat)<3.3||Math.abs(we.lat)>9)continue;wo(we.s-9,n),s.subVectors(n,o).normalize();const k0=a.dot(s);if(k0<.3||Me(o.x+a.x*.6,o.y+a.y*.6,o.z+a.z*.6,.25))continue;let xe=!0;for(const Fe of[.3,.55,.8])if(s.set(o.x+a.x*.5,o.y,o.z+a.z*.5).lerp(n,Fe),Me(s.x,s.y,s.z,0)){xe=!1;break}xe&&Zt.push({p:o.clone(),n:a.clone(),s:we.s,lat:we.lat,dh:N,vis:k0})}}}}await y.yield?.();const Jt=[],xo=(t,e,o={})=>{let a=null,s=1e9;for(const n of Zt){if(Math.sign(n.lat)!==e||o.dh!==void 0&&Math.abs(n.dh-o.dh)>.5)continue;const i=Math.abs(n.lat),h=Math.abs(n.s-t);if(i<(o.latMin??3.5)||i>(o.latMax??8)||h>(o.reach??5))continue;let r=!0;for(const c of Jt)if(c.p.distanceToSquared(n.p)<(o.apart??3.4)**2){r=!1;break}if(!r)continue;const f=h*.6+Math.abs(i-(o.lat??4.8))-2.5*n.vis;f<s&&(s=f,a=n)}return a&&Jt.push(a),a},Wt=t=>Math.atan2(-t.n.x,-t.n.z),ae=(t,e)=>{for(const o of Jt)if(o.p.distanceToSquared(t.p)<e*e)return!1;return!0},$e=(t,e,o)=>{const a=Math.sign(t.lat)===Math.sign(e.lat),s=t.n.x+e.n.x,n=t.n.z+e.n.z,i=Math.hypot(s,n);if(a&&i<.6)return!1;o.bx=a?s/i*1.5:0,o.bz=a?n/i*1.5:0;for(let h=.14;h<.9;h+=.12){const r=4*h*(1-h);if(A.set(t.p.x+t.n.x*.45,t.p.y,t.p.z+t.n.z*.45).lerp(Ft.set(e.p.x+e.n.x*.45,e.p.y,e.p.z+e.n.z*.45),h),Me(A.x+o.bx*r,A.y+1*r,A.z+o.bz*r,.3))return!1}return!(a&&Math.min(Math.abs(St(t.p.x+o.bx,t.p.z+o.bz).lat),Math.abs(St(e.p.x+o.bx,e.p.z+o.bz).lat))<2.6)},L0=[];{qt.getPointAt(.305,A);const t=St(A.x,A.z).s,e={bx:0,bz:0};for(let o=0;o<3;o++){const a=t+6.5+3.4*o;let s=null,n=1e9;for(const r of Zt)if(!(Math.abs(r.s-a)>5||Math.abs(r.lat)>8.6||r.dh<1||!ae(r,2.4)))for(const f of Zt){const c=f.p.distanceToSquared(r.p);if(f.s<r.s+3||f.s>r.s+10.5||c<30||c>150||Math.abs(f.lat)>8.6||f.dh>2||!ae(f,2.4))continue;const d=Math.sign(f.lat)!==Math.sign(r.lat),x=Math.abs(r.s-a)*.5+(Math.abs(r.lat)+Math.abs(f.lat))*.4-2*(r.vis+f.vis)+(d?0:2.5);x<n&&$e(r,f,e)&&(n=x,s=[r,f,e.bx,e.bz])}if(!s)continue;Jt.push(s[0],s[1]);let i=null,h=1e9;for(const r of Zt){if(r.s<pt-9||r.s>pt-1.5||Math.abs(r.lat)>7.8||!ae(r,2.4)||!$e(s[1],r,e))continue;const f=Math.abs(r.lat)*.3+r.dh*.6-r.vis+Math.abs(r.s-pt+5)*.15+(Math.sign(r.lat)===Math.sign(s[1].lat)?1.5:0);f<h&&(h=f,i={h:r,bx:e.bx,bz:e.bz})}i&&Jt.push(i.h),L0.push({A:s[0],B:s[1],bx:s[2],bz:s[3],C:i,sCam:t,j:o})}}const D0=[];{const t={bx:0,bz:0};for(const e of[73.5,95,102,122,144,158,172]){let o=null,a=1e9;for(const r of Zt){const f=Math.abs(r.lat),c=Math.abs(r.s-e);if(c>4.5||f<3.6||f>7.4||!ae(r,3.6))continue;const d=c*.7+Math.abs(f-4.9)+Math.abs(r.dh-1.5)*.4-2.5*r.vis;d<a&&(a=d,o=r)}if(!o)continue;Jt.push(o);let s=null,n=-1e9,i=0,h=0;for(const r of Zt){if(Math.sign(r.lat)!==Math.sign(o.lat)||Math.abs(r.lat)<3.6||!ae(r,3))continue;const f=r.p.distanceTo(o.p);if(f<4.5||f>9.5||r.s<o.s-1.5||r.s>o.s+8.5)continue;const c=r.vis*2+(r.s-o.s)*.1-Math.abs(f-7)*.3;c>n&&$e(o,r,t)&&(n=c,s=r,i=t.bx,h=t.bz)}s&&Jt.push(s),D0.push({A:o,B:s,bx:i,bz:h})}}const Qe=[],vo=(t,e,o)=>{const a=Math.hypot(t.n.x,t.n.z)||1,s=t.n.x/a,n=t.n.z/a,i=-n,h=s,r=7,f=[],c=[],d=[],x=(p,v,k,M)=>G.v(t.p.x+i*p+s*v,t.p.y+k,t.p.z+h*p+n*v,M,M,M,t.s*.7+p+v*.6,0),l=x(0,-.4,.03,.95);for(let p=0;p<=r;p++){const v=-1+2*p/r,k=Math.sqrt(Math.max(0,1-v*v)),M=1+.2*Math.sin(p*2.7+t.s);f.push(x(v*e*.5,-.4+(o+.4)*k*M,-.07*k+.05*Math.sin(p*1.9+t.s),1)),c.push(x(v*e*.5,-.4+(o+.4)*k*M*.95,-.2-.12*k,.6)),d.push(x(v*e*.4,-.4,-.55-.8*k,.46))}for(let p=0;p<r;p++)G.tri(l,f[p],f[p+1]),G.quad(f[p],c[p],c[p+1],f[p+1]),G.quad(c[p],d[p],d[p+1],c[p+1]);return{x:t.p.x+s*o*.42,y:t.p.y-.02,z:t.p.z+n*o*.42}};{let t=Lt()<.5?1:-1,e=0;for(let o=49+3*Lt();o<pt-5;o+=8+4*Lt()){const a=e%3===2?.3:e%3?1.5:2.7,s=xo(o,t,{dh:a,lat:5,latMin:3.9,apart:3.8,reach:4})||xo(o,-t,{dh:a,lat:5,latMin:3.9,apart:3.8,reach:4});if(t=-t,e++,!s)continue;const n=Lt()<.4,i=vo(s,n?2.3:1.6+.5*Lt(),n?1:.75),h=(n?.72:.5)+.22*Lt();Qe.push({x:i.x,y:i.y-.12*h,z:i.z,yaw:Lt()*6.28,sx:h*.9,sy:h*(1.05+.2*Lt()),sz:h*.9,seed:Lt()})}}{const t=b.ledgeU??.16,e=qt.getPointAt(t),o=qt.getPointAt(Math.min(1,t+26/qt.getLength())).sub(e).normalize();let a=null,s=-1e9;for(const[n,i,h,r]of[[20.5,.885,.15,2.6],[24,.85,.2,1.6],[28,.8,.26,1.2]]){for(const f of Zt){const c=f.p.x-e.x,d=f.p.y-e.y,x=f.p.z-e.z,l=Math.hypot(c,d,x);if(l<11||l>n||!ae(f,r))continue;const p=(c*o.x+d*o.y+x*o.z)/l,v=-(f.n.x*c+f.n.y*d+f.n.z*x)/l;if(p<i||v<.18||Math.abs(d/l-o.y+.02)>h)continue;const k=p*14+v*3-Math.abs(l-15)*.2-Math.abs(d/l-o.y+.02)*12;k>s&&(s=k,a=f)}if(a)break}if(a){Jt.push(a);const n=vo(a,4.4,2),i=Math.hypot(a.n.x,a.n.z)||1,h=-a.n.z/i,r=a.n.x/i;Qe.push({x:n.x-h*.35,y:n.y-.22,z:n.z-r*.35,yaw:2.2,sx:2.1,sy:2.3,sz:2.1,seed:.53}),Qe.push({x:n.x+h*1.4,y:n.y-.08,z:n.z+r*1.4,yaw:.6,sx:.55,sy:.66,sz:.55,seed:.19}),Gt.bigLedge=n}}await y.yield?.();const ze=[];let Ze=null,X0=Math.floor(Math.abs(bt.x*977+Et*3301))%9973+1;const ke=()=>(X0=X0*16807%2147483647,(X0&65535)/65536);{const a=[];let s=d0-.32,n=d0+.17,i=I0(d0)+8.4;a.push({tArr:s,tLeave:n,arc:i,last:!0});for(let r=0;r<9;r++){const f=s-.56-.03*(r%2),c=I0(f)+5,d=f-.36;if(c-ge<9||d<18.7)break;a.unshift({tArr:d,tLeave:f,arc:c,last:!1}),s=d}let h=a.length%2?-1:1;a.forEach((r,f)=>{qt.getPointAt(Math.min(1,r.arc/_t),A);const c=f0(A.x,A.z),d=z[c],x=h*(r.last?2.3:2+.3*ke()),l=Math.max(4.4,A.y-(r.last?.5:1.1)+.5*(ke()-.5)),p=new m.Vector3(A.x+d.nx*x,l,A.z+d.nz*x),v=d.nx*h*.95+d.tx*.3,k=d.nz*h*.95+d.tz*.3;ze.push({pos:p,face:Math.atan2(v,k),tArr:r.tArr,tLeave:r.tLeave,last:r.last});const M=l+20+6*ke(),C=De(c,h,M),N=[],S=5+5*ke(),F=.1+.03*ke();for(let V=0;V<=3;V++){const H=V/3,st=1-(1-H)*(1-H);N.push(new m.Vector3(U(C.x,p.x,st),U(M,l+9,H)+1.2*Math.sin(H*Math.PI),U(C.z,p.z,st)))}for(let V=1;V<=8;V++)N.push(new m.Vector3(p.x+.03*Math.sin(V*1.9+f),Math.max(-.4,l+9-(9+S)*V/8),p.z+.03*Math.cos(V*2.3+f)));if(Ke(G,N,V=>F*(1-.03*V)+.02,6,4,_e,V=>V>9?.12*(V-9):0),r.last){const V=Math.min(z.length-2,c+5),H=Math.min(l+11,Le[h>0?1:0][V*Nt.length*2+(Nt.length-2)*2]-3);Ze={pos:De(V,h,H,new m.Vector3,.05),face:Math.atan2(z[V].nx*h,z[V].nz*h)}}h=-h})}const ne=new m.Vector3(-B*21.5-X*4.5,5.6,-L*21.5-O*4.5);{const t=f0(ne.x,ne.z),e=De(t,-1,36),o=[];for(let a=0;a<=4;a++){const s=a/4,n=1-(1-s)*(1-s);o.push(new m.Vector3(U(e.x,ne.x,n),U(36,25,s)+1.5*Math.sin(s*Math.PI),U(e.z,ne.z,n)))}for(let a=1;a<=7;a++){const s=25-25.4*a/7;o.push(new m.Vector3(ne.x+.05*Math.sin(a*1.9),s,ne.z+.05*Math.cos(a*2.3)))}Ke(G,o,a=>.2-.004*a+(a>10?.06*(a-10):0),7,4,_e,()=>0)}let Ot=null;{let t=Math.floor(Math.abs(bt.x*541+Et*9127))%9973+3;const e=()=>(t=t*16807%2147483647,(t&65535)/65536),o={range:(M,C)=>M+(C-M)*e(),chance:M=>e()<M,int:(M,C)=>M+Math.floor(e()*(C-M+1))},a=u0-(b.archBack??52.5),s=z[Math.max(0,Math.min(z.length-1,Math.round(a/1.5)))],n=2*(s.hw+3.6),i=5.6,h=.45,r=Math.cos(h),f=Math.sin(h),c=b.archY??12.3,d=.06,x=.35,l=(M,C,N)=>{const S=C-i;return[s.x+s.nx*M-s.tx*r*S+s.tx*f*N,c+M*d+f*S+r*N,s.z+s.nz*M-s.tz*r*S+s.tz*f*N]},p=Ve(G,{len:n,y0:0,y1:i,tTop:.18,tBase:1.5,nA:24,rows:[0,.035,.1,.22,.45,.74,1],toothDepth:1,toothVar:.45,endDrop:.7,endPow:6,toothStep:2,grow:0,flute:.8,bow:x,peakAt:.12},o,l),v=M=>{const C=M/(n*.5),N=l(M,p.crestY(M),x*(1-C*C));return new m.Vector3(N[0],N[1],N[2])},k=M=>{const C=M/(n*.5),N=l(M,0,x*(1-C*C)-.5);return new m.Vector3(N[0],N[1],N[2])};for(const M of[-7.6,-5.2,4.4,6.6,8.3]){const C=k(M),N=2.2+3.4*e(),S=.07+.05*e(),F=e()*6.28,V=[];for(let H=0;H<8;H++){const st=H/7;V.push(new m.Vector3(C.x+.12*Math.sin(st*6+F),C.y+.3-N*st,C.z+.12*Math.cos(st*5+F)))}Ke(G,V,H=>S*(1-.6*(H/7))+.02,5,4,_e,H=>.5*(H/7))}Ot={s:a,center:new m.Vector3(s.x,c,s.z),across:new m.Vector3(s.nx,0,s.nz),along:new m.Vector3(s.tx,0,s.tz),halfWidth:s.hw,crestPt:v,footPt:k,face:Math.atan2(-s.tx,-s.tz)}}for(let t=0;t<15;t++){const e=t>=10,o=e?u.range(-6,6):(t%2?1:-1)*u.range(9.2,16.5),a=e?u.range(3.5,8.5):u.range(11,23),s=27.5+2.2*(1-(o/18)**2)-1.6,n=e?.07:u.range(.09,.16),i=1.5+u.range(-2.4,2.4),h=[],r=u.range(0,6.28);for(let f=0;f<9;f++){const c=f/8;h.push(new m.Vector3(X*o+B*i+.15*Math.sin(c*6+r),s-a*c,O*o+L*i+.15*Math.cos(c*5+r)))}Ke(G,h,f=>n*(1-.65*(f/8))+.02,5,4,_e,f=>.85*(f/8))}await y.yield?.();const O0=new m.Mesh(G.build(),se);O0.frustumCulled=!1,it.add(O0),Gt.roots=O0,he+=G.tris,await y.yield?.();{const t=new ve,e=new m.Vector3(0,1,0),o=new m.Vector3,a=new m.Vector3,s=new m.Vector3,n=new m.Vector3,i=(l,p,v,k,M=0)=>{const C=t.n;let N=M;for(let F=0;F<l.length;F++){F&&(N+=l[F].distanceTo(l[F-1])),o.subVectors(l[Math.min(l.length-1,F+1)],l[Math.max(0,F-1)]).normalize(),a.crossVectors(o,Math.abs(o.y)>.92?n.set(1,0,0):e).normalize(),s.crossVectors(o,a).normalize();for(let V=0;V<=v;V++){const H=V/v*Math.PI*2,st=p(F)*(1+.07*Math.sin(V*2.1+F*1.7)+.05*Math.sin(V*5.3-F*2.9));t.v(l[F].x+(a.x*Math.cos(H)+s.x*Math.sin(H))*st,l[F].y+(a.y*Math.cos(H)+s.y*Math.sin(H))*st,l[F].z+(a.z*Math.cos(H)+s.z*Math.sin(H))*st,.86+.14*Math.sin(F*1.3+V),V/v,N,k(F),1)}}const S=v+1;for(let F=0;F<l.length-1;F++)for(let V=0;V<v;V++){const H=C+F*S+V;t.quad(H,H+1,H+1+S,H+S)}},h=(l,p,v,k)=>{a.crossVectors(p,e).normalize(),s.crossVectors(p,a).normalize();for(const[M,C]of[[a,.02],[s,.02]]){const N=t.v(l.x+M.x*C,l.y+M.y*C,l.z+M.z*C,.3,0,0,k,1),S=t.v(l.x-M.x*C,l.y-M.y*C,l.z-M.z*C,.3,0,0,k,1),F=t.v(l.x+p.x*v,l.y+p.y*v+v*.25,l.z+p.z*v,.3,0,0,k,1);t.tri(N,S,F)}},r=[.2,.3,.39,.43,.41,.33,.24,.17,.13],f=[-.3,0,.3,.62,.95,1.28,1.58,1.83,2.02],c=r.map((l,p)=>new m.Vector3(.06*Math.sin(p*.9),f[p],.05*Math.cos(p*1.1)));i(c,l=>r[l],10,l=>.1*l*l/64);for(let l=1;l<8;l++)for(let p=0;p<6;p++){const v=p*1.047+l*.55,k=new m.Vector3(Math.cos(v),.15,Math.sin(v)).normalize(),M=f[l]+.12*Math.sin(p*2.3),C=r[l]*.98;h(new m.Vector3(c[l].x+Math.cos(v)*C,M,c[l].z+Math.sin(v)*C),k,.1+.03*((l+p)%3),.1*l*l/64)}const d=(l,p,v,k,M,C,N)=>{const S=Math.cos(C),F=Math.sin(C),V=p.x*S+v.x*F,H=p.y*S+v.y*F,st=p.z*S+v.z*F,me=-p.x*F+v.x*S,We=-p.y*F+v.y*S,ee=-p.z*F+v.z*S,ie=(xe,Fe,Zo)=>{const U0=Zo+Fe*.22*xe*M;return t.v(l.x+V*xe*M+me*Fe*M+k.x*U0,l.y+H*xe*M+We*Fe*M+k.y*U0,l.z+st*xe*M+ee*Fe*M+k.z*U0,xe,Fe*1.2+.5,N,1,2)},o0=ie(.04,0,-.01),s0=ie(.5,-.3,.07*M),z0=ie(.5,.3,.07*M),a0=ie(.86,-.4,.05*M),we=ie(.86,.4,.05*M),k0=ie(1.06,.05,-.1*M);t.tri(o0,s0,z0),t.quad(s0,a0,we,z0),t.tri(a0,k0,we)};for(let l=0;l<5;l++){const p=l*1.31+.4,v=.26+.1*(l%2),k=.42+.2*(l%3),M=new m.Vector3(c[8].x*.5,1.86,c[8].z*.5),C=new m.Vector3(Math.cos(p)*v*1.8,1.9+k,Math.sin(p)*v*1.8),N=M.clone().lerp(C,.34).add(new m.Vector3(Math.cos(p)*.12,-.07,Math.sin(p)*.12)),S=M.clone().lerp(C,.7).add(new m.Vector3(Math.cos(p)*.06,0,Math.sin(p)*.06));i([M,N,S,C],F=>[.13,.115,.095,.07][F],6,F=>.3+F*.23,1.9);for(let F=0;F<3;F++){const V=p+F*2.1,H=N.clone().lerp(S,.3+.3*F);h(H,new m.Vector3(Math.cos(V),.3,Math.sin(V)).normalize(),.09,.6)}for(let F=0;F<2;F++){const V=C.clone().add(new m.Vector3(Math.cos(p+F*2.2)*.08*F,.07+.05*F,Math.sin(p+F*2.2)*.08*F)),H=.2-.04*F,st=new m.Vector3(Math.cos(p+F)*.55,1,Math.sin(p+F)*.55).normalize(),me=new m.Vector3().crossVectors(st,new m.Vector3(.3,.1,.9)).normalize(),We=new m.Vector3().crossVectors(st,me);for(let ee=0;ee<5;ee++)d(V,me,We,st,H,ee/5*6.2832+F*.6,0)}}const x=[];Bt.forEach((l,p)=>{const v=u.chance(p<Q0?.5:.62)?1:0;for(let k=0;k<v;k++){const M=l.perch((u.chance(.5)?1:-1)*u.range(1.7,4.2)),C=u.range(.5,1.25);x.push({x:M.x,y:M.y-.1,z:M.z,yaw:u.range(0,6.28),sx:C*u.range(.7,.95),sy:C*u.range(1,1.25),sz:C*u.range(.7,.95),seed:u()})}});{const l=Bt[Kt],p=l.perch(3.5),v=l.perch(-3.5),k=N=>(N.x-l.pos.x)*-J+(N.z-l.pos.z)*et,M=k(p)>k(v)?p:v;x.push({x:M.x,y:M.y-.1,z:M.z,yaw:1.1,sx:1.25,sy:1.6,sz:1.25,seed:.37});const C=Bt[Mt+5].perch(2.4);x.push({x:C.x,y:C.y-.1,z:C.z,yaw:4,sx:1.05,sy:1.3,sz:1.05,seed:.71})}for(let l=0;l<5;l++){const p=pe(6+l*7.5+u.range(-2,2)),v=u.range(.6,1.1);x.push({x:p.x-J*.55*(l%2?1:-1),y:p.y-3.2-u.range(0,1.5),z:p.z+et*.55*(l%2?1:-1),yaw:u.range(0,6.28),sx:v,sy:v,sz:v,seed:u()})}for(const l of Qe)x.push(l);x.length&&(Gt.plants=r0(t.build(),x),Gt.plantList=x,he+=t.tris*x.length)}const te=ht.map(t=>19*t.s/pt),w0=t=>{if(t<=ht[0].s)return te[0]*t/ht[0].s;for(let e=1;e<ht.length;e++)if(t<=ht[e].s)return U(te[e-1],te[e],(t-ht[e-1].s)/(ht[e].s-ht[e-1].s));return 19+(t-pt)/12},dt=[],Xe=t=>{const e={ev:[],script:t,seed:u.range(.05,1),period:0,home:null,idx:0};return dt.push(e),e},yo=t=>((t+Math.PI*3)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI,yt=(t,e,o,a,s={})=>{let n=a.x-o.x,i=a.z-o.z;const h=Math.hypot(n,i),r=o.distanceTo(a);h<.001?(n=0,i=1):(n/=h,i/=h);const f=s.dur??Math.min(1.5,Math.max(.45,r/12.5)),c=s.own?Lt:u,d=s.turn??(c()<.5?1:-1),x=Math.atan2(-n,-i)+(s.hop?0:d*(.35+.45*c())),l=s.faceA??x,v=s.faceA!==void 0||s.faceB!==void 0?l+yo((s.faceB??x+Math.PI)-l):l+Math.PI*d;return t.ev.push({t:e,dur:f,a:o,b:a,bx:s.bx||0,bz:s.bz||0,lean:s.lean||0,arc:s.arc??.3+r*.095,hop:!!s.hop,yawA:s.hop?s.yawHop:l,yawB:s.hop?s.yawHop:v,supA:s.hop?"hop":s.supA||"tip",supB:s.hop?"hop":s.supB||"tip"}),e+f},Je=[[0,0,68],[.2,14,55],[.5,34,34],[.8,56,16],[1,74,9],[1.27,100,5.6],[1.7,140,4.6]],Eo=t=>{for(let e=1;e<Je.length;e++)if(t<=Je[e][0]||e===Je.length-1){const o=Je[e-1],a=Je[e],s=Math.max(0,Math.min(1,(t-o[0])/(a[0]-o[0])));return[U(o[1],a[1],s),U(o[2],a[2],s)]}return[0,68]},x0=(t,e,o,a,s,n=!1)=>{let i=o,h=0,r;for(let f=0;f<26;f++){const c=.2+.06*(f%3),d=(ke()-.5)*1.2,x=ke()*3-1.6;let l=.6,p=null,v=0,k=0;for(let C=0;C<3;C++){const N=(Math.max(18.6,e)+l+c-19)/4.5;v=Math.min(1.3,Math.max(.05+.012*f,N+s/96));const[S,F]=Eo(v);k=Math.max(0,Math.min(z.length-1,Math.round(S/1.5+d))),p=De(k,a,Math.max(4.5,F-2.4+x),new m.Vector3,.05),l=Math.min(.9,Math.max(.42,i.distanceTo(p)/22))}const M=Math.atan2(z[k].nx*a,z[k].nz*a);if(e=yt(t,e,i,p,{dur:l,arc:.35+i.distanceTo(p)*.03,supA:h?"wall":"tip",faceA:h?r:void 0,supB:"wall",faceB:M,own:n})+c,i=p,a=-a,r=M,h++,v>=1.3)break}},bo=Math.max(18,Math.min(30,Math.round(b.troop??24)));{const t=Xe(!0),e=Math.atan2(J,-et);let o=pe(9.5),a=.1;const s=Math.max(3,Math.round((Ct-11)/1.3)),n=(te[0]-.55)/s,i=Math.min(s-2,b.leadHop??5);{const c=pe(9.5+(Ct-11)/s*i);for(let d=.1;d+.24<.1+n*i;d+=.28)yt(t,d,c,c,{dur:.2,arc:.3,hop:!0,yawHop:e,turn:1})}for(let c=1;c<=s;c++){const d=pe(9.5+(Ct-11)/s*c);c>i?yt(t,a,o,d,{dur:Math.min(.22,n*.8),arc:.24,hop:!0,yawHop:e}):u(),a+=n,o=d}yt(t,te[0]-.3,o,Yt[1],{dur:1.15});for(let c=1;c<Mt-1;c++)yt(t,te[c]-.5,Yt[c],Yt[c+1],{dur:1.1});yt(t,Math.min(te[Mt-1]-.5,15.9),Yt[Mt-1],Yt[Mt],{dur:1});let h=Yt[Mt],r="tip",f;ze.forEach((c,d)=>{const x=d===0?Math.min(.8,c.tArr-18.1):c.tArr-ze[d-1].tLeave,l=h.distanceTo(c.pos);yt(t,c.tArr-x,h,c.pos,{dur:x,arc:.3+l*.02,supA:r,faceA:f,supB:"root",faceB:c.face}),h=c.pos,r="root",f=c.face}),Ze&&ze.length&&yt(t,ze[ze.length-1].tLeave,h,Ze.pos,{dur:.8,arc:1.3,supA:"root",faceA:f,supB:"wall",faceB:Ze.face}),t.size=1.3}const Oe=Bt.slice(Q0).sort((t,e)=>t.s-e.s);Oe.forEach(t=>{t.used=!1});const v0=(t,e)=>{let o=null;for(const a of Oe){const s=a.s-t.s;s>5&&s<24&&(e===0||Math.sign(a.lat)===e)&&a.pos.distanceTo(t.pos)<22&&(!o||s<o.s-t.s)&&(o=a)}return o};{const t=(te[Kt]+te[Kt+1])/2,e=[[-.95,1.3,1.75],[-.8,1.3,1.6],[-.6,1.25,1.5]];Ie.forEach((o,a)=>{const s=Xe(!0);a===0&&(s.size=1.25);let n=yt(s,t+e[a][0],o[0],o[1],{dur:e[a][1],arc:e[a][2]}),i={pos:o[1],s:ht[Kt+1].s+je[a][0],lat:je[a][1]};for(let h=0;h<3;h++){const r=v0(i,Math.sign(je[a][1]))||v0(i,0);if(!r)break;n=yt(s,n+.75+.2*a,i.pos,r.pos),i=r}})}const Ro=Math.round(bo*.4);for(const t of[-1,1,-1])for(const e of Oe){if(dt.length>=2+Ro)break;if(e.used||Math.sign(e.lat)!==t||e.s<16||e.s>150)continue;e.used=!0;const o=Xe(!0);let a=e,s=Math.max(.3,w0(e.s-u.range(11,17)));for(let n=0;n<4;n++){const i=v0(a,t)||v0(a,0);if(!i)break;s=yt(o,s,a.pos,i.pos)+u.range(.7,1.3),a=i}if(!o.ev.length)o.home={p:e.pos.clone(),yaw:u.range(0,6.28),sup:"tip"};else if(a.s>150){const n=Math.max(s,15.2+u.range(0,2)),i=u.range(.16,.24);x0(o,n,a.pos,t,i*80)}}{const t=Oe.filter(e=>e.s>150&&!e.used);for(let e=0;e<4;e++){const o=Xe(!0),a=t[e%Math.max(1,t.length)],s=a?a.perch(e<t.length?0:2.6):Yt[Mt-1].clone(),n=14.7+e*.55+u.range(0,.3);x0(o,n,s,e%2?1:-1,9.5+2.6*e)}}const qo=ne.clone();let H0=-1;{const t=Xe(!0),e=-B*.6-X*.75,o=-L*.6-O*.75;t.home={p:new m.Vector3(ne.x,ne.y+.5,ne.z),yaw:Math.atan2(e,o),sup:"root"},t.size=1.7,t.hang=1,H0=dt.length-1}{let t=0;for(;dt.length<Math.min(bo,25)&&t++<200;){const e=u.pick(Oe);if(!e)break;const o=Oe.filter(i=>i!==e&&i.pos.distanceTo(e.pos)>6.5&&i.pos.distanceTo(e.pos)<19),a=e.perch(u.chance(.5)?-u.range(2.2,3.6):u.range(2.2,3.6)),s=o.length?u.pick(o).perch(u.range(-3.4,3.4)):e.perch(0);if(a.distanceTo(s)<3)continue;const n=Xe(!1);n.period=u.range(5,9.5),yt(n,.6,a,s),yt(n,.6+n.period*.5,s,a)}}for(let t=0;t<4&&t<dt.length;t++)dt[(t*5+3)%dt.length].infant=!0;const E0={loop:[],drop:[]},Pe=t=>{const e={ev:[],script:t,seed:.05+.95*Lt(),period:0,home:null,idx:0};return dt.push(e),e};D0.forEach(t=>{if(dt.length>=33)return;const e=Pe(!1);if(e.size=1.2+.1*Lt(),E0.loop.push(dt.length-1),!t.B){e.home={p:t.A.p.clone(),yaw:Wt(t.A),sup:"wall"};return}e.period=4.6+2.2*Lt();const o=t.A.p.distanceTo(t.B.p),a={dur:Math.min(1.15,Math.max(.7,o/8.5)),arc:.9+o*.06,supA:"wall",supB:"wall",own:!0,bx:t.bx,bz:t.bz};yt(e,.5,t.A.p,t.B.p,{...a,faceA:Wt(t.A),faceB:Wt(t.B)}),yt(e,.5+e.period*.5,t.B.p,t.A.p,{...a,faceA:Wt(t.B),faceB:Wt(t.A)})}),L0.forEach(t=>{const e=Pe(!0);e.size=1.3,E0.drop.push(dt.length-1);const o=1.25,a=t.A.p.distanceTo(t.B.p);let s=yt(e,w0(t.sCam)-o*(.4+.11*t.j),t.A.p,t.B.p,{dur:o,arc:.7+a*.05,bx:t.bx,bz:t.bz,supA:"wall",faceA:Wt(t.A),supB:"wall",faceB:Wt(t.B),own:!0}),n=t.B;if(t.C){qt.getPointAt(.34,A);const i=St(A.x,A.z).s,h=t.B.p.distanceTo(t.C.h.p),r=Math.min(1.45,Math.max(.9,h/13));s=yt(e,Math.max(s+.25,w0(i)-r*(.42+.17*t.j)),t.B.p,t.C.h.p,{dur:r,arc:.9+h*.05,bx:t.C.bx,bz:t.C.bz,supA:"wall",faceA:Wt(t.B),supB:"wall",faceB:Wt(t.C.h),own:!0}),n=t.C.h}x0(e,Math.max(s+.4,17.9+.4*t.j),n.p,Math.sign(n.lat)||1,11+3*t.j,!0)});const He=[[0,0]];p0.forEach((t,e)=>He.push([t/_t,te[e]])),He.push([m0.uBottom,23.5],[m0.uOut,m0.tOut],[.9,36.2],[1,40]);const y0=t=>{for(let e=1;e<He.length;e++)if(t<=He[e][0]){const o=He[e-1],a=He[e];return o[1]+(a[1]-o[1])*(t-o[0])/Math.max(1e-6,a[0]-o[0])}return 40},le=b.gazePoi||{at:[0,108,0],from:0,to:.3,weight:.55},Wo=b.lookAhead??26,b0=(t,e,o)=>{qt.getPointAt(t,e),qt.getPointAt(Math.min(1,t+Wo/_t),o),o.sub(e).normalize();const a=(le.to-le.from)*.3,s=_(le.from,le.from+a,t)*(1-_(le.to-a,le.to,t))*le.weight*_(0,.04,t);s>.001&&(A.set(le.at[0],le.at[1],le.at[2]).sub(e).normalize(),o.multiplyScalar(1-s).addScaledVector(A,s).normalize())},g0=[],Ee=new m.Vector3,Re=new m.Vector3,Go=(t,e,o,a)=>{b0(t,Ee,Re);const s=Ee.clone().addScaledVector(Re,e);s.y-=o;const n=St(s.x,s.z).s,i={bx:0,bz:0};let h=null,r=a;for(const x of Zt)if(!(Math.abs(x.s-n)>9||!ae(x,2.4)))for(const l of Zt){if(l.lat*x.lat>0||Math.abs(l.s-n)>9||l.s<x.s-1.5)continue;const p=x.p.distanceTo(l.p);if(p<6.5||p>15.5)continue;const v=.9+p*.06,k=Math.hypot((x.p.x+l.p.x)/2-s.x,((x.p.y+l.p.y)/2+v-s.y)*1.3,(x.p.z+l.p.z)/2-s.z);k<r&&ae(l,2.4)&&$e(x,l,i)&&(r=k,h={A:x,B:l,arc:v,d:p,err:k})}if(!h)return null;Jt.push(h.A,h.B);const f=Pe(!0),c=Math.min(1.3,Math.max(.85,h.d/10.5));f.size=1.3,g0.push(dt.length-1);const d=yt(f,y0(t)-c*.5,h.A.p,h.B.p,{dur:c,arc:h.arc,supA:"wall",faceA:Wt(h.A),supB:"wall",faceB:Wt(h.B),own:!0});return{a:f,tl:d,B:h.B,err:h.err}},R0=(t,e,o,a)=>{const s=-J*a,n=et*a;if(Me(t+s*1.2,o,e+n*1.2,.1))return-1;for(let i=1.45;i<=11;i+=.25)if(Me(t+s*i,o,e+n*i,0)){let h=i-.25,r=i;for(let f=0;f<5;f++){const c=(h+r)/2;Me(t+s*c,o,e+n*c,0)?r=c:h=c}return h}return-1},go=(t,e,o,a)=>{const s=R0(t,e,o,a);if(s<0)return null;const n=-J*a,i=et*a,h=R0(t+et*.5,e+J*.5,o,a),r=R0(t-et*.5,e-J*.5,o,a),f=new m.Vector3(-n,0,-i);if(h>0&&r>0&&Math.abs(h-r)<1.2){const x=et+n*(h-r),l=J+i*(h-r),p=Math.hypot(x,l);f.set(-l/p,0,x/p),f.x*n+f.z*i>0&&f.negate()}const c=new m.Vector3(t+n*(s-.05),o,e+i*(s-.05)),d=St(c.x,c.z);return{p:c,n:f,s:d.s,lat:d.lat,vis:1,dh:1,off:s}},Yo=(t,e,o)=>{b0(t,Ee,Re);const a=Ee.clone().addScaledVector(Re,e);a.y-=o;const s={bx:0,bz:0},n=Lt()<.5?1:-1;for(const[i,h]of[[-1.5,2.5],[-3,1],[0,4],[-.5,1.5],[-4,3]])for(const r of[n,-n])for(const f of[0,-.8,.8]){const c=go(a.x+et*i,a.z+J*i,a.y-1.2+f,r),d=c&&go(a.x+et*h,a.z+J*h,a.y-2+f,-r);if(!c||!d||!ae(c,2.2)||!ae(d,2.2))continue;const x=c.p.distanceTo(d.p);if(x<5.5||x>16||!$e(c,d,s))continue;const l=.9+x*.06,p=Math.min(.62,Math.max(.38,c.off/(c.off+d.off)));Jt.push(c,d);const v=Pe(!0),k=Math.min(1.3,Math.max(.85,x/10.5));v.size=1.3,g0.push(dt.length-1);const M=yt(v,y0(t)-k*p,c.p,d.p,{dur:k,arc:l,supA:"wall",faceA:Wt(c),supB:"wall",faceB:Wt(d),own:!0});return{a:v,tl:M,B:d,err:0}}return null},Mo=(t,e,o)=>dt.length<37?Go(t,e,o,1.6)||Yo(t,e,o):null;Mo(b.crossU?.[0]??.08,7,.3),await y.yield?.();{const t=Mo(b.crossU?.[1]??.34,6.8,.2);t&&t.B.s>150&&x0(t.a,Math.max(t.tl+.5,18.6),t.B.p,Math.sign(t.B.lat)||1,15,!0)}await y.yield?.();{const t=b.diveU||[.405,.43,.455,.48,.505],e=6.8,o=.5,a=.45,s=t.map(f=>(b0(f,Ee,Re),Ee.clone().addScaledVector(Re,e))),n=s.length,i=[],h=Lt()<.5?1:-1;for(let f=0;f<=n;f++){const c=f===0?s[0].clone().multiplyScalar(1.5).addScaledVector(s[1],-.5):f===n?s[n-1].clone().multiplyScalar(1.5).addScaledVector(s[n-2],-.5):s[f-1].clone().add(s[f]).multiplyScalar(.5),d=f%2?-h:h,x=f0(c.x,c.z),l=Math.max(4.5,c.y-a),p=Le[d>0?1:0][x*Nt.length*2+(Nt.length-2)*2];i.push({p:De(x,d,Math.min(l,p-1.2),new m.Vector3,.05),face:Math.atan2(z[x].nx*d,z[x].nz*d)})}const r=Pe(!0);r.size=1.3,g0.push(dt.length-1);for(let f=0;f<n;f++)yt(r,y0(t[f])-o*.5,i[f].p,i[f+1].p,{dur:o,arc:a,lean:.7,supA:"wall",faceA:i[f].face,supB:"wall",faceB:i[f+1].face,own:!0})}const q0=[];if(Ot){for(const[t,e,o]of[[-7,.8,1.4],[-4.9,Math.PI-.55,1.5],[3.3,Math.PI+.7,1.55],[5.3,-.7,1.4],[7.4,Math.PI-.3,1.35]]){const a=Pe(!0);a.home={p:Ot.crestPt(t),yaw:Ot.face+e,sup:"tip"},a.size=o,a.hang=1,q0.push(dt.length-1)}for(const[t,e,o]of[[-2.9,1.3,5.4]]){const a=Pe(!1),s=Ot.crestPt(t),n=Ot.crestPt(e);a.size=1.35,a.period=o,q0.push(dt.length-1),yt(a,.5,s,n,{own:!0,dur:.62,arc:1}),yt(a,.5+o*.5,n,s,{own:!0,dur:.62,arc:1})}}dt.forEach(t=>{t.asym=(t.seed*7919%1-.5)*.3}),await y.yield?.();const Ae=dt.length,Ce=new m.InstancedBufferGeometry;{const t=Ao();for(const e of Object.keys(t.attributes))Ce.setAttribute(e,t.attributes[e]);Ce.setIndex(t.index),he+=t.index.count/3*Ae}Ce.instanceCount=Ae;const Ut=new Float32Array(Ae*4),W0=[0,1,2,3].map(()=>new Float32Array(Ae*4)),zo=(t,e)=>{const o=new m.InstancedBufferAttribute(t,4);return o.setUsage(m.DynamicDrawUsage),Ce.setAttribute(e,o),o},_o=zo(Ut,"aPosYaw"),Uo=W0.map((t,e)=>zo(t,"aP"+(e+1)));{const t=new Float32Array(Ae*2);dt.forEach((e,o)=>{t[o*2]=e.size||1,t[o*2+1]=e.infant?-e.seed:e.seed}),Ce.setAttribute("aEx",new m.InstancedBufferAttribute(t,2))}const $o=new m.ShaderMaterial({uniforms:Ht,vertexShader:os,fragmentShader:ss,fog:!0,side:m.DoubleSide}),G0=new m.Mesh(Ce,$o);G0.frustumCulled=!1,it.add(G0),Gt.sifakas=G0;const j={x:0,y:0,z:0,yaw:0,crouch:0,air:0,pose:new Float32Array(16)},rt={x:0,y:0,z:0,yaw:0,sup:"tip"},re={x:0,y:0,z:0,yaw:0,sup:"tip"},Y0=(t,e,o,a,s)=>{const n=Be[o];return s.x=t.x-Math.sin(e)*n.back*a,s.y=t.y+n.up*a,s.z=t.z-Math.cos(e)*n.back*a,s.yaw=e,s.sup=o,s},t0=(t,e,o,a)=>e?Y0(t.b,t.yawB,t.supB,a,o):Y0(t.a,t.yawA,t.supA,a,o),ko=(t,e,o)=>{const a=(t.size||1)*Ht.uSize.value,s=j.pose;j.crouch=0,j.air=0;let n="tip",i=null,h=0;if(!t.ev.length)Y0(t.home.p,t.home.yaw,t.home.sup,a,rt),j.x=rt.x,j.y=rt.y,j.z=rt.z,j.yaw=rt.yaw,n=t.home.sup;else{const d=t.ev;let x=-1;for(let l=0;l<d.length&&d[l].t<=e;l++)x=l;if(x<0)t0(d[0],0,rt,a),j.x=rt.x,j.y=rt.y,j.z=rt.z,j.yaw=rt.yaw,j.crouch=_(d[0].t-.2,d[0].t,e),n=d[0].supA;else{const l=d[x],p=e-l.t;if(p<l.dur){const v=p/l.dur;t0(l,0,rt,a),t0(l,1,re,a),j.x=U(rt.x,re.x,v)+l.bx*4*v*(1-v),j.z=U(rt.z,re.z,v)+l.bz*4*v*(1-v),j.y=U(rt.y,re.y,v)+l.arc*4*v*(1-v),j.yaw=U(rt.yaw,re.yaw,_(.12,.62,v)),So(s,v,l.supA,l.supB,l.hop),l.lean&&(s[8]+=l.lean*_(.1,.35,v)*(1-_(.7,.95,v))),j.air=_(0,.15,v)*(1-_(.8,1,v))*(l.hop?.4:1),n=null}else{t0(l,1,rt,a);const v=d[x+1],k=p-l.dur;if(j.crouch=1-_(0,.28,k),n=l.supB,v){t0(v,0,re,a);const M=l.supB==="tip"&&v.supA==="tip",C=M?l.t+l.dur+.1:Math.max(l.t+l.dur,v.t-.55),N=M?Math.min(C+.42,Math.max(C+.02,v.t-.2)):Math.max(C+.02,v.t-.2),S=_(C,N,e);j.x=U(rt.x,re.x,S),j.z=U(rt.z,re.z,S),j.y=U(rt.y,re.y,S)+(l.hop?0:.1*4*S*(1-S)),j.yaw=rt.yaw+yo(re.yaw-rt.yaw)*S,j.crouch=Math.max(j.crouch,_(v.t-.2,v.t,e)),i=v.supA,h=S}else j.x=rt.x,j.y=rt.y,j.z=rt.z,j.yaw=rt.yaw}}}if(n){const d=Be[n].pose,x=i?Be[i].pose:d;for(let l=0;l<16;l++)s[l]=d[l]+(x[l]-d[l])*h}const r=j.crouch,f=1-j.air,c=t.seed;return s[0]+=.1*r,s[1]-=.14*r,s[4]+=.12*r+f*.04*Math.sin(o*1.3+c*40),s[8]+=.09*r*f,s[12]+=j.air*.2*Math.sin(o*9+c*9)+f*.07*Math.sin(o*1.3+c*40),s[13]+=j.air*.6*Math.sin(o*7+c*5)+f*.25*Math.sin(o*.9+c*20),s[14]=j.air*.2*Math.sin(o*8+c*3)+f*.07*Math.sin(o*1.1+c*13),t.hang&&(s[12]=.2*Math.sin(o*1.6+c*9)-.1,s[13]=.55+.35*Math.sin(o*1.6+c*9-1),s[14]=.1*Math.sin(o*.9+c*5)),s[15]=f*t.asym,a},Qo={portalSeat:{position:vt(0,4.5,0),facing:vt(-B,0,-L),radius:7},heading:vt(B,0,L),entry:{position:xt.clone(),direction:vt(et,0,J)},crest:[pe(0),pe(Ct)],landings:Yt.map(t=>t.clone()),companionTips:C0.map(t=>t.clone()),flyThrough:de,timing:m0,lip:bt.clone(),fissure:[Rt(3,68),Rt(74,9)],canyon:z.filter((t,e)=>e%8===0).map(t=>({x:t.x,z:t.z,halfWidth:t.hw})),towerTops:ro,towers:T0.map(t=>vt(t.x,t.h,t.z)),spires:V0.map(t=>vt(t.x,t.h,t.z)),bridge:{center:vt(B*1.5,28,L*1.5),underside:25.3,span:vt(X,0,O)},waitingSifaka:qo.clone(),waitingIndex:H0,arch:Ot?{s:Ot.s,center:Ot.center.clone(),across:Ot.across.clone(),along:Ot.along.clone(),halfWidth:Ot.halfWidth,crest:[-8,-6,-4,-2,0,2,4,6,8].map(t=>Ot.crestPt(t)),foot:[-8,-6,-4,-2,0,2,4,6,8].map(t=>Ot.footPt(t)),animals:q0}:null,shear:$0,streetAnimals:E0,crossers:g0,escortTips:Ie.map(t=>t.map(e=>e.clone())),cave:(()=>{const t=Math.round(jt/1.5),e=z[t],o=e.hw+2.3+lt*.5;return{s:jt,position:vt(e.x+e.nx*o,7.2,e.z+e.nz*o),normal:vt(-e.tx,0,-e.tz),right:vt(e.nx,0,e.nz),width:lt*.62,height:5.2}})(),sunDir:ut.clone(),viewpoints:[xt.clone(),Yt[2].clone().add(vt(0,16,0)),Rt(40,30),Rt(u0-60,4.5)]};let _0=-1;const Se=new m.Vector3,qe=new Float32Array(5),e0=new Int32Array(5),M0={object:it,radius:78,height:104,center:vt(0,66,0),fieldExtent:{center:vt(Z*.4,0,120),radiusX:400,radiusZ:525},anchors:Qo,uniforms:Ht,troopCount:Ae,triangles:Math.round(he),roles:{lead:0,escorts:[1,2,3],waiting:H0},parts:Gt,midFins:Ge,rockMaterial:se,landingTimes:te.slice(),wallPoint:Lo,wallAt:De,wallOff:Ye,notch:K,centreline:z,top:ft,makeFin(t,e){const o=new ve,a=Ve(o,t,u,e);return{geometry:o.build(),peak:a.peak,triangles:o.tris}},hidePlant(t){const e=Gt.plants;e&&(l0.makeScale(0,0,0),e.setMatrixAt(t,l0),e.instanceMatrix.needsUpdate=!0)},ground:!0,groundY:-2.5,setProgress(t){_0=Math.max(0,Math.min(1,t))},setShadow(t,e,o=1){t>=0&&t<3&&kt[t].set(e.x,e.y,e.z,o)},sifakaPosition(t,e=new m.Vector3){return e.set(Ut[t*4],Ut[t*4+1],Ut[t*4+2])},update(t,e,o){Ht.uTime.value=e,o&&(it.updateWorldMatrix(!0,!1),Se.setFromMatrixPosition(o.matrixWorld),it.worldToLocal(Se),Ht.uCam.value.copy(Se));const a=_0>=0?_0*40:e%26;qe.fill(1e9),e0.fill(-1);for(let s=0;s<Ae;s++){const n=dt[s],i=ko(n,n.script?a:(e+n.seed*7)%n.period,e),h=j.pose;Ut[s*4]=j.x,Ut[s*4+1]=j.y,Ut[s*4+2]=j.z,Ut[s*4+3]=j.yaw;const r=Se.x-j.x,f=Se.y-(j.y+.45*i),c=Se.z-j.z,d=r*r+(Se.y-j.y)**2+c*c,x=1-j.air,l=Math.cos(j.yaw),p=Math.sin(j.yaw),v=r*l-c*p,k=r*p+c*l,M=x*(1-_(900,3e3,d)),C=n.seed,N=.7*Math.sin(e*.7+C*50)*_(.3,.9,Math.sin(e*.23+C*31)*.5+.5);h[10]=U(N*x,Math.max(-1.5,Math.min(1.5,Math.atan2(v,k))),M),h[11]+=M*(Math.max(-.5,Math.min(.7,Math.atan2(f,Math.hypot(r,c)+.001)))-h[8]);for(let S=0;S<4;S++){const F=W0[S];F[s*4]=h[S*4],F[s*4+1]=h[S*4+1],F[s*4+2]=h[S*4+2],F[s*4+3]=h[S*4+3]}if(d<4900&&d<qe[4]){let S=4;for(;S>0&&qe[S-1]>d;)qe[S]=qe[S-1],e0[S]=e0[S-1],S--;qe[S]=d,e0[S]=s}}_o.needsUpdate=!0;for(const s of Uo)s.needsUpdate=!0;for(let s=0;s<5;s++){const n=e0[s],i=kt[3+s];n>=0?i.set(Ut[n*4],Ut[n*4+1]+.2,Ut[n*4+2],.42):i.set(0,0,0,0)}},dispose(){},_lab:{tOfU:y0,gazeAt:b0,troop:dt,evaluate:(t,e,o)=>{const a=ko(dt[t],e,o);return{...j,pose:Array.from(j.pose),size:a}},leadDive:ze,leadPerch:Ze,T55:d0,lensArc:I0,flyCurve:qt,flyLen:_t,pA:W0,posYaw:Ut,sGeo:Ce,holds:Zt,usedHolds:Jt,ledgePlants:Qe,streetPairs:D0,dropPlan:L0,insideBlade:Me,tCam:w0,lineInfo:St}};return M0.counts={heroBlades:Pt.map(t=>t.list.length),mid:Ge.length,far:h0.length,staticTris:G.tris},M0.buildMs=0-D,M0.update(0,0,null),M0}export{as as _sifakaLab,ns as buildHero};
