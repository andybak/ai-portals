import*as n from"three";import{makePath as Y0}from"../kit/core.js";import{makeSky as Q0,makeCloudField as ti}from"../kit/sky.js";import*as ei from"../kit/terrain.js";import*as J0 from"../kit/fauna.js";import*as ts from"../kit/fx.js";import{buildHero as ai,GLSL_COMMON as Ce,ROCK_VS as oi,ROCK_FS as es}from"../parts/painted-ridges.js";const ni=["#B5472F","#D99A45","#EFE2C4","#9AAB8A","#5C728C","#B8935F","#2B2624"],i=(s,k,f)=>{const g=Math.min(1,Math.max(0,(f-s)/(k-s)));return g*g*(3-2*g)},x=(s,k,f)=>s+(k-s)*f,Ct=(s,k,f)=>Math.min(f,Math.max(k,s)),Ot=(s,k,f,g,S)=>i(k,f,s)*(1-i(g,S,s)),zo=2.3,as=6.1,Ka=16.5,os=`
attribute vec4 aRig;
attribute vec4 iPos;      // x, y, z, yaw
attribute vec4 iPose;     // stride phase, ground pitch, gait 0..1, rear 0..1
attribute vec4 iAux;      // size, tint, kind, seed
vec2 rotX(vec2 v, float a) { float c = cos(a), s = sin(a); return vec2(v.x * c + v.y * s, -v.x * s + v.y * c); }
vec3 rigPose(vec3 p, inout vec3 n) {
  float part = aRig.x, ph = iPose.x, gait = iPose.z, rear = iPose.w;
  float bob = gait * (.02 + .055 * cos(6.28318 * (ph - .84)));
  float rock = gait * .055 * sin(6.28318 * (ph - .62));
  bool foreleg = false;
  if (part > 1.5 && part < 2.5) {
    float leg = aRig.z;
    bool front = leg < 1.5;
    foreleg = front;
    float off = leg < .5 ? .36 : leg < 1.5 ? .46 : leg < 2.5 ? 0. : .10;
    float lp = fract(ph + off);
    float hipY = front ? .95 : 1.02, hipZ = front ? .42 : -.50, Lu = front ? .45 : .47, Ll = front ? .44 : .49;
    float st = lp / .22, sw = clamp((lp - .22) / .78, 0., 1.);
    float e = sw * sw * (3. - 2. * sw);
    float zt = (lp < .22 ? 1.34 * (.5 - st) : 1.34 * (e - .5)) + (front ? .10 : .04);
    float yt = lp < .22 ? 0. : sin(3.14159 * sw) * (front ? .44 : .36) * (1. - .3 * sw);
    vec2 stand = vec2(-(hipY - .06), front ? 0. : -.05);
    vec2 tg = mix(stand, vec2(-(hipY - .06) - bob + yt, zt), gait);
    if (front) tg = mix(tg, vec2(-.50, .30 + .06 * sin(ph * 6.28318 + leg * 2.)), rear);
    else tg = mix(tg, vec2(-(hipY - .14), .10), rear);         // a rearing horse sits down on bent hocks
    float dl = clamp(length(tg), .24, (Lu + Ll) * .995);
    float th = atan(tg.y, -tg.x);
    float A = acos(clamp((Lu * Lu + dl * dl - Ll * Ll) / (2. * Lu * dl), -1., 1.));
    float B = acos(clamp((Lu * Lu + Ll * Ll - dl * dl) / (2. * Lu * Ll), -1., 1.));
    float au = front ? th + A : th - A;
    float al = front ? au - (3.14159 - B) : au + (3.14159 - B);
    vec2 hip = vec2(hipY, hipZ), q = p.yz - hip;
    vec2 pu = hip + rotX(q, au);
    vec2 knee = hip + rotX(vec2(-Lu, 0.), au);
    vec2 pl = knee + rotX(q - vec2(-Lu, 0.), al);
    p.yz = mix(p.yz, mix(pu, pl, aRig.y), aRig.w);
    n.yz = rotX(n.yz, mix(au, al, aRig.y) * aRig.w);
    p.y += bob;
  } else {
    if (part > .5 && part < 1.5) {
      float na = -gait * (.34 + .09 * sin(6.28318 * (ph - .30))) + rear * .30;
      na *= .35 + .65 * aRig.y;
      na += rear * (.25 - .8 * aRig.y * aRig.y);              // neck arched, chin tucked
      vec2 pv = vec2(1.20, .50);
      p.yz = pv + rotX(p.yz - pv, na); n.yz = rotX(n.yz, na);
    } else if (part > 2.5) {
      float t = aRig.y;
      float ta = -(gait * (1.0 + .22 * sin(12.566 * ph - t * 3.)) + iAux.z * .9) * smoothstep(0., .3, t);
      vec2 pv = vec2(1.30, -.76);
      p.yz = pv + rotX(p.yz - pv, ta); n.yz = rotX(n.yz, ta);
      p.x += .06 * t * sin(12.566 * ph + t * 4. + iAux.w * 6.) * gait;
    }
    vec2 bc = vec2(1.05, -.05);
    p.yz = bc + rotX(p.yz - bc, rock); n.yz = rotX(n.yz, rock);
    p.y += bob;
  }
  if (part < 1.5 || part > 2.5 || foreleg) {                 // a half rear: everything but the hind legs turns about the hips
    vec2 hp = vec2(1.02, -.50);
    float rr = rear * .62;
    p.yz = hp + rotX(p.yz - hp, rr); n.yz = rotX(n.yz, rr);
  }
  p.y -= .08 * rear;
  p *= iAux.x;
  p.yz = rotX(p.yz, iPose.y); n.yz = rotX(n.yz, iPose.y);
  float cy = cos(iPos.w), sy = sin(iPos.w);
  p = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
  n = vec3(n.x * cy + n.z * sy, n.y, -n.x * sy + n.z * cy);
  return p + iPos.xyz;
}
`,si=`
#include <common>
#include <fog_pars_vertex>
${os}
attribute vec3 color;
varying vec3 vW, vN, vC, vM; varying vec4 vAx;
void main() {
  vec3 n = normal;
  vec3 w = rigPose(position, n);
  vM = position; vAx = iAux;
  vW = w; vN = n; vC = color * mix(vec3(1.), vec3(iAux.y, iAux.y * .97, iAux.y * .9), step(.12, color.r));
  vec4 mvPosition = viewMatrix * vec4(w, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ii=`
