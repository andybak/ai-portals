import*as t from"three";import{makePath as U0,clamp as it,lerp as J,smoothstep as U,makeRng as L0,hashSeed as Q0}from"../kit/core.js";import{makeSky as T0}from"../kit/sky.js";import*as le from"../kit/fauna.js";import{buildHero as j0}from"../parts/banyan-homecoming.js";const at=Math.PI*2,l0=["#F3D9B8","#FFC766","#E8892B","#CFC3A8","#5E8F3A","#173A26","#0E6F8E"],Y0=`
float segD(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0., 1.); return length(pa - ba * h); }
float wingCut(float s){
  float e;
  if (s < .52) e = 1. - .2 * sin(3.1416 * s / .52);
  else if (s < .7) e = 1. - .2 * sin(3.1416 * (s - .52) / .18);
  else if (s < .9) e = 1. - .22 * sin(3.1416 * (s - .7) / .2);
  else e = 1. - .9 * (s - .9) / .1;
  return e;
}
float wingBone(vec2 q){
  vec2 k = vec2(1., .36); vec2 p = q * k, W = vec2(.45, .05) * k;
  float d = segD(p, vec2(0., .1) * k, W);
  d = min(d, segD(p, W, vec2(1., .12) * k));
  d = min(d, segD(p, W, vec2(.9, 1.) * k));
  d = min(d, segD(p, W, vec2(.7, 1.) * k));
  d = min(d, segD(p, W, vec2(.52, 1.) * k));
  return d;
}`;function u0(L,zt,Ve){const ue=[],Fe=[];for(let lt=0;lt<L.length;lt++)for(let wt=0;wt<=zt;wt++){const ut=wt/zt*at;ue.push(Math.cos(ut)*L[lt],Ve,Math.sin(ut)*L[lt])}const qt=zt+1;for(let lt=0;lt<L.length-1;lt++)for(let wt=0;wt<zt;wt++){const ut=lt*qt+wt;Fe.push(ut,ut+1,ut+qt+1,ut,ut+qt+1,ut+qt)}const Ft=new t.BufferGeometry;return Ft.setAttribute("position",new t.BufferAttribute(new Float32Array(ue),3)),Ft.setIndex(Fe),Ft}const K0=.815;var ta={id:"banyan-homecoming",name:"The Tree That Is a Forest",category:"wilderness",weirdness:.3,media:["air","interior"],async build(L){const zt=L.rng.fork("look"),Ve=zt(),ue=zt(),Fe=zt(),qt=zt(),Ft=L.vary||{},lt=Ft.hour||"any",wt=Ft.mood??Ve,ut=lt==="night"?"night":lt==="day"?"day":lt==="dawn"||lt==="golden"||wt<.5?"sunrise":wt<.8?"day":"night",he=qt<.45?"flush":qt<.72?"figs":"monsoon",Ht=ue>.5?"clear":ue>.25?"fog":"shower",We=Ve>.6,Je=Fe>.55,Vo=it(Ft.density??1,.7,1.3),xt=!!Ft.rare,Ut=L.quality?.detail??1,ct=ut==="night",yt=ut==="day",Wt=L.rng.fork("banyan-world"),Kt=L.noise,st=e=>L0(Q0("banyan-w-"+e+":"+L.seed));await L.yield();const Bt=await j0(L,{palette:l0,hour:ut,season:he,weather:Ht,density:it(Vo,.8,1.2)});await L.yield();const G=Bt.anchors,R=Bt.shared,Be=R.U,ft=R.mkMat,N=U0(G.flyThrough),Z=new t.Scene,At=G.sunDir.clone(),bt=new t.Vector3(At.x,0,At.z).normalize(),Fo=G.bounds.rx,Wo=G.bounds.rz,Ie=ct?"#182a48":yt?"#cbd6d0":"#e6cba8",h0=ct?{preset:"night",ground:Ie,horizon:"#1d3760",bake:!0,renderer:L.renderer,clouds:{coverage:.2},bodies:[{direction:At,size:2.5,phase:1,intensity:1.15,dark:.03,glow:.3,glowColor:"#9db8ff"}],key:0}:yt?{preset:"day",zenith:"#3d83c4",mid:"#8fbbd8",horizon:"#dde5da",ground:Ie,sunDirection:At,sunColor:"#fff0d2",sunSize:1.4,sunIntensity:11,clouds:!1,clouds2:{coverage:.5,opacity:.4,stretch:1}}:{preset:"dawn",zenith:"#2f80ac",mid:"#8fcdc2",horizon:"#f6cc9e",ground:Ie,horizonPow:5.5,midPow:1.15,stars:0,scatterColor:"#ffb872",scatter:.6,scatterPow:4,sunDirection:At,sunColor:"#ffd49a",sunSize:1.7,sunIntensity:11,sunGlow:.75,clouds:!1,clouds2:{coverage:.55,lit:"#ffd2c2",shade:"#c4aab8",opacity:.5,stretch:1,wind:[.006,.002]}},de=T0({rng:L.rng,...h0});Z.add(de.object);const Bo=new t.Color(Ie);Z.fog=new t.FogExp2(Bo,32e-5),Z.add(Bt.object),await L.yield();const d0=`
      varying vec3 vP, vN, vC; varying vec2 vUv;
      ${R.GL_FOG_V}
      void main(){
        vP = position; vN = normal; vUv = uv;
        #ifdef USE_COLOR
          vC = color;
        #else
          vC = vec3(1.);
        #endif
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,f0=(yt?.22:1)*(Ht==="fog"?1.3:1),v0=ct?new t.Color(.1,.16,.27):yt?new t.Color(.8,.84,.82):new t.Color("#F3D9B8").multiplyScalar(.98),Io=he==="monsoon"?1:he==="figs"?.45:.25,to={uOut:{value:new t.Vector4(f0,ct?1:0,Ht==="shower"?1:0,Io)},uDome:{value:new t.Vector2(Fo,Wo)},uMistC:{value:v0},uSkyC:{value:de.horizonColor.clone()}};{const e=u0([0,300,420,560,760,1050,1500,2200,3300,5e3,8200],64,-.25),o=ft({uniforms:{...to},vertexShader:d0,fragmentShader:`
          varying vec3 vP, vN, vC; varying vec2 vUv;
          uniform vec4 uOut; uniform vec2 uDome; uniform vec3 uMistC, uSkyC;
          ${R.GL_COMMON}
          ${R.GL_FOG_F}
          float inDome(vec2 q, float k){ return 1. - smoothstep(k - .08, k, length(q / uDome)); }
          void main(){
            vec2 p = vP.xz; float rr = length(p / uDome);
            if (rr < .9) discard;
            vec3 v = vP - uCam; float d = length(v); vec3 vd = v / max(d, 1e-3);
            float nd = 1. - smoothstep(70., 320., d);
            // fields on a warped lattice, half of them split into strips
            vec2 w = p + (vec2(vnoise(p * .0035), vnoise(p * .0035 + 7.3)) - .5) * 240.;
            vec2 g = w / 185.; vec2 gi = floor(g), gf = fract(g);
            float split = step(.5, hash21(gi + 3.7));
            float id = fract(hash21(gi) + step(.5, gf.x) * split * .37);
            float e = min(min(gf.y, 1. - gf.y), min(gf.x, 1. - gf.x)); e = min(e, mix(1., abs(gf.x - .5), split));
            vec3 a = mix(vec3(.23, .16, .10), vec3(.36, .29, .15), smoothstep(.2, .3, id));          // fallow earth, stubble
            a = mix(a, vec3(.15, .21, .08), smoothstep(.5, .58, id));                                   // rough grass
            a = mix(a, vec3(.09, .19, .07), smoothstep(.8, .86, id));                                   // young crop
            a = mix(a, vec3(.12, .22, .07) * (.8 + .4 * id), uOut.w * .6);                              // after rain everything greens
            float fur = sin((gf.x * cos(id * 6.28) + gf.y * sin(id * 6.28)) * 190.) * step(id, .3);    // plough lines, near only
            a *= 1. + .12 * fur * nd;
            a = mix(a, vec3(.05, .09, .04), (1. - smoothstep(.012, .05, e)) * .7);                      // bunds and hedges
            a *= .68 + .64 * fbm2(p * .011);
            a *= 1. + nd * ((vnoise(p * .33) - .5) * .7 + (vnoise(p * 1.6) - .5) * .4);                 // tussocks under the wings
            a = mix(a, vec3(.17, .21, .08) * (.7 + .6 * vnoise(p * .06)), 1. - smoothstep(1.04, 1.45, rr));   // rank grass round the tree
            // the river
            float zc = -1560. + 170. * sin(p.x / 640.) + 60. * sin(p.x / 210. + 1.3);
            float rv = abs(p.y - zc);
            float bars = smoothstep(.42, .6, fbm2(vec2(p.x * .004, (p.y - zc) * .013) + 5.));
            float water = (1. - smoothstep(125., 150., rv)) * (1. - bars * .9);
            a = mix(a, vec3(.5, .42, .3), (1. - smoothstep(165., 215., rv)) * .85);
            // light: low sun raking rough ground, the dome's shadow thrown far across the fields
            float sl = 1. / max(uSunDir.y / max(length(uSunDir.xz), .05), .06);
            float shd = max(max(inDome(p + uSunH.xz * 8. * sl, 1.), inDome(p + uSunH.xz * 16. * sl, .96)), inDome(p + uSunH.xz * 25. * sl, .86));
            float sunK = clamp(uSunDir.y + .17, 0., .6) * (.75 + .5 * vnoise(p * .045));
            vec3 lit = uSunCol * sunK * (1. - shd * .92) + uSkyAmb * .95 + uShade * .3;
            vec3 col = a * lit * mix(vec3(1.), vec3(.14, .2, .35), uOut.y);                              // by night the fields are dim blue-grey
            vec3 R = reflect(vd, vec3(0., 1., 0.));
            float gl = max(dot(R, uSunDir), 0.); gl *= gl; gl *= gl; gl *= gl; gl *= gl;
            vec3 wcol = uSkyC * .82 + uSunCol * gl * gl * 1.5;
            col = mix(col, wcol, water);
            // mist lying in bands on the fields, thickest over the water
            float mb = smoothstep(.34, .72, fbm2(p * vec2(.0017, .0042) + vec2(uHall.z * .007, 3.)));
            mb = max(mb, (1. - smoothstep(100., 420., rv)) * .8);
            float ma = uOut.x * mb * smoothstep(70., 520., d) * .62;
            col = mix(col, uMistC * (1. + .25 * max(dot(vd, uSunH), 0.)), min(ma, .85));
            gl_FragColor = vec4(col, 1.);
            #include <fog_fragment>
          }`}),s=new t.Mesh(e,o);s.frustumCulled=!1,Z.add(s)}await L.yield();{const o=[],s=[],n=[],r=Bo.clone(),i=ct?new t.Color(.03,.06,.13):yt?new t.Color(.42,.55,.66):new t.Color(.5,.52,.6);for(let p=0;p<2;p++){const M=p?5600:7e3,w=o.length/3,c=Wt.range(0,100),l=r.clone().lerp(i,p?.62:.4);for(let x=0;x<=160;x++){const v=x/160*at,f=Math.cos(v)*M,h=Math.sin(v)*M,S=Kt.fbm2(Math.cos(v)*2.2+c,Math.sin(v)*2.2-c,4),y=(p?60:110)+(p?150:210)*Math.max(0,S+.25)+30*Kt.n2(v*9+c,1.5);if(o.push(f,-20,h,f,Math.max(8,y),h),s.push(r.r,r.g,r.b,l.r,l.g,l.b),x<160){const C=w+x*2;n.push(C,C+2,C+3,C,C+3,C+1)}}}const m=new t.BufferGeometry;m.setAttribute("position",new t.BufferAttribute(new Float32Array(o),3)),m.setAttribute("color",new t.BufferAttribute(new Float32Array(s),3)),m.setIndex(n);const A=new t.Mesh(m,new t.MeshBasicMaterial({vertexColors:!0,fog:!1,side:t.DoubleSide}));A.frustumCulled=!1,Z.add(A)}{const e=[2.6,5.6,9.5].map(p=>u0([330,520,800,1300,2200,3800],48,p)),o=[],s=[],n=[];let r=0;e.forEach((p,M)=>{const w=p.attributes.position.array,c=p.index.array;for(let l=0;l<w.length;l+=3)o.push(w[l],w[l+1],w[l+2]),s.push(M);for(let l=0;l<c.length;l++)n.push(c[l]+r);r+=w.length/3,p.dispose()});const i=new t.BufferGeometry;i.setAttribute("position",new t.BufferAttribute(new Float32Array(o),3)),i.setAttribute("aL",new t.BufferAttribute(new Float32Array(s),1)),i.setIndex(n);const m=ft({fog:!1,transparent:!0,depthWrite:!1,side:t.DoubleSide,uniforms:{...to},vertexShader:`
          attribute float aL; varying vec3 vP; varying float vL;
          void main(){ vP = position; vL = aL; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,fragmentShader:`
          varying vec3 vP; varying float vL;
          uniform vec4 uOut; uniform vec2 uDome; uniform vec3 uMistC;
          ${R.GL_COMMON}
          void main(){
            vec2 p = vP.xz; vec3 v = vP - uCam; float d = length(v); vec3 vd = v / max(d, 1e-3);
            float t = uHall.z;
            float n = fbm2(p * vec2(.0021, .0052) + vec2(t * .009 + vL * 3.1, vL * 7.7 - t * .003));
            float n2 = vnoise(p * .019 + vec2(-t * .03, vL * 5.));
            float band = smoothstep(.36 + .05 * vL, .7, n) * (.6 + .4 * n2);
            float a = uOut.x * band * (.34 - .07 * vL);
            a *= smoothstep(1.03, 1.3, length(p / uDome));                       // none inside the tree
            a *= smoothstep(18., 80., d) * (1. - smoothstep(2400., 3700., length(p)));
            a *= smoothstep(.0, .12, abs(vd.y));                                  // a sheet seen edge-on is not a line
            vec3 col = uMistC * (1.02 + .3 * max(dot(vd, uSunH), 0.)) + uSunCol * .03;
            gl_FragColor = vec4(col, clamp(a, 0., .7));
          }`}),A=new t.Mesh(i,m);A.frustumCulled=!1,A.renderOrder=3,Z.add(A)}await L.yield();const _o=Math.max(.1,At.y/Math.max(.05,Math.hypot(At.x,At.z))),_e=[],eo=(e,o,s,n,r,i,m,A,p)=>{const M=e.count,w=m+1;for(let c=0;c<i.length;c++){const l=i[Math.max(0,c-1)],x=i[Math.min(i.length-1,c+1)];let v=-(x[1]-l[1]),f=x[0]-l[0];const h=Math.hypot(v,f)||1;v/=h,f/=h;for(let S=0;S<=m;S++){const y=S%m/m*at,C=1+p(c,S%m),B=i[c][0]*C*r,_=A(c,S%m);e.v(o+Math.cos(y)*B,s+i[c][1]*r,n+Math.sin(y)*B,Math.cos(y)*v,f,Math.sin(y)*v,0,i[c][1],_[0],_[1],_[2])}}for(let c=0;c<i.length-1;c++)for(let l=0;l<m;l++){const x=M+c*w+l;e.quad(x,x+1,x+w+1,x+w)}},Do=ft({vertexColors:!0,side:t.DoubleSide,uniforms:{...to},vertexShader:`
        uniform vec4 uHall;
        varying vec3 vP, vN, vC; varying float vH;
        ${R.GL_FOG_V}
        void main(){
          vec4 wp = instanceMatrix * vec4(position, 1.);
          vec3 org = instanceMatrix[3].xyz; float sc = length(instanceMatrix[1].xyz);
          float sw = uv.y * uv.y * sc;
          wp.x += sin(uHall.z * 1.3 + org.x * .13 + org.z * .11 + uv.y * 2.) * .03 * sw;
          wp.z += cos(uHall.z * 1.1 + org.z * .17 + position.x * 3.) * .022 * sw;
          vP = wp.xyz; vN = normalize(mat3(instanceMatrix) * normal + vec3(0., 1e-4, 0.));
          vC = color * (.75 + .5 * fract(org.x * .37 + org.z * .71)); vH = uv.y;
          vec4 mvPosition = modelViewMatrix * wp;
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        varying vec3 vP, vN, vC; varying float vH;
        uniform vec4 uOut; uniform vec3 uMistC;
        ${R.GL_COMMON}
        ${R.GL_FOG_F}
        void main(){
          vec3 v = vP - uCam; float d = length(v); vec3 vd = v / max(d, 1e-3);
          vec3 N = normalize(vN);
          float n = vnoise(vP.xz * 1.9 + vP.y * 1.3), n2 = vnoise(vP.xz * 6.3 + vP.y * 4.1);
          float cr = step(.79, vH), cl = vnoise(vP.xz * .85 + 3.) * .65 + vnoise(vP.xz * 2.4 + 8.) * .35;      // the flat crown is sprays of small leaf with gaps between: dappled, ragged, not a disc
          if (cr > .5 && d < 420. && cl < .34) discard;
          vec3 a = vC * (.62 + .5 * n + .3 * n2 * (1. - smoothstep(40., 140., d))) * ${yt?".7":"1."} * mix(1., .42 + 1.05 * cl, cr);
          a = mix(a, a * vec3(.3, .5, .8), uOut.y);
          float dif = clamp(dot(N, uSunDir) * .75 + .25, 0., 1.);
          float thru = max(dot(vd, uSunDir), 0.);
          vec3 lit = uSunCol * (dif * .8 + .45 * thru * thru * step(.7, vH)) + uSkyAmb * (.5 + .4 * N.y) + uShade * .3;
          vec3 col = a * lit * mix(.4, 1., smoothstep(0., .45, vH));
          float m = uOut.x * (1. - smoothstep(.5, 8.5, vP.y)) * smoothstep(50., 380., d) * .7;
          col = mix(col, uMistC, m);
          gl_FragColor = vec4(col, 1.);
          #include <fog_fragment>
        }`});{const e=new R.Store,o=[0,0,0],s=(d,P)=>{const F=.8-.3*Math.sin(P);return o[0]=.075*F,o[1]=.052*F,o[2]=.036*F,o};R.loft(e,(d,P)=>{P[0]=.06*Math.sin(d*2.4),P[1]=d*.82,P[2]=.03*d},d=>.036*(1-.5*d)+.02*Math.exp(-d*9),[0,.2,.6,1],5,s,0,.82);for(let d=0;d<3;d++){const P=d*2.1+.4,F=Math.cos(P)*.34,H=Math.sin(P)*.34;R.loft(e,(X,ot)=>{ot[0]=J(.055,F,X),ot[1]=J(.46,.84,Math.sqrt(X)),ot[2]=J(.016,H,X)},X=>.016*(1-.4*X),[0,.5,1],4,s,0,.8)}const n=Io>.6?[.07,.17,.04]:[.11,.165,.05],r=d=>{const P=d<3?1:d<4?.62:.3;return o[0]=n[0]*P,o[1]=n[1]*P,o[2]=n[2]*P,o},i=[[.02,1],[.24,.988],[.42,.955],[.56,.895],[.52,.835],[.3,.8],[.02,.81]],m=d=>(P,F)=>.2*Kt.n2(P*1.7+d,F*2.3-d);eo(e,0,0,0,1,i,8,r,m(1)),eo(e,.36,.33,.2,.56,i,6,r,m(7));const A=e.geometry(),p=new R.Store;eo(p,0,0,0,1,[[.03,1],[.5,.82],[.66,.42],[.42,.02]],6,d=>{const P=d<2?1:d<3?.55:.25;return o[0]=.085*P,o[1]=.12*P,o[2]=.05*P,o},(d,P)=>.3*Kt.n2(d*2.1+3,P*1.9));const w=p.geometry();await L.yield();const c=Math.round(170*(.5+.5*Ut)),l=Math.round(620*Ut),x=Math.round(18*(.5+.5*Ut)),v=new t.InstancedMesh(A,Do,c+x),f=new t.InstancedMesh(w,Do,l),h=new t.Matrix4,S=new t.Quaternion,y=new t.Vector3,C=new t.Vector3,B=new t.Vector3(0,1,0),_=N.pointAt(0),z=(d,P,F=Wt)=>{for(let H=0;H<20;H++){let X,ot;if(d===0){const gt=F.range(0,at),Yt=1.035+.5*F()*F();X=Math.cos(gt)*Fo*Yt,ot=Math.sin(gt)*Wo*Yt}else if(d===1)X=_.x+F.range(-150,190),ot=_.z+F.range(-260,60);else{const gt=F.range(0,at),Yt=380+1500*F();X=Math.cos(gt)*Yt*1.25,ot=Math.sin(gt)*Yt}if(!(R.rho(X,ot)<1.035)&&!(d===2&&Kt.n2(X*.004,ot*.004)<-.15))return P[0]=X,P[1]=ot,!0}return!1},u=[0,0],k=[];let Q=0;for(let d=0;d<c;d++){if(!z(d%4===0?1:d%4===1?0:2,u))continue;const P=Wt.range(5.5,10.5),F=Wt.range(.95,1.5);S.setFromAxisAngle(B,Wt.range(0,at)),y.set(P*F,P,P*F),C.set(u[0],-.3,u[1]),!(Math.hypot(u[0],u[1])>950)&&(v.setMatrixAt(Q++,h.compose(C,S,y)),k.push(u[0],u[1],P,.5*P*F))}{const d=st("entry");for(let P=0;P<x;P++){if(!z(1,u,d))continue;const F=d.range(5.2,8.2),H=d.range(1.05,1.45);S.setFromAxisAngle(B,d.range(0,at)),y.set(F*H,F,F*H),C.set(u[0],-.3,u[1]),v.setMatrixAt(Q++,h.compose(C,S,y)),k.push(u[0],u[1],F,.5*F*H)}}v.count=Q,v.instanceMatrix.needsUpdate=!0,v.frustumCulled=!1,Z.add(v),_e.push(v);let I=0;for(let d=0;d<l;d++){if(!z(d%3===0?1:d%3===1?0:2,u))continue;const P=Wt.range(.9,2.6),F=Wt.range(1.1,2.2);S.setFromAxisAngle(B,Wt.range(0,at)),y.set(P*F,P,P*F),C.set(u[0],-.3,u[1]),!(Math.hypot(u[0],u[1])>950)&&(f.setMatrixAt(I++,h.compose(C,S,y)),d%2===0&&k.push(u[0],u[1],P*.7,.6*P*F))}f.count=I,f.instanceMatrix.needsUpdate=!0,f.frustumCulled=!1,Z.add(f),_e.push(f),await L.yield();const T=k.length/4,Y=new Float32Array(T*12),V=new Float32Array(T*8),q=new Uint32Array(T*6),b=-bt.x,W=-bt.z,O=-W,a=b;for(let d=0;d<T;d++){const P=k[d*4],F=k[d*4+1],H=k[d*4+2],X=k[d*4+3],ot=Math.min(.9*H/_o,70),gt=X+Math.min(.12*H/_o,12)+ot*.5,Yt=P+b*ot*.5,H0=F+W*ot*.5,ce=[[-1,-1],[1,-1],[1,1],[-1,1]];for(let dt=0;dt<4;dt++)Y[(d*4+dt)*3]=Yt+b*gt*ce[dt][1]+O*X*ce[dt][0],Y[(d*4+dt)*3+1]=.12,Y[(d*4+dt)*3+2]=H0+W*gt*ce[dt][1]+a*X*ce[dt][0],V[(d*4+dt)*2]=ce[dt][0],V[(d*4+dt)*2+1]=ce[dt][1];q.set([d*4,d*4+1,d*4+2,d*4,d*4+2,d*4+3],d*6)}const g=new t.BufferGeometry;g.setAttribute("position",new t.BufferAttribute(Y,3)),g.setAttribute("uv",new t.BufferAttribute(V,2)),g.setIndex(new t.BufferAttribute(q,1));const K=new t.ShaderMaterial({transparent:!0,depthWrite:!1,side:t.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,blending:t.CustomBlending,blendSrc:t.ZeroFactor,blendDst:t.SrcColorFactor,blendEquation:t.AddEquation,uniforms:{uCam:Be.uCam,uK:{value:ct?.3:yt?.5:.62}},vertexShader:"varying vec2 vUv; varying vec3 vP; void main(){ vUv = uv; vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
          varying vec2 vUv; varying vec3 vP; uniform vec3 uCam; uniform float uK;
          void main(){
            float tr = (1. - smoothstep(.04, .16, abs(vUv.x))) * step(vUv.y, .2) * .8;          // the trunk's line
            float cr = 1. - smoothstep(.45, 1., length(vec2(vUv.x, (vUv.y - .45) * 1.8)));          // the crown's pool
            float a = max(tr, cr) * uK * (1. - smoothstep(500., 1500., length(vP - uCam)));
            gl_FragColor = vec4(mix(vec3(1.), vec3(.36, .46, .56), a), 1.);
          }`}),D=new t.Mesh(g,K);D.frustumCulled=!1,D.renderOrder=1,Z.add(D)}await L.yield();const E={n:Math.floor(N.length/2)+1,x:null,y:null,z:null};{E.x=new Float32Array(E.n),E.y=new Float32Array(E.n),E.z=new Float32Array(E.n);const e=new t.Vector3;for(let o=0;o<E.n;o++)N.posAtDist(Math.min(o*2,N.length),e),E.x[o]=e.x,E.y[o]=e.y,E.z[o]=e.z}const fe={d:0,i:0},$t=(e,o,s=0,n=N.length)=>{let r=1e18,i=0;for(let m=Math.max(0,Math.floor(s/2)),A=Math.min(E.n-1,Math.ceil(n/2));m<=A;m++){const p=E.x[m]-e,M=E.z[m]-o,w=p*p+M*M;w<r&&(r=w,i=m)}return fe.d=Math.sqrt(r),fe.i=i,i*2},oo=[],Oo=(e,o,s,n,r,i)=>oo.push({attr:e,i:o,x:s,z:n,yaw:r,lim:i,cur:0});function m0(e,o,s){const n=1-Math.exp(-e*3.5);for(let r=0;r<oo.length;r++){const i=oo[r],m=o-i.x,A=s-i.z,p=Math.hypot(m,A),M=i.yaw-Math.atan2(-A,m),w=it(Math.atan2(Math.sin(M),Math.cos(M)),-i.lim,i.lim),c=1-U(55,80,p);i.cur+=(w-i.cur)*(e>0?n:1),i.attr.array[i.i*4+2]=i.cur,i.attr.array[i.i*4+3]=c,i.attr.needsUpdate=!0}}const ao=[],St=(e,o)=>{let s=1e9,n=-1e9,r=1e9,i=-1e9,m=0;for(const w of o)s=Math.min(s,w.x),n=Math.max(n,w.x),r=Math.min(r,w.z),i=Math.max(i,w.z);const A=(s+n)/2,p=(r+i)/2;for(const w of o)m=Math.max(m,Math.hypot(w.x-A,w.z-p));const M={o:e,x:A,z:p,r:m+3};return ao.push(M),M},no=(e,o)=>{const s=[],n=e.instanceMatrix.array;for(let r=0;r<o;r++)s.push({x:n[r*16+12],z:n[r*16+14]});return s},Go=new t.Color(l0[2]),Et=new t.Color(.42,.22,.06);ct&&Go.set(.15,.19,.29);const p0=`
      vec3 membrane(vec3 P, vec3 N, vec3 vd, vec2 sc, float sv, float own){
        float bone = 1. - smoothstep(.011, .03, wingBone(sc));
        bone = max(bone, 1. - smoothstep(.03, .1, sc.y + .25 * max(sc.x - .45, 0.)));
        float vein = vnoise(sc * vec2(46., 15.)) * .6 + vnoise(sc * vec2(13., 5.) + 3.) * .4;
        float th = max(dot(vd, uSunDir), 0.); th = th * mix(sqrt(th), th, own);         // a wing between us and the sun glows
        vec3 amb = uSkyAmb * .55 + uShade * .6 + uBounce * .3;
        vec3 col = vec3(.03, .022, .018) * (amb + uSunCol * sv * .35 * max(dot(N, uSunDir), 0.));
        // our own hand: the fingers fan from the wrist, the web between them is brightest midway
        float ray = abs(fract(atan(sc.y * .36 - .02, sc.x - .45 + 1e-4) * 2.6 + .15) - .5);
        bone = max(bone, (1. - smoothstep(.025, .075, ray)) * step(.47, sc.x) * own);
        float skin = (1. - bone) * (.72 + .5 * vein) * mix(1., (.3 + .8 * smoothstep(0., .5, ray)) * (.6 + .9 * vein), own);
        col += uAmberC * uSunCol * sv * skin * (.015 + .85 * th);                 // dark wings; amber only where the wing stands between us and the sun
        col += vec3(.2, .13, .09) * (uSkyAmb + uShade) * .22 * skin;              // away from it the skin is dusky brown, the bones darker in it
        float rimM = 1. - abs(dot(N, vd));
        col += (uSkyAmb * .5 + uSunCol * .5) * uWx.w * (bone * .07 + rimM * rimM * rimM * .16);          // by night: a cold silver edge
        return col;
      }`,Xt={uAmberC:{value:Go},uSq:{value:new t.Vector3(0,0,1)}},Lt=40,ve=11,De=[];let Zt,No,Ro;{const e=[],o=[],s=[],n=[],r=[];let i=0;const m=(h,S,y,C,B,_,z,u,k,Q,I,T,Y)=>(e.push(h,S,y),o.push(C,B,_),s.push(z,u,k),n.push(Q,I,T,Y),i++),A=[[-.19,.004,0],[-.165,.022,0],[-.13,.036,0],[-.095,.03,0],[-.05,.052,1],[0,.058,1],[.06,.05,2],[.115,.03,2],[.15,.006,2]],p=[[.16,.08,.035],[Et.r,Et.g,Et.b],[.035,.027,.022]],M=7;A.forEach((h,S)=>{for(let y=0;y<=M;y++){const C=y/M*at,B=Math.cos(C),_=Math.sin(C),z=p[h[2]],u=_<-.3?.5:1;m(B*h[1]*1.1,_*h[1]*.9+(S<4?.012:0),h[0],B,_,0,z[0]*u,z[1]*u,z[2]*u,0,0,0,0)}});for(let h=0;h<A.length-1;h++)for(let S=0;S<M;S++){const y=h*(M+1)+S;r.push(y,y+1,y+M+2,y,y+M+2,y+M+1)}for(const h of[-1,1]){const S=m(h*.018,.04,-.125,0,1,0,.05,.03,.02,0,0,0,0),y=m(h*.036,.082,-.112,0,1,0,.05,.03,.02,0,0,0,0),C=m(h*.042,.032,-.098,0,1,0,.05,.03,.02,0,0,0,0);r.push(S,y,C)}const w=9,c=3;for(const h of[-1,1]){const S=i;for(let y=0;y<=w;y++)for(let C=0;C<=c;C++){const B=y/w,_=C/c,z=-.05-.085*Math.sin(Math.min(B/.45,1)*Math.PI/2)+Math.max(0,B-.45)*.3,u=.14-.1*B;m(h*(.04+B*.61),.012,J(z,u,_),0,1,0,.03,.022,.018,B,h,_,1)}for(let y=0;y<w;y++)for(let C=0;C<c;C++){const B=S+y*(c+1)+C;r.push(B,B+c+1,B+c+2,B,B+c+2,B+1)}}const l=new t.BufferGeometry;l.setAttribute("position",new t.BufferAttribute(new Float32Array(e),3)),l.setAttribute("normal",new t.BufferAttribute(new Float32Array(o),3)),l.setAttribute("color",new t.BufferAttribute(new Float32Array(s),3)),l.setAttribute("aW",new t.BufferAttribute(new Float32Array(n),4)),l.setIndex(r);const x=new Float32Array((Lt+ve)*4),v=st("squadron");for(let h=0;h<Lt;h++){let S=null;for(let y=0;!S;y++){const C=h%4===3,B=C?v.range(-3.2,.6):v.range(2.6,6.8),_=C?5.2:.2+.56*B,z=C?2.6:.15+.34*B,u=v.range(-_,_),k=v.range(-z,z),Q=Math.hypot(B,u,k),I=1.15*Math.pow(.985,y);if(Q<2.4||Q>7||Math.hypot(u,k*.6)<1.3||Math.hypot(B,Math.min(Math.abs(u),2.3+.36*Math.abs(u)),k*.6)<2.1)continue;let T=!0;for(let Y=0;Y<De.length&&T;Y++){const V=De[Y];Math.abs(V.ahead-B)<3.2&&Math.hypot(V.side-u,V.up-k)<I&&(T=!1)}T&&(S=[B,u,k])}De.push({ahead:S[0],side:S[1],up:S[2],back:-v.range(.9,3.1),open:S[0]>.6&&v.chance(.25)?1:0,give:0,dA:v.range(.4,1.1),dS:v.range(.3,.65),dU:v.range(.25,.5),tilt:v.range(.08,.36),w1:v.range(.35,.8),p1:v.range(0,at),w2:v.range(.25,.6),p2:v.range(0,at)}),x.set([v(),v.range(2.3,3),v(),v.range(.94,1.2)],h*4)}{const h=st("foxbeats");for(let S=Lt;S<Lt+ve;S++)x.set([h(),h.range(2.3,3),h(),1.3],S*4)}l.setAttribute("aI",new t.InstancedBufferAttribute(x,4));const f=ft({vertexColors:!0,side:t.DoubleSide,uniforms:Xt,defines:{SQUADRON:1},vertexShader:`
          attribute vec4 aW, aI;
          uniform vec4 uHall; uniform vec3 uSq;
          varying vec3 vP, vN, vC; varying vec4 vW;
          ${R.GL_FOG_V}
          void main(){
            float t = uHall.z, sd = aI.x, wt = t * 6.2832 * aI.y + sd * 40.;
            float gl = max(smoothstep(.6, .92, sin(t * .6 + sd * 31.)), uSq.y);
            float amp = .78 * (1. - .82 * gl) * (1. - .6 * uSq.x);
            float a1 = .12 + amp * sin(wt), a2 = amp * .8 * sin(wt - 1.) - .22 - .45 * uSq.x;
            vec3 p = position, n = normal;
            if (aW.w > .5) {
              float fold = 1. - .2 * uSq.x, dd = aW.x * .61 * fold, L1 = .27 * fold;
              float r1 = min(dd, L1), r2 = max(dd - L1, 0.), ao = a1 + a2;
              p.x = aW.y * (.04 + r1 * cos(a1) + r2 * cos(ao)); p.y = .012 + r1 * sin(a1) + r2 * sin(ao);
              p.z += uSq.x * aW.x * .1;
              float an = dd > L1 ? ao : a1; n = vec3(-aW.y * sin(an), cos(an), 0.);
            } else p.y -= .02 * amp * sin(wt);
            p *= aI.w;
            vec4 wp = instanceMatrix * vec4(p, 1.);
            vP = wp.xyz; vN = normalize(mat3(instanceMatrix) * n + vec3(0., 1e-4, 0.)); vC = color; vW = aW;
            vec4 mvPosition = modelViewMatrix * wp;
            gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          varying vec3 vP, vN, vC; varying vec4 vW; uniform vec3 uAmberC, uSq;
          ${R.GL_COMMON}
          ${Y0}
          ${p0}
          ${R.GL_FOG_F}
          void main(){
            vec3 v = vP - uCam; float d = length(v); vec3 vd = v / max(d, 1e-3);
            float above = smoothstep(15., 24., vP.y), sv = mix(sunVis(vP), 1., above);
            sv = max(sv, (1. - smoothstep(uOc.z - 4., uOc.z + 2., length(vP.xz - uOc.xy))) * smoothstep(6., 12., vP.y));      // in the well, above the rim's shadow
            vec3 N = normalize(vN); if (dot(N, vd) > 0.) N = -N;
            vec3 col;
            if (vW.w > .5) {
              if (vW.z > wingCut(vW.x)) discard;
              col = membrane(vP, N, vd, vW.xz, sv, 0.);
            } else {
              float dif = clamp(dot(N, uSunDir) * .7 + .3, 0., 1.), rim = 1. - max(dot(N, -vd), 0.);
              col = max(vC, vec3(0.)) * (uSkyAmb * .7 + uShade * .7 + uSunCol * sv * (dif + rim * rim * rim * .9)) + uSkyAmb * uWx.w * rim * rim * .6;
            }
            #ifdef SQUADRON
            // the squadron under the roof is never plain black (the design, light: shade 'lifted by warm bounce off the leaf floor,
            // never black'). Where the bat itself is under the roof (by its own height, the measure this shader reads the hall's
            // shade and the hall's haze by: 'above', just over this) the bounce off the litter reaches it from below at the
            // hall's own strength (uBounce, as on a face that looks down in hallLight, in sun and in shade alike): on the fur
            // by the fur's own colour, so the mantle shows chestnut; through the thin skin of the web by the skin's own dusky
            // brown (as membrane() has it), the finger bones staying dark in it, so a wing in the hall's shade is dark brown
            float under = 1. - above;
            col += (vW.w > .5 ? vec3(.2, .13, .09) * smoothstep(.011, .03, wingBone(vW.xz)) : max(vC, vec3(0.))) * uBounce * under;
            #endif
            col = mix(hallHaze(col, vP), col, above);
            gl_FragColor = vec4(col, 1.);
            #include <fog_fragment>
          }`});Zt=new t.InstancedMesh(l,f,Lt+ve),Zt.frustumCulled=!1,Z.add(Zt),No=l,Ro=f.fragmentShader}const qo=(()=>{const e=[],o=[],s=[],n=[],r=[];let i=0;const m=(x,v,f,h,S,y,C,B,_,z,u,k,Q)=>(e.push(x,v,f),o.push(h,S,y),s.push(C,B,_),n.push(z,u,k,Q),i++),A=[[-.19,.004,0],[-.13,.036,0],[-.095,.03,0],[-.05,.052,1],[0,.058,1],[.06,.05,2],[.15,.006,2]],p=[[.16,.08,.035],[Et.r,Et.g,Et.b],[.035,.027,.022]],M=6;A.forEach((x,v)=>{for(let f=0;f<=M;f++){const h=f/M*at,S=Math.cos(h),y=Math.sin(h),C=p[x[2]],B=y<-.3?.5:1;m(S*x[1]*1.1,y*x[1]*.9+(v<3?.012:0),x[0],S,y,0,C[0]*B,C[1]*B,C[2]*B,0,0,0,0)}});for(let x=0;x<A.length-1;x++)for(let v=0;v<M;v++){const f=x*(M+1)+v;r.push(f,f+1,f+M+2,f,f+M+2,f+M+1)}for(const x of[-1,1]){const v=m(x*.018,.04,-.125,0,1,0,.05,.03,.02,0,0,0,0),f=m(x*.036,.082,-.112,0,1,0,.05,.03,.02,0,0,0,0),h=m(x*.042,.032,-.098,0,1,0,.05,.03,.02,0,0,0,0);r.push(v,f,h)}const w=6,c=2;for(const x of[-1,1]){const v=i;for(let f=0;f<=w;f++)for(let h=0;h<=c;h++){const S=f/w,y=h/c,C=-.05-.085*Math.sin(Math.min(S/.45,1)*Math.PI/2)+Math.max(0,S-.45)*.3,B=.14-.1*S;m(x*(.04+S*.61),.012,J(C,B,y),0,1,0,.03,.022,.018,S,x,y,1)}for(let f=0;f<w;f++)for(let h=0;h<c;h++){const S=v+f*(c+1)+h;r.push(S,S+c+1,S+c+2,S,S+c+2,S+1)}}const l=new t.BufferGeometry;return l.setAttribute("position",new t.BufferAttribute(new Float32Array(e),3)),l.setAttribute("normal",new t.BufferAttribute(new Float32Array(o),3)),l.setAttribute("color",new t.BufferAttribute(new Float32Array(s),3)),l.setAttribute("aW",new t.BufferAttribute(new Float32Array(n),4)),l.setIndex(r),l})();await L.yield();const Oe={uWf:{value:new t.Vector4(1,.6,.9,1)},uWk:{value:new t.Vector4(0,0,0,0)},uWingM:{value:new t.Matrix4},uAmberC:Xt.uAmberC};let Jt;{const e=new t.BufferGeometry;e.setAttribute("position",new t.BufferAttribute(new Float32Array([0,0,-1,1,0,-1,1,1,-1,0,1,-1,0,0,1,1,0,1,1,1,1,0,1,1]),3)),e.setIndex([0,1,2,0,2,3,4,6,5,4,7,6]);const o=ft({side:t.DoubleSide,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:Oe,vertexShader:`
          uniform vec4 uWf, uWk; uniform mat4 uWingM;
          varying vec2 vQ; varying vec3 vPw; varying float vS;
          void main(){
            // measured in frame heights (of a 16:9 frame's, on a tall screen) from the corner: x in from the side edge, y up
            // from the bottom edge. The wing comes in along its own arm on the downstroke and goes back out along it on the upstroke
            float sd = position.z, k = uWk.x, unit = uWf.w * .5625, sc = 1. - .42 * uWk.z;
            vec2 q = position.xy * vec2(.36, .24) - vec2(.04, .03);
            vec2 at = (q * sc - (1. - k) * vec2(.33, .21)) * unit;
            vec3 cs = vec3(sd * (uWf.x - at.x), at.y - uWf.y, -uWf.z);
            vQ = q; vS = sd; vPw = (uWingM * vec4(cs, 1.)).xyz;
            gl_Position = projectionMatrix * vec4(cs, 1.);
          }`,fragmentShader:`
          varying vec2 vQ; varying vec3 vPw; varying float vS; uniform vec3 uAmberC;
          ${R.GL_COMMON}
          float segW(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0., 1.); return length(pa - ba * h); }
          void main(){
            // the forearm comes up out of the corner to the wrist (W) with its thumb claw; the long finger runs on from it, two
            // lesser fingers fan below; the web is only the narrow wedge under that leading edge, scalloped from tip to tip
            vec2 W = vec2(.11, .105), q = vQ - W;
            float rho = length(q), ph = atan(q.y, q.x + 1e-5);
            float dArm = segW(vQ, W, vec2(-.05, -.03));
            float d1 = segW(vQ, W, vec2(.272, .13)), d2 = segW(vQ, W, vec2(.25, .055)), d3 = segW(vQ, W, vec2(.172, -.03));
            float dClaw = min(segW(vQ, W, W + vec2(.006, .03)), segW(vQ, W + vec2(.006, .03), W + vec2(.024, .039)));
            float a1 = .155, a2 = -.343, a3 = -1.14, aArm = -2.44, t, edge;
            if (ph > a2) { t = clamp((a1 - ph) / (a1 - a2), 0., 1.); edge = mix(.164, .149, t) * (1. - .17 * sin(3.1416 * t)); }
            else if (ph > a3) { t = (a2 - ph) / (a2 - a3); edge = mix(.149, .2, t) * (1. - .2 * sin(3.1416 * t)); }
            else edge = 9.;
            float web = smoothstep(aArm, aArm + .04, ph) * (1. - smoothstep(a1 - .03, a1, ph)) * (1. - smoothstep(edge - .004, edge, rho));
            float taper = 1. - .55 * clamp(rho / .16, 0., 1.);
            float bone = max(1. - smoothstep(.0075, .0105, dArm), 1. - smoothstep(.0052 * taper, .0052 * taper + .0028, d1));
            bone = max(bone, 1. - smoothstep(.003 * taper, .003 * taper + .0024, min(d2, d3)));
            bone = max(bone, max(1. - smoothstep(.0028, .005, dClaw), 1. - smoothstep(.0105, .013, rho)));
            if (max(bone, web) < .02) discard;
            float vein = vnoise(vQ * vec2(95., 140.) + 3.) * .55 + vnoise(vQ * vec2(210., 120.)) * .45;
            float mid = smoothstep(0., .016, min(min(d1, d2), d3)) * smoothstep(0., .02, dArm) * smoothstep(0., .02, edge - rho);       // the web is thinnest between the bones and inside its hem
            vec3 v = vPw - uCam; vec3 vd = v / max(length(v), 1e-3);
            float sv = mix(sunVis(uCam), 1., smoothstep(15., 24., uCam.y));
            sv = max(sv, (1. - smoothstep(uOc.z - 4., uOc.z + 2., length(uCam.xz - uOc.xy))) * smoothstep(6., 12., uCam.y));
            float th = max(dot(vd, uSunDir), 0.); th *= sqrt(th);
            vec3 amb = uSkyAmb * .6 + uShade * .65 + uBounce * .4;
            vec3 cb = vec3(.028, .021, .017) * (amb + uSunCol * sv * .3);
            vec3 cw = vec3(.17, .105, .07) * amb * (.3 + .3 * vein) + uAmberC * uSunCol * sv * th * (.4 + .6 * mid) * (.6 + .6 * vein);
            float aw = web * mix(.7, .46, mid) * (.9 + .2 * vein);
            gl_FragColor = vec4(mix(cw, cb, bone), max(bone, aw));
          }`});Jt=new t.Mesh(e,o),Jt.frustumCulled=!1,Jt.renderOrder=8,Jt.visible=!1,Z.add(Jt)}const vt={dive:0,glide:0,bend:0,pitch:0},g0=e=>{N.tangentAtDist(Math.max(0,e-8),et),N.tangentAtDist(Math.min(N.length,e+8),pt),vt.bend=Math.atan2(et.x*pt.z-et.z*pt.x,et.x*pt.x+et.z*pt.z)/16,N.tangentAtDist(e,et),vt.pitch=et.y,vt.dive=U(.2,.4,-et.y),vt.glide=U(.0135,.017,Math.abs(vt.bend))*(1-vt.dive)};await L.yield();let Ge;{const e=Math.round(640*(.6+.4*Ut)),o=st("pour"),s=e*20,n=new Float32Array(s*3),r=new Float32Array(s*4),i=new Float32Array(s*2),m=new Uint32Array(e*30);for(let M=0;M<e;M++){const w=o(),c=(o()+o()+o()-1.5)/1.5,l=o()+o()-1;for(let x=0;x<5;x++)for(let v=0;v<4;v++){const f=(M*5+x)*4+v,h=x<4,S=x&1,y=h&&S?-.1:-1,C=h?S?1:-.1:1;n[f*3]=c,n[f*3+1]=l,n[f*3+2]=h?0:1,r[f*4]=w,r[f*4+1]=x<2?-1:1,r[f*4+2]=c,r[f*4+3]=l,i[f*2]=v===0||v===3?y:C,i[f*2+1]=v<2?-1:1}for(let x=0;x<5;x++){const v=(M*5+x)*4;m.set([v,v+1,v+2,v,v+2,v+3],(M*5+x)*6)}}const A=new t.BufferGeometry;A.setAttribute("position",new t.BufferAttribute(n,3)),A.setAttribute("aQ",new t.BufferAttribute(r,4)),A.setAttribute("uv",new t.BufferAttribute(i,2)),A.setIndex(new t.BufferAttribute(m,1));const p=ft({side:t.DoubleSide,uniforms:{uAmberC:Xt.uAmberC,uMantleC:{value:ct?new t.Color(.2,.17,.14):new t.Color(.62,.36,.1)}},vertexShader:`
          attribute vec4 aQ;
          uniform vec4 uHall, uOc; uniform vec3 uCam;
          varying vec3 vP, vW;
          ${R.GL_FOG_V}
          const float PR[10] = float[10](58., 41., 28., 18.5, 15., 15.5, 17.5, 22., 33., 50.);
          const float PY[10] = float[10](30., 21., 14.5, 11.2, 9.8, 8.6, 7.6, 7.2, 7.6, 8.6);
          float crom(float a, float b, float c, float d, float t){ return b + .5 * t * (c - a + t * (2. * a - 5. * b + 4. * c - d + t * (3. * (b - c) + d - a))); }
          vec3 pourAt(float s){
            float f = clamp(s, 0., 1.) * 9.; int i = int(min(floor(f), 8.)); float t = f - float(i);
            int i0 = max(i - 1, 0), i3 = min(i + 2, 9);
            float r = crom(PR[i0], PR[i], PR[i + 1], PR[i3], t), y = crom(PY[i0], PY[i], PY[i + 1], PY[i3], t);
            float th = -.35 - 5.76 * s;
            return vec3(uOc.x + cos(th) * r, y, uOc.y + sin(th) * r);
          }
          void main(){
            float sd = aQ.x, t = uHall.z;
            float s = fract(sd * 7.31 + t * .05 * (.85 + .3 * fract(sd * 13.7)));
            s = s * (.62 + .38 * s);
            vec3 p0 = pourAt(s), p1 = pourAt(s + .012);
            vec3 A = p1 - p0; A = A / max(length(A), 1e-4);
            vec3 Rl = vec3(-A.z, 0., A.x); Rl = Rl / max(length(Rl), 1e-3); vec3 D = cross(Rl, A);
            // (the stream is some nine metres wide and five deep: a column of separate animals, not a rope)
            float wid = 4.6 + 1.2 * (1. - smoothstep(0., .07, s)) + 2.2 * smoothstep(.8, 1., s);
            vec3 F = p0 + Rl * (aQ.z * wid + .5 * sin(t * .9 + sd * 40.)) + D * (aQ.w * wid * .56 + .35 * sin(t * 1.3 + sd * 70.));
            float vis = smoothstep(0., .04, s) * (1. - smoothstep(.9, 1., s));
            float wt = t * (15. + 4. * sd) + sd * 100.;
            float gl = smoothstep(.55, .9, sin(t * .8 + sd * 31.)), amp = .85 * (1. - .75 * gl);
            float a1 = .12 + amp * sin(wt), a2 = a1 + amp * .75 * sin(wt - 1.1) - .25;
            vec3 P;
            if (position.z < .5) {
              float s01 = uv.x * .5 + .5, r1 = min(s01, .45), r2 = max(s01 - .45, 0.);
              P = F + A * (-uv.y * .2 - .07 * s01) + ((Rl * aQ.y * cos(a1) + D * sin(a1)) * r1 + (Rl * aQ.y * cos(a2) + D * sin(a2)) * r2) * .68;
              vW = vec3(s01, uv.y, 0.);
            } else {
              vec3 Wd = cross(A, F - uCam); Wd = Wd / max(length(Wd), 1e-3);
              P = F + A * (uv.y * .2 + .03) + Wd * uv.x * .09 - D * .02 * amp * sin(wt);
              vW = vec3(uv.x, uv.y, 1.);
            }
            float dc = length(uCam - F);
            P = F + (P - F) * vis * smoothstep(3., 6.5, dc) * 1.15 * clamp(dc / 34., 1., 1.25);
            vP = P;
            vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
            gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          varying vec3 vP, vW; uniform vec3 uAmberC, uMantleC;
          ${R.GL_COMMON}
          ${R.GL_FOG_F}
          void main(){
            vec3 v = vP - uCam; vec3 vd = v / max(length(v), 1e-3);
            float above = smoothstep(15., 24., vP.y), sv = mix(sunVis(vP), 1., above);
            sv = max(sv, (1. - smoothstep(uOc.z - 4., uOc.z + 2., length(vP.xz - uOc.xy))) * smoothstep(6., 12., vP.y));
            vec3 amb = uSkyAmb * .6 + uShade * .6, col;
            vec3 Ng = normalize(cross(dFdx(vP), dFdy(vP)) + vec3(0., 1e-7, 0.));
            if (vW.z > .5) {
              // the body from above or below: head and muzzle forward, two ears, the mantle across the shoulders
              float x = abs(vW.x), y = vW.y;
              float trunk = 1. - (y + .3) * (y + .3) / .56 - x * x / .62;
              float head = 1. - (y - .66) * (y - .66) / .075 - x * x / .34;
              float ear = 1. - (y - .84) * (y - .84) / .02 - (x - .46) * (x - .46) / .03;
              if (max(max(trunk, head), ear) < 0.) discard;
              float mant = smoothstep(-.08, .1, y) * (1. - smoothstep(.36, .5, y)) * step(head, trunk + .2);
              vec3 alb = mix(vec3(.07, .04, .025), uMantleC, mant);
              alb = mix(alb, vec3(.02, .016, .014), smoothstep(.42, .56, y));
              float round = 1. - x * x * .7;
              col = alb * (amb * 1.1 + uSunCol * sv * (.25 + .75 * round));
            } else {
              float sp = vW.x, c = vW.y;
              float lead = -.9 + .55 * abs(sp - .42), trail = .8 - .5 * sp - .24 * abs(sin(sp * 7.854));
              if (c < lead || c > trail || sp > .985) discard;
              float armB = 1. - smoothstep(.02, .16, c - lead);
              float ang = atan(c + .62, sp - .42 + 1e-4);
              float fing = (1. - smoothstep(.03, .1, abs(fract(ang * 1.9 + .25) - .5))) * step(.42, sp);
              float bone = max(armB, fing);
              float th = max(dot(vd, uSunDir), 0.); th *= sqrt(th);
              // the web is thin skin: where the sun stands on the far side of it from us it glows through, amber, the
              // bones dark in it; where the sun is on our side it is dusky brown
              float nv = dot(Ng, -vd), ns = dot(Ng, uSunDir), thru = step(nv * ns, 0.) * abs(ns);
              col = vec3(.024, .019, .017) * (amb + uSunCol * sv * (.35 + .5 * abs(ns) * (1. - step(nv * ns, 0.))));
              col += (1. - bone) * (uAmberC * uSunCol * sv * (.065 + .85 * th + .8 * thru) + vec3(.2, .13, .09) * amb * .26);
              col += bone * vec3(.34, .2, .1) * uSunCol * sv * .1 * abs(ns);                // the arm and fingers catch the sun as a rim
            }
            col = mix(hallHaze(col, vP), col, above);
            gl_FragColor = vec4(col, 1.);
            #include <fog_fragment>
          }`});Ge=new t.Mesh(A,p),Ge.frustumCulled=!1,Z.add(Ge)}const nt={a:new t.Vector3,d:new t.Vector3,b:new t.Vector3,len:430,off:[]};{const e=G.oculus,o=st("foxes"),s=2*e.radius;nt.d.subVectors(G.stream.to,G.stream.from).setY(0).normalize(),nt.b.set(-nt.d.z,0,nt.d.x),nt.a.copy(e.center).addScaledVector(nt.d,-(e.radius+4+nt.len)),nt.a.y=e.rimY+8.5;for(let n=0;n<ve;n++)nt.off.push([(n<4?0:n<8?1:2)*nt.len/3+o.range(-11,11),o.range(-s/2,s/2),o.range(-1.3,1.3),o.range(.4,.9),o.range(0,at)])}await L.yield();const $=(e,o,s,n,r,i,m,A=0)=>{const p=n.length,M=n.map((f,h)=>h/(p-1)),w=e.count,c=(f,h,S)=>{const y=it(h,0,1)*(p-1),C=Math.min(p-2,Math.floor(y));return J(f[C][S],f[C+1][S],y-C)},l=(f,h)=>{h[0]=c(n,f,0),h[1]=c(n,f,1),h[2]=c(n,f,2)},x=f=>{const h=it(f,0,1)*(p-1),S=Math.min(p-2,Math.floor(h));return J(r[S],r[S+1],h-S)},v=A?(f,h)=>x(f)*(1+A*Math.sin(h*3+f*17)+.6*A*Math.sin(h*5-f*29)):x;R.loft(e,l,v,M,i,m,1,1);for(let f=w;f<e.count;f++)o.push(s)},me=(e,o)=>{const s=e.geometry();return s.setAttribute("aPart",new t.BufferAttribute(new Float32Array(o),1)),s},Ne=[0,0,0],j=(e,o=1)=>(Ne[0]=e[0]*o,Ne[1]=e[1]*o,Ne[2]=e[2]*o,Ne),It=We?[.24,.16,.09]:[.2,.2,.19],te=We?[.4,.31,.2]:[.46,.44,.38],pe=We?[.4,.2,.15]:[.022,.02,.02],Ho=We?.6:1.05,Re=(e,o={},s="")=>ft({vertexColors:!0,side:t.DoubleSide,uniforms:o,vertexShader:`
        attribute float aPart; attribute vec4 aI;
        uniform vec4 uHall;
        varying vec3 vP, vN, vC, vO; varying float vRim, vPart;
        ${R.GL_FOG_V}
        vec2 rot2(vec2 p, float a){ float c = cos(a), s = sin(a); return vec2(p.x * c - p.y * s, p.x * s + p.y * c); }
        void main(){
          float t = uHall.z, sd = aI.x; vec3 p = position, n = normal; vRim = 0.; vO = position; vPart = aPart;
          ${e}
          vec4 wp = instanceMatrix * vec4(p, 1.);
          vP = wp.xyz; vN = normalize(mat3(instanceMatrix) * n + vec3(0., 1e-4, 0.)); vC = color;
          vec4 mvPosition = modelViewMatrix * wp;
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        varying vec3 vP, vN, vC, vO; varying float vRim, vPart;
        ${R.GL_COMMON}
        ${R.GL_FOG_F}
        void main(){
          vec3 v = vP - uCam; vec3 vd = v / max(length(v), 1e-3);
          vec3 N = normalize(vN); if (dot(N, vd) > 0.) N = -N;
          float fl = .8 + .4 * vnoise(vP.xz * 43. + vP.y * 31.);
          float rim = 1. - max(dot(N, -vd), 0.); rim *= rim;
          float sv = sunVis(vP);
          vec3 alb = max(vC, vec3(0.));
          ${s}
          vec3 col = alb * fl * (hallLight(vP, N, 1.) * 1.15 + uSunCol * sv * rim * .7 + (uSkyAmb + uShade) * rim * .35);
          // a bounding langur: its shade side takes the blue-grey of the hall's air, its sun side is silver, its outline is lit
          col += vRim * alb * fl * (uSkyAmb * .3 + uHazeCol * .3 + uShade * .2);
          col += vRim * rim * (.3 + .7 * max(N.y, 0.)) * (uSunCol * .05 + uSkyAmb * .22 + uHazeCol * .36);
          col = hallHaze(col, vP);
          gl_FragColor = vec4(col, 1.);
          #include <fog_fragment>
        }`}),so=Re(`
      vRim = aI.y;
      if (aPart > .5 && aPart < 1.5) {                       // tail: hangs and swings when sitting, streams when leaping
        float w = uv.y * uv.y;
        if (aI.y < .5) { p.z += (sin(t * 1.7 + sd * 20. - uv.y * 2.) * .15 + sin(t * 7.3 + sd * 9.) * .03 * smoothstep(.6, 1., sin(t * .4 + sd * 30.))) * w; p.x += cos(t * 1.3 + sd * 11.) * .07 * w; }
        else { p.y += sin(t * 9. + sd * 7. - uv.y * 4.) * .1 * w; p.z += cos(t * 7. - uv.y * 3.) * .05 * w; }
      } else if (aPart > 1.5 && aI.y < .5) {                 // head: looks about; turns to us and follows us when we are near
        float a = mix(.75 * sin(t * .45 + sd * 17.) * smoothstep(-.2, .7, sin(t * .21 + sd * 5.)), aI.z + .1 * sin(t * .8 + sd * 17.), aI.w);
        p.xz = rot2(p.xz - vec2(.1, 0.), a) + vec2(.1, 0.); n.xz = rot2(n.xz, a);
      }`),ro=[],io=[];let Qt,ge=0;{const e=new R.Store,o=[],s=(a,g)=>j(Math.cos(g)>.25?te:It,.85+.15*Math.cos(g)),n=(a,g)=>j(It,.84+.16*Math.cos(g*2+a*5)),r=(a,g)=>j(te,.86+.1*Math.sin(g*5)),i=(a,g)=>a>.93?j(pe):j(It,.8+.14*Math.cos(g*2+a*7)),m=()=>j(pe,1.5);$(e,o,0,[[-.02,.1,0],[.01,.22,0],[.05,.38,0],[.09,.5,0],[.11,.57,0]],[.1,.135,.125,.105,.06],9,s,.05),$(e,o,2,[[.035,.6,0],[.085,.632,0],[.13,.648,0],[.168,.646,0]],[.05,.1,.105,.04],9,r,.1),$(e,o,2,[[.05,.63,0],[.1,.645,0],[.16,.65,0],[.215,.63,0],[.25,.61,0]],[.02,.078,.086,.06,.028],8,(a,g)=>a>.5&&(Math.cos(g)<.75||a>.72)?j(pe):a>.5?j(It):j(te,.95));for(const a of[-1,1])$(e,o,0,[[0,.1,a*.09],[.14,.22,a*.13],[.25,.3,a*.14]],[.084,.07,.05],8,n,.07),$(e,o,0,[[.25,.3,a*.14],[.27,.14,a*.135],[.27,.035,a*.13]],[.048,.037,.03],8,i,.05),$(e,o,0,[[.262,.04,a*.13],[.33,.018,a*.133],[.39,.014,a*.138],[.415,.01,a*.14]],[.03,.033,.026,.01],6,m),$(e,o,0,[[.1,.47,a*.115],[.15,.34,a*.16],[.17,.26,a*.165]],[.052,.042,.035],8,n,.07),$(e,o,0,[[.17,.26,a*.165],[.23,.29,a*.15],[.29,.315,a*.14]],[.036,.03,.025],8,i,.05),$(e,o,0,[[.285,.314,a*.14],[.322,.305,a*.137],[.35,.272,a*.134],[.357,.24,a*.133]],[.022,.027,.022,.008],6,m);const A=[],p=[];for(let a=0;a<=7;a++){const g=a/7;A.push([-.1-.1*Math.sin(g*2.4),.07-g*Ho+.05*Math.sin(g*3.14),0]),p.push(a===7?.012:.03-.008*g+(a===6?.012:0))}$(e,o,1,A,p,6,a=>j(a>.85?te:It,.9));const M=me(e,o),w=new R.Store,c=[],l=(a,g)=>j(It,.82+.14*Math.cos(g*2+a*5)),x=(a,g)=>j(te,1.05+.1*Math.sin(g*5)),v=(a,g)=>a>.76?j(pe):j(It,.64+.1*Math.cos(g));$(w,c,0,[[-.32,0,0],[-.14,.05,0],[.08,.06,0],[.27,.035,0],[.36,.05,0]],[.1,.135,.145,.125,.085],9,l,.07),$(w,c,0,[[.3,.06,0],[.35,.085,0],[.4,.1,0],[.445,.1,0]],[.07,.13,.138,.05],9,x,.1),$(w,c,0,[[.36,.085,0],[.42,.1,0],[.47,.1,0],[.52,.088,0],[.555,.075,0]],[.03,.08,.092,.07,.034],8,(a,g)=>a>.36?j(pe):x(a,g));for(const a of[-1,1])$(w,c,0,[[.24,-.01,a*.1],[.4,-.18,a*.14],[.52,-.29,a*.13],[.62,-.335,a*.12]],[.075,.058,.044,.04],6,v,.06),$(w,c,0,[[-.25,-.01,a*.09],[-.37,-.19,a*.15],[-.52,-.24,a*.14],[-.68,-.34,a*.12]],[.1,.08,.052,.042],6,v,.06);const f=[],h=[];for(let a=0;a<=7;a++){const g=a/7;f.push([-.34-g*Ho,.03+.2*Math.sin(g*2.6),0]),h.push(a===7?.016:.04-.01*g+(a===6?.016:0))}$(w,c,1,f,h,5,a=>j(a>.85?te:It,a>.85?1:.9));const S=me(w,c);await L.yield();const y=[],C=G.bough,B=(a,g)=>g.set(J(C.a.x,C.b.x,a),J(C.a.y,C.b.y,a)-C.sag*Math.sin(Math.PI*a)+C.r*.9,J(C.a.z,C.b.z,a)),_=new t.Vector3,z=st("troop"),u=G.pillars,k=(a,g,K,D)=>{const d=a+K*5,P=g+D*5;let F=30;for(const H of u)F=Math.min(F,Math.hypot(H.x-d,H.z-P)-H.r);return F},Q=(a,g,K,D,d,P)=>{let F=-D,H=K;const X=Math.hypot(F,H)||1;return F/=X,H/=X,(z.chance(.3)?F*bt.x+H*bt.z:k(a,g,F,H)-k(a,g,-F,-H))<0!=!!P&&(F=-F,H=-H),Math.atan2(-H,F)+d};for(const a of[.03,.97])B(a,_),y.push(_.x,_.y-.06,_.z,Q(_.x,_.z,C.b.x-C.a.x,C.b.z-C.a.z,z.range(-.4,.4),!1),z.range(1.15,1.3));{const a=[];for(const g of G.columns){if(g.pole||g.ghost||g.r<=.75)continue;let K=0,D=0;const d=g.r*1.52+.06;for(let P=0;P<8;P++){const F=P*at/8,H=g.x+Math.cos(F)*d,X=g.z+Math.sin(F)*d,ot=G.litAt(H,R.floorY(H,X)+1.5,X)*(.55+.45*Math.max(0,Math.cos(F)*bt.x+Math.sin(F)*bt.z));ot>K&&(K=ot,D=F)}K>.45&&a.push([g.x+Math.cos(D)*d,g.z+Math.sin(D)*d,D])}z.shuffle(a);for(let g=0;g<Math.min(2,a.length);g++){const[K,D,d]=a[g];y.push(K,R.floorY(K,D)+1.12,D,-d+z.range(-.3,.3),z.range(1.1,1.3))}}{const a=G.feats,g=z.int(0,a.rootSeats.length-1),K=z.int(0,a.rootSeats.length-1);a.rootSeats.forEach((P,F)=>{const H=F===K?.7:z.range(1.18,1.3);y.push(P.x,P.y-.1*H,P.z,Q(P.x,P.z,P.ax,P.az,P.turn,F===g),H)});const D=a.langurLimb,d=[];for(;d.length<4;){const P=z.range(.24,.78);d.every(F=>Math.abs(F-P)>.09)&&d.push(P)}d.forEach((P,F)=>{const H=F===2?.7:z.range(1.18,1.3);D.at(P,_),y.push(_.x,_.y+D.r*.8-.1*H,_.z,Q(_.x,_.z,D.b.x-D.a.x,D.b.z-D.a.z,z.range(-.5,.5),!1),H)})}const I=G.portalSeat.facing;for(const a of G.archFeet){const g=G.portalSeat.position.x-a.x,K=G.portalSeat.position.z-a.z,D=Math.hypot(g,K)||1;let d=I.x*.8+g/D*.6,P=I.z*.8+K/D*.6;const F=Math.hypot(d,P)||1;d/=F,P/=F;const H=a.x+d*1.95,X=a.z+P*1.95;y.push(H,R.floorY(H,X)+1.3,X,Math.atan2(-P,d),1.3)}ge=y.length/5;const T=new t.InstancedMesh(M,so,ge),Y=new Float32Array(ge*4),V=new t.Matrix4,q=new t.Quaternion,b=new t.Vector3,W=new t.Vector3(0,1,0);for(let a=0;a<ge;a++){const g=y[a*5+4];q.setFromAxisAngle(W,y[a*5+3]),b.set(g,g,g),_.set(y[a*5],y[a*5+1],y[a*5+2]),T.setMatrixAt(a,V.compose(_,q,b)),Y.set([z(),0,0,0],a*4)}const O=new t.InstancedBufferAttribute(Y,4);M.setAttribute("aI",O);for(let a=0;a<ge;a++)Oo(O,a,y[a*5],y[a*5+2],y[a*5+3],1.35);T.instanceMatrix.needsUpdate=!0,T.frustumCulled=!1,Z.add(T),io.push(T),Qt=new t.InstancedMesh(S,so,3),S.setAttribute("aI",new t.InstancedBufferAttribute(new Float32Array([.1,1,0,0,.5,1,0,0,.83,1,0,0]),4)),Qt.frustumCulled=!1,Z.add(Qt),St([Qt],[C.a,C.b]);{const a=st("leapers");for(let g=0;g<3;g++)ro.push({u0:.531+.0042*g,hops:6,hopH:a.range(.8,1.1)})}}const ee=new t.Vector3,oe=new t.Vector3,rt=new t.Vector3,qe=new t.Vector3,ae=new t.Vector3,He=new t.Matrix4;function co(e,o,s){const n=G.bough,r=it((o-e.u0)/.03,0,1),i=r*e.hops,m=Math.min(e.hops-1,Math.floor(i)),A=i-m,p=A*A*(3-2*A)*.55+A*.45,M=J(.1,.9,(m+p)/e.hops);return s.set(J(n.a.x,n.b.x,M),J(n.a.y,n.b.y,M)-n.sag*Math.sin(Math.PI*M)+n.r+.44+4*e.hopH*A*(1-A),J(n.a.z,n.b.z,M)),r}function w0(e){for(let o=0;o<3;o++){const s=ro[o];co(s,e,ee),co(s,e+.0012,oe),rt.subVectors(oe,ee),rt.lengthSq()<1e-8&&rt.subVectors(G.bough.b,G.bough.a),rt.normalize(),ae.set(-rt.z,0,rt.x).normalize(),qe.crossVectors(ae,rt),He.makeBasis(rt,qe,ae).scale(oe.set(1.3,1.3,1.3)).setPosition(ee),Qt.setMatrixAt(o,He)}Qt.instanceMatrix.needsUpdate=!0}await L.yield();const Pt=[.006,.17,.3],Uo=[.1,.17,.05],lo=[.3,.25,.15],Tt=[.2,.155,.1],x0=[.46,.41,.31],uo=[.34,.3,.22],Lo=e=>{const o=new R.Store,s=[];$(o,s,0,[[-.3,.5,0],[-.18,.56,0],[0,.6,0],[.14,.62,0],[.24,.66,0]],[.05,.13,.16,.14,.075],8,(n,r)=>e?j(Math.cos(r)<-.2?x0:Tt,.8+.3*Math.abs(Math.sin(r*3+n*9))):n>.62?j(Pt,1.1):Math.abs(Math.sin(r))>.55&&Math.cos(r)>-.6?j(lo,.6+.6*Math.abs(Math.sin(n*40))):j(Uo)),$(o,s,2,[[.2,.68,0],[.275,.8,0],[.235,.95,0],[.27,1.06,0]],e?[.072,.046,.036,.034]:[.09,.06,.042,.038],8,(n,r)=>e?j(n>.45?[.07,.2,.12]:Tt):j(Pt,1.3+.5*Math.cos(r))),$(o,s,3,[[.235,1.07,0],[.28,1.09,0],[.33,1.085,0],[.38,1.07,0],[.425,1.06,0]],[.018,.04,.043,.022,.005],7,(n,r)=>n>.72?j(uo):n>.3&&Math.abs(Math.sin(r))>.7?j([.7,.7,.64]):j(e?Tt:Pt,1.2));for(let n=-1;n<=1;n++){const r=o.v(.275,1.12,0,1,0,0,0,1,...j(e?Tt:Pt,.9)),i=o.v(.25+n*.03,1.25,n*.035-.012,1,0,0,0,1,...j(e?Tt:Pt,1.4)),m=o.v(.25+n*.03,1.25,n*.035+.012,1,0,0,0,1,...j(e?Tt:Pt,1.4));o.i.push(r,i,m),s.push(3,3,3)}for(const n of[-1,1])$(o,s,0,[[0,.5,n*.07],[.03,.26,n*.075],[0,.03,n*.08],[.08,0,n*.08]],[.032,.016,.014,.011],4,()=>j(uo,.8));if(!e){$(o,s,0,[[.1,.5,0],[.19,.57,0],[.26,.66,0],[.26,.76,0]],[.07,.125,.115,.07],8,()=>j(Pt,1.35));for(const n of[-1,1])$(o,s,0,[[.14,.64,n*.12],[0,.57,n*.19],[-.18,.46,n*.2],[-.34,.33,n*.16]],[.04,.085,.07,.02],6,(r,i)=>r>.6?j([.4,.17,.05],.9):j(lo,.35+.95*Math.abs(Math.sin(r*34+i*2))));$(o,s,0,[[-.22,.55,0],[-.34,.74,0],[-.4,.98,0]],[.1,.12,.02],6,()=>j([.16,.14,.12],.9))}return e&&$(o,s,0,[[-.26,.52,0],[-.45,.47,0],[-.64,.4,0]],[.08,.055,.015],5,()=>j(Tt,.8)),me(o,s)},Qo=Re(`
      float pk = aI.y * smoothstep(.15, .85, sin(t * 1.1 + sd * 30.)) * (.82 + .18 * sin(t * 9. + sd * 5.));
      float nod = (1. - aI.y) * .12 * sin(t * .9 + sd * 12.);
      if (aPart > 1.5) {                                      // neck and head: pecking (hens) or the proud slow nod (cocks)
        float w = aPart > 2.5 ? 1. : uv.y;
        float a = -(pk * 1.85 + nod) * w;
        p.xy = rot2(p.xy - vec2(.2, .68), a) + vec2(.2, .68); n.xy = rot2(n.xy, a);
      }
      if (position.y > .4) { p.xy = rot2(p.xy - vec2(0., .5), -pk * .5) + vec2(0., .5); n.xy = rot2(n.xy, -pk * .5); }`),To=ft({side:t.DoubleSide,vertexShader:`
        attribute vec4 aI; attribute float aK;
        uniform vec4 uHall;
        varying vec3 vP, vN; varying vec2 vUv; varying float vK;
        ${R.GL_FOG_V}
        void main(){
          float t = uHall.z, sd = aI.x; vec3 p = position;
          if (aK < .5) p.x += .02 * uv.y * sin(t * 31. + uv.x * 60.) * (.35 + .65 * smoothstep(.1, .8, sin(t * .7 + sd * 9.)));     // the shiver
          else { p.y += sin(t * 7. - uv.y * 5.) * .07 * uv.y; p.z += sin(t * 4.3 - uv.y * 4.) * .05 * uv.y; }                    // the train streams
          vec4 wp = instanceMatrix * vec4(p, 1.);
          vP = wp.xyz; vN = normalize(mat3(instanceMatrix) * normal + vec3(0., 1e-4, 0.)); vUv = uv; vK = aK;
          vec4 mvPosition = modelViewMatrix * wp;
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        varying vec3 vP, vN; varying vec2 vUv; varying float vK;
        ${R.GL_COMMON}
        ${R.GL_FOG_F}
        void main(){
          float rho = vUv.y, x = vUv.x;
          if (rho > .985 - .03 * abs(sin(x * 88.)) * step(vK, .5)) discard;
          vec3 v = vP - uCam; float dist = length(v); vec3 vd = v / max(dist, 1e-3);
          float barb = abs(fract(x * 56.) - .5) * 2.;
          vec3 alb = mix(vec3(.02, .16, .06), vec3(.13, .2, .03), smoothstep(.2, .9, rho) * (.5 + .5 * vnoise(vec2(x * 30., rho * 9.))));
          alb *= .72 + .36 * barb;
          float k = floor(rho * 6. - .3), rk = (k + .8) / 6.;
          float nn = 8. + 4. * k, cell = fract(x * nn + .5 * mod(k, 2.)) - .5;
          vec2 q = vec2(cell / nn * 3.5 * rk, (rho - rk) * .75) / .043;
          float e = length(q) * step(.5, k + .6);
          e += 4. * step(k, -.5);
          alb = mix(alb, vec3(.42, .22, .03), 1. - smoothstep(.85, 1.2, e));                   // bronze halo
          alb = mix(alb, vec3(.0, .42, .4), 1. - smoothstep(.55, .72, e));                     // turquoise ring
          alb = mix(alb, vec3(.01, .02, .3), 1. - smoothstep(.3, .42, length(q + vec2(0., .12))));    // the blue eye
          alb = mix(alb, vec3(.01, .05, .09), 1. - smoothstep(.12, .28, rho));
          vec3 N = normalize(vN); if (dot(N, vd) > 0.) N = -N;
          float sv = sunVis(vP), thru = max(dot(vd, uSunDir), 0.);
          float sheen = max(dot(reflect(vd, N), uSunDir), 0.); sheen *= sheen;
          vec3 col = alb * (hallLight(vP, N, 1.) * .9 + uSunCol * sv * (.1 + .5 * thru * thru + .35 * sheen) + (uSkyAmb + uShade) * .3);
          col = hallHaze(col, vP);
          gl_FragColor = vec4(col, 1.);
          #include <fog_fragment>
        }`}),we=[];let xe,ye,be,Me;{const e=st("peafowl"),o=Lo(!1),s=Lo(!0),n=40,r=[.08,.26,.44,.62,.8,.93,1],i=1.16,m=[],A=[],p=[],M=[];for(let b=0;b<=n;b++)for(let W=0;W<r.length;W++){const O=(b/n-.5)*3.7,a=r[W];m.push(-.3+.22*a*a+.024*a*(b%2?1:-1)+.2*a*(1-Math.cos(O)),.62+a*i*Math.cos(O),a*i*Math.sin(O)),A.push(1,0,0),p.push(b/n,a)}for(let b=0;b<n;b++)for(let W=0;W<r.length-1;W++){const O=b*r.length+W;M.push(O,O+1,O+r.length+1,O,O+r.length+1,O+r.length)}const w=new t.BufferGeometry;w.setAttribute("position",new t.BufferAttribute(new Float32Array(m),3)),w.setAttribute("normal",new t.BufferAttribute(new Float32Array(A),3)),w.setAttribute("uv",new t.BufferAttribute(new Float32Array(p),2)),w.setAttribute("aK",new t.BufferAttribute(new Float32Array(p.length/2),1)),w.setIndex(M),w.computeVertexNormals(),w.setAttribute("aI",new t.InstancedBufferAttribute(new Float32Array([.2,0,0,0,.7,0,0,0]),4)),await L.yield();const c=new t.Matrix4,l=new t.Quaternion,x=new t.Vector3,v=new t.Vector3,f=new t.Vector3(0,1,0);xe=new t.InstancedMesh(o,Qo,2),ye=new t.InstancedMesh(w,To,2),o.setAttribute("aI",new t.InstancedBufferAttribute(new Float32Array([.2,0,0,0,.7,0,0,0]),4));const h=[];for(const b of["peacockB","peacockA"]){const W=G.stations[b],O=N.nearestXZ(W.x,W.z),a=N.pointAt(Math.max(0,O.u-.016));let g=Math.atan2(-(a.z-W.z),a.x-W.x);const K=Math.atan2(Math.sin(Math.atan2(-bt.z,bt.x)-g),Math.cos(Math.atan2(-bt.z,bt.x)-g));g+=.33*it(K,-1.4,1.4),b==="peacockA"?we.push({x:G.feats.perchA.x,y:G.feats.perchA.y-.04,z:G.feats.perchA.z,yaw:g,sd:e.range(0,at),s:1.25}):we.push({x:W.x,y:R.floorY(W.x,W.z)-.02,z:W.z,yaw:g,sd:e.range(0,at),s:1.2});for(let D=0;D<3;D++){const d=g+(D-1)*1.5+e.range(-.4,.4)+Math.PI*.15,P=e.range(2.6,4),F=W.x+Math.cos(d)*P,H=W.z-Math.sin(d)*P;h.push(F,R.floorY(F,H)-.02,H,e.range(0,at),e.range(1,1.15))}}const S=h.length/5,y=new t.InstancedMesh(s,Qo,S),C=new Float32Array(S*4);for(let b=0;b<S;b++){const W=h[b*5+4];l.setFromAxisAngle(f,h[b*5+3]),x.set(W,W,W),v.set(h[b*5],h[b*5+1],h[b*5+2]),y.setMatrixAt(b,c.compose(v,l,x)),C.set([e(),1,0,0],b*4)}s.setAttribute("aI",new t.InstancedBufferAttribute(C,4)),y.instanceMatrix.needsUpdate=!0;for(const b of[xe,ye,y])b.frustumCulled=!1,Z.add(b);St([xe,ye],we),St([y],no(y,S)),await L.yield();const B=new R.Store,_=[];$(B,_,0,[[-.3,0,0],[-.15,.02,0],[.05,.02,0],[.2,.03,0],[.3,.05,0]],[.06,.13,.15,.11,.06],8,b=>b>.6?j(Pt,1.1):j(Uo)),$(B,_,0,[[.28,.05,0],[.45,.11,0],[.6,.14,0],[.68,.15,0],[.75,.14,0]],[.06,.04,.035,.042,.006],7,b=>b>.9?j(uo):j(Pt,1.25));for(const b of[-1,1]){const W=B.count;for(let O=0;O<=4;O++)for(let a=0;a<=2;a++){const g=O/4,K=a/2,D=g>.45?[.42,.17,.05]:a===1?[.1,.09,.07]:lo;B.v(.22-K*(.5-.2*g)-g*.1,.06+.16*g,b*(.1+g*.78),0,1,0,g,g,D[0],D[1],D[2]),_.push(4)}for(let O=0;O<4;O++)for(let a=0;a<2;a++){const g=W+O*3+a;B.quad(g,g+3,g+4,g+1)}}const z=me(B,_);z.setAttribute("aI",new t.InstancedBufferAttribute(new Float32Array([.4,0,0,0]),4));const u=Re(`
        if (aPart > 3.5) { float w = uv.y; p.y += w * w * (.1 + .22 * sin(t * 11.) * smoothstep(.3, .9, sin(t * 1.3))); }`);be=new t.InstancedMesh(z,u,1),be.frustumCulled=!1,Z.add(be);const k=[],Q=[],I=[],T=[],Y=[],V=10;for(let b=0;b<2;b++)for(let W=0;W<=V;W++)for(let O=0;O<3;O++){const a=W/V,g=J(.08,.3,U(0,.7,a))*(1-.45*U(.8,1,a))*(b?.9:1);k.push(-.28-a*2.3,(b?(O-1)*g:0)-.14*a,b?0:(O-1)*g),Q.push(0,b?0:1,b?1:0),I.push(.36+O*.14+b*.03,.16+.82*a),T.push(1)}for(let b=0;b<2;b++)for(let W=0;W<V;W++)for(let O=0;O<2;O++){const a=b*(V+1)*3+W*3+O;Y.push(a,a+3,a+4,a,a+4,a+1)}const q=new t.BufferGeometry;q.setAttribute("position",new t.BufferAttribute(new Float32Array(k),3)),q.setAttribute("normal",new t.BufferAttribute(new Float32Array(Q),3)),q.setAttribute("uv",new t.BufferAttribute(new Float32Array(I),2)),q.setAttribute("aK",new t.BufferAttribute(new Float32Array(T),1)),q.setIndex(Y),q.setAttribute("aI",new t.InstancedBufferAttribute(new Float32Array([.4,0,0,0]),4)),Me=new t.InstancedMesh(q,To,1),Me.frustumCulled=!1,Z.add(Me)}const ho=new t.Matrix4,jo=new t.Quaternion,y0=new t.Vector3(1.38,1.38,1.38),b0=new t.Vector3,Yo=new t.Vector3(0,1,0);function M0(e){for(let o=0;o<2;o++){const s=we[o];jo.setFromAxisAngle(Yo,s.yaw+.3*Math.sin(e*.33+s.sd)+.06*Math.sin(e*2.1+s.sd)),ho.compose(b0.set(s.x,s.y,s.z),jo,y0.set(s.s,s.s,s.s)),xe.setMatrixAt(o,ho),ye.setMatrixAt(o,ho)}xe.instanceMatrix.needsUpdate=!0,ye.instanceMatrix.needsUpdate=!0}const fo=new t.Vector3,ze=new t.Vector3,$0=new t.Vector3,E0=new t.Vector3,_t=new t.Vector3,Ae=new t.Vector3,Se=new t.Vector3,vo=new t.Matrix4,ht={u0:.752,uX:.78,c:new t.Vector3,r:new t.Vector3};{await L.yield();let e=-1e9;const o=new t.Vector3,s=new t.Vector3,n=new t.Vector3;N.posAtDist(ht.uX*N.length+12,o);const r=G.pillars.filter(i=>Math.hypot(i.x-o.x,i.z-o.z)<34+i.r);for(const i of[12,11,13,10,14])for(const m of[0,.12,-.12,.24,-.24]){N.posAtDist(ht.uX*N.length+i,o),N.tangentAtDist(ht.uX*N.length+i,s),n.set(-s.z,0,s.x).normalize().applyAxisAngle(Yo,m);let A=1e9;for(let p=-12;p<=13;p++){const M=o.x+n.x*p,w=o.z+n.z*p;for(const c of r)A=Math.min(A,Math.hypot(M-c.x,w-c.z)-c.r)}A=Math.min(A,2.2)-Math.abs(m)-Math.abs(i-12)*.2,A>e&&(e=A,ht.c.copy(o),ht.r.copy(n))}}function Ko(e,o){const s=it(e,ht.u0,.83);o.copy(ht.c).addScaledVector(ht.r,Math.min(2.5+470*(s-ht.uX),13)),o.y=R.floorY(o.x,o.z)+J(12,.75,U(ht.u0,.812,s))}function z0(e){Ko(e,fo),Ko(e+.003,ze),_t.subVectors(ze,fo),_t.lengthSq()<1e-6&&_t.copy(ht.r),_t.normalize(),Se.set(-_t.z,0,_t.x).normalize(),Ae.crossVectors(Se,_t);const o=.6*(1-U(.795,.812,e))*U(ht.u0,ht.u0+.008,e);ze.copy(Ae).multiplyScalar(Math.cos(o)).addScaledVector(Se,Math.sin(o)),Se.multiplyScalar(Math.cos(o)).addScaledVector(Ae,-Math.sin(o)),Ae.copy(ze),vo.makeBasis(_t,Ae,Se).scale(ze.set(1.3,1.3,1.3)).setPosition(fo),be.setMatrixAt(0,vo),Me.setMatrixAt(0,vo),be.instanceMatrix.needsUpdate=!0,Me.instanceMatrix.needsUpdate=!0}await L.yield();{const e=st("tufts"),o=Math.round(2600*(.5+.5*Ut)),s=new t.Vector3,n=new t.Vector3,r=new Float32Array(o*24),i=new Float32Array(o*32),m=new Float32Array(o*16),A=new Uint32Array(o*12),p=G.courtyard.center,M=G.courtyard.radius;for(let x=0;x<o;x++){let v,f;if(x%5<3){const z=x%5<2?e.range(.262,.31):e.range(.836,.89),u=e.sign()*(.3+18*e()*e())+e.range(-1.5,1.5);N.pointAt(z,s),N.tangentAt(z,n),v=s.x-n.z*u,f=s.z+n.x*u}else{const z=e.range(0,at),u=(M+5)*Math.sqrt(e());v=p.x+Math.cos(z)*u,f=p.z+Math.sin(z)*u}const h=R.floorY(v,f)-.03,S=Kt.n2(v*.11,f*.11),y=0,C=e.range(.6,1.25)*(.6+.65*Math.max(0,S+.25))*2.1,B=e.range(0,Math.PI),_=e();for(let z=0;z<2;z++)for(let u=0;u<4;u++){const k=(x*2+z)*4+u;r[k*3]=v,r[k*3+1]=h,r[k*3+2]=f,i[k*4]=B+z*1.571,i[k*4+1]=C,i[k*4+2]=_,i[k*4+3]=y,m[k*2]=u===0||u===3?-1:1,m[k*2+1]=u<2?0:1}for(let z=0;z<2;z++){const u=(x*2+z)*4;A.set([u,u+1,u+2,u,u+2,u+3],(x*2+z)*6)}(x&1023)===0&&await L.yield()}const w=new t.BufferGeometry;w.setAttribute("position",new t.BufferAttribute(r,3)),w.setAttribute("aT",new t.BufferAttribute(i,4)),w.setAttribute("uv",new t.BufferAttribute(m,2)),w.setIndex(new t.BufferAttribute(A,1));const c=ft({side:t.DoubleSide,vertexShader:`
          attribute vec4 aT; uniform vec4 uHall;
          varying vec3 vP; varying vec2 vUv; varying vec2 vK;
          ${R.GL_FOG_V}
          void main(){
            float h = aT.y, sd = aT.z, t = uHall.z;
            vec3 r = vec3(cos(aT.x), 0., sin(aT.x));
            float gust = sin(dot(position.xz, vec2(.21, .17)) - t * 1.4) * .5 + .5;
            vec3 P = position + r * uv.x * h * mix(.55, .42, aT.w) + vec3(0., uv.y * h, 0.);
            P.xz += vec2(sin(t * 2.1 + sd * 40.), cos(t * 1.7 + sd * 23.)) * uv.y * uv.y * h * (.05 + .1 * gust);
            vP = P; vUv = uv; vK = vec2(aT.w, sd);
            vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
            gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          varying vec3 vP; varying vec2 vUv; varying vec2 vK;
          ${R.GL_COMMON}
          ${R.GL_FOG_F}
          void main(){
            float x = vUv.x, y = vUv.y; vec3 alb;
            {                                                  // a tussock: blades fanning from the root, straw-pale at the tips
              float far = smoothstep(10., 34., length(vP - uCam));                                  // far off the blades close up into one tuft: no speckle
              float bl = x / max(.25 + .75 * y, 1e-3) * 2.6 + vK.y * 7.;
              float w = abs(fract(bl) - .5), hgt = mix(.5 + .5 * hash11(floor(bl) + vK.y * 31.), .92, far * .7);
              if (w > mix(.34, .56, far) * (1. - y / hgt) || y > hgt || abs(x) > .25 + .75 * y) discard;
              alb = mix(vec3(.08, .12, .04), vec3(.4, .32, .14), smoothstep(.08, .8, y / hgt) * (.5 + .5 * fract(vK.y * 5.7)));
              alb *= (.8 + .4 * hash11(floor(bl) * 1.7 + vK.y * 3.)) * (.45 + .55 * smoothstep(0., .35, y));       // dark at the root
            }
            vec3 v = vP - uCam; vec3 vd = v / max(length(v), 1e-3);
            float thru = max(dot(vd, uSunDir), 0.);
            vec3 col = alb * (hallLight(vP, vec3(0., 1., 0.), .45 + .55 * y) * 1.15 + uSunCol * sunVis(vP) * (.22 + .42 * thru * thru)) * ${yt?".6":"1."};      // straw must not bleach under a high sun
            col = mix(col, col * vec3(.5, .74, .86), (1. - courtSun(vP)) * (1. - smoothstep(uOc.z - 2., uOc.z + 3., length(vP.xz - uOc.xy))));      // in the rim's shadow the grass is cool
            col = hallHaze(col, vP);
            gl_FragColor = vec4(col, 1.);
            #include <fog_fragment>
          }`}),l=new t.Mesh(w,c);l.frustumCulled=!1,Z.add(l)}await L.yield();{const e=[.34,.19,.085],o=[.62,.57,.47],s=[.09,.06,.04],n=[.5,.42,.3],r=z=>{const u=new R.Store,k=[],Q=()=>j(e);$(u,k,0,[[-.56,.8,0],[-.34,.82,0],[0,.79,0],[.3,.82,0],[.47,.88,0]],[.09,.2,.215,.2,.11],9,Q),$(u,k,2,[[.4,.86,0],[.52,1.03,0],[.6,1.2,0],[.64,1.28,0]],z?[.14,.1,.08,.07]:[.12,.08,.065,.06],8,Q),$(u,k,3,[[.6,1.29,0],[.68,1.32,0],[.78,1.29,0],[.88,1.24,0],[.935,1.215,0]],[.04,.078,.066,.042,.02],8,Q);for(const I of[-1,1]){const T=u.v(.64,1.37,I*.05,0,0,I,0,0,...j(e,.9)),Y=u.v(.58,1.5,I*.16,0,0,I,0,1,...j(o,.8)),V=u.v(.68,1.45,I*.15,0,0,I,1,1,...j(e,.8));u.i.push(T,Y,V),k.push(3,3,3),$(u,k,0,[[.33,.74,I*.1],[.34,.44,I*.1],[.32,.2,I*.1],[.34,0,I*.1]],[.075,.042,.028,.03],5,Q),$(u,k,0,[[-.4,.76,I*.11],[-.36,.46,I*.11],[-.47,.24,I*.11],[-.43,0,I*.11]],[.11,.052,.03,.03],5,Q),z&&($(u,k,5,[[.63,1.37,I*.05],[.55,1.62,I*.17],[.58,1.88,I*.24],[.7,2.05,I*.17]],[.026,.022,.016,.006],4,()=>j(n)),$(u,k,5,[[.62,1.42,I*.07],[.74,1.5,I*.1],[.8,1.58,I*.11]],[.017,.013,.004],4,()=>j(n)),$(u,k,5,[[.565,1.75,I*.205],[.47,1.9,I*.22],[.44,2,I*.2]],[.015,.012,.004],4,()=>j(n)))}$(u,k,1,[[-.55,.84,0],[-.64,.74,0],[-.66,.6,0]],[.03,.04,.012],5,Q);for(let I=0;I<u.count;I++){if(k[I]>4.5)continue;const T=u.p[I*3],Y=u.p[I*3+1],V=u.n[I*3+1];let q=e,b=.86+.22*V;k[I]<.5&&Y<.5?(q=Y<.06?s:o,b=Y<.06?1:.62):V<-.5&&k[I]<2.5?(q=o,b=.8):k[I]<.5&&V>.9?b=.6:k[I]>2.5&&T>.87?(q=s,b=1):k[I]>.5&&k[I]<1.5&&V<.2&&(q=o,b=1),u.c[I*3]=q[0]*b,u.c[I*3+1]=q[1]*b,u.c[I*3+2]=q[2]*b}return me(u,k)},i=Re(`
        float gz = aI.y * (1. - .92 * smoothstep(.72, .95, sin(t * .23 + sd * 20.)));
        if (aPart > 1.5) {
          float w = aPart > 2.5 ? 1. : smoothstep(.86, 1.25, position.y);
          float a = -1.75 * gz * w;
          p.xy = rot2(p.xy - vec2(.42, .9), a) + vec2(.42, .9); n.xy = rot2(n.xy, a);
          float tn = (1. - gz) * mix(.6 * sin(t * .37 + sd * 17.) * smoothstep(-.3, .6, sin(t * .19 + sd * 5.)), aI.z, aI.w) * w;
          p.xz = rot2(p.xz - vec2(.45, 0.), tn) + vec2(.45, 0.); n.xz = rot2(n.xz, tn);
        } else if (aPart > .5) {
          p.z += sin(t * 11. + sd * 30.) * .07 * smoothstep(.55, .9, sin(t * .8 + sd * 4.)) * (.84 - position.y) * 4.;
        }`,{},`
          if (vPart < .5 && vO.y > .52) {
            vec2 sg = vec2(vO.x * 10. + floor(vO.y * 12.) * .37, vO.y * 12.);
            vec2 sc = fract(sg) - .5; float sh1 = hash11(dot(floor(sg), vec2(7.1, 13.7)));
            float spot = (1. - smoothstep(.13, .23, length(sc + (sh1 - .5) * .28))) * step(.22, sh1);
            alb = mix(alb, vec3(.66, .6, .5), spot * smoothstep(.25, .55, vO.y - .52 + .3));
          }`);await L.yield();const m=r(!0),A=r(!1),p=st("chital2"),M=G.stations.chital2,w=st("chital2party"),c=8,l=4,x=1.6,v=[.87,1],f=(z,u,k,Q,I)=>({x:z,z:u,y:R.floorY(z,u)-.01,yaw:p.range(0,at),s:k,g:Q,stag:I}),h=[];{const z=w.int(0,c-1),u=(z+1+w.int(0,c-2))%c;for(let k=0;k<c;k++){let Q=M.x,I=M.z;for(let Y=0;Y<200;Y++){const V=w.range(0,at),q=l*Math.sqrt(w());if(Q=M.x+Math.cos(V)*q,I=M.z+Math.sin(V)*q,h.every(b=>Math.hypot(b.x-Q,b.z-I)>=x))break}const T=k===z||k===u?1:0;h.push(f(Q,I,w.range(v[0],v[1]),T?0:w.chance(.5)?1:0,T))}}{const z=G.giants[1],u=z.mouth,k=p.chance(.5)?1:-1,Q=Math.cos(u),I=Math.sin(u),T=-I*k,Y=Q*k,V=z.x+Q*z.r*1.85,q=z.z+I*z.r*1.85,b=Math.atan2(-Y,T)+p.range(-.25,.25);h.push({x:V,z:q,y:R.floorY(V,q)-.01,yaw:b,s:.92,g:0,stag:0});const W=V-T*.9+Q*1,O=q-Y*.9+I*1;h.push({x:W,z:O,y:R.floorY(W,O)-.01,yaw:b+p.range(.3,.7),s:.54,g:1,stag:0})}const S=new t.Matrix4,y=new t.Quaternion,C=new t.Vector3,B=new t.Vector3,_=new t.Vector3(0,1,0);for(const[z,u]of[[m,h.filter(k=>k.stag)],[A,h.filter(k=>!k.stag)]]){const k=new t.InstancedMesh(z,i,u.length),Q=new Float32Array(u.length*4),I=new t.InstancedBufferAttribute(Q,4);u.forEach((T,Y)=>{y.setFromAxisAngle(_,T.yaw),k.setMatrixAt(Y,S.compose(B.set(T.x,T.y,T.z),y,C.set(T.s,T.s,T.s))),Q.set([p(),T.g,0,0],Y*4),Oo(I,Y,T.x,T.z,T.yaw,1.3)}),z.setAttribute("aI",I),k.instanceMatrix.needsUpdate=!0,k.frustumCulled=!1,Z.add(k),St([k],u)}}await L.yield();const Ct=[];let Dt,Ue;const tt={mesh:null,base:[],bough:null,dA:0,uR:0},Ot=[];{const e=G.feats.batBough,o=st("batbough"),s=110,n=110,r=s+n,i=qo.clone(),m=No.clone(),A=e.at(.5,new t.Vector3),p=$t(A.x,A.z,.5*N.length,.78*N.length),M=G.feats.rootSeats[2],w=$t(M.x,M.z,.5*N.length,.78*N.length);tt.uR=w/N.length;const c=ft({vertexColors:!0,side:t.DoubleSide,uniforms:Xt,vertexShader:`
          attribute vec4 aW, aI;
          uniform vec4 uHall;
          varying vec3 vP, vN, vC; varying vec4 vW;
          ${R.GL_FOG_V}
          void main(){
            // aI: seed, how far the wings are out (0 hung and wrapped, 1 flying), whether it is one that fans itself, size
            float t = uHall.z, sd = aI.x;
            float fan = aI.z * smoothstep(.5, .9, sin(t * .5 + sd * 23.));
            float o = clamp(aI.y + .6 * fan, 0., 1.);
            float wt = t * (5. + 10. * aI.y) + sd * 40.;
            vec3 p = position, n = normal;
            if (aW.w > .5) {
              float s = aW.x, c = aW.z;
              float a = mix(-.9, .1, aI.y) + (.25 + .5 * aI.y) * sin(wt - s * 1.2);
              vec3 po = vec3(aW.y * (.04 + s * .61 * cos(a)), .012 + s * .61 * sin(a), position.z);
              vec3 pf = vec3(aW.y * (.05 + .045 * c), .025 - .075 * c, mix(-.21, .1, s));
              p = mix(pf, po, o);
              n = normalize(mix(vec3(aW.y * .8, .6, 0.), vec3(-aW.y * sin(a), cos(a), 0.), o) + vec3(0., 1e-4, 0.));
            }
            p *= aI.w;
            p.x += (1. - aI.y) * .1 * sin(t * 1.3 + sd * 50.) * (.15 * aI.w - p.z);
            vec4 wp = instanceMatrix * vec4(p, 1.);
            vP = wp.xyz; vN = normalize(mat3(instanceMatrix) * n + vec3(0., 1e-4, 0.)); vW = aW;
            vC = aW.w > .5 ? vec3(o, 0., 0.) : color * 1.2;          // (a wing carries how far it is spread, not a colour)
            vec4 mvPosition = modelViewMatrix * wp;
            gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:Ro.replace("col = membrane(vP, N, vd, vW.xz, sv, 0.);",`col = membrane(vP, N, vd, vW.xz, sv, 0.);
              float webK = smoothstep(-.12, 0., vW.z - wingCut(vW.x)), skinK = smoothstep(.02, .06, wingBone(vW.xz)), openK = clamp(vC.r, 0., 1.);
              float svB = max(sunVis(vP + vd * 4.), sunVis(vP + vd * 10.));          // a shaft standing behind the wing, seen through it
              col += skinK * (vec3(.62, .4, .24) * (uSkyAmb * .26 + uHazeCol * .55) * (.75 + .5 * webK) * (.6 + .9 * openK)
                + uAmberC * uSunCol * (sv * (.2 + .25 * max(dot(vd, uSunDir), 0.)) + svB * .17 * openK));`)}),l=new t.Matrix4,x=new t.Vector3,v=new t.Vector3,f=new t.Vector3(0,1,0),h=new t.Vector3,S=new t.Vector3,y=e.b.clone().sub(e.a).setY(0).normalize(),C=new t.Vector3(-y.z,0,y.x),B=new t.InstancedMesh(i,c,r),_=new Float32Array(r*4),z=(V,q,b,W,O,a)=>(V.at(q,S),v.set(Math.cos(O),0,Math.sin(O)),x.crossVectors(v,f),h.set(S.x+C.x*b,S.y-V.r*.9-.15*W,S.z+C.z*b),a.makeBasis(x,v,f).setPosition(h)),u=(V,q,b,W,O)=>z(e,V,q,b,W,O);for(let V=0;V<s;V++){const q=V<80?o.range(.2,.8):o.range(.07,.93),b=o.range(1.05,1.3);B.setMatrixAt(V,u(q,o.range(-.16,.16),b,o.range(0,at),l)),_.set([o(),0,o.chance(.3)?1:0,b],V*4)}{const V=G.limbUnder,q=V.length/4,b=st("naveroost");let W=s;const O=(a,g,K)=>{const D=b.range(0,at),d=Math.cos(D),P=Math.sin(D);for(let F=0,H=3+b.int(0,3);F<H&&W<r;F++,W++){const X=b.range(1.05,1.3),ot=(F-(H-1)/2)*.34,gt=b.range(0,at);v.set(Math.cos(gt),0,Math.sin(gt)),x.crossVectors(v,f),B.setMatrixAt(W,l.makeBasis(x,v,f).setPosition(a+d*ot,g-.15*X,K+P*ot)),_.set([b(),0,b.chance(.3)?1:0,X],W*4)}};for(let a=0;a<2600&&W<r-60&&q;a++){const g=b.int(0,q-1)*4,K=V[g],D=V[g+1],d=V[g+2];if(Math.abs(K-A.x)+Math.abs(d-A.z)>260)continue;const P=$t(K,d,w-26,p+8),F=fe.d,H=D-E.y[fe.i];P<=w-26||P>=p+8||F<3||F>11||H<3||H>9||O(K,D,d)}for(let a=0;a<4e3&&W<r;a++){const g=it(Math.round((b.chance(.55)?b.range(w-22,w+34):b.range(w-22,p+6))/2),0,E.n-2),K=E.x[g+1]-E.x[g],D=E.z[g+1]-E.z[g],d=Math.hypot(K,D)||1,P=b.sign()*b.range(3,9.5),F=E.x[g]-D/d*P,H=E.z[g]+K/d*P,X=R.ceilY(F,H)-.3,ot=X-E.y[g];ot<3.5||ot>(xt?15.5:11.5)||O(F,X,H)}B.count=W}i.setAttribute("aI",new t.InstancedBufferAttribute(_,4)),B.instanceMatrix.needsUpdate=!0,B.computeBoundingSphere(),B.boundingSphere.radius+=2,B.frustumCulled=!xt,Z.add(B),Ot.push({mesh:B,aI:_,n:B.count,gone:1e9,at:St([B],no(B,B.count))}),await L.yield();const k=G.feats.roost,Q=st("roostrows"),I=k.filter(V=>V.own);for(let V=0;V<I.length;V+=2){const q=I.slice(V,V+2),b=q.map(()=>30+Q.int(0,8)),W=b.reduce((D,d)=>D+d,0),O=qo.clone(),a=new t.InstancedMesh(O,c,W),g=new Float32Array(W*4);let K=0;q.forEach((D,d)=>{C.set(-(D.b.z-D.a.z),0,D.b.x-D.a.x).normalize();for(let P=0;P<b[d];P++,K++){let F=P<b[d]*.6?D.hangT+Q.range(-.17,.17):Q.range(.1,.9);const H=Q.range(1.15,1.42);Math.abs(F-D.hangT)<.014&&(F+=.03),a.setMatrixAt(K,z(D,it(F,.08,.92),Q.range(-.17,.17),H,Q.range(0,at),l)),g.set([Q(),0,Q.chance(.5)?1:0,H],K*4)}}),O.setAttribute("aI",new t.InstancedBufferAttribute(g,4)),a.instanceMatrix.needsUpdate=!0,a.computeBoundingSphere(),a.boundingSphere.radius+=2,a.frustumCulled=!xt,Z.add(a),Ot.push({mesh:a,aI:g,n:W,gone:1e9,at:St([a],no(a,W))})}if(C.set(-y.z,0,y.x),await L.yield(),xt){const V=st("alarm"),q=new t.Vector3,b=new t.Quaternion,W=new t.Vector3,O=k.find(D=>D.alarm)||I[0]||{a:e.a,b:e.b,r:e.r,at:e.at,d:p};tt.bough=O,tt.dA=O.d;const a=new t.Vector3().subVectors(O.b,O.a),g=a.lengthSq()||1;for(const D of Ot)for(let d=0;d<D.n;d++){D.mesh.getMatrixAt(d,l),l.decompose(q,b,W);const P=$t(q.x,q.z,Math.min(w,tt.dA)-30,p+40),F=fe.d,H=it(h.subVectors(q,O.a).dot(a)/g,0,1),ot=Math.abs(P-tt.dA)<9&&h.set(J(O.a.x,O.b.x,H)-q.x,0,J(O.a.z,O.b.z,H)-q.z).length()<1.2?(.572+.036*it((H+.02)/.86,0,1.2))*N.length+V.range(0,3):P>=tt.dA?.596*N.length+(P-tt.dA)*.84+V.range(0,9):.594*N.length+(tt.dA-P)*.3+V.range(0,6);tt.base.push({set:D,i:d,d:P,p:q.clone(),q:b.clone(),size:D.aI[d*4+3],fan:D.aI[d*4+2],go:ot,side:(V.chance(.5)?1:-1)*V.range(3.4,7.5),clear:V.range(2.8,5.4),sp:V.range(.42,.8),ph:V.range(0,at),lat0:F})}for(const D of Ot){D.gone=0;for(const d of tt.base)d.set===D&&(D.gone=Math.max(D.gone,d.go+Math.min(72,Math.max(0,d.d-d.go+12)/(1-d.sp))))}const K=Qt.geometry.clone();K.setAttribute("aI",new t.InstancedBufferAttribute(new Float32Array([.27,1,0,0,.61,1,0,0,.93,1,0,0,.42,1,0,0]),4)),tt.mesh=new t.InstancedMesh(K,so,4),tt.mesh.frustumCulled=!1,Z.add(tt.mesh),St([tt.mesh],[O.a,O.b])}Ue=new Float32Array(k.length*4);const T=st("landers"),Y=new t.Vector3;k.forEach((V,q)=>{const W={d:$t(V.hang.x,V.hang.z,.5*N.length,.8*N.length),to:new t.Vector3,from:new t.Vector3,qHang:new t.Quaternion,p:new t.Vector3,side:V.side};N.tangentAtDist(W.d,Y),Y.y=0,Y.normalize(),C.set(-(V.b.z-V.a.z),0,V.b.x-V.a.x).normalize(),z(V,V.hangT,0,1.3,Math.atan2(Y.z,Y.x)+Math.PI+.4*V.side,l),W.to.setFromMatrixPosition(l),W.qHang.setFromRotationMatrix(l),W.from.copy(W.to).addScaledVector(Y,T.range(15,19)).addScaledVector(C.set(-Y.z,0,Y.x),V.side*T.range(2.2,3.4)),W.from.y-=1.2,W.p.copy(W.to),W.p.y-=.25,Ct.push(W),Ue.set([T(),1,0,1.3],q*4)}),m.setAttribute("aI",new t.InstancedBufferAttribute(Ue,4)),Dt=new t.InstancedMesh(m,c,Math.max(1,Ct.length)),Dt.count=Ct.length,Dt.frustumCulled=!1,Z.add(Dt),Ct.length&&St([Dt],Ct.flatMap(V=>[V.from,V.to]))}const mo=new t.Vector3,Mt=new t.Vector3,jt=new t.Vector3,mt=new t.Vector3,Gt=new t.Matrix4,Le=new t.Quaternion,Pe=new t.Vector3;function A0(e){for(let o=0;o<Ct.length;o++){const s=Ct[o],n=s.d-e,r=it((30-n)/22,0,1),i=r*(2-r),m=U(.62,1,r);mo.copy(s.from).lerp(s.to,i),mo.y-=1.5*Math.sin(Math.PI*r)*(1-.5*r),mt.copy(s.from).sub(s.to).setY(0).normalize().multiplyScalar(1-.75*m),mt.y=-.1-.85*m,mt.normalize(),Mt.set(0,1,0).cross(mt).normalize(),jt.crossVectors(mt,Mt);const A=s.side*.8*(1-m)*U(0,.2,r),p=Math.cos(A),M=Math.sin(A);Pe.copy(Mt),Mt.multiplyScalar(p).addScaledVector(jt,M),jt.multiplyScalar(p).addScaledVector(Pe,-M),Gt.makeBasis(Mt,jt,mt),Le.setFromRotationMatrix(Gt).slerp(s.qHang,U(.88,1,r));const w=r<=0||xt?.001:1;Dt.setMatrixAt(o,Gt.compose(mo,Le,Pe.set(w,w,w))),Ue[o*4+1]=U(-4,3,n)}Dt.instanceMatrix.needsUpdate=!0,Dt.geometry.attributes.aI.needsUpdate=!0}const $o=new t.Quaternion,Eo=new t.Vector3,Qe=new t.Vector3,Te=new t.Vector3;function po(e,o,s){const n=-.12+.86*(o-.568)/.036-.06*e,r=tt.bough.a.distanceTo(tt.bough.b),i=tt.bough,m=it(n<.62?n:.62+(n-.62)*2.1,0,1),A=m*r/2.3,p=A-Math.floor(A);return i.at(m,s),s.y+=i.r+.44+2.6*p*(1-p),m}function S0(e,o){const s=N.length,n=e*s;for(let r=0;r<4;r++){const i=po(r,e,ee);po(r,e+9e-4,oe),rt.subVectors(oe,ee),rt.lengthSq()<1e-8&&rt.subVectors(tt.bough.b,tt.bough.a),rt.normalize(),ae.set(-rt.z,0,rt.x).normalize(),qe.crossVectors(ae,rt);const m=i<.035||i>.965?.001:1.3;He.makeBasis(rt,qe,ae).scale(oe.set(m,m,m)).setPosition(ee),tt.mesh.setMatrixAt(r,He)}tt.mesh.instanceMatrix.needsUpdate=!0;for(let r=0;r<tt.base.length;r++){const i=tt.base[r],m=i.set.aI,A=i.i,p=n-i.go;if(p<=0)Gt.compose(i.p,i.q,Pe.set(1,1,1)),m[A*4+1]=0,m[A*4+2]=i.fan,m[A*4+3]=i.size;else{const M=Math.min(i.d+p*i.sp,s-4),w=M/2,c=Math.min(E.n-2,Math.floor(w)),l=w-c,x=J(E.x[c],E.x[c+1],l),v=J(E.y[c],E.y[c+1],l),f=J(E.z[c],E.z[c+1],l);Te.set(E.x[c+1]-E.x[c],0,E.z[c+1]-E.z[c]).normalize(),Qe.set(-Te.z,0,Te.x);const h=U(0,3.5,p),S=Math.sin(p*.19+i.ph),y=U(0,16,p),C=U(0,5+.5*i.clear,p),B=i.side+1.5*S;Eo.set(J(i.p.x,x+Qe.x*B,y),J(i.p.y,v+i.clear+.7*Math.cos(p*.13+i.ph),C)+.25*Math.sin(o*2.1+i.ph)+5*U(50,72,p),J(i.p.z,f+Qe.z*B,y));const _=.8*Math.cos(p*.19+i.ph),z=-.6*U(0,3,p)*(1-U(7,15,p));Mt.copy(Qe).multiplyScalar(Math.cos(_)),Mt.y=Math.sin(_),mt.copy(Te).multiplyScalar(-Math.cos(z)),mt.y=-Math.sin(z),jt.crossVectors(mt,Mt).normalize(),Mt.crossVectors(jt,mt).normalize(),Gt.makeBasis(Mt,jt,mt),$o.setFromRotationMatrix(Gt),Le.copy(i.q).slerp($o,U(0,2.6,p));const u=Math.max(.001,(1-U(6,12,n-M))*(1-U(58,72,p)));Gt.compose(Eo,Le,Pe.set(u,u,u)),m[A*4+1]=h,m[A*4+2]=0,m[A*4+3]=J(i.size,1.3,h)}i.set.mesh.setMatrixAt(A,Gt)}for(let r=0;r<Ot.length;r++){const i=Ot[r];i.mesh.instanceMatrix.needsUpdate=!0,i.mesh.geometry.attributes.aI.needsUpdate=!0}}await L.yield();const Xo=52,Ce=G.sunColor.clone();Ce.multiplyScalar(1/Math.max(Ce.r,Ce.g,Ce.b,.001));const P0={sunDir:At.clone(),sunColor:Ce,sunIntensity:ct?1.5:yt?2:1.7,sky:Be.uShade.value.clone().lerp(Be.uSkyAmb.value,.45),skyIntensity:ct?2.2:1.35,ground:Be.uBounce.value.clone().multiplyScalar(ct?3:1.6),groundIntensity:1},ke=le.makeFauna(Z,{light:P0});{const e=G.stations.chital;ke.add(le.makeHerd({rng:st("chital"),species:"deer",preset:{...le.HERD_PRESETS.deer,h:.95},pattern:"spots",varieties:.2,count:Math.round(it(13*Vo,10,16)),center:[e.x,0,e.z],radius:8,roam:.5,path:N,clear:6.2,heightAt:R.floorY,shadowOpacity:.5}),{always:!0}),await L.yield();const o=Je?{body:"#3a2a1d",belly:"#4a372a",wingC:"#2a1e16",tip:"#e8e4da",head:"#121010",beak:"#f2c21e",tailC:"#1a1410"}:{body:"#4fae3a",belly:"#86cc4c",wingC:"#2f8f3a",tip:"#1d6a4a",head:"#5cc050",beak:"#d2322a",tailC:"#3aa2a6"};if(ke.add(await le.makeFlockAsync({rng:st("parakeets"),species:"parrots",count:he==="figs"?110:60,size:Je?1.3:1.5,spread:[10,1.28,24],wander:[.3,.25,.3,.6],maxSigma:3,...o,keepClear:{path:N,dist:2.1,up:!0,each:!0,from:.24,to:.89,step:2},cross:{path:N,u:.8,lead:36,angle:75,side:-1,height:5.2,span:170,duration:Xo}},L.yield),{always:!0}),await L.yield(),!Je){const s=G.pool.a,n=G.pool.b,r=(s.x+n.x)/2,i=(s.z+n.z)/2,m=Math.hypot(n.x-s.x,n.z-s.z)||1,A=-(n.z-s.z)/m,p=(n.x-s.x)/m,M=[];for(let w=-3;w<=3;w++)M.push([r+A*w*18,G.pool.y+4.4+.5*Math.cos(w),i+p*w*18]);ke.add(await le.makeFlockAsync({rng:st("parakeets2"),species:"parrots",count:24,size:1.5,spread:[6,.96,16],wander:[.3,.25,.3,.6],maxSigma:3,...o,keepClear:{path:N,dist:2.1,up:!0,each:!0,from:.32,to:.4,step:2},route:M.map(([w,c,l])=>[w,c+3.2,l]),closed:!1,speed:13},L.yield),{always:!0})}if(await L.yield(),he==="figs"){const s=G.giants[0],n=G.giants[1],r=Math.hypot(n.x-s.x,n.z-s.z)||1,i=(n.x-s.x)/r,m=(n.z-s.z)/r,A=[];for(let p=0;p<=5;p++){const M=-45+(r+90)*p/5;A.push([s.x+i*M-m*(s.r+7),8.5+.8*Math.sin(p*1.3),s.z+m*M+i*(s.r+7)])}ke.add(await le.makeFlockAsync({rng:st("hornbills"),species:"crows",count:2,size:2.7,spread:[3,1,5],wander:[.4,.3,.4,.4],maxSigma:3,body:"#8b8880",belly:"#b9b4a6",wingC:"#6e6b64",tip:"#2a2826",head:"#8b8880",beak:"#d9c06a",tailC:"#8b8880",keepClear:{path:N,dist:2.1,up:!0,each:!0,from:.57,to:.72,step:2},route:A.map(([p,M,w],c)=>[p,M+[1.5,2.5,6,2.5,0,0][c],w]),closed:!1,speed:11},L.yield),{always:!0})}}await L.yield();let go=null;if(xt){const e=st("wave"),o=Math.round(3400*(.6+.4*Ut)),s=new Float32Array(o*24),n=new Float32Array(o*32),r=new Float32Array(o*16),i=new Uint32Array(o*12),m=new t.Vector3,A=new t.Vector3,p=[];for(let c=0;c<o;c++){const l=e.range(.55,.9),x=e.gauss()*17;N.pointAt(l,m),N.tangentAt(l,A);let v=m.x-A.z*x,f=m.z+A.x*x;{const _=R.ocDist(v,f),z=G.courtyard.center;if(_<G.courtyard.radius+3){const u=(G.courtyard.radius+3)/Math.max(_,1);v=z.x+(v-z.x)*u,f=z.z+(f-z.z)*u}}const h=R.ceilY(v,f)-e.range(.4,1.8);(c&15)===0&&p.push({x:v,z:f});const S=h-(m.y+(Math.abs(x)<7?3.6:.5)),y=Math.max(.6,Math.min(e.range(1.2,7.5),S-1.3)),C=e(),B=e.range(2,7.5);for(let _=0;_<2;_++)for(let z=0;z<4;z++){const u=(c*2+_)*4+z;s[u*3]=v,s[u*3+1]=h,s[u*3+2]=f,n[u*4]=C,n[u*4+1]=_?1:-1,n[u*4+2]=B,n[u*4+3]=y,r[u*2]=z===0||z===3?-1:1,r[u*2+1]=z<2?-1:1}for(let _=0;_<2;_++){const z=(c*2+_)*4;i.set([z,z+1,z+2,z,z+2,z+3],(c*2+_)*6)}(c&511)===0&&await L.yield()}const M=new t.BufferGeometry;M.setAttribute("position",new t.BufferAttribute(s,3)),M.setAttribute("aQ",new t.BufferAttribute(n,4)),M.setAttribute("uv",new t.BufferAttribute(r,2)),M.setIndex(new t.BufferAttribute(i,1)),go=ft({side:t.DoubleSide,uniforms:{...Xt,uWaveDir:{value:new t.Vector3(0,0,1)}},vertexShader:`
          attribute vec4 aQ;
          uniform vec4 uHall, uWave; uniform vec3 uCam, uWaveDir;
          varying vec3 vP, vW;
          ${R.GL_FOG_V}
          void main(){
            float sd = aQ.x, t = uHall.z; vec3 H = position;
            float a = 1. - smoothstep(uWave.w * .55, uWave.w, length(H - uWave.xyz) + (sd - .5) * uWave.w * .3);
            float dir = sd > .5 ? 1. : -1.;
            float ang = dir * t * (1.0 + .9 * sd) + sd * 60.;
            float r = aQ.z * a;
            vec3 F = H + vec3(cos(ang) * r, -aQ.w * a - .9 * a * sin(ang * .7 + sd * 9.), sin(ang) * r) + uWaveDir * a * (5. + 4. * sin(t * .5 + sd * 20.));
            vec3 A = dir * vec3(-sin(ang), 0., cos(ang));
            vec3 Rl = vec3(-A.z, 0., A.x), D = vec3(0., 1., 0.);
            float fl = sin(t * (15. + 4. * sd) + sd * 100.);
            float phi = .15 + .8 * fl, s01 = uv.x * .5 + .5, ph2 = phi * (1. + .5 * s01);
            vec3 arm = Rl * aQ.y * cos(ph2) + D * sin(ph2);
            vec3 P = F + A * (.3 - uv.y * .22 - .1 * s01) + arm * s01 * .66;
            float dc = length(uCam - F);
            float vis = smoothstep(.02, .3, a) * smoothstep(3., 7., dc);
            P = F + (P - F) * vis * clamp(dc / 70., 1., 2.2);
            vP = P; vW = vec3(s01, uv.y, 0.);
            vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
            gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          varying vec3 vP, vW; uniform vec3 uAmberC;
          ${R.GL_COMMON}
          ${R.GL_FOG_F}
          void main(){
            float sp = vW.x, c = vW.y;
            float lead = -.9 + .55 * abs(sp - .42), trail = .8 - .5 * sp - .24 * abs(sin(sp * 7.854));
            if (c < lead || c > trail || sp > .985) discard;
            float armB = 1. - smoothstep(.02, .16, c - lead);
            float ang = atan(c + .62, sp - .42 + 1e-4);
            float fing = (1. - smoothstep(.03, .1, abs(fract(ang * 1.9 + .25) - .5))) * step(.42, sp);
            float bone = max(max(armB, fing), 1. - smoothstep(.04, .16, sp));
            vec3 v = vP - uCam; vec3 vd = v / max(length(v), 1e-3);
            float sv = sunVis(vP), th = max(dot(vd, uSunDir), 0.); th = th * sqrt(th);
            vec3 col = vec3(.024, .019, .017) * (uSkyAmb * .6 + uShade * .6 + uSunCol * sv * .3);
            col += uAmberC * uSunCol * sv * (1. - bone) * (.24 + .6 * th);
            col += (1. - bone) * vec3(.62, .4, .24) * (uSkyAmb * .26 + uHazeCol * .55) * (.75 + .5 * smoothstep(-.1, .3, c - lead - .5 * (trail - lead)));
            col = hallHaze(col, vP);
            gl_FragColor = vec4(col, 1.);
            #include <fog_fragment>
          }`});const w=new t.Mesh(M,go);w.frustumCulled=!1,Z.add(w),St([w],p)}if(await L.yield(),Ht==="shower"){const e=st("drips"),o=Math.round(900*Ut),s=new Float32Array(o*3),n=new Float32Array(o*3),r=new t.Vector3,i=new t.Vector3;for(let M=0;M<o;M++){const w=e.range(.28,1),c=e.range(-18,18);N.pointAt(w,r),N.tangentAt(w,i);const l=r.x-i.z*c,x=r.z+i.x*c;s[M*3]=l,s[M*3+1]=R.floorY(l,x),s[M*3+2]=x,n[M*3]=e(),n[M*3+1]=R.ceilY(l,x),n[M*3+2]=e.range(.5,.8)}const m=new t.BufferGeometry;m.setAttribute("position",new t.BufferAttribute(s,3)),m.setAttribute("aD",new t.BufferAttribute(n,3));const A=ft({fog:!1,transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,vertexShader:`
          attribute vec3 aD; uniform vec4 uHall; uniform float uPx; varying float vA;
          void main(){
            float f = fract(uHall.z * aD.z + aD.x * 9.); vec3 P = position; P.y = mix(aD.y, position.y, f * f);
            vec4 mv = modelViewMatrix * vec4(P, 1.); float dist = max(-mv.z, .1), ideal = .06 * uPx / dist;
            gl_PointSize = clamp(ideal, 1.5, 5.);
            vA = min(1., ideal / 1.5) * smoothstep(2., 6., dist) * exp(-dist * uHall.y) * (.5 + .5 * fract(aD.x * 7.3));
            gl_Position = projectionMatrix * mv;
          }`,fragmentShader:`
          varying float vA; uniform vec3 uSunCol, uSkyAmb;
          void main(){ vec2 q = gl_PointCoord - .5; float a = max(1. - dot(q, q) * 4., 0.); gl_FragColor = vec4((uSkyAmb * 1.2 + uSunCol * .35) * a * a * vA, 1.); }`}),p=new t.Points(m,A);p.frustumCulled=!1,p.renderOrder=7,Z.add(p)}await L.yield();const Zo=G.stations.chital,wo=new t.Vector3,ne=new t.Vector3,je=new t.Vector3,Ye=new t.Vector3,Jo=new t.Vector3,Ke=we.map(e=>new t.Vector3(e.x,e.y+1.05*e.s,e.z)),t0=new t.Vector3(Zo.x,1,Zo.z),e0=G.giants.map((e,o)=>new t.Vector3(e.x,o?7.5:10,e.z)),$e=G.stations.chital2,o0=new t.Vector3($e.x,R.floorY($e.x,$e.z)+1.2,$e.z),xo=G.feats.rootSeats[2],a0=new t.Vector3(xo.x,xo.y+.5,xo.z),yo=G.feats.batBough.at(.5,new t.Vector3);yo.y-=.6;const bo=G.feats.langurLimb.at(.5,new t.Vector3);bo.y+=.5;const C0=.28*N.length,k0=.8*N.length,Ee=new t.Vector3,V0=e=>{const o=po(1,e,Ee);return tt.bough.at(it(o,.3,.7),Ee),Ee.y+=.6,Ee},se=[[t0,.9],[Ke[0],1],[o0,1],[Ke[1],1],[G.bough.mid,1,e=>(co(ro[1],e,Jo),Jo)],[a0,xt?0:.9],[bo,1],[yo,.5],[e0[0],.45],[e0[1],1],...Ct.map((e,o)=>xt&&G.feats.roost[o]===tt.bough?[e.p,1,V0]:[e.p,.7])].filter(e=>e[1]>0).map(([e,o,s])=>({p:e,w:o,live:s,d:$t(e.x,e.z,C0,k0),off:0})),n0=e=>e.d-(e.w>=.9?8:0);se.sort((e,o)=>n0(o)-n0(e));const F0=Math.cos(70*Math.PI/180),Mo=7;for(const e of se){e.off=e.d-62;for(let o=Math.min(e.d+14,N.length-1);o>e.d-62;o-=.5)if(N.posAtDist(o,je),N.tangentAtDist(o,Ye),ne.subVectors(e.live?e.live(o/N.length):e.p,je),ne.dot(Ye)/(ne.length()||1)>=F0){e.off=o;break}}await L.yield();const W0=(e,o)=>{const s=o*N.length;N.posAtDist(Math.min(s+22,N.length),wo),N.posAtDist(s,je),N.tangentAtDist(s,Ye);for(let n=0;n<se.length;n++){const r=se[n],i=r.d-s;if(i>62||s>r.off+Mo)continue;const m=r.live?r.live(o):r.p;ne.subVectors(m,je);const A=ne.length()||1,p=ne.dot(Ye)/A,M=s<=r.off?U(.105,.309,p):1-U(0,Mo,s-r.off);wo.lerp(m,r.w*(1-U(40,62,i))*M)}return wo},zo=(se.reduce((e,o)=>Math.min(e,o.d),1e9)-75)/N.length,B0=zo+(se.reduce((e,o)=>Math.max(e,o.off+Mo),0)/N.length-zo)/(1-.08),I0=K0,_0=new t.Vector3(-10,0,300),D0=new t.Vector3(-8,8,150),O0=new t.Vector3(2,0,116),G0=new t.Vector3,N0=[{at:(e,o)=>G0.copy(_0).lerp(D0,U(.03,.075,o)).lerp(O0,U(.115,.155,o)),from:-.2,to:.215,weight:.8,fade:.14},{at:new t.Vector3(12,9,-42),from:.3,to:.4,weight:.45},{at:W0,from:zo,to:B0,weight:.8,fade:.08},{at:new t.Vector3(G.courtyard.center.x,9,G.courtyard.center.z),from:.725,to:.845,weight:.4},{at:G.portalSeat.position.clone(),from:I0,to:.93,weight:.6}],R0=e=>1+.1*(1-U(.14,.2,e))+.3*U(.18,.23,e)*(1-U(.27,.31,e))-.12*U(.31,.33,e)*(1-U(.37,.4,e))-.18*U(.4,.43,e)*(1-U(.56,.59,e))-.24*U(.59,.62,e)*(1-U(.71,.75,e))+.12*U(.73,.76,e)*(1-U(.8,.83,e))-.14*U(.83,.85,e)*(1-U(.87,.9,e)),q0=ct?{exposure:1.75,bloom:{strength:.4,radius:.7,threshold:.8},grade:{saturation:1,contrast:1,tint:"#eef2ff",shadowTint:"#0a1226",vignette:.26,grain:.03}}:yt?{exposure:Ht==="fog"?.82:.86,bloom:{strength:.28,radius:.6,threshold:.95},grade:{saturation:Ht==="fog"?1.12:1.04,contrast:1.05,tint:Ht==="fog"?"#fff3e0":"#fffaf2",shadowTint:"#04120e",vignette:.3,grain:.02}}:{exposure:1,bloom:{strength:.36,radius:.62,threshold:.92},grade:{saturation:1.08,contrast:1.05,tint:"#fff4e6",shadowTint:"#04140f",vignette:.3,grain:.022}},s0=new t.ShaderMaterial({transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,fog:!1,uniforms:{uCol:{value:ct?new t.Color(.3,.42,.7):new t.Color(.95,.66,.3)},uK:{value:0}},vertexShader:`
        varying vec2 vQ;
        void main(){ vQ = position.xy / 17.; 
          // the glow is in the haze this side of the ring: drawn 45 m nearer along the line of sight (same place, same size on screen), so the pillars that flank the ring are lit by it
          vec4 mv = modelViewMatrix * vec4(0., 0., 0., 1.); float k = max(1. - 45. / max(length(mv.xyz), 1.), .25);
          mv.xyz *= k; mv.xy += position.xy * k; gl_Position = projectionMatrix * mv; }`,fragmentShader:`
        uniform vec3 uCol; uniform float uK; varying vec2 vQ;
        void main(){
          float r = length(vQ), g = 1. - smoothstep(.45, 1., r);
          g = g * g * smoothstep(.36, .46, r);                // round the ring, not over the view through it
          gl_FragColor = vec4(uCol * g * uK, 1.);
        }`}),Xe=new t.Mesh(new t.PlaneGeometry(34,34),s0);Xe.position.copy(G.portalSeat.position),Xe.frustumCulled=!1,Xe.renderOrder=6,Z.add(Xe);const Ao=[[t0,8],[Ke[0],1.5],[o0,5],[Ke[1],1.5],[a0,4],[bo,3],[yo,1],[G.bough.mid,4],...Ct.map(e=>[e.p,0,3])].map(([e,o,s=6])=>({x:e.x,y:e.y,z:e.z,r:o,g:s}));{const e=G.giants[1];Ao.push({x:e.x+Math.cos(e.mouth)*e.r*1.85,y:1,z:e.z+Math.sin(e.mouth)*e.r*1.85,r:2,g:6})}const re=new t.Vector3,Nt=new t.Vector3,Ze=new t.Vector3,kt=new t.Vector3,ie=new t.Vector3,Rt=new t.Matrix4,r0=new t.Vector3,et=new t.Vector3,pt=new t.Vector3,Vt=new t.Vector3,i0=new t.Vector3,So=new t.Vector3,Po=new t.Vector3,Co=N.pointAt(0),ko=N.tangentAt(0);function c0(e,o,s,n){n=n||0,Bt.setProgress(n),Bt.update(e,o,s),de.update(e,o,s);const r=n*N.length;g0(r),N.posAtDist(r,et),N.tangentAtDist(r,Vt);const i=et.y,m=Math.hypot(et.x-G.oculus.center.x,et.z-G.oculus.center.z),A=et.distanceTo(G.portalSeat.position),p=1-U(11,30,i),M=p*U(52,66,m)*U(125,160,A);re.set(-Vt.z,0,Vt.x).normalize(),pt.crossVectors(re,Vt).normalize();const w=e>0?1-Math.exp(-e*3):1;for(let c=0;c<Lt;c++){const l=De[c],x=Math.sin(o*l.w1+l.p1),v=Math.sin(o*l.w2+l.p2),f=l.side<0?-1:1,h=Math.abs(l.side),S=J(l.side,f*Math.min(h,2.3+.36*h),p),y=l.up*J(1,.6,p);{let Q=0;const I=et.x+Vt.x*l.ahead+re.x*S+pt.x*y,T=et.y+Vt.y*l.ahead+pt.y*y,Y=et.z+Vt.z*l.ahead+re.z*S+pt.z*y;for(let V=0;V<Ao.length;V++){const q=Ao[V],b=I-q.x,W=T-q.y,O=Y-q.z;Q=Math.max(Q,1-U(q.g+q.r,q.g*1.5+q.r,Math.sqrt(b*b+W*W+O*O)))}l.give+=(Q-l.give)*w}const C=Math.max(l.give,l.open*M),B=J(l.ahead,Math.min(l.ahead,l.back),C)+l.dA*v,_=S+l.dS*x+f*2.4*C,z=y+l.dU*Math.sin(o*l.w2*1.3+l.p1)+.9*C;Nt.copy(et).addScaledVector(Vt,B).addScaledVector(re,_).addScaledVector(pt,z);const u=l.tilt*(1-p),k=.22*Math.cos(o*l.w1+l.p1);Ze.copy(Vt).multiplyScalar(Math.cos(u)).addScaledVector(pt,Math.sin(u)).normalize(),kt.copy(re),ie.crossVectors(kt,Ze).normalize(),kt.multiplyScalar(Math.cos(k)).addScaledVector(ie,Math.sin(k)),ie.crossVectors(kt,Ze).normalize(),Rt.makeBasis(kt,ie,r0.copy(Ze).negate()),(Nt.x-Co.x)*ko.x+(Nt.y-Co.y)*ko.y+(Nt.z-Co.z)*ko.z<0&&Rt.scale(i0.set(.001,.001,.001)),Rt.setPosition(Nt),Zt.setMatrixAt(c,Rt)}for(let c=0;c<ve;c++){const l=nt.off[c],x=(o*12.5+l[0]+1.2*Math.sin(o*l[3]+l[4])+2*nt.len)%nt.len,v=.2*Math.sin(o*l[3]+l[4]);Nt.copy(nt.a).addScaledVector(nt.d,x).addScaledVector(nt.b,l[1]),Nt.y+=l[2]+.5*Math.sin(o*l[3]*1.7+l[4])-3.5*U(nt.len-150,nt.len,x),kt.copy(nt.b).multiplyScalar(Math.cos(v)),kt.y=Math.sin(v),ie.crossVectors(kt,nt.d).normalize(),Rt.makeBasis(kt,ie,r0.copy(nt.d).negate());const f=Math.max(.001,U(0,30,x)*(1-U(nt.len-14,nt.len,x)));f<1&&Rt.scale(i0.set(f,f,f)),Rt.setPosition(Nt),Zt.setMatrixAt(Lt+c,Rt)}Zt.instanceMatrix.needsUpdate=!0,Xt.uSq.value.set(vt.dive,vt.glide*.85,1);{const c=s.projectionMatrix.elements,l=.9,x=l/Math.max(c[5],.001),v=l/Math.max(c[0],.001);Oe.uWf.value.set(v,x,l,Math.min(2*v,2*x*16/9)),Oe.uWingM.value.copy(s.matrixWorld);const f=U(-.2,.75,Math.sin(n*135.2*at))*(1-vt.glide);Oe.uWk.value.set(J(f,.74+.08*Math.sin(o*7.3),vt.dive),0,vt.dive,0),Jt.visible=n>0}N.posAtDist(r,et);{const c=et.y>24,l=c&&R.rho(et.x,et.z)>.6,x=et.y>14||Math.hypot(et.x-G.oculus.center.x,et.z-G.oculus.center.z)<110;_e[0].visible=c,_e[1].visible=l;for(let v=0;v<io.length;v++)io[v].visible=!c;Ge.visible=x,m0(e,et.x,et.z)}{const c=s.matrixWorld.elements,l=G.portalSeat.position;s0.uniforms.uK.value=.6*U(60,130,Math.hypot(c[12]-l.x,c[14]-l.z))*(1-U(14,24,c[13]))*U(.3,.6,n)}w0(n),M0(o),z0(n),A0(r);{const c=s.matrixWorld.elements,l=c[12],x=c[14],v=c[13]<21;for(let f=0;f<ao.length;f++){const h=ao[f],S=v&&Math.hypot(l-h.x,x-h.z)<h.r+160;for(let y=0;y<h.o.length;y++)h.o[y].visible=S}if(xt)for(let f=0;f<Ot.length;f++){const h=Ot[f];r>h.gone&&(h.mesh.visible=!1)}}if(ke.update(e,o,s,n),xt){S0(n,o);const c=62*U(tt.uR-.026,tt.uR+.002,n)*(1-U(.8,.87,n));N.pointAt(Math.min(n+.03,.95),So),N.tangentAt(n,Po),Bt.setWave(So.x,13,So.z,c),go.uniforms.uWaveDir.value.set(Po.x,0,Po.z)}}return Bt.setWake(ct?.3:.55),c0(0,0,new t.PerspectiveCamera,0),await L.yield(),await de.prewarm(L.renderer,null,Z),{scene:Z,path:N,duration:Xo,pace:R0,camera:{fov:62,near:.5,far:9e3,lookAhead:22,sway:.7,bank:.75},pois:N0,portal:{shape:"circle",radius:7.3,color:ct?"#a9c4ff":"#ffd58a",glow:1.25,revealDistance:320},post:q0,ride:"none",update:c0,dispose(){Bt.dispose(),de.dispose()}}}};export{ta as default};
