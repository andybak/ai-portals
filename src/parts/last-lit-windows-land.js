import*as n from"three";import{NL_GLSL as U,PYR as L,GATE as ht}from"./last-lit-windows.js";const zt=(c,p,e)=>Math.min(e,Math.max(p,c)),Z=(c,p,e)=>{const s=zt((e-c)/(p-c),0,1);return s*s*(3-2*s)},mt=220,tt=(c,p)=>Math.hypot(Math.max(Math.abs(c)-L.half,0),Math.max(Math.abs(p)-L.half,0))+Math.min(Math.max(Math.abs(c)-L.half,Math.abs(p)-L.half),0)-mt,vt=1490,rt=c=>vt+7*Math.sin(c/210+.6)+3*Math.sin(c/67);function Wt(c,p,e={}){const s=e.streams,w=c.noise,g=new n.Vector3,h=new n.Vector3;let r=0;for(;r<p.length&&(p.posAtDist(r,g),!(tt(g.x,g.z)<0));)r+=1;const i=p.points[0],m=p.posAtDist(r).clone(),v=new n.Vector2(m.x-i.x,m.z-i.z),u=v.length();v.normalize();const b=new n.Vector2(-v.y,v.x),A=(o,f)=>[i.x+v.x*o+b.x*f,i.z+v.y*o+b.y*f],F=(o,f)=>{p.posAtDist(o,g),p.tangentAtDist(o,h);const k=Math.hypot(h.x,h.z)||1;return[g.x-h.z/k*f,g.z+h.x/k*f]},t=[-Math.SQRT1_2,-Math.SQRT1_2],a={c:[-28,1747],f:t,r:[-t[1],t[0]],len:260,wid:210,tall:170};a.head=[a.c[0]+t[0]*130,a.c[1]+t[1]*130];const l={x:a.head[0]+t[0]*70,z:a.head[1]+t[1]*70,r:36},x=!!e.blueField,z=!!e.swap,R=s.watchers,d=Math.PI/180,P=R.pick([1,2,3]),G=R.pick([1,2,3].filter(o=>o!==P)),W=(o,f,k)=>{const S=(o*90+R.range(-45,45))*d,I=R.range(2300,3e3),D=Math.sin(S)*I,C=Math.cos(S)*I,K=Math.atan2(-D,-C)+R.range(-14,14)*d,Q={x:D,z:C,tall:f,glow:k,quarter:o,f:[Math.sin(K),Math.cos(K)]};return Q.pit=[D+Q.f[0]*170,C+Q.f[1]*170],Q},N=[W(P,230,z?"crown":"pit"),W(G,260,z?"pit":"crown")],y=(o,f,k)=>{for(const S of N)if(Math.hypot(o-S.x,f-S.z)<S.tall*.75+k)return!0;return!1},M=[],T=s.pits;{const o=F(T.range(100,160),-34),f=F(T.range(300,360),40);M.push({x:o[0],z:o[1],r:10,kind:x?1:0,name:"A"},{x:f[0],z:f[1],r:14,kind:0,name:"B"})}const j=(o,f,k)=>{const S=o-a.c[0],I=f-a.c[1],D=S*a.f[0]+I*a.f[1],C=S*a.r[0]+I*a.r[1];return(D/(a.len/2+k))**2+(C/(a.wid/2+k))**2<1},B={x:900+s.house.range(-160,160),z:1600+s.house.range(-40,110),hill:35},V={x:640+s.kiln.range(-80,120),z:1760+s.kiln.range(-40,80)},J=(o,f,k,S)=>{if(tt(o,f)<30+k||j(o,f,30+k)||y(o,f,30+k)||Math.hypot(o-l.x,f-l.z)<l.r+20+k||Math.abs(f-rt(o))<12+k||Math.hypot(o-B.x,f-B.z)<150||Math.hypot(o-V.x,f-V.z)<90+k||p.nearestXZ(o,f).dist<S+k)return!1;for(const I of M)if(Math.hypot(o-I.x,f-I.z)<I.r+k+14)return!1;return!0};let q=0;for(;M.length<7&&q++<400;){const o=A(T.range(.1,1)*u,T.range(-330,-60)),f=T.range(7,12);J(o[0],o[1],f,18)&&M.push({x:o[0],z:o[1],r:f,kind:x?1:0})}for(;M.length<14&&q++<900;){const o=T.range(220,2300),f=T.range(1500,2500),k=T.range(9,17);J(o,f,k,18)&&M.push({x:o,z:f,r:k,kind:0})}const E=[],_=s.holes;for(q=0;E.length<60&&q++<4e3;){let o,f;if(E.length<44){const S=A(_.range(-.06,1)*u,_.range(-260,150));o=S[0],f=S[1]}else o=_.range(150,1500),f=_.range(1470,2100);if(!J(o,f,3,18))continue;let k=!1;for(const S of E)if(Math.hypot(o-S.x,f-S.z)<16){k=!0;break}k||E.push({x:o,z:f,r:_.range(1.1,2.1),kind:x&&E.length<44||_.chance(.14)?1:0})}const O=[],Y=s.cones;for(q=0;O.length<5&&q++<300;){const o=O.length<3,f=o?Y.range(1500,2600):Y.range(-900,900),k=o?Y.range(1700,2500):Y.range(2250,2700),S=Y.range(40,90),I=S*Y.range(1.3,1.8);let D=Math.hypot(f-B.x,k-B.z)>300&&!y(f,k,I+60);for(const C of O)Math.hypot(f-C.x,k-C.z)<420&&(D=!1);D&&O.push({x:f,z:k,h:S,r:I})}const H=[1/0,-1/0,1/0,-1/0];for(const o of p.points)H[0]=Math.min(H[0],o.x-30),H[1]=Math.max(H[1],o.x+30),H[2]=Math.min(H[2],o.z-30),H[3]=Math.max(H[3],o.z+30);const yt=(o,f)=>{const k=tt(o,f),S=Z(-4,80,k),I=Z(700,2200,k);let D=(3.3*w.fbm2(o/190,f/190,3)+1.3*w.n2(o/47+9,f/47-4)+.35*w.n2(o/11,f/11))*S;D+=I*(9*w.fbm2(o/520+30,f/520-12,3)+5),D*=.35+.65*Z(4,22,Math.abs(f-rt(o))),D*=Z(6,40,Math.abs(k));{const C=o-a.c[0],K=f-a.c[1],Q=C*a.f[0]+K*a.f[1],pt=C*a.r[0]+K*a.r[1],bt=Math.hypot(Q/(a.len/2),pt/(a.wid/2));D+=13*(1-Z(.86,1.32,bt))*(.7+.3*w.n2(Q/30,pt/30))}for(const C of N){const K=Math.hypot(o-C.x,f-C.z)/(C.tall*.72);D+=14*(1-Z(.85,1.4,K))}{const C=Math.hypot(o-B.x,f-B.z);D+=B.hill*Math.exp(-(C*C)/9025)*(1+.12*w.n2(o/60,f/60))}for(const C of O){const K=Math.hypot(o-C.x,f-C.z);K<C.r*1.5&&(D+=C.h*.14*(1-Z(C.r*.5,C.r*1.5,K)))}return D},X=(o,f)=>{let k=yt(o,f);for(const S of M){const I=Math.hypot(o-S.x,f-S.z);I>S.r*2.6||(k+=1.7*Math.exp(-(((I-S.r*1.12)/(S.r*.36))**2))-5.2*(1-Z(S.r*.2,S.r*1.05,I)))}if(o>H[0]&&o<H[1]&&f>H[2]&&f<H[3]){const S=p.nearestXZ(o,f);S.dist<24&&(k=Math.min(k,S.y-8+3*Z(8,24,S.dist)))}return k};for(const o of M)o.y=X(o.x,o.z);for(const o of E)o.y=X(o.x,o.z);for(const o of O)o.y=X(o.x,o.z);B.y=X(B.x,B.z),V.y=X(V.x,V.z),l.y=X(l.x,l.z);for(const o of N)o.y=0;const ot=s.fields,$=s.farfires,lt=[],ut=[0,1,2,3,4].map(()=>[ot.range(500,2900),ot.range(1700,3300),ot.range(180,420)]),ct=[ot.range(1500,2600),ot.range(2500,3300)];for(q=0;lt.length<170&&q++<3e3;){let o,f,k=0;const S=$();if(S<.5){const I=$.pick(ut),D=$()*6.283,C=I[2]*Math.sqrt($());o=I[0]+Math.cos(D)*C,f=I[1]+Math.sin(D)*C*.7}else if(S<.68){const I=$()*6.283,D=330*Math.sqrt($());o=ct[0]+Math.cos(I)*D,f=ct[1]+Math.sin(I)*D*.6,k=1}else o=$.range(260,3300),f=$.range(1480,3600);tt(o,f)<70||y(o,f,40)||Math.hypot(o-B.x,f-B.z)<170||Math.abs(f-rt(o))<14||o<520&&f<2200&&p.nearestXZ(o,f).dist<150||lt.push({x:o,z:f,y:X(o,f),r:$.range(2.5,6),kind:k})}return{W:a,dome:l,pits:M,holes:E,cones:O,house:B,kiln:V,far:N,farFires:lt,fields:ut,bluePlain:ct,blue:x,at:A,legLen:u,f:v,r:b,heightAt:X,okSpot:J,inW:j,farIn:y,dRing:r}}const at=[.366,.0152,.0109],ft=[.045,.133,.745],Mt=[.72,.83,1];function Gt(c){const p=[];for(const e of c.pits){const s=e.x>200?1.5:1;p.push({x:e.x,z:e.z,r:e.r*2.7*s,I:6,c:e.kind?ft:at,cut:e.r*19*s,rays:1})}for(const e of c.holes)p.push({x:e.x,z:e.z,r:e.r*4.2,I:6,c:e.kind?ft:at,cut:e.r*30,rays:1});p.push({x:c.dome.x,z:c.dome.z,r:c.dome.r*1.5,I:.9,c:Mt,cut:c.dome.r*9}),p.push({x:c.kiln.x,z:c.kiln.z,r:20,I:5,c:at,cut:300,rays:1});for(const e of c.far)e.glow==="pit"&&p.push({x:e.pit[0],z:e.pit[1],r:50,I:5,c:at,cut:700});for(const e of c.farFires)p.push({x:e.x,z:e.z,r:e.r*3.8,I:5,c:e.kind?ft:at,cut:e.r*34});return p}const gt=(c,p,e,s)=>{if(!c.rays)return 1;const w=Math.atan2(e,p),g=(c.x*.731+c.z*.377)%6.283;return 1+(Math.max(.12,.6+.3*Math.sin(3*w+g)+.26*Math.sin(7*w+2.3*g)+.16*Math.sin(13*w+4.1*g))-1)*Z(.3*c.r*c.r,2.5*c.r*c.r,s)},wt=(c,p,e,s)=>{let w=0,g=0,h=0;for(let r=0;r<c.length;r++){const i=c[r],m=p-i.x,v=e-i.z,u=m*m+v*v;if(u>i.cut*i.cut)continue;const b=i.I/Math.pow(1+u/(i.r*i.r),1.5)*(1-u/(i.cut*i.cut))*gt(i,m,v,u);w+=i.c[0]*b,g+=i.c[1]*b,h+=i.c[2]*b}return s[0]=w,s[1]=g,s[2]=h,s},nt={x0:-760,z0:1360,w:1280,d:800,nx:512,nz:320},st={x0:200,z0:1280,w:3200,d:2400,nx:320,nz:240};async function Nt(c,p,e=nt){const{x0:s,z0:w,w:g,d:h,nx:r,nz:i}=e,m=new Float32Array(r*i*3),v=g/r,u=h/i;let b=0;for(let a=0;a<p.length;a++){const l=p[a],x=Math.max(1,Math.floor((l.x-l.cut-s)/v)),z=Math.min(r-2,Math.ceil((l.x+l.cut-s)/v)),R=Math.max(1,Math.floor((l.z-l.cut-w)/u)),d=Math.min(i-2,Math.ceil((l.z+l.cut-w)/u));for(let P=R;P<=d;P++){for(let G=x;G<=z;G++){const W=s+(G+.5)*v-l.x,N=w+(P+.5)*u-l.z,y=W*W+N*N;if(y>l.cut*l.cut)continue;const M=l.I/Math.pow(1+y/(l.r*l.r),1.5)*(1-y/(l.cut*l.cut))*gt(l,W,N,y),T=(P*r+G)*3;m[T]+=l.c[0]*M,m[T+1]+=l.c[1]*M,m[T+2]+=l.c[2]*M}(P-R&63)===63&&await c.yield()}b+=Math.max(0,z-x+1)*Math.max(0,d-R+1),(b>12e3||(a&3)===3)&&(b=0,await c.yield())}const A=new Uint16Array(r*i*4),F=n.DataUtils.toHalfFloat;for(let a=0,l=0,x=0;a<i;a++){for(let z=0;z<r;z++,l+=3,x+=4)A[x]=F(Math.min(m[l],60)),A[x+1]=F(Math.min(m[l+1],60)),A[x+2]=F(Math.min(m[l+2],60)),A[x+3]=F(1);(a&15)===15&&await c.yield()}const t=new n.DataTexture(A,r,i,n.RGBAFormat,n.HalfFloatType);return t.magFilter=t.minFilter=n.LinearFilter,t.wrapS=t.wrapT=n.ClampToEdgeWrapping,t.needsUpdate=!0,t}const et=[.42,.06,.016],dt=[.05,.15,.7],it={x0:-1100,z0:1250,w:4600,d:2500,nx:766,nz:416};function Bt(c){const p=[];for(const e of c.pits)p.push({x:e.x,z:e.z,r:e.r*3.2,I:1.4*(e.r/10)**1.5,c:e.kind?dt:et,cut:e.r*14});for(const e of c.holes)p.push({x:e.x,z:e.z,r:e.r*7,I:.7,c:e.kind?dt:et,cut:e.r*22});p.push({x:c.kiln.x,z:c.kiln.z,r:40,I:2.2,c:et,cut:180});for(const e of c.farFires)p.push({x:e.x,z:e.z,r:e.r*3.5,I:2.2,c:e.kind?dt:et,cut:e.r*16});for(const e of c.cones)p.push({x:e.x,z:e.z,r:e.r*.8,I:.8,c:et,cut:e.r*2});return p}function kt(c,p,e,s){let w=0,g=0,h=0,r=0,i=0;for(let v=0;v<c.length;v++){const u=c[v],b=u.x-p,A=u.z-e,F=b*b+A*A;if(F>u.cut*u.cut)continue;const t=u.I/Math.pow(1+F/(u.r*u.r),1.5)*(1-F/(u.cut*u.cut)),a=Math.sqrt(F)+.001;w+=u.c[0]*t,g+=u.c[1]*t,h+=u.c[2]*t,r+=b/a*t,i+=A/a*t}const m=Math.hypot(r,i)||1;return s[0]=w,s[1]=g,s[2]=h,s[3]=r/m,s[4]=i/m,s}function Ct(c,p){const e=[0,1,2,3,4,5].map(h=>{const r=p[h]||[0,9e3,.2,0,0];return new n.Vector4(r[0],r[1],r[3],r[4])}),s={...c.uniforms,uSmear:{value:e},uSmearW:{value:[0,1,2,3,4,5].map(h=>p[h]?p[h][2]:.2)}},w=new n.ShaderMaterial({uniforms:s,side:n.BackSide,depthWrite:!1,depthTest:!1,vertexShader:"varying vec3 vD; void main(){ vD = position; vec4 wp = modelMatrix*vec4(position, 1.0); gl_Position = projectionMatrix*viewMatrix*wp; }",fragmentShader:`precision highp float;
      ${U}
      uniform vec4 uSmear[6]; uniform float uSmearW[6];
      varying vec3 vD;
      void main(){
        vec3 d = normalize(vD);
        vec3 col = nlSky(d);
        float az = atan(d.x, -d.z + 1e-6), el = asin(clamp(d.y, -1.0, 1.0));
        vec3 warm = vec3(0.0); float cold = 0.0;
        for (int i = 0; i < 6; i++) {
          float azs = atan(uSmear[i].x - cameraPosition.x, -(uSmear[i].y - cameraPosition.z) + 1e-6);
          float da = mod(az - azs + 3.14159265, 6.2831853) - 3.14159265, w = uSmearW[i];
          float br = 0.78 + 0.22*sin(uTime*0.314 + float(i)*1.9);
          // low and wide, ragged along the top as if seen through moving smoke
          float rag = 0.25 + 1.5*nlN(vec2(az*11.0 + float(i)*7.0, uTime*0.04))*nlN(vec2(az*37.0 - float(i)*3.0, 2.0));
          float g = exp(-da*da/(w*w))*exp(-max(el, 0.0)/(0.01 + 0.026*rag))*smoothstep(-0.03, 0.004, el)*(0.35 + 0.65*rag);
          float a = uSmear[i].w*br*g;
          warm += vec3(0.366, 0.0152, 0.0109)*(a*(1.0 - uSmear[i].z)); cold += a*uSmear[i].z;
        }
        // where the cold light of the blue plain stands, the red of the fields behind it is drowned: no violet between them
        col += warm*(1.0 - clamp(cold*8.0, 0.0, 1.0)) + vec3(0.045, 0.133, 0.745)*cold;
        gl_FragColor = vec4(col, 1.0);
      }`}),g=new n.Mesh(new n.SphereGeometry(4800,48,24),w);return g.name="night",g.renderOrder=-1,g.frustumCulled=!1,{mesh:g,uniforms:s}}const At=`
attribute vec3 aGlow;
varying vec3 vW, vN, vGlow;
void main(){
  vN = normal; vGlow = aGlow;
  vec4 wp = modelMatrix*vec4(position, 1.0); vW = wp.xyz;
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,Pt=`
precision highp float;
${U}
uniform sampler2D uGlowMap, uGlowFar, uWin; uniform vec2 uTex; uniform float uWinE; uniform vec4 uGlowBox, uGlowFarBox; uniform vec3 uGate; uniform vec3 uGateCol; uniform float uRoadZ;
uniform sampler2D uGlowWide; uniform vec4 uWideBox; uniform vec4 uFarPit[2]; uniform vec3 uFarPitCol[2];
varying vec3 vW, vN, vGlow;
// POLISH ROUND 1, SECOND PART (G1c). The surface of the cinder country, for its lights to catch: cracked black rock
// and clinker. Plates of slag some 30 m across, each lying at its own height (0 to 5 m), broken from its neighbours
// by a crack with a fallen edge 3 m wide. A rule of the land, the same on every quarter; height in metres.
float cSlag(vec2 p){
  vec2 q = p/30.0, i = floor(q), f = q - i; float d1 = 9.0, d2 = 9.0, h = 0.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y)), r = g + 0.15 + 0.7*vec2(nlH(i + g), nlH(i + g + 57.3)) - f; float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; h = nlH(i + g + 113.1); } else if (d < d2) { d2 = d; }
  }
  return 5.0*h*h*smoothstep(0.0, 0.22, sqrt(d2) - sqrt(d1));
}
void main(){
  vec3 P = vW; vec3 toEye = cameraPosition - P; float dist = length(toEye); vec3 V = toEye/max(dist, 1e-3);
  vec3 N = normalize(vN + vec3(0.0, 1e-4, 0.0));
  float px = dist*0.0018;                                    // about the size of a pixel on the ground, in metres
  float n1 = nlF(P.xz*0.017), n2 = nlF(P.xz*0.11 + 7.0);
  float kf = 1.0 - smoothstep(0.25, 0.9, px), kff = 1.0 - smoothstep(0.06, 0.22, px);
  float n3 = nlN(P.xz*0.83 + 3.0), n4 = nlN(P.xz*3.9);
  float hgt = n2*0.7 + (n3*0.5*kf + n4*0.22*kff);
  // its slope, by two more samples a pixel (and never less than 0.3 m) aside
  float he = max(0.3, px);
  vec2 hx = P.xz + vec2(he, 0.0), hz = P.xz + vec2(0.0, he);
  vec2 hg = vec2(nlF(hx*0.11 + 7.0)*0.7 + nlN(hx*0.83 + 3.0)*0.5*kf + nlN(hx*3.9)*0.22*kff, nlF(hz*0.11 + 7.0)*0.7 + nlN(hz*0.83 + 3.0)*0.5*kf + nlN(hz*3.9)*0.22*kff);
  hg = (hg - hgt)/he;
  float rd = nlRingD(P.xz), outR = smoothstep(-3.0, 8.0, rd);
  // cinder and crust, pale ash lying in drifts along the wind
  vec3 alb = mix(vec3(0.04, 0.038, 0.042), vec3(0.092, 0.086, 0.086), n1);
  float drift = smoothstep(0.52, 0.78, nlF(vec2(P.x*0.0055 + n1*0.9, P.z*0.033)));
  alb = mix(alb, vec3(0.15, 0.146, 0.152), drift*0.75);
  alb *= 0.74 + 0.5*n2;
  alb *= 1.0 - 0.35*kf*smoothstep(0.55, 0.75, n3) - 0.16*kff*smoothstep(0.6, 0.8, n4);
  // inside the ring the ground is bare and swept: great slabs, jointed
  vec2 sl = P.xz/vec2(36.0, 24.0), slw = fwidth(sl), slf = 0.5 - abs(fract(sl) - 0.5);
  float slj = max(1.0 - smoothstep(0.0, 1.5*slw.x + 0.006, slf.x), 1.0 - smoothstep(0.0, 1.5*slw.y + 0.009, slf.y))*clamp(0.04/(max(slw.x, slw.y) + 0.04), 0.0, 1.0);
  vec3 slab = vec3(0.088, 0.085, 0.09)*(0.86 + 0.16*nlH(floor(sl)) + 0.2*n2)*(1.0 - 0.6*slj);
  // the making and the age of the court. Each great slab is of plates 12 m square with fine joints; it is worn in broad
  // paths and scorched in old patches; pale ash has drifted into the great joints; and it falls away from the house in
  // low steps 44 m apart, each a dark riser under a worn pale edge.
  vec2 s2 = P.xz/12.0, s2w = fwidth(s2), s2f = 0.5 - abs(fract(s2) - 0.5);
  float s2j = max(1.0 - smoothstep(0.0, 1.5*s2w.x + 0.004, s2f.x), 1.0 - smoothstep(0.0, 1.5*s2w.y + 0.004, s2f.y))*clamp(0.03/(max(s2w.x, s2w.y) + 0.03), 0.0, 1.0);
  float wear = nlF(P.xz*0.045 + 31.0), scorch = smoothstep(0.6, 0.78, nlF(P.xz*0.019 + 71.0));
  slab *= (0.72 + 0.6*wear)*(1.0 - 0.3*s2j)*(1.0 - 0.6*scorch)*(0.92 + 0.16*nlH(floor(s2) + 5.0));
  float jd = min(slf.x*36.0, slf.y*24.0);
  float ashJ = (1.0 - smoothstep(0.1, 0.7 + 2.2*n3, jd))*smoothstep(0.28, 0.6, n2)*kf;
  slab = mix(slab, vec3(0.2, 0.196, 0.19)*(0.8 + 0.3*n4), 0.6*ashJ);
  float km = (fract((P.z - 1222.0)/44.0 + 0.5) - 0.5)*44.0, kw = fwidth(P.z), kk = clamp(0.3/(kw + 0.3), 0.0, 1.0)*step(1200.0, P.z)*step(abs(P.x - uGate.x), 1150.0)*smoothstep(9.4, 10.5, abs(P.x - uGate.x));
  float riser = smoothstep(-kw, 0.0, km)*(1.0 - smoothstep(0.45, 0.5 + kw, km))*kk;
  float worn = smoothstep(-0.4 - kw, -0.4, km)*(1.0 - smoothstep(0.0, kw + 0.02, km))*kk;
  slab = slab*(1.0 - 0.75*riser)*(1.0 + 0.9*worn)*(0.9 + 0.2*nlH(vec2(floor((P.z - 1222.0)/44.0 + 0.5), 3.0)));
  alb = mix(slab, alb, outR);
  // the pale road, worn at its edges, jointed
  float rz = uRoadZ + 7.0*sin(P.x/210.0 + 0.6) + 3.0*sin(P.x/67.0);
  float road = (1.0 - smoothstep(4.6, 6.4 + n2*1.6, abs(P.z - rz)))*outR;
  float jw = fwidth(P.x/9.0), jf = 0.5 - abs(fract(P.x/9.0 + 0.3*n1) - 0.5);
  float joint = (1.0 - smoothstep(0.0, 1.5*jw + 0.012, jf))*clamp(0.05/(jw + 0.05), 0.0, 1.0);
  alb = mix(alb, vec3(0.25, 0.25, 0.27)*(0.8 + 0.35*n2)*(1.0 - 0.45*joint), road*(0.75 + 0.25*n3));
  // the causeway from the gate to the ring
  float cw = (1.0 - smoothstep(8.5, 9.4, abs(P.x - uGate.x)))*(1.0 - outR)*step(P.z, 1425.0)*step(1199.0, P.z);
  float cj = 0.5 - abs(fract(P.z/8.0) - 0.5), cjw = fwidth(P.z/8.0);
  alb = mix(alb, vec3(0.3, 0.3, 0.31)*(0.88 + 0.2*n2)*(1.0 - 0.4*(1.0 - smoothstep(0.0, 1.5*cjw + 0.012, cj))*clamp(0.05/(cjw + 0.05), 0.0, 1.0)), cw);
  // relief from the same noises
  float bk = (1.0 - smoothstep(0.3, 1.2, px))*mix(0.35, 1.0, outR)*(1.0 - 0.7*road)*(1.0 - 0.8*cw);
  vec3 Nb = normalize(N - vec3(hg.x, 0.0, hg.y)*(0.55*bk));
  // A black land: outside the ring the amber of the face lights only what turns toward it more than level ground does
  // (the lee of a drift, the lip of a hollow, a stone's edge); inside the ring the swept slabs take it whole.
  vec3 Lk = normalize(uKeyAt - P);
  float tip = smoothstep(0.02, 0.3, dot(Nb, Lk) - 0.92*Lk.y);
  // (the swept ground also takes the glow that hangs in the air before the face: paler than the key, and from all sides)
  vec3 col = alb*(uAmb + vec3(0.004, 0.0045, 0.007) + vec3(0.03, 0.0075, 0.006)*outR + vec3(0.17, 0.15, 0.118)*(1.0 - outR) + uKeyCol*(nlKeyFall(P)*0.42*mix(3.4*max(dot(Nb, Lk), 0.0), 2.8*tip, outR*(1.0 - 0.85*road)))) + nlPales(P, Nb, V, alb, 0.0);
  // the fires and the dome
  vec2 guv = (P.xz - uGlowBox.xy)*uGlowBox.zw;
  float gm = smoothstep(0.0, 0.03, guv.x)*smoothstep(0.0, 0.05, guv.y)*(1.0 - smoothstep(0.97, 1.0, guv.x))*(1.0 - smoothstep(0.95, 1.0, guv.y));
  vec2 fuv = (P.xz - uGlowFarBox.xy)*uGlowFarBox.zw;
  float fm = smoothstep(0.0, 0.03, fuv.x)*smoothstep(0.0, 0.03, fuv.y)*(1.0 - smoothstep(0.97, 1.0, fuv.x))*(1.0 - smoothstep(0.97, 1.0, fuv.y));
  vec3 glow = mix(mix(vGlow, texture2D(uGlowFar, clamp(fuv, 0.0, 1.0)).rgb, fm), texture2D(uGlowMap, clamp(guv, 0.0, 1.0)).rgb, gm);
  float flick = 0.84 + 0.32*nlN(vec2(uTime*1.7 + P.x*0.021, P.z*0.021 - uTime*0.4));
  // no fire burns inside the ring, and its swept ground belongs to the windows' light: the red dies 70 m inside the line
  glow *= smoothstep(-70.0, 0.0, rd);
  col += (alb*(0.55 + 0.45*max(Nb.y, 0.0)) + 0.006)*glow*mix(1.0, flick, step(glow.b*2.0, glow.r + 0.001));
  // the ring's clear light, the gate's light down the causeway
  vec2 rg = nlRingN(P.xz);
  float rl = 1.0/(1.0 + rd*rd/45.0), rface = 0.45 + 0.55*clamp(dot(Nb, normalize(vec3(-rg.x*rd, 0.8, -rg.y*rd)))*1.6 - 0.2, 0.0, 1.5);
  col += (alb + 0.005)*uRingCol*(2.8*rl*rface*nlRingPulse(P.xz));
  float gz = max(P.z - 1200.0, 0.0), gx = abs(P.x - uGate.x);
  // the door's light lies long over the slabs; the files of the host stand 12 m either side of the causeway's middle, a
  // man every three quarters of a metre, and each throws his shadow outward from the door, a quarter as long as he is far from it
  float sR = max(gx/12.0, 0.2), zc = gz/sR, zcw = fwidth(zc/0.75);
  float stripe = mix(1.0 - smoothstep(0.2, 0.34, abs(fract((zc - 16.0)/0.75 + 0.5) - 0.5)), 0.5, clamp(zcw*1.5, 0.0, 1.0));
  float shade = smoothstep(1.0, 1.03, sR)*(1.0 - smoothstep(1.16, 1.3, sR))*stripe*step(16.0, zc)*step(zc, 209.0);
  col += alb*uGateCol*(exp(-gx/(6.0 + 0.17*gz))/(1.0 + gz/120.0)*step(1199.0, P.z)*(1.0 - 0.8*shade));
  // the light of the wall glancing off the ground at a low angle: a dull sheen with no image in it, a little more on the
  // swept slabs, the road and the causeway, broken on the cinder (the clouds of light on the face are taken from its
  // window texture, far down its mip chain)
  vec3 R = reflect(-V, normalize(mix(N, Nb, 0.3)));
  float den = R.z + 0.325*R.y, tR = (1200.0 - 0.325*P.y - P.z)/min(den, -1e-3);
  vec3 Hp = P + R*tR;
  float onFace = step(den, -0.01)*step(0.0, Hp.y)*smoothstep(0.0, 60.0, 1200.0 - 0.325*Hp.y - abs(Hp.x))*step(1200.0, P.z);
  // the slabs are dry: only the clouds of light on the face show in them, as a dull sheen (four taps of the window texture
  // half a texel apart, far down its mip chain, so that no block of it shows)
  vec2 wuv = vec2((Hp.x + 1200.0)/4.0, Hp.y/6.0);
  float wlod = 5.8 + 0.6*outR;
  vec2 wo = 0.5*exp2(wlod)/uTex;
  vec4 tw = 0.25*(textureLod(uWin, wuv/uTex + wo, wlod) + textureLod(uWin, wuv/uTex - wo, wlod) + textureLod(uWin, wuv/uTex + vec2(wo.x, -wo.y), wlod) + textureLod(uWin, wuv/uTex + vec2(-wo.x, wo.y), wlod));
  float wallL = 0.5*(tw.r + tw.g)*0.1733*nlHeightDim(Hp.y)*uWinE*smoothstep(8.0, 30.0, Hp.y);
  float fres = 1.0 - max(dot(Nb, V), 0.0); fres = fres*fres; fres = 0.03 + 0.97*fres*fres*(1.0 - max(dot(Nb, V), 0.0));
  float gloss = mix(0.22, 0.16 + 0.22*n2, outR)*(1.0 + 0.8*road)*(1.0 + 0.35*cw);
  col += vec3(0.6, 0.48, 0.33)*(wallL*fres*gloss*onFace*1.0);
  vec3 Ls = normalize(uKeyAt - P);
  float sp = max(dot(R, Ls), 0.0); sp = sp*sp*sp; sp = sp*sp;
  col += uKeyCol*sp*nlKeyFall(P)*mix(0.02, 0.022, outR)*(0.35 + 0.65*n2);
  // ================= POLISH ROUND 1 (P1, P2): the country's own lights on its ground. All of it is added to what
  // the ground showed before; all of it lies outside the ring; none of it knows where the eye is but for its air.
  // (second part: the slag's plates are bent a little out of true, the same for every tap)
  vec2 Pw = P.xz + 9.0*vec2(nlN(P.xz*0.021 + 5.0), nlN(P.xz*0.021 + 41.0));
  float fpx = max(length(dFdx(P.xz)), length(dFdy(P.xz)));       // the true footprint of a pixel on the ground, in metres
  float h0 = cSlag(Pw), rk = outR*(1.0 - 0.7*road)*(1.0 - smoothstep(3.0, 12.0, fpx));        // ANTIALIASING: a broken edge is 3 m wide; under a wider pixel it is drawn softer
  // (the plates' own tilt carries the light; of the ground's fine grain only three parts in ten, so nothing ripples)
  vec3 Nr = normalize(normalize(mix(vec3(0.0, 1.0, 0.0), Nb, 0.3)) - vec3(cSlag(Pw + vec2(1.5, 0.0)) - h0, 0.0, cSlag(Pw + vec2(0.0, 1.5)) - h0)*(rk/1.5));
  // (a) the firelight: the pool's colour and strength from the wide map, the way to the fire from the map's slope;
  // what turns toward the fire is lit, what lies behind a broken edge from it (the fires are low: nine degrees) is in
  // shadow. SECOND PART (G1a, G1b): the map holds a pool round each fire and nothing between the pools
  vec2 quv = (P.xz - uWideBox.xy)*uWideBox.zw, qo = 6.0*uWideBox.zw;
  float qm = smoothstep(0.0, 0.03, quv.x)*smoothstep(0.0, 0.03, quv.y)*(1.0 - smoothstep(0.97, 1.0, quv.x))*(1.0 - smoothstep(0.97, 1.0, quv.y));
  vec3 wg0 = texture2D(uGlowWide, clamp(quv, 0.0, 1.0)).rgb;
  float wl0 = wg0.r + wg0.g + wg0.b;
  // (a pool, not a wash: where the light of all the fires together is thin it is thinner still)
  vec3 wg = wg0*(qm*outR*wl0/(wl0 + 0.1));
  vec2 Ld = normalize(vec2(dot(texture2D(uGlowWide, clamp(quv + vec2(qo.x, 0.0), 0.0, 1.0)).rgb, vec3(1.0)) - wl0, dot(texture2D(uGlowWide, clamp(quv + vec2(0.0, qo.y), 0.0, 1.0)).rgb, vec3(1.0)) - wl0) + vec2(1e-6, 0.0));
  float tanF = 0.16;
  float shF = 1.0 - rk*smoothstep(0.0, 1.5, max(cSlag(Pw + Ld*8.0) - h0 - 8.0*tanF, cSlag(Pw + Ld*20.0) - h0 - 20.0*tanF));
  vec3 albL = alb + 0.008;
  vec3 ext = albL*wg*((0.1 + 3.6*max(dot(Nr, normalize(vec3(Ld.x, tanF, Ld.y))), 0.0)*shF)*mix(1.0, flick, 0.5*step(wg.b*2.0, wg.r + 0.001)));
  // (g) the far Watchers' fires, on whatever quarter each stands: a pool like the others (second part: half its light
  // at uFarPit.z, nothing from five times that)
  for (int i = 0; i < 2; i++) {
    vec2 dv = uFarPit[i].xy - P.xz; float d2 = dot(dv, dv), R = uFarPit[i].z;
    float fa = uFarPit[i].w/(1.0 + d2/(R*R))*(1.0 - smoothstep(2.5*R, 5.0*R, sqrt(d2)));
    vec2 Lf = dv*inversesqrt(d2 + 1.0);
    ext += albL*uFarPitCol[i]*(fa*(0.1 + 3.6*max(dot(Nr, normalize(vec3(Lf.x, tanF, Lf.y))), 0.0)));
  }
  // (e) the house's own light on the ground. SECOND PART (G1d, G1e): it lies before each face, strongest at the ring
  // (the foot), a third at 90 m outside it and gone at 380 m; beyond that the house gives the land no lit surface,
  // only a faint edge on what stands up square to it (a broken edge of slag turned to the house)
  float hd = max(rd, 0.0), houseN = outR*(1.0 - smoothstep(0.0, 380.0, hd)), houseL = outR/(1.0 + hd/500.0 + hd*hd/(1500.0*1500.0));
  ext += alb*uKeyCol*(0.4*houseN*houseN/(1.0 + hd/90.0)*(0.25 + 2.2*max(dot(Nr, normalize(vec3(-rg.x, 0.75, -rg.y))) - 0.35, 0.0)));
  ext += alb*uKeyCol*(0.3*houseL*rk*max(dot(Nr, normalize(vec3(-rg.x, 0.2, -rg.y))) - 0.32, 0.0));
  // (c) low shining mist in the hollows of that relief: a few broad sheets, uneven, drifting a metre a second; the
  // house's warmth keeps it off: none within 100 m of the ring, all of it from 450 m out. (Second part: thin and cold.)
  vec2 mq = P.xz + vec2(uTime*1.1, uTime*0.4);
  float mist = (1.0 - 0.8*smoothstep(0.4, 3.0, h0))*smoothstep(0.48, 0.62, nlF(mq*0.0027 + 40.0))*(0.6 + 0.4*nlN(mq*0.017 + 9.0))*outR*smoothstep(100.0, 450.0, rd);
  ext += (vec3(0.016, 0.029, 0.032) + 0.04*wg)*mist;
  // (b) the road is pale stone and holds a little light of its own across the whole country
  ext += vec3(0.014, 0.0145, 0.017)*(road*(0.7 + 0.5*n2));
  // these lights carry through the night's air further than the dark ground does: half its density
  gl_FragColor = vec4(nlFog(col, P) + ext*(1.0 - nlFogAmount(P, uFog.x*0.5)), 1.0);
}`;function xt(c,p,e,s,w,g){const h=[];for(let m=c;m<=p+1e-6;m+=e)h.push(m);let r=e,i=c;for(;i>s;)r*=g,i-=r,h.unshift(i);for(r=e,i=h[h.length-1];i<w;)r*=g,i+=r,h.push(i);return h}async function It(c,p,e,s,w,g,h,r){const i=xt(-480,180,4.5,-4700,4700,1.17),m=xt(1376,2030,4.5,1200,5600,1.17).filter(d=>d>=1200);{const d=m[0],P=[];for(let y=1200;y<d-4;y+=8)P.push(y);let G=8,W=1200;const N=[];for(;W>-4700;)G*=1.25,W-=G,N.unshift(W);m.unshift(...N,...P)}const v=i.length,u=m.length,b=new Float32Array(v*u*3),A=new Float32Array(v*u*3),F=new Float32Array(v*u*3),t=[0,0,0];for(let d=0;d<u;d++){for(let P=0;P<v;P++){const G=(d*v+P)*3,W=i[P],N=m[d];b[G]=W,b[G+1]=e.heightAt(W,N),b[G+2]=N,wt(s,W,N,t),F[G]=t[0],F[G+1]=t[1],F[G+2]=t[2]}(d&1)===1&&await c.yield()}for(let d=0;d<u;d++){const P=Math.max(0,d-1),G=Math.min(u-1,d+1);for(let W=0;W<v;W++){const N=Math.max(0,W-1),y=Math.min(v-1,W+1),M=(d*v+W)*3,T=(b[(d*v+y)*3+1]-b[(d*v+N)*3+1])/(i[y]-i[N]),j=(b[(G*v+W)*3+1]-b[(P*v+W)*3+1])/(m[G]-m[P]),B=1/Math.hypot(T,1,j);A[M]=-T*B,A[M+1]=B,A[M+2]=-j*B}(d&31)===31&&await c.yield()}const a=[],l=(d,P)=>Math.abs(d)<L.half-20&&Math.abs(P)<L.half-20;for(let d=0;d<u-1;d++)for(let P=0;P<v-1;P++){if(l(i[P],m[d])&&l(i[P+1],m[d+1]))continue;const G=d*v+P,W=G+1,N=G+v,y=N+1;a.push(G,N,W,W,N,y)}await c.yield();const x=new n.BufferGeometry;x.setAttribute("position",new n.BufferAttribute(b,3)),x.setAttribute("normal",new n.BufferAttribute(A,3)),x.setAttribute("aGlow",new n.BufferAttribute(F,3)),x.setIndex(a),x.boundingSphere=new n.Sphere(new n.Vector3(0,0,500),7500);const z={...p.uniforms,uWin:g.uWin,uTex:g.uTex,uWinE:g.uWinE,uGlowMap:{value:w},uGlowBox:{value:new n.Vector4(nt.x0,nt.z0,1/nt.w,1/nt.d)},uGlowFar:{value:h},uGlowFarBox:{value:new n.Vector4(st.x0,st.z0,1/st.w,1/st.d)},uGate:{value:new n.Vector3(ht.x,ht.w/2,ht.h)},uGateCol:{value:new n.Color(1,.85,.62).multiplyScalar(1.3)},uRoadZ:{value:vt},uGlowWide:{value:r.tex},uWideBox:{value:new n.Vector4(it.x0,it.z0,1/it.w,1/it.d)},uFarPit:{value:e.far.map(d=>d.glow==="pit"?new n.Vector4(d.pit[0],d.pit[1],60,2.2):new n.Vector4(d.x+d.f[0]*d.tall*.55,d.z+d.f[1]*d.tall*.55,50,.9))},uFarPitCol:{value:e.far.map(d=>new n.Color(...d.glow==="pit"?et:[.3,.42,.7]))}},R=new n.Mesh(x,new n.ShaderMaterial({uniforms:z,vertexShader:At,fragmentShader:Pt}));return R.name="plain",{mesh:R,uniforms:z,triangles:a.length/3}}function Ft(c=10){const p=[],e=L.half,s=mt,w=(h,r,i,m)=>{const v=Math.round(Math.hypot(i-h,m-r)/c);for(let u=0;u<v;u++)p.push([h+(i-h)*u/v,r+(m-r)*u/v])},g=(h,r,i)=>{const m=Math.round(s*Math.PI/2/c);for(let v=0;v<m;v++){const u=i+Math.PI/2*v/m;p.push([h+Math.cos(u)*s,r+Math.sin(u)*s])}};return w(e+s,-e,e+s,e),g(e,e,0),w(e,e+s,-e,e+s),g(-e,e,Math.PI/2),w(-e-s,e,-e-s,-e),g(-e,-e,Math.PI),w(-e,-e-s,e,-e-s),g(e,-e,Math.PI*1.5),p}function qt(c,p,e){const s=Ft(10),w=s.length,g=[],h=[],r=[],i=[];for(let A=0;A<=w;A++){const F=s[A%w],t=s[(A+1)%w],a=s[(A-1+w)%w],l=t[0]-a[0],x=t[1]-a[1],z=Math.hypot(l,x)||1,R=e.heightAt(F[0],F[1])+.5;for(const d of[-1,1])g.push(F[0],R,F[1]),h.push(l/z,0,x/z),r.push(A/w,d);if(A<w){const d=A*2;i.push(d,d+1,d+2,d+1,d+3,d+2)}}const m=new n.BufferGeometry;m.setAttribute("position",new n.Float32BufferAttribute(g,3)),m.setAttribute("aTan",new n.Float32BufferAttribute(h,3)),m.setAttribute("aUv",new n.Float32BufferAttribute(r,2)),m.setIndex(i),m.boundingSphere=new n.Sphere(new n.Vector3(0,0,0),2400);const v={...p.uniforms,uRes:{value:new n.Vector2(800,450)}},u=new n.ShaderMaterial({uniforms:v,transparent:!0,depthWrite:!1,side:n.DoubleSide,vertexShader:`
      attribute vec3 aTan; attribute vec2 aUv;
      uniform vec2 uRes;
      varying vec3 vW; varying vec2 vUv; varying float vWide;
      void main(){
        vec3 p = position; vUv = aUv;
        vec3 toE = cameraPosition - p; float dist = length(toE);
        float pix = dist*2.0*0.6249/uRes.y;                       // metres per pixel at this distance (fov 64)
        vec3 side = normalize(cross(aTan, toE/max(dist, 1e-3)) + vec3(0.0, 1e-4, 0.0));
        float hw = max(0.3, 0.75*pix); vWide = 0.3/hw;
        p += side*aUv.y*hw;
        vW = p;
        gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.0);
      }`,fragmentShader:`precision highp float;
      ${U}
      varying vec3 vW; varying vec2 vUv; varying float vWide;
      void main(){
        float t = clamp(abs(vUv.y), 0.0, 1.0);
        float a = (1.0 - smoothstep(0.55, 1.0, t))*sqrt(clamp(vWide, 0.0, 1.0));
        vec3 col = uRingCol*(0.6*(0.72 + 0.28*(1.0 - t*t))*nlRingPulse(vW.xz));         // a round tube: brighter along its middle
        gl_FragColor = vec4(nlFog(col, vW), a);
      }`}),b=new n.Mesh(m,u);return b.name="ring",b.renderOrder=2,{mesh:b,uniforms:v,triangles:i.length/3}}function Dt(c,p,e){const s=e.dome,w=s.r*2.5,g=[],h=[],r=40,i=12,m=12;for(let t=0;t<=m;t++){const a=(Math.PI/2+.14)*t/m;for(let l=0;l<r;l++){const x=6.2832*l/r;g.push(s.x+w*Math.sin(a)*Math.cos(x),s.y+w*Math.cos(a),s.z+w*Math.sin(a)*Math.sin(x))}}for(let t=0;t<m;t++)for(let a=0;a<r;a++){const l=t*r+a,x=t*r+(a+1)%r;h.push(l,x,l+r,x,x+r,l+r)}const v=g.length/3;for(let t=0;t<=i;t++){const a=w*1.12*t/i;for(let l=0;l<r;l++){const x=6.2832*l/r,z=s.x+a*Math.cos(x),R=s.z+a*Math.sin(x);g.push(z,e.heightAt(z,R)+1.5,R)}}for(let t=0;t<i;t++)for(let a=0;a<r;a++){const l=v+t*r+a,x=v+t*r+(a+1)%r;h.push(l,l+r,x,x,l+r,x+r)}const u=new n.BufferGeometry;u.setAttribute("position",new n.Float32BufferAttribute(g,3)),u.setIndex(h),u.boundingSphere=new n.Sphere(new n.Vector3(s.x,s.y,s.z),w*1.2);const b={...p.uniforms,uDomeC:{value:new n.Vector4(s.x,s.y,s.z,s.r)}},A=new n.ShaderMaterial({uniforms:b,transparent:!0,depthWrite:!1,blending:n.AdditiveBlending,side:n.DoubleSide,vertexShader:"varying vec3 vW; void main(){ vW = position; gl_Position = projectionMatrix*viewMatrix*vec4(position, 1.0); }",fragmentShader:`precision highp float;
      ${U}
      uniform vec4 uDomeC; varying vec3 vW;
      float domeDens(vec3 p){
        float R = uDomeC.w, r2 = dot(p.xz, p.xz), y = max(p.y, 0.0);
        float body = exp(-r2/(0.5*R*R) - y/(0.36*R));
        float halo = 0.08*exp(-(r2 + 4.0*y*y)/(2.2*R*R));
        float lay = 0.45 + 0.95*nlN3(vec3(p.xz*0.045 + vec2(uTime*0.05, 0.0), p.y*0.17 - uTime*0.22));
        float edge = 1.0 - smoothstep(0.6, 1.0, length(p)/(2.5*R));
        return (body + halo)*lay*edge;
      }
      void main(){
        float RB = 2.5*uDomeC.w;
        vec3 ro = cameraPosition - uDomeC.xyz, rv = vW - cameraPosition; float far = length(rv); vec3 rd = rv/max(far, 1e-3);
        bool inside = dot(ro, ro) < RB*RB;
        if (gl_FrontFacing == inside) discard;
        float b = dot(ro, rd), c = dot(ro, ro) - RB*RB, sq = sqrt(max(b*b - c, 0.0));
        float t0 = max(-b - sq, 0.0), t1 = -b + sq;
        if (inside) t1 = min(t1, far);
        else if (rd.y < -1e-4) t1 = min(t1, -ro.y/rd.y);                    // the land ends the line of sight
        float dt = max(t1 - t0, 0.0)/12.0, tau = 0.0;
        for (int i = 0; i < 12; i++) {
          float t = t0 + (float(i) + 0.5)*dt;
          tau += domeDens(ro + rd*t)*smoothstep(8.0, 40.0, t);
        }
        tau *= dt;
        float breath = 0.9 + 0.1*sin(uTime*0.45);
        vec3 col = vec3(0.72, 0.83, 1.0)*(0.4*breath*(1.0 - exp(-tau*0.03)));
        gl_FragColor = vec4(col*(1.0 - nlFogAmount(uDomeC.xyz, uFog.x*0.6)), 1.0);
      }`}),F=new n.Mesh(u,A);return F.name="dome",F.renderOrder=2,{mesh:F,uniforms:b,triangles:h.length/3}}async function Tt(c,p,e,s,w,g={}){const h=g.streams,r=h.fires,i=new n.Group;i.name="fires";const m=[...e.pits.map(t=>({...t,pit:1})),...e.holes.map(t=>({...t,pit:0})),{x:e.kiln.x,z:e.kiln.z,y:e.kiln.y,r:9,kind:0,pit:1,kiln:1}];{const t=new n.CircleGeometry(1,14).rotateX(-Math.PI/2),a=new n.InstancedBufferGeometry;a.index=t.index,a.setAttribute("position",t.attributes.position);const l=new Float32Array(m.length*4),x=new Float32Array(m.length*2);m.forEach((d,P)=>{l.set([d.x,d.y+(d.pit?1.25:.25),d.z,d.pit?d.r*.52:d.r*.8],P*4),x.set([d.kind,r()],P*2)}),a.setAttribute("aAt",new n.InstancedBufferAttribute(l,4)),a.setAttribute("aK",new n.InstancedBufferAttribute(x,2)),a.instanceCount=m.length,a.boundingSphere=new n.Sphere(new n.Vector3(600,0,1900),2600);const z=new n.ShaderMaterial({uniforms:{...p.uniforms},vertexShader:`attribute vec4 aAt; attribute vec2 aK; varying vec2 vP; varying vec2 vK; varying vec3 vW;
        void main(){ vP = position.xz; vK = aK; vW = aAt.xyz + position*aAt.w; gl_Position = projectionMatrix*viewMatrix*vec4(vW, 1.0); }`,fragmentShader:`precision highp float;
        ${U}
        varying vec2 vP; varying vec2 vK; varying vec3 vW;
        void main(){
          float r = length(vP), s = vK.y*37.0;
          float n = nlF(vP*2.6 + s + vec2(0.0, uTime*0.07)), n2 = nlN(vP*7.0 - s + vec2(uTime*0.25, 0.0));
          float crust = smoothstep(0.42, 0.62, n);                         // dark plates on a bed of fire
          float heat = (1.0 - 0.75*crust)*(0.55 + 0.6*n2)*(1.0 - 0.6*r*r)*(0.85 + 0.15*sin(uTime*1.3 + s));
          vec3 c = mix(vec3(0.62, 0.028, 0.018), vec3(0.06, 0.17, 0.9), vK.x)*(1.9*heat);
          c += mix(vec3(0.5, 0.06, 0.02), vec3(0.2, 0.3, 0.6), vK.x)*pow(max(heat - 0.55, 0.0), 2.0)*3.0;
          gl_FragColor = vec4(nlFog(c, vW), 1.0);
        }`}),R=new n.Mesh(a,z);R.name="fire-floors",i.add(R)}await c.yield();const v=[];for(const t of m)if(t.pit){const a=Math.round(6+t.r*.55);for(let l=0;l<a;l++){const x=r()*6.283,z=t.r*.5*Math.sqrt(r()),R=r.range(.22,.4)*t.r;v.push(t.x+Math.cos(x)*z,t.y+.6,t.z+Math.sin(x)*z,R,R*r.range(1.7,3.3)*(t.kind?.55:1),r(),t.kind,0)}for(let l=0;l<2;l++)v.push(t.x+r.range(-.2,.2)*t.r,t.y+1,t.z+r.range(-.2,.2)*t.r,t.r*.9,t.r*r.range(2.6,3.6),r(),t.kind,1)}else for(let a=0;a<2;a++){const l=r.range(.55,.9)*t.r;v.push(t.x+r.range(-.3,.3)*t.r,t.y,t.z+r.range(-.3,.3)*t.r,l,l*r.range(2,3.6)*(t.kind?.6:1),r(),t.kind,0)}{const t=new n.InstancedBufferGeometry;t.setAttribute("position",new n.Float32BufferAttribute([-1,0,0,1,0,0,1,1,0,-1,1,0],3)),t.setIndex([0,1,2,0,2,3]);const a=new n.InstancedInterleavedBuffer(new Float32Array(v),8);t.setAttribute("aAt",new n.InterleavedBufferAttribute(a,4,0)),t.setAttribute("aF",new n.InterleavedBufferAttribute(a,4,4)),t.instanceCount=v.length/8,t.boundingSphere=new n.Sphere(new n.Vector3(600,0,1900),2600);const l=new n.ShaderMaterial({uniforms:{...p.uniforms},transparent:!0,depthWrite:!1,blending:n.AdditiveBlending,side:n.DoubleSide,vertexShader:`
        uniform float uTime;
        attribute vec4 aAt; attribute vec4 aF;                // base and half width; height, seed, kind (0 red, 1 blue), heat wisp
        varying vec2 vQ; varying vec4 vF; varying vec3 vW;
        void main(){
          vec3 base = aAt.xyz; vec3 toE = cameraPosition - base; toE.y = 0.0;
          vec3 right = normalize(vec3(toE.z, 0.0, -toE.x) + vec3(1e-4, 0.0, 0.0));
          float y = position.y, s = aF.y*61.0;
          float sway = (sin(uTime*(1.7 + aF.y) + s) + 0.6*sin(uTime*3.1 + s*1.7))*0.16*y*y;
          vec3 p = base + right*(position.x + sway)*aAt.w + vec3(0.0, y*aF.x, 0.0);
          p.x -= y*y*aF.x*0.22;                                // the wind leans everything west
          vQ = vec2(position.x, y); vF = aF; vW = p;
          gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.0);
        }`,fragmentShader:`precision highp float;
        ${U}
        varying vec2 vQ; varying vec4 vF; varying vec3 vW;
        void main(){
          float x = vQ.x, y = clamp(vQ.y, 0.0, 1.0), s = vF.y*53.0;
          float n = nlF(vec2(x*1.3 + s, y*2.1 - uTime*(1.5 + 0.8*vF.y))), n2 = nlN(vec2(x*3.1 - s, y*5.0 - uTime*3.4));
          float wdt = pow(max(1.0 - y, 0.0), 0.6)*(0.42 + 0.7*n);
          float hi = max(wdt, 1e-3);
          float body = (1.0 - smoothstep(hi*0.35, hi, abs(x + 0.25*(n2 - 0.5)*y)))*smoothstep(0.0, 0.07, y);
          float tongue = smoothstep(0.3, 0.7, n + 0.55*(1.0 - y) - 0.25)*body;
          float core = tongue*(1.0 - smoothstep(0.0, 0.55, y))*(1.0 - smoothstep(0.0, 0.6, abs(x)));
          vec3 cA = mix(vec3(0.62, 0.028, 0.018), vec3(0.05, 0.16, 0.85), vF.z), cB = mix(vec3(0.75, 0.1, 0.035), vec3(0.3, 0.42, 0.9), vF.z);
          vec3 c = cA*(0.8*tongue*(1.15 - 0.8*y)) + cB*core*0.45;
          // the heat standing over a pit: a faint column that wavers
          float wisp = smoothstep(0.35, 0.8, nlF(vec2(x*1.6 + s, y*1.4 - uTime*0.5)))*pow(max(1.0 - x*x, 0.0), 2.0)*smoothstep(0.0, 0.12, y)*(1.0 - y)*(1.0 - y);
          c = mix(c, cA*0.16*wisp, vF.w);
          float fogK = 1.0 - nlFogAmount(vW, uFog.x*0.7);
          vec3 toE = cameraPosition - vW;
          gl_FragColor = vec4(c*fogK*smoothstep(3.0, 12.0, length(toE)), 1.0);
        }`}),x=new n.Mesh(t,l);x.name="flames",x.renderOrder=3,i.add(x)}await c.yield();const u=s.fxGroup();i.add(u.object);const b=e.pits.map(t=>({p:t,d:g.path.nearestXZ(t.x,t.z).dist})).sort((t,a)=>t.d-a.d).slice(0,Math.round(5*(g.detail??1))),A=[.35,.45,-.82];for(const t of[...b.map(a=>a.p),{...e.kiln,r:12,kind:0}])u.add(s.makeSmokeColumn({rng:h.smoke.fork("column"),time:w,position:[t.x,t.y+1.5,t.z],height:t.r*h.smoke.range(10,14),radius:[t.r*.3,t.r*2.2],size:[t.r*.5,t.r*2.3],count:96,color:"#2b2826",colorTop:"#48433d",shadowColor:"#0a080a",ambient:"#0b0a0c",hot:t.kind?"#1d3c98":"#8a2a18",hotFalloff:9,opacity:.38,rate:.045,ragged:1.6,softness:.9,billow:.2,wind:[-3,0,.5],bend:.55,rim:.9,scatter:.6,sunDir:A,sunColor:"#8a6030"})),await c.yield();const F=m.filter(t=>t.pit).map(t=>t.kind?"#3C66E0":"#A3211B");u.add(s.makeGlows({rng:h.haze,positions:m.filter(t=>t.pit).map(t=>[t.x,t.y+t.r*.9,t.z]),sizes:m.filter(t=>t.pit).map(t=>t.r/10),colors:F,size:46,intensity:.3,core:0,halo:1,flicker:.16,near:[.4,1.4],minAngle:0,fogAmount:.4,time:w,renderOrder:2})),u.add(s.makeGlows({rng:h.holeglows,positions:e.holes.map(t=>[t.x,t.y+1.2,t.z]),colors:e.holes.map(t=>t.kind?"#3C66E0":"#A3211B"),size:9,intensity:.5,core:.15,halo:1,flicker:.3,near:[.4,1.4],minAngle:.0016,fogAmount:.4,time:w,renderOrder:2})),u.add(s.makeGlows({rng:h.fireglows,positions:e.farFires.map(t=>[t.x,t.y+t.r*.6,t.z]),sizes:e.farFires.map(t=>t.r/4),colors:e.farFires.map(t=>t.kind?"#3C66E0":"#A3211B"),size:24,intensity:1,core:.35,halo:1,flicker:.35,near:[.4,1.4],minAngle:.0022,fogAmount:.35,time:w,renderOrder:2})),await c.yield();for(const t of e.pits.slice(0,2))u.add(s.makeParticles({rng:t.name==="A"?h.sparksA:h.sparksB,preset:"sparks",time:w,follow:!1,count:Math.round(260*(g.detail??1)),center:[t.x-4,t.y+13,t.z],box:[t.r*2.6,26,t.r*2.6],size:[.05,.15],colors:t.kind?["#5a86ff","#9fb8ff","#3C66E0"]:["#ff3a22","#d0241a","#ff6a4a"],intensity:2.2,velocity:[-2.2,5.5,.3]})),await c.yield();return{group:i,set:u,triangles:m.length*14+v.length/8*2,update(t,a,l){u.update(t,a,l)}}}async function jt(c,p,e,s,w,g,h){const r=[],i=[],m=[],v=(y,M)=>{const T=r.length/3;for(let j=0;j<5;j++){const B=j/5*6.2832+y*2;r.push(Math.cos(B)*M,y,Math.sin(B)*M),i.push(Math.cos(B)*.8,.25+y*.6,Math.sin(B)*.8)}return T},u=v(0,.92),b=v(.5,1),A=v(.86,.6);r.push(0,1,0),i.push(0,1,0);const F=r.length/3-1;for(let y=0;y<5;y++){const M=(y+1)%5;m.push(u+y,b+M,u+M,u+y,b+y,b+M,b+y,A+M,b+M,b+y,A+y,A+M,A+y,F,A+M)}const t=new n.InstancedBufferGeometry;t.setAttribute("position",new n.Float32BufferAttribute(r,3)),t.setAttribute("normal",new n.Float32BufferAttribute(i,3)),t.setIndex(m);const a=[],l=[],x=[],z=[0,0,0],R=e.holes.filter(y=>w.nearestXZ(y.x,y.z).dist<150),d=[...R,...e.pits.filter(y=>w.nearestXZ(y.x,y.z).dist<150)];let P=0;for(;a.length/4<g&&P++<g*30;){let y,M;const T=h();if(T<.6&&d.length){const q=h.pick(d),E=h()*6.283,_=q.r*(q.y!==void 0&&q.r>5?h.range(1.5,2.6):h.range(1.5,5.5+4*h()));y=q.x+Math.cos(E)*_,M=q.z+Math.sin(E)*_}else if(T<.78){const q=h()*6.283,E=h.range(.92,1.2),_=Math.cos(q)*e.W.len/2*E,O=Math.sin(q)*e.W.wid/2*E;if(O>30)continue;y=e.W.c[0]+e.W.f[0]*_+e.W.r[0]*O,M=e.W.c[1]+e.W.f[1]*_+e.W.r[1]*O}else{const q=e.at(h.range(-.08,.98)*e.legLen,h.range(-125,125)*Math.sqrt(h()));y=q[0],M=q[1]}const j=w.nearestXZ(y,M);if(j.dist<7||j.dist>150||St(y,M)<14||Math.abs(M-rt(y))<8||Math.hypot(y-e.dome.x,M-e.dome.z)<e.dome.r+4)continue;let B=!1;for(const q of e.pits)if(Math.hypot(y-q.x,M-q.z)<q.r*1.3){B=!0;break}if(B)continue;const V=h.range(.6,1.5)*(h.chance(.2)?1.5:1),J=e.heightAt(y,M);a.push(y,J-.12*V,M,h()*6.283),l.push(V*h.range(.9,1.6),V,h(),0),wt(s,y,M,z),x.push(z[0],z[1],z[2]),(a.length&1023)===0&&await c.yield()}t.setAttribute("aAt",new n.InstancedBufferAttribute(new Float32Array(a),4)),t.setAttribute("aV",new n.InstancedBufferAttribute(new Float32Array(l),4)),t.setAttribute("aGlow",new n.InstancedBufferAttribute(new Float32Array(x),3)),t.instanceCount=a.length/4;const G=e.at(.5*e.legLen,0);t.boundingSphere=new n.Sphere(new n.Vector3(G[0],0,G[1]),560);const W=new n.ShaderMaterial({uniforms:{...p.uniforms},vertexShader:`
      ${U}
      attribute vec4 aAt; attribute vec4 aV; attribute vec3 aGlow;
      varying vec3 vCol; varying vec3 vW;
      void main(){
        float ca = cos(aAt.w), sa = sin(aAt.w), s = aV.z*40.0;
        vec3 p = position*vec3(aV.x, aV.y, aV.x);
        // tips tremble in the heat draughts
        float tr = position.y*position.y;
        p.x += tr*0.07*aV.y*sin(uTime*(5.0 + 3.0*aV.z) + s); p.z += tr*0.06*aV.y*sin(uTime*(4.1 + 2.0*aV.z) + s*1.7);
        vec3 wp = vec3(p.x*ca + p.z*sa, p.y, -p.x*sa + p.z*ca) + aAt.xyz;
        vec3 N = normalize(vec3(normal.x*ca + normal.z*sa, normal.y, -normal.x*sa + normal.z*ca));
        vec3 toE = cameraPosition - wp; vec3 V = toE/max(length(toE), 1e-3);
        vec3 alb = mix(vec3(0.012, 0.02, 0.014), vec3(0.085, 0.105, 0.085), position.y*position.y*(0.5 + 0.5*aV.z));   // black-green, a grey bloom on top
        float fr = 1.0 - max(dot(N, V), 0.0);
        vCol = nlKey(wp, N, V, alb*1.5, 0.1) + nlPales(wp, N, V, alb, 0.5) + nlRing(wp, N, alb) + alb*vec3(0.004, 0.0045, 0.007) + (alb*0.8 + 0.012*fr*fr + 0.002)*aGlow*(0.75 + 0.25*sin(uTime*3.0 + s));
        vW = wp;
        gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
      }`,fragmentShader:`precision highp float;
      ${U}
      varying vec3 vCol; varying vec3 vW;
      void main(){ gl_FragColor = vec4(nlFog(vCol, vW), 1.0); }`}),N=new n.Mesh(t,W);return N.name="moss",{mesh:N,count:a.length/4,triangles:a.length/4*25}}const St=(c,p)=>Math.abs(tt(c,p));async function Vt(c,p,e,s,w,g,h){const r=new n.DodecahedronGeometry(1,0),i=new n.InstancedBufferGeometry;i.setAttribute("position",r.attributes.position),i.setAttribute("normal",r.attributes.normal);const m=[],v=[],u=[],b=[0,0,0,0,0];let A=0;for(;m.length/4<h&&A++<h*60;){const z=g.range(-4700,4700),R=g.range(1200,5600),d=g(),P=1.2+4.8*d*d*d,G=g()*6.283,W=g.range(.8,1.35),N=g.range(.5,.95),y=g.range(.8,1.35),M=g(),T=g();(A&1023)===0&&await c.yield();const j=tt(z,R);if(j<0||T>Math.pow(.5,j/300)||!e.okSpot(z,R,P,8))continue;let B=!1;for(const V of e.holes)if(Math.hypot(z-V.x,R-V.z)<V.r+P+2){B=!0;break}B||(m.push(z,e.heightAt(z,R)-.3*P*N,R,G),v.push(P*W,P*N,P*y,M),kt(w,z,R,b),u.push(b[0],b[1],b[2],b[3],b[4]))}const F=m.length/4,t=new Float32Array(F*3),a=new Float32Array(F*2);for(let z=0;z<F;z++)t[z*3]=u[z*5],t[z*3+1]=u[z*5+1],t[z*3+2]=u[z*5+2],a[z*2]=u[z*5+3],a[z*2+1]=u[z*5+4];i.setAttribute("aAt",new n.InstancedBufferAttribute(new Float32Array(m),4)),i.setAttribute("aS",new n.InstancedBufferAttribute(new Float32Array(v),4)),i.setAttribute("aGlow",new n.InstancedBufferAttribute(t,3)),i.setAttribute("aLd",new n.InstancedBufferAttribute(a,2)),i.instanceCount=F,i.boundingSphere=new n.Sphere(new n.Vector3(0,0,0),3200);const l=new n.ShaderMaterial({uniforms:{...p.uniforms},vertexShader:`
      ${U}
      attribute vec4 aAt; attribute vec4 aS; attribute vec3 aGlow; attribute vec2 aLd;
      varying vec3 vCol; varying vec3 vW;
      void main(){
        float ca = cos(aAt.w), sa = sin(aAt.w);
        // every corner pushed in or out a little, by its own place on the block, so no two blocks are alike
        vec3 p = position*aS.xyz*(0.78 + 0.44*nlH(position.xy*7.3 + position.z*3.1 + aS.w*31.0));
        vec3 wp = vec3(p.x*ca + p.z*sa, p.y, -p.x*sa + p.z*ca) + aAt.xyz;
        vec3 n0 = normalize(normal/aS.xyz);
        vec3 N = normalize(vec3(n0.x*ca + n0.z*sa, n0.y, -n0.x*sa + n0.z*ca));
        vec3 toE = cameraPosition - wp; vec3 V = toE/max(length(toE), 1e-3);
        vec3 alb = vec3(0.075, 0.07, 0.072)*(0.7 + 0.6*aS.w)*(0.55 + 0.45*smoothstep(-0.5, 0.6, position.y));
        vec3 c = nlKey(wp, N, V, alb, 0.25) + alb*vec3(0.004, 0.0045, 0.007);      // (the house's light; the fires' below. No pale lamp, no lamp chosen by the route.)
        float rd = nlRingD(wp.xz); vec2 rg = nlRingN(wp.xz);
        float hd = max(rd, 0.0), houseL = 1.0/(1.0 + hd/260.0 + hd*hd/(900.0*900.0));
        // (second part, G1b: a block is a dark shape; only what turns square to the house takes a faint edge of its light)
        float hk = max(dot(N, normalize(vec3(-rg.x, 0.35, -rg.y))), 0.0);
        c += alb*uKeyCol*(0.3*houseL*hk*hk*hk);
        // (beside a great pit the firelight on a block is held to 0.8, as the ground's pool is held)
        float gs = aGlow.r + aGlow.g + aGlow.b;
        c += (alb + 0.008)*aGlow*(min(1.0, 0.8/max(gs, 1e-3))*(0.04 + 3.0*max(dot(N, normalize(vec3(aLd.x, 0.25, aLd.y))), 0.0)));
        vCol = c; vW = wp;
        gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
      }`,fragmentShader:`precision highp float;
      ${U}
      varying vec3 vCol; varying vec3 vW;
      // (the stone is mottled, in patches of a metre or so, so that a block's flat sides are not of one tone)
      void main(){ gl_FragColor = vec4(nlFog(vCol*(0.72 + 0.56*nlN(vW.xz*1.3 + vW.y*1.9)), vW), 1.0); }`}),x=new n.Mesh(i,l);return x.name="boulders",{mesh:x,count:F,triangles:F*36}}export{nt as GLOW_BOX,st as GLOW_FAR,it as GLOW_WIDE,mt as RING_OUT,vt as ROAD_Z,Vt as buildBoulders,Dt as buildDome,Tt as buildFires,It as buildGround,jt as buildMoss,qt as buildRing,Ct as buildSky,Gt as glowLights,Nt as makeGlowMap,Wt as makeLayout,tt as ringDist,Ft as ringPoints,rt as roadZ,kt as wideAt,Bt as wideLights};