#include <common>
#include <fog_pars_fragment>
${Ce}
uniform vec4 uLife;        // rim strength, gloss, snow dusting, spring moult
varying vec3 vW, vN, vC;
#ifdef SHADE
varying float vSh;
#endif
#ifdef COAT
varying vec3 vM; varying vec4 vAx;
#endif
void main() {
  vec3 n = normalize(vN + vec3(0., 1e-4, 0.));
  if (!gl_FrontFacing) n = -n;
  vec3 V = normalize(uCam - vW + vec3(0., 1e-4, 0.));
  vec2 wt = wetAt(vW);
  float key = keyAt(vW);
  #ifdef SHADE
  key *= vSh;
  #endif
  vec3 alb = vC;
  float sheen = 0.;
  #ifdef COAT
  {
    // a living coat, not one flat tone: hair grain along the body, a darker topline over a paler flank, smudges over
    // shoulder and haunch, faint bars on the forearm, moult patches in spring; the grain also roughens the normal
    float body = step(.115, vC.r) * (1. - step(.75, vC.g));         // dun hair (not mane, tail, stockings, hooves)
    vec2 hq = vec2(vM.z * 5. + vM.y * 2., vM.x * 9. + vM.y * 7.);
    float g1 = vnoise(hq * 3.1 + vAx.w * 17.), g2 = vnoise(vec2(vM.z * 2.3 + vAx.w * 9., vM.y * 3.3 + vM.x * 2.1)), g3 = vnoise(hq * 13.);
    float top = smoothstep(.95, 1.45, vM.y) * (1. - vAx.z);
    alb *= mix(1., (.86 + .30 * g1) * (.84 + .30 * g2) * (1.10 - .26 * top) * (.92 + .16 * g3), body);
    alb *= 1. - .22 * body * smoothstep(.5, .9, sin(vM.y * 62.)) * (1. - smoothstep(.62, .8, vM.y)) * (1. - vAx.z);
    alb = mix(alb, alb * 1.35 + .02, body * uLife.w * smoothstep(.52, .66, vnoise(vec2(vM.z * 3.7 + vAx.w * 31., vM.y * 4.3))));
    n = normalize(n + vec3(g1 - .5, (g3 - .5) * .6, g2 - .5) * (.42 * body));
    sheen = body * (.10 + .10 * g1);
    #ifndef MOUNT
    {
      // a goitered gazelle's flank: a dark band along the side between the sandy back and the white belly, and the back itself a
      // tone deeper toward the spine (vAx.z is 1 on a gazelle)
      float flank = smoothstep(.885, .92, vM.y) * (1. - smoothstep(1.03, 1.08, vM.y)) * smoothstep(-.47, -.36, vM.z) * (1. - smoothstep(.30, .40, vM.z));
      alb = mix(alb, vec3(.045, .030, .018), .92 * flank * vAx.z);
      alb *= 1. - .22 * vAx.z * body * smoothstep(1.05, 1.25, vM.y);
    }
    #endif
  }
  #endif
  alb *= mix(1., mix(.60, .82, uBed.w), wt.x);            // (at dawn everything has been wet all night: it is not darkened twice)
  #ifdef MOUNT
  // (close under the eye a soaked coat is the dry coat a tone darker, browner and glossy: still a dun neck clearly lighter than
  // the mane that stands on it, never an olive apron under a black block)
  alb *= mix(vec3(1.), vec3(1.52, 1.30, 1.04), wt.x * (1. - uBed.w));
  {
    // the mane is stiff hair standing side by side, and it is darker still when it is soaked
    float mane = 1. - step(.11, vC.r);
    alb *= mix(1., (.62 + .76 * vnoise(vec2(vM.z * 38. + vM.x * 7., vM.y * 2.5))) * (1. - .40 * wt.x), mane);
  }
  alb = mix(alb, vec3(dot(alb, vec3(.3333))) * vec3(.80, .90, 1.12), .6 * uFinC.w);      // by moonlight our own animal is slate and silver like the rest
  #elif defined(COAT)
  alb = mix(alb, vec3(dot(alb, vec3(.3333))) * vec3(.74, .86, 1.10), (.25 + .45 * vAx.z) * uFinC.w) * (1. - .30 * vAx.z * uFinC.w);      // and the gazelles' white is blue-grey, never cream
  #endif
  float skyGloss = .5;
  #ifdef COAT
  alb *= mix(1., .84, wt.x);            // a soaked coat is darker than a dry one
  skyGloss = .25;
  #endif
  alb = mix(alb, vec3(.78, .82, .88), uLife.z * uBed.z * smoothstep(-.7, .7, wt.y) * smoothstep(.45, .9, n.y));
  float d = dot(n, uSun);
  float ndl = max(d, 0.) * .8 + max(d * .5 + .5, 0.) * .2;
  #ifdef COAT
  ndl *= .82;                                                // a coat is matt hair: in the full low sun it is a deep dun, with a shadow side
  #endif
  vec3 irr = uSunCol * (ndl * key) + uSkyCol * (.42 + .58 * (n.y * .5 + .5)) + uBounce * (.8 * (1. - n.y) * (.3 + .7 * key));
  // a flank in deep shade stands in the glow of the land around it: dun, never black (a floor under the light, none where it is lit already)
  irr += (dot(uSkyCol, vec3(.3333)) * vec3(.62, .55, .47) + uSkyCol * .25 + uSunCol * vec3(.050, .040, .029)) * (max(1. - smoothstep(.12, .45, dot(irr, vec3(.3333))), wt.x * .8 * (1. - max(d, 0.) * key)) * (1. - .6 * uFinC.w));
  #ifdef MOUNT
  // the side of our own animal's neck that is turned from the sun stands in the light of the sky and of the land beside it: the mane
  // is a dark ridge on a dun neck from either side, never one dark edge
  irr += (uSkyCol * .36 + uSunCol * vec3(.080, .064, .048)) * ((1. - max(d, 0.) * key) * (1. - .5 * uFinC.w));
  #endif
  vec3 col = alb * irr;
  col *= .78 + .22 * smoothstep(-.9, .1, n.y);
  float fr = 1. - max(dot(n, V), 0.);
  float rim = fr * fr * sqrt(fr) * max(dot(n, uSun) + .35, 0.);
  #ifdef COAT
  // on a coat the low sun's rim is the coat's own colour, brighter and narrow: a line of gold along the sunward edge of a dun
  // animal with a shadow side, never an animal bleached to cream
  col += uSunCol * (alb * 3.0 + .015) * (rim * fr * fr * key * uLife.x * 1.15);
  #else
  col += uSunCol * (rim * key * uLife.x * (.12 + .95 * dot(alb, vec3(.33)) * 3.));
  #endif
  col += uSunCol * (fr * fr * max(n.y * .6 + .4, 0.) * uBed.w * (1. - key) * (.05 + .45 * dot(alb, vec3(.33))));      // before sunrise the rose of the sky lies along every back
  float wetG = 1.;
  #ifdef MOUNT
  {
    // wet, the coat is glossy: the sky lies along the top of the neck in soft streaks down the lie of the hair, and the soaked mane
    // carries a dull light on its blades
    float maneK = 1. - step(.11, vC.r);
    wetG = 1. - .88 * maneK;                 // (the wet gloss of sun and sky on the crest of the mane was a white thread down its ridge)
    float lie = vnoise(vec2(vM.x * 9., vM.z * 1.7 + 3.)) * .6 + vnoise(vec2(vM.x * 23. + 5., vM.z * 4.1)) * .4;
    col += uSkyCol * (wt.x * (1. - maneK) * (.04 + .22 * fr * fr) * smoothstep(.35, .75, lie) * smoothstep(-.2, .5, n.y));
    col += uSkyCol * (wt.x * maneK * .003 * smoothstep(.45, .8, vnoise(vec2(vM.z * 38. + vM.x * 7., vM.y * 2.5))));
    // rain beads in the mane and on the hair of the neck: a few soft glints, each several pixels across, of sky, and of sun when it
    // breaks (never single white specks: a bead's cell is a hand wide and its light falls off softly from its middle)
    vec2 bq = vec2(vM.x * 5.6 + vM.y * 2.3, vM.z * 1.7 + vM.y * .8), bi = floor(bq), bf = fract(bq) - .5;
    float bd = length(bf + (vec2(hash21(bi), hash21(bi + 7.7)) - .5) * .42);
    float bead = 1. - smoothstep(.04, .30, bd); bead *= bead * step(.66, hash21(bi + 3.1)) * wt.x * uShade2.z * (1. - .75 * maneK);
    col += (uSkyCol * .17 + uSunCol * (key * .34)) * bead;
  }
  #endif
  vec3 hv = normalize(uSun + V + vec3(0., 1e-3, 0.));
  col += (uSunCol * (pow(max(dot(n, hv), 1e-4), 28.) * key * wt.x * uLife.y) + uSkyCol * (fr * fr * wt.x * uLife.y * skyGloss)) * wetG;
  col += uSunCol * (pow(max(dot(n, hv), 1e-4), 20.) * key * sheen * .45 * step(0., d));      // (a narrow gloss along the back: broad, it washed a whole sunlit flank to one flat cream)
  {                                                          // the exit ring lights whatever runs toward it, and rims it in gold
    vec3 toR = uRing.xyz - vW; float dR = length(toR) + 1e-3; vec3 Lr = toR / dR;
    float attR = uRing.w / (1. + dR * dR / 520.);
    col += uRingB.rgb * (attR * (alb * (.2 + .8 * max(dot(n, Lr), 0.)) + .10 * fr * fr * max(dot(n, Lr) + .4, 0.)));
  }
  gl_FragColor = vec4(max(col, vec3(0.)), 1.);
  #include <fog_fragment>
}`,ri=`
#include <common>
#include <fog_pars_vertex>
${os}
attribute vec4 iPath;     // s, lat, tangent x, tangent z
uniform sampler2D uHT;
uniform vec4 uHTr;        // s0, 1 / s span, lat half range, row step
uniform vec3 uSun;
varying vec3 vP, vN; varying vec2 vBk;
float gh(float s, float lat) { return texture2D(uHT, vec2(lat / (2. * uHTr.z) + .5, (s - uHTr.x) * uHTr.y)).r; }
void main() {
  vec3 n = normal;
  vec3 w = rigPose(position, n);
  float h = max(w.y - iPos.y, 0.);
  vec2 tn = iPath.zw, rt = vec2(-tn.y, tn.x);
  // the ray of the sun through this point is followed down to the ground it really meets: thrown as if the land were level, the
  // shadow of an animal beside a wall climbs it as a black blade ten times its height
  vec2 dxz = uSun.xz / max(uSun.y, .1), om;
  float ta = 0., tb = h, tm, kk;
${`  tm = .5 * (ta + tb); om = w.xz - dxz * tm - iPos.xz;
  kk = step(gh(iPath.x + dot(om, tn), iPath.y + dot(om, rt)), w.y - tm); ta = mix(ta, tm, kk); tb = mix(tm, tb, kk);
`.repeat(5)}  vec2 g = w.xz - dxz * tb;
  vec2 off = g - iPos.xz;
  float s = iPath.x + dot(off, tn), lat = iPath.y + dot(off, rt);
  float y0 = gh(s, lat), ys = gh(s + uHTr.w, lat), yl = gh(s, lat + 1.2);
  vec2 slope = vec2((ys - y0) / uHTr.w, (yl - y0) / 1.2);
  vN = normalize(vec3(-tn.x * slope.x - rt.x * slope.y, 1., -tn.y * slope.x - rt.y * slope.y));
  vBk = vec2(1., 1.);
  vP = vec3(g.x, y0 + .05, g.y);
  vec4 mvPosition = viewMatrix * vec4(vP, 1.);
  gl_Position = projectionMatrix * mvPosition;
  if (iAux.x < .01) gl_Position = vec4(0., 0., -3., 1.);
  #include <fog_vertex>
}`;class Nt{constructor(){this.p=[],this.c=[],this.r=[],this.i=[]}get n(){return this.p.length/3}tube(k,f,g=1,S=3,v=1){const U=[];for(let _=0;_<k.length-1;_++)for(let y=0;y<g;y++)U.push(Nt.mix(k,_,y/g));U.push(Nt.mix(k,k.length-2,1));const E=this.n,V=U.length;for(let _=0;_<V;_++){const y=U[Math.max(0,_-1)],P=U[Math.min(V-1,_+1)],h=U[_];let F=P.y-y.y,O=P.z-y.z;const Y=Math.hypot(F,O)||1;F/=Y,O/=Y;const at=O,ft=-F;for(let Q=0;Q<f;Q++){const J=Q/f*Math.PI*2,A=Math.cos(J),T=Math.sin(J),rt=Math.sign(T)*Math.pow(Math.abs(T),v),I=Math.sign(A)*Math.pow(Math.abs(A),v);this.p.push((h.x||0)+rt*h.w,h.y+at*I*h.d,h.z+ft*I*h.d);let vt=h.col;h.top&&A>.86?vt=h.top:h.bot&&A<-.25&&(vt=Nt.mc(h.col,h.bot,Math.min(1,(-.25-A)*2.2))),this.c.push(vt[0],vt[1],vt[2]),this.r.push(h.rig[0],h.rig[1],h.rig[2],h.rig[3]||0)}}for(let _=0;_<V-1;_++)for(let y=0;y<f;y++){const P=E+_*f+y,h=E+_*f+(y+1)%f,F=P+f,O=h+f;this.i.push(P,F,h,h,F,O)}for(const _ of[0,1])if(S&_+1){const y=U[_?V-1:0],P=E+(_?V-1:0)*f,h=this.n;this.p.push(y.x||0,y.y,y.z),this.c.push(y.col[0],y.col[1],y.col[2]),this.r.push(y.rig[0],y.rig[1],y.rig[2],y.rig[3]||0);for(let F=0;F<f;F++)_?this.i.push(P+F,h,P+(F+1)%f):this.i.push(P+F,P+(F+1)%f,h)}}static mc(k,f,g){return[x(k[0],f[0],g),x(k[1],f[1],g),x(k[2],f[2],g)]}static mix(k,f,g){const S=k[f],v=k[f+1],U=g*g*(3-2*g)*.5+g*.5;return{y:x(S.y,v.y,g),z:x(S.z,v.z,g),w:x(S.w,v.w,U),d:x(S.d,v.d,U),x:x(S.x||0,v.x||0,g),col:Nt.mc(S.col,v.col,g),top:S.top&&v.top?Nt.mc(S.top,v.top,g):null,bot:S.bot&&v.bot?Nt.mc(S.bot,v.bot,g):null,rig:[S.rig[0],x(S.rig[1],v.rig[1],g),S.rig[2],x(S.rig[3]||0,v.rig[3]||0,g)]}}build(){const k=new n.BufferGeometry;return k.setAttribute("position",new n.Float32BufferAttribute(this.p,3)),k.setAttribute("color",new n.Float32BufferAttribute(this.c,3)),k.setAttribute("aRig",new n.Float32BufferAttribute(this.r,4)),k.setIndex(this.i),k.computeVertexNormals(),k}}const yt=(s,k=1)=>{const f=new n.Color(s);return[f.r*k,f.g*k,f.b*k]};function So(s,k){const f=new Nt,g=k==="gazelle",S=[.76,.74,.68],v=g?yt("#9C6A36",.5):yt("#B8935F",.56),U=g?S:yt("#D8C6A0",.58),E=g?[.03,.025,.022]:[.03,.026,.024],V=g?Nt.mc(v,[.12,.07,.03],.5):s>1?[.07,.05,.035]:Nt.mc(v,[.05,.04,.03],.62),_=g?S:[.045,.036,.03],y=[.03,.028,.026],P=g?.56:1,h=g?.7:1,F=g?.5:s>1?1.16:1.3,O=g?.5:1,Y=[5,8,14][s],at=[3,5,8][s],ft=[4,6,12][s],Q=[1,1,2][s],J=(G,X,$,tt)=>({z:G,y:X,w:$*P,d:tt*h,col:g&&G<-.6?S:v,top:g&&G<-.6?S:V,bot:U,rig:[0,0,0]});f.tube([J(-.8,1.12,.05,.09),J(-.71,1.1,.2,.25),J(-.55,1.085,.275,.305),J(-.33,1.065,.268,.295),J(-.08,1.05,.285,.3),J(.16,1.06,.29,.315),J(.38,1.09,.265,.325),J(.55,1.1,.215,.285),J(.67,1.11,.11,.17)],Y,Q,3,.86);const A=1.2,T=.5,rt=g?1.9:1.67,I=g?.8:.95,vt=(G,X,$)=>({y:x(A,rt,G)+.03*Math.sin(G*3.1),z:x(T,I,G),w:X*O,d:$*O,col:v,bot:U,rig:[1,G,0]});f.tube([vt(-.12,.205,.3),vt(.25,.17,.255),vt(.62,.128,.195),vt(1,.1,.145)],ft,Q,0,.9);const Mt=g?.72:1.12,Lt=-.62*.56*Mt,ee=.78*.56*Mt,Kt=(G,X,$,tt)=>({y:rt+.02+Lt*G,z:I-.02+ee*G,w:X*Mt,d:$*Mt,col:tt,rig:[1,1,0]});if(f.tube([Kt(-.14,.085,.1,v),Kt(.12,.1,.145,v),Kt(.45,.092,.135,v),Kt(.78,.066,.092,Nt.mc(v,U,.6)),Kt(1,.058,.07,U)],ft,Q,3,.9),s>0)for(const G of[-1,1]){const X=($,tt)=>({x:G*(.065+.03*$)*Mt,y:rt+.09+.16*$,z:I-.06-.02*$,w:tt,d:tt*.6,col:$>.6?E:v,rig:[1,1,0]});if(f.tube([X(0,.035),X(.45,.04),X(1,.006)],s>1?5:3,1,0),g){const $=tt=>({x:G*(.045+.13*Math.sin(tt*2.6)*(1-.25*tt)),y:rt+.07+.5*tt,z:I-.07-.16*tt*tt,w:.034*(1.15-tt),d:.034*(1.15-tt),col:E,rig:[1,1,0]});f.tube([$(0),$(.3),$(.65),$(1)],4,1,0)}}if(!g){const G=X=>{const $=x(A,rt,X)+.03*Math.sin(X*3.1),tt=x(T,I,X),kt=x(.265,.145,X);return[$+.69*kt,tt-.72*kt]};if(s>1)for(let X=0;X<13;X++){const $=.02+X*.074,tt=$+.085,kt=G($),St=G(tt),ae=.1+.03*Math.sin(X*2.3),lt=(Pt,Fe,pe,Ve)=>({y:Pt,z:Fe,w:pe,d:.004,col:E,rig:[1,Ve,0]});f.tube([lt(kt[0]-.03,kt[1]+.02,.03,$),lt((kt[0]+St[0])/2+ae*.72,(kt[1]+St[1])/2-ae*.69,.012,($+tt)/2),lt(St[0]-.03,St[1]+.02,.03,tt)],3,1,0)}else{const X=$=>{const tt=G($);return{y:tt[0]+.03,z:tt[1]-.03,w:.022,d:.065,col:E,rig:[1,$,0]}};f.tube([X(0),X(.5),X(1)],3,1,0)}}const j=(G,X,$,tt,kt,St)=>{const ae=St.map(([lt,Pt,Fe,pe])=>{const Ve=Ct((kt+.07-lt)/.14,0,1),Je=lt<.045?y:lt>kt+.12?v:Nt.mc(v,_,Ct((kt+.12-lt)/.2,0,1));return{x:X,y:lt,z:tt+(pe||0),w:Pt*F,d:Fe*F,col:Je,rig:[2,Ve,G,Ct(($+.1-lt)/.3,0,1)]}});f.tube(s===0?ae.filter((lt,Pt)=>Pt%2===0||Pt===ae.length-1):ae,at,Q,2)},H=[[1,.1,.155],[.82,.078,.108],[.6,.052,.064],[.5,.054,.06],[.43,.04,.043],[.22,.034,.037],[.12,.043,.05],[.07,.04,.048,.01],[0,.056,.066,.015]],D=[[1.1,.125,.225],[.86,.095,.155],[.64,.056,.078],[.55,.052,.072,-.01],[.47,.04,.05],[.22,.035,.039],[.12,.043,.05],[.07,.04,.048,.01],[0,.056,.066,.015]];j(0,.165*P,.95,.42,.5,H),j(1,-.165*P,.95,.42,.5,H),j(2,.155*P,1.02,-.5,.55,D),j(3,-.155*P,1.02,-.5,.55,D);const st=g?.44:1,wt=(G,X,$)=>({y:1.3-.86*G*st,z:-.76-.05*Math.sin(G*3),w:X*(g?1.5:1),d:$*(g?1.5:1),col:G<.18&&!g?v:E,rig:[3,G,0]});return f.tube([wt(0,.04,.04),wt(.2,.055,.06),wt(.5,.075,.085),wt(.8,.06,.07),wt(1,.012,.012)],[3,4,6][s],Q,0),f.build()}function li(s){const k=[],f=[],g=[],S=[],v=yt(s?"#574737":"#4b3524"),U=yt(s?"#30271f":"#2b1e15"),E=yt(s?"#d9cdb8":"#b48b4c"),V=yt(s?"#6f5d49":"#735738"),_=s?yt("#2c2622"):[.034,.028,.023],y=yt("#d8b040",.75),P=yt(s?"#e6dccb":"#3d2c1e"),h=(A,T,rt,I,vt=0,Mt=0,Lt=0)=>(k.push(A,T,rt),f.push(I[0],I[1],I[2]),g.push(vt,Mt,Lt,0),k.length/3-1),F=(A,T,rt,I)=>S.push(A,T,rt,A,rt,I),O=(A,T,rt,I)=>{const vt=A.map(([Mt,Lt,ee,Kt],j)=>{const H=[];for(let D=0;D<T;D++){const st=D/T*6.2832;H.push(h(Math.sin(st)*Lt,(Kt||0)+Math.cos(st)*ee,Mt,rt(j,Math.cos(st)),0,0,I))}return H});for(let Mt=0;Mt<vt.length-1;Mt++)for(let Lt=0;Lt<T;Lt++)F(vt[Mt][Lt],vt[Mt][(Lt+1)%T],vt[Mt+1][(Lt+1)%T],vt[Mt+1][Lt]);return vt};O([[.3,.05,.052,.012],[.21,.082,.086,0],[.07,.108,.112,-.006],[-.11,.1,.1,-.004],[-.28,.068,.062,.004],[-.41,.03,.022,.012]],8,(A,T)=>A<1?E:T>.2?Nt.mc(E,v,Math.min(1,A*.7)):P,0);const Y=O([[.29,.046,.048,.014],[.345,.058,.056,.022],[.405,.052,.048,.02],[.452,.03,.03,.008]],8,(A,T)=>T>-.3?E:Nt.mc(E,v,.6),1);{const A=Y[3],T=h(0,.018,.492,y,0,0,1),rt=h(0,-.03,.512,_,0,0,1);for(let I=0;I<8;I++)S.push(A[I],A[(I+1)%8],T);S.push(A[3],T,rt,A[5],rt,T,A[3],rt,A[4],A[4],rt,A[5])}const at=s?.56:1,ft=s?.62:1,Q=s?3:6;for(const A of[-1,1]){const T=[],rt=[],I=[],Mt=.085+.65*at,Lt=D=>.17+(s?-.16*D*D:.055*Math.sin(D*2.6)),ee=D=>(.4-.07*D)*ft;for(let D=0;D<=5;D++){const st=D/5,wt=A*(.085+st*.65*at),G=Lt(st),X=ee(st);T.push(h(wt,.022,G,U,st)),rt.push(h(wt,.03,G-X*.36,V,st)),I.push(h(wt,.004,G-X*(1+.05*Math.sin(D*2.2)),D===0?v:_,st))}for(let D=0;D<5;D++)F(T[D],T[D+1],rt[D+1],rt[D]),F(rt[D],rt[D+1],I[D+1],I[D]);const Kt=Lt(1),j=ee(1),H=s?[.36,.33,.25]:[.27,.315,.33,.31,.27,.215];for(let D=0;D<Q;D++){const st=(s?6+D*9:-9+D*12.5)*Math.PI/180,wt=Kt-.012-(D+.5)*j*.95/Q,G=H[D]*(s?.8:1),X=j*(s?.5:.74)/Q,$=Math.cos(st),tt=-Math.sin(st),kt=h(A*(Mt-.02),.014,wt+X,D<1?U:_,1,D+1),St=h(A*(Mt-.02),.01,wt-X,_,1,D+1),ae=h(A*(Mt+$*G*.62)-0*tt,.012,wt+tt*G*.62+X*.72,_,1.19,D+1),lt=h(A*(Mt+$*G*.62),.01,wt+tt*G*.62-X*.72,_,1.19,D+1),Pt=h(A*(Mt+$*G),.01,wt+tt*G,_,1.3,D+1);F(kt,ae,lt,St),S.push(ae,Pt,lt)}}{const T=[],rt=[];for(let I=0;I<=4;I++){const vt=I/4*2-1;T.push(h(vt*.06,.006,-.36,v,0,0,2)),rt.push(h(vt*.185*(s?.7:1),0,-.7+.05*vt*vt,s?E:_,0,0,2))}for(let I=0;I<4;I++)F(T[I],T[I+1],rt[I+1],rt[I])}const J=new n.BufferGeometry;return J.setAttribute("position",new n.Float32BufferAttribute(k,3)),J.setAttribute("color",new n.Float32BufferAttribute(f,3)),J.setAttribute("aRig",new n.Float32BufferAttribute(g,4)),J.setIndex(S),J.computeVertexNormals(),J}const ci=`
#include <common>
#include <fog_pars_vertex>
attribute vec4 aRig; attribute vec3 color;
uniform float uTime; uniform vec4 uWing;     // dihedral, flap amount, flap rate, scale
uniform vec4 uHead;                          // head turn (radians, to its left positive), head pitch, tail twist, unused
varying vec3 vW, vN, vC;
void main() {
  vec3 p = position, n = normal;
  float t = aRig.x, fl = sin(uTime * uWing.z) * uWing.y;
  float lift = t * t * (uWing.x + fl + .03 * sin(uTime * 1.7 + t * 2.));
  p.y += lift * abs(p.x) * 1.1;
  p.y += step(.5, aRig.y) * (t - 1.) * (.42 + .22 * sin(uTime * 3.1 + aRig.y * 1.7));          // fingered primaries flex and trim
  p.z += step(.5, aRig.y) * (t - 1.) * .12 * sin(uTime * 2.3 + aRig.y * 2.9);
  n = normalize(n + vec3(-sign(p.x) * lift * 1.5, 0., 0.));
  if (aRig.z > .5 && aRig.z < 1.5) {                           // the head turns on the neck and tips down to look
    vec3 q = p - vec3(0., .012, .27);
    float ch = cos(uHead.x), sh = sin(uHead.x), cp = cos(uHead.y), sp = sin(uHead.y);
    q.yz = vec2(q.y * cp - q.z * sp, q.y * sp + q.z * cp); n.yz = vec2(n.y * cp - n.z * sp, n.y * sp + n.z * cp);
    q.xz = vec2(q.x * ch + q.z * sh, -q.x * sh + q.z * ch); n.xz = vec2(n.x * ch + n.z * sh, -n.x * sh + n.z * ch);
    p = q + vec3(0., .012, .27);
  } else if (aRig.z > 1.5) {                                   // the tail twists to steer
    float a = uHead.z * (1. - smoothstep(-.7, -.36, p.z)), ca = cos(a), sa = sin(a);      // none at the tail's root (z -.36), all of it at its tip (z -.7)
    p.xy = vec2(p.x * ca - p.y * sa, p.x * sa + p.y * ca);
  }
  vec4 wp = modelMatrix * vec4(p * uWing.w, 1.);
  vW = wp.xyz; vN = normalize(mat3(modelMatrix) * n); vC = color;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ze=1.9,kn=-.968,hi=.46,ns=.078,ss=1.905,fi=.114,Va=.58,is=.92;function di(s){const k=[],f=[],g=[],S=[],v=yt("#B8935F",.6),U=yt("#dcc69c",.62),E=yt("#94784d",.6),V=[.03,.025,.022],_=[.05,.038,.028],y=[.12,.092,.064],P=yt("#b39662",.58),h=yt("#dcc9a2",.56),F=[.045,.035,.028],O=(j,H,D,st,wt,G,X=0)=>(k.push(j,H,D),f.push(st[0],st[1],st[2]),g.push(wt,G,X,0),k.length/3-1),Y=j=>kn+hi*(ze-Math.min(j,ze))+.014*Math.sin(Math.PI*Ct((j-Va)/(ze-Va),0,1))-2.2*Math.pow(Math.max(0,j-ze),2),at=j=>x(.31,.108,i(Va,ze,j))*(1-.4*i(ze,ze+.2,j)),ft=34,Q=14,J=[],A=Va,T=ze+.18;for(let j=0;j<=ft;j++){const H=A+j/ft*(T-A),D=[];for(let st=0;st<=Q;st++){const wt=(st/Q-.5)*Math.PI*1.12,G=at(H),X=Math.sin(wt),$=Math.cos(wt),tt=Nt.mc(Nt.mc(E,v,i(.16,.42,Math.abs(X))),U,i(.8,1,Math.abs(X)));D.push(O(X*G,Y(H)-(1-$)*G*x(.33,.3,i(1,1.8,H)),-H,tt,0,0,.37))}J.push(D)}for(let j=0;j<ft;j++)for(let H=0;H<Q;H++)S.push(J[j][H],J[j][H+1],J[j+1][H+1],J[j][H],J[j+1][H+1],J[j+1][H]);const rt=72,I=Va+.03,vt=ze-.06,Mt=(j,H)=>x(.036,.012,i(.7,ze-.04,j))*i(I-.05,I+.1,j)*(1+.09*Math.sin(H*1.9)+.06*Math.sin(H*.73+1)-(H%5===2?.16:0)),Lt=j=>x(.029,.016,i(.7,ze,j));let ee=null;for(let j=0;j<=rt;j++){const H=I+j/rt*(vt-I),D=Y(H)-.012,st=Mt(H,j),wt=j*5%9/9,G=Lt(H),X=.05*st,$=.005*Math.sin(j*1.7),tt=[O(-G,D,-H,_,1,0,wt),O(-G*.84+$*.5,D+st*.8,-H-X*.8,V,1,.8,wt),O($,D+st,-H-X,y,1,1,wt),O(G*.84+$*.5,D+st*.8,-H-X*.8,V,1,.8,wt),O(G,D,-H,_,1,0,wt)];if(ee)for(let kt=0;kt<4;kt++)S.push(ee[kt],tt[kt],tt[kt+1],ee[kt],tt[kt+1],ee[kt+1]);ee=tt}for(const j of[-1,1]){const H=j<0?2:3,D=j*ns,st=kn+.004,wt=-ss,G=fi,X=[[0,.02],[.12,.027],[.28,.0335],[.42,.036],[.58,.0315],[.74,.022],[.88,.011]],$=7,tt=kt=>{const St=[];for(const[lt,Pt]of X){const Fe=[];for(let pe=0;pe<=$;pe++){const Ve=(pe/$-.5)*3.5,Je=Math.abs(pe/$-.5)>.36,ma=kt?Nt.mc(h,F,Je?.75:.2*lt):lt>.82?F:Je?Nt.mc(P,F,.8):Nt.mc(v,P,.4+.6*lt),Yt=kt?.8:1;Fe.push(O(D+Math.sin(Ve)*Pt*Yt+j*.022*lt,st+lt*G,wt+(Math.cos(Ve)*.62-.3)*Pt*Yt-lt*.03,ma,H,lt,.37))}St.push(Fe)}const ae=O(D+j*.022,st+G,wt-.03-.003,F,H,1,.37);for(let lt=0;lt<St.length-1;lt++)for(let Pt=0;Pt<$;Pt++)S.push(St[lt][Pt],St[lt][Pt+1],St[lt+1][Pt+1],St[lt][Pt],St[lt+1][Pt+1],St[lt+1][Pt]);for(let lt=0;lt<$;lt++)S.push(St[St.length-1][lt],St[St.length-1][lt+1],ae)};tt(!1),tt(!0)}const Kt=new n.BufferGeometry;return Kt.setAttribute("position",new n.Float32BufferAttribute(k,3)),Kt.setAttribute("color",new n.Float32BufferAttribute(f,3)),Kt.setAttribute("aRig",new n.Float32BufferAttribute(g,4)),Kt.setIndex(S),Kt.computeVertexNormals(),Kt}const ui=`
#include <common>
#include <fog_pars_vertex>
attribute vec4 aRig; attribute vec3 color;
uniform vec4 uRide;       // stride phase, ear turn left, ear turn right, both ears pinned (0..1)
uniform vec4 uRide2;      // how far the neck reaches down and out, how far the head is turned (radians, right positive), left ear laid back, right ear laid back
uniform float uTime;
varying vec3 vW, vN, vC, vM; varying vec4 vAx;
void main() {
  vec3 p = position, n = normal;
  float part = aRig.x, f = -p.z;
  if (part > 1.5) {                                          // ears swivel on their roots, splay as they turn, and pin flat in the rain
    float sg = part < 2.5 ? -1. : 1.;
    vec3 root = vec3(sg * ${ns.toFixed(3)}, ${(kn+.004).toFixed(3)}, -${ss.toFixed(3)});
    vec3 q = p - root;
    float turn = (part < 2.5 ? uRide.y : uRide.z) + .07 * sin(uTime * 1.3 + part * 2.1);
    float c = cos(turn), s = sin(turn);
    q = vec3(q.x * c + q.z * s, q.y, -q.x * s + q.z * c);
    float roll = sg * .55 * min(abs(turn), 1.2), cr = cos(roll), sr = sin(roll);      // a turned ear leans out from the head
    q = vec3(q.x * cr + q.y * sr, -q.x * sr + q.y * cr, q.z);
    // pinned: laid back along the crest and a little out, one on either side of the mane, so that each still shows as a leaf
    // (laid back half way, not flat: from our seat an ear laid flat points straight back at the eye and is seen end on, as a stub
    // sticking out sideways)
    float pk = clamp(uRide.w + (part < 2.5 ? uRide2.z : uRide2.w), 0., 1.), pin = pk * .56, cp = cos(pin), sp = sin(pin);
    q = vec3(q.x, q.y * cp - q.z * sp, q.y * sp + q.z * cp);
    float so = sg * .20 * pk, co = cos(so), sno = sin(so);
    q = vec3(q.x * co + q.z * sno, q.y, -q.x * sno + q.z * co);
    p = root + q + vec3(sg * .008, .004, 0.) * pk;
  }
  if (part > .5 && part < 1.5) p.x += aRig.y * .007 * sin(uTime * 23. + aRig.z * 40.) + aRig.y * .009 * sin(uRide.x * 6.2832 + aRig.z * 9.);
  {                                                          // the neck bends as the head turns: nothing at the withers, all of it at the poll
    float bt = uRide2.y * smoothstep(${(is+.04).toFixed(2)}, 1.9, f), cb = cos(bt), sb = sin(bt);
    p.xz = vec2(p.x * cb - p.z * sb, p.x * sb + p.z * cb);
    n.xz = vec2(n.x * cb - n.z * sb, n.x * sb + n.z * cb);
  }
  float pump = sin(uRide.x * 6.2832), fr = max(f - ${is.toFixed(2)}, 0.);     // the neck pumps down and forward once a stride, hinged at the withers
  p.y += (-.024 * pump - uRide2.x) * fr - .004 * cos(uRide.x * 12.566);
  p.z -= (.050 * pump + 1.4 * uRide2.x) * fr;
  vec4 wp = modelMatrix * vec4(p, 1.);
  vM = position * 2.4 + 1.; vAx = vec4(1., 1., 1., aRig.z);
  vW = wp.xyz; vN = normalize(mat3(modelMatrix) * n); vC = color;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;function pa(s){const k=[],f=[],g=[],S=[],v=[],U=[];s((_,y,P,h,F=0,O=0,Y=0,at=0)=>(k.push(_,y,P),f.push(h[0],h[1],h[2]),g.push(F),S.push(O,Y),v.push(at),k.length/3-1),U);const V=new n.BufferGeometry;return V.setAttribute("position",new n.Float32BufferAttribute(k,3)),V.setAttribute("color",new n.Float32BufferAttribute(f,3)),V.setAttribute("aW",new n.Float32BufferAttribute(g,1)),V.setAttribute("uv",new n.Float32BufferAttribute(S,2)),V.setAttribute("aKind",new n.Float32BufferAttribute(v,1)),V.setIndex(U),V.computeVertexNormals(),V}function zn(s,k,f,g,S,v,U,E,V,_){let y=null;for(let P=0;P<f.length;P++){const h=P/(f.length-1),F=f[Math.max(0,P-1)],O=f[Math.min(f.length-1,P+1)],Y=new n.Vector3(O[0]-F[0],O[1]-F[1],O[2]-F[2]).normalize(),at=new n.Vector3(1,0,0).cross(Y);at.lengthSq()<.01&&at.set(0,0,1).cross(Y),at.normalize();const ft=Y.clone().cross(at),Q=x(g,S,h)*(1+.22*Math.sin(P*2.7+g*40)),J=[];for(let A=0;A<v;A++){const T=A/v*6.2832+P*.5,rt=Math.cos(T)*Q,I=Math.sin(T)*Q;J.push(s(f[P][0]+at.x*rt+ft.x*I,f[P][1]+at.y*rt+ft.y*I,f[P][2]+at.z*rt+ft.z*I,Nt.mc(U,E,h*(.7+.3*(A&1))),x(V,_,h)))}if(y)for(let A=0;A<v;A++){const T=(A+1)%v;k.push(y[A],J[A],y[T],y[T],J[A],J[T])}y=J}}function Ao(s,k,f,g,S,v,U,E,V,_,y=1){const P=new n.Vector3(g[0]-f[0],g[1]-f[1],g[2]-f[2]),h=P.length()||1;P.multiplyScalar(1/h);const F=new n.Vector3(0,1,0).cross(P);F.lengthSq()<.01&&F.set(1,0,0),F.normalize().applyAxisAngle(P,v);const O=s(f[0]-F.x*S,f[1]-F.y*S,f[2]-F.z*S,U,V,0,0,E),Y=s(f[0]+F.x*S,f[1]+F.y*S,f[2]+F.z*S,U,V,1,0,E),at=s(g[0]+F.x*S*y,g[1]+F.y*S*y,g[2]+F.z*S*y,U,_,1,1,E),ft=s(g[0]-F.x*S*y,g[1]-F.y*S*y,g[2]-F.z*S*y,U,_,0,1,E);k.push(O,Y,at,O,at,ft)}function Sn(s){return pa((k,f)=>{const g=yt("#c9bda6",.9),S=yt("#857865",.8),v=[yt("#66774a"),yt("#7a8a5a"),yt("#909c72")],U=s.range(-.25,.25),E=[];zn(k,f,[[0,-.12,0],[.09,.22,.05],[U*.4-.08,.5,-.07],[U*.8+.05,.82,.03],[U,1.12,.05]],.115,.05,5,S,g,0,.1);const V=6;for(let _=0;_<V;_++){const y=_/V*6.2832+s.range(-.4,.4),P=s.range(.3,1.05),h=s.range(.55,1.05),F=s.range(.3,.85),O=s.range(-.25,.25),Y=U*P/1.12,at=Math.cos(y),ft=Math.sin(y),Q=[Y+at*h*.35-ft*O*.3,P+F*.45,ft*h*.35+at*O*.3],J=[Y+at*h*.7+ft*O*.3,P+F*.8+s.range(0,.12),ft*h*.7-at*O*.3],A=[Y+at*h,P+F,ft*h];zn(k,f,[[Y,P,0],Q,J,A],.045,.012,3,g,g,.1,.4),E.push([A,at,ft,1],[J,-ft,at,.8]),_&1&&E.push([Q,ft,-at,.7])}E.push([[U,1.12,.05],Math.cos(U*9),Math.sin(U*9),.9]);for(const[_,y,P,h]of E)for(let F=0;F<2;F++){const O=Math.atan2(P,y)+(F?s.range(.9,2.2):s.range(-.4,.4)),Y=s.range(.55,.85)*h,at=Math.cos(O),ft=Math.sin(O),Q=[_[0]+at*Y*.75,_[1]-Y*s.range(.15,.6),_[2]+ft*Y*.75];Ao(k,f,[_[0]-at*.03,_[1]+.04,_[2]-ft*.03],Q,.2*h,s.range(-.5,.5)+F*1.2,v[(F+(_[1]>1?1:0))%3],1,.35,1,2.1)}})}function rs(s){return pa((k,f)=>{const g=yt("#b08a78"),S=[yt("#7f927a"),yt("#93a48c"),yt("#6f8672")];for(let v=0;v<7;v++){const U=v/7*6.2832+s.range(-.3,.3),E=s.range(.45,1.15),V=s.range(1.15,2),_=Math.cos(U),y=Math.sin(U),P=h=>[_*E*h*h,V*(1-(1-h)*(1-h))-.05,y*E*h*h];zn(k,f,[P(0),P(.35),P(.7),P(1)],.028,.007,3,g,g,0,.5);for(let h=0;h<4;h++){const F=h===3?.97:.42+h*.2,O=P(F),Y=h===3?U:U+(h&1?1:-1)*s.range(.5,1.3),at=s.range(.6,.95)*(h===3?1.15:1),ft=Math.cos(Y),Q=Math.sin(Y),J=h===3?s.range(.25,.6):s.range(.45,.8),A=[O[0]+ft*at*(1-J*.5),O[1]+at*J,O[2]+Q*at*(1-J*.5)];Ao(k,f,O,A,.17,s.range(-.6,.6),S[(v+h)%3],2,F*.5,1),(h===3||h===1)&&Ao(k,f,O,A,.17,1.5708+s.range(-.3,.3),S[(v+h+1)%3],2,F*.5,1)}}})}function ls(){const s=[],k=[],f=[],g=[];for(let v=0;v<3;v++){const U=v*1.0472+.3,E=Math.cos(U)*.5,V=Math.sin(U)*.5,_=v*4;s.push(-E,0,-V,E,0,V,E*1.25,.8,V*1.25,-E*1.25,.8,-V*1.25),k.push(0,0,1,0,1,1,0,1),f.push(0,0,1,1),g.push(_,_+1,_+2,_,_+2,_+3)}const S=new n.BufferGeometry;return S.setAttribute("position",new n.Float32BufferAttribute(s,3)),S.setAttribute("uv",new n.Float32BufferAttribute(k,2)),S.setAttribute("aW",new n.Float32BufferAttribute(f,1)),S.setIndex(g),S}const vi=`
#include <common>
#include <fog_pars_vertex>
${Ce}
attribute float aW; attribute float iShade;
varying vec3 vW; varying vec2 vUv; varying float vSh, vSeed, vBand;
void main() {
  vec4 wp = instanceMatrix * vec4(position, 1.);
  vec3 o = instanceMatrix[3].xyz;
  float d = uFront - dot(o.xz, uWetDir);
  float gust = 1. + 2.6 * exp(-abs(d + 40.) / 55.) * uShade2.z + 1.2 * uShade2.z;
  float band = sin(dot(o.xz, vec2(.11, .05)) - uTime * 2.3) * .5 + .5;        // ripples travelling over the wash floor
  float sway = (.30 + .70 * band) * gust;
  vec2 dir = normalize(uWind);
  wp.xz += dir * (aW * sway * (.16 + .05 * sin(uTime * 5.3 + o.x * 1.7 + o.z * 2.3)));
  wp.y -= aW * sway * .05;
  vW = wp.xyz; vUv = uv; vSh = iShade; vSeed = fract(o.x * 7.31 + o.z * 3.17); vBand = band;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,pi=`
#include <common>
#include <fog_pars_fragment>
${Ce}
varying vec3 vW; varying vec2 vUv; varying float vSh, vSeed, vBand;
void main() {
  float v = vUv.y, x = vUv.x * 2. - 1.;
  float spread = .10 + .90 * pow(max(v, 1e-3), .8);              // the blades fan out from the root
  float fw = fwidth(x) / spread;                                  // one pixel, in blade coordinates
  float q = x / spread, qn = (q * .5 + .5) * 9.;
  if (qn < 0. || qn >= 9.) discard;
  float id = floor(qn), h1 = hash21(vec2(id, vSeed * 91.)), h2 = hash21(vec2(id + 3.7, vSeed * 57.));
  float top = .52 + .46 * h2;                                     // this blade's height
  float bend = (h1 - .5) * .9 * v * v;                            // and its own curve
  float f = fract(qn) - (.5 + (h1 - .5) * .5) - bend;
  float t = v / top;
  float awn = smoothstep(.55, .72, t);                            // the feathered awn above the leaf
  float wd = mix(.062 * (1. - .5 * t), .12, awn) * (1. - smoothstep(.93, 1., t));
  wd = max(wd, min(fw * 4.5 * .75, .5));                          // never under a pixel and a half
  if (t > 1. || abs(f) > wd) discard;
  vec3 alb = mix(vec3(.17, .16, .075), vec3(.47, .43, .23), smoothstep(0., .5, t));
  alb = mix(alb, vec3(.15, .30, .09), uLand.x * .55 * (1. - awn));
  alb = mix(alb, vec3(.63, .59, .47), awn * (.75 + .25 * h1));
  vec2 wt = wetAt(vW);
  alb *= mix(1., mix(.68, .92, uBed.w), wt.x);
  alb = mix(alb, vec3(.80, .84, .90), uBed.z * smoothstep(-.7, .7, wt.y) * .55 * t);
  // before sunrise the grass is slate-violet, its awn tips taking the rose of the sky
  float dawnK = uBed.w * (1. - keyAt(vW));
  alb = mix(alb, mix(vec3(.25, .245, .34), vec3(.80, .50, .52), awn * smoothstep(.7, 1., t)), .62 * dawnK);
  float key = keyAt(vW) * vSh;
  vec3 V = normalize(vW - uCam + vec3(0., 1e-4, 0.));
  float back = max(dot(V, uSun), 0.); back = back * back * back;  // awns glow against the light
  vec3 col = alb * (uSunCol * (key * (.52 + .22 * vBand + .7 * back * (.3 + .7 * awn))) + uSkyCol * (.50 + .26 * t) * (1. + .5 * dawnK));
  col *= (.55 + .45 * smoothstep(0., .22, v)) * (1. - .42 * uFinC.w);   // dark at the root: the tussock sits on the ground; dimmer by moonlight
  gl_FragColor = vec4(max(col, vec3(0.)), 1.);
  #include <fog_fragment>
}`;function cs(){return pa((s,k)=>{const f=[1,1,1],g=[yt("#8a8f7a",.9),yt("#9a9c84",.9),yt("#7b8470",.9)],S=s(-.52,.03,-.52,f,0,0,0,4),v=s(.52,.03,-.52,f,0,1,0,4),U=s(.52,.03,.52,f,0,1,1,4),E=s(-.52,.03,.52,f,0,0,1,4);k.push(S,U,v,S,E,U);const V=h=>h/.68+.5,_=s(.02,.2,-.01,f,.15,.5,.5,3),y=[],P=[];for(let h=0;h<7;h++){const F=h/7*6.2832,O=.3+.035*Math.sin(h*2.9),Y=.19+.03*Math.sin(h*1.7+1),at=Math.cos(F)*O,ft=Math.sin(F)*O,Q=Math.cos(F+.2)*Y,J=Math.sin(F+.2)*Y;y.push(s(at,-.02,ft,f,0,V(at),V(ft),3)),P.push(s(Q,.145+.02*Math.sin(h*4.1),J,f,.1,V(Q),V(J),3))}for(let h=0;h<7;h++){const F=(h+1)%7;k.push(_,P[F],P[h],y[h],P[h],P[F],y[h],P[F],y[F])}for(let h=0;h<3;h++)Ao(s,k,[0,.03,0],[.004*(h-1),.32,0],.33,h*1.0472+.4,g[h],1,0,.8,1.15)})}function hs(){const s=pa((g,S)=>{const v=[.105,.088,.075],U=[.07,.058,.05],E=[.022,.02,.019],V=g(.05,.56,.02,v,0,0,0,5),_=[],y=[];for(let P=0;P<5;P++){const h=P/5*6.2832,F=1+.12*Math.sin(P*2.3);_.push(g(Math.cos(h)*.86*F,.36,Math.sin(h)*.62*F,U,0,0,0,5)),y.push(g(Math.cos(h+.15)*1.22*F,-.06,Math.sin(h+.15)*.9*F,E,0,0,0,5))}for(let P=0;P<5;P++){const h=(P+1)%5;S.push(V,_[h],_[P],y[P],_[P],_[h],y[P],_[h],y[h])}}),k=s.attributes.position,f=s.attributes.normal;for(let g=0;g<k.count;g++){const S=k.getX(g)*.75,v=k.getY(g)*1.6+.25,U=k.getZ(g),E=Math.hypot(S,v,U)||1;f.setXYZ(g,S/E,v/E,U/E)}return s}function An(s,k){return pa((f,g)=>{const S=[];for(let v=0;v<8;v++){const U=v&1?1:-1,E=(v&2)>0,V=v&4?1:-1,_=E?(U>0?.5:.82)*s.range(.9,1.1):1;S.push([U*s.range(.62,1.1)*_,E?s.range(.1,.19)*k:-.16,V*s.range(.4,.82)*(E?.84:1)])}for(const[v,U,E,V]of[[2,6,7,3],[4,5,7,6],[0,2,3,1],[1,3,7,5],[0,4,6,2]])for(const _ of[[v,U,E],[v,E,V]])for(const y of _)g.push(f(S[y][0],S[y][1],S[y][2],S[y][1]>0?[1,1,1]:[.38,.38,.4],0,0,0,6))})}const fs=`
#include <common>
#include <fog_pars_vertex>
${Ce}
attribute vec3 color; attribute float aW; attribute float aKind; attribute float iShade;
varying vec3 vW, vN, vC; varying vec2 vUv; varying float vSh, vSeed, vKind;
void main() {
  vec4 wp = instanceMatrix * vec4(position, 1.);
  vec3 o = instanceMatrix[3].xyz;
  // wind: travelling ripple bands, and the gust front that runs ahead of the wet line
  float d = uFront - dot(o.xz, uWetDir);
  float gust = 1. + 2.6 * exp(-abs(d + 40.) / 55.) * uShade2.z + 1.2 * uShade2.z;
  float band = sin(dot(o.xz, vec2(.11, .05)) - uTime * 2.3) * .5 + .5;
  float sway = (.35 + .65 * band) * gust;
  vec2 dir = normalize(uWind);
  wp.xz += dir * (aW * sway * (.10 + .05 * sin(uTime * 5.3 + o.x * 1.7 + o.z * 2.3 + position.y * 2.)));
  wp.y -= aW * sway * .03;
  vW = wp.xyz; vC = color; vSh = iShade; vUv = uv; vKind = aKind; vSeed = fract(o.x * 7.31 + o.z * 3.17);
  if (aKind > 5.5) {
    // a chip is a piece of the bed it lies on: that bed's colour, quieter and a shade darker than the ground, clay-brown between the fins
    float kth = 1. - smoothstep(-90., -10., min(min(o.x + 520., 520. - o.x), min(o.z + 170., 350. - o.z)));
    vec3 bc = mix(textureLod(uStrata, vec2((dot(o, uNBed) - uBed.x) * uBed.y, .5), 0.).rgb, textureLod(uStrata, vec2((dot(o, uLandBed) * uLand.w - uBed.x) * uBed.y, .5), 0.).rgb, kth);
    vec2 gq = o.xz - uFinA.zw;
    float gT = dot(gq, uFinA.xy), gL = dot(gq, vec2(uFinA.y, -uFinA.x));
    float gapK = (1. - smoothstep(uFinC.y - 16., uFinC.y + 14., gT)) * (1. - smoothstep(uFinC.x + 4., uFinC.x + 9., abs(gL))) * step(-260., gT);
    bc = mix(bc, vec3(.30, .17, .11), gapK * .7);
    bc = mix(vec3(dot(bc, vec3(.2126, .7152, .0722))), bc, .62);
    vC = color * mix(bc, uCream, .20) * (.74 + .16 * vSeed);
  }
  vec3 nn = mat3(instanceMatrix) * normal;
  vN = normalize(mix(nn / max(length(nn), 1e-5), vec3(0., 1., 0.), aKind > .5 && aKind < 4.5 ? .45 : 0.) + vec3(0., 1e-3, 0.));
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ds=`
#include <common>
#include <fog_pars_fragment>
${Ce}
varying vec3 vW, vN, vC; varying vec2 vUv; varying float vSh, vSeed, vKind;
void main() {
  vec3 n = normalize(vN + vec3(0., 1e-4, 0.));
  vec3 alb = vC;
  float alpha = 1., thin = 0., tipk = 0., gloss = 0.;
  float v = vUv.y, x = vUv.x * 2. - 1.;
  vec2 fwx = vec2(fwidth(x), fwidth(v));
  if (vKind > 5.5) {
    // scree: a broken piece of bed in that bed's own colour, grained and chipped
    alb *= .80 + .4 * vnoise(vW.xz * 17. + vW.y * 11. + vSeed * 9.);
    alb = capSat(alb, .46);
    gloss = .16;
  } else if (vKind > 4.5) {
    // a varnished pebble: near black with a brown cast and a dull sheen
    alb *= .8 + .5 * vnoise(vW.xz * 31. + vSeed * 9.);
    gloss = .5;
  } else if (vKind > 3.5) {
    // the soft shadow a cushion lays on the crust
    float r = length(vUv * 2. - 1.);
    alpha = .62 * (1. - smoothstep(.30, 1., r));
    alb = vec3(.012, .011, .013);
  } else if (vKind > 2.5) {
    // the mound: fine twigs radiating from its middle, pale tips over dark gaps
    vec2 p = vUv * 2. - 1.;
    float r = length(p), ang = r < 1e-4 ? 0. : atan(p.y, p.x);
    float tw = vnoise(vec2(ang * 11. + vSeed * 30., r * 6.)), sp = vnoise(p * 27. + vSeed * 17.), sp2 = vnoise(p * 61. + 3.);
    float st = clamp(smoothstep(.38, .62, tw) * .55 + smoothstep(.42, .66, sp) * .45 + (sp2 - .5) * .5, 0., 1.);
    alb = mix(vec3(.040, .045, .034), vec3(.27, .29, .215), st) * (.8 + .4 * vSeed) * (.55 + .45 * (1. - smoothstep(.45, 1., r)));
    n = normalize(n + vec3(sp - .5, 0., tw - .5) * .7);
  } else if (vKind > 1.5) {
    // a tamarisk plume: fine scale-leaved twigs sweeping up either side of a rachis, rusty seed heads toward the tip
    float ax = abs(x);
    float env = pow(max(sin(3.14159 * clamp(v * .93 + .05, 0., 1.)), 0.), .6) * (.78 + .22 * vnoise(vec2(v * 9., vSeed * 40.)));
    if (ax > env) discard;
    float wob = vnoise(vec2(x * 3., v * 5. + vSeed * 9.)) * 1.3;
    float sc = v * 21. - ax * 7. + wob + step(0., x) * .5;
    float fwb = fwx.y * 21. + fwx.x * 7.;
    float bar = abs(fract(sc) - .5);
    // near, the twigs are drawn one by one; where they fall under a pixel the plume is stippled to the same cover, never filled in
    float far = smoothstep(.16, .40, fwb);
    float keep = mix(step(bar, .19), step(hash21(floor(gl_FragCoord.xy) + floor(vSeed * 64.)), .68 - .34 * ax / max(env, .05)), far) + step(ax, max(.03, fwx.x * .8)) * (1. - far);
    if (keep < .5) discard;
    float rust = smoothstep(.70, .98, v + .16 * ax / max(env, .05) + .22 * (vnoise(vec2(v * 6., x * 4. + vSeed * 20.)) - .5));
    alb = mix(alb * (.80 + .45 * vnoise(vec2(sc * .7, x * 5.))), vec3(.40, .185, .10), rust * .8);
    alb *= .55 + .45 * smoothstep(0., .25, v);
    thin = 1.; tipk = rust;
  } else if (vKind > .5) {
    // a spray of fine jointed twigs fanning from the root of the card
    float spread = .12 + .88 * pow(max(v, 1e-3), .7);
    float fw = fwx.x / spread;
    float q = x / spread, qn = (q * .5 + .5) * 7.;
    if (qn < 0. || qn >= 7.) discard;
    float id = floor(qn), h1 = hash21(vec2(id, vSeed * 91.)), h2 = hash21(vec2(id + 3.7, vSeed * 57.));
    float top = .55 + .45 * h2, bend = (h1 - .5) * 1.1 * v * v;
    float f = fract(qn) - (.5 + (h1 - .5) * .5) - bend, t = v / top;
    float node = smoothstep(.70, .78, fract(t * 6. + h1 * 3.));
    float wd = (.075 + .06 * node) * (1. - .5 * t);
    wd = max(wd, min(fw * 3.5 * .75, .5));
    if (t > 1. || abs(f) > wd) discard;
    alb *= (.62 + .75 * t) * (1. - .28 * node) * (.85 + .3 * h1);
    thin = 1.; tipk = t;
  } else {
    alb *= .82 + .36 * vnoise(vW.xz * 23. + vW.y * 17.);          // bark
  }
  vec2 wt = wetAt(vW);
  float key = keyAt(vW) * vSh;
  alb *= mix(1., .62, wt.x);
  if (vKind > 4.5) alb = mix(alb, vec3(dot(alb, vec3(.3333))) * vec3(.80, .90, 1.12), .6 * uFinC.w);      // stones are slate and silver by moonlight
  alb = mix(alb, vec3(.78, .82, .88), uBed.z * smoothstep(-.7, .7, wt.y) * mix(smoothstep(.45, .9, n.y), .5 * tipk, thin) * ((vKind > 3.5 && vKind < 4.5) ? 0. : 1.));
  vec3 V = normalize(uCam - vW + vec3(0., 1e-4, 0.));
  float d = dot(n, uSun);
  float back = max(dot(-V, uSun), 0.); back = back * back * back;
  float ndl = mix(max(d, 0.) * .8 + max(d * .5 + .5, 0.) * .2, .50 + .75 * back * (.3 + .7 * tipk), thin);
  vec3 col = alb * (uSunCol * (ndl * key) + uSkyCol * (.42 + .58 * (n.y * .5 + .5)) + uBounce * (.8 * (1. - n.y) * (.3 + .7 * key)));
  vec3 hv = normalize(uSun + V + vec3(0., 1e-3, 0.));
  float fr = 1. - max(dot(n, V), 0.);
  col += (uSunCol * (pow(max(dot(n, hv), 1e-4), 30.) * key * step(0., d)) + uSkyCol * (fr * fr * .35)) * (gloss * (.35 + .65 * wt.x));
  col *= 1. - .3 * uFinC.w * thin;
  {
    vec3 toR = uRing.xyz - vW; float dR = length(toR) + 1e-3;
    col += alb * uRingB.rgb * (uRing.w / (1. + dR * dR / 520.) * (.25 + .75 * max(dot(n, toR / dR), 0.)));
  }
  gl_FragColor = vec4(max(col, vec3(0.)), alpha);
  #include <fog_fragment>
}`,mi=`
#include <common>
#include <fog_pars_vertex>
${Ce}
attribute vec4 iPos, iPose, iAux;
attribute vec3 aQ;        // corner x, corner y, puff index 0..1
uniform float uSpeed;
varying vec2 vUv; varying float vA, vKey, vMud, vSpray, vClod;
void main() {
  float k = aQ.z, seed = fract(iAux.w * 7.13 + k * 3.7);
  float life = fract(uTime * (.85 + .3 * seed) + k + iAux.w);
  float cy = cos(iPos.w), sy = sin(iPos.w);
  vec3 fwd = vec3(sy, 0., cy), side = vec3(cy, 0., -sy);
  float age = life * 1.25;
  float rearK = iPose.w * (1. - iPose.z);
  vec3 p = iPos.xyz - fwd * (age * uSpeed * iPose.z + .5 - (fract(seed * 7.7) - .3) * 2.2 * rearK) + side * ((seed - .5) * (.7 + 2.4 * rearK));
  float wet = wetAt(p).x;
  vMud = step(.5, wet);
  // dry: a pale puff that swells and lifts; wet: mud clods thrown up and back on short arcs, and a burst of spray at the hoof
  vSpray = vMud * (1. - step(.34, seed));
  // on dry ground two puffs in five are hard clods of crust thrown up and back with the dust
  vClod = (1. - vMud) * step(.60, seed);
  float arc = .12 + 2.7 * life * (1. - life) * (.5 + seed);
  float up = mix(mix(.25 + age * 1.5, arc * .8, vClod), mix(arc, .15 + 1.5 * sqrt(life), vSpray), vMud);
  p += fwd * (max(vMud, vClod) * age * uSpeed * iPose.z * mix(.55, .25, vSpray));
  // the trail lies on the slope the animal has just run up or down, not level behind it: on a climb a level trail hung in the sky
  // as strings of round puffs
  float grade = sin(iPose.y) / max(cos(iPose.y), .4);
  p.y -= clamp(grade, -.5, .5) * dot(iPos.xz - p.xz, fwd.xz);
  p.y += up * iAux.x;
  p.xz += normalize(uWind) * (age * 1.5 * (1. - vMud) * (1. - vClod));
  float size = mix(mix(.3 + 1.25 * life, .030 + .045 * fract(seed * 5.3), vClod), mix(.045 + .065 * seed, .30 + 1.1 * life, vSpray), vMud) * iAux.x;
  vA = mix(mix(sin(3.14159 * sqrt(life)) * (.25 + .2 * rearK), 1. - smoothstep(.75, 1., life), vClod), mix((1. - smoothstep(.75, 1., life)), .34 * (1. - life) * smoothstep(0., .08, life), vSpray), vMud) * max(iPose.z, rearK * 1.6) * step(.01, iAux.x);
  vKey = keyAt(p);
  vUv = aQ.xy * 2.;
  vec4 mvPosition = viewMatrix * vec4(p, 1.);
  vA *= smoothstep(2., 7., -mvPosition.z) * (1. - smoothstep(.5, .85, abs(grade)));      // (on a bank too steep or broken to lay a trail along, no trail)
  mvPosition.xy += aQ.xy * size;
  gl_Position = projectionMatrix * mvPosition;
  if (vA < .004) gl_Position = vec4(0., 0., -3., 1.);
  #include <fog_vertex>
}`,gi=`
#include <common>
#include <fog_pars_vertex>
${Ce}
attribute vec4 iPuff, iPuffA;      // foot xyz, seed; size, strength
varying vec2 vUv; varying float vA, vKey, vSeed, vGlow;
void main() {
  float seed = iPuff.w, t = uTime * (.10 + .08 * seed) + seed * 17.;
  vec3 p = iPuff.xyz;
  float wet = wetAt(p).x;
  p.xz += uWind / max(length(uWind), 1e-3) * (sin(t) * 1.1);
  p.y += iPuffA.x * (.30 + .10 * sin(t * 1.7 + seed * 9.));
  vKey = keyAt(p); vSeed = seed; vUv = position.xy * 2.;
  vec3 toP = p - uCam;
  vGlow = pow(max(dot(toP / max(length(toP), 1e-3), uSun), 0.), 3.);
  vec4 mvPosition = viewMatrix * vec4(p, 1.);
  vA = iPuffA.y * (1. - wet) * smoothstep(1.4, 6., -mvPosition.z);
  mvPosition.xy += position.xy * (iPuffA.x * 2.);
  gl_Position = projectionMatrix * mvPosition;
  if (vA < .004) gl_Position = vec4(0., 0., -3., 1.);
  #include <fog_vertex>
}`,wi=`
#include <common>
#include <fog_pars_fragment>
${Ce}
varying vec2 vUv; varying float vA, vKey, vSeed, vGlow;
void main() {
  float r = dot(vUv, vUv);
  vec2 q = vUv * 1.6 + vSeed * 31.;
  float n = vnoise(q + vec2(uTime * .13, -uTime * .22)) * .6 + vnoise(q * 2.3 + vec2(-uTime * .21, uTime * .33) + 7.) * .4;
  float a = exp(-r * 2.4) * (1. - smoothstep(.55, 1., r)) * smoothstep(.20, .62, n + .34 * (1. - r)) * vA * .26;
  if (a < .004) discard;
  vec3 col = uCream * vec3(1., .88, .66) * (uSkyCol * .9 + uSunCol * (vKey * (.46 + 1.0 * vGlow)));
  gl_FragColor = vec4(max(col, vec3(0.)), a);
  #include <fog_fragment>
}`,yi=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uSunCol, uSkyCol, uCream, uMud;
varying vec2 vUv; varying float vA, vKey, vMud, vSpray, vClod;
void main() {
  float r = dot(vUv, vUv);
  float soft = exp(-r * 3.6) * (1. - smoothstep(.55, 1., r)), hard = 1. - smoothstep(.5, .9, r);
  float a = mix(mix(soft, hard, vClod), mix(hard, soft, vSpray), vMud) * vA;
  if (a < .004) discard;
  // wet clods are the red mud of the beds themselves, lit like any stone
  vec3 wetc = mix(vec3(.19, .058, .036) * (uSkyCol * .9 + uSunCol * (vKey * .5)), mix(uMud * 2.2, vec3(.80), .62) * (uSkyCol * 1.25 + uSunCol * (vKey * .6)), vSpray);
  vec3 col = mix(uCream * mix(1., .42, vClod) * (uSkyCol * 1.1 + uSunCol * (vKey * .62)), wetc, vMud);
  gl_FragColor = vec4(max(col, vec3(0.)), a);
  #include <fog_fragment>
}`,us=`
// how far the front runs ahead here: a ragged bow, fastest in mid-channel, held back along the banks, its lobes shifting
float floodLobe(float a, float t) { return 3.2 * (1. - a * a) - 2.4 + 1.5 * sin(a * 4.3 + t * .7) + .8 * sin(a * 9.1 - t * 1.3 + 1.7); }
// the lumpy surface: standing waves that hold their place, a chop travelling down the current, swells across. x height, y d/ds, z d/da
// (two trains of standing waves at different angles, their phase bent by a slow warp and each fading in and out along and
// across the channel: no crest spans it, no two lie parallel)
vec3 floodWave(float s, float a, float t) {
  float w1 = 2.6 * sin(s * .043 + a * 1.7) + 1.4 * sin(s * .11 - a * 2.9 + 1.3);
  float m1 = (.65 + .35 * sin(s * .21 + 1.)) * (.5 + .5 * sin(s * .13 + a * 2.2 + 4.)), m4 = .5 + .5 * sin(s * .09 - a * 1.6 + t * .2);
  // every train lives in patches a few metres long and a third of the channel wide, and runs askew to the others: short broken crests
  float e1 = smoothstep(-.25, .45, sin(a * 5.3 + s * .17 + 1.) * sin(s * .29 - a * 2.1 + t * .15));
  float e2 = smoothstep(-.25, .45, sin(a * 7.1 - s * .23 + 4.) * sin(s * .19 + a * 3.3 - t * .1 + 2.));
  float p1 = s * .9 + a * 6.5 + w1, p2 = s * 1.7 - t * 3.1 - a * 9., p3 = a * 11. + s * .35 + t * .6, p4 = s * .61 - a * 8.4 + 2. - w1 * .6;
  return vec3(.34 * m1 * e1 * sin(p1) + .14 * e2 * sin(p2) + .16 * sin(p3) + .24 * m4 * e2 * sin(p4),
              .306 * m1 * e1 * cos(p1) + .238 * e2 * cos(p2) + .056 * cos(p3) + .146 * m4 * e2 * cos(p4),
              2.21 * m1 * e1 * cos(p1) - 1.26 * e2 * cos(p2) + 1.76 * cos(p3) - 2.02 * m4 * e2 * cos(p4));
}
`,bi=`
#include <common>
#include <fog_pars_vertex>
attribute vec3 aSL;       // metres along the wash (minus 10000 for the gap sheet), -1..1 across, depth of the water here
attribute vec3 aTan;      // the wash's direction here (x, z), and how high the bed stands here above this row's datum
uniform vec4 uFlood;      // front position, time, bore gate, gap sheet gate
varying vec3 vSL, vW; varying float vB; varying vec2 vTan, vDF;
${us}
void main() {
  vec3 p = position;
  float sheet = step(aSL.x, -5000.);
  float sx = aSL.x + sheet * 10000.;
  float b = mix(uFlood.x - sx + floodLobe(aSL.y, uFlood.y), 200., sheet);          // metres behind the front
  float body = smoothstep(0., 1.6, b);
  float roll = exp(-(b - 1.9) * (b - 1.9) / 3.2) * (.85 + .22 * sin(aSL.y * 5. + uFlood.y * 1.1) + .10 * sin(aSL.y * 11. - uFlood.y * 2.3));      // the front stands up as a lumpy rolling wall
  float h = body * (1. - .35 * smoothstep(8., 70., b)) + .5 * roll;
  float wav = floodWave(sx, aSL.y, uFlood.y).x * body * mix(1., .2, sheet);
  float upW = mix(uFlood.z, uFlood.w, sheet) * (aSL.z * h + wav * min(1., aSL.z * 3.));
  // ahead of the bore a shallow tongue of the same water runs out over the bed for thirty metres, its edge ragged
  float bt = uFlood.x + 30. + 8. * sin(aSL.y * 5. + uFlood.y * .5) + 4. * sin(aSL.y * 11. - uFlood.y * .9 + 2.) - sx;
  float film = smoothstep(0., 4., bt) * (1. - sheet) * step(aTan.z, 1.0) * step(.3, aSL.z) * smoothstep(.85, 1., uFlood.z);
  film *= 1. - smoothstep(-.07, .07, aSL.y - (.50 + .20 * sin(sx * .13) + .10 * sin(sx * .37 + 1.)));       // it leaves bars of the bed dry along its outer side
  float upF = film * (aTan.z + .07 + .03 * sin(sx * 2.3 - uFlood.y * 5. + aSL.y * 9.));
  float up = max(upW, upF);
  p.y += up - (1. - step(.012, up)) * .9;                                           // parked under the ground until the water comes
  vDF = vec2(mix(upW - aTan.z, 1., sheet), film);
  vSL = vec3(sx, aSL.y, sheet); vB = b; vW = p; vTan = aTan.xy;
  vec4 mvPosition = viewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,xi=`
#include <common>
#include <fog_pars_fragment>
${Ce}
uniform vec4 uFlood;
varying vec3 vSL, vW; varying float vB; varying vec2 vTan, vDF;
${us}
void main() {
  float sheet = vSL.z, gate = mix(uFlood.z, uFlood.w, sheet);
  float wetb = smoothstep(0., .3, vDF.x);                               // 1 in the bore's own water, 0 on the shallow tongue ahead of it
  if (gate < .02 || (wetb < .01 && vDF.y < .04)) discard;
  float key = keyAt(vW);
  float t = uFlood.y, adv = vSL.x - t * 7.;                             // the surface travels with the water, faster than the front it feeds
  float flow = vnoise(vec2(vSL.y * 6., adv * .30)) * .6 + vnoise(vec2(vSL.y * 14., adv * .8)) * .4;
  vec3 wv = floodWave(vSL.x, vSL.y, t);
  float churn = vnoise(vec2(vSL.y * 22. + flow * 2., adv * 1.1)) * .5 + vnoise(vec2(vSL.y * 55., adv * 2.7)) * .3 + vnoise(vec2(vSL.y * 140., adv * 6.5)) * .2;
  float lines = smoothstep(.62, .80, vnoise(vec2(vSL.y * 20. + vnoise(vec2(adv * .12, vSL.y * 3.)) * 3., adv * .07)));      // foam drawn out in long lines down the current
  float edge = smoothstep(.66, .9, abs(vSL.y));
  float front = (1. - smoothstep(1.2, 7., vB)) * smoothstep(-.3, .5, vB) * wetb;
  // cream foam: the torn rolling front with the mud boiling up through it, the breaking crests of the standing waves, the banks, the streaks
  float foam = front * smoothstep(.27, .52, churn + .42 * (1. - smoothstep(0., 3.5, vB)))
             + smoothstep(.44, .60, wv.x) * smoothstep(.50, .70, churn + .25 * flow) * smoothstep(.38, .62, vnoise(vec2(vSL.y * 7. + 3., adv * .23))) * .75 * wetb * (1. - sheet)
             + edge * .4 * smoothstep(.45, .7, flow) * wetb + lines * .26 * smoothstep(.45, .7, churn) * wetb * (1. - smoothstep(20., 90., vB) * .6)
             + lines * .30 * (1. - wetb) * smoothstep(.3, .9, vDF.y);
  foam = clamp(foam * mix(1., .5, sheet), 0., 1.);
  vec3 V = normalize(uCam - vW + vec3(0., 1e-4, 0.));
  float rip = vnoise(vec2(vSL.y * 34., adv * 1.9));
  vec2 sl = vec2(wv.y, wv.z / 16.) * (mix(1., .2, sheet) * wetb) + vec2((flow - .5) * .5 + (churn - .5) * .8 * foam, (rip - .5) * .6);
  vec2 rt = vec2(-vTan.y, vTan.x);
  vec3 n = normalize(vec3(-vTan.x * sl.x - rt.x * sl.y, 1., -vTan.y * sl.x - rt.y * sl.y));
  float ndl = max(dot(n, uSun), 0.);
  vec3 mud = vec3(.24, .085, .045) * (.55 + .5 * flow) * mix(.66, 1., wetb);            // thick red-brown water, darker and redder than its banks
  vec3 col = mix(mud, vec3(.66, .53, .41) * (.52 + .46 * churn) * (.72 + .28 * smoothstep(.4, 2.6, vB)), foam) * (uSkyCol * (.55 + .40 * n.y) + uSunCol * (key * (ndl * .9 + .12 * foam)) + vec3(.04, .03, .02));
  float fr = 1. - max(dot(n, V), 0.); fr = fr * fr; fr = fr * fr;
  col = mix(col, uSkyCol, (fr * .46 + .10 * smoothstep(.55, .95, vSL.y)) * (1. - foam));      // the sky lies on it, most along the near bank
  vec3 hv = normalize(uSun + V + vec3(0., 1e-3, 0.));
  col += uSunCol * (key * pow(max(dot(n, hv), 1e-4), 46.) * 1.6 * (1. - .7 * foam));       // the wave faces catch the sun
  gl_FragColor = vec4(max(col, vec3(0.)), 1.);
  #include <fog_fragment>
}`,Mi=`
#include <common>
#include <fog_pars_vertex>
attribute vec3 aShell;
uniform vec3 uEye;
varying vec3 vWp, vSh, vCyl;
void main() {
  vec3 p = uEye + vec3(position.x * aShell.x, position.y * aShell.y, position.z * aShell.x);
  vWp = p; vSh = aShell; vCyl = position;
  vec4 mvPosition = viewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ki=`
#include <common>
#include <fog_pars_fragment>
${Ce}
uniform vec4 uVeilK;      // amount, how much sun reaches us, lean, unused
uniform vec3 uEye;
varying vec3 vWp, vSh, vCyl;
float pn(vec2 p, float per) {       // value noise that closes on itself round the shell
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  float x0 = mod(i.x, per), x1 = mod(i.x + 1., per);
  return mix(mix(hash21(vec2(x0, i.y)), hash21(vec2(x1, i.y)), f.x), mix(hash21(vec2(x0, i.y + 1.)), hash21(vec2(x1, i.y + 1.)), f.x), f.y);
}
void main() {
  float R = vSh.x, k = vSh.z;
  float ang = atan(vCyl.z, vCyl.x + 1e-5) / 6.28318 + .5;
  float per = 8. * floor(mix(30., 52., k)), cellH = R * mix(.24, .15, k);
  float leanA = vWp.y * uVeilK.z / (6.28318 * R);              // the lean, in turns of the shell
  float qx = (ang + leanA) * per;
  float fwx = min(fwidth(qx), 1.);                              // (the seam of the shell is one bad pixel wide: clamp it)
  float col = floor(qx), fx = fract(qx);
  float hc = hash21(vec2(mod(col, per), k * 17. + 3.));
  float y = (vWp.y + uTime * mix(11., 34., k) * (.8 + .4 * hc)) / cellH + hc * 7.;
  float row = floor(y), fy = fract(y);
  float h1 = hash21(vec2(mod(col, per) + 31., row)), h2 = hash21(vec2(row + 5., mod(col, per)));
  // one streak a cell: where it stands in its column, how long it is, whether it is there at all
  float cx = .2 + .6 * h2, len = mix(.55, .95, h1);
  float dpx = abs(fx - cx) / max(fwx, 1e-4);
  float line = (1. - smoothstep(.55, 1.25, dpx)) * (1. - step(.6, fwx));
  float seg = smoothstep(0., .12, fy) * (1. - smoothstep(len - .25, len, fy));
  float there = step(mix(.60, .30, k), h1 * .5 + hc * .5);
  // shafts: thirteen places round the horizon where rain may hang, a third of them filled; they lean with the streaks and
  // stand in the same quarter of the sky on every shell, so the rain reads as three or four columns with clear air between
  float sa = (ang + leanA) * 13. + uTime * .004;
  float shaft = smoothstep(.50, .64, pn(vec2(sa + k * .23, 2.5), 13.) * .82 + pn(vec2(sa * 3. + k * 1.3, 7.5), 39.) * .18);
  // where a streak shows: against the sky, and most against the dark of the storm (down the wet line's own heading)
  vec3 d = normalize(vWp - uEye + vec3(0., 1e-4, 0.));
  float up = smoothstep(.015, .19, d.y);
  float side = .34 + .66 * smoothstep(-.4, .5, dot(d.xz / max(length(d.xz), 1e-3), uWetDir));
  float vis = mix(.09, 1., up * side);
  float edge = 1. - smoothstep(.55, 1., abs(vCyl.y));
  float sun = uVeilK.y * keyAt(vWp);
  float spark = line * there * smoothstep(0., .04, fy) * (1. - smoothstep(.07, .16, fy)) * step(.6, h2) * sun * mix(1., .55, k) * uVeilK.x;
  float body = line * seg * there * mix(.36, .26, k);
  if (uVeilK.x * edge * shaft * (body + .05 * k * up * side + .45 * spark) < .004) discard;
  // does the eye's ray through this streak end in the Ribbon's rock? (the hero walks it out over its own height map)
  float rock = rockBehind(uEye, d);
  spark *= mix(1., .15, rock * smoothstep(.15, .55, k));      // (a lit drop far off is a streak metres long: against the rock it would read as rain passing through the face)
  vis *= mix(1., .10, rock);
  float a = uVeilK.x * edge * shaft * (body * vis + .05 * k * up * side * (1. - rock) + .45 * spark);
  if (a < .004) discard;
  float key = keyAt(vWp) * (.35 + .65 * uVeilK.y);
  vec3 colr = uSkyCol * mix(1.15, .9, k) + uSunCol * (key * (.10 + .30 * line * seg) + 2.6 * spark);
  gl_FragColor = vec4(max(colr, vec3(0.)), min(a, .5));
  #include <fog_fragment>
}`,zi=`
uniform float uRad;
varying vec3 vD;
void main() { vD = position; gl_Position = projectionMatrix * viewMatrix * vec4(position * uRad + cameraPosition, 1.); }`,Si=`
uniform vec3 uBrkDir, uBrkCol;
uniform vec4 uBrk;        // unused, strength of the tear, time, unused
varying vec3 vD;
float hash21(vec2 p) { p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y);
}
void main() {
  vec3 d = normalize(vD + vec3(0., 1e-5, 0.));
  vec3 hd = normalize(vec3(-uBrkDir.z, 0., uBrkDir.x)), vd = cross(hd, uBrkDir);
  vec3 dd = d - uBrkDir;
  float dh = dot(dd, hd), dv = dot(dd, vd);
  float rag = vnoise(vec2(dh, dv) * 14. + 2.) * .6 + vnoise(vec2(dh, dv) * 37. + vec2(uBrk.z * .01, 0.)) * .4;
  float shape = exp(-dh * dh / .05 - dv * dv / .006);
  float tear = smoothstep(.30, .62, shape * (.55 + .9 * rag)) * step(0., dot(d, uBrkDir));
  float halo = exp(-dh * dh / .16 - dv * dv / .03) * step(0., dot(d, uBrkDir));
  gl_FragColor = vec4(max(uBrkCol * (uBrk.y * (tear + .22 * halo)), vec3(0.)), 1.);
}`,Ai=`
uniform float uRad;
varying vec3 vD;
void main() { vD = position; gl_Position = projectionMatrix * viewMatrix * vec4(position * uRad + cameraPosition, 1.); }`,Ci=`
uniform vec3 uCur, uGold, uSlate, uDark, uAxis;
uniform vec4 uAft;        // unused, shreds, curtain, time
varying vec3 vD;
float hash21(vec2 p) { p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y);
}
float shredBody(vec2 q) { return vnoise(q) * .58 + vnoise(q * 2.1 + 7.) * .26; }
void main() {
  vec3 d = normalize(vD + vec3(0., 1e-5, 0.));
  float el = d.y, t = uAft.w;
  if (el < -.05 || uAft.y + uAft.z < .004) discard;
  vec2 hz = d.xz / max(length(d.xz), 1e-3);
  float ang = atan(hz.x * uCur.z - hz.y * uCur.x, dot(hz, uCur.xz) + 1e-5);        // bearing from the middle of the curtain
  // the curtain: a dark body hung from the cloud base, combed into leaning streaks; its feet are ragged virga that stop short of
  // the ground, so the lit basin shows pale under it
  float inC = 1. - smoothstep(.46, .86, abs(ang) + (vnoise(vec2(ang * 2.3 + 5., 1.5)) - .5) * .3);
  float sx = ang * 46. + el * 20.;
  float streak = vnoise(vec2(sx, el * 3. + t * .05)) * .6 + vnoise(vec2(sx * 2.9, el * 7. + t * .11)) * .4;
  float foot = -.012 + .06 * vnoise(vec2(ang * 9., 3.)) + .05 * streak;
  float topE = .42 + .16 * vnoise(vec2(ang * 3.1, 7.));
  float bodyC = inC * smoothstep(foot, foot + .06, el) * (1. - smoothstep(topE * .5, topE, el));
  float aC = bodyC * (.62 + .38 * smoothstep(.25, .7, streak)) * .88 * uAft.z;
  vec3 curC = uDark * (1. + .55 * smoothstep(.55, .85, streak));
  // the shreds: torn scud under the cloud base, small and soft, drifting. Laid out by bearing and height, not on a level sheet seen
  // in perspective (that drew every shred out ten to one toward the horizon and fanned them all from one point): a shred is a few
  // degrees across wherever it hangs. Its body is two broad octaves, so it is a soft mass and never a curl; two finer ones only fray
  // its edge. It is shaded across its whole body, gold on the side turned to the low sun and grey on the far side and beneath:
  // never a bright outline round a body the colour of the sky behind it
  vec2 q = vec2(ang * 5.4 + t * .010, el * 13.);
  q += (vec2(vnoise(q * .8 + 11.), vnoise(q * .8 + 37.)) - .5) * .5;
  vec2 sh2 = -uAxis.xz / max(length(uAxis.xz), 1e-3);                                // toward the sun, along the ground
  float sunA = sin(atan(sh2.x * uCur.z - sh2.y * uCur.x, dot(sh2, uCur.xz) + 1e-5) - ang);
  vec2 toS = vec2(sunA, .5) / max(length(vec2(sunA, .5)), 1e-3);                     // the low sun lights a shred from its sunward side and a little from above
  float clump = (vnoise(vec2(ang * 1.7 + 3., el * 3.1)) - .5) * .24;
  float body = shredBody(q), bodyS = shredBody(q + toS * .40);
  float n = body + vnoise(q * 4.9 + 3.) * .11 + vnoise(q * 10.3 + 1.) * .05 + clump;
  float mask = smoothstep(.035, .10, el) * (1. - smoothstep(.30, .56, el)) * smoothstep(-.6, .3, dot(hz, uCur.xz));
  float dens = smoothstep(.60, .86, n);
  float aS = dens * mask * uAft.y * .80;
  float lit = smoothstep(.30, .80, clamp((body - bodyS) * 2.4 + .46, 0., 1.));
  vec3 shred = mix(uSlate * (1.02 + .22 * dens), uGold * vec3(1.04, .86, .60) * .50, lit);
  vec3 rgb = shred * aS + curC * (aC * (1. - aS));
  gl_FragColor = vec4(max(rgb, vec3(0.)), clamp(aS + aC * (1. - aS), 0., 1.));
}`,Fi=`
uniform vec4 uHalo;       // centre xyz, half size
varying vec2 vUv;
void main() {
  vUv = position.xy;
  vec4 mv = viewMatrix * vec4(uHalo.xyz, 1.);
  mv.xy += position.xy * uHalo.w;
  gl_Position = projectionMatrix * mv;
}`,Bi=`
uniform vec4 uHaloK;      // strength, size in ring radii, time, how far below the centre the floor lies (in ring radii)
uniform vec3 uHaloCol;
varying vec2 vUv;
float hash21(vec2 p) { p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y);
}
void main() {
  float r = length(vUv) * uHaloK.y;
  if (r < 1.02 || r > uHaloK.y) discard;
  vec2 dir = vUv / max(length(vUv), 1e-4);
  float x = r - 1.;
  float glow = exp(-x * 2.1) * .50 + exp(-x * .62) * .15;
  float rn = vnoise(dir * 2.1 + vec2(uHaloK.z * .07, 7.));
  glow *= .86 + .28 * rn;                                    // the wet air is not even: the glow breathes, it has no rays
  float fade = (1. - smoothstep(uHaloK.y * .72, uHaloK.y, r)) * smoothstep(1.02, 1.12, r);
  float below = mix(.35, 1., smoothstep(-uHaloK.w - .25, -uHaloK.w + .05, vUv.y * uHaloK.y));      // under the floor line only its sheen on the wet clay
  gl_FragColor = vec4(max(uHaloCol * (glow * fade * below * uHaloK.x), vec3(0.)), 1.);
}`,Pi={evening:{elev:16,fog:"#b7bdb9",fogStorm:"#6d7880",dens:58e-5,sky:{preset:"goldenHour",zenith:"#2c5f86",mid:"#6fa2aa",horizon:"#dfd3b8",ground:"#8f8672",scatterColor:"#ffcf96",scatter:.55,sunColor:"#ffd9a0",sunIntensity:11,clouds:{coverage:.4,softness:.26,lit:"#f6e8cf",shade:"#566a86",wind:[.034,.011],detail:.8},clouds2:{opacity:.25}},storm:{zenith:"#232d38",mid:"#36434e",horizon:"#8f918a",scatterColor:"#e9bf80",scatter:.9},exposure:1},golden:{elev:8,fog:"#c9b4a2",fogStorm:"#6e6c82",dens:54e-5,sky:{preset:"sunset",zenith:"#24406e",mid:"#7a7fa6",horizon:"#f0b888",ground:"#7d6a66",scatterColor:"#ff9a4a",scatter:.8,sunColor:"#ffb468",sunIntensity:11,clouds:{coverage:.42,softness:.26,lit:"#ffc890",shade:"#5a5488",wind:[.03,.01]},clouds2:{stretch:.2,softness:.62,detail:.05,scale:.34,opacity:.2,coverage:.42,silver:.2,absorb:.3,lit:"#e9b79c",shade:"#7c6690"}},storm:{zenith:"#1c1d36",mid:"#35345a",horizon:"#a8848a",horizonPow:6,scatterColor:"#ff9248",scatter:1.1},exposure:1.02},day:{elev:35,fog:"#bcc8cc",fogStorm:"#7a858c",dens:5e-4,sky:{preset:"day",zenith:"#2b68a8",mid:"#74a8cc",horizon:"#d3dcd6",sunColor:"#fff2da",clouds:{coverage:.36,softness:.22,scale:1.5,lit:"#f8f4ea",shade:"#6f82a0",wind:[.045,.014],detail:.9},clouds2:{opacity:.2}},storm:{zenith:"#2a343e",mid:"#44525c",horizon:"#8d979a",scatterColor:"#e8e2cc",scatter:.6},exposure:.95},dawn:{elev:9,fog:"#c9b4b4",fogStorm:"#c9b4b4",dens:9e-4,sky:{preset:"dawn",sunColor:"#ffb9a0",clouds:{coverage:.34,softness:.3,wind:[.018,.006]}},storm:null,exposure:1},night:{elev:30,fog:"#2a3a5c",fogStorm:"#1c2840",dens:6e-4,sky:{preset:"night",clouds:{coverage:.38,softness:.3,lit:"#9fb2e0",shade:"#22305a",wind:[.03,.01]}},storm:{zenith:"#0e1626",mid:"#18243a",horizon:"#2e4060",scatterColor:"#8ea4d8",scatter:.6},exposure:1.32}};var Wi={id:"painted-ridges",name:"The Painted Ridges",category:"wilderness",weirdness:.1,media:["open"],async build(s){const{rng:k,noise:f}=s,g=s.quality?.detail??1,S=s.vary||{hour:"any",rare:!1,density:1,mood:.5},v=new n.Scene,U=k.fork("look"),E=U(),V=U(),_=U();let y="evening",P=!1,h=!1;S.hour==="dawn"||S.hour==="night"||S.hour==="golden"?y=S.hour:S.hour==="day"?(y="day",h=!0):E<.26||E>=.44&&E<.6?y="evening":E<.44?y="golden":E<.8?(y="day",h=!0):(y="evening",P=!0);const F=V<.3?"bachelors":V>=.6&&V<.85?"khulan":"none",O=_>.7,Y=Pi[y],at=Y.elev*Math.PI/180,ft=y==="dawn"?-1:1,Q=new n.Vector3(-Math.sin(1.222)*Math.cos(at)*ft,Math.sin(at),Math.cos(1.222)*Math.cos(at)).normalize(),J=135,A=await ai(s,{palette:ni,hour:y,weather:P?"snow":"shower",sunDir:Q,ringT:J});v.add(A.object);const T=A.uniforms;T.uLand.value.x=h?1:0,T.uLand.value.y=1,await s.yield();const rt=A.anchors,I=rt.portalSeat.position,vt=rt.gap.axis,Mt=t=>[I.x+vt.x*t,I.z+vt.z*t],Lt=(t,e)=>[I.x+vt.x*t+vt.z*e,I.z+vt.z*t-vt.x*e],ee=Mt(255),Kt=k.range(4,7.5),j=k.range(3.5,6.5),H=Math.PI/180,D=Math.atan2(-vt.x,vt.z),st=(t,e,o)=>[t[0]-Math.sin(o)*e,t[1]+Math.cos(o)*e],wt=Lt(436+Kt,-64-j+5),G=st(wt,55,D+37*H),X=st(G,55,D+43*H),$=st(X,60,D+10*H),tt=D-22*H,kt=st($,36,tt+7*H),St=st(kt,36,tt),ae=st(St,42,tt+12*H),lt=st(ae,46,tt+25*H),Pt=st(lt,44,tt+14*H),Fe=tt-8*H,pe=st(Pt,56,Fe+3*H),Je=[st(pe,66,Fe),pe,Pt,lt,ae,St,kt,$,X,G,wt,Lt(348,-17),Lt(304,-3),ee,Mt(210),Mt(172),Mt(J)],ma=Y0(Je.map(t=>[t[0],0,t[1]]));await s.yield();const Yt=ma.length,dt=Yt-(250-J),vs=ma.nearestXZ(St[0],St[1]).u*Yt,zt=vs-4,Tt=zt-146,Oa=dt-150,Se=.47*Yt,ps=(t,e,o)=>{const a=Ct((o-t)/(e-t),0,1);return .35*a+.65*a*a*(3-2*a)},ms=t=>.35+(39.6-5*i(zt+80,Oa,t)+1.5*Math.sin((t-zt)/48)*i(zt,zt+30,t)*(1-i(Oa-30,Oa,t))-6*Ot(t,Se-80,Se-20,Se+10,Se+74))*i(Tt,zt,t)*(1-ps(Oa,dt,t)),Cn=[],Oe=new n.Vector3,ga=new n.Vector3,Fn=Math.ceil(Yt/12);for(let t=0;t<=Fn;t++){const e=t/Fn*Yt;ma.posAtDist(e,Oe),Cn.push([Oe.x,ms(e)+zo,Oe.z])}await s.yield();const Ue=Y0(Cn),Ft=Ue.length;await s.yield();const oe=1.5,Be=-81,ut=Math.ceil((Ft+141)/oe)+1,Bt=54,Wt=new Float32Array(ut),ne=new Float32Array(ut),qt=new Float32Array(ut),It=new Float32Array(ut),jt=new Float32Array(ut),pt=new Float32Array(ut);for(let t=0;t<ut;t++){const e=Be+t*oe;Ue.posAtDist(e,Oe),Ue.tangentAtDist(e,ga);const o=Math.hypot(ga.x,ga.z)||1;Wt[t]=Oe.x,ne[t]=Oe.y-zo,qt[t]=Oe.z,It[t]=ga.x/o,jt[t]=ga.z/o,(t&7)===7&&await s.yield()}pt[Bt]=0;for(let t=Bt+1;t<ut;t++)pt[t]=pt[t-1]+Math.hypot(Wt[t]-Wt[t-1],qt[t]-qt[t-1]);for(let t=Bt-1;t>=0;t--)pt[t]=pt[t+1]-Math.hypot(Wt[t]-Wt[t+1],qt[t]-qt[t+1]);const gs=t=>x(x(x(14,8.4,i(Tt+10,Tt+62,t)),3.7,i(zt-58,zt-12,t)),9,i(dt-70,dt-10,t)),Ut=new Float32Array(ut),At=new Float32Array(ut);for(let t=0;t<ut;t++){const e=pt[t],o=gs(e),a=Be+t*oe;Ut[t]=o+Math.max(5.2*Ot(e,Se-150,Se-105,Se+60,Se+94)*(1-i(dt-70,dt-10,e)),7.5*Ot(a,.25*Ft-14,.25*Ft-2,.25*Ft+14,.25*Ft+26)),At[t]=o+4.6*Ot(e,Se-14,Se+8,dt-60,dt-15)}const Xt=t=>Ct((t-Be)/oe,0,ut-1.001),Bn=k.range(0,500),Pn=k.range(0,500),ws=k.range(17,23);let Co=0,Fo=0;const _n=(t,e)=>{Co=1.3+1.5*f.fbm2(t/190+Bn,e/190,2);const o=e+70*f.n2(t/520+Pn,e/760),a=o/210,r=Math.floor(a),l=a-r,m=Math.max(0,f.n2(t/360+r*3.71,r*1.37+Bn)*1.3+.4)*26*(1+2.4*i(900,2300,Math.hypot(t-150,e-450))),B=l<.6?Math.pow(i(0,.6,l),1.2):l<.78?1-i(.6,.78,l):0,b=1-Math.min(1,Math.abs(f.n2(t/26+Pn,o/240))*2.3);Fo=m*B*(1-.28*b*Math.sqrt(b))},Ia=A.strata.texture.image.data,Qt=A.strata.texture.image.width,Ln=A.strata.nBed,ta=new n.Vector3(.5,.42,-.76).normalize(),Bo=3.1;T.uLandBed.value.copy(ta);const ja=(t,e,o,a)=>{let r=((t.x*e+t.y*o+t.z*a)*Bo-A.strata.b0)/A.strata.span*Qt;r-=Math.floor(r/Qt)*Qt;const l=r|0;return(Ia[l*4+3]*2+Ia[(l+1)%Qt*4+3]+Ia[(l+Qt-1)%Qt*4+3])/1020},Rn=(t,e,o)=>{const a=1-i(-90,-10,Math.min(t+520,520-t,o+170,350-o));return a>=1?ja(ta,t,e,o):a<=0?ja(Ln,t,e,o):x(ja(Ln,t,e,o),ja(ta,t,e,o),a)};T.uLand.value.w=Bo;const Po=new Float32Array(Qt);for(let t=0;t<Qt;t++){let e=0;for(let o=-5;o<=5;o++)e+=Ia[(t+o+Qt)%Qt*4+3]*(6-Math.abs(o));Po[t]=e/9180}const ys=(t,e,o)=>{let a=((ta.x*t+ta.y*e+ta.z*o)*Bo*1.9+91-A.strata.b0)/A.strata.span*Qt;a-=Math.floor(a/Qt)*Qt;const r=Math.min(Qt-1,a|0);return x(Po[r],Po[(r+1)%Qt],a-r)},Tn=(t,e)=>{if(t<=e[0][0])return e[0][1];for(let o=1;o<e.length;o++)if(t<e[o][0])return x(e[o-1][1],e[o][1],i(e[o-1][0],e[o][0],t));return e[e.length-1][1]},Wn=[[-70,34],[30,45],[96,53],[170,61],[zt-42,63],[zt+4,47],[zt+30,40]],wa=t=>1-i(zt+2,zt+30,t),_o=t=>Ot(t,64,84,104,124),ea=(t,e)=>Math.min(x(15.5,12.6,_o(t)),e+2.6),Lo=17,Xa=[0,0],qn=Q.x*It[Math.min(ut-1,100)]+Q.z*jt[Math.min(ut-1,100)]>=0?1:-1,Un=(t,e,o)=>{const a=i(.02,.15,o)*(1-.5*i(.84,1,o)),r=(t+.15*e+4*f.n2(t/55,3.3)+2*f.n2(e/16,t/90+5))/Lo,l=Math.floor(r),m=(r-l-.5)*Lo,B=Math.abs(m);let b=Math.sin(l*127.1+3.7)*43758.5453;b-=Math.floor(b);let d=Math.sin(l*269.5+1.3)*43758.5453;d-=Math.floor(d);const L=d>.3?1:.5,u=1-i(.7+.5*b,3.6+1.2*b,B),M=i(-1.2,.3,m*qn)*(1-i(2.4+1*b,4.6+1.2*b,m*qn)),c=r+.5,p=Math.abs(c-Math.floor(c)-.5)*Lo,w=(1-i(.3,2,p))*i(.3,.6,o)*(1-.5*i(.85,1,o));Xa[0]=Math.max(u,.85*M)*a*(.5+.5*L),Xa[1]=(5+2.6*b)*L*a*u+1.2*w},Dn=(t,e,o,a)=>{const r=wa(t),l=o-ea(t,a);if(r<=0||l<=0)return 0;const m=Tn(t,Wn)*(1+.07*f.n2(t/70,7.7))+2.4*Math.abs(f.n2(t/11,3.1)),B=Math.max(5,m-e),b=l*(.88+.32*_o(t))/B;return b>=1?0:(Un(t,l,b),r*Xa[0])},Ro=!!S.rare,ya=t=>Ro?i(.5*Ft,.56*Ft,t)*(1-i(.775*Ft,.82*Ft,t)):0,To=(t,e,o,a,r,l,m)=>{const B=o>0,b=Math.abs(o),d=b-(B?m:l),L=B?wa(t):0;let u,M=0;if(d<=0)u=e+.07*f.n2(a/5,r/5)*Math.min(1,b/3)+(Rn(a,e,r)-.5)*.38*i(1.7,3.6,b)*i(Tt+10,Tt+60,t)*(1-i(dt-90,dt-40,t));else{let N;d<7?N=6*i(0,7,d):d<16?N=6+.06*(d-7):d<24?N=6.54+.9*(d-16):d<34?N=13.74+.05*(d-24):N=14.24+.8*(d-34);const it=1-Math.min(1,Math.abs(f.n2(t/ws+(B?40:0),d/170))*2.3),ct=1.1*i(.5,3,d)*(1-i(5,7,d))+2*i(16.5,19,d)*(1-i(21.5,24,d))+6*i(34,56,d);if(u=e-N-ct*it*Math.sqrt(it)+.12*f.n2(a/6,r/6),M=B?0:ya(t),M>0){const Z=d+1.7*Math.sin(t*.071)+1*Math.sin(t*.19+2),nt=d<6?6.4*i(0,6,d):Z<30?6.4+.02*(d-6):Z<33?6.88-2*i(30,33,Z):4.88+1.1*(Z-33),bt=e-Math.min(nt,N+(Z>33?0:99))+.05*f.n2(a/6,r/6);u=x(u,Z>33?Math.max(u,bt):bt,M)}L>0&&(u=x(u,e+.1*f.n2(a/6,r/6),L))}_n(a,r);const c=1-i(Tt-10,Tt+75,t);let p=.3+.22*f.n2(a/37,r/37);const w=b-14;if(w>0&&c>0){const N=B?(16.5+5*f.n2(t/90+9,3.3))*(1-.42*i(10,80,t))*(1-L):(6.5+2.5*f.n2(t/90,3.3))*(1-.45*i(10,80,t)),it=1-Math.min(1,Math.abs(f.n2(t/13+(B?70:0),w/90))*1.7);p+=c*N*i(0,22,w)*(1-.5*it*i(0,6,w)*(1-i(15,24,w)))}let z=Math.max(p,u);const C=Math.max(w>0?c*i(1,5,w)*1.5*(1-L):0,d>0&&u>p?1.2*(i(1.5,4,d)*(1-i(4.5,6.5,d))+i(17,19,d)*(1-i(22,24,d))+i(35,40,d)):0);C>0&&(z+=(Rn(a,z,r)-.5)*C*(1-M*(1-i(33,38,d))));let R=x(z,Co+Fo*i(75,165,b),i(60,130,b));if(L>0){const N=b-ea(t,m);if(N>0){const it=Tn(t,Wn)*(1+.07*f.n2(t/70,7.7))+2.4*Math.abs(f.n2(t/11,3.1)),ct=Math.max(5,it-e),Z=ct/(.88+.32*_o(t)),nt=N/Z;let bt;nt<1?(Un(t,N,nt),bt=e+ct*Math.pow(nt,.82)-Xa[1]+.9*f.n2(t/23,N/19+3)*i(.05,.3,nt),bt+=2.3*Math.sin(t/9.5+1.6*f.n2(t/70,5.1)+N/30)*i(.08,.36,nt)*(1-i(.78,1,nt)),bt+=(ys(a,bt,r)-.5)*1.7*i(.03,.18,nt)*(1-i(.92,1,nt))):bt=x(e+ct,R,i(0,80,(nt-1)*Z)),R=Math.max(R,x(R,bt,L))}}return R},Wo=-520,$a=520,qo=-170,Uo=350,Do=(t,e,o,a,r,l,m)=>{const B=Math.min(e-Wo,$a-e,o-qo,Uo-o);if(B<=0)return t;const b=(1-i(62,96,r))*(1-i(dt-25,dt+5,a));let d;const L=m?0:1-i(0,.5,b),u=A.heightAt(e,o);if(L>=1&&B>60&&u>16)return-10;const M=x(Math.max(i(38,56,B),i(2,8,u-t)),i(5.5,11,u),L);let c=u;M>0&&(m||r<80||L>0)&&(c=Math.min(u,A.heightAt(e-5,o),A.heightAt(e+5,o),A.heightAt(e,o-5),A.heightAt(e,o+5))-1.5);const p=t-60*i(0,40,B)*(1-(m?1-i(45,70,r):b)),w=L>0?x(p,t-60*i(4,74,B+20*f.n2(e/85+3.3,o/85)),L):p;if(d=Math.max(x(u+.5+.1*L,c-4.5,M),w),m&&u<1.5&&(d=Math.max(d,u+.5)),m){const z=i(dt-25,dt+5,a);z>0&&(d=x(d,r<17.6?l:x(l,Math.min(d,l-2.5),i(17.6,20.5,r)),z))}return d};let aa=0,Ie=0;const Nn=(t,e)=>{let o=1e18,a=0;for(let d=0;d<ut;d+=3){const L=Wt[d]-t,u=qt[d]-e,M=L*L+u*u;M<o&&(o=M,a=d)}const r=Math.max(0,a-2),l=Math.min(ut-1,a+2);for(let d=r;d<=l;d++){const L=Wt[d]-t,u=qt[d]-e,M=L*L+u*u;M<o&&(o=M,a=d)}const m=t-Wt[a],B=e-qt[a],b=m*It[a]+B*jt[a];return aa=Ct(a+b/oe,0,ut-1.001),Ie=-m*jt[a]+B*It[a],a===0&&b<0||a===ut-1&&b>0?Math.sqrt(o):Math.abs(Ie)};let En=1e9;const No=(t,e)=>{const o=Nn(t,e);if(En=o,o>190)return _n(t,e),Do(Co+Fo,t,e,1e9,1e9,0,!1);const a=aa|0,r=aa-a,l=Math.abs(Ie)<1e-6?1:Math.sign(Ie),m=x(pt[a],pt[a+1],r),B=x(ne[a],ne[a+1],r);return Do(To(m,B,o*l,t,e,x(Ut[a],Ut[a+1],r),x(At[a],At[a+1],r)),t,e,m,o,B,!1)},Pe=[1.3,3,5.2,6.6,8.2,10,12,14.5,16,17.5,19.2,21,23,25,27.5,30,33,36.5,40],Eo=Pe.length,_t=Eo*2+1,Hn=[...Pe.slice().reverse().map(t=>-t),0,...Pe],me=new Float32Array(ut*_t);for(let t=0;t<ut;t++){for(let e=0;e<_t;e++){const o=Hn[e],a=Wt[t]-jt[t]*o,r=qt[t]+It[t]*o;me[t*_t+e]=Do(To(pt[t],ne[t],o,a,r,Ut[t],At[t]),a,r,pt[t],Math.abs(o),ne[t],!0)}await s.yield()}const Gn=t=>{const e=Math.abs(t);let o;if(e<=Pe[0])o=e/Pe[0];else{let a=1;for(;a<Eo-1&&e>Pe[a];)a++;o=a+Math.min(1,(e-Pe[a-1])/(Pe[a]-Pe[a-1]))}return Ct(Eo+(t<0?-o:o),0,_t-1.001)},le=(t,e)=>{const o=Xt(t),a=o|0,r=o-a,l=Gn(e),m=l|0,B=l-m,b=a*_t+m,d=me[b]+(me[b+1]-me[b])*B,L=me[b+_t]+(me[b+_t+1]-me[b+_t])*B;return d+(L-d)*r},ge=(t,e,o)=>{const a=Xt(t),r=a|0,l=a-r,m=x(It[r],It[r+1],l),B=x(jt[r],jt[r+1],l);return o.x=x(Wt[r],Wt[r+1],l)-B*e,o.z=x(qt[r],qt[r+1],l)+m*e,o.tx=m,o.tz=B,o};let ba=1e9,Za=-1e9,xa=1e9,Ya=-1e9;for(let t=0;t<ut;t++)ba=Math.min(ba,Wt[t]),Za=Math.max(Za,Wt[t]),xa=Math.min(xa,qt[t]),Ya=Math.max(Ya,qt[t]);const Ae=4,Qa=ba-150,Ja=xa-110,xt=Math.ceil((Za-ba+300)/Ae)+1,we=Math.ceil((Ya-xa+240)/Ae)+1,ce=new Float32Array(xt*we),Ho=new Float32Array(xt*we),oa=new Float32Array(xt*we),to=new Float32Array(xt*we);for(let t=0;t<we;t++){const e=Ja+t*Ae;for(let o=0;o<xt;o++)ce[t*xt+o]=No(Qa+o*Ae,e),Ho[t*xt+o]=En;(t&0)===0&&await s.yield()}const bs=(t,e)=>t>=Qa&&e>=Ja&&t<=Qa+(xt-1)*Ae&&e<=Ja+(we-1)*Ae,ye=(t,e,o)=>{const a=Ct((e-Qa)/Ae,0,xt-1.001),r=Ct((o-Ja)/Ae,0,we-1.001),l=a|0,m=r|0,B=a-l,b=r-m,d=m*xt+l,L=t[d]+(t[d+1]-t[d])*B,u=t[d+xt]+(t[d+xt+1]-t[d+xt])*B;return L+(u-L)*b};{const t=Math.max(.001,Math.hypot(Q.x,Q.z)),e=Q.x/t/Ae,o=Q.z/t/Ae,a=Math.max(Q.y/t,.2126);for(let l=0;l<we;l++){for(let m=0;m<xt;m++){const B=ce[l*xt+m]+.6;let b=1,d=5;for(let L=0;L<14;L++){const u=B+d*a;if(u>80)break;const M=Math.round(m+e*d),c=Math.round(l+o*d);if(M<0||c<0||M>=xt||c>=we)break;const p=5*(u-ce[c*xt+M])/d+.25;if(p<b&&(b=p,b<=0)){b=0;break}d*=1.32}oa[l*xt+m]=b}(l&1)===1&&await s.yield()}const r=3;for(let l=0;l<we;l++){const m=Math.max(0,l-r),B=Math.min(we-1,l+r);for(let b=0;b<xt;b++){const d=Math.max(0,b-r),L=Math.min(xt-1,b+r),u=(ce[m*xt+d]+ce[m*xt+L]+ce[B*xt+d]+ce[B*xt+L]+ce[l*xt+d]+ce[l*xt+L]+ce[m*xt+b]+ce[B*xt+b])/8;to[l*xt+b]=Ct(.88+(ce[l*xt+b]-u)*.07,.45,1)}(l&15)===15&&await s.yield()}}const Go=t=>new n.ShaderMaterial({uniforms:{...n.UniformsUtils.clone(n.UniformsLib.fog),...T},vertexShader:oi,fragmentShader:es,defines:t,fog:!0}),Kn=Go({LAND:1}),Ko=Go({LAND:1,STRIP:1});Kn.side=Ko.side=n.DoubleSide;{const t=ut*_t,e=new Float32Array(t*3),o=new Float32Array(t*3),a=new Float32Array(t*2),r=new Float32Array(t*2);for(let u=0;u<ut;u++){(u&31)===31&&await s.yield();for(let M=0;M<_t;M++){const c=Hn[M],p=u*_t+M,w=Wt[u]-jt[u]*c,z=qt[u]+It[u]*c;if(e[p*3]=w,e[p*3+1]=me[p]-.9*i(34,40,Math.abs(c)),e[p*3+2]=z,c>6){const C=wa(pt[u]),R=ea(pt[u],At[u]);C>.3&&(e[p*3+1]-=3*i(R+.1,R+1.3,c)*i(.3,.6,C))}if(a[p*2]=ye(to,w,z),a[p*2+1]=ye(oa,w,z)*(1-i(dt-5,dt+35,pt[u])),c>12&&pt[u]<zt+30){const C=Dn(pt[u],ne[u],c,At[u]);a[p*2]*=1-.5*C,a[p*2+1]*=1-.6*C}r[p*2]=Be+u*oe,r[p*2+1]=c}}await s.yield();for(let u=0;u<ut;u++){(u&31)===31&&await s.yield();for(let M=0;M<_t;M++){const c=u*_t+M,p=(u>0?c-_t:c)*3,w=(u<ut-1?c+_t:c)*3,z=(M>0?c-1:c)*3,C=(M<_t-1?c+1:c)*3,R=e[w]-e[p],N=e[w+1]-e[p+1],it=e[w+2]-e[p+2],ct=e[C]-e[z],Z=e[C+1]-e[z+1],nt=e[C+2]-e[z+2];let bt=N*nt-it*Z,Gt=it*ct-R*nt,Vt=R*Z-N*ct;Gt<0&&(bt=-bt,Gt=-Gt,Vt=-Vt);const Dt=Math.hypot(bt,Gt,Vt)||1;o[c*3]=bt/Dt,o[c*3+1]=Gt/Dt,o[c*3+2]=Vt/Dt}}await s.yield();const l=new n.BufferAttribute(e,3),m=new n.BufferAttribute(o,3),B=new n.BufferAttribute(a,2),b=new n.BufferAttribute(r,2),d=5,L=Math.ceil((ut-1)/d);for(let u=0;u<d;u++){const M=u*L,c=Math.min(ut-1,M+L),p=new Uint32Array((c-M)*(_t-1)*6);let w=0;for(let N=M;N<c;N++)for(let it=0;it<_t-1;it++){const ct=N*_t+it,Z=ct+1,nt=ct+_t,bt=nt+1;p[w++]=ct,p[w++]=nt,p[w++]=Z,p[w++]=Z,p[w++]=nt,p[w++]=bt}const z=new n.BufferGeometry;z.setAttribute("position",l),z.setAttribute("normal",m),z.setAttribute("aBake",B),z.setAttribute("aSL",b),z.setIndex(new n.BufferAttribute(p,1));const C=M+c>>1;z.boundingSphere=new n.Sphere(new n.Vector3(Wt[C],ne[C]-5,qt[C]),(c-M)*oe*.5+62);const R=new n.Mesh(z,Ko);R.name="strip"+u,v.add(R),await s.yield()}}await s.yield();const Ma=Math.min(ut-2,Math.ceil(Xt(zt+52))),Vn=146,On=Go({LAND:1,WING:1});On.side=n.DoubleSide;let In=null,jn=0,Xn=0;{const t=[-.9,0,.8,1.7,2.7,3.8,5,6.3,7.7,9.2,10.8,12.5,14.3,16.2,18.2];for(;t[t.length-1]<71.5;)t.push(t[t.length-1]+2.1);const e=t.length,o=[.1,.22,.37,.55,.76,1],a=e+o.length,r=Ma+1,l=new Float32Array(r*a*3),m=new Float32Array(r*a*3),B=new Float32Array(r*a*2),b=new Float32Array(r*a*2);for(let c=0;c<r;c++){const p=1-i(Ma-6,Ma,c),w=ea(pt[c],At[c]),z=wa(pt[c]),C=w+t[e-1];for(let R=0;R<a;R++){const N=R<e?w+t[R]:x(C,Vn,o[R-e]),it=c*a+R,ct=Wt[c]-jt[c]*N,Z=qt[c]+It[c]*N;l[it*3]=ct,l[it*3+2]=Z,b[it*2]=pt[c],b[it*2+1]=N-w,l[it*3+1]=To(pt[c],ne[c],N,ct,Z,Ut[c],At[c])-(R===0?.5:R===1?.06:0)-.5*(1-i(.2,.5,z))-3*i(132,Vn,N)-3*(1-p);const nt=Dn(pt[c],ne[c],N,At[c]);B[it*2]=ye(to,ct,Z)*(1-.6*Math.sqrt(nt)),B[it*2+1]=ye(oa,ct,Z)*(1-.95*Math.sqrt(nt))}(c&3)===3&&await s.yield()}for(let c=0;c<r;c++){(c&31)===31&&await s.yield();for(let p=0;p<a;p++){const w=c*a+p,z=(c>0?w-a:w)*3,C=(c<r-1?w+a:w)*3,R=(p>0?w-1:w)*3,N=(p<a-1?w+1:w)*3,it=l[C]-l[z],ct=l[C+1]-l[z+1],Z=l[C+2]-l[z+2],nt=l[N]-l[R],bt=l[N+1]-l[R+1],Gt=l[N+2]-l[R+2];let Vt=ct*Gt-Z*bt,Dt=Z*nt-it*Gt,Zt=it*bt-ct*nt;Dt<0&&(Vt=-Vt,Dt=-Dt,Zt=-Zt);const ua=Math.hypot(Vt,Dt,Zt)||1;m[w*3]=Vt/ua,m[w*3+1]=Dt/ua,m[w*3+2]=Zt/ua}}await s.yield();const d=new Uint32Array((r-1)*(a-1)*6);let L=0;for(let c=0;c<r-1;c++)for(let p=0;p<a-1;p++){const w=c*a+p,z=w+1,C=w+a,R=C+1;d[L++]=w,d[L++]=C,d[L++]=z,d[L++]=z,d[L++]=C,d[L++]=R}await s.yield();const u=new n.BufferGeometry;u.setAttribute("position",new n.BufferAttribute(l,3)),u.setAttribute("normal",new n.BufferAttribute(m,3)),u.setAttribute("aBake",new n.BufferAttribute(B,2)),u.setAttribute("aWL",new n.BufferAttribute(b,2)),u.setIndex(new n.BufferAttribute(d,1)),u.computeBoundingSphere();const M=new n.Mesh(u,On);M.name="wing",v.add(M),In=u,jn=(a-1)*6,Xn=r-1}await s.yield();const $n=-1.5,Vo=9.5,xs=ne[Bt],Zn=t=>xs-.14-.95*(Vo-t);let ka=null;{const o=[],a=[],r=[],l=[],m=[];for(let b=0;b<23;b++)for(let d=0;d<29;d++){const L=x($n,Vo,b/22),u=x(-21,21,d/28),M=Wt[Bt]+It[Bt]*L-jt[Bt]*u,c=qt[Bt]+jt[Bt]*L+It[Bt]*u;o.push(M,Zn(L),c),a.push(0,1,0),r.push(.95,ye(oa,M,c)),l.push(L*1.4,u)}for(let b=0;b<22;b++)for(let d=0;d<28;d++){const L=b*29+d,u=L+1,M=L+29,c=M+1;m.push(L,M,u,u,M,c)}const B=new n.BufferGeometry;B.setAttribute("position",new n.Float32BufferAttribute(o,3)),B.setAttribute("normal",new n.Float32BufferAttribute(a,3)),B.setAttribute("aBake",new n.Float32BufferAttribute(r,2)),B.setAttribute("aSL",new n.Float32BufferAttribute(l,2)),B.setIndex(m),ka=new n.Mesh(B,Ko),ka.name="entry-apron",ka.frustumCulled=!1,v.add(ka)}await s.yield();{const t=(p,w,z,C)=>{const R=[];for(let nt=p;nt<=w+.01;nt+=6)R.push(nt);const N=[],it=[];let ct=6,Z=p;for(;Z>z;)ct*=1.32,Z=Math.max(z,Z-ct),N.push(Z);for(ct=6,Z=R[R.length-1];Z<C;)ct*=1.32,Z=Math.min(C,Z+ct),it.push(Z);return[...N.reverse(),...R,...it]},e=t(ba-108,Math.max(Za+108,$a+34),-2550,2850),o=t(xa-60,Ya+108,-2250,3150),a=e.length,r=o.length,l=new Float32Array(a*r*3),m=new Float32Array(a*r*3),B=new Float32Array(a*r*2),b=[1,1];for(let p=0;p<r;p++){const w=o[p];for(let z=0;z<a;z++){const C=e[z],R=p*a+z;let N,it=.9,ct=1;if(bs(C,w)){if(N=ye(ce,C,w)-1.4*(1-i(29,37,ye(Ho,C,w))),it=ye(to,C,w),ct=ye(oa,C,w),ye(Ho,C,w)<150&&(Nn(C,w),Ie>10)){const Vt=Math.min(ut-1,aa|0),Dt=ea(pt[Vt],At[Vt]);N-=16*i(Dt+.5,Dt+7,Ie)*(1-i(118,131,Ie))*(1-i(Ma-9,Ma-4,aa))*i(0,2,aa)*i(.3,.6,wa(pt[Vt]))}const Z=C-Wt[Bt],nt=w-qt[Bt],bt=Z*It[Bt]+nt*jt[Bt],Gt=-Z*jt[Bt]+nt*It[Bt];bt>-20&&bt<26&&Math.abs(Gt)<31&&(N-=14*Ot(bt,-20,-8,14,26)*(1-i(23,31,Math.abs(Gt))))}else N=No(C,w);if(C>Wo&&C<$a&&w>qo&&w<Uo){const Z=(1-i(1.2,4.5,N-A.heightAt(C,w)))*i(0,30,Math.min(C-Wo,$a-C,w-qo,Uo-w));Z>0&&(A.bakeAt(C,w,b),ct=Math.min(ct,x(1,b[1],Z)),it=Math.min(it,x(1,Math.max(.6,b[0]+.1),Z)))}l[R*3]=C,l[R*3+1]=N,l[R*3+2]=w,B[R*2]=it,B[R*2+1]=ct}await s.yield()}for(let p=0;p<r;p++){(p&7)===7&&await s.yield();for(let w=0;w<a;w++){const z=p*a+w,C=w>0?z-1:z,R=w<a-1?z+1:z,N=p>0?z-a:z,it=p<r-1?z+a:z,ct=(l[R*3+1]-l[C*3+1])/Math.max(.001,l[R*3]-l[C*3]),Z=(l[it*3+1]-l[N*3+1])/Math.max(.001,l[it*3+2]-l[N*3+2]),nt=Math.hypot(ct,1,Z);m[z*3]=-ct/nt,m[z*3+1]=1/nt,m[z*3+2]=-Z/nt}}await s.yield();const d=new n.BufferAttribute(l,3),L=new n.BufferAttribute(m,3),u=new n.BufferAttribute(B,2),M=1,c=Math.ceil((r-1)/M);for(let p=0;p<M;p++){const w=p*c,z=Math.min(r-1,w+c),C=new Uint32Array((z-w)*(a-1)*6);let R=0;for(let nt=w;nt<z;nt++){(nt&15)===15&&await s.yield();for(let bt=0;bt<a-1;bt++){const Gt=nt*a+bt,Vt=Gt+1,Dt=Gt+a,Zt=Dt+1;C[R++]=Gt,C[R++]=Dt,C[R++]=Vt,C[R++]=Vt,C[R++]=Dt,C[R++]=Zt}}const N=new n.BufferGeometry;N.setAttribute("position",d),N.setAttribute("normal",L),N.setAttribute("aBake",u),N.setIndex(new n.BufferAttribute(C,1));const it=(o[w]+o[z])/2,ct=(o[z]-o[w])/2;N.boundingSphere=new n.Sphere(new n.Vector3(150,20,it),Math.hypot(2750,ct)+100);const Z=new n.Mesh(N,Kn);Z.name="basin"+p,v.add(Z)}}await s.yield();const za={rng:k,...Y.sky};y==="night"?(za.bodyOverrides={0:{direction:Q.clone()}},za.bake=!0,za.renderer=s.renderer):za.sunDirection=Q.clone();const eo=Q0(za);v.add(eo.object),await s.yield();const Sa=y==="golden"?{lit:"#a391b4",shade:"#231e3a"}:y==="night"?{lit:"#5a6a8c",shade:"#18223a"}:{lit:"#979fa2",shade:"#283039"},$t=Y.storm?Q0({rng:k,preset:"storm",lightning:0,sunIntensity:0,sunDirection:Q.clone(),...Y.storm,clouds:{coverage:.8,softness:.4,scale:.75,lit:Sa.lit,shade:Sa.shade,absorb:2,silver:1,wind:[.034,.011],detail:.75}}):null;$t&&($t.setOpacity(0),v.add($t.object)),$t&&($t.material.transparent=!0,$t.materialLow&&($t.materialLow.transparent=!0));const Yn=new n.Color(Y.fog),Ms=new n.Color(Y.fogStorm);v.fog=new n.FogExp2(Yn.clone(),Y.dens),await s.yield();let De=null;if($t){const t=-ft*1,e=[[-900,330,-700,900],[-1500,390,-250,800],[-380,430,-1150,820],[-1250,300,-1350,1e3],[-150,520,-1750,900],[-2e3,420,-900,900]].map(o=>[o[0]*-t,o[1],o[2],o[3]]);De=ti({rng:k,sky:$t,at:e,puffs:Math.round(40*(.6+.4*g)),wind:[7*ft,0,-2.5],opacity:.9}),y==="golden"&&(De.uniforms.uLit.value.set("#f7c79a"),De.uniforms.uShade.value.set("#5a5488"),De.uniforms.uBottom.value.set("#46426a")),De.uniforms.uFogFade.value=.6,v.add(De.object),await s.yield()}const Qn=ei.makeHorizonRidges({rng:k,layers:3,radius:[2700,3900],height:[110,360],segments:200,fog:v.fog,sunDir:Q,sunColor:Y.sky.sunColor||"#ffd9a0",colorNear:y==="night"?"#26304a":"#a48e80",rim:.3});v.add(Qn.object),await s.yield();const Aa=64,Jn=new Uint16Array(Aa*ut);for(let t=0;t<ut;t++)for(let e=0;e<Aa;e++){e===0&&(t&31)===31&&await s.yield();const o=-40+(e+.5)*(80/Aa),a=x(40,9.6,i(dt-85,dt-50,pt[t])),r=Ct(o,-a,a),l=Gn(r),m=l|0;Jn[t*Aa+e]=n.DataUtils.toHalfFloat(me[t*_t+m]+(me[t*_t+m+1]-me[t*_t+m])*(l-m))}const na=new n.DataTexture(Jn,Aa,ut,n.RedFormat,n.HalfFloatType);na.minFilter=na.magFilter=n.LinearFilter,na.wrapS=na.wrapT=n.ClampToEdgeWrapping,na.needsUpdate=!0,await s.yield();const t0=Ct(S.density??1,.7,1.3),ao=Math.round(x(44,70,(t0-.7)/.6)),Ca=F==="khulan"?14:F==="bachelors"?8:0,e0=8,a0=12,_e=ao+Ca+e0,Oo=ao+Ca,Fa=new Float32Array(_e*4),Ba=new Float32Array(_e*4),je=new Float32Array(_e*4),Pa=new Float32Array(_e*4),Le=()=>n.UniformsUtils.clone(n.UniformsLib.fog),Io=(t,e,o={},a={})=>new n.ShaderMaterial({uniforms:{...Le(),...T,uLife:{value:new n.Vector4(...e)},...o},vertexShader:t,fragmentShader:ii,defines:a,fog:!0,side:n.DoubleSide}),jo=Io(si,[y==="night"?1.9:1.3,.7,0,h?1:0],{},{COAT:1}),ks=new n.ShaderMaterial({uniforms:{...Le(),...T,uHT:{value:na},uHTr:{value:new n.Vector4(Be-.5*oe,1/(ut*oe),40,oe)}},vertexShader:ri,fragmentShader:es,defines:{LAND:1,SHADOWPASS:1},fog:!0,side:n.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-1.2,polygonOffsetUnits:-5});await s.yield();const o0=[],_a=(t,e,o,a)=>{const r=new n.InstancedBufferGeometry;r.index=t.index;for(const m in t.attributes)r.setAttribute(m,t.attributes[m]);const l=(m,B)=>{const b=new n.InstancedBufferAttribute(B.subarray(e*4,o*4),4);b.setUsage(n.DynamicDrawUsage),r.setAttribute(m,b),o0.push(b)};return l("iPos",Fa),l("iPose",Ba),l("iAux",je),a&&l("iPath",Pa),r.instanceCount=o-e,r},n0=So(2,"takhi");await s.yield();const s0=So(1,"takhi");await s.yield();const i0=So(0,"takhi");await s.yield();const r0=So(1,"gazelle");await s.yield();const La=(t,e,o,a=0)=>{const r=new n.Mesh(t,e);return r.frustumCulled=!1,r.name=o,r.renderOrder=a,v.add(r),r};La(_a(n0,0,a0),jo,"takhi-near"),La(_a(s0,a0,Oo),jo,"takhi"),La(_a(r0,Oo,_e),jo,"gazelles"),La(_a(i0,0,_e,!0),ks,"shadows",1);const Re=[n0,s0,i0,r0];await s.yield();const l0={...Le(),...T,uSpeed:{value:Ka}};{const t=Math.max(8,Math.round(22*g)),e=[],o=[];for(let l=0;l<t;l++){const m=l*4;e.push(-.5,-.5,l/t,.5,-.5,l/t,.5,.5,l/t,-.5,.5,l/t),o.push(m,m+1,m+2,m,m+2,m+3)}const a=new n.BufferGeometry;a.setAttribute("position",new n.Float32BufferAttribute(new Float32Array(t*12),3)),a.setAttribute("aQ",new n.Float32BufferAttribute(e,3)),a.setIndex(o);const r=La(_a(a,0,_e),new n.ShaderMaterial({uniforms:l0,vertexShader:mi,fragmentShader:yi,fog:!0,transparent:!0,depthWrite:!1}),"dust",5);Re.push(a),r.geometry.deleteAttribute("position"),r.geometry.setAttribute("position",a.attributes.position)}await s.yield();const c0={value:new n.Vector4(0,0,0,0)},h0={value:new n.Vector4(0,0,0,0)},Xe=new n.Mesh(di(k.fork("mount")),Io(ui,[y==="night"?.6:.2,.22,0,0],{uRide:c0,uRide2:h0},{COAT:1,MOUNT:1}));Xe.matrixAutoUpdate=!1,Xe.frustumCulled=!1,Xe.name="mount",v.add(Xe),await s.yield();const zs={value:new n.Vector4(O?.05:.11,O?.16:.012,O?9:2.2,1)},f0={value:new n.Vector4(0,0,0,0)},sa=new n.Mesh(li(O),Io(ci,[.7,.2,0,0],{uWing:zs,uHead:f0}));sa.frustumCulled=!1,sa.name="raptor",v.add(sa),await s.yield();const d0=48,Ss={sunDir:Q.clone(),sunColor:Y.sky.sunColor||"#cfd8ff",sunIntensity:y==="night"?.7:2.2,sky:y==="night"?"#24345c":"#7f9db8",skyIntensity:.9,ground:"#8a7458",groundIntensity:y==="night"?.15:.5},u0=J0.makeFauna(v,{light:Ss});await s.yield(),u0.add(J0.makeFlock({rng:k.fork("cranes"),species:"flamingos",form:"vee",count:36,size:2.3,spacing:1.45,speed:14,body:"#aab1b9",belly:"#bcc2c8",wingC:"#8d96a0",trail:"#2c3036",tip:"#1e2126",beak:"#5a5a48",head:"#26292e",neckC:"#2a2d33",legC:"#2b2b2b",cross:{path:Ue,u:.3,lead:125,height:44,angle:158,side:1,span:520,duration:d0}})),await s.yield();const Xo={value:0},As=k.fork("rain"),$e=P?ts.makeParticles({rng:As,preset:"snow",count:Math.round(3e3*g),time:Xo,opacity:0}):null;$e&&($e.setOpacity(0),v.add($e.object)),await s.yield();const $o={uEye:{value:new n.Vector3},uVeilK:{value:new n.Vector4(0,0,.2,0)}};let ia=null;if(y!=="dawn"&&!P){const t=[[7,5],[16,11],[38,24],[90,50],[210,100]],e=28,o=[],a=[],r=[];t.forEach(([m,B],b)=>{const d=o.length/3;for(let L=0;L<=e;L++){const u=L/e*6.2832,M=Math.cos(u),c=Math.sin(u);for(const p of[-1,1])o.push(M,p,c),a.push(m,B,b/(t.length-1))}for(let L=0;L<e;L++){const u=d+L*2;r.push(u,u+1,u+3,u,u+3,u+2)}});const l=new n.BufferGeometry;l.setAttribute("position",new n.Float32BufferAttribute(o,3)),l.setAttribute("aShell",new n.Float32BufferAttribute(a,3)),l.setIndex(r),ia=new n.Mesh(l,new n.ShaderMaterial({uniforms:{...Le(),...T,...$o},vertexShader:Mi,fragmentShader:ki,fog:!0,transparent:!0,depthWrite:!1,side:n.DoubleSide})),ia.frustumCulled=!1,ia.renderOrder=6,ia.name="rain-veils",v.add(ia)}await s.yield();const Cs=new n.Vector3(-Q.x,-Q.y,-Q.z).normalize(),v0=D-52*H,Zo=23*H,Fs=new n.Vector3(Math.sin(v0)*Math.cos(Zo),Math.sin(Zo),-Math.cos(v0)*Math.cos(Zo)),ra=new n.Color(Y.sky.sunColor||"#cfd8ff").lerp(new n.Color("#ffffff"),.25),Yo=[];if(y!=="dawn"){const t=new n.IcosahedronGeometry(1,1);{const e={uRad:{value:1450},uBrkDir:{value:Fs},uBrkCol:{value:new n.Vector3(ra.r,ra.g,ra.b)},uBrk:{value:new n.Vector4(0,0,0,0)}},o=new n.Mesh(t,new n.ShaderMaterial({uniforms:e,vertexShader:zi,fragmentShader:Si,transparent:!0,depthWrite:!1,blending:n.AdditiveBlending,side:n.BackSide,fog:!1}));o.frustumCulled=!1,o.renderOrder=1,o.name="sunbreak",v.add(o),Yo.push(e)}Re.push(t)}await s.yield();const oo={uRad:{value:1500},uAxis:{value:Cs},uCur:{value:new n.Vector3(A.wet.dir.x,0,A.wet.dir.y-.75).normalize()},uGold:{value:new n.Vector3(ra.r,ra.g,ra.b).multiplyScalar(y==="night"?.5:.86)},uSlate:{value:new n.Vector3},uDark:{value:new n.Vector3},uAft:{value:new n.Vector4(0,0,0,0)}};{const t=new n.Color(Sa.shade).lerp(new n.Color(Sa.lit),.34),e=new n.Color(Sa.shade).multiplyScalar(.5);oo.uSlate.value.set(t.r,t.g,t.b),oo.uDark.value.set(e.r,e.g,e.b);const o=new n.IcosahedronGeometry(1,1),a=new n.ShaderMaterial({uniforms:oo,vertexShader:Ai,fragmentShader:Ci,transparent:!0,depthWrite:!1,depthTest:!0,side:n.BackSide,fog:!1,blending:n.CustomBlending,blendSrc:n.OneFactor,blendDst:n.OneMinusSrcAlphaFactor}),r=new n.Mesh(o,a);r.frustumCulled=!1,r.renderOrder=1,r.name="after-storm",r.visible=!!Y.storm,v.add(r),Re.push(o,a)}await s.yield();const no=7.5,la=new n.Color(y==="night"?"#bcd0ff":"#ffd9a0"),Ne=Ue.end.clone();T.uRing.value.set(Ne.x,Ne.y,Ne.z,0),T.uRingB.value.set(la.r,la.g,la.b,no);const Qo={uHalo:{value:new n.Vector4(Ne.x,Ne.y,Ne.z,no*5.2)},uHaloK:{value:new n.Vector4(0,5.2,0,zo/no)},uHaloCol:{value:new n.Vector3(la.r,la.g,la.b)}};{const t=new n.PlaneGeometry(2,2),e=new n.Mesh(t,new n.ShaderMaterial({uniforms:Qo,vertexShader:Fi,fragmentShader:Bi,transparent:!0,depthWrite:!1,depthTest:!1,blending:n.AdditiveBlending,fog:!1}));e.frustumCulled=!1,e.renderOrder=7,e.name="ring-halo",v.add(e),Re.push(t)}const Ra=y==="dawn"?ts.makeMist({rng:k.fork("mist"),count:60,area:[300,6,420],center:[Wt[Bt+60],3,qt[Bt+60]],size:[22,46],color:"#e9d6d2",opacity:.16,time:Xo}):null;Ra&&v.add(Ra.object),await s.yield();const be=new n.ShaderMaterial({uniforms:{...Le(),...T},vertexShader:fs,fragmentShader:ds,fog:!0,side:n.DoubleSide}),Jo=new n.ShaderMaterial({uniforms:{...Le(),...T},vertexShader:fs,fragmentShader:ds,fog:!0,side:n.DoubleSide,transparent:!0,depthWrite:!0,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-3}),K=k.fork("plants"),Et={x:0,z:0,tx:0,tz:0},Ta=new n.Matrix4,so=new n.Quaternion,io=new n.Euler,ro=new n.Vector3,lo=new n.Vector3,Jt=(t,e)=>{for(let o=0;o<30;o++){const a=K.int(2,ut-3);if(pt[a]>=t&&pt[a]<=e)return a}return-1},p0=[],he=async(t,e,o,a,r,l,m,B=be,b=0,d=null,L=K)=>{const u=[];for(let c=0;c<e;c++){const p=a();if(!p)continue;const w=Be+(p[0]+L())*oe;let z=p[1];if(z>0&&pt[p[0]]<zt+34&&z>ea(pt[p[0]],At[p[0]])-1){if(B!==tn||z>36)continue;z=-z}if(Ro&&z<0){const C=-z-Ut[p[0]];if(C>4&&C<32&&ya(pt[p[0]])>.25)continue}ge(w,z,Et),u.push({s:w,x:Et.x,y:d?d(w):le(w,z),z:Et.z,sz:r(),yaw:L.range(0,6.2832),tx:L.range(-l,l),tz:L.range(-l,l)}),(c&31)===31&&await s.yield()}await s.yield(),u.sort((c,p)=>c.s-p.s),await s.yield();const M=Math.ceil(u.length/o);for(let c=0;c<o;c++){const p=u.slice(c*M,(c+1)*M);if(!p.length)continue;const w=new n.BufferGeometry;w.index=t.index;for(const R in t.attributes)w.setAttribute(R,t.attributes[R]);const z=new Float32Array(p.length),C=new n.InstancedMesh(w,B,p.length);p.forEach((R,N)=>{io.set(R.tx,R.yaw,R.tz),so.setFromEuler(io),ro.setScalar(R.sz),lo.set(R.x,R.y,R.z),C.setMatrixAt(N,Ta.compose(lo,so,ro)),z[N]=ye(oa,R.x,R.z)}),w.setAttribute("iShade",new n.InstancedBufferAttribute(z,1)),C.instanceMatrix.needsUpdate=!0,C.name=m+c,v.add(C),b&&p0.push([C,p[0].s,p[p.length-1].s,b]),(c&0)===0&&await s.yield()}Re.push(t),await s.yield()},Wa=(t,e,o)=>{const a=K.sign();return a*((a>0?At[t]:Ut[t])+K.range(e,o))},ca=Math.min(1,t0)*g,tn=new n.ShaderMaterial({uniforms:{...Le(),...T},vertexShader:vi,fragmentShader:pi,fog:!0,side:n.DoubleSide});await he(ls(),Math.round(8200*ca),9,()=>{const t=K();if(t<.62){const o=Jt(-70,Tt+55);if(o<0)return null;const a=pt[o]>Tt+10?Math.min(Ut[o],At[o]):13.6,r=K.range(-a,a)*(K()<.6?Math.sqrt(K()):1),l=Be+o*oe-(.12*Ft-3);return l>-4&&l<34&&r>4.6&&r<13&&K()<.8?null:[o,r]}if(t<.88){const o=Jt(zt-40,dt-20);return o<0?null:[o,Wa(o,7.2,16)]}const e=Jt(Tt+20,dt-10);return e<0?null:[e,Wa(e,24.5,33.5)]},()=>K.range(.72,1.3),.12,"grass",tn,250),await he(ls(),Math.round(640*ca),1,()=>[Bt-1+K.int(0,6),K.range(-17,17)],()=>K.range(.9,1.5),.1,"apron-grass",tn,250,t=>Zn(Ct(t,$n,Vo))),await he(cs(),Math.round(1500*ca),9,()=>{const t=Jt(Tt+30,dt+10);if(t<0)return null;const e=K.sign();return[t,e*(e>0?At[t]:Ut[t])*Math.pow(K(),.6)*1.08]},()=>K.range(.55,1.15),.1,"cushion",Jo,150),await he(hs(),Math.round(5200*g),14,()=>{const t=Jt(K()<.12?-40:Tt+15,Ft+12);if(t<0)return null;const e=K.sign();return[t,e*Math.min(9.5,(e>0?At[t]:Ut[t])+1.2)*Math.pow(K(),.8)]},()=>.04+.075*Math.pow(K(),2.2),.3,"pebble",be,64),await he(An(K,1),Math.round(1300*g),8,()=>{const t=Jt(Tt+20,dt-50);if(t<0)return null;const e=K.sign();return[t,e*((e>0?At[t]:Ut[t])+1.5)*Math.pow(K(),.7)]},()=>.05+.17*Math.pow(K(),2.2),.25,"scree",be,95),await he(An(K,.6),Math.round(1100*g),4,()=>{const t=Jt(dt-70,Ft+16);return t<0?null:[t,K.sign()*(K()<.6?K.range(7.2,10.9):K.range(.7,7.2))]},()=>.07+.21*Math.pow(K(),2),.3,"gap-scree",be,110);const Bs=()=>K.range(.9,1.9);await he(Sn(K),Math.round(138*ca),6,()=>{const t=K();if(t<.34){const o=Jt(-70,Tt+25);return o<0?null:[o,K.sign()*K.range(11.4,14.2)]}if(t<.62){const o=Jt(zt-30,dt-30);return o<0?null:[o,Wa(o,K()<.5?7.3:14.4,K()<.5?8.4:15.6)]}if(t<.84){const o=Jt(Tt+20,dt-20);return o<0?null:[o,Wa(o,24.5,33)]}const e=Jt(Tt,zt-30);return e<0?null:[e,Wa(e,8,15)]},Bs,.1,"saxaul",be,420),await he(rs(K),Math.round(80*ca),2,()=>{const t=Jt(-75,Tt+40);return t<0?null:[t,K.sign()*K.range(12.6,17.5)]},()=>K.range(1.1,1.6),.08,"tamarisk",be,420),await he(hs(),Math.round(1500*g),6,()=>{const t=Jt(.19*Yt,.37*Yt);return t<0?null:[t,K.sign()*Math.min(9,(Ut[t]+At[t])*.5+1)*Math.pow(K(),.75)]},()=>.045+.085*Math.pow(K(),2.2),.3,"spur-pebble",be,64),await he(An(K,.8),Math.round(800*g),6,()=>{const t=Jt(.19*Yt,.37*Yt);return t<0?null:[t,K.sign()*Math.min(9.5,(Ut[t]+At[t])*.5+1.5)*Math.pow(K(),.7)]},()=>.05+.13*Math.pow(K(),2),.3,"spur-scree",be,95),await he(cs(),Math.round(300*ca),3,()=>{const t=Jt(.19*Yt,.37*Yt);if(t<0)return null;const e=K.sign();return[t,e*Math.max(1.6,(e>0?At[t]:Ut[t])*Math.pow(K(),.6))]},()=>K.range(.5,1),.1,"spur-cushion",Jo,150);let ha=null,Ee=null;const m0={value:new n.Vector4(-1e4,0,0,0)},fa=.6*Ft,Ps=.83*Ft,co=1,Ze=Math.floor((Ps-fa)/co)+1,en=16,da=new Float32Array(Ze),ho=new Float32Array(Ze),fo=new Float32Array(Ze),_s=t=>(.72-(.72-t)*(t<.72?.25:.33))*Ft,g0=new n.Vector3,Ls=(t,e)=>3.2*(1-t*t)-2.4+1.5*Math.sin(t*4.3+e*.7)+.8*Math.sin(t*9.1-e*1.3+1.7);if(Ro){const t=[],e=[],o=[],a=[];for(let M=0;M<Ze;M++){const c=fa+M*co,p=Math.round(Xt(c)),w=-(Ut[p]+18);let z=1e9;for(let C=9;C<=27;C+=3)z=Math.min(z,le(c,-(Ut[p]+C)));da[M]=z-.05,ho[M]=w,fo[M]=1.3*i(0,14,c-fa)*ya(pt[p]);for(let C=0;C<=40;C++){const R=C/40*2-1;ge(c,w+R*en,Et),t.push(Et.x,da[M],Et.z),e.push(c,R,fo[M]*(1-.6*i(.7,1,Math.abs(R)))),o.push(Et.tx,Et.tz,le(c,w+R*en)-da[M])}(M&3)===3&&await s.yield()}await s.yield();for(let M=0;M<Ze-1;M++)for(let c=0;c<40;c++){const p=M*41+c,w=p+1,z=p+40+1,C=z+1;a.push(p,z,w,w,z,C)}await s.yield();const l=t.length/3,m=dt-22,B=Math.floor((Ft+24-m)/3)+1,b=new Float32Array(B);for(let M=0;M<B;M++){const c=m+M*3;b[M]=Math.min(le(c,-7.4),le(c,-8.5),le(c,-9.6))}for(let M=0;M<B;M++){const c=m+M*3,p=i(0,18,c-m),w=(b[Math.max(0,M-1)]+2*b[M]+b[Math.min(B-1,M+1)])*.25+.03;for(let z=0;z<=4;z++){const C=z/4*2-1,R=-10.4+C*3.2;ge(c,R,Et),t.push(Et.x,w,Et.z),e.push(c-1e4,C,.3*p),o.push(Et.tx,Et.tz,0)}}for(let M=0;M<B-1;M++)for(let c=0;c<4;c++){const p=l+M*5+c,w=p+1,z=p+5,C=z+1;a.push(p,z,w,w,z,C)}await s.yield();const d=new n.BufferGeometry;d.setAttribute("position",new n.Float32BufferAttribute(t,3)),d.setAttribute("aSL",new n.Float32BufferAttribute(e,3)),d.setAttribute("aTan",new n.Float32BufferAttribute(o,3)),d.setIndex(a),await s.yield(),ha=new n.Mesh(d,new n.ShaderMaterial({uniforms:{...Le(),...T,uFlood:m0},vertexShader:bi,fragmentShader:xi,fog:!0,side:n.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-2})),ha.frustumCulled=!1,ha.name="flood",v.add(ha),await s.yield();const L=Sn(K),u=12;L.setAttribute("iShade",new n.InstancedBufferAttribute(new Float32Array(u).fill(1),1)),Re.push(L),Ee=new n.InstancedMesh(L,be,u),Ee.frustumCulled=!1,Ee.name="torn-brush",Ee.instanceMatrix.setUsage(n.DynamicDrawUsage);for(let M=0;M<u;M++)Ee.setMatrixAt(M,Ta.makeScale(0,0,0));v.add(Ee),await s.yield()}const Ht=k.fork("herd"),fe=[],de=t=>{fe.push({ahead:0,lam:0,cls:1,side:1,stag:0,ph:Ht(),size:Ht.range(.95,1.06),tint:Ht.range(.8,1),wa:Ht.range(.8,2.2),wf:Ht.range(.11,.24),wp:Ht.range(0,6.28),lane:Ht(),bench:Ht.range(9.6,13.4),seed:Ht(),foal:!1,...t})},w0=h?.56:.71;de({ahead:12.7,lam:.155,cls:0,wa:.5,tint:.7}),de({ahead:13.5,lam:-.155,cls:0,side:-1,stag:4.6,wa:.5,tint:.64}),de({ahead:9,side:-1,lane:.25,bench:10.5,wa:.4}),de({ahead:10.5,side:1,lane:.35,bench:10,wa:.3}),de({ahead:8.6,side:1,lane:.2,bench:8.8,wa:.3,size:w0,foal:!0}),de({ahead:-12,side:-1,lane:.5,size:1.1,tint:.8}),[[8,-1,.1],[11.5,1,.3],[16.5,-1,.45],[19,1,.1],[23.5,-1,.2],[27,1,.5]].forEach(([t,e,o])=>de({ahead:t,side:e,lane:o})),[24,29.5,35.5,41.5,48,55,62.5,70.5,79].forEach((t,e)=>de({ahead:t,cls:0,lam:(e&1?-1:1)*Ht.range(.1,.25),side:e&1?-1:1,stag:0}));let y0=1;for(;fe.length<ao;){const t=fe.length,e=x(-24,82,Ht()),o=t&1?-1:1;if(de({ahead:e,side:o}),y0<10&&fe.length<ao&&Ht()<.34){const a=fe[fe.length-1];de({ahead:e-(h?.9:1.5),side:o,lane:Math.max(0,a.lane-(h?.07:.13)),bench:a.bench-(h?.8:1.3),size:w0,foal:!0,wa:a.wa,wf:a.wf,wp:a.wp}),y0++}}for(let t=0;t<Ca;t++)de(F==="khulan"?{cls:3,ahead:x(14,96,(t+Ht())/Ca),side:1,bench:Ht.range(26,32),size:.9,tint:1}:{cls:4,ahead:x(12,46,(t+Ht())/Ca),side:1,lane:Ht(),size:1.04,tint:.9});for(let t=0;t<e0;t++)de({cls:5,ahead:2.6+t*1.3+Ht.range(0,.5),bench:6.9+t*3%4*.95+Ht.range(0,.4),lane:.1045+t*3%8*.0017,size:.57,tint:Ht.range(.92,1.08)});fe.forEach((t,e)=>{t.hug=t.foal&&e>0?fe[e-1].hug:e===2||t.ahead<3.5&&t.ahead>-9});for(let t=0;t<_e;t++)je[t*4]=fe[t].size,je[t*4+1]=fe[t].tint,je[t*4+2]=fe[t].cls===5?1:0,je[t*4+3]=fe[t].seed;await s.yield();const Rs=(t,e)=>{const o=pt[e],a=Ut[e],r=At[e];if(t.cls===0)return x(t.lam*((t.lam<0?a:r)-.9),t.side*(8.5+1.5*t.lane),i(dt-40,dt+20,o));const l=t.side<0?a:r;if(t.cls===3)return t.side*x(Math.min(9+2.5*t.lane,l-.6),l+t.bench,i(zt+34,zt+90,o));const m=t.side*x(4.4,10.2,t.lane)*(l-.9)/13.1,B=t.side*(l+t.bench),b=t.side<0?ya(o):0,d=x(m,b>0?x(B,t.hug?-(l-1.7+.5*t.lane):r+t.bench+1.8,b):B,t.side>0?Ot(o,zt+34,zt+84,dt-110,dt-45):Ot(o,zt-60,zt-5,dt-110,dt-45));return x(d,t.side*(8.5+1.5*t.lane),i(dt-110,dt-30,o))},uo=.25*Ft+5,vo=-5.4,an=.12*Ft-3,qa=new n.Vector3;ge(uo,vo,Et),qa.set(Et.x,le(uo,vo)+1.6,Et.z);let Ye=null;{const t=pa((e,o)=>{const r=[1,1,1];for(let l=0;l<=6;l++)for(let m=0;m<=6;m++){const B=uo+(l/6-.5)*3.8,b=vo+(m/6-.5)*3.2;ge(B,b,Et),e(Et.x,le(B,b)+.045,Et.z,r,0,l/6,m/6,4)}for(let l=0;l<6;l++)for(let m=0;m<6;m++){const B=l*7+m,b=B+1,d=B+6+1,L=d+1;o.push(B,d,b,b,d,L)}});t.setAttribute("iShade",new n.InstancedBufferAttribute(new Float32Array([1]),1)),Ye=new n.InstancedMesh(t,Jo,1),Ye.setMatrixAt(0,Ta.identity()),Ye.instanceMatrix.needsUpdate=!0,Ye.frustumCulled=!1,Ye.name="stallion-shade",v.add(Ye),Re.push(t)}const Ts=new n.Vector3(-60,86,85),on=qa.clone(),b0=new n.Vector3,po={2:[6.4,-4.5],6:[9.8,-5.7],3:[7.6,4.7],4:[5.7,4]},Ws={2:[3.5,-3.75],6:[7,-3.9],8:[5.4,-6.6],10:[9.8,-5.6]},se=k.fork("wash-brush"),xe=k.fork("eagle"),nn=[],sn=[];{const t=e=>{let o=0;return()=>{const a=14+(o+se())*((Tt+26-14)/e);o++;const r=Ct(Bt+Math.round(a/oe),2,ut-3),l=Be+(r+.5)*oe;let m=se.sign()*se.range(6.3,7.9);return m>0&&l>an-8&&l<an+46&&(m=-m),nn.push(l),sn.push(m),[r,m]}};await he(Sn(se),14,2,t(14),()=>se.range(1.5,2.2),.1,"wash-saxaul",be,420,null,se),await he(rs(se),10,2,t(10),()=>se.range(1.25,1.7),.08,"wash-tamarisk",be,420,null,se)}const He=Math.round(150*Math.max(.6,g)),mo=62,rn=8,x0=new Float32Array(He),ln=new Float32Array(He),M0=new Float32Array(He),Qe=new n.InstancedBufferAttribute(new Float32Array(He*4),4),Ua=new n.InstancedBufferAttribute(new Float32Array(He*4),4);{for(let o=0;o<He;o++)x0[o]=se.range(0,mo),ln[o]=se.range(-1,1),M0[o]=se.range(.6,1),Qe.array[o*4+3]=se(),Ua.array[o*4]=se.range(1.5,3.4);Qe.setUsage(n.DynamicDrawUsage),Ua.setUsage(n.DynamicDrawUsage);const t=new n.InstancedBufferGeometry;t.setAttribute("position",new n.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),t.setIndex([0,1,2,0,2,3]),t.setAttribute("iPuff",Qe),t.setAttribute("iPuffA",Ua),t.instanceCount=He;const e=new n.Mesh(t,new n.ShaderMaterial({uniforms:{...Le(),...T},vertexShader:gi,fragmentShader:wi,fog:!0,transparent:!0,depthWrite:!1}));e.frustumCulled=!1,e.renderOrder=5,e.name="herd-dust",v.add(e),Re.push(t)}await s.yield();const go=.38,Da=.48,wo=.72,Na=.38,yo=.72,k0=A.wet.dir.x,z0=A.wet.dir.y,cn=new n.Vector3,S0=A.wet.frontAt(Na),qs=A.wet.frontAt(yo),hn=t=>(Ue.pointAt(t,cn),cn.x*k0+cn.z*z0),A0=Na+(yo-Na)*(hn(Da)-S0)/Math.max(.001,qs-S0),fn=t=>t<go?t*(Na/go):t<Da?x(Na,A0,(t-go)/(Da-go)):t<wo?x(A0,yo,(t-Da)/(wo-Da)):x(yo,1,(t-wo)/(1-wo)),C0=.46,Us=Math.max(1,hn(C0)-A.wet.frontAt(fn(C0))),F0=.6,Ds=Math.max(1,A.wet.frontAt(fn(F0))-hn(F0));A.setCloudBreadth(Ds);const B0=y==="dawn"?0:1;await s.yield(),await eo.prewarm(s.renderer,null,v),$t&&await $t.prewarm(s.renderer,null,v),await s.yield();const P0=12,dn=3,Ns=1.5,Es=4.2,_0=60,Hs=60,Gs=8,L0=.4,R0=.68,ie=[xe.range(.17,.25),xe.range(0,6.28),xe.range(.27,.37),xe.range(0,6.28),xe.range(.21,.31),xe.range(0,6.28),xe.range(.11,.17),xe.range(0,6.28)],un=[xe.range(0,6.28),xe.range(0,6.28),xe.range(0,6.28)],ue={a:0,r:0,h:0,far:0,out:0},vn={a:0,r:0,h:0,far:0,out:0},T0=t=>{const e=Ct(Xt(t),0,ut-1.001),o=e|0;return Math.max(Es,x(At[o],At[o+1],e-o)+Ns)},W0=(t,e)=>{const o=1-i(L0*Ft-_0,L0*Ft,t),a=i(R0*Ft,R0*Ft+_0,t);e.far=o,e.out=a;const r=P0*P0-dn*dn;let l=T0(t),m=Math.sqrt(Math.max(4,r-l*l));return l=T0(t+m),m=Math.sqrt(Math.max(4,r-l*l)),e.a=m,e.r=l+Hs*(o*o+a*a),e.h=dn+Gs*(o+a),e};let pn=0,mn=0,gn=-1,Ea=-1,q0=0,wn=Ka,bo=0,xo=0;const Ks=new n.Matrix4,U0=T.uSkyCol.value.clone(),Vs=T.uBounce.value.clone(),yn=new n.Vector3,Os=y==="night"?U0.clone().multiplyScalar(1.12):y==="golden"?new n.Vector3(.365,.36,.39):new n.Vector3(.345,.35,.37),Te=new n.Vector3,bn=new n.Vector3,_i=new n.Vector3(0,1,0),mt={x:0,z:0,tx:0,tz:0},Is=t=>1.05-.24*Ot(t,.3,.38,.62,.7)+.07*Ot(t,.7,.78,.85,.91)+.06*(1-i(.06,.2,t)),D0=(t,e,o,a)=>{const r=a*Ft;Ea<0&&(Ea=e,gn=r);const l=r-gn,m=Math.max(0,Math.min(2,e-Ea));l>1e-4&&l<4?(pn+=l,t>1e-4&&(wn+=(Ct(l/t,8,30)-wn)*Math.min(1,t*3))):(pn+=Ka*m,mn+=Ka*m);const B=r+mn;gn=r,Ea=e,a<=0&&(q0=e*Ka%150);const b=1-i(0,.045,a),d=fn(a);o.getWorldPosition(Te);const L=Te.x*k0+Te.z*z0;A.setProgress(d);const u=T.uShade.value.x>-8990?1:0,M=T.uFront.value-L,c=L-T.uShade.value.x;A.update(t,e,o),Xo.value=e;const p=u*(1-i(-75,75,c)),w=B0*i(.2,.34,a)*(1-.5*p),z=i(dt-40,dt+40,a*Yt);T.uSkyCol.value.copy(U0).lerp(Os,.85*i(.24,.36,a)*(1-p)*B0).multiplyScalar(1+.3*(u?p:i(.5,.68,a))+.1*z+(y==="dawn"?.9*(1-i(.2,.6,a)):0)),T.uBounce.value.copy(Vs).multiplyScalar(1+1.6*z),$t&&($t.setOpacity(y==="dawn"?0:i(.2,.34,a)),$t.update(t,e,o)),eo.update(t,e,o),v.fog.color.copy(Yn).lerp(Ms,w*.7),v.fog.density=Y.dens*(1+.1*w)*(.7+.3*i(.05,.22,a))*(1-.3*i(.3,.42,a)),De&&De.update(t,e,o),Qn.update(t,e,o);const C=u*i(-Us,0,M)*(1-i(100,560,-c)),R=T.uShade2.value.x*p;$e&&($e.setOpacity(C*.9),$e.update&&$e.update(t,e,o)),ia&&($o.uEye.value.copy(Te),$o.uVeilK.value.set(.9*C,R,.3,0)),Yo.length&&Yo[0].uBrk.value.set(0,.85*(y==="night"?.45:1)*u*(1-i(230,420,c))*(1-i(150,600,-c)),e,0);{const W=Y.storm?u:0;oo.uAft.value.set(0,W*(1-i(-150,205,c)),W*i(30,370,-c),e)}const N=Te.distanceTo(Ne),it=1-i(96,240,N);T.uRing.value.w=2.3*it*(1-.3*(1-i(12,80,N))),Qo.uHaloK.value.x=.64*it*(1-.55*(1-i(28,88,N)))*i(1.6,22.4,N),Qo.uHaloK.value.z=e,Ra&&Ra.update&&Ra.update(t,e,o);const ct=Ot(a,.07,.095,.16,.2),Z=Ot(a,.19,.21,.272,.298),nt=i(.775,.85,a),bt=Ot(a,.3,.335,.57,.63),Gt=Ot(a,.48,.55,.75,.8),Vt=Ot(a,.3,.36,.6,.66),Dt=Ot(a,.565,.6,.74,.79),Zt=a>0?r:Ct((Te.x-Wt[Bt])*It[Bt]+(Te.z-qt[Bt])*jt[Bt],-60,0);for(let W=0;W<_e;W++){const q=fe[W],et=W*4;let gt,ot,Rt=1,re=0,ve=0,te=q.size,We=0,Mo=as*(q.foal?.75:1),Me;if(q.cls===5){const ht=a-q.lane,ke=ht<=0?0:(ht-.012*(1-Math.exp(-ht/.012)))*Ft*1.45;gt=an+q.ahead+ke,Rt=i(0,.004,ht);{const Ge=Math.round(Xt(gt));ot=Math.min(q.bench+30*i(.03,.22,ht),x(At[Ge]-.6,99,i(zt+34,zt+64,pt[Ge])))}Me=ke/3.6+q.ph,Me-=Math.floor(Me);const qe=(Me-.66+1)%1/.4;qe<1&&(We=.95*Math.sin(Math.PI*qe)*Rt),te*=1-i(.25,.3,ht),ve=-.5*i(.006,.05,ht)*(1-i(.16,.24,ht))}else{let ht=q.ahead+(q.stag?q.stag*(1-Math.min(1,(Ut[Math.round(Xt(r+q.ahead))]+At[Math.round(Xt(r+q.ahead))])/18)):0);q.cls===3&&(ht+=70*(1-i(0,.14,a))-190*i(.52,.76,a));const ke=Ws[W];ke&&(ht=x(ht,ke[0]+6.5*(1-i(.345,.41,a))+4.5*i(.48,.57,a),bt)),(W===3||W===4)&&(ht=x(x(ht,W===3?10.5:8.6,Gt),W===3?8.4:5.5,Dt)),po[W]&&(ht=x(ht,po[W][0],nt)),W>11&&W<15&&(ht*=1-.45*Vt),(W>5||W===3||W===4||W===2)&&(q.side>0&&q.cls!==0&&q.cls!==3&&ht>-5&&ht<22&&(ht=x(ht,22+.5*(ht+5),ct)),q.side<0&&q.cls!==0&&ht>-10&&ht<20&&(ht=x(ht,20+.55*(ht+10),Z)));let qe;const Ge=a>0?1:i(-14,0,Zt);if(W<2)qe=a>0?ht+.5*Math.sin(e*q.wf+q.wp):x(1.5+.9*W,ht,Ge)-Zt,a<=0&&(te*=1+.6*(1-i(-26,-4,Zt)));else{const Ke=((q0+ht+40)%150+150)%150-40;qe=ht+q.wa*(ke?1-.75*bt:1)*Math.sin(e*q.wf+q.wp)+b*(Ke-ht),b>0&&(te*=x(1,i(-40,-33,Ke)*(1-i(98,110,Ke)),b))}gt=Math.max(Be+3,(W<2?Zt:r)+qe);const ko=Math.round(Xt(gt));if(ot=Rs(q,ko),q.cls===1&&(ot+=.5*Math.sin(e*q.wf*1.4+q.wp*2)),q.cls===4&&(ot=x(Math.min(10.5+2*q.lane,At[ko]-.6),ot,i(.1,.3,a))),q.side>0&&(q.cls===1||q.cls===4)&&W!==5&&(ot=x(ot,3.4+1.5*q.lane,ct*(1-i(24,40,gt-r)))),ke&&(ot=x(ot,ke[1],bt)),W===3&&(ot=x(x(ot,3.9,Gt),4.9,Dt)),W===4&&(ot=x(x(ot,2.9,Gt),3.75,Dt)),po[W]&&(ot=x(ot,po[W][1],nt)),W===5){const Ke=i(.278,.33,a);gt=x(uo,gt,Ke),ot=x(vo,ot,Ke),Rt=i(.272,.296,a),re=Ot(a,.204,.232,.259,.278),ve=x(Math.PI,2.25,i(.2,.236,a))*(1-i(.262,.302,a)),te=q.size}else{const Ke=Math.abs(gt-r);let Ga=(W<2?Ge:1)*3.7*(1-i(6,9,Ke));if(q.hug&&ot<0){const Z0=ya(pt[ko]);Z0>0&&(Ga=Math.min(Ga,x(Ga,Math.max(2.4,Ut[ko]-1.1),Z0)))}Math.abs(ot)<Ga&&(ot=(ot===0?q.side:Math.sign(ot))*Ga),q.cls===0&&W>1&&(ot+=q.side*3.6*b*(1-i(6,16,gt-r)))}Me=B/Mo+q.ph,Me-=Math.floor(Me)}for(let ht=0;ht<nn.length;ht++){const ke=Math.abs(gt-nn[ht]);if(ke<9){const qe=ot-sn[ht],Ge=Math.abs(qe);Ge<2.1&&(ot=sn[ht]+(qe>=0?1:-1)*x(Ge,2.1,1-i(2.5,9,ke)))}}ge(gt,ot,mt);const $0=Math.round(Xt(gt)),Mn=pt[$0]>dt-20;let va=le(gt,ot);Mn&&(va=Math.max(va,ne[$0]));const Qs=le(gt+1,ot),Js=le(gt-1,ot);Fa[et]=mt.x,Fa[et+1]=va+We,Fa[et+2]=mt.z,Fa[et+3]=Math.atan2(mt.tx,mt.tz)+ve,Ba[et]=Me,Ba[et+1]=Mn?0:Math.atan2(Qs-Js,2)*(1-re),Ba[et+2]=Rt,Ba[et+3]=re,je[et]=te,je[et+1]=q.tint*(Mn?ot<0?.8:.84:1),Pa[et]=gt,Pa[et+1]=ot,Pa[et+2]=mt.tx,Pa[et+3]=mt.tz,W===5&&qa.set(mt.x,va+1.5,mt.z),W===2&&on.set(mt.x+mt.tx*3,va+1.1,mt.z+mt.tz*3),W===Oo+3&&yn.set(mt.x,va+.9,mt.z)}{const W=Math.min(r+46,zt-6),q=Math.round(Xt(W));ge(W,27,mt),b0.set(mt.x,ne[q]+15,mt.z)}for(const W of o0)W.needsUpdate=!0;for(const W of p0)W[0].visible=W[2]>Zt-25&&W[1]<Zt+W[3];{const W=Ct(Math.floor(Xt(Zt-36)),0,Xn-1);In.setDrawRange(W*jn,1/0)}l0.uSpeed.value=wn;for(let W=0;W<He;W++){const q=((x0[W]-Zt+rn)%mo+mo)%mo-rn,et=Zt+q,gt=Math.round(Xt(et)),ot=ln[W]*(Math.min(13,ln[W]<0?Ut[gt]:At[gt])-.4);ge(et,ot,mt);const Rt=W*4;Qe.array[Rt]=mt.x,Qe.array[Rt+1]=le(et,ot),Qe.array[Rt+2]=mt.z,Ua.array[Rt+1]=M0[W]*(.08+.92*(1-i(Tt+20,Tt+70,pt[gt])))*(1-i(40,54,q))*i(-rn,-3,q)*i(0,6,et)}Qe.needsUpdate=!0,Ua.needsUpdate=!0,ka.visible=a<.05,Ye.visible=a<.3,Xe.visible=a>0,o.getWorldDirection(bn);const ua=Math.round(Xt(r+7));let Ha=Math.atan2(-It[ua],-jt[ua])-Math.atan2(-bn.x,-bn.z);Ha-=Math.round(Ha/6.2832)*6.2832,Ha=Ct(.24*Ha,-.075,.075)+.02*Math.sin(e*.37+1.3)+.035*Math.sin(a*23+1);const N0=Math.tan(.5*(o.fov||62)*Math.PI/180)/.6009;Xe.matrix.copy(o.matrixWorld).multiply(Ta.makeRotationY(Ha)).multiply(Ks.makeScale(N0,N0,1)),Xe.matrixWorldNeedsUpdate=!0;const E0=B/as,H0=W=>{const q=Math.max(0,Math.sin(W));return q*q*q*q*q*q},G0=Math.round(Xt(r)),K0=It[G0],V0=jt[G0],xn=(W,q)=>{const et=W.x-Te.x,gt=W.z-Te.z,ot=et*K0+gt*V0,Rt=gt*K0-et*V0,re=Math.hypot(ot,Rt)+.001;bo=(1-i(.6*q,q,re))*i(-.45,.15,ot/re),xo=Ct(Math.atan2(Rt,ot),-1.1,1.1)};xn(yn,40);const O0=a>0?bo:0,I0=xo;xn(qa,44);const j0=a>0?bo:0,X0=xo;xn(on,12);const js=a>0?bo:0,Xs=xo,$s=-X0*j0+.1*Math.sin(e*.7)+.35*H0(e*1.3+.4),Zs=-I0*O0+.1*Math.sin(e*.9+2)-.35*H0(e*1.05+2.6),Ys=u*i(-60,10,M)*(1-i(20,200,-c));c0.value.set(E0-Math.floor(E0),$s,Zs,Ys),h0.value.set(.013+.013*Math.sin(a*37+2),.35*(.16*I0*O0+.16*X0*j0+.1*Xs*js+.05*Math.sin(e*.23+.6)+.03*Math.sin(e*.61+2.1)),0,0);{W0(r,ue),W0(r+2,vn);const q=Math.max(ue.far,ue.out),et=1-.7*q,gt=r+ue.a+et*(.9*Math.sin(e*ie[0]+ie[1])+.4*Math.sin(e*ie[0]*2.3+ie[3])),ot=ue.r+et*(.42*Math.sin(e*ie[2]+ie[3])+.16*Math.sin(e*ie[2]*2.7+ie[5])),Rt=Ct(Xt(r),0,ut-1.001),re=Rt|0;ge(gt,ot,mt);let ve=x(ne[re],ne[re+1],Rt-re)+zo+ue.h+et*.32*Math.sin(e*ie[4]+ie[5]);ve=Math.max(ve,le(gt,Ct(ot,-40,40))+2.6),q>.02&&(ve=Math.max(ve,No(mt.x,mt.z)+6)),sa.position.set(mt.x,ve,mt.z);const te=Math.atan2(vn.r-ue.r,2+vn.a-ue.a),We=1-q;sa.rotation.set(.15+.04*Math.sin(e*.5)-.15*ue.out,Math.atan2(mt.tx,mt.tz)-te+We*(.52+.07*Math.sin(e*ie[6]+ie[7])),We*(.25+.07*Math.cos(e*ie[6]*1.6+ie[1]))+.5*(Math.sin(Math.min(1,ue.far*3)*Math.PI)+Math.sin(Math.min(1,ue.out*3)*Math.PI)),"YXZ"),sa.visible=a>0&&ue.far<1&&ue.out<1,f0.value.set(.3+.5*Math.sin(e*.7+un[0]),.24+.1*Math.sin(e*.9+un[1]),.3*Math.sin(e*.5+un[2]),0)}if(u0.update(t,e,o,a),ha){const W=_s(a),q=i(.585,.612,a);m0.value.set(W,e,q,i(.74,.8,a));{const et=Ct((W-1-fa)/co,0,Ze-1.001),gt=et|0;ge(W-1,ho[gt]-2,mt),g0.set(mt.x,da[gt]+1.2,mt.z)}for(let et=0;et<12;et++){const gt=et<3,ot=Math.sin(et*2.4+.3*Math.sin(e*.5+et))*(gt?.5:.62),Rt=(gt?1.4+et*1.3:3+et*1.5)+.7*Math.sin(e*.7+et*1.9),re=W+Ls(ot,e)-Rt,ve=Ct((re-fa)/co,0,Ze-1.001),te=ve|0,We=ve-te,Mo=x(fo[te],fo[te+1],We)*q*(i(0,1.6,Rt)*(1-.35*i(8,70,Rt))+.5*Math.exp(-(Rt-1.9)*(Rt-1.9)/3.2)),Me=re>fa+4&&q>.3&&Mo>.25?gt?1.25+.14*et:.62+.22*Math.sin(et*3.1):0;ge(re,x(ho[te],ho[te+1],We)+ot*en,mt),lo.set(mt.x,x(da[te],da[te+1],We)+Mo-.3*Me+.12*Math.sin(e*2.3+et),mt.z),io.set(1.3+.5*Math.sin(e*1.1+et*2),et*1.7+e*.4,e*(.7+.08*et)+et),so.setFromEuler(io),ro.setScalar(Me),Ee.setMatrixAt(et,Ta.compose(lo,so,ro))}Ee.instanceMatrix.needsUpdate=!0}};{const t=new n.PerspectiveCamera(62,1.78,.3,5200);t.position.copy(Ue.start),t.updateMatrixWorld(!0),D0(0,0,t,0)}return Ea=-1,pn=0,mn=0,{scene:v,path:Ue,duration:d0,pace:Is,title:P?"The Painted Ridges, October":h?"The Painted Ridges in May":"The Painted Ridges",camera:{fov:62,near:.3,far:5200,lookAhead:30,sway:.55,bank:.5},pois:[{at:(t,e)=>Ts.set(x(St[0]-70,I.x-185,i(.34,.62,e)),x(84,60,i(.34,.62,e)),x(95,70,i(.34,.62,e))),from:.2,to:.7,weight:.5},{at:()=>on,from:.315,to:.56,weight:.32},{at:()=>Ne,from:.66,to:.97,weight:.6},{at:()=>yn,from:.075,to:.185,weight:.42},{at:()=>b0,from:.045,to:.235,weight:.4},{at:()=>qa,from:.18,to:.295,weight:.55},...ha?[{at:()=>g0,from:.655,to:.765,weight:.42}]:[]],portal:{shape:"circle",radius:no,color:y==="night"?"#bcd0ff":"#ffd9a0",glow:1.5,revealDistance:240,dewash:.6},post:{exposure:Y.exposure,bloom:{strength:.26,radius:.6,threshold:.93},grade:{saturation:1.08,contrast:1.05,tint:y==="night"?"#e6ecff":"#fff7ec",shadowTint:"#060a14",vignette:.3,grain:.02}},ride:"none",update:D0,dispose(){for(const t of Re)t.dispose();eo.dispose(),$t&&$t.dispose()}}}};export{Wi as default};
