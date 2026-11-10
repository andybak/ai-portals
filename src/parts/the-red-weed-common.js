import*as y from"three";const Z=Math.PI/180,j=(e,t=1)=>new y.Color(e).multiplyScalar(t),B=(e,t,s)=>Math.min(s,Math.max(t,e)),J=(e,t,s)=>e+(t-e)*s,Y=(e,t,s)=>{const o=B((s-e)/(t-e),0,1);return o*o*(3-2*o)},Q=e=>e-Math.floor(e),K=e=>(e*(e+.0245786)-90537e-9)/(e*(.983729*e+.432951)+.238081),q=e=>e<=.0031308?e*12.92:1.055*Math.pow(e,1/2.4)-.055;function O(e,t,s){const o=t.exposure/.6,l=Math.max(e[0],0)*o,d=Math.max(e[1],0)*o,r=Math.max(e[2],0)*o,f=K(.59719*l+.35458*d+.04823*r),n=K(.076*l+.90834*d+.01566*r),i=K(.0284*l+.13383*d+.83777*r);let c=[B(1.60475*f-.53108*n-.07367*i,0,1),B(-.10208*f+1.10813*n-.00605*i,0,1),B(-.00327*f-.07276*n+1.07602*i,0,1)];const a=.2126*c[0]+.7152*c[1]+.0722*c[2],u=.5*(1-Y(0,.6,a));return c.map((h,m)=>q(B((a+(h-a)*t.saturation-.5)*t.contrast+.5+s[m]*u,0,1)))}const U={exposure:1.15,saturation:1.06,contrast:1.05,shadowTint:"#070B18"};function _(e,t=U,s=1){const o=new y.Color(e),l=new y.Color(t.shadowTint??"#000000"),d=[l.r,l.g,l.b],r=[q(o.r),q(o.g),q(o.b)],f=a=>{const u=O(a,t,d);return(u[0]-r[0])**2+(u[1]-r[1])**2+(u[2]-r[2])**2};let n=[o.r*.6+.04,o.g*.6+.04,o.b*.6+.04],i=f(n),c=.06;for(let a=0;a<260&&c>2e-5;a++){let u=-1,h=i;for(let m=0;m<6;m++){const p=n.slice();p[m>>1]=Math.max(0,p[m>>1]+(m&1?-c:c));const v=f(p);v<h&&(h=v,u=m)}u<0?c*=.5:(n[u>>1]=Math.max(0,n[u>>1]+(u&1?-c:c)),i=h)}return new y.Color(n[0]*s,n[1]*s,n[2]*s)}function $(e={}){const t=(e.glowAz??-12)*Z,s=new y.Vector3(Math.sin(t),0,-Math.cos(t)),o=(e.keyEl??8)*Z,l=new y.Vector3(s.x*Math.cos(o),Math.sin(o),s.z*Math.cos(o)),d={...U,...e.post||{}},r=(n,i=1)=>_(n,d,i);return{U:{uTime:{value:0},uSkyZen:{value:r(e.zenith??"#16223F")},uSkyMid:{value:r(e.mid??"#2C3F63")},uSkyLow:{value:r(e.low??"#3A4A6C")},uSkyRose:{value:r(e.rose??"#D97C83",e.roseGain??1)},uSkyAmber:{value:r(e.amber??"#E9A15B",e.amberGain??1.12)},uSkyGnd:{value:r(e.ground??"#262E46")},uGlow:{value:new y.Vector4(s.x,e.bandH??1,s.z,e.glow??1)},uCloud:{value:new y.Vector4(e.cloud??0,e.cloudBase??.13,e.cloudSoft??.1,0)},uCloudCol:{value:r(e.cloudCol??"#2A3246")},uKeyDir:{value:l},uKeyCol:{value:j(e.keyCol??"#F0B27A",e.keyI??.5)},uHemiSky:{value:r(e.hemiSky??"#66708E",e.hemiI??1)},uHemiGnd:{value:r(e.hemiGnd??"#3A3742",e.hemiI??1)},uFogCol:{value:r(e.fog??"#2A3552")},uFogDen:{value:e.fogDen??9e-4},uMist:{value:new y.Vector4(e.mistTop??3.2,e.mistDen??.0017,0,0)},uMistCol:{value:r(e.mistCol??"#767482",e.mistGain??1)},uWeedA:{value:r(e.weed??"#96152A")},uWeedD:{value:r(e.weedShade??"#470C1B")},uWeedG:{value:r(e.weedGlow??"#CC2740")},uWeedS:{value:r(e.weedSick??"#B6ABA4")},uWeedSD:{value:r(e.weedSickShade??"#5C5762")},uWeedSG:{value:r(e.weedSickGlow??"#DCD1C3")},uPx:{value:.0018},uFire:{value:new y.Vector4(400,60,-1500,0)},uFireCol:{value:j(e.fireCol??"#FF7A2E",1)}},glowDir:s,keyDir:l,glowAz:t,post:d,shown:r}}const P=`
uniform float uTime, uFogDen, uPx;
uniform vec3 uSkyZen, uSkyMid, uSkyLow, uSkyRose, uSkyAmber, uSkyGnd, uKeyDir, uKeyCol, uHemiSky, uHemiGnd, uFogCol, uMistCol, uWeedA, uWeedD, uWeedG, uWeedS, uWeedSD, uWeedSG, uCloudCol;
uniform vec4 uGlow, uMist, uCloud, uFire; uniform vec3 uFireCol;
float rwH(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.x); }
float rwH3(vec3 p){ p = fract(p*0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y)*p.z); }
float rwN(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(rwH(i), rwH(i + vec2(1.,0.)), f.x), mix(rwH(i + vec2(0.,1.)), rwH(i + vec2(1.,1.)), f.x), f.y);
}
float rwN3(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  float a = mix(mix(rwH3(i), rwH3(i + vec3(1.,0.,0.)), f.x), mix(rwH3(i + vec3(0.,1.,0.)), rwH3(i + vec3(1.,1.,0.)), f.x), f.y);
  float b = mix(mix(rwH3(i + vec3(0.,0.,1.)), rwH3(i + vec3(1.,0.,1.)), f.x), mix(rwH3(i + vec3(0.,1.,1.)), rwH3(i + vec3(1.,1.,1.)), f.x), f.y);
  return mix(a, b, f.z);
}
float rwF(vec2 p){ return 0.55*rwN(p) + 0.28*rwN(p*2.03 + 17.3) + 0.17*rwN(p*4.1 + 31.7); }
// lobed pads: xy = the vector to the nearest pad's middle, z = distance from the pad's edge, w = the pad's own number
vec4 rwPad(vec2 p){
  vec2 i = floor(p), f = fract(p); float d1 = 8.0, d2 = 8.0, id = 0.0; vec2 v1 = vec2(0.0);
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y)), o = vec2(rwH(i + g), rwH(i + g + 71.3)), r = g + 0.14 + 0.72*o - f; float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; v1 = r; id = o.x; } else if (d < d2) d2 = d;
  }
  return vec4(v1, sqrt(max(d2, 0.0)) - sqrt(max(d1, 0.0)), id);
}
// the evening sky in direction d (unit): slate blue deepening to the zenith; toward the afterglow a rose band and,
// on the horizon, an amber one; below the horizon the far country's haze
vec3 rwSky(vec3 d){
  float y = d.y, h = clamp(y, 0.0, 1.0);
  vec2 hd = d.xz/max(length(d.xz), 1e-4);
  float az = clamp(0.5 + 0.5*dot(hd, uGlow.xz), 0.0, 1.0);
  vec3 c = mix(uSkyMid, uSkyZen, smoothstep(0.10, 0.80, h));
  c = mix(uSkyLow, c, smoothstep(0.0, 0.26, h));
  float el = abs(y)/max(uGlow.y, 0.2);
  float e1 = el/0.16, e2 = el/0.095;
  float rose = exp(-min(e1*sqrt(max(e1, 0.0)), 40.0))*az*az*(0.35 + 0.65*az);
  float amb = exp(-min(e2*sqrt(max(e2, 0.0)), 40.0))*az*az*az;
  c = mix(c, uSkyRose, clamp(rose*0.9*uGlow.w, 0.0, 1.0));
  c = mix(c, uSkyAmber, clamp(amb*uGlow.w, 0.0, 1.0));
  c = mix(c, uCloudCol*(1.0 + 0.5*rose), uCloud.x*smoothstep(uCloud.y, uCloud.y + uCloud.z, h));
  c = mix(c, uSkyGnd + 0.25*c, 1.0 - smoothstep(-0.10, 0.0, y));
  return c;
}
vec3 rwAmb(vec3 n){ return mix(uHemiGnd, uHemiSky, 0.5 + 0.5*n.y); }
// distance fog (the scene's FogExp2) and the mist that lies on the water: cam = eye, p = the point seen
vec3 rwAir(vec3 col, vec3 p, vec3 cam){
  vec3 dv = p - cam; float dist = length(dv), dy = dv.y;
  float y0 = clamp(cam.y, -1.0, uMist.x), y1 = clamp(p.y, -1.0, uMist.x);
  float fr = abs(dy) > 0.02 ? abs(y1 - y0)/max(abs(dy), 0.02) : step(cam.y, uMist.x);
  float od = uMist.y*dist*min(fr, 1.0);
  vec2 hd = dv.xz/max(length(dv.xz), 1e-4);
  float az = clamp(0.5 + 0.5*dot(hd, uGlow.xz), 0.0, 1.0);
  vec3 mc = uMistCol*mix(vec3(0.78, 0.86, 1.0), vec3(1.42, 1.0, 0.84), az*az);
  col = mix(col, mc, 1.0 - exp(-clamp(od, 0.0, 40.0)));
  float f = 1.0 - exp(-min(uFogDen*uFogDen*dist*dist, 40.0));
  return mix(col, uFogCol, f);
}
// THE WEED. n: normal, v: unit vector from the point to the eye, thin: 0 a thick fleshy core .. 1 a frond's edge,
// sick: 0 carmine .. 1 bleached, ao: 1 open .. 0 buried. It is painted between three colours as they will be seen:
// shade (wine, never black), lit (a deep matt carmine) and, where the afterglow stands behind a thin frond, the
// light that comes through it; nothing can come out brighter or purer than that third colour, so nothing is neon.
vec3 rwWeed(vec3 n, vec3 v, float thin, float sick, float ao){
  float ndl = dot(n, uKeyDir);
  float keyL = clamp((ndl + 0.25)/1.25, 0.0, 1.0), skyL = 0.5 + 0.5*n.y;
  float lit = clamp((0.95*keyL*keyL + 0.42*skyL)*ao, 0.0, 1.0);
  vec3 col = mix(mix(uWeedD, uWeedSD, sick), mix(uWeedA, uWeedS, sick), lit);
  col *= mix(vec3(1.0), vec3(1.1, 1.0, 0.9), keyL*keyL*0.6);                     // the side toward the glow is a little warmer
  float toward = clamp(dot(-v, uKeyDir), 0.0, 1.0);                             // 1: the eye looks into the afterglow through the frond
  float thr = thin*(0.08 + 0.92*toward*toward)*clamp(0.85 - ndl, 0.0, 1.0)*(0.35 + 0.65*ao);
  return mix(col, mix(uWeedG, uWeedSG, sick), clamp(thr, 0.0, 1.0));
}
`,tt=(e,t={})=>({...e,...t});class et{constructor(){this.p=[],this.n=[],this.c=[],this.e=[],this.i=[],this.count=0,this.col=[1,1,1],this.ex=[0,0,0,0],this.m=null}color(t,s,o){return t.isColor?this.col=[t.r,t.g,t.b]:this.col=[t,s,o],this}extra(t=0,s=0,o=0,l=0){return this.ex=[t,s,o,l],this}xf(t){return this.m=t,this}v(t,s,o,l,d,r,f){if(this.m){const i=this.m.elements,c=i[0]*t+i[4]*s+i[8]*o+i[12],a=i[1]*t+i[5]*s+i[9]*o+i[13],u=i[2]*t+i[6]*s+i[10]*o+i[14],h=i[0]*l+i[4]*d+i[8]*r,m=i[1]*l+i[5]*d+i[9]*r,p=i[2]*l+i[6]*d+i[10]*r,v=Math.hypot(h,m,p)||1;t=c,s=a,o=u,l=h/v,d=m/v,r=p/v}this.p.push(t,s,o),this.n.push(l,d,r),this.c.push(this.col[0],this.col[1],this.col[2]);const n=f||this.ex;return this.e.push(n[0],n[1],n[2],n[3]),this.count++}tri(t,s,o){this.i.push(t,s,o)}quadI(t,s,o,l){this.i.push(t,s,o,t,o,l)}quad(t,s,o,l){const d=s[0]-t[0],r=s[1]-t[1],f=s[2]-t[2],n=l[0]-t[0],i=l[1]-t[1],c=l[2]-t[2];let a=r*c-f*i,u=f*n-d*c,h=d*i-r*n;const m=Math.hypot(a,u,h)||1;a/=m,u/=m,h/=m;const p=this.v(t[0],t[1],t[2],a,u,h),v=this.v(s[0],s[1],s[2],a,u,h),C=this.v(o[0],o[1],o[2],a,u,h),b=this.v(l[0],l[1],l[2],a,u,h);this.quadI(p,v,C,b)}box(t,s,o,l,d,r,f=""){const n=t-l,i=t+l,c=s-d,a=s+d,u=o-r,h=o+r;f.includes("+z")||this.quad([n,c,h],[i,c,h],[i,a,h],[n,a,h]),f.includes("-z")||this.quad([i,c,u],[n,c,u],[n,a,u],[i,a,u]),f.includes("+x")||this.quad([i,c,h],[i,c,u],[i,a,u],[i,a,h]),f.includes("-x")||this.quad([n,c,u],[n,c,h],[n,a,h],[n,a,u]),f.includes("+y")||this.quad([n,a,h],[i,a,h],[i,a,u],[n,a,u]),f.includes("-y")||this.quad([n,c,u],[i,c,u],[i,c,h],[n,c,h])}tube(t,s,o,l,d=8,r=0,f=null){const n=s[0]-t[0],i=s[1]-t[1],c=s[2]-t[2],a=Math.hypot(n,i,c)||1,u=n/a,h=i/a,m=c/a;let p=0,v=1,C=0;Math.abs(h)>.9&&(p=1,v=0);let b=h*C-m*v,G=m*p-u*C,H=u*v-h*p;const E=Math.hypot(b,G,H)||1;b/=E,G/=E,H/=E;const I=h*H-m*G,L=m*b-u*H,T=u*G-h*b,N=(o-l)/a,X=this.count;for(let w=0;w<=d;w++){const x=w/d*Math.PI*2,M=Math.cos(x),S=Math.sin(x);let D=M*b+S*I+u*N,g=M*G+S*L+h*N,k=M*H+S*T+m*N;const W=Math.hypot(D,g,k)||1;D/=W,g/=W,k/=W;const z=M*b+S*I,A=M*G+S*L,F=M*H+S*T;this.v(t[0]+z*o,t[1]+A*o,t[2]+F*o,D,g,k,f?f(w,0,z*o,A*o,F*o):null),this.v(s[0]+z*l,s[1]+A*l,s[2]+F*l,D,g,k,f?f(w,1,z*l,A*l,F*l):null)}for(let w=0;w<d;w++){const x=X+w*2;this.i.push(x,x+3,x+1,x,x+2,x+3)}if(r)for(const w of[0,1]){const x=w?s:t,M=w?l:o,S=w?1:-1,D=this.v(x[0],x[1],x[2],u*S,h*S,m*S,f?f(0,w,0,0,0):null),g=this.count;for(let k=0;k<=d;k++){const W=k/d*Math.PI*2,z=Math.cos(W),A=Math.sin(W),F=z*b+A*I,R=z*G+A*L,V=z*H+A*T;this.v(x[0]+F*M,x[1]+R*M,x[2]+V*M,u*S,h*S,m*S,f?f(k,w,F*M,R*M,V*M):null)}for(let k=0;k<d;k++)w?this.i.push(D,g+k,g+k+1):this.i.push(D,g+k+1,g+k)}}ball(t,s,o,l,d=10,r=7){const f=Array.isArray(l)?l:[l,l,l],n=this.count;for(let i=0;i<=r;i++){const c=i/r*Math.PI,a=Math.sin(c),u=Math.cos(c);for(let h=0;h<=d;h++){const m=h/d*Math.PI*2,p=a*Math.cos(m),v=u,C=a*Math.sin(m);this.v(t+p*f[0],s+v*f[1],o+C*f[2],p,v,C)}}for(let i=0;i<r;i++)for(let c=0;c<d;c++){const a=n+i*(d+1)+c,u=a+d+1;this.i.push(a,a+1,u+1,a,u+1,u)}}lathe(t,s,o,l=20,d=null){const r=this.count,f=o.length;for(let n=0;n<f;n++){const i=o[Math.max(0,n-1)],c=o[Math.min(f-1,n+1)];let a=c[0]-i[0],u=c[1]-i[1];const h=Math.hypot(a,u)||1;a/=h,u/=h;for(let m=0;m<=l;m++){const p=m/l*Math.PI*2,v=Math.cos(p),C=Math.sin(p);this.v(t+v*o[n][0],o[n][1],s+C*o[n][0],v*u,-a,C*u,d?d(m/l,n,o[n]):null)}}for(let n=0;n<f-1;n++)for(let i=0;i<l;i++){const c=r+n*(l+1)+i,a=c+l+1;this.i.push(c,a,a+1,c,a+1,c+1)}}geometry(t="aE",s=!0){const o=new y.BufferGeometry;return o.setAttribute("position",new y.Float32BufferAttribute(this.p,3)),o.setAttribute("normal",new y.Float32BufferAttribute(this.n,3)),s&&o.setAttribute("color",new y.Float32BufferAttribute(this.c,3)),t&&o.setAttribute(t,new y.Float32BufferAttribute(this.e,4)),o.setIndex(this.count>65535?new y.Uint32BufferAttribute(this.i,1):new y.Uint16BufferAttribute(this.i,1)),o.computeBoundingSphere(),o}get triangles(){return this.i.length/3}}export{et as Acc,j as C,Z as DEG,U as POST,P as RW_GLSL,B as clamp,Q as fract,J as lerp,$ as makeShared,_ as shown,Y as sstep,tt as withShared};
