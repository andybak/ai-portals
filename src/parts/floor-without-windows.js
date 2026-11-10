import*as k from"three";import{makeRng as ae,hashSeed as se,smoothstep as dt}from"../kit/core.js";function oo(e){const n=Math.pow(Math.min(Math.max(e,0),.9),2.2),r=1-.983729*n,c=.0245786-.432951*n,i=90537e-9+.238081*n;return .663*(-c+Math.sqrt(Math.max(c*c+4*r*i,0)))/(2*r)}const Pe=(e,n,r)=>"vec3("+[e,n,r].map(c=>oo(c).toFixed(4)).join(", ")+")",w={CW:7,CH:6.6,COVE:2,EYE:3,SLOT:1.5,SLOT_W:.6,ROOF:6.9,CELL:26,H1:{x0:-134,x1:-34,z0:-193,z1:-93,h:10,roof:11.5},H2:{x0:-178,x1:42,z0:-442,z1:-222,h:12,roof:13.5,floor:-2.6,deep:-6},OC:{x:-98,z:-292,r:42,up:2},WELL:{r:42,thick:1.6,foot:9,top:14.3,cols:12,colR:.4,colAt:42.8},LINK_ROOF:9.5,COR_ROOF:8.1,RISE:30,TOP:41,AVE:13,STREET_Y:9,RING_Y:9,TIDE_EYE:2,RISE_LATE:30*Math.PI/4,CON:{z:-262,x0:42,x1:110,w:14,h:12.6,cope:13.3},SLAB:96,CORE:{x:160,z:-262,r:50,door:16,lifts:[[-22,19.2],[0,19.2],[22,19.2]]},TOWB:{x:392,z:-86,r:45,door:30,lifts:[[-28,34],[0,34],[28,34]]},REVEAL:{broad:2,proud:3},PORCH:{rise:1,steps:5,tread:.75,land:2.3,out:15,half:19.5,piers:[-13.6,-9.1,-4.6]},STREET:{z:-86,x0:248.3,x1:347,w:18},FORE:{x0:319,hw:20},POOL:{x0:323,x1:341,hw:8},SHAFT:{x:-84,z:-143,r:42,deep:6,below:18,above:6,top:40,roof:43,half:50,plat:9},LOBBY:{x0:-112.5,x1:-64.5,z0:-48,z1:42,h:18,roof:19.5,glassS:22,bay:6.1,glassOff:5,startIn:20,startOff:16,bend:60},LINK_Z:-198,ISLAND:{x:-84,z:-143},MAZE_N:256,MAZE_X0:-3361,MAZE_Z0:-3629},Fe={x0:w.H2.x0-.7+3.5,x1:w.H2.x1+.7-3.5,z0:w.H2.z0-.7+3.5,z1:w.H2.z1+.7-3.5,strip:-63.5,row:-262,cross:1.7,well:52,bedH:.9},tt=[];let ie=0;function Le(e,n,r,c){const i=Math.hypot(r-e,c-n);tt.push({h0:ie,len:i,x0:e,z0:n,tx:(r-e)/i,tz:(c-n)/i}),ie+=i}function ot(e,n,r,c,i){const p=Math.abs(i-c)*r;tt.push({h0:ie,len:p,cx:e,cz:n,r,a0:c,a1:i}),ie+=p}const ge=w.LOBBY.x1-w.CW/2;w.LOBBY.sx=w.LOBBY.x0+w.LOBBY.startOff,w.LOBBY.sz=w.LOBBY.z1-w.LOBBY.startIn;{const e=w.LOBBY,n=ge-e.bend,r=e.z0,c=e.sx-n,i=e.sz-r,p=Math.atan2(i,c)-Math.acos(e.bend/Math.hypot(c,i));Le(e.sx,e.sz,n+e.bend*Math.cos(p),r+e.bend*Math.sin(p)),ot(n,r,e.bend,p,0)}const Rt=ie,kt={corridor:(w.CW/2-w.COVE)/2,link:w.CW/2-w.COVE};Le(ge,w.LOBBY.z0,ge,w.LINK_Z);const Ht=ie;Le(ge,w.LINK_Z,ge,w.H2.z1);const $e=ie;Le(ge,w.H2.z1,ge,w.OC.z);const we=ie;ot(w.OC.x,w.OC.z,w.RISE,0,-1.5*Math.PI);const be=ie,me=35*Math.PI/180,pt=120,ne=150,De=-58,Se=pt*Math.tan(me/2),X=Math.sin(me),Q=Math.cos(me),Qe=w.STREET.z-ne,Re=Qe+ne*Q,Ce=De+(Re+262)*Q/X,Ee=Ce+ne*X;Le(-98,-262,De-Se,-262),ot(De-Se,-262+pt,pt,-Math.PI/2,-Math.PI/2+me);const xe=ie;Le(De+Se*Q,-262+Se*X,Ce,Re);const Ae=ie;ot(Ee,Qe,ne,Math.PI/2+me,Math.PI/2);const mt=ie,ao={x:w.TOWB.x-w.TOWB.r-2,y:w.RING_Y,z:w.STREET.z,bearing:Math.PI};Le(Ee,w.STREET.z,ao.x,w.STREET.z);const _e=ie,xt=w.MAZE_Z0+3484+4.7,It=34.5,Bt=Ae-(Re-xt)/X,so=Bt,at=Ae-It,no=xe+(w.CORE.x-De)*Q-Se,st=(()=>{let e=be,n=xe;for(let r=0;r<40;r++){const c=(e+n)/2,i=fe(c);Math.hypot(i[0]-w.OC.x,i[1]-w.OC.z)<47?e=c:n=c}return(e+n)/2})(),q=(()=>{const e=De+Se*Q,n=-262+Se*X,r=22,c=w.MAZE_X0+3458,i=w.MAZE_Z0+3458;return{ox:e,oz:n,hw:14,lid:48,zc:xt,a:{s:(w.H2.z1+1.2+3+r-n)/X,n:0,r,pool:8},b:{s:(c-e)*Q+(i-n)*X,n:-(c-e)*X+(i-n)*Q,r:20,pool:7}}})(),vt=(e,n)=>[q.ox+e*Q-n*X,q.oz+e*X+n*Q],ro=(e,n)=>[(e-q.ox)*Q+(n-q.oz)*X,-(e-q.ox)*X+(n-q.oz)*Q];function nt(e,n){const r=q,[c,i]=ro(e,n),p=Math.abs(i)-r.hw,u=r.a.s-c,l=Math.hypot(Math.max(p,0),Math.max(u,0))+Math.min(Math.max(p,u),0);return Math.min(l,Math.hypot(c-r.a.s,i-r.a.n)-r.a.r,Math.hypot(c-r.b.s,i-r.b.n)-r.b.r)}const wt=xe+q.a.s,ut=wt-q.a.r,ma={mouth:Rt,link:Ht,quay:$e,rise:we,west:we+w.RISE*Math.PI,top:be,border:st,diag:xe,roof:xe+(w.H2.z1-q.oz)/X,rim:ut,plaza:wt,rimFar:wt+q.a.r,corner:xe+(w.CORE.x-w.CORE.r-q.ox)*Q+(w.CORE.z+w.CORE.r-q.oz)*X,plazaB:xe+q.b.s,abeam:no,court:Bt,canal:at,down:Ae,street:mt,end:_e},io=()=>[0,1,2,3].map(e=>be+(xe-be)*e/4).concat([xe,Ae],[1,2,3].map(e=>Ae+(mt-Ae)*e/4),[mt,_e]);function fe(e){let n=tt[0];for(const p of tt)e>=p.h0&&(n=p);const r=Math.min(Math.max(e-n.h0,0),n.len);if(n.r===void 0)return[n.x0+n.tx*r,n.z0+n.tz*r,n.tx,n.tz];const c=Math.sign(n.a1-n.a0),i=n.a0+c*r/n.r;return[n.cx+n.r*Math.cos(i),n.cz+n.r*Math.sin(i),-c*Math.sin(i),c*Math.cos(i)]}{const e=w.LOBBY,n=c=>{let i=1e9;for(let p=0;p<=Ht;p+=.25){const u=fe(p);i=Math.min(i,Math.hypot(e.x1-u[0],Math.max(c-u[1],u[1]-e.glassS,0)))}return i};let r=Math.floor((e.glassS-e.z0)/e.bay);for(;r>0&&n(e.glassS-r*e.bay)<e.glassOff;)r--;e.glassN=e.glassS-r*e.bay}function xa(e){let n=0,r=we;for(let c=0;c<48;c++){const i=(n+r)/2;fe(i)[1]>e?n=i:r=i}return(n+r)/2}const lo=e=>e<$e?w.EYE:e<$e+qe[1]?w.EYE+(w.TIDE_EYE-w.EYE)*(e-$e)/qe[1]:e<we+w.RISE_LATE?w.TIDE_EYE:e<be?w.TIDE_EYE+(w.TOP-w.TIDE_EYE)*(e-we-w.RISE_LATE)/(be-we-w.RISE_LATE):e<st?w.TOP:e<ut?w.TOP+(w.AVE-w.TOP)*(e-st)/(ut-st):e<at?w.AVE:e<Ae?w.AVE+(w.STREET_Y-w.AVE)*(e-at)/(Ae-at):w.STREET_Y;function Wt(e){let n=0;for(let r=-8;r<=8;r++)n+=lo(e+r);return n/17}function va(e=3){const n=[],r=Math.ceil(_e/e);for(let c=0;c<=r;c++){const i=_e*c/r,p=fe(i);n.push([p[0],Wt(i),p[1],i])}return n}const ze={rest:.6,span:60,period:2,hump:.3,doorSpan:150,doorPeriod:3.75,doorHump:.45};function wa(e,n,r){const c=(((e+n)/ze.span+r/ze.period)%1+1)%1,i=Math.sin(Math.PI*Math.min(c/ze.hump,1));return ze.rest+(1-ze.rest)*i*i}function ua(e,n,r){const c=(((e+n)/ze.doorSpan-r/ze.doorPeriod)%1+1)%1;return dt(0,.14,c)*(1-dt(.31,ze.doorHump,c))}const ue=`
uniform float uTime;
float waveHump(float q){
  float ph = fract(q / 60. + uTime / 2.);
  float s = sin(3.14159265 * min(ph / .3, 1.));
  return s * s;
}
float discLight(float q){ return .6 + .4 * waveHump(q); }
float doorOpen(float q){
  float ph = fract(q / 150. - uTime / 3.75);
  return smoothstep(0., .14, ph) * (1. - smoothstep(.31, .45, ph));
}
`,co=[[1.6,60,7,45,.6],[.2,23,5,90,2.1]],ya=1.8,ga=.2098,ho=co.map(([e,n,r,c,i])=>{const p=c*Math.PI/180,u=2*Math.PI/n;return{a:e,kx:u*Math.cos(p),kz:u*Math.sin(p),w:u*r,ph:i}}),qe=[6,30];function Nt(e,n){const r=w.H2;return 1/3+2/3*dt(qe[0],qe[1],Math.min(e-r.x0,r.x1-e,n-r.z0,r.z1-n))}function ba(e,n,r,c){let i=0;for(const p of e)i+=p.a*Math.sin(p.kx*n+p.kz*r-p.w*c+p.ph);return i*Nt(n,r)}function Ea(e,n,r,c,i){let p=0,u=0;for(const f of e){const a=f.a*Math.cos(f.kx*n+f.kz*r-f.w*c+f.ph);p+=a*f.kx,u+=a*f.kz}const l=Nt(n,r);return i[0]=p*l,i[1]=u*l,i}const ee={x0:-68,z0:-229,dx:7.2,dz:5.5,turn:Math.PI/4,bands:[3.5*7.2,7.5*7.2],field:8,hx:2.1,hz:1.95,tall:3.05},te={x0:-23,z0:-234,step:10.5,nx:6,nz:5,rad:3.9,tall:2.7},Pt=[["cabinet",12,.65,.8,3.6,.04,1.5],["plant",10,1.3,1.3,3.5,.06,1.5],["sofa",7,2.5,.95,2,.04,1.5],["table",3,3.9,3.9,2.7,.03,1.3]],fo=6.5,$t=(()=>{const e=[],n=c=>[w.OC.x+w.WELL.colAt*Math.cos(c),w.OC.z+w.WELL.colAt*Math.sin(c)];for(let c=$e;c<=be;c+=.5){const i=fe(c);e.push(i[0],i[1])}const r=c=>{for(let i=0;i<e.length;i+=2)if(Math.hypot(c[0]-e[i],c[1]-e[i+1])<fo)return!1;return!0};return Array.from({length:w.WELL.cols},(c,i)=>{const p=(22.5+i*360/w.WELL.cols)*Math.PI/180,u=.05*Math.PI/180;for(let l=0;l<600;l++)for(const f of l?[1,-1]:[1]){const a=n(p+f*l*u);if(r(a))return a}return n(p)})})(),J={x:w.OC.x,z:w.OC.z,r:7.5,top:-.3,out:4.6,newel:.7,head:w.WELL.top,halves:4},Ge=Math.cos(ee.turn),je=Math.sin(ee.turn),rt=(e,n)=>{const r=e-J.x,c=n-J.z;return[J.x+r*Ge-c*je,J.z+r*je+c*Ge]},ke=(e,n)=>{const r=ee.x0+ee.dx*e-J.x,c=ee.z0-ee.dz*n-J.z;return[J.x+r*Ge+c*je,J.z-r*je+c*Ge]},de=(()=>{const e=w.H2,n=[[e.x0,e.z0],[e.x1,e.z0],[e.x1,e.z1],[e.x0,e.z1]].map(([i,p])=>rt(i,p)),r=n.map(i=>(i[0]-ee.x0)/ee.dx),c=n.map(i=>(ee.z0-i[1])/ee.dz);return{n0:Math.floor(Math.min(...r)),n1:Math.ceil(Math.max(...r)),j0:Math.floor(Math.min(...c)),j1:Math.ceil(Math.max(...c))}})();function Aa(e,n){const r=e.image.data,c=ee,i=de,p=k.DataUtils.toHalfFloat,u=i.n1-i.n0+1;r.fill(p(1e4));for(const l of n)if(l.cell){const f=Math.cos(l.yaw),a=Math.sin(l.yaw),h=((l.cell[1]-i.j0)*u+l.cell[0]-i.n0)*4+2*l.cell[2],m=rt(l.x+1.3*f-1.35*a,l.z-1.3*a-1.35*f);r[h]=p(m[0]-(c.x0+l.cell[0]*c.dx)),r[h+1]=p(m[1]-(c.z0-l.cell[1]*c.dz))}return e.needsUpdate=!0,e}function za(e){const n=po(e);let r=n.next();for(;!r.done;)r=n.next();return r.value}function*po(e){const n=ae(se("fww-adrift:"+e)),r=ae(se("fww-fleet:"+e)),c=[],i=w.H2,p=[],u=[],l=ee;for(let v=$e;v<be;v+=2){const T=fe(v);u.push(T[0],T[1]),Wt(v)<9&&p.push(T[0],T[1],T[2],T[3])}const f=4.2,a=(v,T,y)=>$t.some(z=>Math.hypot(v-z[0],T-z[1])<y+w.WELL.colR+.6),h={hx:6.6,hz:2.9,on:!1},m=1.5,s=(v,T,y,z,L,M,R,H,I)=>{const B=Math.hypot(M,R);for(let P=0;P<p.length;P+=4)if((y-p[P])**2+(z-p[P+1])**2<(f+B)**2)return!1;if(Math.hypot(y-J.x,z-J.z)<J.r+1.2+B||a(y,z,B))return!1;if(v!==7&&h.on){const P=rt(y,z);if(Math.abs(P[0]-h.u)<h.hx+M+m&&Math.abs(P[1]-h.v)<h.hz+R+m)return!1}return c.push({kind:v,name:T,x:y,z,yaw:L,rate:0,rad:B,hx:M,hz:R,tall:H,size:1,...I}),!0};{const v=[(J.x+i.x0)/2,J.z],T=rt(v[0],v[1]),y=Math.round((T[0]-l.x0)/l.dx-.5)+.5,z=Math.round((l.z0-T[1])/l.dz),L=[];for(let M=-3;M<=3;M++)for(let R=-3;R<=3;R++){const H=ke(y+M,z+R);L.push({n:y+M,j:z+R,p:H,off:Math.hypot(H[0]-v[0],H[1]-v[1])})}L.sort((M,R)=>M.off-R.off);for(const M of L)if(s(7,"long table",M.p[0],M.p[1],l.turn,h.hx,h.hz,2.7)){h.u=l.x0+M.n*l.dx,h.v=l.z0-M.j*l.dz,h.on=!0;break}}for(let v=0;v<te.nz;v++)for(let T=0;T<te.nx;T++)s(4,"table",te.x0+T*te.step,te.z0-v*te.step,(T+v)%2*.3927,te.rad,te.rad,te.tall);yield null;const d=l.x0+l.bands[1],o=[];for(let v=0;v<Pt.length;v++){const[T,y,z,L,M,R,H]=Pt[v],I=z*H,B=L*H,P=M*H,V=Math.hypot(I,B);for(let K=0;K<y;K++){yield null;for(let G=0;G<300;G++){const N=n.range(d,i.x1-l.field),C=n.range(i.z0+l.field,i.z1-l.field);let O=!0;(Math.hypot(N-J.x,C-J.z)<J.r+1.2+V||a(N,C,V))&&(O=!1);for(const F of c)(N-F.x)**2+(C-F.z)**2<(V+F.rad+2)**2&&(O=!1);if(O){const F={kind:v+1,name:T,x:N,z:C,yaw:n.range(0,6.2832),rate:R*(n.chance(.5)?1:-1),rad:V,hx:I,hz:B,tall:P,size:H};c.push(F),o.push(F);break}}}yield null}const t={x0:te.x0-te.rad,x1:te.x0+(te.nx-1)*te.step+te.rad,z0:te.z0-(te.nz-1)*te.step-te.rad,z1:te.z0+te.rad},E=(v,T,y)=>{if(v<i.x0+l.field||v>i.x1-l.field||T<i.z0+l.field||T>i.z1-l.field||v>t.x0-y-2&&v<t.x1+y+2&&T>t.z0-y-2&&T<t.z1+y+2)return!1;for(const z of o)if((v-z.x)**2+(T-z.z)**2<(y+z.rad+2)**2)return!1;return!0},g=(v,T,y,z,L,M,R,H)=>E(y[0],y[1],Math.hypot(L,M))&&s(v,T,y[0],y[1],z,L,M,R,H),b=(v,T)=>{let y=1e18;for(let z=0;z<u.length;z+=2)y=Math.min(y,(v-u[z])**2+(T-u[z+1])**2);return Math.sqrt(y)},A=de,x=(v,T)=>(v%T+T)%T;for(let v=A.j0;v<=A.j1;v++){const T=x(v,2);x(v,8)===0&&(yield null);for(let y=A.n0;y<=A.n1;y++){const z=ke(y,v),L=b(z[0],z[1]),M={lamp:T,cell:[y,v,0]};if(L<l.bands[0]){g(0,"desk",z,l.turn,l.hx,l.hz,l.tall,M);continue}if(L<l.bands[1]){if(x(v,2))continue;b(...ke(y,v-1))>=l.bands[0]&&b(...ke(y,v+1))>=l.bands[0]?x(v,12)===4?(g(0,"desk",ke(y,v-2/l.dz),l.turn,l.hx,l.hz,l.tall,M),g(0,"desk",ke(y,v+2/l.dz),l.turn+Math.PI,l.hx,l.hz,l.tall,{lamp:T,cell:[y,v,1]})):x(v,12)===8?g(5,"desk",z,l.turn,l.hx,l.hz,l.tall,M)&&g(6,"chair",ke(y+r.range(-1.6,1.6)/l.dx,v-r.range(3.3,4.3)/l.dz),r.range(0,6.2832),.8,.8,2.6):g(0,"desk",z,l.turn,l.hx,l.hz,l.tall,M):g(0,"desk",z,l.turn,l.hx,l.hz,l.tall,M)}else x(v,4)===0&&(x(y,2)===0?g(0,"desk",z,l.turn,l.hx,l.hz,l.tall,M):x(v,8)===4&&g(2,"plant",z,r.range(0,6.2832),1.3*1.5,1.3*1.5,3.5*1.5,{size:1.5}))}}return c}const Dt=`
uniform vec4 uTr[2];
uniform vec2 uTa;
float tideEdge(vec2 p){
  float d = min(min(p.x + 178., 42. - p.x), min(p.y + 442., -222. - p.y));
  return 1. / 3. + 2. / 3. * smoothstep(${qe[0].toFixed(1)}, ${qe[1].toFixed(1)}, d);
}
// height over the mean in x, slope in yz
vec3 tide(vec2 p){
  float h = 0.; vec2 g = vec2(0.);
  for (int i = 0; i < 2; i++) {
    float th = uTr[i].x * p.x + uTr[i].y * p.y - uTr[i].z * uTime + uTr[i].w;
    h += uTa[i] * sin(th);
    g += uTa[i] * cos(th) * uTr[i].xy;
  }
  float e = tideEdge(p);
  return vec3(h, g) * e;
}
`,mo=[{i:131,j:134,id:255,what:1,wi:8,hj:3}].map(e=>({...e,cx:w.MAZE_X0+13*(2*e.i+e.wi),cz:w.MAZE_Z0+13*(2*e.j+e.hj)})),it=[[0,133,129,136],[1,133,129,136],[1,137,129,140]],He=(e,n)=>e%4===1&&!it.some(r=>r[0]===0&&r[1]===e&&n>=r[2]&&n<=r[3])?13:4.7,Ie=(e,n)=>n%4===1&&!it.some(r=>r[0]===1&&r[1]===n&&e>=r[2]&&e<=r[3])?13:4.7,Y={x0:w.MAZE_X0+3406+4.7,x1:w.MAZE_X0+3614-4.7,z0:xt,z1:w.MAZE_Z0+3562-4.7,head:It,arc:ne*me,tail:3.4,hw:6,kerb:.9};Y.len=Y.head+Y.arc+Y.tail;function xo(e,n){const r=(e-Ce)*Q+(n-Re)*X;if(r<0){const u=-(e-Ce)*X+(n-Re)*Q;return[Math.abs(u),r+Y.head,u<0?-1:1]}if(e>Ee)return[Math.abs(n-w.STREET.z),Y.head+Y.arc+e-Ee,n<w.STREET.z?-1:1];const c=e-Ee,i=n-Qe,p=Math.hypot(c,i);return[Math.abs(p-ne),Y.head+ne*(Math.PI/2+me-Math.atan2(i,c)),p<ne?-1:1]}function Be(e,n){if(e<Y.head){const r=e-Y.head;return[Ce+Q*r-X*n,Re+X*r+Q*n,Q,X]}if(e<Y.head+Y.arc){const r=Math.PI/2+me-(e-Y.head)/ne;return[Ee+(ne+n)*Math.cos(r),Qe+(ne+n)*Math.sin(r),Math.sin(r),-Math.cos(r)]}return[Ee+e-Y.head-Y.arc,w.STREET.z+n,1,0]}const vo=[[5,.24],[6,.16],[3,.18],[1,.12],[2,.11],[4,.11],[7,.08]];function*Ct(e){const n=ae(se("fww-maze:"+e)),r=w.MAZE_N,c=new Uint8Array(r*r*4),i=(l,f)=>(f*r+l)*4;for(let l=0;l<r;l++)for(let f=0;f<r;f++){f===0&&l>0&&l%32===0&&(yield null);const a=i(f,l),h=n()<.42||He(f,l)>5?1:0,m=n()<.42||Ie(f,l)>5?2:0,s=n()<.45?0:n()<.72?1:2,d=n()<.45?0:n()<.72?1:2;c[a]=h|m|s<<3|d<<5,c[a+1]=Math.floor(n()*256),c[a+3]=0}const p=ae(se("fww-district:"+e));for(let l=0;l<r/4;l++)for(let f=0;f<r/4;f++){let a=p(),h=7;for(const[m,s]of vo){if(a<s){h=m;break}a-=s}for(let m=0;m<4;m++)for(let s=0;s<4;s++){const d=f*4+s+1,o=l*4+m+1;d<r&&o<r&&(c[i(d,o)+2]=h)}}for(let l=0;l<r;l++)c[i(0,l)+2]=c[i(1,l)+2],c[i(l,0)+2]=c[i(l,1)+2];yield null;const u=(l,f,a,h,m=2)=>{for(let s=0;s<m;s++)for(let d=0;d<a;d++){const o=i(l+d,f+s);c[o]|=128,c[o+1]=h,c[o+3]=(d&3)<<2|(s&1)<<4|(a===3||d>3?32:0)|s>>1<<6|(a===8?128:0),d>0&&(c[o]&=-2,c[o+3]|=1),s>0&&(c[o]&=-3,c[o+3]|=2)}};for(const l of mo)u(l.i,l.j,l.wi,l.id,l.hj);for(let l=0;l<r/4-1;l++)for(let f=0;f<r/4-1;f++){const a=n()<.45,h=Math.floor(n()*255),m=f*4+2,s=l*4+2;if(!a)continue;let d=!0;for(let E=0;E<2;E++)for(let g=0;g<2;g++)c[i(m+g,s+E)]&128&&(d=!1);const o=w.MAZE_X0+26*m+4.7,t=w.MAZE_Z0+26*s+4.7;for(const[E,g]of[[0,0],[1,0],[0,1],[1,1],[.5,.5],[.5,0],[0,.5],[1,.5],[.5,1]])nt(o+42.6*E,t+42.6*g)<q.lid&&(d=!1);d&&u(m,s,2,h)}yield null;for(let l=1;l<r;l++)for(let f=1;f<r;f++)(c[i(f,l)]&3||c[i(f,l-1)]&1||c[i(f-1,l)]&2)&&(c[i(f,l)]|=4);return{data:c,N:r,at:i}}function Ma(e){const n=Ct(e);let r=n.next();for(;!r.done;)r=n.next();return r.value}const Me=`
float litD(float d){
  float s = pow(clamp(d, 0., .9), 2.2), A = 1. - .983729 * s, B = .0245786 - .432951 * s, C = .000090537 + .238081 * s;
  return .663 * (-B + sqrt(max(B * B + 4. * A * C, 0.))) / (2. * A);
}
vec3 lit3(vec3 d){ return vec3(litD(d.r), litD(d.g), litD(d.b)); }
`,Te=`
const vec3 NIGHT_HAZE = ${Pe(.38,.5,.92)}, NIGHT_UP = ${Pe(.16,.21,.46)};
float airBand(float ya, float yb, float lo, float hi){
  float dy = abs(yb - ya);
  return dy > .05 ? abs(clamp(yb, lo, hi) - clamp(ya, lo, hi)) / dy : step(lo, ya) * step(ya, hi);
}
// (low: the share of the low sheet that lies before the place: 1 everywhere but at a tower's foot and in its pool)
vec3 nightAirK(vec3 c, vec3 eye, vec3 rel, float low){
  float dist = length(rel), yb = eye.y + rel.y;
  float t1 = dist * (low * airBand(eye.y, yb, 10., 22.) / 1400. + airBand(eye.y, yb, 46., 54.) / 2000. + 1. / 22000.);
  float t3 = dist * airBand(eye.y, yb, 84., 96.) / 2600.;
  c = mix(c, NIGHT_HAZE, 1. - exp(-t1));
  return mix(c, NIGHT_UP, 1. - exp(-t3));
}
vec3 nightAir(vec3 c, vec3 eye, vec3 rel){ return nightAirK(c, eye, rel, 1.); }
`,oe={bar:[.16,1],wash:[1.2,3.6]},_t=`
float bracketBar(float da, float dy){ return exp(-da * da / ${(oe.bar[0]*oe.bar[0]).toFixed(4)} - dy * dy / ${(oe.bar[1]*oe.bar[1]).toFixed(1)}); }
float bracketWash(float da, float dy){ return exp(-da * da / ${(oe.wash[0]*oe.wash[0]).toFixed(2)} - dy * dy / ${(oe.wash[1]*oe.wash[1]).toFixed(2)}); }
`;function ve(e,n,r,c=oe.wash){let i=0,p=0;for(let u=-e/2+.025;u<e/2;u+=.05)for(let l=.025;l<r;l+=.05)i+=Math.exp(-u*u/(c[0]*c[0])-(l-n)*(l-n)/(c[1]*c[1])),p++;return i/p}const Je={wide:1/6,long:2/3,soft:1/6},Z={pitch:24,rib:2,province:350,swing:.5,out:1/16,face:1/4,halo:1/5,reach:36,light:[.82,.9,1],power:4.2,blue:[.1,.13,.24]},re=(()=>{const e=Z.pitch-Z.rib,n=e*Je.wide/2,r=e*Je.long/2,c=e*Je.soft,i=Z.pitch*Z.pitch,p=(.3+.7*.15)*(1-Z.out);let u=0,l=0;for(let h=-Z.pitch/2+.125;h<Z.pitch/2;h+=.25)for(let m=-Z.pitch/2+.125;m<Z.pitch/2;m+=.25){if(l++,Math.abs(h)>e/2||Math.abs(m)>e/2)continue;const s=Math.max(Math.abs(h)-r,0),d=Math.max(Math.abs(m)-n,0),o=Math.min(Math.max((r-Math.abs(h))/c+.5,0),1);u+=Math.exp(-(s*s+d*d)/Z.reach)*(1-(Math.abs(m)<n?o*o*(3-2*o):0))}u/=l;const f=h=>.2126*h[0]+.7152*h[1]+.0722*h[2],a=Z.halo*Z.face*Z.power*f(Z.light)/f(Z.blue);return{hw:n,hl:r,hc:e/2,soft:c,face:Z.face,glow:a,shape:u,cov:4*n*r/i*p,mean:u*p}})();function wo(e){const n=ae(se("fww-sky:"+e));return{value:new k.Vector4(n.range(0,64),n.range(0,64),n.range(0,64),n.range(0,64))}}const yt=`
const vec3 SLAB_NEAR = ${Pe(.078,.102,.235)}, SLAB_FAR = ${Pe(.11,.145,.33)}, SLAB_LIGHT = vec3(${Z.light.map(e=>e.toFixed(2)).join(", ")}) * ${Z.power.toFixed(1)}, SLAB_BLUE = vec3(${Z.blue.map(e=>e.toFixed(2)).join(", ")});
uniform vec4 uSky;
// (how much of a stretch a long, about d, lies within r of nought)
float slabBox(float d, float r, float a){ return clamp((min(r, d + .5 * a) - max(-r, d - .5 * a)) / a, 0., 1.); }
// ONE BAR OF A WEAVE: how much of a pixel its face fills. q: the place from the bar's middle (along it, across it);
// hb: its half length and half breadth; a: the pixel's reach along it (its end's fade reckoned in) and across it;
// sm: 0 where the pixel is small beside the fade (the end then fades as a soft curve), 1 where it is not
float weaveBar(vec2 q, vec2 hb, vec2 a, float sm){
  float t = slabBox(q.x, hb.x, a.x);
  return mix(t * t * (3. - 2. * t), t, sm) * slabBox(q.y, hb.y, a.y);
}
float slabGain(vec2 p){ return .5 + exp(-length(p - vec2(${w.CORE.x.toFixed(1)}, ${w.CORE.z.toFixed(1)})) / 700.); }
// (a draw between 0 and 1 for a cell of the plan: the common sine hash's form, numbers of our own, a cosine added)
float skyDraw(vec2 c){ return fract(sin(dot(c, vec2(31.417, 47.853))) * 19417.2713 + cos(dot(c, vec2(23.911, 61.337))) * 6143.719); }
// (the provinces: the field's four draws about a place, eased between; pushed a little toward its two ends, which
// keeps its mean)
float slabProv(vec2 p){
  vec2 g = p / ${Z.province.toFixed(1)} + uSky.xy, i = floor(g), f = g - i;
  f = f * f * (3. - 2. * f);
  float n = mix(mix(skyDraw(i), skyDraw(i + vec2(1., 0.)), f.x), mix(skyDraw(i + vec2(0., 1.)), skyDraw(i + vec2(1., 1.)), f.x), f.y);
  return 1. + ${Z.swing.toFixed(2)} * (2. * smoothstep(.2, .8, n) - 1.);
}
vec2 slabLights(vec2 p, vec2 dx, vec2 dy){
  bool yl = dot(dy, dy) > dot(dx, dx);
  vec2 mj = yl ? dy : dx, mn = yl ? dx : dy;
  float L = max(length(mj), .02);
  vec2 u = mj / L, w = vec2(-u.y, u.x);
  float W = max(abs(dot(mn, w)), .02), pitch = L / 6.;
  // (one of the six boxes, laid along the plan's two ways: its reach along x and along z; with a bar's end's fade)
  const float SOFT = ${re.soft.toFixed(4)};
  const vec2 HB = vec2(${re.hl.toFixed(4)}, ${re.hw.toFixed(4)});
  vec2 e = max(abs(u) * pitch + abs(w) * W, vec2(.02)), el = sqrt(e * e + SOFT * SOFT), sm = smoothstep(SOFT, 2. * SOFT, e);
  float far = max(smoothstep(8., 20., pitch), smoothstep(8., 20., W)), sum = 0., glow = 0.;
  // (the glow's pattern goes to its coffer's own mean: from a box half as long as the glow's fall to one of half a panel)
  float gFar = smoothstep(${(Math.sqrt(Z.reach)/2).toFixed(1)}, ${(Z.pitch/2).toFixed(1)}, max(e.x, e.y));
  for (int i = 0; i < 6; i++) {
    vec2 s = p + u * (float(i) - 2.5) * pitch, ci = floor(s / ${Z.pitch.toFixed(1)}), c = (ci + .5) * ${Z.pitch.toFixed(1)}, r = s - c;
    float b = (.3 + .7 * waveHump(c.x + c.y)) * slabGain(c) * step(${Z.out.toFixed(4)}, skyDraw(ci + uSky.zw));
    bool ax = mod(ci.x + ci.y, 2.) < .5;
    vec2 q = ax ? r : r.yx, dq = max(abs(q) - HB, 0.);
    float face = weaveBar(q, HB, ax ? vec2(el.x, e.y) : vec2(el.y, e.x), ax ? sm.x : sm.y);
    sum += b * face;
    // (the glow: by the metres from the bar, on the coffer's clear face between its ribs, none on the bar's own face)
    float about = exp(-dot(dq, dq) / ${Z.reach.toFixed(1)}) * (1. - face) * slabBox(r.x, ${re.hc.toFixed(1)}, e.x) * slabBox(r.y, ${re.hc.toFixed(1)}, e.y);
    glow += b * mix(about, ${re.shape.toFixed(5)}, gFar);
  }
  // (THE ONE COUNTED MEAN: a bar's face is ${(4*re.hw*re.hl).toFixed(1)} m2 of a panel of ${(Z.pitch*Z.pitch).toFixed(0)} m2; a bar's own mean light is .3 + .7 x .15
  // = .405 of its crest (the wave's mean is .15); one in sixteen is out: so a far pixel takes ${re.cov.toFixed(5)} of a bar's
  // face light at its crest and ${re.mean.toFixed(5)} of the glow at a bar's edge, times the gain of the place and its province)
  return slabProv(p) * mix(vec2(${re.face.toFixed(4)} * sum, ${re.glow.toFixed(4)} * glow) / 6., vec2(${(re.face*re.cov).toFixed(6)}, ${(re.glow*re.mean).toFixed(6)}) * slabGain(p), far);
}
`,gt=`
uniform vec3 uAfter;
float hoursAt(vec2 m, float h){
  vec2 r = m - vec2(${w.OC.x.toFixed(1)}, ${w.OC.z.toFixed(1)});
  float d = abs(mod(atan(r.y, r.x) - uAfter.x - uAfter.y * (uTime - 4. * h) + 3.14159265, 6.2831853) - 3.14159265);
  return smoothstep(uAfter.z - .006, uAfter.z + .006, d);
}
`,Ue=`
uniform sampler2D tMaze;
uniform vec2 uOrg;
uniform vec3 uPal[8];
// (a draw between 0 and 1 from a place's two numbers: our own, a sine and a cosine of two weighted sums)
float h21(vec2 p){ return fract(sin(dot(p, vec2(27.619, 57.583))) * 24634.6345 + cos(dot(p, vec2(41.233, 13.171))) * 7919.137); }
float sdBox(vec2 p, vec2 c, vec2 h){ vec2 d = abs(p - c) - h; return max(d.x, d.y); }
// THE CORE stands at:
const vec2 CORE = vec2(${w.CORE.x.toFixed(1)}, ${w.CORE.z.toFixed(1)});
// how much of a pixel's reach a across x the strip from A to B takes
float seg(float x, float A, float B, float a){ return clamp((min(B, x + .5 * a) - max(A, x - .5 * a)) / a, 0., 1.); }
ivec4 cellAt(ivec2 i){ return ivec4(texelFetch(tMaze, i, 0) * 255. + .5); }
// THE WALLS' TOPS NEAR THE LINE ARE 0.6 m WIDE (round six), so that the eye looks into the rooms and not onto their
// walls: gHw is half the width of a wall's top at the place asked (0.3 within 150 m of the last leg's plan, 0.6 from
// 190 m on); a room's floor runs on to the foot of its thinner wall
float gHw = .6;
const vec2 WAY[11] = vec2[11](${io().map(e=>{const n=fe(e);return"vec2("+n[0].toFixed(1)+", "+n[1].toFixed(1)+")"}).join(", ")});
float wayD(vec2 p){
  float d = 1e9;
  for (int i = 0; i < 10; i++) { vec2 a = WAY[i], b = WAY[i + 1] - a; d = min(d, length(p - a - b * clamp(dot(p - a, b) / dot(b, b), 0., 1.))); }
  return d;
}
// (round eleven) half the breadth of the band along the west line of the cell c (the line's number is c.x) beside the
// cell's own row, and along its north line: 13 m where the line is an avenue there, else 4.7 (the plan's own list
// of the stretches that give way: see AVE_OFF)
float hbW(vec2 c){ return abs(mod(c.x, 4.) - 1.) < .5${it.filter(e=>e[0]===0).map(e=>` && !(abs(c.x - ${e[1]}.) < .5 && c.y > ${e[2]-.5} && c.y < ${e[3]+.5})`).join("")} ? 13. : 4.7; }
float hbN(vec2 c){ return abs(mod(c.y, 4.) - 1.) < .5${it.filter(e=>e[0]===1).map(e=>` && !(abs(c.y - ${e[1]}.) < .5 && c.x > ${e[2]-.5} && c.x < ${e[3]+.5})`).join("")} ? 13. : 4.7; }
// (set by mazeRoom: 1 where the room found is an avenue's street or one of its crossings)
float gAve = 0.;
// the room a place lies in (on a wall: the room beside it): lo and hi its floor's rectangle, open its four sides that
// have no wall (-x, +x, -z, +z), id its number (xy), its kind (z: 0 room, 1 hall, 2 corridor running north-south,
// 3 east-west) and its district (w); pd the metres to the middle of a node's corner post (9 where there is none)
void mazeRoom(vec2 p, out vec2 lo, out vec2 hi, out vec4 open, out vec4 id, out vec2 pd){
  vec2 g = (p - uOrg) / 26., ni = clamp(floor(g + .5), 2., 253.), u = (g - ni) * 26., au = abs(u), s = step(0., u);
  ivec2 n = ivec2(ni);
  ivec4 c11 = cellAt(n), c01 = cellAt(n - ivec2(1, 0)), c10 = cellAt(n - ivec2(0, 1)), c00 = cellAt(n - ivec2(1, 1));
  vec2 nodeP = uOrg + ni * 26., ci = ni - 1. + s, O = uOrg + ci * 26.;
  ivec4 c = u.x >= 0. ? (u.y >= 0. ? c11 : c10) : (u.y >= 0. ? c01 : c00);
  // THE BANDS' BREADTHS HERE (round eleven): hs, half the breadth of the stretch of each line that runs beside the
  // place; hn, the node's own half extents: the broader of the two stretches of each line that meet at it. A place
  // lies in the node, in the band of the north-south line (bandZ), in that of the east-west line (bandX), or in the
  // block between the bands.
  vec2 hs = vec2(hbW(vec2(ni.x, ci.y)), hbN(vec2(ci.x, ni.y)));
  vec2 hn = max(hs, vec2(hbW(vec2(ni.x, ni.y - s.y)), hbN(vec2(ni.x - s.x, ni.y))));
  bool nodeR = au.x <= hn.x && au.y <= hn.y, bandZ = !nodeR && au.y > hn.y && au.x <= hs.x, bandX = !nodeR && au.x > hn.x && au.y <= hs.y, hall;
  open = vec4(0.); pd = vec2(9.); gAve = 0.;
  // a hall's cleared lines and inner nodes are its floor
  ivec4 hc = c; vec2 hci = ci;
  if (bandZ) { if (u.y >= 0.) hc = c11; else hc = c10; hci = vec2(ni.x, ci.y); hall = (hc.a & 1) != 0; }
  else if (bandX) { if (u.x >= 0.) hc = c11; else hc = c01; hci = vec2(ci.x, ni.y); hall = (hc.a & 2) != 0; }
  else if (nodeR) { hc = c11; hci = ni; hall = (hc.a & 3) == 3; }
  else hall = (c.r & 128) != 0;
  float tn = float(c.b & 7);
  if (hall) {
    bool crt = (hc.a & 128) != 0;
    lo = uOrg + (hci - vec2(float(((hc.a >> 2) & 3) + (crt ? 4 * ((hc.a >> 5) & 1) : 0)), float(((hc.a >> 4) & 1) + 2 * ((hc.a >> 6) & 1)))) * 26. + 4.7;
    hi = lo + (crt ? vec2(8., 3.) : vec2(float(2 + ((hc.a >> 5) & 1)), 2.)) * 26. - 9.4;
    // (a hall is of one district: that of its own first cell)
    id = vec4(float(hc.g), 311., 1., float(cellAt(ivec2((lo - uOrg) / 26.)).b & 7));
  } else if (bandZ) {
    bool on = u.y >= 0. ? (c11.r & 1) != 0 : (c10.r & 1) != 0;
    // (it runs from this node's edge to the next node's)
    float nf = ni.y + 2. * s.y - 1., hf = max(hbN(vec2(ni.x, nf)), hbN(vec2(ni.x - 1., nf)));
    float z0 = u.y >= 0. ? nodeP.y + hn.y : nodeP.y - 26. + hf, z1 = u.y >= 0. ? nodeP.y + 26. - hf : nodeP.y - hn.y, e = on ? 1.2 : 0.;
    lo = vec2(nodeP.x - hs.x + 2. * gHw, z0 - e); hi = vec2(nodeP.x + hs.x - 2. * gHw, z1 + e);
    if (on) open.zw = vec2(1.);
    id = vec4(ni * 5. + vec2(1.3, s.y + 2.1), on ? 2. : 0., tn);
    gAve = step(5., hs.x);
  } else if (bandX) {
    bool on = u.x >= 0. ? (c11.r & 2) != 0 : (c01.r & 2) != 0;
    float nf = ni.x + 2. * s.x - 1., hf = max(hbW(vec2(nf, ni.y)), hbW(vec2(nf, ni.y - 1.)));
    float x0 = u.x >= 0. ? nodeP.x + hn.x : nodeP.x - 26. + hf, x1 = u.x >= 0. ? nodeP.x + 26. - hf : nodeP.x - hn.x, e = on ? 1.2 : 0.;
    lo = vec2(x0 - e, nodeP.y - hs.y + 2. * gHw); hi = vec2(x1 + e, nodeP.y + hs.y - 2. * gHw);
    if (on) open.xy = vec2(1.);
    id = vec4(ni * 5. + vec2(s.x + 3.2, 1.7), on ? 3. : 0., tn);
    gAve = step(5., hs.y);
  } else if (nodeR) {
    bool on = (c11.r & 4) != 0;
    lo = nodeP - hn + 2. * gHw; hi = nodeP + hn - 2. * gHw;
    if (on) {
      // (a side stands open where the street that leaves it is as broad as the node's own side; a narrower one ends
      // at the node's wall)
      open = vec4(float((c01.r >> 1) & 1), float((c11.r >> 1) & 1), float(c10.r & 1), float(c11.r & 1))
        * step(vec4(hn.y, hn.y, hn.x, hn.x) - .1, vec4(hbN(vec2(ni.x - 1., ni.y)), hbN(ni), hbW(vec2(ni.x, ni.y - 1.)), hbW(ni)));
      lo -= 2. * gHw * open.xz; hi += 2. * gHw * open.yw;
    }
    // (a crossing is of the broader street's way)
    id = vec4(ni * 7. + .5, on ? (hn.y > hn.x + .1 ? 3. : 2.) : 0., tn);
    pd = abs(au - hn + gHw);
    gAve = step(5., max(hn.x, hn.y));
  } else {
    // THE BLOCK between the cell's four bands: 16.6 m square between four ordinary lines, 8.3 m where an avenue
    // runs along it (there it holds one room across)
    vec2 b0 = vec2(hbW(ci), hbN(ci)), bs = 26. - b0 - vec2(hbW(ci + vec2(1., 0.)), hbN(ci + vec2(0., 1.)));
    vec2 nn = min(vec2(float(((c.r >> 3) & 3) + 1), float(((c.r >> 5) & 3) + 1)), max(floor(bs / 5.5), 1.)), ts = bs / nn;
    vec2 ti = clamp(floor((p - O - b0) / ts), vec2(0.), nn - 1.);
    lo = O + b0 + ti * ts + gHw * step(.5, ti); hi = O + b0 + (ti + 1.) * ts - gHw * step(ti, nn - 1.5);
    id = vec4(ci * 3. + ti + float(c.g) * .37, 0., tn);
  }
}
// the garden court's canal at a place (see canalAt): metres from its middle line, metres along it from its head, the side
vec3 canalAt(vec2 p){
  vec2 A = vec2(${Ce.toFixed(2)}, ${Re.toFixed(2)}), dir = vec2(${Q.toFixed(5)}, ${X.toFixed(5)}), C = vec2(${Ee.toFixed(2)}, ${Qe.toFixed(2)});
  float u = dot(p - A, dir);
  if (u < 0.) { float ac = dot(p - A, vec2(-dir.y, dir.x)); return vec3(abs(ac), u + ${Y.head.toFixed(1)}, ac < 0. ? -1. : 1.); }
  if (p.x > C.x) return vec3(abs(p.y - ${w.STREET.z.toFixed(1)}), ${(Y.head+Y.arc).toFixed(2)} + p.x - C.x, p.y < ${w.STREET.z.toFixed(1)} ? -1. : 1.);
  vec2 r = p - C;
  float rl = length(r);
  return vec3(abs(rl - ${ne.toFixed(1)}), ${Y.head.toFixed(1)} + ${ne.toFixed(1)} * (${(Math.PI/2+me).toFixed(5)} - atan(r.y, r.x)), rl < ${ne.toFixed(1)} ? -1. : 1.);
}
// a wall 1.2 m thick whose middle lies d metres off, weighed by the pixel's own reach a across it
float band(float d, float a){ return clamp((.6 - d) / a + .5, 0., min(1., 1.2 / a)); }
// (the same for a wall whose top is 2 hw wide)
float band2(float d, float a, float hw){ return clamp((hw - d) / a + .5, 0., min(1., 2. * hw / a)); }
// A FLOOR'S COLOUR (round ten: BY DISTRICT, NOT BY THE ROOM'S OWN DRAW). Every room of a district has the district's
// one colour, DEEP AND CLEAR (turquoise, cobalt, coral, plum, a deeper turquoise, a deeper cobalt, warm white; NO
// YELLOW AND NO ORANGE FLOOR: the list's first colour is laid nowhere), in THREE NEAR TONES by the room's own draw
// (round eleven: nearer still: a shade deeper (x .86), as it is, a shade paler (an eighth of the pale)); one room
// in twenty is the district's accent: warm white (in a warm white district: turquoise). A hall has the paler tone.
// So the plain reads from the air as blocks of colour between lit streets. pat comes back as the room's own draw
// for its pattern.
vec3 distCol(int tn){ return uPal[tn == 1 ? 5 : tn == 2 ? 3 : tn == 3 ? 1 : tn == 4 ? 4 : tn == 5 ? 2 : tn == 6 ? 6 : 7]; }
// THE MEAN OF A DISTRICT'S ROOMS (counted, for the far field): the tones are x .86 on .33 of the rooms, x 1 on .37
// and seven parts of the colour to one of the pale (1, .97, .9) on .30; the accent on .05 of all. So of the colour
// itself .95 x (.33 x .86 + .37 + .30 x .875) = .8691, of the pale .95 x .30 x .125 = .0356, of the accent .05.
// A RUG lies in three rooms of five over .28 of the floor (see the sheet): in .36 of all rooms seven parts of the
// room's tone to three of the pale, in .24 the tone x .72: of a room's tone .832 + .1008 x .7 + .0672 x .72 = .951
// stays, and .1008 x .3 = .0302 of the pale comes in. Together: colour .8691 x .951 = .8265, pale .0356 x .951 +
// .0302 = .0641, accent .05 x .951 = .0476.
vec3 distMean(int tn){ return distCol(tn) * .8265 + vec3(1., .97, .9) * .0641 + uPal[7] * .0476; }
vec3 floorTone(vec4 id, out float pat){
  float h1 = h21(id.xy + 3.1), h2 = h21(id.xy + 17.3);
  pat = h21(id.xy + 29.9);
  int tn = int(id.w + .5);
  vec3 c = distCol(tn);
  bool hall = abs(id.z - 1.) < .5;
  c = hall || h1 >= .7 ? mix(c, vec3(1., .97, .9), .125) : h1 < .33 ? c * .86 : c;
  if (!hall && h2 < .05) c = tn == 7 ? uPal[1] : uPal[7];
  // (the garden court: pale stone; its own law lays its paths and its canal)
  if (hall && id.x > 254.5) c = uPal[7];
  return c;
}
`,qt=`
vec2 blvdOf(vec2 p){ vec2 r = p - vec2(${q.ox.toFixed(3)}, ${q.oz.toFixed(3)}); return vec2(dot(r, vec2(${Q.toFixed(5)}, ${X.toFixed(5)})), dot(r, vec2(${(-X).toFixed(5)}, ${Q.toFixed(5)}))); }
const vec3 BV_A = vec3(${q.a.s.toFixed(3)}, ${q.a.n.toFixed(3)}, ${q.a.r.toFixed(1)}), BV_B = vec3(${q.b.s.toFixed(3)}, ${q.b.n.toFixed(3)}, ${q.b.r.toFixed(1)});
float blvdD(vec2 sn){
  vec2 q = vec2(abs(sn.y) - ${q.hw.toFixed(1)}, BV_A.x - sn.x);
  return min(length(max(q, 0.)) + min(max(q.x, q.y), 0.), min(length(sn - BV_A.xy) - BV_A.z, length(sn - BV_B.xy) - BV_B.z));
}
`,Gt=`
vec3 mirrorLight(vec3 q, vec3 d, float rip){
  vec3 rr = normalize(vec3(d.x, max(-d.y, .02), d.z));
  float rh = max(length(rr.xz), 1e-4), tS = 96. / rr.y;
  vec2 ps = q.xz + rr.xz * tS + rr.xz / rh * 2.2 * rip;
  vec2 sl = slabLights(ps, dFdx(ps), dFdy(ps));
  vec3 skyL = mix(mix(SLAB_NEAR, SLAB_FAR, smoothstep(200., 3200., tS)) + SLAB_LIGHT * sl.x + SLAB_BLUE * sl.y, NIGHT_UP, 1. - exp(-tS / 5000.));
  float tHit = 1e9, hyT = 0., zT = 0., kT = -1.;
  vec2 rd = vec2(abs(rr.x) < 1e-4 ? 1e-4 : rr.x, abs(rr.z) < 1e-4 ? 1e-4 : rr.z);
  for (int k = 0; k < 17; k++) {
    if (uTow[k].z <= 0.) continue;
    vec2 o = uTow[k].xy - q.xz, ta = (o - uTow[k].z) / rd, tb = (o + uTow[k].z) / rd, t0 = min(ta, tb), t1 = max(ta, tb);
    float tn = max(t0.x, t0.y);
    if (tn > 0. && tn < min(t1.x, t1.y) && tn < tHit && rr.y * tn < uTow[k].w) { tHit = tn; hyT = rr.y * tn; kT = float(k); zT = q.z + rr.z * tn - uTow[k].y; }
  }
  if (tHit < 1e8) {
    // (a pile in the water: its plates dark, its storeys each lit in one of the floors' colours, the hero's warm;
    // tower B's great doorway a warm light at its foot)
    bool isB = abs(kT - 1.) < .5;
    float hyW = hyT * (1. + .025 * rip), hs = hyW - (isB ? ${(w.TOWB.door+2).toFixed(1)} : 8.), fl = floor(max(hs, 0.) / 10.);
    float fh = max(fwidth(hyW), .05), sw = fh + .8, st = hs - 10. * fl, plate = hs < 0. ? 0. : max(1. - smoothstep(2. - sw, 2. + sw, st), smoothstep(10. - sw, 10., st));
    vec3 sc = isB ? uStoB[int(clamp(hs < 0. ? 0. : fl + 1., 0., 9.))] : kT < .5 ? (mod(fl, 2.) < .5 ? uPal[7] : vec3(.95, .86, .68)) : uPal[1 + int(h21(vec2(fl, kT)) * 5.999)];
    vec3 pile = mix(lit3(mix(sc, vec3(1.), .2) * .84), lit3(vec3(.2, .26, .5)), max(plate, .84 + .08 * step(.7, fract(zT / 5.))));
    float door = isB && abs(zT) < ${(w.TOWB.door/2).toFixed(1)} && hyW < ${w.TOWB.door.toFixed(1)} ? 1. : 0.;
    pile = mix(pile, vec3(1., .86, .62) * 1.05, door);
    skyL = mix(pile, skyL, 1. - exp(-tHit / 2500.));
  }
  return mix(lit3(vec3(.055, .08, .21)), skyL, .5 + .5 * pow(max(1. - rr.y, 0.), 3.)) * (1. + .06 * rip);
}
`,jt=`
varying vec3 vW;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,bt=".204",Et=".217",At=".579",ye=(()=>{const e=w.H1,n=w.H2,r=w.CON,c=w.STREET,i=w.FORE,p=w.LOBBY;return{halls:[[e.x0,e.z0,e.x1,e.z1],[n.x0,n.z0,n.x1,n.z1],[-75,n.z1,-61,w.LINK_Z],[r.x0,r.z-r.w/2,r.x1,r.z+r.w/2],[c.x0,c.z-c.w/2,i.x0,c.z+c.w/2],[i.x0,c.z-i.hw,c.x1+4,c.z+i.hw]],bands:[[1.2,1.2,1.2,1.2],[1.2,1.2,1.2,1.2],[9.6,9.6,9.6,9.6],[9.6,9.6,9.6,9.6],[0,9.6,0,9.6],[0,9.6,0,9.6]],roofed:[[-83.3,e.z1+1.2,-39.3,p.z0-1.2],[p.x0-1.2,p.z0-1.2,-39.3,p.glassS+1.2],[p.x0-1.2,p.glassS+1.2,p.x1+1.2,p.z1+1.2]]}})(),Ut=ye.halls.map((e,n)=>[e[0]-ye.bands[n][0],e[1]-ye.bands[n][1],e[2]+ye.bands[n][2],e[3]+ye.bands[n][3]]).concat(ye.roofed),uo=(e,n,r=0)=>Ut.some(c=>e>c[0]-r&&e<c[2]+r&&n>c[1]-r&&n<c[3]+r),zt=e=>"vec4("+e.map(n=>n.toFixed(1)).join(", ")+")",yo=`
varying vec3 vW;
uniform mat4 projectionMatrix;
const vec2 STACK = vec2(${w.SHAFT.x.toFixed(1)}, ${w.SHAFT.z.toFixed(1)});
uniform vec3 uFog; uniform float uFogK; uniform vec4 uTow[17]; uniform vec3 uStoB[10];
${ue}${Me}${Te}${yt}${Ue}${gt}${qt}${Gt}${_t}
// (BUILT's lists) the flown halls as they stand in the maze (x0, z0, x1, z1); the wall round each, by its side; what
// lies under a roof beside the flown line's first stretch
const vec4 HOLES[6] = vec4[6](${ye.halls.map(zt).join(", ")});
const vec4 BANDS[6] = vec4[6](${ye.bands.map(zt).join(", ")});
const vec4 ROOFED[3] = vec4[3](${ye.roofed.map(zt).join(", ")});
// the rooms behind the doors of an open street along x from x0 to x1 about z0, hw its half width (the world builds
// them: 9 m square, a door every 14 m, the south wall's from 6 m on, the north wall's from 9.5 m): true where p lies
// in the street's two bands of rooms; lo, hi the room there, solid where the wall's top is whole
bool streetRooms(vec2 p, float x0, float x1, float z0, float hw, out vec2 lo, out vec2 hi, out vec4 id, out float solid){
  float dz = p.y - z0;
  solid = 0.;
  if (abs(dz) <= hw || abs(dz) >= hw + 9.6 || p.x <= x0 || p.x >= x1) return false;
  float sd = sign(dz), d0 = sd > 0. ? 6. : 9.5, qc = d0 + 14. * floor((p.x - x0 - d0) / 14. + .5);
  lo = vec2(x0 + qc - 4.5, sd > 0. ? z0 + hw + .35 : z0 - hw - 9.35); hi = lo + 9.;
  id = vec4(qc + x0, 9. + sd, 0., 0.);
  vec2 o2 = max(lo - p, p - hi);
  if (qc < 0. || qc > x1 - 1.4 - x0 - 9. || max(o2.x, o2.y) > .6) solid = 1.;
  return true;
}
void main(){
  vec2 p = vW.xz, a = max(abs(dFdx(p)) + abs(dFdy(p)), vec2(.02));
  float fw = max(a.x, a.y), cov = 0., hole = 0.;
  vec2 lo, hi, pd; vec4 open, id;
  gHw = mix(.3, .6, smoothstep(150., 190., wayD(p)));
  mazeRoom(p, lo, hi, open, id, pd);
  float aveP = gAve;
  // a wall 1.2 m thick stands round each flown hall; a room that would run on under it ends at it
  for (int k = 0; k < 6; k++) {
    vec4 h = HOLES[k], w = h + vec4(-1., -1., 1., 1.) * BANDS[k];
    bool inX = p.x > w.x && p.x < w.z, inZ = p.y > w.y && p.y < w.w;
    if (p.x > h.x && p.x < h.z && p.y > h.y && p.y < h.w) hole = 1.;
    if (inX && inZ) cov = 1.;
    else if (inZ) {
      if (p.x <= w.x) { if (hi.x > w.x + .05) { hi.x = w.x; open.y = 0.; } }
      else if (lo.x < w.z - .05) { lo.x = w.z; open.x = 0.; }
    } else if (lo.x < w.z - .05 && hi.x > w.x + .05) {
      if (p.y <= w.y) { if (hi.y > w.y + .05) { hi.y = w.y; open.w = 0.; } }
      else if (lo.y < w.w - .05) { lo.y = w.w; open.z = 0.; }
    }
  }
  // THE CORRIDOR WE CAME DOWN and its two arms, with the rooms behind their doors: all of it lies under a roof (round
  // six: what has a ceiling from below has a roof from above); a room of the maze that would run on under it ends at it
  // (round eight: THE HALL BESIDE THE CORRIDOR, beyond its glass, lies under the same roof: from z 23.2 north the
  // roof's east edge stands at x -39.3; the corridor has one arm, to the west)
  // (round eleven: three rectangles lie under roofs: the corridor with its rooms and the court's north part; THE
  // LOBBY with the court beside it; the lobby's south end. The arm and the run behind the entry are gone.)
  float roofed = 0.;
  for (int k = 0; k < 3; k++) {
    vec4 w = ROOFED[k];
    bool inX = p.x > w.x && p.x < w.z, inZ = p.y > w.y && p.y < w.w;
    if (inX && inZ) roofed = 1.;
    else if (inZ) {
      if (p.x <= w.x) { if (hi.x > w.x + .05) { hi.x = w.x; open.y = 0.; } }
      else if (lo.x < w.z - .05) { lo.x = w.z; open.x = 0.; }
    } else if (lo.x < w.z - .05 && hi.x > w.x + .05) {
      if (p.y <= w.y) { if (hi.y > w.y + .05) { hi.y = w.y; open.w = 0.; } }
      else if (lo.y < w.w - .05) { lo.y = w.w; open.z = 0.; }
    }
  }
  // (round nine: THE COURT BESIDE THE CORRIDOR, beyond its glass, is open to the great hall: the sheet has a hole over
  // it (the world draws its floor, its range and what stands in it); a band of wall top stands round it)
  if (p.x > -63.3 && p.x < -40.5 && p.y > -78.2 && p.y < 22.) { roofed = 0.; hole = 1.; }
  // THE ROOMS BEHIND THE CONCOURSE'S AND THE STREET'S DOORS stand open too: the sheet opens over each and is the
  // wall's top between
  float solid = 0.;
  vec2 rlo, rhi; vec4 rid; float rsolid;
  if (streetRooms(p, 42., ${w.CON.x1.toFixed(1)}, -262., 7., rlo, rhi, rid, rsolid) || streetRooms(p, ${w.STREET.x0.toFixed(1)}, ${w.FORE.x0.toFixed(1)}, ${w.STREET.z.toFixed(1)}, ${(w.STREET.w/2).toFixed(1)}, rlo, rhi, rid, rsolid)
    || streetRooms(p, ${w.FORE.x0.toFixed(1)}, ${w.STREET.x1.toFixed(1)}, ${w.STREET.z.toFixed(1)}, ${w.FORE.hw.toFixed(1)}, rlo, rhi, rid, rsolid)) {
    open = vec4(0.); pd = vec2(9.); cov = 0.;
    lo = rlo; hi = rhi; id = rid; solid = rsolid;
  }
  // THE TOWERS (x, z, half the width of the foot, the height): a white wall stands round each square foot; within it
  // the sheet is open
  // (round ten) ROUND EVERY TOWER'S FOOT LIES A TERRACE at the height of the walls' tops, 10 m and a seventh of the
  // foot's half width broad (the core's: 17 m; not round tower B, whose forecourt is its own, nor round the well's
  // own building): pale stone in slabs of 3 m, a pale kerb at its edge, a row of lights set flush in it 1.5 m in
  // from the kerb, one to every 9 m. THE TOWER'S FOOT IS SEEN ON IT, in its pool of light.
  float apron = 0., apE = 0., apAl = 0.;
  for (int k = 0; k < 17; k++) {
    vec2 r2 = abs(p - uTow[k].xy);
    float rt = max(r2.x, r2.y), ap = 10. + .14 * uTow[k].z;
    if (rt < uTow[k].z + 1.2) cov = 1.;
    if (rt < uTow[k].z - .4) hole = 1.;
    if (k != 1 && uTow[k].z > 0. && rt < uTow[k].z + ap && distance(uTow[k].xy, STACK) > 1.) { apron = 1.; cov = 1.; apE = uTow[k].z + ap - rt; apAl = r2.x > r2.y ? p.y - uTow[k].y : p.x - uTow[k].x; }
  }
  // (the core's and tower B's great doorways, each with its room, 16 and 24 m wide and 12 m deep: open down to the floor)
  if (abs(p.y - CORE.y) < 8. && p.x > CORE.x - 52. && p.x < CORE.x - 38.) hole = 1.;
  if (abs(p.y - ${w.TOWB.z.toFixed(1)}) < ${(w.TOWB.door/2).toFixed(1)} && p.x > ${(w.TOWB.x-w.TOWB.r-2).toFixed(1)} && p.x < ${(w.TOWB.x-w.TOWB.r+12).toFixed(1)}) hole = 1.;
  // THE BOULEVARD (round eleven: see BLVD). WITHIN IT THE SHEET STANDS OPEN: the paving, the walls, the pools, the
  // trees and the standards there are built bodies. A ray that passes THE GATE in the garden court's north wall
  // before it comes down is the court's: the court's own law draws it. ROUND THE BOULEVARD, 12 m broad, THE ROOMS
  // LIE UNDER GLASS ROOFS (not over an avenue's street, which runs on under the open hall).
  vec3 d = normalize(vW - cameraPosition);
  vec2 sn = blvdOf(p);
  float bd = blvdD(sn), lid = 0.;
  bool thru = false;
  if (p.y < ${q.zc.toFixed(1)}) {
    if (bd < 0.) {
      float tc = (${q.zc.toFixed(1)} - p.y) / max(d.z, 1e-4);
      vec2 pg = p + d.xz * tc;
      if (d.z > 0. && tc < 6.9 / max(-d.y, .002) && blvdD(blvdOf(vec2(pg.x, ${(q.zc-.01).toFixed(2)}))) < 0.) {
        thru = true;
        mazeRoom(vec2(clamp(pg.x, ${(Y.x0+1).toFixed(1)}, ${(Y.x1-1).toFixed(1)}), ${(q.zc+1).toFixed(1)}), lo, hi, open, id, pd);
        aveP = 0.;
      } else hole = 1.;
    } else if (bd < ${q.lid.toFixed(1)} && aveP < .5) lid = 1.;
  }
  // the walls' tops (hard: what is whole at any distance: the bands round the flown halls, the roofs, the towers' feet
  // and terraces)
  float hard = cov;
  vec2 dw = vec2(min(p.x - lo.x + 99. * open.x, hi.x - p.x + 99. * open.y), min(p.y - lo.y + 99. * open.z, hi.y - p.y + 99. * open.w));
  cov = max(cov, max(band2(abs(dw.x + gHw), a.x, gHw), band2(abs(dw.y + gHw), a.y, gHw)));
  solid = max(solid, roofed);
  hard = max(hard, solid);
  cov = max(max(cov, solid), min(band2(pd.x, a.x, gHw), band2(pd.y, a.y, gHw)));
  // (through the gate the eye looks down into the court from over the boulevard: no wall's top stands there)
  if (thru) { cov = 0.; hard = 0.; }
  // down into the room along the eye's ray
  vec2 pc = thru ? p : clamp(p, lo, hi), dd = max(abs(d.xz), vec2(1e-4));
  float tf = 6.9 / max(-d.y, .002);
  vec2 tw = vec2(d.x > 0. ? hi.x - pc.x : pc.x - lo.x, d.z > 0. ? hi.y - pc.y : pc.y - lo.y) / dd;
  if ((d.x > 0. ? open.y : open.x) > .5) tw.x = 1e6;
  if ((d.z > 0. ? open.w : open.z) > .5) tw.y = 1e6;
  float t = min(tf, min(tw.x, tw.y));
  vec3 q = vec3(pc.x, 6.9, pc.y) + d * t;
  float kind = id.z, pat;
  vec3 fc = floorTone(id, pat);
  // THE LIGHT (round nine): NO SKY, NO KEY LIGHT, NO SHADE OF A SUN. LIGHT COMES ONLY FROM THINGS. Every roofless
  // room is A LIT TILE: its floor glows in its own clear colour under its lamps, the inner faces of its walls stand
  // pale in that light, brightest low down; the walls' tops between the rooms are deep blue, never black, with a
  // breath of the room beside them; the corridors are warm white ribbons, a row of beads of light running down
  // each by the lights' one law. IN EVERY ROOM STAND LIT WARM LAMPS, by one law that the furnishing reads too: a
  // room's lamps stand on its own lattice, one to each 9 m of its length and of its width, each 0.3 of its cell
  // from the west and 0.7 toward the south. AFTER HOURS (see hoursAt): in the sector the tiles are dark but for one
  // in nine: a deep blue that keeps a breath of their colour; the ribbons glow at a quarter, their beads run on.
  bool cor = kind > 1.5, court = id.x > 254.5 && abs(kind - 1.) < .5;
  // THE AVENUES (round ten; round eleven: STREETS, 26 m broad): every fourth line of the plan both ways (the lines
  // 4k + 1: the districts lie between them). A corridor on such a line is AN AVENUE: warm stone paving in slabs of
  // 3 m under warm light, its two walls' tops lit by it, a row of beads down its middle, a row of lamp standards
  // and trees down each side (see below). Every other corridor is A LANE: a pale cool blue at .6 of the light, its
  // beads small. So the plan reads from the air: lit streets between blocks of colour.
  float ave = cor ? aveP : 0.;
  float m = 1.;
  if (cor) {
    fc = mix(vec3(.6, .67, .88), vec3(.93, .84, .66), ave);
    vec2 jf = abs(fract(q.xz / 3.) - .5) * 3.;
    m = 1. - .12 * ave * smoothstep(1.43 - fw, 1.47, max(jf.x, jf.y)) * (1. - smoothstep(.25, 1.1, fw));
  } else {
    float big = kind > .5 ? 2.5 : 1.;
    // (round eleven: the patterns plainer: two nearer tones, a finer joint)
    if (pat < .24 || (kind > .5 && pat < .6)) {
      // chevrons of two near tones
      float v = abs(fract(q.x / (7.2 * big)) * 7.2 * big - 3.6 * big) + q.z, sw = min(fw / (1.3 * big), .5);
      m = mix(.92, 1.03, smoothstep(.5 - sw, .5 + sw, abs(fract(v / (2.6 * big)) - .5) * 2.));
    } else if (pat < .46 || kind > .5) {
      // tiles: a fine dark joint
      vec2 jf = abs(fract(q.xz / (2.2 * big)) - .5) * 2.2 * big;
      m = 1. - .12 * smoothstep(1.1 * big - .07 - fw, 1.1 * big - .03, max(jf.x, jf.y)) * (1. - smoothstep(.25, 1.1, fw));
    }
    // (round eleven) A RUG OF A SECOND TONE lies in three rooms of five (by the room's own draw) over the middle
    // of the floor (half its length by .56 of its width): in three of those five paler (three parts of the pale
    // to seven of the floor's tone), in two deeper (x .72)
    if (kind < .5) {
      float h3 = h21(id.xy + 83.9);
      vec2 sz = max(hi - lo, vec2(1.)), rq = abs(q.xz - (lo + hi) * .5), eR = vec2(max(fw, .05));
      float inR = (1. - smoothstep(.25 * sz.x - eR.x, .25 * sz.x + eR.x, rq.x)) * (1. - smoothstep(.28 * sz.y - eR.y, .28 * sz.y + eR.y, rq.y)) * step(h3, .6);
      fc = mix(fc, h3 < .36 ? mix(fc, vec3(1., .97, .9), .3) : fc * .72, inR);
    }
  }
  // the floor darkens a little toward the foot of each wall; a wall's inner face is brightest toward the floor
  vec2 e2 = min(q.xz - lo + 99. * open.xz, hi - q.xz + 99. * open.yw);
  float ao = 1. - .27 * exp(-max(min(e2.x, e2.y), 0.) / 1.1), hq = clamp(q.y / 6.9, 0., 1.);
  bool wallHit = t < tf - 1e-3;
  // the inner face met looks into its room
  vec2 nf = tw.x < tw.y ? vec2(-sign(d.x), 0.) : vec2(0., -sign(d.z));
  vec2 size = hi - lo;
  float near1 = 1. - smoothstep(1.2, 4., fw);
  // (how far the room is lit: by the hour, a tile by its own draw; one tile in nine stays lit in the sector; the
  // garden court is flown and always lit; a lit tile is a shade
  // brighter or deeper by its own draw; a ribbon after hours glows at a quarter)
  float hrs = cor ? hoursAt(q.xz, 0.) : max(hoursAt((lo + hi) * .5, h21(id.xy + 43.7)), step(h21(id.xy + 71.3), .111));
  if (abs(kind - 1.) < .5 && id.x > 254.5) hrs = 1.;
  float Lr = cor ? mix(.25, 1., hrs) : hrs * (.9 + .1 * h21(id.xy + 9.9));
  // (a lane stands at .6 of an avenue's light; A FEW ROOMS ARE DARK: three in a hundred, by the room's own draw)
  if (cor) Lr *= mix(.6, 1., ave); else if (kind < .5 && h21(id.xy + 57.1) < .03) Lr = 0.;
  vec3 LAMPW = vec3(1., .84, .56), WALLW = mix(vec3(.9, .9, .87), fc, cor ? .06 : .56), DARKF = mix(vec3(.05, .075, .21), fc, .16), DARKW = vec3(.075, .105, .27), emis = vec3(0.), linW = vec3(0.);
  float wm = 0.;
  vec3 col = mix(DARKF, fc * m * ao * .94, Lr);
  if (wallHit) {
    vec3 face = WALLW * (cor ? mix(.86, .5, hq) : mix(.8, .4, hq));
    // (near the eye a face shows its panel joints every 3.25 m and its skirting: no large face is one flat tone)
    float alw = tw.x < tw.y ? q.z : q.x, jd = abs(fract(alw / 3.25) - .5) * 3.25, jw = max(.6 * fw, .02);
    face *= (1. - .15 * clamp((.045 - jd) / jw + .5, 0., 1.) * clamp(.1 / jw, 0., 1.)) * (1. - .2 * (1. - smoothstep(.3, .36 + .5 * fw, q.y)) * clamp(.5 / jw, 0., 1.));
    col = mix(DARKW * mix(1.2, .9, hq), face, Lr);
  }
  // far off: the room's mean (more of its far wall the flatter the eye's way)
  float run = tf * length(d.xz), ext = dot(size, dd) / (dd.x + dd.y);
  float ff = clamp(1. - run / max(ext, 1.), 0., 1.);
  vec3 wallV = mix(DARKW, WALLW * (cor ? .68 : .6), Lr);
  vec3 fcM = mix(DARKF, fc * .85, Lr) + (cor ? vec3(0.) : LAMPW * .1 * Lr);
  col = mix(mix(mix(wallV, fcM, cor ? .1 : .3), fcM, ff), col, near1);
  if (cor) {
    // A CORRIDOR IS A RIBBON OF WARM WHITE LIGHT. Under a front of the lights' wave the whole of it stands brighter
    // (a broad pulse, seen from far), and DOWN ITS MIDDLE RUNS A ROW OF BEADS, one to every 6 m: each a round light
    // that swells as the front passes its own place: the beads run. A lamp stands on a bracket every 6 m at each
    // wall: a pool at the wall's foot, an upright wash of its light on the wall.
    vec2 mid = (lo + hi) * .5;
    // (ns: the walls here run north and south: by the face met, else by the corridor's own way)
    bool ns = wallHit ? tw.x < tw.y : kind < 2.5;
    float al = ns ? q.z : q.x, off = ns ? q.x - mid.x : q.z - mid.y, k6 = (floor(al / 6.) + .5) * 6., hwF = .5 * (ns ? size.x : size.y);
    float has = 1. - (ns ? (off < 0. ? open.x : open.y) : (off < 0. ? open.z : open.w));
    // (the wave over a ribbon: far off it settles to ITS OWN MEAN, .15: the hump is a squared sine over 30 % of the
    // phase: .5 x .3)
    float wv = mix(waveHump(q.x + q.z), .15, smoothstep(5., 16., fw));
    col = mix(col * (1. + .14 * wv), vec3(.95, .93, .86), .3 * wv * Lr * (wallHit ? 1. - .6 * hq : 1.));
    float beadK = mix(.4, 1., ave), lampR = mix(1.5, 2.25, ave);
    if (!wallHit) {
      vec2 bp = ns ? vec2(mid.x, k6) : vec2(k6, mid.y);
      float bw = waveHump(bp.x + bp.y), rb = max(.9, .8 * fw), db = length(q.xz - bp);
      col = mix(col, vec3(1., .97, .88), .75 * beadK * exp(-db * db / (rb * rb)) * min(.9 / rb, 1.) * (.45 + .55 * bw));
      emis += vec3(1., .94, .8) * 2.6 * beadK * exp(-db * db / .3) * (.35 + .65 * bw) * near1;
    }
    // (an avenue's lamps lay pools half as wide again)
    float rl = max(lampR, .8 * fw), da = al - k6, dw2 = hwF - abs(off), dy = q.y - 3.3;
    // (ON THE WALL: the bracket lamp's one law, a lane's and an avenue's alike: its upright soft bar and its wash, by
    // the metres from the lamp at every pixel's reach. FAR OFF EACH FADES TO ITS OWN MEAN over the wall of the
    // lamp's bay, 6 m long and 6.9 m high (counted: the wash's ${ve(6,3.3,6.9).toFixed(4)}, the bar's ${ve(6,3.3,6.9,oe.bar).toFixed(4)}), never to nought: the wash
    // from a pixel that reaches as far as the wash falls to either side (1.2 m) to one that reaches a whole bay; the
    // bar, 0.16 m broad and far under a pixel by then, over the reach at which the sheet lets every near thing go
    // (near1). ON THE FLOOR: the lamp's pool.)
    float g = has * Lr * (wallHit ? mix(bracketWash(da, dy), ${ve(6,3.3,6.9).toFixed(4)}, smoothstep(${oe.wash[0].toFixed(1)}, 6., fw)) : exp(-(da * da + dw2 * dw2) / (rl * rl)) * (lampR / rl));
    col = mix(col, LAMPW * .92, .5 * g) + LAMPW * .12 * g;
    emis += vec3(1., .8, .5) * 1.5 * has * Lr * (wallHit ? mix(${ve(6,3.3,6.9,oe.bar).toFixed(4)}, bracketBar(da, dy), near1) : 0.);
    if (ave > .5 && !wallHit) {
      // AN AVENUE IS A STREET (round eleven): down each side, 5.5 m in from its wall, A ROW OF LAMP STANDARDS, one to
      // every 13 m, each in a pool of warm light 4.2 m in reach, and between every two A TREE IN A ROUND BED 2.3 m
      // in radius (the sheet lays the pool, the standard's own light and the bed)
      float rowD = abs(abs(off) - (hwF - 5.5)), ds = al - (floor(al / 13.) + .5) * 13., dt = 6.5 - abs(ds);
      float d2s = ds * ds + rowD * rowD, rs = max(4.2, .8 * fw), gS = Lr * exp(-d2s / (rs * rs)) * (4.2 / rs) * (4.2 / rs);
      col = mix(col, LAMPW * .92, .45 * gS) + LAMPW * .1 * gS;
      emis += vec3(1., .84, .56) * 2.4 * exp(-d2s / .25) * near1 * Lr;
      float rt = max(2.3, .7 * fw), bed = (1. - smoothstep(rt - .3 - fw, rt + fw, length(vec2(dt, rowD)))) * (2.3 / rt) * (2.3 / rt);
      col = mix(col, mix(vec3(.07, .15, .1), vec3(.2, .4, .22), .5 * Lr), bed);
    }
    // THE DOORS OF THE ROOMS (round six): along a corridor each block has two doors in each wall (a quarter and
    // three quarters of the way down it; one in its middle where an avenue has narrowed the block to 8.3 m),
    // 3.6 m wide and 5 m high, each a leaf in the paler colour of its room's own floor. THE
    // LEAVES SLIDE IN THE DOORS' WAVE, each by its own place; as a leaf slides its room's light stands in the opening
    // and ITS COLOUR FALLS OUT ONTO THE CORRIDOR'S FLOOR. (Drawn where the eye is near enough to read a door.)
    if (fw < 1.2 && has > .5) {
      // (by the place met, not by the block the eye looks in through)
      float org = ns ? uOrg.y : uOrg.x, cl = floor((al - org) / 26.), sdD = off < 0. ? -1. : 1.;
      // (the block behind the wall lies between the bands of the two lines that cross the corridor there)
      float lnC = floor(((ns ? mid.x - uOrg.x : mid.y - uOrg.y)) / 26. + .5) + (sdD < 0. ? -1. : 0.);
      vec2 cB = ns ? vec2(lnC, cl) : vec2(cl, lnC);
      float hA = ns ? hbN(cB) : hbW(cB), hB = ns ? hbN(cB + vec2(0., 1.)) : hbW(cB + vec2(1., 0.)), b0 = org + cl * 26. + hA, bl = 26. - hA - hB;
      float dc = bl > 12. ? b0 + (al - b0 < .5 * bl ? .25 : .75) * bl : b0 + .5 * bl;
      vec2 pc2 = ns ? vec2(mid.x + sdD * (hwF + 2.7), dc) : vec2(dc, mid.y + sdD * (hwF + 2.7));
      vec2 lo2, hi2, pd2; vec4 op2, id2; float pat2;
      mazeRoom(pc2, lo2, hi2, op2, id2, pd2);
      vec3 rc = floorTone(id2, pat2);
      float o = doorOpen(pc2.x + pc2.y), fadeD = 1. - smoothstep(.4, 1.2, fw), da2 = al - dc, eD = max(fw, .04);
      if (wallHit) {
        float inD = (1. - smoothstep(1.8 - eD, 1.8 + eD, abs(da2))) * (1. - smoothstep(5. - eD, 5. + eD, q.y)) * fadeD;
        float gap = 1. - smoothstep(-eD, eD, da2 + 1.8 - 3.6 * o);
        col = mix(col, mix(mix(vec3(.9), rc, .55) * .8 * Lr, min(rc * 1.3 + .06, vec3(.95)), gap), inD);
        emis += rc * .4 * gap * inD * near1;
      } else if (!wallHit) {
        float acr = hwF - abs(off), hwD = 1.8 * o + .2 * acr;
        float poolD = o * (1. - smoothstep(hwD - eD, hwD + eD, abs(da2 + 1.8 - 1.8 * o))) * (1. - smoothstep(1.5, 5.5, acr)) * fadeD;
        col = mix(col, min(rc * 1.35 + .1, vec3(1.)), .75 * poolD);
      }
    }
  } else {
    vec2 nl = clamp(floor(size / 9. + .5), 1., 8.), cell = size / nl;
    vec2 li = clamp(floor((clamp(q.xz, lo, hi) - lo) / cell - vec2(.3, .7) + .5), vec2(0.), nl - 1.), lv = q.xz - lo - (li + vec2(.3, .7)) * cell;
    float rl = max(2.1, .8 * fw), l2 = dot(lv, lv), dy = q.y - 3.4;
    // (THE LAMPS ARE LIGHTS OF THE FLOOR, under the lights' one law: a lamp's pool rests small and swells to twice as
    // wide and full as a front of the wave passes its own place: fronts of warm light run through the rooms to the
    // horizon)
    vec2 lp = lo + (li + vec2(.3, .7)) * cell;
    float lw = waveHump(lp.x + lp.y);
    rl *= 1. + lw;
    // (THE GARDEN COURT, hall 255, has its own lamps: none of the lattice stands in it; after hours a room's lamps are out)
    float dry = court ? 0. : Lr;
    float g = dry * exp(-(l2 + (wallHit ? dy * dy * .5 : 0.)) / (rl * rl)) * min(1.5 / rl * (1. + lw), 1.) * (.6 + .4 * lw);
    col = mix(col, LAMPW * .92, .8 * g) + LAMPW * .18 * g;
    // (the lamp's own light: a bright warm point where it stands)
    emis = vec3(1., .8, .5) * (wallHit ? 0. : 2.4 * exp(-l2 / .3)) * near1 * dry;
    if (court && wallHit) {
      // THE COURT'S WALLS ARE NOT BLANK (round seven): a warm lamp on a bracket every 6.5 m, 3.6 m up, with its
      // light on the wall; between every two pairs of lamps a door 3.6 m wide and 5 m high, its leaf in the
      // paler colour of one of the floors
      // (the bracket lamp's one law: an upright soft bar, to 1/e 0.16 m broad and 1 m high either way, in a wash
      // that falls to 1/e 1.2 m to either side and 3.6 m up and down: it reaches the wall's foot. FAR OFF EACH FADES
      // TO ITS OWN MEAN over the wall of the lamp's bay, 6.5 m long and 6.9 m high (counted: the wash's ${ve(6.5,3.6,6.9).toFixed(4)}, the
      // bar's ${ve(6.5,3.6,6.9,oe.bar).toFixed(4)}), never to nought, as on a corridor's wall of this sheet: the wash from a pixel that reaches
      // as far as the wash falls to either side (1.2 m) to one that reaches a whole bay; the bar over the reach at
      // which the sheet lets every near thing go (near1))
      float alc = tw.x < tw.y ? q.z : q.x, dac = alc - (floor(alc / 6.5) + .5) * 6.5, dyc = q.y - 3.6;
      float glc = mix(bracketWash(dac, dyc), ${ve(6.5,3.6,6.9).toFixed(4)}, smoothstep(${oe.wash[0].toFixed(1)}, 6.5, fw));
      float dcc = floor(alc / 13. + .5) * 13., eD = max(fw, .04);
      float inD = (1. - smoothstep(1.8 - eD, 1.8 + eD, abs(alc - dcc))) * (1. - smoothstep(5. - eD, 5. + eD, q.y)) * (1. - smoothstep(.6, 1.6, fw));
      vec3 rcc = uPal[1 + int(h21(vec2(dcc, nf.x * 3. + nf.y * 7.)) * 5.999)];
      col = mix(vec3(.3, .36, .6) * mix(.8, 1., hq), mix(vec3(.9), rcc, .55) * .6, inD);
      col = mix(col, LAMPW * .92, .7 * glc) + LAMPW * .14 * glc;
      emis += vec3(1., .8, .5) * 1.5 * mix(${ve(6.5,3.6,6.9,oe.bar).toFixed(4)}, bracketBar(dac, dyc), near1);
      // (THE STREET'S MOUTH in the east wall, 18 m wide, open to the wall's top: the eye's ray goes on down the street)
      if (tw.x < tw.y && d.x > 0. && abs(q.z - ${w.STREET.z.toFixed(1)}) < ${(w.STREET.w/2).toFixed(1)}) hole = 1.;
      // (THE BOULEVARD'S GATE in the north wall, as broad as the boulevard: open to the wall's top)
      if (tw.y <= tw.x && d.z < 0. && blvdD(blvdOf(vec2(q.x, ${(q.zc-.01).toFixed(2)}))) < 0.) hole = 1.;
    }
    if (court && !wallHit) {
      // THE GARDEN COURT'S FLOOR (round nine: NO LAWN; a paved court in the night-like hall), by the canal's own
      // measure (n metres from its middle line, s along it from its head): THE CANAL, 12 m of dark water in a pale
      // stone kerb; STONE PAVING to the walls, tiles of 1.5 m that go round with the canal, deep blue between the
      // lamps; A POOL OF WARM LIGHT under every lamp standard (one to each 12 m of the canal on both sides, 9 m from
      // its middle; and one at every place of the court's own lattice of 26 m that lies 30 m or more from the
      // canal); A COLOURED PATH 3.2 m wide either side (turquoise on the left hand, plum on the right), a fine
      // line of light along each of its edges.
      vec3 cn = canalAt(q.xz);
      float n = cn.x, s = cn.y, eb = max(.6 * fw, .03);
      float dW = max(n - ${Y.hw.toFixed(1)}, max(-s, s - ${Y.len.toFixed(2)}));
      float water = 1. - smoothstep(-eb, eb, dW), inK = 1. - smoothstep(${Y.kerb.toFixed(1)} - eb, ${Y.kerb.toFixed(1)} + eb, dW);
      float pathM = 1. - smoothstep(1.6 - eb, 1.6 + eb, abs(n - 11.5));
      vec2 tj = (.5 - abs(fract(vec2(s, n) / 1.5) - .5)) * 1.5;
      float jw = max(fw, .03), jt = max(clamp((.03 - tj.x) / jw + .5, 0., 1.), clamp((.03 - tj.y) / jw + .5, 0., 1.)) * clamp(.06 / jw, 0., 1.);
      vec3 ca = vec3(.6, .62, .7) * (1. - .2 * jt);
      ca = mix(ca, cn.z < 0. ? uPal[1] : uPal[4], pathM);
      // (round eleven) INSIDE THE GATE THE BOULEVARD'S WARM STONE RUNS ON INTO THE COURT, as broad as the gate, and
      // gives way to the court's own stone over 26 m: no line is drawn across the paving under the gate
      vec2 gsn = blvdOf(q.xz);
      float apr = (1. - smoothstep(0., 26., q.z - (${q.zc.toFixed(1)}))) * (1. - smoothstep(${(q.hw-4).toFixed(1)}, ${q.hw.toFixed(1)}, abs(gsn.y)));
      ca = mix(ca, vec3(.74, .67, .55) * (1. - .16 * jt), apr);
      // (THE LIGHTS' WAVE PASSES OVER THE COURT, by place and the clock as everywhere on the floor: the standards'
      // pools swell under each front)
      float wvC = waveHump(q.x + q.z) * (1. - smoothstep(8., 30., fw));
      float sk = (floor(s / 12.) + .5) * 12., d2s = (s - sk) * (s - sk) + (n - 9.) * (n - 9.);
      float gp = step(0., s) * step(sk, ${(Y.len-2).toFixed(2)}) * (exp(-d2s / 10.) + .3 * exp(-d2s / 70.));
      vec2 lc0 = vec2(${Y.x0.toFixed(1)}, ${Y.z0.toFixed(1)}), ln = (floor((q.xz - lc0) / 26.) + .5) * 26. + lc0;
      float d2l = dot(q.xz - ln, q.xz - ln);
      gp += step(30., canalAt(ln).x) * (exp(-d2l / 10.) + .3 * exp(-d2l / 70.));
      gp = min(gp * (.8 + .4 * wvC), 1.);
      vec3 gl = ca * ao * (mix(vec3(.2, .26, .5), vec3(.3, .33, .5) + LAMPW * .3, apr) + LAMPW * 1.1 * gp);
      gl = mix(gl, vec3(.9, .93, 1.), .8 * (1. - smoothstep(.12 - eb, .12 + eb, abs(abs(n - 11.5) - 1.6))) * clamp(.24 / eb, 0., 1.));
      vec3 kerbC = (vec3(.5, .54, .68) + LAMPW * .3 * gp) * (1. - .22 * (1. - smoothstep(0., .15, dW)));
      // (round ten) THE CANAL'S EDGE GLOWS: a line of turquoise light under the kerb's lip all the way round the
      // water; its glow lies on the kerb and on the water beside it
      float edgeL = (1. - smoothstep(.09, .09 + 2. * eb, abs(dW + .05))) * clamp(.3 / eb, 0., 1.), edgeG = exp(-abs(dW) / 1.3);
      kerbC += vec3(.04, .46, .46) * edgeG;
      // THE WATER IS A DARK MIRROR: the eye's ray, turned at the water, meets a tower's pile of lit storeys (tower
      // B's doorway a warm light at its foot, the ring in it) or THE SLAB AND ITS WEAVE OF LIGHT. It is never quite
      // still: long low ripples go down the canal, each by its own place and the clock, and the lights tremble.
      float rip = (sin(s * 1.9 + n * .7 - uTime * .8) + sin(s * 1.1 - n * 1.3 + uTime * .6) + .6 * sin(s * 3.1 + n * 2.3 + uTime * 1.1)) * (1. - smoothstep(.25, 1.2, fw));
      linW = mirrorLight(q, d, rip) + vec3(.003, .06, .065) * edgeG * edgeG + vec3(.25, 1.25, 1.2) * edgeL;
      wm = water * inK * near1;
      gl = mix(gl, kerbC, inK);
      col = mix(col, gl, near1);
      emis = emis * (1. - inK) + vec3(.25, 1.25, 1.2) * edgeL * near1;
    }
  }
  // FAR OFF the rooms melt, level by level, and THE FIELD OF LIGHT KEEPS ITS BROAD COLOUR TO THE HORIZON (round nine:
  // what the plain is read by from the air is broad colour that does not fade). ROUND TEN: EVERY LEVEL IS THE MEAN OF
  // THE LEVEL BELOW IT, COUNTED: a cell of the plan (26 m) is one tile of light: its rooms' mean, its lanes' and its
  // walls' tops', each by its share of the cell; a district (104 m) is its cells' mean; and through all of it THE
  // AVENUES run as warm white ribbons to the horizon, the lights' wave pulsing along them. The sector that is after
  // hours lies in it as a deep blue wedge with single lit tiles and ribbons at a quarter.
  vec2 cg = (p - uOrg) / 26., ci2 = floor(cg), cf = (fract(cg) - .5) * 26., cc = (ci2 + .5) * 26. + uOrg;
  float c1 = h21(ci2 + 5.5), c2 = h21(ci2 + 31.7);
  int tnD = int(id.w + .5);
  float hc = max(hoursAt(cc, c1), step(h21(ci2 + 71.3), .111));
  // (a cell's lamps as one warm dab. Its own mean over the cell and the clock: .65 x .325 x .72 = .152 (the draw's
  // mean .3 + .7 x .5; the dab's own, pi x 70 / 676; the wave's, .6 + .8 x .15: a product of three that do not know
  // of one another, so the product of their means). Far off it settles to that mean: lampF goes to 1.)
  float dab = (.3 + .7 * c1) * exp(-dot(cf, cf) / 70.) * (.6 + .8 * waveHump(cc.x + cc.y));
  float lampF = mix(dab / .152, 1., smoothstep(30., 90., fw));
  // (a lit district's rooms: .97 of them lit (three in a hundred are dark), each at .9 to 1 of its light (mean
  // .95): .9215 lit, .0785 deep; a lit floor's own mean is .8475 of its colour (its pattern .98, the shade at the
  // walls' feet .92, the floor's level .94): .9215 x .8475 = .781 of the district's mean colour; its lamps' pools:
  // one lamp to about 90 m2 of room, its pool's reach about 9 m2 with the wave's fronts counted in: a tenth of warm
  // light on the lit share: .092. A lane's mean: its pale cool blue x .8475 x .6, and its lamps: (.31, .34, .45).)
  vec3 DEEP = vec3(.05, .075, .21), TOPF = vec3(.085, .115, .28), LANE = vec3(.31, .34, .45), dM = distMean(tnD);
  vec3 offT = ${At} * mix(DEEP, distCol(tnD), .16) + ${Et} * LANE * .25 + ${bt} * TOPF;
  vec3 cellT = mix(offT, ${At} * (DEEP * .0785 + dM * .781 * (.85 + .3 * c2) + LAMPW * .092 * lampF) + ${Et} * LANE + ${bt} * TOPF, hc);
  // (a district's own middle: the districts lie between the avenues, a cell on from the plan's own lines of four;
  // after hours one tile in nine stays lit: .111)
  vec2 dcc = (floor((cg - 1.) / 4.) + .5) * 104. + 26. + uOrg;
  vec3 distT = mix(offT, ${At} * (DEEP * .0785 + dM * .781 + LAMPW * .092) + ${Et} * LANE + ${bt} * TOPF, mix(.111, 1., hoursAt(dcc, .5)));
  vec3 field = mix(cellT, distT, smoothstep(22., 80., fw));
  // THE AVENUES FAR OFF: ribbons 26 m broad (the floor and its two lit walls' tops), one to every 104 m each way.
  // Each way's own mean, once a pixel reaches further than the plan's period: 26 / 104 = .25; both ways together (a
  // place lies on either): 1 - .75 x .75 = .4375. The ribbon's own tone is its near look's mean, summed over one
  // period of its length: its floor (.93, .84, .66) x .94 x .975 (the shade at the walls' feet); the beads (.007 of
  // it toward white); the walls' lamps (their pools .112 of it: .056 toward the lamps' light and .013 of it added);
  // the standards' pools (.35 of it: .157 toward the lamps' light and .035 of it added); the trees' beds (.095 of
  // it, deep green): (.84, .76, .57) on 23.6 of the 26 m, the lit tops (.72, .67, .56) on 2.4: (.829, .751, .57);
  // the wave over it by the near look's own law, at the wave's own mean (.15) from far. Toward the core the avenues
  // stand brighter (by .6 at its foot, falling over 300 m). A stretch that has given way (AVE_OFF) is no ribbon.
  vec2 av = abs(mod(p - uOrg - 26. + 52., 104.) - 52.), lnI = floor(cg + .5);
  vec2 avOn = step(5., vec2(hbW(vec2(lnI.x, ci2.y)), hbN(vec2(ci2.x, lnI.y))));
  vec2 avs = max(vec2(seg(av.x, -13., 13., a.x), seg(av.y, -13., 13., a.y)) * avOn, .25 * smoothstep(40., 104., a));
  float avc = 1. - (1. - avs.x) * (1. - avs.y), avw = mix(waveHump(p.x + p.y), .15, smoothstep(20., 60., fw));
  float toCore = 1. + .6 * exp(-length(p - CORE) / 300.);
  field = mix(field, mix(vec3(.829, .751, .57) * (1. + .14 * avw), vec3(.95, .93, .86), .3 * avw) * min(toCore, 1.25) * mix(.25, 1., hoursAt(p, 0.)), avc);
  float far = smoothstep(9., 28., fw);
  // the walls' tops: deep blue, never black, with a breath of the lit room beside them; along the edge of a top
  // that looks into a lit room a fine pale line (every form reads by a lit edge); an avenue's two tops stand in its
  // light
  float rim = (1. - smoothstep(.16, .22 + fw, max(-min(dw.x, dw.y), 0.))) * (1. - smoothstep(.4, 1.4, fw)) * (1. - solid);
  vec3 topC = mix(vec3(.085, .115, .28), fc * .5 + .1, .2 * Lr * (1. - solid));
  topC = mix(topC, WALLW * .72, rim * Lr);
  topC = mix(topC, vec3(.72, .67, .56), ave * Lr * (1. - solid));
  col = mix(mix(col, topC, cov), field, far);
  col = mix(col, TOPF, hard * far);
  emis *= 1. - cov;
  float barL = 0.;
  if (lid > .5 && apron < .5) {
    // THE GLASS ROOFS (round eleven): the rooms beneath are seen through the panes, a deep cool sheen over them; THE
    // BARS, 0.24 m broad, every 3 m both ways in the boulevard's own measure, pale in the light from below; along
    // the boulevard's edge A STONE COPING 0.9 m broad with A LINE OF WARM LIGHT behind it; a pale kerb at the
    // roofs' outer edge
    vec2 bj = 1.5 - abs(fract(sn / 3.) - .5) * 3.;
    float jw = max(fw, .03), bars = max(clamp((.12 - bj.x) / jw + .5, 0., 1.), clamp((.12 - bj.y) / jw + .5, 0., 1.)) * clamp(.24 / jw, 0., 1.);
    float cope = 1. - smoothstep(.9 - jw, .9 + jw, bd), kerbL = smoothstep(${(q.lid-.5).toFixed(1)} - jw, ${(q.lid-.5).toFixed(1)} + jw, bd) * clamp(.5 / jw, 0., 1.);
    float lineL = (1. - smoothstep(.14, .14 + jw, abs(bd - 1.15))) * clamp(.3 / jw, 0., 1.);
    col = mix(col, vec3(.26, .36, .64), .36 - .16 * far);
    col = mix(col, vec3(.8, .83, .9), max(bars * (1. - far), kerbL));
    col = mix(col, vec3(.8, .78, .74), cope);
    emis = emis * (1. - max(bars, cope)) + vec3(1., .84, .56) * 1.6 * lineL * near1;
    col = mix(col, vec3(.98, .86, .6), .8 * lineL);
    barL = max(max(bars, cope), lineL);
  }
  if (apron > .5) {
    // a tower's terrace (see above)
    vec2 tj = (.5 - abs(fract(p / 3.) - .5)) * 3.;
    float jt = max(clamp((.03 - tj.x) / a.x + .5, 0., 1.) * clamp(.06 / a.x, 0., 1.), clamp((.03 - tj.y) / a.y + .5, 0., 1.) * clamp(.06 / a.y, 0., 1.));
    float kerbA = (1. - smoothstep(.6 - fw, .6 + fw, apE)) * clamp(1.2 / fw, 0., 1.);
    float dl = (fract(apAl / 9.) - .5) * 9., d2 = dl * dl + (apE - 1.5) * (apE - 1.5), rg = max(1.6, .8 * fw);
    col = mix(vec3(.46, .5, .64) * (1. - .16 * jt), vec3(.8, .82, .9), kerbA);
    col = mix(col, LAMPW * .95, .6 * exp(-d2 / (rg * rg)) * min(1.6 / rg, 1.));
    emis = vec3(1., .86, .6) * 2.2 * exp(-d2 / .1) * near1;
  }
  // EVERY TOWER STANDS IN A POOL OF ITS OWN LIGHT (round nine): the ground round its foot, floors, walls and tops,
  // stands in a light that falls away over a few tens of metres: cool white; AT THE HERO AND AT TOWER B WARM (round
  // ten: the glow of their lit storeys and doorways spilling on the ground), and reaching half as far again
  vec3 tpc = vec3(0.);
  float tpk = 0.;
  for (int k = 0; k < 17; k++) {
    if (uTow[k].z <= 0.) continue;
    vec2 r2 = abs(p - uTow[k].xy) - uTow[k].z;
    float dT = max(max(r2.x, r2.y), 0.), eT = exp(-dT / (k < 2 ? 12. + .36 * uTow[k].z : 9. + .3 * uTow[k].z));
    tpc = max(tpc, (k < 2 ? vec3(.5, .4, .24) : vec3(.3, .36, .5)) * eT);
    tpk = max(tpk, eT);
  }
  // (on glass and on a terrace's own paving the pool lies at a part: neither bleaches)
  col = min(col + tpc * (1. - .6 * max(lid, apron)), max(col, vec3(.93)));
  // THE GREAT HALL'S AIR (round nine): see nightAir
  float dist = length(vW - cameraPosition);
  // (round eleven: the low sheet of haze lies behind a tower's terrace and its pool of light, never across them)
  col = nightAirK(mix(lit3(col) + emis, linW, wm * (1. - cov)), cameraPosition, vW - cameraPosition, 1. - max(apron, smoothstep(.25, .8, tpk)));
  gl_FragColor = vec4(col, 1.);
  // the depth of the place met, a little behind it (the floor hides nothing; what stands on it must show)
  vec3 dp = cov > .5 || barL > .5 ? vW : q + d * (.5 + .015 * dist);
  vec4 cp = projectionMatrix * viewMatrix * vec4(dp, 1.);
  gl_FragDepth = clamp(cp.z / max(cp.w, 1e-4) * .5 + .5, 0., 1.);
  if (hole > .5) discard;
}`,Ve=(e,n=1)=>{const r=new k.Color(e);return new k.Vector3(r.r*n,r.g*n,r.b*n)},lt=e=>new k.Vector3(parseInt(e.slice(1,3),16)/255,parseInt(e.slice(3,5),16)/255,parseInt(e.slice(5,7),16)/255),Ke=e=>{const n=Math.pow(Math.min(Math.max(e,0),.9),2.2),r=1-.983729*n,c=.0245786-.432951*n,i=90537e-9+.238081*n;return .663*(-c+Math.sqrt(Math.max(c*c+4*r*i,0)))/(2*r)},Ta=e=>{const n=lt(e);return new k.Vector3(Ke(n.x),Ke(n.y),Ke(n.z))},go=(e,n,r)=>new k.Vector3(Ke(e),Ke(n),Ke(r)),Mt={color:go(.38,.5,.92),k:1/1700},bo=["#f1c530","#18a8a4","#2a55c8","#ee6666","#84449a","#0e8e9e","#2342ae","#f3e6cc"];function Eo(e,n){const r=new k.DataTexture(n.data,n.N,n.N,k.RGBAFormat,k.UnsignedByteType);return r.magFilter=k.NearestFilter,r.minFilter=k.NearestFilter,r.generateMipmaps=!1,r.needsUpdate=!0,{uTime:{value:0},tMaze:{value:r},uOrg:{value:new k.Vector2(w.MAZE_X0,w.MAZE_Z0)},uPal:{value:bo.map(lt)},uFog:{value:Mt.color},uFogK:{value:Mt.k},uAfter:{value:(()=>{const c=ae(se("fww-after:"+e));return new k.Vector3(c.range(0,Math.PI*2),(c.chance(.5)?1:-1)*Math.PI*2/240,.8727)})()}}}function Ao(e){return new k.ShaderMaterial({uniforms:e,vertexShader:jt,fragmentShader:yo})}const zo=e=>6+.35*e,Mo=`
varying vec3 vW;
uniform vec4 uTow[17], uTop[17];
${ue}${Me}${Te}${yt}
// a band hw broad either side of the line x0, hanging under the slab: c1 the place on the slab across it, c0 where
// the eye's ray passed its soffit's level, aw the pixel's reach. x: how much of its soffit is seen; y: of a flank;
// z: the way that flank looks (-1 or 1)
vec3 beamAt(float c1, float c0, float x0, float hw, float aw){
  float e0 = c0 - x0, sgn = e0 > 0. ? 1. : -1., sof = clamp((hw - abs(e0)) / aw + .5, 0., 1.);
  return vec3(sof, clamp(-(c1 - x0 - sgn * hw) * sgn / aw + .5, 0., 1.) * (1. - sof), sgn);
}
// (the same for the bands along every line of the period pd: the soffit of the line nearest c0, the flank of the
// next band on the ray's way)
vec3 ribsAt(float c1, float c0, float pd, float hw, float aw){
  float k0 = floor(c0 / pd + .5) * pd, e0 = c0 - k0;
  float kc = c1 >= c0 ? (e0 > 0. ? k0 + pd : k0) : (e0 < 0. ? k0 - pd : k0);
  vec3 a = beamAt(c1, c0, k0, hw, aw), b = beamAt(c1, c0, kc, hw, aw);
  return vec3(a.x, b.y * (1. - a.x), b.z);
}
void main(){
  vec3 v = vW - cameraPosition;
  float dist = length(v);
  vec2 p = vW.xz, fp = max(abs(dFdx(p)) + abs(dFdy(p)), vec2(.02));
  vec2 sl = slabLights(p, dFdx(p), dFdy(p));
  vec3 base = mix(SLAB_NEAR, SLAB_FAR, smoothstep(200., 3200., dist)), col = base;
  // (the glow about the bars, on their coffers: the slab's blue)
  col += SLAB_BLUE * sl.y;
  // THE CAPITALS' RIMS (uTop: each great tower's last storey: its middle and its two half widths; a place of the list
  // that holds no great tower has widths under nought)
  float ring = 0.;
  vec3 rimC = vec3(0.);
  float er = max(max(fp.x, fp.y), .05);
  for (int k = 0; k < 17; k++) {
    if (uTop[k].z > 0.) {
      // (the capital's flare: see CAP_FLARE)
      float F = 6. + .35 * min(uTop[k].z, uTop[k].w);
      vec2 q = abs(p - uTop[k].xy) - uTop[k].zw - F;
      float dr = length(max(q, 0.)) + min(max(q.x, q.y), 0.), g = exp(-max(dr, 0.) / (7. + .4 * F));
      float line = clamp((.9 - abs(dr - .9)) / er + .5, 0., 1.) * clamp(1.8 / er, 0., 1.);
      rimC += (k == 0 ? vec3(1., .88, .66) : vec3(.8, .88, 1.)) * (.42 * g + 2.2 * line);
      ring = max(ring, g);
    }
  }
  // the bars' own faces: cool white (brighter about a capital)
  col += SLAB_LIGHT * sl.x * (1. + 1.2 * ring);
  // THE RIBS AND THE BEAMS
  vec2 vd = v.xz / max(v.y, .02), pr = p - vd * 1.2, pb = p - vd * 3., fr = fp + abs(vd) * .02;
  vec3 rx = ribsAt(p.x, pr.x, 24., 1., fr.x), rz = ribsAt(p.y, pr.y, 24., 1., fr.y);
  // (far off a pixel reaches over many ribs: their own mean: the soffits a twelfth each way, the flanks what the
  // slope of the eye's ray lays bare of them, at most the coffer's own breadth)
  vec2 farR = smoothstep(6., 16., fr), slope = min(abs(vd) * 1.2, vec2(22.)) / 24.;
  rx = mix(rx, vec3(1. / 12., slope.x * (11. / 12.), rx.z), farR.x); rz = mix(rz, vec3(1. / 12., slope.y * (11. / 12.), rz.z), farR.y);
  vec3 L = vec3(${w.CORE.x.toFixed(1)} - p.x, 0., ${w.CORE.z.toFixed(1)} - p.y) / max(length(vec2(${w.CORE.x.toFixed(1)}, ${w.CORE.z.toFixed(1)}) - p), 1.);
  vec3 SOF = base * 1.7 + vec3(.012, .016, .03), LITF = base * 2.5 + vec3(.03, .035, .05), DIMF = base * .5;
  float sofR = max(rx.x, rz.x), flR = max(rx.y, rz.y) * (1. - sofR);
  vec3 flC = rx.y > rz.y ? mix(DIMF, LITF, .5 + .5 * rx.z * L.x) : mix(DIMF, LITF, .5 + .5 * rz.z * L.z);
  col = mix(mix(col, flC, flR), SOF, sofR);
  for (int k = 0; k < 17; k++) {
    if (uTop[k].z > 0.) {
      vec3 bx = beamAt(p.x, pb.x, uTop[k].x, 3., fr.x), bz = beamAt(p.y, pb.y, uTop[k].y, 3., fr.y);
      float sofB = max(bx.x, bz.x), flB = max(bx.y, bz.y) * (1. - sofB);
      vec3 fbC = bx.y > bz.y ? mix(DIMF, LITF, .5 + .5 * bx.z * L.x) : mix(DIMF, LITF, .5 + .5 * bz.z * L.z);
      col = mix(mix(col, fbC, flB), SOF * 1.12, sofB);
    }
  }
  col += rimC;
  gl_FragColor = vec4(nightAir(col, cameraPosition, v), 1.);
}`;function To(e){const n=[],r=[],c=[],i=[];e.forEach((u,l)=>{if(!u.great)return;const f=u.pile.filter(g=>!g.plate).pop(),a=(f.x0+f.x1)/2,h=(f.z0+f.z1)/2,m=(f.x1-f.x0)/2,s=(f.z1-f.z0)/2,d=zo(Math.min(m,s)),o=w.SLAB-.9*d,t=w.SLAB-.03,E=Math.SQRT1_2;for(const[g,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const A=-b,x=g,v=g?s:m,T=g?m:s,y=(I,B,P)=>[a+g*(T+B)+A*I,P,h+b*(T+B)+x*I],z=y(-v,0,o),L=y(v,0,o),M=y(v+d,d,t),R=y(-v-d,d,t),H=[g*E,-E,b*E];for(const[I,B,P]of[[z,-v,0],[L,v,0],[M,v+d,1],[z,-v,0],[M,v+d,1],[R,-v-d,1]])n.push(I[0],I[1],I[2]),r.push(H[0],H[1],H[2]),c.push(B,P),i.push(l===0?1:0,d,0)}});const p=Oe(n,r);return p.setAttribute("uv",new k.Float32BufferAttribute(c,2)),p.setAttribute("color",new k.Float32BufferAttribute(i,3)),p}const Oo=`
attribute vec3 color;
varying vec3 vW; varying vec2 vUv; varying vec3 vCol;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.);
  vW = w.xyz; vUv = uv; vCol = color;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Fo=`
varying vec3 vW; varying vec2 vUv; varying vec3 vCol;
${Me}${Te}
void main(){
  float v = vUv.y, fu = max(fwidth(vUv.x), .02), fv = max(fwidth(v), .002);
  vec3 tone = mix(vec3(.86, .9, 1.), vec3(1., .9, .72), vCol.x);
  float fin = (1. - smoothstep(.1, .1 + fu, 2. - abs(fract(vUv.x / 4.) - .5) * 4.)) * clamp(.3 / fu, 0., 1.);
  float mould = max(1. - smoothstep(.012, .012 + fv, abs(v - .34)), 1. - smoothstep(.012, .012 + fv, abs(v - .67))) * clamp(.03 / fv, 0., 1.);
  vec3 col = tone * mix(.3, .78, v * v) * (1. - .3 * fin) * (1. - .28 * mould);
  float rim = smoothstep(.925, .95, v);
  gl_FragColor = vec4(nightAir(lit3(min(col, vec3(.9))) + tone * 2.1 * rim, cameraPosition, vW - cameraPosition), 1.);
}`,Tt=`
varying vec3 vW; varying vec3 vN;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.);
  vW = w.xyz; vN = normal;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Ot=`
