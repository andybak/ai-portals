import*as l from"three";import{clamp as Le,lerp as D,smoothstep as A,makePath as Yt}from"../kit/core.js";import{makeSky as e0}from"../kit/sky.js";import{buildHero as t0}from"../parts/amber-reticulum.js";const o0=["#E6E3DA","#7C93B8","#F2A51E","#F9E45B","#B5600F","#A9D6F0","#6F8F5A"],a0=[{name:"honey",amber:"#F2A51E",edge:"#F9E45B",dark:"#B5600F"},{name:"garnet",amber:"#D4472A",edge:"#FFB9A0",dark:"#7A1410"},{name:"citrine",amber:"#F8E27A",edge:"#FDFAD2",dark:"#E0961C"}],n0=[{name:"early",elev:15,key:"#FFE7C2",zenith:"#5E8FCB",horizon:"#A9D6F0",band:"#FFE9C4",fog:"#9DBFE0",shadeLine:30,floorSun:0,exposure:1},{name:"first",elev:6,key:"#FFC79A",zenith:"#6E86C0",horizon:"#F6CDB0",band:"#FFB98A",fog:"#C2B4C4",shadeLine:62,floorSun:0,exposure:1.06},{name:"mid",elev:35,key:"#FFF1DA",zenith:"#4F8AD0",horizon:"#B4DCF2",band:"#FFF3DC",fog:"#A6CBE8",shadeLine:8,floorSun:.55,exposure:.94}],s0=["clear","mist","rain"],Kt=v=>{const z=Math.sin(v*127.1+311.7)*43758.5453;return z-Math.floor(z)};function r0(v,z,F,L,Z,ie){const J=z/F.w,H=z/F.h;for(let W=Z;W<ie;W++){const te=L[W],oe=te[0],$=te[1],I=te[3]===1,G=te[3]===2,Y=I?16:G?2.4:7,X=I?0:2,ae=I||G?te[2]:0,le=I||G?255:198,de=(ae+Y)*(ae+Y),K=le/Y,Ce=ae*ae,se=(oe-F.x0)*J,N=($-F.z0)*H,ue=(Y+ae)*J+1,ne=(Y+ae)*H+1,Je=Math.max(0,Math.floor(N-ne)),Ie=Math.min(z-1,Math.ceil(N+ne)),_=Math.max(0,Math.floor(se-ue)),ze=Math.min(z-1,Math.ceil(se+ue));for(let ke=Je;ke<=Ie;ke++){const re=(ke+.5)/H+F.z0-$,Se=re*re;let Ee=(ke*z+_)*4+X;for(let S=_;S<=ze;S++,Ee+=4){const fe=(S+.5)/J+F.x0-oe,Pe=fe*fe+Se;if(Pe>=de)continue;const ht=Pe<=Ce?le:le-(Math.sqrt(Pe)-ae)*K;ht>v[Ee]&&(v[Ee]=ht)}}}}function i0(v,z,F,L,Z,ie,J,H,W){const te=z/F.w,oe=z/F.h;for(let $=Z;$<ie;$++){const I=L[$],G=I.gy,Y=Math.min(I.h/W,620),X=I.r*.95+.03*Y,ae=.3*I.r,le=Math.max(0,Math.floor((I.z-Y*H-X-F.z0)*oe)),de=Math.min(z-1,Math.ceil((I.z-.5*I.r-F.z0)*oe));for(let K=le;K<=de;K++){const Ce=F.z0+(K+.5)/oe,se=(I.z-Ce)/H,N=I.x-J*se,ue=I.r*.95+.03*se,ne=.012*Math.max(-150-Ce,0),Je=G-se*W-ne,Ie=Math.max(0,Math.floor((N-ue/H-F.x0)*te)),_=Math.min(z-1,Math.ceil((N+ue/H-F.x0)*te));let ze=(K*z+Ie)*4+1;for(let ke=Ie;ke<=_;ke++,ze+=4){const re=Math.abs(F.x0+(ke+.5)/te-N)*H,Se=(re-ae)/(ue-ae),Ee=Se<=0?1:Se>=1?0:1-Se*Se*(3-2*Se),S=(Je+I.h*Ee)*(255/160);S>v[ze]&&(v[ze]=S>255?255:S)}}}}function l0(v,z,F,L,Z,ie){const J=z/L;for(let H=Z;H<ie;H++){const W=(H+.5)/J,te=Math.min(Math.floor(W),L-1),oe=W-te,$=te*(L+1),I=$+L+1;for(let G=0;G<z;G++){const Y=(G+.5)/J,X=Math.min(Math.floor(Y),L-1),ae=Y-X,le=F[$+X]+(F[$+X+1]-F[$+X])*ae,de=F[I+X]+(F[I+X+1]-F[I+X])*ae,K=127.5+(le+(de-le)*oe)*(255/160);v[(H*z+G)*4+3]=K<0?0:K>255?255:K}}}function h0(v,z,F,L,Z){const ie=new Uint16Array(L),J=new Uint16Array(L),H=new Float32Array(L);for(let W=0;W<L;W++){const te=W*F/L,oe=Math.floor(te),$=te-oe;ie[W]=oe,J[W]=(oe+1)%F,H[W]=$*$*(3-2*$)}for(let W=0;W<L;W++){const te=ie[W]*F,oe=J[W]*F,$=H[W],I=W*L;for(let G=0;G<L;G++){const Y=z[te+ie[G]],X=z[te+J[G]],ae=z[oe+ie[G]],le=z[oe+J[G]],de=H[G],K=Y+(X-Y)*de;v[I+G]+=Z*(K+(ae+(le-ae)*de-K)*$)}}}function c0(v,z,F,L){for(let Z=0,ie=z.length;Z<ie;Z++){const J=((z[Z]/F-.5)*1.7+.5)*255;v[Z*4+L]=J<0?0:J>255?255:Math.round(J)}}var p0={id:"amber-reticulum",name:"The River That Thinks",category:"alien",weirdness:.7,media:["air","open"],async build(v){const z=v.rng.fork("reticulum"),F=v.noise,L=v.vary||{},Z=Le(v.quality?.detail??1,.5,1),ie=Le(L.density??1,.7,1.3),J=!!L.rare;let H=z.pick([0,0,1,2,2]);L.hour==="dawn"?H=1:L.hour==="day"?H=2:L.hour==="golden"&&(H=0);const W=z.pick([0,0,1,2]),te=z.pick([0,0,2,0,0,1,2]),oe=z.pick([6,8,8,10]),$=z.chance(.25),I=n0[H],G=s0[W],Y=a0[te],X=o0.slice();X[2]=Y.amber,X[3]=Y.edge,X[4]=Y.dark;const ae=G==="rain"?1:0,le=G==="mist"?1:0,de=46,K=new l.Scene,Ce=[],se=await t0(v,{palette:X,detail:Z,period:oe,duration:de,skyColor:I.horizon});K.add(se.object);const N=se.anchors,ue=se.veinKit.uniforms;await v.yield();const ne=new l.Vector3(N.sunDir.x,0,N.sunDir.z).normalize().multiplyScalar(Math.cos(I.elev*Math.PI/180));ne.y=Math.sin(I.elev*Math.PI/180),ne.normalize(),se.setSun(ne,I.key);const Je=Math.atan2(ne.x,-ne.z)*180/Math.PI,Ie=N.flyThrough,_=Ie[0],ze=e=>.012*Math.max(-150-e,0),re=[[0,-953,62],[0,-890,60],[5,-830,51],[10,-765,36],[11,-705,28],[-10,-645,27],[-40,-585,29],[-58,-525,52],[-47,-455,85],[-48,-405,75],[-64,-353,51],[-80,-305,29],[-91,-256,null],[-96,-208,null],[-88,-164,null,7],[-60,-110,null,21],[-29,-53,null,13]].map(([e,t,a,o])=>new l.Vector3(_.x+e,a??ze(_.z+t)+12.5+(_.y-12.5-ze(_.z))*A(-180,-40,t)+(o||0),_.z+t)),Se=re.length,Ee=(N.strandSamples||[]).filter(e=>e.p.z<_.z+110);let S=null;for(const[e,t,a]of[[16,12,78],[16,12,66],[16,10,58],[12,12,78],[12,12,66],[12,10,58],[12,5,50],[8,5,50],[0,5,50]]){re.length=Se;for(const s of Ie){const i=s.clone();i.y+=e*(1-A(_.z+t,_.z+a,i.z)),re.push(i)}S=Yt(re,{samples:420});let o=1e9;for(const s of Ee)o=Math.min(o,S.distanceTo(s.p.x,s.p.y,s.p.z)-s.r);if(await v.yield(),o>=8.6)break}const fe=N.portalSeat.position,Pe=N.exitHeading,ht=S.nearestXZ(_.x+12,-150).u;await v.yield();const Me={x:_.x-190,z:_.z-420,rx:110,rz:150},He=(e,t)=>{const a=(e-Me.x)/Me.rx,o=(t-Me.z)/Me.rz;return(Math.sqrt(a*a+o*o)-1)*120+F.n2(e*.02,t*.02)*14},At=_.z-470,Ft=e=>{const t=1-Math.abs(Math.sin(e*.033+1.7*Math.sin(e*.0071)));return 150+F.n2(e*.011,3.3)*5+11*t*t-3},T={x:0,z:0,ax:0,az:1};{const e=S.pointAt(.235),t=S.tangentAt(.235),a=Math.hypot(t.x,t.z)||1;T.ax=-t.z/a,T.az=t.x/a,T.x=e.x+T.ax*54,T.z=e.z+T.az*54}const ct=(e,t)=>{const a=e-T.x,o=t-T.z,s=a*T.ax+o*T.az,i=a*T.az-o*T.ax,r=Math.abs(s);if(r>23||Math.abs(i)>58)return 0;const f=10*(1-A(8,22,r)),n=16+2*F.n2(s*.05,3.1);return f*Math.exp(-(i*i)/(n*n))*(1+.1*F.n2(e*.07,t*.07))},qe=(e,t)=>{const a=Math.abs(t),o=Ft(e+(t>0?500:0));let s;if(t<0){s=ze(t)+F.n2(e*.013,t*.013)*2.2+F.n2(e*.05,t*.05)*.7;const i=(t-At+F.n2(e*.004,7)*60)/70;s+=22*Math.exp(-i*i)*(.6+.4*F.n2(e*.008,1.7)),s+=ct(e,t)}else s=4+.02*(t-150)+F.n2(e*.013,t*.013)*3;if(a<o+6){const i=Le((o-a)/30,0,1),r=i+.05*Math.sin(i*30+e*.05)*i*(1-i);s=D(s*(1-A(0,8,o-a+6)),-205+F.n2(e*.02,t*.02)*6,Math.pow(Le(r,0,1),.55))}return s},pe=(e,t)=>{const a=qe(e,t);if(t>-140)return a;const o=S.nearestXZ(e,t);return o.dist<60?Math.min(a,D(o.y-D(12.5,4,A(_.z-70,_.z-15,t)),a+30,A(14,60,o.dist))):a},$e=64,Tt=$e*.866,ft=-560,dt=_.z-1130,Ne=19,ut=21,we=[],me=(e,t)=>we[t*Ne+e],Bt=re[0].x,Ye=new l.Vector3(20-re[0].x,0,-150-re[0].z).normalize();for(let e=0;e<ut;e++)for(let t=0;t<Ne;t++){let a=ft+t*$e+e%2*$e*.5+z.range(-13,13),o=dt+e*Tt+z.range(-13,13);const s=z(),i=8.5+13*s*s+z.range(0,3),r=z();let f=42+95*Math.pow(z(),1.5)+i*1.2,n=!0,d=i;const u=(o-At)/90;f+=38*Math.exp(-u*u),o>-190-d&&(n=!1);for(const p of N.towers)Math.hypot(a-p.position.x,o-p.position.z)<p.radius+d+26&&(n=!1);He(a,o)<0&&(r<.55&&(n=!1),f*=.55,d*=.8);const c=S.nearestXZ(a,o);let w=d*1.12+13;if(c.u>.17&&c.u<.36){const p=S.tangentAt(c.u),m=S.pointAt(c.u);(a-m.x)*p.z-(o-m.z)*p.x>0&&(w+=19*A(.17,.2,c.u)*(1-A(.33,.36,c.u)))}if(n&&c.dist<w){const p=S.pointAt(c.u),m=a-p.x,g=o-p.z,y=Math.max(Math.hypot(m,g),.01),x=w+z.range(0,4);a=p.x+m/y*x,o=p.z+g/y*x,S.nearestXZ(a,o).dist<w-.5&&(n=!1)}{n&&Math.abs(a-Bt)<d+13&&o>re[0].z&&o<re[0].z+300&&(n=!1);const p=a-re[0].x,m=o-re[0].z,g=p*Ye.x+m*Ye.z,y=Math.abs(p*Ye.z-m*Ye.x);if(n&&g>80&&y<d+8+.075*g){const x=55-44*(g/1130)-6*r-qe(a,o);f>x&&(x>15?f=x:n=!1)}}n&&o<re[0].z+24&&Math.abs(a-Bt)<d+22&&(n=!1),we.push({x:a,z:o,r:d,h:f,on:n,seed:z()*100,i:t,j:e}),t===Ne-1&&e%3===2&&await v.yield()}const Ue={x:Me.x+42,z:Me.z+89};let he=null;{let e=1e9;for(const t of we){if(He(t.x,t.z)>-22)continue;const a=Math.hypot(t.x-Ue.x,t.z-Ue.z);a<e&&(e=a,he=t)}he&&(he.on=!0,he.h=Le(he.h,46,64),he.r=Le(he.r,9,13))}he&&(he.fixed=!0);{for(const e of we){const t=e.x-T.x,a=e.z-T.z,o=t*T.ax+a*T.az,s=t*T.az-a*T.ax;Math.abs(o)<11+e.r&&s>-80&&s<40+e.r&&(e.on=!1)}for(const e of[-1,1]){const t=T.x+T.ax*23*e,a=T.z+T.az*23*e;let o=null,s=1e9;for(const i of we){if(i.fixed)continue;const r=Math.hypot(i.x-t,i.z-a);r<s&&(s=r,o=i)}o&&(o.x=t,o.z=a,o.on=!0,o.fixed=!0,o.r=11+e,o.h=78+14*e,o.sink=2)}}for(let e=0;e<we.length;e++){const t=we[e];if(!(!t.on||t.fixed))for(let a=0;a<we.length;a++){const o=we[a];if((a<e||o.fixed)&&o!==t&&o.on&&Math.hypot(t.x-o.x,t.z-o.z)<(t.r+o.r)*.92+5){t.on=!1;break}}}await v.yield();const pt=[],jt=Math.round(420*(.5+.5*Z));for(let e=0;e<jt;e++){const t=e%3===0,a=z.range(-1500,1500),o=t?z.range(215,1300):z.range(-2300,-190),s=z.range(9,22),i=45+100*Math.pow(z(),1.5),r=z()*100;if(!t&&a>ft-20&&a<ft+Ne*$e+20&&o>dt-20&&o<dt+ut*Tt+10||t&&Math.abs(a-(fe.x+Pe.x*(o-fe.z)/Math.max(Pe.z,.3)))<60+(o-150)*.12)continue;let f=!0;for(const n of N.towers)Math.hypot(a-n.position.x,o-n.position.z)<n.radius+s+30&&(f=!1);f&&pt.push({x:a,z:o,r:s,h:i,seed:r,on:!0})}await v.yield(),await v.yield();const _e=S.nearestXZ(_.x-6,_.z-12).u,j=[];{const e=S.startTangent,t=S.start;for(let r=-260;r<0;r+=13)j.push({x:t.x+e.x*r+Math.sin(r/47)*9,z:t.z+e.z*r});const a=new l.Vector3,o=new l.Vector3,s=Math.round(_e*S.length/11);for(let r=0;r<=s;r++){const f=r/s*_e;S.pointAt(f,a),S.tangentAt(f,o);const n=A(26,44,a.y-ze(a.z))*(1-A(.42,.5,f)),d=-Math.sign((fe.x-_.x)*o.z-(fe.z-_.z)*o.x)*12*A(_e-.12,_e-.03,f),u=n*(Math.sin(f*61)*9+Math.sin(f*143)*3.5)+d;j.push({x:a.x+o.z*u,z:a.z-o.x*u})}let i=0;for(let r=j.length-1;r>=0;r--)r<j.length-1&&(i+=Math.hypot(j[r].x-j[r+1].x,j[r].z-j[r+1].z)),j[r].d=i}const Re=230,Qt=(e,t)=>{let a=1e9,o=0;for(let s=0;s<j.length;s++){const i=j[s].x-e,r=j[s].z-t,f=i*i+r*r;f<a&&(a=f,o=s)}return{dist:Math.sqrt(a),k:o}},ye=[],et=new Map,tt=(e,t,a)=>{if(!e||!t||!a)return;const o=(e.x+t.x+a.x)/3,s=(e.z+t.z+a.z)/3;let i=s<-172&&He(o,s)>10;for(const d of[e,t,a])d.on&&Math.hypot(o-d.x,s-d.z)<d.r+3.5&&(i=!1);for(const d of N.towers)Math.hypot(o-d.position.x,s-d.position.z)<d.radius+10&&(i=!1);const r=Qt(o,s),f=ye.length,n={id:f,x:o,z:s,ok:i,root:!1,dist:1e9,parent:-1,pe:null,desc:1,adj:[]};i&&r.dist<21&&(Kt(f*3.7+1.3)<.42&&j[r.k].d>30?(n.root=!0,n.x=j[r.k].x,n.z=j[r.k].z,n.dist=0,n.s0=Re+j[r.k].d):n.ok=!1),ye.push(n);for(const[d,u]of[[e,t],[t,a],[e,a]]){const h=d.j*Ne+d.i,c=u.j*Ne+u.i,w=Math.min(h,c)*4096+Math.max(h,c);et.has(w)||et.set(w,{a:d,b:u,n:[]}),et.get(w).n.push(f)}};for(let e=0;e<ut-1;e++)for(let t=0;t<Ne-1;t++)e%2===0?(tt(me(t,e),me(t+1,e),me(t,e+1)),tt(me(t+1,e),me(t,e+1),me(t+1,e+1))):(tt(me(t,e),me(t+1,e),me(t+1,e+1)),tt(me(t,e),me(t,e+1),me(t+1,e+1)));await v.yield();const mt=[];for(const e of et.values()){if(e.n.length<2)continue;const t=ye[e.n[0]],a=ye[e.n[1]];if(!t.ok||!a.ok||t.root&&a.root)continue;const o=e.a,s=e.b,i=Math.hypot(o.x-s.x,o.z-s.z),r=o.on?o.r:0,f=s.on?s.r:0,n=i-r-f;if(n<4)continue;const d=(r+n*.5)/i,u=D(o.x,s.x,d),h=D(o.z,s.z,d),c={n1:t,n2:a,mx:u,mz:h,gap:n,len:Math.hypot(t.x-u,t.z-h)+Math.hypot(a.x-u,a.z-h),w:.7+.6*z(),kind:"dry",r:.5};t.adj.push(c),a.adj.push(c),mt.push(c)}await v.yield();{const e=new Uint8Array(ye.length);let t=0;for(;;){let o=null;for(const s of ye)!e[s.id]&&s.ok&&s.dist<1e8&&(!o||s.dist<o.dist)&&(o=s);if(!o)break;e[o.id]=1,++t%120===0&&await v.yield();for(const s of o.adj){const i=s.n1===o?s.n2:s.n1,r=o.dist+s.len*s.w;!e[i.id]&&r<i.dist&&(i.dist=r,i.parent=o.id,i.pe=s)}}const a=ye.filter(o=>o.ok&&o.dist<1e8).sort((o,s)=>s.dist-o.dist);for(const o of a)o.parent>=0&&(ye[o.parent].desc+=o.desc,o.pe.kind="tree",o.pe.child=o);for(const o of a.reverse())o.parent>=0&&(o.s0=ye[o.parent].s0+o.pe.len);for(const o of mt)o.kind==="tree"?(o.r=Math.min(.5+.4*Math.sqrt(o.child.desc),3.4),S.nearestXZ(o.mx,o.mz).dist<26&&(o.r=Math.min(o.r,1.9))):o.n1.dist<1e8&&o.n2.dist<1e8&&z()<.3&&(o.kind="loop",o.r=z.range(.5,.95))}await v.yield();const Ct=ye.map(()=>[]);for(const e of ye)e.parent>=0&&e.pe.kind==="tree"&&Ct[e.parent].push(e);const It=new l.Vector3,gt=[],ge=[],Lt=(e,t)=>.0028*(S.nearestXZ(e,t).dist+30),Ve=(e,t,a,o,s,i)=>{const r=e.length,f=new Float32Array(r*3),n=new Float32Array(r),d=new Float32Array(r);let u=0;for(let h=0;h<r;h++)f[h*3]=e[h],f[h*3+1]=a[h],f[h*3+2]=t[h],n[h]=o[h],d[h]=s[h],u+=t[h]/r;gt.push({P:f,R:n,S:d,sides:i.sides,gain:i.gain??1,r0:i.r0,seed:i.seed,ref:null,hang:!!i.hang,nocap:!!i.nocap,zc:u})};{const e=[],t=[],a=[],o=[],s=[];for(let f=0;f<j.length;f++){const n=j[f],d=f/(j.length-1),u=D(4.3,6.2,A(.2,.8,d))*(1+.06*Math.sin(f*.9))*(1-.7*A(.84,.985,d));e.push(n.x),t.push(n.z),o.push(u),s.push(Re+n.d),a.push(pe(n.x,n.z)+.25*u),ge.push([n.x,n.z,u,1]),f<j.length-1&&ge.push([(n.x+j[f+1].x)/2,(n.z+j[f+1].z)/2,u,1])}{const f=j[j.length-1],n=S.tangentAt(_e),d=Math.hypot(n.x,n.z)||1,u=n.x/d,h=Math.max(n.z/d,.5),c=o[o.length-1];let w=f.x,p=f.z,m=0;for(let x=0;x<40;x++){const b=w+u*3.5,M=p+h*3.5;if(M>-Ft(b)-3)break;w=b,p=M,m+=3.5,e.push(w),t.push(p),o.push(c),a.push(qe(w,p)+.3*c),s.push(Re-m),ge.push([w,p,c,1])}const g=a[a.length-1],y=5;for(let x=1;x<=6;x++){const b=x/6*Math.PI/2;e.push(w+u*y*Math.sin(b)),t.push(p+h*y*Math.sin(b)),a.push(g-y*(1-Math.cos(b))),o.push(c*(1-.1*x/6)),s.push(Re-m-y*b)}for(let x=1;x<=3;x++)e.push(w+u*y),t.push(p+h*y),a.push(g-y-2.4*x),o.push(c*(.9-.12*x)),s.push(Re-m-y*1.57-2.4*x);It.set(w+u*y*.25,g-.2,p+h*y*.25)}await v.yield();const i=j.length>>1,r=(f,n)=>Ve(e.slice(f,n),t.slice(f,n),a.slice(f,n),o.slice(f,n),s.slice(f,n),{sides:14,r0:5.5,seed:.37});r(0,i+4),r(i-3,e.length)}await v.yield();let Et=0;for(const e of mt){const t=e.kind!=="dry",a=e.kind==="tree"?e.child:e.n1.s0>e.n2.s0?e.n1:e.n2,o=a===e.n1?e.n2:e.n1,s=2*e.mx-(a.x+o.x)/2,i=2*e.mz-(a.z+o.z)/2,r=e.r>1.5?9:6,f=e.kind==="tree"&&Ct[a.id].length===0,n=[],d=[],u=[],h=[],c=[];for(let w=0;w<r;w++){const p=w/(r-1),m=(1-p)*(1-p),g=2*p*(1-p),y=p*p,x=m*a.x+g*s+y*o.x,b=m*a.z+g*i+y*o.z;if(!t){ge.push([x,b,.9,0]);continue}let M=Math.max(e.r*(.86+.14*p),Lt(x,b));f&&(M*=.12+.88*A(0,.55,p)),e.kind==="loop"&&(M*=.75+.25*Math.abs(2*p-1)),n.push(x),d.push(b),h.push(M),u.push(pe(x,b)+.25*M),c.push(D(a.s0,o.s0,p)),ge.push([x,b,M,1])}t&&Ve(n,d,u,h,c,{sides:e.r>2?10:e.r>1.1?7:5,r0:e.r,seed:.05+.9*Kt(Et*1.31),nocap:!0}),++Et%240===0&&await v.yield()}{const e=j.length-1,t=j[e],a=S.tangentAt(_e),o=(s,i,r)=>{const f=j[e-1],n=s.position.x-i*s.radius*.62,d=s.position.z-s.radius*.6,u=[],h=[],c=[],w=[],p=[];for(let m=0;m<=34;m++){const g=m/34,y=A(0,.8,g),x=D(f.x,n,y)+Math.sin(g*6+r*9)*2.5*y*(1-y),b=D(f.z,d,y*y),M=D(2,1.1,g),P=A(.72,1,g);u.push(D(x,s.position.x-i*s.radius*.45,P*.6)),h.push(D(b,s.position.z-s.radius*.35,P*.6)),c.push(Math.max(qe(x,b),0)+.3*M+P*3),w.push(M*(1-.6*P)),p.push(Re-50*g),g<.75&&ge.push([x,b,M,1])}for(let m=0;m<4;m++)for(let g=1;g<u.length-1;g++)u[g]=(u[g-1]+2*u[g]+u[g+1])/4,c[g]=(c[g-1]+2*c[g]+c[g+1])/4,h[g]=(h[g-1]+2*h[g]+h[g+1])/4;Ve(u.reverse(),h.reverse(),c.reverse(),w.reverse(),p.reverse(),{sides:9,r0:2.2,seed:r,hang:!0})};o(N.towers[0],1,.61),o(N.towers[1],-1,.23)}const qt=new l.Vector3;{const e=new l.Vector3,t=new l.Vector3,a=(s,i,r,f,n,d,u,h)=>{const c=[],w=[],p=[],m=[],g=[];for(let y=0;y<=r;y++){const x=y/r,b=D(s,i,x);S.pointAt(b,e),S.tangentAt(b,t);const M=Math.hypot(t.x,t.z)||1,P=f(x,b),E=e.x+t.z/M*P,B=e.z-t.x/M*P,R=n(x);c.push(E),w.push(B),m.push(R),p.push(pe(E,B)+.25*R),g.push(Re+(_e-b)*S.length+P),ge.push([E,B,h?.35:R*(d===3?2.6:1),1]),h&&ge.push([E,B,R*1.08,2])}Ve(c.reverse(),w.reverse(),p.reverse(),m.reverse(),g.reverse(),{sides:12,r0:2.4,seed:d+u})},o=s=>1.6*Math.sin(s*190)+.9*Math.sin(s*437);a(.183,.214,9,s=>13*A(0,1,s),()=>2.9,0,.42,!1),a(.214,.37,30,(s,i)=>13+o(i)*A(0,.2,s)+30*A(.72,1,s),s=>2.5*(1-.75*A(.8,1,s)),2,.3,!0),a(.214,.385,32,(s,i)=>13+11.5*A(0,.16,s)+o(i+.3)*A(.1,.3,s)+34*A(.7,1,s),s=>1.5*(1-.7*A(.82,1,s)),3,.3,!1);{S.pointAt(.195,e);const s=T.x-e.x,i=T.z-e.z,r=Math.hypot(s,i)||1,f=r+36,n=Math.round(f/2.4),d=[],u=[],h=[],c=[],w=[];for(let p=0;p<=n;p++){const m=p/n,g=m*f,y=1.6*Math.sin(g*.13)*A(4,16,g),x=e.x+s/r*g-i/r*y,b=e.z+i/r*g+s/r*y,M=2.5*(.4+.6*A(0,.08,m))*(1-.8*A(.86,1,m));d.push(x),u.push(b),c.push(M),h.push(pe(x,b)+.3*M),w.push(300+g),ge.push([x,b,M,1])}Ve(d,u,h,c,w,{sides:10,r0:2.5,seed:6.3})}S.pointAt(.29,e),S.tangentAt(.29,t),qt.set(e.x+t.z*18,pe(e.x+t.z*18,e.z-t.x*18)+2,e.z-t.x*18)}await v.yield();let ot=60;{const e=Ue,t=he,a=t?{x:t.x,z:t.z,r:t.r*1.02}:{x:e.x,z:e.z,r:2},o=S.pointAt(.47),s=Math.atan2(o.x-a.x,o.z-a.z);ot=0,[-.62,0,.58,-1.2,1.15].forEach((i,r)=>{const f=s+i,n=Math.sin(f),d=Math.cos(f);let u=a.r+6;for(;u<150&&He(a.x+n*u,a.z+d*u)<9;)u+=4;const h=[],c=[],w=[],p=[],m=[],g=26;let y=0;for(let x=0;x<=g;x++){const b=x/g,M=D(u,a.r*(r===1?.96:1),b),P=Math.sin(b*Math.PI)*(5*Math.sin(b*7+r*2.1)+2*Math.sin(b*17+r)),E=a.x+n*M+d*P,B=a.z+d*M-n*P,R=D(2.5,1.5,b);x&&(y+=Math.hypot(E-h[x-1],B-c[x-1])),h.push(E),c.push(B),p.push(R),w.push(pe(E,B)+.3*R+(r===1?14*A(.93,1,b):0)),m.push(1e3+y)}ot=Math.max(ot,y),Ve(h,c,w,p,m,{sides:8,r0:2,seed:4.1+.17*r})})}await v.yield();{const e=N.strandSamples||[],t=new l.Vector3,a=It,o=Math.atan2(a.x-N.knot.x,-(a.z-N.knot.z));let s=0;for(const i of[0,-.7,.7,-.35,.35,-1,1,-1.3,1.3]){if(s>=3)break;const r=o+i,f=new l.Vector3(N.knot.x+Math.sin(r)*32,N.knot.y+4,N.knot.z-Math.cos(r)*32),n=a.distanceTo(f);for(const d of[-10,-6,-2,3,7,11,16,22]){let u=!0;const h=[],c=[],w=[],p=[],m=[];for(let g=0;g<=30&&u;g++){const y=g/30,x=D(1.75,1.3,y)*(1+.2*Math.exp(-y*14))*(.3+.7*A(0,.07,y)),b=x*.66;if(t.lerpVectors(a,f,y),t.y-=d*4*y*(1-y),t.x+=(s-1)*2*A(0,.07,y)*Math.exp(-y*12),S.distanceTo(t.x,t.y,t.z)<(y<.15?8.5:9.3)+x&&(u=!1),y>.05&&y<.9){for(const M of e)if(M.p.distanceToSquared(t)<(x+M.r+1.3)*(x+M.r+1.3)){u=!1;break}}h.push(t.x),c.push(t.z),w.push(t.y),p.push(b),m.push(42+n*(1-y))}if(u){Ve(h.reverse(),c.reverse(),w.reverse(),p.reverse(),m.reverse(),{sides:9,r0:1.1,seed:5.11+.23*s,hang:!0}),s++;break}}await v.yield()}}await v.yield();{const e=gt.filter(i=>!i.hang).sort((i,r)=>i.zc-r.zc),t=gt.filter(i=>i.hang),a=9,o=Math.ceil(e.length/a),s=[];for(let i=0;i<a;i++)s.push(e.slice(i*o,(i+1)*o));s.push(t);for(let i=0;i<s.length;i++){if(!s[i].length)continue;const r=await se.veinKit.meshTubes(s[i],v);if(i<a){const n=r.attributes.position.array,d=r.attributes.normal.array,u=r.attributes.aTube.array;for(let h=0,c=n.length/3;h<c;h++)n[h*3+1]-=d[h*3+1]*u[h*4+1]*.35}r.boundingSphere=null,r.computeBoundingSphere(),r.boundingSphere.radius+=5;const f=new l.Mesh(r,se.veinKit.material);se.object.add(f),await v.yield()}}const O={x0:-640,z0:_.z-1250,w:1360,h:1300,n:512},Ze=new Uint8Array(O.n*O.n*4);{const e=O.n;for(let n=0;n<ge.length;n+=2500)r0(Ze,e,O,ge,n,Math.min(n+2500,ge.length)),await v.yield();const t=Math.hypot(ne.x,ne.z),a=ne.x/t,o=Math.max(ne.z/t,.3),s=ne.y/t,i=we.filter(n=>n.on).concat(pt.filter(n=>n.z<-150)).map(n=>({x:n.x,z:n.z,r:n.r,h:n.h,gy:qe(n.x,n.z)}));for(const n of N.towers)i.push({x:n.position.x,z:n.position.z,r:n.radius,h:n.height,gy:0});await v.yield();for(let n=0;n<i.length;n+=160)i0(Ze,e,O,i,n,Math.min(n+160,i.length),a,o,s),await v.yield();const r=128,f=new Float32Array((r+1)*(r+1));for(let n=0;n<=r;n++){for(let d=0;d<=r;d++)f[n*(r+1)+d]=He(O.x0+d*O.w/r,O.z0+n*O.h/r);n%32===31&&await v.yield()}for(let n=0;n<e;n+=128)l0(Ze,e,f,r,n,n+128),await v.yield()}const De=new l.DataTexture(Ze,O.n,O.n,l.RGBAFormat,l.UnsignedByteType);De.magFilter=l.LinearFilter,De.minFilter=l.LinearFilter,De.wrapS=De.wrapT=l.ClampToEdgeWrapping,De.colorSpace=l.NoColorSpace,De.needsUpdate=!0,await v.yield();const Ke=256,Nt=new Uint8Array(Ke*Ke*4);{const e=z.fork("noise"),t=new Float32Array(Ke*Ke);for(let a=0;a<4;a++){const o=a===2?[32,64,128]:a===3?[4,8,16]:[8,16,32,64];t.fill(0);let s=.5,i=0;for(const r of o){const f=new Float32Array(r*r);for(let n=0;n<f.length;n++)f[n]=e();h0(t,f,r,Ke,s),i+=s,s*=.5}c0(Nt,t,i,a),await v.yield()}}const Fe=new l.DataTexture(Nt,Ke,Ke,l.RGBAFormat,l.UnsignedByteType);Fe.wrapS=Fe.wrapT=l.RepeatWrapping,Fe.magFilter=l.LinearFilter,Fe.minFilter=l.LinearMipmapLinearFilter,Fe.generateMipmaps=!0,Fe.colorSpace=l.NoColorSpace,Fe.needsUpdate=!0;const at=new l.Color(I.fog);le&&at.lerp(new l.Color("#E8EEF4"),.15),K.fog=new l.FogExp2(at,le?66e-5:58e-5);const ve={uTime:{value:0},uSun:ue.uSun,uKey:{value:new l.Color(I.key)},uZen:{value:new l.Color(I.zenith)},uFill:{value:new l.Color(X[1])},uHorizon:{value:new l.Color(I.horizon)},uStone:{value:new l.Color(X[0]).multiplyScalar(ae?.58:.72)},uMoss:{value:new l.Color(X[6])},uAmber:{value:new l.Color(Y.amber)},uLemon:{value:new l.Color(Y.edge)},uDarkA:{value:new l.Color(Y.dark)},uVeinMap:{value:De},uMapRect:{value:new l.Vector4(O.x0,O.z0,1/O.w,1/O.h)},uNoise:{value:Fe},uShade:{value:new l.Vector4(I.shadeLine,I.floorSun,ae,le)},uBay:{value:new l.Vector4(Me.x,Me.z,Me.rx,Me.rz)},uCreep:{value:new l.Vector2(0,0)},uStarve:{value:0},uSad:{value:new l.Vector4(T.x,T.z,qe(T.x,T.z)-ct(T.x,T.z),0)},uSadAx:{value:new l.Vector2(T.ax,T.az)},uPulse:{value:0},uCloud:{value:new l.Vector2(0,0)}},vt=v.core.makeRng(v.core.hashSeed("gorge-banks:"+v.seed));ve.uBank={value:new l.Vector2(vt(),vt())};const Ge=`
      uniform float uTime, uPulse; uniform vec3 uSun, uKey, uZen, uFill, uHorizon, uStone, uMoss, uAmber, uLemon, uDarkA;
      uniform sampler2D uVeinMap, uNoise; uniform vec4 uMapRect, uShade, uBay; uniform vec2 uCreep, uCloud; uniform float uStarve; uniform vec4 uSad; uniform vec2 uSadAx;
      vec4 veinAt(vec2 xz){ return texture2D(uVeinMap, (xz - uMapRect.xy) * uMapRect.zw); }
      // drifting cumulus shadows: 1 in sun, lower under a cloud
      float cloudSun(vec2 xz){ float c = texture2D(uNoise, (xz + uCloud) / 1500.0).a; return 1.0 - 0.5 * smoothstep(0.6, 0.74, c); }
      // how much of the low sun reaches a point hgt metres above the gully floor: the towers' cast shadows, then cloud
      float sunReach(vec2 xz, float hgt){
        float H = veinAt(xz).g * 160.0;
        return smoothstep(H - 2.0, H + 3.0, hgt) * cloudSun(xz);
      }
      // the bay the net has not reached: under 0 is bare stone; the edge creeps inward on each out-stroke
      float bayDist(vec2 xz){ return (veinAt(xz).a - 0.5) * 160.0 + uCreep.x; }
      // limestone light: a raking warm key above the shade line, sky-blue fill below it, never grey; mist in the gorge
      vec3 stoneLight(vec3 alb, vec3 N, vec3 P, float hgt, float ao){
        float reach = sunReach(P.xz, hgt) * (0.1 + 0.9 * smoothstep(-26.0, 4.0, P.y));
        float ndl = clamp((dot(N, uSun) + 0.3) / 1.3, 0.0, 1.0);
        vec3 fill = mix(uFill * 1.2 + vec3(0.06, 0.07, 0.11), uHorizon * 0.56 + uZen * 0.36, 0.5 + 0.5 * N.y) * ao;
        fill *= mix(1.0, 0.42, (1.0 - smoothstep(-50.0, 2.0, P.y)));
        return alb * (fill * (1.0 - 0.3 * reach) * (0.8 + 0.2 * cloudSun(P.xz)) + uKey * vec3(1.0, 0.9, 0.7) * (ndl * 1.75 + 0.08) * reach);
      }
      vec3 gorgeMist(vec3 col, vec3 P){
        float m = (1.0 - smoothstep(-150.0, -62.0, P.y + (texture2D(uNoise, P.xz / 260.0 + vec2(uTime * 0.004, 0.0)).r - 0.5) * 26.0));
        return mix(col, uFill * 0.66 + uHorizon * 0.26, m * 0.93);
      }
      // K8: the gorge's bank field, 1 in a bank of mist and 0 in a hollow, in the gorge's own metres and on the world's
      // clock. One field shapes the new mist sheets and thins the mist tone on a wall where a hollow lies against it.
      // A bank and its hollow are together about half as long as the gorge is wide (the noise's coarsest grain, a quarter
      // of 640 m); across the gorge the field is three times as long again, so that a bank reaches from wall to wall. It
      // slides along the gorge at the pace of live's own sheets (0.008 of their 410 m a second), the same way; where it
      // starts is drawn (uBank), not typed.
      uniform vec2 uBank;
      float gorgeBank(vec2 xz){ return texture2D(uNoise, vec2(xz.x / 640.0 + uTime * (0.008 * 410.0 / 640.0) + uBank.x, xz.y / 1920.0 + uBank.y)).a; }
      // how far a hollow thins the mist tone on the stone: nil at y -120 and above (the brief's mist begins 120 m down),
      // whole one ledge spacing lower (the wall's ledges are 1 / 0.043 = 23.3 m apart); nil again at the wall's foot, the
      // lowest ledge spacing above the floor at y -205, so that no hollow ever shows the floor's stone. A hollow is thin
      // mist, not clear air: three tenths of the tone always stay.
      float gorgeThin(vec3 P){
        float band = (1.0 - smoothstep(-143.3, -120.0, P.y)) * smoothstep(-181.7, -158.4, P.y);
        return 0.7 * (1.0 - smoothstep(0.36, 0.56, gorgeBank(P.xz))) * band;
      }
    `;await v.yield();const _t=e=>{const t=[];for(const[a,o,s]of e){const i=Math.max(1,Math.round((o-a)/s));for(let r=0;r<i;r++)t.push(a+(o-a)*r/i)}return t.push(e[e.length-1][1]),t},xt=_t([[-3400,-1400,500],[-1400,-700,100],[-700,-300,22],[-300,340,9],[340,700,22],[700,1400,100],[1400,3400,500]]),wt=_t([[-3800,-2e3,450],[-2e3,-1400,100],[-1400,_.z-1e3,30],[_.z-1e3,-188,9],[-188,-112,3.3],[-112,112,28],[112,188,3.3],[188,500,14],[500,1400,60],[1400,3400,500]]),Xe=new l.BufferGeometry;{const e=xt.length,t=wt.length,a=new Float32Array(e*t*3),o=new Uint32Array((e-1)*(t-1)*6),s=(n,d)=>{for(let u=n;u<d;u++)for(let h=0;h<e;h++){const c=(u*e+h)*3;a[c]=xt[h],a[c+1]=pe(xt[h],wt[u]),a[c+2]=wt[u]}};for(let n=0;n<t;n+=30)s(n,Math.min(n+30,t)),await v.yield();(()=>{let n=0;for(let d=0;d<t-1;d++)for(let u=0;u<e-1;u++){const h=d*e+u,c=h+e;o[n++]=h,o[n++]=c,o[n++]=h+1,o[n++]=h+1,o[n++]=c,o[n++]=c+1}})(),Xe.setAttribute("position",new l.BufferAttribute(a,3)),Xe.setIndex(new l.BufferAttribute(o,1)),await v.yield();const r=new Float32Array(e*t*3),f=(n,d)=>{for(let u=n;u<d;u++){const h=Math.max(u-1,0),c=Math.min(u+1,t-1);for(let w=0;w<e;w++){const p=Math.max(w-1,0),m=Math.min(w+1,e-1),g=(u*e+p)*3,y=(u*e+m)*3,x=(h*e+w)*3,b=(c*e+w)*3,M=a[y]-a[g],P=a[y+1]-a[g+1],E=a[b+1]-a[x+1],B=a[b+2]-a[x+2],R=-P*B,k=M*B,V=-M*E,Q=Math.max(Math.hypot(R,k,V),1e-9),ce=(u*e+w)*3;r[ce]=R/Q,r[ce+1]=k/Q,r[ce+2]=V/Q}}};for(let n=0;n<t;n+=64)f(n,Math.min(n+64,t)),await v.yield();Xe.setAttribute("normal",new l.BufferAttribute(r,3)),await v.yield(),Xe.boundingSphere=new l.Sphere(new l.Vector3(0,0,0),6e3)}await v.yield();const je=()=>l.UniformsUtils.clone(l.UniformsLib.fog),Ht="float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }",Wt=new l.ShaderMaterial({fog:!0,uniforms:{...je(),...ve},vertexShader:`
        varying vec3 vP, vN;
        #include <fog_pars_vertex>
        void main(){ vP = position; vN = normal; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        varying vec3 vP, vN;
        #include <fog_pars_fragment>
        ${Ge}
        ${Ht}
        void main(){
          vec3 N = normalize(vN), V = normalize(cameraPosition - vP); vec2 xz = vP.xz;
          float wall = (1.0 - smoothstep(-14.0, -2.0, vP.y)); vec2 nq = xz + vec2(0.0, vP.y * 0.9 * wall);
          float dist = length(cameraPosition - vP), near = 1.0 - smoothstep(50.0, 240.0, dist);
          float hgt = vP.y - (vP.z < 0.0 ? 0.012 * max(-150.0 - vP.z, 0.0) : 4.0);
          vec4 n1 = texture2D(uNoise, nq / 97.0), n2 = texture2D(uNoise, nq / 19.0 + 0.31), n3 = texture2D(uNoise, nq / 3.7);
          // relief from the same noise: blocks at 19 m, pitting at 3.7 m
          float bx = texture2D(uNoise, (nq + vec2(0.5, 0.0)) / 19.0 + 0.31).b - n2.b, bz = texture2D(uNoise, (nq + vec2(0.0, 0.5)) / 19.0 + 0.31).b - n2.b;
          float px = texture2D(uNoise, (nq + vec2(0.25, 0.0)) / 3.7).r - n3.r, pz = texture2D(uNoise, (nq + vec2(0.0, 0.25)) / 3.7).r - n3.r;
          vec3 Nb = normalize(N - vec3(bx * 9.0 + px * 2.2 * near, 0.0, bz * 9.0 + pz * 2.2 * near) * (1.0 - 0.5 * wall));
          // limestone pavement: pale blocks, dark grikes between them
          float grike = (1.0 - smoothstep(0.0, 0.09, abs(n2.b - 0.5))) * (0.35 + 0.65 * near);
          vec3 alb = uStone * vec3(0.84, 0.77, 0.64) * (0.62 + 0.3 * n1.r + 0.22 * (n2.r - 0.5) + 0.2 * (n3.r - 0.5) * near);
          alb *= 1.0 - 0.3 * grike;
          float xq = xz.x + (vP.z > 0.0 ? 500.0 : 0.0), bph = xq * 0.033 + 1.7 * sin(xq * 0.0071);
          float but = 1.0 - abs(sin(bph)); but *= but;                                   // 1 in the flutes between buttresses
          float lph = fract(vP.y * 0.043 + n1.r * 0.35 + 0.22 * sin(bph * 2.0));
          float ledgeTop = smoothstep(0.84, 0.9, lph) * (1.0 - smoothstep(0.95, 1.0, lph)), ledgeUnder = smoothstep(0.55, 0.82, lph) * (1.0 - smoothstep(0.82, 0.86, lph));
          float fph = xq * 0.52 + n1.g * 3.0 + sin(vP.y * 0.05) * 1.2, fwf = fwidth(fph);
          float flutes = mix(0.5, abs(sin(fph)), 1.0 - smoothstep(0.3, 1.0, fwf));
          vec3 wallAlb = uStone * (0.56 + 0.2 * flutes + 0.1 * n2.r) * (1.0 - 0.3 * ledgeUnder) * (1.0 + 0.85 * ledgeTop) * (0.55 + 0.45 * (1.0 - but));
          alb = mix(alb, wallAlb, wall);
          vec4 vm = veinAt(xz);
          float v = vm.r, dry = vm.b, bd = bayDist(xz), inBay = 1.0 - smoothstep(-8.0, 6.0, bd);
          alb = mix(alb, uStone * (1.0 + 0.12 * n2.r) * (1.0 - 0.3 * grike), inBay * (1.0 - wall));
          // the bare stone is not blank: the net lay here once and left. Its old bed is still there, a honeycomb of chalk
          // tracks with a dark seam down each and a raised rim, moss inside the rims, the cells between them stained and
          // damp by turns; ahead of the growing edge lemon scouts are already running back along the old seams
          float gE = 99.0, gm = inBay * (1.0 - wall);
          if (gm > 0.01) {
            vec2 gq = (xz + (n1.rg - 0.5) * 15.0 + (n2.rg - 0.5) * 2.0) / 34.0, gi = floor(gq), gf = gq - gi;
            float f1 = 9.0, f2 = 9.0; vec2 c1 = vec2(0.0), d1 = vec2(0.0, 1.0);
            for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
              vec2 o = vec2(float(i), float(j)), cid = gi + o, pt = o + 0.2 + 0.6 * vec2(h21(cid), h21(cid + 31.7)) - gf;
              float dd = dot(pt, pt);
              if (dd < f1) { f2 = f1; f1 = dd; c1 = cid; d1 = pt; } else if (dd < f2) { f2 = dd; }
            }
            gE = (sqrt(f2) - sqrt(f1)) * 17.0;                                  // metres to the nearest old track, about
            float ch = h21(c1 + 5.1), ch2 = h21(c1 + 9.7);
            float gTrk = 1.0 - smoothstep(1.3, 2.3, gE), gRim = smoothstep(1.9, 2.7, gE) * (1.0 - smoothstep(2.7, 4.4, gE)), gSeam = 1.0 - smoothstep(0.35, 0.95, gE);
            vec3 a2 = uStone * (0.5 + 0.36 * ch + 0.14 * n2.r + 0.2 * (n1.r - 0.5)) * (1.0 - 0.14 * grike) * (1.0 - 0.16 * smoothstep(4.0, 13.0, gE));
            a2 = mix(a2, a2 * vec3(0.7, 0.8, 0.98), step(ch2, 0.3) * 0.7);                                                    // damp cells are blue-grey
            a2 = mix(a2, a2 * vec3(1.06, 0.88, 0.62), step(0.5, ch2) * (0.3 + 0.5 * n1.g));                                   // old honey stain
            float gMoss = smoothstep(0.42, 0.68, n2.g + 0.3 * n1.b) * smoothstep(2.4, 4.6, gE) * (1.0 - smoothstep(5.0, 12.0, gE)) * step(0.38, ch);
            a2 = mix(a2, uMoss * (0.6 + 0.6 * n3.g), gMoss * 0.72);
            a2 = mix(a2, uStone * 1.42 + 0.04, gTrk * 0.9 * (0.8 + 0.2 * n3.b));
            a2 *= (1.0 + 0.22 * gRim) * (1.0 - 0.62 * gSeam);
            alb = mix(alb, a2, gm);
            vec2 gd = d1 / max(length(d1), 0.001);
            float tilt = smoothstep(2.4, 3.2, gE) * (1.0 - smoothstep(3.2, 4.8, gE)) - smoothstep(0.7, 1.5, gE) * (1.0 - smoothstep(1.5, 2.4, gE));
            Nb = normalize(mix(Nb, N, 0.45 * gm) + vec3(gd.x, 0.0, gd.y) * (tilt * 0.55 * gm));
          }
          // moss cushions, greenest along the dried tracks; nothing grows beside a live vein
          float moss = smoothstep(0.56, 0.74, n2.g + 0.25 * n1.b + 0.4 * dry - 0.18) * (1.0 - wall) * (1.0 - 0.85 * inBay) * (1.0 - smoothstep(0.75, 0.95, v));
          alb = mix(alb, uMoss * (0.6 + 0.6 * n3.g), moss * 0.75);
          // dried tracks: chalky ribbons with raised edges
          float bedIn = smoothstep(0.8, 0.9, dry), dryO = dry * (1.0 - bedIn) * 1.29;
          float trk = smoothstep(0.66, 0.82, dryO), rim = smoothstep(0.5, 0.64, dryO) * (1.0 - smoothstep(0.66, 0.76, dryO));
          alb = mix(alb, uStone * 1.3 + 0.03, trk * 0.8 * (0.75 + 0.25 * n3.b) * (1.0 - wall));
          alb *= 1.0 - 0.3 * rim;
          // the bed of the arm that starves: as it shrinks it leaves a pale chalky channel as wide as it was, with a raised
          // lip and a dark seam inside it, moss already at its edge
          float bedMid = smoothstep(0.93, 0.99, dry), bedLip = bedIn * (1.0 - bedMid);
          vec3 chalk = uStone * (1.45 + 0.25 * n3.b - 0.2 * n2.r) + vec3(0.07, 0.065, 0.05);
          alb = mix(alb, chalk * (1.0 - 0.3 * smoothstep(0.2, 0.9, fract(n1.r * 9.0 + n2.g * 3.0)) * bedMid), bedIn * uStarve);
          alb = mix(alb, uMoss * (0.8 + 0.5 * n3.g), smoothstep(0.62, 0.8, dry) * (1.0 - bedIn) * uStarve * 0.8);
          alb *= 1.0 + uStarve * (0.3 * bedLip - 0.34 * smoothstep(0.86, 0.93, dry) * (1.0 - smoothstep(0.93, 0.97, dry)));
          // contact shade and the pale hem where a vein rests
          float ao = (1.0 - 0.55 * smoothstep(0.78, 0.97, v)) * (1.0 - 0.3 * grike) * mix(0.66 + 0.2 * n1.b, 1.0, max(wall, smoothstep(10.0, 40.0, hgt)));
          alb = mix(alb, uStone * 1.2, smoothstep(0.9, 0.96, v) * 0.45);
          // K8: THE GORGE WALLS' RELIEF, per pixel, from the phases live paints them with (bph, lph, fph above), in world
          // height and metres along the gorge, the same on both walls and under the route as anywhere. Below the lip the
          // sky fill is the only light, so the relief is an occlusion and a normal turned down, and it only darkens:
          // nothing comes out paler than live. It reads no camera (not V, dist or near) and nothing of ground().
          {
            // ledges: the band under each painted lip stands in the lip's shade, deepest right under its edge (0.17 of the
            // fill goes: a tone set on the whole wall beside live, a third of the first depth), and faces down at 45 degrees
            // there. The edge is cut at the foot of live's pale band (0.84) one pixel wide; the band's own width on the
            // screen is taken from the phase before its fract(), so its wrap draws no hairline.
            float lu = vP.y * 0.043 + n1.r * 0.35 + 0.22 * sin(bph * 2.0), fwl = fwidth(lu);
            float lUnder = smoothstep(0.55, 0.84, lph) * clamp((0.84 - lph) / max(fwl, 1e-5) + 0.5, 0.0, 1.0) * (1.0 - smoothstep(0.3, 1.0, fwl / (0.84 - 0.55)));
            // flutes: the seam between two ribs lies on live's dark line (sin(fph) = 0). A wall flute is 6 m wide
            // (pi / 0.52); the shade at its seam is 0.055 deep: a tone set on the whole wall beside live (a third of the
            // first depth), not a measure of the flute. Finer than a pixel it goes to its mean over one flute
            // (1 - 2 / pi) by live's own filter (fwf).
            float fSeam = mix(0.3634, 1.0 - abs(sin(fph)), 1.0 - smoothstep(0.3, 1.0, fwf));
            // the notch between two buttresses (but, the lip's own 11 m recess, about 18 m wide at half its depth):
            // its shade is a ninth at its back: a tone set on the whole wall beside live, not a measure of the notch
            float wAo = (1.0 - 0.17 * lUnder) * (1.0 - 0.055 * fSeam) * (1.0 - but / 9.0);
            ao *= mix(1.0, wAo, wall);
            Nb.y -= lUnder * wall;
            Nb = Nb / max(length(Nb), 1e-4);
          }
          vec3 col = stoneLight(alb, Nb, vP, hgt, ao);
          float reach = sunReach(xz, hgt);
          // thread veins: exploratory filaments fanning out from every vein and behind the growing edge
          float t1 = (n2.r + 0.5 * n1.g) * 5.0, t2 = (n2.g + 0.6 * n3.a * near) * 4.0;
          float f1 = fwidth(t1), f2 = fwidth(t2);
          float l1 = (1.0 - smoothstep(0.014, 0.0142 + f1 * 1.5, abs(fract(t1) - 0.5))) * (1.0 - smoothstep(0.25, 0.7, f1));
          float l2 = (1.0 - smoothstep(0.016, 0.0162 + f2 * 1.5, abs(fract(t2) - 0.5))) * (1.0 - smoothstep(0.25, 0.7, f2));
          float behind = smoothstep(2.0, 14.0, bd) * (1.0 - smoothstep(30.0, 70.0, bd));
          float thr = max(l1 * smoothstep(0.5, 0.8, v), l2 * max(smoothstep(0.62, 0.9, v), behind)) * (1.0 - wall) * (1.0 - inBay);
          vec3 thrCol = mix(uLemon, uAmber, 0.45) * (0.5 + 0.5 * reach + 0.25 * n3.g) * (0.72 + 0.5 * sin((t1 + t2) * 21.0 - uPulse * 0.22));
          thr *= (1.0 - 0.7 * smoothstep(60.0, 170.0, dist)) * (1.0 - bedIn * uStarve);
          col = mix(col, thrCol, thr * 0.6);
          { float front = smoothstep(-150.0, -10.0, bd) * gm * (1.0 - 0.6 * smoothstep(120.0, 320.0, dist));
            float scout = (1.0 - smoothstep(0.4, 1.2, gE)) * front * (0.6 + 0.4 * sin(gE * 3.0 + (xz.x + xz.y) * 0.21 - uPulse * 0.22));
            col = mix(col, mix(uLemon, uAmber, 0.3) * (0.75 + 0.5 * reach), min(scout * 1.1, 1.0));
            col += uLemon * uKey * (0.07 * front * (1.0 - smoothstep(0.4, 3.2, gE))); }
          // light through the veins stains the rock beyond them
          float vs = veinAt(xz + uSun.xz * 9.0).r;
          col += uAmber * uKey * (smoothstep(0.5, 0.95, vs) * (1.0 - smoothstep(0.86, 0.98, v)) * 0.13 * (0.5 + uShade.y));
          // rain pans mirror the sky
          float pan = smoothstep(0.0, 0.03, n2.a * 0.62 + n1.g * 0.38 - mix(0.86, 0.74, uShade.z)) * smoothstep(0.93, 0.985, N.y) * (1.0 - trk) * (1.0 - smoothstep(0.8, 0.95, v));
          float fres = 1.0 - max(V.y, 0.0); fres *= fres;
          vec3 R = reflect(-V, normalize(vec3(sin(uTime * 1.7 + xz.x * 2.1) * 0.012, 1.0, sin(uTime * 1.3 + xz.y * 2.6) * 0.012)));
          float gl = max(dot(R, uSun), 0.0); gl *= gl; gl *= gl; gl *= gl; gl *= gl; gl *= gl;
          vec3 panCol = mix(uHorizon, uZen, clamp(R.y * 1.4, 0.0, 1.0)) * (0.24 + 0.6 * fres) + uKey * gl * gl * 3.0 * reach;
          panCol += vec3(0.5) * smoothstep(0.55, 0.75, texture2D(uNoise, xz / 37.0 + R.xz * 0.6 + vec2(uTime * 0.02, 0.0)).a) * (0.1 + 0.4 * fres);
          col = mix(col, panCol, pan * 0.92);
          col += (uHorizon * 0.5 + uZen * 0.2) * uShade.z * fres * fres * 0.22 * (1.0 - pan);      // wet stone takes a sky sheen
          // the growing edge: a lemon sheet in round lobes that bud on each out-stroke
          if (abs(bd - 10.0) < 46.0 && wall < 0.5) {
            vec2 id = floor(xz / 7.0); float best = 9.0;
            for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
              vec2 c = id + vec2(float(i), float(j)), h = vec2(h21(c), h21(c + 17.3)), cc = (c + 0.2 + 0.6 * h) * 7.0;
              float bdc = (textureLod(uVeinMap, (cc - uMapRect.xy) * uMapRect.zw, 0.0).a - 0.5) * 160.0 + uCreep.x;
              float Rl = clamp(bdc * 0.7 + 2.2 + 0.9 * sin(uCreep.y * 6.2832 + h.y * 6.2832) * h.x, 0.0, 6.4);
              best = min(best, length(xz - cc) - Rl + step(Rl, 0.05) * 9.0);
            }
            float sheet = (1.0 - smoothstep(-0.2, 0.25, best)) * (1.0 - smoothstep(12.0, 30.0, bd));
            float dome = clamp(-best / 3.5, 0.0, 1.0), lip = smoothstep(0.0, 0.5, -best) * (1.0 - smoothstep(0.5, 1.6, -best));
            // each lobe is a low dome of young glass: lemon where it is thin at the edge, amber where it is deep, the stone showing through
            float deep = smoothstep(0.1, 0.9, dome);
            vec3 sc = mix(uLemon, uAmber * vec3(1.0, 0.86, 0.7), deep * 0.9) * (0.36 + 0.4 * lip + 0.55 * reach + 0.12 * n3.g) * (1.0 - 0.3 * deep * (1.0 - reach));
            sc = mix(sc, col * mix(uLemon, uAmber, 0.5) * 2.2, 0.3 * (1.0 - lip));
            float dg = max(dot(reflect(-V, normalize(vec3(-uSun.x, 2.2, -uSun.z) * vec3(1.0 - dome, 1.0, 1.0 - dome))), uSun), 0.0); dg *= dg; dg *= dg; dg *= dg; dg *= dg;
            sc += uKey * dg * dg * 0.7 * reach + uHorizon * 0.12 * fres;
            col = mix(col * (1.0 - 0.35 * (1.0 - smoothstep(0.0, 1.2, best)) * step(0.0, best)), sc, sheet);
          }
          vec3 stoneK = col;                                     // K8: the stone before live's mist tone
          col = gorgeMist(col, vP);
          col = mix(col, stoneK, gorgeThin(vP));                 // K8: a hollow against the wall thins live's tone (never above y -120, never at the foot)
          gl_FragColor = vec4(col, 1.0);
          #include <fog_fragment>
        }`}),Ot=new l.Mesh(Xe,Wt);K.add(Ot),await v.yield();const Ut=`
      // radius (in units of the tower's base radius) at angle a and height fraction f; sd = seed, nf = flute count
      float towerR(float a, float f, float sd, float nf, float flute, out float cap){
        float crown = 0.5 + 0.5 * sin(a * 2.0 + sd) * cos(a * 3.0 - sd * 1.7);
        float h = clamp(f + 0.17 * crown * smoothstep(0.45, 0.95, f), 0.0, 1.0);
        float r = 0.86 - 0.33 * h;
        for (int k = 0; k < 4; k++) {
          float lg = 0.17 + 0.2 * float(k) + 0.03 * sin(sd * 3.0 + float(k) * 1.9) + 0.025 * sin(a * 2.0 + float(k) * 2.1 + sd);
          r += step(h, lg) * (0.03 + (0.09 + 0.05 * flute) * smoothstep(lg - 0.035, lg - 0.004, h));
        }
        cap = smoothstep(0.86, 1.0, h);
        r *= sqrt(max(1.0 - cap * cap, 0.0)) * 0.98 + 0.02 * (1.0 - cap);
        r *= 1.0 + 0.13 * sin(a * 2.0 + sd * 2.3 + h * 1.5) + 0.07 * sin(a * 3.0 + sd);
        r *= 1.0 - 0.1 * (1.0 - smoothstep(0.06, 0.1, f)) * smoothstep(0.0, 0.05, f) + 0.3 * (1.0 - smoothstep(0.0, 0.05, f));      // undercut foot, then the buried flare
        float fl = abs(sin(a * nf * 0.5 + sin(f * 9.0 + sd) * 0.5));
        float groove = (1.0 - fl) * (1.0 - fl);
        return r * (1.0 - 0.17 * flute * (1.0 - groove) * (1.0 - cap * 0.7));
      }`,yt=(e,t)=>{const a=new Float32Array((e+1)*(t+1)*2),o=new Uint16Array(e*t*6);for(let i=0;i<=t;i++)for(let r=0;r<=e;r++){const f=(i*(e+1)+r)*2;a[f]=r/e*Math.PI*2,a[f+1]=Math.pow(i/t,.85)}let s=0;for(let i=0;i<t;i++)for(let r=0;r<e;r++){const f=i*(e+1)+r,n=f+e+1;o[s++]=f,o[s++]=f+1,o[s++]=n,o[s++]=n,o[s++]=f+1,o[s++]=n+1}return{af:new l.BufferAttribute(a,2),idx:new l.BufferAttribute(o,1),pos:new l.BufferAttribute(new Float32Array((e+1)*(t+1)*3),3)}},bt=e=>new l.ShaderMaterial({fog:!0,uniforms:{...je(),...ve,uFlute:{value:e}},vertexShader:`
        attribute vec2 aAF; attribute vec4 aI, aJ;
        uniform float uFlute;
        varying vec3 vP, vN; varying vec4 vJ; varying vec3 vAF;
        varying float vTR;                                       // K8: the tower's base radius in metres, for the per-pixel relief
        #include <fog_pars_vertex>
        ${Ut}
        vec3 tp(float a, float f){ float c; float r = towerR(a, f, aJ.y, aJ.z, uFlute, c) * aI.w; return vec3(aI.x + sin(a) * r, aI.y - 7.0 + f * (aJ.x + 7.0), aI.z + cos(a) * r); }
        void main(){
          float a = aAF.x, f = aAF.y, df = f > 0.9 ? -0.012 : 0.012;
          vec3 p = tp(a, f), c = cross(tp(a + 0.03, f) - p, (tp(a, f + df) - p) * sign(df));
          vN = mix(c / max(length(c), 1e-5), vec3(0.0, 1.0, 0.0), smoothstep(0.97, 1.0, f));
          vP = p; vJ = aJ; vAF = vec3(a, f, aI.y);
          vTR = aI.w;
          vec4 mvPosition = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        varying vec3 vP, vN; varying vec4 vJ; varying vec3 vAF;
        varying float vTR;
        #include <fog_pars_fragment>
        ${Ge}
        void main(){
          vec3 N = normalize(vN); float a = vAF.x, f = vAF.y, sd = vJ.y, H = vJ.x;
          float dist = length(cameraPosition - vP);
          float crown = 0.5 + 0.5 * sin(a * 2.0 + sd) * cos(a * 3.0 - sd * 1.7);
          float h = clamp(f + 0.17 * crown * smoothstep(0.45, 0.95, f), 0.0, 1.0), cap = smoothstep(0.86, 1.0, h);
          float fl = abs(sin(a * vJ.z * 0.5 + sin(f * 9.0 + sd) * 0.5)), groove = (1.0 - fl) * (1.0 - fl);
          vec4 n1 = texture2D(uNoise, vec2(a * 1.3 + sd, vP.y * 0.012)), n2 = texture2D(uNoise, vec2(a * 5.0 + sd, vP.y * 0.07));
          // fine solution grooves, faded before they alias, and faint bedding
          float ph = a * 46.0 + sin(vP.y * 0.11 + sd) * 1.4 + n1.r * 3.0, fw = fwidth(ph);
          {  // the flutes meet in knife edges and carry fine runnels: both turn the shading normal round the tower
            float fa = a * vJ.z * 0.5 + sin(f * 9.0 + sd) * 0.5, nearK = 1.0 - smoothstep(70.0, 260.0, dist);
            vec3 tang = vec3(cos(a), 0.0, -sin(a));
            float knife = cos(fa) * sign(sin(fa)) * (1.0 - cap) * nearK;
            float runnel = cos(ph) * sign(sin(ph)) * (1.0 - smoothstep(0.2, 0.7, fw)) * (1.0 - cap);
            float bedN = cos(vP.y * 0.41 + sin(a * 3.0 + sd) * 2.0 + sin(vP.y * 0.13) * 3.0) * nearK;
            N = normalize(N + tang * (0.5 * knife + 0.22 * runnel) + vec3(0.0, 0.16 * bedN, 0.0));
          }
          float fine = mix(0.6, abs(sin(ph)), 1.0 - smoothstep(0.2, 0.7, fw));
          float bed = sin(vP.y * 0.41 + sin(a * 3.0 + sd) * 2.0 + sin(vP.y * 0.13) * 3.0);
          vec3 alb = uStone * (0.82 + 0.24 * groove + 0.14 * (n1.g - 0.5) + 0.1 * (n2.r - 0.5));
          alb = mix(alb, uFill * 0.9, 0.14 * (1.0 - groove));
          alb = mix(alb, vec3(0.9, 0.82, 0.66) * 0.8, (0.5 * cap + 0.25 * smoothstep(0.6, 1.0, h) * groove) * smoothstep(12.0, 40.0, H));
          alb *= 0.72 + 0.28 * smoothstep(12.0, 40.0, H);
          alb *= 0.88 + 0.17 * fine * (1.0 - 0.6 * cap) + 0.05 * bed;
          alb *= 1.0 - 0.2 * smoothstep(0.55, 0.75, n2.b) * (1.0 - cap);
          float nearT = 1.0 - smoothstep(40.0, 150.0, dist); vec4 n3 = texture2D(uNoise, vec2(a * 19.0 + sd, vP.y * 0.31));
          alb *= 1.0 + nearT * (0.22 * (n3.r - 0.5) - 0.2 * (1.0 - smoothstep(0.02, 0.1, abs(fract(vP.y * 0.19 + n1.r * 2.0 + sin(a * 2.0) * 0.4) - 0.5))) * step(0.45, n2.g));                                  // rain streaks
          // moss on faces turned from the sun and low down; ledges carry ferns and cushions
          float away = clamp(-(sin(a) * uSun.x + cos(a) * uSun.z), 0.0, 1.0), ledge = smoothstep(0.55, 0.9, N.y) * (1.0 - cap);
          float moss = smoothstep(0.55, 0.8, n1.b * 0.7 + 0.35 * away - 0.4 * h + 0.5 * ledge + 0.15 * n2.g);
          alb = mix(alb, uMoss * (0.7 + 0.6 * n2.g), moss * 0.45);
          float hgt = vP.y - (vP.z < 0.0 ? 0.012 * max(-150.0 - vP.z, 0.0) : 4.0), foot = vP.y - vAF.z;
          float ao = (0.6 + 0.4 * groove) * (0.55 + 0.45 * smoothstep(0.0, 9.0, foot));
          // K8: THE STONE'S RELIEF PER PIXEL, one rule on every tower of all three meshes, written in the tower's own angle,
          // height and radius. It goes into the sky fill's occlusion and the shading normal that stoneLight and the cap
          // light take, and nowhere else (the warm rim and the wet glint below keep live's N). It reads no camera, no
          // distance, no uFlute; what is finer than a pixel fades by its own width on the screen (fwidth, taken here).
          vec3 Nr = N; float rAo = 1.0;
          {
            // fine solution grooves (0.3 to 1.5 m, phase ph): the knife ridge lies where sin(ph) is 0, as live's runnel
            // normal cuts it, the round bottom where abs(sin(ph)) is 1. The occlusion is nil on the ridge and lies only
            // in the runnel at the groove's bottom, about an eighth of the groove wide (abs(sin(ph)) to the 32nd), so the
            // body between keeps live's tone. Its depth 0.22 is a tone set on every tower beside live, not a measure: in shade
            // (it acts on the sky fill alone) it takes the runnel, painted 1.05, to 0.82, under its ridge at 0.88. On the cap
            // it thins as the paint does. Finer than a pixel it goes to its mean over one groove (0.14 of the depth).
            float gS = sin(ph); gS *= gS; gS *= gS; gS *= gS; gS *= gS; gS *= gS;
            float gAo = 1.0 - 0.22 * (1.0 - 0.6 * cap) * mix(0.14, gS, 1.0 - smoothstep(0.2, 0.7, fw));
            // the four ledges, from the profile's own heights (GLSL_TOWER): under each lip the rock swells out by 0.14 of
            // the radius over 0.035 - 0.004 of the height, so that band faces down and stands in the lip's shade; at the
            // lip the profile steps back by 0.17 of the radius, a shelf that faces the sky.
            float fwh = fwidth(h), rel = vTR / max(H + 7.0, 1.0), lipW = 0.035 - 0.004;
            // a shelf falls outward at one in four, so rain runs off it: its top shows as a band a quarter of its depth tall
            float topW = max(0.25 * 0.17 * rel, 1e-4);
            float under = 0.0, tilt = 0.0, top = 0.0;
            for (int k = 0; k < 4; k++) {
              float lg = 0.17 + 0.2 * float(k) + 0.03 * sin(sd * 3.0 + float(k) * 1.9) + 0.025 * sin(a * 2.0 + float(k) * 2.1 + sd);
              float below = clamp((lg - h) / max(fwh, 1e-5) + 0.5, 0.0, 1.0);          // 1 under the lip's edge, 0 over it, one pixel wide
              float tt = clamp((h - (lg - 0.035)) / lipW, 0.0, 1.0);
              under = max(under, tt * tt * (3.0 - 2.0 * tt) * below);
              tilt = max(tilt, 6.0 * tt * (1.0 - tt) * below);
              top = max(top, (1.0 - below) * (1.0 - smoothstep(0.0, topW, h - lg)));
            }
            float lKeep = (1.0 - smoothstep(0.3, 1.0, fwh / lipW)) * (1.0 - cap), tKeep = (1.0 - smoothstep(0.3, 1.0, fwh / topW)) * (1.0 - cap);
            // right under a lip a quarter of the fill goes (half the first depth, as the brief audit asked): a deeper sky blue, never near black
            rAo = gAo * (1.0 - 0.25 * under * lKeep);
            // the swell's own slope (0.14 of the radius over lipW of the height, steepest in the middle) turns the normal down
            Nr = N + vec3(0.0, -min(0.14 * rel / lipW * tilt, 2.0) * lKeep, 0.0);
            Nr = Nr / max(length(Nr), 1e-4);
            Nr = mix(Nr, vec3(0.0, 1.0, 0.0), top * tKeep);
            Nr = Nr / max(length(Nr), 1e-4);
          }
          vec3 col = stoneLight(alb, Nr, vP, hgt, ao * rAo);
          // the low sun catches every crown: an ivory cap over a blue body
          float capR = sunReach(vP.xz, hgt + 5.0 + 0.3 * H);
          float tall = smoothstep(12.0, 40.0, H);                 // a stump is a dark boulder, not a white heap
          float capL = smoothstep(0.42, 0.95, h) * capR * (0.55 + 0.45 * clamp(dot(Nr, uSun) * 0.5 + 0.6, 0.0, 1.0)) * (0.15 + 0.85 * tall) * rAo;     // K8: the cap light takes the relief's normal and shade
          col += alb * uKey * vec3(1.0, 0.84, 0.56) * capL * clamp(1.6 - 1.7 * uSun.y, 0.5, 1.25);
          // seen against the sun, every crown and flute edge wears a warm rim
          vec3 Vr = normalize(cameraPosition - vP); float rimE = 1.0 - max(dot(N, Vr), 0.0), rimB = max(-dot(Vr, uSun), 0.0);
          col += alb * uKey * vec3(1.0, 0.8, 0.5) * (rimE * rimE * rimE * rimB * rimB * 1.6 * (0.25 + 0.75 * smoothstep(0.3, 0.9, h)) * (0.3 + 0.7 * capR));
          // after rain the wet stone glints toward the low sun
          vec3 Vw = normalize(cameraPosition - vP); float gw = max(dot(reflect(-Vw, N), uSun), 0.0); gw *= gw; gw *= gw; gw *= gw;
          col += uKey * uShade.z * gw * (0.1 + 0.5 * gw) * (0.4 + 0.6 * groove) * sunReach(vP.xz, hgt + 10.0);
          col *= 0.78 + 0.22 * smoothstep(0.0, 0.5, f);
          // amber light thrown onto the foot by the vein that passes it
          float vs = veinAt(vP.xz + uSun.xz * 5.0).r;
          col += uAmber * uKey * (smoothstep(0.55, 1.0, vs) * (1.0 - smoothstep(2.0, 16.0, foot)) * 0.16 * (0.6 + uShade.y));
          col += (uHorizon * 0.4) * uShade.z * 0.1 * (1.0 - N.y * N.y);                                   // wet sheen
          col = gorgeMist(col, vP);
          gl_FragColor = vec4(col, 1.0);
          #include <fog_fragment>
        }`}),Qe=we.filter(e=>e.on).concat(pt);for(let e=0;e<Qe.length;e++){const t=Qe[e];t.pd=S.nearestXZ(t.x,t.z).dist,t.gy=pe(t.x,t.z)-(t.sink||0),t.flutes=2*(5+Math.floor(t.seed%3)),e%150===149&&await v.yield()}Qe.sort((e,t)=>e.pd-t.pd),await v.yield();{const t=Math.round(120*(.6+.4*Z)),a=[{list:Qe.slice(0,18),base:yt(44,20),mat:bt(1),bands:1},{list:Qe.slice(18,18+t),base:yt(16,9),mat:bt(.5),bands:3},{list:Qe.slice(18+t),base:yt(7,3),mat:bt(0),bands:3}];for(const o of a){const s=o.list.slice().sort((r,f)=>r.z-f.z),i=Math.ceil(s.length/o.bands);for(let r=0;r<o.bands;r++){const f=s.slice(r*i,(r+1)*i);if(!f.length)continue;const n=new l.InstancedBufferGeometry;n.setAttribute("position",o.base.pos),n.setAttribute("aAF",o.base.af),n.setIndex(o.base.idx);const d=new Float32Array(f.length*4),u=new Float32Array(f.length*4),h=new l.Box3;f.forEach((c,w)=>{d.set([c.x,c.gy,c.z,c.r],w*4),u.set([c.h,c.seed,c.flutes,0],w*4),h.expandByPoint(new l.Vector3(c.x-30,c.gy-10,c.z-30)),h.expandByPoint(new l.Vector3(c.x+30,c.gy+c.h,c.z+30))}),n.setAttribute("aI",new l.InstancedBufferAttribute(d,4)),n.setAttribute("aJ",new l.InstancedBufferAttribute(u,4)),n.instanceCount=f.length,n.boundingSphere=h.getBoundingSphere(new l.Sphere),K.add(new l.Mesh(n,o.mat))}await v.yield()}}await v.yield();const zt=[];{const e=[],t=[],a=[],o=(C,q,U,ee=0)=>(e.push(C,q,U),t.push(ee),e.length/3-1),s=o(0,0,-.45),i=o(0,.03,.22),r=o(.08,0,-.05),f=o(0,.07,-.05),n=o(-.08,0,-.05),d=o(0,-.06,-.05);for(const[C,q]of[[r,f],[f,n],[n,d],[d,r]])a.push(s,q,C,i,C,q);const u=o(-.03,.03,.18),h=o(.03,.03,.18),c=o(-.022,.1,.34,-1),w=o(.022,.1,.34,-1),p=o(-.035,.1,.5,-2),m=o(.035,.1,.5,-2),g=o(0,.08,.72,-2);a.push(u,h,c,c,h,w,c,w,p,p,w,m,p,m,g);for(const C of[1,-1]){const q=o(C*.03,-.04,-.02),U=o(C*.03,-.04,-.1),ee=o(C*.035,-.06,-.06,-3);a.push(q,U,ee)}for(const C of[1,-1]){const q=o(C*.05,.03,.12,.05),U=o(C*.05,.03,-.14,.05),ee=o(C*.4,.03,.14,.53),Be=o(C*.4,.03,-.16,.53),lt=o(C*.75,.03,.02,1),Pt=o(C*.62,.03,-.14,.85);a.push(q,ee,U,U,ee,Be,ee,lt,Be,Be,lt,Pt)}const y=60,x=Math.min(14,N.perches.length),b=Math.round(40*(.5+.5*Z)),M=Math.round($?170*Z:18*Z),P=13,E=y+x+b+M+P,B=new Float32Array(E*4),R=new Float32Array(E*4),k=z.fork("birds"),V=new l.Vector3,Q=new l.Vector3;let ce=0;const Ae=(C,q,U,ee,Be,lt,Pt,$t)=>{B.set([C,q,U,ee],ce*4),R.set([Be,lt,Pt,$t],ce*4),ce++},We=(C,q)=>pe(C,q)+.25*6+6*.62;for(let C=0;C<y;C++){const q=D(.575,.66,(C+k())/y);S.pointAt(q,V),S.tangentAt(q,Q);const U=k.range(-2.6,2.6),ee=V.x+Q.z*U,Be=V.z-Q.x*U;Ae(ee,We(ee,Be)-.9*Math.abs(U)*Math.abs(U)/6,Be,k(),0,q-14/S.length-k()*.004,(U>=0?1:-1)*k.range(.7,1.3),Math.atan2(Q.x,Q.z))}for(let C=0;C<x;C++){const q=N.perches[C].position;Ae(q.x,q.y+.1,q.z,k(),1,C%3===0?k.range(9,16):0,k.range(.5,.8),k()*6.28)}for(let C=0;C<b;C++){const q=C%2,U=C>>1,ee=U%2?1:-1;Ae(q?520:-620,(q?112:96)+k.range(-1.5,1.5),q?-640:-330,k(),2,q?-1.9:1.75,q?15:17,ee*Math.ceil(U/2))}const Oe=re[14],Te=_;for(let C=0;C<M;C++){const q=k.range(.25,.75),U=D(Oe.x,Te.x,q),ee=D(Oe.z,Te.z,q);Ae(U,We(U,ee)+k.range(.6,2.4),ee,k(),3,Math.atan2(Te.x-Oe.x,Te.z-Oe.z),k.range(30,75),k.range(.35,.6)*(k()<.5?1:-1))}{S.pointAt(.08,V),S.tangentAt(.08,Q);const C=Math.atan2(-Q.z,Q.x);for(let q=0;q<P;q++){const U=Math.ceil(q/2),ee=q%2?1:-1;Ae(V.x+Q.x*50,V.y-9.5+k.range(-.6,.6),V.z+Q.z*50,k(),4,C,U*3.6,ee*U*2.7)}}const be=new l.InstancedBufferGeometry;be.setAttribute("position",new l.BufferAttribute(new Float32Array(e),3)),be.setAttribute("aW",new l.BufferAttribute(new Float32Array(t),1)),be.setIndex(a),be.setAttribute("aH",new l.InstancedBufferAttribute(B,4)),be.setAttribute("aM",new l.InstancedBufferAttribute(R,4)),be.instanceCount=E,be.boundingSphere=new l.Sphere(new l.Vector3(0,0,-400),1400);const rt={...je(),...ve,uU:{value:0},uBody:{value:new l.Color($?"#4A423A":"#F4F1E8")},uSize:{value:$?.6:1}},it=new l.ShaderMaterial({fog:!0,side:l.DoubleSide,uniforms:rt,vertexShader:`
          attribute float aW; attribute vec4 aH, aM;
          uniform float uTime, uU, uSize;
          varying float vShade, vPale;
          #include <fog_pars_vertex>
          void main(){
            float mode = aM.x, ph = aH.w * 6.2832;
            vec3 home = aH.xyz, off = vec3(0.0); float head = aM.w, fly = 1.0, bank = 0.0, pitch = 0.0, size = 1.25 * uSize;
            if (mode < 0.5) {                       // roost, then lift in a wave as the camera comes
              float q = max(uU - aM.y, 0.0) / 0.06; fly = smoothstep(0.0, 0.05, q);
              float c = cos(aM.w), s = sin(aM.w), sd = aM.z;
              vec2 f2 = vec2(s, c), r2 = vec2(c, -s);
              off.xz = f2 * (q * 42.0) + r2 * sd * (0.6 * fly + 3.6 * smoothstep(0.0, 0.2, q) + 20.0 * q * q);
              off.y = 9.0 * sqrt(q) + 5.0 * q * q + 0.5 * sin(uTime * 3.0 + ph) * fly;
              head = aM.w + sd * 0.5 * smoothstep(0.1, 1.0, q); bank = -sd * 0.35 * fly; pitch = 0.5 * (1.0 - smoothstep(0.1, 0.5, q)) * fly;
            } else if (mode < 1.5) {                // perched on the strands; every third wheels round its perch
              float R = aM.y, a = uTime * aM.z * (22.0 / max(R, 9.0)) * 0.6 + ph; fly = step(0.5, R);
              off = vec3(cos(a) * R - R, 4.0 * fly + 2.0 * sin(a * 0.5) * fly, sin(a) * R); head = fly > 0.5 ? -a : aM.w; bank = 0.4 * fly;
            } else if (mode < 2.5) {                // far skeins: a vee crossing above the tops
              float side = aM.w * 4.5, d = mod(uTime * aM.z + 300.0, 1500.0) - abs(aM.w) * 5.0; head = aM.y;
              off.xz = vec2(sin(head), cos(head)) * d + vec2(cos(head), -sin(head)) * side; off.y = sin(uTime * 0.4 + ph) * 1.5; size = 5.0;
            } else if (mode > 3.5) {                // the near vee: its middle crosses the camera's line at u 0.08
              float d = (uU - 0.069) * 1100.0 - aM.z; head = aM.y;
              off.xz = vec2(sin(head), cos(head)) * d + vec2(cos(head), -sin(head)) * aM.w; off.y = 0.7 * sin(uTime * 0.6 + ph); size = 5.6;
            } else {                                // skimmers: long flat loops low over the vein
              float a = uTime * aM.w + ph, c = cos(aM.y), s = sin(aM.y);
              vec2 e = vec2(sin(a) * 3.2 * sign(aM.w), cos(a) * aM.z);
              off.xz = vec2(s, c) * e.y + vec2(c, -s) * e.x; off.y = 0.5 * sin(a * 3.0 + ph);
              head = aM.y + atan(cos(a) * 3.2, -sin(a) * aM.z * sign(aM.w)); size = 1.1 * uSize;
            }
            // no bird crosses the lens: one that would pass close shrinks away to nothing first
            float dcam = distance(cameraPosition, home + off); size *= mode < 0.5 ? smoothstep(2.5, 7.0, dcam) : smoothstep(9.0, 22.0, dcam);
            // pose: beat the wings when flying, fold them and stand tall when not
            vec3 p = position; float w = max(aW, 0.0), sx = sign(p.x), st = 1.0 - fly;
            if (aW < -2.5) { p.y -= 0.36 * st; p.z -= 0.42 * fly; p.y += 0.04 * fly; }
            else if (aW < -1.5) { p.y += 0.36 * st; p.z -= 0.24 * st; }
            else if (aW < -0.5) { p.y += 0.2 * st; p.z -= 0.16 * st; }
            float beat = sin(uTime * (mode > 1.5 && mode < 2.5 ? 7.0 : 11.0) + ph * 3.0), th = beat * 0.75 * fly;
            float lag = sin(uTime * 11.0 + ph * 3.0 - 0.9) * 0.5 * fly;
            p.y += abs(p.x) * sin(th) + max(w - 0.53, 0.0) * 0.8 * sin(lag);
            p.x = sx * mix(0.05 + w * 0.06, abs(p.x) * (0.8 + 0.2 * cos(th)), fly);
            p.z -= (1.0 - fly) * w * 0.3; p.y -= (1.0 - fly) * w * 0.12;
            float pt = mix(-0.3, -pitch, fly), cp = cos(pt), sp = sin(pt);
            p.yz = vec2(p.y * cp - p.z * sp, p.y * sp + p.z * cp); p.y += (1.0 - fly) * 0.38;
            p.xy = vec2(p.x * cos(bank) - p.y * sin(bank), p.x * sin(bank) + p.y * cos(bank));
            float ch = cos(head), sh = sin(head);
            p.xz = vec2(p.x * ch + p.z * sh, -p.x * sh + p.z * ch);
            vPale = step(3.5, mode);
            vShade = (0.62 + 0.38 * clamp(p.y * 2.0 + 0.5, 0.0, 1.0) + 0.2 * w * beat * fly) * (1.0 - 0.3 * smoothstep(0.7, 1.0, w)) * (aW < -2.5 ? 0.45 : 1.0);
            vec4 mvPosition = modelViewMatrix * vec4(home + off + p * size, 1.0); gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          uniform vec3 uBody, uKey, uHorizon, uZen; varying float vShade, vPale;
          #include <fog_pars_fragment>
          void main(){
            vec3 col = mix(uBody, vec3(0.96, 0.94, 0.9), vPale) * ((uHorizon * 0.55 + uZen * 0.3) + uKey * 0.5 * vShade) * vShade;
            gl_FragColor = vec4(col, 1.0);
            #include <fog_fragment>
          }`}),Dt=new l.Mesh(be,it);Dt.frustumCulled=!1,K.add(Dt),zt.push((C,q,U,ee)=>{rt.uU.value=ee})}await v.yield();const nt=(e,t,a)=>{const o=e.seed,s=.5+.5*Math.sin(t*2+o)*Math.cos(t*3-o*1.7),i=Le(a+.17*s*A(.45,.95,a),0,1);let r=.86-.33*i;for(let n=0;n<4;n++){const d=.17+.2*n+.03*Math.sin(o*3+n*1.9)+.025*Math.sin(t*2+n*2.1+o);i<=d&&(r+=.03+.14*A(d-.035,d-.004,i))}const f=A(.86,1,i);return r*=Math.sqrt(Math.max(1-f*f,0))*.98+.02*(1-f),r*=1+.13*Math.sin(t*2+o*2.3+i*1.5)+.07*Math.sin(t*3+o),r*e.r},Rt=(e,t)=>{const a=Math.floor((e-O.x0)/O.w*O.n),o=Math.floor((t-O.z0)/O.h*O.n);return a<0||o<0||a>=O.n||o>=O.n?0:Ze[(o*O.n+a)*4]/255};{const e=z.fork("flora"),t=Qe.slice(0,70),a=Math.round(520*Z*ie),o=new Float32Array(a*4),s=new Float32Array(a*4);let i=0;for(let P=0;P<a*4&&i<a;P++){const E=t[Math.floor(e()*e()*t.length)],B=e()*6.283,R=e()<.6,k=E.r*(R?e.range(.98,1.2):e.range(1.3,2.4)),V=E.x+Math.sin(B)*k,Q=E.z+Math.cos(B)*k,ce=R?e.range(1.2,4.2):e.range(.6,2.2);Rt(V,Q)>.8||S.nearestXZ(V,Q).dist<8+ce||He(V,Q)<-20||Q>-165||(P%120===119&&await v.yield(),o.set([V,pe(V,Q)+ce*.22,Q,ce],i*4),s.set([e()*6.283,R?e.range(.3,.9):e.range(0,.3),e.range(.55,1.5),e()*100],i*4),i++)}const r=new l.InstancedBufferGeometry,f=new l.BoxGeometry(1,1,1,2,1,2),n=f.attributes.position;for(let P=0;P<n.count;P++){const E=n.getX(P),B=n.getY(P),R=n.getZ(P),k=F.n3(E*3.1+9,B*3.1,R*3.1)*.22;n.setXYZ(P,E*(1+k)*(B>0?.8:1),B*(1-k),R*(1+k*.7)*(B>0?.86:1))}r.setAttribute("position",n),r.setIndex(f.index),r.setAttribute("aP",new l.InstancedBufferAttribute(o,4)),r.setAttribute("aQ",new l.InstancedBufferAttribute(s,4)),r.instanceCount=i,r.boundingSphere=new l.Sphere(new l.Vector3(_.x-30,20,_.z-480),620),Ce.push(f),K.add(new l.Mesh(r,new l.ShaderMaterial({fog:!0,uniforms:{...je(),...ve},vertexShader:`
          attribute vec4 aP, aQ; varying vec3 vP; varying float vSeed;
          #include <fog_pars_vertex>
          void main(){
            vec3 p = position * aP.w * vec3(1.0, aQ.z, 1.25 - 0.25 * aQ.z);
            float ct = cos(aQ.y), st = sin(aQ.y); p.xy = vec2(p.x * ct - p.y * st, p.x * st + p.y * ct);
            float cr = cos(aQ.x), sr = sin(aQ.x); p.xz = vec2(p.x * cr + p.z * sr, -p.x * sr + p.z * cr);
            vP = aP.xyz + p; vSeed = aQ.w;
            vec4 mvPosition = modelViewMatrix * vec4(vP, 1.0); gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          varying vec3 vP; varying float vSeed;
          #include <fog_pars_fragment>
          ${Ge}
          void main(){
            vec3 c = cross(dFdx(vP), dFdy(vP)), N = c / max(length(c), 1e-6);
            vec4 n = texture2D(uNoise, vP.xz / 2.3 + vP.y * 0.21 + vSeed);
            vec3 alb = uStone * (0.78 + 0.3 * n.r + 0.1 * fract(vSeed));
            alb = mix(alb, uMoss * (0.6 + 0.5 * n.g), smoothstep(0.5, 0.75, n.b + 0.3 * N.y) * 0.55);
            float hgt = vP.y - (vP.z < 0.0 ? 0.012 * max(-150.0 - vP.z, 0.0) : 4.0);
            vec3 col = stoneLight(alb, N, vP, hgt, 0.62 + 0.3 * smoothstep(0.0, 2.5, hgt));
            col += uAmber * uKey * smoothstep(0.55, 1.0, veinAt(vP.xz + uSun.xz * 5.0).r) * 0.14;
            gl_FragColor = vec4(col, 1.0);
            #include <fog_fragment>
          }`}))),await v.yield();const d=[],u=[],h=[];for(let P=0;P<6;P++){const E=P/6*6.283+.3*Math.sin(P*2.4),B=Math.cos(E),R=Math.sin(E),k=d.length/3,V=.11;d.push(-R*V,0,B*V,R*V,0,-B*V,B*.55-R*V*.7,.5,R*.55+B*V*.7,B*.55+R*V*.7,.5,R*.55-B*V*.7,B*1.05,.42,R*1.05),u.push(0,0,.5,.5,1),h.push(k,k+1,k+2,k+1,k+3,k+2,k+2,k+3,k+4)}const c=Math.round(1300*Z*ie),w=new Float32Array(c*4),p=new Float32Array(c*4);let m=0;const g=new l.Color(X[6]).multiplyScalar(.9),y=new l.Color("#B9BE9A"),x=new l.Color("#9DA86A"),b=new l.Color;for(let P=0;P<c*3&&m<c;P++){P%250===249&&await v.yield();const E=t[Math.floor(Math.pow(e(),1.6)*t.length)],B=e()*6.283,R=e();let k,V,Q,ce=1;if(R<.6){const Te=Math.floor(e()*4),be=.17+.2*Te+.03*Math.sin(E.seed*3+Te*1.9)+.025*Math.sin(B*2+Te*2.1+E.seed),rt=.5+.5*Math.sin(B*2+E.seed)*Math.cos(B*3-E.seed*1.7);k=be-.004;for(let it=0;it<3;it++)k=be-.004-.17*rt*A(.45,.95,k);V=D(nt(E,B,k+.02),nt(E,B,k-.03),e.range(.35,.95)),Q=e.range(.8,1.7),b.copy(g).multiplyScalar(e.range(.7,1.2))}else R<.78?(k=e.range(.9,.97),V=nt(E,B,k)*e.range(.3,.95),Q=e.range(1.4,2.6),b.copy(y).multiplyScalar(e.range(.8,1.1))):R<.9?(k=.105,V=nt(E,B,k)*.97,Q=e.range(1,1.8),ce=-1,b.copy(x).multiplyScalar(e.range(.7,1.1))):(k=.065,V=E.r*e.range(1,1.5),Q=e.range(.9,1.8),b.copy(g).multiplyScalar(e.range(.7,1.1)));const Ae=E.x+Math.sin(B)*V,We=E.z+Math.cos(B)*V,Oe=R>=.9?pe(Ae,We):E.gy-7+k*(E.h+7);R>=.9&&Rt(Ae,We)>.86||(w.set([Ae,Oe+(ce<0?.3:-.05),We,Q*ce],m*4),p.set([b.r,b.g,b.b,e()*6.283],m*4),m++)}const M=new l.InstancedBufferGeometry;M.setAttribute("position",new l.BufferAttribute(new Float32Array(d),3)),M.setAttribute("aW",new l.BufferAttribute(new Float32Array(u),1)),M.setIndex(h),M.setAttribute("aP",new l.InstancedBufferAttribute(w,4)),M.setAttribute("aC",new l.InstancedBufferAttribute(p,4)),M.instanceCount=m,M.boundingSphere=new l.Sphere(new l.Vector3(_.x-30,40,_.z-480),640),K.add(new l.Mesh(M,new l.ShaderMaterial({fog:!0,side:l.DoubleSide,uniforms:{...je(),...ve},vertexShader:`
          attribute float aW; attribute vec4 aP, aC; uniform float uTime; varying vec3 vC, vP; varying float vT;
          #include <fog_pars_vertex>
          void main(){
            float s = abs(aP.w), fl = sign(aP.w), cr = cos(aC.w), sr = sin(aC.w);
            vec3 p = position * s; p.y *= fl * (fl < 0.0 ? 1.8 : 1.0); if (fl < 0.0) p.xz *= 0.45;
            p.xz = vec2(p.x * cr + p.z * sr, -p.x * sr + p.z * cr);
            float wv = sin(uTime * 1.9 + aP.x * 0.7 + aP.z * 0.5 + aC.w) + 0.5 * sin(uTime * 3.7 + aC.w * 5.0);
            p.xz += vec2(0.11, 0.07) * wv * aW * s; p.y += 0.05 * wv * aW * aW * s;
            vP = aP.xyz + p; vC = aC.rgb; vT = aW;
            vec4 mvPosition = modelViewMatrix * vec4(vP, 1.0); gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          varying vec3 vC, vP; varying float vT;
          #include <fog_pars_fragment>
          ${Ge}
          void main(){
            float hgt = vP.y - (vP.z < 0.0 ? 0.012 * max(-150.0 - vP.z, 0.0) : 4.0);
            vec3 col = vC * (0.55 + 0.6 * vT) * (uFill * 1.1 + uHorizon * 0.45 + uKey * 1.1 * sunReach(vP.xz, hgt));
            gl_FragColor = vec4(col, 1.0);
            #include <fog_fragment>
          }`})))}await v.yield();{const e=[],t=Math.max(6,Math.round(11*Z));for(let h=0;h<t;h++){const c=h/(t-1);e.push({y0:D(-152,-86,c*c*.5+c*.5),slope:0,x:[-2600,2600],z:[-150,150],a:D(.5,.26,c),th:D(.24,.6,c*c),sc:D(1,1.7,c)})}if(le)for(let h=0;h<4;h++)e.push({y0:2+h*2.6,slope:.012,x:[-1500,1500],z:[-2400,-150],a:.4-.06*h,th:.5+.035*h,sc:.75,gully:1});const a=[],o=[],s=[],i=[],r=t-1;e.forEach((h,c)=>{const w=a.length/3;for(const[p,m]of[[h.x[0],h.z[0]],[h.x[1],h.z[0]],[h.x[0],h.z[1]],[h.x[1],h.z[1]]])a.push(p,h.y0+h.slope*Math.max(-150-m,0),m),o.push(h.a,c*.37,h.sc,h.gully?1:0),s.push(h.th,h.y0,c===r?1:0);i.push(w,w+2,w+1,w+1,w+2,w+3)});const f=new Array(a.length/3*2).fill(0);{const h=Math.max(2,Math.round(3*Z)),c=[];for(let p=0;p<h;p++){const m=-120-p*.5/.043,g=a.length/3,y=vt();for(const[x,b]of[[-2600,-170],[2600,-170],[-2600,170],[2600,170]])a.push(x,m,b),o.push(.5+.06*p,y,1,0),s.push(.52-.08*p,m,0),f.push(1,p/(h-1));c.push({y0:m,t:[g,g+2,g+1,g+1,g+2,g+3]})}const w=e.map((p,m)=>({y0:p.gully?1e9:p.y0,t:i.slice(m*6,m*6+6)})).concat(c).map((p,m)=>({y0:p.y0,t:p.t,i:m})).sort((p,m)=>p.y0-m.y0||p.i-m.i);i.length=0;for(const p of w)i.push(...p.t)}const n=new l.BufferGeometry;n.setAttribute("position",new l.Float32BufferAttribute(a,3)),n.setAttribute("aQ",new l.Float32BufferAttribute(o,4)),n.setAttribute("aQ2",new l.Float32BufferAttribute(s,3)),n.setIndex(i),n.setAttribute("aK",new l.Float32BufferAttribute(f,2)),n.boundingSphere=new l.Sphere(new l.Vector3(0,0,0),6e3);const d=ne.y/Math.hypot(ne.x,ne.z),u=new l.Mesh(n,new l.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:l.DoubleSide,uniforms:{...je(),...ve,uMistSun:{value:150-40/Math.max(d,.05)}},vertexShader:`
          attribute vec4 aQ; attribute vec3 aQ2; varying vec3 vP; varying vec4 vQ; varying vec3 vQ2;
          attribute vec2 aK; varying vec2 vK;
          #include <fog_pars_vertex>
          void main(){ vP = position; vQ = aQ; vQ2 = aQ2; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
            vK = aK;
          }`,fragmentShader:`
          varying vec3 vP; varying vec4 vQ; varying vec3 vQ2; uniform float uMistSun;
          varying vec2 vK;
          #include <fog_pars_fragment>
          ${Ge}
          void main(){
            vec2 q = vP.xz * vQ.z * vec2(1.0, mix(1.0, 0.45, vQ.w));
            float n = texture2D(uNoise, q / 410.0 + vec2(uTime * 0.008, vQ.y)).r * 0.62 + texture2D(uNoise, q / 131.0 + vec2(uTime * 0.017 + vQ.y, uTime * 0.004)).g * 0.38;
            float n2 = texture2D(uNoise, q / 47.0 + vec2(uTime * 0.03, vQ.y * 3.0)).r;
            float a = smoothstep(vQ2.x, vQ2.x + 0.34, n + 0.1 * (n2 - 0.5)) * vQ.x;
            // no sheet ever reaches a wall: each feathers out well before it (gully mist stops short of the lip)
            float dep = clamp(-vQ2.y / 205.0, 0.0, 1.0), wallZ = 136.0 - 30.0 * dep * sqrt(dep);
            a *= mix(1.0 - smoothstep(wallZ - 46.0, wallZ - 3.0, abs(vP.z)), (1.0 - smoothstep(-215.0, -158.0, vP.z)), vQ.w);
            float dc = length(cameraPosition - vP);
            a *= smoothstep(3.0, 22.0, abs(cameraPosition.y - vP.y)) * smoothstep(8.0, 60.0, dc);
            a *= mix(1.0, smoothstep(30.0, 85.0, distance(vP.xz, uSad.xy)), vQ.w);        // gully mist thins out round the col instead of cutting a line across it
            // light: the sun reaches the near side; the far wall's shadow and the net's shadow are blue
            float under = (1.0 - vQ.w) * exp(-dot(vP.xz, vP.xz) / 22000.0);
            float lit = mix((1.0 - smoothstep(uMistSun - 45.0, uMistSun + 45.0, vP.z)) * (1.0 - 0.55 * under), 1.0, vQ.w) * cloudSun(vP.xz);
            vec3 shade = uFill * (0.62 + 0.3 * n) + uHorizon * 0.2, sun = uHorizon * 0.62 + vec3(0.2, 0.2, 0.21) + uKey * (0.1 + 0.16 * n2);
            vec3 col = mix(shade, sun, lit);
            col += uAmber * uKey * under * (0.05 + 0.1 * n2);             // the net stains the mist under it
            // under the net the mist is not empty: the strands' shadows lie across it as soft blue bands, and where a drip
            // lands a pale ring opens slowly and fades (one to a 64 m cell, each on its own clock)
            float top = (1.0 - vQ.w) * vQ2.z * (1.0 - smoothstep(170.0, 260.0, abs(vP.x)));
            float band = smoothstep(0.55, 0.95, sin(vP.x * 0.047 + 1.4 * sin(vP.x * 0.012 + 1.0) + vP.z * 0.016));
            float band2 = smoothstep(0.7, 0.98, sin(vP.x * 0.031 - vP.z * 0.052 + 1.1 * sin(vP.z * 0.017) + 2.0));
            col = mix(col, shade * 0.74, max(band, band2 * 0.8) * 0.5 * top * (0.4 + 0.6 * lit));
            vec2 rq = vec2(0.8 * vP.x - 0.6 * vP.z, 0.6 * vP.x + 0.8 * vP.z);
            vec2 rc = floor(rq / 58.0), rf = rq - (rc + 0.5) * 58.0;
            float rh = fract(sin(dot(rc, vec2(127.1, 311.7))) * 43758.5453), rh2 = fract(rh * 57.31);
            float ph = fract(uTime * (0.07 + 0.05 * rh2) + rh), rr = length(rf - (vec2(rh, fract(rh * 113.7)) - 0.5) * 18.0), rad = 2.0 + 17.0 * ph;
            float ring = exp(-(rr - rad) * (rr - rad) / (1.6 + 5.0 * ph)) * (1.0 - ph) * (1.0 - ph) * step(0.3, rh2) + 0.6 * exp(-rr * rr / 6.0) * (1.0 - smoothstep(0.0, 0.25, ph)) * step(0.3, rh2);
            col += (uHorizon * 0.8 + uAmber * uKey * 0.4) * ring * top;
            // and the sun that came through the glass lies on the mist as a pool of gold light, crawling with bright threads
            vec2 pc = vP.xz + uSun.xz * 40.0;
            float pool = exp(-(pc.x * pc.x / 22000.0 + pc.y * pc.y / 9000.0)) * top;
            float c1 = sin(pc.x * 0.19 + 1.3 * sin(pc.y * 0.12 + uTime * 0.21)) * sin(pc.y * 0.17 + 1.1 * sin(pc.x * 0.1 - uTime * 0.17));
            float c2 = sin(pc.x * 0.083 - pc.y * 0.11 + 1.7 * sin(pc.x * 0.05 + uTime * 0.13));
            float thr = (1.0 - smoothstep(0.02, 0.24, abs(c1))) * (0.55 + 0.45 * c2);
            col = mix(col, col * vec3(1.1, 0.84, 0.46) * (0.9 + 0.5 * thr) + uAmber * uKey * (0.08 + 0.6 * thr), pool * (0.5 + 0.5 * thr) * (0.5 + 0.5 * lit));
            a = max(a, (0.42 + 0.5 * thr) * pool * (1.0 - smoothstep(wallZ - 46.0, wallZ - 3.0, abs(vP.z))) * smoothstep(8.0, 60.0, dc));
            a = max(a, ring * top * 0.85 * (1.0 - smoothstep(wallZ - 46.0, wallZ - 3.0, abs(vP.z))) * smoothstep(8.0, 60.0, dc));
            // K8: the new banks (vK.x = 1 on their vertices, 0 on every sheet of live's): live's cool white and shade blue
            // as computed above, WITHOUT the amber of the net (the stain term is left out for them: no new amber light in
            // the gorge), and a strength of their own from the bank field, which takes none of the fades above: not the
            // feather before the walls (they reach the stone) and nothing of the camera's place.
            // A bank's edge is billowed by live's own two noises of this sheet (n, n2, on the sheet's drawn phase), so the
            // sheets of one bank differ and slide past each other; the lowest sheet keeps a quarter of its strength in
            // the hollows; the sun reaches a bank's top and a fifth of it reaches the lowest sheet.
            { float aK = vQ.x * mix(smoothstep(vQ2.x, vQ2.x + 0.1, gorgeBank(vP.xz) + 0.3 * (n - 0.5) + 0.1 * (n2 - 0.5)), 1.0, 0.25 * smoothstep(0.5, 1.0, vK.y));
              col = mix(col, mix(shade, sun, lit * (1.0 - 0.8 * vK.y)), vK.x);
              a = mix(a, aK, vK.x); }
            gl_FragColor = vec4(col, a);
            #include <fog_fragment>
          }`}));u.renderOrder=3,K.add(u)}await v.yield();const xe=new l.Vector3,Mt=new l.Vector3;{const e=S.pointAt(.85),t=S.tangentAt(.85),a=N.strandSamples||[];let o=1e9;xe.set(e.x+t.x*75+t.z*6,e.y+20,e.z+t.z*75-t.x*6);for(let h=0;h<a.length;h++){const c=a[h].p,w=c.x-e.x,p=c.z-e.z,m=w*t.x+p*t.z,g=w*t.z-p*t.x,y=c.y-a[h].r-e.y;if(m<52||m>105||Math.abs(g)>24||y<8||y>36||S.nearestXZ(c.x,c.z).dist<17||Math.hypot(c.x-N.knot.x,c.z-N.knot.z)<42||c.distanceTo(fe)<28)continue;let x=!0;for(const M of N.reservoirs)if(Math.hypot(c.x-M.x,c.z-M.z)<11){x=!1;break}for(let M=0;M<a.length&&x;M++){const P=a[M].p;P.y<c.y-4&&Math.hypot(P.x-c.x,P.z-c.z)<6+a[M].r&&(x=!1)}const b=Math.abs(g-4)+.3*Math.abs(m-78)+.5*Math.abs(y-22);x&&b<o&&(o=b,xe.set(c.x,c.y-a[h].r,c.z)),h%60===59&&await v.yield()}const s=[];for(let h=0;h<=18;h++){const c=h/18;s.push(new l.Vector2(Math.max(4.1*Math.pow(Math.sin(Math.PI*Math.pow(c,1.7)),.8),.001)+.28*(1-c),-20*c))}const i=new l.LatheGeometry(s,22),r=new l.CylinderGeometry(1,1,1,8,1,!0);r.translate(0,.5,0);const f={...je(),...ue},n=h=>new l.ShaderMaterial({fog:!0,uniforms:f,vertexShader:`
          varying vec3 vN, vP, vO;
          #include <fog_pars_vertex>
          void main(){ vO = position; vN = normalize(mat3(modelMatrix) * normal); vec4 wp = modelMatrix * vec4(position, 1.0); vP = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
            vFogDepth *= 0.55;
          }`,fragmentShader:`
          varying vec3 vN, vP, vO; uniform vec3 uGrain; uniform float uTime;
          #include <fog_pars_fragment>
          ${se.veinKit.glsl}
          void main(){
            vec3 N = normalize(vN), V = normalize(cameraPosition - vP);
            float ndv, back; gP = vP; gGl = 1.0;
            vec3 col = honey(N, V, ${h?"0.5":"4.0"}, ndv, back);
            ${h?"":`
            float zz = abs(vO.z) < 1e-4 ? 1e-4 : vO.z, ang = atan(vO.x, zz) / 6.2832, turn = uTime * 2.2, cell = 1.0;
            float fw = (fwidth(vO.y) + fwidth(vO.x)) / cell, keep = 1.0 - smoothstep(0.3, 0.8, fw);
            float g1 = grainLayer(vec2(vO.y / cell + 3.1 + turn * 0.01, (ang + turn * 0.0045) * 26.0), 26.0, 0.8, 0.8);
            float g2 = grainLayer(vec2(vO.y / (cell * 1.6) + 7.0, (ang - turn * 0.003 + 0.37) * 17.0), 17.0, 0.8, 0.9);
            float g3 = grainLayer(vec2(vO.y / cell * 2.0 + 13.0 - turn * 0.016, (ang + turn * 0.007 + 0.61) * 52.0), 52.0, 0.5, 0.7) * (1.0 - smoothstep(0.12, 0.3, fw));
            g1 = mix(0.06, g1, keep); g2 = mix(0.06, g2, keep);
            vec3 gcol = uGrain * (0.3 + 0.5 * back);
            col = mix(col, gcol + col * 0.4, g2 * 0.3);
            col = mix(col, gcol * 0.8 + col * 0.25, g1 * 0.5);
            float band = 0.5 + 0.5 * sin(ang * 37.7 + vO.y / cell * 0.8 + turn * 0.012);
            col += (col * 0.7 + uSunCol * vec3(0.4, 0.26, 0.06)) * g3 * band * band * band * smoothstep(0.15, 0.5, ndv) * (0.4 + 0.5 * back * back);
            { float xe = 1.0 - ndv, aw = smoothstep(0.15, 0.85, -dot(N, uSun)); col += (col * 0.9 + uLemon * 0.3) * aw * xe * xe * (1.0 - xe * xe * xe); }`}
            col = skin(col, N, V, ndv, 1.0);
            gl_FragColor = vec4(col, 1.0);
            #include <fog_fragment>
          }`}),d=new l.Mesh(i,n(!1)),u=new l.Mesh(r,n(!0));d.visible=u.visible=J,d.frustumCulled=u.frustumCulled=!1,K.add(d,u),Mt.copy(xe).y-=12,J&&(ue.uRareP.value.copy(xe),zt.push((h,c,w,p)=>{const m=Math.max(p-.822,0)*de,g=Math.min(3*m*m,260),y=A(1.9,2.3,m),x=1+.07*Math.sin(c*.9)+.3*A(.7,.822,p),b=1+.16*A(0,1,m)-.12*y;d.position.set(xe.x+Math.sin(c*.45)*(m>0?.2:.8),xe.y-1.5-g,xe.z),d.scale.set(x/Math.sqrt(b),b,x/Math.sqrt(b)),Mt.set(xe.x,xe.y-12-g,xe.z);const M=Math.max((1.8+g)*(1-y),.01),P=D(.7,.14,A(0,30,g))*(1-y);u.position.set(d.position.x,xe.y-M+.3,xe.z),u.scale.set(Math.max(P,.001),M,Math.max(P,.001)),ue.uRareA.value=m>0?6*Math.exp(-.45*m)*Math.sin(Math.min(m,.6)/.6*Math.PI/2)*Math.cos(2*Math.max(m-.6,0)):-1.5*A(.7,.822,p)}))}await v.yield();{const e=new l.ShaderMaterial({transparent:!0,depthWrite:!1,blending:l.AdditiveBlending,side:l.DoubleSide,uniforms:{uSeat:{value:fe.clone()}},vertexShader:`
          varying vec2 vQ; varying float vFar, vWheel; uniform vec3 uSeat;
          void main(){ vQ = position.xy * 2.0; vec4 wp = modelMatrix * vec4(position, 1.0); float dS = distance(cameraPosition, uSeat); vFar = smoothstep(80.0, 190.0, dS); vWheel = smoothstep(120.0, 205.0, dS); gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`
          varying vec2 vQ; varying float vFar, vWheel;
          void main(){
            float dw = length(vQ), d = dw * 1.615, g = 1.0 - smoothstep(0.0, 1.0, d);
            float ring = exp(-(d - 0.27) * (d - 0.27) * 150.0);
            // from far off it is a pale wheel: a soft disc out to 21 m with a brighter rim and a dozen faint spokes, so the
            // way out reads at a tenth of the frame from the lip; it draws in to the ring as the camera comes
            float rw = 0.2 + 0.3 * vWheel, disc = 1.0 - smoothstep(rw - 0.12, rw, dw), rim = exp(-(dw - rw) * (dw - rw) * 900.0);
            float sp = 0.5 + 0.5 * cos(atan(vQ.y, vQ.x + 0.00001) * 12.0); sp *= sp; sp *= sp;
            float wheel = disc * (0.2 + 0.16 * sp * smoothstep(0.14, 0.3, dw)) + 0.42 * rim + 0.12 * exp(-(dw - rw) * (dw - rw) * 60.0);
            gl_FragColor = vec4(vec3(0.8, 0.92, 1.0) * ((g * g * 0.7 + g * 0.2 + ring * 0.5) * vFar + wheel * vWheel), 1.0);
          }`}),t=new l.Mesh(new l.PlaneGeometry(1,1),e);t.position.copy(fe).addScaledVector(Pe,-.6),t.scale.setScalar(84),t.lookAt(fe.x-Pe.x*50,fe.y,fe.z-Pe.z*50),t.renderOrder=4,K.add(t);const a=new l.ShaderMaterial({transparent:!0,depthWrite:!1,depthTest:!1,blending:l.AdditiveBlending,side:l.DoubleSide,uniforms:e.uniforms,vertexShader:e.vertexShader,fragmentShader:`
          varying vec2 vQ; varying float vFar, vWheel;
          void main(){ float d2 = dot(vQ, vQ); gl_FragColor = vec4(vec3(0.8, 0.92, 1.0) * (vWheel * (0.2 * exp(-d2 * 4.5) + 0.16 * exp(-d2 * 30.0))), 1.0); }`}),o=new l.Mesh(t.geometry,a);o.position.copy(t.position),o.quaternion.copy(t.quaternion),o.scale.copy(t.scale),o.renderOrder=5,K.add(o)}await v.yield();const kt=e0({rng:z.fork("sky"),preset:"day",zenith:I.zenith,horizon:I.horizon,ground:at,fogColor:at,sunDirection:ne,sunColor:I.key,sunSize:1.1,sunIntensity:11,sunGlow:H===1?1:.75,scatterColor:I.band,scatter:H===1?.6:.36,scatterPow:4,scatterHigh:.1,clouds:{coverage:ae?.46:.3,softness:.22,scale:1.25,opacity:.9,wind:[.042,.011],lit:H===1?"#FFE3CF":"#F8F4EC",shade:"#8FA3C6"},clouds2:{coverage:.42,stretch:1,opacity:.5,scale:.8}});K.add(kt.object),await v.yield();const Zt=N.heroDrip?S.nearestXZ(N.heroDrip.x,N.heroDrip.z).u-50/S.length:.86,Vt=[1.13,1.08,1.5,.8,.7,1.2,.95],St=[.19,.33,.43,.55,.7,.82],Gt=e=>{let t=Vt[0];for(let a=0;a<St.length;a++)t=D(t,Vt[a+1],A(St[a]-.035,St[a]+.035,e));return D(t,.95,A(.88,.93,e))},Xt=new l.Vector3(T.x,qe(T.x,T.z)-ct(T.x,T.z)+21*(1+.08*F.n2(T.x*.07,T.z*.07)+.09*Math.sin(1.3*Math.sin(.7)))-9,T.z),Jt=he?new l.Vector3(he.x,pe(he.x,he.z)+18,he.z):new l.Vector3(Ue.x,24,Ue.z),st=oe*2;return await kt.prewarm(v.renderer,null,K),{scene:K,path:S,duration:de,pace:Gt,camera:{fov:62,near:.5,far:5e3,lookAhead:26,sway:.8,bank:.9},pois:[{at:new l.Vector3(20,25,-150),from:0,to:.14,weight:.45},{at:Xt,from:.09,to:.215,weight:.42,fade:.5},{at:qt,from:.185,to:.285,weight:.4},{at:new l.Vector3(_.x-25,-5,_.z-235),from:.272,to:.44,weight:.7},{at:Jt,from:.35,to:.58,weight:.5,fade:.5},{at:new l.Vector3(0,-28,0),from:.74,to:1,weight:.4,fade:.15},...J?[{at:()=>Mt,from:.78,to:.92,weight:.3,fade:.5}]:[]],portal:{shape:"circle",radius:7,color:"#DDF2FF",glow:1,revealDistance:600},post:{exposure:I.exposure,bloom:{strength:.3,radius:.6,threshold:.92},grade:{saturation:1.06,contrast:1.05,tint:"#ffffff",shadowTint:"#0a1020",vignette:.26,grain:.02}},ride:"none",update(e,t,a,o){ve.uTime.value=t,se.update(e,t,a),se.setProgress(.86+(o-Zt)),ve.uPulse.value=se.pulse(t);const s=Math.floor(t/st),i=(t-s*st)/oe*Math.PI,r=.5*oe/Math.PI,f=i<Math.PI*.5?Math.sin(i):i<Math.PI*1.5?1:2+Math.sin(i);ve.uCreep.value.set(Math.min((s*2+f)*r,45),(t-s*st)/st),ve.uCloud.value.set(t*16,t*5);const n=A(.195,.268,o);ve.uStarve.value=n,ue.uBranch.value.set(D(1,.1,n),D(1,2.6,n),5+(ot+10)*A(.34,.53,o),0),kt.update(e,t,a);for(const d of zt)d(e,t,a,o)},dispose(){for(const e of Ce)e.dispose()}}}};export{p0 as default};
