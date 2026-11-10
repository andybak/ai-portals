import*as M from"three";const vt=t=>{const e=new M.Color(t);return[e.r,e.g,e.b]},st=["#d2bca2","#ad9880","#77634f","#eaddc8"].map(vt),rt=(t,e,a)=>[t[0]+(e[0]-t[0])*a,t[1]+(e[1]-t[1])*a,t[2]+(e[2]-t[2])*a],Mt=(t,e,a)=>.5*(a+(1-a)*Math.pow(Math.max(0,1-t),e));function gt(t,e={}){const a=e.rings??10,s=e.sides??7,r=Math.PI*2,g=t.range(0,r),v=t.range(.15,1),i=t.range(0,r),x=t.range(.2,1),T=e.leanDir??g,h=e.leanExact??(e.lean??.9)*v,u=e.bendDir??i,w=e.bendExact??(e.bend??.32)*x,b=[t.range(1.5,3.5),t.range(0,r),t.range(4,8),t.range(0,r)],q=t.range(.75,1.15),p=t.range(.08,.16),R=e.knob??.2,A=e.pw??q,N=e.tipR??p,P=t.range(2.5,6),Z=t.range(0,r),O=t.range(.07,.17),V=e.ledge??O,Q=t.range(-1.2,1.2),f=t.range(3,7),I=t.range(0,r),l=t.range(.96,1.06),k=t.range(0,r),F=t.range(.07,.16),j=e.end==="slant"?e.slant??F:0,E=[];for(let S=0;S<(e.lumps??9);S++)E.push([t.range(0,r),t.range(.03,.95),t.range(.45,1.1),t.range(.04,.13),t.range(-.26,.42)]);const c=[],y=[],D=[],$=new Array(s).fill(1/0),Y=(S,z)=>{const o=S*f*r+I+z*1.1,n=.5+.5*Math.sin(o),d=Math.pow(Math.max(0,Math.sin(o*2.3+1.7)),6);let m=rt(st[1],st[0],n);return m=rt(m,st[2],Math.min(.85,.25*z+.6*d)),m=rt(m,st[3],Math.min(1,Math.max(0,(S-.66)*2.6))*(.1+.1*n)),[m[0]*l,m[1]*l,m[2]*l]};for(let S=0;S<=a;S++){const z=S/a,o=-.05+1.05*Math.pow(z,1.15),n=Math.max(0,o),d=Math.max(n,e.even??0);let m=Mt(d,A,N);m*=1+.5*R*(.6*Math.sin(b[0]*d*r+b[1])+.4*Math.sin(b[2]*d*r+b[3]))*(1-.5*d),m*=1+V*Math.tanh(3*Math.sin(d*r*P+Z)),o<0&&!e.even&&(m*=1.15);const G=h*n*Math.cos(T)+w*Math.sin(n*Math.PI)*Math.cos(u),_=h*n*Math.sin(T)+w*Math.sin(n*Math.PI)*Math.sin(u);for(let C=0;C<s;C++){const K=C/s*r+Q*n;let tt=1+t.range(-.03,.03);for(const lt of E){let ct=Math.abs(K-lt[0])%r;ct>Math.PI&&(ct=r-ct),tt+=lt[4]*Math.exp(-((ct/lt[2])**2)-((n-lt[1])/lt[3])**2)}const J=t.range(-.18,.18)/a,at=Math.min(m*Math.max(.55,tt),$[C]),it=o+(S>0&&S<a?J:0)+j*Math.cos(K-k)*n*n*n*(1+t.range(-.25,.25));$[C]=at,c.push(G+Math.cos(K)*at,it,_+Math.sin(K)*at);const nt=Y(n,t.range(0,1)**2),mt=t.range(.9,1.06)*(.8+.25*Math.min(1,tt));y.push(nt[0]*mt,nt[1]*mt,nt[2]*mt)}}const L=h*Math.cos(T),W=h*Math.sin(T);for(let S=0;S<a;S++)for(let z=0;z<s;z++){const o=S*s+z,n=S*s+(z+1)%s,d=o+s,m=n+s;(S+z)%2?D.push(o,d,n,n,d,m):D.push(o,d,m,o,m,n)}if(j){const S=c.length/3;let z=0,o=0,n=0;for(let d=0;d<s;d++){const m=(a*s+d)*3;c.push(c[m],c[m+1],c[m+2]);const G=Y(1,t());y.push(G[0],G[1],G[2]),z+=c[m]/s,o+=c[m+1]/s,n+=c[m+2]/s}c.push(z,o+.012*t.range(.5,2.5),n);{const d=Y(1,t());y.push(d[0],d[1],d[2])}for(let d=0;d<s;d++)D.push(S+d,S+s,S+(d+1)%s)}else{const S=c.length/3;c.push(L,1+.35/a,W);{const z=Y(1,0);y.push(z[0],z[1],z[2])}for(let z=0;z<s;z++)D.push(a*s+z,S,a*s+(z+1)%s)}const U=new M.BufferGeometry;return U.setAttribute("position",new M.BufferAttribute(new Float32Array(c),3)),U.setAttribute("color",new M.BufferAttribute(new Float32Array(y),3)),U.setIndex(D),U.computeVertexNormals(),U.userData={tipX:L,tipZ:W,pw:A,tipR:N,reach:Math.max(h,w)+.9},U}function wt(t,e={}){const a=e.count??5,s=[],r=[],g=[],v=Math.PI*2,i=6,x=e.small??1,T=e.strew||null;for(let u=0;u<a;u++){const w=t.range(0,v),b=t.range(.5,e.reach??1.15),q=t.range(0,1),p=(.16*x+(.36-.16*x)*Math.pow(q,x<1?2.2:1))*(1.25-Math.min(b,1.3)*.5);let R=Math.cos(w)*b,A=Math.sin(w)*b;if(T){const k=R*T[0]+A*T[1];R+=T[0]*k*(T[2]-1),A+=T[1]*k*(T[2]-1)}const N=t.range(0,v),P=t.range(.8,1.3),Z=t.range(.8,1.3),O=t.range(.6,1),V=t.range(.82,1.1),Q=rt(st[1],st[t.chance(.5)?0:2],t.range(.1,.7)),f=s.length/3,I=Math.cos(N),l=Math.sin(N);for(const[k,F]of[[1,-.12],[.78,.5]])for(let j=0;j<i;j++){const E=j/i*v+t.range(-.2,.2),c=p*k*t.range(.82,1.15),y=Math.cos(E)*c*P,D=Math.sin(E)*c*Z;s.push(R+y*I-D*l,p*O*(F+t.range(-.06,.06)),A+y*l+D*I);const $=V*t.range(.9,1.08)*(F<0?.8:1);r.push(Q[0]*$,Q[1]*$,Q[2]*$)}s.push(R+t.range(-.15,.15)*p,p*O*t.range(.85,1),A+t.range(-.15,.15)*p),r.push(Q[0]*V*1.08,Q[1]*V*1.08,Q[2]*V*1.08);for(let k=0;k<i;k++){const F=(k+1)%i;g.push(f+k,f+i+k,f+F,f+F,f+i+k,f+i+F,f+i+k,f+2*i,f+i+F)}}const h=new M.BufferGeometry;return h.setAttribute("position",new M.BufferAttribute(new Float32Array(s),3)),h.setAttribute("color",new M.BufferAttribute(new Float32Array(r),3)),h.setIndex(g),h.computeVertexNormals(),h}function Nt(t,e=20){const a=(1+Math.sqrt(5))/2,s=e===20?[[-1,a,0],[1,a,0],[-1,-a,0],[1,-a,0],[0,-1,a],[0,1,a],[0,-1,-a],[0,1,-a],[a,0,-1],[a,0,1],[-a,0,-1],[-a,0,1]]:[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],r=e===20?[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]]:[[0,2,4],[2,1,4],[1,3,4],[3,0,4],[2,0,5],[1,2,5],[3,1,5],[0,3,5]],g=[t.range(.75,1.2),t.range(.55,1),t.range(.75,1.2)],v=e===20?.72:.5,i=e===20?.12:.45,x=s.map(q=>{const p=t.range(v,1.12)/Math.hypot(q[0],q[1],q[2]);return[(q[0]*p+t.range(-i,i))*g[0],(q[1]*p+t.range(-i,i))*g[1],(q[2]*p+t.range(-i,i))*g[2]]}),T=rt(st[1],st[t.chance(.5)?0:3],t.range(.2,.8)),h=[],u=[],w=[];for(const q of r){const p=x[q[0]],R=x[q[1]],A=x[q[2]],N=R[0]-p[0],P=R[1]-p[1],Z=R[2]-p[2],O=A[0]-p[0],V=A[1]-p[1],Q=A[2]-p[2];let f=P*Q-Z*V,I=Z*O-N*Q,l=N*V-P*O;const k=Math.hypot(f,I,l)||1;f/=k,I/=k,l/=k;const F=t.range(.84,1.1);for(const j of[p,R,A])h.push(j[0],j[1],j[2]),w.push(f,I,l),u.push(T[0]*F,T[1]*F,T[2]*F)}const b=new M.BufferGeometry;return b.setAttribute("position",new M.BufferAttribute(new Float32Array(h),3)),b.setAttribute("normal",new M.BufferAttribute(new Float32Array(w),3)),b.setAttribute("color",new M.BufferAttribute(new Float32Array(u),3)),b}function xt(t,e,a,s,r,g){const v=new M.Matrix4().makeRotationY(s);v.scale(new M.Vector3(e,a,e)),v.setPosition(r,0,g),t.applyMatrix4(v),t.computeVertexNormals();const i=Math.cos(s),x=Math.sin(s),T=t.userData.tipX*e,h=t.userData.tipZ*e;return{x:r,z:g,w:e,h:a,tipX:T*i+h*x,tipZ:-T*x+h*i,pw:t.userData.pw,tipR:t.userData.tipR}}function Tt(t,e=[]){const a=t.map(h=>{if(!h.index)return h;const u=h.toNonIndexed();return h.dispose(),u});let s=0;for(const h of a)s+=h.attributes.position.count;const r=new Float32Array(s*3),g=new Float32Array(s*3),v=new Float32Array(s*3),i=e.map(h=>new Float32Array(s*h[1]));let x=0;for(const h of a)r.set(h.attributes.position.array,x),g.set(h.attributes.color.array,x),v.set(h.attributes.normal.array,x),e.forEach((u,w)=>i[w].set(h.attributes[u[0]].array,x/3*u[1])),x+=h.attributes.position.count*3,h.dispose();const T=new M.BufferGeometry;return T.setAttribute("position",new M.BufferAttribute(r,3)),T.setAttribute("color",new M.BufferAttribute(g,3)),T.setAttribute("normal",new M.BufferAttribute(v,3)),e.forEach((h,u)=>T.setAttribute(h[0],new M.BufferAttribute(i[u],h[1]))),T}function At(t){const e=t.attributes.position,a=[];for(let s=0;s+13<=e.count;s+=13){let r=0,g=0,v=0,i=0;for(let x=s;x<s+13;x++)r+=e.getX(x)/13,g+=e.getY(x)/13,v+=e.getZ(x)/13;for(let x=s;x<s+13;x++)i=Math.max(i,Math.hypot(e.getX(x)-r,e.getZ(x)-v));a.push({v0:s,cx:r,cy:g,cz:v,rad:i})}return a}function Pt(t,e){const a=t.index.array,s=[];return At(t).forEach((r,g)=>{if(e(r))for(let v=g*54;v<g*54+54;v++)s.push(a[v])}),t.setIndex(s),t}function kt(t,e){const a=[],s=[],r=Math.PI*2;let g=null;const v=t.range(.7,.9),i=t.range(0,r),x=e.broken?{rings:26,sides:18,lean:.25,bend:.15,knob:.2,pw:.3,tipR:.62,lumps:30,ledge:.1,end:"slant",slant:.02}:{rings:44,sides:18,lean:.7,bend:.45,knob:.24,pw:v,lumps:44};if(e.leanTo){const u=e.bow||[0,0];Object.assign(x,{leanDir:Math.atan2(e.leanTo[1],e.leanTo[0]),leanExact:Math.hypot(e.leanTo[0],e.leanTo[1])/e.w,bendDir:Math.atan2(u[1],u[0]),bendExact:Math.hypot(u[0],u[1])/e.w,knob:.14,pw:.62,tipR:.12,lumps:30,even:.3})}const T=gt(t,x);s.push(xt(T,e.w,e.h,e.leanTo?0:i,e.x,e.z)),a.push(T);const h=t.range(0,r);for(let u=0;u<(e.fused??0);u++){const w=h+u*t.range(1.6,2.6),b=e.w*t.range(.42,.62),q=e.w*t.range(.34,.55),p=e.h*t.range(.22,.5),R=gt(t,{rings:22,sides:12,lean:.8,bend:.5,lumps:18});s.push(xt(R,q,p,t.range(0,r),e.x+Math.cos(w)*b,e.z+Math.sin(w)*b)),a.push(R)}if(e.leanTo){const u=e.w*.6,w=Math.hypot(e.leanTo[0],e.leanTo[1])||1,b=wt(t,{count:34,reach:1.5,small:.3,strew:[e.leanTo[0]/w,e.leanTo[1]/w,2]});b.applyMatrix4(new M.Matrix4().makeScale(u,u,u).setPosition(e.x,0,e.z)),b.computeVertexNormals(),g=b}else{const u=e.w*.6,w=wt(t,{count:9,reach:1.3});w.applyMatrix4(new M.Matrix4().makeScale(u,u,u).setPosition(e.x,0,e.z)),w.computeVertexNormals(),g=w}return{parts:a,casters:s,rubble:g}}async function It(t,e={}){const a=e.rng||t.core.makeRng(t.core.hashSeed("tse-hero:"+t.seed)),s=e.height??400,r=e.width??40,g=kt(a,{x:0,z:0,h:s,w:r,fused:e.fused??0});await t.yield?.();const v=Tt(g.parts),i=g.casters,x=!e.material,T=e.material||new M.MeshLambertMaterial({vertexColors:!0}),h=new M.Mesh(v,T);h.name="tse-hero";const u=new M.Group;if(u.add(h),x){u.add(new M.HemisphereLight("#bcd8f0","#b08a70",1.6));const w=new M.DirectionalLight("#fff0dc",2.6);w.position.set(30,40,20),u.add(w)}return{object:u,rubble:g.rubble,radius:r*1.2,height:s,center:new M.Vector3(0,s*.45,0),anchors:{foot:new M.Vector3(0,0,0),top:new M.Vector3(i[0].tipX,s,i[0].tipZ)},needles:i,ground:!0,groundY:0,update(){},dispose(){v.dispose()}}}const bt={half:345,height:330,top:37.5,course:8.25,tier:16.5,step:15,block:15,tiers:18,stairHalf:30,stairOut:26,wall:7.5,stone:7.5,bed:4.125};function $t(t){const{half:e,course:a,tier:s,step:r,block:g,tiers:v,stairHalf:i,stairOut:x,wall:T}=bt,h=5,u=4,w=1,b=vt("#cfae98"),q=()=>{const o=t.range(.9,1.06),n=rt(b,st[1],t.range(.1,.45));return[n[0]*o,n[1]*o,n[2]*o]},p=(o,n,d,m,G,_,C,K,tt,J)=>{const at=K?[C,K,tt,C,tt,J]:[C,C,C,C,C,C];[n,d,m,n,m,G].forEach((it,nt)=>{o.pos.push(it[0],it[1],it[2]),o.col.push(at[nt][0],at[nt][1],at[nt][2]),o.nor.push(_[0],_[1],_[2]),o.kind.push(o.k||0)})},R=(o,n,d,m,G,_,C,K,tt=!0)=>{p(o,[n,G,C],[d,G,C],[d,G,_],[n,G,_],[0,1,0],K.map(J=>J*1.06)),p(o,[n,m,C],[d,m,C],[d,G,C],[n,G,C],[0,0,1],K),tt&&p(o,[d,m,_],[n,m,_],[n,G,_],[d,G,_],[0,0,-1],K),p(o,[d,m,C],[d,m,_],[d,G,_],[d,G,C],[1,0,0],K.map(J=>J*.97)),p(o,[n,m,_],[n,m,C],[n,G,C],[n,G,_],[-1,0,0],K.map(J=>J*.97))},A=()=>({pos:[],col:[],nor:[],kind:[],k:0}),N=A();for(let o=0;o<v-w;o++){const n=e-r*o;R(N,-n,n,s*o,s*(o+1),-n,n,q())}const P=s/4,Z=r/4,O=q().map(o=>o*1.08);N.k=1;for(let o=0;o<v*4;o++){const n=e-r*Math.floor(o/4),d=e+x-Z*o;R(N,-i,i,P*o,P*(o+1),n,d,O.map(m=>m*(.97+.06*(o*7%3)/2)),!1)}N.k=2;for(let o=0;o<v;o++){const n=e-r*o,d=O.map(m=>m*.94);for(const m of[-1,1])R(N,Math.min(m*i,m*(i+T)),Math.max(m*i,m*(i+T)),s*o,s*(o+1)+4,n,n+22.5,d,!1)}const V=o=>{const n=new M.BufferGeometry;return n.setAttribute("position",new M.BufferAttribute(new Float32Array(o.pos),3)),n.setAttribute("color",new M.BufferAttribute(new Float32Array(o.col),3)),n.setAttribute("normal",new M.BufferAttribute(new Float32Array(o.nor),3)),n.setAttribute("aPyr",new M.BufferAttribute(new Float32Array(o.kind),1)),n},Q=V(N),f=g/2,I=a/2,l=g/2,k=[b[0]*.98,b[1]*.98,b[2]*.98],F=(o,n,d,m)=>p(o,[-n,-d,-m],[n,-d,-m],[n,-d,m],[-n,-d,m],[0,-1,0],k.map(G=>G*.8)),j=A();R(j,-f,f,-I,I,-l,l,k),F(j,f,I,l);const E=A(),c=1.5*a,y=4.5,D=-c+19,$=l-12,Y=k.map(o=>o*.45),L=[.012,.011,.012],W=[.07,.12,.2];p(E,[-f,c,l],[f,c,l],[f,c,-l],[-f,c,-l],[0,1,0],k.map(o=>o*1.06)),p(E,[f,-c,-l],[-f,-c,-l],[-f,c,-l],[f,c,-l],[0,0,-1],k),p(E,[f,-c,l],[f,-c,-l],[f,c,-l],[f,c,l],[1,0,0],k.map(o=>o*.97)),p(E,[-f,-c,-l],[-f,-c,l],[-f,c,l],[-f,c,-l],[-1,0,0],k.map(o=>o*.97)),p(E,[-f,-c,l],[-y,-c,l],[-y,c,l],[-f,c,l],[0,0,1],k),p(E,[y,-c,l],[f,-c,l],[f,c,l],[y,c,l],[0,0,1],k),p(E,[-y,D,l],[y,D,l],[y,c,l],[-y,c,l],[0,0,1],k),E.k=3,p(E,[-y,-c,l],[-y,-c,$],[-y,D,$],[-y,D,l],[1,0,0],Y,L,L,Y),p(E,[y,-c,$],[y,-c,l],[y,D,l],[y,D,$],[-1,0,0],L,Y,Y,L),p(E,[-y,D,$],[y,D,$],[y,D,l],[-y,D,l],[0,-1,0],L,L,Y,Y),p(E,[-y,-c,l],[y,-c,l],[y,-c,$],[-y,-c,$],[0,1,0],Y,Y,L,L);{const o=[0,(D-c)/2,$],n=[[-y,-c,$],[y,-c,$],[y,D,$],[-y,D,$]];for(let d=0;d<4;d++)for(const[m,G]of[[n[d],L],[n[(d+1)%4],L],[o,W]])E.pos.push(m[0],m[1],m[2]),E.col.push(G[0],G[1],G[2]),E.nor.push(0,0,1),E.kind.push(3)}E.k=0,F(E,f,c,l);const U=[];let S=null;const z=(o,n,d,m,G)=>{const _=Math.round(2*o/g),C=(_-1)/2;for(let K=0;K<d;K++)for(let tt=0;tt<_;tt++)for(let J=0;J<_;J++){if(G&&J===_-1&&tt===C&&K<3){K===0&&(S=[0,n+c,-o+g*(J+.5),m+(d-1-2)]);continue}U.push([-o+g*(tt+.5),n+a*(K+.5),-o+g*(J+.5),m+(d-1-K)])}};z(h*g/2,s*v,u,0,!0);for(let o=v-1;o>=v-w;o--)z(e-r*o,s*o,2,u+2*(v-1-o),!1);return{solid:Q,blockGeo:V(j),doorGeo:V(E),blocks:U,door:S,half:e,height:s*v+a*u,top:h*g/2,stairOut:x,courses:u+2*w}}const B=bt,H=t=>t.toFixed(3),Vt=`
float tseQ = 0.;
{ vec3 tseLp = (uPyrInv * vec4(vTseP, 1.)).xyz, tseFn = normalize(cross(dFdx(tseLp), dFdy(tseLp)));
  float tseK = floor(vTsePyrK + .5), tseRim = max(abs(tseLp.x), abs(tseLp.z));
  float tseMo = .9 + .2 * tseFbm(vec2(tseLp.x + tseLp.z, tseLp.y * 1.7) * .011 + 5.);
  if (tseK > 2.5) { }
  else if (abs(tseFn.y) < .7){
    float tseAl = abs(tseFn.x) > abs(tseFn.z) ? tseLp.z : tseLp.x;
    float tseCy = tseLp.y / ${H(B.bed)} + 1e-4, tseCi = floor(tseCy), tseFy = tseCy - tseCi;
    float tseBs = tseAl / ${H(B.stone)} + (.5 * mod(tseCi, 2.) + .37 * tseHash(vec2(tseCi, 2.3))) + 100., tseBi = floor(tseBs), tseFs = tseBs - tseBi;
    float tseDy = min(tseFy, 1. - tseFy) * ${H(B.bed)}, tseDs = min(tseFs, 1. - tseFs) * ${H(B.stone)};
    float tseJy = 1. - smoothstep(.22, .22 + max(fwidth(tseLp.y), .04), tseDy), tseJs = 1. - smoothstep(.16, .16 + max(fwidth(tseAl), .04), tseDs);
    float tsePil = (1. - smoothstep(0., .8, tseDy)) + (1. - smoothstep(0., .8, tseDs));
    float tseTerr = ${H(B.tier*B.tiers)}, tseFoot, tseSpan;
    if (tseK == 1.) { tseSpan = ${H(B.tier/4)}; tseFoot = floor(tseLp.y / tseSpan + 1e-4) * tseSpan; }
    else if (tseK == 2.) { tseFoot = max(floor((tseLp.y - 4.) / ${H(B.tier)} + 1e-4) * ${H(B.tier)} + 4., 0.); tseSpan = tseFoot < 1. ? ${H(B.tier+4)} : ${H(B.tier)}; }
    else if (tseLp.y > tseTerr + .01) { tseFoot = tseTerr; tseSpan = ${H(B.height-B.tier*B.tiers)}; }
    else { tseSpan = ${H(B.tier)}; tseFoot = floor(tseLp.y / tseSpan + 1e-4) * tseSpan; }
    float tseHh = clamp((tseFoot + tseSpan - tseLp.y) / tseSpan, 0., 1.);
    float tseLw = (tseK == 0. && tseFoot > tseTerr - ${H(B.tier)} - .1 && tseFoot < tseTerr - .1) ? .2 : .1;
    float tseLip = 1. - smoothstep(tseLw * .6, tseLw, tseHh), tseSh = smoothstep(tseLw * .6, tseLw, tseHh) * (1. - smoothstep(tseLw * 1.2, tseLw * 3., tseHh));
    float tseSk = smoothstep(.52, .85, tseNoise(vec2(tseAl * .21, tseFoot * .37 + 3.))) * (1. - smoothstep(.1, .9, tseHh));
    diffuseColor.rgb *= tseMo * (.91 + .18 * tseHash(vec2(tseBi, tseCi))) * (1. - .4 * tseJy) * (1. - .2 * tseJs) * (1. - .07 * tsePil) * mix(1., .58, smoothstep(.7, 1., tseHh))
      * (1. + .16 * tseLip) * (1. - .3 * tseSh) * (1. - .22 * tseSk);
    if (tseK == 1.) diffuseColor.rgb *= mix(.62, 1., smoothstep(0., 7., ${H(B.stairHalf)} - abs(tseLp.x)));
    tseQ = tseK == 0. && tseLp.y < tseTerr + .01 ? 1.6 * tseLip : 1.;
  } else {
    vec2 tseB2 = tseLp.xz / ${H(B.stone)} + 100., tseF2 = fract(tseB2);
    float tseJ = max(1. - smoothstep(.2, .2 + max(fwidth(tseLp.x), .04), min(tseF2.x, 1. - tseF2.x) * ${H(B.stone)}), 1. - smoothstep(.2, .2 + max(fwidth(tseLp.z), .04), min(tseF2.y, 1. - tseF2.y) * ${H(B.stone)}));
    float tseTerr = ${H(B.tier*B.tiers)}, tseAo = 1.;
    if (tseK == 0. && tseLp.y < tseTerr - 1.) { float tseIn = tseRim - (${H(B.half)} - ${H(B.step)} * floor(tseLp.y / ${H(B.tier)} + .5)); tseAo = mix(.6, 1., smoothstep(0., 5., tseIn)) * (1. + .1 * smoothstep(${H(B.step-1.5)}, ${H(B.step)}, tseIn)); }
    else if (tseK == 0. && tseLp.y < tseTerr + 1.) tseAo = mix(.6, 1., smoothstep(0., 6., tseRim - ${H(B.top)}));
    else if (tseK == 1.) { float tseKk = floor(tseLp.y / ${H(B.tier/4)} + .5); tseAo = mix(.6, 1., smoothstep(0., 1.3, tseLp.z - (${H(B.half+B.stairOut)} - ${H(B.step/4)} * tseKk))) * mix(.62, 1., smoothstep(0., 7., ${H(B.stairHalf)} - abs(tseLp.x))); }
    diffuseColor.rgb = mix(diffuseColor.rgb, vec3(dot(diffuseColor.rgb, vec3(.333))), .25) * 1.12 * tseMo * (.93 + .14 * tseHash(floor(tseB2) + tseLp.y)) * (1. - .35 * tseJ) * tseAo;
    tseQ = tseK == 1. || tseLp.y > tseTerr + 1. ? 1. : 0.;
  }
  { float tseQy = ${H(B.tier*B.tiers+8)} * (1. - uRowLit.y) - 8.;
    tseQ *= uRowLit.x * smoothstep(tseQy - 8., tseQy + 8., tseLp.y); }
}`,et=Math.PI*2,ot=`
uniform float uRise; uniform vec3 uRowDir, uCrust, uRim, uBrine, uFrostCol;
`,ht=`
// how far the progress has gone since a piece let go of the ground (nought until then)
float riseGone(float s){ return max(uRise - s, 0.); }
// a piece's size: none on the ground, whole a little after it has let go
float riseSize(float s){ float g = riseGone(s); return g <= 0. ? 0. : smoothstep(0., .045, g); }
// where a piece's middle is: over its home by the square of the progress gone, and a few metres aside (2 m toward the
// row's bearing and 0.9 m its own way, less than 3 m in all; far: the share of that a piece takes)
vec3 riseAt(vec2 home, float s, float lift, float ph, float far){
  float g = riseGone(s), k = smoothstep(0., .5, g) * far;
  vec2 r = uRowDir.xz / max(length(uRowDir.xz), .05);
  vec2 d = (r * 2. + vec2(cos(ph), sin(ph)) * .9) * k;
  return vec3(home.x + d.x, 240. * lift * g * g, home.y + d.y);
}
// a turn of p about the unit axis ax by the angle a
vec3 riseTurn(vec3 p, vec3 ax, float a){ float c = cos(a), s = sin(a); return p * c + cross(ax, p) * s + ax * dot(ax, p) * (1. - c); }
`,ut=`
vec3 riseLit(vec3 alb, vec3 n){
  vec3 l = uAmb;
  for (int i = 0; i < 3; i++) l += uSunE[i] * (.25 + .75 * max(dot(n, uSunDir[i]), 0.));
  return alb * l;
}
vec3 riseAir(vec3 col, vec3 toEye){
  float dist = length(toEye); vec3 V = toEye / max(dist, 1e-3), lv = vec3(-V.x, .02, -V.z);
  return mix(col, tseAir(lv / max(length(lv), 1e-3)), tseFog(dist));
}
`,X=(t,e,a,s)=>t.setAttribute(e,new M.BufferAttribute(a instanceof Float32Array?a:new Float32Array(a),s)),pt=(t,e)=>Math.min(e,t?Math.floor(t.length/3):0),dt=(t,e,a)=>t.own&&e.tries?t.own(e.tries[a]):t.rng,ft=t=>.7*Math.pow(t(),.75),Et=`
attribute vec4 aHome, aTurn, aE0; attribute vec3 aE1, aTone;
varying vec3 vW, vN, vE1; varying vec4 vE0, vQ;
void main(){
  float s = aHome.z, g = riseGone(s), b = aTurn.w * uTime + aTone.z;
  // the turn about its level axis grows with the progress since it let go (slowly at first, so no edge dips into
  // the ground it has just left: the divisor is 0.08 and more); the clock sways it a little and turns it in its own plane
  float a = aTurn.y * g * g / max(g + .08, .08) + .3 * sin(aTurn.z * uTime + aTone.z) * smoothstep(0., .12, g);
  vec3 ax = vec3(cos(aTurn.x), 0., sin(aTurn.x));
  vec3 q = vec3(position.x * cos(b) - position.z * sin(b), 0., position.x * sin(b) + position.z * cos(b)) * riseSize(s);
  vec4 w = modelMatrix * vec4(riseTurn(q, ax, a) + riseAt(aHome.xy, s, aHome.w, aTone.z, 1.), 1.);
  vW = w.xyz; vN = riseTurn(vec3(0., 1., 0.), ax, a); vE0 = aE0; vE1 = aE1; vQ = vec4(position.xz, aTone.xy);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Bt=`
