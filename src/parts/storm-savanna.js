import*as o from"three";import{clamp as Xe,lerp as be,smoothstep as T}from"../kit/core.js";const k=Math.PI*2,Ot=["#2a2f4f","#5b5f86","#f2b25c","#c98f3a","#7a5a2a","#2e2416","#fff2c0"],oe=-30,ge=12,At=`
float hh1(vec3 p){ p = fract(p*0.3183099+vec3(0.1,0.2,0.3)); p *= 17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float hn3(vec3 x){ vec3 i=floor(x), f=fract(x); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(hh1(i),hh1(i+vec3(1,0,0)),f.x), mix(hh1(i+vec3(0,1,0)),hh1(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hh1(i+vec3(0,0,1)),hh1(i+vec3(1,0,1)),f.x), mix(hh1(i+vec3(0,1,1)),hh1(i+vec3(1,1,1)),f.x),f.y),f.z); }
float hfbm(vec3 p){ return 0.5*hn3(p)+0.3*hn3(p*2.03+3.1)+0.2*hn3(p*4.1+7.7); }
float h21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
`,Ct=`
vec3 heroAmbient(){ vec3 irr = ambientLightColor;
  #if NUM_HEMI_LIGHTS > 0
    irr += getHemisphereLightIrradiance(hemisphereLights[0], normalize((viewMatrix*vec4(0.,1.,0.,0.)).xyz))*0.8
         + getHemisphereLightIrradiance(hemisphereLights[0], normalize((viewMatrix*vec4(0.,-1.,0.,0.)).xyz))*0.2;
  #endif
  return irr*0.3183; }
vec3 heroSunCol(){
  #if NUM_DIR_LIGHTS > 0
    return directionalLights[0].color*0.3183;
  #else
    return vec3(0.0);
  #endif
}
vec3 heroSunDir(){
  #if NUM_DIR_LIGHTS > 0
    return directionalLights[0].direction;
  #else
    return vec3(0.,1.,0.);
  #endif
}
`;function Tt(){return{pos:[],nor:[],col:[],hero:[],idx:[],n:0}}function Vt(u){const v=new o.BufferGeometry;return v.setAttribute("position",new o.Float32BufferAttribute(u.pos,3)),v.setAttribute("normal",new o.Float32BufferAttribute(u.nor,3)),v.setAttribute("color",new o.Float32BufferAttribute(u.col,3)),v.setAttribute("aHero",new o.Float32BufferAttribute(u.hero,3)),v.setIndex(new o.BufferAttribute(new Uint32Array(u.idx),1)),v}const ke=new o.Vector3,Me=new o.Vector3,$e=new o.Vector3;function He(u,v,e,M,C){const N=v.length,Q=u.n,V=C.c0,I=C.c1||C.c0,L=C.lump??.06,re=C.phase??0,B=C.aoMin??.62,b=C.shade??1,ee=C.flag||0;let O=C.v0||0;for(let _=0;_<N;_++){const R=v[Math.max(0,_-1)],z=v[Math.min(N-1,_+1)],U=v[_];ke.set(z[0]-R[0],z[1]-R[1],z[2]-R[2]).normalize(),_===0&&(Me.set(0,1,0),Math.abs(ke.y)>.85&&Me.set(1,0,0)),Me.addScaledVector(ke,-Me.dot(ke)).normalize(),$e.crossVectors(ke,Me),_>0&&(O+=Math.hypot(U[0]-R[0],U[1]-R[1],U[2]-R[2]));const K=_/(N-1),Y=e[_],ue=C.sway?C.sway[_]:0;for(let H=0;H<M;H++){const X=H/M*k,fe=Math.cos(X),ve=Math.sin(X),Fe=Me.x*fe+$e.x*ve,Pe=Me.y*fe+$e.y*ve,De=Me.z*fe+$e.z*ve,$=L*Math.sin(X*2+re+O*.55)+L*.7*Math.sin(X*3-O*.9+re*2.1),se=Y*(1+$);u.pos.push(U[0]+Fe*se,U[1]+Pe*se,U[2]+De*se),u.nor.push(Fe,Pe,De);const Ae=B+(1-B)*(Pe*.5+.5),Ie=Ae*(1+(L>0?$/L*.09:0))*b*(C.shadeAt?C.shadeAt(K):1);u.col.push(be(V.r,I.r,K)*Ie,be(V.g,I.g,K)*Ie,be(V.b,I.b,K)*Ie),u.hero.push(ee,O,ue)}}for(let _=0;_<N-1;_++)for(let R=0;R<M;R++){const z=Q+_*M+R,U=Q+_*M+(R+1)%M,K=z+M,Y=U+M;u.idx.push(z,U,K,U,Y,K)}u.n+=N*M}function Nt(u,v,e,M,C,N,Q,V,I,L,re,B){const b=u.n;for(let ee=0;ee<=I;ee++){const O=ee/I*Math.PI,_=Math.sin(O),R=Math.cos(O);for(let z=0;z<V;z++){const U=z/V*k,K=_*Math.sin(U),Y=R,ue=_*Math.cos(U),H=re(K,Y,ue);u.pos.push(v+K*C*H,e+Y*N*H,M+ue*Q*H);const X=Math.hypot(K/C,Y/N,ue/Q);u.nor.push(K/C/X,Y/N/X,ue/Q/X);const fe=B(K,Y,ue,H);u.col.push(fe[0],fe[1],fe[2]),u.hero.push(L,e+Y*N,0)}}for(let ee=0;ee<I;ee++)for(let O=0;O<V;O++){const _=b+ee*V+O,R=b+ee*V+(O+1)%V,z=_+V,U=R+V;u.idx.push(_,z,R,R,z,U)}u.n+=(I+1)*V}function jt(u,v){let e=0;for(;e<u.length-2&&v>u[e+1][0];)e++;const M=u[Math.max(0,e-1)],C=u[e],N=u[e+1],Q=u[Math.min(u.length-1,e+2)],V=N[0]-C[0],I=Xe((v-C[0])/V,0,1),L=(N[1]-M[1])/Math.max(1e-6,N[0]-M[0])*V,re=(Q[1]-C[1])/Math.max(1e-6,Q[0]-C[0])*V,B=I*I,b=B*I;return(2*b-3*B+1)*C[1]+(b-2*B+I)*L+(-2*b+3*B)*N[1]+(b-B)*re}const st=(u,v)=>{let e=(u-v)%k;return e>Math.PI&&(e-=k),e<-Math.PI&&(e+=k),e};function _t(u,v,e){return u.onBeforeCompile=M=>{M.uniforms.uTime=v.uTime,M.uniforms.uWind=v.uWind,M.uniforms.uFlash=v.uFlash,M.uniforms.uFlashCol=v.uFlashCol,M.uniforms.uFlashDir=v.uFlashDir;const C=e==="nest"?`
      vHeroUv = vec2(1.0, position.y);
      #ifdef USE_INSTANCING
      { vec3 hp = instanceMatrix[3].xyz; float ph = hp.x*1.7 + hp.z*2.3 + hp.y*0.9; float wl = length(uWind);
        float s1 = (sin(uTime*1.7 + ph)*0.16 + sin(uTime*2.9 + ph*1.3)*0.06)*wl, s2 = (cos(uTime*1.3 + ph*0.7)*0.11 + 0.05)*wl;
        float c1 = cos(s1), n1 = sin(s1), c2 = cos(s2), n2 = sin(s2);
        transformed.xy = mat2(c1, n1, -n1, c1)*transformed.xy; transformed.zy = mat2(c2, n2, -n2, c2)*transformed.zy; }
      #endif`:`
      vHeroUv = aHero.xy;
      { float w = aHero.z, ph = dot(position.xz, vec2(0.045, 0.06));
        float g = sin(uTime*0.8 + ph) + 0.5*sin(uTime*1.9 + ph*2.3 + position.y*0.12);
        transformed += w*(uWind*g + vec3(0.0, 0.3*sin(uTime*1.3 + ph*1.7)*length(uWind), 0.0)); }`;M.vertexShader=M.vertexShader.replace("#include <common>",`#include <common>
attribute vec3 aHero; uniform float uTime; uniform vec3 uWind; varying vec3 vHeroPos; varying vec2 vHeroUv;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vHeroPos = position;
`+C),M.fragmentShader=M.fragmentShader.replace("#include <common>",`#include <common>
uniform float uFlash; uniform vec3 uFlashCol, uFlashDir; varying vec3 vHeroPos; varying vec2 vHeroUv; float heroH = 0.0;
`+At).replace("#include <color_fragment>",`#include <color_fragment>
      { float m = vHeroUv.x; vec3 p = vHeroPos; float dist = length(vViewPosition), fine = 1.0 - smoothstep(30.0, 110.0, dist);
        float n1 = hfbm(p*0.4), n2 = hfbm(p*2.6 + 11.0), n3 = mix(0.5, hn3(p*11.0), fine);
        if (m < 0.5) {                      // baobab bark: elephant-skin wrinkle rings, drip streaks, lichen
          float wz = smoothstep(0.38, 0.62, hfbm(p*0.23 + 5.0));
          float wr = mix(1.0, smoothstep(0.0, 0.3, abs(sin(vHeroUv.y*1.9 + n1*12.0 + n2*2.0))), wz*mix(0.25, 1.0, fine));
          float st = hn3(vec3(p.x*1.3, p.y*0.12, p.z*1.3));
          vec3 c = diffuseColor.rgb*(0.78 + 0.22*wr)*(0.76 + 0.48*n2)*(0.8 + 0.4*st)*(0.9 + 0.2*n3);
          c = mix(c, c*vec3(1.16, 0.9, 0.82), smoothstep(0.42, 0.7, n1));
          c = mix(c, c*0.4 + vec3(0.34, 0.31, 0.2), 0.4*smoothstep(0.6, 0.68, hfbm(p*0.8 + 31.0)));
          diffuseColor.rgb = c; heroH = wr*0.25 + n2*0.5 + n3*0.2;
        } else if (m < 1.5) {               // woven straw
          float f1 = sin((p.x + p.z)*58.0 + p.y*21.0 + n2*6.0), f2 = sin((p.x - p.z)*52.0 - p.y*66.0 + n1*5.0);
          float hs = mix(0.5, 0.5 + 0.25*f1 + 0.25*f2, 1.0 - smoothstep(12.0, 50.0, dist));
          diffuseColor.rgb *= (0.8 + 0.34*hs)*(0.72 + 0.56*n2); heroH = hs*0.6;
        } else if (m < 2.5) {               // dry earth, dust, straw stubble
          float cr = smoothstep(0.03, 0.12, abs(hn3(p*vec3(1.6, 0.4, 1.6)) - 0.5));
          vec3 c = diffuseColor.rgb*(0.72 + 0.5*n2)*(0.85 + 0.15*cr);
          c = mix(c, c*vec3(1.25, 1.12, 0.8), smoothstep(0.62, 0.8, n3)*0.6);
          diffuseColor.rgb = c; heroH = n2*0.6 + n3*0.3 + cr*0.2;
        } else {                            // termite clay with rain runnels
          float ru = abs(sin(atan(p.x - floor(p.x/9.0)*9.0, p.z)*9.0 + n2*5.0));
          diffuseColor.rgb *= (0.7 + 0.45*n2)*(0.86 + 0.14*ru); heroH = n2*0.7 + ru*0.3;
        }
      }`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
      { vec3 sp = -vViewPosition; vec3 dpx = dFdx(sp), dpy = dFdy(sp); float hx = dFdx(heroH), hy = dFdy(heroH);
        vec3 r1 = cross(dpy, normal), r2 = cross(normal, dpx); float det = dot(dpx, r1);
        det = (det < 0.0 ? -1.0 : 1.0)*max(abs(det), 1e-7);
        float bf = 0.03*(1.0 - smoothstep(14.0, 60.0, length(vViewPosition)));
        normal = normalize(normal - bf*(hx*r1 + hy*r2)/det); }`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
      { vec3 fd = normalize((viewMatrix*vec4(uFlashDir, 0.0)).xyz); float fl = max(dot(normal, fd)*0.75 + 0.25, 0.0);
        float rim = pow(1.0 - max(dot(normal, normalize(vViewPosition)), 0.0), 3.0);
        totalEmissiveRadiance += uFlash*uFlashCol*diffuseColor.rgb*fl*(0.8 + 1.6*rim); }`)},u.customProgramCacheKey=()=>"storm-savanna-hero-"+e,u}async function qt(u,v={}){const e=u.rng.fork?u.rng.fork("elder-baobab"):u.rng,M=u.noise,C=(v.palette&&v.palette.length>=7?v.palette:Ot).map(t=>new o.Color(t)),[N,Q,V,I,L,re,B]=C,b=(t,n,a)=>t.clone().lerp(n,a),ee=v.view||"";await u.yield();const O=v.rise!==!1,_=50,R=O?e.range(3,3.9):0,z=28*e.range(.95,1.06),U=8*e.range(.97,1.04),K=e.range(1,1.1),Y=e.range(.72,.83),ue=e.range(-.5,.5),H=e.int(6,9),X=e.range(0,k),fe=e.range(.2,1.1),ve=v.windDir||[.45,-.9],Fe=Math.hypot(ve[0],ve[1])||1,Pe=v.wind??1,De=new o.Vector3(ve[0]/Fe,0,ve[1]/Fe),$=new o.Vector3().fromArray(v.sunDir||[0,Math.sin(9*Math.PI/180),Math.cos(9*Math.PI/180)]).normalize(),se=b(L,I,.45).lerp(Q,e.range(.24,.36)).lerp(B,.2),Ae=b(se,B,.3).lerp(Q,.12),Ie=b(re,L,.25),Ze=b(L,I,.5),Ge=b(I,B,.35),Ft=b(I,V,.55),q=(t,n)=>{if(!O)return 0;const a=Math.hypot(t,n)/_;if(a>=1)return-.6;const r=(1-a*a)*(1-a*a);return R*r*(1+.16*M.fbm2(t*.028+9.1,n*.028-4.2,3))+.4*M.fbm2(t*.1,n*.1,3)*r+.7*Math.exp(-a*_/9)-.6*T(.78,1,a)},ie=q(0,0)-.25,Pt=[[0,1.1],[.05,1],[.3,K],[.56,.94],[.76,Y],[.88,Y*1.02],[.95,.52],[1,.16]],Je=[];let et=0;for(let t=0;t<H;t++){const n=e.range(.7,1.4);Je.push(n),et+=n}const we=[0];for(let t=0;t<H;t++)we.push(we[t]+Je[t]/et*k);const it=e.range(0,k),Ee=[],ct=[];for(let t=0;t<H;t++)Ee.push(e.range(.93,1.1)),ct.push(e.int(2,3));const lt=[];for(let t=e.int(3,6);t>0;t--)lt.push({th:e.range(0,k),y:e.range(4,z*.8),h:e.range(.3,.7),s:e.range(.9,1.8)});const Z={th:e.range(-.8,-.15),h:e.range(5.5,9),w:e.range(1.8,2.7)},Ce=t=>{const n=fe*Math.pow(Math.max(0,t)/z,1.6);return[Math.sin(X)*n,Math.cos(X)*n]},ht=t=>ue*(t/z)+.12*M.n2(t*.11,3.3),ut=(t,n)=>it+(we[t]+we[t+1])*.5-ht(n),Be={r:0,ao:0,c:0,q:9},tt=(t,n)=>{const a=n/z,r=((t+ht(n)-it)%k+k)%k;let s=0;for(;s<H-1&&r>=we[s+1];)s++;const d=(r-we[s])/(we[s+1]-we[s]),p=Math.sin(Math.PI*d),w=Math.pow(1-p,1.5),S=T(0,.6,Math.min(d,1-d)*2),g=d<.5?Ee[(s+H-1)%H]:Ee[(s+1)%H],f=be((Ee[s]+g)*.5,Ee[s],S),c=(.2*Math.exp(-n/4.5)+.085+.14*T(.6,.9,a))*(1-.75*T(.9,1,a)),l=Math.abs(Math.sin(Math.PI*d*ct[s])),i=.035*(1-l)*(1-l)*p;let h=U*jt(Pt,a)*f*(1-c*w-i);h*=1+.24*p*p*Math.exp(-Math.max(0,n)/1.7),h+=.3*M.fbm3(Math.sin(t)*3.2,n*.16,Math.cos(t)*3.2,3);for(const y of lt){const A=st(t,y.th)*h,G=n-y.y;h+=y.h*Math.exp(-(A*A+G*G)/(y.s*y.s))}let m=9;if(Z){const y=st(t,Z.th)*h/Z.w,A=Math.max(0,n-.6)/Z.h;m=y*y+A*A,h-=3.1*(1-T(.5,1,m)),h+=.42*Math.exp(-Math.pow((m-1.15)/.25,2))}return Be.r=h,Be.ao=Xe(w*c/.3+(1-l)*(1-l)*.25*p,0,1),Be.c=p,Be.q=m,Be},F=Tt();{const a=F.n,r=new Float32Array(12384*3),s=b(Ze,Ge,.4),d=b(se,B,.35),p=Ie.clone().multiplyScalar(.2);for(let g=0;g<=85;g++){const f=g===85,c=f?z+.5:-1.6+(z+1.6)*Math.pow(g/84,.92),l=Ce(c);for(let i=0;i<144;i++){const h=i/144*k,m=(g*144+i)*3,y=tt(h,Math.min(c,z)),A=f?.25:y.r;r[m]=l[0]+Math.sin(h)*A,r[m+1]=ie+c,r[m+2]=l[1]+Math.cos(h)*A;const G=Xe(c/z,0,1);let W=(1-.68*y.ao)*(.9+.14*y.c)*(1-.3*T(.9,1,G));const j=se.clone().lerp(Ae,.5*G);j.lerp(s,.55*Math.exp(-Math.max(0,c)/2.3));const ne=T(.1,.45,M.fbm2(h*3.1+5,c*.35,3))*T(1.2,2.4,c)*(1-T(4.5,6.5,c));if(j.lerp(d,.45*ne),Z){const de=1-T(.5,.95,y.q);j.lerp(p,de),W*=1-.5*de,j.lerp(d,.35*Math.exp(-Math.pow((y.q-1.15)/.3,2)))}F.col.push(j.r*W,j.g*W,j.b*W),F.hero.push(0,c,0)}(g&3)===3&&await u.yield()}await u.yield();const w=new o.Vector3,S=new o.Vector3;for(let g=0;g<=85;g++)for(let f=0;f<144;f++){const c=(g*144+f)*3,l=(g*144+(f+144-1)%144)*3,i=(g*144+(f+1)%144)*3,h=(Math.min(85,g+1)*144+f)*3,m=(Math.max(0,g-1)*144+f)*3;w.set(r[i]-r[l],r[i+1]-r[l+1],r[i+2]-r[l+2]),S.set(r[h]-r[m],r[h+1]-r[m+1],r[h+2]-r[m+2]),w.cross(S).normalize(),g===85&&w.set(0,1,0),F.pos.push(r[c],r[c+1],r[c+2]),F.nor.push(w.x,w.y,w.z)}await u.yield();for(let g=0;g<=84;g++)for(let f=0;f<144;f++){const c=a+g*144+f,l=a+g*144+(f+1)%144,i=c+144,h=l+144;F.idx.push(c,l,i,l,h,i)}F.n+=12384}await u.yield();const Le=[],nt=[],It=[10,7,5,4,2],Et=[11,9,7,5,3],ft=[.16,.3,.42,.55,.6],Oe=[[10.5,14.5],[5.5,8.5],[3.4,5.8],[2,3.6],[1,2.1]],dt=new o.Vector3,ce=new o.Vector3,mt=new o.Vector3(0,1,0),Ue=t=>{const n=e.range(-1,1),a=e.range(0,k),r=Math.sqrt(1-n*n);return t.set(Math.cos(a)*r,n,Math.sin(a)*r)};let Bt=1100;function Ne(t,n,a,r,s,d,p={}){const w=It[s],S=[],g=[],f=[],c=[],l=t.slice(),i=new o.Vector3().copy(n).normalize(),h=Ue(new o.Vector3),m=e.range(-.1,.24),y=s===4,A=p.flare??.28,G=y?.12:.5;for(let x=0;x<=w;x++){const P=x/w;if(S.push(l.slice()),c.push(i.clone()),g.push(a*(1-(1-G)*Math.pow(P,.85))*(1+A*Math.exp(-P*8))*(p.bud?.6+.4*T(0,.2,P):1)),f.push(d+r*P*.011*(s>=3?1.8:1)),x===w)break;if(h.lerp(Ue(dt),.55).normalize(),p.target){const ze=p.target(P,dt);i.lerp(ze,.34),i.addScaledVector(h,ft[s])}else{i.addScaledVector(h,ft[s]),i.y+=m*.5;const ze=Math.hypot(l[0],l[2])||1;i.x+=l[0]/ze*.07,i.z+=l[2]/ze*.07}i.normalize();const le=r/w;let he=l[0]+i.x*le,J=l[1]+i.y*le,rt=l[2]+i.z*le;if(Math.hypot(he-oe,J-ge)<12&&(i.x=Math.abs(i.x)*.3,i.y=Math.abs(i.y)+.5,i.normalize(),he=l[0]+i.x*le,J=l[1]+i.y*le,rt=l[2]+i.z*le),J<14){const ze=q(he,rt)+6;J<ze&&(J=ze,i.y=Math.abs(i.y)+.2,i.normalize())}l[0]=he,l[1]=J,l[2]=rt}const W=s>=3?Ae:b(se,Ae,.35+.15*s);He(F,S,g,Et[s],{c0:p.c0||b(se,Ae,.25+.12*s),c1:W,lump:s<2?.1:.06,phase:e.range(0,6),sway:f,shade:e.range(.86,1.08),aoMin:.5,shadeAt:s===0?x=>.86+.14*T(0,.3,x):null,v0:e.range(0,9)});for(let x=1;x<=w;x++){const P=S[x];s<=2&&x%2===0&&nt.push(P),(s>=2&&g[x]<.5&&g[x]>.05||p.low)&&Math.abs(c[x].y)<.75&&x<w&&Le.push({p:[P[0],P[1]-g[x]*.9,P[2]],low:!!p.low})}if(y)return S;const j=S[w],ne=c[w],de=g[w],ye=(x,P,le,he)=>{const J=s+1;J===4&&Bt--<=0||Ne(x,P,le,e.range(Oe[J][0],Oe[J][1])*(p.lenK??1),J,he,{low:p.low,lenK:p.lenK,flare:.12})},Se=p.nTip??2;for(let x=0;x<Se;x++){Ue(ce),ce.addScaledVector(ne,-ce.dot(ne)).normalize();const P=ne.clone().multiplyScalar(e.range(.9,1.3)).addScaledVector(ce,(x===0?1:-1)*e.range(.45,.85));x>1&&Ue(P).lerp(ne,.5),ye(j.slice(),P,de*e.range(.78,.92),f[w])}const me=p.nSide??[3,1.4,.75,.3][s],pe=Math.floor(me)+(e.chance(me%1)?1:0);for(let x=0;x<pe;x++){const P=e.int(Math.max(1,Math.floor(w*.3)),w-1),le=S[P],he=c[P];Ue(ce),ce.addScaledVector(he,-ce.dot(he)).normalize(),s===0&&(ce.y=Math.abs(ce.y)*.6+.1);const J=he.clone().multiplyScalar(.45).add(ce);ye(le.slice(),J,g[P]*e.range(.58,.8),f[P])}return S}const Ut=e.range(.75,1.15);for(let t=0;t<H;t++){const n=z-e.range(5,6.6),a=ut(t,n)+e.range(-.08,.08),r=Ce(n),s=e.range(2,2.6)*Math.sqrt(Je[t]/(et/H)),d=tt(a,n).r-s,p=e.range(-.5,.5),w=e.range(70,80),S=e.range(6,24)*Ut,g=e.range(16,44),f=[r[0]+Math.sin(a)*d,ie+n,r[1]+Math.cos(a)*d],c=(l,i)=>{const h=(l<.6?be(w,S,T(.12,.6,l)):be(S,g,T(.6,1,l)))*Math.PI/180,m=a+p*l;return i.set(Math.sin(m)*Math.cos(h),Math.sin(h),Math.cos(m)*Math.cos(h))};Ne(f,c(0,new o.Vector3),s,e.range(Oe[0][0],Oe[0][1])+3,0,.01,{target:c,flare:.1,bud:!0}),await u.yield()}{const t=Ce(z),n=(a,r)=>r.set(Math.sin(X)*.25*a,1,Math.cos(X)*.25*a).normalize();Ne([t[0],ie+z-2.5,t[1]],mt,e.range(1.5,1.9),e.range(8,11),0,.01,{target:n,flare:.5,nSide:2})}await u.yield();let Re=null;const Rt=e.chance(.6)?2:1;for(let t=0;t<Rt;t++){const n=t===0?-Math.PI/2+e.range(-.25,.5):e.range(.4,2.6),a=e.range(8.5,11)+(t?e.range(0,4):0),r=Ce(a),s=tt(n,a).r-1.6,d=e.range(8,20),p=e.range(25,45),w=e.range(-.35,.35),S=(f,c)=>{const l=be(d,p,T(.35,1,f))*Math.PI/180,i=n+w*f;return c.set(Math.sin(i)*Math.cos(l),Math.sin(l),Math.cos(i)*Math.cos(l))},g=Ne([r[0]+Math.sin(n)*s,ie+a,r[1]+Math.cos(n)*s],S(0,new o.Vector3),e.range(1.15,1.45),e.range(9.5,12),0,.01,{target:S,flare:.5,low:!0,nSide:2,lenK:.62});t===0&&(Re=g[g.length-1])}if(await u.yield(),O)for(let t=0;t<H;t++){let n=ut(t,0)+e.range(-.1,.1);const a=e.range(9,21),r=e.range(.85,1.35),s=12;if(Z&&Math.abs(st(n,Z.th))<Z.w/U+.24)continue;const d=(w,S,g,f,c,l)=>{const i=[],h=[];let m=f,y=c;for(let A=0;A<=s;A++){const G=A/s,W=g*Math.pow(1-G,1.25)+.05;i.push([m,q(m,y)+W*be(.45,-.7,Math.pow(G,1.5))+(A===0&&l===0?.5:0),y]),h.push(W),w+=e.range(-.28,.28),m+=Math.sin(w)*S/s,y+=Math.cos(w)*S/s}return He(F,i,h,7,{c0:b(se,Ge,.35),c1:b(Ze,Ge,.5),lump:.1,phase:e.range(0,6),aoMin:.55,shade:e.range(.85,1)}),i},p=d(n,a,r,Math.sin(n)*U*.98,Math.cos(n)*U*.98,0);if(e.chance(.65)){const w=p[e.int(3,6)];d(n+e.sign()*e.range(.5,1),a*.5,r*.5,w[0],w[2],1)}}const pt=[];if(O){const t=b(I,L,.45).lerp(B,.08),n=b(t,B,.3);for(let f=e.int(2,3);f>0;f--){const c=e.range(.15,Math.PI*.95),l=e.range(21,40),i=Math.sin(c)*l,h=Math.cos(c)*l,m=e.range(3,5.2);pt.push([i,q(i,h)+m,h]);for(let y=0;y<5;y++){const A=y===0?m:m*e.range(.3,.68),G=y===0?e.range(1.3,1.7):e.range(.6,1),W=e.range(0,6),j=y===0?0:e.range(-1.4,1.4),ne=y===0?0:e.range(-1.4,1.4),de=e.range(-.25,.25),ye=e.range(-.25,.25),Se=[],me=[];for(let pe=0;pe<=6;pe++){const x=pe/6;Se.push([i+j+de*A*x*x,q(i+j,h+ne)-.4+(A+.4)*x,h+ne+ye*A*x*x]),me.push(G*Math.pow(1-x,.75)*(1+.2*Math.sin(x*8+W))*(1+.3*Math.exp(-x*7))+.07)}He(F,Se,me,8,{c0:t,c1:n,lump:.24,phase:e.range(0,6),flag:3,aoMin:.7,shade:e.range(.9,1.05)})}}const a=b(Q,L,.55).lerp(B,.12);for(let f=e.int(5,8);f>0;f--){const c=e.range(0,k),l=e.range(11,40),i=Math.sin(c)*l,h=Math.cos(c)*l,m=e.range(.5,1.7),y=e.range(0,90);Nt(F,i,q(i,h)+m*.15,h,m*e.range(1,1.5),m*e.range(.55,.8),m,8,5,2,(A,G,W)=>1+.3*M.fbm3(A*1.4+y,G*1.4,W*1.4,2),(A,G)=>{const W=.55+.45*(G*.5+.5);return[a.r*W,a.g*W,a.b*W]})}const r=new o.Vector3($.x,0,$.z).normalize(),s=72,d=20,p=F.n,w=b(I,V,.5).multiplyScalar(.8),S=new o.Color,g=new o.Color;for(let f=0;f<=d;f++){const c=5+45*Math.pow(f/d,1.12);for(let l=0;l<s;l++){const i=l/s*k+f%2*(Math.PI/s),h=Math.sin(i)*c,m=Math.cos(i)*c,y=q(h,m),A=.6,G=q(h+A,m)-q(h-A,m),W=q(h,m+A)-q(h,m-A),j=Math.hypot(G,2*A,W),ne=.8-.7*T(16,40,c),de=-G/j+r.x*ne,ye=2*A/j,Se=-W/j+r.z*ne,me=Math.hypot(de,ye,Se);F.pos.push(h,f===d?-.7:y,m),F.nor.push(de/me,ye/me,Se/me);const pe=M.fbm2(h*.07+3,m*.07,3),x=1-T(11,22+6*pe,c);S.copy(w).lerp(b(I,L,.3),.35+.3*pe).lerp(Ze.clone().lerp(Ge,.45+.3*pe),x),v.groundColor&&S.lerp(v.groundColor(h,m,g),T(13,30,c));const P=.85+.2*M.n2(h*.3,m*.3)*(1-.7*T(20,40,c))-.25*Math.exp(-Math.max(0,c-8)/2.5);F.col.push(S.r*P,S.g*P,S.b*P),F.hero.push(2,0,0)}}for(let f=0;f<d;f++)for(let c=0;c<s;c++){const l=p+f*s+c,i=p+f*s+(c+1)%s,h=l+s,m=i+s;F.idx.push(l,h,i,i,h,m)}F.n+=(d+1)*s}await u.yield();const D={uTime:{value:0},uWind:{value:De.clone().multiplyScalar(Pe)},uFlash:{value:0},uFlashCol:{value:new o.Color(.9,1.1,1.75)},uFlashDir:{value:new o.Vector3(.2,.35,-1).normalize()},uBurst:{value:.35},uRainbow:{value:v.rainbowStrength??1},uRainAxis:{value:$.clone().negate()}},te=new o.Group;te.name="elder-baobab";const gt=Vt(F);gt.computeBoundingSphere();const vt=_t(new o.MeshStandardMaterial({vertexColors:!0,roughness:.88,metalness:0}),D,"tree");vt.userData.heroUniforms=D;const wt=new o.Mesh(gt,vt);wt.name="baobab",te.add(wt);let Te=F.idx.length/3;await u.yield();let ot=0,je=0,Ke=1e9,xt=0,bt=0,Mt=0;for(const t of nt)xt+=t[0],bt+=t[1],Mt+=t[2];const Wt=new o.Vector3(xt,bt,Mt).divideScalar(Math.max(1,nt.length));for(let t=0;t<F.n;t++){const n=F.pos[t*3],a=F.pos[t*3+1],r=F.pos[t*3+2];if(F.hero[t*3]>1.5)continue;a>ot&&(ot=a),a>ie+z*.8&&(je=Math.max(je,Math.hypot(n,r)));const s=Math.hypot(n-oe,a-ge);s<Ke&&(Ke=s)}await u.yield();const kt=v.nests??120,ae=[];{e.shuffle(Le);const t=Le.slice(0,e.int(7,11));for(const n of Le){if(ae.length>=kt)break;const a=n.p;if(Math.hypot(a[0]-oe,a[1]-3.2-ge)<8.5||a[1]-3.4<q(a[0],a[2])+2.5)continue;let r=1e9;for(const d of t)r=Math.min(r,Math.hypot(a[0]-d.p[0],a[1]-d.p[1],a[2]-d.p[2]));if(!(n.low?e.chance(.7):e()<Math.exp(-r/3.2)))continue;let s=!0;for(const d of ae)if(Math.hypot(a[0]-d[0],a[2]-d[2])<.95&&Math.abs(a[1]-d[1])<3){s=!1;break}s&&ae.push(a)}}let xe=null;if(ae.length){const t=Tt(),n=b(V,B,.35),a=b(Ft,L,.2);He(t,[[0,.05,0],[0,-.45,0],[0,-.85,0],[0,-1,0],[0,-1.2,0],[0,-1.5,0],[0,-1.8,0],[0,-2.02,0],[0,-2.1,0]],[.035,.03,.04,.15,.37,.48,.43,.23,.02],7,{c0:n,c1:a,lump:.07,flag:1,aoMin:.6}),He(t,[[.24,-1.72,0],[.35,-2.1,0],[.38,-2.5,0],[.38,-2.52,0]],[.21,.18,.17,.1],6,{c0:a,c1:b(re,a,.3),lump:.05,flag:1,aoMin:.5,shadeAt:f=>1-.75*T(.6,1,f)});const r=Vt(t),s=_t(new o.MeshStandardMaterial({vertexColors:!0,roughness:1,metalness:0}),D,"nest");xe=new o.InstancedMesh(r,s,ae.length),xe.name="weaver-nests";const d=new o.Matrix4,p=new o.Quaternion,w=new o.Vector3,S=new o.Vector3,g=new o.Color;ae.forEach((f,c)=>{const l=e.range(.7,1.2);p.setFromAxisAngle(mt,e.range(0,k)),w.set(l,l*e.range(.8,1.45),l),S.set(f[0],f[1],f[2]),xe.setMatrixAt(c,d.compose(S,p,w)),xe.setColorAt(c,g.setRGB(1,1,1).lerp(new o.Color(.72,.62,.5),e()).multiplyScalar(e.range(.85,1.1)))}),xe.instanceMatrix.needsUpdate=!0,xe.instanceColor.needsUpdate=!0,xe.frustumCulled=!1,te.add(xe),Te+=t.idx.length/3*ae.length}await u.yield();let qe=null;if(O&&v.grass!==!1){const n=new Float32Array(16800),a=new Float32Array(4200*4);let r=0,s=0;for(;r<4200&&s++<4200*12;){const c=Math.sqrt(e())*49.5,l=e.range(0,k),i=Math.sin(l)*c,h=Math.cos(l)*c,m=(.5+.5*M.fbm2(i*.06+20,h*.06,2))*T(9.5,17,c)*(1-.8*T(42,50,c));if(e()>m+.12*T(9.5,12,c))continue;const y=.75+.5*e()+.3*M.n2(i*.09,h*.09);n.set([i,q(i,h)-.06,h,e.range(0,k)],r*4),a.set([e.range(1.3,2),1.15*y,e(),e()],r*4),r++}const d=new o.InstancedBufferGeometry,p=[],w=[],S=[],g=[];for(let c=0;c<3;c++){const l=c/3*Math.PI+.3,i=Math.cos(l)*.5,h=Math.sin(l)*.5,m=c*4;p.push(-i,0,-h,i,0,h,-i,1,-h,i,1,h),w.push(0,0,1,0,0,1,1,1),S.push(c,c,c,c),g.push(m,m+1,m+2,m+1,m+3,m+2)}d.setAttribute("position",new o.Float32BufferAttribute(p,3)),d.setAttribute("uv",new o.Float32BufferAttribute(w,2)),d.setAttribute("aCard",new o.Float32BufferAttribute(S,1)),d.setIndex(g),d.setAttribute("aOff",new o.InstancedBufferAttribute(n.subarray(0,r*4),4)),d.setAttribute("aVar",new o.InstancedBufferAttribute(a.subarray(0,r*4),4)),d.instanceCount=r;const f=new o.ShaderMaterial({side:o.DoubleSide,fog:!0,lights:!0,uniforms:o.UniformsUtils.merge([o.UniformsLib.lights,o.UniformsLib.fog,{uRoot:{value:b(L,I,.3).multiplyScalar(.7)},uMid:{value:b(I,V,.45)},uTip:{value:b(V,B,.55).multiplyScalar(.85)}}]),vertexShader:`
        attribute vec4 aOff; attribute vec4 aVar; attribute float aCard;
        uniform float uTime; uniform vec3 uWind;
        varying vec2 vUv; varying vec3 vVar; varying vec3 vView; varying float vGust;
        #include <common>
        #include <fog_pars_vertex>
        void main(){
          vec3 p = position; float c = cos(aOff.w), s = sin(aOff.w); p.xz = mat2(c, -s, s, c)*p.xz; p.xz *= aVar.x; p.y *= aVar.y;
          vec3 b = aOff.xyz; float wl = length(uWind); vec3 wd = uWind/max(wl, 1e-4);
          float ph = dot(b.xz, wd.xz)*0.16 - uTime*1.7 + sin(b.x*0.06 - b.z*0.045)*2.2;
          float gust = 0.5 + 0.5*sin(ph); gust *= gust;
          float fl = sin(uTime*5.3 + aVar.z*40.0 + aCard*2.0)*0.05;
          float bend = (0.2 + 0.62*gust + fl)*wl*uv.y;
          p.xz += wd.xz*bend*aVar.y; p.y -= bend*bend*aVar.y*0.35;
          vec4 mvPosition = modelViewMatrix*vec4(b + p, 1.0);
          vUv = uv; vVar = vec3(aVar.z + aCard*0.37, aVar.w, aVar.y); vGust = gust; vView = mvPosition.xyz;
          gl_Position = projectionMatrix*mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        uniform vec3 uRoot, uMid, uTip;
        varying vec2 vUv; varying vec3 vVar; varying vec3 vView; varying float vGust;
        #include <common>
        #include <lights_pars_begin>
        #include <fog_pars_fragment>
        ${At}
        ${Ct}
        void main(){
          float N = 8.0, x = vUv.x*N, id = floor(x), hit = 0.0, tipK = 0.0, edge = 0.0, head = 0.0;
          for (int k = -1; k <= 1; k++) {
            float bi = id + float(k);
            float h1 = h21(vec2(bi, vVar.x*17.0)), h2 = h21(vec2(bi + 31.0, vVar.x*29.0));
            float hh = 0.45 + 0.55*h2, v = vUv.y/hh;
            float xc = bi + 0.5 + (h1 - 0.5)*0.6 + (h1 - 0.5)*1.5*v*v;
            float hd = step(0.45, h2)*smoothstep(0.7, 0.8, v)*(1.0 - smoothstep(0.93, 1.0, v));
            float w = 0.27*(1.0 - 0.8*v) + 0.2*hd, d = abs(x - xc);
            if (v <= 1.0 && d < w && bi >= 0.0 && bi <= N - 1.0) { hit = 1.0; tipK = max(tipK, v); edge = d/w; head = max(head, hd); }
          }
          if (hit < 0.5) discard;
          vec3 alb = mix(uRoot, uMid, smoothstep(0.0, 0.45, tipK)); alb = mix(alb, uTip, min(1.0, smoothstep(0.55, 1.0, tipK)*0.7 + head*0.4));
          alb *= (0.8 + 0.4*vVar.y)*(1.0 - 0.25*edge);
          vec3 V = normalize(-vView), L = heroSunDir();
          float back = pow(max(dot(-V, L), 0.0), 3.0), occ = mix(0.45, 1.0, smoothstep(0.0, 0.6, vUv.y));
          vec3 col = alb*(heroAmbient() + heroSunCol()*(0.6 + 0.32*vGust + 0.9*back*smoothstep(0.2, 1.0, vUv.y)))*occ;
          gl_FragColor = vec4(col, 1.0);
          #include <fog_fragment>
        }`});f.uniforms.uTime=D.uTime,f.uniforms.uWind=D.uWind,qe=new o.Mesh(d,f),qe.name="rise-grass",qe.frustumCulled=!1,te.add(qe),Te+=r*6}await u.yield();let Qe=null;const Ve=ae.length?v.birds??80:0;if(Ve>0){const t=new o.InstancedBufferGeometry;t.setAttribute("position",new o.Float32BufferAttribute([0,0,.17,-.05,0,0,.05,0,0,0,0,-.22,-.03,.01,.08,-.03,.01,-.07,-.32,.01,-.03,.03,.01,.08,.03,.01,-.07,.32,.01,-.03],3)),t.setAttribute("aWing",new o.Float32BufferAttribute([0,0,0,0,0,0,1,0,0,1],1)),t.setAttribute("aTint",new o.Float32BufferAttribute([0,0,0,.5,.2,.2,1,.2,.2,1],1)),t.setIndex([0,1,2,1,3,2,4,6,5,7,8,9]);const n=new Float32Array(Ve*3),a=new Float32Array(Ve*4);for(let s=0;s<Ve;s++){const d=ae[e.int(0,ae.length-1)];n.set([d[0],d[1]-1.4,d[2]],s*3),a.set([e(),e(),e(),e()],s*4)}t.setAttribute("aHome",new o.InstancedBufferAttribute(n,3)),t.setAttribute("aSeed",new o.InstancedBufferAttribute(a,4)),t.instanceCount=Ve;const r=new o.ShaderMaterial({side:o.DoubleSide,fog:!0,lights:!0,uniforms:o.UniformsUtils.merge([o.UniformsLib.lights,o.UniformsLib.fog,{uBody:{value:b(V,B,.25).multiplyScalar(.95)},uWingC:{value:b(re,L,.5)}}]),vertexShader:`
        attribute vec3 aHome; attribute vec4 aSeed; attribute float aWing, aTint;
        uniform float uTime, uBurst; varying float vTint;
        #include <common>
        #include <fog_pars_vertex>
        vec3 track(float t){
          float r = (1.2 + 3.6*aSeed.x)*(1.0 + 2.6*uBurst*aSeed.w), f = 0.55 + 0.8*aSeed.y, a = t*f + aSeed.z*6.283;
          return aHome + vec3(sin(a)*r, sin(a*2.0 + aSeed.x*5.0)*r*0.32 + 0.4 + uBurst*5.0*aSeed.w*aSeed.y, sin(a*1.31 + aSeed.y*4.0)*r*0.85); }
        void main(){
          vec3 c = track(uTime), fw = normalize(track(uTime + 0.07) - c), rt = normalize(cross(fw, vec3(0., 1., 0.))), upv = cross(rt, fw);
          float flap = sin(uTime*(24.0 + 9.0*aSeed.x) + aSeed.z*30.0);
          vec3 lp = position; lp.y += aWing*flap*0.24; lp.x *= 1.0 - aWing*0.25*abs(flap);
          vec3 wp = c + (rt*lp.x + upv*lp.y + fw*lp.z)*2.4;
          vec4 mvPosition = modelViewMatrix*vec4(wp, 1.0); vTint = aTint;
          gl_Position = projectionMatrix*mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        uniform vec3 uBody, uWingC; varying float vTint;
        #include <common>
        #include <lights_pars_begin>
        #include <fog_pars_fragment>
        ${Ct}
        void main(){
          vec3 col = mix(uBody, uWingC, vTint)*(heroAmbient() + heroSunCol()*0.8);
          gl_FragColor = vec4(col, 1.0);
          #include <fog_fragment>
        }`});r.uniforms.uTime=D.uTime,r.uniforms.uBurst=D.uBurst,Qe=new o.Mesh(t,r),Qe.name="weavers",Qe.frustumCulled=!1,te.add(Qe),Te+=Ve*4}await u.yield();let We=null;{const n=new o.InstancedBufferGeometry,a=new Float32Array(420*4);for(let s=0;s<420*4;s++)a[s]=e();n.setAttribute("position",new o.Float32BufferAttribute([-1,-1,0,1,-1,0,-1,1,0,1,1,0],3)),n.setIndex([0,1,2,1,3,2]),n.setAttribute("aP",new o.InstancedBufferAttribute(a,4)),n.instanceCount=420;const r=new o.ShaderMaterial({transparent:!0,depthWrite:!1,blending:o.AdditiveBlending,fog:!0,uniforms:o.UniformsUtils.merge([o.UniformsLib.fog,{uCol:{value:b(V,B,.25)}}]),vertexShader:`
        attribute vec4 aP; uniform float uTime; uniform vec3 uWind; varying vec2 vQ; varying float vI;
        #include <common>
        #include <fog_pars_vertex>
        void main(){
          float w = aP.w; vec3 p = vec3(aP.x*150.0, 0.0, aP.z*150.0);
          p.xz += uWind.xz*uTime*(6.0 + 8.0*w); p.x += sin(uTime*0.9 + w*50.0)*1.3;
          p.xz = mod(p.xz, 150.0); float e = min(min(p.x, 150.0 - p.x), min(p.z, 150.0 - p.z)); p.xz -= 75.0;
          float hy = fract(aP.y + uTime*0.012*(w - 0.4)); p.y = 1.0 + 44.0*pow(hy, 3.0) + sin(uTime*0.7 + w*30.0)*1.2;
          float tw = pow(0.5 + 0.5*sin(uTime*(3.0 + 5.0*w) + w*90.0), 4.0);
          vQ = position.xy;
          vec4 mvPosition = modelViewMatrix*vec4(p, 1.0);
          vec3 wv = (modelViewMatrix*vec4(normalize(uWind + vec3(1e-4, 0.0, 0.0)), 0.0)).xyz;
          vec2 ax = normalize(wv.xy + vec2(1e-4, 0.0)), sd = vec2(-ax.y, ax.x);
          vI = (0.3 + 1.1*tw)*smoothstep(0.0, 14.0, e)*smoothstep(6.0, 28.0, -mvPosition.z)*(1.0 - 0.85*smoothstep(70.0, 150.0, -mvPosition.z));   // far glints would read as stars on the storm
          mvPosition.xy += ax*position.x*(0.28 + 0.5*w)*(0.35 + 0.65*length(wv.xy)) + sd*position.y*(0.05 + 0.04*w);
          gl_Position = projectionMatrix*mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        uniform vec3 uCol; varying vec2 vQ; varying float vI;
        #include <common>
        #include <fog_pars_fragment>
        void main(){
          float a = smoothstep(1.0, 0.0, abs(vQ.y))*smoothstep(1.0, 0.25, abs(vQ.x)), ff = 0.0;
          #ifdef USE_FOG
            #ifdef FOG_EXP2
              ff = 1.0 - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
            #else
              ff = smoothstep(fogNear, fogFar, vFogDepth);
            #endif
          #endif
          gl_FragColor = vec4(uCol*vI*a*(1.0 - ff), 1.0);
        }`});r.uniforms.uTime=D.uTime,r.uniforms.uWind=D.uWind,We=new o.Mesh(n,r),We.name="wind-seeds",We.frustumCulled=!1,We.renderOrder=2,te.add(We),Te+=420*2}await u.yield();let _e=null;if(v.rainbow!==!1){const n=[],a=[];for(let d=0;d<=96;d++){const p=d/96*k;n.push(Math.cos(p),Math.sin(p),0,Math.cos(p),Math.sin(p),1)}for(let d=0;d<96;d++){const p=d*2;a.push(p,p+1,p+2,p+1,p+3,p+2)}const r=new o.BufferGeometry;r.setAttribute("position",new o.Float32BufferAttribute(n,3)),r.setIndex(a);const s=new o.ShaderMaterial({transparent:!0,depthWrite:!1,blending:o.AdditiveBlending,side:o.DoubleSide,fog:!1,uniforms:{uRainAxis:D.uRainAxis,uRainbow:D.uRainbow,uTime:D.uTime},vertexShader:`
        uniform vec3 uRainAxis; varying vec3 vDir;
        void main(){
          vec3 ax = normalize(uRainAxis), e1 = normalize(cross(vec3(0., 1., 0.), ax)), e2 = cross(ax, e1);
          float al = radians(mix(20.0, 58.0, position.z));
          vDir = ax*cos(al) + (e1*position.x + e2*position.y)*sin(al);
          vec4 cp = projectionMatrix*viewMatrix*vec4(cameraPosition + vDir*500.0, 1.0); cp.z = cp.w*0.99999; gl_Position = cp;
        }`,fragmentShader:`
        uniform vec3 uRainAxis; uniform float uRainbow, uTime; varying vec3 vDir;
        vec3 spec(float s){ return vec3(smoothstep(0.42, 0.78, s) + 0.4*(1.0 - smoothstep(0.0, 0.2, s)),
          smoothstep(0.12, 0.45, s)*(1.0 - smoothstep(0.62, 0.95, s)), 1.0 - smoothstep(0.22, 0.52, s)); }
        void main(){
          vec3 d = normalize(vDir); float a = degrees(acos(clamp(dot(d, normalize(uRainAxis)), -1.0, 1.0)));
          float s1 = (a - 40.2)/1.9, e1 = smoothstep(0.0, 0.18, s1)*(1.0 - smoothstep(0.82, 1.0, s1));
          float s2 = 1.0 - (a - 49.4)/4.4, e2 = smoothstep(0.0, 0.2, s2)*(1.0 - smoothstep(0.8, 1.0, s2));
          vec3 col = spec(clamp(s1, 0.0, 1.0))*e1 + spec(clamp(s2, 0.0, 1.0))*e2*0.16;
          col += vec3(0.95, 0.88, 0.7)*0.055*exp(-max(40.5 - a, 0.0)/4.5)*(1.0 - smoothstep(40.2, 41.2, a))*smoothstep(20.0, 26.0, a);
          float az = atan(d.x, d.z), rain = 0.78 + 0.22*sin(az*9.0 + uTime*0.21)*sin(az*4.0 - uTime*0.13);
          float hz = smoothstep(-0.03, 0.08, d.y)*(1.0 + 0.5*(1.0 - smoothstep(0.05, 0.4, d.y)));
          gl_FragColor = vec4(mix(col, vec3(dot(col, vec3(0.3, 0.5, 0.2))), 0.12)*uRainbow*0.37*rain*hz, 1.0);
        }`});_e=new o.Mesh(r,s),_e.name="double-rainbow",_e.frustumCulled=!1,_e.renderOrder=1,te.add(_e),Te+=192}await u.yield();const E=(t,n,a)=>new o.Vector3(t,n,a),yt=$.clone().negate(),St=E(.2,.35,-1).normalize(),at=42*Math.PI/180-Math.asin(Xe($.y,-1,1)),zt=Math.hypot($.x,$.z)||1,Ht=ot,Dt=Math.max(26,Math.min(34,je)),Gt={portalSeat:{position:E(oe,ge,-180),facing:E(0,0,1),radius:7},flyThrough:[E(oe,16,260),E(oe,13,150),E(oe,ge,70),E(oe,ge,0),E(oe,ge,-90),E(oe,ge,-180)],clearance:Ke,viewpoints:{reveal:E(oe,14,240),pass:E(oe,ge,20),under:E(-13,ie+4,15)},crown:{position:Wt.clone(),radius:je},nests:ae.slice(0,24).map(t=>E(t[0],t[1]-1.5,t[2])),trunkTop:E(Ce(z)[0],ie+z,Ce(z)[1]),hollow:{position:E(Math.sin(Z.th)*U,ie+Z.h*.45,Math.cos(Z.th)*U),facing:E(Math.sin(Z.th),0,Math.cos(Z.th))},lowLimb:Re?E(Re[0],Re[1],Re[2]):null,termites:pt.map(t=>E(t[0],t[1],t[2])),sunDir:$.clone(),antisolar:yt.clone(),rainbowApex:E(-$.x/zt*Math.cos(at),Math.sin(at),-$.z/zt*Math.cos(at)),lightning:[E(70,0,-650),E(-150,0,-900)],rise:{radius:_,height:R}},Lt=v.rainbowStrength??1,Ye={object:te,radius:Dt,height:Ht,center:E(0,ie+z*.78,0),anchors:Gt,ground:!0,groundY:0,uniforms:D,rainbow:_e,stats:{triangles:Math.round(Te),drawCalls:te.children.length,clearance:Ke},groundHeight:q,setProgress(t){D.uBurst.value=T(.66,.8,t)*(1-.45*T(.88,1,t)),D.uRainbow.value=Lt*(.3+.7*T(.3,.62,t))},setFlash(t,n){D.uFlash.value=Math.max(0,t||0),n&&St.fromArray(n.isVector3?n.toArray():n).normalize()},update(t,n){D.uTime.value=n,te.updateWorldMatrix(!0,!1),D.uRainAxis.value.copy(yt).transformDirection(te.matrixWorld),D.uFlashDir.value.copy(St).transformDirection(te.matrixWorld)},dispose(){}};return ee==="close"&&(Ye.radius=13,Ye.height=22,Ye.center=E(0,ie+13,0)),Ye}export{qt as buildHero};
