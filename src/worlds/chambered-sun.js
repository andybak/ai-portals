import*as l from"three";import{mergeGeometries as Ut}from"three/addons/utils/BufferGeometryUtils.js";import{makePath as Dt,clamp as vt,lerp as nt,smoothstep as lt}from"../kit/core.js";import{buildHero as Gt,SHELL_LIGHT as Et}from"../parts/chambered-sun.js";const st=Math.PI*2,bt=Math.PI/180,D=(e,u,n)=>new l.Vector3(e,u,n),It={ivory:["#F3E9E2","#E8B7C4","#9FD8C6"],black:["#8F8D9E","#4FA596","#86E0BC"],honey:["#F1DCAE","#F2B58A","#C6E2B4"]};function Nt(e){const u=e.rng.fork?e.rng.fork("chambered-vary"):e.rng,n=e.vary?.hour||"any";let a=u.pick(["summer","summer","blossom","harvest"]),o=u.pick(["clear","heavy","still"]),g=u.pick(["ivory","ivory","black","honey"]);const f=u.pick(["egret","egret","ibis"]),F=u.chance(.2),A=F?40:u.int(8,20),t=u.pick(["#EFE6D2","#FAF7F0","#F0DDB4"]);n==="dawn"&&(a="blossom"),n==="golden"&&(a="harvest",g="honey"),n==="night"&&(g="black"),n==="day"&&(g="ivory",o=o==="heavy"?"clear":o);const y=It[g],z=[y[0],y[1],y[2],"#FFE6A3",a==="harvest"?"#A58C3A":"#3F8F6A","#5B4A78","#0A0C1E"];return{season:a,weather:o,nacre:g,cast:f,regatta:F,boats:A,sail:t,palette:z,rare:!!e.vary?.rare,density:vt(e.vary?.density??1,.7,1.3),detail:vt(e.quality?.detail??1,.6,1)}}function kt(e,u){if(e.fork)return e.fork(u);let n=Math.floor(e()*4294967296)>>>0;const a=()=>{n=n+1831565813|0;let o=Math.imul(n^n>>>15,1|n);return o=o+Math.imul(o^o>>>7,61|o)^o,((o^o>>>14)>>>0)/4294967296};return a.range=(o,g)=>o+(g-o)*a(),a.chance=o=>a()<o,a.pick=o=>o[Math.floor(a()*o.length)],a}const Rt=(e,u)=>{let n=e-u;return n=Math.atan2(Math.sin(n),Math.cos(n)),30*(1+.24*Math.exp(-n*n*8))};function St(e){const u=20*bt,n=116,a=150,o=215,f=D(n*Math.sin(u),-n*Math.cos(u),e.spur.neckReach-o-30),F=D(-f.x,-f.y,0).normalize(),A=D(0,0,1),t=new l.Vector3().crossVectors(F,A),y=(s,c,R,r=new l.Vector3)=>r.copy(f).addScaledVector(t,s).addScaledVector(F,c).addScaledVector(A,R),z=(s,c=new l.Vector3)=>{const R=s.x-f.x,r=s.y-f.y,m=s.z-f.z;return c.set(R*t.x+r*t.y,R*F.x+r*F.y,m)},w=72*bt,p=201.5,h=[p*Math.cos(w),p*Math.sin(w)],i=Rt(w,w),v=n-42;return{c:f,off:n,RW:a,RR:o,X:t,Y:F,Z:A,world:y,local:z,towerAng:w,tl:h,headH:i,towerH:v,towerFoot:y(h[0],i,h[1]),towerTip:y(h[0],v,h[1])}}async function jt(e,u){const n=(d,M,x)=>e.wall(2,d,M*bt,x).position,a=[D(170,6,-232),D(156,5,-172),D(142,3,-112),D(124,1,-48),D(98,0,22),D(60,0,100),D(20,0,165),D(0,0,218),D(0,-3,262),D(-52,-40,322),D(-128,-118,392),D(-168,-205,462),D(-140,-282,528),n(585,-6,22),n(628,4,22),n(672,15,22),n(712,26,19),n(748,36,16),n(782,45,17),D(206,-176,850),D(114,-88,931),D(38,-10,1005),D(26,22,1090),D(25,30,1200),D(75,-5,1310),D(185,-125,1410),D(240,-250,1530),D(150,-240,1760),D(14,-90,2010),D(-20,-30,2228)],o=e.portalSeat.position,g=e.portalSeat.forward;a.push(D(-112,-28,2450),D(-320,46,2545),D(-490,90,2650),D(-556,34,2764),D(-446,-70,2854),D(-282,-100,2892),D(-130,-102,2925),D(-14,-86,2995),D(68,-42,3078),D(160,-6,3152),D(262,16,3214),D(330,32,3284),D(334,34,3354),D(272,26,3414),D(188,14,3462),D(80,4,3500),D(18,0,3528),D(0,0,3560),D(0,0,3660),D(0,0,3760),D(0,0,3860),o.clone());const f=Dt(a,{samples:640});await u.yield();const F=new l.Vector3,A=d=>{let M=0,x=.7;for(let C=0;C<30;C++){const _=(M+x)/2;f.pointAt(_,F),F.z<d?M=_:x=_}return(M+x)/2},t={};for(const[d,M]of[["door1",222],["lake0",585],["boat",650],["lake1",748],["terr",782],["shaft2",900],["door2",1022],["sink",1400],["flock2",1560],["door3",2222]])t[d]=A(M),await u.yield();const y=d=>{let M=.5+.55*lt(t.door1-.02,t.door1+.02,d);return M-=.5*lt(t.lake0-.035,t.lake0-.005,d)*(1-lt(t.terr,t.terr+.03,d)),M+=.4*lt(t.door2-.03,t.door2+.03,d)*(1-lt(t.door3-.04,t.door3+.05,d)),M},z=e.mouth.center,w=e.mouth.radius+34,p=(d,M,x)=>{let C=d,_=1/0;for(let q=0;q<=600;q++){const S=nt(d,M,q/600),J=x(f.pointAt(S,F));J<_&&(_=J,C=S)}return C},h=(d,M,x)=>{for(let C=0;C<=1200;C++){const _=nt(d,M,C/1200);if(x(f.pointAt(_,F)))return _}return M};t.sunA=A(-60),t.sunB=A(60),t.axis1=h(t.sunB,t.door1,d=>Math.hypot(d.x,d.y)<20),t.swing=p(t.door1,t.lake0,d=>d.x),t.crest=p(t.door2,t.sink,d=>-d.y),t.low=p(t.sink,t.door3,d=>d.y),await u.yield(),t.top=p(t.door3,1,d=>-d.y),t.dip=p(t.top,1,d=>d.y),t.bend=p(t.dip,1,d=>-Math.hypot(d.x,d.y));const i=St(e);await u.yield();const v=new l.Vector3,s=(d,M)=>x=>(i.local(x,v),Math.hypot(v.x-d,v.z-M));t.rimIn=h(t.top,1,d=>s(0,0)(d)<i.RR),t.wide=p(t.top,t.rimIn,d=>-Math.hypot(d.x,d.y)),t.lagoon=p(t.rimIn,1,s(0,0)),t.tower=p(t.lagoon,1,s(i.tl[0],i.tl[1])),t.rimOut=h(t.lagoon,1,d=>s(0,0)(d)>i.RR),t.axis=h(t.bend,1,d=>Math.hypot(d.x,d.y)<2);{let d=1/0;const M=new l.Vector3;for(let x=0;x<=200;x++){const C=nt(t.bend,t.axis,x/200);f.tangentAt(C,M),M.x<d&&(d=M.x,t.turn=C)}}await u.yield();const c=f.length,R=o,r=f.pointAt(t.bend,new l.Vector3),m=Math.atan2(r.y,r.x),V=d=>D(z.x+w*Math.cos(d),z.y+w*Math.sin(d),z.z),H=i.world(i.tl[0],(i.headH+i.towerH)/2,i.tl[1]),U=V(Math.PI/2),T=V(m+.75*Math.PI),B=[[D(46,0,40),-1,-.5,t.sunA,t.sunB,.62],[D(0,0,222),t.sunA,t.sunB,t.sunB,t.axis1,.6],[D(0,-40,1010),t.sunB,t.axis1,t.door1,t.swing,.6],[e.wall(2,690,16*bt,0).position,t.door1,t.swing,t.boat,t.lake1,.7],[D(0,0,1010),t.lake1,t.terr,t.shaft2,t.door2,.55],[D(0,0,2222),t.door2,t.crest,t.sink,t.flock2,.5],[D(330,-170,2150),t.sink,t.flock2,t.low,t.door3,.62],[z,t.low,t.door3,t.door3,t.top,.9]],K=new l.Vector3,N=new l.Vector3,L=new l.Vector3,at=new l.Vector3,O=new l.Vector3,X=new l.Vector3,Y=[[t.door3,[z,1]],[t.top,[i.c,.6],[z,.4]],[t.wide,[i.c,.7],[H,.3]],[t.rimIn,[H,.45],[z,.35],[U,.2]],[t.lagoon,[z,.55],[H,.2],[U,.25]],[t.rimOut,[R,.6],[U,.2],[T,.2]],[t.bend,[R,.25],[T,.75]],[t.turn,[R,.4],[T,.6]],[t.axis,[R,1]]],W=Y.map(d=>d[0]),tt=Y.map(([d,...M])=>{f.pointAt(d,K);const x=new l.Vector3;for(const[C,_]of M)x.addScaledVector(N.copy(C).sub(K).normalize(),_);return x.normalize()});W.push(1.02),tt.push(g.clone());const it=tt.map((d,M)=>{const x=Math.max(0,M-1),C=Math.min(tt.length-1,M+1);return tt[C].clone().sub(tt[x]).multiplyScalar(M>=tt.length-2?0:1/(W[C]-W[x]))}),et=(d,M)=>{let x=0;for(;x<W.length-2&&d>W[x+1];)x++;const C=W[x+1]-W[x],_=vt((d-W[x])/C,0,1),q=_*_,S=q*_;return M.copy(tt[x]).multiplyScalar(2*S-3*q+1).addScaledVector(it[x],(S-2*q+_)*C).addScaledVector(tt[x+1],-2*S+3*q).addScaledVector(it[x+1],(S-q)*C).normalize()},Z=(d,M)=>{f.pointAt(d,K),f.posAtDist(d*c+150,M).sub(K).normalize();for(const[C,_,q,S,J,ot]of B){const j=ot*lt(_,q,d)*(1-lt(S,J,d));j<=0||(N.copy(C).sub(K).normalize(),M.multiplyScalar(1-j).addScaledVector(N,j).normalize())}const x=lt(t.door3,t.top,d);return x>0&&M.multiplyScalar(1-x).addScaledVector(et(d,N),x).normalize(),M},P=400,k=new Float32Array((P+1)*3),E=Math.cos(1.8*bt),Q=Math.cos(1.81*bt);for(let d=0;d<=P;d++)Z(d/P,O),k[d*3]=O.x,k[d*3+1]=O.y,k[d*3+2]=O.z,d%20===19&&await u.yield();let $=0;for(let d=0;d<900;d++){let M=0;$=d;for(let x=1;x<P;x++){const C=(x-1)*3,_=x*3,q=(x+1)*3,S=k[C]*k[_]+k[C+1]*k[_+1]+k[C+2]*k[_+2],J=k[q]*k[_]+k[q+1]*k[_+1]+k[q+2]*k[_+2];if(!(S>E&&J>E)){(S<=Q||J<=Q)&&M++;for(let ot=Math.max(1,x-3);ot<=Math.min(P-1,x+3);ot++){const j=ot*3;let ht=k[j-3]+k[j+3]+2*k[j],xt=k[j-2]+k[j+4]+2*k[j+1],ft=k[j-1]+k[j+5]+2*k[j+2];const mt=1/(Math.hypot(ht,xt,ft)||1);k[j]=ht*mt,k[j+1]=xt*mt,k[j+2]=ft*mt}}}if(!M)break;d%5===4&&await u.yield()}{const d=new Float32Array(k.length);for(let M=0;M<3;M++){for(let x=0;x<=P;x++){let C=0,_=0,q=0;for(let j=-4;j<=4;j++){const ht=vt(x+j,0,P)*3;C+=k[ht],_+=k[ht+1],q+=k[ht+2]}const S=x/P,J=lt(t.sunB,t.door1,S),ot=1/(Math.hypot(C,_,q)||1);d[x*3]=nt(k[x*3],C*ot,J),d[x*3+1]=nt(k[x*3+1],_*ot,J),d[x*3+2]=nt(k[x*3+2],q*ot,J)}for(let x=0;x<=P;x++){const C=x*3,_=1/(Math.hypot(d[C],d[C+1],d[C+2])||1);k[C]=d[C]*_,k[C+1]=d[C+1]*_,k[C+2]=d[C+2]*_}await u.yield()}}const rt=(d,M)=>{const x=vt(d,0,1)*P,C=Math.min(P-1,Math.floor(x)),_=x-C,q=C*3;return M.set(nt(k[q],k[q+3],_),nt(k[q+1],k[q+4],_),nt(k[q+2],k[q+5],_)).normalize()},b=.92,I=[{at:(d,M)=>{rt(M,L),f.pointAt(M,K),f.posAtDist(M*c+60,at).sub(K).normalize();const x=b*lt(0,.04,M)*(1-lt(.93,.985,M)),C=L.dot(at),_=(1-x)*C+Math.sqrt(Math.max(0,x*x-(1-x)*(1-x)*(1-C*C)));return X.copy(L).multiplyScalar(_).addScaledVector(at,-(1-x)),X.lengthSq()<1e-8&&X.copy(L),X.normalize().multiplyScalar(1e3).add(K)},from:-1,to:2,weight:b}];return t.relaxed=$,{path:f,U:t,H:i,pace:y,uAtZ:A,pois:I,gazeDir:rt,marks:{lipArch:T.toArray(),lipTop:U.toArray(),spire:H.toArray()}}}function Lt(e){const u=new l.ShaderMaterial({uniforms:{uInk:{value:new l.Color(e.V.palette[6])},uTime:{value:0}},side:l.BackSide,depthWrite:!1,fog:!1,vertexShader:"varying vec3 vDir; void main(){ vDir = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.); gl_Position = p; }",fragmentShader:`
uniform vec3 uInk; uniform float uTime; varying vec3 vDir;
float h13(vec3 p){ p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yxz + 33.33); return fract((p.x + p.y) * p.z); }
void main(){
  vec3 d = normalize(vDir + vec3(0., 1e-4, 0.));
  vec3 c = uInk * (.55 + .5 * smoothstep(-.6, .7, d.y)) + vec3(.012, .016, .04) * smoothstep(.2, 1., d.z);
  float bd = dot(d, normalize(vec3(.55, .8, -.25))) * 3.2; float band = exp(-bd * bd);          // a river of faint stars across the dark
  float pxd = max(fwidth(d.x), max(fwidth(d.y), fwidth(d.z)));          // one pixel, as a change of direction
  vec3 di = floor(d * 420.);
  float dust = h13(di) * h13(floor(d * 260.) + 4.) * (.60 + .03 * sin(uTime * (1.2 + 2.5 * h13(di + 2.)) + h13(di + 9.) * 40.));
  c += band * (vec3(.05, .06, .11) + vec3(.5, .55, .75) * smoothstep(.72, 1., dust) * .5);
  for (int k = 0; k < 3; k++) {
    float sc = k == 0 ? 46. : k == 1 ? 90. : 170.;
    vec3 q = d * sc, id = floor(q), f = q - id - .5;
    float h = h13(id + float(k) * 17.), on = step(k == 0 ? .88 : .80, h);
    vec3 o = (vec3(h13(id + 3.1), h13(id + 7.7), h13(id + 11.3)) - .5) * .5;
    float r = length(f - o), w = max(k == 0 ? .085 : k == 1 ? .10 : .14, 1.25 * pxd * sc);      // never under a pixel and a quarter across
    float w0 = k == 0 ? .085 : k == 1 ? .10 : .14, dim = k == 0 ? max(.5, w0 / w) : (w0 * w0) / (w * w);      // small stars spread over a pixel keep their light, not their size
    float b = dim * on * (1. - smoothstep(w * .4, w, r)) * (k == 0 ? 5. : k == 1 ? 2.4 : 1.1) * (.4 + h13(id + 5.5)) * (.68 + .03 * sin(uTime * (1.4 + 3. * h13(id + 1.3)) + h * 60.));
    c += b * mix(vec3(.75, .84, 1.), vec3(1., .9, .74), h13(id + 9.9));
  }
  gl_FragColor = vec4(c, 1.);
}`}),n=new l.Mesh(new l.IcosahedronGeometry(8200,4),u);n.renderOrder=-1,n.frustumCulled=!1,n.name="stars",e.scene.add(n),e.onUpdate.push((a,o,g)=>{n.position.setFromMatrixPosition(g.matrixWorld),u.uniforms.uTime.value=o})}const Vt=`
attribute vec3 iPos; attribute vec4 iRot;
vec3 wUp, wFwd, wSide;
void wallFrame(){
  wUp = normalize(vec3(-iPos.xy, 0.) + vec3(0., 1e-4, 0.));             // rho is never under 100 m
  vec3 tang = vec3(-wUp.y, wUp.x, 0.);
  float cy = cos(iRot.x), sy = sin(iRot.x);
  wFwd = vec3(0., 0., 1.) * cy + tang * sy;
  wSide = tang * cy - vec3(0., 0., 1.) * sy;
}
vec3 wallPoint(vec3 l){ return iPos + (wSide * l.x + wUp * l.y + wFwd * l.z) * iRot.y; }
vec3 wallDir(vec3 l){ return wSide * l.x + wUp * l.y + wFwd * l.z; }
`;var Ve={id:"chambered-sun",name:"The Chambered Sun",category:"alien",weirdness:.65,media:["air","interior"],async build(e){const u=Nt(e),n=new l.Scene;n.background=new l.Color("#0A0C1E");const a=await Gt(e,{palette:u.palette,detail:u.detail,season:u.season==="blossom"?"blossom":"summer",view:"country"});n.add(a.object),await e.yield();const o=a.anchors,g=await jt(o,e);await e.yield();const f={ctx:e,scene:n,hero:a,A:o,V:u,H:g.H,path:g.path,U:g.U,uAtZ:g.uAtZ,gazeDir:g.gazeDir,subjects:{},sh:a.uniforms,onUpdate:[],onDispose:[],patch:[],rng:e.rng.fork?e.rng.fork("chambered-world"):e.rng};a.setHaze(u.weather==="heavy"?1700:u.weather==="still"?2500:2100),f.subjects.tower=f.H.towerTip.toArray(),f.subjects.harbour=f.H.c.toArray(),f.subjects.spurTop=o.spur.top.toArray(),f.subjects.spurRoot=o.spur.root.toArray(),Object.assign(f.subjects,g.marks),Lt(f),await e.yield();for(const z of pt)await z(f),await e.yield();const F=o.parts,A=f.U,t=e.renderer,y=new l.Vector2;return{scene:n,path:f.path,duration:50,pace:g.pace,camera:{fov:68,near:.5,far:9e3,lookAhead:60,sway:.5,bank:.6},pois:g.pois,subjects:f.subjects,U:A,portal:{shape:"circle",radius:o.portalSeat.radius,color:"#DFF5EC",glow:1,revealDistance:1500},post:{exposure:1,bloom:{strength:.36,radius:.72,threshold:1},grade:{saturation:1.06,contrast:1.04,tint:"#fff9f0",shadowTint:"#0b0a1c",vignette:.28,grain:.02}},ride:"none",update(z,w,p,h){a.update(z,w,p);const i=a.uniforms.uCam.value.z,v=.47+.43*lt(40,420,i)+.1*lt(1e3,1500,i)+.15*lt(2200,2900,i),s=lt(A.terr,A.shaft2+.01,h)*(1-lt(A.door2-.005,A.door2+.02,h));a.setExposure(v*(1-.2*s)),a.uniforms.uExpo.value=v*(1-.2*s);const c=h<A.door2;F.chambers[0].visible=F.ribs.visible=c;const R=h<A.door2+.05;for(const r of f.patch)r.visible=R;t.getDrawingBufferSize(y);for(const r of f.onUpdate)r(z,w,p,h,y)},dispose(){for(const z of f.onDispose)z();a.dispose()}}}};const pt=[];function Xt(e){const u=e.sh.uNoise.value.image,n=u.width,a=u.data,o=(w,p,h)=>{let i=(w-Math.floor(w))*n-.5,v=(p-Math.floor(p))*n-.5;const s=Math.floor(i),c=Math.floor(v),R=i-s,r=v-c,m=(s+n)%n,V=(s+1+n)%n,H=(c+n)%n,U=(c+1+n)%n,T=a[(H*n+m)*4+h],B=a[(H*n+V)*4+h],K=a[(U*n+m)*4+h],N=a[(U*n+V)*4+h];return((T+(B-T)*R)*(1-r)+(K+(N-K)*R)*r)/255},g=st*360,f=w=>{const p=vt((w-120)/848,0,1);return 360*(.94+.06*Math.sin(Math.PI*Math.min(1,p*1.15)))},F=[0];for(let w=1;w<=40;w++){const p=120+848*(w-1)/40,h=120+848*w/40;F.push(F[w-1]+Math.hypot(h-p,f(h)-f(p)))}const A=w=>{const p=vt((w-120)/848,0,1)*40,h=Math.min(39,Math.floor(p));return nt(F[h],F[h+1],p-h)},t={h:0,lakeD:0,ter:!1,terFix:!1,forest:!1,water:!1,town:!1,river:!1},y=(w,p)=>{const h=p/st,i=A(w)/g;let v=.68*o(h,i,0)+.32*o(h*3+.37,i*3+.11,1);const s=Math.abs(p*345-69)-100,c=Math.abs(w-650)-70,R=Math.hypot(Math.max(s,0),Math.max(c,0))+Math.min(Math.max(s,c),0)-60+(o(h*4,i*4,3)-.5)*46;v=nt(v,.2,1-lt(0,60,R));const r=Math.abs(p*345-301)<78&&Math.abs(w-650)<150,m=r||v>.7&&v<.8,V=!m&&o(h*2+.6,i*2+.2,3)+.3*(v-.5)>.565,H=R<3||v<.315,U=!V&&!H&&!m&&v>.36&&o(h*5+.5,i*5+.3,1)>.81,T=o(h+.13,i+.71,2)+.08*o(h*6,i*6,3);return t.h=v,t.lakeD=R,t.ter=m,t.terFix=r,t.forest=V,t.water=H,t.town=U,t.river=Math.abs(T-.5)<.012,t},z=(w,p)=>{const h=Math.abs(p*345-69)-100,i=Math.abs(w-650)-70;return Math.hypot(Math.max(h,0),Math.max(i,0))+Math.min(Math.max(h,i),0)-60};e.land={at:y,r2:f,sAt:A,lakeBox:z}}pt.push(async e=>{Xt(e)});function Mt(e,u,n,a){const o=new l.InstancedBufferGeometry;o.index=e.index;for(const g in e.attributes)o.setAttribute(g,e.attributes[g]);return o.setAttribute("iPos",new l.InstancedBufferAttribute(new Float32Array(u),3)),o.setAttribute("iRot",new l.InstancedBufferAttribute(new Float32Array(n),4)),a&&o.setAttribute("iEx",new l.InstancedBufferAttribute(new Float32Array(a),4)),o.instanceCount=u.length/3,o}function ct(e,u,n,a={},o={}){return new l.ShaderMaterial({uniforms:{...l.UniformsUtils.clone(l.UniformsLib.fog),...e.sh,...a},vertexShader:u,fragmentShader:Et+n,fog:!0,...o})}function Ot(e){const u=[],n=[],a=[],o=[],g=[],f=(h,i,v,s,c,R,r,m,V,H)=>(u.push(h,i,v),n.push(s,c,R),a.push(r,m),o.push(V,H),u.length/3-1),A=e===0?6:e===1?4:3,t=e===0?3:1;for(let h=0;h<=t;h++)for(let i=0;i<=A;i++){const v=i/A*st,s=h/t,c=nt(.62,.34,s)+(h===0?.25:0);f(Math.cos(v)*c,s*9.2,Math.sin(v)*c,Math.cos(v),.1,Math.sin(v),i/A,s*9.2,0,s*s*.25)}for(let h=0;h<t;h++)for(let i=0;i<A;i++){const v=h*(A+1)+i,s=v+1,c=v+A+1,R=c+1;g.push(v,c,s,s,c,R)}const y=e===2?4:8,z=e===0?5:e===1?2:1,w=6.2;for(let h=0;h<y;h++){const i=(h+.5*(h%2)*.3)/y*st,v=Math.cos(i),s=Math.sin(i),c=.75+.5*(h*7%5)/4,R=[];for(let r=0;r<=z;r++){const m=r/z,V=.2+w*(m-.18*m*m),H=9.2+2.3*c*Math.sin(m*2)-3.4*m*m,U=(e===2?2:1.25)*Math.pow(Math.sin(Math.PI*(.1+.88*m)),.7)*(r===z?.12:1),T=2.3*c*2*Math.cos(m*2)-6.8*m,B=w*(1-.36*m),K=1/Math.hypot(T,B),N=-T*K*v,L=B*K,at=-T*K*s,O=U*.32,X=f(v*V,H,s*V,N,L,at,0,m,1,m),Y=f(v*V-s*U,H-O,s*V+v*U,N-s*.5,L,at+v*.5,-1,m,1,m),W=f(v*V+s*U,H-O,s*V-v*U,N+s*.5,L,at-v*.5,1,m,1,m);R.push([X,Y,W])}for(let r=0;r<z;r++){const[m,V,H]=R[r],[U,T,B]=R[r+1];g.push(m,V,U,V,T,U,m,U,H,H,U,B)}}if(e<2)for(let h=0;h<3;h++){const i=h/3*st+.5,v=Math.cos(i),s=Math.sin(i),c=f(v*.25,9.2,s*.25,v,.6,s,0,0,2,.3),R=f(v*.7,9.2+1.5,s*.7,v,.6,s,1,.5,2,.4),r=f(v*.35-s*.45,9.2+2.1,s*.35+v*.45,v,.6,s,0,1,2,.5),m=f(-s*.3+v*.1,9.2,v*.3+s*.1,v,.6,s,1,0,2,.3);g.push(c,m,R,m,r,R)}const p=new l.BufferGeometry;return p.setAttribute("position",new l.Float32BufferAttribute(u,3)),p.setAttribute("normal",new l.Float32BufferAttribute(n,3)),p.setAttribute("uv",new l.Float32BufferAttribute(a,2)),p.setAttribute("aK",new l.Float32BufferAttribute(o,2)),p.setIndex(g),p}const Zt=`
${Vt}
attribute vec2 aK; uniform float uTime;
varying vec2 vUv; varying vec3 vP; varying vec3 vN; varying vec3 vK;
#include <fog_pars_vertex>
void main(){
  wallFrame();
  float ph = iRot.z * 40. + uTime * (1.1 + .5 * fract(iRot.z * 7.));
  float sw = aK.y * (sin(ph + position.y * .35) * .55 + sin(ph * 2.3 + position.x) * .2);       // the wind blows down-shell
  vec3 p = wallPoint(position) + (vec3(0., 0., 1.) * (sw + aK.y * .6) + wUp * (sin(ph * 1.7 + position.z) * .3 * aK.y)) * iRot.y;
  vP = p; vN = wallDir(normal); vUv = uv; vK = vec3(aK.x, iRot.z, iRot.w);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Wt=`
