import*as e from"three";import{mergeGeometries as Be}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as Ue,lerp as Ee,smoothstep as R}from"../kit/core.js";const G=Math.PI*2,Dt=["#070c14","#14232e","#1d4f5a","#3b5a66","#0a1a22","#dfe9ee","#ffd27a"],F=6,Nt=38,He=41.1,ne=`
float tlHash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float tlNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(tlHash(i), tlHash(i + vec2(1, 0)), f.x), mix(tlHash(i + vec2(0, 1)), tlHash(i + vec2(1, 1)), f.x), f.y); }
float tlFbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 4; i++){ s += a * tlNoise(p); p = p * 2.03 + 17.1; a *= .5; } return s; }
`,Ce=`
uniform vec3 uLamp, uBeamDir, uLampCol, uAmb; uniform float uFlash, uBeamI;
vec3 tlWaterLight(vec3 wp){
  vec3 d = wp - uLamp; float dist = length(d); vec3 dir = d / max(dist, 1e-3);
  float cone = smoothstep(.991, .9994, abs(dot(dir, uBeamDir)));
  vec3 l = uAmb + uLampCol * (.3 / (1. + dist * dist / 500.));
  l += uLampCol * cone * uBeamI * 5.0 / (1. + dist / 70.);
  l += vec3(.75, .86, 1.) * uFlash * 1.6;
  return l;
}`,dt=`
#ifdef USE_FOG
  #ifdef FOG_EXP2
    float tlFf = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #else
    float tlFf = smoothstep(fogNear, fogFar, vFogDepth);
  #endif
#else
  float tlFf = 0.;
#endif`;function g(x,A,a=0){const b=x.attributes.position,U=b.count,H=new Float32Array(U*3),K=new Float32Array(U).fill(a);for(let q=0;q<U;q++){const J=typeof A=="function"?A(b.getX(q),b.getY(q),b.getZ(q),q):A;H[q*3]=J.r,H[q*3+1]=J.g,H[q*3+2]=J.b}return x.setAttribute("color",new e.BufferAttribute(H,3)),x.setAttribute("aGlow",new e.BufferAttribute(K,1)),x.attributes.uv||x.setAttribute("uv",new e.BufferAttribute(new Float32Array(U*2),2)),x}const kt=(x,A,a,b,U=0)=>(U&&x.rotateY(U),x.translate(A,a,b));function ht(x,A,a){return x.onBeforeCompile=b=>{for(const U of["uLamp","uLampCol","uFlash","uTime","uAmb","uOrigin","uWeather","uBeamDir","uBeamI"])b.uniforms[U]=A[U];b.vertexShader=b.vertexShader.replace("#include <common>",`#include <common>
attribute float aGlow; varying float vGlow, vNwY; varying vec3 vHW;`).replace("#include <project_vertex>",`#include <project_vertex>
 vGlow = aGlow; vNwY = normalize(mat3(modelMatrix) * objectNormal).y; vHW = (modelMatrix * vec4(transformed, 1.)).xyz;`),b.fragmentShader=b.fragmentShader.replace("#include <common>",`#include <common>
        varying float vGlow, vNwY; varying vec3 vHW; uniform float uTime; uniform vec3 uOrigin, uWeather;
        ${ne}${Ce} float tlFoam = 0.;`).replace("#include <color_fragment>",`#include <color_fragment>
        ${a?`{
          vec3 q = vHW - uOrigin; float ang = atan(q.x, q.z);
          float colm = tlHash(floor(q.xz * .8 + tlNoise(q.xz * .15) * 2.));
          diffuseColor.rgb *= mix(1., .5 + 1.0 * colm, smoothstep(.8, .4, vNwY) * .85) * (.8 + .4 * tlFbm(q.xz * 1.7 + q.y * .9));
          float ad = acos(clamp(dot(normalize(q.xz + 1e-4), uWeather.xz), -1., 1.)) / 3.14159;
          float ph = fract(uTime / 7. - .25 * ad);
          float pulse = smoothstep(0., .1, ph) * (1. - smoothstep(.1, .8, ph));
          float wl = .9 + (4.4 - 2.8 * ad) * pulse * vGlow;
          float hh = q.y + 1.6 * (tlNoise(q.xz * .22) - .5);
          float wet = smoothstep((9.5 - 5. * ad) * vGlow, 1., hh);
          diffuseColor.rgb *= mix(1., .55, wet) * (1. + .55 * smoothstep(.45, .9, vNwY));          // upward faces carry a wet sheen
          float wob = tlNoise(q.xz * .35) * 2.5;
          float streak = tlNoise(vec2(ang * 15. + wob, q.y * .5 + uTime * 2.4)) * .65 + tlNoise(vec2(ang * 44. + wob * 2., q.y * 1.4 + uTime * 4.3)) * .35;
          float run = smoothstep(wl + 4.5, wl, hh) * smoothstep(.6, .8, streak) * smoothstep(.35, .6, tlNoise(q.xz * .13 + 7.)) * (.2 + .8 * pulse);
          float lace = smoothstep(.35, .7, tlFbm(q.xz * .7 + uTime * .5));
          float outl = 1. - smoothstep(.4, .9, vGlow);                                   // outlying rocks: a broken, feathered wash, not a white skirt
          tlFoam = clamp(smoothstep(wl + .4 + 1.6 * outl, wl - 1.4, hh + 1.8 * outl * (lace - .5)) * mix(.2 + .8 * lace, lace * .42, outl) + run * vGlow, 0., 1.);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(.72, .78, .8), tlFoam);
        }`:""}`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
        ${a?`{ vec3 bq = vHW * .8; float b1 = tlFbm(bq.xz + bq.y * .37), b2 = tlFbm(bq.zx * 1.3 + bq.y * .61 + 9.);
          normal = normalize(normal + (viewMatrix * vec4(b1 - .5, 0., b2 - .5, 0.)).xyz * .45); }`:""}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
        roughnessFactor = mix(mix(roughnessFactor, .42, smoothstep(.45, .9, vNwY) * float(${a?1:0})), .9, tlFoam);`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        { vec3 Lw = uLamp - vHW; float dl = length(Lw);
          vec3 Lv = normalize((viewMatrix * vec4(Lw, 0.)).xyz);
          float nl = max(dot(normal, Lv), 0.) * .85 + .15;
          totalEmissiveRadiance += diffuseColor.rgb * uLampCol * nl * (2.4 / (1. + dl * dl / 46.) + .1 / (1. + dl * dl / 2600.));
          totalEmissiveRadiance += diffuseColor.rgb * uAmb * (.35 + .65 * (dot((viewMatrix * vec4(0., 1., 0., 0.)).xyz, normal) * .5 + .5));   // cold sky fill so forms read
          float up = dot((viewMatrix * vec4(0., 1., 0., 0.)).xyz, normal) * .5 + .5;
          totalEmissiveRadiance += diffuseColor.rgb * vec3(.7, .84, 1.) * uFlash * (.9 + up);
          ${a?`{ vec2 bx = vHW.xz - uLamp.xz; float bd = length(bx);                    // the beam's foot rims the outlying rocks warm as it passes
            float bc = smoothstep(.975, .9992, abs(dot(bx / max(bd, 1.), uBeamDir.xz))) * smoothstep(34., 52., bd);
            totalEmissiveRadiance += (diffuseColor.rgb + .012) * uLampCol * bc * uBeamI * 9. / (1. + bd / 110.) * (.25 + .75 * max(dot(normal, Lv), 0.)); }`:"totalEmissiveRadiance += vColor.rgb * vGlow;"}
          totalEmissiveRadiance += tlFoam * tlWaterLight(vHW) * .55; }`)},x.customProgramCacheKey=()=>"tempest-light-"+(a?"rock":"tower"),x}async function Rt(x,A={}){const a=x.rng.fork?x.rng.fork("tempest-light-hero"):x.rng,b=x.noise,U=(A.palette&&A.palette.length>=7?A.palette:Dt).map(t=>new e.Color(t)),[H,K,q,J,It,Pe,ve]=U,gt=new e.Color(A.red||"#8a2a20"),ze=new e.Color,Fe=(t,r,s,v=1)=>ze.copy(t).lerp(r,s).multiplyScalar(v),ie=A.weatherAngle??.52+a.range(-.18,.18),k=new e.Vector3(Math.sin(ie),0,Math.cos(ie)),wt=A.beamPeriod??6,_e=A.beamLength??400,yt=a.chance(.5)?1:-1,$e=a.range(0,G),Ye=a.range(.92,1.08),se=5.7*Ye,je=3.05*Ye,Xe=a.pick(["ogee","ogee","cone"]),fe=a.pick(["none","band","none","cap"]),pe=a.range(0,500),xt=a.range(1.08,1.25),Ke=a.range(0,Math.PI),Le=ie+a.range(-.5,.5),Qe=Le+Math.PI*a.range(.6,.9)*a.sign(),h={uTime:{value:0},uLamp:{value:new e.Vector3(0,He,0)},uBeamDir:{value:new e.Vector3(0,0,1)},uLampCol:{value:ve.clone()},uAmb:{value:new e.Color(A.ambient||"#5d7684").multiplyScalar(.55)},uFlash:{value:0},uBeamI:{value:A.beamIntensity??1},uOrigin:{value:new e.Vector3},uWeather:{value:k.clone()},uHero:{value:-1},uFlare:{value:0},uRot:{value:0},uFogCut:{value:A.beamFogCut??.8},uBeamLen:{value:_e}},le=()=>e.UniformsUtils.clone(e.UniformsLib.fog),T=new e.Group;T.name="tempest-light-hero";const bt=Math.cos(Ke),Mt=Math.sin(Ke),We=(t,r)=>{const s=Math.hypot(t,r)||1,v=t/s,l=r/s,u=v*bt+l*Mt;return 27.5*(1+(xt-1)*u*u)*(1+.15*b.n2(v*1.4+pe,l*1.4)+.07*b.n2(v*3.7,l*3.7+pe))},Ze=[Math.sin(Le),Math.cos(Le)],Je=[Math.sin(Qe),Math.cos(Qe)],et=a.range(0,G),tt=[Math.sin(et),Math.cos(et)];let Ge=0;const j=(t,r)=>{const s=Math.hypot(t,r),v=We(t,r),l=s/v;if(l>1)return-9*R(1,1.3,l)-.5+.6*b.n2(t*.2,r*.2);const u=t/(s||1),n=r/(s||1),f=Math.max(Math.pow(Math.max(0,u*Ze[0]+n*Ze[1]),1.5),.8*Math.pow(Math.max(0,u*Je[0]+n*Je[1]),2.5),1*Math.pow(Math.max(0,u*tt[0]+n*tt[1]),6)),m=b.ridged2(t*.03+pe,r*.03,4),o=Math.exp(-Math.pow((s-17)/7.5,2));let i=3.6+2.2*b.fbm2(t*.06,r*.06+pe,3)+(5+19*R(.08,.6,m))*o*(.14+.95*f);i=Math.min(i,20.5);const c=1-Math.pow(l,3.2);i=i*R(0,.42,c)*(.55+.45*c)+.5*b.n2(t*.3,r*.3);const d=2.6,p=(i+.7*b.n2(t*.11+9,r*.11))/d,M=Math.floor(p),C=(M+R(.52,.94,p-M))*d;return Ge=p-M,i=Ee(i,C,.88),i=Ee(F-.15,i,R(se+1.6,se+7.5,s)),i-1.2*R(.86,1,l)},de=[];{const s=new Float32Array(41067),v=new Float32Array(13689*3),l=[],u=new e.Color(K).lerp(H,.45),n=new e.Color(q).lerp(H,.55),f=new e.Color(J).lerp(K,.35);let m=0;for(let i=0;i<=116;i++){(i&15)===15&&await x.yield();for(let c=0;c<=116;c++,m+=3){let d=(c/116*2-1)*43,p=(i/116*2-1)*43;const M=b.n2(d*.5+31,p*.5)*.28,C=b.n2(d*.5,p*.5+77)*.28;c>0&&c<116&&i>0&&i<116&&(d+=M,p+=C);const w=j(d,p);s[m]=d,s[m+1]=w,s[m+2]=p;const S=.75+.5*b.fbm2(d*.16,p*.16,3)+.25*b.n2(d*1.1,p*1.1),B=R(9,19,w)*(.5+.5*b.n2(d*.09,p*.09)),P=Fe(u,f,B*.6,S*(w>1&&Ge>.5&&Ge<.96?.62:1.18)),_=R(4.5,.5,w)*.7;P.lerp(n,_),w>7&&b.n2(d*.7+5,p*.7)>.55&&P.lerp(Pe,.16),v[m]=P.r,v[m+1]=P.g,v[m+2]=P.b}}await x.yield();for(let i=0;i<116;i++)for(let c=0;c<116;c++){const d=i*117+c,p=d+1,M=d+116+1,C=M+1;s[d*3+1]<-6&&s[p*3+1]<-6&&s[M*3+1]<-6&&s[C*3+1]<-6||(c+i&1?l.push(d,M,p,p,M,C):l.push(d,M,C,d,C,p))}const o=new e.BufferGeometry;o.setAttribute("position",new e.BufferAttribute(s,3)),o.setAttribute("color",new e.BufferAttribute(v,3)),o.setIndex(l),await x.yield(),o.computeVertexNormals(),o.setAttribute("aGlow",new e.BufferAttribute(new Float32Array(13689).fill(1),1)),o.setAttribute("uv",new e.BufferAttribute(new Float32Array(13689*2),2)),de.push(o)}await x.yield();const V=[[-150,30,215],[-108,32.5,142],[-70,35.5,78],[-43,38,27],[-35,38,-6],[-41,34,-48],[-67,29,-97],[-102,25,-146],[-128,22,-167],[-161,20,-170],[-189,19,-153],[-203,18,-123],[-197,17.5,-90],[-180,17,-71],[-151,16.5,-51],[-90,16,-8]].map(t=>new e.Vector3(t[0],t[1],t[2])),at=V[V.length-1],St=(t,r)=>{let s=1e9;for(let v=0;v<V.length-1;v++){const l=V[v],u=V[v+1],n=u.x-l.x,f=u.z-l.z,m=Ue(((t-l.x)*n+(r-l.z)*f)/(n*n+f*f),0,1);s=Math.min(s,Math.hypot(t-l.x-n*m,r-l.z-f*m))}return s},Te=[];{const t=a.int(6,9),r=new e.Color(K).lerp(H,.4),s=new e.Color(q).lerp(H,.6);for(let v=0,l=0;v<t&&l<80;l++){const u=a.range(0,G),n=a.range(44,92),f=Math.sin(u)*n,m=Math.cos(u)*n,o=a.range(3.5,9)*(n<60?1.15:.9);if(St(f,m)<24+o||Math.hypot(f-at.x,m-at.z)<46||Te.some(w=>Math.hypot(w.x-f,w.z-m)<w.sz+o+6))continue;const i=a.chance(.3)?a.range(1.5,2.3):a.range(.6,1.1),c=new e.SphereGeometry(1,14,9),d=c.attributes.position,p=a.range(0,99),M=a.range(.8,1.5),C=a.range(0,G);for(let w=0;w<d.count;w++){let S=d.getX(w),B=d.getY(w),P=d.getZ(w);const _=1+.38*b.fbm3(S*1.3+p,B*1.3,P*1.3,3)+.12*b.n3(S*4+p,B*4,P*4);let L=B*_;L=L>0?Math.round(L*3.2)/3.2*.7+L*.3:L,d.setXYZ(w,S*_*o*M,(L*i+.25)*o,P*_*o)}c.computeVertexNormals(),g(c,(w,S)=>Fe(s,r,R(.5,4,S),.8+.4*b.n2(w*.4+p,S*.4)),.35),kt(c,f,0,m,C),de.push(c),Te.push({x:f,z:m,sz:o,top:(i*.75+.25)*o}),v++,await x.yield()}}await x.yield();const At=ht(new e.MeshStandardMaterial({vertexColors:!0,roughness:.74,metalness:0,flatShading:!0}),h,!0),ot=new e.Mesh(Be(de),At);ot.name="skerry",T.add(ot),de.forEach(t=>t.dispose()),await x.yield();const he=36.4,ee=t=>je+(se-je)*Math.pow(1-Ue((t-F)/(he-F),0,1),2.3),y=[],z=(t,r,s,v)=>(t.translate(0,v,s),t.rotateY(r),t),te=new e.Color(Pe).lerp(J,.42).multiplyScalar(.62),ge=new e.Color(J).lerp(K,.45).multiplyScalar(.8),Bt=new e.Color(q).lerp(K,.5).multiplyScalar(.8),E=new e.Color(gt).multiplyScalar(.85),I=new e.Color(H).lerp(K,.5),De=new e.Color(ve).lerp(new e.Color("#ff9a3c"),.35);await x.yield();{const s=(he-F)/38,v=.05,l=[0,.06,.5,.94,1],u=[0,.1,.9,1],n=760*20,f=new Float32Array(n*3),m=new Float32Array(n*3),o=new Float32Array(n*3),i=[];let c=0;const d=a.range(0,50);for(let M=0;M<38;M++){const C=M%2*.5+a.range(-.08,.08),w=M/37,S=fe==="band"&&w>.42&&w<.6||fe==="cap"&&w>.86;for(let B=0;B<20;B++){const P=(B+C)/20*G,_=(B+1+C)/20*G,L=(P+_)/2,$=.82+.3*a()+(a.chance(.08)?-.18:0),X=a.range(-.012,.02),Z=.5+.5*(Math.sin(L)*k.x+Math.cos(L)*k.z),N=c;for(let W=0;W<4;W++)for(let O=0;O<5;O++,c++){const Y=Ee(P,_,l[O]),oe=F+(M+u[W])*s,mt=O===0||O===4,vt=W===0||W===3,ft=ee(oe)+X-(mt||vt?v:0),xe=Math.sin(Y),be=Math.cos(Y);f[c*3]=xe*ft,f[c*3+1]=oe,f[c*3+2]=be*ft;const Wt=(ee(oe-.2)-ee(oe+.2))/.4;let Me=xe,Se=Wt,Ae=be;O===0?(Me-=be*.8,Ae+=xe*.8):O===4&&(Me+=be*.8,Ae-=xe*.8),W===0?Se-=.8:W===3&&(Se+=.8);const Re=Math.hypot(Me,Se,Ae);m[c*3]=Me/Re,m[c*3+1]=Se/Re,m[c*3+2]=Ae/Re;const pt=(oe-F)/(he-F),Gt=R(.55+.3*Z,.05,pt)*(.6+.4*Z),re=Fe(te,ge,Gt,$);re.lerp(Bt,R(.16,0,pt)*.6),S&&re.lerp(fe==="band"?E:Pe,.7).multiplyScalar(fe==="band"?1:.75);const Tt=b.n2(Y*7+d,oe*.07);re.multiplyScalar(1-.3*R(.25,.75,Tt)-(mt||vt?.5:0)),o[c*3]=re.r,o[c*3+1]=re.g,o[c*3+2]=re.b}for(let W=0;W<3;W++)for(let O=0;O<4;O++){const Y=N+W*5+O;i.push(Y,Y+1,Y+6,Y,Y+6,Y+5)}}}const p=new e.BufferGeometry;p.setAttribute("position",new e.BufferAttribute(f,3)),p.setAttribute("normal",new e.BufferAttribute(m,3)),p.setAttribute("color",new e.BufferAttribute(o,3)),p.setIndex(i),p.setAttribute("aGlow",new e.BufferAttribute(new Float32Array(n),1)),p.setAttribute("uv",new e.BufferAttribute(new Float32Array(n*2),2)),y.push(p)}const Q=(t,r=40)=>new e.LatheGeometry(t.map(s=>new e.Vector2(s[0],s[1])),r),D=(t,r=.2)=>(s,v,l)=>ze.copy(t).multiplyScalar(1-r/2+r*(.5+.5*b.n3(s*1.7,v*1.7,l*1.7)));await x.yield();{const t=se+.55;y.push(g(Q([[t+.55,F-2.2],[t+.55,F+.1],[t+.4,F+.25],[t,F+.3],[t,F+.95],[t-.2,F+1.15],[t-.62,F+1.2]],44),D(ge,.35)));const r=ee(F+2.6);y.push(g(z(new e.BoxGeometry(2.3,3.5,1.3),0,r-.1,F+2.95),D(te,.3))),y.push(g(z(new e.BoxGeometry(2.7,.35,1.6),0,r-.05,F+4.85),D(te,.3))),y.push(g(z(new e.BoxGeometry(1.35,2.6,.2),0,r+.5,F+2.55),D(E,.3))),y.push(g(z(new e.BoxGeometry(.34,.42,.34),0,r+.75,F+4.4),De,5));for(let n=0;n<3;n++)y.push(g(z(new e.BoxGeometry(2.6+n*.5,.42,.75),0,r+.95+n*.7,F+1-n*.42),D(ge,.3)));const s=a.int(4,6),v=a.range(.6,1.4)*a.sign();for(let n=0;n<s;n++){const f=F+6.5+n*(22/(s-1))*.98,m=v+n*a.range(1.5,2.2),o=ee(f),i=n===0||n===s-1||a.chance(.55);y.push(g(z(new e.BoxGeometry(1.15,1.9,.7),m,o-.17,f),D(te,.25))),y.push(g(z(new e.BoxGeometry(1.45,.24,.9),m,o-.17,f-1.05),D(te,.25))),y.push(g(z(new e.BoxGeometry(.62,1.3,.1),m,o+.16,f),i?De:I,i?a.range(2.2,4):0)),y.push(g(z(new e.BoxGeometry(.07,1.3,.14),m,o+.17,f),I)),y.push(g(z(new e.BoxGeometry(.62,.07,.14),m,o+.17,f+.15),I))}const l=8,u=a.range(0,G);for(let n=0;n<l;n++){const f=u+n/l*G,m=34.6,o=ee(m),i=a.chance(.75);y.push(g(z(new e.BoxGeometry(.85,1.15,.5),f,o-.12,m),D(te,.25))),y.push(g(z(new e.BoxGeometry(.5,.8,.1),f,o+.12,m),i?De:I,i?a.range(2.5,4.5):0))}}await x.yield();{const t=ee(he),r=t+1.5;y.push(g(Q([[t-.05,36.15],[t+.2,36.4],[t+.2,36.7],[t+.5,37.1],[t+1.15,37.5],[r,37.6]],48),D(te,.3))),y.push(g(Q([[r,37.6],[r+.06,37.66],[r+.06,37.95],[r-.04,38],[2.2,38]],48),D(E,.3)));for(let l=0;l<24;l++)y.push(g(z(new e.BoxGeometry(.26,.55,1),(l+.5)/24*G,t+.72,37.08),D(ge,.3)));const s=32;for(let l=0;l<s;l++){const u=l%4===0;y.push(g(z(new e.CylinderGeometry(u?.06:.035,u?.07:.035,u?1.38:1.2,5),l/s*G,r-.1,38+(u?.69:.6)),E)),u&&y.push(g(z(new e.SphereGeometry(.11,6,4),l/s*G,r-.1,39.44),E))}for(const[l,u]of[[39.2,.05],[38.82,.03],[38.42,.03]])y.push(g(new e.TorusGeometry(r-.1,u,5,64).rotateX(Math.PI/2).translate(0,l,0),E));const v=ie+.5;y.push(g(z(new e.CylinderGeometry(.42,.1,1.3,10,1,!0).rotateX(Math.PI/2-.15),v,r-.55,39),D(E,.3))),y.push(g(z(new e.CylinderGeometry(.06,.06,1,5),v,r-.9,38.5),I))}await x.yield();{y.push(g(Q([[2.5,38],[2.5,38.16],[2.34,38.26],[2.34,39.12],[2.46,39.22],[2.46,39.4],[2.1,39.4]],36),D(E,.3)));const t=12;for(let n=0;n<t;n++)y.push(g(z(new e.BoxGeometry(.11,3.42,.13),n/t*G,2.27,41.1),I));for(const n of[40.52,41.68])y.push(g(new e.TorusGeometry(2.27,.045,4,48).rotateX(Math.PI/2).translate(0,n,0),I));y.push(g(Q([[2.2,42.78],[2.5,42.86],[2.66,43.02],[2.66,43.22],[2.52,43.3]],36),D(E,.3)));const r=Xe==="ogee"?[[2.52,43.3],[2.36,43.8],[2,44.4],[1.48,44.98],[.96,45.42],[.62,45.74],[.46,46],[.46,46.34],[.2,46.4]]:[[2.52,43.3],[1.9,44.3],[1.2,45.4],[.52,46.4],[.46,46.6],[.2,46.66]];y.push(g(Q(r,24),(n,f,m)=>ze.copy(E).multiplyScalar(.8+.3*b.n2(Math.atan2(n,m)*5,f*.4))));const s=12,v=Xe==="ogee"?5:3;for(let n=0;n<s;n++)for(let f=0;f<v;f++){const m=r[f],o=r[f+1],i=o[0]-m[0],c=o[1]-m[1],d=Math.hypot(i,c),p=new e.BoxGeometry(.09,d*1.04,.09).rotateX(Math.atan2(i,c));y.push(g(z(p,(n+.5)/s*G,(m[0]+o[0])/2+.03,(m[1]+o[1])/2),I))}for(let n=0;n<s;n++)y.push(g(z(new e.SphereGeometry(.1,5,4),(n+.5)/s*G,2.64,43.2),I));const l=r[r.length-1][1];y.push(g(new e.SphereGeometry(.56,12,8).scale(1,.85,1).translate(0,l+.38,0),D(E,.3))),y.push(g(new e.CylinderGeometry(.025,.06,2.7,5).translate(0,l+2.1,0),I)),y.push(g(new e.SphereGeometry(.1,6,4).translate(0,l+3.45,0),I));const u=a.range(0,G);y.push(g(new e.BoxGeometry(1.5,.05,.05).translate(.15,l+1.9,0).rotateY(u),I)),y.push(g(new e.BoxGeometry(.5,.36,.04).translate(-.5,l+1.9,0).rotateY(u),I)),y.push(g(Q([[.2,39.4],[.75,39.45],[.75,39.6],[.35,39.75],[.35,40]],12),I))}const Ct=ht(new e.MeshStandardMaterial({vertexColors:!0,roughness:.72,metalness:0}),h,!1);await x.yield();const rt=new e.Mesh(Be(y),Ct);rt.name="tower",T.add(rt),y.forEach(t=>t.dispose()),await x.yield();const Ne=new e.Vector3(0,He,0),nt=new e.Mesh(new e.CylinderGeometry(2.22,2.22,3.38,36,1,!0).translate(0,He,0),new e.ShaderMaterial({uniforms:{...le(),uBeamDir:h.uBeamDir,uLampCol:h.uLampCol,uTime:h.uTime,uBeamI:h.uBeamI},transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.DoubleSide,fog:!0,vertexShader:`
      varying vec3 vNw, vNv, vVv; varying vec2 vUv;
      #include <fog_pars_vertex>
      void main(){ vUv = uv; vNw = normalize(mat3(modelMatrix) * normal); vNv = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.); vVv = -mvPosition.xyz; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uBeamDir, uLampCol; uniform float uTime, uBeamI; varying vec3 vNw, vNv, vVv; varying vec2 vUv;
      ${ne}
      #include <fog_pars_fragment>
      void main(){
        float face = pow(abs(dot(normalize(vNw), uBeamDir)), 10.);
        float fres = pow(1. - abs(dot(normalize(vNv), normalize(vVv))), 2.);
        float drops = smoothstep(.72, .95, tlNoise(vec2(vUv.x * 140., vUv.y * 22. + uTime * .7)));
        float band = .6 + .4 * smoothstep(.0, .5, vUv.y) * smoothstep(1., .5, vUv.y);
        vec3 col = uLampCol * uBeamI * (0.1 * band + 1.5 * face + .3 * fres + .4 * drops * (.3 + face));
        ${dt}
        gl_FragColor = vec4(col * (1. - tlFf), 1.);
      }`}));nt.renderOrder=3,T.add(nt),await x.yield();const ce=new e.Group;ce.position.copy(Ne),T.add(ce);{const t=[],r=new e.Color("#6b5326").multiplyScalar(.5),s=[];for(let o=0;o<=14;o++){const i=-1.15+o*.16428571428571428,c=.86-.16*Math.pow(Math.abs(i)/1.15,2);s.push([c,i],[c+.07,i+.08])}t.push(g(Q(s,20),ve,1));for(const o of[1,-1]){const i=new e.CircleGeometry(1.16,36);o<0&&i.rotateY(Math.PI),t.push(g(i.translate(0,0,o*.9),ve,2)),t.push(g(new e.TorusGeometry(1.18,.06,5,32).translate(0,0,o*.9),r,0))}for(const o of[-1.24,1.24])t.push(g(new e.CylinderGeometry(1,1,.12,20).translate(0,o,0),r,0));for(let o=0;o<4;o++)t.push(g(z(new e.BoxGeometry(.07,2.5,.07),Math.PI/4+o*Math.PI/2,1,0),r,0));const v=new e.Mesh(Be(t),new e.ShaderMaterial({uniforms:{...le(),uBeamI:h.uBeamI},vertexColors:!0,fog:!0,vertexShader:`
        attribute float aGlow; varying float vK; varying vec3 vC; varying vec2 vUv; varying vec3 vP;
        #include <fog_pars_vertex>
        void main(){ vK = aGlow; vC = color; vUv = uv; vP = position; vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        uniform float uBeamI; varying float vK; varying vec3 vC; varying vec2 vUv; varying vec3 vP;
        #include <fog_pars_fragment>
        void main(){
          vec3 col = vC * .55;
          if (vK > 1.5) { float r = length(vUv - .5) * 2.; col = vC * uBeamI * (1.4 + 1.1 * cos(r * 44.) + 9. * exp(-r * r * 7.)); }
          else if (vK > .5) { col = vC * uBeamI * (1.0 + .7 * sin(vP.y * 38.)); }
          gl_FragColor = vec4(col, 1.);
          #include <fog_fragment>
        }`}));v.name="optic",ce.add(v),t.forEach(o=>o.dispose());const l=.036,u=.95,n=[],f=Math.max(_e,A.beamReach??_e);for(const o of[1,-1]){const i=new e.CylinderGeometry((u+(f+.3)*l)*1.12,u*1.12,f,24,1,!1).rotateX(Math.PI/2).translate(0,0,f/2+.3);o<0&&i.rotateY(Math.PI),i.setAttribute("aSide",new e.BufferAttribute(new Float32Array(i.attributes.position.count).fill(o),1)),n.push(i)}const m=new e.Mesh(Be(n),new e.ShaderMaterial({uniforms:{...le(),uLamp:h.uLamp,uBeamDir:h.uBeamDir,uLampCol:h.uLampCol,uTime:h.uTime,uBeamI:h.uBeamI,uFogCut:h.uFogCut,uTan:{value:l},uR0:{value:u},uLen:h.uBeamLen},transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.BackSide,fog:!0,vertexShader:`
        attribute float aSide; varying float vSide; varying vec3 vW;
        #include <fog_pars_vertex>
        void main(){ vSide = aSide; vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz;
          vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        uniform vec3 uLamp, uBeamDir, uLampCol; uniform float uTime, uBeamI, uFogCut, uTan, uR0, uLen; varying float vSide; varying vec3 vW;
        ${ne}
        #include <fog_pars_fragment>
        void main(){
          vec3 Dn = uBeamDir * vSide; float back = uR0 / uTan;
          vec3 O = cameraPosition - (uLamp - Dn * back), V = normalize(vW - cameraPosition);
          float c2 = 1. / (1. + uTan * uTan), vd = dot(V, Dn), od = dot(O, Dn);
          float a = vd * vd - c2, b = 2. * (vd * od - c2 * dot(V, O)), c = od * od - c2 * dot(O, O), disc = b * b - 4. * a * c;
          float sum = 0., tm = 0.;
          if (disc > 0. && abs(a) > 1e-7) {
            float sq = sqrt(disc), t1 = (-b - sq) / (2. * a), t2 = (-b + sq) / (2. * a);
            if (t1 > t2) { float tt = t1; t1 = t2; t2 = tt; }
            float tA = t1, tB = t2;
            if (a > 0.) { if (vd > 0.) { tA = t2; tB = t2 + 2000.; } else { tA = t1 - 2000.; tB = t1; } }
            if (abs(vd) > 1e-5) { float s0 = (back + .4 - od) / vd, s1 = (back + uLen - od) / vd; tA = max(tA, min(s0, s1)); tB = min(tB, max(s0, s1)); }
            tA = max(tA, 0.);
            if (tB > tA) {
              float dt = (tB - tA) / 20., jit = fract(52.9829189 * fract(dot(gl_FragCoord.xy + fract(uTime * 7.31) * 13., vec2(.06711056, .00583715))));
              for (int i = 0; i < 20; i++) {
                vec3 P = O + V * (tA + (float(i) + jit) * dt) - Dn * back;
                float s = dot(P, Dn), r = uR0 + max(s, 0.) * uTan, rr = length(P - Dn * s) / r;
                float fl = clamp(1. - s / (uLen * .92), 0., 1.); float w = smoothstep(.4, 2., s) * fl * sqrt(fl) * exp(-s / (uLen * .34)) * 1.3;   // rain extinction plus a long even fade: the shaft tapers away, no cap in mid-air
                float pr = clamp(1. - rr * rr, 0., 1.); sum += pr * pr * w * pow(uR0 / r, 1.9);
              }
              sum *= dt; tm = .5 * (tA + tB);
            }
          }
          vec3 Pm = cameraPosition + V * tm;
          float rain = tlNoise(vec2(Pm.x * 5.3 + Pm.z * 4.1, Pm.y * 1.1 + uTime * 16.)) * .6 + tlNoise(vec2(Pm.x * 13. - Pm.z * 9., Pm.y * 2.4 + uTime * 23.)) * .4;
          float nearK = smoothstep(25., 120., tm);                                   // close to the eye the shaft thins, so rain and the cone's edge read inside it
          vec3 col = uLampCol * uBeamI * sum * 2.3 * mix(.42, 1., nearK) * (.92 + mix(.6, .18, nearK) * (smoothstep(.5, .85, rain) - mix(.35, 0., nearK)));
          float ff = 0.;
          #ifdef USE_FOG
            #ifdef FOG_EXP2
              ff = 1. - exp(-fogDensity * fogDensity * tm * tm);
            #else
              ff = smoothstep(fogNear, fogFar, tm);
            #endif
          #endif
          gl_FragColor = vec4(col * (1. - ff * uFogCut), 1.);
        }`}));m.name="beams",m.frustumCulled=!1,m.renderOrder=6,ce.add(m),n.forEach(o=>o.dispose())}const we=new e.Mesh(new e.PlaneGeometry(1,1),new e.ShaderMaterial({uniforms:{...le(),uLamp:h.uLamp,uLampCol:h.uLampCol,uFlare:h.uFlare,uBeamI:h.uBeamI,uTime:h.uTime},transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,fog:!0,vertexShader:`
      uniform vec3 uLamp; uniform float uFlare; varying vec2 vP; varying float vNear;
      #include <fog_pars_vertex>
      void main(){ vP = position.xy * 2.;
        vec4 mvPosition = viewMatrix * vec4(uLamp, 1.); float d = length(mvPosition.xyz);
        mvPosition.xyz *= max(d - 4.6, 0.5) / d;
        vNear = smoothstep(30., 180., d);                                        // close to the lantern the flare stays a lamp, not a white-out
        float sz = (9. + d * .085) * (1. + 1.6 * uFlare * vNear);
        mvPosition.xy += position.xy * sz; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uLampCol; uniform float uFlare, uBeamI, uTime; varying vec2 vP; varying float vNear;
      #include <fog_pars_fragment>
      void main(){
        float r = length(vP);
        float glow = exp(-r * r * 38.) * 1.6 + exp(-r * 9.) * .5 + exp(-r * 3.2) * .1;
        float streak = exp(-abs(vP.y) * 70.) * exp(-abs(vP.x) * 3.2) + .5 * exp(-abs(vP.x) * 90.) * exp(-abs(vP.y) * 6.);
        float pulse = .9 + .1 * sin(uTime * 13.);
        vec3 col = uLampCol * uBeamI * pulse * (glow * (.55 + 7.5 * uFlare * mix(.12, 1., vNear)) + streak * (.1 + 5. * uFlare * mix(.15, 1., vNear)));
        col *= smoothstep(1., .6, r);
        ${dt}
        gl_FragColor = vec4(col * (1. - tlFf * .6), 1.);
      }`}));we.frustumCulled=!1,we.renderOrder=8,we.name="flare",T.add(we),await x.yield();const ye=(t,r=.95)=>{const s=Math.sin(t),v=Math.cos(t),l=We(s,v)*r;return[s*l,v*l]},ke=t=>Math.acos(Ue(Math.sin(t)*k.x+Math.cos(t)*k.z,-1,1))/Math.PI,ae=ie+a.range(-.15,.15),it=ye(ae,.9),Ie={transparent:!0,depthWrite:!1,blending:e.CustomBlending,blendSrc:e.OneFactor,blendDst:e.OneMinusSrcAlphaFactor,fog:!0},Oe=()=>({...le(),uLamp:h.uLamp,uBeamDir:h.uBeamDir,uLampCol:h.uLampCol,uAmb:h.uAmb,uFlash:h.uFlash,uBeamI:h.uBeamI,uTime:h.uTime});{const t=[],r=(o,i,c,d,p,M,C,w)=>Array.from({length:o},()=>{const S=i+a.gauss()*c,B=Math.sin(S),P=Math.cos(S),_=a.range(M,C),L=a.gauss()*3.5,$=w?-B:-k.x,X=w?-P:-k.z;return{a:S,k:a.range(.84,1),vx:$*_+P*L,vy:a.range(d,p),vz:X*_-B*L,d:a.range(0,1)}}),s=(o,i,c,d,p)=>{const M=Math.pow(a(),.75),C=.28+.72*M,w=(d?2.4:1.5)*(1.25-M),[S,B]=ye(o.a+a.gauss()*.035,o.k);t.push(S,a.range(0,2.5),B,o.vx*C+a.gauss()*w,o.vy*C+a.gauss()*w,o.vz*C+a.gauss()*w,o.d*(i===1?.7:1.1)+a.range(0,.3)+(1-M)*.25,a.range(3.2,5.4)*(i===1?1.25:1),d?-a.range(.1,.24):a.range(1.5,3.3)*(1.3-.65*M)*p,a(),c,i,d?a.range(.2,.5):a.range(.2,.4)*(1.15-.4*M))},v=[-2,-1.15,-.5,.45,1.2,2.1,3.2].map(o=>ae+o+a.range(-.2,.2));for(const o of v){const i=ke(o),c=1-.6*i,d=.25*i*7,p=.45+.6*c,M=r(a.int(4,6),o,.11,10*p,27*p,0,6,!1),C=Math.round(150+200*c);for(let w=0;w<C;w++)s(a.pick(M),0,d,!1,1);for(let w=0;w<34;w++)s(a.pick(M),0,d,!0,1)}{const o=r(17,ae,.17,20,47,2,11,!0),i=r(9,ae,.33,7,17,0,5,!0);for(let c=0;c<1350;c++)s(a.pick(o),1,0,!1,1.2);for(let c=0;c<300;c++)s(a.pick(i),1,0,!1,1.6);for(let c=0;c<620;c++)s(a.pick(a.chance(.8)?o:i),1,0,!0,1)}for(let o=0;o<260;o++){const i=ae+a.gauss()*1.3,[c,d]=ye(i,a.range(.9,1.25)),p=a.range(4,7.5);t.push(c,a.range(.5,3),d,-k.x*a.range(1,4),a.range(1.5,5.5),-k.z*a.range(1,4),0,p,a.range(4,8),a(),a.range(0,p),2,a.range(.035,.08))}const l=t.length/13,u=new e.InstancedBufferGeometry,n=new e.PlaneGeometry(2,2);u.index=n.index,u.setAttribute("position",n.attributes.position);const f=(o,i)=>{const c=new Float32Array(l*i);for(let d=0;d<l;d++)for(let p=0;p<i;p++)c[d*i+p]=t[d*13+o+p];return new e.InstancedBufferAttribute(c,i)};u.setAttribute("aOrigin",f(0,3)),u.setAttribute("aVel",f(3,3)),u.setAttribute("aParam",f(6,4)),u.setAttribute("aCycle",f(10,3)),u.instanceCount=l;const m=new e.Mesh(u,new e.ShaderMaterial({...Ie,uniforms:{...Oe(),uHeroAge:h.uHero,uWind:{value:k.clone().multiplyScalar(-1.1)}},vertexShader:`
        attribute vec3 aOrigin, aVel; attribute vec4 aParam; attribute vec3 aCycle;
        uniform float uTime, uHeroAge; uniform vec3 uWind; varying vec2 vQ; varying float vA, vRnd, vDrop; varying vec3 vW;
        #include <fog_pars_vertex>
        void main(){
          float life = aParam.y, age;
          if (aCycle.y > 1.5) age = mod(uTime + aCycle.x, life);
          else if (aCycle.y > .5) age = uHeroAge - aParam.x;
          else age = mod(uTime - aCycle.x, 7.) - aParam.x;
          float alive = step(0., age) * step(age, life), t = clamp(age, 0., life), n = t / life, k = .62;
          vec3 p = aOrigin + aVel * (1. - exp(-k * t)) / k + vec3(0., -1.5 * t * t, 0.) + uWind * t * t * .3;
          p.y = max(p.y, .4 - aParam.w);
          vDrop = step(aParam.z, 0.); float size = mix(aParam.z * (.35 + .95 * sqrt(n)), -aParam.z, vDrop) * alive;
          vA = smoothstep(0., .07, n) * (1. - smoothstep(.4, 1., n)) * alive * aCycle.z; vRnd = aParam.w;
          vec2 q = position.xy; vQ = q; float stretch = 1. + 1.5 * (1. - smoothstep(.05, .7, n));
          vec4 wp = modelMatrix * vec4(p, 1.); vW = wp.xyz + vec3(0., q.y * size * .5, 0.);
          vec4 mvPosition = viewMatrix * wp;
          vec3 vel = aVel * exp(-k * t) + vec3(0., -3. * t, 0.) + uWind * .6 * t;
          vec2 dv = (viewMatrix * modelMatrix * vec4(vel, 0.)).xy; float sp = length(dv); dv /= max(sp, 1e-3);
          float el = mix(1. + (stretch - 1.) * min(sp * .11, 1.6), 1.5 + sp * .16, vDrop);
          if (aCycle.y > 1.5) dv = vec2(0., 1.);
          mvPosition.xy += (vec2(dv.y, -dv.x) * q.x + dv * q.y * el) * size;
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        uniform float uTime; varying vec2 vQ; varying float vA, vRnd, vDrop; varying vec3 vW;
        ${ne}${Ce}
        #include <fog_pars_fragment>
        void main(){
          float r = length(vQ); if (r > 1. || vA < .003) discard;
          float a = pow(1. - r, 1.25) * clamp(.25 + 1.5 * tlFbm(vQ * vec2(2.6, 1.2) + vRnd * 37.), 0., 1.6) * vA;
          a = mix(a, (1. - abs(vQ.x)) * (1. - vQ.y * vQ.y) * vA, vDrop);
          gl_FragColor = vec4(vec3(.86, .93, .97) * tlWaterLight(vW) * (.85 + .25 * vQ.y) * (1. + .6 * vDrop), 1.);
          #include <fog_fragment>
          a = clamp(a, 0., 1.); gl_FragColor = vec4(gl_FragColor.rgb * a, a);
        }`}));m.frustumCulled=!1,m.renderOrder=5,m.name="spray",T.add(m)}await x.yield();{const t=[],r=[],s=[],v=[];let l=0;for(let u=0;u<400&&l<20;u++){const n=ae+a.gauss()*1.5,f=a.range(.4,.8);let[m,o]=ye(n,f);const i=j(m,o);if(i<5.5||i>17||Math.hypot(m,o)<se+4)continue;const c=[],d=a.range(.8,1.9),p=a(),M=ke(n);for(let S=0;S<60;S++){const B=j(m,o);if(c.push([m,B,o]),B<.2)break;const P=.5,_=j(m+P,o)-j(m-P,o),L=j(m,o+P)-j(m,o-P),$=Math.hypot(m,o),X=Math.hypot(_,L)||1;let Z=-_/X*.75+m/$*.4,N=-L/X*.75+o/$*.4;const W=Math.hypot(Z,N)||1;m+=Z/W*.8,o+=N/W*.8}if(c.length<12)continue;const C=t.length/3;let w=0;for(let S=0;S<c.length;S++){const B=c[S],P=c[Math.min(S+1,c.length-1)],_=c[Math.max(S-1,0)];let L=P[0]-_[0],$=P[2]-_[2];const X=Math.hypot(L,$)||1;L/=X,$/=X,S>0&&(w+=Math.hypot(B[0]-_[0],B[1]-_[1],B[2]-_[2]));const Z=d*(.6+.9*S/c.length);for(const N of[-1,1]){const W=B[0]-$*Z*N,O=B[2]+L*Z*N;t.push(W,Math.max(j(W,O),B[1]-.6)+.42,O),r.push(N*.5+.5,w),s.push(M,p)}if(S>0){const N=C+S*2;v.push(N-2,N,N-1,N-1,N,N+1)}}l++}if(l>0){const u=new e.BufferGeometry;u.setAttribute("position",new e.Float32BufferAttribute(t,3)),u.setAttribute("uv",new e.Float32BufferAttribute(r,2)),u.setAttribute("aSeed",new e.Float32BufferAttribute(s,2)),u.setIndex(v);const n=new e.Mesh(u,new e.ShaderMaterial({...Ie,side:e.DoubleSide,uniforms:Oe(),vertexShader:`
          attribute vec2 aSeed; varying vec2 vUv, vS; varying vec3 vW;
          #include <fog_pars_vertex>
          void main(){ vUv = uv; vS = aSeed; vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vec4 mvPosition = viewMatrix * wp;
            gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          uniform float uTime; varying vec2 vUv, vS; varying vec3 vW;
          ${ne}${Ce}
          #include <fog_pars_fragment>
          void main(){
            float ph = fract(uTime / 7. - .25 * vS.x - .06);
            float flow = .3 + .7 * smoothstep(0., .12, ph) * (1. - smoothstep(.3, .95, ph));
            float st = tlNoise(vec2(vUv.x * 5. + vS.y * 31., vUv.y * .5 - uTime * 3.4)) * .6 + tlNoise(vec2(vUv.x * 13., vUv.y * 1.2 - uTime * 5.6)) * .4;
            float a = smoothstep(0., .3, vUv.x) * smoothstep(1., .7, vUv.x) * smoothstep(.62 - .42 * flow, .9 - .25 * flow, st) * smoothstep(0., 2.5, vUv.y);
            gl_FragColor = vec4(vec3(.84, .92, .96) * tlWaterLight(vW), 1.);
            #include <fog_fragment>
            a = clamp(a * .9, 0., 1.); gl_FragColor = vec4(gl_FragColor.rgb * a, a);
          }`}));n.renderOrder=2,n.name="runs",T.add(n)}}if(await x.yield(),A.apron!==!1){const t=A.sea&&A.sea.uWA&&A.sea.uWB&&A.sea.disc?A.sea:null,r=new e.RingGeometry(15,96,112,20).rotateX(-Math.PI/2),s=r.attributes.position,v=new Float32Array(s.count*2);for(let u=0;u<s.count;u++){const n=s.getX(u),f=s.getZ(u);v[u*2]=Math.hypot(n,f)-We(n,f),v[u*2+1]=ke(Math.atan2(n,f))}r.setAttribute("aShore",new e.BufferAttribute(v,2));const l=new e.Mesh(r,new e.ShaderMaterial({...Ie,uniforms:{...Oe(),uWdir:{value:k.clone()},...t?{uWA:t.uWA,uWB:t.uWB,uSeaTime:t.uTime,uSeaSp:t.uSpacing,uSeaR0:t.uR0,uSeaDamp:{value:t.damp??.35},uSeaLift:{value:t.lift??.35},uSeaDisc:{value:t.disc}}:{}},vertexShader:`
        attribute vec2 aShore; uniform float uTime; uniform vec3 uWdir; varying vec2 vS; varying vec3 vW, vP;
        ${t?`uniform vec4 uWA[${t.uWA.value.length}], uWB[${t.uWB.value.length}], uSeaDisc; uniform float uSeaTime, uSeaSp, uSeaR0, uSeaDamp, uSeaLift;`:""}
        #include <fog_pars_vertex>
        void main(){ vS = aShore; vec3 p = position;
          ${t?"p.y = uSeaLift;":"p.y = .45 + .5 * sin(dot(p.xz, uWdir.xz) * .11 + uTime * 1.3) * smoothstep(0., 20., aShore.x);"}
          vP = p; vec4 wp = modelMatrix * vec4(p, 1.);
          ${t?`{ // ride the world's Gerstner sea: the same sum, LOD fade and shoal damping as kit/water makeOcean
            vec2 xz = wp.xz; float sp = (length(xz - cameraPosition.xz) + uSeaR0) * uSeaSp; vec3 d = vec3(0.);
            for (int i = 0; i < 8; i++){ vec4 a = uWA[i], b = uWB[i]; float f = smoothstep(2., 4.5, b.w / sp);
              float th = a.z * dot(a.xy, xz) - a.w * uSeaTime + b.z; d.xz += a.xy * (b.y * b.x * cos(th) * f); d.y += b.x * sin(th) * f; }
            d *= mix(uSeaDamp, 1., smoothstep(0., 1., (length(xz - uSeaDisc.xy) - uSeaDisc.z) / uSeaDisc.w));
            wp.xyz += d; }`:""}
          vW = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        uniform float uTime; uniform vec3 uWdir; varying vec2 vS; varying vec3 vW, vP;
        ${ne}${Ce}
        #include <fog_pars_fragment>
        void main(){
          float sh = vS.x, ph = fract(uTime / 7. - .25 * vS.y), rr = ph * 58.;
          float ring = exp(-pow((sh - rr) / (3.5 + rr * .16), 2.)) * (1. - ph) * (1. - .6 * vS.y);
          vec2 w = vP.xz * .05; float warp = tlFbm(w + vec2(uTime * .04, 0.));
          vec2 sp = vec2(dot(vP.xz, uWdir.xz) * .045, dot(vP.xz, vec2(-uWdir.z, uWdir.x)) * .16);
          float n = tlFbm(sp + 1.6 * warp + vec2(uTime * .09, 0.));
          float cell = abs(tlNoise(vP.xz * .33 + warp * 3. + uTime * .08) - .5) * 2.;
          float lace = smoothstep(.55, .76, n + .3 * exp(-max(sh, 0.) / 14.) + .4 * ring) * (.55 + .45 * smoothstep(.1, .5, cell));
          float near = exp(-max(sh, 0.) / 5.5) * (.75 + .25 * n);
          float a = clamp(lace * (.25 + .75 * exp(-max(sh, 0.) / 26.)) + near + ring * .3, 0., 1.);
          a *= smoothstep(62., 10., sh + 22. * (n - .45)) * smoothstep(-9., -2., sh);
          gl_FragColor = vec4(vec3(.8, .9, .94) * tlWaterLight(vW) * .68, 1.);
          #include <fog_fragment>
          gl_FragColor = vec4(gl_FragColor.rgb * a, a);
        }`}));l.renderOrder=1,l.name="apron",T.add(l)}await x.yield();const ue=V[V.length-1],st=V[V.length-2],Pt={lantern:Ne.clone(),portalSeat:{position:ue.clone(),facing:new e.Vector3(st.x-ue.x,0,st.z-ue.z).normalize(),radius:7},flyThrough:V.map(t=>t.clone()),viewpoints:{reveal:V[1].clone(),impact:V[2].clone(),closePass:V[4].clone()},impact:new e.Vector3(it[0],0,it[1]),calmPatch:new e.Vector3(ue.x,0,ue.z),weatherDir:k.clone(),leeDir:k.clone().multiplyScalar(-1),galleryY:Nt,towerTop:49.8,outliers:Te.map(t=>({position:new e.Vector3(t.x,0,t.z),radius:t.sz*1.5,top:t.top}))},zt=A.burstAt??.53,Ft=A.burstSpan??.13,lt=7.8,_t=[[zt,Ft],...A.bursts||[]];let qe=null,ct=null,me=$e;const Ve=new e.Vector3,Ot=new e.Vector3,Lt=k.clone(),ut={object:T,radius:36,height:50,center:new e.Vector3(0,27,0),anchors:Pt,ground:!0,groundY:-.4,heightAt:j,setProgress(t){qe=t},setFlash(t){h.uFlash.value=Math.max(0,t)},setBeamAngle(t){ct=t},beamAngle(){return me},setAmbient(t,r=.55){h.uAmb.value.set(t).multiplyScalar(r)},uniforms:h,update(t,r,s){if(h.uTime.value=r,me=ct??$e+yt*r*G/wt,ce.rotation.y=me,T.updateWorldMatrix(!0,!1),h.uOrigin.value.setFromMatrixPosition(T.matrixWorld),h.uLamp.value.copy(Ne).applyMatrix4(T.matrixWorld),h.uWeather.value.copy(Lt).transformDirection(T.matrixWorld),h.uBeamDir.value.set(Math.sin(me),0,Math.cos(me)).transformDirection(T.matrixWorld),qe===null){const v=(r+7.6)%14;h.uHero.value=v<lt?v:-1}else{let v=-1;for(const l of _t){const u=(qe-l[0])/l[1];u>=0&&u<=1&&(v=u*lt)}h.uHero.value=v}if(s){Ve.setFromMatrixPosition(s.matrixWorld).sub(h.uLamp.value);const v=Ve.length()||1,l=Math.abs(Ve.dot(h.uBeamDir.value))/v;h.uFlare.value=Math.pow(R(.955,.9985,l),1.6)}},dispose(){}};return ut.update(0,0,null),ut}export{Rt as buildHero};
