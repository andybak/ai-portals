import*as g from"three";import{mergeGeometries as Gt}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as Z,lerp as _,smoothstep as Y,makeRng as Jt,hashSeed as Xt}from"../kit/core.js";const Qt=["#EDF3F9","#8097B4","#1A1210","#FFF2C4","#FF9B30","#A6261A","#6E4B38"],Oe=Math.PI/180,et=1024,we=576,Fe=.33,tt=.15,Vt=1.9,Rt=.7,Ot=.92,Ht=.246,yt=Ot+1.3*Ht,re=5,Ko=12,ot=.7;function Zt(){const o=[];let t=0,a=0;const e=(h,l,d,y,w)=>{o.push({kind:h,d0:t,d1:t+l,f0:a,f1:a+d,W:y,H:w,slope:d/l}),t+=l,a+=d};e("firebox",36,0,16,26);for(let h=0;h<6;h++)e("chamber",40,12,35,40);e("great",80,0,50.75,58);for(const h of[20,24,28,32,36])e("chamber",44*Math.cos(h*Oe),44*Math.sin(h*Oe),35,44);const f=t,v=a,r=h=>{for(let l=o.length-1;l>=0;l--)if(h>=o[l].d0)return o[l];return o[0]},i=h=>{if(h<=0)return 0;if(h>=f)return v;const l=r(h);return _(l.f0,l.f1,(h-l.d0)/(l.d1-l.d0))},n=(h,l)=>{const d=Z((l-h.d0)/(h.d1-h.d0),0,1);return h.kind==="firebox"?1:.94+.06*Math.pow(Math.sin(Math.PI*d),.6)},c=[];for(let h=1;h<o.length;h++){const l=o[h],d=o[h-1];c.push({d:l.d0,f:l.f0,W:Math.max(l.W,d.W)*.97,H:Math.max(l.H,d.H)*.97+Math.max(0,d.slope-l.slope)*3,archW:h===12?24:h===11||h===3?14:9,archH:h===1?21:h===12?40:h>=9?34:26,up:l,down:d,index:h})}return{secs:o,end:f,fEnd:v,secAt:r,floorY:i,swell:n,walls:c}}function he(o,t,a,e){const f=Math.cos(a),v=Math.sin(a);return e.x=o*Math.sign(f)*Math.pow(Math.abs(f),ot),e.y=t*Math.pow(Math.max(v,0),ot),e}function Lo(o,t,a){const e=Math.pow(Z(Math.abs(a)/o,0,1),1/ot);return t*Math.pow(Math.sqrt(Math.max(0,1-e*e)),ot)}class He{constructor(){this.p=[],this.n=[],this.uv=[],this.m=[],this.a=[],this.c=[],this.i=[],this.count=0}v(t,a,e,f,v,r,i,n,c,h=0,l=1,d=1,y=1){return this.p.push(t,a,e),this.n.push(f,v,r),this.uv.push(i,n),this.m.push(c),this.a.push(h),this.c.push(l,d,y),this.count++}tri(t,a,e){this.i.push(t,a,e)}quad(t,a,e,f){this.i.push(t,a,e,t,e,f)}grid(t,a,e,f=!1){for(let v=0;v<a-1;v++)for(let r=0;r<e-1;r++){const i=t+v*e+r,n=i+1,c=i+e,h=c+1;f?this.i.push(i,c,n,n,c,h):this.i.push(i,n,c,n,h,c)}}steps(t,a){return[()=>t.setAttribute("position",new g.Float32BufferAttribute(this.p,3)),()=>t.setAttribute("normal",new g.Float32BufferAttribute(this.n,3)),()=>t.setAttribute("uv",new g.Float32BufferAttribute(this.uv,2)),()=>{t.setAttribute("aMat",new g.Float32BufferAttribute(this.m,1)),t.setAttribute("aAux",new g.Float32BufferAttribute(this.a,1))},()=>t.setAttribute("color",new g.Float32BufferAttribute(this.c,3)),()=>t.setIndex(this.i),()=>{a&&t.computeVertexNormals()},()=>{t.computeBoundingSphere(),t.computeBoundingBox()}]}build(t=!1){const a=new g.BufferGeometry;for(const e of this.steps(a,t))e();return a}async buildSlowly(t,a=!1){const e=new g.BufferGeometry;for(const f of this.steps(e,a))f(),await t.yield();return e}get triangles(){return this.i.length/3}}function G(o,t,a,e,f,v,r,i,n,c){const h=a[0]-t[0],l=a[1]-t[1],d=a[2]-t[2],y=f[0]-t[0],w=f[1]-t[1],p=f[2]-t[2];let T=l*p-d*w,k=d*y-h*p,S=h*w-l*y;const M=Math.hypot(T,k,S)||1;T/=M,k/=M,S/=M,c&&T*c[0]+k*c[1]+S*c[2]<0&&(T=-T,k=-k,S=-S);const W=Array.isArray(r)?r:[r,r,r,r],K=[t,a,e,f],F=[];for(let u=0;u<4;u++)F.push(o.v(K[u][0],K[u][1],K[u][2],T,k,S,n?n[u][0]:K[u][0],n?n[u][1]:Math.abs(k)>.7?-K[u][2]:K[u][1],v,W[u],i[0],i[1],i[2]));o.quad(F[0],F[1],F[2],F[3])}const De=`
uniform float uFront, uTime, uFlueD, uFlueR, uFire, uHaze, uInside, uLead;
uniform vec3 uCamL, uGold, uOrange, uEmber, uSkyCol, uSoot, uClay, uCool;
uniform vec4 uShaft[5];          // where the great chamber's three shafts of cold light land (xyz) and how wide (w)
float hash11(float n){ return fract(sin(n*12.9898)*43758.5453); }
float hash21(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p+34.345); return fract(p.x*p.y); }
vec2 hash22(vec2 p){ float n = hash21(p); return vec2(n, hash21(p+n*17.13+3.7)); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(hash21(i), hash21(i+vec2(1.,0.)), f.x), mix(hash21(i+vec2(0.,1.)), hash21(i+vec2(1.,1.)), f.x), f.y); }
float fbm2(vec2 p){ float a = .5, s = 0.; for (int i = 0; i < 4; i++){ s += a*vnoise(p); p = p*2.03+vec2(17.1, 9.2); a *= .5; } return s; }
float fbm3(vec2 p){ float a = .5, s = 0.; for (int i = 0; i < 3; i++){ s += a*vnoise(p); p = p*2.03+vec2(17.1, 9.2); a *= .5; } return s; }
// 1 behind the fire front (fired), 0 ahead of it (still cold), over a 30 m band
float heatAt(float d){ return smoothstep(uFront+8., uFront-22., d); }
float frontGlow(float d){ float x = (d-uFront+6.)/20.; return exp(-x*x); }
// the river on the crown over axis distance d: 1 where it runs overhead, 0 beyond its leading tips and at the kiln's two ends
// (the river's own gates; the front may or may not have come)
float riverOn(float d){ return (1.-smoothstep(uFront+uLead-22., uFront+uLead+28., d))*smoothstep(4., 13., d)*(1.-smoothstep(uFlueD-26., uFlueD-8., d)); }
// white-gold at the root and still gold in the top chambers, only a little redder
vec3 fireCol(float d){ return mix(uGold, uOrange, .42*smoothstep(60., 520., d)); }
// the cold light that comes down the great chamber's spy holes, where it lands
float shaftPool(vec3 P){
  float k = 0.;
  for (int i = 0; i < 5; i++){ vec3 r = P-uShaft[i].xyz; r.y *= .45; k += exp(-dot(r, r)/max(uShaft[i].w*uShaft[i].w, 1e-3)); }
  return k;
}
// analytic flame noise of the river on the crown: p = (across, along) metres; flows uphill (+along)
float riverNoise(vec2 p){
  vec2 q = vec2(p.x*.10, p.y*.017-uTime*.55);
  float a = fbm3(q*1.3+vec2(0., uTime*.12));
  return fbm3(q*2.4+vec2(a*1.9, -uTime*.3-a*.7));
}
float flueLight(float d){ return smoothstep(uFlueD-uFlueR, uFlueD-34., d); }
// light arriving at a surface with local normal N at axis distance d (no real lights in the kiln)
vec3 kilnLight(vec3 N, float d){
  float heat = heatAt(d), fg = frontGlow(d);
  float pre = (1.-heat)*exp(-max(d-uFront, 0.)/20.);
  vec3 fc = fireCol(d);
  vec3 warmc = mix(uOrange, fc, .55);
  // the river runs on overhead ahead of the front: what stands under it takes its light from above while it is still cold
  float under = max(1.-smoothstep(uFront+uLead-22., uFront+uLead+24., d)-heat, 0.);
  vec3 L = warmc*heat*(.55+.6*fg)*(.16+.84*max(dot(N, vec3(0., .86, .5)), 0.))*uFire;
  L += vec3(1., .60, .30)*pre*.55*(.12+.88*max(dot(N, vec3(0., .45, .89)), 0.));
  L += warmc*under*.42*(.10+.90*max(N.y, 0.))*uFire;
  vec3 emb = mix(uEmber, vec3(.40, .13, .07), .55);
  L += emb*(1.-heat)*(.18+.82*max(.3-N.y*.7, 0.))*.85;
  // ahead of the front what the embers do not reach is cool: a blue-violet half-light from above
  L += mix(vec3(.25, .225, .21), uCool, .6)*(1.-heat)*(.35+.65*max(N.y*.7+.3, 0.));
  float fl = flueLight(d);
  L += uSkyCol*fl*(.06+.94*max(N.y*.85-N.z*.15, 0.))*2.0*(1.-.7*heat);
  // behind it, whatever is turned away from the fire keeps a blue-violet shadow
  L += uCool*heat*.30*max(.2-dot(N, vec3(0., .86, .5))*.8, 0.);
  return L;
}
// warm haze that steps each chamber back; colour follows the fire where the fragment is
vec3 kilnHaze(vec3 col, float d, float dist){
  // the haze glows where the sight line runs through the fired part of the kiln: each arch further off is paler and
  // warmer than the one before, while the cold chambers beyond the front keep their dull red dark
  float dc = -uCamL.z, lo = min(dc, d), hi = max(dc, d);
  float hotK = clamp((uFront-4.-lo)/max(hi-lo, 1.), 0., 1.);
  float fg = frontGlow(d);
  vec3 hotc = mix(uOrange, uGold, .6)*(.125+.075*fg)*uFire;
  vec3 coldc = uEmber*.07+uCool*.085+uSkyCol*.07*flueLight(d);
  float hz = (1.-exp(-dist*mix(.0034, .0052, hotK)*uHaze))*mix(.8, 1., hotK);
  return mix(col, mix(coldc, hotc, hotK), hz);
}
`,Ke=`
#ifdef USE_FOG
  uniform vec3 fogColor;
  #ifdef FOG_EXP2
    uniform float fogDensity;
  #else
    uniform float fogNear; uniform float fogFar;
  #endif
#endif
vec3 sceneFog(vec3 col, vec3 P, float dist){
  #ifdef USE_FOG
    float outside = uCamL.z > 0. ? (P.z < 0. ? uCamL.z/max(uCamL.z-P.z, 1e-3) : 1.) : 0.;
    float fd = dist*outside;
    #ifdef FOG_EXP2
      float ff = 1.-exp(-fogDensity*fogDensity*fd*fd);
    #else
      float ff = smoothstep(fogNear, fogFar, fd);
    #endif
    col = mix(col, fogColor, clamp(ff, 0., 1.));
  #endif
  return col;
}
`,eo=`
attribute float aMat; attribute float aAux; attribute vec3 color;
varying vec3 vP; varying vec3 vN; varying vec2 vUv; varying float vMat; varying float vAux; varying vec3 vCol; varying float vDist;
void main(){
  vP = position; vN = normal; vUv = uv; vMat = aMat; vAux = aAux; vCol = color;
  vec4 mv = modelViewMatrix*vec4(position, 1.);
  vDist = length(mv.xyz);
  gl_Position = projectionMatrix*mv;
}`,to=`
${De}
${Ke}
varying vec3 vP; varying vec3 vN; varying vec2 vUv; varying float vMat; varying float vAux; varying vec3 vCol; varying float vDist;
uniform sampler2D tProf;
uniform vec4 uPool;                // the great jar's pool of firelight on the sand: centre x, centre z, radius, strength
// nearest cell: x = distance to its centre, yz = vector to the centre, w = cell id
vec4 cells(vec2 p){
  vec2 i = floor(p), f = fract(p); float best = 9.; vec2 bv = vec2(0.); float id = 0.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++){
    vec2 g = vec2(float(x), float(y)); vec2 o = hash22(i+g); vec2 r = g+o-f; float dd = dot(r, r);
    if (dd < best){ best = dd; bv = r; id = o.x+o.y*7.; }
  }
  return vec4(sqrt(best), bv, id);
}
void main(){
  float d = -vP.z;
  vec3 N = normalize(vN+vec3(0., 1e-5, 0.));
  vec3 Vv = uCamL-vP; float vl = max(length(Vv), 1e-3); vec3 V = Vv/vl;
  float heat = heatAt(d), fg = frontGlow(d);
  vec3 fc = fireCol(d);
  vec3 col;
  if (vMat < .5){
    // vault: fist-rolled clay lumps laid end-on, ash glaze toward the crown
    vec4 c = cells(vUv/1.55);
    float dome = 1.-smoothstep(.0, .6, c.x);
    vec3 t1 = normalize(cross(N, vec3(0., 0., 1.))+vec3(1e-4, 0., 0.)); vec3 t2 = cross(N, t1);
    vec3 Nb = normalize(N-(t1*c.y+t2*c.z)*1.25*(1.-dome*.5));
    float crev = smoothstep(.46, .68, c.x);
    float tone = .75+.5*fract(c.w*3.7);
    float n = fbm2(vUv*.13);
    float glaze = smoothstep(.25, .8, vAux+(n-.5)*.7);
    vec3 alb = uClay*tone*(.75+.5*n);
    alb = mix(alb, vec3(.105, .10, .042)*(.6+tone*.6), glaze*.85);
    float fbx = 1.-smoothstep(30., 44., d);
    alb *= (1.-mix(.5, .7, heat)*crev*(1.-.6*fbx))*mix(.6+.55*dome, .9+.12*dome, fbx);
    vec3 L = kilnLight(Nb, d);
    // ahead of the front the vault is a violet dusk in which a lump here and there still holds an ember: small
    // orange-gold sparks, breathing, never a grid of red dots on violet (which reads as magenta)
    float twk = .66+.46*sin(uTime*1.6+c.w*37.);
    float spark0 = smoothstep(.40, .06, c.x)*step(.62, fract(c.w*7.3)), spark = spark0*(1.-heat), flank = (1.-vAux)*(1.-vAux);
    col = alb*L*1.25+alb*mix(uEmber, vec3(.4, .13, .07), .4)*(1.-heat)*(.40+.26*dome)*1.05*twk;
    col += mix(uOrange, uGold, .22)*spark*(.10+.16*fract(c.w*13.7))*(.55+.45*tone)*twk;
    // hot clay glows of itself, most near the river on the crown
    // (on the flanks, where the violet shadow lies, only some lumps glow, as small orange-gold embers)
    col += mix(mix(uOrange, fc, .25), mix(uOrange, uGold, .3), spark0*flank)*heat*(.035+.2*vAux*vAux*vAux)*(1.-.75*crev)*(.6+.7*tone)*mix(.5+.5*dome, .22+.20*dome+2.6*spark0, flank)*uFire;
    // the river lights the vault it runs on, also where it runs on ahead of the front: the lumps beside and between
    // its licks stand in its light, strongest at the crown and gone by the springing, breathing with the fire
    float rvl = riverOn(d)*pow(smoothstep(.0, .80, vAux), 1.4)*(.62+.76*riverNoise(vec2(vP.x*.6, d+7.)));
    col += (alb*1.2+vec3(.085, .034, .012))*mix(uOrange, fc, .3)*rvl*(.84+.16*dome)*(1.-.2*crev)*.85*uFire;
    // glaze reflects the river
    vec3 R = reflect(-V, Nb);
    float sp = pow(max(dot(R, normalize(vec3(0., .9, .35))), 0.), 14.);
    col += fc*heat*glaze*sp*.9*(.3+riverNoise(vUv+R.xz*20.))*dome;
    // low on the flanks, behind the terraces, the vault falls into blue-violet shadow
    col += uCool*(1.-vAux)*(1.-vAux)*(.125+.085*tone)*(.60+.19*dome)*(1.-.8*spark0)*(1.-.45*heat);
    col += alb*mix(uOrange, fc, .4)*fbx*(.8+.2*dome)*(.45+1.1*n)*(.7+.5*fbm2(vUv*.045+7.))*1.15;
    col += alb*mix(uEmber, uOrange, .5)*smoothstep(uFlueD-34., uFlueD-2., d)*vAux*vAux*(.5+.5*dome)*1.7;
    col *= vCol;
  } else if (vMat < 1.5){
    // soot-black clay brick
    vec2 bu = vUv/vec2(4.4, 1.7); bu.x += .5*mod(floor(bu.y), 2.);
    vec2 bi = floor(bu), bf = fract(bu);
    float mort = smoothstep(.0, .035, bf.x)*smoothstep(1., .965, bf.x)*smoothstep(.0, .09, bf.y)*smoothstep(1., .91, bf.y);
    float tone = .6+.8*hash21(bi);
    float n = fbm2(vUv*.6);
    float n2 = fbm2(vUv*.085+3.);
    float pat = (.5+.5*n)*tone*(.4+.6*mort)*(.65+.7*n2);
    vec3 alb = uSoot*(.55+.5*n)*tone*(.45+.55*mort)*.36;
    vec3 Nb = normalize(N+vec3((bf.x-.5)*.25*(1.-mort), (bf.y-.5)*.5*(1.-mort), 0.));
    vec3 L = kilnLight(Nb, d);
    col = alb*L*vCol;
    // the soot soaks up the fire: a dull glow, strongest round the arch, wavering; never as bright as a jar
    float nearArch = smoothstep(0., .12, vAux), pre = exp(-max(d-uFront, 0.)/24.);
    float wav = .76+.2*sin(uTime*2.7+vUv.x*.21)*sin(uTime*1.9+vUv.y*.17+1.3)+.08*sin(uTime*6.1+vUv.x*.9+vUv.y*.6);
    wav += .2*sin(d*.105-uTime*2.3+vUv.y*.06);                 // the fire's breath going up the kiln, chamber by chamber
    // behind the front the walls are soot-black silhouettes against the fire: only a breath of the brickwork shows,
    // a little more close to (so a wall passed at ten metres is still brick, not a hole)
    float nearCam = smoothstep(72., 12., vDist), fbx = 1.-smoothstep(30., 44., d);
    nearCam = max(nearCam, .62*step(277., d)*step(d, 281.));          // the great chamber's lower wall is seen whole from across the chamber: its brickwork shows
    vec3 wl = mix(uOrange, fc, .35)*heat*(.8+1.1*fg+.95*nearArch)*(.05+.36*nearCam+1.1*fbx)+mix(uEmber, vec3(.85, .42, .22), .4)*(1.-heat)*(.82+.6*nearArch)*(1.-.2*pre);
    col += vec3(.078, .060, .052)*pat*wl*wav*uFire*(.6+.4*vCol)*1.45;
    // the river lights the wall it dives at: the face under the crown, where the fire turns down to the arch
    vec4 prw = textureLod(tProf, vec2(d/${we}., .5), 0.);
    float rwl = riverOn(d)*exp(-max(prw.r+${Fe}*d-vP.y, 0.)/8.)*exp(-vP.x*vP.x/600.)*(1.-fbx);
    // (a wash more than lit courses: brickwork standing bright behind the fire would show through it and thin it)
    col += vec3(.078, .060, .052)*mix(pat, .42, .75)*mix(uOrange, fc, .3)*rwl*wav*uFire*(.6+.4*vCol)*3.4;
    // away from the arch the brickwork goes to blue-violet: the corners the fire does not reach
    col += uCool*pat*(.105-.045*heat)*(1.-.75*nearArch)*(.5+.5*vCol)*(1.-fbx)+uSkyCol*flueLight(d)*pat*.045*(1.-heat);
    // the flue's throat: the back wall round it takes the light that stands in the shaft and lets it fall off into the vault
    float thr = step(uFlueD-1.5, d)*smoothstep(.0, .3, vAux);
    col += mix(uEmber, uOrange, .2)*pat*thr*thr*thr*.26*(.8+.2*sin(uTime*3.1+vUv.x*.3));
    // glassy soot catches the fire at a grazing angle
    float fr = pow(1.-clamp(dot(N, V), 0., 1.), 4.);
    col += fc*heat*fr*.05*mort+uEmber*(1.-heat)*(fr*.03+.012*tone*mort);
    // rim of the arch (vAux = 1 on the arch ring): baked edge glow where the fire licks through
    float rimg = pow(clamp(vAux, 0., 1.), 24.)*.75;      // clamped: multisampling extrapolates a varying past its range on thin triangles
    // and where the river dives at the arch ahead of the front, the head of the ring stands in its fire
    col += mix(uOrange, fc, .3)*riverOn(d)*(1.-heat)*rimg*exp(-max(prw.r+${Fe}*d-vP.y, 0.)/14.)*exp(-vP.x*vP.x/600.)*(.45+.55*n)*(.5+.5*mort)*1.5*uFire;
    col += (mix(uOrange, fc, .3)*heat*(.9+fg)+uEmber*(1.-heat)*.75+vec3(1., .42, .1)*(1.-heat)*exp(-max(d-uFront, 0.)/24.)*.35)*rimg*(.45+.55*n)*(.5+.5*mort)*.55;
    // the inner face of an arch (jambs and soffit) is the one stretch of wall the fire washes on its way through:
    // fire brick laid as voussoirs, lit by the flame that pours under it, its joints glowing. Passed at a few metres
    // it is warm brick with form, never a black shape at the edge of the frame
    float inner = (1.-smoothstep(.05, .3, abs(N.z)))*step(abs(vP.x), 14.6)*step(d, uFlueD-2.);
    if (inner > .001){
      vec2 vb = vUv/vec2(1.55, 3.2); vb.y += .5*mod(floor(vb.x), 2.);
      vec2 vi = floor(vb), vf = fract(vb);
      float vm = smoothstep(.0, .09, vf.x)*smoothstep(1., .91, vf.x)*smoothstep(.0, .045, vf.y)*smoothstep(1., .955, vf.y);
      float vt = .76+.48*hash21(vi+3.);
      vec3 fb = mix(vec3(.30, .125, .065), vec3(.42, .22, .10), hash21(vi+7.))*vt*(.30+.70*vm)*(.62+.76*n);
      fb = mix(fb, vec3(.05, .04, .045)*vt, step(.90, hash21(vi+11.))*.8*vm);          // a brick here and there burnt blue-black
      float sof = max(-N.y, 0.);
      vec3 fl2 = mix(uOrange, fc, .4)*heat*(.58+.70*sof+.22*fg)*(.55+.6*wav)+mix(uEmber, vec3(.85, .42, .22), .45)*(1.-heat)*(.34+.42*pre);
      float nearI = smoothstep(90., 22., vDist)*smoothstep(4., 10., d)*mix(.5, 1., smoothstep(4., 14., vDist));      // only near the eye: far off the flame walls stay a nest of soot-black arches, and the fire mouth stays a black arch full of fire; passed at arm's length a jamb is dim warm brick, never the brightest thing in the frame
      col += fb*fl2*inner*nearI*uFire*.88;
      col += mix(uEmber*.8, mix(uOrange, fc, .3), heat)*(1.-vm)*inner*nearI*(.035+.05*sof)*(.6+.4*sin(uTime*2.3+vi.x*1.9+vi.y*2.7));
    }
    col *= 1.-.5*step(uFlueD-1.5, d);                                   // the bell's wall is the sootiest in the kiln
  } else if (vMat < 2.5){
    // sand terraces and the aisle: warm brown and darker than the jars, lit in pools under the arches and at the ports
    float n = fbm2(vUv*.35), g = hash21(floor(vUv*9.));
    float n5 = fbm2(vUv*.07+vec2(5., 2.));
    float rip = .5+.5*sin(vUv.y*2.6+n*9.+vUv.x*.4);
    // raked here and there: broad furrows that wander and fade out where feet and setters have scuffed them
    float rake = (.5+.5*sin(vUv.x*2.3+sin(vUv.y*.13+n5*6.)*2.2+n*2.5))*smoothstep(.36, .62, n5);
    vec3 alb = vec3(.215, .150, .100)*(.58+.6*n)*(.92+.08*rip+.10*rake)*(.9+.2*g)*vCol;
    // drifts of grey wood ash blown against the terraces
    float ash = smoothstep(.50, .70, fbm2(vUv*.085+vec2(11., 3.))+.08*rake-.06);
    alb = mix(alb, vec3(.23, .21, .19)*(.7+.5*n), ash*.7);
    vec4 pc = cells(vUv*.62);
    float peb = step(.80, fract(pc.w*5.3))*smoothstep(.20, .12, pc.x);
    alb = mix(alb, uClay*(1.0+1.3*fract(pc.w*9.1)), peb*.85);
    alb *= 1.-.30*exp(-vP.x*vP.x/14.)*(.5+.5*vnoise(vec2(vUv.x*.7, vUv.y*.18)));
    float riser = 1.-smoothstep(.5, .8, N.y);
    alb *= 1.-riser*(.25+.3*smoothstep(.35, .6, fbm2(vec2(vUv.x*.25+vUv.y*.25, vP.y*1.6))));
    // the river overhead throws moving pools of light down the aisle; between them the floor falls into shadow
    float rv = riverNoise(vec2(vP.x*.8, d+18.));
    float pools = mix(1., .50+.80*smoothstep(.34, .70, rv), heat);
    // height above the aisle floor: the embers' red light lies low and falls off up the terraces
    vec4 prf = textureLod(tProf, vec2(d/${we}., .5), 0.);
    float low = exp(-max(vP.y-(prf.r+${Fe}*d-prf.g+.6)-1., 0.)/6.);
    vec3 L = kilnLight(N, d)*mix(1., .7, flueLight(d)*(1.-heat))*pools*mix(1., .9, heat);
    col = alb*L+alb*mix(uEmber, uOrange, .3)*(1.-heat)*.42*(.3+.7*low);
    // the firebox floor is a bed of coals under the logs, brightest toward the back
    float bedK = (1.-smoothstep(.25, .32, vCol.r))*smoothstep(1., 8., d)*step(d, 37.);
    float coal = smoothstep(.62, .18, pc.x)*(.35+.65*fract(pc.w*3.3))*(.7+.3*sin(uTime*1.7+pc.w*47.));
    col += mix(uEmber*.9, uOrange*1.05, coal*smoothstep(4., 14., d))*bedK*(.16+.62*coal)*(1.+1.3*uInside);
    // ahead of the front the floor is not black: drifts of live coals lie along the aisle and against the terraces,
    // and the cut faces of the terraces take their red light
    float eb = smoothstep(.46, .70, fbm2(vUv*.09+vec2(7., 1.)));
    float er = mix(.16, .60, fract(pc.w*9.1));                       // coals of every size, none of them round
    float ec = smoothstep(er, er*.25, pc.x+(vnoise(vUv*1.9+pc.w*5.)-.5)*.42)*(.35+.65*fract(pc.w*4.7))*(.7+.3*sin(uTime*1.3+pc.w*33.));
    col += mix(uEmber*1.5, uOrange*1.15, ec*.45)*eb*ec*(1.-heat)*(1.-riser)*.7*(.25+.75*low);
    // the cut faces: strata of rammed sand and clay, red in the embers' light at the foot, violet higher up
    float strata = .5+.5*sin(vP.y*4.2+n*6.+fbm2(vUv*.3+3.)*5.);
    float quiet = (1.-heat)*smoothstep(8., 40., d-uFront-uLead);
    col += vec3(.150, .030, .012)*riser*(1.-heat)*(.25+.75*n)*(.30+.70*strata)*(.4+eb)*max(low, .30*quiet)*1.25;
    col += uCool*riser*(1.-heat)*(1.-low)*(.03+.07*strata)*(.5+n);
    // behind the front the lanterns standing on a terrace light its cut face: rammed strata in warm brown, never a black box
    col += vec3(.215, .150, .100)*mix(uOrange, fc, .35)*riser*heat*(.62+.38*strata)*(.45+.9*n)*(.75+.5*n5)*1.15*uFire;
    col += alb*uSkyCol*quiet*flueLight(d)*(1.-riser)*1.5*(.6+.4*rake);
    col += vec3(.30, .062, .026)*riser*quiet*(.62+.38*strata)*(.35+.65*n)*(.55+.45*eb)*(.7+.5*n5)*.95;
    col += alb*mix(uEmber, uOrange, .3)*quiet*(1.-riser)*(.9+1.6*eb)*1.5;      // the quiet hall's terraces are seen from below: their cut faces stand red in the embers' light
    float sp5 = shaftPool(vP);
    col += alb*uSkyCol*sp5*4.5;
    // the great jar stands in its own light: a soft pool of gold on the sand round its setter, growing as the jar
    // becomes a lantern, wavering with the fire; darker at the setter's foot, and it gives way to the cold slants
    vec2 pj = vP.xz-uPool.xy; float pr = length(pj);
    float gp = exp(-pr*pr/(uPool.z*uPool.z))*(.30+.70*smoothstep(2.6, 7.5, pr))*uPool.w*(1.-riser);
    gp *= (.84+.16*sin(uTime*3.1+pj.x*.21)*sin(uTime*2.3+pj.y*.17))*(.75+.5*n)*(1.-.55*clamp(sp5, 0., 1.));
    col += alb*mix(uOrange, uGold, .5)*gp*2.5;
    // crumbs of ember fallen from the logs and the ports
    float crumb = step(.80, fract(pc.w*7.7))*smoothstep(.20, .05, pc.x);
    col += mix(uEmber*1.2, uOrange*1.6, heat)*crumb*(.55+.45*sin(uTime*2.3+pc.w*61.));
    // pools of light where the floor ports open (vAux baked near each wall's uphill face)
    float pool = vAux*(.6+.4*sin(uTime*7.+vUv.x*.9)*sin(uTime*4.3+vUv.x*.37));
    col += alb*pool*mix(mix(uEmber, uOrange, .35)*1.7, mix(uOrange, fc, .4)*2.6, heat);
  } else if (vMat < 3.5){
    // burning pine splits: char in long blocks along the grain, a few fissures glowing, end grain in ember rings
    float cn = fbm2(vUv*vec2(.5, 1.6));
    if (vAux > 1.5){
      float r = length(vUv), ring = .5+.5*sin(r*15.+cn*5.);
      float pulse = .72+.28*sin(uTime*1.9+vP.x*1.3+vP.z*.7);
      col = mix(uEmber*.45, mix(uOrange, uEmber, .3)*1.15, ring*(.3+.7*cn))*pulse*(1.-smoothstep(.72, 1.02, r))+vec3(.03, .012, .006);
    } else {
      vec4 c = cells(vUv*vec2(.30, 1.05));
      float crack = smoothstep(.50, .64, c.x)*(1.-smoothstep(.64, .80, c.x));
      float patch_ = smoothstep(.42, .70, fbm2(vUv*vec2(.12, .35)+3.));
      float pulse = .6+.4*sin(uTime*2.3+c.w*40.)*sin(uTime*1.1+vUv.x);
      vec3 alb = vec3(.040, .025, .018)*(.5+cn)*(.7+.6*fract(c.w*5.1));
      col = alb*mix(uOrange, uGold, .3)*1.7*(.35+.65*max(N.y, 0.))+uEmber*.08*cn;
      col += mix(uEmber*1.1, uOrange*1.15, pulse*vAux)*crack*patch_*(.35+.65*pulse);
      col += uEmber*.55*smoothstep(.3, -.6, N.y)*(.5+.5*cn);
    }
  } else if (vMat < 4.5){
    // fired clay: setter drums, wads, port frames
    float n = fbm2(vUv*.9);
    float ring = .9+.1*sin(vUv.y*9.+n*3.);
    vec3 alb = mix(uClay, vec3(.36, .26, .18), .55)*(.6+.7*n)*ring*vCol;
    col = alb*kilnLight(N, d)+uOrange*heat*alb*.3*uFire;
  } else if (vMat < 5.5){
    // flame port: an arched mouth that glows ember red before the front and white-gold behind it
    vec2 q = vUv*2.-1.;
    float arch = q.y < .2 ? abs(q.x) : length(vec2(q.x, (q.y-.2)/.8));
    float inside = smoothstep(.98, .72, arch);
    float core = smoothstep(.9, .1, arch)*(1.-.35*smoothstep(-1., 1., q.y));
    float fl = .7+.3*sin(uTime*9.+vAux*50.)*sin(uTime*5.7+vAux*31.);
    float pf = vnoise(vec2(q.x*2.2+vAux*9., q.y*2.6-uTime*3.2));
    core *= .45+.9*pf;
    vec3 hot = mix(uOrange*.5, mix(uOrange, fc, .5)*1.3, core*core)*fl*(1.-.5*smoothstep(-.2, 1., q.y));
    vec3 cold = mix(uEmber*.55, mix(uEmber, uOrange, .6)*1.25, core*core)*(.55+.45*fl);
    float pre = exp(-max(d-uFront, 0.)/24.);
    col = mix(mix(cold, hot*.5, pre*.5), hot, heat)*inside;
    col = max(col, uSoot*.03);
  } else {
    // flue: a brick chimney. The mortar of its joints glows where the heat stands in it, each brick's lower edge takes
    // the fire's light from below and its upper edge the sky's from above; frost at the rim. Heat makes the far courses swim
    float up = vAux, up2 = up*up;
    vec2 fuv = vUv+vec2(sin(vUv.y*.83-uTime*4.1+vUv.x*.31), sin(vUv.x*.57+vUv.y*.4-uTime*3.3))*.01*smoothstep(12., 60., vDist);
    // the two side walls are laid with their courses running up the shaft, as the walls of a passage are: seen from
    // inside, their long joints draw to the mouth; floor, roof and chamfers are laid in rings
    vec2 buv = abs(N.x) > .9 ? fuv.yx : fuv;
    vec2 bu = buv/vec2(2.3, .92); bu.x += .5*mod(floor(bu.y), 2.);
    vec2 bi = floor(bu), bf = fract(bu);
    float jw = 1.+1.6*smoothstep(18., 60., vDist);                     // joints widen with distance, so they never thin to a shimmer
    // seen along the shaft the upright joints of a wall line up into zigzags that outweigh the courses: they thin
    // out as the wall turns edge-on, and the courses (rings round the shaft) carry the brickwork
    float headK = .25+.75*smoothstep(.10, .55, abs(dot(N, V)));
    float mort = mix(1., smoothstep(.0, .05*jw, bf.x)*smoothstep(1., 1.-.05*jw, bf.x), headK)*smoothstep(.0, .12*jw, bf.y)*smoothstep(1., 1.-.12*jw, bf.y);
    mort = mix(mort, .82, smoothstep(40., 85., vDist));                // far courses run together
    float tone = mix(1., .78+.44*hash21(bi), headK);
    float n = fbm2(fuv*.4), n2 = fbm2(fuv*.07+5.);
    float streak = fbm2(vec2(fuv.x*.55, fuv.y*.035)+9.);               // soot runs down the shaft in long streaks
    // fire brick: plum and rust low in the shaft where the flame scours it clean, sooting over toward the mouth
    float bh = hash21(bi+3.);
    vec3 brick = mix(vec3(.27, .105, .06), vec3(.40, .185, .09), bh)*tone*(.62+.55*n)*(.7+.45*n2);
    brick = mix(brick, vec3(.07, .06, .075)*tone, step(.9, hash21(bi+11.))*.8);      // a brick here and there burnt blue-black
    float sootK = clamp(smoothstep(.16, .62, up+(streak-.5)*.95)*.9, 0., 1.);
    vec3 alb = mix(brick, mix(uSoot*.8, vec3(.17, .125, .115), .6)*tone*(.6+.6*n)*(.4+1.0*streak), sootK);
    float heatK = smoothstep(1.02, .0, up), warmK = heatK*heatK;       // the fire's light climbs the shaft and thins toward the mouth
    vec3 warm = mix(uOrange, uGold, .25);
    float fl = .8+.2*sin(uTime*5.3+vUv.y*.4)*sin(uTime*3.1+vUv.x*.3);
    float nearK = 1.-.6*smoothstep(46., 90., vDist);
    float lowE = smoothstep(.34, .10, bf.y)*mort*nearK, highE = smoothstep(.66, .90, bf.y)*mort*nearK;
    // the ware's stair: its risers stand upright (brick, as the walls are), its treads lie level
    float riserK = step(.9, N.z), treadK = step(.9, N.y);
    float under = max(-(N.y*.643-N.z*.766), 0.)*(1.-riserK);           // faces turned down the shaft: the soffits of the corbels and of the stair's nosings
    vec3 L = warm*(.34+.85*lowE+1.3*under+.55*riserK)*(.17+.83*warmK)*fl*mix(1., .42, smoothstep(30., 95., vDist))+uSkyCol*(.07+.85*up2*up)*(.45+1.5*highE)*(1.-.8*under)*(1.+.9*treadK)+uCool*.2+warm*.035;
    // where the ware stands: a soft shade on the tread under each piece of its rank and in the corner under the riser; under
    // each nosing the top of the riser is in its shade. The tread's colour carries its rank (r the count, g the metres from its
    // inner corner, b the pitch); a riser's carries the metres below its top in g
    float shade = 1.;
    if (treadK > .5){
      float pitch = vCol.b*8., nn = floor(vCol.r*40.+.5), wS = (pitch-.8)/.82, dz = vCol.g*16.-(.5*wS+.55);
      float dx = (fract(vP.x/pitch+.5*mod(nn, 2.))-.5)*pitch;
      shade = 1.-.55*exp(-(dx*dx+dz*dz)/(.30*wS*wS))*step(abs(vP.x), nn*.5*pitch);
      shade *= 1.-.35*exp(-vCol.g*16./.9);
    } else if (riserK > .5) shade = 1.-.5*exp(-vCol.g*16./.8);
    float fn = fbm2(vUv*.6);
    float frost = smoothstep(.83, 1.0, up+.16*(fn-.5)*2.+.08*(streak-.5))*(1.-under);
    alb = mix(alb, vec3(.60, .64, .74), frost*.8*(.45+.55*vnoise(vUv*2.3))*(.6+.4*mort));
    // runs of ash glass: where the fly ash has melted on the brick it has run down the shaft in long olive-brown tears
    float runN = fbm2(vec2(fuv.x*1.15+.55*sin(fuv.y*.31+n2*5.), fuv.y*.125)+21.);
    float runK = smoothstep(.58, .70, runN)*smoothstep(.16, .34, up)*(1.-smoothstep(.72, .9, up));
    alb = mix(alb, vec3(.12, .105, .045)*(.7+.6*n), runK*.85);
    col = alb*L*2.3*shade+warm*under*.34*tone*(.4+.6*n)*fl*max(warmK, .16)*(.3+.7*mort);
    // the glass catches both lights: the fire's from below along its lower edge, the sky's down its length
    float glint = smoothstep(.58, .61, runN)*smoothstep(.68, .62, runN)*(.35+.65*vnoise(vec2(fuv.x*.9, fuv.y*.16)+dot(V, vec3(2., 3., 2.5))));
    col += (warm*(1.-up)*.5+uSkyCol*(.2+up)*.24)*runK*(.05+.4*glint);
    // frost at the rim takes the sky's colour, and sparkles a little
    col += uSkyCol*frost*(.16+.10*fn)+uSkyCol*frost*step(.93, hash21(floor(vUv*5.)))*.35*(.5+.5*sin(uTime*3.+hash21(floor(vUv*5.)+3.)*40.));
    // the joints: orange-gold low in the shaft, cooling to ember red toward the mouth
    float jglow = (1.-mort)*(.55+.45*hash21(bi+7.))*(.7+.3*sin(uTime*2.1+bi.x*1.7+bi.y*2.3));
    // the heat stands in the joints in patches, and soot chokes them: by the middle of the shaft only a few seams still glow
    jglow *= max(1.-smoothstep(.30, .66, up+(streak-.5)*.9+(n2-.5)*.5), .62*smoothstep(.40, .54, n2)*(1.-smoothstep(.82, .94, up)))*smoothstep(.30, .52, n2+.55*(1.-up)-(streak-.5)*.4)*(1.-runK);
    jglow = mix(jglow, .15, smoothstep(34., 80., vDist));               // far off the joints melt into one glow: no shimmer of lines
    col += mix(uEmber*1.25, mix(uOrange, uGold, .2)*1.45, warmK*warmK)*jglow*(.34+.76*warmK)*(.6+.8*n2);
    float frf = pow(1.-clamp(dot(N, V), 0., 1.), 3.);
    col += (uSkyCol*up2*.5+warm*(1.-up)*.5)*frf*.14*(.4+.6*mort)*tone;
  }
  float hazeK = vMat > 5.5 ? (1.-vAux)*.6 : 1.;
  col = mix(col, kilnHaze(col, d, vDist), hazeK);
  col = sceneFog(col, vP, vDist);
  gl_FragColor = vec4(col, 1.);
}`;function oo(){return g.UniformsUtils.clone(g.UniformsLib.fog)}function wt(o,t,a=24){const e=t-o,f=[],v=Math.max(2,Math.round(a*.25)),r=a-2*v;for(let n=0;n<v;n++)f.push({x:o,y:e*n/v,nx:1,ny:0});for(let n=0;n<=r;n++){const c=Math.PI*n/r;f.push({x:o*Math.cos(c),y:e+o*Math.sin(c),nx:Math.cos(c),ny:Math.sin(c)})}for(let n=v-1;n>=0;n--)f.push({x:-o,y:e*n/v,nx:-1,ny:0});f[0].y=-5,f[f.length-1].y=-5;let i=0;f[0].s=0;for(let n=1;n<f.length;n++)i+=Math.hypot(f[n].x-f[n-1].x,f[n].y-f[n-1].y),f[n].s=i;return f}function be(o){const t=o.kind==="great",a=t?7:4,e=(o.d1-o.d0-re)/a;return t?{xs:[29,35,41],edges:[24.5,32,38,o.W],n:a,pitch:e,step:5.2}:{xs:[16.5,22.5,28.5],edges:[12.5,19.5,25.5,o.W],n:a,pitch:e,step:5.2}}function Le(o,t,a,e){const f=be(t),v=t.d0+re/2+(a+.5)*f.pitch;return o.floorY(v)+Math.abs(t.slope)*f.pitch*.5+.6+e*f.step}function bt(o,t,a,e){if(t.kind==="firebox")return o.floorY(t.d0);const f=be(t),v=Math.abs(e);return v<f.edges[0]?o.floorY(t.d0+re/2+(a+.5)*f.pitch)+.3:Le(o,t,a,v<f.edges[1]?0:v<f.edges[2]?1:2)}function ao(o,t,a,e){const f=a.kind==="great"?17:9,v=31,r=o.count,i={x:0,y:0},n={x:0,y:0};for(let c=0;c<f;c++){const h=c/(f-1),l=_(a.d0,a.d1,h),d=t.swell(a,l),y=t.floorY(l),w=l+.5,p=t.swell(a,w),T=t.floorY(Math.min(w,a.d1))+(w>a.d1?a.slope*(w-a.d1):0),k=a.kind==="firebox"?.9:.5+.5*Math.pow(Math.sin(Math.PI*h),.5);for(let S=0;S<v;S++){const M=Math.PI*S/(v-1);he(a.W*d,a.H*d,M,i),he(a.W*d,a.H*d,Z(M+.02,0,Math.PI),n);let W=n.x-i.x,K=n.y-i.y;he(a.W*d,a.H*d,Z(M-.02,0,Math.PI),n),W-=n.x-i.x,K-=n.y-i.y,he(a.W*p,a.H*p,M,n);const F=n.x-i.x,u=n.y+T-i.y-y,P=-.5;let m=K*P-0*u,x=0*F-W*P,A=W*u-K*F;m*-i.x+x*(a.H*.3-i.y)<0&&(m=-m,x=-x,A=-A);const N=Math.hypot(m,x,A)||1,R=k*(.86+.28*(.5+.5*e.n3(i.x*.05,(i.y+y)*.05,l*.05)));o.v(i.x,i.y+y,-l,m/N,x/N,A/N,(M-Math.PI/2)*a.W*.95,l,0,Math.pow(Math.sin(M),2),R,R,R)}}o.grid(r,f,v)}function Kt(o,t,a,e,f=[1,-1]){const r=wt(a.archW,a.archH,28),i={x:0,y:0},n=a.f,c=2,h=.7;for(const w of f){const p=-a.d+w*re/2,T=o.count;for(let F=0;F<=30;F++){const u=Z(F-1,0,28),P=r[u],m=F===0||F===30?-6:0,x=Math.PI*u/28;he(a.W,a.H,x,i);const A=P.x+P.nx*(c+.5),N=P.y+P.ny*(c+.5);o.v(A,n+N+m,p,0,0,w,A,n+N+m,1,.12),o.v(i.x,n+i.y+m,p,0,0,w,i.x,n+i.y+m,1,0)}for(let F=0;F<30;F++){const u=T+F*2;w>0?o.quad(u,u+1,u+3,u+2):o.quad(u,u+2,u+3,u+1)}const k=o.count,S=p+w*h;for(let F=0;F<=28;F++){const u=r[F];o.v(u.x,n+u.y+0,S,0,0,w,u.s,0,1,1),o.v(u.x+u.nx*c,n+u.y+u.ny*c,S,0,0,w,u.s,c,1,.35),o.v(u.x+u.nx*c,n+u.y+u.ny*c,S,u.nx*.7,u.ny*.7,w*.7,u.s,c,1,.3),o.v(u.x+u.nx*(c+.5),n+u.y+u.ny*(c+.5),p,u.nx*.7,u.ny*.7,w*.7,u.s,c+.9,1,.12)}for(let F=0;F<28;F++){const u=k+F*4,P=u+4;w>0?(o.quad(u,u+1,P+1,P),o.quad(u+2,u+3,P+3,P+2)):(o.quad(u,P,P+1,u+1),o.quad(u+2,P+2,P+3,u+3))}if(!e)continue;const M=w>0?a.down:a.up,W=M.kind==="firebox"?null:be(M),K=w>0&&W?W.n-1:0;for(const F of[1,-1])for(let u=0;u<7;u++){const P=F*(13.2+2.9*u);if(Math.abs(P)+1.4>M.W*.93||Math.abs(P)-1.25<a.archW+2.6)continue;let m=w>0?bt(t,a.up,0,P):bt(t,M,K,P);if(M.kind==="firebox"){if(u>0)continue;m=n+.4}const x=1.25,A=3.7,N=p+w*.08,R=e.length*.37,O=[P-x,m,N],B=[P+x,m,N],V=[P+x,m+A,N],E=[P-x,m+A,N];w>0?G(o,O,B,V,E,5,R,[1,1,1],[[0,0],[1,0],[1,1],[0,1]]):(G(o,B,O,E,V,5,R,[1,1,1],[[1,0],[0,0],[0,1],[1,1]]),e.push({x:P,y:m,d:a.d+re/2,wall:a.index}))}}const l=o.count,d=-a.d+re/2+h,y=-a.d-re/2-h;for(let w=0;w<=28;w++){const p=r[w];o.v(p.x,n+p.y,d,-p.nx,-p.ny,0,p.s,0,1,1),o.v(p.x,n+p.y,(d+y)/2,-p.nx,-p.ny,0,p.s,(d-y)/2,1,.55),o.v(p.x,n+p.y,y,-p.nx,-p.ny,0,p.s,d-y,1,.25)}o.grid(l,29,3)}function so(o,t,a,e){if(a.kind==="firebox"){const l=o.count;for(let d=0;d<=4;d++)for(let y=0;y<=4;y++){const w=_(-a.W,a.W,y/4),p=_(-1.5,a.d1,d/4);o.v(w,0,-p,0,1,0,w,p,2,.5,.2,.15,.12)}o.grid(l,5,5);return}const f=be(a),v=f.edges[0]+.6,r=a.kind==="great"?25:13,i=o.count,n=a.slope,c=Math.hypot(1,n),h=t.walls.find(l=>l.up===a);for(let l=0;l<r;l++)for(let d=0;d<7;d++){const y=_(-v,v,d/6),w=_(a.d0,a.d1,l/(r-1)),p=.86+.2*e(),T=Math.min(w-a.d0,a.d1-w),k=.8*Math.exp(-T*T/42)*Math.exp(-y*y/150);o.v(y,t.floorY(w),-w,0,1/c,n/c,y,w,2,k,p,p,p)}o.grid(i,r,7);for(const l of[1,-1])for(let d=0;d<f.n;d++)for(let y=0;y<3;y++){const w=d===0&&!!h&&h.archW>f.edges[0],p=f.edges[y]*l,T=(f.edges[y+1]+1)*l,k=a.d0+re/2+d*f.pitch-(d===0?1:0)-(w?re-1.2:0),S=a.d0+re/2+(d+1)*f.pitch+(d===f.n-1?1:0),M=Le(t,a,d,y),W=.82+.26*e(),K=[W,W*(.96+.06*e()),W*(.92+.1*e())],F=d===0?.85:0,u=d===0?.12:0,P=[p,M,-k],m=[T,M,-k],x=[T,M,-S],A=[p,M,-S];l>0?G(o,P,m,x,A,2,[F,F,u,u],K):G(o,m,P,A,x,2,[F,F,u,u],K);const N=y===0?Math.min(t.floorY(k),t.floorY(S))-.6:Le(t,a,d,y-1),R=p-l*(y===0?.9:.5),O=[K[0]*.8,K[1]*.8,K[2]*.8],B=[R,N,-k],V=[R,N,-S];l>0?G(o,B,P,A,V,2,[F*.6,F,u,u*.6],O,[[p,k],[p+3,k],[p+3,S],[p,S]]):G(o,P,B,V,A,2,[F,F*.6,u*.6,u],O,[[p+3,k],[p,k],[p,S],[p+3,S]]);for(const E of[k,S])G(o,[R,N,-E],[p,M,-E],[p,N,-E],[p,N,-E],2,0,O,[[R,N],[p,M],[p,N],[p,N]],[0,0,E===k?1:-1]);if(d>0||w){const E=w?Le(t,h.down,be(h.down).n-1,y):Le(t,a,d-1,y),q=[p,E,-k+.5],J=[T,E,-k+.5];l>0?G(o,q,J,m,P,2,0,O,[[p,k],[T,k],[T,k+3],[p,k+3]]):G(o,J,q,P,m,2,0,O,[[T,k],[p,k],[p,k+3],[T,k+3]]),G(o,[p,E,-k+.5],[p,M,-k],[p,E,-k],[p,E,-k],2,0,O,[[k,E],[k+.5,M],[k+.5,E],[k+.5,E]],[-l,0,0])}}}function no(o,t,a,e){if(a.kind==="firebox")return;const f=a.kind==="great",v=f?9:4,r=f?21:10,i=(n,c,h,l,d,y,w,p)=>{const k=Math.cos(w),S=Math.sin(w),M=Math.cos(p),W=Math.sin(p),K=[y,y*.95,y*.9],F=(u,P,m)=>{const x=Math.cos(u)*P,A=Math.sin(u)*P,N=x*k-m*S,R=x*S+m*k;return[n+N*M+A*W,c+R,h-N*W+A*M]};for(let u=0;u<10;u++){const P=u/10*Math.PI*2,m=(u+1)/10*Math.PI*2,x=(P+m)/2,A=[F(x,1,0)[0]-n,.2,F(x,1,0)[2]-h];G(o,F(P,l*1.03,0),F(m,l*1.03,0),F(m,l,d),F(P,l,d),4,0,K,[[P*l,c],[m*l,c],[m*l,c+d],[P*l,c+d]],A),G(o,F(P,l,d),F(m,l,d),F(m,l*.45,d*.86),F(P,l*.45,d*.86),4,0,[K[0]*.8,K[1]*.8,K[2]*.8],[[P*l,0],[m*l,0],[m*l*.45,l*.55],[P*l*.45,l*.55]],[0,1,0]),G(o,F(P,l*.45,d*.86),F(m,l*.45,d*.86),F(0,0,d*.86),F(0,0,d*.86),4,0,[K[0]*.62,K[1]*.62,K[2]*.62],[[P,0],[m,0],[x,1],[x,1]],[0,1,0])}};for(let n=0;n<v;n++){const c=n%2?1:-1,h=c*e.range(4.5,r),l=_(a.d0+6,a.d1-6,(n+e.range(.15,.85))/v),d=t.floorY(l)-.25;if(f&&Math.hypot(h,l-(a.d0+42))<10)continue;const y=e(),w=e.range(1.5,2.3);if(y<.6){const k=e.int(2,4);let S=d;for(let M=0;M<k;M++){const W=e.range(.5,.75);i(h+e.range(-.25,.25),S,-l+e.range(-.25,.25),w*e.range(.88,1),W,e.range(.75,1.15),0,e()*6.28),S+=W*.9}}else if(y<.8)i(h,d,-l,w,.6,e.range(.8,1.1),0,0),i(h+c*w*.9,d+.25,-l+e.range(-.4,.4),w*.9,.55,e.range(.8,1.1),.5*-c,e.range(-.4,.4));else for(let k=0;k<6;k++)i(h+e.range(-2.4,2.4),d-.1,-l+e.range(-2.4,2.4),e.range(.4,.75),e.range(.4,.6),e.range(.8,1.25),e.range(-.3,.3),e()*6.28);const p=e.int(3,7),T=h-c*e.range(2.5,4.5);for(let k=0;k<p;k++){const S=T+e.range(-2,2),M=-l+e.range(-3,3),W=e()*6.28,K=e.range(.5,1.3),F=e.range(.25,.6),u=e.range(.15,.5),P=e.range(1,1.6),m=Math.cos(W)*K,x=Math.sin(W)*K,A=-Math.sin(W)*F,N=Math.cos(W)*F,R=t.floorY(-M)+.06;G(o,[S-m,R,M-x],[S+m,R,M+x],[S+m*.6+A,R+u,M+x*.6+N],[S-m*.6+A,R+u,M-x*.6+N],4,0,[P,P*.97,P*.9],[[0,0],[1,0],[1,1],[0,1]],[0,1,0])}}}function ro(o){const t=40*Oe,a=new g.Vector3(0,o.fEnd+16,-o.end),e=new g.Vector3(0,Math.sin(t),-Math.cos(t)),f=new g.Vector3(0,Math.cos(t),Math.sin(t));return{T:a,axis:e,v:f,half:r=>15-6*Z((r-13)/39,0,1),length:64,tanA:Math.tan(t)}}function Lt(o){const t=[],a=new g.Vector3;for(let e=-2;e<=47;){const f=o.half(e),v=Z(.3*f,2.7,4.5);a.copy(o.T).addScaledVector(o.axis,e).addScaledVector(o.v,-f),t.push({s:e,h:f,S:v,y:a.y,z:a.z}),e+=1.45*v+1}return t}function io(o,t,a){{const x=[[17.5,-17.5],[17.5,17.5],[-17.5,17.5],[-17.5,-17.5]],A=new g.Vector3,N=(R,O)=>(A.copy(a.T).addScaledVector(a.axis,O).addScaledVector(a.v,R[1]),[A.x+R[0],A.y,A.z]);for(let R=0;R<4;R++){const O=x[R],B=x[(R+1)%4],V=O[1]*a.tanA+.25,E=B[1]*a.tanA+.25;G(o,N(O,V),N(B,E),N(B,E+16),N(O,V+16),1,0,[.5,.5,.5])}}const e=t.walls[t.walls.length-1],f=t.secs[t.secs.length-1],v=f.W*.97,r=f.H*.97,i=t.fEnd,n=-t.end+.2,c=16+15/Math.cos(40*Oe),h=24,l={x:0,y:0},d=o.count;for(let m=0;m<=h;m++){const x=m/h;let A,N;x<1/3?(A=15,N=_(-8,c,x*3)):x<2/3?(A=_(15,-15,x*3-1),N=c):(A=-15,N=_(c,-8,x*3-2)),he(v,r,Math.PI*x,l);const R=m===0||m===h?-8:l.y;o.v(A,i+N,n,0,0,1,A,i+N,1,.3),o.v(l.x,i+R,n,0,0,1,l.x,i+R,1,0)}for(let m=0;m<h;m++){const x=d+m*2;o.quad(x,x+1,x+3,x+2)}const y=14,w=1.6,p=new g.Vector3,T=(m,x)=>[[x,-x+w],[x,x-w],[x-w,x],[-x+w,x],[-x,x-w],[-x,-x+w],[-x+w,-x],[x-w,-x]][m%8];for(let m=0;m<8;m++){const x=o.count,A=T(m,1),N=T(m+1,1);let R=-(N[1]-A[1]),O=N[0]-A[0];R*A[0]+O*A[1]>0&&(R=-R,O=-O);const B=Math.hypot(R,O),V=new g.Vector3(R/B,0,0).addScaledVector(a.v,O/B);for(let E=0;E<=y;E++)for(let q=0;q<2;q++){const J=T(m+q,15)[1],de=J*a.tanA,X=_(de,a.length,Math.pow(E/y,1.25)),Q=a.half(X),ue=T(m+q,Q);p.copy(a.T).addScaledVector(a.axis,X).addScaledVector(a.v,ue[1]),p.x+=ue[0],o.v(p.x,p.y,p.z,V.x,V.y,V.z,m*7.5+(m%2?q*w*1.4:15+(q?1:-1)*(Q-w)),X,6,Z(X/a.length,0,1))}o.grid(x,y+1,2)}const k=[[54.5,8.75],[57.2,8.3],[59.9,7.9],[62.4,7.5]],S=(m,x,A)=>(p.copy(a.T).addScaledVector(a.axis,A).addScaledVector(a.v,x),[p.x+m,p.y,p.z]),M=[-a.axis.x,-a.axis.y,-a.axis.z];let W=11.5;k.forEach(([m,x],A)=>{const N=A<k.length-1?k[A+1][0]:a.length+1.5,R=V=>[[V,-V],[V,V],[-V,V],[-V,-V]],O=R(W),B=R(x);for(let V=0;V<4;V++){const E=(V+1)%4,q=Z(m/a.length,0,1),J=Z(N/a.length,0,1);G(o,S(O[V][0],O[V][1],m),S(O[E][0],O[E][1],m),S(B[E][0],B[E][1],m),S(B[V][0],B[V][1],m),6,q,[1,1,1],[[V*20,0],[V*20+2*W,0],[V*20+2*W,W-x],[V*20,W-x]],M);const de=(B[V][0]+B[E][0])/2,X=(B[V][1]+B[E][1])/2,Q=[-de,-X*a.v.y,-X*a.v.z];G(o,S(B[V][0],B[V][1],m),S(B[E][0],B[E][1],m),S(B[E][0],B[E][1],N),S(B[V][0],B[V][1],N),6,[q,q,J,J],[1,1,1],[[V*20+A*2.2,m],[V*20+A*2.2+2*x,m],[V*20+A*2.2+2*x,N],[V*20+A*2.2,N]],Q)}W=x});const K=Lt(a),F=(m,x)=>(m-a.T.y)*a.axis.y+(x-a.T.z)*a.axis.z,u=(m,x)=>a.half(F(m,x)),P=(m,x)=>Z(F(m,x)/a.length,0,1);K.forEach((m,x)=>{const A=x?K[x-1].z:-t.end-.3,N=x?K[x-1].y:m.y-7,R=m.h,O=u(m.y,A),B=u(N,A),V=P(m.y,m.z),E=P(m.y,A),q=P(N,A),J=.82*m.S+.8,de=Math.floor(2*(m.h-.5*m.S-.9)/J)+1,X=.3,Q=.55,ue=A+X-m.z,ke=(Ye,Ae,Ne,xe)=>{const ze=Ye.map((ve,ne)=>o.v(ve[0],ve[1],ve[2],Ae[0],Ae[1],Ae[2],ve[0],Math.abs(Ae[1])>.7?-ve[2]:ve[1],6,Ne[ne],xe[ne][0],xe[ne][1],xe[ne][2]));o.quad(ze[0],ze[1],ze[2],ze[3])},Me=de/40,Pe=J/8,ie=[0,1,0];ke([[-O,m.y,A+X],[O,m.y,A+X],[R,m.y,m.z],[-R,m.y,m.z]],[0,1,0],[E,E,V,V],[[Me,ue/16,Pe],[Me,ue/16,Pe],[Me,0,Pe],[Me,0,Pe]]),ke([[-O,m.y-Q,A+X],[O,m.y-Q,A+X],[O,m.y,A+X],[-O,m.y,A+X]],[0,0,1],[E,E,E,E],[ie,ie,ie,ie]),ke([[-O,m.y-Q,A],[O,m.y-Q,A],[O,m.y-Q,A+X],[-O,m.y-Q,A+X]],[0,-1,0],[E,E,E,E],[ie,ie,ie,ie]),ke([[-B,N,A],[B,N,A],[O,m.y-Q,A],[-O,m.y-Q,A]],[0,0,1],[q,q,E,E],[[0,(m.y-Q-N)/16,0],[0,(m.y-Q-N)/16,0],[0,0,0],[0,0,0]])})}function lo(o,t){const a=[];for(let e=0;e<7;e++)a.push({x:-11.5+e*3.8+t.range(-.5,.5),y:0,d:t.range(11,24),yaw:t.range(-.16,.16),len:t.range(12.5,14.5),r:t.range(1.2,1.6)});for(let e=0;e<5;e++)a.push({x:t.range(-5,5),y:e===0?1.5:.25,d:6+e*6.2+t.range(-1,1),yaw:Math.PI/2+t.range(-.5,.5),len:t.range(12,14),r:t.range(1.1,1.4)});for(let e=0;e<2;e++)a.push({x:t.range(-6,6),y:2.7,d:t.range(5.5,9.5),yaw:t.range(-.5,.5),len:t.range(11,13),r:t.range(1,1.2)});for(let e=0;e<4;e++)a.push({x:-6.3+e*4.2+t.range(-.8,.8),y:0,d:t.range(8.2,9.6),yaw:t.range(-.3,.3),len:t.range(9,11.5),r:t.range(1.25,1.65)});for(let e=0;e<3;e++)a.push({x:t.range(-3.5,3.5),y:1.5+e*.5,d:4.2+e*2.1+t.range(-.4,.4),yaw:Math.PI/2+t.range(.25,.75)*(e%2?1:-1),len:t.range(9,12),r:t.range(1.1,1.45)});for(const e of a){const f=t.range(-.5,.5),v=Math.cos(e.yaw),r=Math.sin(e.yaw),i=3,n=[];n.push([0,0,-.7,-.7]);for(let l=0;l<=3;l++){const d=f+l/3*Math.PI*.6+.3;n.push([Math.cos(d)*e.r,Math.sin(d)*e.r,Math.cos(d),Math.sin(d)])}const c=o.count,h=n.length+1;for(let l=0;l<=i;l++){const d=l/i,y=(d-.5)*e.len,w=Math.sin(d*Math.PI)*t.range(-.25,.25),p=.25+.5*Math.abs(d-.5)*2*t();for(let T=0;T<h;T++){const k=n[T%n.length],S=k[0]-e.r*.4+w,M=Math.max(k[1],-.2)+.2;o.v(e.x+S*v+y*r,e.y+M,-(e.d+y*v-S*r),k[2]*v,k[3],k[2]*r,y+e.x*3,T*e.r*.9+e.d,3,p)}}o.grid(c,i+1,h);for(const l of[0,i]){const d=c+l*h,y=l===0?1:-1,w=o.count;for(let p=0;p<n.length;p++){const T=d+p;o.v(o.p[T*3],o.p[T*3+1],o.p[T*3+2],-y*r,0,y*v,n[p][0]/e.r,n[p][1]/e.r,3,2)}for(let p=1;p<n.length-1;p++)o.tri(w,w+p,w+p+1)}}}const co=`
attribute vec4 aInfo; attribute float aPart;
uniform float uCollapse;
varying vec3 vP; varying vec3 vN; varying vec3 vL; varying vec4 vInfo; varying float vPart; varying float vDist;
void main(){
  vec3 p = position; vec3 n = normal;
  float sd = aInfo.w;
  // two thrown bowls joined at the waist: the upper one never sits quite true
  float up = smoothstep(.44, .56, p.y)*(1.-aPart);
  float a = sd*6.2831;
  p.xz += vec2(cos(a), sin(a))*.013*up;
  p.xz *= 1.+.02*sin(a*3.)*up;
  if (aInfo.z > 2.5){
    // the waist gives way: the upper bowl tips toward +x and sinks into the lower one while the belly folds out
    // under it; then it all goes down into a low puddle that spreads over the setter and onto the sand
    float k = uCollapse*(1.-aPart);
    float sag = smoothstep(.0, .55, k), fl = smoothstep(.45, 1., k);
    float yy = p.y, upper = smoothstep(.36, .62, yy);
    float a2 = sag*.80*upper, ca = cos(a2), sa = sin(a2);
    vec2 r = vec2(p.x, yy-.47);
    r = vec2(r.x*ca+r.y*sa, -r.x*sa+r.y*ca);
    p.x = r.x; p.y = .47+r.y;
    n.xy = vec2(n.x*ca+n.y*sa, -n.x*sa+n.y*ca);
    float wq = (yy-.44)/.12;
    p.xz *= 1.+sag*.26*exp(-wq*wq)*(.55+.9*position.x);
    p.y = (p.y-sag*upper*.17)*(1.-.10*sag);
    float ang = atan(position.z, position.x+1e-5);
    float lobes = 1.+.12*sin(ang*3.+1.3)+.07*sin(ang*5.+.4);
    vec2 pf = position.xz*(1.+.25*(1.-yy))*lobes;
    float rr = length(pf);
    float py = mix(.012, -.098, smoothstep(.32, .40, rr))+yy*.05*(1.-smoothstep(.3, .56, rr));
    p = mix(p, vec3(pf.x, py, pf.y), fl);
    n = normalize(mix(n, vec3(0., 1., 0.), fl*.85)+vec3(1e-3, 0., 0.));
  }
  vL = position; vInfo = aInfo; vPart = aPart;
  vec4 lp = instanceMatrix*vec4(p, 1.);
  vP = lp.xyz;
  vN = mat3(instanceMatrix)*n;
  vec4 mv = modelViewMatrix*lp;
  vDist = length(mv.xyz);
  gl_Position = projectionMatrix*mv;
}`,ho=`
${De}
${Ke}
uniform float uGreat, uCollapse, uJarGlow, uDetail;
uniform sampler2D tNoise;
varying vec3 vP; varying vec3 vN; varying vec3 vL; varying vec4 vInfo; varying float vPart; varying float vDist;
void main(){
  float d = vInfo.x, kind = vInfo.z, sd = vInfo.w, t = vL.y;
  vec3 N = normalize(vN+vec3(0., 1e-5, 0.));
  vec3 Vv = uCamL-vP; float vl = max(length(Vv), 1e-3); vec3 V = Vv/vl;
  float heat = heatAt(d);
  vec3 fc = fireCol(d);
  vec2 dir = normalize(vL.xz+vec2(1e-5, 0.));
  float n1 = vnoise(dir*2.6+sd*vec2(13., 7.)), n2 = vnoise(dir*9.+sd*vec2(5., 23.)+t*3.), n3 = vnoise(vec2(dir.x*6.+dir.y*3.5+sd*9., sd*5.));
  vec3 col;
  if (vPart > .5 || (kind > 1.5 && kind < 2.5)){
    // clay: setters and saggar stacks. Saggars go dull orange when fired, never bright
    float joint = kind > 1.5 ? smoothstep(.012, .0, abs(fract(t*4.+.5)-.5)*.25) : 0.;
    float cn = vnoise(vec2(dir.x*4.+dir.y*2.5+sd*9., t*(kind > .5 && kind < 1.5 ? 26. : 9.)));
    float cn2 = vnoise(vec2(dir.x*17.+dir.y*11., t*40.+sd*5.));
    vec3 alb = mix(uClay, vec3(.40, .29, .20), kind > 1.5 ? .7 : .45)*(.6+.5*cn+.25*cn2)*(1.-.8*joint);
    if (kind > .5 && kind < 1.5){
      // the great jar's setter drum: three courses of hand-cut clay blocks with wads of fireclay squeezed from the joints
      float cy = (t+.345)/.115, row = floor(cy), fy = fract(cy);
      float ang = atan(dir.y, dir.x)*2.228+.5*mod(row, 2.), fx = fract(ang);
      float mort = smoothstep(.0, .05, fx)*smoothstep(1., .95, fx)*smoothstep(.0, .09, fy)*smoothstep(1., .91, fy);
      float tone = .72+.5*hash21(vec2(floor(ang)+31., row));
      float chip = smoothstep(.62, .8, vnoise(vec2(ang*3.1, cy*3.7)));
      alb = mix(uClay, vec3(.40, .29, .20), .45)*(.7+.35*cn2+.2*vnoise(vec2(ang*9., cy*7.)))*tone*(.32+.68*mort)*(1.-.3*chip);
      N = normalize(N+vec3(dir.x, 0., dir.y)*(fx-.5)*.5*(1.-mort)+vec3(0., (fy-.5)*.7*(1.-mort), 0.));
    }
    col = alb*kilnLight(N, d);
    float sagg = kind > 1.5 ? .8 : .3;
    col += uOrange*heat*alb*sagg*(.55+.45*max(dot(N, V), 0.))*uFire;
  } else {
    float prog = kind > .5 && kind < 1.5 ? uGreat : clamp((uFront-d-vInfo.y+14.)/26., 0., 1.);
    // throwing rings and the seam at the waist
    float rings = sin(t*150.+n1*4.)*.5+sin(t*61.+sd*30.)*.5;
    N = normalize(N+vec3(0., rings*.045*uDetail*smoothstep(110., 30., vDist)*smoothstep(.02, .2, t), 0.));
    float seam = smoothstep(.014, .0, abs(t-.5+.004*(n2-.5)));
    float ndv = clamp(dot(N, V), 0., 1.);
    // the melt line comes down from the shoulder as glaze going wet: a soft wavering edge with a few long runs
    // drawn out below it, never teeth
    float m = smoothstep(.06, .82, prog);
    float run = smoothstep(.56, .96, n3);
    float rag = (n1-.5)*.10+(n2-.5)*.03-run*.15;
    float tl = mix(1.14, -.30, m)+rag*smoothstep(.0, .2, m);
    float wet = smoothstep(tl-.035, tl+.035, t);
    float band = smoothstep(tl-.10, tl-.02, t)*(1.-wet);
    float edge = smoothstep(tl-.012, tl+.02, t)*(1.-smoothstep(tl+.02, tl+.07, t));
    float sweat = smoothstep(.0, .12, prog)*(1.-smoothstep(.3, .6, prog));
    float glow = clamp(smoothstep(tl+.03, tl+.30, t)*smoothstep(.08, .3, prog)+smoothstep(.8, 1., prog), 0., 1.);
    // chalk
    vec3 alb = vec3(.80, .775, .735)*(.9+.12*n2)*(1.-.10*seam);
    alb *= 1.-.07*smoothstep(.3, .9, vnoise(vec2(dir.x*5.+sd*40., t*7.)));
    float coldK = (1.-heat)*smoothstep(8., 40., d-uFront-uLead);
    vec3 KL = kilnLight(normalize(N+vec3(0., .55*coldK, 0.)), d);
    KL = mix(KL, vec3(dot(KL, vec3(.3, .5, .2))), mix(.16, .42, clamp(heat+exp(-max(d-uFront-uLead, 0.)/30.), 0., 1.)));        // chalk keeps its whiteness under orange light; in the cold chambers it shows the ember red below and the violet above
    // far ahead of the front the embers on the sand and the floor ports redden the belly; the shoulder keeps the cool light
    float belly = coldK*smoothstep(.60, .10, t)*(.5+.5*max(.35-N.y, 0.));
    KL = mix(KL, KL*vec3(1., .50, .36), belly*.8)+vec3(.66, .13, .04)*belly*.6;
    KL += vec3(.95, .25, .07)*coldK*max(.12-N.y, 0.)*.6;                 // the embers on the sand light it from below: the jar's underside glows, so it stands whole on its setter
    // a raw jar is still a jar: the dark of its mouth, the shadow under its lip, the seam at the waist
    float rJ = length(vL.xz), inMouth = smoothstep(.20, .186, rJ)*step(.86, t);
    float mouthK = max(smoothstep(.925, .965, t)*smoothstep(.2, .7, N.y)*.6, inMouth*1.3), lipSh = smoothstep(.80, .90, t)*(1.-smoothstep(.90, .93, t));
    vec3 chalk = alb*KL*(1.-.3*sweat)*mix(vec3(1.), vec3(.50, .44, .40), band)*(1.-.72*mouthK)*(1.-.22*lipSh)*(1.-.78*coldK*smoothstep(.88, .915, t))*(1.-.62*coldK*smoothstep(.075, .03, t))*(1.-mix(.16, .30, coldK)*smoothstep(.03, .0, abs(t-.5)));
    // wet glaze, not yet glowing: darker, glassy
    vec3 wetc = alb*vec3(.55, .47, .38)*KL;
    vec3 body = mix(chalk, wetc, wet);
    // lantern: lit from within, darkening to red-brown at the rim, dark foot and mouth rings
    float rim = smoothstep(.0, .74, pow(1.-ndv, 1.4));
    float ends = clamp(smoothstep(.085, .03, t)+smoothstep(.915, .965, t)+inMouth*1.2, 0., 1.);
    float core = ndv*ndv;
    // heat rises: red-brown at the foot, deep orange through the belly, gold at the shoulder (the tone map turns a
    // bright orange pale, so the belly is held dim and red: the jar is never the colour of the flame behind it)
    float isGreat = step(.5, kind)*step(kind, 1.5);
    float tt = clamp(t+(n1-.5)*.14, 0., 1.);
    vec3 ramp = mix(vec3(.26, .036, .010), uOrange*vec3(.78, .50, .42), smoothstep(.04, .44, tt));
    ramp = mix(ramp, mix(uOrange, uGold, .45)*vec3(1.2, .95, .55), smoothstep(.42, .80, tt)*mix(.7, 1., isGreat));
    vec3 lamp = ramp*(.42+.5*core+.34*core*core*core)*(.84+.26*n2);
    float sh = smoothstep(.56, .80, t+(n1-.5)*.10)*(1.-smoothstep(.89, .96, t));
    lamp += uGold*vec3(1.5, 1.05, .34)*sh*core*(.25+.75*core)*mix(.16, 1.45, isGreat)*(.9+.2*n2);      // white heat at the shoulder
    lamp *= .9+.2*vnoise(vec2(dir.x*3.+dir.y*5.+sd*11., t*3.-uTime*.25));
    lamp = mix(lamp, vec3(.20, .04, .014)*.45, rim);
    lamp = mix(lamp, vec3(.16, .05, .025)*.5, ends*.9);
    lamp *= 1.-.35*seam;
    // crazing: the glaze crackles as it takes the heat, a fine net that shows dark on the lit body and grey on the chalk
    vec2 cq = vec2(dir.x*6.+t*2.+sd*9., dir.y*6.+t*9.)*mix(1.5, 1., isGreat), ci = floor(cq), cf = fract(cq);
    float m1 = 9., m2 = 9.;
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){
      vec2 g = vec2(float(i), float(j)), r = g+hash22(ci+g)-cf; float dd = dot(r, r);
      if (dd < m1){ m2 = m1; m1 = dd; } else if (dd < m2){ m2 = dd; }
    }
    float craze = 1.-smoothstep(.012, .07, sqrt(m2)-sqrt(m1));
    craze *= mix(.45, 1., isGreat)*smoothstep(mix(34., 80., isGreat), 12., vDist)*smoothstep(.06, .2, t)*(1.-smoothstep(.86, .95, t));
    lamp *= 1.-.24*craze; body *= 1.-.11*craze;
    float pudK = 0.;
    if (kind > 2.5){
      // over-fired: it stays an orange-gold body with its dark rim and seam while it buckles (never brighter than
      // the flame), then lies as a molten puddle with a darker crust creeping in from the edge
      float pm = vnoise(vP.xz*.9+uTime*.12)*.6+vnoise(vP.xz*2.3-uTime*.2)*.4;
      float rr = length(vL.xz)*2.;
      vec3 molten = mix(uOrange*1.1, uGold*vec3(1.9, 1.3, .42), smoothstep(.40, .78, pm)*(1.-.6*smoothstep(.25, .7, rr)));
      // the crust: dark, creeping in from the edge in plates, with the melt still showing in the cracks between them
      float cr = smoothstep(.20, .74, rr+(pm-.5)*.75);
      float crack = (1.-smoothstep(.0, .12, abs(vnoise(vP.xz*1.9+3.7)-.5)))*.55*(.5+pm);
      vec3 pud = mix(molten, mix(vec3(.10, .024, .010), uOrange*.9, crack), cr*.96);
      pudK = smoothstep(.55, 1., uCollapse);
      lamp = mix(lamp*mix(vec3(1.), vec3(1.08, .80, .55), smoothstep(.05, .5, uCollapse)), pud, pudK);
    }
    body += alb*uSkyCol*shaftPool(vP)*1.6*max(N.y*.7+.3, 0.);
    col = mix(body, lamp*uJarGlow, max(glow, pudK));
    col += uOrange*edge*.5*(1.-smoothstep(.9, 1., prog))*smoothstep(.05, .15, prog);
    // the wet coat reflects the river of flame on the crown
    vec3 R = reflect(-V, N);
    float upR = max(R.y, .08);
    vec2 rp = vec2(vP.x+R.x*24./upR, -vP.z-R.z*24./upR);
    // the same licks that run on the crown, smooth from the fire's own noise texture
    vec4 rs = textureLod(tNoise, vec2(rp.x/14.+sd, (rp.y-16.*uTime)/180.), 2.);
    vec4 rs2 = textureLod(tNoise, vec2(rp.x/36.+sd*3., (rp.y-16.*uTime)/120.), 2.);
    float rl = smoothstep(.62, .96, 1.-abs(2.*rs.r-1.))*smoothstep(.25, .6, rs2.a);
    float inband = smoothstep(19., 7., abs(rp.x))*smoothstep(.04, .2, R.y);
    vec3 env = mix(uOrange*vec3(.9, .6, .5), uGold*vec3(1.7, 1.2, .42), rl)*(.03+5.*rl*inband)*heatAt(rp.y);
    env += vec3(1., .42, .1)*(1.-heat)*exp(-max(d-uFront, 0.)/24.)*.5*max(R.z*.8+.2, 0.);
    env += uEmber*(1.-heat)*.25*max(-R.y, 0.)+uSkyCol*flueLight(d)*.6*max(R.y, 0.)*(1.-heat);
    float fres = .05+.25*pow(1.-ndv, 3.)*smoothstep(.0, .35, ndv);
    col += env*fres*1.1*wet*(1.-.5*ends)*(1.-rim*.8)*(1.-pudK);
    float sp = pow(max(dot(R, normalize(vec3(.1, .8, .55))), 0.), 90.);
    // the arch behind us and the arch ahead, each full of fire: soft tongues that slide as the fire moves
    vec4 fs = textureLod(tNoise, vec2(R.x*1.5+sd*3., R.y*.45-uTime*.07), 1.);
    float sp2 = smoothstep(.88, .99, dot(R, normalize(vec3(0., .38, 1.))))+smoothstep(.90, .99, dot(R, normalize(vec3(0., .5, -1.))))*heatAt(d+26.);
    col += uGold*vec3(1.5, 1.05, .36)*(sp*2.2*(.4+rl)+sp2*1.7*smoothstep(.46, .66, fs.r+.3*(fs.b-.5)))*wet*heat*(1.-rim)*(1.-pudK);
  }
  col = kilnHaze(col, d, vDist);
  col = sceneFog(col, vP, vDist);
  gl_FragColor = vec4(col, 1.);
}`;function ge(o,t){const a=o.length,e=[],f=[],v=[],r=[];for(let n=0;n<a;n++){const c=o[Math.max(0,n-1)],h=o[Math.min(a-1,n+1)];let l=h[0]-c[0],d=h[1]-c[1];const y=Math.hypot(l,d)||1;l/=y,d/=y;const w=d,p=-l;for(let T=0;T<=t;T++){const k=T/t*Math.PI*2,S=Math.cos(k),M=Math.sin(k);e.push(o[n][0]*S,o[n][1],o[n][0]*M),f.push(w*S,p,w*M),v.push(o[n][2]||0)}}for(let n=0;n<a-1;n++)for(let c=0;c<t;c++){const h=n*(t+1)+c,l=h+1,d=h+t+1,y=d+1;o[n][0]>1e-4&&r.push(h,d,l),o[n+1][0]>1e-4&&r.push(l,d,y)}const i=new g.BufferGeometry;return i.setAttribute("position",new g.Float32BufferAttribute(e,3)),i.setAttribute("normal",new g.Float32BufferAttribute(f,3)),i.setAttribute("aPart",new g.Float32BufferAttribute(v,1)),i.setIndex(r),i}function _e(o,t,a){const e=[];a==="drum"?e.push([.3,-.345,1],[.305,-.33,1],[.3,-.235,1],[.285,-.225,1],[.3,-.215,1],[.295,-.12,1],[.28,-.11,1],[.292,-.1,1],[.286,-.012,1],[.27,0,1],[.19,0,1]):a&&(t>1?e.push([.33,-.105,1],[.337,-.09,1],[.332,-.014,1],[.305,0,1],[.19,0,1]):e.push([.335,-.105,1],[.33,-.004,1],[.19,0,1])),t>1?e.push([.192,.012,0],[.186,.036,0]):e.push([.188,.03,0]);const f=-66.4*Oe,v=64.5*Oe;for(let r=0;r<=o;r++){const i=f*(1-r/o);r>0||t<2?e.push([.5*Math.cos(i),.49+.46*Math.sin(i),0]):e.push([.2,.068,0])}for(let r=1;r<=o;r++){const i=v*(r/o);e.push([.5*Math.cos(i)-.002,.49+.45*Math.sin(i),0])}return t>1?e.push([.205,.918,0],[.204,.948,0],[.221,.972,0],[.213,.986,0],[.196,.976,0],[.186,.9,0],[0,.885,0]):t>0?e.push([.205,.93,0],[.22,.975,0],[.195,.975,0],[0,.9,0]):e.push([.212,.975,0],[0,.93,0]),e}function fo(){const o=[[.335,-.105,1],[.33,-.004,1],[.15,0,1]];for(let t=0;t<4;t++){const a=t*.245;o.push([.13,a+.004,0],[.15,a+.03,0],[.27,a+.085,0],[.365,a+.185,0],[.372,a+.215,0],[.345,a+.222,0]),t<3?o.push([.14,a+.238,0]):o.push([.13,a+.12,0],[0,a+.105,0])}return o}function uo(){const o=[[.37,-.105,1],[.375,-.004,1]];for(let t=0;t<4;t++){const a=t*.25,e=.36+.03*(t*7%3)/2;o.push([e,a+.012,0],[e+.012,a+.238,0])}return o.push([.3,1,0],[0,1,0]),o}function kt(o,t){const a=o.secAt(t),e=o.swell(a,t),f=a.H*e,v=o.floorY(t)+f-.6;let r=0,i=0,n=1e9;for(const c of o.walls){const h=t-c.d,l=Math.abs(h);if(l<n){n=l;const y=Math.max(c.f,o.floorY(t));i=Math.max(Math.min(v-(y+c.archH)+3-f*tt*.33,(v-y-12.2-f*tt*.35)/yt),0)}const d=c.up.kind==="great"&&h>=0||c.down.kind==="great"&&h<0?36:h<0?15:13;l<d+1&&(r=Math.max(r,1-Y(3.2,d,l)))}return{C:v,D:f,Wr:a.W*e,kA:r,X:i}}function Wt(o,t){const a=Math.min(Math.abs(t)/Math.max(o.Wr,1),1);return o.C-o.D*(1-Math.pow(Math.max(1-Math.pow(a,2.857),0),.35))}const vo=(o,t)=>Y(4,13,t)*(1-Y(o.end-26,o.end-8,t)),mo=o=>Math.max(o.Wr,1)*.78;function Bt(o,t,a,e){const f=t.D*tt*vo(o,e)*(1-Y(.55,1,Math.abs(a)/(Math.max(t.Wr,1)*.66)))*(1+.5*Y(350,384,e)),v=t.kA*(1-Y(6,Math.max(t.Wr,1)*.77,Math.abs(a)));return(Vt-Rt)*f*(1-.85*v)+yt*t.X*v+.2}function po(o){const t=new Uint16Array(et*4),a=g.DataUtils.toHalfFloat;for(let f=0;f<et;f++){const v=(f+.5)/et*we,r=kt(o,Math.min(v,o.end-.01));t[f*4]=a(r.C-Fe*v),t[f*4+1]=a(r.D),t[f*4+2]=a(r.kA),t[f*4+3]=a(r.X)}const e=new g.DataTexture(t,et,1,g.RGBAFormat,g.HalfFloatType);return e.magFilter=g.LinearFilter,e.minFilter=g.LinearFilter,e.wrapS=g.ClampToEdgeWrapping,e.wrapT=g.ClampToEdgeWrapping,e.generateMipmaps=!1,e.needsUpdate=!0,e}async function go(o,t){const e=new Uint8Array(262144),f=[[4,4],[4,4],[8,4],[3,3]],v=f.map(([n,c])=>{const h=[];for(let l=0;l<c;l++){const d=n<<l,y=new Float32Array(d*d);for(let w=0;w<y.length;w++)y[w]=t();h.push({P:d,a:y})}return h}),r=f.map(([,n])=>1/(1-Math.pow(.5,n)));for(let n=0;n<256;n++){for(let c=0;c<256;c++)for(let h=0;h<4;h++){let l=0,d=.5;for(const y of v[h]){const w=c/256*y.P,p=n/256*y.P,T=Math.floor(w),k=Math.floor(p);let S=w-T,M=p-k;S=S*S*(3-2*S),M=M*M*(3-2*M);const W=(T+1)%y.P,K=(k+1)%y.P,F=y.a;l+=d*((F[k*y.P+T]*(1-S)+F[k*y.P+W]*S)*(1-M)+(F[K*y.P+T]*(1-S)+F[K*y.P+W]*S)*M),d*=.5}e[(n*256+c)*4+h]=Math.round(255*Z((l*r[h]-.5)*1.5+.5,0,1))}await o.yield()}const i=new g.DataTexture(e,256,256,g.RGBAFormat,g.UnsignedByteType);return i.wrapS=g.RepeatWrapping,i.wrapT=g.RepeatWrapping,i.magFilter=g.LinearFilter,i.minFilter=g.LinearMipmapLinearFilter,i.generateMipmaps=!0,i.needsUpdate=!0,i}const xo=`
attribute vec4 aSec;
varying vec3 vP; varying float vDist; varying vec4 vSec;
void main(){
  vP = position; vSec = aSec;
  vec4 mv = modelViewMatrix*vec4(position, 1.);
  vDist = length(mv.xyz);
  gl_Position = projectionMatrix*mv;
}`,yo=`
${De}
${Ke}
uniform sampler2D tProf, tNoise;
uniform vec4 uWall[13];          // every flame wall: d, sill height, arch half-width, height of the arch's springing
uniform vec3 uWH; uniform vec2 uSecD;   // width over height of the vault in the firebox, chambers 1-7, chambers 8-12
uniform float uRiver, uSteps, uRiverEnd;
varying vec3 vP; varying float vDist; varying vec4 vSec;
void main(){
  vec3 ro = vP;
  vec3 rdv = vP-uCamL; vec3 rd = rdv/max(length(rdv), 1e-3);
  float d0 = -ro.z, dd = -rd.z;
  float dds = abs(dd) < 1e-4 ? 1e-4 : dd;
  // the sine of the ray's angle with the sloping roof
  float c1 = textureLod(tProf, vec2((d0+5.)/${we}., .5), 0.).r, c0 = textureLod(tProf, vec2((d0-5.)/${we}., .5), 0.).r;
  float sl = (c1-c0)*.1+${Fe};
  float sinA = abs(dot(rd, normalize(vec3(0., 1., sl))));
  // how far the ray can run inside the fire: from its underside up to the vault, at the angle it climbs
  vec4 p0 = textureLod(tProf, vec2(d0/${we}., .5), 0.);
  float wr0 = max(p0.g*(d0 < uSecD.x ? uWH.x : (d0 < uSecD.y ? uWH.y : uWH.z)), 1.);
  float h0 = p0.r+${Fe}*d0-p0.g*(1.-pow(max(1.-pow(min(abs(ro.x)/wr0, 1.), 2.857), 0.), .35))-ro.y;
  float Lm = clamp((max(h0, 0.)+3.)/max(sinA, .07), 14., 160.);
  // nothing ahead of the front burns: leave at once
  if (min(d0, d0+dd*Lm) > uFront+uLead+30.){ gl_FragColor = vec4(0.); return; }
  // a flame wall stops the ray unless it passes through the arch. The opening is convex, so the ray is clear of
  // the wall when it is inside the opening at both faces; if it leaves between them it has met the arch's soffit
  float tEnd = Lm;
  for (int k = 0; k < 13; k++){
    vec4 w = uWall[k];
    float ta = (w.x-3.2-d0)/dds, tb = (w.x+3.2-d0)/dds;
    float tn = max(min(ta, tb), 0.), tf = max(ta, tb);
    if (tf > 0. && tn < tEnd){
      vec3 qn = ro+rd*tn, qf = ro+rd*tf;
      float xn = abs(qn.x), xf = abs(qf.x);
      float gn = max(xn-w.z, qn.y-(w.y+w.w+sqrt(max(w.z*w.z-xn*xn, 0.))));
      float gf = max(xf-w.z, qf.y-(w.y+w.w+sqrt(max(w.z*w.z-xf*xf, 0.))));
      if (gn > 0.) tEnd = tn;
      else if (gf > 0.) tEnd = min(tEnd, tn+(tf-tn)*(-gn)/max(gf-gn, 1e-4));
    }
  }
  // each piece of the river answers only for its own stretch of the kiln (the next piece, or the cap that stands in
  // the arch between the two, takes the sight line on from the wall's middle), so no stretch is ever counted twice
  vec2 rg = dds > 0. ? vSec.xy : vSec.zw;
  tEnd = min(tEnd, max(((dds > 0. ? rg.y : rg.x)-d0)/dds, 0.));
  float span = max(min(Lm, tEnd), 3.);
  float jit = mix(.5, hash21(gl_FragCoord.xy*.7313+3.1), .7);
  float lod = clamp(log2(max(vDist*.02, 1.)), 0., 3.);
  vec3 acc = vec3(0.), accM = vec3(0.); float A = 0., At = 0., cAcc = 0.;
  for (int i = 0; i < 32; i++){
    if (float(i) >= uSteps) break;
    // short steps first, where the fire is seen sharpest, longer ones deeper in
    float u0 = (float(i)+jit)/uSteps;
    float t = span*pow(u0, 1.25), ds = span*1.25*pow(max(u0, 1e-3), .25)/uSteps;
    if (t > tEnd) break;
    vec3 p = ro+rd*t;
    float d = -p.z;
    vec4 pr = textureLod(tProf, vec2(d/${we}., .5), 0.);
    float wr = max(pr.g*(d < uSecD.x ? uWH.x : (d < uSecD.y ? uWH.y : uWH.z)), 1.), ax = abs(p.x)/wr;
    float sh = pow(max(1.-pow(min(ax, 1.), 2.857), 0.), .35);
    float h = pr.r+${Fe}*d-pr.g*(1.-sh)-p.y;                 // depth below the vault
    if (h < -2.5) break;
    float ends = smoothstep(4., 13., d)*(1.-smoothstep(uRiverEnd-26., uRiverEnd-8., d));
    float base = pr.g*${tt}*ends*(1.-smoothstep(.55, 1., ax/.66))*(1.+.5*smoothstep(350., 384., d));
    float w = pr.b*(1.-smoothstep(6., wr*.77, abs(p.x)));            // 1 on the axis close to a flame wall
    float Hm = ${(Vt-Rt).toFixed(3)}*base*(1.-.85*w)+${yt.toFixed(4)}*pr.a*w+.2;
    if (h > Hm+1.6 && i > 1) break;                                   // out through the underside
    float lead = 1.-smoothstep(uFront+uLead-22., uFront+uLead+28., d);            // 0 at the tips of the front, 1 well behind it
    if (lead < .004 || Hm < .25) continue;
    float lodi = lod+clamp(log2(max(ds*.7, 1.)), 0., 3.);
    // what hangs lower lags behind: the whole field leans back with depth, so that from the side the fire is long
    // licks streaming up under the vault and never a curtain of upright streaks
    float hh = max(h, 0.);
    float fl = d-16.*uTime+hh/max(Hm, 1.)*25.;
    // the river wanders under the crown: its licks swing from side to side as they climb, and the swing itself creeps
    // uphill, so that seen from below they are bent tongues and never straight rays out of the arch head
    float mx = p.x+4.6*sin(d*.083+1.9*sin(d*.029+1.3)-uTime*.33)+2.1*sin(d*.23+p.x*.05-uTime*.9)+hh*.35*sin(d*.11+2.);
    vec4 s1 = textureLod(tNoise, vec2(mx/36.+hh*.011, fl/120.), lodi);
    // the licks: the fire is not a layer but separate tongues drawn out along the flow, eleven times longer than
    // they are wide, wandering as they go, with the bare vault dark between them
    vec4 s3 = textureLod(tNoise, vec2(mx/15.+(s1.g-.5)*.42-hh*.007, (fl-5.*uTime)/118.), min(lodi, 3.));
    float ridge = 1.-abs(2.*s3.r-1.);
    vec4 s2 = textureLod(tNoise, vec2(mx/15.6+s1.g*.09+hh*.045, fl/41.-uTime*.07), lodi);
    float nb = mix(s1.a, s1.r, smoothstep(.1, .7, lead));
    float lk = smoothstep(.30, .86, ridge);                         // 1 along a lick's spine, 0 between two licks
    // a lick is whole along its spine and torn into lengths: where the big noise falls it breaks off in a tip
    float tear = smoothstep(.12, .44, nb+.30*(s2.r-.5)+.14*lk);
    float lkB = smoothstep(.58, .89, ridge);                // broader: the tongues that go under an arch
    float nt = clamp(.5*nb+1.5*(s2.r-.5)+.25, 0., 1.3);
    // at the front the leading tongues are drawn out long and hang lowest
    float tipK = smoothstep(.0, .25, lead)*(1.-smoothstep(.35, .8, lead));
    float hbL = base*.66*lk*tear*(.55+.9*s2.g)*(1.+.45*tipK);
    float hbB = pr.a*w*(${Ot}+${Ht}*nt)*smoothstep(0., .5, lead)*(.8+.2*lkB)*mix(.88, 1., tear);
    float hb = min(hbL*(1.-.85*w)+hbB, Hm);
    if (hb < .08) continue;
    // near an arch the fire leaves the vault and dives as a layer a few metres thick: nothing hangs from the crown
    float hTop = max(hbB-(3.6+3.2*s2.g), 0.)*smoothstep(.15, .6, w);
    float rr = clamp((hh-hTop)/max(hb-hTop, .5), -1., 3.);                                                 // 0 against the vault, 1 at the lick's underside
    float edge = rr+(s2.b-.5)*1.3*smoothstep(.15, 1., rr);          // the underside is a torn skin
    float rho = (1.-smoothstep(.50, 1.10, edge))*smoothstep(-.9, .45, rr)*smoothstep(-.3, .7, h)*smoothstep(0., .14, lead)*smoothstep(.7, 2.4, hb);
    // a dim red mantle under each lick: the fire thins out into the air below it instead of ending at its torn skin
    // (fading out as it banks down to an arch: there the layer's own underside is its edge)
    float man = (1.-smoothstep(.55, 2.3, edge))*smoothstep(-.9, .45, rr)*smoothstep(-.3, .7, h)*smoothstep(0., .14, lead)*smoothstep(.7, 2.4, hb)*.2*(1.-w);
    float rt = max(rho, man);
    if (rt < .003) continue;
    float fg = frontGlow(d);
    // dark red where the fire is thin (its edges, its torn tips), saturated orange through the body, amber where it
    // is deepest, and white-gold only in a thin thread along the spine of a lick, deep inside it
    float thick = clamp(hb/mix(3.5, 8., w), 0., 1.), inner = clamp(1.-edge, 0., 1.);
    float temp = thick*(.18+.82*inner)*(.6+.6*s2.g)*(.45+.55*lead)*(.4+.6*tear);
    vec3 e = mix(vec3(.30, .022, .004), uOrange*vec3(.74, .46, .40)*1., smoothstep(.04, .40, temp));
    e = mix(e, uOrange*vec3(1.05, .86, .9), smoothstep(.62, 1., temp)*.5);
    float core = smoothstep(.86, 1., ridge)*smoothstep(.0, .35, inner)*tear*smoothstep(.1, .5, lead)*smoothstep(.38, .62, s1.b);
    e = mix(e, uGold*vec3(1.5, 1.05, .34), core*.5);
    // salt and ash: where the fire thins at its tips it burns blue-green
    float salt = smoothstep(.62, .80, s1.b)*(1.-smoothstep(.04, .26, temp))*(1.-.5*lead)*smoothstep(.7, 1., rr);
    e = mix(e, vec3(.03, .44, .42), salt*.8);
    // long fibres drawn out along the flow, so that a still shows which way the fire runs
    vec4 s4 = textureLod(tNoise, vec2(mx/6.2+(s1.g-.5)*.5, (fl-9.*uTime)/58.), min(lodi, 2.5));
    // and finer ones, which carry the fire's grain when it is seen from close by
    vec4 s5 = textureLod(tNoise, vec2(mx/2.3+(s1.g-.5)*.7+hh*.02, (fl-14.*uTime)/17.), min(lodi, 2.));
    e *= (1.+.45*fg*(1.-lead*.5))*(.62+.55*s2.g)*mix(.42+1.2*s4.r, .72+.6*s4.r, .7*w)*(.66+.68*s5.b);
    // the mantle glows and covers what lies behind the fire, but it never veils the fire: the body is summed against
    // its own cover alone (A), as if there were no mantle; the mantle's glow and the cover of the room against both (At)
    float a = rho < .003 ? 0. : 1.-exp(-rho*.32*ds), at = 1.-exp(-rt*.32*ds);
    accM += (1.-At)*(at-a)*vec3(.42, .07, .012)*(.7+.6*s2.g); At += (1.-At)*at;
    cAcc += (1.-A)*a*core*(1.+.3*fg);
    acc += (1.-A)*a*e; A += (1.-A)*a;
    if (A > .97) break;
  }
  // seen from close under it the fire must keep its colour and its licks instead of burning out to a white cloud
  float lm = dot(acc, vec3(.3, .55, .15));
  float nearK = 1.-smoothstep(16., 52., vDist);
  acc /= 1.+(1.05+.9*nearK)*max(lm-.62+.2*nearK, 0.);
  // the white-gold thread along a lick's spine is laid over the held-down body: the one thing in the fire that burns out to white
  acc += uGold*vec3(1.9, 1.3, .42)*min(cAcc, 1.)*(1.25-.45*nearK);
  acc += accM;
  vec3 fa = sceneFog(vec3(0.), vP, vDist), fb = sceneFog(vec3(1.), vP, vDist);
  acc = acc*(fb-fa)+fa*At;
  gl_FragColor = vec4(acc*uRiver, At*.92);
}`;function wo(o,t){const a=[],e=[],v=Math.max(t.d0,4),r=Math.min(t.d1,o.end-7),i=Math.max(2,Math.ceil((r-v)/2)+1);for(let h=0;h<i;h++){const l=_(v,r,h/(i-1)),d=kt(o,Math.min(l,o.end-.01)),y=mo(d);for(let w=0;w<17;w++){const p=(w/16*2-1)*y;a.push(p,Wt(d,p)-Bt(o,d,p,l),-l)}}for(let h=0;h<i-1;h++)for(let l=0;l<16;l++){const d=h*17+l;e.push(d,d+1,d+17,d+1,d+17+1,d+17)}const n=t.d0<=0?-20:t.d0,c=t.d1>=o.end-.01?o.end+40:t.d1;return Ut(a,e,[n,c,n,c])}function Ut(o,t,a){const e=new g.BufferGeometry,f=o.length/3,v=new Float32Array(f*4);for(let r=0;r<f;r++)v.set(a,r*4);return e.setAttribute("position",new g.Float32BufferAttribute(o,3)),e.setAttribute("aSec",new g.Float32BufferAttribute(v,4)),e.setIndex(t),e.computeBoundingSphere(),e}function bo(o,t){const a=o.walls[t],e=o.secs[t],f=o.secs[t+1],v=kt(o,a.d),r=[],i=[],n=17,c=a.archH-a.archW;for(let h=0;h<n;h++){const l=(h/(n-1)*2-1)*(a.archW-.05),d=Wt(v,l),y=Math.min(a.f+c+Math.sqrt(Math.max(a.archW*a.archW-l*l,0)),d),w=Math.min(d-Bt(o,v,l,a.d)-.25,y);r.push(l,w,-a.d,l,y,-a.d)}for(let h=0;h<n-1;h++){const l=h*2;i.push(l,l+2,l+1,l+1,l+2,l+3)}return Ut(r,i,[a.d,f.d1>=o.end-.01?o.end+40:f.d1,e.d0<=0?-20:e.d0,a.d])}const ko=`
attribute vec3 aPos; attribute vec3 aAxis; attribute vec2 aSize; attribute vec4 aFl;
uniform float uFront, uTime, uJets, uCollapse, uInside; uniform vec2 uLogs; uniform vec3 uCamL;
uniform vec4 uLogP0, uLogP1; uniform vec3 uLogA0, uLogA1, uLogX0, uLogX1;
varying vec2 vQ; varying vec4 vFl; varying float vHot; varying float vGain; varying float vDist; varying vec3 vP; varying float vLy; varying float vCurt; varying float vAir;
float heatAt(float d){ return smoothstep(uFront+8., uFront-22., d); }
void main(){
  float d = aFl.x, ty = aFl.z, ly = position.z, sd = aFl.y+ly*.371;
  float hot = heatAt(d), gain = aFl.w, hs = 1.;
  float x = (d-uFront+6.)/20.; float fg = exp(-x*x);
  vec3 base = aPos, axis = aAxis; vAir = 0.;
  if (ty < .5){ hs = mix(.36, 1., hot)*(1.+.55*fg)*(.80+.28*sin(uTime*(1.1+1.7*fract(sd*5.3))+sd*40.))*(.62+.7*fract(aFl.y*9.7)); gain *= mix(.6, 1., hot); }
  else if (ty < 1.5){ gain *= smoothstep(0., .5, hot); hs = .6+.4*hot+.5*fg; }
  else if (ty < 2.5){ hot = 1.; hs = .88+.16*sin(uTime*(1.3+fract(sd*3.1))+sd*23.); gain *= mix(1., smoothstep(6.5, 10., abs(aPos.x)), smoothstep(0., .3, uInside)); }
  else if (ty < 3.5){ gain *= uJets*(.5+.5*hot); hs = .7+.3*hot; hot = 1.; }
  else if (ty < 4.5){ gain *= smoothstep(.28, .46, uCollapse)*(1.-smoothstep(.62, 1., uCollapse)); hot = 1.; hs = .5+uCollapse; }
  else if (ty < 6.5){
    // a thrown split's fire is on the split while it falls and streams back the way it came (uLogP = where the fire is
    // rooted and, in w, how far the split is still in the air; uLogA = the way the fire streams; uLogX = the split's
    // own length); landed, it stands where the split lies. A type with a fraction is a tongue rooted along the
    // split's length (aAxis.x, in metres from its middle) that burns only in the air
    vec4 lp = ty < 5.5 ? uLogP0 : uLogP1; float lg = ty < 5.5 ? uLogs.x : uLogs.y, tr = step(.1, fract(ty));
    gain *= lg*mix(1., lp.w, tr); hot = 1.; hs = .35+.65*lg;
    base = lp.xyz+(ty < 5.5 ? uLogX0 : uLogX1)*(aAxis.x*tr); axis = ty < 5.5 ? uLogA0 : uLogA1; vAir = lp.w;
  }
  else if (ty < 7.5){
    float k = clamp((uCollapse-.30)/.70, 0., 1.), tt = k*2.4;
    base = aPos+aAxis*tt-vec3(0., 4.4*tt*tt, 0.);
    base.y = max(base.y, aPos.y-3.2);
    gain *= smoothstep(0., .05, k)*(1.-smoothstep(.6, 1., k))*step(ly, .5);
    axis = vec3(0., 1., 0.); hot = 1.;
  }
  else if (ty < 8.5){ hot = 1.; gain *= 1.-uInside; }
  else { hot = 1.; gain *= step(ly, .5); }
  float wl = (1.+.55*ly)*(ty < 2.5 ? .78+.5*fract(aFl.y*4.3) : 1.)*(1.-.4*vAir), hl = 1.-.2*ly;      // (a split's fire is narrower in the air)
  if (ty > 1.5 && ty < 2.5) wl *= mix(1., .58, smoothstep(0., .3, uInside));      // from inside, the bed's fire stands as separate tongues
  if (ty > 8.5){ wl = 1.+1.7*position.y; hl = 1.; hs = 1.; }
  float off = (ly < .5 ? 0. : (ly < 1.5 ? -.26 : .26))*aSize.x*(ty > 6.5 ? 0. : 1.);
  vec3 toCam = uCamL-base; float tl = max(length(toCam), 1e-3);
  if (ty > 3.5 && ty < 4.5){
    // the burst over the jar that folds is looked down on: its card would lie open to the eye, so it turns to face
    // the eye as the view steepens, and thins
    vec3 td = toCam/tl; float steep = smoothstep(.30, .72, abs(td.y));
    vec3 ax2 = axis-td*dot(td, axis)*steep; float al = length(ax2);
    axis = al > 1e-3 ? ax2/al : axis;
    gain *= 1.-.45*steep;
  }
  vec3 rt = cross(axis, toCam); float rl = length(rt); rt = rl > 1e-4 ? rt/rl : vec3(1., 0., 0.);
  vec3 p = base+rt*(position.x*aSize.x*wl+off)+axis*(position.y*aSize.y*hs*hl)+toCam/tl*(ly*.45*step(ty, 8.5));
  if (gain < .01) p = aPos;
  vQ = position.xy; vFl = aFl; vHot = hot; vGain = gain; vP = p; vLy = ly; vCurt = ty > 7.5 ? aSize.x/max(aSize.y, 1e-3) : 0.;
  vec4 mv = modelViewMatrix*vec4(p, 1.);
  vDist = length(mv.xyz);
  gl_Position = projectionMatrix*mv;
}`,Mo=`
${De}
${Ke}
varying vec2 vQ; varying vec4 vFl; varying float vHot; varying float vGain; varying float vDist; varying vec3 vP; varying float vLy; varying float vCurt; varying float vAir;
void main(){
  float ty = vFl.z, sd = vFl.y+vLy*.371, x = clamp(vQ.x, -.5, .5)*2., y = clamp(vQ.y, 0., 1.), I, T;      // clamped for multisampling (pow of y below)
  if (ty > 8.5){
    // a shaft of cold light from a spy hole: dust and smoke drifting through it
    float inFlue = step(uFlueD+10., vFl.x);                          // the two slants inside the flue carry their light right across the shaft
    float across = exp(-x*x*4.2)*(1.-x*x), along = smoothstep(0., .05, y)*(1.-smoothstep(mix(.5, .86, inFlue), 1., y))*(1.-mix(.45, .2, inFlue)*y);
    float dust = .5+.95*fbm3(vec2(x*2.2+sd*9., y*13.-uTime*.3))*(.6+.6*vnoise(vec2(y*38.+uTime*.9, sd*7.)));
    float k = across*along*dust*vGain*smoothstep(5., 24., vDist)*(1.-.55*heatAt(-vP.z));   // the fire's own light drowns it
    gl_FragColor = vec4(sceneFog(mix(uSkyCol, vec3(.8, .85, 1.), .3)*k, vP, vDist), 0.);
    return;
  }
  if (ty > 6.5 && ty < 7.5){
    float r = length(vec2(x, y*2.-1.)); I = smoothstep(1., .1, r); T = I;
  } else {
    float t = uTime*(1.25+.8*fract(sd*7.3));
    float curt = step(1.15, vCurt), k = max(vCurt, 1.);
    float xs = x*k;                                              // across, in units of the flame's own height
    // every flame leans its own way and wanders, more toward its tip
    float lean = (fract(sd*13.7)-.5)*mix(1.2, .25, curt);
    float sway = fbm3(vec2(sd*31.+xs*.35, y*1.4-t*1.1))-.47;
    float xw = xs-lean*y*y+sway*1.9*y*mix(1., .6, curt);
    // a tongue narrows from its root to its tip; a curtain is a wall of fire whose top edge wanders
    float wd = mix(.50, .26, pow(y, mix(.6, 1.4, fract(sd*3.7))));
    float top = .62+.6*(fbm3(vec2(xs*1.15+sd*9., t*.22))-.5)+.3*(vnoise(vec2(xs*3.1+sd*3., t*.5))-.5);
    float yy = mix(y, clamp(y/max(top, .2), 0., 1.5), curt);
    float r = abs(xw)/wd, r2 = r*r*(1.-curt);
    // licks: noise that climbs faster than the flame sways and tears it, more and more toward the tip
    float e = fbm3(vec2(xw*mix(3., 1.6, curt)+sd*17., y*mix(1.6, 1.5, curt)-t*2.4));
    // streaks inside the body, so that even its root is never one flat brightness
    float e3 = fbm3(vec2(xw*mix(5.5, 4.5, curt)+sd*5., y*mix(2.4, 1.6, curt)-t*3.3));
    float f = 1.-r2*.9-yy*mix(1.1, 1., curt)*mix(.8, 1.25, fract(sd*5.1))+(e-.5)*(.8+2.3*yy)+(e3-.5)*.7*yy-(1.-e3)*yy*.45*(1.-curt);
    I = clamp(f*1.12, 0., 1.)*mix(.62+.75*e3, .30+1.4*e3, curt)-vLy*.06;
    // nothing reaches the quad's edge, and the root dissolves instead of standing on a line
    float rootN = fbm3(vec2(xs*1.7+sd*5., t*.3));
    float fade = smoothstep(mix(0., .34*rootN-.06, curt), mix(.16, .12+.42*rootN, curt), y)*(1.-smoothstep(.75, 1., y))*(1.-smoothstep(.7, 1., abs(x)));
    I = clamp(I, 0., 1.)*fade;
    // a flame cools as it climbs: white-gold only at its root, orange through its body, red at the tip
    T = I*(1.-mix(.55, .70, curt)*smoothstep(.05, .85, yy))*(1.-.45*(1.-curt)*smoothstep(.15, .9, r))*mix(1., .42+.5*e, curt);
  }
  // the firebox burns hottest: white-gold fire seen from the snow. Up the kiln a tongue is a small relative of the
  // river: a saturated orange body, a white-gold core only at its root, red where it tears away
  float fb0 = max(step(vFl.x, 12.), step(3.5, ty)*step(ty, 4.5));           // the firebox, and the burst of a jar going over
  float fbx = max(fb0, vAir);                                               // and resinous pine flaring in the air (its colours only)
  vec3 root = uGold*vec3(1.6, 1.0, .24)*mix(1., 1.3, fbx);
  // a few flames carry salt and ash: their tips and edges burn blue-green
  float salt = step(.80, fract(sd*11.3))*step(ty, 6.5)*smoothstep(.30, .75, y);
  vec3 tipc = mix(vec3(.34, .030, .006), vec3(.03, .40, .40), salt*.7);
  vec3 bodyc = mix(uOrange*vec3(.88, .56, .45), uOrange*vec3(1.15, .9, .6), fbx);
  vec3 hotc = mix(mix(tipc, bodyc, smoothstep(.05+.06*salt, .42+.08*salt, T)), root*mix(1., .8, step(7.5, ty)), smoothstep(mix(.78, .60, fbx), 1., T));
  vec3 coldc = mix(uEmber*.8, uOrange*vec3(.95, .62, .5), smoothstep(.25, .9, T));
  vec3 c = mix(coldc, hotc, vHot);
  float a = smoothstep(.02, mix(.7, .5, fb0), I); a *= a*(1.5-.5*a);
  a *= vGain*(ty > 1.5 && ty < 2.5 ? smoothstep(10., 24., vDist) : smoothstep(4., 24., vDist));
  c = sceneFog(c, vP, vDist);
  gl_FragColor = vec4(c*a, clamp(a, 0., 1.)*(.60+.37*smoothstep(.45, .95, I)));
}`,Po=`
varying vec3 vL; varying vec3 vN; varying vec3 vW;
void main(){
  vL = position; vN = mat3(modelMatrix)*normal;
  vec4 wp = modelMatrix*vec4(position, 1.); vW = wp.xyz;
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,Ao=`
${De}
uniform float uCatch;
varying vec3 vL; varying vec3 vN; varying vec3 vW;
void main(){
  vec3 N = normalize(vN+vec3(0., 1e-5, 0.));
  float grain = vnoise(vec2(vL.x*.35, (vL.y+vL.z)*5.)), n = fbm3(vL.xy*1.4+vL.z);
  float endg = smoothstep(4.6, 4.95, abs(vL.x));
  vec3 wood = mix(vec3(.50, .36, .20), vec3(.72, .58, .36), endg)*(.7+.5*grain);
  vec3 col = wood*mix(uOrange, uGold, .4)*(.35+.5*max(N.y, 0.)+.25*max(-N.y, 0.));
  float chk = vnoise(vec2(vL.x*.5, (vL.y-vL.z)*4.));
  float crack = smoothstep(.60, .68, chk)*(1.-smoothstep(.70, .80, chk));        // long checks along the grain
  float pulse = .65+.35*sin(uTime*9.+vL.x*3.)*sin(uTime*5.+vL.y*7.);
  float charK = uCatch*smoothstep(.75-.7*uCatch, 1.05-.7*uCatch, n+.25*grain);   // it chars in patches, the pale wood showing between
  col = mix(col, vec3(.05, .026, .018)*(.6+.8*grain), charK*.9);
  col += mix(uEmber*1.3, uOrange*1.5, pulse)*crack*uCatch*(.5+.5*charK)+uOrange*uCatch*uCatch*endg*.9;
  gl_FragColor = vec4(col, 1.);
}`;function zo(){const o=new He,t=10,a=1.25,e=4,f=[[0,0,-.7,-.7]];for(let r=0;r<=4;r++){const i=r/4*Math.PI*.55+.25;f.push([Math.cos(i)*a,Math.sin(i)*a,Math.cos(i),Math.sin(i)])}const v=f.length+1;for(let r=0;r<=e;r++)for(let i=0;i<v;i++){const n=f[i%f.length],c=(r/e-.5)*t;o.v(c,n[1]-a*.45,n[0]-a*.45,0,n[3],n[2],c,i,3,.3)}o.grid(0,e+1,v);for(const r of[0,e]){const i=o.count,n=r===0?-1:1;for(let c=0;c<f.length;c++)o.v(n*t/2,f[c][1]-a*.45,f[c][0]-a*.45,n,0,0,c,0,3,1);for(let c=1;c<f.length-1;c++)o.tri(i,i+c,i+c+1)}return o.build()}function So(o){const t=new g.InstancedBufferGeometry,a=[],e=[];for(const c of[2,1,0]){const h=a.length/3;a.push(-.5,0,c,.5,0,c,.5,1,c,-.5,1,c),e.push(h,h+1,h+2,h,h+2,h+3)}t.setAttribute("position",new g.Float32BufferAttribute(a,3)),t.setIndex(e);const f=o.length,v=new Float32Array(f*3),r=new Float32Array(f*3),i=new Float32Array(f*2),n=new Float32Array(f*4);return o.forEach((c,h)=>{v.set(c.pos,h*3),r.set(c.axis||[0,1,0],h*3),i.set([c.w,c.h],h*2),n.set([c.d,c.seed,c.type,c.gain??1],h*4)}),t.setAttribute("aPos",new g.InstancedBufferAttribute(v,3)),t.setAttribute("aAxis",new g.InstancedBufferAttribute(r,3)),t.setAttribute("aSize",new g.InstancedBufferAttribute(i,2)),t.setAttribute("aFl",new g.InstancedBufferAttribute(n,4)),t.instanceCount=f,t}const Co=`
attribute vec3 aPos; attribute vec4 aInfo; attribute float aPart;
uniform float uFront, uTime;
varying vec3 vP; varying vec3 vN; varying float vD; varying float vDist; varying float vBead;
void main(){
  float d = aInfo.x, sd = aInfo.y, len = aInfo.z, th = aInfo.w;
  float hot = smoothstep(uFront+8., uFront-22., d);
  vec3 p = position;
  if (aPart > .5){
    float ph = fract(uTime*(.09+.07*sd)+sd*7.3);
    float sz = th*.42*hot*smoothstep(0., .08, ph)*(1.-ph*.6), fall = len*1.02+ph*ph*38.;
    sz *= smoothstep(.6, 2.5, length((modelViewMatrix*vec4(aPos.x, aPos.y-fall, aPos.z, 1.)).xyz));        // the kit's near law for small falling things (its own two numbers): a bead shrinks to nothing as it nears the eye
    p = p*vec3(sz, sz*1.7, sz); p.y -= fall;
  } else {
    float st = 1.+.24*hot*(.5+.5*sin(uTime*(.5+sd)+sd*30.));
    p.xz *= th*(1.+.6*smoothstep(-.25, 0., p.y)); p.y *= len*st;
  }
  p += aPos;
  vP = p; vN = normal; vD = d; vBead = aPart;
  vec4 mv = modelViewMatrix*vec4(p, 1.);
  vDist = length(mv.xyz);
  gl_Position = projectionMatrix*mv;
}`,Fo=`
${De}
${Ke}
uniform sampler2D tProf; uniform vec3 uWH; uniform vec2 uSecD;   // the river's own: the vault's profile along the kiln, its width over height by section
varying vec3 vP; varying vec3 vN; varying float vD; varying float vDist; varying float vBead;
void main(){
  vec3 N = normalize(vN+vec3(0., 1e-5, 0.));
  vec3 Vv = uCamL-vP; vec3 V = Vv/max(length(Vv), 1e-3);
  float heat = heatAt(vD), ndv = clamp(dot(N, V), 0., 1.);
  vec3 fc = fireCol(vD);
  vec3 alb = vec3(.10, .092, .036);
  vec3 col = alb*kilnLight(N, vD);
  col += mix(uOrange, fc, .3)*heat*(.02+.34*pow(1.-ndv, 2.5))*(1.+2.4*vBead)*mix(vec3(1.), vec3(1., .62, .3), vBead);          // molten glass: lit edges
  col += uEmber*(1.-heat)*pow(1.-ndv, 3.)*.25;
  // a drip hangs in the river that runs along the crown, front passed or not: the brown glass takes the fire's light as
  // amber, strongest under the crown, half at four tenths of the vault's half-width at the drip's place and all but gone
  // by the flanks (narrower than the vault's own light: about the river's body overhead), breathing with the fire;
  // a falling bead keeps its own light
  float wv = max(textureLod(tProf, vec2(vD/${we}., .5), 0.).g*(vD < uSecD.x ? uWH.x : (vD < uSecD.y ? uWH.y : uWH.z)), 1.), ax = vP.x/wv;
  float rv = riverOn(vD)*exp(-4.08*ax*ax)*(.62+.76*riverNoise(vec2(vP.x*.6, vD+7.)))*(1.-vBead);
  col += vec3(1., .46, .13)*rv*(.26+.4*pow(1.-ndv, 2.))*uFire;
  col = kilnHaze(col, vD, vDist);
  col = sceneFog(col, vP, vDist);
  gl_FragColor = vec4(col, 1.);
}`;function Do(o){const t=ge([[0,-1,0],[.115,-.93,0],[.085,-.72,0],[.11,-.36,0],[.2,-.08,0],[.44,.03,0]],5),a=ge([[0,-.07,1],[.065,0,1],[0,.07,1]],4),e=Gt([t,a]),f=new g.InstancedBufferGeometry;f.setAttribute("position",e.getAttribute("position")),f.setAttribute("normal",e.getAttribute("normal")),f.setAttribute("aPart",e.getAttribute("aPart")),f.setIndex(e.getIndex());const v=o.length,r=new Float32Array(v*3),i=new Float32Array(v*4);return o.forEach((n,c)=>{r.set(n.pos,c*3),i.set([n.d,n.seed,n.len,n.th],c*4)}),f.setAttribute("aPos",new g.InstancedBufferAttribute(r,3)),f.setAttribute("aInfo",new g.InstancedBufferAttribute(i,4)),f.instanceCount=v,f.userData.tris=e.getIndex().count/3,f}const No=`
attribute vec4 aInfo; attribute float aSpike; attribute float aH; attribute vec3 aBase;
uniform float uFront; uniform vec3 uCones;
varying vec3 vP; varying vec3 vN; varying float vD; varying float vSpike; varying float vDist; varying float vBend;
void main(){
  vec3 p = position, n = normal; float d = aInfo.x, bend = 0.;
  if (aSpike > .5){
    float k = aInfo.y > .5 ? (aSpike < 1.5 ? uCones.x : aSpike < 2.5 ? uCones.y : uCones.z) : clamp((uFront-d-(aSpike-1.)*4.+3.)/7., 0., 1.);
    bend = k*k*(3.-2.*k);
    float a = bend*2.15*pow(aH, 1.35);
    float c = cos(a), s = sin(a);
    vec3 r = p-aBase; p = aBase+vec3(r.x*c+r.y*s, -r.x*s+r.y*c, r.z);
    n = vec3(n.x*c+n.y*s, -n.x*s+n.y*c, n.z);
  }
  vec4 lp = instanceMatrix*vec4(p, 1.);
  vP = lp.xyz; vN = mat3(instanceMatrix)*n; vD = d; vSpike = aSpike; vBend = bend;
  vec4 mv = modelViewMatrix*lp;
  vDist = length(mv.xyz);
  gl_Position = projectionMatrix*mv;
}`,To=`
${De}
${Ke}
varying vec3 vP; varying vec3 vN; varying float vD; varying float vSpike; varying float vDist; varying float vBend;
void main(){
  vec3 N = normalize(vN+vec3(0., 1e-5, 0.));
  float heat = heatAt(vD);
  vec3 fc = fireCol(vD);
  float n = vnoise(vP.xz*3.+vP.y*2.);
  vec3 alb = vSpike > .5 ? mix(vec3(.22, .12, .07), vec3(.19, .095, .055), .3*vSpike-.2) : uClay*.95;
  alb *= .8+.4*n;
  vec3 col = alb*kilnLight(N, vD);
  col += mix(uOrange, fc, .25)*alb*(heat*.45+vBend*.7)*uFire*(vSpike > .5 ? 1.6 : 1.);
  col = kilnHaze(col, vD, vDist);
  col = sceneFog(col, vP, vDist);
  gl_FragColor = vec4(col, 1.);
}`;function Eo(){const o=[],t=[],a=[],e=[],f=(d,y,w,p,T,k,S,M)=>{o.push(...d,...y,...w),t.push(p,p,p),a.push(T,k,S),e.push(...M,...M,...M)},v=(d,y,w,p,T,k,S,M)=>{f(d,y,w,T,k,k,S,M),f(d,w,p,T,k,S,S,M)},r=[-1.5,-1.15,1.15,1.5],i=[.22,.52,.52,.22],n=[0,0,0];for(let d=0;d<3;d++){const y=r[d],w=r[d+1],p=i[d],T=i[d+1],k=.72,S=.38;v([y,0,p],[w,0,T],[w*.95,S,T*k],[y*.95,S,p*k],0,0,0,n),v([w,0,-T],[y,0,-p],[y*.95,S,-p*k],[w*.95,S,-T*k],0,0,0,n),v([y*.95,S,p*k],[w*.95,S,T*k],[w*.95,S,-T*k],[y*.95,S,-p*k],0,0,0,n)}v([r[0],0,-i[0]],[r[0],0,i[0]],[r[0]*.95,.38,i[0]*.72],[r[0]*.95,.38,-i[0]*.72],0,0,0,n),v([r[3],0,i[3]],[r[3],0,-i[3]],[r[3]*.95,.38,-i[3]*.72],[r[3]*.95,.38,i[3]*.72],0,0,0,n);const c=5,h=1.6;for(let d=0;d<3;d++){const y=-.85+d*.85,w=[y,.3,0],p=k=>{const S=k/c,M=_(.19,.035,S),W=.3+h*S,K=.16*h*S,F=[];for(let u=0;u<3;u++){const P=u*2.094+.5+d;F.push([y+K+Math.cos(P)*M,W,Math.sin(P)*M])}return F};for(let k=0;k<c;k++){const S=p(k),M=p(k+1);for(let W=0;W<3;W++){const K=(W+1)%3;v(S[K],S[W],M[W],M[K],d+1,k/c,(k+1)/c,w)}}const T=p(c);f(T[0],T[2],T[1],d+1,1,1,1,w)}const l=new g.BufferGeometry;return l.setAttribute("position",new g.Float32BufferAttribute(o,3)),l.setAttribute("aSpike",new g.Float32BufferAttribute(t,1)),l.setAttribute("aH",new g.Float32BufferAttribute(a,1)),l.setAttribute("aBase",new g.Float32BufferAttribute(e,3)),l.computeVertexNormals(),l}function at(o,t,a,e,f=0){const v=o.swell(t,a),r={x:0,y:0},i={x:0,y:0};he(t.W*v+f,t.H*v+f,e,r),he(t.W*v+f,t.H*v+f,e+.02,i);const n=new g.Vector3(r.x,r.y+o.floorY(a),-a),c=new g.Vector3(i.x-r.x,i.y-r.y,0).normalize();c.y<0&&c.negate();const h=new g.Vector3(0,t.slope,-1).normalize(),l=new g.Vector3().crossVectors(h,c).normalize();return l.x*r.x>0&&l.negate(),{P:n,tu:c,td:h,n:l}}function Io(o,t){const a=wt(3,7.6,10),e=(r,i,n)=>{const c=t.P.clone().addScaledVector(t.td,r).addScaledVector(t.tu,i).addScaledVector(t.n,n);return[c.x,c.y,c.z]},f=[t.n.x,t.n.y,t.n.z],v=r=>Math.max(r.y,0)-3.2;for(let r=0;r<a.length-1;r++){const i=a[r],n=a[r+1],c=e(i.x,v(i),1.5),h=e(n.x,v(n),1.5),l=e(i.x+i.nx*1,v(i)+i.ny*1,1.5),d=e(n.x+n.nx*1,v(n)+n.ny*1,1.5),y=e(i.x+i.nx*1.7,v(i)+i.ny*1.7,-.8),w=e(n.x+n.nx*1.7,v(n)+n.ny*1.7,-.8),p=e(i.x,v(i),.35),T=e(n.x,v(n),.35);G(o,c,h,d,l,4,0,[1,1,1],null,f),G(o,l,d,w,y,4,0,[.8,.8,.8],null,f),G(o,c,h,T,p,4,0,[.5,.5,.5],null,f);const k=e(0,0,.35);G(o,p,T,k,k,1,0,[1.6,1.6,1.6],[[i.x,v(i)],[n.x,v(n)],[0,0],[0,0]],f)}}function Vo(o,t,a,e,f=!0){const v=new He,r=new g.Color(e).lerp(new g.Color("#b08a6a"),.45),i={x:0,y:0},n={x:0,y:0},c=(u,P,m,x)=>{const A=.72+.4*(.5+.5*a.n3(u*.07,P*.07,m*.07))-.25*Math.max(0,a.n3(u*.3,P*.3,m*.3));return[r.r*A*x,r.g*A*x,r.b*A*x]},h=28,l=wt(8,20,h),d=5,y=1.5,w=v.count;for(let u=0;u<=h;u++){const P=l[u],m=Math.PI*u/h,x=Math.cos(m),A=Math.sin(m),N=31*Math.sign(x)*Math.pow(Math.abs(x),.45),R=u===0||u===h?-5:35*Math.pow(Math.max(A,0),.45);for(let O=0;O<d;O++){const B=Math.pow(O/(d-1),1.5),V=_(P.x,N,B),E=_(P.y,R,B),q=Z(Math.exp(-Math.max(E-15,0)/13)*Math.exp(-V*V/160)*1.2+Math.exp(-(O/(d-1))*5),0,1),J=c(V,E,y,1-.9*q);v.v(V,E,y+(O===0?0:.4*Math.sin(B*3.1)),0,0,1,V,E,0,0,J[0],J[1],J[2])}}v.grid(w,h+1,d,!0);for(const u of o.secs){const x=v.count;for(let N=0;N<6;N++){const R=_(u.d0,u.d1,N/5),O=o.swell(u,R),B=o.floorY(R);for(let V=0;V<15;V++){const E=Math.PI*V/14;he(u.W*O+2.6,u.H*O+2.6,E,i);const q=.62+.38*Y(.2,.75,Math.sin(E)),J=c(i.x,i.y+B,R,q);v.v(i.x,i.y+B-(V===0||V===14?6:0),-R,0,1,0,E*30,R,0,0,J[0],J[1],J[2])}}v.grid(x,6,15,!0);const A=o.secs[o.secs.indexOf(u)+1];if(A){const N=v.count,R=o.floorY(u.d1);for(let O=0;O<15;O++){const B=Math.PI*O/14,V=O===0||O===14?6:0;he(u.W*o.swell(u,u.d1)+2.6,u.H*o.swell(u,u.d1)+2.6,B,i),he(A.W*o.swell(A,A.d0)+2.6,A.H*o.swell(A,A.d0)+2.6,B,n);const E=c(i.x,i.y+R,u.d1,.7),q=c(n.x,n.y+R,u.d1,.7);v.v(i.x,i.y+R-V,-u.d1+.9,0,0,1,i.x,i.y,0,0,E[0],E[1],E[2]),v.v(n.x,n.y+R-V,-u.d1+.7,0,0,1,n.x,n.y,0,0,q[0],q[1],q[2]),v.v(n.x,n.y+R-V,-u.d1,0,0,1,n.x,n.y,0,0,q[0],q[1],q[2])}v.grid(N,15,3,!0)}}if(!f)return v;const p=o.secs[o.secs.length-1],T=v.count,k=o.swell(p,p.d1);for(let u=0;u<15;u++){he(p.W*k+2.6,p.H*k+2.6,Math.PI*u/14,n);const P=c(n.x,n.y,3,.8);v.v(n.x,n.y+o.fEnd,-o.end-.5,0,0,-1,n.x,n.y,0,0,P[0],P[1],P[2]),v.v(n.x*.5,n.y*.5+o.fEnd+8,-o.end-1.2,0,0,-1,n.x,n.y,0,0,P[0],P[1],P[2])}v.grid(T,15,2);const S=v.count,M=new g.Vector3;for(let u=0;u<=4;u++)for(let P=0;P<=4;P++){const m=_(6,t.length,u/4),x=t.half(m)+1.8,A=[[x,-x],[x,x],[-x,x],[-x,-x],[x,-x]][P];M.copy(t.T).addScaledVector(t.axis,m).addScaledVector(t.v,A[1]),M.x+=A[0];const N=c(M.x,M.y,M.z,.75-.4*Y(.6,1,u/4));v.v(M.x,M.y,M.z,0,1,0,P*10,m,0,0,N[0],N[1],N[2])}v.grid(S,5,5,!0);const W=v.count,K=t.half(t.length),F=K+1.8;for(let u=0;u<=4;u++)for(const P of[K,F]){const m=[[P,-P],[P,P],[-P,P],[-P,-P],[P,-P]][u];M.copy(t.T).addScaledVector(t.axis,t.length).addScaledVector(t.v,m[1]),M.x+=m[0],v.v(M.x,M.y,M.z,0,1,0,u*10,P,0,0,.5,.52,.56)}return v.grid(W,5,2,!0),v}const Ro=[[0,30],[.1,34],[.143,44],[.18,100],[.25,160],[.32,218],[.39,268],[.44,292],[.47,302],[.5,310],[.58,326],[.627,352],[.67,404],[.74,430],[.8,440],[.82,443],[.87,447],[1,452]];function Mt(o,t){if(t<=o[0][0])return o[0][1];for(let a=1;a<o.length;a++)if(t<=o[a][0]){const e=o[a-1],f=o[a];return _(e[1],f[1],(t-e[0])/Math.max(1e-6,f[0]-e[0]))}return o[o.length-1][1]}async function Wo(o,t={}){const a=(t.palette&&t.palette.length>=7?t.palette:Qt).map(s=>new g.Color(s)),e=o.rng.fork("moon-jar-kiln-hero"),f=o.noise,v=o.quality?.detail??1,r=Zt(),i=ro(r),n=new g.Group;n.name="moon-jar-kiln";const c=r.secs[7],h=c.d0+42,l=12,d=c.f0+.345*l,y=new g.Vector3(0,d+.49*l,-h),w=Z((t.warmth??0)+e.range(-1,1)*(t.warmth===void 0?.5:.2),-1,1),p=Math.max(w,0),T=Math.max(-w,0),k=a[3].clone().lerp(a[4],.1+.3*p).lerp(new g.Color("#fff3d6"),.32*T),S=a[4].clone().lerp(a[5],.06+.36*p).lerp(a[3],.22*T),M={uFront:{value:310},uTime:{value:0},uFlueD:{value:r.end},uFlueR:{value:t.flueReach??104},uFire:{value:t.intensity??1},uHaze:{value:t.haze??1},uCamL:{value:new g.Vector3(0,9,60)},uGold:{value:k},uOrange:{value:S},uEmber:{value:a[5].clone()},uSkyCol:{value:t.flueLight?new g.Color(t.flueLight):a[0].clone().lerp(a[1],.45)},uSoot:{value:a[2].clone().multiplyScalar(2.6)},uClay:{value:a[6].clone()},uInside:{value:0},uLead:{value:0},uCool:{value:new g.Color(0,0,0)},uShaft:{value:[0,1,2,3,4].map(()=>new g.Vector4(0,-999,0,1))}};M.uCool.value.copy(M.uSkyCol.value).lerp(new g.Color("#4a3fd0"),.55).multiplyScalar(.9);const W={value:new g.Vector4(0,-(c.d0+42),13.5,0)},K={value:0},F={value:0},u={value:new g.Vector3},P={value:t.spyJets??0},m={value:new g.Vector2},x=(s,b,z={},D={})=>new g.ShaderMaterial({uniforms:{...M,...oo(),...z},vertexShader:s,fragmentShader:b,fog:!0,...D}),A=s=>s<=3?0:s<=6?1:s<=9?2:3,N=[new He,new He,new He,new He],R=[],O=[],B=[],V=e.fork("aisle");for(let s=0;s<r.secs.length;s++){const b=r.secs[s],z=N[A(s)];if(ao(z,r,b,f),await o.yield(),so(z,r,b,e),await o.yield(),no(z,r,b,V),s>0&&s<12&&Kt(z,r,r.walls[s-1],R),await o.yield(),b.kind!=="firebox")for(const D of[1,-1]){const C=_(b.d0,b.d1,.5)+e.range(-3,3),H=D>0?.72:Math.PI-.72,I=at(r,b,C,H);Io(z,I),O.push({position:I.P.clone().addScaledVector(I.n,2),normal:I.n.clone(),d:C,side:D});const L=at(r,b,C+9,D>0?.95:Math.PI-.95,2.8);B.push({position:L.P.clone(),normal:L.n.clone().negate(),d:C+9,side:D})}await o.yield()}Kt(N[0],r,{d:1,f:0,W:17,H:27,archW:8,archH:20,index:0,up:r.secs[0],down:r.secs[0]},null,[-1]),lo(N[0],e),io(N[3],r,i);const E=new g.Vector3(6.3,c.f0+3.6,-(h+5.7));{const s=N[2],b=14,z=[[1.9,0],[1.9,.7],[1.45,.75],[1.45,2.3],[1.6,2.35],[1.6,3.6],[0,3.6]],D=s.count;for(let C=0;C<z.length;C++)for(let H=0;H<=b;H++){const I=H/b*Math.PI*2,[L,U]=z[C],$=C>=z.length-2,se=.5+.12*Math.sin(I*3+C);s.v(E.x+Math.cos(I)*L,c.f0+U,E.z+Math.sin(I)*L,$?0:Math.cos(I)*.95,$?1:.3,$?0:Math.sin(I)*.95,I*2,U,4,0,se,se*.93,se*.86)}s.grid(D,z.length,b+1)}await o.yield();const q=po(r),J=x(eo,to,{tProf:{value:q},uPool:W},{side:g.DoubleSide});let de=0;const X=[];for(const s of N){const b=new g.Mesh(await s.buildSlowly(o),J);b.name="kiln-shell",n.add(b),X.push(b),de+=s.triangles,await o.yield()}const Q=x(co,ho,{uGreat:K,uCollapse:F,uJarGlow:{value:t.jarGlow??1},uDetail:{value:1},tNoise:{value:null}}),ue=ge(_e(5,2,!0),24),ke=ge(_e(3,1,!0),16),Me=ge(_e(2,0,!0),10),Pe=ge(uo(),10),ie=ge(fo(),14),Ye=ge(_e(16,2,"drum"),64),Ae=new g.Matrix4,Ne=new g.Quaternion,xe=new g.Euler,ze=new g.Vector3,ve=new g.Vector3,ne=(s,b,z)=>{const D=new g.BufferGeometry;D.setAttribute("position",s.getAttribute("position")),D.setAttribute("normal",s.getAttribute("normal")),D.setAttribute("aPart",s.getAttribute("aPart")),D.setIndex(s.getIndex());const C=new Float32Array(b.length*4),H=new g.InstancedMesh(D,Q,b.length);return b.forEach((I,L)=>{xe.set(I.tx,I.yaw,I.tz),Ne.setFromEuler(xe),H.setMatrixAt(L,Ae.compose(ze.set(I.x,I.y,I.z),Ne,ve.set(I.S*I.sx,I.S*I.sy,I.S*I.sz))),C.set([I.d,I.delay,I.kind,I.seed],L*4)}),D.setAttribute("aInfo",new g.InstancedBufferAttribute(C,4)),H.instanceMatrix.needsUpdate=!0,H.computeBoundingSphere(),H.name=z,H.userData.tris=s.getIndex().count/3*b.length,H},Pt=Math.floor(e()*3),st=[.3,.07,.17][Pt],jt=[.05,.3,.17][Pt],$e=[],nt=[],rt=[];let ee=null;for(let s=1;s<r.secs.length;s++){const b=r.secs[s],z=be(b),D=[];for(const L of[1,-1])for(let U=0;U<3;U++){const $=e(),se=b.kind==="great"&&U===0||s===3&&L<0&&U<2,le=!se&&$<st&&s<10,ce=!se&&$>=st&&$<st+jt,Ve=e.range(.9,1);for(let pe=0;pe<z.n;pe++){const Re=b.d0+re/2+(pe+.5)*z.pitch+(U===1?.45:-.25),Ce=(le?6.6:ce?7.2:8)*Ve*e.range(.94,1.03)*(s>=11&&pe+U&1?.52:1),fe={x:L*z.xs[U]+e.range(-.25,.25),y:Le(r,b,pe,U)+.105*Ce,z:-Re,S:Ce,yaw:e()*6.283,tx:e.range(-.03,.03),tz:e.range(-.03,.03),sx:e.range(.975,1.025),sy:le?e.range(.8,1.25):ce?e.range(.9,1.2):e.range(.93,1.04),sz:e.range(.975,1.025),d:Re,delay:U*2.2+e.range(0,2.5),kind:le?2:0,seed:e()};b.kind==="great"&&L<0&&U===0&&pe===4&&(ee=fe,t.rare&&(fe.kind=3,fe.yaw=1.05,fe.tx=0,fe.tz=0)),(le?nt:ce?rt:D).push(fe)}}const C=new g.Vector3(0,r.floorY((b.d0+b.d1)/2)+10,-(b.d0+b.d1)/2);await o.yield();const H=ne(ue,D,"jars-hi");await o.yield();const I={sec:b,center:C,level:-1,lods:[H,ne(ke,D,"jars-mid"),ne(Me,D,"jars-lo")]};I.lods.forEach((L,U)=>{L.visible=U===2,n.add(L)}),$e.push(I),await o.yield()}const At=ne(Ye,[{x:0,y:d,z:-h,S:l,yaw:e()*6.283,tx:e.range(-.012,.012),tz:e.range(-.012,.012),sx:1,sy:e.range(.97,1.02),sz:e.range(.985,1),d:h,delay:0,kind:1,seed:e()}],"great-jar");n.add(At);let We=null;nt.length&&(We=ne(Pe,nt,"saggars"),n.add(We));let Be=null;rt.length&&(Be=ne(ie,rt,"bowl-stacks"),n.add(Be)),await o.yield();let Te;{const s=Jt(Xt("moon-jar-kiln-flue-ware:"+o.seed)),b=[],z=[];Lt(i).forEach((D,C)=>{const H=.82*D.S+.8,I=Math.floor(2*(D.h-.5*D.S-.9)/H)+1;for(let L=0;L<I;L++){const U=!(L+C&1),$=D.S*(U?s.range(.88,1.05):s.range(.62,.78));(U?b:z).push({x:(L-(I-1)/2)*H+s.range(-.3,.3),y:D.y+.105*$,z:D.z+.5*D.S+.35+s.range(0,.4),S:$,yaw:s()*6.283,tx:s.range(-.03,.03),tz:s.range(-.03,.03),sx:s.range(.975,1.025),sy:U?s.range(.9,1.08):s.range(.85,1.2),sz:s.range(.975,1.025),d:r.end+40,delay:0,kind:0,seed:s()})}}),Te=[ne(ue,b,"flue-ware"),ne(ie,z,"flue-bowls")],n.add(Te[0],Te[1])}await o.yield();const it=await go(o,e.fork("flame-noise"));Q.uniforms.tNoise.value=it;const zt=[new g.Vector4(1,0,8,12)];for(const s of r.walls)zt.push(new g.Vector4(s.d,s.f,s.archW,s.archH-s.archW));const Ue=x(xo,yo,{uRiver:{value:t.river??1},tProf:{value:q},tNoise:{value:it},uWall:{value:zt},uSteps:{value:Math.max(14,Math.round(32*v))},uRiverEnd:{value:r.end},uWH:{value:new g.Vector3(r.secs[0].W/r.secs[0].H,r.secs[1].W/r.secs[1].H,r.secs[8].W/r.secs[8].H)},uSecD:{value:new g.Vector2(r.secs[0].d1,r.secs[7].d1)}},{transparent:!0,depthWrite:!1,side:g.DoubleSide,blending:g.CustomBlending,blendSrc:g.OneFactor,blendDst:g.OneMinusSrcAlphaFactor,blendEquation:g.AddEquation}),Ge=[];let lt=0;for(const s of r.secs){const b=wo(r,s),z=new g.Mesh(b,Ue);z.name="flame-river",z.renderOrder=2,n.add(z),lt+=b.getIndex().count/3,Ge.push({mesh:z,d0:s.d0,dc:(s.d0+s.d1)/2,cap:!1})}for(let s=0;s<r.walls.length;s++){const b=bo(r,s),z=new g.Mesh(b,Ue),D=r.secs[s],C=r.secs[s+1];z.name="flame-river-cap",z.renderOrder=2,n.add(z),lt+=b.getIndex().count/3,Ge.push({mesh:z,d0:r.walls[s].d,dc:r.walls[s].d,cap:!0,dcLo:(D.d0+D.d1)/2,dcHi:(C.d0+C.d1)/2})}await o.yield();const te=[];for(const s of R){const b=e.chance(.3),z=s.wall===7?1.7:1;te.push({pos:[s.x+e.range(-.4,.4),s.y+.2,-(s.d+.9)],w:(b?e.range(6,8.5):e.range(4.5,8))*(z>1?1.3:1),h:(b?e.range(11,15):e.range(4.5,9.5))*z,d:s.d,seed:e(),type:0}),e.chance(.34)&&te.push({pos:[s.x+e.range(-1.4,1.4),s.y+.1,-(s.d+2.6)],w:e.range(5,8),h:e.range(3.5,6.5),d:s.d,seed:e(),type:0,gain:.8})}{const s=r.walls[7],b=be(c);for(const C of[1,-1])for(let H=0;H<6;H++){const I=C*(13.5+4.6*H+e.range(-.8,.8));te.push({pos:[I,bt(r,c,b.n-1,I)+.2,-(s.d-re/2-1.1)],w:e.range(7,10.5),h:e.range(9,21),d:s.d-7,seed:e(),type:0})}const z=(C,H,I,L,U,$,se)=>{const le=at(r,C,H,I,-.6),ce=new g.Vector3(L[0],L[1],L[2]).sub(le.P),Ve=ce.length();ce.normalize(),te.push({pos:[le.P.x,le.P.y,le.P.z],axis:[ce.x,ce.y,ce.z],w:U,h:Ve,d:H,seed:e(),type:9,gain:$}),se>=0&&M.uShaft.value[se].set(L[0],L[1],L[2],U*1.5)},D=c.f0+.3;z(c,h+16,Math.PI-1,[-9.5,D,-(h-4)],3,.27,0),z(c,h-22,1.05,[14,D,-(h-13)],2.6,.21,1),z(c,h+26,.98,[11,D,-(h+13)],3,.27,2);{const C=(H,I,L)=>i.T.clone().addScaledVector(i.axis,H).addScaledVector(i.v,L).add(new g.Vector3(I,0,0));for(const[H,I,L,U]of[[C(64,-7,6.5),C(22,11,-10),6.4,0],[C(63.5,7,6),C(31,-10.5,-7.5),5.2,0]]){const $=I.clone().sub(H),se=$.length();$.normalize(),te.push({pos:[H.x,H.y,H.z],axis:[$.x,$.y,$.z],w:L,h:se,d:r.end+20,seed:e(),type:9,gain:U})}}for(const C of[4,10,12]){const H=r.secs[C],I=C===4?1:-1,L=_(H.d0,H.d1,.62),U=L-9;z(H,L,I>0?1:Math.PI-1,[-I*5,r.floorY(U)+.3,-U],C===12?3:2,C===12?.36:C>8?.3:.22,C===12?3:-1)}{const C=r.secs[12],H=_(C.d0,C.d1,.36),I=H-8;z(C,H,.95,[-6.5,r.floorY(I)+.3,-I],3.4,.4,4)}}for(let s=0;s<22;s++){const b=e.range(-12.5,12.5),z=Math.abs(b)<5.5;te.push({pos:[b,e.range(1.2,3.2),-e.range(7,33)],w:e.range(6,11),h:z?e.range(3.5,5):e.range(8,17),d:10,seed:e(),type:2})}for(let s=0;s<8;s++){const b=s%2?1:-1;te.push({pos:[b*e.range(9.5,13.5),e.range(.6,2.2),-e.range(22,34)],w:e.range(6,9),h:e.range(10,18),d:10,seed:e(),type:2,gain:e.range(.85,1.1)})}for(let s=0;s<7;s++)te.push({pos:[-7+s*2.3+e.range(-.9,.9),e.range(.5,2.6),-e.range(4.5,11)],w:e.range(6,11),h:e.range(6.5,17),d:2,seed:e(),type:2,gain:e.range(.85,1.2)});for(const s of[[-19,40,15,.4],[-29,44,19,.62]])te.push({pos:[e.range(-.6,.6),.5,s[0]],w:s[1],h:s[2],d:2,seed:e(),type:8,gain:s[3]});for(const s of B)te.push({pos:[s.position.x,s.position.y,s.position.z],axis:[s.normal.x,s.normal.y,s.normal.z],w:4.2,h:20,d:s.d,seed:e(),type:3});if(ee&&te.push({pos:[ee.x-1.5,ee.y-.5,ee.z+1.5],w:12,h:16,d:ee.d,seed:e(),type:4,gain:t.rare?1.05:0}),ee&&t.rare){const s=e.fork("collapse-sparks");for(let b=0;b<110;b++){const z=s()*Math.PI*2,D=s.range(3,11),C=s.range(.38,.9);te.push({pos:[ee.x,ee.y+1.5,ee.z],axis:[Math.cos(z)*D,s.range(5.5,14),Math.sin(z)*D],w:C,h:C,d:ee.d,seed:s(),type:7,gain:2})}}const me=[5,9].map((s,b)=>{const z=O[Math.min(s,O.length-1)],D=z.position.clone().addScaledVector(z.normal,-3),C=new g.Vector3(z.side*14,r.floorY(z.d)+1.5,-z.d);te.push({pos:[C.x,C.y-1.2,C.z],w:9,h:16,d:z.d,seed:.37+.41*b,type:5+b,gain:1.15});for(const[H,I]of[[-3.4,.54],[3.3,.72]])te.push({pos:[C.x,C.y-1.2,C.z],axis:[H,0,0],w:6,h:11,d:z.d,seed:I+.177*b,type:5.25+b,gain:1.1});return{S:D,E:C,d:z.d,side:z.side,mesh:null,mat:null,P:{value:new g.Vector4(C.x,C.y-1.2,C.z,0)},A:{value:new g.Vector3(0,1,0)},X:{value:new g.Vector3(1,0,0)}}}),qt=x(ko,Mo,{uJets:P,uCollapse:F,uLogs:m,uLogP0:me[0].P,uLogP1:me[1].P,uLogA0:me[0].A,uLogA1:me[1].A,uLogX0:me[0].X,uLogX1:me[1].X},{transparent:!0,depthWrite:!1,side:g.DoubleSide,blending:g.CustomBlending,blendSrc:g.OneFactor,blendDst:g.OneMinusSrcAlphaFactor,blendEquation:g.AddEquation}),Je=new g.Mesh(So(te),qt);Je.name="flame-tongues",Je.frustumCulled=!1,Je.renderOrder=3,n.add(Je),await o.yield();const _t=zo();for(const s of me)s.mat=new g.ShaderMaterial({uniforms:{...M,uCatch:{value:0}},vertexShader:Po,fragmentShader:Ao,side:g.DoubleSide}),s.mesh=new g.Mesh(_t,s.mat),s.mesh.name="thrown-split",s.mesh.visible=!1,s.mesh.position.copy(s.S),n.add(s.mesh);const ct=[];for(let s=1;s<r.secs.length;s++){const b=r.secs[s],z=Math.round((b.kind==="great"?28:16)*v);for(let D=0;D<z;D++){const C=e.range(b.d0+5,b.d1-5),H=e.range(-1,1),I=Math.PI/2+H*Math.abs(H)*.85,L=at(r,b,C,I);ct.push({pos:[L.P.x,L.P.y-.15,L.P.z],d:C,seed:e(),len:e.range(4,9)*(1-.4*Math.abs(H)),th:e.range(1.7,3.2)})}}const St=Do(ct),ht=new g.Mesh(St,x(Co,Fo,{tProf:Ue.uniforms.tProf,uWH:Ue.uniforms.uWH,uSecD:Ue.uniforms.uSecD}));ht.name="ash-drips",ht.frustumCulled=!1,n.add(ht);const Ee=[];for(let s=1;s<r.secs.length;s++){const b=r.secs[s];if(b.kind==="great")continue;const z=be(b);for(const D of[1,-1]){const C=b.d0+re/2+2.2+e.range(0,1.5);Ee.push({x:D*(z.edges[0]-1.4),y:r.floorY(C)-.05,z:-C,s:1.7,yaw:Math.PI/2+e.range(-.3,.3),d:C,great:0})}}Ee.push({x:E.x,y:E.y,z:E.z,s:1.5,yaw:Math.PI/2+.5,d:h,great:1});const ft=Eo(),Ct=new Float32Array(Ee.length*4),je=new g.InstancedMesh(ft,x(No,To,{uCones:u},{side:g.DoubleSide}),Ee.length);Ee.forEach((s,b)=>{xe.set(0,s.yaw,0),Ne.setFromEuler(xe),je.setMatrixAt(b,Ae.compose(ze.set(s.x,s.y,s.z),Ne,ve.set(s.s,s.s,s.s))),Ct.set([s.d,s.great,e(),0],b*4)}),ft.setAttribute("aInfo",new g.InstancedBufferAttribute(Ct,4)),je.instanceMatrix.needsUpdate=!0,je.frustumCulled=!1,je.name="cone-packs",n.add(je),await o.yield();let Xe=null;if(t.exterior!==!1){const s=Vo(r,i,f,"#"+a[6].getHexString(),t.exteriorBack!==!1);Xe=new g.Mesh(await s.buildSlowly(o,!0),new g.MeshStandardMaterial({vertexColors:!0,roughness:1,metalness:0,side:g.DoubleSide})),Xe.name="kiln-exterior",n.add(Xe),de+=s.triangles,await o.yield()}const oe=9,j=(s,b,z)=>new g.Vector3(s,b,z),ae=[j(0,oe,112.5),j(0,oe,60),j(0,oe,0),j(0,8.5,-18)],Ie={mouth:2,walls:[],orbit:[0,0],throat:0},Ft=[[0,7.5],[0,5.5],[0,6],[1.5,7],[.5,7.5],[-2.5,8.5],[-5,14],[-1.5,11],[.5,9.5],[-1,12],[-1.2,13.5],[-.8,10.5],[0,9]];for(let s=0;s<7;s++){const b=r.walls[s],z=Ft[s*2];if(Ie.walls.push(ae.length),ae.push(j(z[0],b.f+z[1],-b.d)),s<6){const D=(b.d+r.walls[s+1].d)/2,C=Ft[s*2+1];ae.push(j(C[0],r.floorY(D)+C[1],-D))}}const Dt=18.5,dt=[],Nt=[[1.06,0],[1.05,3],[1.13,8.5],[1.08,9.5],[1.06,10.5],[1.08,10],[1.05,8.5],[1.2,5],[1.12,3.5]];for(let s=0;s<=8;s++){const b=s/8*Math.PI*2,z=Dt*Nt[s][0];dt.push(j(Math.sin(b)*z-(s===0?2.5:0),c.f0+oe+Nt[s][1],-h+Math.cos(b)*z))}ae.push(j(-1,c.f0+oe,-(h-31))),Ie.orbit[0]=ae.length,ae.push(...dt),Ie.orbit[1]=ae.length-1,ae.push(j(20.5,c.f0+oe+3.5,-(h-9)),j(22.5,c.f0+oe+3,-(h+6)),j(11,c.f0+oe+1.5,-(h+24.5)));const Tt=[[0,9],[-3,8.5],[-.5,10.5],[1.5,11],[.5,17],[-3.5,14.5],[-1.5,17.5],[.5,25],[0,21.5],[0,10]];for(let s=7;s<12;s++){const b=r.walls[s],z=Tt[(s-7)*2];Ie.walls.push(ae.length),ae.push(j(z[0],b.f+z[1],-b.d));const D=s<11?(b.d+r.walls[s+1].d)/2:(b.d+r.end)/2,C=Tt[(s-7)*2+1];s<11&&ae.push(j(C[0],r.floorY(D)+C[1],-D))}const qe=i.T.clone().addScaledVector(i.axis,i.length);Ie.throat=ae.length,ae.push(i.T.clone(),i.T.clone().addScaledVector(i.axis,30),qe.clone());const Yt={fireMouth:{position:j(0,10,1.5),normal:j(0,0,1),width:16,height:20},flyThrough:ae,marks:Ie,pathHeight:oe,greatJar:{center:y.clone(),radius:l/2,base:j(0,d,-h),top:j(0,d+.985*l,-h),floorY:c.f0},orbit:{center:y.clone(),radius:Dt,points:dt},conePack:E.clone().add(j(0,1.5,0)),collapseJar:ee?j(ee.x,ee.y+ee.S*.5,ee.z):null,arches:r.walls.map(s=>({position:j(0,s.f+oe,-s.d),d:s.d,sillY:s.f,halfWidth:s.archW,height:s.archH})),chambers:r.secs.map((s,b)=>({index:b,kind:s.kind,d0:s.d0,d1:s.d1,floor0:s.f0,floor1:s.f1,halfWidth:s.W,height:s.H,center:j(0,(s.f0+s.f1)/2+oe,-(s.d0+s.d1)/2)})),flue:{throat:i.T.clone(),top:qe.clone(),axis:i.axis.clone(),halfThroat:15,halfTop:9,length:i.length},portalSeat:{position:qe.clone(),normal:i.axis.clone().negate(),axis:i.axis.clone(),width:18,pitch:40},stokePorts:O,spyHoles:B,floorPorts:R.map(s=>j(s.x,s.y,-(s.d+.9))),viewpoints:[{name:"fromTheSnow",position:j(0,9,110),target:j(0,10,0)},{name:"nestedArches",position:j(0,r.floorY(135)+oe,-135),target:j(0,r.floorY(215)+oe,-215)},{name:"greatJarAhead",position:j(0,c.f0+oe,-(h-30)),target:y.clone()},{name:"lookBack",position:y.clone().add(j(-5,3.5,-13)),target:j(-2,r.floorY(190)+oe,-190)},{name:"emberChamber",position:j(0,r.floorY(465)+oe,-465),target:i.T.clone()},{name:"flue",position:i.T.clone().addScaledVector(i.axis,18),target:qe.clone()}]};let ut=t.frontKeys||Ro,Et=t.greatMelt||[.5,.58],vt=t.greatMeltKeys||null,Se=t.coneAt||[.53,.56,.59],mt=t.collapseAt??.6,Qe=!1;const pt=s=>{M.uFront.value=Mt(ut,s),M.uLead.value=58*(1-Y(392,452,M.uFront.value)),K.value=vt?Mt(vt,s):Y(Et[0],Et[1],s),W.value.w=Y(0,.75,K.value),u.value.set(Y(Se[0]-.008,Se[0]+.018,s),Y(Se[1]-.008,Se[1]+.018,s),Y(Se[2]-.008,Se[2]+.018,s)),F.value=t.rare?Y(mt-.012,mt+.034,s):0};pt(.54);const ye=new g.Vector3,gt={object:n,radius:2.6,height:10,center:y.clone(),extent:{min:j(-45,-6,-(r.end+50)),max:j(45,qe.y+6,3),length:r.end,rise:r.fEnd},anchors:Yt,ground:!1,groundY:0,uniforms:{...M,uGreat:K,uCollapse:F,uCones:u,uJets:P,uLogs:m},floorY:s=>r.floorY(s),frontAt:s=>Mt(ut,s),setKeys(s){s.frontKeys&&(ut=s.frontKeys),s.greatMeltKeys&&(vt=s.greatMeltKeys),s.coneAt&&(Se=s.coneAt),s.collapseAt!==void 0&&(mt=s.collapseAt)},setProgress(s){Qe=!0,pt(Z(s,0,1))},setFront(s){Qe=!0,M.uFront.value=s,M.uLead.value=58*(1-Y(392,452,s))},setGreatMelt(s){Qe=!0,K.value=Z(s,0,1),W.value.w=Y(0,.75,K.value)},setCones(s,b,z){u.value.set(s,b,z)},setCollapse(s){F.value=Z(s,0,1)},setSpyJets(s){P.value=s},setLogDrop(s,b){const z=me[s];if(!z)return;const D=b>.001&&b<1.02;z.mesh.visible!==D&&(z.mesh.visible=D),m.value.setComponent(s,Y(.1,.45,b)*(1-Y(1.5,3,b)));const C=Z(b,0,1),H=z.mesh,I=z.S,L=z.E,U=D?1-Y(.8,1,C):0,$=_(I.x,L.x,C),se=_(I.y,L.y,C*C),le=_(I.z,L.z,C),ce=L.x-I.x,Ve=2*C*(L.y-I.y),pe=L.z-I.z,Re=Math.hypot(ce,Ve,pe)||1;let Ce=-ce/Re*U,fe=-Ve/Re*U+(1-.5*U),Ze=-pe/Re*U;const xt=Math.hypot(Ce,fe,Ze)||1;Ce/=xt,fe/=xt,Ze/=xt,z.A.value.set(Ce,fe,Ze),z.P.value.set(_(L.x,$-Ce*2,U),_(L.y-1.2,se-fe*2,U),_(L.z,le-Ze*2,U),U),D&&(H.position.set($,se,le),H.rotation.set(.4+C*2.6*z.side,.3+C*1.1,z.side*(.5-C*1.9)),H.scale.setScalar(1-.5*Y(.85,1.02,C)),z.X.value.set(1,0,0).applyEuler(H.rotation),z.mat.uniforms.uCatch.value=Y(.2,.8,C))},logDrops:me.map(s=>({d:s.d,side:s.side,from:s.S.clone(),to:s.E.clone()})),setFlueLight(s){M.uSkyCol.value.set(s)},setIntensity(s){M.uFire.value=s},stats:{triangles:0,drawCalls:0},update(s,b,z){M.uTime.value=b,Qe||pt(.5+.13*(b/40%1)),ye.setFromMatrixPosition(z.matrixWorld),n.worldToLocal(ye),M.uCamL.value.copy(ye),M.uInside.value=Y(7,-9,ye.z);for(const D of Ge){const C=D.d0<M.uFront.value+M.uLead.value+32;D.mesh.visible!==C&&(D.mesh.visible=C);const H=D.cap?Math.abs((-ye.z<D.d0?D.dcHi:D.dcLo)+ye.z)-.5:Math.abs(D.dc+ye.z);D.mesh.renderOrder=2.9-Math.min(H,800)*.001}for(const D of $e){const C=ye.distanceTo(D.center),H=D.sec.kind==="great"?84:46,I=C<H?0:C<108?1:2;I!==D.level&&(D.level=I,D.lods[0].visible=I===0,D.lods[1].visible=I===1,D.lods[2].visible=I===2)}},dispose(){ue.dispose(),ke.dispose(),Me.dispose(),Pe.dispose(),ie.dispose(),Ye.dispose(),q.dispose(),it.dispose()}},$t=$e.map(s=>s.lods.map(b=>b.userData.tris));let It=0;return $t.forEach((s,b)=>{It+=b<2?s[0]:b<4?s[1]:s[2]}),gt.stats.triangles=Math.round(de+It+At.userData.tris+(We?We.userData.tris:0)+lt+(Be?Be.userData.tris:0)+Te[0].userData.tris+Te[1].userData.tris+te.length*6+ct.length*St.userData.tris+Ee.length*ft.getAttribute("position").count/3),gt.stats.drawCalls=X.length+$e.length+1+(We?1:0)+(Be?1:0)+Ge.length+3+(Xe?1:0)+2+Te.length,gt}export{Wo as buildHero,_e as jarProfile,ge as latheGeometry};
