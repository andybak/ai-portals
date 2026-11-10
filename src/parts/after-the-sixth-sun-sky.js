import*as t from"three";const H=Math.PI/180,T=i=>Math.min(1,Math.max(0,i)),v=(i,h,u)=>{const a=T((u-i)/(h-i));return a*a*(3-2*a)},Y=(i,h,u)=>i+(h-i)*u,be=(i,h,u=new t.Vector3)=>{const a=i*H,r=h*H,n=Math.cos(r);return u.set(Math.sin(a)*n,Math.sin(r),-Math.cos(a)*n)},se=i=>{const h=new t.Color(i);return[h.r,h.g,h.b]},ne={blue:"#bcd4ff",white:"#fff6e8",gold:"#ffd27a",red:"#c2281c",star:"#b9c8ff"};function lt(i={}){const h=!!i.swapPairs,u=i.goldAz??16,a=i.skyline||(()=>0),r=i.notchAt??420,n=Math.max(r+60,i.goneAt??700),R=i.turn0??0,z=i.tremble||[0,1.3],S=c=>R+(18-R)*Math.max(0,c)/r,g=c=>(c-r)/(n-r),o={az:-22,el:5},C={az:-6,el:15},D=h?C:o,m=h?o:C,d=[{az:D.az-1.3,el:D.el+.25,hex:ne.blue,disc:"#5f92ff",tint:[.4,.62,1.25],r:.8,rad:4.2,kind:0},{az:D.az+1.3,el:D.el-.25,hex:ne.blue,disc:"#5f92ff",tint:[.4,.62,1.25],r:.8,rad:4.2,kind:0},{az:m.az-1.9,el:m.el-.35,hex:ne.white,disc:"#fff4e2",tint:[1.1,1.05,.95],r:1,rad:3.4,kind:1},{az:m.az+1.9,el:m.el+.35,hex:ne.white,disc:"#fff4e2",tint:[1.1,1.05,.95],r:1,rad:3.4,kind:1},{az:u,el:18,hex:ne.gold,disc:"#ffb030",tint:[1.45,.88,.3],r:1.5,rad:2.7,kind:2},{az:-12,el:27,hex:ne.red,disc:"#e2260f",tint:[1.7,.3,.25],r:1.8,rad:2.6,kind:3}],b=(n-r)/8,B=c=>Y(S(c),18+2*g(c),v(r-b,r+b,c)),q=.78,Z=(c,P)=>{const A=B(Math.max(0,c));return P.az=d[5].az+A*q,P.el=d[5].el-(Math.min(A,18)*(5/18)+Math.max(A-18,0)),P},_=Math.max(n+20,i.fullAt??n+60),W=_-n,he=n,w=he+W/14,de=w,fe=(w+_)/2,Q=Math.max(_,i.cityAt??_+W),Me=Math.max(Q+1,i.endAt??Q+300),ze=c=>3.6*Math.pow(T(1-g(c)),1.35),I=c=>{const P=T(c/3.6),A=1-2*P;return(Math.acos(Math.max(-1,Math.min(1,A)))-A*Math.sqrt(Math.max(0,1-A*A)))/Math.PI},me=se("#2a0f24"),ye=se("#7a1f1a"),E=se("#4f5a78"),K=se("#b9783a"),s=se("#5a86d2"),y=se("#f1e6cf"),M=se("#05040a"),x=(c,P,A=1)=>c.map((te,le)=>Math.max(0,(te-P[le])*A)),V=[x(s,E,.275),x(s,E,.275),x(s,E,.225),x(s,E,.225),x(E,me),me],F=[x(y,K,.2),x(y,K,.2),x(y,K,.3),x(y,K,.3),x(K,ye),ye],L=d.map(c=>new t.Color(c.hex)),U=d.map(c=>new t.Color(c.disc)),ie=new t.Color(ne.star),j=new t.Color("#ff9a4a"),e={m:0,turn:0,ecl:0,notchAt:r,goneAt:n,waveAt:w,swellAt:fe,nightAt:_,waveLen:W,cityAt:Q,city:0,suns:d.map((c,P)=>({dir:new t.Vector3,az:0,el:0,vis:0,sky:0,r:c.r,rad:c.rad,kind:c.kind,color:L[P],tint:new t.Vector3().fromArray(c.tint),disc:new t.Color})),thick:3.6,frac:1,bodyDir:new t.Vector3,bodyR:9,deathDir:new t.Vector3,heartDir:be(i.heartAz??2,i.heartEl??22),wave:-1,night:0,dark:0,first:0,crowd:0,swell:0,aur:0,hard:0,dusk:0,trem:1,el5:20,zen:new t.Color,hor:new t.Color,wind:.6,hemiSky:new t.Color,hemiGround:new t.Color,dir:[0,1,2].map(()=>({dir:new t.Vector3(0,1,0),color:new t.Color,el:10})),share:[0,1,2,3,4,5].map(()=>new t.Vector3),cot:new Float32Array(6),away:[0,1,2,3,4,5].map(()=>new t.Vector2)};{const c=Z(n,{});be(c.az,c.el,e.deathDir)}e.eclAt=c=>r+c*(n-r);const X=new t.Vector3,re=new t.Vector3,J=new t.Vector3,ee=new t.Vector3(0,1,0),f=new t.Color,$=new t.Vector3(0,10,300);e.at=(c,P=$)=>{const A=c,te=S(c),le=T(g(c));e.m=c,e.turn=te,e.ecl=le;let Ce=M[0],Pe=M[1],Ae=M[2],Ve=M[0],Le=M[1],Ne=M[2];e.thick=ze(A),e.frac=I(e.thick),e.trem=1-.42*(1-v(.02,.3,e.thick))*(.5+.5*Math.sin(c*2.3+z[0])*Math.sin(c*.71+z[1]));const Qe=Math.pow(e.frac,.42);for(let l=0;l<6;l++){const k=d[l],p=e.suns[l];l===5?Z(A,p):(p.el=k.el-te,p.az=k.az+te*q),be(p.az,p.el,p.dir),p.sky=v(-5,5,p.el)*(l===5?Qe:1),p.vis=v(-.4,2.6,p.el-a(p.az,P)),Ce+=V[l][0]*p.sky,Pe+=V[l][1]*p.sky,Ae+=V[l][2]*p.sky,Ve+=F[l][0]*p.sky,Le+=F[l][1]*p.sky,Ne+=F[l][2]*p.sky;const O=v(-1,7,p.el);p.disc.copy(U[l]).lerp(j,(1-O)*(l===5?0:l<2?.12:.5)).multiplyScalar(p.rad*(l<2?.8+.2*O:.5+.5*O)*(l===5?e.trem:1))}e.zen.setRGB(Ce,Pe,Ae),e.hor.setRGB(Ve,Le,Ne);const ce=e.suns[5];re.crossVectors(ce.dir,ee).normalize(),J.crossVectors(re,ce.dir).normalize();const Re=(e.bodyR-1.8+e.thick-Math.max(0,c-n)*.0176)*H;e.bodyDir.copy(ce.dir).multiplyScalar(Math.cos(Re)).addScaledVector(re,Math.sin(Re)*.72).addScaledVector(J,-Math.sin(Re)*.694).normalize(),e.dark=1-v(0,.2,e.thick),e.first=v(he,w,c);{const l=(c-w)/(_-w);e.crowd=T(l*2),e.swell=v(.5,1,l),e.wave=l<=0?l:1.25*Math.pow(e.crowd,.8)+.5*e.swell}e.night=v(w,_,c),e.city=v(Q,Me,c),e.aur=Math.pow(e.frac,.3)*v(-2.5,1.5,e.suns[5].el),e.hard=1-T(e.thick/3.6),e.dusk=(1-v(.3,.62,e.frac))*v(0,.01,e.thick),e.wind=.6+1*v(.15,1,le);const we=(e.suns[0].sky+e.suns[1].sky+e.suns[2].sky+e.suns[3].sky+2*e.suns[4].sky)/6,xe=Y(1.12,1.55,v(0,.34,we))*Y(1,.56,v(0,1,le)),ge=1-v(0,.09,e.thick);f.setRGB((Ce+Ve)*.5,(Pe+Le)*.5,(Ae+Ne)*.5);const Ke=Math.max(f.r,f.g,f.b,1e-5);f.multiplyScalar(xe/Ke),f.r=Math.max(f.r,.24*xe*(1-we)),f.g=Math.max(f.g,.27*xe*(1-we)),f.b=Math.max(f.b,.25*xe*(1-we)),f.r=Y(f.r,.3,ge),f.g=Y(f.g,.13,ge),f.b=Y(f.b,.15,ge);{const l=.6*(1-v(.3,.62,e.frac)),k=Math.max(f.r,f.g,f.b);f.r=Y(f.r,.3*k,l),f.g=Y(f.g,.24*k,l),f.b=Y(f.b,.5*k,l)}f.multiplyScalar(.06+.94*v(0,.01,e.thick));const qe=.8*e.night;e.hemiSky.setRGB(f.r*(1-e.night)+.72*qe,f.g*(1-e.night)+.8*qe,f.b*(1-e.night)+1*qe),e.hemiGround.copy(e.hemiSky).multiplyScalar(.34-.2*e.night),e.hemiGround.r*=1.12,e.hemiGround.b*=.82;const pe=e.dir[2],Xe=(e.suns[0].vis+e.suns[1].vis)*.5;pe.dir.copy(e.suns[0].dir).add(e.suns[1].dir).normalize(),pe.color.copy(L[0]).multiplyScalar(2.6*Xe),pe.el=(e.suns[0].el+e.suns[1].el)*.5;const ae=e.dir[1],ke=e.suns[4],Ee=v(-1,9,ke.el);ae.dir.copy(ke.dir),ae.color.copy(L[4]).lerp(j,(1-Ee)*.6).multiplyScalar(4.2*ke.vis*(.45+.55*Ee)),ae.el=ke.el,G&&e.night>0&&(ae.dir.copy(G),ae.color.copy(ie).multiplyScalar(.62*e.night),ae.el=40);const N=e.dir[0],Fe=te<11.75,Oe=!Fe&&c<de;if(Fe){const l=(e.suns[2].vis+e.suns[3].vis)*.5*(1-v(10,11.75,te));N.dir.copy(e.suns[2].dir).add(e.suns[3].dir).normalize(),N.color.copy(L[2]).multiplyScalar(3.2*l),N.el=(e.suns[2].el+e.suns[3].el)*.5}else if(Oe){const l=v(12,15,te)*Y(3.4,2.7,v(0,.92,le))*(1-.2*e.dusk)*e.trem*(1-ge)*ce.vis;N.dir.copy(ce.dir),N.color.setRGB(.6*l,.085*l,.06*l),N.el=ce.el}else N.dir.copy(e.heartDir),N.color.copy(ie).multiplyScalar(1*e.night),N.el=22;const He=e.hemiSky;let Be=He.r,Ge=He.g,_e=He.b;const Se=[N,ae,pe];for(let l=0;l<3;l++){const k=Math.pow(Math.max(0,Se[l].dir.y),.55);Be+=Se[l].color.r*k,Ge+=Se[l].color.g*k,_e+=Se[l].color.b*k}for(let l=0;l<6;l++){const k=e.suns[l],p=k.kind,O=Math.pow(Math.sin(Math.max(k.el,.5)*H),.55)*1.3,Ie=Math.hypot(k.dir.x,k.dir.z)||1;e.away[l].set(-k.dir.x/Ie,-k.dir.z/Ie),e.cot[l]=Math.min(24,1/Math.tan(Math.max(k.el,2.4)*H));let oe=null,ve=.62;p===0?oe=pe.color:p===2?(oe=ae.color,ve=1):p===1&&Fe?oe=N.color:p===3&&Oe&&(oe=N.color,ve=1);const Je=v(.3,3.5,k.el);if(!oe)e.share[l].set(0,0,0);else{const Ue=oe.r*O*ve/Math.max(Be,1e-4),Ye=oe.g*O*ve/Math.max(Ge,1e-4),Ze=oe.b*O*ve/Math.max(_e,1e-4),ue=(Ue+Ye+Ze)/3,Te=p===3?.7:1.85;e.share[l].set(T((ue+(Ue-ue)*Te)*1.2)*.82,T((ue+(Ye-ue)*Te)*1.2)*.82,T((ue+(Ze-ue)*Te)*1.2)*.82).multiplyScalar(Je*(p===3?1+.12*e.hard:1))}}if(e.el5=Math.max(e.suns[5].el,8),c>=de){const l=e.heartDir.x,k=e.heartDir.z,p=Math.hypot(l,k)||1,O=Math.pow(Math.max(e.heartDir.y,.05),.55)*1.25;e.away[5].set(-l/p,-k/p),e.cot[5]=Math.min(24,p/Math.max(e.heartDir.y,.05)),e.el5=Math.asin(Math.min(1,Math.max(.14,e.heartDir.y)))/H,e.share[5].set(T(N.color.r*O/Math.max(Be,1e-4)),T(N.color.g*O/Math.max(Ge,1e-4)),T(N.color.b*O/Math.max(_e,1e-4)))}return e};let G=null;e.setFill=c=>{if(G=c.clone(),G.y>.72){const P=Math.hypot(G.x,G.z);if(P<.05)G.set(-.7,.7,.15);else{const A=Math.sqrt(.48160000000000003)/P;G.set(G.x*A,.72,G.z*A)}}G.y=Math.max(G.y,.35),G.normalize()};const De={az:0,el:0};return e.redDirAt=(c,P)=>(Z(c,De),be(De.az,De.el,P)),e.at(0),e}function ct(i,h,u={}){const a=h.heartDir.clone(),r=[],n=[],R=new t.Vector3().crossVectors(a,new t.Vector3(0,1,0)).normalize();for(let o=0;o<7;o++){const C=o%2,D=.16+.7*((o>>1)+i()*.6)/3.6,m=(C?1:-1)*(.38+.2*i()),d=D*Math.PI,b=new t.Vector3(a.x,0,a.z).normalize(),B=new t.Vector3().copy(b).multiplyScalar(Math.cos(d)).addScaledVector(new t.Vector3(0,1,0),Math.sin(d)*Math.cos(m)).addScaledVector(R,Math.sin(d)*Math.sin(m)).normalize(),q=(1.5+1.5*i())*H;r.push({dir:B,sigma:q,amp:.3+.35*i()})}for(let o=0;o<3;o++){const C=(o===0?.42:o===1?-.95:1.9)+(i()-.5)*.5,D=(i()-.5)*.5,m=new t.Vector3(Math.cos(C)*Math.cos(D),Math.sin(D),Math.sin(C)*Math.cos(D)),d=o===0?.07+.05*i():0,b=new t.Quaternion().setFromUnitVectors(new t.Vector3(0,0,-1),new t.Vector3(a.x,0,a.z).normalize());m.applyQuaternion(b),n.push({n:m,phase:i()*6.283,off:d})}const z=u.warmth??.3;for(const o of n)o.e1=new t.Vector3().crossVectors(o.n,new t.Vector3(0,1,0)).normalize(),o.e2=new t.Vector3().crossVectors(o.n,o.e1);const S=o=>{let C=1;for(const D of n){const m=D.phase,d=Math.atan2(o.dot(D.e2),o.dot(D.e1)+1e-5),b=o.dot(D.n)-D.off,B=.15*Math.sin(2*d+m)+.09*Math.sin(5*d+m*1.7)+.04*Math.sin(11*d+m*2.3)+.015*Math.sin(23*d+m*.7),q=.5+.5*Math.sin(3*d+m*2.1),Z=.012+.05*q*q,_=.72*v(-.6,.5,Math.sin(4*d+m*3)),W=(b+B)/Z;C*=1-_*Math.exp(-Math.min(W*W,40))}return C},g=new t.Vector3;for(const o of r)g.addScaledVector(o.dir,o.amp*o.sigma*o.sigma);return g.normalize(),h.setFill(g),{heart:a,clots:r,lanes:n,warmth:z,laneAt:S}}function et(i){const u=new Uint8Array(262144);for(let r=0;r<u.length;r++)u[r]=Math.floor(i()*256);const a=new t.DataTexture(u,256,256,t.RGBAFormat);return a.wrapS=a.wrapT=t.RepeatWrapping,a.magFilter=t.LinearFilter,a.minFilter=t.LinearMipmapLinearFilter,a.generateMipmaps=!0,a.needsUpdate=!0,a}const We=`
uniform sampler2D tSkyNoise;
uniform vec3 uHeart, uDeath;
uniform vec4 uClot[7];      // direction, 1 / sigma^2
uniform float uClotA[7];
uniform vec4 uLane[3];      // plane normal, phase
uniform float uLaneOff[3];
uniform vec4 uNightP;       // night amount, how much of the unresolved glow is out, time, warmth
vec2 skyUv(vec3 d){ return d.xz / (1.3 + d.y); }
float skyLanes(vec3 d){
  float m = 1.0;
  for (int i = 0; i < 3; i++) {
    vec3 n = uLane[i].xyz; float ph = uLane[i].w;
    vec3 e1 = normalize(cross(n, vec3(0.0, 1.0, 0.0)) + vec3(1e-5, 0.0, 0.0)), e2 = cross(n, e1);
    float s = atan(dot(d, e2), dot(d, e1) + 1e-5), h = dot(d, n) - uLaneOff[i];
    float w = 0.15*sin(2.0*s + ph) + 0.09*sin(5.0*s + ph*1.7) + 0.04*sin(11.0*s + ph*2.3) + 0.015*sin(23.0*s + ph*0.7);
    float g = 0.5 + 0.5*sin(3.0*s + ph*2.1), wd = 0.012 + 0.05*g*g;
    float str = 0.72*smoothstep(-0.6, 0.5, sin(4.0*s + ph*3.0));
    float x = (h + w)/wd;
    m *= 1.0 - str*exp(-min(x*x, 40.0));
  }
  return m;
}
float skyWave(vec3 d){ return clamp(uNightP.y, 0.0, 1.0); }      // (the unresolved glow comes over the whole sky at once: a share with the crowd, the rest with the swell)
vec3 nightGlow(vec3 d){
  float ah = acos(clamp(dot(d, uHeart), -1.0, 1.0));
  float heart = 0.24*exp(-ah*ah/0.05) + 0.11*exp(-ah*ah/0.3) + 0.06*exp(-ah/0.6) + 0.04*exp(-ah/1.2);
  float clots = 0.0;
  for (int i = 0; i < 7; i++) { float c = max(1.0 - dot(d, uClot[i].xyz), 0.0); clots += uClotA[i]*exp(-c*uClot[i].w); }
  vec2 p = skyUv(d);
  vec4 t1 = texture2D(tSkyNoise, p*0.21 + 0.13), t2 = texture2D(tSkyNoise, p*0.62 + 0.41), t3 = texture2D(tSkyNoise, p*1.7), t4 = texture2D(tSkyNoise, p*4.6 + 0.7);
  float n1 = t1.r, n2 = t2.g, n3 = t3.b, n4 = t4.a;
  float lane = skyLanes(d + 0.05*(vec3(n2, n1, n2) - 0.5));
  float knots = smoothstep(0.3, 0.8, n2*0.55 + n3*0.45);                      // knots and voids inside the glow: it is stars, not a lamp
  float g = (0.55 + 0.5*n1)*(0.45 + 1.15*knots)*(0.8 + 0.4*n4);
  float I = (0.03 + heart + clots*0.8)*g*mix(0.1, 1.0, lane);
  // its colour: fields of blue-white suns, of golden ones, here and there of red ones
  float gold = clamp(smoothstep(0.38, 0.72, t1.g*0.6 + t3.r*0.4)*(0.45 + uNightP.w), 0.0, 1.0), rose = smoothstep(0.6, 0.86, t2.b)*0.55;
  vec3 col = mix(mix(vec3(0.5, 0.64, 1.0), vec3(1.0, 0.8, 0.52), gold), vec3(1.0, 0.56, 0.48), rose);
  return col*I*uNightP.x*skyWave(d)*smoothstep(-0.02, 0.1, d.y);
}`;function tt(i,h,u){return{tSkyNoise:{value:et(i)},uHeart:{value:u.heart},uDeath:{value:h.deathDir},uClot:{value:u.clots.map(a=>new t.Vector4(a.dir.x,a.dir.y,a.dir.z,1/(a.sigma*a.sigma)))},uClotA:{value:u.clots.map(a=>a.amp)},uLane:{value:u.lanes.map(a=>new t.Vector4(a.n.x,a.n.y,a.n.z,a.phase))},uLaneOff:{value:u.lanes.map(a=>a.off)},uNightP:{value:new t.Vector4(0,-1,0,u.warmth)}}}const je=`
uniform vec3 uZen, uHor;
uniform vec3 uSunDir[6];
uniform vec3 uSunCol[6];
uniform vec4 uSunP[6];      // disc radius (radians), tight glow, wash, sky weight
uniform vec3 uSunTint[6];
uniform float uAur;          // the dying sun's wine aureole
uniform vec4 uLit;           // the red sun's lit part: the direction of its middle, and its half thickness (radians)
uniform vec4 uDusk;          // the dusk: how much of it; the city's bearing (x, z); the sliver's tremble
vec3 daySky(vec3 d){
  float y = clamp(d.y, 0.0, 1.0), t = pow(1.0 - y, 4.4);
  vec3 col = mix(uZen*(1.0 - 0.3*y), uHor, t);
  for (int i = 0; i < 6; i++) {
    float ang = acos(clamp(dot(d, uSunDir[i]), -1.0, 1.0)), r = uSunP[i].x;
    float wash = uSunP[i].z*(1.1*exp(-ang/0.075) + 0.55*exp(-ang/0.2) + 0.22*exp(-ang/0.5))*(0.45 + 0.55*t);
    col = mix(col, col*uSunTint[i], clamp(wash, 0.0, 0.92));               // each sun stains its side of the sky with its own hue
    if (i == 5) {      // the red sun's glare belongs to what is left of it: it is centred on the sliver and shrinks with it (no ghost of the whole disc)
      float al = acos(clamp(dot(d, uLit.xyz), -1.0, 1.0));
      col += uSunCol[i]*(uSunP[i].y*(exp(-al/(uLit.w*1.5 + 0.004)) + 0.11*exp(-al/0.06) + 0.045*exp(-al/0.32)));
      col += vec3(0.5, 0.03, 0.035)*(uAur*(0.42*exp(-al/0.13) + 0.26*exp(-al/0.5))*(0.35 + 0.65*t));
    } else col += uSunCol[i]*(uSunP[i].y*(exp(-ang/(r*1.5 + 0.004)) + 0.11*exp(-ang/0.06)));
  }
  if (uDusk.x > 0.001) {
    // THE DUSK: the air keeps a colour of its own, a floor under the failing sky. Overhead a deep wine-indigo, never black; a WIDE ember glow in
    // the air on the sun's side that thins with the angle from the sliver (light in the air: no ring, no rays, and the sun no larger); a low dull
    // red under the sliver and a little to either side of its bearing, gone well before the city's; and the city's side dark first.
    float al = acos(clamp(dot(d, uLit.xyz), -1.0, 1.0));
    vec2 hd = d.xz/max(length(d.xz), 1e-4), hs = uLit.xz/max(length(uLit.xz), 1e-4);
    float ha = acos(clamp(dot(hd, hs), -1.0, 1.0)), hc = acos(clamp(dot(hd, uDusk.yz), -1.0, 1.0));
    vec3 air = vec3(0.036, 0.021, 0.07)*(0.72 + 0.28*y)
      + vec3(0.42, 0.064, 0.03)*(uDusk.w*(0.5*exp(-al/0.36) + 0.2*exp(-al/0.85)))
      + vec3(0.3, 0.04, 0.02)*(uDusk.w*exp(-min(ha*ha/0.16, 40.0))*exp(-y/0.09));
    air *= 1.0 - 0.78*exp(-min(hc*hc/0.3, 40.0))*exp(-y/0.35);
    col = mix(col, max(col, air), uDusk.x);
  }
  return col;
}`,at=`
varying vec3 vDir;
void main(){
  vDir = position;
  vec4 p = projectionMatrix*vec4(mat3(viewMatrix)*position, 1.0);
  if (abs(p.w) < 1e-4) p.w = 1e-4;
  gl_Position = p.xyww;
}`,ot=`
${We}
${je}
varying vec3 vDir;
uniform vec4 uBody;         // the dark body: direction, radius (radians)
uniform vec4 uCity;         // bearing x, z; strength; flicker
uniform float uAA, uCirrus, uBead;
uniform vec4 uCloud;        // low cloud: how much, where its field lies (x, z), how much of it is left
float sH(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.x); }
void main(){
  vec3 d = normalize(vDir);
  float y = d.y;
  vec3 col = daySky(d);
  float above = smoothstep(-0.012, 0.0, y);
  vec3 lit = vec3(0.0); float discAll = 0.0;
  for (int i = 0; i < 6; i++) {
    float ang = acos(clamp(dot(d, uSunDir[i]), -1.0, 1.0)), r = uSunP[i].x;
    float disc = 1.0 - smoothstep(r - uAA, r + uAA, ang);
    disc *= 0.62 + 0.38*sqrt(max(1.0 - ang*ang/(r*r), 0.0));                 // a darker limb: the disc reads as a ball
    if (i == 5) {      // the unseen body's limb has heights and hollows: when the thread is thin enough its light is left only in the hollows, as beads
      vec3 bx = normalize(cross(uBody.xyz, vec3(0.0, 1.0, 0.0))), by = cross(bx, uBody.xyz);
      float la = atan(dot(d, by), dot(d, bx) + 1e-5), rough = 0.5 + 0.5*sin(la*131.0 + 1.7)*sin(la*47.0 + 0.4);
      float ab = acos(clamp(dot(d, uBody.xyz), -1.0, 1.0)) - uBead*0.0032*rough;
      disc *= smoothstep(uBody.w - uAA, uBody.w + uAA, ab);
    }
    col = mix(col, uSunCol[i], disc*above); discAll = max(discAll, disc);    // the disc stands in place of the sky, so its own colour reads
    lit += uSunCol[i]*(uSunP[i].w*exp(-ang/0.8));
  }
  vec2 p = skyUv(d);
  if (uCirrus > 0.001) {      // thin high cirrus that takes each sun's colour
    vec2 q = vec2(p.x*0.83 + p.y*0.56, -p.x*0.56 + p.y*0.83);      // long streaks combed on a slant by the high wind
    float c1 = texture2D(tSkyNoise, vec2(q.x*0.046 + uNightP.z*0.00035, q.y*0.3)).g;      // (fix round 3, D3: shorter streaks, fewer, broken by gaps: mares' tails, not arcs ruled across the whole sky)
    float c2 = texture2D(tSkyNoise, vec2(q.x*0.055 + 0.3 + uNightP.z*0.0006, q.y*0.83 + 0.7)).r;
    float c3 = texture2D(tSkyNoise, vec2(q.x*0.0085 + 0.11, q.y*0.07) + 0.5).b;      // where there is any at all
    float brk = texture2D(tSkyNoise, q*0.11 + 0.23).r;
    float ci = smoothstep(0.72, 1.16, c1*0.62 + c2*0.3 + c3*0.6)*smoothstep(0.42, 0.7, brk)*smoothstep(0.04, 0.34, y)*uCirrus;
    col = mix(col, uHor*0.8 + uZen*0.35 + lit*0.1, ci*0.42);
  }
  if (uCloud.w > 0.001) {      // fair-weather cloud low over the far plain on every afternoon: a level field of flat-based heaps seen from below, drifting with
    // the wind, lit by whatever suns are up; it never stands before a sun's disc, and it goes with the red light as the cirrus does
    vec2 cq = d.xz/max(y + 0.07, 0.05)*0.5 + uCloud.yz + vec2(uNightP.z*0.004, uNightP.z*0.0015);
    float k1 = texture2D(tSkyNoise, cq*vec2(0.024, 0.034)).r, k2 = texture2D(tSkyNoise, cq*vec2(0.07, 0.1) + 0.37).g, k3 = texture2D(tSkyNoise, cq*0.33 + 0.11).b;
    float cov = k1*0.6 + k2*0.3 + k3*0.14, th = 0.7 - 0.12*uCloud.x;
    float cl = smoothstep(th, th + 0.13, cov)*smoothstep(0.012, 0.06, y)*(1.0 - smoothstep(0.12, 0.3, y))*uCloud.w*(1.0 - discAll);
    vec3 cc = (uHor*0.8 + uZen*0.3 + lit*0.2)*(0.7 + 0.5*smoothstep(th + 0.02, th + 0.3, cov + 0.12*k3));
    { float al = acos(clamp(dot(d, uLit.xyz), -1.0, 1.0)); cc += vec3(0.34, 0.05, 0.028)*(uDusk.x*uDusk.w*0.55*exp(-al/0.7)); }      // in the dusk the low cloud takes the ember's colour from underneath
    col = mix(col, cc, cl*0.82);
  }
  // the cluster: unresolved glow and a dust of faint points that thickens where the glow is strong
  if (uNightP.x > 0.001) {
    vec3 g = nightGlow(d);
    col += g;
    vec2 sp = p*118.0, ci = floor(sp), cf = fract(sp) - 0.5;
    float h = sH(ci);
    vec2 off = (vec2(sH(ci + 7.1), sH(ci + 3.7)) - 0.5)*0.56;
    float star = smoothstep(0.5, 1.0, h)*exp(-dot(cf - off, cf - off)*52.0);
    float tw = 0.8 + 0.2*sin(uNightP.z*(2.0 + 4.0*h) + h*40.0);
    col += (vec3(0.6, 0.72, 1.0)*0.2 + g*5.0)*(star*tw*uNightP.x*skyWave(d)*smoothstep(-0.01, 0.12, y));
  }
  // the far city burning: a crimson glow low on one bearing
  if (uCity.z > 0.001) {
    vec2 hd = d.xz/max(length(d.xz), 1e-4);
    float da = acos(clamp(dot(hd, uCity.xy), -1.0, 1.0));
    float yy = max(y, 0.0), r2 = da*da + yy*yy*1.5, w = 0.004 + 0.013*uCity.z;      // (the glow widens and climbs as the fire spreads through the town)
    float gl = 0.9*exp(-r2/w) + 0.5*exp(-r2/(w*8.0)) + 0.2*exp(-sqrt(max(r2, 0.0))/0.28);
    col += vec3(0.85, 0.1, 0.03)*(gl*uCity.z*uCity.w*0.7);
  }
  gl_FragColor = vec4(col, 1.0);
}`;function ut(i,h,u,a={}){const r={...tt(i,h,u),uZen:{value:h.zen},uHor:{value:h.hor},uSunDir:{value:h.suns.map(o=>o.dir)},uSunCol:{value:h.suns.map(o=>o.disc)},uSunP:{value:h.suns.map(o=>new t.Vector4(o.r*H,.2,.03,1))},uSunTint:{value:h.suns.map(o=>o.tint)},uBody:{value:new t.Vector4(.3,.3,-.9,9*H)},uCity:{value:new t.Vector4(.5,-.86,0,1)},uAA:{value:.002},uCloud:{value:new t.Vector4(a.cloud?.amount??0,a.cloud?.ox??0,a.cloud?.oz??0,0)},uCirrus:{value:0},uAur:{value:0},uDusk:{value:new t.Vector4(0,.5,-.86,1)},uBead:{value:0},uLit:{value:new t.Vector4(0,1,0,.03)}},n=new t.SphereGeometry(1,48,24),R=new t.ShaderMaterial({uniforms:r,vertexShader:at,fragmentShader:ot,side:t.BackSide,depthWrite:!1,depthTest:!1,fog:!1}),z=new t.Mesh(n,R);z.renderOrder=-10,z.frustumCulled=!1;const S=a.cirrus??0,g=new t.Vector3;return{object:z,uniforms:r,update(o,C,D){for(let m=0;m<6;m++){const d=o.suns[m],b=r.uSunP.value[m],B=m===5?o.frac:1,q=v(-2.5,1.5,d.el);b.y=.22*(m===5?Math.max(Math.sqrt(B),.4*v(0,.05,o.thick)):1)*q,b.z=(m===5?.42:m===4?.62:m<2?.6:.25)*Math.pow(B,.7)*v(-7,1.5,d.el),b.w=d.sky}r.uBody.value.set(o.bodyDir.x,o.bodyDir.y,o.bodyDir.z,o.bodyR*H);{const m=o.suns[5].dir,d=o.bodyDir,b=m.dot(d),B=(1.8-o.thick*.5)*H;g.copy(m).addScaledVector(d,-b);const q=g.length();q>1e-5?g.multiplyScalar(Math.tan(B)/q):g.set(0,0,0),g.add(m).normalize(),r.uLit.value.set(g.x,g.y,g.z,Math.max(o.thick,.02)*.5*H)}r.uAA.value=Math.max(C*.75,1e-4),r.uNightP.value.x=o.night,r.uNightP.value.y=.4*o.crowd+.6*o.swell,r.uNightP.value.z=D,r.uAur.value=o.aur,r.uDusk.value.set(o.dusk,r.uCity.value.x,r.uCity.value.y,o.trem),r.uBead.value=1-v(.15,.6,o.thick),r.uCirrus.value=S*(1-v(.3,.92,o.ecl)),r.uCloud.value.w=(a.cloud?1:0)*(1-v(.3,.92,o.ecl))}}}const rt=(i,h)=>`
${i?h:""}
attribute vec3 aDir, aCol;
attribute vec4 aP;          // half size (px at the reference height), phase, twinkle, big
attribute float aRank;      // 0 the brightest .. 1 the faintest
uniform float uFirst;       // how far down the ranks the stars have come out in the first moment after the snap, before the wave
uniform vec3 uDeath;
uniform vec4 uStarP;        // how far the stars have come (0 none .. 1.25 all out .. 1.75 after the swell), time, px scale, least half size (px)
uniform vec2 uRes;
uniform vec4 uLake;         // level, strength, -, -
varying vec2 vQ; varying vec3 vCol; varying float vBig;
void main(){
  float ang = acos(clamp(dot(aDir, uDeath), -1.0, 1.0));
  // all over the sky at once: a star comes out by its rank (the brightest first), sooner the nearer it stands to where the sun died (so the sky is
  // thickest toward the heart from the first), each a little early or late; no front crosses the sky and nothing grows from one spot
  float t = (uStarP.x - aRank*(0.45 + 0.55*(1.0 - exp(-min(ang*ang/0.7, 40.0)))) - 0.12*fract(aP.y*13.7 + aRank*5.3))/0.1;
  float sw = clamp((uStarP.x - 1.25)/0.5, 0.0, 1.0);                          // the swell: when the torch falls the Stars seem nearer
  float on = max(smoothstep(0.0, 1.0, t), 0.85*smoothstep(0.0, 0.004, uFirst - aRank));
  float over = 1.0 + 0.5*exp(-(t - 1.3)*(t - 1.3)*1.4)*smoothstep(0.0, 1.0, t);                 // each star overshoots and settles
  float lowk = 1.0 + 1.5*(1.0 - smoothstep(0.02, 0.4, aDir.y));               // more twinkle near the horizon
  float tw = 1.0 + min(aP.z*lowk, 0.45)*sin(uStarP.y*(1.5 + 5.0*fract(aP.y*7.31)) + aP.y*43.0);
  float amp = on*over*tw*mix(1.0, 0.62 + 0.38*sw, smoothstep(0.02, 0.1, aRank))*smoothstep(-0.005, 0.07, aDir.y);      // (the brightest stand at their full value from the first; it is the crowd that deepens)
  float hp = max(uStarP.w, aP.x*uStarP.z*mix(0.45, 1.0, smoothstep(0.0, 1.6, t)));
  vec2 q = position.xy;
${i?`
  vec3 cam = cameraPosition; float hy = max(cam.y - uLake.x, 0.5);
  float tt = hy/max(aDir.y, 0.012);
  vec3 P = cam + vec3(aDir.x, -aDir.y, aDir.z)*tt;
  // This is WATER, not a second sky. (1) Water mirrors a low star well and a high one poorly: the higher the star, the steeper we look down at its
  // image and the less of it comes back, so the images near the far shore are the bright ones and the water under us is dark. (2) The cold wind
  // ruffles the lake in drifting patches, and there the images are scattered. (3) Over the shallows by the shore nothing mirrors. (4) Ripples draw
  // every image out into a streak toward the eye.
  float ruf = sin(P.x*0.011 + uStarP.y*0.021 + 1.3*sin(P.z*0.007 - uStarP.y*0.013))*sin(P.z*0.0083 + uStarP.y*0.017 + 1.1*sin(P.x*0.0061)) + 0.25*sin(P.x*0.037 - P.z*0.029 + uStarP.y*0.05);
  float calm = smoothstep(-0.25, 0.35, ruf);
  float rp = (0.3 + 0.004*tt)*(2.2 - 1.2*calm);
  P.xz += vec2(sin(P.z*0.37 + uStarP.y*1.7 + aP.y*20.0), cos(P.x*0.31 + uStarP.y*1.3 + aP.y*33.0))*rp;
  P.y = uLake.x;
  float gr = 1.0 - clamp(aDir.y, 0.0, 1.0);
  amp *= uLake.y*(0.14 + 0.66*gr*gr*gr)*(0.3 + 0.7*calm)*smoothstep(0.25, 4.2, uLake.x - landH(P.xz))*(1.0 - smoothstep(3500.0, 5500.0, tt));
  vec4 c = projectionMatrix*viewMatrix*vec4(P, 1.0);
  if (abs(c.w) < 1e-4) c.w = 1e-4;
  // the ripples draw each image out 4.6 times its width ALONG THE WATER, toward the eye's place (not along the picture's upright): the place one
  // metre nearer the eye on the water is projected too, and the image is built along the line between the two
  vec2 toEye = cam.xz - P.xz; toEye /= max(length(toEye), 1e-3);
  vec4 c2 = projectionMatrix*viewMatrix*vec4(P + vec3(toEye.x, 0.0, toEye.y), 1.0);
  if (abs(c2.w) < 1e-4) c2.w = 1e-4;
  vec2 ax = (c2.xy/c2.w - c.xy/c.w)*uRes; float axl = length(ax);
  ax = axl > 1e-4 ? ax/axl : vec2(0.0, -1.0);
  c.xy += (vec2(ax.y, -ax.x)*q.x + ax*(q.y*4.6))*(hp*0.62*2.0*c.w*step(0.002, amp))/uRes;      // (across, then along: the card keeps its facing)