varying vec3 vW, vN, vE1; varying vec4 vE0, vQ;
// the light on a thin plate of salt. For the face a sun stands before: the common law of this part, or what the
// rough crust of the ground takes at that slant where that is more (so a plate that has just let go is as bright as
// the ground it left). For a sun that stands behind the plate: 0.7 of the same (thin salt lets the light through).
vec3 riseThin(vec3 n){
  vec3 l = uAmb;
  for (int i = 0; i < 3; i++){
    float d = dot(n, uSunDir[i]), c = abs(d);
    l += uSunE[i] * (.25 + max(.75 * c, 1.12 * c / (c + .12) - .25) * (d < 0. ? .7 : 1.));
  }
  return l;
}
void main(){
  vec3 toEye = cameraPosition - vW, n = vN / max(length(vN), 1e-3);
  float top = step(0., dot(n, toEye)); n = top > .5 ? n : -n;
  // how near the plate's own edge (in its half widths), and the pale ridge along it
  float e = min(min(min(vE0.x, vE0.y), min(vE0.z, vE0.w)), min(min(vE1.x, vE1.y), vE1.z)), fw = fwidth(e);
  float ridge = 1. - smoothstep(.05, .08 + fw, e), bloom = 1. - smoothstep(.06, .3, e);
  // its mottle in two grains, each kept as far as it is wider than a dot of the screen and then left at its mean
  vec2 q = vQ.xy + vQ.w; float fq = max(fwidth(vQ.x), fwidth(vQ.y));
  float mott = mix(.5, tseNoise(q * 1.7), 1. - smoothstep(.15, .6, fq)) * .6 + mix(.5, tseNoise(q * 6.1 + 9.), 1. - smoothstep(.04, .16, fq)) * .4;
  vec3 alb = uCrust * (.82 + .36 * mott) * vQ.z;
  alb = mix(alb * vec3(.8, .76, .73), alb, top);
  alb = mix(alb, uRim, max(ridge * (.55 + .35 * top), bloom * .3));
  gl_FragColor = vec4(riseAir(alb * riseThin(n), toEye), 1.);
}`;function Lt(t){const{U:e,glsl:a}=t,s=t.homes&&t.homes.plates,r=pt(s,2200),g=[],v=[],i=[],x=[],T=[],h=[],u=[];for(let b=0;b<r;b++){const q=s[b*3],p=s[b*3+1],R=s[b*3+2],A=dt(t,s,b),N=ft(A),P=Math.min(7,5+Math.floor(A()*3)),O=.5*(.8+(3+3*Math.min(1,Math.max(0,(R-30)/300))-.8)*Math.pow(A(),1.7)),V=A.range(.86,1),Q=A.range(0,et),f=A.range(0,et),I=A.range(1.5,5.5)*(A.chance(.5)?1:-1),l=A.range(.25,.6),k=A.range(.03,.12)*(A.chance(.5)?1:-1),F=A.range(.86,1.12),j=A.range(0,40),E=A.range(0,et),c=A.range(.7,1),y=[],D=[],$=[];for(let L=0;L<P;L++){const W=E+(L+A.range(-.3,.3))*et/P;y.push([Math.cos(W)*O,Math.sin(W)*O*c])}for(let L=0;L<P;L++){const W=y[L],U=y[(L+1)%P],S=U[0]-W[0],z=U[1]-W[1],o=Math.hypot(S,z)||1,n=-W[0]*-z+-W[1]*S>=0?1:-1;D.push(n*-z/o),$.push(n*S/o)}const Y=g.length/3;for(let L=0;L<P;L++){const W=[99,99,99,99,99,99,99];for(let U=0;U<P;U++)W[U]=Math.max(0,(y[L][0]-y[U][0])*D[U]+(y[L][1]-y[U][1])*$[U])/O;g.push(y[L][0],0,y[L][1]),v.push(q,p,N,V),i.push(f,I,l,k),h.push(F,j,Q),x.push(W[0],W[1],W[2],W[3]),T.push(W[4],W[5],W[6])}for(let L=1;L<P-1;L++)u.push(Y,Y+L+1,Y+L)}if(!r)return null;const w=new M.BufferGeometry;return X(w,"position",g,3),X(w,"aHome",v,4),X(w,"aTurn",i,4),X(w,"aTone",h,3),X(w,"aE0",x,4),X(w,"aE1",T,3),w.setIndex(u),new M.Mesh(w,new M.ShaderMaterial({uniforms:e,vertexShader:a+ot+ht+Et,fragmentShader:a+ot+ut+Bt,side:M.DoubleSide}))}const Ft=`
attribute vec4 aHome, aTurn;
varying vec3 vW; varying vec2 vTw;
void main(){
  float s = aHome.z, g = riseGone(s);
  // (a crystal stands up to 1.2 m aside of its home and drifts three fifths as far as the rest: under 3 m from its home in all)
  vec4 w = modelMatrix * vec4(position + riseAt(aHome.xy, s, aHome.w, aTurn.z, .6), 1.);
  float tw = .5 + .5 * sin(aTurn.y * uTime + aTurn.z + 60. * g);
  vW = w.xyz; vTw = vec2(tw * tw * tw * tw, aTurn.w);
  gl_PointSize = aTurn.x;
  // (no size on the ground: a crystal that has not let go is put out of sight altogether)
  gl_Position = g > 0. ? projectionMatrix * viewMatrix * w : vec4(2., 2., 2., 1.);
}`,St=`
varying vec3 vW; varying vec2 vTw;
void main(){
  vec3 toEye = cameraPosition - vW;
  vec3 alb = uFrostCol * mix(vec3(1.), vec3(.8, .92, 1.1), vTw.y);
  vec3 col = alb * (uAmb + (uSunE[0] + uSunE[1] + uSunE[2]) * (.45 + .55 * vTw.x));
  float disc = 1. - smoothstep(.3, .5, length(gl_PointCoord - .5));
  gl_FragColor = vec4(riseAir(col, toEye), disc * (.6 + .4 * vTw.x));
}`;function zt(t){const{U:e,glsl:a}=t,s=t.homes&&t.homes.glitter,r=6e3,g=pt(s,r),v=[],i=[],x=[];for(let h=0;h<g&&v.length/3<r;h++){const u=s[h*3],w=s[h*3+1],b=dt(t,s,h),q=ft(b),p=Math.min(5,2+Math.floor(b()*4));for(let R=0;R<p;R++){const A=b.range(0,et),N=1.2*Math.sqrt(b()),P=Math.min(.7,q+b.range(0,.05)),Z=b.range(.86,1),O=1+2*Math.pow(b(),1.5),V=b.range(1.2,4.5),Q=b.range(0,et),f=b();v.length/3>=r||(v.push(Math.cos(A)*N,0,Math.sin(A)*N),i.push(u,w,P,Z),x.push(O,V,Q,f))}}if(!v.length)return null;const T=new M.BufferGeometry;return X(T,"position",v,3),X(T,"aHome",i,4),X(T,"aTurn",x,4),new M.Points(T,new M.ShaderMaterial({uniforms:e,vertexShader:a+ot+ht+Ft,fragmentShader:a+ot+ut+St,transparent:!0,depthWrite:!1}))}const yt=`
vec3 riseBrine(vec3 n, vec3 V, float tone){
  vec3 R = reflect(-V, n), up = vec3(R.x, abs(R.y) + .05, R.z);
  vec3 sky = min(tseAir(up / max(length(up), 1e-3)), vec3(.5));
  float k = 1. - clamp(dot(n, V), 0., 1.);
  return mix(riseLit(uBrine * 1.5 * tone + .01, n), sky, .08 + .32 * k * k);
}
`,Ht=`
attribute vec4 aHome, aTurn; attribute vec3 aTone; attribute vec2 aBall;
varying vec3 vW, vQ, vU, vB;
void main(){
  float s = aHome.z, a = aTurn.w * riseGone(s) + aTone.y * uTime + aTone.x, k = riseSize(s);
  vec3 q = riseTurn(position * k, aTurn.xyz, a);
  vec4 w = modelMatrix * vec4(q + riseAt(aHome.xy, s, aHome.w, aTone.x, 1.), 1.);
  vW = w.xyz; vQ = q; vU = riseTurn(vec3(0., 1., 0.), aTurn.xyz, a); vB = vec3(aBall.x * k, aBall.y, aTone.z);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Rt=`
varying vec3 vW, vQ, vU, vB;
void main(){
  vec3 toEye = cameraPosition - vW, V = toEye / max(length(toEye), 1e-3), u = vU / max(length(vU), 1e-3);
  // the line of sight through this place of the face, met with the bead (measured from the bead's own middle):
  // k squeezes the measure along the bead's longer way (a bead is 1 to 1.2 times as tall as wide, so k is between
  // -0.31 and 0 and A is 0.69 and more; the division is bounded all the same)
  float k = 1. / max(vB.y * vB.y, 1.) - 1., du = -dot(V, u), qu = dot(vQ, u);
  float A = 1. + k * du * du, B = -dot(vQ, V) + k * qu * du, C = dot(vQ, vQ) + k * qu * qu - vB.x * vB.x, D = B * B - A * C;
  if (D < 0.) discard;
  vec3 p = vQ - V * ((-B - sqrt(max(D, 0.))) / max(A, .25)), n = p + k * u * dot(p, u);
  gl_FragColor = vec4(riseAir(riseBrine(n / max(length(n), 1e-4), V, vB.z), toEye), 1.);
}`;function Dt(t){const{U:e,glsl:a}=t,s=t.homes&&t.homes.beads,r=pt(s,900),g=[],v=[],i=[],x=[],T=[],h=[];for(let w=0;w<r;w++){const b=s[w*3],q=s[w*3+1],p=dt(t,s,w),R=ft(p),A=.15+.75*Math.pow(p(),2),N=p.range(1,1.2),P=.5*A/N,Z=p.range(.86,1),O=p.range(0,et),V=p.range(-1,1),Q=p.range(0,et),f=Math.sqrt(Math.max(0,1-V*V)),I=p.range(1,5)*(p.chance(.5)?1:-1),l=p.range(.08,.3)*(p.chance(.5)?1:-1),k=p.range(.8,1.25),F=g.length/3,j=P*Math.sqrt(3)*1.04;for(const E of[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]])g.push(E[0]*j,E[1]*j*N,E[2]*j),v.push(P,N),i.push(b,q,R,Z),x.push(Math.cos(Q)*f,V,Math.sin(Q)*f,I),T.push(O,l,k);for(let E=0;E<8;E++){const c=E&1,y=2+(E>>1&1),D=4+(E>>2&1);((E&1)+(E>>1&1)+(E>>2&1))%2===0?h.push(F+c,F+y,F+D):h.push(F+c,F+D,F+y)}}if(!r)return null;const u=new M.BufferGeometry;return X(u,"position",g,3),X(u,"aBall",v,2),X(u,"aHome",i,4),X(u,"aTurn",x,4),X(u,"aTone",T,3),u.setIndex(h),new M.Mesh(u,new M.ShaderMaterial({uniforms:e,vertexShader:a+ot+ht+Ht,fragmentShader:a+ot+ut+yt+Rt}))}const Gt=`
attribute vec4 aHome, aTurn;
varying vec3 vW, vN;
void main(){
  float s = aHome.z, g = riseGone(s), t = position.y, H = max(aHome.w, 1.);
  float h = H * (1. - exp(-240. * g * g / H)), f = h / H, rad = aTurn.x * sqrt(max(f, 0.));
  float tw = 3. * g + 2. * t, c = cos(tw), sn = sin(tw);
  vec2 ring = vec2(position.x * c - position.z * sn, position.x * sn + position.z * c);
  vec2 r = uRowDir.xz / max(length(uRowDir.xz), .05);
  vec2 side = (r * 2. * smoothstep(0., .5, g) + vec2(cos(aTurn.y), sin(aTurn.y)) * .9 * sin(aTurn.z * uTime + aTurn.w + t * 2.)) * t * t * f * min(H / 25., 1.);
  vec4 w = modelMatrix * vec4(aHome.x + side.x + ring.x * rad, t * h, aHome.y + side.y + ring.y * rad, 1.);
  vW = w.xyz; vN = vec3(normal.x * c - normal.z * sn, normal.y, normal.x * sn + normal.z * c);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,qt=`
