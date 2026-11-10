import*as o from"three";import{makePath as Ho,clamp as we,lerp as Q,smoothstep as ee}from"../kit/core.js";import{buildHero as jo,makePillarField as Yo,swardMaterial as Uo,dirFog as Zo}from"../parts/pillars-before-trees.js";const be=Math.PI*2,He=Math.PI/180,Re=-.4,Fe=(e,t=1)=>{const a=new o.Color(e);return new o.Vector3(a.r*t,a.g*t,a.b*t)},Ut=(e,t,a)=>{const r=Fe(e),c=r.x*.3+r.y*.55+r.z*.15;return r.set(c+(r.x-c)*a,c+(r.y-c)*a,c+(r.z-c)*a).multiplyScalar(t)},$e=()=>o.UniformsUtils.clone(o.UniformsLib.fog),Zt=5.3,Dt=5.5,St=[[-10,.62],[38,.62],[58,.85],[80,1.75],[100,1.6],[140,1.3],[182,1.45],[206,2],[240,4],[266,6.6],[287,7],[320,3],[342,1.7],[372,1.55],[400,Zt],[470,Zt]];function Xo(e){for(let t=0;t<St.length-1;t++){const a=St[t],r=St[t+1];if(e<=r[0])return Q(a[1],r[1],ee(a[0],r[0],e))}return St[St.length-1][1]}function $o(e){let t=1.3636363636363635*ee(60,66,e)*(1-ee(82,88,e));const a=ee(180,236,e);return t-=(.55+1.5*a*a)*ee(180,190,e)*(1-ee(236,244,e))*.961,t-=180/Math.PI/47*ee(236,244,e)*(1-ee(282,292,e))*.964,t}function Eo(e){const t=we((e-292)/100,0,1),a=Math.sin(Math.PI*t),r=we((e-98)/84,0,1),c=Math.sin(Math.PI*r);return 22*Math.sin(be*t)*a*a-19*Math.sin(be*r)*c*c}function Jo(){const e=[];let a=0,r=0,c=0,p=0;for(let n=0;n<=460+1e-6;n+=.25,p++){(p%32===0||n>460-.25*.5)&&e.push([a,Xo(n),r]);const f=(c+Eo(n))*He;a+=Math.sin(f)*.25,r-=Math.cos(f)*.25,c+=$o(n)*.25}const s=e[e.length-1];return s[0]=Math.round(s[0]*10)/10,e[e.length-2][2]=s[2],e[e.length-3][2]=s[2],Ho(e,{samples:460})}const xe={cx:-50,cz:-180,size:640,n:320,cap:28},Xt=-243.7,tt=e=>Xt+9*Math.sin(be*(e+146)/50),Tt=460,At=.2*Tt,Ve=8,ot=18;function Qo(e){const t=e.posAtDist(At,new o.Vector3),a=e.posAtDist(At+Ve,new o.Vector3),r=Math.hypot(a.x-t.x,a.z-t.z)||1,c=[(a.x-t.x)/r,(a.z-t.z)/r];return{s0:At,s1:At+Ve,sMid:At+Ve/2,a:t,b:a,dir:c,right:[-c[1],c[0]],mid:[(t.x+a.x)/2,(t.z+a.z)/2]}}function ut(e,t,a){const r=e.nearestXZ(t,a).u*e.length,c=new o.Vector3;let p=1/0,s=r;for(let n=Math.max(0,r-1.1);n<=Math.min(e.length,r+1.1);n+=.05){e.posAtDist(n,c);const f=(c.x-t)*(c.x-t)+(c.z-a)*(c.z-a);f<p&&(p=f,s=n)}return{s,dist:Math.sqrt(p)}}function ea(e,t,a,r){const c=e.nearestXZ(t,r).u*e.length,p=new o.Vector3;let s=1/0;for(let n=Math.max(0,c-2);n<=Math.min(e.length,c+2);n+=.05){e.posAtDist(n,p);const f=(p.x-t)*(p.x-t)+(p.y-a)*(p.y-a)+(p.z-r)*(p.z-r);f<s&&(s=f)}return Math.sqrt(s)}function ta(e,t){const a=(b,F=10)=>{const P=new o.CatmullRomCurve3(b.map(_=>new o.Vector3(_[0],_[2],_[1])),!1,"centripetal"),j=[],ie=b.length*F,I=new o.Vector3;for(let _=0;_<=ie;_++)P.getPoint(_/ie,I),j.push([I.x,I.z,I.y]);return j},r=a([[-4,150,5],[-2,70,5],[-1.2,30,4.6],[-1.6,-4,4.6],[-1.4,-26,4.4],[1.2,-48,3.3],[.5,-61,3.6],[-9,-76,3.4],[-30,-86,3.2],[-70,-92,3.8],[-130,-80,4.2],[-200,-96,4],[-290,-84,4.5],[-380,-100,5]],14),[c,p]=t.mid,[s,n]=t.right,f=Ve,h=a([[230,-40,4],[140,-44,3.6],[80,-56,3.2],[38,-68,2.8],[c+s*f,p+n*f,2.7],[c,p,2.7],[c-s*f,p-n*f,2.8],[-17,-101,3],[-45,-130,3.4],[-78,-160,3.2],[-120,-178,3],[-190,-170,3.4],[-280,-190,3.6],[-380,-180,4]],12),C=[];for(let b=-372;b<=6;b+=3)C.push([b,tt(b),3.6+1.1*Math.sin(b*.11)+.6*Math.sin(b*.043+2)]);const m=a([[6,tt(6),3.6],[24,-251,3.8],[46,-263,3.6],[80,-272,3.4],[124,-268,3.8],[180,-250,4],[260,-262,4.4]],12),l=a([[24,-251,2.2],[2,-268,2.6],[-40,-276,3],[-90,-269,2.6],[-140,-278,3.2],[-200,-271,2.8],[-262,-256,2.6],[-300,Xt-2,3]],12),u=a([[-45,-130,2],[-52,-165,2.2],[-40,-196,2.4],[-30,-222,2.2],[-21,tt(-21),2.6]],12),S=a([[-120,-178,2],[-150,-205,2.4],[-190,-222,2.6],[-232,Xt+6,2.6]],12),x=a([[38,-68,2],[49,-104,2.2],[41,-134,2.5],[53,-156,2.4],[66,-176,2.5],[84,-196,2.6],[82,-238,2.4],[80,-272,2.6]],12),A=a([[78.6,-190,1.6],[73,-201,2],[60,-208,2.2],[48,-213,2.2],[37,-221,2],[27,-236,2],[24,-251,2.2]],12),d=e.nearestXZ(18.5,-100).dist,z=a([[c+s*d,p+n*d,1.3],[18.5,-100,1.9],[24.5,-112,2.3],[27.5,-123,2],[33.5,-133,2.3],[42,-137,2.2]],12),O=a([[66,-176,1.5],[62.6,-181.5,2.3],[58.6,-189.5,2.9],[54.6,-198.5,2.7],[50.5,-207,2.5],[48,-213,2.2]],12);return{A:r,B:h,C,C2:m,D:l,Eb:u,Fb:S,G:x,H:A,K:z,M:O}}async function oa(e,t){const{n:a,size:r,cap:c}=xe,p=r/a,s=xe.cx-r/2,n=xe.cz-r/2,f=new Float32Array(a*a).fill(c);let h=0;for(const u of Object.keys(t)){const S=t[u];for(let x=0;x<S.length-1;x++){const A=S[x],d=S[x+1],z=d[0]-A[0],O=d[1]-A[1],b=Math.max(z*z+O*O,1e-6),F=c+Math.max(A[2],d[2]),P=Math.max(0,Math.floor((Math.min(A[0],d[0])-F-s)/p)),j=Math.min(a-1,Math.ceil((Math.max(A[0],d[0])+F-s)/p)),ie=Math.max(0,Math.floor((Math.min(A[1],d[1])-F-n)/p)),I=Math.min(a-1,Math.ceil((Math.max(A[1],d[1])+F-n)/p));for(let _=ie;_<=I;_++){const Z=n+(_+.5)*p-A[1],X=_*a;for(let N=P;N<=j;N++){const se=s+(N+.5)*p-A[0],E=Math.min(1,Math.max(0,(se*z+Z*O)/b)),he=se-z*E,R=Z-O*E,g=Math.sqrt(he*he+R*R)-(A[2]+(d[2]-A[2])*E);g<f[X+N]&&(f[X+N]=g)}}++h%12===0&&await e.yield()}}const C=(u,S)=>{const x=(u-s)/p-.5,A=(S-n)/p-.5;if(x<0||A<0||x>a-1.001||A>a-1.001)return c;const d=Math.floor(x),z=Math.floor(A),O=x-d,b=A-z,F=z*a+d;return Q(Q(f[F],f[F+1],O),Q(f[F+a],f[F+a+1],O),b)},m=new Uint16Array(a*a);for(let u=0;u<a*a;u++)m[u]=o.DataUtils.toHalfFloat(f[u]),u%2e4===19999&&await e.yield();const l=new o.DataTexture(m,a,a,o.RedFormat,o.HalfFloatType);return l.magFilter=l.minFilter=o.LinearFilter,l.wrapS=l.wrapT=o.ClampToEdgeWrapping,l.needsUpdate=!0,{W:f,at:C,tex:l,x0:s,z0:n}}function aa(e,t){return(a,r)=>{const c=e.at(a,r),p=t.fbm2(a*.07,r*.07,2);return c>0?Re+.3*ee(0,1,c)+.04*p*ee(1,6,c)+.07*ee(6,22,c)+.012*t.n2(a*1.7,r*1.7):Re-(.36+.14*p)*ee(0,2.4,-c)+.015*t.n2(a*1.7,r*1.7)*ee(0,1,-c)}}const Ke=`
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float vn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm2(vec2 p){ return .5 * vn2(p) + .3 * vn2(p * 2.1 + 7.3) + .2 * vn2(p * 4.3 + 13.1); }
`,at=`
uniform vec3 uSunDir, uFogSun, uFogAway, uZen, uHor, uSunTint, uLow;
uniform float uClear, uTime, uCum;
float clearAt(float h){ return clamp(uClear * 1.55 - (1. - smoothstep(0., .3, h)) * .55, 0., 1.); }
// n4 (J): the glow round the sun, as the sky draws it: in the fog (toward the sun's side) and in the clear sky.  skyCol adds
// these two and nothing else as its glow; the water mirrors the same two (sunLobe), so its road of light is the sky's own.
vec3 glowFog(float side, float g2, float g8, float g64){ return uSunTint * (.05 + .95 * side) * (.06 + .15 * g2 + .32 * g8 + .7 * g64); }
vec3 glowSky(float g2, float g8, float g64){ return uSunTint * (.05 * g2 + .22 * g8 + .9 * g64); }
// the lobe of that glow alone (its two tight terms: the broad ones are already in the mirrored sky) in direction d
vec3 sunLobe(vec3 d){
  float h = max(d.y, 0.);
  vec2 sh = uSunDir.xz / max(length(uSunDir.xz), 1e-4), dh = d.xz / max(length(d.xz), 1e-4);
  float side = .5 + .5 * dot(dh, sh), g = max(dot(d, uSunDir), 0.), g2 = g * g, g8 = g2 * g2; g8 *= g8; float g64 = g8 * g8; g64 *= g64; g64 *= g64;
  return mix(glowFog(side, 0., g8, g64) - glowFog(side, 0., 0., 0.), glowSky(0., g8, g64), clearAt(h));
}
vec3 skyCol(vec3 d, float disc){
  float h = max(d.y, 0.);
  vec2 sh = uSunDir.xz / max(length(uSunDir.xz), 1e-4), dh = d.xz / max(length(d.xz), 1e-4);
  float side = .5 + .5 * dot(dh, sh), cs = dot(d, uSunDir);
  float g = max(cs, 0.), g2 = g * g, g8 = g2 * g2; g8 *= g8; float g64 = g8 * g8; g64 *= g64; g64 *= g64;
  vec2 bq = d.xz * 2.3 / (.4 + h) + vec2(uTime * .085, uTime * .05);
  bq += .55 * vec2(vn2(bq * .7 + 3.), vn2(bq * .7 + 9.));                   // the billows roll: a slow warp
  float bil = smoothstep(.22, .78, vn2(bq) * .62 + vn2(bq * 2.3 + 5.) * .38);                    // slow billows drifting through the fog
  float bil2 = smoothstep(.25, .75, vn2(bq * .37 + 11. + vec2(uTime * .012, 0.)));
  vec3 fog = mix(uFogAway, uFogSun, side * mix(side, 1., .35)) * mix(.88, 1.08, sqrt(h)) * (1. + .62 * (bil - .5) + .5 * (bil2 - .5));
  fog += glowFog(side, g2, g8, g64) * mix(.55, 1., bil);
  vec3 sky = mix(uHor, uZen, smoothstep(0., .5, h));
  sky = mix(sky, uHor * 1.04, .5 * side * side * (1. - h));
  sky = mix(sky, uSunTint * vec3(.98, .9, .74) * .9, .5 * side * side * side * (1. - smoothstep(0., .34, h)));      // gold low haze toward the sun, blue away from it
  sky *= mix(vec3(.9, .93, 1.02), vec3(1.), max(side, smoothstep(0., .5, h) * .5));
  sky += glowSky(g2, g8, g64);
  // high combed cloud: long streaks lying level, in a few patches
  float az = atan((d.x - d.z) * .7071 + 1e-5, -(d.x + d.z) * .7071);
  vec2 cp = vec2(az * 2.2 + uTime * .003, h * 11.);
  float comb = (.6 * vn2(vec2(cp.x * 1.3, cp.y * 5.)) + .4 * vn2(vec2(cp.x * 3.1 + 5., cp.y * 11.))) * smoothstep(.5, .8, vn2(vec2(cp.x * .5 + 2., cp.y * .6)));
  comb = smoothstep(.34, .7, comb) * smoothstep(.12, .32, h) * (1. - smoothstep(.55, .85, h)) * (1. - smoothstep(2.5, 3.1, abs(az)));
  sky = mix(sky, mix(vec3(.95, .93, .9), uSunTint, .45) * (1.05 + .5 * g8), comb * .5);
  vec2 uq = d.xz / (.16 + h) * 1.25 + vec2(uTime * .012, uTime * .004);
  uq = vec2(uq.x * .8 - uq.y * .6, (uq.x * .6 + uq.y * .8) * .5);                 // n3: drawn out along the wind into shoals (a lone round puff high in the sky read as a smudge)
  float cu = smoothstep(.5, .72, fbm2(uq + .5 * vec2(vn2(uq * .6), vn2(uq * .6 + 7.)))) * uCum * smoothstep(.03, .2, h) * (1. - .85 * smoothstep(.3, .5, h) * (1. - uCum));
  sky = mix(sky, mix(vec3(.6, .65, .75), vec3(1.06, 1.03, .97), smoothstep(.3, .85, fbm2(uq * 1.9 + 3.) + .35 * g2)), cu * .88);     // heaped cloud with lit heads and grey bases
  float c = clearAt(h);
  vec3 col = mix(fog, sky, c);
  float sd = smoothstep(.99905, .99955, cs);                 // the disc: soft and pale gold in fog, hard after
  col += disc * uSunTint * sd * mix(1.1, 5., c);
  return mix(col, uLow, (1. - smoothstep(-.07, 0., d.y)));
}
`,go=`
uniform sampler2D uMap; uniform vec4 uMapRect;             // x0, z0, 1/size, cap
float waterDist(vec2 p){
  vec2 uv = (p - uMapRect.xy) * uMapRect.z;
  vec2 e = abs(uv - .5);
  float w = texture2D(uMap, clamp(uv, .002, .998)).r;
  return mix(w, uMapRect.w, smoothstep(.47, .5, max(e.x, e.y)));
}
`;function na(e){const t=new o.ShaderMaterial({uniforms:e.U,depthWrite:!1,depthTest:!1,side:o.BackSide,vertexShader:`
varying vec3 vDir;
void main(){
  vDir = position;
  vec4 p = projectionMatrix * vec4(mat3(viewMatrix) * position, 1.);
  if (abs(p.w) < 1e-4) p.w = 1e-4;
  gl_Position = p.xyww;
}`,fragmentShader:`
varying vec3 vDir;
${Ke}
${at}
void main(){
  vec3 d = normalize(vDir + vec3(0., 1e-5, 0.));
  vec3 col = skyCol(d, 1.);
  col += (h21(gl_FragCoord.xy) - .5) * .006;
  gl_FragColor = vec4(max(col, 0.), 1.);
}`}),a=new o.Mesh(new o.IcosahedronGeometry(1,4),t);return a.frustumCulled=!1,a.renderOrder=-10,a.name="sky",a}async function wo(e,t,a,r,c){const n=[],f=[],h=[],C=c.R,m=-50,l=-180,u=a.range(0,100),S=350,x=S/156,A=[[0,1],[35,1],[58,.82],[80,.76],[106,.72],[128,.52],[150,.28],[166,.1],[175,0]],d=F=>{for(let P=0;P<A.length-1;P++)if(F<=A[P+1][0])return Q(A[P][1],A[P+1][1],ee(A[P][0],A[P+1][0],F));return 0};for(let F=0;F<=480;F++){const P=F/480,j=(P-.5)*x+.5,ie=(P-.5)*S*He,I=-Math.cos(ie),_=Math.sin(ie),Z=d(Math.abs(P-.5)*S),X=.72+.5*ee(-.35,.45,r.n2(j*2.4+u,9.3)),N=(c.base+c.amp*X*(.66*r.ridged2(j*c.freq+u,1.7,2)+.3*(.5+.5*r.fbm2(j*c.freq*2.1+u,3.1,2))+.03*r.n2(j*41,u)))*Z;for(let se=0;se<=7;se++){const E=se/7;n.push(m+I*C,-30+N*E,l+_*C),f.push(j*60,E,N)}F%80===79&&await e.yield()}await e.yield();for(let F=0;F<480;F++)for(let P=0;P<7;P++){const j=F*8+P,ie=j+7+1;h.push(j,ie,j+1,ie,ie+1,j+1)}const z=new o.BufferGeometry;z.setAttribute("position",new o.Float32BufferAttribute(n,3)),z.setAttribute("aM",new o.Float32BufferAttribute(f,3)),z.setIndex(h);const O=new o.ShaderMaterial({uniforms:{...t.U,uHaze:{value:new o.Vector2(c.haze0,c.haze1)}},transparent:!0,depthWrite:!1,side:o.DoubleSide,vertexShader:`
attribute vec3 aM; varying vec3 vM; varying vec3 vWp;
void main(){ vM = aM; vWp = position; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.); }`,fragmentShader:`
uniform vec3 uRock, uSunCol; uniform float uMtn, uSun; uniform vec2 uHaze;
varying vec3 vM; varying vec3 vWp;
${Ke}
${at}
void main(){
  float y = vM.y * vM.z;                                     // metres above the plain
  vec2 p = vec2(vM.x, y * .012);
  // ribs and gullies: ridged noise falling with height gives lit and shaded faces
  float r1 = abs(vn2(p * vec2(1.1, .9)) - .5) * 2., r2 = abs(vn2(p * vec2(3.3, 1.7) + 9.) - .5) * 2., r3 = vn2(p * vec2(9., 5.) + 3.);
  vec2 rp = vec2(p.x * 2.6 + p.y * .45, p.y * .28);
  float ra = vn2(rp), rb = vn2(rp * vec2(2.7, 1.6) + 4.);
  float face = clamp(.5 + (vn2(rp + vec2(.1, 0.)) - ra) * 7. + (vn2(rp * vec2(2.7, 1.6) + vec2(4.1, 4.)) - rb) * 4., 0., 1.);
  // great buttresses and valleys, a tenth of the view wide, leaning a little as they rise: sun on one flank, violet shade on the other
  float bx = p.x * .3 + p.y * .05 + .35 * vn2(vec2(p.x * .11, p.y * .3 + 5.));
  float b0 = vn2(vec2(bx, 2.7)), b1 = vn2(vec2(bx + .25, 2.7));
  float butt = smoothstep(.2, .8, .5 + (b1 - b0) * 4.6);
  float vall = 1. - smoothstep(.0, .3, b0);                                                   // the valley floors lie deepest in shade
  face = clamp(mix(butt, face, .2) - vall * .25, 0., 1.);
  vec3 rock = uRock * mix(.62, 1.18, r3 * .4 + r1 * .6) * mix(vec3(.88, .9, 1.06), vec3(1.1, 1.02, .9), face);
  float crest = smoothstep(.5, 1., vM.y) * smoothstep(.35, .95, butt) * (.75 + .25 * r3);        // only the crests' sunward shoulders reach into the low sun: broad soft shapes
  vec3 lit = rock * (crest * .55 * mix(uSunCol, vec3(1., .86, .74), .5) * mix(.35, 1.2, uSun) + vec3(.15, .16, .3) * mix(.82, 1.3, face));
  lit *= mix(.72, 1., smoothstep(0., 300., y));
  vec3 d = normalize(vWp - cameraPosition + vec3(0., 1e-5, 0.));
  vec3 haze = mix(skyCol(vec3(d.x, .03, d.z), 0.), uRock * vec3(2.1, 2.4, 3.3), .62 * uClear);
  float hz = mix(uHaze.x, uHaze.y, smoothstep(0., 520., y));    // nearer the foot the air is thicker
  hz = mix(hz, 1., (1. - uClear) * 1.5 * (1. - smoothstep(60., 430., y)));   // in the morning mist the feet are lost and the crests stand above it
  hz = clamp(hz, 0., 1.);
  vec3 col = mix(lit, haze, hz);
  gl_FragColor = vec4(col, uMtn);
}`}),b=new o.Mesh(z,O);return b.frustumCulled=!1,b.renderOrder=c.order,b.name="mountains",b}const Ct=`
float fogAmount(float depth){
  #ifdef USE_FOG
    return 1. - exp(-fogDensity * fogDensity * depth * depth);
  #else
    return 0.;
  #endif
}`;async function sa(e,t){const{path:a,height:r,map:c}=t,p=new o.Group;p.name="ground";const s=new o.ShaderMaterial({uniforms:{...$e(),...t.U},fog:!0,side:o.DoubleSide,vertexShader:`
varying vec3 vWp;
#include <fog_pars_vertex>
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.); vWp = wp.xyz;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
uniform vec3 uSunCol, uSky, uFill, uWarm, uGreen, uRust, uDark;
uniform float uSun, uCloud, uWetAll, uRipe, uWindSpeed; uniform vec3 uAxis; uniform sampler2D uCover;
varying vec3 vWp;
#include <common>
#include <fog_pars_fragment>
${Ke}
${at}
${go}
${Ct}
vec3 pebble(vec2 p, float k){                       // one rounded stone per cell: colour key, dome shade, mask
  vec2 c = floor(p); float h = h21(c + k * 17.3), h2 = h21(c + k * 5.1 + 40.);
  vec2 f = fract(p) - .5 - (vec2(h, h2) - .5) * .34;
  float d = length(f * vec2(1., .78 + .44 * h2));
  return vec3(h, 1. - d * 1.7, 1. - smoothstep(.3, .41, d));
}
float hgt(vec2 p){                                 // the small relief of the plain: swales, ripple marks, lumps (lit by the low sun)
  return vn2(p * .4) * 1.6 + vn2(p * 1.3 + 7.) * .3 + .11 * sin(p.x * 3.7 + p.y * 2.1 + 5. * vn2(p * .23 + 3.)) * smoothstep(.35, .65, vn2(p * .07 + 31.));      // n2: water-laid ripple marks in patches: the raking sun picks them out from the rise
}
vec2 crackle(vec2 p){                              // x: distance to the nearest cell wall (mud cracks), y: a tone per plate
  vec2 i = floor(p), f = fract(p); float d1 = 9., d2 = 9., id = 0.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y)), o = vec2(h21(i + g), h21(i + g + 31.7)); vec2 r = g + o - f; float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; id = o.x; } else if (d < d2) d2 = d;
  }
  return vec2(sqrt(d2) - sqrt(d1), id);
}
void main(){
  vec2 p = vWp.xz; float w = waterDist(p);
  vec3 ray = vWp - cameraPosition; float dist = length(ray); ray /= max(dist, 1e-4);
  float nearK = 1. / (1. + dist * .08), midK = 1. / (1. + dist * .006), farK = 1. / (1. + dist * .02);
  vec2 pw = p + .2 * vec2(vn2(p * 1.7), vn2(p * 1.7 + 5.)) + .05 * vec2(vn2(p * 9.), vn2(p * 9. + 8.));
  vec3 a = pebble(pw * 9.5, 1.), b = pebble(mat2(.8, .6, -.6, .8) * pw * 17. + 3.7, 2.), c = pebble(mat2(.6, -.8, .8, .6) * pw * 5.6 + 9.1, 3.);
  c.z *= step(.7, h21(floor(mat2(.6, -.8, .8, .6) * pw * 5.6 + 9.1) + 3.3));          // cobbles are sparse
  vec3 pb = c.z > .5 ? c : (a.z > .5 ? a : b); float on = max(c.z, max(a.z, b.z));
  vec3 ochre = vec3(.46, .38, .25), slate = vec3(.29, .29, .33);
  vec3 stone = pb.x < .5 ? ochre : (pb.x < .9 ? slate : vec3(.37, .22, .13));
  stone *= mix(.72, 1.12, fract(pb.x * 7.));
  float big = fbm2(p * .045 + 2.);
  // three grounds in long shapes that follow the water: bars of rounded gravel, flats of pale cracked mud, mats of dark crust
  float flatM = smoothstep(.44, .56, fbm2(p * vec2(.05, .034) + 9.) + .12 * (vn2(p * .37) - .5) - .06 * smoothstep(8., 20., w)) * smoothstep(-.3, .6, w);
  vec3 grit = mix(vec3(.25, .225, .2), vec3(.39, .345, .285), big);
  vec3 gravel = mix(grit, mix(grit * .8, mix(grit, stone, .7) * (.7 + .4 * pb.y), on), .25 + .75 * nearK) * mix(vec3(1.), vec3(1.05, .93, .82), smoothstep(.5, .8, vn2(p * .12 + 21.)));
  vec2 ck = crackle(pw * mix(3.2, 4.6, vn2(p * .2 + 3.)));
  float nearC = 1. - smoothstep(3.5, 9., dist);                                              // plates a hand or two across, drawn only where a plate is several pixels wide
  float crackLine = (1. - smoothstep(.0, .07, ck.x)) * nearC; ck.y = mix(.5, ck.y, nearC);
  // polish 4: the flats crack into plates a stride across as well, which hold at a distance (so the plain is never a smear)
  vec2 ckB = crackle(pw * mix(.75, 1.05, vn2(p * .05 + 17.)) + 31.);
  float farC = smoothstep(2.5, 7., dist) * (1. - smoothstep(60., 130., dist));
  float lineB = (1. - smoothstep(.0, mix(.035, .1, smoothstep(8., 70., dist)), ckB.x)) * farC;
  vec3 fineSt = b.x < .5 ? ochre * 1.12 : (b.x < .88 ? slate * 1.25 : vec3(.4, .23, .14));
  vec3 mud = mix(vec3(.4, .365, .305), fineSt * (.7 + .45 * b.y), b.z * (.3 + .6 * nearK)) * mix(1., mix(.86, 1.1, ckB.y), farC * .7) * mix(.93, 1.07, vn2(p * 2.7 + 5.)) * mix(vec3(1.05, 1., .9), vec3(.9, .95, 1.08), vn2(p * .07 + 13.));      // k1: the flats are finer rounded gravel (the brief has no mud), paler, in drifts of ochre and slate
  vec3 alb = mix(gravel, mud, flatM);
  alb *= mix(.88, 1.1, vn2(p * .21 + 11.)) * mix(.9, 1.08, big);
  // the dark microbial crust: a leathery skin in mats with lobed edges, slate-violet where dry, olive where damp, curling at the cracks
  float crust = smoothstep(.47, .6, fbm2(p * .13 + 3.) + .2 * (vn2(p * 1.1) - .5) + .05 * (vn2(p * 5.) - .5) + .1 * flatM) * smoothstep(2.5, 7., w);
  crust *= 1. - .55 * lineB * flatM;                      // the plates are the crust's own cracking
  vec3 crustC = mix(vec3(.085, .075, .1), vec3(.1, .11, .06), smoothstep(12., 4., w) * .7 + .3 * vn2(p * .6)) * mix(.8, 1.35, vn2(p * 4.1 + 1.)) * (1. + .5 * ck.y * flatM);
  crustC = mix(crustC, crustC * 2.1 + vec3(.03, .02, .0), crackLine * flatM * .6);                 // pale curled rims
  crust *= mix(1., smoothstep(.3, .5, ckB.y + .5 * (vn2(p * .23 + 2.) - .5)), farC * .85);                    // the mats break up along the cracks into plates
  alb = mix(alb, crustC * 1.5 + vec3(.01, .008, .014), crust * .78 * mix(1., .7, on * nearK * (1. - flatM)));
  alb *= mix(vec3(1.), mix(vec3(1.12, .98, .8), vec3(.84, .9, 1.06), smoothstep(.35, .65, vn2(p * .043 + 51.))), .55 * (1. - crust));      // drifts of ochre and of slate gravel, a few strides across
  // the dense band of the sward along every water edge
  vec2 cuv = clamp((p - uMapRect.xy) * uMapRect.z, .002, .998);
  float cov = texture2D(uCover, cuv + (vec2(vn2(p * .9), vn2(p * .9 + 4.)) - .5) * .004 + (vec2(vn2(p * 3.3 + 7.), vn2(p * 3.3 + 2.)) - .5) * .0016).r;
  float green = smoothstep(.02, .3, cov + .1 * (vn2(p * 2.1 + 9.) - .5)) * smoothstep(.1, .6, w) * mix(.85, 1., vn2(p * .7 + 3.));
  float thk = vn2(p * 6.3) * .6 + vn2(p * 14.) * .4;                              // the thicket's own grain: wiry, not a lawn
  // n2: under and between the clumps the ground is a mat of low shoots, drawn as tufts a hand across, each with its own tone
  // and a dark gap round it (never bare soil in squares, never a smooth lawn); far off they melt into one olive
  vec2 tf = crackle(pw * 17. + 11.); float tuftK = 1. - smoothstep(3., 11., dist);
  float tone = mix(.5, tf.y, tuftK);
  vec3 gcol = mix(uGreen * vec3(.6, .72, .6), uGreen * vec3(1., 1.02, .6), smoothstep(.3, .9, tone + .3 * (vn2(p * .31 + 5.) - .5))) * mix(.6, 1.08, thk);
  gcol = mix(gcol, uRust * .5, clamp((.06 + uRipe * .12) * (.4 + 1.2 * vn2(p * .23 + 19.)) + .22 * step(.86, tone) * tuftK, 0., 1.));          // a little russet litter and ripe tufts
  gcol *= mix(1., .55 + .45 * smoothstep(.0, .3, tf.x), tuftK);                     // the shade between tufts
  vec2 wd = uAxis.xz; float wl = length(wd); wd = wl > 1e-3 ? wd / wl : vec2(1., 0.);
  float run = dot(p, wd) * .35 - uTime * uWindSpeed * .45;
  gcol *= 1. + .2 * (sin(run) * .6 + sin(run * 2.3 + p.x * .7) * .4);           // wind waves running through the sward
  gcol *= mix(1., .8, nearK);                                          // in the stems' own shade
  alb = mix(alb, gcol, green * mix(.95, .9, nearK));
  float wet = max((1. - smoothstep(-.1, 1.6, w)) * smoothstep(-1.2, -.1, w), uWetAll * .5);
  alb *= mix(1., .5, wet);
  alb = mix(alb, alb * vec3(.66, .72, .5), (1. - smoothstep(-1.4, -.1, w)));                 // the bed under water is darker and greener than the dry bar
  // light: the low sun rakes the small relief
  float cloud = 1. - uCloud * smoothstep(.42, .7, fbm2(p * .0045 + vec2(uTime * .004, uTime * .011)));
  vec2 e2 = vec2(.22, 0.); float h0 = hgt(p);
  vec2 gradH = vec2(hgt(p + e2) - h0, hgt(p + e2.yx) - h0) / .22;
  vec2 sh2 = uSunDir.xz / max(length(uSunDir.xz), 1e-4);
  float rake = clamp(1. + dot(gradH, sh2) * .4 * (.25 + .75 * farK) * (1. - green * .7), .6, 1.4);
  float relief = rake * mix(1., mix(.62, 1.22, pb.y), on * nearK * (1. - flatM));
  vec3 sun = uSunCol * max(uSunDir.y, .36) * 1.15 * uSun * cloud;
  vec3 amb = (uSky * .8 + uFill * .35) + uWarm * .45;
  vec3 col = alb * (sun * relief + amb * mix(1., .8 + .3 * pb.y, on * nearK));
  col += wet * uSunCol * uSun * cloud * .05 * pb.y * on * nearK;
  // standing water in the hollows of the flats and a wet sheen beside every channel: the sky lies in them
  float pudN = fbm2(p * .13 + 40.) + .08 * (vn2(p * 1.1) - .5);
  float pud = uWetAll * smoothstep(.5, .57, pudN) * smoothstep(1.5, 4., w) * (1. - green);       // sheet water lies on the flats after rain
  // n2: and in every weather thin films stand in the hollows of the bare flats (never in the sward), each with a dark wet rim:
  // the sky lies on the plain in long shapes, so no flat is a smear from the rise
  float filmN = fbm2(p * vec2(.06, .095) + 71.) + .1 * (vn2(p * .9 + 3.) - .5) + .03 * (vn2(p * 4.3) - .5);
  float filmOk = smoothstep(4.5, 8., w) * (1. - green) * smoothstep(.2, .6, flatM + .35);
  float film = smoothstep(.535, .56, filmN) * filmOk, rimW = smoothstep(.45, .535, filmN) * filmOk;
  col *= 1. - .5 * rimW * (1. - film);
  pud = max(pud, film * .92);
  float sheen = (1. - smoothstep(.1, 2.2, w)) * smoothstep(-.3, .1, w) * .5 * (1. - green * .8);
  vec3 Rr = normalize(vec3(ray.x + gradH.x * .02, abs(ray.y) + .03, ray.z + gradH.y * .02)); float pfr = 1. - abs(ray.y); pfr = pfr * pfr * pfr;
  float sdr = max(dot(Rr, uSunDir), 0.); float sd8 = sdr * sdr; sd8 *= sd8; sd8 *= sd8; sd8 *= sd8; sd8 *= sd8;
  vec3 mir = min(skyCol(Rr, 0.) * .62, vec3(.8)) + uSunCol * uSun * sd8 * sd8 * 2.;
  col = mix(col, mir, max(pud * (.35 + .6 * pfr), sheen * (.1 + .9 * pfr)));
  // under water: the bed seen through clear water, with caustics running downstream
  float depth = max(${Re.toFixed(2)} - vWp.y, 0.);
  float sub = smoothstep(0., .05, depth);
  vec2 cq = p * 3.3 + .35 * vec2(vn2(p * 1.9 + uTime * .1), vn2(p * 1.9 + 7. - uTime * .08)) + vec2(uTime * .13, uTime * .31);
  float c1 = abs(vn2(cq) - .5), c2 = abs(vn2(mat2(.8, .6, -.6, .8) * cq * 1.7 - uTime * .21 + 4.) - .5);
  float caus = ((1. - smoothstep(.0, .16, c1)) + (1. - smoothstep(.0, .14, c2))) * .6;
  col = mix(col, col * vec3(.56, .68, .56) * mix(1., .62, smoothstep(0., .5, depth)) + alb * caus * sub * (uSunCol * uSun * .5 + uWarm * .22) * midK, sub);
  vec3 fogc = skyCol(normalize(vec3(ray.x, .02, ray.z)), 0.);
  gl_FragColor = vec4(mix(col, fogc, fogAmount(vFogDepth)), 1.);
}`}),n=[0,.45,.95,1.5,2.15,2.9,3.8,4.9,6.2,7.8,9.8,12.3,15.3,18.8,22.8,27],f=[...n.slice(1).reverse().map(R=>-R),...n],h=f.length,C=-46,m=506,l=1.5,u=Math.round((m-C)/l),S=new Float32Array((u+1)*h*3),x=[],A=new o.Vector3,d=new o.Vector3;for(let R=0;R<=u;R++){a.posAtDist(C+R*l,A),a.tangentAtDist(C+R*l,d);const g=d.z,B=-d.x,v=Math.hypot(g,B)||1;for(let w=0;w<h;w++){const M=A.x+g/v*f[w],W=A.z+B/v*f[w],q=(R*h+w)*3;S[q]=M,S[q+1]=r(M,W)-(w===0||w===h-1?.7:0),S[q+2]=W}R%24===23&&await e.yield()}for(let R=0;R<u;R++)for(let g=0;g<h-1;g++){const B=R*h+g,v=B+h;x.push(B,v,B+1,v,v+1,B+1)}t.ribbonY=(R,g)=>{const B=(R-C)/l;if(!(B>=0)||B>=u||Math.abs(g)>=22.7)return null;const v=Math.floor(B),w=B-v;let M=0;for(;M<h-2&&f[M+1]<=g;)M++;const W=(g-f[M])/(f[M+1]-f[M]),q=(v*h+M)*3+1,D=S[q],V=S[q+h*3],L=S[q+3],K=S[q+h*3+3];return w+W<=1?D+w*(V-D)+W*(L-D):K+(1-w)*(L-K)+(1-W)*(V-K)};const z=new o.BufferGeometry;z.setAttribute("position",new o.BufferAttribute(S,3)),z.setIndex(x);const O=new o.Mesh(z,s);O.frustumCulled=!1,p.add(O),await e.yield();const b=104,F=xe.size/b,P=new Float32Array((b+1)*(b+1)*3),j=[];for(let R=0;R<=b;R++){for(let g=0;g<=b;g++){const B=c.x0+g*F,v=c.z0+R*F,w=(R*(b+1)+g)*3,M=c.at(B,v);let W=Math.min(r(B,v),M<3.5?Re-.3*ee(3.5,.5,M):9);a.nearestXZ(B,v).dist<21&&(W-=1.4),(g===0||R===0||g===b||R===b)&&(W=-.12),P[w]=B,P[w+1]=W,P[w+2]=v}R%6===5&&await e.yield()}for(let R=0;R<b;R++)for(let g=0;g<b;g++){const B=R*(b+1)+g,v=B+b+1;j.push(B,v,B+1,v,v+1,B+1)}const ie=new o.BufferGeometry;ie.setAttribute("position",new o.BufferAttribute(P,3)),ie.setIndex(j);const I=new o.Mesh(ie,s);I.frustumCulled=!1,p.add(I);const _=xe.size/2,Z=2800,X=R=>[[xe.cx-R,xe.cz-R],[xe.cx+R,xe.cz-R],[xe.cx+R,xe.cz+R],[xe.cx-R,xe.cz+R]],N=[],se=[];for(const[R,g]of[...X(_),...X(Z)])N.push(R,-.12,g);for(let R=0;R<4;R++){const g=(R+1)%4;se.push(R,R+4,g,g,R+4,g+4)}const E=new o.BufferGeometry;E.setAttribute("position",new o.Float32BufferAttribute(N,3)),E.setIndex(se);const he=new o.Mesh(E,s);return he.frustumCulled=!1,he.renderOrder=-1,p.add(he),p}function ra(e){const t=new o.PlaneGeometry(xe.size,xe.size,1,1);t.rotateX(-Math.PI/2),t.translate(xe.cx,Re,xe.cz);const a=new o.ShaderMaterial({uniforms:{...$e(),...e.U},fog:!0,transparent:!0,depthWrite:!1,blending:o.CustomBlending,blendSrc:o.OneFactor,blendDst:o.OneMinusSrcAlphaFactor,vertexShader:`
varying vec3 vWp;
#include <fog_pars_vertex>
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.); vWp = wp.xyz;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
uniform vec3 uSunCol, uWarm, uSky, uFill, uBone, uRock; uniform float uSun, uGlint, uMtn, uWetAll; uniform vec4 uPil[24]; uniform vec4 uSea[3], uSeaK[3], uLog; uniform float uRain, uSq;
varying vec3 vWp;
#include <common>
#include <fog_pars_fragment>
${Ke}
${at}
${go}
${Ct}
// one glint to a cell, the grid sized to the pixel (two octaves blended so it never pops): soft round sparks that twinkle
float sparkle(vec2 p, float px, float t){
  float lv = log2(clamp(px, 1e-4, 50.) * 3.4), l0 = floor(lv), fr = lv - l0, acc = 0.;
  for (int i = 0; i < 2; i++) {
    float s = exp2(l0 + float(i)), wgt = i == 0 ? 1. - fr : fr;
    vec2 g = mat2(.8, .6, -.6, .8) * p / s + float(i) * 37.1, c = floor(g), f = fract(g) - .5;
    float h = h21(c), h2 = h21(c + 71.3);
    float d = length(f - (vec2(h, h2) - .5) * .56);
    float tw = max(sin(t * (2. + 4. * h2) + h * 40.), 0.); tw *= tw; tw *= tw;
    acc += wgt * tw * (1. - smoothstep(.07, .3, d)) * step(.4, h2);
  }
  return acc;
}
void main(){
  vec2 p = vWp.xz;
  float w = waterDist(p) + (vn2(p * 1.3) - .5) * .5 + (vn2(p * 5.) - .5) * .12;
  float a0 = (1. - smoothstep(-.14, .06, w));
  float px = max(length(dFdx(p)), length(dFdy(p)));                     // metres of water under one pixel (taken before any loop or discard)
  if (a0 < .004) discard;
  vec3 V = cameraPosition - vWp; float dist = length(V); V /= max(dist, 1e-4);
  float k = 1. / (1. + dist * .02);
  // ripples: a slow swell under two trains of fine wavelets (fine under the lens, so that near water is crisp, not a blur)
  float kn = 1. / (1. + dist * .22);
  vec2 q1 = p * 1.3 + vec2(uTime * .2, uTime * .5), q2 = p * 3.9 + vec2(-uTime * .5, uTime * .9), q3 = mat2(.8, .6, -.6, .8) * p * 8.5 + vec2(uTime * 1.1, uTime * 1.9), e = vec2(.12, 0.);
  float n1 = vn2(q1), n2 = vn2(q2), n3 = vn2(q3);
  vec2 gr0 = vec2(vn2(q1 + e) - n1, vn2(q1 + e.yx) - n1) * .9 + vec2(vn2(q2 + e) - n2, vn2(q2 + e.yx) - n2) * .7;      // the slow swell alone: the sun's road is laid on this
  vec2 gr = gr0 + mat2(.8, -.6, .6, .8) * vec2(vn2(q3 + e) - n3, vn2(q3 + e.yx) - n3) * .5 * smoothstep(.2, .5, kn);      // n3: one train of fine wavelets, turned off the lattice of the others, only where a pixel can hold it
  // n2: the current's own structure: long slicks of smooth water lying along the banks (they follow the lines of equal distance
  // from the edge and slide downstream), where the sky and the pillars stand mirrored, between ruffled lanes
  float flow = vn2(vec2(w * 1.5 + 2.2 * vn2(p * .21 + 3.), dot(p, vec2(.11, .09)) - uTime * .1));
  float slick = smoothstep(.42, .7, flow);
  gr *= mix(1.15, .3, slick);
  // n2: the animals lie IN the water: a ring of ripples spreads from each sea scorpion's flanks, a V of wake trails behind it
  // while it rows, and its own dark side stands mirrored in the water round it
  // n4 (J): the rings and the wake are drawn FINE: a ring every 14 cm (it was 21), a wake line every 18 cm (it was 29), and
  // the noise that bent their phase by most of a wave (which broke every ring into soft lit patches) now only wanders
  // them by a quarter of one; a wave too fine for the pixel that would hold it is not drawn (fineK, as the wavelets' law)
  float fineK = smoothstep(.2, .45, kn);
  vec2 wg = vec2(0.); float hull = 0., crest = 0.;
  for (int i = 0; i < 3; i++) {
    vec4 sp = uSea[i]; float sc = max(uSeaK[i].x, .1), sw = uSeaK[i].y;
    vec2 d = p - sp.xy; float al = dot(d, sp.zw), ac = d.x * sp.w - d.y * sp.z;
    float t = clamp(al, -.8 * sc, .85 * sc); vec2 rl = vec2(al - t, ac); float dd = length(rl), dh = dd - .19 * sc + (vn2(p * 3.1 + uTime * .2) - .5) * .16;
    vec2 rdir = (sp.zw * rl.x + vec2(sp.w, -sp.z) * rl.y) / max(dd, 1e-3);
    float wob = .6 + .8 * vn2(p * 2.6 + uTime * vec2(.3, -.2));
    float ring = exp(-max(dh, 0.) * 2.4) * smoothstep(.0, .1, dh) * (.45 + .55 * sw) * wob;
    float ph = (dd - .19 * sc) * 44. - uTime * 6.5 + 1.5 * vn2(p * 1.7);
    wg += rdir * cos(ph) * ring * .34 * fineK; crest += smoothstep(.8, 1., sin(ph)) * ring * .22 * fineK;
    float back = max(-al - .2 * sc, 0.), arm = abs(ac) - back * .34 - .16 * sc;
    float vee = exp(-arm * arm / (.012 + .05 * back)) * (1. - exp(-back * 3.)) * exp(-back * .62) * sw * wob;
    float ph2 = arm * 35. + back * 3. - uTime * 4. + 1.5 * vn2(p * 1.3 + 5.);
    wg += vec2(sp.w, -sp.z) * (ac < 0. ? -1. : 1.) * cos(ph2) * vee * .5 * fineK; crest += smoothstep(.6, 1., sin(ph2)) * vee * .6 * fineK;
    hull = max(hull, 1. - smoothstep(-.1 * sc, .34 * sc, dh));
  }
  // k1b: the fallen pillar lies in the stream: the current piles against it, curls round it in standing ripples and slides
  // under it dark
  { vec2 la = uLog.xy, lab = uLog.zw - la; float lt = clamp(dot(p - la, lab) / max(dot(lab, lab), 1e-4), 0., 1.);
    vec2 ld = p - (la + lab * lt); float dl = length(ld), dh = dl - .46;
    float lip = exp(-max(dh, 0.) * 2.0) * smoothstep(-.05, .08, dh);
    float lph = dh * 22. - uTime * 3.4 + 3. * vn2(p * 1.9 + uTime * .15);
    wg += ld / max(dl, 1e-3) * cos(lph) * lip * .45; crest += smoothstep(.5, 1., sin(lph)) * lip * .55;
    hull = max(hull, (1. - smoothstep(-.1, .55, dh)) * .95); }
  // k1: while the fog lasts a fine drizzle falls: rings spread where the drops strike (two sizes of cell, each ring born, widening, gone)
  float rain = clamp(uRain, 0., 1.) * smoothstep(.12, .6, kn + .25);
  if (rain > .01) {
    for (int i = 0; i < 2; i++) {
      float sc = i == 0 ? .95 : 1.7; vec2 cp = mat2(.8, .6, -.6, .8) * p * sc + float(i) * 17.3, ci = floor(cp), cf = fract(cp) - .5;      // n3: rings a hand to two feet across (they were too fine to see from the lens's height)
      float hh = h21(ci + 3.7), life = fract(uTime * (.55 + .3 * hh) + hh * 9.);
      vec2 o = (vec2(h21(ci + floor(uTime * (.55 + .3 * hh) + hh * 9.) * 7.1), h21(ci + floor(uTime * (.55 + .3 * hh) + hh * 9.) * 3.3 + 5.)) - .5) * .5;
      vec2 dv = cf - o; float dl = length(dv), rr = .04 + .34 * life;
      float band = exp(-(dl - rr) * (dl - rr) * 420.) * (1. - life) * (1. - life) * step(.3, hh);
      wg += dv / max(dl, 1e-3) * band * sin((dl - rr) * 40.) * .8 * rain; crest += band * .9 * rain;
    }
  }
  gr += wg;
  vec3 N = normalize(vec3(-gr.x * (.2 + .6 * k), 1., -gr.y * (.2 + .6 * k)));
  float ndv = max(dot(N, V), 0.), f = 1. - ndv, f2 = f * f, F = .03 + .97 * f2 * f2 * f;
  float shallow = smoothstep(-1.1, -.05, w);                                   // the water thins to nothing at its edge
  F = max(F, .2 + .26 * smoothstep(5., 26., dist));                                 // far braids keep a sheen of sky
  F *= 1. - .5 * shallow;
  vec3 R = reflect(-V, N); R.y = abs(R.y) + .02; R = normalize(R);
  vec3 refl = skyCol(normalize(vec3(R.x, R.y * 1.6 + .16 * uClear, R.z)), 0.) * mix(1., .8, uClear);      // the upper sky, not the bright horizon
  vec2 Rh = R.xz; float rl = max(length(Rh), 1e-4); vec2 Rn = Rh / rl;
  // what stands in the water: the mountain wall, the nearest pillars (a vertical post each), the bank and its thicket
  float mt = smoothstep(.1, .55, -Rn.x) * (1. - smoothstep(.22, .46, R.y / rl)) * uMtn;
  refl = mix(refl, mix(uRock * .62, uHor, .2 + .45 * (1. - uClear)), mt * .9);
  float pm = 0.;
  for (int i = 0; i < 24; i++) {
    vec4 q = uPil[i]; vec2 dF = q.xy - p; float th = dot(dF, Rh) / (rl * rl);
    float dl = length(dF - Rh * th), y = R.y * th, r = q.w * (1. - .42 * clamp(y / max(q.z, .1), 0., 1.));
    pm = max(pm, step(0., th) * (1. - smoothstep(r * .6, r * 1.15 + .012 * max(th, 0.), dl + (n2 - .5) * .25 * r)) * (1. - smoothstep(q.z * .92, q.z * 1.03, y)));
  }
  vec3 amb = uSky + uFill * .8 + uWarm;
  vec2 sh2 = uSunDir.xz / max(length(uSunDir.xz), 1e-4);
  refl = mix(refl, uBone * (amb * .42 + uSunCol * uSun * .5 * smoothstep(.3, -.5, dot(Rn, sh2))), pm * .92);       // toward the sun we see their shaded faces
  float bank = smoothstep(-2.7, -.15, w + (n1 - .5) * .8) * smoothstep(.72, .96, f);
  refl = mix(refl, vec3(.075, .09, .045) * (amb + uSunCol * uSun * .3), bank * .85);      // the sward of both banks stands mirrored along the water's edges
  refl *= clamp(1. + dot(gr, sh2) * 2.2 * (.12 + .88 * k), .8, 1.25);
  refl += (uSky * .9 + uSunCol * uSun * .35) * min(crest, 1.5) * .5;                // sky on the crests of its ripples
  // n3: the glitter.  It was the sharp sun lobe on the finest value-noise wavelets (a lattice: each cell flashed whole, as a
  // square flake).  Now the sun's road is a soft streak laid on the slow swell alone, and on it lie points of light: one spark
  // to a cell of a grid sized to the pixel (sparkle()), so the glints are fine at every distance and never square.
  vec3 Ns = normalize(vec3(-gr0.x * (.2 + .6 * k), 1., -gr0.y * (.2 + .6 * k))); vec3 Rs = reflect(-V, Ns); Rs.y = abs(Rs.y) + .02; Rs /= max(length(Rs), 1e-4);
  float sd = max(dot(Rs, uSunDir), 0.);
  float spk = sparkle(p, px, uTime), spark = clamp(spk * 1.6, 0., 1.);
  vec3 glint = uSunCol * uSun * uGlint * (exp((sd - 1.) * 40.) * (.5 + 3.4 * spk) + exp((sd - 1.) * 9.) * (.05 + 1.2 * spk));

  vec2 vh = -V.xz / max(length(V.xz), 1e-4);
  float lane = smoothstep(.5, .97, dot(vh, sh2));
  glint += uSunCol * uSun * uGlint * spk * (.6 * smoothstep(.6, .95, dot(vh, sh2)) * (.25 + .75 * k) * (1. - .7 * slick) + lane * lane * 1.4 * smoothstep(5., 16., dist));      // twinkles on the sun's side
  // n4 (J): THE SUN'S ROAD IS THE SKY'S OWN GLOW, MIRRORED.  The round's own terms were switched by (1 - uClear): a soft
  // glittering path and a gold road that the clearing air put out.  Now the water mirrors the lobe of the glow the sky
  // function itself draws round the sun (sunLobe: fog's and clear sky's, mixed as the sky mixes them), once on the slow
  // swell (a soft path, twinkling) and once on every ripple (the road, broken into lit facets); no factor of its own.
  // Where an animal, the trunk or the rain stirs the water (stir) the facets are too steep and too small to hold a slab
  // of gold: there the road is carried by the points of the glitter alone, so rings and wake stay crisp lines and sparks.
  float stir = clamp(length(wg) * 4., 0., 1.);
  glint += sunLobe(Rs) * .36 * mix(.3, 1.7, spark) * (1. - .5 * slick);
  { float kk = 1.1 + 1.5 * k; vec3 Ng = normalize(vec3(-gr.x * kk, 1., -gr.y * kk)); vec3 Rg = reflect(-V, Ng); Rg.y = abs(Rg.y) + .02; Rg /= max(length(Rg), 1e-4);
    float azs = max(dot(vh, sh2), 0.);
    float chop = smoothstep(.3, .78, n2 * .5 + n3 * .3 + n1 * .25);
    glint += sunLobe(Rg) * vec3(1.08, .88, .56) * smoothstep(.7, .985, azs) * mix(.2, 2.0, chop) * (1. - .4 * slick) * .44 * mix(1., .12 + 2.6 * spark, stir); }
  glint *= 1. - .6 * shallow;
  float deep = (1. - smoothstep(-2.6, 0., w));
  vec3 body = mix(vec3(.04, .055, .04), vec3(.085, .09, .05), shallow) * (amb + uSunCol * uSun * .4) * 1.5;      // the water's own colour: dark, clear, a little tea-green, paler over the shelving edge
  float ab = (.5 + .42 * deep) * (1. - .75 * shallow) * mix(.45, 1., smoothstep(1.2, 5., dist)) * mix(.5, 1., smoothstep(.3, .85, f));     // under the lens, and wherever we look down into it, it is clear to the bed and what swims over it
  float alpha = ab + (1. - ab) * F;
  vec3 col = (refl * F + glint + body * ab * (1. - F)) * (1. - .38 * hull * hull);      // n2: the water is darker close round an animal lying in it (its flank mirrored, its shade on the bed): no edge
  col += refl * smoothstep(.0, .1, w + .14) * (1. - smoothstep(.1, .2, w + .14)) * .08;       // a bright wet lip at the edge
  float fg = fogAmount(vFogDepth);
  vec3 fogc = skyCol(normalize(vec3(-V.x, .02, -V.z)), 0.);
  col = mix(col, fogc * alpha, fg);
  gl_FragColor = vec4(col * a0, alpha * a0);
}`}),r=new o.Mesh(t,a);return r.frustumCulled=!1,r.renderOrder=.5,r.name="water",r}function Rt(e){const t=[],a=[],r=[],c=[];return{seg:(n,f,h,C,m,l,u=1)=>{const S=[f[0]-n[0],f[1]-n[1],f[2]-n[2]],x=Math.hypot(S[0],S[1],S[2])||1,A=t.length/3;for(const[d,z]of[[n,h],[f,C]])for(const O of[-1,1])t.push(d[0],d[1],d[2]),a.push(S[0]/x,S[1]/x,S[2]/x,O),r.push(z,m,we(d[1]/e,0,1.3)*u,l);c.push(A,A+1,A+2,A+1,A+3,A+2)},build:()=>{const n=new o.BufferGeometry;return n.setAttribute("position",new o.Float32BufferAttribute(t,3)),n.setAttribute("aTan",new o.Float32BufferAttribute(a,4)),n.setAttribute("aK",new o.Float32BufferAttribute(r,4)),n.setIndex(c),n.userData.triangles=c.length/3,n}}}const ft=(e,t)=>[Math.cos(e)*Math.sin(t),Math.cos(t),Math.sin(e)*Math.sin(t)],nt=(e,t,a)=>[e[0]+t[0]*a,e[1]+t[1]*a,e[2]+t[2]*a];function ia(e,t=1){const r=Rt(.62);for(let c=0;c<3;c++){const p=e(),s=e()*be,n=ft(s,e.range(.08,.35)),f=[Math.cos(s)*.05,-.03,Math.sin(s)*.05],h=nt(f,n,.62*e.range(.4,.52));r.seg(f,h,.008,.0065,0,p);const C=e()*be;for(const m of[-1,1]){const l=ft(C+(m>0?0:Math.PI),e.range(.35,.6)),u=nt(h,[l[0]+n[0]*.5,l[1],l[2]+n[2]*.5],.62*e.range(.22,.3));r.seg(h,u,.0062,.005,0,p);const S=e()*be;for(const x of[-1,1]){const A=ft(S+(x>0?0:Math.PI),e.range(.5,.95)),d=nt(u,A,.62*e.range(.13,.2));if(r.seg(u,d,.005,.004,0,p),e()<t){const z=e.range(.055,.085)*1.5,O=A[0]*.022,b=A[2]*.022;r.seg([d[0]+O,d[1]-.008,d[2]+b],[d[0]+O+A[0]*z*.2,d[1]-.008-z,d[2]+b+A[2]*z*.2],.019,.005,1,p)}}}}return r.build()}function la(e){const a=Rt(.5483870967741936);for(let r=0;r<4;r++){const c=e(),p=e()*be,s=ft(p,e.range(.15,.5)),n=[Math.cos(p)*.06,-.02,Math.sin(p)*.06],f=nt(n,s,.34*e.range(.45,.6));a.seg(n,f,.011,.009,0,c,.62);for(const h of[-1,1]){const C=ft(p+h*e.range(.6,1.4),e.range(.25,.6));let m=f,l=C;const u=nt(m,l,.34*e.range(.3,.42));a.seg(m,u,.009,.007,0,c,.62),m=u;for(let S=0;S<2;S++){const x=.9+S*1.3,A=[m[0]+(l[0]*Math.cos(x)+0)*.028,m[1]+Math.cos(x)*.03-.004*S,m[2]+l[2]*Math.cos(x)*.028+0];a.seg(m,A,.007,.006,.18,c,.62),m=A}}}return a.build()}function xo(e){const a=Rt(.5);for(let r=0;r<3;r++){const c=e(),p=e()*be,s=.04+.09*r,n=[Math.cos(p)*s,-.02,Math.sin(p)*s],f=ft(p,e.range(.03,.2)),h=.3*e.range(.7,1.1),C=nt(n,f,h);a.seg(n,C,.0075,.005,0,c,.8);for(let m=0;m<9;m++){const l=.14+.095*m,u=nt(n,f,h*l),S=m*2.4+c*9,x=.03*(1-.4*l);a.seg(u,[u[0]+Math.cos(S)*x,u[1]+x*.7,u[2]+Math.sin(S)*x],.0045,.0015,0,c,.9)}r===0&&a.seg(n,[n[0]+Math.cos(p+2)*.22,0,n[2]+Math.sin(p+2)*.22],.012,.01,0,c,.3)}return a.build()}function ca(e){const a=Rt(1),r=e(),c=[e.range(-.04,.04),1,e.range(-.04,.04)];a.seg([0,-.03,0],c,.014,.007,0,r);for(let p=0;p<5;p++){const s=.28+.15*p,n=1*s,f=e()*be,h=.26*(1-.5*s/1);for(let C=0;C<4;C++){const m=f+C*be/4,l=[c[0]*s,n,c[2]*s],u=[l[0]+Math.cos(m)*h,n+h*.55,l[2]+Math.sin(m)*h];a.seg(l,u,.006,.004,0,r),a.seg([u[0],u[1]-.022,u[2]],[u[0],u[1]+.03,u[2]],.026,.02,.8,r)}}return a.build()}function yo(e){const t=[],a=[],r=[],c=[];for(const{g:s,x:n,z:f,s:h,ry:C}of e){const m=s.attributes.position,l=s.attributes.aTan,u=s.attributes.aK,S=s.index,x=t.length/3,A=Math.cos(C),d=Math.sin(C);for(let z=0;z<m.count;z++){const O=m.getX(z)*h,b=m.getZ(z)*h,F=l.getX(z),P=l.getZ(z);t.push(O*A+b*d+n,m.getY(z)*h,-O*d+b*A+f),a.push(F*A+P*d,l.getY(z),-F*d+P*A,l.getW(z)),r.push(u.getX(z)*h,u.getY(z),u.getZ(z)*Math.min(h,1.15),u.getW(z))}for(let z=0;z<S.count;z++)c.push(S.getX(z)+x);s.dispose()}const p=new o.BufferGeometry;return p.setAttribute("position",new o.Float32BufferAttribute(t,3)),p.setAttribute("aTan",new o.Float32BufferAttribute(a,4)),p.setAttribute("aK",new o.Float32BufferAttribute(r,4)),p.setIndex(c),p.userData.triangles=c.length/3,p}async function ua(e,t,a){const{path:r,map:c,height:p,noise:s,detail:n,V:f}=t,h=new o.Group;h.name="sward";const C=Uo(t.shared),m=f.ripe?1:.62,l=new o.Object3D;let u=0;const S=(_,Z)=>Q(3,11,ee(-.35,.35,s.fbm2(_*.017+7,Z*.017,2))),x=(_,Z,X)=>{for(const N of t.feet)if(Math.hypot(_-N.x,Z-N.z)<N.r+X)return!0;return!1},A=[];for(let _=0;_<3;_++){const Z=[],X=_===2?3:4;for(let N=0;N<X;N++){const se=_===2?N===0?2:1:N<3?0:1+(_&1),E=se===0?ia(a,m):se===1?la(a):xo(a);Z.push({g:E,x:a.range(-.55,.55),z:a.range(-.55,.55),s:a.range(.8,1.25),ry:a()*be})}A.push(yo(Z))}await e.yield();const d=ca(a),z=new Map,O=(_,Z,X,N,se,E=0,he=null,R=a)=>{const g=_.uuid+Z;let B=z.get(g);B||(B={geo:_,m:[]},z.set(g,B)),l.position.set(X,(he??p(X,N))-.01,N),l.rotation.set(E,R()*be,0),l.scale.setScalar(se),l.updateMatrix();for(let v=0;v<16;v++)B.m.push(l.matrix.elements[v])},b=new o.Vector3,F=new o.Vector3,P=Math.round(250*n*we(t.density,.85,1));let j=0;for(let _=0;j<P&&_<P*14;_++){const Z=_%3===0?a.range(104,200):a.range(-30,478),X=a.range(-1,1),N=Math.sign(X)*(.9+Math.abs(X)*Math.abs(X)*9.5),se=a(),E=a.range(.8,1.3),he=a.int(0,2);r.posAtDist(Z,b),r.tangentAtDist(Z,F);const R=b.x+F.z*N,g=b.z-F.x*N,B=c.at(R,g);_%200===199&&await e.yield(),!(B<.3||B>S(R,g)+(Z>104&&Z<200?3:0)||se>.35+.65*ee(-.3,.2,s.fbm2(R*.11,g*.11+5,2))||x(R,g,.5))&&(Math.hypot(R-t.elder.x,g-t.elder.z)<9.4||b.y-p(R,g)<1.25&&Math.abs(N)<1.6||(O(A[he],"n"+Math.floor((Z+30)/46),R,g,E*(1-.3*ee(-.3,1.2,-B+1.2)),0,t.ribbonY(Z,N)),j++))}await e.yield();const ie=Math.round(26*n);j=0;for(let _=0;j<ie&&_<ie*60;_++){const Z=a.range(0,470),X=a.sign()*a.range(2.5,15),N=a.range(.75,1.05);r.posAtDist(Z,b),r.tangentAtDist(Z,F);const se=b.x+F.z*X,E=b.z-F.x*X,he=c.at(se,E);he<.25||he>1.6||x(se,E,1.2)||r.distanceTo(se,p(se,E)+.9,E)<2.2||(O(d,"p"+Math.floor(Z/240),se,E,N,0,t.ribbonY(Z,X)),j++)}if(await e.yield(),t.logBack&&t.logBack.has){const _=t.own("pbt-logplants"),Z=t.logBack,X=[],N=new o.Vector3;for(let he=0;he<3;he++)X.push({g:xo(_),x:_.range(-.1,.1),z:_.range(-.1,.1),s:_.range(.55,.8),ry:_()*be});const se=yo(X);se.computeBoundingBox();const E=Math.max(se.boundingBox.max.y,.05);for(let he=0;he<10;he++){const R=.25+7.2*Math.pow(he/14,1.5)+_.range(0,.25),g=Z.lat(R)+_.range(-.3,.3),B=_.range(.7,1);if(Z.world(R,g,N),N.y<-8)continue;r.posAtDist(t.BR.s0+R,b);const v=Math.min(B,(b.y-.62-N.y)/E);(Z.plants??(Z.plants=[])).push({a:R,x:N.x,z:N.z,top:N.y-.01+v*E,lens:b.y}),O(se,"log",N.x,N.z,v,0,N.y-.01,_)}}const I=await Ma(e,t,a,S);h.add(I.mesh),u+=I.triangles;for(const _ of z.values()){const Z=_.m.length/16,X=new o.InstancedMesh(_.geo,C,Z);X.instanceMatrix.array.set(_.m),X.instanceMatrix.needsUpdate=!0,X.computeBoundingSphere(),h.add(X),u+=Z*_.geo.userData.triangles}return{object:h,triangles:u}}const $t=[[15,-8.6,6.2],[21.5,-6.7,8.5,1.25],[30,-9.6,7.6],[35.5,-6.5,2.9,1.15,"hollow"],[41,-7.3,8.7,1.3],[48.5,-5.6,6.9],[55,-8.2,7.9,1.1],[61,-11.5,5.6],[15.5,7.6,4.8],[19.5,9.8,7.3],[31,7.1,8.3,1.2],[37.5,9.6,6.1],[44,6.7,7.1],[51.5,8.6,8.6,1.25],[57.5,6.4,5.3],[69,-6.6,7.5],[77,-8.4,5.7],[79,-3.7,8.6,1.3],[84.5,4.4,8.2,1.2],[86,-5.2,8.3,1.2],[88.5,6.2,7.9],[93,10,6.5],[96,-9.5,6.9],[104,4.3,8.5,1.25],[108.5,-7.2,6.9],[116,-4.1,7.7],[120.5,8.2,5.5],[133,-4.5,8.7,1.3],[139.5,6.3,7.1],[146,3.9,8.1,1.15],[150.5,-8.2,6.1],[158,-4.3,7.3],[163.5,5.1,8.6,1.25],[170,-6.6,5.9],[176.5,4.5,6.7],[181.5,-4.7,8.1],[192,5.6,7.5],[196,-8.4,7.1],[207,7.4,6.3],[211,-5.8,7.9,1.15],[222,5.3,8.3,1.2],[227,-10.5,6.9],[238,8,7.2],[262,7,7.7],[274,-8.5,8.2,1.2],[283,8.5,6.8],[299,-9,7.1],[304,7.2,8.3,1.2],[311.5,-10.2,6.2],[318,5.6,7.5],[326,-5.1,8.5,1.25],[333,6.6,6.7],[338.5,-7.2,7.9],[345,4.3,8.7,1.3],[352,-4.5,7.3],[358,9.2,6.5],[364,-6.2,8.3,1.2],[368.5,4.7,7.7],[375,-4.1,8.5,1.25],[381,7.2,6.9],[388,-8.2,7.5],[394.5,3.7,8.7,1.3],[402,-6.7,7.9],[412,7.7,8.3,1.2],[414.5,-9.8,6.3],[424,-7.4,8.5,1.2],[428.5,8.7,7.1],[437,-10.5,5.9],[439,11.5,6.5],[452,-7.7,8.7,1.3],[452,7.7,8.4,1.25]],bo=Dt,fa=8,ha=12,da=Dt,pa=.5,zo=1.8,ko=4;async function ma(e,t,a){const{path:r,map:c,V:p}=t,s=t.elder.x,n=t.elder.z,f=[],h=[{x:s,z:n,r:1.2}];for(const v of t.young??[])h.push({x:s+v.x,z:n+v.z,r:.45});const C=[{x:s,z:n,h:8.8,r:.65}],m=p.rare,l=new o.Vector3,u=new o.Vector3,S=v=>.3+.1*v,x={anchors:0,company:0,ranks:0,late:0,groveMembers:0,young:0,elderGrove:0,far:0,bridge:0},A=t.elderH*pa,d=t.elderR,z=[];for(let v=t.sBar;v<=t.sEld;v+=.5)r.posAtDist(v,l),z.push(l.x,l.z);const O=(v,w,M)=>{let W=0,q=-1;for(let D=0;D<z.length;D+=2){const V=z[D],L=z[D+1],K=s-V,i=n-L,$=Math.hypot(K,i)||1,oe=v-V,pe=w-L,ue=(oe*K+pe*i)/$;if(ue>0&&ue<$&&Math.abs(oe*i-pe*K)/$<M+d*ue/$){if(q<0&&(q=r.nearestXZ(v,w).dist<=da?A:0),W+=.5,W>q)return!0}else W=0}return!1},b=[];let F=null;const P=(v,w,M,W=2.4,q=3.3,D=a)=>{if(c.at(v,w)<.45||Math.hypot(v-s,w-n)<2.6)return!1;if(O(v,w,(M.thick??S(M.height)*1.1)*.5))return F={x:v,z:w},!1;const V=r.nearestXZ(v,w).dist;if(V<q)return!1;for(const oe of h)if(Math.hypot(v-oe.x,w-oe.z)<Math.max(W,oe.r))return!1;const L=M.height,K=M.thick??S(L)*D.range(.92,1.1),i=V<16,$=M.veil??(M.top==="hollow"&&L<4?0:(m?D.range(6.5,9.5):D.range(7,11)*4.6)*we(L/6,.35,1.1));return f.push({x:v-s,z:w-n,y:-.07,delay:D(),gain:(V<9?1.5:i?1.2:.8)*(L<4.2?.4:1),...M,lod:M.lod>=2?M.lod:V<bo?1:V<fa?.5:V<ha?0:-1,thick:K,veil:i?$:$*.45,pd:V}),h.push({x:v,z:w,r:.3+.55*K}),C.push({x:v,z:w,h:L,r:K*.5}),!0},j=(v,w)=>{r.posAtDist(v,l),r.tangentAtDist(v,u);const M=Math.hypot(u.x,u.z)||1;return[l.x-u.z/M*w,l.z+u.x/M*w]},ie=(v,w,M,W)=>{for(let q=0,D=0;q<W&&D<24;D++){const V=a()*be,L=a.range(1,2.6),K=M*a.range(.32,.86),i=a()<.22;P(v+Math.cos(V)*L,w+Math.sin(V)*L,i?{height:a.range(1.2,2.8),thick:a.range(.9,1.25),top:"hollow"}:{height:K},.95,3.6)&&q++}};P(4.8,-25,{height:7.4,lod:2,top:"slant",thick:1.12});const I=t.BR,_=t.own("pbt-bridge"),Z=I.a.clone(),X=I.dir;f.push({x:Z.x-s,z:Z.z-n,y:-.26,height:Ve,thick:1.1,lod:2,fallen:!0,rotY:Math.atan2(-X[1],X[0]),lean:_.range(.6,2.2),leanAz:_.range(0,be),curve:_.range(-.15,.25)});for(let v=-1;v<=9;v++)h.push({x:Z.x+X[0]*v,z:Z.z+X[1]*v,r:.75});for(const[v,w,M]of[[-1,8.6,1.3],[1,8.2,1.2]])for(let W=0;W<=40;W++){const[q,D]=j(I.sMid+v*-.25*W,v*4.4);if(c.at(q,D)>=1&&P(q,D,{height:w,thick:M,lean:_.range(2.5,5.5)},2.2,3.3,_)){x.bridge++;break}}let N=null,se=0,E=f.length;for(const[v,w,M,W,q]of $t){let D=!1,V=null;for(let L=0;L<7&&!D;L++){const[K,i]=j(v,w+Math.sign(w)*L*1.3),$={height:M,thick:W||void 0,top:q,lean:M>8?a.range(2.5,5.5):void 0};F=null,D=P(K,i,$,2.2,Math.min(Math.abs(w)-.3,6)),!D&&F&&!V&&(V={x:K,z:i,o:$,sep:2.2,clear:Math.min(Math.abs(w)-.3,6)}),D&&(x.anchors++,v===412&&(N={x:K,z:i,h:M}),ie(K,i,M,a()<.6?a.int(1,2):0))}!D&&V&&b.push(V),++se%8===0&&await e.yield()}x.company=f.length-E-x.anchors,E=f.length;for(let v=13,w=0;v<457;v+=a.range(4.6,6.4),w++){const M=w%2?1:-1,W=a(),q=W<.45?a.range(7,8.8):W<.8?a.range(4.4,7):W<.88?a.range(1.3,2.9):a.range(1,2.4),D=W>=.8&&W<.88?{height:q,thick:a.range(.9,1.25),top:"hollow"}:{height:q,thick:q>8?a.range(1.1,1.3):void 0};let V=!1,L=null;for(const K of[M,-M]){const[i,$]=j(v,K*a.range(3.7,6.4));if(F=null,P(i,$,D,2.7,3.5)){V=!0;break}F&&!L&&(L=F)}!V&&L&&b.push({x:L.x,z:L.z,o:D,sep:2.7,clear:3.5}),w%12===11&&await e.yield()}x.ranks=f.length-E,E=f.length;const he=[];{const v=-Math.sin(25*He),w=-Math.cos(25*He),M=new o.Vector3,W=t.own("pbt-groves");let q=0;for(let i=0;i<r.length;i+=.5)if(r.posAtDist(i,l),c.at(l.x,l.z)>0){q=i;break}let D=r.length;for(let i=r.length;i>0&&(r.posAtDist(i,l),!(l.y<Zt-.02));i-=.5)D=i;const V=(i,$)=>{const oe=r.nearestXZ(i,$);return oe.u*r.length>D&&oe.dist<Dt},L=t.sGate-4*Dt,K=[[0,0,1,1.3],[1.5,.9,.84,0],[-1.3,1.7,.68,0],[.5,-1.9,.52,0],[2.7,-.7,0,1.15,"hollow"],[-2.3,-1.2,-1,0],[3.4,2.4,.93,1.15],[-3.6,.8,.42,0]];for(let i=q-t.lookAhead+W.range(0,22),$=0;i<L;i+=W.range(13,31),$++){const oe=$%3===2?-1:1,pe=W.range(5.5,8)+(i>=t.sAve?6.4:0),ue=W.range(7.6,8.8);if(i<0)continue;r.posAtDist(i,l),r.posAtDist(Math.min(i+6,r.length),M).sub(l),M.y=0,M.normalize();const ze=M.x,Se=M.z,je=-Se,Ye=ze,Ee=(je*v+Ye*w>=0?1:-1)*oe,We=(s-l.x)*je+(n-l.z)*Ye>=0?1:-1,Ae=i>t.sBar&&i<t.sEld,Ge=[];if(Ae)for(const ke of[We,-We])for(let ge=0;ge<=ko;ge++)Ge.push([ke,ge]);else for(let ke=0;ke<=ko;ke++)for(const ge of[Ee,-Ee])Ge.push([ge,ke]);for(const[ke,ge]of Ge){const Ue=pe+ge*zo,Oe=l.x+je*ke*Ue,Le=l.z+Ye*ke*Ue,st=f.length;let Je=null;if(!(c.at(Oe,Le)<2.5||Math.hypot(Oe-s,Le-n)<10.6||V(Oe,Le)||O(Oe,Le,.65))&&!(ge&&Math.abs(r.nearestXZ(Oe,Le).dist-Ue)>zo)){for(const[dt,pt,rt,mt,qe]of K){const vt=W.range(-.3,.3),gt=W.range(-.3,.3),wt=rt>0?ue*rt:rt<0?1.6:2.3,xt=Oe+ze*(dt+vt)+je*ke*(pt+gt+.6),it=Le+Se*(dt+vt)+Ye*ke*(pt+gt+.6),Be={height:wt,thick:mt||void 0,top:qe};if(V(xt,it))continue;P(xt,it,Be,.95,3.4,W)&&(!Je||wt>Je.height)&&(Je=f[f.length-1])}if(f.length>st){he.push({d:i,x:Oe,z:Le,h:ue,side:ke,out:ge,members:f.length-st,giant:Je}),x.groveMembers+=f.length-st;break}}}$%4===3&&await e.yield()}await e.yield()}E=f.length;for(const[v,w,M]of[[0,-4.2,1.9],[1.5,-5.6,1.25],[-1.3,-5.9,2.25],[2.9,-4,1.05],[.5,-7.4,1.6]]){const[W,q]=j(126+v,w);P(W,q,{height:M,lod:1,veil:m?2.5:3.5,delay:.3+.1*v,gain:.5},.9,3.2)}x.young=f.length-E,E=f.length,r.posAtDist(250,l);{const v=s-l.x,w=n-l.z,M=Math.hypot(v,w)||1,W=v/M,q=w/M;for(const[D,V,L,K]of[[4.6,-3.8,7.2,0],[7.5,2.6,8,1.15],[3.2,5.4,5.4,0],[9.6,-2.2,6.4,0],[6,-8.2,7.6,0],[11.5,6,7,0],[5.4,9.6,3,1.1]])P(s+W*D-q*V,n+q*D+W*V,{height:L,thick:K||void 0,top:L<3.5?"hollow":void 0},1.6,6.5)}x.elderGrove=f.length-E,E=f.length,await e.yield();const R=we(Math.round(p.pillars),24,36),g=Math.round(Q(18,25,(R-24)/12));let B=0;for(let v=0;B<g&&v<900;v++){const w=a.range(-10,500),M=a.sign(),W=M*(13+62*a()*a()),q=a.int(3,6),D=a.range(5.6,8.6),[V,L]=w>462?[j(459,W)[0]-(w-459),j(459,W)[1]]:j(w,W);if(v%30===29&&await e.yield(),c.at(V,L)<1.2||c.at(V,L)>16||r.nearestXZ(V,L).dist<11||O(V,L,.65))continue;let K=!0;for(const i of h)if(Math.hypot(V-i.x,L-i.z)<9){K=!1;break}if(K){for(let i=0;i<q;i++){const $=a()*be,oe=i?a.range(1.1,5.5):0;P(V+Math.cos($)*oe,L+Math.sin($)*oe,{height:i?D*a.range(.3,.95):D},1,10.5)}B++}}x.far=f.length-E,x.farGroves=B,E=f.length,await e.yield();{const v=t.own("pbt-late");for(const w of b){const M=r.nearestXZ(w.x,w.z).u;r.posAtDist(M*r.length,l);const W=l.x-w.x,q=l.z-w.z,D=Math.hypot(W,q)||1,V=Math.max(D,w.clear+.05);for(let L=0;L<=16&&!P(l.x+W/D*(V+.25*L),l.z+q/D*(V+.25*L),w.o,w.sep,w.clear,v);L++);}}return x.late=f.length-E,x.refused=b.length,x.trunks=f.length-1,x.groves=he.length,{items:f,feet:h,fallen:Z,fallenDir:X,posts:C,close:N,groves:he,tally:x}}function Et(){const e=[],t=[],a=[],r=[];let c=[0,0,0,0];const p={part(s,n=0,f=0,h=0){c=[s,n,f,h]},v(s,n){return e.push(s[0],s[1],s[2]),t.push(n.r,n.g,n.b),a.push(c[0],c[1],c[2],c[3]),e.length/3-1},tri(s,n,f){r.push(s,n,f)},loft(s,n,f){const h=s[0].pts.length,C=[];for(const l of s)C.push(e.length/3),l.pts.forEach((u,S)=>p.v(u,l.cols[S]??l.cols[0]));for(let l=0;l<s.length-1;l++)for(let u=0;u<h;u++){const S=C[l]+u,x=C[l]+(u+1)%h,A=C[l+1]+u,d=C[l+1]+(u+1)%h;r.push(S,A,x,x,A,d)}const m=(l,u,S)=>{const x=l.pts.reduce((d,z)=>[d[0]+z[0]/h,d[1]+z[1]/h,d[2]+z[2]/h],[0,0,0]),A=p.v(x,l.cols[0]);for(let d=0;d<h;d++)S?r.push(A,u+(d+1)%h,u+d):r.push(A,u+d,u+(d+1)%h)};n&&m(s[0],C[0],!1),f&&m(s[s.length-1],C[s.length-1],!0)},tube(s,n,f,h,C=1){const m=[];for(let l=0;l<s.length;l++){const u=s[Math.max(l-1,0)],S=s[Math.min(l+1,s.length-1)],x=new o.Vector3(S[0]-u[0],S[1]-u[1],S[2]-u[2]).normalize(),A=Math.abs(x.y)>.9?new o.Vector3(1,0,0):new o.Vector3(0,1,0),d=new o.Vector3().crossVectors(x,A).normalize(),z=new o.Vector3().crossVectors(d,x),O=[];for(let b=0;b<f;b++){const F=b/f*be,P=Math.cos(F)*n[l],j=Math.sin(F)*n[l]*C;O.push([s[l][0]+d.x*P+z.x*j,s[l][1]+d.y*P+z.y*j,s[l][2]+d.z*P+z.z*j])}m.push({pts:O,cols:[h]})}p.loft(m,!0,!0)},plate(s,n){const f=s.map(h=>p.v(h,n));for(let h=1;h<f.length-1;h++)r.push(f[0],f[h],f[h+1])},build(){const s=new o.BufferGeometry;return s.setAttribute("position",new o.Float32BufferAttribute(e,3)),s.setAttribute("color",new o.Float32BufferAttribute(t,3)),s.setAttribute("aPart",new o.Float32BufferAttribute(a,4)),s.setIndex(r),s.computeVertexNormals(),s.userData.triangles=r.length/3,s}};return p}function Jt(e,t,a,r,c,p,s,n,f=0){const h=[],C=[];for(let m=0;m<c;m++){const l=m/c*be,u=Math.cos(l),S=Math.sin(l),x=S>=0?a*Q(Math.pow(S,.75),1-Math.abs(u),p):r*S;h.push([t*u,f+x,e]),C.push(S>.12?s:n)}return{pts:h,cols:C}}function va(){const e=Et(),t=new o.Color("#4a3820"),a=new o.Color("#b59a5c"),r=new o.Color("#2c2216"),c=new o.Color("#D8CDB0"),p=new o.Color("#947d50"),s=new o.Color("#a8935f"),n=(u,S,x)=>{const A=[],d=[];for(let O=0;O<10;O++){const b=O/10*be,F=Math.cos(b),P=Math.sin(b);A.push([S*F,P>=0?x*Math.pow(P,1.7)+.003*P:.004*P,u]),d.push(P<-.1?c:Math.abs(F)>.8?a:t)}return{pts:A,cols:d}},f=(u,S,x,A,d)=>Jt(u,S,x,.004,10,A,d,c);e.loft([n(.125,.004,.002),n(.12,.03,.008),n(.108,.048,.014),n(.09,.061,.019),n(.068,.068,.023),n(.046,.071,.026),n(.039,.052,.028),f(.036,.027,.03,.45,t),f(.02,.022,.03,.85,p),f(-.02,.018,.027,1,p),f(-.06,.012,.021,1,p),f(-.095,.006,.013,1,p),f(-.11,.003,.007,1,r)],!0,!0);const h=new o.Color("#080705");for(const u of[-1,1])e.plate([[u*.054,.009,.058],[u*.071,.007,.046],[u*.093,.004,-.03],[u*.074,.005,-.004],[u*.05,.009,.032]],t),e.plate([[u*.03,.006,.036],[u*.052,.003,.008],[u*.03,.004,-.002]],s),e.plate([[u*.0125,.0215,.094],[u*.005,.0225,.086],[u*.0125,.0235,.078],[u*.02,.022,.086]],h);e.plate([[0,.0235,.092],[-.0035,.0238,.087],[0,.024,.082],[.0035,.0238,.087]],new o.Color("#efe4c0")),e.plate([[0,.028,-.032],[0,.037,-.056],[0,.022,-.066]],s),e.plate([[0,.011,-.1],[0,.036,-.142],[0,.011,-.123],[0,-.003,-.127],[0,0,-.104]],s);const C=e.build(),m=C.attributes.position,l=new Float32Array(m.count);for(let u=0;u<m.count;u++)l[u]=we((.03-m.getZ(u))/.17,0,1);return C.setAttribute("aBend",new o.BufferAttribute(l,1)),C}function ga(e,t,a){const r=va(),c=a.length,p=new Float32Array(c*4),s=new Float32Array(c*4);a.forEach((u,S)=>{p.set([u.x,u.z,u.y,u.r],S*4),s.set([t(),u.big?t.range(1.95,2.45):t.range(1,1.4),t.sign(),t.range(.6,1.4)],S*4)});const n=new o.InstancedBufferGeometry;n.index=r.index;for(const u of["position","normal","color","aBend"])n.setAttribute(u,r.attributes[u]);n.setAttribute("iA",new o.InstancedBufferAttribute(p,4)),n.setAttribute("iB",new o.InstancedBufferAttribute(s,4)),n.instanceCount=c;const f=`
uniform float uTime; uniform vec3 uScare;
attribute vec4 iA, iB;
void fishPose(out vec2 pos, out vec2 hd, out float sc){
  float t = uTime * iB.w * .2 * iB.z + iB.x * 6.283;
  pos = iA.xy + iA.w * vec2(cos(t), sin(t));
  hd = vec2(-sin(t), cos(t)) * iB.z;
  vec2 away = pos - uScare.xy; float d = length(away); away /= max(d, 1e-3);
  sc = uScare.z * (1. - smoothstep(.7, 3.4, d));
  pos += away * sc * 1.7;
  hd = mix(hd, away, min(sc * 1.4, .92)); hd /= max(length(hd), 1e-3);
}`,h=new o.ShaderMaterial({uniforms:{...$e(),...e.U},fog:!0,side:o.DoubleSide,transparent:!0,vertexShader:`
attribute vec3 color; attribute float aBend;
varying vec3 vCol, vN, vWp, vLp;
#include <fog_pars_vertex>
${f}
void main(){
  vec2 pos, hd; float sc; fishPose(pos, hd, sc);
  float burst = max(smoothstep(.1, .7, sin(uTime * .9 + iB.x * 40.)), sc);
  vec3 p = position * iB.y, n = normal;
  float bend = aBend * aBend;
  p.x += sin(uTime * 18.85 - aBend * 3.4 + iB.x * 30.) * .034 * bend * (.25 + .75 * burst) * iB.y;
  float pitch = .2 * (1. - sc) * (.55 + .45 * sin(uTime * 1.3 + iB.x * 20.));
  float cp = cos(pitch), sp = sin(pitch);
  p.yz = vec2(p.y * cp - p.z * sp, p.z * cp + p.y * sp); n.yz = vec2(n.y * cp - n.z * sp, n.z * cp + n.y * sp);
  p.y += (.03 + sp * .125) * iB.y + sc * .07;
  vec3 rt = vec3(-hd.y, 0., hd.x), fw = vec3(hd.x, 0., hd.y);
  vec3 wp = vec3(pos.x, iA.z, pos.y) + rt * p.x + vec3(0., p.y, 0.) + fw * p.z;
  vN = rt * n.x + vec3(0., n.y, 0.) + fw * n.z; vCol = color; vWp = wp; vLp = position;
  vec4 mvPosition = viewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
uniform vec3 uSunDir, uSunCol, uSky, uFill, uWarm; uniform float uSun, uTime;
varying vec3 vCol, vN, vWp, vLp;
#include <common>
#include <fog_pars_fragment>
${Ke}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.)); if (!gl_FrontFacing) N = -N;
  float top = smoothstep(-.1, .5, N.y);
  float spk = smoothstep(.58, .78, vn2(vLp.xz * 210.)) * step(.04, vLp.z);                     // ochre speckle on the shield
  float rows = .78 + .22 * smoothstep(-.3, .3, sin(vLp.z * 520.)) ;                          // vertical rows of scales behind it
  vec3 alb = mix(vCol, vec3(.62, .43, .17), spk * .75 * top) * mix(1., rows, step(vLp.z, .04));
  alb *= mix(.75, 1., top);
  vec2 cq = vWp.xz * 2.1 + vec2(uTime * .13, uTime * .31);
  float caus = 1. - smoothstep(0., .11, abs(vn2(cq) - .5));
  vec3 col = alb * (uSunCol * uSun * (max(dot(N, uSunDir), 0.) * .8 + caus * .5 * top) + mix(uFill, uSky, .5 + .5 * N.y) * 1.1 + uWarm * (.5 + .3 * caus * top));
  col *= vec3(.9, .95, .86);
  gl_FragColor = vec4(col, .86);
  #include <fog_fragment>
}`}),C=new o.Mesh(n,h);C.frustumCulled=!1,C.name="cephalaspids",C.renderOrder=.6;const m=new o.InstancedBufferGeometry;m.setAttribute("position",new o.Float32BufferAttribute([-1,0,-1,1,0,-1,1,0,1,-1,0,1],3)),m.setIndex([0,2,1,0,3,2]),m.setAttribute("iA",n.attributes.iA),m.setAttribute("iB",n.attributes.iB),m.instanceCount=c;const l=new o.Mesh(m,new o.ShaderMaterial({uniforms:{...$e(),...e.U},fog:!0,transparent:!0,depthWrite:!1,side:o.DoubleSide,vertexShader:`
varying vec2 vC; varying float vA;
#include <fog_pars_vertex>
${f}
void main(){
  vec2 pos, hd; float sc; fishPose(pos, hd, sc);
  float cyc = fract(uTime * .35 + iB.x * 7.), sz = (.07 + .2 * cyc) * iB.y;
  vec2 c = pos + hd * (.1 * iB.y - cyc * .06);
  vec3 wp = vec3(c.x, iA.z + .03 + cyc * .09, c.y) + position * sz;
  vC = position.xz; vA = (1. - cyc) * smoothstep(0., .15, cyc) * (1. - sc) * smoothstep(.1, .7, sin(uTime * .9 + iB.x * 40.) + .4);
  vec4 mvPosition = viewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
uniform vec3 uWarm, uSunCol; uniform float uSun;
varying vec2 vC; varying float vA;
#include <common>
#include <fog_pars_fragment>
void main(){
  float f = clamp(1. - dot(vC, vC), 0., 1.);
  gl_FragColor = vec4(vec3(.5, .42, .3) * (uWarm * 2. + uSunCol * uSun * .5), f * f * vA * .5);
  #include <fog_fragment>
}`}));return l.frustumCulled=!1,l.renderOrder=.3,l.name="silt",{mesh:C,puff:l,triangles:c*r.userData.triangles}}function wa(){const e=Et(),t=new o.Color("#3f4124"),a=new o.Color("#15160b"),r=new o.Color("#77754a"),c=new o.Color("#E1D7B4"),p=new o.Color("#2b2a18"),s=new o.Color("#4a4a2a"),n=(d,z,O,b,F=0,P=.02)=>Jt(d,z,O,P,16,F,b,c),f=new o.Color("#5d5a33"),h=new o.Color("#9a9160"),C=new o.Color("#4d4526"),m=[n(.9,.014,.006,h),n(.886,.078,.02,h),n(.86,.128,.036,f),n(.82,.166,.05,f),n(.77,.188,.058,f),n(.71,.197,.061,f),n(.655,.191,.057,f),n(.628,.176,.05,h),n(.61,.142,.046,a)],l=.6,u=.096;for(let d=0;d<12;d++){const z=d<=3?Q(.152,.175,d/3):Q(.175,.06,Math.pow((d-3)/8,.9)),O=Q(.056,.03,d/11),b=Q(.024,.012,d/11),F=l-d*u;m.push(n(F-u*.04,z*.93,O*.84,a,0,b),n(F-u*.3,z,O,a,0,b),n(F-u*.5,z,O*1.02,t,0,b),n(F-u*.97,z*.99,O*1.04,r,0,b))}const S=[[-.555,.052,.027,a,.3],[-.58,.08,.024,t,.4],[-.62,.104,.021,t,.4],[-.67,.118,.019,t,.4],[-.72,.12,.017,t,.4],[-.765,.11,.014,t,.4],[-.805,.088,.011,h,.4],[-.835,.055,.008,h,.4],[-.85,.018,.004,h,.4]];for(const[d,z,O,b,F]of S)m.push(n(d,z,O,b,F,.006));e.loft(m,!0,!0),e.tube([[0,.027,-.57],[0,.026,-.66],[0,.021,-.76],[0,.011,-.838]],[.004,.006,.005,.002],5,r,.8);const x=new o.Color("#050604"),A=new o.Color("#fff6dc");for(const d of[-1,1]){e.part(0),e.tube([[d*.118,.04,.772],[d*.134,.064,.792],[d*.14,.066,.828],[d*.128,.046,.85]],[.008,.035,.035,.008],8,x,.7),e.plate([[d*.15,.084,.818],[d*.16,.079,.802],[d*.158,.078,.828]],A),e.part(4,d*.06,0,.86);const z=[d*.128,.04,1.16];e.tube([[d*.06,0,.86],[d*.135,.03,.98],[d*.122,.04,1.08],z],[.03,.027,.03,.046],6,C),e.tube([z,[d*.186,.04,1.25],[d*.196,.04,1.35],[d*.158,.04,1.455]],[.046,.036,.024,.006],6,a,.6),e.tube([z,[d*.07,.04,1.25],[d*.062,.04,1.35],[d*.104,.04,1.455]],[.04,.03,.02,.006],6,C,.6);for(let b=0;b<5;b++){const F=.1+.19*b,P=Q(1.25,1.43,F),j=Q(.158,.15,F),ie=Q(.094,.11,F);e.plate([[d*j,.052,P-.014],[d*j,.052,P+.014],[d*(j-.026),.052,P]],c),e.plate([[d*ie,.052,P-.014],[d*ie,.052,P+.014],[d*(ie+.022),.052,P]],c)}for(let b=0;b<4;b++){const F=.78-b*.048,P=.22+.047*b,j=(22-21*b)*He,ie=Math.cos(j)*d,I=Math.sin(j),_=[d*.13,-.008,F];e.part(3,_[0],_[1],_[2]),e.tube([_,[_[0]+ie*P*.42,.034,F+I*P*.42],[_[0]+ie*P*.78,0,F+I*P*.78],[_[0]+ie*P,-.06,F+I*P]],[.012,.01,.008,.003],4,p)}e.part(1,d*.13,.012,.6),e.tube([[d*.13,.012,.6],[d*.21,.02,.56],[d*.275,.018,.515]],[.024,.02,.022],6,p);const O=[[d*.265,.018,.52],[d*.315,.018,.47],[d*.37,.018,.405],[d*.415,.018,.345],[d*.44,.018,.3]];e.tube(O,[.022,.08,.1,.08,.016],8,s,.12),e.tube(O.map(b=>[b[0],b[1]-.007,b[2]]),[.03,.094,.116,.095,.026],8,c,.04)}return e.build()}function xa(){const e=Et(),t=new o.Color("#4a2c10"),a=new o.Color("#1c1006"),r=new o.Color("#7a5220"),c=(s,n,f,h)=>Jt(s,n,f,.003,8,0,h,a,.006),p=[c(.036,.004,.003,t),c(.03,.011,.007,t),c(.016,.013,.008,t)];for(let s=0;s<7;s++)p.push(c(.012-s*.0052,.0135-7e-4*s,.0085,s%2?t:a));p.push(c(-.024,.005,.005,a)),e.loft(p,!0,!0),e.tube([[0,.009,-.022],[0,.014,-.04],[0,.03,-.05],[0,.046,-.042],[0,.052,-.024],[0,.047,-.012],[0,.038,-.008]],[.004,.0038,.0036,.0034,.0045,.003,6e-4],5,t);for(const s of[-1,1]){e.part(4,s*.008,.008,.03),e.tube([[s*.008,.008,.03],[s*.021,.01,.042],[s*.017,.009,.057]],[.0026,.0024,.0045],5,t),e.tube([[s*.017,.009,.057],[s*.02,.009,.066],[s*.015,.009,.076]],[.0042,.003,6e-4],4,r),e.tube([[s*.017,.009,.057],[s*.011,.009,.066],[s*.013,.009,.076]],[.003,.002,6e-4],4,r);for(let n=0;n<4;n++){const f=.02-n*.008,h=(1-n)*.006,C=[s*.01,.008,f];e.part(3,C[0],C[1],C[2]),e.tube([C,[s*.022,.017,f+h],[s*.034,0,f+h*1.7]],[.0016,.0014,7e-4],4,t)}}return e.build()}function Mo(e,t){return new o.ShaderMaterial({uniforms:{...$e(),...e.U,uSwim:{value:0},uBend:{value:0},uPh:{value:0},uFoot:{value:[0,0,0,0,0,0,0,0]},uWave:{value:t.wave},uLeg:{value:new o.Vector3(t.legHz,t.legAmp,t.legK)},uGloss:{value:t.gloss},uScaleN:{value:t.grain}},fog:!0,side:o.DoubleSide,vertexShader:`
attribute vec3 color; attribute vec4 aPart;
uniform float uSwim, uBend, uPh, uWave, uTime, uFoot[8]; uniform vec3 uLeg;
varying vec3 vCol, vN, vWp, vLp;
#include <fog_pars_vertex>
vec3 rotY(vec3 v, float a){ float c = cos(a), s = sin(a); return vec3(c * v.x + s * v.z, v.y, -s * v.x + c * v.z); }
vec3 rotZ(vec3 v, float a){ float c = cos(a), s = sin(a); return vec3(c * v.x - s * v.y, s * v.x + c * v.y, v.z); }
void main(){
  vec3 p = position, n = normal, pv = aPart.yzw; float id = aPart.x, s = pv.x < 0. ? -1. : 1.;
  if (id > .5) {
    vec3 q = p - pv; float ay = 0., az = 0.;
    if (id < 2.5) {                                              // the oars: a long pull back with the blade low, a quick return
      ay = (sin(uPh) * .6 + .15) * uSwim + sin(uTime * 2.3 + s) * .12 * (1. - uSwim);
      az = -cos(uPh) * .22 * uSwim;
    } else if (id < 3.5) {                                       // legs: stepping on the bank, trailed when it swims
      float lp = uTime * uLeg.x + pv.z * uLeg.z + s * 1.5708;
      ay = .85 * uSwim + sin(lp) * uLeg.y * (1. - .7 * uSwim);
      az = max(cos(lp), 0.) * uLeg.y * .6 * (1. - uSwim);
    } else { ay = sin(uTime * .7 + s * 1.3) * .07 - .05; }      // claw arms weave slowly
    q = rotZ(rotY(q, s * ay), s * az); n = rotZ(rotY(n, s * ay), s * az);
    p = pv + q;
  }
  float tw = (1. - smoothstep(-.85, .7, p.z));
  p.y += sin(uPh - p.z * 5.5) * uWave * tw * (.12 + .88 * uSwim) + sin(uTime * 1.1) * uWave * .06;
  p.x += uBend * p.z * p.z * .5;
  // n4: an animal on a round, stepped back: each of its eight legs reaches down (or draws up) to the surface under its own
  // foot (uFoot: the tip's way down, least at the hip, all of it at the tip; 0 for the swimmers)
  if (id > 2.5 && id < 3.5) { float k = clamp((abs(p.x) - .01) / .024, 0., 1.); p.y -= uFoot[int(clamp(floor((.02 - pv.z) / .008 + .5), 0., 3.)) + (s > 0. ? 4 : 0)] * k * k; }
  vec4 wp = modelMatrix * vec4(p, 1.);
  vN = mat3(modelMatrix) * n; vCol = color; vWp = wp.xyz; vLp = position;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
uniform vec3 uSunDir, uSunCol, uSky, uFill, uWarm, uFogSun; uniform float uSun, uGloss, uScaleN;
varying vec3 vCol, vN, vWp, vLp;
#include <common>
#include <fog_pars_fragment>
${Ke}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.)); if (!gl_FrontFacing) N = -N;
  vec3 V = cameraPosition - vWp; V /= max(length(V), 1e-4);
  float tub = vn2(vLp.xz * uScaleN), fine = vn2(vLp.xz * uScaleN * 3.7 + 9.);
  vec3 alb = vCol * mix(.7, 1.15, tub) * mix(.86, 1.08, fine);
  alb *= 1. - .35 * smoothstep(.72, .9, fine) * step(.3, N.y);                                // tubercles on the back
  float ndl = max(dot(N, uSunDir), 0.);
  vec3 col = alb * (uSunCol * uSun * (ndl + .3 * max(N.y, 0.)) + mix(uFill * 1.1, uSky * 1.25, .5 + .5 * N.y) + uWarm * (.35 + .45 * max(N.y, 0.)));
  vec3 Hv = uSunDir + V; Hv /= max(length(Hv), 1e-3);
  float sp = max(dot(N, Hv), 0.); sp *= sp; sp *= sp; sp *= sp; sp *= sp; sp *= sp;
  float fres = 1. - max(dot(N, V), 0.); fres *= fres;
  vec3 Hf = uSunDir * vec3(1., .55, 1.) + V; Hf /= max(length(Hf), 1e-3);                    // in fog the glow round the sun still lays a soft wet streak on the shell
  float spB = max(dot(N, Hf), 0.); spB *= spB; spB *= spB; spB *= spB; spB *= spB; spB *= spB; spB *= spB;
  col += uGloss * (uSunCol * uSun * sp * .9 + uFogSun * (fres * .1 * max(N.y + .3, 0.) + spB * .55 * (1. - .6 * uSun)));          // wet shell: a glint and the sky on its back
  col *= mix(vec3(.8, .9, .82), vec3(1.), smoothstep(${(Re-.03).toFixed(2)}, ${(Re+.01).toFixed(2)}, vWp.y));
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`})}function ya(e,t){const{V:a,path:r}=e,c=86,p=new Float32Array(c*4),s=new Float32Array(c*4);for(let C=0;C<c;C++){const m=C>=70&&C<76,l=C>=76;let u,S,x=0;do u=m?t.range(-560,-380):t.range(-330,150),S=m?t.range(-360,-130):t.range(-380,20);while(!m&&(r.nearestXZ(u,S).dist<19||r.nearestXZ(u,S).dist>(C<44?62:150))&&++x<60);const A=a.mood==="rain";p.set([u,m?-1:-2,S,m?1:0],C*4),s.set([m?t.range(70,120):t.range(42,78),m?t.range(9,15):A?t.range(3,6):t.range(4.5,9),t(),m?0:t.range(.85,1.2)+ee(-330,-200,S)*.35],C*4),l&&(p.set([-420+(C-76)*54+t.range(-12,12),-2,-520+t.range(-30,30),0],C*4),s.set([t.range(64,88),A?t.range(11,15):t.range(26,36),t(),-1],C*4))}const n=new o.InstancedBufferGeometry;n.setAttribute("position",new o.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),n.setIndex([0,1,2,0,2,3]),n.setAttribute("iP",new o.InstancedBufferAttribute(p,4)),n.setAttribute("iS",new o.InstancedBufferAttribute(s,4)),n.instanceCount=c;const f=new o.ShaderMaterial({uniforms:{...$e(),...e.U},fog:!0,transparent:!0,depthWrite:!1,side:o.DoubleSide,blending:o.CustomBlending,blendSrc:o.OneFactor,blendDst:o.OneMinusSrcAlphaFactor,vertexShader:`
attribute vec4 iP, iS; uniform vec4 uBank; uniform vec3 uAxis; uniform float uTime, uWindSpeed, uWall;
varying vec2 vC; varying vec3 vWp; varying vec3 vK; varying float vTw;
#include <fog_pars_vertex>
void main(){
  vec2 wd = uBank.zw;
  float tw = fract(uTime * uWindSpeed * .0035 + iS.z * 7.3);                    // mist drifts downwind and is renewed upwind
  float wall = step(iS.w, -.5);
  vec3 c = iP.xyz + vec3(wd.x, 0., wd.y) * (uBank.x * max(iS.w, 0.) + uBank.x * .1 * wall + (tw - .5) * 150. * step(iP.w, .5) * (1. - wall));
  vec3 toC = cameraPosition - c; toC.y = 0.; float l = length(toC);
  vec3 rt = l > 1e-3 ? vec3(toC.z, 0., -toC.x) / l : vec3(1., 0., 0.);
  vec3 wp = c + rt * position.x * iS.x + vec3(0., (position.y * .5 + .5) * iS.y, 0.);
  vC = position.xy; vWp = wp; vK = vec3(iS.z, iP.w, iS.x / max(iS.y, 1.)); vTw = mix(mix(sin(tw * 3.14159), 1., step(.5, iP.w)), uWall, wall);
  vec4 mvPosition = viewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
uniform vec4 uBank; uniform vec3 uSunCol, uRock; uniform float uSun;
varying vec2 vC; varying vec3 vWp; varying vec3 vK; varying float vTw;
#include <common>
#include <fog_pars_fragment>
${Ke}
${at}
${Ct}
void main(){
  float x = vC.x, y = vC.y * .5 + .5, sd = vK.x * 37.;
  float torn = fbm2(vec2(x * 2.2 * vK.z * .35 + sd + uTime * .03, sd * .3));
  float topY = .5 + .42 * torn;
  float ex = 1. - x * x; ex *= ex;
  float body = ex * smoothstep(0., .14, y) * (1. - smoothstep(topY - .22, topY, y));
  float wisp = fbm2(vec2(x * 2.6 * vK.z * .35 - uTime * .17 + sd, y * 2.2 + sd + uTime * .05));
  vec3 ray = vWp - cameraPosition; float dist = length(ray); ray /= max(dist, 1e-4);
  float a = body * smoothstep(.12, .7, wisp + .28) * smoothstep(7., 34., dist) * mix(uBank.y, .5, vK.y) * .92 * vTw;
  vec3 base = skyCol(normalize(vec3(ray.x, .06, ray.z)), 0.);
  float lit = smoothstep(topY - .5, topY, y);
  vec3 col = base * mix(.8, 1.14, lit) * mix(.9, 1.08, wisp) + (uSunCol * uSun * .4 + uSunTint * .07) * lit * lit * (1. - vK.y);
  col = mix(col, mix(base, uRock * 1.6, .4) * .82, vK.y);                 // the shelf lies in the mountain's shade
  col = mix(col, base, fogAmount(vFogDepth) * .6);
  gl_FragColor = vec4(col * a, a);
}`}),h=new o.Mesh(n,f);return h.frustumCulled=!1,h.renderOrder=5,h.name="fogBank",h}function ba(e,t){const a=Math.round(1900*e.detail),r=new Float32Array(a*4);for(let n=0;n<a*4;n++)r[n]=t();const c=new o.InstancedBufferGeometry;c.setAttribute("position",new o.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),c.setIndex([0,1,2,0,2,3]),c.setAttribute("iA",new o.InstancedBufferAttribute(r,4)),c.instanceCount=a;const p=new o.ShaderMaterial({uniforms:{...e.U},transparent:!0,depthWrite:!1,depthTest:!0,blending:o.CustomBlending,blendSrc:o.OneFactor,blendDst:o.OneMinusSrcAlphaFactor,vertexShader:`
attribute vec4 iA; uniform vec3 uMote, uMoteOff, uSunDir; uniform float uTime; uniform vec2 uRes;
varying vec2 vC; varying vec4 vK;
void main(){
  vec3 box = vec3(22., 9., 22.);
  vec3 c = cameraPosition + (fract(iA.xyz + (uMoteOff - cameraPosition) / box) - .5) * box;
  c += vec3(sin(uTime * .9 + iA.w * 40.), cos(uTime * .7 + iA.w * 31.), sin(uTime * .8 + iA.w * 17.)) * .06 * (.3 + uMote.x);
  vec4 mv = viewMatrix * vec4(c, 1.); float d = -mv.z;
  float dust = step(iA.w, uMote.y * .5);
  float sz = max(mix(.012, .016, uMote.x) * (1. + dust), d * 1.6 / max(uRes.y, 1.) * .85);
  mv.xy += position.xy * sz * vec2(1., mix(2.2, 1., max(uMote.x, dust)));               // n4 (K6, mend 1): drizzle falls as fine short flecks: a drop's fleck is its own breadth (3.3 cm in the mean) and what it falls in one frame of film (2.4 m/s for a sixtieth of a second: 4 cm) long, 2.2 to 1 (it was 3.2: long dashes; the first n4's 1.7 read as dots)
  float tw = .5 + .5 * sin(uTime * (2. + 3. * iA.w) + iA.x * 50.); tw *= tw;
  float a = smoothstep(.35, 1.4, d) * (1. - smoothstep(8., 13., d)) * uMote.z * mix(.45, 1., uMote.x) * min(1., mix(.012, .016, uMote.x) / sz * 3.2);
  // mend 1: a drop is lit by the sun: one that falls between the lens and the sun's quarter of the sky shines (the glow comes
  // through it), at every place and in every direction by the same law (vK.w: how near the sun's own direction it stands)
  vec3 toD = c - cameraPosition; float sw = max(dot(toD / max(length(toD), 1e-4), uSunDir), 0.);
  vC = position.xy; vK = vec4(uMote.x * (1. - dust), dust, a * mix(.5, .35 + .65 * tw, uMote.x), sw * sw);
  gl_Position = projectionMatrix * mv;
}`,fragmentShader:`
uniform vec3 uGold, uSunCol, uFogSun, uRust; uniform float uSun;
varying vec2 vC; varying vec4 vK;
void main(){
  float f = clamp(1. - dot(vC, vC), 0., 1.); f *= f;
  // mend 1 (K6): the shower's flecks are SHORT (2.2 to 1 above) and as bright as n3's and live's drizzle (the first n4 had
  // shortened AND dimmed them to 0.62: against the shower's own bright sky they were gone); toward the sun they take its gold
  vec3 drizzle = uFogSun * 1.5 + uSunCol * (.25 + .55 * clamp(vK.w, 0., 1.)), spore = uGold * uSunCol * (1.2 + 2.2 * uSun), dustc = uRust * (uFogSun + uSunCol * uSun) * 1.4;
  vec3 col = mix(mix(drizzle, spore, vK.x), dustc, vK.y);
  float a = f * vK.z * mix(.95, .95, max(vK.x, vK.y));
  gl_FragColor = vec4(col * a, a * mix(.9, .25, vK.x));
}`}),s=new o.Mesh(c,p);return s.frustumCulled=!1,s.renderOrder=8,s.name="motes",s}const ht=[[0,.44],[.085,.5],[.14,.9],[.3,1.4],[.5,.6],[.62,.8],[.74,.95],[.9,1],[1,1]];function za(e){for(let t=0;t<ht.length-1;t++)if(e<=ht[t+1][0])return Q(ht[t][1],ht[t+1][1],ee(ht[t][0],ht[t+1][0],e));return 1}const ka={fog:{elev:21,sun:["#FFE2B0",1.3],fogSun:"#F4E2BA",fogAway:"#D0C2A6",zen:"#4F8CC4",hor:"#BFD3DA",tint:"#FFE8BC",gold:"#F2C566",rho0:.0046,bank:.0012,rho1:.0011,clear0:.78,mtn0:.96,sun0:.7,wet:0,exposure:.95},amber:{elev:12,sun:["#FFB76E",1.3],fogSun:"#EFCB98",fogAway:"#C9B7A3",zen:"#5687C0",hor:"#E6C79C",tint:"#FFCF8C",gold:"#E39A4E",rho0:.0046,bank:.0012,rho1:.0013,clear0:.74,mtn0:.96,sun0:.7,wet:0,exposure:.97},rain:{elev:27,sun:["#FFE8C4",1.2],fogSun:"#E2DED0",fogAway:"#BFC4C4",zen:"#5E94C2",hor:"#C6D9DE",tint:"#FFEFD0",gold:"#F2C566",rho0:.0021,bank:.0012,rho1:9e-4,clear0:.88,mtn0:.96,sun0:.75,wet:1,exposure:.95}};var Da={id:"pillars-before-trees",name:"Pillars Before Trees",category:"prehistoric",weirdness:.5,media:["open","water"],async build(e){const t=new o.Scene,a=e.noise,r=e.quality?.detail??1,c=e.vary??{},p=y=>e.rng.fork?e.rng.fork(y):e.rng,s=p("morning"),n=s(),f=c.hour??"any",h={mood:f==="golden"||f==="dawn"?"amber":f==="day"?n<.6?"fog":"rain":n<.42?"fog":n<.72?"amber":"rain",ripe:s.chance(.45),pair:s()>.6,shoal:s.range(.4,1),pillars:s.int(24,36),fallenOld:s.chance(.5),rare:!!c.rare},C=c.density??1,m=ka[h.mood],l=Jo();await e.yield();const u=l.posAtDist(250,new o.Vector3),S=l.tangentAtDist(250,new o.Vector3),x={x:u.x+S.z*6.4,z:u.z-S.x*6.4},A=new o.Vector2(-.25,-.95).normalize(),d=new o.Vector3(-Math.sin(25*He)*Math.cos(m.elev*He),Math.sin(m.elev*He),-Math.cos(25*He)*Math.cos(m.elev*He)),z=["#E6DCC3","#EADFC6",m.gold,h.ripe?"#74824F":"#6B8660",h.ripe?"#B5683A":"#A9643A","#5B5A6B","#3A3B33"],O=await jo(e,{palette:z,detail:r,swardCount:36,veilLength:h.rare?10:52,light:{sunDir:d,sunColor:Fe(m.sun[0],m.sun[1])}});O.object.position.set(x.x,0,x.z),t.add(O.object),O.setWind(A.x,A.y,h.rare?1.1:2.6,h.rare?.97:.12),O.setState({sun:m.sun0,sunDown:m.sun0,smoke:0,wet:m.wet});const b=O.shared;b.uVeilGain.value=h.rare?1.9:1.5,b.uVeilEven.value=h.rare?1:0,await e.yield();const F=Qo(l),P=ta(l,F),j=await oa(e,P),ie=aa(j,a);b.uMap.value=j.tex,b.uMapRect.value.set(j.x0,j.z0,1/xe.size,xe.cap);const I={...b,uFogSun:{value:Ut(m.fogSun,.76,1.45)},uFogAway:{value:Ut(m.fogAway,.4,1.1).multiply(new o.Vector3(.94,.97,1.1))},uZen:{value:Fe(m.zen)},uHor:{value:Fe(m.hor)},uSunTint:{value:Fe(m.tint)},uCum:{value:h.mood==="rain"?1:.3},uLow:{value:Ut(m.fogAway,.8,1.4)},uClear:{value:m.clear0},uMap:{value:j.tex},uMapRect:{value:new o.Vector4(j.x0,j.z0,1/xe.size,xe.cap)},uCloud:{value:0},uWetAll:{value:m.wet},uRipe:{value:h.ripe?1:0},uGlint:{value:1},uRock:{value:Fe("#5B5A6B")},uMtn:{value:m.mtn0},uScare:{value:new o.Vector3(0,0,0)},uBank:{value:new o.Vector4(0,1,A.x,A.y)},uShaft:{value:0},uWall:{value:0},uCurtain:{value:0},uSea:{value:[0,1,2].map(()=>new o.Vector4(1e5,1e5,0,1))},uSeaK:{value:[0,1,2].map(()=>new o.Vector4(1,0,0,0))},uLog:{value:new o.Vector4(1e5,1e5,100001,1e5)},uRain:{value:0},uSq:{value:0},uWisp:{value:0},uTear:{value:0},uPil:{value:Array.from({length:24},()=>new o.Vector4(1e5,1e5,.01,.01))},uMote:{value:new o.Vector3(0,0,1)},uMoteOff:{value:new o.Vector3},uRes:{value:new o.Vector2(800,450)}},_=512,Z=new Uint8Array(_*_),X=new o.DataTexture(Z,_,_,o.RedFormat,o.UnsignedByteType);X.magFilter=X.minFilter=o.LinearFilter,X.wrapS=X.wrapT=o.ClampToEdgeWrapping,X.needsUpdate=!0,I.uCover={value:X};const N={path:l,map:j,height:ie,noise:a,detail:r,density:C,V:h,shared:b,U:I,elder:x,feet:[],young:O.anchors.young,cover:Z,coverTex:X,COV:_},se=y=>e.core.makeRng(e.core.hashSeed(y+":"+e.seed)),E=P.K[P.K.length-1],he=P.C[P.C.length-1],R=ut(l,x.x,x.z).s,g=ut(l,E[0],E[1]).s,B=ut(l,he[0],he[1]).s,v=$t[$t.length-1][0];Object.assign(N,{own:se,BR:F,sEld:R,sBar:g,sAve:B,sGate:v,elderH:O.height??8.8,elderR:.65,lookAhead:ot}),b.uCover&&(b.uCover.value=X),t.fog=new o.FogExp2(new o.Color().setRGB(.6,.58,.5),m.rho0),await e.yield();const w=await ma(e,N,p("pillars"));N.feet=w.feet,await e.yield();const M=w.posts.filter(y=>j.at(y.x,y.z)<8&&y.h>2.5),W=new Float32Array(M.length),q=new Int32Array(M.length),D=(y,k)=>{for(let T=0;T<M.length;T++){const G=M[T];W[T]=(G.x-y)*(G.x-y)+(G.z-k)*(G.z-k),q[T]=T}q.sort((T,G)=>W[T]-W[G]);for(let T=0;T<24;T++){const G=M[q[T]];G?I.uPil.value[T].set(G.x,G.z,G.h+.3,(G.r??.5)*.9):I.uPil.value[T].set(1e5,1e5,.01,.01)}};D(0,0),await e.yield();const V=await Yo(e,b,w.items,{rng:p("field"),noise:a,detail:r,variants:9,nearRadius:19});V.object.position.set(x.x,0,x.z),t.add(V.object);const L=V.specs.find(y=>y.item.fallen),K=new o.Vector3(w.fallenDir[0],0,w.fallenDir[1]),i={na:96,nl:45,da:.1,dl:.04,a0:-.5,l0:-.88,top:new Float32Array(4320).fill(-9),ridge:new Float32Array(96),ridgeY:new Float32Array(96).fill(-9)};if(L){const y=L.mesh,k=y.geometry.attributes.position,T=y.geometry.index.array,G=new o.Vector3,H=new Float32Array(k.count*3),ae=y.rotation.y;y.material.uniforms.uTan={value:Fe("#CDC3A8",.86)},y.material.uniforms.uWaterY.value=Re,y.material.uniforms.uLie.value=1,y.material.uniforms.uFlutes.value=84,I.uLog.value.set(w.fallen.x,w.fallen.z,w.fallen.x+K.x*Ve,w.fallen.z+K.z*Ve);const ne=[];for(let Y=F.s0-1;Y<=F.s1+1.5;Y+=.5){const le=l.posAtDist(Y,new o.Vector3);ne.push({a:(le.x-w.fallen.x)*K.x+(le.z-w.fallen.z)*K.z,y:le.y})}const te=.9,J=.7+.0565*3.4+.04+.02,re=4.6-.25,Me=Y=>Math.min(Y.minC-te,Y.minW-J),Ce=()=>{y.updateMatrix();for(let Y=0;Y<k.count;Y++){G.fromBufferAttribute(k,Y).applyMatrix4(y.matrix);const le=G.x+x.x-w.fallen.x,ve=G.z+x.z-w.fallen.z;H[Y*3]=le*K.x+ve*K.z,H[Y*3+1]=G.y,H[Y*3+2]=-le*K.z+ve*K.x}},me=()=>{Ce();let Y=1/0,le=1/0,ve=1/0;for(const de of ne){let fe=-9;for(let ye=0;ye<k.count;ye++)Math.abs(H[ye*3]-de.a)<=.25&&H[ye*3+1]>fe&&(fe=H[ye*3+1]);fe>-8&&(Y=Math.min(Y,de.y-fe),de.a>=re&&(le=Math.min(le,de.y-fe)))}for(let de=0;de<k.count;de++){const fe=H[de*3];if(fe<Ve-1.4||fe>Ve-.2)continue;const ye=H[de*3+2],ce=ie(w.fallen.x+K.x*fe-K.z*ye,w.fallen.z+K.z*fe+K.x*ye);ve=Math.min(ve,H[de*3+1]-ce)}return{minC:Y,minW:le,gap:ve}};let De=.03;const Xe=Y=>{De=we(Y,-.06,.09),y.rotation.set(0,ae,-Math.PI/2+De,"YXZ")};for(let Y=0;Y<3;Y++){let le=me();y.position.y+=Me(le),await e.yield(),le=me(),await e.yield();const ve=De;Xe(ve+.01);const de=me(),fe=(de.gap-le.gap)/.01;Xe(Math.abs(fe)>.5?ve+(-.06-le.gap)/fe:ve),await e.yield()}{const Y=me();y.position.y+=Me(Y)}Ce(),y.updateMatrix(),y.material.uniforms.uAxis.value.set(0,1,0).transformDirection(y.matrix),await e.yield();for(let Y=0;Y<T.length;Y+=3){const le=T[Y]*3,ve=T[Y+1]*3,de=T[Y+2]*3,fe=H[le],ye=H[le+2],ce=H[ve],Pe=H[ve+2],Te=H[de],_e=H[de+2],ct=(Pe-_e)*(fe-Te)+(Te-ce)*(ye-_e);if(Math.abs(ct)<1e-9)continue;const Oo=Math.max(0,Math.ceil((Math.min(fe,ce,Te)-i.a0)/i.da)),Lo=Math.min(i.na-1,Math.floor((Math.max(fe,ce,Te)-i.a0)/i.da)),No=Math.max(0,Math.ceil((Math.min(ye,Pe,_e)-i.l0)/i.dl)),Io=Math.min(i.nl-1,Math.floor((Math.max(ye,Pe,_e)-i.l0)/i.dl));for(let kt=Oo;kt<=Lo;kt++)for(let Mt=No;Mt<=Io;Mt++){const ho=i.a0+kt*i.da,po=i.l0+Mt*i.dl,jt=((Pe-_e)*(ho-Te)+(Te-ce)*(po-_e))/ct,Yt=((_e-ye)*(ho-Te)+(fe-Te)*(po-_e))/ct,mo=1-jt-Yt;if(jt<-1e-4||Yt<-1e-4||mo<-1e-4)continue;const vo=jt*H[le+1]+Yt*H[ve+1]+mo*H[de+1];vo>i.top[kt*i.nl+Mt]&&(i.top[kt*i.nl+Mt]=vo)}Y%9e3===8997&&await e.yield()}for(let Y=0;Y<i.na;Y++){let le=-1,ve=-9;for(let de=0;de<i.nl;de++)i.top[Y*i.nl+de]>ve&&(ve=i.top[Y*i.nl+de],le=de);i.ridge[Y]=le<0?0:i.l0+le*i.dl,i.ridgeY[Y]=ve}for(let Y=0;Y<4;Y++)for(let le=1;le<i.na-1;le++)i.ridgeY[le-1]>-8&&i.ridgeY[le+1]>-8&&(i.ridge[le]=(i.ridge[le-1]+2*i.ridge[le]+i.ridge[le+1])/4)}i.at=(y,k)=>{const T=we((y-i.a0)/i.da,0,i.na-1.001),G=we((k-i.l0)/i.dl,0,i.nl-1.001),H=Math.floor(T),ae=Math.floor(G),ne=T-H,te=G-ae,J=H*i.nl+ae,re=i.top;return re[J]<-8||re[J+1]<-8||re[J+i.nl]<-8||re[J+i.nl+1]<-8?-9:Q(Q(re[J],re[J+1],te),Q(re[J+i.nl],re[J+i.nl+1],te),ne)},i.lat=y=>{const k=we((y-i.a0)/i.da,0,i.na-1.001),T=Math.floor(k);return Q(i.ridge[T],i.ridge[T+1],k-T)},i.world=(y,k,T)=>T.set(w.fallen.x+K.x*y-K.z*k,i.at(y,k),w.fallen.z+K.z*y+K.x*k),N.logBack=i,i.has=!!L,i.x=w.fallen.x,i.z=w.fallen.z,i.fDir=K,L&&h.fallenOld&&(L.mesh.material.uniforms.uBone={value:Fe("#C9C2A6",.8)},L.mesh.material.uniforms.uWet={value:.7}),await e.yield();const $=na(N);t.add($),await e.yield(),t.add(await wo(e,N,p("mountains"),a,{R:2250,base:380,amp:620,freq:5.2,haze0:.38,haze1:.14,order:-9})),await e.yield(),t.add(await wo(e,N,p("foothills"),a,{R:1800,base:110,amp:330,freq:6.5,haze0:.3,haze1:.08,order:-8})),await e.yield(),t.add(await sa(e,N)),await e.yield(),t.add(ra(N));const oe=await ua(e,N,p("sward"));t.add(oe.object),await e.yield(),t.add(ya(N,p("bank"))),t.add(Sa(N,p("shafts"))),t.add(Ca(N,se("pbt-wisps"))),t.add(Aa(N,l.posAtDist(460,new o.Vector3)));const pe=new o.Group;pe.name="carried",pe.add(ba(N,p("motes"))),t.add(pe),await e.yield();const ue=p("fish"),ze=[],Se=we(h.shoal*C,.4,1),je=.134,Ye=(y,k,T,G)=>ea(l,y,k+.2,T)-.6-je*(G?2.45:1.4),Ee=(y,k,T,G=ue)=>{if(j.at(y,k)>=T)return!1;const H=ie(y,k),ae=k>-50&&Math.abs(y)<6&&k<0,ne=Ye(y,H,k,ae);return ne<.12?!1:(ze.push({x:y,z:k,y:H,r:G.range(.12,Math.min(.5,ne)),big:ae}),!0)},We=(y,k,T,G=ue)=>{let H=0;for(let ae=0;ae<y;ae++)for(let ne=0;ne<40;ne++){const te=k(ae,G);if(Ee(te[0],te[1],T,G)){H++;break}}return H},Ae=Math.max(r<.8?48:72,Math.round(76*Se*(r<.8?.75:1))),Ge=Math.round(28*Se*r),ke=Math.round(22*Se*r),ge={};ge.entry=We(Ae,y=>{const k=y<Ae*.75,T=k?ue.range(-5,-21):ue.range(-18,-47);return[k?ue.range(-2.6,2.1):ue.range(-4.5,4.5),T]},-.9),ge.front=0;for(let y=0;y<25;y++)for(let k=0;k<40;k++){const T=y%5,G=y/5|0,H=(-2+.95*T+ue.range(-.3,.3)+G%2*.4)*(1+.12*G),ae=-3.7-.85*G-ue.range(0,.45);if(j.at(H,ae)<-.7){ze.push({x:H,z:ae,y:ie(H,ae),r:ue.range(.08,.22),big:!0}),ge.front++;break}}const[Ue,Oe]=F.mid,[Le,st]=F.right,[Je,dt]=F.dir;ge.B=We(Ge,()=>{const y=ue.range(-10,10),k=ue.range(-2.6,2.6);return[Ue+Le*y+Je*k,Oe+st*y+dt*k]},-.7),ge.C=We(ke,()=>{const y=ue.range(-150,22);return[y,tt(y)+ue.range(-3,3)]},-.7);{const y=se("pbt-fish"),k=1.5,T=.65;ge.bridge=We(Math.round(k*Ve*r),(J,re)=>{const Me=re.sign()*re.range(.8,3.6),Ce=re.range(-2.1,2.1);return[Ue+Le*Me+Je*Ce,Oe+st*Me+dt*Ce]},-.5,y);const G=P.A,H=[];let ae=0,ne=0,te=0;for(let J=0;J<G.length-1;J++){const re=ut(l,G[J][0],G[J][1]);if(re.s>0){if(re.dist>bo)break;H.length||(ne=re.s),te=re.s,H.push(G[J]),ae+=Math.hypot(G[J+1][0]-G[J][0],G[J+1][1]-G[J][1])}}N.shoal={from:ne,to:te,channel:ae,points:H.length},ge.swing=H.length?We(Math.round(T*ae*r),(J,re)=>{const Me=H[Math.floor(re()*H.length)%H.length],Ce=re()*be,me=re.range(0,2.4);return[Me[0]+Math.cos(Ce)*me,Me[1]+Math.sin(Ce)*me]},-.9,y):0}await e.yield();const pt=ga(N,ue,ze);t.add(pt.mesh,pt.puff),await e.yield();const rt=wa();await e.yield();const mt=(y,k,T,G,H=0)=>{const ae=new o.CatmullRomCurve3(y.map(Y=>new o.Vector3(Y[0],0,Y[1])),!1,"centripetal"),ne=ae.getLength(),te=Mo(N,{wave:.045,legHz:3,legAmp:.07,legK:40,gloss:1,grain:90}),J=new o.Mesh(rt,te);J.scale.setScalar(k),J.rotation.order="YXZ",J.frustumCulled=!1,J.name="pterygotus";const re=new o.Vector3,Me=new o.Vector3,Ce=new o.Vector3,me=new o.Vector2(0,1),De={v:0},Xe=(Y,le)=>{const ve=Math.max(0,Y-T),de=Math.min(H>0?Math.max(0,460*Math.min(Y,.115)+2.9+3.6*Math.exp(-Y/.022)-6.3*ee(.092,.125,Y)+H*Math.max(0,Y-.115)-6.5):76.7*ve*ve/(ve+.01),ne-2),fe=H>0?1:ee(0,.018,ve);ae.getPointAt(de/ne,re),ae.getTangentAt(de/ne,Me),ae.getPointAt(Math.min(1,(de+.75*k)/ne),Ce);const ye=Math.atan2(Me.x,Me.z),ce=Math.cos(ye),Pe=-Math.sin(ye);J.position.set(re.x,Re+Q(.036,.004,fe)*k,re.z),J.rotation.set(Q(.07,0,fe),ye,0);const Te=(Ce.x-re.x)*ce+(Ce.z-re.z)*Pe;return te.uniforms.uBend.value=we(2*Te/(.5625*k*k)/k,-.9,.9)*fe,te.uniforms.uSwim.value=fe,te.uniforms.uPh.value=le*(H>0?1.9:1.2)*be+G,me.set(Me.x,Me.z),me.lengthSq()>1e-6?me.normalize():me.set(0,1),De.v=fe,fe};return t.add(J),{mesh:J,pos:re,update:Xe,dir:me,sw:De,scale:k}},qe=[mt([[.5,-6.5],[.55,-9],[.75,-13],[.35,-19],[-.55,-25],[-.85,-31],[-.3,-37],[.7,-43],[1.1,-49],[.6,-57],[-3,-68],[-9,-76],[-30,-86],[-70,-92],[-130,-80]],1.3,-.02,0,200)];{const y=[];for(let k=-20.6;k<=10;k+=3)y.push([k,tt(k)]);qe.push(mt(y,1.45,.668,2.1))}if(h.pair){const y=[];for(let k=-26.5;k<=6;k+=3)y.push([k,tt(k)+1.3]);qe.push(mt(y,1,.672,4.4))}const vt=new o.Vector3(.5,Re,-6.5),gt=new o.Vector3(-20.6,Re,tt(-20.6)),wt=w.close?new o.Vector3(w.close.x,w.close.h*.72,w.close.z):l.posAtDist(385,new o.Vector3),xt=y=>{const k=y.giant?V.specs.find(te=>te.item===y.giant):null,T=k&&k.top?new o.Vector3(k.top[0]+x.x,k.top[1],k.top[2]+x.z):new o.Vector3(y.x,y.h,y.z),G=ut(l,T.x,T.z),H=k?ut(l,y.giant.x+x.x,y.giant.z+x.z):G,ae=l.posAtDist(y.d,new o.Vector3),ne=l.posAtDist(y.d+6,new o.Vector3).sub(ae);return{q:y,top:T,s:Math.min(G.s,H.s),off:Math.min(G.dist,H.dist),elderSide:(ne.x*(y.z-ae.z)-ne.z*(y.x-ae.x))*(ne.x*(x.z-ae.z)-ne.z*(x.x-ae.x))>0}};await e.yield();const it=Mo(N,{wave:0,legHz:11,legAmp:.34,legK:392,gloss:1.6,grain:900}),Be=new o.Mesh(xa(),it);Be.rotation.order="YXZ",Be.scale.setScalar(3.4),Be.frustumCulled=!1,Be.name="scorpion",t.add(Be),await e.yield();const U={v:.2,lo:4.6,hi:Ve-.9,turn:1.4,scale:3.4,reachX:.034*3.4,feetZ:[.0302,.012,-.0062,-.0244].map(y=>y*3.4)};{const y=G=>{const H=i.lat(G),ae=i.at(G,H);for(let ne=-.16;ne<.17;ne+=.08)for(let te=-.16;te<.17;te+=.08){const J=i.at(G+ne,H+te);if(J<-8||ne>-.01&&ne<.01&&J<ae-.14)return!1}return!0};let k=[U.lo,U.lo],T=null;for(let G=U.lo;G<=U.hi+1e-9;G+=.1)y(G)?(T=T?[T[0],G]:[G,G],T[1]-T[0]>k[1]-k[0]&&(k=T)):T=null;U.near=U.lo,U.lo=k[0],U.hi=k[1]}U.leg=(U.hi-U.lo)/U.v,U.period=2*(U.leg+U.turn),U.phase=se("pbt-walker")()*U.period;const Pt=(y,k)=>{let T=(y+U.phase)%U.period;return T<0&&(T+=U.period),T<U.leg?(k.a=U.lo+U.v*T,k.yaw=0):T<U.leg+U.turn?(k.a=U.hi,k.yaw=Math.PI*ee(0,1,(T-U.leg)/U.turn)):T<2*U.leg+U.turn?(k.a=U.hi-U.v*(T-U.leg-U.turn),k.yaw=Math.PI):(k.a=U.lo,k.yaw=Math.PI*(1+ee(0,1,(T-2*U.leg-U.turn)/U.turn))),k},Ao=new o.Vector3,Qe={a:0,yaw:0},Wt={a:0,yaw:0},Co=Math.atan2(K.x,K.z),Qt=y=>(Pt(y,Wt),i.world(Wt.a,i.lat(Wt.a),Ao)),Bt=new o.Vector3,eo=.16/U.scale,Bo=.04/U.scale,to=y=>{Pt(y,Qe);const k=i.lat(Qe.a),T=Co+Qe.yaw,G=Math.cos(Qe.yaw),H=Math.sin(Qe.yaw),ae=G,ne=-H,te=-H,J=-G,re=(ce,Pe)=>i.at(Qe.a+te*ce+ae*Pe,k+J*ce+ne*Pe),Me=re(0,-.08),Ce=re(0,.12),me=(Ce-Me)/.2;let De=-9;for(let ce=-.08;ce<.125;ce+=.04)De=Math.max(De,re(0,ce)-me*ce);let Xe=0,Y=0;for(const ce of U.feetZ)Xe+=(re(-U.reachX,ce)-me*ce)/4,Y+=(re(U.reachX,ce)-me*ce)/4;const le=(Y-Xe)/(2*U.reachX);i.world(Qe.a,k,Be.position),Be.position.y=De,Be.rotation.set(-Math.atan(me),T,Math.atan(le)),Be.updateMatrix();const ve=Be.matrix.elements,de=Math.max(.5,ve[5]/U.scale),fe=it.uniforms.uFoot.value;for(let ce=0;ce<8;ce++){fe[ce]=0;for(let Pe=0;Pe<6;Pe++){Bt.set((ce<4?-1:1)*U.reachX/U.scale,-fe[ce],U.feetZ[ce%4]/U.scale).applyMatrix4(Be.matrix);const Te=Bt.x-i.x,_e=Bt.z-i.z,ct=i.at(Te*K.x+_e*K.z,-Te*K.z+_e*K.x);if(ct<-8){fe[ce]=eo;break}fe[ce]+=(Bt.y-ct)/(U.scale*de)}}const ye=Math.max(0,-Math.min(...fe)-Bo);ye>0&&(Be.position.y+=ye*U.scale*de);for(let ce=0;ce<8;ce++)fe[ce]=Math.min(fe[ce]+ye,eo)};to(0);const oo=.9,qt=F.s0-1.5*ot,yt=F.s0+U.lo-oo,Fo=2*oo/(yt-qt),_t=1,ao=ot,Vt=1.375*ot,no=R-ot,so=w.groves.map(xt).filter(y=>y.elderSide&&y.q.d<=no&&y.s-_t-ot>yt),Ze=so.at(-1)??null,Do=Ze?Ze.q:null,ro=Ze?Ze.top:wt,Kt=Ze?Ze.s:g,bt=Kt-_t,Ft=Math.max(bt-ao-2*Vt,Math.min(yt,bt-ot)),Gt=bt-Ft,io=Ze?Math.min(1,Gt/(ao+2*Vt)):0,To=Math.min(Vt,Gt/2)/Gt;await e.yield();const Ro=new o.Color().setRGB(...I.uFogAway.value.toArray()).lerp(new o.Color().setRGB(...I.uFogSun.value.toArray()),.5),Po=new o.Color().setRGB(...Fe(m.hor,.97).toArray()),Ot={sky:b.uSky.value.clone().multiply(new o.Vector3(.86,.96,1.16)),fill:b.uFill.value.clone().multiply(new o.Vector3(.74,.84,1.2)),warm:b.uWarm.value.clone().multiplyScalar(1)},Lt={sky:Fe("#BFD3D6",.64),fill:Fe("#8A86A6",.6),warm:Fe(m.fogSun,.18)},Nt={sky:Fe("#BFD3D6",.56),fill:Fe("#8A86A6",.52),warm:Fe(m.fogSun,.21)},lo=new o.Vector2,zt=new o.Vector3,It=new o.Vector3,Wo=new o.Vector3(.15,.135,.095),co=O.anchors.top.clone().add(O.object.position);co.y*=.5,b.uFogS.value.copy(I.uFogSun.value).multiplyScalar(1.05),b.uFogA.value.copy(I.uFogAway.value).multiplyScalar(1.25),b.uFogG.value.copy(I.uSunTint.value);const qo=h.rare?1.9:1.3,_o=I.uCum.value,et=[[0,.5],[.1,.6],[.4,.7],[.6,.78],[1,1]],Vo=y=>{for(let k=0;k<et.length-1;k++)if(y<=et[k+1][0])return Q(et[k][1],et[k+1][1],(y-et[k][0])/(et[k+1][0]-et[k][0]));return 1},Ko=R-g,Ne=Ko/4,lt=.08*Tt,uo=.02*Tt,Go=.06*Tt,Ht={rainUp:[g,g+Ne],rainDown:[R-lt,R-lt+Ne],sunBack:[R-lt,R-uo],tear:[R-lt-Ne/2,R-lt+Ne/2],smokeOff:[g-Ne/2,g+Ne/2],dry:[R-uo,(B+v)/2],lightDown:[R-lt,R],shaftsOff:[R,R+Go],sheet:[g+Ne/2,g+Ne/2+Ne],drizzle:[g,g+Ne/2]},Ie=(y,k)=>ee(Ht[y][0],Ht[y][1],k),fo=y=>{const k=we(y,0,1),T=Vo(k),G=k*l.length,H=Ie("rainUp",G),ae=Ie("rainDown",G),ne=Ie("sunBack",G),te=H*(1-ae),J=ne,re=Ie("tear",G),Me=H*(1-.7*Ie("dry",G)),Ce=1-Ie("smokeOff",G)+ne,me=ee(.43,.59,T),De=Q(m.clear0,1,ee(0,.16,k))*(1-.44*te),Xe=ee(.05,.14,k)*(1-me);O.setState({sun:Q(m.sun0,1,me)*Q(1,.56,te)*Q(1,1.2,J),sunDown:Math.max(m.sun0*1.2,ee(.43,.56,T))*(1-.7*H*(1-Ie("lightDown",G))),smoke:ee(.44,.6,T)*we(Ce,0,1),wet:Math.max(m.wet*(1-.3*me),.95*Me)}),b.uVeilGain.value=qo*(h.rare?1:Q(.5,1,ne)),b.uVeilLow.value=h.rare?0:ne,I.uClear.value=De,I.uMtn.value=Q(m.mtn0,1,ee(.42,.56,T)),t.fog.density=Q(m.rho0+m.bank*Xe,m.rho1,ee(.43,.6,T))+.0046*te,t.fog.color.copy(Ro).lerp(Po,De),b.uFogK.value=te,I.uLow.value.set(t.fog.color.r,t.fog.color.g,t.fog.color.b).multiplyScalar(.5).add(Wo),b.uSky.value.copy(Ot.sky).lerp(Lt.sky,me).lerp(Nt.sky,J).multiplyScalar(1+.22*te),b.uFill.value.copy(Ot.fill).lerp(Lt.fill,me).lerp(Nt.fill,J).multiplyScalar(1+.1*te),b.uWarm.value.copy(Ot.warm).lerp(Lt.warm,me).lerp(Nt.warm,J).multiplyScalar(1-.3*te),I.uCloud.value=.12*ee(.56,.7,T),I.uBank.value.x=h.rare?20*me:60*ee(.43,.63,T),I.uBank.value.y=h.rare?1-.6*ee(.44,.62,T):1-.35*ee(.5,.7,T),I.uCurtain.value=260*ee(.5,.66,T),I.uWall.value=ee(.44,.57,T)*(h.rare?.7:1),I.uShaft.value=(h.mood==="rain"?.1:.24)*(1-ee(.5,.66,T))+.46*re*(1-Ie("shaftsOff",G)),I.uRain.value=te,I.uSq.value=te,I.uWisp.value=.85*te,I.uTear.value=re,I.uWetAll.value=Math.max(m.wet,.85*Ie("sheet",G)),I.uCum.value=Q(_o,1,.75*te);const Y=ee(.45,.54,T)*(1-Ie("drizzle",G)*(1-ae));return I.uMote.value.set(Y,0,1+.9*te),Y};return t.traverse(y=>{const k=Array.isArray(y.material)?y.material:y.material?[y.material]:[];for(const T of k)Zo(T,b)}),fo(0),t.userData.n4={stations:{sBar:g,sEld:R,sAve:B,sGate:v,bridge:F.s0,bridgeEnd:F.s1},WX:Ht,groves:w.groves,grove:Do,groveTop:ro,looks:{groveS:Kt,lead:Kt-Ft,end:_t,from:Ft,to:bt,weight:io,off:Ze?Ze.off:0,lookable:so,all:w.groves.map(xt),sGroveBy:no,walkFrom:qt,walkTo:yt},tally:w.tally,fishN:ge,shoal:N.shoal,spots:ze,BK:i,WALK:U,walkAt:Pt,walkerAt:Qt,land:Be,landMat:it,fallen:L?L.mesh:null,elder:x,feet:w.feet,posts:w.posts,items:w.items},{scene:t,path:l,duration:44,pace:za,title:"Pillars Before Trees \xB7 400 million years ago",ride:"none",companion:"none",camera:{fov:62,near:.2,nearThrough:.3,far:3200,sway:.2,bank:.5,lookAhead:18},pois:[{at:()=>vt,from:0,to:.1,weight:.88},{at:y=>Qt(y),from:qt/l.length,to:yt/l.length,weight:.85,fade:Fo},{at:ro,from:Ft/l.length,to:bt/l.length,weight:io,fade:To},{at:co,from:.36,to:.575,weight:.85},{at:()=>gt,from:.645,to:.74,weight:.4},{at:wt,from:.8,to:.905,weight:.5}],portal:{shape:"circle",radius:5.5,color:"#BFE9E4",glow:1,revealDistance:150},post:{exposure:m.exposure,bloom:{strength:.35,radius:.6,threshold:.92},grade:{saturation:1.06,contrast:1.07,tint:"#fffdf8",shadowTint:"#0c0a14",vignette:.2,grain:.02}},update(y,k,T,G){const H=fo(G);O.update(y,k,T),zt.setFromMatrixPosition(T.matrixWorld),V.update(zt.x-x.x,zt.z-x.z),D(zt.x,zt.z);let ae=0;for(const te of qe)ae=Math.max(ae,te.update(G,k)*(te===qe[0]?1:0));const ne=qe[0];I.uScare.value.set(ne.pos.x,ne.pos.z,ae);for(let te=0;te<qe.length&&te<3;te++){const J=qe[te];I.uSea.value[te].set(J.pos.x,J.pos.z,J.dir.x,J.dir.y),I.uSeaK.value[te].set(J.scale,.35+.65*J.sw.v,0,0)}vt.set(ne.pos.x,Re,ne.pos.z),gt.set(qe[1].pos.x,Re,qe[1].pos.z),to(k),It.set(A.x*Q(.5,1.5,H),Q(-2.4,.12,H),A.y*Q(.5,1.5,H)),h.rare&&It.set(.02,Q(-2.4,.3,H),.02),I.uMoteOff.value.addScaledVector(It,Math.min(y,.1)),e.renderer.getDrawingBufferSize(lo),I.uRes.value.copy(lo),pe.visible=G>0&&!e.through},dispose(){O.dispose(),rt.dispose()}}}};const So=(e,t)=>e>58&&e<282||e>300&&e<400&&Math.abs(t)<22;async function Ma(e,t,a,r){const{path:c,map:p,height:s,noise:n,detail:f,V:h}=t,C=Math.round(11500*f*we(t.density,.85,1.08)),m=Math.round(13500*f*we(t.density,.85,1.08)),l=Math.round(8e3*f*we(t.density,.85,1.08)),u=new Float32Array((C+m+l)*4),S=new Float32Array((C+m+l)*4);let x=0;const A=new o.Vector3,d=new o.Vector3,z=new Float32Array(502*5);for(let g=0;g<502;g++)c.posAtDist(g-30,A),c.tangentAtDist(g-30,d),z.set([A.x,A.y,A.z,d.x,d.z],g*5),g%100===99&&await e.yield();const O=127,b=120,F=-332,P=-402,j=new Float32Array(O*b);for(let g=0;g<b;g++){for(let B=0;B<O;B++){const v=F+B*4,w=P+g*4;let M=1e9,W=0;for(let q=0;q<502;q+=6){const D=z[q*5]-v,V=z[q*5+2]-w,L=D*D+V*V;L<M&&(M=L,W=q)}for(let q=Math.max(0,W-6),D=Math.min(501,W+6);q<=D;q++){const V=z[q*5]-v,L=z[q*5+2]-w,K=V*V+L*L;K<M&&(M=K)}j[g*O+B]=Math.sqrt(M)}g%4===3&&await e.yield()}const ie=t.feet.length,I=new Float32Array(ie*3);t.feet.forEach((g,B)=>I.set([g.x,g.z,(g.r+.35)*(g.r+.35)],B*3));const _=new Array(O*b),Z=[];for(let g=0;g<ie*3;g+=3){const B=Math.sqrt(I[g+2]),v=Math.floor((I[g]-B-F)/4),w=Math.floor((I[g]+B-F)/4),M=Math.floor((I[g+1]-B-P)/4),W=Math.floor((I[g+1]+B-P)/4);for(let q=M;q<=W;q++)for(let D=v;D<=w;D++){if(D<0||D>=O||q<0||q>=b){Z.includes(g)||Z.push(g);continue}const V=q*O+D;(_[V]||(_[V]=[])).push(g)}}const X=(g,B)=>{const v=g-t.elder.x,w=B-t.elder.z;if(v*v+w*w<=4)return!0;const M=Math.floor((g-F)/4),W=Math.floor((B-P)/4),q=M<0||M>=O||W<0||W>=b?Z:_[W*O+M];if(!q)return!1;for(let D=0;D<q.length;D++){const V=q[D],L=g-I[V],K=B-I[V+1];if(L*L+K*K<I[V+2])return!0}return!1},N=(g,B)=>{const v=we((g-F)/4,0,O-1.001),w=we((B-P)/4,0,b-1.001),M=Math.floor(v),W=Math.floor(w),q=v-M,D=w-W,V=W*O+M;return Q(Q(j[V],j[V+1],q),Q(j[V+O],j[V+O+1],q),D)};for(let g=0;x<C&&g<C*14;g++){const B=a.range(-330,170),v=a.range(-400,70),w=a(),M=a.range(.55,.95),W=a.range(.7,1.05),q=a(),D=a();g%45===44&&await e.yield();const V=p.at(B,v),L=q*7.31%1,K=q*13.7%1;if(V<.12+1.1*L*L||V>13.75||V>r(B,v)*(.7+.55*K))continue;let i=N(B,v);if(i<12&&(i=c.nearestXZ(B,v).dist),i<4.5||i>190||w>1.08-ee(6,190,i)*.93||w*.7>.3+ee(-.35,.15,n.fbm2(B*.09,v*.09+5,2))||X(B,v))continue;const $=1+ee(25,170,i)*.16,oe=1-.5*ee(1.5,.15,V);let pe=null;if(i<22.6){let ue=1e9,ze=0;for(let Ae=0;Ae<502;Ae+=4){const Ge=z[Ae*5]-B,ke=z[Ae*5+2]-v,ge=Ge*Ge+ke*ke;ge<ue&&(ue=ge,ze=Ae)}for(let Ae=Math.max(0,ze-4),Ge=Math.min(501,ze+4);Ae<=Ge;Ae++){const ke=z[Ae*5]-B,ge=z[Ae*5+2]-v,Ue=ke*ke+ge*ge;Ue<ue&&(ue=Ue,ze=Ae)}const Se=ze*5,je=B-z[Se],Ye=v-z[Se+2],Ee=z[Se+3],We=z[Se+4];pe=t.ribbonY(ze-30+je*Ee+Ye*We,je*We-Ye*Ee)}u.set([B,(pe??s(B,v))-.03,v,M*$*oe],x*4),S.set([q,W,D,0],x*4),x++}for(let g=0,B=0;B<m&&g<m*10;g++){const v=a.range(-30,470),w=a.range(-1,1),M=Math.sign(w)*(.4+Math.pow(Math.abs(w),1.6)*44),W=a.range(.55,.95),q=a.range(.7,1.05),D=a(),V=a();g%45===44&&await e.yield();const L=Math.min(500,Math.floor(v+30)),K=v+30-L,i=L*5;A.set(Q(z[i],z[i+5],K),Q(z[i+1],z[i+6],K),Q(z[i+2],z[i+7],K)),d.set(Q(z[i+3],z[i+8],K),0,Q(z[i+4],z[i+9],K));const $=A.x+d.z*M,oe=A.z-d.x*M,pe=p.at($,oe),ue=So(v,M),ze=D*7.31%1,Se=D*13.7%1;pe<.12+1.1*ze*ze||pe>18.75||pe>(r($,oe)+(ue?4:0))*(.7+.55*Se)||pe>3&&n.fbm2($*.055,oe*.055+5,2)<(ue?-.38:-.22)||Math.abs(M)<1.2+2.6*(.5+.5*n.n2($*.45,oe*.45))&&A.y-s($,oe)<1.18||X($,oe)||(u.set([$,(t.ribbonY(v,M)??s($,oe))-.03,oe,W*(1-.5*ee(1.5,.15,pe))],x*4),S.set([D,q,V,0],x*4),x++,B++)}const se=[];for(let g=0,B=0;B<l&&g<l*10;g++){const v=a.range(-30,470),w=a.range(-1,1),M=Math.sign(w)*(.5+Math.pow(Math.abs(w),1.3)*17),W=a.range(.6,1),q=a.range(.7,1.05),D=a(),V=a()*.7;g%45===44&&await e.yield();const L=Math.min(500,Math.floor(v+30)),K=v+30-L,i=L*5;A.set(Q(z[i],z[i+5],K),Q(z[i+1],z[i+6],K),Q(z[i+2],z[i+7],K)),d.set(Q(z[i+3],z[i+8],K),0,Q(z[i+4],z[i+9],K));const $=A.x+d.z*M,oe=A.z-d.x*M,pe=p.at($,oe),ue=So(v,M);if(!(pe<.08+.5*(D*7.31%1)||pe>19.5||pe>(r($,oe)+(ue?4.6:.6))*(.75+.5*(D*13.7%1)))&&!(pe>3&&n.fbm2($*.055,oe*.055+5,2)<(ue?-.42:-.26))){if(Math.abs(M)<.8+1.6*(.5+.5*n.n2($*.45,oe*.45))&&A.y-s($,oe)<.95){se.length<6e3&&se.push($,oe);continue}X($,oe)||(u.set([$,(t.ribbonY(v,M)??s($,oe))-.03,oe,W*(1-.3*ee(1,.2,pe))],x*4),S.set([D,q,V,1],x*4),x++,B++)}}{const g=t.cover,B=t.COV,v=B/xe.size;for(let M=0,W=se.length/2;M<x+W;M++){const q=M<x?u[M*4]:se[(M-x)*2],D=M<x?u[M*4+2]:se[(M-x)*2+1],V=(q-p.x0)*v-.5,L=(D-p.z0)*v-.5,K=Math.floor(V),i=Math.floor(L),$=V-K,oe=L-i;if(!(K<1||i<1||K>B-3||i>B-3)){for(const[pe,ue,ze]of[[0,0,(1-$)*(1-oe)],[1,0,$*(1-oe)],[0,1,(1-$)*oe],[1,1,$*oe]]){const Se=(i+ue)*B+K+pe;g[Se]=Math.min(255,g[Se]+230*ze)}M%1500===1499&&await e.yield()}}const w=new Uint8Array(B*B);for(let M=0;M<2;M++){for(let W=1;W<B-1;W++){for(let q=1,D=W*B+1;q<B-1;q++,D++)w[D]=g[D]*4+(g[D-1]+g[D+1]+g[D-B]+g[D+B])*2+g[D-B-1]+g[D-B+1]+g[D+B-1]+g[D+B+1]+8>>4;W%64===63&&await e.yield()}g.set(w)}t.coverTex.needsUpdate=!0}const E=new o.InstancedBufferGeometry;E.setAttribute("position",new o.Float32BufferAttribute([-2,0,0,2,0,0,0,2,0],3)),E.setIndex([0,1,2]),E.setAttribute("iT",new o.InstancedBufferAttribute(u.subarray(0,x*4),4)),E.setAttribute("iR",new o.InstancedBufferAttribute(S.subarray(0,x*4),4)),E.instanceCount=x;const he=new o.ShaderMaterial({uniforms:{...$e(),...t.U,uTassel:{value:h.ripe?.92:.56}},fog:!0,side:o.DoubleSide,vertexShader:`
attribute vec4 iT, iR; uniform vec3 uAxis; uniform float uTime, uWindSpeed; uniform vec2 uRes;
varying vec2 vC; varying vec3 vWp; varying vec4 vK;
#include <fog_pars_vertex>
void main(){
  vec3 c = iT.xyz; vec3 toC = cameraPosition - c; float dist = length(toC); toC.y = 0.; float l = length(toC);
  vec3 rt = l > 1e-3 ? vec3(toC.z, 0., -toC.x) / l : vec3(1., 0., 0.);
  float ya = (fract(iR.x * 37.7) - .5) * 1.5, yc = cos(ya), ys = sin(ya);            // polish 4: every clump stands at its own angle to the lens, so the stand never lines up in rows
  rt = vec3(rt.x * yc - rt.z * ys, 0., rt.x * ys + rt.z * yc);
  float mat = step(.5, iR.w);                                           // n2: the low mats between the clumps (young shoots, spiny Sawdonia): half the height, wider
  float w = iT.w * .95 * mix(1., 1.3, mat), h = iT.w * iR.y * .84 * mix(1., .5, mat);
  vec2 wd = uAxis.xz; float wl = length(wd); wd = wl > 1e-3 ? wd / wl : vec2(1., 0.);
  float run = dot(c.xz, wd) * .35 - uTime * uWindSpeed * .45;
  float gust = sin(run) * .6 + sin(run * 2.3 + c.x * .7) * .4;
  // n2: seen from above a clump leans its top away from the lens (it turns its face up to us), so that a stand looked down on
  // from one or two metres closes into a thicket and the soil never shows between upright cards as rows
  float el = clamp((cameraPosition.y - c.y) / max(dist, 1e-3), 0., .8) * (1. - smoothstep(30., 70., dist));
  vec3 away = l > 1e-3 ? -toC / l : vec3(0.);
  vec3 wp = c + rt * position.x * w + vec3(0., position.y * h * (1. - .25 * el), 0.) + away * position.y * h * el * 1.25;
  float y2 = position.y;                                              // linear, so the triangle carries exactly what the square's top edge had at y = 1
  wp.xz += wd * (.1 + .24 * gust) * y2 * h * min(uWindSpeed, 3.) * .7 + vec2(-wd.y, wd.x) * sin(uTime * 2.1 + c.x * 3. + iR.x * 20.) * .035 * y2;
  vC = vec2(position.x, position.y); vWp = wp;
  vK = vec4(iR.x, iR.z + 2. * mat, gust * y2, dist * 1.25 / max(uRes.y, 1.) / w);
  vec4 mvPosition = viewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
uniform vec3 uSunDir, uSunCol, uSky, uFill, uWarm, uGreen, uRust, uSpore; uniform float uSun, uTassel;
varying vec2 vC; varying vec3 vWp; varying vec4 vK;
#include <common>
#include <fog_pars_fragment>
${Ke}
float sdSeg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; return length(pa - ba * clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0., 1.)); }
// Psilophyton drawn on the card: a wiry leafless stem that forks in a Y, each arm forking again, and a pair of
// drooping spindle tassels at each of the four tips.  q = (metres-ish from the foot, 0-1 of the plant's height).
vec3 forkPlant(vec2 q, float sd, float lw, float ys){
  float r1 = h21(vec2(sd, 1.)), r2 = h21(vec2(sd, 2.)), r3 = h21(vec2(sd, 3.)), r4 = h21(vec2(sd, 4.));
  q.x += (r1 - .5) * .08 * q.y;
  float h0 = .2 + .12 * r2, s1 = .11 + .05 * r3, s2 = .06 + .03 * r4;
  float d = sdSeg(q, vec2(0.), vec2(0., h0));
  float sg = q.x < 0. ? -1. : 1.;
  float h1 = h0 + .32 + .09 * sg * (r1 - .5) * 2.;
  vec2 p = vec2(abs(q.x), q.y);
  d = min(d, sdSeg(p, vec2(0., h0), vec2(s1, h1)));
  float sg2 = p.x < s1 ? -1. : 1.;
  float h2 = min(1., h1 + .24 + .08 * sg2 * (r3 - .5) * 2.);
  p = vec2(abs(p.x - s1), p.y);
  d = min(d, sdSeg(p, vec2(0., h1), vec2(s2, h2)));
  p = vec2(abs(p.x - s2), p.y);
  // k1b: no bloom on top.  Each tip forks a last time into two short branchlets that arch over (the crown of the plant is bare
  // green stem), and from the down-turned end of each hangs one spindle of spore cases: a pair of drooping tassels under every
  // tip, clear of it, never an upturned head (p.x is folded: one on each side)
  vec2 cr = vec2(.022, h2 - .004 * ys), hk = vec2(.04, h2 - .06 * ys);
  d = min(d, min(sdSeg(p, vec2(0., h2 - .05 * ys), cr), sdSeg(p, cr, hk)));
  vec2 ta = hk, tb = vec2(.047, hk.y - .2 * ys);
  float t = sdSeg(p, ta, tb), tl = clamp((ta.y - p.y) / max(ta.y - tb.y, 1e-4), 0., 1.);
  return vec3(step(d, lw) * step(q.y, 1.02), step(t, lw * .4 + .0095 * sin(3.1416 * tl * sqrt(tl))) * step(p.y, hk.y), sg * .5 + sg2 * .25 + .75);
}
// Drepanophycus on the card: an upright bottle-brush of short thorn leaves, half the height of the forking stems
vec3 brushPlant(vec2 q, float sd, float lw){
  float r1 = h21(vec2(sd, 5.)), r2 = h21(vec2(sd, 6.));
  float xx = q.x - (r1 - .5) * .1 * q.y * q.y, top = .32 + .4 * r2, keep = step(.4, h21(vec2(sd, 7.)));   // uneven heights and gaps: a wild stand, not a planted row
  float br = .027 * (.55 + .45 * step(.5, fract(q.y * 15. + sd))) * smoothstep(.0, .06, q.y) * (1. - smoothstep(top - .07, top, q.y));      // a cylinder of thorn leaves with a round tip, not a cone
  return vec3(step(abs(xx), lw * .6 + max(br, 0.)) * step(q.y, top) * keep, 0., .6 + .3 * r1);
}
// Sawdonia on the card: a short stem furred with spines that forks in a Y, each tip coiled over like a crozier
vec2 sawPlant(vec2 q, float sd, float lw){
  float r1 = h21(vec2(sd, 11.)), r2 = h21(vec2(sd, 12.));
  q.x += (r1 - .5) * .12 * q.y;
  float h0 = .26 + .2 * r2, sp = .14 + .06 * r1, h1 = .84, rr = .045;
  float fur = lw * (1. + .7 * step(.55, fract(q.y * 9. + sd)));
  float d = sdSeg(q, vec2(0.), vec2(0., h0));
  vec2 p = vec2(abs(q.x), q.y);
  d = min(d, sdSeg(p, vec2(0., h0), vec2(sp, h1)));
  float ring = abs(length((p - vec2(sp - rr, h1)) * vec2(1., .8)) - rr);
  float on = max(step(d, fur), step(ring, lw * .9) * step(h1 - rr * .4, p.y + step(sp - rr, p.x) * 9.));
  return vec2(on * step(q.y, 1.02), r1);
}
void main(){
  if (abs(vC.x) > 1. || vC.y > 1.) discard;                           // outside the card's square
  float x = clamp(vC.x, -1., 1.), y = clamp(vC.y, 0., 1.), seed = clamp(vK.x, 0., 1.) * 91.;
  float isMat = step(1.5, vK.y), kind = clamp(vK.y - 2. * isMat, 0., 1.), px = clamp(vK.w, 0., 1.);
  float lw = max(.014, px * 1.2);
  float edge = 1. - .3 * x * x;                                       // a little lower toward the clump's rim, never a dome
  float c1 = x * 2.1 + seed, i1 = floor(c1), g1 = h21(vec2(i1, seed)), t1 = edge * (.62 + .38 * g1);      // k1: two or three plants across a clump, each a wide candelabra of forks: at a glance a wiry forking bush, never a tuft of blades
  float c2 = x * 2.9 + seed * 1.7 + .37, i2 = floor(c2), g2 = h21(vec2(i2, seed + 9.)), t2 = edge * (.5 + .4 * g2);
  bool brush = kind > .74;
  vec3 f1, f2;
  if (isMat > .5) {                                     // the low mats: Sawdonia with its croziers, and bottle-brushes on their runners
    f1 = vec3(sawPlant(vec2((fract(c1) - .5) / 2., y / t1), i1 * 7.3 + seed, lw * 1.6).x, 0., .45);
    if (g2 > .45) f2 = vec3(brushPlant(vec2((fract(c2) - .5) / 4., y / t2 * .7), i2 * 5.1 + seed + 40., lw * .6).x, 0., .7);
    else f2 = vec3(sawPlant(vec2((fract(c2) - .5) / 2., y / t2), i2 * 5.1 + seed + 40., lw * 1.6).x, 0., .4);
  } else if (brush) {
    f1 = brushPlant(vec2((fract(c1 * 1.7) - .5) / 2.7, y / t1), floor(c1 * 1.7) * 7.3 + seed, lw);
    f2 = brushPlant(vec2((fract(c2 * 1.6) - .5) / 3.4, y / t2), floor(c2 * 1.6) * 5.1 + seed + 40., lw);
  } else {
    f1 = forkPlant(vec2((fract(c1) - .5) / 2., y / t1), i1 * 7.3 + seed, lw, 1. / t1);
    f2 = forkPlant(vec2((fract(c2) - .5) / 2.3, y / t2), i2 * 5.1 + seed + 40., lw, 1. / t2);
  }
  float patchN = vn2(vWp.xz * .09 + 3.), patchR = vn2(vWp.xz * .06 + 9.);
  float tk = uTassel * mix(1., .5, smoothstep(.008, .04, px)) * mix(.5, 1.3, smoothstep(.3, .75, patchR));
  f1.y *= step(h21(vec2(i1, seed + 3.) + floor(f1.z * 4.)), tk * .8); f2.y *= step(h21(vec2(i2, seed + 4.)), tk);
  float on1 = max(f1.x, f1.y), on2 = max(f2.x, f2.y);
  // k1: the foot of every clump is Sawdonia and Drepanophycus, never a blade: two ranks of short forked stems with crozier
  // tips and upright bottle-brushes, as many and as high as the fringe of shoots they replace
  float lwS = max(.026, px * 2.2);
  float uc = x * 5.3 + seed * 3.1, ui = floor(uc);
  float uh = (.2 + .2 * h21(vec2(ui, seed + 2.)) + .08 * vn2(vec2(x * 2.3 + seed, 1.))) * edge * (1. - .4 * x * x);
  float und = sawPlant(vec2((fract(uc) - .5) / 2., y / max(uh, .03)), ui * 3.7 + seed, lwS).x;
  float uc2 = x * 3.7 + seed * 5.7 + .5, ui2 = floor(uc2);
  float uh2 = (.26 + .24 * h21(vec2(ui2, seed + 6.))) * edge * (1. - .5 * x * x);
  vec2 q2 = vec2((fract(uc2) - .5) / 2., y / max(uh2, .03));
  float und2 = h21(vec2(ui2, seed + 8.)) > .5 ? sawPlant(q2, ui2 * 5.3 + seed, lwS * .8).x : brushPlant(vec2(q2.x * .5, q2.y * .7), ui2 * 5.3 + seed, lwS * .4).x;
  und = max(und, und2) * step(abs(x), .97);
  if (max(max(on1, on2), und) * step(.012, vC.y) < .5) discard;
  float low = und * (1. - max(on1, on2));
  float front = on1, hsh = mix(g2, g1, front), tas = mix(f2.y, f1.y, front);
  float hgt = clamp(mix(y / t2, y / t1, front), 0., 1.) * mix(.72, 1., front);
  vec3 green = uGreen * vec3(.76, .9, .98) * mix(.7, 1.05, smoothstep(.25, .7, patchN)) * mix(.66, 1.08, hgt) * mix(.78, 1.16, hsh) * mix(vec3(1.), vec3(.94, .98, .8), step(.72, kind)) * mix(vec3(1.), vec3(1.1, 1.04, .82), step(kind, .2));
  green = mix(green, uSpore * vec3(.7, .75, .6) + green * .45, uTassel * .38 * smoothstep(.012, .05, px) * smoothstep(.3, 1., hgt) * (1. - isMat) * smoothstep(.3, .75, patchR));      // k1b: far off the ripe tops are a soft russet bloom on the green, not a speckle
  green = mix(green, uGreen * vec3(.6, .78, .62) * mix(.7, 1.1, hgt), isMat * (1. - step(.6, mix(f2.z, f1.z, front))));          // Sawdonia is the darker green
  vec3 alb = mix(green, mix(uSpore * vec3(.74, .56, .45), green, .1 + .62 * smoothstep(.01, .07, px)), tas);          // far off the tassels are a russet haze in the green, not dots
  alb = mix(alb, uGreen * vec3(.52, .7, .56) * mix(.55, 1.05, clamp(y / max(uh2, .05), 0., 1.)) * mix(.8, 1.2, h21(vec2(ui, seed))), low);
  vec3 ray = normalize(vWp - cameraPosition + vec3(0., 1e-5, 0.));
  float back = max(dot(ray, uSunDir), 0.); back *= back;
  vec3 col = alb * (uSunCol * uSun * (.3 + .6 * back) * mix(.55, 1., hgt) + (uSky + uFill) * .8 + uWarm * (.35 + .3 * hgt));
  gl_FragColor = vec4(col * mix(.9, 1., hgt) * (1. + .42 * clamp(vK.z, -1.5, 1.5)), 1.);
  #include <fog_fragment>
}`}),R=new o.Mesh(E,he);return R.frustumCulled=!1,R.name="swardCards",{mesh:R,triangles:x}}function Sa(e,t){const{path:a}=e,r=16,c=new Float32Array(r*4),p=new Float32Array(r*4),s=new o.Vector3,n=new o.Vector3;for(let m=0;m<r;m++){const l=30+m/r*300+t.range(-8,8),u=(m%2?1:-1)*t.range(16,60)*(m%4<2?1:.6);a.posAtDist(l,s),a.tangentAtDist(l,n),c.set([s.x-n.z*u,0,s.z+n.x*u,t.range(2.2,6.5)],m*4),p.set([t.range(46,80),t(),t.range(.6,1),0],m*4)}const f=new o.InstancedBufferGeometry;f.setAttribute("position",new o.Float32BufferAttribute([-1,0,0,1,0,0,1,1,0,-1,1,0],3)),f.setIndex([0,1,2,0,2,3]),f.setAttribute("iA",new o.InstancedBufferAttribute(c,4)),f.setAttribute("iB",new o.InstancedBufferAttribute(p,4)),f.instanceCount=r;const h=new o.ShaderMaterial({uniforms:{...e.U},transparent:!0,depthWrite:!1,blending:o.CustomBlending,blendSrc:o.OneFactor,blendDst:o.OneFactor,side:o.DoubleSide,vertexShader:`
attribute vec4 iA, iB; uniform vec3 uSunDir; uniform vec4 uBank; uniform float uTime, uWindSpeed;
varying vec2 vC; varying vec3 vK;
void main(){
  float tw = fract(uTime * uWindSpeed * .004 + iB.y);
  vec3 base = vec3(iA.x, -1., iA.z) + vec3(uBank.z, 0., uBank.w) * (tw - .5) * 60.;
  vec3 c = base + uSunDir * position.y * iB.x;
  vec3 toC = cameraPosition - c; vec3 sd = cross(uSunDir, toC); float sl = length(sd);
  sd = sl > 1e-3 ? sd / sl : vec3(1., 0., 0.);
  vec3 wp = c + sd * position.x * iA.w * (1. + .5 * position.y);
  vC = vec2(position.x, position.y);
  float dist = length(cameraPosition - (base + uSunDir * iB.x * .35));
  vK = vec3(iB.z * sin(tw * 3.14159) * smoothstep(9., 30., dist) * (1. - smoothstep(150., 260., dist)), iB.y * 40., iA.w);
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
}`,fragmentShader:`
uniform vec3 uSunTint; uniform float uShaft, uTime;
varying vec2 vC; varying vec3 vK;
${Ke}
void main(){
  float x = clamp(vC.x, -1., 1.), y = clamp(vC.y, 0., 1.), e = 1. - x * x; e *= e;
  float streak = .55 + .45 * vn2(vec2(x * 2.4 + vK.y, y * 1.3 - uTime * .05 + vK.y));
  float a = e * smoothstep(0., .1, y) * (1. - smoothstep(.45, 1., y)) * streak * clamp(vK.x, 0., 2.) * uShaft;
  gl_FragColor = vec4(uSunTint * a, 0.);
}`}),C=new o.Mesh(f,h);return C.frustumCulled=!1,C.renderOrder=5.5,C.name="shafts",C}function Aa(e,t){const a=t.x+36,r=t.z+.6*45,c=52,p=19,s=[],n=[],f=[],h=12;for(let u=0;u<=h;u++){const S=u/h*2-1,x=9*(1-S*S);for(const A of[0,1])s.push(a-.6*c*S+.8*x,-1.5+A*p,r+.8*c*S+.6*x),n.push(S,A)}for(let u=0;u<h;u++){const S=u*2;f.push(S,S+2,S+1,S+1,S+2,S+3)}const C=new o.BufferGeometry;C.setAttribute("position",new o.Float32BufferAttribute(s,3)),C.setAttribute("uv",new o.Float32BufferAttribute(n,2)),C.setIndex(f);const m=new o.ShaderMaterial({uniforms:{...$e(),...e.U},fog:!0,transparent:!0,depthWrite:!0,side:o.DoubleSide,blending:o.CustomBlending,blendSrc:o.OneFactor,blendDst:o.OneMinusSrcAlphaFactor,vertexShader:`
uniform vec4 uBank; uniform float uCurtain; varying vec2 vC; varying vec3 vWp;
#include <fog_pars_vertex>
void main(){
  vec3 wp = position + vec3(uBank.z, 0., uBank.w) * uCurtain;
  vC = uv; vWp = wp;
  vec4 mvPosition = viewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
uniform vec4 uBank; uniform vec3 uSunCol; uniform float uSun, uCurtain;
varying vec2 vC; varying vec3 vWp;
#include <common>
#include <fog_pars_fragment>
${Ke}
${at}
${Ct}
void main(){
  float x = vC.x, y = vC.y;
  float torn = fbm2(vec2(x * 5. + uTime * .01, 3.7));
  float topY = .78 + .2 * torn;
  float a = (1. - smoothstep(.8, 1., abs(x))) * (1. - smoothstep(topY - .1, topY, y)) * smoothstep(0., .05, y);
  vec3 ray = vWp - cameraPosition; float dist = length(ray); ray /= max(dist, 1e-4);
  a *= smoothstep(20., 60., dist) * (1. - smoothstep(40., 150., uCurtain));
  if (a < .03) discard;
  vec3 base = skyCol(normalize(vec3(ray.x, .05, ray.z)), 0.);
  float lit = smoothstep(topY - .45, topY, y);
  vec3 col = base * mix(.94, 1.06, lit) + (uSunCol * uSun * .3) * lit * lit;
  col = mix(col, base, fogAmount(vFogDepth) * .7);
  gl_FragColor = vec4(col * a, a);
}`}),l=new o.Mesh(C,m);return l.frustumCulled=!1,l.renderOrder=4,l.name="curtain",l}function Ca(e,t){const{path:a,map:r}=e,c=Math.round(64*Math.max(e.detail,.7)),p=new Float32Array(c*4),s=new Float32Array(c*4),n=new o.Vector3,f=new o.Vector3;for(let l=0;l<c;l++){let u=0,S=0;for(let x=0;x<12;x++){const A=(l+t())/c*480-5,d=t.sign()*t.range(10,48);if(a.posAtDist(we(A,0,460),n),a.tangentAtDist(we(A,0,460),f),u=n.x-f.z*d,S=n.z+f.x*d,r.at(u,S)<7||x>8)break}p.set([u,-.5,S,t.range(9,21)],l*4),s.set([t.range(1.7,3.6),t(),t.range(.55,1),t.range(.6,1.4)],l*4)}const h=new o.InstancedBufferGeometry;h.setAttribute("position",new o.Float32BufferAttribute([-1,0,0,1,0,0,1,1,0,-1,1,0],3)),h.setIndex([0,1,2,0,2,3]),h.setAttribute("iA",new o.InstancedBufferAttribute(p,4)),h.setAttribute("iB",new o.InstancedBufferAttribute(s,4)),h.instanceCount=c;const C=new o.ShaderMaterial({uniforms:{...$e(),...e.U},fog:!0,transparent:!0,depthWrite:!1,side:o.DoubleSide,blending:o.CustomBlending,blendSrc:o.OneFactor,blendDst:o.OneMinusSrcAlphaFactor,vertexShader:`
attribute vec4 iA, iB; uniform vec4 uBank; uniform float uTime, uWindSpeed, uSq;
varying vec2 vC; varying vec3 vWp; varying vec3 vK;
#include <fog_pars_vertex>
void main(){
  float tw = fract(uTime * uWindSpeed * .006 * iB.w + iB.y);
  vec3 c = iA.xyz + vec3(uBank.z, 0., uBank.w) * (tw - .5) * 46.;
  vec3 toC = cameraPosition - c; toC.y = 0.; float l = length(toC);
  vec3 rt = l > 1e-3 ? vec3(toC.z, 0., -toC.x) / l : vec3(1., 0., 0.);
  float sq = clamp(uSq, 0., 1.);
  vec3 wp = c + rt * position.x * iA.w * (1. + .5 * sq) + vec3(0., position.y * iB.x * (1. + 1.3 * sq), 0.);      // n3: in the shower the wisps swell into a low bank, three to eight metres high
  vC = position.xy; vWp = wp; vK = vec3(iB.y * 53., iB.z * sin(tw * 3.14159), iA.w / max(iB.x, .5));
  vec4 mvPosition = viewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
uniform vec3 uSunCol; uniform float uSun, uWisp, uTear;
varying vec2 vC; varying vec3 vWp; varying vec3 vK;
#include <common>
#include <fog_pars_fragment>
${Ke}
${at}
${Ct}
void main(){
  float x = clamp(vC.x, -1., 1.), y = clamp(vC.y, 0., 1.), sd = clamp(vK.x, 0., 60.), kz = clamp(vK.z, 0., 40.);
  float torn = fbm2(vec2(x * .3 * kz + sd + uTime * .02, sd * .3));
  float topY = .4 + .58 * torn;
  float ex = 1. - x * x; ex *= ex;
  float body = ex * smoothstep(0., .22, y) * (1. - smoothstep(topY - .4, topY, y));
  float wisp = fbm2(vec2(x * .45 * kz - uTime * .05 + sd, y * 1.7 + sd + uTime * .03));
  vec3 ray = vWp - cameraPosition; float dist = length(ray); ray /= max(dist, 1e-4);
  float tear = clamp(uTear, 0., 1.);                                   // n3: as it clears the bank is eaten from inside: holes open and widen, the rest thins
  float a = body * smoothstep(.1 + .5 * tear, .75 + .2 * tear, wisp + .22) * smoothstep(7., 22., dist) * (1. - smoothstep(60., 130., dist)) * clamp(vK.y, 0., 1.) * uWisp;
  if (a < .004) discard;
  vec3 base = skyCol(normalize(vec3(ray.x, .05, ray.z)), 0.);
  float lit = smoothstep(topY - .55, topY, y);
  vec2 sh2 = uSunDir.xz / max(length(uSunDir.xz), 1e-4); float toSun = max(dot(ray.xz / max(length(ray.xz), 1e-4), sh2), 0.);
  vec3 col = base * mix(.82, 1.1, lit) * mix(.92, 1.08, wisp) + uSunCol * (.25 + uSun) * (.1 + .5 * toSun * toSun) * lit;
  col = mix(col, base, fogAmount(vFogDepth) * .6);
  gl_FragColor = vec4(clamp(col, 0., 8.) * a, a);
}`}),m=new o.Mesh(h,C);return m.frustumCulled=!1,m.renderOrder=5.2,m.name="wisps",m}export{Da as default};
