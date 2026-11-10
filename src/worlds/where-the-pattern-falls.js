import*as o from"three";import{makePath as Ht}from"../kit/core.js";import{buildHero as qt}from"../parts/where-the-pattern-falls.js";const J=Math.PI*2,Et=`
  attribute vec4 aRoll; attribute vec4 aRk; attribute float aS;
  uniform vec3 uCamL; uniform float uViewH, uTanHalf, uHull, uTime;
  varying float vS; varying float vPx;
  void main(){
    vec3 P = position, N = normal;
    if (aRoll.w > .01) {
      float ang = 1.9 * sin(uTime * aRk.w + aRk.z) + .25 * sin(uTime * aRk.w * 2.3 + aRk.z * 1.7);
      float c = cos(ang), s = sin(ang);
      vec3 d = vec3(aRk.x, 0., aRk.y);
      // local x runs along the roll direction, local y is up; turning by ang carries the centre -R * ang along it
      vec2 q = vec2(c * P.x + s * P.y, -s * P.x + c * P.y), n2 = vec2(c * N.x + s * N.y, -s * N.x + c * N.y);
      vec3 side = vec3(-d.z, 0., d.x);
      P = aRoll.xyz + d * (q.x + aRoll.w * ang) + vec3(0., q.y, 0.) + side * P.z;
      N = d * n2.x + vec3(0., n2.y, 0.) + side * N.z;
    }
    float dP = max(length(P - uCamL), .5);
    float pxM = dP * 2. * uTanHalf / max(uViewH, 1.);
    P += normalize(N + vec3(0., 1e-5, 0.)) * max(.09, 1.6 * pxM) * uHull;
    vS = aS; vPx = pxM;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(P, 1.);
  }`,Qt=`
  precision highp float;
  uniform vec3 uInk[14]; uniform float uHull; uniform vec3 uWireA, uWireB, uWireC;
  varying float vS; varying float vPx;
  void main(){
    if (uHull > .5) { gl_FragColor = vec4(uInk[9], 1.); return; }
    // tooling along the wire: long gold runs, a pale collar and a dark tick, all flat; plain gold once it is too small to read
    float s = fract(vS * .5), k = smoothstep(.02, .06, .5 / max(vPx, 1e-4) * .01);
    vec3 col = uWireA;
    col = mix(col, uWireB, step(.62, s) * step(s, .9) * k);
    col = mix(col, uWireC, step(.92, s) * k);
    gl_FragColor = vec4(col, 1.);
  }`;function Ve(b,K,ne,_,me,A=6){const Me=K.length,he=b.pos.length/3,D=new o.Vector3,$=new o.Vector3,pe=new o.Vector3,j=new o.Vector3,ge=new o.Quaternion,xe=new o.Vector3;let Ne=0;for(let q=0;q<Me;q++){const C=K[Math.max(0,q-1)],L=K[Math.min(Me-1,q+1)];D.subVectors(L,C),D.lengthSq()<1e-10&&D.set(0,1,0),D.normalize(),q===0?($.set(0,0,1),Math.abs(D.z)>.9&&$.set(1,0,0),$.addScaledVector(D,-$.dot(D)).normalize()):(ge.setFromUnitVectors(j,D),$.applyQuaternion(ge),$.addScaledVector(D,-$.dot(D)).normalize(),Ne+=K[q].distanceTo(K[q-1])),pe.crossVectors(D,$),j.copy(D);const I=ne(q/(Me-1));for(let n=0;n<=A;n++){const Re=n/A*J,Se=Math.cos(Re),re=Math.sin(Re);xe.copy($).multiplyScalar(Se).addScaledVector(pe,re),b.pos.push(K[q].x+xe.x*I,K[q].y+xe.y*I,K[q].z+xe.z*I),b.nor.push(xe.x,xe.y,xe.z),b.s.push(Ne),b.roll.push(_[0],_[1],_[2],_[3]),b.rk.push(me[0],me[1],me[2],me[3])}}for(let q=0;q<Me-1;q++)for(let C=0;C<A;C++){const L=he+q*(A+1)+C,I=L+1,n=L+A+1,Re=n+1;b.idx.push(L,I,n,I,Re,n)}}function Le(b,K,ne,_,me,A,Me=1,he=44){const D=[];for(let $=0;$<=he;$++){const pe=$/he,j=A+Me*pe*me*J,ge=_*Math.pow(1-pe,.85)*.94+_*.06;D.push(new o.Vector3().copy(b).addScaledVector(K,Math.cos(j)*ge).addScaledVector(ne,Math.sin(j)*ge))}return D}const Ze=(b,K,ne)=>Math.min(1,Math.max(0,(ne-b)/(K-b))),Q=(b,K,ne)=>{const _=Math.min(1,Math.max(0,(ne-b)/(K-b)));return _*_*(3-2*_)};var Ut={id:"where-the-pattern-falls",name:"Where the Pattern Falls",category:"bizarre",after:"Gustav Klimt, 1862 to 1918",media:["air","open"],weirdness:.8,async build(b){const K=new o.Scene,ne=b.vary||{},_=Math.min(1,Math.max(.5,b.quality?.detail??1)),me=Math.min(1.3,Math.max(.7,ne.density??1)),A=b.rng.fork?b.rng.fork("pattern-world"):b.rng,Me=Math.min(8,Math.max(3,Math.round((3+A()*5)*me))),he=Math.min(60,Math.max(20,Math.round((20+A()*40)*me))),D=4+Math.floor(A()*3),$=A(),pe={rare:!!ne.rare,detail:_};ne.hour==="night"?pe.metal=2:ne.hour==="dawn"?pe.metal=1:ne.hour==="golden"&&(pe.metal=0);const j=await qt(b,pe);K.add(j.object),await b.yield();const ge=j.anchors,xe=j.uniforms,Ne=j.inkOf,q=j.inks,C=ge.darkPeak,L=ge.brightPeak,I=Math.sign(C.base.x)||1,n=(e,t,r)=>new o.Vector3(e*I,t,r);ge.window.set(-.879*I,.242,.41).normalize();const Se=22*Math.PI/180,re=new o.Vector3(Math.cos(Se)*I,0,Math.sin(Se)),He=new o.Vector3(L.base.x+128*Math.sin(Se)*I,9.5,L.base.z-128*Math.cos(Se)),ct=Math.abs((C.base.x-He.x)*re.z-(C.base.z-He.z)*re.x),At=(C.base.x-He.x)*re.x+(C.base.z-He.z)*re.z,ce=He.clone().addScaledVector(re,At-Math.sqrt(Math.max(17424-ct*ct,1))),st=ce.clone().addScaledVector(re,-120),_e=8.5,it=[n(-23,258,-276),n(-27,258,-228),n(-40,258,-180),n(-74,258,-128),n(-118,258,-75),n(-140,257.5,-30),n(-140,256,22),n(-132,254,80),n(-108,250,156),n(-54,243,222),n(24,232,228),n(76,222,214),n(100,208,184),n(104,194,152),n(94,180,122),n(80,166,92),n(66,152,62),n(53,139,30),n(37,125,12.5),n(4,100,12),n(-28,70,12.5),n(-54,46,15),n(-76,26,27),n(-88,14,52),n(-103,9.5,95),n(-123,8.5,134),n(-133,8,168),n(-119,8,199),n(-80,8.6,221),st,st.clone().lerp(ce,.5),ce],v=Ht(it),be=e=>{let t=0,r=1e9;const i=new o.Vector3;for(let m=0;m<=400;m++){v.pointAt(m/400,i);const a=i.distanceToSquared(it[e]);a<r&&(r=a,t=m/400)}return t},ke=be(6),Lt=be(9),Vt=be(12),Nt=be(14),De=be(18),se=be(23),_t=be(27),lt=be(29),Be=.34,qe=.44;await b.yield();const Je=[],dt=e=>46*Math.sin((e-330)*.0105)*Q(330,430,e),ht=e=>(100*(.55+.45*Q(-6,42,e))+10*Q(70,150,e)-16*Q(170,300,e)*(1-Q(300,420,e))+60*Q(330,520,e))*(1-.95*Q(470,700,e));{const e=A.fork?A.fork("hills"):A,t={pos:[],nor:[],cm:[],pat:[],idx:[]},r=[0,1,2,13,12],i=[5,6,8,4,3],m=(k,s,g,u,x,z)=>{const y=u*(.8+e()*.4),B=u*(.8+e()*.4),c=e()*J,h=(e()-.5)*.5,M=.55+e()*.5,R=Math.floor(e()*8),E=e.shuffle?e.shuffle(r.slice()):r,U=e()<.38?i[Math.floor(e()*i.length)]:E[2],l=e()<.5?[E[0],E[1],U]:[E[0],U,E[1]],O=t.pos.length/3,te=22,ae=9,X=Math.cos(c),G=Math.sin(c);for(let F=0;F<=ae;F++){const T=F/ae,H=x*Math.sin(T*Math.PI/2),oe=Math.pow(Math.cos(T*Math.PI/2),M)*(F===0?1.04:1);for(let W=0;W<=te;W++){const Y=W/te*J,N=Math.cos(Y)*y*oe+h*H,P=Math.sin(Y)*B*oe;t.pos.push(k+N*X-P*G,s+H-(F===0?.5:0),g+N*G+P*X);const de=Math.cos(Y)/y,ie=Math.sin(Y)/B,ye=(.25+1.6*T)/Math.max(x,1),Z=Math.hypot(de,ye,ie)||1;t.nor.push((de*X-ie*G)/Z,ye/Z,(de*G+ie*X)/Z),t.cm.push(k,s+x*.45,g,z),t.pat.push(R,l[0],l[1],l[2])}}for(let F=0;F<ae;F++)for(let T=0;T<te;T++){const H=O+F*(te+1)+T,oe=H+1,W=H+te+1,Y=W+1;t.idx.push(H,W,oe,oe,W,Y)}},a=(k,s,g,u)=>{const x=v.nearestXZ(k,s);if(Math.abs(x.y-u)<120&&x.dist<g+34)return!1;if(u<100){if(s>-g&&s<720&&Math.abs(k-dt(s))<ht(Math.max(s,0))+g+22||Math.hypot(k-C.base.x,s-C.base.z)<128+g||Math.hypot(k-L.base.x,s-L.base.z)<128+g||Math.abs(k)<470+g&&s<g+6)return!1}else if(Math.abs(k)<112+g&&s>-470-g)return!1;return!0},f=Math.round(60*(_<1?.6:1));let d=0;for(let k=0;k<400&&d<f;k++){const s=d<9?0:d<Math.round(f*.58)?1:2;let g,u,x,z,y,B=0;if(s===0){if(g=(e()<.5?-1:1)*(135+e()*280),u=-650+e()*600,x=22+e()*48,z=x*(.5+e()*.55),y=5+e()*5,B=250,Math.abs(g)+x>440)continue}else if(s===1)g=(e()*2-1)*720,u=30+e()*800,x=24+e()*70,z=Math.min(90,x*(.45+e()*.6)),y=5+e()*7;else{const c=e()*J,h=820+e()*1580;g=Math.cos(c)*h,u=300+Math.sin(c)*h,x=60+e()*70,z=40+e()*50,y=20+e()*20}a(g,u,x,B)&&(s<2&&(y=Math.min(26,Math.max(y,v.distanceTo(g,B+z*.5,u)*.04))*(.85+.3*e())),m(g,B,u,x,z,y),d++,d%8===7&&await b.yield())}m(170*I,0,60,33,25,5.5),m(212*I,0,126,30,33,6.5);for(const[k,s,g,u,x,z,y]of[[-330,1010,104,86,30,5,[6,5,0]],[90,1260,108,90,34,0,[3,4,0]],[480,1060,98,78,28,3,[2,13,0]],[830,640,104,88,30,4,[5,0,6]],[910,250,96,80,26,1,[3,4,7]],[1060,980,106,84,36,7,[2,0,13]],[-810,540,106,88,32,0,[3,4,0]],[-770,160,96,74,26,6,[2,13,1]]]){const B=t.pat.length;m(k*I,0,s,g,u,x);for(let c=B;c<t.pat.length;c+=4)t.pat[c]=z,t.pat[c+1]=y[0],t.pat[c+2]=y[1],t.pat[c+3]=y[2];await b.yield()}const p=new o.BufferGeometry,V=t.pos.length/3;p.setAttribute("position",new o.Float32BufferAttribute(t.pos,3)),p.setAttribute("normal",new o.Float32BufferAttribute(t.nor,3)),p.setAttribute("aCM",new o.Float32BufferAttribute(t.cm,4)),p.setAttribute("aPat",new o.Float32BufferAttribute(t.pat,4)),p.setAttribute("aHemP",new o.Float32BufferAttribute(new Float32Array(V*4),4)),p.setAttribute("aHem",new o.Float32BufferAttribute(new Float32Array(V*2),2)),p.setIndex(t.idx);const w=new o.Mesh(p,j.makePatternMaterial(!1)),S=new o.Mesh(p,j.makePatternMaterial(!0));w.frustumCulled=!1,S.frustumCulled=!1,K.add(w,S),await b.yield()}const $e=[],St=[];{const e=A.fork?A.fork("wire"):A,t={pos:[],nor:[],s:[],roll:[],rk:[],idx:[]},r=[0,0,0,0],i=new o.Vector3(0,1,0),m=(u,x,z,y)=>{const B=22*y,c=new o.Vector3(x.x-u.x,0,x.z-u.z);c.lengthSq()<1e-6&&c.set(1,0,0),c.normalize();const h=e()*J,M=new o.Vector3(-c.z,0,c.x),R=l=>new o.Vector3().copy(u).addScaledVector(i,B*l).addScaledVector(c,z*B*l*l).addScaledVector(M,Math.sin(l*3.4+h)*.9*y*l),E=[];for(let l=0;l<=22;l++)E.push(R(l/22*.97));Ve(t,E,l=>(.62-.3*l+.5*Math.pow(1-l,8))*y,r,r,7);const U=Le(R(.97).addScaledVector(i,1.7*y),c,i,1.7*y,2.1,-Math.PI/2,1,36);Ve(t,U,l=>(.38-.18*l)*y,r,r,5);for(let l=0;l<9;l++){const O=.3+.64*(l/8),te=l*2.4+h+(e()-.5)*.5,ae=(9.5-5.5*(l/8)+e()*2)*y,X=(2.5+e()*3.5)*y,G=new o.Vector3(Math.cos(te),0,Math.sin(te)),F=R(O),T=[];for(let N=0;N<=12;N++){const P=N/12;T.push(new o.Vector3().copy(F).addScaledVector(G,ae*P).addScaledVector(i,X*Math.sin(P*Math.PI/2)-.8*y*Math.sin(P*Math.PI)))}const H=1.5*y,oe=T[T.length-1],W=Le(oe.clone().addScaledVector(i,H),G,i,H,2.2,-Math.PI/2,1,34),Y=T.concat(W.slice(1));Ve(t,Y,N=>(.36-.18*N)*y,r,r,5);for(let N=3;N<Y.length;N++){const P=N<T.length?5:1;for(let de=0;de<P;de++){const ie=Y[N],ye=Y[N-1],Z=e();$e.push(ie.x+(ye.x-ie.x)*Z+(e()-.5)*.5,ie.y+(ye.y-ie.y)*Z-.42-e()*.9,ie.z+(ye.z-ie.z)*Z+(e()-.5)*.5,e())}}}},a=u=>35+55*Math.pow(Math.max(0,(u+420)/421.6),1.6),f=[[n(-62,250,-172),n(0,250,-140),.1,1],[n(-107,250,-25),n(-60,250,0),.08,1.15],[n(-143,0,92),n(-100,0,102),.22,1.1],[n(114,0,110),n(40,0,60),.26,1],[n(120,0,236),n(60,0,250),.15,.9],[n(118,250,-64),n(60,250,-30),.12,.95]];for(let u=0;u<D;u++)m(...f[u]),await b.yield();const d=new o.Vector3(-re.z,0,re.x),p=_e/7,V=[];for(let u=0;u<=64;u++){const x=u/64*J;V.push(ce.clone().addScaledVector(d,Math.cos(x)*(_e+.8)).addScaledVector(i,Math.sin(x)*(_e+.8)))}Ve(t,V,()=>.46,r,r,6);for(const u of[-1,1]){const x=d.clone().multiplyScalar(u),z=ce.clone().addScaledVector(x,12.1*p);z.y=11.6*p;const y=[];for(let h=0;h<=10;h++){const M=h/10;y.push(new o.Vector3().copy(z).addScaledVector(x,(4+1.6*(1-M)*(1-M))*p).setY(-.3+(11.6*p+.3)*M))}const B=y.concat(Le(z,x,i,4*p,2.6,0,1,52).slice(1));Ve(t,B,h=>(.5-.26*h+.5*Math.pow(1-h,10))*p,r,r,7);const c=Le(z.clone().addScaledVector(x,7.3*p).setY(1.7*p),x,i,1.7*p,1.9,Math.PI,1,26);Ve(t,c,h=>(.3-.14*h)*p,r,r,5)}await b.yield();const w=[[n(-135,0,207),[.55,.8]],[n(-88,0,196),[.86,.51]],[n(124,0,168),[.1,1]],[n(-128,0,30),[0,1]],[n(128,0,318),[.3,1]],[n(-111,0,133),[-.3,.95],4.6],[n(-102,0,152),[-.2,.98],6],[n(-96,0,118),[-.3,.95],3.2]];for(const[u,x,z]of w){const y=z||4.5,B=new o.Vector2(x[0]*I,x[1]).normalize(),c=e()*J,h=.16+e()*.08,M=Le(new o.Vector3(0,0,0),new o.Vector3(1,0,0),i,y-.3,2.7,e()*J,e()<.5?1:-1,60);Ve(t,M,R=>(.36-.2*R)*y/4.5,[u.x,y+.1,u.z,y],[B.x,B.y,c,h],6),St.push({p:u,d:B,ph:c,rate:h,R:y})}const S=new o.BufferGeometry;S.setAttribute("position",new o.Float32BufferAttribute(t.pos,3)),S.setAttribute("normal",new o.Float32BufferAttribute(t.nor,3)),S.setAttribute("aS",new o.Float32BufferAttribute(t.s,1)),S.setAttribute("aRoll",new o.Float32BufferAttribute(t.roll,4)),S.setAttribute("aRk",new o.Float32BufferAttribute(t.rk,4)),S.setIndex(t.idx);const k=u=>new o.ShaderMaterial({uniforms:{...xe,uHull:{value:u?1:0},uWireA:{value:q[0]},uWireB:{value:q[1]},uWireC:{value:q[2]}},vertexShader:Et,fragmentShader:Qt,side:u?o.BackSide:o.FrontSide,fog:!1}),s=new o.Mesh(S,k(!1)),g=new o.Mesh(S,k(!0));s.frustumCulled=!1,g.frustumCulled=!1,K.add(s,g),await b.yield()}const Bt=(e,t)=>{const r=new o.InstancedBufferGeometry;r.setAttribute("position",new o.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),r.setIndex([0,1,2,0,2,3]);for(const i in e)r.setAttribute(i,new o.InstancedBufferAttribute(e[i],4));return r.instanceCount=t,r},Ie=(e,t,r,i,m={},a=!1)=>{const f=new o.ShaderMaterial({uniforms:{...xe,...m},vertexShader:r,fragmentShader:i,side:o.DoubleSide,fog:!1,...a?{transparent:!0,depthWrite:!1,blending:o.AdditiveBlending}:{}}),d=new o.Mesh(Bt(e,t),f);return d.frustumCulled=!1,a&&(d.renderOrder=3),K.add(d),d},le=`
      precision highp float;
      uniform vec3 uInk[14]; uniform float uTime, uViewH, uTanHalf, uGold; uniform vec3 uCamL;
      vec3 inkAt(float i){ int k = int(clamp(i + .5, 0., 13.)); return uInk[k]; }
      float h11(float p){ p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }`;{const e=$e.length/4,t=new Float32Array($e);Ie({aP:t},e,le+`
        attribute vec4 aP; varying vec2 vQ; varying vec2 vK;
        void main(){
          vec3 C = aP.xyz; vec3 tc = uCamL - C; float d = max(length(tc), .5);
          vec3 r = normalize(vec3(tc.z, 0., -tc.x) + vec3(1e-4, 0., 0.));
          float w = .22 * sin(uTime * (2.2 + aP.w * 2.) + aP.w * 40.) + .1 * sin(uTime * 5.3 + aP.w * 90.);      // it hangs from its top edge and trembles
          vec3 rr = r * cos(w) + vec3(0., 1., 0.) * sin(w), uu = vec3(0., 1., 0.) * cos(w) - r * sin(w);
          float pxM = d * 2. * uTanHalf / max(uViewH, 1.), hs = .36 + .1 * h11(aP.w * 7.) + pxM;
          vec3 P = C + rr * position.x * hs + uu * (position.y - 1.) * hs;
          vQ = position.xy * hs; vK = vec2(aP.w, pxM);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(P, 1.);
        }`,le+`
        varying vec2 vQ; varying vec2 vK;
        void main(){
          float hs = .36 + .1 * h11(vK.x * 7.);
          vec2 p = vQ / hs;                                             // triangle: flat top at y 1, point at y -1
          float dd = min(((1. + p.y) * .5 - abs(p.x)) * .894, 1. - p.y) * hs;                // metres inside the outline
          if (dd < -vK.y) discard;
          float cw = max(.045, 1.4 * vK.y), k = h11(vK.x * 13.7);
          vec3 col = k < .3 ? uInk[3] : k < .55 ? uInk[4] : k < .8 ? uInk[8] : uInk[0];
          gl_FragColor = vec4(dd < cw ? uInk[9] : col, 1.);
        }`),await b.yield()}{const e=A.fork?A.fork("heads"):A,t=Math.round(8400*_*(.85+.15*me)),r=110,i=new Float32Array((t+r)*4),m=new Float32Array((t+r)*4),a=new o.Vector3,f=new o.Vector3,d=10,p=13,V=Math.ceil(v.length),w=new Float32Array((V+1)*3);for(let c=0;c<=V;c++)v.pointAt(c/V,a),w[c*3]=a.x,w[c*3+1]=a.y,w[c*3+2]=a.z;const S=24,k=new Map,s=(c,h)=>c*4096+h;for(let c=0;c<=V;c++){if(w[c*3+1]>40)continue;const h=s(Math.floor(w[c*3]/S),Math.floor(w[c*3+2]/S));let M=k.get(h);M||k.set(h,M=[]),M.push(c)}const g=(c,h)=>{const M=Math.hypot(c,h);return M*(1+Q(.64,1,Math.max(h,0)/Math.max(M,1e-6)))},u=[0,0,0],x=(c,h,M,R,E,U)=>{const l=U*R+.2,O=.22*M,te=.25+M;let ae=0;for(let X=0;X<40;X++){let G=l,F=0,T=0,H=0,oe=!1;const W=l+O,Y=Math.floor(c/S),N=Math.floor(h/S);for(let Ke=-1;Ke<=1;Ke++)for(let Ae=-1;Ae<=1;Ae++){const at=k.get(s(Y+Ke,N+Ae));if(at)for(let ot=0;ot<at.length;ot++){const nt=at[ot],rt=w[nt*3+1]-te,Ue=c-w[nt*3],Ye=h-w[nt*3+2];if(rt>l||Ue>W||Ue<-W||Ye>W||Ye<-W)continue;const zt=g(Math.max(Math.hypot(Ue,Ye)-O,0),rt);zt<G&&(G=zt,F=Ue,T=rt,H=Ye,oe=!0)}}if(!oe){ae===2&&(ae=1);break}const P=Math.hypot(F,H),de=P>.001?F/P:1,ie=P>.001?H/P:0;let ye=P,Z=P+.25;for(;g(Math.max(Z-O,0),T)<l&&Z<P+60;)ye=Z,Z+=.25;for(let Ke=0;Ke<5;Ke++){const Ae=.5*(ye+Z);g(Math.max(Ae-O,0),T)<l?ye=Ae:Z=Ae}const Xe=Z+.3*Math.min(X,1);E&&X===0?(c-=de*(Xe+P),h-=ie*(Xe+P)):(c+=de*(Xe-P),h+=ie*(Xe-P)),ae=2}return u[0]=c,u[1]=h,u[2]=ae,u},z=(c,h,M)=>h<4||Math.abs(c)<104&&h<112&&h>0||Math.hypot(c-C.base.x,h-C.base.z)<118||Math.hypot(c-L.base.x,h-L.base.z)<118||Math.hypot(c-ce.x,h-ce.z)<M,y=(c,h,M,R,E,U=d)=>{let l=x(c,h,M,R,!1,U);return l[2]===0||(l[2]===2||z(l[0],l[1],E))&&(l=x(c,h,M,R,!0,U),(l[2]===2||z(l[0],l[1],E))&&(l[0]=1e6,l[2]=3)),l};let B=0;for(let c=0;c<t*6&&B<t;c++){let h,M,R=0;const E=e();if(E<.52){const G=se+.03+e()*(lt+.035-se-.03);v.pointAt(G,a),v.tangentAt(G,f);const F=e(),T=(e()<.5?-1:1)*(.6+40*Math.pow(F,1.35));h=a.x-f.z*T+(e()-.5)*5,M=a.z+f.x*T+(e()-.5)*5,R=2.4*Math.max(0,1-Math.abs(T)/16)}else if(E<.78){const G=se+.02+e()*(.985-se);v.pointAt(G,a),v.tangentAt(G,f);const F=(e()<.5?-1:1)*(1.5+34*Math.pow(e(),1.6));h=a.x-f.z*F+(e()-.5)*6,M=a.z+f.x*F+(e()-.5)*6}else M=112+e()*470,h=dt(M)+(e()*2-1)*(ht(M)+14);const U=.8+1.4*e()+(e()<.2?1.1:0)+R*(.5+.5*e()),l=(.34+.4*e())*(1+.16*R),O=Math.floor(e()*3),te=e(),ae=e();if(M<4||Math.abs(h)<104&&M<112&&M>0||Math.hypot(h-C.base.x,M-C.base.z)<118||Math.hypot(h-L.base.x,M-L.base.z)<118||Math.hypot(h-ce.x,M-ce.z)<9)continue;const X=y(h,M,U,l,9,d+(p-d)*Q(.5,.8,l));i.set([X[0],U,X[1],l],B*4),m.set([O,te,ae,0],B*4),B++,c%150===149&&await b.yield()}{const c=e.fork?e.fork("great-heads"):e,h=.8+1.4+1.1+2.4+(.34+.4)*(1+.16*2.4),M=(l,O)=>Math.abs(l)<104&&O<112&&O>0,R=3;let E=0;for(let l=0;l+R<=v.length;l+=R)v.posAtDist(l,a),M(a.x,a.z)&&(E=l+R);const U=E/v.length;for(let l=0;l<r;l++){const O=U+(lt-U)*c();v.pointAt(O,a),v.tangentAt(O,f);const te=c(),ae=c(),X=c(),F=(c()<.5?-1:1)*(2.9+6.5*te),T=a.x-f.z*F,H=a.z+f.x*F,oe=.8+.6*X,W=h-oe-1.6*ae,Y=Math.floor(c()*3),N=c(),P=c();if(H<4||M(T,H)||Math.hypot(T-C.base.x,H-C.base.z)<118||Math.hypot(T-L.base.x,H-L.base.z)<118||Math.hypot(T-ce.x,H-ce.z)<14)continue;const de=y(T,H,W,oe,14,p);l%20===19&&await b.yield(),i.set([de[0],W,de[1],oe],B*4),m.set([Y,N,P,0],B*4),B++}}Ie({aA:i,aB:m},B,le+`
        attribute vec4 aA; attribute vec4 aB; varying vec2 vQ; varying vec4 vK; varying vec3 vS; varying vec2 vE;
        void main(){
          float tall = aA.y, rad = aA.w;
          float nod = .16 * sin(uTime * 1.3 - aA.z * .07 + aA.x * .02) + .06 * sin(uTime * 2.9 + aB.z * 30.);       // the wave runs downstream
          vec3 N3 = vec3(.3, 0., .95) * nod * tall;
          vec3 Hc = vec3(aA.x, .25 + tall, aA.z) + N3;                 // the head faces the eye; the stem runs from it to the foot
          vec3 tc = uCamL - Hc; float d = max(length(tc), .5); tc /= d;
          vec3 r = normalize(vec3(tc.z, 0., -tc.x) + vec3(1e-4, 0., 0.)), u2 = cross(tc, r);
          float pxM = d * 2. * uTanHalf / max(uViewH, 1.);
          vec2 E = vec2(-dot(N3, r), -tall * u2.y - dot(N3, u2));       // the foot, in the head's plane
          float hw = rad + pxM, pad = 2. * pxM + .05;
          vec2 lo = min(vec2(-hw), E - pad), hi = max(vec2(hw), E + pad);
          vec2 q = mix(lo, hi, position.xy * .5 + .5);
          vQ = q; vE = E; vK = vec4(tall, rad, pxM, aB.x); vS = vec3(aB.y, aB.z, uTime * (.25 + .3 * aB.z) * (aB.z > .5 ? 1. : -1.));
          gl_Position = projectionMatrix * modelViewMatrix * vec4(Hc + r * q.x + u2 * q.y, 1.);
        }`,le+`
        varying vec2 vQ; varying vec4 vK; varying vec3 vS; varying vec2 vE;
        void main(){
          // (round 4b) a head under seven pixels of radius thins its umber edge, and under three it is its own flat ink with
          // no edge, so a far stand reads as flowers and not as umber speckle; a stem is one pixel wide, never less
          float R = vK.y, px = vK.z, far = smoothstep(3., 7., R / max(px, 1e-4)), cw = min(max(.04, 1.2 * px), R * .3) * far;
          float hw = R + px, pad = 2. * px + .05;                       // the quad's own extent (as the vertex shader lays it): the across coordinate is held to it before it is squared
          vec2 p = clamp(vQ, min(vec2(-hw), vE - pad), max(vec2(hw), vE + pad)); float r = length(p), th = atan(p.y + 1e-5, p.x + 1e-5) + vS.z;
          float edge = R; vec3 colA, colB;
          float k = vS.x; float gold = step(2.6, uGold);
          colA = k < .25 ? uInk[5] : k < .5 ? uInk[6] : k < .75 ? uInk[8] : uInk[4]; colB = k < .5 ? uInk[4] : uInk[0];
          colA = mix(colA, uInk[0], gold); colB = mix(colB, uInk[1], gold);
          vec3 col;
          if (vK.w < .5) { float pet = abs(cos(th * 4.)); edge = R * (.56 + .44 * pet); col = r < R * .3 ? uInk[3] : (r < R * .42 ? colB : colA); }       // daisy
          else if (vK.w < 1.5) { float b = floor(r / max(R, 1e-3) * 4.); col = b < .5 ? uInk[3] : (mod(b, 2.) < .5 ? colA : colB); }                  // ringed target
          else { float s = fract((th + r / max(R, 1e-3) * 5.) / 3.14159); col = r < R * .22 ? uInk[3] : (s < .5 ? colA : colB); }                       // spiral
          float dHead = edge - r;
          float hseg = clamp(dot(p, vE) / max(dot(vE, vE), 1e-4), 0., 1.);
          bool stem = length(p - vE * hseg) < max(px * .5, .035);
          float rim = -px * .5 * far;
          if (dHead < rim && !stem) discard;
          col = dHead < cw ? uInk[9] : col;
          gl_FragColor = vec4(dHead < rim ? uInk[9] : col, 1.);
        }`),await b.yield()}const ut=11,ft=[],et=[],vt=[],mt=[];{const e=A.fork?A.fork("birds"):A,t=new o.Vector3,r=new o.Vector3,i=95/v.length;v.pointAt(i,t),v.tangentAt(i,r);const m=t.clone().addScaledVector(r,12.5);m.y+=.4;const a=new o.Vector3(-r.z,0,r.x).multiplyScalar(-I),f=new o.Vector3(-re.z,0,re.x).multiplyScalar(-I),d=Be+.012,p=new o.Vector3,V=new o.Vector3;v.pointAt(d,p),v.tangentAt(d,V),V.y=0,V.normalize();const w=[{c:m,ex:new o.Vector3(1,0,0),rx:0,rz:4e3,along:a.clone().multiplyScalar(-.8).addScaledVector(r,.6),bob:0,size:1,key:[i,1.1*v.length/4e3,4],rate:0},{c:ce.clone(),ex:new o.Vector3(1,0,0),rx:0,rz:4e3,along:re.clone().multiplyScalar(Math.cos(.13)).addScaledVector(f,Math.sin(.13)),bob:0,size:-3.4,key:[.9,1.04*v.length/4e3,-1],rate:0,span:122},{c:n(-106,267,-25),ex:new o.Vector3(1,0,0),rx:17.5,rz:16.5,bob:2.2,size:1,key:null,rate:.5},{c:n(26,262.5,-92),ex:new o.Vector3(1,0,0),rx:30,rz:24,bob:2,size:1,key:null,rate:.24},{c:n(-4,13,54),ex:new o.Vector3(1,0,0),rx:34,rz:22,bob:3,size:1,key:null,rate:-.3},{c:n(-105,15,173),ex:new o.Vector3(0,0,1),rx:27,rz:25,bob:3,size:1,key:null,rate:.33},{c:n(-18,14,272),ex:new o.Vector3(1,0,0),rx:32,rz:17,bob:2.5,size:1,key:null,rate:-.28},{c:p.clone().add(n(42,-7,-16)),ex:new o.Vector3(1,0,0),rx:0,rz:4e3,along:V.clone().multiplyScalar(.8).add(n(0,0,-.35)).normalize(),bob:0,size:3.4,key:[d,.95*v.length/4e3,-2],rate:0,always:!0}];{const k=ke+.05;v.pointAt(k,t),v.tangentAt(k,r);const s=new o.Vector3(-r.z,0,r.x).multiplyScalar(-I),g=new o.Vector3(r.x,0,r.z).normalize();w.push({c:t.clone().addScaledVector(g,28).addScaledVector(s,5).add(new o.Vector3(0,-16,0)),ex:new o.Vector3(1,0,0),rx:0,rz:4e3,along:g.clone().multiplyScalar(.86).addScaledVector(s,.5),bob:0,size:1.7,key:[k,1.05*v.length/4e3,-2],rate:0,always:!0});const u=qe;v.pointAt(u,t);const x=new o.Vector3(0,134,0).sub(t).normalize();w.push({c:t.clone().addScaledVector(x,46).add(new o.Vector3(0,-6,0)),ex:new o.Vector3(1,0,0),rx:0,rz:4e3,along:n(1,0,-.22).normalize(),bob:0,size:3,key:[u,.5*v.length/4e3,-2],rate:0,always:!0});const z=.52;v.pointAt(z,t),v.tangentAt(z,r);const y=new o.Vector3(r.x,0,r.z).normalize(),B=new o.Vector3(-y.z,0,y.x);w.push({c:t.clone().addScaledVector(y,38).addScaledVector(B,4).add(new o.Vector3(0,-4,0)),ex:new o.Vector3(1,0,0),rx:0,rz:4e3,along:y.clone().multiplyScalar(.85).addScaledVector(B,.53).normalize(),bob:0,size:-3,key:[z,1.16*v.length/4e3,-2],rate:0,span:60,always:!0})}const S=[];for(let k=0;k<ut;k++){const s=w[k],g=k<Me||s.always?9+Math.floor(e()*6):0,u=e()*J;s.along&&(s.ex.normalize(),s.rx===0&&s.ex.set(s.along.z,0,-s.along.x).normalize(),-s.ex.z*s.along.x+s.ex.x*s.along.z<0&&(s.rz=-s.rz)),s.key&&s.key[2]<0&&(s.key[2]=s.key[2]<-1.5?Math.round(g/2):g),s.ph=u,s.n=g,s.step=(s.span?s.span/Math.max(g-1,1):2*Math.abs(s.size))/(s.rx===0?Math.abs(s.rz):Math.max(.5*(s.rx+Math.abs(s.rz)),1)),mt.push(s),ft.push(new o.Vector4(s.c.x,s.c.y,s.c.z,s.rx)),et.push(new o.Vector4(s.ex.x,s.ex.z,s.rz,0)),vt.push(new o.Vector4(s.bob,s.size,u,s.step));for(let x=0;x<g;x++)S.push(k,x,e(),g)}Ie({aB:new Float32Array(S)},S.length/4,le+`
        attribute vec4 aB; uniform vec4 uFC[11], uFD[11], uFE[11]; varying vec2 vQ; varying vec3 vK;
        void main(){
          int f = int(clamp(aB.x + .5, 0., 10.)); vec4 fc = uFC[f], fd = uFD[f], fe = uFE[f];
          float sz = abs(fe.y);
          float a = fd.w - aB.y * fe.w;
          vec3 ex = vec3(fd.x, 0., fd.y), ez = vec3(-fd.y, 0., fd.x);
          vec3 C = fc.xyz + ex * cos(a) * fc.w + ez * sin(a) * fd.z + vec3(0., fe.x * sin(a * 2. + fe.z) + .32 * sin(uTime * 2.4 - aB.y * .8 + fe.z), 0.);
          vec3 T = normalize(-ex * sin(a) * fc.w + ez * cos(a) * fd.z + vec3(0., 2. * fe.x * cos(a * 2. + fe.z), 0.) + vec3(1e-4, 0., 0.));
          vec3 tc = uCamL - C; float d = max(length(tc), .5);
          vec3 S = normalize(cross(T, tc / d) + vec3(0., 1e-4, 0.));
          if (fe.y < 0.) { T = normalize(vec3(tc.z, 0., -tc.x) + vec3(1e-4, 0., 0.)); S = vec3(0., 1., 0.); }      // a file flown away from us shows its eyes broadside
          float wob = .28 * sin(uTime * 2.4 - aB.y * .8 + fe.z + 1.2) + .12 * sin(uTime * 5.1 + aB.z * 30.);          // each almond tilts as the wave passes
          vec3 Tx = T * cos(wob) + S * sin(wob), Ty = S * cos(wob) - T * sin(wob);
          float pxM = d * 2. * uTanHalf / max(uViewH, 1.), hl = .8 * sz + pxM, hwd = .42 * sz + pxM;
          vQ = vec2(position.x * hl, position.y * hwd); vK = vec3(sz, pxM, aB.z);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(C + Tx * vQ.x + Ty * vQ.y, 1.);
        }`,le+`
        varying vec2 vQ; varying vec3 vK;
        void main(){
          float sz = vK.x, px = vK.y; vec2 hq = vec2(.8, .42) * sz + px, p = clamp(vQ, -hq, hq) / max(sz, .1);   // almond: two discs intersected, 1.6 by 0.8 (the across coordinate held to the quad's own extent first)
          float rho = 1., c = .6;
          float dd = (rho - max(length(p - vec2(0., c)), length(p + vec2(0., c)))) * sz;
          if (dd < -px * .5) discard;
          float cw = max(.05, 1.4 * px), r = length(p - vec2(.06, 0.));
          vec3 col = uInk[4];
          col = r < .33 ? uInk[6] : col;
          col = (r < .2 && r > .1) ? uInk[3] : col;
          col = r < .1 ? uInk[1] : col;
          col = (dd > cw && dd < cw + .05 * sz && r > .36) ? uInk[0] : col;         // a hair of gold inside the contour
          gl_FragColor = vec4(dd < cw ? uInk[9] : col, 1.);
        }`,{uFC:{value:ft},uFD:{value:et},uFE:{value:vt}}),Je.push((k,s,g,u)=>{for(let x=0;x<ut;x++){const z=mt[x];et[x].w=z.key?(z.n-z.key[2])*z.step+(u-z.key[0])*z.key[1]+.6*z.step*Math.sin(s*.7+z.ph):z.ph+s*z.rate}}),await b.yield()}{const e=A.fork?A.fork("fish"):A,t=new Float32Array(he*4),r=new Float32Array(he*4),i=new Float32Array(he*4),m=new o.Vector3,a=new o.Vector3;for(let f=0;f<he;f++){let d,p;const V=3+e()*5,w=f<he*.55;if(i[f*4]=w?4.5+e()*3:1.5+e()*3,w){const S=se+.012+e()*.085;v.pointAt(S,m),v.tangentAt(S,a);const k=(e()<.5?-1:1)*(8+V+e()*3);d=m.x-a.z*k,p=m.z+a.x*k}else d=(e()*2-1)*86,p=14+e()*86;d=Math.min(88,Math.max(-88,d)),p=Math.min(100,Math.max(12,p)),t.set([d,p,V,e()],f*4),r.set([e(),(.2+e()*.2)*(e()<.5?-1:1),1.4+e()*.3,e()],f*4)}Ie({aA:t,aB:r,aC:i},he,le+`
        attribute vec4 aA; attribute vec4 aB; attribute vec4 aC; varying vec2 vQ; varying vec4 vK;
        void main(){
          float ang = uTime * aB.y + aA.w * 6.2831853, R = aB.z;
          float dive = .2 + .8 * sin(uTime * (.55 + .4 * aB.w) + aB.x * 6.2831853);                 // 1 up through the surface, -1 under
          vec3 C = vec3(aA.x + cos(ang) * aA.z, .4 + R * .2 + aC.x * max(dive, 0.) + R * 1.5 * min(dive, 0.), aA.y + sin(ang) * aA.z);          // right under, then clear of the surface
          vec3 tc = uCamL - C; float d = max(length(tc), .5);
          vec3 r = normalize(vec3(tc.z, 0., -tc.x) + vec3(1e-4, 0., 0.));
          float pxM = d * 2. * uTanHalf / max(uViewH, 1.), hs = R + pxM;
          float roll = -ang * aA.z / max(R, .1) * .6 - uTime * .5;
          vQ = position.xy * hs; vK = vec4(R, pxM, roll, dive);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(C + r * vQ.x + vec3(0., vQ.y, 0.), 1.);
        }`,le+`
        varying vec2 vQ; varying vec4 vK;
        void main(){
          float R = vK.x, px = vK.y; vec2 q = clamp(vQ, -(R + px), R + px);          // the across coordinate, held to the quad's own extent before it is squared
          float r = length(q), rn = r / max(R, .1);
          float cw = max(.06, 1.4 * px);
          float th = atan(q.y + 1e-5, q.x + 1e-5) + vK.z;
          // the outline: a disc with one arm unfurled as a tail, so it reads as a wheel with a flipper and never as a meadow disc
          float tt = fract(th / 6.2831853) * 6.2831853, kt = tt / 2.4;
          float dTail = tt < 2.4 ? (.27 * (1. - kt) + .012) - abs(rn - (.5 + .44 * kt)) : -1.;
          float dd = max(.64 - rn, dTail) * R;
          if (dd < -px * .5) discard;
          float wind = 5.2 + .785 * vK.w;                                                 // it unwinds a quarter turn as it dives
          float s = fract((th - rn * wind) / 3.14159265);                                 // two arms
          vec3 col = s < .5 ? uInk[5] : uInk[0];
          col = (abs(s - .5) < .06 || s < .06 || s > .94) ? uInk[9] : col;                // the arms are parted by a drawn line
          col = rn < .17 ? uInk[3] : (rn < .23 ? uInk[1] : col);
          col = (rn > .52 && dd > cw) ? (dTail > .64 - rn ? (kt > .55 ? uInk[1] : uInk[3]) : uInk[3]) : col;   // a black tyre and tail, the tail tipped pale
          gl_FragColor = vec4(dd < cw ? uInk[9] : col, 1.);
        }`),await b.yield()}{const e=A.fork?A.fork("air"):A,t=Math.round(800*_),r=Math.round(600*_),i=t+r,m=new Float32Array(i*4),a=new Float32Array(i*4);for(let d=0;d<t;d++)m.set([e(),e(),e(),0],d*4),a.set([e(),.1+.16*e(),.6+.8*e(),e()],d*4);const f=[n(-260,0,1500),n(-1250,0,760),n(1150,0,1050)];for(let d=t;d<i;d++){const p=f[d%3],V=e()*J,w=Math.sqrt(e())*190;m.set([p.x+Math.cos(V)*w,e()*430,p.z+Math.sin(V)*w,1],d*4),a.set([e(),.45,.8+.5*e(),e()],d*4)}Ie({aA:m,aB:a},i,le+`
        attribute vec4 aA; attribute vec4 aB; varying vec2 vQ; varying vec2 vK;
        void main(){
          vec3 C; vec2 hs; float k = 1.; vec3 rr, uu;
          if (aA.w < .5) {                                        // a flake: wrapped in a box that travels with the eye
            vec3 box = vec3(110., 46., 110.);
            vec3 q = aA.xyz * box + vec3(5.5, -.7, 3.2) * uTime * aB.z + vec3(0., 3. * sin(uTime * .8 + aB.w * 20.), 0.);
            C = uCamL + mod(q - uCamL + box * .5, box) - box * .5;
            float sheet = sin(dot(C.xz, vec2(.045, .028)) - uTime * .9 + C.y * .05);    // gusts carry them through in sheets
            k = smoothstep(.1, .7, sheet) * smoothstep(3., 9., length(C - uCamL));
            float tu = uTime * (2. + 3. * aB.x) + aB.w * 40.;
            rr = normalize(vec3(cos(tu), .3 * sin(tu * .7), sin(tu))); uu = normalize(cross(rr, vec3(.3 * sin(tu * 1.3), 1., .2)) + vec3(0., 1e-4, 0.));
            hs = vec2(aB.y);
          } else {                                                // a rain dash: far off, falling
            C = vec3(aA.x, mod(aA.y - uTime * 60. * aB.z, 430.) + 20., aA.z);
            vec3 tc = uCamL - C; rr = normalize(vec3(tc.z, 0., -tc.x) + vec3(1e-4, 0., 0.)); uu = vec3(0., 1., 0.);
            hs = vec2(aB.y, 9. + 9. * aB.x);
          }
          float pxM = max(length(uCamL - C), .5) * 2. * uTanHalf / max(uViewH, 1.);
          vec2 h2 = max(hs, vec2(pxM * .8));
          k *= min(1., hs.x / max(h2.x, 1e-4));
          vQ = position.xy; vK = vec2(k, aA.w);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(C + rr * position.x * h2.x + uu * position.y * h2.y, 1.);
        }`,le+`
        uniform vec3 uRainInk; varying vec2 vQ; varying vec2 vK;
        void main(){
          vec3 col = vK.y < .5 ? uInk[1] * .55 : uRainInk * .8;
          gl_FragColor = vec4(col * clamp(vK.x, 0., 1.), 1.);
        }`,{uRainInk:{value:Ne("#C9CCD0")}},!0),await b.yield()}{const e=A.fork?A.fork("brook"):A,t=new o.CatmullRomCurve3([n(-446,0,-384),n(-320,0,-350),n(-220,0,-300),n(-150,0,-230),n(-110,0,-160),n(-95,0,-105),n(-113,0,-62),n(-127,0,-27),n(-121,0,-6),n(-91,0,-4)],!1,"centripetal"),r=48,i=[],m=t.getLength(),a=new o.Vector3;for(let w=0;w<r;w++){t.getPointAt(w/(r-1),a);const S=w/(r-1);i.push(new o.Vector3(a.x,a.z,8+6.5*Q(.3,.5,S)-6*Q(.8,1,S)))}const f=Math.round(m/2.6),d=12,p=f*d,V=new Float32Array(p*4);for(let w=0;w<f;w++)for(let S=0;S<d;S++){const k=e();V.set([(S+.5)/d*2-1+(e()-.5)*.06,(w+.08*(e()-.5))/f,e(),k<.36?0:k<.72?1:2],(w*d+S)*4)}Ie({aA:V},p,le+`
        attribute vec4 aA; uniform vec3 uBrook[48]; uniform float uBrookRate; varying vec2 vQ; varying vec4 vK;
        void main(){
          float s = fract(aA.y + uTime * uBrookRate), f = s * 47., fi = floor(min(f, 46.)), k = f - fi;
          int i = int(fi);
          vec3 p0 = uBrook[i], p1 = uBrook[i + 1];
          vec2 c = mix(p0.xy, p1.xy, k), tg = normalize(p1.xy - p0.xy + vec2(1e-5, 0.)), nr = vec2(-tg.y, tg.x);
          float hw = mix(p0.z, p1.z, k);
          vec3 base = vec3(c.x + nr.x * aA.x * hw, 250.05, c.y + nr.y * aA.x * hw);
          vec3 tc = uCamL - base; float d = max(length(tc), .5);
          vec3 r = normalize(vec3(tc.z, 0., -tc.x) + vec3(1e-4, 0., 0.)), Tx0 = vec3(nr.x, 0., nr.y);
          float abeam = abs(dot(normalize(vec3(tc.x, 0., tc.z) + vec3(1e-4, 0., 0.)), Tx0));          // edge-on to the eye: turn part way to it
          vec3 Tx = normalize(mix(Tx0 * (dot(Tx0, r) < 0. ? -1. : 1.), r, .75 * smoothstep(.35, .95, abeam)));
          float pxM = d * 2. * uTanHalf / max(uViewH, 1.), cw = min(max(.05, 1.6 * pxM), .135);
          float sc = smoothstep(0., .03, s) * (1. - smoothstep(.955, .995, s));
          vec2 ext = vec2(.3, .8) + cw + pxM;
          vQ = position.xy * ext; vK = vec4(aA.w, pxM, cw, step(aA.z * .3 + .5, uGold));
          gl_Position = projectionMatrix * modelViewMatrix * vec4(base + vec3(0., .8 * sc, 0.) + (Tx * vQ.x + vec3(0., vQ.y, 0.)) * sc, 1.);
        }`,le+`
        varying vec2 vQ; varying vec4 vK;
        void main(){
          vec2 q = abs(vQ); float dd = min(.3 - q.x, .8 - q.y) + vK.z;                 // metres inside the umber edge's outer line
          if (dd < 0.) discard;
          vec3 body = vK.x < .5 ? uInk[3] : (vK.x < 1.5 ? uInk[4] : uInk[7]);
          vec3 line = vK.x < .5 ? uInk[7] : (vK.x < 1.5 ? uInk[7] : uInk[4]);
          body = mix(body, uInk[1], vK.w); line = mix(line, uInk[3], vK.w);            // the rare gold rank: pale gold with a black inner band
          float inner = min(.3 - q.x, .8 - q.y), fine = step(vK.y, .05);
          float lo = mix(.075, .06, vK.w), hi = mix(.105, .2, vK.w);
          vec3 col = (inner > lo && inner < hi) ? mix(body, line, max(fine, vK.w)) : body;
          gl_FragColor = vec4(dd < vK.z ? uInk[9] : col, 1.);
        }`,{uBrook:{value:i},uBrookRate:{value:7/m}}),await b.yield()}const Dt=new o.Vector3,jt=new o.Vector3,It=se+.03,ue=Math.PI/180,fe=new o.Vector3,je=new o.Vector3,Te=new o.Vector3,Ge=new o.Vector3,Tt=new o.Vector3,Ct=n(100,-40,318),Ft=e=>{const t=e*v.length;return v.posAtDist(t,fe),v.posAtDist(t+22,je),Te.subVectors(je,fe).normalize(),Ge.subVectors(Ct,fe).normalize().multiplyScalar(.55).addScaledVector(Te,.45).normalize(),[e,Math.atan2(Ge.x*I,Ge.z),Math.max(-30*ue,Math.asin(Math.max(-1,Math.min(1,Ge.y))))]},pt=e=>{const t=e*v.length;return v.posAtDist(t,fe),v.posAtDist(t+22,je),Te.subVectors(je,fe).normalize(),[e,Math.atan2(Te.x*I,Te.z),Math.asin(Math.max(-1,Math.min(1,Te.y)))]},we=(e,t,r,i,m,a)=>{v.pointAt(e,fe);const f=t-fe.x*I,d=i-fe.z;return[e,Math.atan2(f,d)+m*ue,a===void 0?Math.atan2(r-fe.y,Math.hypot(f,d)):a*ue]},ze=C.base.clone().lerp(C.crown,.45),Ce=L.base.clone().lerp(L.crown,.45),Fe=we(Be,ze.x*I,ze.y,ze.z,13,-13),Ee=we(qe,0,126,0,-11,-24);for(;Ee[1]<Fe[1];)Ee[1]+=J;const tt=e=>[Be+(qe-Be)*e,Fe[1]+(Ee[1]-Fe[1])*e,Fe[2]+(Ee[2]-Fe[2])*e],We=(e,t)=>{const r=e.length,i=[],m=new Array(r);for(let a=0;a<r-1;a++)i.push((t[a+1]-t[a])/(e[a+1]-e[a]));m[0]=i[0],m[r-1]=i[r-2];for(let a=1;a<r-1;a++)m[a]=i[a-1]*i[a]<=0?0:2*i[a-1]*i[a]/(i[a-1]+i[a]);return a=>{if(a<=e[0])return t[0];if(a>=e[r-1])return t[r-1];let f=0;for(;a>e[f+1];)f++;const d=e[f+1]-e[f],p=(a-e[f])/d,V=p*p,w=V*p;return(2*w-3*V+1)*t[f]+(w-2*V+p)*d*m[f]+(3*V-2*w)*t[f+1]+(w-V)*d*m[f+1]}},Pe=we(.63,Ce.x*I,0,Ce.z,-37,-14),Qe=we(.7,ze.x*I,0,ze.z,-33,-6);for(;Qe[1]<Pe[1];)Qe[1]+=J;const Oe=e=>[.63+.015*e,Pe[1]+(Qe[1]-Pe[1])*.22*e,Pe[2]+(Qe[2]-Pe[2])*.2*e],ee=[pt(.05),pt(.08),[.14,14*ue,6*ue],[.168,16*ue,6*ue],[.2,20*ue,-10*ue],Ft(ke+.03),Fe,tt(.25),tt(.5),tt(.75),Ee,we(.47,0,126,0,-8,-21),we(.5,0,126,0,-4,-17),we(.52,0,126,0,-1,-15),we(.58,Ce.x*I,0,Ce.z,-50,-17),we(.61,Ce.x*I,0,Ce.z,-41,-16),Pe,Oe(1),Oe(2),Oe(3),Oe(4),Qe,we(.735,ze.x*I,0,ze.z,-30,-2)];for(let e=1;e<ee.length;e++){for(;ee[e][1]<ee[e-1][1]-.3;)ee[e][1]+=J;ee[e][1]=Math.max(ee[e][1],ee[e-1][1])}const xt=We(ee.map(e=>e[0]),ee.map(e=>e[1])),wt=We(ee.map(e=>e[0]),ee.map(e=>e[2])),yt=3,gt=yt/(.01*v.length),Mt=9.5*ue*gt,bt=9.6*ue*gt,kt=[];{const e=ee[ee.length-1][0],t=[];for(let a=ke*v.length;a<e*v.length;a+=yt)t.push([a/v.length,xt(a/v.length),wt(a/v.length)]);t.push([e,xt(e),wt(e)]);const r=t.length,i=new Array(r),m=new Array(r);for(let a=0;a<r;a++)i[a]=a?Math.max(i[a-1],Math.min(t[a][1],i[a-1]+Mt)):t[0][1];for(let a=r-1;a>=0;a--)m[a]=a<r-1?Math.max(t[a][1],m[a+1]-Mt):t[a][1];for(let a=0,f=t[0][1],d=t[0][2];a<r;a++){const p=f;f=Math.max(p,.5*(i[a]+m[a]));const V=(f-p)*Math.cos(d),w=a?Math.sqrt(Math.max(bt*bt-V*V,0)):1;d+=Math.max(-w,Math.min(w,t[a][2]-d)),kt.push([t[a][0],f,d])}}const ve=[...ee.filter(e=>e[0]<ke),...kt];for(let e=1;e<ve.length;e++){for(;ve[e][1]<ve[e-1][1]-.3;)ve[e][1]+=J;ve[e][1]=Math.max(ve[e][1],ve[e-1][1])}const Pt=We(ve.map(e=>e[0]),ve.map(e=>e[1])),Kt=We(ve.map(e=>e[0]),ve.map(e=>e[2])),Rt=e=>{const t=Pt(e),r=Kt(e),i=Math.cos(r);return v.pointAt(e,fe),Tt.set(Math.sin(t)*i*I,Math.sin(r),Math.cos(t)*i).multiplyScalar(300).add(fe)};return{scene:K,path:v,duration:58,pace:e=>1.15-.4*Q(ke-.03,ke+.02,e)+.15*Q(Be-.01,Be+.03,e)-.35*Q(qe-.02,qe+.02,e)+.3*Q(.5,.54,e)-.1*Q(De-.03,De,e)+.15*Q(se-.03,se+.03,e)+.2*Q(se+.05,se+.1,e)-.1*Q(.9,.97,e),camera:{fov:62,near:.3,far:4e3,lookAhead:22,sway:.5,bank:.4},pois:[{at:(e,t)=>Rt(t),from:.03,to:It,weight:1,fade:.08},{at:ce.clone(),from:se-.05,to:1,weight:.6,fade:.12},{at:C.base.clone().lerp(C.crown,.5),from:.845,to:.93,weight:.62,fade:.35}],portal:{shape:"circle",radius:_e,color:"#ffe9b0",glow:.8,revealDistance:300},post:{flat:1,exposure:1,bloom:{strength:.5,radius:.4,threshold:1.15},grade:{saturation:1,contrast:1,tint:"#ffffff",shadowTint:"#000000",vignette:0,grain:.012,aberration:0}},ride:"none",style:"none",update(e,t,r,i){j.update(e,t,r),j.variant.rare&&j.setRare(.3+.7*Ze(0,ke,i)+.6*Ze(Vt-.06,De,i)+.4*Ze(De,se-.03,i)+1.05*Ze(se,.94,i));for(let m=0;m<Je.length;m++)Je[m](e,t,r,i)},dispose(){j.dispose()}}}};export{Ut as default};
