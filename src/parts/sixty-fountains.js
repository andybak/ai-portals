import*as u from"three";const Be=["#0E1C18","#6B5B45","#5C9AD4","#F3F8FB","#F07A1C","#B4261C","#E8BC2A"],ce=Math.tan(Math.PI/3),ue=.5,he=Math.sin(Math.PI/3),Te=m=>{const a=new u.Color(m);return[a.r,a.g,a.b]},N=(m,a)=>[m[0]*a,m[1]*a,m[2]*a],St=(m,a,t)=>[m[0]+(a[0]-m[0])*t,m[1]+(a[1]-m[1])*t,m[2]+(a[2]-m[2])*t];class jt{constructor(a=0){this.p=[],this.n=[],this.c=[],this.e=[],this.nExtra=a,this.ex=[0,0,0,0],this.m=null,this._v=new u.Vector3}get tris(){return this.p.length/9}tp(a){if(!this.m)return a;const t=this._v.set(a[0],a[1],a[2]).applyMatrix4(this.m);return[t.x,t.y,t.z]}vert(a,t,W,B,K,X){this.p.push(a[0],a[1],a[2]),this.n.push(t,W,B),this.c.push(K[0]*X,K[1]*X,K[2]*X);for(let A=0;A<this.nExtra;A++)this.e.push(this.ex[A])}tri(a,t,W,B,K=1,X=1,A=1,S=null){a=this.tp(a),t=this.tp(t),W=this.tp(W);const st=t[0]-a[0],E=t[1]-a[1],R=t[2]-a[2],D=W[0]-a[0],Z=W[1]-a[1],F=W[2]-a[2];let s=E*F-R*Z,$=R*D-st*F,v=st*Z-E*D;const b=Math.hypot(s,$,v)||1;s/=b,$/=b,v/=b,S&&(this.ex=S[0]),this.vert(a,s,$,v,B,K),S&&(this.ex=S[1]),this.vert(t,s,$,v,B,X),S&&(this.ex=S[2]),this.vert(W,s,$,v,B,A)}quad(a,t,W,B,K,X=1,A=1,S=1,st=1,E=null){this.tri(a,t,W,K,X,A,S,E&&[E[0],E[1],E[2]]),this.tri(a,W,B,K,X,S,st,E&&[E[0],E[2],E[3]])}box(a,t,W,B,K,X,A,S={}){const st=S.ry||0,E=S.tx??1,R=S.tz??1,D=S.gb??.78,Z=S.top??1.06,F=S.lean||[0,0],s=Math.cos(st),$=Math.sin(st),v=B/2,b=K/2,p=X/2,C=(J,Y,Q)=>[a+J*s+Q*$,t+Y,W-J*$+Q*s],z=C(-v,-b,-p),j=C(v,-b,-p),et=C(v,-b,p),ot=C(-v,-b,p),P=C(-v*E+F[0],b,-p*R+F[1]),y=C(v*E+F[0],b,-p*R+F[1]),g=C(v*E+F[0],b,p*R+F[1]),k=C(-v*E+F[0],b,p*R+F[1]);this.quad(ot,et,g,k,A,D,D,1,1),this.quad(j,z,P,y,A,D,D,1,1),this.quad(et,j,y,g,A,D,D,1,1),this.quad(z,ot,k,P,A,D,D,1,1),this.quad(k,g,y,P,A,Z,Z,Z,Z),S.noBottom||this.quad(z,j,et,ot,A,D*.7,D*.7,D*.7,D*.7)}beam(a,t,W,B,K,X={}){const A=new u.Vector3(t[0]-a[0],t[1]-a[1],t[2]-a[2]),S=A.length()||1;A.divideScalar(S);const st=Math.abs(A.y)>.95?new u.Vector3(1,0,0):new u.Vector3(0,1,0),E=new u.Vector3().crossVectors(A,st).normalize(),R=new u.Vector3().crossVectors(E,A).normalize(),D=(et,ot,P)=>[et[0]+E.x*ot*W/2+R.x*P*B/2,et[1]+E.y*ot*W/2+R.y*P*B/2,et[2]+E.z*ot*W/2+R.z*P*B/2],Z=D(a,-1,-1),F=D(a,1,-1),s=D(a,1,1),$=D(a,-1,1),v=D(t,-1,-1),b=D(t,1,-1),p=D(t,1,1),C=D(t,-1,1),z=X.gb??.8,j=X.k1??1;this.quad(Z,v,b,F,K,z,z*j,z*j,z),this.quad(s,p,C,$,K,1.05,1.05*j,1.05*j,1.05),this.quad(F,b,p,s,K,.92,.92*j,j,1),this.quad($,C,v,Z,K,1,j,.92*j,.92),X.noCaps||(this.quad(Z,F,s,$,K,z,z,1,1),this.quad(b,v,C,p,K,z,z,1,1))}cyl(a,t,W,B,K,X,A={}){a=this.tp(a),t=this.tp(t);const S=new u.Vector3(t[0]-a[0],t[1]-a[1],t[2]-a[2]).normalize(),st=Math.abs(S.y)>.95?new u.Vector3(1,0,0):new u.Vector3(0,1,0),E=new u.Vector3().crossVectors(S,st).normalize(),R=new u.Vector3().crossVectors(E,S).normalize(),D=A.k0??1,Z=A.k1??1,F=[];for(let v=0;v<=K;v++){const b=v/K*Math.PI*2,p=Math.cos(b),C=Math.sin(b);F.push([E.x*p+R.x*C,E.y*p+R.y*C,E.z*p+R.z*C])}const s=(v,b,p)=>[v[0]+p[0]*b,v[1]+p[1]*b,v[2]+p[2]*b],$=this.m;this.m=null;for(let v=0;v<K;v++){const b=F[v],p=F[v+1],C=s(a,W,b),z=s(a,W,p),j=s(t,B,p),et=s(t,B,b),ot=.82+.18*b[1],P=.82+.18*p[1];if(this.vert(C,b[0],b[1],b[2],X,D*ot),this.vert(j,p[0],p[1],p[2],X,Z*P),this.vert(z,p[0],p[1],p[2],X,D*P),this.vert(C,b[0],b[1],b[2],X,D*ot),this.vert(et,b[0],b[1],b[2],X,Z*ot),this.vert(j,p[0],p[1],p[2],X,Z*P),A.cap){const y=A.capCol||X;this.vert(a,-S.x,-S.y,-S.z,y,.8),this.vert(C,-S.x,-S.y,-S.z,y,1),this.vert(z,-S.x,-S.y,-S.z,y,1),this.vert(t,S.x,S.y,S.z,y,.8),this.vert(j,S.x,S.y,S.z,y,1),this.vert(et,S.x,S.y,S.z,y,1)}}this.m=$}build(){const a=new u.BufferGeometry;return a.setAttribute("position",new u.Float32BufferAttribute(this.p,3)),a.setAttribute("normal",new u.Float32BufferAttribute(this.n,3)),a.setAttribute("color",new u.Float32BufferAttribute(this.c,3)),this.nExtra&&a.setAttribute("aX",new u.Float32BufferAttribute(this.e,this.nExtra)),a.computeBoundingSphere(),a}async buildSlowly(a){const t=new u.BufferGeometry;return t.setAttribute("position",new u.Float32BufferAttribute(this.p,3)),await a.yield(),t.setAttribute("normal",new u.Float32BufferAttribute(this.n,3)),await a.yield(),t.setAttribute("color",new u.Float32BufferAttribute(this.c,3)),await a.yield(),this.nExtra&&(t.setAttribute("aX",new u.Float32BufferAttribute(this.e,this.nExtra)),await a.yield()),t.computeBoundingSphere(),t}}const Lt=(m,a,t,W)=>{const B=Math.sin(m*12.9898+a*78.233+t*37.719+W*4.137)*43758.5453;return B-Math.floor(B)};function ve(m,a,t,W,B,K,X=8,A=1){const S=v=>Lt(a,t,W,v),st=B/.65,E=(S(1)-.5)*.09,R=t-.22,D=v=>[a+st*v,R-v,W+E*v],Z=(.6+(K-.7)*.83)*A,F=N([.86,.84,.76],Z),s=N(St([.86,.84,.76],[.5,.58,.36],.8),Z*(.92+.16*S(2)));m.cyl(D(0),D(.06),.035,.075,X,s,{k0:.85}),m.cyl(D(.06),D(.39),.075,.06,X,F,{k0:.94}),m.cyl(D(.39),D(.65),.06,.012,X,F,{k1:.84});const $=S(3)*3.1416;for(let v=0;v<3;v++){const b=$+v*1.047+(S(4+v)-.5)*.4,p=Math.cos(b),C=Math.sin(b),z=.014,j=.034+.02*S(7+v),et=N([.2,.3,.1],(.8+.5*S(10+v))*A);m.quad([a-p*z,t+.03,W-C*z],[a+p*z,t+.03,W+C*z],[a+p*j,R+.012,W+C*j],[a-p*j,R+.012,W-C*j],et,1.3,1.3,.8,.8)}}function me(m,a,t,W,B=7,K=1,X=3){const A=new u.Vector3(t[0]-a[0],t[1]-a[1],t[2]-a[2]).normalize(),S=Math.abs(A.y)>.95?new u.Vector3(1,0,0):new u.Vector3(0,1,0),st=new u.Vector3().crossVectors(A,S).normalize(),E=new u.Vector3().crossVectors(st,A).normalize(),R=[],D=Lt(a[0],a[1],a[2],1)*6.2832;for(let p=0;p<=B;p++){const C=D+p/B*6.2832,z=Math.cos(C),j=Math.sin(C);R.push([st.x*z+E.x*j,st.y*z+E.y*j,st.z*z+E.z*j])}const Z=(p,C,z)=>[p[0]+z[0]*C,p[1]+z[1]*C,p[2]+z[2]*C],F=N(W,K),s=.05,$=.035,v=N(F,.6);for(let p=0;p<B;p++){const C=R[p],z=R[p+1],j=p%2?1.12:.88,et=Z(a,s,C),ot=Z(a,s,z),P=Z(t,$,z),y=Z(t,$,C);m.vert(et,C[0],C[1],C[2],F,j),m.vert(P,z[0],z[1],z[2],F,j*.9),m.vert(ot,z[0],z[1],z[2],F,j),m.vert(et,C[0],C[1],C[2],F,j),m.vert(y,C[0],C[1],C[2],F,j*.9),m.vert(P,z[0],z[1],z[2],F,j*.9),X>2&&(m.vert(t,A.x,A.y,A.z,v,.8),m.vert(P,A.x,A.y,A.z,v,1),m.vert(y,A.x,A.y,A.z,v,1))}const b=N([.8,.72,.5],.7*K);for(let p=0;p<X;p++){const C=Math.floor(p*B/X),z=R[C],j=R[C+1],et=.015+.03*Lt(a[0],a[1],a[2],2+p),ot=.07+.05*Lt(a[0],a[1],a[2],5+p),P=Z(a,s,z),y=Z(a,s,j),g=[P[0]+z[0]*et-A.x*ot,P[1]+z[1]*et-A.y*ot,P[2]+z[2]*et-A.z*ot],k=[y[0]+j[0]*et*.6-A.x*ot*.85,y[1]+j[1]*et*.6-A.y*ot*.85,y[2]+j[2]*et*.6-A.z*ot*.85];m.quad(P,y,k,g,b,.75,.75,1.15,1.2)}}const Nt=`
float sfHash(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p+34.345); return fract(p.x*p.y); }
float sfN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(sfHash(i), sfHash(i+vec2(1.,0.)), f.x), mix(sfHash(i+vec2(0.,1.)), sfHash(i+vec2(1.,1.)), f.x), f.y); }
float sfFbm(vec2 p){ return 0.5*sfN(p) + 0.3*sfN(p*2.07+13.1) + 0.2*sfN(p*4.3+41.7); }
`,de=`
uniform float uTime; uniform float uProg[NG]; uniform vec3 uWind; uniform float uBufH;
const float GR = 9.8;
vec3 sfTraj(vec3 gun, mat3 rot, vec4 a, vec4 b, float t, float Tap, float drift, vec2 e){      // e: the gun's own sweep rate (rad/s), and how far its fall is carried down-wind
  float launch = uTime - t;
  float az = a.x + b.x*sin(launch*e.x + b.y) + b.w + 0.022*b.z*sin(launch*2.7 + a.w*40.);
  float pulse = 1. + 0.026*sin(launch*4.3 + a.w*17.) + 0.012*sin(launch*9.7 + a.w*5.);
  float h = a.y*pulse*(1. - exp(-1.0*t/Tap));
  float y = GR*Tap*pulse*t - 0.5*GR*t*t;
  vec3 p = gun + rot*vec3(sin(az), 0., cos(az))*h + vec3(0., y, 0.);
  p += rot*vec3(cos(az), 0., -sin(az))*(sin(t*1.7 + a.w*31. + uTime*0.6)*0.05*t*t*b.z);
  float tf = max(t - Tap, 0.);      // seconds past the crest: the falling veil is a sheet of spray, and the wind takes it further than it takes the solid jet
  return p + uWind*(drift*t*t + e.y*tf*tf);
}
float sfProg(float gi){ return uProg[int(max(gi, 0.) + 0.5)]; }
`;function Fe(m,a={}){const t=a.rng,W=Math.max(1,m.length),B=a.segments||16,K=a.detail??1,X=new u.Vector3(.71,.37,-.6).normalize();a.sunDir&&X.fromArray(a.sunDir).normalize();const A=new u.Vector3(.9,0,1.6);a.wind&&A.fromArray(a.wind);const S={uTime:{value:0},uProg:{value:new Float32Array(W)},uWind:{value:A},uBufH:{value:1080},uSunSide:{value:1},uSun:{value:X},uSunCol:{value:new u.Color(a.sunColor||"#FFF1D6")},uWater:{value:new u.Color(a.water||"#F3F8FB")},uShade:{value:new u.Color(a.shade||"#7FA3C8")},uFogTop:{value:new u.Vector3(0,0,0)},uSkyK:{value:0},uMistK:{value:1.6},uGlowK:{value:1}},st=u.UniformsUtils.clone(u.UniformsLib.fog),E=()=>Object.assign({},st,S),R={NG:W},D=[],Z=[],F=[],s=[],$=[],v=[],b=[],p=[],C=[],z=[],j=[],et=[],ot=[],P=[],y=[];m.forEach((d,U)=>{const q=d.position,ft=d.range??15,nt=d.apex??28,ct=d.spread??.45,pt=d.lateral??.05,zt=d.apexSpread??.14,gt=d.sweep??.35,Pt=(d.sweepPhase??t.range(0,6.28))+(d.sweepPhaseAdd??0),vt=d.floorY??q[1]-2,wt=d.strips??24,yt=d.width??1,Bt=d.sweepRate??a.sweepRate??.42,kt=d.fallDrift??0;D.push([gt,Pt,Bt]);const Vt=(ut,mt)=>{const xt=ft*(1-ct*ut)*(1+mt*t.range(-.04,.04)),Tt=nt*(1-zt+zt*Math.pow(ut,.7))*(1+mt*t.range(-.03,.03)),dt=Math.sqrt(2*Math.max(Tt,.5)/9.8),Mt=dt+Math.sqrt(2*Math.max(Tt+q[1]-vt,.5)/9.8);return[xt/(1-Math.exp(-Mt/dt)),Tt]},ht=Math.min(1,15/wt);for(let ut=0;ut<wt;ut++){const mt=(ut+t())/wt,[xt,Tt]=Vt(mt,1);Z.push(q[0],q[1],q[2],U),F.push(d.azimuth??0,xt,Tt,t()),s.push(gt,Pt,t.range(.5,1.5),t.range(-pt,pt)),$.push(vt,t.range(.02,.07),yt*t.range(.75,1.3),(d.tearAt??.3)+t.range(-.04,.05)),v.push(ht*t.range(.75,1.15),Bt,mt,kt)}const _t=Math.round((d.drops??350)*K);for(let ut=0;ut<_t;ut++){const mt=t(),[xt,Tt]=Vt(mt,2.5);b.push(q[0],q[1],q[2],U),p.push(d.azimuth??0,xt,Tt,t()),C.push(gt,Pt,t.range(.6,2.2),t.gauss()*pt*1.3),z.push(vt,t.range(.03,.11),t.range(.09,.26)*yt,t()),j.push(Bt,kt)}if(d.mist!==!1){const ut=d.azimuth??0,mt=Math.sin(ut),xt=Math.cos(ut),Tt=y.length;for(let dt=0;dt<9;dt++){const Mt=ft*(1-ct*t())*t.range(.92,1.02),Ct=t.range(-2,2);et.push(q[0]+mt*Mt+xt*Ct,vt+t.range(.6,3.5),q[2]+xt*Mt-mt*Ct,U),ot.push(t.range(-.3,.3),t.range(.25,.9),t.range(-.3,.3),.9),P.push(t.range(2.5,4),t.range(6,9),t.range(4.5,8),t()),y.push(t.range(.035,.065)*1.6,0,.5,1)}for(let dt=0;dt<4;dt++){const Mt=ft*(1-ct*t())*t.range(.6,.95);et.push(q[0]+mt*Mt,q[1]+nt*t.range(.72,.98),q[2]+xt*Mt,U),ot.push(mt*.6,t.range(-2.2,-.8),xt*.6,.55),P.push(t.range(2,3.5),t.range(5,8),t.range(4,6.5),t()),y.push(t.range(.035,.06),0,1,1)}if(d.haze!==!1)for(let dt=0;dt<5;dt++){const Mt=ft*(1-ct*t())*t.range(.85,1);et.push(q[0]+mt*Mt,vt+(q[1]+nt-vt)*t.range(.25,.72),q[2]+xt*Mt,U),ot.push(mt*.3,t.range(-3,-1.5),xt*.3,.7),P.push(t.range(3.2,4.8),t.range(6,8.5),t.range(3,5),t()),y.push(t.range(.028,.045),0,.9,.6)}for(let dt=0;dt<2;dt++)et.push(q[0],q[1]+.5,q[2],U),ot.push(mt*1.2,1.4,xt*1.2,.14),P.push(.8,3.2,t.range(1.6,2.4),t()),y.push(.16,0,.6,.4);if(d.mistAlpha!==void 0)for(let dt=Tt;dt<y.length;dt+=4)y[dt]*=d.mistAlpha}if(d.steam)for(const ut of d.steam)et.push(ut.p[0],ut.p[1],ut.p[2],U),ot.push(ut.v[0],ut.v[1],ut.v[2],.8),P.push(ut.s[0],ut.s[1],ut.s[2],ut.s[3]),y.push(ut.alpha,0,.7,1)});const g=new u.PlaneGeometry(2,1,1,B);g.translate(0,.5,0);const k=new u.InstancedBufferGeometry;k.index=g.index,k.setAttribute("position",g.getAttribute("position"));const J=d=>new u.InstancedBufferAttribute(new Float32Array(d),4);k.setAttribute("iGun",J(Z)),k.setAttribute("iA",J(F)),k.setAttribute("iB",J(s)),k.setAttribute("iC",J($)),k.setAttribute("iD",J(v)),k.instanceCount=Z.length/4;const Y=new u.ShaderMaterial({uniforms:E(),defines:R,fog:!0,transparent:!0,depthWrite:!1,side:u.DoubleSide,vertexShader:`
      attribute vec4 iGun; attribute vec4 iA; attribute vec4 iB; attribute vec4 iC; attribute vec4 iD;
      varying vec2 vUv; varying float vAge; varying float vTs; varying float vFront; varying float vSeed; varying vec3 vW; varying float vSideSun; varying float vTear; varying float vPulse; varying float vThin; varying float vNear; varying float vCov; varying float vGun; varying float vMid; varying vec2 vVeil;
      uniform vec3 uSun;
      #include <fog_pars_vertex>
      ${de}
      ${Nt}
      void main(){
        float prog = sfProg(iGun.w);
        float Tap = sqrt(2.*max(iA.z, 0.5)/GR);
        float Tfl = Tap + sqrt(2.*max(iA.z + iGun.y - iC.x, 0.5)/GR);
        float s = position.y;
        float t = Tfl*s*(0.6 + 0.4*s);
        vec3 gw = (modelMatrix*vec4(iGun.xyz, 1.)).xyz; mat3 rot = mat3(modelMatrix);
        vec3 p0 = sfTraj(gw, rot, iA, iB, t, Tap, iC.y, iD.yw);
        vec3 p1 = sfTraj(gw, rot, iA, iB, t + 0.06, Tap, iC.y, iD.yw);
        vec3 tg = p1 - p0; tg /= max(length(tg), 1e-4);
        vec3 toCam = cameraPosition - p0; float dist = max(length(toCam), 1e-3);
        vec3 sd = cross(tg, toCam); sd /= max(length(sd), 1e-4);
        float a = t/Tfl;
        float w = iC.z*(0.04 + 0.42*smoothstep(0.0, iC.w, a) + 0.5*smoothstep(iC.w, 1.0, a));
        float pl = sfN(vec2(iGun.w*7.3 + 0.5, (uTime - t)*4.5));   // pressure pulses, shared by every stream of a gun
        w *= 0.7 + 0.6*pl; vPulse = pl;
        float apA = Tap/Tfl;      // (where along the stream its crest is)
        { vec3 thr = rot*vec3(sin(iA.x), 0., cos(iA.x)); float es = dot(thr.xz, uSun.xz)/max(length(uSun.xz), 1e-3);      // which end of the veil is the sun's: its far streams if it throws toward the sun, its near ones if away
          vVeil = vec2(apA, mix(iD.z, 1. - iD.z, smoothstep(-0.35, 0.35, es))); }
        vNear = 1. - smoothstep(7., 13., dist);                       // close to the lens a ribbon is a few thin ropes, never a metre-wide lobe
        vMid = 1. - smoothstep(18., 74., dist);                       // within about 40 m a fan is threads, beads and gaps the scene shows through, never a white sheet
        w = mix(w, min(w, 0.35), vNear);
        float wTrue = w;
        w = max(w, dist*2.4/(max(projectionMatrix[1][1], 0.1)*uBufH)); vThin = iD.x;
        vCov = mix(1., clamp(wTrue/max(w, 1e-4), 0., 1.), 1. - smoothstep(70., 150., dist));      // a stream held at its least width pays for it in alpha (near and middle distance only: far fans keep their light)
        vec3 p = p0 + sd*(position.x*w);
        float tau = clamp((prog - 0.12)/0.88, 0., 1.)*Tfl*1.14;
        vUv = vec2(position.x, s); vAge = a; vTs = t; vFront = t - tau; vSeed = iA.w; vW = p; vSideSun = dot(sd, uSun); vTear = iC.w; vGun = iGun.w*3.71 + 0.5;
        vec4 mvPosition = viewMatrix*vec4(p, 1.);
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec2 vUv; varying float vAge; varying float vTs; varying float vFront; varying float vSeed; varying vec3 vW; varying float vSideSun; varying float vTear; varying float vPulse; varying float vThin; varying float vNear; varying float vCov; varying float vGun; varying float vMid; varying vec2 vVeil;
      uniform float uTime; uniform vec3 uSun; uniform vec3 uSunCol; uniform vec3 uWater; uniform vec3 uShade; uniform vec3 uFogTop; uniform float uSkyK; uniform float uGlowK;
      #include <fog_pars_fragment>
      ${Nt}
      void main(){
        // Varyings that change across a ribbon are clamped to their own range before use: on a ribbon a pixel or less wide, multisampling evaluates them outside
        // the triangle, and an unclamped one inside a product lit single pixels as glowing squares (antialiased frames only; nothing moves without it).
        float c = clamp(vUv.x, -1., 1.), a = clamp(vAge, 0., 1.), L = uTime - vTs, sd = vSeed*61.7;
        float nr = clamp(vNear, 0., 1.), md = clamp(vMid, 0., 1.), cov = clamp(vCov, 0., 1.), pls = clamp(vPulse, 0., 1.), thin = clamp(vThin, 0., 1.2), sideSun = clamp(vSideSun, -1., 1.);
        // Water, not static: every break in a stream is a long thread that travels with it (metres along the flow, a hand across) and the
        // alpha is a soft ramp, never a switch; each stream has a bright core and translucent edges.
        float n1 = sfN(vec2(c*1.4 + sd, L*1.5));
        float n2 = sfN(vec2(c*3.4 + sd*1.7, L*3.6));
        float n3 = sfN(vec2(c*mix(mix(7.5, 13., md), 12., nr) + sd*0.37, L*mix(8., 11., md)));
        float tear = smoothstep(vTear - 0.14, vTear + 0.12, a);
        float apA = clamp(vVeil.x, 0.2, 0.8), sunw = clamp(vVeil.y, 0., 1.);
        float crest = smoothstep(apA - 0.2, apA - 0.04, a)*(1. - smoothstep(apA + 0.05, apA + 0.24, a)), fall = smoothstep(apA + 0.06, apA + 0.3, a);      // the crest of the stream, and its fall
        float rope = sfN(vec2(c*2.3 + sd*0.7, L*4.5));       // long streaks that travel with the water: the jet is ropes, not a plank
        float body = mix(0.5*n1 + 0.5*rope, 0.3*n1 + 0.4*n2 + 0.3*n3, mix(0.25 + 0.75*tear, 1., nr));
        body = mix(body, 0.16*n1 + 0.3*n2 + 0.54*n3, md*(1. - nr));      // near the eye the fine threads carry the stream
        float thr = mix(0.12, 0.38 + (vSeed - 0.5)*0.14 + 0.1*smoothstep(0.5, 1., a), tear) + (0.5 - pls)*mix(0.3, 0.14, tear);
        thr += md*mix(0.3, 0.15, tear);                                   // and more of each ribbon is gap: the village is seen between the threads
        float k = smoothstep(thr, thr + mix(mix(0.5, 0.36, tear), 0.1, md), body);
        k = max(k, 1. - smoothstep(0.0, 0.02, a));
        float ac = abs(c) + (n2 - 0.5)*mix(0.2, 0.34, tear)*(1. - 0.5*nr);
        float prof = clamp(1. - ac*ac, 0., 1.); prof *= prof;
        float core = exp(-ac*ac*mix(14., 7., tear));
        float alpha = (prof*(mix(0.1, 0.0, md) + 0.9*k) + 0.3*core*k)*mix(0.6*mix(thin, 1., smoothstep(0.0, 0.03, 0.03 - a)), 0.5*mix(1., thin, 0.7*(1. - smoothstep(0.22, 0.6, a))), tear);
        alpha *= mix(1., mix(0.45, 1., cov), tear);
        alpha *= mix(1., 0.35 + 0.65*smoothstep(0.25, 0.7, sfN(vec2(vSeed*91., L*5.))), tear*(1. - cov));      // a torn stream finer than a pixel comes and goes along its length: threads, never a wire and never dots
        alpha *= 1. - 0.45*nr;
        // The crest: there the water has lost its speed and breaks into beads, a run of them along every stream, each travelling with the water (seconds along the
        // flow are short lengths there). The fall: the streaks open into one soft sheet, most of it on the sun's end of the veil; near the eye it stays threads.
        float beadC = smoothstep(0.46, 0.64, sfN(vec2(c*3.1 + sd*2.3, L*17.)));
        alpha *= mix(1., 0.22 + 1.2*beadC, 0.85*crest);
        alpha += (1. - alpha)*fall*prof*(0.02 + 0.05*sfN(vec2(c*1.3 + sd, L*1.1)))*(0.4 + 0.8*sunw)*(1. - md);
        float dash = smoothstep(0.42, 0.62, sfN(vec2(c*5. + sd*2.3, L*26.)));      // near the eye a torn thread is a run of beads: short dashes that travel with the water
        alpha *= mix(1., 0.25 + 0.95*dash, md*tear*(1. - 0.5*nr));
        { float gapN = 0.6*sfN(vec2(vGun, L*3.2)) + 0.4*sfN(vec2(vSeed*37., L*4.));      // the rising column is pulses of water that travel up the jet, never a smooth white wedge
          alpha *= mix(1., 0.42 + 0.58*smoothstep(0.25, 0.7, gapN), smoothstep(0.015, 0.06, a)*(1. - smoothstep(0.3, 0.55, a))); }      // (while the streams still run bundled together, torn or not)
        alpha *= 1. - smoothstep(-0.2, 0.0, vFront);
        alpha *= smoothstep(0.0, 0.015, a)*(1. - smoothstep(0.93, 1.0, a));
        alpha *= mix(1., smoothstep(-3., 1., vW.y - (uFogTop.x + uFogTop.y*vW.z)), uFogTop.z);      // the jet punches out of the fog bank
        if (alpha < 0.004) discard;
        vec3 V = cameraPosition - vW; float dcam = max(length(V), 1e-4); V /= dcam;
        float fs = clamp(dot(-V, uSun), 0., 1.); fs *= fs; float fw = fs; fs = fs*fs*fs;
        float lit = clamp(mix(0.55, 0.36, uGlowK) + 0.45*c*sideSun + 0.25*uSun.y, 0., 1.);      // the body of the fan is in its own shade: blue-grey, so its silver edges and beads have something to shine against
        vec3 col = mix(uShade, uWater, clamp(lit*mix(0.55, 1., k) + 0.55*core, 0., 1.));
        col = mix(col, uShade*0.8, 0.4*(1. - rope)*nr*(1. - core));      // a jet at arm's length shows shade between its ropes
        float bead = smoothstep(0.55, 0.9, n3)*tear;
        bead = max(bead, 0.9*dash*smoothstep(0.5, 0.8, k)*md*tear);      // (near the eye each dash is a bead that flashes)
        col *= 1. + 0.3*bead + 0.35*smoothstep(-0.9, -0.15, vFront)*step(vFront, 0.)*step(-1.5, vFront);
        col = mix(col, uShade*0.6, 0.3*smoothstep(0.05, 0.3, -V.y)*(1. - fs)*uSkyK);      // looking up at the sky a stream is blue-grey with silver edges, so it reads against a bright sky; against the wall it is as it was
        col += uSunCol*((0.1 + 0.9*fs)*(0.35 + 0.65*k) + 0.2*core*k);      // the core of each stream is solid water: it takes the sun whole
        col += uSunCol*(uGlowK*((0.16 + 0.5*fw)*tear*(1. - smoothstep(0.55, 0.95, a)) + 0.3*bead));      // the torn crown is lit through by the low sun: a warm glow, and beads that flash
        { float gl = 0.5 + 0.5*sin(uTime*(7. + 9.*vSeed) + floor(L*17.)*2.4 + sd);      // each bead of the crest flashes as it turns in the sun: white, a little over the water's own brightness
          col += uWater*(1.1*beadC*crest*gl*gl*gl*gl*(0.45 + 0.55*fw));
          col += (uWater*0.22 + uSunCol*0.14)*(sunw*sunw*fall*(0.5 + 0.5*k)); }      // and the veil is brightest along its sunward edge
        col = clamp(col, vec3(0.), vec3(2.2));
        gl_FragColor = vec4(col, clamp(alpha, 0., 1.));
        #include <fog_fragment>
        gl_FragColor.rgb = max(gl_FragColor.rgb, vec3(0.));
      }`}),Q=new u.Mesh(k,Y);Q.frustumCulled=!1,Q.renderOrder=6;const V=new u.BufferGeometry;V.setAttribute("position",new u.Float32BufferAttribute(new Float32Array(b.length/4*3),3));const I=d=>new u.Float32BufferAttribute(new Float32Array(d),4);V.setAttribute("iGun",I(b)),V.setAttribute("iA",I(p)),V.setAttribute("iB",I(C)),V.setAttribute("iC",I(z)),V.setAttribute("iD",new u.Float32BufferAttribute(new Float32Array(j),2));const n=new u.ShaderMaterial({uniforms:E(),defines:R,fog:!0,transparent:!0,depthWrite:!1,vertexShader:`
      attribute vec4 iGun; attribute vec4 iA; attribute vec4 iB; attribute vec4 iC; attribute vec2 iD;
      varying float vAl; varying float vSeed; varying float vFs; varying vec2 vDir; varying float vNb; varying float vCr;
      uniform vec3 uSun; uniform vec3 uFogTop;
      #include <fog_pars_vertex>
      ${de}
      void main(){
        float prog = sfProg(iGun.w);
        float Tap = sqrt(2.*max(iA.z, 0.5)/GR);
        float Tfl = Tap + sqrt(2.*max(iA.z + iGun.y - iC.x, 0.5)/GR);
        float cyc = uTime/Tfl + iC.w*7.;
        float t = fract(cyc)*Tfl;
        float sd = fract(iA.w*91.7 + floor(cyc)*0.618);
        float a = t/Tfl;
        vec3 gw = (modelMatrix*vec4(iGun.xyz, 1.)).xyz; mat3 rot = mat3(modelMatrix);
        vec3 p = sfTraj(gw, rot, iA, iB, t, Tap, iC.y, iD);
        vec3 pv = sfTraj(gw, rot, iA, iB, t + 0.05, Tap, iC.y, iD) - p;      // where it is going: a falling drop is seen as a short streak, never a dot
        vec3 j = vec3(fract(sd*13.1), fract(sd*37.7), fract(sd*71.3)) - 0.5;
        p += j*(0.25 + 2.6*a*a);
        float tau = clamp((prog - 0.12)/0.88, 0., 1.)*Tfl*1.14;
        vec4 mvPosition = viewMatrix*vec4(p, 1.);
        gl_Position = projectionMatrix*mvPosition;
        float px = iC.z*(0.6 + 0.9*a)*projectionMatrix[1][1]*uBufH*0.5/max(-mvPosition.z, 0.5);
        gl_PointSize = clamp(px*3.4, 3., 44.);
        { vec4 cB = projectionMatrix*viewMatrix*vec4(p + pv, 1.);
          vec2 dd = (cB.xy/max(abs(cB.w), 1e-3) - gl_Position.xy/max(abs(gl_Position.w), 1e-3))*vec2(projectionMatrix[1][1]/max(projectionMatrix[0][0], 1e-3), 1.);
          float dl = length(dd); vDir = dl > 1e-6 ? dd/dl : vec2(0., -1.); }
        vec3 V = cameraPosition - p; float dcam = max(length(V), 1e-4); V /= dcam;
        vNb = 1. - smoothstep(16., 60., dcam);      // within about 40 m a drop is a distinct bead with a short tail
        float fs = max(dot(-V, uSun), 0.); fs *= fs; vFs = fs*fs*fs;
        { float apA = Tap/Tfl; vCr = smoothstep(apA - 0.2, apA - 0.04, a)*(1. - smoothstep(apA + 0.05, apA + 0.24, a)); }      // at the crest of its flight a drop hangs and turns in the sun
        vAl = smoothstep(mix(0.8, 0.3, vCr), mix(2.6, 1.3, vCr), px)*(1. - smoothstep(-0.25, 0., t - tau))*smoothstep(0.03, 0.2, a)*(1. - smoothstep(0.93, 1., a));      // (the beads of the crest are seen from further off than the drops of the fall: they are what glints)
        vAl *= mix(1., smoothstep(-3., 1., p.y - (uFogTop.x + uFogTop.y*p.z)), uFogTop.z);
        vSeed = sd;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying float vAl; varying float vSeed; varying float vFs; varying vec2 vDir; varying float vNb; varying float vCr;
      uniform float uTime; uniform vec3 uSunCol; uniform vec3 uWater;
      #include <fog_pars_fragment>
      void main(){
        vec2 q = (gl_PointCoord - 0.5)*vec2(2., -2.);
        float al = dot(q, vDir), ax = dot(q, vec2(-vDir.y, vDir.x));
        float streak = (1. - smoothstep(0.35, 1., abs(al)))*(1. - smoothstep(0.06, 0.26, abs(ax)))*(0.55 + 0.45*smoothstep(-0.6, 0.6, al));      // a streak, brightest at its head
        float head = 1. - smoothstep(0.1, 0.3, length(q - vDir*0.42));                                                                              // and near the eye a round bead at its head
        float alpha = vAl*max(streak*(1. - 0.35*vNb), 1.4*head*vNb);
        if (alpha < 0.01) discard;
        float tw = step(0.72, fract(vSeed*57.3 + floor(uTime*7. + vSeed*9.)*0.381));
        float cr = clamp(vCr, 0., 1.), gl = 0.5 + 0.5*sin(uTime*(6. + 8.*fract(vSeed*7.7)) + vSeed*40.); gl *= gl; gl *= gl;      // the crest's beads flash white, each at its own beat
        vec3 col = max(uWater*(1.02 + 0.9*cr*gl) + uSunCol*(0.18 + 1.1*vFs + 0.3*tw + 0.35*head*vNb), vec3(0.));
        gl_FragColor = vec4(col, clamp(alpha*0.7, 0., 1.));
        #include <fog_fragment>
        gl_FragColor.rgb = max(gl_FragColor.rgb, vec3(0.));
      }`}),H=new u.Points(V,n);H.frustumCulled=!1,H.renderOrder=7;const _=Xt({P:et,V:ot,S:P,K:y},E(),W);_.renderOrder=5;const rt=new u.Group;rt.name="fountains",rt.add(_,Q,H);const lt=new u.Vector2;let at=null;return{object:rt,uniforms:S,count:m.length,fans:Q,drops:H,mist:_,gunSweep:D,orderByFiring(d){const U=(q,ft,nt,ct)=>{const pt=q.getAttribute(nt),zt=pt.count,gt=Array.from({length:zt},(vt,wt)=>pt.getW(wt)),Pt=gt.map((vt,wt)=>wt).sort((vt,wt)=>d[gt[vt]]-d[gt[wt]]||vt-wt);for(const vt of ft){const wt=q.getAttribute(vt),yt=wt.itemSize,Bt=wt.array.slice();Pt.forEach((kt,Vt)=>{for(let ht=0;ht<yt;ht++)wt.array[Vt*yt+ht]=Bt[kt*yt+ht]}),wt.needsUpdate=!0}return Pt.map(vt=>d[gt[vt]])};at={fan:U(k,["iGun","iA","iB","iC","iD"],"iGun"),drop:U(V,["iGun","iA","iB","iC","iD"],"iGun"),mist:U(_.geometry,["iP","iV","iS","iK"],"iP")}},setFired(d){if(!at)return;const U=ct=>{let pt=0,zt=ct.length;for(;pt<zt;){const gt=pt+zt>>1;ct[gt]<=d?pt=gt+1:zt=gt}return pt},q=U(at.fan),ft=U(at.drop),nt=U(at.mist);k.instanceCount=q,Q.visible=q>0,V.setDrawRange(0,ft),H.visible=ft>0,_.geometry.instanceCount=nt,_.visible=nt>0},setProgress(d,U){S.uProg.value[d]=Math.min(1,Math.max(0,U))},getProgress(d){return S.uProg.value[d]},update(d,U,q,ft){S.uTime.value=U,ft&&(ft.getDrawingBufferSize(lt),S.uBufH.value=lt.y)}}}function Xt(m,a,t){const W=new u.PlaneGeometry(2,2),B=new u.InstancedBufferGeometry;B.index=W.index,B.setAttribute("position",W.getAttribute("position"));const K=S=>new u.InstancedBufferAttribute(new Float32Array(S),4);B.setAttribute("iP",K(m.P)),B.setAttribute("iV",K(m.V)),B.setAttribute("iS",K(m.S)),B.setAttribute("iK",K(m.K)),B.instanceCount=m.P.length/4;const X=new u.ShaderMaterial({uniforms:a,defines:{NG:t},fog:!0,transparent:!0,depthWrite:!1,vertexShader:`
      attribute vec4 iP; attribute vec4 iV; attribute vec4 iS; attribute vec4 iK;
      varying vec2 vUv; varying float vAl; varying float vBlue; varying float vSeed; varying float vFs;
      uniform float uTime; uniform float uProg[NG]; uniform vec3 uWind; uniform vec3 uSun; uniform float uSunSide; uniform float uMistK;
      #include <fog_pars_vertex>
      void main(){
        float life = max(iS.z, 0.1);
        float age = fract(uTime/life + iS.w);
        vec3 o = (modelMatrix*vec4(iP.xyz, 1.)).xyz + mat3(modelMatrix)*iV.xyz*(age*life) + uWind*(iK.z*age*life);
        o.x += sin(age*5. + iS.w*40.)*0.5*iK.w; o.z += cos(age*4. + iS.w*23.)*0.5*iK.w;
        float size = mix(iS.x, iS.y, age);
        vec3 rt = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
        vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
        vec3 p = o + (rt*position.x + up*position.y)*size;
        float gate = iP.w < -0.5 ? (iP.w < -1.5 ? step(0., iP.w < -2.5 ? -uSunSide : uSunSide) : 1.) : smoothstep(iV.w, iV.w + 0.12, uProg[int(max(iP.w, 0.) + 0.5)]);
        vAl = iK.x*mix(uMistK, 1., step(0.5, iK.y))*gate*smoothstep(0., 0.22, age)*(1. - smoothstep(0.45, 1., age));
        vUv = position.xy; vBlue = iK.y; vSeed = iS.w*17.;
        vec3 V = cameraPosition - o; float dcam = max(length(V), 1e-4); V /= dcam;
        vAl *= iP.w > -0.5 ? mix(0.18, 1., smoothstep(12., 66., dcam)) : 1.;
             // a fan's own mist thins within 40 m of the eye: the water there is threads and beads, and the scene shows through (roof steam and smoke are as they were)
        float fs = max(dot(-V, uSun), 0.); vFs = fs*fs*fs + 0.3*fs;      // a narrow lobe and a broad one: mist anywhere toward the sun's side of the sky takes its warmth
        vec4 mvPosition = viewMatrix*vec4(p, 1.);
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec2 vUv; varying float vAl; varying float vBlue; varying float vSeed; varying float vFs;
      uniform float uTime; uniform vec3 uSunCol; uniform vec3 uWater;
      #include <fog_pars_fragment>
      ${Nt}
      void main(){
        float r = length(vUv);
        float n = sfFbm(vUv*1.7 + vSeed + vec2(0., -uTime*0.12));
        float alpha = clamp(vAl, 0., 4.)*(1. - smoothstep(0.15, 1., r + (n - 0.5)*0.55));
        if (alpha < 0.003) discard;
        float fsv = clamp(vFs, 0., 1.3);      // (kept to its own range: multisampling can run a varying past it on an edge-on card)
        vec3 mistC = uWater*(0.7 + 0.25*n) + uSunCol*(0.08 + 0.7*fsv);
        vec3 smokeC = vec3(0.36, 0.47, 0.66)*(0.75 + 0.4*n) + uSunCol*(0.35*fsv);
        gl_FragColor = vec4(max(mix(mistC, smokeC, vBlue), vec3(0.)), clamp(alpha, 0., 1.));
        #include <fog_fragment>
        gl_FragColor.rgb = max(gl_FragColor.rgb, vec3(0.));
      }`}),A=new u.Mesh(B,X);return A.frustumCulled=!1,A}function ge(m){const a=new u.MeshStandardMaterial({vertexColors:!0,roughness:1,metalness:0,side:u.DoubleSide}),t={tSfWet:{value:null},uSfWetR:{value:new u.Vector4(0,1,0,1)},uSfWetK:{value:new u.Vector4(1,0,0,0)},uSfWetH:{value:[0,1,2].map(()=>new u.Vector4(0,0,1,9))},uSfMist:{value:new u.Vector4(0,0,0,0)},uSfMistC:{value:new u.Color(1,1,1)}};return a.onBeforeCompile=W=>{Object.assign(W.uniforms,t,m),W.vertexShader=W.vertexShader.replace("#include <common>",`#include <common>
attribute vec4 aX; varying vec4 vTh; varying vec3 vON; varying vec3 vOP; varying vec4 vSfW; varying float vSfY; uniform float uTime;`).replace("#include <begin_vertex>",`#include <begin_vertex>
        vTh = aX; vON = normal; vOP = position;
        transformed.xz += vec2(sin(uTime*2.3 + position.z*1.7 + position.x), cos(uTime*1.9 + position.x*1.3))*(0.05*max(aX.w, 0.));
        { vec4 sfw = vec4(position, 1.); vec3 sfu = vec3(normal.x > 0. ? -1. : 1., 0., 0.);      // world xz, and the way up the slope, for the wet stripes
          #ifdef USE_INSTANCING
            sfw = instanceMatrix*sfw; sfu = mat3(instanceMatrix)*sfu;
          #endif
          sfw = modelMatrix*sfw; sfu = mat3(modelMatrix)*sfu; vSfW = vec4(sfw.xz, sfu.xz); vSfY = sfw.y; }`),W.fragmentShader=W.fragmentShader.replace("#include <fog_fragment>",`{ float sfTop = uSfMist.x + uSfMist.y*vSfW.y;      // standing in the fog bank: the lower roof dissolves into it, more with distance
          float sfM = (1. - smoothstep(sfTop - 4., sfTop + 2., vSfY))*mix(0.6, 1., 1. - smoothstep(sfTop - 9.5, sfTop - 5., vSfY))*(1. - exp(-length(vViewPosition)*uSfMist.z*(cameraPosition.y > sfTop ? clamp((sfTop - vSfY)/max(cameraPosition.y - vSfY, 1e-3), 0., 1.) : 1.)))*uSfMist.w*(1. - smoothstep(-440., -400., vSfW.y));      // palest at the feet
          gl_FragColor.rgb = mix(gl_FragColor.rgb, uSfMistC, sfM); }
        #include <fog_fragment>`).replace("#include <common>",`#include <common>
        varying vec4 vTh; varying vec3 vON; varying vec3 vOP; varying vec4 vSfW; varying float vSfY; uniform vec4 uSfMist; uniform vec3 uSfMistC; uniform float uTime;
        uniform float uSunSide; uniform vec3 uSunW; uniform vec3 uMoss; uniform vec3 uFrost; uniform vec3 uFresh; uniform vec4 uPatch[3]; uniform float uSL; uniform float uSnow; uniform float uBounce;
        uniform sampler2D tSfWet; uniform vec4 uSfWetR; uniform vec4 uSfWetK; uniform vec4 uSfWetH[3];
        ${Nt}
        // Where a running fan lands (world xz): the village map's wet channel, gated by the wave's threshold at that z, plus three hand-placed discs.
        float sfWetAt(vec2 w){
          vec2 q = vec2(w.x*uSfWetK.x, w.y);
          vec2 uv = vec2((q.x - uSfWetR.x)*uSfWetR.y, (q.y - uSfWetR.z)*uSfWetR.w);
          float inb = step(0.004, uv.x)*step(uv.x, 0.996)*step(0.004, uv.y)*step(uv.y, 0.996);
          float thr = mix(0.2, 0.56, clamp((-424. - q.y)/465., 0., 1.)) + 0.03;      // the world's village wave (its WAVE0 and WAVE1)
          float m = textureLod(tSfWet, clamp(uv, 0., 1.), 0.).b*inb*smoothstep(thr, thr + 0.035, uSfWetK.z);
          for (int i = 0; i < 3; i++) { vec4 h = uSfWetH[i]; float d = length(w - h.xy)/max(h.z, 0.1); m = max(m, (1. - smoothstep(0.5, 1., d))*smoothstep(h.w, h.w + 0.035, uSfWetK.z)); }
          return m*uSfWetK.y;
        }`).replace("#include <color_fragment>",`#include <color_fragment>
        float sfSnowM;
        {
          float along = vTh.x, down = vTh.y, kind = vTh.z;
          vec3 b = diffuseColor.rgb; sfSnowM = 0.;
          float shaded = smoothstep(-0.2, 0.2, -vON.x*uSunSide);
          if (kind < 0.5) {
            float rag = (sfN(vec2(along*2.3, floor(down/0.6)*7.3)) - 0.5)*0.3 + (sfN(vec2(along*9., down*0.4)) - 0.5)*0.14;
            float cq = down/0.6 + rag, cf = fract(cq), cid = floor(cq);
            float st = sfN(vec2(along*34., down*1.3 + cid*5.)), st2 = sfN(vec2(along*80., down*3.));
            float crs = mix(0.46, 1., smoothstep(0., 0.2, cf))*(1. + 0.24*smoothstep(0.76, 1., cf));
            b *= crs;
            b *= 0.88 + 0.24*sfHash(vec2(cid, 3.));
            b *= 0.72 + 0.38*st + 0.18*st2;
            b *= 0.66 + 0.62*sfN(vec2(along*0.55, down*0.09 + 3.));
            for (int i = 0; i < 3; i++) {
              vec4 pp = uPatch[i];
              float e = (sfN(vec2(along*3., down*3.) + float(i)*9.) - 0.5)*0.5;
              float pa = (1. - smoothstep(pp.z - 0.15, pp.z + 0.1, abs(along - pp.x) + e))*(1. - smoothstep(pp.w - 0.15, pp.w + 0.1, abs(down - abs(pp.y)) + e));
              b = mix(b, uFresh*(0.7 + 0.5*st)*mix(0.5, 1., smoothstep(0., 0.2, cf)), 0.6*pa*step(0., pp.y*vON.x));
            }
            float mN = sfFbm(vec2(along*0.3, down*0.28) + 7.);
            float moss = smoothstep(0.5, 0.78, mN + shaded*0.2 + (down/uSL)*0.16 - 0.15 + (st - 0.5)*0.12);
            b = mix(b, uMoss*(0.6 + 0.8*st), moss*0.8);
            float fr = shaded*mix(0.45, 1., smoothstep(0.3, 0.85, cf))*(0.3 + 0.7*smoothstep(0.3, 0.65, sfFbm(vec2(along*0.6, down*0.45) + 31.)))*(0.45 + 0.75*st2)*(0.5 + 0.8*st);
            b = mix(b, uFrost, min(fr*0.95, 0.55)*(1. - 0.7*moss));
            // wet: where a fan lands and where that water runs down to the eave, in streaks
            float wet0 = max(sfWetAt(vSfW.xy), max(sfWetAt(vSfW.xy + vSfW.zw*3.5), 0.85*sfWetAt(vSfW.xy + vSfW.zw*7.)));
            float wet = smoothstep(0.28, 0.68, wet0 + (sfN(vec2(along*1.1, down*0.1) + 5.) - 0.5)*0.55);
            b *= mix(vec3(1.), vec3(0.4, 0.42, 0.46), wet);
            // the patter: where a fan's water is coming down on the straw, each drop throws up a white crown for a moment and a ring that runs out and dies.
            // (Three to the metre; they fade to nothing before a crown is finer than a pixel.)
            { float pk = smoothstep(0.35, 0.7, sfWetAt(vSfW.xy))*(1. - smoothstep(0.03, 0.11, fwidth(along)*3.2));
              vec2 pc = vec2(along, down)*3.2, pid = floor(pc); float ph = sfHash(pid + 3.1), tt = fract(uTime*(1.1 + 0.9*ph) + ph*17.);
              vec2 pf = fract(pc) - 0.5 - (vec2(sfHash(pid + 7.7), sfHash(pid + 1.9)) - 0.5)*0.5; float rr = length(pf);
              float crown = (1. - smoothstep(0.03, 0.1, rr))*(1. - smoothstep(0.0, 0.3, tt)), ring = (1. - smoothstep(0.012, 0.05, abs(rr - 0.34*tt)))*(1. - tt)*(1. - tt);
              b = mix(b, vec3(0.86, 0.9, 0.96), pk*max(crown, 0.5*ring)*step(sfHash(pid + 5.3), 0.8)); }
            // snow (kind carries 0.4 x the share of the slope from ridge to eave): it lies in a slab with a ragged lower lip above the eave, thins among the
            // ridge bundles, has slid off in strips, keeps the roof's courses as soft steps, and is cut to dark wet thatch by the water
            float dn = clamp(kind*2.5, 0., 1.), gapM = (1. - dn)*14.;
            float lipAt = 0.9 + 1.7*sfN(vec2(along*0.33, 2.)) + 0.5*sfN(vec2(along*1.9, 9.));
            float cov = smoothstep(0.26, 0.5, sfFbm(vec2(along*0.21, down*0.17) + 3.) + 0.62*uSnow - 0.2 + 0.12*shaded + (st - 0.5)*0.1);
            float slid = smoothstep(0.78, 0.87, sfN(vec2(along*0.8 + 4., down*0.05)) + 0.1*dn)*smoothstep(0.3, 0.65, dn);
            float low = smoothstep(lipAt - 0.14, lipAt + 0.14, gapM + (st - 0.5)*0.25);
            float sn = cov*low*(1. - 0.9*slid*(1. - 0.5*shaded))*smoothstep(0.9, 2.6, down + (st2 - 0.5)*1.2)*(1. - wet)*step(0.01, uSnow)*min(1., uSnow*1.6);
            sn *= mix(1., smoothstep(0.4, 1.6, -vTh.w - 1. + (st - 0.5)*1.2 + (sfN(vec2(down*0.7, along*0.2 + 5.)) - 0.5)*1.1), step(0.5, -vTh.w));      // ragged at the verges: the slab does not end in a ruled line
            vec3 snC = mix(vec3(0.6, 0.61, 0.63), vec3(0.43, 0.5, 0.63), 0.75*smoothstep(0.3, 1., dn) + 0.15*(1. - cov));
            snC *= mix(1., 0.68 + 0.32*smoothstep(0., 0.55, cf), 0.9)*(0.93 + 0.14*st2);          // the courses, drifted over
            snC *= 0.9 + 0.2*sfN(vec2(along*0.25, down*0.2));                                     // drifts: a slow tone across the slab
            snC *= 1. + 0.12*(1. - smoothstep(0., 0.45, gapM - lipAt));                           // the lip of the slab catches the light
            b *= 1. - 0.5*smoothstep(lipAt - 0.5, lipAt - 0.14, gapM)*(1. - low)*step(0.01, uSnow)*cov;   // and throws a shadow on the straw under it
            b = mix(b, snC, sn); sfSnowM = sn;
          } else if (kind < 1.5) {
            float layer = fract(down), lid = floor(down);
            b *= (0.55 + 0.6*smoothstep(0.35, 0.65, sfN(vec2(along*9., down*46.))))*(0.66 + 0.6*sfN(vec2(along*7., down*5.3 + 2.)));   // straw ends, in bundles: the stipple is stretched along the eave, so it still reads when the edge is seen along its length
            float seam = smoothstep(0.4, 0.5, abs(fract(along/0.6 + sfHash(vec2(lid, 3.))) - 0.5)); b *= 1. - 0.3*seam;      // a seam between bundles about every 0.6 m
            b *= vec3(1.0, 0.88, 0.68);
            b *= mix(0.88, 1.06, step(0.5, fract(lid*0.5)))*(0.92 + 0.16*sfHash(vec2(lid*3.7 + 1.3, 5.1)));                            // each of the three layers has its own tone (a little: more made the steps read as planks)
            b *= mix(0.1, 1., smoothstep(0.0, 0.2, layer))*(0.82 + 0.26*sfN(vec2(along*1.3, lid*5.)));   // a wide dark shadow under each step
            b *= 1. + 0.2*smoothstep(0.8, 1., layer);
            b = mix(b, uFrost, shaded*0.18*sfN(vec2(along*3., down*9.)));
          } else if (kind < 2.5) {
            b *= 0.66 + 0.55*sfN(vec2(vOP.z*42., vOP.y*4. + vOP.x*4.));
            float wetB = smoothstep(0.3, 0.7, sfWetAt(vSfW.xy)); b *= mix(1., 0.55, wetB);
            sfSnowM = min(1., uSnow*1.5)*smoothstep(0.3, 0.9, vON.y)*smoothstep(0.3, 0.62, sfN(vOP.zx*vec2(0.8, 2.3) + 3.))*0.85*(1. - wetB);     // snow in patches on the bundles: the straw shows
            b = mix(b, vec3(0.58, 0.6, 0.64), sfSnowM);
          } else if (kind < 3.5) {
            float reed = (0.55 + 0.5*sfN(vec2(along*26., down*1.7)))*(0.72 + 0.56*sfN(vec2(along*60., down*13.)));   // reed bundles with a fine weave
            float lay = mix(0.6, 1., smoothstep(0., 0.3, fract(down/0.62)));
            float raf = smoothstep(0.4, 0.47, abs(fract(along/1.15) - 0.5)), pur = smoothstep(0.42, 0.48, abs(fract(down/2.1 + 0.5) - 0.5));
            b *= 0.3*reed*lay; b = mix(b, vec3(0.035, 0.028, 0.022), max(raf, pur)*0.5);
          } else {
            b *= 0.8 + 0.4*sfHash(floor(vOP.xz*9.));
          }
          diffuseColor.rgb = b;
        }`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        {
          vec3 vd = normalize(vViewPosition);
          float fres = 1. - abs(dot(vd, normal)); fres *= fres*fres;
          vec3 sunV = (viewMatrix*vec4(uSunW, 0.)).xyz;
          float back = smoothstep(-0.35, 0.6, dot(sunV, -vd));
          float cutDown = step(0.5, vTh.z)*step(vTh.z, 1.5)*(1. - smoothstep(-0.6, -0.15, vON.y));     // cut straw ends that face the ground
          totalEmissiveRadiance += diffuseColor.rgb*vec3(2.6, 2.3, 1.7)*(fres*back*step(vTh.z, 2.5)*(1. - 0.85*cutDown)*(1. - 0.9*sfSnowM)) + diffuseColor.rgb*(0.9*back*step(4.5, vTh.z)*step(vTh.z, 5.5))
            + diffuseColor.rgb*vec3(1.0, 0.86, 0.66)*(uBounce*step(2.5, vTh.z)*step(vTh.z, 3.5))
            + diffuseColor.rgb*vec3(1.0, 0.9, 0.72)*(0.9*uBounce*cutDown);   // the cut straw ends of the eave face the ground: lit by what it throws back
        }`)},a}async function pe(m,a,t,W){const{z0:B,z1:K,ridgeY:X,dTop:A,TH:S,noise:st,rng:E,straw:R,timber:D}=t,Z=A+1.5,F=(y,g,k)=>{const J=Math.min(1,Math.max(0,(k-y)/(g-y)));return J*J*(3-2*J)},s=(y,g,k,J=0)=>{const Y=(k-B)/(K-B),Q=g/Z,V=J-.3*Math.sin(Math.PI*Math.min(1,Q*1.05))*(.55+.45*Math.sin(Math.PI*Y))+.24*F(.8,1,Q)+.1*st.fbm2(k*.2+y*9,g*.22,3)+.035*st.n2(k*.9,g*.8+y*5);return[y*(g*ue+V*he),X-t.ridgeSag*Math.sin(Math.PI*Y)-g*he+V*ue,k]},$=t.NZ??46,v=t.ND??26,b=t.CS??8,p=t.BS??8,C=t.PS??8,z=[];for(let y=0;y<=$;y++)z.push(B+(K-B)*(y/$));for(const y of[1,-1]){const g=[],k=[],J=[];for(let V=0;V<=v;V++)for(let I=0;I<=$;I++){const n=.9+(A-.9)*(V/v),H=z[I],_=s(y,n,H),rt=s(y,n+.3,H),lt=s(y,n,H+.3),at=rt[0]-_[0],d=rt[1]-_[1],U=rt[2]-_[2],q=lt[0]-_[0],ft=lt[1]-_[1],nt=lt[2]-_[2];let ct=d*nt-U*ft,pt=U*q-at*nt,zt=at*ft-d*q;const gt=Math.hypot(ct,pt,zt)*(pt<0?-1:1)||1;g.push(_),k.push([ct/gt,pt/gt,zt/gt]);const Pt=.86+.2*st.fbm2(H*.13+y*31,n*.1,2)+.14*(1-n/Z)-.1*F(.7,1,n/Z);J.push([Pt,n,H])}await W.yield();const Y=V=>{const I=g[V],n=k[V],H=J[V];m.ex=[H[2],H[1],.4*Math.min(1,H[1]/A),-1-Math.min(H[2]-B,K-H[2])],m.vert(I,n[0],n[1],n[2],R,H[0])};for(let V=0;V<v;V++)for(let I=0;I<$;I++){const n=V*($+1)+I,H=n+1,_=n+$+1,rt=_+1;y>0?(Y(n),Y(rt),Y(_),Y(n),Y(H),Y(rt)):(Y(n),Y(_),Y(rt),Y(n),Y(rt),Y(H))}await W.yield();for(let V=0;V<$;V++){const I=z[V],n=z[V+1];let H=A;const _=(at,d,U)=>s(y,at,U,d),rt=(at,d,U,q,ft,nt,ct)=>y<0?m.quad(at,d,U,q,ft,nt,nt,nt,nt,ct):m.quad(q,U,d,at,ft,nt,nt,nt,nt,ct&&[ct[3],ct[2],ct[1],ct[0]]);for(let at=0;at<3;at++){const d=-at*S/3,U=-(at+1)*S/3;rt(_(H,d,I),_(H+.42,U,I),_(H+.42,U,n),_(H,d,n),R,1.8,[[I,at,1,0],[I,at+1,1,0],[n,at+1,1,0],[n,at,1,0]]),rt(_(H+.42,U,I),_(H+.2,U,I),_(H+.2,U,n),_(H+.42,U,n),R,1.35,[[I,at+.3,1,0],[I,at+.7,1,0],[n,at+.7,1,0],[n,at+.3,1,0]]),H+=.2}let lt=H;(t.eaveBand??!0)&&(lt=H-1,rt(_(H,-S,I),_(lt,-S,I),_(lt,-S,n),_(H,-S,n),R,1.35,[[I,3.02,1,0],[I,4.98,1,0],[n,4.98,1,0],[n,3.02,1,0]])),rt(_(lt,-S,I),_(1.2,-S,I),_(1.2,-S,n),_(lt,-S,n),R,1,[[I,lt,3,0],[I,1.2,3,0],[n,1.2,3,0],[n,lt,3,0]])}await W.yield();const Q=t.NV??14;for(const[V,I]of[[K,1],[B,-1]])for(let n=0;n<Q;n++){const H=A*(n/Q),_=A*((n+1)/Q),rt=I>0==y>0,lt=(d,U,q)=>{const ft=s(y,Math.max(d,.02),V,U);return ft[2]=V-I*q*.17,d<.05&&(ft[0]=0),ft},at=(d,U,q,ft,nt,ct)=>rt?m.quad(d,U,q,ft,R,nt,nt,nt,nt,ct):m.quad(ft,q,U,d,R,nt,nt,nt,nt,ct&&[ct[3],ct[2],ct[1],ct[0]]);for(let d=0;d<3;d++){const U=-d*S/3,q=-(d+1)*S/3;at(lt(H,U,d),lt(H,q,d),lt(_,q,d),lt(_,U,d),1.2,[[H,d,1,0],[H,d+1,1,0],[_,d+1,1,0],[_,d,1,0]]),m.ex=[H,0,3,0],at(lt(H,q,d),lt(H,q,d+1),lt(_,q,d+1),lt(_,q,d),1)}}await W.yield()}const j=(y,g)=>{const k=y<0?-1:1,J=Math.abs(y)*2.1+.02,Y=.5*Math.cos(y*Math.PI*.5)+.12,Q=s(k,J,g,Y);return Math.abs(y)<.001&&(Q[0]=0),Q};for(let y=0;y<$;y++)for(let g=0;g<b;g++){const k=-1+2*g/b,J=k+2/b;m.quad(j(k,z[y]),j(k,z[y+1]),j(J,z[y+1]),j(J,z[y]),R,1.15,1.15,1.15,1.15,[[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0]])}for(const y of[B,K])for(let g=0;g<b;g++){const k=-1+2*g/b,J=k+2/b,Y=j(k,y),Q=j(J,y),V=s(1,.02,y,-.2);V[0]=0,y===K?m.tri(Y,V,Q,R,1.2,.8,1.2,[[0,0,1,0],[0,1,1,0],[0,0,1,0]]):m.tri(Q,V,Y,R,1.2,.8,1.2,[[0,0,1,0],[0,1,1,0],[0,0,1,0]])}await W.yield();const et=[],ot=t.nB??Math.round((K-B)/2.35),P=N(R,1.25);for(let y=0;y<ot;y++){const g=B+.9+(K-B-1.8)*(y/(ot-1))+E.range(-.12,.12),k=E.range(.34,.42),J=s(1,.02,g,.95);J[0]=0,et.push([0,J[1]+k,g]),m.ex=[0,0,2,0];for(const Y of[1,-1]){const Q=s(Y,1.3,g,.78),V=s(Y,2.9+E.range(-.2,.25),g+E.range(-.1,.1),.5);m.cyl(J,Q,k,k*.95,p,P),m.cyl(Q,V,k*.95,k*.8,p,P,{cap:!0,capCol:N(R,1.7)})}if(y<ot-1&&y%2===0){const Y=g+1.15,Q=s(1,.02,Y,0)[1];a.cyl([-1.3,Q-.4,Y-.1],[.62,Q+1.6,Y-.1],.1,.075,5,D,{cap:!0}),a.cyl([1.3,Q-.4,Y+.1],[-.62,Q+1.6,Y+.1],.1,.075,5,D,{cap:!0}),a.box(0,Q+.93,Y,.34,.3,.46,N(R,.75),{gb:.9})}}await W.yield();for(const y of[1,-1])for(const g of[.75,2.2])for(let k=0;k<C;k++){const J=B-.5+(K-B+1)*(k/C),Y=B-.5+(K-B+1)*((k+1)/C);a.cyl(s(y,g,Math.max(B,J),g<1?1.5:1.1).map((Q,V)=>V===2?J:Q),s(y,g,Math.min(K,Y),g<1?1.5:1.1).map((Q,V)=>V===2?Y:Q),.07,.07,t.PS?4:5,D,{cap:k===0||k===C-1})}return{surf:s,SL:Z,zs:z,perches:et}}async function ke(m,a={}){const t=m.rng.fork("sixty-fountains-hero"),W=m.noise,B=m.quality?.detail??1,K=(a.palette&&a.palette.length>=7?a.palette:Be).map(Te),[X,A,S,st,E,R,D]=K,Z=new u.Vector3(.71,.37,-.6).normalize();a.sunDir&&Z.fromArray(a.sunDir).normalize();const F=Z.x>=0?1:-1,s=1.5,$=a.houseLength??t.range(28,32),v=7,b=v-$,p=9,C=s+24,z=22,j=1.1,et=a.storeys??(t.chance(.7)?4:3),ot=a.fruit??t.range(.7,1),P={xMin:-26.5,xMax:26.5,zMin:b-4.5,zMax:31},y=St(N(X,.9),[.085,.055,.035],.6),g=()=>N(St(y,[.16,.12,.085],t()*t()),t.range(.75,1.3)),k=St(N(A,1.8),[.3,.29,.27],.22),J=[.3,.25,.16],Y=N(st,.8),Q=[.5,.46,.38],V=()=>{const e=t.range(.13,.3);return St([e,e*1.02,e*1.05],t.chance(.25)?[.12,.17,.08]:[.32,.3,.26],t()*.45)},I=[.6,.68,.76],n=new jt(0),H=new jt(4),_=new jt(3),rt=[],lt={};{const e=[.58,.5,.44],r=(f,w,M,x,T,L,O)=>{const tt=Math.hypot(M-f,x-w),G=Math.atan2(-(x-w),M-f);let it=0;e.forEach((At,Wt)=>{let Dt=-t()*.6;const Ce=Wt*.11;for(;Dt<tt;){const Yt=t.range(.7,1.6),ie=Dt+Yt/2,le=f+(M-f)*(ie/tt),Ae=w+(x-w)*(ie/tt);if(!(O&&Math.abs(le)<O)){const Pe=t.range(.55,.8),fe=.32-Ce+t.range(-.05,.05);let Ot=V();Wt===2&&t.chance(.3)&&(Ot=St(Ot,I,.35)),Wt===0&&(Ot=N(Ot,.8)),n.box(le+T*fe*.5,it+At/2,Ae+L*fe*.5,Yt-.04,At-.03,Pe,Ot,{ry:G,tx:t.range(.86,.98),tz:t.range(.8,.95),gb:.7,noBottom:!0,lean:[0,0]})}Dt+=Yt}it+=At})};r(P.xMin,P.zMax,P.xMax,P.zMax,0,1,3.6),r(P.xMax,P.zMax,P.xMax,P.zMin,1,0),r(P.xMax,P.zMin,P.xMin,P.zMin,0,-1),r(P.xMin,P.zMin,P.xMin,P.zMax,-1,0),await m.yield();const c=26,o=Math.round((P.zMax-P.zMin)/2),i=f=>P.xMin+(P.xMax-P.xMin)*(f/c),l=f=>P.zMin+(P.zMax-P.zMin)*(f/o),h=(f,w)=>{const M=.5+.5*W.fbm2(f*.09,w*.09,3),x=Math.min(1,Math.max(0,.5+W.fbm2(f*.05+9,w*.05,2)*1.3-F*f*.02-(w>v?.25:0))),T=Math.max(0,1-Math.abs(f)/2.6)*(w>v?1:0);return St(St(St([.2,.165,.12],[.3,.26,.2],M),[.34,.31,.26],T*.6),I,x*x*.5*(1-T*.7))};for(let f=0;f<o;f++)for(let w=0;w<c;w++){const M=i(w),x=i(w+1),T=l(f),L=l(f+1),O=[[M,L],[x,L],[x,T],[M,T]],tt=[0,1,2,0,2,3];for(const G of tt)n.vert([O[G][0],s,O[G][1]],0,1,0,h(O[G][0],O[G][1]),1)}for(let f=v+3.2;f<P.zMax-.3;){const w=t.range(.7,1.15),M=t.int(1,2);for(let x=0;x<M;x++)n.box((x-(M-1)/2)*1.25+t.range(-.12,.12),s+.03,f+w/2,t.range(.95,1.2),.1,w-.08,N(V(),1.15),{ry:t.range(-.08,.08),tx:.94,tz:.94,noBottom:!0});f+=w}for(let f=0;f<5;f++)n.box(0,s-.15-f*.3,P.zMax+.3+f*.55,7.2+f*.1,.3,.75,N(V(),1.1),{tx:.99,tz:.96,gb:.75,noBottom:!0});for(const f of[-1,1])n.box(f*4,s-.55,P.zMax+1.5,.7,1.9,3.2,V(),{tx:.85,tz:.9,gb:.7,noBottom:!0});lt.terrace={y:s,...P},lt.stairs={z0:P.zMax,z1:P.zMax+3.1,halfWidth:3.7}}await m.yield();const at=await pe(H,n,{z0:b-1.3,z1:v+1.3,ridgeY:C,dTop:z,TH:j,noise:W,rng:t,straw:k,timber:g(),ridgeSag:t.range(.25,.45)},m),d=at.surf;await m.yield();const U=(e,r,c,o,i,l,h)=>{const[f,w]=h,M=Math.abs(w),x=Math.abs(f),T=g(),L=t.chance(.2)?St(Y,[.62,.55,.36],.35):N(Y,t.range(.9,1.05));n.box(e+f*.05,r,c+w*.05,M*o+x*.06,i,x*o+M*.06,L,{gb:.92,top:1,noBottom:!0});const O=(G,it,At,Wt)=>n.box(e+f*.1+M*G,r+it,c+w*.1+x*G,M*At+x*.07,Wt,x*At+M*.07,T,{gb:1,top:1,noBottom:!0});O(0,i/2,o+.12,.09),O(0,-i/2,o+.12,.11),O(-o/2,0,.09,i),O(o/2,0,.09,i);for(let G=1;G<l;G++)O(-o/2+o*G/l,0,.045,i);const tt=Math.max(1,Math.round(i/.75));for(let G=1;G<tt;G++)O(0,-i/2+i*G/tt,o,.04)};for(const e of[1,-1]){const r=e*p,c=Math.round($/2.5),o=$/c;n.box(r,s+.2,(v+b)/2,.7,.4,$+.4,N(V(),.9),{noBottom:!0}),n.box(r,s+.52,(v+b)/2,.34,.26,$+.2,g(),{noBottom:!0});for(let i=0;i<=c;i++)n.box(r+e*.06,s+2.5,b+i*o,.32,4.2,.32,g(),{noBottom:!0,gb:.7});for(let i=0;i<c;i++){const l=b+(i+.5)*o,h=t();if(h<.4)for(let f=0;f<5;f++)n.box(r-e*.02+t.range(-.015,.015),s+2.6,l+(f-2)*(o-.3)/5,.08,4,(o-.3)/5-.015,g(),{noBottom:!0,gb:.75});else n.box(r-e*.04,s+2.6,l,.08,4,o-.3,h<.62?N(Q,t.range(.8,1.05)):g(),{noBottom:!0,gb:.7}),h>=.62&&U(r,s+2,l,o-.7,1.9,3,[e,0]),n.box(r,s+.95,l,.1,.6,o-.3,g(),{noBottom:!0})}n.box(r+e*.05,s+3.2,(v+b)/2,.3,.3,$+.6,g(),{noBottom:!0})}await m.yield();const q=e=>Math.min(s+6.1+(p-Math.abs(e))*6,C-2.3-ce*Math.abs(e)),ft=e=>Math.min(p,(C-2.3-e)/ce),nt=et===4?[4.3,8.7,12.7,16.2,18.9]:[4.3,9.4,14.2,18.4],ct=(e,r,c)=>{const o=i=>e+r*i;for(let i=0;i<40;i++){const l=-p+i*2*p/40,h=l+2*p/40,f=g(),w=t.range(0,.03),M=[l,s+.3,o(w)],x=[h,s+.3,o(w)],T=[h,q(h),o(w)],L=[l,q(l),o(w)];r>0?n.quad(M,x,T,L,f,.7,.7,1,1):n.quad(x,M,L,T,f,.7,.7,1,1)}for(const i of[1,-1]){n.beam([i*(p+.5),q(p)-.75,o(.3)],[0,C-2.35,o(.3)],.5,.42,g()),n.beam([i*(p+.2),q(p)+.95,o(.95)],[0,C-.95,o(.95)],.24,.24,g());for(let l=0;l<6;l++){const h=.08+l*.17,f=i*(p+.4)*(1-h),w=q(p)-.2+(C-2-q(p))*h;n.cyl([f,w,o(-.2)],[f,w,o(1.25)],.085,.07,5,g(),{cap:!0,capCol:[.3,.24,.16]})}}for(const i of[-p,-6,-3,0,3,6,p])c&&i===0||n.box(i,(s+q(i))/2,o(.1),.3,q(i)-s,.26,g(),{noBottom:!0,gb:.7});if(c)for(const i of[-1.75,1.75])n.box(i,s+1.9,o(.12),.32,3.8,.3,g(),{noBottom:!0,gb:.7});nt.forEach((i,l)=>{const h=s+i,f=ft(h)+.55;n.box(0,h,o(.2),f*2,.34,.42,g(),{gb:.8});for(const G of[1,-1])n.box(G*f,h,o(.25),.3,.4,.62,N(st,.5),{gb:.8});if(l===nt.length-1){const G=ft(h+1.5)-.2;if(G>.3){n.box(0,h+.95,o(.08),G*2,1.3,.06,[.012,.012,.014],{noBottom:!0,gb:1});for(let it=-2;it<=2;it++)n.box(it*G*.38,h+.95,o(.14),.07,1.3,.06,g(),{noBottom:!0})}return}const w=s+nt[l+1],M=w-h-1.5,x=h+.62+M/2,T=ft(x+M/2)-.75;if(T<.7)return;const L=Math.max(1,Math.floor(T*2/1.5)),O=T*2/L,tt=t();for(let G=0;G<L;G++){const it=-T+(G+.5)*O;tt<.15&&t.chance(.5)?n.box(it,x,o(.07),O-.2,M,.07,g(),{noBottom:!0}):t.chance(.1)?(n.box(it,x,o(.04),O-.2,M,.05,[.012,.012,.014],{noBottom:!0,gb:1}),U(it+O*.22,x,o(.04),(O-.2)*.5,M,2,[0,r])):U(it,x,e,O-.2,M,3,[0,r])}n.box(0,h+.36,o(.3),T*2+.5,.08,.5,g(),{gb:.8})})};ct(v,1,!0),await m.yield(),ct(b,-1,!1),lt.gableApex=new u.Vector3(0,C+.6,v+1.3),await m.yield();const pt=[.3,.25,.15],zt=St([.025,.05,.17],N(S,.35),.25),gt=(a.paperGlow??0)>1?.55:1,Pt=(e,r,c,o,i,l)=>{const h=l??(t()<ot?0:t.chance(.5)?1:2),f=[0,i,0],w=[o,i,0];if(_.quad([e-.03,r,c],[e+.03,r,c],[e+.03,r-o,c],[e-.03,r-o,c],pt,1,1,1,1,[f,f,w,w]),_.quad([e,r,c-.03],[e,r,c+.03],[e,r-o,c+.03],[e,r-o,c-.03],pt,1,1,1,1,[f,f,w,w]),h===0)for(let M=.2;M<o;M+=.165){const x=N(St(E,[.36,.09,.015],t()<.2?t.range(.3,.7):t()*.15),t.range(.8,1.15));rt.push(e+t.range(-.035,.035),r-M,c+t.range(-.035,.035),t.range(.082,.105),M,i,x[0],x[1],x[2])}else if(h===1)for(let M=.25;M<o;M+=.3)for(let x=0;x<3;x++){const T=t.range(0,6.28),L=e+Math.cos(T)*.07,O=c+Math.sin(T)*.07;_.ex=[M,i,0];const tt=N(St(D,[.75,.55,.2],t()),t.range(.7,1));x<2&&me(_,[L,r-M,O],[L+Math.cos(T)*.05,r-M-.3,O+Math.sin(T)*.05],tt,5,gt,2)}else for(let M=.1;M<o-.5;M+=.75){_.ex=[M+.4,i,0];const x=t.range(-.03,.03);ve(_,e,r-M,c,x,t.range(.7,.82),5,gt)}},vt=(e,r,c,o,i,l,h,f)=>{for(let w=0;w<i;w++)for(let M=0;M<o-w%2;M++){const x=t.range(.11,.15),T=(M+w%2*.5)*.27+t.range(-.02,.02),L=r+.14+w*.235,O=f*t.range(.85,1.08),tt=N(St([.2,.15,.1],[.11,.09,.07],t()),t.range(.8,1.2)),G=N([.5,.4,.26],t.range(.7,1.15));l==="z"?n.cyl([e+T,L,c],[e+T,L,c+h*O],x,x,5,tt,{cap:!0,capCol:G}):n.cyl([e,L,c+T],[e+h*O,L,c+T],x,x,5,tt,{cap:!0,capCol:G})}},wt=(e,r,c)=>{const o=f=>e+r*f,i=s+3.98,l=s+3.12,h=()=>N(St([.2,.19,.17],y,t()*.6),t.range(.8,1.25));for(let f=0;f<46;f++){const w=-9.66+f*.42+.21,M=t.range(-.06,.1);n.beam([w,i+t.range(0,.03),o(.1)],[w,l+M*.3,o(2.75+M)],.4,.05,h(),{gb:.7})}for(const f of[.95,2.05]){const w=i+(l-i)*((f-.1)/2.65)+.08;n.box(0,w,o(f),19.5,.07,.1,g(),{noBottom:!0});for(let M=0;M<13;M++){const x=t.range(.22,.38);n.box(-9+M*1.5+t.range(-.4,.4),w+.04+x*.3,o(f),x*1.3,x*.62,x,N(V(),1.2),{ry:t.range(0,3),tx:.55,tz:.6,noBottom:!0})}}n.box(0,l-.1,o(2.5),19.6,.24,.24,g(),{gb:.8});for(const f of[-9.3,-5.5,-1.85,1.85,5.5,9.3])n.box(f,s+1.5,o(2.5),.22,3,.22,g(),{noBottom:!0,gb:.7}),n.box(f,s+.08,o(2.5),.5,.16,.5,V(),{tx:.8,tz:.8,noBottom:!0});if(c)for(const f of[-1,1])for(let w=2.25;w<9.1;w+=.34)Math.abs(w-5.5)<.3||Pt(f*w,l-.24,o(2.5),t.range(1.15,1.75),t.range(0,6.28))};wt(v,1,!0),await m.yield(),wt(b,-1,!1),await m.yield();{n.box(0,s+1.6,v+.05,3.2,3.2,.08,[.012,.011,.012],{noBottom:!0,gb:1}),n.box(-.82,s+1.55,v+.16,1.5,3,.07,g(),{noBottom:!0}),n.box(0,s+3.28,v+.2,3.9,.3,.4,g());for(let e=-1;e<=1;e++){const r=t.range(0,6.28),c=e*1.04-.49,o=c+.98,i=s+3.1,l=v+.42,h=N(zt,t.range(.85,1.2));for(let w=0;w<4;w++){const M=i-w*.33,x=M-.33,T=[w*.33,r,1],L=[(w+1)*.33,r,1];_.quad([c,x,l],[o,x,l],[o,M,l],[c,M,l],h,.85,.85,1,1,[L,L,T,T])}const f=[.7,r,1];_.quad([c+.27,i-.92,l+.012],[o-.27,i-.92,l+.012],[o-.27,i-.48,l+.012],[c+.27,i-.48,l+.012],N(st,.8),1,1,1,1,[f,f,f,f])}for(const e of[-1,1]){for(let r=0;r<4;r++){const c=e*(2.8+r*1.75);e<0&&r>=2||(U(c,s+2.05,v+.1,1.5,2.1,3,[0,1]),n.box(c,s+.72,v+.14,1.6,.55,.06,g(),{noBottom:!0}))}n.box(e*5.5,s+.36,v+.85,7.1,.1,1.35,N([.24,.19,.13],t.range(.8,1.1)),{gb:.8});for(let r=0;r<4;r++)n.box(e*(2.3+r*2.1),s+.16,v+1.4,.16,.32,.16,g(),{noBottom:!0})}vt(-9,s+.4,v+.3,14,6,"z",1,.85);for(const[e,r,c,o]of[[7.4,v+3.6,.55,1.05],[8.5,v+3.9,.38,.5]]){n.cyl([e,s,r],[e,s+o,r],c*.9,c,10,[.2,.15,.1],{cap:!0,capCol:[.05,.07,.09]});for(const i of[.2,.8])n.cyl([e,s+o*i-.04,r],[e,s+o*i+.04,r],c*1.02,c*1.03,10,[.05,.045,.04])}}await m.yield(),vt(-8.6,s,b-.35,22,8,"z",-1,.9),vt(3.2,s,b-.35,12,5,"z",-1,.9),n.box(.6,s+1.5,b-.08,1.6,3,.08,g(),{noBottom:!0}),await m.yield();{const e=F*(p+1.3),r=s+3.45;n.cyl([e,r,b+1.2],[e,r+.05,v-1.2],.06,.05,6,g(),{cap:!0});for(let i=b+1.6;i<v-1;i+=4.9)n.beam([F*p,r+.25,i],[e+F*.2,r-.06,i],.1,.12,g());let c=0;for(let i=b+1.6;i<v-1.4;i+=.37)c++,!(c%16>12||Math.abs(i-(v-6.2))<1.1)&&Pt(e,r-.04,i,t.range(1.5,2.1),t.range(0,6.28));const o=v-6.2;for(const i of[-.3,.3]){n.beam([F*13.6,s,o+i],d(F,z+.1,o+i,.3),.07,.11,g());for(let l=0;l<4;l++)n.beam(d(F,z+.1-l*3.4,o+i,.3),d(F,z-3.3-l*3.4,o+i,.3),.07,.11,g())}for(let i=z-.2;i>z-13.4;i-=.42)n.cyl(d(F,i,o-.3,.3),d(F,i,o+.3,.3),.03,.03,4,g());for(let i=1;i<13;i++){const l=i/13,h=d(F,z+.1,o,.3);n.cyl([F*13.6+(h[0]-F*13.6)*l,s+(h[1]-s)*l,o-.3],[F*13.6+(h[0]-F*13.6)*l,s+(h[1]-s)*l,o+.3],.03,.03,4,g())}}await m.yield();{const e=-F,r=e*(p+1.55),c=(v+b)/2;for(let o=b+.8;o<=v-.6;o+=2.55)n.cyl([r,s,o],[r+e*-.18,s+3.9,o],.075,.06,5,g(),{cap:!0});for(const o of[1.1,2.9])n.cyl([r-e*.05*o,s+o,b+.4],[r-e*.05*o,s+o+.05,v-.3],.05,.05,5,g(),{cap:!0});for(let o=b+2.05;o<c-.5;o+=2.5){const i=N(J,t.range(.8,1.2)),l=t.range(.25,.4);for(let h=0;h<8;h++)n.box(r+e*(.12+h%2*.03),s+1.75,o-1.2+(h+.5)*.3,.06,3.5,.29,N(i,t.range(.78,1.18)),{lean:[-e*l,0],gb:.72,noBottom:!0});for(const h of[.6,1.7,2.8])n.box(r+e*.17-e*l*(h/3.5),s+h,o,.05,.07,2.44,N(i,.5),{noBottom:!0})}for(let o=0;o<2;o++)n.cyl([r+e*(.9+o*.5),s+.24,c+1+o*.3],[r+e*(1+o*.5),s+.24,c+3.6+o*.5],.24,.24,8,N(J,.9+o*.2),{cap:!0,capCol:N(J,.5)});vt(e*(p+.25),s,c+4.5,Math.floor((v-c-6)/.27),6,"x",e,.8)}await m.yield();{for(const r of[-1,1]){const c=r*10.4,o=27.2,i=V(),l=St(i,[.13,.19,.08],.5);n.box(c,s+.16,o,1,.32,1,i,{tx:.85,tz:.85,noBottom:!0}),n.box(c,s+.95,o,.36,1.3,.36,i,{tx:.85,tz:.85,noBottom:!0}),n.box(c,s+1.69,o,.92,.18,.92,i,{tx:1.1,tz:1.1}),n.box(c,s+2.06,o,.6,.56,.6,N(i,1.1),{noBottom:!0});for(const[h,f]of[[1,0],[-1,0],[0,1],[0,-1]])n.box(c+h*.3,s+2.06,o+f*.3,f?.3:.03,.3,h?.3:.03,[.015,.014,.013],{gb:1,noBottom:!0});n.box(c,s+2.5,o,1.25,.34,1.25,l,{tx:.3,tz:.3,gb:.8}),n.box(c,s+2.8,o,.22,.3,.22,l,{tx:.4,tz:.4,noBottom:!0})}const e=(r,c,o,i)=>{for(const l of[r,(r+c)/2,c])n.cyl([l,s,o],[l,s+3.4,o],.07,.055,5,g(),{cap:!0});for(const l of[3.15,2])if(n.cyl([r-.4,s+l,o+.08],[c+.4,s+l+.04,o+.08],.045,.04,5,N(D,.35),{cap:!0}),i&&l>3)for(let h=r+.3;h<c-1.2;h+=t.range(1.5,2.2)){const f=t.range(0,6.28),w=t.range(1,1.5),M=t.range(1.5,2.3),x=t.chance(.25)?N(st,.75):N(zt,t.range(.8,1.5)),T=o+.08;for(let L=0;L<5;L++){const O=s+l-L*M/5,tt=O-M/5,G=[L*M/5,f,1],it=[(L+1)*M/5,f,1];_.quad([h,tt,T],[h+w,tt,T],[h+w,O,T],[h,O,T],x,.85,.85,1,1,[it,it,G,G])}}else for(let h=r;h<c;h+=.26)Pt(h,s+l-.03,o+.08,l>3?.95:1,t.range(0,6.28),t.chance(.85)?2:1)};e(-22.5,-14.5,12.5+t.range(-1,1),!0),e(14,22,12+t.range(-1,1),!1)}await m.yield();for(const e of[-1,1]){const r=e*19.6+t.range(-.6,.6),c=b+2,o=v-5,i=Math.floor((o-c)/3.2);for(let l=0;l<=i;l++){const h=c+(o-c)*(l/i);n.cyl([r-.55,s,h],[r+.07,s+3.35,h],.06,.05,5,g()),n.cyl([r+.55,s,h],[r-.07,s+3.35,h],.06,.05,5,g())}for(const l of[3.05,1.7]){n.cyl([r,s+l,c-.5],[r,s+l+.04,o+.5],.05,.05,5,g(),{cap:!0});for(let h=c;h<o;h+=.43){if(t.chance(l>2?.06:.22))continue;const f=t.range(1,1.3),w=N(St(k,[.5,.39,.19],t.range(.2,.75)),t.range(.85,1.2)),M=l<2?.3:.2;H.ex=[0,0,2,0];for(const x of[-1,1])H.box(r+x*M,s+l-f/2+.1,h+t.range(-.03,.03),.22,f,.4,w,{tx:.45,tz:.55,lean:[-x*(M-.07),0],gb:.8,top:1})}}}await m.yield();{const e=(l,h,f,w,M,x,T)=>{const L=Math.hypot(h,f,w)||1,O=t.range(0,6.28),tt=Math.cos(O)*x,G=Math.sin(O)*x,it=[0,0,5,0],At=[0,0,5,1];H.tri([l[0]-tt,l[1],l[2]-G],[l[0]+tt,l[1],l[2]+G],[l[0]+h/L*M,l[1]+f/L*M,l[2]+w/L*M],T,.8,.8,1.2,[it,it,At])},r=b-1.3,c=v+1.3,o=N(k,1.35),i=[.1,.17,.05];for(const l of[1,-1]){for(let h=Math.round((c-r)*13*B);h>0;h--)e(d(l,z+t.range(-.4,.6),t.range(r,c),t.range(-.3,.04)),l*(.5+t.range(-.3,.5)),-.866+t.range(-.2,.5),t.range(-.3,.3),t.range(.3,.75),.06,o);await m.yield();for(const[h,f]of[[c,1],[r,-1]])for(let w=Math.round(120*B);w>0;w--)e(d(l,t.range(.3,z),h,t.range(-.2,.03)),l*t.range(0,.5),t.range(0,.5),f,t.range(.25,.55),.055,o);await m.yield();for(let h=Math.round(330*B);h>0;h--){const f=l!==F&&t.chance(.55);e(d(l,t.range(1,z),t.range(r,c),0),l*.9,-.2+t.range(0,.6),t.range(-.4,.4),t.range(.25,.5),f?.09:.05,f?i:o)}await m.yield()}for(let l=Math.round((c-r)*10*B);l>0;l--){const h=t.sign();e(d(h,t.range(.05,2.6),t.range(r,c),.75),h*t.range(-.2,.8),1,t.range(-.5,.5),t.range(.25,.5),.05,o)}}await m.yield();const yt=new u.Group;yt.name="sixty-fountains-hero";const Bt=18,kt=23,Vt=Math.atan2(1.6,1.9),ht=Math.hypot(1.9,1.6)+.1,_t=[],ut=[],mt=N(D,.9),xt=[];[-1,1].forEach((e,r)=>{n.m=new u.Matrix4().makeRotationY(e<0?0:Math.PI).setPosition(e*kt,s,Bt),n.box(0,.1,0,3.5,.2,3.5,V(),{tx:.96,tz:.96,noBottom:!0});for(const[i,l]of[[1,1],[1,-1],[-1,1],[-1,-1]])n.box(i*1.42,.86,l*1.42,.17,1.32,.17,g(),{noBottom:!0});for(let i=0;i<7;i++){const l=-1.26+i*.42,h=f=>1.25+(1.9-Math.abs(f))*.842-.13;for(const f of[1,-1])n.box(f*1.45,.82,l,.06,1.24,.4,g(),{noBottom:!0,gb:.7});for(const f of[1,-1]){const w=l-.2,M=l+.2,x=f*1.45,T=g(),L=[w,.2,x],O=[M,.2,x],tt=[M,h(M),x],G=[w,h(w),x];f>0?(n.quad(L,O,tt,G,T,.7,.7,1,1),n.quad(O,L,G,tt,N(T,.5),1,1,1,1)):(n.quad(O,L,G,tt,T,.7,.7,1,1),n.quad(L,O,tt,G,N(T,.5),1,1,1,1))}}n.box(1.49,1,.7,.03,.42,.42,N(R,.9),{noBottom:!0,gb:1}),n.cyl([0,.2,0],[0,1.4,0],.2,.17,8,N(R,.85)),n.cyl([0,1.38,0],[0,1.5,0],.27,.27,8,N(R,.6),{cap:!0}),n.cyl([0,.55,-.45],[0,.55,.45],.09,.09,6,N(R,.7),{cap:!0,capCol:mt}),n.box(0,1.6,0,.34,.26,.34,mt,{tx:.8,tz:.8}),n.cyl([.02,1.55,0],[.52,2.07,0],.13,.08,8,mt,{k1:1.2}),n.cyl([.46,2.01,0],[.57,2.12,0],.11,.1,8,N(mt,1.3),{cap:!0,capCol:[.02,.02,.02]}),n.cyl([-.1,1.6,-.42],[-.1,1.6,.42],.03,.03,5,[.03,.03,.03],{cap:!0}),n.cyl([.1,.25,.3],[1.2,.25,1.9],.07,.07,6,N(st,.45)),n.m=null;const c=new u.Group;c.position.set(e*kt,s,Bt),c.rotation.y=e<0?0:Math.PI,yt.add(c);const o=t.chance(.62);for(const i of[1,-1]){const l=new jt(4),h=o?.3:.06,f=1.85;if(o){l.ex=[0,0,1,0],l.box(-ht/2,h/2,0,ht,h,f*2,N(k,1.15),{gb:1,top:1}),l.ex=[0,0,6,0],l.box(-ht/2,-.03,0,ht-.12,.06,f*2-.1,g(),{gb:1});const x=(T,L)=>h+.015+.07*Math.sin(-T/ht*Math.PI)*Math.cos(L/f*1.2);for(let T=0;T<4;T++)for(let L=0;L<4;L++){const O=-ht+ht*T/4,tt=O+ht/4,G=-f+2*f*L/4,it=G+f/2,At=(Wt,Dt)=>[Dt+r*7,ht+Wt,0,0];l.quad([O,x(O,it),it],[tt,x(tt,it),it],[tt,x(tt,G),G],[O,x(O,G),G],k,1,1,1,1,[At(O,it),At(tt,it),At(tt,G),At(O,G)])}for(let T=0;T<46;T++){const L=t.range(-f,f),O=[0,0,5,0],tt=[0,0,5,1],G=T>30,it=G?-ht:0;l.tri([it,h*t(),L-.05],[it,h*t(),L+.05],[it+(G?-.1:t.range(.2,.42)),h+(G?t.range(.2,.4):-.1),L+t.range(-.1,.1)],N(k,1.3),.8,.8,1.2,[O,O,tt])}}else{l.ex=[0,0,6,0];for(let x=0;x<7;x++)l.box(-ht/2+t.range(-.04,.04),.03+x%2*.03,-f+(x+.5)*(f*2/7),ht,.05,f*2/7+.05,N([.21,.2,.18],t.range(.7,1.25)),{gb:1});for(const x of[-.5,-ht+.5])l.box(x,.12,0,.12,.08,f*2+.1,g(),{gb:1});for(let x=0;x<4;x++){const T=t.range(.2,.32);l.box(t.range(-ht+.4,-.4),.2+T*.25,t.range(-f+.3,f-.3),T*1.3,T*.6,T,N(V(),1.2),{tx:.55,tz:.6,ry:t()*3})}}for(const x of[-1.1,1.1])l.box(-.12,-.02,x,.34,.05,.1,[.05,.035,.03],{gb:1});const w=new u.Group;w.position.set(i*1.9,1.25,0),w.rotation.y=i>0?0:Math.PI,c.add(w);const M=l.build();ut.push(M),_t.push({pivot:w,geo:M,gi:r,lag:t.range(0,.18),swing:t.range(1.85,2.2)})}xt.push({position:[e*(kt-.56),s+2.11,Bt],azimuth:e<0?Math.PI/2:-Math.PI/2,sx:e})}),await m.yield();const Tt=t.range(0,6.28),dt=t.range(29,30.5),Mt=Fe(xt.map((e,r)=>({position:e.position,azimuth:e.azimuth,range:41.2+t.range(-.4,.5),spread:.1,apex:dt*t.range(.98,1.02),apexSpread:.05,tearAt:.31,lateral:.03,sweep:.07,sweepPhase:Tt+r*Math.PI,floorY:s,strips:34,drops:1500,width:1.1})),{rng:t.fork("water"),sunDir:a.sunDir,sunColor:a.sunColor,wind:a.wind,water:a.palette?.[3],segments:22,detail:B});yt.add(Mt.object),await m.yield();const Ct=Mt.uniforms,$t=()=>u.UniformsUtils.clone(u.UniformsLib.fog),Zt=[];if(a.steam!==!1){const e={P:[],V:[],S:[],K:[]};for(const c of[1,-1])for(let o=Math.round(44*B);o>0;o--){const i=d(c,t.range(2,z-1),t.range(b,v),.4);e.P.push(i[0],i[1],i[2],c>0?-2:-3),e.V.push(c*t.range(.1,.5),t.range(.6,1.3),0,0),e.S.push(t.range(.6,1.2),t.range(2.6,4.2),t.range(4,7.5),t()),e.K.push(t.range(.05,.085),0,.3,1)}for(let c=0;c<3;c++){const o=b+$*(.2+.3*c+t.range(-.06,.06)),i=d(1,.02,o,1.2);Zt.push(new u.Vector3(0,i[1],o));for(let l=0;l<6;l++)e.P.push(t.range(-.5,.5),i[1]-.3,o+t.range(-1.2,1.2),-1),e.V.push(0,t.range(.7,1.2),0,0),e.S.push(t.range(.7,1.2),t.range(4,6),t.range(6,9),t()),e.K.push(t.range(.1,.16),1,.9,.8)}const r=Xt(e,Object.assign($t(),Ct),2);r.renderOrder=4,yt.add(r)}await m.yield();const Qt=xt.map(e=>new u.Vector3(-e.sx*16.6,s,Bt+1.2));{const e=[],r=[],c=[];Qt.forEach((l,h)=>{for(const[f,w]of[[-1,-1],[1,1],[1,-1],[-1,-1],[-1,1],[1,1]])e.push(l.x+f*6,s+.05,l.z+w*6),r.push(f,w),c.push(h)});const o=new u.BufferGeometry;o.setAttribute("position",new u.Float32BufferAttribute(e,3)),o.setAttribute("uv",new u.Float32BufferAttribute(r,2)),o.setAttribute("aGun",new u.Float32BufferAttribute(c,1));const i=new u.Mesh(o,new u.ShaderMaterial({uniforms:Object.assign($t(),Ct,{uSky:{value:new u.Color().setRGB(S[0],S[1],S[2])}}),defines:{NG:2},fog:!0,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,vertexShader:`
        attribute float aGun; varying vec2 vUv; varying float vWet; varying vec3 vW; uniform float uProg[NG];
        #include <fog_pars_vertex>
        void main(){ vUv = uv; vWet = smoothstep(0.8, 1., uProg[int(aGun + 0.5)]); vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz;
          vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        varying vec2 vUv; varying float vWet; varying vec3 vW; uniform float uTime; uniform vec3 uSky; uniform vec3 uSunCol;
        #include <fog_pars_fragment>
        ${Nt}
        void main(){
          float r = length(vUv) + (sfFbm(vW.xz*0.33) - 0.5)*0.6;
          float m = (1. - smoothstep(0.4, 0.98, r))*vWet;
          vec2 g = vW.xz*1.25; vec2 id = floor(g); vec2 f = fract(g) - 0.5; float h = sfHash(id);
          float ph = fract(uTime*(0.8 + h) + h*7.);
          float ring = (1. - smoothstep(0., 0.05, abs(length(f + (vec2(sfHash(id + 3.), sfHash(id + 7.)) - 0.5)*0.4) - ph*0.42)))*(1. - ph);
          float a = m*(0.55 + 0.4*ring);
          if (a < 0.004) discard;
          gl_FragColor = vec4(mix(vec3(0.015, 0.02, 0.025), uSky, 0.16) + uSunCol*(ring*0.7), clamp(a, 0., 1.));
          #include <fog_fragment>
          gl_FragColor.rgb = max(gl_FragColor.rgb, vec3(0.));
        }`}));i.renderOrder=1,yt.add(i)}const Kt=Ct.uSunSide;Kt.value=F;const we=[0,1,2].map(()=>new u.Vector4(t.range(b+3,v-3),t.sign()*t.range(4,17),t.range(.8,1.9),t.range(.9,2.1))),Jt=ge({uTime:Ct.uTime,uSunSide:Kt,uSunW:Ct.uSun,uMoss:{value:new u.Color(.095,.135,.05)},uFrost:{value:new u.Color(I[0],I[1],I[2])},uFresh:{value:new u.Color(.62,.47,.22)},uPatch:{value:we},uSL:{value:at.SL},uSnow:{value:a.snow??0},uBounce:{value:a.bounce??.5}}),te=`
    uniform float uTime;
    vec3 sfSway(float depth, float ph){ return vec3(sin(uTime*1.25 + ph)*0.6 + sin(uTime*2.9 + ph*1.7)*0.25, 0., cos(uTime*1.05 + ph*1.3)*0.5)*(0.05*depth); }`,xe={value:a.paperGlow??0},ee=new u.MeshStandardMaterial({vertexColors:!0,roughness:.92,metalness:0});ee.onBeforeCompile=e=>{e.uniforms.uLeaf={value:new u.Color(D[0],D[1],D[2])},e.uniforms.uPaperGlow=xe,e.uniforms.uFrost={value:new u.Color(I[0],I[1],I[2])},e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vOP; varying vec3 vON;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vOP = position; vON = normal;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vOP; varying vec3 vON; uniform vec3 uLeaf; uniform vec3 uFrost; uniform float uPaperGlow;`+Nt).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
{ float pg = smoothstep(0.42, 0.55, min(vColor.r, min(vColor.g, vColor.b)))*step(vON.y, 0.5); totalEmissiveRadiance += vec3(1.0, 0.62, 0.3)*(uPaperGlow*pg*(0.55 + 0.45*sfN(vOP.xy*0.9 + vOP.z))); }`).replace("#include <color_fragment>",`#include <color_fragment>
        { vec3 an = abs(vON); vec2 q = an.y > 0.6 ? vOP.xz : (an.x > an.z ? vOP.zy : vOP.xy);
          float g1 = sfFbm(q*1.7), g2 = sfN(q*vec2(23., 2.5)), g3 = sfN(q*31.);
          vec3 b = diffuseColor.rgb*(0.68 + 0.36*g1 + 0.2*g2 + 0.12*g3);
          if (vON.y > 0.9 && abs(vOP.y - ${s.toFixed(2)}) < 0.02) {
            b *= 0.93 + 0.14*smoothstep(0.5, 0.75, sfN(vOP.xz*9.));
            b = mix(b, uFrost, 0.3*smoothstep(0.45, 0.8, sfFbm(vOP.xz*0.45 + 11.))*(0.5 + 0.5*g3));
            float leaf = smoothstep(0.8, 0.86, sfN(vOP.xz*4.7))*smoothstep(0.55, 0.8, sfFbm(vOP.xz*0.11 + 5.));
            b = mix(b, uLeaf*0.7, leaf*0.85);
          }
          diffuseColor.rgb = b; }`)};const oe=new u.MeshStandardMaterial({vertexColors:!0,roughness:.9,metalness:0,side:u.DoubleSide});oe.onBeforeCompile=e=>{e.uniforms.uTime=Ct.uTime,e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
attribute vec3 aX;`+te).replace("#include <begin_vertex>",`#include <begin_vertex>
        transformed += sfSway(aX.x, aX.y) + vec3(0., 0., 1.)*(sin(position.x*2.6 + position.y*3.1 - uTime*3.4 + aX.y)*0.16*aX.x*aX.z);`)};const Rt=new u.SphereGeometry(1,5,3);Rt.scale(1,.88,1);const Ut=rt.length/9,Ht=new Float32Array(Ut*3),ae=new u.MeshStandardMaterial({roughness:.5,metalness:0});ae.onBeforeCompile=e=>{e.uniforms.uTime=Ct.uTime,e.uniforms.uSunW=Ct.uSun,e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
attribute vec3 iSw; varying vec3 vFp;`+te).replace("#include <begin_vertex>",`#include <begin_vertex>
vFp = position; transformed += sfSway(iSw.x, iSw.y)*iSw.z;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
uniform vec3 uSunW; varying vec3 vFp;`).replace("#include <color_fragment>",`#include <color_fragment>
        { vec3 fp = normalize(vFp + vec3(0., 1e-3, 0.));      // the calyx: a dark four-pointed cap where the fruit hangs from
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.06, 0.05, 0.025), 0.85*smoothstep(0.5, 0.66, fp.y)*(1. - smoothstep(0.5, 0.64, abs(fp.x) + abs(fp.z)))); }`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        { vec3 vd = normalize(vViewPosition); vec3 sunV = (viewMatrix*vec4(uSunW, 0.)).xyz;
          totalEmissiveRadiance += diffuseColor.rgb*(0.1 + 0.8*smoothstep(-0.3, 0.7, dot(sunV, -vd))); }`)};const qt=new u.InstancedMesh(Rt,ae,Ut),ne=new u.Matrix4,be=new u.Color;for(let e=0;e<Ut;e++){const r=e*9,c=rt[r+3];ne.makeScale(c,c,c).setPosition(rt[r],rt[r+1],rt[r+2]),qt.setMatrixAt(e,ne),qt.setColorAt(e,be.setRGB(rt[r+6],rt[r+7],rt[r+8])),Ht[e*3]=rt[r+4],Ht[e*3+1]=rt[r+5],Ht[e*3+2]=1/c}Rt.setAttribute("iSw",new u.InstancedBufferAttribute(Ht,3)),qt.frustumCulled=!1,await m.yield();const ye=new u.Mesh(await n.buildSlowly(m),ee);await m.yield();const Se=new u.Mesh(await H.buildSlowly(m),Jt);await m.yield();const Et=new u.Mesh(await _.buildSlowly(m),oe);Et.frustumCulled=!1,yt.add(ye,Se,Et,qt);for(const e of _t)e.mesh=new u.Mesh(e.geo,Jt),e.pivot.add(e.mesh);await m.yield();const bt=(e,r,c)=>new u.Vector3(e,r,c);Object.assign(lt,{portalSeat:{position:bt(0,9,v+14),facing:bt(0,0,1),radius:7},flyThrough:[bt(0,9,96),bt(0,9,80),bt(0,9,64),bt(0,9,48),bt(0,9,34),bt(0,9,v+14)],viewpoints:{reveal:bt(70,55,120),approach:bt(0,9,91),eaveSide:bt(F*30,6,v-4)},guns:xt.map(e=>({muzzle:bt(...e.position),toward:bt(-e.sx,0,0)})),crossing:bt(0,31,Bt),fallZones:Qt,ridge:[bt(0,C,v+1.3),bt(0,C,b-1.3)],smokeVents:Zt,roofPerches:at.perches.map(e=>bt(e[0],e[1],e[2]))});const Ft=[0,0];let Gt=0,Me=0;const re=()=>{for(let e=0;e<2;e++)Mt.setProgress(e,Ft[e]);for(const e of _t){const r=Math.min(1,Math.max(0,(Ft[e.gi]-.02*e.lag)/(.1+.1*e.lag))),c=r<.7?r/.7*(r/.7):1-.13*Math.sin((r-.7)/.3*Math.PI)*(1-(r-.7)/.3);e.pivot.rotation.z=-Vt-e.swing*c}},se={object:yt,radius:32,height:37,center:bt(0,14,10),anchors:lt,ground:!0,groundY:0,fountains:Mt,fine:[qt,Et],get progress(){return Math.min(Ft[0],Ft[1])},setProgress(e,r){e=Math.min(1,Math.max(0,e)),r===void 0?Ft[0]=Ft[1]=e:Ft[r]=e,Gt=0,re()},fire(e=2.4){Gt=1/Math.max(.2,e)},update(e,r,c){if(Gt>0){for(let o=0;o<2;o++)Ft[o]=Math.min(1,Ft[o]+e*Gt*(o?.92:1));re(),Ft[0]>=1&&Ft[1]>=1&&(Gt=0)}if(Mt.update(e,r,c,m.renderer),Me++%90===0){if(!a.sunDir){let o=yt;for(;o.parent;)o=o.parent;let i=null;o.traverse(l=>{!i&&l.isDirectionalLight&&(i=l)}),i&&(i.updateMatrixWorld(),i.target.updateMatrixWorld(),Ct.uSun.value.setFromMatrixPosition(i.matrixWorld).sub(It.setFromMatrixPosition(i.target.matrixWorld)).normalize())}yt.updateMatrixWorld(),It.copy(Ct.uSun.value).transformDirection(ze.copy(yt.matrixWorld).invert()),Kt.value=It.x>=0?1:-1}},dispose(){for(const e of ut)e.dispose()}},It=new u.Vector3,ze=new u.Matrix4;return se.setProgress(a.progress??1),se}export{Nt as GLSL_NOISE,jt as Geo,ke as buildHero,pe as buildRoof,me as hangCorn,ve as hangRadish,Fe as makeFountains,ge as makeThatchMaterial,Xt as makeVapour};
