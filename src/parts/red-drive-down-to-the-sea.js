import*as A from"three";import{makeRng as xe,makeNoise as Ye,hashSeed as pe,makePath as Qe,clamp as re,lerp as K,smoothstep as C}from"../kit/core.js";const Ce=Math.PI*2,ue=e=>{const s=new A.Color(e);return[s.r,s.g,s.b]},Je=e=>{const s=Math.sin(e*127.1+311.7)*43758.5453;return s-Math.floor(s)},ye={entry:[520,30],straightEnd:[460,30],eastMouth:[220,24],bend:[130,46],westMouth:[40,6],houseCentre:[-120,-70],houseAxis:[-.865,.502],houseFront:[.5,.866],houseLength:86,houseDepth:16,frontDistance:31,lawnCorner:[-215,45],valleyAxis:[-.866,.5],valleyLength:220,beachDepth:45,ringBeyondTide:30,ringHeight:9.4,ringRadius:8.6,groundLawn:30,sill:6.6,turnRadius:45,turnLead:9,holdLength:60},Y={gravel:3,lawnEdge:4.2,lawn:5.6,head:7,valley:5,valleyLow:4.8},Ve=6,me=2.05;function mt(e,s,i,n,g,y){const P=e.tables,u=[0,0,0],o=[],l=ye.entry,d=(k,h,a)=>i.every(L=>Math.hypot(k-L.x,h-L.z)>L.r+a);for(const k of[1,-1])for(let h=-Pe+6;h<s.east-5;h+=n.range(12,19)){const a=n.range(.55,1.05),L=n.range(.3,1.8),m=P.B+Math.round(h),T=Math.min(m+2,P.n-1),D=P.X[T]-P.X[m],W=P.Z[T]-P.Z[m],V=Math.hypot(D,W)||1,G=Math.max(Ve+me*a+L,5.6+me*a+15*-h/340),R=W/V*k,v=-D/V*k,N=P.X[m]+R*G,b=P.Z[m]+v*G;!d(N,b,1.5+me*a)||e.routeDist(N,b)<Ve+me*a||o.push({x:N,z:b,r:a,m:h,d:G,great:1,nx:-R,nz:-v})}for(let k=-72;k<132;k+=2)for(let h=200;h<l[0]+Pe;h+=2){const a=h>=l[0],L=a?16:10;if(h%L||(k+72)%L)continue;const m=h+g.range(1,L-1),T=k+g.range(1,L-1),D=g(),W=g.range(.28,.6);e.routeAt(m,T,u);const V=a?Math.abs(T-l[1]):u[0],G=a?l[0]-m:u[1];(a?V<8.5+me*W+15*(m-l[0])/340||V>60:!(V>12.5&&V<60&&G<s.east-8))||D>(a?.6:.85)*y||e.woodIn(m,T)<.5||!d(m,T,2+me*W)||o.push({x:m,z:T,r:W,m:G,d:V,great:0,nx:0,nz:0})}return o}const J=[.21,1.7,.13,.6,.19,1.3,.11,2.1],Re=[.72,.92],wt=(e,s)=>.5+.5*Math.sin(e*J[0]+J[1]*Math.sin(s*J[2]+J[3]))*Math.sin(s*J[4]+J[5]*Math.sin(e*J[6]+J[7])),de=`
uniform float uTime, uFogDen;
uniform vec3 uSunDir, uSunCol, uSkyCol, uGndCol, uFogCol, uLeafFill, uPortalCol, uCloud;
uniform sampler2D tPlace;
uniform vec4 uPlaceBox, uWind, uPortal;
uniform vec2 uCanopy, uCloudOff;
float esH(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec2 esH2(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }
float esN(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(esH(i), esH(i + vec2(1., 0.)), f.x), mix(esH(i + vec2(0., 1.)), esH(i + vec2(1., 1.)), f.x), f.y);
}
float esF(vec2 p){ return esN(p) * .5 + esN(p * 2.03 + 7.1) * .3 + esN(p * 4.1 + 3.7) * .2; }
vec4 esPlace(vec3 p){ return texture2D(tPlace, clamp((p.xz - uPlaceBox.xy) * uPlaceBox.zw, 0., 1.)); }
// THE VAULT: where the place map's leaf cover is written whole (the great beeches of the drive, see the world's
// buildEstate) the wood is a vault: 1 under it, 0 everywhere else (the cut, the lawn and the valley write 0.92 at most).
// Every term of the vault below is multiplied by this measure, so where it is 0 the light is what it was, bit for bit.
// (Toward the cut's east mouth the cover is written down by an even ramp, and the measure falls with it from 1 at 33 m
// short of the mouth to 0 at 16.5 m short: no line lies across the drive.)
float esVault(vec4 pl){ return smoothstep(.935, .99, pl.r); }
// (the vault's standing gaps: gapField of this file, at the foot of the sun's ray)
float esGap(vec2 q){ return .5 + .5 * sin(q.x * ${J[0]} + ${J[1]} * sin(q.y * ${J[2]} + ${J[3]})) * sin(q.y * ${J[4]} + ${J[5]} * sin(q.x * ${J[6]} + ${J[7]})); }
// (v: the vault's measure; under it the sun comes through fewer and smaller gaps: small shifting patches of gold.
// Under a standing gap of the vault (g) the leaves let far more of it through: most of the pool's middle is lit, the
// leaves' shadows moving in it. Where v is 0, g is 0 and the law is what it was, bit for bit)
float esDapple(vec3 p, float v){
  vec2 q = p.xz - uSunDir.xz * (p.y / max(uSunDir.y, .25));
  vec2 w = uWind.xy * uWind.z;
  vec2 wob = vec2(sin(uTime * .5 + q.y * .07), cos(uTime * .43 + q.x * .06)) * .22;
  float a = esN(q * .42 + w * uTime * .11 + wob);
  float b = esN(q * 1.15 - w * uTime * .07 + 13.);
  float g = v > 0. ? .28 * v * smoothstep(${Re[0]}, ${Re[1]}, esGap(q)) : 0.;
  return smoothstep(.5 + .12 * v - g, .63 + .11 * v - g, a * .68 + b * .32);
}
// drifting cloud shadow: the field stands where this visit's dealt offset puts it and drifts 6 m a second with the wind;
// its law leaves any place in the sun for more than half of any minute (the worst minute found in the field is 0.46 in shade)
float esCloudShade(vec3 p){
  vec2 q = (p.xz + uCloudOff - uWind.xy * uTime * 6.) / max(uCloud.y, 1.);
  return 1. - uCloud.x * smoothstep(.61, .75, esF(q));
}
float esSun(vec3 p, vec4 pl){
  float top = pl.g * 80. - 10.;
  float vis = smoothstep(-1.4, 1.4, p.y - top);
  // leaves overhead count up to the height of the crowns' tops (uCanopy: where the crowns begin to thin, where they end)
  // (the vault's crowns stand 9 to 11 m higher than the rest of the wood's)
  float v = esVault(pl), cover = pl.r * (1. - smoothstep(uCanopy.x + 9. * v, uCanopy.y + 11. * v, p.y));
  return vis * mix(1., esDapple(p, v), cover) * esCloudShade(p);
}
vec3 esFill(vec3 n, vec4 pl){
  vec3 h = mix(uGndCol, uSkyCol, n.y * .5 + .5);
  h = mix(h, uLeafFill * (.76 + .24 * n.y), pl.r * .85);
  // (under the vault the shade is deep: half the light of the wood's other shade)
  h *= mix(1., .5, esVault(pl));
  h *= mix(vec3(1.), vec3(1.8, 1.08, 1.), pl.b * .6);
  return h + uSunCol * vec3(.62, .22, .18) * (pl.b * uCloud.z);
}
vec3 esPortal(vec3 p, vec3 n){
  vec3 d = uPortal.xyz - p; float l = length(d);
  float k = exp(-l * l / max(uPortal.w * uPortal.w, 1.));
  return uPortalCol * k * (.35 + .65 * clamp(dot(n, d / max(l, 1e-3)), 0., 1.));
}
vec3 esLight(vec3 albedo, vec3 n, vec3 p, float ao, float wrap){
  vec4 pl = esPlace(p);
  float ndl = clamp((dot(n, uSunDir) + wrap) / (1. + wrap), 0., 1.);
  // a cloud overhead takes the sun and some of the sky's light with it
  vec3 e = uSunCol * ndl * esSun(p, pl) + esFill(n, pl) * (ao * (.6 + .4 * esCloudShade(p))) + esPortal(p, n);
  return albedo * e * .3183;
}
vec3 esFog(vec3 c, vec3 p){
  float d = length(p - cameraPosition), f = 1. - exp(-uFogDen * uFogDen * d * d);
  float s = pow(clamp(dot(normalize(p - cameraPosition), uSunDir), 0., 1.), 6.);
  c = mix(c, uFogCol + uSunCol * .05 * s, clamp(f, 0., 1.));
  // under leaves the air is a green dusk; how much of it lies between the eye and the thing is counted along the
  // line between them, at three places on it, by the leaves over each
  // (vlt: how much of that line lies under the vault, counted at the same three places; there the dusk is a paler,
  // bluer haze and thickens sooner, so that trunk behind trunk stands paler and bluer into the wood's depth)
  float under = 0., vlt = 0.;
  for (int i = 0; i < 3; i++) {
    vec3 q = mix(cameraPosition, p, .2 + .3 * float(i));
    vec4 pq = esPlace(q); float vq = esVault(pq), low = 1. - smoothstep(uCanopy.x - 5. + 9. * vq, uCanopy.x + 3. + 11. * vq, q.y);
    under += pq.r * low; vlt += vq * low * .3333;
  }
  vec3 dusk = mix(uLeafFill * vec3(.05, .07, .045), uFogCol * vec3(.1, .15, .16), vlt);
  return mix(c, dusk, under * .3333 * (1. - exp(-d * d * 1.3e-4 * (1. + vlt))));
}
// What the air lets through of a light that stands in it at p (the vault's shafts are such a light): esFog is two
// veils, the haze and the dusk under leaves, each a mix toward the air's own colour, so of an added light the air
// passes (1 - the haze's share) times (1 - the dusk's share): esFog's answer for white less its answer for black,
// taken once. The numbers are esFog's own, line for line.
float esAir(vec3 p){
  float d = length(p - cameraPosition), f = 1. - exp(-uFogDen * uFogDen * d * d);
  float under = 0., vlt = 0.;
  for (int i = 0; i < 3; i++) {
    vec3 q = mix(cameraPosition, p, .2 + .3 * float(i));
    vec4 pq = esPlace(q); float vq = esVault(pq), low = 1. - smoothstep(uCanopy.x - 5. + 9. * vq, uCanopy.x + 3. + 11. * vq, q.y);
    under += pq.r * low; vlt += vq * low * .3333;
  }
  return (1. - clamp(f, 0., 1.)) * (1. - under * .3333 * (1. - exp(-d * d * 1.3e-4 * (1. + vlt))));
}
vec3 esSway(vec3 p, float h){
  float ph = dot(p.xz, uWind.xy) * .09 - uTime * uWind.w * .8;
  float g = sin(ph) * .6 + sin(ph * 2.3 + 1.7) * .25 + sin(p.x * .31 + p.z * .27 + uTime * 1.9) * .15;
  float a = uWind.z * .3 * clamp(h / 14., 0., 1.);
  return vec3(uWind.x * g * a, -abs(g) * a * .15, uWind.y * g * a);
}
`;function et(e={}){const s=g=>new A.Vector3(g[0],g[1],g[2]);let i=e.place;i||(i=new A.DataTexture(new Uint8Array([0,0,200,0]),1,1,A.RGBAFormat),i.needsUpdate=!0);const n=s(e.sunDir||[.53,.67,.53]).normalize();return{uTime:{value:0},uFogDen:{value:e.fogDensity??.0011},uSunDir:{value:n},uSunCol:{value:s(e.sunColor||[3.4,3.05,2.5])},uSkyCol:{value:s(e.skyColor||[.62,.92,1.36])},uGndCol:{value:s(e.groundColor||[.17,.24,.08])},uFogCol:{value:s(e.fogColor||[.48,.62,.74])},uLeafFill:{value:s(e.leafFill||[.3,.62,.2])},uPortalCol:{value:s(e.portalColor||[0,0,0])},uCloud:{value:s(e.cloud||[0,90,0])},tPlace:{value:i},uPlaceBox:{value:new A.Vector4(...e.placeBox||[0,0,1,1])},uWind:{value:new A.Vector4(...e.wind||[.966,-.259,1,1])},uPortal:{value:new A.Vector4(...e.portal||[0,-999,0,30])},uCanopy:{value:new A.Vector2(...e.canopy||[46,56])},uCloudOff:{value:new A.Vector2(...e.cloudOffset||[0,0])}}}const We=(e,s)=>{const i=e.length;if(s<=e[0][0])return e[0][1];if(s>=e[i-1][0])return e[i-1][1];let n=0;for(;s>e[n+1][0];)n++;const g=e[n][0],y=e[n+1][0],P=y-g,u=(s-g)/P,o=e[n][1],l=e[n+1][1],d=n>0?(l-e[n-1][1])/(y-e[n-1][0]):(l-o)/P,k=n<i-2?(e[n+2][1]-o)/(e[n+2][0]-g):(l-o)/P,h=u*u,a=h*u;return(2*a-3*h+1)*o+(a-2*h+u)*P*d+(-2*a+3*h)*l+(a-h)*P*k},tt=(e,s,i)=>{let n=1/0,g=!1;for(let y=0,P=i.length-1;y<i.length;P=y++){const u=i[P][0],o=i[P][1],l=i[y][0]-u,d=i[y][1]-o,k=e-u,h=s-o,a=re((k*l+h*d)/(l*l+d*d),0,1),L=k-l*a,m=h-d*a;n=Math.min(n,L*L+m*m),i[y][1]>s!=o>s&&e<l*(s-o)/d+u&&(g=!g)}return(g?-1:1)*Math.sqrt(n)},at=(e,s,i)=>{let n=1/0;for(let g=0;g<i.length-1;g++){const y=i[g][0],P=i[g][1],u=i[g+1][0]-y,o=i[g+1][1]-P,l=e-y,d=s-P,k=re((l*u+d*o)/(u*u+o*o),0,1),h=l-u*k,a=d-o*k;n=Math.min(n,h*h+a*a)}return Math.sqrt(n)},nt=[[0,30],[40,30.5],[85,30.6],[130,30.8],[175,31.2],[220,31.6],[265,32.2],[310,32.6],[360,33.2],[410,33.6],[460,34]],ot=[[-100,30],[-50,26.5],[0,22],[20,20],[220,2],[265,0],[295,-2.2],[420,-7]],Me=[[52,-30],[52,46],[-58,100],[-188,126],[-262,82],[-286,8],[-250,-96],[-170,-152],[-60,-176],[16,-136]],Pe=400;function gt(e){const s=st(e);let i=s.next();for(;!i.done;)i=s.next();return i.value}function*st(e){const s=xe(pe("route:"+e)),i=xe(pe("ground:"+e)),n=Ye(pe("estate-noise:"+e)),g=s.chance(.5)?-1:1,y=[0,1,2,3].map(()=>s.range(.56,.76)),P=i.range(0,Ce),u=i.range(0,50),o=ye,l=o.valleyAxis,d=[l[1],-l[0]],k=(B,$)=>[(B-o.lawnCorner[0])*l[0]+($-o.lawnCorner[1])*l[1],(B-o.lawnCorner[0])*d[0]+($-o.lawnCorner[1])*d[1]],h=(B,$)=>[o.lawnCorner[0]+l[0]*B+d[0]*$,o.lawnCorner[1]+l[1]*B+d[1]*$],a=h(o.valleyLength,0),L=h(o.valleyLength+o.beachDepth,0),m=h(o.valleyLength+o.beachDepth+o.ringBeyondTide,0),T=B=>30-(460-B)*(6/240),D=(B,$,X)=>T(B)+g*y[X]*($-T(B)),W=o.houseFront,V=o.houseCentre,G=o.houseAxis,R=o.frontDistance,v=o.houseLength/2,N=B=>[V[0]+W[0]*R+G[0]*B,V[1]+W[1]*R+G[1]*B],b=N(-v-o.turnLead),F=N(v),q=o.westMouth,H=o.groundLawn+o.sill,f=[b[0]-q[0],b[1]-q[1]],c=Math.hypot(f[0],f[1]),z=[f[0]/c,f[1]/c],E=Math.acos(re(z[0]*G[0]+z[1]*G[1],-1,1))/2,S=o.turnRadius*Math.tan(E),I=[G[0]-z[0],G[1]-z[1]],_=Math.hypot(I[0],I[1]),w=o.turnRadius*(1/Math.cos(E)-1),t=[b[0]-z[0]*S,b[1]-z[1]*S],r=[b[0]+I[0]/_*w,b[1]+I[1]/_*w],p=N(-v-o.turnLead+S),x=N(v+o.holdLength/2),M=N(v+o.holdLength),O=h(10,-10),j=[[o.entry[0],o.entry[1],Y.gravel],[490,30,Y.gravel],[o.straightEnd[0],o.straightEnd[1],Y.gravel],[410,D(410,42,0),Y.gravel],[360,D(360,22,1),Y.gravel],[310,D(310,38,2),Y.gravel],[265,D(265,20,3),Y.gravel],[o.eastMouth[0],o.eastMouth[1],Y.gravel],[175,35,Y.gravel],[o.bend[0],o.bend[1],Y.gravel],[85,26,Y.gravel],[o.westMouth[0],o.westMouth[1],Y.gravel],[(q[0]+t[0])/2,(q[1]+t[1])/2,Y.lawnEdge],[t[0],t[1],Y.lawn],[r[0],r[1],0,H-.4],[p[0],p[1],0,H],[F[0],F[1],0,H],[x[0],x[1],0,H],[M[0],M[1],0,H],[O[0],O[1],Y.head],[-262,78,Y.valley],[-310,112,Y.valley],[-357,134,Y.valleyLow]],U=[a,[(a[0]+m[0])/2,(a[1]+m[1])/2],m];return yield*rt({seed:e,noise:n,mirror:g,swing:y,streamPhase:P,coastPhase:u,toValley:k,fromValley:h,mouth:a,tide:L,ring:m,plan:j,level:U,front:N,fE:b,fW:F,arc0:t,arc1:p,hold2:M})}function*rt(e){const{toValley:s,plan:i,level:n}=e,g=ye;return yield*lt(e,u=>Qe(i.map((o,l)=>[o[0],u?u[l]:0,o[1]]).concat(n.map(o=>[o[0],u?g.ringHeight:0,o[1]])),{samples:1200}),(u,o)=>{const l=u.length,d=Math.ceil(l),k=Pe,h=k+d+1,a=new Float32Array(h),L=new Float32Array(h),m=new Float32Array(h),T=new A.Vector3;for(let w=0;w<h;w++)u.posAtDist(Math.min(w-k,l),T),a[w]=T.x,L[w]=T.y,m[w]=T.z;const D=-110,W=411,V=new Float32Array(W).fill(NaN);let G=NaN,R=0;for(let w=k;w<h;w++){const t=s(a[w],m[w]);if(G===G&&t[0]>G)for(let r=Math.max(0,Math.ceil(G-D));r<=Math.min(W-1,Math.floor(t[0]-D));r++)V[r]=K(R,t[1],(r+D-G)/(t[0]-G));t[0]<=G||(G=t[0],R=t[1])}let v=0;for(;v<W&&V[v]!==V[v];)v++;for(let w=0;w<W;w++)V[w]!==V[w]&&(V[w]=w<v?V[v]:V[w-1]);const b={path:u,L:l,N:d,B:k,n:h,X:a,Y:L,Z:m,lr:w=>{const t=re(w-D,0,W-1.001),r=Math.floor(t);return K(V[r],V[r+1],t-r)},routeDist:()=>0};if(!o)return b;const F=4,q=72,H=Math.min(...a)-q,f=Math.min(...m)-q,c=Math.ceil((Math.max(...a)+q-H)/F)+1,z=Math.ceil((Math.max(...m)+q-f)/F)+1,E=new Int32Array(c*z).fill(-1),S=new Float32Array(c*z).fill(1e9),I=Math.ceil(q/F);for(let w=0;w<h;w+=3){const t=Math.round((a[w]-H)/F),r=Math.round((m[w]-f)/F);for(let p=Math.max(0,r-I);p<=Math.min(z-1,r+I);p++)for(let x=Math.max(0,t-I);x<=Math.min(c-1,t+I);x++){const M=H+x*F-a[w],O=f+p*F-m[w],j=M*M+O*O,U=p*c+x;j<S[U]&&(S[U]=j,E[U]=w)}}b.routeAt=(w,t,r)=>{const p=Math.round((w-H)/F),x=Math.round((t-f)/F),M=p>=0&&x>=0&&p<c&&x<z?E[x*c+p]:-1;if(M<0||S[x*c+p]>q*q)return r[0]=q,r[1]=NaN,r[2]=0,r;let O=1e9,j=0,U=0;for(let B=Math.max(0,M-5);B<Math.min(h-1,M+5);B++){const $=a[B+1]-a[B],X=m[B+1]-m[B],te=w-a[B],ne=t-m[B],le=$*$+X*X,Z=re((te*$+ne*X)/le,0,1),oe=te-$*Z,ee=ne-X*Z,ae=oe*oe+ee*ee;ae<O&&(O=ae,j=B-k+Z,U=(te*X-ne*$)/Math.sqrt(le))}return r[0]=Math.sqrt(O),r[1]=j,r[2]=U,r};const _=[0,0,0];return b.routeDist=(w,t)=>b.routeAt(w,t,_)[0],b.metreOf=(w,t)=>{let r=1e18,p=0;for(let x=k;x<h;x++){const M=(a[x]-w)**2+(m[x]-t)**2;M<r&&(r=M,p=x)}return p-k},b})}function*lt(e,s,i){const{noise:n,toValley:g,fromValley:y,plan:P}=e,u=ye,o=s(null);yield;let l=i(o,!1);yield;const d=[Math.min(...Me.map(t=>t[0]))-12,Math.min(...Me.map(t=>t[1]))-12,Math.max(...Me.map(t=>t[0]))+12,Math.max(...Me.map(t=>t[1]))+12],k=(t,r)=>t<=d[0]||r<=d[1]||t>=d[2]||r>=d[3]?0:1-C(-6,10,tt(t,r,Me)),h=t=>K(6.5,35,C(196,230,t)),a=t=>K(60,38.5,C(-10,45,t))-22.5*C(204,250,t),L=t=>l.lr(t)+7+1.3*Math.sin(t*.085+e.streamPhase)+.6*Math.sin(t*.27+2*e.streamPhase),m=(t,r)=>t<=206?0:C(206,236,t)*(4.5*n.n2(t*.075+1.7,r?3.1:7.9)+2*n.n2(t*.21+4.2,r?5.5:9.3)),T=(t,r,p)=>{const x=C(33,46,p)*(1-C(78,108,p));return 243+14*n.n2(r*.012+e.coastPhase,.5)+(x>0?x*(110+12*n.n2(r*.05,3.3)):0)},D=t=>C(-40,10,t)*(1-C(110,170,t)),W=(t,r)=>K(K(-30,-75,C(-50,40,t)),-93,C(110,170,t))-r,V=(t,r)=>C(-85,-45,t)*C(0,14,W(t,r)),G=(t,r)=>C(-85,-45,t)*C(112,138,W(t,r)+9*n.n2(t*.021+e.coastPhase,6.1)),R=Be(e.seed).falls,v=t=>R.reduce((r,p)=>r+.75*(C(p-14,p-.3,t)-C(p-.3,p+.5,t)),0),N=t=>C(R[1]+.3,R[1]+2,t)-C(R[1]+7,R[1]+11,t),b=(t,r)=>{const p=We(nt,t),x=g(t,r),M=x[0],O=x[1],j=C(-135,-100,M),U=C(7,24,l.routeDist(t,r)),B=U>0?1-k(t,r):0,$=B>0?.9*n.fbm2(t*.011+3.1,r*.011-1.7,2)*U*B:0;if(j<=0)return p+$;const X=l.lr(M)+2.5,te=Math.abs(O-X),ne=We(ot,M),le=O>X?1:-1;let Z=M<=0?p:30-14*C(40,260,M)+2*le*C(60,240,M);Z+=$+(M>20?1.3*C(20,60,M)*n.fbm2(t*.03+9.2,r*.03+4.4,2):0);const oe=V(M,O);le<0&&(Z=K(Z,ne+7,D(M))),oe>0&&(Z=K(Z,Z*(1-1.03*(1-Math.exp(-Math.max(0,W(M,O))/45))),oe));const ee=T(M,O,te),ae=(1-C(ee-20,ee+5,M))*(1-G(M,O)),Q=te+m(M,le>0),ie=C(214,246,M)*ae*C(h(M)+2,h(M)+12,Q),we=ie>0?ie*(2.4*(1-Math.abs(n.n2(t*.07+5.3,r*.07-2.1)))-1.2+.9*(1-Math.abs(n.n2(t*.19-1.4,r*.19+8.8)))):0;Z=K(-3.5-.02*Math.max(0,M-ee),Z*(1-.45*C(275,362,M)),ae);let ce=ne+(Z-ne)*C(0,1,(Q-h(M))/a(M))+we;if(M>12&&M<266){const ge=Math.abs(O-L(M));ce-=.7*(1-C(.5,2.1,ge))*C(12,22,M)*(1-.6*C(222,250,M)),ce+=(v(M)-.35*N(M))*(1-C(2.4,4.8,ge))}return K(p+$,ce,j)},F=P.map(t=>t.length>3?t[3]:b(t[0],t[1])+t[2]),q=s(F);yield,l=i(q,!0),yield;const H=l.path,f=[0,0,0],c={straight:l.metreOf(u.straightEnd[0],u.straightEnd[1]),east:l.metreOf(u.eastMouth[0],u.eastMouth[1]),bend:l.metreOf(u.bend[0],u.bend[1]),west:l.metreOf(u.westMouth[0],u.westMouth[1]),turn:l.metreOf(e.arc0[0],e.arc0[1]),onFront:l.metreOf(e.arc1[0],e.arc1[1]),houseW:l.metreOf(e.fW[0],e.fW[1]),holdEnd:l.metreOf(e.hold2[0],e.hold2[1]),corner:l.metreOf(u.lawnCorner[0],u.lawnCorner[1]),mouth:l.metreOf(e.mouth[0],e.mouth[1])},z=g(e.hold2[0],e.hold2[1])[0];c.head=c.holdEnd;const E=[[e.arc0[0],e.arc0[1]],[e.arc0[0]-13,e.arc0[1]-12],[-63,-78],[-70,-92]],S=[-72,-97,9],I=(t,r,p)=>{l.routeAt(t,r,f);const x=f[1]===f[1]&&f[1]<=c.turn+.5,M=x?C(c.east-14,c.east+6,f[1]):1,O=x?1.75+.15*Math.sin(f[1]*.063+e.streamPhase):2.5;let j=x?f[0]:1e3,U=K(K(O,3.5,M),2.5,x?C(c.west,c.west+40,f[1]):1);if(t<e.arc0[0]+12&&r<-30){const B=at(t,r,E),$=Math.hypot(t-S[0],r-S[1])-S[2]+2.5,X=Math.min(B,$);X<j&&(j=X,U=2.5)}return p[0]=j,p[1]=U,p},_=t=>C(c.east-2,c.east+6,t)*(1-C(c.west-6,c.west+2,t)),w=(t,r)=>{l.routeAt(t,r,f);const p=f[1]===f[1]?_(f[1])*(1-C(36,44,f[0])):0,x=g(t,r),M=l.lr(x[0])+2.5,O=Math.abs(x[1]-M),j=C(-12,6,x[0])*(1-C(50,62,O)),U=Math.max(C(T(x[0],x[1],O)-34,T(x[0],x[1],O)-22,x[0]),C(222,232,x[0]));return(1-k(t,r))*(1-p)*(1-j)*(1-U)*(1-V(x[0],x[1]))*(1-(x[1]<M?D(x[0]):0))};return{seed:e.seed,noise:n,toValley:g,fromValley:y,tide:e.tide,ring:e.ring,path:H,tables:l,places:c,headS:z,ground:b,lawnIn:k,woodIn:w,seaFall:V,cutSpan:_,drive:I,floorHalf:h,flankInset:m,streamAt:L,falls:R,pool:N,sweep:E,forecourt:S,routeAt:l.routeAt,routeDist:l.routeDist,lr:l.lr}}async function it(e,s){const i=e.rng,n=e.line,g=e.side,y=g===0,P=!!e.heavy,u=n.length,o=[0];for(let f=1;f<u;f++)o.push(o[f-1]+Math.hypot(n[f][0]-n[f-1][0],n[f][1]-n[f-1][1]));const l=o[u-1],d=e.cell||.95,k=Math.max(4,Math.round(l/d)),h=e.rows||28,a=e.foot||(()=>11),L=e.thick||(()=>12),m=e.tall||(()=>1),T=e.lean??5.5,D=e.domeHalf||[4,8],W=e.domeHigh||[12,16],V=[];for(let f=-D[0]*.4;f<l+D[0]*.4;){const c=i.range(D[0],D[1]),z=f+c*.85;V.push({c:z,r:c,h:i.range(W[0],W[1]),b:i.range(0,1.8)*(y?.4:1)}),f+=c*i.range(1.5,1.8)}const G=[],R=Math.round(l*(e.lumps??.6))+(y?6:0);for(let f=0;f<R;f++)G.push({s:i.range(0,l),t:i.range(.08,y?2.9:2.2),r:i.range(1.8,3.6),a:i.range(.45,1.15)*(i.chance(.22)?-.8:1)*(e.lumpAmp??1)});const v=i.range(0,100),N=(f,c)=>{const z=Math.floor(f),E=Math.floor(c),S=f-z,I=c-E,_=S*S*(3-2*S),w=I*I*(3-2*I),t=(r,p)=>Je(r*57.3+p*131.7+v);return K(K(t(z,E),t(z+1,E),_),K(t(z,E+1),t(z+1,E+1),_),w)},b=f=>{let c=0;for(;c<u-2&&o[c+1]<f;)c++;const z=re((f-o[c])/Math.max(o[c+1]-o[c],1e-6),0,1),E=n[c+1][0]-n[c][0],S=n[c+1][1]-n[c][1],I=Math.hypot(E,S)||1;return[K(n[c][0],n[c+1][0],z),K(n[c][1],n[c+1][1],z),E/I,S/I]},F=h+1,q=[],H=f=>Math.PI*Math.pow(f/h,y?1:1.3);for(let f=0;f<=k;f++){const c=l*f/k,z=b(c),E=g>=0?1:-1,S=z[3]*E,I=-z[2]*E;let _=0,w=0,t=0;for(const X of V){const te=Math.sqrt(Math.max(0,1-((c-X.c)/(1.15*X.r))**2));te>_&&(_=te),w=Math.max(w,X.h*(.7+.3*te)),t=Math.max(t,X.b*te)}const r=L(c),p=Math.min(r*.5,6.5),x=Math.min(c,l-c),M=Math.sqrt(Math.max(0,1-(1-re(x/p,0,1))**2)),O=Math.max(M,.04),j=r*(.78+.22*_)*O,U=w*m(c)*(.25+.75*O),B=y?0:a(c)+r*.5,$=G.filter(X=>Math.abs(X.s-c)<X.r*2);q.push({s:c,x:z[0],z:z[1],ox:S,oz:I,tx:z[2],tz:z[3],w:j,h:U,c:B,km:_,bul:t*O,e:M,near:$,hol:1-C(.25,.75,_)})}return s&&await s(),ct({o:e,rng:i,bush:y,heavy:P,ns:k,NT:h,NV:F,cols:q,th:H,vn:N,leanM:T,LEN:l,feet:e.feet||[.7,1.9]},s)}async function ct(e,s){const{o:i,bush:n,heavy:g,ns:y,NT:P,NV:u,cols:o,th:l,vn:d,leanM:k}=e,h=(y+1)*u,a=new Float32Array(h*3),L=new Float32Array(h*3),m=new Float32Array(h*2),T=new Float32Array(h*4),D=new Float32Array(h*2),W=i.groundAt||(()=>0),V=i.sink??.25,G=[];for(let R=0;R<u;R++){const v=l(R),N=Math.cos(v);G.push([v,Math.sign(N)*Math.pow(Math.abs(N),.6),Math.pow(Math.sin(v),.55),1-C(1.22,2.27,v),n?1:1-C(1.4,2.4,v)])}for(let R=0;R<=y;R++){const v=o[R],N=v.w*.5,b=W(v.x+v.ox*(v.c-N),v.z+v.oz*(v.c-N)),F=W(v.x+v.ox*(v.c+N),v.z+v.oz*(v.c+N));let q=0;for(let H=0;H<u;H++){const f=G[H],c=f[0],z=R*u+H;let E=-N*f[1],S=v.h*f[2];n||(E-=k*v.e*Math.pow(S/Math.max(v.h,.1),1.4)*f[3]);const I=S-.3*v.h,_=Math.hypot(E,I)||1;let w=0;for(const p of v.near){const x=((v.s-p.s)/p.r)**2+((c-p.t)*11/p.r)**2;x<6&&(w+=p.a*Math.exp(-x))}const t=(v.bul*f[4]*Math.pow(Math.sin(Math.PI*re(S/Math.max(v.h,.1),0,1)),.7)+w+.3*(d(v.s*.55,c*6)-.5)+.18*(d(v.s*1.7,c*19)-.5))*v.e;E+=E/_*t,S=Math.max(0,S+Math.max(I/_,-.2)*t);const r=K(b,F,re((E+N)/Math.max(v.w,.1),0,1));a[z*3]=v.x+v.ox*(v.c+E),a[z*3+1]=r+S-V,a[z*3+2]=v.z+v.oz*(v.c+E),H>0&&(q+=Math.hypot(a[z*3]-a[z*3-3],a[z*3+1]-a[z*3-2],a[z*3+2]-a[z*3-1])),m[z*2]=v.s+(i.uvOffset||0),m[z*2+1]=q,D[z*2]=S,D[z*2+1]=re(-Math.min(0,w)/.8,0,1)}}s&&await s();for(let R=0;R<=y;R++)for(let v=0;v<u;v++){const N=R*u+v,b=o[R],F=(Math.min(y,R+1)*u+v)*3,q=(Math.max(0,R-1)*u+v)*3,H=(R*u+Math.min(P,v+1))*3,f=(R*u+Math.max(0,v-1))*3,c=a[F]-a[q],z=a[F+1]-a[q+1],E=a[F+2]-a[q+2],S=a[H]-a[f],I=a[H+1]-a[f+1],_=a[H+2]-a[f+2];let w=I*E-_*z,t=_*c-S*E,r=S*z-I*c;const p=Math.hypot(w,t,r)||1;w/=p,t/=p,r/=p;const x=b.x+b.ox*b.c,M=b.z+b.oz*b.c,O=D[N*2];w*(a[N*3]-x)+t*(O-.3*b.h)+r*(a[N*3+2]-M)<0&&(w=-w,t=-t,r=-r),L[N*3]=w,L[N*3+1]=t,L[N*3+2]=r;const j=n?0:C(.15,.55,w*b.ox+r*b.oz)*(1-C(.55,.85,t)),U=D[N*2+1],B=C(e.feet[0],e.feet[1],O),$=B*(1-.85*Math.max(b.hol*b.e,U*.8));T[N*4]=(1-j)*(g?1:n?B:$),T[N*4+1]=(.68+.32*C(0,6,O))*(1-.4*b.hol)*(1-.45*U),T[N*4+2]=C(.62,.97,O/Math.max(b.h,1)),T[N*4+3]=O}return s&&await s(),ht({...e,n:h,pos:a,nor:L,uv:m,mask:T,aux:D},s)}async function ht(e,s){const{o:i,rng:n,heavy:g,ns:y,NT:P,NV:u,cols:o,LEN:l,pos:d,nor:k,uv:h,mask:a}=e,L=Math.max(1,Math.round((i.chunk||30)/(l/y))),m=[],T=(i.perM2??1.5)*(g?1.12:1),D=i.leafM2??1.9,W=(i.headSize||[.42,.62]).map(p=>p*(g?1.15:1)),V=i.thin&&i.lineDist?i.thin:null,G=i.headNear??16,R=i.headFar??30,v=new A.Matrix4,N=new A.Quaternion,b=new A.Quaternion,F=new A.Vector3,q=new A.Vector3,H=new A.Vector3(0,1,0),f=new A.Vector3,c=Math.floor(y/2)*u+Math.floor(P/3),z=d[(c+u)*3]-d[c*3],E=d[(c+u)*3+1]-d[c*3+1],S=d[(c+u)*3+2]-d[c*3+2],I=d[(c+1)*3]-d[c*3],_=d[(c+1)*3+1]-d[c*3+1],w=d[(c+1)*3+2]-d[c*3+2],t=(E*w-S*_)*k[c*3]+(S*I-z*w)*k[c*3+1]+(z*_-E*I)*k[c*3+2]<0;for(let p=0,x=0;p<y;p+=L){const M=Math.min(y,p+L),O=M-p+1,j=new A.BufferGeometry,U=p*u,B=(M+1)*u;j.setAttribute("position",new A.BufferAttribute(d.slice(U*3,B*3),3)),j.setAttribute("normal",new A.BufferAttribute(k.slice(U*3,B*3),3)),j.setAttribute("aUv",new A.BufferAttribute(h.slice(U*2,B*2),2)),j.setAttribute("aMask",new A.BufferAttribute(a.slice(U*4,B*4),4));const $=[],X=[],te=[],ne=[],le=[];for(let Z=0;Z<O-1;Z++)for(let oe=0;oe<P;oe++){s&&oe===0&&++x%48===0&&await s();const ee=Z*u+oe,ae=ee+u;t?$.push(ee,ee+1,ae,ae,ee+1,ae+1):$.push(ee,ae,ee+1,ee+1,ae,ae+1);const Q=U+ee,ie=Q+u,we=ie+1,ce=Q+1,ge=Math.hypot(d[ie*3]-d[Q*3],d[ie*3+1]-d[Q*3+1],d[ie*3+2]-d[Q*3+2])*Math.hypot(d[ce*3]-d[Q*3],d[ce*3+1]-d[Q*3+1],d[ce*3+2]-d[Q*3+2]),qe=(a[Q*4]+a[ie*4]+a[we*4]+a[ce*4])/4,Ee=(a[Q*4+2]+a[we*4+2])/2,Ge=o[p+Z].ox*k[Q*3]+o[p+Z].oz*k[Q*3+2]>.45&&!e.bush,De=Math.floor(ge*T*qe*(1+.5*Ee)+n()),He=Math.floor(ge*D*(1-qe)*(Ge?.3:1)+n());for(let Fe=0;Fe<De+He;Fe++){const be=n(),ke=n(),Oe=(1-be)*(1-ke),Ie=be*(1-ke),_e=be*ke,je=(1-be)*ke,ve=Fe<De,se=(he,ze,Ae)=>he[Q*ze+Ae]*Oe+he[ie*ze+Ae]*Ie+he[we*ze+Ae]*_e+he[ce*ze+Ae]*je,fe=ve?.42:.8,Ue=ve?n.range(.1,.3):n.range(0,.25),Te=ve?n.range(W[0],W[1]):n.range(.75,1.25),$e=n.range(0,Ce),Xe=n.range(.78,1.16);if(f.set(se(k,3,0)+n.range(-fe,fe),se(k,3,1)+n.range(-fe,fe),se(k,3,2)+n.range(-fe,fe)).normalize(),ve&&se(a,4,0)<.4||(N.setFromUnitVectors(H,f).multiply(b.setFromAxisAngle(H,$e)),F.set(se(d,3,0),se(d,3,1),se(d,3,2)).addScaledVector(f,Ue),V&&V()<C(G,R,i.lineDist(F.x,F.z))))continue;v.compose(F,N,q.set(Te,Te,Te));const Ze=ve?X:ne,Ke=ve?te:le;for(let he=0;he<16;he++)Ze.push(v.elements[he]);Ke.push(Xe,se(a,4,2),se(a,4,1),se(a,4,3))}}j.setIndex($),j.computeBoundingSphere(),m.push({geometry:j,heads:new Float32Array(X),headTint:new Float32Array(te),leaves:new Float32Array(ne),leafTint:new Float32Array(le),sphere:j.boundingSphere})}s&&await s();const r=[];for(let p=0;p<=y;p+=2){const x=p*u+Math.round(P*.5);r.push([d[x*3],d[x*3+1],d[x*3+2],o[p].ox,o[p].oz])}return{chunks:m,length:l,edge:r,eachVertex:p=>{for(let x=0;x<e.n;x++)p(d[x*3],d[x*3+1],d[x*3+2])}}}const Le=`
varying vec3 vW, vN, vP; varying vec2 vUv2; varying vec4 vMask;
`,Se=`
// nearest flower cell: xy = offset to its middle, z = its own number, w = how near the seam to the next cell
vec4 esCell(vec2 p){
  vec2 ip = floor(p), fp = fract(p), bo = vec2(0.); float b1 = 9., b2 = 9., id = 0.;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){
    vec2 g = vec2(float(i), float(j)), d = g + esH2(ip + g) * .76 + .12 - fp; float dd = dot(d, d);
    if (dd < b1){ b2 = b1; b1 = dd; bo = d; id = esH(ip + g + 3.7); } else if (dd < b2) b2 = dd;
  }
  return vec4(bo, id, sqrt(b2) - sqrt(b1));
}
// one flower head's own pattern at l (-1..1 across the head): lobes of the trumpets, a darker throat, a rim
float esHead(vec2 l, float id){
  float r = length(l), a = atan(l.y, l.x + 1e-4);
  float lobes = .5 + .5 * cos(a * 5. + id * 40.) * cos(r * 9. + id * 9.);
  float k = mix(.8, 1.1, smoothstep(.2, .85, lobes) * smoothstep(.2, .55, r));
  k *= mix(.5, 1., smoothstep(.02, .32, r));
  return k * mix(1., .72, smoothstep(.8, 1.02, r));
}
`,Ne=Se+`
uniform vec3 uRed, uRedThru, uLeafCol, uRose; uniform float uThru, uFull, uHeadR, uBush;
varying vec3 vW, vN, vP; varying vec2 vUv2; varying vec4 vMask;
vec3 esThrough(vec3 n, vec3 p, float thin){
  vec3 v = normalize(cameraPosition - p);
  float toward = pow(clamp(dot(-v, uSunDir) * .5 + .5, 0., 1.), 3.);
  float behind = clamp(.35 - dot(n, uSunDir), 0., 1.);
  return uRedThru * uSunCol * (uThru * thin * toward * behind * esCloudShade(p) * .3183);
}
`;function ut(e,s={}){const i={uRed:{value:new A.Vector3(...ue(s.red||"#b0101c")).multiplyScalar(s.redGain??1.2)},uRedThru:{value:new A.Vector3(...ue(s.through2||"#e02a2a"))},uLeafCol:{value:new A.Vector3(...ue(s.leaf||"#27502c"))},uThru:{value:s.through??1.5},uRose:{value:new A.Vector3(...ue(s.rose||"#d63a52"))},uFull:{value:s.heavy?1.3:s.full??.64},uHeadR:{value:s.headR??.36},uBush:{value:s.bush?1:0}},n={...e,...i},g=new A.ShaderMaterial({uniforms:n,fog:!1,vertexShader:de+Le+`
      attribute vec2 aUv; attribute vec4 aMask;
      void main(){
        vec4 wp = modelMatrix * vec4(position, 1.);
        vP = wp.xyz;
        wp.xyz += esSway(wp.xyz, aMask.w);
        vW = wp.xyz; vN = normalize(mat3(modelMatrix) * normal); vUv2 = aUv; vMask = aMask;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:de+Ne+`
      void main(){
        vec3 n = normalize(vN), t = normalize(cross(n, vec3(0., 1., 0.)) + vec3(1e-4, 0., 0.)), b = cross(t, n);
        float dist = length(vW - cameraPosition), near = 1. - smoothstep(70., 190., dist);
        // a bank's flowers are laid out by its own metres (along it, up its face); a free-standing bush's by where it stands
        vec2 q = vUv2;
        if (uBush > .5) q = abs(n.y) > .62 ? vP.xz : (abs(n.x) > abs(n.z) ? vP.zy : vP.xy);
        vec4 c = esCell(q / .44);
        vec2 l = c.xy / .52;
        float isFlower = smoothstep(.36, .6, vMask.x * uFull + (c.z - .5) * .5);
        // between two heads the leaves under them show
        isFlower *= mix(.3 + uHeadR, 1. - smoothstep(uHeadR, uHeadR + .16, length(c.xy) + (esN(q * 9.) - .5) * .12), near);
        // the painted flower: every cell a domed head of its own tone and tilt, a dark seam between heads
        float tone = .66 + .56 * esH(vec2(c.z * 91.7, 3.1));
        vec3 petal = mix(uRed, uRose, smoothstep(.45, 1., esH(vec2(c.z * 17.3, 5.))) * .7) * tone;
        float pat = mix(1., esHead(l, c.z) * mix(.45, 1., smoothstep(.0, .1, c.w)), near);
        vec3 nf = normalize(n - (t * l.x + b * l.y) * (.85 * near) + (t * (esH(vec2(c.z, 7.)) - .5) + b * (esH(vec2(c.z, 9.)) - .5)) * (.5 * near));
        vec3 v = normalize(cameraPosition - vW);
        vec3 red = esLight(petal * pat, nf, vW, vMask.y, .4) + esThrough(nf, vW, vMask.z) * uRed.r * 1.6 * pat;
        red += uSkyCol * (.035 * pow(1. - clamp(dot(nf, v), 0., 1.), 2.)) * vMask.y;
        // the leaf: dark whorls with the sky's sheen on their upper faces
        vec4 lc = esCell(q / .34 + 17.);
        float blade = .5 + .5 * cos(atan(lc.y, lc.x + 1e-4) * 7. + lc.z * 30.);
        vec3 nl = normalize(n + (t * lc.x + b * lc.y) * (1.1 * near));
        vec3 leaf = esLight(uLeafCol * mix(1., .55 + .9 * blade, near), nl, vW, vMask.y * mix(1., smoothstep(0., .14, lc.w) * .6 + .4, near), .2);
        leaf += uSkyCol * (.05 * pow(1. - clamp(dot(nl, v), 0., 1.), 3.) + .03 * clamp(nl.y, 0., 1.)) * vMask.y;
        gl_FragColor = vec4(esFog(mix(leaf, red, isFlower), vW), 1.);
      }`});return dt(n,g)}function dt(e,s){const i=`
    attribute vec4 aTint; varying vec2 vL; varying vec4 vTint;
    void main(){
      mat4 im = modelMatrix * instanceMatrix;
      vec3 org = im[3].xyz;
      vec4 wp = im * vec4(position, 1.);
      wp.xyz += esSway(org, aTint.w) + normalize(mat3(im) * vec3(0., 1., 0.)) * (.035 * min(aTint.w, 1.) * sin(uTime * 2.1 + aTint.x * 50.));
      vW = wp.xyz; vP = org; vN = normalize(mat3(im) * normal); vL = position.xz * 2.; vTint = aTint; vUv2 = vec2(0.); vMask = vec4(0.);
      gl_Position = projectionMatrix * viewMatrix * wp;
    }`,n=new A.ShaderMaterial({uniforms:e,fog:!1,side:A.DoubleSide,vertexShader:de+Le+i,fragmentShader:de+Ne+`
      varying vec2 vL; varying vec4 vTint;
      void main(){
        vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
        float near = 1. - smoothstep(70., 190., length(vW - cameraPosition));
        float pat = mix(.93, esHead(vL, vTint.x), near);
        float hh = fract(vTint.x * 37.7);
        vec3 petal = mix(uRed, uRose, smoothstep(.45, 1., hh) * .7) * (.66 + .56 * fract(vTint.x * 91.3));
        // one truss in seven is still in bud: darker, closer, a point of deeper red at its middle
        float bud = step(.857, fract(vTint.x * 53.3));
        petal = mix(petal, petal * vec3(.6, .42, .5), bud * smoothstep(.15, .6, length(vL)));
        vec3 v = normalize(cameraPosition - vW);
        vec3 c = esLight(petal * pat, n, vW, vTint.z, .45) + esThrough(n, vW, vTint.y) * uRed.r * 1.6 * pat;
        c += uSkyCol * (.035 * pow(1. - clamp(dot(n, v), 0., 1.), 2.)) * vTint.z;
        gl_FragColor = vec4(esFog(c, vW), 1.);
      }`}),g=new A.ShaderMaterial({uniforms:e,fog:!1,side:A.DoubleSide,vertexShader:de+Le+i,fragmentShader:de+Ne+`
      varying vec2 vL; varying vec4 vTint;
      void main(){
        float r = length(vL), a = atan(vL.y, vL.x + 1e-4);
        float lobe = pow(clamp(.5 + .5 * cos(a * 7. + vTint.x * 30.), 0., 1.), .4);
        if (r > .22 + .76 * lobe) discard;
        vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
        vec3 v = normalize(cameraPosition - vW);
        float rib = 1. - smoothstep(.0, .12, abs(sin(a * 3.5 + vTint.x * 15.)));
        vec3 c = esLight(uLeafCol * vTint.x * (.9 + .5 * rib + .5 * r), n, vW, vTint.z, .25);
        c += uSkyCol * (.05 * pow(1. - clamp(dot(n, v), 0., 1.), 3.) + .035 * clamp(n.y, 0., 1.)) * vTint.z;
        gl_FragColor = vec4(esFog(c, vW), 1.);
      }`}),y=[0,.3,0],P=[0,1,0],u=[];for(let h=0;h<6;h++){const a=h/6*Ce;y.push(Math.cos(a)*.52,-.04,Math.sin(a)*.52),P.push(Math.cos(a)*.8,.6,Math.sin(a)*.8),u.push(0,1+(h+1)%6,1+h)}const o=new A.BufferGeometry;o.setAttribute("position",new A.Float32BufferAttribute(y,3)),o.setAttribute("normal",new A.Float32BufferAttribute(P,3)),o.setIndex(u);const l=new A.BufferGeometry;l.setAttribute("position",new A.Float32BufferAttribute([-.5,0,-.5,.5,0,-.5,.5,0,.5,-.5,0,.5],3)),l.setAttribute("normal",new A.Float32BufferAttribute([0,1,0,0,1,0,0,1,0,0,1,0],3)),l.setIndex([0,2,1,0,3,2]);const d=(h,a,L,m,T)=>{const D=h.clone(),W=L.length/16,V=new A.InstancedMesh(D,a,Math.max(W,1));return D.setAttribute("aTint",new A.InstancedBufferAttribute(W?m:new Float32Array(4),4)),W&&(V.instanceMatrix=new A.InstancedBufferAttribute(L,16)),V.count=W,V.boundingSphere=new A.Sphere(T.center.clone(),T.radius+2),V};return{mass:s,head:n,leaf:g,uniforms:e,headGeometry:o,leafGeometry:l,assemble:h=>{const a=new A.Group,L=[];for(const m of h.chunks){const T=new A.Mesh(m.geometry,s),D=d(o,n,m.heads,m.headTint,m.sphere),W=d(l,g,m.leaves,m.leafTint,m.sphere);a.add(T,D,W),L.push({mass:T,heads:D,leaves:W,sphere:m.sphere})}return{group:a,parts:L,triangles:h.chunks.reduce((m,T)=>m+T.geometry.index.count/3+T.heads.length*6/16+T.leaves.length/8,0)}}}}const vt=`
uniform vec3 uGravel, uGrassA, uGrassB, uFallen;
vec3 esGravel(vec2 p){
  float n = esN(p * 9.) * .5 + esN(p * 23.) * .5, big = esN(p * .6 + 4.);
  float rake = .5 + .5 * sin(p.x * 3.1 + p.y * 28. + esN(p * .9) * 5.);
  return uGravel * (.8 + .3 * n) * (.9 + .16 * big) * (.96 + .06 * rake);
}
vec3 esGrass(vec2 p){
  float n = esN(p * 5.) * .55 + esN(p * 19.) * .45;
  return mix(uGrassA, uGrassB, n) * (.85 + .3 * esN(p * .8 + 9.));
}
float esFallenAt(vec2 p, float red){
  vec4 c = esCell(p / .17);
  float r = length(c.xy);
  // (where nothing lies, red is 0 and no cell may show: a cell's own number can be 0 too)
  return step(c.z, red * .9 - .003) * (1. - smoothstep(.28, .5, r)) * (.7 + .3 * esH(vec2(c.z * 31., 2.)));
}
vec3 esDriveAlbedo(vec2 p, float d, float hw, float red){
  float edge = hw + (esN(p * 1.3) - .5) * .5;
  vec3 a = mix(esGravel(p), esGrass(p), smoothstep(edge - .12, edge + .16, d));
  float near = 1. - smoothstep(25., 70., length(vec3(p.x, 0., p.y) - vec3(cameraPosition.x, 0., cameraPosition.z)));
  float f = mix(red * .45, esFallenAt(p, red), near);
  return mix(a, uFallen * (.75 + .5 * esH(floor(p / .17))), f);
}
`,ft=()=>({uGravel:{value:new A.Vector3(...ue("#d9cdb4"))},uGrassA:{value:new A.Vector3(...ue("#3d6a2c"))},uGrassB:{value:new A.Vector3(...ue("#6a9a3c"))},uFallen:{value:new A.Vector3(...ue("#a0141e"))}});async function xt(e,s={}){const i=e.seed??1,n=new A.Group,g=s.length||60,y=xe(pe("bank-left:"+i)),P=xe(pe("bank-right:"+i)),u=s.uniforms||et({}),o=ut(u,{heavy:!!s.heavy});u.uCloud.value.z=1;const l=[];for(let a=g/2;a>=-g/2;a-=1)l.push([0,a]);const d=[];for(const[a,L,m]of[[1,y,0],[-1,P,500]]){const T=await it({line:l,side:a,rng:L,heavy:!!s.heavy,uvOffset:m,foot:()=>11,thick:()=>12,chunk:30},e.yield),D=o.assemble(T);n.add(D.group),d.push(D)}const k={...u,...ft()},h=new A.Mesh(new A.PlaneGeometry(64,g+30,1,1).rotateX(-Math.PI/2),new A.ShaderMaterial({uniforms:k,fog:!1,vertexShader:"varying vec3 vW; void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }",fragmentShader:de+Se+vt+`
      varying vec3 vW;
      void main(){
        float d = abs(vW.x), red = mix(.1, .7, smoothstep(2., 10.5, d)) * (1. - smoothstep(12., 15., d));
        vec3 c = esLight(esDriveAlbedo(vW.xz, d, 3.5, red), vec3(0., 1., 0.), vW, 1., 0.);
        gl_FragColor = vec4(esFog(c, vW), 1.);
      }`}));return h.position.y=.02,n.add(h),{object:n,radius:34,height:16,center:new A.Vector3(0,6,0),ground:!0,groundY:0,banks:d,uniforms:u,update(a,L){u.uTime.value=L}}}function Be(e){const s=xe(pe("stones:"+e)),i=[];for(let y=20;y<215;y+=s.range(22,28))i.push(y);const n=i.slice(1,-1),g=[];for(let y=0;y<3&&n.length;y++)g.push(n.splice(Math.floor(s()*n.length),1)[0]);return i.falls=g.sort((y,P)=>y-P),i}function yt(e){const s=ye,i=e.places,n=e.tables,g=[],y=(b,F,q,H,f,c,z,E=24)=>{const S=[];for(let I=0;I<E;I++){const _=I/E*Ce,w=Math.cos(_)*f,t=Math.sin(_)*c,r=b+q*w-H*t,p=F+H*w+q*t;S.push([r,z(r,p,_),p])}return S},P=(b,F)=>(q,H,f)=>e.ground(q,H)+b+F*Math.sin(f*2+1),u=b=>{const F=n.B+Math.round(b),q=n.X[F+2]-n.X[F],H=n.Z[F+2]-n.Z[F],f=Math.hypot(q,H)||1;return[n.X[F],n.Z[F],q/f,H/f]},o=u((i.straight+i.east)/2);g.push({name:"pigeons",pts:y(o[0],o[1],o[2],o[3],22,34,P(11.2,1.1)),spread:[4,1.2,7],wander:[1.2,.8,1.2]});const l=u((i.east+i.bend)/2);g.push({name:"rooks",pts:y(l[0],l[1],l[2],l[3],58,40,P(34,3)),spread:[10,3,14],wander:[3,2,3]});const d=s.houseCentre,k=s.houseFront,h=s.houseAxis,a=s.frontDistance+14,L=s.houseLength/8;g.push({name:"swallows",pts:y(d[0]+k[0]*a+h[0]*L,d[1]+k[1]*a+h[1]*L,h[0],h[1],.35*s.houseLength,4,(b,F,q)=>e.ground(b,F)+4.4+1.2*Math.sin(q*3)),spread:[2.5,1,7],wander:[1.2,.7,1.5]});const m=s.valleyAxis,T=s.valleyLength+s.beachDepth+s.ringBeyondTide,D=e.fromValley(T+78,0),W=e.fromValley(T-8,78),V=e.fromValley(T-8,-74);g.push({name:"gulls-sea",pts:y(D[0],D[1],m[0],m[1],44,32,(b,F,q)=>19+5*Math.sin(q*2)),spread:[9,3,12],wander:[3,2,3]}),g.push({name:"gulls-left",pts:y(W[0],W[1],m[0],m[1],30,24,(b,F,q)=>31+4*Math.sin(q*2)),spread:[6,2.5,9],wander:[2.5,1.5,2.5]}),g.push({name:"gulls-right",pts:y(V[0],V[1],m[0],m[1],28,22,(b,F,q)=>27+4*Math.sin(q*2)),spread:[6,2.5,9],wander:[2.5,1.5,2.5]});const G=Be(e.seed),R=s.valleyLength/2,v=G.reduce((b,F)=>Math.abs(F-R)<Math.abs(b-R)?F:b,G[0]),N=e.fromValley(v,e.streamAt(v));return g.push({name:"wagtails",pts:y(N[0],N[1],m[0],m[1],20,1.1,P(1.2,.3),16),spread:[.6,.3,3],wander:[.4,.3,.4]}),g}export{Se as BANK_GLSL,Pe as BEHIND,vt as DRIVE_GLSL,de as ESTATE_GLSL,me as FOOT,Re as GAP_OPEN,ye as PLACE,Y as RIDE,Ce as TAU,Ve as VERGE,it as buildBank,xt as buildHero,ft as driveUniforms,wt as gapField,st as layoutSteps,yt as lifeCourses,ue as lin,ut as makeBankMaterials,et as makeEstateUniforms,gt as makeLayout,Be as stoneRows,mt as vaultTrunks};
