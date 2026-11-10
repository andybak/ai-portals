import*as s from"three";import{makePath as Na,clamp as fe,lerp as $,smoothstep as O}from"../kit/core.js";import*as st from"../kit/fx.js";import*as Ke from"../kit/fauna.js";import*as Je from"../kit/flora.js";import{buildHero as Ga,Acc as kt,addTube as et,addRope as Ht,addLashing as St,addStone as Ct,GLSL_COMMON as Ce}from"../parts/indigo-pits.js";const De=["#EDE6D6","#C99A5A","#10173A","#27479A","#A9C7EA","#B6C23A","#F26B1D"],tt=41,qe=Math.PI*2,be=0,re=-150,Et=27,_a=16.5,Oe=41,Ot=-14,jt=6.3,At=8.7,rt=4.4,lt=-17.15,je=12.6,Xt=20,Yt=19.5,at=-281,Ua=4.5,lo=5.3,it=-.5,ct=-50,ft=100,ut=-304,pt=368,Zt=i=>Ot-jt*i,$t=i=>lt-je*i,Qt=i=>i%2===1||i===0||$t(i)<-170,r=(i,m,y)=>new s.Vector3(i,m,y),E=(i,m=1)=>new s.Color(i).multiplyScalar(m),Ia={noon:{sun:[-.269,.883,-.385],sunCol:["#fff1d8",2.6],sky:["#8fa6d6",.4],gnd:["#c99a5a",.2],haze:["#f8e9cf",1.06],zen:["#5c88dc",.66],halo:1,pearl:.88,disc:[-.1,.72,-.69],gate:.8,amb:[.66,.76,1.22],fog:["#e6dcc8",.8],fogBlue:["#6f8fd4",.52],dens:.003,dust:1,wet:0,exposure:.98,sat:1.1,tint:"#fffaf2",shadow:"#0c1230",store:["#4e4a5c",.1],portal:"#ffd9a0",discGain:2.2,kCan:5,canOcc:1,occ:1,sparse:0,naveOpen:.62},evening:{sun:[.55,.44,-.71],sunCol:["#ffcd92",2.9],sky:["#8f9ccc",.4],gnd:["#a88a6a",.2],haze:["#f3ceb0",.86],zen:["#8d8cc8",.62],ambGain:3.5,bladeK:.45,soft:1,halo:0,gate:1.05,neemAmb:2.5,amb:[.82,.84,1.1],fog:["#dcc6c0",.72],fogBlue:["#8f92c8",.58],dens:.0034,dust:1.2,wet:0,exposure:1.06,sat:1.12,tint:"#fff2e6",shadow:"#141636",store:["#4c4c60",.1],portal:"#bcd4ff",discGain:3.2,kCan:6,canOcc:.3,occ:.16,sparse:1,naveOpen:.92},rain:{sun:[-.3,.84,-.45],sunCol:["#fffaf0",2.9],sky:["#6a8fdc",.5],gnd:["#8a6c4c",.22],haze:["#9cc4f0",.8],zen:["#2458c4",.8],amb:[.8,.86,1.12],fog:["#a9c6ea",.62],fogBlue:["#6f92d8",.55],dens:.0016,dust:.12,wet:1,exposure:1.1,sat:1.18,tint:"#f8fbff",shadow:"#0a1238",store:["#4c4c5c",.12],ambGain:3.3,door:["#e6ecf6",.9],halo:.35,gate:.85,portal:"#ffe2a8",discGain:3,kCan:6,canOcc:1,occ:1,sparse:0,naveOpen:.82},night:{sun:[-.35,.8,-.48],sunCol:["#b8c8ff",.62],sky:["#34478e",.24],gnd:["#1c2244",.12],haze:["#2a3666",.55],zen:["#0b1130",.5],amb:[.6,.72,1.2],fog:["#222c58",.5],fogBlue:["#1a2452",.5],dens:.003,dust:.3,wet:0,exposure:1.5,sat:.95,tint:"#eef2ff",shadow:"#040818",store:["#20243a",.08],portal:"#ffd28a",discGain:5,kCan:6,canOcc:.6,occ:1,sparse:0,naveOpen:.8}};function Va(i){const m=Zt(i),y=Math.floor(i/2),h=Qt(y),g=Math.abs(m-re),P=h?[11.5,23,34.5,46.5]:[17.25,31,46.5],D=h?[11.5,34.5,46.5]:[17.25,31,46.5],x=g<Et?Math.sqrt(Et*Et-g*g):0,c=m<re-1,V=Math.max(x>0?x+.3:0,c?11:_a),A=P.find(q=>q>=V)??46.5,S=D.filter(q=>q>=A);return S.includes(A)||S.unshift(A),{f:i,z:m,six:h,canyon:c,bound:A,xs:S,canopy:!c&&x===0}}function ya(i){const m=[];i.canopy&&m.push([-i.xs[0],i.xs[0],1]);for(let y=0;y+1<i.xs.length;y++)m.push([i.xs[y],i.xs[y+1],0]),m.push([-i.xs[y+1],-i.xs[y],0]);return m}function io(i,m){const y=fe(Math.round((lt-m)/je),0,Xt),h=$t(y),g=Qt(y),P=g?5.75:0,D=y>19,x=fe(Math.round((i-P)/11.5),D?-2:g?-3:-2,D?1:2),c=x*11.5+P;return Math.hypot(c-be,h-re)<14.8?[1e3,c,h]:[Math.hypot(i-c,m-h),c,h]}function Ne(i,m,y){const h=fe(i/7,0,1);return h<.45?m.copy(y.deep).lerp(y.blue,Math.pow(h/.45,1.25)):m.copy(y.blue).lerp(y.sky,Math.pow((h-.45)/.55,.85)),m}async function Ra(i,m,y,h){const g=[],P=new Array(Oe*8),D=new s.Color,x=[];for(let c=0;c<Oe;c++){const V=Va(c);x.push(V);const A=ya(V);for(let S=0;S<8;S++){const q=h.whiteDay&&m()<.3,d=m.range(3.45,3.95),L=m(),M=[];for(const[T,k,R]of A){if(R&&(S<h.kCan||h.sparse&&(c&1)===1)||c===Oe-1&&S<2)continue;const Z=Math.sign(T+k),U=Math.min(Math.abs(T),Math.abs(k))>30;let X=.965;R?X*=h.canOcc:h.sparse&&Z===h.sparse&&!V.canyon?X*=c&1?0:S<=1&&U?1:h.occ*(S<=1?.4:1):!V.canyon&&c<3&&Z===h.away&&(X=0);const pe=k-T-1.3,Q=Math.max(1,Math.round(pe/m.range(6.6,8.6)));let te=T+.65;for(let Ge=0;Ge<Q;Ge++){const de=pe/Q,ge=m.range(.22,.6),he=de-ge,me=te+de/2+m.range(-.08,.08);te+=de;const ze=m()<X;Ne(S+m.range(-.45,.45),D,y);const ie={};D.getHSL(ie),D.setHSL(ie.h+m.range(-.012,.012),fe(ie.s*m.range(.92,1.1),0,1),ie.l*m.range(.88,1.12)),q&&D.copy(y.haze).multiplyScalar(m.range(.7,.82));const ae=fe(d+m.range(-.75,.3),2.7,4.15),ve=S/7,Me=m();if(!ze)continue;const Ye=q?.5:$(.1,.5,ve*ve),_e={x:me,w:he,yTop:At+rt*S-.06,drop:ae,z:V.z,f:c,k:S,col:D.clone(),seed:Me,pat:q?.99:L,line:c*8+S,tr:[Math.pow(D.r,.7)*Ye*1.6,Math.pow(D.g,.7)*Ye*1.6,Math.pow(D.b,.7)*Ye*1.6].map(ot=>Math.min(ot,.85))};g.push(_e),M.push(me-he/2,me+he/2,_e.yTop-ae,_e.yTop,_e.tr[0],_e.tr[1],_e.tr[2])}}const z=[];for(let T=0;T<M.length;T+=7)z.push(T);z.sort((T,k)=>M[T]-M[k]);const C=new Float32Array(M.length);z.forEach((T,k)=>{for(let R=0;R<7;R++)C[k*7+R]=M[T+R]}),P[c*8+S]=C}(c&3)===3&&await i.yield?.()}return{list:g,buckets:P,plans:x}}function Ba(i,m,y){const h=i.x,g=i.y,P=Math.min(i.z,-.05),D=h<0?-15:15,x=[0,0,0],c=()=>(x[0]=x[1]=x[2]=0,x),V=(A,S,q,d,L,M,z)=>{const C=A-d,T=S-L,k=q-M,R=C*h+T*g+k*P,Z=C*C+T*T+k*k-z*z;return R*R-Z>0&&-R+Math.sqrt(R*R-Z)>0};return function(S,q,d){let L=1,M=1,z=1;if(d>.6){if(Math.abs(S)>=15||d>60)return x[0]=x[1]=x[2]=1,x;const C=Math.abs(h)>1e-4?(D-S)/h:-1,T=-d/P;if(C>0&&C<T){const Z=q+g*C,U=d+P*C,X=((U+6)%12+12)%12-6;return Z>10.6&&Z<13.6&&Math.abs(X)<.55&&U>8&&U<54?(x[0]=x[1]=x[2]=1,x):c()}const k=q+g*T,R=S+h*T;if(k>13||Math.abs(R)>8)return c();S=R,q=k,d=0}if(Math.abs(S)>47.2||d<-299)return x[0]=x[1]=x[2]=1,x;for(let C=Math.max(0,Math.ceil((Ot-d)/jt+1e-5));C<Oe;C++){const T=(Zt(C)-d)/P,k=q+g*T;if(k>39.6)break;const R=S+h*T;if(Math.abs(R)>47)break;const Z=Math.floor((k-4.3)/rt);if(Z<0||Z>7)continue;const U=m[C*8+Z];if(U){for(let X=0;X<U.length;X+=7)if(R>=U[X]&&R<=U[X+1]){k>=U[X+2]&&k<=U[X+3]&&(L*=U[X+4],M*=U[X+5],z*=U[X+6]);break}if(L+M+z<.02)return c()}}if(Math.abs(h)>1e-4){const C=((h>0?47.2:-47.2)-S)/h,T=q+g*C;if(d+P*C>-299&&T<18.2)return c()}{const C=(-299-d)/P;if(q+g*C<18.2)return c();const k=(-290-d)/P,R=q+g*k,Z=S+h*k;if(k>0&&Math.abs(Z)<15&&R<26)return c()}if(d<at+80&&(V(S,q,d,Yt,22.5,at,9.5)||V(S,q,d,-Yt,22.5,at,9.5))){const C=S-h*(q/g),T=d-P*(q/g),k=y.n2(C*.42+9,T*.42)+.5*y.n2(C*1.3,T*1.3+4),R=.16+.84*O(.25,.55,k);L*=R,M*=R,z*=R*.96}return x[0]=L,x[1]=M,x[2]=z,x}}async function Ha(i,m,y,h,g,P,D){const x=new Uint8Array(h*g*4),c=new Float32Array(h*g),V=new Float32Array(h*g);for(let q=0;q<g;q++){const d=ut+(q+.5)/g*pt;for(let L=0;L<h;L++){const M=ct+(L+.5)/h*ft,z=m(M,.02,d),C=(q*h+L)*4,T=y(M,d);V[q*h+L]=T,x[C]=z[0]*255,x[C+1]=z[1]*255,x[C+2]=z[2]*255,x[C+3]=T*255,c[q*h+L]=z[0]*.3+z[1]*.5+z[2]*.2}(q&3)===3&&await i.yield?.()}{const q=new Float32Array(h*g),d=-D.x/Math.max(D.y,.1),L=-D.z/Math.max(D.y,.1),M=Math.hypot(d,L)*42,z=Math.ceil(M/.3);for(let C=0;C<P.length;C++){const[T,k]=P[C];for(let R=2;R<=z;R++){const Z=R/z,U=T+d*42*Z,X=k+L*42*Z;if(Math.abs(U)>47||X>-1||X<-298)continue;const pe=(U-ct)/ft*h-.5,Q=(X-ut)/pt*g-.5,te=Math.floor(pe),Ge=Math.floor(Q),de=.62*(1-.6*Z);for(let ge=0;ge<2;ge++)for(let he=0;he<2;he++){const me=te+he,ze=Ge+ge;if(me<0||me>=h||ze<0||ze>=g)continue;const ie=de*(1-Math.abs(pe-me))*(1-Math.abs(Q-ze))*1.6,ae=ze*h+me;ie>q[ae]&&(q[ae]=Math.min(ie,.7))}}(C&31)===31&&await i.yield?.()}for(let C=0;C<h*g;C++)if(q[C]>0){const T=1-q[C],k=C*4;x[k]*=T,x[k+1]*=T,x[k+2]*=T,c[C]*=T}}const A=new s.DataTexture(x,h,g,s.RGBAFormat,s.UnsignedByteType);return A.colorSpace=s.NoColorSpace,A.magFilter=s.LinearFilter,A.minFilter=s.LinearMipmapLinearFilter,A.generateMipmaps=!0,A.wrapS=A.wrapT=s.ClampToEdgeWrapping,A.needsUpdate=!0,{tex:A,cpu:c,openAt:(q,d)=>{let L=0,M=0;for(let z=-8;z<=8;z+=4)for(let C=-8;C<=8;C+=4){const T=Math.round((q-ct)/ft*h)+C,k=Math.round((d-ut)/pt*g)+z;T>=0&&T<h&&k>=0&&k<g&&(L+=V[k*h+T],M++)}return M?L/M:1},W:h,L:g}}const Ae=Ce+`
  uniform sampler2D uShadeMap; uniform vec4 uShadeXf, uGateSun; uniform vec3 uAmbShade, uStoreAmb, uDoorCol, uFilt; uniform vec4 uGust; uniform float uWet, uAmbGain, uSoft;
  vec2 shadeUV(vec3 p){ vec2 g = p.xz - uSunDir.xz * (max(p.y, 0.) / max(uSunDir.y, .05));
    if (p.z < 0.) g = clamp(g, vec2(-46.5, -298.5), vec2(46.5, 100.));
    else if (abs(p.x) < 15.5) g = clamp(g, vec2(-14.7, -100.), vec2(14.7, 59.5));
    return (g - uShadeXf.xy) * uShadeXf.zw; }
  vec3 sunAt(vec3 p){
    vec2 uv = shadeUV(p);
    uv += vec2(sin(uTime * 1.9 + p.x * .31 + p.z * .07), sin(uTime * 2.6 + p.z * .23)) * uShadeXf.zw * .11 * step(p.z, 0.);
    vec3 s = texture2D(uShadeMap, uv).rgb; float hi = smoothstep(27., 41., p.y);
    float sf = uSoft * smoothstep(-258., -268., p.z); if (sf > 0.) s = mix(s, textureLod(uShadeMap, uv, 1.7).rgb, sf);
    return mix(s, vec3(1.), hi * hi * step(p.z, 0.));
  }
  float openAt(vec3 p){ return textureLod(uShadeMap, (p.xz - uShadeXf.xy) * uShadeXf.zw, 3.2).a; }
  vec3 ambAt(vec3 N, vec3 p){
    vec3 a = mix(uGndCol, uSkyCol, N.y * .5 + .5);
    float op = openAt(p);
    a *= mix(uAmbShade, vec3(1.), op) * uAmbGain;
    a += uGndCol * uSunCol * (.5 - .5 * N.y) * (.1 + .5 * op);        // sunlit earth thrown back up onto whatever stands over it
    float st = smoothstep(.2, 2.5, p.z);
    if (st > 0.) {
      vec3 dd = vec3(0., 6.5, -1.) - p; float d2 = dot(dd, dd);
      vec3 sp = uStoreAmb * (.55 + .45 * N.y) + uDoorCol * (max(dot(N, dd * inversesqrt(d2 + 1e-4)), 0.) * .8 + .2) * (700. / (700. + d2));
      a = mix(a, sp, st);
    }
    return a;
  }
  // THE GATE'S LIGHT. The gatehouse front faces away from the true sun, so it is given the same sun swung round until
  // it rakes across the face (uGateSun: direction to it, w = strength): through the arch onto the reveal, behind the
  // two buttresses their shadows, and over everything the neems' dapple, shifting as the crowns move.
  float gateZone(vec3 p){ return (1. - smoothstep(-287.4, -285.6, p.z)) * (1. - smoothstep(15.8, 16.8, abs(p.x))); }
  float gateLit(vec3 p){
    vec3 L = uGateSun.xyz; float lz = max(L.z, .05), dz = p.z + 290., lit = 1.;
    if (dz < -.06) {
      vec2 e = p.xy + L.xy * (-dz / lz);
      float sd = max(abs(e.x) - 8.5, e.y > 10.5 ? length(e - vec2(0., 10.5)) - 8.5 : -1.);
      lit = 1. - smoothstep(-.35, .35, sd);
    } else {
      float T = max(1.6 - dz, 0.) / lz, sx = L.x * T, lo = min(0., sx), hi = max(0., sx), on = smoothstep(0., .3, T * lz);
      float b0 = 12.6 - p.x, b1 = -12.6 - p.x;
      lit *= 1. - on * smoothstep(b0 - 1.5, b0 - 1.1, hi) * (1. - smoothstep(b0 + 1., b0 + 1.25, lo));
      lit *= 1. - on * smoothstep(b1 - 1.5, b1 - 1.1, hi) * (1. - smoothstep(b1 + 1., b1 + 1.25, lo));
    }
    float dap = fbm2(vec2(p.x + p.z * .7, p.y) * .3 + vec2(uTime * .045 + .12 * sin(uTime * .5 + p.y * .2), .1 * sin(uTime * .37 + p.x * .3)));
    lit *= mix(1., .22 + .78 * smoothstep(.36, .6, dap), .9 * smoothstep(3., 13., p.y));
    return lit * uGateSun.w;
  }
`,Te=`#include <common>
#include <fog_pars_vertex>
`,Pe=`#include <common>
#include <fog_pars_fragment>
`;function xa(i,m,y){const h=new s.PlaneGeometry(1,1,i,m);h.translate(0,-.5,0);const g=new s.InstancedBufferGeometry;g.setIndex(h.index),g.setAttribute("position",h.attributes.position);const P=y.length,D=new Float32Array(P*4),x=new Float32Array(P*4),c=new Float32Array(P*4),V=new Float32Array(P*3);return y.forEach((A,S)=>{D.set([A.x,A.yTop,A.z,A.w],S*4),x.set([A.drop,A.seed*40,A.pat,A.kind||0],S*4),c.set([A.lt??1,A.lb??1,A.lean||0,A.line??-1],S*4),V.set([A.col.r,A.col.g,A.col.b],S*3)}),g.setAttribute("aO",new s.InstancedBufferAttribute(D,4)),g.setAttribute("aD",new s.InstancedBufferAttribute(x,4)),g.setAttribute("aL",new s.InstancedBufferAttribute(c,4)),g.setAttribute("aC",new s.InstancedBufferAttribute(V,3)),g.instanceCount=P,g.boundingSphere=new s.Sphere(r(0,20,-150),400),g}function Ea(i){return new s.ShaderMaterial({uniforms:i,fog:!0,side:s.DoubleSide,vertexShader:Te+Ae+`
      attribute vec4 aO, aD, aL; attribute vec3 aC;
      uniform vec4 uStrip; uniform float uTripU;
      varying vec3 vW, vN, vCol; varying vec4 vQ; varying vec4 vI; varying vec2 vWH; varying float vSl;
      float gustAt(float z, float x){
        float q = fract((-z - 16. * uTime) / 144. + .08 * sin(x * .05));
        float g = q * q * q * q * smoothstep(1., .94, q);
        float d = z - uGust.x;
        return g + uGust.y * smoothstep(-5., 4., d) * exp(-max(d, 0.) / max(uGust.z, 1.));
      }
      float dispF(float s, float t, float H, float gust, float ph, float lean, float kind, float W){
        float wgt = pow(t + 1e-4, 1.3);
        float fl = sin(t * 5.1 - uTime * 3.1 + ph + s * 2.3) * .17 + sin(t * 11.3 - uTime * 5.3 + ph * 1.7 - s * 3.1) * .06 + sin(t * 2.2 - uTime * 1.3 + ph * .6) * .2;
        if (kind > .5 && kind < 1.5) {
          float sw = (sin(uTime * .8 + ph) * .9 + sin(uTime * 1.7 + ph * 2.) * .4) * (1. - clamp(gust * 1.6, 0., 1.));
          return (-sw * H * .11 + gust * H * .2 - fl * .4 - .5) * wgt;
        }
        float pleat = sin(s * W * 1.6 + ph * 3.) * .14 * smoothstep(0., .3, t) * (1. - .5 * clamp(gust, 0., 1.));
        if (kind > 2.5) {                 // on the wall: it bellies out from the mud and is slapped flat by the gust, ripples running down it
          float g = clamp(gust * 1.3, 0., 1.);
          float outw = (.34 + .24 * sin(uTime * .9 + ph) + .12 * sin(uTime * 2.1 + ph * 2.3 + t * 3.)) * H * .085 * (.6 + .4 * cos(s * 3.1416));
          return max(outw * (1. - .92 * g) + fl * (.5 + .7 * g) + .22 * g * sin(t * 9. - uTime * 7. + ph), -.14) * wgt + pleat * .6;
        }
        float belly = (.5 + .34 * sin(uTime * .5 + ph * 1.3) + 1.5 * gust) * H * .25 * (.72 + .28 * cos(s * 3.1416)) + (s * sin(ph * 5.) * .6 + .3 * sin(uTime * .37 + ph * 2.1)) * H * .09;
        // a wet length is heavy: a slow deep belly, little flutter
        if (kind > 1.5) return -(belly * .42 + fl * .3 + .16 * H * .1 * sin(uTime * .8 + ph + t * 2.)) * wgt + pleat * 1.5;
        return (-(belly + fl * (.7 + 1.1 * gust)) + lean) * wgt + pleat;
      }
      void main(){
        float s = position.x, t = -position.y, kind = aD.w, W = aO.w, H = aD.x, ph = aD.y;
        vec3 base = aO.xyz;
        bool str = kind > .5 && kind < 1.5, jamb = kind > 2.5 && abs(aL.z) > .5;
        vec3 ax = (str || jamb) ? vec3(0., 0., 1.) : vec3(1., 0., 0.);
        vec3 nz = (str || jamb) ? vec3(aL.z, 0., 0.) : vec3(0., 0., 1.);
        if (kind > 1.5 && kind < 2.5) base.y -= 6. * (aL.w < -1.5 ? uTripU : .62 + .38 * sin(uTime * .21 + ph));
        if (abs(aL.w - uStrip.x) < .5) H *= 1. - uStrip.y;
        float gust = gustAt(base.z, base.x), lean = (str || kind > 2.5) ? 0. : aL.z, e = .02;
        // no two lengths hang alike: a skewed, curved hem and a little turn on the rope
        float hang = kind < .5 ? 1. : kind > 1.5 ? .7 : 0., yaw = (kind < .5 ? 1. : 0.) * .16 * sin(ph * 3.3) * W;
        H *= 1. + .05 * sin(s * 5. + ph) + (.05 + .16 * hang) * s * sin(ph * 9.) + .11 * hang * cos(s * 6.2832) * sin(ph * 4.3);
        float f0 = dispF(s, t, H, gust, ph, lean, kind, W), fs = dispF(s + e, t, H, gust, ph, lean, kind, W), ft = dispF(s, t + e, H, gust, ph, lean, kind, W);
        float gath = (kind > 1.5 && kind < 2.5) ? 1. - .17 * t - .05 * sin(t * 5. + ph) * t : 1.;           // a wet length hangs gathered, narrower toward its hem
        vec3 p = base + ax * (s * W * gath * (1. - .03 * min(abs(f0), 1.5))) - vec3(0., t * H, 0.) + nz * (f0 + s * yaw * t);
        p.y += f0 * f0 / (2. * max(t * H, .6)) * .8 - .09 * abs(sin(s * W * 3.9 + ph)) * (1. - t);
        if (str) p.z -= gust * pow(t + 1e-4, 1.5) * 3.;
        vec3 dps = ax * W + nz * ((fs - f0) / e + yaw * t), dpt = vec3(0., -H, 0.) + nz * ((ft - f0) / e + s * yaw);
        vN = normalize(cross(dpt, dps) + vec3(0., 0., 1e-5));
        vW = p; vCol = aC; vQ = vec4(s * W, t * H, t, kind); vWH = vec2(W, H);
        vI = vec4(mix(aL.x, aL.y, t), ph, aD.z, (ft - f0) / e / max(H, .1)); vSl = (fs - f0) / e / max(W, .1);
        vec4 mvPosition = viewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:Pe+Ae+`
      uniform vec3 uPale, uTrip[5];
      varying vec3 vW, vN, vCol; varying vec4 vQ; varying vec4 vI; varying vec2 vWH; varying float vSl;
      void main(){
        vec3 N = normalize(vN + vec3(0., 0., 1e-5)); if (!gl_FrontFacing) N = -N;
        vec2 q = vQ.xy; float t = vQ.z, kind = vQ.w, W2 = vWH.x * .5, H = vWH.y, seed = vI.y, pt = vI.z;
        float fq = fwidth(q.y) + fwidth(q.x), aa = fq * 1.5;
        vec3 alb = vCol; float wet = 0., trip = (kind > 1.5 && kind < 2.5) ? 1. : 0., wall = kind > 2.5 ? 1. : 0.;
        if (trip > .5) {                   // out of the vat: green only in its lowest metres, teal, then blue as the air takes it
          float h = vW.y + .5 + (vn2(q * vec2(.9, .3) + seed) - .5) * 1.3;
          alb = mix(uTrip[0], uTrip[1], smoothstep(.2, 1.5, h)); alb = mix(alb, uTrip[2], smoothstep(1.3, 3.2, h)); alb = mix(alb, uTrip[3], smoothstep(2.8, 5.6, h)); alb = mix(alb, uTrip[4], smoothstep(5., 10., h));
          wet = 1. - smoothstep(3., 12., h); pt = .1;
          // liquor still running down it: dark streaks sliding, darker where the cloth is gathered
          float strk = vn2(vec2(q.x * 4.1 + seed, q.y * .32 - uTime * .22)) * .65 + vn2(vec2(q.x * 11. + seed * 3., q.y * .7 - uTime * .5)) * .35;
          alb *= .62 * mix(1., .5, smoothstep(.42, .72, strk) * (.45 + .55 * wet));
        }
        float mott = fbm2(q * 1.3 + seed * 3.7);
        alb *= .8 + .4 * mott;
        float res = 0.;
        if (pt < .14) {
          float sc = mix(1.3, 2.3, fract(seed * .37)); vec2 g = q / sc + seed; vec2 id = floor(g); g.x += .5 * mod(id.y, 2.); vec2 f = fract(g) - .5; float r = length(f) * 1.5 * (1. + .06 * sin(atan(f.y, f.x + 1e-5) * 5. + id.x * 5. + id.y));
          res = (1. - smoothstep(.5, .54 + aa, r)) * smoothstep(.2, .24 + aa, r) * (.55 + .45 * vn2(vec2(atan(f.y, f.x + 1e-5) * 5., r * 9.))) + (1. - smoothstep(.07, .1 + aa, r));
        } else if (pt < .24) {
          float sx = abs(fract(q.x / .9 + seed) - .5) * .9;
          res = (1. - smoothstep(.06, .08 + aa, sx)) * (.55 + .45 * step(.3, fract(q.y * 2.3 + vn2(q * 2.))));
        } else if (pt < .33) {
          vec2 g = q / .62; g.y += .5 * mod(floor(g.x), 2.); vec2 f = fract(g) - .5; float r = length(f) * .62;
          res = 1. - smoothstep(.1, .13 + aa, r);
        }
        res = clamp(res, 0., 1.) * (1. - smoothstep(.12, .5, fq)) * (.6 + .4 * mott);
        alb = mix(alb, mix(alb * 1.6, uPale, .34), res * .8);
        float wv = sin(q.x * 150.) * sin(q.y * 150.) * (1. - smoothstep(.004, .02, fq));
        float slub = vn2(vec2(q.x * 2.5, q.y * 50.)) * .5 + vn2(vec2(q.x * 50., q.y * 2.5)) * .5;
        alb *= 1. + .1 * wv + .18 * (slub - .5) * (1. - smoothstep(.05, .3, fq));
        float hem = smoothstep(H - .22, H - .15, q.y), sel = smoothstep(W2 - .1, W2 - .05, abs(q.x)), top = 1. - smoothstep(.12, .2, q.y);
        float dbl = max(max(hem, sel), top);
        alb *= 1. - .3 * dbl;
        float lum = dot(alb, vec3(.3, .5, .2));
        float thin = mix(.42, 1.15, smoothstep(.01, .35, lum)) * (1. - .5 * dbl) * mix(1., 1.25, res) * (1. - .76 * trip);
        float lt = pow(vI.x + 1e-3, .62);
        vec3 sunL = uSunCol * mix(uFilt, vec3(1.), smoothstep(.15, .9, lt)) * lt;
        if (wall > .5) sunL = uSunCol * gateLit(vW);
        vec3 Ls = wall > .5 ? uGateSun.xyz : uSunDir;
        float ndl = dot(N, Ls), front = max(ndl, 0.), back = max(-ndl, 0.) * (1. - wall);
        vec3 amb = mix(uGndCol, uSkyCol, N.y * .5 + .5) * mix(uAmbShade, vec3(1.), smoothstep(.1, .8, lt)) * uAmbGain * .62;
        vec3 tcol = pow(alb + 1e-4, vec3(.86)); float tl = dot(tcol, vec3(.3, .5, .2)); tcol = max(mix(vec3(tl), tcol, 1.75 - .6 * trip), 0.);
        // drapery: one broad fold that holds at any distance, finer ones near; a belly that is lighter than the gathered top
        float plf = 1. - smoothstep(.3, 1.5, fq);
        float pl = (cos(q.x * 1.7 + seed * 3.) * .6 + (cos(q.x * 4.7 - seed) * .4 + cos(q.x * 9.3 + seed * 2.) * .15) * plf) * smoothstep(0., 1.2, q.y);
        float foldSh = (1. - .5 * clamp(abs(vI.w) * 1.4, 0., .6)) * (1. + clamp(vSl * (1.7 + 1.6 * trip) + pl * (.4 + .3 * trip + .25 * wall), -.5, .5)) * (.74 + .4 * sin(t * 2.7 + .25));
        vec3 c = alb * (sunL * (front * .8 + .05) + amb) * foldSh + tcol * sunL * (pow(back + 1e-4, .55) * .8 + front * .2) * thin * (.6 + .4 * foldSh);
        vec3 V = normalize(cameraPosition - vW + vec3(1e-5)), Hh = normalize(Ls + V + vec3(1e-5));
        // the sun itself, seen through the cloth, is a soft burning patch
        float thru = max(dot(-V, uSunDir), 0.); thru *= thru; thru *= thru; thru *= thru;
        c += min(tcol, vec3(1.)) * sunL * thin * step(ndl, 0.) * (thru * .22 + thru * thru * thru * .7) * (1. - wall);
        // the last cloths before the gate, against a low sun: the hem and the selvages burn gold
        float gEdge = max(smoothstep(H - .42, H - .07, q.y), smoothstep(W2 - .26, W2 - .04, abs(q.x))) * smoothstep(-214., -246., vW.z) * (1. - smoothstep(.5, .75, uSunDir.y));
        c += uSunCol * vec3(1., .78, .46) * gEdge * (.3 + .7 * max(dot(-V, uSunDir), 0.)) * (.35 + .65 * lt) * .44 * (1. - wall) * (1. - trip);
        // on the gatehouse the raking light catches every fold's edge
        c += alb * sunL * wall * pow(clamp(1. - abs(dot(N, V)), 0., 1.), 3.) * .6;
        float glaze = (1. - smoothstep(.03, .12, lum)) * .25 + wet * 1.2;
        c += sunL * pow(max(dot(N, Hh), 0.), 60.) * glaze * step(0., ndl);
        gl_FragColor = vec4(max(c, 0.), 1.);
        #include <fog_fragment>
      }`})}const Kt=`
  vec3 pitAt(vec2 p){
    float k = clamp(floor((${lt.toFixed(2)} - p.y) / ${je.toFixed(1)} + .5), 0., ${Xt.toFixed(1)}), zr = ${lt.toFixed(2)} - ${je.toFixed(1)} * k;
    float six = (mod(k, 2.) > .5 || zr < -170. || k < .5) ? 1. : 0., xo = six * 5.75;
    float col = clamp(floor((p.x - xo) / 11.5 + .5), k > 19.5 ? -2. : six > .5 ? -3. : -2., k > 19.5 ? 1. : 2.);
    vec2 c = vec2(col * 11.5 + xo, zr); float d = length(p - c);
    if (length(c - vec2(0., -150.)) < 14.8) d = 1e3;
    return vec3(d, c);
  }`;function Oa(i){return new s.ShaderMaterial({uniforms:i,fog:!0,vertexShader:Te+`
      varying vec3 vW;
      void main(){ vW = position; vec4 mvPosition = viewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:Pe+Ae+Kt+`
      uniform vec3 uEarth, uStain, uReed;
      varying vec3 vW;
      void main(){
        vec2 p = vW.xz; vec3 pi = pitAt(p); float d = pi.x, dh = length(p - vec2(0., -150.));
        // what needs the neighbouring pixels (the two widths, the shade map's level) is taken before the holes are cut: past a discard it is not defined
        float fpx = fwidth(p.x) + fwidth(p.y);
        float crv = abs(fbm2(p * .8 + 20.) - .5), crw = fwidth(crv) + 1e-4;
        vec3 P3 = vec3(p.x, 0., p.y), sunT = sunAt(P3);
        if (d < 5.08 || dh < 8.6) discard;
        float store = smoothstep(.3, 1.4, p.y), yard = step(p.y, 0.);
        float fine = 1. - smoothstep(.03, .22, fpx);
        float mo = fbm2(p * .33 + 4.), fi = mix(.5, vn2(p * 6.) * .6 + vn2(p * 19.) * .4, fine);
        float peb = smoothstep(.8, .9, vn2(p * 11. + 50.)) * fine;
        float cr = (1. - smoothstep(.6, 1.6, crv / crw)) * (1. - smoothstep(.01, .06, crw));
        vec3 alb = uEarth * (.72 + .4 * mo) * (.82 + .32 * fi);
        float rf = (${lt.toFixed(2)} - p.y) / ${je.toFixed(1)}, lz = abs(fract(rf) - .5) * ${je.toFixed(1)}, rk = floor(rf);
        float inRows = step(p.y, -9.5) * step(-278.5, p.y);
        float path = (1. - smoothstep(.7, 2.3, lz + 1.4 * (vn2(p * .3) - .5))) * inRows * (1. - smoothstep(34., 44., abs(p.x)));
        path = max(path, (1. - smoothstep(2., 5., abs(p.x + 1.5 * sin(p.y * .11)))) * smoothstep(-13., -5., p.y));
        path = max(path, smoothstep(-275., -282., p.y) * (.35 + .65 * mo));
        path *= yard;
        alb = mix(alb, uEarth * 1.3 * (.9 + .12 * fi), path * (.45 + .4 * mo));
        alb *= 1. - .35 * cr * (1. - path); alb = mix(alb, alb * .55 + .03, peb * .6);
        // the forecourt: the trodden way to the arch, damp and dry patches, fallen neem leaflets up to the threshold
        float gz = smoothstep(-274., -281., p.y) * yard, wx = abs(p.x + 1.2 * sin(p.y * .21));
        float way = (1. - smoothstep(1.5, 6.5, wx + 4. * (mo - .5))) * gz;
        alb *= mix(1., .52 + .9 * smoothstep(.32, .62, fbm2(p * .22 + 31.)), gz);
        alb = mix(alb, uEarth * 1.55 * (.8 + .4 * fi), way * .7);
        alb = mix(alb, vec3(.6, .5, .1), smoothstep(.68, .76, vn2(p * 4.1 + 17.) * (.6 + .4 * vn2(p * .4))) * smoothstep(-268., -276., p.y) * (1. - smoothstep(.12, .7, fpx)) * .9);
        float lipD = min(d - 5.3, dh - 8.7);
        float halo = exp(-max(lipD, 0.) / .62) * (.5 + .8 * mo);
        float splash = .4 * smoothstep(.66, .95, vn2(p * 1.6 + 9.) * .7 + .3 * vn2(p * 4.7 + 2.) + .22 * exp(-max(lipD, 0.) / 3.));
        float st = clamp(halo + splash * .7, 0., 1.) * step(p.y, -6.) * step(-279., p.y);
        alb = mix(alb, uStain * (.6 + .5 * fi), st * .62);
        // run-off runnels trickling along some of the lanes
        float on = max(step(.3, h11(rk + 3.)), step(19.5, rk)) * inRows * smoothstep(13., 17., dh) * (1. - smoothstep(30., 36., abs(p.x)));
        float sgn = h11(rk + 9.) > .5 ? 1. : -1.;
        float ac = (fract(rf) - .5) * ${je.toFixed(1)} + 1.1 * sin(p.x * .37 + rk * 2.) + .3 * sin(p.x * 1.3 + rk);
        float rw = .13 + .12 * vn2(vec2(p.x * .7, rk));
        float run = (1. - smoothstep(rw, rw + .09, abs(ac))) * on, bank = (1. - smoothstep(rw, rw + .8, abs(ac))) * on;
        alb = mix(alb, alb * .55 + uStain * .25, bank * .7);
        float flow = vn2(vec2(p.x * 3. - uTime * 1.5 * sgn, ac * 9.)) * .6 + vn2(vec2(p.x * 9. - uTime * 3.2 * sgn, ac * 20.)) * .4;
        // the store: reed mats down the middle, darker trodden earth
        if (store > 0.) {
          vec2 m = vec2((p.x + 10.5) / 7., p.y / 9.4), mf = fract(m);
          float inMat = step(abs(p.x), 10.5) * step(.012, mf.x) * step(mf.x, .988) * step(.01, mf.y) * step(mf.y, .99);
          float wea = .5 + .5 * sin(p.x * 16. + floor(p.y * 5.) * 3.1416), band = step(.86, mf.y) + step(mf.y, .14);
          vec3 reed = uReed * (.62 + .38 * wea) * (.8 + .3 * h21(floor(m) + 3.)) * mix(1., .55, band * step(.5, fract(p.x * 1.4)));
          alb = mix(alb, mix(alb * .8, reed, inMat * (.82 + .18 * mo)), store);
        }
        float wetK = uWet * yard;
        float pud = smoothstep(.5, .64, fbm2(p * .2 + 77.) + .1 * path) * wetK * smoothstep(.3, 1.5, lipD);
        alb *= 1. - .34 * wetK;
        float contact = 1. - .45 * exp(-max(lipD, 0.) * 1.6);
        contact *= 1. - .5 * exp(-max(48. - abs(p.x), 0.) * .3) * yard;
        vec3 amb = ambAt(vec3(0., 1., 0.), P3);
        // the forecourt in the gatehouse's shade: open sky and the sunlit earth beyond fill it, cool and readable
        float gate = gz * (1. - smoothstep(.05, .5, dot(sunT, vec3(.333))));
        amb *= 1. + .55 * gate; amb += uGndCol * uSunCol * .32 * gate;
        vec3 c = alb * (uSunCol * uSunDir.y * sunT + amb * contact);
        float pool = smoothstep(.5, .66, fbm2(p * .17 + vec2(uTime * .02, 3.) + .1 * sin(uTime * .4 + p.x * .3))) * smoothstep(-268., -276., p.y) * yard * (1. - smoothstep(.3, .8, dot(sunT, vec3(.333))));
        c += alb * uSunCol * pool * .34 * uGateSun.w;
        float op = openAt(P3);
        vec3 V = normalize(cameraPosition - vW + vec3(1e-5));
        vec3 R = normalize(vec3(-V.x, abs(V.y) + .02, -V.z) + vec3(.06 * (flow - .5), 0., .06 * (fi - .5)));
        vec3 skyR = skyAt(R) * mix(uAmbShade * .35, vec3(1.), op);
        float fr = .25 + .75 * pow(1. - abs(V.y), 3.);
        c = mix(c, skyR * (.45 + .4 * flow) + uStain * .1 * amb + uSunCol * sunT * step(.93, flow) * 1.2, run * .9);
        c = mix(c, skyR * fr + alb * amb * .3 + uSunCol * sunT * pow(max(dot(R, uSunDir), 0.), 300.) * 6., pud * .9);
        gl_FragColor = vec4(max(c, 0.), 1.);
        #include <fog_fragment>
      }`})}function ja(){const i=[[4.47,-.95],[4.49,-.1],[4.6,.09],[4.92,.14],[5.2,.08],[5.42,-.08]].reverse().map(A=>new s.Vector2(A[0],A[1])),m=new s.LatheGeometry(i,24),y=new s.CircleGeometry(Ua,24);y.rotateX(-Math.PI/2),y.translate(0,it,0);const h=m.attributes.position.count,g=y.attributes.position.count,P=new Float32Array((h+g)*3),D=new Float32Array((h+g)*3),x=new Float32Array(h+g),c=[];P.set(m.attributes.position.array),P.set(y.attributes.position.array,h*3),D.set(m.attributes.normal.array),D.set(y.attributes.normal.array,h*3),x.fill(1,h);for(const A of m.index.array)c.push(A);for(const A of y.index.array)c.push(A+h);const V=new s.BufferGeometry;return V.setAttribute("position",new s.BufferAttribute(P,3)),V.setAttribute("normal",new s.BufferAttribute(D,3)),V.setAttribute("aPart",new s.BufferAttribute(x,1)),V.setIndex(c),m.dispose(),y.dispose(),V}function Xa(i){return new s.ShaderMaterial({uniforms:i,fog:!0,vertexShader:Te+`
      attribute float aPart; attribute float aSeed; attribute vec3 aTrip;
      varying vec3 vW, vL, vN, vT; varying vec2 vP, vC;
      void main(){ vL = position; vN = normal; vP = vec2(aPart, aSeed); vT = aTrip; vC = instanceMatrix[3].xz; vec4 w = instanceMatrix * vec4(position, 1.); vW = w.xyz;
        vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:Pe+Ae+`
      uniform vec3 uTier[8], uFoam, uLiquor, uCement, uStain, uFarRefl, uTrip[5]; uniform vec4 uPlan; uniform vec2 uPlanB; uniform float uTripU;
      varying vec3 vW, vL, vN, vT; varying vec2 vP, vC;
      // uPlan: nave half-width, lowest canopy tier, the side taken in (0 none), what still hangs there; uPlanB: canopy share
      vec4 clothAt(vec3 h, float f){
        float tk = (h.y - 4.3) / 4.4, k = floor(tk);
        if (k < 0. || k > 7.) return vec4(0.);
        float can = step(h.z, -151.), ax = abs(h.x), nave = (1. - can) * step(ax, uPlan.x);
        float cell = floor(h.x / 7.9 + h11(f * 7. + k)), hc = h11(cell * 3.7 + f * 1.3 + k * 5.1);
        float ok = step(.14, fract(tk)) * step(28., length(h.xz - vec2(0., -150.))) * step(ax, 46.5);
        ok *= mix(1., step(uPlan.y, k) * step(hc, uPlanB.x), nave);
        ok *= mix(1., step(11.8, ax), can);
        ok *= mix(1., step(hc, uPlan.w), step(.5, h.x * uPlan.z) * (1. - nave));
        ok *= step(.04, fract(h.x / 7.9 + h11(f * 7. + k))) * (1. - step(39.5, f) * (1. - step(2., k)));
        vec3 tc = uTier[int(k)] * (.8 + .4 * h11(cell + f * 3.1 + k));
        float lk = mix(.12, 1., k / 7.);
        vec3 tcol = pow(tc + 1e-4, vec3(.8));
        return vec4(tc * uSkyCol * 1.1 + tcol * uSunCol * lk * .42 * mix(.45, 1.1, smoothstep(.02, .35, tc.b)), ok);
      }
      vec3 hallRefl(vec3 P, vec3 R){
        vec3 sky = skyAt(R); float dz = abs(R.z) < 1e-3 ? -1e-3 : R.z;
        float f0 = (-14. - P.z) / 6.3, stepF = dz < 0. ? 1. : -1.;
        float fi = dz < 0. ? floor(f0) + 1. : ceil(f0) - 1.;
        vec3 acc = vec3(0.); float tr = 1., lastY = 0., lastX = P.x;
        for (int i = 0; i < 6; i++) {
          float ff = fi + stepF * float(i);
          if (ff < 0. || ff > 40.) { lastY = 99.; break; }
          vec3 h = P + R * ((-14. - 6.3 * ff - P.z) / dz); lastY = h.y; lastX = h.x;
          if (h.y > 39.6) break;
          vec4 c = clothAt(h, ff); acc += tr * c.a * c.rgb; tr *= 1. - c.a;
        }
        // what lies beyond the last row looked at: open sky down the nave and over the side taken in, far cloth elsewhere
        float open = max(step(abs(lastX), uPlan.x) * .9, step(.5, lastX * uPlan.z) * (1. - uPlan.w) * .85);
        vec3 far = mix(uFarRefl, sky, max(smoothstep(30., 39.6, lastY), open));
        return acc + tr * far;
      }
      float ringAt(vec2 p, vec2 c, float age){ float d = length(p - c), r = age * 1.6;
        return sin((d - r) * 14.) * exp(-abs(d - r) * 3.) * (1. - age) * smoothstep(0., .08, age); }
      float hgtAt(vec2 p, float seed){
        float h = 0.;
        for (int i = 0; i < 3; i++) {
          float fi = float(i), per = 2.2 + h11(seed * 7. + fi) * 2.4, tt = uTime / per + h11(seed * 3. + fi * 5.);
          vec2 c = (h22(vec2(fi + seed * 13., floor(tt))) - .5) * 6.;
          h += ringAt(p, c, fract(tt)) * .55;
        }
        return h + (fbm2(p * .8 + vec2(uTime * .07, -uTime * .05) + seed * 9.) - .5) * .45;
      }
      void main(){
        vec3 V = normalize(cameraPosition - vW + vec3(1e-5)); float seed = vP.y; vec2 p = vL.xz; float r = length(p);
        vec3 c;
        if (vP.x < .5) {
          vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
          float sp = vn3(vW * 7.) * .5 + vn3(vW * 23.) * .5, wear = fbm2(vW.xz * .5 + 9.);
          float an = atan(p.y, p.x + 1e-5), joint = smoothstep(.0, .02, abs(fract(an / 6.2832 * 7. + seed) - .5) * 2. * 3.1416 * r / 7. * .2);
          vec3 alb = uCement * (.78 + .36 * sp) * mix(.6, 1., joint);
          alb = mix(alb, alb * 1.12 + .02, smoothstep(.45, .7, wear) * .5);
          float st = smoothstep(4.95, 4.55, r) * (.55 + .45 * wear) + smoothstep(.55, .9, vn2(vec2(an * 9., seed * 5.))) * .22;
          if (vL.y < -.06) st = 1.;
          alb = mix(alb, uStain * .55, clamp(st, 0., 1.) * .86);
          if (vL.y < -.06) alb *= mix(.25, .7, smoothstep(-.9, -.06, vL.y));
          alb *= 1. - .4 * uWet;
          float ndl = max(dot(N, uSunDir), 0.);
          c = alb * (uSunCol * sunAt(vW) * ndl + ambAt(N, vW));
          c += uSunCol * sunAt(vW) * uWet * .15 * pow(max(dot(reflect(-V, N), uSunDir), 0.), 30.);
        } else {
          float h0 = hgtAt(p, seed), hx = hgtAt(p + vec2(.07, 0.), seed), hz = hgtAt(p + vec2(0., .07), seed);
          vec3 N = normalize(vec3(-(hx - h0) / .07 * .06, 1., -(hz - h0) / .07 * .06));
          vec3 R = reflect(-V, N); R.y = abs(R.y) + 1e-3; R = normalize(R);
          float fres = .13 + .87 * pow(clamp(1. - dot(N, V), 0., 1.), 3.4);
          vec3 sunT = sunAt(vW), refl = hallRefl(vW, R); vec4 tripC = vec4(0.);
          if (vT.x > 0.) {                 // the wet length on this pit's tripod, upside down in its own liquor
            float m = vT.z > .5 ? uTripU : .62 + .38 * sin(uTime * .21 + vT.y), top = 15. - 6. * m, bot = max(top - 12.5, -.5);
            float rz = abs(R.z) < 1e-3 ? 1e-3 : R.z, tz = (vC.y - vW.z) / rz;
            vec3 h = vW + R * max(tz, 0.);
            float on = step(0., tz) * (1. - smoothstep(vT.x - .12, vT.x + .12, abs(h.x - vC.x))) * smoothstep(bot - .15, bot + .15, h.y) * (1. - smoothstep(top - .2, top + .1, h.y));
            float hh = h.y + .5;
            vec3 tc = mix(uTrip[0], uTrip[1], smoothstep(.2, 1.5, hh)); tc = mix(tc, uTrip[2], smoothstep(1.3, 3.2, hh)); tc = mix(tc, uTrip[3], smoothstep(2.8, 5.6, hh)); tc = mix(tc, uTrip[4], smoothstep(5., 10., hh));
            tc *= .55 + .3 * vn2(vec2((h.x - vC.x) * 4.1, h.y * .32 - uTime * .22));
            tripC = vec4(tc * (uSkyCol * 1.5 + uSunCol * sunT * .3), on);
            refl = mix(refl, tripC.rgb, on * .92);
          }
          float sg = max(dot(R, uSunDir), 0.);
          refl += uSunCol * sunT * (pow(sg, 700.) * 12. + pow(sg, 90.) * .5);
          float ang = atan(p.y, p.x + 1e-5) + uTime * (.05 + .04 * h11(seed * 5.)) + r * .14;
          vec2 fp = vec2(cos(ang), sin(ang)) * r;
          float fo = fbm2(fp * .6 + seed * 31.) + .35 * vn2(fp * 2.3);
          float raft = smoothstep(.98, 1.08, fo + .2 * smoothstep(1.4, 3.2, r) - .15 * smoothstep(3.6, 4.4, r) + .1 * (vn2(fp * 6.) - .5));
          raft *= smoothstep(.7, 1.8, r);
          raft = max(raft, smoothstep(4.15, 4.45, r + (vn2(p * 3.) - .5) * .5) * .7 * smoothstep(.3, .6, vn2(fp * 1.7 + 4.)));
          float bub = vn2(fp * 14.) * .6 + vn2(fp * 37.) * .4;
          vec3 amb = ambAt(vec3(0., 1., 0.), vW) * 1.2;
          vec3 foamC = uFoam * (.3 + 1.1 * bub * bub) * (uSunCol * sunT * (max(dot(N, uSunDir), 0.) * .8 + .12) + amb);
          foamC += uSunCol * sunT * step(.86, bub) * .3 * vec3(1., .8, .5);
          // deep indigo liquor: it tints what it mirrors except at a glancing angle
          c = mix(uLiquor * (uSunCol * sunT * .3 + amb), refl * mix(vec3(.4, .5, 1.), vec3(1.), fres * fres), clamp(fres * .85 + .05, 0., 1.));
          c = mix(c, tripC.rgb * .8, tripC.a * .5);
          // the vat's copper skin: a thin metallic film drifting between the foam, copper to violet with the angle
          float skin = smoothstep(.56, .74, fbm2(fp * .8 + seed * 17. + 5.) + .12 * (vn2(fp * 5.) - .5)) * smoothstep(.4, 1.5, r) * (1. - raft);
          float ir = clamp(1. - dot(N, V), 0., 1.);
          vec3 film = mix(vec3(.92, .4, .13), vec3(.5, .22, .62), ir * ir) * (.75 + .5 * vn2(fp * 9. + 3.));
          c = mix(c, film * (refl * .5 + amb * .3 + uSunCol * sunT * (.1 + .5 * pow(sg, 60.))), skin * .8);
          c = mix(c, foamC + refl * .06, raft * .9);
        }
        gl_FragColor = vec4(max(c, 0.), 1.);
        #include <fog_fragment>
      }`})}function Ya(){const i=new kt,m=new s.Color(1,1,1),y=(h,g,P)=>P.copy(m);et(i,r(0,-.3,0),r(0,42,0),{rings:6,radial:7,radiusFn:h=>$(.56,.3,h)*(1+.3*Math.exp(-h*40)),colorFn:y});for(const h of[-1,1])et(i,r(0,41.7,0),r(h*.55,43.3,h*.2),{rings:2,radial:5,cap:!0,radiusFn:g=>$(.24,.1,g),colorFn:y});return i.build()}function Za(i){return new s.ShaderMaterial({uniforms:i,fog:!0,vertexShader:Te+`
      attribute vec4 aLt;
      varying vec3 vW, vN; varying vec2 vUv; varying float vId, vLt;
      void main(){ vUv = uv; vec4 w = instanceMatrix * vec4(position, 1.); vW = w.xyz; vN = normalize(mat3(instanceMatrix) * normal + vec3(0., 1e-5, 0.));
        float y = w.y; vLt = mix(mix(aLt.x, aLt.y, smoothstep(4., 14., y)), mix(aLt.z, aLt.w, smoothstep(24., 34., y)), smoothstep(14., 24., y)); vLt = mix(vLt, 1., smoothstep(36., 41., y));
        vId = instanceMatrix[3].x * .37 + instanceMatrix[3].z * .11;
        vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:Pe+Ae+`
      uniform vec3 uTrunk, uRope, uStain;
      varying vec3 vW, vN; varying vec2 vUv; varying float vId, vLt;
      void main(){
        vec3 N = normalize(vN + vec3(1e-5, 0., 0.)); float y = vUv.y, fw = fwidth(y) + 1e-4;
        float j = vn2(vec2(vUv.x * 5., floor(y / .9) + vId)) * .35, ring = fract(y / .9 + j + .08 * sin(vUv.x * 6.2832));
        float scar = mix(.8, smoothstep(.0, .1 + fw, ring) * (1. - smoothstep(.82, .98, ring)), 1. - smoothstep(.2, .6, fw));
        float fib = vn2(vec2(vUv.x * 46., y * 1.3)) * .6 + vn2(vec2(vUv.x * 110., y * 3.)) * .4, mot = fbm2(vec2(vUv.x * 4. + vId, y * .6));
        vec3 alb = uTrunk * mix(.52, 1., scar) * (.74 + .42 * fib) * (.8 + .4 * mot) * mix(.6, 1., smoothstep(0., 22., y));
        // rope lashings where each tier's rope is made fast
        float ty = (y - 8.7) / 4.4, lash = (1. - smoothstep(.07, .09, abs(fract(ty + .5) - .5))) * step(-.2, ty) * step(ty, 7.2);
        float coil = .6 + .4 * sin(y * 70.) * (1. - smoothstep(.02, .1, fw));
        alb = mix(alb, uRope * coil, lash);
        alb = mix(alb, uStain * .5, (1. - smoothstep(.2, 3., y)) * (.4 + .3 * sin(vUv.x * 19. + vId)));
        float ndl = dot(N, uSunDir), dif = smoothstep(-.12, .5, ndl) * max(ndl * .85 + .15, 0.);
        vec3 V = normalize(cameraPosition - vW + vec3(1e-5));
        vec3 amb = ambAt(N, vW);
        vec3 sunL = uSunCol * mix(uFilt, vec3(1.), smoothstep(.15, .9, vLt)) * vLt;
        float fr = clamp(1. - dot(N, V), 0., 1.);
        vec3 c = alb * (sunL * dif + amb * 1.25) + alb * amb * fr * fr * fr * .5;
        // a rim of light down the sunward edge, strongest looking toward the sun
        c += (alb * 1.5 + .03) * sunL * fr * fr * (.25 + .75 * smoothstep(-.25, .45, ndl)) * (.45 + .55 * smoothstep(-.2, .7, dot(-V, uSunDir)));
        gl_FragColor = vec4(max(c, 0.), 1.);
        #include <fog_fragment>
      }`})}function $a(i,m,y){const h=i.length,g=new Float32Array(h*12),P=new Float32Array(h*12),D=new Float32Array(h*4),x=[];i.forEach(([S,q],d)=>{const L=q.clone().sub(S).normalize();for(let M=0;M<4;M++){const z=M<2?S:q;g.set([z.x,z.y,z.z],d*12+M*3),P.set([L.x,L.y,L.z],d*12+M*3),D[d*4+M]=M%2?1:-1}x.push(d*4,d*4+1,d*4+2,d*4+1,d*4+3,d*4+2)});const c=new s.BufferGeometry;c.setAttribute("position",new s.BufferAttribute(g,3)),c.setAttribute("aDir",new s.BufferAttribute(P,3)),c.setAttribute("aSide",new s.BufferAttribute(D,1)),c.setIndex(x);const V=new s.ShaderMaterial({uniforms:{...m,uRib:{value:y}},fog:!0,transparent:!0,depthWrite:!1,side:s.DoubleSide,vertexShader:Te+`
      attribute vec3 aDir; attribute float aSide; uniform vec2 uPx; varying float vA; varying vec3 vW;
      void main(){ vW = position; vec4 mvPosition = viewMatrix * vec4(position, 1.); vec3 tv = mat3(viewMatrix) * aDir;
        vec2 n2 = normalize(vec2(-tv.y, tv.x) + vec2(1e-5, 0.)); float w = max(.075, -mvPosition.z * uPx.y * .85);
        mvPosition.xy += n2 * aSide * w; vA = clamp(.075 / w * 1.6, .16, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:Pe+Ae+`
      uniform vec3 uRib; varying float vA; varying vec3 vW;
      void main(){ vec3 c = uRib * (uSunCol * sunAt(vW) * .5 + ambAt(vec3(0., 1., 0.), vW));
        gl_FragColor = vec4(max(c, 0.), vA);
        #include <fog_fragment>
      }`}),A=new s.Mesh(c,V);return A.frustumCulled=!1,A.renderOrder=2,A}function Qa(i,m,y){const g=i.length*18,P=new Float32Array(g*12),D=new Float32Array(g*16),x=new Float32Array(g*8),c=[];i.forEach((S,q)=>{for(let d=0;d<18;d++){const L=q*18+d,M=S.x+(y()-.5)*S.tw*.62,z=S.z+y.range(-.3,.3),C=y(),T=y.range(.55,.95);for(let k=0;k<4;k++)P.set([M,0,z],L*12+k*3),D.set([C,T,S.tph*40,q===0?1:0],L*16+k*4),x.set([k%2?1:-1,k<2?0:1],L*8+k*2);c.push(L*4,L*4+1,L*4+2,L*4+1,L*4+3,L*4+2)}});const V=new s.BufferGeometry;V.setAttribute("position",new s.BufferAttribute(P,3)),V.setAttribute("aDr",new s.BufferAttribute(D,4)),V.setAttribute("aCo",new s.BufferAttribute(x,2)),V.setIndex(c);const A=new s.Mesh(V,new s.ShaderMaterial({uniforms:m,transparent:!0,depthWrite:!1,blending:s.AdditiveBlending,side:s.DoubleSide,fog:!1,vertexShader:Ce+`
      attribute vec4 aDr; attribute vec2 aCo; uniform vec2 uPx; uniform float uTripU; varying float vA;
      void main(){
        float m = aDr.w > .5 ? uTripU : .62 + .38 * sin(uTime * .21 + aDr.z), hem = 2.5 - 6. * m;
        float tt = fract(uTime * aDr.y * .8 + aDr.x * 7.), y = hem - tt * tt * (hem + .5), len = min(.3 + 1.2 * tt, max(hem - y, 0.) + .05);
        vec4 mv = viewMatrix * vec4(position.x, max(y + aCo.y * len, -.5), position.z, 1.);
        float w = max(.026, -mv.z * uPx.y * 1.1); mv.x += aCo.x * w;
        vA = smoothstep(.1, .5, hem) * smoothstep(0., .08, tt) * (1. - smoothstep(.92, 1., tt)) * clamp(.022 / w * 1.6, .25, 1.) * (.5 + 1.1 * aCo.y);
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:Ce+`
      varying float vA;
      void main(){ gl_FragColor = vec4(max((uSkyCol * 1.3 + uSunCol * .3) * vA, 0.), 1.); }`}));return A.frustumCulled=!1,A.renderOrder=3,A}function Ka(i,m,y,h,g=0){const P=new s.ShaderMaterial({uniforms:{...i,uDisc:{value:m},uHalo:{value:y},uPearl:{value:g},uDiscDir:{value:h}},side:s.BackSide,depthWrite:!1,depthTest:!1,fog:!1,vertexShader:"varying vec3 vD; void main(){ vD = position; vec4 p = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.); gl_Position = p.xyww; }",fragmentShader:Ce+`
      uniform float uDisc, uHalo, uPearl; uniform vec3 uDiscDir; varying vec3 vD;
      void main(){ vec3 d = normalize(vD + vec3(0., 1e-5, 0.)); float s = max(dot(d, uDiscDir), 0.);
        vec3 c = skyAt(vec3(d.x, max(d.y, 0.), d.z));
        // noon: warm white where the dust lies along the walls, pearl blue by a third of the way up, deeper overhead
        float hy = clamp(d.y, 0., 1.);
        c = mix(c, mix(vec3(.30, .44, .80), vec3(.17, .31, .74), smoothstep(.3, .95, hy)), uPearl * smoothstep(.03, .3, hy));
        c *= .95 + .1 * fbm2(d.xz * 2.2 / (abs(d.y) + .35) + uTime * .004);
        c += uSunCol * (smoothstep(.99955, .99985, s) * uDisc + pow(s, 420.) * .5 + pow(s, 40.) * .07);
        c += uSunCol * uHalo * (s * s * s * s * s * s * .06 + pow(s, 22.) * .2 + pow(s, 120.) * .3);          // the wide white halo of a harmattan noon
        gl_FragColor = vec4(max(c, 0.), 1.); }`}),D=new s.Mesh(new s.SphereGeometry(900,24,12),P);return D.frustumCulled=!1,D.renderOrder=-1,D}function Ja(i){return new s.ShaderMaterial({uniforms:i,fog:!0,vertexColors:!0,vertexShader:Te+Ce+`
      attribute vec3 aAnim, aPiv; uniform vec4 uGust;
      varying vec3 vN, vW, vCol; varying vec2 vUv; varying float vMat;
      vec2 rot(vec2 p, float a){ float c = cos(a), s = sin(a); return vec2(p.x * c - p.y * s, p.x * s + p.y * c); }
      void main(){
        vec3 p = position, n = normal; float k = aAnim.x, ph = aAnim.y;
        if (k > .5 && k < 1.5) { p -= aPiv; float a1 = .10 * sin(uTime * 1.1 + ph) + .05 * sin(uTime * 2.3 + ph * 1.7), a2 = .09 * sin(uTime * .8 + ph * 1.3);
          // the hanks pegged on the gatehouse are thrown sideways when the gust reaches it
          float gd = aPiv.z - uGust.x, gg = uGust.y * smoothstep(-5., 4., gd) * exp(-max(gd, 0.) / max(uGust.z, 1.)) * (1. - smoothstep(-287., -283., aPiv.z));
          a1 += gg * (.5 + .25 * sin(uTime * 6. + ph)) * (sin(ph * 3.) > 0. ? 1. : -1.); a2 = a2 * (1. + 2. * gg) - .12 * gg;
          p.xy = rot(p.xy, a1); n.xy = rot(n.xy, a1); p.yz = rot(p.yz, a2); n.yz = rot(n.yz, a2); p += aPiv; }
        else if (k > 1.5 && k < 2.5) { float w = max(p.y - aPiv.y, 0.), wave = max(sin(uTime * 1.5 + ph + p.x * .7 + p.z * .45), 0.);
          float edge = smoothstep(.3, 1.6, distance(p.xz, aPiv.xz)); p.y += w * wave * edge * 1.1; p.z -= w * wave * edge * .5; }
        else if (k > 2.5 && k < 3.5) { p -= aPiv; float a1 = .06 * sin(uTime * .9 + ph), a2 = .045 * sin(uTime * .67 + ph * 1.7);
          p.xy = rot(p.xy, a1); n.xy = rot(n.xy, a1); p.yz = rot(p.yz, a2); n.yz = rot(n.yz, a2); p += aPiv; }
        else if (k > 3.5 && k < 4.5) { p -= aPiv; float a = uTime * .22 + ph; p.xz = rot(p.xz, a); n.xz = rot(n.xz, a); p += aPiv;
          p.y += .035 * sin(uTime * 1.1 + ph); p.xz += vec2(cos(uTime * .09 + ph), sin(uTime * .09 + ph)) * .6; }
        else if (k > 4.5) { p -= aPiv; float a = .1 * sin(uTime * 1.7 + ph) + .5 * pow(max(sin(uTime * .55 + ph), 0.), 10.); p.yz = rot(p.yz, a); n.yz = rot(n.yz, a); p += aPiv; }
        vUv = uv; vMat = aAnim.z; vCol = color; vW = p; vN = n;
        vec4 mvPosition = viewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:Pe+Ae+`
      uniform vec3 uStain;
      varying vec3 vN, vW, vCol; varying vec2 vUv; varying float vMat;
      // the moulded relief of the mud walls, as a height: the interlace band, its frame, a row of lozenges; the
      // gatehouse (gate > 0) wears a second, larger interlace under its parapet
      float wallRelief(vec2 q, float gate){
        float by = (q.y - 12.4) / 1.1, s1 = abs(by - sin(q.x * 1.4)), s2 = abs(by + sin(q.x * 1.4));
        float inter = (1. - smoothstep(.12, .3, min(s1, s2))) * step(abs(by), 1.45);
        float frame = 1. - smoothstep(.0, .14, abs(abs(by) - 1.55));
        float lz = abs(fract(q.x / 2.2) - .5) * 2.2, lo = (q.y - 5.2) / 1.2;
        float loz = (1. - smoothstep(.0, .12, abs(abs(lz) / 1.1 + abs(lo) - .8))) * step(abs(lo), 1.);
        float r = max(max(inter, frame), loz * .8);
        float gy = (q.y - 21.25) / .86, g1 = abs(gy - sin(q.x * 1.05)), g2 = abs(gy + sin(q.x * 1.05));
        float gi = (1. - smoothstep(.15, .36, min(g1, g2))) * step(abs(gy), 1.5), gf = 1. - smoothstep(.0, .17, abs(abs(gy) - 1.6));
        return max(r, max(gi, gf) * gate);
      }
      void main(){
        vec3 N = normalize(vN + vec3(1e-5, 0., 0.)); if (!gl_FrontFacing) N = -N;
        vec3 alb = vCol; float m = vMat, bump = 0., gloss = 0., fw = fwidth(vUv.y) + 1e-4, rsh = 0.;
        if (m > 6.5 && m < 7.5) { gl_FragColor = vec4(vCol, 1.); return; }
        float gk = gateZone(vW); vec3 Ld = normalize(mix(uSunDir, uGateSun.xyz, gk));
        if (m > 8.5) {                      // mud wall: courses, moulded interlace band, rain streaks, indigo splash at the foot
          float al = abs(N.x) > abs(N.z) ? vW.z : vW.x; vec2 q = vec2(al, vW.y);
          float mo = fbm2(q * .22 + 3.), gr = vn2(q * 5.) * .6 + vn2(q * 17.) * .4;
          float course = smoothstep(.0, .12, abs(fract(q.y / .9 + .15 * vn2(vec2(q.x * .3, floor(q.y / .9)))) - .5));
          float streak = smoothstep(.5, .9, vn2(vec2(q.x * 1.7, q.y * .06 + 2.))) * smoothstep(1., 16., q.y);
          float wf = 1. - smoothstep(.06, .4, fwidth(q.x) + fwidth(q.y)), upr = step(abs(N.y), .5), rl0 = wallRelief(q, gk);
          float relief = rl0 * upr * wf; course = mix(1., course, wf); gr = mix(.5, gr, wf);
          // the shadow each moulding throws along the light: long when the sun rakes the wall
          float Ln = dot(N, Ld); vec2 l2 = abs(N.x) > abs(N.z) ? vec2(Ld.z, Ld.y) : vec2(Ld.x, Ld.y);
          if (Ln > .03) { vec2 d2 = l2 * clamp(.13 / Ln, .12, .8); rsh = clamp(max(wallRelief(q + d2, gk), wallRelief(q + d2 * .45, gk)) - rl0, 0., 1.) * upr * wf; }
          alb *= (.75 + .4 * mo) * (.85 + .3 * gr) * mix(.84, 1., course);
          alb = mix(alb, alb * vec3(.6, .58, .6), streak * (.55 + .45 * uWet));
          alb = mix(alb, uStain * .5, (1. - smoothstep(.0, 2.6, q.y + mo * 1.5)) * .45 * step(vW.z, 0.));
          alb *= 1. + .28 * relief; alb *= 1. - .25 * uWet;
          bump = (gr - .5) * .5 + relief * (1.3 + 1.3 * gk) + (course - 1.) * .4;
        } else if (m < .5) {                // palm trunk
          float j = vn2(vec2(vUv.x * 5., floor(vUv.y / .9))) * .35, ring = fract(vUv.y / .9 + j + .08 * sin(vUv.x * 6.2832));
          float scar = mix(.8, smoothstep(.0, .10 + fw, ring) * (1. - smoothstep(.82, .98, ring)), 1. - smoothstep(.2, .6, fw));
          float fib = vn2(vec2(vUv.x * 46., vUv.y * 1.3)) * .6 + vn2(vec2(vUv.x * 110., vUv.y * 3.)) * .4, mot = fbm2(vec2(vUv.x * 4., vUv.y * .6));
          alb *= mix(.52, 1., scar) * (.74 + .42 * fib) * (.8 + .4 * mot); bump = (scar - .5) * .5 + (fib - .5) * .3;
        } else if (m < 1.5) {               // rope, raffia, thatch: laid strands
          float tf = 1. - smoothstep(.12, .45, fw * 9.), tw = sin((vUv.x * 3. + vUv.y * 9.) * 6.2832) * tf, fib = vn2(vec2(vUv.x * 60., vUv.y * 30.));
          alb *= (.62 + .38 * smoothstep(-.6, .7, tw)) * (.8 + .35 * fib * tf); bump = tw * .4;
        } else if (m > 2.5 && m < 3.5) {    // clay, gourd: speckle, soot, a soft shine
          float sp = vn3(vW * 6.) * .5 + vn3(vW * 21.) * .5; alb *= .8 + .35 * sp; alb = mix(alb, alb * .5, smoothstep(.55, .8, vn3(vW * 1.7 + 5.)) * .5);
          bump = (sp - .5) * .25; gloss = .25;
        } else if (m > 5.5 && m < 6.5) {    // folded cloth: each slab one folded length, its fold lines down the sides, beaten glaze on the dark ones
          float side = step(abs(N.y), .7), fy = vUv.y, id = floor(fy), ff = fract(fy);
          float h = h11(id * 1.37 + floor(vCol.b * 97.));
          float lumA = dot(alb, vec3(.3, .5, .2));
          alb *= mix(1., .84 + .32 * h, side);
          float tf = 1. - smoothstep(.1, .5, fwidth(fy));
          float crease = mix(1., smoothstep(.0, .12, ff) * (1. - smoothstep(.88, 1., ff)), side);
          alb *= mix(1., mix(.74, 1., crease), tf); bump = crease * .6 * tf * side;
          float wq = vW.x * 40. + vW.z * 40., wf = 1. - smoothstep(.25, 1.1, fwidth(wq));
          float wv = mix(.5, vn2(vec2(wq, vW.y * 3.)), wf); alb *= (.9 + .2 * wv) * (.9 + .2 * vn2(vW.xz * 1.3 + vW.y));
          gloss = (1. - smoothstep(.02, .1, lumA)) * .9;
        } else if (m < 4.5) {               // stone, cement
          float sp = vn3(vW * 7.) * .6 + vn3(vW * 23.) * .4; alb *= .75 + .45 * sp; bump = (sp - .5) * .4;
        } else if (m < 5.5) {               // planks: grain along v, seams across u
          float seam = abs(fract(vUv.x * 6.) - .5), sm = smoothstep(.0, .05, seam), st = h11(floor(vUv.x * 6.) + 3.);
          float gr = vn2(vec2(vUv.x * 60., vUv.y * 1.6 + st * 9.)) * .6 + vn2(vec2(vUv.x * 20., vUv.y * .5)) * .4;
          alb *= mix(.4, 1., sm) * (.72 + .5 * gr) * (.82 + .3 * st); bump = (gr - .5) * .3 + (sm - 1.) * .6;
        } else { float sp = vn3(vW * 9.); alb *= .85 + .3 * sp; gloss = .2; }
        N = normalize(N + (dFdx(bump) * cross(N, vec3(0., 1., 0.)) + vec3(0., 1., 0.) * dFdy(bump)) * 2.5 + vec3(0., 1e-5, 0.));
        vec3 V = normalize(cameraPosition - vW + vec3(1e-5));
        float ndl = dot(N, Ld), dif = smoothstep(-.12, .5, ndl) * max(ndl * .85 + .15, 0.);
        vec3 sunT = sunAt(vW), amb = ambAt(N, vW);
        if (gk > 0.) sunT = mix(sunT, vec3(gateLit(vW)), gk);
        float ground = mix(.55, 1., smoothstep(0., 2.2, vW.y));          // contact darkening toward the earth
        vec3 c = alb * (uSunCol * sunT * dif * (1. - .88 * rsh) + amb * ground * (1. - .32 * rsh));
        float fr = clamp(1. - dot(N, V), 0., 1.);
        c += alb * amb * fr * fr * fr * .35;
        c += (alb * 1.4 + .02) * uSunCol * sunT * fr * fr * (.2 + .8 * smoothstep(-.25, .45, ndl)) * (.4 + .6 * smoothstep(-.2, .7, dot(-V, Ld))) * (m < .5 ? 1. : .35);
        vec3 Hh = normalize(Ld + V + vec3(1e-5));
        c += (uSunCol * sunT * step(0., ndl) + amb * 1.5) * pow(max(dot(N, Hh), 0.), 26.) * gloss;
        gl_FragColor = vec4(max(c, 0.), 1.);
        #include <fog_fragment>
      }`})}const eo=new s.Matrix4,wa=new s.Quaternion,Jt=new s.Euler,j=(i,m,y,h=0,g=0,P=0,D=1,x=D,c=D)=>new s.Matrix4().compose(r(i,m,y),wa.setFromEuler(Jt.set(h,g,P)),r(D,x,c));function ue(i,m,y,h,g,P,D,x={}){const c=x.seg||[3,3,3],V=new s.BoxGeometry(g,P,D,c[0],c[1],c[2]),A=V.attributes.position,S=x.round??.12,q=x.wob||0,d=x.taper??1,L=x.noise;for(let M=0;M<A.count;M++){let z=A.getX(M),C=A.getY(M),T=A.getZ(M);const k=Math.abs(z)/(g/2),R=Math.abs(C)/(P/2),Z=Math.abs(T)/(D/2),U=(k>.99?1:0)+(R>.99?1:0)+(Z>.99?1:0);if(U>=2){const Q=S*(U-1);k>.99&&(z-=Math.sign(z)*Q),R>.99&&(C-=Math.sign(C)*Q),Z>.99&&(T-=Math.sign(T)*Q)}const X=C/P+.5,pe=$(1,d,X);if(z*=pe,T*=pe,q&&L){const Q=q*L.n3((m+z)*.35,(y+C)*.35,(h+T)*.35);z+=Q*(k>.9?1:.3),T+=Q*(Z>.9?1:.3),R>.9&&C>0&&(C+=Q*.6)}A.setXYZ(M,z,C,T)}V.computeVertexNormals(),i.add(V,j(m,y,h,0,x.ry||0,0),x)}const Xe=(i,m,y,h,g)=>i.add(new s.LatheGeometry(m.map(P=>new s.Vector2(P[0],P[1])),y),h,g);var co={id:"indigo-pits",name:"The Blue Yard",category:"interior",weirdness:.1,media:["air","interior"],async build(i){const m=i.rng,y=i.noise,h=i.quality?.detail??1,g=i.vary||{},P=fe(g.density??1,.7,1.3),D=g.hour||"any";let x=D==="night"?"night":D==="golden"?"evening":D==="dawn"?"rain":D==="day"?"noon":null;if(!x){const e=m.fork("yard-look")();x=e<.4?"noon":e<.72?"evening":"rain"}const c=Ia[x],V=m.fork("cast"),A=V()<.3,S=V()<.35,q=!!g.rare,d={haze:E(De[0]),ochre:E(De[1]),deep:E(De[2]),blue:E(De[3]),sky:E(De[4]),green:E(De[5]),orange:E(De[6])},L=e=>E(e[0],e[1]),M=r(...c.sun).normalize(),z=new s.Scene,C=L(c.fog),T=L(c.fogBlue);z.fog=new s.FogExp2(C.clone(),c.dens),z.background=C.clone();const k=await Ga(i,{palette:De,look:x,apron:!0,cwSide:1,apronCutGLSL:Kt+"float yardCut(vec2 p){ return step(pitAt(p).x, 5.1); }"}),R=-50*Math.PI/180;k.setTwist(0),k.uniforms.uAmbK.value=2,k.object.position.set(be,0,re),k.object.rotation.y=R,k.object.updateMatrixWorld(!0),z.add(k.object);const Z=k.anchors,U=k.uniforms,X=e=>e.clone().applyMatrix4(k.object.matrixWorld),pe=Z.legs.map(e=>({foot:X(e.foot),top:X(e.top)}));await i.yield?.();const Q=(e,a,n)=>[be+a*Math.cos(e*Math.PI/180),n,re-a*Math.sin(e*Math.PI/180)],te=Na([[0,6,18],[0,6,5],[.4,7.6,-9],[-.6,7.6,-21],[-1.9,6.6,-32],[-1.6,5.2,-44],[-.6,3.8,-55],[.2,3,-63],[.8,3.5,-74],[.6,5,-86],[-.4,5.6,-98],[.5,5.5,-111],[.9,5.9,-123],Q(272,16.5,6.6),Q(252,14.2,7.6),Q(228,13.2,9),Q(207,14.4,10.8),Q(189,15.8,12.8),Q(173,16.8,15),Q(158,17.2,17.2),Q(140,17.2,19.4),Q(122,17.6,21.3),Q(106,20.2,22.9),[-2,23.7,-180.5],[-.7,23.8,-189.5],[0,22.4,-198.5],[0,15,-219],[0,10.8,-234],[0,9.3,-244],[0,9,-256],[0,9,-274],[0,9,-294]]),Ge=te.length,de=[];for(let e=0;e<=240;e++)de.push(te.pointAt(e/240));const ge=(e,a,n)=>{let o=1e9;for(const t of de){const l=(t.x-e)**2+(t.y-a)**2+(t.z-n)**2;l<o&&(o=l)}return Math.sqrt(o)},he=(e,a=0,n=1)=>{let o=a,t=1e9;for(let l=0;l<=240;l++){const p=l/240;if(p<a||p>n)continue;const f=Math.abs(de[l].z-e);f<t&&(t=f,o=p)}return o},me=he(-133.5,.4,.5),ze=he(-163.5,.5,.65);await i.yield?.();const ie=c.sparse?Math.sign(M.x)||1:0,ae=await Ra(i,m.fork("cloth"),d,{whiteDay:A,kCan:c.kCan,canOcc:c.canOcc,sparse:ie,occ:c.occ,away:-(Math.sign(M.x)||1)});await i.yield?.();const ve=Ba(M,ae.buckets,y),Me=e=>e[0]*.3+e[1]*.5+e[2]*.2,Ye=x==="evening",_e=(e,a)=>{if(a>.6)return Math.abs(e)<15&&a<60?0:1;if(Math.abs(e)>47||a<-299)return 1;const n=(Ot-a)/jt;if(n<-.7||n>Oe-.3)return 1;const o=ae.plans[fe(Math.round(n),0,Oe-1)],t=Math.abs(e);return t<o.bound?o.canopy?c.naveOpen:1:t>=46.5?1:ie&&!o.canyon&&e*ie>0?.75:o.canyon?.14:.2},ot=(e,a)=>ie&&a===ie&&!e.canyon&&(e.f&1)===1,Ue=[];for(const e of ae.plans)for(const a of e.xs)for(const n of[-1,1])ot(e,n)||Ue.push([n*a,e.z]);const Fe=await Ha(i,ve,_e,Ye?192:224,Ye?768:896,Ue,M);for(const e of ae.list)e.lt=Me(ve(e.x,e.yTop-.4,e.z-.05)),e.lb=Me(ve(e.x,e.yTop-e.drop+.3,e.z-.05));await i.yield?.();let dt=-100,Tt=1;{let e=null,a=0,n=0;for(let o=1;o<=39;o+=1){const t=Me(ve(be,o,re-.2));t>.5&&e===null&&(e=o),t<=.5&&(a+=t,n++)}e!==null&&e>1.5?(dt=e,Tt=Math.max(.05,n?a/n:.05)):e===null&&(dt=60,Tt=.08)}const ea=new s.Vector3(...c.amb).multiplyScalar(.9),ta=new s.Vector4(ct,ut,1/ft,1/pt),ht=M.clone();ht.x<.26&&(ht.x=.26),ht.normalize(),k.setLight({sunDir:ht,sunColor:L(c.sunCol),skyColor:L(c.sky),groundColor:L(c.gnd),hazeColor:L(c.haze),zenithColor:L(c.zen),shade:1,wet:c.wet,shadeY:[dt-3,dt+2,Tt],yardShade:{map:Fe.tex,xf:ta,amb:ea}});const Pt=(()=>{const e=Math.sqrt(Math.max(1-M.y*M.y,.01));return r((M.x<0?-1:1)*e*.955,M.y,Math.max(e*.3,.2)).normalize()})(),Ft={value:.5},Wt={fogColor:U.fogColor,fogDensity:U.fogDensity,fogNear:U.fogNear,fogFar:U.fogFar,uSunDir:{value:M.clone()},uSunCol:U.uSunCol,uSkyCol:U.uSkyCol,uGndCol:U.uGndCol,uHazeCol:U.uHazeCol,uZenCol:U.uZenCol,uTime:U.uTime,uWet:U.uWet,uPx:U.uPx,uShade0:U.uShade0,uShadeY:U.uShadeY,uHaul:U.uHaul,uWind:U.uWind,uShadeMap:{value:Fe.tex},uShadeXf:{value:ta},uAmbShade:{value:ea},uStoreAmb:{value:L(c.store).multiplyScalar(3.4)},uDoorCol:{value:L(c.door||c.haze).multiplyScalar(1.5)},uAmbGain:{value:c.ambGain??2.4},uSoft:{value:c.soft??0},uFilt:{value:new s.Vector3(.5,.66,1)},uGust:{value:new s.Vector4(1e4,0,30,0)},uGateSun:{value:new s.Vector4(Pt.x,Pt.y,Pt.z,c.gate??.8)}},ye=(e={})=>({...Wt,...e}),ba=d.ochre.clone().lerp(d.haze,.12).multiplyScalar(.46),Re=d.blue.clone().lerp(d.deep,.1).multiplyScalar(.95),ne=E("#a8987a").lerp(d.ochre,.18),mt=E("#5d5140"),xe=E("#b59c6c").lerp(d.ochre,.2),Lt=E("#33281d"),za=E("#b8b1a0").lerp(d.haze,.2).multiplyScalar(.4),Ma=E("#8d8270"),vt=d.ochre.clone().lerp(d.haze,.1).multiplyScalar(.62),We=E("#84684a"),aa=E("#8a5a40").lerp(d.ochre,.4),gt=d.ochre.clone().lerp(d.haze,.4).multiplyScalar(.85),yt=E("#b9a06a").lerp(d.haze,.2).multiplyScalar(.7),oa=Ka(ye(),c.discGain,c.halo??0,c.disc?r(...c.disc).normalize():M.clone(),c.pearl??0);z.add(oa);{const e=new s.PlaneGeometry(100,374,4,16);e.rotateX(-Math.PI/2),e.translate(0,0,-125);const a=new s.Mesh(e,Oa(ye({uEarth:{value:ba},uStain:{value:Re},uReed:{value:E("#b79a62").multiplyScalar(.8)}})));a.frustumCulled=!1,z.add(a)}const ke=[];for(let e=0;e<=Xt;e++){const a=Qt(e),n=$t(e);for(let o=e>19?-2:a?-3:-2;o<=(e>19?1:2);o++){const t=o*11.5+(a?5.75:0);Math.hypot(t-be,n-re)>=14.8&&ke.push({x:t,z:n,k:e,six:a,seed:m()})}}const na=[];for(let e=0;e<8;e++)na.push(Ne(e,new s.Color,d));let Dt=null;{const e=ja(),a=new Float32Array(ke.length),n=Xa(ye({uTier:{value:na},uFoam:{value:E("#7c6a4c").lerp(d.ochre,.18).multiplyScalar(.72)},uLiquor:{value:d.deep.clone().lerp(d.blue,.3).multiplyScalar(.62)},uCement:{value:za},uStain:{value:Re},uFarRefl:{value:T.clone().lerp(d.blue,.45).multiplyScalar(.55)},uPlan:{value:new s.Vector4(19.5,c.kCan,ie,c.occ)},uPlanB:{value:new s.Vector2(c.canOcc,0)},uTrip:{value:[0,1,2,3,4].map(t=>U.uRamp.value[t].clone())},uTripU:Ft}));Dt={g:e,n:ke.length};const o=new s.InstancedMesh(e,n,ke.length);ke.forEach((t,l)=>{o.setMatrixAt(l,eo.makeRotationY(t.seed*qe).setPosition(t.x,0,t.z)),a[l]=t.seed}),e.setAttribute("aSeed",new s.InstancedBufferAttribute(a,1)),o.frustumCulled=!1,z.add(o)}await i.yield?.();const qt=[];for(const e of ae.plans)for(const[a,n,o]of ya(e))for(let t=o?c.kCan:0;t<8;t++){if(ot(e,o?ie:Math.sign(a+n)))continue;const l=At+rt*t,p=(n-a)*.006,f=o?8:4;for(let w=0;w<f;w++){const W=w/f,N=(w+1)/f;qt.push([r($(a,n,W),l-p*4*W*(1-W),e.z),r($(a,n,N),l-p*4*N*(1-N),e.z)])}}{const e=new s.InstancedMesh(Ya(),Za(ye({uTrunk:{value:ne.clone().lerp(d.ochre,.3).multiplyScalar(.95)},uRope:{value:xe},uStain:{value:Re}})),Ue.length),a=m.fork("masts"),n=new Float32Array(Ue.length*4);for(let o=0;o<Ue.length;o++){const[t,l]=Ue[o];for(let p=0;p<4;p++)n[o*4+p]=Math.max(Me(ve(t+(M.x>0?.6:-.6),4+10*p,l-.65)),Me(ve(t,4+10*p,l-.65)));(o&63)===63&&await i.yield?.()}e.geometry.setAttribute("aLt",new s.InstancedBufferAttribute(n,4)),Ue.forEach(([o,t],l)=>e.setMatrixAt(l,j(o,0,t,a.range(-.012,.012),a.range(0,qe),a.range(-.012,.012),.74,a.range(.97,1.03),.74))),e.frustumCulled=!1,z.add(e)}await i.yield?.();const Le=[];{const e=m.fork("tripods"),a=ke.filter(n=>n.z>-124&&Math.abs(n.x)>10&&Math.abs(n.x)<17.5&&ge(n.x,8,n.z)>7);for(const[n,o]of[[2,-11.5],[0,17.25],[5,17.25],[8,-11.5]]){const t=a.find(l=>l.k===n&&Math.abs(l.x-o)<.1);t&&Le.push(t)}e.shuffle(a)}const Be=[];Le.forEach((e,a)=>{e.tw=a<2?4.4:3.6,e.tph=m(),Be.push({x:e.x,w:e.tw,yTop:15,drop:12.5,z:e.z,col:d.blue,seed:e.tph,pat:.1,kind:2,lt:0,lb:0,lean:0,line:a===0?-2:-1,tripod:!0})});{const e=new Float32Array(Dt.n*3);Le.forEach((a,n)=>{const o=ke.indexOf(a);e.set([a.tw/2,a.tph*40,n===0?1:0],o*3)}),Dt.g.setAttribute("aTrip",new s.InstancedBufferAttribute(e,3))}const He=m.fork("streamers");for(const e of ae.plans)if(e.z<-182&&e.z>-268)for(const a of[-1,1]){if(He()<.3&&e.f<Oe-2)continue;const n=He.int(3,6),o=Ne(n+He.range(-.5,.5),new s.Color,d),t=ot(e,a),l=He.range(1.1,1.6),p=He.range(11,17),f=e.z+He.range(1.2,5),w=He();t||Be.push({x:a*10.9,w:l,yTop:At+rt*n-.5,drop:p,z:f,col:o,seed:w,pat:.7,kind:1,lean:a,line:-1})}{const e=m.fork("gate-cloth");for(const a of[-1,1])[[10.25,2.2,16.2,2.3,.1],[14.8,2.05,13.2,4.7,.2]].forEach(([n,o,t,l,p],f)=>{Be.push({x:a*n,w:o,yTop:22.36,drop:t+e.range(-.7,.7),z:-287.5,col:Ne(l+e.range(-.4,.4),new s.Color,d),seed:e(),pat:a>0?p:f?.1:.28,kind:3,lean:0,line:-1,gate:!0})}),Be.push({x:a*8.2,w:3,yTop:14.66,drop:e.range(9.2,10.4),z:-292,col:Ne(a>0?5.3:3.7,new s.Color,d),seed:e(),pat:a>0?.3:.1,kind:3,lean:-a,line:-1,gate:!0})}for(const e of Be){if(e.gate){e.lt=e.lb=1;continue}const a=ve(e.x,e.yTop-.5,e.z-.1),n=ve(e.x,Math.max(e.yTop-e.drop+.5,.5),e.z-.1);e.lt=Me(a),e.lb=Me(n)}await i.yield?.();for(const e of ae.list){const a=Math.hypot(e.x-be,e.z-re);a<44&&(e.lean=Math.sign(e.z-re||1)*.9*(1-O(30,44,a))),e.dPath=ge(e.x,e.yTop-e.drop*.5,e.z)}await i.yield?.(),ae.list.sort((e,a)=>e.dPath-a.dPath);const sa=Math.min(ae.list.length,Math.round(520*(.6+.4*h))),Nt=(()=>{const e=ae.plans.find(a=>a.z<-230&&a.z>-238);return e?e.f*8+5:-100})(),Gt=ye({uPale:{value:d.haze.clone().multiplyScalar(.8)},uTrip:{value:[0,1,2,3,4].map(e=>U.uRamp.value[e].clone())},uStrip:{value:new s.Vector4(-100,0,0,0)},uTripU:Ft}),ra=Ea(Gt),la=new s.Mesh(xa(8,6,ae.list.slice(0,sa).concat(Be)),ra);await i.yield?.();const ia=new s.Mesh(xa(6,4,ae.list.slice(sa)),ra);la.frustumCulled=ia.frustumCulled=!1,z.add(la,ia),Le.length&&z.add(Qa(Le,ye({uTripU:Ft}),m.fork("trip-drips")));for(const e of Be)if(e.kind===1){const a=e.yTop;qt.push([r(e.x,a,e.z-e.w/2-.3),r(e.x,a,e.z+e.w/2+.3)])}await i.yield?.();const I=new kt,F=m.fork("built"),we=(e=1)=>(a,n,o,t)=>{t.copy(vt).multiplyScalar(e*(.86+.2*y.n2(a*.07+o*.07,n*.13)))},Se=(e,a=.12)=>{const n=1+F.range(-a,a);return(o,t,l,p)=>{p.copy(e).multiplyScalar(n)}},H=(e,a,n,o,t,l={})=>et(I,e,a,{step:2.5,radial:7,mat:0,cap:!0,...l,radiusFn:p=>$(n,o,p),colorFn:l.colorFn||((p,f,w)=>w.copy(t).multiplyScalar(.85+.15*Math.sin(p*37+f)))}),xt=(e,a,n,o,t=1)=>{Xe(I,[[.02,3],[.34,2.5],[.62,1.5],[.95,.5],[1.15,0]],7,j(e,a,n,0,0,0,o),{colorFn:we(1.08*t),mat:9});for(const l of[-1,1])H(r(e,a+2.3*o,n+l*.25*o),r(e,a+4*o,n+l*1*o),.3*o,.1*o,vt,{rings:2,radial:5,mat:9,colorFn:(p,f,w)=>w.copy(vt).multiplyScalar(1.05*t)})};for(const e of[-1,1]){ue(I,e*48.8,9,-150,1.6,18,301,{seg:[1,5,50],wob:.22,noise:y,round:.15,colorFn:we(),mat:9});for(let a=0;a<25;a++){const n=-8-12*a;ue(I,e*47.4,9.6,n,2.4,19.2,3.2,{seg:[2,4,2],taper:.62,wob:.14,noise:y,round:.2,colorFn:we(1.04),mat:9}),xt(e*47.5,19.2,n,.95),a%6===5&&await i.yield?.()}}ue(I,0,9,-301,99,18,1.6,{seg:[20,4,1],wob:.2,noise:y,colorFn:we(),mat:9});{const e=new s.Shape;e.moveTo(-49.6,0),e.lineTo(-49.6,18),e.lineTo(49.6,18),e.lineTo(49.6,0),e.lineTo(8,0),e.lineTo(8,13),e.lineTo(-8,13),e.lineTo(-8,0),e.closePath(),I.add(new s.ExtrudeGeometry(e,{depth:1.6,bevelEnabled:!1}),j(0,0,0),{colorFn:we(),mat:9}),H(r(-9.6,13.35,.8),r(9.6,13.5,.8),.52,.46,ne,{step:1.5,radial:9,v0:3});for(const a of[-1,1]){H(r(a*8.25,0,.8),r(a*8.3,13,.8),.42,.36,ne,{step:1.5,radial:8,v0:a});for(const n of[2.5,9.5])St(I,r(a*8.27,n,.8),r(0,1,0),.42,.7,3,xe,F)}for(let a=0;a<9;a++)xt(-44+a*11,18,.8,.8)}await i.yield?.();{const e=new s.Shape;e.moveTo(-15,0),e.lineTo(-15,26),e.lineTo(15,26),e.lineTo(15,0),e.lineTo(8.5,0),e.lineTo(8.5,10.5),e.absarc(0,10.5,8.5,0,Math.PI,!1),e.lineTo(-8.5,0),e.closePath(),I.add(new s.ExtrudeGeometry(e,{depth:10,bevelEnabled:!1,curveSegments:22}),j(0,0,-300),{colorFn:we(1.02),mat:9}),await i.yield?.();const a=vt.clone().multiplyScalar(1.25),n=[];for(let o=0;o<=26;o++){const t=Math.PI*o/26;n.push(r(Math.cos(t)*9.15,10.5+Math.sin(t)*9.15,-289.75))}Ht(I,[r(9.15,.2,-289.75),r(9.15,5,-289.75),...n,r(-9.15,5,-289.75),r(-9.15,.2,-289.75)],.42,{color:a,segs:70,radial:6});for(const o of[-1,1])ue(I,o*12.6,13.2,-289.3,2.6,26.4,1.8,{seg:[2,6,1],taper:.7,wob:.12,noise:y,round:.2,colorFn:we(1.1),mat:9}),xt(o*12.6,26.2,-289.4,1.25,1.05),H(r(o*10.4,21.6,-289.9),r(o*10.6,21.1,-287.2),.28,.22,We,{rings:2,mat:0}),ue(I,o*4.4,9.4,-299.3,8.6,18.8,.5,{seg:[4,4,1],round:.05,colorFn:Se(We.clone().multiplyScalar(.34)),mat:5,ry:o*.02});await i.yield?.();for(let o=-2;o<=2;o++)xt(o*4.6,26,-290.6,o===0?1.15:.9,1.05);ue(I,0,23.3,-289.75,21,.9,.7,{seg:[8,1,1],round:.2,wob:.06,noise:y,colorFn:we(1.2),mat:9});for(const o of[-1,1]){H(r(o*8.9,22.5,-287.5),r(o*16,22.62,-287.5),.17,.15,ne,{step:1.4,radial:7,v0:o*3});for(const[t,l]of[[9.5,-290.3],[12.6,-288.9],[15.25,-290.3]])H(r(o*t,23.15,l),r(o*t,22.45,-287.2),.14,.11,We,{rings:2,radial:6}),St(I,r(o*t,22.53,-287.5),r(1,0,0),.17,.5,3,xe,F);H(r(o*8.28,14.85,-290.15),r(o*8.28,14.8,-293.85),.12,.11,ne,{rings:3,radial:6});for(const t of[-290.6,-293.4])H(r(o*8.62,15.02,t),r(o*8.18,14.82,t),.08,.07,We,{rings:1,radial:5})}await i.yield?.();for(let o=0;o<6;o++){const t=-6.9+o*2.76+F.range(-.3,.3),l=22.25+F.range(-.25,.2),p=[t,l,-289.15],f=F.range(0,6),w=F.range(2.1,2.9);H(r(t,l,-290.1),r(t,l+.1,-288.95),.09,.07,We,{rings:2,radial:5}),H(r(t,l,-289.15),r(t+F.range(-.15,.15),l-w,-289.1),.44,.27,Ne(F.range(1.2,6.6),new s.Color,d),{rings:5,radial:7,mat:1,kind:1,piv:p,phase:f,bow:.2})}}await i.yield?.();{for(const t of[-1,1])ue(I,t*15.8,8.2,31,1.6,16.4,61,{seg:[1,4,12],wob:.18,noise:y,colorFn:we(.9),mat:9});ue(I,0,8.2,60.8,33,16.4,1.6,{seg:[8,4,1],wob:.18,noise:y,colorFn:we(.9),mat:9}),ue(I,0,17.1,31,33.4,1.4,62,{seg:[4,1,8],round:.2,colorFn:Se(yt.clone().multiplyScalar(.5)),mat:1});for(let t=0;t<19;t++)H(r(-15.4,15.75+F.range(-.1,.1),3.6+t*3.05),r(15.4,15.75+F.range(-.1,.1),3.6+t*3.05+F.range(-.3,.3)),.4,.33,mt.clone().lerp(ne,.35),{step:4,radial:7,v0:t*3,cap:!1});for(const t of[-7.5,0,7.5])H(r(t,15.1,1.8),r(t,15.1,59.8),.3,.3,mt,{step:8,radial:6,cap:!1});await i.yield?.();const e=M.x<0?-14.96:14.96,a=L(c.haze).multiplyScalar(x==="night"?.9:1.5);for(const t of[12,24,36,48]){const l=new s.PlaneGeometry(.7,3);I.add(l,j(e,12.1,t,0,e<0?Math.PI/2:-Math.PI/2,0),{color:a,mat:7}),ue(I,e+Math.sign(e)*.1,10.3,t,.5,.4,1.9,{seg:[1,1,1],round:.08,colorFn:we(.7),mat:9})}H(r(-8.6,14.1,2.4),r(8.6,14.1,2.4),.62,.62,yt,{step:1.2,radial:10,mat:1,v0:1});for(let t=0;t<9;t++){const l=-8+t*2+F.range(-.3,.3),p=F.range(1.3,2.3),f=[l,13.5,2.4],w=F.range(0,6);H(r(l,13.5,2.4),r(l,13.5-p,2.4),.05,.05,xe,{rings:2,radial:4,mat:1,kind:1,piv:f,phase:w}),H(r(l,13.5-p,2.4),r(l,13.5-p-.7,2.4),.2,.09,t%2?d.blue:yt,{rings:2,radial:6,mat:1,kind:1,piv:f,phase:w})}for(const[t,l]of[[-5.2,20],[6,33]]){const p=[t,15.3,l],f=F.range(0,6);H(r(t,15.3,l),r(t,12.9,l),.05,.05,xe,{rings:2,radial:4,mat:1,kind:1,piv:p,phase:f}),H(r(t,13,l),r(t+.2,9.6,l),.42,.3,d.blue.clone().lerp(d.deep,.4),{rings:5,radial:8,mat:1,kind:1,piv:p,phase:f,bow:.25})}await i.yield?.();const n=m.fork("stacks"),o=new s.Color;for(const t of[-1,1])for(let l=0;l<2;l++)for(let p=5.5;p<58;p+=n.range(3.4,4.6)){if(n()<.14)continue;const f=n.range(2.3,3.3),w=n.range(2.3,3.2),W=l?n.range(5,10.5):n.range(1.6,6.2),N=t*(l?12.9:n.range(8.9,9.5)),ee=n.range(-.5,7.5),K=n.range(-.12,.12);for(let v=0;v<W;){const G=n.range(.46,.76),Y=v+G>=W,B=n()<.16,le=n.range(.9,1.04);Ne(B?n.range(-.5,7.5):ee+n.range(-.7,.7),o,d);const u=o.clone().multiplyScalar(n.range(.8,1.15));ue(I,N+n.range(-.1,.1),v+G/2,p+n.range(-.1,.1),f*le,G*1.02,w*(B?n.range(.82,.95):le),{seg:[2,1,2],round:.035,mat:6,ry:K+n.range(-.08,.08),uvScale:[1,n.int(2,4)],kind:Y?2:0,phase:n.range(0,6),piv:[N,v+.02,p],colorFn:(b,_,J,oe)=>oe.copy(u)}),v+=G}await i.yield?.()}for(const[t,l]of[[-5.7,11],[5.7,13.5],[-5.6,27.5],[5.8,30]]){H(r(t,.78,l),r(t+F.range(-.2,.2),.8,l+12),.8,.74,ne,{step:1.5,radial:12,v0:l,colorFn:(p,f,w)=>w.copy(ne).multiplyScalar(.7+.25*Math.sin(f-1.57)).lerp(d.deep,.35*(.5+.5*Math.sin(p*9+t))*Math.max(0,Math.sin(f-.2)))}),ue(I,t,1.66,l+5.2,2.5,.2,3.4,{seg:[4,1,4],round:.08,mat:6,colorFn:(p,f,w,W)=>W.copy(d.deep).lerp(d.blue,.12).multiplyScalar(.55)});for(let p=0;p<2;p++){const f=l+1.6+p*7.6+F.range(-.5,.5),w=F.range(-.6,.6),W=Math.cos(w),N=Math.sin(w);H(r(t-.45*W,1.95,f-.45*N),r(t+.45*W,1.95,f+.45*N),.34,.34,We,{rings:2,radial:8}),H(r(t,1.95,f),r(t-N*1.9,1.75,f+W*1.9),.09,.07,ne,{rings:2,radial:5})}}await i.yield?.();for(let t=0;t<9;t++){const l=6.6+t%3*.95,p=.48+Math.floor(t/3)*.8,f=45.5+t%2*.3;H(r(l,p,f),r(l+.1,p,f+3.3),.46,.46,d.deep,{rings:2,radial:8,mat:6,colorFn:(w,W,N)=>N.copy(d.deep).lerp(d.blue,.1).multiplyScalar(.5)})}for(let t=0;t<9;t++){const l=F.range(0,qe),p=F.range(0,1.7),f=F.range(.6,1);Ct(I,-6.9+Math.cos(l)*p,f*.55+(t>5?.8:0),44.5+Math.sin(l)*p*1.6,f,f*.75,f,d.haze.clone().multiplyScalar(.62),F),t<4&&St(I,r(-6.9+Math.cos(l)*p,f*.55+f*.6,44.5+Math.sin(l)*p*1.6),r(0,1,0),f*.3,.3,3,xe,F,{thick:.07})}await i.yield?.();for(let t=0;t<7;t++){const l=-7+F.range(-1,1),p=4.4+t*.95,f=F.range(.7,1.25);Xe(I,[[.02,0],[.5,.1],[.72,.5],[.6,.95],[.22,1.25],[.16,1.6],[.02,1.62]],10,j(l,0,p,F.range(-.2,.2),0,F.range(-.2,.2),f),{colorFn:Se(gt,.2),mat:3})}for(let t=0;t<2;t++)for(let l=0;l<4;l++){const p=new s.TorusGeometry(1-l*.05,.14,6,18);I.add(p,j(7.4+t*2.3,.16+l*.27,20.5+t*1.2,Math.PI/2,0,l*.4),{colorFn:Se(t?Lt.clone().lerp(xe,.3):xe,.1),mat:1,uvScale:[14,1]})}for(let t=0;t<6;t++)ue(I,4.3+t*.62+t%2*.1,.07,2.9+F.range(-.08,.08),.42,.12,1,{seg:[1,1,2],round:.05,colorFn:Se(We.clone().multiplyScalar(.6),.2),mat:5,ry:F.range(-.15,.15)});for(let t=0;t<3;t++)Ct(I,7+Math.cos(t*2.1)*.75,.3,7.4+Math.sin(t*2.1)*.75,.5,.42,.5,Ma,F);Xe(I,[[.02,0],[.55,.05],[.82,.5],[.7,1],[.36,1.25],[.4,1.36],[.02,1.42]],12,j(7,.62,7.4),{colorFn:Se(E("#3a3a40")),mat:8}),H(r(7.65,1.25,7.4),r(8.45,1.85,7.4),.14,.07,E("#3a3a40"),{rings:2,radial:6,mat:8})}await i.yield?.();for(const[e,a]of[[-1,-7],[1,-7],[-1,-272],[1,-272],[-1,-284],[1,-263]]){const n=e*47.3,o=new s.BoxGeometry(7.4,.5,9.5,5,1,6),t=o.attributes.position;for(let f=0;f<t.count;f++)t.setY(f,t.getY(f)+.22*y.n2(t.getX(f)*.9+a,t.getZ(f)*.9)-.12*Math.abs(t.getX(f))*.2);o.computeVertexNormals(),I.add(o,j(n-e*3.6,6.3,a,0,0,e*.3),{colorFn:(f,w,W,N)=>N.copy(yt).multiplyScalar(.8+.3*y.n2(f*2,W*.3)),mat:1,uvScale:[3,6]});for(const f of[-4,4])H(r(n-e*6.6,0,a+f),r(n-e*6.5,5.3,a+f),.22,.18,ne,{rings:3,radial:6});H(r(n-e*6.55,5.25,a-4.6),r(n-e*6.55,5.3,a+4.6),.17,.15,ne,{rings:3,radial:6}),await i.yield?.();for(let f=0;f<4;f++){const w=n-e*F.range(1.6,5),W=a+F.range(-3.6,3.6),N=F.range(.8,1.5);Xe(I,[[.02,0],[.5,.06],[.95,.7],[.9,1.2],[.5,1.6],[.46,1.85],[.6,1.95],[.5,1.98]],10,j(w,0,W,0,0,0,N),{colorFn:Se(f%2?aa:aa.clone().lerp(d.deep,.5),.15),mat:3})}Ct(I,n-e*4.6,.25,a+3.9,1.3,.5,1.2,E("#8a8a88"),F),await i.yield?.();for(let f=0;f<6;f++){const w=a-4.4+F.range(-.3,.3),W=.2+Math.floor(f/3)*.36;H(r(n-e*1.3,W,w+f%3*.4),r(n-e*4.2,W+.1,w+f%3*.4+F.range(-.3,.3)),.17,.13,mt.clone().lerp(ne,F()),{rings:2,radial:5})}const l=n-e*7.8,p=a+F.range(-1.5,1.5);Xe(I,[[.02,0],[.7,.04],[.98,.5],[1.05,1.05],[.94,1.1],[.88,.6]],12,j(l,0,p),{colorFn:Se(xe,.1),mat:1,uvScale:[6,2]});for(let f=0;f<9;f++){const w=F.range(0,qe),W=F.range(0,.6);Ct(I,l+Math.cos(w)*W,.95+F.range(0,.3),p+Math.sin(w)*W,.28,.26,.28,d.deep.clone().lerp(d.blue,.3).multiplyScalar(.7),F)}await i.yield?.()}for(const e of[-1,1]){for(let n=0;n<5;n++){const o=-263-n*5.3+F.range(-1,1),t=F.range(7,11),l=[e*47.7,t,o],p=F.range(0,6);H(r(e*48,t,o),r(e*47.4,t+.1,o),.09,.07,We,{rings:2,radial:5}),H(r(e*47.6,t,o),r(e*47.5,t-F.range(2.4,3.6),o+.1),.4,.26,Ne(F.range(1,7),new s.Color,d),{rings:5,radial:7,mat:1,kind:1,piv:l,phase:p,bow:.2})}const a=[];for(let n=0;n<=12;n++)a.push(r(e*(47.6-.5*Math.abs(Math.sin(n*1.7))),.25+1.1*Math.abs(Math.sin(n*.9)),-258-n*2.4));Ht(I,a,.07,{color:E("#5c6a3a"),segs:36,radial:4});for(let n=1;n<12;n+=2)Xe(I,[[.02,0],[.4,.08],[.55,.42],[.36,.8],[.12,1],[.02,1.02]],9,j(a[n].x-e*.5,0,a[n].z+.4,F.range(-.5,.5),0,F.range(-.5,.5),F.range(.8,1.3)),{colorFn:Se(gt,.15),mat:3});await i.yield?.()}for(const e of Le){const a=r(e.x,16.3,e.z),n=de[Math.round(he(e.z+13,0,.45)*240)],o=Math.atan2(n.z-e.z,n.x-e.x)+(e.seed-.5)*.12;for(let t=0;t<3;t++){const l=o+Math.PI+(t===0?0:t===1?2.2:-2.2),p=r(Math.cos(l)*5.75,0,Math.sin(l)*5.75);H(r(e.x+p.x,0,e.z+p.z),r(e.x-p.x*.06,17.3,e.z-p.z*.06),.34,.19,ne,{step:2.6,radial:7,v0:t*7,colorFn:(f,w,W)=>W.copy(mt).lerp(ne,.55+.45*f).lerp(d.ochre,.2).lerp(Re,.4*(1-O(0,.2,f)))})}St(I,a,r(0,1,0),.38,1.2,5,xe,F),H(r(e.x-2.5,15.25,e.z),r(e.x+2.5,15.25,e.z),.15,.15,We,{rings:2,radial:6});for(const t of[-1.6,1.6])Ht(I,[r(e.x,16.1,e.z),r(e.x+t,15.35,e.z)],.07,{color:Lt,segs:2,radial:4})}await i.yield?.();const Ie=m.fork("poles"),ka=(e,a)=>{let n=1e9;for(const o of de){const t=(o.x-e)**2+(o.z-a)**2;t<n&&(n=t)}return Math.sqrt(n)},Sa=ke.filter(e=>ge(e.x,1,e.z)<26).sort((e,a)=>e.seed-a.seed),wt=[];Sa.forEach((e,a)=>{if(!Le.includes(e)){if(a%3===0&&ka(e.x,e.z)>9){const n=Ie.range(0,qe),o=Math.cos(n),t=Math.sin(n),l=Ie.range(0,6),p=r(e.x+o*3.4,-2.2,e.z+t*3.4),f=r(e.x+o*4.52,.1,e.z+t*4.52),w=f.clone().sub(p).normalize(),W=p.clone().addScaledVector(w,Ie.range(6.2,7.6)),N=[f.x,f.y,f.z];H(p,W,.15,.11,ne,{step:1.5,radial:6,kind:3,phase:l,piv:N,bow:.1,bowDir:r(-t,0,o),colorFn:(ee,K,v,G)=>v.copy(ne).multiplyScalar(.85).lerp(Re,1-O(.2,2.4,G))}),H(W.clone().addScaledVector(r(-t,0,o),-.5),W.clone().addScaledVector(r(-t,0,o),.5),.07,.07,ne,{rings:2,radial:5,kind:3,phase:l,piv:N})}if(a%3===1){const n=Ie.range(0,qe),o=e.x+Math.cos(n)*2.3,t=e.z+Math.sin(n)*2.3,l=[o,it+.22,t],p=Ie.range(0,6);Xe(I,[[.02,-.5],[.36,-.42],[.56,-.16],[.62,.06],[.57,.08],[.51,-.13],[.31,-.35],[.02,-.41]],12,j(o,it+.22,t),{colorFn:Se(gt,.1),mat:3,kind:4,phase:p,piv:l}),H(r(o+.55,it+.25,t),r(o+1.25,it+.5,t+.1),.12,.07,gt,{rings:2,radial:5,mat:3,kind:4,phase:p,piv:l})}(a%3===2||a%4===0)&&wt.push([e.x+Ie.range(-2,2),1.6+Ie.range(0,1.4),e.z+Ie.range(-2,2)])}}),await i.yield?.(),Z.perches.slice(0,2).forEach((e,a)=>{const n=X(e).add(r(0,-.05,0)),o=[n.x,n.y,n.z],t=a*2.4,l=(a?2.6:-.5)+R,p=E("#16161c"),f=E("#e9e6dc").multiplyScalar(.8),w=(W,N,ee)=>I.add(W,j(n.x,n.y,n.z,0,l,0).multiply(N),{color:ee,mat:8,kind:5,phase:t,piv:o});w(new s.SphereGeometry(1,9,7),j(0,.62,0,-.5,0,0,.36,.4,.66),p),w(new s.SphereGeometry(1,8,6),j(0,.6,.28,-.4,0,0,.3,.3,.36),f),w(new s.SphereGeometry(1,8,6),j(0,1.08,.5,0,0,0,.24,.24,.27),p),w(new s.ConeGeometry(.1,.42,6),j(0,1.06,.88,Math.PI/2,0,0),E("#24242a")),w(new s.BoxGeometry(.34,.06,.8,2,1,2),j(0,.3,-.72,.5,0,0),p);for(const W of[-.14,.14])w(new s.CylinderGeometry(.035,.035,.34,4),j(W,.12,.05),E("#24242a"))}),await i.yield?.();const ca=new s.Mesh(await I.buildAsync(i),Ja(ye({uStain:{value:Re}})));ca.frustumCulled=!1,z.add(ca),await i.yield?.();const Ca=$a(qt,Wt,Lt.clone().lerp(xe,.25).multiplyScalar(.6));z.add(Ca),await i.yield?.();{const e=new s.PlaneGeometry(16,13);e.translate(0,6.5,.3);const a=new s.Mesh(e,new s.ShaderMaterial({uniforms:{uGlare:{value:L(c.door||c.haze).multiplyScalar(x==="night"?.1:.13)}},transparent:!0,depthWrite:!1,blending:s.AdditiveBlending,side:s.DoubleSide,fog:!1,vertexShader:"varying vec3 vW; void main(){ vW = position; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.); }",fragmentShader:`
          uniform vec3 uGlare; varying vec3 vW;
          void main(){
            vec3 cp = cameraPosition; float inside = smoothstep(2.5, 22., cp.z);
            vec2 far = cp.xy + (vW.xy - cp.xy) * ((cp.z + 150.) / max(cp.z - vW.z, .5));
            float notch = (1. - smoothstep(2., 5.5, abs(far.x))) * smoothstep(-1.5, .5, far.y) * (1. - smoothstep(7., 12., far.y));
            float a = inside * (1. - .9 * notch) * (.75 + .25 * smoothstep(0., 13., vW.y));
            gl_FragColor = vec4(uGlare * a, 1.);
          }`}));a.frustumCulled=!1,a.renderOrder=4,z.add(a)}const Aa=Math.max(24,Math.round(60*Math.min(1,P)))+3,bt=ye({uPush:{value:0},uScatter:{value:0}}),fa=(()=>{const e=new kt,a=d.deep.clone().lerp(d.blue,.55),n=d.orange.clone();et(e,r(0,.07,-.74),r(0,.12,.47),{rings:14,radial:7,cap:!0,radiusFn:u=>u<.52?$(.018,.075,Math.pow(u/.52,.8)):u<.8?.075+.05*Math.sin((u-.52)/.28*Math.PI):u<.86?.07:$(.092,.03,Math.pow((u-.86)/.14,1.6)),colorFn:(u,b,_)=>{u>.8?_.copy(n):u<.5?_.copy(Math.floor(u*22)%2?a:a.clone().lerp(d.sky,.5)).lerp(a,u<.2?0:.5):_.copy(a).lerp(d.blue,.35*Math.sin((u-.5)/.3*Math.PI)),_.multiplyScalar(.62+.38*Math.cos(b-Math.PI/2))}});for(const u of[-1,1])for(const[b,_,J]of[[.2,.3,a],[-.1,-.24,a]])et(e,r(u*.07,.1,b),r(u*.27,.14,(b+_)/2),{rings:1,radial:4,radiusFn:()=>.044,colorFn:(oe,ce,Ve)=>Ve.copy(J).multiplyScalar(.8)}),et(e,r(u*.27,.14,(b+_)/2),r(u*.4,0,_),{rings:1,radial:4,cap:!0,radiusFn:oe=>$(.04,.026,oe),colorFn:(oe,ce,Ve)=>Ve.copy(J).multiplyScalar(.7)});const o=e.build(),t=[],l=m.fork("lizards"),p=new s.Vector3,f=new s.Matrix4,w=(u,b,_,J={})=>t.push({P:u,n:b.clone().normalize(),f:_.clone().normalize(),ph:l.range(0,40),male:J.male??(l()<.6?1:0),dart:J.dart??l.range(.3,1),flag:J.flag||0,s:J.s??l.range(.85,1.15),gate:J.gate||0});w(r(0,0,0),r(0,0,1),r(0,1,0),{male:1,dart:0,flag:-1,s:1.15}),pe.forEach((u,b)=>{const _=[9,17,6][b],J=_/u.top.y,oe=u.foot.clone().lerp(u.top,J),ce=u.top.clone().sub(u.foot).normalize(),Ve=r(b===2?1:0,0,b===2?.3:1).normalize();Ve.addScaledVector(ce,-Ve.dot(ce)).normalize(),w(oe.addScaledVector(Ve,$(.56,.3,J)+.02),Ve,ce,{dart:.5})});const W=r(0,1,0),N=(u=-2.5,b=2.5)=>{const _=l.range(u,b);return r(Math.sin(_),Math.cos(_),0)},ee=u=>-289.3+.9*$(1,.7,u/26.4)+.07;for(let u=0;u<9;u++){const b=u%2?1:-1,_=3+(u>>1)*4.1+l.range(-1,1);w(r(b*(12.6+l.range(-.6,.6)),_,ee(_)),r(0,.01,1),N(),{flag:1,male:u<6?1:0,s:u<3?1.3:l.range(.85,1.1),gate:1})}for(let u=0;u<4;u++)w(r((u-1.5)*4.2+l.range(-1,1),l.range(24.2,25.4),-289.95),r(0,0,1),N(-1.9,1.9),{flag:1,male:u%2,gate:1});for(let u=0;u<4;u++){const b=u%2?1:-1;w(r(b*(u<2?l.range(8.9,9.6):l.range(10.5,13.5)),u<2?l.range(4.5,8.5):l.range(3,11),1.62),r(0,0,1),N(u<2?-1.2:-2.6,u<2?1.2:2.6),u<2?{male:1,s:1.25,dart:.4}:{})}for(let u=0;u<6;u++){const b=u%2?1:-1,_=-260-12*Math.floor(u/2)-.1;w(r(b*46.15,l.range(3,14),_-.4),r(-b,0,0),r(0,1,l.range(-.4,.4)),{flag:1})}const K=Ue.map(([u,b])=>({x:u,z:b,d:ge(u,8,b)})).filter(u=>u.d<30&&u.d>6.5).sort((u,b)=>u.d-b.d);for(let u=0;t.length<Aa&&u<K.length*2;u++){const b=K[u*3%K.length],_=de[Math.round(he(b.z,b.z<re?.66:0,b.z<re?1:.42)*240)].y,J=fe(_+l.range(-3,5),2,30),oe=Math.atan2(-b.x,.4)+l.range(-1.1,1.1)+(b.z<re,0),ce=r(Math.sin(oe),0,Math.cos(oe));w(r(b.x+ce.x*($(.56,.3,J/42)*.74+.03),J,b.z+ce.z*($(.56,.3,J/42)*.74+.03)),ce,r(0,l()<.75?1:-1,0))}const v=new s.InstancedMesh(o,new s.ShaderMaterial({uniforms:bt,fog:!0,vertexColors:!0,vertexShader:Te+Ce+`
          attribute vec4 aLz; attribute float aLq; uniform float uPush, uScatter;
          varying vec3 vW, vN, vCol; varying float vMale, vLq, vH;
          void main(){
            vec3 p = position; float ph = aLz.x, cyc = uTime * .45 + ph, n = floor(cyc), fr = fract(cyc), act = h11(n * 1.3 + ph * 7.);
            vH = position.y;
            // no two lie alike: the body curves one way, the tail the other
            float bd = aLz.w < -.5 ? 0. : (h11(ph * 1.7 + 3.) - .5) * 1.6; p.x += bd * p.z * p.z * (p.z < 0. ? 1.5 : -.8);
            float push = act > .45 ? max(sin(fr * 37.7), 0.) * step(fr, .5) : 0.;
            if (aLz.w < -.5) push = uPush;
            p.y += push * .12 * smoothstep(-.25, .35, p.z);
            p.y += (act < .3 ? max(sin(fr * 50.), 0.) * step(fr, .3) : 0.) * .05 * smoothstep(.25, .45, p.z);
            p.x += sin(uTime * 2.3 + ph + p.z * 5.) * .07 * smoothstep(-.05, -.75, p.z);
            float dart = mix(h11(n - 1. + ph) - .5, h11(n + ph) - .5, smoothstep(.82, 1., fr)) * 2. * aLz.z;
            dart += uScatter * max(aLz.w, 0.) * (3. + 5. * h11(ph));
            p.x += sin(dart * 9.) * .04; p.z += dart;
            vec4 w = instanceMatrix * vec4(p, 1.); vW = w.xyz; vN = normalize(mat3(instanceMatrix) * normal + vec3(0., 1e-5, 0.)); vCol = color; vMale = aLz.y; vLq = aLq;
            vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:Pe+Ae+`
          varying vec3 vW, vN, vCol; varying float vMale, vLq, vH;
          void main(){
            vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); float l = dot(vCol, vec3(.4, .4, .2));
            vec3 alb = mix(vec3(l) * vec3(1.5, 1.25, .95) + vec3(.06, .05, .04), vCol, vMale);
            alb *= .8 + .4 * vn3(vW * 60.);
            alb *= mix(.42, 1., smoothstep(.0, .1, vH));                    // the belly and the feet in the body's own shade
            float warm = smoothstep(.1, .4, vCol.r - vCol.b) * vMale;
            vec3 Ld = vLq < 0. ? uGateSun.xyz : uSunDir; float lq = abs(vLq);
            vec3 sunL = vLq < 0. ? uSunCol * gateLit(vW) : uSunCol * mix(uFilt, vec3(1.), smoothstep(.15, .9, lq)) * lq;
            float ndl = dot(N, Ld), dif = smoothstep(-.1, .5, ndl) * max(ndl * .85 + .15, 0.);
            vec3 amb = ambAt(N, vW);
            vec3 V = normalize(cameraPosition - vW + vec3(1e-5));
            vec3 c = alb * (sunL * dif + amb * 1.2) + alb * warm * (.2 + dot(amb, vec3(.5)));
            c += sunL * pow(max(dot(N, normalize(Ld + V + vec3(1e-5))), 0.), 24.) * .12 * step(0., ndl);
            gl_FragColor = vec4(max(c, 0.), 1.);
            #include <fog_fragment>
          }`}),t.length),G=new Float32Array(t.length*4),Y=new Float32Array(t.length),B=(u,b,_,J,oe)=>{p.crossVectors(_,J).normalize(),f.makeBasis(p,_,J).scale(r(oe,oe,oe)).setPosition(b),v.setMatrixAt(u,f)};t.forEach((u,b)=>{u.f.addScaledVector(u.n,-u.f.dot(u.n)).normalize(),B(b,u.P,u.n,u.f,u.s*1),G.set([u.ph,u.male,u.dart,u.flag],b*4),Y[b]=b===0?1:u.gate?-1:Me(ve(u.P.x+u.n.x*.4,u.P.y,u.P.z+u.n.z*.4-.25))});const le=new s.InstancedBufferAttribute(G,4);o.setAttribute("aLz",le),o.setAttribute("aLq",new s.InstancedBufferAttribute(Y,1)),v.frustumCulled=!1,z.add(v);{const u=new s.PlaneGeometry(.9,1.75);u.rotateX(-Math.PI/2),u.translate(0,.012,-.1),u.setAttribute("aLz",le);const b=new s.InstancedMesh(u,new s.ShaderMaterial({uniforms:bt,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,side:s.DoubleSide,fog:!1,vertexShader:Ce+`
            attribute vec4 aLz; uniform float uScatter; varying vec2 vS;
            void main(){
              vec3 p = position; float ph = aLz.x, cyc = uTime * .45 + ph, n = floor(cyc), fr = fract(cyc);
              float dart = mix(h11(n - 1. + ph) - .5, h11(n + ph) - .5, smoothstep(.82, 1., fr)) * 2. * aLz.z + uScatter * max(aLz.w, 0.) * (3. + 5. * h11(ph));
              p.z += dart; vS = uv * 2. - 1.;
              gl_Position = projectionMatrix * viewMatrix * instanceMatrix * vec4(p, 1.);
            }`,fragmentShader:`
            varying vec2 vS;
            void main(){ float r = length(vS * vec2(1., .92)), a = (1. - smoothstep(.25, 1., r)) * .5; gl_FragColor = vec4(0.02, 0.02, 0.05, a); }`}),t.length);b.instanceMatrix=v.instanceMatrix,b.frustumCulled=!1,b.renderOrder=1,z.add(b)}return{im:v,setM:B,list:t}})(),se=(()=>{let e=null;for(let p=.555;p<=.5551;p+=.004){const f=te.pointAt(p),w=r(be-f.x,0,re-f.z).normalize();for(const W of pe){const N=f.y-.6,ee=N/W.top.y,K=W.foot.clone().lerp(W.top,ee),v=K.distanceTo(f),G=Math.acos(fe(r(K.x-f.x,0,K.z-f.z).normalize().dot(w),-1,1)),Y=v*.3+26*Math.max(0,G-.1);v<16&&(!e||Y<e.sc)&&(e={d:v,u:p,lg:W,y:N,sc:Y})}}e||(e={d:9,u:.555,lg:pe[1],y:te.pointAt(.555).y-.6});const a=e.lg.top.clone().sub(e.lg.foot).normalize(),n=te.pointAt(e.u),o=e.y/e.lg.top.y,t=e.lg.foot.clone().lerp(e.lg.top,o),l=n.clone().sub(t);return l.addScaledVector(a,-l.dot(a)).normalize(),{u:e.u,d:e.d,ax:a,P0:t,n0:l,r:$(.56,.3,o)+.03,n:new s.Vector3,P:new s.Vector3,f:new s.Vector3}})(),Ta=(()=>{const e=new kt,a=S?E("#f1eee4").multiplyScalar(.85):E("#c9b0a8").multiplyScalar(.8),n=E(S?"#d8b060":"#6a5a60"),o=(v,G,Y)=>e.add(v,G,{color:Y,mat:8});if(o(new s.SphereGeometry(1,8,6),j(0,S?.62:.3,0,-.25,0,0,.19,S?.24:.2,.36),a),o(new s.SphereGeometry(1,7,5),j(0,S?1.08:.54,.3,0,0,0,.11,.12,.13),a.clone().multiplyScalar(S?1:.92)),o(new s.ConeGeometry(.04,S?.3:.15,5),j(0,S?1.06:.53,S?.56:.47,Math.PI/2,0,0),n),o(new s.BoxGeometry(.2,.04,.42,1,1,2),j(0,S?.56:.3,-.42,.25,0,0),a.clone().multiplyScalar(.75)),S){o(new s.CylinderGeometry(.05,.07,.42,5),j(0,.86,.2,.5,0,0),a);for(const v of[-.07,.07])o(new s.CylinderGeometry(.02,.02,.45,4),j(v,.22,0),n)}const t=e.build(),l=Math.round(30*Math.min(1.2,P)),p=new Float32Array(l*4),f=new Float32Array(l*2),w=m.fork("walkers"),W=ke.filter(v=>ge(v.x,1,v.z)<24&&!Le.includes(v));for(let v=0;v<l;v++){const G=W[(v*7+3)%W.length];p.set([G.x,G.z,w.range(0,qe),w.sign()*w.range(.5,1)],v*4),f.set([w.range(0,40),G.z<-84&&G.z>-112?1:0],v*2)}const N=new s.InstancedBufferGeometry;N.setIndex(t.index);for(const v of["position","normal","color"])N.setAttribute(v,t.attributes[v]);N.setAttribute("aDv",new s.InstancedBufferAttribute(p,4)),N.setAttribute("aDw",new s.InstancedBufferAttribute(f,2)),N.instanceCount=l;const ee=ye({uGone:{value:0}}),K=new s.Mesh(N,new s.ShaderMaterial({uniforms:ee,fog:!0,vertexColors:!0,vertexShader:Te+Ce+`
          attribute vec4 aDv; attribute vec2 aDw; uniform float uGone;
          varying vec3 vW, vN, vCol;
          void main(){
            float ph = aDw.x, tt = uTime * .5 + ph, walk = tt + sin(tt * 1.3) * .7;
            float ang = aDv.z + aDv.w * walk * .11, sp = aDv.w * (1. + .91 * cos(tt * 1.3));
            vec3 p = position; p.y += abs(sin(walk * 9.)) * .03 * step(.2, abs(sp));
            p.z += sin(walk * 18.) * .035 * smoothstep(.4, .5, position.y) * step(.2, abs(sp));
            p *= 1. - uGone * aDw.y;
            vec2 d = vec2(cos(ang), sin(ang)), tg = vec2(-d.y, d.x) * sign(aDv.w);
            vec3 w = vec3(aDv.x + d.x * 4.95, .12, aDv.y + d.y * 4.95) + vec3(tg.y * p.x + tg.x * p.z, p.y, -tg.x * p.x + tg.y * p.z);
            vN = vec3(tg.y * normal.x + tg.x * normal.z, normal.y, -tg.x * normal.x + tg.y * normal.z); vW = w; vCol = color;
            vec4 mvPosition = viewMatrix * vec4(w, 1.); gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:Pe+Ae+`
          varying vec3 vW, vN, vCol;
          void main(){ vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); float ndl = dot(N, uSunDir);
            vec3 c = vCol * (uSunCol * sunAt(vW) * smoothstep(-.1, .5, ndl) * max(ndl * .85 + .15, 0.) + ambAt(N, vW) * 1.25) * mix(.6, 1., smoothstep(.1, .5, vW.y));
            gl_FragColor = vec4(max(c, 0.), 1.);
            #include <fog_fragment>
          }`}));return K.frustumCulled=!1,z.add(K),t.dispose(),{mesh:K,U:ee}})();await i.yield?.();const Pa={sunDir:M.clone(),sunColor:c.sunCol[0],sunIntensity:c.sunCol[1]*.8,sky:c.sky[0],skyIntensity:c.sky[1]*2.6,ground:De[1],groundIntensity:c.gnd[1]*2.4},Ze=Ke.makeFauna(z,{light:Pa}),_t={body:"#1d1d24",belly:"#eeeae0",wingC:"#1a1a22",trail:"#22222c",tip:"#111118",beak:"#2a2a30",head:"#1a1a20",neckC:"#eeeae0"};Ze.add(Ke.makeFlock({rng:m.fork("door-crow"),species:"crows",count:1,size:3,speed:10,spread:[.1,.1,.1],wander:[.6,.5,.6,.5],flap:3.2,glide:.1,along:{path:te,side:1.2,up:2.4,lead:14,from:.02,to:.21,drift:2},..._t}),{always:!0}),Ze.add(Ke.makeFlock({rng:m.fork("well-crows"),species:"crows",count:6,size:3,speed:9,center:[be,38.5,re],radius:19,height:2.5,spread:[4,1.5,16],wander:[1.5,1,1.5,.4],..._t})),Ze.add(Ke.makeFlock({rng:m.fork("aisle-crows"),species:"crows",count:3,size:3,speed:10,spread:[5,2,9],cross:{path:te,u:.8,lead:46,angle:75,side:-1,height:9,span:110,duration:tt},..._t}));const Fa=S?{body:"#f4f1e8",belly:"#ffffff",wingC:"#efece2",trail:"#f6f4ee",tip:"#e2ddd0",beak:"#d8a850",head:"#f3ead2"}:{body:"#c9b0a8",belly:"#e6d6cf",wingC:"#b7a2a0",trail:"#d8c8c4",tip:"#6e6066",beak:"#5a4a4c",head:"#d2b6b0"},Ut=.33,to=Ze.add(Ke.makeFlock({rng:m.fork("doves"),species:"gulls",count:Math.round(16*P),size:S?1.25:.9,speed:13,form:"loose",spread:[5,1.6,9],wander:[1.4,.9,1.4,.9],flap:S?3.4:5.2,amp:.8,glide:.08,cross:{path:te,u:Ut,lead:13,angle:24,side:1,height:.5,rise:8.5,span:70,duration:tt},...Fa}),{always:!0});wt.length&&Ze.add(Ke.makeDragonflies({rng:m.fork("dragonflies"),count:Math.min(wt.length*2,Math.round(26*h)),size:5,positions:wt,roam:[3.2,.8,.7,0]})),await i.yield?.();const nt={value:0},$e=st.fxGroup();z.add($e.object);const ao=$e.add(st.makeParticles({rng:m.fork("dust"),preset:"dust",time:nt,count:Math.round(2400*h),colors:["#fff4dc","#dfe6ff","#ffffff"],intensity:.9,opacity:.55*Math.min(c.dust,1.2)}));$e.add(st.makeParticles({rng:m.fork("leaflets"),preset:"leaves",time:nt,follow:!1,center:[0,13,-279],box:[62,26,26],count:Math.round(230*h*P),colors:["#c9b24a","#a8a24a","#d8c060"],size:[.22,.46],lightDir:M.toArray()}));const oo=c.wet?null:$e.add(st.makeDustDevil({rng:m.fork("devil"),time:nt,position:[-30,0,-274],height:12,radius:[.5,2.2],color:"#d8c6a6",colorTop:"#e8dcc6",opacity:.28,wander:3,sunDir:M.toArray(),sunColor:c.sunCol[0],count:46,debris:90}));$e.add(st.makeSmokeColumn({rng:m.fork("steam"),time:nt,position:[8.5,1.95,7.4],height:6.5,radius:[.12,1.3],size:[.5,2.3],count:26,color:"#c4cad8",colorTop:"#e4e6ee",shadowColor:"#6a7088",ambient:"#30344a",opacity:.42,rate:.16,wind:[.15,0,.5],sunDir:M.toArray()})),await i.yield?.();const no=(()=>{const e=[],a=M.x/M.y,n=M.z/M.y,o=(v,G)=>Fe.cpu[fe(Math.floor((G-ut)/pt*Fe.L),0,Fe.L-1)*Fe.W+fe(Math.floor((v-ct)/ft*Fe.W),0,Fe.W-1)],t=M.x<0?-15:15;for(const v of[12,24,36,48])e.push({a:r(t,14.4,v),b:r(t,9.8,v),c:r(t-a*14.4,0,v-n*14.4),d:r(t-a*9.8,0,v-n*9.8),k:7});for(const v of[12,24,36,48])e.push({a:r(t,12.1,v-1.2),b:r(t,12.1,v+1.2),c:r(t-a*12.1,0,v-1.2-n*12.1),d:r(t-a*12.1,0,v+1.2-n*12.1),k:9});const l=[];for(const v of[-7,7,-1]){let G=1e9;for(let Y=-16;Y>-126;Y-=.4){const B=o(v,Y);B>.42&&B>=o(v,Y-.4)&&B>=o(v,Y+.4)&&Math.abs(Y-G)>5&&Math.hypot(v-be,Y-re)>34&&(l.push({x:v,z:Y,l:B}),G=Y)}}l.sort((v,G)=>G.l-v.l);for(const v of l.slice(0,Math.round(22*h)))e.push({a:r(v.x-3+a*13.4,13.4,v.z+n*13.4),b:r(v.x+3+a*13.4,13.4,v.z+n*13.4),c:r(v.x-3,0,v.z),d:r(v.x+3,0,v.z),k:.5+.5*v.l});for(let v=-186;v>-258;v-=12.6)for(const G of[-6,6])o(G,v)>.5&&o(G,v-2)>.5&&e.push({a:r(G-5+a*26,26,v+n*26),b:r(G+5+a*26,26,v+n*26),c:r(G-5,0,v),d:r(G+5,0,v),k:.55});const p=e.length,f=new Float32Array(p*12),w=new Float32Array(p*12),W=[];e.forEach((v,G)=>{[v.a,v.b,v.c,v.d].forEach((Y,B)=>{f.set([Y.x,Y.y,Y.z],G*12+B*3),w.set([B%2,B<2?1:0,v.k],G*12+B*3)}),W.push(G*4,G*4+2,G*4+1,G*4+1,G*4+2,G*4+3)});const N=new s.BufferGeometry;N.setAttribute("position",new s.BufferAttribute(f,3)),N.setAttribute("aT",new s.BufferAttribute(w,3)),N.setIndex(W);const ee=ye({uBlade:{value:.026*(c.bladeK??1)*Math.min(1.3,.35+c.dust)*(x==="night"?2:1)}}),K=new s.Mesh(N,new s.ShaderMaterial({uniforms:ee,fog:!0,transparent:!0,depthWrite:!1,blending:s.AdditiveBlending,side:s.DoubleSide,vertexShader:Te+`
          attribute vec3 aT; varying vec3 vT, vW;
          void main(){ vT = aT; vW = position; vec4 mvPosition = viewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:Pe+Ce+`
          uniform float uBlade; varying vec3 vT, vW;
          void main(){
            float e = smoothstep(0., .22, vT.x) * smoothstep(1., .78, vT.x) * smoothstep(0., .1, vT.y) * smoothstep(1., .8, vT.y);
            float n = fbm2(vec2(vW.x * .35 + vW.z * .2 + uTime * .12, vW.y * .25 - uTime * .07));
            float tr = .75 + .25 * sin(uTime * 2.1 + vW.z * .7);
            float d = distance(cameraPosition, vW);
            float a = e * (.35 + 1.1 * n) * tr * vT.z * uBlade * smoothstep(1.5, 9., d) * (1. - smoothstep(110., 190., d));
            gl_FragColor = vec4(max(uSunCol * a * (1. - fogFactorSafe()), 0.), 1.);
          }`.replace("fogFactorSafe()","(1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth))")}));return K.frustumCulled=!1,K.renderOrder=5,z.add(K),{mesh:K,count:p}})();await i.yield?.();const Wa=Je.makeWind({direction:[.1,-1],strength:.9});Je.prepareLeafTexture&&await Je.prepareLeafTexture({},()=>i.yield?.());const ua=Je.windMaterial({wind:Wa,backlight:.62,backlightTint:"#e4dfa2",wrap:.8,leafAmbient:c.neemAmb??1.9,ambient:2.4,sheen:.3});await i.yield?.();for(const e of[-1,1]){const a=Je.oakGeometry({rng:m.fork("neem"+e),height:28,detail:2,leaf:"#84966a",leafLight:"#b8c08a",leafDark:"#5c6c4c",bark:"#a89a8c",barkDark:"#6a6058"}),n=fe(11.5/Math.max(a.userData.radius||12,1),.7,1.3),o=new s.Mesh(a,ua);o.position.set(e*Yt,0,at),o.scale.set(n,1,n),o.rotation.y=m.range(0,qe),z.add(o),await i.yield?.()}const zt=new s.DirectionalLight(L(c.sunCol).multiplyScalar(1/c.sunCol[1]),c.sunCol[1]*1.1);zt.position.copy(M).multiplyScalar(100).add(r(0,0,at)),zt.target.position.set(0,0,at),z.add(zt,zt.target,new s.HemisphereLight(new s.Color(c.sky[0]).lerp(new s.Color("#b4aaa2"),.5),new s.Color("#8a7664"),c.sky[1]*2.3)),await i.yield?.();const It=(()=>{const a=new s.PlaneGeometry(8,5.2,14,9),n=new Float32Array(80),o=new Float32Array(20),t=m.fork("sails"),l=new s.Color,p=[],f=Nt>=0?Zt(Math.floor(Nt/8)):-234,w=At+rt*5-2.3,W=ke.filter(B=>Math.abs(B.x)>12&&B.z<-262).sort((B,le)=>B.x-le.x);for(let B=0;B<20;B++){Ne(3.4+t.range(-1.3,1.5),l,d),n.set([l.r,l.g,l.b,t.range(0,6)],B*4);const le=(B===4||B===12)&&W.length?W[B===4?0:W.length-1]:null;p.push({p0:r(-13.5-B*1.6,w,f),p1:le?r(le.x-Math.sign(le.x)*3.5,.4,le.z+t.range(-1.2,1.2)):r(t.sign()*t.range(1.5,7),t.range(4,15),-297),u0:.644+B*7%20*.0028,u1:le?.86:.644+B*7%20*.0028+t.range(.105,.135),settle:!!le,sp:t.range(.7,1.3)*t.sign(),ph:t.range(0,6)})}a.setAttribute("aSc",new s.InstancedBufferAttribute(n,4));const N=new s.InstancedBufferAttribute(o,1);N.setUsage(s.DynamicDrawUsage),a.setAttribute("aCalm",N);const ee=new s.InstancedMesh(a,new s.ShaderMaterial({uniforms:ye({uStain:{value:Re},uPale:{value:d.haze.clone().multiplyScalar(.8)}}),fog:!0,side:s.DoubleSide,vertexShader:Te+Ce+Kt+`
          attribute vec4 aSc; attribute float aCalm; varying vec3 vW, vN, vCol; varying vec3 vUv2;
          // a loose cloth in the wind: two fold axes turning against each other, a belly that fills and empties, one corner curling
          vec3 sailAt(vec2 uvc, float ph, float calm){
            vec2 q = uvc * vec2(8., 5.2); float tt = uTime;
            float a1 = ph + tt * .7, a2 = ph * 1.7 - tt * .5 + 1.9;
            float w1 = dot(q, vec2(cos(a1), sin(a1))) * .6 + tt * 2.3 + ph, w2 = dot(q, vec2(cos(a2), sin(a2))) * 1.2 - tt * 3.1 + ph * 2.;
            float belly = cos(uvc.x * 3.1416) * cos(uvc.y * 3.1416) * (1.3 + .9 * sin(tt * 1.3 + ph * 3.));
            vec2 cd = uvc - vec2(sin(ph * 7.) > 0. ? .5 : -.5, .5); float curl = 1. - smoothstep(0., .55, length(cd));
            float z = 1.15 * sin(w1) + .55 * sin(w2) + belly + 2.2 * curl * curl * sin(tt * 1.9 + ph);
            float k = 1. - .16 * (1. - calm);                                   // folds take up cloth
            return vec3(q.x * k, q.y * k, z * mix(1., .05, calm));
          }
          void main(){
            vec2 uvc = uv - .5; float ph = aSc.w, e = .02;
            vec3 p = sailAt(uvc, ph, aCalm), px = sailAt(uvc + vec2(e, 0.), ph, aCalm), py = sailAt(uvc + vec2(0., e), ph, aCalm);
            vec3 n = normalize(cross(px - p, py - p) + vec3(0., 0., 1e-6));
            vec4 w = instanceMatrix * vec4(p, 1.); vec3 wn = normalize(mat3(instanceMatrix) * n + vec3(0., 1e-5, 0.));
            float wet = 0.;
            if (aCalm > 0.) {                                                   // settled: draped over the rim, the rest sunk in the liquor
              float d = pitAt(w.xz).x, rim = smoothstep(4.15, 4.85, d);
              float lie = mix(mix(-.66, -.45, smoothstep(2.3, 3.7, d)), .21 - .15 * smoothstep(4.9, 5.6, d), rim);   // afloat by the rim, sinking further in
              float wr = sin(w.x * 2.3 + ph) * sin(w.z * 2.9 + ph * 2.) + .5 * sin(w.x * 5.1 - w.z * 4.3);
              lie += .07 * wr * rim;
              w.y = mix(w.y, lie, aCalm);
              wn = normalize(mix(wn, vec3(.16 * cos(w.x * 2.3 + ph), 1., .16 * cos(w.z * 2.9 + ph * 2.)), aCalm));
              wet = (1. - smoothstep(4.3, 5.5, d + .5 * wr)) * aCalm;
            }
            vW = w.xyz; vN = wn; vCol = aSc.rgb; vUv2 = vec3(uv, wet);
            vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:Pe+Ae+`
          uniform vec3 uStain, uPale;
          varying vec3 vW, vN, vCol; varying vec3 vUv2;
          void main(){
            vec3 N = normalize(vN + vec3(0., 0., 1e-5)); if (!gl_FrontFacing) N = -N;
            vec2 q = vUv2.xy * vec2(8., 5.2); float wet = vUv2.z;
            vec3 alb = vCol * (.8 + .4 * fbm2(q * 1.3 + vCol.b * 30.));
            // the bank's own resist work: roundels on most, stitched stripes on some, a few left plain
            float fq = fwidth(q.x) + fwidth(q.y), aa = fq * 1.5, pt = fract(vCol.b * 37. + vCol.g * 53.), res = 0.;
            if (pt < .6) { vec2 g = q / 1.45 + pt * 9.; vec2 id = floor(g); g.x += .5 * mod(id.y, 2.); vec2 f = fract(g) - .5; float r = length(f) * 1.5;
              res = (1. - smoothstep(.5, .54 + aa, r)) * smoothstep(.2, .24 + aa, r) + (1. - smoothstep(.07, .1 + aa, r)); }
            else if (pt < .85) { float sx = abs(fract(q.x / .9 + pt) - .5) * .9; res = (1. - smoothstep(.06, .08 + aa, sx)) * (.55 + .45 * step(.3, fract(q.y * 2.3 + vn2(q * 2.)))); }
            alb = mix(alb, mix(alb * 1.6, uPale, .4), clamp(res, 0., 1.) * .8 * (1. - smoothstep(.12, .5, fq)));
            float slub = vn2(vec2(q.x * 2.5, q.y * 50.)) * .5 + vn2(vec2(q.x * 50., q.y * 2.5)) * .5; alb *= .92 + .16 * slub;
            vec2 e = min(vUv2.xy, 1. - vUv2.xy) * vec2(8., 5.2); alb *= 1. - .3 * (1. - smoothstep(.1, .18, min(e.x, e.y)));
            alb = mix(alb, alb * .34 + uStain * .05, wet);
            float ndl = dot(N, uSunDir); vec3 sunL = uSunCol * sunAt(vW);
            vec3 tcol = pow(alb + 1e-4, vec3(.86)); float tl = dot(tcol, vec3(.3, .5, .2)); tcol = max(mix(vec3(tl), tcol, 1.75), 0.);
            vec3 V = normalize(cameraPosition - vW + vec3(1e-5)); float nv = abs(dot(N, V));
            float fold = mix(.42, 1.06, smoothstep(.08, .8, nv));                 // folds turning away from us fall dark
            vec3 c = (alb * (sunL * (max(ndl, 0.) * .8 + .05) + ambAt(N, vW) * 1.15) + tcol * sunL * pow(max(-ndl, 0.) + 1e-4, .55) * .5 * (1. - wet)) * mix(fold, 1., wet);
            c += (alb * 2. + .03) * sunL * pow(1. - nv, 4.) * .55 * (1. - wet);     // and their edges catch the sun
            c += sunL * pow(max(dot(N, normalize(uSunDir + V + vec3(1e-5))), 0.), 50.) * wet * .9;
            gl_FragColor = vec4(max(c, 0.), 1.);
            #include <fog_fragment>
          }`}),20);ee.frustumCulled=!1,ee.visible=!1,z.add(ee);const K=new s.Vector3,v=new s.Vector3,G=new s.Matrix4;return{im:ee,place:(B,le)=>{for(let u=0;u<20;u++){const b=p[u],_=fe((B-b.u0)/(b.u1-b.u0),0,1),J=1-_;K.set($(b.p0.x,b.p1.x,O(0,.5,_))+Math.sin(_*9+b.ph)*2.6*J*Math.min(1,_*5),$(b.p0.y,b.p1.y,O(0,b.settle?1:.75,_))+Math.sin(_*13+b.ph*2)*1.8*J*Math.min(1,_*5),$(b.p0.z,b.p1.z,Math.pow(_,1.12)));const oe=_<=0?0:b.settle?1:Math.min(1,_*12)*(1-O(.86,1,_)),ce=b.settle?O(.7,1,_):0;Jt.set($(_*5.5*b.sp+.3*Math.sin(le*1.7+b.ph),-Math.PI/2,ce),$(_*2.2*b.sp+b.ph,0,ce),$(Math.sin(_*5+b.ph)*.7,b.ph,ce)),G.compose(K,wa.setFromEuler(Jt),v.set(oe,oe,oe)),ee.setMatrixAt(u,G),o[u]=ce}ee.instanceMatrix.needsUpdate=!0,N.needsUpdate=!0}}})(),Ee=new s.Vector3,pa=new s.Vector3,da=new s.Vector3,Vt=new s.Color,ha=new s.Vector3,Mt=e=>te.pointAt(e,pa).y,ma=2*tt*me,va=Mt(me),La=Mt(ze)-va,Rt=Le[0]||null,Bt=.235,Da=te.pointAt(Bt,pa).z,Qe=new s.Vector3,qa=new s.Vector3;let ga=0;return{scene:z,path:te,duration:tt,title:"The Blue Yard",ride:"none",pace:e=>1.12-.56*O(.4,.47,e)*(1-O(.57,.64,e)),camera:{fov:62,near:.3,far:1400,lookAhead:16,sway:.7,bank:.42},pois:[{at:(e,a)=>{const n=O(.2,.235,a)*(1-O(.262,.295,a));return te.pointAt(Math.min(a+$(26,12,n)/Ge,1),Qe),Qe.y=$(-2,-5,n),Qe},from:.02,to:.31,weight:.46,fade:.16},...Rt?[{at:[Rt.x+1.8,5.2,Rt.z],from:.085,to:.192,weight:.6,fade:.3}]:[],{at:[be,20,re],from:.275,to:.42,weight:.9,fade:.3},{at:(e,a)=>(da.set(be,$(16,Mt(a)+3.5,O(.43,.5,a))-5*O(.55,.6,a),re+1.6*O(.525,.545,a)*(1-O(.56,.585,a))),da.lerp(te.pointAt(Math.min(a+16/Ge,1),qa),O(.562,.6,a))),from:.36,to:.61,weight:.95,fade:.2},{at:(e,a)=>(te.pointAt(Math.min(a+30/Ge,1),Qe),Qe.y=-7,Qe),from:.645,to:.775,weight:.5,fade:.4}],portal:{shape:"arch",width:13,height:16.5,color:c.portal,glow:.9,revealDistance:170},post:{exposure:c.exposure,bloom:{strength:.3,radius:.62,threshold:1.08},grade:{saturation:c.sat,contrast:1.05,tint:c.tint,shadowTint:c.shadow,vignette:.3,grain:.022,aberration:0}},update(e,a,n,o){nt.value=a,Ee.setFromMatrixPosition(n.matrixWorld),ga+=e*2*(1-O(0,.02,o));const t=o<me?2*tt*o:o<ze?ma+(Mt(o)-va):ma+La+2*tt*(o-ze);k.setHaul(t+ga),k.setWind(1+.45*Math.sin(a*.7)**2),k.update(e,a,n),oa.position.copy(Ee);const l=Ee.z>1.5?.9:Math.max(Fe.openAt(Ee.x,Ee.z),O(13,27,Ee.y));Vt.copy(T).lerp(C,O(.25,.8,l)),z.fog.color.copy(Vt),z.background.copy(Vt);const p=Wt.uGust.value;o>Bt&&o<.42?p.set(Da+30-900*(o-Bt),1.15*(1-O(.34,.42,o)),36,0):o>.76?p.set(Ee.z-$(16,34,O(.76,1,o)),1.05*O(.76,.86,o),26,0):p.set(1e4,0,30,0),Gt.uTripU.value=1-O(.06,.17,o)*(.82+.1*Math.sin(a*.4)),Gt.uStrip.value.set(q?Nt:-100,q?O(.64,.66,o):0,0,0),It.im.visible=q&&o>.637,It.im.visible&&It.place(o,a);const f=se.u,w=O(f+.004,f+.03,o),W=3.5*w,N=(o-(f-.03))/.032;bt.uPush.value=N>0&&N<1?Math.max(Math.sin(N*3*qe),0):0,ha.crossVectors(se.ax,se.n0),se.n.copy(se.n0).multiplyScalar(Math.cos(W)).addScaledVector(ha,Math.sin(W)),se.P.copy(se.P0).addScaledVector(se.ax,1.6*w).addScaledVector(se.n,se.r),se.f.crossVectors(se.ax,se.n).multiplyScalar(.9*Math.sin(Math.PI*w)).add(se.ax).normalize(),fa.setM(0,se.P,se.n,se.f,1.7),fa.im.instanceMatrix.needsUpdate=!0,bt.uScatter.value=O(.86,.97,o),Ta.U.uGone.value=O(Ut-.03,Ut-.012,o),Je.updateWind(ua,a),Ze.update(e,a,n,o),$e.update(e,a,n)},dispose(){k.dispose?.()}}}};export{co as default};
