import*as a from"three";import{mergeVertices as Kt}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as J,lerp as se,smoothstep as B,makeRng as wt}from"../kit/core.js";const It=["#1B4FA8","#3FA98C","#15161A","#F1EEE6","#7F93AD","#B58A3A","#FF5A1F"],Ve=-.741,Re=.671,ie=.671,re=.741,Me=130,lt=3,dt=4,Qe=8,De=10,qt=9.81,St=13,bt=30,ht=50,gt=12,xe=`
float ibH13(vec3 p){ p = fract(p*0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y)*p.z); }
float ibH11(float n){ n = fract(n*0.1031); n *= n + 33.33; n *= n + n; return fract(n); }
float ibH12(vec2 p){ vec3 q = fract(vec3(p.xyx)*0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y)*q.z); }
float ibVN(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(mix(ibH13(i), ibH13(i + vec3(1,0,0)), f.x), mix(ibH13(i + vec3(0,1,0)), ibH13(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(ibH13(i + vec3(0,0,1)), ibH13(i + vec3(1,0,1)), f.x), mix(ibH13(i + vec3(0,1,1)), ibH13(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float ibVN2(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(ibH12(i), ibH12(i + vec2(1,0)), f.x), mix(ibH12(i + vec2(0,1)), ibH12(i + vec2(1,1)), f.x), f.y);
}
// billow, 0..1. dm 0: the ridged form the far lobes are built from. dm 1: the cauliflower form of the slot's lobes and
// turrets: a sharp crease where the noise crosses its middle value, and either side of it the surface domes up steeply and rounds over.
float ibBillow(vec3 p, float dm){ float a = abs(2.0*ibVN(p) - 1.0), b = 1.0 - min(a*1.9, 1.0); return mix(1.0 - a, 1.0 - b*b, dm); }
`,Ge=`
uniform vec3 uSunDir; uniform vec3 uSunCol; uniform vec3 uSkyCol; uniform float uNight;
`,Fe=`
uniform vec4 uHaze; uniform vec4 uMist; uniform vec4 uMistCyl; varying vec2 vFog;
vec2 ibFogV(vec3 wp){
  vec3 d = wp - cameraPosition; float dist = length(d), cy = cameraPosition.y;
  // the stretch of the sight line (0..1) below the layer top (two tops averaged, so the bank's upper edge is soft) ...
  // (THE TOP IS LEVEL: every body on one sight line, and the sky behind them (the world's sky veil copies this law for a point 3,000 m off),
  // stand under one top and take one mist. The live version gave the top a slow billow read at the body's own place: a trunk's flank and
  // the sky beside it then stood under tops up to 0.4 of the layer apart, an outline of tone alone; and read anywhere along the sight line,
  // a top that differs from bearing to bearing made the sky's mist flip between bearings for an eye at the top's own height. uMistCyl.w, the
  // billow's time, is no longer read, and setMist no longer writes it)
  float top = uMist.y;
  float ta = top*0.62, tb = top*1.38, dyq = abs(d.y) < 1e-3 ? 1e-3 : d.y;
  float ha = cy < ta ? (d.y > 0.0 ? clamp((ta - cy)/dyq, 0.0, 1.0) : 1.0) : (d.y < 0.0 ? 1.0 - clamp((ta - cy)/dyq, 0.0, 1.0) : 0.0);
  float hb = cy < tb ? (d.y > 0.0 ? clamp((tb - cy)/dyq, 0.0, 1.0) : 1.0) : (d.y < 0.0 ? 1.0 - clamp((tb - cy)/dyq, 0.0, 1.0) : 0.0);
  // ... and inside the surge's cylinder round the vent (uMistCyl: centre x, z, radius)
  vec2 a = cameraPosition.xz - uMistCyl.xy;
  float A = dot(d.xz, d.xz), B = dot(a, d.xz), C = dot(a, a) - uMistCyl.z*uMistCyl.z, disc = B*B - A*C, t0 = 0.0, t1 = 0.0;
  if (A < 1e-6) { t1 = C < 0.0 ? 1.0 : 0.0; }
  else if (disc > 0.0) { float sq = sqrt(disc); t0 = clamp((-B - sq)/A, 0.0, 1.0); t1 = clamp((-B + sq)/A, 0.0, 1.0); }
  // (a camera below a top sees the low stretch first, one above it sees it last)
  float fa = cy < ta ? max(min(t1, ha) - t0, 0.0) : max(t1 - max(t0, 1.0 - ha), 0.0);
  float fb = cy < tb ? max(min(t1, hb) - t0, 0.0) : max(t1 - max(t0, 1.0 - hb), 0.0);
  // (the haze is a layer 2 km deep: only the stretch of the sight line below it counts. Hazed by its whole 8 km, the anvil seen
  // up the slot was two thirds horizon colour, each lobe a pale smooth disc against the darker sky overhead; nothing below 2 km changes)
  float hf = cy < 2000.0 ? (d.y > 0.0 ? clamp((2000.0 - cy)/dyq, 0.0, 1.0) : 1.0) : (d.y < 0.0 ? 1.0 - clamp((2000.0 - cy)/dyq, 0.0, 1.0) : 0.0);
  // (THE BODY'S SIDE IS SOFT, SEEN FROM OUTSIDE: for an eye outside the cylinder the mist thins to nothing over the body's outer 80 m,
  // by how near the sight line passes the vent's axis in plan. With a hard side, a line that just grazed the cylinder took a quarter of
  // the mist within a metre of its edge: on a body that is a soft step, but on open sky, which now takes this same law, it stood as a
  // straight upright edge of tone. An eye inside sees no side: the thinning eases out over the first 30 m the eye stands inside the body)
  float side = smoothstep(0.0, 80.0, uMistCyl.z - sqrt(max(dot(a, a) - B*B/max(A, 1e-6), 0.0))*clamp((length(a) - uMistCyl.z)/30.0 + 1.0, 0.0, 1.0));
  float L = dist*0.5*(fa + fb)*uMist.x*side, hz = dist*hf*uHaze.w;
  return vec2(1.0 - exp(-hz*hz), 1.0 - exp(-L*L));
}
`,Ue="vFog = ibFogV(cameraPosition + transpose(mat3(viewMatrix))*mvPosition.xyz);",et=`uniform vec4 uHaze; uniform vec4 uMist; uniform vec3 uMistCol; varying vec2 vFog;
`,tt="gl_FragColor.rgb = mix(mix(gl_FragColor.rgb, uHaze.rgb, vFog.x), uMistCol, vFog.y);";function zt(e){return e<250?55+20*(e/250):75*Math.max(0,1-Math.pow(Math.min(1,(e-250)/400),1.6))}function ot(e){return e<250?75-5*(e/250):70+100*B(0,1,(e-250)/400)}function ct(e){return 215+Math.max(0,e-650)*.15}function Mt(e,n){const u=Math.max(0,e-300);return n*u*u/(u+200)}function Vt(e,n){const u=Math.atan2(Re,Ve),p={cut:0,s:-1,gate:1,scarI:-1,scarU:0,rr:0};return c.wall=p,c;function c(h,g){p.cut=0,p.s=-1,p.scarI=-1,p.scarU=0;const N=Math.hypot(h,g),S=Math.atan2(g,h);let I=Math.abs(S-u);I>Math.PI&&(I=2*Math.PI-I);const x=Math.cos(S),m=Math.sin(S),A=e.n2(x*1.7+n.o1,m*1.7-n.o1),M=e.n2(x*4.3-n.o2,m*4.3+n.o2),d=se(n.hornH,n.backH,B(.42,2.5,I))*(1+.1*A+.05*M),q=n.rimR*(1+.05*A+.02*M),W=n.baseR*(1+.07*M+.04*e.n2(x*2.6+9,m*2.6));p.rr=q;let i;if(N>=q){const L=J((N-q)/(W-q),0,1.6);i=d*Math.pow(Math.max(0,1-L),1.45)-5*L*L;const V=B(.02,.25,L)*(1-B(.75,1,L)),_=Math.abs(e.n2(S*n.rillF+A*2,N*.004+n.o1));i-=(1-B(0,.32,_))*7.5*V*(d/110),p.cut=(1-B(0,.32,_))*7.5*V*(d/110)}else{const L=(q-N)/n.innerW;i=d*(1-Math.pow(B(0,1,L),.75))-9*B(.55,1.15,L);let V=0;for(let P=0;P<n.scars.length;P++){const R=n.scars[P];let $=Math.abs(S-R.th);$>Math.PI&&($=2*Math.PI-$),V+=R.depth*Math.exp(-($*$)/(R.w*R.w))}i-=V*Math.sin(Math.PI*J(L,0,1))*(d/110);const _=Math.abs(e.n2(S*n.rillF*1.6-4,N*.006));i-=(1-B(0,.3,_))*4*Math.sin(Math.PI*J(L,0,1)),p.cut=(1-B(0,.3,_))*4*Math.sin(Math.PI*J(L,0,1)),p.s=L;for(let P=0,R=0;P<n.scars.length;P++){const $=n.scars[P];let ee=S-$.th;ee-=2*Math.PI*Math.round(ee/(2*Math.PI));const fe=$.depth*Math.exp(-(ee*ee)/($.w*$.w));fe>R&&(R=fe,p.scarI=P,p.scarU=ee/$.w)}}i-=5*Math.exp(-((N-q)*(N-q))/90)*(d/110),i+=(2.2*e.fbm2(h*.03,g*.03,3)+5*(e.ridged2(h*.011+5,g*.011,3)-.45))*B(-2,14,i);const D=h*Ve+g*Re,w=Math.abs(h*ie+g*re),T=n.breachW*.5+Math.max(0,D-150)*.35+14*M,O=w+20*e.fbm2(h*.021+3,g*.021,3),E=se(1,B(T-28,T+55,O)*(.9+.1*B(T+20,T+90,O)),B(-30,40,D));if(i=se(-9,i,E),p.cut*=E,p.gate=E,i>0){const L=B(.7,2.1,i);i=i*se(.4,1,L)+4*L}return i}}async function Rt(e,n,u,p,c,h){const I=u.baseR*1.2,x=15045,m=new Float32Array(x*3),A=new Float32Array(x*3),M=new Float32Array(x*2),d=[];for(let s=0;s<=84;s++){const t=s/84;d.push(se(62,I,.5*t+.5*B(0,1,t)*(.35+.65*t)))}let q=0;for(let s=0;s<=176;s++){const t=s%176/176*Math.PI*2,o=Math.cos(t),f=Math.sin(t);for(let v=0;v<=84;v++,q++){const k=d[v],y=o*k,K=f*k,F=n(y,K),z=1.5,j=n(y+z,K)-F,U=n(y,K+z)-F,H=1/Math.hypot(j,z,U);m[q*3]=y,m[q*3+1]=Math.max(F,-9),m[q*3+2]=K,A[q*3]=-j*H,A[q*3+1]=z*H,A[q*3+2]=-U*H;let X=0;for(let Q=0;Q<p.length;Q++){const Z=p[Q],Y=y-Z.x,ae=K-Z.z;X=Math.max(X,Math.exp(-(Y*Y+ae*ae)/(Z.r*Z.r)))}M[q*2]=X,M[q*2+1]=k<u.rimR?1:0}await e.yield()}const W=new Uint32Array(14784*6);let i=0;for(let s=0;s<176;s++)for(let t=0;t<84;t++){const o=s*85+t,f=o+84+1;W[i++]=o,W[i++]=o+1,W[i++]=f,W[i++]=f,W[i++]=o+1,W[i++]=f+1}const D=new a.BufferGeometry;D.setAttribute("position",new a.BufferAttribute(m,3)),D.setAttribute("normal",new a.BufferAttribute(A,3)),D.setAttribute("aData",new a.BufferAttribute(M,2)),D.setIndex(new a.BufferAttribute(W,1)),D.boundingSphere=new a.Sphere(new a.Vector3(0,40,0),I+40);const w=1408,T=112,O=124,E=244,L=w*T,V=(E-O)/T,_=Math.PI*2/w,P=e.noise,R=s=>{const t=Math.sin(s*127.1+311.7)*43758.5453;return t-Math.floor(t)},$=new Float32Array(L),ee=new Float32Array(L),fe=new Float32Array(L),Le=new Float32Array(L),Ce=new Float32Array(L),ce=new Float32Array(L);for(let s=0,t=0;s<T;s++){const o=O+(s+.5)*V;for(let f=0;f<w;f++,t++){const v=(f+.5)*_,k=Math.cos(v)*o,y=Math.sin(v)*o,K=n.wall;let F=n(k,y)+K.cut;const z=K.s;if(ee[t]=z,fe[t]=K.gate,K.scarI>=0&&z>0&&z<1.2&&F>-2){const j=K.scarI,U=K.scarU,H=B(0,.08,1.15*Math.sqrt(J((z-.06)/.26,0,1))-Math.abs(U)-.1*P.n2(k/7+3*j,y/7))*K.gate;if(H>0){const X=2.5+3*R(j*5+1),Q=B(.6,.82,z)*(1-B(.95,1.12,z));F+=H*(-X*(1-B(.3,.72,z))+.55*X*Q+(.9*P.n2(k/5.5,y/5.5)+.5*P.n2(k/2.4+9,y/2.4))*(.25+.75*B(.35,.8,z))),H>.5&&(Ce[t]=4+6*R(j*5+2)+(R(j*5+3)<.5?-1:1)*(.1+.1*R(j*5+4))*U*u.scars[j].w*o),ce[t]=H*Math.max(.9*B(.62,.8,z)*(1-B(1.02,1.14,z)),.25*B(.25,.6,z))}}$[t]=F,Le[t]=5*P.n2(k/28+11,y/28)+.8*P.n2(k/9-7,y/9+23)}s%3===2&&await e.yield()}const ue=s=>(s%w+w)%w,le=(s,t,o)=>{const f=Math.floor(t),v=J(Math.floor(o),0,T-2),k=t-f,y=J(o-v,0,1),K=ue(f),F=ue(f+1);return se(se(s[v*w+K],s[v*w+F],k),se(s[(v+1)*w+K],s[(v+1)*w+F],k),y)},ke=[],Pe=[],Se=[],Ae=[],Te=[],We=[],C=new Int32Array(L),G=new Int32Array(L),te=Math.round(Math.PI*2*u.rimR/5);for(let s=0;s<te;s++){const t=.05+.45*R(s*3+12)*R(s*3+12);let o=(s+.2+.6*R(s*3+11))/te*w-.5,f=-1;const v=ue(Math.round(o));for(let U=T-2;U>0;U--)if(ee[U*w+v]>=0&&ee[U*w+v]<=t&&ee[(U-1)*w+v]>t){f=U;break}if(f<0||fe[f*w+v]<.6||$[f*w+v]<12)continue;const k=Se.length,y=ke.length;let K=0,F=-1,z=-1,j=0;for(let U=0;U<700;U++){const H=Math.round(f),X=ue(Math.round(o));if(H<2||H>T-3)break;const Q=H*w+X;if($[Q]<5||fe[Q]<.35)break;let Z=-1;for(let de=0;de<5&&Z<0;de++){const ne=H*w+ue(X+(de+1>>1)*(de&1?1:-1));C[ne]&&C[ne]!==k+1&&(Z=ne)}if(ke.push(o),Pe.push(f),Z>=0){z=C[Z]-1,j=G[Z];break}C[Q]=k+1,G[Q]=U;const Y=(O+(f+.5)*V)*_,ae=.35*(le($,o+1,f)-le($,o-1,f))/(2*Y),Ie=.35*(le($,o,f+1)-le($,o,f-1))/(2*V),Je=Math.hypot(ae,Ie);if(Je<.02)break;let Ze=(le(Le,o+1,f)-le(Le,o-1,f))/(2*Y),Oe=(le(Le,o,f+1)-le(Le,o,f-1))/(2*V);const ze=Math.hypot(Ze,Oe),Ne=Math.min(1,.8*Je/Math.max(ze,1e-6)),qe=ae+Ze*Ne,ye=Ie+Oe*Ne,je=Math.hypot(qe,ye);K=.6*K-.4*qe/je,F=.6*F-.4*ye/je;const Ye=Math.hypot(K,F);K/=Ye,F/=Ye,o+=K*.6/Y,f+=F*.6/V}Se.push(y),Ae.push(ke.length-y),Te.push(z),We.push(j),s%40===39&&await e.yield()}const oe=Se.length,he=new Float32Array(oe).fill(1),Ke=[];for(let s=0;s<oe;s++)Ke.push([]);for(let s=oe-1;s>=0;s--)Te[s]>=0&&(he[Te[s]]+=he[s],Ke[Te[s]].push(We[s],he[s]));const me=new Float32Array(L),pe=new Float32Array(L),Ee=new Int32Array(L),we=new Float32Array(L);for(let s=0;s<oe;s++){const t=Se[s],o=Ke[s],f=Te[s]<0,v=7+2.2*Math.sqrt(he[s]);for(let k=0;k<Ae[s];k++){let y=1;for(let ze=0;ze<o.length;ze+=2)y+=o[ze+1]*B(-8,8,k-o[ze]);const K=ke[t+k],F=Pe[t+k],z=Math.round(K),j=J(Math.round(F),0,T-1),U=(O+(F+.5)*V)*_,H=$[j*w+ue(z)],X=B(0,12,k*.6),Q=f?B(v*.45,v,H):1,Z=Math.min(Math.sqrt(y),6.5)*X*Q,Y=Math.min(1.3*Math.cbrt(y),5)*(.5+.5*X),ae=Math.min(Y,1+.25*Math.sqrt(y)),Ie=f&&H<v?.8*(v-H):0,Je=Math.max(Y,Ie),Ze=Math.ceil(Je/U),Oe=Math.ceil(Je/V);for(let ze=-Oe;ze<=Oe;ze++){const Ne=j+ze;if(!(Ne<0||Ne>=T))for(let qe=-Ze;qe<=Ze;qe++){const ye=Ne*w+ue(z+qe),je=(z+qe-K)*U,Ye=(Ne-F)*V,de=je*je+Ye*Ye;if(de<Y*Y){const ne=1-de/(Y*Y);Z*ne*ne>me[ye]&&(me[ye]=Z*ne*ne)}if(de<ae*ae){const ne=(1-de/(ae*ae))*X;ne>pe[ye]&&(pe[ye]=ne,Ee[ye]=s+1)}if(de<Ie*Ie){const ne=1-de/(Ie*Ie);ne>we[ye]&&(we[ye]=ne)}}}}s%6===5&&await e.yield()}for(let s=0;s<2;s++){const t=Ee.slice();for(let o=0;o<L;o++)if(!t[o]){const f=o/w|0,v=o-f*w;Ee[o]=t[f*w+(v+1)%w]||t[f*w+(v+w-1)%w]}}await e.yield();for(let s=0;s<L;s++){const t=we[s]*B(1.5,4,$[s]);$[s]+=1.2*t-me[s]*(1-.7*t),ce[s]=Math.max(ce[s],t)}const be=new Uint16Array(L*4),ge=new Uint8Array(L*4),ve=a.DataUtils.toHalfFloat;for(let s=0;s<T;s++){const t=O+(s+.5)*V,o=t*_,f=Math.max(0,s-1),v=Math.min(T-1,s+1),k=Math.max(2,Math.round(9/o)),y=s*w;let K=0;for(let F=-k;F<=k;F++)K+=$[y+(F+w)%w];for(let F=0;F<w;F++){const z=y+F,j=(F+.5)*_,U=Math.cos(j),H=Math.sin(j),X=($[v*w+F]-$[f*w+F])/((v-f)*V),Q=($[y+(F+1)%w]-$[y+(F+w-1)%w])/(2*o),Z=X*U-Q*H,Y=X*H+Q*U,ae=1/Math.hypot(Z,1,Y);be[z*4]=ve($[z]),be[z*4+1]=ve(-Z*ae),be[z*4+2]=ve(-Y*ae),be[z*4+3]=ve(Ce[z]),ge[z*4]=Math.round(255*J(pe[z],0,1)),ge[z*4+1]=Math.round(255*(Ee[z]*.618034%1)),ge[z*4+2]=Math.round(127.5+127.5*J((K/(2*k+1)-$[z])/3,-1,1)),ge[z*4+3]=Math.round(255*J(ce[z],0,1)),K+=$[y+(F+k+1)%w]-$[y+(F-k+w)%w]}s%8===7&&await e.yield()}const He=2048,Be=8,rt=-64,ut=.14,Xe=new Uint8Array(He*Be*4);{const s=He*4,t=ut/4,o=new Float32Array(s+1),f=new Float32Array(s+1);for(let v=rt-12,k=0,y=0,K=0,F=0;y<s;k++){const z=v+(R(k*7+.5)>.9?3+3.5*R(k*7+1.5):.4+2*R(k*7+1.5)*R(k*7+1.5));K+=(.38+.32*B(76,92,v)*(1-B(108,124,v))+.22*Math.sin(v*.273+1)+.1*Math.sin(v*.69+4))*(z-v);const j=K-F>(z-v)*(.25+.5*R(k*7+2.5));j&&(F+=z-v);const U=j?.55+.45*R(k*7+3.5):.1*R(k*7+3.5),H=.4+.6*R(k*7+4.5);for(;y<s&&rt+(y+.5)*t<z;y++){const X=rt+(y+.5)*t-v;o[y+1]=o[y]+U,f[y+1]=f[y]+(X>=0?H*(1-B(.05,.4,X)):0)}v=z}for(let v=0;v<Be;v++)for(let k=0;k<He;k++){const y=J(k*4+2-(2<<v),0,s),K=J(k*4+2+(2<<v),0,s),F=(v*He+k)*4;Xe[F]=Math.round(255*(o[K]-o[y])/(K-y)),Xe[F+1]=Math.round(255*(f[K]-f[y])/(K-y)),Xe[F+3]=255}}await e.yield();const _e=(s,t,o,f,v)=>{const k=new a.DataTexture(s,o,f,a.RGBAFormat,t);return k.magFilter=k.minFilter=a.LinearFilter,k.wrapS=v,k.wrapT=a.ClampToEdgeWrapping,k.generateMipmaps=!1,k.needsUpdate=!0,k};c.uRelief={value:_e(be,a.HalfFloatType,w,T,a.RepeatWrapping)},c.uRill={value:_e(ge,a.UnsignedByteType,w,T,a.RepeatWrapping)},c.uReliefR={value:new a.Vector2(O,1/(E-O))},c.uBeds={value:_e(Xe,a.UnsignedByteType,He,Be,a.ClampToEdgeWrapping)};const r=new Uint16Array(w*4);for(let s=0;s<w;s++){const t=(s+.5)*_;n(Math.cos(t)*150,Math.sin(t)*150),r[s*4]=ve(n.wall.rr-230)}c.uCrest={value:_e(r,a.HalfFloatType,w,1,a.RepeatWrapping)};const l=new a.ShaderMaterial({fog:!1,side:a.DoubleSide,uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{uAsh:{value:h.ash.clone()},uOchre:{value:h.ochre.clone()},uJade:{value:h.jade.clone()}}]),vertexShader:`
      attribute vec2 aData; varying vec3 vP; varying vec3 vN; varying vec2 vD; varying vec3 vW;
      ${Fe}
      void main(){
        vP = position; vN = normal; vD = aData;
        vec4 wp = modelMatrix*vec4(position, 1.0); vW = wp.xyz;
        vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
        ${Ue}
      }`,fragmentShader:`
      uniform vec3 uAsh, uOchre, uJade; uniform float uTime;
      uniform sampler2D uRelief, uRill, uBeds, uCrest; uniform vec2 uReliefR;
      ${Ge}
      varying vec3 vP; varying vec3 vN; varying vec2 vD; varying vec3 vW;
      ${et}
      ${xe}
      // A TONGUE OF DRY ASH in one gully of the inner wall (chute: the thread down the gully's floor, 1 on its line; num: the gully's
      // own number as a hash). The gully is cut into stretches of 40 m of height that slide down it at 2.2 m of height a second (2.6 m
      // a second along a wall of 59 degrees: a trickle); a hash of the stretch's number and the gully's says whether it carries a tongue (the
      // share that do) and how long a one: a front cut across the thread downhill (ragged by the grain), a tail that thins to a
      // thread uphill, its edge broken by the grain.
      float ibTrickle(float chute, float num, float yb, float g1, float g2, float g3, float share, float thin){
        float ph = (yb + 2.2*uTime)/40.0 + num*37.0 + (g1 - 0.5)*0.1, c = floor(ph), q = ph - c;
        float h = ibH12(vec2(c + 0.5, num*91.7 + 3.0));
        float run = smoothstep(0.0, 0.08, q)*(1.0 - smoothstep(0.15, mix(0.45, 0.98, h/share), q));
        return step(h, share)*run*smoothstep(0.0, 0.25, chute - mix(thin, 0.9, q) + (g2 - 0.5)*0.3)*(0.7 + 0.6*g3);
      }
      void main(){
        vec3 p = vP; float y = p.y;
        float r = length(p.xz), th = atan(p.z, p.x + 1e-4);
        float g1 = ibVN(p*0.23), g2 = ibVN(p*0.9), g3 = ibVN(p*3.3);
        float grain = g1*0.45 + g2*0.35 + g3*0.2;
        // THE CREST LINE PARTS TWO LAWS. kIn is 0 on the height field's crest line and everywhere outside it, and rises to 1 over
        // the first 6 m of ground inside it (uCrest: the crest's distance from the island's middle on this bearing, less 230 m; the
        // quarter metre is more than the map can be out by, so no pixel at or outside the crest has any weight). Where kIn is 0, the
        // whole outer flank with its rills, its cliff and its surf, the colour comes from the OUTER LAW's block and from the lines
        // after the inner wall's blocks, and those are the lines the cone was always drawn by, operation for operation: nothing of
        // the inner wall's law is added, mixed in or multiplied on. The INNER WALL's own terms (w to ft below, two map reads among
        // them) are worked out at every cone pixel and USED only where kIn is over 0, in its blocks; from 0 to 1 the two laws are
        // mixed by kIn, and where kIn is 1 the outer law's block is not run at all.
        float kIn = smoothstep(0.25, 6.0, texture2D(uCrest, vec2(th*0.15915494, 0.5)).r + 230.0 - r);
        float fw = fwidth(y)*1.7;
        float tone = 0.0, lane = 0.0;
        if (kIn < 1.0) {
          // THE OUTER LAW. bedding: broad warped beds plus fine beds that fade with distance
          float warp = (g1 - 0.5)*7.0 + (ibVN(p*0.045) - 0.5)*22.0;
          float bed = ibVN(vec3(p.xz*0.006, (y + warp)*0.21));
          float fine = sin((y + warp*0.6)*1.7 + g2*1.5)*(1.0 - smoothstep(0.25, 1.3, fw));
          tone = clamp(smoothstep(0.34, 0.66, bed) + fine*0.22, 0.0, 1.0);
          // ash avalanches trickling down the ground within the plain 230 m circle (vD.y): where that circle lies outside the
          // crest, and through the first 6 m inside the crest
          // (each trickle wanders down the wall, breaks and fans out: never a ruled line)
          float lth = th + (g1 - 0.5)*0.045 + (ibVN(p*0.06) - 0.5)*0.11;
          lane = smoothstep(0.62, 0.84, ibVN2(vec2(lth*34.0, 2.7 + y*0.012)))*vD.y*smoothstep(4.0, 22.0, y);
          float flow = ibVN2(vec2(lth*120.0, r*0.07 + uTime*1.5))*ibVN2(vec2(lth*30.0, r*0.02 + uTime*0.45));
          lane = lane*smoothstep(0.18, 0.5, flow);
        }
        vec3 brown = vec3(0.105, 0.088, 0.072);
        // THE INNER WALL reads its own relief per pixel from the two maps (see buildCone): the ground's height and normal, its
        // hollows, the gullies' threads, the slumps' slipped bedding, the loose ash. A gully's head is 2.6 m across and the map's
        // cell 0.85 m: as the pixel's footprint on the wall grows from 1.5 m to 3.5 m the relief melts back into the mesh's own
        // (w). The map is read at every cone pixel; it counts only inside the crest (kIn) and within the plain 230 m circle (vD.y);
        // elsewhere the ground is the mesh's.
        float w = kIn*vD.y*(1.0 - smoothstep(1.5, 3.5, max(length(dFdx(p)), length(dFdy(p)))));
        vec2 ruv = vec2(th*0.15915494, (r - uReliefR.x)*uReliefR.y);
        vec4 rl = texture2D(uRelief, ruv);
        float yb = mix(y, rl.r, w);
        // THE BEDS OF THE INNER WALL, AS ASH FALLS LAY THEM. The bedding's height t is the ground's height, plus the DRAPE (the
        // beds mantle the wall: they sag and rise by place, 18 m over 80 m and 7 m over 20 m, and dip outward from the island's
        // middle by 0.2), plus the slip of a slump's block. Every 9 m or so of bedding one band of beds (its own number) PINCHES
        // OUT along stretches of the wall (where its own noise by place says so) and up to 3 m of the stack is missing there,
        // the beds above sagging into the gap up to the next band. The stack itself is the table uBeds (see buildCone): unequal
        // beds, black and brown-grey, read at the row whose averaging matches the bedding a pixel covers (ft).
        float t = yb + 18.0*(ibVN2(p.xz*0.0125) - 0.5) + 7.0*(ibVN2(vec2(p.x*0.8 + p.z*0.6, p.z*0.8 - p.x*0.6)*0.05 + 17.0) - 0.5) + 0.2*(r - 230.0) + rl.a*w + (g2 - 0.5)*0.3;
        float ft = fwidth(t);
        vec3 Nb = vN; float ledge = 0.0, hol = 0.0;
        if (kIn > 0.0) {
          vec4 rk = texture2D(uRill, ruv);
          float deb = rk.a*w; hol = max(rk.b*2.0 - 1.0, 0.0)*w;
          float b0 = floor(t/9.0), tc0 = (b0 + 0.25 + 0.5*ibH11(b0*7.31 + 2.0))*9.0;
          if (t < tc0) { b0 -= 1.0; tc0 = (b0 + 0.25 + 0.5*ibH11(b0*7.31 + 2.0))*9.0; }
          float tc1 = (b0 + 1.25 + 0.5*ibH11((b0 + 1.0)*7.31 + 2.0))*9.0;
          float gap = 3.0*smoothstep(0.5, 0.78, ibVN2(p.xz*0.022 + b0*vec2(13.7, 7.1)));
          float lod = clamp(log2(max(ft, 0.14)/0.14), 0.0, 6.999), l0 = floor(lod), bu = (t + gap*(1.0 - (t - tc0)/(tc1 - tc0)) + 64.0)/286.72;
          vec4 bd = mix(texture2D(uBeds, vec2(bu, (l0 + 0.5)*0.125)), texture2D(uBeds, vec2(bu, (l0 + 1.5)*0.125)), lod - l0);
          // (loose ash and rubble lie on the beds in a gully's fan and on a slump's toe: unbedded, blocks of both ashes 1 to 4 m across)
          tone = mix(tone, mix(bd.r, smoothstep(0.47, 0.67, g1*0.5 + g2*0.5), deb*0.9), kIn);
          brown = mix(brown, vec3(0.106, 0.088, 0.070)*1.52, kIn);
          // THE BEDS STEP SOFTLY: under each bed's foot the face turns down a little (ledge), into less of the sun and less of the
          // sky. The normal is the map's at this pixel, so the gullies and the scars are relief under the day's key.
          ledge = bd.g*(1.0 - deb)*kIn;
          Nb = mix(vN, vec3(rl.g, sqrt(max(1.0 - rl.g*rl.g - rl.b*rl.b, 0.0)), rl.b), w) - vec3(0.0, 0.55*ledge, 0.0);
          // ash avalanches trickling down the inner wall, laid by the wall's own places: each gully's thread is a chute (its number
          // from the map; a third of its stretches carry a tongue)
          lane = mix(lane, ibTrickle(rk.r, rk.g, yb, g1, g2, g3, 0.35, 0.35)*w*smoothstep(2.0, 7.0, yb), kIn);
        }
        vec3 alb = mix(uAsh*1.9 + 0.012, brown, tone)*(0.55 + 0.9*grain);
        // slope: steep faces (rills, scars, cliff) show darker, fresher ash
        vec3 N = normalize(Nb + (vec3(g2, g3, ibVN(p*0.9 + 7.0)) - 0.5)*0.34);
        float steep = 1.0 - smoothstep(0.55, 0.9, vN.y);
        alb *= mix(1.0, 0.62, steep);
        // (inside the crest a hollow, a gully's floor or a scar's foot, is darker by how deep it lies: hol, 0..1, the metres the
        // point lies below the wall's mean 9 m either side, over 3)
        if (kIn > 0.0) alb *= 1.0 - 0.5*hol;
        // sulphur-ochre fumarole patches
        float stain = smoothstep(0.25, 0.75, vD.x + (g2 - 0.5)*0.7 + (g1 - 0.5)*0.5);
        alb = mix(alb, uOchre*(0.14 + 0.2*g3), stain*0.75*smoothstep(0.3, 0.6, g2*0.6 + g1*0.5));
        alb = mix(alb, vec3(0.30, 0.29, 0.24), smoothstep(0.85, 1.05, vD.x + (g3 - 0.5)*0.4)*0.4);
        // the ash avalanches (lane: the outer law's and the inner wall's, worked out above)
        alb = mix(alb, vec3(0.15, 0.14, 0.125), lane*0.5);
        // wet band and waterline
        float wetN = y + (g2 - 0.5)*2.5;
        float wet = 1.0 - smoothstep(1.0, 6.5, wetN);
        alb *= mix(1.0, 0.42, wet);
        float ndl = dot(N, uSunDir);
        float lit = smoothstep(-0.02, 0.3, ndl)*(0.5 + 0.5*clamp(ndl, 0.0, 1.0));
        // the crater bowl shades itself: darker low on the inner wall
        float bowl = mix(1.0, 0.74 + 0.26*smoothstep(0.0, 70.0, y), vD.y);
        vec3 col = alb*(uSunCol*lit*bowl + uSkyCol*(0.26 + 0.2*N.y)*bowl);
        if (kIn > 0.0) col = alb*(uSunCol*lit*bowl + uSkyCol*(0.26 + 0.2*N.y)*bowl*(1.0 - 0.4*ledge));      // (inside the crest the face under a ledge sees less of the sky)
        vec3 V = normalize(cameraPosition - vW);
        float fr = pow(max(1.0 - clamp(dot(N, V), 0.0, 1.0), 0.0), 3.0);
        col += uSkyCol*fr*(0.03 + 0.16*wet);                        // cold sky sheen on wet faces
        // surf: pulsing swash on the platform, contact darkening just above it
        float pulse = 0.7 + 0.6*sin(uTime*0.8 + th*9.0 + g1*5.0);
        float swash = (1.0 - smoothstep(0.1, 0.9 + pulse, y))*smoothstep(-1.6, 0.2, y);
        float lace = smoothstep(0.35, 0.7, ibVN2(vec2(th*r*0.16, r*0.33 - uTime*0.7 + g1*3.0)) + swash*0.35 - 0.2);
        col = mix(col, (uSunCol*(0.35 + 0.4*lit) + uSkyCol*0.3)*0.74, swash*lace);
        col = mix(col, uJade*0.25*(uSunCol*0.5 + uSkyCol*0.5), (1.0 - smoothstep(-3.5, -0.4, y))*0.9);
        col = max(col, vec3(0.0055, 0.006, 0.0075)*(1.0 - uNight*0.6));
        gl_FragColor = vec4(col, 1.0);
        ${tt}
      }`});l.uniforms.uTime=c.uTime,l.uniforms.uSunDir=c.uSunDir,l.uniforms.uSunCol=c.uSunCol,l.uniforms.uSkyCol=c.uSkyCol,l.uniforms.uNight=c.uNight,l.uniforms.uRelief=c.uRelief,l.uniforms.uRill=c.uRill,l.uniforms.uReliefR=c.uReliefR,l.uniforms.uBeds=c.uBeds,l.uniforms.uCrest=c.uCrest;const b=new a.Mesh(D,l);return b.name="cone",b}async function at(e,n){const u=new a.IcosahedronGeometry(1,n),p=u.attributes.position.array,c=p.length/3;await e.yield();const h=new Map,g=[],N=new Uint32Array(c);for(let S=0;S<c;S++){S%1500===1499&&await e.yield();const I=p[S*3],x=p[S*3+1],m=p[S*3+2],A=(Math.round(I*4096)+4100)*6724e4+(Math.round(x*4096)+4100)*8200+Math.round(m*4096)+4100;let M=h.get(A);M===void 0&&(M=g.length/3,h.set(A,M),g.push(I,x,m)),N[S]=M}return u.dispose(),{pos:new Float32Array(g),idx:N,nv:g.length/3}}function Dt(e,n){return{pos:new Float32Array(e*3),cen:new Float32Array(e*3),lobe:new Float32Array(e*4),out:new Float32Array(e*3),tone:new Float32Array(e*3),kid:new Float32Array(e*4),idx:new Uint32Array(n),nv:0,ni:0}}function Ct(e,n){const u=new Int32Array(e.nv).fill(-1),p=[],c=[];for(let h=0;h<e.idx.length;h+=3){const g=e.idx[h],N=e.idx[h+1],S=e.idx[h+2];if(!(e.pos[g*3+1]+e.pos[N*3+1]+e.pos[S*3+1]<n*3))for(let I=0;I<3;I++){const x=e.idx[h+I];u[x]<0&&(u[x]=p.length/3,p.push(e.pos[x*3],e.pos[x*3+1],e.pos[x*3+2])),c.push(u[x])}}return{pos:new Float32Array(p),idx:new Uint32Array(c),nv:p.length/3}}function yt(e,n,u,p,c){const h=e.nv++;return e.pos[h*3]=n,e.pos[h*3+1]=u,e.pos[h*3+2]=p,e.cen[h*3]=c.x,e.cen[h*3+1]=c.y,e.cen[h*3+2]=c.z,e.lobe[h*4]=c.r,e.lobe[h*4+1]=c.phase,e.lobe[h*4+2]=c.rate,e.lobe[h*4+3]=c.seed,e.out[h*3]=c.ox,e.out[h*3+1]=c.oy,e.out[h*3+2]=c.oz,e.tone[h*3]=c.tone,e.tone[h*3+1]=c.mode,e.tone[h*3+2]=c.occ,e.kid[h*4]=c.kx||0,e.kid[h*4+1]=c.ky||0,e.kid[h*4+2]=c.kz||0,e.kid[h*4+3]=c.kw||1,h}function Et(e,n,u){const p=e.nv,c=u.axis;if(c){let h=c[2],g=0,N=-c[0],S=Math.hypot(h,N);S<.001&&(h=1,N=0,S=1),h/=S,N/=S;const I=g*c[2]-N*c[1],x=N*c[0]-h*c[2],m=h*c[1]-g*c[0];for(let A=0;A<n.nv;A++){const M=n.pos[A*3],d=n.pos[A*3+1],q=n.pos[A*3+2];yt(e,h*M+c[0]*d+I*q,g*M+c[1]*d+x*q,N*M+c[2]*d+m*q,u)}}else for(let h=0;h<n.nv;h++)yt(e,n.pos[h*3],n.pos[h*3+1],n.pos[h*3+2],u);for(let h=0;h<n.idx.length;h++)e.idx[e.ni++]=p+n.idx[h]}function xt(e,n,u,p,c,h,g,N,S){const I=e.nv,x={phase:.5,rate:0,mode:0,occ:.55,ox:0,oy:1,oz:0};for(let m=0;m<=p;m++){const A=se(n,u,m/p),M=h(A);x.x=M[0],x.y=A,x.z=M[1],x.r=g(A),x.seed=A*.0045,x.tone=se(N,S,B(380,700,A));for(let d=0;d<=c;d++){const q=d%c/c*Math.PI*2;yt(e,Math.cos(q),0,Math.sin(q),x)}}for(let m=0;m<p;m++)for(let A=0;A<c;A++){const M=I+m*(c+1)+A,d=M+c+1;e.idx[e.ni++]=M,e.idx[e.ni++]=d,e.idx[e.ni++]=M+1,e.idx[e.ni++]=M+1,e.idx[e.ni++]=d,e.idx[e.ni++]=d+1}}function ft(e,n,u,p,c,h){const g=new a.BufferGeometry;return g.setAttribute("position",new a.BufferAttribute(e.pos.subarray(0,e.nv*3),3)),g.setAttribute("aCenter",new a.BufferAttribute(e.cen.subarray(0,e.nv*3),3)),g.setAttribute("aLobe",new a.BufferAttribute(e.lobe.subarray(0,e.nv*4),4)),g.setAttribute("aOut",new a.BufferAttribute(e.out.subarray(0,e.nv*3),3)),g.setAttribute("aTone",new a.BufferAttribute(e.tone.subarray(0,e.nv*3),3)),h&&g.setAttribute("aKid",new a.BufferAttribute(e.kid.subarray(0,e.nv*4),4)),g.setIndex(new a.BufferAttribute(e.idx.subarray(0,e.ni),1)),g.boundingSphere=new a.Sphere(new a.Vector3(n,u,p),c),g}const Ht=`
  uniform vec3 uSteam, uShadow, uAsh, uFlashCol, uSurgeCol; uniform vec3 uFlashPos[2]; uniform float uFlashI[2]; uniform float uTime;
  ${Ge}
  varying vec3 vLp; varying vec3 vN; varying vec3 vW; varying vec4 vT;   // vT: tone, occlusion, 1/cell size, kind (1 turret, -1 root burst, 0 lobe)
  ${et}
  ${xe}
  vec3 ibH33(vec3 p){ p = fract(p*vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yxz + 33.33); return fract((p.xxy + p.yxx)*p.zyx); }
  // cellular turrets: xyz = offset from the nearest cell centre (a ready-made dome normal), w = distance to the crease
  vec4 ibCell(vec3 p, out vec3 rn){      // rn: from p to the nearest cell's centre
    vec3 i = floor(p), f = fract(p), acc = vec3(0.0); float d1 = 9.0, d2 = 9.0, ws = 0.0; rn = vec3(0.0);
    for (int z = -1; z <= 1; z++) for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
      vec3 g = vec3(float(x), float(y), float(z)); vec3 r = g + ibH33(i + g) - f; float d = dot(r, r);
      float w = exp(-11.0*d); acc += w*r; ws += w;          // smooth blend: round domes, soft valleys, no facets
      if (d < d1) { d2 = d1; d1 = d; rn = r; } else if (d < d2) { d2 = d; }
    }
    return vec4(-acc/max(ws, 1e-6), sqrt(d2) - sqrt(d1));
  }
  void main(){
    vec3 q = vLp*vT.z;
    // (the footprint leans to the geometric mean of the two screen directions, so a face seen at a grazing angle keeps its
    // turrets, with 45% of the larger one mixed in, so a face seen nearly edge-on fades to smooth before it can streak)
    float fqa = length(dFdx(q)), fqb = length(dFdy(q));
    float fq = 2.4*mix(sqrt(fqa*fqb), max(fqa, fqb), 0.45);      // (partly the larger one: on a face seen edge-on the cells melt away before they can smear into bands)
    float o1 = 1.0 - smoothstep(0.45, 1.3, fq), o2 = 1.0 - smoothstep(0.16, 0.5, fq), o3 = 1.0 - smoothstep(0.05, 0.17, fq);
    // the lookups are bent by a slow warp, so the creases between turrets wander instead of ruling a honeycomb
    vec3 qw = q + 0.3*sin(q.yzx*1.7 + 1.3) + 0.15*sin(q.zxy*3.9 + 4.1);
    vec3 rn1, rnx;
    vec4 c1 = ibCell(qw + vec3(0.0, -uTime*0.03, 0.0), rn1);
    #ifdef IB_OCT2
    vec4 c2 = ibCell(qw*2.7 + 7.3 + 0.35*sin(q.zxy*5.3), rnx);
    vec4 c3 = vec4(0.0, 0.0, 0.0, 0.5);
    if (o3 > 0.01) c3 = ibCell(qw*6.9 + 3.1 + 0.3*sin(q.yzx*13.0), rnx);      // the third octave only exists at the closest pass
    #else
    vec4 c2 = vec4(0.0, 0.0, 0.0, 0.5), c3 = vec4(0.0, 0.0, 0.0, 0.5);
    #endif
    vec3 Ng = normalize(vN);
    float burst = step(vT.w, -0.5);
    // FORM (the slot's lobes and their turrets, within 190 to 340 m: the climb, not the breach): where the light is frontal (the walls seen up the slot with the sun behind the eye,
    // the sunlit wall seen square on, the moonlit wall) a turret has no terminator, so its crevices carry it: the seam round
    // every cell goes to the shadow colour, and the cap stays the brightest thing on it
    // (the range grows with height, 0.7 m for every metre above 200 m: the roof over the portal, 650 m up, is a crowd of turrets from the
    // whole climb, by day and by moon, while from the sea, which is always further from a lobe than that, nothing changes)
    float hiK = 0.7*clamp(vW.y - 200.0, 0.0, 600.0);      // (no more above 800 m)
    float formK = smoothstep(0.2, 0.5, vT.w)*(1.0 - smoothstep(190.0 + hiK, 340.0 + hiK, distance(vW, cameraPosition)));
    // every cell is a dome: lit cap, crescent of shade in its lee. On steam in the form range the dome is the nearest cell's
    // own (a round cap: its normal leans away from that cell's centre in step with the distance from it, as a ball's does, and comes
    // upright again in the last tenth before the seam, inside the seam's shade), and the finer crinkles are halved. A flat cap
    // folded steeply at straight seams was crumpled foil at close range; the blended normal alone, upright over half of every
    // cell, was crumpled glass
    float sK = formK*(1.0 - clamp(vT.x, 0.0, 1.0));
    // EVERY LOBE THAT IS NOT ONE OF THE VERY FINE ONES, on the climb (kind 0.75, see CLOUD_VERT): their own cells are 25 to 95 m, a broad
    // smooth face beside the camera or behind the fine lobes. On them the second octave (cells of 10 to 18 m) is promoted from a crinkle to the turrets: full seams,
    // a steeper dome, shaded flanks. It is an amplitude, not a size: it fades in with the form range and nothing swims.
    float pK = formK*smoothstep(0.55, 0.72, vT.w)*step(vT.w, 0.9);
    vec3 n0 = Ng + mix(c1.xyz*1.6, rn1*(-(0.8 + 1.3*length(rn1))*smoothstep(0.0, 0.1, c1.w)), sK)*o1 + c2.xyz*(mix(1.35*(1.0 - 0.75*sK), 2.0, pK*(1.0 - 0.5*sK))*o2) + c3.xyz*(0.65*o3*(1.0 - 0.9*sK));
    vec3 N = n0/max(length(n0), 1e-4);
    float dome = clamp(1.0 - 2.2*dot(c1.xyz, c1.xyz), 0.0, 1.0);
    float cr1 = mix(1.0, smoothstep(-0.05, mix(0.5, 0.38, formK), c1.w), o1);
    // (steam at close range: the two finer octaves of creases are a web of thin dark cracks on a white face, crumpled cellophane.
    // There they only tint: the form is the first octave's domes, with wide soft seams)
    float crease = cr1*mix(1.0, smoothstep(-0.1, 0.5, c2.w), 0.8*o2*(1.0 - 0.7*sK))*mix(1.0, smoothstep(-0.1, 0.45, c3.w), 0.7*o3*(1.0 - 0.85*sK));
    float creaseF = cr1*mix(1.0, smoothstep(-0.1, 0.5, c2.w), mix(0.4, 1.0, pK)*o2);      // the seams at a turret's own scale (the finest crinkles only shade)
    float seamF = mix(1.0, smoothstep(-0.05, 0.62, c1.w), o1)*mix(1.0, smoothstep(-0.05, 0.6, c2.w), mix(0.12, 0.8, pK)*o2);      // on steam the seams are broad and soft: a blue-grey valley round every dome
    float occ = (0.35 + 0.65*crease)*mix(1.0, 0.6 + 0.4*dome, o1)*smoothstep(-0.05, 0.5, vT.y);
    float ndl = dot(N, uSunDir), ndg = dot(Ng, uSunDir);
    vec3 V = normalize(cameraPosition - vW);
    float rim = pow(max(1.0 - clamp(dot(N, V), 0.0, 1.0), 0.0), 2.5);
    float fl = 0.0;
    for (int i = 0; i < 2; i++) { vec3 d = vW - uFlashPos[i]; fl += uFlashI[i]/(1.0 + dot(d, d)/3800.0); }      // (a flash lights the turrets round its bolt, not the whole trunk)
    #ifdef IB_SURGE
    // the base surge is dust, not steam: pale warm grey, a wide soft terminator, a lit crest and a dark foot
    float hgt = clamp(vW.y/34.0, 0.0, 1.0);
    float soft = smoothstep(-0.45, 0.5, ndg*0.45 + ndl*0.55);
    occ = mix(1.0, occ, 0.7);
    vec3 alb = uSurgeCol*(0.56 + 0.66*hgt)*(0.72 + 0.28*occ);
    vec3 col = alb*(uSunCol*soft*(0.7 + 0.3*occ)*1.15 + uSkyCol*(0.62 + 0.3*N.y)*(0.5 + 0.5*occ));
    col *= mix(0.5, 1.0, smoothstep(0.5, 11.0, vW.y));
    col += uFlashCol*fl*(0.08 + 0.3*(1.0 - occ));
    #else
    // a crisp terminator on the lobe with a narrow penumbra, crescent shadows in each turret's lee
    // (steam at close range, with the sun behind the eye and the walls seen from below: the light grazes every face, and a crisp
    // terminator there is a patchwork of hard-edged flakes. Its penumbra is three times wider: each dome shades over, lit top to blue-grey flank)
    float lit = smoothstep(mix(-0.1, -0.24, sK), mix(0.2, 0.42, sK), ndg*0.5 + ndl*0.5)*smoothstep(mix(-0.3, -0.4, sK), mix(0.16, 0.4, sK), ndl)*mix(0.6 + 0.4*clamp(ndl, 0.0, 1.0), 0.36 + 0.64*clamp(ndl, 0.0, 1.0), uNight);      // (a turret's cap is brighter than its flank: form on the sunlit wall)
    lit *= mix(0.64, 0.8, uNight) + mix(0.36, 0.2, uNight)*crease;      // (by moonlight the crescents are softer: with so little fill they would be black blotches)
    lit *= 1.0 - formK*mix(mix(0.62, 0.72, clamp(vT.x, 0.0, 1.0)), 0.6, uNight)*(1.0 - mix(seamF, creaseF, clamp(vT.x, 0.0, 1.0))*(0.4 + 0.6*smoothstep(-0.05, 0.5, vT.y)));      // (the seams between turrets, and the seam round a turret's foot, are in shade whatever the sun's angle)
    // (steam, front-lit: every turret is a bright cap that falls away to blue-grey flanks, so the face is matte and round, not glassy)
    lit *= 1.0 - formK*(1.0 - clamp(vT.x, 0.0, 1.0))*mix(0.4, 0.3, uNight)*(1.0 - smoothstep(0.0, 0.8, c1.w))*o1;      // (the flank falls away over most of the dome: broad shading, a lit top)
    lit *= 1.0 - pK*(1.0 - clamp(vT.x, 0.0, 1.0))*0.18*(1.0 - smoothstep(0.0, 0.7, c2.w))*o2;
    // (and the crown of every steam turret the sun reaches is the brightest thing on its face: cream caps over blue-grey seams)
    lit = mix(lit, 1.0, 0.5*formK*(1.0 - clamp(vT.x, 0.0, 1.0))*dome*seamF*smoothstep(0.0, 0.35, ndl)*smoothstep(0.1, 0.5, vT.y));
    // light thrown back up from the sunlit turrets and sea below: the shadowed undersides keep their form
    float bn = max(dot(N, normalize(vec3(uSunDir.x, -0.45, uSunDir.z))), 0.0); bn *= bn;
    float tone = clamp(vT.x, 0.0, 1.0);
    // (a core, kind -0.25, is the bottom of the crevices between the lobes: no sun or moon reaches it. Lit like a lobe, the stretch
    // of it that shows through a gap beside the portal was a broad pale face by moonlight)
    lit *= 1.0 - step(vT.w, -0.1)*(1.0 - burst);
    // THE ANVIL'S UNDERSIDE (the column above 3 km): a shelf 6 km up and a kilometre thick is lit on its top and its flanks; the
    // faces that look down are in its own shade. Lit like any lobe they were, seen from the slot (whose line of sight runs
    // downwind under the braid), a bunch of bare pale balls hanging in the sky under the portal, solid pale blue by moonlight.
    float under = smoothstep(3000.0, 4200.0, vW.y)*(1.0 - smoothstep(-0.35, 0.45, N.y));
    lit *= 1.0 - under; bn *= 1.0 - under;      // (nor does the light thrown back by the sunlit turrets of the trunks reach it)
    // steam: lit white (albedo <= 0.78), blue-grey shadow with a little warm bounce off the lit turrets beside it.
    // ash: near-black with form, brown-grey rims, blue-black shadow
    vec3 steamLit = uSteam*0.985*uSunCol*(mix(0.62, 0.56, formK) + mix(0.38, 0.44, formK)*occ);
    float skyL = dot(uSkyCol, vec3(0.3, 0.5, 0.2));
    vec3 shC = mix(uShadow, vec3(dot(uShadow, vec3(0.3, 0.5, 0.2))), 0.3)*(skyL*1.9)*mix(uSkyCol/max(skyL, 1e-3), vec3(1.0), 0.5);
    float shF = mix(0.34 + 0.12*uNight, 0.3, formK);
    vec3 steamSh = shC*(shF + (1.0 - shF)*occ)*(0.72 + 0.28*N.y) + uSteam*uSunCol*(0.075*smoothstep(-0.7, 0.0, ndg)*(0.4 + 0.6*occ))
      + mix(uSteam, uShadow, 0.4)*uSunCol*(mix(0.27, 0.58, formK)*bn*(0.2 + 0.8*occ))      // (beside the climb the faces that look down are full in the light the sunlit steam and sea throw back up: pearl, not slate)
      + uSteam*uSunCol*(0.17*uNight*(0.45 + 0.55*occ)*(1.0 - 0.8*under));      // by moonlight the shade is filled by the moonlit steam all round: grey-blue, never black blotches
    // (charcoal, not brown rock: only thin brown-grey rims, the sun's warmth half taken out of its lit faces, and the light the
    // white wall throws back across the slot is cool)
    float capK = formK*dome*creaseF;      // the crown of a turret
    vec3 ashAlb = mix(uAsh*3.0 + 0.026, vec3(0.118, 0.11, 0.104), clamp(rim*0.35 + dome*0.16 - 0.05 + capK*0.28, 0.0, 1.0));
    float sunL = dot(uSunCol, vec3(0.3, 0.5, 0.2));
    vec3 ashSun = mix(uSunCol, vec3(sunL), 0.5);
    vec3 ashLit = ashAlb*ashSun*(mix(0.4, 0.22, formK) + mix(0.6, 0.78, formK)*occ)*mix(1.3, 1.4, formK) + uSkyCol*vec3(0.8, 0.93, 1.2)*(0.03*capK*max(N.y, 0.0));      // (charcoal caps with a cold sheen of sky, blue-black seams)
    vec3 ashSh = (ashAlb*0.4 + vec3(0.002, 0.004, 0.009))*(0.22 + 0.78*occ)*uSkyCol*1.9*(0.74 + 0.26*N.y) + uSkyCol*vec3(0.85, 0.96, 1.15)*rim*(0.026 + 0.07*occ)
      + vec3(0.034, 0.034, 0.038)*sunL*(bn*occ);
    float wb = max(dot(N, vec3(${(-ie*.97).toFixed(4)}, -0.22, ${(-re*.97).toFixed(4)})), 0.0);      // toward the white trunk across the slot: its sunlit steam throws light back
    float wbw = clamp(wb*wb*0.9 + 0.22*smoothstep(-0.5, 0.3, dot(N, vec3(${(-ie).toFixed(4)}, 0.0, ${(-re).toFixed(4)}))), 0.0, 1.0);      // (each turret has a side that faces the white wall and a side that does not: that is the black wall's relief)
    ashSh += ashAlb*mix(uSunCol, uSkyCol, 0.6)*vec3(0.9, 0.97, 1.08)*(2.3*wbw*(mix(0.2, 0.06, formK) + mix(0.8, 0.94, formK)*occ));
    ashSh += uSkyCol*vec3(0.8, 0.93, 1.2)*(0.022*capK*max(N.y, 0.0));
    // the vent's own dull glow on the undersides of the lowest black lobes (bombs leave it incandescent), gone by 300 m up
    ashSh += vec3(1.0, 0.36, 0.1)*(0.02*(1.0 - smoothstep(-0.7, 0.15, N.y))*exp(-max(vW.y, 0.0)/170.0)*(0.4 + 0.6*occ));
    vec3 col = mix(mix(steamSh, steamLit, lit), mix(ashSh, ashLit, lit), tone);
    // THE ANVIL (above 3 km) has no mesh for turrets: its cells (0.4 of a lobe's radius) carry them in tone, a paler crown on every
    // cell and a deep seam round it, so that from 6 km below, by day and by moonlight, the shelf is a crowd of billows continuous
    // with the column, not a bunch of smooth balls
    float anv = smoothstep(3000.0, 4200.0, vW.y)*o1;
    col *= mix(1.0, (0.42 + 0.78*smoothstep(-0.02, 0.5, c1.w))*(0.8 + 0.3*dome), anv);
    // lightning inside: strongest in the crevices, falling off with distance
    // (in the form range the flash follows the turrets: their caps take it and their seams stay dark. Poured into the crevices
    // as it is from afar, it flattened a black lobe beside the climb to one violet sheet for the length of a flash)
    col += uFlashCol*fl*(mix(0.10, 0.26*mix(seamF, creaseF, tone), formK) + 0.5*(1.0 - occ)*(1.0 - 0.75*formK) + 0.25*rim)*mix(1.0, 0.3, tone)*mix(1.0, 0.25, burst);
    #endif
    gl_FragColor = vec4(col, 1.0);
    ${tt}
  }`,At=`
  attribute vec3 aCenter; attribute vec4 aLobe; attribute vec3 aOut; attribute vec3 aTone;
  uniform float uTime, uClock; uniform vec4 uSurge;      // uSurge: ring radius, strength, K.x, K.z
  varying vec3 vLp; varying vec3 vN; varying vec3 vW; varying vec4 vT;
  ${Fe}
  ${xe}
  // the boiling surface: radius factor of a lobe in direction dir (x), and its three billow octaves (yzw)
  vec4 ibDisp(vec3 dir, vec3 sd, float tf, float w2, float w3, float dm){
    float n1 = ibBillow(dir*1.25 + sd + vec3(0.0, -tf*0.11, 0.0), dm);
    float n2 = ibBillow(dir*2.9 - sd + vec3(0.0, -tf*0.17, 0.0), dm);
    float n3 = ibBillow(dir*6.1 + sd.zxy + vec3(0.0, -tf*0.2, 0.0), dm);     // turrets within turrets
    return vec4(0.66 + 0.42*n1 + w2*n2 + w3*n3, n1, n2, n3);
  }
`,Tt=`
    vec3 dir = position;
    vec3 sd = vec3(aLobe.w*17.0, aLobe.w*5.3, aLobe.w*-9.1);
    float tf = uTime*flowK;
    vec4 D0 = ibDisp(dir, sd, tf, w2, w3, domeK);
    float d = D0.x, n1 = D0.y, n2 = D0.z, n3 = D0.w;
    // (a core tube keeps to 0.66 to 0.8 of its radius: swelling to 1.23 like a lobe it stood proud of its own trunk's lobes, and
    // beside the climb it was a broad smooth face 20 segments round, in front of the turrets that should wall the way to the portal)
    d = mix(d, 0.66 + (d - 0.66)*0.25, tubeK);
    // the true normal of the boiling surface, from two neighbours on the sphere: the mesh's own turrets take
    // light and shade and move their terminators as they roll (a bare sphere normal shades a lobe like plaster)
    vec3 ref = abs(dir.y) > 0.85 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
    vec3 t1 = normalize(cross(ref, dir)), t2 = cross(dir, t1);
    vec3 da = normalize(dir + t1*0.07), db = normalize(dir + t2*0.07);
    // (only the octaves this lobe's mesh can carry go into the normal: wn = their weights; a coarse lobe shades by its big billows alone)
    float dn = 0.66 + 0.42*n1 + wn.x*n2 + wn.y*n3;
    vec3 pa = da*ibDisp(da, sd, tf, wn.x, wn.y, domeK).x - dir*dn, pb = db*ibDisp(db, sd, tf, wn.x, wn.y, domeK).x - dir*dn;
    vec3 nd = cross(pa, pb); nd = nd/max(length(nd), 1e-5);
    vec3 nm = mix(dir, nd, nrmK); nm = nm/max(length(nm), 1e-4);
    vec3 lp = c + dir*(r*sc*d);
    vLp = mix(mat3(modelMatrix)*(dir*(r*d)) + sd*3.1 + drift, mat3(modelMatrix)*lp, tubeK);
    vN = normalize(mat3(modelMatrix)*nm);
    float cell = min(max(r*cellK, cellMin), cellMax);
    cell = mix(cell, 34.0, tubeK);      // (a core's cells are the size of the lobes' own turrets: where it shows it is the shaded bottom of a crowd of them, not one face)
    // (a big lobe's triangles are too coarse to carry the fine octaves of the occlusion: they would show as dark polygons)
    float occHi = 1.0 - smoothstep(34.0, 60.0, r);
    vT = vec4(tone, ((n1*0.62 + mix(0.5, n2, occHi)*0.26 + mix(0.5, n3, occHi)*0.12)*aTone.z - (1.0 - sc)*0.3)*seat, 2.1/cell, kind);
    vec4 wp = modelMatrix*vec4(lp, 1.0); vW = wp.xyz;
    vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
    ${Ue}
  }`,Ot=At+`
  uniform float uNearK;       // 0..1: how far the fine lobes' extra relief and the climb-only turrets have grown out (see setNearGrow)
  attribute vec4 aKid;        // a turret on a lobe: xyz = its seat (offset from the parent's centre, in parent radii), w = its radius / the parent's (1 = not a turret)
  void main(){
    float R = aLobe.x, tone = aTone.x, mode = aTone.y, flowK = 1.0;
    float kid = step(aKid.w, 0.99), slotK = step(0.2, mode)*step(mode, 0.5), fineK = step(0.35, mode)*step(mode, 0.5);
    float domeK = max(slotK, kid), nrmK = mix(0.22, mix(0.8, 0.5, kid), domeK);
    float xK = step(0.43, mode)*step(mode, 0.5), cellMax = mix(95.0, 19.0, xK);      // (on the very fine lobes a cell is a 12 to 19 m turret however big the lobe: a 100 m roof lobe is not five 45 m faces)
    // (the anvil's lobes, 400 m and more across and only ever seen from 8 km below, up the slot: with 95 m cells, under a pixel there,
    // they were pale smooth balls under the portal; their cells are 0.4 of their radius, a dozen billows across each, above 3 km)
    cellMax = max(cellMax, R*0.4*smoothstep(3000.0, 4200.0, aCenter.y));
    float cellMin = mode > 0.5 ? 24.0 : max(13.0*kid, 12.0*xK), cellK = mix(mix(1.0, mix(0.68, 0.56, fineK), slotK), 0.5, xK);      // (finer cells on the finest lobes: a face beside the climb is many turrets)
    float w2 = mix(0.10, mix(0.15, 0.17, xK), max(fineK, kid)), w3 = mix(mix(0.05, 0.085, xK), 0.02, kid);
    w3 *= mix(1.0, 1.0 - smoothstep(36.0, 62.0, R), fineK*(1.0 - kid));      // (a 100 m lobe's triangles are too big for the third octave: it would show as facets)
    // (a fine lobe starts with its coarse twin's relief and grows its own; a climb-only turret, mode 0.05, grows out of its lobe)
    float nk = mix(1.0, uNearK, fineK*(1.0 - kid)), growK = mix(1.0, uNearK, step(0.03, mode)*step(mode, 0.1));
    w2 = mix(0.10, w2, nk); w3 = mix(0.05, w3, nk);
    vec2 wn = vec2(w2*slotK, w3*fineK*nk);
    float live = step(1e-5, aLobe.z)*step(mode, 0.5);
    float tubeK = (1.0 - step(1e-5, aLobe.z))*step(mode, 0.1);
    float p = fract(aLobe.y + uTime*aLobe.z);
    float env = mix(1.0, smoothstep(0.0, 0.3, p)*(1.0 - smoothstep(0.72, 1.0, p)), live);
    // (a lobe is born from nothing and sinks to nothing, deep inside its trunk: at 0.42 of its size, the least it used to be,
    // a newborn lobe seen through a gap where the trunks braid was a bare pale ball hanging in the top of the slot)
    float sc = mix(0.42, 1.0, env)*mix(smoothstep(0.0, 0.25, env), 1.0, step(780.0, aCenter.y));      // (the column's great lobes, above the braid, keep to 0.42: they are too few to come and go)
    // a turret swells and sinks on its own beat while it rides its lobe
    // (and grows with it: on a lobe that is still small a full-size turret was as big as the lobe, a bare ball in the wall)
    float r = R*aKid.w*growK*(1.0 + kid*0.13*sin(uTime*(0.5 + 0.5*fract(aLobe.w*7.7)) + aLobe.w*50.0))*mix(1.0, smoothstep(0.42, 0.7, sc), kid);
    // A turret's seat. Most are fixed (aKid.xyz = offset in lobe radii, under 0.9). A TURRET OF THE VIEWS (|aKid.xyz| >= 1: its
    // direction, times 1 + its lobe's seed) is seated on its lobe's boiling surface as it is at this moment: the lobe's own
    // radius in that direction is worked out here, and the turret stands a third sunk in it, so it is always a dome proud of
    // the face with a dark seam round its foot, and it heaves as the boil passes under it.
    float kl = length(aKid.xyz), seatC = kid*step(0.99, kl), deepK = step(1.995, kl);      // (|aKid.xyz| >= 2: seated deeper, a low dome: the walls and the roof seen from below, where a proud turret alone on a face is a wart)
    vec3 kd = aKid.xyz/max(kl, 1e-4);
    // (a lobe is born 0.6 radii inside its trunk and wells out as it swells: born nearer the surface, the small lobes at the
    // far end of the slot hung in its top as pale balls under the portal)
    vec3 c = aCenter + live*(vec3(0.0, (p - 0.5)*R*1.6, 0.0) + aOut*(((env - 0.55)*0.45 - 0.35*(1.0 - env)*(1.0 - env))*R)) + aKid.xyz*(R*sc*(1.0 - seatC));
    if (seatC > 0.5) {
      float ps = kl - 1.0 - deepK, f3 = 1.0 - smoothstep(36.0, 62.0, R);
      float pd = ibDisp(kd, vec3(ps*17.0, ps*5.3, ps*-9.1), uTime, mix(0.10, 0.17, uNearK), mix(0.05, 0.085*f3, uNearK), 1.0).x;      // (its lobe is one of the very fine ones: the same weights as below)
      c += kd*(sc*(R*pd - mix(0.35, 0.6, deepK)*r));
    }
    // far off, the lobes shade as before (a turret keeps its own form out to 500 m: at 300 m it showed as a bare ball)
    // (both ranges grow with height like the fragment shader's form range: see hiK there)
    vec3 cwn = (modelMatrix*vec4(c, 1.0)).xyz; float hiV = 0.7*clamp(cwn.y - 200.0, 0.0, 600.0);
    nrmK = mix(0.22, nrmK, 1.0 - smoothstep(mix(140.0, 300.0, kid) + hiV, mix(300.0, 520.0, kid) + hiV, distance(cwn, cameraPosition)));
    float seat = mix(1.0, mix(smoothstep(-0.6, 0.25, dot(position, kd)), smoothstep(mix(0.05, 0.3, deepK), mix(0.7, 0.9, deepK), dot(position, kd)), seatC), kid);      // dark where a turret meets its lobe
    float kind = mode > 0.5 ? -1.0 : max(kid, mix(0.5*slotK, 0.75, uNearK*(1.0 - xK)));      // (1 turret, 0.5 a lobe that walls the slot, 0 any other lobe: both ease to 0.75 for the climb unless very fine; -1 root burst)
    kind = mix(kind, -0.25, tubeK);      // (a core: always in the lobes' shade, see CLOUD_FRAG)
    flowK = 1.0 + 0.8*kid;
    vec3 drift = vec3(0.0);
    if (mode > 0.5) {                       // root burst, keyed to the volley clock (aLobe.z = how far this lobe is thrown, aLobe.y = its delay)
      float vol = floor(uClock/3.0), ph = fract(uClock/3.0), tau = max(ph*3.0 - aLobe.y*0.35, 0.0);
      float big = 1.0 + 0.4*step(mod(vol, 4.0), 0.5);
      float e1 = 1.0 - exp(-tau*1.9);
      float life = smoothstep(0.0, 0.09, tau/3.0)*(1.0 - smoothstep(0.5, 0.97, ph));
      float reach = (mode > 1.5 ? 95.0 : r*2.6)*aLobe.z;
      c = aCenter + aOut*(reach*e1*big) + vec3(0.0, mode > 1.5 ? r*0.22*e1 : 0.0, 0.0);
      // the black dome's lobes never show as small balls: they keep their size, rise out of the sea and sink back into it
      if (mode < 1.5) { sc = (0.66 + 0.34*e1)*big; c.y -= r*1.75*(1.0 - life); }
      else sc = life*(0.5 + 0.5*e1)*big;
      flowK = 3.0;
    }
`+Tt,$t=At+`
  void main(){
    float tone = aTone.x, flowK = 4.0, cellMin = 0.0, cellK = 1.0, cellMax = 95.0, nrmK = 0.0, domeK = 0.0, w2 = 0.10, w3 = 0.05, seat = 1.0, kind = 0.0, tubeK = 0.0; vec2 wn = vec2(0.0);
    float rho = max(uSurge.x - aTone.y, 4.0);
    float grow = clamp(rho*0.07 + 5.0, 6.0, 17.0);            // the wall is born low and stands 35-40 m by the lagoon's middle
    float r = grow*aLobe.x;
    vec2 cxz = uSurge.zw + vec2(aOut.x, aOut.z)*rho;
    // the surge is held in by the crater and pours out through the breach
    float dC = length(cxz), al = dot(cxz, vec2(${Ve}, ${Re})), pe = abs(dot(cxz, vec2(${ie}, ${re})));
    float inside = max(1.0 - smoothstep(168.0, 204.0, dC), smoothstep(-30.0, 50.0, al)*(1.0 - smoothstep(66.0, 104.0 + max(al - 150.0, 0.0)*0.3, pe)));
    float roll = 0.88 + 0.12*sin(uTime*aLobe.z*6.2832 + aLobe.y*6.2832);
    // nothing solid ever reaches the lens: a lobe melts away inside the mist before it is 50 m off
    vec3 cw = (modelMatrix*vec4(cxz.x, grow*aOut.y, cxz.y, 1.0)).xyz;
    float nearK = smoothstep(1.5*r + 42.0, 1.5*r + 82.0, distance(cw, cameraPosition));
    float sc = uSurge.y*inside*roll*nearK;
    vec3 c = vec3(cxz.x, grow*aOut.y*(0.35 + 0.65*sc) + r*0.1*sin(uTime*aLobe.z*4.0 + aLobe.w*40.0), cxz.y);
    vec3 drift = vec3(aOut.x, -1.0, aOut.z)*(uTime*2.0);
`+Tt;function Nt(e,n,u,p){const c=new a.ShaderMaterial({fog:!1,uniforms:{uSteam:{value:u.steam.clone()},uShadow:{value:u.shadow.clone()},uAsh:{value:u.ash.clone()},uFlashCol:{value:new a.Color("#D9C8FF")},uSurgeCol:n.uSurgeCol},vertexShader:e,fragmentShader:Ht});c.defines={},n.fine&&(c.defines.IB_OCT2=1),p&&(c.defines.IB_SURGE=1);for(const h of["uTime","uClock","uSurge","uSunDir","uSunCol","uSkyCol","uNight","uFlashPos","uFlashI","uNearK"])c.uniforms[h]=n[h];return c}async function mt(e,n,u,p){let c=u,h=p;for(let N=0;N<n.length;N++)c+=n[N].S.nv,h+=n[N].S.idx.length;const g=Dt(c,h);return{B:g,async run(){let N=0;for(let S=0;S<n.length;S++)Et(g,n[S].S,n[S].L),N+=n[S].S.nv,N>1400&&(N=0,await e.yield())}}}const nt=[-150,22,136],it=[273,595,-247],Ft=273*273+595*595+61009,eo=Math.sqrt(Ft),Pt=.685;function st(e,n,u,p){const c=J(((e-nt[0])*it[0]+(n-nt[1])*it[1]+(u-nt[2])*it[2])/Ft,0,1);return p.x=nt[0]+it[0]*c,p.y=nt[1]+it[1]*c,p.z=nt[2]+it[2]*c,p.t=c,p.d=Math.hypot(e-p.x,n-p.y,u-p.z),p}const Wt=[[-120,2.4,800],[-109,2.4,720],[-135,2.4,550],[-180,2.4,400],[-230,2.6,300],[-246,2.8,223],[-189,3.2,171],[-150,22,136],[-80,178,73],[37,430,-33]];async function Bt(e,n,u,p,c){const h=await at(e,6);await e.yield();const g=await at(e,5);await e.yield();const N=await at(e,13);await e.yield();const S=await at(e,10);await e.yield();const I=await at(e,3),x=await at(e,2),m=await at(e,1),A=Ct(I,-.25),M=Ct(I,-.3);await e.yield();const d={x:0,y:0,z:0,t:0,d:0},q=96,W=65,i=u.wind,D=u.tanLean,w=(r,l)=>{const b=(zt(l)+ot(l)*(1-.45*B(450,700,l)))*r,s=Mt(l,D);return[ie*b+i[0]*s,re*b+i[1]*s]},T=r=>{const l=Mt(r,D);return[i[0]*l,i[1]*l]};u.trunkAxis=w,u.colAxis=T,u.slotLobes=[];let O=[];const E=[],L=[],V=[],_=[];for(let r=0;r<2;r++){const l=r===0?1:-1,b=12,s=q/b;for(let t=0;t<b;t++){const o=n()*6.283;for(let f=0;f<s;f++){const v=Math.max(8,(t+n.range(.1,.9))/b*700),k=o+(f+n.range(-.3,.3))/s*6.283,y=n.range(22,44)*(1+v/1e3)*(n.chance(.18)?1.35:1),K=ot(v)*(v>450?1.08:1),F=w(l,v),z=Math.cos(k),j=Math.sin(k),U=K-1.02*y,H=B(400,700,v),X={x:F[0]+z*U,y:v,z:F[1]+j*U,r:y,phase:n(),rate:n.range(.13,.22)*34/y,seed:n.range(0,1),ox:z*.92,oy:.38,oz:j*.92,tone:l>0?se(1,n.range(.45,.75),H):se(0,n.range(.05,.3),H),mode:0,occ:1};st(X.x,X.y,X.z,d);const Q=(z*ie+j*re)*l<-.25||d.d-y<105,Z=z*Ve+j*Re,Y={S:Q?g:v<450&&Z<-.75?m:v<450&&Z<-.4||v>=450?x:I,L:X};Q&&(u.slotLobes.push(X),st(X.x,X.y,X.z,d),X.clear=d.d-y,X.mode=.25,E.push(Y)),O.push(Y)}}}await e.yield();const P=O.slice();for(const r of E){const l=r.L;st(l.x,l.y,l.z,d),l.ct=d.t;const b=d.t>.5?50:42;d.t>.15&&d.t<.9&&d.d-1.23*l.r<b&&(l.r=Math.max(18,(d.d-b)/1.23),l.clear=d.d-l.r),l.pri=l.clear-(d.t>.45?40:0)-(d.t>.62?20:0)}E.sort((r,l)=>r.L.pri-l.L.pri),await e.yield();const R=n.fork("bursts");u.burstPuffs=[];{const r=w(1,0);for(let l=0;l<18;l++){const b=(l+R.range(-.3,.3))/18*6.283,s=Math.cos(b),t=Math.sin(b),o=R.range(11,18),f=R.range(.3,.8);O.push({S:x,L:{x:r[0]+s*R.range(26,44),y:R.range(6,16),z:r[1]+t*R.range(26,44),r:o,phase:R(),rate:R.range(1,1.3),seed:R(),ox:s*.8,oy:f,oz:t*.8,tone:1,mode:1,occ:1}})}for(let l=0;l<52;l++){const b=(l+R.range(-.45,.45))/52*6.283,s=Math.cos(b),t=Math.sin(b),o=R.range(6.5,11.5),f=R.range(.5,1.08);O.push({S:M,L:{x:r[0]+s*58,y:-o*R.range(.12,.34),z:r[1]+t*58,r:o,phase:R(),rate:f,seed:R(),ox:s,oy:0,oz:t,tone:R.range(0,.06),mode:2,occ:1,axis:[0,1,0]}})}for(let l=0;l<84;l++){const b=(l+R.range(-.5,.5))/84*6.283,s=Math.cos(b),t=Math.sin(b);u.burstPuffs.push({x:r[0]+s*58,z:r[1]+t*58,dx:s,dz:t,reach:R.range(.5,1.2),size:R.range(14,25),seed:R()})}}await e.yield();const $=13,ee=W/$,fe=[],Le=[];for(let r=0;r<$;r++){const l=n()*6.283,b=r/($-1);for(let s=0;s<ee;s++){const t=B(.8,1,b);let o=650+(u.colH-650)*Math.pow((r+n.range(.15,.85))/$,1.45);const f=ct(o),v=l+(s+n.range(-.3,.3))/ee*6.283,k=f*n.range(.44,.62)*(1-.25*t),y=Math.cos(v),K=Math.sin(v),F=T(o),z=f-.8*k,j=t*n.range(.2,2.6)*f;t>0&&(o=se(o,u.colH*.93,t*.8)+n.range(-.1,.1)*f);const U=y*ie+K*re,H={S:x,L:{x:F[0]+y*z+i[0]*j,y:o,z:F[1]+K*z+i[1]*j,r:k,phase:n(),rate:n.range(.1,.16)*60/k,seed:n.range(0,1),ox:y*.9,oy:.42,oz:K*.9,tone:J((.3+.3*U+n.range(-.08,.08))*(1-.6*B(900,3800,o))+.16*(1-B(650,1e3,o)),0,1),mode:r===0?.45:0,occ:1}};r===0?(H.L.rate=0,L.push(H.L),fe.push(H),V.push({S,L:H.L}),_.push({S:x,L:Object.assign({},H.L,{mode:.25})})):r===1?(fe.push(H),V.push({S:h,L:Object.assign({},H.L,{mode:.45})}),_.push({S:x,L:H.L})):(O.push(H),Le.push(H))}}{const r=wt(Math.floor((L.length?L[0].seed:.5)*1e9)+17),l=u.colH*.93,b=ct(l),s=T(l);for(let t=0;t<14;t++){const o=(.15+2.5*t/13)*b,f=(t&1?.36:-.36)*b+r.range(-.1,.1)*b,v=b*r.range(.42,.52);O.push({S:x,L:{x:s[0]+i[0]*o-i[1]*f,y:l+r.range(-.1,.04)*b,z:s[1]+i[1]*o+i[0]*f,r:v,phase:r(),rate:r.range(.1,.16)*60/v,seed:r.range(0,1),ox:i[0]*.5,oy:.42,oz:i[1]*.5,tone:r.range(.08,.16),mode:0,occ:1}})}}await e.yield();let Ce;{const r=E.filter(t=>t.L.ct>.3&&t.L.ct<.97&&t.L.clear<130).sort((t,o)=>t.L.clear-o.L.clear).slice(0,26);for(const t of r)t.fine=!0,t.L.mode=.45,V.push({S,L:t.L}),_.push({S:I,L:Object.assign({},t.L,{mode:.25})});for(const t of P){const o=t.L;st(o.x,o.y,o.z,d),t.cl=d.d-o.r,t.ct=d.t}const l=t=>{const o=t.L;o.clear===void 0&&(o.clear=t.cl,o.ct=t.ct,o.pri=o.clear,t.promoted=!0,u.slotLobes.push(o),E.push(t)),t.fine=!0,o.mode=.45,V.push({S,L:o}),_.push({S:g,L:Object.assign({},o,{mode:.25})})};Ce=P.filter(t=>!t.fine&&t.ct>.03&&t.ct<=.3).sort((t,o)=>t.cl-o.cl).slice(0,12);for(const t of Ce)l(t);const b=P.filter(t=>!t.fine&&t.ct>.03&&t.ct<.97).sort((t,o)=>t.cl-o.cl).slice(0,5);for(const t of b)l(t);u.upLobes=b.length,u.lowLobes=Ce.length;{const t=V.filter(o=>o.S===S&&o.L.clear!==void 0&&o.L.rate>0).sort((o,f)=>o.L.clear-f.L.clear).slice(0,4);for(const o of t)o.S=N}let s=0;for(const t of P){const o=t.L;t.fine||o.clear!==void 0||o.y<420||(st(o.x,o.y,o.z,d),!(d.t<.6||d.d-o.r>160)&&(t.fine=!0,s++,V.push({S:h,L:Object.assign({},o,{mode:.4})}),_.push({S:t.S,L:o})))}u.topLobes=s,O=O.filter(t=>!t.fine)}for(let r=0,l=0;r<E.length&&l<10;r++)E[r].fine||(E[r].S=h,E[r].L.mode=.4,l++);await e.yield(),u.kids=[];const ce=P.map(r=>r.L).concat(fe.map(r=>r.L),Le.map(r=>r.L)),ue=(r,l)=>wt(Math.floor(J(r.seed,0,.999999)*1e9)+l),le=r=>{const l=r.range(-1,1),b=r.range(0,6.2832),s=Math.sqrt(Math.max(0,1-l*l));return[s*Math.cos(b),l,s*Math.sin(b)]},ke=(r,l)=>ce.filter(b=>b!==r&&b!==l&&Math.hypot(b.x-r.x,b.y-r.y,b.z-r.z)<r.r+b.r),Pe=(r,l,b)=>{if(l<720)for(let s=-1;s<=1;s+=2){const t=w(s,l);if(Math.hypot(r-t[0],b-t[1])<ot(l)-27)return!0}if(l>600){const s=T(l);if(Math.hypot(r-s[0],b-s[1])<ct(l)*.62)return!0}return!1},Se=(r,l,b)=>{const s=r.x+l[0]*r.r,t=r.y+l[1]*r.r,o=r.z+l[2]*r.r;for(let f=0;f<b.length;f++){const v=b[f],k=s-v.x,y=t-v.y,K=o-v.z,F=.85*v.r;if(k*k+y*y+K*K<F*F)return!1}return!Pe(s,t,o)},Ae=(r,l,b)=>{for(const s of r)if(s[0]*l[0]+s[1]*l[1]+s[2]*l[2]>b)return!0;return!1},Te=(r,l,b,s)=>(st(r.x+l[0]*b*r.r,r.y+l[1]*b*r.r,r.z+l[2]*b*r.r,d),d.d-s>=(d.t<Pt+.03?22:12)),We=(r,l,b,s,t)=>{const o=2+J(r.seed,0,.99);return{x:r.x,y:r.y,z:r.z,r:r.r,phase:r.phase,rate:r.rate,seed:s,ox:r.ox,oy:r.oy,oz:r.oz,tone:r.tone,mode:t,occ:1,kx:l[0]*o,ky:l[1]*o,kz:l[2]*o,kw:b/r.r,axis:l,view:!0}};{const l=t=>t.L.ct>.5&&t.L.ct<.93&&t.L.clear<150?1:0,b=E.filter(t=>!t.promoted).sort((t,o)=>l(o)-l(t)||t.L.pri-o.L.pri);let s=0;for(const t of b){const o=t.L;if(o.y<120||u.kids.length>=300)continue;const f=l(t)?o.clear<115?12:8:Math.ceil((o.clear<70?11:o.clear<110?8:o.clear<160?5:3)*(o.ct<.3?.6:1)),v=ue(o,101),k=ke(o),y=o.kd||(o.kd=[]);let K=0;for(let F=0;F<f*14&&K<f;F++){const z=le(v),j=J(o.r*v.range(.17,.38),7,20),U=v(),H=v.range(.72,.82);if(!Se(o,z,k)||Ae(y,z,.87)||!Te(o,z,H,j*1.35))continue;y.push(z),K++;const X={x:o.x,y:o.y,z:o.z,r:o.r,phase:o.phase,rate:o.rate,seed:U,ox:o.ox,oy:o.oy,oz:o.oz,tone:o.tone,mode:0,occ:1,kx:z[0]*H,ky:z[1]*H,kz:z[2]*H,kw:j/o.r,axis:z};u.kids.push(X),O.push({S:A,L:X})}(++s&3)===0&&await e.yield()}}await e.yield();const C=u.sun,G=r=>r[0]*C.x+r[1]*C.y+r[2]*C.z>-.3;for(const r of L){const l=ue(r,211),b=ke(r),s=r.kd||(r.kd=[]);let t=0;for(let o=0;o<90&&t<5;o++){const f=le(l),v=J(r.r*l.range(.13,.24),12,21),k=l();if(G(f)||!Se(r,f,b)||Ae(s,f,.9))continue;s.push(f),t++;const y=We(r,f,v,k,0);u.kids.push(y),O.push({S:A,L:y})}}await e.yield();{let r=0;for(const l of L){if(Math.hypot(l.x-37,l.y-430,l.z+33)-l.r>200)continue;l.ct=.99;const b=ue(l,307),s=ke(l),t=l.kd||(l.kd=[]);let o=0;for(let f=0;f<110&&o<6;f++){const v=le(b),k=J(l.r*b.range(.1,.17),10,19),y=b();if(G(v)||!Se(l,v,s)||Ae(t,v,.93))continue;t.push(v),o++,r++;const K=We(l,v,k,y,.05);u.kids.push(K),V.push({S:A,L:K})}}u.climbKids=r}await e.yield();{const r=V.filter(b=>b.L.mode===.45&&b.L.ct!==void 0&&b.L.ct>.55);let l=0;for(let b=0;b<r.length&&l<54;b++)for(let s=b+1;s<r.length&&l<54;s++){const t=r[b].L,o=r[s].L,f=o.x-t.x,v=o.y-t.y,k=o.z-t.z,y=Math.hypot(f,v,k),K=t.r*.95,F=o.r*.95;if(y>K+F-4||y<Math.abs(K-F)+4||t.tone>.5!=o.tone>.5)continue;const z=J((y*y+K*K-F*F)/(2*y*K),-.95,.95),j=Math.sqrt(1-z*z),U=f/y,H=v/y,X=k/y;let Q=H*0-X*1,Z=X*0-U*0,Y=U*1-H*0,ae=Math.hypot(Q,Z,Y);ae<.001&&(Q=1,Z=0,Y=0,ae=1),Q/=ae,Z/=ae,Y/=ae;const Ie=H*Y-X*Z,Je=X*Q-U*Y,Ze=U*Z-H*Q,Oe=wt(Math.floor(J(t.seed,0,.999999)*1e6)*1e3+Math.floor(J(o.seed,0,.999999)*997)+503),ze=ke(t,o),Ne=[];for(let qe=0;qe<24&&Ne.length<3;qe++){const ye=Oe.range(0,6.2832),je=J(Math.min(t.r,o.r)*Oe.range(.2,.3),7,15),Ye=Oe(),de=Math.cos(ye),ne=Math.sin(ye),$e=[U*z+(Q*de+Ie*ne)*j,H*z+(Z*de+Je*ne)*j,X*z+(Y*de+Ze*ne)*j];if(!Se(t,$e,ze)||Ae(Ne,$e,.8)||!Te(t,$e,.95,je*1.35))continue;Ne.push($e),l++;const kt={x:t.x,y:t.y,z:t.z,r:t.r,phase:t.phase,rate:t.rate,seed:Ye,ox:t.ox,oy:t.oy,oz:t.oz,tone:t.tone,mode:.05,occ:1,kx:$e[0]*.8,ky:$e[1]*.8,kz:$e[2]*.8,kw:je/t.r,axis:$e};if(u.kids.push(kt),V.push({S:A,L:kt}),(t.kd||(t.kd=[])).push($e),l>=54)break}}u.creaseKids=l}await e.yield();{const r=(t,o)=>{const f=ue(t,401),v=ke(t),k=t.kd||(t.kd=[]);let y=0;const K=Math.max(.9,Math.cos(Math.min(.45,26/t.r)));for(let F=0;F<o*30&&y<o;F++){const z=le(f),j=J(t.r*f.range(.15,.28),7,14),U=f();if(t.rate===0&&G(z)||!Se(t,z,v)||Ae(k,z,K)||!Te(t,z,1.33,j*1.3))continue;k.push(z),y++;const H=We(t,z,j,U,.05);u.kids.push(H),V.push({S:A,L:H})}return y},l=V.filter(t=>(t.S===S||t.S===N)&&t.L.mode===.45).map(t=>t.L);for(const t of l)st(t.x,t.y,t.z,d),t.lineD=d.d-t.r;l.sort((t,o)=>t.lineD-o.lineD);let b=0,s=0;for(const t of l){if(b>=230)break;b+=r(t,Math.min(230-b,J(Math.round(12-t.lineD/16),3,11))),(++s&1)===0&&await e.yield()}u.lineKids=b}await e.yield();const te=await mt(e,O,1793,1640*6),oe=te.B;xt(oe,-12,720,30,20,r=>w(1,r),r=>ot(r)-27,1,.62),xt(oe,-12,720,30,20,r=>w(-1,r),r=>ot(r)-27,0,.2),xt(oe,600,u.colH*.97,22,20,T,r=>ct(r)*.62,.36,.36),await e.yield(),await te.run();const he=T(u.colH),Ke=ft(oe,he[0]*.5,u.colH*.5,he[1]*.5,u.colH,!0),me=Nt(Ot,p,c,!1),pe=new a.Mesh(Ke,me);pe.name="clouds",pe.frustumCulled=!1,await e.yield();const Ee=await mt(e,V,0,0);await Ee.run();const we=new a.Mesh(ft(Ee.B,0,350,0,900,!0),me);we.name="cloudsNear",we.frustumCulled=!1,we.visible=!1,await e.yield();const be=await mt(e,_,0,0);await be.run();const ge=new a.Mesh(ft(be.B,0,350,0,900,!0),me);ge.name="cloudsFar",ge.frustumCulled=!1,await e.yield();const ve=n.fork("surge"),He=Math.atan2(223-re*Me,-246-ie*Me),Be=1.12;u.surgeSect=He,u.surgeSW=Be;const rt=[{lag:0,hf:[.24,.4],sz:[.62,.86]},{lag:8,hf:[.8,1.08],sz:[.86,1.12]},{lag:18,hf:[1.55,1.95],sz:[.8,1.06]},{lag:31,hf:[1.15,1.6],sz:[.95,1.2]}],ut=[];for(let r=0;r<4;r++){const l=rt[r],b=50,s=12;for(let t=0;t<b+s;t++){const o=t<b,f=o?He+((t+ve.range(-.35,.35)+.5*(r&1))/b*2-1)*Be:He+Be+(t-b+ve.range(.2,.8))/s*(6.2832-2*Be);ut.push({S:r<3?x:m,L:{x:0,y:0,z:0,r:ve.range(l.sz[0],l.sz[1])*(o?1:1.7),phase:ve(),rate:ve.range(.25,.5),seed:ve(),ox:Math.cos(f),oy:ve.range(l.hf[0],l.hf[1]),oz:Math.sin(f),tone:.7,mode:l.lag+ve.range(-3,3),occ:1}})}}const Xe=await mt(e,ut,0,0);await Xe.run();const _e=new a.Mesh(ft(Xe.B,0,0,0,700),Nt($t,p,c,!0));return _e.name="surge",_e.frustumCulled=!1,{mesh:pe,surge:_e,nearMesh:we,farMesh:ge}}const vt=`
uniform float uClock, uSeed; uniform vec3 uVent; uniform vec2 uWind;
const float IB_G = ${qt};
// launch velocity of finger f in the volley held by slot s; age since it fired; show 0/1; big 0/1
vec3 ibFinger(float f, float s, out float age, out float show, out float big, out float hs){
  float n = floor(uClock/${lt}.0);
  float N = n - mod(n - s, ${Qe}.0);
  age = uClock - N*${lt}.0;
  big = step(mod(N, ${dt}.0), 0.5);
  vec2 k = vec2(N*1.371 + uSeed*13.7, f*7.31 + 1.7);
  float h1 = ibH12(k), h2 = ibH12(k + 19.19), h3 = ibH12(k + 41.7);
  hs = h3;
  float count = 7.0 + floor(ibH11(N*0.731 + uSeed*3.1 + 5.0)*3.99);
  show = step(f, count - 0.5);
  float tilt = mix(0.15, 0.5, h2);
  // 190 to 350 m high; EVERY FOURTH VOLLEY IS A FULL 420 M: each of its fingers is thrown at the speed that carries it, at its
  // own tilt, to between 400 and 420 m (most of them within 8 m of the 420)
  float speed = mix(mix(64.0, 86.0, h1), sqrt(2.0*IB_G*(420.0 - 20.0*h1*h1))/cos(tilt), big);
  // fan away from the slot: azimuth within +-72 degrees of the across-breach axis P (none leans across the slot or the portal)
  float az = ${Math.atan2(re,ie).toFixed(4)} + ((f + h3)/${De}.0 - 0.5)*2.5;
  return speed*vec3(sin(tilt)*cos(az), cos(tilt), sin(tilt)*sin(az));
}
// where the ejecta that left with a fraction of the bomb's speed is now (tau 0 = bomb, 1 = slowest)
vec3 ibTail(vec3 v0, float age, float tau, out float fall){
  float fsp = 1.0 - 0.93*pow(max(tau, 0.0), 0.8);                 // the slowest ejecta barely leaves the rim: a jet stays rooted while it rises
  vec3 v = v0*fsp;
  float vt = mix(2400.0, 15.0, sqrt(max(tau, 0.0)));           // fine ash falls at terminal speed
  float ta = v.y/IB_G, y;
  fall = max(age - ta, 0.0);
  if (age < ta) y = v.y*age - 0.5*IB_G*age*age;
  else { float kq = IB_G/vt; y = 0.5*v.y*ta - vt*(fall - (1.0 - exp(-kq*fall))/kq); }
  float kd = 0.012 + 0.15*tau;
  float th = (1.0 - exp(-kd*age))/kd;
  vec2 xz = v.xz*th + uWind*(tau*age*2.4) + v0.xz/max(length(v0.xz), 1e-3)*82.0;   // fingers leave the rim of the black trunk
  return uVent + vec3(xz.x, y, xz.y);
}
vec3 ibLand(vec3 v0, out float tl){ tl = 2.0*v0.y/IB_G; float th = (1.0 - exp(-0.012*tl))/0.012; vec2 o = v0.xz/max(length(v0.xz), 1e-3)*82.0; return uVent + vec3(v0.x*th + o.x, 0.0, v0.z*th + o.y); }
`;function pt(e,n){for(const u of["uClock","uSeed","uVent","uWind","uTime","uSunDir","uSunCol","uSkyCol","uNight"])e.uniforms[u]=n[u]}function Lt(e,n){const u=Qe*De,p=new Float32Array(u*2);for(let h=0;h<Qe;h++)for(let g=0;g<De;g++)p[(h*De+g)*2]=g,p[(h*De+g)*2+1]=h;const c=new a.InstancedBufferGeometry;c.index=e.index;for(const h in e.attributes)c.setAttribute(h,e.attributes[h]);return c.setAttribute("aInst",new a.InstancedBufferAttribute(p,2)),c.instanceCount=u,c.boundingSphere=new a.Sphere(new a.Vector3(0,200,0),1200),n&&n(c),c}function _t(e,n){const p=new a.PlaneGeometry(2,1,1,30);p.translate(0,.5,0),p.deleteAttribute("normal"),p.deleteAttribute("uv");const c=Qe*De,h=new Float32Array(c*2*3);for(let I=0;I<2;I++)for(let x=0;x<Qe;x++)for(let m=0;m<De;m++){const A=(I*c+x*De+m)*3;h[A]=m,h[A+1]=x,h[A+2]=I}const g=new a.InstancedBufferGeometry;g.index=p.index,g.setAttribute("position",p.attributes.position),g.setAttribute("aInst",new a.InstancedBufferAttribute(h,3)),g.instanceCount=c*2,g.boundingSphere=new a.Sphere(new a.Vector3(0,200,0),1200);const N=new a.ShaderMaterial({transparent:!0,depthWrite:!1,side:a.DoubleSide,fog:!1,uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{uAsh:{value:n.ash.clone()},uSteam:{value:n.steam.clone()},uShadow:{value:n.shadow.clone()}}]),vertexShader:`
      attribute vec3 aInst; uniform float uTime;
      varying vec4 vJ; varying vec3 vSide; varying vec3 vView; varying vec4 vA;   // ash: vJ = across, tau, seed, seconds falling; vA = alpha, age of the volley, 0, -.  steam: vJ = across, along, seed, 0; vA = alpha, age of the steam, 1, when it was shed
      ${Fe}
      ${xe}
      ${vt}
      // where the steam the bomb shed ts seconds after launch hangs now, s seconds later
      vec3 ibTrail(vec3 v0, float ts, float s){
        float fl; vec3 p = ibTail(v0, ts, 0.0, fl);
        p.xz += uWind*(1.5*s); p.y += 1.0*s;
        return p;
      }
      void main(){
        float age, show, big, hs, fall = 0.0, f2;
        vec3 v0 = ibFinger(aInst.x, aInst.y, age, show, big, hs);
        float kind = aInst.z, tau, ta = v0.y/IB_G, tStop = 0.88*ta, ts = 0.0, s = 0.0;
        vec3 p, p2;
        if (kind < 0.5) {
          tau = position.y*position.y*0.4 + position.y*0.6;
          p = ibTail(v0, age, tau, fall);
          p2 = ibTail(v0, age, tau + 0.03, f2);
        } else {
          tau = position.y;
          float te = min(age, 2.0*ta), span = clamp(age - tStop, 0.0, 2.0), ts2 = te - (tau + 0.03)*span;
          ts = te - tau*span; s = age - ts;
          p = ibTrail(v0, ts, s); p2 = ibTrail(v0, ts2, age - ts2);
        }
        vec3 T = p - p2; float tlen = length(T); T = tlen > 1e-3 ? T/tlen : vec3(0.0, 1.0, 0.0);
        vec4 wp = modelMatrix*vec4(p, 1.0);
        vec3 toCam = cameraPosition - wp.xyz; float dist = length(toCam); toCam /= max(dist, 1e-3);
        vec3 Tw = mat3(modelMatrix)*T;
        vec3 side = cross(Tw, toCam); side = side/max(length(side), 1e-3);
        float w, alive;
        if (kind < 0.5) {
          // cypress taper: 2 to 5 m half-width at the bomb, swelling down the tail, pinched at the root
          w = mix(3.0, 24.0, pow(tau, 0.42))*(0.72 + 0.11*min(age, 9.0))*(1.0 - 0.3*smoothstep(0.85, 1.0, tau));
          w *= 1.0 + 0.5*smoothstep(0.0, 6.0, fall);
          w = max(w, dist*0.0016);
          // each part of the tail pales and rains out once it is falling; the whole finger is gone by ~21 s
          alive = (1.0 - smoothstep(1.0, 3.6 + 2.0*(1.0 - tau), fall))*smoothstep(0.0, 0.5, age)*(1.0 - smoothstep(17.0, 21.0, age));
          // nothing lies on the sea as a sheet: what is falling thins from 70 m above the water and has gone by 10 m
          alive *= mix(1.0, smoothstep(10.0, 70.0, p.y), smoothstep(0.5, 3.0, fall));
          // a ribbon seen end-on fades instead of collapsing to a sliver
          alive *= 1.0 - smoothstep(0.75, 0.95, abs(dot(Tw, toCam)));
        } else {
          w = (0.6 + 1.7*(1.0 - exp(-s/1.5)))*1.7;
          alive = smoothstep(0.0, 0.7, age - tStop)*(1.0 - smoothstep(0.6, 2.2, s))*smoothstep(4.0, 30.0, p.y)*smoothstep(110.0, 300.0, dist)*0.34;
          w = max(w, dist*0.0011);
          w *= mix(0.2, 1.0, smoothstep(0.0, 0.22, tau)*(1.0 - smoothstep(0.7, 1.0, tau)));      // (a wisp that tapers away at both ends, never a ruled line of one width)
          alive *= 1.0 - smoothstep(0.9, 0.99, abs(dot(Tw, toCam)));
        }
        wp.xyz += side*(position.x*w*show);
        wp.y = max(wp.y, 0.3);
        // one near the lens fades before it can show as a polygon
        alive *= smoothstep(70.0, 150.0, dist);
        vJ = vec4(position.x, tau, hs*37.0 + aInst.x*3.1, fall);
        vSide = side; vView = toCam;
        vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
        vA = vec4(alive*show, mix(age, s, kind), kind, ts);
        ${Ue}
        vA.x *= mix(1.0, 1.0 - vFog.y, step(0.5, kind));      // (a steam trail seen through the surge's mist was a ruled white line)
      }`,fragmentShader:`
      uniform vec3 uAsh, uSteam, uShadow; uniform float uTime;
      ${Ge}
      varying vec4 vJ; varying vec3 vSide; varying vec3 vView; varying vec4 vA;
      ${et}
      ${xe}
      void main(){
        // (the across and along coordinates are clamped to their own range before anything is worked out from them: on a thin
        // ribbon an antialiased sample can run past the vertices' values)
        float x = clamp(vJ.x, -1.0, 1.0), tau = clamp(vJ.y, 0.0, 1.0), e = abs(x), sd = vJ.z;
        if (vA.z > 0.5) {      // the steam a bomb trails from 0.88 of its rise: a wisp that has dissolved before its outline and before both its ends
          float fadeE = 1.0 - smoothstep(0.62, 0.97, e);
          float len = vA.w*3.4 + sd, tt = uTime*0.22;
          float n1 = ibVN2(vec2(len*0.55 - e*0.8 + tt*0.3, x*1.3 + sd));
          float n2 = ibVN2(vec2(len*1.6 - e*1.4 - tt, x*3.0 - sd));
          vec3 N = normalize(vSide*(x*0.95 + (n1 - 0.5)*0.9) + vView*sqrt(max(1.0 - x*x*0.9, 0.02)));
          float lit = smoothstep(-0.15, 0.4, dot(N, uSunDir));
          float a = (1.0 - smoothstep(0.25, 0.9, e + (n1 - 0.5)*0.6))*(0.3 + 0.7*smoothstep(0.25, 0.7, n2))*vA.x*smoothstep(0.0, 0.15, tau)*(1.0 - smoothstep(0.7, 1.0, tau))*fadeE;
          if (a < 0.004) discard;
          gl_FragColor = vec4(mix(uShadow*uSkyCol*1.5, uSteam*uSunCol*0.9, 0.35 + 0.65*lit), a);
        } else {
          float len = tau*26.0 + vJ.z, tt = uTime*0.3;
          // a jet of ash, not a feather: a solid black body with a lumpy, turbulent outline (billows of two sizes that
          // roll slowly back down the tail) inside a thinner brown-grey cloud of fine ash
          float n1 = ibVN2(vec2(len*0.6 - tt - e*0.7, x*1.3 + vJ.z));
          float n2 = ibVN2(vec2(len*1.7 - tt*1.8 - e*1.2, x*3.0 - vJ.z));
          float n3 = ibVN2(vec2(len*0.45, x*7.0 + vJ.z*2.0));
          float edge = e + (n1 - 0.5)*0.6 + (n2 - 0.5)*0.3;
          float core = 1.0 - smoothstep(0.5, 0.74, edge);
          float sheath = (1.0 - smoothstep(0.45, 1.0, e + (n1 - 0.5)*0.5))*(0.3 + 0.25*n2);
          // rain-out: the body breaks into pale falling streaks
          // (a tail whose root has already rained out is old: it pales to brown-grey and thins to a veil, so what hangs
          // in the air late in a volley is drifting ash, not a dark frond)
          float old = smoothstep(3.5, 8.5, vA.y);
          float pale = max(smoothstep(0.3, 4.0, vJ.w), 0.85*old);
          core *= mix(1.0, smoothstep(0.42, 0.8, n3)*0.5, pale);
          float a = max(core, sheath*(1.0 - 0.5*pale))*(1.0 - 0.62*old);
          a *= vA.x;
          if (a < 0.004) discard;
          // fake round shading across the ribbon, each billow lit on its sunward side
          vec3 N = normalize(vSide*(x*0.95 + (n1 - 0.5)*0.9) + vView*sqrt(max(1.0 - x*x*0.9, 0.02)));
          float ndl = dot(N, uSunDir);
          float lit = smoothstep(-0.15, 0.4, ndl);
          vec3 alb = mix(uAsh*1.5 + 0.006, vec3(0.25, 0.225, 0.2), pale*0.9);
          alb = mix(vec3(0.12, 0.105, 0.09)*(1.0 + pale), alb, core);                       // the cloud of fine ash round the body is brown-grey
          alb *= 0.75 + 0.5*n2;
          // (the sheath takes the sky's light without its blue: lit by the sky's own colour it was a pale violet pane against the sky)
          vec3 skyJ = mix(vec3(dot(uSkyCol, vec3(0.3, 0.5, 0.2)))*vec3(1.06, 1.0, 0.92), uSkyCol, 0.25 + 0.75*core);
          gl_FragColor = vec4(alb*(uSunCol*lit*(0.5 + 0.5*n1) + skyJ*0.55), a);
        }
        ${tt}
      }`});pt(N,e);const S=new a.Mesh(g,N);return S.name="jets",S.frustumCulled=!1,S.renderOrder=3,S}function jt(e,n,u){const p=new a.IcosahedronGeometry(1,1);p.deleteAttribute("uv"),p.deleteAttribute("normal");const c=Kt(p,1e-4),h=c.attributes.position;for(let m=0;m<h.count;m++){const A=.72+.5*e();h.setXYZ(m,h.getX(m)*A*1.15,h.getY(m)*A*.85,h.getZ(m)*A)}const g=new a.ShaderMaterial({fog:!1,uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{uBomb:{value:u.bomb.clone()}}]),vertexShader:`
      attribute vec2 aInst; uniform float uTime; varying vec3 vL; varying float vHot;
      ${Fe}
      ${xe}
      ${vt}
      void main(){
        float age, show, big, hs, fall, tl;
        vec3 v0 = ibFinger(aInst.x, aInst.y, age, show, big, hs);
        vec3 c = ibTail(v0, age, 0.0, fall);
        ibLand(v0, tl);
        show *= step(age, tl)*step(0.15, age);
        // tumble
        float a1 = age*(2.0 + 3.0*hs) + hs*40.0, a2 = age*(1.3 + 2.0*fract(hs*7.0));
        vec3 q = position; float cs = cos(a1), sn = sin(a1);
        q = vec3(q.x*cs - q.y*sn, q.x*sn + q.y*cs, q.z); cs = cos(a2); sn = sin(a2);
        q = vec3(q.x, q.y*cs - q.z*sn, q.y*sn + q.z*cs);
        vec4 wc = modelMatrix*vec4(c, 1.0);
        float dist = distance(wc.xyz, cameraPosition);
        float size = (1.0 + 0.5*hs)*max(1.0, dist*0.0058)*show;      // 2-3 m across, never under ~3 px
        vL = position; vHot = 1.0 - 0.35*smoothstep(4.0, 16.0, age);
        vec4 mvPosition = viewMatrix*(wc + vec4(mat3(modelMatrix)*q*size, 0.0)); gl_Position = projectionMatrix*mvPosition;
        ${Ue}
      }`,fragmentShader:`
      uniform vec3 uBomb; varying vec3 vL; varying float vHot;
      ${et}
      ${xe}
      void main(){
        float crust = smoothstep(0.45, 0.7, ibVN(vL*2.3 + 3.0));
        vec3 col = uBomb*mix(4.6, 0.5, crust*0.8)*vHot + vec3(0.6, 0.35, 0.1)*(1.0 - crust)*vHot;
        gl_FragColor = vec4(col, 1.0);
        ${tt}
      }`});pt(g,n);const N=new a.Mesh(Lt(c),g);N.name="bombs",N.frustumCulled=!1;const S=new a.PlaneGeometry(2,2);S.deleteAttribute("normal"),S.deleteAttribute("uv");const I=new a.ShaderMaterial({transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,fog:!1,uniforms:{uBomb:{value:u.bomb.clone()}},vertexShader:`
      attribute vec2 aInst; uniform float uTime; varying vec2 vQ; varying float vK;
      ${Fe}
      ${xe}
      ${vt}
      void main(){
        float age, show, big, hs, fall, tl;
        vec3 v0 = ibFinger(aInst.x, aInst.y, age, show, big, hs);
        vec3 c = ibTail(v0, age, 0.0, fall);
        ibLand(v0, tl);
        show *= step(age, tl)*smoothstep(0.1, 0.5, age);
        vec4 mv = viewMatrix*modelMatrix*vec4(c, 1.0);
        float size = max(4.0, -mv.z*0.0075)*show;
        vec4 mvPosition = mv; ${Ue}
        mv.xy += position.xy*size; vQ = position.xy; vK = show*(1.0 - 0.3*smoothstep(4.0, 16.0, age))*(1.0 - vFog.x)*(1.0 - vFog.y);
        gl_Position = projectionMatrix*mv;
      }`,fragmentShader:`
      uniform vec3 uBomb; varying vec2 vQ; varying float vK;
      void main(){ float d = dot(vQ, vQ); float g = exp(-d*5.5)*1.5 + exp(-d*1.8)*0.22; g *= 1.0 - smoothstep(0.7, 1.0, d);
        gl_FragColor = vec4(uBomb*g*vK, 1.0); }`});pt(I,n);const x=new a.Mesh(Lt(S),I);return x.name="bombGlow",x.frustumCulled=!1,x.renderOrder=5,{mesh:N,glow:x}}function Ut(e,n,u,p,c){const h=new a.PlaneGeometry(2,2);h.deleteAttribute("normal"),h.deleteAttribute("uv");const g=Qe*De,N=p.length*2,S=g*2+N,I=new Float32Array(S*4),x=new Float32Array(S*4);let m=0;for(let q=0;q<2;q++)for(let W=0;W<Qe;W++)for(let i=0;i<De;i++,m++)I[m*4]=i,I[m*4+1]=W,I[m*4+2]=q,I[m*4+3]=e();for(let q=0;q<N;q++,m++){const W=p[q>>1],i=e()*6.283,D=e.range(0,.6)*W.r,w=W.x+Math.cos(i)*D,T=W.z+Math.sin(i)*D;I[m*4+2]=2,I[m*4+3]=e(),x[m*4]=w,x[m*4+1]=Math.max(1,c(w,T)),x[m*4+2]=T,x[m*4+3]=e.range(16,30)}const A=new a.InstancedBufferGeometry;A.index=h.index,A.setAttribute("position",h.attributes.position),A.setAttribute("aInst",new a.InstancedBufferAttribute(I,4)),A.setAttribute("aSite",new a.InstancedBufferAttribute(x,4)),A.instanceCount=S,A.boundingSphere=new a.Sphere(new a.Vector3(0,50,0),1200);const M=new a.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!1,uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{uSteam:{value:u.steam.clone()},uShadow:{value:u.shadow.clone()}}]),vertexShader:`
      attribute vec4 aInst; attribute vec4 aSite; uniform float uTime; uniform vec3 uSunDir;
      varying vec4 vQ; varying vec3 vK;     // vQ: quad xy, kind, seed.  vK: alpha, phase, lit side
      ${Fe}
      ${xe}
      ${vt}
      void main(){
        float kind = aInst.z, age, show, big, hs, tl, alpha = 0.0, ph = 0.0;
        vec3 c; vec2 sz;
        if (kind < 1.5) {
          vec3 v0 = ibFinger(aInst.x, aInst.y, age, show, big, hs);
          c = ibLand(v0, tl); float ts = age - tl;
          if (kind < 0.5) {                 // splash crown, 12 m
            ph = clamp(ts/2.6, 0.0, 1.0);
            float up = sin(min(ph*1.25, 1.0)*3.1416);
            sz = vec2(4.5 + 6.0*ph, 0.6 + 6.6*sqrt(max(up, 0.0)));
            c.y += sz.y*0.92; alpha = show*step(0.0, ts)*(1.0 - smoothstep(0.75, 1.0, ph));
          } else {                          // steam plume drifting downwind
            ph = clamp((ts - 0.6)/13.0, 0.0, 1.0);
            float rr = 6.0 + 26.0*sqrt(ph); sz = vec2(rr, rr*1.15);
            c += vec3(uWind.x, 0.0, uWind.y)*(ph*60.0) + vec3(0.0, 4.0 + rr*0.9 + ph*30.0, 0.0);
            alpha = show*smoothstep(0.0, 0.08, ph)*(1.0 - smoothstep(0.3, 1.0, ph))*0.6;
          }
        } else {                            // fumarole wisp
          ph = fract(uTime*0.07 + aInst.w);
          sz = vec2(aSite.w*0.62, aSite.w); c = aSite.xyz + vec3(0.0, sz.y*0.9, 0.0);
          alpha = 0.34;
        }
        vec4 wc = modelMatrix*vec4(c, 1.0);
        vec3 toCam = cameraPosition - wc.xyz; vec3 right = cross(vec3(0.0, 1.0, 0.0), toCam); right = right/max(length(right), 1e-3);
        wc.xyz += right*(position.x*sz.x) + vec3(0.0, position.y*sz.y, 0.0);
        if (kind > 1.5) { float yq = position.y*0.5 + 0.5; wc.xyz += vec3(uWind.x, 0.0, uWind.y)*(yq*yq*sz.y*0.6); }      // a fumarole's plume leans away downwind as it rises
        vQ = vec4(position.xy, kind, aInst.w*31.0); vK = vec3(alpha, ph, dot(right, uSunDir));
        vec4 mvPosition = viewMatrix*wc; gl_Position = projectionMatrix*mvPosition;
        ${Ue}
      }`,fragmentShader:`
      uniform vec3 uSteam, uShadow; uniform float uTime;
      ${Ge}
      varying vec4 vQ; varying vec3 vK;
      ${et}
      ${xe}
      void main(){
        vec2 q = vQ.xy; float kind = vQ.z, sd = vQ.w, a;
        float yy = q.y*0.5 + 0.5;
        if (kind < 0.5) {                   // a ragged crown: many fine fingers of spray that break into drops, over a low wide lobe of mist
          // (the water fans outward as it rises; each finger is solid at its root, torn into shreds toward its tip and drops beyond it)
          float xs = q.x/(0.5 + 0.8*yy);
          float f1 = ibVN2(vec2(xs*4.0 + sd, 1.0 + sd)), f2 = ibVN2(vec2(xs*10.0 - sd*3.0, 5.0 + sd)), f3 = ibVN2(vec2(xs*23.0 + sd*7.0, 9.0 - sd));
          float top = max(mix(0.3, 1.0, smoothstep(0.2, 0.8, f1*0.5 + f2*0.32 + f3*0.18))*(1.0 - 0.6*min(xs*xs, 1.0)), 0.05), tt = yy/top;
          float tear = ibVN2(vec2(xs*31.0 + sd, yy*15.0 - vK.y*9.0))*0.6 + ibVN2(vec2(xs*67.0 - sd, yy*36.0 - vK.y*15.0))*0.4;
          float thr = mix(0.08, 0.7, smoothstep(0.3, 1.2, tt));
          float spray = smoothstep(thr, thr + 0.2, tear)*(1.0 - smoothstep(0.95, 1.4, tt))*(1.0 - smoothstep(0.55, 1.0, abs(xs)));
          float mist = (1.0 - smoothstep(0.0, 0.36, yy + (f2 - 0.5)*0.14))*(1.0 - smoothstep(0.35, 1.0, abs(q.x)))*0.46*(0.7 + 0.3*tear);
          a = min(max(spray*0.8, mist), 0.8);
        } else if (kind < 1.5) {            // round billow with an eroded rim
          float d = length(q) + (ibVN2(q*2.3 + sd + vec2(0.0, -uTime*0.06)) - 0.5)*0.55 + (ibVN2(q*5.5 - sd) - 0.5)*0.2;
          a = 1.0 - smoothstep(0.35, 0.85, d);
        } else {                            // a fumarole's plume: wide and soft from the foot up, torn into shreds, thinning as it rises
          float sway = (ibVN2(vec2(yy*2.2 - uTime*0.22 + sd, sd)) - 0.5)*0.7*yy;
          float w = mix(0.3, 0.95, yy);
          float body = 1.0 - smoothstep(w*0.12, w, abs(q.x - sway));
          float tex = ibVN2(vec2((q.x - sway)*2.6 + sd, yy*3.6 - uTime*0.5 + sd))*0.6 + ibVN2(vec2((q.x - sway)*6.5 - sd, yy*8.0 - uTime*0.9))*0.4;
          a = body*smoothstep(0.3, 0.85, tex + 0.3*(1.0 - yy))*smoothstep(0.0, 0.12, yy)*(1.0 - smoothstep(0.35, 1.0, yy));
        }
        a *= vK.x*(1.0 - smoothstep(0.8, 1.0, max(abs(q.x), abs(q.y))));
        if (a < 0.004) discard;
        float lit = clamp(0.62 + 0.3*q.x*vK.z + 0.25*q.y, 0.0, 1.0);
        vec3 col = mix(uShadow*uSkyCol*1.5, uSteam*uSunCol*0.95, lit);
        gl_FragColor = vec4(col, a);
        ${tt}
      }`});pt(M,n);const d=new a.Mesh(A,M);return d.name="puffs",d.frustumCulled=!1,d.renderOrder=4,d}function Xt(e,n,u,p){const c=new a.PlaneGeometry(2,2);c.deleteAttribute("normal"),c.deleteAttribute("uv");const h=[],g=[],N=[],S=[],I=[],x=e.fork("lobewisps"),m=e.fork("fringe");for(const i of n.slotLobes){const D=Math.hypot(i.ox,i.oz)||1,w=i.tone>.5?.5:0;for(let T=0;T<5;T++){let O=i.ox/D+x.range(-1.1,1.1),E=x.range(-.8,1),L=i.oz/D+x.range(-1.1,1.1);const V=Math.hypot(O,E,L)||1;h.push(i.x,i.y,i.z,i.r),g.push(i.phase,i.rate,x(),0+w),N.push(i.ox,i.oy,i.oz),S.push(O/V,E/V,L/V,x.range(.3,.5)),I.push(O/V,E/V,L/V)}}const A=e.fork("kidwisps");for(const i of n.kids){if(i.view)continue;const D=i.tone>.5?.5:0,w=Math.hypot(i.kx,i.ky,i.kz)||1;for(let T=0;T<2;T++){let O=i.kx/w+A.range(-1.2,1.2),E=i.ky/w+A.range(-1.2,1.2),L=i.kz/w+A.range(-1.2,1.2);const V=Math.hypot(O,E,L)||1;O/=V,E/=V,L/=V;const _=i.kw*.95/.94;h.push(i.x,i.y,i.z,i.r),g.push(i.phase,i.rate,A(),0+D),N.push(i.ox,i.oy,i.oz),S.push(i.kx/.94+O*_,i.ky/.94+E*_,i.kz/.94+L*_,i.kw*A.range(.5,.85)),I.push(O,E,L)}}for(const i of n.burstPuffs)h.push(i.x,0,i.z,i.size),g.push(0,i.reach,i.seed,1),N.push(i.dx,0,i.dz),S.push(0,0,0,0),I.push(0,1,0);for(let i=0;i<190;i++){const D=i<115,w=n.surgeSect+m.range(-1,1)*n.surgeSW;h.push(D?m.range(9,26):m.range(-10,-1),0,0,D?m.range(.9,1.5):m.range(.95,1.5)),g.push(0,0,m(),D?2:3),N.push(Math.cos(w),D?m.range(1.9,2.55):m.range(.12,.3),Math.sin(w)),S.push(0,0,0,0),I.push(0,1,0)}const M=g.length/4,d=new a.InstancedBufferGeometry;d.index=c.index,d.setAttribute("position",c.attributes.position),d.setAttribute("aCen",new a.InstancedBufferAttribute(new Float32Array(h),4)),d.setAttribute("aLb",new a.InstancedBufferAttribute(new Float32Array(g),4)),d.setAttribute("aOd",new a.InstancedBufferAttribute(new Float32Array(N),3)),d.setAttribute("aSd",new a.InstancedBufferAttribute(new Float32Array(S),4)),d.setAttribute("aNr",new a.InstancedBufferAttribute(new Float32Array(I),3)),d.instanceCount=M,d.boundingSphere=new a.Sphere(new a.Vector3(0,250,0),1200);const q=new a.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!1,uniforms:{uSteam:{value:p.steam.clone()},uShadow:{value:p.shadow.clone()},uAsh:{value:p.ash.clone()},uSurgeCol:u.uSurgeCol},vertexShader:`
      attribute vec4 aCen; attribute vec4 aLb; attribute vec3 aOd; attribute vec4 aSd; attribute vec3 aNr;
      uniform float uTime, uClock; uniform vec4 uSurge; uniform vec3 uSunDir;
      varying vec4 vQ; varying vec3 vK;      // vQ: quad xy, seed, alpha.  vK: tone (0 steam, 1 ash, 2 surge), sunward, sun across
      ${Fe}
      void main(){
        float kind = floor(aLb.w + 0.01), tone = fract(aLb.w + 0.01)*2.0, size, alpha, squash = 1.0;
        vec3 c, nrm;
        if (kind < 0.5) {
          float r = aCen.w, p = fract(aLb.x + uTime*aLb.y);
          float live = step(1e-5, aLb.y), env = mix(1.0, smoothstep(0.0, 0.3, p)*(1.0 - smoothstep(0.72, 1.0, p)), live), sc = mix(0.42, 1.0, env);
          c = aCen.xyz + live*(vec3(0.0, (p - 0.5)*r*1.6, 0.0) + aOd*(((env - 0.55)*0.45 - 0.35*(1.0 - env)*(1.0 - env))*r)) + aSd.xyz*(r*sc*0.94);
          size = r*sc*aSd.w; nrm = aNr; alpha = 0.8*smoothstep(0.45, 0.75, sc);
        } else if (kind < 1.5) {
          float vol = floor(uClock/3.0), ph = fract(uClock/3.0);
          float big = 1.0 + 0.4*step(mod(vol, 4.0), 0.5), e1 = 1.0 - exp(-ph*5.7);
          c = vec3(aCen.x, aCen.w*0.2, aCen.z) + aOd*(95.0*aLb.y*e1*big);
          size = aCen.w*(0.55 + 0.45*e1)*big; squash = 0.55; nrm = vec3(aOd.x*0.5, 0.85, aOd.z*0.5);
          alpha = 0.7*smoothstep(0.0, 0.07, ph)*(1.0 - smoothstep(0.45, 0.97, ph));
        } else {
          float rho = max(uSurge.x - aCen.x, 4.0), grow = clamp(rho*0.07 + 5.0, 6.0, 17.0);
          vec2 cxz = uSurge.zw + aOd.xz*rho;
          float dC = length(cxz), al = dot(cxz, vec2(${Ve}, ${Re})), pe = abs(dot(cxz, vec2(${ie}, ${re})));
          float inside = max(1.0 - smoothstep(168.0, 204.0, dC), smoothstep(-30.0, 50.0, al)*(1.0 - smoothstep(66.0, 104.0 + max(al - 150.0, 0.0)*0.3, pe)));
          float crest = step(kind, 2.5);
          c = vec3(cxz.x, grow*aOd.y, cxz.y); size = grow*aCen.w; squash = mix(0.42, 0.8, crest);
          alpha = uSurge.y*inside*mix(0.5, 0.66, crest); tone = 2.0;
          nrm = normalize(vec3(aOd.x*0.4, mix(0.3, 1.0, crest), aOd.z*0.4));
        }
        vec4 wc = modelMatrix*vec4(c, 1.0);
        vec3 toCam = cameraPosition - wc.xyz; float dist = length(toCam); toCam /= max(dist, 1e-3);
        if (kind < 0.5) alpha *= 1.0 - smoothstep(0.3, 0.8, abs(dot(nrm, toCam)));       // wisps show on the silhouette only
        alpha *= smoothstep(size*0.8 + 8.0, size*0.8 + 38.0, dist);                       // never a card at the lens
        vec3 right = cross(vec3(0.0, 1.0, 0.0), toCam); right = right/max(length(right), 1e-3); vec3 up = cross(toCam, right);
        wc.xyz += right*(position.x*size) + up*(position.y*size*squash);
        vQ = vec4(position.xy, aLb.z*31.0, alpha);
        vK = vec3(tone, smoothstep(-0.5, 0.6, dot(nrm, uSunDir)), dot(right, uSunDir));
        vec4 mvPosition = viewMatrix*wc; gl_Position = projectionMatrix*mvPosition;
        ${Ue}
      }`,fragmentShader:`
      uniform vec3 uSteam, uShadow, uAsh, uSurgeCol; uniform float uTime;
      ${Ge}
      varying vec4 vQ; varying vec3 vK;
      ${et}
      ${xe}
      void main(){
        vec2 q = vQ.xy; float sd = vQ.z;
        float n = ibVN2(q*1.9 + sd + vec2(0.0, -uTime*0.07))*0.6 + ibVN2(q*4.7 - sd + vec2(uTime*0.05, 0.0))*0.4;
        float d = length(q) + (n - 0.5)*0.95;
        float a = (1.0 - smoothstep(0.22, 0.8, d))*vQ.w*(1.0 - smoothstep(0.75, 1.0, max(abs(q.x), abs(q.y))));
        if (a < 0.004) discard;
        float lit = clamp(vK.y*(0.7 + 0.6*n) + 0.25*q.x*vK.z + 0.2*q.y, 0.0, 1.0);
        float skyL = dot(uSkyCol, vec3(0.3, 0.5, 0.2));
        vec3 steam = mix(mix(uShadow, vec3(dot(uShadow, vec3(0.3, 0.5, 0.2))), 0.3)*skyL*1.8, uSteam*uSunCol*0.93, lit);
        vec3 ash = mix(uAsh*0.9*uSkyCol*1.9, (uAsh*3.0 + 0.03)*uSunCol*1.1, lit);
        vec3 srg = uSurgeCol*(uSunCol*lit*0.95 + uSkyCol*0.8)*(0.8 + 0.3*n);
        vec3 col = vK.x > 1.5 ? srg : mix(steam, ash, clamp(vK.x, 0.0, 1.0));
        gl_FragColor = vec4(col, a);
        ${tt}
      }`});for(const i of["uTime","uClock","uSurge","uSunDir","uSunCol","uSkyCol","uNight"])q.uniforms[i]=u[i];const W=new a.Mesh(d,q);return W.name="softEdges",W.frustumCulled=!1,W.renderOrder=4,W}function Jt(e,n,u){const p=[],c=[],h=[],g=[],N=[],S=(M,d,q,W)=>{const i=p.length/3;for(let D=0;D<M.length;D++){const w=M[Math.max(0,D-1)],T=M[Math.min(M.length-1,D+1)],O=D/(M.length-1);let E=T[0]-w[0],L=T[1]-w[1],V=T[2]-w[2];const _=Math.hypot(E,L,V)||1;E/=_,L/=_,V/=_;for(let P=-1;P<=1;P+=2)p.push(M[D][0],M[D][1],M[D][2]),c.push(E,L,V),h.push(P,d,se(q,W,O));if(D>0){const P=i+D*2;g.push(P-2,P-1,P,P,P-1,P+1)}}},I=(M,d,q)=>{const W=n.trunkAxis(1,M),i=ot(M)*q;return[W[0]+Math.cos(d)*i,M,W[1]+Math.sin(d)*i]};for(let M=0;M<12;M++){const d=e.range(50,250),q=e.range(90,170),W=e()*6.283,i=e.range(-.9,.9),D=e.range(.72,.98),w=15,T=[];let O=0,E=0,L=0;for(let V=0;V<w;V++){const _=V/(w-1),P=I(d+q*_,W+i*_,D+.1*Math.sin(_*5+M));O+=e.range(-7,7),E+=e.range(-5,5),L+=e.range(-7,7),O*=.8,E*=.8,L*=.8,T.push([P[0]+O,P[1]+E,P[2]+L])}S(T,M,1,.75),N.push(new a.Vector3(T[7][0],T[7][1],T[7][2]));for(let V=0;V<2;V++){const _=T[e.int(3,11)],P=[e.range(-1,1),e.range(-.6,.9),e.range(-1,1)],R=[];let $=[_[0],_[1],_[2]];for(let ee=0;ee<7;ee++)R.push([$[0],$[1],$[2]]),$=[$[0]+P[0]*9+e.range(-5,5),$[1]+P[1]*9+e.range(-4,4),$[2]+P[2]*9+e.range(-5,5)];S(R,M,.6,.2)}}const x=new a.BufferGeometry;x.setAttribute("position",new a.Float32BufferAttribute(p,3)),x.setAttribute("aTan",new a.Float32BufferAttribute(c,3)),x.setAttribute("aSide",new a.Float32BufferAttribute(h,3)),x.setIndex(g),x.boundingSphere=new a.Sphere(new a.Vector3(87,220,96),400);const m=new a.ShaderMaterial({transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,side:a.DoubleSide,uniforms:{uBolt:u.uBolt,uFlashCol:{value:new a.Color("#D9C8FF")}},vertexShader:`
      attribute vec3 aTan; attribute vec3 aSide; uniform vec4 uBolt; varying vec2 vX;
      ${Fe}
      void main(){
        float s = abs(aSide.y - uBolt.x) < 0.5 ? uBolt.y : (abs(aSide.y - uBolt.z) < 0.5 ? uBolt.w : 0.0);
        vec4 wp = modelMatrix*vec4(position, 1.0);
        vec3 toCam = cameraPosition - wp.xyz; float dist = length(toCam);
        vec3 side = cross(mat3(modelMatrix)*aTan, toCam); side = side/max(length(side), 1e-3);
        wp.xyz += side*(aSide.x*max(2.2, dist*0.0045)*aSide.z*2.4);
        vFog = ibFogV(wp.xyz);
        vX = vec2(aSide.x, s*(1.0 - vFog.y));
        gl_Position = s > 0.003 ? projectionMatrix*viewMatrix*wp : vec4(2.0, 2.0, 2.0, 1.0);
      }`,fragmentShader:`
      uniform vec3 uFlashCol; varying vec2 vX;
      void main(){ float x = abs(vX.x); float core = 1.0 - smoothstep(0.12, 0.34, x); float halo = exp(-x*x*7.0)*(1.0 - smoothstep(0.7, 1.0, x));
        gl_FragColor = vec4(uFlashCol*(core*6.0 + halo*1.3)*vX.y, 1.0); }`}),A=new a.Mesh(x,m);return A.name="lightning",A.frustumCulled=!1,A.renderOrder=6,{mesh:A,mids:N}}function Zt(e,n,u){const h=[],g=[],N=[],S=[],I=Math.max(n.tanLean,.2);for(let M=0;M<2;M++){const d=h.length/3,q=e()*6,W=M?2350:1650,i=M?1300:980,D=M?-280:240;for(let w=0;w<=30;w++)for(let T=0;T<=10;T++){const O=w/30,E=T/10,L=O*2-1,V=W-400*L*L+Math.sin(O*5+q)*70,_=Math.min(n.colH*.8,480+V/I-.55*ct(500+V/I)),P=V+320*E*E,R=D+L*i;h.push(n.wind[0]*P-n.wind[1]*R,se(_,-6,E),n.wind[1]*P+n.wind[0]*R),g.push(O,E),N.push(M*3.7+.3)}for(let w=0;w<30;w++)for(let T=0;T<10;T++){const O=d+w*11+T,E=O+10+1;S.push(O,E,O+1,O+1,E,E+1)}}const x=new a.BufferGeometry;x.setAttribute("position",new a.Float32BufferAttribute(h,3)),x.setAttribute("uv",new a.Float32BufferAttribute(g,2)),x.setAttribute("aSheet",new a.Float32BufferAttribute(N,1)),x.setIndex(S);const m=new a.ShaderMaterial({transparent:!0,depthWrite:!1,side:a.DoubleSide,fog:!1,uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{uSlate:{value:new a.Color("#5B6470")}}]),vertexShader:`
      attribute float aSheet; varying vec4 vUv; varying vec3 vWp;
      ${Fe}
      void main(){ vUv = vec4(uv, mix(1.0, 0.4, smoothstep(40.0, 120.0, cameraPosition.y)), aSheet);      // thinner seen from inside the slot
        vec4 wp = modelMatrix*vec4(position, 1.0); vWp = wp.xyz; vFog = vec2(0.0);
        gl_Position = projectionMatrix*viewMatrix*wp;
      }`,fragmentShader:`
      uniform vec3 uSlate; uniform float uTime;
      ${Ge}
      varying vec4 vUv; varying vec3 vWp;
      ${Fe}
      ${xe}
      void main(){
        float u = vUv.x, v = vUv.y, sd = vUv.w;
        // one soft slate veil: slow heavier and thinner patches (as wide as they are tall, so they never line up into panes
        // or bands), and FALLING STREAKS: shafts of heavier fall 70 m wide and a few hundred metres long that slide down the
        // sheet. They are short, irregular and gentle (a fifth of the veil's weight), and melt away where one would be under
        // three pixels wide: the long ruled stripes they once were showed between the trunks as banding.
        float body = ibVN2(vec2(u*5.0 + sd*3.0 + v*1.7, v*2.6 - uTime*0.02))*0.65 + ibVN2(vec2(u*11.0 - v*2.0 + sd, v*5.5 - uTime*0.035))*0.35;
        float nz = ibVN2(vec2(u*9.0 + sd*5.0, v*4.0 + sd));
        float side = smoothstep(0.0, 0.44, min(u, 1.0 - u)*(0.8 + 0.4*nz));      // exactly nothing at both ends of both sheets
        float top = smoothstep(0.0, 0.42, v*(0.8 + 0.4*nz));                     // and at the top
        float su = u*28.0 + sd*9.0 + (nz - 0.5)*0.8, sk = 1.0 - smoothstep(0.12, 0.4, fwidth(su));
        float st = ibVN2(vec2(su, v*6.0 - uTime*0.16))*0.6 + ibVN2(vec2(su*2.3 + 5.0, v*11.0 - uTime*0.27))*0.4;
        float fall = mix(1.0, 0.8 + 0.2*smoothstep(0.3, 0.72, st), sk);
        float a = (0.72 + 0.28*smoothstep(0.2, 0.8, body))*fall*side*top*(1.0 - 0.3*smoothstep(0.7, 1.0, v));
        vec3 col = uSlate*(uSunCol*0.33 + uSkyCol*0.46)*mix(1.0, 1.07 - 0.14*smoothstep(0.3, 0.72, st), sk);      // (slate-blue, darker than the sky beside it: the jets stand black against it)
        // Haze by its true distance. The surge's mist is measured over the first 60 m of the sight line only, and any mist
        // there takes the curtain away (it is 2 km behind it). Measured at the curtain itself, the slow billow of the mist's
        // top (a pattern in world space, 130 m across) was printed on the sheet as faint upright bands 15 pixels apart.
        vec3 dv = vWp - cameraPosition; float dl = max(length(dv), 1.0), hz = dl*uHaze.w;
        float mist = ibFogV(cameraPosition + dv*(60.0/dl)).y;
        gl_FragColor = vec4(mix(col, uHaze.rgb, 1.0 - exp(-hz*hz)), a*0.74*vUv.z*pow(max(1.0 - mist, 0.0), 25.0));
      }`});for(const M of["uTime","uSunDir","uSunCol","uSkyCol","uNight"])m.uniforms[M]=u[M];const A=new a.Mesh(x,m);return A.name="ashCurtain",A.frustumCulled=!1,A.renderOrder=1,A}function Yt(e,n){const u=[],p=[],c=[],h=(I,x,m)=>{const A=u.length/3;for(let M=0;M<=x;M++)for(let d=0;d<=m;d++){const q=d%m/m*6.2832;u.push(Math.cos(q),0,Math.sin(q)),p.push(M/x,I,d/m)}for(let M=0;M<x;M++)for(let d=0;d<m;d++){const q=A+M*(m+1)+d,W=q+m+1;I>1.5?c.push(q,q+1,W,q+1,W+1,W):c.push(q,W,q+1,q+1,W,W+1)}};h(0,5,56),h(1,5,72),h(2,7,64);const g=new a.BufferGeometry;g.setAttribute("position",new a.Float32BufferAttribute(u,3)),g.setAttribute("aDat",new a.Float32BufferAttribute(p,3)),g.setIndex(c);const N=new a.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!1,uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{uSteam:{value:n.steam.clone()},uJade:{value:n.jade.clone()},uOchre:{value:n.ochre.clone()},uPit:{value:new a.Vector2(-ie*Me,-re*Me)}}]),vertexShader:`
      attribute vec3 aDat; uniform vec4 uSurge; uniform vec2 uPit; uniform float uWashY;
      varying vec3 vD; varying vec2 vXZ;
      ${Fe}
      void main(){
        float t = aDat.x; vec3 p;
        if (aDat.y < 0.5) { float r = mix(52.0, 138.0, t); p = vec3(uPit.x + position.x*r, uWashY - 5.0*(1.0 - smoothstep(0.0, 0.45, t)), uPit.y + position.z*r); }
        else if (aDat.y < 1.5) { float r = max(uSurge.x + mix(-150.0, 10.0, t), 1.0); p = vec3(uSurge.z + position.x*r, uWashY + 0.15, uSurge.w + position.z*r); }
        else { float r = 232.0*t; p = vec3(position.x*r, uWashY + 0.45, position.z*r); }       // the crater lake, as the climb sees it from above
        vD = aDat; vXZ = p.xz;
        vec4 mvPosition = modelViewMatrix*vec4(p, 1.0); gl_Position = projectionMatrix*mvPosition;
        ${Ue}
      }`,fragmentShader:`
      uniform vec3 uSteam, uJade, uOchre; uniform vec4 uSurge; uniform float uTime;
      uniform sampler2D uRelief; uniform vec2 uReliefR;
      ${Ge}
      varying vec3 vD; varying vec2 vXZ;
      ${et}
      ${xe}
      void main(){
        float t = vD.x, a; vec3 tintC = uSteam;
        if (vD.y > 1.5) {     // THE CRATER LAKE from above: milky jade water marbled darker and paler, sulphur-ochre threads and
          // foam lines drawn round the two vents. It is drawn for a high eye only (hi, as it always was: from the breach the sea's
          // own surface is the picture).
          float hi = smoothstep(50.0, 170.0, cameraPosition.y);
          float dC = length(vXZ), al = dot(vXZ, vec2(${Ve}, ${Re})), pe = abs(dot(vXZ, vec2(${ie}, ${re})));
          float n = ibVN2(vXZ*0.016 + vec2(uTime*0.012, 0.0))*0.8 + ibVN2(vXZ*0.047 - vec2(0.0, uTime*0.02))*0.2;
          vec2 kq = vXZ - vec2(${(ie*Me).toFixed(1)}, ${(re*Me).toFixed(1)}), wq = vXZ + vec2(${(ie*Me).toFixed(1)}, ${(re*Me).toFixed(1)});
          float rk = length(kq), rw = length(wq);
          float rings = ibVN2(vec2(rk*0.075 - uTime*0.25, atan(kq.y, kq.x + 1e-3)*2.0))*0.5 + ibVN2(vec2(rw*0.09 + uTime*0.2, atan(wq.y, wq.x + 1e-3)*2.0))*0.5;
          float thr = smoothstep(0.7, 0.8, ibVN2(vXZ*vec2(0.016, 0.085) + 7.0 + n));
          // the green of oxidised copper, deeper and darker toward the middle of the lake, paler and milkier in the shallows
          tintC = mix(uJade*0.68, uJade*1.05 + vec3(0.02, 0.05, 0.02), smoothstep(0.25, 0.8, n))*mix(0.72, 1.0, smoothstep(15.0, 150.0, dC + (n - 0.5)*40.0));
          tintC = mix(tintC, uSteam, 0.06);      // milky
          // by moonlight the water is a darker silver-jade, and the foam, the cascade and the streaks lie on it as they do by day
          tintC = mix(tintC, vec3(0.3, 0.46, 0.36)*(0.8 + 0.4*n), 0.55*uNight);
          tintC = mix(tintC, uOchre*0.9, thr*0.2);
          tintC = mix(tintC, vec3(0.2, 0.2, 0.2), 0.3*smoothstep(0.62, 0.8, ibVN2(vXZ*vec2(0.02, 0.11) + 19.0 + n)));      // threads of fallen ash
          // soft rings of foam drawn round the two vents
          float foam = smoothstep(0.6, 0.84, rings*0.7 + n*0.3)*(1.0 - 0.6*smoothstep(50.0, 170.0, min(rk, rw)));
          tintC = mix(tintC, uSteam, foam*0.5);
          // the sea pouring over the sill into the steam pit: white streaks running inward (the lake lies over the cascade's own ring)
          vec2 dw = wq/max(rw, 1e-3);
          float cs = ibVN(vec3(dw*9.0, rw*0.05 + uTime*0.9))*0.6 + ibVN(vec3(dw*23.0, rw*0.11 + uTime*1.7))*0.4;
          float casc = smoothstep(0.58, 0.84, cs + 0.3*(1.0 - smoothstep(50.0, 135.0, rw)))*(1.0 - smoothstep(92.0, 138.0, rw))*smoothstep(36.0, 54.0, rw);
          tintC = mix(tintC, uSteam, casc*0.6);
          a = hi*(0.72 + 0.2*foam)*max(1.0 - smoothstep(168.0, 196.0, dC + (n - 0.5)*30.0), smoothstep(-30.0, 50.0, al)*(1.0 - smoothstep(62.0, 96.0, pe + (n - 0.5)*24.0)))*(1.0 - smoothstep(0.86, 1.0, t));
          // THE SHEET ENDS WHERE THE LAKE DOES: it lies 1.35 m over the sea's mean level and so covered the wall's foot up to that
          // height, the cone's own surf (its swash and lace, between 1.6 m under the sea and 2 m over it) with it. Where the wall's
          // ground (the cone's relief map: its height in metres) comes up through the last 2.2 m under the sea's level the sheet
          // thins to nothing, by the ground alone, and the surf line shows round the lake's shore as it does from the water.
          a *= 1.0 - smoothstep(-2.4, -0.2, texture2D(uRelief, vec2(atan(vXZ.y, vXZ.x + 1e-4)*0.15915494, (dC - uReliefR.x)*uReliefR.y)).r);
        } else
        if (vD.y < 0.5) {     // the sea pouring over the sill into the steam pit: white streaks running inward
          float st = ibVN2(vec2(vD.z*150.0, t*5.0 + uTime*1.1))*0.6 + ibVN2(vec2(vD.z*420.0, t*11.0 + uTime*1.9))*0.4;
          a = smoothstep(0.62 - 0.5*(1.0 - t), 0.9 - 0.4*(1.0 - t), st + 0.25)*(1.0 - smoothstep(0.55, 1.0, t));
        } else {              // whitened, flattened sea under and behind the surge front
          float n = ibVN2(vXZ*0.09 + uTime*0.05)*0.6 + ibVN2(vXZ*0.31 - uTime*0.08)*0.4;
          a = smoothstep(0.0, 0.25, t)*(1.0 - smoothstep(0.9, 1.0, t))*(0.25 + 0.75*t)*smoothstep(0.2, 0.6, n + 0.35*t)*uSurge.y*0.9;
          a = max(a, smoothstep(0.74, 0.88, t)*(1.0 - smoothstep(0.93, 1.0, t))*smoothstep(0.1, 0.45, n + 0.25)*uSurge.y);
          float dC = length(vXZ), al = dot(vXZ, vec2(${Ve}, ${Re})), pe = abs(dot(vXZ, vec2(${ie}, ${re})));
          a *= mix(1.0, 0.06 + 0.62*smoothstep(0.42, 0.62, ibVN2(vXZ*0.021 + 3.0)*0.65 + ibVN2(vXZ*0.06 + 11.0)*0.35), smoothstep(60.0, 200.0, cameraPosition.y));
          a *= max(1.0 - smoothstep(175.0, 215.0, dC), smoothstep(-30.0, 50.0, al)*(1.0 - smoothstep(80.0, 125.0 + max(al - 150.0, 0.0)*0.3, pe)));
        }
        if (a < 0.004) discard;
        gl_FragColor = vec4(tintC*(uSunCol*0.62 + uSkyCol*0.4), a);
        ${tt}
      }`});for(const I of["uTime","uSurge","uWashY","uSunDir","uSunCol","uSkyCol","uNight","uRelief","uReliefR"])N.uniforms[I]=e[I];const S=new a.Mesh(g,N);return S.name="wash",S.frustumCulled=!1,S.renderOrder=2,S}async function to(e,n={}){const u=e.rng.fork("island-being-born"),p=e.quality?.detail??1,c=n.palette&&n.palette.length>=7?n.palette:It,h={cobalt:new a.Color(c[0]),jade:new a.Color(c[1]),ash:new a.Color(c[2]),steam:new a.Color(c[3]),shadow:new a.Color(c[4]),ochre:new a.Color(c[5]),bomb:new a.Color(c[6])},g=n.age??(u.chance(.3)?u.range(.05,.35):u.range(.7,1)),N=n.lean==="light"?12:n.lean==="strong"?40:typeof n.lean=="number"?n.lean:u.range(18,30),S={backH:se(82,150,g),hornH:se(40,62,g),breachW:se(255,196,g),rimR:230,baseR:se(322,336,g),innerW:85,rillF:u.range(11,17),o1:u.range(-50,50),o2:u.range(-50,50),scars:[]},I=Math.atan2(Re,Ve),x=u.int(3,5);for(let C=0;C<x;C++)S.scars.push({th:I+Math.PI+u.range(-1.9,1.9),w:u.range(.12,.26),depth:u.range(9,20)});const m={wind:[.8,-.6],tanLean:Math.tan(N*Math.PI/180),colH:n.columnHeight??6e3,sun:(n.sunDir?n.sunDir.clone():new a.Vector3(-.653,.469,.592)).normalize()},A=Vt(e.noise,S),M=[];for(let C=0;C<8;C++){let G,te;if(C<2){const oe=C?1:-1,he=u.range(150,205),Ke=oe*(S.breachW*.5+u.range(38,62));G=Ve*he+ie*Ke,te=Re*he+re*Ke}else{const oe=I+(C%2?1:-1)*u.range(.75,2.9),he=u.range(188,262);G=Math.cos(oe)*he,te=Math.sin(oe)*he}M.push({x:G,z:te,r:u.range(15,27)})}const d=new a.Vector3(ie*Me,0,re*Me),q=new a.Vector3(-ie*Me,0,-re*Me),W=(n.sunDir?n.sunDir.clone():new a.Vector3(-.653,.469,.592)).normalize(),i={uTime:{value:0},uClock:{value:0},uSeed:{value:u.range(0,100)},uVent:{value:d.clone()},uWind:{value:new a.Vector2(m.wind[0],m.wind[1])},uSurge:{value:new a.Vector4(ht,0,d.x,d.z)},uWashY:{value:n.washY??.9},uHaze:{value:new a.Vector4(.75,.84,.93,0)},uMist:{value:new a.Vector4(0,40,0,0)},uMistCyl:{value:new a.Vector4(0,0,1,0)},uMistCol:{value:new a.Color("#8C8A86")},uSurgeCol:{value:new a.Color("#ACAAA5")},uSunDir:{value:W},uSunCol:{value:new a.Color(1,1,1)},uSkyCol:{value:new a.Color(1,1,1)},uNight:{value:0},fine:p>=.8,uFlashPos:{value:[new a.Vector3,new a.Vector3]},uFlashI:{value:[0,0]},uBolt:{value:new a.Vector4(-1,0,-1,0)},uNearK:{value:0}},D={sunColor:new a.Color(n.sunColor??"#FFF4E0"),skyColor:new a.Color(n.skyColor??"#B9C0C8"),sunIntensity:n.sunIntensity??1,skyIntensity:n.skyIntensity??1};function w(C={}){C.sunDir&&i.uSunDir.value.copy(C.sunDir).normalize(),C.night!==void 0&&(i.uNight.value=C.night?1:0,C.night&&(D.sunColor.set("#A9BCE8"),D.sunIntensity=.38,D.skyIntensity=.16)),C.sunColor&&D.sunColor.set(C.sunColor),C.skyColor&&D.skyColor.set(C.skyColor),C.sunIntensity!==void 0&&(D.sunIntensity=C.sunIntensity),C.skyIntensity!==void 0&&(D.skyIntensity=C.skyIntensity),i.uSunCol.value.copy(D.sunColor).multiplyScalar(D.sunIntensity),i.uSkyCol.value.copy(D.skyColor).multiplyScalar(D.skyIntensity)}w({night:!!n.night});const T=new a.Group;T.name="island-being-born",await e.yield();const O=await Rt(e,A,S,M,i,h);T.add(O),await e.yield();const E=await Bt(e,u,m,i,h);T.add(E.mesh,E.farMesh,E.nearMesh,E.surge),await e.yield();const L=_t(i,h);T.add(L);const V=jt(u,i,h);T.add(V.mesh,V.glow),await e.yield();const _=Ut(u,i,h,M,A);T.add(_);const P=Jt(u,m,i);T.add(P.mesh),await e.yield(),n.curtain!==!1&&T.add(Zt(u,m,i)),n.seaFoam!==!1&&T.add(Yt(i,h)),await e.yield(),T.add(Xt(u.fork("soft"),m,i,h)),await e.yield(),T.traverse(C=>{C.material&&C.material.uniforms&&(C.material.uniforms.uHaze=i.uHaze,C.material.uniforms.uMist=i.uMist,C.material.uniforms.uMistCyl=i.uMistCyl,C.material.uniforms.uMistCol=i.uMistCol)});let R=null,$=1,ee=!1,fe=1;const Le=i.uSeed.value,Ce=(C,G)=>{const te=Math.sin(C*127.1+G*311.7+Le)*43758.5453;return te-Math.floor(te)},ce={active:!1,radius:ht,height:0,strength:0,center:d.clone()};function ue(C){const G=C-St,te=G-Math.floor(G/(lt*dt))*lt*dt;return ce.radius=ht+bt*te,ce.strength=B(0,.9,te)*(1-B(gt-2.6,gt-.1,te)),ce.height=J(ce.radius*.085+9,11,31)*1.35*ce.strength,ce.active=ce.strength>.01,ce}const le={period:lt,bigEvery:dt,surgeDelay:St,surgeSpeed:bt,surgeLife:gt,surgeR0:ht,flightBig:18.5,clockAtBriefTime:C=>C+24.5},ke=new a.Vector3,Pe=new a.Vector3;function Se(C,G,te){const oe=R??G;i.uTime.value=G,i.uClock.value=oe;const he=ue(oe);i.uSurge.value.x=he.radius,i.uSurge.value.y=he.strength;const Ke=Math.floor(oe/.75);for(let me=0;me<2;me++){const pe=Ke-me,Ee=Ce(pe,1)<.86,we=oe-(pe*.75+Ce(pe,2)*.3);let be=0;Ee&&we>0&&(be=(we<.1?B(0,.1,we):Math.exp(-(we-.1)/.11))*(.6+.4*Ce(pe,4))*$);const ge=Math.floor(Ce(pe,3)*12)%12;me===0?(i.uBolt.value.x=ge,i.uBolt.value.y=be):(i.uBolt.value.z=ge,i.uBolt.value.w=be),i.uFlashPos.value[me].copy(P.mids[ge]).applyMatrix4(T.matrixWorld),i.uFlashI.value[me]=be*1.6}te&&te.getWorldPosition(ke)}const Ae=Math.cos(58*Math.PI/180),Te=Math.sin(58*Math.PI/180),We={ventK:d.clone(),ventW:q.clone(),breachDir:new a.Vector3(Ve,0,Re),jetsMid:new a.Vector3(d.x+20,200,d.z+20),slotMid:new a.Vector3(0,250,0),portalSeat:{position:new a.Vector3(37,430,-33),normal:new a.Vector3(-.74*Ae,-Te,.67*Ae).normalize(),radius:9,pitchDeg:58},roof:new a.Vector3(123,617,-111),flyThrough:Wt.map(C=>new a.Vector3(C[0],C[1],C[2])),viewpoints:{entry:new a.Vector3(-120,2.4,800),jadeLine:new a.Vector3(-150,2.4,470),heldBreath:new a.Vector3(-246,2.8,223),slotBase:new a.Vector3(-150,40,136)}};return{object:T,radius:340,height:560,center:new a.Vector3(0,200,0),anchors:We,update:Se,dispose(){},ground:!0,groundY:0,setClock(C){R=C},setBriefTime(C){R=le.clockAtBriefTime(C)},setNear(C){ee=!!C,E.nearMesh.visible=ee,E.farMesh.visible=!ee,i.uNearK.value=ee?fe:0},setNearGrow(C){fe=C,i.uNearK.value=ee?fe:0},setSurgeShown(C){E.surge.geometry.setDrawRange(0,C?1/0:0)},setLight:w,setLightningGain(C){$=C},setWashHeight(C){i.uWashY.value=C},setHaze(C,G){i.uHaze.value.set(C.r,C.g,C.b,G)},setMist(C,G,te,oe){i.uMist.value.x=C,i.uMist.value.y=G,te&&i.uMistCol.value.copy(te),Pe.copy(d).applyMatrix4(T.matrixWorld),i.uMistCyl.value.set(Pe.x,Pe.z,oe??1e5,0)},setSurgeColor(C){i.uSurgeCol.value.copy(C)},surge:ue,surgeArrival(C,G){return Math.max(0,(Math.hypot(C-d.x,G-d.z)-ht)/bt)},heightAt:A,timeline:le,uniforms:i,params:{age:g,leanDeg:N,breachWidth:S.breachW,coneHeight:S.backH,wind:m.wind.slice(),detail:p,turrets:m.kids.length,creaseTurrets:m.creaseKids,climbTurrets:m.climbKids,lineTurrets:m.lineKids,lowLobes:m.lowLobes,upLobes:m.upLobes,topLobes:m.topLobes,slotLobes:m.slotLobes.length,nearTriangles:E.nearMesh.geometry.index.count/3},trunkRadius:ot,slotHalfWidth:zt}}export{to as buildHero};
