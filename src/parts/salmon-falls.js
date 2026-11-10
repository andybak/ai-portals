import*as d from"three";import{makeRng as Mt}from"../kit/core.js";const We=6,yt=-7,J=22,co=75,ht=88,Xt=["#C4262E","#8C8A3A","#2E5E4C","#E2B13C","#1E3A2D","#F1F5F2","#3A2A1F"],tt=(f,u,n)=>Math.min(n,Math.max(u,f)),re=(f,u,n)=>{const m=tt((n-f)/(u-f),0,1);return m*m*(3-2*m)},we=(f,u,n)=>f+(u-f)*n,Ee=`
uniform float uTime, uKeyT, uKeyOn;
uniform vec3 uSun, uSunCol, uSkyCol, uGndCol, uCam, uUnderC;
float h11(float n){ return fract(sin(n*127.1)*43758.5453); }
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x), mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x), f.y); }
float fbm(vec2 p){ return vn(p)*.5 + vn(p*2.03+7.1)*.3 + vn(p*4.1+13.7)*.2; }
vec3 hemi(vec3 n){ return mix(uGndCol, uSkyCol, n.y*.5+.5); }
vec3 safeN(vec3 v){ return v / max(length(v), 1e-5); }
// strike clock: seconds relative to the snap, looping. st = (period, offset, keyed)
float strikeTau(vec3 st){ float c = mix(uTime, uKeyT, st.z*uKeyOn); return mod(c + st.y, st.x) - 5.; }
`,R={np:[0,3.3,1.5],hp:[0,.4,-2],jh:[0,2.42,3.62],pitchL:.42,fwdL:.8,dropL:.3,bodyA:.15,bodyF:.4,mouth:[0,2.4,4.26]},qt=`
vec3 bearPose(vec3 p, float wH, float wJ, float wP, float tau, float ph){
  float t = uTime;
  float L = smoothstep(-.42,-.04,tau)*(1.-smoothstep(1.9,3.1,tau));
  float crouch = smoothstep(-1.6,-.5,tau)*(1.-smoothstep(-.42,-.1,tau));
  float open = smoothstep(-.5,-.22,tau)*(1.-smoothstep(-.07,0.,tau))*.8 + smoothstep(0.,.1,tau)*(1.-smoothstep(2.1,2.6,tau))*.22;
  float shake = smoothstep(.45,.7,tau)*(1.-smoothstep(1.5,1.9,tau));
  float idle = 1.-L;
  vec3 q = p;
  vec3 d = q - vec3(${R.jh.join(",")});
  float a = open*wJ, c = cos(a), s = sin(a);
  d.yz = vec2(d.y*c - d.z*s, d.y*s + d.z*c);
  q = d + vec3(${R.jh.join(",")});
  // neck and head: yaw (tracking the water), pitch (nose down), roll (the shake)
  d = q - vec3(${R.np.join(",")});
  a = (sin(t*.37+ph*6.)*.26 + sin(t*.91+ph*11.)*.12)*idle*wH; c = cos(a); s = sin(a);
  d.xz = vec2(d.x*c + d.z*s, -d.x*s + d.z*c);
  a = ((sin(t*.29+ph*3.)*.08 - crouch*.12)*idle + L*${R.pitchL})*wH; c = cos(a); s = sin(a);
  d.yz = vec2(d.y*c - d.z*s, d.y*s + d.z*c);
  a = sin(tau*27.)*.3*shake*wH; c = cos(a); s = sin(a);
  d.xy = vec2(d.x*c - d.y*s, d.x*s + d.y*c);
  q = d + vec3(${R.np.join(",")});
  q.z += L*${R.fwdL}*wH; q.y -= L*${R.dropL}*wH;
  // body: planted paws stay, everything else leans, breathes, shifts weight and lunges
  float free = 1.-wP;
  d = q - vec3(${R.hp.join(",")});
  a = (L*${R.bodyA} + (sin(t*.5+ph*9.)*.014 - crouch*.05)*idle)*free; c = cos(a); s = sin(a);
  d.yz = vec2(d.y*c - d.z*s, d.y*s + d.z*c);
  q = d + vec3(${R.hp.join(",")});
  q.x += (sin(t*.43+ph*5.)*.16 + sin(tau*27.)*.05*shake)*idle*free + sin(tau*27.)*.04*shake*free;
  q.z += (L*${R.bodyF} - crouch*.25)*free;
  q.y += sin(t*1.1+ph*4.)*.025*free;
  return q;
}
vec3 bearPlace(vec3 q, vec4 ip, vec2 sc){ // ip = xyz + yaw, sc = (scale, girth)
  q *= vec3(sc.x*sc.y, sc.x, sc.x);
  float c = cos(ip.w), s = sin(ip.w);
  return ip.xyz + vec3(q.x*c + q.z*s, q.y, -q.x*s + q.z*c);
}
`;function Yt(f){const u=(q,M)=>{const o=Math.cos(M),U=Math.sin(M);return[q[0],q[1]*o-q[2]*U,q[1]*U+q[2]*o]};let n=[R.mouth[0]-R.np[0],R.mouth[1]-R.np[1],R.mouth[2]-R.np[2]];n=u(n,R.pitchL);let m=[n[0]+R.np[0],n[1]+R.np[1]-R.dropL,n[2]+R.np[2]+R.fwdL];return n=u([m[0]-R.hp[0],m[1]-R.hp[1],m[2]-R.hp[2]],R.bodyA),m=[n[0]+R.hp[0],n[1]+R.hp[1],n[2]+R.hp[2]+R.bodyF],Rt(m,f)}function Rt(f,u){const n=f[0]*u.scale*u.girth,m=f[1]*u.scale,q=f[2]*u.scale,M=Math.cos(u.yaw),o=Math.sin(u.yaw);return new d.Vector3(u.x+n*M+q*o,u.y+m,u.z-n*o+q*M)}function It(){const f=[],u=[],n=[],m=[],q={P:f,C:u,A:n,I:m,v(M,o,U){return f.push(M[0],M[1],M[2]),u.push(o[0],o[1],o[2]),n.push(U[0],U[1],U[2],U[3]),f.length/3-1},tri(M,o,U){m.push(M,o,U)},loft(M,o,U,Y,Pe,Se,Ce=3){const I=[],Ae=M.length,D=p=>M[tt(p,0,Ae-1)],ge=(p,L,_,Q,v)=>.5*(2*L+(-p+_)*v+(2*p-5*L+4*_-Q)*v*v+(-p+3*L-3*_+Q)*v*v*v);for(let p=0;p<Ae-1;p++)for(let L=0;L<Pe;L++){const _=L/Pe,Q=D(p-1),v=D(p),N=D(p+1),de=D(p+2),te=P=>ge(P(Q),P(v),P(N),P(de),_);I.push({c:[0,1,2].map(P=>te(s=>s.c[P])),rx:Math.max(.01,te(P=>P.rx)),ry:Math.max(.01,te(P=>P.ry)),e:te(P=>P.e??2),k:[0,1,2,3].map(P=>tt(te(s=>s.k?s.k[P]:0),0,1))})}const j=M[Ae-1];I.push({c:j.c.slice(),rx:j.rx,ry:j.ry,e:j.e??2,k:(j.k||[0,0,0,0]).slice()});const ue=f.length/3,ie=I.length;for(let p=0;p<ie;p++)for(let L=0;L<Y;L++){const _=L/Y*Math.PI*2,Q=I[p];let v=Math.cos(_),N=Math.sin(_);const de=2/Q.e,te=Math.sign(v)*Math.pow(Math.abs(v),de)*Q.rx,P=Math.sign(N)*Math.pow(Math.abs(N),de)*Q.ry,s=[Q.c[0]+o[0]*te+U[0]*P,Q.c[1]+o[1]*te+U[1]*P,Q.c[2]+o[2]*te+U[2]*P];q.v(s,Se(s,N,v,p/(ie-1),Q.k),Q.k)}for(let p=0;p<ie-1;p++)for(let L=0;L<Y;L++){const _=ue+p*Y+L,Q=ue+p*Y+(L+1)%Y,v=ue+(p+1)*Y+(L+1)%Y,N=ue+(p+1)*Y+L;m.push(_,Q,v,_,v,N)}if(Ce&1){const p=I[0],L=q.v(p.c,Se(p.c,0,0,0,p.k),p.k);for(let _=0;_<Y;_++)m.push(L,ue+(_+1)%Y,ue+_)}if(Ce&2){const p=I[ie-1],L=q.v(p.c,Se(p.c,0,0,1,p.k),p.k),_=ue+(ie-1)*Y;for(let Q=0;Q<Y;Q++)m.push(L,_+Q,_+(Q+1)%Y)}},build(){const M=new d.BufferGeometry;return M.setAttribute("position",new d.Float32BufferAttribute(f,3)),M.setAttribute("color",new d.Float32BufferAttribute(u,3)),M.setAttribute("aAux",new d.Float32BufferAttribute(n,4)),M.setIndex(m),M.computeVertexNormals(),M}};return q}const Pt=f=>{const u=new d.Color(f);return[u.r,u.g,u.b]},be=(f,u)=>[f[0]*u,f[1]*u,f[2]*u],ke=(f,u,n)=>[we(f[0],u[0],n),we(f[1],u[1],n),we(f[2],u[2],n)];async function Qt(f,u,n){const m=It(),q=be(Pt(u[6]),1.05),M=[.1,.06,.03],o=be(q,.4),U=[.085,.055,.03],Y=[1,0,0],Pe=[0,1,0],Se=[0,0,1],Ce=(s,b)=>{const x=re(-.3,.9,b),T=Math.exp(-((s[2]-.9)**2)/2.4),E=re(2.3,.7,s[1]);let O=ke(be(q,.72),ke(q,M,.14+.4*T),x);return O=ke(O,U,re(3.8,4.12,s[2])*.6),O=ke(O,[.012,.011,.012],re(4.3,4.38,s[2])*re(2.56,2.72,s[1])),ke(O,o,E*.85)},I=s=>[s,0,0,0];m.loft([{c:[0,2.55,-2.85],rx:.3,ry:.35},{c:[0,2.72,-2.6],rx:.95,ry:1.02},{c:[0,2.82,-1.9],rx:1.26,ry:1.3,e:2.3},{c:[0,2.72,-.9],rx:1.4,ry:1.36,e:2.3},{c:[0,2.8,.1],rx:1.36,ry:1.38,e:2.3},{c:[0,3,.95],rx:1.24,ry:1.36},{c:[0,3.04,1.7],rx:1.1,ry:1.18,k:I(.12)},{c:[0,3,2.35],rx:1.02,ry:1.04,k:I(.45)},{c:[0,2.93,2.9],rx:.96,ry:.92,k:I(.8)},{c:[0,2.9,3.3],rx:.98,ry:.84,k:I(1),e:2.2},{c:[0,2.87,3.6],rx:.9,ry:.74,k:I(1),e:2.3},{c:[0,2.72,3.86],rx:.63,ry:.5,k:I(1),e:2.3},{c:[0,2.68,4.08],rx:.5,ry:.42,k:I(1),e:2.5},{c:[0,2.68,4.28],rx:.47,ry:.4,k:I(1),e:2.5},{c:[0,2.7,4.4],rx:.36,ry:.32,k:I(1)},{c:[0,2.7,4.45],rx:.12,ry:.1,k:I(1)}],Y,Pe,12,2,(s,b)=>Ce(s,b)),m.loft([{c:[0,2.3,3.55],rx:.46,ry:.2,k:[1,1,0,0]},{c:[0,2.25,3.95],rx:.44,ry:.2,k:[1,1,0,0]},{c:[0,2.25,4.2],rx:.38,ry:.17,k:[1,1,0,0]},{c:[0,2.29,4.36],rx:.2,ry:.09,k:[1,1,0,0]}],Y,Pe,8,2,(s,b)=>b>.3?[.02,.008,.008]:be(U,.8));const Ae=[];for(const s of[-1,1])Ae.push(m.P.length/3),m.loft([{c:[s*.64,3.4,3.2],rx:.25,ry:.13,k:I(1)},{c:[s*.74,3.62,3.17],rx:.26,ry:.115,k:I(1)},{c:[s*.79,3.78,3.15],rx:.21,ry:.09,k:I(1)},{c:[s*.81,3.85,3.14],rx:.11,ry:.05,k:I(1)}],Y,Se,7,2,(b,x)=>be(q,x>.2?.45:.85),2),Ae.push(m.P.length/3),m.loft([{c:[s*.4,3.11,3.79],rx:.02,ry:.02,k:I(1)},{c:[s*.42,3.11,3.85],rx:.075,ry:.07,k:I(1)},{c:[s*.41,3.1,3.92],rx:.02,ry:.02,k:I(1)}],Y,Pe,6,1,()=>[.006,.005,.004]);const D=(s,b)=>{const x=b?1.05:-1.95,T=O=>[0,0,O,0],E=b?[{c:[s*.72,2.9,x],rx:.62,ry:.78,k:T(0)},{c:[s*.8,2.1,x-.05],rx:.55,ry:.64,k:T(.2)},{c:[s*.83,1.35,x-.12],rx:.44,ry:.5,k:T(.55)},{c:[s*.84,.62,x+.02],rx:.38,ry:.42,k:T(.9)},{c:[s*.85,.2,x+.2],rx:.46,ry:.62,k:T(1)},{c:[s*.85,0,x+.24],rx:.42,ry:.6,k:T(1)}]:[{c:[s*.7,2.8,x],rx:.74,ry:.95,k:T(0)},{c:[s*.84,2,x+.18],rx:.62,ry:.78,k:T(.2)},{c:[s*.88,1.3,x+.22],rx:.46,ry:.54,k:T(.55)},{c:[s*.88,.62,x-.1],rx:.38,ry:.42,k:T(.9)},{c:[s*.88,.2,x+.12],rx:.46,ry:.64,k:T(1)},{c:[s*.88,0,x+.16],rx:.42,ry:.62,k:T(1)}];m.loft(E,Y,Se,8,2,(O,ye)=>Ce(O,.2),2)};await n.yield(),D(-1,!0),D(1,!0),D(-1,!1),D(1,!1),await n.yield();const ge=m.I.length/3,j=m.P,ue=m.A,ie=s=>[j[s*3],j[s*3+1],j[s*3+2]];let p=0,L=0;const _=[];for(;p<2300&&L++<4e4;){(L&1023)===1023&&await n.yield();const s=Math.floor(f()*ge),b=m.I[s*3],x=m.I[s*3+1],T=m.I[s*3+2],E=ie(b),O=ie(x),ye=ie(T),Z=[O[0]-E[0],O[1]-E[1],O[2]-E[2]],oe=[ye[0]-E[0],ye[1]-E[1],ye[2]-E[2]];let A=[Z[1]*oe[2]-Z[2]*oe[1],Z[2]*oe[0]-Z[0]*oe[2],Z[0]*oe[1]-Z[1]*oe[0]];const me=Math.hypot(A[0],A[1],A[2]);if(me<1e-5||f()>me/.2)continue;let le=f(),ce=f();le+ce>1&&(le=1-le,ce=1-ce);const $=[E[0]+Z[0]*le+oe[0]*ce,E[1]+Z[1]*le+oe[1]*ce,E[2]+Z[2]*le+oe[2]*ce];if($[2]>3.8||$[1]<.4||$[2]>3.6&&$[1]>2.95&&Math.abs($[0])>.22&&Math.abs($[0])<.62)continue;A=[A[0]/me,A[1]/me,A[2]/me],A[0]*$[0]+A[1]*($[1]-2.6)*.5<-.2&&(A=[-A[0],-A[1],-A[2]]);const Fe=[0,1,2,3].map(Ie=>ue[b*4+Ie]*(1-le-ce)+ue[x*4+Ie]*le+ue[T*4+Ie]*ce),qe=$[1]<2.3&&$[2]>-2.2&&$[2]<3?1.7:$[2]>2.9?.6:1,De=f.range(.09,.2)*qe,Re=f.range(.03,.065);let ee=[A[0]*.42,A[1]*.42-.62,A[2]*.42-.36];const Ye=Math.hypot(ee[0],ee[1],ee[2])||1;ee=[ee[0]/Ye,ee[1]/Ye,ee[2]/Ye];let xe=[A[1]*ee[2]-A[2]*ee[1],A[2]*ee[0]-A[0]*ee[2],A[0]*ee[1]-A[1]*ee[0]];const Qe=Math.hypot(xe[0],xe[1],xe[2]);Qe<.05?xe=[1,0,0]:xe=[xe[0]/Qe,xe[1]/Qe,xe[2]/Qe];const ot=Ce($,A[1]),ut=ke(ot,M,.3),$e=m.v([$[0]-xe[0]*Re-A[0]*.03,$[1]-xe[1]*Re-A[1]*.03,$[2]-xe[2]*Re-A[2]*.03],be(ot,.8),[Fe[0],Fe[1],Fe[2],0]);m.v([$[0]+xe[0]*Re-A[0]*.03,$[1]+xe[1]*Re-A[1]*.03,$[2]+xe[2]*Re-A[2]*.03],be(ot,.8),[Fe[0],Fe[1],Fe[2],0]),m.v([$[0]+ee[0]*De,$[1]+ee[1]*De,$[2]+ee[2]*De],ut,[Fe[0],Fe[1],Fe[2],1]),m.tri($e,$e+1,$e+2),_.push($e,A[0],A[1],A[2]),p++}const Q=s=>[s*.62,3.46,2.96],v=s=>{const b=j[s*3]<0?-1:1,x=b*.6,T=3.36,E=3.2;j[s*3]=x+(j[s*3]-x)*1.12-b*.035,j[s*3+1]=T+(j[s*3+1]-T)*1.1+.02,j[s*3+2]=E+(j[s*3+2]-E)*1.5-.2};for(let s=0;s<2;s++)for(let b=Ae[s*2];b<Ae[s*2+1];b++)v(b);for(let s=0;s<_.length;s+=4){const b=_[s];if(Math.abs(j[b*3])>.52&&j[b*3+1]>3.56&&j[b*3+2]>2.98&&j[b*3+2]<3.42)for(let x=0;x<3;x++)v(b+x)}const N=Mt(90211),de=(s,b,x,T,E,O,ye,Z)=>{let oe=b[1]*x[2]-b[2]*x[1],A=b[2]*x[0]-b[0]*x[2],me=b[0]*x[1]-b[1]*x[0];const le=Math.hypot(oe,A,me)||1;oe/=le,A/=le,me/=le;const ce=m.v([s[0]-oe*E,s[1]-A*E,s[2]-me*E],O,[Z[0],Z[1],Z[2],0]);m.v([s[0]+oe*E,s[1]+A*E,s[2]+me*E],O,[Z[0],Z[1],Z[2],0]),m.v([s[0]+x[0]*T,s[1]+x[1]*T,s[2]+x[2]*T],ye,[Z[0],Z[1],Z[2],1]),m.tri(ce,ce+1,ce+2),_.push(ce,b[0],b[1],b[2])};for(const s of[-1,1]){const b=Q(s);for(let x=0;x<46;x++){const T=-.5+(x+N())/46*4.1,E=Math.cos(T)*s,O=Math.sin(T),ye=N()<.5?-1:1,Z=[b[0]+E*.23+s*.1,b[1]+.2+O*.25,b[2]+ye*.07],oe=[E*.8,O*.8,ye*.6],A=Math.hypot(E,O*.9-.25,ye*.3-.3)||1,me=[E/A,(O*.9-.25)/A,(ye*.3-.3)/A],le=be(q,.7+.3*N());de(Z,oe,me,N.range(.07,.14),N.range(.03,.05),be(le,.8),ke(le,M,.3),[1,0,0])}}await n.yield();for(const s of[-1,1])for(let b=0;b<150;b++){const x=.5+2*Math.pow(N(),.8),T=N()*6.2832,E=re(.62,2.9,x),O=we(.38,.6,E),ye=we(.42,.74,E),Z=x>2.1?we(.2,0,(x-2.1)/.8):x>1.35?we(.55,.2,(x-1.35)/.75):we(.9,.55,tt((x-.62)/.73,0,1)),oe=Math.cos(T),A=Math.sin(T),me=[s*we(.84,.75,E)+oe*O*.97,x,1+A*ye*.97],le=[oe,.1,A],ce=N.range(.1,.24),$=Math.hypot(oe*ce,1,A*ce-.12),Fe=[oe*ce/$,-1/$,(A*ce-.12)/$],qe=Ce(me,.2),De=N.range(.26,.5)*we(.8,1.15,E);de(me,le,Fe,Math.min(De,x-.12),N.range(.045,.085),be(qe,.62),ke(be(qe,.9),M,.22),[0,0,Z])}for(const[s,b,x]of[[-.16,4.08,.95],[.12,4.2,.7],[.02,3.86,1.15]])m.loft([{c:[s,2.2,b],rx:.013,ry:.013,k:[1,1,0,0]},{c:[s+.02,2.2-x*.5,b+.03],rx:.012,ry:.012,k:[1,1,0,0]},{c:[s,2.2-x,b+.01],rx:.007,ry:.007,k:[1,1,0,0]}],Y,Se,4,2,()=>[.02,.2,.9],0);await n.yield();const te=m.build(),P=te.getAttribute("normal");await n.yield();for(let s=0;s<_.length;s+=4)for(let b=0;b<3;b++)P.setXYZ(_[s]+b,_[s+1],_[s+2],_[s+3]);return te}function Jt(f,u){let n=Pt(f[0]),m=[.062,.085,.032],q=be(n,.7),M=be(n,.8),o=[.105,.11,.08],U=[.055,.03,.028];return u==="july"&&(n=[.5,.4,.42],q=[.66,.66,.68],M=[.1,.2,.24],m=[.1,.19,.21],U=[.1,.13,.15],o=[.4,.42,.42]),u==="october"&&(n=ke(n,[.25,.14,.1],.5),q=be(n,.6),M=be(n,.7),m=[.06,.07,.035],o=[.2,.19,.16]),{red:n,olive:m,belly:q,back:M,jaw:o,fin:U}}function Dt(f,u,n=10,m=2,q={}){const M=It(),o=1.8,U=[1,0,0],Y=[0,1,0],Pe=!!q.male,Se=typeof q.male=="number"?q.male:1,Ce=Jt(f,u),{red:I,belly:Ae,back:D,fin:ge}=Ce,j=Pe?ke(Ce.olive,[.07,.15,.05],.75):Ce.olive,ue=Pe?ke(Ce.jaw,[.1,.15,.07],.5):Ce.jaw,ie=v=>tt((.25*o-v)/(.75*o),0,1),p=[[-.45,.05,-.05,.018],[-.37,.058,-.058,.034],[-.23,.105,-.1,.06],[-.06,.165,-.14,.085],[.09,.218,-.155,.096],[.21,.2,-.15,.092],[.3,.148,-.132,.086],[.38,.112,-.112,.074],[.45,.072,-.08,.05],[.495,.03,-.035,.026],[.515,-.012,-.05,.012]];if(Pe){for(const N of p)N[0]>-.2&&N[0]<.34&&(N[1]*=1+.3*Se*Math.exp(-((N[0]-.1)**2)/.018));const v=Se-1;p.splice(9,2,[.495,.042+.006*v,-.022,.03+.003*v],[.535+.014*v,.018+.006*v,-.02,.022+.003*v],[.565+.03*v,-.014-.004*v,-.036-.01*v,.014+.003*v],[.578+.036*v,-.046-.024*v,-.058-.03*v,.006+.002*v])}const L=(v,N)=>{const de=re(.27*o,.33*o,v[2]),te=re(-.36*o,-.44*o,v[2]);let P=ke(ke(I,Ae,re(-.2,-.9,N)),D,re(.55,1,N)*.8);return P=ke(P,ke(j,ue,re(-.1,-.8,N)*.7),de),ke(P,j,te*.8)};if(M.loft(p.map(v=>({c:[0,(v[1]+v[2])*.5*o,v[0]*o],rx:v[3]*o,ry:(v[1]-v[2])*.5*o,e:2.2,k:[ie(v[0]*o),0,0,0]})),U,Y,n,m,L),Pe){const v=1+.32*(Se-1),N=1+.4*(Se-1),de=.022*(Se-1);M.loft([{c:[0,-.1*o,.38*o],rx:.042*o,ry:.02*o},{c:[0,(-.096-de)*o,(.38+.07*v)*o],rx:.034*o*N,ry:.019*o*N},{c:[0,(-.088-de*1.4)*o,(.38+.13*v)*o],rx:.024*o*N,ry:.016*o*N},{c:[0,(-.064-de)*o,(.38+.17*v)*o],rx:.014*o*N,ry:.013*o*N},{c:[0,-.036*o,(.38+.182*v)*o],rx:.006*o,ry:.006*o}],U,Y,6,m,()=>ue);const te=[.42,.4,.33];for(let P=0;P<6;P++)for(const s of[-1,1]){const b=P/5,x=(.455+.085*b)*o,T=s*(.026-.016*b)*o,E=(-.078+.018*b*b)*o,O=(-.012-.03*b)*o;M.loft([{c:[T,E,x],rx:.0045*o,ry:.0045*o},{c:[T,E+.016*o,x+.003*o],rx:.0012*o,ry:.0012*o}],U,[0,0,1],3,1,()=>te,2),P<5&&M.loft([{c:[T,O,x+.012*o],rx:.004*o,ry:.004*o},{c:[T,O-.014*o,x+.014*o],rx:.0012*o,ry:.0012*o}],U,[0,0,1],3,1,()=>te,2)}}else M.loft([{c:[0,-.098*o,.385*o],rx:.04*o,ry:.018*o},{c:[0,-.085*o,.45*o],rx:.03*o,ry:.016*o},{c:[0,-.058*o,.5*o],rx:.016*o,ry:.014*o}],U,Y,m>1?6:4,m,()=>ue);const _=(v,N,de)=>{const te=M.v(v[0],N,[ie(v[0][2]),de,0,0]);for(let P=1;P<v.length;P++)M.v(v[P],P===v.length-1?be(N,.7):N,[ie(v[P][2]),1,0,0]);for(let P=1;P<v.length-1;P++)M.tri(te,te+P,te+P+1)},Q=ke(j,ge,.5);_([[0,0,-.42*o],[0,.055*o,-.45*o],[0,.175*o,-.6*o],[0,.03*o,-.54*o],[0,0,-.52*o]],Q,.3),_([[0,0,-.42*o],[0,0,-.52*o],[0,-.03*o,-.54*o],[0,-.175*o,-.6*o],[0,-.055*o,-.45*o]],Q,.3),_([[0,.2*o,.03*o],[0,.285*o,-.06*o],[0,.25*o,-.13*o],[0,.165*o,-.12*o]],ge,.2),_([[0,.09*o,-.28*o],[0,.125*o,-.33*o],[0,.085*o,-.33*o]],ge,.2),_([[0,-.1*o,-.2*o],[0,-.17*o,-.27*o],[0,-.08*o,-.33*o]],ge,.2);for(const v of[-1,1])_([[v*.03*o,-.14*o,0],[v*.08*o,-.2*o,-.07*o],[v*.04*o,-.15*o,-.09*o]],ge,.2),_([[v*.075*o,-.09*o,.29*o],[v*.15*o,-.17*o,.2*o],[v*.1*o,-.13*o,.15*o]],ge,.2);return M.build()}const Zt=`
vec3 keepHue(vec3 c, float knee, float cap){
  float mx = max(c.r, max(c.g, c.b));
  if (mx <= knee) return c;
  float r = max(cap - knee, 1e-3);
  return c*((knee + r*(1. - exp(-(mx - knee)/r)))/mx);
}
// The lit fish. Its colour is held by keepHue on the flatly lit skin (E = the light on a surface that faces the
// key), and the modelling comes from form (0..1 and over), applied after it, so that no light can flatten the fish
// into one poster red: lit back and flank, shaded belly.
vec3 salmonLit(vec3 alb, vec3 E, float form){ return keepHue(alb*E, .3, .62)*form; }
float salmonForm(vec3 n, vec3 L, float lo){ return mix(lo, 1., smoothstep(-.45, .7, dot(n, L)))*mix(.62, 1., smoothstep(-.75, .35, n.y)); }
// where a point of the body lies on the flank in profile: 0 at the belly line, 1 at the back line
float salmonRel(vec3 b){
  vec3 s = b/1.8;
  float dz = s.z - .12, wT = dz < 0. ? .3 : .23, dzb = s.z - .1;
  float top = .05 + .17*exp(-dz*dz/(wT*wT)), bot = -.05 - .105*exp(-dzb*dzb/.09);
  return clamp((s.y - bot)/max(top - bot, 1e-3), 0., 1.);
}
vec3 salmonSkin(vec3 base, vec3 b, float fin, float seed, out float gloss, out float cut){
  vec3 s = b/1.8;
  vec2 sc = vec2(s.z*64., s.y*72.);
  float near = 1. - smoothstep(.4, 1.25, fwidth(sc.x) + fwidth(sc.y));
  gloss = 0.; cut = 0.;
  vec3 col = base;
  if (fin > .05) {
    float rc = s.z < -.405 ? atan(s.y, max(-.385 - s.z, 1e-3))*13. : (s.z + abs(s.y)*.9 + abs(s.x)*.6)*85.;
    float ray = abs(fract(rc) - .5)*2.;
    float thr = .8 + .2*h11(floor(rc)*1.7 + 3. + floor(seed*8.)) - .12*smoothstep(.45, 1., ray);
    cut = step(mix(1.01, thr, near), fin);
    col = (base*1.7 + vec3(.012, .003, .002))*mix(.85, mix(1.35, .5, smoothstep(.15, .85, ray)), near);       // a smoky membrane between darker rays
  } else {
    float row = floor(sc.y);
    vec2 cf = fract(vec2(sc.x + .5*mod(row, 2.), sc.y)) - .5;
    float scl = 1. - smoothstep(.12, .5, length(cf*vec2(1., 1.15)));
    float head = smoothstep(.3, .335, s.z), tail = 1. - smoothstep(-.43, -.37, s.z);
    float bodyK = near*(1. - head)*(1. - tail);
    col *= 1. + bodyK*(scl*.42 - .19);
    gloss = scl*bodyK;
    // where on the flank this is, 0 at the belly line and 1 at the back line of the fish in profile
    float dz = s.z - .12, wT = dz < 0. ? .3 : .23, dzb = s.z - .1;
    float top = .05 + .17*exp(-dz*dz/(wT*wT)), bot = -.05 - .105*exp(-dzb*dzb/.09);
    float rel = clamp((s.y - bot)/max(top - bot, 1e-3), 0., 1.);
    float back = smoothstep(.55, .8, rel)*(1. - .55*head);
    col = mix(col, col*.13 + vec3(.016, .018, .01), back*.92);            // the dark maroon-olive back
    col *= mix(1., .8, (1. - smoothstep(.05, .32, rel))*(1. - head));      // and a duller belly
    float spk = smoothstep(.6, .72, vn(vec2(s.z*80. + seed*31., s.y*95. + abs(s.x)*40.)))*smoothstep(.5, .7, rel)*(1. - head);
    col *= 1. - .5*spk*near;
    float gd = length(vec2(s.z - .392, s.y*.9 + .01));
    col *= 1. - .62*(1. - smoothstep(0., .009, abs(gd - .072)))*step(s.z, .36)*near;
    float de = length(vec2(s.z - .428, s.y - .022)), side = smoothstep(.006, .02, abs(s.x));
    col = mix(col, vec3(.3, .26, .1), (1. - smoothstep(.021, .026, de))*side*near);
    float pupil = (1. - smoothstep(.011, .015, de))*side*near;
    col = mix(col, vec3(.004), pupil);
    gloss = max(gloss, pupil*2.);
  }
  return col;
}
`,Tt=`
#ifdef USE_FOG
  #ifdef FOG_EXP2
    float fogK = 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  #else
    float fogK = smoothstep(fogNear, fogFar, vFogDepth);
  #endif
#else
  float fogK = 0.;
#endif
`;function Xe(f,u){return new d.ShaderMaterial({fog:!0,...u,uniforms:{...d.UniformsUtils.clone(d.UniformsLib.fog),...f,...u.uniforms||{}}})}function $t(f,u){return Xe(f,{vertexColors:!0,side:d.DoubleSide,uniforms:{uRear:{value:new d.Vector4(0,0,0,0)},uRear2:{value:new d.Vector4(0,0,0,0)},uSubK:{value:1},uSilK:{value:1},uTurn:u||{value:new d.Vector4(0,1,0,0)}},vertexShader:`
#include <fog_pars_vertex>
${Ee}${qt}
attribute vec4 aAux, iPos, iPar; attribute vec3 iStrike;
uniform vec4 uRear, uRear2;   // uRear = (rear-up angle, dx, dy, dz); uRear2 = (roll onto its left side, head carried lower, pawing 0..1, hind legs let go 0..1)
// the bears within uTurn.y metres of x = uTurn.x turn their heads away from it by uTurn.z radians and lift their noses by
// uTurn.w, a strike included (the fish in the jaws follows: salmonMaterial); only the keyed bear's strike is as it was
uniform vec4 uTurn;
varying vec3 vP, vN, vC, vL; varying float vTip, vFootY;
// a bear on its hind legs: the trunk turns up about the pelvis while the hind legs stay where they stand (the turn runs
// out down the leg to the planted paw) until they let go; the forelegs come up and forward off the chest and paw the
// air; the head is carried down against the turn so that it looks at what is in front of it. Then the whole animal
// can roll over onto its left side about its feet.
vec3 pose(vec3 p0, float tau){
  float hind = step(position.z, -.6)*smoothstep(0., .55, aAux.z), fore = step(-.6, position.z)*smoothstep(0., .6, aAux.z);
  float lift = uRear.x*(1. - .45*uRear2.w);
  vec3 d = p0 - vec3(${R.np.join(",")});
  float tdx = iPos.x - uTurn.x, tk = (1. - smoothstep(uTurn.y*.7, uTurn.y, abs(tdx)))*(1. - iStrike.z*smoothstep(-.42, -.04, tau)*(1. - smoothstep(1.9, 3.1, tau)));
  float a = (tdx < 0. ? -1. : 1.)*uTurn.z*tk*aAux.x, c = cos(a), s = sin(a);
  d.xz = vec2(d.x*c + d.z*s, -d.x*s + d.z*c);
  a = (uRear2.y + lift*.4 - uTurn.w*tk)*aAux.x; c = cos(a); s = sin(a);
  d.yz = vec2(d.y*c - d.z*s, d.y*s + d.z*c);
  vec3 q = bearPose(d + vec3(${R.np.join(",")}), aAux.x, aAux.y, aAux.z*(1. - min(uRear.x*1.4, 1.)*step(-.6, position.z)), tau, iPar.z);
  // forelegs: off the ground, reaching, one paw after the other
  d = q - vec3(0., 2.75, 1.05);
  a = fore*(lift*.42 + uRear2.z*(.16 + .34*sin(uTime*5.3 + sign(position.x)*1.4 + iPar.z*9.))); c = cos(a); s = sin(a);
  d.yz = vec2(d.y*c + d.z*s, -d.y*s + d.z*c); q = d + vec3(0., 2.75, 1.05);
  // trunk about the pelvis
  d = q - vec3(0., 2.45, -2.0);
  a = uRear.x*mix(1. - hind, 1., uRear2.w); c = cos(a); s = sin(a);
  d.yz = vec2(d.y*c + d.z*s, -d.y*s + d.z*c); q = d + vec3(0., 2.45, -2.0);
  q.y -= .2*min(uRear.x, 1.)*(1. - hind);           // it settles onto its haunches a little
  // roll
  d = q - vec3(0., .5, 0.); c = cos(uRear2.x); s = sin(uRear2.x);
  d.xy = vec2(d.x*c - d.y*s, d.x*s + d.y*c);
  return bearPlace(d + vec3(0., .5, 0.), iPos, iPar.xy) + uRear.yzw;
}
void main(){
  float tau = strikeTau(iStrike);
  vec3 p0 = position + aAux.w*vec3(sin(uTime*3.1+position.z*5.+iPar.z*20.), 0., cos(uTime*2.3+position.x*6.))*.035;
  vec3 w = pose(p0, tau);
  vN = safeN(pose(p0 + normal*.06, tau) - w); vP = w; vL = position; vTip = aAux.w; vFootY = iPos.y + uRear.z;
  vC = color*(.75 + .5*iPar.w)*mix(vec3(1.), vec3(1.15,.95,.8), iPar.w);
  vec4 mvPosition = modelViewMatrix*vec4(w, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
#include <fog_pars_fragment>
${Ee}
uniform float uSubK, uSilK;
varying vec3 vP, vN, vC, vL; varying float vTip, vFootY;
void main(){
  vec3 V = safeN(uCam - vP), n = safeN(vN); if (dot(n, V) < 0.) n = -n;
  // fur in body space (it stays on the animal): clumps, and fine strands running down and back
  float fur = fbm(vec2(vL.x*8. + vL.z*5.5, vL.y*2.4 - vL.z*1.2));
  float fine = vn(vec2(vL.x*37. + vL.z*29., vL.y*8. - vL.z*4.5));
  float h = vP.y - vFootY, wet = (1. - smoothstep(.9, 2.9, h));
  vec3 alb = vC*(.48 + .6*fur + .42*fine)*mix(1., .7, wet);
  float ndl = dot(n, uSun), ao = .4 + .6*smoothstep(.3, 3.2, h);
  float fr = 1. - max(dot(n, V), 0.), back = max(dot(-V, uSun), 0.); back *= back;
  // against the light, or overhead against the sky, a bear is a dark shape: the direct light goes and the rim carries it
  float wl = vP.z < -.6 ? 6. : 0., sub = 1. - smoothstep(wl - .35, wl, vP.y);       // the part of it that stands in the river
  float sil = max(back, smoothstep(.1, .45, -V.y)*.9)*(1. - sub)*uSilK;
  vec3 col = alb*(uSunCol*max(ndl*.75 + .25, 0.)*max(ndl + .35, 0.)*.6*(1. - .82*sil) + (hemi(n)*mix(.42, .2, sil) + uSunCol*vec3(.05, .035, .02))*ao);
  float sp = pow(max(dot(n, safeN(uSun + V)), 0.), 36.)*(.1 + .45*wet)*fur*(1. - .7*sil);
  float lit = max(ndl*.6 + .4, 0.);
  float f6 = fr*fr*fr; f6 *= f6*fr*fr;
  // seen end-on, the whole round of the head grazes the eye and drew a pale ring where the face is: the head's skin takes
  // little rim; the wet fur of the neck and shoulders takes more, a lit fringe along the top of the dark shape
  float headK = smoothstep(2.7, 3.3, vL.z), neckK = smoothstep(-2.4, .4, vL.z)*(1. - headK)*smoothstep(2.3, 3.2, vL.y);
  float f4 = fr*fr; f4 *= f4;
  float rim = f6*(.05 + 1.*back + .4*sil*lit)*(1. - .8*headK) + vTip*mix(f6, fr*fr*fr, neckK*.8)*(.05 + .8*back + (.3 + 1.5*neckK)*sil*lit)*(.6 + .8*fine)*(1. - .5*headK);
  rim += f4*neckK*sil*lit*.45;                                   // and the wet skin under it, along the top of the back
  // the muzzle keeps its brown on the dark head (sky light off the wet fur), the nose pad and the lips stay black;
  // the forelegs are soaked: dark runnels down the fur and a cool sheen where the sky lies on it
  float muzK = smoothstep(3.7, 4.02, vL.z)*smoothstep(2.3, 2.52, vL.y)*(1. - smoothstep(4.27, 4.36, vL.z)*smoothstep(2.52, 2.66, vL.y));
  col += alb*(uSkyCol*2.2 + uSunCol*.2)*muzK*sil*(.55 + .45*smoothstep(-.5, .6, n.y));
  float foreK = smoothstep(.2, .5, vL.z)*(1. - smoothstep(1.9, 2.3, vL.z))*(1. - smoothstep(1.9, 2.7, vL.y))*(1. - sub);
  float run = vn(vec2(vL.x*43. + vL.z*37., vL.y*2.6));
  col *= 1. - foreK*.4*smoothstep(.35, .7, run);
  col += uSkyCol*foreK*fr*fr*(.05 + .22*smoothstep(.55, .8, run))*(1. - .5*sil);
  float net = vn(vP.xz*.9 + vec2(uTime*.5, -uTime*.35))*vn(vP.xz*1.7 - vec2(uTime*.4, uTime*.3));
  col += (alb*(uSunCol*(.7 + net*4.*max(n.y, 0.)) + uSkyCol*2.4)*(.3 + .7*smoothstep(-.7, .8, n.y)) + uUnderC*.12)*sub*uSubK;
  col = col*mix(vec3(1.), vec3(.5, .78, .66), sub*.75) + uSunCol*(sp + rim*vec3(1., .8, .55))*(1. - .93*sub);
  // seen from under water through the surface, what stands above it is a dark umber shape against the bright sky
  float lowEye = step(uCam.y, (uCam.z < -.6 ? 6. : 0.) - .05)*(1. - sub);
  col = mix(col, alb*vec3(1., .86, .7)*(dot(uSkyCol, vec3(.4)) + dot(uSunCol, vec3(.05)) + .08)*(.6 + .5*smoothstep(-.6, .8, n.y)), lowEye);
  // the water running off the chin (flagged by its vertex colour): bright broken strands that fall
  if (vC.b > vC.r*3. + .02) {
    if (vP.y < wl + .05 || vn(vec2(vL.x*31. + vL.z*17., vL.y*3.4 + uTime*3.8)) < .56 + .22*smoothstep(2.1, .6, vL.y)) discard;
    col = uSkyCol*.36 + uSunCol*(.05 + .3*back) + .015;
  }
    gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
  // far off under water the animal keeps its dark: a shape against the bright wall, not a green ghost
  gl_FragColor.rgb *= 1. - .36*step(uCam.y, -.05)*smoothstep(24., 42., distance(uCam, vP));
}`})}function eo(f,u){return Xe(f,{vertexColors:!0,side:d.DoubleSide,uniforms:{uTurn:u||{value:new d.Vector4(0,1,0,0)}},vertexShader:`
#include <fog_pars_vertex>
${Ee}${qt}
attribute vec4 aAux, iA, iB, iC, iD, iE;   // p0+T, v0+type, (period, offset, keyed, seed), bear xyz+yaw, (bear scale, girth, phase, fish size)
uniform vec4 uTurn;
varying vec3 vP, vN, vC, vB; varying float vFin, vSeed;
void main(){
  float T = iA.w, type = iB.w, seed = iC.w, tau = strikeTau(iC.xyz);
  vB = position; vSeed = seed;
  float s = type > 1.5 ? tau + T : mod(uTime + iC.y, iC.x);
  float tt = clamp(s, -.3, T + .5);
  vec3 pos = iA.xyz + iB.xyz*tt - vec3(0., ${(.5*J).toFixed(1)}*tt*tt, 0.);
  vec3 f = safeN(iB.xyz - vec3(0., ${J.toFixed(1)}*tt, 0.));
  float vis = smoothstep(-.3, -.12, s);
  float hold = 0.;
  if (type > 1.5) {
    hold = smoothstep(T - .04, T, s);
    // the jaws of a head that is turned aside (the bear material's uTurn, the same angles in the same order)
    float tdx = iD.x - uTurn.x, tk = (1. - smoothstep(uTurn.y*.7, uTurn.y, abs(tdx)))*(1. - iC.z);
    vec3 md = vec3(${R.mouth.join(",")}) - vec3(${R.np.join(",")});
    float ta = (tdx < 0. ? -1. : 1.)*uTurn.z*tk, tc = cos(ta), tsn = sin(ta);
    md.xz = vec2(md.x*tc + md.z*tsn, -md.x*tsn + md.z*tc);
    float headYaw = iD.w + ta;
    ta = -uTurn.w*tk; tc = cos(ta); tsn = sin(ta);
    md.yz = vec2(md.y*tc - md.z*tsn, md.y*tsn + md.z*tc);
    vec3 m = bearPlace(bearPose(md + vec3(${R.np.join(",")}), 1., 0., 0., tau, iE.z), iD, iE.xy);
    pos = mix(pos, m, hold);
    f = safeN(mix(f, vec3(cos(headYaw), .12, -sin(headYaw))*(seed > .5 ? 1. : -1.), hold));
    vis *= 1. - smoothstep(T + 2.2, T + 2.7, s);
  } else vis *= 1. - smoothstep(T + .2, T + .45, s);
  vec3 r = safeN(cross(vec3(.03, 1., .02), f)), u = cross(f, r);
  float roll = (seed - .5)*2.4 + (h11(seed*7.) - .5)*3.*s*(1. - hold) + hold*1.57;
  float c = cos(roll), sn = sin(roll);
  vec3 r2 = r*c + u*sn, u2 = u*c - r*sn;
  // thrash: a travelling wave from the dorsal fin back, a hard C-curve in the air and in the jaws
  float b = aAux.x, ph = s*(22. + 8.*seed) + seed*40.;
  vec3 lp = position*iE.w*vis;
  lp.x += (sin(ph - b*2.6)*.2*b*b + sin(ph*.5)*.07*(b - .35))*iE.w*vis;
  vec3 w = pos + r2*lp.x + u2*lp.y + f*lp.z;
  vec3 ln = normal; ln.x += cos(ph - b*2.6)*.3*b*step(.001, abs(normal.x));
  vN = safeN(r2*ln.x + u2*ln.y + f*ln.z); vP = w; vC = color*(.8 + .4*h11(seed*3.)); vFin = aAux.y;
  vec4 mvPosition = modelViewMatrix*vec4(w, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
#include <fog_pars_fragment>
${Ee}${Zt}
varying vec3 vP, vN, vC, vB; varying float vFin, vSeed;
void main(){
  float gloss, cut;
  vec3 alb = salmonSkin(vC, vB, vFin, vSeed, gloss, cut);
  float wl = vP.z < 0. ? ${We.toFixed(1)} : 0.;
  if ((uCam.y > wl && vP.y < wl - .06) || cut > .5) discard;
  vec3 V = safeN(uCam - vP), n = safeN(vN); if (dot(n, V) < 0.) n = -n;
  float fr = 1. - max(dot(n, V), 0.), back = max(dot(-V, uSun), 0.); back *= back;
  vec3 E = uSunCol*.3 + uSkyCol*.5 + uGndCol*.2;
  vec3 col = salmonLit(alb*(1. + vFin*(.7 + back*2.2)), E, salmonForm(n, uSun, .3));   // crimson that keeps its shading in full sun
  col += alb*uSunCol*fr*fr*(.04 + .2*back);                    // the wet edge lit through, in the fish's own colour
  float sp = pow(max(dot(n, safeN(uSun + V)), 0.), 160.) + .6*pow(max(dot(n, safeN(V + vec3(0., 1.3, 0.) + uSun*.6)), 0.), 260.);
  col += uSunCol*sp*(.3 + .5*gloss)*(1. - vFin) + uSkyCol*fr*fr*.09;           // one small wet glint, a cool sheen at the edge
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`})}function to(f){return Xe(f,{transparent:!0,depthWrite:!1,blending:d.NormalBlending,premultipliedAlpha:!0,side:d.DoubleSide,uniforms:{uVH:{value:450}},vertexShader:`
#include <fog_pars_vertex>
${Ee}
uniform float uVH;
attribute vec4 iP, iV, iT;
varying vec2 vQ; varying float vA; varying vec3 vP;
void main(){
  float c = mix(uTime, uKeyT, iT.z*uKeyOn);
  float s = mod(c + iT.y, iT.x) - iT.w, life = iP.w;
  float a = step(0., s)*step(s, life);
  vec3 pos = iP.xyz + iV.xyz*s - vec3(0., ${(.5*J).toFixed(1)}*s*s, 0.);
  vec3 vel = iV.xyz - vec3(0., ${J.toFixed(1)}*s, 0.);
  vec4 mvPosition = modelViewMatrix*vec4(pos, 1.);
  vec3 vv = (modelViewMatrix*vec4(vel, 0.)).xyz;
  float sp = length(vv.xy);
  vec2 dir = sp > 1e-3 ? vv.xy/sp : vec2(0., 1.);
  float size = iV.w*1.5*(1. - .5*s/max(life, .01));
  float px = 2.*max(-mvPosition.z, .1)/(projectionMatrix[1][1]*uVH);     // one pixel in metres at this depth
  float minS = px*.9, dim = clamp(size/minS, .12, 1.);
  size = max(size, minS)*a;
  float stretch = 1. + min(sp*.035, 1.8);
  mvPosition.xy += (dir*position.y*stretch + vec2(-dir.y, dir.x)*position.x)*size;
  vQ = position.xy; vA = a*dim*dim; vP = pos;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
#include <fog_pars_fragment>
${Ee}
varying vec2 vQ; varying float vA; varying vec3 vP;
void main(){
  float d = vQ.x*vQ.x*5. + vQ.y*vQ.y; if (d > 1.) discard;
  float k = 1. - smoothstep(0., 1., d);
  float back = max(dot(safeN(vP - uCam), uSun), 0.);
  vec3 col = uSunCol*(.42 + 1.3*back*back*back) + uSkyCol*.72;
  ${Tt}
  // (a bright core that thins to nothing at its edge, and takes a little of what is behind it away: no outline)
  gl_FragColor = vec4(col*k*k*vA*.8*(1. - fogK), clamp(k*vA*.5*(1. - fogK), 0., .6));
}`})}const xt=`
uniform vec3 uWhite, uPool, uAmber, uHorizon, uUnder; uniform float uSolid; uniform vec2 uEye;
// foam from below: aerated water glows with the light scattered down through it, darker where the raft is thick
vec4 foamUnder(float foam, float a, float b){
  float edge = smoothstep(.04, .3, foam)*(1. - smoothstep(.4, .95, foam));
  vec3 shade = mix(uUnder*1.1, uWhite*(uSunCol*.1 + uSkyCol*.22)*vec3(.72, 1., .88), a);
  vec3 leak = uWhite*(uSunCol*.24 + uSkyCol*.42)*vec3(.8, 1., .9);
  return vec4(mix(shade, leak, clamp(edge*1.2 + b*b*.35, 0., 1.)), clamp(foam*1.15, 0., .93));
}
vec3 whiteLight(vec3 n){ return uSunCol*(max(dot(n, uSun)*.5 + .5, 0.)*.37) + uSkyCol*.42 + .03; }
vec3 skyRefl(vec3 R){ return mix(uHorizon, uSkyCol*1.2, smoothstep(.1, .5, R.y)); }
`;function oo(f){return Xe(f,{vertexColors:!0,vertexShader:`
#include <fog_pars_vertex>
varying vec3 vP, vN, vC;
void main(){
  vP = position; vN = normal; vC = color;
  vec4 mvPosition = modelViewMatrix*vec4(position, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
#include <fog_pars_fragment>
${Ee}
uniform vec3 uMoss;
varying vec3 vP, vN, vC;
void main(){
  vec3 V = safeN(uCam - vP), n = safeN(vN);
  float face = 1. - smoothstep(.35, .8, abs(n.y));
  // columnar basalt: warped columns with dark joints and cross fractures
  float cx = vP.x*.62 + vn(vec2(vP.x*.3, vP.y*.2))*.9, id = floor(cx), fx = fract(cx);
  float joint = (1. - smoothstep(0., .09, min(fx, 1. - fx)));
  float jy = vP.y*.55 + h11(id)*5.;
  float cross_ = (1. - smoothstep(0., .06, abs(fract(jy) - .5)))*step(.35, h11(id + floor(jy)*7.3));
  float tone = h11(id*1.7 + floor(jy)*3.1);
  n = safeN(n + vec3((fx - .5)*.9, 0., 0.)*face);
  float grain = fbm(vP.xz*1.7 + vP.y*2.3), big = fbm(vP.xz*.21 + vP.y*.4);
  vec3 alb = vC*(.55 + .5*grain + .35*big)*mix(1., .7 + .6*tone, face);
  alb *= 1. - face*max(joint, cross_)*.75;
  float dry = smoothstep(6.4, 7.6, vP.y);
  float moss = dry*smoothstep(.45, .7, fbm(vP.xz*.5) + n.y*.25) + (1. - dry)*smoothstep(.62, .8, big)*smoothstep(.2, .7, n.y)*.6;
  alb = mix(alb, uMoss*(.6 + .8*grain), moss*.85);
  float wet = 1. - dry;
  alb *= mix(1., .72, wet);
  float wl = vP.z < -.6 ? 5.9 : -.05, under = 1. - smoothstep(wl - .25, wl, vP.y), up = smoothstep(.3, .75, n.y)*under;
  if (up > .01) {
    vec2 g = vP.xz*1.15 + vec2(vn(vP.xz*.7), vn(vP.xz*.7 + 9.))*.8, gi = floor(g), gf = fract(g);
    float dm = 9., id = 0.;
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
      vec2 o = vec2(float(i), float(j)), c = o + .5 + (vec2(h21(gi + o), h21(gi + o + 37.)) - .5)*.7 - gf;
      float dd = dot(c, c); if (dd < dm) { dm = dd; id = h21(gi + o + 71.); }
    }
    float stone = 1. - smoothstep(.1, .34, dm);
    vec3 cob = mix(vec3(.2, .19, .15), mix(vec3(.52, .49, .4), vec3(.36, .39, .2), smoothstep(.45, .8, grain + id*.3)), .35 + .65*stone)*(.7 + .5*id);
    alb = mix(alb, cob, up*.85)*mix(1., .5, up*smoothstep(-3., -6.5, vP.y));
    // the apron under the boil: darker, and mottled with silt, so that it is a bed for the boulders on it and not a pale slab
    // (less so towards its outer edge at z 14, where it meets the world's own bed)
    alb *= mix(1., mix(.8, .5, smoothstep(13.6, 8.5, vP.z))*(.7 + .6*big), up*step(.5, vP.z)*smoothstep(-3., -6.5, vP.y));
    // and, between the boulders, pebbles with a clean edge each (the eye is 3 to 6 m off: the cobble pattern above is
    // too broad and too soft for that distance and read as a blurred patch)
    float apK = up*step(.5, vP.z)*smoothstep(-3., -6.5, vP.y);
    if (apK > .01) {
      // (not one size: the current has sorted the bed in tongues that run out from the face, cobbles in one, gravel
      // in the next, pale rippled sand in the slack between; the world lays its loose stones by the same tongues)
      float tongue = .5 + .28*sin(vP.x*.52 + 1.2*sin(vP.z*.19 + 1.)) + .22*sin(vP.x*1.23 - vP.z*.11 + 2.4*sin(vP.x*.2));
      float cobK = smoothstep(.52, .6, tongue), sandK = 1. - smoothstep(.36, .44, tongue), nearK = 1. - smoothstep(9., 20., length(uCam - vP));
      float pebAll = 0., idAll = 0.;
      for (int s = 0; s < 2; s++) {
        float fq = s == 0 ? 4.4 : 1.8;
        vec2 g2 = vP.xz*fq + vec2(vn(vP.xz*1.9 + 3.), vn(vP.xz*1.9 + 11.))*.6 + 17.*float(s + 1), gj = floor(g2), gg = fract(g2);
        float d2 = 9., id2 = 0.;
        for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
          vec2 o = vec2(float(i), float(j)), c = o + .5 + (vec2(h21(gj + o), h21(gj + o + 37.)) - .5)*.8 - gg;
          float dd = dot(c, c); if (dd < d2) { d2 = dd; id2 = h21(gj + o + 71.); }
        }
        float pr = s == 0 ? .04 + .19*id2 : .09 + .17*id2, peb = (1. - smoothstep(pr*.6, pr, d2))*step(.2, id2);
        float wgt = s == 0 ? (1. - cobK)*(1. - sandK) : cobK;
        pebAll += peb*wgt; idAll += id2*wgt;
      }
      alb = mix(alb, alb*mix(.55, .78 + .55*idAll, pebAll)*mix(vec3(1.), vec3(1.04, 1., .9), idAll), apK*.9*nearK*(1. - sandK));
      float sand = (.86 + .28*vn(vP.xz*21.))*(.9 + .2*sin(vP.z*8. + vn(vP.xz*1.3)*7.));
      alb = mix(alb, vec3(.19, .19, .15)*sand, apK*sandK*.55*nearK);
    }
  }
  float ndl = max(dot(n, uSun), 0.);
  float ao = mix(.55, 1., smoothstep(-7., 5., vP.y))*(1. - face*joint*.5);
  float net = vn(vP.xz*.9 + vec2(uTime*.5, -uTime*.35))*vn(vP.xz*1.7 - vec2(uTime*.4, uTime*.3));
  vec3 col = alb*(uSunCol*ndl*(1. - .6*under) + hemi(n)*ao*(1. + .7*face*wet) + uSkyCol*.2*face*wet + uSunCol*net*2.6*up*max(uSun.y, .25));
  col *= mix(vec3(1.), vec3(.6, .84, .7), under*(1. - exp(-max(wl - vP.y, 0.)*.3)));
  float thread = smoothstep(.7, .88, vn(vec2(vP.x*5.5, vP.y*.55 + uTime*2.6)))*face*wet*(1. - under)*step(vP.y, 6.2)*step(0., vP.z);
  col = mix(col, uSkyCol*.9 + uSunCol*.12, thread*.5);
  vec3 R = reflect(-V, n);
  float fr = 1. - max(dot(n, V), 0.); fr *= fr; fr *= fr;
  col += wet*(1. - under)*(pow(max(dot(R, uSun), 0.), 30.)*uSunCol*.35*(.4 + grain) + uSkyCol*(.05 + .3*fr));
  gl_FragColor = vec4(col, 1.);
  // the apron under the boil takes the water's haze over a third of the distance (it is seen from 3 to 8 m, where the
  // full haze turned it into a pale slab); far off it still fades out entirely
  ${Tt}
  #ifdef USE_FOG
    float apron = up*step(.5, vP.z)*smoothstep(-3., -6.5, vP.y);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, mix(fogK, 1. - pow(max(1. - fogK, 0.), .35), apron));
  #endif
}`,uniforms:{uMoss:{value:new d.Color}}})}function ao(f,u){return Xe(f,{transparent:!0,depthWrite:!1,side:d.DoubleSide,uniforms:{...u,uBears:{value:[]}},vertexShader:`
#include <fog_pars_vertex>
uniform float uTime;
attribute float aFlow;
varying vec3 vP; varying float vFlow;
void main(){
  vec3 p = position; float far = (1. - smoothstep(-9., -2., p.z));
  p.y += (sin(p.x*.8 + p.z*.5 - uTime*1.7)*.03 + sin(p.x*.27 - p.z*.9 + uTime*1.1)*.04)*far;
  vP = p; vFlow = aFlow;
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
#include <fog_pars_fragment>
${Ee}${xt}
uniform vec4 uBears[12];
varying vec3 vP; varying float vFlow;
void main(){
  float lipK = smoothstep(-9., 0., vP.z);
  float s1 = fbm(vec2(vP.x*.45, vP.z*.07 - uTime*.3));
  float s2 = fbm(vec2(vP.x*1.5, vP.z*.2 - uTime*1.7));
  float s3 = vn(vec2(vP.x*4., vP.z*.5 - uTime*3.2));
  vec3 n = safeN(vec3((s1 - .5)*.22 + (s2 - .5)*.5*lipK, 1., (vn(vP.xz*.6 + uTime*.2) - .5)*.16 - lipK*lipK*.35));
  vec3 V = safeN(uCam - vP); if (V.y < 0.) n.y = -n.y;
  float F = .03 + .97*pow(1. - max(dot(n, V), 0.), 5.);
  vec3 R = reflect(-V, n);
  float shallow = (1. - smoothstep(.2, .75, vFlow))*lipK;
  vec3 body = mix(uPool*1.5, uAmber*.9, shallow*.6 + (s1 - .5)*.25)*(uSunCol*.3*max(uSun.y, 0.) + uSkyCol*.6 + .1);
  vec3 col = mix(body, skyRefl(R), F) + pow(max(dot(R, uSun), 0.), 220.)*uSunCol*2.2;
  // white: riffles over the teeth, the acceleration lines at the lip, wakes piled against the bears
  float foam = lipK*lipK*(1. - smoothstep(.12, .6, vFlow))*(.35 + .9*s2) + lipK*lipK*lipK*smoothstep(.55, .85, s2*.6 + s3*.5)*.7;
  for (int i = 0; i < 12; i++) {
    vec4 b = uBears[i]; vec2 d = vP.xz - b.xy; float r = max(b.z, .01);
    float pile = exp(-dot(d, d)/(r*r));
    float tail = exp(-d.x*d.x/(r*r*.8))*smoothstep(-r, r*.3, d.y)*exp(-max(d.y, 0.)/(r*2.2));
    foam += (pile*.9 + tail*(.45 + .9*s3))*b.w;
  }
  foam = clamp(foam, 0., 1.);
  vec3 fc = uWhite*whiteLight(vec3(0., 1., 0.))*(.72 + .3*s3);
  col = mix(col, fc, foam);
  gl_FragColor = vec4(col, mix(foam*.95, mix(.9, 1., max(F, foam)), uSolid));
  if (uEye.y > .75 && uSolid < .5) gl_FragColor = foamUnder(foam, s2, s3);
  else if (uCam.y < vP.y && uSolid < .5) gl_FragColor.a *= .2;                     // from the air under the lip the sheet's own green glass carries it       // only for an eye that is in the upper river: from the air under the lip it is white water
  #include <fog_fragment>
}`})}function no(f,u){return Xe(f,{transparent:!0,side:d.DoubleSide,uniforms:{...u},vertexShader:`
#include <fog_pars_vertex>
${Ee}
varying vec3 vP; varying float vBoil;
void main(){
  vec3 p = position; float near = exp(-max(p.z, 0.)/6.5);
  float b = fbm(vec2(p.x*.3, p.z*.35 - uTime*.9)) + .5*vn(vec2(p.x*.9 + uTime*.7, p.z*.8 - uTime*1.6));
  p.y += (b - .7)*1.0*near*smoothstep(-.6, 1.5, p.z) + sin(p.z*.5 - uTime*1.8 + p.x*.2)*.05*(1. - near);
  vBoil = b; vP = p;
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
#include <fog_pars_fragment>
${Ee}${xt}
varying vec3 vP; varying float vBoil;
void main(){
  float near = exp(-max(vP.z, 0.)/8.5);
  float n1 = fbm(vec2(vP.x*.22 + uTime*.05, vP.z*.3 - uTime*.9));
  float n2 = fbm(vec2(vP.x*.7, vP.z*.6 - uTime*1.5) + n1*1.5);
  float n3 = vn(vec2(vP.x*2.6 + n2*2., vP.z*2.2 - uTime*2.4));
  float boil = smoothstep(.22, .7, near*1.3 + (n2 - .5)*.9*near + (n1 - .5)*.3);
  float ln = fbm(vec2(vP.x*.33 + n1*1.3, vP.z*.045 - uTime*.13));
  float lines = smoothstep(.57, .7, ln)*(1. - smoothstep(18., 72., vP.z))*(.3 + .7*n3)*smoothstep(.25, .6, n2 + near);
  float foam = clamp(boil + lines*.85, 0., 1.);
  vec3 n = safeN(vec3((n2 - .5)*.5*(near + .25), 1., (n1 - .5)*.5*(near + .25)));
  vec3 V = safeN(uCam - vP); if (V.y < 0.) n.y = -n.y;
  float F = .03 + .97*pow(1. - max(dot(n, V), 0.), 5.);
  vec3 R = reflect(-V, n);
  vec3 body = mix(uPool*.75, uAmber*.5, (n1 - .5)*.3 + near*.3)*(uSunCol*.3*max(uSun.y, 0.) + uSkyCol*.6 + .08);
  body = mix(body, uWhite*.55*whiteLight(vec3(0., 1., 0.))*vec3(.75, 1., .92), near*.5 + lines*.2);   // aerated green-white
  vec3 col = mix(body, skyRefl(R), F*.8) + pow(max(dot(R, uSun), 0.), 160.)*uSunCol*1.6;
  vec3 fc = uWhite*whiteLight(n)*mix(vec3(.48, .66, .68), vec3(1.), smoothstep(.2, .7, n2)*.55 + n3*.25 + vn(vP.xz*6.5 + vec2(n1*3., -uTime*3.))*.2)*(.82 + .24*vBoil);
  col = mix(col, fc, foam);
  float edge = (1. - smoothstep(60., 72., vP.z))*(1. - smoothstep(84., 88., abs(vP.x)));
  gl_FragColor = vec4(col, mix(foam*.96, 1., uSolid)*mix(1., edge, 1. - uSolid));
  if (uEye.x > .75 && uSolid < .5) { gl_FragColor = foamUnder(foam, n2, n3); gl_FragColor.a *= edge; }
  else if (uSolid < .5) gl_FragColor.a *= smoothstep(.6, 2.8, length(uCam - vP));     // a crest of the boil right at the lens (the top of the miss) would stand across the frame as a pale pane   // an eye in the air below a crest of the boil sees foam, not the pool's ceiling
  #include <fog_fragment>
}`})}function so(f,u){return Xe(f,{transparent:!0,side:d.DoubleSide,uniforms:{...u},vertexShader:`
#include <fog_pars_vertex>
uniform float uTime;
attribute vec4 aS;
varying vec3 vP; varying vec4 vS; varying vec3 vN;
void main(){
  vec3 p = position;
  float w = aS.x*aS.x;
  p.z += (sin(p.x*1.9 + uTime*4.3 + aS.y*2.) + sin(p.x*.53 - uTime*2.1))*.07*w*(1. + aS.y);
  p.x += sin(p.x*3.1 + uTime*5.7 + aS.x*7.)*.04*w;
  vP = p; vS = aS; vN = normal;
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
#include <fog_pars_fragment>
${Ee}${xt}
varying vec3 vP; varying vec4 vS; varying vec3 vN;
// A STRAND OF FALLING WATER. xc = the place across the fall in strand widths, tc = the fall clock in strand lengths,
// sd = a seed, k = how much of it shows. Every strand (one to a width) has a clock of its own and surges of a pace
// of its own (.8 to 1.2 of its size's: lengths of .83 to 1.25), so no two begin or end side by side: there are no
// rows, and so no cells. A strand is a file of surges, each coming down head first: thick at its head (the lower
// end), drawn thin behind it.
// Returns (how much water: .5 the mean and, where k is 1, .21 the spread, as the grain it replaces; its slope across
// the strand).
vec2 strand(float xc, float tc, float sd, float k){
  float i = floor(xc), f = fract(xc), w = f*f*(3. - 2.*f);
  vec2 hh = vec2(h11(i*.731 + sd), h11((i + 1.)*.731 + sd)), ph = hh*23. + tc*(.8 + .4*fract(hh*7.3));
  vec2 j = floor(ph), g = fract(ph), e = smoothstep(.55, 1., g);
  float a = mix(h21(vec2(i, j.x) + sd)*(.75 + .5*g.x), h21(vec2(i, j.x + 1.) + sd)*.75, e.x);
  float b = mix(h21(vec2(i + 1., j.y) + sd)*(.75 + .5*g.y), h21(vec2(i + 1., j.y + 1.) + sd)*.75, e.y);
  return vec2(.5 + (mix(a, b, w) - .451)*k, (b - a)*6.*f*(1. - f)*k);     // (.451: the mean of a and b by the two lines above)
}
void main(){
  float d = vS.w, tf = sqrt(d + .04), lay = vS.y, flow = vS.z, x = vP.x;
  // THE FALL CLOCK. Water that leaves the lip has fallen d = g t t/2 after t seconds: t = sqrt(2 d/g) = .4515 tf, and it
  // then falls at sqrt(2 g d) = 4.43 tf m/s. So whatever falls with the water is a function of tf - 2.215 uTime
  // (2.215 = sqrt(g/2)), and a surge that takes T seconds to pass the lip is drawn out to 4.43 tf T metres: its length
  // in tf is T/.4515 wherever it is on the face. The four sizes of strand: ropes .77 m wide and strands .2 m wide,
  // whose surges take .75 s to pass (3.4 m long one metre down, 6.7 m at four: the whole face), fibres 6.7 cm wide
  // of .56 s (2.5 and 5 m), threads 2.6 cm wide of .45 s (2 and 4 m): 4 to 150 times as long as wide. (The strand
  // itself, the column the surges run in, stands from the lip to the foot.)
  // The sheets in front are thrown further and run a tenth faster each, so their strands slide past those behind.
  float fall = tf - uTime*2.215*(1. + .1*lay), fw = fwidth(x);
  // (no two strands are of one width, and they shift across the face, slowly: a tenth of a metre a second; falling
  // water runs straight down)
  float xs = x + (vn(vec2(x*.37 + lay*5., uTime*.11)) - .5)*.8 + (vn(vec2(x*2.3 + lay*3., uTime*.23)) - .5)*.2;
  // (the water leaves the lip whole and tears into fibres as it falls; and of the three finer sizes none is drawn
  // narrower than a pixel: what is too fine to draw, or not yet torn, hands its share of the grain to the strand next
  // in size (fibres fall with the strand they are torn from), by the root of the squares. The ropes, the largest
  // size, have no size to hand theirs to and are drawn at every size of a pixel, as the coarsest grain they replace
  // was. So the grain's spread, and with it how much of the face is white, is the same whatever the size of a pixel
  // on the face. .1156, .09, .0484 and .0196 are the squares of the four sizes' own shares, .34, .3, .22 and .14.)
  float torn = .3 + .7*smoothstep(.1, 2.4, d);
  float k2 = 1. - smoothstep(.4, 1., fw*5.), k3 = torn*(1. - smoothstep(.4, 1., fw*15.)), k4 = torn*(1. - smoothstep(.4, 1., fw*38.));
  float w3 = sqrt(.0484 + (1. - k4*k4)*.0196), w2 = sqrt(.09 + (1. - k3*k3)*w3*w3), w1 = sqrt(.1156 + (1. - k2*k2)*w2*w2);
  vec2 s1 = strand(xs*1.3 + lay*31., fall*.6, 3. + lay*7., 1.);
  vec2 s2 = strand(xs*5. + lay*17., fall*.6, 11. + lay*5., k2);
  vec2 s3 = strand(xs*15. + lay*7., fall*.8, 19. + lay*3., k3);
  vec2 s4 = strand(xs*38., fall, 29., k4);
  float f1 = s1.x, f2 = s2.x, f3 = s3.x, f4 = s4.x;
  float fib = .5 + (f1 - .5)*w1 + (f2 - .5)*w2 + (f3 - .5)*w3 + (f4 - .5)*.14;      // (with every size drawn: f1*.34 + f2*.3 + f3*.22 + f4*.14)
  // AT THE FOOT the strands end in the boil's broken white: what the pool throws back up the face, a metre high and
  // ragged: clots of the boil's own sizes (.7, 2.6 and 6.5 to the metre) that climb and burst, white on the pool's
  // own foam grey
  float foot = 1. - smoothstep(-.1, 1.1, vP.y + (f1 - .5)*1.4), slopeX = s1.y*.35 + s2.y*.6 + s3.y*.25 + s4.y*.15, broken = .5;
  if (foot > .002) {
    float b2 = fbm(vec2(x*.7 + lay*3., vP.y*.9 - uTime*1.5));
    broken = smoothstep(.3, .7, b2*.4 + vn(vec2(x*2.6 + b2*2., vP.y*2.2 - uTime*2.4))*.35 + vn(vec2(x*6.5 + lay*9., vP.y*6.5 - uTime*3.))*.25);
    fib = mix(fib, .35 + .5*broken, foot); slopeX *= 1. - foot;
  }
  float cover = lay < .5
    ? smoothstep(.0, .3, flow - .12 + .34*smoothstep(.2, 4.2, d) + (fib - .5)*(.55 + .8*smoothstep(.2, 4.2, d)) + (f1 - .5)*.6*smoothstep(.5, 5., d))
    : smoothstep(.5 + .05*lay, .66 + .05*lay, fib + (flow - .5)*.3)*smoothstep(.1, 1.2, d)*.75;
  float glass = (1. - smoothstep(.1, 1.5 + flow, d))*smoothstep(.3, .75, flow)*(1. - step(.5, lay));
  cover = max(cover, smoothstep(.25, .6, foot*(.6 + .8*broken)));
  vec3 V = safeN(uCam - vP), n = safeN(vN - vec3(slopeX, 0., 0.));
  if (dot(n, V) < 0.) n = -n;
  // THE BLUE-GREY IS A STRAND'S SHADE and follows it down: on the flank a strand turns from the sun, and deeper in
  // the thin water beside it (both run the strand's length; neither is a step over a grain). The white keeps the
  // sheet's own floor; a surge is whiter than it. At the foot the shade is the boil's hollows.
  float lee = smoothstep(.1, .6, slopeX*uSun.x), thinK = 1. - smoothstep(.3, .62, fib);
  vec3 shade = mix(vec3(.5, .66, .74), vec3(1.), 1. - max(lee*.2, thinK*.36));
  shade = mix(shade, mix(vec3(.48, .66, .68), vec3(1.), .4 + .6*broken)*(1. + .15*broken), foot);      // (the pool's own foam grey; a clot is the whitest water of the fall)
  vec3 white = uWhite*whiteLight(n)*shade*(.8 + .32*fib)*(1. + .36*smoothstep(.2, .9, f2));      // (a strand is whitest where a surge is thick in it)
  float fr = 1. - max(dot(n, V), 0.);
  vec3 green = mix(uPool*2.4, uAmber*1.3, .25)*(uSunCol*.4 + uSkyCol*.5) + skyRefl(reflect(-V, n))*(.08 + .5*fr*fr*fr);
  green += pow(max(dot(reflect(-V, n), uSun), 0.), 90.)*uSunCol*1.5;
  vec3 col = mix(white, green, glass*(1. - smoothstep(.5, .72, fib)));
  float back = max(dot(-V, uSun), 0.);
  col += uSunCol*uWhite*back*back*.18*fib;                          // the sheet glows a little when back-lit
  // seen from the air below it (the failed leap), the first metre of the sheet is looked at from underneath, through the
  // river's own thickness as it bends over the rock: green glass with the light in it, its upper edge thinning away
  // in fibres (never a pale pane with a straight edge across the bears' legs)
  float underK = step(dot(vN*(vN.y >= 0. ? 1. : -1.), V), 0.)*(1. - smoothstep(.6, 1.9, d))*(1. - step(.5, lay))*step(uCam.y, vP.y);
  float a = cover*smoothstep(0., mix(.04, .05 + .16*f2, underK), vS.x);
  a *= lay < .5 ? mix(.72 + .28*fib, 1., smoothstep(.8, 3.5, d)*flow) : 1.;
  // from close under the lip (the failed leap) the river bends over it as a tongue of green glass, drawn out into
  // white streaks and breaking into the sheet a metre and a half down
  float tongue = (1. - smoothstep(.45, 1.5 + .7*flow, d))*smoothstep(.12, .45, flow)*(1. - step(.5, lay))
    *(1. - smoothstep(10., 17., length(uCam - vP)))*smoothstep(5.6, 4.2, uCam.y);
  float streak = smoothstep(.5, .74, f2*.5 + f3*.3 + f4*.2)*(.35 + .65*smoothstep(.1, 1.2, d));
  col = mix(col, mix(green*.82, white*1.04, streak), tongue*.9);
  a = mix(a, max(a, .94), tongue*cover);
  col = mix(col, green*.9 + white*streak*.45, underK);
  a = mix(a, a*.96/max(.72 + .28*fib, .5), underK*.8);
  // the sheets run 0.7 m down into the pool: to an eye in the pool their feet hung under the sunk ceiling of the boil as
  // a ruler-straight pale line along the top of the bubble wall (they are drawn after it); the wall is the falls there
  // BETWEEN THE STRANDS THE WATER STILL FALLS, thin and clear: the pool's own dark green with the sky on it, in long
  // gaps that follow the strands down. It is what the fall lets through of the rock behind it: a fifth of the rock as
  // it is, and for the rest the rock as wet basalt stands behind falling water: dark, in its upright columns (the
  // rock's own columns: its width of 1.6 m, its joints, a tone to each column from foot to top, none to a block).
  // (Not where no water comes over the lip, and not from under the lip, where the edge thins away.)
  if (lay < .5) {
    float wet = smoothstep(.1, .3, flow)*smoothstep(.1, .8, d)*(1. - underK), F = .03 + .97*fr*fr*fr*fr*fr;
    float cx = x*.62 + vn(vec2(x*.3, vP.y*.2))*.9, cf = fract(cx), joint = 1. - smoothstep(0., .09, min(cf, 1. - cf));
    vec3 thin = uPool*.75*(uSunCol*.3*max(uSun.y, 0.) + uSkyCol*.6 + .08)*(.7 + .6*h11(floor(cx)*1.7))*(1. - .75*joint);
    thin = mix(thin, skyRefl(reflect(-V, n)), F*.8);
    // (it is water and whitens as it falls: half of it the sheet's own shaded white once it is torn, and threads of white run down in it)
    thin = mix(thin, white*vec3(.5, .66, .74), .5*torn);
    thin = mix(thin, white, smoothstep(.5, .8, f3*.5 + f4*.5)*.3*torn);
    float fa = (1. - a)*.8*wet;
    col = (col*a + thin*fa)/max(a + fa, 1e-4); a += fa;
  }
  if (uEye.x > .75 && vP.y < .3) discard;
  if (a < .012) discard;
  gl_FragColor = vec4(col, a);
  #include <fog_fragment>
}`})}function ro(f,u){return Xe(f,{transparent:!0,depthWrite:!1,side:d.DoubleSide,uniforms:{...u,uPlume:{value:1}},vertexShader:`
#include <fog_pars_vertex>
uniform float uTime; uniform vec3 uCam;
attribute vec4 iA, iB;        // (x, z0, phase, size), (rate, drift x, seed, top)
varying vec2 vQ; varying vec3 vP; varying vec3 vK;
void main(){
  float f = fract(uTime*iB.x + iA.z), g = 1. - (1. - f)*(1. - f);
  float tall = step(10., iB.w);
  vec3 c = vec3(iA.x + iB.y*f*8. + sin(uTime*.3 + iB.z*20.)*1.5*f, mix(.6 + g*iB.w, 6.6 + g*(iB.w - 6.), tall), mix(iA.y - g*(iA.y*.5 + iB.w*.42), -4.5 - iA.y*.7 - g*iB.w*.3, tall));
  float size = iA.w*(.45 + 1.25*g);
  float rot = mix(iB.z*6.28 + f*(iB.z - .5)*1.6, (iB.z - .5)*.8 + f*(iB.z - .5)*.5, tall), cr = cos(rot), sr = sin(rot);
  // low mist faces the camera; the tall wall is built of quads standing across the river (facing +Z, a
  // little yawed), so that seen along the lip it is edge-on and can never veil the bears in front of it
  vec2 o = vec2(position.x*cr - position.y*sr, position.x*sr + position.y*cr);
  o *= size*vec2(1., mix(1.35, 1.9, tall));           // the wall is built of tall overlapping billows, not round puffs
  vec4 mc = modelViewMatrix*vec4(c, 1.);
  float yw = (iB.z - .5)*.4;
  vec4 mvPosition = mix(mc + vec4(o, 0., 0.), modelViewMatrix*vec4(c + vec3(o.x*cos(yw), o.y, o.x*sin(yw)), 1.), tall);
  vec3 vd = c - uCam;                                   // wall quads fade out when seen edge-on
  float ed = abs(dot(vd/max(length(vd), 1e-4), vec3(-sin(yw), 0., cos(yw))));
  float show = smoothstep(0., .2, f)*(1. - smoothstep(.5, 1., f))*smoothstep(mix(9., 5., tall), mix(32., 26., tall), -mc.z)*mix(1., smoothstep(.2, .55, ed), tall);
  vQ = position.xy; vP = c; vK = vec3(show, iB.z, tall);
  gl_Position = projectionMatrix*mvPosition;
  // depth-tested 4 m behind itself: no hard line where the wall meets a bear's rump
  vec4 fp = projectionMatrix*(mvPosition - vec4(0., 0., 4.*tall, 0.));
  gl_Position.z = fp.z/max(fp.w, 1e-4)*gl_Position.w;
  #include <fog_vertex>
}`,fragmentShader:`
#include <fog_pars_fragment>
${Ee}${xt}
uniform float uPlume;
varying vec2 vQ; varying vec3 vP; varying vec3 vK;
void main(){
  float d = dot(vQ, vQ); if (d > 1.) discard;
  float w = fbm(vQ*1.6 + vK.y*37. + vec2(0., -uTime*.12)) ;
  float w2 = vn(vQ*4.3 + vK.y*91. + vec2(0., -uTime*.3));
  float a = (1. - d); a = a*mix(a, sqrt(a), vK.z)*smoothstep(mix(.22, .16, vK.z), .75, w*.8 + w2*.25 + (1. - d)*.3);
  float back = max(dot(safeN(vP - uCam), uSun), 0.);
  vec3 col = uWhite*(uSunCol*(.17 + .08*vQ.y + .13*back*back*back*back)*(.8 + .4*w) + uSkyCol*.55 + .04);
  gl_FragColor = vec4(col, a*vK.x*mix(.2, .25, vK.z)*uPlume);
  #include <fog_fragment>
}`})}function io(f,u){return Xe(f,{transparent:!0,depthWrite:!1,side:d.DoubleSide,uniforms:{...u,uBub:{value:new d.Vector2(1,1)},uJet:{value:0}},vertexShader:`
#include <fog_pars_vertex>
uniform float uTime;
attribute vec2 aS;
varying vec3 vP; varying vec2 vS;
void main(){
  vec3 p = position;
  p.z += sin(p.x*.4 + p.y*.9 + uTime*1.3 + aS.y*2.)*.3*aS.x;
  vP = p; vS = aS;
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
#include <fog_pars_fragment>
${Ee}${xt}
uniform vec2 uBub; uniform float uJet;
varying vec3 vP; varying vec2 vS;
void main(){
  float dep = vS.x, lay = vS.y;
  float plunge = fbm(vec2(vP.x*.35 + lay*9., vP.y*.25 + uTime*(1.4 - lay*.3)));         // plunging jets going down
  float bub = vn(vec2(vP.x*3. + lay*5., vP.y*2. - uTime*(2.2 + lay))) * vn(vec2(vP.x*9., vP.y*7. - uTime*4.));
  float reach = (1. - smoothstep(.3, 1.15, dep + (plunge - .5)*1.1));
  float a = reach*(.35 + .9*plunge)*(.55 + 1.6*bub)*(1. - .25*lay);
  float colm = fbm(vec2(vP.x*.24 + lay*13., vP.y*.07 - uTime*.25));
  a *= (1. - smoothstep(.9, 1., dep))*(1. - smoothstep(70., 76., abs(vP.x)))*smoothstep(0., .12, dep)*(.3 + 1.1*smoothstep(.3, .68, colm));
  vec3 col = mix(uPool*2.2 + uAmber*.4, uWhite, .55 + .45*bub)*(uSunCol*.28 + uSkyCol*.4)*(1.1 - .5*dep)*(.3 + 1.05*plunge)*vec3(.6, .9, .77)*.85;
  // fib = the grain of the white and of the skirt (fibres beyond 26 m from the eye, clouds nearer: below); topN = the
  // noise that frays the curtain's top and the skirt's lower edge
  float fib = vn(vec2(vP.x*5.5 + lay*7., vP.y*.6 + uTime*(3.4 - lay*.7)))*.6 + vn(vec2(vP.x*15., vP.y*1.5 + uTime*5.2))*.4;
  float topN = vn(vec2(vP.x*.9 + lay*5., uTime*.5))*.7 + vn(vec2(vP.x*3.1, uTime*1.1 + lay))*.3;
  // NEAR THE EYE THE GRAIN AND THE FRAYING ARE CLOUDS (fib and topN; the lines above them do not read this distance).
  // By the true distance from the eye to this point of the curtain, with no step:
  // beyond 26 m fib and topN are the two lines above; from 26 m in they go over, wholly by 12 m, to clouds. The clouds
  // are read on a field of the curtain's own x (each curtain's 7 m across from the last) and y, which rises .3 m a
  // second, is turned by 37 degrees and is shifted each way by up to .4 by a noise of 2 m cells: fib's are three
  // noises of 1.1 m, .43 m and .18 m cells (shares .5, .32, .18), topN's two of 2.4 m and .77 m cells (shares .7, .3)
  float nearK = 1. - smoothstep(12., 26., length(vP - uCam));
  if (nearK > 0.) {
    vec2 cq = mat2(.8, .6, -.6, .8)*vec2(vP.x + lay*7., vP.y - uTime*.3);
    cq += (vec2(vn(cq*.5 + 3.), vn(cq*.5 + 19.)) - .5)*.8;
    fib = mix(fib, vn(cq*.9)*.5 + vn(cq*2.3 + 7.)*.32 + vn(cq*5.6 + 11.)*.18, nearK);
    topN = mix(topN, vn(cq*.42 + 23.)*.7 + vn(cq*1.3 + 31.)*.3, nearK);
  }
  vec3 white = uWhite*(uSunCol*.3 + uSkyCol*.5)*vec3(.8, 1., .92)*(.5 + .75*fib)*(1.05 - .35*dep);
  if (uJet > .001) {
    // from close by the plunging columns are the world's own (bodies of white that stand free in the water); the
    // curtains only back them: a thin haze of bubbles that frays down from the froth ceiling, dark water below it
    float top = smoothstep(0., 1., (-.12 - vP.y)/(.2 + .8*topN));
    a = mix(a, min(a*.2, .04)*top, uJet);
  }
  // seen from within 12 to 26 m, the two inner curtains hang a ragged skirt of froth under the ceiling, down to 1 to
  // 3 m (like every curtain it has no strength at the ceiling's height and comes to its whole strength under it: THE
  // CURTAIN BEGINS UNDER THE CEILING, below). Its lower edge is drawn by the noise alone (long tongues, short tongues, fibres; nearer the eye
  // than 26 m topN and fib are going over to the clouds above), never by the mesh, and it is thin where fib is low
  float sk = -vP.y + (topN - .5)*2.2 + (fib - .5)*1.5 + (vn(vec2(vP.x*.33 + lay*3., 1.7 + uTime*.15)) - .5)*2.6;
  float skirt = lay > 1.5 ? 0. : (1. - smoothstep(.7, mix(3.4, 2., uJet), sk))*(.3 + .7*smoothstep(.22, .6, fib))*(1. - smoothstep(70., 76., abs(vP.x)));
  skirt *= max(uJet, 1. - smoothstep(12., 26., length(vP - uCam)));
  a = max(a, skirt*.8); col = mix(col, white, skirt);
  // THE CURTAIN BEGINS UNDER THE CEILING. -.78 exp(-max(z, 0)/6.5) smoothstep(-.6, 1.5, z) is the height, under its
  // own level, at which the world lays the lower river's surface over the boil at each row of that surface's mesh
  // (rows at z .35, 1.89, 3.48 m and on: .32, .58 and .46 m under; between two rows the mesh runs straight, which from
  // 1.89 m out is within 4 mm of this height and between .35 and 1.89 m lies up to .15 m above it). At this height,
  // and above it, a curtain has no strength; it comes to its whole strength .15 to .75 m under it (by topN), at every
  // distance from the eye
  a *= smoothstep(0., 1., (-.78*exp(-max(vP.z, 0.)/6.5)*smoothstep(-.6, 1.5, vP.z) - vP.y)/(.15 + .6*topN));
  ${Tt}
  gl_FragColor = vec4(col*uBub.y, clamp(a*mix(1.25, 1., uBub.x), 0., .92));
  #ifdef USE_FOG
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogK*uBub.x);
  #endif
}`})}const Gt={day:{sun:[-.816,.574,-.071],col:"#FFF4E0",I:2.6,sky:[.3,.44,.66],hor:[.075,.13,.1],gnd:[.1,.12,.09]},evening:{sun:[.6,.26,.76],col:"#FFAE6A",I:2.5,sky:[.24,.3,.52],hor:[.16,.12,.08],gnd:[.1,.08,.07]},dawn:{sun:[-.95,.12,-.28],col:"#FFBCA4",I:1.8,sky:[.4,.4,.55],hor:[.2,.17,.17],gnd:[.1,.09,.1]},night:{sun:[-.6,.6,-.5],col:"#BFD0FF",I:.55,sky:[.03,.05,.1],hor:[.012,.018,.025],gnd:[.01,.015,.02]}};async function fo(f,u={}){const n=f.rng,m=f.noise,q=(u.palette&&u.palette.length>=7?u.palette:Xt).slice(),M=u.season||"september",o=u.weather||"clear",U=Gt[u.hour]?u.hour:"day",Y=f.quality?.detail??1,Pe=tt(u.density??1,.5,1.5),Se=u.duration??45,Ce=u.strikeU??.775,I=Gt[U],Ae=o==="clear"?0:1,D={uTime:{value:0},uKeyT:{value:0},uKeyOn:{value:0},uSun:{value:new d.Vector3(...u.sunDir||I.sun).normalize()},uSunCol:{value:new d.Color(I.col).multiplyScalar(I.I*(Ae?.3:1))},uSkyCol:{value:new d.Color(...Ae?[.42,.46,.5].map(e=>e*(U==="night"?.15:1)):I.sky)},uGndCol:{value:new d.Color(...I.gnd)},uCam:{value:new d.Vector3(0,10,100)},uUnderC:{value:new d.Color(.07,.19,.125)}},ge={uWhite:{value:new d.Color(q[5])},uPool:{value:new d.Color(q[2])},uAmber:{value:new d.Color(q[1])},uHorizon:{value:new d.Color(...Ae?[.12,.15,.14].map(e=>e*(U==="night"?.15:1)):I.hor)},uSolid:{value:u.water===!1?0:1},uUnder:{value:new d.Color(.07,.19,.125)},uEye:{value:new d.Vector2(0,0)}},j=n.range(0,200),ue=tt(Math.round(u.bears??(M==="july"?12:M==="october"?3:7)),2,12),ie=n.range(13.5,19),p=ie+7.5,L=n.range(-30,-22),_=[L,ie],Q=(e,t)=>_.every(a=>Math.abs(a-e)>=t)&&!(e>ie+2&&e<p+10);if(ue>=5)for(const e of[-1,1]){const t=L+e*n.range(11.5,14);Q(t,10)&&_.push(t)}for(let e=0;_.length<ue&&e<600;e++){const t=n.range(-64,64);Q(t,ue>8?9.5:11.5)&&_.push(t)}const v=[];for(let e=0;e<7;e++){const t=n.range(-70,70);Math.abs(t-p)>6&&_.every(a=>Math.abs(a-t)>3)&&v.push([t,n.range(1.2,2.8)])}const N=e=>{let t=.5+.4*m.fbm2(e*.045+j,3.1,3)+.2*m.n2(e*.23+j,9.7);t+=.6*Math.exp(-(((e-p)/3.5)**2));for(const a of v)t-=.8*Math.exp(-(((e-a[0])/a[1])**2));for(const a of _)t=we(t,.55,Math.exp(-(((e-a)/3)**2)));return tt(t,.05,1)*re(77,72,Math.abs(e))},de=e=>5.85-.9*N(e),te=e=>5.97-.3*N(e),P=_.map((e,t)=>{const a=(M==="october"?1.22:1)*n.range(.9,1.1),l=-1.45*a-n.range(0,.5),h=t===1?n.range(.38,.5):t===0?n.range(-.12,.12):n.range(-.5,.5);return{x:e,z:l,y:0,yaw:h,scale:a,girth:n.range(.96,1.16),phase:n(),tint:n(),period:t===1?12:n.range(10.5,17),offset:t===1?5:n.range(0,17),keyed:t===1?1:0}}),s=[];for(let e=0;e<12;e++)s.push([n.range(-72,72),n.range(-34,-7),n.range(1.4,3.2),n.range(1.6,3.4)]);for(const e of s)Math.abs(e[0]-p)<9.5&&(e[0]+=(e[0]<p?-1:1)*12);const b=(e,t)=>re(75,82,Math.abs(e)+2.5*m.n2(e*.11+j,t*.11)),x=(e,t)=>{let a=3.3+.7*m.fbm2(e*.06+j,t*.06,3);for(const h of s){const c=((e-h[0])**2+(t-h[1])**2)/(h[2]*h[2]);c<6&&(a+=h[3]*Math.exp(-c)*(.8+.3*m.n2(e*.7,t*.7)))}a=we(a,de(e)+.1*m.n2(e*.6,t*.6+j),re(-9,-.6,t));for(const h of P){const c=Math.hypot(e-h.x,t-h.z-.3);c<3.6&&(a=we(a,h.y,re(3.6,1.7,c)))}const l=b(e,t);return l>0&&(a=we(a,9+3.2*m.fbm2(e*.09,t*.09+j,3)+.4*m.n2(e*.5,t*.5),l)),a};for(const e of P)e.y=de(e.x)-.06;await f.yield();const T=new d.Group;T.name="salmon-falls-ledge";{const a=new Float32Array(27135),l=new Float32Array(9045*3),h=[],c=be(Pt(q[4]),1.7);for(let K=0;K<=200;K++){const r=-ht+2*ht*K/200,y=x(r,0),B=b(r,0);for(let S=0;S<=44;S++){let k,V;if(S<=18)V=-46*Math.pow(1-S/18,1.7),k=x(r,V);else if(S<=21){const G=S-18;V=[0,.22,.34,.36][G],k=y-[0,.12,.42,.9][G]}else if(S<=38){const G=(S-21)/17;k=we(y-.9,yt,G),V=.36-.14*(y-k)*(1-.4*G)+.45*m.n2(r*.22+j,k*.12)+.22*m.n2(r*.6,k*.33+j)+re(-3.6,-7,k)*2.6}else{const G=(S-38)/6,X=.36-.14*(y-yt)*.6+2.6;V=we(X,14,G),k=yt+.5*m.fbm2(r*.1,V*.1+j,2)*G}S>18&&(V+=B*(2.5+2*m.n2(r*.15,k*.15+j))*re(yt,2,k)+re(78,88,Math.abs(r))*(11+2*m.n2(k*.2,r*.2+j))*(S<=38?1:1-(S-38)/6));const W=(K*45+S)*3;a[W]=r,a[W+1]=k,a[W+2]=V;const he=.8+.3*m.n2(r*.13+j,k*.2+V*.13),z=.5+.5*m.n2(r*.05,V*.05+40);let F=[.115*he*(1+.15*z),.108*he,.108*he*(1.05-.15*z)];k>5&&k<6.6&&N(r)<.3&&(F=ke(F,c,.5)),l[W]=F[0],l[W+1]=F[1],l[W+2]=F[2]}K%12===11&&await f.yield()}await f.yield();for(let K=0;K<200;K++)for(let r=0;r<44;r++){const y=K*45+r,B=y+44+1,S=B+1,k=y+1;h.push(y,k,S,y,S,B)}const w=new d.BufferGeometry;w.setAttribute("position",new d.BufferAttribute(a,3)),w.setAttribute("color",new d.BufferAttribute(l,3)),w.setIndex(h),await f.yield(),w.computeVertexNormals(),await f.yield();const i=oo(D);i.uniforms.uMoss.value.setRGB(...be(Pt(q[4]),1.9));const g=new d.Mesh(w,i);g.name="ledge",T.add(g)}await f.yield();const E=(e,t,a,l)=>{const h=(e+1)*(t+1),c=new Float32Array(h*3),w=l?new Float32Array(h*l):null,i=[];for(let g=0;g<=e;g++)for(let K=0;K<=t;K++){const r=a(g,K),y=g*(t+1)+K;c[y*3]=r[0],c[y*3+1]=r[1],c[y*3+2]=r[2];for(let B=0;B<(l||0);B++)w[y*l+B]=r[3+B]}for(let g=0;g<e;g++)for(let K=0;K<t;K++){const r=g*(t+1)+K,y=r+t+1,B=y+1,S=r+1;i.push(r,S,B,r,B,y)}return{P:c,E:w,idx:i,n:h}},O=[];for(let e=0;e<12;e++){const t=P[e];O.push(t?new d.Vector4(t.x,t.z+.2*t.scale,2.3*t.scale,1):new d.Vector4(0,-999,1,0))}{const e=E(150,30,(h,c)=>{const w=-ht+2*ht*h/150,i=c/30,g=-70*(1-i)*(1-i)-.6,K=N(w);return[w,we(We,te(w)+.02,re(-5,-.6,g)),g,K]},1),t=new d.BufferGeometry;t.setAttribute("position",new d.BufferAttribute(e.P,3)),t.setAttribute("aFlow",new d.BufferAttribute(e.E,1)),t.setIndex(e.idx);const a=ao(D,ge);a.uniforms.uBears.value=O;const l=new d.Mesh(t,a);l.name="upperWater",l.renderOrder=1,T.add(l)}await f.yield();let ye;{const e=E(110,40,(l,h)=>[-ht+2*ht*l/110,.03,-.5+72.5*Math.pow(h/40,1.6)]),t=new d.BufferGeometry;t.setAttribute("position",new d.BufferAttribute(e.P,3)),t.setIndex(e.idx);const a=no(D,ge);a.depthWrite=u.water!==!1,ye=new d.Mesh(t,a),ye.name="pool",ye.renderOrder=1,T.add(ye)}await f.yield();{const a=[],l=[],h=[],c=[];let w=0;for(let K=0;K<3;K++){const r=E(240,14,(y,B)=>{const S=-76+152*y/240,k=B/14,V=N(S),W=te(S)+.02+.02*K,he=2+1.5*V+.38*K+.25*m.n2(S*.3+K*7,j),z=(W+.7)*k*k;return[S,W-z,-.6+(he+.6)*k,k,K,V,z]},4);for(let y=0;y<r.P.length;y++)l.push(r.P[y]);for(let y=0;y<r.E.length;y++)h.push(r.E[y]);for(let y=0;y<r.idx.length;y++)c.push(r.idx[y]+w);w+=r.n,a.push(r),await f.yield()}const i=new d.BufferGeometry;i.setAttribute("position",new d.Float32BufferAttribute(l,3)),i.setAttribute("aS",new d.Float32BufferAttribute(h,4)),i.setIndex(c),await f.yield(),i.computeVertexNormals(),await f.yield();const g=new d.Mesh(i,so(D,ge));g.name="falls",g.renderOrder=3,T.add(g)}if(u.bubbleWall!==!1){const e=[],t=[],a=[];let l=0;for(let w=0;w<3;w++){const i=E(120,8,(g,K)=>{const r=-76+152*g/120,y=K/8;return[r,0-y*6.8,[3.4,5.4,8.2][w]+m.n2(r*.1+w*9,j)*.8+y*(w-1)*1.2,y,w]},2);for(let g=0;g<i.P.length;g++)e.push(i.P[g]);for(let g=0;g<i.E.length;g++)t.push(i.E[g]);for(let g=0;g<i.idx.length;g++)a.push(i.idx[g]+l);l+=i.n}const h=new d.BufferGeometry;h.setAttribute("position",new d.Float32BufferAttribute(e,3)),h.setAttribute("aS",new d.Float32BufferAttribute(t,2)),h.setIndex(a);const c=new d.Mesh(h,io(D,ge));c.name="bubbleWall",c.renderOrder=2,T.add(c)}await f.yield();const Z=(e,t)=>{const a=new d.InstancedBufferGeometry;a.setAttribute("position",new d.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),a.setIndex([0,1,2,0,2,3]);for(const l in t)a.setAttribute(l,new d.InstancedBufferAttribute(new Float32Array(t[l]),4));return a.instanceCount=e,a.boundingSphere=new d.Sphere(new d.Vector3(0,8,0),120),a},oe=(e=-72,t=72)=>{for(let a=0;a<12;a++){const l=n.range(e,t);if(n()<N(l)+.12)return l}return n.range(e,t)};let A=null;if(u.plume!==!1){const e=Math.round(380*(.6+.4*Y)),t=[],a=[];for(let h=0;h<e;h++){const c=n()<.55,w=c?n.range(12,21):n.range(2,4.6);t.push(c?n.range(-74,74):oe(),n.range(1.5,5.5),n(),c?n.range(6.5,10.5):n.range(1.5,2.8)),a.push(1/n.range(c?11:6,c?18:10),n.range(-.5,.5),n(),w)}A=ro(D,ge),A.uniforms.uPlume.value=(o==="clear"?1:1.5)*(u.plumeOpacity??1);const l=new d.Mesh(Z(e,{iA:t,iB:a}),A);l.name="plume",l.renderOrder=5,l.frustumCulled=!1,T.add(l)}await f.yield();{const e=P[1],t=-Ce*Se;for(let a=12;a<=17;a+=.5){const l=((t+5)%a+a)%a-5;if(l>3.6&&l<a-7){e.period=a;break}}}const me=(e,t,a)=>{const l=new d.InstancedBufferGeometry;l.index=e.index;for(const h of["position","normal","color","aAux"])l.setAttribute(h,e.getAttribute(h));for(const h in a)l.setAttribute(h,new d.InstancedBufferAttribute(new Float32Array(a[h][0]),a[h][1]));return l.instanceCount=t,l};let le=0,ce=null,$=null;const Fe={value:new d.Vector4(0,1,0,0)};{const e=await Qt(n,q,f);le=e.index.count/3,ce=e,await f.yield();const t=[],a=[],l=[];for(const c of P)t.push(c.x,c.y,c.z,c.yaw),a.push(c.scale,c.girth,c.phase,c.tint),l.push(c.period,c.offset,c.keyed);$=$t(D,Fe);const h=new d.Mesh(me(e,P.length,{iPos:[t,4],iPar:[a,4],iStrike:[l,3]}),$);h.name="bears",h.frustumCulled=!1,T.add(h);for(const c of P)c.mouth=Yt(c),c.head=Rt([0,2.95,4],c)}await f.yield();const qe=[],De=[],Re=[],ee=(e,t,a,l,h,c,w,i)=>{qe.push(e[0],e[1],e[2],a),De.push(t[0],t[1],t[2],l),Re.push(h,c,w,i)},Ye=[],xe=[],Qe=[],ot=[],ut=[],$e=[];let Ie=0;const dt=[],St=(e,t,a,l,h,c,w,i,g=n,K=1)=>{const r=g,y=r(),B=r.range(.85,1.15)*(M==="october"?.92:1)*K;Ye.push(e[0],e[1],e[2],a),xe.push(t[0],t[1],t[2],l),Qe.push(h,c,w,y),ot.push(i?i.x:0,i?i.y:0,i?i.z:0,i?i.yaw:0),ut.push(i?i.scale:1,i?i.girth:1,i?i.phase:0,B),$e.push(0),Ie++,dt.push({p0:e,v0:t,T:a,type:l,keyed:w,b:i,size:B,d:qe.length/4});const S=z=>[e[0]+t[0]*z,e[1]+t[1]*z-.5*J*z*z,e[2]+t[2]*z],k=z=>[t[0],t[1]-J*z,t[2]],V=(t[1]-Math.sqrt(Math.max(t[1]*t[1]+2*J*e[1],0)))/J,W=l===2?5-a:0,he=S(V);for(let z=0;z<6;z++){const F=r()*6.283,G=r.range(1.5,3.8);ee([he[0],.1,he[2]],[Math.cos(F)*G,r.range(4,9.5),Math.sin(F)*G],r.range(.5,.9),r.range(.07,.13),h,c,w,W+V+r()*.06)}for(let z=0;z<8;z++){const F=V+(a-V)*((z+r())/8)*.85,G=S(F),X=k(F);ee(G,[X[0]*.5+r.range(-1.5,1.5),X[1]*.5+r.range(-1,2),X[2]*.5+r.range(-1.5,1.5)],r.range(.45,.8),r.range(.05,.1),h,c,w,W+F)}if(l<2){const z=Mt(Math.floor(y*1e6)*31+7>>>0);for(let X=0;X<5;X++){const se=z()*6.283,ae=z.range(.8,2.6);ee([he[0],.1,he[2]],[Math.cos(se)*ae+t[0]*.3,z.range(6,11),Math.sin(se)*ae+t[2]*.4],z.range(.6,1),z.range(.16,.3),h,c,w,W+V+z()*.08)}for(let X=0;X<5;X++){const se=V+(a-V)*((X+z())/5)*.6,ae=S(se),Me=k(se);ee(ae,[Me[0]*.6+z.range(-1,1),Me[1]*.6+z.range(-1.5,.5),Me[2]*.6+z.range(-1,1)],z.range(.5,.9),z.range(.11,.2),h,c,w,W+se)}const F=S(a),G=l===1?We+.1:.1;for(let X=0;X<8;X++){const se=r()*6.283,ae=r.range(2,5);ee([F[0],G,F[2]],[Math.cos(se)*ae,r.range(5,11),Math.sin(se)*ae+(l===0?1.5:0)],r.range(.6,1),r.range(.1,.2),h,c,w,a+r()*.05)}}else{const z=i.mouth,F=Math.cos(i.yaw),G=-Math.sin(i.yaw),X=Math.sin(i.yaw),se=Math.cos(i.yaw);for(let ae=0;ae<24;ae++){const Me=r()*6.283,fe=r.range(2,8);ee([z.x,z.y,z.z],[Math.cos(Me)*fe,r.range(1,9),Math.sin(Me)*fe],r.range(.5,1),r.range(.08,.15),h,c,w,4.86+r()*.16)}for(let ae=0;ae<36;ae++){const Me=r.sign()*r.range(4,10),fe=r.range(2,8.5),Je=r.range(-2.5,2.5),Ge=r.range(-.9,.9);ee([z.x+F*Ge-X*.5,z.y+.4,z.z+G*Ge-se*.5],[F*Me+X*Je,fe,G*Me+se*Je],r.range(.6,1.1),r.range(.07,.14),h,c,w,5+r.range(.5,1.8))}}};for(const e of P){const t=e.mouth,a=n.range(.84,.98),l=e.keyed?[p-2.6,-1,7.2]:[t.x+n.range(-2.5,2.5),-1,t.z+n.range(2.6,5)];St(l,[(t.x-l[0])/a,(t.y-l[1])/a+.5*J*a,(t.z-l[2])/a],a,2,e.period,e.offset,e.keyed,e)}const mt={f:Ye.length,d:qe.length,n:Ie},Ht=Math.round(62*Pe*(M==="july"?2:M==="october"?.4:1));for(let e=0;e<Ht;e++){let t=0;for(let y=0;y<20&&(t=n()<.4?n.pick(P).x+n.range(-6,6):oe(-70,70),!((t<ie-4.5||t>p+9)&&Math.abs(t-L)>4&&Math.abs(t)<72));y++);const a=P.some(y=>Math.abs(y.x-t)<3.6),l=!a&&n()<.2,h=n.range(3.5,9),c=l?n.range(7.5,8.9):n.range(2,5.6),w=l?We:0,i=Math.sqrt(2*J*(c+1)),g=(i+Math.sqrt(i*i-2*J*(w+1)))/J,K=l?n.range(-6,-2.6):n.range(.7,3.2),r=g+n.range(1.5,4);St([t,-1,h],[n.range(-1.5,1.5),i,(K-h)/g],g,l?1:0,r,n.range(0,r),0,null)}Ye.length=xe.length=Qe.length=ot.length=ut.length=mt.f,qe.length=De.length=Re.length=mt.d,Ie=mt.n,$e.length=mt.n,dt.length=mt.n;{const e=Mt(((f.seed??1)|0)*2749+77>>>0),t=L+4.5,a=ie-5,l=(c,w)=>{for(let i=0;i<12;i++){const g=e.range(c,w);if(e()<N(g)+.12)return g}return e.range(c,w)},h=Math.round(72*(M==="july"?Math.min(Pe*2,1.6):M==="october"?Pe*.4:Pe));for(let c=0;c<h;c++){const w=c<h*.56;let i=0;for(let he=0;he<20&&(i=w?e.range(t,a):e()<.4?e.pick(P).x+e.range(-6,6):l(-70,70),!((i<ie-4.5||i>p+9)&&Math.abs(i-L)>4&&Math.abs(i)<72));he++);const g=P.some(he=>Math.abs(he.x-i)<3.6),K=!g&&e()<(w?.42:.2),r=e.range(3.5,9),y=K?e.range(7.5,9.3):w?e.range(3.3,6.3):e.range(2,5.6),B=K?We:0,S=Math.sqrt(2*J*(y+1)),k=(S+Math.sqrt(S*S-2*J*(B+1)))/J,V=K?e.range(-6,-2.6):e.range(.7,3.2),W=k+(w?e.range(.7,2.3):e.range(1.5,4));St([i,-1,r],[e.range(-1.5,1.5),S,(V-r)/k],k,K?1:0,W,e.range(0,W),0,null,e,w?1.15:1),$e[Ie-1]=i>L-9&&i<L+10||i>ie-11&&i<p+12?0:1}}let At=0;{await f.yield();const e=Dt(q,M);At=e.index.count/3,await f.yield();const t=eo(D,Fe),a=[[],[]];for(let h=0;h<Ie;h++)a[$e[h]?1:0].push(h);const l=(h,c)=>{const w=new Float32Array(c.length*4);for(let i=0;i<c.length;i++)for(let g=0;g<4;g++)w[i*4+g]=h[c[i]*4+g];return w};for(let h=0;h<2;h++){const c=a[h];if(!c.length)continue;const w=h?Dt(q,M,8,1):e,i=new d.Mesh(me(w,c.length,{iA:[l(Ye,c),4],iB:[l(xe,c),4],iC:[l(Qe,c),4],iD:[l(ot,c),4],iE:[l(ut,c),4]}),t);i.name=h?"salmon-far":"salmon",i.frustumCulled=!1,T.add(i);for(let g=0;g<c.length;g++)dt[c[g]].at=i.geometry.attributes,dt[c[g]].slot=g*4;await f.yield()}}await f.yield();const Ut=Math.round(1500*Y);for(let e=0;e<Ut;e++){const t=oe(-74,74),a=n.range(4,12.5),l=Math.min(2*a/J,1.2)*n.range(.7,1),h=l+n.range(.2,1.6);ee([t,.2,n.range(1.2,4.4)],[n.range(-2,2),a,n.range(0,9)],l,n.range(.06,.14),h,n.range(0,h),0,0)}for(const e of P)for(let t=0;t<26;t++){const a=n.range(2,5.5),l=2*a/J,h=l+n.range(.2,1.2);ee([e.x+n.range(-1.8,1.8)*e.scale,We+.05,e.z+n.range(.5,2.4)],[n.range(-2,2),a,n.range(.5,4)],l,n.range(.05,.11),h,n.range(0,h),0,0)}const Ft=qe.length/4,Nt=to(D);{const e=new d.Mesh(Z(Ft,{iP:qe,iV:De,iT:Re}),Nt);e.name="drops",e.renderOrder=6,e.frustumCulled=!1,T.add(e)}const ne=(e,t,a)=>new d.Vector3(e,t,a),Ot=P[1],_t={lipY:We,poolY:0,bedY:yt,leapX:p,failX:L,apexBear:1,apexMouth:Ot.mouth.clone(),plumeTop:27,sunDir:D.uSun.value.clone(),bounds:{radius:95},flyThrough:[ne(p+7,-3,26),ne(p+2,-3,14),ne(p+.4,-.2,7.4),ne(p,5.4,2.6),ne(p,8.6,0),ne(p,8,-4.5),ne(p,6,-9),ne(p,5,-15),ne(p,6.5,-40)],failedLeap:[ne(L,-3,22),ne(L,0,14),ne(L,3.5,9),ne(L+1.5,1.6,7),ne(L+4,-1.8,9)],portalSeat:{position:ne(p,We+.5,-115),facing:ne(0,0,1)},viewpoints:{far:ne(0,1.2,160),slant:ne(-32,.5,46),foot:ne(L,3.5,9),apex:ne(p,8.6,0)},bears:P.map(e=>({position:ne(e.x,e.y,e.z),yaw:e.yaw,scale:e.scale,head:e.head.clone(),mouth:e.mouth.clone()}))},Kt=new d.Matrix4,Bt=new d.Vector2;let Wt=!1;const Ct={object:T,radius:46,height:22,center:ne(0,5,0),anchors:_t,ground:!0,groundY:-.35,cost:{bearTriangles:le,fishTriangles:At,fish:Ie,drops:Ft},surfaceAt:(e,t)=>t>-.6?0:we(We,te(e),re(-5,-.6,t)),uniforms:D,waterUniforms:ge,flowAt:N,crestAt:de,rockTop:x,bearTurn:$.uniforms.uTurn,addBears(e,t={}){const a=[],l=[],h=[];for(const i of e)a.push(i.x,i.y,i.z,i.yaw??0),l.push(i.scale??1,i.girth??1,i.phase??0,i.tint??.5),h.push(i.period??14,i.offset??0,0);const c=t.own?$t(D):$;t.own&&t.subK!==void 0&&(c.uniforms.uSubK.value=t.subK),t.own&&t.silK!==void 0&&(c.uniforms.uSilK.value=t.silK);const w=new d.Mesh(me(ce,e.length,{iPos:[a,4],iPar:[l,4],iStrike:[h,3]}),c);return w.name=t.name||"moreBears",w.frustumCulled=!1,T.add(w),{mesh:w,rear:c.uniforms.uRear,rear2:c.uniforms.uRear2,triangles:le*e.length}},setStrikeClock(e){Wt=!0,D.uKeyOn.value=1,D.uKeyT.value=e},setProgress(e){Ct.setStrikeClock((e-Ce)*Se)},setLight(e={}){e.sunDir&&(D.uSun.value.set(e.sunDir.x??e.sunDir[0],e.sunDir.y??e.sunDir[1],e.sunDir.z??e.sunDir[2]).normalize(),_t.sunDir.copy(D.uSun.value)),e.sunColor&&D.uSunCol.value.set(e.sunColor).multiplyScalar(e.sunIntensity??2.6),e.sky&&D.uSkyCol.value.set(e.sky),e.horizon&&ge.uHorizon.value.set(e.horizon),e.ground&&D.uGndCol.value.set(e.ground)},update(e,t,a){D.uTime.value=t,T.updateWorldMatrix(!0,!1),Kt.copy(T.matrixWorld).invert(),D.uCam.value.setFromMatrixPosition(a.matrixWorld).applyMatrix4(Kt),f.renderer&&(f.renderer.getDrawingBufferSize(Bt),Nt.uniforms.uVH.value=Math.max(Bt.y,1))},dispose(){}};return Ct.offRoute=async(e,t=async()=>{})=>{const a=e.clear,l=T.getObjectByName("drops").geometry.attributes,h=l.iP.array,c=l.iV.array,w=l.iT.array,i=[],g=(r,y,B,S,k,V,W)=>{const he=k===2?-.3:0,z=k===2?S:S+.45,F=Math.hypot(B[0],B[2]),G=Math.max(Math.hypot(F,B[1]-J*he),Math.hypot(F,B[1]-J*z)),X=G+V*(J/Math.max(F,.001)+9.75);let se=a,ae=W===void 0?a:W;for(let Me=he;;){const fe=Math.min(Me,z),Je=V*(k===2?re(-.3,-.12,fe):1-re(S+.2,S+.45,fe)),Ge=y[0]+B[0]*fe,it=y[1]+B[1]*fe-.5*J*fe*fe,lt=y[2]+B[2]*fe,He=B[1]-J*fe,je=Math.hypot(F,He),Ue=e.dist(r,Ge,it,lt)-1.17*V-ae;if(Ue>.02)Me+=Ue/G;else{const Ke=e.body(r,Ge,it,lt,B[0]/je,He/je,B[2]/je,Je);if(Ke<ae&&W!==void 0)return Ke;Ke<se&&(se=Ke,W===void 0&&(ae=Ke)),Me+=Math.max((Ke-ae)/X,Math.min(.01,.02/(je+V*J*F/(je*je))))}if(fe>=z)return se}};let K=0;for(const r of dt){if(r.keyed)continue;const{p0:y,v0:B,T:S,type:k,size:V}=r,W=k===2?r.b.mouth:null,he=y[2]+B[2]*S,z=a+1.17*V,F=k===2?[-2.5,2.5,2.6,5]:[0,0,3.5,9],G=k===2?(C,H)=>[W.x+C,y[1],W.z+H]:(C,H)=>[y[0],y[1],H],X=k===2?C=>[(W.x-C[0])/S,B[1],(W.z-C[2])/S]:C=>[B[0],B[1],(he-C[2])/S],se=k===2?-.3:0,ae=k===2?S:S+.45,Me=Math.min(Math.max(B[1]/J,se),ae),fe=C=>y[1]+B[1]*C-.5*J*C*C;let Je=1/0,Ge=-1/0,it=1/0,lt=-1/0;for(const C of[F[0],F[1]])for(const H of[F[2],F[3]]){const ve=G(C,H),pe=X(ve);for(const ze of[se,ae]){const ft=ve[0]+pe[0]*ze,pt=ve[2]+pe[2]*ze;Je=Math.min(Je,ft),Ge=Math.max(Ge,ft),it=Math.min(it,pt),lt=Math.max(lt,pt)}}const He=e.near(Je-z,Ge+z,Math.min(fe(se),fe(ae))-z,fe(Me)+z,it-z,lt+z);if(!He.length)continue;const je=g(He,y,B,S,k,V);if(je>=a)continue;const Ue=k===2?20:0,Ke=k===2?10:22,vt=[],at=k===2?y[0]-W.x:0,nt=k===2?y[2]-W.z:y[2];for(let C=0;C<=Ue;C++)for(let H=0;H<=Ke;H++){const ve=Ue?F[0]+(F[1]-F[0])*C/Ue:0,pe=F[2]+(F[3]-F[2])*H/Ke;vt.push([Math.hypot(ve-at,pe-nt),ve,pe])}vt.sort((C,H)=>C[0]-H[0]);let Oe=null,Ve=je;for(const C of vt){++K&31||await t();const H=G(C[1],C[2]);if(g(He,H,X(H),S,k,V,a)>=a){Oe=C,Ve=a;break}}let ct=null;if(!Oe&&k===2){const C=2*F[1],H=(F[1]-F[0])/Ue;let ve=1/0,pe=-1/0,ze=1/0,ft=-1/0;for(const Te of[-C,C])for(const Be of[F[2],F[3]]){const Ne=G(Te,Be),_e=X(Ne);for(const Le of[se,ae]){const Ze=Ne[0]+_e[0]*Le,et=Ne[2]+_e[2]*Le;ve=Math.min(ve,Ze),pe=Math.max(pe,Ze),ze=Math.min(ze,et),ft=Math.max(ft,et)}}ct=e.near(ve-z,pe+z,Math.min(fe(se),fe(ae))-z,fe(Me)+z,ze-z,ft+z);const pt=async Te=>{let Be=null;for(const Ne of[-Te,Te])for(let _e=0;_e<=Ke;_e++){++K&31||await t();const Le=F[2]+(F[3]-F[2])*_e/Ke,Ze=G(Ne,Le);if(g(ct,Ze,X(Ze),S,k,V,a)>=a){const et=Math.hypot(Ne-at,Le-nt);(!Be||et<Be[0])&&(Be=[et,Ne,Le])}}return Be};let zt=F[1],gt=null;for(let Te=1;Te<=Ue/2&&!gt;Te++)zt=F[1]+Te*H,gt=await pt(zt);if(gt){let Te=zt-H,Be=zt;for(let Ne=0;Ne<6;Ne++){const _e=(Te+Be)/2,Le=await pt(_e);Le?(Be=_e,gt=Le):Te=_e}Oe=gt,Ve=a}else for(let Te=0;Te<=2*Ue;Te++)for(let Be=0;Be<=Ke;Be++){++K&31||await t();const Ne=-C+H*Te,_e=F[2]+(F[3]-F[2])*Be/Ke,Le=G(Ne,_e),Ze=X(Le);if(g(ct,Le,Ze,S,k,V,Ve)>=Ve){const et=g(ct,Le,Ze,S,k,V);et>Ve&&(Oe=[Math.hypot(Ne-at,_e-nt),Ne,_e],Ve=et)}}}if(!Oe&&!ct)for(let C=vt.length-1;C>=0;C--){++K&31||await t();const H=vt[C],ve=G(H[1],H[2]),pe=X(ve);if(g(He,ve,pe,S,k,V,Ve)>=Ve){const ze=g(He,ve,pe,S,k,V);ze>Ve&&(Oe=H,Ve=ze)}}if(await t(),!Oe){i.push({type:k,was:je,now:je,from:y,to:y});continue}let wt=Oe[1],bt=Oe[2];if(Ve>=a&&!ct){let C=0,H=1;for(let ve=0;ve<6;ve++){const pe=(C+H)/2,ze=G(at+(wt-at)*pe,nt+(bt-nt)*pe);g(He,ze,X(ze),S,k,V,a)>=a?H=pe:C=pe}wt=at+(wt-at)*H,bt=nt+(bt-nt)*H}const st=G(wt,bt),rt=X(st),Lt=r.at.iA.array,Et=r.at.iB.array;Lt[r.slot]=st[0],Lt[r.slot+2]=st[2],Et[r.slot]=rt[0],Et[r.slot+2]=rt[2];const jt=(B[1]-Math.sqrt(Math.max(B[1]*B[1]+2*J*y[1],0)))/J,Vt=k===2?5-S:0,kt=(C,H,ve,pe)=>{const ze=(r.d+C)*4;h[ze]=st[0]+rt[0]*H,h[ze+2]=st[2]+rt[2]*H,c[ze]+=(rt[0]-B[0])*ve,c[ze+2]+=(rt[2]-B[2])*pe};for(let C=0;C<6;C++)kt(C,jt,0,0);for(let C=6;C<14;C++)kt(C,w[(r.d+C)*4+3]-Vt,.5,.5);if(k<2){for(let C=14;C<19;C++)kt(C,jt,.3,.4);for(let C=19;C<24;C++)kt(C,w[(r.d+C)*4+3]-Vt,.6,.6)}i.push({type:k,was:je,now:Ve,from:y,to:st}),r.p0=st,r.v0=rt}return i},Ct}export{Zt as GLSL_SALMON_SKIN,fo as buildHero,It as makeBuilder,Jt as salmonColours,Dt as salmonGeometry};