varying vec3 vW; varying vec3 vN;
uniform vec3 uFog; uniform float uFogK; uniform vec4 uTow[17];
${ue}${Me}${Te}${Ue}
void main(){
  vec3 emis = vec3(0.);
  // (round nine) IN THE NIGHT-LIKE HALL a white body takes the glow of the field of light below it: its sides a
  // clear blue-grey, brighter toward their foot; its top deep blue under the slab. No key light, no long shade.
  vec3 side = vec3(.19, .25, .5) * mix(1.2, .82, smoothstep(0., 14., vW.y));
  // (round ten: a top has a seen tone: a blue-grey stone, never a dark blank)
  vec3 col = mix(side, vec3(.17, .215, .42), smoothstep(.3, .7, vN.y));
  #ifndef WELL
  if (abs(vN.y) < .5 && vW.y > ${w.ROOF.toFixed(1)}) {
    // (round ten) A WHITE WALL THAT STANDS OVER THE MAZE'S SHEET IS NO DARK BLANK FACE: it carries WARM LAMPS, one
    // every 9 m along it, 2 m under its top (hall two's and the concourse's walls; the link's and the corridor's
    // lower ones by their own heights), a scallop of warm light falling down the face under each
    // (round eleven: hall two's faces, which the line passes close by at the boulevard's head, carry a lamp every
    // 4.5 m, each with a broader scallop, and a pale coping along their top)
    // (EACH LAMP IS A SLIM UPRIGHT BAR OF WARM LIGHT, 0.16 m broad and 1 m high: its sides fade from 0.06 to 0.10 m
    // from its middle line, its ends from 0.48 to 0.52 m from its middle)
    bool h2w = vW.z < -220.5;
    float sp9 = h2w ? 4.5 : 9., s = abs(vN.x) > .5 ? vW.z : vW.x, dl = (fract(s / sp9) - .5) * sp9;
    // (round eleven: hall two's south face stands at z -220.8: it takes the hall's own lamps, not the link's lower
    // ones, which left its upper 5 m a dark blank face beside the boulevard's head)
    float dyl = (vW.z < -220.5 ? 11.3 : vW.z <= ${(w.H1.z0+2).toFixed(1)} ? 8.2 : 7.4) - vW.y, wv = (h2w ? 1.5 : 1.) + .6 * max(dyl, 0.);
    float fl = max(max(fwidth(s), fwidth(vW.y)), 1e-3);
    float scal = exp(-dl * dl / (wv * wv)) * exp(-max(dyl, 0.) / 3.6) * step(-.25, dyl);
    float lamp = (1. - smoothstep(.06, .10, abs(dl))) * (1. - smoothstep(.48, .52, abs(dyl))) * clamp(.4 / fl, 0., 1.);
    col = mix(col, vec3(.95, .8, .56), .8 * scal);
    if (h2w) col = mix(col, vec3(.4, .45, .66), 1. - smoothstep(-1.9, -1.9 + fl, dyl));
    emis = vec3(1., .86, .58) * 1.4 * lamp;
  }
  #endif
  #ifdef ROOF
  // A ROOF'S TOP: paved in stone, deep blue under the slab, WITH GLOWING SKYLIGHTS, the lights' one law running over
  // them: strips every 9 m on hall two; over the lobby a slot over every bar of its ceiling's weave, on that
  // ceiling's lattice of 6 m; over the corridor and the link slots in the same weave in two files of cells, 1.5 m
  // and 3 m, numbered along the line's own metres as below (the run's metre at a z north of the corridor's mouth
  // is RUNZ less z). (Round eleven f: the corridor's, the link's and hall two's ceilings carry no light under
  // them: those skylights are the roof's own.) Each lays a soft pale glow on the roof beside it. Fine joints
  // every 9 m.
  if (vN.y > .5 && vW.y < ${(w.LOBBY.roof+.1).toFixed(1)}) {
    vec2 p = vW.xz, fwp = max(fwidth(p), vec2(.02));
    bool h2 = p.y < -222., lk = p.y <= ${(w.H1.z0+2).toFixed(1)} && p.y >= -222., lb = vW.y > ${(w.LOBBY.roof-.5).toFixed(1)};
    float ds, fs = max(fwp.x, fwp.y);
    if (h2) { ds = abs(mod(p.x + 63.5 + 4.5, 9.) - 4.5); fs = fwp.x; }
    else {
      // (the bar's own cell: its breadth cw, its two numbers ci, the place from its middle r; then the metres to the
      // bar's edge, a sixth of the cell wide and two thirds long, less .45: the slot's glass is that bar)
      float cw; vec2 ci, r;
      if (lb) { cw = 6.; ci = floor((p - vec2(${w.LOBBY.x0.toFixed(1)}, ${w.LOBBY.z0.toFixed(1)})) / cw); r = p - vec2(${w.LOBBY.x0.toFixed(1)}, ${w.LOBBY.z0.toFixed(1)}) - (ci + .5) * cw; }
      else {
        cw = lk ? ${(2*kt.link).toFixed(1)} : ${(2*kt.corridor).toFixed(1)};
        float al = ${(Rt+w.LOBBY.z0).toFixed(3)} - p.y, ac = p.x - (${ge.toFixed(1)});
        ci = vec2(floor(al / cw), step(0., ac)); r = vec2(al - (ci.x + .5) * cw, abs(ac) - .5 * cw);
      }
      vec2 qb = abs(mod(ci.x + ci.y, 2.) < .5 ? r : r.yx) - vec2(cw * ${(Je.long/2).toFixed(5)}, cw * ${(Je.wide/2).toFixed(5)});
      ds = length(max(qb, 0.)) + min(max(qb.x, qb.y), 0.) + .45;
    }
    float strip = clamp((.45 - ds) / fs + .5, 0., 1.) * clamp(.9 / fs, 0., 1.);
    float kerb = clamp((.62 - ds) / fs + .5, 0., 1.) * clamp(1.24 / fs, 0., 1.) - strip;
    vec2 jd = abs(mod(p + vec2(68., 150.) + 4.5, 9.) - 4.5);
    float joint = max(clamp((.05 - jd.x) / fwp.x + .5, 0., 1.) * clamp(.1 / fwp.x, 0., 1.), clamp((.05 - jd.y) / fwp.y + .5, 0., 1.) * clamp(.1 / fwp.y, 0., 1.)) * (h2 ? 1. : 0.);
    float kr = waveHump(p.x + p.y);
    float halo = exp(-max(ds - .45, 0.) / 1.8) * clamp(3. / fs, 0., 1.);
    vec2 tj = (.5 - abs(fract(p / 1.5) - .5)) * 1.5;
    float jt = max(clamp((.025 - tj.x) / fwp.x + .5, 0., 1.) * clamp(.05 / fwp.x, 0., 1.), clamp((.025 - tj.y) / fwp.y + .5, 0., 1.) * clamp(.05 / fwp.y, 0., 1.));
    // (round ten: A ROOF'S TOP HAS A SEEN TONE: a blue-grey stone, lit warm beside every skylight over 3 m and more;
    // hall two's skylights are glazed: a fine dark bar across each strip every 3 m)
    float bar = h2 ? clamp((.07 - abs(fract(p.y / 3.) - .5) * 3.) / fwp.y + .5, 0., 1.) * clamp(.14 / fwp.y, 0., 1.) : 0.;
    halo = exp(-max(ds - .45, 0.) / 2.8) * clamp(3. / fs, .35, 1.);
    col = vec3(.2, .25, .46) * (1. - .2 * joint) * (1. - .18 * jt) * (1. + .5 * kerb) + vec3(.36, .31, .2) * halo * (.5 + .5 * kr);
    col = mix(col, vec3(.97, .95, .88) * (1. - .55 * bar), strip);
    emis = vec3(1., .96, .86) * (.5 + 1.3 * kr) * strip * (1. - .7 * bar);
  }
  #endif
  #ifdef WELL
  {
    // THE WELL: white, lit from the bright hall below; ITS INNER FACE IS LINED WITH SLIM UPRIGHT BARS OF WARM LIGHT,
    // sixty-four round it, each the white walls' own lamp (0.16 m broad and 1 m high, its sides fading from 0.06 to
    // 0.10 m, its ends from 0.48 to 0.52 m), its middle 1.2 m under the ring's top, a scallop of warm light falling
    // down the face under each; its columns plain and slim.
    // (round nine: the reveal is the oculus' bright rim against the dark slab; the ring's outer face over the roof
    // stands in the night-like hall)
    vec2 oc = vW.xz - vec2(${w.OC.x.toFixed(1)}, ${w.OC.z.toFixed(1)});
    float inward = step(dot(vN.xz, oc), -.01) * step(abs(vN.y), .5) * step(${(w.WELL.foot-.05).toFixed(2)}, vW.y);
    float ang = atan(oc.y, oc.x), dxl = (fract(ang * 64. / 6.2831853) - .5) * 6.2831853 * ${w.WELL.r.toFixed(1)} / 64., dyl = ${(w.WELL.top-1.2).toFixed(1)} - vW.y;
    float lamp = (1. - smoothstep(.06, .10, abs(dxl))) * (1. - smoothstep(.48, .52, abs(dyl))), wv = .5 + .4 * max(dyl, 0.);
    float scal = exp(-dxl * dxl / (wv * wv)) * exp(-max(dyl, 0.) / 2.4) * step(-.3, dyl);
    vec3 plain = vec3(.86, .87, .9) * (.84 + .16 * smoothstep(-6., 12., vW.y)) * (.93 + .07 * dot(normalize(vN.xz + vec2(1e-4)), vec2(.8, .6)));
    if (vN.y < -.5) plain *= .82;
    if (vW.y < 13.4 || inward > .5) col = mix(plain, vec3(1., .9, .68), .75 * scal * inward);
    emis = vec3(1., .86, .58) * 1.5 * lamp * inward;
  }
  #endif
  gl_FragColor = vec4(nightAir(lit3(col) + emis, cameraPosition, vW - cameraPosition), 1.);
}`,Lo=`
attribute vec4 aT, aU;
varying vec3 vW; varying vec3 vN; varying vec4 vT; varying vec4 vU;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.);
  vW = w.xyz; vN = normal; vT = aT; vU = aU;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,So=`
varying vec3 vW; varying vec3 vN; varying vec4 vT; varying vec4 vU;
uniform float uTime, uFogK; uniform vec4 uCar[40]; uniform vec3 uCarLight, uWarm, uFog; uniform vec3 uPal[8];
${Me}${Te}
// (a draw between 0 and 1 from a bay's own numbers)
float hT(vec2 p){ return fract(sin(dot(p, vec2(27.619, 57.583))) * 24634.6345 + cos(dot(p, vec2(41.233, 13.171))) * 7919.137); }
void main(){
  float y = vW.y, fy = max(fwidth(y), .02), kind = vT.x;
  vec3 dv = normalize(vW - cameraPosition);
  vec2 n2 = normalize(vN.xz + vec2(1e-5, 0.)), dq = vW.xz - cameraPosition.xz, dvn = dq / max(length(dq), 1e-3);
  float up = abs(vN.y);
  vec3 SH = vec3(.13, .18, .4) * mix(1.2, .9, smoothstep(0., 70., y)), EDGE = vec3(.6, .68, .95), col = vec3(0.), lin3;
  if (kind < -.5) {
    // the great doorway: its back wall (the lit car, panel joints every 4 m), its warm frame, its room (brighter
    // toward the back wall, joints every 4 m of its depth)
    // (round eight: the back wall is a wall of warm white-gold light in panels of 5 m, a little under the ring's own
    // brightness; the room's floor, ceiling and sides deepen toward the mouth; THE REVEAL IS WHITE: its faces that
    // look into the opening are lit by the doorway, its front stands pale in the tower's shade, warm along the
    // opening's edge)
    vec2 pj = abs(fract(vec2(y, vW.z) / 5.) - .5) * 5.;
    // (round nine: THE EXPOSURE IS HELD: the back wall is brightest round the ring and falls to a warm mid tone toward
    // its corners (vU.x: metres across from its middle), its panel joints plain; the ring stands in the brightest place)
    float rb = length(vec2(vU.x, y - ${w.RING_Y.toFixed(1)}));
    // (round ten; round eleven c: a porch's lit soffit: warm, in panels of 3 m, ONE SLIM BAR OF LIGHT in the middle of
    // each, 1.8 m long and 0.12 m broad, along in one panel and across in the next: no round light on a soffit)
    vec2 sg3 = (fract(vW.xz / 3.) - .5) * 3., sgi = floor(vW.xz / 3.), sgb = abs(mod(sgi.x + sgi.y, 2.) < .5 ? sg3 : sg3.yx) - vec2(.9, .06);
    float sfw = max(fwidth(vW.x) + fwidth(vW.z), .02), sdl = 1. - smoothstep(0., sfw, max(sgb.x, sgb.y)), sjn = 1. - smoothstep(.04, .04 + sfw, 1.5 - max(abs(sg3.x), abs(sg3.y)));
    if (kind < -3.5) lin3 = lit3(vec3(.84, .76, .62) * (1. - .14 * sjn * clamp(.2 / sfw, 0., 1.))) + vec3(1., .88, .62) * 1.6 * sdl * clamp(.6 / sfw, .25, 1.);
    else if (kind < -2.5) lin3 = lit3(mix(vec3(.6, .5, .4), vec3(.9, .85, .72), exp(-rb * rb / 190.))) * (1. - .22 * smoothstep(2.4, 2.47, max(pj.x, pj.y)));
    else if (kind < -1.5) lin3 = mix(lit3(mix(vec3(.34, .4, .64), vec3(1., .93, .78), smoothstep(.35, 1., vU.y))), uWarm * 1.08, step(.5, vU.x));
    else lin3 = uWarm * (.5 + .42 * vU.x) * (1. - .2 * smoothstep(1.9, 1.97, abs(fract(vU.x * 3.) - .5) * 4.));
  } else if (kind < .5) {
    // a floor plate
    // (round nine: its top deep blue under the slab; its edges a clear blue-grey with a fine pale arris along the
    // top; ITS UNDER SIDE TAKES THE GLOW OF THE STOREY UNDER IT, in that storey's colour)
    float top = vU.y + vU.z - y;
    vec3 under = mix(vec3(.3, .4, .72), mix(uPal[int(vT.y + .5)], vec3(1.), .3), .7);
    col = vN.y > .5 ? vec3(.1, .135, .32) : vN.y < -.5 ? under : SH * 1.2;
    if (up < .5) col = mix(col, EDGE, .8 * (1. - smoothstep(.2, .3 + fy, top)) * clamp(.5 / fy, 0., 1.));
    lin3 = lit3(col);
  } else if (kind < 1.5) {
    // a storey of rooms
    vec3 rc = uPal[int(vT.y + .5)];
    float H = vU.z, yy = y - vU.y, bw = vU.w, bi = floor(vU.x / bw), bx = abs(vU.x - (bi + .5) * bw), fu = max(fwidth(vU.x), .02);
    float cover = 1. - smoothstep(.6, 2.6, max(fy, fu));
    // (a storey taller than 13 m, a great doorway's own or a great tower's last, is drawn as two or three storeys
    // with a plate 2 m thick between each two, flush with the glass)
    float nS = max(floor(H / 9.5 + .5), 1.), hS = H / nS, sub = min(floor(yy / hS), nS - 1.), plateB = 0.;
    if (nS > 1.5) { yy -= sub * hS; H = hS - 2.; plateB = sub < nS - 1.5 ? smoothstep(H - fy, H + fy, yy) : 0.; yy = min(yy, H); }
    float into = max(-dot(dv.xz, n2), .08), tb = 7. / into, tv = dv.y > 0. ? (H - yy) / max(dv.y, 1e-3) : yy / max(-dv.y, 1e-3), t = min(tb, tv);
    float hy = clamp(yy + dv.y * t, 0., H), dep = into * t;
    // (each bay's own draw, from whole numbers only: the bay, the tower, the storey's foot, the way the face looks.
    // THE FOOT IS COUNTED IN QUARTER METRES, rounded to the nearest: every storey's foot in this world is a whole
    // number of quarter metres (the towers' are whole metres, the well's building's are 5.25 m apart), so the
    // rounding has an eighth of a metre to spare either way. Counted in whole metres, as it was, a foot at 10.5 or
    // 31.5 m fell to either side pixel by pixel, and that storey's bays flickered between two draws like static.)
    float draw = hT(vec2(bi + floor(vT.z + .5) * 17., floor(vU.y * 4. + .5) * .0925 + sub * 1.7 + floor(n2.x * 2. + .5) * 3. + floor(n2.y * 2. + .5) * 5.));
    // EVERY BAY HAS ITS OWN STATE (round eight), by that draw: lit in the storey's colour (each a shade brighter or
    // deeper), BRIGHTER, DIM, DARK, or OPEN AS A LOGGIA. A bay's state holds at any distance: no storey is one flat
    // coloured panel.
    // (round ten: A TOWER'S FOOT IS SEEN: its ground storey is its lit hall: no bay of it dark, dim or open, all of
    // it a shade over the storeys' own light)
    float gs = step(vU.y, .5);
    bool dark = draw < .09 && gs < .5, dim = !dark && draw < .23 && gs < .5, logg = draw >= .23 && draw < .33 && gs < .5, bright = draw >= .33 && draw < .48;
    float on = mix(dim ? .46 : bright ? 1.14 : .78 + .16 * fract(draw * 9.), bright ? 1.2 : .98 + .16 * fract(draw * 9.), gs);
    vec3 room = mix(rc, vec3(1., .95, .84), .34) * (.88 + .24 * hy / H);
    if (tv < tb) {
      if (dv.y > 0.) {
        // (its pale ceiling with two rows of light)
        float sl = min(abs(dep - 2.3), abs(dep - 4.9)), es = max(fwidth(dep), .03);
        room = mix(mix(vec3(.88, .9, .93), rc, .22), vec3(1.05, 1.03, .98), (1. - smoothstep(.22 - es, .22 + es, sl)) * clamp(.44 / es, 0., 1.));
      } else room = rc * (.82 + .26 * dep / 7.);
    }
    room *= on;
    vec3 mean = mix(rc, vec3(1., .95, .84), .3) * .92 * on;
    if (dark) { room = mix(vec3(.09, .14, .32), rc, .12); mean = room; }
    if (logg) {
      // A LOGGIA: the bay stands open to the air; its back wall, 3 m in, is lit warm from within; a rail at its edge;
      // on the plate's edge A TREE IN A TUB, or nothing and its back wall a shade warmer, by the bay's own draw.
      // (round eleven: the row of three small lamps is gone: from far off it stood in its bay as three pale specks)
      float lz = vU.x - (bi + .5) * bw, gk = fract(draw * 37.);
      vec3 back = mix(vec3(.8, .7, .52), rc, .3) * (.42 + .4 * yy / H);
      room = mix(back, vec3(.9, .9, .88), (1. - smoothstep(.05, .05 + fy, abs(yy - 2.))) * clamp(.1 / fy, 0., 1.) * .8);
      if (gk < .55) {
        float e = length(vec2(lz / min(1.45, .36 * bw), (yy - .56 * H) / (.27 * H))), leaf = 1. - smoothstep(.82, 1., e);
        vec3 green = vec3(.24, .5, .3) * (.8 + .3 * smoothstep(-1., 1., lz * (n2.y + n2.x)));
        room = mix(room, vec3(.36, .3, .26), (1. - smoothstep(.09, .09 + fu, abs(lz))) * step(1.5, yy) * step(yy, .5 * H));
        room = mix(room, vec3(.9, .88, .84), (1. - smoothstep(.5, .5 + fu, abs(lz))) * step(.9, yy) * step(yy, 1.6));
        room = mix(room, green, leaf);
        mean = mix(back, green, .4);
      } else {
        room = room * 1.3 + vec3(.05, .04, .015);
        mean = back * 1.3 + vec3(.05, .04, .015);
      }
    }
    // the slim posts between the bays (0.32 m), the floor edge under the storey (0.9 m) and the head over it (0.5 m):
    // dark against the lit rooms
    float post = clamp((bx - (.5 * bw - .16)) / fu + .5, 0., 1.) * clamp(.32 / fu, 0., 1.);
    float sill = 1. - smoothstep(.9 - fy, .9 + fy, yy), head = smoothstep(H - .5 - fy, H - .5 + fy, yy) * clamp(.5 / fy, 0., 1.);
    vec3 frameC = SH * 1.1;
    col = mix(mean, room, cover);
    col = mix(col, frameC, post);
    col = mix(col, frameC, max(max(sill, head) * (1. - smoothstep(1.2, 4., fy)), plateB));
    // (a lit room gives light: it glows in its own colour)
    lin3 = lit3(min(col, vec3(.97))) + rc * (gs > .5 ? .26 : bright ? .3 : dark || logg ? 0. : dim ? .03 : .14);
  } else {
    // a lift's glass shaft: two fine mullions, a landing's line at every 10 m; its car a lit box 7 m high, eased at
    // the head and the foot of its run
    int k = int(vT.y + .5);
    float u = vU.x, fu = max(fwidth(u), .004);
    col = vec3(.15, .2, .44) * (1. + .5 * (1. - smoothstep(.02, .02 + fu * 1.5, abs(abs(u) - .8)))) * (1. + .3 * (1. - smoothstep(.12, .12 + fy, abs(fract(y / 10. + .5) - .5) * 10.)));
    vec4 c = uCar[k];
    float yc = mix(c.z, c.w, .5 - .5 * cos(6.2831853 * (uTime / c.x + c.y)));
    float car = (1. - smoothstep(3.5 - fy, 3.5 + fy, abs(y - yc))) * (1. - smoothstep(.72 - fu, .72 + fu, abs(u)));
    // (the car: a lit box, A BRIGHT BEAD on the tower's face from far off)
    lin3 = mix(lit3(col), uCarLight * 1.4 * (1. - .22 * smoothstep(.55, .62, abs(fract((y - yc) / 3.) - .5) * 2.)), car) + uCarLight * .08 * exp(-max(abs(y - yc) - 3.5, 0.) / 5.) * (1. - car);
  }
  // (round eleven: a great tower's head stands in its capital: see capitalsGeo)
  // the air a tower stands in is the great hall's own (see nightAirK): THE LOW SHEET OF HAZE LIES BEHIND ITS FOOT,
  // never across it: a far tower's lowest storeys read as clearly as its upper ones
  gl_FragColor = vec4(nightAirK(lin3, cameraPosition, vW - cameraPosition, 0.), 1.);
}`,Oe=(e,n,r)=>{const c=new k.BufferGeometry;return c.setAttribute("position",new k.Float32BufferAttribute(e,3)),c.setAttribute("normal",new k.Float32BufferAttribute(n,3)),r&&c.setAttribute("aCore",new k.Float32BufferAttribute(r,2)),c};function ct(e,n="fww-core"){const r=ae(se(n+":"+e)),c=[];for(let i=0;i<20;i++)c.push(new k.Vector4(r.range(38,70),r.range(0,1),6+r.range(0,8),90-r.range(0,30)));return c}const Ye=[[2,.27],[6,.13],[1,.16],[5,.08],[3,.11],[4,.12],[7,.13]];function Ro(e,n){const r=[],c=2*e.r,i=e.door?e.door+2:n.chance(.5)?8:12,p=()=>{let h=n();for(const[m,s]of Ye){if(h<s)return m;h-=s}return 2};let u=[e.x-e.r,e.x+e.r,e.z-e.r,e.z+e.r],l=0,f=i,a=-1;for(let h=0;h<12;h++){let m=p();m===a&&(m=p()),a=m;const s=e.great?f+10>w.SLAB-4:f+2>=e.h-1;if(r.push({plate:0,x0:u[0],x1:u[1],z0:u[2],z1:u[3],y0:l,y1:s&&e.great?w.SLAB:f,ci:m,bay:[4,4,4][n.int(0,2)]}),s&&e.great)break;let d=u.slice();if(!s)for(let t=0;t<8;t++){d=u.slice();const E=n.range(.06,.2)*c*(n.chance(.5)?1:-1),g=n.range(.04,.1)*c*(n.chance(.5)?1:-1),b=n.int(0,3);if(b===0?(d[0]+=E,d[1]+=E):b===1?(d[2]+=E,d[3]+=E):b===2?(d[0]+=g,d[1]-=g,d[2]+=E/2,d[3]+=E/2):(d[2]+=g,d[3]-=g,d[0]+=E/2,d[1]+=E/2),e.door){const v=d[1]-d[0];d[0]=e.x-e.r,d[1]=d[0]+v}const A=d[1]-d[0],x=d[3]-d[2];if(A>.62*c&&A<1.05*c&&x>.62*c&&x<1.05*c&&Math.abs((d[0]+d[1])/2-e.x)<(e.door?.2:.14)*c&&Math.abs((d[2]+d[3])/2-e.z)<.14*c)break;d=u.slice()}const o=n.range(1.5,3.5);if(r.push({plate:1,x0:Math.min(u[0],d[0])-(e.door?1.5:o),x1:Math.max(u[1],d[1])+o,z0:Math.min(u[2],d[2])-o,z1:Math.max(u[3],d[3])+o,y0:f,y1:f+2}),s)break;u=d,l=f+2,f=l+8}return r}const ko=2.2,Ho=[1,.76,.54],Io=[40,70];function Bo(e){const n=[],r=e.x-e.r,c=e.door+2,i=Ho.map(f=>f*e.r),[p,u]=Io,l=[[0,0,c],[0,c+2,c+10],[0,c+12,c+20],[1,p,p+8],[1,p+10,p+18],[1,p+20,p+28],[2,u,u+8],[2,u+10,u+18],[2,u+20,w.SLAB]];return l.forEach(([f,a,h],m)=>{const s=i[f];n.push({plate:0,x0:r,x1:r+2*s,z0:e.z-s,z1:e.z+s,y0:a,y1:h,ci:m%2===0?7:0,bay:4}),m+1<l.length&&n.push({plate:1,x0:r-1.5,x1:r+2*s+2.5,z0:e.z-s-2.5,z1:e.z+s+2.5,y0:h,y1:h+2})}),n}function Wo(e){const n=e.pile.filter(u=>!u.plate).length,r=n>5?2:1,c=e.form,i=u=>{if(u<=0||c===0)return[1,1];if(c===1)return u<r?[1,1]:e.alongX?[1,.42]:[.42,1];if(c===2){const l=Math.max(1-.07*u,.46);return[l,l]}if(c===3){const l=Math.min(1+.05*u,1.3);return[l,l]}return u<r?[1,1]:[.55,.55]};let p=0;e.podTop=0;for(const u of e.pile){const l=i(p),f=u.plate?i(p+1):l,a=u.plate?[Math.max(l[0],f[0]),Math.max(l[1],f[1])]:l;u.x0=e.x+(u.x0-e.x)*a[0],u.x1=e.x+(u.x1-e.x)*a[0],u.z0=e.z+(u.z0-e.z)*a[1],u.z1=e.z+(u.z1-e.z)*a[1],u.plate&&(p<r&&(e.podTop=u.y1),p++)}}const ce={more:12,east:{take:2,of:3},hazeTakes:1/2,half:[1/2,1],top:[1/3,4/5],tries:90,goes:6};function No(e,n,r,c){for(let i=0;i<2e3;i+=5)for(let p=-r;p<=r+1e-9;p+=Math.PI/90)if(c(e[0]+i*Math.cos(n+p),e[1]+i*Math.sin(n+p)))return i;return 2e3}function Ft(e){const n=ae(se("fww-far:"+e)),r=ae(se("fww-pile:"+e)),c=w.CORE,i=w.TOWB,p=[],u=[{x:c.x,z:c.z,r:c.r,h:w.SLAB,great:!0,door:c.door,lifts:c.lifts},{x:i.x,z:i.z,r:i.r,h:w.SLAB,great:!0,door:i.door,lifts:i.lifts}];for(let g=0;g<=_e;g+=10){const b=fe(g);p.push(b[0],b[1])}const l=(g,b,A)=>{if(uo(g,b,A*1.3))return!1;for(let x=0;x<p.length;x+=2)if(Math.hypot(g-p[x],b-p[x+1])<150+1.9*A)return!1;return!u.some(x=>Math.hypot(g-x.x,b-x.z)<110+1.5*(A+x.r))},f=ce.half[0]*c.r,a=ce.half[1]*c.r,h=-Math.log(1-ce.hazeTakes)*(1/Mt.k),m=[{c:[w.STREET.x0,w.STREET.z],a0:0,half:Math.PI/2},{c:[c.x,c.z],a0:Math.PI,half:Math.PI/2}];for(const g of m)g.near=No(g.c,g.a0,g.half,(b,A)=>l(b,A,f));const s=ce.more,d=n.shuffle(Array.from({length:s},(g,b)=>b)),o=n.shuffle(Array.from({length:s},(g,b)=>f+(a-f)*b/(s-1))),t=n.shuffle(Array.from({length:s},(g,b)=>w.SLAB*(ce.top[0]+(ce.top[1]-ce.top[0])*b/(s-1))));for(let g=0;g<s;g++)for(let b=0;b<ce.tries;b++){const A=m[g%ce.east.of<ce.east.take?0:1],x=A.a0+n.range(-A.half,A.half),v=b<ce.tries/ce.goes,T=A.near+(h-A.near)*(v?(d[g]+n())/s:n()),y=A.c[0]+T*Math.cos(x),z=A.c[1]+T*Math.sin(x),L=o[g];if(l(y,z,L)){u.push({x:y,z,r:L,h:g%5===0?w.SLAB:t[g],great:g%5===0});break}}u.forEach((g,b)=>{g.pile=b===0?Bo(g):Ro(g,r),g.h=g.pile[g.pile.length-1].y1});{const g=ae(se("fww-form:"+e)),b=g.shuffle([0,1,2,3,4,0,1,2,3,4,1,2,3,4]);for(let A=2;A<u.length;A++)u[A].form=b[(A-2)%b.length],u[A].alongX=g.chance(.5),Wo(u[A])}const E=ae(se("fww-lifts:"+e));for(let g=2;g<u.length;g++){const b=u[g];b.shafts=[{face:"w",off:E.range(-.5,.5)*b.r},{face:"s",off:E.range(-.5,.5)*b.r}],b.form===2?b.shafts=[]:b.form===1||b.form===4?b.shafts.forEach(A=>{A.top=b.podTop-.5}):b.form===3&&b.shafts.forEach(A=>{A.at=A.face==="w"?b.pile[0].x0:b.pile[0].z1}),b.form===1&&(b.shafts=b.shafts.filter(A=>A.face==="w"!==b.alongX||Math.abs(A.off)<.42*b.r-3))}{const g=w.SHAFT,b=ae(se("fww-stack:"+e)),A=[],x=8,v=5.25;let T=-1;for(let y=0;y<x;y++){const z=v*y,L=b.range(1,ko);let M=Ye[b.int(0,Ye.length-1)][0];M===T&&(M=Ye[(Ye.findIndex(H=>H[0]===M)+2)%Ye.length][0]),T=M;const R=[g.x-g.half,g.x+g.half,g.z-g.half,g.z+g.half];A.push({plate:0,x0:R[0],x1:R[1],z0:R[2],z1:R[3],y0:z,y1:z+v-1,ci:M,bay:5}),A.push({plate:1,x0:R[0]-L,x1:R[1]+L,z0:R[2]-L,z1:R[3]+L,y0:z+v-1,y1:y===x-1?g.roof:z+v})}u.push({x:g.x,z:g.z,r:g.half,h:g.roof,great:!1,stack:!0,pile:A})}return u}function Po(e){const n=[],r=[],c=[],i=[],p=(a,h,m,s)=>{for(const d of[0,1,2,0,2,3]){const o=Array.isArray(s[0])?s[d]:s;n.push(a[d][0],a[d][1],a[d][2]),r.push(h[0],h[1],h[2]),c.push(m[0],m[1],m[2],m[3]),i.push(o[0],o[1],o[2],o[3])}},u=(a,h,m,s)=>{const{x0:d,x1:o,z0:t,z1:E,y0:g,y1:b}=a,A=b-g,x=(v,T,y,z,L,M,R,H,I=g)=>{const B=m<0?H:m;p([[v,I,T],[y,I,z],[y,b,z],[v,b,T]],L,h,[[M,g,A,B],[R,g,A,B],[R,g,A,B],[M,g,A,B]])};x(o,t,d,t,[0,0,-1],0,o-d,1),x(d,E,o,E,[0,0,1],o-d,0,1),x(o,E,o,t,[1,0,0],0,E-t,0),s?(x(d,t,d,s[0],[-1,0,0],0,s[0]-t,0),x(d,s[1],d,E,[-1,0,0],s[1]-t,E-t,0),x(d,s[0],d,s[1],[-1,0,0],s[0]-t,s[1]-t,0,s[2])):x(d,t,d,E,[-1,0,0],0,E-t,0)};let l=0;e.forEach((a,h)=>{const m=a.great?1:0,s=a.door?a.door/2:0,d=a.x-a.r;if(a.pile.forEach((o,t)=>{if(a.stack){const E=!!o.plate,g=E?[0,t>0?a.pile[t-1].ci:7,h,m]:[1,o.ci,h,m],b=o.y1-o.y0,A=E?1:o.bay,x=E?0:o.bay,v=[-72.7,-63.3,w.COR_ROOF+.7],T=[-76.2,-59.8,w.LINK_ROOF+.7];for(const[y,z,L]of[[o.z1,1,v],[o.z0,-1,T]]){const M=(R,H,I)=>{H>R+1e-6&&o.y1>I+1e-6&&p([[R,I,y],[H,I,y],[H,o.y1,y],[R,o.y1,y]],[0,0,z],g,[[o.x1-R,o.y0,b,A],[o.x1-H,o.y0,b,A],[o.x1-H,o.y0,b,A],[o.x1-R,o.y0,b,A]])};o.y0>=L[2]?M(o.x0,o.x1,o.y0):(M(o.x0,L[0],o.y0),M(L[1],o.x1,o.y0),M(L[0],L[1],L[2]))}if(p([[o.x1,o.y0,o.z1],[o.x1,o.y0,o.z0],[o.x1,o.y1,o.z0],[o.x1,o.y1,o.z1]],[1,0,0],g,[[0,o.y0,b,x],[o.z1-o.z0,o.y0,b,x],[o.z1-o.z0,o.y0,b,x],[0,o.y0,b,x]]),p([[o.x0,o.y0,o.z0],[o.x0,o.y0,o.z1],[o.x0,o.y1,o.z1],[o.x0,o.y1,o.z0]],[-1,0,0],g,[[0,o.y0,b,x],[o.z1-o.z0,o.y0,b,x],[o.z1-o.z0,o.y0,b,x],[0,o.y0,b,x]]),E){const y=[0,o.y0,b,0],z=(L,M,R)=>{const H=(I,B,P,V)=>{B>I+1e-6&&V>P+1e-6&&p([[I,L,P],[B,L,P],[B,L,V],[I,L,V]],[0,M,0],g,y)};for(const[I,B,P]of[[R.z1,o.z1,v],[o.z0,R.z0,T]])L>=P[2]?H(o.x0,o.x1,I,B):(H(o.x0,P[0],I,B),H(P[1],o.x1,I,B));H(o.x0,R.x0,R.z0,R.z1),H(R.x1,o.x1,R.z0,R.z1)};t+1<a.pile.length?z(o.y1,1,a.pile[t+1]):p([[o.x0,o.y1,o.z0],[o.x1,o.y1,o.z0],[o.x1,o.y1,o.z1],[o.x0,o.y1,o.z1]],[0,1,0],g,y),t>0&&z(o.y0,-1,a.pile[t-1])}return}if(o.plate){const E=[0,t>0?a.pile[t-1].ci:7,h,m],g=o.y1-o.y0,b=[0,o.y0,g,0];u(o,E,-1,null),p([[o.x0,o.y1,o.z0],[o.x1,o.y1,o.z0],[o.x1,o.y1,o.z1],[o.x0,o.y1,o.z1]],[0,1,0],E,b),p([[o.x0,o.y0,o.z0],[o.x1,o.y0,o.z0],[o.x1,o.y0,o.z1],[o.x0,o.y0,o.z1]],[0,-1,0],E,b)}else u(o,[1,o.ci,h,m],o.bay,t===0&&a.door?[a.z-s-w.REVEAL.broad,a.z+s+w.REVEAL.broad,a.door+w.REVEAL.broad]:null)}),a.door){const o=a.door,t=(y,z,L)=>[d+y,L,a.z+z],E=[-1,0,h,m],g=[-2,0,h,m],b=[[0,0,0,0],[1,0,0,0],[1,0,0,0],[0,0,0,0]],A=w.REVEAL.broad,x=w.REVEAL.proud,v=h===1,T=v?w.PORCH.rise:0;if(p([t(v?-w.PORCH.land:-1.4,s,T),t(12,s,T),t(12,-s,T),t(v?-w.PORCH.land:-1.4,-s,T)],[0,1,0],E,b),v){const y=w.PORCH,z=[-2,0,h,m],L=[-4,0,h,m],M=[0,a.pile[0].ci,h,m];for(let G=0;G<y.steps;G++){const N=-y.land-(y.steps-1-G)*y.tread,C=(G+1)*y.rise/y.steps,O=[.12+.05*G,0,0,0];if(G<y.steps-1&&p([t(N,s,C),t(N+y.tread,s,C),t(N+y.tread,-s,C),t(N,-s,C)],[0,1,0],E,O),p([t(N,-s,C-y.rise/y.steps),t(N,s,C-y.rise/y.steps),t(N,s,C),t(N,-s,C)],[-1,0,0],E,[.02+.03*G,0,0,0]),N<-x)for(const F of[-1,1])p([t(N,F*s,0),t(-x,F*s,0),t(-x,F*s,C),t(N,F*s,C)],[0,0,F],z,[0,.5,0,0])}const R=-y.out,H=-1.5,I=y.half,B=a.door+2+.8,P=a.door+4,V=[0,B,P-B,0];p([t(R,-I,P),t(H,-I,P),t(H,I,P),t(R,I,P)],[0,1,0],M,V),p([t(R,-I,B),t(H,-I,B),t(H,I,B),t(R,I,B)],[0,-1,0],L,[0,0,0,0]),p([t(R,-I,B),t(R,I,B),t(R,I,P),t(R,-I,P)],[-1,0,0],M,V);for(const G of[-1,1])p([t(R,G*I,B),t(H,G*I,B),t(H,G*I,P),t(R,G*I,P)],[0,0,G],M,[0,B,P-B,1]);for(const G of y.piers){for(const F of[-1,1]){const S=F*(I-1.1)-.35,$=S+.7,D=G-.35,W=G+.35,U=[0,.78,0,0];p([t(D,S,0),t(D,$,0),t(D,$,B),t(D,S,B)],[-1,0,0],z,[0,.55,0,0]),p([t(W,S,0),t(W,$,0),t(W,$,B),t(W,S,B)],[1,0,0],z,[1,0,0,0]),p([t(D,S,0),t(W,S,0),t(W,S,B),t(D,S,B)],[0,0,-1],z,F>0?[1,0,0,0]:U),p([t(D,$,0),t(W,$,0),t(W,$,B),t(D,$,B)],[0,0,1],z,F<0?[1,0,0,0]:U)}const N=G-.25,C=G+.25,O=B-.9;p([t(N,-I+1.1,O),t(C,-I+1.1,O),t(C,I-1.1,O),t(N,I-1.1,O)],[0,-1,0],z,[1,0,0,0]),p([t(N,-I+1.1,O),t(N,I-1.1,O),t(N,I-1.1,B),t(N,-I+1.1,B)],[-1,0,0],z,[0,.7,0,0]),p([t(C,-I+1.1,O),t(C,I-1.1,O),t(C,I-1.1,B),t(C,-I+1.1,B)],[1,0,0],z,[1,0,0,0])}const K=a.pile.filter(G=>G.plate).slice(1,4);for(const G of K)for(const[N,C]of[[-14,-4.2],[4.2,14]]){const O=G.y1,F=-4.5,S=-1.5,$=[0,O-.35,.35,0];p([t(F,N,O),t(S,N,O),t(S,C,O),t(F,C,O)],[0,1,0],M,$),p([t(F,N,O-.35),t(S,N,O-.35),t(S,C,O-.35),t(F,C,O-.35)],[0,-1,0],[0,7,h,m],$),p([t(F,N,O-.35),t(F,C,O-.35),t(F,C,O),t(F,N,O)],[-1,0,0],M,$);for(const W of[N,C])p([t(F,W,O-.35),t(S,W,O-.35),t(S,W,O),t(F,W,O)],[0,0,W===N?-1:1],M,[0,O-.35,.35,1]);const D=[0,.86,0,0];p([t(F+.1,N,O+1.02),t(F+.1,C,O+1.02),t(F+.1,C,O+1.12),t(F+.1,N,O+1.12)],[-1,0,0],z,D),p([t(F+.1,N,O+1.12),t(F+.22,N,O+1.12),t(F+.22,C,O+1.12),t(F+.1,C,O+1.12)],[0,1,0],z,D);for(let W=0;W<=3;W++){const U=N+(C-N)*W/3-.04;p([t(F+.1,U,O),t(F+.1,U+.08,O),t(F+.1,U+.08,O+1.02),t(F+.1,U,O+1.02)],[-1,0,0],z,D)}}}p([t(0,s,o),t(12,s,o),t(12,-s,o),t(0,-s,o)],[0,-1,0],E,b);for(const y of[-1,1])p([t(0,y*s,0),t(12,y*s,0),t(12,y*s,o),t(0,y*s,o)],[0,0,-y],E,b);p([t(12,-s,0),t(12,s,0),t(12,s,o),t(12,-s,o)],[-1,0,0],[-3,0,h,m],[[-s,0,0,0],[s,0,0,0],[s,0,0,0],[-s,0,0,0]]);for(const[y,z,L,M,R,H,I]of[[-s-A,-s,0,o+A,0,1,0],[s,s+A,0,o+A,1,0,0],[-s,s,o,o+A,0,0,1]]){const B=(P,V)=>[0,I?V===L?1:0:P===y?R:H,0,0];p([t(-x,y,L),t(-x,z,L),t(-x,z,M),t(-x,y,M)],[-1,0,0],g,[B(y,L),B(z,L),B(z,M),B(y,M)]),p([t(-x,y,L),t(.4,y,L),t(.4,y,M),t(-x,y,M)],[0,0,-1],g,[R,0,0,0]),p([t(-x,z,L),t(.4,z,L),t(.4,z,M),t(-x,z,M)],[0,0,1],g,[H,0,0,0]),p([t(-x,y,M),t(-x,z,M),t(.4,z,M),t(.4,y,M)],[0,1,0],g,[0,0,0,0]),p([t(-x,y,L),t(-x,z,L),t(.4,z,L),t(.4,y,L)],[0,-1,0],g,[I,0,0,0])}}for(const[o,t]of a.lifts||[]){const E=d-2.6,g=a.z+o-3,b=a.z+o+3,A=w.SLAB-2,x=[2,l++,h,m];p([[E,t,g],[E,t,b],[E,A,b],[E,A,g]],[-1,0,0],x,[[-1,t,0,0],[1,t,0,0],[1,t,0,0],[-1,t,0,0]]);for(const[v,T]of[[g,-1],[b,1]])p([[E,t,v],[d,t,v],[d,A,v],[E,A,v]],[0,0,T],x,[.6*T,t,0,0]);t>0&&p([[E,t,g],[d,t,g],[d,t,b],[E,t,b]],[0,-1,0],x,[9,t,0,0])}for(const o of a.shafts||[]){const t=o.top!==void 0?o.top:(a.great?w.SLAB:a.h)-1.5,E=[2,l++,h,m],g=[[-1,0,0,0],[1,0,0,0],[1,0,0,0],[-1,0,0,0]],b=[9,0,0,0];if(o.face==="w"){const A=(o.at!==void 0?o.at:Math.min(...a.pile.map(y=>y.x0)))-2.2,x=A+2.2,v=a.z+o.off-2.5,T=v+5;p([[A,0,v],[A,0,T],[A,t,T],[A,t,v]],[-1,0,0],E,g);for(const[y,z]of[[v,-1],[T,1]])p([[A,0,y],[x,0,y],[x,t,y],[A,t,y]],[0,0,z],E,[.6*z,0,0,0]);p([[x,0,v],[x,0,T],[x,t,T],[x,t,v]],[1,0,0],E,b),p([[A,t,v],[x,t,v],[x,t,T],[A,t,T]],[0,1,0],E,b)}else{const A=(o.at!==void 0?o.at:Math.max(...a.pile.map(y=>y.z1)))+2.2,x=A-2.2,v=a.x+o.off-2.5,T=v+5;p([[v,0,A],[T,0,A],[T,t,A],[v,t,A]],[0,0,1],E,g);for(const[y,z]of[[v,-1],[T,1]])p([[y,0,A],[y,0,x],[y,t,x],[y,t,A]],[z,0,0],E,[.6*z,0,0,0]);p([[v,0,x],[T,0,x],[T,t,x],[v,t,x]],[0,0,-1],E,b),p([[v,t,x],[T,t,x],[T,t,A],[v,t,A]],[0,1,0],E,b)}}});const f=Oe(n,r);return f.setAttribute("aT",new k.Float32BufferAttribute(c,4)),f.setAttribute("aU",new k.Float32BufferAttribute(i,4)),f}const $o=`
vec3 carpetWeave(vec2 p, vec2 dx, vec2 dy){
  vec2 f2 = max(abs(dx) + abs(dy), vec2(.03));
  float fm = max(f2.x, f2.y);
  vec2 t = p / 3., ti = floor(t), dl = 1.5 - abs(fract(t) - .5) * 3.;
  vec2 ov = clamp(min(dl + .5 * f2, vec2(.12)) - max(dl - .5 * f2, vec2(-.12)), 0., 1.) / f2;
  ov = mix(ov, vec2(.08), smoothstep(1.2, 3., f2));
  float chk = mod(ti.x + ti.y, 2.);
  vec2 pg = floor(p * 9.);
  float pile = fract(sin(dot(pg, vec2(27.619, 57.583))) * 24634.6345 + cos(dot(pg, vec2(41.233, 13.171))) * 7919.137);
  return vec3(mix(.35 + .3 * chk, .5, smoothstep(.8, 2.5, fm)), 1. - (1. - ov.x) * (1. - ov.y), 1. + .16 * (pile - .5) * (1. - smoothstep(.03, .12, fm)));
}
`,pe={by:[.75,1.2],turn:[1.25,.4],seam:[.4,.8,.3]},Oa=(pe.by[0]+pe.by[1])/2*(pe.turn[0]+pe.turn[1])/2,Do=`
varying vec3 vW;
${ue}${Dt}
void main(){
  vec4 w = modelMatrix * vec4(position, 1.);
  w.y += tide(w.xz).x;
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Co=`
varying vec3 vW;
uniform vec3 uBlueA, uBlueB, uSeam, uFogIn; uniform float uFogKIn;
uniform sampler2D tLamps;
${ue}${Dt}${$o}
void main(){
  vec2 p = vW.xz, dx = dFdx(p), dy = dFdy(p);
  float fw = sqrt(abs(dx.x * dy.y - dx.y * dy.x) + 1e-8), a = max(fw, .03);
  vec3 td = tide(p);
  vec3 toEye = cameraPosition - vW;
  float dist = length(toEye);
  vec3 v = toEye / max(dist, 1e-3);
  // (round nine) A GRID OF PALE LINES 3 m APART is laid in the carpet: over the swells the lines are seen to bend.
  // Between them the carpet's two blues lie as a faint check; near the lens, the pile's own grain (carpetWeave).
  vec3 cw = carpetWeave(p, dx, dy);
  float seamCov = cw.y;
  vec3 col = mix(uBlueA, uBlueB, cw.x) * cw.z;
  // THE CARPET READ AS A SEA (round nine): LIGHT BY HEIGHT, BROAD AND SMOOTH. The crests stand clearly lighter and
  // the troughs deeper, in long bands that are the two trains' own; a soft sheen lies on what is seen at a skimming
  // angle; A FINE PALER LINE runs along each crest. No speckle lies on it.
  float hN = clamp(td.x / 1.8, -1., 1.);
  // (lean: 1 where a face leans its most toward the light, -1 where it leans its most away)
  float lean = clamp(-dot(td.yz, vec2(.94, .34)) * 6.5, -1., 1.);
  // THE LIGHT A PLACE TAKES (0 to 1) GOES BY ITS HEIGHT, EACH TRAIN BY ITSELF: the long swell's crests light and its
  // troughs deep (0.6 of it), the short train's crests and troughs the same (0.45: they band the floor every 23 m:
  // nine of them lie across the hall from north to south), a little by the lean. (Light by the lean alone shows
  // one who looks from the lit side pale faces only: the faces that lean away are foreshortened to slivers.)
  // A linear shade is pressed flat by the filmic curve, so the two ends are given as they are read: THE TROUGHS GO
  // TO A DEEP NAVY, THE CRESTS TO A LIGHT CORNFLOWER BLUE, the carpet's own blue between; the pale lines of the
  // grid go with them. A FINE PALE LINE runs along every crest of both trains. Near the walls, where the swell
  // is a third, the shade is a third too.
  float e2 = tideEdge(p), th2 = uTr[1].x * p.x + uTr[1].y * p.y - uTr[1].z * uTime + uTr[1].w, s2 = sin(th2);
  float s1 = clamp((td.x / e2 - uTa.y * s2) / uTa.x, -1., 1.);
  float L = clamp(.5 + .5 * e2 * (.6 * s1 + .45 * s2 + .2 * lean), 0., 1.);
  vec3 n = normalize(vec3(-td.y, 1., -td.z));
  float sheen = pow(clamp(1. - dot(n, v), 0., 1.), 3.);
  float crest = (1. - smoothstep(.005, .02, abs(dot(td.yz, vec2(.7071, .7071))))) * smoothstep(.25, .7, hN);
  float fc = max(fwidth(th2), .03), crest2 = (1. - smoothstep(.1 - fc, .1 + fc, abs(cos(th2)))) * step(0., s2) * min(1., .2 / fc) * e2;
  col = mix(${Pe(.05,.07,.3)}, col * mix(${pe.by[0].toFixed(2)}, ${pe.by[1].toFixed(2)}, L), smoothstep(0., .5, L));
  col = mix(col, ${Pe(.5,.63,.97)}, .6 * smoothstep(.5, 1., L));
  // (round eleven) LIGHT THAT SAYS WATER. THE FACE OF A SWELL THAT TURNS TO THE LENS IS THE DARKER, THE FACE THAT
  // TURNS AWAY THE LIGHTER (turn: 1 where the carpet leans its most toward the eye in plan, -1 where it leans its
  // most away): so each swell between the eye and the far wall is one dark band and one light one, and they are
  // counted. The grid of pale lines is drawn faint: the carpet is a sea first and a floor second.
  float turn = clamp(dot(-td.yz, normalize(toEye.xz + 1e-4)) * 6., -1., 1.);
  col *= mix(${pe.turn[0].toFixed(2)}, ${pe.turn[1].toFixed(2)}, smoothstep(-1., 1., turn));
  col = mix(col, uSeam * (${pe.seam[0].toFixed(2)} + ${pe.seam[1].toFixed(2)} * L), seamCov * ${pe.seam[2].toFixed(2)});
  // ALONG EVERY CREST OF THE LONG SWELL RUNS A LINE OF GLINTS OF THE HALL'S LIGHT, and it goes with the crest:
  // dashes of warm white 2 m long and 3.6 m apart, lying where the carpet's slope along the swell's own bearing is
  // nothing and the carpet stands high (across: metres from the crest, by that slope over the crest's own bend;
  // both ways weighed by the pixel's reach, so that far off the dashes run together into one fine line).
  float across = dot(td.yz, vec2(.7071, .7071)) / (.0175 * e2), fx = max(fwidth(across), .03);
  float along = dot(p, vec2(-.7071, .7071)), fa = max(fwidth(along), .03), da = (fract(along / 3.6) - .5) * 3.6;
  float dash = clamp(min(da + .5 * fa, 1.) - max(da - .5 * fa, -1.), 0., fa) / fa;
  dash = mix(dash, .556, smoothstep(1.2, 3.6, fa));
  float glint = exp(-across * across / (.3 + fx * fx)) * sqrt(.3 / (.3 + fx * fx)) * dash * smoothstep(.3, .7, hN);
  // (the sheen of a skimming view lies on the far carpet only: near the lens the carpet keeps its depth)
  col += uSeam * (.3 * sheen * smoothstep(12., 80., dist) + .3 * crest + .34 * crest2);
  col = mix(col, vec3(1.5, 1.42, 1.2), min(glint, 1.));
  // (round ten) WARMTH. UNDER EVERY DESK LAMP OF THE FLEET A WARM POOL OF LIGHT LIES ON THE CARPET AND RIDES THE SWELL
  // WITH IT (tLamps: the lamps' places on the fleet's own lattice. THE PLACE IS TURNED INTO THE LATTICE'S OWN AXES,
  // back about the stair's axis by the lattice's turn, before its cell is looked up: pL; the place's own cell and
  // the eight round it are asked); round the stair's plinth lies its own pale light, and WHERE THE CARPET MEETS
  // THE PLINTH A FINE PALE LINE goes up and down it with the swell.
  vec2 dS = p - vec2(${J.x.toFixed(1)}, ${J.z.toFixed(1)}), pL = vec2(${J.x.toFixed(1)}, ${J.z.toFixed(1)}) + vec2(dS.x * ${Ge.toFixed(7)} - dS.y * ${je.toFixed(7)}, dS.x * ${je.toFixed(7)} + dS.y * ${Ge.toFixed(7)});
  vec2 cF = floor(vec2((pL.x - ${(ee.x0+de.n0*ee.dx).toFixed(1)}) / ${ee.dx.toFixed(1)}, (${(ee.z0-de.j0*ee.dz).toFixed(1)} - pL.y) / ${ee.dz.toFixed(1)}) + .5);
  float pool = 0.;
  for (int jj = -1; jj <= 1; jj++) for (int ii = -1; ii <= 1; ii++) {
    ivec2 c = ivec2(cF) + ivec2(ii, jj);
    if (c.x < 0 || c.x >= ${de.n1-de.n0+1} || c.y < 0 || c.y >= ${de.j1-de.j0+1}) continue;
    vec4 L4 = texelFetch(tLamps, c, 0);
    vec2 pc = pL - vec2(${(ee.x0+de.n0*ee.dx).toFixed(1)} + float(c.x) * ${ee.dx.toFixed(1)}, ${(ee.z0-de.j0*ee.dz).toFixed(1)} - float(c.y) * ${ee.dz.toFixed(1)}), d1 = pc - L4.xy, d2 = pc - L4.zw;
    pool += exp(-dot(d1, d1) / 3.6) + exp(-dot(d2, d2) / 3.6);
  }
  vec2 dO = p - vec2(${J.x.toFixed(1)}, ${J.z.toFixed(1)});
  float rO = length(dO);
  pool = min(pool, 1.2);
  col = mix(col, vec3(1., .62, .28) * (.5 + .22 * L), .7 * min(pool, 1.));
  // (round the stair's plinth: a pale light from under its rim, and the fine pale line where the carpet meets it)
  col = mix(col, uSeam * 1.25, .5 * exp(-max(rO - ${J.r.toFixed(1)}, 0.) / 3.5));
  col = mix(col, uSeam * 1.5, 1. - smoothstep(${(J.r+.42).toFixed(2)} - a, ${(J.r+.5).toFixed(2)} + a, rO));
  gl_FragColor = vec4(mix(col, uFogIn, 1. - exp(-dist * uFogKIn)), 1.);
}`;function _o(e,n){const r=ho,i=ae(se("fww-blue:"+e)).chance(.5)?["#2a49c7","#1e3aa8"]:["#1e3aa8","#4a3cc0"];return{trains:r,uniforms:{uTime:n,uTr:{value:r.map(p=>new k.Vector4(p.kx,p.kz,p.w,p.ph))},uTa:{value:new k.Vector2(r[0].a,r[1].a)},uBlueA:{value:Ve(i[0])},uBlueB:{value:Ve(i[1])},uSeam:{value:Ve("#a4b3f3")},uFogIn:{value:Ve("#f4f3ee",.92)},uFogKIn:{value:1/900},tLamps:{value:(()=>{const p=de,u=p.n1-p.n0+1,l=p.j1-p.j0+1,f=new k.DataTexture(new Uint16Array(u*l*4).fill(k.DataUtils.toHalfFloat(1e4)),u,l,k.RGBAFormat,k.HalfFloatType);return f.magFilter=k.NearestFilter,f.minFilter=k.NearestFilter,f.generateMipmaps=!1,f.needsUpdate=!0,f})()}}}}function qo(){const e=[],n=[],r=w.H1,c=w.H2,i=w.ROOF,p=w.OC,u=w.WELL,l=(A,x)=>{for(const v of[0,1,2,0,2,3])e.push(A[v][0],A[v][1],A[v][2]),n.push(x[0],x[1],x[2])},f=(A,x,v,T,y,z=!0,L={})=>{const M=y+.7,R=.5,H=A+R,I=x-R,B=v+R,P=T-R,V=(K,G,N,C,O,F)=>{const S=(D,W)=>O?[K,W,D]:[D,W,K],$=(D,W,U,_)=>{W>D+1e-6&&_>U+1e-6&&l([S(D,U),S(W,U),S(W,_),S(D,_)],C)};if(!F){$(G,N,i,M);return}$(G,F[0],i,M),$(F[1],N,i,M),$(F[0],F[1],F[2],M)};V(T,A,x,[0,0,1],!1,L.s),V(v,A,x,[0,0,-1],!1,L.n),V(A,v,T,[-1,0,0],!0,null),V(x,v,T,[1,0,0],!0,L.e);for(const[K,G,N,C]of[[A,x,v,B],[A,x,P,T],[A,H,B,P],[I,x,B,P]])l([[K,M,N],[G,M,N],[G,M,C],[K,M,C]],[0,1,0]);return l([[H,y,B],[I,y,B],[I,M,B],[H,M,B]],[0,0,1]),l([[H,y,P],[I,y,P],[I,M,P],[H,M,P]],[0,0,-1]),l([[H,y,B],[H,y,P],[H,M,P],[H,M,B]],[1,0,0]),l([[I,y,B],[I,y,P],[I,M,P],[I,M,B]],[-1,0,0]),z&&l([[H,y,B],[I,y,B],[I,y,P],[H,y,P]],[0,1,0]),[H,I,B,P]};f(-76.2,-59.8,c.z1+1.2,r.z0+.6,w.LINK_ROOF,!0,{n:[-76.2,-59.8,1e3],s:[-76.2,-59.8,1e3]});const a=w.LOBBY;f(-72.7,-63.3,r.z1-.6,a.z0-1.2,w.COR_ROOF,!0,{s:[-72.7,-63.3,1e3]}),f(a.x0-1.2,a.x1+1.2,a.z0-1.2,a.z1+1.2,a.roof);const h=w.CON,[m,s,d,o]=f(c.x0-1.2,c.x1+1.2,c.z0-1.2,c.z1+1.2,c.roof,!1,{s:[-76.2,-59.8,w.LINK_ROOF+.7],e:[h.z-h.w/2,h.z+h.w/2,11]}),t=[],E=u.r+u.thick;l([[c.x1,11,h.z-h.w/2],[c.x1+1.2,11,h.z-h.w/2],[c.x1+1.2,11,h.z+h.w/2],[c.x1,11,h.z+h.w/2]],[-1,0,0]);for(let A=0;A<96;A++)t.push(A/96*Math.PI*2);for(const[A,x]of[[m,d],[s,d],[s,o],[m,o]])t.push((Math.atan2(x-p.z,A-p.x)+Math.PI*2)%(Math.PI*2));t.sort((A,x)=>A-x);const g=A=>[p.x+E*Math.cos(A),c.roof,p.z+E*Math.sin(A)],b=A=>{const x=Math.cos(A),v=Math.sin(A),T=Math.min(x>1e-9?(s-p.x)/x:x<-1e-9?(m-p.x)/x:1e9,v>1e-9?(o-p.z)/v:v<-1e-9?(d-p.z)/v:1e9);return[p.x+T*x,c.roof,p.z+T*v]};for(let A=0;A<t.length;A++){const x=t[A],v=A+1<t.length?t[A+1]:t[0]+Math.PI*2;l([g(x),g(v),b(v),b(x)],[0,1,0])}return Oe(e,n)}function Go(){const e=[],n=[],r=w.H2,c=w.OC,i=w.WELL,p=96,u=i.r,l=i.r+i.thick,f=(h,m)=>{for(const s of[0,1,2,0,2,3])e.push(h[s][0],h[s][1],h[s][2]),n.push(m[0],m[1],m[2])},a=(h,m,s)=>[c.x+Math.cos(s)*h,m,c.z+Math.sin(s)*h];for(let h=0;h<p;h++){const m=h/p*Math.PI*2,s=(h+1)/p*Math.PI*2,d=(m+s)/2,o=[Math.cos(d),0,Math.sin(d)],t=[-o[0],0,-o[2]];f([a(u,i.foot,m),a(u,i.foot,s),a(u,i.top,s),a(u,i.top,m)],t),f([a(u,i.foot,m),a(u,i.foot,s),a(l,i.foot,s),a(l,i.foot,m)],[0,-1,0]),f([a(l,i.foot,m),a(l,i.foot,s),a(l,r.h,s),a(l,r.h,m)],o),f([a(l,r.roof,m),a(l,r.roof,s),a(l,i.top,s),a(l,i.top,m)],o),f([a(u,i.top,m),a(u,i.top,s),a(l,i.top,s),a(l,i.top,m)],[0,1,0])}for(const[h,m]of $t)for(let s=0;s<10;s++){const d=s/10*Math.PI*2,o=(s+1)/10*Math.PI*2,t=(d+o)/2,E=(g,b)=>[h+i.colR*Math.cos(g),b,m+i.colR*Math.sin(g)];f([E(d,r.deep),E(o,r.deep),E(o,i.foot),E(d,i.foot)],[Math.cos(t),0,Math.sin(t)])}return Oe(e,n)}function Vt(e,n,r,c,i,p,u,l,f=1.2){const a=Math.hypot(c[0]-r[0],c[1]-r[1]),h=[(c[0]-r[0])/a,(c[1]-r[1])/a],m=(E,g)=>{for(const b of[0,1,2,0,2,3])e.push(E[b][0],E[b][1],E[b][2]),n.push(g[0],g[1],g[2])},s=[r[0]-h[0]*f,r[1]-h[1]*f],d=[c[0]+h[0]*f,c[1]+h[1]*f],o=[s[0]+i[0]*f,s[1]+i[1]*f],t=[d[0]+i[0]*f,d[1]+i[1]*f];p<u&&m([[r[0],p,r[1]],[c[0],p,c[1]],[c[0],u,c[1]],[r[0],u,r[1]]],[-i[0],0,-i[1]]),m([[s[0],u,s[1]],[d[0],u,d[1]],[t[0],u,t[1]],[o[0],u,o[1]]],[0,1,0]),l<u&&m([[o[0],l,o[1]],[t[0],l,t[1]],[t[0],u,t[1]],[o[0],u,o[1]]],[i[0],0,i[1]])}function jo(){const e=[],n=[],r=w.CON,c=w.ROOF,i=r.z-r.w/2,p=r.z+r.w/2;return Vt(e,n,[r.x0+2.8,i],[r.x1-3,i],[0,-1],r.h,r.cope,c,1.6),Vt(e,n,[r.x0+2.8,p],[r.x1-3,p],[0,1],r.h,r.cope,c,1.6),Oe(e,n)}const Uo=`
attribute vec3 color; attribute vec3 aG;
uniform float uTime;
varying vec3 vW; varying vec3 vN; varying vec3 vCol; varying vec3 vG;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.);
  // (round eight: THE LEAVES STIR, each crown by its own place and the clock, more toward its top; A JET OF WATER
  // (kind 4) rises and falls a little and trembles)
  float up = max(w.y - aG.z, 0.);
  if (aG.x > 2.5 && aG.x < 3.5) w.xz += .028 * up * vec2(sin(uTime * 1.1 + w.x * .5 + w.z * .3), cos(uTime * .87 + w.z * .6 - w.x * .2));
  if (aG.x > 3.5) w.y = aG.z + up * (.82 + .18 * sin(uTime * 2.3 + w.x * .9 + w.z * .7)) + .03 * sin(uTime * 11. + w.x * 5.);
  vW = w.xyz; vN = normal; vCol = color; vG = aG;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Vo=`
varying vec3 vW; varying vec3 vN; varying vec3 vCol; varying vec3 vG;
uniform vec3 uFog; uniform float uFogK; uniform vec4 uTow[17];
${ue}${Me}${Te}
void main(){
  vec3 alb = vCol, n = normalize(vN);
  float kind = vG.x, lamp = step(.5, kind) * step(kind, 1.5), jet = step(3.5, kind), leaf = step(2.5, kind) * step(kind, 3.5);
  float fw = max(fwidth(vW.x) + fwidth(vW.z), .02), hgt = max(vW.y - vG.z, 0.);
  // (a bed's planting: rows of two near greens run down it, seen only near)
  if (kind > 1.5 && kind < 2.5) alb *= 1. + .16 * (step(.5, fract(vW.x / 1.25)) - .5) * (1. - smoothstep(.3, .9, fw));
  // (round nine) LIT BY LAMPS ONLY. What grows and stands here is deep blue-green where no lamp reaches it; A TREE
  // IS LIT FROM BELOW by the standard beside it: the faces of its crown that look down are warm and bright, those
  // that look up stand deep; a trunk, a tub, a bench, a rail take the lamps' light low down. Every lamp's globe is
  // lit warm; under each front of the lights' wave a globe swells.
  vec3 amb = vec3(.2, .27, .5), warm = vec3(1.05, .88, .6);
  float low = exp(-hgt / 4.);
  vec3 light = amb + warm * (leaf > .5 ? (.3 + .9 * smoothstep(.6, -.7, n.y)) * mix(.6, 1.1, low) : .7 * low + .12);
  vec3 col = min(alb * light, vec3(.88));
  float wv = waveHump(vW.x + vW.z);
  vec3 lin3 = mix(lit3(col), vec3(1.5, 1.26, .84) * (.85 + .5 * wv), lamp);
  // (a jet of water: lit from under, a cool white that sparkles along its fall)
  lin3 = mix(lin3, vec3(.8, .92, 1.1) * (.9 + .6 * step(.6, fract(vW.y * 3.1 + uTime * 2.7 + vW.x))), jet);
  gl_FragColor = vec4(nightAir(lin3, cameraPosition, vW - cameraPosition), 1.);
}`,Fa=[[.9,.5,.64],[.93,.92,.86],[.66,.55,.88]],We=[.36,.62,.3],Kt=[.22,.48,.25],Yt=[.25,.53,.27],Ko=[.33,.62,.31],Yo=[.44,.4,.36],ht=[.9,.88,.82],Zo=[.34,.36,.42],et=[.93,.93,.9],Lt=[[.07,0],[.7,.07],[1,.18],[.82,.31],[.42,.385],[.76,.48],[.66,.62],[.3,.69],[.52,.78],[.44,.88],[.05,1]],Xo=[[.07,0],[1,.17],[.42,.385],[.76,.5],[.3,.69],[.5,.8],[.05,1]],Zt=e=>e.map((n,r)=>{const c=e[Math.max(r-1,0)],i=e[Math.min(r+1,e.length-1)],p=i[0]-c[0],u=i[1]-c[1],l=Math.hypot(p,u)||1;return[u/l,-p/l]});function Xt(){const e=[],n=[],r=[],c=[],i=(l,f,a,h)=>{e.push(l[0],l[1],l[2]),n.push(f[0],f[1],f[2]),r.push(a[0],a[1],a[2]),c.push(h[0],h[1],h[2])},p=(l,f,a,h,m,s,d)=>{i(l,m,s,d),i(f,m,s,d),i(a,m,s,d),i(l,m,s,d),i(a,m,s,d),i(h,m,s,d)},u={quad:p,box(l,f,a,h,m,s,d,o){return p([l,h,s],[f,h,s],[f,h,m],[l,h,m],[0,1,0],d,o),u.sides(l,f,a,h,m,s,d,o),u},sides(l,f,a,h,m,s,d,o){p([l,a,s],[f,a,s],[f,h,s],[l,h,s],[0,0,1],d,o),p([f,a,m],[l,a,m],[l,h,m],[f,h,m],[0,0,-1],d,o),p([f,a,s],[f,a,m],[f,h,m],[f,h,s],[1,0,0],d,o),p([l,a,m],[l,a,s],[l,h,s],[l,h,m],[-1,0,0],d,o)},block(l,f,a,h,m,s,d,o,t,E){const g=(b,A,x)=>[l+a*b-h*A,x,f+h*b+a*A];return p(g(-m,-s,o),g(-m,s,o),g(m,s,o),g(m,-s,o),[0,1,0],t,E),p(g(-m,s,d),g(m,s,d),g(m,s,o),g(-m,s,o),[-h,0,a],t,E),p(g(m,-s,d),g(-m,-s,d),g(-m,-s,o),g(m,-s,o),[h,0,-a],t,E),p(g(m,s,d),g(m,-s,d),g(m,-s,o),g(m,s,o),[a,0,h],t,E),p(g(-m,-s,d),g(-m,s,d),g(-m,s,o),g(-m,-s,o),[-a,0,-h],t,E),u},prism(l,f,a,h,m,s,d,o,t,E=0,g=0){const b=(h-m)/Math.max(Math.hypot(h-m,d-s),1e-6),A=Math.sqrt(Math.max(1-b*b,0));for(let x=0;x<l;x++){const v=g+x/l*Math.PI*2,T=g+(x+1)/l*Math.PI*2,y=(v+T)/2,z=[Math.cos(y)*A,b,Math.sin(y)*A],L=[f+h*Math.cos(v),s,a+h*Math.sin(v)],M=[f+h*Math.cos(T),s,a+h*Math.sin(T)],R=[f+m*Math.cos(T),d,a+m*Math.sin(T)],H=[f+m*Math.cos(v),d,a+m*Math.sin(v)];m>0&&h>0?p(M,L,H,R,z,o,t):h>0?(i(M,z,o,t),i(L,z,o,t),i([f,d,a],z,o,t)):(i([f,s,a],z,o,t),i(H,z,o,t),i(R,z,o,t)),E&&(i([f,d,a],[0,1,0],o,t),i(R,[0,1,0],o,t),i(H,[0,1,0],o,t))}return u},bed(l,f,a,h,m,s,d=-99,o=Kt){const t=[0,d,m],E=[2,d,m],g=Math.min(.7,(f-l)/3,(h-a)/3),b=m+s,A=l+g,x=f-g,v=a+g,T=h-g,y=[0,1,0];return u.sides(l,f,m,b,a,h,We,t),p([l,b,a],[l,b,h],[A,b,T],[A,b,v],y,We,t),p([f,b,h],[f,b,a],[x,b,v],[x,b,T],y,We,t),p([l,b,a],[A,b,v],[x,b,v],[f,b,a],y,We,t),p([l,b,h],[f,b,h],[x,b,T],[A,b,T],y,We,t),p([A,b,T],[x,b,T],[x,b,v],[A,b,v],y,o,E),u},tree(l,f,a,h,m,s=0){const d=.26*h,o=[3,m,a],t=8;u.prism(3,l,f,.035*h+.05,.03*h+.04,a,a+.36*h,Yo,[0,m,a],0,s);const E=Lt.map(([A,x])=>[A*d,a+(.3+.7*x)*h]),g=Zt(E),b=Lt.map(([A])=>{const x=Math.min(Math.max((A-.35)/.6,0),1);return[0,1,2].map(v=>Yt[v]*.82+(Ko[v]-Yt[v]*.82)*x)});for(let A=0;A+1<E.length;A++)for(let x=0;x<t;x++){const v=s+x/t*Math.PI*2,T=s+(x+1)/t*Math.PI*2,y=(L,M)=>[l+E[L][0]*Math.cos(M),E[L][1],f+E[L][0]*Math.sin(M)],z=(L,M)=>[g[L][0]*Math.cos(M),g[L][1],g[L][0]*Math.sin(M)];i(y(A,T),z(A,T),b[A],o),i(y(A,v),z(A,v),b[A],o),i(y(A+1,v),z(A+1,v),b[A+1],o),i(y(A,T),z(A,T),b[A],o),i(y(A+1,v),z(A+1,v),b[A+1],o),i(y(A+1,T),z(A+1,T),b[A+1],o)}return u},jet(l,f,a,h,m,s=1.2,d=1.5){const o=[4,-99,m],t=4,E=-h*.07,g=a*.07;for(let b=0;b<t;b++){const A=b/t,x=(b+1)/t,v=[l+a*d*A,m+s*4*A*(1-A),f+h*d*A],T=[l+a*d*x,m+s*4*x*(1-x),f+h*d*x];p([v[0]-E,v[1],v[2]-g],[v[0]+E,v[1],v[2]+g],[T[0]+E,T[1],T[2]+g],[T[0]-E,T[1],T[2]-g],[0,1,0],[.9,.94,1],o)}return u},standard(l,f,a,h=4.5){return u.prism(4,l,f,.1,.07,a,a+h-.36,Zo,[0,-99,a]),u.prism(6,l,f,.12,.42,a+h-.4,a+h,[1,.86,.6],[1,-99,a]).prism(6,l,f,.42,0,a+h,a+h+.36,[1,.86,.6],[1,-99,a]),u},get triangles(){return e.length/9},build(){const l=Oe(e,n);return l.setAttribute("color",new k.Float32BufferAttribute(r,3)),l.setAttribute("aG",new k.Float32BufferAttribute(c,3)),l},*buildStages(){const l=new k.BufferGeometry;return l.setAttribute("position",new k.Float32BufferAttribute(e,3)),yield null,l.setAttribute("normal",new k.Float32BufferAttribute(n,3)),yield null,l.setAttribute("color",new k.Float32BufferAttribute(r,3)),yield null,l.setAttribute("aG",new k.Float32BufferAttribute(c,3)),l}};return u}function*Qo(e){const n=Xt(),r=ae(se("fww-garden:"+e)),c=w.H2,i=c.roof,p=w.OC,u=w.WELL,l=[];for(let s=we;s<=xe+80;s+=3){const d=fe(s);l.push(d[0],d[1])}const f=(s,d)=>{let o=1e18;for(let t=0;t<l.length;t+=2){const E=s-l[t],g=d-l[t+1],b=E*E+g*g;b<o&&(o=b)}return Math.sqrt(o)};for(let s=-6;s<=4;s++)for(let d=-8;d<=2;d++){d===-8&&s>-6&&(s+6)%2===0&&(yield null);const o=Fe.strip+27*s+1.35,t=Fe.row+27*d+1.05;if(o>Fe.x0-2&&o<Fe.x1-5&&t>Fe.z0-2&&t<Fe.z1+2&&Math.hypot(o-p.x,t-p.z)>Fe.well+4&&(n.standard(o,t,i),f(o+3.15,t)>=10)){const E=r.range(3.4,5.2),g=r.range(0,1);n.prism(8,o+3.15,t,1,1.25,i,i+.9,ht,[0,-99,i],1),n.tree(o+3.15,t,i+.8,E,-99,g)}}yield null;const a=96,h=(s,d,o)=>[p.x+s*Math.cos(o),d,p.z+s*Math.sin(o)],m=[0,-99,u.top];for(let s=0;s<a;s++){s%24===23&&(yield null);const d=s/a*Math.PI*2,o=(s+1)/a*Math.PI*2,t=(d+o)/2,E=[Math.cos(t),0,Math.sin(t)],g=[-E[0],0,-E[2]],b=u.r+.7;n.prism(4,p.x+b*Math.cos(d),p.z+b*Math.sin(d),.07,.07,u.top,u.top+1.08,et,m,0,d+.785),n.quad(h(b-.1,u.top+1.2,d),h(b+.1,u.top+1.2,d),h(b+.1,u.top+1.2,o),h(b-.1,u.top+1.2,o),[0,1,0],et,m),n.quad(h(b-.1,u.top+1.08,d),h(b-.1,u.top+1.08,o),h(b-.1,u.top+1.2,o),h(b-.1,u.top+1.2,d),g,et,m),n.quad(h(b+.1,u.top+1.08,o),h(b+.1,u.top+1.08,d),h(b+.1,u.top+1.2,d),h(b+.1,u.top+1.2,o),E,et,m),n.quad(h(b,u.top+.5,d),h(b,u.top+.5,o),h(b,u.top+.58,o),h(b,u.top+.58,d),g,et,m),s%3===0&&n.prism(4,p.x+b*Math.cos(d),p.z+b*Math.sin(d),.12*Math.SQRT1_2,.12*Math.SQRT1_2,u.top+1.2,u.top+2.2,[1,.86,.6],[1,-99,u.top],1,d+.785);const A=Math.min(Math.abs(Math.sin(t)),Math.abs(Math.cos(t)))*45.8<2.2,x=[0,-99,i],v=i+1;A||(n.quad(h(44.6,v,d),h(47,v,d),h(47,v,o),h(44.6,v,o),[0,1,0],Kt,[2,-99,i]),n.quad(h(44.6,i,d),h(44.6,i,o),h(44.6,v,o),h(44.6,v,d),g,We,x),n.quad(h(47,i,o),h(47,i,d),h(47,v,d),h(47,v,o),E,We,x))}return yield null,yield*n.buildStages()}function Jo(){const e=q,n=[],r=(c,i)=>Math.hypot(c-e.a.s,i-e.a.n)>e.a.r+1&&Math.hypot(c-e.b.s,i-e.b.n)>e.b.r+1&&vt(c,i)[1]<e.zc-3;for(const c of[-1,1])for(let i=1;i<16;i++){const p=e.a.s+13*i;r(p,c*8.5)&&n.push([0,p,c*8.5]),r(p+6.5,c*10.8)&&n.push([1,p+6.5,c*10.8])}for(const c of[e.a,e.b]){const i=c.r-4.5,p=Math.round(2*Math.PI*i/9);for(let u=0;u<p;u++)for(const[l,f,a]of[[0,0,6.5],[1,.5,8.5]]){const h=(u+f)/p*2*Math.PI,m=c.s+i*Math.cos(h),s=c.n+i*Math.sin(h);Math.abs(s)>=a&&n.push([l,m,s])}}return n}function ea(){const e=q,n=[],r=[],c=[],i=.03,p=w.ROOF,u=(x,v,T)=>{const y=vt(x,v);return[y[0],T,y[1]]},l=(x,v)=>[x*Q-v*X,0,x*X+v*Q],f=(x,v,T,y,z,L,M,R)=>{for(const[H,I]of[[x,z],[v,L],[T,M]])n.push(H[0],H[1],H[2]),r.push(y[0],y[1],y[2]),c.push(I,R)},a=[0,1,0];for(const x of[e.a,e.b])for(let v=0;v<48;v++){const T=v/48*Math.PI*2,y=(v+1)/48*Math.PI*2;f(u(x.s,x.n,i),u(x.s+x.r*Math.cos(y),x.n+x.r*Math.sin(y),i),u(x.s+x.r*Math.cos(T),x.n+x.r*Math.sin(T),i),a,0,0,0,0)}const h=x=>(e.zc-e.oz-x*Q)/X,m=h(-e.hw),s=h(e.hw);f(u(e.a.s,-e.hw,i),u(m,-e.hw,i),u(s,e.hw,i),a,0,0,0,0),f(u(e.a.s,-e.hw,i),u(s,e.hw,i),u(e.a.s,e.hw,i),a,0,0,0,0);const d=(x,v,T,y,z,L,M,R)=>{const H=l(z,L),I=u(x,v,0),B=u(T,y,0),P=u(T,y,p),V=u(x,v,p);f(I,B,P,H,M,R,R,1),f(I,P,V,H,M,R,M,1)},o=Math.asin(e.hw/e.a.r),t=e.a.s+e.a.r*Math.cos(o),E=Math.sqrt(e.b.r*e.b.r-(e.hw+e.b.n)**2),g=Math.asin((-e.hw-e.b.n)/e.b.r),b=(x,v,T,y)=>{for(let z=0;z<y;z++){const L=v+(T-v)*z/y,M=v+(T-v)*(z+1)/y,R=(L+M)/2;d(x.s+x.r*Math.cos(L),x.n+x.r*Math.sin(L),x.s+x.r*Math.cos(M),x.n+x.r*Math.sin(M),-Math.cos(R),-Math.sin(R),x.r*L,x.r*M)}};b(e.a,o,2*Math.PI-o,44),d(t,-e.hw,e.b.s-E,-e.hw,0,1,t,e.b.s-E),d(e.b.s+E,-e.hw,m,-e.hw,0,1,e.b.s+E,m),d(t,e.hw,s,e.hw,0,-1,t,s),b(e.b,Math.PI-g,2*Math.PI+g,30);for(const[x,v]of[[m,-e.hw],[s,e.hw]]){const T=(L,M,R)=>u(x+L,v+M,R);for(const[L,M,R,H,I,B]of[[-.9,-.9,.9,-.9,0,-1],[.9,-.9,.9,.9,1,0],[.9,.9,-.9,.9,0,1],[-.9,.9,-.9,-.9,-1,0]]){const P=l(I,B);f(T(L,M,0),T(R,H,0),T(R,H,10.5),P,0,0,0,2),f(T(L,M,0),T(R,H,10.5),T(L,M,10.5),P,0,0,0,2)}f(T(-.9,-.9,10.5),T(.9,-.9,10.5),T(.9,.9,10.5),a,0,0,0,2),f(T(-.9,-.9,10.5),T(.9,.9,10.5),T(-.9,.9,10.5),a,0,0,0,2)}const A=Oe(n,r);return A.setAttribute("uv",new k.Float32BufferAttribute(c,2)),A}const ta=`
varying vec3 vW; varying vec3 vN; varying vec2 vUv;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.);
  vW = w.xyz; vN = normal; vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,oa=`
