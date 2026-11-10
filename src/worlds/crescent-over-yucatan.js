import*as w from"three";import{makePath as V0,clamp as i0,lerp as Y,smoothstep as G}from"../kit/core.js";import{makeSky as N0,makeCloudField as D0}from"../kit/sky.js";import{buildHero as W0,buildMosasaur as q0,strangerAt as E0,STRANGER_UNIFORMS_GLSL as M0,STRANGER_GLSL as U0,S_NOISE_GLSL as S0,SEA_GLSL as k0,DEFAULT_PALETTE as I0}from"../parts/crescent-over-yucatan.js";const l0=Math.PI/180,h0=t=>new w.Color(t),f0=(t,o,l)=>new w.Vector3(t,o,l),R0=(t,o)=>f0(Math.sin(t*l0)*Math.cos(o*l0),Math.sin(o*l0),-Math.cos(t*l0)*Math.cos(o*l0)),T0={morning:{sunEl:13,zenith:"#2463BC",mid:"#4C92D8",horizon:"#DCEBEC",sunCol:"#FFE7B0",sunI:2.3,hemiI:.95,hemiSky:"#9CCBEA",skyTop:"#5E9FD6",skyHor:"#DCEBEC",fog:"#D3E4E8",fogD:3e-4,wind:0,soft:0,sBright:1.95,sCover:.97,moonBright:1.6,dusk:"#3D5E86",turq:"#3FC6C0",deep:"#0F7F93",sunDisc:11,cloudLit:"#FFEFD8",cloudShade:"#7F97AD",exposure:.93,sunSea:"#FFDC9C",tide:1,sunSky:"#FFD58C",scat:"#FFDDA8"},firstLight:{sunEl:-2.2,zenith:"#3F5E96",mid:"#8C9CC4",horizon:"#F3C9B8",sunCol:"#FFB7A0",sunI:1,hemiI:1.15,hemiSky:"#93A6CE",skyTop:"#4A6BA6",skyHor:"#F1CDBE",fog:"#D9BFC0",fogD:34e-5,wind:0,soft:0,sBright:2,sCover:.97,moonBright:1.7,dusk:"#4B5486",turq:"#63AFB2",deep:"#27647C",sunDisc:0,cloudLit:"#FFC9B4",cloudShade:"#66739A",exposure:1.06,sunSea:"#FFC2AE",tide:1},midMorning:{sunEl:35,zenith:"#215FBE",mid:"#488DD6",horizon:"#CFE6EE",sunCol:"#FFF0D2",sunI:2.3,hemiI:1,hemiSky:"#9CCBEA",skyTop:"#4B90D8",skyHor:"#D2E8EE",fog:"#C9E0EA",fogD:26e-5,wind:1,soft:0,sBright:1.85,sCover:.96,moonBright:1.5,dusk:"#3A5C8C",turq:"#38C8C4",deep:"#0C7C98",sunDisc:12,cloudLit:"#FFFDF6",cloudShade:"#8498B2",exposure:.92,sunSea:"#FFF3DA",tide:.5},pearl:{sunEl:13,zenith:"#7FA9CE",mid:"#B4CFE0",horizon:"#EAEDE6",sunCol:"#FFE9C4",sunI:1.9,hemiI:1.15,hemiSky:"#B9D3E2",skyTop:"#86AED2",skyHor:"#E9EDE8",fog:"#E2E8E4",fogD:5e-4,wind:0,soft:.1,sBright:1.45,sCover:.93,moonBright:1.3,dusk:"#5E7890",turq:"#4CC4BC",deep:"#1A8094",sunDisc:7,cloudLit:"#FFF6E8",cloudShade:"#93A5B4",exposure:1,sunSea:"#FFEBCB",tide:.9}},F0=`
vec3 seaThrough(vec3 col, vec3 wp){
  float depth = max(-wp.y, 0.);
  vec3 toCam = uCamL - wp; float dist = length(toCam);
  float vy = abs(toCam.y) / max(dist, 1e-3);
  float path = depth / max(vy, 0.07) + depth * 0.6;
  vec3 T = exp(-path * vec3(0.145, 0.027, 0.029));
  vec3 scatter = mix(uTurq, uDeep * 0.74 + vec3(0., 0.004, 0.03), smoothstep(5., 46., path)) * (0.55 + 0.09 * uSea.y) * mix(vec3(1.), vec3(1.14, 1.05, 0.86), clamp(uSea.y * 0.4, 0., 0.85)) * (1. - 0.30 * cloudSh(wp.xz));   // (polish 3) the deep water is darker and bluer; cloud shade dulls the glow
  return col * T + scatter * (1. - exp(-path * 0.032));
}
vec3 keepWarm(vec3 wp){
  float depth = max(-wp.y, 0.);
  vec3 toCam = uCamL - wp;
  float vy = abs(toCam.y) / max(length(toCam), 1e-3);
  float path = min(depth / max(vy, 0.07) + depth * 0.6, 40.);
  return min(exp(path * vec3(0.074, 0.004, -0.016)), vec3(2.3, 1.1, 1.));
}
vec3 seaLight(vec3 wp, float sunShade, float strShade, float up){
  float depth = max(-wp.y, 0.);
  float wet = smoothstep(0.0, 0.25, depth);
  float dist = length(uCamL - wp);
  float ca = sCaus(wp.xz * 1.7, uSea.z) * min(2.4 / (1. + dist * 0.035), 1.) * wet * exp(-depth * 0.05);
  float cl = cloudSh(wp.xz);
  vec3 l = uSunCol * uLit.x * (0.20 + (0.62 + 0.62 * ca) * sunShade * (1. - 0.72 * cl) * mix(1., up, 1. - wet)) + uFill * uLit.y * (0.55 + 0.45 * up);
  l += uSHot * vec3(1.0, 0.90, 0.70) * uSea.y * (0.04 + (0.23 + 0.33 * ca) * strShade) * mix(1., 0.48, wet);      // (polish 4: gold on the sand, not white; and a light 10 degrees up mostly glances off the sea: the bed under water takes half of it, so the sea keeps its colour)      // (polish 4: gold on the sand, not white)
  l += uSkyHor * 0.62 * (1. - wet) * (1. - uLit.w);                 // before sunrise the dry sand takes the bright horizon sky
  return l;
}
`,C0=`uniform vec4 uLit; uniform vec3 uFill; uniform vec4 uShad[16]; uniform vec3 uStrL;
// (polish 3) the shadows of the horizon's cumulus: with the Sun 13 degrees up they lie kilometres from their clouds, in long soft
// bands drawn out down the light, and drift slowly; 1 in shade. No Sun, no shadows (uLit.w).
float cloudSh(vec2 p){
  vec2 sd = normalize(uSunDir.xz + vec2(1e-4, 0.));
  vec2 q = vec2(dot(p, sd) * 0.30, p.x * sd.y - p.y * sd.x);
  float c = sVN(q * 0.0105 + vec2(uSea.z * 0.004, uSea.w)) * 0.62 + sVN(q * 0.027 + vec2(3.1, uSea.z * 0.006)) * 0.38;
  return smoothstep(0.50, 0.66, c) * uLit.w;
}`,A0=.34;function _0(t){const o=t.length,l=t.posAtDist(A0*o),d=t.tangentAtDist(A0*o).clone().setY(0).normalize(),x=-d.z,L=d.x,v=Math.cos(104*l0),a=Math.sin(104*l0),c=150,r=s=>{const b=s-A0,e=Math.max(b-.018,0),z=2600*e*e/(1+14*e),p=6.7+c*b*v+z,h=-.4+c*b*a-.25*z;return[l.x+d.x*p+x*h,l.z+d.z*p+L*h]};return function(b,e={}){const z=r(b-.004),p=r(b+.004),h=r(b),i=b-A0;return e.x=h[0],e.z=h[1],e.heading=Math.atan2(p[0]-z[0],p[1]-z[1]),e.surfaced=G(-.095,-.045,i)*(1-G(.022,.06,i)),e.breath=i0((i+.02)/.05,0,1),e.dive=G(.018,.034,i)*(1-G(.06,.09,i)),e}}function H0(t){const o=G;return 1.05+(.68-1.05)*o(.2,.27,t)+(.84-.68)*o(.385,.44,t)+(1.42-.84)*o(.55,.62,t)+(1-1.42)*o(.88,.97,t)}var kt={id:"crescent-over-yucatan",name:"The Growing Crescent",category:"prehistoric",media:["air","water"],weirdness:.3,async build(t){const o=t.rng,l=t.quality?.detail??1,d=t.vary||{},x=i0(d.density??1,.7,1.3),L=o.fork("variation"),v=d.hour||"any";let a=L.pick(["midMorning","morning","firstLight","pearl","morning"]);v==="dawn"||v==="night"?a="firstLight":v==="day"?a=L.chance(.6)?"midMorning":"pearl":v==="golden"&&(a="morning");const c=T0[a],r=!!d.rare,s=o.fork("cast"),b=s.chance(.45),e=s.int(4,12),z=s.chance(.5),p=I0.slice();p[0]=c.turq,p[1]=c.deep;const h=R0(40,c.sunEl),i=new w.Scene;i.fog=new w.FogExp2(h0(c.fog),c.fogD);const M=await W0(t,{palette:p,detail:l,stage:!1,sunDir:h,rareEvent:r,soft:c.soft,skyRadius:6e3,strangerBright:c.sBright,strangerCover:c.sCover,moonBright:c.moonBright,moonCover:.9,dusk:c.dusk,skyTop:c.skyTop,skyHorizon:c.skyHor,sunColor:c.sunSea,depth:5});i.add(M.object),await t.yield();const g=M.anchors,n=V0(g.flyThrough),S=g.portalSeat.position.clone(),D=n.endTangent.clone().setY(0).normalize(),N=f0(-D.z,0,D.x),E=N0({rng:o,preset:"day",zenith:c.zenith,mid:c.mid,horizon:c.horizon,ground:h0(c.turq).lerp(h0(c.deep),.45),horizonPow:7,midPow:1.1,groundFalloff:30,sunElevation:c.sunEl,sunAzimuth:40,sunColor:c.sunSky||c.sunCol,sunSize:.9,sunIntensity:c.sunDisc,sunGlow:a==="firstLight"?1.2:.42,sunGlowTight:.8,scatter:a==="firstLight"?.75:.34,scatterColor:a==="firstLight"?"#FF9E8A":c.scat||"#FFE9C0",clouds:!1,clouds2:!1,fogColor:c.fog});i.add(E.object),await t.yield();const C=new w.HemisphereLight(h0(c.hemiSky),h0(c.turq).multiplyScalar(.55),c.hemiI),A=new w.DirectionalLight(h0(c.sunCol),c.sunI);A.position.copy(R0(40,Math.max(c.sunEl,7))).multiplyScalar(400);const q=new w.DirectionalLight(h0(p[6]),0);q.position.copy(g.strangerDir(0)).multiplyScalar(400),i.add(C,A,A.target,q,q.target);const I=M.seaUniforms;I.uLit={value:new w.Vector4(c.sunI/2.3*(c.sunEl<0?.55:1),c.hemiI,c.wind,0)},I.uFill={value:h0(c.hemiSky).multiplyScalar(.34)},I.uShad={value:Array.from({length:16},()=>new w.Vector4(0,-999,0,0))},I.uStrL={value:g.strangerDir(0)};const T={ctx:t,rng:o,detail:l,density:x,look:c,lookName:a,pal:p,U:I,path:n,sunDir:h,portalPos:S,endDir:D,endRight:N,scene:i,hero:M,A:g};return Object.assign(T,{sky:E,hemi:C,sun:A,second:q,rare:r,juvenile:b,nPtero:e,manyAmmonites:z}),yt(T)}};function G0(t){const{rng:o,portalPos:l,endDir:d,endRight:x,ctx:L}=t,v=L.noise,a=o.fork("ground"),c=[],r=[[-1,174,4.8],[12.5,150,5.6],[5,118,3.6],[23,84,4.4],[16,36,3.8],[26,-32,4.4],[-4,-18,3.6],[34,-150,4.2],[5,-172,4.6],[19,-204,4],[-20,-236,3.6],[8,-268,4.4],[0,-134,3.8],[-9,-197,4.2],[14,-176,3.6],[-31,-258,4.2],[-28,-286,3.8],[25,-171,5.4],[31,-181,4.4],[7,-188,5]];for(const y of r)c.push({x:y[0]+a.range(-2.5,2.5),z:y[1]+a.range(-5,5),r:y[2]*a.range(.9,1.15),h:a.range(2.7,3.3),ph:a.range(0,6.28)});const s=[l.clone().addScaledVector(x,58).addScaledVector(d,3),l.clone().addScaledVector(x,-58).addScaledVector(d,3)],b=y=>-34-175*G(120,290,-y)+21*G(-66,-30,y)*(1-G(74,104,y))+9*Math.sin(y*.021+1.3)*(1-G(-66,104,y)*(1-G(60,104,y))*.8),e=t.path.length,z=t.path.posAtDist(.53*e),p=t.path.tangentAtDist(.53*e).clone().setY(0).normalize(),h=Math.cos(-32*l0),i=Math.sin(-32*l0),M={x:z.x,z:z.z,ax:p.x*h-p.z*i,az:p.x*i+p.z*h,tx:p.x,tz:p.z};let g=1;function n(y,W){let k=0;{const R=y-M.x,P=W-M.z;if(R*R+P*P<6400){const _=R*M.ax+P*M.az,e0=R*M.az-P*M.ax,m=3*Math.sin(_*.11+.7)+1.6*Math.sin(_*.27+2),V=Math.max(Math.abs(_-4)-27,0),f=Math.sqrt(V*V*2.4+(e0-m)*(e0-m)*5);k=.8*(1-G(4,34,f))}}if(W>l.z+92||W<l.z-96)return k;for(let R=0;R<2;R++){const P=y-s[R].x,_=W-s[R].z,e0=P*x.x+_*x.z,m=P*d.x+_*d.z,V=3.5*Math.sin(e0*.09+R*2.1)+2*Math.sin(e0*.23+R),f=45,u=Math.max(Math.abs(e0)-f,0),U=Math.sqrt(u*u*6.5+(m-V)*(m-V)*5.5);k=Math.max(k,1-G(4,34,U))}return k}const S=[{ax:-78,az:8,bx:104,bz:-108,w:10.5,d:-10.2},{ax:-150,az:-198,bx:120,bz:-292,w:9.5,d:-9.8},{ax:62,az:300,bx:150,bz:60,w:12,d:-10.5}];for(const y of S)y.dx=y.bx-y.ax,y.dz=y.bz-y.az,y.il=1/(y.dx*y.dx+y.dz*y.dz);const D=[{x:47,z:168,rx:20,rz:46,top:-.9},{x:44,z:18,rx:17,rz:34,top:-1.1},{x:-24,z:-118,rx:13,rz:26,top:-1.1},{x:40,z:-176,rx:17,rz:36,top:-1},{x:-52,z:-206,rx:16,rz:30,top:-1},{x:96,z:-40,rx:26,rz:50,top:-.9}];function N(y,W,k){const R=y+7*v.n2(y*.021+31,W*.021),P=W+7*v.n2(y*.021,W*.021+17);for(const _ of D){const e0=(R-_.x)/_.rx,m=(P-_.z)/_.rz,V=1-e0*e0-m*m;V>0&&(k=Y(k,Math.max(k,_.top-.5*(1-V)),G(0,.5,V)))}for(const _ of S){const e0=i0(((R-_.ax)*_.dx+(P-_.az)*_.dz)*_.il,0,1),m=_.ax+_.dx*e0-R,V=_.az+_.dz*e0-P,f=(m*_.dz-V*_.dx)*Math.sqrt(_.il),u=e0>0&&e0<1?Math.abs(f+6*Math.sin(e0*9+_.w)):Math.sqrt(m*m+V*V);u<_.w*2.7&&(k=Y(k,Math.min(k,_.d),1-G(_.w*.15,_.w*2.6,u)))}return k}function E(y,W){let k=-4.9+.95*v.fbm2(y*.018+3,W*.018,3)+.1*v.n2(y*.16,W*.16);k=N(y,W,k);let R=y-b(W)+7*v.n2(y*.028,W*.028+9);R>-56&&R<14&&(R+=5*v.n2(y*.085+2,W*.085));const P=1-G(-46,4,R);let _=Y(k,-30,Math.pow(P,1.7));const e0=G(190,250,y+14*v.n2(W*.012,5.5));_=Y(_,-22,e0);for(const V of c){const f=y-V.x,u=W-V.z,U=f*f+u*u,F=V.r*1.5;if(U>F*F)continue;const H=1+.22*Math.sin(Math.atan2(u,f)*3+V.ph)+.12*Math.sin(Math.atan2(u,f)*7+V.ph*2),B=Math.sqrt(U)/(V.r*H),j=Math.pow(Math.max(1-B*B*.62,0),1.6);_=Math.max(_,Math.min(_+V.h*j*(1+.1*v.n2(y*.9,W*.9)),-1.5))}const m=n(y,W);if(m>0){const V=m*m*(3-2*m);let f=-3.4+4.75*Math.pow(V,.8)+.12*v.n2(y*.12,W*.12)*V;const u=Math.abs((y-M.x)*-M.tz+(W-M.z)*M.tx),U=(y-M.x)*(y-M.x)+(W-M.z)*(W-M.z)<6400?G(4.5,13,u):1,F=v.n2(y*.062+11,W*.062-4);f+=.62*V*V*G(-.35,.55,F)*U*g,_=Y(_,Math.max(_,f),G(0,.3,m))}return _}const C=(y,W)=>{let k=v.fbm2(y*.021+40,W*.021-7,2)*.75+.35*v.n2(y*.075+3,W*.075)+.07;const R=y-l.x,P=W-l.z,_=Math.abs(R*x.x+P*x.z),e0=Math.abs(R*d.x+P*d.z);return _<120&&e0<56&&(k-=.5*(1-G(28,56,e0))*(1-G(96,120,_))),k},A=(y,W,k)=>G(-5.3,-9,k+1.6*v.n2(y*.05+3,W*.05))*(1-G(-12,-21,k))*(.62+.55*v.n2(y*.085+7,W*.085)),q=(y,W,k)=>Math.max(i0((C(y,W)-.5)*3.2+.5,0,1),A(y,W,k));function I(y,W){let k,R;y>=-82?(R=2,k=-82+2*Math.floor((y+82)/2)):(R=4,k=-82-4*Math.ceil((-82-y)/4));const P=-430+2.5*Math.floor((W+430)/2.5),_=(y-k)/R,e0=(W-P)/2.5;if(y>46||y<-178||W<-430||W>262)return E(y,W);const m=E(k,P),V=E(k+R,P),f=E(k,P+2.5),u=E(k+R,P+2.5);return _+e0<=1?m+_*(V-m)+e0*(f-m):u+(1-_)*(f-u)+(1-e0)*(V-u)}return{mounds:c,armC:s,heightAt:E,surfAt:I,baseSurfAt:(y,W)=>{g=0;const k=I(y,W);return g=1,k},grassAt:C,grassMask:q,slopeGrass:A,cayAt:n,edgeAt:b,spit:M}}async function K0(t,o){const a=new Uint8Array(90112);for(let r=0;r<176;r++){for(let s=0;s<128;s++){const b=-420+(s+.5)*6,e=-700+(r+.5)*6,z=o.heightAt(b,e),p=(r*128+s)*4;a[p]=Math.round(i0(-z/32,0,1)*255);const h=1-G(-1.6,-.2,z);a[p+1]=Math.round(i0((o.grassAt(b,e)-.5)*3.2+.5,0,1)*h*255),a[p+2]=Math.round(i0(o.slopeGrass(b,e,z),0,1)*255),a[p+3]=255}r%2===0&&await t.ctx.yield()}const c=new w.DataTexture(a,128,176,w.RGBAFormat,w.UnsignedByteType);c.magFilter=w.LinearFilter,c.minFilter=w.LinearFilter,c.wrapS=c.wrapT=w.ClampToEdgeWrapping,c.generateMipmaps=!1,c.needsUpdate=!0,t.U.uChart={value:c},t.U.uChartBox={value:new w.Vector4(-420,-700,1/768,1/1056)}}async function j0(t,o){const{ctx:l,U:d,sunDir:x}=t,{heightAt:L,mounds:v}=o,a=[],c=[];for(let A=-82;A<=46;A+=2)a.push(A);for(let A=-86;A>=-178;A-=4)a.unshift(A);for(let A=2.5,q=46+A;q<3200;A*=1.28,q+=A)a.push(q);for(let A=4.5,q=-178-A;q>-3200;A*=1.28,q-=A)a.unshift(q);for(let A=-430;A<=262;A+=2.5)c.push(A);for(let A=3,q=3;q<3200;A*=1.3,q+=A)c.push(262+q),c.unshift(-430-q);const r=a.length,s=c.length,b=new Float32Array(r*s*3),e=new Float32Array(r*s*4),z=new Float32Array(r*s*3),p=f0(x.x,0,x.z).normalize(),h=Math.asin(i0(x.y,.05,1)),i=Math.tan(Math.asin(Math.cos(h)/1.33)),M=1/Math.tan(h),g=(A,q,I,T,y,W)=>{let k=1;for(let R=1;R<=5;R++){const P=R*.9,_=I+P/W;if(_>-1.2&&I<-.3)break;const e0=L(A+T*P,q+y*P);k=Math.min(k,i0(1-(e0-_)*1.6,0,1))}return k},n=(A,q)=>{for(const I of v){const T=A-I.x,y=q-I.z;if(T*T+y*y<(I.r*1.5+6)*(I.r*1.5+6))return I}return null};for(let A=0;A<s;A++){for(let q=0;q<r;q++){const I=a[q],T=c[A],y=A*r+q,W=L(I,T);b[y*3]=I,b[y*3+1]=W,b[y*3+2]=T;const k=Math.abs(I)<60?n(I,T):null;let R=0,P=3;if(k){const m=Math.hypot(I-k.x,T-k.z)/k.r;R=1-G(.75,1.25,m),P=Math.min(m,3)}const _=G(-15,-25,W),e0=G(-1.6,-.2,W);e[y*4]=i0((o.grassAt(I,T)-.5)*3.2+.5,0,1)*(1-R)*(1-e0)*(1-.75*_),e[y*4+1]=P,e[y*4+2]=k||W>-3?g(I,T,W,p.x,p.z,W>0?M:i):1,e[y*4+3]=k?g(I,T,W,0,-1,.93):1}await l.yield()}await l.yield();for(let A=0;A<s;A++){const q=Math.max(A-1,0),I=Math.min(A+1,s-1);for(let T=0;T<r;T++){const y=Math.max(T-1,0),W=Math.min(T+1,r-1),k=A*r+T,R=(b[(A*r+W)*3+1]-b[(A*r+y)*3+1])/(a[W]-a[y]),P=(b[(I*r+T)*3+1]-b[(q*r+T)*3+1])/(c[I]-c[q]),_=1/Math.sqrt(R*R+P*P+1);z[k*3]=-R*_,z[k*3+1]=_,z[k*3+2]=-P*_}A%60===0&&await l.yield()}await l.yield();const S=new Uint32Array((r-1)*(s-1)*6);let D=0;for(let A=0;A<s-1;A++)for(let q=0;q<r-1;q++){const I=A*r+q,T=I+1,y=I+r,W=y+1;S[D++]=I,S[D++]=y,S[D++]=T,S[D++]=T,S[D++]=y,S[D++]=W}await l.yield();const N=new w.BufferGeometry;N.setAttribute("position",new w.BufferAttribute(b,3)),N.setAttribute("normal",new w.BufferAttribute(z,3)),N.setAttribute("aBed",new w.BufferAttribute(e,4)),N.setIndex(new w.BufferAttribute(S,1)),await l.yield();const E=new w.ShaderMaterial({uniforms:d,fog:!0,vertexShader:O0,fragmentShader:X0}),C=new w.Mesh(N,E);return C.name="seabed",C.frustumCulled=!1,C}const O0=`
  attribute vec4 aBed;
  varying vec3 vPos; varying vec4 vBed; varying vec3 vNor;
  #include <fog_pars_vertex>
  void main(){
    vPos = position; vBed = aBed; vNor = normal;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`,$0=`
uniform vec4 uShadK;      // run per metre: Sun in air, Sun under water, stranger in air, stranger under water
vec2 flierShadows(vec3 wp){
  float depth = max(-wp.y, 0.), top = max(wp.y, 0.);
  vec2 sh = normalize(uSunDir.xz + vec2(1e-4, 0.));
  vec2 st = normalize(uStrL.xz + vec2(0., -1e-4));
  float a = 0., b = 0.;
  for (int i = 0; i < 16; i++) {
    vec4 f = uShad[i];
    float above = max(f.y - top, 0.);
    float w = max(f.w, 0.01);
    vec2 d1 = wp.xz - (f.xz - sh * (above * uShadK.x + depth * uShadK.y));
    float e1 = length(vec2(d1.x / (w * 1.5), d1.y / (w * 0.9)));
    a = max(a, (1. - smoothstep(0.25, 1.25, e1)) * step(-100., f.y));
    vec2 d2 = wp.xz - (f.xz - st * (above * uShadK.z + depth * uShadK.w));
    float al = dot(d2, st) / 1.5, ac = d2.x * st.y - d2.y * st.x;          // along the light (drawn out a little), and across it
    float sx = abs(ac) / w;
    float body = length(vec2(ac / (w * 0.15), (al - 0.05 * w) / (w * 0.46)));
    float wing = abs(al + w * (0.30 * sx * sx - 0.06)) / (w * 0.21 * max(1. - sx, 0.) * (0.55 + 0.45 * sx) * 2. + 1e-3) + step(1., sx) * 9.;
    b = max(b, (1. - smoothstep(0.80, 1.0, min(body, wing))) * step(-100., f.y));
  }
  return vec2(a, b);
}
uniform vec4 uSw[6];       // x, y (under the surface, negative), z, half length of each turtle
float swimShadows(vec3 wp){
  vec2 sh = normalize(uSunDir.xz + vec2(1e-4, 0.));
  float a = 0.;
  for (int i = 0; i < 6; i++) {
    vec4 f = uSw[i];
    vec2 d1 = wp.xz - (f.xz - sh * max(f.y - wp.y, 0.) * uShadK.y);
    float e1 = length(d1) / max(f.w, 0.05);
    a = max(a, (1. - smoothstep(0.55, 1.25, e1)) * step(wp.y, f.y));
  }
  return a;
}
float mosaShadow(vec3 wp, vec2 lh, float run, float soft, float halfW){
  float depth = max(-wp.y - 1.6 + 1.2 * uMo.w, 0.);
  vec2 d = wp.xz - (uMo.xy - lh * depth * run);
  float ch = cos(uMo.z), sh = sin(uMo.z);
  vec2 l = vec2(ch * d.x - sh * d.y, sh * d.x + ch * d.y);
  float e = length(vec2(l.x / halfW, (l.y + 0.8) / 5.8));
  return 1. - smoothstep(1. - soft, 1. + soft * 0.4, e);
}
`,X0=`
  precision highp float;
  varying vec3 vPos; varying vec4 vBed; varying vec3 vNor;
  ${M0}
  ${S0}
  ${k0}
  ${C0}
  ${F0}
  ${$0}
  uniform vec3 uRudist; uniform vec3 uWrack;
  uniform sampler2D uChart; uniform vec4 uChartBox;
  #include <fog_pars_fragment>
  void main(){
    vec2 p = vPos.xz; float h = vPos.y; float t = uSea.z;
    float dist = length(uCamL - vPos);
    float nearF = 1. - smoothstep(14., 60., dist);
    vec3 n = normalize(vNor + vec3(0., 1e-4, 0.));
    // white sand in ripple bars 0.4 m apart that bend and fork
    float wob = sFbm(p * 0.11 + uSea.w) * 9. + sFbm(p * 0.9) * 0.5;
    float barArg = (p.x * 0.78 + p.y * 0.62 + wob) * 15.7;
    float barFine = 1. - smoothstep(0.7, 2.0, fwidth(barArg));          // (no moire: the bars melt away where they are finer than a pixel)
    float bars = sin(barArg);
    float big = sFbm(p * 0.35 + 9.);
    float dry = smoothstep(-0.05, 0.25, h);
    float rip = mix(1., 0.74 + 0.26 * smoothstep(-0.6, 0.9, bars), nearF * (1. - dry) * barFine);
    vec3 col = uSand * rip * (0.90 + 0.18 * big);
    col *= 1. - 0.10 * (1. - dry) * smoothstep(0.55, 0.75, sFbm(p * 0.045 + 21.));                 // broad darker drifts of shell hash
    // seagrass in leopard patches with ragged edges
    vec2 cres = vec2(128., 176.);
    vec2 ct = (p - uChartBox.xy) * uChartBox.zw * cres + 0.5; vec2 cti = floor(ct), ctf = fract(ct);
    ct = (cti + ctf * ctf * (3. - 2. * ctf) - 0.5) / cres;
    vec4 chB = texture2D(uChart, clamp(ct, 0.002, 0.998));
    // (polish 4) a reef's outline is lobed and ragged, never the circle of a cone
    float mf = clamp(vBed.y + ((sFbm(p * 0.40 + 3.) - .5) * 0.62 + (sVN(p * 1.5 + 7.) - .5) * 0.22) * (1. - smoothstep(2.3, 2.9, vBed.y)), 0., 3.), moundK = 1. - smoothstep(0.75, 1.25, mf);
    float halo = smoothstep(0.95, 1.30, mf) * (1. - smoothstep(1.55 + 0.5 * sVN(p * 0.35 + 2.), 2.35, mf));    // the bare ring grazed clean round every reef
    float gm = max(chB.g, chB.b * 1.15) * (1. - moundK) * (1. - 0.75 * smoothstep(-15., -25., h)) + (sFbm(p * 0.33 + 4.) - .5) * 0.50 + (sVN(p * 1.9) - .5) * 0.26 + (sVN(p * 0.9 + 8.) - .5) * 0.22 + (sFbm(p * 0.13 + 1.) - .5) * 0.5;
    float grass = smoothstep(0.44, 0.60, gm) * (1. - 0.92 * halo) * (1. - smoothstep(-3.3, -2.2, h));           // (polish 3) none on the cay's apron or the shoal tops: there it was a dark stain with nothing casting it
    float blades = 0.50 + 0.65 * sVN(vec2(p.x * 2.6 + sin(t * .7 + p.y * .3) * .5, p.y * 8.)) * (0.7 + 0.6 * sVN(p * 0.8 + 3.));
    col = mix(col, uGrass * 0.40 * blades, grass * 0.93);
    col *= 1. - 0.22 * smoothstep(0.30, 0.46, gm) * (1. - grass) * (1. - halo);                    // a dusky fringe round each patch
    col *= 1. + halo * (0.10 - 0.30 * smoothstep(0.70, 0.86, sVN(p * 3.1 + 5.)) * nearF);           // the halo: paler sand strewn with broken shell
    // rudist mounds: packed tan horns seen end on, pale-green algal fuzz on top
    float mound = smoothstep(0.25, 0.7, moundK + (sVN(p * 1.3) - .5) * 0.3);
    vec3 rud = uRudist;
    if (mound > 0.001) {
      // horns seen end on, packed shoulder to shoulder: every cell is one round lid, pale and domed, with the dark slit under
      // its rim and deep shade between neighbours; lids of mixed sizes, each horn its own tone
      vec2 cp = p * 4.4 + (vec2(sVN(p * 1.3), sVN(p * 1.3 + 5.)) - .5) * 0.9; vec2 ci = floor(cp), cf = fract(cp);
      float d1 = 9., id = 0.; vec2 rv = vec2(0., 1.);
      for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
        vec2 o = vec2(float(i), float(j)); vec2 hh = vec2(sH21(ci + o), sH21(ci + o + 7.3));
        vec2 rr = o + 0.22 + 0.56 * hh - cf; float dd = dot(rr, rr);
        if (dd < d1) { d1 = dd; id = hh.x; rv = rr; }
      }
      float rd = sqrt(d1), RR = 0.30 + 0.17 * id;
      float lid = 1. - smoothstep(RR - 0.08, RR, rd);
      float slit = smoothstep(RR - 0.03, RR + 0.04, rd) * (1. - smoothstep(RR + 0.05, RR + 0.22, rd));
      float domeL = 0.86 + 0.30 * dot(-rv / max(rd, 1e-3), normalize(uSunDir.xz + vec2(1e-4, 0.))) * smoothstep(0., RR, rd);
      rud = uRudist * (0.30 + 0.42 * lid) * (0.78 + 0.40 * id) * domeL * (1. - 0.40 * slit) * (0.85 + 0.3 * sVN(p * 0.7 + 11.));
      rud = mix(rud, vec3(0.40, 0.55, 0.33) * (0.7 + 0.4 * sVN(p * 5.)), lid * smoothstep(0.56, 0.80, sFbm(p * 0.8 + 2.)) * 0.30);   // algal fuzz on some tops only
      // (polish 3) far off the lids melt into a mottled tan crust with green tops: never a dark net
      // (polish 4) far off the crust is bouquets a metre across: each a pale boss with a sunlit and a shaded side on a darker ground
      vec2 bq = p * 1.05 + (vec2(sVN(p * 0.5 + 3.), sVN(p * 0.5 + 9.)) - .5) * 0.9; vec2 bi = floor(bq), bf = fract(bq);
      float bd = 9., bid = 0.; vec2 br = vec2(0., 1.);
      for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
        vec2 o = vec2(float(i), float(j)); vec2 hh = vec2(sH21(bi + o + 3.1), sH21(bi + o + 11.7));
        vec2 rr = o + 0.2 + 0.6 * hh - bf; float dd = dot(rr, rr);
        if (dd < bd) { bd = dd; bid = hh.x; br = rr; }
      }
      float brd = sqrt(bd), boss = 1. - smoothstep(0.20, 0.66, brd);
      float bl = 0.80 + 0.42 * dot(-br / max(brd, 1e-3), normalize(uSunDir.xz + vec2(1e-4, 0.))) * smoothstep(0., 0.45, brd) * uLit.w;
      vec3 farRud = uRudist * (0.56 + 0.50 * boss) * bl * (0.82 + 0.36 * bid) * (0.86 + 0.28 * sFbm(p * 0.9 + 3.));
      farRud = mix(farRud, vec3(0.30, 0.46, 0.26) * (0.75 + 0.5 * boss), smoothstep(0.50, 0.75, sFbm(p * 0.55 + 7.)) * 0.55);
      rud = mix(farRud, rud, 1. - smoothstep(9., 30., dist));
      rud *= mix(vec3(1.), keepWarm(vPos), 0.45 * smoothstep(9., 30., dist));
    }
    col = mix(col, rud * mix(vec3(1.), keepWarm(vPos), 0.45), mound);
    // (polish 3) relief under water: every dome, shoal flank and creek wall has a side toward the Sun and a side away from it
    float ndl = clamp(dot(n, normalize(uSunDir + vec3(0., 0.55, 0.))), 0., 1.) / max(normalize(uSunDir + vec3(0., 0.55, 0.)).y, 0.2);
    col *= mix(1., clamp(0.42 + 0.62 * ndl, 0.35, 1.45), (1. - dry) * mix(0.55, 1., mound) * uLit.w);
    // the channel: the bank's edge is a seagrass slope going down into blue
    float hr = h + (sFbm(p * 0.30 + 13.) - .5) * 5.5 + (sVN(p * 1.3) - .5) * 1.4;                    // a ragged, scalloped lip, never a ruled line
    col = mix(col, uDeep * 0.30, (1. - smoothstep(-29., -7.5, hr)) * (1. - 0.45 * grass * smoothstep(-16., -8., h)));
    // the cay: wet sand at the water's edge, a dark wrack line above it, bleached dry sand on top
    float wl = h - 0.06 * sin(p.x * 0.31 + p.y * 0.17) - 0.05 * sin(t * 0.8 + p.x * 0.6 + p.y * 0.4);
    col *= mix(1., 0.72, smoothstep(-0.25, 0.02, wl) * (1. - smoothstep(0.10, 0.32, wl)));
    float wr = (1. - smoothstep(0.04, 0.20, abs(h - 0.46 - 0.22 * (sFbm(p * 0.21) - .5)))) * smoothstep(0.30, 0.62, sFbm(p * 1.1 + 3.) + 0.3 * sVN(p * 7.));
    col = mix(col, uWrack * (0.7 + 0.6 * sVN(p * 5.)) + uSand * 0.25, wr * 0.55);
    // (polish 2) dry sand close to: wind ripples lit on their Sun side, finer ripples across them, a scatter of shell hash, and bright
    float rA = (p.x * 0.5 - p.y * 0.86 + 2.5 * sFbm(p * 0.2)) * 7.;
    float rB = (p.x * 0.80 - p.y * 0.60 + 1.1 * sFbm(p * 0.7 + 4.)) * 27.;
    float fineK = (1. - smoothstep(0.5, 1.7, fwidth(rB))) * dry;
    float duneK = dry * (1. - smoothstep(20., 70., dist));
    col *= 1. + duneK * 0.22 * (smoothstep(-0.3, 0.9, sin(rA)) - 0.62) + fineK * 0.17 * (smoothstep(-0.4, 0.7, sin(rB)) - 0.5);
    float hash = smoothstep(0.80, 0.88, sVN(p * 27.)) * (1. - smoothstep(3., 14., dist));
    col *= mix(1., 1.36 - 0.10 * sVN(p * 6.) - 0.08 * smoothstep(0.5, 0.8, sVN(p * 0.9 + 5.)) - 0.30 * hash, dry);
    // (polish 3) the dry bank is not one slab: damp flats the tide has left, darker and with the sky in them; an older strand line
    // higher up; clots of cast-up seagrass
    float pool = smoothstep(0.56, 0.66, sFbm(p * 0.17 + 30.)) * smoothstep(0.22, 0.40, h) * (1. - smoothstep(0.74, 0.96, h));
    col = mix(col, col * 0.56 + uSkyTop * 0.08, pool * 0.85);
    float wr2 = (1. - smoothstep(0.03, 0.12, abs(h - 0.78 - 0.16 * (sFbm(p * 0.33 + 9.) - .5)))) * smoothstep(0.35, 0.65, sFbm(p * 1.6 + 13.) + 0.3 * sVN(p * 8.));
    col = mix(col, uWrack * (0.8 + 0.6 * sVN(p * 6.)) + uSand * 0.22, wr2 * 0.5 * dry);
    float clot = smoothstep(0.86, 0.92, sVN(p * 9. + 17.)) * smoothstep(0.45, 0.7, sFbm(p * 0.6 + 2.)) * dry * (1. - smoothstep(8., 30., dist));     // flecks of cast-up weed in drifts
    col = mix(col, uWrack * 1.3 + uSand * 0.15, clot * 0.6);
    // light: Sun, caustic net, the stranger's tide, and every shadow twice
    vec2 fs = flierShadows(vPos);
    vec2 shH = normalize(uSunDir.xz + vec2(1e-4, 0.));
    float s1 = mix(vBed.z, 0.45 + 0.55 * vBed.z, dry) * (1. - 0.55 * fs.x * uLit.w) * (1. - 0.62 * swimShadows(vPos) * uLit.w) * (1. - 0.5 * mosaShadow(vPos, shH, uShadK.y, 0.6, 1.9) * uLit.w);
    float s2 = mix(1., vBed.w, 0.4) * (1. - 0.9 * fs.y) * (1. - 0.85 * mosaShadow(vPos, vec2(0., -1.), uShadK.w, 0.10, 1.35));
    float up = clamp(dot(n, normalize(uSunDir + vec3(0., 0.25, 0.))) * 1.25, 0., 1.);
    up = mix(up, 0.56 + 0.44 * up, dry);                                         // dry sand turned from the Sun still takes the bright sky
    col *= seaLight(vPos, s1, s2, up);
    col *= 1. - (0.42 * fs.y + 0.08 * (1. - vBed.w)) * min(uSea.y, 1.);          // the second shadows, a little stronger than the light alone would draw them
    vec3 wet = seaThrough(col, vPos);
    // the lap of the sea on the sand: a thin bright thread that comes and goes
    float lap = (1. - smoothstep(0.0, 0.05, abs(wl))) * (0.5 + 0.5 * sVN(p * 1.7 + vec2(t * 0.3, 0.)));
    col = mix(wet, col, smoothstep(-0.12, 0.03, h)) + (uSunCol * 0.45 + uSHot * 0.3 * uSea.y) * lap * 0.6;
    gl_FragColor = vec4(col, 1.);
    #include <fog_fragment>
  }`,Z0=`
  precision highp float;
  varying vec3 vPos;
  ${M0}
  ${U0}
  ${k0}
  ${C0}
  uniform vec4 uSplash[6];     // x, z, age 0..1 (0 = none yet), size
  uniform vec4 uShadK;         // x: the Sun's shadow run per metre (4.3 at 13 degrees, 1.4 at 35)
  uniform sampler2D uChart; uniform vec4 uChartBox;
  #include <fog_pars_fragment>
  void main(){
    vec2 p = vPos.xz;
    vec3 toCam = uCamL - vec3(p.x, 0., p.y);
    float dist = length(toCam);
    vec3 V = toCam / max(dist, 1e-3);
    float nearF = 1. / (1. + dist * 0.03);
    float t = uSea.z, wind = uLit.z;
    vec2 g = vec2(0.);
    float sw = sFbm(p * 0.035 + 3.) * 7.;
    float swF = 0.25 + 0.75 * nearF;
    g += vec2(0.80, 0.60) * 0.024 * swF * cos(dot(p, vec2(0.80, 0.60)) * 0.35 - t * 0.9 + sw);
    g += vec2(-0.45, 0.89) * 0.017 * swF * cos(dot(p, vec2(-0.45, 0.89)) * 0.57 - t * 1.2 + 1.7 - sw * 1.3);
    vec2 rp = p * 1.6 + vec2(t * 0.25, t * 0.18);
    float r0 = sFbm(rp);
    g += vec2(sFbm(rp + vec2(.12, 0.)) - r0, sFbm(rp + vec2(0., .12)) - r0) * (0.10 + 0.5 * nearF) * (1. + 1.6 * wind);
    vec2 fp = p * 5.3 - vec2(t * 0.4, -t * 0.3);
    float f0 = sVN(fp);
    g += vec2(sVN(fp + vec2(.2, 0.)) - f0, sVN(fp + vec2(0., .2)) - f0) * (0.10 + 0.22 * wind) * nearF;
    // cat's-paws: where a breath of wind touches the glass it goes matt and darker
    float paw = smoothstep(0.52, 0.72, sFbm(p * 0.018 + vec2(t * 0.012, 0.) + uSea.w)) * (0.25 + 0.75 * wind);
    vec2 pp = p * 2.3 + vec2(t * 0.9, t * 0.5);
    float p0 = sVN(pp);
    g += vec2(sVN(pp + vec2(.15, 0.)) - p0, sVN(pp + vec2(0., .15)) - p0) * 0.32 * paw * (0.3 + 0.7 * nearF);
    // the animal's bow wave and V wake, in its own frame (x across, y ahead)
    vec2 d = p - uMo.xy;
    float ch = cos(uMo.z), sh = sin(uMo.z);
    vec2 l = vec2(ch * d.x - sh * d.y, sh * d.x + ch * d.y);
    float behind = 5.2 - l.y;
    float foam = 0., calm = 0., glint = 0.;
    {
      // (polish 4) she is IN the water: rings of small ripples run out from her awash back and snout, close round her and gone
      // within three metres, so the glass is broken where she breaks it
      float eh = length(vec2(l.x / 0.85, (l.y - 1.7) / 4.4));
      float out1 = max(eh - 0.95, 0.);
      vec2 rad = normalize(vec2(l.x / 0.72, (l.y - 1.7) / 19.4) + vec2(1e-4, 0.));
      float rp = cos(out1 * 8.5 - t * 3.0) * exp(-out1 * 1.5) * smoothstep(0.0, 0.12, out1) * 0.085 * uMo.w * step(eh, 5.);
      g += vec2(ch * rad.x + sh * rad.y, -sh * rad.x + ch * rad.y) * rp;
    }
    if (uMo.w > 0.001 && behind > -3. && behind < 46.) {
      // a true V: each arm a short train of wavelets inside a narrow envelope, broken along its length, gone within three body
      // lengths; calm water between the arms; a thread of foam only at the bow and where the tail's lobe cuts the surface
      float bb = max(behind, 0.);
      float a = abs(l.x) - bb * 0.33 - 0.35;
      float wd = 0.75 + bb * 0.050;
      float fade = smoothstep(2.5, 8.5, behind) * (1. - smoothstep(15., 31., bb)) * exp(-bb / 14.) * uMo.w;
      float brk = smoothstep(0.40, 0.62, sVN(vec2(bb * 0.55 - t * 0.9, sign(l.x) * 3.7 + a * 0.5)));       // patches a couple of metres long
      float envA = exp(-(a * a) / (wd * wd)) * fade * brk;
      float kx = 3.4, ph = a * kx + bb * 2.8 - t * 3.0;                                    // crests oblique to the arm, as in a real wake
      vec2 gl2 = -0.075 * sin(ph) * envA * vec2(kx * sign(l.x), 0.33 * kx - 2.8);
      calm = (1. - smoothstep(-1.4, 0.2, a)) * smoothstep(1., 6., behind) * (1. - smoothstep(16., 36., bb)) * uMo.w;
      float tw = cos(bb * 2.1 - t * 5.) * 0.05 * calm * exp(-bb / 9.);                      // the tail's own swirls down the middle
      gl2.y += tw;
      g *= 1. - 0.30 * calm;                                    // (polish 4: 0.30, was 0.75: the glassy lane behind her read as a pale wedge lying on the water)
      g += vec2(ch * gl2.x + sh * gl2.y, -sh * gl2.x + ch * gl2.y);
      glint = max(cos(ph), 0.); glint = 0.30 * glint * glint * glint * envA * smoothstep(0.42, 0.80, sVN(p * 6.5 + vec2(t * 1.3, -t * 0.9))) * (0.30 + 1.5 * (1. - nearF));   // broken sparks, never a band
      float churn = sVN(l * 2.2 + vec2(0., t * 1.5)) * sVN(l * 5.1 - vec2(t, 0.));
      float hull = 1. - smoothstep(0.04, 0.16, abs(length(vec2(l.x / 0.66, (l.y - 1.9) / 3.7)) - 1.));
      foam = hull * smoothstep(2.6, 4.6, l.y) * uMo.w * uMo.w * (0.10 + 0.8 * churn)
           + exp(-(l.x * l.x + (l.y + 5.7) * (l.y + 5.7)) / 0.30) * uMo.w * uMo.w * (0.03 + 0.4 * churn);
    }
    // plunge rings: two or three ripples running out from where a pterosaur went in, a patch of foam at the centre
    for (int i = 0; i < 6; i++) {
      vec4 s = uSplash[i];
      vec2 ds = p - s.xy; float r = length(ds);
      float age = s.z;
      float R = 0.6 + 9. * age;
      float env = exp(-(r - R) * (r - R) / (0.8 + 2.5 * age)) * (1. - age) * step(0.001, age) * step(r, 16.);
      g += ds / max(r, 0.05) * cos((r - R) * 4.5) * 0.22 * env;
      foam += (1. - smoothstep(0.3, 0.9 + 1.5 * age, r)) * (1. - smoothstep(0.0, 0.40, age)) * step(0.001, age) * smoothstep(0.35, 0.65, sVN(ds * 4.5 + t)) * 0.8;
    }
    vec3 n = normalize(vec3(-g.x, 1., -g.y));
    vec3 R = reflect(-V, n); R.y = abs(R.y) + 0.002; R = normalize(R);
    float c1 = 1. - clamp(dot(n, V), 0., 1.);
    float F = 0.02 + 0.98 * c1 * c1 * c1 * c1 * c1;
    float far = 1. - nearF;
    vec3 Rs = normalize(R + vec3(0., 0.22 * far, 0.));
    vec3 refl = seaSky(Rs);
    float cl = cloudSh(p);
    refl = mix(refl, min(refl, vec3(1.05)), 0.85 * cl);        // no Sun glitter in a cloud's shade
    vec4 st = strangerSky(R);
    refl = refl * (1. - st.a) + min(st.rgb, vec3(2.4));
    F = min(F, 0.60 - 0.27 * far);                          // (the far sea keeps its own blue under the pale horizon: a clear sea line)
    F *= 1. - 0.38 * exp(-dot(l * vec2(1., 0.55), l * vec2(1., 0.55)) / 30.);
    F *= 1. - 0.10 * calm;
    F *= 1. - 0.35 * paw;
    float k = mix(0.10, 0.95, far * far);
    vec3 scatter = mix(uTurq * 0.5, uTurq * 0.42 + uDeep * 0.55, far) * (1. + 0.07 * uSea.y) * (1. - 0.25 * paw);   // (polish 4: the sea keeps its depth under the fire, so the gold road stands on it; it used to go milky)
    {
      // the chart: pale over the shoals, turquoise over the bank, olive-dark over the meadows, blue over creek and channel
      vec2 cuv = (p - uChartBox.xy) * uChartBox.zw;
      vec2 ce = min(cuv, 1. - cuv);
      float inC = smoothstep(0., 0.05, min(ce.x, ce.y));
      vec4 ch = texture2D(uChart, clamp(cuv, 0.002, 0.998));
      float dep = ch.r * 32.;
      vec3 tone = mix(uTurq * 0.98 + uSand * 0.34, uTurq * 0.66, smoothstep(0.7, 4.6, dep));
      tone = mix(tone, uDeep * 0.60 + vec3(0., 0.01, 0.04), smoothstep(6.0, 15., dep));
      tone = mix(tone, uDeep * 0.34 + vec3(0., 0.012, 0.075), smoothstep(13., 30., dep));          // (polish 3) the channel itself: ink blue
      tone = mix(tone, uGrass * 0.20 + uDeep * 0.22, max(ch.g, ch.b) * 0.80 * (1. - smoothstep(9., 20., dep)));
      tone *= (0.92 + 0.07 * uSea.y) * (1. - 0.25 * paw);
      scatter = mix(scatter, tone, inC * smoothstep(0.15, 0.6, far));
    }
    scatter *= 1. - 0.40 * cl * (0.35 + 0.65 * far);
    scatter = mix(scatter, scatter * vec3(1.20, 1.08, 0.86), clamp(uSea.y * 0.40, 0., 0.85));       // (polish 5: a warm turquoise, not pale jade: the finale keeps the sea's own colour)       // (polish 4) gold light in turquoise water: the sea goes jade under the fire
    foam = clamp(foam, 0., 1.);
    vec3 col = refl * F + scatter * (1. - F) * k;
    float alpha = F + (1. - F) * k;
    // the second glitter road: the fire's light broken by every ripple between us and the horizon under it
    {
      float fireK = uSBody.z;
      vec2 sxz = normalize(uSDir.xz + vec2(0., -1e-4));
      vec2 vxz = -V.xz / max(length(V.xz), 1e-3);
      float sd = vxz.x * sxz.y - vxz.y * sxz.x + 0.02;                    // sine of the angle off the road's line (the bead hangs a touch left of centre)
      float wdt = (0.030 + 0.085 * nearF + 0.02 * wind) * (1. + 0.45 * uSFx.z);        // (polish 4) the road broadens as the fire comes down
      float dvn = max(clamp(V.y, 0., 1.) - uSDir.y, 0.) / 0.20;
      float nearCut = exp(-dvn * dvn);                                     // glitter lies round the mirror point and out to the horizon: none at our feet
      float lane = exp(-sd * sd / (wdt * wdt)) * step(0., dot(vxz, sxz)) * (0.25 + 0.75 * nearCut);
      float spark = sVN(p * 2.7 + vec2(t * 0.45, -t * 0.3)) * sVN(p * 6.1 - vec2(t * 0.55, t * 0.2));
      spark = smoothstep(0.14, 0.50, spark + 0.25 * far);
      col += uSHot * vec3(1.0, 0.84, 0.52) * (1. + 0.35 * uSFx.z) * lane * (0.30 + 1.9 * spark) * fireK * (0.30 + 0.9 * F) * (1. - 0.6 * foam) * (0.45 + 0.55 * uShadK.x / (uShadK.x + 1.2));   // (weaker under a high Sun)
      // (polish 3) the crescent has a road of its own from the start: a thin lane of chalk sparks that widens as it grows and turns
      // gold as its limb heats (sunlight thrown back by a thing three, then six Moons wide)
      float heatK = uSBody.y;
      float cK = (clamp((uSBody.x - 0.020) * 8., 0., 0.30) + 0.55 * heatK) * (1. - fireK);
      float w2 = wdt * (0.75 + 0.5 * sFbm(p * 0.03 + 5.));
      float lane2 = exp(-sd * sd / (w2 * w2)) * step(0., dot(vxz, sxz)) * smoothstep(0.10, 0.45, far) * nearCut;
      float spark2 = smoothstep(0.95 - 0.60 * lane2, 1.20 - 0.60 * lane2, sVN(p * 2.7 + vec2(t * 0.45, -t * 0.3)) * sVN(p * 6.1 - vec2(t * 0.55, t * 0.2)) * 2.4 + 0.3 * far);   // thick with sparks down its middle, a few at its edges: a road, never a ruled beam
      col += mix(uSChalk * 0.42, uSGold * vec3(1.25, 0.86, 0.46), smoothstep(0., 0.5, heatK)) * spark2 * smoothstep(0.02, 0.45, lane2) * cK * (1. - 0.6 * foam);
    }
    col += (uSunCol * uLit.x * 0.9 + uSkyHor * 0.7 + uSHot * 0.3 * uSea.y) * glint;
    // a long dark shape under the glass: the mirror of the sky must not hide her                // the wavelets' crests catch the Sun and the bright horizon
    // (kept while she is awash too: at 20 m we look at the water at 8 degrees and only her dark length under it says how long she is)
    vec2 lw = l + (vec2(sVN(p * 1.3 + vec2(t * 0.6, 0.)), sVN(p * 1.3 + vec2(7., -t * 0.5))) - .5) * 0.7;
    float shp = (1. - smoothstep(0.35, 1.12, length(vec2(lw.x / (0.55 + 0.60 * smoothstep(-6.5, -1., lw.y)), (lw.y + 0.7) / 6.4)))) * (0.75 + 0.25 * far);
    col = mix(col, uDeep * 0.46 + uTurq * 0.10, shp * 0.62 * smoothstep(0.12, 0.5, far)); alpha = mix(alpha, 1., shp * 0.5 * smoothstep(0.12, 0.5, far));   // (polish 3: only far off; close to, her own body shows through the glass, and this was a hard slab over it)
    vec3 foamCol = max(uSunCol * 0.62 * uLit.x + uSkyTop * 0.25, uSkyHor * 0.92) + uSHot * 0.35 * uSea.y;
    col = mix(col, foamCol, foam * 0.85); alpha = mix(alpha, 1., foam * 0.85);
    gl_FragColor = vec4(col, alpha);
    #include <fog_fragment>
  }`,Y0=`
  varying vec3 vPos;
  #include <fog_pars_vertex>
  void main(){
    vPos = (modelMatrix * vec4(position, 1.)).xyz;
    vec4 mvPosition = viewMatrix * vec4(vPos, 1.);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`;function Q0(t){const o=new w.CircleGeometry(8200,64);o.rotateX(-Math.PI/2);const l=new w.ShaderMaterial({uniforms:t.U,fog:!0,vertexShader:Y0,fragmentShader:Z0,transparent:!0,depthWrite:!1,blending:w.CustomBlending,blendEquation:w.AddEquation,blendSrc:w.OneFactor,blendDst:w.OneMinusSrcAlphaFactor}),d=new w.Mesh(o,l);return d.name="sea",d.renderOrder=1,d.frustumCulled=!1,d}class w0{constructor(){this.p=[],this.c=[],this.w=[],this.i=[],this.n=0}v(o,l,d,x,L=[0,0,0,0]){return this.p.push(o,l,d),this.c.push(x[0],x[1],x[2]),this.w.push(L[0],L[1],L[2],L[3]),this.n++}quad(o,l,d,x){this.i.push(o,l,d,o,d,x)}tri(o,l,d){this.i.push(o,l,d)}loft(o,l,d=[0,0,0,0]){const x=[];for(const L of o){const v=this.n;for(let a=0;a<l;a++){const c=a/l*Math.PI*2,r=Math.cos(c),s=Math.sin(c),b=G(-.35,.25,s),e=L[4],z=L[5];this.v(r*L[3],L[1]+s*L[2],L[0],[Y(z[0],e[0],b),Y(z[1],e[1],b),Y(z[2],e[2],b)],d)}x.push(v)}for(let L=0;L<x.length-1;L++)for(let v=0;v<l;v++)this.quad(x[L]+v,x[L]+(v+1)%l,x[L+1]+(v+1)%l,x[L+1]+v);return x}build(){const o=new w.BufferGeometry;return o.setAttribute("position",new w.Float32BufferAttribute(this.p,3)),o.setAttribute("color",new w.Float32BufferAttribute(this.c,3)),o.setAttribute("aW",new w.Float32BufferAttribute(this.w,4)),o.setIndex(this.i),o.computeVertexNormals(),o}}const s0=(t,o=1)=>{const l=h0(t);return[l.r*o,l.g*o,l.b*o]};function J0(){const t=new w0,o=s0("#F4EEDC",.86),l=s0("#AEB8BF",.92),d=s0("#2B3238",.8),x=s0("#59636B",.8);t.loft([[-.215,.012,.002,.002,d,d],[-.15,.014,.007,.006,d,d],[-.118,.018,.016,.013,d,d],[-.1,.022,.026,.023,d,o],[-.075,.024,.03,.027,d,o],[-.05,.018,.029,.027,l,o],[-.015,.008,.036,.036,l,o],[.03,.004,.04,.04,l,o],[.08,.006,.032,.032,l,o],[.125,.012,.018,.022,l,o],[.15,.014,.006,.016,l,o]],6);const L=t.v(-.014,.014,.14,l),v=t.v(.014,.014,.14,l),a=t.v(.04,.012,.215,o),c=t.v(0,.014,.2,o),r=t.v(-.04,.012,.215,o);t.tri(L,c,r),t.tri(L,v,c),t.tri(v,a,c);for(const s of[-1,1]){const b=t.v(s*.0275,.028,-.088,[1.6,1.6,1.6]),e=t.v(s*.0275,.032,-.083,[1.6,1.6,1.6]),z=t.v(s*.0275,.027,-.081,[.02,.02,.02]);s>0?t.tri(b,e,z):t.tri(b,z,e)}for(const s of[-1,1]){const e=[],z=[],p=[];for(let h=0;h<=7;h++){const i=h/7,M=s*(.03+.27*i),g=-.045-.03*Math.sin(Math.min(i/.36,1)*Math.PI*.5)+.105*Math.pow(Math.max(i-.36,0)/.64,1.3),n=.092*(1-.25*i)*Math.sqrt(Math.max(1-Math.pow(i,3.2),0))+.004,S=i>.72?x:l;e.push(t.v(M,.02,g,S,[s,i,0,1])),z.push(t.v(M,.026-.006*i,g+n*.45,S,[s,i,.4,1])),p.push(t.v(M,.018,g+n,i>.72?x:o,[s,i,1,1]))}for(let h=0;h<7;h++)s>0?(t.quad(e[h],z[h],z[h+1],e[h+1]),t.quad(z[h],p[h],p[h+1],z[h+1])):(t.quad(e[h],e[h+1],z[h+1],z[h]),t.quad(z[h],z[h+1],p[h+1],p[h]))}return t.build()}function tt(){const t=new w0,o=s0("#F4EEDC",.86),l=s0("#AEB8BF",.92),d=s0("#2B3238",.8),x=s0("#59636B",.8),L=s0("#3A3F45",.9),v=a=>[1,a,0,0];t.loft([[-.172,.15,.003,.003,d,d],[-.108,.153,.012,.01,d,d]],6,v(1)),t.loft([[-.108,.153,.012,.01,d,d],[-.086,.158,.026,.023,d,o],[-.052,.157,.029,.026,d,o],[-.03,.14,.027,.025,l,o]],8,v(1)),t.loft([[-.03,.14,.027,.025,l,o],[-.004,.112,.038,.035,l,o],[.045,.096,.045,.041,l,o],[.1,.088,.036,.034,l,o],[.15,.086,.019,.023,l,o],[.2,.09,.006,.018,o,o]],8);for(let a=0;a<8;a++)t.w[(44+a)*4]=1,t.w[(44+a)*4+1]=1;for(const a of[-1,1]){const c=t.v(a*.034,.128,-.012,l),r=t.v(a*.046,.112,.06,l),s=t.v(a*.04,.08,.05,l),b=t.v(a*.036,.104,.15,x),e=t.v(a*.03,.082,.14,l),z=t.v(a*.01,.1,.25,x);a>0?(t.tri(c,s,r),t.quad(r,s,e,b),t.tri(b,e,z)):(t.tri(c,r,s),t.quad(r,b,e,s),t.tri(b,z,e));const p=t.v(a*.0265,.166,-.08,[.02,.02,.02],v(1)),h=t.v(a*.0265,.158,-.072,[.02,.02,.02],v(1)),i=t.v(a*.0265,.158,-.088,[1.5,1.5,1.5],v(1));a>0?t.tri(p,h,i):t.tri(p,i,h);const M=[2,0,0,0],g=a*.016,n=t.v(g-.006,.066,.05,L,M),S=t.v(g+.006,.066,.05,L,M),D=t.v(g,.066,.062,L,M),N=t.v(g-.006,0,.046,L,M),E=t.v(g+.006,0,.046,L,M),C=t.v(g,0,.058,L,M);t.quad(n,S,E,N),t.quad(S,D,C,E),t.quad(D,n,N,C);const A=t.v(g-.016,.002,.012,L,M),q=t.v(g+.016,.002,.012,L,M);t.tri(N,E,q),t.tri(N,q,A)}return t.build()}const et=`
  {
    float hd = iC.x, crouch = iC.y;
    if (aW.x > 0.5 && aW.x < 1.5) {
      vec3 q = p - vec3(0., 0.125, -0.020);
      float a = hd * aW.y, cs = cos(a), sn = sin(a);
      q = vec3(cs * q.x + sn * q.z, q.y - 0.030 * crouch * aW.y + 0.012 * iC.z * aW.y, -sn * q.x + cs * q.z + 0.022 * crouch * aW.y);
      p = q + vec3(0., 0.125, -0.020);
      n = vec3(cs * n.x + sn * n.z, n.y, -sn * n.x + cs * n.z);
    }
    if (aW.x > 1.5) p.y *= 1. - crouch; else p.y -= 0.060 * crouch;
  }`;function at(){const t=new w0,o=s0("#F4EEDC",.86),l=s0("#AEB8BF",.92),d=s0("#2B3238",.8),x=s0("#59636B",.8);t.loft([[-.205,.013,.004,.004,d,d],[-.095,.022,.027,.024,d,o],[.005,.006,.039,.039,l,o],[.105,.009,.026,.028,l,o],[.205,.013,.004,.032,o,o]],4);for(const L of[-1,1]){const a=[],c=[];for(let r=0;r<=3;r++){const s=r/3,b=L*(.03+.27*s),e=-.045-.03*Math.sin(Math.min(s/.36,1)*Math.PI*.5)+.105*Math.pow(Math.max(s-.36,0)/.64,1.3),z=.092*(1-.25*s)*Math.sqrt(Math.max(1-Math.pow(s,3.2),0))+.006;a.push(t.v(b,.022,e,s>.72?x:l,[L,s,0,1])),c.push(t.v(b,.018,e+z,s>.72?x:o,[L,s,1,1]))}for(let r=0;r<3;r++)L>0?t.quad(a[r],c[r],c[r+1],a[r+1]):t.quad(a[r],a[r+1],c[r+1],c[r])}return t.build()}function b0(t,o,l="",d={}){return new w.ShaderMaterial({uniforms:t,fog:!0,side:w.DoubleSide,vertexColors:!0,vertexShader:`
      attribute vec4 aW; attribute vec4 iA; attribute vec4 iB; attribute vec4 iC;
      varying vec3 vCol; varying vec3 vN; varying vec3 vWP; varying vec4 vW; varying vec3 vL; varying float vFade;
      uniform vec4 uSea;
      #include <fog_pars_vertex>
      vec3 rotX(vec3 v, float a){ float c = cos(a), s = sin(a); return vec3(v.x, c * v.y - s * v.z, s * v.y + c * v.z); }
      vec3 rotY(vec3 v, float a){ float c = cos(a), s = sin(a); return vec3(c * v.x + s * v.z, v.y, -s * v.x + c * v.z); }
      vec3 rotZ(vec3 v, float a){ float c = cos(a), s = sin(a); return vec3(c * v.x - s * v.y, s * v.x + c * v.y, v.z); }
      void main(){
        vec3 p = position; vec3 n = normal; float t = uSea.z;
        ${o}
        p *= iB.z;
        p = rotY(rotX(rotZ(p, iB.y), iB.x), -iA.w); n = rotY(rotX(rotZ(n, iB.y), iB.x), -iA.w);
        vWP = p + iA.xyz; vN = n; vCol = color; vW = aW; vL = position; vFade = iB.w;
        vec4 mvPosition = viewMatrix * vec4(vWP, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      precision highp float;
      varying vec3 vCol; varying vec3 vN; varying vec3 vWP; varying vec4 vW; varying vec3 vL; varying float vFade;
      ${M0}
      ${S0}
      ${k0}
      ${C0}
      ${F0}
      #include <fog_pars_fragment>
      void main(){
        vec3 n = normalize(vN + vec3(0., 1e-4, 0.));
        vec3 V = normalize(uCamL - vWP + vec3(0., 1e-4, 0.));
        ${d.twoSided===!1?"":"if (dot(n, V) < 0.) n = -n;"}
        vec3 alb = vCol * vFade;
        float gloss = 0.; vec3 add = vec3(0.);
        ${l}
        float up = 0.5 + 0.5 * n.y;
        float sunL = clamp(dot(n, normalize(uSunDir + vec3(0., 0.12, 0.))) * 0.8 + 0.2, 0., 1.);
        float strL = clamp(dot(n, uStrL) * 0.85 + 0.15, 0., 1.);
        vec3 light = uSunCol * uLit.x * 1.5 * sunL + mix(uTurq * 0.34 + vec3(0.26) + uSunCol * uLit.x * 0.26, uFill * 3.0, up) * uLit.y + uSHot * uSea.y * 0.75 * strL;
        light += (uSunCol * uLit.x * 0.75 * (0.12 + 0.88 * clamp(-dot(n, normalize(uSunDir)), 0., 1.)) + uSHot * uSea.y * 0.3 * clamp(-dot(n, uStrL), 0., 1.)) * vW.w;   // light through the wing
        vec3 col = alb * light + add;
        vec3 H = normalize(normalize(uSunDir) + V);
        float sp = clamp(dot(n, H), 0., 1.); sp *= sp; sp *= sp; sp *= sp; sp *= sp;
        float fr = 1. - clamp(dot(n, V), 0., 1.);
        col += (uSunCol * uLit.x * sp * sp * 1.4 + uFill * 1.6 * fr * fr * fr) * gloss;
        if (vWP.y < 0.) col = seaThrough(col * (0.42 + 0.4 * sCaus(vWP.xz * 1.7, uSea.z) * up), vWP);
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}function y0(t,o){const l=new w.InstancedBufferGeometry;l.index=t.index;for(const v in t.attributes)l.setAttribute(v,t.attributes[v]);const d=new w.InstancedBufferAttribute(new Float32Array(o*4),4),x=new w.InstancedBufferAttribute(new Float32Array(o*4),4),L=new w.InstancedBufferAttribute(new Float32Array(o*4),4);return d.setUsage(w.DynamicDrawUsage),x.setUsage(w.DynamicDrawUsage),L.setUsage(w.DynamicDrawUsage),l.setAttribute("iA",d),l.setAttribute("iB",x),l.setAttribute("iC",L),l.instanceCount=o,{geo:l,a:d,b:x,c:L}}const st=(t,o)=>`
  if (aW.w > 0.5) {
    float s = aW.y, side = aW.x, ph = iC.x, amp = iC.y, fold = iC.z;
    float xr = max(abs(p.x) - ${t}, 0.);
    float a = amp * (sin(ph) * (0.45 + 0.55 * s) + ${o} * s * sin(ph - 1.1)) + 0.10 * (1. - min(amp, 1.)) * (1. - fold);
    xr *= (1. - 0.30 * s * max(cos(ph), 0.) * min(amp, 1.)) * mix(1., 0.10, fold);
    p.z += fold * s * 0.16;
    float y0 = p.y;
    p.y = y0 + sin(a) * xr - fold * 0.004;
    p.x = side * (${t} + cos(a) * xr);
    n = rotZ(n, a * side);
  }`;async function ot(t){const{ctx:o,rng:l,U:d,path:x,detail:L,ground:v,portalPos:a,endDir:c,endRight:r}=t,s=l.fork("birds"),b=40,e=Math.round(330*(L<1?.5:1)),z=Math.round(54*(L<1?.7:1)),p=b+z,h=y0(J0(),p),i=y0(at(),e),M=new w.Mesh(h.geo,b0(d,st("0.030","0.30")));M.name="seabirds",M.frustumCulled=!1;const g=y0(tt(),z),n=new w.Mesh(g.geo,b0(d,et));n.name="spitParty",n.frustumCulled=!1;const S=new w.Mesh(i.geo,M.material);S.name="roost",S.frustumCulled=!1;const D=[[2.7,-1.15,-.45],[3.6,1.5,-.15],[4.6,-2.3,.35],[5.4,.7,-.75],[6.6,2.7,.05],[7.6,-1.6,.85]].map(f=>({lead:f[0],side:f[1],up:f[2]}));for(let f=0;f<16;f++)D.push({lead:49+f*2.1+s.range(-1,1),side:(f%2?1:-1)*s.range(1.5,13),up:s.range(-.6,1.4),out:1});for(;D.length<b;){const f=s.range(9,86),u=(s.chance(.5)?-1:1)*s.range(1.8,4+f*.42);D.push({lead:f,side:u,up:s.range(-1,2.6)})}for(const f of D)f.off=s(),f.wp=s.range(0,6.28),f.size=s.range(1.25,1.45);const N=new Int8Array(b).fill(-1);for(let f=6;f<22;f++)N[f]=f-6;const E=[];let C=0;for(;E.length<e&&C++<9e3;){C%30===0&&await o.yield();const f=s.chance(.5)?0:1,u=v.armC[f],U=34*Math.pow(s(),1.5),F=(f?1:-1)*(44-U),H=s.gauss()*2.4,B=u.x+r.x*F+c.x*H,j=u.z+r.z*F+c.z*H,X=v.surfAt(B,j);v.baseSurfAt(B,j)<.45||E.push({x:B,y:X+.035,z:j,head:s.range(-.9,.9)+.7,delay:s.range(0,.45)+U*.022,rise:1.2+10*Math.pow(s(),1.1),sp:s.range(2.6,4.6),ph:s.range(0,6.28),size:s.range(3,4),dr:s.range(-.3,.3)})}const A=-r.x*.86+c.x*.5,q=-r.z*.86+c.z*.5,I=Math.atan2(A,-q),T=v.spit,y=[],W=Math.atan2(t.sunDir.x,-t.sunDir.z),k=Math.atan2(T.tx,-T.tz);for(C=0;y.length<z-6&&C++<4e3;){C%30===0&&await o.yield();const f=i0(s.gauss()*10,-24,26)+3,u=s.gauss()*2.6+3*Math.sin(f*.11+.7)+1.6*Math.sin(f*.27+2),U=T.x+T.ax*f+T.az*u,F=T.z+T.az*f-T.ax*u,H=v.surfAt(U,F);if(v.baseSurfAt(U,F)<.3)continue;const B=x.nearestXZ(U,F),j=(U-T.x)*-T.tz+(F-T.z)*T.tx;if(B.dist<.9)continue;const X=s.chance(.3);y.push({x:U,y:H,z:F,head:W+s.range(-.5,.5)+(s.chance(.2)?s.range(-1.6,1.6):0),sit:s.chance(.3)?1:0,look:s.range(.3,1.1),u0:B.u-((X?s.range(1.5,4):s.range(7,13))+.3*B.dist)/x.length,out:k+(j>0?1:-1)*s.range(.12,.85),rise:.8+3.6*Math.pow(s(),.8),sp:s.range(7.5,11.5),ph:s.range(0,6.28),size:s.range(1.5,1.8)})}for(let f=0;f<6&&y.length<z;f++){const u=.527+.0045*f,U=x.posAtDist(u*x.length),F=x.tangentAtDist(u*x.length),H=(f%2?1:-1)*(1+.55*(f%3)),B=U.x-F.z*H,j=U.z+F.x*H,X=v.surfAt(B,j);v.baseSurfAt(B,j)<.25||y.push({x:B,y:X,z:j,head:W+s.range(-.6,.6),sit:0,look:s.range(.5,1.1),u0:u-s.range(1.6,3)/x.length,out:k+(H>0?1:-1)*s.range(.3,.8),rise:.8+2.4*s(),sp:s.range(7.5,10),ph:s.range(0,6.28),size:s.range(1.7,1.9)})}t.spitBirds=y;const R=[];await o.yield();for(let f=0;f<z;f++){f%20===19&&await o.yield();const u=f%2,U=v.armC[u],F=(u?1:-1)*(44-26*Math.pow(s(),1.4)),H=s.gauss()*2,B=U.x+r.x*F+c.x*H,j=U.z+r.z*F+c.z*H;let X=s.range(.905,.995),J=(f%4<2?-1:1)*s.range(1.5,7.5),K=s.range(-2.4,1.8);f<10&&(X=.9415+.0017*f+6e-4*s(),J=(f%2?1:-1)*(2.7+.5*f),K=[1.1,.9,1.5,1.8,.8,1.6,2.2,1.1,2,1.4][f]);const a0=x.posAtDist(X*x.length),Q=s.range(0,.7);R.push({sx:B,sy:Math.max(v.surfAt(B,j),.3)+.2,sz:j,px:a0.x+r.x*J,py:a0.y+K-.12*Math.abs(J),pz:a0.z+r.z*J,T:Math.max((X-.866)*40-Q,.6),delay:Q,ph:s.range(0,6.28),size:s.range(1.5,1.85)})}const P=new w.Vector3,_=new w.Vector3,e0=10/3,m=t.look.sunEl>20?.76:.9;function V(f,u,U,F,H){const B=h.a.array,j=h.b.array,X=h.c.array,J=F*x.length,K=G(.84,.97,F),a0=G(.26,.31,F)*(1-G(.38,.43,F)),Q=G(.095,.145,F)*(1-G(.205,.25,F)),d0=G(.575,.635,F)*(1-G(.83,.92,F));for(let $=0;$<b;$++){const O=D[$],Z=(u/e0+O.off)%1,o0=i0(Z/.4,0,1),t0=G(0,.08,o0)*(1-G(.9,1,o0));let r0=O.lead+1.2*Math.sin(u*.31+O.wp)*Math.min(O.lead*.2,1);$<2&&(r0=Y(r0,$?2.3:1.4,Q)),x.posAtDist(J+r0,P),x.tangentAtDist(J+r0,_);const c0=_.x,v0=_.z,z0=1/Math.max(Math.hypot(c0,v0),1e-4);let g0=O.side*(1+($<6?3.2:O.out?0:.25)*K+($<6?2.6:0)*a0)+.5*Math.sin(u*.43+O.wp*1.7);$<2&&(g0=Y(g0,$?-.2:.85,Q));const x0=$<3?P.y:Y(P.y,Math.min(P.y,2.6+.9*O.off),d0),P0=Math.max(x0+($<2?Y(O.up,$?-.45:-.18,Q):O.up)+.22*Math.sin(u*.6+O.wp)*($<2?1-.7*Q:1)+.1*(t0-.4),.55);B[$*4]=P.x-v0*z0*g0,B[$*4+1]=P0,B[$*4+2]=P.z+c0*z0*g0,B[$*4+3]=Math.atan2(c0,-v0)+.05*Math.sin(u*.43+O.wp*1.7+1.57),j[$*4]=_.y*.9+.06*t0,j[$*4+1]=-.25*Math.cos(u*.43+O.wp*1.7),j[$*4+2]=O.size,j[$*4+3]=1,X[$*4]=o0*4*6.2832,X[$*4+1]=.95*t0,X[$*4+2]=0,X[$*4+3]=0,$<2&&Q>0&&(j[$*4+1]=Y(j[$*4+1],$?-.35:-.6,Q),X[$*4]=Y(X[$*4],(u*3*6.2832+$*2.2)%62.832,Q>.5?1:0),X[$*4+1]=Y(X[$*4+1],.85,Q)),N[$]>=0&&(N[$]<10||F>=.75)&&d.uShad.value[N[$]].set(B[$*4],P0,B[$*4+2],.6)}for(let $=0;$<z;$++){const O=y[$],Z=b+$;if(F>.84){const t0=R[$],r0=(F-.866)*40-t0.delay,c0=r0/t0.T;if(r0<=0||c0>1.5){j[Z*4+2]=0;continue}const v0=G(0,.5,c0),z0=(t0.px-t0.sx)/t0.T,g0=(t0.pz-t0.sz)/t0.T,x0=G(0,.35,r0);B[Z*4]=t0.sx+z0*r0+.5*Math.sin(r0*1.1+t0.ph),B[Z*4+1]=Y(t0.sy,t0.py,v0)+.25*Math.sin(r0*1.7+t0.ph)*x0,B[Z*4+2]=t0.sz+g0*r0,B[Z*4+3]=Math.atan2(z0,-g0),j[Z*4]=.3*(1-v0)+.05*Math.sin(r0*2.1+t0.ph),j[Z*4+1]=.3*Math.sin(r0*.9+t0.ph)*x0,j[Z*4+2]=t0.size*x0,j[Z*4+3]=.82,X[Z*4]=(r0*3.3*6.2832+t0.ph)%6283.2,X[Z*4+1]=1*x0,X[Z*4+2]=1-x0,X[Z*4+3]=0;continue}if(!O||F<.3||F>.8){j[Z*4+2]=0;continue}const o0=(F-O.u0)*40;{const t0=g.a.array,r0=g.b.array,c0=g.c.array,v0=G(-1.4,-.2,o0);t0[$*4]=O.x,t0[$*4+1]=O.y,t0[$*4+2]=O.z,t0[$*4+3]=O.head,r0[$*4]=.06*v0,r0[$*4+1]=0,r0[$*4+2]=o0<=0?O.size*G(.3,.345,F):0,r0[$*4+3]=1,c0[$*4]=O.look*Math.sin(u*.6+O.ph)*Math.sin(u*.23+O.ph*3)*(1-.6*v0),c0[$*4+1]=O.sit*(1-v0),c0[$*4+2]=v0,c0[$*4+3]=0}if(o0<=0)j[Z*4+2]=0;else{const t0=G(0,.4,o0),r0=O.sp*(o0-.5*(1-Math.exp(-o0*2))),c0=O.head+Math.atan2(Math.sin(O.out-O.head),Math.cos(O.out-O.head))*G(0,.8,o0);B[Z*4]=O.x+Math.sin(O.out)*r0,B[Z*4+1]=O.y+.12+.25*t0+O.rise*(1-Math.exp(-o0*1))+.2*Math.sin(o0*1.3+O.ph)*t0,B[Z*4+2]=O.z-Math.cos(O.out)*r0,B[Z*4+3]=c0,j[Z*4]=.16*(1-t0)+.34*Math.exp(-o0*1.1)*t0,j[Z*4+1]=.35*Math.sin(o0*.9+O.ph)*t0,j[Z*4+2]=O.size*(1-G(7,9,o0)),j[Z*4+3]=1,X[Z*4]=(o0*3.4*6.2832+O.ph)%6283.2,X[Z*4+1]=1.05*t0,X[Z*4+2]=1-t0,X[Z*4+3]=0}}const u0=Math.min(d.uSea.value.y,2.2),n0=i.a.array,p0=i.b.array,m0=i.c.array;for(let $=0;$<E.length;$++){const O=E[$],Z=$,o0=(F-.858)*40-O.delay;if(o0<=0)n0[Z*4]=O.x,n0[Z*4+1]=O.y,n0[Z*4+2]=O.z,n0[Z*4+3]=O.head+.25*Math.sin(u*.7+O.ph)*Math.sin(u*.23+O.ph*3),p0[Z*4]=.42,p0[Z*4+1]=0,p0[Z*4+2]=O.size*.68,p0[Z*4+3]=1,m0[Z*4]=0,m0[Z*4+1]=0,m0[Z*4+2]=1,m0[Z*4+3]=0;else{const t0=G(0,.45,o0),r0=O.sp*(o0-.5*(1-Math.exp(-o0*2)))+1.6*Math.max(o0-2.6,0)*Math.max(o0-2.6,0),c0=O.head+(I+O.dr-O.head)*G(0,.9,o0);n0[Z*4]=O.x+(A+O.dr*q*.6)*r0,n0[Z*4+1]=O.y+.3*t0+O.rise*(1-Math.exp(-o0*1.15))+.25*Math.sin(o0*1.3+O.ph),n0[Z*4+2]=O.z+(q-O.dr*A*.6)*r0,n0[Z*4+3]=c0,p0[Z*4]=.42*(1-t0)+.3*Math.exp(-o0*1.1),p0[Z*4+1]=.3*Math.sin(o0*.9+O.ph)*t0,p0[Z*4+2]=O.size*(.68+.32*t0),p0[Z*4+3]=m*(1+.16*t0*u0),m0[Z*4]=(o0*3.6*6.2832+O.ph)%6283.2,m0[Z*4+1]=1.05*t0,m0[Z*4+2]=1-t0,m0[Z*4+3]=0}}i.a.needsUpdate=!0,i.b.needsUpdate=!0,i.c.needsUpdate=!0,g.a.needsUpdate=!0,g.b.needsUpdate=!0,g.c.needsUpdate=!0,h.a.needsUpdate=!0,h.b.needsUpdate=!0,h.c.needsUpdate=!0}return{mesh:M,roost:S,party:n,update:V}}function nt(){const t=new w0,o=s0("#F4EEDC",.82),l=s0("#CFC9B8",.7),d=s0("#F2C879",.85),x=s0("#B98A3C",.8),L=s0("#8D9AA3",.95),v=s0("#3B444B",.9),a=s0("#8C8474",.62),c=[.02,.02,.022];t.loft([[-.66,.06,.003,.002,d,d],[-.56,.066,.013,.009,d,d],[-.45,.073,.023,.015,d,x],[-.36,.08,.034,.023,d,d],[-.315,.086,.044,.034,o,o],[-.28,.092,.051,.041,o,o],[-.245,.092,.046,.039,o,l],[-.21,.08,.037,.034,o,l],[-.15,.056,.041,.042,o,l],[-.09,.036,.066,.088,o,l],[-.01,.022,.088,.108,o,l],[.09,.02,.08,.094,o,l],[.18,.022,.058,.07,o,l],[.25,.026,.034,.048,l,l],[.29,.028,.01,.026,l,l]],10);for(const e of[-1,1]){const z=t.v(e*.012,.118,-.39,d),p=t.v(0,.166,-.33,d),h=t.v(0,.214,-.25,x),i=t.v(0,.226,-.105,x),M=t.v(e*.006,.184,-.15,x),g=t.v(e*.016,.124,-.215,o);e>0?(t.tri(z,p,g),t.tri(p,h,g),t.tri(h,M,g),t.tri(h,i,M)):(t.tri(z,g,p),t.tri(p,g,h),t.tri(h,g,M),t.tri(h,M,i))}for(const e of[-1,1]){const z=t.v(e*.0155,.069,-.45,c),p=t.v(e*.0155,.075,-.45,c),h=t.v(e*.0355,.083,-.3,c),i=t.v(e*.0355,.076,-.3,c);e>0?t.quad(z,i,h,p):t.quad(z,p,h,i);const M=e*.0415,g=[];for(let C=0;C<6;C++){const A=C/6*6.2832;g.push(t.v(M,.1+.021*Math.sin(A),-.287+.023*Math.cos(A),c))}const n=t.v(M+e*.004,.1,-.287,c);for(let C=0;C<6;C++)e>0?t.tri(n,g[(C+1)%6],g[C]):t.tri(n,g[C],g[(C+1)%6]);const S=t.v(M+e*.006,.103,-.297,[2.4,2.4,2.4]),D=t.v(M+e*.006,.114,-.29,[2.4,2.4,2.4]),N=t.v(M+e*.006,.103,-.283,[2.4,2.4,2.4]);e>0?t.tri(S,N,D):t.tri(S,D,N),t.loft([[.24,.024,.016,.014,l,l],[.4,.02,.011,.01,a,a],[.56,.018,.008,.008,a,a],[.66,.016,.004,.016,L,L]].map(C=>(C=C.slice(),C.push(0),C)),4).forEach(()=>{});const E=t.n-16;for(let C=0;C<16;C++)t.p[(E+C)*3]+=e*(.034+.045*Math.floor(C/4)/3)}for(let e=0;e<9;e++){const z=-.23+e*.055,p=e<2?.13-e*.012:(e<4?.1:.106)-Math.abs(e-5)*.004,h=-.062+Math.abs(e-5)*.01,i=t.v(0,p-.012,z,o),M=t.v(0,p+.022,z+.034,o),g=t.v(0,p-.014,z+.05,l);if(t.tri(i,M,g),e>2){const n=t.v(0,h+.01,z,l),S=t.v(0,h-.022,z+.036,l),D=t.v(0,h+.01,z+.05,l);t.tri(n,D,S)}}const r=.38,s=e=>e<r?Y(-.045,-.215,Math.pow(e/r,1.25)):-.215+.47*Math.pow((e-r)/(1-r),1.18),b=e=>e<r?Y(.62,.27,Math.pow(e/r,.55)):.27*Math.pow(1-(e-r)/(1-r),1.45)+.012;for(const e of[-1,1]){const p=[];for(let h=0;h<=22;h++){const i=h/22,M=e*(.06+1.44*i),g=s(i),n=b(i),S=Y(.045,.02,Math.min(i/r,1))*(i>r?Y(1,.35,(i-r)/(1-r)):1),D=G(.62,.95,i),N=[Y(L[0],v[0],D),Y(L[1],v[1],D),Y(L[2],v[2],D)],E=.03*Math.sin(Math.PI*Math.min(i*1.1,1));p.push([t.v(M,.034,g,a,[e,i,0,1]),t.v(M,.046,g+S,a,[e,i,.08,1]),t.v(M,.034,g+S*2,N,[e,i,.16,1]),t.v(M,.03+E,g+n*.55,N,[e,i,.55,1]),t.v(M,.03,g+n,[N[0]*.96,N[1]*.96,N[2]*.96],[e,i,1,1])])}for(let h=0;h<22;h++)for(let i=0;i<4;i++)e>0?t.quad(p[h][i],p[h][i+1],p[h+1][i+1],p[h+1][i]):t.quad(p[h][i],p[h+1][i],p[h+1][i+1],p[h][i+1])}return t.build()}const rt=`
  if (aW.w > 0.5) {
    float s = aW.y, side = aW.x, ph = iC.x, amp = iC.y, tuck = iC.z;
    float xr = max(abs(p.x) - 0.060, 0.);
    float outer = max(s - 0.38, 0.) / 0.62;
    // where the leading edge is at this share of the span (as built), and how far behind it this vertex sits in the membrane
    float zl = s < 0.38 ? mix(-0.045, -0.215, pow(clamp(s / 0.38, 0., 1.), 1.25)) : -0.215 + 0.47 * pow(clamp(outer, 0., 1.), 1.18);
    float cz = p.z - zl;
    float a = amp * (sin(ph) * (0.40 + 0.60 * s) + 0.34 * s * sin(ph - 1.2)) + (0.07 + 0.05 * sin(t * 0.7 + iC.w)) * (1. - min(amp, 1.)) * (1. - tuck) + 0.22 * tuck * (1. - outer);
    float fold = clamp(max(cos(ph), 0.) * min(amp, 1.) * 0.34 + tuck * 0.90, 0., 0.93);
    float wx = 0.547;                                                   // where the wrist is
    float xo = max(xr - wx, 0.), xi = min(xr, wx);
    // the fold of a plunge: the arm swings forward about the shoulder (wrist beside the head), the membrane closes up against the
    // body, and the long finger lies back along the flank: a dart with its wrists leading
    float chordK = 1. - tuck * mix(0.45, 0.58, outer);                   // (the dart keeps a narrow delta of membrane: a solid W, never a line)
    p.z = zl + cz * chordK - tuck * 0.20 * (xi / wx) + xo * fold * 1.12 + tuck * 0.05;
    xr = xi * (1. - 0.74 * tuck) + xo * (1. - fold);
    p.y += sin(a) * xr - outer * 0.05 * (1. - tuck) * (1. - min(amp, 1.));
    p.x = side * (0.060 + cos(a) * xr);
    n = rotZ(n, a * side);
  }`;function it(t){const{rng:o,U:l,path:d,nPtero:x,detail:L}=t,v=o.fork("ptero"),a=x,c=d.length,r=y0(nt(),a+2),s=new w.Mesh(r.geo,b0(l,rt,`
    float fur = sVN(vL.xz * 90.) * sVN(vL.zy * 37. + 3.);
    // (polish 2) the membrane is thin living skin, not a grey card: fibres fan back from the arm, it billows between them, the arm and
    // the long finger show as a pale rounded spar with a shade behind it, and a low Sun behind it shines through, warm
    float mS = vW.y, mC = clamp(vW.z, 0., 1.);
    float spar = 1. - smoothstep(0.10, 0.19, mC);
    float fib = sVN(vec2(mS * 52. + mC * 10., mC * 2.6 + 1.7));
    float bil = 0.5 + 0.5 * sin(mS * 30. + mC * 5. + 2.5 * sVN(vec2(mS * 6., mC * 2.)));
    float camber = 0.74 + 0.36 * sin(3.1416 * clamp(mC * 0.9 + 0.08, 0., 1.));                  // lit along the crown of the wing, shaded at the edges
    // (polish 5) seen close it was a flat tan sheet. Now: stiffening fibres as fine dark lines that fan back from the arm and the long
    // finger, the skin thick and dusky beside the body and along the arm and thinning to the trailing edge, darker mottles, a dark
    // welt along the trailing edge, a pale knuckle at the wrist; and the Sun comes through only where the skin is thin, between fibres
    float line = abs(fract(mS * 46. + mC * 7.5 + 0.8 * sVN(vec2(mS * 9., mC * 3.))) - 0.5);
    float fibre = (1. - smoothstep(0.05, 0.16, line)) * smoothstep(0.16, 0.34, mC) * (1. - smoothstep(1.0, 3.0, length(fwidth(vec2(mS * 46., mC * 7.5)))));
    float thin = smoothstep(0.18, 0.95, mC) * (0.45 + 0.55 * smoothstep(0.06, 0.5, mS));
    float mott = sVN(vec2(mS * 13. + 3., mC * 5.)) * 0.6 + sVN(vec2(mS * 31., mC * 11. + 7.)) * 0.4;
    float welt = smoothstep(0.90, 0.985, mC);
    vec3 memb = vCol * (0.66 + 0.44 * fib) * (0.74 + 0.40 * bil * smoothstep(0.18, 0.7, mC)) * camber;
    memb *= (1. - 0.24 * fibre) * (0.80 + 0.36 * mott) * mix(0.80, 1.08, thin) * (1. - 0.40 * welt);
    memb = mix(memb, vCol * 1.5 + vec3(0.10, 0.085, 0.06), spar * (0.55 + 0.45 * smoothstep(0.0, 0.07, mC)));       // the spar
    memb = mix(memb, vec3(0.80, 0.76, 0.66), spar * (1. - smoothstep(0.012, 0.035, abs(mS - 0.38))) * 0.7);          // the wrist's knuckle
    memb *= 1. - 0.38 * smoothstep(0.17, 0.21, mC) * (1. - smoothstep(0.21, 0.40, mC));          // its shade on the skin behind it
    memb = mix(memb, memb * vec3(1.16, 1.0, 0.92), (1. - smoothstep(0.0, 0.35, mS)));           // flushed near the body
    alb *= mix(0.86 + 0.5 * fur, 1., vW.w);
    alb = mix(alb, memb * vFade * 0.80, vW.w);
    float back = clamp(-dot(n, normalize(uSunDir)) * 1.3 + 0.10, 0., 1.);
    add = uSunCol * uLit.x * vec3(0.34, 0.24, 0.16) * back * (1. - 0.85 * spar) * (0.30 + 0.70 * thin) * (1. - 0.40 * fibre) * (0.62 + 0.5 * fib) * (0.75 + 0.4 * mott) * (1. - 0.5 * welt) * (1. - 0.6 * smoothstep(0.6, 0.98, mS)) * vW.w * vFade * vFade;
    add += uSHot * uSea.y * vec3(0.30, 0.20, 0.10) * clamp(-dot(n, uStrL) * 1.2 + 0.15, 0., 1.) * (0.35 + 0.65 * thin) * (1. - 0.60 * fibre) * (1. - 0.85 * spar) * vW.w * vFade;   // the fire's light through the skin
    gloss = 0.25 * vW.w;`));s.name="pterosaurs",s.frustumCulled=!1;const b=(m,V)=>d.posAtDist(m*c,V),e=new w.Vector3,z=new w.Vector3,p=[{cross:!0},{uP:.452,ahead:15,side:3.4},{uP:.404,ahead:14,side:-4.5},{uP:.565,ahead:30,side:-6,near:9}],h=[],i=new w.Vector3,M=new w.Vector3,g=m=>(b(m,e),d.tangentAtDist(m*c,i),i.setY(0).normalize(),M.set(-i.z,0,i.x),e);for(let m=0;m<a;m++){const V=p[m]?{...p[m]}:null,f={sc:V,ph:v.range(0,6.28),w:v.range(.42,.6)*(v.chance(.5)?1:-1),R:v.range(11,17),size:v.range(1.08,1.22),seed:v.range(0,6.28)},u=!V&&m<6,U=V?V.cross?.5:V.uP+.02:u?.765+.03*(m-4):v.range(.4,.66),F=V?V.cross?-14:V.side*4:u?m===4?9:-12:(v.chance(.5)?-1:1)*v.range(12,30);g(U),f.cx=e.x+M.x*F+(V?i.x*24:0),f.cz=e.z+M.z*F+(V?i.z*24:0),f.cy=v.range(11,15)+(V?0:v.range(0,5)),u&&(f.cy=6.5+1.6*(m-4),f.R=9+3*(m-4),f.w=.5*(m===4?1:-1),f.ph=m===4?5:.82),V&&V.cross?V.pass=[[.55,11,1]].map(H=>{g(H[0]);const B=E0(H[0]).elevDeg*l0+(H[0]>.8?.13:0);return{u:H[0],X:f0(e.x,e.y+H[1]*Math.tan(B),e.z-H[1]),dir:H[2]}}):V&&n(V),h.push(f)}function n(m){m.dir=m.side<0?1:-1,m.uF=m.uP-.016,g(m.uP),m.S=f0(e.x+i.x*m.ahead-M.x*m.side*.8,0,e.z+i.z*m.ahead-M.z*m.side*.8),m.E=f0(m.S.x+i.x*54-M.x*m.side*3.4,9,m.S.z+i.z*54-M.z*m.side*3.4),m.uE=m.uP+.078,m.hOut=Math.atan2(m.E.x-m.S.x,-(m.E.z-m.S.z)),g(m.uF),m.near=m.near||4.6,m.A1=f0(e.x+i.x*m.near+M.x*m.side*.62,e.y+.25,e.z+i.z*m.near+M.z*m.side*.62),m.hFly=Math.atan2(i.x,-i.z),m.sgn=Math.sign(m.side),m.hDive=Math.atan2(m.S.x-m.A1.x,-(m.S.z-m.A1.z))}const S={sc:{uP:.596,ahead:38,side:-5,near:8},ph:1.3,w:.5,R:13,size:1.2,seed:4.2,cy:12.5};g(S.sc.uP+.02),S.cx=e.x+M.x*S.sc.side*4+i.x*24,S.cz=e.z+M.z*S.sc.side*4+i.z*24,n(S.sc);{const U=[],F=Math.ceil(c/.05);for(let H=0;H<=F;H++)d.posAtDist(Math.min(H*.05,c),z),U.push(z.x,z.y,z.z);for(const H of[...h,S]){const B=2+1.54*H.size;for(let j=0;j<3;j++){let X=1/0,J=0,K=0,a0=0,Q=0;for(let n0=0;n0<U.length;n0+=3){const p0=U[n0]-H.cx,m0=U[n0+2]-H.cz,$=Math.sqrt(p0*p0+m0*m0)-H.R,O=Math.max(Math.abs(U[n0+1]-H.cy)-.8,0),Z=Math.sqrt($*$+O*O);Z<X&&(X=Z,J=U[n0],K=U[n0+2],a0=$,Q=O)}if(!(X<B))break;const d0=Math.sqrt(B*B-Q*Q)-a0,u0=Math.hypot(H.cx-J,H.cz-K);H.cx+=(H.cx-J)/u0*d0,H.cz+=(H.cz-K)/u0*d0}}}function D(m,V,f){const u=G(.255,.283,V),U=G(.312,.338,V),F=G(0,.8,Math.sin(m*.9+1.7));g(V);const H=Y(-7,5.6,u)-19*U+.25*Math.sin(m*.41),B=Y(7,1.9,u)+12*U+.2*Math.sin(m*.53+1);f.x=e.x+i.x*H+M.x*B,f.z=e.z+i.z*H+M.z*B,f.y=Y(2.6,1.55,u)+1.6*U+.07*Math.sin(m*1.3),f.head=Math.atan2(i.x,-i.z)-.16*u*(1-U)+.5*U,f.pitch=.03+.08*U,f.bank=-.2*u*(1-U)-.45*U+.04*Math.sin(m*.6),f.phase=m*6.2832*1.1+.6,f.amp=.14+.34*F,f.tuck=0,f.dark=1}const N=new w.Vector3,E=(m,V)=>{const f=i0((m-.835)/.085,0,2),u=Math.min(f,1),U=Math.max(f-1,0),F=G(.775,.825,m),H=14-23*G(.34,.76,u)-26*U+52*(1-F),B=E0(m).elevDeg+3+4.5*u-3*U,j=6.5+7*u+150*U*U+18*(1-F);b(m,N);const X=Math.cos(B*l0)*j;return V.set(N.x+Math.sin(H*l0)*X,N.y+Math.sin(B*l0)*j,N.z-Math.cos(H*l0)*X)},C=new w.Vector3,A=new w.Vector3,q=(m,V,f)=>{const u=m.ph+V*m.w;return f.set(m.cx+Math.cos(u)*m.R,m.cy+.8*Math.sin(V*.37+m.seed),m.cz+Math.sin(u)*m.R),u},I=new w.Vector3,T=new w.Vector3,y=new w.Vector3,W=(m,V,f)=>m+Math.atan2(Math.sin(V-m),Math.cos(V-m))*f;function k(m,V,f,u){const U=q(m,V,T),F=m.sc;u.head=Math.atan2(-Math.sin(U)*m.w,-Math.cos(U)*m.w),u.pitch=.03,u.bank=-.42*Math.sign(m.w);const H=G(.55,.9,Math.sin(V*.5+m.seed*3));if(u.phase=V*2*6.2832*.55+m.seed,u.amp=.5*H,u.tuck=0,u.dark=1,I.copy(T),F&&F.cross){for(const B of F.pass){const j=f-B.u;if(j<-.05||j>.045)continue;const X=j*400*.5,J=G(-.05,-.026,j)*(1-G(.03,.045,j));y.set(B.X.x+B.dir*X,B.X.y+.01*X*X-.1*X,B.X.z+.03*X*X),I.lerpVectors(T,y,J),u.head=W(u.head,Math.atan2(B.dir,-.06*X),J),u.pitch=Y(u.pitch,.02,J),u.bank=Y(u.bank,-1.15*B.dir,J),u.amp=Y(u.amp,.1,J),u.dark=1-.45*J}if(f>.775){E(f-.003,C),E(f+.003,A),E(f,I);const B=G(.795,.825,f)*(1-G(.915,.94,f)),j=Math.atan2(A.x-C.x,-(A.z-C.z));u.head=j-1*B,u.pitch=i0((A.y-C.y)/Math.max(Math.hypot(A.x-C.x,A.z-C.z),.001),-.3,.3)*(1-B)+.04,u.bank=.2+.85*B+.05*Math.sin(V*.7+m.seed),u.amp=Y(.45,.1,B),u.phase=V*6.2832*1.2+m.seed,u.dark=1-.3*B}}else if(F){const B=F.uP-.115,j=F.uP-.066,X=F.uF,J=F.uP+.012;if(f>B&&f<=X){const K=G(B,j,f),a0=G(j,X-.012,f),Q=G(X-.026,X-.006,f);g(f);const d0=Y(17,F.near,a0),u0=F.side*Y(3,.62,a0);y.set(e.x+i.x*d0+M.x*u0,e.y+Y(5.5,.25,a0),e.z+i.z*d0+M.z*u0),I.lerpVectors(T,y,K),u.head=W(u.head,Math.atan2(i.x,-i.z)+F.dir*.22*(1-a0),K)-F.sgn*.62*Q,u.pitch=Y(.03,.12*a0,K)+.62*Q,u.bank=Y(u.bank,-F.dir*.22*(1-a0),K)+F.sgn*.42*Q,u.amp=Y(u.amp,.5*(1-a0)+.08,K)*(1-Q),u.phase=V*2*6.2832*.6+m.seed}else if(f>X&&f<=F.uP){const K=(f-X)/(F.uP-X);I.lerpVectors(F.A1,F.S,K*(.55+.45*K)),I.y=F.A1.y*(1-K*K)+.25*(1-K);const a0=G(0,.35,K);u.head=W(F.hFly-F.sgn*.62,F.hDive,a0),u.pitch=Y(.62,Y(-1.26,-.8,G(.1,.8,K)),a0),u.bank=F.sgn*.42*(1-a0),u.tuck=.7*G(0,.4,K),u.amp=0,u.phase=0}else if(f>F.uP&&f<=J){const K=(f-F.uP)/.012;I.copy(F.S),I.y=-.8*Math.sin(Math.PI*K),I.x+=(F.E.x-F.S.x)*.04*K,I.z+=(F.E.z-F.S.z)*.04*K,u.head=W(F.hDive,F.hOut,G(.1,.9,K)),u.pitch=Y(-.8,.55,K),u.bank=0,u.tuck=.7-.45*K,u.amp=.7*K,u.phase=V*2*6.2832}else if(f>J&&f<=F.uE+.06){const K=i0((f-J)/(F.uE-J),0,1.6),a0=Math.min(K,1);y.lerpVectors(F.S,F.E,.04),I.lerpVectors(y,F.E,K),I.y=F.E.y*Math.sin(a0*Math.PI*.5)*(.25+.75*a0)+Math.max(K-1,0)*6,u.head=F.hOut,u.pitch=Y(.55,.14,a0),u.bank=.12*Math.sin(K*5+m.seed),u.tuck=.25*(1-G(0,.12,K)),u.amp=1.25,u.phase=V*2*6.2832+m.seed;const Q=G(1,1.6,K);Q>0&&(I.lerp(T,Q),u.amp=Y(1.25,.4*H,Q),u.pitch*=1-Q)}}u.x=I.x,u.y=I.y,u.z=I.z}function R(m,V,f){const u=G(.512,.56,V),U=G(.635,.69,V),F=G(.715,.775,V),H=G(.815,.875,V),B=u*(1-H),j=Y(-9,4.3,u)+3.2*U-1*F+60*H+.2*Math.sin(m*.37),X=Y(Y(Y(8,2.3,u),-3.6,U),1.5,F)-26*H*H+.2*Math.sin(m*.5+1);g(V),f.x=e.x+i.x*j+M.x*X,f.z=e.z+i.z*j+M.z*X,f.y=e.y+Y(Y(Y(3.2,.75,u),-1.6,U),.95,F)+6*H+.12*Math.sin(m*.8+2);const J=G(.1,.9,Math.sin(m*.62+.8));if(f.head=Math.atan2(i.x,-i.z)-.38*B*(1-U)+.36*U*(1-F)*(1-H)-.34*F*(1-H)-.5*H*H,f.pitch=.05+.1*H,f.bank=-.62*B*(1-U)-.6*U*(1-F)*(1-H)-.52*F*(1-H)+.05*Math.sin(m*.6),f.phase=m*6.2832*1.05,f.amp=.1+.3*J,f.tuck=0,f.dark=1,V<.3){const K=G(0,.1,V),a0=G(.105,.24,V),Q=Y(6.2,11.5,K)+70*a0,d0=Y(-2.9,-3.4,K)-30*a0*a0;f.x=e.x+i.x*Q+M.x*d0,f.z=e.z+i.z*Q+M.z*d0,f.y=e.y+Y(.2,-1.5,K)+9*a0+.15*Math.sin(m*.8+2),f.head=Math.atan2(i.x,-i.z)+.34-.3*K-.5*a0,f.pitch=.04+.12*K+.1*a0,f.bank=Y(-.55,-.12,K)+.05*Math.sin(m*.6),f.amp=.12+.3*J+.35*K}return f}const P={},_={};function e0(m,V,f,u){const U=r.a.array,F=r.b.array,H=r.c.array;{const B=a;R(V,u,P),U[B*4]=P.x,U[B*4+1]=P.y,U[B*4+2]=P.z,U[B*4+3]=P.head,F[B*4]=P.pitch,F[B*4+1]=P.bank,F[B*4+2]=u>.505||u<.27?1.26:0,F[B*4+3]=1,H[B*4]=P.phase%6283.2,H[B*4+1]=P.amp,H[B*4+2]=0,H[B*4+3]=2.1}for(let B=0;B<a;B++){const j=h[B];if(k(j,V,u,P),U[B*4]=P.x,U[B*4+1]=P.y,U[B*4+2]=P.z,U[B*4+3]=P.head,F[B*4]=P.pitch,F[B*4+1]=P.bank,F[B*4+2]=j.size,F[B*4+3]=P.dark,H[B*4]=P.phase%6283.2,H[B*4+1]=P.amp,H[B*4+2]=P.tuck,H[B*4+3]=j.seed,B<5&&u<.75&&l.uShad.value[10+B].set(P.x,Math.max(P.y,.2),P.z,1.5),j.sc&&j.sc.S&&B<6){const X=i0((u-j.sc.uP)*40/2.6,0,1);l.uSplash.value[B].set(j.sc.S.x,j.sc.S.z,X>=1?0:X,1)}}u<.75&&(u>.53||u<.27?l.uShad.value[15].set(U[a*4],U[a*4+1],U[a*4+2],1.7):a<6&&l.uShad.value[15].set(0,-999,0,0));{const B=a+1,j=S,X=u>.255&&u<.34;X?D(V,u,P):k(j,V,u,P),U[B*4]=P.x,U[B*4+1]=P.y,U[B*4+2]=P.z,U[B*4+3]=P.head,F[B*4]=P.pitch,F[B*4+1]=P.bank,F[B*4+2]=j.size,F[B*4+3]=1,H[B*4]=P.phase%6283.2,H[B*4+1]=P.amp,H[B*4+2]=P.tuck,H[B*4+3]=j.seed,X&&u>.27&&l.uShad.value[15].set(P.x,Math.max(P.y,.2),P.z,1.6);const J=i0((u-j.sc.uP)*40/2.6,0,1);l.uSplash.value[5].set(j.sc.S.x,j.sc.S.z,J>=1?0:J,1)}r.a.needsUpdate=!0,r.b.needsUpdate=!0,r.c.needsUpdate=!0}return{mesh:s,update:e0,besideAt(m,V,f){return R(m,V,_),f.set(_.x,_.y,_.z)},fireAt(m,V){return E(m,V)}}}function lt(t){const{rng:o,U:l,detail:d}=t,x=o.fork("crowns"),L=Math.round(300*d),v=6*L,a=new w.InstancedBufferGeometry;a.setAttribute("position",new w.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),a.setIndex([0,1,2,0,2,3]);const c=new Float32Array(v*4);for(let b=0;b<v;b++)c[b*4]=Math.floor(b/L)+.5,c[b*4+1]=x.range(0,6.2832),c[b*4+2]=x(),c[b*4+3]=x();a.setAttribute("aSeed",new w.InstancedBufferAttribute(c,4)),a.instanceCount=v;const r=new w.ShaderMaterial({uniforms:l,fog:!0,transparent:!0,depthWrite:!1,blending:w.CustomBlending,blendEquation:w.AddEquation,blendSrc:w.OneFactor,blendDst:w.OneMinusSrcAlphaFactor,vertexShader:`
      attribute vec4 aSeed; uniform vec4 uSplash[6];
      varying vec2 vUv; varying float vA; varying float vK; varying float vS;
      #include <fog_pars_vertex>
      void main(){
        vec4 s = uSplash[0];
        if (aSeed.x > 1.) s = uSplash[1]; if (aSeed.x > 2.) s = uSplash[2]; if (aSeed.x > 3.) s = uSplash[3]; if (aSeed.x > 4.) s = uSplash[4]; if (aSeed.x > 5.) s = uSplash[5];
        float tau = s.z * 2.6;                                        // seconds since it went in
        float late = aSeed.w * 0.25;
        float tt = max(tau - late, 0.);
        // (polish 1: spray, not blobs) two fifths of them are soft ragged veils of mist that make the plume's core and its foot;
        // the rest are fine bright drops thrown up in a coronet (the outer ones low and wide, the inner ones a jet 2 m high)
        float mist = step(aSeed.z, 0.4), zz = clamp((aSeed.z - 0.4) / 0.6, 0., 1.), mz = clamp(aSeed.z / 0.4, 0., 1.);
        float vr = mix(0.5 + 2.6 * zz * zz, 0.25 + 1.2 * mz, mist);
        float vy = mix(7.4 * (0.35 + 0.65 * (1. - zz)) * (0.70 + 0.30 * aSeed.w), 5.6 * (1. - mz) * (0.6 + 0.4 * aSeed.w) + 0.8, mist);
        float gr = mix(4.9, 3.6, mist);
        vec3 c = vec3(s.x + cos(aSeed.y) * (0.15 + vr * tt), max(vy * tt - gr * tt * tt, 0.02), s.y + sin(aSeed.y) * (0.15 + vr * tt));
        float size = mix((0.030 + 0.040 * aSeed.w) * (1. + 0.3 * tt), (0.11 + 0.15 * aSeed.w) * (1. + 0.9 * min(tt, 1.2)), mist);
        vK = mist; vS = aSeed.y * 7.3 + aSeed.w * 31.;
        vec4 mvPosition = viewMatrix * vec4(c, 1.);
        size = max(size, -mvPosition.z * 0.0016 * (1. - mist));           // a drop never smaller than about a pixel: it thins instead
        mvPosition.xy += position.xy * size * vec2(1., 1. + 0.8 * (1. - mist));   // drops drawn out a little along their fall
        gl_Position = projectionMatrix * mvPosition;
        vUv = position.xy;
        vA = step(0.0005, s.z) * smoothstep(0., 0.05, tt) * (1. - smoothstep(0.55, 1.0 + 0.5 * mist, tt)) * smoothstep(5.0, 10.0, -mvPosition.z);
        #include <fog_vertex>
      }`,fragmentShader:`
      precision highp float;
      uniform vec3 uSunCol; uniform vec3 uSHot; uniform vec3 uFill; uniform vec3 uSkyHor; uniform vec4 uSea; uniform vec4 uLit;
      varying vec2 vUv; varying float vA; varying float vK; varying float vS;
      ${S0}
      #include <fog_pars_fragment>
      void main(){
        float r2 = dot(vUv, vUv);
        float mk = clamp(vK, 0., 1.);
        float veil = exp(-r2 * 2.6) * (1. - smoothstep(0.6, 1., r2)) * smoothstep(0.25, 0.75, sVN(vUv * 2.1 + vS) + 0.35 * sVN(vUv * 5.3 - vS)) * 0.34;
        float a = mix(exp(-r2 * 3.0) * (1. - smoothstep(0.7, 1., r2)) * 0.80, veil, mk) * clamp(vA, 0., 1.);
        // white water: never dimmer than the bright horizon sky it scatters (before sunrise the Sun term alone would leave it dull)
        vec3 col = max(uSunCol * uLit.x * 0.70 + uFill * 1.5, uSkyHor * 1.02) + uSHot * 0.4 * uSea.y;
        col *= mix(vec3(1.), mix(vec3(0.50, 0.62, 0.70), vec3(1.04, 1.0, 0.94), fract(vS * 0.37)), mk);      // the veils are shaded: sunlit and blue-grey by turns
        gl_FragColor = vec4(col * a, a);
        #include <fog_fragment>
      }`}),s=new w.Mesh(a,r);return s.name="crowns",s.frustumCulled=!1,s.renderOrder=3,{mesh:s,update(){}}}function L0(t,o,l){return new w.ShaderMaterial({uniforms:t,fog:!0,side:w.DoubleSide,vertexShader:`
      attribute vec4 iA; attribute vec4 iB;
      varying vec3 vWP; varying vec3 vN; varying vec3 vL; varying float vSeed;
      uniform vec4 uSea;
      #include <fog_pars_vertex>
      void main(){
        vec3 p = position; vec3 n = normal; float t = uSea.z;
        float c = cos(iA.w), s = sin(iA.w);
        ${o}
        p = vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z); n = vec3(c * n.x + s * n.z, n.y, -s * n.x + c * n.z);
        vWP = p + iA.xyz; vN = n; vL = position; vSeed = iB.w;
        vec4 mvPosition = viewMatrix * vec4(vWP, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      precision highp float;
      varying vec3 vWP; varying vec3 vN; varying vec3 vL; varying float vSeed;
      ${M0}
      ${S0}
      ${k0}
      ${C0}
      ${F0}
      uniform vec3 uRudist;
      #include <fog_pars_fragment>
      void main(){
        vec3 n = normalize(vN + vec3(0., 1e-4, 0.));
        vec3 col; float up = 0.5 + 0.5 * n.y;
        ${l}
        col *= seaLight(vWP, 1., 1., 1.) * (0.55 + 0.45 * up);
        gl_FragColor = vec4(seaThrough(col, vWP), 1.);
        #include <fog_fragment>
      }`})}function B0(t,o){const l=new w.InstancedBufferGeometry;l.index=t.index;for(const v in t.attributes)l.setAttribute(v,t.attributes[v]);const d=o.length/8,x=new Float32Array(d*4),L=new Float32Array(d*4);for(let v=0;v<d;v++)for(let a=0;a<4;a++)x[v*4+a]=o[v*8+a],L[v*4+a]=o[v*8+4+a];return l.setAttribute("iA",new w.InstancedBufferAttribute(x,4)),l.setAttribute("iB",new w.InstancedBufferAttribute(L,4)),l.instanceCount=d,l}async function ct(t){const{ctx:o,rng:l,U:d,path:x,detail:L,density:v,ground:a}=t,c=l.fork("seagrass"),r=[],s=[],b=[];for(let g=0;g<2;g++){const n=Math.cos(g*1.9),S=Math.sin(g*1.9),D=r.length/3,N=g*.07-.03;for(let E=0;E<=3;E++){const C=E/3,A=.5*(1-.6*C*C);r.push(N-n*A,C,-S*A+g*.05,N+n*A,C,S*A+g*.05),s.push(-S,.3,n,-S,.3,n)}for(let E=0;E<3;E++){const C=D+E*2;b.push(C,C+1,C+3,C,C+3,C+2)}}const e=new w.BufferGeometry;e.setAttribute("position",new w.Float32BufferAttribute(r,3)),e.setAttribute("normal",new w.Float32BufferAttribute(s,3)),e.setIndex(b);const z=Math.round(4600*L*Math.min(v,1.1)),p=[];let h=0;for(;p.length/8<z&&h++<z*9;){const g=c.range(-20,x.length+30),n=c.range(-1,1),S=Math.sign(n)*Math.pow(Math.abs(n),1.4)*38,D=x.posAtDist(g),N=x.tangentAtDist(g),E=D.x-N.z*S,C=D.z+N.x*S;h%40===0&&await o.yield();const A=E-a.edgeAt(C)>34;if(A&&i0((a.grassAt(E,C)-.5)*3.2+.5,0,1)<.62)continue;const q=a.heightAt(E,C);q>-2.2||q<-10.5||!A&&a.grassMask(E,C,q)<.62||(p.push(E,q-.02,C,c.range(0,6.28),c.range(.55,1),c.range(.045,.075),c.range(.7,1.2),c()),h%150===0&&await o.yield())}const i=L0(d,`
      float y = p.y, w = iA.x * 0.31 + iA.z * 0.23;
      float bend = y * y * (0.42 * iB.z + 0.20 * sin(t * 0.8 + w) + 0.07 * sin(t * 1.7 + w * 2.3 + iB.w * 6.));
      p.x *= iB.y; p.z *= iB.y; p.y = y * iB.x * (1. - 0.25 * bend * bend);
      vec2 ld = vec2(c, -s);                                   // undo the tuft's own turn so every blade leans the same way
      p.x += ld.x * bend * iB.x; p.z += ld.y * bend * iB.x;`,`
      float y = vL.y;
      col = mix(uGrass * 0.34, uGrass * 0.95 + vec3(0.10, 0.12, 0.02), y * y) * (0.75 + 0.5 * vSeed);
      col = mix(col, vec3(0.62, 0.66, 0.40), smoothstep(0.82, 1.0, y) * 0.55);     // pale tips
      up = 1.;`),M=new w.Mesh(B0(e,p),i);return M.name="seagrass",M.frustumCulled=!1,M}async function ht(t){const{ctx:o,rng:l,U:d,detail:x,ground:L}=t,v=l.fork("rudists"),a=[],c=[],r=[],s=6;for(let p=0;p<s;p++){const h=p/s*6.2832;a.push(Math.cos(h),1,Math.sin(h)),c.push(Math.cos(h),-.25,Math.sin(h))}for(let p=0;p<s;p++){const h=p/s*6.2832;a.push(Math.cos(h)*1.04,1.001,Math.sin(h)*1.04),c.push(Math.cos(h)*.35,.9,Math.sin(h)*.35)}a.push(0,0,0),c.push(0,-1,0),a.push(0,1.075,0),c.push(0,1,0);for(let p=0;p<s;p++){const h=(p+1)%s;r.push(p,h,2*s,s+p,2*s+1,s+h)}const b=new w.BufferGeometry;b.setAttribute("position",new w.Float32BufferAttribute(a,3)),b.setAttribute("normal",new w.Float32BufferAttribute(c,3)),b.setIndex(r);const e=[[],[]];for(const p of L.mounds){const h=t.path.nearestXZ(p.x,p.z).dist,i=Math.round((h<7.5?1500:h<13?700:h<21?220:80)*x),M=e[p.z>-40?0:1];let g=0,n=0;for(;g<i&&n++<600;){const S=v.range(0,6.2832),D=Math.sqrt(v())*p.r*1.02,N=p.x+Math.cos(S)*D,E=p.z+Math.sin(S)*D,C=v.range(.55,1)*(1-.3*D/p.r),A=v.int(5,9),q=v.range(.06,.095);n%6===0&&await o.yield();for(let I=0;I<A&&g<i;I++,g++){const T=I*2.4+v.range(-.3,.3),y=I===0?0:q*1.9*Math.sqrt(I)*.74,W=N+Math.cos(T)*y,k=E+Math.sin(T)*y,R=L.heightAt(W,k),P=v.range(.55,.95)*C,_=Math.min(R+P*.45,-1.25);M.push(W,_-P,k,v.range(0,6.28),P,q*v.range(.85,1.2),v.range(-.55,.55),v())}}await o.yield()}const z=L0(d,`
      p.xz *= iB.y; p.y *= iB.x;
      p.x += p.y * p.y * iB.z * 0.9;                          // each horn curves its own way a little, like a cow's horn
      n = normalize(n);`,`
      float ring = (0.82 + 0.18 * sin(vL.y * 34. + vSeed * 9.)) * (0.84 + 0.16 * sin(atan(vL.z, vL.x + step(abs(vL.x) + abs(vL.z), 1e-5) * 1e-3) * 11. + vSeed * 20.));   // growth rings round the horn, ribs down it
      col = uRudist * 1.08 * ring * (0.75 + 0.5 * vSeed) * (0.50 + 0.50 * smoothstep(0.30, 1.0, vL.y)) * mix(vec3(1.), keepWarm(vWP), 0.45);   // shade between the pipes
      float lid = smoothstep(0.995, 1.02, vL.y);
      col = mix(col, uRudist * 1.25, lid * 0.6);
      col = mix(col, vec3(0.36, 0.52, 0.30) * 0.8, smoothstep(0.38, 0.7, sVN(vWP.xz * 2.1 + vSeed * 5.)) * 0.75 * smoothstep(0.55, 1.02, vL.y));   // algal fuzz, on the tops only
      col *= 1. - 0.35 * smoothstep(0.90, 0.985, vL.y) * (1. - lid);                      // the dark slit under the lid's rim
      col *= 1. + 0.25 * lid * up;
      float fd = smoothstep(12., 34., length(uCamL - vWP));                                 // (polish 3) far off: one warm crust, sunlit side and shaded side, no net of dark gaps
      col = mix(col, uRudist * (0.92 + 0.2 * vSeed) * mix(vec3(1.), vec3(0.72, 0.95, 0.66), step(0.72, vSeed)) * keepWarm(vWP), fd);`);return t.hornGeo=b,t.hornMat=z,e.map((p,h)=>{const i=new w.Mesh(B0(b,p),z);return i.name="rudists"+h,i.frustumCulled=!1,i})}async function dt(t){const{ctx:o,U:l,ground:d}=t,x=o.core.makeRng("reefheads:"+o.seed),L=[],v=[],a=[],c=7,r=14;for(let n=0;n<=c;n++){const S=n/c*Math.PI*.5,D=Math.pow(Math.cos(S),.7),N=Math.pow(Math.sin(S),.85);for(let E=0;E<r;E++){const C=E/r*6.2832,A=1+.16*Math.sin(C*3+n*1.3)+.09*Math.sin(C*5+2+n*2.1)+(n>0&&n<c?.11*Math.sin(C*7+n*2.9)*Math.sin(n*1.7+C*2):0);L.push(Math.cos(C)*D*A,N,Math.sin(C)*D*A),v.push(Math.cos(C)*Math.cos(S),Math.sin(S)+.15,Math.sin(C)*Math.cos(S))}}for(let n=0;n<c;n++)for(let S=0;S<r;S++){const D=n*r+S,N=n*r+(S+1)%r,E=D+r,C=N+r;a.push(D,E,N,N,E,C)}const s=new w.BufferGeometry;s.setAttribute("position",new w.Float32BufferAttribute(L,3)),s.setAttribute("normal",new w.Float32BufferAttribute(v,3)),s.setIndex(a);const b=[],e=[];for(const n of d.mounds){const S=x.int(8,12),D=t.path.nearestXZ(n.x,n.z).dist;for(let N=0;N<S;N++){const E=N>=S-2,C=x.range(0,6.2832),A=E?n.r*x.range(1.15,1.6):Math.sqrt(x())*n.r*.95,q=n.x+Math.cos(C)*A,I=n.z+Math.sin(C)*A,T=d.heightAt(q,I),y=(E?x.range(.45,.8):x.range(.8,1.7))*(1-.25*A/(n.r*1.6)),W=Math.min(y*x.range(.55,.95),-1.15-(T-.25));if(W<.2||t.path.nearestXZ(q,I).dist<1.2&&T+W>-1.6)continue;const k=x.range(0,6.28),R=x.range(-.3,.5),P=x();b.push(q,T-.25,I,k,W+.25,y,R,P),e.push({x:q,y0:T-.25,z:I,turn:k,H:W+.25,wide:y,st:R,dPath:D,first:n.z>-40})}await o.yield()}const z=L0(l,`
      p.xz *= iB.y; p.x *= 1. + 0.4 * iB.z; p.y *= iB.x;
      n = normalize(vec3(n.x / max(iB.y * (1. + 0.4 * iB.z), 0.05), n.y / max(iB.x, 0.05), n.z / max(iB.y, 0.05)));`,`
      float bump = sFbm(vWP.xz * 1.7 + vSeed * 9.);
      float nearK = 1. - smoothstep(10., 30., length(uCamL - vWP));
      // (polish 5) a head is a bouquet of horns seen end on: every cell one round lid, domed and pale, with the dark slit under its
      // rim and deep shade between neighbours; lids of mixed sizes, each its own tone. The cells are laid on the dome itself (the
      // look-up slides outward down its flanks), so they stay round there: the old lattice ran into stripes on every steep side.
      vec2 cp = (vWP.xz + n.xz * (vWP.y + 3.) * 0.85) * 5.4 + (vec2(sVN(vWP.xz * 1.9), sVN(vWP.xz * 1.9 + 5.)) - .5) * 0.8;
      vec2 ci = floor(cp), cf = fract(cp);
      float d1 = 9., id = 0.; vec2 rv = vec2(0., 1.);
      for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
        vec2 o = vec2(float(i), float(j)); vec2 hh = vec2(sH21(ci + o), sH21(ci + o + 7.3));
        vec2 rr = o + 0.22 + 0.56 * hh - cf; float dd = dot(rr, rr);
        if (dd < d1) { d1 = dd; id = hh.x; rv = rr; }
      }
      float rd = sqrt(d1), RR = 0.28 + 0.18 * id;
      float lid = 1. - smoothstep(RR - 0.07, RR, rd);
      float slit = smoothstep(RR - 0.04, RR + 0.03, rd) * (1. - smoothstep(RR + 0.04, RR + 0.20, rd));
      float gap = smoothstep(RR + 0.02, RR + 0.26, rd);
      vec2 sdir = normalize(uSunDir.xz + vec2(1e-4, 0.));
      float domeL = 0.84 + 0.42 * dot(-rv / max(rd, 1e-3), sdir) * smoothstep(0., RR, rd) * uLit.w;
      vec3 fine = uRudist * (0.34 + 0.78 * lid) * (0.74 + 0.50 * id) * domeL * (1. - 0.45 * slit) * (1. - 0.50 * gap);
      fine = mix(fine, fine * vec3(1.10, 0.86, 0.70), step(0.62, fract(id * 7.3)) * 0.6);                    // some horns are redder, some paler
      fine = mix(fine, vec3(0.36, 0.52, 0.30) * (0.65 + 0.5 * lid), lid * smoothstep(0.50, 0.72, sFbm(vWP.xz * 1.1 + vSeed * 31.)) * 0.55);   // algal fuzz on some lids
      vec3 coarse = uRudist * (0.66 + 0.46 * bump) * (0.82 + 0.36 * vSeed);
      coarse = mix(coarse, vec3(0.32, 0.49, 0.27) * (0.7 + 0.5 * bump), smoothstep(0.42, 0.68, sVN(vWP.xz * 0.9 + vSeed * 31.)) * smoothstep(0.25, 0.85, vL.y) * 0.62);
      col = mix(coarse, fine * (0.86 + 0.30 * vSeed), nearK);
      col *= mix(vec3(1.), keepWarm(vWP), 0.45);
      vec3 nb = normalize(n + vec3(-rv.x, 0., -rv.y) * 0.9 * smoothstep(0.05, RR, rd) * lid * nearK);          // every lid is a small dome of its own
      float sl = clamp(dot(nb, normalize(uSunDir + vec3(0., 0.6, 0.))), 0., 1.);
      col *= mix(1., 0.42 + 0.98 * sl, uLit.w) * (0.50 + 0.50 * smoothstep(0.0, 0.45, vL.y));   // a sunlit side, a shaded side, a dark foot
      up = 1.;`),p=new w.Mesh(B0(s,b),z);p.name="reefheads",p.frustumCulled=!1;const h=o.core.makeRng("headhorns:"+o.seed),i=[[],[]];let M=0;for(const n of e){const S=Math.round((n.dPath<9?12+17*n.wide*n.wide:n.dPath<17?4+6*n.wide*n.wide:0)*t.detail),D=Math.cos(n.turn),N=Math.sin(n.turn),E=i[n.first?0:1];for(let C=0;C<S;C++){const A=h.range(0,6.2832),q=Math.asin(.12+.88*h()),I=Math.pow(Math.cos(q),.7),T=Math.pow(Math.sin(q),.85),y=Math.cos(A)*I*n.wide*(1+.4*n.st),W=Math.sin(A)*I*n.wide,k=n.x+D*y+N*W,R=n.z-N*y+D*W,P=n.y0+T*n.H,_=h.range(.3,.58)*(.72+.28*Math.min(n.wide/1.5,1)),e0=Math.min(P+.52*_,-1.02);E.push(k,e0-_,R,-Math.atan2(R-n.z,k-n.x),_,h.range(.055,.1),(1-T)*h.range(.6,1.5)+h.range(-.2,.2),h())}++M%5===0&&await o.yield()}const g=i.map((n,S)=>{n.length||n.push(0,-999,0,0,.1,.05,0,0);const D=new w.Mesh(B0(t.hornGeo,n),t.hornMat);return D.name="headHorns"+S,D.frustumCulled=!1,D});return{mesh:p,horns:g}}function ut(){const t=new w0,o=s0("#C98A3C",.9),l=s0("#F1E3C0",.85),d=s0("#D9A27A",.8),x=[.03,.03,.03],L=.5,v=18,a=[],c=[[],[]];for(let r=0;r<v;r++){const s=r/v*6.2832,b=1-.16*((s/6.2832+.3)%1),e=Math.sin(s)*L*b,z=-Math.cos(s)*L*b-.05,p=r%6===0?l:o;a.push(t.v(0,e,z,p,[0,0,0,0]));for(let h=0;h<2;h++)c[h].push(t.v((h?-1:1)*.085,e*.55,(z+.05)*.55-.05,o,[0,0,0,0]))}for(let r=0;r<2;r++){const s=t.v((r?-1:1)*.05,0,-.05,s0("#8E5A24",.8));for(let b=0;b<v;b++){const e=(b+1)%v;r?(t.quad(a[b],a[e],c[r][e],c[r][b]),t.tri(c[r][b],c[r][e],s)):(t.quad(a[b],c[r][b],c[r][e],a[e]),t.tri(c[r][b],s,c[r][e]))}}for(let r=0;r<10;r++){const s=r/10*6.2832,b=Math.cos(s)*.045,e=-.26+Math.sin(s)*.06,z=t.v(b*1.3,e+.02,.36,d,[0,.2,r,1]),p=t.v(b*1.3,e-.02,.36,d,[0,.2,r,1]),h=t.v(b*1.6,e+.012,.62,d,[0,.6,r,1]),i=t.v(b*1.6,e-.012,.62,d,[0,.6,r,1]),M=t.v(b*1.2,e,.92,l,[0,1,r,1]);t.quad(z,p,i,h),t.tri(h,i,M)}for(const r of[-1,1]){const s=t.v(r*.075,-.2,.33,x),b=t.v(r*.075,-.25,.37,x),e=t.v(r*.075,-.25,.29,x);t.tri(s,b,e)}return t.build()}function ft(t){const{rng:o,U:l,path:d,detail:x,density:L,manyAmmonites:v}=t,a=o.fork("ammonites"),c=Math.round((v?430:300)*(x<1?.5:1)*Math.min(L,1.15)),r=c+Math.round((v?190:180)*(x<1?.5:1)),s=y0(ut(),r),b=new w.Mesh(s.geo,b0(l,`
    if (aW.w > 0.5) {                                              // the arms: they close together on each jet and trail open between
      float pulse = sin(iC.x), s = aW.y;
      p.x *= 1. + 0.9 * s * (0.5 - 0.5 * pulse); p.y += s * s * 0.10 * sin(iC.x * 0.5 + aW.z * 1.3) - s * 0.05 * pulse;
      p.z += s * 0.10 * pulse;
    }`,`
    float rr = length(vL.yz + vec2(0., 0.05)), an = atan(vL.y, -vL.z - 0.05 + step(abs(vL.y) + abs(vL.z + 0.05), 1e-5) * 1e-3);
    float flame = smoothstep(0.62, 0.92, sin(an * 7. + rr * 16. + sin(rr * 30.) * 0.8) * 0.5 + 0.5) * smoothstep(0.08, 0.3, rr) * (1. - vW.w);
    alb = mix(alb * vec3(1.0, 0.80, 0.50), vec3(0.80, 0.68, 0.42) * vFade, flame * 0.9);          // amber, with cream flames
    gloss = 0.6 * (1. - vW.w);`));b.name="ammonites",b.frustumCulled=!1;const e=d.posAtDist(.185*d.length),z=f0(.94,0,-.34),p=f0(0,0,1),h=26,i=[];for(let D=0;D<r;D++){const N=a.gauss();if(D>=c){const E=t.ground.mounds[3],C=a.chance(.45),A=a.range(.188,.238),q=d.posAtDist(A*d.length),I=C?q.x+a.gauss()*3.2:E.x+a.gauss()*6.5,T=C?q.z+a.gauss()*3.2:E.z+a.gauss()*8.5,y=(I-e.x)/z.x;i.push({al:y+h*.5,ac:T-e.z-z.z*y,y:-.42-a.range(0,.46),ph:a.range(0,6.28),sp:a.range(.25,.5),size:a.range(.36,.5),yaw:a.range(-.5,.5),f:a.range(.75,1.1)});continue}i.push({al:h*.5+i0(N*4.4,-h*.5,h*.5),ac:a.range(-34,34),y:-.5-a.range(0,.5)-(a.chance(.4)?a.range(.4,1.7):0),ph:a.range(0,6.28),sp:a.range(.35,.6),size:a.range(.38,.52),yaw:a.range(-.3,.3),f:a.range(.75,1.1)})}const M=new w.InstancedBufferGeometry;M.setAttribute("position",new w.Float32BufferAttribute([-1,0,-1,1,0,-1,1,0,1,-1,0,1],3)),M.setIndex([0,2,1,0,3,2]),M.setAttribute("iA",s.a),M.setAttribute("iB",s.b),M.instanceCount=r;const g=new w.Mesh(M,new w.ShaderMaterial({uniforms:l,fog:!1,transparent:!0,depthWrite:!1,side:w.DoubleSide,blending:w.CustomBlending,blendEquation:w.AddEquation,blendSrc:w.OneFactor,blendDst:w.OneMinusSrcAlphaFactor,vertexShader:`
      attribute vec4 iA; attribute vec4 iB; uniform sampler2D uChart; uniform vec4 uChartBox; uniform vec3 uSunDir; uniform vec4 uShadK;
      varying vec2 vUv; varying float vK;
      void main(){
        vec2 sh = normalize(uSunDir.xz + vec2(1e-4, 0.));
        float dep = textureLod(uChart, clamp((iA.xz - uChartBox.xy) * uChartBox.zw, 0.002, 0.998), 0.).r * 32.;
        float fall = clamp(dep + iA.y, 0., 12.);
        vec2 c = iA.xz - sh * fall * uShadK.y;
        dep = textureLod(uChart, clamp((c - uChartBox.xy) * uChartBox.zw, 0.002, 0.998), 0.).r * 32.;
        float rad = iB.z * (0.50 + 0.05 * fall);
        vec3 wp = vec3(c.x + position.x * rad, -dep + 0.16, c.y + position.z * rad);
        vUv = position.xz; vK = 1. / (1. + 0.22 * fall);
        gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
      }`,fragmentShader:`
      precision highp float;
      uniform vec4 uLit; varying vec2 vUv; varying float vK;
      void main(){
        float a = (1. - smoothstep(0.15, 1., length(vUv))) * 0.62 * clamp(vK, 0., 1.) * uLit.w;
        gl_FragColor = vec4(vec3(0.0, 0.035, 0.05) * a, a);
      }`}));g.name="ammoniteShadows",g.frustumCulled=!1,g.renderOrder=.4;const n=Math.atan2(z.x,-z.z);function S(D,N,E,C){const A=s.a.array,q=s.b.array,I=s.c.array;for(let T=0;T<r;T++){const y=i[T],W=N*6.2832*y.f*.8+y.ph,k=y.al-h*.5+y.sp*40*(C-.185)+.12*Math.sin(W),R=1;A[T*4]=e.x+z.x*k+p.x*y.ac,A[T*4+1]=y.y+.05*Math.sin(W*.5),A[T*4+2]=e.z+z.z*k+p.z*y.ac,A[T*4+3]=n+y.yaw+.08*Math.sin(W*.5),q[T*4]=.1*Math.cos(W),q[T*4+1]=.5+.12*Math.sin(W*.5+y.ph),q[T*4+2]=y.size*R,q[T*4+3]=1.25,I[T*4]=W%6283.2,I[T*4+1]=0,I[T*4+2]=0,I[T*4+3]=0}s.a.needsUpdate=!0,s.b.needsUpdate=!0,s.c.needsUpdate=!0}return{mesh:b,shadows:g,update:S}}function pt(){const t=new w0,o=s0("#6E6A45",.95),l=s0("#4A4630",.9),d=s0("#E0D8B8",.8),x=s0("#6F7052",.85),L=s0("#3E4232",.85),v=[.02,.02,.02],a=(e,z,p)=>[Y(e[0],z[0],p),Y(e[1],z[1],p),Y(e[2],z[2],p)],c=[[-.375,.03,.01,.008,.035],[-.36,.032,.04,.02,.135],[-.31,.036,.085,.032,.255],[-.22,.04,.124,.04,.345],[-.1,.042,.148,.045,.395],[.02,.042,.153,.046,.405],[.14,.04,.143,.044,.375],[.26,.038,.118,.04,.305],[.36,.036,.088,.033,.215],[.45,.034,.052,.025,.12],[.52,.032,.01,.008,.02]],r=22,s=[];for(const e of c){const z=t.n;for(let p=0;p<r;p++){const h=p/r*Math.PI*2,i=Math.cos(h),M=Math.sin(h),g=e[4]*Math.sign(i)*Math.pow(Math.abs(i),.82),n=M>0?e[1]+e[2]*(Math.pow(M,1.3)+.07*Math.exp(-i*i*40)):e[1]+e[3]*M*(1-.35*i*i);t.v(g,n,e[0],a(d,a(l,o,G(.05,.5,M)),G(-.3,-.02,M)))}s.push(z)}for(let e=0;e<s.length-1;e++)for(let z=0;z<r;z++)t.quad(s[e]+z,s[e]+(z+1)%r,s[e+1]+(z+1)%r,s[e+1]+z);const b=[0,0,0,2];t.loft([[-.685,.03,.01,.012,L,d],[-.665,.04,.034,.042,L,d],[-.62,.052,.058,.078,x,d],[-.56,.06,.07,.098,x,d],[-.5,.06,.068,.094,x,d],[-.44,.054,.058,.078,x,d],[-.36,.045,.05,.07,x,d],[-.3,.04,.04,.06,x,d]],12,b);for(const e of[-1,1]){const z=e*.092,p=.078,h=-.585,i=.017,M=t.v(z+e*.006,p,h,v,b),g=[];for(let k=0;k<6;k++){const R=k/6*6.2832;g.push(t.v(z-e*.004,p+Math.sin(R)*i,h+Math.cos(R)*i*1.25,v,b))}for(let k=0;k<6;k++)e>0?t.tri(M,g[(k+1)%6],g[k]):t.tri(M,g[k],g[(k+1)%6]);const n=t.v(z+e*.008,p+.009,h-.004,[2,2,2],b),S=t.v(z+e*.008,p+.002,h+.003,[2,2,2],b),D=t.v(z+e*.008,p+.002,h-.011,[2,2,2],b);e>0?t.tri(n,S,D):t.tri(n,D,S);const N=9,E=4,C=[],A=[];for(let k=0;k<=N;k++){const R=k/N,P=e*(.27+.62*R),_=-.24+.08*R+.34*R*R,e0=(.085+.14*Math.sin(Math.PI*Math.pow(R,.8)*.82))*Math.sqrt(Math.max(1-Math.pow(R,6),.02)),m=.034*(1-.72*R)+.005,V=.035-.035*R,f=[],u=[];for(let U=0;U<=E;U++){const F=U/E,H=Math.sin(Math.PI*Math.pow(F,.6))*m,B=[e,R,F,1];f.push(t.v(P,V+H,_+e0*F,a(x,L,F*.6),B)),u.push(t.v(P,V-H*.7,_+e0*F,a(d,x,.25+.3*F),B))}C.push(f),A.push(u)}const q=(k,R,P,_)=>{e>0?t.quad(k,R,P,_):t.quad(k,_,P,R)};for(let k=0;k<N;k++)for(let R=0;R<E;R++)q(C[k][R],C[k][R+1],C[k+1][R+1],C[k+1][R]),q(A[k][R],A[k+1][R],A[k+1][R+1],A[k][R+1]);const I=[[.13,.36,.05],[.21,.44,.085],[.25,.54,.1],[.25,.63,.085],[.22,.7,.03]],T=[],y=[],W=[];for(let k=0;k<I.length;k++){const R=I[k],P=[e,k/(I.length-1),0,3];T.push(t.v(e*(R[0]-R[2]),.03,R[1]+R[2]*.3,L,P)),y.push(t.v(e*(R[0]+R[2]),.026,R[1]-R[2]*.3,x,P)),W.push(t.v(e*R[0],.044,R[1],x,P))}for(let k=0;k<I.length-1;k++)q(T[k],T[k+1],W[k+1],W[k]),q(W[k],W[k+1],y[k+1],y[k]),q(T[k],y[k],y[k+1],T[k+1])}return t.loft([[.5,.03,.016,.022,L,d],[.56,.028,.012,.014,L,d],[.61,.026,.004,.004,L,d]],6,[0,0,0,3]),t.build()}function mt(t){const{rng:o,U:l,path:d}=t,x=o.fork("turtles"),L=6,v=d.length,a=y0(pt(),L),c=new w.Mesh(a.geo,b0(l,`
    if (aW.w > 0.5 && aW.w < 1.5) {                                 // front flippers row together: down and back, then feathered forward
      float s = aW.y, st = iC.x;
      p.y += s * (0.24 * sin(st) - 0.05); p.z += s * 0.20 * cos(st) + 0.05 * s;
      p.y += (aW.z - 0.5) * 0.08 * cos(st) * s;
    } else if (aW.w > 2.5) { p.y += aW.y * 0.04 * sin(iC.x + 1.6); }
    else if (aW.w > 1.5) { float k = clamp((-p.z - 0.36) / 0.3, 0., 1.); p.y += k * iC.y * 0.16; p.z += k * iC.y * 0.02; }   // the head lifts to breathe`,`
    if (vW.w < 0.5 && vL.y > 0.030) {
      // (polish 4) real scutes: five vertebrals down the midline, four costals a side, a ring of marginals on the flared rim; each
      // plate has streaks that radiate from its own centre and growth rings round it; dark grooves between plates, never a checker
      vec2 q = vec2(abs(vL.x), vL.z);
      float d1 = 9., d2 = 9., id = 0.; vec2 dv1 = vec2(1., 0.);
      for (int i = 0; i < 5; i++) {
        vec2 dv = (q - vec2(0., -0.27 + 0.16 * float(i))) * vec2(1.3, 1.);
        float d = dot(dv, dv); if (d < d1) { d2 = d1; d1 = d; dv1 = dv; id = float(i); } else if (d < d2) d2 = d;
      }
      for (int i = 0; i < 4; i++) {
        float fi = float(i);
        vec2 dv = (q - vec2(0.235 - 0.022 * abs(fi - 1.) - 0.022 * fi, -0.19 + 0.16 * fi)) * vec2(0.85, 1.);
        float d = dot(dv, dv); if (d < d1) { d2 = d1; d1 = d; dv1 = dv; id = 5. + fi; } else if (d < d2) d2 = d;
      }
      float r1 = sqrt(d1), e = sqrt(d2) - r1;
      float rim = 1. - smoothstep(0.052, 0.072, vL.y);                          // the marginals: low on the dome, all the way round
      float ang = atan(vL.z - 0.05, vL.x + step(abs(vL.x) + abs(vL.z - 0.05), 1e-5) * 1e-3);
      float mseg = abs(fract(ang * 3.6) - 0.5);
      float groove = mix(1. - smoothstep(0.006, 0.020, e), max(smoothstep(0.40, 0.47, mseg), 1. - smoothstep(0.004, 0.012, abs(vL.y - 0.064))), rim);
      float a2 = atan(dv1.y, dv1.x + step(abs(dv1.x) + abs(dv1.y), 1e-5) * 1e-3);
      float streak = sVN(vec2(a2 * 4.5 + id * 7.1, r1 * 9. + id)) * (1. - rim) + sVN(vec2(ang * 9., 3.)) * rim;
      float rings = 0.90 + 0.10 * sin(r1 * 150.) * (1. - rim);
      vec3 plate = mix(alb * 0.50, alb * 1.25 + vec3(0.10, 0.065, 0.0), smoothstep(0.25, 0.75, streak)) * rings * (0.85 + 0.3 * sVN(vec2(id * 3.7, 1.)));
      plate *= 1. - 0.25 * smoothstep(0.02, 0.10, r1) * (1. - rim);                // each plate is palest at its boss
      alb = mix(plate, alb * 0.22, groove * 0.85);
      gloss = 0.9;
    } else if (vW.w > 0.5 && vCol.g > 0.05 && vCol.g < 1.2) {
      // head plates and flipper scales: dark plates edged with pale skin, large on the head and the leading edge, small toward the trailing edge
      float big = vW.w > 1.5 && vW.w < 2.5 ? 26. : mix(30., 46., vW.z);
      vec2 sq = vL.xz * big; sq.x += 0.5 * floor(sq.y);
      vec2 sf = abs(fract(sq) - 0.5);
      float seam = smoothstep(0.30, 0.46, max(sf.x, sf.y)) * (1. - smoothstep(0.6, 2.2, length(fwidth(sq))));
      float top = smoothstep(-0.1, 0.25, vN.y);
      alb = mix(alb, mix(alb * (0.55 + 0.35 * sVN(floor(sq) * 1.7)), vec3(0.62, 0.60, 0.44), seam * 0.75), top);
      gloss = 0.7;
    }`));c.name="turtles",c.frustumCulled=!1;const s=[[.2536,1,1],[.272,-3,1],[.655,3.2,1],[.715,-2.8,1],[.799,1.9,1],[.813,-2.9,1]].map(e=>{const z=d.posAtDist(e[0]*v),p=d.tangentAtDist(e[0]*v);return{u:e[0],x:z.x-p.z*e[1],z:z.z+p.x*e[1],head:Math.atan2(p.x,-p.z)+x.range(-.12,.12)+(e[1]>0?-.1:.1),up:e[2],ph:x.range(0,6.28),size:x.range(1,1.15)}});s[0].head+=2.2,s[0].size=1.25,s[0].ph=2.75;function b(e,z,p,h){const i=a.a.array,M=a.b.array,g=a.c.array;for(let n=0;n<L;n++){const S=s[n],D=z*Math.PI+S.ph,N=Math.exp(-Math.pow((h-S.u+.014)/.024,2)),E=S.up?N:.25*N,C=9+110*(h-S.u)+.1*Math.sin(D);i[n*4]=S.x+Math.sin(S.head)*(C-9),i[n*4+1]=Y(-.42,-.06,E)+.03*Math.sin(D),i[n*4+2]=S.z-Math.cos(S.head)*(C-9),i[n*4+3]=S.head,M[n*4]=.05*Math.sin(D)+.22*E,M[n*4+1]=.05*Math.sin(D*.5),M[n*4+2]=S.size,M[n*4+3]=1.5,g[n*4]=D%6283.2,g[n*4+1]=E,g[n*4+2]=0,g[n*4+3]=0,l.uSw.value[n].set(i[n*4],i[n*4+1],i[n*4+2],.74*S.size)}a.a.needsUpdate=!0,a.b.needsUpdate=!0,a.c.needsUpdate=!0}return{mesh:c,update:b,firstAt(e){const z=a.a.array;return e.set(z[0],.1,z[2])}}}async function vt(t){const{rng:o,sky:l,look:d,lookName:x,portalPos:L,detail:v}=t,a=o.fork("clouds"),c=(S,D,N=L)=>[N.x+Math.sin(S*l0)*D,N.z-Math.cos(S*l0)*D],r=new w.Group;r.name="farSky";const[s,b]=c(-36,3600),e=D0({rng:a,sky:l,at:[[s,430,b,1050],[s-640,400,b+120,620]],height:1.2,puffs:Math.round(62*v),litColor:d.cloudLit,shadeColor:d.cloudShade,bottomColor:"#5F7C93",wind:[.6,0,.2],fogFade:.25,farFade:[7e3,8600],opacity:.92});r.add(e.object),await t.ctx.yield();const z=[],p=d.wind>.5,h=Math.round((p?30:20)*(v<1?.6:1));for(let S=0;S<h;S++){let D=a.range(-178,178);D>-60&&D<-16&&(D+=78);const N=Math.abs(D)<16,E=a.range(3400,5200)*(p&&!N?a.range(.5,1):1),C=N?a.range(240,380):a.range(380,p?620:760),[A,q]=c(D,E,f0(0,0,0));z.push([A,N?70:a.range(110,190),q,C])}const i=D0({rng:a,sky:l,at:z,height:.42,puffs:Math.round(26*v),litColor:d.cloudLit,shadeColor:d.cloudShade,wind:[.8,0,.3],fogFade:.3,farFade:[7200,8600],opacity:.9,noiseTexture:e.noiseTexture});r.add(i.object),await t.ctx.yield();const M=new w.PlaneGeometry(1,1,1,1),g=new w.ShaderMaterial({uniforms:{uCol:{value:h0("#5F7C93").multiplyScalar(x==="firstLight"?.75:.95)},uHor:{value:h0(d.fog)},uA:{value:x==="pearl"?.55:.72}},transparent:!0,depthWrite:!1,depthTest:!0,fog:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      precision highp float; varying vec2 vUv; uniform vec3 uCol; uniform vec3 uHor; uniform float uA;
      void main(){
        float x = abs(vUv.x - 0.5) * 2.;
        float hx = 1. - smoothstep(0.0, 1.0, x); hx *= hx;
        float a = hx * (1. - smoothstep(0.30, 1.0, vUv.y)) * smoothstep(0.0, 0.05, vUv.y) * uA;
        vec3 col = mix(uHor * 0.8, uCol, smoothstep(0.0, 0.30, vUv.y));
        gl_FragColor = vec4(col, a);
      }`}),n=new w.Mesh(M,g);n.name="shade";{const[S,D]=c(-28,3e3);n.scale.set(4600,1500,1),n.position.set(S,745,D)}return n.lookAt(L.x,300,L.z),n.renderOrder=2.2,n.frustumCulled=!1,r.add(n),{group:r,update(S,D,N){e.update(S,D,N),i.update(S,D,N)}}}async function gt(t){const{rng:o,detail:l,density:d,path:x,U:L}=t,v=o.fork("fish"),a=x.length,c=Math.round(640*(l<1?.5:1)*Math.min(d,1.1)),r=4,s=c*r,b=(n,S,D)=>{const N=x.posAtDist(n*a),E=x.tangentAtDist(n*a).clone().setY(0).normalize();return[N.x-E.z*S+E.x*D,N.z+E.x*S+E.z*D]},e=[[...b(.455,-1,6),9.5],[...b(.085,7.5,4),6.5],[...b(.295,2.2,10.5),5.2],[...b(.775,7,2),7.5]];L.uShoal={value:e.map((n,S)=>new w.Vector4(n[0],n[1],n[2],S%2?-1:1))};const z=new w.InstancedBufferGeometry;z.setAttribute("position",new w.Float32BufferAttribute([0,0,-.5,0,.2,-.12,0,-.2,-.12,0,.045,.3,0,-.045,.3,0,.19,.5,0,-.19,.5],3)),z.setIndex([0,1,2,1,3,4,1,4,2,3,5,4,4,5,6]);const p=new Float32Array(s*4);for(let n=0;n<s;n++)p[n*4]=Math.floor(n/c)+.5,p[n*4+1]=Math.pow(v(),.8),p[n*4+2]=v.range(0,6.2832),p[n*4+3]=v(),n%600===0&&await t.ctx.yield();z.setAttribute("iF",new w.InstancedBufferAttribute(p,4)),z.instanceCount=s;const h=new w.ShaderMaterial({uniforms:L,fog:!0,side:w.DoubleSide,vertexShader:`
      attribute vec4 iF; uniform vec4 uShoal[4]; uniform vec4 uSea; uniform vec3 uCamL;
      varying vec3 vWP; varying float vGl; varying float vB;
      #include <fog_pars_vertex>
      void main(){
        vec4 s = uShoal[0];
        if (iF.x > 1.) s = uShoal[1]; if (iF.x > 2.) s = uShoal[2]; if (iF.x > 3.) s = uShoal[3];
        float t = uSea.z, sd = iF.w, R = s.z;
        // a mill: every fish circles the same way, the inner ones faster; the whole shoal breathes in and out and leans as it turns
        float rr = R * (0.16 + 0.84 * iF.y) * (0.88 + 0.12 * sin(t * 0.35 + sd * 19.));
        float ang = iF.z + s.w * t * (0.10 + 0.50 * R / (rr + 0.5 * R)) * 0.55;
        vec2 e = vec2(cos(ang), sin(ang));
        vec3 c = vec3(s.x + e.x * rr, -1.15 - 1.5 * fract(sd * 7.31) - 0.5 * iF.y + 0.12 * sin(t * 0.9 + sd * 40.), s.y + e.y * rr * 0.78);
        vec2 hd = normalize(vec2(-e.y, e.x * 0.78)) * s.w;
        float dist = length(uCamL - c);
        float len = (0.15 + 0.09 * fract(sd * 3.7)) * max(1., dist * 0.022);          // never thinner than a pixel and a half: it grows a little with distance
        float roll = 0.95 * sin(t * (0.9 + 1.3 * fract(sd * 5.3)) + sd * 60.);         // rolling on its long axis: now the dark back, now the bright flank
        vec3 fw = vec3(hd.x, 0., hd.y), sdw = vec3(-hd.y, 0., hd.x);
        vec3 upv = vec3(0., cos(roll), 0.) + sdw * sin(roll);
        float wag = 0.10 * sin(t * 9. + sd * 31.) * (position.z + 0.5);
        vWP = c - fw * position.z * len + upv * position.y * len * 1.15 + sdw * wag * len;
        float fl = max(sin(t * (0.55 + 0.9 * fract(sd * 9.1)) + sd * 90.), 0.); fl *= fl; fl *= fl; fl *= fl;
        vGl = fl * abs(sin(roll)); vB = 0.75 + 0.5 * fract(sd * 13.3);
        vec4 mvPosition = viewMatrix * vec4(vWP, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      precision highp float;
      varying vec3 vWP; varying float vGl; varying float vB;
      ${M0}
      ${S0}
      ${k0}
      ${C0}
      ${F0}
      #include <fog_pars_fragment>
      void main(){
        float gl = clamp(vGl, 0., 1.);
        vec3 col = mix(vec3(0.050, 0.085, 0.10) * clamp(vB, 0.5, 1.3), vec3(0.80, 0.90, 0.92), gl);     // slate-blue backs; a flank turned to the light is silver
        col *= seaLight(vWP, 1., 1., 1.) * (1. + 1.6 * gl);
        gl_FragColor = vec4(seaThrough(col, vWP), 1.);
        #include <fog_fragment>
      }`}),i=new w.Mesh(z,h);i.name="fish",i.frustumCulled=!1;const M=new w.Group;M.name="fishShoals",M.add(i);const g=[[[.6,...b(.872,-6.5,12),7]],[[.2,...b(.34,4.8,3.3),2.3],[.5,...b(.8,4.5,7),6]],[[.4,...b(.748,-10,0),8.5],[.778,...b(.848,-3.5,8),6]],[]];return{group:M,spots:e,update(n,S,D,N){for(let E=0;E<4;E++){let C=e[E];for(const q of g[E])N>q[0]&&(C=[q[1],q[2],q[3]]);const A=L.uShoal.value[E];A.x=C[0],A.y=C[1],A.z=C[2]}}}}function xt(t){const{rng:o,U:l,ground:d,endDir:x,endRight:L}=t,v=o.fork("logs"),a=new w0,c=s0("#D8D0BE",.78),r=s0("#A79E8C",.7),s=[];for(let g=0;g<=12;g++){const n=g/12,S=.5*(1-.45*n)*(1+1.1*Math.exp(-n*14))*(1+.06*Math.sin(n*40));s.push([n-.5,.5*.5+.03*Math.sin(n*9),S*.5,S*.5,g%2?c:[c[0]*.9,c[1]*.9,c[2]*.9],r])}a.loft(s,8);for(const g of[[-.22,.6,.2],[.02,-.7,.24],[.2,.4,.16],[-.38,-.3,.3]]){const n=g[0],S=g[1],D=g[2],N=Math.sin(S)*.2,E=.25+Math.cos(S)*.2,C=a.v(N-.05,E,n-.035,r),A=a.v(N+.05,E,n+.035,r),q=a.v(N,E+.03,n+.05,c),I=a.v(N+Math.sin(S)*D,E+Math.cos(S)*D*.9+.05,n-.04,c);a.tri(C,A,I),a.tri(A,q,I),a.tri(q,C,I)}const b=5,e=y0(a.build(),b),z=new w.Mesh(e.geo,b0(l,"p.z *= iC.x; p.xy *= iC.y;",`
    float gr = sVN(vec2(vL.x * 40. + vL.y * 30., vL.z * 3.)) * 0.5 + sVN(vec2(vL.x * 9., vL.z * 1.2)) * 0.5;
    alb *= 0.72 + 0.5 * gr; alb *= 1. - 0.35 * smoothstep(0.62, 0.7, sVN(vL.zx * vec2(2.2, 31.)));           // weathered grain and checks`));z.name="driftLogs",z.frustumCulled=!1;const p=e.a.array,h=e.b.array,i=e.c.array,M=[[0,-22,1.2],[0,38,-1.4],[1,20,1.6],[1,-30,-1]];for(let g=0;g<b;g++){const n=d.spit,S=M[g]||[0,0,0],D=d.armC[S[0]];let N=D.x+L.x*S[1]+x.x*S[2]*-3.2,E=D.z+L.z*S[1]+x.z*S[2]*-3.2,C=Math.atan2(L.x,-L.z);g===4&&(N=n.x+n.ax*17+n.az*1.5,E=n.z+n.az*17-n.ax*1.5,C=Math.atan2(n.ax,-n.az)+.25);const A=v.range(6,9);p[g*4]=N,p[g*4+1]=d.heightAt(N,E)-.1,p[g*4+2]=E,p[g*4+3]=C+v.range(-.35,.35),h[g*4]=v.range(-.02,.03),h[g*4+1]=v.range(-.3,.3),h[g*4+2]=1,h[g*4+3]=1,i[g*4]=A,i[g*4+1]=v.range(.9,1.2),i[g*4+2]=0,i[g*4+3]=0}return{mesh:z,update(){}}}function wt(t){const{U:o,sunDir:l}=t,d=t.spitBirds||[],x=Math.max(d.length,1),L=new w.InstancedBufferGeometry;L.setAttribute("position",new w.Float32BufferAttribute([-1,0,0,1,0,0,1,0,1,-1,0,1],3)),L.setIndex([0,2,1,0,3,2]);const v=new Float32Array(x*4);for(let e=0;e<d.length;e++)v[e*4]=d[e].x,v[e*4+1]=d[e].y+.045,v[e*4+2]=d[e].z,v[e*4+3]=d[e].u0;L.setAttribute("iS",new w.InstancedBufferAttribute(v,4)),L.instanceCount=d.length;const a=Math.asin(i0(l.y,.12,1)),c=i0(.42/Math.tan(a),.3,2.2),r=Math.max(Math.hypot(l.x,l.z),.001);o.uProg={value:0},o.uSpitSh={value:new w.Vector4(-l.x/r,-l.z/r,c,.2)};const s=new w.ShaderMaterial({uniforms:o,fog:!1,transparent:!0,depthWrite:!1,side:w.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,vertexShader:`
      attribute vec4 iS; uniform vec4 uSpitSh; uniform float uProg;
      varying vec2 vUv; varying float vOn;
      void main(){
        vec2 d = uSpitSh.xy, c = vec2(-d.y, d.x);
        vec3 wp = iS.xyz + vec3(d.x, 0., d.y) * (position.z * uSpitSh.z - 0.10) + vec3(c.x, 0., c.y) * position.x * uSpitSh.w;
        wp.y -= 0.02 + 0.03 * position.z;
        vUv = vec2(position.x, position.z); vOn = 1. - smoothstep(iS.w - 0.001, iS.w + 0.004, uProg);
        gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
      }`,fragmentShader:`
      precision highp float;
      uniform vec4 uLit; varying vec2 vUv; varying float vOn;
      void main(){
        float x = clamp(abs(vUv.x), 0., 1.), y = clamp(vUv.y, 0., 1.);
        float a = (1. - smoothstep(0.35 + 0.4 * y, 1., x)) * smoothstep(0., 0.06, y) * (1. - smoothstep(0.55, 1., y)) * 0.50 * clamp(vOn, 0., 1.) * uLit.w;
        gl_FragColor = vec4(vec3(0.05, 0.08, 0.12) * a, a);
      }`,blending:w.CustomBlending,blendEquation:w.AddEquation,blendSrc:w.OneFactor,blendDst:w.OneMinusSrcAlphaFactor}),b=new w.Mesh(L,s);return b.name="spitShadows",b.frustumCulled=!1,b.renderOrder=.5,b}async function yt(t){const{ctx:o,scene:l,hero:d,U:x,look:L,lookName:v,path:a,sky:c,second:r,A:s,portalPos:b,pal:e,detail:z}=t,p=_0(a),h=Math.asin(i0(t.sunDir.y,.05,1));x.uShadK={value:new w.Vector4(1/Math.tan(h),Math.tan(Math.asin(Math.cos(h)/1.33)),3.7,.93)},x.uLit.value.w=L.sunEl>2?1:0,x.uSplash={value:Array.from({length:6},()=>new w.Vector4(0,0,0,1))},x.uSw={value:Array.from({length:6},()=>new w.Vector4(0,-999,0,.6))},x.uRudist={value:h0("#D9A06B").multiplyScalar(.9)},x.uWrack={value:h0("#3A3226").multiplyScalar(.6)};const i=G0(t);t.ground=i,await K0(t,i),await o.yield();const M=await j0(t,i);l.add(M),await o.yield(),l.add(Q0(t)),await o.yield();const g=[],n=await ot(t);l.add(n.mesh,n.roost,n.party),g.push(n);const S=wt(t);l.add(S),await o.yield();const D=it(t);l.add(D.mesh),g.push(D),await o.yield(),l.add(lt(t).mesh),await o.yield(),l.add(await ct(t)),await o.yield();const N=await ht(t);l.add(N[0],N[1]),await o.yield();const E=await dt(t);l.add(E.mesh,E.horns[0],E.horns[1]),await o.yield(),await o.yield();const C=ft(t);l.add(C.mesh,C.shadows),g.push(C),await o.yield();const A=mt(t);l.add(A.mesh),g.push(A),await o.yield();const q=await vt(t);l.add(q.group),g.push(q),await o.yield();const I=await gt(t);if(l.add(I.group),g.push(I),await o.yield(),l.add(xt(t).mesh),await o.yield(),t.juvenile){const J=await q0(o,{palette:e,rng:t.rng.fork("juvenile"),detail:.6,length:5,sunColor:L.sunSea,tailSweep:1.25});l.add(J.object);const K={};g.push({update(a0,Q,d0,u0){p(i0(u0-.004,0,1),K);const n0=K.heading;J.setPose(K.x+3.8*Math.cos(n0)+1.5*Math.sin(n0),K.z-3.8*Math.sin(n0)+1.5*Math.cos(n0),n0+.06*Math.sin(Q*.7),.78*K.surfaced,i0((u0-A0-.012)/.04,0,1),K.dive),J.update(a0,Q+1.3,U.light)}}),await o.yield()}await o.yield(),await o.yield();const T=new w.Vector3,y=new w.Vector3,W=new w.Vector3,k=new w.Vector3,R=new w.Vector3,P=new w.Vector3,_=new w.Vector3,e0=new w.Vector3,m=new w.Vector3,V=f0(t.sunDir.x,0,t.sunDir.z).normalize(),f={},u={},U=d.state,F=x.uSHot.value.clone().lerp(h0("#FFC97F"),.5),H=h0("#FFBE6E"),B=f0(i.mounds[1].x,-2,i.mounds[1].z),j=f0(i.spit.x+i.spit.tx*4,.4,i.spit.z+i.spit.tz*4);function X(J,K,a0,Q){d.setProgress(Q),x.uProg.value=Q,S.visible=Q>.36&&Q<.62,p(Q,u),d.setMosasaur(u.x,u.z,u.heading,u.surfaced,u.breath,u.dive),d.update(J,K,a0),c.update(J,K,a0),r.position.copy(U.dir).multiplyScalar(400),x.uSHot.value.copy(H).lerp(F,G(.05,.8,U.fire));const d0=U.light*L.tide;r.intensity=d0,x.uSea.value.y=d0,x.uStrL.value.copy(U.dir);const u0=Math.max(U.elevDeg,4)*l0;x.uShadK.value.z=1/Math.tan(u0),x.uShadK.value.w=Math.tan(Math.asin(Math.cos(u0)/1.33)),a0.getWorldPosition(T);for(let n0=0;n0<g.length;n0++)g[n0].update(J,K,a0,Q,T);N[0].visible=Q<.445,N[1].visible=Q>.44,E.horns[0].visible=Q<.445,E.horns[1].visible=Q>.44,C.mesh.visible=Q<.32,C.shadows.visible=Q<.32,n.roost.visible=Q>.42,n.party.visible=Q>.29&&Q<.62}return X(0,0,new w.PerspectiveCamera,0),{scene:l,path:a,duration:40,pace:H0,title:"The Growing Crescent \xB7 66 million years ago",camera:{fov:62,near:.3,far:9e3,lookAhead:30,sway:.4,bank:.5},pois:[{at:B,from:.035,to:.135,weight:.7},{at:(J,K)=>(a.posAtDist(K*a.length,_),_.set(_.x+V.x*26,-.6,_.z+V.z*26)),from:.115,to:.215,weight:.55},{at:(J,K)=>A.firstAt(R),from:.205,to:.268,weight:.64},{at:j,from:.4,to:.545,weight:.5},{at:(J,K)=>D.besideAt(J,K,k),from:.545,to:.655,weight:.42},{at:(J,K)=>(a.posAtDist((K+.078)*a.length,P),P.y=-4,P),from:.645,to:.752,weight:.72},{at:(J,K)=>(p(K,f),y.set(f.x+Math.sin(f.heading)*2.2,.2,f.z+Math.cos(f.heading)*2.2)),from:.275,to:.385,weight:.54},{at:(J,K)=>(a.posAtDist(K*a.length,W),W.addScaledVector(U.dir,300).setY(W.y-22)),from:.755,to:.955,weight:.5},{at:(J,K)=>D.fireAt(K,m),from:.795,to:.862,weight:.42,fade:.4},{at:(J,K)=>(a.posAtDist(K*a.length,e0),e0.addScaledVector(U.dir,300)),from:.712,to:.778,weight:.36,fade:.42}],portal:{shape:"circle",radius:7,color:"#D8FBF4",glow:.5,revealDistance:215,blendDistance:30},post:{exposure:L.exposure,bloom:{strength:.48,radius:.6,threshold:.92},grade:{saturation:1.12,contrast:1.09,tint:"#ffffff",shadowTint:"#04201f",vignette:.18,grain:.02,aberration:0}},ride:"none",companion:"none",style:"none",update:X,dispose(){c.dispose?.(),d.dispose?.()}}}export{kt as default};