varying vec3 vW, vN;
void main(){
  vec3 toEye = cameraPosition - vW;
  gl_FragColor = vec4(riseAir(riseBrine(vN / max(length(vN), 1e-3), toEye / max(length(toEye), 1e-3), 1.), toEye), 1.);
}`;function Ct(t){const{rng:e,U:a,glsl:s}=t,r=t.homes&&t.homes.ropes,g=pt(r,140),v=5,i=[],x=[],T=[],h=[],u=[];for(let b=0;b<g;b++){const q=r[b*3],p=r[b*3+1],R=ft(e),A=3+22*Math.pow(e(),1.6),N=(.05+.008*A)*e.range(.8,1.25),P=e.range(0,et),Z=e.range(.25,.7),O=e.range(0,et),V=e.range(0,et),Q=i.length/3;for(let f=0;f<=v;f++){const I=f/v,l=f===0?1.5:Math.pow(1-I,.7);for(let k=0;k<3;k++){const F=V+k*et/3;i.push(Math.cos(F)*l,I,Math.sin(F)*l),x.push(Math.cos(F),.1,Math.sin(F)),T.push(q,p,R,A),h.push(N,P,Z,O)}}for(let f=0;f<v;f++)for(let I=0;I<3;I++){const l=Q+f*3+I,k=Q+f*3+(I+1)%3;u.push(l,l+3,k,k,l+3,k+3)}}if(!g)return null;const w=new M.BufferGeometry;return X(w,"position",i,3),X(w,"normal",x,3),X(w,"aHome",T,4),X(w,"aTurn",h,4),w.setIndex(u),new M.Mesh(w,new M.ShaderMaterial({uniforms:a,vertexShader:s+ot+ht+Gt,fragmentShader:s+ot+ut+yt+qt,side:M.DoubleSide}))}function Qt(t){const e=new M.Group;e.name="tse-rising";const a=[["tse-rise-plates",31,Lt],["tse-rise-glitter",32,zt],["tse-rise-beads",33,Dt],["tse-rise-ropes",34,Ct]];let s=0;for(const[r,g,v]of a){const i=v(t.rngOf?{...t,rng:t.rngOf(r),own:t.rngAt?x=>t.rngAt(r,x):null}:t);i&&(i.name=r,i.renderOrder=g,i.frustumCulled=!1,i.isMesh&&(s+=i.geometry.index?i.geometry.index.count/3:i.geometry.attributes.position.count/3),e.add(i))}return{group:e,triangles:s,dispose(){for(const r of e.children)r.geometry.dispose(),r.material.dispose()}}}export{bt as PYRAMID,Vt as PYRAMID_DRESS,st as STONE,It as buildHero,At as heapStones,Pt as keepStones,Nt as makeBoulderGeometry,kt as makeGiant,wt as makeHeapGeometry,gt as makeNeedleGeometry,$t as makePyramid,Qt as makeRising,Tt as mergeGeoms,Mt as needleTaper};