varying vec3 vW; varying vec3 vN; varying vec2 vUv;
uniform vec4 uTow[17]; uniform vec3 uStoB[10];
${ue}${Me}${Te}${yt}${Ue}${qt}${Gt}${_t}
// the light a lamp standard lays on the paving d2 (metres squared) from its foot
float poolOf(float d2){ return exp(-d2 / 12.) + .3 * exp(-d2 / 80.); }
// a ring's standard and tree nearest a place rc (from the plaza's middle C: s, n, radius): x the standard's pool
// there, y the tree's bed (metres to its middle)
vec2 ringAt(vec2 sn, vec3 C){
  vec2 r = sn - C.xy;
  float rr = C.z - 4.5, N = floor(6.2831853 * rr / 9. + .5), st = 6.2831853 / N, a = atan(r.y, r.x);
  float a0 = floor(a / st + .5) * st, a1 = (floor(a / st) + .5) * st;
  vec2 p0 = C.xy + rr * vec2(cos(a0), sin(a0)), p1 = C.xy + rr * vec2(cos(a1), sin(a1));
  return vec2(abs(p0.y) >= 6.5 ? poolOf(dot(sn - p0, sn - p0)) : 0., abs(p1.y) >= 8.5 ? length(sn - p1) : 99.);
}
void main(){
  vec2 p = vW.xz, sn = blvdOf(p);
  float fw = max(fwidth(p.x) + fwidth(p.y), .02), near1 = 1. - smoothstep(1.2, 4., fw), jw = max(fw, .03);
  vec3 LAMPW = vec3(1., .84, .56), col, emis = vec3(0.), linW = vec3(0.);
  float wm = 0., wv = waveHump(p.x + p.y) * (1. - smoothstep(8., 30., fw)), bd = blvdD(sn);
  if (vUv.y < .5) {
    // THE PAVING: warm stone in courses of 1.5 m across the street, slabs of 3 m; down its middle A PALER STRIP 4.4 m
    // broad with THE BEADS, one to every 6 m, running by the lights' one law; IN EACH PLAZA rings of a deeper
    // stone every 3 m about its middle and A ROUND POOL: still water, a dark mirror of the slab's lights and of
    // the towers, in a pale kerb 0.9 m broad with a line of turquoise light under its lip (the canal's own make).
    // A POOL OF WARM LIGHT lies under every lamp standard, A ROUND BED OF PLANTING under every tree (see
    // blvdStands: the same places); a glow of light along the walls' feet.
    float s = sn.x, n = sn.y, an = abs(n);
    vec2 ra = sn - BV_A.xy, rb = sn - BV_B.xy;
    float dA = length(ra), dB = length(rb);
    vec2 tj = (.5 - abs(fract(vec2(s / 3. + .5 * floor(n / 1.5), n / 1.5)) - .5)) * vec2(3., 1.5);
    float jt = max(clamp((.03 - tj.x) / jw + .5, 0., 1.), clamp((.03 - tj.y) / jw + .5, 0., 1.)) * clamp(.06 / jw, 0., 1.);
    vec3 stone = vec3(.74, .67, .55) * (1. - .16 * jt);
    // the plazas' rings (not over the street's own middle)
    float inP = max(1. - smoothstep(BV_A.z - .5, BV_A.z, dA), (1. - smoothstep(BV_B.z - .5, BV_B.z, dB)) * smoothstep(9., 9.6, an));
    float dP = dA < BV_A.z ? dA : dB, rg = (.5 - abs(fract(dP / 3.) - .5)) * 3.;
    stone = mix(stone, vec3(.6, .53, .44), inP * clamp((.3 - rg) / jw + .5, 0., 1.) * clamp(.6 / jw, 0., 1.));
    // the street's middle strip, from the head pool's kerb on
    float midS = (1. - smoothstep(2.2 - jw, 2.2 + jw, an)) * smoothstep(${(q.a.pool+3).toFixed(1)}, ${(q.a.pool+4).toFixed(1)}, dA) * step(BV_A.x, s + ${(q.a.pool+3).toFixed(1)});
    stone = mix(stone, vec3(.84, .78, .66), .8 * midS);
    // the lamps' pools: the street's two rows, the two rings
    float k13 = floor((s - BV_A.x) / 13. + .5), sk = BV_A.x + 13. * k13, nk = n < 0. ? -8.5 : 8.5;
    vec2 pk = vec2(sk, nk);
    float okS = step(.5, k13) * step(BV_A.z + 1., length(pk - BV_A.xy)) * step(BV_B.z + 1., length(pk - BV_B.xy)) * step(${q.oz.toFixed(3)} + sk * ${X.toFixed(5)} + nk * ${Q.toFixed(5)}, ${(q.zc-3).toFixed(1)});
    float gp = okS * poolOf(dot(sn - pk, sn - pk));
    vec2 rA = ringAt(sn, BV_A), rB = ringAt(sn, BV_B);
    gp += rA.x + rB.x;
    // the trees' beds: the street's two rows, the two rings
    float k65 = floor((s - BV_A.x - 6.5) / 13. + .5), st = BV_A.x + 6.5 + 13. * k65, nt = n < 0. ? -10.8 : 10.8;
    vec2 pt = vec2(st, nt);
    float okT = step(.5, k65) * step(BV_A.z + 1., length(pt - BV_A.xy)) * step(BV_B.z + 1., length(pt - BV_B.xy)) * step(${q.oz.toFixed(3)} + st * ${X.toFixed(5)} + nt * ${Q.toFixed(5)}, ${(q.zc-3).toFixed(1)});
    float dBed = min(okT > .5 ? length(sn - pt) : 99., min(rA.y, rB.y));
    gp = min(gp * (.8 + .4 * wv), 1.);
    float foot = exp(min(bd, 0.) / 1.8);
    col = stone * (vec3(.3, .33, .5) + LAMPW * (.2 + .95 * gp + .3 * foot));
    col = mix(col, vec3(.8, .78, .72) * (.5 + .5 * gp), (1. - smoothstep(1.75 - jw, 1.75 + jw, dBed)));
    col = mix(col, vec3(.1, .2, .13) + vec3(.1, .16, .08) * gp, (1. - smoothstep(1.45 - jw, 1.45 + jw, dBed)));
    // the beads
    float k6 = (floor(s / 6.) + .5) * 6., db2 = (s - k6) * (s - k6) + n * n, rbd = max(.9, .8 * fw), bw = waveHump(p.x + p.y);
    col = mix(col, vec3(1., .97, .88), .75 * midS * exp(-db2 / (rbd * rbd)) * min(.9 / rbd, 1.) * (.45 + .55 * bw));
    emis += vec3(1., .94, .8) * 2.6 * midS * exp(-db2 / .3) * (.35 + .65 * bw) * near1;
    // the pools
    float rP = dA < BV_A.z ? ${q.a.pool.toFixed(1)} : ${q.b.pool.toFixed(1)}, dW = dP - rP, eb = max(.6 * fw, .03);
    float inRound = dA < BV_A.z || dB < BV_B.z ? 1. : 0.;
    float water = inRound * (1. - smoothstep(-eb, eb, dW)), inK = inRound * (1. - smoothstep(.9 - eb, .9 + eb, dW));
    float edgeL = inRound * (1. - smoothstep(.09, .09 + 2. * eb, abs(dW + .05))) * clamp(.3 / eb, 0., 1.), edgeG = inRound * exp(-abs(dW) / 1.3);
    vec3 kerbC = (vec3(.5, .54, .68) + LAMPW * .3 * gp) * (1. - .22 * (1. - smoothstep(0., .15, dW))) + vec3(.04, .46, .46) * edgeG;
    vec2 pr = dA < BV_A.z ? ra : rb;
    float rip = (sin(pr.x * 1.9 + pr.y * .7 - uTime * .8) + sin(pr.x * 1.1 - pr.y * 1.3 + uTime * .6) + .6 * sin(pr.x * 3.1 + pr.y * 2.3 + uTime * 1.1)) * (1. - smoothstep(.25, 1.2, fw));
    vec3 dv = normalize(vW - cameraPosition);
    linW = mirrorLight(vW, dv, rip) + vec3(.003, .06, .065) * edgeG * edgeG + vec3(.25, 1.25, 1.2) * edgeL;
    wm = water * inK;
    col = mix(col, kerbC, inK);
    emis = emis * (1. - inK) + vec3(.25, 1.25, 1.2) * edgeL * near1;
  } else if (vUv.y < 1.5) {
    // THE WALLS: pale stone in the lamps' light: a warm lamp on a bracket every 6.5 m, 3.6 m up, with its light
    // on the wall; between every two pairs of lamps a door 3.6 m wide and 5 m high, its leaf in the paler colour
    // of one of the floors; a line of light under the coping; brighter toward the lit paving
    // (the bracket lamp's one law: an upright soft bar, to 1/e 0.16 m broad and 1 m high either way, in a wash that
    // falls to 1/e 1.2 m to either side and 3.6 m up and down: it reaches the wall's foot. The wash takes no fade
    // here. Far off the bar, 0.16 m broad and far under a pixel there, fades to ITS OWN MEAN over the wall of its
    // bay, 6.5 m long and 6.9 m high (${ve(6.5,3.6,6.9,oe.bar).toFixed(4)}, counted), never to nought)
    float al = vUv.x, y = vW.y, da = al - (floor(al / 6.5) + .5) * 6.5, dy = y - 3.6, gl = bracketWash(da, dy);
    float dc = floor(al / 13. + .5) * 13., eD = max(fw, .04);
    float inD = (1. - smoothstep(1.8 - eD, 1.8 + eD, abs(al - dc))) * (1. - smoothstep(5. - eD, 5. + eD, y)) * (1. - smoothstep(.6, 1.6, fw));
    vec3 leaf = uPal[1 + int(h21(vec2(dc, 4.7)) * 5.999)];
    col = mix(vec3(.5, .5, .58) * mix(1., .72, y / 6.9), mix(vec3(.9), leaf, .55) * .62, inD);
    col = mix(col, LAMPW * .92, .7 * gl) + LAMPW * .14 * gl;
    float top = 1. - smoothstep(.1, .1 + max(fwidth(y), .02), abs(y - 6.5));
    col = mix(col, vec3(1., .9, .68), .8 * top);
    emis = vec3(1., .8, .5) * 1.5 * mix(${ve(6.5,3.6,6.9,oe.bar).toFixed(4)}, bracketBar(da, dy), near1) + vec3(1., .86, .6) * .9 * top * near1;
  } else {
    // A PIER OF THE GATE: pale stone lit from below, A BAND OF WARM LIGHT round its head
    float y = vW.y, band = smoothstep(8.9, 9.05, y) * (1. - smoothstep(10., 10.15, y)) * step(vN.y, .5);
    col = vec3(.78, .76, .72) * mix(vec3(.75, .7, .62), vec3(.34, .38, .56), smoothstep(0., 9., y));
    col = mix(col, vec3(.2, .24, .44), step(.5, vN.y));
    emis = vec3(1., .84, .56) * 1.9 * band;
    col = mix(col, vec3(1., .9, .68), band);
  }
  col = min(col, vec3(.93));
  gl_FragColor = vec4(nightAir(mix(lit3(col) + emis, linW, wm), cameraPosition, vW - cameraPosition), 1.);
}`;function*aa(e){const n=Xt(),r=ae(se("fww-court:"+e)),c=Y,i=[],p=[];for(const f of[-1,1])for(let a=0;a<2;a++){const h=f*(16+6.5*a),m=ne+h,s=[];for(let d=c.head-3.25;d>c.head-200;d-=6.5)s.push(Be(d,h));for(let d=3.25/m;d<me;d+=6.5/m)s.push(Be(c.head+d*ne,h));for(let d=c.head+c.arc+3.25;d<c.head+c.arc+30;d+=6.5)s.push(Be(d,h));for(const d of s)d[0]>c.x0+3.2&&d[0]<c.x1-3.2&&d[1]>c.z0+3.2&&d[1]<c.z1-3.2&&i.push({x:d[0],z:d[1],h:r.range(7.2,9),turn:r.range(0,1),y:0})}yield null;for(let f=0;f<3;f++)for(let a=0;a<8;a++){const h=c.x0+(a+.5)*26,m=c.z0+(f+.5)*26;if(h>c.x1-8||m>c.z1-8||xo(h,m)[0]<30)continue;const s=r.range(5.2,7),d=r.range(5.2,7),o=r.range(0,1),t=r.range(0,1);n.standard(h,m,0,5),p.push([9,h,m,0,1,1,0,0,0]);const E=(a+f)%2===0;for(const[g,b,A]of[[-1,s,o],[1,d,t]]){const x=h+(E?6*g:0),v=m+(E?0:6*g);n.prism(8,x,v,1.2,1.5,0,1,ht,[0,-99,0],1),i.push({x,z:v,h:b,turn:A,y:.9})}}yield null;let u=0;for(const f of i)++u%16===0&&(yield null),n.tree(f.x,f.z,f.y,f.h,-99,f.turn),p.push([6,f.x,f.z,0,1,f.h/5.5,0,0,0]);yield null;for(let f=6;f<c.len-2;f+=12)for(const a of[-1,1]){const h=Be(f,9*a);n.standard(h[0],h[1],0,5),p.push([9,h[0],h[1],0,1,1,0,0,0])}for(let f=12;f<c.len-5;f+=12)for(const a of[-1,1]){const h=Be(f,9.3*a);n.block(h[0],h[1],h[2],h[3],1.4,.3,0,.5,ht,[0,-99,0])}for(let f=1.5;f<c.len-1;f+=3)for(const a of[-1,1]){const h=Be(f,(c.hw-.25)*a),m=Be(f,(c.hw-1.25)*a);n.jet(h[0],h[1],m[0]-h[0],m[1]-h[1],.05)}yield null;{const f=w.STREET,a=w.FORE,h=w.POOL;for(const m of[-1,1]){const s=f.z+m*6.7;yield null;for(let d=f.x0+4.5;d<a.x0-2;d+=6.5)n.tree(d,s,0,r.range(5.6,6.4),-99,r.range(0,1));for(let d=f.x0+7.75;d<a.x0-2;d+=13)n.standard(d,s,0,5);for(let d=a.x0+5;d<f.x1-7;d+=9)n.standard(d,f.z+m*(h.hw+4),0,5);for(let d=h.x0+1.5;d<h.x1-1;d+=3)n.jet(d,f.z+m*(h.hw-.25),0,-m,.05)}}yield null;for(const[f,a,h]of Jo()){const m=vt(a,h);if(f===0)n.standard(m[0],m[1],0,5),p.push([9,m[0],m[1],0,1,1,0,0,0]);else{const s=r.range(7.6,9);n.tree(m[0],m[1],0,s,-99,r.range(0,1)),p.push([6,m[0],m[1],0,1,s/5.5,0,0,0])}}yield null;{const f=w.CORE,a=f.r+10+.14*f.r,h=w.CON.w/2+9.6+1;for(const[m,s]of[[1,0],[-1,0],[0,1],[0,-1]]){const d=m<0,o=d?[[-a,-h],[h,a]]:[[-a,a]];for(const[t,E]of o)n.block(f.x+m*(a-.3)-s*(t+E)/2,f.z+s*(a-.3)+m*(t+E)/2,-s,m,(E-t)/2,.2,w.ROOF,w.ROOF+1.1,ht,[0,-99,w.ROOF]);for(let t=-8;t<8;t++){const E=9*(t+.5);Math.abs(E)>a-1.5||d&&Math.abs(E)<h||n.standard(f.x+m*(a-1.5)-s*E,f.z+s*(a-1.5)+m*E,w.ROOF,4.5)}}}return yield null,{geo:yield*n.buildStages(),shades:p,trees:i}}function sa(e,n,r=[w.CORE,w.TOWB]){const c=Qt(e,n,r);let i=c.next();for(;!i.done;)i=c.next();return i.value}function*Qt(e,n,r=[w.CORE,w.TOWB]){const c=e.data,i=e.at,p=w.MAZE_X0,u=w.MAZE_Z0,l=[],f=[];for(let x=we;x<=so;x+=6){const v=fe(x);f.push(v[0],v[1])}let a=1e9,h=-1e9,m=1e9,s=-1e9;for(let x=0;x<f.length;x+=2)a=Math.min(a,f[x]),h=Math.max(h,f[x]),m=Math.min(m,f[x+1]),s=Math.max(s,f[x+1]);const d=Ut.map(x=>[x[0],x[2],x[1],x[3]]);for(const x of r)d.push([x.x-x.r*.9,x.x+x.r*.9,x.z-x.r*.9,x.z+x.r*.9]);const o=(x,v)=>{let T=1e18;for(let y=0;y<f.length;y+=2){const z=x-f[y],L=v-f[y+1],M=z*z+L*L;M<T&&(T=M)}return Math.sqrt(T)},t=(x,v,T,y,z)=>{for(const H of d)if(x<H[1]&&v>H[0]&&T<H[3]&&y>H[2])return;const L=(x+v)/2,M=(T+y)/2,R=o(L,M);nt(L,M)<0||R<n&&l.push({x0:x,x1:v,z0:T,z1:y,kind:z,d:R})},E=Math.max(2,Math.floor((a-n-p)/26)-3),g=Math.min(253,Math.ceil((h+n-p)/26)+1),b=Math.max(2,Math.floor((m-n-u)/26)-2),A=Math.min(253,Math.ceil((s+n-u)/26)+1);for(let x=b;x<=A;x++)for(let v=E;v<=g;v++){v===E&&(x-b)%10===9&&(yield null);const T=i(v,x),y=c[T],z=c[T+3],L=p+26*v,M=u+26*x;if(o(L+13,M+13)>n+90)continue;if(y&128)!(z&128)&&(z>>2&3)===0&&(z>>4&1)===0&&(z>>6&1)===0&&t(L+4.7,L+26*(2+(z>>5&1))-4.7,M+4.7,M+52-4.7,1);else{const P=He(v,x),V=Ie(v,x),K=26-P-He(v+1,x),G=26-V-Ie(v,x+1),N=Math.min((y>>3&3)+1,Math.max(Math.floor(K/5.5),1)),C=Math.min((y>>5&3)+1,Math.max(Math.floor(G/5.5),1)),O=K/N,F=G/C;for(let S=0;S<C;S++)for(let $=0;$<N;$++)t(L+P+$*O+($>0?.6:0),L+P+($+1)*O-($<N-1?.6:0),M+V+S*F+(S>0?.6:0),M+V+(S+1)*F-(S<C-1?.6:0),0)}const R=Math.max(Ie(v,x),Ie(v-1,x)),H=Math.max(Ie(v,x+1),Ie(v-1,x+1)),I=Math.max(He(v,x),He(v,x-1)),B=Math.max(He(v+1,x),He(v+1,x-1));!(y&1)&&!(z&1)&&t(L-3.5,L+3.5,M+R,M+26-H,0),!(y&2)&&!(z&2)&&t(L+I,L+26-B,M-3.5,M+3.5,0),!(y&4)&&(z&3)!==3&&t(L-3.5,L+3.5,M-3.5,M+3.5,0)}return l}const na=110;function La(e,n,r=null,c=Ft(e)){const i=Jt(e,n,r,c);let p=i.next();for(;!p.done;)p=i.next();return p.value}function*Jt(e,n,r=null,c=Ft(e)){const i=ae(se("fww-furnish:"+e)),p=[],u=[];r||(r=sa(n,400,c));for(let a=we;a<=_e;a+=4){const h=fe(a);u.push(h[0],h[1])}const l=(a,h)=>{let m=1e18;for(let s=0;s<u.length;s+=2){const d=a-u[s],o=h-u[s+1],t=d*d+o*o;t<m&&(m=t)}return Math.sqrt(m)};let f=0;for(const a of r){++f%100===0&&(yield null);const h=a.x1-a.x0,m=a.z1-a.z0,s=(a.x0+a.x1)/2,d=(a.z0+a.z1)/2,o=h>=m?0:Math.PI/2,t=Math.max(h,m),E=Math.min(h,m),g=[],b=Math.min(Math.max(Math.floor(h/9+.5),1),8),A=Math.min(Math.max(Math.floor(m/9+.5),1),8),x=h/b,v=m/A,T=(O,F,S)=>!c.some($=>Math.max(Math.abs(O-$.x),Math.abs(F-$.z))<$.r+S);if(a.d<na)for(let O=0;O<A;O++)for(let F=0;F<b;F++){const S=a.x0+(F+.3)*x,$=a.z0+(O+.7)*v;T(S,$,3.5)&&g.push([S,$,3.5])}if(a.d<100&&a.kind!==1&&g.length===0)for(const[O,F]of[[.3,.7],[.2,.8],[.8,.8],[.2,.2],[.8,.2]]){const S=a.x0+O*h,$=a.z0+F*m;if(T(S,$,.9)){g.push([S,$,.9]);break}}const y=(O,F,S,$,D,W,U=3.5)=>{for(const _ of c)if(Math.max(Math.abs(F-_.x),Math.abs(S-_.z))<_.r+U+(O===1?D*W/2:0))return;if(!(nt(F,S)<2+(O===1?D*W/2:ft[O][0]*W))){if(O!==8){const _=Math.cos($),j=Math.sin($),le=ft[O][0]*(O===1?D:1)*W+.3,Ne=ft[O][1]*W+.3;for(const Ze of g){const Xe=Ze[0]-F,St=Ze[1]-S;if(Math.abs(Xe*_-St*j)<le&&Math.abs(Xe*j+St*_)<Ne)return}}if(O===6){const _=l(F,S);if(_<10||nt(F,S)<q.lid+2)return;W=Math.min(W,a.kind!==1?1.05:_<22?1.2:9)}p.push([O,F,S,$,D,W,0,0,0])}},z=(O,F,S,$=0,D=1,W=1)=>y(O,s+(o?-S:F),d+(o?F:S),$-o,D,W),L=a.kind===1||a.d<160,M=L?i():0,R=L&&i.chance(.5)?Math.PI:0,H=R?-1:1,I=a.d<60,B=p.length,P=(O,F,S,$,D=0)=>{const W=Math.min(S,Math.floor((t-1.2)/O)),U=Math.min($,Math.floor((E-.8)/F));for(let _=0;_<U;_++)for(let j=0;j<W;j++)z(0,(j-(W-1)/2)*O,D+(_-(U-1)/2)*F,R);return W*U},V=(O,F,S=1)=>{let $=O;for(const D of[0,-1.4,1.4,-2.8,2.8])if($=O+D,!g.some(W=>{const U=o?W[1]-d:W[0]-s,_=o?s-W[0]:W[1]-d;return Math.abs(U)<F/2+.5&&Math.abs(_-$)<1.3*S+.6}))break;if(!(Math.abs($)>E/2-1.3*S-.3)){z(1,0,$,0,F/S,S);for(let D=-F/2+1.3*S;D<F/2-.4*S;D+=2.6*S)z(2,D,$-2.1*S,0,1,S),z(2,D,$+2.1*S,Math.PI,1,S)}},K=(O,F)=>{const S=Math.floor((t-1.2)/2.4);for(let $=0;$<S;$++)z(3,($-(S-1)/2)*2.4,O,F)},G=(O,F)=>{for(let S=0;S<F;S++)for(let $=0;$<O;$++)z(7,($-(O-1)/2)*2,(S-(F-1)/2)*2,R)},N=()=>{};if(a.kind===1)if(a.d<160)for(let O=0;O<A;O++)for(let F=0;F<b;F++)for(const[S,$]of(F+O)%2?[[.75,.25]]:[[.75,.75],[.25,.25]])y(0,a.x0+(F+S)*x,a.z0+(O+$)*v-.475*H,R,1,1);else{for(const[O,F]of[[-1,-1],[1,1]])z(6,O*t*.3,F*E*.28,i.range(0,6.28),1,2.6);if(M<.5)z(1,0,0,0,t*.5,2);else for(let O=0;O<4;O++)z(4,Math.cos(O*1.5708)*9,Math.sin(O*1.5708)*9,-O*1.5708-1.5708,1,2.2)}else if(I){const O=t/2-.85,F=E/2-.85;if(t<8.2)M<.3&&E>4.2?(z(0,0,0,R),t>=7&&N(O,-H*F)):M<.55?t>=7?(z(6,-t/2+1.9,0,i.range(0,6.28)),z(2,t/2-1.7,-.5,-Math.PI/2),N(O,F)):z(6,0,0,i.range(0,6.28)):M<.8?(G(2,E>4.5?2:1),t>=7&&N(O,F)):(K(-E/2+.7,0),E>4.8&&z(2,0,.6,Math.PI),N(O,F));else if(E<6)if(M<.4){for(let S=-1;S<=1;S++)z(0,S*Math.min(4.4,t/2-1.5),-.475*H,R);N(O,0),N(-O,0)}else if(M<.75){K(-E/2+.7,0);for(let S=-2;S<=2;S++)z(2,S*2.6,E/2-.9,Math.PI);N(O,F)}else G(3,2),z(6,t/2-2,0,0),z(6,-t/2+2,0,0),N(3.9,0),N(-3.9,0);else if(E<10)if(M<.3){for(let S=-1;S<=1;S++)z(0,S*Math.min(4.4,t/2-1.5),.9*H,R);K(-H*(E/2-.7),0),N(O,0),N(-O,0)}else if(M<.5)V(0,Math.min(t-3.4,11)),N(t/2-1.3,0),N(-t/2+1.3,0);else if(M<.84){for(const S of[-4.1,4.1])z(4,S,-(E/2-1.15),0),z(4,S,E/2-1.15,Math.PI),z(5,S,0);z(6,0,0,i.range(0,6.28),1,.9),N(O,0),N(-O,0)}else{K(-E/2+.7,0);for(let S=-1;S<=1;S++)z(6,S*5,1.1,i.range(0,6.28),1,1.1);N(O,F),N(-O,F)}else if(M<.32)P(4.9,3.9,3,4,-.45*H);else if(M<.5){V(-1.7,Math.min(t-4,11)),V(3.9,Math.min(t-4,11)),K(-E/2+.7,0);for(const S of[-1,1])z(6,S*6.9,1.1,0,1,.8),N(S*(t/2-.9),6.2)}else if(M<.84){for(let S=0;S<4;S++)z(4,Math.cos(S*1.5708)*4.4,Math.sin(S*1.5708)*4.4,-S*1.5708-1.5708);z(5,0,0,0,1,1.5);for(const[S,$]of[[-1,-1],[1,-1],[1,1],[-1,1]])z(6,S*(t/2-2),$*(E/2-2),i.range(0,6.28));N(O,0),N(-O,0),N(0,F),N(0,-F)}else K(-E/2+.7,0),K(E/2-.7,Math.PI),P(4.9,4.4,3,2,-.45*H)}else if(a.d<160)if(t<8.2)M<.3&&E>4.2?z(0,0,0,R):M<.55?z(6,0,0,i.range(0,6.28)):M<.8?G(2,E>4.5?2:1):K(-E/2+.7,0);else if(E<6)M<.4?P(4.6,4.2,5,1):M<.75?K(-E/2+.7,0):(G(3,2),z(6,t/2-2,0,0),z(6,-t/2+2,0,0));else if(E<10)M<.38?P(4.6,4.2,3,2):M<.62?V(0,Math.min(t-3.4,11)):M<.84?(z(4,0,-2.7,0),z(4,0,2.7,Math.PI),z(5,0,0),z(6,t/2-1.8,E/2-1.8,0)):(K(-E/2+.7,0),z(6,0,1.2,0,1,1.2));else if(M<.4)P(4.9,4.4,3,3);else if(M<.6)V(-2.9,Math.min(t-4,11)),V(2.9,Math.min(t-4,11));else if(M<.82){for(let O=0;O<4;O++)z(4,Math.cos(O*1.5708)*4.4,Math.sin(O*1.5708)*4.4,-O*1.5708-1.5708);z(5,0,0,0,1,1.5);for(const[O,F]of[[-1,-1],[1,1]])z(6,O*(t/2-2),F*(E/2-2),0)}else K(-E/2+.7,0),K(E/2-.7,Math.PI),P(4.9,4.4,3,1);const C=p.length===B;for(const O of g)y(8,O[0],O[1],0,1,1,O[2]);if(a.d<100&&a.kind!==1&&C&&t>=4){const O=p.length;if(E>=4.6){const F=Math.min(1,(E-1.8)/4.2),S=a.x0+.66*h,$=a.z0+.34*m;y(5,S,$,0,1,F),y(2,S-1.45*F-.95,$,Math.PI/2,1,1),t>=7.5&&y(7,a.x0+.24*h,a.z0+.24*m,R,1,1)}else if(h>=m)for(let F=a.x0+1.6;F<a.x1-1.5;F+=2.4)y(3,F,a.z0+.75,0,1,1);else for(let F=a.z0+1.6;F<a.z1-1.5;F+=2.4)y(3,a.x1-.75,F,-Math.PI/2,1,1);if(p.length===O)for(const F of[.5,.15,.85,.3,.7]){if(p.length>O)break;const S=1.6+(t-3.2)*F;h>=m?(y(3,a.x0+S,a.z0+.75,0,1,1,2.1),y(3,a.x0+S,a.z1-.75,Math.PI,1,1,2.1)):(y(3,a.x0+.75,a.z0+S,Math.PI/2,1,1,2.1),y(3,a.x1-.75,a.z0+S,-Math.PI/2,1,1,2.1))}}}return p}const he=(e=1)=>[-1,e,0],eo=[-2,1,0],to=[[[-1.9,1.9,1.75,1.9,-1.35,.55,[.9,.88,.83]],[-1.9,-1.75,0,1.75,-1.35,.55,[.6,.62,.66]],[1.75,1.9,0,1.75,-1.35,.55,[.6,.62,.66]],[-.75,.75,1,1.2,.9,2.3,he()],[-.75,.75,1.2,2.6,2.15,2.3,he(.8)],[-1.5,-.9,1.9,2.75,-1.1,-.5,eo]],[[-.5,.5,1.72,1.9,-1.3,1.3,[.87,.84,.77]],[-.43,-.4,0,1.72,-1,1,[.3,.3,.32]],[.4,.43,0,1.72,-1,1,[.3,.3,.32]]],[[-.7,.7,1,1.2,-.7,.7,he()],[-.7,.7,1.2,2.5,-.7,-.55,he(.8)]],[[-1.1,1.1,0,3.4,-.55,.55,[.74,.76,.8]]],[[-2.5,2.5,.3,1.1,-1,1,he()],[-2.5,2.5,1.1,2,-1,-.5,he(.85)],[-2.5,-2.1,1.1,1.6,-.5,1,he(.9)],[2.1,2.5,1.1,1.6,-.5,1,he(.9)]],[[10,1.3,.85,1.05,[.86,.84,.8]],[4,.2,0,.85,[.3,.3,.32]]],[[6,1.2,0,1.3,[.88,.88,.86]],[3,.18,1.3,3.2,[.4,.35,.31]],{turned:6,far:1,r:1.6,y0:2.8,y1:6,cA:[.18,.42,.22],cB:[.3,.6,.3]}],[[-.7,.7,1,1.16,-.7,.7,he()],[-.7,.7,1.45,1.61,-.7,.7,he()],[-.7,.7,1.9,2.06,-.7,.7,he()],[-.7,.7,1.2,3.3,-.7,-.55,he(.8)]],[[5,.42,0,.12,[.3,.3,.32]],[3,.1,.12,3.3,[.3,.3,.32]],[6,.62,3.3,4.1,eo]]],ft=[[2.3,2.3],[.8,1.8],[.95,.95],[1.4,.85],[2.9,1.4],[1.7,1.7],[1.6,1.6],[1,1],[1.5,1.5],[.05,.05]];function ra(e){const n=[],r=[],c=[],i=(u,l,f)=>{for(const a of[0,1,2,0,2,3])n.push(u[a][0],u[a][1],u[a][2]),r.push(l[0],l[1],l[2]),c.push(f[0],f[1],f[2])};for(const u of e)if(u.turned){const l=u.far?Xo:Lt,f=u.turned,a=l.map(([s,d])=>[s*u.r,u.y0+(u.y1-u.y0)*d]),h=Zt(a),m=l.map(([s])=>{const d=Math.min(Math.max((s-.35)/.6,0),1);return[0,1,2].map(o=>u.cA[o]+(u.cB[o]-u.cA[o])*d)});for(let s=0;s+1<a.length;s++)for(let d=0;d<f;d++){const o=d/f*Math.PI*2,t=(d+1)/f*Math.PI*2;for(const[E,g]of[[s,t],[s,o],[s+1,o],[s,t],[s+1,o],[s+1,t]])n.push(a[E][0]*Math.cos(g),a[E][1],a[E][0]*Math.sin(g)),r.push(h[E][0]*Math.cos(g),h[E][1],h[E][0]*Math.sin(g)),c.push(m[E][0],m[E][1],m[E][2])}}else if(u.length===7){const[l,f,a,h,m,s,d]=u;i([[l,h,s],[f,h,s],[f,h,m],[l,h,m]],[0,1,0],d),i([[l,a,s],[f,a,s],[f,h,s],[l,h,s]],[0,0,1],d),i([[f,a,m],[l,a,m],[l,h,m],[f,h,m]],[0,0,-1],d),i([[f,a,s],[f,a,m],[f,h,m],[f,h,s]],[1,0,0],d),i([[l,a,m],[l,a,s],[l,h,s],[l,h,m]],[-1,0,0],d)}else{const[l,f,a,h,m]=u;for(let s=0;s<l;s++){const d=s/l*Math.PI*2,o=(s+1)/l*Math.PI*2,t=(d+o)/2,E=[Math.cos(d)*f,Math.sin(d)*f],g=[Math.cos(o)*f,Math.sin(o)*f];i([[g[0],a,g[1]],[E[0],a,E[1]],[E[0],h,E[1]],[g[0],h,g[1]]],[Math.cos(t),0,Math.sin(t)],m);for(const b of[[0,h,0],[g[0],h,g[1]],[E[0],h,E[1]]])n.push(b[0],b[1],b[2]),r.push(0,1,0),c.push(m[0],m[1],m[2])}}const p=Oe(n,r);return p.setAttribute("color",new k.Float32BufferAttribute(c,3)),p}const ia=`
attribute vec3 color;
varying vec3 vW; varying vec3 vN; varying vec3 vCol; varying vec3 vO; varying float vSh;
${ue}${Ue}${gt}
void main(){
  vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.);
  vW = w.xyz; vN = normalize(mat3(instanceMatrix) * normal); vCol = color; vO = instanceMatrix[3].xyz;
  vec2 lo, hi, pd; vec4 open, id;
  gHw = mix(.3, .6, smoothstep(150., 190., wayD(vO.xz)));
  mazeRoom(vO.xz, lo, hi, open, id, pd);
  vSh = max(hoursAt((lo + hi) * .5, h21(id.xy + 43.7)), step(h21(id.xy + 71.3), .111));
  if (abs(id.z - 1.) < .5 && id.x > 254.5) vSh = 1.;
  if (id.z < .5 && h21(id.xy + 57.1) < .03) vSh = 0.;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,la=`
varying vec3 vW; varying vec3 vN; varying vec3 vCol; varying vec3 vO; varying float vSh;
uniform vec3 uFog; uniform float uFogK; uniform vec3 uAcc[5];
${Me}${Te}${Ue}
void main(){
  vec3 alb = vCol;
  float lamp = step(alb.r, -1.5);
  // a piece's accent: one of five clear colours by its own place
  if (alb.r < 0.) alb = lamp > .5 ? vec3(.96, .88, .66) : uAcc[int(h21(floor(vO.xz * .5) + 7.7) * 4.999)] * alb.g;
  // lit by its room's lamps: pale and a little warm on top, a clear blue-grey on its sides, deeper toward the floor;
  // after hours all of it stands deep blue. EVERY LAMP IN A LIT ROOM IS LIT: its shade glows warm.
  vec3 side = vec3(.5, .54, .7) * mix(.74, 1., smoothstep(0., 3., vW.y));
  vec3 col = min(alb * mix(side, vec3(.95, .9, .78), smoothstep(.3, .7, vN.y)), vec3(.88));
  col = mix(alb * vec3(.1, .14, .32), col, vSh);
  vec3 lin3 = lit3(col) + lamp * vec3(1., .82, .5) * 1.3 * vSh;
  gl_FragColor = vec4(nightAir(lin3, cameraPosition, vW - cameraPosition), 1.);
}`,ca=`
varying vec2 vUv;
void main(){
  vec2 q = abs(vUv - .5) * 2.;
  float e = max(q.x, q.y), r = length(max(q - .55, 0.)) / .45;
  gl_FragColor = vec4(vec3(.03, .045, .13), (1. - smoothstep(.1, 1., r)) * step(e, 1.) * .42);
}`,ha=`
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.); }`,fa=`
varying vec2 vUv; varying float vSh;
void main(){
  vec2 q = (vUv - .5) * 2.;
  float g = exp(-dot(q, q) * 4.5) * (1. - smoothstep(.8, 1., length(q)));
  gl_FragColor = vec4(vec3(1., .82, .5) * .16 * g * vSh, 1.);
}`,da=`
varying vec2 vUv; varying float vSh;
${ue}${Ue}${gt}
void main(){
  vUv = uv;
  vec3 vO = instanceMatrix[3].xyz;
  vec2 lo, hi, pd; vec4 open, id;
  gHw = mix(.3, .6, smoothstep(150., 190., wayD(vO.xz)));
  mazeRoom(vO.xz, lo, hi, open, id, pd);
  vSh = max(hoursAt((lo + hi) * .5, h21(id.xy + 43.7)), step(h21(id.xy + 71.3), .111));
  if (abs(id.z - 1.) < .5 && id.x > 254.5) vSh = 1.;
  if (id.z < .5 && h21(id.xy + 57.1) < .03) vSh = 0.;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.);
}`;async function Sa(e,n={}){const r=e.seed,c=new k.Group,i=new k.Group,p=new k.Group,u=n.time||{value:0};let l=n.maze;if(!l){const D=Ct(r);let W=D.next();for(;!W.done;)await e.yield(),W=D.next();l=W.value}await e.yield();const f=Eo(r,l),a=Ft(r),h=wo(r);f.uTime=u,f.uSky=h,f.uTow={value:Array.from({length:17},(D,W)=>a[W]?new k.Vector4(a[W].x,a[W].z,a[W].r,a[W].h):new k.Vector4(0,0,-99,0))};const m=a[1].pile.filter(D=>!D.plate);f.uStoB={value:Array.from({length:10},(D,W)=>f.uPal.value[m[Math.min(W,m.length-1)].ci])};const s={uFog:f.uFog,uFogK:f.uFogK,uTime:u};let d=0;const o=(D,W,U)=>{W.name=U,W.frustumCulled=!1,D.add(W);const _=W.geometry;return d+=(_.index?_.index.count:_.attributes.position.count)/3,W};o(i,new k.Mesh(new k.PlaneGeometry(10400,10400).rotateX(-Math.PI/2).translate(-33,w.ROOF,-301),Ao(f)),"maze sheet"),o(c,new k.Mesh(new k.PlaneGeometry(10400,10400,40,40).rotateX(Math.PI/2).translate(-33,w.SLAB,-301),new k.ShaderMaterial({uniforms:{uTime:u,uSky:h,uTow:f.uTow,uTop:{value:Array.from({length:17},(D,W)=>{const U=a[W],_=U&&U.great?U.pile.filter(j=>!j.plate).pop():null;return _?new k.Vector4((_.x0+_.x1)/2,(_.z0+_.z1)/2,(_.x1-_.x0)/2,(_.z1-_.z0)/2):new k.Vector4(0,0,-99,-99)})}},vertexShader:jt,fragmentShader:Mo})),"ceiling of light"),o(c,new k.Mesh(To(a),new k.ShaderMaterial({vertexShader:Oo,fragmentShader:Fo,side:k.DoubleSide})),"capitals"),await e.yield(),s.uTow=f.uTow;const t=new k.ShaderMaterial({uniforms:s,vertexShader:Tt,fragmentShader:Ot,side:k.DoubleSide});o(i,new k.Mesh(jo(),t),"crowns"),o(i,new k.Mesh(qo(),new k.ShaderMaterial({uniforms:s,vertexShader:Tt,fragmentShader:Ot,side:k.DoubleSide,defines:{ROOF:1}})),"roofs");const E=new k.ShaderMaterial({uniforms:{...f},vertexShader:Uo,fragmentShader:Vo,side:k.DoubleSide});await e.yield();const g=Qo(r);let b=g.next();for(;!b.done;)await e.yield(),b=g.next();o(i,new k.Mesh(b.value,E),"roof garden"),await e.yield();const A=aa(r);let x=A.next();for(;!x.done;)await e.yield(),x=A.next();const v=x.value;o(i,new k.Mesh(v.geo,E),"court garden"),o(i,new k.Mesh(ea(),new k.ShaderMaterial({uniforms:f,vertexShader:ta,fragmentShader:oa,side:k.DoubleSide})),"boulevard"),await e.yield();const T=o(c,new k.Mesh(Go(),new k.ShaderMaterial({uniforms:s,vertexShader:Tt,fragmentShader:Ot,side:k.DoubleSide,defines:{WELL:1}})),"well");await e.yield();const y=ct(r,"fww-core").slice(0,3).concat(ct(r,"fww-towb").slice(0,3));w.CORE.lifts.concat(w.TOWB.lifts).forEach((D,W)=>{y[W].z+=D[1],y[W].w=Math.max(y[W].w,y[W].z+24)});{const D=ct(r,"fww-lifts").concat(ct(r,"fww-lifts-b"));let W=0;for(const U of a)for(let _=0;_<(U.shafts||[]).length;_++){const j=D[W++%D.length].clone(),le=U.shafts[_].top!==void 0?U.shafts[_].top:(U.great?w.SLAB:U.h)-1.5;j.x*=.6,j.z=4+.5*(j.z-6),j.w=Math.max(le-4.5-.1*(90-j.w),j.z+8),y.push(j)}for(;y.length<40;)y.push(new k.Vector4(60,0,0,1))}const z=o(c,new k.Mesh(Po(a),new k.ShaderMaterial({uniforms:{...s,uPal:{value:[lt("#f2dcae")].concat(f.uPal.value.slice(1))},uCar:{value:y},uCarLight:{value:Ve("#fff3d6")},uWarm:{value:Ve("#ffeccd")}},vertexShader:Lo,fragmentShader:So,side:k.DoubleSide})),"towers");await e.yield();const L=_o(r,u),M=w.H2,R=new k.ShaderMaterial({uniforms:L.uniforms,vertexShader:Do,fragmentShader:Co});o(p,new k.Mesh(new k.PlaneGeometry(M.x1-M.x0,M.z1-M.z0,88,88).rotateX(-Math.PI/2).translate((M.x0+M.x1)/2,M.floor,(M.z0+M.z1)/2),R),"tide"),await e.yield();const H=Qt(l,400,a);let I=H.next();for(;!I.done;)await e.yield(),I=H.next();const B=I.value;await e.yield();const P=Jt(r,l,B,a);let V=P.next();for(;!V.done;)await e.yield(),V=P.next();const K=V.value,G=new k.Group;await e.yield();const N=new k.ShaderMaterial({uniforms:{...f,uAcc:{value:["#1d6f78","#e9e6df","#c9457a","#3f7fd6","#6f8f3a"].map(lt)}},vertexShader:ia,fragmentShader:la}),C=new k.Matrix4,O=new k.Vector3,F=new k.Vector3,S=new k.Quaternion,$=new k.Vector3(0,1,0);for(let D=0;D<to.length;D++){const W=K.filter(j=>j[0]===D);if(!W.length)continue;const U=ra(to[D]),_=new k.InstancedMesh(U,N,W.length);W.forEach((j,le)=>{C.compose(O.set(j[1],0,j[2]),S.setFromAxisAngle($,j[3]),F.set(j[4]*j[5],j[5],j[5])),_.setMatrixAt(le,C)}),o(G,_,"maze "+["desks","long tables","chairs","cabinets","sofas","low tables","trees","chair stacks","standing lamps"][D]),d+=(W.length-1)*_.geometry.attributes.position.count/3,await e.yield()}{const D=K.concat(v.shades),W=new k.PlaneGeometry(1,1).rotateX(-Math.PI/2),U=new k.InstancedMesh(W,new k.ShaderMaterial({vertexShader:ha,fragmentShader:ca,transparent:!0,depthWrite:!1}),D.length);D.forEach((j,le)=>{const Ne=ft[j[0]];C.compose(O.set(j[1],.05,j[2]),S.setFromAxisAngle($,j[3]),F.set(2*(Ne[0]*j[4]+.5)*j[5],1,2*(Ne[1]+.5)*j[5])),U.setMatrixAt(le,C)}),o(G,U,"maze shades"),d+=(D.length-1)*2,await e.yield();const _=K.filter(j=>j[0]===0);if(_.length){const j=new k.InstancedMesh(new k.PlaneGeometry(4.6,4.6).rotateX(-Math.PI/2),new k.ShaderMaterial({uniforms:f,vertexShader:da,fragmentShader:fa,transparent:!0,depthWrite:!1,blending:k.AdditiveBlending}),_.length);_.forEach((le,Ne)=>{const Ze=Math.cos(le[3]),Xe=Math.sin(le[3]);j.setMatrixAt(Ne,C.makeTranslation(le[1]-1.2*Ze-.8*Xe,.07,le[2]+1.2*Xe-.8*Ze))}),j.renderOrder=2,o(G,j,"maze pools"),d+=(_.length-1)*2}}return i.add(G),await e.yield(),c.add(i,p),{object:c,above:i,furn:G,tide:p,upstand:T,core:z,towerB:z,towers:a,radius:260,height:96,center:new k.Vector3(w.OC.x,20,w.OC.z),ground:!1,trains:L.trains,maze:l,triangles:d,uniforms:{roof:f,tide:L.uniforms,sky:h},update(D,W){u.value=W}}}export{Pt as ADRIFT_KINDS,it as AVE_OFF,q as BLVD,oe as BRACKET,ye as BUILT,Ut as BUILT_BOXES,kt as CEIL_FILES,Y as COURT,mo as FIXED_HALLS,ee as FLEET,te as FLEET2,de as FLEET_SPAN,Mt as FOG_ABOVE,_t as GLSL_BRACKET,$o as GLSL_CARPET,Ue as GLSL_FIELD,Me as GLSL_LIT,Te as GLSL_NIGHT,yt as GLSL_SLAB,Dt as GLSL_TIDE,ue as GLSL_WAVE,Io as HERO_SHOULDERS,na as LAMP_REACH,w as P,ao as RING_AT,ma as RUNS,ko as STACK_PROUD,J as STAIR,qe as TIDE_LAP,Oa as TIDE_LEVEL,ya as TIDE_MAX,pe as TIDE_SHADE,ga as TIDE_SLOPE,ho as TIDE_TRAINS,ce as TOWERS,ze as WAVE,Je as WEAVE,$t as WELL_COLS,za as adriftDeal,po as adriftDealStages,vt as blvdAt,nt as blvdD,ro as blvdOf,Jo as blvdStands,Sa as buildHero,xo as canalAt,Be as canalPlace,ct as coreDeal,aa as courtGardenStages,wa as discLight,ua as doorOpen,rt as fleetAxes,Aa as fleetLampsInto,ke as fleetPlace,La as furnishDeal,Jt as furnishDealStages,Ie as hbN,He as hbW,Wt as heightAt,fe as lineAt,va as linePoints,Ao as makeRoofMaterial,Eo as makeRoofUniforms,_o as makeTideUniforms,Ma as mazeDeal,Ct as mazeDealStages,uo as onBuilt,Qo as roofGardenStages,sa as roomsNear,Qt as roomsNearStages,xa as runAtZ,wo as skyUniform,Nt as tideEdge,ba as tideH,Ea as tideSlope,Ft as towersDeal};