varying vec3 vK; uniform float uBlossom;
void main(){
  float d = length(uCam - vP), teeth = 1. - smoothstep(50., 150., d);
  vec3 col;
  if (vK.x < .5) {
    col = mix(uViolet, uGold, .4) * .5 * (.84 + .16 * sin(vUv.y * 5.));
  } else if (vK.x < 1.5) {
    if (abs(vUv.x) > 1. - .55 * teeth * step(.5, fract(vUv.y * 15.))) discard;
    float rib = 1. - smoothstep(0., .14, abs(vUv.x));
    float pin = .8 + .2 * sin(vUv.y * 47. + abs(vUv.x) * 8.);
    vec3 g0 = uForest * vec3(.74, .98, .80), g1 = mix(uForest, uGold, .5) * vec3(.80, 1.05, .56);
    col = mix(g0 * .66, g1, smoothstep(.05, 1., vUv.y)) * mix(1., pin, teeth) * (.82 + .36 * fract(vK.y * 31.));
    col = mix(col, col * .5, rib * .6);
    float bl = uBlossom * step(.45, fract(vK.y * 13.7));
    col = mix(col, mix(uRose, vec3(.95, .9, .9), fract(vK.y * 5.3)) * .82, bl * (.35 + .65 * vUv.y));
  } else col = mix(uGold, uForest, .25) * 1.15;
  vec3 up = normalize(vec3(-vP.xy, 0.) + vec3(0., 1e-4, 0.));
  vec3 n = normalize(vN + up * .9 + vec3(0., 1e-4, 0.));
  vec3 lit = shellLight(vP, n, 1., 1., 1.);
  float ao = vK.x < .5 ? 1. - .45 * smoothstep(3., 8.5, vUv.y) : .7 + .3 * smoothstep(0., .5, vUv.y);
  vec3 c = col * lit * ao;
  // light through the fronds when we look toward the sun
  vec3 V = normalize(uCam - vP + vec3(1e-3, 0., 0.)), toSun = normalize(-vP + vec3(0., 0., 1e-3));
  float back = clamp(-dot(V, toSun), 0., 1.);
  c += col * keyColor(1.) * sunVis(vP, 1.) * back * back * .5 * step(.5, vK.x);
  c = hazed(c, vP) * uExpo;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`;function Qt(e){const u=[],n=new l.Vector3,a=e.path.length,o=e.uAtZ(1e3)*a;for(let g=e.uAtZ(240)*a;g<=o;g+=3)e.path.posAtDist(g,n),u.push(n.x,n.y,n.z);e.near2=(g,f,F)=>{let A=1e9;for(let t=0;t<u.length;t+=3){const y=u[t]-g,z=u[t+1]-f,w=u[t+2]-F,p=y*y+z*z+w*w;p<A&&(A=p)}return Math.sqrt(A)}}pt.push(async e=>{Qt(e);const{ctx:u,rng:n,V:a,land:o}=e,g=a.detail*a.density,f=[{pos:[],rot:[],cap:620},{pos:[],rot:[],cap:Math.round(2300*Math.min(1,g))},{pos:[],rot:[],cap:Math.round(5200*Math.min(1,g))}];e.fernTops=[];let F=0;for(let t=292;t<962;t+=6.5)for(let y=-470;y<640;y+=6.5){++F%100===0&&await u.yield();const z=t+n.range(-3,3),w=(y+n.range(-3,3))/345,p=n.range(.74,1.3),h=n(),i=n(),v=n()*st,s=o.at(z,w);if(s.water||s.town||s.terFix||s.river)continue;const c=s.lakeD>30&&s.lakeD<66;if(!(s.forest?h<.8:c?h<.2:s.ter?h<.02:h<.03))continue;const R=o.r2(z)+.4,r=R*Math.sin(w),m=-R*Math.cos(w),V=e.near2(r,m,z);if(V<12*p*1.1+8)continue;const H=V<62?0:V<165?1:V<430?2:-1;if(H<0||H>0&&i>g*(H===1?.85:.6))continue;const U=f[H];U.pos.length/3>=U.cap||(U.pos.push(r,m,z),U.rot.push(v,p*(s.forest?1:.85),i,H),V<120&&e.fernTops.length<900&&e.fernTops.push(r,m,z,p))}await u.yield();{const t=[202,78,22],y=f.map(p=>p.pos.length/3),z=y[1]*t[1]+y[2]*t[2],w=vt((165e3-y[0]*t[0])/Math.max(1,z),.35,1);if(w<1)for(let p=1;p<3;p++){const h=f[p],i=[],v=[],s=w*g*(p===1?.85:.6);for(let c=0;c<y[p];c++)h.rot[c*4+2]<s&&(i.push(h.pos[c*3],h.pos[c*3+1],h.pos[c*3+2]),v.push(h.rot[c*4],h.rot[c*4+1],h.rot[c*4+2],h.rot[c*4+3]));h.pos=i,h.rot=v}}await u.yield();const A=ct(e,Zt,Wt,{uBlossom:{value:a.season==="blossom"?1:0}},{side:l.DoubleSide});for(let t=0;t<3;t++){const y=Ot(t);await u.yield();const z=new l.Mesh(Mt(y,f[t].pos,f[t].rot),A);z.frustumCulled=!1,z.name="ferns"+t,e.scene.add(z),e.patch.push(z),await u.yield()}});function Ht(){const e=[],u=(w,p,h)=>{const i=w.attributes.position.count,v=new Float32Array(i*2),s=w.attributes.position;for(let c=0;c<i;c++)v[c*2]=p,v[c*2+1]=h?h(c,s):0;return w.setAttribute("aK",new l.BufferAttribute(v,2)),e.push(w),w},n=(w,p,h)=>{const i=[],v=[],s=[];for(let R=0;R<=p;R++)for(let r=0;r<=w;r++){const m=h(r/w,R/p);i.push(m[0],m[1],m[2]),v.push(r/w,R/p)}for(let R=0;R<p;R++)for(let r=0;r<w;r++){const m=R*(w+1)+r,V=m+1,H=m+w+1,U=H+1;s.push(m,V,H,V,U,H)}const c=new l.BufferGeometry;return c.setAttribute("position",new l.Float32BufferAttribute(i,3)),c.setAttribute("uv",new l.Float32BufferAttribute(v,2)),c.setIndex(s),c.computeVertexNormals(),c},a=w=>{const p=w/4.5;return p>0?1.5*Math.pow(Math.max(0,1-Math.pow(p,2.2)),.6):1.5*(1-.34*p*p)},o=w=>{const p=w/4.5;return .85+(p>0?.75:.35)*p*p},g=w=>{const p=w/4.5;return-.4+(p>0?.9*p*p*p*p:.25*p*p)};u(n(10,4,(w,p)=>{const h=nt(-4.5,4.5,w),i=a(h),v=o(h),s=g(h),c=p*2-1,R=Math.abs(c);return[-Math.sign(c)*i*Math.pow(R,.6),nt(s,v,Math.pow(R,1.8)),h]}),0),u(n(10,1,(w,p)=>{const h=nt(-4.5,4.5,w);return[(p*2-1)*a(h)*.93,o(h)-.28,h]}),1),u(n(1,2,(w,p)=>[(w*2-1)*a(-4.5)*(p>.4?1:.5),nt(g(-4.5),o(-4.5),p),-4.5]),0);const f=(w,p,h,i,v,s,c)=>{const R=new l.BoxGeometry(i,v,s);return R.translate(w,p,h),u(R,c)};f(0,6.6,1,.2,12.2,.2,2),f(0,1.25,-3.6,.1,.1,2,2),f(0,.5,-4.55,.12,1.5,.5,2),f(0,1,-.6,2.2,.5,1.6,1);const F=[1.7,2.3],A=[2,-4],t=[11.7,-3],y=[9.3,2.5];u(n(5,6,(w,p)=>{const h=nt(F[0],A[0],w),i=nt(F[1],A[1],w),v=nt(y[0],t[0],w),s=nt(y[1],t[1],w);return[.14,nt(h,v,p),nt(i,s,p)]}),3,(w,p)=>{const h=w%6/5,i=Math.floor(w/6)/6;return Math.sin(Math.PI*h)*Math.sin(Math.PI*(.08+.84*i))});{const w=new l.BoxGeometry(.16,.16,6.2);w.rotateX(-Math.atan2(t[0]-y[0],t[1]-y[1])-Math.PI),w.translate(.14,(t[0]+y[0])/2,(t[1]+y[1])/2),u(w,2)}return Ut(e)}const Ft=`
attribute vec3 iPos; attribute vec4 iRot; attribute vec4 iEx; attribute vec2 aK;
uniform float uTime, uU, uUBoat, uRefl; uniform vec3 uCam;
varying vec2 vUv; varying vec3 vP; varying vec3 vN; varying vec3 vK; varying float vH;
#include <fog_pars_vertex>
float rhoAt(float z){ return 360. * (.94 + .06 * sin(3.14159265 * min(1., (z - 120.) / 848. * 1.15))); }
void main(){
  // iPos = (arc metres = phi * 345, z, unused); iRot = (heading, scale, seed, heel); iEx = (circle radius, speed m/s, theta0, clock: 0 time, 1 keyed to u)
  float clock = mix(uTime, (uU - uUBoat) * 70., iEx.w);
  float R = iEx.x, wake = step(3.5, aK.x);
  float th = iEx.z + iEx.y * clock / max(R, 1.) + wake * position.z / max(R, 1.) * step(1., R);
  float hdg = R > 1. ? th + 1.5708 : iRot.x;
  vec2 d2 = vec2(cos(hdg), sin(hdg));
  vec2 c2 = iPos.xy + (R > 1. ? R * vec2(cos(th), sin(th)) : d2 * (iEx.y * clock + wake * position.z));
  float phi = c2.x / 345.;
  float rho = rhoAt(c2.y) - .05;                                      // chamber 2's wall, as the hero lathes it
  vec3 up = vec3(-sin(phi), cos(phi), 0.), tang = vec3(cos(phi), sin(phi), 0.);
  vec3 fwd = tang * d2.x + vec3(0., 0., 1.) * d2.y, side = cross(up, fwd);
  vec3 base = vec3(rho * sin(phi), -rho * cos(phi), c2.y);
  vec3 l = position, n = normal;
  if (wake < .5) {
    float sd = sin(iRot.z * 50.) > 0. ? 1. : -1.;
    float hl = sd * iRot.w * (1. + .22 * sin(uTime * .9 + iRot.z * 30.));
    if (aK.x > 2.5) l.x += sd * aK.y * (1.05 + .2 * sin(uTime * 2.6 + iRot.z * 20. + position.y * .8));     // the sail bellies and breathes
    float ch = cos(hl), sh = sin(hl);
    l = vec3(l.x * ch - l.y * sh, l.x * sh + l.y * ch, l.z); n = vec3(n.x * ch - n.y * sh, n.x * sh + n.y * ch, n.z);
    float pt = .05 * sin(uTime * 1.3 + iRot.z * 44.);                                                       // pitching on the swell
    l.y += l.z * pt + .16 * sin(uTime * 1.1 + iRot.z * 70.) - .12;
    l *= iRot.y;
  } else { l.z = 0.; l.xy *= step(.01, iRot.y); }
  vec3 p = base + side * l.x + up * l.y + fwd * l.z;
  vH = 0.; float rfade = 1.;
  if (uRefl > .5) {
    // the boat's mirror image, laid on the water where the line of sight to it meets the surface
    float hgt = max(dot(p - base, up), 0.), Hc = max(dot(uCam - base, up), 2.);
    vec3 m = p - 2. * hgt * up;
    vec3 q = uCam + (m - uCam) * (Hc / (Hc + hgt));
    q += side * sin(uTime * 2.2 + hgt * 1.1 + iRot.z * 30.) * .045 * hgt + fwd * sin(uTime * 1.7 + hgt * .8) * .03 * hgt;   // broken by the ripples
    q.xy *= (rhoAt(q.z) - .2) / max(length(q.xy), 1.);                // seated on the wall, just over the water
    vec3 qb = q - base; float ql = length(qb);
    q = base + qb * (min(ql, 27.) / max(ql, 1e-3));                  // and never runs further than its fade: no long faint wedge across the water
    rfade = 1. - smoothstep(9., 26., ql);              // a long streak at a grazing view fades before it reaches the shore
    vH = hgt / max(iRot.y, .01); p = q;
  }
  vP = p; vN = side * n.x + up * n.y + fwd * n.z; vUv = uv; vK = vec3(aK.x, mix(iRot.z, rfade, step(.5, uRefl)), aK.y);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Yt=`
varying vec3 vK; uniform vec3 uSail;
void main(){
  vec3 n = normalize(vN + vec3(0., 1e-4, 0.)), col;
  vec3 V = normalize(uCam - vP + vec3(1e-3, 0., 0.));
  if (dot(n, V) < 0.) n = -n;
  float glow = 0.;
  if (vK.x < .5) {                                                   // white hull, a rose sheer strake, a painted eye on the bow
    float v = abs(vUv.y * 2. - 1.);
    col = mix(vec3(.80, .79, .76), uRose * .7, smoothstep(.80, .84, v) * (1. - smoothstep(.93, .95, v)));
    vec2 e = (vec2(vUv.x, v) - vec2(.86, .66)) * vec2(9., 5.);
    float er = length(e);
    col = mix(col, vec3(.08, .1, .2), (1. - smoothstep(.34, .4, er)) * smoothstep(.12, .16, er) + (1. - smoothstep(.05, .09, er)));
    col = mix(col, uViolet * .35, 1. - smoothstep(.0, .2, v));       // dark below the waterline
  } else if (vK.x < 1.5) { col = mix(uPearl, uGold, .45) * (.6 + .08 * sin(vUv.x * 60.));
  } else if (vK.x < 2.5) { col = mix(uViolet, uGold, .5) * .34;
  } else {                                                           // the lugsail: battens, a patch, light through the cloth
    float bat = 1. - smoothstep(.0, .035, abs(fract(vUv.y * 5. + .5) - .5));
    vec2 pq = abs(vUv - vec2(.36 + .3 * fract(vK.y * 9.), .3 + .3 * fract(vK.y * 17.))) - vec2(.09, .06);
    float mend = 1. - smoothstep(0., .012, max(pq.x, pq.y));
    col = uSail * (.82 + .18 * sin(vUv.x * 40.) * .3) * (1. - .45 * bat);
    col = mix(col, mix(uSail, uRose, .6) * .7, mend);
    glow = clamp(-dot(V, normalize(-vP + vec3(0., 0., 1e-3))), 0., 1.);
    float g2 = clamp(-dot(V, normalize(vec3(0., 0., 1010.) - vP + vec3(0., 1e-3, 0.))), 0., 1.);     // and the lamp of dome 2 behind the cloth
    glow = max(glow, g2 * g2 * 1.25);
  }
  vec3 lit = shellLight(vP, n, 1., 1., 1.);
  float cloth = step(2.5, vK.x), white = 1. - step(.5, vK.x);
  lit = mix(lit, vec3(dot(lit, vec3(.3, .5, .2))) * 1.5, .6 * cloth + .35 * white);        // sails and hulls stay pale in the gold fill
  vec3 c = col * lit + col * mix(keyColor(1.) * sunVis(vP, 1.), vec3(1., .8, .5), .5) * glow * .6;
  c = hazed(c, vP) * uExpo;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,$t=`
varying vec3 vK; varying float vH; uniform vec3 uSail;
void main(){
  float cloth = step(2.5, vK.x);
  vec3 col = mix(mix(uViolet, uSea, .25) * .42, uSail * .62, cloth * .8);
  float rip = texture2D(uNoise, vP.xz * .11 + vec2(uTime * .05, -uTime * .03)).r;
  float a = (.62 - .30 * smoothstep(0., 12., vH)) * (.6 + .5 * rip) * (1. - .5 * cloth * step(.5, fract(vH * .9 + rip * 2. + uTime * .3)) * smoothstep(3., 9., vH));
  vec3 up = normalize(vec3(-vP.xy, 0.) + vec3(0., 1e-4, 0.));
  vec3 c = hazed(col * shellLight(vP, up, 1., 1., 1.), vP) * uExpo;
  gl_FragColor = vec4(c, clamp(a, 0., .75) * vK.y);
  #include <fog_fragment>
}`,Jt=`
void main(){
  float v = clamp(vUv.y, 0., 1.), x = min(abs(vUv.x * 2. - 1.), 1.);      // (along and across the wake, each held to its own range)
  float nz = texture2D(uNoise, vec2(vUv.x * .7, v * 4. - uTime * .06)).r, nz2 = texture2D(uNoise, vec2(vUv.x * 2.3 + .4, v * 11. - uTime * .11)).g;
  float arms = smoothstep(.5, .82, x) * (1. - smoothstep(.9, 1., x));
  float churn = (1. - smoothstep(0., .5, x)) * (1. - smoothstep(0., .4, v));
  float fade = (1. - v) * (1. - v) * smoothstep(0., .04, v);
  float a = clamp((arms * .75 + churn) * fade * (.35 + 1.3 * nz * nz2 * 2.), 0., .85);
  vec3 up = normalize(vec3(-vP.xy, 0.) + vec3(0., 1e-4, 0.));
  vec3 c = hazed(vec3(.86, .9, .9) * shellLight(vP, up, 1., 1., 1.), vP) * uExpo;
  gl_FragColor = vec4(c, a);
  #include <fog_fragment>
}`;pt.push(async e=>{const{V:u,land:n,path:a,U:o}=e,g=kt(e.rng,"lake-boats"),f=[],F=[],A=[],t=[],y=(P,k,E,Q,$,rt,b,G=1)=>{f.push(P,k,0),F.push(b,g.range(.92,1.08)*G,g(),g.range(.14,.3)),A.push(E,Q,$,rt)},z=(P,k,E)=>n.at(k,P/345).lakeD<-E,w=P=>[Math.atan2(P.x,-P.y)*345,P.z],p=a.pointAt(o.boat,new l.Vector3),h=a.tangentAt(o.boat,new l.Vector3).add(p),[i,v]=w(p),[s,c]=w(h),R=Math.hypot(s-i,c-v)||1,r=(s-i)/R,m=(c-v)/R,V=1.05,H=Math.atan2(m*Math.cos(V)+r*Math.sin(V),r*Math.cos(V)-m*Math.sin(V));y(i,v,0,2.4,0,1,H,1),t.push([i,v,0]);for(const P of[1,-1]){const k=i-m*20*P,E=v+r*20*P;y(k,E,0,2.4,0,1,H+.1*P,z(k,E,6)?1:0),t.push([k,E,0])}const U=[],T=30,B=new l.Vector3;for(let P=o.lake0*a.length;P<=o.terr*a.length;P+=2){const k=w(a.posAtDist(P,B));U.push(k[0],k[1])}const K=(P,k,E,Q)=>{const $=Math.cos(Q),rt=Math.sin(Q);for(let b=0;b<U.length;b+=2){const G=U[b]-P,I=U[b+1]-k;if(E>1){if(Math.abs(Math.hypot(G,I)-E)<T)return!0}else{const d=vt(G*$+I*rt,0,110);if(Math.hypot(G-d*$,I-d*rt)<T)return!0}}return!1};await e.ctx.yield();let N=0;for(;t.length<u.boats+1&&N++<2400;)if(N%40===0&&await e.ctx.yield(),u.regatta){const P=g.range(-70,60),k=g.range(565,735),E=g.range(-.22,.22),Q=g.range(2.2,3.1);if(!z(P,k,14)||!z(P+110*Math.cos(E),k+110*Math.sin(E),8)||t.some($=>Math.hypot($[0]-P,$[1]-k)<13))continue;y(P,k,0,Q,0,0,E),t.push([P,k,0])}else{const P=g.range(-85,205),k=g.range(538,762),E=Math.max(12,g.range(16,42)*(1-.6*N/2400));let Q=!0;for(let $=0;$<8&&Q;$++)Q=z(P+E*Math.cos($*st/8),k+E*Math.sin($*st/8),14);if(!Q||t.some($=>Math.hypot($[0]-P,$[1]-k)<$[2]+E+12)||K(P,k,E,0))continue;y(P,k,E,g.range(1.8,3),g()*st,0,0),t.push([P,k,E])}await e.ctx.yield();let L=0,at=0;for(let P=3;P<f.length/3;P++){const k=A[P*4],E=F[P*4];let Q=f[P*3],$=f[P*3+1];if(!K(Q,$,k,E))continue;let rt=!1,b=1e9,G=k;const I=Q,d=$;for(const M of k>1?[k,Math.max(12,k*.5)]:[k]){if(rt)break;for(let x=0;x<10;x++)for(let C=0;C<8;C++){const _=-72+x*30+9*Math.sin(C*2.1+P),q=546+C*30+9*Math.sin(x*1.7+P),S=Math.hypot(_-I,q-d);if(S>=b||K(_,q,M,E))continue;let J=!f.some((ot,j)=>j%3===0&&j!==P*3&&Math.hypot(f[j]-_,f[j+1]-q)<A[j/3*4]+M+12);if(J&&M>1)for(let ot=0;ot<8&&J;ot++)J=z(_+M*Math.cos(ot*st/8),q+M*Math.sin(ot*st/8),14);J&&M<=1&&(J=z(_,q,14)&&z(_+110*Math.cos(E),q+110*Math.sin(E),8)),J&&(rt=!0,b=S,Q=_,$=q,G=M)}}rt&&(A[P*4]=G),P%4===3&&await e.ctx.yield(),rt?(f[P*3]=Q,f[P*3+1]=$,L++):(F[P*4+1]=0,at++)}e.subjects.boats={moved:L,hidden:at,n:f.length/3},await e.ctx.yield();const O={uU:{value:0},uUBoat:{value:o.boat},uSail:{value:new l.Color(u.sail)},uRefl:{value:0}},X=Ht();await e.ctx.yield();const Y=new l.Mesh(Mt(X,f,F,A),ct(e,Ft,Yt,O,{side:l.DoubleSide}));Y.frustumCulled=!1,Y.name="boats",e.scene.add(Y),e.patch.push(Y);const W=new l.PlaneGeometry(2,1,1,12),tt=W.attributes.position,it=new Float32Array(tt.count*2);for(let P=0;P<tt.count;P++){const k=.5-tt.getY(P),E=tt.getX(P);tt.setXYZ(P,E*(.9+k*8.5),.14,-3.2-k*42),W.attributes.uv.setXY(P,E*.5+.5,k),it[P*2]=4}W.setAttribute("aK",new l.BufferAttribute(it,2));const et=new l.Mesh(Mt(W,f,F,A),ct(e,Ft,Jt,O,{side:l.DoubleSide,transparent:!0,depthWrite:!1}));et.frustumCulled=!1,et.renderOrder=1,et.name="wakes",e.scene.add(et),e.patch.push(et);const Z=new l.Mesh(Mt(X,f,F,A),ct(e,Ft,$t,{...O,uRefl:{value:1}},{side:l.DoubleSide,transparent:!0,depthWrite:!1}));Z.frustumCulled=!1,Z.renderOrder=.5,Z.name="boatReflections",e.scene.add(Z),e.patch.push(Z),e.onUpdate.push((P,k,E,Q)=>{O.uU.value=Q})});const te=`
${Vt}
attribute vec2 aK; uniform float uTime;
varying vec2 vUv; varying vec3 vP; varying vec3 vN; varying vec3 vK;
#include <fog_pars_vertex>
void main(){
  wallFrame();
  vec3 l = position;
  float bend = aK.y * (sin(uTime * 1.6 + iRot.z * 40. + iPos.z * .12) * .5 + .35);       // reeds bow down-shell
  vec3 p = wallPoint(l) + vec3(0., 0., 1.) * bend * iRot.y;
  vP = p; vN = wallDir(normal); vUv = uv; vK = vec3(aK.x, iRot.z, iRot.w);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;function ee(){const e=[],u=[],n=[],a=[],o=[],g=(N,L,at,O)=>{const[X,Y,W]=N,tt=[Y[0]-X[0],Y[1]-X[1],Y[2]-X[2]],it=[W[0]-X[0],W[1]-X[1],W[2]-X[2]],et=[tt[1]*it[2]-tt[2]*it[1],tt[2]*it[0]-tt[0]*it[2],tt[0]*it[1]-tt[1]*it[0]],Z=1/(Math.hypot(et[0],et[1],et[2])||1),P=e.length/3;N.forEach((k,E)=>{e.push(k[0],k[1],k[2]),u.push(et[0]*Z,et[1]*Z,et[2]*Z),n.push(L[E][0],L[E][1]),a.push(at,O)});for(let k=2;k<N.length;k++)o.push(P,P+k-1,P+k)},f=(N,L,at,O,X,Y,W,tt)=>{const it=Math.hypot(at-N,O-L);g([[N,X,L],[at,X,O],[at,Y,O],[N,Y,L]],[[0,X],[it,X],[it,Y],[0,Y]],W,tt)};f(-3.2,2.3,3.2,2.3,0,3.3,0,1),f(3.2,2.3,3.2,-2.3,0,3.3,0,0),f(3.2,-2.3,-3.2,-2.3,0,3.3,0,0),f(-3.2,-2.3,-3.2,2.3,0,3.3,0,0),g([[3.2,3.3,2.3],[3.2,3.3,-2.3],[3.2,5.2,0]],[[0,3.3],[2*2.3,3.3],[2.3,5.2]],0,0),g([[-3.2,3.3,-2.3],[-3.2,3.3,2.3],[-3.2,5.2,0]],[[0,3.3],[2*2.3,3.3],[2.3,5.2]],0,0);const z=3.2+.35,w=2.3+.5,p=3.3-.25,h=5.2+.12,i=Math.hypot(w,h-p);g([[-z,p,w],[z,p,w],[z,h,0],[-z,h,0]],[[0,0],[2*z,0],[2*z,i],[0,i]],1,0),g([[z,p,-w],[-z,p,-w],[-z,h,0],[z,h,0]],[[0,0],[2*z,0],[2*z,i],[0,i]],1,0);const v=1.5,s=-.7,c=.36,R=3.9,r=6;f(v-c,s+c,v+c,s+c,R,r,2,0),f(v+c,s+c,v+c,s-c,R,r,2,0),f(v+c,s-c,v-c,s-c,R,r,2,0),f(v-c,s-c,v-c,s+c,R,r,2,0),g([[v-c,r,s+c],[v+c,r,s+c],[v+c,r,s-c],[v-c,r,s-c]],[[0,9],[1,9],[1,9],[0,9]],2,0);const m=3.2+2.2,V=-2.3,H=.9,U=2.2;f(-m,H,-3.2,H,0,U,0,2),f(-3.2,V,-m,V,0,U,0,2),f(-m,V,-m,H,0,U,0,2),g([[-m-.3,U-.1,H+.3],[-3.2,2.95,H+.3],[-3.2,2.95,V-.3],[-m-.3,U-.1,V-.3]],[[0,0],[0,2.6],[3.8,2.6],[3.8,0]],1,2);const T=4.9,B=-1.6;f(3.2,2.3,3.2,T,0,.95,3,2),f(3.2,T,B,T,0,.95,3,2),f(B,T,B,T-1.3,0,.95,3,2),g([[B,.07,2.3],[3.2,.07,2.3],[3.2,.07,T],[B,.07,T]],[[0,0],[3.2-B,0],[3.2-B,T-2.3],[0,T-2.3]],4,2);const K=new l.BufferGeometry;return K.setAttribute("position",new l.Float32BufferAttribute(e,3)),K.setAttribute("normal",new l.Float32BufferAttribute(u,3)),K.setAttribute("uv",new l.Float32BufferAttribute(n,2)),K.setAttribute("aK",new l.Float32BufferAttribute(a,2)),K.setIndex(o),K}const oe=`
${Vt}
attribute vec2 aK;
varying vec2 vUv; varying vec3 vP; varying vec3 vN; varying vec3 vK;
#include <fog_pars_vertex>
void main(){
  wallFrame();
  vec3 l = position; vec2 q = uv;
  float xs = .84 + .36 * fract(iRot.z * 7.31), tall = step(.7, fract(iRot.z * 3.17));       // long or short, one storey or two
  if (abs(normal.x) < .6) q.x *= xs;
  l.x *= xs;
  float up2 = tall * 2.7 * step(2.99, l.y) * (1. - step(1.5, aK.y));
  l.y += up2; if (aK.x < .5) q.y += up2;
  vec3 p = wallPoint(l);
  vP = p; vN = wallDir(normal); vUv = q; vK = vec3(aK.x, iRot.z, aK.y);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,_t=`
varying vec3 vK; uniform float uHCh;      // the chamber the house stands in (1 or 3)
void main(){
  vec3 n = normalize(vN + vec3(0., 1e-4, 0.)), col; float glint = 0., ao = 1.;
  vec3 V = normalize(uCam - vP + vec3(1e-3, 0., 0.));
  if (dot(n, V) < 0.) n = -n;
  float sd = vK.y, low = step(1.5, vK.z), tall = step(.7, fract(sd * 3.17)) * (1. - low), top = 3.3 + 2.7 * tall;
  vec3 wash = mix(vec3(.84, .82, .78), mix(uPearl, uRose, .3) * .92, step(.62, fract(sd * 5.3)) * .7);
  wash = mix(wash, mix(uPearl, uGold, .45) * .86, step(.82, fract(sd * 9.1)) * .6);
  float hb3 = step(2.5, uHCh);                                       // the harbour's village: lime-white walls, green shutters, rose tiles, whatever the palette
  wash = mix(wash, vec3(.90, .88, .84) * (.94 + .1 * fract(sd * 5.3)), hb3);
  vec3 trim = mix(mix(uSea * .5, mix(uViolet, uSea, .35) * .75, step(.5, fract(sd * 11.3))), vec3(.16, .40, .30), hb3);        // shutters and doors
  if (vK.x < .5) {                                                   // limewashed wall: stains, plinth, windows with shutters, a door
    float st = texture2D(uNoise, vUv * .06 + sd).g, st2 = texture2D(uNoise, vec2(vUv.x * .35 + sd * 3., vUv.y * .05)).b;
    col = wash * (.88 + .16 * st) * (1. - .16 * smoothstep(.55, .8, st2) * (1. - smoothstep(top - 2., top, vUv.y)));     // rain streaks under the eaves
    float y = mod(vUv.y, 2.75), cell = vUv.x / 2.1, fu = (fract(cell) - .5) * 2.1, ci = floor(cell), fl = floor(vUv.y / 2.75);
    float isDoor = step(.5, vK.z) * (1. - low) * (1. - step(.5, abs(ci - 1.))) * (1. - step(.5, fl));
    float has = step(.22, fract(sd * 3.7 + ci * .37 + fl * .61)) * step(vUv.y, top - .5) * (1. - isDoor) * (1. - low * step(.5, abs(ci)));
    vec2 wq = abs(vec2(fu, y - 1.72)) - vec2(.40, .52);
    float wd = max(wq.x, wq.y), win = (1. - smoothstep(0., .04, wd)) * has;
    vec2 sq = abs(vec2(abs(fu) - .63, y - 1.72)) - vec2(.17, .56);
    float shut = (1. - smoothstep(0., .04, max(sq.x, sq.y))) * has;
    col = mix(col, wash * 1.1, (1. - smoothstep(.06, .1, wd)) * has * .7);                     // a pale surround
    col = mix(col, trim * (.85 + .15 * step(.5, fract(y * 9.))), shut);                        // louvred shutters
    col = mix(col, vec3(.09, .12, .2), win);
    col = mix(col, wash * .95, win * (1. - smoothstep(.02, .045, min(abs(fu), abs(y - 1.72)))));   // glazing bars
    col = mix(col, wash * .7, has * (1. - smoothstep(0., .04, max(abs(fu) - .5, abs(y - 1.14) - .05))));   // the sill
    vec2 dq = abs(vec2(fu, vUv.y - 1.02)) - vec2(.46, 1.02);
    float door = (1. - smoothstep(0., .04, max(dq.x, dq.y))) * isDoor;
    col = mix(col, trim * .8 * (.8 + .2 * step(.5, fract(fu * 4.5))), door);
    col = mix(col, uGold * .9, door * (1. - smoothstep(.03, .06, length(vec2(fu - .3, vUv.y - 1.05)))));   // a brass knob
    glint = win * pow(max(dot(reflect(-V, n), normalize(vec3(0., 0., 210.) - vP + vec3(0., 1e-3, 0.))), 1e-3), 30.) * 5.;       // daylight on glass, not a lamp
    ao = (.66 + .34 * smoothstep(0., .6, vUv.y)) * (1. - .34 * smoothstep(top - .75, top - .2, vUv.y) * (1. - smoothstep(top, top + .25, vUv.y)));
    col = mix(col, mix(uForest, uGold, .3) * .4, (1. - smoothstep(.0, .35, vUv.y + (st - .5) * .5)) * .5);   // moss at the foot
  } else if (vK.x < 1.5) {                                           // roof: tile courses, a pale ridge, lichen
    vec3 tile = mix(mix(uRose, vec3(.74, .34, .27), .55), mix(uViolet, vec3(.42, .47, .58), .55) * .9, step(.8, fract(sd * 13.)));
    tile = mix(tile, vec3(.84, .40, .40) * (.9 + .2 * fract(sd * 13.)), hb3);                 // rose tiles
    float cy = vUv.y * 2.4, row = floor(cy), cx = vUv.x * 2.1 + .5 * row;
    float h = texture2D(uNoise, (vec2(floor(cx), row) + .5) / 64. + sd).r;
    col = tile * (.72 + .3 * fract(cy)) * (.82 + .36 * h) * (1. - .3 * smoothstep(.86, .98, fract(cx)));
    col = mix(col, mix(uGold, uForest, .5) * .5, smoothstep(.62, .8, texture2D(uNoise, vUv * .11 + sd * 2.).a) * .55);
    col = mix(col, tile * 1.25 + .05, (1. - smoothstep(.08, .3, abs(vUv.y - 3.6))) * (1. - low));               // ridge tiles
  } else if (vK.x < 2.5) {                                           // chimney, with a dark pot
    col = mix(wash * .9, vec3(.2, .16, .16), step(5.7, vUv.y));
  } else if (vK.x < 3.5) {                                           // dry-stone yard wall
    vec2 bq = vUv * vec2(1.9, 3.4); bq.x += .5 * floor(bq.y);
    vec2 f = abs(fract(bq) - .5);
    col = mix(uPearl * .7, mix(uPearl, uViolet, .3) * .56, texture2D(uNoise, floor(bq) / 64. + .13).r) * (1. - .45 * smoothstep(.36, .47, max(f.x, f.y)));
    ao = .7 + .3 * smoothstep(0., .5, vUv.y);
  } else {                                                           // the yard: swept earth and a few rows of vegetables
    float rowsOn = step(.45, fract(sd * 17.)), r = fract(vUv.y * 1.6);
    col = mix(mix(uPearl, uGold, .5) * .52, mix(uForest, uGold, .25) * .62, rowsOn * step(.2, r) * step(r, .62) * step(.6, vUv.x) * step(.5, fract(vUv.x * 2.3 + floor(vUv.y * 1.6) * .37) + .25));
    ao = .82;
  }
  vec3 lit = shellLight(vP, n, uHCh, 1., 1.);
  vec3 c = col * lit * ao + glint * keyColor(1.) * (.3 + .7 * sunVis(vP, uHCh));
  c = hazed(c, vP) * uExpo;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,ae=`
void main(){
  vec3 n = normalize(vN + 1.4 * normalize(vec3(-vP.xy, 0.) + vec3(0., 1e-4, 0.)));
  vec2 b = vUv * vec2(2.2, 3.6); b.x += .5 * floor(b.y);
  float h = texture2D(uNoise, floor(b) / 64. + .13).r, m = texture2D(uNoise, vUv / 9.).g;
  vec2 f = abs(fract(b) - .5);
  float joint = smoothstep(.38, .47, max(f.x, f.y));
  vec3 col = mix(uPearl * .74, mix(uPearl, uViolet, .3) * .6, h) * (.8 + .4 * m) * (1. - .45 * joint);
  col = mix(col, mix(uGold, uForest, .6) * .5, smoothstep(.55, .75, m) * .5);                 // moss
  vec3 c = hazed(col * shellLight(vP, n, 1., 1., 1.), vP) * uExpo;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,Tt=`
varying vec2 vUv; varying vec3 vP; varying vec3 vN;
#include <fog_pars_vertex>
void main(){ vUv = uv; vP = position; vN = normal; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;pt.push(async e=>{const{ctx:u,V:n,land:a}=e,o=kt(e.rng,"lake-villages"),g=ee(),f=[],F=[],A=Math.round(420*Math.max(.7,n.detail)),t=(r,m,V)=>{if(f.length/3>=A||o()>V)return;const H=r/345,U=a.at(m,H);if(U.water||U.lakeD<9||U.forest)return;const T=a.r2(m),B=T*Math.sin(H),K=-T*Math.cos(H);e.near2(B,K,m)<17||(f.push(B,K,m),F.push(o.pick([0,.2,-.2,1.57,1.77])+o.range(-.08,.08),o.range(.85,1.12)*.84,o(),0))};for(let r=585;r<705;r+=8.5)for(let m=-216;m<-118;m+=8.5)t(m+o.range(-1.5,1.5),r+o.range(-1.5,1.5),.62);for(let r=600;r<700;r+=8.5)for(let m=386;m<440;m+=8.5)t(m+o.range(-1.5,1.5),r+o.range(-1.5,1.5),.6);await u.yield();let y=0;for(let r=304;r<958;r+=9)for(let m=-468;m<638;m+=9){++y%120===0&&await u.yield();const V=o();a.at(r,m/345).town&&t(m,r,.58+V*0)}const z=new l.Mesh(Mt(g,f,F),ct(e,oe,_t,{uHCh:{value:1}},{side:l.DoubleSide}));z.frustumCulled=!1,z.name="houses",e.scene.add(z),e.patch.push(z),await u.yield();const w=[],p=[],h=[],i=[],v=(r,m,V)=>{const H=r/345,U=a.r2(m)-V,T=Math.sin(H),B=Math.cos(H);return[U*T,-U*B,m,-T,B,0,B,T,0]},s=(r,m,V,H,U,T,B)=>{const K=Math.hypot(V-r,H-m),N=(V-r)/K,L=(H-m)/K,at=w.length/3,O=[[-U/2-.25,-.3],[-U/2,T],[U/2,T],[U/2+.25,-.3]];for(let X=0;X<=B;X++){const Y=X/B,W=nt(r,V,Y),tt=nt(m,H,Y),it=1+.12*Math.sin(Y*K*.7+r);for(let et=0;et<4;et++){const Z=O[et][0],P=v(W-L*Z,tt+N*Z,0),k=O[et][1]*(et===1||et===2?it:1);w.push(P[0]+P[3]*k,P[1]+P[4]*k,P[2]);const E=et<2?-1:1,Q=et===1||et===2?1.2:.2,$=1/Math.hypot(E,Q),rt=-L*P[6]*E,b=-L*P[7]*E,G=N*E;p.push((rt+P[3]*Q)*$,(b+P[4]*Q)*$,G*$),h.push(Y*K,et===0?0:et===1?T:et===2?T+U:2*T+U)}}for(let X=0;X<B;X++)for(let Y=0;Y<3;Y++){const W=at+X*4+Y,tt=W+4;i.push(W,tt,W+1,W+1,tt,tt+1)}};for(let r=22;r<=35;r++){await u.yield();const m=r*10.5;let V=512+o.range(0,8);for(;V<780;){const H=o.range(22,40),U=o.chance(.3)?o.range(2.5,4):0,T=Math.min(788,V+H),B=K=>a.at(K,m/345).lakeD>5;B(V)&&B(T)&&B((V+T)/2)&&s(m,V,m,T,.7,1.25,Math.ceil(H/6)),V+=H+U}}for(const r of[596,628,659,688]){let m=-190;for(;m<-40&&!a.at(r,m/345).water;)m+=2;s(m-8,r,m+26,r,3,1.1,7)}const c=new l.BufferGeometry;c.setAttribute("position",new l.Float32BufferAttribute(w,3)),c.setAttribute("normal",new l.Float32BufferAttribute(p,3)),c.setAttribute("uv",new l.Float32BufferAttribute(h,2)),c.setIndex(i);const R=new l.Mesh(c,ct(e,Tt,ae,{},{side:l.DoubleSide}));R.frustumCulled=!1,R.name="stone",e.scene.add(R),e.patch.push(R)});const se=`
varying vec3 vK;
float h11(float x){ return fract(sin(x * 127.1) * 43758.5453); }
void main(){
  vec3 col; float ao = 1.;
  if (vK.z < .5) {                                                     // reeds: blades cut out of a card
    float x = vUv.x * 7. + vK.y * 31., id = floor(x), f = fract(x) - .5, hgt = .5 + .5 * h11(id + vK.y * 9.);
    float t = vUv.y / hgt;
    if (t > 1. || abs(f + .25 * t * (h11(id + 3.) - .5)) > .34 * (1. - t * t) + .02) discard;
    col = mix(uForest * vec3(.7, 1., .62), mix(uGold, uForest, .35) * vec3(.9, .95, .5), t);
    col = mix(col, mix(uViolet, uGold, .5) * .45, step(.86, t) * step(.5, h11(id + 7.)));      // seed heads
    ao = .5 + .5 * smoothstep(0., .5, vUv.y);
  } else {                                                             // lily pads and pink flowers
    vec2 g = vUv * 5., id = floor(g), f = fract(g) - .5;
    float h = h11(id.x * 7.3 + id.y * 13.1 + vK.y * 50.), h2 = h11(id.x * 3.7 + id.y * 5.9 + vK.y * 20.);
    vec2 o = f - (vec2(h, h2) - .5) * .4;
    float r = length(o), keep = step(.3, h) * step(length(id + .5 - 2.5), 2.3 + h2 * .4);
    float pad = keep * step(r, .30 + .12 * h2) * step(-.92, dot(normalize(o + vec2(1e-4, 0.)), vec2(cos(h * 6.3), sin(h * 6.3))));
    float flower = keep * step(.72, h2) * step(r, .12);
    if (pad + flower < .5) discard;
    col = mix(uForest * vec3(.62, 1.05, .7) * (.8 + .3 * h), mix(uRose, vec3(1., .86, .9), .35 + .4 * step(r, .05)) * 1.05, flower);
  }
  vec3 up = normalize(vec3(-vP.xy, 0.) + vec3(0., 1e-4, 0.));
  vec3 c = hazed(col * shellLight(vP, up, 1., 1., 1.) * ao, vP) * uExpo;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`;pt.push(async e=>{const{ctx:u,rng:n,V:a,land:o}=e,g=(s,c)=>{const R=s.attributes.position,r=new Float32Array(R.count*2);for(let m=0;m<R.count;m++)r[m*2+1]=c(R.getY(m));return s.setAttribute("aK",new l.BufferAttribute(r,2)),s},f=()=>new l.PlaneGeometry(2,3.2,1,3).translate(0,1.6,0),F=Ut([g(f(),s=>(s/3.2)**2*.9),g(f().rotateY(Math.PI/2),s=>(s/3.2)**2*.9),g(f().rotateY(Math.PI/4).translate(.7,0,.5),s=>(s/3.2)**2*.9)]),A=g(new l.PlaneGeometry(7,7).rotateX(-Math.PI/2).translate(0,.1,0),()=>0),t=[],y=[],z=[],w=[],p=Math.round(2600*a.detail),h=Math.round(380*a.detail);await u.yield();let i=0;for(let s=476;s<826;s+=2.6)for(let c=-176;c<292;c+=2.6){++i%120===0&&await u.yield();const R=n(),r=s+n.range(-1.2,1.2),m=c+n.range(-1.2,1.2),V=n.range(.8,1.35),H=n(),U=o.lakeBox(r,m/345);if(U>86||U<-64)continue;const T=o.at(r,m/345).lakeD;if(T>62||T<-40)continue;const B=(it,et)=>o.at(r+it,(m+et)/345).water,K=B(0,0),N=B(4,0)!==K||B(-4,0)!==K||B(0,4)!==K||B(0,-4)!==K,L=T>-5&&T<5,at=N&&R<.6||L&&R<.55,O=!at&&K&&(T>-26&&T<-7&&R<.07||R<.09&&!(B(16,0)&&B(-16,0)&&B(0,16)&&B(0,-16)));if(!at&&!O)continue;const X=m/345,Y=o.r2(r)-.02,W=Y*Math.sin(X),tt=-Y*Math.cos(X);e.near2(W,tt,r)<10||(at&&t.length/3<p&&(t.push(W,tt,r),y.push(H*st,V,H,0)),O&&z.length/3<h&&(z.push(W,tt,r),w.push(H*st,V,H,1)))}const v=ct(e,te,se,{},{side:l.DoubleSide});for(const[s,c,R,r]of[[F,t,y,"reeds"],[A,z,w,"lilies"]]){const m=new l.Mesh(Mt(s,c,R),v);m.frustumCulled=!1,m.name=r,e.scene.add(m),e.patch.push(m)}});const At=`
vec3 camRight(){ return vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]); }
vec3 camUp(){ return vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]); }
`,ne=`
${At}
attribute vec4 iA; uniform float uTime, uFlow; uniform vec3 uCam;
varying vec2 vUv; varying vec3 vP; varying vec3 vN; varying vec4 vC;
#include <fog_pars_vertex>
float neck(float z, float zd, float w){ float q = (z - zd) / w; return 1. - exp(-q * q); }
void main(){
  float L = 4320., f = fract(iA.x + uTime * uFlow / L), z = 120. + f * L;
  float big = mix(mix(mix(14., 34., smoothstep(210., 520., z)), 52., smoothstep(1010., 1500., z)), 66., smoothstep(2210., 2900., z));
  big = mix(big, 38., smoothstep(2450., 3350., z));                    // along the last room the river draws out into a line of streamers
  float nk = neck(z, 215., 90.) * neck(z, 1020., 160.) * neck(z, 2225., 260.);
  float R = big * (.3 + .7 * nk), stray = step(.74, iA.w), room4 = smoothstep(2300., 2500., z) * (1. - smoothstep(2640., 2860., z));
  float a = iA.y + uTime * .03 * (iA.w - .5) + stray * (z - 120.) * .0006;
  float rr = iA.z * R * (1. + stray * (1.5 + (2.2 + 5.5 * room4) * smoothstep(0., 600., z - (z < 1020. ? 215. : z < 2225. ? 1020. : 2225.)) * nk));   // strays sink toward the land
  rr = mix(rr, max(rr, 300.), stray * room4);                           // cloudlets in the last room keep well clear of the axis and the mouth
  vec2 off = vec2(56., 46.) * smoothstep(262., 410., z) * (1. - smoothstep(760., 965., z)) + vec2(-28., -46.) * smoothstep(1080., 1300., z) * (1. - smoothstep(1980., 2180., z)) + vec2(-80., 110.) * smoothstep(1940., 2320., z);   // the river runs below and beside our line
  vec3 c = vec3(cos(a) * rr * 1.25 + off.x, sin(a) * rr * .6 + off.y, z);
  float size = (.5 + .6 * fract(iA.w * 7.31)) * (R * .85 + 6.) * (1. + 1.1 * stray * room4);
  vec3 p = c + (camRight() * (uv.x - .5) + camUp() * (uv.y - .5)) * size * 2.;
  float fade = smoothstep(0., .03, f) * (1. - smoothstep(.9, 1., f)) * (1. - mix(.66 * smoothstep(2330., 3200., z), smoothstep(2330., 2720., z), stray) * (1. - .8 * stray * room4)) * (1. - stray * smoothstep(3000., 3250., z)) * (1. - smoothstep(3690., 3900., z));      // the river thins to streamers along the last room and out over the lip
  float dc = length(uCam - c);
  fade *= smoothstep(22. + size * .5, 70. + size * 1.4, dc);                        // held off the camera
  fade *= .45 + .55 * nk;                                                           // drawn through a door the river thins to wisps: the rim and the room beyond show through it
  fade *= 1. - stray * room4 * smoothstep(380., 620., dc);                          // cloudlets of the last room never sit in front of the far mouth            // the streamers past the mouth only show from close by
  vP = p; vN = vec3(0., 0., 1.); vUv = uv; vC = vec4(1. + step(1022., z) + step(2225., z), fade, iA.w, stray);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Bt=`
varying vec4 vC; uniform float uOpacity;
void main(){
  vec2 q = vUv * 2. - 1.; float r2 = dot(q, q);
  if (r2 > 1.) discard;
  float soft = (1. - r2) * (1. - r2);
  vec2 o = vec2(vC.z * 3.7, vC.z * 9.1);
  float n = texture2D(uNoise, vUv * .33 + o + vec2(uTime * .004, 0.)).r * .62 + texture2D(uNoise, vUv * .9 + o * 1.7 - vec2(0., uTime * .006)).g * .38;
  float deck = step(vC.w, -.5);                                       // the cloud deck of the last room
  float a = soft * smoothstep(.3, .74, n * 1.12 + soft * .3) * uOpacity * 1.15 * vC.y * (1. - .35 * max(vC.w, 0.));
  float hole = texture2D(uNoise, vec2(atan(vP.y, vP.x + 1e-3) * .87, vP.z / 1500.)).g;      // the deck is broken: holes that stay where they are on the wall, the same for every puff
  a = min(a * mix(1., smoothstep(.36, .56, hole), deck), .5);          // no puff anywhere is more than half opaque: the land shows through the cloud and between its heads
  vec3 lit = keyColor(vC.x) * sunVis(vP, vC.x) * (.5 + .9 * n) * (.55 + .45 * (q.y * .5 + .5)) + mix(uViolet, vec3(.85, .9, 1.), .62) * (.5 + .22 * q.y);
  lit = mix(lit, mix(mix(uViolet, vec3(.85, .9, 1.), .42), vec3(1.06, 1.07, 1.1), clamp(.15 + .5 * (q.y * .5 + .5) + .6 * (n - .35), 0., 1.)), deck);      // white tops, thin violet undersides
  vec3 c = hazed(vec3(.93) * lit, mix(vP, uCam, .45 * deck)) * uExpo;                  // a bank of cloud, not a mist: it keeps its white through the blue air
  gl_FragColor = vec4(c, a);
  #include <fog_fragment>
}`;pt.push(async e=>{const{rng:u,V:n}=e,a=Math.round((n.weather==="heavy"?620:n.weather==="still"?190:420)*n.detail),o=new l.InstancedBufferGeometry,g=new l.PlaneGeometry(1,1).translate(.5,.5,0);o.index=g.index,o.setAttribute("position",g.attributes.position),o.setAttribute("uv",g.attributes.uv);const f=new Float32Array(a*4);for(let t=0;t<a;t++)f[t*4]=n.weather==="still"?(t+u()*.3)/a:u(),f[t*4+1]=u()*st,f[t*4+2]=Math.sqrt(u())*(n.weather==="still"?.35:1),f[t*4+3]=u();o.setAttribute("iA",new l.InstancedBufferAttribute(f,4)),o.instanceCount=a;const F={uFlow:{value:n.weather==="still"?5:12},uOpacity:{value:n.weather==="heavy"||n.weather==="still"?.5:.4}},A=new l.Mesh(o,ct(e,ne,Bt,F,{transparent:!0,depthWrite:!1}));A.frustumCulled=!1,A.renderOrder=5,A.name="cloudRiver",e.scene.add(A)});function ie(){const e=[],u=[],n=[],a=(B,K,N,L,at,O=0)=>(e.push(B,K,N),u.push(L,at,O),e.length/3-1),o=(B,K,N)=>n.push(B,K,N),g=(B,K,N,L)=>n.push(B,K,N,B,N,L),f=a(0,.02,.5,0,0),F=a(0,.01,-.52,0,0),A=a(0,.13,.04,0,0),t=a(-.16,0,.04,0,0),y=a(.16,0,.04,0,0),z=a(0,-.12,.06,0,0);o(f,t,A),o(f,A,y),o(F,A,t),o(F,y,A),o(f,z,t),o(f,y,z),o(F,t,z),o(F,z,y);const w=a(-.085,.05,.4,0,0),p=a(.085,.05,.4,0,0),h=a(-.07,.13,.62,0,0),i=a(.07,.13,.62,0,0),v=a(-.075,.1,.82,0,0),s=a(.075,.1,.82,0,0),c=a(-.04,.085,.84,0,1),R=a(.04,.085,.84,0,1),r=a(0,.045,1.26,0,1);g(w,p,i,h),g(h,i,s,v),o(c,R,r);const m=a(-.05,-.03,-.42,0,2),V=a(.05,-.03,-.42,0,2),H=a(.028,-.05,-1.12,0,2),U=a(-.028,-.05,-1.12,0,2);g(m,V,H,U),o(F,a(.15,.01,-.78,0,0),a(-.15,.01,-.78,0,0));for(const B of[-1,1]){const K=[[.1,.24,-.2,0],[.5,.44,.02,.5],[.86,.24,-.14,.8],[1.2,-.2,-.32,1]];let N=null;for(const[L,at,O,X]of K){const Y=a(B*L,.035-.03*X,at,X,0),W=a(B*L,.02-.02*X,O,X,0,1);N&&(B>0?g(N[0],Y,W,N[1]):g(N[0],N[1],W,Y)),N=[Y,W]}}const T=new l.BufferGeometry;for(let B=24;B<n.length;B+=3){const K=n[B]*3,N=n[B+1]*3,L=n[B+2]*3;if((e[N+2]-e[K+2])*(e[L]-e[K])-(e[N]-e[K])*(e[L+2]-e[K+2])<0){const O=n[B+1];n[B+1]=n[B+2],n[B+2]=O}}return T.setAttribute("position",new l.Float32BufferAttribute(e,3)),T.setAttribute("aK",new l.Float32BufferAttribute(u,3)),T.setIndex(n),T.computeVertexNormals(),T}const re=`
attribute vec3 aK; attribute vec4 iF; attribute vec4 iG;
uniform float uTime; uniform vec3 uQ[120]; uniform vec3 uS; uniform vec3 uWheel;
vec3 crPos(vec3 a, vec3 b, vec3 c, vec3 d, float t){ return .5 * (2. * b + (c - a) * t + (2. * a - 5. * b + 4. * c - d) * t * t + (3. * b - a - 3. * c + d) * t * t * t); }
vec3 crTan(vec3 a, vec3 b, vec3 c, vec3 d, float t){ return .5 * ((c - a) + 2. * (2. * a - 5. * b + 4. * c - d) * t + 3. * (3. * b - a - 3. * c + d) * t * t); }
varying vec2 vUv; varying vec3 vP; varying vec3 vN; varying vec3 vK;
#include <fog_pars_vertex>
void main(){
  // iF = (flock 0 | 1, place along the curve, offset to the side, offset up); iG = (seed, size, wingbeat, unused)
  bool two = iF.x > .5, wheel = iF.x > 1.5, skein = two && !wheel;
  // flock one flies a Catmull-Rom curve through four of its six points (three spans); flock two through 55 of its 57 (54 spans), and fills the share uS.z of it.
  // Flock two is thick in its middle and thin at head and tail: the dealt place gives back its own even draw (the power undoes the deal's), and one sine gathers it.
  float pl = pow(iF.y, 1. / .58), ys = skein ? pl + .7 * sin(6.2831853 * pl) / 6.2831853 : iF.y;
  float ns = two ? 54. : 3., tt = clamp((two ? uS.y : uS.x) + ys * (two ? uS.z : .5), -.15, 1.15) * ns, sg = clamp(floor(tt), 0., ns - 1.), lt = tt - sg;
  int o = (two ? 6 : 0) + int(sg + .5);
  vec3 c = crPos(uQ[o], uQ[o + 1], uQ[o + 2], uQ[o + 3], lt);
  vec3 tn = skein ? crPos(uQ[o + 57], uQ[o + 58], uQ[o + 59], uQ[o + 60], lt) : vec3(0., 1., 0.);      // flock two: the way its ribbon faces, laid with the course
  vec3 fw = normalize(crTan(uQ[o], uQ[o + 1], uQ[o + 2], uQ[o + 3], lt) + vec3(0., 0., 1e-3));
  if (wheel) {                                                       // the third flock wheels slowly round the ring and the horn tips, upright in the mouth, facing down the shell
    float R = 60. + 50. * iF.y, a = iG.x * 6.2832 + uTime * (10. + 5. * fract(iG.x * 7.)) / R;
    c = uWheel + vec3(cos(a) * R, sin(a) * R * .7, iF.z * 9. + 30. * sin(2. * a + iG.x * 6.));
    fw = normalize(vec3(-sin(a) * R, cos(a) * R * .7, 60. * cos(2. * a + iG.x * 6.)) + vec3(0., 0., 1e-3));
  }
  vec3 up0 = skein ? vec3(0., 1., 0.) : normalize(vec3(-c.xy, 0.) + vec3(0., 40., 0.));      // (flock two flies wings level: its course passes close by the axis, where the other rule turns a bird over)
  vec3 sd = normalize(cross(up0, fw) + vec3(1e-4, 0., 0.)), up = cross(fw, sd);
  // flock two's ribbon has axes of its own, which only PLACE its birds (each bird's body keeps sd and up: wings level, pitched along its course):
  // the 30 m lie square to the course and to tn, the 9 m along tn
  vec3 rs = sd, ru = up;
  if (skein) { rs = normalize(cross(tn, fw)); ru = cross(fw, rs); }
  float s = iG.x;
  c += (rs * (iF.z * (skein ? 3.6 : 1.) + 1.6 * sin(uTime * .5 + s * 20.)) + ru * (iF.w + 1.3 * sin(uTime * .37 + s * 33.))) * (wheel ? .3 : 1.);
  float ph = uTime * iG.z + s * 40., glide = smoothstep(-.2, .5, sin(uTime * .31 + s * 17.));    // beats, then a glide
  vec3 l = position; float w = aK.x;
  float lift = (sin(ph) * w * .62 + sin(ph - .9) * w * w * .34) * glide + w * .12 * (1. - glide);
  l.y += lift; l.x *= 1. - .12 * abs(lift);
  l.y += -.05 * sin(ph) * (1. - w) * glide;                                                       // the body rides the beat
  float bank = .25 * cos(uTime * .5 + s * 20.);
  l = vec3(l.x * cos(bank) - l.y * sin(bank), l.x * sin(bank) + l.y * cos(bank), l.z) * iG.y;
  vec3 p = c + sd * l.x + up * l.y + fw * l.z;
  vec3 nl = normalize(normal + vec3(0., 1e-4, 0.));
  vP = p; vN = sd * nl.x + up * (nl.y + .35) + fw * nl.z; vUv = vec2(w, aK.z); vK = vec3(aK.y, wheel ? 3. : two ? 2. : 1., s);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,le=`
varying vec3 vK; uniform vec3 uBird; uniform float uTips;
void main(){
  vec3 col = uBird;
  float fl = smoothstep(.3, 1., vUv.y);                               // the trailing flight feathers
  if (vK.x > .5 && vK.x < 1.5) col = uGold * vec3(.9, .62, .22);
  else if (vK.x > 1.5 && vK.x < 2.5) col = uViolet * .3;
  col = mix(col, col * mix(vec3(.80, .82, .9), vec3(.5, .2, .3), uTips), fl * .6);                 // a soft band along the trailing edge
  col = mix(col, uViolet * .2, uTips * smoothstep(.84, .95, vUv.x) * (.4 + .6 * fl));       // ibis: only the very tips are dark
  vec3 n = normalize(vN + vec3(0., 1e-4, 0.));
  vec3 V = normalize(uCam - vP + vec3(1e-3, 0., 0.));
  float under = step(dot(n, V), 0.);
  if (under > .5) n = -n;
  vec3 toSun = normalize(-vP + vec3(0., 0., 1e-3));
  vec3 lit = shellLight(vP, normalize(mix(n, toSun, .45) + vec3(0., 1e-4, 0.)), vK.y, 1., 1.);
  float vis = sunVis(vP, vK.y);
  // seen from below against the lit dome: cool shadow on the body, and the light coming through the spread feathers
  lit = mix(lit, mix(uViolet, vec3(.5, .55, .85), .45) * .55, .68 * under);
  float last = step(2.5, vK.y);                                       // the birds of the last room blaze gold where they cross the shaft from door 3
  lit = mix(lit, lit * .3, last * vis);
  lit += mix(keyColor(min(vK.y, 2.)), keyColor(1.) * 1.3, last) * (vis * (.5 - .3 * under) + under * (.03 + .26 * smoothstep(.45, 1., vUv.x)));
  vec3 c = hazed(col * lit, vP) * uExpo;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`;pt.push(async e=>{const{rng:u,V:n,path:a,U:o,A:g}=e,f=[],F=[],A=60,t=200,y=70;for(let Z=0;Z<y;Z++)f.push(2,u(),u.gauss(),0),F.push(u(),u.range(1.6,2.2),u.range(7,9.5),0);for(let Z=0;Z<A+t;Z++){const P=Z>=A,k=P?15:7,E=u(),Q=u.gauss(),$=u.gauss();f.push(P?1:0,P?Math.pow(E,.58):E*.5,P?vt(Q,-1.6,1.6)*2.6:Q*k*.5,P?vt($,-1.6,1.6)*2.1:vt($*2.2,-3,2.5)),F.push(u(),u.range(.9,1.15)*(P?1.3:1.15),P?u.range(8,10.5):u.range(10.5,13),0)}const z=new l.InstancedBufferGeometry,w=ie();z.index=w.index,z.setAttribute("position",w.attributes.position),z.setAttribute("normal",w.attributes.normal),z.setAttribute("aK",w.attributes.aK),z.setAttribute("iF",new l.InstancedBufferAttribute(new Float32Array(f),4)),z.setAttribute("iG",new l.InstancedBufferAttribute(new Float32Array(F),4)),z.instanceCount=A+t+y;const p=(Z,P,k)=>{const E=a.pointAt(Z,new l.Vector3),Q=a.tangentAt(Z,new l.Vector3),$=new l.Vector3().crossVectors(Q,D(0,1,0)).normalize(),rt=new l.Vector3().crossVectors(Q,$).normalize();return E.addScaledVector($,P).addScaledVector(rt,k)},h=o.lake1,i=o.door2,s=[[h-.041,-4,16],[h-.026,0,15],[h,3,10],[h+.026,9,14],[h+.056,19,14],[i-.004,30,10]].map(Z=>p(Z[0],Z[1],Z[2])),c=12.5/183,R=o.flock2*a.length,r=o.door2*a.length,m=2*(R-c*(a.length-R)-r),V=R*(1+c)+m/2,H=m/(V-r),U=o.sink*a.length,T=o.low*a.length,B=Z=>vt(Z/a.length,0,1),K=(Z,P,k)=>p(B(Z),P,k).sub(a.pointAt(B(Z),new l.Vector3)),N=Z=>{const P=K(U,Math.SQRT1_2,-Math.SQRT1_2),k=Math.ceil(Math.abs(Z-U)/4),E=new l.Vector3;for(let Q=1;Q<=k;Q++)a.tangentAt(B(U+(Z-U)*Q/k),E),P.addScaledVector(E,-P.dot(E)).normalize();return P},L=Math.cos(Math.PI/12),at=Math.sin(Math.PI/12),O=[],X=[];for(let Z=-1;Z<=55;Z++){const P=V+(r-V)*Z/54,k=(P-T)/30,E=.5+.5*Math.tanh(k),Q=Math.cosh(k/2),$=N(P).multiplyScalar(1-E).addScaledVector(K(P,-L,-at),E).normalize(),rt=a.pointAt(B(P),new l.Vector3).addScaledVector($,45-18/(Q*Q));O.push(rt),X.push(rt.clone().sub(a.pointAt(B(P-90),new l.Vector3)).normalize())}s.push(...O,...X);const Y=h-.026,W=h+.056,tt=n.cast==="ibis",it={uQ:{value:s},uS:{value:new l.Vector3(0,0,H)},uWheel:{value:g.portalSeat.position.clone().add(D(0,14,-40))},uBird:{value:new l.Color(tt?"#F0A0AE":"#F4F2EC")},uTips:{value:tt?1:0}},et=new l.Mesh(z,ct(e,re,le,it,{side:l.DoubleSide}));et.frustumCulled=!1,et.name="birds",e.scene.add(et),e.onUpdate.push((Z,P,k,E)=>{it.uS.value.set(.12+.7*vt((E-Y)/(W-Y),0,1.25)+.004*Math.sin(P*.4),(1-H)*E,H)})});const Kt=`
${At}
attribute vec3 iB; attribute vec4 iS; uniform float uTime, uPx, uSeedCh; uniform vec3 uCam;
varying vec2 vUv; varying vec3 vP; varying vec3 vN; varying vec4 vC;
#include <fog_pars_vertex>
void main(){
  // iB = where it lifts off; iS = (seed, rise in metres, speed m/s, size)
  float f = fract(iS.x + uTime * iS.z / iS.y), h = f * iS.y;
  vec3 up = normalize(vec3(-iB.xy, 0.) + vec3(0., 1e-3, 0.));
  vec3 c = iB + up * h + vec3(0., 0., 1.) * h * .3;                                   // drifting down-shell as they rise
  c += vec3(sin(uTime * .6 + iS.x * 50.), cos(uTime * .47 + iS.x * 31.), sin(uTime * .53 + iS.x * 77.)) * (1.2 + .012 * h);
  float d = length(uCam - c), size = max(iS.w, d * uPx * 1.7);
  float rot = uTime * (.4 + iS.x) + iS.x * 40., cr = cos(rot), sr = sin(rot);
  vec2 q = (uv - .5) * 2., qr = vec2(q.x * cr - q.y * sr, q.x * sr + q.y * cr);
  vec3 p = c + (camRight() * qr.x + camUp() * qr.y) * size * .5;
  float fade = smoothstep(0., .05, f) * (1. - smoothstep(.86, 1., f)) * smoothstep(1.6, 4., d) * min(1., iS.w / max(d * uPx * 1.7, 1e-3) * 1.6);
  fade *= 1. - step(2.5, uSeedCh) * smoothstep(450., 1000., d);      // the tufts along the spur are not seen from far off: piled up end-on they would smear the stars in the mouth
  vP = p; vN = up; vUv = uv; vC = vec4(fade, iS.x, 0., 0.);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,qt=`
varying vec4 vC; uniform float uSeedCh;
void main(){
  vec2 q = vUv * 2. - 1.; float r = length(q);
  if (r > 1.) discard;
  float ang = atan(q.y, abs(q.x) + 1e-4);
  float spk = abs(cos(ang * 9.5 + vC.y * 6.)); float spokes = spk * spk * spk * (1. - r) * smoothstep(.08, .3, r);
  float last = step(2.5, uSeedCh), core = 1. - smoothstep(.0, .16, r), halo = (1. - r) * (1. - r) * mix(.45, .12, last);      // against the stars a seed must stay a tuft, not a pale disc
  float a = clamp(core + spokes * .5 + halo, 0., 1.) * vC.x * .9;
  vec3 lit = (keyColor(uSeedCh) * sunVis(vP, uSeedCh) * 2.4 + mix(uViolet, vec3(.9, .93, 1.), .7) * .62) * mix(1., .6, last);
  vec3 c = hazed(vec3(.96, .95, .9) * lit, vP) * uExpo;
  gl_FragColor = vec4(c, a);
  #include <fog_fragment>
}`;pt.push(async e=>{const{ctx:u,rng:n,V:a,path:o}=e,g=Math.round((a.rare?9e3:2200)*a.detail),f=e.fernTops,F=f.length/4,A=new Float32Array(g*3),t=new Float32Array(g*4),y=new l.Vector3,z=new l.Vector3,w=e.uAtZ(700),p=e.uAtZ(1e3);for(let c=0;c<g;c++)if(c%300===299&&await u.yield(),F===0||n()<(a.rare?.7:.5)){o.pointAt(nt(w,p,n()),y);const r=(a.rare?42:32)*Math.sqrt(n())+4.5,m=n()*st;z.set(Math.cos(m)*r,Math.sin(m)*r,n.range(-20,20)),y.add(z);const V=Math.hypot(y.x,y.y),H=a.rare?Math.max(40,V-10):36,U=n()*H*.6,T=V>1?(V+U)/V:1;A[c*3]=y.x*T,A[c*3+1]=y.y*T,A[c*3+2]=y.z-U*.3,t[c*4]=n(),t[c*4+1]=H,t[c*4+2]=n.range(1.2,2.6),t[c*4+3]=n.range(.45,.7)*(a.rare?2.2:1)}else{const r=n.int(0,F-1)*4,m=f[r+3],V=Math.hypot(f[r],f[r+1]),H=(V-11*m)/V;A[c*3]=f[r]*H+n.range(-3,3),A[c*3+1]=f[r+1]*H+n.range(-3,3),A[c*3+2]=f[r+2]+n.range(-3,3),t[c*4]=n(),t[c*4+1]=a.rare?V*.9:n.range(50,150),t[c*4+2]=n.range(1.2,2.8)*(a.rare?1.6:1),t[c*4+3]=n.range(.45,.7)}const h=new l.InstancedBufferGeometry,i=new l.PlaneGeometry(1,1).translate(.5,.5,0);h.index=i.index,h.setAttribute("position",i.attributes.position),h.setAttribute("uv",i.attributes.uv),h.setAttribute("iB",new l.InstancedBufferAttribute(A,3)),h.setAttribute("iS",new l.InstancedBufferAttribute(t,4)),h.instanceCount=g;const v={uPx:{value:.003},uSeedCh:{value:1}};e.uPx=v.uPx;const s=new l.Mesh(h,ct(e,Kt,qt,v,{transparent:!0,depthWrite:!1}));s.frustumCulled=!1,s.renderOrder=6,s.name="seeds",e.scene.add(s),e.patch.push(s),e.onUpdate.push((c,R,r,m,V)=>{v.uPx.value=2*Math.tan((r.fov||68)*bt/2)/Math.max(1,V.y)})});const ce=`
attribute vec4 iR; uniform float uTime, uPx; uniform vec3 uCam; uniform vec3 uO[3]; uniform vec3 uD[3]; uniform vec3 uHR[3];
varying vec2 vUv; varying vec3 vP; varying vec3 vN; varying vec4 vC;
#include <fog_pars_vertex>
void main(){
  // iR = (shower 0..2, seed, offset along the axis, offset across); uHR = (height, column radius, streak length)
  int k = int(iR.x + .5);
  vec3 O = uO[k], D = uD[k], HR = uHR[k];
  float H = HR.x, f = fract(iR.y + uTime * (70. + 30. * fract(iR.y * 13.)) / H);
  float g = f + (uv.y - .5) * HR.z / H;
  vec3 e2 = normalize(cross(D, vec3(0., 0., 1.)) + vec3(1e-4, 0., 0.));
  vec3 base = O + vec3(0., 0., 1.) * iR.z * HR.y + e2 * iR.w * HR.y * (1. + 1.2 * g);        // the column flares as it falls
  vec3 c = base + D * (g * H) + vec3(0., 0., 1.) * (g * g * H * .42);                    // outward, with a growing sideways term
  vec3 vel = normalize(D + vec3(0., 0., 1.) * (g * .84) + vec3(0., 1e-4, 0.));
  vec3 toCam = normalize(uCam - c + vec3(1e-3, 0., 0.));
  vec3 across = normalize(cross(vel, toCam) + vec3(0., 1e-4, 0.));
  float d = length(uCam - c), wd = max(.22, d * uPx * 1.6);
  vec3 p = c + across * (uv.x - .5) * wd;
  float fade = smoothstep(0., .08, f) * (1. - smoothstep(.8, .98, f)) * smoothstep(20., 60., d);
  vP = p; vN = toCam; vUv = uv; vC = vec4(fade, k < 1 ? 2. : k < 2 ? 3. : 2., fract(iR.y * 7.), 0.);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,he=`
varying vec4 vC;
void main(){
  float e = clamp(1. - abs(vUv.x * 2. - 1.), 0., 1.), l = sin(3.14159 * clamp(vUv.y, 0., 1.));
  float last = step(2.5, vC.y);                                       // the shower of the last room: bright where the shaft lights it, a pale veil against the blue beyond
  float a = e * l * l * vC.x * (.2 + .22 * vC.z) * (1. + .7 * last);
  vec3 lit = keyColor(vC.y) * sunVis(vP, vC.y) * (2.2 + 1.2 * last) + vec3(.6, .7, 1.) * .5 + vec3(.8, .9, 1.) * .3 * last;
  vec3 c = hazed(vec3(.86, .9, 1.) * lit, vP) * uExpo;
  gl_FragColor = vec4(c, a);
  #include <fog_fragment>
}`;pt.push(async e=>{const{rng:u,V:n}=e,a=n.weather==="heavy",o=Math.round((a?3600:2800)*n.detail),g=new Float32Array(o*4);for(let y=0;y<o;y++){y%500===499&&await e.ctx.yield();const z=u(),w=a?z<.42?0:z<.74?1:2:z<.58?0:1,p=u()*st,h=Math.sqrt(u());g[y*4]=w,g[y*4+1]=u(),g[y*4+2]=Math.cos(p)*h,g[y*4+3]=Math.sin(p)*h}const f=new l.InstancedBufferGeometry,F=new l.PlaneGeometry(1,1).translate(.5,.5,0);f.index=F.index,f.setAttribute("position",F.attributes.position),f.setAttribute("uv",F.attributes.uv),f.setAttribute("iR",new l.InstancedBufferAttribute(g,4)),f.instanceCount=o;const A={uPx:e.uPx,uO:{value:[D(-10,-30,1600),D(215,150,2660),D(-30,30,1880)]},uD:{value:[D(-.34,-.94,0).normalize(),D(.82,.57,0).normalize(),D(-.5,.86,0).normalize()]},uHR:{value:[D(600,55,34),D(1050,170,76),D(600,60,34)]}},t=new l.Mesh(f,ct(e,ce,he,A,{transparent:!0,depthWrite:!1,side:l.DoubleSide}));t.frustumCulled=!1,t.renderOrder=4,t.name="showers",e.scene.add(t)}),pt.push(async e=>{const{rng:u,V:n}=e,a=Math.round(3e3*n.detail),o=new Float32Array(a*3),g=new Float32Array(a*4),f=e.A.portalSeat.position;for(let y=0;y<a;y++){y%500===499&&await e.ctx.yield();const z=u()*st,w=9+120*Math.pow(u(),1.5),p=u()<.55?u.range(2500,3760):u.range(2250,4470);o[y*3]=Math.cos(z)*w*1.9,o[y*3+1]=Math.sin(z)*w*1.9,o[y*3+2]=2300+(p-2250)*.62,Math.hypot(o[y*3]-f.x,o[y*3+1]-f.y,o[y*3+2]-f.z)<70&&(o[y*3+1]+=150),g[y*4]=u(),g[y*4+1]=Math.max(6,w-7.5),g[y*4+2]=u.range(.8,2.4),g[y*4+3]=u.range(.4,.8)}const F=new l.InstancedBufferGeometry,A=new l.PlaneGeometry(1,1).translate(.5,.5,0);F.index=A.index,F.setAttribute("position",A.attributes.position),F.setAttribute("uv",A.attributes.uv),F.setAttribute("iB",new l.InstancedBufferAttribute(o,3)),F.setAttribute("iS",new l.InstancedBufferAttribute(g,4)),F.instanceCount=a;const t=new l.Mesh(F,ct(e,Kt,qt,{uPx:e.uPx,uSeedCh:{value:3}},{transparent:!0,depthWrite:!1}));t.frustumCulled=!1,t.renderOrder=6,t.name="mouthSeeds",e.scene.add(t)});const wt={R:[150,161,176,193,210.5,213.5],LV:[.12,.4,.7,1]},Pt=(e,u)=>u<.5?0:lt(.12,.3,Math.sin(e*(7+2*u)+1.7*u)),ue=`
// uHb: centre of the water (xyz) and the angle of the spire (w); uTw: the spire's place and the height of its tip, in the
// harbour's frame; uHbM: the harbour's axes (world = uHb.xyz + uHbM * local); all declared with the shell's light
float hbRim(float th){ float d = th - uHb.w; d = atan(sin(d), cos(d)); return 30. * (1. + .24 * exp(-d * d * 8.)); }
float hbHash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
// gardens and houses take turns along each terrace k (0 the quay .. 3 the rim walk): 1 where it is planted
float hbGarden(float th, float k){ return smoothstep(.12, .3, sin(th * (7. + 2. * k) + 1.7 * k)) * step(.5, k); }
`;async function ve(e,u){const n=[],a=[],o=[],g=[],f=i=>Rt(i,e.towerAng),A=wt.R,t=wt.LV,y=i=>{const v=[[2,-150,0],[17,-146,0]];for(let s=1;s<=11;s++){const c=s/11;v.push([17+(A[5]+1.3-17)*Math.pow(c,.8),-146+(146+i*.9)*Math.pow(c,1.52),0])}v.push([A[5]+1.5,i*.96,0],[A[5]+1.2,i+1.8,0],[A[5]-1,i+2.6,.5],[A[4],i+1.2,1],[A[4],i,1]);for(let s=3;s>=1;s--)v.push([A[s]+.4,i*t[s],1],[A[s],i*t[s],1],[A[s],i*t[s-1],1]);return v.push([A[0]+.4,i*t[0],1],[A[0],i*t[0],1],[A[0],-7,1],[0,-7,1]),v},z=y(30).length;for(let i=0;i<=168;i++){const v=i/168*st,s=y(f(v)),c=Math.cos(v),R=Math.sin(v);for(let r=0;r<z;r++)n.push(s[r][0]*c,s[r][1],s[r][0]*R),a.push(s[r][2]),o.push(i/168,r/z);i%56===55&&await u.yield()}for(let i=0;i<168;i++)for(let v=0;v<z-1;v++){const s=i*z+v,c=s+z;g.push(s,s+1,c,s+1,c+1,c)}await u.yield();const w=(i,v,s,c)=>{const R=n.length/3;for(let r=0;r<=v;r++){const[m,V,H,U,T]=i(r/v);for(let B=0;B<=s;B++){const K=B/s*st;n.push(m+Math.cos(K)*U,V,H+Math.sin(K)*U),a.push(c),o.push(B/s,T===void 0?V:T)}}for(let r=0;r<v;r++)for(let m=0;m<s;m++){const V=R+r*(s+1)+m,H=V+s+1;g.push(V,H,V+1,V+1,H,H+1)}};w(i=>[50*Math.sin(Math.PI*i)*(1-.4*i),-146-1230*i,-80*Math.sin(Math.PI*i*.9)*i,16+12*i*i+46*Math.pow(i,6)],26,18,0);{const i=e.tl[0],v=e.tl[1],s=e.headH-5,c=s+4,R=e.towerH,r=[[11.5,s,-.6],[9.6,s+2.2,-.3]];let m=0,V=.2/(1-Math.pow(.8,8));for(let U=0;U<8;U++){for(let T=U?1:0;T<=6;T++){const B=T/6,K=m+V*B;r.push([(8.6*Math.pow(Math.max(0,1-K),.85)+.1)*(.84+.26*Math.pow(Math.max(0,Math.sin(Math.PI*B)),.7)),c+(R-c)*Math.min(1,K),U+B])}m+=V,V*=.8}let H=0;w(()=>{const U=r[H++];return[i,U[1],v,U[0],U[2]]},r.length-1,24,2)}e.piers=[];for(let i=0;i<5;i++){const v=e.towerAng+[.55,1.5,2.6,-2.2,-1.1][i],s=[54,42,58,48,58][i],c=4.6,R=Math.cos(v),r=Math.sin(v),m=3.5;e.piers.push({th:v,len:s});const V=n.length/3,H=A[0]+2,U=A[0]-s;for(const[T,B,K]of[[H,-1,m],[H,1,m],[U,1,m],[U,-1,m],[H,-1,-6],[H,1,-6],[U,1,-6],[U,-1,-6]])n.push(T*R-B*c*r,K,T*r+B*c*R),a.push(3),o.push(H-T,B);for(const T of[[0,1,2,3],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]])g.push(V+T[0],V+T[1],V+T[2],V+T[0],V+T[2],V+T[3])}const p=new l.Vector3;for(let i=0;i<n.length;i+=3)e.world(n[i],n[i+1],n[i+2],p),n[i]=p.x,n[i+1]=p.y,n[i+2]=p.z,i%3e4===29997&&await u.yield();const h=new l.BufferGeometry;return h.setAttribute("position",new l.Float32BufferAttribute(n,3)),h.setAttribute("aSide",new l.Float32BufferAttribute(a,1)),h.setAttribute("uv",new l.Float32BufferAttribute(o,2)),h.setIndex(g),await u.yield(),h.computeVertexNormals(),h}const fe=`
attribute float aSide;
varying vec2 vUv; varying vec3 vP; varying vec3 vN; varying float vSide;
#include <fog_pars_vertex>
void main(){
  vUv = uv; vP = position; vN = normal; vSide = aSide;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,de=ue+`
uniform float uPx; varying float vSide;
void main(){
  vec3 l = (vP - uHb.xyz) * uHbM, up = uHbM[1];                         // this point in the harbour's frame; the harbour's up
  float r = length(l.xz), th = atan(l.z, l.x + 1e-4), y = l.y, Hh = hbRim(th);
  vec3 V = normalize(uCam - vP + vec3(1e-3, 0., 0.));
  vec3 n = normalize(vN + vec3(0., 1e-5, 0.));
  if (dot(n, V) < 0.) n = -n;
  float px = length(uCam - vP) * uPx;                                   // metres per pixel here
  float ndv = clamp(dot(n, V), 0., 1.), vis = sunVis(vP, 3.), det = 1. - smoothstep(.35, 1.5, px);
  vec3 toSun = normalize(-vP + vec3(0., 0., 1e-3)), c;
  float nz = texture2D(uNoise, vec2(th * .9, y / 190.)).r, fine = texture2D(uNoise, vec2(th * 9., y / 23.)).b;
  vec3 lilac = mix(uPearl, uViolet, .55) * .6;                          // shadowed pearl
  vec3 pale = mix(uPearl, vec3(.95, .87, .74), .72);                    // the town's own stone: quarried pale and warm
  vec3 pearl = uPearl * clamp(.5 / max(dot(uPearl, vec3(.3, .55, .15)), .05), .76, 1.7) * .76;      // grown pearl, pale as the cradle's: the bowl must read from across the room
  if (vSide < .25) {
    // the outside of the bowl and its stalk, grown as the cradle is: ribs running down from the lip, a growth ring
    // every 18 m, a fringe of moss hanging under the lip, the two-hue sheen
    float rib = cos(th * 44.) * (1. - smoothstep(.35, 1.4, px / max(r, 1.) * 44.));
    float gq = (y + .45 * r) / 18., ring = smoothstep(.43, .47, abs(fract(gq) - .5)) * (1. - smoothstep(2., 9., px));
    vec3 alb = pearl * (.86 + .2 * nz) * (.94 + .06 * sin(gq * 25.13));
    alb = mix(alb, lilac, (1. - smoothstep(-.7, .3, rib)) * .7 * smoothstep(30., 90., r));
    alb = mix(alb, lilac * 1.03, ring * .6);
    float fz = texture2D(uNoise, vec2(th * 2.3, .37)).r;
    float fringe = smoothstep(Hh - 26. - 16. * fz, Hh - 12. - 8. * fz, y) * (1. - smoothstep(Hh - 3., Hh, y)) * step(100., r) * (.7 + .3 * fine);
    alb = mix(alb, mix(uForest, uGold, .45) * vec3(.42, .50, .16) * (.6 + .8 * fine), fringe * .85);
    float under = smoothstep(-110., 20., y);                           // the bowl turns under into its own shade, thin and violet
    c = alb * (shellLight(vP, n, 3., 1., 1.) * mix(.8, 1., under) + vec3(1., .84, .56) * .5 * vis * clamp(dot(n, toSun) * 1.4 + .3, 0., 1.)) + sheen(ndv, gq + rib, nz) * (.5 + .5 * vis) * (1. - fringe);
    c = mix(c, c * mix(vec3(1.), uViolet * 2.6, .5), (1. - under) * .3);
    c = mix(c, c * vec3(1.22, 1.03, .70), max(vis, .6) * .5 * (1. - fringe));                          // the shaft from behind us washes it pale gold, as it does the cradle
  } else if (vSide < 1.5) {
    // inside: dry-stone walls between the terraces, paved walks, beds of rice, mustard and roses
    vec3 gn = normalize(cross(dFdx(vP), dFdy(vP)) + vec3(0., 1e-6, 0.));
    if (dot(gn, V) < 0.) gn = -gn;
    float flatness = smoothstep(.45, .8, abs(dot(gn, up)));
    float j = r < 155.5 ? 0. : r < 168.5 ? 1. : r < 184.5 ? 2. : 3.;     // which wall this is (quay wall, three risers)
    float rj = j < .5 ? 150. : j < 1.5 ? 161. : j < 2.5 ? 176. : 193.;
    float y0 = j < .5 ? -8. : Hh * (j < 1.5 ? .12 : j < 2.5 ? .40 : .70), y1 = Hh * (j < .5 ? .12 : j < 1.5 ? .40 : j < 2.5 ? .70 : 1.);
    float s = th * rj, hgt = max(y1 - y0, .5), t = clamp((y - y0) / hgt, 0., 1.);
    float crow = floor((y - y0) / .62), cw = .75 + .8 * hbHash(vec2(crow, j + 3.));                // dry stone: every course its own stones, none two alike
    vec2 b = vec2(s / (1.5 * cw) + 7. * hbHash(vec2(crow, 7.)), (y - y0) / .62);
    vec2 bf = abs(fract(b) - .5);
    float joint = smoothstep(.34, .47, max(bf.x, bf.y)) * det, bh = hbHash(floor(b) + 3.7);
    vec3 stone = mix(pale * .86, mix(pale, uViolet, .34) * .56, mix(.5, bh * bh, det)) * (.84 + .3 * fine) * (1. - .5 * joint);
    stone = mix(stone, pale * vec3(1.04, .90, .70) * .8, step(.78, bh) * det * .6);                     // a rusty stone here and there
    vec2 lb = vec2(s / 2.7 + .5 * floor((y - y0) / 1.86), (y - y0) / 1.86);                            // built in lifts of big footing stones: these still read from across the lagoon
    stone *= .86 + .28 * hbHash(floor(lb) + j * 11.) * (1. - smoothstep(.9, 2.6, px));
    float bq = abs(fract(s / 10.4) - .5), butt = smoothstep(.40, .46, bq);                            // a buttress every ten metres, its shadow beside it
    stone *= 1. + .16 * butt - .12 * smoothstep(.30, .40, bq) * (1. - butt);
    float fs = fract(s / 41.6) * 2.6, st = abs(t - fs), stair = (1. - smoothstep(.6, 1.1, st * hgt)) * step(fs, 1.) * step(.5, j);      // a flight of steps up each wall, one to a block
    stone = mix(stone, pale * (.74 + .26 * step(.45, fract((y - y0) / .42))), stair * .85 * mix(.6, 1., det));                          // tread by tread
    float hang = smoothstep(.45, .7, texture2D(uNoise, vec2(s / 37., j * .37)).g) * smoothstep(.55, 1., t + .3 * (fine - .5));   // plants spilling over the top
    stone = mix(stone, mix(uForest, uGold, .3) * vec3(.62, .78, .40), hang * .8 * step(.5, j) * (1. - stair));
    // here and there a tall wall carries a planted ledge: a dry-stone lip and a few metres of green, mustard or blossom trailing over it
    float lq = (y - y0) / 3.3, lf = fract(lq), lseg = s / 6.5 + 3.1 * floor(lq), lh = hbHash(vec2(floor(lq) + j * 5., floor(lseg)));
    float lend = smoothstep(.0, .16 + .2 * fine, .5 - abs(fract(lseg) - .5));                          // each ledge ends raggedly
    float ledge = step(5., hgt) * step(.5, j) * step(.5, floor(lq)) * step(lh, .5) * lend * (1. - stair) * (1. - smoothstep(.34, .46 + .2 * (fine - .5), lf)) * (1. - smoothstep(hgt - 1.4, hgt - .8, y - y0));
    vec3 lcrop = lh < .22 ? vec3(.36, .58, .20) : lh < .37 ? vec3(.80, .64, .17) : vec3(.84, .44, .50);
    stone = mix(stone, lcrop * (.7 + .5 * fine) * (.75 + .5 * smoothstep(.0, .3, lf)), ledge * .92);
    stone *= 1. - .25 * step(5., hgt) * step(.5, j) * step(lh, .5) * lend * smoothstep(.46, .56, lf) * (1. - smoothstep(.56, .8, lf));      // and its shadow on the stones below
    float wet = (1. - smoothstep(-.5, 2.2, y)) * step(j, .5);                                        // the quay wall: darker and weedy at the water line
    stone = mix(stone, mix(uForest * .4, uViolet * .5, .5), wet * .8);
    vec3 wall = stone * shellLight(vP, gn, 3., 1., 1.) * (.78 + .22 * t);
    float k = r < 161. ? 0. : r < 176. ? 1. : r < 193. ? 2. : 3.;       // which walk
    float r0 = k < .5 ? 150. : k < 1.5 ? 161. : k < 2.5 ? 176. : 193., r1 = k < .5 ? 161. : k < 1.5 ? 176. : k < 2.5 ? 193. : 210.5, rl = r0 + 8.;
    float slabOn = 1. - smoothstep(.5, 2., px);
    float gr = texture2D(uNoise, l.xz / 9.3).b, gr2 = texture2D(uNoise, l.xz / 31.).r;               // the grain of the ground: as fine one way across a walk as the other
    vec2 sc = vec2(r / 2.6, th * rl / 3.4 + .5 * floor(r / 2.6)), sf = abs(fract(sc) - .5);         // paving: slabs 2.6 by 3.4 m, each its own tone, a dark joint between
    float slab = (1. - .3 * smoothstep(.38, .48, max(sf.x, sf.y)) * slabOn) * (.9 + .2 * hbHash(floor(sc) + k * 5.) * slabOn);
    vec3 pave = pale * .80 * (.84 + .16 * gr + .12 * gr2) * slab;
    float gdn = hbGarden(th, k), gd = gdn * smoothstep(r0 + 1.6, r0 + 2.6, r);
    // between the houses of a village: kitchen plots, each a few rows of green, mustard or blossom, in swept earth
    vec2 pc = vec2(th * rl / 6.2, (r - r0) / 5.4); vec2 pi = floor(pc), pf = fract(pc); float ph = hbHash(pi + k * 9.3);
    float plot = step(.5, k) * (1. - gdn) * step(.34, ph) * smoothstep(.06, .12, min(min(pf.x, 1. - pf.x), min(pf.y, 1. - pf.y))) * smoothstep(r0 + 1.6, r0 + 2.6, r);
    vec3 pcrop = ph < .62 ? vec3(.38, .58, .22) : ph < .82 ? vec3(.78, .62, .18) : vec3(.82, .44, .50);
    pave = mix(pave, mix(pale * vec3(.86, .74, .58) * .8, pcrop, .35 + .65 * smoothstep(.3, .45, abs(fract(pf.x * 4.) - .5)) * mix(1., slabOn, .6)) * (.8 + .4 * gr), plot);
    // a planted terrace: beds seven to nine metres long between low walls, each with its own crop set out plant by plant
    // in rows that run across the terrace in one bed and along it in the next
    float bw = 7. + 2. * hbHash(vec2(floor(th * rl / 34.), k)), bx = th * rl / bw, bed = floor(bx), bhs = hbHash(vec2(bed, k * 3.7 + 2.));
    vec3 crop = bhs < .45 ? vec3(.40, .60, .20) : bhs < .75 ? vec3(.80, .64, .17) : mix(uRose, vec3(.82, .42, .47), .5) * .85;
    float across = step(.5, fract(bhs * 7.7));
    vec2 gc = mix(vec2(th * rl / .95, (r - r0) / 1.5), vec2(th * rl / 1.5, (r - r0) / .95), across), gf = fract(gc) - .5;
    float tuft = 1. - smoothstep(.2, .46, length(gf * mix(vec2(.8, 1.), vec2(1., .8), across) + vec2(1e-4, 0.)) + .25 * (hbHash(floor(gc) + bed) - .5));
    vec3 earth = pale * vec3(.80, .66, .50) * .62;
    vec3 planted = mix(mix(earth, crop * (.8 + .5 * hbHash(floor(gc))), tuft), mix(earth, crop, .55), 1. - slabOn);
    float hedge = smoothstep(.40, .47, abs(fract(bx) - .5));                                          // a low wall between beds
    vec3 garden = mix(planted * (.8 + .4 * gr), pale * .66, hedge * .7);
    float kerb = 1. - smoothstep(.9, 1.5, r - r0);                                                     // the dry-stone lip of each terrace
    vec3 ground = mix(mix(pave, garden, gd), pale * .84 * (.85 + .3 * gr), kerb * .8);
    ground *= 1. - .34 * smoothstep(r1 - 2.6, r1 - .3, r) * step(k, 2.5);                              // the foot of the wall behind stands in that wall's shade
    vec3 walk = ground * shellLight(vP, normalize(up + toSun * .8), 3., 1., 1.) * 1.08;                // the sun is low behind us: what stands on the walks takes it full
    c = mix(wall, walk, flatness);
    c = mix(c, pearl * shellLight(vP, n, 3., 1., 1.), smoothstep(210., 211.5, r));                     // the rolled lip
  } else if (vSide < 2.5) {
    // the spire: a turret shell of the bowl's own pearl. Whorl on whorl with a seam of thin violet shade between,
    // fine ribs down each and a cord wound round it, the two-hue sheen; a few slit windows in its three lowest whorls.
    vec3 lt = l - vec3(uTw.x, l.y, uTw.z); float ta = atan(lt.z, lt.x + 1e-4), wv = vUv.y, wf = fract(wv), wk = floor(wv);
    float seam = 1. - smoothstep(.0, .13, min(wf, 1. - wf));
    float ribs = cos(ta * 16. + wk * 1.3) * (1. - smoothstep(.4, 2., px));
    float cord = smoothstep(.41, .48, abs(fract(wf * 3. + ta / 6.2831853) - .5)) * (1. - smoothstep(.3, 1.2, px));
    vec3 alb = pearl * (.88 + .16 * nz) * (.93 + .07 * ribs);
    alb = mix(alb, lilac, max(seam * .6, (1. - smoothstep(-.9, -.2, ribs)) * .2));
    alb = mix(alb, lilac * 1.05, cord * .22);
    float wc = ta / 6.2831853 * 5. + wk * .37;
    float slit = (1. - smoothstep(.03, .05, abs(fract(wc) - .5))) * step(.34, wf) * step(wf, .72) * step(0., wv) * step(wv, 3.) * step(.35, hbHash(vec2(wk, floor(wc))));
    slit *= 1. - smoothstep(1.5, 5., px);
    c = alb * (shellLight(vP, n, 3., 1., 1.) + vec3(1., .84, .56) * .5 * vis * clamp(dot(n, toSun) * 1.4 + .3, 0., 1.));
    c = mix(c, c * vec3(1.22, 1.03, .70), max(vis, .6) * .6);                                          // washed pale gold from behind us, as the cradle
    c = mix(c, vec3(.05, .07, .12), slit);                                                             // the slits stay dark
    c += sheen(ndv, wv * 1.5 + ribs * .3, nz) * (.5 + .5 * vis) * (1. - slit);
  } else {
    // jetties: coursed stone, weedy at the water line
    float top = smoothstep(.5, .8, abs(dot(n, up)));
    vec2 b = vec2(vUv.x / 1.8, mix(y / .6, vUv.y * 3.5, top)); b.x += .5 * floor(b.y);
    vec2 bf = abs(fract(b) - .5);
    float joint = smoothstep(.38, .47, max(bf.x, bf.y)) * det;
    vec3 stone = mix(pale * .78, mix(pale, uViolet, .3) * .62, texture2D(uNoise, floor(b) / 64. + .31).r) * (.85 + .25 * fine) * (1. - .4 * joint);
    stone = mix(stone, mix(uForest * .4, uViolet * .5, .5), (1. - smoothstep(-.3, 1.6, y)) * (1. - top) * .8);
    c = stone * shellLight(vP, mix(n, up, top), 3., 1., 1.) * mix(.8, 1.05, top);
  }
  c = hazed(c, mix(vP, uCam, .3)) * uExpo;                              // the harbour is the near thing of the room: it keeps more of its colour than the land beyond
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,pe=`
void main(){
  vec3 l = (vP - uHb.xyz) * uHbM; float r = length(l.xz), d = length(uCam - vP);      // in the harbour's frame, as the view below
  vec3 V = normalize(uCam - vP + vec3(1e-3, 0., 0.)) * uHbM;
  float near = 1. - smoothstep(120., 520., d);
  vec2 q = l.xz;
  vec3 nA = texture2D(uNoise, q / 61. + vec2(uTime * .009, uTime * .005)).rgb - .5;
  vec3 nB = texture2D(uNoise, q / 13.7 - vec2(uTime * .021, -uTime * .014)).gbr - .5;
  vec3 nC = texture2D(uNoise, q / 4.1 + vec2(-uTime * .05, uTime * .04)).brg - .5;
  vec2 tilt = nA.xy * .16 + nB.xy * .12 * (.35 + .65 * near) + nC.xy * .10 * near * near;
  vec3 n = normalize(vec3(tilt.x, 1., tilt.y));
  vec3 R = reflect(-V, n); R.y = abs(R.y) + .015; R = normalize(R);
  float ndv = clamp(dot(n, V), 0., 1.), x = 1. - ndv, fres = .04 + .96 * x * x * x * x * x;
  float vis = sunVis(vP, 3.);
  vec3 sky = uHaze * vec3(.64, .78, 1.) * (.62 + .3 * (1. - R.y));                              // the blue of the far land
  sky = mix(sky, vec3(.05, .07, .16), .55 * smoothstep(.6, .9, dot(uHbM * R, vec3(0., .17, .985))));   // and, toward the mouth, a little of its indigo
  vec3 body = mix(uSea * vec3(.36, .62, .68), uSea * vec3(.66, .96, .90), exp(-max(150. - r, 0.) / 30.) * .6);      // blue-green, paler in the shallows under the quay
  float rip = smoothstep(.3, .7, texture2D(uNoise, q / 6.3 + vec2(uTime * .03, -uTime * .02)).g + nB.y * near);      // ripples
  vec3 lagoonLit = body * shellLight(vP, uHbM[1], 3., 1., 1.) * .62;
  vec3 c = lagoonLit * (1. - fres) + sky * (.86 + .28 * rip) * (.12 + .88 * fres);
  c += mix(uPearl, keyColor(3.), .5) * (nB.x + nC.x * near) * .10 * (.4 + .6 * vis);            // light on the backs of the ripples
  float g = texture2D(uNoise, q / 9. + vec2(uTime * .06, -uTime * .045)).r * texture2D(uNoise, q / 3.3 - vec2(uTime * .11, uTime * .08)).g;
  c += keyColor(1.) * smoothstep(.40, .58, g) * vis * (.25 + .75 * near) * 1.5;                 // the sun on the water: a glint, where the shaft lies
  c = hazed(max(c, vec3(0.)), vP) * uExpo;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,me=`
${At}
attribute vec3 iP; attribute vec4 iS;
uniform float uTime, uPx, uExpo; uniform vec3 uCam; uniform mat3 uHbM;
varying vec2 vUv; varying vec4 vC;
float dVis(vec3 p, float zd, float rd){ float k = max(p.z - zd, 0.) / zd, rho = length(p.xy); return 1. - smoothstep(rd + (rd - 60.) * k - 2., rd + (rd + 60.) * k + 2., rho); }
void main(){
  vec3 c = iP; float d = max(length(uCam - c), 1.);
  vec3 V = (uCam - c) / d, s = normalize(-c + vec3(0., 0., 1e-3));       // to the eye, to the sun
  vec2 Vl = (V * uHbM).xz, sl = (s * uHbM).xz;                           // the same across the harbour's own plan
  vec2 h = Vl + sl; h /= max(length(h), 1e-3);                           // a wall facing this way mirrors the sun to the eye
  float best = 0.;
  for (int k = 0; k < 4; k++) {
    float a = iS.w + (iS.z - .5) * 1.2 + float(k) * 1.5707963; vec2 n = vec2(sin(a), cos(a));      // casements stand open at their own angles
    float f = max(dot(n, h), 0.); f *= f; f *= f; f *= f; f *= f; f *= f;                     // a lobe about 12 degrees wide
    best = max(best, f * step(0., dot(n, Vl)) * step(0., dot(n, sl)));
  }
  float vis = dVis(c, 210., 45.) * dVis(c, 1010., 95.) * dVis(c, 2210., 210.);
  float wmin = d * uPx * 1.7, wd = max(iS.x, wmin);     // its own width in metres (iS.x); under that, only the floor against flicker that the seeds have (1.7 pixels, SEED_VERT)
  float gain = best * (.22 + .78 * vis) * (.8 + .2 * sin(uTime * (1.3 + 2.4 * iS.z) + iS.z * 60.)) * exp(-d / 5200.) * min(1., iS.x / max(d * uPx * 1.7, 1e-3) * 1.6);      // and dimmed by how far its own width is under that floor, the form live's seeds have (live world:1159)
  c += V * 4.4;                                                          // stand clear of the wall
  vec3 p = c + (camRight() * (uv.x - .5) + camUp() * (uv.y - .5)) * wd;
  vUv = uv; vC = vec4(vec3(1., .79, .36) * 1.12, gain * 1.8);            // #FFE6A3, laid over what is behind it (not added: on a white wall an added light would only be white)
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
}`,we=`
varying vec2 vUv; varying vec4 vC;
void main(){
  vec2 q = vUv * 2. - 1.; float r2 = dot(q, q);
  if (r2 > 1.) discard;
  float f = 1. - r2, star = exp(-abs(q.x) * 26.) * exp(-abs(q.y) * 4.) + exp(-abs(q.y) * 26.) * exp(-abs(q.x) * 4.);
  float core = 1. - smoothstep(.34, .48, abs(q.x) + abs(q.y));                                  // a hard-edged lozenge and four thin rays: light off a pane, not a globe
  gl_FragColor = vec4(vC.rgb, clamp(vC.a * (core + star * 1.1 * f), 0., 1.));      // no halo round it
}`,xe=`
attribute vec3 iP; attribute vec4 iS; attribute vec4 iM; attribute vec2 aK;
uniform float uTime; uniform mat3 uHbM;
varying vec2 vUv; varying vec3 vP; varying vec3 vN; varying vec3 vK;
#include <fog_pars_vertex>
void main(){
  float a = iM.z + iM.y * uTime / max(iM.x, 1.), sg = iM.y < 0. ? -1. : 1.;
  vec3 c = iP + uHbM * vec3(cos(a), 0., sin(a)) * iM.x;                 // rounds lie in the plane of the harbour's water; masts stand along its up
  vec3 fwd = uHbM * vec3(-sin(a), 0., cos(a)) * sg, up = uHbM[1], side = cross(up, fwd);
  vec3 l = position, n = normal;
  float sd = sin(iS.z * 50.) > 0. ? 1. : -1., hl = sd * .16 * (1. + .25 * sin(uTime * .9 + iS.z * 30.));
  if (aK.x > 2.5) l.x += sd * aK.y * (1.05 + .2 * sin(uTime * 2.6 + iS.z * 20. + position.y * .8));
  float ch = cos(hl), sh = sin(hl);
  l = vec3(l.x * ch - l.y * sh, l.x * sh + l.y * ch, l.z); n = vec3(n.x * ch - n.y * sh, n.x * sh + n.y * ch, n.z);
  l.y += l.z * .04 * sin(uTime * 1.3 + iS.z * 44.) + .14 * sin(uTime * 1.1 + iS.z * 70.) - .1;
  l *= iS.x;
  vec3 p = c + side * l.x + up * l.y + fwd * l.z;
  vP = p; vN = side * n.x + up * n.y + fwd * n.z; vUv = uv; vK = vec3(aK.x, iS.z, aK.y);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ge=`
varying vec3 vK; uniform vec3 uSail;
void main(){
  vec3 n = normalize(vN + vec3(0., 1e-4, 0.)), V = normalize(uCam - vP + vec3(1e-3, 0., 0.)), col;
  if (dot(n, V) < 0.) n = -n;
  float cloth = step(2.5, vK.x);
  if (vK.x < .5) { float v = abs(vUv.y * 2. - 1.); col = mix(vec3(.88, .87, .84), uRose * .7, smoothstep(.80, .84, v) * (1. - smoothstep(.93, .95, v))); col = mix(col, uViolet * .3, 1. - smoothstep(0., .2, v)); }
  else if (vK.x < 1.5) col = mix(uPearl, uGold, .45) * .6;
  else if (vK.x < 2.5) col = mix(uViolet, uGold, .5) * .34;
  else col = mix(uSail, vec3(.70, .50, .30), .6) * (1. - .4 * (1. - smoothstep(0., .035, abs(fract(vUv.y * 5. + .5) - .5))));      // a tan lugsail
  vec3 toSun = normalize(-vP + vec3(0., 0., 1e-3));
  float ndl = mix(clamp(dot(n, toSun) * .6 + .5, 0., 1.), 1., cloth * .7);                    // the cloth lets the light through
  vec3 c = col * (shellLight(vP, n, 3., 1., 1.) * 1.15 + keyColor(1.) * sunVis(vP, 3.) * ndl * .75);
  c = hazed(c, vP) * uExpo;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`;function ye(){const e=[],u=[],n=[],a=[],o=[],g=(v,s,c,R)=>{const[r,m,V]=v,H=[m[0]-r[0],m[1]-r[1],m[2]-r[2]],U=[V[0]-r[0],V[1]-r[1],V[2]-r[2]],T=[H[1]*U[2]-H[2]*U[1],H[2]*U[0]-H[0]*U[2],H[0]*U[1]-H[1]*U[0]],B=1/(Math.hypot(T[0],T[1],T[2])||1),K=e.length/3;v.forEach((N,L)=>{e.push(N[0],N[1],N[2]),u.push(T[0]*B,T[1]*B,T[2]*B),n.push(s[L][0],s[L][1]),a.push(c,R)});for(let N=2;N<v.length;N++)o.push(K,K+N-1,K+N)},t=3.0999999999999996,y=4.9,z=Math.hypot(2.9,y-t),w=4.2,p=(v,s,c,R,r)=>g([[v,0,s],[c,0,R],[c,3.3,R],[v,3.3,s]],[[0,0],[w,0],[w,3.3],[0,3.3]],0,r);p(-2.5,2.5,2.5,2.5,1),p(2.5,2.5,2.5,-2.5,0),p(2.5,-2.5,-2.5,-2.5,0),p(-2.5,-2.5,-2.5,2.5,0);const h=[[-2.9,2.9],[2.9,2.9],[2.9,-2.9],[-2.9,-2.9]];for(let v=0;v<4;v++){const s=h[v],c=h[(v+1)%4];g([[s[0],t,s[1]],[c[0],t,c[1]],[0,y,0]],[[0,0],[2*2.9,0],[2.9,z]],1,0)}const i=new l.BufferGeometry;return i.setAttribute("position",new l.Float32BufferAttribute(e,3)),i.setAttribute("normal",new l.Float32BufferAttribute(u,3)),i.setAttribute("uv",new l.Float32BufferAttribute(n,2)),i.setAttribute("aK",new l.Float32BufferAttribute(a,2)),i.setIndex(o),i}const be=`
attribute vec3 iPos; attribute vec4 iRot; attribute vec2 aK; uniform mat3 uHbM;
varying vec2 vUv; varying vec3 vP; varying vec3 vN; varying vec3 vK;
#include <fog_pars_vertex>
void main(){
  float cy = cos(iRot.x), sy = sin(iRot.x);
  vec3 sd = uHbM * vec3(cy, 0., -sy), fw = uHbM * vec3(sy, 0., cy), hu = uHbM[1], l = position; vec2 q = uv;
  float xs = .84 + .5 * fract(iRot.z * 7.31);                         // long or short
  if (abs(normal.x) < .6) q.x *= xs;
  l.x *= xs;
  float up2 = step(.7, fract(iRot.z * 3.17)) * 2.7 * step(2.99, l.y);
  l.y += up2; if (aK.x < .5) q.y += up2;
  vec3 p = iPos + (sd * l.x + hu * l.y + fw * l.z) * iRot.y;
  vP = p; vN = sd * normal.x + hu * normal.y + fw * normal.z; vUv = q; vK = vec3(aK.x, iRot.z, aK.y);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Me=`
attribute vec4 aQ; uniform float uTime; uniform mat3 uHbM;
varying vec2 vUv; varying vec3 vP; varying vec3 vN; varying vec3 vK;
#include <fog_pars_vertex>
void main(){
  vec3 p = position;
  p += uHbM * vec3(aQ.z, 0., aQ.w) * (.4 + .6 * sin(uTime * 1.9 + position.x * .31 + position.z * .23 + aQ.y * 20.) + .25 * sin(uTime * 3.1 + aQ.y * 50.));
  vP = p; vN = normal; vUv = uv; vK = vec3(aQ.x, aQ.y, 0.);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ze=`
varying vec3 vK;
void main(){
  vec3 n = normalize(vN + vec3(0., 1e-4, 0.)), V = normalize(uCam - vP + vec3(1e-3, 0., 0.)), col;
  if (dot(n, V) < 0.) n = -n;
  float cloth = step(3.5, vK.x) * step(vK.x, 4.5);
  if (vK.x < .5) { vec2 b = vUv * vec2(1.6, 3.2); b.x += .5 * floor(b.y); vec2 f = abs(fract(b) - .5);
    col = mix(vec3(.84, .78, .68), vec3(.62, .58, .58), texture2D(uNoise, floor(b) / 64. + .47).r) * (1. - .4 * smoothstep(.36, .47, max(f.x, f.y))); }
  else if (vK.x < 1.5) col = vec3(.86, .84, .80);
  else if (vK.x < 2.5) col = mix(uViolet, uGold, .4) * .42;
  else if (vK.x < 3.5) col = uPearl * .8;
  else if (vK.x < 4.5) { float h = fract(vK.y * 7.3);
    col = h < .42 ? vec3(.9, .89, .86) : h < .64 ? mix(uRose, vec3(.85, .45, .5), .4) : h < .82 ? uSea * .9 : mix(uGold, vec3(.85, .65, .2), .5) * .9;
    col *= .9 + .1 * sin(vUv.x * 30.); }
  else if (vK.x < 5.5) col = mix(uViolet, vec3(.36, .26, .18), .6) * (.7 + .3 * step(.5, fract(dot(vP - uHb.xyz, uHbM[1]) * 1.4)));      // a ringed trunk
  else if (vK.x < 6.5) { float rib = abs(vUv.x - .5) * 2., pv = vUv.y * 13. - rib * 1.5, pf = fract(pv);           // a frond: a pale midrib and pinnae either side with air between them, paler toward the tip
    float near = 1. - smoothstep(.25, .6, fwidth(pv));                                                       // (from far off the frond closes up into one blade)
    if (rib > .13 && pf < .36 * near) discard;
    col = mix(mix(uForest, uGold, .22) * vec3(.62, .95, .52), mix(uGold, uForest, .4) * vec3(.9, 1.1, .6), vUv.y * .7) * (.62 + .38 * smoothstep(.36, .6, pf)) * (.75 + .25 * rib);
    col = mix(col, mix(uGold, vec3(.8, .9, .5), .5) * .8, 1. - smoothstep(.0, .12, rib)); }
  else { vec2 fq = vUv - .5; float fr = dot(fq, fq) * 4.;                                                      // fiddleheads: pale curls at the heart of the crown
    if (fr > 1.) discard;
    col = mix(mix(uGold, vec3(.8, .9, .5), .5), mix(uForest, uGold, .3) * vec3(.7, 1., .55), smoothstep(.3, .5, fract(fr * 2.5 + atan(fq.y, fq.x + 1e-4) * .955))) * .9; }
  vec3 c = col * (shellLight(vP, n, 3., 1., 1.) + keyColor(3.) * sunVis(vP, 3.) * .35 * cloth);      // cloth lets the light through
  c = hazed(c, vP) * uExpo;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`;pt.push(async e=>{const{ctx:u,V:n,H:a}=e,o=kt(e.rng,"harbour"),g=a.c,f=e.harbour=[],F=new l.Vector3,A=(b,G,I)=>a.world(b,G,I,F);e.sh.uHb.value.set(g.x,g.y,g.z,a.towerAng),e.sh.uTw.value.set(a.tl[0],a.towerH,a.tl[1],0),e.sh.uHbM.value.set(a.X.x,a.Y.x,a.Z.x,a.X.y,a.Y.y,a.Z.y,a.X.z,a.Y.z,a.Z.z),await u.yield();const t=await ve(a,u);await u.yield();const y=(b,G,I)=>(b.frustumCulled=!1,b.name=G,I!==void 0&&(b.renderOrder=I),e.scene.add(b),f.push(b),b);y(new l.Mesh(t,ct(e,fe,de,{uPx:e.uPx},{side:l.DoubleSide})),"harbour");const z=new l.CircleGeometry(wt.R[0]+.6,72).rotateX(-Math.PI/2).applyMatrix4(new l.Matrix4().makeBasis(a.X,a.Y,a.Z).setPosition(g));y(new l.Mesh(z,ct(e,Tt,pe)),"lagoon"),await u.yield();const w=b=>Rt(b,a.towerAng),p=D(a.tl[0],0,a.tl[1]),h=[],i=[],v=[],s=[],c=Math.round(640*Math.max(.7,n.detail));for(const[b,G,I]of[[0,157.6,.5],[1,172.4,.9],[2,189.4,.9],[2,181.4,.45],[3,206,.9],[3,198.6,.5]]){let d=o()*.02;for(;d<st;){const M=o.range(.86,1.14),x=o(),C=5*M*(.84+.5*(x*7.31%1))+o.range(.6,2.8),_=d+C/G/2,q=o(),S=o.range(-.2,.2),J=o.range(-.9,.5);d+=C/G;const ot=(G+J)*Math.cos(_),j=(G+J)*Math.sin(_);if(Pt(_,b)>.02||q>I||Math.hypot(ot-p.x,j-p.z)<17||h.length/3>=c)continue;const ht=w(_)*wt.LV[b],xt=Math.atan2(-Math.cos(_),-Math.sin(_))+S;A(ot,ht,j),h.push(F.x,F.y,F.z),i.push(xt,M,x,0),A(ot,ht+1.9*M,j),v.push(F.x,F.y,F.z),s.push(1.5,0,x,xt)}await u.yield()}y(new l.Mesh(Mt(ye(),h,i),ct(e,be,_t,{uHCh:{value:3}},{side:l.DoubleSide})),"harbourHouses"),await u.yield();const R=[],r=[],m=[],V=[],H=[],U=(b,G,I,d)=>{const[M,x,C]=b,_=[x[0]-M[0],x[1]-M[1],x[2]-M[2]],q=[C[0]-M[0],C[1]-M[1],C[2]-M[2]],S=[_[1]*q[2]-_[2]*q[1],_[2]*q[0]-_[0]*q[2],_[0]*q[1]-_[1]*q[0]],J=1/(Math.hypot(S[0],S[1],S[2])||1),ot=R.length/3;b.forEach((j,ht)=>{R.push(j[0],j[1],j[2]),r.push(S[0]*J,S[1]*J,S[2]*J),m.push(j[3]||0,j[4]||0),V.push(G,I,d?d[ht][0]:0,d?d[ht][1]:0)});for(let j=2;j<b.length;j++)H.push(ot,ot+j-1,ot+j)},T=(b,G,I,d,M,x)=>{const C=[[-I,-I],[I,-I],[I,I],[-I,I]];for(let _=0;_<4;_++){const q=C[_],S=C[(_+1)%4];U([[b+q[0],d,G+q[1]],[b+S[0],d,G+S[1]],[b+S[0],M,G+S[1]],[b+q[0],M,G+q[1]]],x,0)}},B=(b,G,I)=>{const x=(C,_)=>[b+_*1.6*Math.cos(C/12*st),I+_*1.6*Math.sin(C/12*st)];for(let C=0;C<12;C++){const _=x(C,1.25),q=x(C+1,1.25),S=C*.785*1.6,J=S+.785*1.6;U([[q[0],G,q[1],J,0],[_[0],G,_[1],S,0],[_[0],G+.9*1.6,_[1],S,.9*1.6],[q[0],G+.9*1.6,q[1],J,.9*1.6]],0,0);for(let ot=0;ot<3;ot++){const j=ot/3*Math.PI/2,ht=(ot+1)/3*Math.PI/2,xt=1.5*Math.cos(j),ft=1.5*Math.cos(ht),mt=G+1.6*(2.3+1.2*Math.sin(j)),yt=G+1.6*(2.3+1.2*Math.sin(ht)),ut=x(C,xt),dt=x(C+1,xt),gt=x(C,ft),zt=x(C+1,ft);U(ot<2?[[dt[0],mt,dt[1]],[ut[0],mt,ut[1]],[gt[0],yt,gt[1]],[zt[0],yt,zt[1]]]:[[dt[0],mt,dt[1]],[ut[0],mt,ut[1]],[gt[0],yt,gt[1]]],1,0)}}for(let C=0;C<6;C++)T(b+1.12*1.6*Math.cos(C*st/6+.6),I+1.12*1.6*Math.sin(C*st/6+.6),.16,G+.9*1.6,G+2.32*1.6,2)},K=(b,G,I,d,M,x)=>{T(b-d*x/2,I-M*x/2,.11,G,G+3.4+.1,2),T(b+d*x/2,I+M*x/2,.11,G,G+3.4+.1,2);const _=(S,J)=>[b+d*S,G+J,I+M*S];U([_(-x/2,3.4-.05),_(x/2,3.4-.05),_(x/2,3.4+.04),_(-x/2,3.4+.04)],3,0);let q=-x/2+o.range(.3,.7);for(;q<x/2-2;){const S=o.range(1.2,2.6),J=o.range(1.3,2.6),ot=o(),j=[-M*.3*J,d*.3*J];U([[..._(q,3.4-J),0,0],[..._(q+S,3.4-J),S,0],[..._(q+S,3.4),S,J],[..._(q,3.4),0,J]],4,ot,[j,j,[0,0],[0,0]]),q+=S+o.range(.1,.6)}},N=(b,G,I,d,M,x)=>{T(b,I,.34,G,G+d,5);const C=x*st;for(let S=0;S<9;S++){const J=C+S*st/9+.3*Math.sin(S*2.4+x*9),ot=Math.cos(J),j=Math.sin(J),ht=-j,xt=ot,ft=M*(.82+.18*Math.sin(S*1.7+x*20)),mt=[[.15,.1,.1,0],[ft*.38,ft*.24,.3,.34],[ft*.72,ft*.22,.26,.7],[ft,-ft*.1,.05,1]],yt=(ut,dt)=>[b+ot*ut[0]+ht*dt*ut[2]*ft,G+d+ut[1],I+j*ut[0]+xt*dt*ut[2]*ft,dt>0?1:0,ut[3]];for(let ut=0;ut<3;ut++){const dt=mt[ut],gt=mt[ut+1],zt=[ot*.3*dt[3],j*.3*dt[3]],Ct=[ot*.3*gt[3],j*.3*gt[3]];U([yt(dt,-1),yt(dt,1),yt(gt,1),yt(gt,-1)],6,x,[zt,zt,Ct,Ct])}}const _=.55,q=G+d+.55;U([[b-_,q,I-_,0,0],[b+_,q,I-_,1,0],[b+_,q,I+_,1,1],[b-_,q,I+_,0,1]],7,x)};for(let b=0;b<4;b++){const G=wt.R[b],I=G+(b?5:2.9);if(b<2)for(let M=0,x=0;M<80&&x<5;M++){const C=o()*st;Pt(C,b)>.02||Math.hypot(I*Math.cos(C)-p.x,I*Math.sin(C)-p.z)<20||(B(I*Math.cos(C),w(C)*wt.LV[b],I*Math.sin(C)),x++)}const d=G+(b>=2?1.7:b?4.2:2.6);for(let M=o()*.05;M<st;M+=o.range(16,34)/d){const x=o.range(8,14);Pt(M,b)>.02||Pt(M+x/d,b)>.02||Math.hypot(d*Math.cos(M)-p.x,d*Math.sin(M)-p.z)<20||K(d*Math.cos(M),w(M)*wt.LV[b],d*Math.sin(M),-Math.sin(M),Math.cos(M),x)}if(await u.yield(),b>0)for(let M=o()*.05;M<st;M+=o.range(11,30)/G){const x=Pt(M,b)>.5,C=G+(x?o.range(2.6,.5*(wt.R[b+1]-G)):1.6),_=o.range(9,13.5),q=o.range(4.2,5.8),S=o();Math.hypot(C*Math.cos(M)-p.x,C*Math.sin(M)-p.z)<20||!x&&S<.45||N(C*Math.cos(M),w(M)*wt.LV[b],C*Math.sin(M),_,q,S)}await u.yield()}for(let b=0;b<R.length;b+=3)A(R[b],R[b+1],R[b+2]),R[b]=F.x,R[b+1]=F.y,R[b+2]=F.z,F.set(0,0,0).addScaledVector(a.X,r[b]).addScaledVector(a.Y,r[b+1]).addScaledVector(a.Z,r[b+2]),r[b]=F.x,r[b+1]=F.y,r[b+2]=F.z,b%6e4===59997&&await u.yield();const L=new l.BufferGeometry;L.setAttribute("position",new l.Float32BufferAttribute(R,3)),L.setAttribute("normal",new l.Float32BufferAttribute(r,3)),L.setAttribute("uv",new l.Float32BufferAttribute(m,2)),L.setAttribute("aQ",new l.Float32BufferAttribute(V,4)),L.setIndex(H),y(new l.Mesh(L,ct(e,Me,ze,{},{side:l.DoubleSide})),"harbourProps"),await u.yield(),A(a.tl[0],a.headH+7,a.tl[1]-9.2),v.push(F.x,F.y,F.z),s.push(1.8,0,.5,Math.PI);const at=new l.PlaneGeometry(1,1).translate(.5,.5,0),O=new l.InstancedBufferGeometry;O.index=at.index,O.setAttribute("position",at.attributes.position),O.setAttribute("uv",at.attributes.uv),O.setAttribute("iP",new l.InstancedBufferAttribute(new Float32Array(v),3)),O.setAttribute("iS",new l.InstancedBufferAttribute(new Float32Array(s),4)),O.instanceCount=v.length/3,y(new l.Mesh(O,new l.ShaderMaterial({uniforms:{uTime:e.sh.uTime,uPx:e.uPx,uExpo:e.sh.uExpo,uCam:e.sh.uCam,uHbM:e.sh.uHbM},vertexShader:me,fragmentShader:we,transparent:!0,depthWrite:!1,side:l.DoubleSide,fog:!1})),"glints",8),await u.yield();const X=[],Y=[],W=[],tt=(b,G,I,d,M,x)=>{A(b,0,G),X.push(F.x,F.y,F.z),Y.push(x,0,o(),0),W.push(I,d,M,0)},it=[],et=30,Z=new l.Vector3,P=new l.Vector3;for(let b=e.U.door3*e.path.length;b<=e.path.length;b+=2)a.local(e.path.posAtDist(b,Z),P),Math.hypot(P.x,P.z)<wt.R[0]+et&&it.push(P.x,P.z);const k=(b,G,I)=>{for(let d=0;d<it.length;d+=2)if(Math.abs(Math.hypot(it[d]-b,it[d+1]-G)-I)<et)return!0;return!1},E=(b,G,I,d,M,x)=>k(b,G,I)?!1:(tt(b,G,I,d,M,x),!0);for(const b of a.piers){const G=wt.R[0]-b.len*o.range(.35,.8),I=o.chance(.5)?1:-1,d=o.range(1,1.1);E(G*Math.cos(b.th)-I*9*Math.sin(b.th),G*Math.sin(b.th)+I*9*Math.cos(b.th),0,0,b.th+(I>0?0:Math.PI),d)}const Q=[];for(let b=0;Q.length<14&&b<400;b++){const G=o()*st,I=80*Math.sqrt(o()),d=o.range(10,30),M=I*Math.cos(G),x=I*Math.sin(G);I+d>88||Q.some(C=>Math.hypot(C[0]-M,C[1]-x)<C[2]+d+5)||E(M,x,d,o.range(2.6,4.2)*(o.chance(.5)?1:-1),o()*st,o.range(1,1.12))&&Q.push([M,x,d])}{const b=O.getAttribute("iS");b.setZ(O.instanceCount-1,o()),b.needsUpdate=!0}e.subjects.harbourBoats=X.length/3,await u.yield();const $=Ht(),rt=new l.InstancedBufferGeometry;rt.index=$.index;for(const b in $.attributes)rt.setAttribute(b,$.attributes[b]);rt.setAttribute("iP",new l.InstancedBufferAttribute(new Float32Array(X),3)),rt.setAttribute("iS",new l.InstancedBufferAttribute(new Float32Array(Y),4)),rt.setAttribute("iM",new l.InstancedBufferAttribute(new Float32Array(W),4)),rt.instanceCount=X.length/3,y(new l.Mesh(rt,ct(e,xe,ge,{uSail:{value:new l.Color(n.sail)}},{side:l.DoubleSide})),"harbourBoats")});const Pe=`
${At}
attribute vec4 iD; attribute vec2 iE; uniform float uTime; uniform vec3 uCam;
varying vec2 vUv; varying vec3 vP; varying vec3 vN; varying vec4 vC;
#include <fog_pars_vertex>
void main(){
  vec3 c = iD.xyz + vec3(0., 0., 1.) * 46. * sin(uTime * .021 + iE.x * 6.2831853);      // the deck creeps along the wall
  vec3 p = c + (camRight() * (uv.x - .5) + camUp() * (uv.y - .5)) * iD.w * 2.;
  float dc = length(uCam - c);
  vP = p; vN = vec3(0., 0., 1.); vUv = uv; vC = vec4(3., smoothstep(iD.w * 1.2, iD.w * 3., dc), iE.y, -1.);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;pt.push(async e=>{const{V:u}=e,n=kt(e.rng,"cloud-deck"),a=Math.round(110*Math.max(.6,u.detail)),o=new Float32Array(a*4),g=new Float32Array(a*2),f=y=>y<2900?nt(1e3,1450,Math.sin(vt((y-2100)/800,0,1)*Math.PI/2)):620+830*Math.pow(Math.cos(Math.asin(vt((y-2900)/810,0,1))),.85);for(let y=0;y<a;y++){const z=n(),w=n(),p=nt(-.12,.66,z),h=nt(2560,3440,w),i=Math.max(Math.abs(z*2-1),Math.abs(w*2-1)),v=n.range(110,230)*(1-.45*i*i),s=f(h)-25-v*n.range(.25,.8);o[y*4]=s*Math.cos(p),o[y*4+1]=s*Math.sin(p),o[y*4+2]=h,o[y*4+3]=v,g[y*2]=n(),g[y*2+1]=n()}await e.ctx.yield();const F=new l.InstancedBufferGeometry,A=new l.PlaneGeometry(1,1).translate(.5,.5,0);F.index=A.index,F.setAttribute("position",A.attributes.position),F.setAttribute("uv",A.attributes.uv),F.setAttribute("iD",new l.InstancedBufferAttribute(o,4)),F.setAttribute("iE",new l.InstancedBufferAttribute(g,2)),F.instanceCount=a;const t=new l.Mesh(F,ct(e,Pe,Bt,{uOpacity:{value:.43}},{transparent:!0,depthWrite:!1}));t.frustumCulled=!1,t.renderOrder=5,t.name="cloudDeck",e.scene.add(t)});export{Ve as default};