`:`
  vec4 c = projectionMatrix*vec4(mat3(viewMatrix)*aDir, 1.0);
  if (abs(c.w) < 1e-4) c.w = 1e-4;
  c.xy += q*hp*2.0/uRes*c.w*step(0.002, amp);
  c.z = c.w;
`}
  gl_Position = c; vQ = position.xy; vCol = aCol*amp; vBig = aP.w;
}`,st=`
varying vec2 vQ; varying vec3 vCol; varying float vBig;
void main(){
  float r2 = clamp(dot(vQ, vQ), 0.0, 4.0), r = sqrt(r2);
  float small = max(exp(-r2*4.2) - 0.015, 0.0);
  float big = exp(-r2*26.0) + 0.085*pow(max(1.0 - r, 0.0), 2.6);
  gl_FragColor = vec4(vCol*mix(small, big, vBig), 1.0);
}`;async function ht(i,h,u,a={}){const r=a.count??3e4,n=a.mirror??6e3,R=a.landGLSL||"float landH(vec2 p){ return -9.0; }",z=new Float32Array(r*3),S=new Float32Array(r*3),g=new Float32Array(r*4),o=new Float32Array(r),C=u.heart,D=new t.Vector3().crossVectors(C,new t.Vector3(0,1,0)).normalize(),m=new t.Vector3().crossVectors(D,C).normalize(),d=new t.Vector3,b=new t.Vector3,B=new t.Vector3,q=new t.Vector3(0,1,0),Z=(s,y,M,x)=>{b.crossVectors(y,q),b.lengthSq()<1e-6&&b.set(1,0,0),b.normalize(),B.crossVectors(b,y).normalize();const V=s.gauss()*M,F=s.gauss()*M,L=Math.hypot(V,F),U=L>1e-6?Math.sin(L)/L:1;return x.copy(y).multiplyScalar(Math.cos(L)).addScaledVector(b,V*U).addScaledVector(B,F*U).normalize()};let _=0;for(const s of u.clots)_+=s.amp*s.sigma*s.sigma;const W=a.blue??.55,he=[[new t.Color("#b4ccff"),W],[new t.Color("#fff3e2"),.2],[new t.Color("#ffcf86"),(1-W-.2)*.5],[new t.Color("#ff9468"),(1-W-.2)*.3],[new t.Color("#ff6f5e"),(1-W-.2)*.2]];let w=0;const de=async(s,y,M)=>{let x=0;for(;w<y&&x++<r*6;){if((x&4095)===0&&a.yieldFn&&await a.yieldFn(),M)Z(s,C,36*H,d);else{const J=s();if(J<.45)Z(s,C,(s()<.3?6:14)*H,d);else if(J<.65){let ee=s()*_,f=u.clots[0];for(const $ of u.clots)if(ee-=$.amp*$.sigma*$.sigma,ee<=0){f=$;break}Z(s,f.dir,f.sigma*1.1,d)}else{const ee=-.04+1.04*s(),f=s()*6.2832,$=Math.sqrt(Math.max(0,1-ee*ee));d.set(Math.cos(f)*$,ee,Math.sin(f)*$)}}const V=s(),F=Math.pow(s(),7),L=s(),U=s(),ie=s();if(d.y<-.04||V>.08+.92*u.laneAt(d))continue;z[w*3]=d.x,z[w*3+1]=d.y,z[w*3+2]=d.z,o[w]=F;let j=L,e=he[0][0];for(const J of he)if(j-=J[1],j<=0){e=J[0];break}const X=Math.acos(Math.max(-1,Math.min(1,d.dot(C)))),re=(.2+2.6*Math.sqrt(F))*(1-.55*Math.exp(-X*X/.06));S[w*3]=e.r*re,S[w*3+1]=e.g*re,S[w*3+2]=e.b*re,g[w*4]=.9+.9*Math.sqrt(F),g[w*4+1]=U,g[w*4+2]=.1+.15*ie,g[w*4+3]=0,w++}};await de(i,a.wide?Math.round(r*.8):r,!1),a.wide&&await de(a.wide,r,!0);const fe=Array.from({length:w},(s,y)=>y).sort((s,y)=>o[y]-o[s]);for(let s=0;s<Math.min(a.bright??250,w);s++){const y=fe[s],M=1+.7*(1-s/250);g[y*4]*=3,g[y*4+3]=1,S[y*3]*=M,S[y*3+1]*=M,S[y*3+2]*=M}const Q=new Float32Array(w);fe.forEach((s,y)=>{Q[s]=y/Math.max(1,w-1)});const Me=new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),ze=[0,1,2,0,2,3],I={uFirst:{value:0},uDeath:{value:h.deathDir},uStarP:{value:new t.Vector4(-1,0,1,1.05)},uRes:{value:new t.Vector2(800,450)},uLake:{value:new t.Vector4(a.lakeY??0,.6,0,0)}},me=(s,y,M)=>{const x=new t.InstancedBufferGeometry;x.setAttribute("position",new t.BufferAttribute(Me,3)),x.setIndex(ze);let V=z,F=S,L=g,U=Q;y&&(V=new Float32Array(s*3),F=new Float32Array(s*3),L=new Float32Array(s*4),U=new Float32Array(s),y.forEach((e,X)=>{U[X]=Q[e],V.set(z.subarray(e*3,e*3+3),X*3),F.set(S.subarray(e*3,e*3+3),X*3),L.set(g.subarray(e*4,e*4+4),X*4)})),x.setAttribute("aDir",new t.InstancedBufferAttribute(V.subarray(0,s*3),3)),x.setAttribute("aCol",new t.InstancedBufferAttribute(F.subarray(0,s*3),3)),x.setAttribute("aP",new t.InstancedBufferAttribute(L.subarray(0,s*4),4)),x.setAttribute("aRank",new t.InstancedBufferAttribute(U.subarray(0,s),1)),x.instanceCount=s;const ie=new t.ShaderMaterial({uniforms:I,vertexShader:rt(M,R),fragmentShader:st,transparent:!0,depthWrite:!1,depthTest:!0,blending:t.AdditiveBlending,fog:!1}),j=new t.Mesh(x,ie);return j.frustumCulled=!1,j.renderOrder=M?-3:-5,j},ye=me(w,null,!1),E=[];for(let s=0;s<w&&E.length<n;s++){const y=fe[s];z[y*3+1]>.02&&z[y*3+2]<.2&&E.push(y)}const K=me(E.length,E,!0);return{object:ye,mirror:K,uniforms:I,count:w,update(s,y,M,x){I.uStarP.value.x=s.wave,I.uStarP.value.y=y,I.uFirst.value=.05*s.first,M&&(M.getDrawingBufferSize(x),I.uRes.value.copy(x),I.uStarP.value.z=Math.pow(Math.max(x.y,200)/450,.62)),I.uLake.value.y=.6*s.night;const V=s.first>0;ye.geometry.instanceCount=V?w:0,K.geometry.instanceCount=V?E.length:0}}}const $e=`
varying vec3 vW;
void main(){ vec4 w = modelMatrix*vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,nt=i=>`
${i}
${We}
${je}
varying vec3 vW;
uniform vec3 uFogCol, uWater;
uniform vec4 uCity;
uniform float uFogDen, uLakeY;
float sH2(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.x); }
void main(){
  vec3 V = vW - cameraPosition; float dist = length(V); V /= max(dist, 1e-3);
  vec2 q = vW.xz; float tt = uNightP.z;
  vec2 n1 = texture2D(tSkyNoise, q*0.011 + vec2(tt*0.011, tt*0.006)).rg - 0.5;
  vec2 n2 = texture2D(tSkyNoise, q*0.043 - vec2(tt*0.021, -tt*0.015)).gb - 0.5;
  float k = 1.0/(1.0 + dist*0.0016);
  // cat's-paws: the cold wind ruffles the lake in drifting patches, and there the mirror breaks into a shimmer
  float paw = smoothstep(0.42, 0.7, texture2D(tSkyNoise, q*0.0019 + vec2(tt*0.0016, tt*0.0006)).r*0.65 + texture2D(tSkyNoise, q*0.0061 + vec2(tt*0.004, -tt*0.0011)).g*0.35);
  vec2 n3 = texture2D(tSkyNoise, q*0.13 + vec2(tt*0.05, tt*0.031)).rb - 0.5;
  k *= 1.0 + 1.6*paw;
  // ripple rings: here and there a fish rises, and a ring widens from the place and dies (one place in each 70 m of water, on the world's clock)
  vec2 rc = floor(q/70.0), rf = fract(q/70.0) - 0.5; float rh = sH2(rc);
  vec2 ro = rf - (vec2(sH2(rc + 3.7), sH2(rc + 9.1)) - 0.5)*0.5; float rr = length(ro)*70.0, age = fract(tt*0.09 + rh*7.0);
  float ring = sin((rr - age*24.0)*1.3)*exp(-abs(rr - age*24.0)*0.22)*(1.0 - age)*step(0.5, rh);
  vec2 rdir = ro/max(length(ro), 1e-3);
  vec3 N = normalize(vec3((n1.x*0.11 + n2.x*0.07)*k + n3.x*0.16*paw + rdir.x*ring*0.22, 1.0, (n1.y*0.11 + n2.y*0.07)*k + n3.y*0.16*paw + rdir.y*ring*0.22));
  vec3 R = reflect(V, N); R.y = abs(R.y) + 0.004; R = normalize(R);
  vec3 sky = daySky(R);
  sky += nightGlow(R)*0.72;                                                 // (water gives back less than it is shown)
  vec2 hd = R.xz/max(length(R.xz), 1e-4);
  float da = acos(clamp(dot(hd, uCity.xy), -1.0, 1.0));
  float sk = texture2D(tSkyNoise, vec2(da*7.0, dist*0.0045 - tt*0.035)).r*0.6 + texture2D(tSkyNoise, vec2(da*19.0 + 0.3, dist*0.011 - tt*0.06)).g*0.4;
  float streak = smoothstep(0.42, 0.78, sk)*(0.75 + 0.25*sin(tt*3.1 + sk*20.0));
  sky += vec3(0.85, 0.1, 0.03)*(exp(-da*da/(0.0025 + 0.005*uCity.z))*exp(-R.y/0.2)*streak*uCity.z*uCity.w*1.7);      // the fire's road on the water
  float fres = 0.05 + 0.95*pow(1.0 - clamp(-V.y, 0.0, 1.0), 4.0);
  vec3 col = mix(uWater*(uZen + uHor), sky, fres);
  float depth = uLakeY - landH(q);
  float a = smoothstep(0.0, 0.6, depth);
  col *= 0.4 + 0.6*smoothstep(0.3, 4.4, depth);                           // the shallows by the shore are dark: mud and weed show through
  float f = 1.0 - exp(-uFogDen*uFogDen*dist*dist);
  col = mix(col, uFogCol, clamp(f, 0.0, 1.0));
  gl_FragColor = vec4(col, a);
}`;function dt(i,h={}){const u=h.bounds||[-1800,-2700,2600,-470],a=h.lakeY??0,r=new t.PlaneGeometry(u[2]-u[0],u[3]-u[1],8,8);r.rotateX(-Math.PI/2),r.translate((u[0]+u[2])/2,a,(u[1]+u[3])/2);const n=i.uniforms,R={tSkyNoise:n.tSkyNoise,uHeart:n.uHeart,uDeath:n.uDeath,uClot:n.uClot,uClotA:n.uClotA,uLane:n.uLane,uLaneOff:n.uLaneOff,uNightP:n.uNightP,uZen:n.uZen,uHor:n.uHor,uSunDir:n.uSunDir,uSunCol:n.uSunCol,uSunP:n.uSunP,uSunTint:n.uSunTint,uCity:n.uCity,uAur:n.uAur,uDusk:n.uDusk,uLit:n.uLit,uFogCol:{value:h.fogColor||new t.Color},uFogDen:{value:h.fogDensity??35e-5},uWater:{value:new t.Color(.05,.07,.09)},uLakeY:{value:a}},z=new t.ShaderMaterial({uniforms:R,vertexShader:$e,fragmentShader:nt(h.landGLSL||"float landH(vec2 p){ return -9.0; }"),transparent:!0,depthWrite:!1,fog:!1}),S=new t.Mesh(r,z);return S.renderOrder=-4,{object:S,uniforms:R}}const it=i=>`
${i}
${We}
varying vec3 vW;
uniform vec3 uSunDir[6];
uniform vec3 uSunCol[6];
uniform vec4 uSunP[6];
uniform float uFogDen, uLevel;
void main(){
  vec2 q = vW.xz;
  float a = smoothstep(0.05, 0.55, uLevel - landH(q));
  vec3 V = vW - cameraPosition; float dist = length(V); V /= max(dist, 1e-3);
  float tt = uNightP.z;
  vec2 n1 = texture2D(tSkyNoise, q*vec2(0.0031, 0.0052) + vec2(-tt*0.0041, tt*0.0006)).rg - 0.5;
  vec2 n2 = texture2D(tSkyNoise, q*vec2(0.011, 0.017) + vec2(-tt*0.011, -tt*0.0017)).gb - 0.5;
  vec2 n3 = texture2D(tSkyNoise, q*vec2(0.037, 0.051) + vec2(-tt*0.03, tt*0.004)).br - 0.5;
  vec3 N = normalize(vec3(n1.x*0.2 + n2.x*0.3 + n3.x*0.22, 1.0, n1.y*0.2 + n2.y*0.3 + n3.y*0.22));
  vec3 R = reflect(V, N); R.y = abs(R.y) + 0.002; R = normalize(R);
  vec3 col = vec3(0.0);
  for (int i = 0; i < 6; i++) {
    float r = uSunP[i].x*1.5 + 0.014;
    float spark = smoothstep(cos(r*2.4), cos(r*0.7), dot(R, uSunDir[i]));
    col += uSunCol[i]*(spark*min(uSunP[i].y*7.0, 1.0));
  }
  // loose glints either side of each road: single facets that catch a sun for a moment as the water runs
  float g1 = texture2D(tSkyNoise, q*vec2(0.0075, 0.013) + vec2(-tt*0.016, tt*0.003)).r, g2 = texture2D(tSkyNoise, q*vec2(0.0043, 0.0085) + vec2(-tt*0.0105, -tt*0.004)).g;
  float glint = smoothstep(0.5, 0.8, g1*g2*2.0);
  vec2 vh = V.xz/max(length(V.xz), 1e-4);
  for (int i = 0; i < 6; i++) {
    vec2 sh = uSunDir[i].xz/max(length(uSunDir[i].xz), 1e-4);
    float toward = max(dot(vh, sh), 0.0);
    col += uSunCol[i]*(glint*(0.25 + 0.75*toward*toward)*0.55*min(uSunP[i].y*7.0, 1.0));
  }
  col += nightGlow(R)*1.3;
  float fres = 0.3 + 0.7*pow(1.0 - clamp(-V.y, 0.0, 1.0), 3.0);
  gl_FragColor = vec4(col*(fres*a*exp(-uFogDen*uFogDen*dist*dist)), 1.0);
}`;function ft(i,h={}){const u=h.bounds||[-900,-80,900,8],a=h.level??-1.1,r=new t.PlaneGeometry(u[2]-u[0],u[3]-u[1],1,1);r.rotateX(-Math.PI/2),r.translate((u[0]+u[2])/2,a+.06,(u[1]+u[3])/2);const n=i.uniforms,R={tSkyNoise:n.tSkyNoise,uHeart:n.uHeart,uDeath:n.uDeath,uClot:n.uClot,uClotA:n.uClotA,uLane:n.uLane,uLaneOff:n.uLaneOff,uNightP:n.uNightP,uSunDir:n.uSunDir,uSunCol:n.uSunCol,uSunP:n.uSunP,uFogDen:{value:h.fogDensity??35e-5},uLevel:{value:a}},z=new t.ShaderMaterial({uniforms:R,vertexShader:$e,fragmentShader:it(h.landGLSL||"float landH(vec2 p){ return -9.0; }"),transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,fog:!1}),S=new t.Mesh(r,z);return S.renderOrder=2,{object:S,uniforms:R}}export{je as SKY_DAY_GLSL,We as SKY_NIGHT_GLSL,ne as SUN_COLORS,be as dirOf,lt as makeClock,ct as makeCluster,ft as makeGlitter,dt as makeLakeMirror,ut as makeSkyDome,ht as makeStars,tt as nightUniforms};
