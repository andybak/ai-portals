import*as s from"three";import{clamp as Ie,lerp as ce,smoothstep as J}from"../kit/core.js";const Et=["#BFE9F2","#F6F0B8","#6DBB4A","#1F6B4A","#0D3338","#3A2A22","#FF5A3C"],ve=900,kt=12.5,Q=30,De=10,G=68,Ht=895,ke=30,te=-26,Yt=7,D=Math.PI*2,f=s.Vector3,ae=`
float h13(vec3 p){ p=fract(p*0.1031); p+=dot(p,p.zyx+31.32); return fract((p.x+p.y)*p.z); }
float vn3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(h13(i),h13(i+vec3(1,0,0)),f.x),mix(h13(i+vec3(0,1,0)),h13(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h13(i+vec3(0,0,1)),h13(i+vec3(1,0,1)),f.x),mix(h13(i+vec3(0,1,1)),h13(i+vec3(1,1,1)),f.x),f.y),f.z); }
`,xe=`
uniform vec3 uAmbA,uAmbB,uAmbC,uAmbD,uSunCol,uCamL,uPortal,uGlowCol; uniform float uTime,uGlow,uSunGain,uHourK;
vec3 ambAt(float y){ float d=${ve}.0-y; vec3 c=mix(uAmbA,uAmbB,smoothstep(0.0,200.0,d));
  c=mix(c,uAmbC,smoothstep(200.0,550.0,d)); return mix(c,uAmbD,smoothstep(550.0,880.0,d)); }
// leaf-gap cookie: vertical columns of sun that drift and flicker; thins out with depth
float sunAt(vec3 p){ float d=${ve}.0-p.y; vec2 q=p.xz*0.07;
  float n=vn3(vec3(q,uTime*0.11+p.y*0.003))*0.72+vn3(vec3(q*2.9+5.0,uTime*0.37))*0.28;
  return smoothstep(0.40,0.60,n)*mix(1.0,0.5,smoothstep(0.0,880.0,d))*mix(0.7,1.0,smoothstep(0.0,170.0,d))*uSunGain; }
// white-gold spill of the portal on wet things near it
vec3 waterLight(vec3 p){ vec3 a=ambAt(p.y); return min(mix(a,vec3(dot(a,vec3(0.3,0.5,0.2))),0.6)*1.3+uSunCol*sunAt(p)*0.62,vec3(1.45)); }
// falling and broken water: white-blue, lit by the depth ambient and the sun cookie, never below a pale floor
vec3 whiteWater(vec3 p){ float l=dot(ambAt(p.y),vec3(0.3,0.5,0.2));
  return vec3(0.80,0.92,1.0)*min(l*1.15+0.24*uHourK+dot(uSunCol,vec3(0.2))*sunAt(p),1.5); }
vec3 portalSpill(vec3 p, vec3 n){ vec3 L=uPortal-p; float d2=dot(L,L); L*=inversesqrt(d2+0.01);
  return uGlowCol*uGlow*(0.35+0.65*max(dot(n,L),0.0))*40.0/(40.0+d2); }
`,Le=`
uniform float uRate,uLag;
float cyclePhase(float idx,float seed){ return fract(uTime*uRate-idx*uLag+seed*0.07); }
vec4 basinCycle(float idx,float seed){ float ph=cyclePhase(idx,seed);
  float lvl=smoothstep(0.0,0.60,ph)*(1.0-smoothstep(0.64,0.84,ph));
  float tip=smoothstep(0.60,0.72,ph)*(1.0-smoothstep(0.78,0.92,ph));
  float q=fract(ph-0.82); float shud=exp(-q*11.0)*sin(q*46.0)*smoothstep(0.0,0.02,q);
  float dip=2.0*lvl*lvl*(3.0-2.0*lvl)*0.6+1.2*lvl-0.75*shud;
  float pour=0.30+0.70*smoothstep(0.60,0.70,ph)*(1.0-smoothstep(0.80,0.93,ph));
  return vec4(lvl,dip,tip*0.30+0.035*sin(uTime*0.8+seed*9.0)+0.06*shud,pour); }
// place a point given in basin-local space (x = downstream tangent, z = radially out) on the stair
uniform float uHand;
vec3 stairPlace(vec3 p,float ang,float y){ vec3 er=vec3(sin(ang),0.0,cos(ang)); vec3 et=uHand*vec3(cos(ang),0.0,-sin(ang));
  return er*(${Q}.0+p.z)+et*p.x+vec3(0.0,y+p.y,0.0); }
vec3 stairDir(vec3 n,float ang){ vec3 er=vec3(sin(ang),0.0,cos(ang)); vec3 et=uHand*vec3(cos(ang),0.0,-sin(ang));
  return er*n.z+et*n.x+vec3(0.0,n.y,0.0); }
vec3 tipRot(vec3 p,float t){ float c=cos(t), s=sin(t); return vec3(p.x*c+p.y*s,-p.x*s+p.y*c,p.z); }
`;function Fe(l,p,r){const z=.8*Math.sin(r*.013+l*2.1)+.5*Math.sin(r*.047+l*1.3+p),T=Math.pow(Math.abs(Math.sin(p*4.5+z)),.6),V=Math.sin(r*.041+l*1.7+2*Math.sin(p*2+l))*.6+Math.sin(r*.113+p*3+l*4)*.4;return 18.2+3.6*T+1.3*V}const Qt=`
float trunkR(float k,float a,float y){ float w=0.8*sin(y*0.013+k*2.1)+0.5*sin(y*0.047+k*1.3+a);
  float fl=pow(abs(sin(a*4.5+w)),0.6); float lump=sin(y*0.041+k*1.7+2.0*sin(a*2.0+k))*0.6+sin(y*0.113+a*3.0+k*4.0)*0.4;
  return 18.2+3.6*fl+1.3*lump; }
`,we=`
#include <fog_vertex>
`,ye=`
#include <fog_fragment>
`;function Xt(){return{p:[],n:[],c:[],fx:[],bs:[],i:[]}}const U=new f,ge=new f,oe=new f;function ne(l,p,r,z,T,V,N,$=!0){const S=p.length,se=l.p.length/3;ge.set(.31,.2,.93).normalize();for(let g=0;g<S;g++){U.subVectors(p[Math.min(g+1,S-1)],p[Math.max(g-1,0)]).normalize(),oe.crossVectors(U,ge),oe.lengthSq()<1e-5&&oe.set(U.y,U.z,U.x).cross(U),oe.normalize(),ge.crossVectors(oe,U).normalize();const A=g/(S-1),w=r(A),C=T(A),M=V?V(A):[0,0,1,0],I=N?N(A):[0,0,0],x=p[g];for(let q=0;q<z;q++){const X=q/z*D,K=Math.cos(X),B=Math.sin(X),b=ge.x*K+oe.x*B,L=ge.y*K+oe.y*B,R=ge.z*K+oe.z*B,be=w*(1+.07*Math.sin(q*2.4+g*.9));l.p.push(x.x+b*be,x.y+L*be,x.z+R*be),l.n.push(b,L,R);const E=.86+.14*Math.sin(q*1.7+g*.37);l.c.push(C[0]*E,C[1]*E,C[2]*E),l.fx.push(M[0],M[1],M[2],M[3]),l.bs.push(I[0],I[1],I[2])}}for(let g=0;g<S-1;g++)for(let A=0;A<z;A++){const w=se+g*z+A,C=se+g*z+(A+1)%z,M=w+z,I=C+z;l.i.push(w,C,M,C,I,M)}if($){const g=l.p.length/3,A=p[S-1],w=T(1),C=V?V(1):[0,0,1,0],M=N?N(1):[0,0,0];l.p.push(A.x+U.x*r(1)*.6,A.y+U.y*r(1)*.6,A.z+U.z*r(1)*.6),l.n.push(U.x,U.y,U.z),l.c.push(w[0],w[1],w[2]),l.fx.push(C[0],C[1],C[2],C[3]),l.bs.push(M[0],M[1],M[2]);const I=se+(S-1)*z;for(let x=0;x<z;x++)l.i.push(I+x,I+(x+1)%z,g)}}function it(l,p,r,z,T,V,N,$,S,se=1){const g=l.p.length/3,A=4,w=2;for(let M=0;M<=A;M++)for(let I=-w;I<=w;I++){const x=M/A,q=Math.sin(Math.PI*Math.pow(x,.7))*N*.5*(I/w),X=Math.abs(I/w)**2*N*.22+x*x*V*.28;l.p.push(p.x+r.x*x*V+z.x*q+T.x*X,p.y+r.y*x*V+z.y*q+T.y*X,p.z+r.z*x*V+z.z*q+T.z*X),l.n.push(T.x,T.y,T.z);const K=.75+.25*x;l.c.push($[0]*K,$[1]*K,$[2]*K),l.fx.push(.15*x,S*(.4+.6*x),0,se),l.bs.push(0,0,0)}const C=2*w+1;for(let M=0;M<A;M++)for(let I=0;I<2*w;I++){const x=g+M*C+I;l.i.push(x,x+1,x+C,x+1,x+C+1,x+C)}}function Zt(l){const p=new s.Color(l);return[p.r,p.g,p.b]}function _(l,p,r){return[ce(l[0],p[0],r),ce(l[1],p[1],r),ce(l[2],p[2],r)]}function Y(l,p=1){return new s.Color(l[0]*p,l[1]*p,l[2]*p)}async function e0(l,p={}){const r=l.rng.fork("well-of-rain-hero"),z=l.noise,T=(p.palette&&p.palette.length>=7?p.palette:Et).map(Zt),[V,N,$,S,se,g,A]=T,w=p.handed===1||p.handed===-1?p.handed:r.sign(),C=p.trunks!==!1,M=r.range(-1,1),I=r.range(.25,1),x=1/r.range(6,8.5),q=r.range(.07,.11),X=r.int(4,6),K=r.range(2.2,3.4)*r.sign(),B=e=>ke+9e-4*e*e,b=new f(0,B(te)+8.2,te),L=new s.Group;L.name="well-of-rain-hero";const R={uTime:{value:0},uRate:{value:x},uLag:{value:q},uHand:{value:w},uAmbA:{value:Y(_(N,$,.4),.95)},uAmbB:{value:Y(_($,S,.7),1.5)},uAmbC:{value:Y(S,2.3)},uAmbD:{value:Y(_(se,S,.25),4.2)},uSunCol:{value:new s.Color("#FFF4C8").multiplyScalar(2.6)},uSunGain:{value:1},uHourK:{value:1},uCamL:{value:new f(0,500,40)},uPortal:{value:b.clone()},uGlowCol:{value:new s.Color("#FFE9B0").multiplyScalar(2.4)},uGlow:{value:p.glow??1},uRainbow:{value:1},uPx:{value:600},uMistK:{value:1},uVil:{value:new s.Vector4(410,0,18e3,0)},uLeafA:{value:Y(_($,M<0?N:S,Math.abs(M)*.35))},uLeafB:{value:Y(_(S,$,.25))},uPale:{value:Y(N)},uSky:{value:Y(V)},uScarlet:{value:Y(A)},uBark:{value:Y(g)},uRimRed:{value:I}},be=()=>s.UniformsUtils.merge([s.UniformsLib.fog]),E=(e={})=>Object.assign(be(),R,e),W=[],Pe=[];for(let e=0;e<6;e++){const t=Math.PI/6+e*Math.PI/3;Pe.push({x:Math.sin(t)*60,z:Math.cos(t)*60,radius:20,a:t})}for(let e=0;e<G;e++){const t=Math.PI-w*(G-e)*Math.PI/6,i=Ht-kt*e;W.push({i:e,ang:t,y:i,seed:r(),scale:r.range(.9,1.08),hue:r.range(-1,1),pos:new f(Math.sin(t)*Q,i,Math.cos(t)*Q)})}const m=Xt(),ee=(e=0)=>_(g,[.17,.105,.065],Ie(.3+e,0,1));if(C){const e=Ie((p.trunkArc??180)*Math.PI/180,.5,Math.PI),i=e>Math.PI-.001?56:Math.max(12,Math.round(36*e/2)),n=110,o=-40,a=904,c=.012,u=.4;for(let h=0;h<6;h++){const v=Pe[h],y=m.p.length/3,O=Math.atan2(-Math.cos(v.a),-Math.sin(v.a));for(let P=0;P<=n;P++){const k=ce(o,a,P/n);for(let F=0;F<=i;F++){const j=O+(F/i*2-1)*e,H=Math.cos(j),qe=Math.sin(j),de=Fe(h,j,k),zt=(Fe(h,j+c,k)-Fe(h,j-c,k))/(2*c),Dt=(Fe(h,j,k+u)-Fe(h,j,k-u))/(2*u);let At=H*de+qe*zt,St=-de*Dt,Ct=qe*de-H*zt;const nt=1/Math.hypot(At,St,Ct);m.p.push(v.x+H*de,k,v.z+qe*de),m.n.push(At*nt,St*nt,Ct*nt);const It=Ie((de-17)/6,0,1),Kt=z.n3(H*1.2+h*17.3,k*.011,qe*1.2),st=ee(.25*Kt+.3*It-.2),rt=.42+.58*J(.05,.6,It);m.c.push(st[0]*rt,st[1]*rt,st[2]*rt),m.fx.push(0,0,1,2),m.bs.push(0,0,0)}(P&15)===15&&await l.yield()}const d=i+1;for(let P=0;P<n;P++)for(let k=0;k<i;k++){const F=y+P*d+k;m.i.push(F,F+d,F+1,F+1,F+d,F+d+1)}await l.yield()}}const Ke=new f,ue=new f;for(const e of W){let t=Pe[0],i=1e9;for(const d of Pe){const P=Math.hypot(d.x-e.pos.x,d.z-e.pos.z)+r.range(0,3);P<i&&(i=P,t=d)}ue.set(e.pos.x-t.x,0,e.pos.z-t.z).normalize();const n=new f(t.x+ue.x*16.6,e.y-r.range(7,12),t.z+ue.z*16.6),o=new f(e.pos.x,e.y-1.45*e.scale,e.pos.z),a=n.distanceTo(o),c=n.clone().addScaledVector(ue,a*.45).add(Ke.set(0,-r.range(1,4),0)),u=o.clone().add(Ke.set(-ue.x*2.5,-r.range(4.5,7),-ue.z*2.5)),h=new s.CubicBezierCurve3(n,c,u,o),v=h.getPoints(11),y=r.range(.95,1.25);ne(m,v,d=>y*(1.35-.75*d+.9*Math.pow(d,9)+.5*Math.pow(1-d,6)),7,d=>_(ee(.1),_(S,$,.3),J(.25,.95,d)*.8),d=>[0,0,.5-.5*d,0],d=>[e.i,e.seed,d*d],!1);const O=new f(0,1,0);for(let d=0;d<5;d++){const P=d/5*D+e.seed*6,k=new f(Math.cos(P),-.35,Math.sin(P)).normalize(),F=new f(-Math.sin(P),0,Math.cos(P)),j=m.p.length/3;it(m,o.clone().add(Ke.set(0,-.6,0)),k,F,O,4.6,2.3,_(S,g,.25),0,1);for(let H=j;H<m.p.length/3;H++)m.bs[H*3]=e.i,m.bs[H*3+1]=e.seed,m.bs[H*3+2]=1}(e.i&1)===1&&await l.yield()}await l.yield();const lt=9,Re=e=>J(26,50,Math.abs(e));for(let e=0;e<lt;e++){const t=(e-(lt-1)/2)*1.45,i=e===4?r.sign():Math.sign(t),n=r.range(0,D),o=r.range(.35,.7),a=r.range(.55,.85),c=[];for(let u=-52;u<=52.01;u+=2){const h=Re(u),v=u<0&&e===4?-i:i;c.push(new f(t+o*Math.sin(u*.11+n)*(1-h)+v*h*(8.5+(6-Math.abs(t))*.8),B(u)+.3*Math.sin(u*.17+n*2)+h*h*(5+e*.9),u))}ne(m,c,u=>a*(1+.9*Math.pow(Math.abs(u*2-1),3)+.12*Math.sin(u*60+n)),7,u=>ee(.2*Math.sin(u*23+n)),()=>[0,0,.9,0],null,!1)}{const e=m.p.length/3,t=12,i=52;for(let n=0;n<=i;n++)for(let o=0;o<=t;o++){const a=ce(-52,52,n/i),c=Re(a),h=(6.2+1.6*Math.exp(-((a-te)**2)/40)+.6*z.n2(a*.2,o))*(1-c*.55),v=(o/t*2-1)*h;m.p.push(v,B(a)-.15+.22*z.n2(v*.5,a*.5)-.5*(o/t*2-1)**2,a),m.n.push(0,1,0);const y=_(ee(-.1),S,.35);m.c.push(y[0],y[1],y[2]),m.fx.push(0,0,1.6,0),m.bs.push(0,0,0)}for(let n=0;n<i;n++)for(let o=0;o<t;o++){const a=e+n*(t+1)+o;m.i.push(a,a+t+1,a+1,a+1,a+t+1,a+t+2)}}await l.yield();for(const e of[-1,1])for(const[t,i]of[[-46,te-3],[te+3,46]]){const n=[],o=r.range(0,D);for(let a=t;a<=i+.01;a+=2){const c=Re(a);n.push(new f(e*(6.7+c*6+.3*Math.sin(a*.3+o)),B(a)+1.7+.25*Math.sin(a*.23+o)+c*c*7,a))}ne(m,n,()=>.2,5,()=>ee(.1),()=>[0,0,.8,0],null,!0);for(let a=1;a<n.length-1;a+=2){const c=n[a];ne(m,[c.clone(),new f(c.x-e*.25,c.y-1,c.z+.2),new f(c.x-e*.6,c.y-2.1,c.z)],u=>.12+.08*u,4,()=>ee(0),()=>[0,0,.6,0],null,!1)}}const Lt=_(N,g,.45);for(let e=0;e<120;e++){const t=r.range(-48,48),i=Re(t),n=r.range(-6.5,6.5)*(1+i),o=r.range(5,17)*(r.chance(.15)?1.6:1),a=B(t)-.5,c=r.range(-1.5,1.5),u=[];for(let v=0;v<=5;v++){const y=v/5;u.push(new f(n+c*y*y,a-o*y,t+c*.5*y*y))}const h=r.range(.1,.2);ne(m,u,v=>h*(1.2-.85*v),3,v=>_(ee(0),Lt,v),v=>[v*v*(.6+o*.06),.25*v,0,3],null,!0)}await l.yield();const fe=9.25,Ft=130*Math.PI/180,ct=(e,t,i,n,o,a)=>{const c=(e*2-1)*1.2,u=Ie(c,-1,1),h=Math.sign(c)||1,v=Math.max(Math.abs(c)-1,0)/.2,y=u*Ft,O=Math.sin(y),d=Math.cos(y),P=e*o*D+t/i*D,k=n*(1+.6*v);return a.set(b.x+fe*O+h*(-.9*v+2.3*v*v)+O*Math.cos(P)*k,b.y+fe*d-4.8*v+d*Math.cos(P)*k,b.z+Math.sin(P)*k*1.3+(t-i/2)*.5*v*v)};for(let e=0;e<X;e++){const t=[],i=r.range(.42,.56);for(let n=0;n<=74;n++)t.push(ct(n/74,e,X,.78,K,new f));ne(m,t,n=>i*(1+1.3*Math.pow(Math.abs(n*2-1),7)+.1*Math.sin(n*90+e)),7,n=>ee(.2*Math.sin(n*31+e*2)),()=>[0,0,.55,0],null,!0)}await l.yield();for(let e=0;e<2;e++){const t=[];for(let i=0;i<=90;i++)t.push(ct(.04+.92*i/90,e,2,1.36,-K*2.6,new f));ne(m,t,()=>.15,4,()=>_(S,g,.4),()=>[0,0,.3,0],null,!0)}{const e=new f,t=new f,i=new f,n=new f,o=new f,a=new f,c=r.int(9,14);for(let u=0;u<c;u++){const h=r.range(-1,1)*2,v=Math.sin(h),y=Math.cos(h),O=r.chance(.75)?1:-1;a.set(b.x+(fe+r.range(.7,1.5))*v,b.y+(fe+r.range(.7,1.5))*y,b.z+O*r.range(.6,1.3)),e.set(v*.55,y*.55,O*.8).normalize(),t.set(-y,v,0),i.crossVectors(e,t).normalize();const d=r.range(.9,1.6),P=6,k=r.range(0,D);for(let F=0;F<P;F++){const j=k+F/P*D;n.copy(t).multiplyScalar(Math.cos(j)).addScaledVector(i,Math.sin(j)).addScaledVector(e,.35).normalize(),o.crossVectors(e,n).normalize(),it(m,a,n,o,e,d,d*.7,A,1,1)}ne(m,[a.clone(),a.clone().addScaledVector(e,.45)],()=>.22,5,()=>N,()=>[0,1.6,0,1],null,!0)}for(let u=0;u<9;u++){const h=(u/8-.5)*1.5,v=(u%2?1:-1)*r.range(.2,.9);a.set(b.x+Math.sin(h)*(fe+.6),b.y+Math.cos(h)*(fe+.6),b.z+v*.6),n.set(Math.sin(h)*.9,.75,v).normalize(),o.set(Math.cos(h),-Math.sin(h)*.3,0).normalize(),e.crossVectors(o,n).normalize(),e.z*v<0&&e.negate(),it(m,a,n,o,e,r.range(2.4,4.2),1.2,_($,S,r.range(.1,.7)),0,1)}}await l.yield();const re=new s.BufferGeometry;re.setAttribute("position",new s.Float32BufferAttribute(m.p,3)),re.setAttribute("normal",new s.Float32BufferAttribute(m.n,3)),await l.yield(),re.setAttribute("color",new s.Float32BufferAttribute(m.c,3)),re.setAttribute("aFx",new s.Float32BufferAttribute(m.fx,4)),re.setAttribute("aBs",new s.Float32BufferAttribute(m.bs,3)),await l.yield(),re.setIndex(m.i),await l.yield();const Rt=new s.ShaderMaterial({uniforms:E(),fog:!0,vertexColors:!0,side:s.DoubleSide,vertexShader:`
      #include <fog_pars_vertex>
      uniform float uTime; ${Le}
      attribute vec4 aFx; attribute vec3 aBs; varying vec3 vP,vN,vC; varying vec4 vFx;
      void main(){ vec3 p=position;
        if(aBs.z>0.0){ vec4 cy=basinCycle(aBs.x,aBs.y); p.y-=cy.y*aBs.z; }
        p.x+=aFx.x*sin(uTime*0.9+p.z*0.35+p.y*0.21)*0.9; p.z+=aFx.x*cos(uTime*0.7+p.x*0.3+p.y*0.17)*0.6;
        vP=p; vN=normal; vC=color; vFx=aFx;
        vec4 mvPosition=modelViewMatrix*vec4(p,1.0); gl_Position=projectionMatrix*mvPosition; ${we} }`,fragmentShader:`
      #include <fog_pars_fragment>
      ${ae} ${xe}
      uniform vec3 uLeafA,uLeafB,uPale; uniform vec4 uVil; varying vec3 vP,vN,vC; varying vec4 vFx;
      void main(){ vec3 N=normalize(vN), V=normalize(uCamL-vP); float kind=vFx.w;
        bool soft=kind>0.5&&kind<1.5; if(soft&&dot(N,V)<0.0) N=-N;
        float n1=vn3(vP*vec3(0.8,0.4,0.8)), n2=vn3(vP*vec3(3.3,1.3,3.3)+11.0);
        float fur=abs(vn3(vP*vec3(2.3,0.3,2.3)+3.0)*2.0-1.0), crev=smoothstep(0.02,0.3,fur);
        float plate=smoothstep(0.35,0.65,vn3(vP*vec3(0.5,0.9,0.5)+20.0));
        vec3 alb=vC*(0.72+0.45*n1)*(0.8+0.4*n2)*(0.5+0.5*crev)*(0.85+0.3*plate);
        bool trunk=kind>1.5&&kind<2.5; float D=${ve}.0-vP.y, shelf=0.0, strataLip=0.0, strataUnder=0.0; vec3 Ng=N;
        if(trunk){ float lich=smoothstep(0.55,0.8,vn3(vP*vec3(0.11,0.12,0.11)+40.0)), wetk=smoothstep(0.62,0.9,vn3(vec3(vP.x*0.45,vP.y*0.12,vP.z*0.45)+7.0));
          // plate rings: the bark is laid in storeys, a dark wet seam every 11 m with a shelf of moss standing on it
          float rf=fract(vP.y*0.09+n1*0.5+1.6*vn3(vP*vec3(0.05,0.012,0.05)+9.0)), ring=smoothstep(0.40,0.5,abs(rf-0.5)); shelf=smoothstep(0.06,0.13,rf)*smoothstep(0.44,0.16,rf);
          alb=mix(alb,vec3(dot(alb,vec3(0.4,0.4,0.2))),0.1)*2.3; alb=mix(alb,uPale*0.22*(0.6+0.8*n2),lich*0.45*crev); alb*=(1.0-0.35*wetk)*(1.0-0.3*ring)*(0.8+0.3*smoothstep(0.5,1.0,rf));
          // strata: the wall is laid in courses 13 m high. Each course has its own earth colour, fine bedding lines, a ledge at its
          // top that catches the light from the mouth and an undercut in shadow beneath it, so the fall is measured as it passes
          float kt=mod(floor(atan(vP.x,vP.z+1e-4)/1.0471976)+6.0,6.0), ta=atan(vP.x-60.0*sin((kt+0.5)*1.0471976),vP.z-60.0*cos((kt+0.5)*1.0471976)+1e-4);
          float sy=(vP.y+3.0*sin(kt*2.4))/13.0+0.07*sin(ta*5.0+kt)+0.05*(n1-0.5), sf=fract(sy), sid=floor(sy);
          float hb=fract(sin(sid*12.9898+kt*78.233)*43758.5453), hb2=fract(hb*7.31+0.37);
          vec3 earth=mix(mix(vec3(1.25,0.92,0.6),vec3(0.8,0.72,0.62),hb),mix(vec3(1.35,0.74,0.44),vec3(0.62,0.8,0.6),hb2),0.5*hb2);
          alb*=mix(vec3(1.0),earth,0.75)*(0.82+0.36*hb2);
          float bed=smoothstep(0.34,0.5,abs(fract(sy*5.0+0.3*n1+0.2*hb)-0.5));
          alb*=1.0-0.3*bed*(0.4+0.6*crev);
          float lipW=0.05+0.07*vn3(vec3(ta*2.3,sid*3.7,kt*5.0)), mossK=smoothstep(0.35,0.6,vn3(vec3(ta*3.1+sid,sid*1.7,kt*3.0)));
          strataLip=smoothstep(1.0-lipW-0.05,1.0-lipW,sf); strataUnder=smoothstep(0.52,0.84,sf)*(1.0-strataLip);
          alb=mix(alb,mix(uLeafB,uLeafA,0.35+0.4*n2)*0.7,strataLip*mossK*(0.5+0.5*n1)); shelf=max(shelf,strataLip*0.6*mossK); strataLip*=0.45+0.55*mossK; }
        if(!soft){ N=normalize(N+((n2-0.5)*0.6+(crev-0.6)*0.5)*vec3(N.z,0.3,-N.x));
          float m=clamp(vFx.z,0.0,1.0)*smoothstep(0.52,0.80,N.y*0.5+0.5*n1+0.10*vFx.z)*(0.5+0.5*crev);
          m=max(m,shelf*smoothstep(0.25,0.6,n1+0.3*n2)*0.85);
          alb=mix(alb,mix(uLeafB,uLeafA,n2*0.45)*0.6,m); }
        else alb=vC*(0.75+0.5*n2);
        vec3 amb=ambAt(vP.y); float sun=sunAt(vP), al=dot(amb,vec3(0.3,0.5,0.2)); amb=mix(amb,vec3(al),0.35)*1.2;
        if(!soft) amb=mix(amb,vec3(1.14,1.0,0.84)*al*1.2,trunk?0.66:0.5);              // bark stays umber under green light
        vec3 col=alb*(amb*(0.62+0.38*N.y)+uSunCol*sun*max(N.y*0.85+(trunk?0.42:0.24),0.0));
        if(trunk){ // the key comes down the shaft: faces that look into the well are lit, the flanks toward the gaps fall into a dark crease
          vec2 inr=-normalize(vP.xz+vec2(1e-4,0.0)); float inw=max(dot(N,normalize(vec3(inr.x,0.5,inr.y))),0.0);
          float occ=mix(0.45,1.0,smoothstep(-0.35,0.55,dot(normalize(Ng.xz+vec2(1e-4,0.0)),inr)));
          col=col*occ+alb*uSunCol*uSunGain*0.3*inw*inw*mix(1.0,0.5,smoothstep(0.0,880.0,D));
          col*=1.0-0.62*strataUnder; col+=alb*(amb*0.5+uSunCol*uSunGain*0.34*mix(1.0,0.55,smoothstep(0.0,880.0,D)))*strataLip; }
        if(!soft) col+=alb*vec3(1.0,0.56,0.2)*uVil.y*exp(-max(abs(vP.y-uVil.x)-uVil.w,0.0)*max(abs(vP.y-uVil.x)-uVil.w,0.0)/uVil.z)*(0.55+0.45*max(N.y,0.0));
        float fr=pow(1.0-max(dot(N,V),0.0),3.0); vec3 sp=portalSpill(vP,N);
        col+=amb*fr*0.25+alb*sp*1.2+sp*(fr*0.45+0.06)*(trunk?0.4:1.0)+vC*vFx.y*2.0;
        if(!soft){ float tex=(0.45+0.55*crev)*(0.6+0.8*n2), deep=smoothstep(520.0,860.0,D), low=smoothstep(330.0,150.0,vP.y);
          vec3 Lp=normalize(uPortal-vP+vec3(0.0,1e-3,0.0)); float d2=dot(uPortal-vP,uPortal-vP);
          col+=(vec3(0.014,0.05,0.055)*uHourK*deep+vec3(0.006,0.013,0.014))*tex;                                 // the deep never falls to black
          col+=vec3(0.52,0.82,0.9)*0.16*uHourK*low*tex*(0.12+0.88*fr)*(0.35+0.65*max(dot(N,Lp),0.0));   // cool rim from the glow pool and the ring
          vec3 R=reflect(-V,N); float wst=smoothstep(0.55,0.85,vn3(vec3(vP.x*0.5,vP.y*0.12,vP.z*0.5)+7.0));
          col+=uGlowCol*uGlow*(0.05*max(dot(N,Lp),0.0)*tex+0.22*wst*pow(max(dot(R,Lp),0.0),6.0))*900.0/(900.0+d2); }
        gl_FragColor=vec4(col,1.0); ${ye} }`}),Ee=new s.Mesh(re,Rt);Ee.frustumCulled=!1,L.add(Ee),await l.yield();const vt=new Float32Array(G*4),ut=new Float32Array(G*2),ft=new Float32Array(G);W.forEach((e,t)=>{vt.set([e.ang,e.y,e.i,e.seed],t*4),ut.set([e.scale,e.hue],t*2),ft[t]=t?W[t-1].seed:.5});const He=e=>(e.setAttribute("aInst",new s.InstancedBufferAttribute(vt,4)),e.setAttribute("aVar",new s.InstancedBufferAttribute(ut,2)),e.setAttribute("aPrev",new s.InstancedBufferAttribute(ft,1)),e.instanceCount=G,e),Me=new s.InstancedBufferGeometry;{const e=[0,.16,.34,.52,.68,.82,.91,.96,.995,1.025],t=48,i=[],n=[];for(let o=0;o<e.length;o++)for(let a=0;a<t;a++){const c=a/t*D,u=e[o],h=Math.atan2(Math.sin(c),Math.cos(c)),v=Math.exp(-((h/.7)**2)),y=J(.88,1,u),O=De*u*(1+.014*Math.sin(c*6)*y+.11*v*J(.75,1,u));let d=-1.6*(1-Math.min(u,1)**2)+1.15*y*(1-.95*v)+.1*Math.sin(c*6+1)*y*(1-v);o===e.length-1&&(d-=.16*(1-v)),d-=.35*v*J(.8,1.02,u),i.push(Math.cos(c)*O,d,Math.sin(c)*O)}for(let o=0;o<e.length-1;o++)for(let a=0;a<t;a++){const c=o*t+a,u=(o+1)*t+a,h=o*t+(a+1)%t,v=(o+1)*t+(a+1)%t;o>0&&n.push(c,h,u),n.push(h,v,u)}Me.setAttribute("position",new s.Float32BufferAttribute(i,3)),Me.setIndex(n),Me.computeVertexNormals(),He(Me)}const pt=`
      #include <fog_pars_vertex>
      uniform float uTime; ${Le}
      attribute vec4 aInst; attribute vec2 aVar; attribute float aPrev;
      varying vec3 vL,vP,vN; varying vec4 vI,vCy; varying float vPrev;`,Gt=new s.ShaderMaterial({uniforms:E(),fog:!0,side:s.DoubleSide,vertexShader:`${pt}
      void main(){ vec4 cy=basinCycle(aInst.z,aInst.w); vec3 p=tipRot(position*aVar.x,cy.z); p.y-=cy.y;
        vL=position; vP=stairPlace(p,aInst.x,aInst.y); vN=stairDir(tipRot(normal,cy.z),aInst.x); vI=vec4(aInst.zw,aVar); vCy=cy; vPrev=aPrev;
        vec4 mvPosition=modelViewMatrix*vec4(vP,1.0); gl_Position=projectionMatrix*mvPosition; ${we} }`,fragmentShader:`
      #include <fog_pars_fragment>
      ${ae} ${xe}
      uniform vec3 uLeafA,uLeafB,uPale,uScarlet,uBark; uniform float uRimRed;
      varying vec3 vL,vP,vN; varying vec4 vI,vCy;
      void main(){ vec3 N=normalize(vN), V=normalize(uCamL-vP); float under=step(dot(N,V),0.0); if(under>0.5) N=-N;
        float r=length(vL.xz)/${De}.0, a=atan(vL.z,vL.x)/6.2832+vI.y;
        float fa=abs(fract(a*9.0)-0.5)*2.0, fb=abs(fract(a*18.0+0.25)-0.5)*2.0;
        float w=min((0.05+0.07*(1.0-r))/(r+0.04),1.0);
        float rib=1.0-smoothstep(w*0.45,w,fa); rib=max(rib,(1.0-smoothstep(w*0.5,w*1.2,fb))*smoothstep(0.45,0.6,r)*0.7);
        float web=(1.0-smoothstep(0.0,0.09,abs(fract(r*6.0+0.7*vn3(vec3(vL.xz*0.45,vI.y*7.0)))-0.5)))*0.28*smoothstep(0.1,0.3,r);
        float vein=max(rib,web);
        float n1=vn3(vP*0.55+vI.y*40.0), n2=vn3(vL*2.3+vI.y*17.0);
        vec3 base=mix(uLeafB,uLeafA,clamp(0.1+0.5*n1+0.2*vI.w,0.0,1.0))*(0.74+0.36*n2)*(0.72+0.28*r);
        float wall=smoothstep(-0.1,0.9,vL.y);
        vec3 amb=ambAt(vP.y); float sun=sunAt(vP); vec3 col;
        if(under<0.5){
          vec3 alb=mix(base,uPale*0.7,vein*0.05+0.04*r*r*r)*(1.0-0.14*rib)*(1.0-0.42*smoothstep(0.62,0.97,r))*(0.8+0.2*smoothstep(0.0,0.5,r));
          alb=mix(alb,mix(uScarlet*0.75,uPale*0.6,0.25),uRimRed*smoothstep(0.55,1.0,wall)*0.8);
          float wet=1.0-smoothstep(-1.6+vCy.x*1.9,-1.1+vCy.x*1.9,vL.y);   // damp band just above the water line
          alb*=1.0-0.25*wet;
          col=alb*(amb*(0.7+0.3*N.y)+uSunCol*sun*(0.25+0.75*max(N.y,0.0)));
          float fr=pow(1.0-max(dot(N,V),0.0),4.0);
          col+=amb*fr*0.4+uSunCol*sun*pow(vn3(vL*8.0+vI.y*9.0),15.0)*3.0*n1*(0.3+wet);                 // sky sheen and wet glints
        } else {
          vec3 alb=mix(mix(base*0.6,mix(uScarlet*0.45,uBark,0.35),uRimRed*0.7),uLeafB*0.3,vein*0.6);
          vec3 thru=mix(uLeafA,uPale,0.35)*(1.0-0.4*vein)*(0.75+0.5*n2)*(0.5+0.65*r);        // sun glowing through the blade
          col=alb*amb*(0.75-0.25*N.y)+thru*uSunCol*sun*0.42*(1.0-0.6*wall);
        }
        col+=mix(base,uPale,0.4)*portalSpill(vP,N)*1.2;
        gl_FragColor=vec4(col,1.0); ${ye} }`}),Ye=new s.Mesh(Me,Gt);Ye.frustumCulled=!1,L.add(Ye),await l.yield();const Ge=new s.InstancedBufferGeometry;{const e=[0,.4,.75,1],t=28,i=[],n=[];for(let o=0;o<4;o++)for(let a=0;a<t;a++){const c=a/t*D;i.push(Math.cos(c)*e[o],0,Math.sin(c)*e[o])}for(let o=0;o<3;o++)for(let a=0;a<t;a++){const c=o*t+a,u=(o+1)*t+a,h=o*t+(a+1)%t,v=(o+1)*t+(a+1)%t;o>0&&n.push(c,h,u),n.push(h,v,u)}Ge.setAttribute("position",new s.Float32BufferAttribute(i,3)),Ge.setIndex(n),He(Ge)}const _t=new s.ShaderMaterial({uniforms:E(),fog:!0,side:s.DoubleSide,vertexShader:`${pt}
      void main(){ vec4 cy=basinCycle(aInst.z,aInst.w); float L=max(cy.x,0.3); float h=-1.6+L*1.85;
        float rw=${De}.0*min(sqrt(clamp((h+1.6)/1.6,0.0,1.0)),0.88+0.055*smoothstep(-0.36,0.25,h))*0.985;
        // keep the water on the leaf where the rim drops into the spout: it slopes out over the lip instead of floating
        float rr=length(position.xz)*rw/${De}.0, ph=atan(position.z,position.x+1e-5), sp=exp(-ph*ph*2.04);
        float leafY=-1.6*(1.0-rr*rr)+1.15*smoothstep(0.88,1.0,rr)*(1.0-0.95*sp)-0.35*sp*smoothstep(0.8,1.02,rr);
        h=min(h,leafY+0.06+0.5*(1.0-step(0.01,rr)));
        vec3 p=tipRot(vec3(position.x*rw,h,position.z*rw)*aVar.x,cy.z); p.y-=cy.y;
        vL=vec3(position.x*rw,h,position.z*rw); vP=stairPlace(p,aInst.x,aInst.y); vN=stairDir(tipRot(vec3(0.0,1.0,0.0),cy.z),aInst.x);
        vI=vec4(aInst.zw,aVar); vCy=cy; float pp=cyclePhase(aInst.z-1.0,aPrev);
        vPrev=0.30+0.70*smoothstep(0.68,0.78,pp)*(1.0-smoothstep(0.88,0.99,pp));
        vec4 mvPosition=modelViewMatrix*vec4(vP,1.0); gl_Position=projectionMatrix*mvPosition; ${we} }`,fragmentShader:`
      #include <fog_pars_fragment>
      ${ae} ${xe}
      uniform vec3 uLeafB,uSky,uPale; varying vec3 vL,vP,vN; varying vec4 vI,vCy; varying float vPrev;
      void main(){ vec3 V=normalize(uCamL-vP); float r=length(vL.xz);
        float rip=sin(r*2.6-uTime*5.0+vI.y*20.0)*exp(-r*0.22)*vPrev;
        float n=vn3(vec3(vL.xz*1.3,uTime*0.9+vI.y*9.0));
        vec3 N=normalize(vN+vec3(vL.x,0.0,vL.z)/(r+0.3)*rip*0.16+vec3(n-0.5,0.0,0.5-n)*0.10);
        float fr=0.26+0.74*pow(1.0-abs(dot(N,V)),3.0);
        vec3 amb=ambAt(vP.y); float sun=sunAt(vP);
        vec3 skyc=min(amb*0.8+uSky*(0.25+0.5*dot(amb,vec3(0.33)))*(0.6+0.4*smoothstep(500.0,880.0,vP.y)),vec3(1.1));
        vec3 col=mix(mix(uLeafB,vec3(0.03,0.2,0.24),0.55)*(0.3+0.45*smoothstep(-1.6,0.0,-length(vL.xz)*0.16))*(amb+uSunCol*sun*0.5),skyc,fr);
        col+=uSunCol*sun*(pow(vn3(vec3(vL.xz*6.5,uTime*1.3+vI.y*5.0)),15.0)*5.0*smoothstep(0.58,0.85,n)+0.04);                                       // sun glitter
        col*=1.0+0.3*rip;
        float foam=smoothstep(6.2,1.2,r+2.4*n)*(0.35+0.65*vPrev);                    // where the curtain from above lands
        col=mix(col,whiteWater(vP)*(0.85+0.3*n),clamp(foam+0.3*max(rip,0.0),0.0,0.95));
        col+=uPale*portalSpill(vP,N)*0.8;
        gl_FragColor=vec4(col,1.0); ${ye} }`}),Xe=new s.Mesh(Ge,_t);Xe.frustumCulled=!1,L.add(Xe),await l.yield();const Ze=e=>e<G-1?kt+.6:W[e].y-B(-Q)-.4,Je=`
    float pourOf(float ph){ return 0.30+0.70*smoothstep(0.60,0.70,ph)*(1.0-smoothstep(0.80,0.93,ph)); }
    vec3 lipAt(float phi){ float e=exp(-phi*phi*2.04); return vec3(cos(phi)*10.25*(1.0+0.11*e),1.1*(1.0-0.95*e)-0.35*e-0.1,sin(phi)*10.25*(1.0+0.11*e)); }`,ze=new s.InstancedBufferGeometry;{const i=[],n=[];for(let o=0;o<=14;o++)for(let a=0;a<=8;a++)i.push(a/8*2-1,o/14,0);for(let o=0;o<14;o++)for(let a=0;a<8;a++){const c=o*9+a;n.push(c,c+8+1,c+1,c+1,c+8+1,c+8+2)}ze.setAttribute("position",new s.Float32BufferAttribute(i,3)),ze.setIndex(n),He(ze),ze.setAttribute("aFall",new s.InstancedBufferAttribute(new Float32Array(G).map((o,a)=>Ze(a)),1))}const Tt=new s.ShaderMaterial({uniforms:E(),fog:!0,side:s.DoubleSide,transparent:!0,depthWrite:!1,vertexShader:`
      #include <fog_pars_vertex>
      uniform float uTime; ${Le} ${Je}
      attribute vec4 aInst; attribute vec2 aVar; attribute float aFall;
      varying vec3 vP; varying vec2 vUv; varying float vPour,vSeed,vFall;
      void main(){ vec4 cy=basinCycle(aInst.z,aInst.w); float u=position.x, t=position.y;
        vec3 l0=lipAt(u*0.52)*aVar.x; vec3 l1=tipRot(l0,cy.z); l1.y-=cy.y;
        vec3 p=mix(l1,l0,smoothstep(0.0,0.5,t));
        float pr=pourOf(fract(cyclePhase(aInst.z,aInst.w)-0.2*t));
        p.x+=(2.3+2.0*pr)*t*sqrt(aFall/13.0)+0.5*sin(t*5.0+uTime*1.7+aInst.w*20.0)*t*t;
        p.y-=aFall*t*t+0.5*t; p.z*=1.0-0.08*t; p.z+=0.6*sin(t*4.0+uTime*1.3+aInst.w*31.0)*t*t;
        vP=stairPlace(p,aInst.x,aInst.y); vUv=vec2(u,t); vPour=pr; vSeed=aInst.w; vFall=aFall;
        vec4 mvPosition=modelViewMatrix*vec4(vP,1.0); gl_Position=projectionMatrix*mvPosition; ${we} }`,fragmentShader:`
      #include <fog_pars_fragment>
      ${ae} ${xe}
      uniform vec3 uSky; varying vec3 vP; varying vec2 vUv; varying float vPour,vSeed,vFall;
      void main(){ float u=vUv.x, v=vUv.y, k=vFall/13.0;
        float streak=vn3(vec3(u*6.0+vSeed*30.0,v*2.2*k-uTime*1.9,vSeed*9.0));
        float fine=vn3(vec3(u*26.0+vSeed*11.0,v*4.5*k-uTime*4.3,3.0));
        float body=streak*0.62+fine*0.38;
        float rag=vn3(vec3(v*3.0*k-uTime*1.2,vSeed*17.0,u*1.5));
        float edge=1.0-smoothstep(0.66,1.0,abs(u)/(0.9+0.1*vPour)+0.16*(rag-0.5)*v);
        float core=smoothstep(0.34,0.72,body+(1.0-v)*0.12+0.12*vPour);                 // bright threads inside the sheet
        float a=mix(0.78,0.36,v)*(0.62+0.38*core)*edge*smoothstep(0.0,0.02,v)*(1.0-smoothstep(0.93,1.0,v));
        vec3 col=whiteWater(vP)*(0.72+0.55*core+0.25*fine*vPour)+uGlowCol*uGlow*14.0/(60.0+dot(uPortal-vP,uPortal-vP));
        gl_FragColor=vec4(col,a); ${ye} }`}),_e=new s.Mesh(ze,Tt);_e.frustumCulled=!1,_e.renderOrder=2,L.add(_e),await l.yield();const Qe=64,Te=G*Qe,ht=new Float32Array(Te*4),mt=new Float32Array(Te*4),dt=new Float32Array(Te*3);for(let e=0;e<G;e++)for(let t=0;t<Qe;t++){const i=e*Qe+t,n=W[e];ht.set([n.ang,n.y,n.i,n.seed],i*4),mt.set([r(),r(),r(),r()],i*4),dt.set([t<34?0:1,Ze(e),n.scale],i*3)}const Ae=new s.BufferGeometry;Ae.setAttribute("position",new s.Float32BufferAttribute(new Float32Array(Te*3),3)),Ae.setAttribute("aInst",new s.BufferAttribute(ht,4)),Ae.setAttribute("aRnd",new s.BufferAttribute(mt,4)),Ae.setAttribute("aK",new s.BufferAttribute(dt,3));const Vt=new s.ShaderMaterial({uniforms:E(),fog:!0,transparent:!0,depthWrite:!1,vertexShader:`
      #include <fog_pars_vertex>
      uniform float uTime,uPx; ${Le} ${Je}
      attribute vec4 aInst,aRnd; attribute vec3 aK; varying vec3 vP; varying float vA;
      void main(){ vec4 cy=basinCycle(aInst.z,aInst.w); float ph=cyclePhase(aInst.z,aInst.w); vec3 p; float sz;
        if(aK.x<0.5){ float t=fract(uTime*0.85+aRnd.z*7.0)*(0.7+0.7*aRnd.w);
          p=vec3(14.6+(aRnd.x-0.5)*3.5,-aK.y+0.4,(aRnd.y-0.5)*9.0)+vec3((aRnd.x-0.5)*7.0,3.0+6.5*aRnd.w,(aRnd.y-0.5)*8.0)*t; p.y-=4.9*t*t;
          vA=(0.35+0.65*pourOf(fract(ph-0.2)))*(1.0-t*0.6); sz=0.26+0.3*aRnd.z;
        } else { float q=fract(ph-0.82), t=q/uRate, a=aRnd.x*6.2832;
          p=vec3(cos(a)*10.3,0.9,sin(a)*10.3)*aK.z+vec3(cos(a)*(1.5+2.5*aRnd.y),5.5+5.0*aRnd.w,sin(a)*(1.5+2.5*aRnd.y))*t; p.y-=4.9*t*t+cy.y;
          vA=smoothstep(0.0,0.08,t)*(1.0-smoothstep(1.1,2.0,t)); sz=0.3+0.26*aRnd.z; }
        vP=stairPlace(p,aInst.x,aInst.y); vec4 mvPosition=modelViewMatrix*vec4(vP,1.0); gl_Position=projectionMatrix*mvPosition;
        float px=sz*uPx/max(-mvPosition.z,0.5); vA*=clamp(px/1.6,0.25,1.0); gl_PointSize=clamp(px,1.6,48.0); ${we} }`,fragmentShader:`
      #include <fog_pars_fragment>
      ${ae} ${xe}
      uniform vec3 uSky; varying vec3 vP; varying float vA;
      void main(){ float d=length(gl_PointCoord-0.5); float a=smoothstep(0.5,0.12,d)*vA; if(a<0.01) discard;
        vec3 col=whiteWater(vP)*1.25+uGlowCol*uGlow*20.0/(60.0+dot(uPortal-vP,uPortal-vP));
        gl_FragColor=vec4(col,a); ${ye} }`}),Ve=new s.Points(Ae,Vt);Ve.frustumCulled=!1,Ve.renderOrder=3,L.add(Ve),await l.yield();const Se=[];for(const e of W){const t=Ze(e.i),i=e.ang,n=[w*Math.cos(i),-w*Math.sin(i)];Se.push([Math.sin(i)*Q+n[0]*14.6,e.y-t+1.2,Math.cos(i)*Q+n[1]*13.8,e.i===G-1?13:6.5,e.seed,e.i,e.seed,e.i===G-1?.5:.27])}for(let e=0;e<14;e++){const t=r.range(0,D),i=r.range(10,36);Se.push([Math.sin(t)*i,ke+r.range(-6,22),Math.cos(t)*i-6,r.range(14,26),r(),-1,0,r.range(.035,.075)])}const pe=new s.InstancedBufferGeometry;pe.setAttribute("position",new s.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),pe.setIndex([0,1,2,0,2,3]),pe.setAttribute("iPos",new s.InstancedBufferAttribute(new Float32Array(Se.flatMap(e=>e.slice(0,4))),4)),pe.setAttribute("iPar",new s.InstancedBufferAttribute(new Float32Array(Se.flatMap(e=>e.slice(4,8))),4)),pe.instanceCount=Se.length;const Nt=new s.ShaderMaterial({uniforms:E(),fog:!0,transparent:!0,depthWrite:!1,vertexShader:`
      #include <fog_pars_vertex>
      uniform float uTime,uMistK; ${Le} ${Je}
      attribute vec4 iPos,iPar; varying vec3 vP; varying vec2 vUv; varying float vA,vSeed;
      void main(){ float k=iPar.y<-0.5?uMistK:pourOf(fract(cyclePhase(iPar.y,iPar.z)-0.2));
        vec3 c=iPos.xyz; if(iPar.y<-0.5){ c.x+=sin(uTime*0.11+iPar.x*40.0)*5.0; c.y+=sin(uTime*0.07+iPar.x*17.0)*3.0; }
        vP=c; vUv=position.xy; vA=iPar.w*(0.45+0.55*k); vSeed=iPar.x;
        vec4 mvPosition=modelViewMatrix*vec4(c,1.0); mvPosition.xy+=position.xy*iPos.w*(0.85+0.3*k);
        vA*=smoothstep(iPos.w*0.4,iPos.w*2.2,-mvPosition.z);
        gl_Position=projectionMatrix*mvPosition; ${we} }`,fragmentShader:`
      #include <fog_pars_fragment>
      ${ae} ${xe}
      uniform vec3 uSky; varying vec3 vP; varying vec2 vUv; varying float vA,vSeed;
      void main(){ float d=length(vUv); float n=vn3(vec3(vUv*1.7+vSeed*30.0,uTime*0.35+vSeed*9.0));
        float a=smoothstep(1.0,0.15,d+0.35*(n-0.5))*(0.45+0.75*n)*vA; if(a<0.004) discard;
        vec3 col=mix(waterLight(vP)*0.8,whiteWater(vP)*0.9,vA>0.08?0.7:0.3)+uGlowCol*uGlow*7.0/(80.0+dot(uPortal-vP,uPortal-vP));
        gl_FragColor=vec4(col,a); ${ye} }`}),Ne=new s.Mesh(pe,Nt);Ne.frustumCulled=!1,Ne.renderOrder=4,L.add(Ne),await l.yield();const Bt=(p.rainbowAngle??24)*Math.PI/180,Ut=p.rainbowMinRadius??20,xt=1.5,wt=46,$t=new s.ShaderMaterial({uniforms:{uRainbow:R.uRainbow,uTime:R.uTime,uMoon:{value:p.moonbow?1:0}},transparent:!0,depthWrite:!1,depthTest:!0,blending:s.AdditiveBlending,side:s.DoubleSide,fog:!1,vertexShader:"varying vec2 vUv; void main(){ vUv=position.xy; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:`
      ${ae}
      uniform float uRainbow,uTime,uMoon; varying vec2 vUv;
      vec3 spec(float t){ float h=mix(0.70,0.0,clamp(t,0.0,1.0)); vec3 c=clamp(abs(fract(h+vec3(0.0,0.6667,0.3333))*6.0-3.0)-1.0,0.0,1.0);
        c=c*c*(0.55+0.45*c); c+=vec3(0.10,0.02,0.0)*smoothstep(0.6,1.0,t); c*=1.0-0.45*smoothstep(0.25,0.0,t); return mix(c,vec3(dot(c,vec3(0.33))),0.06); }
      float band(float x){ return smoothstep(-1.3,-0.55,x)*(1.0-smoothstep(0.55,1.3,x)); }
      void main(){ float r=length(vUv)*${xt.toFixed(2)}; if(r>1.48) discard; float ang=atan(vUv.y,vUv.x);
        float x1=(r-1.0)/0.075, x2=(r-1.27)/0.08;
        vec3 col=spec(x1*0.5+0.5)*band(x1)*0.62+spec(0.5-x2*0.5)*band(x2)*0.13;
        col+=vec3(0.75,0.85,0.9)*0.028*(1.0-smoothstep(0.8,0.93,r))*smoothstep(0.0,0.8,r);     // bright inside the bow
        float sh=0.72+0.28*vn3(vec3(cos(ang)*3.0,sin(ang)*3.0,uTime*0.25))+0.10*sin(ang*3.0+uTime*0.4);  // spray is uneven
        col=mix(col,vec3(dot(col,vec3(0.4,0.45,0.35)))*vec3(0.8,0.95,1.1),uMoon*0.3);
        gl_FragColor=vec4(col*sh*uRainbow,1.0); }`}),ie=new s.Mesh(new s.PlaneGeometry(2,2),$t);ie.frustumCulled=!1,ie.renderOrder=6,L.add(ie);const Wt=`varying vec2 vUv; varying vec3 vW;
    void main(){ vUv=uv*2.0-1.0; vec4 w=modelMatrix*vec4(position,1.0); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`,Be=(e,t)=>new s.ShaderMaterial({uniforms:{uGlow:R.uGlow,uGlowCol:R.uGlowCol,uTime:R.uTime,uK:{value:t},uSeat:{value:b.clone()}},transparent:!0,depthWrite:!1,blending:s.AdditiveBlending,side:s.DoubleSide,fog:!1,vertexShader:e==="halo"?"varying vec2 vUv; varying vec3 vW; void main(){ vUv=position.xy; vW=vec3(0.0); vec4 mv=modelViewMatrix*vec4(0.0,0.0,0.0,1.0); mv.xy+=position.xy*19.0; gl_Position=projectionMatrix*mv; }":e==="column"?`uniform vec3 uSeat; varying vec2 vUv; varying vec3 vW;
          void main(){ vec3 c=(modelMatrix*vec4(uSeat,1.0)).xyz; vec2 dx=cameraPosition.xz-c.xz+vec2(1e-3,0.0); vec2 rt=vec2(-dx.y,dx.x)/length(dx);
            float t=position.y*0.5+0.5; vec3 w=c+vec3(rt.x,0.0,rt.y)*(position.x*(3.0+2.5*t))+vec3(0.0,6.0+t*62.0,0.0);
            vUv=vec2(position.x,t); vW=w; gl_Position=projectionMatrix*viewMatrix*vec4(w,1.0); }`:Wt,fragmentShader:`
      ${ae}
      uniform float uGlow,uTime,uK; uniform vec3 uGlowCol; varying vec2 vUv; varying vec3 vW;
      void main(){ float a;
      ${e==="halo"?`float d=length(vUv); float n=vn3(vec3(vUv*7.0,uTime*0.5));
        a=exp(-d*d*5.5)*(0.8+0.3*n)+0.25*exp(-d*d*40.0); a*=(1.0-smoothstep(0.8,1.0,d))*0.55;`:e==="column"?`float x=vUv.x, t=vUv.y; a=1.0-x*x; a*=a*smoothstep(0.0,0.12,t)*(1.0-t)*(1.0-t);
        a*=0.55+0.9*vn3(vec3(x*2.0,t*5.0-uTime*0.25,uTime*0.2));`:`vec3 V=normalize(cameraPosition-vW); float up=mix(0.3,1.0,smoothstep(0.12,0.7,V.y));       // seen from above it is a beacon, along the deck only a sheen
        ${e==="strip"?`float x=vUv.x, n=vn3(vec3(vW.x*0.9,vW.z*0.28,uTime*0.35)), g=vn3(vec3(vW.x*3.1,vW.z*1.3,uTime*0.9));
        a=exp(-x*x*3.4)*(0.22+0.78*exp(-(vW.z+26.0)*(vW.z+26.0)/1500.0))*smoothstep(-1.0,-0.8,vUv.y)*smoothstep(1.0,0.72,vUv.y)*(0.5+0.8*n+0.9*g*g*g)*up;`:`float d=length(vUv), n=vn3(vec3(vUv*7.0,uTime*0.5));
        a=(0.62*exp(-d*d*4.2)*(0.7+0.5*n)+2.1*exp(-d*d*38.0))*(1.0-smoothstep(0.8,1.0,d))*up;`}`}
        gl_FragColor=vec4(uGlowCol*uGlow*uK*a,1.0); }`}),he=new s.Mesh(new s.PlaneGeometry(2,2),Be("pool",.3));he.rotation.x=-Math.PI/2,he.scale.set(18,27,1),he.position.set(0,B(te)+1.3,te+9),he.renderOrder=5,L.add(he);const Ue=new s.BufferGeometry;{const e=[],t=[],i=[];for(let o=0;o<=18;o++){const a=ce(-44,48,o/18);for(const c of[-1,1])e.push(c*5.6,B(a)+1.45,a),t.push(c*.5+.5,o/18)}for(let o=0;o<18;o++){const a=o*2;i.push(a,a+1,a+2,a+1,a+3,a+2)}Ue.setAttribute("position",new s.Float32BufferAttribute(e,3)),Ue.setAttribute("uv",new s.Float32BufferAttribute(t,2)),Ue.setIndex(i)}const $e=new s.Mesh(Ue,Be("strip",.3));$e.frustumCulled=!1,$e.renderOrder=5,L.add($e);const We=new s.Mesh(new s.PlaneGeometry(2,2),Be("column",.085));We.frustumCulled=!1,We.renderOrder=5,L.add(We);const me=new s.Mesh(new s.PlaneGeometry(2,2),Be("halo",.15));me.position.copy(b),me.frustumCulled=!1,me.renderOrder=5,me.visible=p.halo!==!1,L.add(me);const et=Math.PI/180,yt=15,tt=e=>{const t=1-J(50,110,e),i=ce(yt,26.9,t),n=w*(-48*et-(e-50)*(15*et/27));return new f(Math.sin(n)*i,e,Math.cos(n)*i)},at=[260,215,170,135,105,82,64,50].map(tt);for(const[e,t]of[[45,46],[90,42.8],[135,40.4],[180,38.9]]){const i=e*et;at.push(new f(w*(-10-10*Math.cos(i)),t,18+10*Math.sin(i)))}at.push(new f(0,b.y+.1,4),b.clone());const Oe=W[8],gt=Q-10.6*Oe.scale-4,Ot={portalSeat:{position:b.clone(),normal:new f(0,0,1),radius:Yt},flyThrough:at,helix:{radius:yt,hand:w,pointAt:tt},basinAt:e=>{const t=W[Ie(e|0,0,G-1)];return{position:t.pos.clone(),angle:t.ang,y:t.y}},basinCount:G,closePass:new f(Math.sin(Oe.ang)*gt,Oe.y+3,Math.cos(Oe.ang)*gt),trunks:Pe.map(e=>({x:e.x,z:e.z,radius:e.radius})),bridge:{y:ke,halfWidth:6.5,z0:-52,z1:52,deckY:B},rainbowCentre:b.clone(),viewpoints:{rim:new f(0,ve+8,34),stairFromAxis:new f(0,640,0),ringReveal:tt(300),bridgeApproach:new f(0,b.y+.4,30)},topY:ve,bottomY:ke,lastCurtain:new f(0,ke,-Q)},bt=new s.Matrix4,je=new f,Z=new f,ot=new f,Ce=new f,Pt=new s.Vector2,jt=new s.Matrix4;let qt=null;const le={object:L,radius:62,height:ve,center:new f(0,ve/2,0),anchors:Ot,ground:!1,groundY:0,uniforms:R,parts:{wood:Ee,leaves:Ye,pools:Xe,curtains:_e,drops:Ve,mist:Ne,rainbow:ie,poolGlow:he,strip:$e,column:We,halo:me},info:{hand:w,basins:G,buildMs:0,stairRadius:Q,seeds:W.map(e=>e.seed),scales:W.map(e=>e.scale)},setProgress(e){qt=e,R.uRainbow.value=J(.58,.8,e),R.uGlow.value=(p.glow??1)*(.45+.55*J(.5,.68,e))},update(e,t,i){R.uTime.value=t,L.updateMatrixWorld(),bt.copy(L.matrixWorld).invert(),je.setFromMatrixPosition(i.matrixWorld).applyMatrix4(bt),R.uCamL.value.copy(je),l.renderer.getDrawingBufferSize(Pt),R.uPx.value=Pt.y*i.projectionMatrix.elements[5]*.5,Z.subVectors(je,b);const n=Z.length();n<.01?Z.set(0,0,1):Z.multiplyScalar(1/n);const o=Math.min(n+30,wt);ie.position.copy(je).addScaledVector(Z,-o),Ce.set(0,1,0),Math.abs(Z.y)>.98&&Ce.set(0,0,-1),ot.crossVectors(Ce,Z).normalize(),Ce.crossVectors(Z,ot),ie.quaternion.setFromRotationMatrix(jt.makeBasis(ot,Ce,Z)),ie.scale.setScalar(Math.max(o<wt?Ut:0,Math.tan(Bt)*o)*xt)},dispose(){}},Mt=p.preview;if(Mt){const e=/^([a-z]+)(\d+)?$/.exec(Mt)||[],t=e[2]?Number(e[2]):0;e[1]==="in"?Object.assign(le,{radius:.01,height:110,center:new f(0,t||700,0)}):e[1]==="mid"?Object.assign(le,{radius:40,height:120,center:new f(0,t||480,0)}):e[1]==="top"?Object.assign(le,{radius:30,height:60,center:new f(0,t||860,0)}):e[1]==="ring"?Object.assign(le,{radius:.01,height:t||240,center:b.clone()}):e[1]==="basin"?Object.assign(le,{radius:5,height:16,center:W[t||12].pos.clone()}):e[1]==="bottom"&&Object.assign(le,{radius:11.7,height:34,center:new f(0,b.y+1,te+4)})}return le}export{Le as GL_CYCLE,Qt as GL_TRUNK,e0 as buildHero,Fe as trunkRadius};
