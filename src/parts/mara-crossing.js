import*as h from"three";import{Geo as Ot}from"../kit/fauna.js";const $t=["#E9B45A","#C7A55E","#9A6A45","#2F2C2B","#F3EDE0","#8FB6D2","#3F6B34"],bt=.95,Pt=8,kt=11,Ut=16,Yt=-44,Dt=r=>r*(.72+.28*r),Jt=r=>.72+.56*r,xt=(r,o,l)=>{const n=Math.min(1,Math.max(0,(l-r)/(o-r)));return n*n*(3-2*n)},Qt={golden:{sun:[-.45,.31,.84],sunC:"#FFD9A0",sunI:2.4,sky:"#8c9fd6",skyI:.62,gnd:"#9A6A45",gndI:.32,lit:null,shade:"#5c4434"},dawn:{sun:[.48,.2,-.85],sunC:"#ffb9a2",sunI:2.3,sky:"#93a8dc",skyI:.75,gnd:"#7a6a70",gndI:.3,lit:"#eeb0a6",shade:"#48587c"},noon:{sun:[-.2,.93,.31],sunC:"#fff0d8",sunI:2,sky:"#a8c4ea",skyI:.95,gnd:"#b08a60",gndI:.55,lit:"#e2c88e",shade:"#8c765a"},dusk:{sun:[-.5,.07,.86],sunC:"#ffae78",sunI:1.15,sky:"#8c7cc0",skyI:.75,gnd:"#80605a",gndI:.3,lit:"#f2b68e",shade:"#584868"}},Bt=`
float h11(float n){ return fract(sin(n * 127.1) * 43758.5453); }
float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float h31(vec3 p3){ p3 = fract(p3 * .1031); p3 += dot(p3, p3.zyx + 31.32); return fract((p3.x + p3.y) * p3.z); }
float vn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(mix(h31(i), h31(i + vec3(1., 0., 0.)), f.x), mix(h31(i + vec3(0., 1., 0.)), h31(i + vec3(1., 1., 0.)), f.x), f.y),
             mix(mix(h31(i + vec3(0., 0., 1.)), h31(i + vec3(1., 0., 1.)), f.x), mix(h31(i + vec3(0., 1., 1.)), h31(i + vec3(1.)), f.x), f.y), f.z); }
float prof(float t){ return t * (.72 + .28 * t); }
float dprof(float t){ return .72 + .56 * t; }
// swimmer track after the splash: L = (xLand, zLand, lateral speed, forward speed), vImp = forward speed at impact
vec2 swimXZ(float d, vec4 L, float vImp){
  float dd = max(d, 0.);
  return vec2(L.x + L.z * (dd - 1.2 * (1. - exp(-dd / 1.2))), L.y + L.w * dd + (vImp * .5 - L.w) * .4 * (1. - exp(-dd / .4)));
}
// thrown water: a ragged sheet that leans, forks and tears into shreds as it ages, and the fine bright drops round it.
// u.x -1..1 across, u.y 0 at the water .. 1 at the top; k = age 0..1; lt = age in seconds
float sprayDrops(vec2 u, float seed, float cells){
  vec2 g = u * cells + seed * 17., c = floor(g), f = g - c; float h = h21(c + seed * 3.1), h2 = h21(c + 7.3 + seed);
  vec2 o = vec2(.25 + .5 * h2, .25 + .5 * fract(h2 * 13.7)); float rr = .1 + .16 * fract(h * 7.1);
  return step(.55, h) * (1. - smoothstep(rr * .5, rr, length(f - o)));
}
float spray(vec2 u, float seed, float k, float lt){
  float n = vn2(u * vec2(4.2, 3.4) + vec2(seed * 19., -lt * 2.2)), n2 = vn2(u * vec2(10., 8.) + vec2(seed * 7., -lt * 4.)), n3 = vn2(u * vec2(1.6, 1.3) + seed * 5.);
  float lean = u.x - (n3 - .5) * 1.1 * u.y, wd = mix(.22, .78, sqrt(max(u.y, 0.)));
  float env = (1. - smoothstep(wd * .35, wd, abs(lean))) * (1. - smoothstep(.3, .92, u.y + (n - .5) * .7)) * smoothstep(0., .05, u.y) * (1. - smoothstep(.8, 1., abs(u.x)));
  float n4 = vn2(u * vec2(23., 19.) + vec2(seed * 3., -lt * 7.));
  float sheet = smoothstep(.6 + .24 * k, .72 + .24 * k, env * (.08 + n * .3 + n2 * .45 + n4 * .45));       // lace, not a slab: holes from the first, shreds at the end
  float reach = 1. - smoothstep(.55, 1., length(vec2(u.x, (u.y - .45) * 1.5)));
  float drops = max(sprayDrops(u, seed, 9.), sprayDrops(u + .37, seed + .5, 15.) * .8) * reach;
  return max(sheet * mix(.66, .36, u.y), drops * .95);
}
`,te=`
void wtrain(vec2 p, vec2 dir, float lam, float steep, float sp, float sd, vec2 dx, vec2 dy, inout vec2 sl){
  float k = 6.2832 / lam, fp = k * (abs(dot(dir, dx)) + abs(dot(dir, dy)));              // phase run per pixel
  float fade = 1. - smoothstep(.7, 2.1, fp); if (fade <= 0.) return;
  float warp = vn2(p * (.62 / lam) + sd * 7.3) * 3.4 + vn2(p * (.21 / lam) - sd * 3.1) * 4.6;      // short crests that bend and break: wind ripple, not corduroy
  float ph = dot(p, dir) * k - uTime * sp * sqrt(9.8 * k) + warp;
  float m = 1.5 * smoothstep(.2, .85, vn2(p * (.27 / lam) + sd * 11.7 + uTime * .05));       // cat's paws: the chop comes in patches, with slicks between
  float c = cos(ph); sl += dir * (steep * m * fade * (c + .35 * cos(2. * ph + .6)));      // peaked crests, flat troughs
}
// slope of the surface at world xz p (agit scales the chop: the churned water under the Fall)
vec2 riverSlope(vec2 p, vec2 dx, vec2 dy, float agit){
  vec2 sl = vec2(0.);
  wtrain(p, vec2(0.993, 0.122), 3.1, 0.03, 0.5, 1., dx, dy, sl);
  wtrain(p, vec2(0.515, 0.857), 1.7, 0.045, 0.55, 2., dx, dy, sl);
  wtrain(p, vec2(0.906, 0.423), 0.93, 0.078, 0.6, 3., dx, dy, sl);
  wtrain(p, vec2(0.342, 0.940), 0.52, 0.15, 0.6, 4., dx, dy, sl);
  wtrain(p, vec2(0.743, 0.669), 0.29, 0.18, 0.65, 5., dx, dy, sl);
  wtrain(p, vec2(0.974, 0.225), 0.16, 0.17, 0.7, 6., dx, dy, sl);
  wtrain(p, vec2(0.616, 0.788), 0.09, 0.13, 0.7, 7., dx, dy, sl);
  // slow boils welling up from the bed
  float e = .2, b0 = vn2(p * .23 + vec2(0., uTime * .11));
  sl += (vec2(vn2((p + vec2(e, 0.)) * .23 + vec2(0., uTime * .11)), vn2((p + vec2(0., e)) * .23 + vec2(0., uTime * .11))) - b0) / e * .22;
  // and the lumps and dimples of a current over an uneven bed, carried along: no two metres of it alike
  float lf = 1. - smoothstep(.2, .8, max(length(dx), length(dy)));
  if (lf > 0.) { vec2 q = p * .61 + vec2(-uTime * .23, uTime * .06); float e2 = .3, c0 = vn2(q); sl += (vec2(vn2(q + vec2(e2, 0.)), vn2(q + vec2(0., e2))) - c0) / e2 * .05 * lf; }
  return sl * agit;
}
float fleckCell(vec2 q, float cell, float sd, float px){
  vec2 g = q / cell, c = floor(g), f = g - c - .5; float h = h21(c + sd), on = step(.6, h), rr = .09 + .14 * fract(h * 9.3);
  vec2 o = (vec2(h21(c + sd + 3.1), h21(c + sd + 7.7)) - .5) * .34;
  float r = length((f - o) * vec2(.72, 1.25)) + (vn2(g * 3.1 + sd) - .5) * .12, aa = px / cell;                // ragged, a little drawn out along the current
  return mix(on * (1. - smoothstep(rr - .05 - aa, rr + .05 + aa, r)), .09, smoothstep(.35, 1.1, aa));          // too small to draw: its mean
}
// foam coverage at f (xz carried with the current: x runs downstream); px = footprint of a pixel in metres
float riverFoam(vec2 f, float px){
  float lane = smoothstep(.54, .8, vn2(f * vec2(.045, .26) + 7.)) * (.55 + .45 * vn2(f * vec2(.21, .9) + 3.));                   // drift lines along the current
  vec2 fr = vec2(f.x * .8 - f.y * .6, f.x * .6 + f.y * .8) + (vec2(vn2(f * .83 + 13.), vn2(f * .83 + 47.)) - .5) * 2.6;
  float raft = smoothstep(.7, .86, vn2(fr * vec2(.3, .5) + 31.)) * smoothstep(.38, .62, vn2(fr * 1.9 + 5.) * .6 + vn2(fr * 4.3 - 9.) * .4);              // and rafts of froth riding down on it: blotches, never lines
  float sparse = smoothstep(.66, .82, vn2(f * .19 + 21.));
  float bub = mix(smoothstep(.3, .62, vn2(f * 21.) * .6 + vn2(f * 47.) * .4), .5, smoothstep(.02, .09, px));                        // close to, a patch is a raft of bubbles
  float fl = fleckCell(f, .34, 0., px) * (.12 + .88 * lane) + fleckCell(f + 3.7, .13, 5., px) * (.06 + .8 * lane) + fleckCell(f - 9.1, .75, 9., px) * lane * .8 * bub;
  fl = fl * (.3 + .7 * max(lane, sparse)) + raft * mix(.2 + .8 * bub, .26, smoothstep(.05, .5, px)) * (1. - .75 * smoothstep(.3, 1.6, px));
  return clamp(fl, 0., 1.) * .8;
}
// the one place the river is allowed to shine: a glancing band under the sun's own quarter (0 away from it, 1 looking into it)
float sunSheen(vec3 V){ vec2 a = normalize(uSun.xz + vec2(1e-4, 0.)); float d = dot(a, -V.xz / max(length(V.xz), 1e-3)); return smoothstep(.6, .97, d); }
// N: surface normal, V: to the eye, refl: what the surface mirrors there, sh: shadow lying on it (0..1), foam: coverage
// f: xz carried with the current (the silt lies in streaks along it); bank: 0..1 close under a cut bank (dark there: the bank's own shade and wet earth)
// The river is milk tea: silt lit from within. Under the lens it mirrors little; the further off and the more glancing the look, the more
// of the pale sky lies on it, and in the band under the sun it shines.
vec3 riverColor(vec3 N, vec3 V, float dist, vec3 refl, float sh, float foam, vec2 f, float bank){
  float sheen = sunSheen(V) * (1. - .85 * bank);
  float far = smoothstep(3., 42., dist) * (1. - .7 * bank);
  float cv = clamp(dot(N, V), 0., 1.), fres = min(.04 + .96 * pow(1. - cv, 5.), .22 + .2 * far + .34 * sheen);
  float flat0 = max(uSun.y, .06), relief = clamp(max(dot(N, uSun), 0.) / flat0, 0., 1.9);                     // 1 on flat water
  float silt = vn2(f * vec2(.021, .1) + 3.7) * .6 + vn2(f * vec2(.085, .34) - 11.) * .4;                     // thick mud and thin, drawn out by the current
  vec3 tea = uTea * vec3(1., .81, .62) * mix(vec3(.7, .68, .66), vec3(1.1, 1.06, .98), smoothstep(.3, .7, silt)) * (1. - .5 * bank);
  vec3 body = tea * (uSunC * flat0 * mix(.6 + .4 * relief, 1., .55 * smoothstep(5., 36., dist)) * (1. - .75 * sh) * .85 + uSkyC * .9 + uGndC * .2);      // far off the relief is lost
  vec3 rf = refl * mix(vec3(.8, .58, .37), vec3(1.), max(sheen, .6 * far)) * (1. - .4 * bank);                             // away from the sun what it mirrors is seen through the silt
  vec3 col = mix(body, rf * (1. - .35 * sh), fres);
  col = mix(col, uFoam * (uSunC * (.3 + .14 * relief) * (1. - .6 * sh) + uSkyC), foam);
  vec3 Hh = normalize(uSun + V); float ng = max(dot(N, Hh), 0.), fk = smoothstep(4., 70., dist);
  col += uSunC * pow(ng, mix(240., 46., fk)) * mix(1.5, .6 * (.1 + .9 * sheen), fk) * (1. - sh) * (1. - foam);       // glints near; far off a glitter path, and only under the sun
  return col;
}
// a swimmer's wake, in the frame of its quad: a = 0 on the axis .. 1 at the edge, b = 0 ahead of the chest .. 1 at the tail of the wake.
// A solid foam collar round neck and shoulders, churn close astern, and a V of broken foam patches: never two rails.
float wakeFoam(float a, float b, float sd, vec2 uv){
  float n = vn2(uv * 4.5 + sd * 13.), n2 = vn2(uv * 11. - sd * 7.), n3 = vn2(uv * vec2(19., 27.) + sd * 29.);
  float cl = length(vec2(a * 1.15, (b - .2) * 4.2)), collar = exp(-((cl - .4) / .2) * ((cl - .4) / .2)) * (.72 + .28 * smoothstep(.25, .6, n2));
  float ac = .12 + .78 * b + (vn2(vec2(b * 6., sd * 31.)) - .5) * .2;
  float pch = smoothstep(.5, .66, n * .45 + n2 * .35 + n3 * .3) * (1. - smoothstep(.6, 1., b));
  float arm = exp(-((a - ac) / .12) * ((a - ac) / .12)) * smoothstep(.16, .3, b) * pch;
  float churn = (1. - smoothstep(0., .16 + .34 * b, a)) * (1. - b) * (1. - b) * smoothstep(.14, .26, b) * smoothstep(.42, .7, n * .55 + n3 * .5);
  float raw = clamp(collar * .95 + arm * .8 + churn * .6, 0., 1.);
  float tex = .45 + .75 * (vn2(uv * 23. + sd * 5.) * .6 + vn2(uv * 51. - sd * 3.) * .4);       // rafts of bubbles with water showing through, not a white glow
  return smoothstep(.42, .62, raw * tex) * (.75 + .25 * raw);
}
`,re=`
uniform sampler2D tCloud; uniform vec4 uTCloud;
float cloudSun(vec2 xz){ return 1. - uTCloud.w * smoothstep(.46, .66, texture2D(tCloud, xz * uTCloud.z + uTCloud.xy).r); }
`,Vt=`
#ifdef USE_FOG
  #define FOGD vFogDepth
#else
  #define FOGD 0.
#endif
float fogAt(float depth){
#ifdef USE_FOG
  #ifdef FOG_EXP2
    return 1. - exp(-fogDensity * fogDensity * depth * depth);
  #else
    return smoothstep(fogNear, fogFar, depth);
  #endif
#else
  return 0.;
#endif
}
vec3 fogMix(vec3 c, float depth){
#ifdef USE_FOG
  return mix(c, fogColor, fogAt(depth));
#else
  return c;
#endif
}
`,ee=`
uniform vec4 uSh[${Ut}];
float leapShadow(vec3 p){
  float sh = 0.;
  for (int i = 0; i < ${Ut}; i++) {
    vec4 s = uSh[i];
    vec3 w = p - s.xyz; float k = -dot(w, uSun);
    vec3 wp = w + uSun * k;
    vec3 ax = vec3(0., -sin(s.w), cos(s.w)); vec3 axp = ax - uSun * dot(ax, uSun);
    float t = clamp(dot(wp, axp) / max(dot(axp, axp), 1e-4), -.8, .8);
    float dist = length(wp - axp * t), soft = .22 + k * .03;
    sh = max(sh, (1. - smoothstep(.46 - soft * .5, .46 + soft, dist)) * step(.05, k) * (1. - smoothstep(20., 34., k)));
  }
  return sh;
}
`,Et=`
uniform vec3 uPB, uPBox; uniform vec2 uPL, uPY; uniform float uPDen;
vec3 dustShear(vec3 p){ return vec3(p.x - uPB.x - uPL.x * (p.y - uPB.y), p.y, p.z - uPB.z - uPL.y * (p.y - uPB.y)); }
vec3 dustShearDir(vec3 d){ return vec3(d.x - uPL.x * d.y, d.y, d.z - uPL.y * d.y); }
float dustRad(vec3 q, float h){ vec2 rr = mix(vec2(uPBox.x * .8, 17.), vec2(uPBox.x * .7, 22.), h) * (1. + .14 * sin(h * 9. + 1.)); return 1. - length(vec2(q.x + 7. * h * sin(h * 4.6 + .6), q.z + 5.) / rr); }
float dustEnv(vec3 q){
  float hh = (q.y - uPB.y) / (uPY.y - uPB.y), h = clamp(hh, 0., 1.);
  return smoothstep(0., .55, dustRad(q, h)) * smoothstep(-.015, .03, hh) * (1. - smoothstep(.55, 1., h)) * mix(.55, 1., smoothstep(0., .25, h));
}
vec2 dustSpan(vec3 roq, vec3 rdq){
  vec3 sd = vec3(rdq.x < 0. ? -1. : 1., rdq.y < 0. ? -1. : 1., rdq.z < 0. ? -1. : 1.), inv = sd / max(abs(rdq), vec3(1e-5));
  vec3 t0 = (vec3(-uPBox.x, uPY.x, -uPBox.y) - roq) * inv, t1 = (vec3(uPBox.x, uPY.y, uPBox.z) - roq) * inv, a = min(t0, t1), b = max(t0, t1);
  return vec2(max(max(a.x, a.y), max(a.z, 0.)), min(b.x, min(b.y, b.z)));
}
vec3 dustLitC(){ return uDustLit * (.62 + .24 * uSunC); }
vec3 dustShadeC(){ return uDustShade * (1.3 + uSkyC * .8); }
vec4 dustVeil(vec3 p, vec3 cam){
  vec3 rd = p - cam; float dist = max(length(rd), 1e-3); rd /= dist;
  vec3 roq = dustShear(cam), rdq = dustShearDir(rd), sq = dustShearDir(uSun);
  vec2 sp = dustSpan(roq, rdq); sp.y = min(sp.y, dist);
  if (sp.y <= sp.x) return vec4(0.);
  float dl = (sp.y - sp.x) / 4., tau = 0., lit = 0.;
  for (int i = 0; i < 4; i++) {
    vec3 q = roq + rdq * (sp.x + (float(i) + .5) * dl); float e = dustEnv(q);
    tau += e; lit += e * exp(-(dustEnv(q + sq * 9.) + dustEnv(q + sq * 24.) * 1.5) * 1.4);
  }
  return vec4(mix(dustShadeC(), dustLitC(), lit / max(tau, 1e-3)), 1. - exp(-tau * dl * uPDen * .5));
}
`,ae=[1.29,.96],qt=1.2,le={w:{lv:1.28,pitch:-.07,head:-.62,neck:-.3,flat:.75},z:{lv:1.33,pitch:-.12,head:-.5,neck:-.42,flat:.5}};function oe(r,o="w",l=null){const n=le[o],e=r.attributes.position,i=r.attributes.normal,w=r.attributes.aAnim,s=r.attributes.aPivot,p=r.attributes.aCrest,f=e.count,d=l||r.userData.poll||ae,y=new Float32Array(f*3),S=new Float32Array(f*3),g=r.userData.beard||null,U=(a,q,W)=>[a*Math.cos(W)-q*Math.sin(W),q*Math.cos(W)+a*Math.sin(W)];for(let a=0;a<f;a++){let q=e.getX(a),W=e.getY(a),A=e.getZ(a),V=i.getY(a),N=i.getZ(a);const z=w.getZ(a),Q=i.getX(a);if(p&&(W-=p.getX(a)*n.flat),g&&a>=g[0]&&a<g[1]&&p&&p.getX(a)<0&&(A-=.09),z>1.5&&z<2.5){let K=n.head*Math.min(w.getW(a),1),B=U(W-d[0],A-d[1],K);W=d[0]+B[0],A=d[1]+B[1],B=U(V,N,K),V=B[0],N=B[1],K=n.neck*w.getX(a),B=U(W-s.getY(a),A-s.getZ(a),K),W=s.getY(a)+B[0],A=s.getZ(a)+B[1],B=U(V,N,K),V=B[0],N=B[1]}let E=U(W-bt,A,n.pitch);W=bt+E[0]+(qt-n.lv),A=E[1],E=U(V,N,n.pitch),g&&a>=g[0]&&a<g[1]&&p&&p.getX(a)<0&&W<qt+.09&&(q=q*2.2+Math.sign(q)*.04*(qt+.09-W)/.1,W=qt+.09),y[a*3]=q,y[a*3+1]=W,y[a*3+2]=A,S[a*3]=Q,S[a*3+1]=E[0],S[a*3+2]=E[1]}return r.setAttribute("aSwim",new h.BufferAttribute(y,3)),r.setAttribute("aSwimN",new h.BufferAttribute(S,3)),p&&r.deleteAttribute("aCrest"),r}const Lt={floor:.082,spec1:.24,spec2:.03,sheen:.03,sheenUp:.03,sheenAll:.01,sheenShade:.03,dark:[.92,.82]};function ie(r,o=!1,l=!1){const n=o===2,e=new Ot,i=u=>new h.Color(u),w=(u,v,G)=>new h.Color(u,v,G),s=w(.094,.087,.083),p=w(.04,.037,.035),f=w(.02,.019,.02),d=w(.032,.03,.03),y=w(.075,.066,.058),S=w(.15,.115,.08),g=i(r[4]).multiplyScalar(.62),U=w(.2,.185,.16),a=w(.012,.01,.009),q=w(.006,.005,.005),W=u=>{if(!l)return u;const v=[],G=R=>u[Math.min(u.length-1,Math.max(0,R))];for(let R=0;R<u.length;R++)if(v.push(u[R]),R<u.length-1){const Y=G(R-1),b=G(R),lt=G(R+1),zt=G(R+2),dt={};for(const ft of["z","y","rx","ry"])dt[ft]=Math.max(ft==="rx"||ft==="ry"?.001:-9,(-Y[ft]+9*b[ft]+9*lt[ft]-zt[ft])/16);(b.rx===0||lt.rx===0)&&(dt.rx=Math.max(b.rx,lt.rx)*.72,dt.ry=Math.max(b.ry,lt.ry)*.72,dt.z=(b.z+lt.z)/2,dt.y=(b.y+lt.y)/2),v.push(dt)}return v},A=e.loft(W([{z:-.82,y:1.02,rx:0,ry:0},{z:-.74,y:1,rx:.12,ry:.13},{z:-.56,y:.975,rx:.2,ry:.215},{z:-.26,y:.95,rx:.235,ry:.245},{z:.04,y:.96,rx:.25,ry:.285},{z:.28,y:1,rx:.25,ry:.36},{z:.46,y:1.03,rx:.215,ry:.355},{z:.6,y:1.03,rx:.15,ry:.27},{z:.7,y:1.02,rx:0,ry:0}].filter((u,v)=>!o||v!==1&&v!==3&&(!n||v!==5&&v!==7))),{sides:n?4:o?5:l?14:8,top:s,belly:p,shade:[-.7,.1]});e.glow(A,1),e.paint(A,(u,v,G,R)=>{const Y=Math.max(0,1-Math.abs(G+.1)/.5)*Math.max(0,Math.min(1,(v-.95)/.25));R.lerp(w(.15,.14,.132),.5*Y),G>.25&&R.lerp(p,.45*Math.max(0,Math.min(1,(1.12-v)/.3)))});const V=(u,v,G)=>{const R=G?.9:.85,Y=u*(G?.125:.13),b=R*.5,lt=G?[[Y,1.02,v],[Y,.84,v],[Y,b+.05,v+.012],[Y,b,v+.016],[Y,.13,v],[Y,.065,v+.008],[Y,.03,v+.02],[Y,0,v+.028]]:[[Y,1,v+.03],[Y,.8,v-.02],[Y,b+.05,v-.07],[Y,b,v-.08],[Y,.13,v-.03],[Y,.065,v-.02],[Y,.03,v-.005],[Y,0,v+.005]],zt=G?[.085,.07,.042,.047,.028,.034,.044,.05]:[.115,.095,.046,.05,.028,.034,.044,.05],dt=(Mt,D)=>!o||D===0||D===1&&!n||D===3||D===4&&!n||D===7,ft=e.tube(lt.filter(dt),zt.filter(dt),o?3:l?6:4,y,S);e.anim(ft,(Mt,D)=>[0,Math.min(1,Math.max(0,(R-D)/R)),1,0]),e.pivot(ft,Y,R,v),e.paint(ft,(Mt,D,yt,Ct)=>{D<.05?Ct.copy(q):D>.62&&Ct.lerp(s,Math.min(1,(D-.62)/.2))}),e.glow(ft,(Mt,D)=>D>.7?1:0)};V(-1,.42,!0),V(1,.42,!0),V(-1,-.5,!1),V(1,-.5,!1);const N=[0,1.13,.52],z=.3,Q=.44,E=e.n,K=[],B=[],F=l?6:n?2:4;for(let u=0;u<=F;u++){const v=u/F;K.push([0,N[1]-.08*(1-v)+Math.sin(z)*Q*v,N[2]+Math.cos(z)*Q*v]),B.push(.2-.075*Math.pow(v,.8))}e.glow(e.tube(K,B,n?4:o?5:l?10:7,s,s.clone().lerp(f,.45),{flatten:.74}),1);const L=[[0,1.36,.2],[0,1.385,.42],...K.slice(1).map((u,v)=>[0,u[1]+B[v+1]*.95,u[2]-.03])];n||e.strip(L,L.map((u,v)=>[0,u[1]+(v===0?.03:.11),u[2]-.03]),f,f);const T=K[F],Z=.98,$=e.n,_=u=>{const v=u[1],G=u[2];return[u[0],v*Math.cos(Z)-G*Math.sin(Z)+T[1]+.03,v*Math.sin(Z)+G*Math.cos(Z)+T[2]+.02]};if(e.loft(W([{z:-.14,y:.01,rx:0,ry:0},{z:-.07,y:.01,rx:.085,ry:.1},{z:.08,y:.012,rx:.1,ry:.115},{z:.25,y:0,rx:.082,ry:.098},{z:.4,y:-.012,rx:.086,ry:.082},{z:.49,y:-.02,rx:.074,ry:.062},{z:.53,y:-.025,rx:0,ry:0}].filter((u,v)=>!o||v!==2&&v!==5&&(!n||v!==3))),{sides:n?3:o?4:l?9:6,top:d,belly:d.clone().lerp(s,.3),shade:[-.6,0]}),l)for(const u of[-1,1])e.blob(u*.088,.055,.1,.022,.026,.034,w(.16,.13,.1),f,5,3),e.blob(u*.045,.02,.5,.02,.016,.03,f,f,4,3);e.move([$,e.n],u=>{const v=_([u.x,u.y,u.z]);u.set(v[0],v[1],v[2])});const j=e.n;for(const u of[-1,1]){const v=e.tube([[u*.04,.1,0],[u*.16,.085,.01],[u*.26,.07,.02],[u*.31,.15,.02],[u*.275,.27,0],[u*.22,.33,-.01]].filter((G,R)=>!n||R%2===0||R===5).map(_),[.05,.043,.034,.026,.016,0].filter((G,R)=>!n||R%2===0||R===5),o?3:l?6:4,U,a);e.anim(v,()=>[1,0,2,2]),o||e.fan([[u*.07,.07,-.05],[u*.22,.03,-.1],[u*.11,0,-.04]].map(_),s,f)}const mt=e.n,ht=[];for(const u of n?[]:[-1,1]){const v=[[u*.02,-.07,.34],[u*.03,-.09,.14],[u*.03,-.1,-.02]].map(_).concat([[u*.03,K[F>>1][1]-B[F>>1],K[F>>1][2]],[u*.03,K[0][1]-B[0]+.03,K[0][2]+.04]]),G=[.09,.2,.25,.22,.1];ht.push(e.strip(v,v.map((R,Y)=>[R[0]+u*.06,R[1]-G[Y],R[2]+.02]),g.clone().lerp(s,.3),g))}for(let u=E;u<e.n;u++){const v=Math.min(1,Math.max(0,((e.p[u*3+2]-N[2])*Math.cos(z)+(e.p[u*3+1]-N[1])*Math.sin(z))/(Q*.6)));e.a[u*4]=u>=$?1:v,e.a[u*4+2]=2,e.pv[u*3]=0,e.pv[u*3+1]=N[1]-.1,e.pv[u*3+2]=N[2],u>=$&&u<mt&&e.a[u*4+3]<1.5&&(e.a[u*4+3]=1)}for(const u of ht)for(let v=u[0];v<u[1];v++)v-u[0]>>1<3&&(e.a[v*4+3]=1),e.g[v]=2;const X=1.13,st=-.8,J=e.n;e.tube([[0,X,st],[0,X-.12,st-.08],[0,X-.36,st-.1],[0,X-.56,st-.09]].filter((u,v)=>!n||v!==1),[.03,.022,.018,.016].filter((u,v)=>!n||v!==1),o?3:4,s,f);const tt=[[0,X-.3,st-.07],[0,X-.5,st-.05],[0,X-.74,st-.05]];return e.strip(tt,tt.map((u,v)=>[0,u[1]-.03,u[2]-[.05,.11,.07][v]]),f,f),o||e.strip(tt.map(u=>[.03,u[1],u[2]-.03]),tt.map((u,v)=>[-.03,u[1]-.04,u[2]-.03-[0,.03,.02][v]]),f,f),e.anim([J,e.n],(u,v)=>[0,Math.min(1,Math.max(0,(X-v)/.75)),3,0]),e.pivot([J,e.n],0,X,st),oe(e.build(),"w",ae)}function Ht(r,o,l,n,e,i=[-.55,.35]){const w=r.n,s=[],p=new h.Color;for(const f of o){const d=f.cT||n,y=f.cB||e;if(!(f.w>1e-5)){p.copy(d).lerp(y,.5),s.push([r.v(0,(f.top+f.bot)/2,f.z,p)]);continue}const S=[],g=f.bot+(f.top-f.bot)*f.wy;for(let U=0;U<l;U++){const a=U/l*Math.PI*2,q=Math.cos(a),W=Math.sin(a),A=f.w*Math.sign(W)*Math.pow(Math.abs(W),2/f.nx),V=q>=0?g+(f.top-g)*Math.pow(q,2/f.nt):g-(g-f.bot)*Math.pow(-q,2/2.2),N=Math.min(1,Math.max(0,(q-i[0])/(i[1]-i[0])));p.copy(y).lerp(d,N*N*(3-2*N)),S.push(r.v(A,V,f.z,p))}s.push(S)}for(let f=0;f<s.length-1;f++){const d=s[f],y=s[f+1];if(!(d.length===1&&y.length===1))for(let S=0;S<l;S++){const g=(S+1)%l;d.length===1?r.tri(d[0],y[S],y[g]):y.length===1?r.tri(d[S],y[0],d[g]):r.quad(d[S],y[S],y[g],d[g])}}return[w,r.n]}const ce=r=>({z:r[0],top:r[1],bot:r[2],w:r[3],wy:r[4]??.5,nt:r[5]??2,nx:r[6]??2});function jt(r,o){let l=r.map(ce);if(o<1.2)l=l.filter((n,e)=>e<2||e>l.length-3||e%2===0);else if(o>=2){const n=[],e=i=>l[Math.min(l.length-1,Math.max(0,i))];for(let i=0;i<l.length&&(n.push(l[i]),!(i>=l.length-1));i++){const w=e(i-1),s=e(i),p=e(i+1),f=e(i+2),d={};if(!(s.w===0||p.w===0)){for(const y of["z","top","bot","w","wy","nt","nx"])d[y]=(-w[y]+9*s[y]+9*p[y]-f[y])/16;if(w.w===0||f.w===0)for(const y of["top","bot","w","wy","nt","nx"])d[y]=(s[y]+p[y])/2;d.z=(s.z+p.z)/2,n.push(d)}}l=n}return l}function ue(r,o,l,n,e,i){const w=r.n,s=[];for(let f=0;f<o.length;f++){const d=o[f],y=[];for(let S=0;S<e;S++){const g=S/e*Math.PI*2;y.push(r.v(d[0]+Math.cos(g)*l[f],d[1],d[2]+Math.sin(g)*n[f],i[f]))}s.push(y)}for(let f=0;f<o.length-1;f++)for(let d=0;d<e;d++){const y=(d+1)%e;r.quad(s[f][d],s[f][y],s[f+1][y],s[f+1][d])}const p=r.v(o[o.length-1][0],o[o.length-1][1]-.004,o[o.length-1][2],i[o.length-1]);for(let f=0;f<e;f++)r.tri(s[o.length-1][f],s[o.length-1][(f+1)%e],p);return[w,r.n]}const he={w:{body:[[-.86,1.1,1.1,0],[-.83,1.15,1,.065],[-.76,1.175,.86,.14,.5],[-.66,1.19,.76,.185,.46],[-.54,1.2,.72,.212,.45],[-.42,1.205,.73,.222,.5],[-.3,1.21,.77,.215,.52],[-.18,1.22,.76,.226,.52],[-.06,1.24,.71,.246,.5],[.06,1.27,.655,.264,.5],[.17,1.315,.61,.276,.5,1.9],[.27,1.37,.585,.278,.48,1.7],[.36,1.415,.575,.268,.46,1.5],[.45,1.425,.585,.248,.45,1.45],[.53,1.39,.62,.218,.45,1.5],[.61,1.32,.69,.172,.45,1.7],[.68,1.23,.78,.11,.5],[.73,1,1,0]],neck:{base:[1.14,.5],ang:.3,len:.47,rings:[[-.12,.22,-.3,.14],[0,.205,-.28,.135],[.1,.19,-.25,.125,.5,1.7],[.2,.172,-.22,.115,.5,1.6],[.3,.155,-.19,.106,.5,1.6],[.4,.14,-.165,.098,.5,1.7],[.48,.125,-.145,.092,.5,1.8]]},head:{pitch:.98,off:[.03,.02],s:.84,rings:[[-.15,.03,.01,0],[-.11,.098,-.07,.076,.5,2.6,2.4],[-.035,.128,-.128,.108,.58,3.2,2.8],[.06,.13,-.165,.116,.64,3.4,3],[.15,.124,-.16,.098,.62,3.4,3],[.25,.114,-.118,.074,.58,3.4,3],[.35,.104,-.088,.064,.52,3.4,3],[.44,.094,-.074,.076,.5,3.4,3.2],[.52,.082,-.07,.093,.5,3.4,3.4],[.575,.066,-.064,.091,.5,3.4,3.4],[.604,.03,-.042,.066,.5,2.8,3],[.615,-.006,-.006,0]]},horn:{pts:[[.035,.105,0],[.12,.108,.004],[.2,.092,.01],[.265,.075,.018],[.315,.09,.022],[.345,.15,.02],[.345,.225,.008],[.318,.295,-.008],[.275,.345,-.022],[.235,.375,-.03]],r:[.054,.05,.044,.038,.033,.027,.021,.015,.009,0]},ear:[[.088,.03,-.075],[.105,.08,-.09],[.21,.07,-.13],[.31,-.012,-.165],[.225,-.05,-.135],[.11,-.016,-.082]],crest:{from:.2,h:[.06,.088],hang:.24},beard:1,tail:{y:1.16,z:-.83,len:.72,tuft:.46,r:.03},legF:{x:.125,z:.42,jy:.9,k:1},legH:{x:.13,z:-.5,jy:.85,k:1},bumps:[[.4,1.02,.2,.3,.04],[.43,.78,.11,.13,.022],[-.52,.94,.22,.28,.036],[-.36,1.13,.075,.07,.022],[.16,.98,.1,.25,-.012],[-.22,1,.11,.2,-.02],[-.7,1,.1,.16,.014]]},z:{body:[[-.8,1.17,1.17,0],[-.77,1.225,1.03,.08],[-.7,1.272,.87,.17],[-.6,1.3,.77,.228,.46],[-.48,1.314,.725,.254,.46],[-.34,1.31,.715,.26],[-.2,1.296,.705,.264],[-.06,1.286,.695,.27],[.08,1.286,.695,.27],[.2,1.3,.7,.264],[.32,1.32,.712,.25,.5,1.8],[.42,1.326,.735,.228,.5,1.8],[.51,1.3,.775,.19],[.58,1.24,.835,.14],[.64,1.03,1.03,0]],neck:{base:[1.12,.43],ang:.84,len:.6,rings:[[-.14,.2,-.26,.125],[0,.175,-.225,.118],[.12,.155,-.19,.108],[.24,.138,-.165,.098],[.36,.124,-.145,.09],[.48,.112,-.128,.083],[.61,.1,-.115,.076]]},head:{pitch:1.12,off:[.02,0],s:1,rings:[[-.13,.02,.02,0],[-.09,.08,-.075,.066],[-.02,.105,-.11,.09],[.07,.108,-.125,.098,.55],[.17,.096,-.12,.09,.55],[.28,.082,-.1,.074,.55],[.38,.072,-.082,.064,.5],[.46,.066,-.072,.066,.5,2.2,2.5],[.52,.056,-.064,.064,.5,2.2,2.5],[.555,.03,-.045,.045,.5],[.57,-.006,-.006,0]]},horn:null,ear:[[.06,.085,-.06],[.075,.17,-.1],[.085,.235,-.125],[.115,.165,-.1],[.105,.085,-.05]],crest:{from:.34,h:[.085,.1],hang:0},beard:0,tail:{y:1.25,z:-.77,len:.62,tuft:.34,r:.026},legF:{x:.13,z:.4,jy:.9,k:1.12},legH:{x:.135,z:-.5,jy:.85,k:1.12},bumps:[[.38,1.04,.2,.28,.03],[-.5,1,.22,.28,.038],[-.2,1.02,.1,.2,-.012],[-.68,1.04,.1,.16,.016]]}};function ne(r,o="w",l=2){const n=he[o],e=o==="z",i=l>=2,w=l<1,s=new Ot,p=(c,x,M)=>new h.Color(c,x,M),f=[],d=e?p(.74,.72,.67):p(.09,.083,.079),y=e?d:p(.125,.117,.11),S=e?p(.6,.58,.54):p(.036,.033,.031),g=p(.016,.015,.015),U=e?p(.66,.64,.6):p(.026,.024,.023),a=e?p(.7,.68,.63):p(.066,.057,.05),q=e?p(.66,.64,.6):p(.115,.092,.07),W=p(.008,.007,.007),A=new h.Color(r[4]).multiplyScalar(.6),V=p(.17,.16,.14),N=p(.012,.01,.009),z=e?p(.03,.027,.026):g,Q=e?d:g,E=(c,x,M)=>c+(x-c)*M,K=c=>{const x=n.body;for(let M=0;M<x.length-1;M++)if(c<=x[M+1][0]){const C=Math.max(0,(c-x[M][0])/(x[M+1][0]-x[M][0]));return E(x[M][1],x[M+1][1],C*C*(3-2*C))}return x[x.length-1][1]},B=Ht(s,jt(n.body,Math.min(l,1.5)),i?12:w?6:8,d,S,[-.8,0]);s.glow(B,1),s.move(B,c=>{let x=0;for(const M of n.bumps){const C=(c.z-M[0])/M[2],H=(c.y-M[1])/M[3];x+=M[4]*Math.exp(-(C*C+H*H))}c.x+=Math.sign(c.x)*x*Math.min(1,Math.abs(c.x)/.1)}),e||s.paint(B,(c,x,M,C)=>{const H=K(M),ot=Math.min(1,Math.max(0,(x-.92)/.25));C.lerp(y,.6*Math.max(0,1-Math.abs(M+.12)/.55)*ot),M>.2&&C.lerp(S,.5*Math.min(1,Math.max(0,(1.1-x)/.32))),M<-.55&&C.lerp(S,.4*Math.min(1,(-.55-M)/.25)),C.lerp(g,.55*Math.max(0,1-Math.abs(c)/.05)*Math.max(0,1-(H-x)/.05))});const F=(c,x,M)=>{const C=c*x.x,H=x.z,ot=x.jy,vt=x.k,et=ot*.5;let at=M?[[1.03,.012,.072,.098],[.88,.006,.064,.09],[.74,0,.052,.07],[.6,.006,.041,.052],[et+.045,.014,.039,.046],[et,.018,.041,.047],[et-.045,.012,.034,.039],[.3,.004,.026,.031],[.17,0,.024,.029],[.105,-.004,.032,.037],[.065,.004,.029,.033],[.04,.014,.036,.043],[0,.024,.04,.05]]:[[1.02,.04,.085,.14],[.87,.01,.075,.125],[.72,-.025,.058,.094],[.58,-.055,.044,.064],[et+.045,-.078,.039,.056],[et,-.086,.04,.054],[et-.05,-.074,.031,.038],[.27,-.05,.026,.031],[.16,-.036,.024,.029],[.105,-.03,.032,.037],[.065,-.02,.029,.033],[.04,-.006,.036,.043],[0,.005,.04,.05]];i||(at=at.filter((it,pt)=>pt!==1&&pt!==4&&pt!==6&&pt!==8&&pt!==10&&!(w&&(pt===3||pt===11))));const gt=at.map(it=>it[0]<.05?W:it[0]>.62?d.clone().lerp(S,e?0:.35):a.clone().lerp(q,Math.min(1,Math.max(0,(.5-it[0])/.3)))),nt=ue(s,at.map(it=>[C,it[0],H+it[1]]),at.map(it=>it[2]*vt),at.map(it=>it[3]*vt),i?6:w?3:4,gt);s.anim(nt,(it,pt)=>[0,Math.min(1,Math.max(0,(ot-pt)/ot)),1,0]),s.pivot(nt,C,ot,H),s.glow(nt,(it,pt)=>e||pt>.7?1:0)};F(-1,n.legF,!0),F(1,n.legF,!0),F(-1,n.legH,!1),F(1,n.legH,!1);const L=n.neck,T=L.ang,Z=Math.cos(T),$=Math.sin(T),_=L.base,j=c=>[c[0],_[0]+c[1]*Z+c[2]*$,_[1]+c[2]*Z-c[1]*$],mt=(c,x)=>{for(const M of i?[-1,1]:[0]){const C=[],H=[],ot=[];c.forEach((et,at)=>{const gt=at===0||at===c.length-1,nt=gt?.02:n.crest.h[at%2]*(.85+.3*(at*.618%1));ot.push(nt),C.push([M*.014,et[1]-.012,et[2]]),H.push([M*(e?.012:.022+.02*(at%2)),et[1]+nt,et[2]-nt*(e?.1:.3)])});const vt=s.strip(C,H,Q,Q);for(let et=0;et<c.length;et++)f.push([vt[0]+et*2+1,ot[et]+.012]);e&&s.glow(vt,1)}},ht=[];for(let c=n.crest.from;c<_[1]-.02;c+=i?.032:.08)ht.push([0,K(c),c]);ht.push([0,K(_[1]),_[1]]),mt(ht,0);const X=s.n,st=jt(L.rings,Math.min(l,1.5)),J=Ht(s,st,i?10:w?5:6,d,e?S:d.clone().lerp(g,.55),[-.7,.2]);s.glow(J,1);const tt=c=>{const x=L.rings;for(let C=0;C<x.length-1;C++)if(c<=x[C+1][0]){const H=Math.max(0,(c-x[C][0])/(x[C+1][0]-x[C][0]));return[E(x[C][1],x[C+1][1],H),E(x[C][3],x[C+1][3],H)]}const M=x[x.length-1];return[M[1],M[3]]},u=[];for(let c=.03;c<=L.len+.001;c+=i?.034:.09)u.push([0,tt(c)[0],c]);if(s.move(J,c=>{const x=j([c.x,c.y,c.z]);c.set(x[0],x[1],x[2])}),mt(u.map(j),2),n.crest.hang>0&&i)for(const c of[-1,1]){const x=[],M=[];u.forEach((C,H)=>{const ot=tt(C[2])[1],vt=n.crest.hang*(H%2?1:.93)*(.45+.55*Math.sin(Math.PI*Math.min(1,(H+.7)/u.length)));x.push(j([c*.02,C[1]-.01,C[2]])),M.push(j([c*(ot+.018),C[1]-.06-vt,C[2]-.03]))}),s.strip(x,M,g,g)}const v=j([0,0,L.len]),G=n.head.pitch,R=s.n,Y=c=>[c[0],c[1]*Math.cos(G)-c[2]*Math.sin(G)+v[1]+n.head.off[0],c[1]*Math.sin(G)+c[2]*Math.cos(G)+v[2]+n.head.off[1]],b=n.head.s,lt=Ht(s,jt(n.head.rings.map(c=>[c[0]*b,c[1]*b,c[2]*b,c[3]*b,c[4],c[5],c[6]]),Math.min(l,1.5)),i?12:w?5:7,U,e?U:U.clone().lerp(d,.3),[-.6,.1]);if(e)s.glow(lt,1),s.paint(lt,(c,x,M,C)=>{C.lerp(z,Math.min(1,Math.max(0,(M-.4)/.08)))});else{const c=p(.085,.058,.04),x=p(.05,.046,.044),M=p(.06,.055,.052);s.move(lt,C=>{const H=C.z/b,ot=C.y/b,vt=Math.abs(C.x)/b,et=Math.max(0,Math.min(1,(ot-.02)/.06)),at=Math.exp(-(((H-.05)/.06)**2))*et,gt=Math.exp(-(((H-.3)/.1)**2))*Math.max(0,1-Math.abs(ot)/.08),nt=Math.exp(-(((H-.55)/.04)**2))*et,it=Math.min(1,vt/.04);C.x+=Math.sign(C.x)*b*it*(.014*at-.012*gt+.01*nt),C.y+=b*.008*at*it}),s.paint(lt,(C,H,ot,vt)=>{const et=ot/b,at=H/b;vt.lerp(c,.75*Math.max(0,1-Math.abs(et-0)/.12)*Math.max(0,Math.min(1,(at-.03)/.06))),vt.lerp(M,.6*Math.max(0,1-Math.abs(et-.1)/.12)*Math.max(0,Math.min(1,(.02-at)/.08))),vt.lerp(x,.8*Math.max(0,Math.min(1,(et-.46)/.06)))})}if(!w)for(const c of[-1,1]){const x=e?s.blob(c*.088,.05*b,.1*b,.022,.026,.034,p(.16,.13,.1),g,5,3):s.blob(c*.101*b,.066*b,.085*b,.03,.03,.038,p(.05,.035,.025),g,i?7:5,i?4:3);s.glow(x,-1),e?s.blob(c*.045*b,.02*b,.53*b,.02,.016,.03,g,g,4,3):i&&s.blob(c*.056*b,.04*b,.565*b,.026,.017,.034,g,g,5,3)}n.horn&&!w&&s.blob(0,.112*b,-.018*b,.1*b,.034*b,.07*b,V.clone().multiplyScalar(.8),V.clone().multiplyScalar(.45),i?8:5,i?4:3),s.move([R,s.n],c=>{const x=Y([c.x,c.y,c.z]);c.set(x[0],x[1],x[2])});for(const c of[-1,1]){if(n.horn){const C=s.tube(n.horn.pts.filter((H,ot)=>i||ot%2===0||ot===9).map(H=>Y([c*H[0]*b*1.02,H[1]*b*.98,H[2]*b])),n.horn.r.filter((H,ot)=>i||ot%2===0||ot===9).map(H=>H*.92),i?7:w?3:4,V,N);s.anim(C,()=>[1,0,2,2])}const x=e?d:d.clone().lerp(g,.35),M=s.fan(n.ear.map(C=>Y([c*C[0]*b,C[1]*b,C[2]*b])),e?d:p(.13,.105,.09),x);e&&s.glow(M,1)}const zt=s.n,dt=[],ft=s.n;if(n.beard){const c=[[.42,-.074],[.36,-.086],[.3,-.105],[.24,-.125],[.18,-.138],[.12,-.146],[.06,-.146],[0,-.13],[-.05,-.11]],x=[.42,.36,.3,.24,.18,.12,.06],M=c.length,C=[.1,.17,.22,.26,.28,.29,.28,.27,.27,.28,.29,.28,.25,.2,.13,.08],H=A.clone().lerp(d,.3),ot=A.clone();(i?[-1,-.35,.35,1]:w?[0]:[-.7,.7]).forEach((et,at)=>{const gt=[],nt=[],it=M+x.length;for(let ct=0;ct<it;ct++){const St=ct<M,Nt=C[ct]*(i?1:1.1),wt=St?Y([et*.03*b,c[ct][1]*b,c[ct][0]*b]):(()=>{const _t=L.rings,t=x[ct-M]/L.len;return j([et*.045,E(_t[1][2],_t[_t.length-1][2],t)+.03,x[ct-M]])})();gt.push(wt),nt.push([wt[0]+et*.035+(at%2?.012:-.012),wt[1]-Nt,wt[2]])}const pt=s.strip(gt,nt,H,ot);for(let ct=0;ct<it;ct++)f.push([pt[0]+ct*2+1,-C[ct]*.45]),dt.push([pt[0]+ct*2,ct<M,2+at],[pt[0]+ct*2+1,ct<M,2+at+.9])})}const Mt=s.n;for(let c=X;c<s.n;c++){const x=Math.min(1,Math.max(0,((s.p[c*3+2]-_[1])*Z+(s.p[c*3+1]-_[0])*$)/(L.len*.6)));s.a[c*4]=c>=R?1:x,s.a[c*4+2]=2,s.pv[c*3]=0,s.pv[c*3+1]=_[0]-.1,s.pv[c*3+2]=_[1],c>=R&&c<zt&&s.a[c*4+3]<1.5&&(s.a[c*4+3]=1)}for(const c of dt){const x=c[0],M=x-(x-ft)%2;c[1]?s.a[x*4+3]=1:s.a[x*4]=Math.min(1,Math.max(0,((s.p[M*3+2]-_[1])*Z+(s.p[M*3+1]-_[0])*$)/(L.len*.6))),s.g[x]=c[2]}const D=n.tail,yt=s.n;s.tube([[0,D.y,D.z+.04],[0,D.y-.03,D.z-.04],[0,D.y-.16,D.z-.085],[0,D.y-D.len*.5,D.z-.1],[0,D.y-D.len*.8,D.z-.09]],[D.r*1.3,D.r,D.r*.8,D.r*.62,D.r*.5],i?6:4,d,g);const Ct=D.y-D.len+D.tuft,At=[0,.25,.5,.75,1].map(c=>[0,Ct-D.tuft*c,D.z-.085-.02*Math.sin(c*3)]);for(const c of i?[0,1.05,2.1]:[0,1.57])s.strip(At.map((x,M)=>[Math.cos(c)*.012,x[1],x[2]+Math.sin(c)*.012]),At.map((x,M)=>[-Math.cos(c)*(.02+.05*Math.sin(Math.PI*Math.min(1,M/3.4))),x[1]-.03*(M%2),x[2]-Math.sin(c)*(.02+.05*Math.sin(Math.PI*Math.min(1,M/3.4)))]),g,g);s.anim([yt,s.n],(c,x)=>[0,Math.min(1,Math.max(0,(D.y-x)/D.len)),3,0]),s.pivot([yt,s.n],0,D.y,D.z);const m=s.build(),Tt=new Float32Array(m.attributes.position.count);for(const c of f)Tt[c[0]]=c[1];return m.setAttribute("aCrest",new h.BufferAttribute(Tt,1)),m.userData.poll=[v[1]+n.head.off[0],v[2]+n.head.off[1]],m.userData.beard=[ft,Mt],oe(m,o)}function Me(r,o,l,n){const e=r.attributes.aAnim,i=r.attributes.position,w=r.attributes.aPivot,s=o*Math.PI/180,p=Math.sin(s),f=Math.cos(s),d=n*Math.PI/180;let y=0,S=0;for(let a=0;a<e.count;a++)if(Math.round(e.getZ(a))===2){y=w.getY(a),S=w.getZ(a);break}const g=y+p*l,U=S+f*l;for(let a=0;a<e.count;a++)if(Math.round(e.getZ(a))===2&&e.getW(a)<.5){const q=(i.getY(a)-y)*p+(i.getZ(a)-S)*f,W=(i.getZ(a)-U)*Math.cos(d)-(i.getY(a)-g)*Math.sin(d);q>l*.6&&e.setW(a,xt(-.02,.1,W))}return e.needsUpdate=!0,[g,U]}const fe=`
#include <common>
#include <fog_pars_vertex>
attribute vec4 aAnim; attribute vec3 aPivot, aSwim, aSwimN; attribute float aGlow;
attribute vec4 iA, iB, iC, iD, iE; attribute vec3 iTint;
uniform float uT, uCycle, uWaterY, uGait, uSlab; uniform vec3 uSlabX, uKeep; uniform vec4 uWaveP;
varying vec3 vCol, vN, vW, vLp; varying float vWet, vVis, vMask;
${Bt}
vec2 rotP(vec2 yz, float a){ float c = cos(a), s = sin(a); return vec2(yz.x * c - yz.y * s, yz.y * c + yz.x * s); }   // (y,z): nose-down positive
void main(){
  float seed = iD.x, size = iD.y, dN = iD.w;
  float tau = mod(uT + iA.w, uCycle);
  float tA = iB.x, ts = iB.y, tF = iB.z, v = iB.w;
  float s = tau - tA, sl = s - ts, d = sl - tF;
  float x0 = iA.x, zLip = iA.y, yLip = iA.z;
  vec3 p = position, n = normal;
  // ---- gallop on the plain (pivot = body centre)
  float fq = 2.35 / sqrt(size) * uGait, cyc = tau * fq + seed * 7.;
  float runW = 1. - smoothstep(-.2, 0., s);
  float zr = zLip + v * s, rt = clamp((zr - zLip + 10.) / 10., 0., 1.);
  float yG = yLip + dN * (1. - rt * rt * (3. - 2. * rt));
  float crouch = .13, bob = .05 * sin(cyc * 6.2832 + 1.) * runW;
  vec3 P = vec3(x0, yG + (${bt.toFixed(2)} - crouch + bob) * size, zr);
  float pitchRun = atan(dN * .6 * rt * (1. - rt)) + .06 * sin(cyc * 6.2832 + 2.4) * runW;
  float pitch = pitchRun, yaw = 0.;
  float neckA = .1 + .14 * sin(cyc * 6.2832 + .6), tailUp = .75;
  // ---- the rare slab: whoever stands on it rides it down
  float sK = smoothstep(0., 1., uSlab), sW = (1. - smoothstep(uSlabX.y - 1.5, uSlabX.y, abs(x0 - uSlabX.x))) * smoothstep(zLip - 6.5, zLip - 4., zr) * uSlabX.z;
  { float th = .42 * sK * sW, c = cos(th), sn = sin(th), zP = zLip + .25 + iE.x; vec2 q = P.yz - vec2(0., zP);
    P.yz = mix(P.yz, vec2(q.x * c - q.y * sn - 7.4 * sK, q.y * c + q.x * sn + zP + 3.4 * sK), sW); pitch += th + .2 * sin(sK * PI) * sin(seed * 40.) * sW; P.y -= sW * sK * 1.7 * clamp((x0 - uSlabX.x) / uSlabX.y, -1., 1.); }
  // ---- sliding a chute on the haunches
  float wSlide = 0.;
  if (ts > 0. && s > 0.) {
    float k = clamp(s / ts, 0., 1.), t = iE.y * k * sqrt(k);
    float al = atan(yLip, iE.x * dprof(t));
    vec2 ps = vec2(yLip * (1. - t), zLip + iE.x * prof(t)) + vec2(cos(al), sin(al)) * .62 * size;
    wSlide = smoothstep(0., .28, s);
    P.yz = mix(P.yz, ps, wSlide); pitch = mix(pitch, al * .9, wSlide); neckA = mix(neckA, -.5, wSlide);
  }
  // ---- in the air
  float q = clamp(sl / max(tF, .01), 0., 1.), wFly = smoothstep(-.06, .14, sl);
  if (sl > 0.) {
    float t2 = min(sl, tF);
    P.y = iC.x + iC.z * t2 - ${(.5*Pt).toFixed(2)} * t2 * t2; P.z = iC.y + iC.w * t2;
    float pv = atan(-(iC.z - ${Pt.toFixed(2)} * t2), iC.w) * .85;
    pitch = mix(pitch, pv, smoothstep(0., .25, sl));
    neckA = mix(neckA, mix(-.32, .12, q), wFly); tailUp = 1.1;
  }
  // ---- plunge, surface, swim
  float wSwim = smoothstep(0., .35, d);
  if (d > 0.) {
    float zL = iC.y + iC.w * tF, yL = iC.x + iC.z * tF - ${(.5*Pt).toFixed(2)} * tF * tF;
    vec2 xz = swimXZ(d, vec4(x0, zL, iE.z, iE.w), iC.w);
    float ySw = uWaterY + (${bt.toFixed(2)} - ${qt.toFixed(2)}) * size, kk = clamp(d / .8, 0., 1.);
    float y = ySw + (yL - ySw) * exp(-d * 9.) - 4.8 * size * kk * (1. - kk) + .05 * sin(tau * 5.2 + seed * 40.) * smoothstep(.7, 1.6, d);
    y -= smoothstep(uCycle - 2.8, uCycle - .4, tau) * 1.15 * size;
    P = vec3(xz.x, y, xz.y);
    // nobody swims through the lens: whoever would cross within a body length of the viewer is carried round
    { vec2 kd = P.xz - uKeep.xy; float kl = length(kd), kq = max(0., 1. - kl / uKeep.z); P.xz += kd / max(kl, .05) * .62 * uKeep.z * kq * kq; }
    // the slab's wave lifts each swimmer as it passes
    float wr = length(P.xz - uWaveP.xy) - uWaveP.z, wg = uWaveP.w * exp(-wr * wr * .08); P.y += .05 * wg;
    pitch = mix(pitch, .025 * sin(tau * 2.3 + seed * 30.), smoothstep(0., .7, d)) - .1 * wg;
    yaw = atan(iE.z, iE.w) * .7 * smoothstep(.3, 2.5, d);
    tailUp = .15;
  }
  // ---- pose
  float part = aAnim.z;
  if (part > .5 && part < 1.5) {
    // two-bone leg solved to a foot target; on the ground the target is planted (moves back at exactly body speed)
    bool front = aPivot.z > 0.; float side = aPivot.x > 0. ? 1. : 0.;
    float jy = aPivot.y, l1 = jy * .5, duty = .22, Ls = (v / size) * duty / fq;
    float ph = fract(cyc + (front ? .45 : 0.) + side * .11), dz, lift;
    if (ph < duty) { dz = Ls * (.5 - ph / duty); lift = 0.; }
    else { float e = (ph - duty) / (1. - duty); dz = Ls * (e * e * (3. - 2. * e) - .5); lift = (front ? .34 : .26) * sin(e * PI); }
    float zf = zr + (aPivot.z + dz) * size, rf = clamp((zf - zLip + 10.) / 10., 0., 1.);
    float yGf = yLip + dN * (1. - rf * rf * (3. - 2. * rf));
    vec2 Fw = vec2(${bt.toFixed(2)} - (yG + (${bt.toFixed(2)} - crouch + bob) * size - yGf) / size + lift, aPivot.z + dz);
    vec2 T = vec2(${bt.toFixed(2)}, 0.) + rotP(Fw - vec2(${bt.toFixed(2)}, 0.), -pitchRun);
    float jit = sin(tau * 13. + seed * 9. + side * 2. + (front ? 0. : 1.7));
    if (ts > 0.) T = mix(T, front ? vec2(.13 + .03 * jit, aPivot.z + .36) : vec2(.42, aPivot.z + .22 + .05 * jit), smoothstep(-.05, .15, s));
    float reach = smoothstep(.5, .9, q) * (.55 + .45 * h11(seed + 3.));
    vec2 Tf = front ? mix(vec2(.52, aPivot.z + .12), vec2(.17, aPivot.z + .42), reach) : mix(vec2(.3, aPivot.z - .55), vec2(.42, aPivot.z + .04), smoothstep(.45, 1., q));
    Tf.y += .07 * jit;
    T = mix(T, Tf, wFly);
    vec2 hip = vec2(jy, aPivot.z), dd = T - hip;
    float dist = clamp(length(dd), .08, 2. * l1 * .999);
    float beta = atan(dd.y, max(-dd.x, .02)), A = acos(clamp(dist / (2. * l1), -1., 1.));
    float ua = beta + (front ? A : -A);
    vec2 knee = hip + l1 * vec2(-cos(ua), sin(ua));
    float la = atan(T.y - knee.y, knee.x - T.x + 1e-4);
    float w = smoothstep(.42, .58, aAnim.y);
    vec2 up = hip + rotP(p.yz - hip, -ua), lo = knee + rotP(p.yz - vec2(jy - l1, aPivot.z), -la);
    p.yz = mix(up, lo, w); n.yz = mix(rotP(n.yz, -ua), rotP(n.yz, -la), w);
  } else if (part > 1.5 && part < 2.5) {
    if (aAnim.w > 1.5 && iD.z > .5) p = mix(p, vec3(sign(p.x) * .05, 1.36, 1.04), .6);      // calves: short spikes
    float a = neckA * aAnim.x;
    p.yz = aPivot.yz + rotP(p.yz - aPivot.yz, a); n.yz = rotP(n.yz, a);
  } else if (part > 2.5) {
    float w = aAnim.y, a = w * (tailUp + .25 * sin(cyc * 12.566 + seed));
    p.yz = aPivot.yz + rotP(p.yz - aPivot.yz, a); n.yz = rotP(n.yz, a);
    p.x += w * w * .16 * sin(tau * 9. + seed * 20.);
  }
  // ---- swimming: the baked pose (head low and forward, chin on the water, the withers awash), with a slow nod of the head
  if (wSwim > 0.) {
    vec3 sp = aSwim, sn = aSwimN;
    if (part > 1.5 && part < 2.5) { float na = .045 * sin(tau * 2.3 + seed * 40.) * aAnim.x; sp.yz = aPivot.yz + rotP(sp.yz - aPivot.yz, na); sn.yz = rotP(sn.yz, na); if (aAnim.w > 1.5 && iD.z > .5) sp = mix(sp, vec3(sign(sp.x) * .05, 1.42, 1.1), .6); }
    p = mix(p, sp, wSwim); n = mix(n, sn, wSwim);
  }
  // ---- body transform
  vec3 b = p - vec3(0., ${bt.toFixed(2)}, 0.);
  b.yz = rotP(b.yz, pitch); n.yz = rotP(n.yz, pitch);
  float roll = (.1 * sin(tau * 3. + seed * 11.) * wFly + .05 * sin(tau * 2.6 + seed) * wSwim);
  float cr = cos(roll), sr = sin(roll); b.xy = vec2(b.x * cr - b.y * sr, b.y * cr + b.x * sr); n.xy = vec2(n.x * cr - n.y * sr, n.y * cr + n.x * sr);
  float cy = cos(yaw), sy = sin(yaw); b.xz = vec2(b.x * cy + b.z * sy, b.z * cy - b.x * sy); n.xz = vec2(n.x * cy + n.z * sy, n.z * cy - n.x * sy);
  vec3 wp = P + b * size;
  vW = wp; vN = n; vLp = position; vMask = aGlow;
  vCol = color * iTint;
  vWet = smoothstep(0., .3, d);
  vVis = smoothstep(.05, 1., tau) * (1. - smoothstep(uCycle - 1.7, uCycle - .3, tau));
  vec4 mvPosition = modelViewMatrix * vec4(wp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,de=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uSun, uSunC, uSkyC, uGndC, uDustLit, uDustShade, uTea, uCamL, uSkyRef; uniform float uWaterY, uRim, uShade;
varying vec3 vCol, vN, vW, vLp; varying float vWet, vVis, vMask;
${Bt}
${Et}
${re}
void main(){
  if (vVis < .995) { float dn = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(.06711056, .00583715)))); if (dn > vVis) discard; }
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(uCamL - vW + vec3(0., 1e-5, 0.));
  // the hide's fine work, by how far the hide is from the eye (uCamL): within eight metres of the eye all of it, beyond twelve and a
  // half none. The brindle stands out of a paler coat, dust lies to the knee, the shade side is slate and the sun's side carries a
  // broad gold edge on spine, hump and horn.
  float nearK = 1. - smoothstep(8., 12.5, length(uCamL - vW));
  vec3 alb = vCol; float beard = step(1.5, vMask), eyeM = step(vMask, -.5), mk = clamp(vMask, 0., 1.) * (1. - beard);     // aGlow: 1 = coat (bars, stripes), 2.. = beard hair, -1 = eye
  // the beard is a curtain cut into fine strands of uneven length (vMask = 2 + leaf + .9 x the way down the hair); too far off to draw them, a ragged hem
  float bStr = 1., bfw = fwidth(vLp.z) * 125.;
  if (beard > .5) {
    float bt = vMask - 2., leaf = floor(bt + .001), bv = (bt - leaf) / .9, bu = vLp.z * 125. + leaf * 17.37, sid = floor(bu), bf = fract(bu) - .5;
    float thin = smoothstep(.5, 1.4, bfw), blen = (.38 + .62 * h11(sid * 1.31 + leaf * 7.)) * (.75 + .25 * sin(vLp.z * 23. + leaf * 2.));
    float bw = .5 * (1. - .75 * smoothstep(.3, 1., bv / max(blen, .05)));
    if (bv > .02 && (bv > mix(blen, .62 + .2 * sin(vLp.z * 23. + leaf * 2.), thin) || abs(bf) > mix(bw, .5, thin))) discard;
    bStr = mix(.8 + .35 * h11(sid + 3.), 1., thin) * (.72 + .28 * smoothstep(0., .5, bv));
  }
  // the coat: hair lying along the body and down the flanks, in clumps when it is wet; mottling; never one flat tone
  float hair = vn2(vec2(vLp.z * 26. + vLp.y * 6., vLp.y * 38. + vLp.x * 20.)), mott = vn3(vLp * vec3(6., 7., 5.) + 3.);
  float hc = vLp.y * 150. + vLp.x * 95. + vn2(vLp.zy * vec2(9., 7.)) * 9., hk = 1. - smoothstep(.6, 1.7, fwidth(hc));
  float hs1 = vn2(vec2(vLp.z * 7., hc)), hs2 = vn2(vec2(vLp.z * 3. + 5., hc * .31));
  float streak = mix(.5, hs1 * .6 + hs2 * .4, hk), coatK = (1. - beard) * (1. - eyeM);
#ifdef ZEBRA
  float H = 1.35, leg = 1. - smoothstep(.5 * H, .62 * H, vLp.y), nk = smoothstep(.5, .8, vLp.z) * smoothstep(.95 * H, 1.1 * H, vLp.y);
  vec3 dir = normalize(mix(mix(vec3(0., .25, 1.), vec3(0., 1., .1), leg), vec3(0., .75, -.65), nk));
  float sp = dot(vLp, dir) * 50. / H + sin(vLp.y * 5. / H + vLp.x * 3.) * .6, fw = fwidth(sp);
  float st = smoothstep(-.3 - fw, .3 + fw, sin(sp)); st = mix(st, .45, smoothstep(1.2, 2.8, fw));
  alb = mix(alb, mix(vec3(.012, .011, .012), alb * 1.1, st), mk);
  alb *= .86 + .2 * mott;
  float bars = 0.;
#else
  // brindle bars down neck, shoulder and flank, dying out on the quarters
  float bz = vLp.z * 47. + sin(vLp.y * 8. + vLp.z * 3.) * 1.6 + (vn2(vLp.zy * 5.) - .5) * 5.;
  float bars = smoothstep(.3, .8, sin(bz)) * smoothstep(-.5, .0, vLp.z) * smoothstep(.72, .96, vLp.y) * (.4 + .6 * vn2(vLp.zy * 3. + 7.)) * mk;
  alb *= mix(.8 + .15 * hair * mk + .2 * mott, bStr, beard);
#endif
  // dust on dry legs; wet coats go darker
  float dry = 1. - smoothstep(.45, 1., vWet);
  alb = mix(alb, uDustLit * .16, dry * min(.04 + .34 * (1. - smoothstep(.08, .6, vLp.y)) + .34 * nearK * (1. - smoothstep(.1, .85, vLp.y)), .8) * (1. - eyeM));
  alb *= mix(1., .88, vWet * beard);                                                      // wet, the beard is still pale cream against the dark throat
  float wetC = vWet * coatK;                                                              // the beard stays matte hair, wet or dry
  float clearW = smoothstep(uWaterY + .35, uWaterY + 1.1, vW.y);                          // out of the water and no longer streaming: a soaked coat is darker than a dry one
  alb *= mix(1., mix(${Lt.dark[0].toFixed(2)}, ${Lt.dark[1].toFixed(2)}, mk), wetC) * mix(1., .6, wetC * clearW);
#ifndef ZEBRA
  alb = mix(alb, max(alb, vec3(1., .95, .93) * ${Lt.floor.toFixed(3)} * (1. - .7 * clearW) * (.72 + 3. * dot(alb, vec3(.33))) * (1. + .8 * mk)), wetC);        // wet slate, never a black hole: the face stays a tone darker than the coat
  alb *= 1. - mix(.5, .4, wetC) * bars;                                                   // the bars show wet or dry
#endif
  alb *= 1. + nearK * coatK * mix(.2 - .42 * bars, .26 - .3 * bars, vWet);
  alb *= mix(1., mix(.84 + .32 * streak, .6 + .8 * streak, wetC), coatK);                 // hair: fine and dry, or wet and drawn into dark and bright strings
  float hairN = (.25 + .75 * wetC) * hk * coatK;
  vec3 Ng = N;                                                                            // (the body's own normal: the wet rim and the wet streak follow the form, not the hair)
  N = normalize(N + vec3(hs1 - .5, (hs2 - .5) * .7, 0.) * .85 * hairN);                   // and the light breaks along it
  float ndl = dot(N, uSun), dif = max(ndl * .72 + .28, 0.); dif *= dif;
  // hides stay warm slate under gold light and blue sky: the fill is three parts grey, the gold goes into the rim
  float sunL = dot(uSunC, vec3(.3, .5, .2));
  vec3 sunD = mix(uSunC, vec3(sunL), .66), skyD = mix(uSkyC, vec3(dot(uSkyC, vec3(.3, .5, .2))), .68);
  vec3 amb = mix(uGndC * .85 + uDustLit * .06, skyD * .9, N.y * .5 + .5) * (.55 + .45 * smoothstep(-.95, .25, N.y)) + vec3(.108, .1, .095) * sunL * (.7 + .3 * N.y) * (1. + 1.4 * nearK) + uDustLit * sunL * .1 * nearK * (1. - smoothstep(-.5, .3, N.y));       // a floor of warm grey: the shade side is slate, never a black hole; bellies and the insides of legs sit in their own shade
  float cs = cloudSun(vW.xz);                                                             // a cloud's shadow lies on it as it lies on the ground
  vec3 col = alb * (sunD * dif * .38 * (1. - .9 * uShade) * cs + amb * (1. - .35 * uShade) * (.82 + .18 * cs) + uDustLit * .12 * uShade);     // uShade: down in the gully, out of the sun
  col += alb * uSunC * vec3(1., .8, .52) * max(ndl, 0.) * smoothstep(-.15, .45, Ng.y) * 1.25 * cs * (1. - .9 * uShade) * (1. - vWet);      // the low sun rakes spine, poll and horns with gold
  float fr = 1. - max(dot(N, V), 0.), fr2 = fr * fr, fr3 = fr2 * fr;
  float frG = 1. - max(dot(Ng, V), 0.), frR = mix(fr, frG, vWet), spine = smoothstep(.3, .8, Ng.y), topK = smoothstep(-.15, .45, Ng.y);
  float toSun = smoothstep(-.25, .55, ndl);
  float rimK = smoothstep(-.25, .15, ndl) * (1. - .92 * smoothstep(.22, .6, ndl));                                      // only where the light just grazes: a flank square to the sun is lit, not rimmed
  float frP = frR * frR * frR; frP *= mix(frR, 1., .7 * nearK) * (1. + .8 * nearK);
  float hb = mix(1., .3 + 1.5 * streak * streak, hk * coatK);                                                            // highlights sit on the hair, not on a skin of plastic
  col += uSunC * mix(mix(uDustLit, vec3(1.), .3), vec3(.86, .66, .42), vWet) * frP * (.03 + .8 * rimK) * uRim * (.12 + .88 * cs) * mix(1., .5 * topK, vWet) * (1. - beard) * mix(1., hb, .7 * (1. - vWet)) * mix(1., (1. - .6 * bars) * (.6 + .8 * mott) * (.45 + .55 * smoothstep(.55, .9, frR)), 1. - vWet);      // the burning rim on spine, horn and flank; on a wet hide it is gold and keeps to what faces up: spine, poll and horns
  col += uSunC * vec3(1., .8, .5) * beard * nearK * bStr * toSun * .05 * (1. - .6 * uShade) * cs;
  col += skyD * fr2 * .04 * (1. - toSun);                                                                                // a cool edge on the shaded side
  vec3 Hh = normalize(uSun + V); float nh = max(dot(N, Hh), 0.), upK = smoothstep(.25, .9, N.y);
  float low = mix(.2, 1., 1. - smoothstep(uWaterY + .5, uWaterY + 1.25, vW.y));                                          // what stands well clear of the water has stopped streaming
  col += uSunC * (pow(nh, 36.) * .02 + wetC * hb * spine * (pow(nh, 90.) * ${Lt.spec1.toFixed(3)} + pow(nh, 14.) * ${Lt.spec2.toFixed(3)} * low));    // wet: narrow gold lines along poll, horn boss and the top of the neck
  col += mix(uSkyRef, vec3(.34, .5, .85) * (dot(uSkyRef, vec3(.3, .5, .2)) * 1.5 + .1), .8) * wetC * low * hb * (fr3 * (${Lt.sheen.toFixed(3)} * (.3 + .7 * spine) + ${Lt.sheenUp.toFixed(3)} * upK) + ${Lt.sheenAll.toFixed(3)} * upK + ${Lt.sheenShade.toFixed(3)} * fr2 * (1. - toSun) * (.4 + .6 * spine));        // and the sky lying on it: blue on the shaded side
  col += uSunC * vec3(1., .82, .55) * wetC * max(ndl, 0.) * max(ndl, 0.) * upK * .03 * hb;                          // and the low sun warm along whatever of it faces up
  if (eyeM > .5) { float eg = pow(max(dot(N, normalize(V + vec3(0., .8, 0.))), 0.), 16.); col = alb * amb * .6 + (uSkyRef * 2.6 + uSunC * .7) * eg * eg; }      // the eye: dark, wet, a point of sky in it
  col = mix(col, uTea * (uSunC * .25 + uSkyC), (1. - smoothstep(uWaterY - .3, uWaterY + .03, vW.y)) * .85);
  // the knee-deep dust every dry hoof runs in, brighter on the sun side
  vec3 dc = mix(dustShadeC(), dustLitC(), .35 + .35 * toSun); dc = mix(dc, vec3(dot(dc, vec3(.3, .5, .2))), .3);         // a veil, not paint: greyer than the lit plume
  float dk = 1. - smoothstep(.0, .5, vLp.y), lay = max(.55 - vLp.y, 0.) / max(1.5 - vLp.y, .4) * length(uCamL - vW);      // and far off the layer itself lies between us and its legs
  col = mix(col, dc * (1. - .35 * uShade), dry * max(dk * dk * .62, (1. - exp(-lay * .1)) * .85) * (1. - eyeM));
  vec4 dv = dustVeil(vW, uCamL); col = mix(col, dv.rgb, dv.a);
  gl_FragColor = vec4(col, 1.);
  #ifdef USE_FOG
    float fd = vFogDepth * .55; gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, 1. - exp(-fogDensity * fogDensity * fd * fd));         // a dark body holds its own in the haze longer than the ground does
  #endif
}`;function Zt(r,o,l,n){const e=n.cycle?{...o,cycle:n.cycle}:o,i={n:l,iA:new Float32Array(l*4),iB:new Float32Array(l*4),iC:new Float32Array(l*4),iD:new Float32Array(l*4),iE:new Float32Array(l*4),tint:new Float32Array(l*3),land:[]},w=.6180339887,s=r();for(let p=0;p<l;p++){let f=((p*w+s)%1-.5)*2*e.half;if(e.chutes.length&&r.chance(.62)){const X=e.chutes[Math.floor(r()*e.chutes.length)];f=X.x+r.gauss()*X.w*.4}f=Math.max(-e.half-3,Math.min(e.half+3,f));const d=e.chute(f),y=e.lipZ(f),S=e.lipY(f),g=e.runR(f),U=e.notch(f),a=n.calf(p),q=(a?r.range(.68,.8):r.range(.93,1.1))*n.scale,W=r(),A=r.range(8.2,10.2),V=(y-Yt-r.range(1,7)-(n.cycle?14:0))/A,N=d>.45&&r.chance(n.cycle?.55:.82);let z=0,Q=0,E=S+(bt-.13)*q,K=y,B=r.range(1.2,3.4),F=A*r.range(.72,.9);if(N){z=r.range(.75,1.05),Q=r.range(.34,.56);const X=Math.atan2(S,g*Jt(Q)),st=Math.hypot(S,g)*Q,J=Math.min(9,1.5*st/z)*.75;E=S*(1-Q)+Math.cos(X)*.62*q,K=y+g*Dt(Q)+Math.sin(X)*.62*q,B=-Math.sin(X)*J+r.range(1.5,2.6),F=Math.cos(X)*J+r.range(2.4,3.6)}const L=e.waterY+.3*q,T=(B+Math.sqrt(B*B+2*Pt*Math.max(.1,E-L)))/Pt,Z=e.cycle-(V+z+T),$=Math.max(1.4,(n.swimLength-(K+F*T))/Math.max(4,Z-1.5));let _=e.current*e.curSpeed*r.range(.5,.85)+f/e.half*.35+r.gauss()*.22,j=$;if(n.swimTo){const X=Math.max(4,Z-1.2);_=(n.swimTo[0]+r.gauss()*4-f)/X,j=Math.max(.8,(n.swimTo[1]+r.gauss()*3-(K+F*T))/X)}const mt=n.t0?n.t0(p):V-(p+r.range(-.3,.3))/l*e.cycle;i.iA.set([f,y,S,mt],p*4),i.iB.set([V,z,T,A],p*4),i.iC.set([E,K,B,F],p*4),i.iD.set([W,q,a?1:0,U],p*4),i.iE.set([g,Q,_,j],p*4);const ht=n.tint(a,r);i.tint.set([ht.r,ht.g,ht.b],p*3),i.land.push({x:f,z:K+F*T,tL:V+z+T,t0:mt,vx:_,vS:j,vImp:F,size:q,slider:N,tA:V,ts:z,tEnd:Q,zLip:y,yLip:S,R:g,v:A,dN:U,y1:E,z1:K,vy:B,vz:F,tF:T,swimT:Z,cycle:e.cycle,fill:!!n.cycle})}return i}function Gt(r,o,l,n){const e=o.cycle&&o.cycle!==r.cycle?{waterY:r.waterY,cycle:o.cycle}:r,i=((l+o.t0)%e.cycle+e.cycle)%e.cycle,w=i-o.tA,s=w-o.ts,p=s-o.tF;if(p>0){const f=e.waterY+(bt-qt)*o.size,d=o.y1+o.vy*o.tF-.5*Pt*o.tF*o.tF,y=Math.min(1,p/.8);n.x=o.x+o.vx*(p-1.2*(1-Math.exp(-p/1.2))),n.z=o.z+o.vS*p+(o.vImp*.5-o.vS)*.4*(1-Math.exp(-p/.4)),n.y=f+(d-f)*Math.exp(-p*9)-4.8*o.size*y*(1-y)-xt(e.cycle-2.8,e.cycle-.4,i)*1.15*o.size,n.pitch=-.17,n.phase=3}else if(s>0)n.x=o.x,n.y=o.y1+o.vy*s-.5*Pt*s*s,n.z=o.z1+o.vz*s,n.pitch=Math.atan2(-(o.vy-Pt*s),o.vz)*.85*xt(0,.25,s),n.phase=2;else if(w>0&&o.ts>0){const f=Math.min(1,w/o.ts),d=o.tEnd*f*Math.sqrt(f),y=Math.atan2(o.yLip,o.R*Jt(d)),S=xt(0,.28,w),g=o.yLip+(bt-.13)*o.size,U=o.zLip+o.v*w;n.x=o.x,n.y=g+(o.yLip*(1-d)+Math.cos(y)*.62*o.size-g)*S,n.z=U+(o.zLip+o.R*Dt(d)+Math.sin(y)*.62*o.size-U)*S,n.pitch=y*.9*S,n.phase=1}else{const f=o.zLip+o.v*w,d=Math.min(1,Math.max(0,(f-o.zLip+10)/10));n.x=o.x,n.z=f,n.y=o.yLip+o.dN*(1-d*d*(3-2*d))+(bt-.13)*o.size,n.pitch=0,n.phase=0}return n.vis=i>.5&&i<e.cycle-1,n}function pe(r,o,l,n){const e={n:l,iA:new Float32Array(l*4),iB:new Float32Array(l*4),iC:new Float32Array(l*4),iD:new Float32Array(l*4),iE:new Float32Array(l*4),tint:new Float32Array(l*3)};for(let i=0;i<l;i++){const w=i%5===0,s=w?o.slabX+r.range(-7.5,7.5):r.range(-o.half-22,o.half+9),p=i%6===5,f=p?r.range(.68,.8):r.range(.93,1.1),d=r.range(.14,.3),y=r.range(.6,.95);e.iA.set([s,o.lipZ(s)-.25,o.lipY(s),r()*n],i*4),e.iB.set([n+r.range(.3,3),0,1,d],i*4),e.iC.set([0,0,0,1],i*4),e.iD.set([r(),f,p?1:0,o.notch(s)],i*4),e.iE.set([o.runR(s),0,0,1],i*4),e.tint.set(p?[2.3*y,1.75*y,1.2*y]:[y*1.02,y,y*.98],i*3)}return e}function It(r,o){const l=new h.InstancedBufferGeometry;l.index=r.index;for(const n of Object.keys(r.attributes))l.setAttribute(n,r.attributes[n]);for(const n of["iA","iB","iC","iD","iE"])l.setAttribute(n,new h.InstancedBufferAttribute(o[n],4));return l.setAttribute("iTint",new h.InstancedBufferAttribute(o.tint,3)),l.instanceCount=o.n,l}async function ve(r,o,l,n){const e=r.noise,i=B=>new h.Color(B),w=172,s=41,p=i(l[2]),f=i(l[1]),d=i("#8f5638"),y=i(l[1]).lerp(i("#eadbb8"),.45),S=i("#3b2a20"),g=i("#a87238"),U=i(l[2]).lerp(i(l[1]),.5),a=new Float32Array((w+1)*s*3),q=new Float32Array((w+1)*s*3),W=new Float32Array((w+1)*s*3),A=new h.Color,V=new h.Color;let N=0;for(let B=0;B<=w;B++){(B&3)===0&&await r.yield();const F=B/w*2-1,L=66*Math.sign(F)*Math.pow(Math.abs(F),1.18),T=o.endF(L),Z=o.chute(L),$=o.topY(L)*T,_=o.lipY(L)*T,j=o.lipZ(L),mt=o.runR(L),ht=Yt+3*e.n2(L*.03,4.2),X=xt(o.slabX-12,o.slabX-8.5,L)*(1-xt(o.slabX+8.5,o.slabX+12,L)),st=.34*(1-Z)*(.5+.5*e.n2(L*.5,9.1));for(let J=0;J<s;J++){let tt,u,v=1,G=0,R=0;if(J<16){if(J<3){const b=[0,.38,.84][J];u=ht-14+J*5.5,tt=-1.5+($+1.5)*b}else{const b=(J-3)/12;u=ht+(j-.4-ht)*(1-(1-b)*(1-b)),tt=$}if(G=o.trample(L,u),J>=3){const b=xt(j-10,j,u);tt=$-($-_)*b+(1-G)*.16*e.n2(L*.3,u*.3)*(1-b)}const Y=.78+.3*e.n2(L*.11,u*.11);A.copy(f).lerp(g,.5*xt(-.2,.7,e.n2(L*.05+9,u*.05))).multiplyScalar(Y),A.lerp(V.copy(U).multiplyScalar(.92+.14*e.n2(L*.4,u*.4)),Math.min(1,G+xt(j-1.6,j-.3,u)*.6)),R=X*xt(j-6.5,j-4,u)}else if(J<18)u=j-.05+st*(J===16?.7:1)+(J-16)*.14,tt=_-(J-16)*.3*T,G=o.trample(L,j),A.copy(S).lerp(U,.25+.5*Z),v=J===17?.75:1,R=X;else if(J<38){const Y=(J-17)/20;tt=_*(1-Y);const b=tt+1.1*e.fbm2(L*.035,tt*.12,3),lt=e.ridged2(L*.17,tt*.028+3.1,3);let zt=1.05*lt*(1-.5*Y)+1.3*xt(.72,1,Y)**2+.3*e.n2(3.3,b*.85)+.75*e.fbm2(L*.06,tt*.1,3)-.5*Math.exp(-(((tt-.6)/.7)**2))-.3*Math.exp(-((Y/.08)**2));u=j+mt*Dt(Y)+zt*(1-.72*Z)*T;const dt=e.n2(7.7,b*.5);A.copy(p).lerp(d,Math.min(1,Math.max(0,.45+.7*dt))),A.lerp(y,.42*Math.max(0,1-Math.abs(b-o.paleY)/.75)),A.lerp(S,.5*Math.max(0,1-Math.abs(b-o.seamY)/.4)),A.lerp(S,.75*Math.max(0,1-(_-tt)/.8)),A.lerp(y,.3*Z),A.multiplyScalar(.88+.2*e.n2(L*.4,tt*.4)),v=(.42+.58*lt)*(1-.3*Math.exp(-(((tt-.6)/.7)**2))),G=Z,R=X}else{const Y=J-37;tt=[-.7,-1.8,-3.2][Y-1],u=j+mt+[1.3,3.2,6.5][Y-1],A.copy(p).multiplyScalar(.55),R=X}a[N]=L,a[N+1]=tt,a[N+2]=u,q[N]=A.r,q[N+1]=A.g,q[N+2]=A.b,W[N]=v,W[N+1]=R,W[N+2]=G,N+=3}}const z=[];for(let B=0;B<w;B++)for(let F=0;F<s-1;F++){const L=B*s+F,T=L+s;z.push(L,L+1,T,T,L+1,T+1)}const Q=new h.BufferGeometry;Q.setAttribute("position",new h.BufferAttribute(a,3)),Q.setAttribute("color",new h.BufferAttribute(q,3)),Q.setAttribute("aData",new h.BufferAttribute(W,3)),await r.yield(),Q.setIndex(z);{const B=a.length/3,F=new Float32Array(B*3),L=z.length/3;for(let T=0;T<L;T++){(T&2047)===2047&&await r.yield();const Z=z[T*3]*3,$=z[T*3+1]*3,_=z[T*3+2]*3,j=a[_]-a[$],mt=a[_+1]-a[$+1],ht=a[_+2]-a[$+2],X=a[Z]-a[$],st=a[Z+1]-a[$+1],J=a[Z+2]-a[$+2],tt=mt*J-ht*st,u=ht*X-j*J,v=j*st-mt*X;F[Z]+=tt,F[Z+1]+=u,F[Z+2]+=v,F[$]+=tt,F[$+1]+=u,F[$+2]+=v,F[_]+=tt,F[_+1]+=u,F[_+2]+=v}for(let T=0;T<B;T++){const Z=F[T*3],$=F[T*3+1],_=F[T*3+2],j=1/(Math.sqrt(Z*Z+$*$+_*_)||1);F[T*3]=Z*j,F[T*3+1]=$*j,F[T*3+2]=_*j}Q.setAttribute("normal",new h.BufferAttribute(F,3))}await r.yield();const E=new h.ShaderMaterial({uniforms:{...h.UniformsUtils.clone(h.UniformsLib.fog),...n},fog:!0,vertexColors:!0,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      attribute vec3 aData; uniform float uSlab, uSlabP; uniform vec3 uSlabX;
      varying vec3 vW, vN, vCol, vData; varying float vScar;
      void main(){
        vec3 p = position, nn = normal; float e = smoothstep(0., 1., uSlab);
        float th = .42 * e * aData.y, c = cos(th), sn = sin(th); vec2 q = p.yz - vec2(0., uSlabP);                 // the rare slab: it leans out on its toe and slides down in one piece
        p.yz = mix(p.yz, vec2(q.x * c - q.y * sn - 7.4 * e, q.y * c + q.x * sn + uSlabP + 3.4 * e), aData.y);
        nn.yz = vec2(nn.y * c - nn.z * sn, nn.z * c + nn.y * sn);
        p.y -= aData.y * e * 1.7 * clamp((position.x - uSlabX.x) / uSlabX.y, -1., 1.);                               // and it rolls: the end by the Fall goes first
        vW = p; vN = nn; vCol = color; vData = aData; vScar = 4. * aData.y * (1. - aData.y) * e;
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform vec3 uSun, uSunC, uSkyC, uGndC, uFoam, uDustLit, uDustShade, uCamL; uniform float uTime, uWaterY, uCur;
      varying vec3 vW, vN, vCol, vData; varying float vScar;
      ${Bt}
      ${ee}
      float clod(vec3 p, float top){ return vn3(p * vec3(1.5, 2.6, 1.5)) * .6 + vn3(p * 5.3) * .3 + (.2 * sin(p.y * 7. + vn2(p.xz * .4) * 5.) + .5 * vn2(vec2(p.x * 1.4 + p.z * .6, p.y * .13))) * (1. - top); }
      void main(){
        vec3 N = normalize(vN + vec3(0., 1e-5, 0.)), p = vW;
        float top = smoothstep(.55, .85, N.y), e = .12;
        float h0 = clod(p, top); vec3 g = vec3(clod(p + vec3(e, 0., 0.), top), clod(p + vec3(0., e, 0.), top), clod(p + vec3(0., 0., e), top)) - h0;
        g = g / e; g -= N * dot(g, N); N = normalize(N - g * mix(.48, .16, top));
        vec3 alb = vCol * (.8 + .4 * vn3(p * vec3(.9, 3., .9)));
        alb *= 1. - .25 * smoothstep(.5, .9, vn2(vec2(p.x * 2.2 + p.z, p.y * .22))) * (1. - top);                       // drip streaks
        alb *= 1. - .34 * vData.z * smoothstep(.5, .8, vn2(p.xz * 2.7)) * top;                                          // hoof pocks
        alb *= 1. - .2 * vData.z * smoothstep(.42, .7, vn2(p.xz * vec2(1.7, .16))) * top;                               // trails along the run
        alb *= mix(1., (.7 + .35 * vn2(p.xz * 1.3) + .3 * vn2(p.xz * 7.)) * (.85 + .3 * vn2(p.xz * vec2(23., 19.))), top * (1. - vData.z));
        alb *= mix(1., (.8 + .4 * vn2(p.xz * 11.)) * (1. - .3 * smoothstep(.55, .75, vn2(p.xz * 6.3))), top * vData.z);                                    // grass grain
        alb = mix(alb, vec3(.16, .072, .04) * (.55 + .8 * vn3(p * 1.7)), clamp(vScar * 2.4, 0., 1.));                       // the raw scar the slab leaves
        float wet = 1. - smoothstep(uWaterY + .2, uWaterY + 1.1 + .7 * vn2(vec2(p.x * .5, 2.)), p.y);
        alb *= mix(1., .5, wet);
        float ndl = dot(N, uSun), dif = max(ndl, 0.) * .85 + .15 * (ndl * .5 + .5);
        float sh = leapShadow(p);
        vec3 col = alb * (uSunC * dif * (1. - .8 * sh) + mix(uGndC, uSkyC, N.y * .5 + .5) * vData.x);
        col += uSkyC * wet * .12;
        float fl = 1. - smoothstep(0., .1 + .14 * vn2(vec2(p.x * 1.3 - uTime * .5 * uCur, uTime * .6)), abs(p.y - uWaterY - .05));
        col = mix(col, uFoam * (uSunC * .4 + uSkyC), fl * .85 * (1. - top));
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`}),K=new h.Mesh(Q,E);return K.frustumCulled=!1,{mesh:K,triangles:z.length/3}}function me(r,o){const l=new h.PlaneGeometry(260,118,1,1);l.rotateX(-Math.PI/2),l.translate(0,r.waterY,55);const n=new h.ShaderMaterial({uniforms:{...h.UniformsUtils.clone(h.UniformsLib.fog),...o},fog:!0,transparent:!0,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      varying vec3 vW; varying vec2 vUv;
      void main(){ vW = position; vUv = uv; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform vec3 uSun, uSunC, uSkyC, uGndC, uFoam, uTea, uSkyRef, uHaze, uBankLit, uDustLit, uCamL; uniform vec4 uBank, uCut; uniform float uTime, uCur, uCurSpeed, uHalf;
      varying vec3 vW; varying vec2 vUv;
      ${Bt}
      ${ee}
      ${te}
      void main(){
        vec3 p = vW, V = uCamL - p; float dist = max(length(V), .01); V /= dist;
        vec2 dx = dFdx(p.xz), dy = dFdy(p.xz); float px = max(length(dx), length(dy));
        vec2 f = p.xz - vec2(uCur * uCurSpeed * uTime, 0.);
        float agit = 1. + 1.1 * exp(-max(p.z - uBank.x, 0.) / 10.) * (1. - smoothstep(uHalf, uHalf + 9., abs(p.x)));        // churned under the Fall
        vec2 gr = riverSlope(p.xz, dx, dy, agit);
        vec3 N = normalize(vec3(-gr.x, 1., -gr.y));
        vec3 R = reflect(-V, N); R.y = abs(R.y) + .002;
        vec3 sky = mix(uHaze, uSkyRef, smoothstep(.02, .24, R.y));
        float rz = min(R.z, -.02), t = (uBank.x + uBank.y * p.x * p.x - p.z) / rz, hx = p.x + R.x * t;
        t = (uBank.x + uBank.y * hx * hx - p.z) / rz; float hy = R.y * t, on = step(R.z, -.02);
        float mB = on * (1. - smoothstep(uBank.z - 5., uBank.z + 3., hy)) * (1. - smoothstep(54., 66., abs(hx)));
        float mP = on * smoothstep(uBank.z, uBank.z + 7., hy) * (1. - smoothstep(38., 78., hy)) * exp(-((hx - uBank.w * hy) / 36.) * ((hx - uBank.w * hy) / 36.));
        float sh = leapShadow(p);
        vec3 bodyR = uTea * (uSunC * max(uSun.y, .06) * .8 + uSkyC * .95 + uGndC * .2);
        vec3 refl = mix(mix(sky, uDustLit * .9, mP * .7), mix(uBankLit * (.36 + .22 * vn2(vec2(hx * .45, hy * .9))), bodyR, .45), mB);
        // close under the Fall, and under the cut bank we leap from (uCut: its x, where it begins in z), the water is dark
        float nb = max(exp(-max(p.z - uBank.x - uBank.y * p.x * p.x, 0.) / 4.5) * (1. - smoothstep(60., 80., abs(p.x))), exp(-max(p.x - uCut.x, 0.) / 4.) * smoothstep(uCut.y - 8., uCut.y + 6., p.z));
        vec3 col = riverColor(N, V, dist, refl, sh, riverFoam(f, px) * (1. - .5 * smoothstep(30., 90., dist)), f, nb);
        vec2 ed = abs(vUv * 2. - 1.);
        gl_FragColor = vec4(col, (1. - smoothstep(.82, 1., ed.x)) * smoothstep(0., .14, vUv.y));
        #include <fog_fragment>
      }`}),e=new h.Mesh(l,n);return e.frustumCulled=!1,e.renderOrder=1,e}function ye(r,o,l){const n=l.length,e=new Float32Array(n*4),i=new Float32Array(n*4),w=new Float32Array(n*4);l.forEach((y,S)=>{e.set(y.a,S*4),i.set(y.b,S*4),w.set(y.c,S*4)});const s=new h.InstancedBufferGeometry,p=new h.PlaneGeometry(2,2);s.index=p.index,s.setAttribute("position",p.attributes.position),s.setAttribute("dA",new h.InstancedBufferAttribute(e,4)),s.setAttribute("dB",new h.InstancedBufferAttribute(i,4)),s.setAttribute("dC",new h.InstancedBufferAttribute(w,4)),s.instanceCount=n;const f=new h.ShaderMaterial({uniforms:{...h.UniformsUtils.clone(h.UniformsLib.fog),...o},fog:!0,transparent:!0,depthWrite:!1,blending:h.CustomBlending,blendSrc:h.OneFactor,blendDst:h.OneMinusSrcAlphaFactor,blendSrcAlpha:h.OneFactor,blendDstAlpha:h.OneMinusSrcAlphaFactor,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      attribute vec4 dA, dB, dC; uniform float uT, uCycle, uWaterY, uCur, uCurSpeed, uSlabA;
      varying vec2 vUv; varying vec3 vK;
      ${Bt}
      void main(){
        float kind = dA.w, lt = mod(uT + dA.z, uCycle), life = dB.z, a = 0.;
        vec2 c = dA.xy, ax = vec2(1., 0.), ext = vec2(1.), q = position.xy;
        if (kind < .5) {
          c.x += uCur * uCurSpeed * .55 * lt;
          ext = vec2(dB.w * (.22 + .78 * (1. - exp(-lt * 1.15))));
          a = smoothstep(0., .12, lt) * (1. - smoothstep(life * .35, life, lt));
        } else if (kind < 1.5) {
          c = swimXZ(lt, vec4(dA.x, dA.y, dB.x, dB.y), dC.x);
          vec2 vel = vec2(dB.x * (1. - exp(-lt / 1.2)), dB.y); float yaw = atan(vel.x, vel.y) * .7;
          ax = vec2(cos(yaw), -sin(yaw));
          q.y = q.y * .5 - .5;                                         // 0 at the chest .. -1 at the tail of the wake
          ext = vec2(1.5, 4.2) * dB.w; c += vec2(-ax.y, ax.x) * 1.1 * dB.w;
          a = smoothstep(.8, 1.7, lt) * (1. - smoothstep(life - 2.8, life - 1., lt));
        } else {
          lt = uSlabA - 1.9 - dA.z; ext = vec2(3. + 8.5 * max(lt, 0.)); a = smoothstep(0., .25, lt) * (1. - smoothstep(life * .5, life, lt));     // the slab's wave: a ring that runs out over the river
        }
        vec2 xz = c + ax * q.x * ext.x + vec2(-ax.y, ax.x) * q.y * ext.y;
        vUv = position.xy; vK = vec3(kind, a, kind > 1.5 ? ext.x : dC.y + lt * .15);
        vec4 mvPosition = modelViewMatrix * vec4(xz.x, uWaterY + .05, xz.y, 1.);
        gl_Position = a > .002 ? projectionMatrix * mvPosition : vec4(2., 2., 2., 1.);
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform vec3 uSun, uSunC, uSkyC, uGndC, uFoam, uTea, uSkyRef, uHaze; uniform float uTime;
      varying vec2 vUv; varying vec3 vK;
      ${Bt}
      ${te}
      ${Vt}
      void main(){
        float al = 0., r = length(vUv), n = vn2(vUv * 4.5 + vK.z * 13.), n2 = vn2(vUv * 11. - vK.z * 7.);
        vec3 tone = uFoam;
        if (vK.x < .5) {
          float rw = r + (vn2(vUv * 1.7 + vK.z * 5.) - .5) * .34, ring = smoothstep(.46, .74, rw) * (1. - smoothstep(.8, 1., rw));
          al = max(ring * smoothstep(.25, .6, n) * (.4 + .6 * n2), (1. - smoothstep(.15, .8, r)) * smoothstep(.35, .7, n * .7 + n2 * .45)) * (.6 + .4 * n2);
        } else if (vK.x < 1.5) {
          al = wakeFoam(abs(vUv.x), vUv.y * -.5 + .5, vK.z, vUv);          // 0 at the chest .. 1 at the tail
        } else {
          float R = vK.z, bw = 1.5 / R, rw = r + (vn2(vUv * R * .3 + 3.) - .5) * (1.8 / R), nn = vn2(vUv * R * .9 + 7.);
          float ring = smoothstep(1. - 3.2 * bw, 1. - 1.7 * bw, rw) * (1. - smoothstep(1. - 1.3 * bw, 1. - .5 * bw, rw));
          float back = smoothstep(1. - 9. * bw, 1. - 3. * bw, rw) * (1. - smoothstep(1. - 3. * bw, 1. - 1.7 * bw, rw));
          al = max(ring * (.55 + .45 * smoothstep(.25, .65, nn)), back * .35 * smoothstep(.4, .75, nn)); tone = mix(uTea * 1.6, uFoam, .3 + .7 * smoothstep(.3, .7, nn));
        }
        al *= vK.y;
        gl_FragColor = vec4(fogMix(tone * (uSunC * .42 + uSkyC), FOGD) * al, al * .92);
      }`}),d=new h.Mesh(s,f);return d.frustumCulled=!1,d.renderOrder=3,d}function se(r,o){const l=o.length,n=new Float32Array(l*4),e=new Float32Array(l*4),i=new Float32Array(l*4);o.forEach((d,y)=>{n.set(d.a,y*4),e.set(d.b,y*4),i.set(d.c,y*4)});const w=new h.InstancedBufferGeometry,s=new h.PlaneGeometry(2,2);w.index=s.index,w.setAttribute("position",s.attributes.position),w.setAttribute("sA",new h.InstancedBufferAttribute(n,4)),w.setAttribute("sB",new h.InstancedBufferAttribute(e,4)),w.setAttribute("sC",new h.InstancedBufferAttribute(i,4)),w.instanceCount=l;const p=new h.ShaderMaterial({uniforms:{...h.UniformsUtils.clone(h.UniformsLib.fog),...r},fog:!0,transparent:!0,depthWrite:!1,blending:h.CustomBlending,blendSrc:h.OneFactor,blendDst:h.OneMinusSrcAlphaFactor,blendSrcAlpha:h.OneFactor,blendDstAlpha:h.OneMinusSrcAlphaFactor,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      attribute vec4 sA, sB, sC; uniform float uT, uTime, uCycle, uSlabA, uCur, uCurSpeed; uniform vec3 uSun, uWind;
      varying vec2 vUv; varying vec4 vK; varying vec3 vL;
      void main(){
        float type = sC.x, life = sB.w, lt = mod(uT + sA.w, uCycle);
        if (type > 4.5) lt = type < 5.5 ? uSlabA - sA.w : life * .5;
        float k = clamp(lt / life, 0., 1.), a = lt < life && lt >= 0. ? 1. : 0.;
        vec3 p = sA.xyz; vec2 q = position.xy, ext = vec2(mix(sC.y, sC.z, 1. - (1. - k) * (1. - k)));
        vec3 right = normalize(vec3(modelViewMatrix[0][0], modelViewMatrix[1][0], modelViewMatrix[2][0]));
        vec3 up = normalize(vec3(modelViewMatrix[0][1], modelViewMatrix[1][1], modelViewMatrix[2][1]));
        if (type < .5) {                                               // jet: stands on the water, shoots up, collapses
          float rise = smoothstep(0., .18, lt), fall = 1. - smoothstep(.3, 1., k);
          ext = vec2(sC.y * (.55 + .9 * k), sC.z * rise * (.3 + .7 * fall)); q.y = q.y * .5 + .5; up = vec3(0., 1., 0.);
          p.x += uCur * uCurSpeed * .5 * lt; a *= smoothstep(0., .05, k) * (1. - k * k);
        } else if (type < 1.5 || (type > 3.5 && type < 4.5)) {         // ballistic: crown clumps, clods
          p += sB.xyz * lt; p.y -= 4.9 * lt * lt; a *= type < 1.5 ? smoothstep(0., .08, k) * (1. - k) : 1. - smoothstep(.85, 1., k);
        } else if (type > 4.5 && type < 5.5 && sC.w > .72) {           // the slab's splash: thrown water
          p += sB.xyz * lt; p.y -= 4.9 * lt * lt; a *= smoothstep(0., .08, k) * (1. - k);
        } else if (type < 5.5) {                                       // dust: thrown, slowed by the air, taken by the wind
          p += sB.xyz * (1. - exp(-lt * 1.4)) / 1.4 + uWind * lt * (.35 + .65 * k) + vec3(0., .35 * lt, 0.);
          a *= type > 4.5 ? smoothstep(0., .1, k) * pow(1. - k, 1.4) * .95 : smoothstep(0., .12, k) * (1. - k) * (1. - k);
        } else if (type < 6.5) { p.x += 1.5 * sin(uTime * .3 + sC.w * 9.); ext *= 1. + .15 * sin(uTime * .9 + sC.w * 30.); a = .5 + .3 * sin(uTime * .7 + sC.w * 50.); }
        else { up = normalize(sB.xyz); ext = vec2(sC.y, sC.z); a = .75 + .25 * sin(uTime * 1.3 + sC.w * 40.); lt = uTime; }
        vec3 fwd = cross(right, up);
        float dz = -(modelViewMatrix * vec4(p, 1.)).z;
        if (type > .5 && type < 1.5) ext = min(ext, vec2(.014 * dz));       // a clump of drops is never a disc on the screen
        if (type < 1.5) a *= smoothstep(2.6, 6.5, dz);
        if (type > 1.5 && type < 2.5) a *= 1. - .85 * smoothstep(32., 60., dz);       // hoof dust far off is the plume's business: no row of little flames on the bank top
        vL = vec3(dot(uSun, right), dot(uSun, up), dot(uSun, fwd));
        vUv = q; vK = vec4(type, a, sC.w, lt);
        vec4 mvPosition = modelViewMatrix * vec4(p + right * q.x * ext.x + up * q.y * ext.y, 1.);
        gl_Position = a > .003 ? projectionMatrix * mvPosition : vec4(2., 2., 2., 1.);
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform vec3 uSunC, uSkyC, uGndC, uFoam, uDustLit, uDustShade;
      varying vec2 vUv; varying vec4 vK; varying vec3 vL;
      ${Bt}
      ${Vt}
      void main(){
        float type = vK.x, al = 0., r = length(vUv), add = 1.;
        vec3 nn = vec3(vUv, sqrt(max(1. - min(r * r, 1.), 0.))); float lit = clamp(dot(nn, vL) * .6 + .5, 0., 1.);
        vec3 col;
        if (type < .5) {
          al = spray(vUv, vK.z, clamp(vK.w / 1.2, 0., 1.), vK.w);          // vUv.y 0 at the water .. 1 at the top
          col = uFoam * (uSunC * (.3 + .55 * lit) + uSkyC * .8); add = .8;
        } else if (type < 1.5) {
          float n = vn2(vUv * 2.6 + vK.z * 31.);
          al = (1. - smoothstep(.2, 1., r + (n - .5) * 1.1)) * (1. - smoothstep(.7, 1., r)) * .7;
          col = uFoam * (uSunC * (.3 + .6 * lit) + uSkyC * .8); add = .8;
        } else if (type > 3.5 && type < 4.5) {
          al = (1. - smoothstep(.55, 1., r + (vn2(vUv * 3. + vK.z * 9.) - .5) * .5)) * (1. - smoothstep(.8, 1., r));
          col = uDustShade * .5 * (uSunC * (.2 + .6 * lit) + uSkyC);
        } else if (type < 5.5) {
          float n = vn2(vUv * 1.9 + vK.z * 17. + vK.w * .25) * .65 + vn2(vUv * 4.7 - vK.z * 5.) * .35;
          al = (1. - smoothstep(.15, 1., r + (n - .5) * .9)) * (1. - smoothstep(.72, 1., r)) * .55;
          col = mix(mix(uDustShade * 1.6, uDustLit, .45), uDustLit * (.55 + .22 * uSunC), lit);
          if (type > 4.5) { if (vK.z > .72) { col = uFoam * (uSunC * (.3 + .5 * lit) + uSkyC * .8); al *= 1.4; } else col *= vec3(.86, .68, .5); }      // the slab's own splash; its dust is the bank's raw earth
        } else if (type > 6.5) {
          float n = vn2(vec2(vUv.x * 2.4 + vK.z * 9., vUv.y * 1.5 + vK.w * 1.1)), n2 = vn2(vec2(vUv.x * 6. - vK.z * 5., vUv.y * 3.2 + vK.w * 2.3));
          al = (1. - smoothstep(.25, 1., abs(vUv.x) + (n - .5) * .7)) * smoothstep(-1., -.5, vUv.y) * (1. - smoothstep(.45, 1., vUv.y)) * (.3 + .7 * n2) * .62;
          col = mix(mix(uDustShade * 1.6, uDustLit, .5), uDustLit * (.55 + .22 * uSunC), .35 + .65 * n);
        } else {
          al = (1. - smoothstep(0., 1., r)); al *= al * .2;
          col = uFoam * (uSunC * .5 + uSkyC * .8); add = .6;
        }
        al *= vK.y;
        gl_FragColor = vec4(fogMix(col, FOGD) * al, al * add);
      }`}),f=new h.Mesh(w,p);return f.frustumCulled=!1,f.renderOrder=4,f}function xe(r,o,l){const n=r.plume,e=new h.BoxGeometry(1,1,1),i=e.attributes.position;for(let p=0;p<i.count;p++){const f=i.getX(p)*2*n.X0,d=n.y0+(i.getY(p)+.5)*(n.y1-n.y0),y=i.getZ(p)>0?n.Z1:-n.Z0;i.setXYZ(p,f+n.bx+n.lx*(d-n.by),d,y+n.bz+n.lz*(d-n.by))}const w=new h.ShaderMaterial({uniforms:{...h.UniformsUtils.clone(h.UniformsLib.fog),...o},fog:!0,transparent:!0,depthWrite:!1,side:h.BackSide,blending:h.CustomBlending,blendSrc:h.OneFactor,blendDst:h.OneMinusSrcAlphaFactor,blendSrcAlpha:h.OneFactor,blendDstAlpha:h.OneMinusSrcAlphaFactor,vertexShader:`
      varying vec3 vP;
      void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform mat4 projectionMatrix, modelViewMatrix;
      uniform vec3 uCamL, uSun, uSunC, uSkyC, uDustLit, uDustShade; uniform float uTime;
      varying vec3 vP;
      ${Bt}
      ${Vt}
      ${Et}
      void main(){
        vec3 rd = normalize(vP - uCamL + vec3(0., 1e-5, 0.)), roq = dustShear(uCamL), rdq = dustShearDir(rd), sq = dustShearDir(uSun);
        vec2 sp = dustSpan(roq, rdq);
        if (sp.y <= sp.x) discard;
        vec4 clip = projectionMatrix * modelViewMatrix * vec4(uCamL + rd * max(sp.x, .4), 1.);            // depth-test at the point where the ray enters the dust
        gl_FragDepth = clamp(clip.z / max(clip.w, 1e-4) * .5 + .5, 0., 1.);
        float dt = (sp.y - sp.x) / float(${l}), jit = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(.06711056, .00583715))));
        float Tr = 1., glow = 1. + .6 * pow(max(dot(rd, uSun), 0.), 4.);
        // THE PLUME'S OWN LAW OF DISTANCE. Seen from the plain (a hundred metres off and more, F) it is a landmark, not haze: the column is
        // thicker to the eye, the flank on the sun's side of our line of sight stands gold and the rest of it umber in its own shade
        // (billow by billow, by the same noise that shapes it), and the plain's haze takes only a third of what it takes of the ground.
        float F = smoothstep(100., 210., sp.x);
        vec2 sunH = normalize(uSun.xz + vec2(1e-4, 0.)), rdH = normalize(rd.xz + vec2(1e-4, 0.)), perp = sunH - rdH * dot(sunH, rdH);
        float pl = length(perp); perp /= max(pl, 1e-3);
        vec3 C = vec3(0.), litC = dustLitC() * glow * (1. + .34 * F), shC = dustShadeC() * mix(1., .74, F);
        for (int i = 0; i < ${l}; i++) {
          vec3 q = roq + rdq * (sp.x + (float(i) + jit) * dt);
          float hh = (q.y - uPB.y) / (uPY.y - uPB.y), h = clamp(hh, 0., 1.), rad = dustRad(q, h);
          if (rad > -.45 && hh > -.02) {
            vec3 c = vec3(q.x, q.y * .75 - uTime * 2.2, q.z) * .042 + vec3(0., 0., uTime * .015);
            float n = vn3(c) * .5 + vn3(c * 2.4 + 7.) * .32 + vn3(c * 5.6 - 3.) * .18;
            float dn = smoothstep(.0, .16, rad * .8 - .06 + .1 * F + (n - .5) * mix(.9, 1.5, h)) * (1. - smoothstep(mix(.62, .78, F), mix(1., 1.06, F), h + (n - .5) * .6)) * smoothstep(-.015, .03, hh);
            dn *= uPDen * mix(.75, 1., smoothstep(0., .2, h)) * mix(1., .65, h) * (1. + 1.5 * F);
            if (dn > 0.) {
              float ns = vn3(c * 2.4 + 7. + sq * .55) * .6 + vn3(c + sq * .3) * .4;                                // the billows between this point and the sun
              float Ts = exp(-(dustEnv(q + sq * 8.) * (.15 + 2.2 * ns * ns) + dustEnv(q + sq * 24.) * 1.5) * 2.4);
              float sideS = dot(vec2(q.x + 7. * h * sin(h * 4.6 + .6), q.z + 5.), perp) / 19.;                      // -1 on the far flank .. +1 on the sun's
              Ts = mix(Ts, smoothstep(-.08, .6, sideS * pl + (n - .5) * 1.25 + (ns - .5) * .5 + .2 * h), F * .92);
              float a = 1. - exp(-dn * dt);
              C += Tr * a * mix(shC, litC, Ts); Tr *= 1. - a;
            }
          }
        }
        float al = 1. - Tr;
      #ifdef USE_FOG
        C = mix(C, fogColor * al, fogAt(sp.x + 15.) * mix(1., .3, F));
      #endif
        gl_FragColor = vec4(C, al);
      }`}),s=new h.Mesh(e,w);return s.frustumCulled=!1,s.renderOrder=2,s}function we(r,o,l,n,e){const i=[],w=[],s=[];for(let U=0;U<5;U++){const a=U/5*Math.PI*2+r()*.8,q=r.range(.15,.5),W=r.range(.5,1),A=r.range(.045,.085),V=i.length/3,N=Math.cos(a),z=Math.sin(a),Q=-z*A,E=N*A;i.push(Q,0,E,-Q,0,-E,N*q*.35+Q*.7,W*.55,z*q*.35+E*.7,N*q*.35-Q*.7,W*.55,z*q*.35-E*.7,N*q,W,z*q),w.push(0,0,.55,.55,1),s.push(V,V+1,V+2,V+1,V+3,V+2,V+2,V+3,V+4)}const f=[],d=[];for(let U=0;f.length/4<e&&U<e*30;U++){const a=r.range(-63,63),q=r.chance(.45),W=o.lipZ(a),A=q?W-r.range(.1,2.5):r.range(Yt+2,W-.3);r()<o.trample(a,A)*1.2||o.endF(a)<.25||(f.push(a,o.apronY(a,A)-.04,A,r.range(.7,1.35)),d.push(r()*6.283,r(),r(),0))}const y=new h.InstancedBufferGeometry;y.setIndex(s),y.setAttribute("position",new h.Float32BufferAttribute(i,3)),y.setAttribute("aH",new h.Float32BufferAttribute(w,1)),y.setAttribute("gA",new h.InstancedBufferAttribute(new Float32Array(f),4)),y.setAttribute("gB",new h.InstancedBufferAttribute(new Float32Array(d),4)),y.instanceCount=f.length/4;const S=new h.ShaderMaterial({uniforms:{...h.UniformsUtils.clone(h.UniformsLib.fog),...n,uRoot:{value:new h.Color(l[2]).lerp(new h.Color("#3b2a20"),.35)},uTip:{value:new h.Color(l[1]).lerp(new h.Color(l[0]),.35)}},fog:!0,side:h.DoubleSide,transparent:!0,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      attribute float aH; attribute vec4 gA, gB; uniform float uTime; uniform vec3 uWind;
      varying float vH, vS; varying vec3 vW;
      void main(){
        float c = cos(gB.x), s = sin(gB.x); vec3 p = position * gA.w; p.xz = vec2(p.x * c - p.z * s, p.z * c + p.x * s);
        float gust = .5 + .5 * sin(uTime * 1.7 + gA.x * .21 + gA.z * .13 + gB.y * 3.) + .3 * sin(uTime * 4.3 + gB.y * 40.);
        p.xz += uWind.xz * aH * aH * (.1 + .12 * gust) * gA.w; p.y -= aH * aH * .06 * gust;
        vH = aH; vS = gB.z; vW = p + gA.xyz;
        vec4 mvPosition = modelViewMatrix * vec4(p + gA.xyz, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform vec3 uSun, uSunC, uSkyC, uGndC, uRoot, uTip, uDustLit, uDustShade, uCamL; varying float vH, vS; varying vec3 vW;
      ${Et}
      void main(){
        vec3 alb = mix(uRoot, uTip * (.8 + .4 * vS), smoothstep(0., .8, vH));
        vec3 col = alb * (uSunC * (.3 + .4 * vH) + mix(uGndC, uSkyC, .4 + .5 * vH));
        vec4 dv = dustVeil(vW, uCamL); col = mix(col, dv.rgb, dv.a);
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`}),g=new h.Mesh(y,S);return g.frustumCulled=!1,g.renderOrder=2.6,{mesh:g,triangles:s.length/3*y.instanceCount}}async function Se(r,o={}){const l=r.rng,n=t=>new h.Color(t),e=Array.isArray(o.palette)&&o.palette.length>=6?o.palette.slice():$t.slice();for(;e.length<7;)e.push($t[e.length]);const i=Qt[o.hour==="night"?"dusk":o.hour]||Qt.golden,w=o.weather||"haze",s=o.season==="july",p=r.quality?.detail??1,f=Math.min(1.3,Math.max(.7,o.density??1)),d=l.range(20.5,24.5),y=l.int(2,4),S=[0,1,2,3,4].map(()=>l()*6.283),g=l.range(.0034,.005),U=[];for(let t=0;t<y;t++)U.push({x:-d+(t+.5+l.range(-.3,.3))*(2*d/y),w:l.range(2.4,3.8),d:l.range(1.2,2)});const a={half:d,chutes:U,waterY:s?.9:0,current:o.current===-1?-1:1,curSpeed:s?2.1:1.4,cycle:Math.max(20,o.cycle??26),paleY:l.range(6.4,8.6),seamY:l.range(2.8,4.6),slabX:-(d+13),chute:t=>{let k=0;for(const P of U)k=Math.max(k,Math.exp(-(((t-P.x)/P.w)**2)));return k},notch:t=>{let k=0;for(const P of U)k=Math.max(k,P.d*Math.exp(-(((t-P.x)/P.w)**2)));return k},lipZ:t=>g*t*t+1.3*Math.sin(.115*t+S[0])+.6*Math.sin(.31*t+S[1])-1.7*a.chute(t),topY:t=>kt+.45*Math.sin(.06*t+S[2])+.22*Math.sin(.17*t+S[3]),lipY:t=>a.topY(t)-a.notch(t),runR:t=>3.3+.6*Math.sin(.21*t+S[4])+2.9*a.chute(t),endF:t=>1-xt(52,66,Math.abs(t)),trample:t=>xt(d+10,d+2,Math.abs(t)),apronY:(t,k)=>{const P=a.endF(t),O=a.lipZ(t);return(a.topY(t)-a.notch(t)*xt(O-10,O,k))*P}},q=(l.chance(.7)?1:-1)*a.current*l.range(.42,.62),W=w==="rains"?.5:w==="storm"?1.3:1;a.plume={bx:l.range(-3,3),by:kt,bz:-20,lx:q,lz:-l.range(.1,.24),X0:d+17,Z0:30,Z1:20,y0:kt-.5,y1:kt+(w==="storm"?70:61)};const A=new h.Vector3().fromArray(o.sunDir||i.sun).normalize(),V=n(i.lit||e[0]),N=n(e[2]).lerp(n("#b9a78c"),.5).multiplyScalar(w==="rains"?.6:.85),z={uT:{value:0},uTime:{value:0},uCycle:{value:a.cycle},uGait:{value:1},uSlabX:{value:new h.Vector3(-(d+13),9.5,0)},uSlabP:{value:0},uWaterY:{value:a.waterY},uSlab:{value:0},uSlabA:{value:-1},uWaveP:{value:new h.Vector4(0,0,0,0)},uKeep:{value:new h.Vector3(0,-999,5.5)},uCur:{value:a.current},uCurSpeed:{value:a.curSpeed},uSun:{value:A},uSunC:{value:n(i.sunC).multiplyScalar(i.sunI)},uSkyC:{value:n(i.sky).multiplyScalar(i.skyI)},uGndC:{value:n(i.gnd).multiplyScalar(i.gndI)},tCloud:{value:null},uTCloud:{value:new h.Vector4(0,0,1/900,0)},uRim:{value:1},uShade:{value:0},uDustLit:{value:V},uDustShade:{value:n(i.shade)},uFoam:{value:n(e[4]).multiplyScalar(.92)},uTea:{value:N},uCamL:{value:new h.Vector3(0,5,60)},uWind:{value:new h.Vector3(q*2.2,0,-.9)},uSh:{value:Array.from({length:Ut},()=>new h.Vector4(0,-1e3,0,0))},uHalf:{value:d},uBank:{value:new h.Vector4(2.2,g,kt,q)},uCut:{value:new h.Vector4(-84,36,0,0)},uBankLit:{value:new h.Color},uSkyRef:{value:n(e[5]).lerp(n("#ffffff"),.25)},uHaze:{value:n(e[5]).lerp(n(e[1]),.55).lerp(n("#ffffff"),.3)},uPDen:{value:o.plume===!1?0:.1*W},uPB:{value:new h.Vector3(a.plume.bx,a.plume.by,a.plume.bz)},uPL:{value:new h.Vector2(a.plume.lx,a.plume.lz)},uPBox:{value:new h.Vector3(a.plume.X0,a.plume.Z0,a.plume.Z1)},uPY:{value:new h.Vector2(a.plume.y0,a.plume.y1)}};z.uSlabP.value=a.lipZ(a.slabX)+a.runR(a.slabX);const Q=()=>z.uBankLit.value.set(e[2]).multiply(z.uSunC.value).multiplyScalar(.25+.75*Math.max(.1,A.z)).add(n(e[2]).multiply(z.uSkyC.value));Q();const E=new h.Group;E.name="mara-fall";let K=0;const B=await ve(r,a,e,z);E.add(B.mesh),K+=B.triangles,await r.yield();const F=o.cast==="zebra",L=Math.round((150+l.int(-5,5))*f),T=F?Math.round(L/3):l.int(7,11),Z=L-T,$=(t,k)=>{const P=k.range(.62,1),O=k.range(-.05,.06);return t?new h.Color(2.3*P,1.75*P,1.2*P):new h.Color(P*(1.03+O),P,P*(.98-O))},_=Zt(l,a,Z,{calf:t=>t%4===3,scale:1,swimLength:o.swimLength??50,swimTo:o.swimTo,tint:$});await r.yield();const j=Math.max(1,Math.round(T/6)),mt=Zt(l,a,T,{calf:()=>!1,scale:.94,swimLength:o.swimLength??50,swimTo:o.swimTo,tint:(t,k)=>{const P=k.range(.66,.8);return new h.Color(P,P*.95,P*.86)},t0:F?null:t=>t%j*(a.cycle/j)+Math.floor(t/j)*l.range(.5,.8)+3});await r.yield();const ht=ne(e,"w",0),X=ne(e,"z",0);await r.yield();const st=t=>new h.ShaderMaterial({uniforms:{...h.UniformsUtils.clone(h.UniformsLib.fog),...z},fog:!0,vertexColors:!0,side:h.DoubleSide,transparent:!0,defines:t?{ZEBRA:1}:{},vertexShader:fe,fragmentShader:de}),J=new h.Mesh(It(ht,_),st(!1)),tt=new h.Mesh(It(X,mt),st(!0));J.frustumCulled=tt.frustumCulled=!1,J.renderOrder=tt.renderOrder=2.5,E.add(J,tt),K+=ht.index.count/3*Z+X.index.count/3*T,await r.yield();const u=11.5,v=Math.round(64*Math.min(1.2,f+.25)),G=Math.round(56*Math.min(1.2,f+.25)),R=Zt(l,a,v,{calf:t=>t%5===4,scale:1,swimLength:16,tint:$,cycle:u}),Y=pe(l,a,G,30),b=st(!1),lt=st(!1);b.uniforms.uCycle={value:u},lt.uniforms.uCycle={value:30},lt.uniforms.uGait={value:.4},lt.uniforms.uSlabX={value:new h.Vector3(a.slabX,9.5,1)};const zt=ie(e,2),dt=new h.Mesh(It(zt,R),b),ft=new h.Mesh(It(zt,Y),lt);dt.frustumCulled=ft.frustumCulled=!1,dt.renderOrder=ft.renderOrder=2.5,E.add(dt,ft),K+=zt.index.count/3*(v+G);const Mt=_.land.concat(mt.land),D=Mt.concat(R.land);await r.yield();const yt=[],Ct=[],At=[],m=(t,k)=>l.range(t,k),Tt=p<1?p:1;for(const t of R.land){const k=a.waterY;At.push({a:[t.x+m(-.4,.4),k,t.z+.2,t.t0-t.tL],b:[0,0,0,m(1.05,1.4)],c:[0,m(1.3,2)*t.size,m(3,4.6)*t.size,l()]});for(let P=0;P<Math.round(4*Tt);P++){const O=m(0,6.283),I=m(1,3.6);At.push({a:[t.x,k+.2,t.z,t.t0-t.tL],b:[Math.cos(O)*I,m(4.5,7.6),Math.sin(O)*I+1,m(.85,1.25)],c:[1,m(.16,.3),m(.45,.8),l()]})}At.push({a:[t.x,t.yLip+.4,t.zLip-.3,t.t0-t.tA],b:[m(-.5,.5),1.2,2.4,m(2.2,3)],c:[2,.8,m(2.6,3.6),l()]});for(let P=0;P<2;P++){const O=m(.5,2.6),I=t.yLip+.1,rt=(O+Math.sqrt(O*O+19.6*Math.max(.2,I-k)))/9.8,ut=m(.1,.24);At.push({a:[t.x+m(-.7,.7),I,t.zLip+(t.slider?1.5:0),t.t0-t.tA-(t.slider?t.ts*.5:0)],b:[m(-1.2,1.2),O,m(1.5,4.2),rt],c:[4,ut,ut,l()]})}}await r.yield();for(const t of Mt){const k=a.waterY,P=l();for(let I=0;I<2;I++)yt.push({a:[t.x+m(-.4,.4),k,t.z+.2+I*.5,t.t0-t.tL-I*.07],b:[0,0,0,m(1.05,1.4)],c:[0,m(1.2,1.9)*t.size,m(2.9,4.4)*t.size*(I?.7:1),l()]});for(let I=0;I<Math.round(7*Tt);I++){const rt=m(0,6.283),ut=m(1,3.6);yt.push({a:[t.x,k+.2,t.z,t.t0-t.tL],b:[Math.cos(rt)*ut,m(4.5,7.6),Math.sin(rt)*ut+1,m(.85,1.25)],c:[1,m(.16,.3),m(.45,.8),l()]})}for(let I=0;I<2;I++){const rt=m(3,36),ut=t.zLip-rt;yt.push({a:[t.x+m(-.5,.5),a.apronY(t.x,ut)+.4,ut,t.t0-(t.tA-rt/t.v)],b:[m(-.6,.6),m(.4,1.2),-1.5,m(3,4.4)],c:[2,m(.6,.9),m(3,4.2),l()]})}yt.push({a:[t.x,t.yLip+.4,t.zLip-.3,t.t0-t.tA],b:[m(-.5,.5),1.2,2.4,m(2.2,3)],c:[2,.8,m(2.6,3.6),l()]});const O=(I,rt,ut,Wt)=>{const Ft=Wt,Kt=(Ft+Math.sqrt(Ft*Ft+19.6*Math.max(.2,rt-k)))/9.8,Rt=m(.1,.24);yt.push({a:[t.x+m(-.7,.7),rt,ut,t.t0-I],b:[m(-1.2,1.2),Ft,m(1.5,4.2),Kt],c:[4,Rt,Rt,l()]})};if(t.slider){for(let I=0;I<4;I++){const rt=(I+m(.1,.9))/4,ut=t.tEnd*Math.pow(rt,1.5);yt.push({a:[t.x+m(-.5,.5),t.yLip*(1-ut)+.3,t.zLip+t.R*Dt(ut)+.6,t.t0-(t.tA+t.ts*rt)],b:[m(-.5,.5),-2.4,2.2,m(2.1,2.9)],c:[2,.8,m(2.8,4),l()]})}for(let I=0;I<5;I++){const rt=l(),ut=t.tEnd*Math.pow(rt,1.5);O(t.tA+t.ts*rt,t.yLip*(1-ut)+.2,t.zLip+t.R*Dt(ut)+.3,m(-1,2))}}else for(let I=0;I<2;I++)O(t.tA+m(-.05,.1),t.yLip+.1,t.zLip,m(.5,2.6));Ct.push({a:[t.x,t.z+.4,t.t0-t.tL,0],b:[0,0,m(5,6.5),m(3.4,4.8)*t.size],c:[0,P,0,0]}),Ct.push({a:[t.x,t.z,t.t0-t.tL,1],b:[t.vx,t.vS,t.swimT,t.size],c:[t.vImp,P,0,0]})}for(const t of U)for(let k=0;k<3;k++){const P=t.x+(k-1)*t.w*.45,O=a.lipY(P),I=a.runR(P),rt=.46,ut=Math.hypot(O,I);yt.push({a:[P,O*(1-rt)+.5,a.lipZ(P)+I*Dt(rt)+.9,0],b:[0,O,-I,1],c:[7,m(1.6,2.4),ut*m(.42,.5),l()]})}for(let t=0;t<14;t++){const k=m(-d,d);yt.push({a:[k,a.waterY+1.4,a.lipZ(k)+a.runR(k)+m(2,8),0],b:[0,0,0,1],c:[6,m(5,8),m(5,8),l()]})}for(let t=0;t<90;t++){const k=a.slabX+m(-11,11),P=t%3===0,O=m(0,1);yt.push(P?{a:[k,m(.3,1.2),a.lipZ(k)+m(7,12),1.75+m(0,.5)],b:[m(-3,3),m(6,11),m(3,9),m(1.3,1.9)],c:[5,.3,m(.5,1),m(.75,1)]}:{a:[k+m(-3,3),.6+O*(kt-1),a.lipZ(k)+m(1,4)+(1-O)*m(2,8),.15+(1-O)*1.5+m(0,.6)],b:[m(-2.5,2.5),m(.4,2.4),m(2,6.5),m(5,7.5)],c:[5,m(1.6,2.4),m(5,9),m(0,.7)]})}for(let t=0;t<2;t++)Ct.push({a:[a.slabX,a.lipZ(a.slabX)+8,t*.9,2],b:[0,0,7.5-t*2,34],c:[0,l(),0,0]});await r.yield();const c=o.water===!1?null:me(a,z);c&&(E.add(c),K+=2);const x=o.plume===!1?null:xe(a,z,Math.max(12,Math.round(26*p)));x&&(E.add(x),K+=12);const M=ye(a,z,Ct),C=se(z,yt),H=se({...z,uCycle:{value:u}},At);M.material.side=C.material.side=H.material.side=h.DoubleSide,E.add(M,C,H),K+=(Ct.length+yt.length+At.length)*2,await r.yield();const ot=we(l,a,e,z,Math.round(460*p));E.add(ot.mesh),K+=ot.triangles;const vt=new h.Matrix4,et=(t,k,P)=>{vt.copy(E.matrixWorld).invert(),z.uCamL.value.setFromMatrixPosition(P.matrixWorld).applyMatrix4(vt)};E.traverse(t=>{t.isMesh&&(t.onBeforeRender=et)}),await r.yield();let at=0,gt=!1;const nt={x:0,y:0,z:0,pitch:0,phase:0,vis:!0},it=()=>{let t=0;for(let k=0;k<D.length&&t<Ut;k++)Gt(a,D[k*7%D.length],at,nt),(nt.phase===1||nt.phase===2)&&z.uSh.value[t++].set(nt.x,nt.y,nt.z,nt.pitch);for(;t<Ut;t++)z.uSh.value[t].set(0,-1e3,0,0)};let pt=0,ct=99;for(let t=0;t<68;t++){let k=0;for(const P of D){const O=Gt(a,P,t*.5,nt).phase;(O===1||O===2)&&k++}pt+=k/68,ct=Math.min(ct,k)}await r.yield();const St=a.lipZ(0)+a.runR(0),Nt=[];for(let t=-66;t<=66;t+=6)Nt.push([t,a.lipY(t)*a.endF(t),a.lipZ(t)]);const wt=a.plume;return{object:E,radius:34,height:27,center:new h.Vector3(0,18,2),ground:!0,groundY:-.6,cycle:a.cycle,count:Mt.length,uniforms:z,stats:{triangles:Math.round(K),airborneMean:pt,airborneMin:ct,buildMs:0},anchors:{fall:{center:[0,a.waterY,St],halfWidth:d,lipY:kt,normal:[0,0,1]},viewpoints:{river:{position:[-8,a.waterY+.7,St+40],lookAt:[2,9,0]},leap:{position:[-d-14,kt+1.5,a.lipZ(-d-14)+5],lookAt:[0,5,St+4]},plain:{position:[0,kt+1.5,Yt-4],lookAt:[0,kt+14,0]}},flyThrough:[[-78,a.waterY+.7,St+44],[-40,a.waterY+.7,St+39],[0,a.waterY+.7,St+36],[40,a.waterY+.7,St+38],[78,a.waterY+.7,St+43]],plume:{base:[wt.bx,wt.by,wt.bz],top:[wt.bx+wt.lx*58,wt.by+58,wt.bz+wt.lz*58],radius:30},lip:Nt,ends:[[-66,0,a.lipZ(-66)],[66,0,a.lipZ(66)]],slab:[a.slabX,kt,a.lipZ(a.slabX)],portalSeat:{position:[0,a.waterY+7,St+72],facing:[0,0,-1],radius:7,note:"fallback only: the brief seats the portal between the figs on the far bank"},sunDir:A.toArray(),waterY:a.waterY,current:[a.current,0,0],shape:{lipZ:a.lipZ,lipY:a.lipY,topY:a.topY,endF:a.endF,runR:a.runR,half:d,K:g,zBack:Yt,curSpeed:a.curSpeed,windX:q}},setProgress(t){gt=!0,at=t*(o.duration??40)},setClock(t){gt=!0,at=t},setCollapse(t,k){z.uSlab.value=Math.min(1,Math.max(0,t));const P=k??t*2.5,O=P-1.9;z.uSlabA.value=t>0?P:-1,z.uWaveP.value.set(a.slabX,a.lipZ(a.slabX)+8,3+8.5*Math.max(O,0),t>0?Math.min(1,Math.max(0,O/.25))*(1-Math.min(1,Math.max(0,(O-3.5)/3.5))):0)},setKeepOut(t,k){z.uKeep.value.x=t,z.uKeep.value.y=k},setLight(t={}){t.sunDir&&A.fromArray(t.sunDir.isVector3?t.sunDir.toArray():t.sunDir).normalize(),(t.sunColor||t.sunIntensity!==void 0)&&z.uSunC.value.set(t.sunColor||i.sunC).multiplyScalar(t.sunIntensity??i.sunI),(t.sky||t.skyIntensity!==void 0)&&z.uSkyC.value.set(t.sky||i.sky).multiplyScalar(t.skyIntensity??i.skyI),(t.ground||t.groundIntensity!==void 0)&&z.uGndC.value.set(t.ground||i.gnd).multiplyScalar(t.groundIntensity??i.gndI),t.dustLit&&z.uDustLit.value.set(t.dustLit),t.dustShade&&z.uDustShade.value.set(t.dustShade),Q()},animalAt(t,k,P={}){return Gt(a,Mt[t],k,P)},clearance(t,k,P,O){let I=1e9;const rt=z.uKeep.value.z;for(const ut of Mt){if(Gt(a,ut,O,nt),!nt.vis)continue;let Wt=nt.x-t,Ft=nt.z-P;if(nt.phase===3){const Kt=Math.hypot(Wt,Ft),Rt=Math.max(0,1-Kt/rt),Xt=1+.62*rt*Rt*Rt/Math.max(Kt,.05);Wt*=Xt,Ft*=Xt}I=Math.min(I,Math.hypot(Wt,nt.y-k,Ft)-1.1*ut.size)}return I},update(t,k){gt||(at=k),z.uT.value=at,z.uTime.value=k,it()},dispose(){}}}export{de as ANIMAL_FRAG,re as CLOUD_GLSL,Et as DUST_GLSL,Bt as GLSL_COMMON,Vt as GLSL_FOGMIX,ee as GLSL_SHADOW,ae as HEAD_W,le as SWIM,qt as SWIM_LV,te as WATER_GLSL,Lt as WET,oe as bakeSwim,ne as beastGeometry,Se as buildHero,Me as markHead,ie as wildebeestGeometry};
