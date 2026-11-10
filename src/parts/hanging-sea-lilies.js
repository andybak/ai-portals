import*as t from"three";import{clamp as oe,lerp as je,smoothstep as Se}from"../kit/core.js";const Je=["#2A9478","#5FC6A0","#E9F6E4","#F2B631","#C9577A","#3A2A1E","#0A1F1E"],fe=20*Math.PI/180,X=9,ce=.35,qe=6*Math.PI/180,He=2*Math.PI/7,ue=`
uniform float uTime, uGain, uHalf, uWarm;
uniform vec3 uSunDir, uCamL, uWUp, uWLevel, uWDown, uWSilver;
vec3 waterColor(vec3 d, float y){
  // Three bands and two keys, so no frame is one teal: a pale sunlit layer under the surface that turns GOLD-GREEN
  // toward the sun, jade at eye level near the surface, and a blue deep: the level tone itself goes from jade to a
  // dusk blue as the line of sight ends deeper (y), and looking down it falls to a dark blue-green.
  float up = smoothstep(-.04, .6, d.y), dn = smoothstep(-.02, .72, -d.y);
  float deepK = clamp(-y/34., 0., 1.), dk = smoothstep(.12, .8, deepK);
  vec3 lvl = mix(uWLevel, uWLevel*vec3(.42, .62, 1.12) + vec3(0., .0, .03), dk);
  vec3 c = mix(lvl, uWUp, up);
  c = mix(c, uWSilver, smoothstep(.45, 1., d.y)*.5);
  c *= 1. + .28*up;
  c = mix(c, mix(uWDown, uWDown*vec3(.55, .8, 1.25), dk), dn*.94);
  c *= mix(1.1, .5, deepK);                                   // darker with depth
  float s = max(dot(d, uSunDir), 0.); s *= s; s *= s;          // the water glows toward the sun
  // THE WARM KEY (second polish, bolder): toward the sun the whole upper water is honey-gold, falling through
  // gold-green to jade at a right angle to it; away from the sun the water is a cooler, bluer jade. So the flight
  // changes key with its heading: gold when we swim into the light, blue-jade with the sun behind, indigo in the deep.
  vec3 sl = uSunDir*vec3(1., .3, 1.); sl /= max(length(sl), 1e-4);
  float sd = dot(d, sl), w = max(sd, 0.); w = w*w*w*smoothstep(-.12, .42, d.y)*(1. - .7*dk)*uWarm;   // a glow high in the water toward the sun; level water stays jade behind the crowns
  w *= 1. - .55*smoothstep(.45, .95, d.y);                      // straight up it is the window's business, not the water's
  // (fifth polish) CLEAN light: the wide lobe only lifts the jade to a pale, luminous aquamarine (no hue shift, so
  // never olive); the gold is a tight, bright core where the sun itself burns through, laid in as light, not as a tint
  float wc = w*w; wc *= wc*sqrt(max(w, 0.));                    // about the 13th power of the cosine: a core 25 degrees wide
  c = mix(c, c*vec3(.92, 1.06, 1.02) + vec3(.05, .16, .13), clamp(w*1.2, 0., 1.)*.7);
  c = mix(c, vec3(1.42, .86, .22)*(.6 + .9*dot(c, vec3(.3, .5, .2))), clamp(wc*1.6, 0., 1.)*.9);
  float aw = max(-sd, 0.); aw = aw*aw*(1. - .5*up)*uWarm;       // the side away from the sun: cooler and a step deeper
  c = mix(c, c*vec3(.62, .86, 1.16), clamp(aw, 0., 1.)*.7);
  return c*uGain*(1. + .3*s*s + .3*w*w);
}
float waterT(vec3 pL){ return exp2(-distance(pL, uCamL)/max(uHalf, 1.)); }
vec3 waterFade(vec3 col, vec3 pL){
  vec3 d = pL - uCamL; float l = max(length(d), 1e-4);
  d /= l;
  return mix(waterColor(d, uCamL.y + d.y*30.), col, exp2(-l/max(uHalf, 1.)));   // the same call the dome makes: no veil
}
float logShade(vec3 p){                                        // 0 in the blade of shadow under the trunk, 1 in sun
  float k = -p.y/max(uSunDir.y, .25);
  vec3 q = p + uSunDir*k;
  float inZ = 1. - smoothstep(.4, 1.0 + k*.02, abs(q.z));
  float inX = 1. - smoothstep(-.4, .5, abs(q.x) - ${X.toFixed(1)});
  float deep = 1. - smoothstep(14., 24., k);
  return 1. - inZ*inX*deep*.82;
}
float caust(vec3 p){                                           // soft net, cells about 0.6 m, drifting 0.3 m/s
  vec2 q = p.xz*5.2 + p.y*vec2(1.9, 1.3) + uTime*vec2(1.5, .9);
  q += 1.1*sin(q.yx*.57 + uTime*.35);
  float v = abs(sin(q.x) + sin(q.y) + sin((q.x + q.y)*.71 + 1.3));
  float net = 1. - smoothstep(0., .9, v);
  return net*smoothstep(-13., -3., p.y);
}
float hash11(float n){ return fract(sin(n*12.9898 + 4.1414)*43758.5453); }
`,Ke=`
uniform float uHeave, uRollK;
float rollAt(float t){ return uRollK*${qe.toFixed(5)}*sin(${He.toFixed(5)}*t); }
vec3 stemPos(vec4 root, vec4 shp, float t){
  float L = root.z, d = t*L;
  float lagT = uTime - d/3.;                                   // whatever the log does runs down the rope at 3 m/s
  float ra = rollAt(lagT), cr = cos(ra), sr = sin(ra);
  vec3 r0 = vec3(root.x, -${(ce*.93).toFixed(3)}, root.y);
  vec3 rr = vec3(r0.x, r0.y*cr - r0.z*sr, r0.y*sr + r0.z*cr);
  float keep = exp(-d/9.);
  vec3 p = r0 + (rr - r0)*keep + vec3(0., uHeave*keep, 0.);     // d = 0: exactly on the rolling, heaving wood
  float da = shp.y - shp.x;                                    // never zero: the builder keeps |da| >= 0.08
  float al = shp.x + da*t;
  float zi = (cos(shp.x) - cos(al))/da, yi = (sin(al) - sin(shp.x))/da;
  float cx = cos(shp.z), sx = sin(shp.z);
  p += L*vec3(sx*t, -yi*cx, -zi);
  float ph = uTime*.9 - d*.30 + root.w;
  float amp = shp.w*(.022*d + .05*smoothstep(0., 3., d));
  p.x += amp*sin(ph) + amp*.35*sin(ph*2.3 + root.w*3.);
  p.z += amp*.8*sin(ph*.83 + 1.7 + root.w*2.) - ra*keep*d*.25;
  // (fifth polish) a long rope is LIMP: a second, shorter wave (9 m long, creeping down it) lays a lazy S along it,
  // so no stalk is ever a dead-straight rod in any view
  float ph2 = uTime*.5 - d*.6 + root.w*2.7, amp2 = shp.w*min(.045*d, .5)*smoothstep(1.5, 4.2, distance(p, uCamL));   // (it straightens within 4 m of the eye: the path law holds)
  p.x += amp2*sin(ph2); p.z += amp2*.75*cos(ph2*1.13 + root.w);
  return p;
}
vec3 stemTan(vec4 root, vec4 shp, float t){
  float e = .012;
  vec3 a = stemPos(root, shp, max(t - e, 0.)), b = stemPos(root, shp, min(t + e, 1.));
  return (b - a)/max(length(b - a), 1e-5);
}
`;function me(e,o,l,s,n,a,u,h){const m=n-s,y=s+m*u,D=(Math.cos(s)-Math.cos(y))/m,_=(Math.sin(y)-Math.sin(s))/m;return h.set(e+l*Math.sin(a)*u,-ce*.93-l*_*Math.cos(a),o-l*D)}function W(e){return new t.Color(e)}function et(e,o){const l=W(e[1]),s=W(e[0]),n=W(e[6]),a=W(e[2]);return{uTime:{value:0},uGain:{value:1.55},uHalf:{value:55},uHeave:{value:0},uSunDir:{value:o.clone()},uCamL:{value:new t.Vector3(0,-6,60)},uWUp:{value:l},uWLevel:{value:s},uWDown:{value:n},uWSilver:{value:a},uWakePos:{value:new t.Vector3(0,500,0)},uWakeDir:{value:new t.Vector3(0,0,-1)},uWarm:{value:1},uPx:{value:.0015},uAmbient:{value:.55},uSun:{value:1},uRollK:{value:1}}}function ie(e,o,l,s,n={}){return new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...e,...o},vertexShader:l,fragmentShader:s,fog:!0,...n})}const we=e=>e*Math.tan(fe);function Ie(e,o){const l=oe((e-Math.PI/2)/(3.5*Math.PI),0,1),s=je(-5,-15,l),n=je(6,5,l);return o.set(n*Math.cos(e),s,we(s)-n*Math.sin(e))}function tt(){const e=(A,i,x)=>new t.Vector3(A,i,x),o=[e(-13,-4.2,2.4),e(-10.5,-3.6,2.2),e(-5,-3.6,2.2),e(0,-3.6,2.2),e(5,-3.6,2.2),e(9.5,-3.8,2.2)],l=[e(11.9,-3.9,1.2),e(12.6,-4,-.8),e(11.7,-4.15,-2.9),e(9.5,-4.3,-3.9),e(6.5,-4.5,-5.3),e(3.2,-4.75,-6.9)],s=[];for(let A=0;A<=56;A++)s.push(Ie(Math.PI/2+A/56*3.5*Math.PI,e(0,0,0)));const n=s[s.length-1],a=[e(n.x+.3,-15.6,n.z-5),e(n.x+1.8,-15.9,n.z-11)],u=Math.cos(fe),h=Math.sin(fe),m=e(-u,-h,0),y=e(0,-20.6,-6.9),D=y.clone().addScaledVector(m,10),_=[];for(let A=0;A<=12;A++)_.push(D.clone().addScaledVector(m,-60+A*5));const p=[Math.PI,2*Math.PI,3*Math.PI,4*Math.PI];return{underLog:o,leadIn:l,helix:s,exit:a,dive:_,diveDir:m,under:y,portal:D,gateTh:p,all:[...o,...l,...s,...a,..._]}}function $e(e,o){let l=1e9;for(const s of[e.underLog,e.leadIn,e.helix,e.exit,e.dive])for(let n=0;n<s.length-1;n++){const a=s[n],u=s[n+1],h=u.x-a.x,m=u.y-a.y,y=u.z-a.z,D=oe(((o.x-a.x)*h+(o.y-a.y)*m+(o.z-a.z)*y)/(h*h+m*m+y*y),0,1),_=a.x+h*D-o.x,p=a.y+m*D-o.y,A=a.z+y*D-o.z,i=_*_+p*p+A*A;i<l&&(l=i)}return Math.sqrt(l)}function Be(e,o,l,s,n,a){const u=new t.Vector3;let h=.16,m=.52,y=2;for(let _=0;_<22;_++){const p=(h+m)/2;me(0,0,1,p+s,p-s,0,1,u),y=(-o-ce*.93)/((Math.sin(p+s)-Math.sin(p-s))/(2*s)),me(0,0,y,p+s,p-s,0,1,u),-u.z<-l?h=p:m=p}const D=(h+m)/2;return{rx:e,rz:0,L:y,a0:D+s,a1:D-s,xl:0,sw:a,ph:n,gate:1}}async function ot(e,o,l,s){const n=s>300?80:96,a=[],u=new t.Vector3,h=[],m=i=>18*(1-.62*Math.pow(Math.abs(i)/3.5,1.6));l.gateTh.forEach((i,x)=>{const J=Ie(i,new t.Vector3);for(let j=0;j<4;j++){const U=j<2?-1:1,f=j%2?1:-1,z=o.range(1.8,2.2),S=J.y+f*o.range(.25,.6)-.1,C=we(S)+f*U*o.range(.1,.35)*Math.min(1,-S/8);a.push(Be(J.x+U*z,S,C,o.range(.1,.15),o.range(0,6.28),o.range(.7,1)))}});for(let i=0;i<6;i++){const x=-1.7+i*.85+o.range(-.15,.15),J=i%2?1:-1,j=l.under.y+(x-l.under.x)*Math.tan(fe),U=Math.max(j+o.range(1.7,2.2),-18.6);a.push(Be(x,U,l.under.z+J*o.range(1,1.6),.12,o.range(0,6.28),.8))}for(const i of a)me(i.rx,i.rz,i.L,i.a0,i.a1,i.xl,1,u),h.push(u.clone());const y=Math.round(s*.6)-22,D=Math.round(s*.2),_=[[y,0],[D,1],[D,-1]];for(const[i,x]of _)for(let J=0;J<i;J++){let j=null;for(let U=0;U<44;U++){const f=o(),z=o(),S=o(),C=o.range(0,6.28),G=o.gauss(),P=o.gauss(),r=o.range(.09,.16),d=o.range(.6,1.15),g=o.range(-.2,.2);let c,k;x===0?(c=(f*2-1)*3.5,c=Math.sign(c)*Math.pow(Math.abs(c)/3.5,.85)*3.5,k=m(c)):(c=x*(7.35+f*1.5),k=10.5-2.5*Math.abs(f-.45)*2);let L=J<i*.2?k*(1-.08*z):2+(k-2)*(.04+.96*Math.sqrt(z));U>30&&(L*=.7);const b=oe(fe+.01+G*.075,.2,.5),M={rx:c,rz:g,L:Math.max(L,2),a0:b+r,a1:b-r,xl:oe(P*.03,-.07,.07)*(x===0?1:.6),sw:d,ph:C,gate:0};let F=!0;const Z=.5+.03*M.L*M.sw;for(let I=1;I<=10&&F;I++){me(M.rx,M.rz,M.L,M.a0,M.a1,M.xl,I/10,u);const ee=I===10?1.6+Z*.5:1.6+.022*M.L*(I/10)*M.sw;$e(l,u)<ee&&(F=!1);const w=Math.abs(u.x);w>3.9&&w<7.1&&(F=!1)}if(F){for(const I of h)if(I.distanceToSquared(u)<(S<.3?.36:.62)*(U>16?.55:1)){F=!1;break}}if(F){j=M,h.push(u.clone());break}}j&&a.push(j),await e.yield()}a.forEach((i,x)=>{i.crown=h[x],i.dPath=$e(l,h[x])});const p=a.map((i,x)=>x).sort((i,x)=>a[i].dPath-a[x].dPath);p.forEach((i,x)=>{a[i].near=x<80||a[i].dPath<6});let A=0;for(const i of a)i.near&&A++;return A>n&&p.forEach((i,x)=>{a[i].near=x<n}),a}const We=`
uniform float uAmbient, uSun;
vec3 sunAt(vec3 p){ return mix(vec3(1., .96, .82), vec3(1.12, .9, .58), clamp(uWarm, 0., 1.))*uSun*logShade(p)*(1. + .7*caust(p))*exp2(p.y/26.); }   // a morning sun is gold
vec3 ambAt(vec3 N, float y){ return mix(uWLevel*1.5 + vec3(.05, .12, .10), uWSilver*.8, .30 + .30*N.y)*uAmbient*mix(1., .6, clamp(-y/40., 0., 1.)); }
`,Oe=`
#include <common>
#include <fog_pars_vertex>
${ue}
${Ke}
uniform float uPx;
attribute vec4 aRoot, aShape;
varying vec3 vP, vS; varying vec2 vUv; varying float vCov, vTone, vKeep;
void main(){
  float t = position.y;
  vTone = fract(aRoot.w*7.31 + aRoot.x*3.7);                       // every rope its own tone, so a far curtain stays a crowd of threads
  vec3 p = stemPos(aRoot, aShape, t), T = stemTan(aRoot, aShape, t);
  vec3 V = uCamL - p; float dist = max(length(V), 1e-3); V /= dist;
  vec3 S = cross(T, V); S /= max(length(S), 1e-4);
  float r = mix(.0125, .006, t)*(1. + 2.2*exp(-t*aRoot.z*4.));     // swollen where it grips the wood
  float rr = max(r, dist*uPx*mix(.78, .52, smoothstep(10., 30., dist)));                                 // never thinner than a pixel and a half
  // Far off, two ropes in three thin away (each at its own distance, slowly), so a distant colony stays single
  // threads with lanterns on them and never closes into a striped sheet.
  float hK = fract(aRoot.w*13.7 + aRoot.x*1.31 + aRoot.y*.77), dRoot = distance(vec3(aRoot.x, -5., aRoot.y), uCamL);
  vKeep = 1. - smoothstep(hK*36. + 12., hK*36. + 19., dRoot)*step(hK, .72);
  rr *= vKeep;
  vCov = r/rr;
  p += S*position.x*rr;
  vP = p; vS = S; vUv = vec2(position.x, t*aRoot.z);
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Ye=`
#include <common>
#include <fog_pars_fragment>
${ue}
${We}
uniform vec3 uUmber, uBead; uniform float uPx;
varying vec3 vP, vS; varying vec2 vUv; varying float vCov, vTone, vKeep;
void main(){
  vec3 V = uCamL - vP; float dist = max(length(V), 1e-3); V /= dist;
  float x = clamp(vUv.x, -1., 1.), nz = sqrt(max(1. - x*x, 0.));
  vec3 N = vS*x + V*nz; N /= max(length(N), 1e-4);
  float near = 1. - smoothstep(.0035, .011, dist*uPx);             // beads only while a 4 cm joint is several pixels long
  float fr = abs(fract(vUv.y/.04) - .5);                           // a pale bead every 4 cm: the stacked ossicles
  float bead = smoothstep(.30, .42, fr);
  float groove = smoothstep(.0, .08, fr)*.5 + .5;                  // the dark joint between two ossicles
  vec3 alb = mix(uUmber, uBead, mix(.13, bead*.42, near))*mix(1., .7 + .3*groove, near);
  float d = max(dot(N, uSunDir), 0.), rim = 1. - nz;
  vec3 am = ambAt(N, vP.y); am = mix(am, vec3(dot(am, vec3(.3, .5, .2))), .45);
  vec3 col = alb*1.2*(am*(.22 + .78*nz*nz) + sunAt(vP)*(.2 + .9*d + .5*rim*rim));
  // Far off a rope is a DARK thread: it fades toward a tone below the level water, never toward the bright water
  // above (behind it is the mirror of the surface, not the sky), and it holds that tone further than the water does.
  vec3 dir = -V, dlo = vec3(dir.x, min(dir.y, -.03), dir.z); dlo /= max(length(dlo), 1e-4);
  vec3 bg = waterColor(dlo, uCamL.y + dlo.y*30.);
  float cov = clamp(vCov, 0., 1.);
  float tone = .55 + .9*clamp(vTone, 0., 1.);
  vec3 dark = bg*vec3(.2, .24, .26)*mix(1., 2.1, smoothstep(5., 26., dist));   // a far rope is a dark thread, but each layer of the curtain is a step paler than the one in front: depth, not a scribble
  col = mix(dark, col*mix(.5, 1., cov)*tone, max(sqrt(cov), .3)*mix(.7, 1., clamp(vTone, 0., 1.)));
  vec3 farC = mix(waterColor(dir, uCamL.y + dir.y*30.), dark*mix(1., 1.9, clamp(vTone, 0., 1.)), exp2(-dist/120.));
  vec3 outc = mix(farC, col, exp2(-dist/max(uHalf*1.5, 1.)));
  gl_FragColor = vec4(mix(waterColor(dir, uCamL.y + dir.y*30.), outc, clamp(vKeep, 0., 1.)), 1.);
  #include <fog_fragment>
}`,Le=`
#include <common>
#include <fog_pars_vertex>
${ue}
${Ke}
uniform float uPx, uCup;
uniform vec3 uWakePos, uWakeDir;
attribute vec4 aRoot, aShape, aArm;                                // aArm = azimuth, seed, length, crown seed
varying vec3 vP; varying vec3 vUv; varying float vClench;
float armAngle(float s, float cl, float fl, float sd, float opn){
  float k = smoothstep(.60, 1., s);
  float open = 1.52*opn - 1.22*smoothstep(.04, .62, s) - 4.4*k*sqrt(k);  // out, round into the bowl wall, then the crozier
  open += .09*sin(uTime*.7 + sd*40. + s*3.)*(1. - k) - fl*1.7*s*(1. - .6*k);
  float shut = .62 - 2.5*s - 1.6*s*s;
  return mix(open, shut, cl);
}
void main(){
  vec3 c = stemPos(aRoot, aShape, 1.), A = stemTan(aRoot, aShape, 1.);
  A = normalize(A + vec3(0., -.12, -.22));                         // mouth down and a little down-drift
  vec3 X = cross(A, vec3(1., 0., 0.)); X /= max(length(X), 1e-4);
  vec3 Y = cross(A, X);
  // clench: our wake reaches the crown about 3 m before we draw level; it stays shut past us and reopens behind
  vec3 dW = c - uWakePos; float along = dot(dW, uWakeDir), lat = length(dW - along*uWakeDir);
  float cw = (1. - smoothstep(2.7, 3.5, lat))*(1. - smoothstep(2.4, 4.2, along))*smoothstep(-14., -1.5, along);
  float f = fract(uTime/83. + aArm.w);
  float sp = smoothstep(0., .006, f)*(1. - smoothstep(.008, .05, f));
  float cl = max(cw, sp);
  float ft = fract(uTime*.105 + aArm.y*7.31);
  float fl = smoothstep(0., .03, ft)*(1. - smoothstep(.04, .2, ft));
  float dC = distance(c, uCamL);
  float ph = aArm.x, len = aArm.z*mix(1., .92, cl)*(1. + 1.25*smoothstep(18., 70., dC));   // far lanterns are drawn a little large, so a far bell is a cloud of lights on threads
  vec3 Rd = cos(ph)*X + sin(ph)*Y, Bn = cross(A, Rd);
  float n = max(position.z, 1.), sv = position.y, th = 0.;
  float opn = mix(.78, 1.1, hash11(aArm.w*3.7));                   // some crowns hold their bowl wider than others
  vec2 q = vec2(.032, .0);
  for (int i = 0; i < 14; i++){
    float fi = float(i), seg = clamp(sv*n - fi, 0., 1.);
    th = armAngle((fi + .5*seg)/n, cl, fl, aArm.y, opn);
    q += seg*(len/n)*vec2(sin(th), cos(th));
  }
  th = armAngle(sv, cl, fl, aArm.y, opn);
  vec3 Tn = sin(th)*Rd + cos(th)*A, Nn = cos(th)*Rd - sin(th)*A;
  vec3 p = c + Rd*q.x + A*(q.y + .03);
  vec3 V = uCamL - p; float dist = max(length(V), 1e-3);
  float hw = (.118*sqrt(max(sv, 0.))*sqrt(max(1. - sv, 0.))*(1. - .3*sv) + .007)*mix(1., .5, cl);   // a feather: widest two fifths of the way out   // a feather: widest a third of the way out
  hw = max(hw, dist*uPx*1.1);
  float vee = mix(.55, 1.15, cl);
  p += Bn*position.x*hw*cos(vee) - Nn*abs(position.x)*hw*sin(vee);
  if (uCup > .5) {                                                 // the cup: position is a point of a small lofted calyx
    p = c + (X*position.x + Y*position.z)*.78 + A*position.y*.8;
  }
  vP = p; vUv = vec3(position.x, sv, aArm.y); vClench = cl;
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ke=`
#include <common>
#include <fog_pars_fragment>
${ue}
${We}
uniform vec3 uCupCol, uArmCol, uTipCol;
uniform float uCup, uGlow, uPx;
varying vec3 vP; varying vec3 vUv; varying float vClench;
void main(){
  vec3 V = uCamL - vP; float dist = max(length(V), 1e-3); V /= dist;
  vec3 G = cross(dFdx(vP), dFdy(vP)); float glen = length(G);
  vec3 N = glen > 1e-12 ? G/glen : V;
  if (dot(N, V) < 0.) N = -N;
  float w = abs(vUv.x), s = vUv.y;
  float near = (1. - smoothstep(.0028, .0075, dist*uPx))*(1. - uCup);   // the comb only while a tooth is a few pixels wide
  // the comb: fine side branches each side of the midrib, slanting toward the tip, with water between them
  float tooth = abs(fract(s*30. - w*1.1) - .5)*2.;
  float gap = smoothstep(mix(.25, -.2, w), mix(.75, .45, w), tooth)*smoothstep(.16, .3, w);
  if (gap*near > .5) discard;
  vec3 alb = mix(uArmCol, uTipCol, smoothstep(.56, .9, s));
  alb = mix(uCupCol, alb, smoothstep(.0, .22, s));
  float rib = 1. - smoothstep(.04, .15, w);
  alb *= mix(vec3(1.), vec3(.5, .34, .28), rib*(1. - uCup));                            // the darker midrib
  alb *= mix(1., .78, (1. - near)*.5)*(.86 + .28*hash11(vUv.z*31.7));
  if (uCup > .5) alb = uCupCol*(.55 + .45*smoothstep(-.02, .05, vUv.y))*(.8 + .2*sin(vUv.x*60.));
  float fr = max(dot(N, uSunDir), 0.), bk = max(dot(-N, uSunDir), 0.);
  float halo = max(dot(-V, uSunDir), 0.); halo *= halo; halo *= halo;
  vec3 sun = sunAt(vP);
  vec3 am = ambAt(N, vP.y); am = mix(am, vec3(dot(am, vec3(.3, .5, .2)))*1.25, .8);   // crowns keep their own colour in green light
  float thin = (1. - .8*uCup)*(.75 + .5*w);                               // the combs are thinner than the midrib: more light through
  float ao = mix(.5, 1., smoothstep(0., .5, s))*(.8 + .2*w);                // deeper inside the bowl and along the groove
  vec3 col = alb*ao*(am*.85 + sun*(.55*fr + uGlow*thin*(1.9*bk + 1.5*halo) + .12));
  col += alb*alb*sun*uGlow*thin*(2.0*bk + 1.2*halo);                       // lit through: deeper and more saturated                                    // deeper, more saturated where it is lit through
  col *= mix(1., .8, vClench);
  col *= 1. + .9*smoothstep(14., 60., dist);                               // far crowns are a few pixels: keep the accent at strength
  float mx = max(col.r, max(col.g, col.b)); col *= 1.02/max(mx, 1.02);     // lit through they glow, but stay saffron: never bleached to white against the bright surface
  vec3 dv = -V;
  gl_FragColor = vec4(mix(waterColor(dv, uCamL.y + dv.y*30.), col, exp2(-dist/max(uHalf*1.7, 1.))), 1.);   // warm light carries further than the dark
  #include <fog_fragment>
}`,_e=`
#include <common>
#include <fog_pars_vertex>
${ue}
uniform float uHeave, uRollK;
attribute vec3 aCol; attribute float aTint;
varying vec3 vP, vN, vL, vCol; varying vec2 vUv2; varying float vTint;
float rollAt(float t){ return uRollK*${qe.toFixed(5)}*sin(${He.toFixed(5)}*t); }
void main(){
  vec3 p = position, n = normal;
  #ifdef USE_INSTANCING
    p = (instanceMatrix*vec4(p, 1.)).xyz; n = mat3(instanceMatrix)*n;
    vTint = aTint;
  #else
    vTint = 0.;
  #endif
  vL = p;
  float ra = rollAt(uTime), cr = cos(ra), sr = sin(ra);
  p = vec3(p.x, p.y*cr - p.z*sr + uHeave, p.y*sr + p.z*cr);
  n = vec3(n.x, n.y*cr - n.z*sr, n.y*sr + n.z*cr);
  vP = p; vN = n; vCol = aCol; vUv2 = uv;
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Ee=`
#include <common>
#include <fog_pars_fragment>
${ue}
${We}
uniform vec3 uWood, uShellA, uShellB;
uniform float uShell;
varying vec3 vP, vN, vL, vCol; varying vec2 vUv2; varying float vTint;
float h21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y);
}
void main(){
  vec3 V = uCamL - vP; float dist = max(length(V), 1e-3); V /= dist;
  vec3 N = vN/max(length(vN), 1e-4);
  vec3 alb;
  if (uShell < .5) {
    vec2 g = vec2(vUv2.x, vL.x);
    float warp = vnoise(g*vec2(3., .6))*1.5;
    float grain = vnoise(vec2(g.x*26. + warp, g.y*.8));
    float groove = smoothstep(.28, .62, vnoise(vec2(g.x*52. + warp*2., g.y*1.7 + 9.)));
    float plates = smoothstep(.46, .58, vnoise(vec2(g.x*2.6 + 3., g.y*.5)) + .08*grain);
    alb = uWood*(2.7 + 5.2*grain);                                       // dark wet wood, but wood: the grain and the bare plates read from below
    alb = mix(alb*.55, alb*2.4 + vec3(.03, .026, .018), plates*.8);      // bark gone in plates: paler bare wood
    alb *= mix(.3, 1., groove)*vCol.y;
    float under = smoothstep(.0, .8, -vL.y/max(length(vL.yz), 1e-3));
    float crust = under*smoothstep(.42, .7, vnoise(g*vec2(9., 3.) + 17.));
    float dots = smoothstep(.55, .8, vnoise(g*vec2(70., 22.) + 5.));       // barnacle and spat speckle in the crust
    alb = mix(alb, uShellA*(.34 + .5*dots), crust*.75);                  // limy crust on the underside
    alb = mix(alb, alb*vec3(1.5, 1.02, .7), .5*vnoise(g*vec2(1.3, .35) + 31.));   // wet conifer wood is red-brown in places
    alb = mix(alb, uWood*3.2 + vec3(.03, .025, .01), vCol.x*(.6 + .4*grain));   // raw splintered heartwood
  } else {
    if (!gl_FrontFacing) N = -N;
    float ribs = .62 + .38*vCol.x, lines = .82 + .18*sin(vCol.y*46.);
    alb = mix(uShellA, uShellB, vTint)*ribs*lines*(.55 + .45*vCol.y)*.8;
  }
  float d = max(dot(N, uSunDir), 0.);
  vec3 am = ambAt(N, vP.y); am = mix(am, vec3(dot(am, vec3(.3, .5, .2)))*vec3(1.08, 1., .9), mix(.9, .92, uShell));
  vec3 col = alb*(am*mix(1.0, 1.35, uShell) + sunAt(vP)*(1.3*d + .04));
  float fres = 1. - max(dot(N, V), 0.); fres *= fres;
  col += fres*fres*uWLevel*.05*(1. - uShell);                             // wet sheen picks up the water
  // a trunk seen from below is ROUND: its flanks take the light scattered sideways through the water and the sun's
  // net crawls a little way round them, so the underside is a dark keel between two lit edges, never a flat bar
  float side = 1. - abs(N.y); side *= side;
  col = col*mix(.62, 1., uShell) + alb*(side*(.26*uWUp + .5*sunAt(vP)*smoothstep(-.5, .3, N.y)) + fres*.12*uWUp)*(1. - uShell)*uAmbient;   // and the wood itself stays the one true dark
  vec3 dv = -V, dlo = vec3(dv.x, min(dv.y, -.03), dv.z); dlo /= max(length(dlo), 1e-4);   // the one true dark: it holds its tone twice as far as the rest
  vec3 farC = mix(waterColor(dv, uCamL.y + dv.y*30.), waterColor(dlo, uCamL.y + dlo.y*30.)*.5, exp2(-dist/160.));
  gl_FragColor = vec4(mix(farC, col, exp2(-dist/max(uHalf*2.3, 1.))), 1.);
  #include <fog_fragment>
}`;function Xe(e,o,l=20,s=58,n=!1){const a=[],u=[],h=[],m=[],y=(f,z,S,C,G,P,r)=>{const d=a.length/3;for(let g=0;g<=l;g++){const c=g/l*Math.PI*2,k=z(c);a.push(f+(r?r(g%l):0),S+k*Math.cos(c),C+k*Math.sin(c)),u.push(g/l,f),h.push(P,G,0)}return d},D=(f,z,S)=>{for(let C=0;C<S;C++)m.push(f+C,f+C+1,z+C,f+C+1,z+C+1,z+C)},p=e.range(0,6.28);let A=-1;const i=[];for(let f=0;f<l;f++)i.push((e()<.4?e.range(.3,1):e.range(0,.25))*.45);for(let f=0;f<=s;f++){const z=f/s,S=-X+z*2*X,C=Math.pow(1-Se(0,.16,z),2),G=Se(.9,1,z),P=.05*Math.sin(S*.31+1)-.04*C,r=.06*Math.sin(S*.23+2.4),g=y(S,c=>{const k=o.n2(c*1.3+7,S*.5)*.06+o.n2(Math.cos(c)*3+S*2.2,Math.sin(c)*3)*.02,V=C*(.45+.16*Math.cos(c*5+p)+.07*Math.cos(c*2+1));return(ce*(1-.12*z)+k+V)*(1-.5*G*G)},P,r,1,G>.6?1:0,f===s?c=>i[c]:f===s-1?c=>i[c]*.45:null);A>=0&&D(A,g,l),A=g}const x=(f,z,S,C,G)=>{let P=-1;for(let r=0;r<=3;r++){const d=r/3,g=y(f+S*G*Math.sin(d*1.57),c=>Math.max(z(c)*Math.cos(d*1.5),.012),0,0,.75-.3*d,C);P>=0&&(S>0?D(P,g,l):D(g,P,l)),P=g}};x(-X,f=>ce+.45+.16*Math.cos(f*5+p)+.07*Math.cos(f*2+1),-1,.4,.28),x(X+.05,()=>ce*.36,1,1,-.35);const J=[];for(let f=0;f<5;f++){const z=-5.5+f*2.9+e.range(-.8,.8),S=e.range(-1.2,1.2)+(f%2?Math.PI*.5:-Math.PI*.55)+Math.PI/2,C=f===1?e.range(1.5,2):e.range(.5,1.3),G=.07+.035*C,P=new t.Vector3(e.range(.15,.5),Math.cos(S),Math.sin(S)).normalize(),r=new t.Vector3(1,0,0).cross(P).normalize(),d=P.clone().cross(r);J.push({x:z,dir:P,len:C});let g=-1;const c=n?5:8,k=n?3:5;for(let V=0;V<=k;V++){const L=V/k,b=a.length/3,M=G*(1.5-.5*Se(0,.25,L))*(1-.45*L),F=.08*C*Math.sin(L*3+f);for(let Z=0;Z<=c;Z++){const I=Z/c*Math.PI*2,ee=V===k?(Z*7+f*3)%5*.05*C*.6:0,w=ce*.75+L*C+ee;a.push(z+P.x*w+(r.x*Math.cos(I)+d.x*Math.sin(I))*M+F*r.x,P.y*w+(r.y*Math.cos(I)+d.y*Math.sin(I))*M+F*r.y,P.z*w+(r.z*Math.cos(I)+d.z*Math.sin(I))*M+F*r.z),u.push(Z/c,z+L*C*3),h.push(V===k?1:0,1,0)}g>=0&&D(g,b,c),g=b}}const j=f=>{const z=Math.sin(f*12.9898+p*3.1)*43758.5453;return z-Math.floor(z)};for(let f=0;f<6;f++){const z=f/6*6.2832+p+(j(f)-.5)*.9,S=(f%2?.5:.8)+.5*j(f+7),C=.17+.07*j(f+13),G=new t.Vector3(0,Math.cos(z),Math.sin(z)),P=new t.Vector3(-.8,G.y*.6,G.z*.6).normalize(),r=new t.Vector3(1,0,0).cross(P).normalize(),d=P.clone().cross(r);let g=-1;const c=n?5:7,k=n?4:6;for(let V=0;V<=k;V++){const L=V/k,b=a.length/3,M=C*(1-.5*L)*(1+.5*(1-L)*(1-L))*(V===k?.55:1)+.01,F=.55*S*L*L+.08*S*Math.sin(L*5+f*2.1)*L,Z=.5*S*L*L;for(let I=0;I<=c;I++){const ee=I/c*Math.PI*2,w=V===k?(I*5+f*3)%4*.02:0,q=L*S+w;a.push(-X+.25+P.x*q+Z+(r.x*Math.cos(ee)+d.x*Math.sin(ee))*M,G.y*(.42+F)+P.y*q+(r.y*Math.cos(ee)+d.y*Math.sin(ee))*M,G.z*(.42+F)+P.z*q+(r.z*Math.cos(ee)+d.z*Math.sin(ee))*M),u.push(I/c,-X+L*S*2),h.push(V===k?1:0,.9,0)}g>=0&&D(g,b,c),g=b}}const U=new t.BufferGeometry;return U.setAttribute("position",new t.Float32BufferAttribute(a,3)),U.setAttribute("uv",new t.Float32BufferAttribute(u,2)),U.setAttribute("aCol",new t.Float32BufferAttribute(h,3)),U.setIndex(m),U.computeVertexNormals(),{geometry:U,stubs:J}}function at(e){const o=(e+X)/(2*X);return ce*(1-.12*o)+Math.pow(1-Se(0,.16,o),2)*.42}function nt(){const e=[0,.05,0],o=[.6,.15,0],l=[],s=6;[.55,1].forEach((u,h)=>{for(let m=0;m<=s;m++){const y=(m/s-.5)*3.5,D=m%2,_=u*(1+(h===1?D?.1:-.06:0));e.push(Math.sin(y)*_,(h===0?.3:.06)+D*.07*u,Math.cos(y)*_-.15),o.push(D,u,0)}});for(let u=0;u<s;u++){l.push(0,1+u,2+u);const h=1+u,m=1+s+1+u;l.push(h,m,h+1,h+1,m,m+1)}const a=new t.BufferGeometry;return a.setAttribute("position",new t.Float32BufferAttribute(e,3)),a.setAttribute("aCol",new t.Float32BufferAttribute(o,3)),a.setAttribute("uv",new t.Float32BufferAttribute(new Float32Array(e.length/3*2),2)),a.setIndex(l),a.computeVertexNormals(),a}function Ze(){const e=[[-.05,.007],[-.008,.02],[.03,.043],[.06,.032],[.074,0]],o=[],l=[],s=5;e.forEach(([a,u],h)=>{for(let m=0;m<=s;m++){const y=m/s*Math.PI*2+h*0;o.push(Math.cos(y)*u,a,Math.sin(y)*u)}});for(let a=0;a<e.length-1;a++)for(let u=0;u<s;u++){const h=a*(s+1)+u,m=h+s+1;l.push(h,m,h+1,h+1,m,m+1)}const n=new t.InstancedBufferGeometry;return n.setAttribute("position",new t.Float32BufferAttribute(o,3)),n.setIndex(l),n}function ze(e,o){const l=[],s=[];for(let a=0;a<=e;a++)for(let u=0;u<o;u++)l.push(o===3?u-1:u*2-1,a/e,e);for(let a=0;a<e;a++)for(let u=0;u<o-1;u++){const h=a*o+u,m=h+o;s.push(h,h+1,m,h+1,m+1,m)}const n=new t.InstancedBufferGeometry;return n.setAttribute("position",new t.Float32BufferAttribute(l,3)),n.setIndex(s),n}function Qe(e){const o=[],l=[];for(let n=0;n<=e;n++){const a=Math.pow(n/e,1.25);o.push(-1,a,0,1,a,0)}for(let n=0;n<e;n++){const a=n*2;l.push(a,a+1,a+2,a+1,a+3,a+2)}const s=new t.InstancedBufferGeometry;return s.setAttribute("position",new t.Float32BufferAttribute(o,3)),s.setIndex(l),s}const st=`
varying vec3 vD;
void main(){ vD = position; vec4 p = projectionMatrix*modelViewMatrix*vec4(position, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p; }`,rt=`
${ue}
varying vec3 vD;
void main(){ vec3 d = vD/max(length(vD), 1e-4); gl_FragColor = vec4(waterColor(d, uCamL.y + d.y*30.), 1.); }`,lt=`
varying vec3 vP;
void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.); }`,it=`
${ue}
uniform vec3 uSkyCol;
varying vec3 vP;
void main(){
  vec3 d = vP - uCamL; float l = max(length(d), 1e-3); d /= l;
  vec2 w = vP.xz;                                                    // swell 9 m long moving with the wind, plus chop
  vec2 n = vec2(.05*sin(w.x*.9 + uTime*.8) + .03*sin(dot(w, vec2(2.1, 1.7)) + uTime*1.7),
                .09*sin(w.y*.698 - uTime*1.6) + .03*sin(dot(w, vec2(-1.6, 2.4)) - uTime*1.3));
  float c = d.y + dot(n, d.xz)*1.2;
  float win = smoothstep(.60, .72, c);                               // Snell's window: 48.6 degrees from straight up
  vec3 sd = d + vec3(n.x, 0., n.y)*.9; sd /= max(length(sd), 1e-4);
  float s = max(dot(sd, uSunDir), 0.); float s2 = s*s; s2 *= s2; s2 *= s2; s2 *= s2;
  vec3 sky = mix(uWUp, uSkyCol, .7)*(.78 + .14*sin(w.x*.21 + 1.)*sin(w.y*.17)) + vec3(1., .97, .88)*(1.6*s2*s2 + .25*s2);
  vec3 mir = waterColor(vec3(d.x + n.x, -.25 - .5*d.y, d.z + n.y)/1.3, -4.)*(.9 + 1.6*abs(n.x + n.y));
  vec3 col = mix(mir, sky, win);
  gl_FragColor = vec4(mix(waterColor(d, uCamL.y + d.y*30.), col, exp2(-l/max(uHalf*1.3, 1.))), 1.);
}`,ct=`
uniform float uTime; uniform vec3 uSunDir, uCamL;
attribute vec4 aShaft;                                               // x, z at the surface, width, phase
varying vec2 vUv; varying float vA;
void main(){
  float len = 26.;
  vec2 o = aShaft.xy + vec2(sin(uTime*.11 + aShaft.w), cos(uTime*.09 + aShaft.w*1.7))*1.6;
  vec3 top = vec3(o.x, 0., o.y), p = top - uSunDir*(position.y*len);
  vec3 V = uCamL - p; vec3 S = cross(uSunDir, V); S /= max(length(S), 1e-4);
  p += S*position.x*aShaft.z*(1. + position.y*.6);
  vUv = vec2(position.x, position.y);
  vA = .5 + .5*sin(uTime*.23 + aShaft.w*5.);
  gl_Position = projectionMatrix*modelViewMatrix*vec4(p, 1.);
}`,ut=`
uniform vec3 uShaftCol;
varying vec2 vUv; varying float vA;
void main(){
  float x = 1. - vUv.x*vUv.x; x = max(x, 0.);
  float a = x*x*(1. - smoothstep(.15, 1., vUv.y))*smoothstep(0., .04, vUv.y)*(.35 + .65*vA);
  gl_FragColor = vec4(uShaftCol*a, 1.);
}`,Pe={saffron:e=>({cup:W(e[3]).multiply(new t.Color(1,.72,.5)),arm:W(e[3]),tip:W(e[4])}),coral:e=>({cup:W(e[4]),arm:W(e[4]).lerp(W(e[3]),.35),tip:W("#F6EBCB")}),lemon:e=>({cup:W(e[3]),arm:W("#EFE07A"),tip:W("#8A3F78")}),rose:()=>({cup:W("#A63A62"),arm:W("#D9588A"),tip:W("#F8E6D0")})};async function dt(e,o={}){const l=o.palette&&o.palette.length>=7?o.palette:Je,s=oe(o.detail??e.quality?.detail??1,.6,1),n=e.rng.fork("hanging-sea-lilies"),a=n(),u=n(),h=o.crowns||(a<.6?"saffron":a<.8?"coral":"lemon"),m=o.colony||(u<.6?"full":u<.8?"sparse":"crowded"),y=m==="sparse"?200:m==="crowded"?400:300,D=o.backdrop??!0,_=(o.sunDir?new t.Vector3().copy(o.sunDir):new t.Vector3(.16,.819,-.55)).normalize(),p=et(l,_),A=new t.Group;A.name="hanging-sea-lilies";const i=tt();await e.yield();const x=await ot(e,n,i,y);await e.yield();const{geometry:J,stubs:j}=Xe(n,e.noise),U=W("#D8CCB2"),f=()=>({uWood:{value:W(l[5])},uShellA:{value:U},uShellB:{value:new t.Color(.07,.085,.12)},uShell:{value:0}}),z=ie(p,f(),_e,Ee,{side:t.DoubleSide}),S=new t.Mesh(J,z);S.frustumCulled=!1,S.name="log",A.add(S),await e.yield();const C=Math.round(400*(s<1?.5:1)),G=ie(p,f(),_e,Ee,{side:t.DoubleSide});G.uniforms.uShell.value=1;const P=new t.InstancedMesh(nt(),G,C);P.frustumCulled=!1,P.name="oysters";{const v=new t.Matrix4,T=new t.Vector3,B=new t.Vector3,K=new t.Vector3,O=new t.Vector3,se=new t.Vector3,re=new t.Vector3,R=new Float32Array(C);for(let N=0;N<C;N++){const Y=x[Math.floor(n()*x.length)],Ce=n()<.7?oe(Y.rx+n.gauss()*.45,-X+.1,X-.6):n.range(-X+.1,X-.6),Re=oe(n.gauss()*.5,-1.4,1.4),Ue=at(Ce)*.93;O.set(0,-Math.cos(Re),Math.sin(Re));const Ne=n.range(0,6.283),Ae=n()<.3,De=Ae?n.range(.04,.065):n.range(.05,.095);re.set(1,0,0).cross(O).normalize(),se.set(1,0,0).multiplyScalar(Math.cos(Ne)).addScaledVector(re,Math.sin(Ne)),K.copy(se).multiplyScalar(Math.cos(.4)).addScaledVector(O,Math.sin(.4)).normalize(),T.crossVectors(O,K).normalize(),B.crossVectors(K,T),v.makeBasis(T.multiplyScalar(De*(Ae?.55:1)),B.multiplyScalar(De*(Ae?1.5:1)),K.multiplyScalar(De*(Ae?1.5:1))),v.setPosition(Ce,.05*Math.sin(Ce*.31+1)+O.y*Ue,.06*Math.sin(Ce*.23+2.4)+O.z*Ue),P.setMatrixAt(N,v),R[N]=Ae?n.range(.75,1):n.range(0,.3)}P.geometry.setAttribute("aTint",new t.InstancedBufferAttribute(R,1)),P.instanceMatrix.needsUpdate=!0}A.add(P),await e.yield();const r=x.length,d=new Float32Array(r*4),g=new Float32Array(r*4);x.forEach((v,T)=>{d.set([v.rx,v.rz,v.L,v.ph],T*4),g.set([v.a0,v.a1,v.xl,v.sw],T*4)});const c=Qe(y>300?34:40);c.setAttribute("aRoot",new t.InstancedBufferAttribute(d,4)),c.setAttribute("aShape",new t.InstancedBufferAttribute(g,4)),c.instanceCount=r;const k=ie(p,{uUmber:{value:W("#5B4636")},uBead:{value:W("#CDBFA0")}},Oe,Ye,{side:t.DoubleSide}),V=new t.Mesh(c,k);V.frustumCulled=!1,V.name="stems",A.add(V),await e.yield();const L=Pe[h]?Pe[h](l):Pe.saffron(l),b=v=>({uCupCol:{value:L.cup},uArmCol:{value:L.arm},uTipCol:{value:L.tip},uCup:{value:v},uGlow:{value:o.glow??1}}),M=s<.8||y>300?8:10,F=(v,T)=>{const B=v.length*T,K=new Float32Array(B*4),O=new Float32Array(B*4),se=new Float32Array(B*4);let re=0;for(const R of v){const N=R.seedA*6.283;for(let Y=0;Y<T;Y++,re++)K.set([R.rx,R.rz,R.L,R.ph],re*4),O.set([R.a0,R.a1,R.xl,R.sw],re*4),se.set([N+Y/T*6.283+(R.jit[Y]-.5)*.24,R.jit[Y+10],.5*R.size*(.86+.24*R.jit[Y+20]),R.seedA],re*4)}return{n:B,r:K,sh:O,ar:se}};for(const v of x){v.seedA=n(),v.size=n.range(.86,1.12)*(v.L<4?.8:1),v.jit=[];for(let T=0;T<30;T++)v.jit.push(n())}const Z=(v,T,B,K)=>{const O=F(v,T);return B.setAttribute("aRoot",new t.InstancedBufferAttribute(O.r,4)),B.setAttribute("aShape",new t.InstancedBufferAttribute(O.sh,4)),B.setAttribute("aArm",new t.InstancedBufferAttribute(O.ar,4)),B.instanceCount=O.n,B},I=ie(p,b(0),Le,ke,{side:t.DoubleSide}),ee=x.filter(v=>v.near),w=x.filter(v=>!v.near),q=new t.Mesh(Z(ee,10,ze(14,3)),I);q.frustumCulled=!1,q.name="arms-near",A.add(q),await e.yield();const Q=new t.Mesh(Z(w,M,ze(9,2)),I);Q.frustumCulled=!1,Q.name="arms-far",A.add(Q),await e.yield();const $=ie(p,b(1),Le,ke,{side:t.DoubleSide}),he=Ze(),ve=F(x,1);he.setAttribute("aRoot",new t.InstancedBufferAttribute(ve.r,4)),he.setAttribute("aShape",new t.InstancedBufferAttribute(ve.sh,4)),he.setAttribute("aArm",new t.InstancedBufferAttribute(ve.ar,4)),he.instanceCount=ve.n;const ge=new t.Mesh(he,$);ge.frustumCulled=!1,ge.name="cups",A.add(ge),await e.yield();let ae=null;if(D){ae=new t.Mesh(new t.SphereGeometry(320,24,16),new t.ShaderMaterial({uniforms:{...p},vertexShader:st,fragmentShader:rt,side:t.BackSide,depthWrite:!1,depthTest:!1})),ae.renderOrder=-.5,ae.frustumCulled=!1,ae.name="water-dome",A.add(ae);const v=new t.PlaneGeometry(1200,1200);v.rotateX(Math.PI/2);const T=new t.Mesh(v,new t.ShaderMaterial({uniforms:{...p,uSkyCol:{value:W(l[2])}},vertexShader:lt,fragmentShader:it,side:t.DoubleSide}));T.frustumCulled=!1,T.name="ceiling",A.add(T);const B=new t.InstancedBufferGeometry,K=[],O=[],se=6;for(let N=0;N<=se;N++)K.push(-1,N/se,0,1,N/se,0);for(let N=0;N<se;N++){const Y=N*2;O.push(Y,Y+1,Y+2,Y+1,Y+3,Y+2)}B.setAttribute("position",new t.Float32BufferAttribute(K,3)),B.setIndex(O);const re=new Float32Array(64);for(let N=0;N<16;N++){const Y=N%2?1:-1;re.set([n.range(-17,17),Y*n.range(3.5,16)-3,n.range(.25,.9),n.range(0,6.28)],N*4)}B.setAttribute("aShaft",new t.InstancedBufferAttribute(re,4)),B.instanceCount=16;const R=new t.Mesh(B,new t.ShaderMaterial({uniforms:{uTime:p.uTime,uSunDir:p.uSunDir,uCamL:p.uCamL,uShaftCol:{value:W(l[1]).lerp(W(l[2]),.5).multiplyScalar(.075)}},vertexShader:ct,fragmentShader:ut,transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,side:t.DoubleSide}));R.frustumCulled=!1,R.renderOrder=5,R.name="shafts",A.add(R)}await e.yield();const Te=x.filter(v=>v.gate).map(v=>v.crown.clone());let xe=x[0].crown;for(const v of x)v.crown.y<xe.y&&(xe=v.crown);const E=(v,T,B)=>new t.Vector3(v,T,B),le=i.exit[i.exit.length-1],ye=[E(le.x+2.6,-15.5,le.z-10),E(19,-14,le.z-20),E(32,-12,le.z-22),E(44,-10,le.z-16),E(50,-8.5,-21),E(48,-7.2,-11.5),i.dive[0].clone()],be=E(.8,0,-.6),Ve={entry:{position:i.underLog[0].clone().addScaledVector(be,-70).setY(-6),dir:be},underLog:i.underLog,leadIn:i.leadIn,helix:i.helix,exit:i.exit,teardrop:ye,dive:i.dive,flyThrough:[...i.underLog,...i.leadIn,...i.helix,...i.exit,...ye,...i.dive.slice(1)],helixAxis:{top:E(0,-5,we(-5)),bottom:E(0,-15,we(-15))},portalSeat:{position:i.portal.clone(),facing:i.diveDir.clone().negate(),dir:i.diveDir.clone(),radius:7},gateCrowns:Te,bellFoot:xe.clone(),lanes:[E(5.5,-9,we(-9)),E(-5.5,-9,we(-9))],logEnds:{rootFlare:E(-X,0,0),splinteredTop:E(X,0,0)},stubs:j,viewpoints:{whole:E(-34,-7,42),sideOn:E(48,-7.2,-11.5),underLog:E(-3,-3.6,2.2),inLane:Ie(2*Math.PI-.5,E(0,0,0)),underFoot:i.under.clone()},sunDir:_.clone(),lean:fe,driftDir:E(0,0,-1)},Me=new t.Vector3,ne=new t.Vector3,H=new t.Vector3,de=new t.Vector3,te=new t.Vector2;let pe=!1,Ge=!1;const Fe={c:new t.Vector3(0,-9.5,-3.2),r:13,h:18};return{object:A,radius:Fe.r,height:Fe.h,center:Fe.c,anchors:Ve,ground:!1,groundY:-60,uniforms:p,variant:h,colony:m,stems:x,palette:l,crownColors:L,altColors:Pe[h==="coral"?"saffron":"rose"](l),glow:o.glow??1,setWake(v,T){Ge=!!v,v&&(p.uWakePos.value.copy(v),T&&T.lengthSq()>1e-8&&p.uWakeDir.value.copy(T).normalize())},setLight({ambient:v,sun:T,gain:B,half:K}={}){v!==void 0&&(p.uAmbient.value=v),T!==void 0&&(p.uSun.value=T),B!==void 0&&(p.uGain.value=B),K!==void 0&&(p.uHalf.value=K)},update(v,T,B){if(p.uTime.value=T,p.uHeave.value=.13*Math.sin(T*1.08)+.04*Math.sin(T*1.9+1),!!B){if(B.getWorldPosition(Me),A.updateWorldMatrix(!0,!1),ne.copy(Me),A.worldToLocal(ne),p.uCamL.value.copy(ne),e.renderer&&(e.renderer.getDrawingBufferSize(te),p.uPx.value=2/(Math.max(B.projectionMatrix.elements[5],.1)*Math.max(te.y,1))),!Ge){if(pe){de.subVectors(ne,H);const K=de.length();v>0&&K>.001&&K<4&&p.uWakeDir.value.lerp(de.multiplyScalar(1/K),Math.min(1,v*6)).normalize()}p.uWakePos.value.copy(ne),H.copy(ne),pe=!0}ae&&ae.position.copy(ne)}},dispose(){}}}async function ft(e,o,l,s){const n=e.rng.fork("hanging-sea-lilies-rafts"),a=n,u=o.uniforms,h=new t.Vector3,m=new t.Group;m.name="more-rafts";const y=[],D=[];for(let r=0;r<l.length;r++){const d=l[r],g=d.own?e.core.makeRng(7001+r*131+(e.seed|0)%1e5):n,c=d.len/2,k=Math.cos(d.yaw),V=Math.sin(d.yaw),L=d.lanes||[],b=g,M=w=>[d.x+k*w,d.z+V*w],F=g.fork("tassels"+r),Z=[],I=d.len>13?4:d.len>10?3:2;for(let w=0;w<I;w++){let q=(-1+(2*w+1)/I)*(c-1)+F.range(-.7,.7);for(const Q of L)Math.abs(q-Q)<2.6&&(q=Q+(q>=Q?2.9:-2.9));Z.push({c:q,w:F.range(1,1.9)*(d.len/I)/3.6,d:w===Math.floor(I/2)?1:F.range(.45,.95)})}const ee=(w,q)=>{w.col=r,w.alt=d.alt?1:0,w.seedA=b(),w.size=b.range(.86,1.12)*(w.L<4?.8:1),w.jit=[];for(let Q=0;Q<30;Q++)w.jit.push(b());w.dPath=d.check?s(w.crown.x,w.crown.y,w.crown.z):99,!d.ghost&&!q&&(y.push(w),D.push(w.crown))};for(const w of d.gates||[]){const q=oe((w.x-d.x)/Math.max(k,.2),-c+.3,c-.3),Q=M(q),$=Be(Q[0],w.y,w.z-Q[1],b.range(.1,.15),b.range(0,6.28),b.range(.7,1));$.rz=Q[1],me($.rx,$.rz,$.L,$.a0,$.a1,$.xl,1,h),h.distanceTo(w)<.5&&$.L<22&&s(h.x,h.y,h.z)>1.7&&($.crown=h.clone(),ee($,w.skip),w.dress&&($.dPath=Math.min($.dPath,5)))}for(let w=0;w<d.n;w++){for(let q=0;q<10;q++){const Q=b(),$=b(),he=b.range(0,6.28),ve=b.gauss(),ge=b.gauss(),ae=b.range(.09,.16),Te=b.range(.6,1.15),xe=b.range(-.2,.2);let E=(Q*2-1)*(c-.4),le=1;if(F()<.86){const te=Z[Math.floor(F()*Z.length)],pe=oe(F.gauss()*.42,-1,1);E=oe(te.c+pe*te.w,-c+.4,c-.4),le=te.d*(1-.45*pe*pe)}else le=.3+.25*F();let ye=!1;for(const te of L)Math.abs(E-te)<1.9&&(ye=!0);if(ye)continue;const be=d.depth*le*(1-.35*Math.pow(Math.abs(E)/c,1.6)),Ve=Math.max(w<d.n*.45?be*(1-.14*$):1.6+(be-1.6)*(.15+.85*$),1.6),Me=oe(fe+.01+ve*.075,.2,.52),ne=M(E),H={rx:ne[0],rz:ne[1]+xe,L:Ve,a0:Me+ae,a1:Me-ae,xl:oe(ge*.03,-.07,.07),sw:Te,ph:he,gate:0};let de=!0;if(d.check)for(let te=2;te<=10&&de;te+=2)me(H.rx,H.rz,H.L,H.a0,H.a1,H.xl,te/10,h),s(h.x,h.y,h.z)<(te===10?2.1+.02*H.L:1.7+.022*H.L*(te/10))&&(de=!1);if(me(H.rx,H.rz,H.L,H.a0,H.a1,H.xl,1,h),de){H.crown=h.clone(),ee(H);break}}w%8===7&&await e.yield()}await e.yield()}const _=(r,d,g)=>{const c=d.length*g,k=new Float32Array(c*4),V=new Float32Array(c*4),L=new Float32Array(c*4);let b=0;for(const M of d)for(let F=0;F<g;F++,b++)k.set([M.rx,M.rz,M.L,M.ph],b*4),V.set([M.a0,M.a1,M.xl,M.sw],b*4),L.set([M.seedA*6.283+F/g*6.283+(M.jit[F]-.5)*.24,M.jit[F+10],.5*M.size*(.86+.24*M.jit[F+20]),M.seedA],b*4);return r.setAttribute("aRoot",new t.InstancedBufferAttribute(k,4)),r.setAttribute("aShape",new t.InstancedBufferAttribute(V,4)),g>0&&r.setAttribute("aArm",new t.InstancedBufferAttribute(L,4)),r.instanceCount=c,r},p={uRollK:{value:0}},A=o.crownColors,i=o.palette,x=(r,d,g)=>{const c=new t.Mesh(r,d);return c.frustumCulled=!1,c.name=g,m.add(c),c},J=ie(u,{...p,uUmber:{value:W("#5B4636")},uBead:{value:W("#CDBFA0")}},Oe,Ye,{side:t.DoubleSide});x(_(Qe(13),y,1),J,"raft-stems"),await e.yield(),y.map((r,d)=>d).sort((r,d)=>y[r].dPath-y[d].dPath).forEach((r,d)=>{y[r].near=d<136&&y[r].dPath<8.5});for(const r of[0,1]){const d=r&&o.altColors||A,g=r?"-alt":"",c=b=>({...p,uCupCol:{value:d.cup},uArmCol:{value:d.arm},uTipCol:{value:d.tip},uCup:{value:b},uGlow:{value:o.glow}}),k=ie(u,c(0),Le,ke,{side:t.DoubleSide}),V=y.filter(b=>b.near&&b.alt===r),L=y.filter(b=>!b.near&&b.alt===r);V.length&&x(_(ze(10,3),V,10),k,"raft-arms-near"+g),await e.yield(),L.length&&x(_(ze(4,2),L,8),k,"raft-arms-far"+g),await e.yield(),V.length&&x(_(Ze(),V,1),ie(u,c(1),Le,ke,{side:t.DoubleSide}),"raft-cups"+g)}const j=Xe(a,e.noise,12,24,!0).geometry,U=ie(u,{...p,uWood:{value:W(i[5])},uShellA:{value:W("#D8CCB2")},uShellB:{value:new t.Color(.07,.085,.12)},uShell:{value:0}},_e,Ee,{side:t.DoubleSide}),f=new t.InstancedMesh(j,U,l.length);f.frustumCulled=!1,f.name="raft-logs";const z=new t.Matrix4,S=new t.Quaternion,C=new t.Euler,G=new t.Vector3,P=new t.Vector3;return l.forEach((r,d)=>{const g=r.own?e.core.makeRng(9001+d*131+(e.seed|0)%1e5):n,c=oe(r.len/(2*X),.75,1.05)*g.range(1.25,1.7),k=g.range(0,6.28),V=g()<.5;C.set(k,-r.yaw+((r.flip!==void 0?r.flip:V)?Math.PI:0),0,"YXZ"),S.setFromEuler(C),z.compose(P.set(r.x,r.ghost?900:-.02,r.z),S,r.ghost?G.set(1e-4,1e-4,1e-4):G.set(r.len/(2*X),c,c)),f.setMatrixAt(d,z)}),j.setAttribute("aTint",new t.InstancedBufferAttribute(new Float32Array(l.length),1)),f.instanceMatrix.needsUpdate=!0,m.add(f),await e.yield(),{object:m,crowns:D,count:y.length}}export{We as LIGHT_GLSL,ue as WATER_GLSL,dt as buildHero,ft as buildSatellites};
