import*as t from"three";import{mergeGeometries as qo}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as Z,lerp as no,smoothstep as To}from"../kit/core.js";const E=Math.PI*2,Eo=["#0B0B0E","#8F9BA1","#DCE4E6","#C8983A","#2C4F93","#2E5B45","#B3261E"],B=240,Io=150,Ae=45,so=.39,L=new t.Vector3(0,290,-225),$=new t.Vector3(0,400,-34),ge=L.distanceTo($),M=$.clone().sub(L).normalize(),Q=new t.Vector3(0,268,-215),U=10,Le=.42,N=16,we=L.clone().addScaledVector(M,Le*ge);function Fe(e,o,a,s){const c=io(e,o,a);co(c,s,0,o);const l=fo(c);return l.computeVertexNormals(),l}async function lo(e,o,a,s,c,l=4){const r=io(e,o,a);for(let d=0;d<=o;d+=l)co(r,s,d,Math.min(d+l-1,o)),await c();const h=fo(r);return await c(),h.computeVertexNormals(),h}function io(e,o,a){const s=a?e:e+1,c=s*(o+1);return{nU:e,nV:o,wrapU:a,cols:s,pos:new Float32Array(c*3),col:new Float32Array(c*3),dat:new Float32Array(c*4),o:{p:[0,0,0],c:[1,1,1],d:[0,0,0,0]}}}function co({nU:e,nV:o,cols:a,pos:s,col:c,dat:l,o:r},h,d,f){for(let n=d;n<=f;n++)for(let p=0;p<a;p++){const u=n*a+p;r.d[0]=r.d[1]=r.d[2]=r.d[3]=0,r.c[0]=r.c[1]=r.c[2]=1,h(p/e,n/o,r,p,n),s[u*3]=r.p[0],s[u*3+1]=r.p[1],s[u*3+2]=r.p[2],c[u*3]=r.c[0],c[u*3+1]=r.c[1],c[u*3+2]=r.c[2],l[u*4]=r.d[0],l[u*4+1]=r.d[1],l[u*4+2]=r.d[2],l[u*4+3]=r.d[3]}}function fo({nU:e,nV:o,wrapU:a,cols:s,pos:c,col:l,dat:r}){const h=new Uint32Array(e*o*6);let d=0;for(let n=0;n<o;n++)for(let p=0;p<e;p++){const u=a?(p+1)%e:p+1,g=n*s+p,y=n*s+u,i=(n+1)*s+p,k=(n+1)*s+u;h[d++]=g,h[d++]=y,h[d++]=i,h[d++]=y,h[d++]=k,h[d++]=i}const f=new t.BufferGeometry;return f.setAttribute("position",new t.BufferAttribute(c,3)),f.setAttribute("color",new t.BufferAttribute(l,3)),f.setAttribute("aData",new t.BufferAttribute(r,4)),f.setIndex(new t.BufferAttribute(h,1)),f}function b(e,o={}){const a=o.seg||32,s=o.sq||2,c=e.length-1,l=o.color,r=o.flutes,h=(d,f,n,p,u)=>{const g=d*E,y=e[u];let i=y[0];const k=Math.cos(g),C=Math.sin(g);if(s!==2&&(i*=Math.pow(Math.pow(Math.abs(k),s)+Math.pow(Math.abs(C),s),-1/s)),r&&y[1]>=r.y0&&y[1]<=r.y1&&(i*=1-r.depth*Math.pow(Math.abs(Math.sin(g*r.n*.5)),r.pow||1.6)),n.p[0]=k*i,n.p[1]=y[1],n.p[2]=C*i,l){const z=l(f,g,y[1]);n.c[0]=z[0],n.c[1]=z[1],n.c[2]=z[2]}typeof o.data=="function"?o.data(f,g,y[1],n.d):o.data&&(n.d[0]=o.data[0],n.d[1]=o.data[1],n.d[2]=o.data[2],n.d[3]=o.data[3])};return o.tick?lo(a,c,!0,h,o.tick):Fe(a,c,!0,h)}function se(e,o,a={}){const s=a.along||48,c=a.around||14,l=new t.CatmullRomCurve3(e.map(d=>d.isVector3?d:new t.Vector3(d[0],d[1],d[2])),!1,"centripetal"),r=l.computeFrenetFrames(s,!1),h=new t.Vector3;return Fe(c,s,!0,(d,f,n,p,u)=>{l.getPointAt(f,h);const g=r.normals[u],y=r.binormals[u],i=o(f),k=d*E,C=Math.cos(k),z=Math.sin(k);if(n.p[0]=h.x+i*(C*g.x+z*y.x),n.p[1]=h.y+i*(C*g.y+z*y.y),n.p[2]=h.z+i*(C*g.z+z*y.z),a.color){const q=a.color(f,k);n.c[0]=q[0],n.c[1]=q[1],n.c[2]=q[2]}a.data&&(n.d[0]=a.data[0],n.d[1]=a.data[1],n.d[2]=a.data[2],n.d[3]=a.data[3])})}const uo=new t.Quaternion,Lo=new t.Matrix4,ho=new t.Vector3(0,1,0),Ho=new t.Vector3(1,1,1);function P(e,o,a,s=0){return s&&e.rotateY(s),a&&(uo.setFromUnitVectors(ho,a.clone().normalize()),e.applyMatrix4(Lo.compose(new t.Vector3,uo,Ho))),e.translate(o.x,o.y,o.z),e}function ue(e){const o=qo(e,!1);for(const a of e)a.dispose();return o}const Re=e=>{const o=new t.Color(e);return[o.r,o.g,o.b]},S=(e,o)=>[e[0]*o,e[1]*o,e[2]*o],He=(e,o,a)=>[e[0]+(o[0]-e[0])*a,e[1]+(o[1]-e[1])*a,e[2]+(o[2]-e[2])*a];function Go(e=.62){const a=(1+e*e)/(2*e),s=e-a,c=Math.asin(Math.min(1,1/a)),l=[0,e,0],r=[0,1,0],h=[],d=[.4,.76,1];for(let n=0;n<d.length;n++)for(let p=0;p<10;p++){const u=p/10*E+n*.31,g=c*d[n],y=Math.sin(g),i=Math.cos(g);l.push(a*y*Math.cos(u),Math.max(0,s+a*i),a*y*Math.sin(u)),r.push(y*Math.cos(u),i,y*Math.sin(u))}for(let n=0;n<10;n++){const p=(n+1)%10;h.push(0,1+p,1+n);for(let u=0;u<d.length-1;u++){const g=1+u*10+n,y=1+u*10+p,i=1+(u+1)*10+n,k=1+(u+1)*10+p;h.push(g,y,k,g,k,i)}}const f=new t.BufferGeometry;return f.setAttribute("position",new t.Float32BufferAttribute(l,3)),f.setAttribute("normal",new t.Float32BufferAttribute(r,3)),f.setIndex(h),f}const xe=new t.Vector3(1,0,0),he=new t.Vector3().crossVectors(M,xe).normalize();function Wo(e){const o=Math.min(e,1);return 9+116*(.2*o+.8*Math.pow(o,3.1))}function J(e,o,a){const s=Math.min(e,1),c=Math.pow(Math.abs(Math.cos(o*U*.5)),.72),l=.02+.115*s*s+.085*Math.sin(Math.PI*s);let r=Wo(e)*(1-l+l*1.5*c),h=s*ge+9*s*s*s*(c-.5);if(e>1){const n=(e-1)/.08,p=n*Math.PI*1.25,u=4.2+1.6*c;r+=u*Math.sin(p),h+=-u*(1-Math.cos(p))}const d=Math.cos(o),f=Math.sin(o);return a.x=L.x+M.x*h+r*(d*xe.x+f*he.x),a.y=L.y+M.y*h+r*(d*xe.y+f*he.y),a.z=L.z+M.z*h+r*(d*xe.z+f*he.z),a}const le=`
uniform mat3 uStageInv; uniform vec3 uStagePos;
uniform vec3 uSkyCol, uRiftCol, uGardenCol, uRoofCol, uWallCol, uDadoCol, uClothCol, uKeyDir, uKeyCol, uAmbCol;
uniform float uFlash, uTime;
float h11(float n){ n = fract(n*.1031); n *= n + 33.33; n *= n + n; return fract(n); }
float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y)*p3.z); }
float h31(vec3 p){ p = fract(p*.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y)*p.z); }
float n11(float x){ float i = floor(x), f = fract(x); f = f*f*(3.-2.*f); return mix(h11(i), h11(i+1.), f); }
float n21(vec2 x){ vec2 i = floor(x), f = fract(x); f = f*f*(3.-2.*f);
  return mix(mix(h21(i), h21(i+vec2(1.,0.)), f.x), mix(h21(i+vec2(0.,1.)), h21(i+vec2(1.,1.)), f.x), f.y); }
// what a surface sees in stage-space direction d; rough 0 mirror .. 1 blurred
vec3 roomEnv(vec3 d, float rough){
  float e = d.y, hl = max(length(d.xz), 1e-4);
  vec2 h = d.xz/hl;
  float az = h.x, sf = .025 + rough*.45;
  float front = smoothstep(-.12 - sf, .22 + sf, h.y);
  float cl = sin(az*5. + e*9. + uTime*.05)*sin(az*11. - e*17. + 1.7)*.5 + .5;
  vec3 sky = uSkyCol*(.66 + .46*cl*(1.-rough));
  float de = e - .09;
  float rift = exp(-de*de/(.004 + rough*.05))*exp(-az*az/(.16 + rough*.3))*step(0., h.y);
  sky += uRiftCol*rift;
  // above the rift the cloud is torn into a paler seam: the wedge of light that lies along the shellac
  float seam = exp(-az*az/(.010 + .05*e*e + rough*.2))*smoothstep(.02, .14, e)*(1. - smoothstep(.34, .72, e))*step(0., h.y);
  sky += uRiftCol*seam*.6*(.7 + .5*cl);
  float tree = .15 + .06*sin(az*13. + sin(uTime*1.3 + az*4.)*.7) + .035*sin(az*37. + uTime*2.3) + .02*sin(az*71. - uTime*3.1);
  float gm = 1. - smoothstep(tree - .02 - sf*.5, tree + .02 + sf*.5, e);
  sky = mix(sky, uGardenCol*(.7 + .5*n11(az*23. + uTime*.4)), gm*.86);
  sky *= 1. + .10*(1.-rough)*sin(az*90. + sin(e*40. - uTime*9.)*2.);
  float bal = smoothstep(-.20 - sf, -.15 + sf, e);
  vec3 c = mix(uWallCol*.3*(.55 + .45*step(.5, fract(az*16.))), sky, bal);
  // the posts of the open front stand dark against the sky
  float pz = h.x/max(h.y, .2);
  float pp = abs(fract((pz + .5)/.769 + .5) - .5)*.769;
  c = mix(c, uWallCol*(.34 + .2*e), (1. - smoothstep(.04 - sf*.2, .064 + sf*.6, pp))*step(.2, h.y)*.92);
  float dado = smoothstep(.10 - sf, .13 + sf, e);
  vec3 dd = uDadoCol*(.42 + .2*sin(az*26.)*sin(e*34.)) + uWallCol*.3*(.4 + .6*step(.8, fract(az*6.5)));
  dd = mix(uWallCol*.42*(.8 + .3*n11(az*9.)), dd, smoothstep(-.06 - sf, -.03 + sf, e));
  float door = (1. - smoothstep(.06, .08 + sf, abs(abs(az) - .42)))*(1. - smoothstep(.30 - sf, .33 + sf, e))*step(h.y, 0.);
  vec3 wall = mix(mix(dd, uWallCol*(.8 + .2*e), dado), uGardenCol*.55*(.7 + .3*step(.5, fract(e*40.))), door);
  c = mix(wall, c, front);
  float roof = smoothstep(.44 - sf, .52 + sf, e);
  vec3 rf = uRoofCol*(.85 + .3*smoothstep(.25, .75, abs(fract(d.x/max(e, .2)*1.5) - .5)*2.)*(1. - rough)) + uSkyCol*.06*front;
  c = mix(c, rf, roof);
  float dn = 1. - smoothstep(-.52 - sf, -.30 + sf, e);
  c = mix(c, uClothCol*(.55 + .45*front), dn);
  return c*(1. + uFlash*3.);
}
// soft daylight arriving on a matte surface with stage-space normal n
vec3 roomIrr(vec3 n){
  float f = clamp(n.z*.5 + .5, 0., 1.), up = n.y*.5 + .5;
  return (uSkyCol*(.07 + .5*f*f)*(.55 + .45*up) + uSkyCol*.2*max(n.y, 0.) + uClothCol*.16*(1.-up) + uKeyCol*max(dot(n, uKeyDir), 0.) + uAmbCol)*(1. + uFlash*3.);
}
// rain beads that sit on a surface: object-space cell noise. returns xyz = normal push, w = mask
vec4 beadField(vec3 p, float cell, float amount, float px){
  vec3 q = p/cell, i = floor(q), f = fract(q) - .5;
  float k = h31(i);
  vec3 o = (vec3(h31(i + 7.3), h31(i + 13.9), h31(i + 21.1)) - .5)*.5;
  float rr = .08 + .16*h31(i + 3.7), dd = length(f - o);
  float m = (1. - smoothstep(rr*.82, rr, dd))*step(1. - amount, k)*(1. - smoothstep(.2, .8, px/(rr*cell)));
  return vec4((f - o)/rr, m);
}
`,be=(e,o)=>`
attribute vec4 aData;
varying vec3 vWPos, vWNrm, vCol, vOPos; varying vec4 vData;
${e}
void main(){
  vCol = color; vData = aData; vOPos = position;
  vec4 wp = modelMatrix*vec4(position, 1.);
  vWPos = wp.xyz; vWNrm = mat3(modelMatrix)*normal;
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  ${o}
}`,mo=e=>`
varying vec3 vWPos, vWNrm, vCol, vOPos; varying vec4 vData;
uniform vec3 uHornAxis, uThroat, uHX, uHY, uThroatCol; uniform float uSwell, uBeadAmt, uBandGold, uSeat, uRingK, uMirK; uniform mat4 modelMatrix;
${le}
${e}
// engraving: an incised line of half-width w about d = 0 (aa = one pixel in the same units)
float cut(float d, float w, float aa){ return 1. - smoothstep(w, w + aa, abs(d)); }
// a chased band round the bore at depth c: two ruled lines each side and a braid of two crossing waves between
float chase(float dpv, float c, float ang, float aa){
  float hw = .019, w = (dpv - c)/hw, lw = .12, a1 = aa/hw*1.2;
  float edge = cut(abs(w) - 1., lw, a1) + cut(abs(w) - 1.34, lw*.6, a1);
  float wave = sin(ang*12.5663706);
  float braid = (cut(w - .62*wave, lw*1.5, a1) + cut(w + .62*wave, lw*1.5, a1))*step(abs(w), 1.);
  float pearl = (1. - smoothstep(.16, .16 + a1, length(vec2((fract(ang*2. + .25) - .5)*1.6, w))))*step(abs(w), 1.);
  return clamp(edge + braid + pearl, 0., 1.)*(1. - smoothstep(.45, 1.5, a1/lw));
}
void main(){
  vec3 N = normalize(vWNrm);
  bool back = !gl_FrontFacing;
  if(back) N = -N;
  vec3 V = normalize(cameraPosition - vWPos);
  vec3 Ns = normalize(uStageInv*N), Vs = normalize(uStageInv*V);
  float rough = vData.x, wear = vData.y, depth = vData.z, mica = step(.5, vData.w);
  float inside = (back && depth > -.5) ? 1. : 0.;
  vec3 F0 = vCol;
  float px = length(fwidth(vOPos));
  // lacquer: slow mottling, pale wear on the ribs, tarnish, polishing scratches
  float mot = n21(vOPos.xy*.07 + vOPos.z*.05)*.6 + n21(vOPos.zy*.31 + 9.)*.4;
  float w = clamp(wear*(1. - mica)*(.6 + .8*mot), 0., 1.);
  F0 = mix(F0*(.82 + .3*mot), mix(F0, vec3(.90, .80, .56), .38), w);
  float tar = smoothstep(.5, .9, n21(vOPos.xz*.06 + vOPos.y*.05 + 3.)*.6 + n21(vOPos.zy*.23 + vOPos.x*.19)*.4)*(1. - mica)*mix(1., .35, step(-.5, depth));
  float scr = n21(vec2(dot(vOPos, vec3(6.1, 2.7, 4.3)), dot(vOPos, vec3(.13, -.21, .16))))*.6 + n21(vec2(dot(vOPos, vec3(-3.3, 5.9, 2.1)), dot(vOPos, vec3(.17, .09, -.2))))*.4;
  float nearK = 1. - smoothstep(.02, .12, px);
  F0 *= mix(vec3(1.), vec3(.66, .5, .36), tar*.42);
  rough = clamp(rough + .18*w + .05*mot + .16*tar + .10*(scr - .5)*nearK, .02, 1.);
  Ns = normalize(Ns + (vec3(n21(vOPos.yz*1.9), n21(vOPos.zx*1.9 + 5.), n21(vOPos.xy*1.9 + 9.)) - .5)*.035*nearK*(1. - mica));
  // mica diaphragm: target rings that flutter
  float rings = 0.;
  float rr = wear*9.;
  float fw = max(fwidth(rr), 1e-4);
  if(mica > .5){
    rings = smoothstep(.5 - fw, .5 + fw, abs(fract(rr) - .5)*2.);
    float fl = sin(wear*46. - uTime*31.)*.5 + sin(wear*17. + uTime*23.)*.5;
    Ns = normalize(Ns + vec3(0., 1., 0.)*fl*.07*(1. - wear) + vec3(.06, 0., .04)*sin(uTime*37.)*(1. - wear));
    F0 = mix(vec3(.42, .37, .26), vec3(.70, .66, .52), rings);
    rough = .06;
  }
  // rain beads lying on the metal
  vec4 bd = beadField(vOPos, 2.6, uBeadAmt*(1. - mica), px);
  vec4 bd2 = beadField(vOPos + 11.3, .9, uBeadAmt*.7*(1. - mica), px);
  float bm = max(bd.w, bd2.w);
  vec3 bn = bd.w > bd2.w ? bd.xyz : bd2.xyz;
  Ns = normalize(Ns + uStageInv*(mat3(modelMatrix)*bn)*.8*bm);
  rough = mix(rough, .03, bm);
  float ndv = max(dot(Ns, Vs), 0.);
  vec3 R = reflect(-Vs, Ns);
  float fr = 1. - ndv; fr = fr*fr*fr*fr*fr;
  vec3 F = F0 + (1. - F0)*fr;
  vec3 env = roomEnv(R, rough);
  env = mix(vec3(dot(env, vec3(.3, .55, .15))), env, .5);            // a grey sky must not turn the gold olive
  // streaks stretched along the flutes (the garden smeared down each rib)
  float st = n21(vec2(vOPos.x*.9 + vOPos.z*.4, depth*5.))*.6 + n21(vec2(vOPos.x*2.9 - vOPos.y*1.3, depth*11.))*.4;
  env *= mix(1., .78 + .44*st, step(-.5, depth)*(1. - bm));
  vec3 col;
  if(inside > .5){
    // inside the bell: ten flutes like the ribs of a gold canyon. Light fails with depth from pale gold to deep
    // bronze; worn crests stand bright, the beds sink, one flank of every rib lies in its own shade. Each flute is a
    // long hollow mirror: the opening behind the viewer (sky rift, thrashing garden, posts, balustrade, cloth) lies
    // in it warped and stretched; chased bands and shell fans are cut into the brass; and the music comes up the
    // bore as rings of light from the collar where the portal sits.
    float dp = max(depth, 0.);
    float dq = clamp((dp - uSeat)/(1. - uSeat), 0., 1.);              // 0 at the collar .. 1 at the mouth
    float lit = mix(.36, 1., pow(dq, 1.2));
    float lum = dot(uSkyCol, vec3(.3, .55, .15));
    vec3 q = vOPos - uThroat;
    vec3 qr = q - uHornAxis*dot(q, uHornAxis);
    float rr0 = max(length(qr), 1.);
    vec3 rad = qr/rr0;
    float th = atan(dot(qr, uHY), dot(qr, uHX) + 1e-4);
    float a10 = (th/6.2831853 + .5)*10. + .5;
    float fx = fract(a10) - .5, fid = floor(a10);                     // across one flute (0 = its bed), and which flute
    float ridge = 1. - pow(abs(cos(th*5.)), .72);                     // 0 in the bed .. 1 on the rib that stands into the bore
    float crest = smoothstep(.3, .96, ridge), bed = 1. - smoothstep(0., .55, ridge);
    vec3 et = cross(uHornAxis, rad);
    float flank = clamp(dot(Ns, et)*3.2, -1., 1.);
    float deep = 1. - .55*dq;                                         // the relief reads harder the deeper we are
    vec3 gold = F0*vec3(1.18, 1.1, .9);
    float form = mix(1., .42, bed*deep)*(1. + 1.05*crest)*(1. + .7*flank*(1. - .6*crest));
    vec3 glow = mix(gold, gold*vec3(.78, .46, .24), bed*deep*.9)*lum*.46*form*(.84 + .3*mot);
    // the veranda in the brass: a fisheye of the opening, bent again by every flute
    // (round the rim the cloth and the balustrade, then the thrashing garden, then the sky with its rift and the
    // posts as dark spokes; each flute holds its own strip of it, turned by where the flute stands round the bore)
    float thr = atan(dot(qr, uHX), dot(qr, uHY) + 1e-4);              // 0 at the top petal
    float mA = thr*.3 + fx*(.95 + .4*flank*flank), mE = mix(.47, -.13, smoothstep(.4, 1., dq)) + .04*flank - .05*cos(thr);
    vec3 md = vec3(sin(mA)*cos(mE), sin(mE), cos(mA)*cos(mE));
    vec3 mir = roomEnv(md, .17 + .1*crest);
    mir = mix(vec3(dot(mir, vec3(.3, .55, .15))), mir, 1.25);
    vec3 tintG = mix(vec3(1.), gold*1.5, .4 + .55*uBandGold);
    float mw = smoothstep(.34, .66, dq)*(1. - .45*crest)*uMirK;
    glow = mix(glow, max(mir, 0.)*tintG*(.6 + .32*form)*(.82 + .26*st), mw*.8);
    float shim = .5 + .5*sin(dp*38. - uSwell*6.2832);
    glow *= 1. + .3*shim*shim*shim*crest;
    float run = max(sin(dp*17. + uTime*1.15 + fid*2.4), 0.); run *= run; run *= run; run *= run;
    glow += gold*lum*.45*run*crest*(.75 + .25*dq);
    float out1 = smoothstep(.2, .85, dot(R, uHornAxis));
    // brass tints what it mirrors: the silver sky lies on the petals as pale gold, never as grey
    col = mix(glow, env*mix(F, F0*1.25, .7)*mix(vec3(1.), F0*1.3, .6), out1*.8)*lit;
    col *= mix(vec3(.8, .45, .22), vec3(1.), sqrt(lit));
    // engraving: chased bands round the bore, a ruled line each side of every rib, a shell fan in each bed at the rim
    float dD = px/${ge.toFixed(1)}, dA = px/rr0*1.5915;
    float e0 = chase(dp, uSeat + .08, a10, dD) + chase(dp, .66, a10, dD) + chase(dp, .835, a10, dD) + chase(dp, .955, a10, dD)*.8;
    float e1 = chase(dp + .0026, uSeat + .08, a10, dD) + chase(dp + .0026, .66, a10, dD) + chase(dp + .0026, .835, a10, dD);
    float ribl = cut(abs(fx) - .405, .011, dA)*(1. - smoothstep(.45, 1.5, dA/.011))*smoothstep(.02, .1, dq);
    float fanw = (fx/.3)*(fx/.3);
    float fan = cut(fract(fx*26.) - .5, .14, dA*26.)*(1. - smoothstep(.45, 1.5, dA*26./.14))*step(abs(fx), .3)
      *smoothstep(.862 + .05*fanw, .868 + .05*fanw, dp)*(1. - smoothstep(.925 - .03*fanw, .93 - .03*fanw, dp));
    float eng = clamp(e0 + ribl + fan*.8, 0., 1.);
    col *= 1. - .52*eng;
    col += gold*lum*lit*.34*clamp(e1 - e0, 0., 1.);
    // the music: rings of light that leave the collar and run up the bore, some loud, some soft
    float ph = uTime*.8 - dq*2.3 - .03*ridge;
    float rid = floor(ph), rf = fract(ph);
    float loud = .3 + .7*h11(rid*1.37 + 2.)*(.55 + .45*step(.5, fract(rid*.5)));
    float rq = (rf - .5)/.034;
    float ringL = exp(-rq*rq)*loud*smoothstep(.0, .08, dq)*(1. - .4*dq)*uRingK;
    col *= 1. + 2.4*ringL*(.6 + .5*crest + .2*flank);
    col += mix(uThroatCol*1.2, gold*lum, .6)*ringL*.55*(.5 + .6*crest);
    // the collar: the bore's last few metres burn with what lies beyond the portal, and its warmth creeps up the ribs
    float far = smoothstep(45., 260., length(cameraPosition - (modelMatrix*vec4(uThroat + uHornAxis*(uSeat*${ge.toFixed(1)}), 1.)).xyz));
    col += uThroatCol*exp(-dq*11.)*(.55 + .5*crest + .2*flank)*(.7 + .3*mot)*(1. + .8*far);
    col += uThroatCol*vec3(1., .86, .62)*exp(-dq/.15)*.32*(.4 + .6*far)*(.5 + .6*crest + .2*flank);
  } else {
    col = env*F*mix(vec3(1.), F0*1.35, .4) + F0*roomIrr(Ns)*.17;
    vec3 H = normalize(uKeyDir + Vs);
    float sp = max(dot(Ns, H), 0.);
    col += uKeyCol*F*pow(sp, mix(260., 12., rough))*mix(2.2, .3, rough);
    // the collar round the portal (aData.w = -1): turned brass that burns with the light beyond it
    float ck = step(vData.w, -.5);
    if(ck > .5){
      vec3 q = vOPos - uThroat;
      vec3 qr = q - uHornAxis*dot(q, uHornAxis);
      float rc = length(qr);
      vec3 rad = qr/max(rc, 1.);
      float inw = clamp(-dot(Ns, rad)*.75 + .45, 0., 1.), turn = .8 + .2*sin(rc*5.2);
      float beadr = .75 + .25*sin(atan(dot(qr, uHY), dot(qr, uHX) + 1e-4)*60.)*step(21.6, rc)*step(rc, 23.4);
      col = col*.35 + uThroatCol*(.34 + 1.5*inw*inw + .5*(1. - smoothstep(${N.toFixed(1)}, ${(N+5).toFixed(1)}, rc)))*turn*beadr*(.8 + .3*mot)*(1. + uFlash*2.);
    }
  }
  if(mica > .5) col = mix(vec3(.50, .37, .19), vec3(.80, .70, .46), rings)*roomIrr(Ns)*1.15 + env*(.10 + .9*fr);
  col += bm*uRiftCol*.10*smoothstep(.0, .6, R.z)*(1. + uFlash*4.);
  gl_FragColor = vec4(fxApplyFog(col), 1.);
}`,po=`
uniform float uWarp;
float warpH(vec2 p){
  float r = max(length(p), 1e-3);
  float c = p.x/r, s = p.y/r;
  float s2 = 2.*s*c, c2 = c*c - s*s, s4 = 2.*s2*c2, c4 = c2*c2 - s2*s2, s8 = 2.*s4*c4, c8 = c4*c4 - s4*s4;
  return uWarp*(min(r, 150.)/82.)*(.78*s4 + .22*(s8*.2675 + c8*.9636));
}`;function vo(e,o,a){return a*(Math.min(e,150)/82)*(.78*Math.sin(4*o)+.22*Math.sin(8*o+1.3))}const Bo=(e,o)=>`
varying vec3 vWPos, vWNrm, vOPos;
${po}
${e}
void main(){
  vec3 p = position;
  vOPos = p;
  float h = warpH(p.xz);
  vec3 n = normalize(vec3(h - warpH(p.xz + vec2(1., 0.)), 1., h - warpH(p.xz + vec2(0., 1.))));
  p.y += h;
  n = normalize(mix(n, normal, step(.5, abs(normal.x) + abs(normal.z))));
  vec4 wp = modelMatrix*vec4(p, 1.);
  vWPos = wp.xyz; vWNrm = mat3(modelMatrix)*n;
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  ${o}
}`,_o=e=>`
varying vec3 vWPos, vWNrm, vOPos;
uniform vec3 uShellac, uLabel, uGold, uHornC, uBoxC, uSpark;
uniform float uHornR, uBoxR, uDust, uMirror, uDeep;
uniform mat3 uRecToStage;
${le}
${e}
// value noise that wraps every K cells along x (so the polar seam does not show)
float nwrap(vec2 x, float K){ vec2 i = floor(x), f = fract(x); f = f*f*(3.-2.*f);
  float i0 = mod(i.x, K), i1 = mod(i.x + 1., K);
  return mix(mix(h21(vec2(i0, i.y)), h21(vec2(i1, i.y)), f.x), mix(h21(vec2(i0, i.y + 1.)), h21(vec2(i1, i.y + 1.)), f.x), f.y); }
// reflection of a brass ball (the horn's underside, the soundbox) seen from P along R
float ball(vec3 P, vec3 R, vec3 C, float rad){
  vec3 oc = C - P; float b = dot(oc, R); float d2 = dot(oc, oc) - b*b;
  return step(0., b)*(1. - smoothstep(rad*rad*.55, rad*rad, d2));
}
vec3 seen(vec3 P, vec3 R, float rough){
  vec3 c = roomEnv(R, rough);
  float lum = dot(uSkyCol, vec3(.3, .55, .15));
  // shellac is a black mirror: plain cloud sinks into it, only the rift and its seam lie on it as light
  c *= mix(uDeep, 1., smoothstep(.8, 2.1, dot(c, vec3(.3, .55, .15))/max(lum, .02)));
  float hb = ball(P, R, uHornC, uHornR);
  c = mix(c, uGold*lum*(.16 + .5*hb*hb)*(1. + uFlash*2.), hb*.94);
  float sb = ball(P, R, uBoxC, uBoxR);
  c = mix(c, uGold*lum*.42, sb*.9);
  return c;
}
void main(){
  vec2 p = vOPos.xz;
  float r = length(p);
  vec2 rd = p/max(r, 1e-3), tg = vec2(-rd.y, rd.x);
  float ang = atan(p.y, p.x + step(r, 1e-3));
  float a01 = ang/6.2831853 + .5;
  vec3 N = normalize(vWNrm), V = normalize(cameraPosition - vWPos);
  vec3 Ns = normalize(uStageInv*N), Vs = normalize(uStageInv*V), Ps = uStageInv*(vWPos - uStagePos);
  vec3 Ts = uRecToStage*vec3(tg.x, 0., tg.y), Rs = uRecToStage*vec3(rd.x, 0., rd.y);
  float top = step(.5, N.y);
  // zones
  float gz = smoothstep(62., 62.6, r)*(1. - smoothstep(145.4, 146., r));          // the cut band
  float leadIn = smoothstep(146., 146.4, r);
  // grooves: antialiased rings, fading to their mean where they are finer than a pixel
  float g = r/.3;
  float fw = max(fwidth(g), 1e-4);
  float vis = 1. - smoothstep(.35, 1.1, fw);
  float tri = abs(fract(g) - .5)*2.;
  float wall = mix(.5, smoothstep(.42 - fw, .42 + fw, tri), vis)*gz;
  // a few wide spiral lines in the lead-in and run-out
  float g2 = r/3.2 + a01;
  float fw2 = max(fwidth(r/3.2), 1e-4);
  float sp2 = (1. - smoothstep(.06, .06 + fw2*1.5, abs(fract(g2) - .5)*2.))*(1. - gz)*step(LABELR, r);
  // loud and quiet passages: concentric bands of different sheen
  float band = n11(r*.23)*.55 + n11(r*.71 + 7.)*.3 + n11(r*2.3)*.15;
  // streak noise, 40:1 along the groove
  float st = nwrap(vec2(a01*48., r*1.9), 48.)*.55 + nwrap(vec2(a01*160., r*5.3), 160.)*.45;
  float scr = smoothstep(.83, .93, nwrap(vec2(a01*24., r*3.1 + 40.), 24.))*.5;
  // dust specks riding the disc
  vec2 dc = vec2(a01*700., r/1.1), di = floor(dc), df = fract(dc) - .5;
  float dk = h21(di);
  vec2 dof = (vec2(h21(di + 5.1), h21(di + 9.7)) - .5)*.5;
  vec2 dv = (df - dof)*vec2(6.2831853*r/700., 1.1);
  float dr = .09 + .16*h21(di + 2.3);
  float speck = (1. - smoothstep(dr*.6, dr, length(dv)))*step(1. - .045*uDust, dk)*step(LABELR, r);
  speck *= 1. - smoothstep(.1, .34, length(fwidth(p)));               // finer than a pixel they are gone, not white pinpricks
  float ndv = max(dot(Ns, Vs), 0.);
  float fr = 1. - ndv; float fr2 = fr*fr; fr = fr2*fr2*fr;
  float F = .055 + .945*fr;
  // warp bends the mirror: the normal already carries it
  vec3 R = reflect(-Vs, Ns);
  vec3 mirror = seen(Ps, R, .015 + .05*wall);
  // groove flanks fan the reflection across the radius: the bow-tie of sky glare
  vec3 fan = vec3(0.);
  float tk = -.75;
  for(int k = 0; k < 4; k++){
    vec3 nn = normalize(Ns + Rs*tk);
    fan += seen(Ps, reflect(-Vs, nn), .22);
    tk += .5;
  }
  fan *= .25;
  float sheen = (.35 + 1.1*band)*(.55 + .9*st);
  vec3 col = uShellac*(.5 + .5*roomIrr(Ns));
  col += mirror*F*(1. - .4*wall)*(1. - .35*scr)*uMirror;
  col += fan*wall*(.008 + .34*F)*sheen*mix(uMirror, 1., .3);
  // the grooves themselves: fine silver lines that stream even where the mirror is black
  col += uSkyCol*gz*smoothstep(.6, .92, st)*(.0035 + .03*F)*(.4 + band);
  // anisotropic glint of the key along the grooves
  vec3 H = normalize(uKeyDir + Vs);
  float th = dot(Ts, H);
  float an = pow(max(1. - th*th, 0.), 90.)*max(dot(Ns, uKeyDir), 0.);
  col += (uKeyCol + uRiftCol*.25)*an*gz*(.10 + .25*band)*(.5 + st);
  // seen from well above, the mirror shows only the dark roof: there the grooves throw the whole open front back as
  // a soft bow-tie of sky across the disc, banded by the loud and quiet passages
  float steep = smoothstep(.34, .72, ndv);
  vec3 Hb = normalize(vec3(0., .34, .94) + Vs);
  float tb = dot(Ts, Hb), bow = max(1. - tb*tb, 0.);
  bow *= bow; bow *= bow; bow *= bow; bow = bow*bow*bow;
  col += (uSkyCol*.8 + uRiftCol*.1)*gz*steep*(bow*(.035 + .15*band)*(.5 + .8*st) + .004 + .012*band*band)*(1. + uFlash*3.);
  col += sp2*mirror*.35 + scr*gz*uSkyCol*.012*(.5 + F*3.);
  col += speck*(uSkyCol*.09 + uSpark)*(.6 + 2.*F)*(1. + uFlash*4.);
  // raised bead at the rim
  float rim = smoothstep(148.2, 149.2, r);
  col = mix(col, uShellac + mirror*F*.6 + fan*.12, rim*.6);
  // the label: paper with gold rings and dots, a turning shore
  float lr = r/LABELR;
  float fl = max(fwidth(lr), 1e-4);
  if(r < LABELR + .5){
    float la = smoothstep(LABELR + .5, LABELR - .1, r + .5)*top;
    float paper = .82 + .18*n21(p*1.7) - .10*n21(p*.21);
    vec3 lab = uLabel*paper*roomIrr(Ns)*1.25;
    float gring = (1. - smoothstep(.012, .012 + fl, abs(lr - .93))) + (1. - smoothstep(.006, .006 + fl, abs(lr - .885)))
      + (1. - smoothstep(.008, .008 + fl, abs(lr - .36))) + (1. - smoothstep(.02, .02 + fl, abs(lr - .155)));
    float da = fract(a01*28.) - .5;
    float dots = 1. - smoothstep(.022, .022 + fl, length(vec2(da*6.2831853*lr/28., lr - .80)));
    float bars = step(.3, fract(a01*9. + .13*floor(lr*14.)))*step(.45, fract(lr*14.))*step(.46, lr)*step(lr, .72)
      *step(.35, h21(vec2(floor(lr*14.), floor(a01*9. + .13*floor(lr*14.)))));
    float tw = step(.12, abs(a01 - .5))*(1. - smoothstep(.07, .07 + fl, abs(lr - .56)))*0.;
    float gold = clamp(gring + dots + tw, 0., 1.);
    lab = mix(lab, lab*.55 + uGold*roomIrr(Ns)*.25, bars*.8);
    lab = mix(lab, uGold*(roomEnv(R, .3)*.9 + roomIrr(Ns)*.25), gold);
    lab += mirror*F*.10;
    float hole = 1. - smoothstep(3.3, 3.8, r);
    lab = mix(lab, vec3(.004), hole);
    col = mix(col, lab, la);
  }
  gl_FragColor = vec4(fxApplyFog(col), 1.);
}`.replace(/LABELR/g,Ae.toFixed(1)),Ko=`
uniform vec3 uThroat, uHornAxis, uHX, uHY;
vec3 hornPoint(float s, float th){
  float t = min(s, 1.), pet = pow(abs(cos(th*${(U*.5).toFixed(1)})), .72);
  float amp = .02 + .115*t*t + .085*sin(3.14159265*t);
  float r = (9. + 116.*(.2*t + .8*pow(t, 3.1)))*(1. - amp + amp*1.5*pet), ax = t*${ge.toFixed(3)} + 9.*t*t*t*(pet - .5);
  if(s > 1.){ float a = (s - 1.)/.08*3.927, rr = 4.2 + 1.6*pet; r += rr*sin(a); ax -= rr*(1. - cos(a)); }
  return uThroat + uHornAxis*ax + r*(cos(th)*uHX + sin(th)*uHY);
}`,go=(e,o,a)=>`
attribute vec4 aBead;
varying vec3 vWPos, vWNrm; varying float vSeed, vLit, vRad, vIn;
uniform float uTime, uFlow, uDrip;
${e?Ko:po}
${o}
void main(){
  float sz = abs(aBead.z), seed = aBead.w;
  vec3 p, n;
  vSeed = seed; vLit = 1.; vIn = 0.; vRad = length(position.xz)*(1. - step(2., seed));
#ifdef HORN
  if(seed < 2.){
    float inside = step(aBead.z, 0.);
    float lo = .06, hi = 1.0;
    float ph = fract((aBead.x - lo)/(hi - lo) - (uTime + .7*sin(uTime*.8 + seed*40.))*.006*(.3 + seed)*uFlow);
    float s = lo + ph*(hi - lo);
    sz *= smoothstep(0., .05, ph)*(1. - smoothstep(.95, 1., ph));
    vLit = mix(1., mix(.11, 1., pow(s, 1.9)), inside);
    vIn = inside;
    // inside the bell a bead is never wider than about a tenth of a flute, and runs a little long down the bore
    float tb = min(s, 1.);
    sz = mix(sz, min(sz*.8, .03*(9. + 116.*(.2*tb + .8*pow(tb, 3.1)))), inside);
    vec3 P0 = hornPoint(s, aBead.y);
    // close to the eye a bead inside the bell stays a drop, never a disc
    float bdist = length(cameraPosition - (modelMatrix*vec4(P0, 1.)).xyz);
    sz = mix(sz, min(sz, max(bdist*.017, .12)), inside);
    vec3 tu = normalize(hornPoint(s, aBead.y + .012) - P0), tv = normalize(hornPoint(s + .004, aBead.y) - P0);
    vec3 nn = normalize(cross(tu, tv))*(1. - 2.*inside);
    // a bead shows only from its own side of the brass (the far side's beads must not print through as flat rings)
    sz *= smoothstep(0., 1.5, dot(cameraPosition - (modelMatrix*vec4(P0, 1.)).xyz, mat3(modelMatrix)*nn));
    p = P0 + sz*(tu*position.x + nn*position.y*mix(1., 1.5, inside) + tv*position.z*mix(1.35, 1.4, inside));
    n = normalize(tu*normal.x + nn*normal.y + tv*normal.z);
  } else {
    // a drip: swells on the lower lip, lets go, falls to the record and starts again
    float ph = seed > 3. ? clamp(uDrip, 0., 1.) : fract(uTime/4. + seed*1.37);
    vec3 P0 = hornPoint(1.045, aBead.y) - vec3(0., 4.6, 0.);
    float grow = smoothstep(0., .5, ph), tf = max(ph - .5, 0.)*4.;
    float fall = 20.*tf*tf;
    float gone = 1. - step(aBead.x, fall);
    vec3 q = vec3(position.x, position.y/.62 - .5, position.z);
    float rad = mix(1., .5, step(q.y, -.2));
    q.xz *= rad; q.y *= 1.5 + .5*step(.5, ph);
    p = P0 + vec3(0., -fall, 0.) + q*sz*grow*gone;
    n = normalize(vec3(normal.x, normal.y*.5 + .1, normal.z));
  }
#else
  float c = cos(aBead.y), s = sin(aBead.y);
  vec2 xz = aBead.x*vec2(c, s);
  p = vec3(xz.x, warpH(xz), xz.y) + position*sz;
  n = normal;
#endif
  vec4 wp = modelMatrix*vec4(p, 1.);
  vWPos = wp.xyz; vWNrm = mat3(modelMatrix)*n;
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  ${a}
}`,wo=e=>`
varying vec3 vWPos, vWNrm; varying float vSeed, vLit, vRad, vIn;
uniform vec3 uUnder, uHornAxis; uniform float uGlint, uLens, uBody, uMirrorB, uRimA;
${le}
${e}
void main(){
  vec3 N = normalize(vWNrm), V = normalize(cameraPosition - vWPos);
  vec3 Ns = normalize(uStageInv*N), Vs = normalize(uStageInv*V);
  float ndv = max(dot(Ns, Vs), 0.);
  float fr = 1. - ndv; float fr2 = fr*fr; fr = fr2*fr2*fr2*fr;
  float F = .02 + .98*fr;
  float drip = step(2., vSeed);
  float lumS = max(dot(uSkyCol, vec3(.3, .55, .15)), .02);
  // the skin of the drop mirrors the room, but on water this dark only the bright things register:
  // a thin crescent of sky on the limb that faces the opening
  vec3 refl = roomEnv(reflect(-Vs, Ns), .02);
  refl *= mix(.3, 1., smoothstep(.7, 1.9, dot(refl, vec3(.3, .55, .15))/lumS));
  // inside the bell a bead mirrors brass, brightest where it faces the mouth
  refl = mix(refl, uUnder*lumS*(1.2 + 3.2*max(dot(reflect(-Vs, Ns), uHornAxis), 0.)), vIn*.75);
  // the drop as a lens: the opening, small and upside down, on the flank turned away from it
  vec2 q = Ns.xz;
  vec3 ld = normalize(vec3(-q.x*1.7, .2 + (q.y + .45)*1.3, 1.));
  float lm = smoothstep(.1, .3, -q.y)*(1. - smoothstep(.6, .82, -q.y))*(1. - smoothstep(.2, .5, abs(q.x)))*(1. - drip);
  vec3 lens = roomEnv(ld, .1)*lm*uLens;
  // on brass the lens also gathers the opening's light into a warm crescent
  vec3 Lk = normalize(vec3(uKeyDir.x*.5, .35, max(uKeyDir.z, .2) + .6));
  Lk = normalize(mix(Lk, uHornAxis, vIn));                              // in the bore the light comes down from the mouth
  float ca = max(dot(Ns, -Lk)*.5 + .5, 0.); ca = ca*ca; ca = ca*ca*smoothstep(0., .4, ndv);
  vec3 under = mix(uUnder, vec3(.2, .22, .24), drip);
  float rim = smoothstep(mix(.7, .9, vIn), .99, vRad);                 // the dark meniscus where it meets the surface
  vec3 col = refl*F*uMirrorB + (lens + under*ca*1.3*roomIrr(vec3(0., .6, .8))*(1. + 2.4*vIn))*(1. - F)*(1. - rim);
  col *= mix(vLit, max(vLit, .5)*.55, vIn);                            // clear water over brass: a dark body
  // one hard glint of the sky; it softens and dims as the drop shrinks to less than a few pixels
  float nw = length(fwidth(Ns));
  float ex = clamp(2.6/(nw*nw + 1e-5), 24., 640.);
  vec3 H = normalize(Lk + Vs);
  float sp = pow(max(dot(Ns, H), 0.), ex)*sqrt(ex/640.);
  // seen from well above and far off, a bead's glint fades with its size on screen and varies from bead to bead
  float small = clamp(.24/(nw + 1e-4), 0., 1.);
  sp *= mix(1., small*small*(.25 + 1.5*fract(vSeed*7.31)), smoothstep(.3, .62, Vs.y)*(1. - vIn));
  col += mix(uSkyCol*.9 + uRiftCol*.5, vec3(1., .84, .5)*max(lumS, .5)*4.4, vIn)*sp*uGlint*(1. + uFlash*5.)*mix(sqrt(vLit), 1., vIn);
  // and a bright crescent of gathered light on the flank away from the mouth
  col += vIn*vec3(1., .74, .34)*lumS*ca*.55*(1. - rim);
  col += uSkyCol*ca*.08*uFlash*5.;
  float a = clamp(mix(mix(uBody, .42, vIn), mix(uRimA, .6, vIn), rim) + drip*.3, 0., .95);
  float fg = fxFog();
  gl_FragColor = vec4(mix(col, fogColorOr0()*a, fg), a);
}`,$o=e=>`
varying vec3 vWPos, vWNrm, vCol, vOPos; varying vec4 vData;
uniform float uBeadAmt; uniform mat4 modelMatrix;
${le}
${e}
void main(){
  vec3 N = normalize(vWNrm), V = normalize(cameraPosition - vWPos);
  vec3 Ns = normalize(uStageInv*N), Vs = normalize(uStageInv*V);
  vec3 an = abs(Ns);
  float mat = vData.x, shade = vData.y;
  float px = length(fwidth(vOPos));
  vec3 col;
  if(mat < .5){
    // ribbon-grained mahogany under varnish
    vec2 g = an.y > .6 ? vOPos.zx : (an.x > an.z ? vec2(vOPos.z, vOPos.y) : vec2(vOPos.x, vOPos.y));   // (across, along)
    float side = 1. - step(.6, an.y);
    // inset panel on each side: a moulded groove and a book-matched field
    float pd = max(abs(g.x) - 168., abs(g.y - 119.) - 62.);
    float groove = (1. - smoothstep(0., 3.2, abs(pd)))*side;
    float inner = step(pd, 0.)*side;
    float gx = g.x*mix(1., -1., inner*step(g.x, 0.)) + inner*37.;
    float wob = n21(vec2(gx*.035, g.y*.006))*7. + n21(vec2(gx*.11, g.y*.012))*2.6 + n21(vec2(gx*.4, g.y*.03))*1.2;
    float rib = sin(gx*.42 + wob);
    float chat = .5 + .5*rib*clamp(dot(Vs, vec3(.6, .2, .7))*1.6, -1., 1.);
    float pore = n21(vec2(gx*5.3, g.y*.16))*.6 + n21(vec2(gx*14., g.y*.5))*.4;
    float fig = n21(vec2(gx*.02 + 3., g.y*.02));
    vec3 alb = vCol*(.74 + .42*chat)*(.72 + .42*pore)*(.75 + .5*fig);
    alb = mix(alb, alb*vec3(.5, .42, .4), smoothstep(.62, .9, pore)*.6);
    alb *= 1. - .62*groove;
    Ns = normalize(Ns + vec3(0., .5, 0.)*groove*sign(pd)*side);
    vec4 bd = beadField(vOPos, 3.1, uBeadAmt, px);
    vec4 bd2 = beadField(vOPos + 5.7, 1.2, uBeadAmt*.8, px);
    float bm = max(bd.w, bd2.w);
    vec3 bn = bd.w > bd2.w ? bd.xyz : bd2.xyz;
    // old rain spots: dull rings where earlier drops dried
    float spot = smoothstep(.55, .75, n21(vOPos.xz*.09 + vOPos.y*.07))*.35;
    Ns = normalize(Ns + uStageInv*(mat3(modelMatrix)*bn)*.8*bm);
    float ndv = max(dot(Ns, Vs), 0.);
    float fr = 1. - ndv; float fr2 = fr*fr; fr = fr2*fr2*fr;
    float F = .045 + .955*fr;
    vec3 R = reflect(-Vs, Ns);
    float rough = mix(.10 + .25*spot + .1*pore, .03, bm);
    col = alb*roomIrr(Ns)*(1. - .25*bm) + roomEnv(R, rough)*F*(.85 - .4*spot);
    col += bm*uSkyCol*.05;
  } else if(mat < 1.5){
    float fz = n21(vOPos.xz*3.1)*.5 + n21(vOPos.xz*9.7 + vOPos.y*4.)*.5;
    float ndv = max(dot(Ns, Vs), 0.);
    col = vCol*(.7 + .5*fz)*roomIrr(Ns)*(1. + .8*(1. - ndv)*(1. - ndv));
  } else {
    col = vCol*roomIrr(Ns)*.3;
  }
  col *= mix(.22, 1., shade);
  gl_FragColor = vec4(fxApplyFog(col), 1.);
}`,Uo=e=>`
varying vec3 vWPos, vWNrm, vCol, vOPos; varying vec4 vData;
${le}
${e}
void main(){
  vec3 N = normalize(vWNrm), V = normalize(cameraPosition - vWPos);
  vec3 Ns = normalize(uStageInv*N);
  vec2 p = vOPos.xz;
  float r = length(p);
  float fwp = max(fwidth(p.x) + fwidth(p.y), 1e-4);
  float a01 = atan(p.y, p.x + step(r, 1e-3))/6.2831853 + .5;
  // openwork: a fine net, flower medallions on a diamond grid, a scalloped border of big eyelets
  vec2 q = vec2(p.x + p.y, p.x - p.y)*.7071;
  vec2 nc = abs(fract(q/3.4) - .5);
  float net = smoothstep(.24 - fwp*.3, .24 + fwp*.3, max(nc.x, nc.y));          // 1 = thread
  net = mix(.74, net, 1. - smoothstep(.5, 2.2, fwp));
  vec2 mc = q/46., mi = floor(mc), mf = (fract(mc) - .5)*46.;
  float mr = length(mf), ma = atan(mf.y, mf.x + step(mr, 1e-3));
  float petal = mr - (9. + 7.*abs(cos(ma*3.)));
  float solid = 1. - smoothstep(-1., 1. + fwp, petal);                          // flower of cloth
  float eye = (1. - smoothstep(2.6, 3.2 + fwp, mr))*(1. - smoothstep(.8, 3.5, fwp));
  float ringm = 1. - smoothstep(.9, 1.4 + fwp, abs(mr - 20.));
  float cloth = max(max(net, solid), ringm)*(1. - eye);
  float br = 650. - r;
  float border = step(br, 60.);
  float eyelet = (1. - smoothstep(4., 5. + fwp, length(vec2((fract(a01*72.) - .5)*6.2831853*r/72., br - 34.))))*(1. - smoothstep(1.2, 5., fwp));
  float bandm = max(1. - smoothstep(1.2, 2. + fwp, abs(br - 52.)), 1. - smoothstep(1.2, 2. + fwp, abs(br - 16.)));
  cloth = mix(cloth, max(max(net*.9, bandm), step(br, 12.))*(1. - eyelet), border);
  float weave = .9 + .1*n21(p*2.3) - .08*n21(p*.03) + .06*sin(p.x*.011 + 1.)*sin(p.y*.013);
  vec3 irr = roomIrr(Ns);
  vec3 wood = vec3(.16, .075, .05)*irr;
  vec3 col = mix(wood, vCol*weave*irr, cloth);
  // the cabinet and its feet stand on it: soft contact shadow, and a long soft one away from the opening
  vec2 bd = abs(p) - 226.;
  float d = length(max(bd, 0.)) + min(max(bd.x, bd.y), 0.);
  float sh = 1. - .72*exp(-max(d, 0.)/26.) - .22*exp(-max(d, 0.)/140.)*step(p.y, 260.);
  sh *= 1. - .25*(1. - smoothstep(0., 520., length(p - vec2(0., -330.))));
  col *= clamp(sh, 0.05, 1.);
  gl_FragColor = vec4(fxApplyFog(col), 1.);
}`,Xo=e=>`
varying vec3 vWPos, vWNrm, vCol, vOPos; varying vec4 vData;
${le}
${e}
void main(){
  vec2 uv = vData.xy;                       // x: -1..1 across, y: 0 at the needle .. 1 downstream
  float w = .06 + .9*uv.y;
  float arm = exp(-pow(abs(abs(uv.x) - w*.8)/(.05 + .12*uv.y), 2.));
  float rip = .6 + .4*sin(uv.y*46. - uTime*26. + abs(uv.x)*9.);
  float core = exp(-uv.x*uv.x/(.004 + .02*uv.y))*exp(-uv.y*7.);
  float a = (arm*rip*(1. - uv.y)*(1. - uv.y)*.55 + core*1.2)*smoothstep(0., .03, uv.y);
  vec3 col = (uSkyCol*.5 + uRiftCol*.12)*a*(1. + uFlash*4.);
  gl_FragColor = vec4(col*(1. - fxFog()), 1.);
}`;async function Yo(e){const o=new t.Vector3,a=U*24,s=62,c=8,l=s+c,r=[];for(let h=0;h<U;h++)r.push(.9+.2*e.rng());return lo(a,l,!0,(h,d,f,n,p)=>{const u=h*E,g=p<=s?0+Math.pow(p/s,.85):1+(p-s)/c*.08;J(g,u,o),f.p[0]=o.x,f.p[1]=o.y,f.p[2]=o.z;const y=Math.pow(Math.abs(Math.cos(u*U*.5)),.72),i=Math.floor(u/E*U+.5)%U,k=Math.min(g,1),C=.72+.28*k+.08*e.noise.n2(u*3,g*7),z=S(e.brass,C*r[i]);f.c[0]=z[0],f.c[1]=z[1],f.c[2]=z[2],f.d[0]=.13+.05*(1-k),f.d[1]=Z(Math.pow(1-y,2.6)*.9+(g>1?.55:0)+.25*Math.max(0,e.noise.n2(u*9,g*30)),0,1),f.d[2]=k,f.d[3]=0},e.tick)}async function jo(e){const o=[],a=e.wood,s=e.noise,c=(p=1)=>(u,g,y)=>S(a,p*(.88+.16*s.n2(g*2.1,y*.02))),l=(p,u,g,y)=>{y[0]=0,y[1]=Z(.35+(g-10)/70,.35,1)*(g>199&&g<214?.8:1)},h=await b([[0,225],[150,225],[236,225],[236,225],[247,224.4],[253,221.5],[254,217],[254,217],[250,215.5],[249,211],[244,208.5],[241,204],[241,204],[237,202.5],[236,198],[236,198],[236,150],[236,90],[236,46],[236,46],[238,44.5],[243,39],[246,33],[246,33],[251,31.5],[252,20],[251,13],[247,10.5],[247,10.5],[200,10],[0,10]],{seg:144,sq:13,color:c(1),data:l,tick:e.tick});await e.tick(),o.push(h.rotateY(Math.PI/4*0)),await e.tick();const d=[[0,198],[15,198],[22,197],[23.5,194],[23.5,190],[21,189],[20,185],[22.5,183],[22.5,181],[19.5,180],[19,176],[19,120],[19.4,70],[19.6,64],[22.5,63],[22.5,60],[20.5,59],[21.5,54],[24.5,52],[25,47],[25,46],[0,46]];for(const p of[-1,1])for(const u of[-1,1])o.push(b(d,{seg:28,flutes:{n:14,depth:.13,y0:64,y1:176,pow:1.3},color:c(.9),data:l}).translate(p*226,0,u*226)),await e.tick(),o.push(b([[0,12],[26,12],[31,10],[33,6.5],[31,2.5],[24,0],[0,0]],{seg:20,color:c(.7),data:[0,.45,0,0]}).translate(p*206,0,u*206)),await e.tick();const f=e.felt;return o.push(b([[0,233.4],[150,233.4],[152.6,233.2],[153.6,232.3],[153.6,231.2]],{seg:96,color:(p,u)=>S(f,.85+.2*s.n2(u*20,p*9)),data:[1,1,0,0]})),await e.tick(),o.push(b([[0,225.4],[25.6,225.4]],{seg:24,color:()=>[.05,.03,.02],data:[2,.6,0,0]}).translate(e.grille.x,0,e.grille.z)),ue(o)}async function Zo(e){const o=[],a=e.brass,s=e.nickel,c=e.noise,l=(n=1,p=a)=>(u,g,y)=>S(p,n*(.9+.14*c.n3(g*1.7,y*.3,n*7))),r=(n,p=.1)=>[n,p,-1,0];o.push(b([[153.9,231.2],[154.6,230.5],[154.6,228.6],[153.2,228],[153.2,227.3],[149,226.8],[149,225]],{seg:96,color:l(1,s),data:r(.14)})),o.push(b([[0,249.5],[1.6,249.3],[2.7,248.4],[3.1,247],[3.1,240.2],[5.6,240.1],[5.9,239.6]],{seg:16,color:l(1.05,s),data:r(.08)})),await e.tick();const h=[[0,46],[11,46],[14.5,44.6],[15.6,41.5],[15.6,38.5],[13.4,37.6],[12.6,34],[12.2,24],[12.6,21],[15.4,20.2],[16,18],[16,15.6],[13.6,14.8],[13.2,11],[14.5,8.5],[22,5.4],[29,4.4],[31,2.6],[31,0]];o.push(b(h,{seg:28,color:l(.95),data:r(.16,.25)}).translate(0,225,-215)),await e.tick();for(let n=0;n<4;n++){const p=Math.PI/4+n*Math.PI/2;o.push(b([[0,2.1],[2.2,2],[3.2,1.2],[3.4,0]],{seg:10,color:l(1.05,s),data:r(.2)}).translate(Math.cos(p)*24.5,229.4,-215+Math.sin(p)*24.5))}await e.tick();const d=L.clone().addScaledVector(M,-9);o.push(se([d,[0,277.5,-240],[0,268.5,-235.5],[0,262.5,-224],[0,262,-215]],n=>10.4-1.2*Math.sin(n*Math.PI)+(n>.97?-(n-.97)*120:0),{along:30,around:18,color:(n,p)=>S(a,.82+.12*c.n2(n*9,p*2)),data:r(.17,.2)})),await e.tick(),o.push(P(b([[9.3,7],[11.2,6.4],[12,4.5],[12,2.5],[10.6,1.8],[10.4,-3],[12.6,-4],[13.4,-6],[12.6,-8],[10.6,-9],[10.4,-13]],{seg:28,color:l(1),data:r(.13,.3)}),L,M)),await e.tick(),o.push(P(b([[0,0],[9.9,0]],{seg:20,color:()=>[.012,.007,.004],data:[1,0,-1,0]}),L.clone().addScaledVector(M,-2.5),M)),o.push(P(b([[N+.35,-.6],[N+.4,1.3],[N+1.1,2.5],[N+2.2,3],[N+3.4,2.5],[N+4,1.5],[N+4.6,1.4],[N+5.6,2.3],[N+6.6,2.6],[N+7.6,2.2],[N+8.4,1.2],[N+9.9,.6]],{seg:80,color:l(1),data:[.16,.3,-1,-1]}),we,M)),o.push(P(b([[0,0],[N+9.5,0]],{seg:24,color:()=>[.012,.007,.004],data:[1,0,-1,0]}),we.clone().addScaledVector(M,-2.2),M)),await e.tick();const f=e.grille;o.push(b([[25,225.4],[25,237.6],[25,237.6],[26.4,238.8],[29,239.2],[31,238.4],[31.8,236.4],[31.8,229],[33.4,228],[34,226.4],[34,225]],{seg:32,color:l(1),data:r(.15,.3)}).translate(f.x,0,f.z)),await e.tick();for(const n of[8,16.5])o.push(b([[n-1.3,237.8],[n,238.7],[n+1.3,237.8]],{seg:24,color:l(.95),data:r(.18)}).translate(f.x,0,f.z));for(let n=0;n<6;n++){const p=n/6*E,u=Math.cos(p),g=Math.sin(p);o.push(se([[f.x+u*2,238.2,f.z+g*2],[f.x+u*12,238.3,f.z+g*12],[f.x+u*25.5,238.2,f.z+g*25.5]],()=>1.05,{along:2,around:6,color:()=>S(a,.9),data:r(.2)}))}return o.push(b([[0,240],[2.6,239.6],[3.6,238.2]],{seg:10,color:l(1.05),data:r(.12)}).translate(f.x,0,f.z)),await e.tick(),o.push(P(b([[0,3.2],[9,3.2],[11,2.6],[12,1.4],[18,1.1],[20.5,0]],{seg:24,color:l(1),data:r(.16,.35)}),new t.Vector3(236,e.crank.y,e.crank.z),new t.Vector3(1,0,0))),o.push(P(b([[0,1.6],[5.5,1.5],[8.5,.9],[9.5,0]],{seg:20,sq:3.2,color:l(.95),data:r(.2,.4)}).scale(1,1,1.5),new t.Vector3(0,172,236),new t.Vector3(0,0,1))),await e.tick(),ue(o)}function Qo(e){const o=[],a=e.brass,s=e.noise,c=new t.Vector3(1,0,0),l=new t.Vector3,r=(h,d=.2)=>[h,d,-1,0];return o.push(P(b([[0,34],[4.4,33.6],[5.2,32],[5.2,4],[7.5,3],[7.5,0]],{seg:14,color:()=>S(a,.95),data:r(.15)}),l,c)),o.push(se([[31,0,0],[33,-12,0],[36,-40,0],[37,-62,0]],h=>4.6-1.2*Math.sin(h*Math.PI)+(h<.04||h>.96?-1.5:0),{along:14,around:10,color:(h,d)=>S(a,.9+.1*s.n2(h*6,d)),data:r(.16,.3)})),o.push(P(b([[0,7],[5.6,6.4],[6.6,4],[6.6,-3],[5,-4.4],[0,-4.6]],{seg:14,color:()=>a,data:r(.14)}),new t.Vector3(32,0,0),c)),o.push(P(b([[0,38],[3.2,37.6],[5.2,35.5],[6.4,30],[5.4,20],[5,12],[6.2,6],[6.6,3],[5,1.4],[3.6,0],[3.4,-4],[6,-5],[6,-7],[0,-7]],{seg:16,color:(h,d,f)=>f>.5?S([.05,.03,.025],.8+.4*s.n2(d*3,f)):a,data:(h,d,f,n)=>{n[0]=f>.5?.35:.15,n[1]=.1,n[2]=-1,n[3]=0}}),new t.Vector3(39,-62,0),c)),ue(o)}function Jo(e){const o=[],a=e.brass;o.push(b([[0,9],[1.8,8.6],[2.2,0],[5,-1],[5,-2.4],[0,-2.6]],{seg:10,color:()=>S(a,.8),data:[.2,.2,-1,0]}));for(let s=0;s<3;s++){const c=s/3*E,l=Math.cos(c),r=Math.sin(c);o.push(b([[0,5.2],[2.6,4.5],[4.5,2.6],[5.2,0],[4.5,-2.6],[2.6,-4.5],[0,-5.2]],{seg:12,color:()=>S(a,1.05),data:[.1,.1,-1,0]}).translate(l*15,3,r*15)),o.push(se([[l*2,8,r*2],[l*9,6.5,r*9],[l*15,3,r*15]],()=>.9,{along:3,around:6,color:()=>S(e.nickel,.9),data:[.2,0,-1,0]}))}return ue(o)}const _=new t.Vector3(-82,B,0),H=new t.Vector3(-.906,0,-.423),Ne=new t.Vector3(-.423,0,.906),ee=new t.Vector3(-.2115,.866,.453).normalize(),ie=_.clone().addScaledVector(ee,32);async function et(e){const o=[],a=e.brass,s=e.nickel,c=e.noise,l=i=>i.clone().sub(Q),r=new t.Vector3(0,1,0),h=(i,k=.15)=>[i,k,-1,0],d=(i=1,k=a)=>(C,z,q)=>S(k,i*(.9+.14*c.n3(z*1.9,q*.4,i*5)));o.push(b([[0,12],[7,12],[9.6,10.6],[10.6,8],[10.6,2],[12.6,1],[13.2,-1.5],[12.6,-4],[10.6,-5],[10.6,-9],[9,-10.5]],{seg:24,color:d(1),data:h(.15,.3)})),await e.tick();const f=ie,n=f.clone().addScaledVector(H,-10.5),p=[new t.Vector3(0,268,-215),new t.Vector3(-3,270,-198),new t.Vector3(-18,272,-125),new t.Vector3(-37,272.6,-44),new t.Vector3(-48,272,0),new t.Vector3(-55.5,270.6,20.5),new t.Vector3(-66.5,269,26.5).lerp(f.clone().addScaledVector(H,-25),.6),n].map(l);o.push(se(p,i=>7-2.1*i+(i>.9?.5*To(.9,.93,i):0)+(i<.06?.8:0)+.8*Math.exp(-(((i-.13)/.006)**2))+.7*Math.exp(-(((i-.145)/.003)**2))+.7*Math.exp(-(((i-.6)/.005)**2))+.6*Math.exp(-(((i-.86)/.005)**2)),{along:150,around:16,color:(i,k)=>S(a,.86+.14*c.n2(i*22,k*1.5)+.05*Math.sin(i*400)),data:h(.15,.22)})),await e.tick();const u=(i,k,C,z)=>{z[0]=.08,z[2]=-1,z[3]=0,z[1]=.2};o.push(P(b([[11.4,3.3],[12.2,4.9],[13.6,5.5],[15,4.9],[15.5,3.6],[15.5,3.6],[15.5,-3.6],[15.5,-3.6],[15,-4.9],[13.4,-5.5],[12.4,-5.5],[12.4,-6.2],[10.6,-6.2],[10.6,-5.6],[9.2,-5.6],[9.2,-6.4],[7.4,-6.6],[6.4,-7.4],[6.1,-9],[6.6,-9.4],[6.6,-10.2],[5.6,-10.6],[5.6,-11],[0,-11]],{seg:144,flutes:{n:72,depth:.03,y0:-3.61,y1:3.61,pow:1},color:d(1),data:u}),l(f),H)),await e.tick(),o.push(P(b([[0,3.1],[1.5,3.1],[3,3.1],[4.5,3.1],[6,3.1],[7.5,3.1],[9,3.1],[10.4,3.1],[11.5,3.1]],{seg:60,color:()=>[.6,.55,.42],data:(i,k,C,z)=>{z[0]=.06,z[1]=i,z[2]=-1,z[3]=1}}),l(f),H)),o.push(P(b([[0,5.2],[1.3,5],[1.9,4.2],[2.4,3.1]],{seg:12,color:d(1.1),data:h(.1)}),l(f),H)),await e.tick();const g=i=>_.clone().addScaledVector(ee,i).addScaledVector(H,4.6);o.push(se([l(f.clone().addScaledVector(H,4.9)),l(g(24)),l(g(18)),l(_.clone().addScaledVector(ee,15.5).addScaledVector(H,1.5))],i=>.9+.9*i,{along:8,around:8,color:()=>S(s,.9),data:h(.12)}));for(const i of[-1,1])o.push(P(b([[0,2.4],[1.7,2.2],[2,1.4],[2,0]],{seg:10,color:d(1,s),data:h(.15)}),l(_.clone().addScaledVector(ee,17.4).addScaledVector(Ne,i*4.4).addScaledVector(H,4.2)),H));o.push(P(b([[0,5.6],[2.7,5.3],[3.3,4],[3.3,.6],[2.5,-.4],[1.5,-1]],{seg:12,sq:4,color:d(.95),data:h(.16,.3)}),l(_.clone().addScaledVector(ee,13.2)),ee)),o.push(P(b([[0,14.2],[1.05,14],[1.05,5.2],[.8,2.6],[.42,.9],[.1,0]],{seg:10,color:i=>S(s,.85+.3*i),data:h(.07,0)}),l(_),ee)),await e.tick();const y=i=>b([[0,8],[3.4,7.8],[4.2,7],[4.2,7],[4.2,3.8],[4.2,3.8],[3.2,3.2],[1.5,3],[1.3,0]].map(k=>[k[0]*i,k[1]*i]),{seg:40,flutes:{n:20,depth:.1,y0:3.79*i,y1:7.01*i,pow:1},color:d(1.05),data:h(.14,.4)});o.push(P(y(1),l(_.clone().addScaledVector(ee,15.4).addScaledVector(Ne,-2.6)),Ne.clone().multiplyScalar(-1))),o.push(P(y(1.15),l(f.clone().addScaledVector(r,14.6)),r)),await e.tick();for(let i=0;i<3;i++){const k=.9+i/3*E;o.push(P(b([[0,.8],[.9,.75],[1.25,.45],[1.35,0]],{seg:12,color:d(1,s),data:h(.15)}),l(f.clone().addScaledVector(Ne,Math.cos(k)*13.6).addScaledVector(r,Math.sin(k)*13.6).addScaledVector(H,5.2)),H))}return await e.tick(),ue(o)}function ot(){const e=_.clone().sub(Q);return Fe(8,10,!1,(o,a,s)=>{const c=o*2-1,l=46*a;s.p[0]=e.x+c*(.6+7.5*a),s.p[1]=e.y+.22,s.p[2]=e.z-l,s.d[0]=c,s.d[1]=a})}function tt(){const o=b([[3.3,0],[10,0],[20,0],[32,0],[Ae,0],[54,0],[62,0],[72,0],[82,0],[92,0],[102,0],[112,0],[122,0],[132,0],[140,0],[146,0],[148.3,0],[149.1,.45],[149.8,.3],[150,-.3],[150,-.3],[150,-1.6],[149.2,-2.2]],{seg:160});return o.deleteAttribute("color"),o.deleteAttribute("aData"),o}function xo(e,o){const a=Go(.62),s=new t.InstancedBufferGeometry;s.setAttribute("position",a.getAttribute("position")),s.setAttribute("normal",a.getAttribute("normal")),s.setIndex(a.getIndex());const c=new Float32Array(e*4),l=[0,0,0,0];for(let r=0;r<e;r++)o(r,l),c[r*4]=l[0],c[r*4+1]=l[1],c[r*4+2]=l[2],c[r*4+3]=l[3];return s.setAttribute("aBead",new t.InstancedBufferAttribute(c,4)),s.instanceCount=e,s}function at(e,o){const a=(h,d=1)=>new t.Color(h).multiplyScalar(d),s=o[2],c=o[1],l=o[4],r=o[5];return e==="golden"?{sky:new t.Color(1,.8,.56).multiplyScalar(1.05),rift:new t.Color(1,.6,.22).multiplyScalar(3.4),garden:a(r,.5).lerp(new t.Color(.35,.25,.08),.35),roof:new t.Color(.07,.04,.03),wall:a(c,.5).lerp(new t.Color(.5,.35,.2),.4),dado:a(l,.7),cloth:new t.Color(.85,.74,.58).multiplyScalar(.62),keyDir:new t.Vector3(-.72,.3,.62).normalize(),keyColor:new t.Color(1,.62,.26).multiplyScalar(1.25),ambient:a(c,.05),spark:new t.Color(.2,.12,.03)}:e==="night"||e==="dawn"?{sky:new t.Color(.15,.26,.6),rift:new t.Color(1,.42,.3).multiplyScalar(2.1),garden:new t.Color(.03,.07,.09),roof:new t.Color(.022,.018,.03),wall:a(c,.2).lerp(a(l,.35),.5),dado:a(l,.42),cloth:new t.Color(.3,.36,.56).multiplyScalar(.6),keyDir:new t.Vector3(0,.42,.9).normalize(),keyColor:new t.Color(.25,.35,.7).multiplyScalar(.4),ambient:new t.Color(.03,.04,.075),spark:new t.Color(.05,.22,.04)}:{sky:a(s,1.22),rift:new t.Color(1,1,.94).multiplyScalar(2.5),garden:a(r,.5).lerp(a(c,.62),.6),roof:new t.Color(.055,.036,.03),wall:a(c,.5),dado:a(l,.85),cloth:a(s,.6),keyDir:new t.Vector3(0,.45,.9).normalize(),keyColor:a(s,.24),ambient:a(c,.055),spark:new t.Color(0,0,0)}}async function st(e,o={}){const a=e.rng.fork("gramophone"),s=e.noise,c=(o.palette&&o.palette.length>=7?o.palette:Eo).slice(),l=e.quality?.detail??1,r=o.density??e.vary?.density??1,h=o.hour??e.vary?.hour??"day",d=at(h,c),f=o.label??a.pick([c[6],c[6],c[6],"#1F6F8B","#A8842C"]),n=a.range(0,1),p=He(Re(c[3]),[.96,.68,.25],.46+.12*n),u={rng:a,noise:s,brass:p,nickel:[.74,.76,.74],wood:S(He([.4,.105,.05],[.33,.12,.07],a()),a.range(.9,1.15)),felt:S(Re(c[5]),1.1),grille:new t.Vector3(186,225,186),crank:new t.Vector3(240,128,46),tick:()=>e.yield?.()},g=3*a.range(.92,1.08),y=a.range(0,E),i={uStageInv:{value:new t.Matrix3},uStagePos:{value:new t.Vector3},uSkyCol:{value:d.sky.clone()},uRiftCol:{value:d.rift.clone()},uGardenCol:{value:d.garden.clone()},uRoofCol:{value:d.roof.clone()},uWallCol:{value:d.wall.clone()},uDadoCol:{value:d.dado.clone()},uClothCol:{value:d.cloth.clone()},uKeyDir:{value:d.keyDir.clone()},uKeyCol:{value:d.keyColor.clone()},uAmbCol:{value:d.ambient.clone()},uFlash:{value:0},uTime:{value:0},uHornAxis:{value:M.clone()},uSwell:{value:0},uBeadAmt:{value:Z(.34*r,.1,.6)},uWarp:{value:g},uThroat:{value:L.clone()},uHX:{value:xe.clone()},uHY:{value:he.clone()},uFlow:{value:1},uDrip:{value:0},uSeat:{value:Le},uRingK:{value:1},uMirK:{value:1},uSpark:{value:d.spark.clone()},uThroatCol:{value:new t.Color(1,.72,.36).multiplyScalar(.8)},uBandGold:{value:.5}},k=()=>t.UniformsUtils.clone(t.UniformsLib.fog),C="#include <fog_pars_vertex>",z="#include <fog_vertex>",q=`
#include <fog_pars_fragment>
float fxFog(){
#ifdef USE_FOG
  #ifdef FOG_EXP2
  return 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  #else
  return smoothstep(fogNear, fogFar, vFogDepth);
  #endif
#else
  return 0.;
#endif
}
vec3 fxApplyFog(vec3 c){
#ifdef USE_FOG
  return mix(c, fogColor, fxFog());
#else
  return c;
#endif
}
vec3 fogColorOr0(){
#ifdef USE_FOG
  return fogColor;
#else
  return vec3(0.);
#endif
}`,X=(v,m,x={},w={})=>new t.ShaderMaterial({uniforms:{...k(),...i,...x},vertexShader:v,fragmentShader:m,fog:!0,...w}),T=new t.Group;T.name="gramophone";const bo=[],G=(v,m,x,w)=>{const V=new t.Mesh(m,x);return V.name=w,v.add(V),bo.push(x),V},Ge={transparent:!0,depthWrite:!1,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor},ye=X(be(C,z),mo(q),{},{vertexColors:!0}),yo=X(be(C,z),mo(q),{},{vertexColors:!0,side:t.DoubleSide}),zo=X(be(C,z),$o(q),{},{vertexColors:!0});await e.yield?.(),G(T,await jo(u),zo,"cabinet"),await e.yield?.(),G(T,await Zo(u),ye,"brass"),await e.yield?.();const me=new t.Group;T.add(me),G(me,await Yo(u),yo,"horn"),await e.yield?.();const ko=new t.Color(f),ze={uShellac:{value:new t.Color(c[0]).multiplyScalar(.6)},uLabel:{value:ko},uGold:{value:new t.Color(p[0],p[1],p[2])},uHornC:{value:new t.Vector3(0,372,-70)},uHornR:{value:108},uBoxC:{value:ie.clone()},uBoxR:{value:14},uDust:{value:Z(r,.5,1.5)},uRecToStage:{value:new t.Matrix3},uMirror:{value:o.mirror??.6},uDeep:{value:o.deep??.22}},De=G(T,tt(),X(Bo(C,z),_o(q),ze),"record");De.position.y=B,await e.yield?.();const oe=a.fork("beads"),Mo=Math.min(1250,Math.max(200,Math.round(1e3*r*l*(o.beads??1)))),Co=xo(Mo,(v,m)=>{const x=oe()<.07;m[0]=x?oe.range(6,Ae-2):Math.sqrt(no(2304,21904,oe())),m[1]=oe()*E;const w=oe();m[2]=.5+1.9*Math.pow(w,2.4)+(oe()<.03?.7:0),m[3]=oe()}),Oe=G(De,Co,X(go(!1,C,z),wo(q),{uUnder:{value:new t.Color(.006,.0065,.008)},uGlint:{value:8},uLens:{value:.22},uBody:{value:.55},uMirrorB:{value:.7},uRimA:{value:.93}},Ge),"recordBeads");Oe.frustumCulled=!1,Oe.renderOrder=1,await e.yield?.();const W=a.fork("hornbeads"),R=new t.Vector3,te=Math.min(950,Math.max(150,Math.round(800*r*l*(o.beads??1)))),ke=9,We=Math.PI+.75,Be=xo(te+ke+1,(v,m)=>{if(v<te){m[0]=no(.08,1,Math.pow(W(),.6));const x=(Math.floor(W()*U)+.5)/U*E;m[1]=W()<.55?x+W.gauss()*.035:W()*E;const w=W();m[2]=(.32+1.25*w*w)*(.5+.7*m[0])*(W()<.5?-1:1),m[3]=W()*.999}else{const x=v===te+ke,w=x?We:-Math.PI/2+W.range(-1.05,1.05);J(1.045,w,R),m[0]=R.y-4.6-B-.6,m[1]=w,m[2]=x?2.6:W.range(1.3,2.1),m[3]=x?3.5:2+W()*.99}}),_e=X(go(!0,C,z),wo(q),{uUnder:{value:new t.Color(p[0],p[1],p[2]).multiplyScalar(.55)},uGlint:{value:3.2},uLens:{value:.1},uBody:{value:.1},uMirrorB:{value:1.2},uRimA:{value:.5}},{defines:{HORN:1},side:t.DoubleSide,...Ge}),Ke=G(me,Be,_e,"hornBeads");Ke.frustumCulled=!1,Ke.renderOrder=1,await e.yield?.();const ae=new t.Group;ae.position.copy(Q),ae.rotation.order="YXZ",T.add(ae);const $e=await et(u);await e.yield?.(),G(ae,$e,ye,"toneArm");const So=G(ae,ot(),X(be(C,z),Xo(q),{},{vertexColors:!0,transparent:!0,depthWrite:!1,blending:t.AdditiveBlending}),"wake");So.renderOrder=2,await e.yield?.();const Ue=G(T,Qo(u),ye,"crank");Ue.position.copy(u.crank);const Xe=G(T,Jo(u),ye,"governor");if(Xe.position.set(u.grille.x,228.2,u.grille.z),await e.yield?.(),o.table!==!1){const v=Re(c[2]),m=b([[0,0],[120,0],[240,0],[360,0],[480,0],[560,0],[620,0],[648,0],[650,-1.2],[650,-1.2],[650,-9],[646,-16]],{seg:96,color:(x,w)=>S(v,.8+.05*s.n2(w*3,x*4))});G(T,m,X(be(C,z),Uo(q),{},{vertexColors:!0}),"lace")}await e.yield?.();const Me=_.clone().sub(Q),K=new t.Vector3,qe=new t.Vector3,Ce=(v,m)=>{const x=Math.cos(v),w=Math.sin(v);return m.set(Q.x+Me.x*x+Me.z*w,B,Q.z-Me.x*w+Me.z*x)},pe=v=>{let m=-.03,x=.14;for(let w=0;w<22;w++){const V=(m+x)/2;Ce(V,K),Math.hypot(K.x,K.z)>v?m=V:x=V}return(m+x)/2};let Te=82,Se=pe(82),Po=0,Ye=0;const Pe=v=>y-so*v,je=(v,m=Te)=>{Ce(pe(m),K);const x=Pe(v),w=Math.cos(x),V=Math.sin(x),re=K.x*w-K.z*V,Y=K.x*V+K.z*w;return vo(Math.hypot(re,Y),Math.atan2(Y,re),g)},Ze=(v,m=new t.Vector3)=>Ce(pe(v),m),Vo=$.clone().addScaledVector(he,125),Ao=$.clone().addScaledVector(he,-125),Fo=J(1,.95,new t.Vector3).addScaledVector(M,14).add(new t.Vector3(8,6,0)),Ee=J(1.045,We,new t.Vector3),Ro={spindle:new t.Vector3(0,B,0),recordY:B,recordRadius:Io,labelRadius:Ae,needle:_.clone(),needleAt:Ze,soundbox:ie.clone(),soundboxTop:ie.clone().add(new t.Vector3(0,24,0)),rideEye:new t.Vector3(-80,290,-22),entry:new t.Vector3(-84,268,-156),bracket:new t.Vector3(0,262,-215),hornMouth:$.clone(),hornAxis:M.clone(),hornThroat:L.clone(),hornTop:Vo,portalSeat:{position:we.clone(),normal:M.clone(),radius:N,depth:Le},flyThrough:[$.clone().addScaledVector(M,140),$.clone().addScaledVector(M,60),$.clone(),we.clone().addScaledVector(M,60),we.clone()],hummingbird:Fo,lowerLip:Ao,dripLip:Ee,dripLanding:new t.Vector3(Ee.x,B,Ee.z),crank:u.crank.clone(),grille:u.grille.clone().setY(239),viewpoints:{hero70:new t.Vector3(0,470,87),look70:new t.Vector3(0,372,-60),ride:new t.Vector3(-80,290,-22)},keepOut:[{center:new t.Vector3(0,118,0),radius:345},{center:new t.Vector3(0,385,-75),radius:135},{center:ie.clone(),radius:20}]};let ce=345,de=525,fe=new t.Vector3(0,300,-40);const ve=o.view;ve==="ride"?(ce=9,de=34,fe=ie.clone()):ve==="rec"?(ce=26,de=44,fe=new t.Vector3(-58,B,24)):ve==="horn"?(ce=78,de=110,fe=$.clone().addScaledVector(M,20)):ve==="in"?(ce=20,de=114,fe=L.clone().addScaledVector(M,62)):ve==="cab"&&(ce=150,de=200,fe=new t.Vector3(120,215,120));const No=new t.Matrix4,Do=new t.Euler,Ie={object:T,radius:ce,height:de,center:fe,anchors:Ro,ground:o.table===!1,groundY:0,uniforms:i,look:d,setNeedle(v){Te=Z(v,52,148),Se=pe(Te)},setProgress(v){Ie.setNeedle(82-12*Z(v,0,1))},setFlash(v){i.uFlash.value=Math.max(0,v)},setHop(v){Ye=Math.max(0,v)},setDrip(v){i.uDrip.value=Z(v,0,1)},async clearDrips(v,m){const x=Be.getAttribute("aBead"),w=x.array,V=-Math.PI/2,re=new t.Vector3,Y=(F,A)=>{J(1.045,F,R);for(const D of v)if(D.y<R.y+A&&D.y>B-A&&(D.x-R.x)*(D.x-R.x)+(D.z-R.z)*(D.z-R.z)<A*A)return!1;return!0};let ne=null;const Oo=F=>{if(!ne){ne=new Set;const I=$e.getAttribute("position");for(let j=82;j>=61;j-=3){const Je=pe(j),eo=Math.cos(Je),oo=Math.sin(Je);for(let Ve=0;Ve<I.count;Ve++){const to=I.getX(Ve),ao=I.getZ(Ve),ro=Q.z-to*oo+ao*eo;ro>-40&&ne.add(Math.round((Q.x+to*eo+ao*oo)/2)*4096+Math.round(ro/2))}}}const A=Math.ceil(F/2)+1,D=Math.round(R.x/2),O=Math.round(R.z/2);for(let I=-A;I<=A;I++)for(let j=-A;j<=A;j++)if(ne.has((D+I)*4096+O+j)&&Math.hypot((D+I)*2-R.x,(O+j)*2-R.z)<F+1.5)return!0;return!1},Qe=(F,A,D)=>{if(Math.abs(A-V)>1.05||!Y(A,D)||R.y-4.6-B-.6>80||Oo(w[F*4+2]))return!1;for(let O=te;O<=te+ke;O++)if(O!==F&&J(1.045,w[O*4+1],re).distanceTo(R)<w[F*4+2]+w[O*4+2])return!1;return!0};for(let F=te;F<te+ke;F++){const A=w[F*4+1],D=m+2*w[F*4+2];if(!Y(A,D)){await e.yield?.();for(let O=.002;O<=2.1;O+=.002){const I=Qe(F,A-O,D)?A-O:Qe(F,A+O,D)?A+O:null;if(I!==null){J(1.045,I,R),w[F*4]=R.y-4.6-B-.6,w[F*4+1]=I;break}}}}x.needsUpdate=!0},setLook(v={}){const m=(x,w)=>{w!=null&&x.value.set(w)};m(i.uSkyCol,v.sky),m(i.uRiftCol,v.rift),m(i.uGardenCol,v.garden),m(i.uRoofCol,v.roof),m(i.uWallCol,v.wall),m(i.uDadoCol,v.dado),m(i.uClothCol,v.cloth),m(i.uKeyCol,v.keyColor),m(i.uAmbCol,v.ambient),m(i.uSpark,v.spark),v.keyDir&&i.uKeyDir.value.copy(v.keyDir).normalize(),v.rain!=null&&(i.uBeadAmt.value=Z(.34*v.rain,0,.7))},recordUniforms:ze,beadUniforms:{record:Oe.material.uniforms,horn:_e.uniforms},warpAt:je,needleAt:Ze,recordAngle:Pe,warpAmplitude:g,labelColor:f,hour:h,warpAtXZ(v,m,x){const w=Pe(v),V=Math.cos(w),re=Math.sin(w),Y=m*V-x*re,ne=m*re+x*V;return vo(Math.hypot(Y,ne),Math.atan2(ne,Y),g)},update(v,m){Po=m,i.uTime.value=m%4e3,T.updateWorldMatrix(!0,!1),i.uStageInv.value.setFromMatrix4(T.matrixWorld).invert(),i.uStagePos.value.setFromMatrixPosition(T.matrixWorld);const x=Pe(m);De.rotation.y=x,ze.uRecToStage.value.setFromMatrix4(No.makeRotationFromEuler(Do.set(0,x,0))),i.uSwell.value=m*so*4/E%1;const w=je(m)+Ye;ae.rotation.y=Se+6e-4*Math.sin(m*61)*Math.sin(m*7.3),ae.rotation.x=-Math.atan2(w,215)+4e-4*Math.sin(m*47),Ce(Se,K),qe.copy(ie).sub(_).applyAxisAngle(ho,Se).add(K),qe.y+=w,ze.uBoxC.value.copy(qe),Ue.rotation.x=-m*.55,Xe.rotation.y=m*5.2;const V=Math.sin(m*33)*Math.sin(m*5.1+1)+.5*Math.sin(m*71);me.position.set(.035*V,.05*Math.sin(m*41)*Math.sin(m*3.3),0),me.rotation.z=35e-5*V},dispose(){},stats:{buildMs:0}};return Ie.update(0,0),Ie}export{le as GLSL_ROOM,st as buildHero,Fe as grid,J as hornPoint,b as lathe,Re as lin,ue as merge,He as mixc,S as mul,P as place,se as tube};
