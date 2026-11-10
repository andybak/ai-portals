import*as a from"three";const Ve=["#0B1A4A","#2348A8","#7FB2E5","#F6D54A","#1E4E5A","#14261E","#F08A24"],T=1.75,i=512,ze=.1,Q=Math.PI*2,ae=14*Math.PI/180,We=(n,h,t)=>{const u=Math.min(1,Math.max(0,(t-n)/(h-n)));return u*u*(3-2*u)};function Pe(n,h){const t=Math.acos(Math.max(-1,Math.min(1,n.y))),u=Math.hypot(n.x,n.z)||1e-6;return h.x=n.x/u*t,h.y=n.z/u*t,h}function Ee(n,h,t){const u=Math.hypot(n,h)||1e-6,ee=Math.sin(u);return t.set(ee*n/u,Math.cos(u),ee*h/u)}function Re(n,h){const t=n*Math.PI/180,u=h*Math.PI/180;return new a.Vector3(Math.sin(t)*Math.cos(u),Math.sin(u),-Math.cos(t)*Math.cos(u))}async function Te(n,h,t,u,ee,Ae,ie){const P=new Float32Array(i*i),w=new Float32Array(i*i),I=new Float32Array(i*i),le=new Uint8Array(i*i),ue=n.range(.009,.014)*n.sign(),te=[];for(let e=0;e<5;e++){const l=n.range(0,Q),c=n.range(2.4,6);te.push({kx:Math.cos(l)*c,ky:Math.sin(l)*c,ph:n.range(0,Q),A:n.range(.006,.011)/c})}const A=2*T/i;for(let e=0;e<i;e++){const l=-T+(e+.5)*A;for(let c=0;c<i;c++){const x=-T+(c+.5)*A;let b=-l*ue,s=x*ue;for(let M=0;M<5;M++){const v=te[M],m=v.A*Math.cos(v.kx*x+v.ky*l+v.ph);b+=m*v.ky,s-=m*v.kx}const z=e*i+c;P[z]=b,w[z]=s}e%8===7&&await ie.yield()}const N=[],k=[];for(let e=0;e<11;e++)k.push(n.range(.052,.122));k.sort((e,l)=>l-e);for(let e=0;e<11;e++){const l=k[e];let c=null;for(let s=0;s<400&&!c;s++){const z=Math.sqrt(n.range(.0625,1.8496000000000004));let M=n.range(0,Q);n.chance(.62)&&(M=-Math.PI/2+n.range(-1.25,1.25));const v=Math.cos(M)*z,m=Math.sin(M)*z;if(Math.hypot(v-h.x,m-h.y)<.36+l)continue;const L=v-t.x,W=m-t.y,V=(L*u.x+W*u.y)/.62,B=(L*ee.x+W*ee.y)/.3;if(V*V+B*B<(1+l*2)*(1+l*2))continue;let S=!0;for(const j of N)if(Math.hypot(v-j.x,m-j.y)<(l+j.R)*1.3+.03){S=!1;break}S&&(c={x:v,y:m})}if(!c)continue;let x=n.sign(),b=1e9;for(const s of N){const z=Math.hypot(c.x-s.x,c.y-s.y);z<b&&(b=z,x=-s.spin)}N.push({x:c.x,y:c.y,R:l,n:l>.085?4:3,spin:x,period:n.range(9,20)})}const _=P.slice(),X=w.slice();for(const e of N){const l=Q/e.period,c=e.R*2.4,x=e.R/e.n,b=Math.max(0,Math.floor((e.x-c+T)/A)),s=Math.min(i-1,Math.ceil((e.x+c+T)/A)),z=Math.max(0,Math.floor((e.y-c+T)/A)),M=Math.min(i-1,Math.ceil((e.y+c+T)/A));for(let v=z;v<=M;v++)for(let m=b;m<=s;m++){const L=-T+(m+.5)*A-e.x,W=-T+(v+.5)*A-e.y,V=Math.hypot(L,W);if(V>c)continue;const B=V*e.n/e.R;let S,j=Math.min(e.n-1,Math.floor(B));if(B<e.n){const F=Math.sin(Math.PI*B);S=Math.sign(F)*Math.sqrt(Math.abs(F))}else{const F=(B-e.n)/1.1;S=(e.n%2?-1:1)*1.7*F*Math.exp(-F)}const D=v*i+m,ve=e.spin*l*S;P[D]+=-W*ve,w[D]+=L*ve;const se=Ae*l*1.5*Math.abs(S);_[D]+=-W*se,X[D]+=L*se;const ce=V<x?1-.25*V/x:.75*Math.max(0,1-(V-x)/(1.25*e.R-x));ce>I[D]&&(I[D]=ce,le[D]=j%2?255:0)}}const d=new Uint8Array(i*i*4);for(let e=0;e<i*i;e++)d[e*4]=128+Math.round(Math.max(-1,Math.min(1,P[e]/ze))*127),d[e*4+1]=128+Math.round(Math.max(-1,Math.min(1,w[e]/ze))*127),d[e*4+2]=Math.round(I[e]*255),d[e*4+3]=le[e],e%16384===16383&&await ie.yield();const q=new Uint8Array(i*i*4);for(let e=0;e<i*i;e++)q[e*4]=128+Math.round(Math.max(-1,Math.min(1,_[e]/ze))*127),q[e*4+1]=128+Math.round(Math.max(-1,Math.min(1,X[e]/ze))*127),q[e*4+3]=255,e%16384===16383&&await ie.yield();const H=e=>{const l=new a.DataTexture(e,i,i,a.RGBAFormat,a.UnsignedByteType);return l.magFilter=l.minFilter=a.LinearFilter,l.wrapS=l.wrapT=a.ClampToEdgeWrapping,l.colorSpace=a.NoColorSpace,l.generateMipmaps=!1,l.needsUpdate=!0,l};return{tex:H(d),tex2:H(q),vx:P,vy:w,stars:N}}const _e=`
#define TN_CELL 0.022
#define TN_LIFE 1.6
#define TN_PMAX 1.75
uniform sampler2D uField, uField2;
uniform float uTime, uDrain, uArrive, uWheelHand, uCresAng, uGain, uSync, uWeave;
uniform vec2 uMoonP, uWheelP, uWheelEx, uWheelEy;
uniform vec3 uMoonDir, uMoonX, uMoonY, uSpin;
uniform vec3 uPal[7];

vec4 tnHash4(vec2 p){ vec4 p4 = fract(p.xyxy*vec4(.1031,.1030,.0973,.1099)); p4 += dot(p4, p4.wzxy+33.33); return fract((p4.xxyz+p4.yzzw)*p4.zywx); }
float tnHash1(float n){ return fract(sin(n*12.9898)*43758.5453); }
// brush relief across a stroke (a = -1..1): dome + bristle ridges + raised edges
float tnProf(float a, float id){ float a2 = a*a; return (1.0-a2*a2)*0.55 + 0.22*cos(a*9.0+id*37.0) + 0.23*smoothstep(0.5,0.9,abs(a)); }
float tnSlope(float a, float id){ return (tnProf(a+0.1,id)-tnProf(a-0.1,id))*5.0; }
vec2 tnFieldUv(vec2 p){ return clamp(p/(2.0*TN_PMAX)+0.5, 0.002, 0.998); }

vec2 tnWheelLocal(vec2 p, float side, out float fall){
  vec2 c = uWheelP + uWheelEx*side*0.25*(1.0-0.45*uDrain);
  vec2 d = p - c; vec2 dl = vec2(dot(d,uWheelEx)/0.30, dot(d,uWheelEy)/0.19);
  fall = exp(-dot(dl,dl)*0.9); return dl;
}
// sky velocity in chart space (rad/s): baked rotation + waves + stars, the Wheel, the moon sink
vec2 tnVel(vec2 p, out vec4 f){
  f = texture2D(uField, tnFieldUv(p));
  vec2 fv = mix(f.rg, texture2D(uField2, tnFieldUv(p)).rg, uSync);      // rare event: the stars fall into step
  vec2 v = (fv*255.0 - 128.0)/127.0*0.1*(1.0-0.4*uDrain);
  for (int s = 0; s < 2; s++){
    float fall; vec2 dl = tnWheelLocal(p, s == 0 ? -1.0 : 1.0, fall);
    vec2 vl = uWheelHand*0.262*vec2(-dl.y,dl.x) - 0.05*dl;
    v += (uWheelEx*vl.x*0.30 + uWheelEy*vl.y*0.19)*fall;
  }
  vec2 dm = p - uMoonP; float rm = length(dm)+1e-4; vec2 rn = dm/rm;
  float k = uDrain*smoothstep(0.02,0.12,rm);
  v += k*(-rn*0.045*(0.4+0.5/(rm+0.4)) + vec2(-rn.y,rn.x)*uWheelHand*0.105/(rm+0.4));
  float sp = length(v); if (sp > 0.13) v *= 0.13/sp;
  return v;
}

void tnLayer(vec2 p, vec2 v, vec2 fd, float sp, float ph, float seed, inout float bestZ, inout vec2 bestC, inout float bestA, inout vec2 bestD, inout vec4 bestH){
  float cyc = floor(ph), fr = ph - cyc; cyc = mod(cyc, 61.0);
  float grow = smoothstep(0.0, 0.42, 1.0 - abs(2.0*fr-1.0));
  vec2 q = (p - v*(fr-0.5)*TN_LIFE)/TN_CELL;
  vec2 ic = floor(q);
  float hl = 0.62*(1.0+5.0*sp);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){
    vec2 cell = ic + vec2(float(i), float(j));
    vec4 h = tnHash4(cell + vec2(seed*37.7 + cyc*5.13, cyc*9.71 - seed*11.3));
    vec2 d = q - (cell + 0.5 + (h.xy-0.5)*0.6);
    vec2 sd = normalize(fd + vec2(-fd.y,fd.x)*(h.z-0.5)*0.45);
    float L = min(1.05, hl*(0.75+0.5*h.w))*grow, W = 0.20*(0.7+0.6*h.z)*(0.4+0.6*grow);
    float l = dot(d,sd)/max(L,1e-3), a = dot(d, vec2(-sd.y,sd.x))/W;
    float al = abs(l), aa = abs(a);
    if (aa < 1.0 && al < 1.0){
      float en = 1.0 - 0.3*tnHash1(floor(a*4.0+4.0) + h.x*71.0);
      float z = fract(h.x*7.13 + h.y*3.71);
      if (al < en && aa < 1.0 - 0.45*pow(al/en, 5.0) && z > bestZ){ bestZ = z; bestC = p - d*TN_CELL; bestA = a; bestD = sd; bestH = h; }
    }
  }
}

// one flat pigment per stroke, chosen at the stroke centre
vec3 tnPigment(vec2 cp, vec4 h, out float em){
  em = 0.0;
  vec4 f = texture2D(uField, tnFieldUv(cp));
  float e = 1.5708 - length(cp);
  vec3 ultra = uPal[0], cobalt = uPal[1], cer = uPal[2], yel = uPal[3], vir = uPal[4], org = uPal[6];
  vec3 white = vec3(0.78,0.82,0.74);
  float r = h.x;
  vec3 c = r < 0.50 ? cobalt : (r < 0.72 ? mix(ultra, cobalt, 0.5)*1.25 : (r < 0.93 ? cer : mix(cobalt, vir, 0.6)*1.3));
  if (r > 0.988) c = org*0.7;
  float hb = smoothstep(0.30, 0.04, e);
  if (h.y < hb*0.85) c = mix(vir*1.6, cer, fract(h.z*3.7));
  // the Sky Wheel: two interlocked spiral lobes of cerulean and white
  float wf = 0.0, arm = 0.0, rr = 1.0;
  for (int s = 0; s < 2; s++){
    float sd = s == 0 ? -1.0 : 1.0, fall; vec2 dl = tnWheelLocal(cp, sd, fall);
    if (fall > wf){ wf = fall; rr = length(dl);
      arm = sin(atan(dl.y,dl.x) - uWheelHand*uTime*0.262 + uWheelHand*4.2*log(rr+0.08) + sd*1.57); }
  }
  if (h.y < smoothstep(0.10,0.45,wf)){
    c = arm > 0.0 ? (h.z < 0.6 ? white : mix(cer, white, 0.4)) : (h.z < 0.5 ? cobalt*1.15 : cer*0.9);
    if (rr < 0.30 && h.z < 0.75){ c = mix(white, yel, 0.45 + 0.4*smoothstep(0.2,0.05,rr)); em = 0.5*smoothstep(0.3,0.08,rr); }
  }
  // feeding arm from the Wheel to the moon while draining
  vec2 ab = uMoonP - uWheelP; float t = clamp(dot(cp-uWheelP,ab)/dot(ab,ab), 0.0, 1.0);
  float ds = length(cp - uWheelP - ab*t);
  float rm = length(cp - uMoonP);
  float feed = uDrain*max(exp(-ds*ds/0.014), 0.55*exp(-rm*2.2));
  if (h.w < feed*0.75) c = h.x < 0.45 ? white : (h.x < 0.8 ? cer : yel);
  // stars: yellow-white core, rings alternating chrome yellow and pale cerulean
  float s = f.b;
  if (s > 0.74){ c = mix(yel, white*1.1, smoothstep(0.84,1.0,s)*0.7); em = 1.3 + 2.4*smoothstep(0.8,1.0,s); }
  else if (h.y < smoothstep(0.0,0.22,s)*1.2){
    vec3 a = mix(yel, white, 0.25), b = mix(cer, white, 0.55);
    bool warm = f.a > 0.5 || h.w < uSync*1.1;
    vec3 sc = warm ? (h.z < 0.8 ? a : b) : (h.z < 0.6 ? b : a);
    c = mix(mix(cer, white, 0.2), sc, smoothstep(0.03,0.22,s));
    em = (warm ? 1.0 + 0.5*uSync : 0.45)*smoothstep(0.12,0.7,s);
  }
  // the halo's glow stains nearby strokes yellow-green
  c = mix(c, mix(yel, vir*2.0, 0.35), 0.3*smoothstep(0.34,0.08,rm));
  return c*(0.82+0.36*h.w);
}

// moon crescent and its three rings of radial dashes, painted over the strokes
void tnMoon(vec3 dir, inout vec3 alb, inout vec3 emis, inout vec3 bump, inout float mask){
  float cm = dot(dir, uMoonDir);
  if (cm < 0.9) return;
  vec2 m = vec2(dot(dir,uMoonX), dot(dir,uMoonY));
  float r = acos(min(cm,1.0)); float ang = atan(m.y, m.x);
  vec3 yel = uPal[3], org = uPal[6], yg = mix(uPal[3], uPal[4]*2.2, 0.3);
  vec3 t3 = normalize(cross(uMoonDir, dir) + vec3(1e-5,0.0,0.0));
  float hand = 1.0 - smoothstep(0.25, 0.9, uArrive);
  emis += yg*0.07*smoothstep(0.30,0.05,r)*hand;
  for (int k = 0; k < 3; k++){
    float fk = float(k), N = 46.0 + 10.0*fk, r0 = 0.158 + 0.049*fk, hl = 0.016 - 0.0015*fk;
    float an = (ang + uSpin[k] + 6.2832*4.0)/(6.2832/N); float cell = mod(floor(an), N); float fa = fract(an);
    vec4 h = tnHash4(vec2(cell, 7.0+fk*13.0));
    float a = (fa-0.5)*2.0/(0.5+0.22*h.x);
    float l = (r - r0 - hl - (h.y-0.5)*0.007)/(hl*(0.75+0.5*h.z));
    if (abs(a) < 1.0 && abs(l) < 1.0 - 0.3*tnHash1(floor(a*3.0+3.0)+h.w*53.0) && hand > 0.01){
      vec3 c = mix(yg, h.w < 0.3 ? yel : yg*0.9, 0.6)*(0.8+0.4*h.z);
      float E = (1.5 - 0.33*fk)*(0.8+0.35*uDrain)*hand;
      alb = mix(alb, c, hand); emis = mix(emis, c*E*(0.6+0.5*tnProf(a,h.w)), hand);
      bump = t3*tnSlope(a,h.w); mask = 1.0;
    }
  }
  // crescent: disc minus the hollow in which the portal grows; slides round the rim with uArrive
  vec2 mp = normalize(m + vec2(1e-6,0.0))*r;
  float R0 = mix(0.060, 0.172, uArrive), thin = pow(1.0-uArrive, 1.4);
  float ca = uCresAng + uArrive*3.9; vec2 off = vec2(cos(ca), sin(ca))*0.031*thin;
  float R1 = R0 + 0.021*thin;
  float d1 = length(mp - off);
  if (r > R0 && d1 < R1 && thin > 0.01){
    float w = (d1 - (R1-0.05))*190.0;
    float hh = 0.5+0.5*cos(w) ; float sl = -sin(w)*1.2;
    vec3 c = mix(org, yel, smoothstep(0.012,0.0,r-R0)*0.6 + 0.25*hh);
    alb = c; emis = c*(2.4+1.2*hh); bump = normalize(cross(t3, dir))*sl; mask = 1.0;
  } else {
    emis += org*0.5*exp(-max(d1-R1,0.0)*38.0)*thin*step(R0, r);
  }
}

// albedo of the painted sky toward dir; emis = HDR glow, bump = relief gradient (local space)
vec3 tnPaint(vec3 dir, out vec3 emis, out vec3 bump, out float mask){
  float th = acos(clamp(dir.y,-1.0,1.0));
  vec2 az = normalize(dir.xz + vec2(1e-5,0.0));
  vec2 p = az*th;
  vec4 f; vec2 v = tnVel(p, f);
  float sp = length(v); vec2 fd = v/max(sp,1e-4);
  float bestZ = -1.0, bestA = 0.0; vec2 bestC = p, bestD = fd; vec4 bestH = vec4(0.0);
  float ph = uTime/TN_LIFE;
  tnLayer(p, v, fd, sp, ph, 0.0, bestZ, bestC, bestA, bestD, bestH);
  tnLayer(p, v, fd, sp, ph+0.5, 1.0, bestZ, bestC, bestA, bestD, bestH);
  float e = 1.5708 - th, hb = smoothstep(0.30,0.04,e);
  vec3 alb; emis = vec3(0.0); bump = vec3(0.0); mask = 0.0;
  if (bestZ >= 0.0){
    float em; alb = tnPigment(bestC, bestH, em);
    float sl = tnSlope(bestA, bestH.w);
    vec2 g = vec2(-bestD.y, bestD.x)*sl;
    vec3 eth = vec3(az.x*cos(th), -sin(th), az.y*cos(th)), eph = vec3(-az.y, 0.0, az.x);
    bump = eth*dot(g,az) + eph*dot(g, vec2(-az.y,az.x));
    emis = alb*em*(0.7+0.5*tnProf(bestA,bestH.w)); mask = 1.0;
  } else {
    alb = mix(uPal[0]*1.15, uPal[4]*0.9, hb*0.6);     // ultramarine ground between the dashes
    alb += uPal[3]*0.25*smoothstep(0.3,0.9,f.b);
  }
  float core = smoothstep(0.80,1.0,f.b);
  emis += (uPal[3]*1.6 + vec3(1.2))*core*core*1.3 + uPal[3]*0.22*f.b*f.b;        // white centre of each star
  tnMoon(dir, alb, emis, bump, mask);
  return alb;
}
`,He=`
// view-space gallery light on paint relief
vec3 tnGallery(vec3 alb, vec3 emis, vec3 nv, float mask){
  vec3 L = normalize(vec3(-0.6,0.6,0.5));
  float d = clamp(dot(nv,L), 0.0, 1.0);
  float shade = 0.62 + 0.75*d;
  float spec = pow(max(dot(nv, normalize(L+vec3(0.0,0.0,1.0))), 0.0), 40.0)*mask;
  return alb*shade + spec*vec3(0.30,0.36,0.50) + emis*(0.75+0.45*d);
}
`,Ie=`
varying vec3 vDir;
void main(){
  vDir = position;
  vec4 p = projectionMatrix*modelViewMatrix*vec4(position,1.0);
  if (abs(p.w) < 1e-4) p.w = 1e-4;   // a vertex exactly beside a level camera (see the world guide)
  gl_Position = p.xyww;
}`,Be=`
varying vec3 vDir;
uniform mat3 uL2W; uniform float uBump;
#ifdef USE_FOG
uniform vec3 fogColor;
#endif
${_e}
${He}
void main(){
  vec3 dir = normalize(vDir);
  vec3 emis, bump; float mask;
  vec3 alb = tnPaint(dir, emis, bump, mask);
  vec3 n = normalize(-dir - bump*uBump);
  vec3 nv = normalize(mat3(viewMatrix)*(uL2W*n));
  vec3 col = tnGallery(alb, emis, nv, mask)*uGain;
  #ifdef USE_FOG
    col = mix(col, fogColor, 0.35*smoothstep(0.10,-0.03,dir.y));
  #endif
  col *= 0.93 + 0.07*sin(gl_FragCoord.x*uWeave)*sin(gl_FragCoord.y*uWeave);     // canvas tooth, fixed to the screen
  gl_FragColor = vec4(col, 1.0);
}`,Ge=`
varying vec3 vW;
#include <fog_pars_vertex>
void main(){
  vec4 wp = modelMatrix*vec4(position,1.0); vW = wp.xyz;
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Ue=`
varying vec3 vW;
uniform mat3 uL2W; uniform float uRowH, uDim;
#include <fog_pars_fragment>
${_e}
void main(){
  vec3 I = normalize(vW - cameraPosition);
  vec3 R = transpose(uL2W)*reflect(I, vec3(0.0,1.0,0.0));
  float el = asin(clamp(abs(R.y), 0.0, 1.0)), az = atan(R.x, -R.z);
  float rowf = el/uRowH, row = floor(rowf);
  vec4 hr = tnHash4(vec2(row, 3.0));
  float shiver = sin(uTime*(1.2+hr.x*1.6) + row*1.7)*0.006 + sin(uTime*0.5 + row*0.37)*0.010;
  float cw = 0.045 + 0.05*hr.y;
  float azs = (az + shiver + hr.z*6.2832)/cw, ci = floor(azs);
  vec4 hc = tnHash4(vec2(ci, row));
  float l = (azs - ci - 0.5)*2.0/(0.6+0.38*hc.x), a = (rowf - row - 0.5)*2.0/(0.66+0.3*hc.y);
  vec3 col = uPal[0]*0.55 + uPal[5]*0.25;                 // dark water between the dashes
  if (abs(a) < 1.0 && abs(l) < 1.0 - 0.25*tnHash1(floor(a*3.0+3.0) + hc.z*31.0)){
    float elc = (row+0.5)*uRowH + sin(uTime*0.9 + ci*2.3 + row)*uRowH*0.35;
    float azc = (ci+0.5)*cw - hr.z*6.2832 - shiver;
    vec3 dc = vec3(sin(azc)*cos(elc), sin(elc), -cos(azc)*cos(elc));
    vec3 emis, bump; float mask;
    vec3 alb = tnPaint(dc, emis, bump, mask);
    col = (mix(alb, uPal[1], 0.12)*(0.72+0.4*tnProf(a,hc.w)) + emis*0.6)*uDim*uGain;
  }
  col *= 0.93 + 0.07*sin(gl_FragCoord.x*uWeave)*sin(gl_FragCoord.y*uWeave);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Ne=`
attribute vec4 aA, aB, aC;   // aA: type, angle|s0, radius|armAngle, z|offset   aB: halfLen, halfWid, hash, spin group   aC: rgb, emissive
uniform vec4 uSpin4; uniform float uFlow, uDrain, uHand;
varying vec2 vUv; varying vec4 vCol; varying float vId; varying vec3 vSideV, vAxisV;
#include <fog_pars_vertex>
vec3 polar(float r, float a, float z){ return vec3(cos(a)*r, sin(a)*r, z); }
vec3 stream(float u, float a0, float off){
  float w = 1.0-u, z = 300.0*pow(w,1.35);
  float r = 8.3 + z*0.2 + off*(3.0+46.0*w);
  return polar(r, a0 + uHand*(7.0*u + 3.0*u*u*u), z+0.3);
}
void main(){
  float type = aA.x, l = position.x, hl = aB.x, hw = aB.y, hs = aB.z, g = aB.w, sc = 1.0;
  float sp = g < 0.5 ? uSpin4.x : (g < 1.5 ? uSpin4.y : (g < 2.5 ? uSpin4.z : (g < 3.5 ? uSpin4.w : uSpin4.x*(hs-0.5)*1.6)));
  vec3 P, P2;
  if (type < 0.5){ float an = aA.y + sp; P = polar(aA.z + l*hl, an, aA.w); P2 = polar(aA.z + l*hl + 0.2, an, aA.w); }
  else if (type < 1.5){ float an = aA.y + sp + l*hl/aA.z; P = polar(aA.z, an, aA.w); P2 = polar(aA.z, an+0.02, aA.w); }
  else {
    float u = fract(aA.y + uFlow*(0.75+0.5*hs)), uu = clamp(u + l*hl/380.0, 0.0, 1.0);
    P = stream(uu, aA.z, aA.w); P2 = stream(uu+0.002, aA.z, aA.w);
    sc = smoothstep(hs*0.75, hs*0.75+0.2, uDrain)*smoothstep(0.0,0.05,u)*(1.0-smoothstep(0.955,0.995,u));
    hw *= mix(1.0, 0.5, u);
  }
  vec4 wp = modelMatrix*vec4(P,1.0);
  vec3 ax = normalize((modelMatrix*vec4(P2,1.0)).xyz - wp.xyz);
  vec3 toC = cameraPosition - wp.xyz; float dist = length(toC);
  vec3 side = normalize(cross(ax, toC/dist));
  hw = max(hw, dist*0.0022);
  wp.xyz += side*position.y*hw*sc;
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = sc < 0.01 ? vec4(2.0,2.0,2.0,1.0) : projectionMatrix*mvPosition;
  vUv = position.xy; vCol = aC; vId = hs;
  vSideV = mat3(viewMatrix)*side; vAxisV = mat3(viewMatrix)*ax;
  #include <fog_vertex>
}`,je=`
varying vec2 vUv; varying vec4 vCol; varying float vId; varying vec3 vSideV, vAxisV;
uniform float uDrain, uGain, uWeave;
#include <fog_pars_fragment>
float tnHash1(float n){ return fract(sin(n*12.9898)*43758.5453); }
float tnProf(float a, float id){ float a2 = a*a; return (1.0-a2*a2)*0.55 + 0.22*cos(a*9.0+id*37.0) + 0.23*smoothstep(0.5,0.9,abs(a)); }
float tnSlope(float a, float id){ return (tnProf(a+0.1,id)-tnProf(a-0.1,id))*5.0; }
${He}
void main(){
  float a = vUv.y, al = abs(vUv.x);
  float en = 1.0 - 0.28*tnHash1(floor(a*4.0+4.0) + vId*71.0);
  if (al > en || abs(a) > 1.0 - 0.45*pow(al/en, 5.0)) discard;
  vec3 sv = normalize(vSideV), nf = normalize(cross(sv, normalize(vAxisV)));
  if (nf.z < 0.0) nf = -nf;
  vec3 nv = normalize(nf - sv*tnSlope(a, vId)*0.9);
  float pr = tnProf(a, vId);
  vec3 emis = vCol.rgb*vCol.a*(0.6+0.5*pr)*(1.0+0.2*uDrain);
  float wv = 0.93 + 0.07*sin(gl_FragCoord.x*uWeave)*sin(gl_FragCoord.y*uWeave);
  gl_FragColor = vec4(tnGallery(vCol.rgb, emis, nv, 1.0)*uGain*wv, 1.0);
  #include <fog_fragment>
}`;async function Oe(n,h={}){const t=n.rng.fork?n.rng.fork("turning-night-hero"):n.rng,u=h.palette&&h.palette.length>=7?h.palette:Ve,ee=t.range(-.018,.018),Ae=t.range(-.012,.012),ie=t.range(-.03,.04),P=u.slice(0,7).map((o,f)=>new a.Color(o).offsetHSL(f===3||f===6?Ae:ee,0,f<3?ie:0)),w=t.sign(),I=new a.Vector3(0,Math.sin(ae),-Math.cos(ae)),le=new a.Vector3(1,0,0),ue=new a.Vector3().crossVectors(le,I).normalize(),te=Re(-t.range(32,41),t.range(33,38)),A=Pe(I,new a.Vector2),N=Pe(te,new a.Vector2),k=N.clone().normalize(),_=new a.Vector2(-k.y,k.x),X=await Te(t,A,N,_,k,w,n);await n.yield();const d={uField:{value:X.tex},uTime:{value:0},uDrain:{value:0},uArrive:{value:0},uWheelHand:{value:w},uCresAng:{value:t.range(-.9,.2)},uGain:{value:1.15},uMoonP:{value:A},uWheelP:{value:N.clone()},uWheelEx:{value:_},uWheelEy:{value:k},uMoonDir:{value:I},uMoonX:{value:le},uMoonY:{value:ue},uSpin:{value:new a.Vector3},uPal:{value:P},uL2W:{value:new a.Matrix3},uBump:{value:.85},uSpin4:{value:new a.Vector4},uFlow:{value:0},uHand:{value:w},uField2:{value:X.tex2},uSync:{value:0},uWeave:{value:1.5708}},q=o=>Object.assign(a.UniformsUtils.clone(a.UniformsLib.fog),d,o||{}),H=new a.Group;H.name="the-turning-night-hero";const e=new a.Mesh(new a.SphereGeometry(900,48,24),new a.ShaderMaterial({uniforms:q(),vertexShader:Ie,fragmentShader:Be,side:a.BackSide,depthWrite:!1,depthTest:!0,fog:!0}));e.renderOrder=-.9,e.frustumCulled=!1,e.name="sky-wheel-dome",H.add(e);const l=-78;function c(o={}){return new a.ShaderMaterial({uniforms:q({uRowH:{value:o.rowHeight??.01},uDim:{value:o.dim??.8}}),vertexShader:Ge,fragmentShader:Ue,fog:!0})}let x=null;if(h.mirror!==!1){const o=new a.CircleGeometry(2600,64);o.rotateX(-Math.PI/2),x=new a.Mesh(o,c()),x.position.y=l,x.name="preview-mirror",H.add(x)}await n.yield();const b=new a.Group;if(b.name="moon-gate",b.position.set(0,13,0),b.rotation.x=ae,H.add(b),h.gate!==!1){const o=[],f=[],p=[],y=P[3],C=P[6],G=P[2],he=P[1],Y=P[3].clone().lerp(P[4].clone().multiplyScalar(2.2),.3),U=new a.Color(.78,.82,.74),oe=new a.Color,me=new a.Color(.56,.62,.6),Z=(r,g,E,ge,ne,Se,ke,re,Me)=>{const J=.82+.36*t();o.push(r,g,E,ge),f.push(ne,Se,t(),ke),p.push(re.r*J,re.g*J,re.b*J,Me)},$=[60,68,76],de=[8.75,11.6,15],pe=[1,1.1,1.3],ye=[.4,8,20],we=[.26,.3,.36],xe=[1.45,1.15,.9].map(r=>r*(h.gateGlow??1));for(let r=0;r<3;r++)for(let g=0;g<$[r];g++){const E=t.chance(.3)?oe.copy(y):t.chance(.12)?oe.copy(U):oe.copy(Y);Z(0,(g+t.range(-.22,.22))/$[r]*Q,de[r]+t.range(-.25,.25),ye[r]+t.range(-.5,.5),pe[r]*t.range(.75,1.2),we[r]*t.range(.8,1.25),r,E,xe[r]*t.range(.8,1.15))}for(let r=0;r<36;r++)Z(1,(r+t.range(-.2,.2))/36*Q,7.32+t.range(-.05,.05),.15,.8,.2*t.range(.85,1.2),3,t.chance(.55)?C:y,t.range(1.3,1.9));for(let r=0;r<30;r++)Z(1,(r+t.range(-.3,.3))/30*Q,7.66+t.range(-.05,.08),.3,.7,.13*t.range(.85,1.2),3,t.chance(.5)?G:U,t.range(.3,.8));for(let r=0;r<150;r++){const g=t.range(9.5,22);Z(1,t.range(0,Q),g,(g-8)*1.6+t.range(-2,3),t.range(.5,1.2),t.range(.12,.2),4,t.pick([G,G,U,y,he]),t.chance(.3)?t.range(.6,1.4):.1)}const fe=Math.max(0,Math.min(4e3,h.stream??1400));for(let r=0;r<fe;r++){const g=t(),E=g<.38?G:g<.58?me:g<.78?he:g<.95?y:C;Z(2,t(),r%2*Math.PI+t.gauss()*.38,Math.pow(t(),1.6),t.range(1.6,3.8),t.range(.3,.62),9,E,E===y||E===C?t.range(.7,1.2):0)}const K=new a.PlaneGeometry(2,2,6,1),R=new a.InstancedBufferGeometry;R.index=K.index,R.setAttribute("position",K.getAttribute("position")),R.setAttribute("aA",new a.InstancedBufferAttribute(new Float32Array(o),4)),R.setAttribute("aB",new a.InstancedBufferAttribute(new Float32Array(f),4)),R.setAttribute("aC",new a.InstancedBufferAttribute(new Float32Array(p),4)),R.instanceCount=o.length/4;const O=new a.Mesh(R,new a.ShaderMaterial({uniforms:q(),vertexShader:Ne,fragmentShader:je,side:a.DoubleSide,fog:!0}));O.frustumCulled=!1,O.name="gate-strokes",O.renderOrder=1,b.add(O)}await n.yield();let s=Math.min(1,Math.max(0,h.drain??0)),z=Math.min(1,Math.max(0,h.arrive??0)),M=6*s*s,v=.35*s,m=0;const L=te.angleTo(I),W=new a.Vector3,V=Re(-9,15),B=new a.Vector3,S=new a.Vector3,j=new a.Vector2;function D(){d.uDrain.value=s,d.uArrive.value=z;const o=s*s*(3-2*s)*Math.min(1,20*Math.PI/180/L),f=Math.sin(L);if(W.copy(te).multiplyScalar(Math.sin((1-o)*L)/f).addScaledVector(I,Math.sin(o*L)/f).normalize(),m>0){const p=Math.max(.001,W.angleTo(V)),y=m*m*(3-2*m)*Math.min(1,15*Math.PI/180/p),C=Math.sin(p);B.copy(W).multiplyScalar(Math.sin((1-y)*p)/C).addScaledVector(V,Math.sin(y*p)/C).normalize(),W.copy(B)}d.uSync.value=m,Pe(W,d.uWheelP.value)}D();function ve(o,f=new a.Vector3){Pe(o,j);const p=j.x,y=j.y,C=Math.min(i-1,Math.max(0,Math.floor((p/(2*T)+.5)*i))),G=Math.min(i-1,Math.max(0,Math.floor((y/(2*T)+.5)*i))),he=1-.4*s;let Y=X.vx[G*i+C]*he,U=X.vy[G*i+C]*he;const oe=d.uWheelP.value;for(let ne=-1;ne<=1;ne+=2){const Se=oe.x+_.x*ne*.25*(1-.45*s),ke=oe.y+_.y*ne*.25*(1-.45*s),re=p-Se,Me=y-ke,J=(re*_.x+Me*_.y)/.3,be=(re*k.x+Me*k.y)/.19,De=Math.exp(-(J*J+be*be)*.9),Fe=(w*.262*-be-.05*J)*.3*De,Ce=(w*.262*J-.05*be)*.19*De;Y+=_.x*Fe+k.x*Ce,U+=_.y*Fe+k.y*Ce}const me=p-A.x,Z=y-A.y,$=Math.hypot(me,Z)+1e-4,de=me/$,pe=Z/$,ye=s*We(.02,.12,$),we=.045*(.4+.5/($+.4)),xe=w*.105/($+.4);Y+=ye*(-de*we-pe*xe),U+=ye*(-pe*we+de*xe);const fe=Math.hypot(Y,U);fe>.13&&(Y*=.13/fe,U*=.13/fe);const K=Math.hypot(p,y)||1e-6,R=p/K,O=y/K,r=Math.cos(K),g=Math.sin(K),E=Y*R+U*O,ge=(-Y*O+U*R)*(g/K);return f.set(R*r*E-O*ge,-g*E,O*r*E+R*ge)}const se=new a.Vector3(0,-Math.sin(ae),Math.cos(ae)),ce=new a.Vector3(0,13,0),F=o=>[o.x,o.y,o.z],Le={portalSeat:{position:F(ce),normal:F(se),pitchDeg:14,radius:7},approachDir:[0,Math.sin(ae),-Math.cos(ae)],flyThrough:[290,220,150,90,44,0].map(o=>F(ce.clone().addScaledVector(se,o))),haloMatchDistance:44,moonDir:F(I),wheelDir:F(te),stars:X.stars.map(o=>({dir:F(Ee(o.x,o.y,new a.Vector3)),radius:o.R,spin:o.spin,period:o.period})),riverLevel:l};return{object:H,radius:20,height:34,center:new a.Vector3(0,13,0),anchors:Le,ground:!1,groundY:l,uniforms:d,dome:e,gate:b,mirror:x,makeMirrorMaterial:c,flowAt:ve,setDrain(o,f){s=Math.min(1,Math.max(0,o)),f===void 0?(M=6*s*s,v=.35*s):(M=.9*f,v=.05*f),D()},setSync(o){m=Math.min(1,Math.max(0,o)),D()},setArrive(o){z=Math.min(1,Math.max(0,o)),D()},setProgress(o){z=We(.88,.97,o),this.setDrain(We(.7,.93,o))},update(o,f,p){d.uTime.value=f;const y=w*(f*.1+M*1),C=-w*(f*.13+M*1.3),G=w*(f*.16+M*1.6);d.uSpin4.value.set(y,C,G,-w*f*.07),d.uSpin.value.set(-y,-C,-G),d.uFlow.value=f*.15+v,H.updateMatrixWorld(),d.uL2W.value.setFromMatrix4(H.matrixWorld),p&&(S.setFromMatrixPosition(p.matrixWorld),S.lengthSq()===0&&S.copy(p.position),H.worldToLocal(S),e.position.copy(S))},dispose(){}}}export{Oe as buildHero};
