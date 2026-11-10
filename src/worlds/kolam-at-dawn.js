import*as z from"three";import{makePath as co,clamp as Bt,lerp as H,smoothstep as wt,bell as eo}from"../kit/core.js";import*as qt from"../kit/fauna.js";import*as Ee from"../kit/fx.js";import{buildHero as ho,GLSL_COMMON as Xt}from"../parts/kolam-at-dawn.js";const at=Math.PI*2,Ot=["#1B2942","#3E5C8A","#A9B9D6","#F4F2EA","#E7B48B","#D8A23F","#C3352D"],x=m=>new z.Color(m),be=(m,o,C)=>x(m).lerp(x(o),C),te=-200,ot=24,ft=-270,oo=9,Ht=[-80,0,130],Se=1.15,fo=[50,165],po=38,mo=[-43.5,207],uo=20,Le=65*Math.PI/180,_e=[-150,0,-50],Re=[70,ot,-230],we=[216,108],vo=[-46,46,-68,68,-90,90,-112,112,-134,134].map(m=>[m,te-7.5]),$e=[-40,-243],Ce=[[-62,-236,.95],[-18,-249,.8],[-23,-216,1.5],[23,-216,1.5],[19,-251,.85]],fe=()=>z.UniformsUtils.clone(z.UniformsLib.fog),xo=.66,Ut=.6,yo=810,Ge=22,ao=33,so=.5,bo=640,wo=1200,Mo=re([[0,8],[.05,8.5],[.075,13],[.115,36],[.15,45],[.18,40],[.215,19],[.235,15.5],[.5,15.5]]),go=re([[0,46],[26,37],[60,28],[90,22],[118,20.5],[145,22],[172,30],[200,43],[226,45.5],[244,41],[268,32],[300,22],[330,17.5],[360,15.5]]);function re(m){return o=>{if(o<=m[0][0])return m[0][1];for(let C=1;C<m.length;C++)if(o<=m[C][0]){const k=m[C-1],P=m[C];return H(k[1],P[1],(o-k[0])/Math.max(1e-6,P[0]-k[0]))}return m[m.length-1][1]}}async function zo(m,o,C){const k=m.L,P=new z.Vector3,b=K=>m.pointAt(Bt(K,0,k-.01),P),V=m.landAt(0),S=m.pointAt(V,new z.Vector3),F=[],[D,B]=fo,v=po,w=Math.PI/180,R=K=>{for(;K>Math.PI;)K-=at;for(;K<-Math.PI;)K+=at;return K},A=(K,nt,ct)=>{let Q=0,ht=0,ut=0;for(let zt=-nt;zt<=nt;zt+=4)b(K+zt),Q+=P.x,ht+=P.z,ut++;return ct.x=Q/ut,ct.z=ht/ut,ct},T=V+22,M=Math.floor(yo/3),n=[],i={x:0,z:0},p={x:0,z:0},y={x:0,z:0},e={x:0,z:0,th:0,kap:0},r=(K,nt,ct)=>{const Q=R(Math.atan2(nt-e.z,K-e.x)-e.th);return e.kap+=Bt(Bt(Q*.07,-1/ct,1/ct)-e.kap,-.0032,.0032),e.th+=e.kap*3,e.x+=Math.cos(e.th)*3,e.z+=Math.sin(e.th)*3,Q};{let K=0,nt=-1;for(let ct=0;ct<=M;ct++){const Q=T+ct*3;A(Q+6,Ge,y),A(Q-16,Ge,i),A(Q+16,Ge,p);const ht=p.x-i.x,ut=p.z-i.z,zt=Math.hypot(ht,ut);zt>2&&(K=ht/zt,nt=ut/zt);let Vt=-K*so,St=1-nt*so;const Zt=Math.hypot(Vt,St);Vt/=Zt,St/=Zt,n.push({x:y.x+Vt*ao,z:y.z+St*ao,s:Q})}for(let ct=0;ct<2;ct++){const Q=n.map(ht=>({x:ht.x,z:ht.z}));for(let ht=0;ht<=M;ht++){let ut=0,zt=0,Vt=0;for(let St=Math.max(0,ht-5);St<=Math.min(M,ht+5);St++)ut+=Q[St].x,zt+=Q[St].z,Vt++;n[ht].x=ut/Vt,n[ht].z=zt/Vt}}}await C.yield();const L=Bt(S.x-1.5,-45,12),u=Math.max(n[0].z,S.z+34)+4,h=[[L,8,u+56],[L,8,u+28],[L,8,u]],l=56,a=44,t=-90*w,s=(K,nt)=>{e.x=L,e.z=u,e.th=-Math.PI/2,e.kap=0;let ct=0;for(let Q=1;Q<=a;Q++){const ht=Math.atan2(e.z,e.x)-K*.5,ut=n[Math.round(l*Q/a)].s;r(Math.cos(ht)*100,Math.sin(ht)*100,36),b(ut),ct+=Math.hypot(P.x-e.x,P.z-e.z)/a,nt&&Q%6===0&&nt.push({x:e.x,z:e.z,d:56+3*Q,s:ut})}return ct},d=(K,nt,ct)=>{for(let Q=1;Q<=70;Q++){if(Math.hypot(n[K].x-e.x,n[K].z-e.z)<9)return Q-1;r(n[K].x,n[K].z,34),nt&&Q%6===0&&nt.push({x:e.x,z:e.z,d:ct+3*Q,s:-2})}return-1},c=(K,nt)=>{let ct=0,Q=0;const ht=[];for(let ut=1;ut<200;ut++){const zt=e.x-D,Vt=e.z-B,St=Math.hypot(zt,Vt);if(Q=Math.atan2(Vt,zt),St<v+2.5)break;const Zt=Q-Math.acos(Bt(v/St,0,1));r(D+Math.cos(Zt)*v,B+Math.sin(Zt)*v,40),ct++,K&&ut%6===0&&ht.push([e.x,e.z,ct])}for(;Q<t+.5;)Q+=at;if(K)for(const ut of ht)(ct-ut[2])*3>13&&K.push({x:ut[0],z:ut[1],d:nt+ut[2]*3,s:-1});return{len:ct*3,phi:Q}};let f=null;for(const K of[1,-1])for(let nt=l+14;nt<=l+86;nt+=4){nt%24===6&&await C.yield();const ct=s(K,null),Q=d(nt,null,0);if(Q<5)continue;const ht={...e};for(let ut=0;ut<=16&&(e.x=ht.x+Math.cos(ht.th)*3*ut,e.z=ht.z+Math.sin(ht.th)*3*ut,e.th=ht.th,e.kap=0,!(e.z<-95||Math.abs(e.x)>120));ut+=4){const zt=c(null,0),Vt=56+3*(a+Q+ut)+zt.len+(zt.phi-t)*v,St=Math.abs(Vt-bo)+.15*zt.len+.5*Math.abs(Q*3-100)*.3+(zt.len>400?500:0)+.12*Math.max(0,ct-90);(!f||St<f.score)&&(f={score:St,dir:K,k:nt,ext:ut})}}f||(f={dir:1,k:l+30,ext:0});const q=[],W=f.dir;s(W,q);const I=56+3*a,O=q.length,j=Math.max(0,d(f.k,q,I));e.x+=Math.cos(e.th)*3*f.ext,e.z+=Math.sin(e.th)*3*f.ext,e.kap=0;const Z=I+3*(j+f.ext),Y=n[l].s,g=n[f.k].s+f.ext*3;q.push({x:e.x,z:e.z,d:Z,s:g});for(let K=O;K<q.length;K++)q[K].s=H(Y,g,(q[K].d-I)/Math.max(1,Z-I));const U=q[q.length-1],it={...e},lt=c(null,Z),rt=Z+lt.len+(lt.phi-t)*v;Object.assign(e,it),e.kap=0;const Mt=K=>K<rt-360?Mo(K/wo):go(rt-K);for(const K of q)K.s>=0&&F.push({i:h.length,s:K.s}),h.push([K.x,Mt(K.d),K.z]);const et=(K,nt,ct,Q)=>{const ht=Math.hypot(K-e.x,nt-e.z),ut=R(Math.atan2(nt-e.z,K-e.x)-e.th);e.kap+=Bt(Bt(2*Math.sin(ut)/Math.max(ht,6),-1/ct,1/ct)-e.kap,-Q,Q),e.th+=e.kap*3,e.x+=Math.cos(e.th)*3,e.z+=Math.sin(e.th)*3},[gt,xt]=mo,Lt=uo,It=[],Qt=[];let jt=Z,Et=0;for(;(e.x>gt+3||Math.abs(e.z-(xt-Lt))>7)&&Et++<90;)et(Math.max(gt-8,e.x-27),xt-Lt,25,.005),jt+=3,Et%5===0&&It.push({x:e.x,z:e.z,d:jt});It.length&&jt-It[It.length-1].d<7&&It.pop();const pe=jt;Qt.push({x:e.x,z:e.z,m:0});let Tt=0,_t=Math.atan2(e.z-xt,e.x-gt);for(Et=0;Tt<1.75*at-.06&&Et++<140;){const K=Math.atan2(e.z-xt,e.x-gt)-.55;et(gt+Math.cos(K)*Lt,xt+Math.sin(K)*Lt,Lt-1.5,.012),jt+=3;const nt=Math.atan2(e.z-xt,e.x-gt);Tt+=R(_t-nt),_t=nt,Et%4===0&&Qt.push({x:e.x,z:e.z,m:jt-pe})}const Pt=at*Lt,$t=re([[0,31],[.25*Pt,29.5],[.5*Pt,28.5],[.75*Pt,29.5],[Pt,31.5],[1.25*Pt,36],[1.5*Pt,44.5],[1.75*Pt,54]]);for(const K of It){const nt=wt(.3,1,(K.d-Z)/Math.max(1,pe-Z));h.push([K.x,H(Mt(K.d),31,nt),K.z])}const me=h.length;let At=-1;for(const K of Qt)At<0&&K.m>=Pt-1.5&&(At=h.length),h.push([K.x,$t(K.m),K.z]);const oe=h.length-1,Te=h.length;h.push([-33,58,121]),h.push([-50,61,87],[-61,55,50],[-43,45,11],o===2?[-19,31,-24]:[-23,31,-24]);const ae=h.length;h.push(o===2?[0,13,-56]:[-8,12.5,-56]);const le=o===2?5:0;h.push([15+le,9.8,-77],[39+le,8.8,-99],[61+le*.4,9.4,-121]);const ue=h.length-1;h.push([73,21,-146],[64,41,-168],[44,53.5,-184]);const E=h.length;h.push([16,47,-200],[3,41,-214],[0,37,-232],[0,34.5,-252],[0,34,ft]),await C.yield();const Yt=co(h,{samples:640});await C.yield();const se=1600,Me=[];for(let K=0;K<=se;K++)Me.push(Yt.pointAt(K/se));const Rt=[];let ve=0;for(const K of h){let nt=ve,ct=1e9;for(let Q=ve;Q<=Math.min(se,ve+200);Q++){const ht=(Me[Q].x-K[0])**2+(Me[Q].y-K[1])**2+(Me[Q].z-K[2])**2;ht<ct&&(ct=ht,nt=Q)}Rt.push(nt/se),ve=nt}const de=Rt[F[F.length-1].i],ge=Rt[Te],xe=Rt[ae],ne=Rt[E],pt=Rt[ue],Ve=re([[0,0],[Rt[F[0].i],.07],[de,.31],[ge,.54],[xe,.77],[ne,.95],[1,1]]),Ke=re([[0,0],[.07,Rt[F[0].i]],[.31,de],[.54,ge],[.77,xe],[.95,ne],[1,1]]),Gt=[[0,V]];for(const K of F)Gt.push([Rt[K.i],K.s]);Gt.push([xo,k],[1,k+400]),await C.yield();const He=await Po(m,Yt,Gt,de,C);return{path:Yt,pts:h,bOf:Ve,uOfB:Ke,landOf:He,baseLand:re(Gt),uE:de,uApex:ge,uDesc:xe,uStep:ne,uLow:pt,uJoin:Rt[me],uLap:Rt[Math.max(At,me)],uX:Rt[oe],entryX:L,entryZ:u+56,sA:T,sE:U.s,dirB:W,plan:f,length:Yt.length}}const ko=.15;async function Po(m,o,C,k,P){const b=re(C),V=ko,S=k+.03,F=.005,D=Math.round((S-V)/F),B=o.length,v=new z.Vector3,w=b(V),R=b(S),A=(R-w)/D,T=Math.ceil(R-w)+200;if(!(D>4)||!(A>1.5)||T>1100)return b;const M=new Float32Array((D+1)*3),n=new Float32Array((T+81)*2);for(let c=0;c<=D;c++)o.posAtDist((V+c*F)*B,v),M[c*3]=v.x,M[c*3+1]=v.y,M[c*3+2]=v.z;for(let c=0;c<=T+80;c++)m.pointAt(Math.min(m.L-.01,w+c),v),n[c*2]=v.x,n[c*2+1]=v.z;await P.yield();const i=(c,f)=>{const q=M[c*3],W=M[c*3+1],I=M[c*3+2],O=Math.hypot(n[f*2]-q,n[f*2+1]-I),j=Math.atan2(W-3,O)*57.3;let Z=4*Math.max(0,j-19)**2+.012*Math.max(0,O-80)**2,Y=0;Z+=100*wt(100,150,Math.abs(Math.atan2(n[f*2]-q,I-n[f*2+1])*57.3));for(let g=6;g<=72;g+=6){const U=Math.hypot(n[(f+g)*2]-q,g*.833-W,n[(f+g)*2+1]-I);U<14&&(Z+=300*(14-U)),g%12===0&&g<=48&&(Y+=wt(28,62,U)*.25)}return Z+300*(1-Y)*(1-Y)},p=1e18,y=Math.max(1,Math.floor(A*.5)),e=Math.ceil(A*3),r=[];let L=new Float64Array(T+1).fill(p);L[0]=0;for(let c=1;c<=D;c++){const f=new Float64Array(T+1).fill(p),q=new Int16Array(T+1).fill(-1);for(let W=y;W<=T;W++){let I=p,O=-1;for(let j=y;j<=e;j++){const Z=W-j;if(Z<0)break;if(L[Z]>=p)continue;const Y=j/A,g=L[Z]+(Y>1?25:60)*(Y-1)*(Y-1);g<I&&(I=g,O=Z)}O>=0&&(f[W]=I+i(c,W),q[W]=O)}r.push(q),L=f,(c&3)===0&&await P.yield()}let u=-1,h=p;for(let c=0;c<=T;c++){const f=L[c]+.6*Math.abs(w+c-R);f<h&&(h=f,u=c)}if(u<0)return b;const l=new Array(D+1);l[D]=u;for(let c=D-1;c>=0;c--)l[c]=r[c][l[c+1]];const a=C.filter(c=>c[0]<V-1e-6),t=[],s=w+u,d=C.filter(c=>c[0]>S+.065);for(let c=0;c<=D;c++)t.push([V+c*F,w+l[c]]);for(let c=1;c<=12;c++){const f=S+c*F;t.push([f,H(s,d[0][1],(f-S)/(d[0][0]-S))])}for(let c=0;c<6;c++){let f=t[0][1];for(let q=1;q<t.length-1;q++){const W=t[q][1];t[q][1]=(f+2*W+t[q+1][1])/4,f=W}}for(let c=1;c<t.length;c++)t[c][1]=Math.max(t[c][1],t[c-1][1]+.01);return re(a.concat(t,d))}const Fe=`
uniform vec3 uZen, uMid, uHor, uBand, uRose; uniform float uWarm, uSunUp;
vec3 skyCol(vec3 d){
  float h = d.y, hl = max(length(d.xz), 1e-4); float east = d.x / hl;          // +1 toward the sun
  float hh = clamp(h, 0., 1.);
  vec3 c = mix(uHor, uMid, smoothstep(0., .24, hh));
  c = mix(c, uZen, smoothstep(.16, .85, hh));
  float e = smoothstep(-.35, 1., east);
  float band = exp(-(hh - .06) * (hh - .06) / .0075) * e * e;
  c = mix(c, uRose, exp(-(hh - .2) * (hh - .2) / .016) * e * e * (.3 + .22 * uWarm));
  c = mix(c, uBand * (.78 + .5 * uWarm), band * (.6 + .38 * uWarm));
  // thin rose streaks low on the right
  float st = vnoise(vec2(atan(d.z, d.x + 1e-4) * 5., hh * 46.)) * .6 + vnoise(vec2(atan(d.z, d.x + 1e-4) * 13. + 3., hh * 120.)) * .4;
  c = mix(c, uRose, smoothstep(.56, .8, st) * smoothstep(.03, .08, hh) * (1. - smoothstep(.13, .24, hh)) * e * e * .55);
  c = mix(c, uHor, 1. - smoothstep(-.01, .035, h));                              // the ground mist
  return c;
}
`;function Kt(m,o={}){return new z.ShaderMaterial({fog:!0,side:o.side??z.DoubleSide,transparent:!!o.transparent,depthWrite:o.depthWrite??!0,uniforms:{...fe(),...m,...o.uniforms||{}},vertexShader:`
      #include <fog_pars_vertex>
      ${Xt}
      attribute vec3 color; attribute vec4 aAnim; attribute vec3 aPivot;
      ${o.vpars||""}
      varying vec3 vW, vN, vC, vL; varying vec4 vA;
      void main(){
        vec3 p = position, n = normal; vec4 A = aAnim;
        #ifdef USE_INSTANCING
          mat4 im = instanceMatrix;
        #else
          mat4 im = mat4(1.);
        #endif
        ${o.vert||""}
        vec4 wp = modelMatrix * im * vec4(p, 1.);
        vW = wp.xyz; vN = mat3(modelMatrix) * mat3(im) * n; vC = color; vL = p; vA = A;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <fog_pars_fragment>
      ${Xt}
      uniform float uBandK;
      ${o.fpars||""}
      varying vec3 vW, vN, vC, vL; varying vec4 vA;
      void main(){
        vec3 n = normalize(vN + vec3(0., 1e-4, 0.)); if (!gl_FrontFacing) n = -n;
        vec3 toCam = cameraPosition - vW; float dist = length(toCam); vec3 V = toCam / max(dist, 1e-4);
        float close = 1. - smoothstep(10., 70., dist);
        vec3 alb = vC, emis = vec3(0.); float gloss = ${(o.gloss??0).toFixed(3)}, metal = ${(o.metal??0).toFixed(3)}, ao = 1., alpha = 1., sunK = 1.;
        ${o.frag||""}
        n = normalize(n + vec3(0., 1e-4, 0.));
        float sun = sunAt(vW) * sunK, nl = max(dot(n, uSunDir), 0.), back = max(-dot(n, uSunDir), 0.);
        vec3 light = skyLight(n);
        light = mix(light, light * vec3(.62, .74, 1.02), sun * back * .8);
        light += uSunCol * nl * 1.3 * sun;
        vec3 col = alb * light * ao;
        vec3 R = reflect(-V, n); float ndv = clamp(dot(V, n), 0., 1.);
        float rh = clamp(R.y, 0., 1.);
        vec3 env = mix(uSkyLow * 1.05, uSkyTop, pow(rh, .5));
        env = mix(env, uHouse * 2., smoothstep(.05, .9, -R.z) * (1. - smoothstep(.08, .4, rh)) * mix(.85, .4, metal));
        env = mix(env, mix(uPeach, uSunCol, .4) * (.8 + .5 * max(uSun, uBandK)), smoothstep(-.1, .9, R.x) * (1. - smoothstep(0., .5, rh)) * .72);     // the peach band
        env = mix(uSkyLow * .3 + uSkyTop * .12 + uPeach * .1, env, smoothstep(-.3, .03, R.y));    // the wet stone below the horizon
        env += (uSkyLow * .35 + uPeach * .3) * exp(-R.y * R.y * 70.) * (.35 + .65 * smoothstep(-.6, .7, R.x));   // and the pale line of the horizon itself
        env += uSunCol * sun * pow(max(dot(R, uSunDir), 0.), 24.) * 2.2;
        float fr = gloss * (.05 + .95 * pow(1. - ndv, 4.));
        col = mix(col, env * ao, fr);
        col = mix(col, alb * mix(env, vec3(dot(env, vec3(.3, .5, .2))) * vec3(1.06, 1., .9), .55) * 1.9 * (.35 + .65 * ao), metal);    // metal keeps its own colour: brass does not go green under a blue sky
        vec3 lampL = vec3(0.);
        ${o.lamps?"lampL = lampLight(vW, n); col += alb * lampL * (.4 + .6 * ao) * (1. - .6 * metal);":""}
        col += emis;
        gl_FragColor = vec4(max(col, vec3(0.)), alpha);
        ${o.ownFog?"":"#include <fog_fragment>"}
        ${o.post||""}
      }`})}const We=(m,o,C)=>{const k=m.build();k.computeVertexNormals();const P=new z.Mesh(k,o);return P.name=C,P};function ee(m,o,C,k,P,b=0,V=0){const S=m.n;for(let F=0;F<=C;F++)for(let D=0;D<=o;D++){const B=D/o,v=F/C,w=k(B,v),R=m.v(w[0],w[1],w[2],P(B,v));m.a[R*4]=B,m.a[R*4+1]=v,m.a[R*4+2]=b,m.a[R*4+3]=V}for(let F=0;F<C;F++)for(let D=0;D<o;D++){const B=S+F*(o+1)+D;m.quad(B,B+1,B+o+2,B+o+1)}return[S,m.n]}function Dt(m,o,C,k,P,b,V,S){const F=m.n,D=P.length;for(let B=0;B<D;B++)for(let v=0;v<=b;v++){const w=v/b*at,R=B/(D-1),A=S?S(R,w):1,T=m.v(o+Math.cos(w)*P[B][0]*A,C+P[B][1],k+Math.sin(w)*P[B][0]*A,V(R,w));m.a[T*4]=R,m.a[T*4+1]=v/b}for(let B=0;B<D-1;B++)for(let v=0;v<b;v++){const w=F+B*(b+1)+v;m.quad(w,w+b+1,w+b+2,w+1)}return[F,m.n]}function Ao(m){const o=new z.Mesh(new z.SphereGeometry(2600,40,20),new z.ShaderMaterial({side:z.BackSide,depthWrite:!1,depthTest:!1,uniforms:m,vertexShader:"varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.); }",fragmentShader:`
      ${Xt}
      ${Fe}
      uniform vec3 uSunDisc; uniform float uStars;
      varying vec3 vD;
      void main(){
        vec3 d = normalize(vD); vec3 c = skyCol(d);
        vec3 sd = normalize(vec3(.99, -.035 + .085 * uSunUp, .12)); float g = 1. - dot(d, sd);
        float above = smoothstep(.0, .012, d.y);
        c += uSunDisc * ((1. - smoothstep(.00009, .00016, g)) * 3.2 + exp(-g * 900.) * .9 + exp(-g * 60.) * .22) * above * smoothstep(0., .15, uSunUp);
        vec3 s1 = normalize(vec3(-.32, .7, -.5)), s2 = normalize(vec3(.3, .62, .42));
        float tw = .7 + .3 * sin(uTime * 3.1);
        c += vec3(.8, .88, 1.) * (exp(-(1. - dot(d, s1)) * 90000.) * 2.4 * tw + exp(-(1. - dot(d, s2)) * 120000.) * 1.7 * (1.4 - tw)) * uStars;
        gl_FragColor = vec4(c, 1.);
      }`}));return o.frustumCulled=!1,o.renderOrder=-10,o.name="kolam-dome",o}const Ze=`
uniform vec2 uHz; uniform vec3 uCliff;
vec3 cliff(vec3 c, vec3 W, vec3 V, float dist, float lampA){
  vec3 skyB = skyCol(-V); float hh = clamp(-V.y, 0., 1.);
  vec3 skyP = min(skyB, mix(mix(uHor, uMid, smoothstep(0., .24, hh)), uZen, smoothstep(.16, .85, hh)));     // the sky without its band and streaks
  float lsP = dot(skyP, vec3(.3, .5, .2));
  float sunW = uSun * smoothstep(-70., 70., W.x + .14 * W.z - uSunEdgeX), sunL = sunW * (1. - smoothstep(60., 150., W.y));
  float lampK = smoothstep(.004, .05, lampA), keepK = max(sunL, lampK);
  float bil = vnoise(vec2(W.x * .0042 + 3., W.y * .0065)) * .65 + vnoise(vec2(W.x * .012, W.y * .017 + 7.)) * .35 - .5;
  float hY = W.y + bil * 64., farS = smoothstep(150., 460., dist);
  // stains: long runs down the face and broad damp patches
  float run = vnoise(vec2(W.x * .045 + 2., W.y * .0024)), run2 = vnoise(vec2(W.x * .14 + 9., W.y * .007 + 3.)), damp0 = vnoise(vec2(W.x * .011 + 5., W.y * .009));
  float stain = run * .3 + run2 * .14 + damp0 * .56;
  float rise = smoothstep(26., 240., hY);
  vec3 tone = uCliff * (.68 + .54 * stain) * mix(mix(.6, 1.15, rise), 1., sunL);
  tone *= 1. + vec3(1.5, .8, .25) * sunW * (.25 + .5 * stain);                      // the level sun grazes it
  float lt = dot(tone, vec3(.3, .5, .2));
  tone *= clamp(.6 * lsP / max(lt, 1e-4), .7, 1.); lt = dot(tone, vec3(.3, .5, .2));   // under the sky wherever the sky is pale enough to be under
  c = mix(c, tone * .7 + c * .4, farS * .8 * (1. - .65 * keepK));
  float lh = dot(c, vec3(.3, .5, .2));
  c = mix(c, c * min(1., max(.6 * lsP, lt) / max(lh, 1e-4)), 1. - keepK);                               // (at every height: plaster lit by the sky is never paler than the sky)
  float mg = 72. + 48. * max(sunW, lampK);                                           // (the lit door keeps its carving a little higher)
  c = mix(c, tone, smoothstep(mg, mg + 130., hY + 60. * farS * (1. - .6 * keepK)));
  // mist: slow bands drifting along the face, thickest half way up, thin before the lamp-lit door
  vec2 mq = vec2(W.x * .0025 - uTime * .024, W.y * .021 + bil * 1.5);
  float mb = vnoise(mq) * .58 + vnoise(mq * vec2(2.7, 2.1) + vec2(uTime * .021, 4.)) * .42;
  float band = smoothstep(.56, .82, mb) * smoothstep(70., 190., hY) * (1. - .75 * lampK) * (1. - .5 * sunL);
  vec3 mistC = mix(skyP, uHor, .55) * .9;
  c = mix(c, max(c, mistC), band * .24);
  // along the street the wall goes into the mist from the top down and over a long stretch: its upper face is gone
  // by some 1,050 m, its foot and the step only by 1,750 m (so what stands in the lane, the palms and the pots, stands
  // before a wall that is still faintly there); the boundary billows and drifts with the mist bands. Within the frame
  // of any view across the yard it stays the cold tone of the cliff: it takes the band's colour only as it goes.
  float farD = dist * (1. + .55 * bil + .5 * (mb - .5) * smoothstep(300., 700., dist));
  float hzH = smoothstep(uHz.x - 12., uHz.y - 60., hY), hzD = smoothstep(380., mix(1750., 1050., smoothstep(20., 190., hY)), farD);
  hzH = hzH * (.55 + .45 * hzH) + band * .1 * (1. - hzH);
  float hz = 1. - (1. - hzH) * (1. - hzD);
  return mix(c, mix(skyP, skyB, max(smoothstep(.5, 1., hzH), hzD)), hz);
}`,So=`
      if (vA.x < .5) {                                    // the painted step runs off both ways into the same mist as the wall above it
        gl_FragColor.rgb = mix(gl_FragColor.rgb, mix(skyCol(-V), uHouse * 2., .2), smoothstep(360., 1750., dist));
      } else gl_FragColor.rgb = cliff(gl_FragColor.rgb, vW, V, dist, dot(lampL, vec3(.3, .5, .2)));
      gl_FragColor.a = 1.;`;function Lo(m,o,C){const k=new qt.Geo,P=x("#ffffff"),b=(n,i)=>k.anim(n,()=>[i,0,0,0]),V=(n,i,p,y,e,r,L,u=1)=>{const h=k.n;for(let l=0;l<u;l++){const a=H(n,i,l/u),t=H(n,i,(l+1)/u),s=d=>{const c=k.n;for(const f of d)k.v(f[0],f[1],f[2],P);k.quad(c,c+1,c+2,c+3)};s([[a,p,r],[t,p,r],[t,y,r],[a,y,r]]),s([[a,y,r],[t,y,r],[t,y,e],[a,y,e]]),s([[t,p,e],[a,p,e],[a,y,e],[t,y,e]]),l===0&&s([[a,p,e],[a,p,r],[a,y,r],[a,y,e]]),l===u-1&&s([[t,p,r],[t,p,e],[t,y,e],[t,y,r]])}return b([h,k.n],L)},S=[[te,-1],[te,21.6],[te-.35,23.1],[te-1.5,ot],[-300,ot]],F=440,D=k.n;for(let n=0;n<=F;n++)for(let i=0;i<S.length;i++){const p=n===0?-2700:n===F?2700:-1100+n/F*2200,y=i===1||i===2?Math.max(0,o.n2(p*.11,i*3.1)-.35)*2.2:0;k.v(p,S[i][1]-y*(i===2?.5:1),S[i][0]-y*.9+(i<3?o.n2(p*.03,5)*.25:0),P)}for(let n=0;n<F;n++)for(let i=0;i<S.length-1;i++){const p=D+n*S.length+i,y=p+S.length;k.quad(p,y,y+1,p+1)}b([D,k.n],0);const B=k.n,v=10,w=100;for(let n=0;n<=w;n++)for(let i=0;i<=v;i++){const p=-125+n/w*250,y=i/v*Math.PI,r=k.v(p,ot+Math.sin(y)*3*(i===0||i===v?0:1),-258+Math.cos(y)*3.1,P);k.a[r*4+1]=i/v}for(let n=0;n<w;n++)for(let i=0;i<v;i++){const p=B+n*(v+1)+i,y=p+v+1;k.quad(p,y,y+1,p+1)}for(let n=B;n<k.n;n++)k.a[n*4]=3;for(const n of[-1,1])V(n>0?oo:-109,n>0?109:-oo,ot,430,ft-4,ft+4,2),V(n>0?109:-124,n>0?124:-109,ot,430,ft-6,ft+9,5),V(n>0?124:-2700,n>0?2700:-124,ot,430,ft-6,ft+2,1,4);V(-70,70,ot,430,ft-16,ft-15,4);const R=Ce.map(n=>new z.Vector3(n[0],n[1],n[2])),A=C===2?"#7b5140":"#743f36",T=Kt(m,{lamps:!0,ownFog:!0,uniforms:{uHib:{value:R},uOxA:{value:x("#5c1f17")},uOxB:{value:x("#8c3524")},uLime:{value:x(C===2?"#bdb9a8":"#b6bac2")},uOchre:{value:x(A)},uTeak:{value:x("#7a4c2e")},uWall:{value:C===2?new z.Color(.16,.15,.14):C===1?new z.Color(.14,.13,.19):new z.Color(.13,.14,.19)},uBrass:{value:x("#b98a34")},uTurm:{value:x(Ot[5])},uVerm:{value:x(Ot[6])}},fpars:Fe+Ze+"uniform vec3 uHib[5]; uniform vec3 uOxA, uOxB, uLime, uOchre, uTeak, uBrass, uTurm, uVerm, uWall;",frag:`
      vec3 P = vW; float k = vA.x;
      float mid = 1. - smoothstep(60., 320., dist);
      if (k < .5) {
        if (n.y > .6) {                                   // the floor on the step: polished red oxide, damp
          float n1 = vnoise(P.xz * .21), n2 = vnoise(P.xz * 1.7), n3 = vnoise(P.xz * 2.9 + 4.);
          alb = mix(uOxA, uOxB, n1 * .6 + n2 * .3) * (.9 + .2 * n3 * close);
          float cr = abs(vnoise(P.xz * .09 + 7.) - .5) + (1. - mid) * .1; alb *= .55 + .45 * smoothstep(0., .014, cr);        // hairline cracks
          vec2 dp = mat2(.8, .6, -.6, .8) * P.xz * .1 + vec2(n1, vnoise(P.xz * .17 + 5.)) * 1.6;
          float du = smoothstep(.42, .9, vnoise(dp + 3.) * .7 + vnoise(mat2(.6, -.8, .8, .6) * dp * 2.1) * .3);                                     // flour trodden in: pale drifts
          alb = mix(alb, uFlour * .5, du * .2);
          vec2 sg = P.xz * .55 + vnoise(P.xz * .6) * 1.5; float sp = step(.955, hash21(floor(sg))) * (1. - smoothstep(.16, .36, length(fract(sg) - .5)));
          alb = mix(alb, uFlour * .75, sp * .8 * (1. - smoothstep(40., 150., dist)));                              // a few spilled clumps
          gloss = .9 * (.7 + .3 * n1) * (1. - .3 * du);
          for (int i = 0; i < 5; i++) { vec2 d = P.xz - uHib[i].xy; ao *= 1. - .6 * exp(-dot(d, d) / (60. * uHib[i].z * uHib[i].z)); }
          ao *= .5 + .5 * smoothstep(0., 6., abs(P.z + 258.) - 3.);
          ao *= .45 + .55 * smoothstep(0., 9., P.z - ${(ft+4).toFixed(1)});
          n = normalize(n + vec3(vnoise(P.xz * .6 + 2.) - .5, 0., vnoise(P.xz * .45 + 8.) - .5) * .035);      // the film lies in broad shallow swells
          // the polished floor mirrors the door, the glow in the slot and the flowers
          vec3 Rf = reflect(-V, n); float rz = min(Rf.z, -1e-3), tz = (${(ft+4).toFixed(1)} - P.z) / rz; vec3 hit = P + Rf * tz;
          float mk = smoothstep(.05, .3, -Rf.z) * (1. - smoothstep(70., 220., hit.y)) * step(0., Rf.y) * smoothstep(${(ft+4).toFixed(1)}, ${(ft+8.5).toFixed(1)}, P.z);
          vec2 dq = vec2(abs(hit.x) - 9., hit.y - 27.); float ry2 = mod(dq.y, 60.), tl2 = step(ry2, 38.), hh2 = mix(11., 19., tl2);
          vec2 df = vec2(abs(fract(dq.x / 25.) - .5) * 25., abs(ry2 - mix(49., 19., tl2)));
          float panel = (1. - smoothstep(8., 11., df.x)) * (1. - smoothstep(hh2 - 4.6, hh2 - 1.6, df.y)), stud = 1. - smoothstep(.8, 3.2, length(df - vec2(12.5, hh2)));
          vec3 mc = uTeak * (.35 + .5 * panel) * (uSkyLow * .9 + uSunCol * sunAt(vW) * .8) + uBrass * stud * (uSkyLow + uSunCol * sunAt(vW)) * .9;
          // the dark of the slot, and the ring's light drawn down the floor as one soft upright streak
          float inSlot = 1. - smoothstep(4., 13., abs(hit.x)), ry = hit.y - 34.;
          mc = mix(mc, vec3(.01, .012, .02), inSlot * .8);
          float streak = exp(-hit.x * hit.x / 30.) * (.85 * exp(-ry * ry / 420.) + .3 * exp(-abs(ry) / 46.)) + .12 * exp(-hit.x * hit.x / 260.) * exp(-abs(ry) / 60.);
          mc += vec3(1., .82, .6) * streak * smoothstep(0., 12., tz);
          vec3 fcol = vec3(.3, .012, .018) * (uSkyLow * .8 + uSunCol * sunAt(vW) * .7);
          for (int i = 0; i < 5; i++) {
            vec3 dC = vec3(uHib[i].x, ${ot+3}., uHib[i].y) - P; float tt = max(dot(dC, Rf), 0.); vec3 off = dC - Rf * tt; off.y *= 2.2;
            float bl = exp(-dot(off, off) / (48. * uHib[i].z * uHib[i].z)) * step(tt, 46.); mc = mix(mc, fcol, bl * .9); mk = max(mk, bl * step(0., Rf.y));
          }
          float fres = gloss * (.1 + .9 * pow(1. - clamp(dot(V, n), 0., 1.), 3.));
          emis += mc * mk * fres * ao; gloss *= 1. - .85 * mk;
          float slotK = 1. - smoothstep(${(ft+4).toFixed(1)}, ${(ft+8.5).toFixed(1)}, P.z);                          // in the slot the floor has only the dark behind the door to show
          gloss *= 1. - slotK; alb *= 1. - .75 * slotK;
          // the flames along the edge and on the tall lamp, each a small warm point in the wet with a short tail toward us
          float lg = 0.;
          for (int i = 0; i < 11; i++) {
            vec3 dC = uLamps[i].xyz - P; float tt = max(dot(dC, Rf), 0.); vec3 off = dC - Rf * tt; off.y *= .3;
            lg += uLamps[i].w * exp(-dot(off, off) / 1.6) * step(0., Rf.y);
          }
          emis += uLampCol * lg * fres * 2.2;
        } else {                                          // the riser: lime wash brushed on by hand in upright bands of red ochre and chalk white
          float ph = P.x / 20. + .5, bi = floor(ph), wj = (hash21(vec2(bi, 3.)) - .5) * .3;          // every band its own width
          float brush = (vnoise(vec2(P.x * .5, P.y * .22)) - .5) * .09 + (vnoise(vec2(P.x * 2.3, P.y * .35 + 7.)) - .5) * .05;   // the edge wanders with the brush
          float tri = abs(fract((ph + wj) * .5 + brush * .5) - .5) * 2.;
          float bth = mix(.5, .76, hash21(vec2(floor(ph * .5), 9.)));                                    // some ochre bands a hand wide, some two
          float band = smoothstep(bth - .022, bth + .022, tri + (vnoise(vec2(P.x * 5., P.y * 1.3)) - .5) * .05);
          float thin = vnoise(vec2(P.x * 1.1, P.y * .09 + bi * 3.7)), drag = vnoise(vec2(P.x * 3.7, P.y * .16));                 // wash dragged thin, bristle streaks
          vec3 lime = uLime * (.66 + .3 * vnoise(P.xy * .3) + .1 * drag), och = uOchre * (.62 + .5 * vnoise(P.xy * .45 + 3.) + .2 * drag);
          och = mix(och, lime * .8, smoothstep(.66, .95, thin) * .28);                                  // the white shows through where the ochre is thin
          lime = mix(lime, och * 1.1, smoothstep(.7, .95, vnoise(vec2(P.x * .8 + 30., P.y * .11))) * .22);                        // and ochre has run into the white
          alb = mix(lime, och, band) * (.88 + .2 * vnoise(vec2(P.x * 6., P.y * .5)));
          alb = mix(alb, mix(lime, och, .5), smoothstep(260., 900., dist) * .4);                        // far along the street the bands soften into each other
          float damp = 1. - smoothstep(0., 9., P.y + vnoise(vec2(P.x * .13, 2.)) * 7. - 2.);                                      // rising damp at the foot: darker, greener
          alb = mix(alb, alb * vec3(.4, .46, .42), damp * .85);
          float cn = vnoise(vec2(P.x * .35, P.y * .6) + 11.) * .6 + vnoise(vec2(P.x * 1.9, P.y * 2.3)) * .25 + vnoise(vec2(P.x * 7., P.y * 8.)) * .15;
          float chip = smoothstep(.6, .66, cn) * max(smoothstep(17.5, 23.5, P.y), (1. - smoothstep(.5, 4.5, P.y)) * .7);        // flaked to the grey stone along the top edge and the foot
          alb *= 1. - .22 * smoothstep(.0, .3, abs(P.y - 20.2)) * (1. - smoothstep(.3, .6, abs(P.y - 20.2)));
          alb = mix(alb, vec3(.15, .16, .18) * (.7 + .6 * vnoise(P.xy * 2.1)), chip);
          n = normalize(n + vec3(vnoise(P.xy * 1.3) - .5, vnoise(P.xy * 1.3 + 9.) - .5, 0.) * .25 * mid);
          ao *= .5 + .5 * smoothstep(0., 6., P.y);
          gloss = .35 * damp;
        }
      } else if (k < 1.5) {                               // the wall: lime wash, a dado of ochre stripes, stains
        float band = (1. - smoothstep(62. + 2. * vnoise(vec2(P.x * .21, 1.)), 65. + 2. * vnoise(vec2(P.x * .21, 1.)), P.y)) * (.82 + .18 * vnoise(vec2(P.x * .4, P.y * .1)));   // a hand-painted dado of red oxide
        float stain = vnoise(vec2(P.x * .05, P.y * .012)) * .6 + vnoise(P.xy * .2) * .4, run = mix(.5, vnoise(vec2(P.x * .33, P.y * .008)), mid);      // (the fine runs are for near views: from the street they would read as rain)
        vec3 plaster = uWall * (.5 + .75 * stain) * (.75 + .35 * run) * (.8 + .3 * vnoise(P.xy * 1.1) * mid);
        plaster *= .86 + .28 * vnoise(vec2(P.x * .023 + 4., P.y * .05));                // (no courses: only the trowel's slow unevenness)
        alb = mix(plaster, uOchre * (.34 + .3 * stain) * (.8 + .3 * run), band);
        float ly = P.y - 1.2 * (vnoise(vec2(P.x * .06, 3.)) - .5) - .5 * (vnoise(vec2(P.x * .4, 8.)) - .5);
        float lineW = smoothstep(66., 67.4, ly) * (1. - smoothstep(69.2, 70.8, ly)) * smoothstep(.3, .62, vnoise(vec2(P.x * .045 + 20., 1.)));   // a chalk line above it, drawn by hand and half worn away
        alb = mix(alb, uLime * (.3 + .25 * stain), lineW * .4);
        ao *= .6 + .4 * smoothstep(${ot}., ${ot+14}., P.y);
        // the level sun grazes the plaster beside the door: peach at its foot, fading with height; its edge is 140 m wide
        float sunP = uSun * smoothstep(-70., 70., P.x + .14 * P.z - uSunEdgeX);
        vec3 warmA = mix(alb, vec3(dot(alb, vec3(.3, .5, .2))) * vec3(1.25, .95, .7), .55);
        emis += warmA * uSunCol * sunP * ((.2 + .4 * stain) + 1.5 * exp(-max(P.y - ${ot}., 0.) / 95.) * (.7 + .5 * run)) * ao;
      } else if (k < 2.5 || (k > 4.5 && k < 5.5)) {       // the door and its frame: dark teak, framed panels
        vec2 q = vec2(abs(P.x) - 9., P.y - 27.); float ry = mod(q.y, 60.), tall = step(ry, 38.), hh = mix(11., 19., tall);
        vec2 f = vec2(abs(fract(q.x / 25.) - .5) * 25., abs(ry - mix(49., 19., tall)));
        float inPanel = (1. - smoothstep(9.2, 9.8, f.x)) * (1. - smoothstep(hh - 3.4, hh - 2.8, f.y));
        float groove = (smoothstep(9., 9.6, f.x) * (1. - smoothstep(9.8, 10.6, f.x)) * step(f.y, hh - 2.2) + smoothstep(hh - 3.6, hh - 3., f.y) * (1. - smoothstep(hh - 2.8, hh - 2., f.y)) * step(f.x, 10.4)) * step(k, 2.5);
        float vert = 1. - step(hh - 2.4, f.y);                                         // grain runs up the panels and stiles, along the rails
        float pid = hash21(vec2(floor(q.x / 25.) + 9. * step(0., P.x), floor(q.y / 60.) * 2. + tall));
        float loz = f.x / 7.4 + f.y / 5., lozE = (1. - tall) * step(k, 2.5) * (1. - smoothstep(0., .14, abs(loz - 1.)));   // the short panels carry a carved lozenge
        vec2 gq = mix(vec2(P.y * .9, P.x * .06), vec2(P.x * .9, P.y * .06), vert);
        float grain = vnoise(gq) * .6 + vnoise(gq * vec2(3., 1.) + 4.) * .4;
        alb = uTeak * (.55 + .9 * grain) * (1. - .7 * groove) * (.8 + .3 * inPanel) * (.8 + .4 * pid) * (1. - .55 * lozE) * (1. + .25 * (1. - tall) * step(loz, .86));
        alb *= .6 + .4 * smoothstep(${ot}., ${ot+20}., P.y);
        gloss = .3; if (abs(n.x) > .7) { alb *= .35; gloss = 0.; ao *= .4; }
      } else if (k < 3.5) {                               // the beam: a carved rope with turmeric and vermilion dots
        float tw = fract(P.x / 5.2 + vA.y * 1.6);
        float rope = abs(tw - .5) * 2.;
        alb = uTeak * 1.5 * (.5 + .7 * rope) * (.8 + .4 * vnoise(vec2(P.x * 2., vA.y * 9.)));
        n = normalize(n + vec3((tw - .5) * 1.1, 0., 0.) * (1. - .5 * rope));
        float dx = fract(P.x / 9.) - .5, dc = length(vec2(dx * 9., (vA.y - .5) * 9.4));
        float dotm = (1. - smoothstep(1.05, 1.3, dc)) * smoothstep(24., 46., dist), which = step(.5, fract(floor(P.x / 9.) * .5));     // (the painted dots fade as the lens passes over the beam: the last metres show the carved rope alone)
        alb = mix(alb, mix(uTurm, uVerm, which) * (.8 + .3 * vnoise(P.xz * 3.)), dotm);
        gloss = .25 * (1. - dotm); ao *= .7 + .3 * rope;
      } else if (k < 4.5) { alb = vec3(.004, .005, .01); sunK = 0.; }
      else { alb = uBrass; metal = .9; }
      `,post:So});return We(k,T,"kolam-house")}function Oe(m,o){const C=new z.CatmullRomCurve3(m.map(P=>new z.Vector3(P[0],P[1],0)),!1,"centripetal"),k=[];for(let P=0;P<=o;P++){const b=C.getPoint(P/o);k.push([Math.max(0,b.x),b.y])}return k}const no=`
uniform float uBandK;          // how far the eastern band has grown (0..1): the brass shows it long before the sun is up
vec3 potEnv(vec3 R){
  float hl = max(length(R.xz), 1e-4), east = R.x / hl, north = -R.z / hl, up = R.y, upc = clamp(up, 0., 1.);
  vec3 warm = mix(uPeach, uSunCol, .35);
  vec3 sky = mix(uSkyLow * 1.05, uSkyTop * .9, pow(upc, .55));
  sky = mix(sky, uHouse * 2.4, smoothstep(.1, .8, north) * (1. - smoothstep(.1, .5, upc)) * .9);          // the dark house front
  sky = mix(sky, warm * (1.2 + .6 * max(uSun, uBandK)), smoothstep(-.1, .75, east) * (1. - smoothstep(.03, .46, upc)) * .92);   // the peach band
  vec3 gnd = (uSkyLow * .24 + uSkyTop * .1) * (.5 + .5 * smoothstep(-1., -.08, up));                     // wet stone, darker toward our feet
  gnd = mix(gnd, warm * .42, smoothstep(.15, .9, east) * smoothstep(-.55, -.02, up) * .65);
  vec3 c = mix(gnd, sky, smoothstep(-.16, .2, up));
  c += (uSkyLow * .3 + uPeach * .2) * exp(-up * up * 34.) * (.35 + .65 * smoothstep(-.6, .7, east));   // the bright line of the horizon
  return c;
}`;function Co(m,o){const C=new qt.Geo,k=x("#b08a3a"),[P,,b]=Ht,V=Se,S=Oe([[4.6,0],[7.6,.7],[10.6,4.6],[12,10.5],[11.2,16],[8.4,20.2],[6.3,22.8],[6.1,24.4],[7.7,26.6],[9.3,27.7],[9.1,28.1],[7.7,27.5],[6.9,25.8]],44).map(A=>[A[0]*V,A[1]*V]);Dt(C,P,0,b,S,72,()=>k,(A,T)=>1+.01*o.n2(Math.cos(T)*3+A*9,Math.sin(T)*3));const F=Dt(C,P,25.3*V,b,[[0,0],[3.5*V,.02],[6.6*V,.05]],32,()=>k);for(let A=F[0];A<F[1];A++)C.a[A*4+2]=1;const D=C.build();D.computeVertexNormals();const B=new z.ShaderMaterial({fog:!0,side:z.DoubleSide,uniforms:{...fe(),...m,uPotC:{value:new z.Vector3(P,28*V,b)},uBrassC:{value:new z.Color(.86,.56,.2)},uBeak:{value:new z.Vector2(P+Math.sin(Le)*2.5,b-Math.cos(Le)*2.5)}},vertexShader:`
      #include <fog_pars_vertex>
      attribute vec4 aAnim; varying vec3 vW, vN; varying vec4 vA;
      void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vN = mat3(modelMatrix) * normal; vA = aAnim;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <fog_pars_fragment>
      ${Xt}
      ${no}
      uniform vec3 uPotC, uBrassC; uniform vec2 uBeak; uniform float uLampK;
      varying vec3 vW, vN; varying vec4 vA;
      void main(){
        vec3 n = normalize(vN + vec3(0., 1e-4, 0.)); if (!gl_FrontFacing) n = -n;
        vec3 toCam = cameraPosition - vW; float dist = length(toCam); vec3 V = toCam / max(dist, 1e-4);
        float t = vA.x, a = vA.y, h = vW.y, top = uPotC.y;
        vec3 col;
        if (vA.z > .5) {                                   // the water: a dark mirror, ringed where the sparrow drinks
          vec2 dq = vW.xz - uBeak; float rr = length(dq), wv = sin(rr * 2.6 - uTime * 3.4) * exp(-rr * .22);
          vec3 nw = normalize(vec3(dq.x, 0., dq.y) / max(rr, .2) * wv * .1 + vec3(0., 1., 0.));
          vec3 Rw = reflect(-V, nw); float fw = .08 + .92 * pow(1. - clamp(dot(V, nw), 0., 1.), 4.);
          col = mix(uBrassC * uBrassC * .05 * uSkyLow, potEnv(Rw), fw) * (.75 + .25 * smoothstep(0., 5., length(vW.xz - uPotC.xz)));
        } else {
          vec3 nh = normalize(vec3(n.x, 0., n.z) + vec3(1e-4, 0., 0.)), T = vec3(-nh.z, 0., nh.x), B = normalize(cross(n, T) + vec3(0., 1e-4, 0.));
          // hammer marks: the mirror is not true. Thousands of shallow blows have left it gently dented, so what it
          // shows swims a little from mark to mark; no mark has an edge
          vec2 hq = vec2(a * 88., h * 1.02);
          float bodyK = 1. - smoothstep(.5, .6, t), detail = 1. - smoothstep(130., 360., dist);
          vec2 dent = vec2(vnoise(hq) - .5, vnoise(hq + 17.3) - .5) * .24 + vec2(vnoise(hq * 2.3 + 9.) - .5, vnoise(hq * 2.3 + 41.) - .5) * .13 + vec2(vnoise(hq * .31 + 5.) - .5, vnoise(hq * .31 + 31.) - .5) * .1;
          float hr = vnoise(hq * 1.9 + 3.);
          vec3 nd = normalize(n + (T * dent.x + B * dent.y) * bodyK * detail);
          float ndv = clamp(dot(V, nd), 0., 1.);
          vec3 R = reflect(-V, nd), Rs = reflect(-V, n);
          float tarn = .66 + .4 * vnoise(vec2(a * 22., h * .22)) + .12 * (hr - .5) * detail;
          vec3 tint = mix(uBrassC, vec3(1., .93, .8), pow(1. - ndv, 5.) * .5);
          col = potEnv(R) * tint * tarn * .4 * (1. + .3 * smoothstep(.55, .9, vnoise(hq * 2.6 + 50.)) * bodyK * detail);                                            // dark: old brass keeps a third of what it is shown
          col += uBrassC * skyLight(n) * .035 * tarn;                                   // and scatters a little
          col *= .45 + .55 * smoothstep(0., 9., h);                                     // tarnish and splash at the foot
          // the rolled rim, rubbed bright by hands: a thin line of the whole sky
          float rimK = smoothstep(26.9, 27.45, h / ${V.toFixed(2)});
          vec3 rimC = (potEnv(Rs) * 1.1 + uSkyLow * .5 + uPeach * .32) * mix(uBrassC, vec3(1.), .26) * (.85 + .3 * vnoise(vec2(a * 40., 3.)));
          col = mix(col, rimC, rimK * .9);
          col += (uSkyLow + uPeach * .5) * pow(1. - clamp(dot(V, n), 0., 1.), 2.) * rimK * .35 * mix(uBrassC, vec3(1.), .5);
          // the peach of the eastern band, a streak down the flank that faces it
          vec3 Vc = normalize(vec3(cameraPosition.x - uPotC.x, 0., cameraPosition.z - uPotC.z) + vec3(1e-4, 0., 0.));
          float sx = dot(nh, vec3(Vc.z, 0., -Vc.x)), sz = dot(nh, Vc);                  // across the pot as we see it, and toward us
          float rl = max(length(Rs.xz), 1e-3), re = max(Rs.x / rl, 0.);
          float flank = pow(re, 22.) * smoothstep(.04, .16, t) * (1. - smoothstep(.5, .62, t)) * (.55 + .45 * (1. - smoothstep(.2, .8, abs(Rs.y))));
          col += mix(uPeach, uSunCol, .3) * flank * (.6 + .4 * max(uSun, uBandK)) * (.7 + .6 * hr) * mix(uBrassC, vec3(1.), .25) * 1.15;
          // the lamps of the step, a row of small warm points across the belly
          float ty = n.y - .2, lamps = 0.;
          for (int i = 0; i < 11; i++) {
            float lx = clamp(uLamps[i].x / 134., -1., 1.), sc = .1 + .5 * lx, big = step(9.5, float(i));
            float dx2 = (sx - sc) * (sx - sc) + ty * ty * 1.6;
            lamps += min(uLamps[i].w, 1.6) * exp(-dx2 * mix(2200., 900., big)) * step(0., sz);
          }
          col += uLampCol * lamps * 4.2 * uLampK;
          // drips: a wet track down every other flute, a bead of sky at its head
          float colm = floor(a * 46.), ch = hash21(vec2(colm, 3.)), fa = abs(fract(a * 46.) - .5);
          float dy = fract(ch * 7. - uTime * (.03 + .045 * ch)), tq = t * .86;
          float trail = (1. - smoothstep(0., .2, fa)) * step(.45, ch) * smoothstep(dy - .22, dy, tq) * step(tq, dy) * bodyK;
          float bead = (1. - smoothstep(0., .3, length(vec2(fa * 1.6, (tq - dy) * 26.)))) * step(.45, ch) * bodyK;
          col *= 1. + .35 * trail; col += (uSkyLow * .9 + uPeach * .25) * bead * .7;
          col *= 1. - .3 * smoothstep(19., 21.5, h / ${V.toFixed(2)}) * (1. - rimK);         // the neck sits in the shade of the rim
          if (!gl_FrontFacing) col *= .25;                                               // inside the neck
          col += uSunCol * sunAt(vW) * (pow(max(dot(R, uSunDir), 0.), 70.) * 1.6 + max(dot(n, uSunDir), 0.) * .16) * uBrassC;
        }
        gl_FragColor = vec4(max(col, vec3(0.)), 1.);
        #include <fog_fragment>
      }`}),v=new z.Mesh(D,B);v.name="kolam-pot";const w=new z.CircleGeometry(34,56);w.rotateX(-Math.PI/2),w.translate(P,.07,b);const R=new z.Mesh(w,new z.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,uniforms:{...fe(),...m,uC:{value:new z.Vector2(P,b)},uPotR:{value:new z.Vector2(12*V,28*V)},uBrassC:{value:new z.Color(.86,.56,.2)}},vertexShader:`#include <fog_pars_vertex>
      varying vec3 vW; void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
      #include <fog_vertex>
      }`,fragmentShader:`#include <fog_pars_fragment>
      ${Xt}
      ${no}
      uniform vec2 uC, uPotR; uniform vec3 uBrassC; varying vec3 vW;
      void main(){
        vec2 d = vW.xz - uC; float r = length(d), ang = atan(d.y, d.x + 1e-4);
        float lobe = 5. * vnoise(vec2(cos(ang), sin(ang)) * 1.7 + 4.) + 2.5 * vnoise(vec2(cos(ang), sin(ang)) * 5. + 9.);
        float edge = 1. - smoothstep(14.5 + lobe, 23. + lobe, r);
        // slow rings from where the drips fall: a height and its slope along the ring's radius
        vec2 slope = vec2(0.);
        for (int i = 0; i < 4; i++) {
          float fi = float(i), cyc = uTime * .2 + fi * .27, ph = fract(cyc), a0 = fi * 1.7 + floor(cyc) * 2.4;
          vec2 c = vec2(cos(a0), sin(a0)) * uPotR.x * 1.08, q = d - c; float rr = length(q), front = ph * 15., x = rr - front;
          float amp = exp(-x * x * .1) * (1. - ph) * (1. - ph) * smoothstep(0., 1.5, rr);
          slope += q / max(rr, .3) * cos(x * 1.3) * amp * 1.5;
        }
        slope += (vec2(vnoise(vW.xz * .8 + uTime * .15), vnoise(vW.xz * .8 + 7. - uTime * .13)) - .5) * .25;    // the film is never quite still
        vec3 V = normalize(cameraPosition - vW), n = normalize(vec3(-slope.x * .11, 1., -slope.y * .11));
        vec3 R = reflect(-V, n); R.y = abs(R.y);
        float F = .2 + .8 * pow(1. - clamp(dot(V, n), 0., 1.), 3.);
        vec3 col = potEnv(R) * .52;
        // the pot stands in it: a dark warm column toward us, its bright rim at the far end
        float rl = max(length(R.xz), 1e-4); vec2 rd = R.xz / rl; float al = dot(-d, rd), lat = abs(d.x * rd.y - d.y * rd.x);
        float hy = max(al, 0.) * R.y / rl, inPot = (1. - smoothstep(uPotR.x * .72, uPotR.x * 1.02, lat)) * step(0., al) * (1. - smoothstep(uPotR.y * .92, uPotR.y * 1.02, hy));
        vec3 potC = uBrassC * (uSkyLow * .16 + uPeach * .1) * (.6 + .8 * smoothstep(uPotR.y * .5, uPotR.y, hy)) + (uSkyLow * .5 + uPeach * .2) * uBrassC * smoothstep(uPotR.y * .86, uPotR.y * .93, hy);
        col = mix(col, potC, inPot * .8);
        float shade = 1. - smoothstep(uPotR.x * .8, uPotR.x * 1.35, r);                 // contact shade at the foot
        col *= 1. - .55 * shade;
        float lip = smoothstep(12. + lobe, 18.5 + lobe, r) * edge;                       // the film's raised edge takes a soft line of sky
        col += uSkyLow * lip * .2;
        col += uSunCol * sunAt(vW) * pow(max(dot(reflect(-V, n), uSunDir), 0.), 60.) * 1.5;
        col += uSkyLow * .2 * clamp(dot(slope, normalize(vec2(.4, -1.))), 0., 1.);                   // the far face of each ripple takes the sky
        gl_FragColor = vec4(max(col, vec3(0.)), edge * clamp(F * .62 + .14 + shade * .5, 0., .9));
        #include <fog_fragment>
      }`}));return R.renderOrder=1,R.name="kolam-pot-rings",[v,R]}function Wo(m,o,C,k,P){const b=new qt.Geo,[V,,S]=_e,F=x("#3b2a1c"),D=x("#6b5236"),B=x(Ot[3]).multiplyScalar(.86),v=(a,t)=>{for(let s=a[0];s<a[1];s++)b.a[s*4+2]=t;return a};v(Dt(b,V,0,S,Oe([[2.2,0],[5.4,.9],[8.6,3.8],[10,7.6],[10.1,9],[9.5,9.1],[9.2,8.2]],18),40,(a,t)=>F.clone().lerp(D,.5+.5*o.n2(t*2.2,a*3)),(a,t)=>1+.03*o.n2(Math.cos(t)*2,Math.sin(t)*2+a*2)),1),v(Dt(b,V,8.2,S,Oe([[0,4.6],[2.2,4.2],[5,2.6],[7.6,.9],[9.3,0]],12).reverse(),40,()=>B,(a,t)=>1+.05*o.n2(Math.cos(t)*3,Math.sin(t)*3+a*5)),2);const w=x("#ead9a4"),R=x("#a88c52"),A=x("#7a5a30");for(let a=0;a<44;a++){const t=(a+.5)/44-.5,s=150*(.82+.18*C())*(1-1.36*t*t)*(a%5===2?.86:1),d=[],c=[],f=we[1]+t*62+(C()-.5)*3,q=.45+a%3*.4,W=(C()-.5)*5;for(let I=0;I<=7;I++){const O=I/7,j=we[0]-s*O,Z=wt(.05,.75,O);d.push([j,H(2.6+a%4*.6,q*(1-.6*O)+.3,wt(0,.35,O)),H(we[1]+t*5,f,Z)+Math.sin(O*Math.PI)*W]),c.push(H(.42,.16,O))}v(b.tube(d,c,5,w.clone().lerp(R,a%2*.45+C()*.4),R),3)}for(let a=0;a<3;a++){const t=[];for(let s=0;s<=12;s++){const d=s/12*at;t.push([we[0]-7-a*7-s*.12,3.4+Math.sin(d)*3.3,we[1]+Math.cos(d)*4.6])}v(b.tube(t,.5,5,A,A),4)}const[T,M,n]=Re;v(b.tube([[T+1.2,M-.2,n],[T+.6,M+16,n],[T,M+33,n]],[.42,.4,.36],6,x("#5a3a26"),x("#3a2a22")),5),v(b.tube([[T,M+33,n],[T-.25,M+37,n+.1],[T-.4,M+40,n+.2]],[.36,.4,.3],6,x("#8d8f96"),x("#b8bcc4")),6);const i=k-13,p=131,y=.75,e=Math.cos(y),r=Math.sin(y),L=x("#2f5a26"),u=x("#6f8f3a"),h=(a,t)=>{const s=1+.2*(a*9%1-.5),d=2.5*Math.pow(Math.sin(Math.PI*Math.min(1,a*.93+.04)),.7)*s,c=(a-.5)*14,f=(t*2-1)*d+Math.sin(a*3)*.9,q=.25+1.7*a*a*a+.5*Math.abs(t*2-1)+.35*Math.sin(a*7);return[i+c*e-f*r,q,p+c*r+f*e]};v(ee(b,36,6,h,(a,t)=>L.clone().lerp(u,.25+.5*a+.3*Math.abs(t-.5))),7);for(let a=0;a<9;a++)for(const t of[0,1]){const s=h((a+.48)/9,t);P.push([s[0],s[1]-.25,s[2],.55+.3*C()])}return We(b,Kt(m,{vert:"if (A.z > 2.5 && A.z < 6.5) { vec3 wq = (modelMatrix * vec4(p, 1.)).xyz; float dq = length(cameraPosition - wq); p += n * max(0., dq * (A.z < 4.5 ? .0027 : .0021) - (A.z < 4.5 ? .16 : .3)); }",frag:`
      float k = vA.z;
      if (k < 1.5) {                              // coconut shell: fibres running pole to rim
        float fib = vnoise(vec2(vA.y * 190., vA.x * 5.)) * .6 + vnoise(vec2(vA.y * 60., vA.x * 22.)) * .4;
        alb *= .45 + 1.1 * fib; n = normalize(n + vec3(fib - .5) * .35); ao *= .5 + .5 * smoothstep(0., 5., vW.y);
      } else if (k < 2.5) {                       // the heap of flour, finger grooves round it
        float gr = sin(vA.y * 6.2832 * 3. + vA.x * 16.) * .5 + .5;
        alb *= .8 + .2 * gr + .1 * vnoise(vL.xz * 4.); n = normalize(n + vec3(0., (gr - .5) * .5, 0.)); ao *= .7 + .3 * vA.x;
      } else if (k < 3.5) { alb *= .82 + .3 * vnoise(vec2(vL.x * .35, vL.z * 3.)); n = normalize(n + vec3(0., 1.4, 0.)); ao *= .8 + .2 * smoothstep(0., 1.6, vW.y); alb = mix(alb, vec3(dot(alb, vec3(.3, .5, .2))) * vec3(.98, 1., 1.06), .4 * (1. - uSun)); emis += alb * (uSkyLow * (.24 + .08 * uSun) + uSunCol * sunAt(vW) * .5); }      // pale straw: lighter than the ground under it; ash-pale in the blue hour, warm in the sun
      else if (k < 4.5) { alb *= .6 + .7 * step(.5, fract(vL.x * 1.2 + vL.y * .9)); }
      else if (k < 5.5) { alb *= .7 + .4 * vnoise(vL.xy * 3.); }
      else if (k < 6.5) { float e = 1. - smoothstep(.2, .9 + dist * .003, abs(vW.y - ${(Re[1]+33.5).toFixed(1)})); alb *= .8 + .4 * vnoise(vL.xy * 5.); emis += vec3(3.4, .82, .1) * e * (.8 + .2 * sin(uTime * 2.3)); }      // grey ash, and the one orange ember point
      else {                                      // leaf: midrib and side veins, waxy
        float mr = 1. - smoothstep(.0, .05, abs(vA.y - .5)), sv = 1. - smoothstep(.0, .12, abs(fract(vA.x * 9. - abs(vA.y - .5) * 1.4) - .5));
        alb *= 1. + .5 * mr + .22 * sv; gloss = .5; ao *= .6 + .4 * smoothstep(0., 1.2, vW.y);
      }`}),"kolam-yard-things")}function To(m){const o=new z.PlaneGeometry(1,1,2,80);o.translate(0,.5,0);const C=new z.Mesh(o,new z.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:z.DoubleSide,uniforms:{...fe(),...m,uBase:{value:new z.Vector3(Re[0]-.4,Re[1]+40,Re[2]+.2)}},vertexShader:`#include <fog_pars_vertex>
      ${Xt}
      uniform vec3 uBase; varying vec2 vQ; varying vec3 vW;
      void main(){
        float h = position.y, c = position.x * 2.;
        vec3 p = uBase + vec3(0., h * 100., 0.);
        float am = h * h * 26. + h * 3.;
        p.x += (sin(h * 9. - uTime * .9) * .6 + sin(h * 21. - uTime * 1.7) * .25) * am - h * 14.;
        p.z += (cos(h * 7. - uTime * .7) * .6 + sin(h * 17. - uTime * 1.3) * .3) * am;
        vec3 toCam = normalize(cameraPosition - p), side = normalize(cross(vec3(0., 1., 0.), toCam) + vec3(1e-4, 0., 0.));
        float wd = .5 + h * 9. + max(0., length(cameraPosition - p) * .0022 - .5);
        p += side * c * wd; vQ = vec2(c, h); vW = p;
        vec4 mvPosition = viewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`#include <fog_pars_fragment>
      ${Xt}
      varying vec2 vQ; varying vec3 vW;
      void main(){
        float st = vnoise(vec2(vQ.x * 3. + vQ.y * 9., vQ.y * 30. - uTime * 1.2));
        float a = (1. - vQ.x * vQ.x) * (.35 + .65 * st) * smoothstep(0., .03, vQ.y) * (1. - smoothstep(.45, 1., vQ.y)) * .55;
        vec3 col = uSkyLow * .95 + uSunCol * sunAt(vW) * .7;
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
      }`}));return C.frustumCulled=!1,C.renderOrder=3,C.name="kolam-smoke",C}async function Vo(m,o,C,k){const P=new qt.Geo,b=[],V=x("#24040a"),S=x("#7a0b20"),F=x("#b0263a"),D=x("#e6c7b2"),B=x("#f1ddc8"),v=x("#e2b23c"),w=x("#8a1220"),R=x("#3f6a2c"),A=(M,n,i)=>{for(let p=M[0];p<M[1];p++)P.a[p*4+2]=n,P.a[p*4+3]=i;return M};for(let M=0;M<Ce.length;M++){const n=Ce[M],i=n[0],p=n[1],y=n[2]>1.2,e=o()*at,r=M*1.7,L=(o()-.5)*.12,u=(o()-.5)*.12,h=n[2]*(.97+.06*o()),l=y?[-Math.sign(i)*.5,.74,.45]:[L,1,u],a=Math.hypot(l[0],l[1],l[2]);l[0]/=a,l[1]/=a,l[2]/=a;const t=[-l[0]*l[2],-l[1]*l[2],1-l[2]*l[2]],s=Math.hypot(t[0],t[1],t[2]);t[0]/=s,t[1]/=s,t[2]/=s;const d=[l[1]*t[2]-l[2]*t[1],l[2]*t[0]-l[0]*t[2],l[0]*t[1]-l[1]*t[0]],c=y?4.5:0,f=(g,U,it)=>[i+(g*d[0]+U*l[0]+it*t[0])*h,ot+c+(g*d[1]+U*l[1]+it*t[1])*h,p+(g*d[2]+U*l[2]+it*t[2])*h];for(let g=0;g<5;g++){const U=e+g/5*at,it=(o()-.5)*.5,lt=5+3*o(),rt=13+6*o(),Mt=(et,gt)=>{const xt=gt*2-1,Lt=.74*Math.pow(Math.sin(Math.PI*Math.min(1,et*.84+.13)),.6),It=(1+9*et)*(1-.13*xt*xt*et),Qt=U+xt*Lt+.28*et,jt=.5+5.6*Math.pow(et,.8)-2.5*et*et*et*et+(.62*Math.sin(xt*lt+g*2.1)+.26*Math.sin(xt*rt+g))*et*et+xt*(.55+it)*et+.25*(1-xt*xt)*et-.35*Math.abs(xt)*et*(1-et);return f(Math.cos(Qt)*It,jt,Math.sin(Qt)*It)};A(ee(P,20,16,Mt,et=>V.clone().lerp(S,wt(.04,.4,et)).lerp(F,.45*wt(.7,1,et))),1,r+g);for(let et=0,gt=y?8:4;et<gt;et++){const xt=Mt(.3+.62*o(),.12+.76*o());C.push([xt[0],xt[1]-.06,xt[2],y?.3+.55*o():.22+.3*o()])}}A(Dt(P,i,ot,p,[[.9,0],[1.9,.5],[2.4,1.5],[2,2.2]],12,()=>R),5,r);const q=y?-Math.sign(i)*.94:Math.cos(e),W=y?.34:Math.sin(e),I=y?3.4:1.5,O=g=>{const U=I*g*g;return f(q*U,1.4+10.8*g,W*U)},j=[],Z=[];for(let g=0;g<=8;g++)j.push(O(g/8)),Z.push(H(.62,.36,g/8));A(P.tube(j,Z,8,D,B),2,r);for(let g=0;g<46;g++){const U=.42+.5*o(),it=o()*at,lt=(o()-.3)*.9,rt=O(U),Mt=.9+.5*o(),et=[rt[0]+Math.cos(it)*Math.cos(lt)*Mt,rt[1]+Math.sin(lt)*Mt,rt[2]+Math.sin(it)*Math.cos(lt)*Mt];A(P.tube([rt,et],[.07,.05],3,B,v),3,r+g),A(P.blob(et[0],et[1],et[2],.26,.2,.26,v,v,5,3),3,r+g)}const Y=O(1);b.push(Y);for(let g=0;g<5;g++){const U=e+g*at/5,it=[Y[0]+Math.cos(U)*1.25,Y[1]+.9,Y[2]+Math.sin(U)*1.25];A(P.tube([Y,[H(Y[0],it[0],.6),Y[1]+.75,H(Y[2],it[2],.6)],it],[.2,.16,.14],4,B,w),4,r+g),A(P.blob(it[0],it[1]+.2,it[2],.55,.5,.55,w,w,7,4),4,r+g)}await k.yield()}const T=Kt(m,{lamps:!0,gloss:.22,vert:`
      float part = A.z, hgt = p.y - ${ot}.;
      if (part < 1.5) p.y += (sin(uTime * 3.3 + A.w * 2.1 + A.x * 5.) * .1 + sin(uTime * 7.1 + A.y * 9. + A.w) * .05) * A.x * A.x * (1. + .5 * abs(A.y - .5));
      else if (part < 4.5) p.xz += vec2(sin(uTime * 1.3 + floor(A.w)), cos(uTime * 1.1 + floor(A.w))) * .012 * hgt * hgt;`,frag:`
      float part = vA.z;
      if (part < 1.5) {
        // veins fan out from the throat; fine crepe between them; the red is kept deep so that it never clips
        float c = vA.y - .5, fan = c / (.16 + vA.x * .8), vv = abs(fract(fan * 7. + sin(vA.x * 7.) * .08) - .5) * 2.;
        float vein = max(smoothstep(.7, .95, vv), 1. - smoothstep(0., .035, abs(c))) * smoothstep(.04, .22, vA.x) * (1. - smoothstep(.82, 1., vA.x));
        float fine = abs(fract(fan * 28.) - .5) * 2.;
        float crepe = vnoise(vec2(c * 60., vA.x * 22.)) * .55 + vnoise(vec2(c * 22., vA.x * 70.)) * .45;
        alb *= (1. - .62 * vein) * (.66 + .58 * crepe) * (.86 + .14 * fine * close);
        alb = mix(alb, alb * vec3(1.5, 1.25, 1.2), .5 * smoothstep(.8, 1., vA.x) * crepe);                 // the thin ruffled rim is paler
        n = normalize(n + vec3(crepe - .5, 0., (vein - .5) * .8) * (.3 + .4 * close));
        emis += alb * (uSkyLow * .03 + uSunCol * sunAt(vW) * .14);                                        // a little light through the petal
        ao *= .45 + .55 * smoothstep(.0, .5, vA.x); sunK = .55; gloss = .42;
      } else if (part < 2.5) { alb *= .8 + .3 * vnoise(vec2(vL.y * 4., vL.x * 3.)); vec2 pg = vL.xy * 5. + vL.z * 3.; alb = mix(alb, vec3(.8, .6, .15), step(.86, hash21(floor(pg))) * .8); }
      else if (part < 3.5) { alb *= .8 + .5 * hash21(floor(vL.xz * 9.)); emis += alb * .12; }
      else if (part < 4.5) { alb *= .7 + .6 * vnoise(vL.xz * 9.); gloss = .0; }
      else { alb *= .7 + .5 * vnoise(vL.xz * 2.); }`});return{mesh:We(P,T,"kolam-hibiscus"),tops:b}}function Bo(m){const o=new z.Object3D,C=[],k="gl_FragColor.rgb = cliff(gl_FragColor.rgb, vW, V, dist, dot(lampL, vec3(.3, .5, .2)));",P="uniform vec2 uHz;",b="vec3 fo = (modelMatrix * im * vec4(0., 0., 0., 1.)).xyz; p *= (1. - smoothstep(90., 190., fo.y)) * (1. - smoothstep(300., 430., length(cameraPosition - fo)) * smoothstep(40., 110., fo.y));",V=new qt.Geo,S=x("#6a4126"),F=x("#a8744a");Dt(V,0,0,0,[[5,0],[4.7,.5],[3.9,1],[2.6,1.25],[1.5,1.2],[1.3,1.7],[.7,2.1],[0,2.2]],32,(n,i)=>S.clone().lerp(F,n),(n,i)=>n<.5?1+.16*Math.cos(i*8)*(1-n*2)-0:1);const D=V.build();D.rotateX(Math.PI/2),D.computeVertexNormals();const B=new z.InstancedMesh(D,Kt(m,{lamps:!0,ownFog:!0,gloss:.3,fpars:Fe+Ze,post:k,vpars:P,vert:b,frag:"float pet = abs(sin(atan(vL.y, vL.x + 1e-4) * 4.)); alb *= (.55 + .6 * pet * (1. - smoothstep(1.2, 2.2, vL.z))) * (.7 + .5 * vnoise(vL.xy * 2.)); ao *= .55 + .45 * smoothstep(0., 1.2, vL.z);"}),32);let v=0;for(const n of[-1,1])for(let i=0;i<4;i++)for(let p=0;p<4;p++){const y=1.22+.12*((i+p)%2);o.position.set(n*(21.5+25*i),46+60*p,ft+4),o.rotation.set(0,0,i*.4+p),o.scale.set(y,y,1.15),o.updateMatrix(),B.setMatrixAt(v++,o.matrix)}o.scale.set(1,1,1),B.name="kolam-door-bosses",C.push(B);const w=new qt.Geo,R=x("#b08a3a");Dt(w,0,0,0,[[2,0],[2,.22],[1.88,.58],[1.6,.93],[1.16,1.22],[.6,1.4],[0,1.47]],22,()=>R);const A=w.build();A.rotateX(Math.PI/2),A.computeVertexNormals();const T=[];for(const n of[-1,1])for(let i=0;i<=4;i++)for(let p=0;p<4;p++){const y=n*(9+25*i+(i===0?3:i===4?-3:0));T.push([y,27+60*p+(p===0?3:0)],[y,65+60*p]),i<4&&T.push([n*(21.5+25*i),76+60*p])}const M=new z.InstancedMesh(A,Kt(m,{lamps:!0,ownFog:!0,metal:.9,gloss:.4,fpars:Fe+Ze,post:k,vpars:P,vert:b,frag:"alb *= .7 + .4 * vnoise(vW.xy * .8); ao *= .5 + .5 * smoothstep(0., .9, vL.z);"}),T.length);T.forEach((n,i)=>{o.position.set(n[0],n[1],ft+4),o.rotation.set(0,0,0),o.updateMatrix(),M.setMatrixAt(i,o.matrix)}),M.name="kolam-door-studs",C.push(M);for(const n of C)n.instanceMatrix.needsUpdate=!0,n.frustumCulled=!1;return C}function Do(m,o,C=[]){const k=new qt.Geo,P=x("#7a3f26"),b=x("#a9643c"),V=x("#b08a3a"),S=x("#8c6a2a"),F=x("#2a1606"),D=x("#d8cdb4"),B=x("#1a1410"),v=[],w=(r,L,u)=>{for(let h=r[0];h<r[1];h++){k.a[h*4+2]=L;const l=k.p[h*3]-u[0],a=k.p[h*3+1]-u[1],t=k.p[h*3+2]-u[2];k.a[h*4+3]=1/(1+(l*l+a*a+t*t)*u[3])}return r};for(const[r,L]of vo){const u=Math.PI/2+(o()-.5)*.8,h=.92+.22*o(),l=Math.cos(u),a=Math.sin(u),t=[r+l*6.9*h,ot+4.3*h,L+a*6.9*h,.035],s=[[0,0],[2.7,.08],[4.5,1],[5.6,2.5],[5.95,3.5],[5.4,3.45],[4.3,2.4],[2.2,2],[0,1.9]].map(c=>[c[0]*h,c[1]*h]),d=(c,f)=>1+.36*Math.pow(Math.max(0,Math.cos(f-u)),8)*wt(.2,.45,c)*(1-wt(.72,.9,c))+.03*Math.sin(f*5+r);w(Dt(k,r,ot,L,s,26,(c,f)=>P.clone().lerp(b,.5+.5*Math.sin(f*3+c*6+r)),d),1,t),w(Dt(k,r,ot+2.75*h,L,[[0,0],[2.4*h,.01],[4.75*h,.02]],18,()=>F,d),3,t),w(k.tube([[r+l*2.6*h,ot+2.7*h,L+a*2.6*h],[r+l*5.4*h,ot+3.3*h,L+a*5.4*h],[t[0],t[1],t[2]]],[.42,.4,.3],5,D,B),4,t),v.push([t[0],t[1]-.2,t[2],6.6*h,o()*40,0])}{const[r,L]=$e,u=.3,h=[r,ot+31,L,.0022];w(Dt(k,r,ot,L,[[0,0],[9.2,0],[9.8,1.1],[8.6,2.5],[4.6,3.3],[2.7,4.8],[2.2,7.6],[3.7,9.2],[3.9,10.3],[2.3,11.8],[1.9,15.6],[3.3,17.1],[3.5,18.3],[2.1,19.7],[1.8,23.6],[3.1,25.1],[6.6,26.3],[9.3,27.9],[9.9,29.3],[9.1,29.25],[6.6,28.2],[2.4,27.9],[1.7,30.2],[2.6,32.2],[1.4,34.6],[2.8,36.6],[3.1,38.1],[1.5,40.2],[0,43]],30,(t,s)=>V.clone().lerp(S,.5+.5*Math.sin(t*40)),(t,s)=>t>.58&&t<.7?1+.24*Math.pow(Math.max(0,Math.cos((s-u)*2.5)),6):1),2,h),w(Dt(k,r,ot+28.7,L,[[2.3,0],[5.5,.01],[8.9,.02]],20,()=>F),3,h);for(let t=0;t<5;t++){const s=u+t/5*at,d=[r+Math.cos(s)*11.6,ot+29.9,L+Math.sin(s)*11.6];w(k.tube([[r+Math.cos(s)*7.5,ot+28.8,L+Math.sin(s)*7.5],[r+Math.cos(s)*10.4,ot+29.4,L+Math.sin(s)*10.4],d],[.5,.48,.34],5,D,B),4,h),v.push([d[0],d[1]-.2,d[2],8.2,o()*40,1])}}const R=We(k,Kt(m,{fpars:"uniform float uLampK;",frag:`
      float k = vA.z, fl = vA.w * uLampK;
      if (k < 1.5) { float c1 = vnoise(vL.xz * 1.3 + vL.y * 2.), c2 = vnoise(vL.xz * 6. + vL.y * 9.); alb *= .62 + .5 * c1 + .25 * c2 * close; alb = mix(alb, vec3(.03, .025, .02), smoothstep(.55, .9, vA.w) * .7); n = normalize(n + vec3(c2 - .5, 0., c1 - .5) * .3); }   // fired clay, sooted at the lip
      else if (k < 2.5) { metal = .9; gloss = .5; float tr = abs(fract(vL.y * .9) - .5); alb *= .72 + .5 * vnoise(vec2(vA.y * 40., vL.y * .6)) + .2 * smoothstep(.3, .5, tr); ao *= .6 + .4 * smoothstep(0., 3., vL.y - ${ot}.); }
      else if (k < 3.5) { gloss = .95; alb *= .6 + .6 * vnoise(vL.xz * 2. + uTime * .2); emis += vec3(.9, .45, .08) * fl * .6; }
      else { alb *= .8 + .3 * vnoise(vL.xz * 9.); emis += vec3(2.4, .8, .15) * smoothstep(.7, 1., vA.w) * uLampK; }
      emis += alb * uLampCol * fl * (k > 1.5 && k < 2.5 ? 1.5 : 2.4);`}),"kolam-lamps"),A=[],T=[],M=[],n=[],i=[[0,0],[.5,.05],[.9,.17],[1,.31],[.9,.48],[.64,.66],[.36,.83],[.14,.94],[0,1]],p=10;for(const r of v){const L=A.length/3,u=r[3]*.2;for(let l=0;l<i.length;l++)for(let a=0;a<=p;a++){const t=a/p*at;A.push(Math.cos(t)*i[l][0]*u,i[l][1]*r[3],Math.sin(t)*i[l][0]*u),T.push(r[0],r[1],r[2]),M.push(i[l][1],r[4],0,u)}for(let l=0;l<i.length-1;l++)for(let a=0;a<p;a++){const t=L+l*(p+1)+a,s=t+p+1;n.push(t,s,s+1,t,s+1,t+1)}const h=A.length/3;for(const[l,a]of[[-1,-1],[1,-1],[1,1],[-1,1]])A.push(l,a,0),T.push(r[0],r[1]+r[3]*.45,r[2]),M.push(0,r[4],1,r[5]?30:17);n.push(h,h+1,h+2,h,h+2,h+3)}for(const r of C){const L=A.length/3,u=o()*40;for(const[h,l]of[[-1,-1],[1,-1],[1,1],[-1,1]])A.push(h,l,0),T.push(r[0],r[1],r[2]),M.push(0,u,2,r[3]);n.push(L,L+1,L+2,L,L+2,L+3)}const y=new z.BufferGeometry;y.setAttribute("position",new z.Float32BufferAttribute(A,3)),y.setAttribute("aBase",new z.Float32BufferAttribute(T,3)),y.setAttribute("aQ",new z.Float32BufferAttribute(M,4)),y.setIndex(n);const e=new z.Mesh(y,new z.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,blending:z.AdditiveBlending,side:z.DoubleSide,uniforms:{...fe(),uTime:m.uTime,uLampCol:m.uLampCol,uLampK:m.uLampK},vertexShader:`
      uniform float uTime; attribute vec3 aBase; attribute vec4 aQ;
      varying vec3 vN, vV; varying vec4 vQ; varying vec2 vC; varying float vD;
      void main(){
        float ph = aQ.y, t = aQ.x; vec4 mv;
        if (aQ.z > .5) { mv = viewMatrix * modelMatrix * vec4(aBase, 1.); mv.xy += position.xy * aQ.w * (1. + .06 * sin(uTime * 11. + ph)); vC = position.xy; vN = vec3(0., 0., 1.); vV = vec3(0., 0., 1.); }
        else {
          vec3 p = position; p.y *= 1. + .1 * sin(uTime * 9.3 + ph) + .05 * sin(uTime * 17. + ph * 2.);
          p.xz += vec2(sin(uTime * 6.1 + ph + t * 3.) * .7 + sin(uTime * 13.7 + ph * 3.) * .3, cos(uTime * 5.3 + ph * 1.7 + t * 2.) * .6) * t * t * aQ.w;
          vec4 wp = modelMatrix * vec4(aBase + p, 1.); mv = viewMatrix * wp;
          vN = normalize(normalMatrix * vec3(position.x, .25 * aQ.w, position.z)); vV = normalize(-mv.xyz); vC = vec2(0.);
        }
        vQ = aQ; vD = -mv.z; gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform vec3 uLampCol; uniform float uLampK, fogDensity; varying vec3 vN, vV; varying vec4 vQ; varying vec2 vC; varying float vD;
      void main(){
        float haze = exp(-fogDensity * fogDensity * vD * vD); vec3 col;
        if (vQ.z > .5) { float r2 = dot(vC, vC); col = uLampCol * (exp(-r2 * 5.) * .34 + exp(-r2 * 22.) * .5) * (1. - smoothstep(.6, 1., r2)) * uLampK; if (vQ.z > 1.5) { col *= 1.5; haze = sqrt(haze); } }
        else {
          float t = vQ.x, ndv = abs(dot(normalize(vN), normalize(vV)));
          vec3 body = mix(vec3(3.6, 1.7, .34), vec3(2.6, .78, .1), smoothstep(.45, 1., t));          // the colour stays in the flame: gold body, orange tip
          body = mix(vec3(.25, .3, .9), body, smoothstep(.02, .2, t));                              // a blue root at the wick
          col = (body * (.35 + .65 * ndv * ndv) + vec3(1.6, 1.3, .7) * pow(ndv, 6.) * (1. - smoothstep(.3, .75, t))) * pow(ndv, 1.3) * smoothstep(0., .08, t) * (1. - .5 * smoothstep(.8, 1., t)) * uLampK;
        }
        gl_FragColor = vec4(col * haze * mix(.34, 1., smoothstep(24., 95., vD)), 1.);      // close to the lens a flame keeps its colour: gold, not white
      }`}));return e.frustumCulled=!1,e.renderOrder=4,e.name="kolam-flames",{bodies:R,fire:e,flames:v}}function qo(m,o){const C=new qt.Geo,k=x("#8a6a3c"),P=x("#27501f"),b=x("#6f9632"),V=x("#b3a53a"),S=-47,F=47,D=78,B=ft+6.4,v=15,w=T=>D-34*T*(1-T),R=[];for(let T=0;T<=24;T++){const M=T/24;R.push([H(S,F,M),w(M),B-1.6*Math.cos((M-.5)*Math.PI)])}C.anim(C.tube(R,.5,6,k,k),()=>[0,0,4,0]);for(const T of[S,F])C.anim(C.tube([[T,D,ft+3.8],[T,D,B+.8]],[.9,.7],6,k,k),()=>[0,0,4,0]);for(let T=0;T<v;T++){const M=(T+.5)/v,n=H(S,F,M),i=w(M)-.3,p=14.5+4.5*o(),y=2.3+.6*o(),e=(o()-.5)*1.1,r=o()*20,L=(o()-.5)*2.4,u=Math.cos(e),h=Math.sin(e),l=P.clone().lerp(o()<.25?V:b,.25+.6*o()),a=ee(C,12,4,(t,s)=>{const d=s*2-1,c=y*Math.pow(Math.sin(Math.PI*Math.min(1,t*.9+.07)),.75)*(1-.3*t),f=d*c,q=.45*Math.abs(d)*c+L*t*t+.5*Math.sin(t*9+r)*(1-t),W=-(1.4+t*p);return[n+f*u-q*h,i+W,B+.4+f*h+q*u]},(t,s)=>l.clone().multiplyScalar(.75+.35*t+.15*Math.abs(s-.5)),7,r);C.pivot(a,n,i,B),C.pivot(C.anim(C.tube([[n,i+.4,B],[n,i-1.5,B+.4]],.22,4,k,P),()=>[0,0,4,r]),n,i,B)}return We(C,Kt(m,{lamps:!0,vert:"if (A.z > 5.) { float hang = aPivot.y - p.y; p.x += (sin(uTime * 1.2 + A.w) * .08 + sin(uTime * 2.9 + A.w * 1.7) * .03) * hang; p.z += cos(uTime * .9 + A.w * 1.3) * .06 * hang; }",frag:`
      if (vA.z > 5.) {
        float c = abs(vA.y - .5), mr = 1. - smoothstep(0., .05, c), sv = 1. - smoothstep(0., .14, abs(fract(vA.x * 11. - c * 1.6) - .5));
        alb *= (.8 + .35 * vnoise(vec2(vA.y * 9., vA.x * 30.))) * (1. + .55 * mr + .2 * sv); gloss = .5;
        emis += alb * (uSkyLow * .16 + uSunCol * sunAt(vW) * .25); ao *= .75 + .25 * vA.x;
      } else alb *= .7 + .5 * step(.5, fract(vL.x * .9 + vL.y * .7));`}),"kolam-festoon")}function _o(m,o,C,k){const P=new qt.Geo,b=x("#a03c08"),V=x("#e0701c"),S=x(Ot[5]),F=x("#30040c"),D=x("#8f0f24"),B=x("#c3352d"),v=x("#e9cfb2"),w=x("#e2b23c"),R=(A,T,M)=>{for(let n=A[0];n<A[1];n++)P.a[n*4+2]=T,P.a[n*4+3]=M;return A};return C.anchors.dots.forEach((A,T)=>{const M=Math.round((Math.abs(A.x)+Math.abs(A.z))/40),n=M<2;if(k===1&&M!==1){o();return}const i=o()*at,p=2.25,y=T*1.9;if(n){for(let r=0;r<5;r++){const L=i+r/5*at,u=5+3*((r*7+T)%3);R(ee(P,7,6,(h,l)=>{const a=l*2-1,t=.72*Math.pow(Math.sin(Math.PI*Math.min(1,h*.84+.13)),.6),s=.3+3.5*h,d=L+a*t+.25*h;return[A.x+Math.cos(d)*s,p+.5+1.5*Math.pow(h,.7)-2.3*h*h*h+.22*Math.sin(a*u+r)*h*h+.2*(1-a*a)*h,A.z+Math.sin(d)*s]},h=>F.clone().lerp(D,wt(.05,.4,h)).lerp(B,.5*wt(.65,1,h))),2,y+r)}const e=[A.x+Math.cos(i)*1.3,p+4.4,A.z+Math.sin(i)*1.3];R(P.tube([[A.x,p+.6,A.z],[A.x+Math.cos(i)*.5,p+2.6,A.z+Math.sin(i)*.5],e],[.24,.19,.15],5,v,v),3,y),R(P.blob(e[0],e[1]+.1,e[2],.42,.42,.42,w,w,6,3),3,y)}else{const e=o()<.5?S:V;for(let r=0;r<4;r++){const L=r/3,u=11-2*r,h=.1+1.25*L,l=2.5-1.3*L;for(let a=0;a<u;a++){const t=i+(a+(r&1)*.5+(o()-.5)*.3)/u*at,s=.8+.3*o(),d=Math.cos(h),c=Math.sin(h);R(ee(P,3,2,(f,q)=>{const W=q*2-1,I=.55*(.4+.6*Math.sin(Math.PI*Math.min(1,f*.7+.15))),O=l*f,j=.5*l*f*f*f,Z=O*d-j*c*.4,Y=O*c-j*d+.12*(1-W*W);return[A.x+Math.cos(t)*Z-Math.sin(t)*W*I,p+.5+.9*Math.sin(L*1.5)+Y,A.z+Math.sin(t)*Z+Math.cos(t)*W*I]},f=>b.clone().lerp(V,.3+.5*L).lerp(e,f*f).multiplyScalar(s*(.55+.45*f))),1,y+a)}}}}),We(P,Kt(m,{gloss:.15,vert:"p.y += sin(uTime * 2.6 + A.w * 2.3 + A.x * 4.) * .05 * A.x * A.x;",frag:`
      if (vA.z > 2.5) { alb *= .85 + .3 * vnoise(vL.xz * 9.); }
      else if (vA.z > 1.5) {
        float c = vA.y - .5, fan = c / (.16 + vA.x * .8), vv = abs(fract(fan * 6.) - .5) * 2.;
        float vein = max(smoothstep(.72, .95, vv), 1. - smoothstep(0., .04, abs(c))) * smoothstep(.05, .25, vA.x) * (1. - smoothstep(.8, 1., vA.x));
        alb *= (1. - .55 * vein) * (.7 + .5 * vnoise(vec2(c * 40., vA.x * 18.))); emis += alb * (uSkyLow * .05 + uSunCol * sunAt(vW) * .16); ao *= .5 + .5 * smoothstep(0., .45, vA.x); sunK = .6; gloss = .35;
      } else { alb *= .75 + .45 * vnoise(vL.xz * 5. + vL.y * 3.); emis += alb * (uSkyLow * .06 + uSunCol * sunAt(vW) * .12); ao *= .6 + .4 * vA.x; }`}),"kolam-dot-flowers")}async function Ro(m,o,C,k,P){const b=new qt.Geo,V=[],S=(p,y,e,r=0,L=0)=>b.anim(p,()=>[y,e,r,L]),F=(p,y,e,r,L,u,h,l)=>{const a=b.n,t=l||h,s=d=>{const c=b.n;for(const f of d)b.v(f[0],f[1],f[2],f[1]>(e+r)/2?h:t);b.quad(c,c+1,c+2,c+3)};return s([[p,e,u],[y,e,u],[y,r,u],[p,r,u]]),s([[p,r,u],[y,r,u],[y,r,L],[p,r,L]]),s([[y,e,L],[p,e,L],[p,r,L],[y,r,L]]),s([[p,e,L],[p,e,u],[p,r,u],[p,r,L]]),s([[y,e,u],[y,e,L],[y,r,L],[y,r,u]]),[a,b.n]},D=Oe([[.36,0],[.7,.07],[.95,.3],[1,.56],[.9,.82],[.63,1.03],[.44,1.15],[.42,1.25],[.55,1.36],[.6,1.41],[.5,1.43]],16),B=(p,y,e,r,L,u,h)=>{const l=o()*9;return S(Dt(b,p,y,e,D.map(a=>[a[0]*r,a[1]*r]),26,(a,t)=>L.clone().lerp(u,.5+.5*Math.sin(t*2+a*5+l)).multiplyScalar(.75+.35*a),(a,t)=>1+.02*Math.sin(t*3+l)),0,h),y+1.3*r},v=x("#6e4634"),w=x("#8a5a3c"),R=x("#8a7038"),A=x("#5e4c2a"),T=(p,y,e,r)=>{let L=B(p,0,y,e,v,w,r);L=B(p+e*.06,L,y-e*.04,e*.82,R,A,r),B(p-e*.04,L,y+e*.03,e*.66,w,v,r)},M=(p,y,e,r,L)=>{const u=x("#4d5a3e"),h=x("#6a7448"),l=x("#2f4c34"),a=x("#4e6a3c"),t=150*e,s=[(o()-.5)*.12,(o()-.5)*.12],d=[],c=[];for(let Y=0;Y<=8;Y++){const g=Y/8;d.push([p+s[0]*t*g*g,t*g,y+s[1]*t*g*g]),c.push(H(21,11,Math.pow(g,.8))*e*(1+.06*Math.sin(g*19)))}S(b.tube(d,c,10,u,h),0,L);const f=d[8][0],q=d[8][1],W=d[8][2],I=9;for(let Y=0;Y<I;Y++){const g=r+Y/I*at*1.62+(o()-.5)*.3,U=Y/(I-1),it=H(1.38,.5,U),lt=H(-.25,-1.25,U*U),rt=(150+50*o())*e*H(.72,1,Math.sin(Math.PI*Math.min(1,U+.25))),Mt=o()*20,et=14,gt=[[f,q-6*e,W]];let xt=0,Lt=0;for(let Tt=1;Tt<=et;Tt++){const _t=Tt/et,Pt=H(it,lt,Math.pow(_t,1.25));xt+=Math.cos(Pt)*rt/et,Lt+=Math.sin(Pt)*rt/et,gt.push([f+Math.cos(g)*xt,q-6*e+Lt,W+Math.sin(g)*xt])}const It=-Math.sin(g),Qt=Math.cos(g),jt=(27+8*o())*e,Et=5+Math.floor(o()*4),pe=ee(b,et,4,(Tt,_t)=>{const Pt=Tt*et,$t=Math.min(et-1,Math.floor(Pt)),me=Pt-$t,At=_t*2-1,oe=H(gt[$t][0],gt[$t+1][0],me),Te=H(gt[$t][1],gt[$t+1][1],me),ae=H(gt[$t][2],gt[$t+1][2],me),le=1-.3*Math.max(0,Math.sin(Tt*Et*at+Mt))*Math.abs(At)*wt(.25,.5,Tt),ue=jt*Math.pow(Math.sin(Math.PI*Math.min(1,Tt*.9+.07)),.55)*le;return[oe+It*At*ue,Te-Math.abs(At)*ue*(.22+.5*Tt)-3*e*Math.sin(Tt*Et*at+Mt)*Math.abs(At),ae+Qt*At*ue]},(Tt,_t)=>l.clone().lerp(a,.2+.5*Math.abs(_t-.5)+.3*Tt).multiplyScalar(Math.abs(_t-.5)<.13?1.35:1),0,0);S(pe,0,L,2,Mt),b.pivot(pe,f,q,W)}const O=r+2.2,j=f+Math.cos(O)*34*e,Z=W+Math.sin(O)*34*e;S(b.tube([[f,q-4*e,W],[H(f,j,.6),q+6*e,H(W,Z,.6)],[j,q-14*e,Z],[j+1,q-42*e,Z]],[5*e,4.4*e,4*e,3.4*e],6,h,u),0,L),S(b.blob(j+1,q-55*e,Z,10*e,17*e,10*e,x("#5a2a3c"),x("#3c1c30"),9,6),0,L)};T(-402,-150,36,9999),B(-466,0,-116,31,R,A,9999),M(-585,-35,1,.4,330),M(-676,50,.66,2.1,240),await P.yield();{const r=Math.cos(.15),L=Math.sin(.15),u=62,h=9999,l=(g,U,it=0)=>[-800-g,ot+U*r,-237-U*L+it],a=x("#3c4654"),t=x("#586478"),s=x("#23262c"),d=x("#8f98a8"),c=x("#4a3424"),f=(g,U,it=a,lt=t,rt=6)=>S(b.tube(g,U,rt,it,lt),0,h);for(const g of[-108,108]){const U=[];for(let lt=0;lt<=40;lt++){const rt=lt/40*at;U.push(l(g+Math.cos(rt)*u,u+6+Math.sin(rt)*u))}f(U,5.6,s,s,7);for(let lt=0;lt<14;lt++){const rt=lt/14*at+(g>0?.2:0);f([l(g+Math.cos(rt)*7,u+6+Math.sin(rt)*7,lt&1?5:-5),l(g+Math.cos(rt)*(u-3),u+6+Math.sin(rt)*(u-3))],1.7,d,d,3)}f([l(g,u+6,-8),l(g,u+6,8)],7,d,a,8);const it=[];for(let lt=0;lt<=16;lt++){const rt=H(g>0?.25:-.2,g>0?3.3:2.9,lt/16);it.push(l(g+Math.cos(rt)*(u+9),u+6+Math.sin(rt)*(u+9)))}f(it,3.6,a,t,5)}const q=[-8,62],W=[-38,168],I=[70,174],O=[78,146],j=[-108,u+6],Z=[108,u+6];f([l(q[0],q[1]),l(W[0],W[1]),l(W[0]-4,W[1]+16)],4.6),f([l(W[0],W[1]-6),l(I[0],I[1]-6)],4.4),f([l(q[0],q[1]),l(O[0],O[1])],5),f([l(O[0]+2,O[1]-6),l(I[0]-4,I[1]+22)],5);for(const g of[-7,7])f([l(q[0],q[1],g*.4),l(j[0],j[1],g)],3.2),f([l(W[0],W[1]-8,g*.4),l(j[0],j[1],g)],3),f([l(O[0],O[1],g*.4),l(92,104,g),l(Z[0],Z[1],g)],3.4);f([l(I[0]-4,I[1]+22,-30),l(I[0]-2,I[1]+24,0),l(I[0]-4,I[1]+22,30)],3.6,d,d);for(const g of[-30,30])f([l(I[0]-4,I[1]+22,g),l(I[0]-30,I[1]+17,g*1.1)],4.6,c,c);S(b.blob(...l(W[0]-8,W[1]+21),26,6.5,12,c,x("#2c2018"),9,5),0,h),f([l(-152,143,-10),l(-44,147,-10),l(-44,147,10),l(-152,143,10),l(-152,143,-10)],2.8);for(const g of[-10,10])f([l(-140,143,g),l(j[0],j[1],g)],2.4);const Y=[];for(let g=0;g<=16;g++){const U=g/16*at;Y.push(l(q[0]+Math.cos(U)*17,q[1]+Math.sin(U)*17,7))}f(Y,3,d,a,5),f([l(q[0],q[1],9),l(q[0]+14,q[1]-28,11)],2.6,d,d),f([l(q[0]+6,q[1]-28,6),l(q[0]+22,q[1]-28,18)],3.4,s,s),f([l(q[0]+17,q[1]+4,7),l(j[0]+8,j[1]+7,7)],1.8,d,d,3),f([l(q[0]+17,q[1]-14,7),l(j[0]+8,j[1]-7,7)],1.8,d,d,3)}await P.yield();{const e=x("#4a3424"),r=x("#32241c"),L=x("#8a8f98"),u=x(Ot[3]).multiplyScalar(.8),h=x("#7a3f26");S(F(-1186,-1164,ot,300,ft+2,ft+12,L),0,330),S(F(-1016,-994,ot,300,ft+2,ft+12,L),0,330),S(F(-1164,-1093,ot,300,ft+2,ft+6,e,r),0,330),S(F(-1087,-1016,ot,300,ft+2,ft+6,e,r),0,330);for(const d of[-1,1])for(let c=0;c<4;c++)S(F(-1090+d*14,-1090+d*62,ot+14+c*62,ot+62+c*62,ft+6,ft+8.5,r,e),0,330);S(F(-1200,-980,ot,ot+5,ft+2,ft+22,e),0,330);for(let d=0;d<7;d++){const c=-1090+(d-3)*36+(o()-.5)*8,f=te-8,q=1.15+.3*o();S(Dt(b,c,ot,f,[[0,0],[3,.1],[5.6,1.6],[6.6,3.6],[5.4,3.5],[2.4,2.2],[0,2]].map(O=>[O[0]*q,O[1]*q]),12,()=>h),0,330);const W=[c,ot+4*q,f+6*q],I=[[0,0],[1.5,1.6],[1.9,3.6],[1.3,6.2],[.5,8.6],[0,10]].map(O=>[O[0]*q,O[1]*q]);S(Dt(b,W[0],W[1],W[2],I,8,()=>h),0,330,1,o()*40),V.push([W[0],W[1]+5*q,W[2],46])}const l=-1090,a=-78,t=[];for(let d=0;d<=160;d++){const c=d/160*at,f=60+30*Math.cos(c*4)+9*Math.cos(c*8);t.push([l+Math.cos(c+.39)*f,1.6,a+Math.sin(c+.39)*f])}S(b.tube(t,3.3,4,u,u),0,9999,3);const s=[];for(let d=0;d<=96;d++){const c=d/96*at,f=30+12*Math.cos(c*4+Math.PI);s.push([l+Math.cos(c+.39)*f,1.6,a+Math.sin(c+.39)*f])}S(b.tube(s,3,4,u,u),0,9999,3);for(let d=0;d<9;d++){const c=d/8*at+.39,f=d===8?0:62;S(b.blob(l+Math.cos(c)*f,1.5,a+Math.sin(c)*f,4.6,3,4.6,u,u,7,4),0,9999,3)}}await P.yield(),M(655,-168,1.06,1.3,340),M(738,-112,.7,3.4,250),T(584,-150,33,9999),B(542,0,-128,27,v,w,9999);{const p=[[762,-196],[778,-60],[822,70],[900,210],[1010,350],[1150,470]],y=x("#5e5246"),e=x("#77695a"),r=new z.CatmullRomCurve3(p.map(t=>new z.Vector3(t[0],0,t[1])),!1,"centripetal"),L=44,u=new z.Vector3,h=new z.Vector3,l=[[-11,0],[-10,34],[-6,43],[0,46],[6,43],[10,34],[11,0]],a=ee(b,L,l.length-1,(t,s)=>{r.getPointAt(t,u),r.getTangentAt(t,h);const d=l[Math.round(s*(l.length-1))],c=1+.12*C.n2(t*9,3.3)-.3*wt(.86,1,t);return[u.x-h.z*d[0],d[1]*c,u.z+h.x*d[0]]},(t,s)=>y.clone().lerp(e,.5+.5*C.n2(t*23,s*3)).multiplyScalar(.7+.5*Math.sin(Math.PI*s)),0,0);S(a,0,9999)}await P.yield();{const e=x("#8a8f98"),r=x("#6c5a58"),L=x(Ot[3]).multiplyScalar(.8),u=x("#7a3f26");S(F(-2300,1800,0,22,652,702,e,r),0,9999);for(let t=0;t<9;t++){const s=-290+(t-4)*40+(o()-.5)*9,d=660,c=1.2+.3*o();S(Dt(b,s,22,d,[[0,0],[3,.1],[5.6,1.6],[6.6,3.6],[5.4,3.5],[2.4,2.2],[0,2]].map(W=>[W[0]*c,W[1]*c]),12,()=>u),0,9999);const f=[s,22+4*c,d-6*c],q=[[0,0],[1.5,1.6],[1.9,3.6],[1.3,6.2],[.5,8.6],[0,10]].map(W=>[W[0]*c,W[1]*c]);S(Dt(b,f[0],f[1],f[2],q,8,()=>u),0,9999,1,o()*40),V.push([f[0],f[1]+5*c,f[2],50])}const h=-280,l=548,a=[];for(let t=0;t<=160;t++){const s=t/160*at,d=62+26*Math.cos(s*6)+8*Math.cos(s*12);a.push([h+Math.cos(s+.2)*d,1.6,l+Math.sin(s+.2)*d])}S(b.tube(a,3.4,4,L,L),0,9999,3);for(let t=0;t<7;t++){const s=t/6*at+.2,d=t===6?0:50;S(b.blob(h+Math.cos(s)*d,1.5,l+Math.sin(s)*d,4.8,3,4.8,L,L,7,4),0,9999,3)}T(-96,606,35,9999),B(-34,0,624,28,R,A,9999),T(-640,612,30,9999),B(250,0,618,30,v,w,9999),M(-500,598,1,.9,330),M(-585,630,.62,2.6,230),M(96,612,.86,4,300),M(520,640,.74,5.2,260)}if(await P.yield(),k===2){const e=x("#5a4e68"),r=x("#74627c");let L=0,u=400,h=300;const l=b.n;for(let a=0;a<9;a++){F(1350-u/2,1350+u/2,L,L+58,-1600-h/2,-1600+h/2,e,r),F(1350-u*.54,1350+u*.54,L+58,L+68,-1600-h*.54,-1600+h*.54,r);for(let t=-2;t<=2;t++)F(1350+t*u*.2-u*.05,1350+t*u*.2+u*.05,L+12,L+44,-1600+h/2,-1600+h/2+6,r);L+=68,u*=.875,h*=.875}ee(b,10,10,(a,t)=>{const s=t*Math.PI;return[1350+(a-.5)*u*1.05,L+Math.sin(s)*h*.62,-1600+Math.cos(s)*h*.55]},()=>r);for(let a=-3;a<=3;a++)b.blob(1350+a*u*.14,L+h*.62+16,-1600,8,22,8,r,e,6,4);b.anim([l,b.n],(a,t)=>[-H(.92,.74,wt(250,520,t)),9999,0,0])}await P.yield();const n=b.build();n.computeVertexNormals();const i=new z.Mesh(n,new z.ShaderMaterial({side:z.DoubleSide,uniforms:{...m,uMistK:{value:.00105}},vertexShader:`
      ${Xt}
      attribute vec3 color; attribute vec4 aAnim; attribute vec3 aPivot;
      varying vec3 vW, vN, vC; varying vec4 vA;
      void main(){
        vec3 p = position;
        if (aAnim.z > 1.5 && aAnim.z < 2.5) { vec3 q = p - aPivot; float d = length(q); p.y += sin(uTime * .55 + aAnim.w) * .035 * d; p.xz += vec2(cos(uTime * .4 + aAnim.w * 1.3), sin(uTime * .33 + aAnim.w)) * .02 * d; }   // the great leaves sway
        if (aAnim.z > .5 && aAnim.z < 1.5) p.xz += vec2(sin(uTime * 7. + aAnim.w), cos(uTime * 6. + aAnim.w)) * .5;                 // the far flames waver
        vec4 wp = modelMatrix * vec4(p, 1.); vW = wp.xyz; vN = mat3(modelMatrix) * normal; vC = color; vA = aAnim;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:`
      ${Xt}
      ${Fe}
      uniform float uMistK;
      varying vec3 vW, vN, vC; varying vec4 vA;
      void main(){
        vec3 n = normalize(vN + vec3(0., 1e-4, 0.)); if (!gl_FrontFacing) n = -n;
        vec3 toCam = cameraPosition - vW; float dist = length(toCam); vec3 V = toCam / max(dist, 1e-4);
        float k = vA.z, flame = step(.5, k) * step(k, 1.5), ndv = clamp(dot(V, n), 0., 1.);
        vec3 alb = vC * (.78 + .44 * vnoise(vW.xz * .09 + vW.y * .13));
        vec3 lit = alb * (skyLight(n) + uSunCol * uSunUp * (max(dot(n, uSunDir), 0.) * 1.1 + .3 * pow(1. - ndv, 2.)));
        lit += alb * uSkyLow * .25 * pow(1. - ndv, 3.);
        lit = mix(lit, uLampCol * (2.4 + .5 * sin(uTime * 9. + vA.w)), flame);
        float hz = 1. - exp(-dist * dist * uMistK * uMistK); hz = vA.x < 0. ? min(hz, -vA.x) : max(hz, vA.x); hz = max(hz, .22 * (1. - flame));   // (a negative floor is a ceiling: the far tower never quite drowns)
        hz = 1. - (1. - hz) * (1. - .62 * exp(-max(vW.y, 0.) / 28.)) * (1. - .94 * step(1., vA.y) * smoothstep(vA.y * .5, max(vA.y, 1.), vW.y));     // deeper in the mist at the foot; the tall ones thin away upward
        hz *= 1. - .6 * flame;
        gl_FragColor = vec4(mix(lit, skyCol(-V), hz), 1.);
      }`}));return i.frustumCulled=!1,i.name="kolam-street",{mesh:i,flames:V}}function Fo(m,o,C){const k=new qt.Geo,P=x("#ffffff");Dt(k,0,0,0,[[1,0],[.97,.2],[.82,.42],[.55,.57],[0,.64]],10,()=>P);const b=k.build();b.computeVertexNormals();const V=new z.InstancedBufferGeometry;V.index=b.index,V.setAttribute("position",b.getAttribute("position")),V.setAttribute("normal",b.getAttribute("normal"));const S=new Float32Array(o.length*4);o.forEach((B,v)=>S.set(B,v*4)),V.setAttribute("aBead",new z.InstancedBufferAttribute(S,4)),V.instanceCount=o.length;const F=new z.ShaderMaterial({fog:!0,side:z.DoubleSide,uniforms:{...fe(),...m,uStone:{value:C},uDry:{value:0},uLandP:{value:new z.Vector2}},vertexShader:`#include <fog_pars_vertex>
      ${Xt}
      attribute vec4 aBead; uniform float uDry; uniform vec2 uLandP;
      varying vec3 vW, vN, vL;
      void main(){
        float ph = aBead.x * 1.7 + aBead.z * 2.3; vec2 dl = aBead.xz - uLandP;
        float tr = exp(-dot(dl, dl) / 3600.) * step(aBead.y, 4.);
        float r = aBead.w * (1. - uDry * (.25 + .3 * fract(ph)));
        vec3 p = position * r; p.y *= 1. + tr * .25 * sin(uTime * 37. + ph); p.xz *= 1. - tr * .1 * sin(uTime * 37. + ph);
        p.xz += tr * .05 * r * vec2(sin(uTime * 29. + ph), cos(uTime * 31. + ph));
        vec4 wp = modelMatrix * vec4(p + aBead.xyz, 1.); vW = wp.xyz; vN = normal; vL = position;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`#include <fog_pars_fragment>
      ${Xt}
      uniform vec3 uStone; varying vec3 vW, vN, vL;
      void main(){
        vec3 n = normalize(vN + vec3(0., 1e-4, 0.)); if (!gl_FrontFacing) n = -n;
        vec3 V = normalize(cameraPosition - vW), R = reflect(-V, n); float ndv = clamp(dot(V, n), 0., 1.);
        float sun = sunAt(vW); vec3 Lk = normalize(mix(vec3(0., .55, .83), uSunDir + vec3(0., .25, 0.), sun));
        vec3 refl = mix(uSkyLow, uSkyTop, pow(clamp(R.y, 0., 1.), .5)); refl = mix(refl, uHouse, smoothstep(0., .8, -R.z) * .8);
        float far = max(dot(n, normalize(vec3(-Lk.x, .15, -Lk.z))), 0.);
        vec3 inside = uStone * (.5 + .5 * smoothstep(0., .35, vL.y)) + uSkyLow * .07 + (uSkyLow + uSunCol * sun * 1.4) * (1.15 * far * far);   // the lens gathers light on its far side
        float F = .06 + .94 * pow(1. - ndv, 3.);
        vec3 col = mix(inside, refl, F * .85);
        col += uSkyLow * (pow(max(dot(R, Lk), 0.), 40.) * 2.2 + pow(1. - ndv, 5.) * .5);
        col += uSunCol * sun * (pow(max(dot(R, uSunDir), 0.), 260.) * 8. + pow(max(dot(R, uSunDir), 0.), 24.) * 1.6 + 1.3 * far * far);      // every bead flares when the sun finds it
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`}),D=new z.Mesh(V,F);return D.frustumCulled=!1,D.name="kolam-beads",D}function Ko(m,o,C,k,P,b,V){const S=new qt.Geo,F=x(b===2?"#2c3516":"#1b3518"),D=x(b===2?"#545c2a":"#3f6030"),B=S.v(0,1,0,D),v=[];for(let a=1;a<=3;a++){const t=[];for(let s=0;s<10;s++){const d=(s+a*.5)/10*at,c=a/3*1.45,f=1+.13*Math.sin(d*2+a*1.9)+.06*Math.sin(d*3+a);t.push(S.v(Math.cos(d)*Math.sin(c)*f,a===3?-.15:Math.cos(c)*(.9+.1*Math.cos(d*2+a)),Math.sin(d)*Math.sin(c)*f,a===3?F:F.clone().lerp(D,.6-a*.2)))}v.push(t)}for(let a=0;a<10;a++)S.tri(B,v[0][(a+1)%10],v[0][a]);for(let a=0;a<2;a++)for(let t=0;t<10;t++)S.quad(v[a][t],v[a][(t+1)%10],v[a+1][(t+1)%10],v[a+1][t]);const w=S.build();w.computeVertexNormals();const R=[],A=(a,t)=>t>te+4&&Math.hypot(a-Ht[0],t-Ht[2])>15&&Math.hypot(a-_e[0],t-_e[2])>13,T=()=>{const a=o();return .7+2.3*a*a};if(b===2)for(let a=0;a<5200&&R.length<1500*Math.min(1,P+.15);a++){const t=(o()-.5)*640,s=-196+o()*520,d=C.n2(t*.011+3.3,s*.011)+.35*C.n2(t*.05,s*.05+7);if(d<.42||Math.hypot(t,s)<116||!A(t,s))continue;const c=T()*(.6+.8*Math.min(1,(d-.42)*3));R.push([t,s,c,.35+.45*c*(.6+.6*o()),o()*at])}else for(const a of[0,1])for(const t of[-180,-60,60,180])for(let s=-300;s<300;s+=1.5+1.5*o()){const d=a?s:t+(o()-.5)*1.5,c=a?t+(o()-.5)*1.5:s;if(!A(d,c)||Math.hypot(d,c)>190&&o()<.45||o()>P+.15||C.n2(d*.02,c*.02)<-.45)continue;const q=T();R.push([d,c,q,.4+.42*q*(.6+.6*o()),o()*at])}const M=new z.Object3D,n=new z.InstancedMesh(w,Kt(m,{frag:"vec2 mq = vW.xz + vW.y * .8; float m1 = vnoise(mq * 2.2), m2 = vnoise(mq * 7.), m3 = vnoise(vW.xz * .3 + 5.), nap = vnoise(mq * 21.) * .6 + vnoise(mq * 47.) * .4, tuft = smoothstep(.3, .7, vnoise(mq * 4.4 + 7.)); alb *= (.5 + .5 * m1 + .35 * m2) * (.72 + .56 * nap * (.35 + .65 * close)) * (.75 + .4 * tuft); alb = mix(alb, alb * vec3(1.2, 1.08, .62), smoothstep(.5, .8, m3) * .8); n = normalize(n + vec3(m2 - .5, 0., m1 - .5) * .5 + vec3(nap - .5, 0., vnoise(mq * 21. + 5.) - .5) * .5 * close); ao *= .32 + .68 * smoothstep(0., 1.2, vW.y); float rimM = pow(1. - clamp(dot(V, n), 0., 1.), 2.5); emis += (alb * .5 + vec3(.05, .07, .06) * (.5 + nap)) * uSkyLow * rimM * 1.1 + alb * uSkyLow * .03;"}),R.length);R.forEach((a,t)=>{M.position.set(a[0],0,a[1]),M.scale.set(a[2]*1.2,a[3],a[2]*.9),M.rotation.set(0,a[4],0),M.updateMatrix(),n.setMatrixAt(t,M.matrix)}),n.instanceMatrix.needsUpdate=!0,n.frustumCulled=!1,n.name="kolam-moss";const i=Math.round((b===2?380:160)*P),p=new z.InstancedMesh(w,Kt(m,{gloss:.6,uniforms:{uPeb:{value:x(b===2?"#8a7c62":"#56607a")}},fpars:"uniform vec3 uPeb;",frag:"float m1 = vnoise(vW.xz * 3.1), m2 = vnoise(vW.xz * 11.), m3 = vnoise(vW.xz * .7 + 9.); alb = mix(uPeb, uPeb.bgr * 1.1, m3 * .5) * (.6 + .7 * m1) * (.85 + .3 * m2 * close); alb = mix(alb, alb * 1.7, smoothstep(.62, .7, vnoise(vW.xz * 1.9 + vW.y * 3.)) * .5); n = normalize(n + vec3(m2 - .5, 0., m1 - .5) * .28); ao *= .5 + .5 * smoothstep(-.05, .5, vW.y); vec3 Rp = reflect(-V, n); emis += uSkyLow * (pow(max(dot(Rp, normalize(vec3(0., .55, .83))), 0.), 34.) * 1.5 + .3 * max(n.y, 0.) * max(n.y, 0.) + .34 * pow(1. - clamp(dot(V, n), 0., 1.), 3.)) + uSunCol * sunAt(vW) * pow(max(dot(Rp, uSunDir), 0.), 60.) * 2.;"}),i);for(let a=0;a<i;a++){const t=k.pointAt(o()*.9),s=o()*at,d=8+60*o()*o(),c=.35+1.3*o()*o(),f=t.x+Math.cos(s)*d,q=t.z+Math.sin(s)*d;let W=t.y<45&&q>te+6;for(let I=0;W&&I<V.curve.count;I+=4)Math.abs(V.curve.X[I]-f)<4&&Math.abs(V.curve.Z[I]-q)<4&&(W=!1);for(const I of V.anchors.dots)Math.hypot(I.x-f,I.z-q)<4.5&&(W=!1);M.position.set(f,W?-.1*c:-50,q),M.scale.set(c*(.8+.6*o()),c*(.45+.4*o()),c),M.rotation.set(0,o()*at,0),M.updateMatrix(),p.setMatrixAt(a,M.matrix)}p.instanceMatrix.needsUpdate=!0,p.frustumCulled=!1,p.name="kolam-pebbles";const y=new qt.Geo,e=x(b===2?"#8f9a50":"#7fa052"),r=x("#9a8648");for(const[a,t]of[[1,0],[0,1]]){const s=y.n,d=[.06,.045,.04,.11,.03],c=[0,.5,.82,.92,1];for(let f=0;f<5;f++)for(const q of[-1,1]){const W=y.v(a*q*d[f],c[f],t*q*d[f],f>=3?r:e);y.a[W*4]=c[f]}for(let f=0;f<4;f++)y.quad(s+f*2,s+f*2+1,s+f*2+3,s+f*2+2)}const L=y.build();L.computeVertexNormals();const u=[],h=[];for(let a=0;a<=90;a++)h.push(k.pointAt(a/90));for(const a of R){let t=1e9;for(const d of h)t=Math.min(t,Math.abs(d.x-a[0])+Math.abs(d.z-a[1]));if(o()<(t>190?.9:.7))continue;const s=1+Math.floor(o()*2.4);for(let d=0;d<s;d++)u.push([a[0]+(o()-.5)*1.6,a[3]*.6,a[1]+(o()-.5)*1.6,1.4+1.5*o(),o()*at])}const l=new z.InstancedMesh(L,Kt(m,{vert:`
      vec3 o = (modelMatrix * im * vec4(0., 0., 0., 1.)).xyz; float dd = length(cameraPosition - o);
      p.xz *= max(1., dd * .0045);
      p.x += sin(uTime * 1.7 + o.x * .31 + o.z * .23) * .13 * A.x * A.x; p.z += cos(uTime * 1.3 + o.x * .2 - o.z * .27) * .1 * A.x * A.x;
      n = vec3(0., 1., 0.);`,frag:"ao *= .6 + .4 * vA.x; emis += alb * uSkyLow * .45;"}),u.length);return u.forEach((a,t)=>{M.position.set(a[0],a[1],a[2]),M.scale.set(1,a[3],1),M.rotation.set(0,a[4],0),M.updateMatrix(),l.setMatrixAt(t,M.matrix)}),l.instanceMatrix.needsUpdate=!0,l.frustumCulled=!1,l.name="kolam-moss-stalks",{cushions:n,stalks:l,pebbles:p,spots:R}}function Io(m,o,C,k,P,b,V){const S=o.curve.X,F=o.curve.Z,D=S.length,B=o.anchors.dots,v=(T,M,n)=>{for(let i=0;i<D;i+=3){const p=S[i]-T,y=F[i]-M;if(p*p+y*y<(n+3.2)*(n+3.2))return!1}for(const i of B)if(Math.hypot(i.x-T,i.z-M)<n+3.6)return!1;for(let i=1;i<V.length;i++){const p=V[i-1][0],y=V[i-1][1],e=V[i][0]-p,r=V[i][1]-y,L=Bt(((T-p)*e+(M-y)*r)/Math.max(1e-6,e*e+r*r),0,1);if(Math.hypot(T-p-e*L,M-y-r*L)<n+3.4)return!1}return!0},w=()=>{const T=m();return .3+1.25*T*T*T+(m()<.06?.5:0)},R=Math.round(520*P*Bt(b,.8,1.25)),A=C.pointAt(0);for(let T=0;T<46;T++){const M=A.x+(m()-.5)*90,n=A.z-12-m()*75,i=w()*1.25;Math.abs(M-A.x)>6+i&&v(M,n,i)&&k.push([M,-.03,n,i])}for(let T=0;T<R*3&&k.length<R;T++){let M,n;const i=w();if(T%3===0){const e=m()*at,r=Math.sqrt(m())*150;M=Math.cos(e)*r,n=Math.sin(e)*r}else{const e=C.pointAt(m()*.93);if(e.y>45)continue;const r=m()*at,L=7+48*m()*m();M=e.x+Math.cos(r)*L,n=e.z+Math.sin(r)*L}if(n<te+3){if(n<ft+14||Math.abs(M)>130)continue;let e=!0;for(const r of Ce)Math.hypot(M-r[0],n-r[1])<12*r[2]+i&&(e=!1);e&&Math.abs(n+258)>5+i&&k.push([M,ot-.03,n,i*.8]);continue}if(Math.hypot(M-Ht[0],n-Ht[2])<14+i||Math.hypot(M-_e[0],n-_e[2])<12+i)continue;const p=Math.abs(((M-60)%120+120)%120),y=Math.abs(((n-60)%120+120)%120);Math.min(p,120-p)<2.2+i||Math.min(y,120-y)<2.2+i||v(M,n,i)&&k.push([M,-.03,n,i])}}function No(m,o){const C=m.path,k=o.curve,P=new z.Vector3,b=new z.Vector3,V=[[60.5,-181],[59.6,-170],[58,-157]],S=(R,A)=>{let T=0,M=1e9;for(let n=0;n<k.count;n+=2){if(k.W[n]<.5)continue;const i=(k.X[n]-R)**2+(k.Z[n]-A)**2;i<M&&(M=i,T=n)}return{i:T,d:Math.sqrt(M)}},F=9,D=m.uDesc+.002,B=m.uLow+.012;for(let R=0;R<=F;R++){const A=H(B,D,R/F);C.pointAt(A,P),C.tangentAt(A,b);const T=Math.hypot(b.x,b.z)||1,M=H(11,15,wt(0,.35,1-R/F)*wt(0,.3,R/F));let n=P.x+b.z/T*M,i=P.z-b.x/T*M;for(const p of o.anchors.dots){const y=n-p.x,e=i-p.z,r=Math.hypot(y,e)||1;r<8&&(n=p.x+y/r*8,i=p.z+e/r*8)}V.push([n,i])}const v=V[V.length-1],w=S(v[0]-6,v[1]+6);return V.push([k.X[w.i],k.Z[w.i]]),{way:V,cut:w,nearK:S}}function Xo(m,o,C,k,P,b){const V=new qt.Geo,S=x(b===2?"#120a07":"#0b0d12"),F=x(b===2?"#2e1409":"#1a2030"),D=x(Ot[3]).multiplyScalar(.9);V.blob(0,.78,-.82,.44,.42,.66,F,S,9,6),V.blob(0,.72,-.14,.15,.16,.16,S,S,6,3),V.blob(0,.8,.3,.3,.29,.5,F,S,8,5),V.blob(0,.88,1.02,.36,.31,.38,F,S,8,5);for(const W of[-1,1]){V.tube([[W*.16,.8,1.3],[W*.3,.74,1.52],[W*.1,.72,1.62]],[.07,.05,.02],4,S,S);const I=V.tube([[W*.17,1.02,1.2],[W*.48,1.36,1.5],[W*.56,1.14,1.98]],[.05,.045,.035],4,S,S);V.anim(I,(O,j,Z)=>[Bt((Z-1.2)/.78,0,1),W,0,1]);for(let O=0;O<3;O++){const j=.58-O*.3,Z=[.95,.05,-1.05][O],Y=[1.2,1.32,1.25][O],g=V.tube([[W*.2,.68,j],[W*.72,1,H(j,Z,.4)],[W*Y*.9,.36,H(j,Z,.85)],[W*Y,.02,Z]],[.075,.06,.045,.03],4,S,S),U=(O+(W>0?1:0))%2;V.anim(g,it=>[Bt((Math.abs(it)-.2)/(Y-.2),0,1),W,U,2])}}const B=V.blob(0,1.2,1.62,.42,.38,.44,D,D,7,4);V.move(B,(W,I)=>{W.x*=1+.25*Math.sin(I*2.1),W.y+=.06*Math.sin(I*3.7)}),V.anim(B,()=>[0,0,0,3]);const v=V.build();v.computeVertexNormals();const w=new z.InstancedBufferGeometry;w.index=v.index;for(const W of["position","normal","color","aAnim","aPivot"])w.setAttribute(W,v.getAttribute(W));const R=new z.InstancedBufferAttribute(new Float32Array(P*4),4),A=new z.InstancedBufferAttribute(new Float32Array(P*3),3);R.setUsage(z.DynamicDrawUsage),A.setUsage(z.DynamicDrawUsage),w.setAttribute("iPose",R),w.setAttribute("iState",A),w.instanceCount=P;const T=new z.Mesh(w,Kt(m,{gloss:.85,vpars:"attribute vec4 iPose; attribute vec3 iState;",vert:`
      float kind = A.w, ph = iPose.w;
      if (kind > 1.5 && kind < 2.5) { float lp = ph + A.z * 3.14159; p.z += sin(lp) * .34 * A.x; p.y += max(0., cos(lp)) * .24 * A.x * A.x; }
      else if (kind > .5 && kind < 1.5) { p.x += sin(uTime * 5. + ph * .3 + A.y * 1.3) * .2 * A.x; p.y += cos(uTime * 4.3 + ph * .2) * .14 * A.x; }
      else if (kind > 2.5) p = mix(vec3(0., .9, 1.3), p, iState.x);
      p.y += sin(ph * 2.) * .03; p *= iState.y;
      float hc = cos(iPose.z), hs = sin(iPose.z);
      p = vec3(p.x * hc + p.z * hs, p.y, -p.x * hs + p.z * hc) + vec3(iPose.x, iState.z, iPose.y);
      n = vec3(n.x * hc + n.z * hs, n.y, -n.x * hs + n.z * hc);`,frag:"if (vA.w > 2.5) { gloss = 0.; alb *= .8 + .3 * vnoise(vL.xy * 9.); } else { ao *= .55 + .45 * smoothstep(.2, .9, vL.y); float rimA = pow(1. - clamp(dot(V, n), 0., 1.), 3.); vec3 Ra = reflect(-V, n); emis += uSkyLow * (pow(max(dot(Ra, normalize(vec3(0., .6, .8))), 0.), 22.) * .9 + .22 * rimA * max(n.y + .3, 0.)) + uSunCol * sunAt(vW) * rimA * .55; }"}));T.frustumCulled=!1,T.name="kolam-ants";const M=new z.PlaneGeometry(1,1);M.rotateX(-Math.PI/2);const n=new z.InstancedBufferGeometry;n.index=M.index,n.setAttribute("position",M.getAttribute("position")),n.setAttribute("iPose",R),n.setAttribute("iState",A),n.instanceCount=P;const i=new z.Mesh(n,new z.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!0,uniforms:{...fe(),...m},vertexShader:`
      #include <fog_pars_vertex>
      ${Xt}
      attribute vec4 iPose; attribute vec3 iState; varying vec2 vQ; varying vec3 vW;
      void main(){
        vQ = position.xz + .5; vec2 sd = -normalize(uSunDir.xz + vec2(1e-4, 0.)), sp = vec2(-sd.y, sd.x);
        vec2 xz = iPose.xy + (sd * (vQ.x * 10. - .5) + sp * (vQ.y - .5) * (1.5 + .9 * vQ.x)) * step(.5, iState.y);
        vec4 wp = vec4(xz.x, .1, xz.y, 1.); vW = wp.xyz;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <fog_pars_fragment>
      ${Xt}
      varying vec2 vQ; varying vec3 vW;
      void main(){
        float across = abs(vQ.y - .5) * 2., a = smoothstep(0., .06, vQ.x) * (1. - smoothstep(.3, 1., vQ.x)) * (1. - smoothstep(.35, 1., across));
        gl_FragColor = vec4(uSkyTop * .12 + uHouse * .25, a * .8 * sunAt(vW));
        #include <fog_fragment>
      }`}));i.frustumCulled=!1,i.renderOrder=.4,i.name="kolam-ant-shadows";const p=C.curve,y=k.nearK,e=k.cut,r=p.X[e.i],L=p.Z[e.i],u=k.way,h=new z.CatmullRomCurve3(u.map(W=>new z.Vector3(W[0],0,W[1])),!1,"centripetal"),l=h.getLength(),a=Math.ceil(l/.75),t=new Float32Array((a+1)*3),s=new z.Vector3,d=new z.Vector3;for(let W=0;W<=a;W++){h.getPointAt(W/a,s),h.getTangentAt(W/a,d);const I=y(s.x,s.z).d,O=C.anchors.dots.reduce((j,Z)=>Math.min(j,Math.hypot(Z.x-s.x,Z.z-s.z)),1e9);t[W*3]=s.x,t[W*3+1]=s.z,t[W*3+2]=Math.max(1.55*(1-wt(.4,2.4,I)),2.2*(1-wt(.5,3,O)))}const c=[];for(let W=0;W<P;W++)c.push((W+.6*o())/P);const f={x:0,z:0,y:0,th:0},q=(W,I)=>{const O=Bt(W/l,0,1)*a,j=Math.min(a-1,Math.floor(O)),Z=O-j,Y=t[j*3],g=t[j*3+1],U=t[j*3+3],it=t[j*3+4],lt=U-Y,rt=it-g,Mt=Math.hypot(lt,rt)||1,et=1.5*I*wt(0,6,W)*wt(0,5,l-W);return f.x=H(Y,U,Z)-rt/Mt*et,f.z=H(g,it,Z)+lt/Mt*et,f.y=H(t[j*3+2],t[j*3+5],Z),f.th=Math.atan2(lt*-I,rt*-I),f};return{mesh:T,shadow:i,cutS:e.i*p.ds,cutAt:new z.Vector3(r,0,L),half:l,lane:t,update(W,I){const O=R.array,j=A.array,Z=wt(.7,.765,I)*2.2*l,Y=I<.695;for(let g=0;g<P;g++){const U=(c[g]*2*l+W*8.5)%(2*l),it=U>l,lt=it?2*l-U:U,rt=q(lt,it?1:-1);O[g*4]=rt.x,O[g*4+1]=rt.z,O[g*4+2]=rt.th,O[g*4+3]=U*2.6;const Mt=Y?0:wt(0,5,lt)*(U<Z?1:0);j[g*3]=it?wt(l,l-3,lt):0,j[g*3+1]=Mt,j[g*3+2]=rt.y}R.needsUpdate=!0,A.needsUpdate=!0,T.visible=!Y,i.visible=!Y}}}function io(m){const o=new qt.Geo,C=m===1,k=x(C?"#7d6a50":"#6b4a2e"),P=x(C?"#c2b59c":"#b5aa98"),b=x(C?"#7b6c58":"#6d6965"),V=x(C?"#84684a":"#7a3d22"),S=x(C?"#b5a88f":"#17120f"),F=x("#cdc4b2"),D=x(C?"#8a7558":"#2a2622"),B=x("#a07a62"),v=x("#2c2118"),w=x("#b89a6a");o.loft([{z:-10,y:10.5,rx:1.4,ry:1.4,top:k,belly:P},{z:-7,y:11.5,rx:4.2,ry:3.8,top:k,belly:P},{z:-3,y:12.8,rx:6.3,ry:5.8,top:k,belly:P},{z:1.5,y:14,rx:6.9,ry:6.6,top:k,belly:P},{z:5.5,y:15.6,rx:6.2,ry:6.2,top:k,belly:P},{z:8.5,y:17.6,rx:4.9,ry:5,top:V,belly:S},{z:10.2,y:19.3,rx:4.2,ry:4.3,top:V,belly:S},{z:11.8,y:20.6,rx:4.3,ry:4.2,top:b,belly:F},{z:13.6,y:21,rx:3.5,ry:3.3,top:b,belly:S},{z:15,y:20.8,rx:2,ry:1.9,top:b,belly:S},{z:15.9,y:20.6,rx:0,ry:0,top:b,belly:S}],{sides:16,shade:[-.35,.35]}),o.loft([{z:15.1,y:20.55,rx:1.35,ry:1.2,top:D},{z:16.6,y:20.35,rx:.85,ry:.75,top:D},{z:18.3,y:20.05,rx:0,ry:0,top:D}],{sides:8});for(const A of[-1,1])o.blob(A*2.95,21.35,13.5,.5,.6,.6,x("#050505"),x("#050505"),7,4);for(const[A,T]of[[1,0],[.6,.5]]){const M=[],n=[];for(let i=0;i<=4;i++){const p=i/4,y=-8.5-11*p,e=11-3.6*p+T,r=(2.2+3.6*p)*A;M.push([-r,e-.3*p,y]),n.push([r,e-.3*p,y])}o.strip(M,n,A===1?w.clone().lerp(v,.45):v,A===1?k:v)}for(const A of[-1,1]){const T=[A*5.3,16.6,4.2],M=ee(o,18,8,(i,p)=>{const y=H(10.5,8.2,i)*(1-.55*Math.pow(i,6)),e=-3.6*i*i;return[T[0]+A*i*19.5,T[1]+.9*Math.sin(p*Math.PI)*(1-i)-.4*i+.5*i*i*p,T[2]+2.2+e-p*y]},(i,p)=>p<.3?V.clone().lerp(k,i):p<.4?F.clone().lerp(w,i*.5):v.clone().lerp(w,.25*Math.abs(Math.sin(i*28))),1,A);o.pivot(M,T[0],T[1],T[2]);const n=i=>o.anim(i,()=>[0,0,3,A]);n(o.blob(A*2.7,9.6,.4,2.1,2.6,2.4,P,P,7,4)),n(o.tube([[A*2.7,9.4,.4],[A*2.85,5.6,-1.3],[A*3,.75,.7]],[.85,.7,.62],7,B,B));for(const[i,p]of[[-.5,5],[0,5.8],[.5,5],[Math.PI,3.6]]){const y=Math.sin(i)*A,e=Math.cos(i);n(o.tube([[A*3,.7,.7],[A*3+y*p*.5,.55,.7+e*p*.5],[A*3+y*p*.85,.42,.7+e*p*.85],[A*3+y*p,.05,.7+e*p]],[.55,.42,.3,.04],6,B,v))}}const R=o.build();return R.computeVertexNormals(),R}function Oo(m,o){const C=io(0),k=o===1?io(1):C,P=[];for(let S=0;S<3;S++){const F=o===1&&S>0,D=F?k:C,B=x(F?"#8a6c4c":"#8a4424"),v=x("#d6cebc"),w=x(F?"#4a3c2c":"#2a2018"),R={value:new z.Vector4(0,0,0,0)},A={value:0},T=Kt(m,{gloss:.08,uniforms:{uPose:R,uTuck:A,uWingA:{value:B},uWingB:{value:v},uWingC:{value:w}},vpars:"uniform vec4 uPose; uniform float uTuck;",fpars:"uniform vec3 uWingA, uWingB, uWingC;",vert:`
        if (A.z > .5 && A.z < 1.5) {
          vec3 q = p - aPivot; float fa = (1. - uPose.x) * 1.42 * A.w, fc = cos(fa), fs = sin(fa);
          q = vec3(q.x * fc + q.z * fs, q.y, -q.x * fs + q.z * fc); n = vec3(n.x * fc + n.z * fs, n.y, -n.x * fs + n.z * fc);
          q.x *= mix(.45, 1., uPose.x); q.y -= (1. - uPose.x) * abs(q.z) * .22;
          float wa = uPose.y * A.w * (.4 + .6 * A.x), wc = cos(wa), ws = sin(wa);
          q = vec3(q.x * wc - q.y * ws, q.x * ws + q.y * wc, q.z); n = vec3(n.x * wc - n.y * ws, n.x * ws + n.y * wc, n.z);
          p = aPivot + q;
        }
        if (A.z < 2.5) {
          vec3 q = p - vec3(0., 10., 0.); float pc = cos(uPose.z), ps = sin(uPose.z);
          q = vec3(q.x, q.y * pc - q.z * ps, q.z * pc + q.y * ps); n = vec3(n.x, n.y * pc - n.z * ps, n.z * pc + n.y * ps);
          p = vec3(0., 10. - uPose.w, 0.) + q;
        } else { p.y *= 1. - uPose.w * .09; p = mix(p, vec3(p.x * .8, 10.2 + p.y * .12, -2.5 + p.z * .5), uTuck); }`,frag:`
        float rimK = pow(1. - clamp(dot(V, n), 0., 1.), 2.);
        if (vA.z > 2.5) { alb *= .7 + .35 * step(.5, fract(vL.y * .9 + vL.z * .4)); ao *= .6 + .4 * smoothstep(0., 4., vL.y); }
        else if (vA.z > .5) {
          // the wing: chestnut lesser coverts, a white bar, black-centred greater coverts, then the flight feathers, each
          // with its shaft and pale edge; the primaries end in separate fingers with the sky between them
          float wu = vA.x, ww = vA.y, nf = 17., fu = wu * nf + .35 * ww * ww, fi = floor(fu), ff = fract(fu) - .5;
          float deep = mix(.1, .46, smoothstep(.5, .95, wu)), into = (ww - (1. - deep)) / deep;
          if (into > 0. && abs(ff) > .5 - mix(.05, .26, smoothstep(.55, 1., wu)) * into - .5 * smoothstep(.75, 1., into) * smoothstep(.2, .5, abs(ff))) discard;
          float fh = hash21(vec2(fi, 3.)), wob = (vnoise(vec2(wu * 9., ww * 3.)) - .5) * .06, wq = ww + wob;
          vec3 chest = uWingA * (.75 + .5 * vnoise(vec2(wu * 30., ww * 40.))), flight = uWingC * (.7 + .5 * fh);
          float cov = abs(fract(wu * 26. + floor(wq * 9.) * .5) - .5) * 2.;                                   // small covert scallops
          vec3 wc = mix(chest * (.7 + .4 * cov), uWingB, smoothstep(.2, .23, wq) * (1. - smoothstep(.27, .31, wq)));
          wc = mix(wc, mix(uWingC * .6, uWingA * 1.1, smoothstep(.25, .48, abs(fract(wu * 11. + .5) - .5) * 2.)), smoothstep(.3, .33, wq) * (1. - smoothstep(.46, .5, wq)));
          float edge = smoothstep(.3, .47, abs(ff)), shaft = 1. - smoothstep(0., .05, abs(ff));
          wc = mix(wc, flight * (1. - .3 * shaft) + uWingB * (.1 + .2 * fh) * edge * smoothstep(.55, 1., ww), smoothstep(.47, .52, wq));
          alb = wc;
          float under = step(n.y, -.05);                                                                       // seen from below: pale, the light comes through
          alb = mix(alb, mix(vec3(.42, .39, .34), alb, .35) * (.85 + .3 * edge), under * .85);
          emis += mix(uSkyLow, uSunCol, .25 * uSun) * (.1 + .32 * smoothstep(.45, 1., ww) * (1. - .6 * shaft)) * under * alb * 2.2;
          n = normalize(n + vec3(ff * .5, 0., 0.) * (1. - smoothstep(60., 260., dist)));
          ao *= .7 + .3 * smoothstep(.0, .25, ww);
        } else {
          // the body: soft masses, not scales. Dark streaks along the back, a paler breast with faint grey streaks,
          // fine barbs everywhere, and a downy rim that takes the sky.
          float cy = 11. + (vL.z + 10.) * .4, upn = clamp((vL.y - cy) / 5., -1., 1.);
          float st = vnoise(vec2(vL.x * 1.5 + vnoise(vL.xz * .3) * 2., vL.z * .34)), st2 = vnoise(vec2(vL.x * 2.4 + 9., (vL.z - vL.y * .6) * .5));
          float barb = vnoise(vec2(vL.x * 6., vL.z * 1.6 + vL.y * 1.2)) * .6 + vnoise(vec2(vL.x * 15., vL.z * 4. + vL.y * 3.)) * .4;
          float backK = smoothstep(.1, .6, upn) * step(vL.z, 9.) * step(-9., vL.z);
          alb *= mix(1., .32, smoothstep(.5, .72, st) * backK);                                                // black streaks on the mantle
          float brK = 1. - smoothstep(-.5, .15, upn);                                                          // the breast and belly: soft grey, layered in rows of rounded feathers
          float fy = vL.y * .62 + vL.z * .3, fx2 = vL.x * .55 + .5 * floor(fy), scal = length(vec2(fract(fx2) - .5, (fract(fy) - .15) * .9));
          alb *= mix(1., .9 + .16 * smoothstep(.2, .62, scal), brK) * mix(1., .93 + .1 * st2, brK);
          alb *= mix(.8 + .4 * barb, .95 + .1 * barb, brK);
          n = normalize(n + vec3(barb - .5, 0., st - .5) * .35 * (1. - .7 * brK) * (1. - smoothstep(60., 260., dist)));
          ao *= .62 + .38 * smoothstep(-1., .4, n.y);
          emis += alb * uSkyLow * .35 * rimK;
        }
        emis += alb * uSkyLow * .4 * max(-n.y, 0.);`}),M=new z.Mesh(D,T);M.frustumCulled=!1,M.visible=!1,M.name="kolam-sparrow-"+S,P.push({mesh:M,pose:R.value,tuck:A})}const b=new z.CircleGeometry(1,24);b.rotateX(-Math.PI/2);const V=new z.InstancedMesh(b,new z.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!0,uniforms:{...fe(),uHouse:m.uHouse},vertexShader:`#include <fog_pars_vertex>
varying vec2 vC; void main(){ vC = position.xz; vec4 mvPosition = viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,fragmentShader:`#include <fog_pars_fragment>
uniform vec3 uHouse; varying vec2 vC; void main(){ float r = length(vC); float a = (1. - smoothstep(.15, 1., r)) * .62; gl_FragColor = vec4(uHouse * .5, a);
#include <fog_fragment>
}`}),3);return V.frustumCulled=!1,V.renderOrder=.5,V.name="kolam-sparrow-shade",{birds:P,shade:V}}function Ho(m){const o=new qt.Geo,C=x("#c98a1e"),k=x("#16110c"),P=x("#8a6a2a"),b=x("#b9c4d6"),V=o.blob(0,0,-.75,.52,.5,.95,C,C,10,7);o.paint(V,(B,v,w,R)=>{Math.sin(w*9.5)>.1&&R.copy(k)}),o.blob(0,.08,.42,.5,.48,.52,P,P,9,5),o.blob(0,.02,1.08,.36,.34,.3,k,k,8,4);for(const B of[-1,1]){o.blob(B*.25,.08,1.2,.16,.2,.16,x("#050505"),x("#050505"),6,3),o.tube([[B*.12,.25,1.25],[B*.3,.55,1.5],[B*.36,.4,1.85]],[.035,.03,.02],4,k,k);for(let w=0;w<3;w++){const R=.7-w*.3;o.tube([[B*.3,-.25,R],[B*.62,-.6,R-.1],[B*.5,-1.15,R-.35]],[.06,.05,.03],4,k,k)}const v=ee(o,5,2,(w,R)=>[B*(.22+w*1.9),.5+.1*w,.55-.25*w-R*(.75-.3*w*w)],()=>b,1,B);o.pivot(v,B*.22,.5,.4)}const S=Kt(m,{gloss:.35,vert:"if (A.z > .5) { vec3 q = p - aPivot; float wa = (.25 + .9 * sin(uTime * 95.)) * A.w, wc = cos(wa), ws = sin(wa); q = vec3(q.x * wc - q.y * ws, q.x * ws + q.y * wc, q.z); p = aPivot + q; }",frag:"if (vA.z > .5) { alb *= .8 + .4 * step(.5, fract(vA.x * 4. + vA.y * 2.)); emis += uSkyLow * .25; } else { alb *= .75 + .5 * vnoise(vL.xz * 14.); }"}),F=o.build();F.computeVertexNormals();const D=[];for(let B=0;B<2;B++){const v=new z.Mesh(F,S);v.frustumCulled=!1,v.visible=!1,v.name="kolam-bee-"+B,D.push(v)}return D}const jo=[{name:"loop",zen:"#182246",mid:"#3d5582",hor:"#8191b4",band:"#E7B48B",rose:"#d48a92",skyLow:"#A9B9D6",skyTop:"#4a5a8a",house:"#0b111c",sunCol:"#f09a58",fog:.002,tint:"#f6f4fa",shadow:"#0b0f1a",sat:1.04,exposure:1},{name:"festival",zen:"#2c3a80",mid:"#7480ba",hor:"#bfb1c6",band:"#f4c29c",rose:"#ea8aa6",skyLow:"#c6bfd6",skyTop:"#6a78bc",house:"#141220",sunCol:"#f2a060",fog:.0017,tint:"#fff4f4",shadow:"#1a1030",sat:1.12,exposure:.94},{name:"yard",zen:"#213e60",mid:"#6f8fa8",hor:"#9db0c2",band:"#f8b76a",rose:"#e08460",skyLow:"#c0cbd4",skyTop:"#4a6f94",house:"#1a1f27",sunCol:"#f39a4c",fog:95e-5,tint:"#fff8ee",shadow:"#0e1420",sat:1.12,exposure:1.1}];var Go={id:"kolam-at-dawn",name:"Kolam at Dawn",category:"domestic",weirdness:.1,media:["tiny","air"],async build(m){const o=m.rng,C=m.noise,k=m.vary||{},P=m.quality&&m.quality.detail||1,b=k.density??1,V=k.mood??.5,S=k.hour||"any",F=Number.isFinite(+m.seed)?Math.abs(Math.floor(+m.seed)):Math.floor(o.fork("look")()*1e6);let D=S==="day"?1:S==="golden"?2:S==="dawn"||S==="night"?0:F%5%3;const B=!!k.rare;B&&D===2&&(D=0);const v=jo[D],w=new z.Scene,R=D===1?.5:1,A=x(v.hor),T=be(v.hor,v.band,.22),M=x(v.zen).multiplyScalar((.8+.2*V)*R),n=be(v.zen,v.mid,.4),i=x(v.mid).multiplyScalar(.86*R),p=be(v.mid,v.hor,.25),y=x(v.hor).multiplyScalar(R),e=y.clone(),r=x(v.band),L=D===2?be(v.band,"#e59c8e",.6).multiplyScalar(.9):r.clone();w.fog=new z.FogExp2(e,v.fog*(.92+.16*V));const u=await ho(m,{look:D,rare:B,palette:Ot,groundSize:5400});w.add(u.object);const h=u.uniforms;h.uSkyLow.value.set(v.skyLow),h.uSkyTop.value.set(v.skyTop),h.uHouse.value.set(v.house),h.uSunCol.value.set(v.sunCol),h.uRose.value.set(v.rose),h.uStep.value.set(te,ot-.6,20,1),h.uLime.value.set(D===2?"#bdb9a8":"#b6bac2"),h.uOchre.value.set(D===2?"#7b5140":"#743f36");const l=x(v.skyLow).multiplyScalar(.9),a=x(v.skyLow).multiplyScalar(1.06),t={...h,uZen:{value:M.clone()},uMid:{value:i.clone()},uHor:{value:e},uBand:{value:x(v.band)},uRose:{value:x(v.rose)},uWarm:{value:0},uBandK:{value:0},uSunUp:{value:0},uSunDisc:{value:x("#ff9a4a")},uStars:{value:1},uLampK:{value:1},uHz:{value:new z.Vector2(100,480)},uCliff:{value:D===2?new z.Color(.052,.058,.075):D===1?new z.Color(.058,.052,.108):new z.Color(.054,.063,.113)}};await m.yield();const s=await zo(u,D,m),d=s.path;await m.yield();const c=Ao(t);w.add(c),await m.yield();const f=Lo(t,C,D);w.add(f),await m.yield();for(const _ of Bo(t))w.add(_);await m.yield();for(const _ of Co(t,C))w.add(_);await m.yield();const q=[];w.add(Wo(t,C,o.fork("things"),s.entryX,q)),await m.yield();const W=To(t);w.add(W),await m.yield();const I=await Vo(t,o.fork("hibiscus"),q,m);w.add(I.mesh),await m.yield();const O=No(s,u);Io(o.fork("beads"),u,d,q,P,b,O.way),await m.yield();const j=Fo(t,q,D===2?be("#4a4026",Ot[1],.3).multiplyScalar(.75):be(Ot[0],Ot[1],.25).multiplyScalar(.5));w.add(j),await m.yield();const Z=Ko(t,o.fork("moss"),C,d,P,D,u);w.add(Z.cushions,Z.stalks,Z.pebbles),await m.yield();const Y=Xo(t,o.fork("ants"),u,O,Math.round(Bt(60*b,48,72)),D);w.add(Y.mesh,Y.shadow),await m.yield();const g=Oo(t,D===1?1:0);for(const _ of g.birds)w.add(_.mesh);w.add(g.shade),await m.yield();const U=Ho(t);for(const _ of U)w.add(_);await m.yield();const it=await Ro(t,m.core.makeRng(m.core.hashSeed("kolam-street:"+F)),C,D,m);w.add(it.mesh),await m.yield();const lt=Do(t,o.fork("lamps"),it.flames);w.add(lt.bodies,lt.fire);const rt=[];for(let _=0;_<10;_++){const N=lt.flames[_];h.uLamps.value[_].set(N[0],N[1]+3,N[2],1),rt.push(1)}h.uLamps.value[10].set($e[0],ot+33,$e[1],2.8),rt.push(2.8),await m.yield(),w.add(qo(t,o.fork("festoon"))),await m.yield(),w.add(_o(t,o.fork("dotflowers"),u,D)),await m.yield();const Mt={value:0},et=Ee.makeParticles({rng:o.fork("motes"),preset:"dust",count:Math.round(3800*P),box:[170,80,170],size:[.12,.36],colors:["#e9eef8","#cfd9ee","#ffffff"],intensity:.7,opacity:.55,additive:.3,velocity:[1.5,-1.7,.7],velocityRandom:[1.2,.9,1.2],turbulence:[2.2,1,.25],twinkle:.4,near:[3,10],time:Mt});w.add(et.object),await m.yield();const gt=Ee.makeParticles({rng:o.fork("sparks"),preset:"dust",follow:!1,center:[0,46,-236],box:[130,46,76],count:Math.round(520*P),size:[.16,.42],colors:[Ot[5],Ot[4],"#fff0d0"],intensity:1.5,opacity:.8,additive:.8,velocity:[-.9,-.5,.2],velocityRandom:[.8,.5,.8],turbulence:[1.6,.8,.3],twinkle:.35,near:[3,9],time:Mt});gt.setOpacity(0),w.add(gt.object),await m.yield();const xt=Ee.makeMist({rng:o.fork("mist"),count:46,area:[1100,10,320],center:[0,7,430],size:[50,110],color:"#"+be(v.hor,"#ffffff",.25).getHexString(),opacity:.24,drift:[6,0,1.4],time:Mt});w.add(xt.object),await m.yield();const Lt=u.curve,It=new z.Vector3,Qt=(_,N)=>{let $=0,X=1e9;for(let G=0;G<Lt.count;G+=2){if(Lt.W[G]<.5)continue;const st=(Lt.X[G]-_)**2+(Lt.Z[G]-N)**2;st<X&&(X=st,$=G)}return $},jt=[[-20,-104,-.1,-1,-12,-90],[95,30,-.6,.8],[-85,35,.3,-.95]],Et=[];for(let _=0;_<=80;_++)Et.push(d.pointAt(H(s.uOfB(.76),1,_/80)));const pe=g.birds.map((_,N)=>{const $=[],X=jt[N];for(let J=0;J<3;J++){const tt=X[0]+X[2]*30*J,yt=X[1]+X[3]*30*J,Nt=J===0&&X.length>4?Qt(X[4],X[5]):Qt(tt,yt),kt=Lt.X[Nt],mt=Lt.Z[Nt];let vt=tt-kt,dt=yt-mt,bt=Math.hypot(vt,dt);bt<1&&(vt=X[2],dt=X[3],bt=1);let Ct=kt+vt/bt*19,Wt=mt+dt/bt*19;for(let De=0;De<3;De++){let ce=1e9,Ae=Et[0];for(const ie of Et){const he=Math.hypot(Ct-ie.x,13-ie.y,Wt-ie.z);he<ce&&(ce=he,Ae=ie)}if(ce>=30)break;const Ne=Ct-Ae.x,qe=Wt-Ae.z,Ft=Math.hypot(Ne,qe)||1;Ct+=Ne/Ft*(32-ce),Wt+=qe/Ft*(32-ce)}const Pe=Math.hypot(kt-Ct,mt-Wt);$.push({x:Ct,z:Wt,yaw:Pe<40?Math.atan2(kt-Ct,mt-Wt):Math.atan2(-Ct*.3,60-Wt),s:Nt*Lt.ds,reach:Pe>15&&Pe<22})}N===0&&[[-8,-140],[16,-186]].forEach((J,tt)=>{$[tt+1]={x:J[0],z:J[1],yaw:Math.atan2(44-J[0],-124-J[1]),s:$[0].s,reach:!1}});const G=N===0?.728:.772+.01*N,st=G+.028;return{stands:$,tL:G,t0:st,hops:N===0?[.768,.8]:[st+.05,st+.1]}}),Tt=[{x:-98,y:38,z:-122,r:50,w:.3,ph:.4},{x:40,y:52,z:480,r:50,w:.42,ph:1.2},{x:-70,y:64,z:500,r:60,w:-.36,ph:4}],_t=new z.Vector3(Ht[0]+Math.sin(Le)*9.1*Se,27.9*Se,Ht[2]-Math.cos(Le)*9.1*Se),Pt=Math.atan2(-Math.sin(Le),Math.cos(Le)),$t=s.uLap-s.uJoin+.03,me=new z.Vector3,At=new z.Vector3,oe=[1.068,.601],Te=(_,N,$)=>{const X=Tt[_],G=X.ph+N*X.w;return $.set(X.x+Math.cos(G)*X.r,X.y+7*Math.sin(N*.45+_),X.z+Math.sin(G)*X.r),Math.atan2(-Math.sin(G)*X.w,Math.cos(G)*X.w)},ae=_=>{for(;_>Math.PI;)_-=at;for(;_<-Math.PI;)_+=at;return _},le=new z.Matrix4,ue=_=>It.set(I.tops[_][0],I.tops[_][1]+1.2,I.tops[_][2]),E=wt,Yt=new z.Vector3,se=new z.Vector3,Me=(_,N,$,X)=>{const G=g.birds[_],st=pe[_],J=G.mesh,tt=G.pose;let yt=0,Nt=0,kt=0;if($<st.tL){const mt=Tt[_],vt=st.stands[0],dt=E(st.tL-.05,st.tL,$);let bt=Te(_,N,At),Ct=-.3*Math.sign(mt.w),Wt=.42*Math.sin(N*5.2+_*2)*(.5+.5*Math.sin(N*.6+_))+.18,Pe=1,De=1,ce=.06,Ae=0;if(_===0){const Ne=E(-.115,-.045,X),qe=E($t,$t+.06,X),Ft=Ne*(1-qe);if(Ft>0){const ie=qe>0,he=E(.9,1,Ft),Xe=E(0,.8,Ft),Qe=N*.38,Ue=Math.pow(Math.max(0,Math.sin(Qe*at)),3),lo=E(.35,.6,Math.sin(Qe*at+2.4)),Ye=Math.atan2(At.x-_t.x,At.z-_t.z),je=ie?Ye:Ye+Math.PI,Je=ie?0:55*(1-Ft)*Xe;At.set(H(At.x,_t.x-Math.sin(Pt)*Je,Xe),H(At.y,_t.y,Xe)+Math.sin(Math.PI*Ft)*(ie?20:30),H(At.z,_t.z-Math.cos(Pt)*Je,Xe));const to=ie?Pt+ae(je-Pt)*(1-E(.7,1,Ft)):je+ae(Pt-je)*E(.45,.95,Ft);bt=to+ae(bt-to)*(1-E(0,.25,Ft))+he*.08*Math.sin(N*.7),Ct*=1-Ft,De=1-he,Pe=1-E(.6,.92,Ft),Wt=H(Wt,(.7*Math.sin(N*14)+.25)*(1-he),E(.2,.6,Ft)),ce=H(.06,.62*Ue-.1*lo+.03*Math.sin(N*2.2),he),Ae=he*(1.3+.9*Ue)}J.visible=!0}else J.visible=!0;G.tuck.value=Pe,J.position.set(H(At.x,vt.x-Math.sin(vt.yaw)*120,dt),H(At.y,92,dt),H(At.z,vt.z-Math.cos(vt.yaw)*120,dt)),J.rotation.set(0,bt+ae(vt.yaw-bt)*dt,Ct*(1-dt)),tt.set(De,Wt,ce,Ae)}else if($<st.t0){const mt=($-st.tL)/(st.t0-st.tL),vt=1-(1-mt)*(1-mt),dt=st.stands[0],bt=120*(1-vt);J.visible=!0,G.tuck.value=1-E(.35,.8,mt),J.position.set(dt.x-Math.sin(dt.yaw)*bt,92*(1-vt)*(1-vt)+3*Math.sin(Math.PI*mt),dt.z-Math.cos(dt.yaw)*bt),J.rotation.set(0,dt.yaw,0),tt.set(1-E(.86,1,mt),(.75*Math.sin(N*15)+.2)*(1-E(.8,1,mt)),-.5*(1-E(.6,1,mt)),1.2*E(.85,1,mt)*(1-mt)),yt=E(.5,1,mt),Nt=dt.x,kt=dt.z}else{const mt=$>=st.hops[1]?2:$>=st.hops[0]?1:0,vt=st.stands[mt],dt=mt===0?1:($-st.hops[mt-1])/.009;if(J.visible=!0,G.tuck.value=0,dt<1){const bt=st.stands[mt-1],Ct=E(0,1,dt);let Wt=vt.yaw-bt.yaw;for(;Wt>Math.PI;)Wt-=at;for(;Wt<-Math.PI;)Wt+=at;J.position.set(H(bt.x,vt.x,Ct),9*Math.sin(Math.PI*dt),H(bt.z,vt.z,Ct)),J.rotation.set(0,bt.yaw+Wt*Ct,0),tt.set(.55*Math.sin(Math.PI*dt),.5*Math.sin(N*15),-.15*Math.sin(Math.PI*dt),0),yt=1-.5*Math.sin(Math.PI*dt),Nt=J.position.x,kt=J.position.z}else{const bt=(N/1.3+_*.37)%1,Ct=bt<.42?Math.pow(Math.sin(Math.PI*bt/.42),1.4):0;J.position.set(vt.x,0,vt.z),J.rotation.set(0,vt.yaw+(bt>.5?.12*Math.sin((bt-.5)*at*2):0),0),tt.set(0,0,(vt.reach?.92:.8)*Ct+.03*Math.sin(N*2.2+_),1.1*Ct+.25*Math.sin(N*1.7+_*2)),yt=1,Nt=vt.x,kt=vt.z}}for(let mt=0;mt<3;mt++){const vt=mt===0?st.t0:st.hops[mt-1]+.009;u.setBite(_*3+mt,st.stands[mt].s,st.stands[mt].reach?6*E(vt+.004,vt+.034,$):0)}le.makeScale(16*yt+.001,1,16*yt+.001).setPosition(Nt,.12,kt),g.shade.setMatrixAt(_,le)},Rt=_=>.94+.2*E(.03,.07,_)-.36*E(s.uJoin-.05,s.uJoin,_)+.16*E(s.uLap-.02,s.uLap+.03,_)-.16*E(s.uX-.01,s.uX+.04,_)+.18*E(s.uDesc-.02,s.uDesc+.03,_)-.04*E(.9,.94,_),ve=new z.Vector3,de=new z.Vector3(0,30,-40),ge=new z.Vector3(-20,20,-100),xe=new z.Vector3(0,50,-246),ne=new z.Vector3,pt=new z.Vector3,Ve=new z.Vector3;let Ke=-1;const Gt=u.anchors.gap?u.anchors.gap.at:null,He=Gt?H(4,Gt.x,.4):4,K=Gt?H(-16,Gt.z,.4):-16,nt=_=>{if(_!==Ke){Ke=_,d.posAtDist(_*d.length,pt),u.pointAt(Math.min(s.landOf(_),u.L),Ve);{const N=E(24,40,pt.y),$=.7*N;let X=Ve.x*(1-$),G=Ve.z*(1-$)-12*$;const st=X-pt.x,J=G-pt.z,tt=Math.hypot(st,J)||1,yt=Math.max(2.4*pt.y*N,.82*pt.y);tt<yt&&(X=pt.x+st/tt*yt,G=pt.z+J/tt*yt),se.set(X,3,G)}{const N=Math.atan2(Ht[0]-pt.x,pt.z-Ht[2]),$=Math.atan2(-pt.x,pt.z-ft),X=ae($-N),G=Bt(Math.max(Math.atan(.6*oe[0]),X-Math.atan(.78*oe[0])),0,Math.atan(.86*oe[0])),st=N+G,J=Math.hypot(Ht[0]-pt.x,Ht[2]-pt.z),tt=Bt(Math.atan2(27-pt.y,J),-.2,.06);ge.set(pt.x+Math.sin(st)*260,pt.y+Math.tan(tt)*260,pt.z-Math.cos(st)*260)}{d.tangentAt(_,ne);const N=Math.hypot(ne.x,ne.z)||1,$=1-E(s.uDesc-.05,s.uDesc+.02,_),X=E(s.uDesc-.1,s.uDesc-.035,_);let G=pt.x+ne.x/N*110,st=pt.z+ne.z/N*110;if(Gt){const J=.4*(1-E(s.uDesc-.04,s.uDesc-.005,_));G=H(G,Gt.x,J),st=H(st,Gt.z,J)}de.set(H(He,G,X),H(0,pt.y-H(22,46,$),X),H(K,st,X))}{const N=Math.hypot(pt.x,pt.z+246),$=H(.19,.07,E(s.uLow-.005,s.uLow+.035,_));xe.set(0,H(pt.y-$*N,50,E(s.uStep-.04,s.uStep-.012,_)),-246)}}},ct=new z.Vector3,Q=new z.Vector3,ht=new z.Matrix4;{nt(.2);const _=se.x-pt.x,N=se.z-pt.z,$=Math.hypot(_,N)||1,X=Math.atan2(3-pt.y,$);let G=230;N<0&&(G=Math.min(G,Math.max(120,(pt.z+236)*$/-N))),ct.set(pt.x+_/$*G,Math.max(52,pt.y+G*Math.tan(X+.23)),pt.z+N/$*G),u.setGlintAt(ct.x,ct.y,ct.z)}const ut=re([[Ut-.01,560],[Ut+.005,300],[Ut+.015,180],[Ut+.025,112],[Ut+.04,78],[.66,46],[.685,14],[.7,-6],[.76,-46],[.82,-90],[.87,-150],[.92,-380]]),zt=[...[.9,.5,.5].map(_=>({at:(N,$)=>(nt($),se),from:.025,to:s.uJoin-.025,weight:_,fade:.12})),...[.9,.9,.9,.9].map(_=>({at:(N,$)=>(nt($),ge),from:s.uJoin-.085,to:s.uLap+.075,weight:_,fade:.14})),...[.8,.6,.6,.45].map(_=>({at:(N,$)=>(nt($),de),from:s.uLap+.015,to:s.uDesc+.02,weight:_,fade:.1}))],Vt=7,St=Array.from({length:Vt+2},()=>new z.Vector3(0,20,-100)),Zt=[.025,s.uApex+.03,.06],ze=new z.Vector3,Ie=new z.Vector3,Jt=new z.Vector3,ke=new z.Vector3,ye=new z.Vector3,Be=new z.Vector3,ro=_=>{const N=d.length,$=_*N,X=E(0,.04,_)*(1-E(.93,.985,_));d.posAtDist($,ze),d.posAtDist($+26,Ie),ke.subVectors(Ie,ze).normalize(),d.posAtDist($+Math.min(26*3.4,Math.max(26,N*.22)),Ie),Jt.subVectors(Ie,ze).normalize(),Jt.y*=.55,Jt.normalize();for(const J of zt){const tt=eo(_,J.from,J.to,J.fade)*J.weight*X;tt<=.001||(ye.copy(J.at(0,_)).sub(ze).normalize(),ke.multiplyScalar(1-tt).addScaledVector(ye,tt).normalize(),Jt.multiplyScalar(1-tt*.35).addScaledVector(ye,tt*.35).normalize())}const G=eo(_,Zt[0],Zt[1],Zt[2])*.9*X*.35,st=Math.acos(-G/(1-G));for(let J=0;J<Vt;J++){const tt=Bt(Jt.dot(ke),-1,1),yt=Math.acos(tt);if(yt<.004||G<=.001)ye.copy(ke);else{const Nt=(1-G)/G*Math.sin(yt),kt=Nt>=1||yt>1.5?st:yt+Math.asin(Nt);Be.copy(ke).addScaledVector(Jt,-tt),Be.lengthSq()<1e-5&&Be.set(-Jt.z,0,Jt.x),Be.normalize(),ye.copy(Jt).multiplyScalar(Math.cos(kt)).addScaledVector(Be,Math.sin(kt))}St[J].copy(ze).addScaledVector(ye,300),Jt.multiplyScalar(1-G).addScaledVector(ye,G).normalize()}St[Vt].copy(ze).addScaledVector(ke,300),St[Vt+1].copy(St[Vt])};return{scene:w,path:d,duration:Math.round(Bt(s.length/27.6,42,52)),pace:Rt,camera:{fov:62,near:.5,far:3400,lookAhead:26,sway:.5,bank:.22,nearThrough:.5},pois:[...zt,...St.map((_,N)=>({at:($,X)=>(N===0&&ro(X),_),from:Zt[0],to:Zt[1],weight:.9,fade:Zt[2]})),{at:(_,N)=>(nt(N),xe),from:s.uDesc-.05,to:s.uDesc+.03,weight:.8,fade:.48},{at:(_,N)=>(nt(N),xe),from:s.uDesc+.004,to:.95,weight:.88,fade:.12}],portal:{shape:"circle",radius:7,color:"#ffe2b8",glow:.5,revealDistance:640},post:{exposure:v.exposure,bloom:{strength:.3,radius:.6,threshold:1},grade:{saturation:v.sat,contrast:1.05,tint:v.tint,shadowTint:v.shadow,vignette:.34,grain:.02,aberration:0}},ride:"none",style:"none",debug:{route:s,hero:u,info:{look:D,rare:B,uE:+s.uE.toFixed(3),uJoin:+s.uJoin.toFixed(3),uLap:+s.uLap.toFixed(3),uX:+s.uX.toFixed(3),len:Math.round(s.length),uApex:+s.uApex.toFixed(3),uDesc:+s.uDesc.toFixed(3),uStep:+s.uStep.toFixed(3),L:Math.round(u.L),frac:u.frac},b:s.bOf,landmarks:()=>({knot:{p:[0,2,0],size:200},pot:{p:[Ht[0],14*Se,Ht[2]],size:28*Se},heart:{p:[4,2,-16],size:20},broom:{p:[we[0]-135,0,we[1]],size:46},door:{p:[0,34,ft],size:14},bird0:{p:[g.birds[0].mesh.position.x,g.birds[0].mesh.position.y+15,g.birds[0].mesh.position.z],size:24},bird1:{p:g.birds[1].mesh.position.toArray(),size:24},bird2:{p:g.birds[2].mesh.position.toArray(),size:24},land:{p:[Yt.x,2,Yt.z],size:8},hib4:{p:[Ce[3][0],ot+4,Ce[3][1]],size:30},...u.anchors.gap?{gap:{p:[u.anchors.gap.at.x,0,u.anchors.gap.at.z],size:50}}:{}}),gust:()=>h.uGust.value},update(_,N,$,X){const G=s.bOf(X);Mt.value=N,u.setProgress(G),u.setLand(s.landOf(X)),u.update(_,N,$),h.uVeilK.value=1+.9*(1-E(.005,.05,X))+.2*E(.06,.1,X)*(1-E(.28,.36,X)),u.setSun(E(Ut-.008,Ut+.012,X),ut(X)),h.uGold.value=E(Ut+.012,Ut+.085,X)*(1-.75*E(.9,.99,X)),u.landing(Yt),Q.copy(ct).applyMatrix4(ht.copy($.matrixWorld).invert()).applyMatrix4($.projectionMatrix),u.setGlint(E(.186,.196,X)*(1-E(.208,.226,X))*(1-E(.8,.97,Math.abs(Q.x)))*(1-E(.8,.97,Math.abs(Q.y)))*(Q.z<1?1:0));const st=E(.08,.62,X),J=E(.2,.56,X);t.uZen.value.copy(M).lerp(n,st),t.uMid.value.copy(i).lerp(p,st),e.copy(y).lerp(A,E(.06,.42,X)).lerp(T,J*.8),t.uSunUp.value=E(Ut-.012,Ut+.13,X),t.uWarm.value=D===2?.3+.45*J+.25*t.uSunUp.value:J,t.uStars.value=1-E(.2,.5,X),t.uBand.value.copy(L).lerp(r,t.uSunUp.value),t.uBandK.value=J,h.uSkyLow.value.copy(l).lerp(a,st),ve.setFromMatrixPosition($.matrixWorld),c.position.copy(ve);{const tt=$.projectionMatrix.elements;oe[0]=1/tt[0],oe[1]=1/tt[5]}for(let tt=0;tt<11;tt++)h.uLamps.value[tt].w=rt[tt]*(.84+.11*Math.sin(N*9.1+tt*2.3)+.07*Math.sin(N*23.3+tt*5.1));j.material.uniforms.uDry.value=.7*E(.05,1,G),j.material.uniforms.uLandP.value.set(Yt.x,Yt.z),Y.update(N,G),u.setBite(11,Y.cutS,3.4*E(.79,.97,G));for(let tt=0;tt<3;tt++)Me(tt,N,G,X-s.uJoin);g.shade.instanceMatrix.needsUpdate=!0;for(let tt=0;tt<2;tt++){const yt=U[tt],Nt=tt===0||D===1;if(yt.visible=Nt&&G>.84,!yt.visible)continue;const kt=ue(tt===0?3:1),mt=tt===0?-1:1,vt=E(.845,.9+.01*tt,G),dt=N+tt*3.1,bt=kt.x+mt*2.6+Math.sin(dt*1.3)*1.5,Ct=kt.y+1.2+Math.sin(dt*2.1)*.7,Wt=kt.z+1.2+Math.cos(dt*.9)*1.6;yt.position.set(H(kt.x-mt*70,bt,vt),H(kt.y+40,Ct,vt),H(kt.z+50,Wt,vt)),yt.rotation.set(.25,Math.atan2(kt.x-yt.position.x,kt.z-yt.position.z),Math.sin(dt*3)*.2)}et.setOpacity(.55*(1-.6*E(.86,.95,G))),et.update(_,N,$),gt.setOpacity(E(.7,.82,X)),gt.update(_,N,$),xt.update(_,N,$)},dispose(){u.dispose()}}}};export{Go as default};
