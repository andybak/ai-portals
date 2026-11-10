import*as G from"three";import{makePath as is,clamp as L,lerp as U,smoothstep as D,bell as oe,makeRng as Ne,hashSeed as Xe}from"../kit/core.js";import{buildHero as ls,PAPER_GLSL as pe,makeGeo as rs,strip as me,finishGeo as cs,instanced as fo,mixc as q}from"../parts/pelican-collage.js";const H=Math.PI*2,b=G.Vector3,T=w=>new G.Color(w),us={morning:{sky:["#3C78D2","#4688DA","#4F9AE0","#5AACE4","#6CBCE6","#86CCE6","#A6DCE2","#D4EEE4"],skyA:["#3C78D2","#4688DA","#4F9AE0","#5CAEE4","#74C2E4","#96D4DE","#BCE4D6","#E6F2D2"],skyC:["#3466CC","#3C76D6","#4688DC","#509AE2","#60ACE6","#78BEE8","#98D0E6","#C6E6E6"],pal:["#FDFBF3","#F7A65E","#2FA8C9","#8CC63F","#E8C65A","#1E7F86","#DFA233"],cloud:["#FDFBF3","#B9B2DC"],far:"#9CCFD8",portal:"#FFC452",sun:["#FFD24A","#F7A65E","#FFF1C2"],sunLight:[1,.86,.58]},dawn:{sky:["#8D8FD8","#A292D6","#BC98D0","#D99EC2","#F0A8AE","#F8BC9E","#FBD2AC","#FDE8CE"],skyA:["#8D8FD8","#A693D4","#C49ACA","#E6A0B6","#F8A694","#FCB680","#FDCB8C","#FEE2B0"],skyC:["#7482DE","#8A8CE0","#AC98DA","#DC9EC2","#F3AAA4","#F9BC96","#FBD0A2","#FDE4C4"],pal:["#FDF6EE","#F7A05E","#7FA9D9","#9CC76A","#EDC886","#6C74B8","#E3A857"],cloud:["#FFE9DC","#C9A6D2"],far:"#C7A8CC",portal:"#FFA670",sun:["#FFC670","#F58A7A","#FFEFD6"],sunLight:[1,.82,.66]},evening:{sky:["#5878CE","#7688D0","#A092C6","#CF98AC","#F09A80","#F6B068","#F9C676","#FCDFA2"],skyA:["#5878CE","#7C88CE","#AC92C0","#DE98A0","#F6987A","#FAAE60","#FCC468","#FEDC94"],skyC:["#4C6CD2","#6680D8","#8A8CDA","#B094D0","#D49CB8","#F0A08A","#F8B870","#FCD69A"],pal:["#FFF4DC","#F79A52","#4FA3C2","#9CBF3F","#EDBE52","#3F6F9E","#E29A2E"],cloud:["#FFE6BE","#A88CC8"],far:"#B89CC0",portal:"#FFA436",sun:["#FFC53C","#F27A3C","#FFF0C0"],sunLight:[1,.82,.52]},dusk:{sky:["#1C2670","#243084","#2E3C96","#3A4CA6","#4F60B2","#6A7AC0","#8A98CE","#B0BADE"],skyA:["#1C2670","#263286","#34409A","#4452AA","#5E66B8","#7C7EC4","#9C98D0","#C0B6DE"],skyC:["#161E66","#1E2A7A","#28368E","#34469E","#465AAC","#6074BA","#8090C8","#A8B4DA"],pal:["#F1F2FA","#F7A65E","#4C7FD0","#6FB07A","#C9C27A","#2F4F9A","#C9A04A"],cloud:["#C8D0F0","#6A70B4"],far:"#6C7CC0",portal:"#DCE4FF",sun:["#F2F0DC","#A9B6F4","#FFFFFF"],sunLight:[.92,.95,1]}},hs={may:{green:null,straw:null,plume:"#F4E6B0",lily:1},summer:{green:"#6FBF3F",straw:"#A9CF4A",plume:"#DAD88E",lily:2.2},october:{green:"#C2B04A",straw:"#D9A247",plume:"#B48CC4",lily:.7,dark:"#6E4A9A"}};function fs(w){const M=w.rng.fork("pelican"),s0=M(),qe=M(),ve=M(),h0=M(),l0=M(),g0=w.vary?.hour??"any",N0=g0==="dawn"?"dawn":g0==="day"?"morning":g0==="golden"?"evening":g0==="night"?"dusk":s0<.4?"morning":s0<.62?"evening":s0<.84?"dawn":"dusk",ye=qe<.64?"clear":qe<.84?"shower":"gale",Pe=ve<.5?"may":ve<.75?"summer":"october";return{hour:N0,weather:ye,season:Pe,cormorants:h0<.45,dalmatian:l0<.14}}const ds=(w,M)=>`
attribute vec4 iA, iB, iC;
uniform float uTime, uU, uUnderK, uPx;
uniform vec3 uShadowDir;
uniform vec2 uWind;
varying vec2 vQ; varying vec4 vP; varying float vDist; varying vec3 vWp;
${w}
void main() {
  vec3 c = vec3(0.0), T = vec3(1.0, 0.0, 0.0), W = vec3(0.0, 1.0, 0.0); vec4 P = vec4(0.0); vec2 q = position.xy;
  vec3 camR = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), camU = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec3 flatR = normalize(vec3(camR.x, 0.0, camR.z) + vec3(1e-4, 0.0, 0.0));
  ${M}
  vec4 world = modelMatrix * vec4(c + T * q.x + W * q.y, 1.0);
  vQ = q; vP = P; vWp = world.xyz;
  vec4 mv = viewMatrix * world; vDist = length(mv.xyz);
  gl_Position = projectionMatrix * mv;
}`,ps=(w,M)=>`
varying vec2 vQ; varying vec4 vP; varying float vDist; varying vec3 vWp;
uniform float uTime, uU, uUnderK;
uniform vec3 uShade, uShadowDir, uDeep, uHoney;
${pe}
${w}
void main() {
  float e = 1.0, alpha = 1.0, deck = 1.0, tearK = 1.0, farK = 1.0, seed = vP.w; vec3 col = uWhite; vec2 puv = vQ; bool cut = false;
  ${M}
  vec4 ps = paperSheet(col, puv, clamp(e, 0.0, 1.0), tearK, seed, deck);
  ps.a *= alpha;
  if (cut || ps.a < 0.04) discard;
  gl_FragColor = vec4(paperFar(ps.rgb, vDist * farK), ps.a);
}`,po=`
uniform vec3 uWing;
float wingE(vec2 q, vec2 root, float a, float len, float wd) {     // a long wing from its root; 0 on the rim
  vec2 d = q - root; float ca = cos(a), sa = sin(a); vec2 l = vec2(d.x * ca + d.y * sa, -d.x * sa + d.y * ca);
  float t = clamp(l.x / len, 0.0, 1.0);
  return min(1.0 - abs(l.y) / (wd * (0.35 + 0.65 * sin(3.1416 * pow(t, 0.7)))), min(l.x / len * 9.0, (len - l.x) / len * 9.0));
}
vec3 hawker(vec2 q, float fl, vec3 cA, vec3 cB, out float e, out float isBody) {
  vec2 aq = vec2(abs(q.x), q.y); vec3 col;
  float abd = min(1.0 - abs(q.x) / (0.05 - 0.02 * (1.0 - smoothstep(-0.95, -0.2, q.y))), min((q.y + 0.96) * 14.0, (0.1 - q.y) * 14.0));
  float thx = 1.0 - length((q - vec2(0.0, 0.14)) / vec2(0.105, 0.17));
  float hd = 1.0 - length((q - vec2(0.0, 0.36)) / vec2(0.1, 0.085));
  float ey = 1.0 - length((aq - vec2(0.075, 0.39)) / vec2(0.07, 0.065));
  float body = max(max(abd, thx), max(hd, ey));
  float wf = wingE(aq, vec2(0.06, 0.2), 0.2 + 0.16 * fl, 0.9, 0.125), wh = wingE(aq, vec2(0.06, 0.1), -0.22 - 0.13 * fl, 0.84, 0.14), wg = max(wf, wh);
  if (body > 0.0) {
    e = body * 3.0 + 0.3; isBody = 1.0;
    col = mix(cB, uDeep * 0.55, step(0.5, fract(q.y * 6.5)) * step(q.y, 0.02));
    if (thx > 0.0) col = mix(cA, cB, smoothstep(0.2, 0.7, thx));
    if (hd > 0.0) col = cA * 1.05;
    if (ey > 0.15) col = mix(uDeep * 0.45, cB, smoothstep(0.6, 0.9, ey));
  } else {
    e = wg * 2.2; isBody = 0.0;
    float along = length(aq - vec2(0.06, 0.15));
    col = mix(uWing, uWhite, 0.35 + 0.3 * step(wh, wf));
    col = mix(col, cB * 0.9, (1.0 - smoothstep(0.03, 0.09, abs(fract(along * 5.0 + q.y * 1.5) - 0.5))) * 0.55);      // veins
    col = mix(col, uDeep * 0.6, smoothstep(0.8, 0.83, along) * (1.0 - smoothstep(0.88, 0.9, along)) * step(0.45, wg));   // the dark spot near each tip
  }
  return col;
}`,ms=`
vec3 fishE(vec2 f) {
  float prof = 0.1 + 0.9 * pow(max(sin(3.1416 * clamp((f.x - 0.16) / 0.84, 0.0, 1.0)), 0.0), 0.6);
  float body = (1.0 - abs(f.y) / prof) * step(0.0, f.x) * step(f.x, 1.0);
  float tw = 0.85 * (1.0 - f.x / 0.3);
  float tail = min(1.0 - abs(f.y) / max(tw, 0.01), (abs(f.y) - 0.45 * (1.0 - f.x / 0.16)) * 4.0 + 0.6) * step(f.x, 0.3) * step(-0.02, f.x);
  float dors = 1.0 - length((f - vec2(0.5, 0.96)) / vec2(0.15, 0.25));
  float anal = 1.0 - length((f - vec2(0.36, -0.9)) / vec2(0.1, 0.24));
  return vec3(body, tail, max(dors, anal));
}`;var ks={id:"pelican-collage",name:"The Tissue-Paper Pelicans",category:"wilderness",weirdness:.4,media:["air","water"],async build(w){const M=w.rng,s0=w.quality?.detail??1,qe=w.vary?.density??1,ve=!!w.vary?.rare,h0=fs(w),l0=us[h0.hour],g0=hs[h0.season],N0=h0.weather==="gale",ye=h0.weather==="shower"&&h0.hour!=="dusk",Pe=l0.pal.slice();g0.green&&(Pe[3]=g0.green),g0.straw&&(Pe[4]=g0.straw);const P=Ne(Xe("pelican-extra:"+w.seed)),S=Ne(Xe("pelican-four:"+w.seed)),k=Ne(Xe("pelican-five:"+w.seed)),E=Ne(Xe("pelican-six:"+w.seed)),Y=Ne(Xe("pelican-seven:"+w.seed)),p0=Ne(Xe("pelican-nine:"+w.seed)),Te=new G.Scene,E0=new G.Group,xe=new G.Group;E0.name="above",xe.name="under",Te.add(E0,xe);const ba=h0.season==="october"?300:h0.hour==="dawn"?90:L(Math.round(205*qe),150,260),Aa=N0?3:0,vt=[[-4.6,39.2,.62],[-.8,35.2,.08],[3.2,38.6,.76],[4.4,31.6,.2],[-15.6,29.5,.05],[-16.8,35.5,.14],[8.4,35.6,.5],[-5.4,33.4,.56],[.6,29.6,.12]],Vt=[{u:.0915,lat:3.3,f:.62,uf:.08,s:1.18,fixed:1},{u:.108,lat:-3.3,f:.16,uf:.08,s:1.1,fixed:1},{u:.166,lat:3.4,f:.76,uf:.16,s:1.26},{u:.1715,lat:5.3,f:.56,uf:.16,s:1.18},{u:.1775,lat:3.5,f:.13,uf:.16,s:1.2},{u:.1765,lat:7.6,f:.66,uf:.16,s:1.14},{u:.185,lat:5.6,f:.3,uf:.16,s:1.18},{u:.171,lat:9.8,f:.05,uf:.16,s:1.1},{u:.193,lat:8.6,f:.7,uf:.16,s:1.14},{u:.184,lat:11.5,f:.42,uf:.16,s:1.08},{u:.6155,lat:3.4,f:.22,uf:.6,s:1.34,fixed:1,bend:1,shoal:1},{u:.528,lat:3.5,f:.74,uf:.52,s:1.2,fixed:1,bend:1,face:1},{u:.5345,lat:5.4,f:.56,uf:.52,s:1.16,fixed:1,bend:1,face:1},{u:.5415,lat:3.6,f:.14,uf:.52,s:1.12,fixed:1,bend:1,face:1},{u:.2578,lat:4.5,f:.74,uf:.25,s:1.36,p2:1},{u:.2655,lat:7.8,f:.52,uf:.25,s:1.3,p2:1},{u:.2805,lat:12.2,f:.14,uf:.25,s:1.18,p2:1},{u:.268,lat:15.6,f:.62,uf:.25,s:1.16,p2:1},{u:.287,lat:7.2,f:.3,uf:.25,s:1.14,p2:1},{u:.05,lat:10.5,f:.7,uf:.02,s:1.2,p2:1,p6:1},{u:.058,lat:17,f:.3,uf:.02,s:1.14,p2:1,p6:1},{u:.3525,lat:-7.6,f:.72,uf:.34,s:1.24,fixed:1,p6:1},{u:.358,lat:8.6,f:.5,uf:.34,s:1.2,fixed:1,p6:1},{u:.3655,lat:-11.2,f:.16,uf:.34,s:1.16,fixed:1,p6:1},{u:.3715,lat:12.4,f:.62,uf:.34,s:1.14,fixed:1,p6:1}],N=await ls(w,{joiners:vt.map(([e,t],a)=>({x:e+Aa+(e<-10?-2.2:.8),z:t+1.2,cx:e+Aa,cz:t,yaw:.3*Math.sin(a*2.4+1)+(e<-10?.25:-.1),scale:1.09+.05*Math.sin(a*1.7),seed:void 0})).concat(Vt.map((e,t)=>({x:900+t*4,z:900,yaw:0,scale:e.s,seed:e.p6?E():e.p2?k():P(),flush:e.p6?E():e.p2?k():P()}))),palette:Pe,hour:h0.hour,weather:N0?"gale":void 0,fishers:L(Math.round(60*qe),44,76),soarers:Math.round(ba*(.6+.4*s0)),dalmatian:h0.dalmatian?.7:void 0,waveLength:32,waterRadius:640,waterCenter:[0,60],waterDepthWrite:!1});E0.add(N.object);const b0=N.uniforms,se=N.anchors,ne=N.colors,A=Pe.map(T),A0=g0.dark?T(g0.dark):null,$e=l0.sky.map(T);if(ye)for(const e of $e)e.lerp(T("#A7A4D6"),.38);const jt=[l0.skyA??l0.sky,l0.sky,l0.skyC??l0.sky].map(e=>e.map(t=>{const a=T(t);return ye&&a.lerp(T("#A7A4D6"),.38),a})),ka={value:1};b0.uHaze.value.copy($e[7]).multiplyScalar(.9);const ge={uU:{value:0},uUnderK:{value:0},uPx:{value:.0027},uShadowDir:b0.uShadowDir,uShade:b0.uShade,uBackK:{value:0},uWind:{value:new G.Vector2(-.85,-.52)},uGust:{value:new G.Vector2(N0?.9:.75,N0?1.5:.08)},uDeep:{value:A0?q(A[5],A0,.6):q(A[5],A[3],.25)},uHoney:{value:A[6].clone()}},ie=(e,t,a,o={})=>new G.ShaderMaterial({uniforms:{...b0,...ge,...e},vertexShader:t,fragmentShader:a,side:G.DoubleSide,alphaToCoverage:!0,...o}),It=new G.PlaneGeometry(1,1),C0=(e,t)=>{const a=e.length,o=new Float32Array(a*4),s=new Float32Array(a*4),n=new Float32Array(a*4);for(let r=0;r<a;r++){const l=e[r];for(let c=0;c<4;c++)o[r*4+c]=l[c],s[r*4+c]=l[4+c],n[r*4+c]=l[8+c]??0}const i=new G.Mesh(fo(t.geo??It,Math.max(a,1),{iA:o,iB:s,iC:n}),ie(t.uniforms??{},ds(t.vpars??"",t.vert),ps(t.fpars??"",t.frag),t.params??{}));return i.frustumCulled=!1,i.visible=a>0,t.order!=null&&(i.renderOrder=t.order),(t.parent??E0).add(i),i};await w.yield();const Z=[15,-97.5],I0=213,Ze=M.sign(),Ca=M.range(7,11),yt=-17+Ze*Ca*.55,Ye=-17+Ze*Ca,xt=U(Ye,-5.5,.62)-Ze*2,Da=M.int(4,6),B0=[[-17,440,5.4],[-17,342,5.4],[-17,300,5.2],[-17,262,5],[yt,226,4.8],[Ye,190,4.8],[xt,156,4.8],[-5.5,130,5.4],[-5.5,106,6.5]];B0[Da][2]=3.9,B0[7][2]=15,B0[8][2]=21;const Ba=640,le=-Ze,J=[U(-17,yt,29/36)+le*18.4,233,21],_t=(e,t)=>Math.hypot(e-J[0],t-J[1])-J[2],v0=-le,X=[U(Ye,xt,4/34)+v0*19.5,186,21],gt=(e,t)=>Math.hypot(e-X[0],t-X[1])-X[2],n0=[-17+v0*19,312,17],Qt=(e,t)=>Math.hypot(e-n0[0],t-n0[1])-n0[2],Fa=e=>{const t=D(310,322,e),a=(1-D(200,212,e))*D(160,170,e),o=(1-D(158,168,e))*D(96,110,e);return[1+.3*t-.3*a-.22*o,.8*t-.85*a+.5*o]},mo=se.flyThrough,vo=[[-17,2.5,338],[-17,2.1,315],[-17,1.45,288],[-17,1,262],[yt,1,226],[Ye,1,190],[xt,1,156],[-5.5,1,131],[-5.5,.1,125],[-5.4,-1.15,120.5],[-5.3,-1.45,113.5],[-5.6,-1.4,106.5],[-6,-.95,101.5],[-6.2,.5,97.1],[-5.6,2,92],[-1.6,2.7,78],[-2.4,2.7,62],...mo],t0=is(vo),r0=t0.length,R=new b,_=new b;let y0=.37,o0=.41;const $=[];for(let e=0;e<=1e3;e++)$.push(t0.pointAt(e/1e3).clone());const m0=e=>$[L(Math.round(e*1e3),0,1e3)];for(let e=1;e<600;e++){const t=$[e-1].y,a=$[e].y;t>0&&a<=0&&(y0=(e-1+t/(t-a))/1e3),t<0&&a>=0&&(o0=(e-1+t/(t-a))/1e3)}await w.yield();const Sa=e=>{const t=L((e-.47)/.07,0,1);return t*t*(3-2*t)},Je=[],Gt=[],yo=se.horseshoeCenter,et=new b;let wt=L((1.3-(w.aspect??1.78))/.7,0,1);const _0=new Float32Array(521*4);for(let e=0;e<=520;e++){const t=N.shape(e/800,0),a=N.shape(e/800,1);_0[e*4]=t[0],_0[e*4+1]=t[1],_0[e*4+2]=a[0],_0[e*4+3]=a[1]}await w.yield();for(let e=0;e<=140;e++){e%8===7&&await w.yield();const t=.38+e*.002,a=Sa(t),o=D(.49,.538,t);for(const[s,n,i]of[[Je,1.2,16],[Gt,.6,2]]){const r=n+(9.2-n)*D(.582,.615,t),l=m0(L(t+r/r0,0,1));let c=1e9,u=0,f=0;for(let m=i;m<=520;m++){const d=m*4,h=_0[d]+(_0[d+2]-_0[d])*a,p=_0[d+1]+(_0[d+3]-_0[d+1])*a,v=h-l.x,y=p-l.z,g=v*v+y*y;g<c&&(c=g,u=h,f=p)}s.push(new b(U(yo[0]+2.5,u,o),U(.5,.92,o),U(4,f,o)))}}const Mt=(e,t)=>{const a=L((e-.38)/.002,0,139.999),o=Math.floor(a);return t.lerpVectors(Je[o],Je[o+1],a-o)},xo=(e,t)=>{const a=L((e-.38)/.002,0,139.999),o=Math.floor(a);if(Mt(e,t),wt>0){t.lerp(et.lerpVectors(Gt[o],Gt[o+1],a-o),wt*.62);const s=wt*D(.53,.55,e)*(1-D(.55,.568,e));s>0&&(et.copy(qa),e>.55&&(t0.pointAt(e,Ht),et.x+=Ht.x-Pa.x,et.z+=Ht.z-Pa.z),t.lerp(et,s))}return t},qa=new b,Pa=t0.pointAt(.55).clone(),Ht=new b;{const e=m0(.55),t=N.fisherList.filter(s=>!s.joiner&&s.s<.5).map(s=>[Math.hypot(s.c[0]-e.x,s.c[1]-e.z),s]).sort((s,n)=>s[0]-n[0]),a=t[0][1].c,o=(t[1]??t[0])[1].c;qa.set(a[0]+(o[0]-a[0])*.35,.9,a[1]+(o[1]-a[1])*.35)}const go=.57,re=new b().lerpVectors(Je[95],Je[96],0);let Ot=N.fisherList[0];{let e=1e9;for(const t of N.fisherList){const a=Math.hypot(t.c[0]-re.x,t.c[1]-re.z);t.s<.5&&!t.joiner&&a<e&&(e=a,Ot=t)}}const wo=.57+Ot.phase-go*40/3,Ee=e=>e*40/3+wo;vt.forEach((e,t)=>N.setPhase(N.joiners.first+t,Ee(.5)-e[2]));const Mo=(e,t,a,o)=>{const s=o[0]-a[0],n=o[1]-a[1],i=e-a[0],r=t-a[1],l=L((i*s+r*n)/(s*s+n*n),0,1);return Math.hypot(i-s*l,r-n*l)-U(a[2],o[2],l)},M0=(e,t)=>{let a=1e9;for(let o=0;o<8;o++)a=Math.min(a,Mo(e,t,B0[o],B0[o+1]));return a},tt=(e,t)=>Math.min(M0(e,t),_t(e,t),gt(e,t),Qt(e,t)),Ta=(e,t,a)=>{const o=L(Math.round(e*1e3),1,999),s=$[o-1],n=$[o+1],i=n.x-s.x,r=n.z-s.z,l=Math.hypot(i,r)||1;return a.set($[o].x-r/l*t,0,$[o].z+i/l*t)},Q0=[],at=new b;Vt.forEach((e,t)=>{const a=N.joiners.first+vt.length+t,o=new b;let s=e.lat*(e.fixed?1:e.p2?v0:le);for(let r=0;r<30;r++){Ta(e.u,s,o);let l=1e9;for(let u=Math.max(0,Math.round(e.u*1e3)-40);u<=Math.min(1e3,Math.round(e.u*1e3)+40);u++)l=Math.min(l,Math.hypot($[u].x-o.x,$[u].z-o.z,Math.max(0,$[u].y-1.3)));const c=e.bend?N.fisherList.some((u,f)=>f!==a&&(Math.hypot(u.c[0]-o.x,u.c[1]-o.z)<1.9||Math.hypot(u.o[0]-o.x,u.o[1]-o.z)<1.9)):Q0.some(u=>Math.hypot(u.x-o.x,u.z-o.z)<1.9);if(l>=3.2&&!c&&(e.bend||tt(o.x,o.z)<-1))break;s+=Math.sign(s)*(l<3.2||c?.35:-.35)}const n=m0(L(e.u-(e.bend&&!e.face?-.02:.03),0,1)),i=e.bend&&!e.face?Math.atan2($[Math.round(e.u*1e3)-6].x-o.x,$[Math.round(e.u*1e3)-6].z-o.z)+.5:Math.atan2(n.x-o.x,n.z-o.z)*.8+.25*Math.sin(t*2.1);N.setPlace(a,o.x,o.z,i),N.setPhase(a,Ee(e.uf)-e.f),Q0.push({x:o.x,z:o.z,e,lat:s})});{let e=0;for(const t of Q0)!t.e.fixed&&!t.e.p2&&(at.x+=t.x,at.z+=t.z,e++);at.multiplyScalar(1/e),at.y=.9}await w.yield();const f0=[[-58+M.range(-4,4),4+M.range(-8,8),M.range(16,20)],[50+M.range(-4,6),-36+M.range(-8,6),M.range(12,15)],[-28+M.range(-3,3),-64+M.range(-4,4),M.range(15,18)]];{const e=m0(.562),t=Mt(.562,new b),a=t.x-e.x,o=t.z-e.z,s=Math.hypot(a,o)||1,n=f0[0];n[2]=13.5;for(let i=27;i<44&&(n[0]=t.x+a/s*i,n[1]=t.z+o/s*i,!N.fisherList.every(r=>Math.hypot(r.o[0]-n[0],r.o[1]-n[1])>n[2]+3.5));i+=1);}for(let e=0;e<400&&f0.length<8;e++){const t=M()*H,a=M.range(70,185),o=M.range(8,19),s=Z[0]+Math.cos(t)*a,n=Z[1]+Math.sin(t)*a;Math.hypot(s,n)<o+46||t0.nearestXZ(s,n).dist<o+24||Math.hypot(s-30,n+195)<o+30||Math.abs(s+9)<30&&n>30||f0.some(i=>Math.hypot(i[0]-s,i[1]-n)<i[2]+o+14)||f0.push([s,n,o])}for(;f0.length<8;)f0.push([900,900,1]);const we=[];for(const[e,t,a,o]of[[-27+k.range(-3,3),-138+k.range(-4,4),15.5,20.5],[66+k.range(-3,3),-150+k.range(-4,4),13,17.5],[-78+k.range(-4,4),-212+k.range(-4,4),14.5,18.5]]){const s=l=>f0.some(c=>Math.hypot(c[0]-e,c[1]-t)<c[2]+l+6),n=s(o)?a:o,i=s(n),r=i?[900,900,1]:[e,t,n];f0.push(r),i||we.push(r)}const w0=[-12+E.range(-6,6),-382+E.range(-6,6),150],Nt=(e,t)=>Math.hypot(e-w0[0],t-w0[1])-w0[2],Me=[];for(const[e,t,a]of[[13+E.range(-4,4),-254+E.range(-4,4),19],[112+E.range(-5,5),-214+E.range(-5,5),17],[-52+E.range(-5,5),-338+E.range(-5,5),25],[48+E.range(-5,5),-372+E.range(-5,5),21],[-8+E.range(-6,6),-446+E.range(-5,5),23]]){const o=f0.some(n=>Math.hypot(n[0]-e,n[1]-t)<n[2]+a+6),s=o?[900,900,1]:[e,t,a];f0.push(s),o||Me.push(s)}const X0=(e,t)=>{let a=Math.min(Math.hypot(e-Z[0],t-Z[1])-I0,M0(e,t),_t(e,t));for(let o=0;o<8;o++){const s=f0[o];a=Math.max(a,s[2]-Math.hypot(e-s[0],t-s[1]))}return a},zt=(e,t)=>{let a=Math.min(X0(e,t),gt(e,t));for(let o=8;o<f0.length;o++){const s=f0[o];a=Math.max(a,s[2]-Math.hypot(e-s[0],t-s[1]))}return a},Ea=(e,t)=>{let a=Math.min(X0(e,t),gt(e,t),Qt(e,t),Nt(e,t));for(let o=8;o<f0.length;o++){const s=f0[o];a=Math.max(a,s[2]-Math.hypot(e-s[0],t-s[1]))}return a};await w.yield();const Xt=new b(.5,.33,-.8).normalize(),bt=new G.Mesh(new G.SphereGeometry(3e3,16,10),ie({uBand:{value:$e},uBandK:ka,uSkySeed:{value:M()},uOlive:{value:q(A[6],A[5],.36).multiplyScalar(.72)},uMoon:{value:new G.Vector4(Xt.x,Xt.y,Xt.z,h0.hour==="dusk"?1:0)},uSea:{value:A[2].clone().multiply(b0.uTint.value).multiplyScalar(.94)}},`
      varying vec3 vDir;
      void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,`
      varying vec3 vDir;
      uniform vec3 uBand[8], uOlive, uHoney, uSea; uniform vec4 uMoon; uniform float uSkySeed, uUnderK, uBandK;
      ${pe}
      void main() {
        vec3 d = normalize(vDir);
        float el = asin(clamp(d.y, -1.0, 1.0)) * 57.2958;
        float az = atan(d.x, d.z + (abs(d.x) + abs(d.z) < 1e-5 ? 1e-4 : 0.0));
        vec2 uv = vec2(az / 6.2832 * 6.0, el * 0.03);
        vec4 nA = textureLod(uPaper, uv + vec2(0.0, uSkySeed), 0.0), nB = textureLod(uPaper, uv * vec2(2.0, 1.7) + 0.37, 0.0);
        vec4 nC = textureLod(uPaper, uv * vec2(1.0, 9.0) + 0.71, 0.0);
        float fw = fwidth(el) * 1.6 + 0.05, line = 0.0, x;
        vec3 col = uBand[7];
        #define BAND(i, b, amp, n) x = el - (b * uBandK + ((n) - 0.5) * amp); col = mix(col, uBand[i], smoothstep(-fw * 0.4, fw * 0.4, x)); line = max(line, 1.0 - smoothstep(0.0, fw, abs(x)));
        BAND(6, 2.4, 1.2, nA.r)
        BAND(5, 5.6, 2.0, nB.r)
        BAND(4, 10.0, 3.0, nA.a)
        BAND(3, 17.0, 4.5, nB.a)
        BAND(2, 27.0, 6.5, 0.5 * (nA.r + nB.a))
        BAND(1, 41.0, 9.0, 0.5 * (nA.a + nB.r))
        BAND(0, 60.0, 11.0, nA.b)
        col *= 0.95 + 0.1 * nC.b;
        col = mix(col, uWhite, line * 0.6);
        float ang = acos(clamp(dot(d, uMoon.xyz), -1.0, 1.0)) * 57.2958 + (nB.r - 0.5) * 0.7;
        col = mix(col, mix(col, uWhite, 0.3), uMoon.w * (1.0 - smoothstep(8.0, 8.4, ang + (nA.a - 0.5) * 3.0)));
        col = mix(col, vec3(0.93, 0.92, 0.84), uMoon.w * (1.0 - smoothstep(3.3, 3.5, ang)));
        // well below the horizon the dome is water paper, so no pale sky can ever show under a clipped water sheet
        col = mix(col, uSea * (0.94 + 0.12 * nA.b), 1.0 - smoothstep(-6.0, -2.5, el + (nB.r - 0.5) * 1.5));
        float tn = (nA.r - 0.5) * 12.0;
        vec3 uc = mix(uOlive, uHoney * 0.78, smoothstep(-fw, fw, el + 16.0 + tn));
        uc = mix(uc, uHoney * vec3(1.1, 1.12, 1.0), smoothstep(-fw, fw, el - 6.0 + (nB.a - 0.5) * 10.0));
        uc *= 0.92 + 0.14 * nC.b;
        col = mix(col, uc, uUnderK);
        col += (nA.g - 0.5) * 0.03;
        gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
      }`,{side:G.BackSide,depthWrite:!1,depthTest:!1,alphaToCoverage:!1}));bt.renderOrder=-3,bt.frustumCulled=!1,Te.add(bt);const ze=[],Wa=[],zo=Math.round((ye?15:9)+M.range(0,3));for(let e=0,t=0;e<zo&&t<200;t++){const a=M.range(-1500,1500),o=M.range(-1700,200),s=M.range(150,330),n=M.range(110,230);if(Math.hypot(a-30,o+195)<420||Math.hypot(a,o-342)<500)continue;const i=M.int(3,5),r=M();Wa.push([ze.length,i]);for(let l=0;l<i;l++)ze.push([a+M.range(-.22,.22)*n,s+l*.13*n,o+l*9,n*(1-.13*l)*(l?.62:.5),r+l*.13,M.range(1.7,2.4)*(l?1:1.25),l?0:1,2.6+.7*l+M.range(0,.4),0,0,0,0]);e++}const be=(e,t,a,o,s,n,i=w.rng)=>{const r=s[0],l=s[1];ze.push([e+r*.15,a*.42,t+l*.15,a*.84,i(),.16,4,0,2,0,0,0]),ze.push([e+r*.5+.5,a*.5,t+l*.5,a*.7,i(),.1,4,0,2,0,0,0]);for(let c=0;c<9;c++){const u=i()*H,f=o*i.range(.1,.7);ze.push([e+r+Math.cos(u)*f,a*i.range(.74,1.02)-f*.2,t+l+Math.sin(u)*f,o*i.range(1.05,1.5),i(),i.range(1.2,1.6),c%3===0?5:c%3===1?n?4:2:n?5:3,0,1,0,0,0])}},ce=[],Ra=[];let ot=null;{const e=-Ze,t=M.range(236,250),a=M.range(166,182),o=U(-17,yt,L((262-t)/36,0,1)),s=U(Ye,xt,L((190-a)/34,0,1));ce.push([J[0]+e*(J[2]+2.5),J[1]+(t-243)*.8-3,11.5,6.8,[-e*3.2,0],!0],[X[0]+v0*(X[2]+2.5),X[1]+(a-174)*.8,12.5,7.2,[-v0*3.4,0],!0]);for(const n of f0.slice(0,3))n[2]>10&&n[0]<800&&ce.push([n[0]+M.range(-2,2),n[1]+M.range(-2,2),M.range(8,11),5.2,[M.range(-1.5,1.5),0]]);{const n=f0[0],i=re.x-n[0],r=re.z-n[1],l=Math.hypot(i,r)||1,c=i/l,u=r/l;for(const[f,m,d]of[[6.5,0,12.5],[5.5,7.5,10.5],[5.5,-7.5,11]])ce.push([n[0]+c*f-u*m,n[1]+u*f+c*m,d,6,[c*1.2,u*1.2],!0])}for(const n of ce)be(...n);{const n=f0[0],i=re.x-n[0],r=re.z-n[1],l=Math.hypot(i,r)||1,c=i/l,u=r/l,f=m0(.54),m=m0(.575),d=(f.x-m.x)*-u+(f.z-m.z)*c<0?-1:1;ot=[n[0]+c*1.5-u*10.4*d,n[1]+u*1.5+c*10.4*d,11.5,6,[-u*7*d+c*.8,c*7*d+u*.8],!0,p0],be(...ot)}for(const[n,i]of[[.72,10.5],[-.66,12]]){const r=[J[0]+e*Math.cos(n)*(J[2]+3),J[1]+Math.sin(n)*(J[2]+3),i,6.2,[-e*Math.cos(n)*2.4,-Math.sin(n)*2.4],!0,P];ce.push(r),be(...r)}for(const[n,i]of[[.78,11],[-.7,12.5],[-1.35,10]]){const r=[X[0]+v0*Math.cos(n)*(X[2]+3),X[1]+Math.sin(n)*(X[2]+3),i,6.4,[-v0*Math.cos(n)*2.4,-Math.sin(n)*2.4],!0,k];ce.push(r),be(...r)}for(const[n,i]of[[.5,12.5],[-.55,10.5]]){const r=[n0[0]+v0*Math.cos(n)*(n0[2]+3),n0[1]+Math.sin(n)*(n0[2]+3),i,6.6,[-v0*Math.cos(n)*2.6,-Math.sin(n)*2.6],!0,E];ce.push(r),be(...r)}for(const n of we)for(let i=0;i<3;i++){const r=i*2.1+k.range(-.4,.4),l=n[2]*.42,c=[n[0]+Math.cos(r)*l,n[1]+Math.sin(r)*l,k.range(10,14),7,[k.range(-1.5,1.5),0],i!==1,k];Ra.push(c),be(...c)}for(const n of Me)for(let i=0;i<3;i++){const r=i*2.1+E.range(-.4,.4),l=n[2]*.44,c=[n[0]+Math.cos(r)*l,n[1]+Math.sin(r)*l,E.range(12,17),8.6,[E.range(-1.5,1.5),0],i!==1,E];Ra.push(c),be(...c)}}const bo=C0(ze,{uniforms:{uBlob:{value:[T(l0.cloud[0]).multiplyScalar(.85),T(l0.cloud[1]).multiplyScalar(.85),A[3].clone().multiplyScalar(.82),q(A[3],A[0],.42),A0?q(A0,A[5],.3).multiplyScalar(.8):q(A[5],A[3],.35).multiplyScalar(.8),A0?q(A0,A[3],.2):q(A[3],A[5],.5)]}},vert:`
        c = iA.xyz; float sz = iA.w;
        if (iC.x < 0.5) { c.x = mod(c.x - uTime * iB.w + 1700.0, 3400.0) - 1700.0; c.y += 2.5 * sin(uTime * 0.11 + iB.x * 20.0); }
        else if (iC.x < 1.5) c.xz += 0.035 * sz * vec2(sin(uTime * 0.9 + iB.x * 30.0), cos(uTime * 0.7 + iB.x * 17.0));
        vec3 tc = cameraPosition - c;
        T = normalize(vec3(tc.z, 0.0, -tc.x) + vec3(1e-4, 0.0, 0.0)) * sz * iB.y; W = vec3(0.0, sz, 0.0);
        P = vec4(iB.z, iC.x, sz, iB.x);`,fpars:"uniform vec3 uBlob[6];",frag:`
        vec4 n = texture2D(uPaper, vQ * 0.55 + seed);
        if (vP.y < 1.5) {
          e = (1.0 - length(vQ * 2.0)) * 1.7 + (n.a - 0.5) * 1.5;
          if (vP.y < 0.5) { e = min(e, (vQ.y + 0.5) * 4.0 + 0.2 + (n.r - 0.5) * 0.8); farK = 0.3; }
        } else { e = (1.0 - abs(vQ.x) * 2.0) * 1.4 + (n.a - 0.5) * 0.8; e = min(e, (0.5 - vQ.y) * 8.0); }
        col = uBlob[int(vP.x + 0.5)];
        puv = vQ * vP.z * vec2(0.11, 0.2) + seed;`});await w.yield();{const e=[],t=[-5,100],a=(o,s,n,i,r,l)=>{const c=Y(),u=l?0:Y.range(.8,1.7);e.push([o,n,s,i*(l?1.25:1),c,Y.range(2,2.5),1,u,l,0,0,0]);for(let f=1;f<=r;f++){const m=f/r,d=f===2||l&&f===4;e.push([o+Y.range(-.3,.3)*i*(1-.5*m),n+i*(.1+(l?.7:.42)*m)+Y.range(-.03,.03)*i,s,i*(.86-.42*m)*Y.range(.9,1.1),c+f*.17,Y.range(1.5,2),d?2:0,u*Y.range(.8,1.25),l,0,0,0])}};for(const[o,s,n,i]of[[-66,1150,100,150],[-43,1380,135,200],[-24,1100,85,140],[-10,1650,170,180],[19,1500,125,205],[36,1150,90,150],[55,1320,140,190],[73,1050,95,145]]){const r=(o+Y.range(-4,4))*Math.PI/180,l=s*Y.range(.94,1.06);a(t[0]+Math.sin(r)*l,t[1]-Math.cos(r)*l,n,i*Y.range(.9,1.1),Y.int(3,4),0)}a(44,-335,132,120,5,1),C0(e,{order:-2.8,params:{depthTest:!1,depthWrite:!1},uniforms:{uCum:{value:[q(T(l0.cloud[0]),A[0],.55).multiplyScalar(.86),T(l0.cloud[1]).multiplyScalar(.84),h0.hour==="morning"?q(A[0],T(l0.cloud[1]),.3).multiplyScalar(.86):h0.hour==="dusk"?q(T(l0.cloud[0]),T(l0.cloud[1]),.45).multiplyScalar(.86):q(A[1],T(l0.cloud[0]),.5).multiplyScalar(.9)]}},vert:`
          c = iA.xyz; float sz = iA.w;
          c.x -= uTime * iB.w; c.y += 0.012 * sz * sin(uTime * 0.13 + iB.x * 20.0);
          vec3 tc = cameraPosition - c;
          T = normalize(vec3(tc.z, 0.0, -tc.x) + vec3(1e-4, 0.0, 0.0)) * sz * iB.y; W = vec3(0.0, sz, 0.0);
          P = vec4(iB.z, smoothstep(5.0, 14.0, cameraPosition.y), sz, iB.x);`,fpars:"uniform vec3 uCum[3];",frag:`
          vec2 q = vQ * 2.0; vec4 n = texture2D(uPaper, vQ * vec2(0.9, 0.5) + seed), n2 = texture2D(uPaper, vQ * vec2(2.6, 1.4) + seed * 2.0);
          float s1 = fract(seed * 5.3) - 0.5, s2 = fract(seed * 9.7) - 0.5;
          // a heap of four round heads over a flat torn base
          float hp = max(max(1.0 - length((q - vec2(-0.5 + 0.1 * s1, -0.12)) / vec2(0.46, 0.52)), 1.0 - length((q - vec2(-0.08 + 0.2 * s2, 0.2 + 0.1 * s1)) / vec2(0.5, 0.72))),
            max(1.0 - length((q - vec2(0.42 + 0.1 * s2, 0.02)) / vec2(0.5, 0.6)), 1.0 - length((q - vec2(0.1, -0.3)) / vec2(0.86, 0.45))));
          if (vP.x > 0.5 && vP.x < 1.5) hp = 1.0 - length((q - vec2(0.0, 0.1)) / vec2(0.96, 0.5));       // the underside: one long low sheet
          e = hp * 1.5 + (n.a - 0.5) * 0.7 + (n2.r - 0.5) * 0.22;
          e = min(e, (q.y + 0.55) * 3.0 + 0.15 + (n.r - 0.5) * 0.5);
          e -= vP.y * 1.9;                                  // tearing away as the climb begins
          col = uCum[int(vP.x + 0.5)];
          farK = 0.3; tearK = 0.6;
          puv = vQ * vP.z * vec2(0.022, 0.04) + seed;`})}await w.yield();const $t=A[4].clone().multiplyScalar(.9),$0=A[3].clone().multiplyScalar(.88),Ka=T(g0.plume).multiplyScalar(.88),Ao=`
      uniform vec3 uLC, uPool, uPool2, uPool3, uChan[9], uIsl[16], uBay;
      float sdW(vec2 p) {
        float d = min(min(length(p - uLC.xy) - uLC.z, length(p - uPool.xy) - uPool.z), length(p - uPool2.xy) - uPool2.z);
        for (int i = 0; i < 8; i++) {
          vec2 a = uChan[i].xy, ba = uChan[i + 1].xy - a, pa = p - a;
          float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0.0, 1.0);
          d = min(d, length(pa - ba * h) - mix(uChan[i].z, uChan[i + 1].z, h));
        }
        d = min(d, min(length(p - uBay.xy) - uBay.z, length(p - uPool3.xy) - uPool3.z));
        for (int i = 0; i < 16; i++) d = max(d, uIsl[i].z - length(p - uIsl[i].xy));
        return d;
      }`,ko={uLC:{value:new b(Z[0],Z[1],I0)},uPool:{value:new b(J[0],J[1],J[2])},uPool2:{value:new b(X[0],X[1],X[2])},uPool3:{value:new b(n0[0],n0[1],n0[2])},uChan:{value:B0.map((e,t)=>new b(e[0],t?e[1]:Ba,e[2]))},uIsl:{value:f0.map(e=>new b(e[0],e[1],e[2]))},uBay:{value:new b(w0[0],w0[1],w0[2])}};{const e=new G.CircleGeometry(3600,48);e.rotateX(-Math.PI/2),e.translate(0,.12,0);const t=new G.Mesh(e,ie({...ko,uG0:{value:$0},uG1:{value:$t},uG2:{value:A0?q(A0,A[3],.2).multiplyScalar(.92):q(A[3],A[5],.45)},uLake:{value:q(A[2],A[0],.2)}},`
        varying vec3 vW; varying float vDist;
        void main() { vW = position; vec4 mv = modelViewMatrix * vec4(position, 1.0); vDist = length(mv.xyz); gl_Position = projectionMatrix * mv; }`,`
        varying vec3 vW; varying float vDist;
        uniform vec3 uG0, uG1, uG2, uLake;
        ${pe}
        ${Ao}
        void main() {
          vec2 w = vW.xz; float d = sdW(w), dist = length(vW - cameraPosition);
          float e = clamp(d / 2.4 + 0.03, 0.0, 1.0);
          vec4 a = texture2D(uPaper, w * vec2(0.031, 0.011) + 0.13), b = texture2D(uPaper, (mat2(0.8, 0.6, -0.6, 0.8) * w) * vec2(0.008, 0.021) + 0.61);
          vec3 col = uG0;
          col = mix(col, uG1, smoothstep(0.48, 0.52, a.a));
          col = mix(col, uG2, smoothstep(0.55, 0.58, b.a) * 0.8);
          col = mix(col, mix(uG0, uG1, 0.5) * 1.1, smoothstep(0.6, 0.62, b.r) * 0.6);
          col *= 0.86 + 0.26 * a.b;
          float lk = texture2D(uPaper, w / 700.0 + 0.27).a, lk2 = texture2D(uPaper, w / 260.0 + 0.5).r;
          float lake = smoothstep(60.0, 120.0, d) * max(smoothstep(0.6, 0.615, lk), (1.0 - smoothstep(0.03, 0.045, abs(lk2 - 0.5))) * step(0.35, lk));
          col = mix(col, uLake, lake);
          vec4 s = paperSheet(col, w / 9.0, e, 1.0 - 0.8 * smoothstep(60.0, 400.0, dist), 0.61, 1.0);
          if (s.a < 0.04) discard;
          gl_FragColor = vec4(paperFar(s.rgb, dist), 1.0);
        }`,{alphaToCoverage:!1}));t.frustumCulled=!1,E0.add(t)}await w.yield();{const e={pos:[],dat:[],idx:[],n:0};let t=w.rng,a=null;const o=(h,p,v,y=t)=>{let g=y()*60;for(let x=0;x<h.length;x++){x&&(g+=Math.hypot(h[x][0]-h[x-1][0],h[x][1]-h[x-1][1]));const z=v>.5&&v<1.5&&h[x][1]>96?Fa(h[x][1]):null,B=p*(.8+.4*y())*(z?z[0]:1),F=z?v+z[1]*.07:v;if(e.pos.push(h[x][0],0,h[x][1],h[x][0],B,h[x][1]),e.dat.push(g,0,F,B,g,1,F,B),x&&!(a&&(a(h[x])||a(h[x-1])))){const W=e.n+x*2-2;e.idx.push(W,W+1,W+2,W+2,W+1,W+3)}}e.n+=h.length*2},s=(h,p,v,y)=>{let g=[];for(const x of h)p(x)?g.push(x):(g.length>1&&o(g,v,y),g=[]);g.length>1&&o(g,v,y)},n=(h,p,v,y)=>{const g=Math.max(10,Math.round(H*v/y)),x=[];for(let z=0;z<=g;z++){const B=z/g*H;x.push([h+Math.cos(B)*v,p+Math.sin(B)*v])}return x},i=N0?.8:1;a=h=>Nt(h[0],h[1])<2,s(n(Z[0],Z[1],I0+1.1,4),h=>M0(h[0],h[1])>1,2.8*i,0),s(n(Z[0],Z[1],I0+2.6,4),h=>M0(h[0],h[1])>2.4,4.8*i,1),s(n(Z[0],Z[1],I0+13,6),h=>M0(h[0],h[1])>8,13,4),a=null,await w.yield();for(const h of[-1,1])for(const[p,v,y]of[[3.4,3.9*i,1],[5.5,4.3*i,1]]){const g=[];for(let x=0;x<8;x++){const z=B0[x],B=B0[x+1],F=Math.hypot(B[0]-z[0],B[1]-z[1]),W=-(B[1]-z[1])/F,j=(B[0]-z[0])/F;for(let I=0,O=Math.ceil(F/3);I<O;I++){const V=I/O,K=U(z[2],B[2],V)+p;g.push([U(z[0],B[0],V)+W*h*K,U(z[1],B[1],V)+j*h*K])}}a=x=>gt(x[0],x[1])<=p*.7||Qt(x[0],x[1])<=p*.7,s(g,x=>Math.hypot(x[0]-Z[0],x[1]-Z[1])>I0+2&&_t(x[0],x[1])>p*.7,v,y),a=null,s(n(J[0],J[1],J[2]+p,3),x=>M0(x[0],x[1])>p*.7,v,y)}s(n(J[0],J[1],J[2]+11,4),h=>M0(h[0],h[1])>22,9.5,4),await w.yield();{const h=t;t=k;for(const[p,v,y]of[[3.4,3.9*i,1],[5.5,4.3*i,1]])s(n(X[0],X[1],X[2]+p,3),g=>M0(g[0],g[1])>p*.7,v,y);s(n(X[0],X[1],X[2]+11,4),p=>M0(p[0],p[1])>22,9.5,4),t=h}{const h=t;t=E,s(n(n0[0],n0[1],n0[2]+2.2,3),p=>M0(p[0],p[1])>3,2.3*i,0),s(n(n0[0],n0[1],n0[2]+10,4),p=>M0(p[0],p[1])>20,9.5,4),t=h}{const h=t;t=E;const p=v=>y=>Math.hypot(y[0]-Z[0],y[1]-Z[1])>I0+v;s(n(w0[0],w0[1],w0[2]+1.1,4),p(1),2.8*i,0),s(n(w0[0],w0[1],w0[2]+2.6,4),p(2.4),4.8*i,1),s(n(w0[0],w0[1],w0[2]+13,6),p(13),13,4),t=h}for(const h of f0)if(h[0]<800){const p=we.includes(h)?k:Me.includes(h)?E:w.rng;o(n(h[0],h[1],Math.max(1,h[2]-.8),2.5),2.3*i,0,p),o(n(h[0],h[1],Math.max(.6,h[2]-2.2),2.5),3.9*i,1,p)}for(const h of[-1,1])for(const[p,v,y]of[[3.4,3.9*i,1],[5.5,4.3*i,1]]){const g=[];for(let x=Ba;x>=440;x-=4)g.push([-17+h*(5.4+p),x]);o(g,v,y,S)}await w.yield();const r=h=>h[1]<95||Math.abs(h[0]+12)>95;a=h=>Nt(h[0],h[1])<16,s(n(Z[0],Z[1],300,9),r,10,2),s(n(Z[0]-40,Z[1]+30,470,14),r,16,3),s(n(Z[0]+60,Z[1],820,24),r,24,3),a=null,await w.yield();const l=new G.BufferGeometry;l.setAttribute("position",new G.Float32BufferAttribute(e.pos,3)),l.setAttribute("aData",new G.Float32BufferAttribute(e.dat,4)),l.setIndex(e.idx);const c=b0.uTint.value,u=q(A[5],A0??A[3],A0?.35:.14);u.setRGB(u.r/U(1,c.r,.75),u.g/U(1,c.g,.75),u.b/U(1,c.b,.75));const f=h=>ie({uFlip:{value:h},uMirror:{value:u},uG0:{value:$0},uG1:{value:$t},uPlume:{value:Ka},uFar:{value:T(l0.far)}},`
        attribute vec4 aData; uniform float uFlip, uTime, uBackK; uniform vec2 uWind, uGust;
        varying vec4 vD; varying float vDist;
        void main() {
          vec3 p = position;
          if (p.z > 338.3) p.y *= 1.0 - uBackK;
          float g = pow(0.5 + 0.5 * sin(dot(p.xz, uWind) * 0.11 - uTime * 1.57), 3.0) * uGust.x + uGust.y;
          p.xz += uWind * g * aData.y * min(aData.w, 5.0) * 0.17;
          p.y *= uFlip;
          if (uFlip < 0.0) {
            p.y *= 0.8;
            p.xz += 0.1 * aData.y * vec2(sin(p.y * 2.3 + uTime * 1.7 + p.z * 0.3), cos(p.y * 1.9 + uTime * 1.3 + p.x * 0.3));
            if (aData.z > 1.5 && aData.z < 3.5) p = vec3(0.0);      // far tree lines stand on land: no mirror
          }
          vD = aData;
          vec4 mv = modelViewMatrix * vec4(p, 1.0); vDist = length(mv.xyz); gl_Position = projectionMatrix * mv;
        }`,`
        varying vec4 vD; varying float vDist;
        uniform vec3 uG0, uG1, uPlume, uFar, uDeep, uMirror; uniform float uFlip, uTime;
        ${pe}
        void main() {
          float v = vD.y, kind = vD.z;
          vec4 n = texture2D(uPaper, vec2(vD.x * 0.17, v * 0.11) + kind * 0.31);
          float plume = uFlip < 0.0 ? 0.0 : smoothstep(0.62, 0.8, v + (n.r - 0.5) * 0.3);       // the mirror carries no pale plumes
          vec3 col = kind < 0.5 ? mix(uG0, mix(uG0, uDeep, 0.5), smoothstep(0.4, 0.6, n.b))
            : kind < 1.5 ? mix(mix(uG1, uG0, smoothstep(0.52, 0.6, n.a) * 0.8), uPlume, plume)
            : kind < 3.5 ? mix(uFar, uHaze, kind < 2.5 ? 0.0 : 0.35) : mix(uG0 * 0.72, uDeep, 0.3 + 0.4 * smoothstep(0.4, 0.6, n.b));
          float tone = kind > 0.6 && kind < 1.4 ? (kind - 1.0) / 0.07 : 0.0;          // the reach's own reed colour (see reach())
          col = mix(col, mix(uG1, uPlume, 0.3) * 1.04, clamp(tone, 0.0, 1.0) * 0.55 * (1.0 - plume));
          col = mix(col, mix(uG0, uDeep, 0.45), clamp(-tone, 0.0, 1.0) * 0.62);
          if (kind < 1.5) col = mix(col, uDeep, (1.0 - smoothstep(0.0, 0.4, v)) * 0.5);
          float edge = clamp((1.0 - v) * 1.9, 0.0, 1.0);
          if (uFlip < 0.0) {
            // the mirror: a darker, cooler sheet in the water's own deep colour that keeps the wall's streaks, torn into
            // sliding strips that open wider the further they lie from the bank, so the blue water shows between them
            float lum = dot(col, vec3(0.3, 0.5, 0.2));
            col = mix(uMirror * (0.62 + 0.62 * lum), col, 0.1);
            vec4 rp = texture2D(uPaper, vec2(vD.x * 0.021 + uTime * 0.006, v * vD.w * 0.33 - uTime * 0.012) + 0.43);
            float gap = rp.r - (0.24 + 0.34 * v);
            edge = min(edge, clamp(gap * 9.0 + 0.5, 0.0, 1.0));
            col = mix(col, uWhite, (1.0 - smoothstep(0.0, 0.05, abs(gap))) * 0.5 * step(0.0, gap));
          }
          vec4 s = paperSheet(col, vec2(vD.x, v * vD.w) / (kind < 1.5 ? 2.2 : 9.0), edge, 1.0 - 0.5 * smoothstep(100.0, 500.0, vDist), 0.2 + kind * 0.13, uFlip < 0.0 ? 0.0 : 0.6);
          if (s.a < 0.04) discard;
          gl_FragColor = vec4(paperFar(s.rgb, vDist), s.a);
        }`),m=new G.Mesh(l,f(1)),d=new G.Mesh(l,f(-1));m.frustumCulled=d.frustumCulled=!1,E0.add(m,d)}await w.yield();const Zt=(e,t)=>{const a=[],o=[],s=[],n=[];let i=0;const r=(c,u,f,m)=>{const d=e.range(-t.spread,t.spread),h=e.range(-t.spread,t.spread),p=e.range(-.5,.5)*t.lean,v=e.range(-.5,.5)*t.lean,y=e();for(let g=0;g<=m;g++)for(const x of[-1,1])a.push(d,g/m,h),o.push(x,f,u,c),s.push(p,v,y,0);for(let g=0;g<m;g++){const x=i+g*2;n.push(x,x+1,x+2,x+2,x+1,x+3)}i+=(m+1)*2};for(let c=0;c<t.nA;c++)r(0,t.hA*e.range(.82,1.12),t.wA,3);for(let c=0;c<t.nB;c++)r(1,t.hB*e.range(.7,1.15),t.wB,t.segB??2);const l=new G.BufferGeometry;return l.setAttribute("position",new G.Float32BufferAttribute(a,3)),l.setAttribute("aS",new G.Float32BufferAttribute(o,4)),l.setAttribute("aL",new G.Float32BufferAttribute(s,4)),l.setIndex(n),l},At=(e,t,a)=>{const o=e.length,s=new Float32Array(o*4),n=new Float32Array(o*4);e.forEach((r,l)=>{s.set([r[0],r[1],r[2],r[3]],l*4),n.set([r[4],r[5],r[6]??0,0],l*4)});const i=new G.Mesh(fo(t,Math.max(1,o),{iA:s,iB:n}),ie({uCA:{value:a.a},uCB:{value:a.b},uCP:{value:a.p},uCS:{value:a.s??a.b},uDown:{value:a.down??1},uFlipK:{value:a.flip??0}},`
        attribute vec4 aS, aL, iA, iB;
        uniform float uTime, uDown, uPx, uBackK; uniform vec2 uWind, uGust;
        varying vec4 vS; varying vec3 vK; varying float vDist, vTone;
        void main() {
          vTone = iB.z;
          float t = position.y, sc = iA.w, cr = cos(iB.y), sr = sin(iB.y);
          vec2 off = vec2(position.x * cr + position.z * sr, -position.x * sr + position.z * cr) * sc;
          vec3 base = vec3(iA.x + off.x, iA.y, iA.z + off.y);
          float sd = fract(aL.z + iB.x * 7.31), H = aS.z * sc * (0.85 + 0.3 * sd) * (base.z > 338.3 ? 1.0 - uBackK : 1.0);
          float gw = pow(0.5 + 0.5 * sin(dot(base.xz, uWind) * 0.11 - uTime * 1.57), 3.0);
          float g = gw * uGust.x + uGust.y + 0.1 * sin(uTime * 2.3 + sd * 40.0);
          vec2 lean = vec2(aL.x * cr + aL.y * sr, -aL.x * sr + aL.y * cr) + uWind * g * (uDown > 0.0 ? 0.3 : 0.42);
          vec3 p = base + vec3(lean.x * t * t * H, uDown * H * t * (1.0 - 0.18 * min(dot(lean, lean), 2.0) * t), lean.y * t * t * H);
          vec3 tc = cameraPosition - p;
          vec2 side = normalize(vec2(tc.z, -tc.x) + vec2(1e-4, 0.0));
          float hw = max(aS.y * sc, length(tc) * uPx * 0.8);
          p.xz += side * aS.x * hw;
          vS = vec4(aS.x, t, aS.w, sd); vK = vec3(H, gw, hw);
          vec4 mv = viewMatrix * vec4(p, 1.0); vDist = length(mv.xyz); gl_Position = projectionMatrix * mv;
        }`,`
        varying vec4 vS; varying vec3 vK; varying float vDist, vTone;
        uniform vec3 uCA, uCB, uCP, uCS, uDeep, uShade; uniform float uFlipK;
        ${pe}
        void main() {
          float v = vS.x, t = vS.y, kind = vS.z, sd = vS.w, prof;
          if (kind < 0.5) prof = mix(0.32, 1.0, smoothstep(0.62, 0.78, t)) * (1.0 - 0.7 * smoothstep(0.86, 1.0, t));
          else prof = 0.25 + 0.75 * sin(3.1416 * clamp(0.12 + 0.86 * t, 0.0, 1.0));
          float e = min(1.0 - abs(v) / max(prof, 0.05), (1.0 - t) * vK.x / max(vK.z, 1e-3) * 0.5);
          vec3 col = kind < 0.5 ? mix(uCA, uCP, smoothstep(0.62, 0.72, t)) : mix(uCB, uCS, uFlipK * smoothstep(0.6, 1.0, vK.y + sd * 0.35));
          col = mix(col, mix(uCA, uCP, 0.3) * 1.04, clamp(vTone, 0.0, 1.0) * 0.55);
          col = mix(col, mix(uCB, uDeep, 0.45), clamp(-vTone, 0.0, 1.0) * 0.62);
          col *= 0.84 + 0.3 * fract(sd * 5.3);
          col = mix(col, uDeep, (1.0 - smoothstep(0.0, 0.5, t)) * 0.5 * (1.0 - uFlipK));
          if (fract(sd * 3.7) < 0.13) col = mix(uShade, uDeep, 0.3);
          float fe = fwidth(e);
          vec4 s = paperSheet(col, vec2(v * vK.z, t * vK.x) / 0.6 + sd, clamp(e, 0.0, 1.0), 0.55 * (1.0 - 0.7 * smoothstep(20.0, 90.0, vDist)), sd, 0.6 * (1.0 - smoothstep(0.06, 0.25, fe)));
          if (s.a < 0.04) discard;
          gl_FragColor = vec4(paperFar(s.rgb, vDist), s.a);
        }`));return i.frustumCulled=!1,i.visible=o>0,E0.add(i),i};{const e=M.fork("reeds"),t=[],a=[],o=N0?.85:1,s=[[.4,.5],[1.1,.56],[1.9,.72],[2.8,.95]];for(const l of[-1,1])for(let c=0;c<8;c++){const u=B0[c],f=B0[c+1],m=Math.hypot(f[0]-u[0],f[1]-u[1]),d=-(f[1]-u[1])/m*l,h=(f[0]-u[0])/m*l;for(const[p,v]of s)for(let y=e()*v;y<m;y+=v/(.55+.45*s0)){const g=y/m,x=U(u[2],f[2],g)+p+e.range(-.25,.25),z=U(u[0],f[0],g)+d*x+e.range(-.2,.2),B=U(u[1],f[1],g)+h*x;B>404||Math.hypot(z-Z[0],B-Z[1])<I0+.3||tt(z,B)<.25||(t.push([z,.1,B,e.range(.85,1.2)*o,e(),e()*H]),p<.5&&e.chance(.22)&&a.push([z-d*.45,.1,B-h*.45,e.range(.8,1.2),e(),e()*H]))}}for(const l of[-1,1])for(const[c,u]of s)for(let f=404+S()*u;f<474;f+=u/(.55+.45*s0)*(f>440?1.6:1)){const m=-17+l*(5.4+c+S.range(-.25,.25))+S.range(-.2,.2);t.push([m,.1,f,S.range(.85,1.2)*o,S(),S()*H]),c<.5&&S.chance(.22)&&a.push([m-l*.45,.1,f,S.range(.8,1.2),S(),S()*H])}await w.yield();for(let l=.9;l<2.3;l+=.0026)for(const c of[.5,1.4,2.4]){const u=I0+c+e.range(-.3,.3),f=Z[0]+Math.cos(l)*u,m=Z[1]+Math.sin(l)*u;M0(f,m)<.3||Math.hypot(f+5.5,m-117)>62||e.chance(.25)||t.push([f,.1,m,e.range(.85,1.2)*o,e(),e()*H])}for(const[l,c]of s)for(let u=P()*.02;u<H;u+=c/(J[2]+l)/(.55+.45*s0)){const f=J[2]+l+P.range(-.25,.25),m=J[0]+Math.cos(u)*f,d=J[1]+Math.sin(u)*f,h=t0.nearestXZ(m,d).dist;M0(m,d)<l+.3||h>30&&P.chance(.5)||(t.push([m,.1,d,P.range(.85,1.2)*o,P(),P()*H]),l<.5&&h<26&&P.chance(.3)&&a.push([m-Math.cos(u)*.45,.1,d-Math.sin(u)*.45,P.range(.8,1.2),P(),P()*H]))}for(const[l,c]of s)for(let u=k()*.02;u<H;u+=c/(X[2]+l)/(.55+.45*s0)){const f=X[2]+l+k.range(-.25,.25),m=X[0]+Math.cos(u)*f,d=X[1]+Math.sin(u)*f,h=t0.nearestXZ(m,d).dist;M0(m,d)<l+.3||h>30&&k.chance(.5)||(t.push([m,.1,d,k.range(.85,1.2)*o,k(),k()*H]),l<.5&&h<26&&k.chance(.4)&&a.push([m-Math.cos(u)*.45,.1,d-Math.sin(u)*.45,k.range(.8,1.2),k(),k()*H]))}for(const l of f0.slice(0,3))for(let c=0;c<H;c+=.6/l[2])for(const u of[.4,1.3])e.chance(.8)&&t.push([l[0]+Math.cos(c)*(l[2]-u+e.range(-.3,.3)),.1,l[1]+Math.sin(c)*(l[2]-u),e.range(.9,1.25)*o,e(),e()*H]);await w.yield();for(const l of t)if(l[2]>96){const c=Fa(l[2]);l[3]*=c[0],l[6]=c[1]}for(const[l,c]of[[.4,.62],[1.2,.8],[2.1,1.1]])for(let u=E()*.03;u<H;u+=c/(n0[2]+l)/(.55+.45*s0)){const f=n0[2]+l+E.range(-.25,.25),m=n0[0]+Math.cos(u)*f,d=n0[1]+Math.sin(u)*f;M0(m,d)<l+2.6||(t.push([m,.1,d,E.range(.5,.78)*o,E(),E()*H,-.8]),l<.5&&E.chance(.3)&&a.push([m-Math.cos(u)*.45,.1,d-Math.sin(u)*.45,E.range(.8,1.2),E(),E()*H]))}At(t,Zt(e,{nA:2,nB:2,hA:3.5,hB:2,wA:.11,wB:.085,spread:.3,lean:.22}),{a:$t,b:$0,p:Ka}),At(a,Zt(e,{nA:2,nB:3,hA:1,hB:.8,wA:.075,wB:.035,spread:.16,lean:.3}),{a:$0,b:$0,p:T("#F6D648").multiplyScalar(.9)}),await w.yield();const n=[],i=[];for(const[l,c,u,f,m,d]of ce)for(let h=0,p=Math.round(130*(.6+.4*s0));h<p;h++){const v=e()*H,y=Math.sqrt(e()),g=f*(.25+.8*y),x=u*(1-.3*y*y),z=l+m[0]+Math.cos(v)*g,B=c+m[1]+Math.sin(v)*g,F=zt(z,B)<.5?4.2:1.6;(d?i:n).push([z,x,B,Math.max(1.2,Math.min(e.range(3.2,6.2),x-F)),e(),e()*H])}if(ot){const[l,c,u,f,m]=ot,d=re.x-l,h=re.z-c,p=Math.atan2(h,d);for(let v=0;v<30;v++){const y=p+p0.range(-1.5,1.5),g=Math.sqrt(p0()),x=f*(.3+.75*g),z=u*(1-.3*g*g),B=l+m[0]+Math.cos(y)*x,F=c+m[1]+Math.sin(y)*x;i.push([B,z,F,Math.max(1.2,Math.min(p0.range(3.4,6.2),z-4.2)),p0(),p0()*H])}}const r=Zt(e,{nA:0,nB:4,hA:1,hB:1,wA:.02,wB:.017,spread:.13,lean:.12,segB:3});At(n,r,{a:$0,b:A[3].clone().multiplyScalar(.8),p:$0,s:q(A[0],A[3],.22).multiplyScalar(.86),down:-1,flip:1}),At(i,r,{a:$0,b:A0?q(A0,A[3],.25).multiplyScalar(.86):q(A[3],A[5],.5).multiplyScalar(.78),p:$0,s:A[3].clone().multiplyScalar(.82),down:-1,flip:1})}await w.yield();const C=M.fork("flora"),d0=[],c0=[],Z0=e=>t0.tangentAt(e,_),W0=e=>t0.pointAt(e,R),F0=(e,t)=>{W0(e),Z0(e);const a=Math.hypot(_.x,_.z)||1;return[R.x+-_.z/a*t,R.z+_.x/a*t]},Ae=(e,t,a)=>d0.push([e,t,a,0,C(),0,C(),C(),0,0,0,0]),Co=h0.hour==="dusk"?0:1,kt=(e,t,a)=>c0.push([e,.05,t,a,C(),C.chance(.3)?3:2,0,0,0,0,C(),0]),We=[];for(let e=0;e<1e3;e++){const t=$[e],a=$[e+1];Math.min(Math.abs(t.y),Math.abs(a.y))<=2.5&&We.push(t.x,t.z,a.x-t.x,a.z-t.z)}const Do=(e,t)=>{for(let a=0;a<We.length;a+=4){const o=e-We[a],s=t-We[a+1];if(Math.abs(o)+Math.abs(s)>4.5)continue;const n=We[a+2],i=We[a+3],r=L((o*n+s*i)/(n*n+i*i||1),0,1),l=o-n*r,c=s-i*r;if(l*l+c*c<2.4*2.4)return!0}return!1};{const e=Math.round(1150*g0.lily*qe*(.6+.4*s0)),t=h0.season==="summer"?105:86;for(let a=0,o=0;a<e&&o<e*4;o++){(o&255)===255&&await w.yield();const s=119-Math.pow(C(),1.25)*t,n=-6+C.gauss()*(10+(119-s)*.32);if(X0(n,s)>-.5||Math.hypot(n,s)<34)continue;const i=C.range(.24,.52);if(Ae(n,s,i),a++,C.chance(.13)){kt(n+C.range(-.2,.2),s+C.range(-.2,.2),C.range(.3,.42));const r=c0[c0.length-1];Do(r[0],r[2])&&c0.pop()}}await w.yield();for(let a=0,o=Math.round(520*g0.lily*(.6+.4*s0));a<o;a++){(a&127)===127&&await w.yield();const s=C.range(-.02,y0+.01),n=(C.chance(.5)?1:-1)*C.range(2,5.2),i=F0(Math.max(s,0),n);s<0&&(i[1]+=-s*r0);const r=X0(i[0],i[1]);r>-.35||r<-2.6&&C.chance(.7)||(Ae(i[0],i[1],C.range(.22,.46)),C.chance(.1)&&kt(i[0],i[1],C.range(.28,.38)))}await w.yield();for(let a=0,o=Math.round(1500*s0);a<o;a++){(a&255)===255&&await w.yield();const s=F0(C.range(0,y0),C.range(-4.4,4.4));d0.push([s[0],s[1],C.range(.035,.075),0,C(),1,C(),C(),0,0,0,0])}if(ye)for(let a=0,o=Math.round(700*s0);a<o;a++){const s=C.range(0,.66),n=F0(s,C.gauss()*(s>o0?26:3.2));d0.push([n[0],n[1],C.range(.25,.6),0,C(),2,C(),0,0,0,0,0])}if(N0)for(let a=0,o=Math.round(420*s0);a<o;a++){const s=C()*H,n=Math.sqrt(C())*200;d0.push([Z[0]+Math.cos(s)*n,Z[1]+Math.sin(s)*n,C.range(1.2,3.2),0,C(),3,C(),0,0,0,0,0])}}await w.yield();{for(let a=0,o=Math.round(260*Math.min(g0.lily,1.5)*(.6+.4*s0));a<o;a++){(a&63)===63&&await w.yield();const s=P()*H,n=Math.sqrt(P())*(J[2]-.6),i=J[0]+Math.cos(s)*n,r=J[1]+Math.sin(s)*n,l=P.range(.26,.56),c=P.chance(.16);t0.nearestXZ(i,r).dist<2.4||Q0.some(u=>Math.hypot(u.x-i,u.z-r)<1.5)||(Ae(i,r,l),c&&kt(i+.1,r-.1,P.range(.3,.42)))}for(let a=0;a<70;a++){const o=F0(P.range(.146,.205),le*P.range(2.3,8)),s=P.range(.3,.6),n=P.chance(.2);tt(o[0],o[1])>-.5||Q0.some(i=>Math.hypot(i.x-o[0],i.z-o[1])<1.4)||(Ae(o[0],o[1],s),n&&kt(o[0]+.1,o[1]-.1,P.range(.3,.42)))}for(let a=0;a<16;a++){const o=Q0[2+a%8],s=P()*H,n=P.range(1.6,4.2),i=o.x+Math.cos(s)*n,r=o.z+Math.sin(s)*n;tt(i,r)>-.8||t0.nearestXZ(i,r).dist<4.6||(c0.push([i,0,r,P.range(.4,.54),P(),7,P(),P.range(.4,.8),P.range(1.4,2.6),0,P(),0]),d0.push([i,r,P.range(.3,.55),0,P(),2,P(),0,0,0,0,0]))}const e=new b,t=new b;await w.yield();for(let a=0;a<330;a++){(a&63)===63&&await w.yield();const o=a<180?.596+.01*P():.586+.042*P(),s=m0(o),n=.9*oe(o,.44,.625,.22),i=a<260?P.range(3.6,12.5):P.range(2.2,10),r=P.range(-.5,.5);t.copy(m0(L(o+14/r0,0,1))).sub(s).normalize().multiplyScalar(1-n).addScaledVector(Mt(o,e).sub(s).normalize(),n),t.y=0,t.normalize();const l=s.x+i*(t.x*Math.cos(r)-t.z*Math.sin(r)),c=s.z+i*(t.z*Math.cos(r)+t.x*Math.sin(r));t0.nearestXZ(l,c).dist<(a<260?2.1:.8)||N.fisherList.some(u=>Math.hypot(u.c[0]-l,u.c[1]-c)<(a<260?1.8:1.2))||(a<260?c0.push([l,0,c,P.range(.42,.58),P(),7,P(),P.range(.4,.8),P.range(1,1.9),0,P(),0,1.8]):d0.push([l,c,P.range(.5,1),0,P(),2,P(),0,0,0,0,0]))}}await w.yield();{for(let e=0,t=Math.round(230*Math.min(g0.lily,1.5)*(.6+.4*s0));e<t;e++){const a=339+130*Math.pow(S(),1.4),o=S.sign(),s=-17+o*(5.15-2.9*Math.pow(S(),1.7)),n=S.range(.24,.5),i=S.chance(.12);d0.push([s,a,n,0,S(),0,S(),S(),0,0,0,0]),i&&c0.push([s+.1,.05,a-.1,S.range(.3,.4),S(),S.chance(.3)?3:2,0,0,0,0,S(),0])}for(let e=0,t=Math.round(420*s0);e<t;e++)d0.push([-17+S.range(-4.4,4.4),340+110*S(),S.range(.035,.075),0,S(),1,S(),S(),0,0,0,0])}await w.yield();{for(let e=0,t=Math.round(430*Math.min(g0.lily,1.5)*(.6+.4*s0));e<t;e++){(e&63)===63&&await w.yield();const a=k()*H,o=Math.sqrt(k())*(X[2]-.5),s=X[0]+Math.cos(a)*o,n=X[1]+Math.sin(a)*o,i=k.range(.3,.66),r=k.chance(.3);t0.nearestXZ(s,n).dist<2.3||Q0.some(l=>Math.hypot(l.x-s,l.z-n)<1.5)||(d0.push([s,n,i,0,k(),0,k(),k(),0,0,0,0]),r&&c0.push([s+.1,.05,n-.1,k.range(.36,.52),k(),k.chance(.25)?3:2,0,0,0,0,k(),0]))}await w.yield();for(let e=0,t=Math.round(520*Math.min(g0.lily,1.5)*(.6+.4*s0));e<t;e++){let a,o;if(e%120===119&&await w.yield(),e%3===0){const f=E()*H,m=Math.sqrt(E())*(n0[2]-.5);a=n0[0]+Math.cos(f)*m,o=n0[1]+Math.sin(f)*m}else o=E.range(104,152),a=U(B0[7][0],B0[6][0],L((o-130)/26,0,1))+E.range(-1,1)*21;const s=E.range(.3,.7),n=E.chance(.32),i=E(),r=E(),l=E(),c=E(),u=E();tt(a,o)>-.5||t0.nearestXZ(a,o).dist<(e%3===0?2.3:1.7)||Q0.some(f=>Math.hypot(f.x-a,f.z-o)<1.5)||(d0.push([a,o,s,0,i,0,r,l,0,0,0,0]),n&&c0.push([a+.1,.05,o-.1,.36+.2*c,u,c<.25?3:2,0,0,0,0,r,0]))}await w.yield();for(let e=0,t=0;e<46&&t<500;t++){const a=we.length&&t%3<2?we[t%we.length]:null,o=k()*H,s=a?a[2]+k.range(3,20):k.range(40,200),n=k.range(3.4,8.2),i=(a?a[0]:Z[0])+Math.cos(o)*s,r=(a?a[1]:Z[1])+Math.sin(o)*s;r>-54||zt(i,r)>-n*.7-1||Math.hypot(i-30,r+195)<16||(d0.push([i,r,n,0,k(),7,0,k(),0,0,0,0]),e++)}for(let e=0,t=0;Me.length&&e<18&&t<240;t++){const a=Me[t%Me.length],o=E()*H,s=a[2]+E.range(4,26),n=E.range(5,10.5),i=a[0]+Math.cos(o)*s,r=a[1]+Math.sin(o)*s;Ea(i,r)>-n*.7-1||Math.hypot(i-30,r+195)<16||(d0.push([i,r,n,0,E(),7,0,E(),0,0,0,0]),e++)}}{const e=s=>{W0(s);const n=R.x,i=R.z;t0.posAtDist(Math.min(s*r0+14,r0),_).sub(R).normalize();const r=oe(s,.224,.288,.3)*.74;if(r>.001){const c=X[0]-v0*4-n,u=X[1]-9-i,f=Math.hypot(c,1-R.y,u)||1;_.multiplyScalar(1-r),_.x+=c/f*r,_.z+=u/f*r}const l=Math.hypot(_.x,_.z)||1;return[n,i,_.x/l,_.z/l]},t=(s,n,i)=>[s[0]+s[2]*n-s[3]*i,s[1]+s[3]*n+s[2]*i],a=[[.25,3.5,-.5,3.3,.4],[.2735,3.6,1.1,2.5,.46],[.297,3.5,-.7,3.1,.4],[.3185,3.7,.9,2.6,.44],[.34,3.6,-.3,3.2,.4]];for(const[s,n,i,r,l]of a){const c=e(s),u=t(c,n,i);d0.push([u[0],u[1],r,0,p0(),9,p0(),l,0,0,0,0])}for(const[s,n,i,r,l]of[[.25,4.3,-3,1.8,.1395],[.297,4.4,-1.7,1.6,.2966],[.34,4.6,1.5,1.7,.4536]]){const c=e(s),u=t(c,n,i);d0.push([u[0],u[1],r,0,l,8,p0(),0,0,0,0,0])}const o=e(.25);{const s=t(o,2,-.92),n=-o[2]-.8*o[3],i=-o[3]+.8*o[2],r=t(o,2.12,-1.04);d0.push([s[0],s[1],.46,0,(Math.atan2(i,n)/H%1+1)%1,0,p0(),.12*p0(),0,0,0,0]),c0.push([r[0],.05,r[1],.42,p0(),2,0,0,0,0,p0(),0])}for(const[s,n,i,r]of[[2.6,.3,.44,.62],[3.5,-.35,.58,.85]]){const l=t(o,s,n);d0.push([l[0],l[1],i,0,p0(),10,r,0,0,0,0,0])}for(let s=0;s<44;s++){const n=(s+p0())/44,i=n<.5?U(1.5,2.3,n*2):U(2.3,3.5,n*2-1),r=n<.5?U(.32,.85,n*2):U(.85,1.25,n*2-1),l=t(o,i+p0.gauss()*.14,r+p0.gauss()*.16);d0.push([l[0],l[1],p0.range(.04,.085),0,p0(),12,p0(),p0(),0,0,0,0])}}await w.yield();const Re=W0(y0).clone();d0.push([Re.x,Re.z,2.3,0,.3,5,y0,0,0,0,0,0]);const Bo=Math.round(40),Yt=[],Jt=(e,t,a,o,s,n,i=1)=>{const r=F0(e,t*a);if(X0(r[0],r[1])>-.6||Q0.some(m=>!m.e.p2&&Math.hypot(m.x-r[0],m.z-r[1])<1.3))return;Z0(e);const l=Math.hypot(_.x,_.z)||1,c=_.x/l*.8+i*t*(_.z/l),u=_.z/l*.8-i*t*(_.x/l),f=Math.hypot(c,u);Ae(r[0],r[1],o*1.45),c0.push([r[0],.06,r[1],o,n(),0,e-s/r0,0,c/f,u/f,0,0])};for(let e=0;e<Bo;e++){const t=e<30?C.range(.03,y0-.014):C.range(o0+.02,o0+.1),a=C.sign();Jt(t,a,C.range(2.3,3.7),.36,11,C)}for(let e=0;e<12;e++)Jt(.03+(y0-.05)*(e+P())/12,e%2?1:-1,P.range(1.6,2.1),P.range(.34,.4),6.5,P,-1);for(const[e,t]of[[.126,1],[.2558,-le],[.3458,1]])Jt(e,t,1.55,.42,5,P,-1);for(const[e,t]of[[.059,4.1],[.179,-le*4.2],[.2475,v0*3.4],[o0+.046,6.5],[o0+.066,-7.2]]){let a=F0(e,t*(Da>=4&&Math.abs(e-.2)<.12?.86:1));for(let s=0;s<6&&X0(a[0],a[1])>-.9;s++)a=F0(e,t*(.9-.1*s));Ae(a[0],a[1],.75),Ae(a[0]+.7,a[1]-.5,.45),W0(e),Z0(e);const o=Math.hypot(_.x,_.z)||1;Yt.push({x:a[0],z:a[1],u:e,lat:((a[0]-R.x)*-_.z+(a[1]-R.z)*_.x)/o})}{const t=F0(.0205,-4);d0.push([t[0],t[1],.75,0,k(),0,k(),k(),0,0,0,0],[t[0]+.7,t[1]-.5,.45,0,k(),0,k(),k(),0,0,0,0]),Yt.push({x:t[0],z:t[1],u:.0205,lat:-4,chan:!0,yFly:1.42})}const La=7,Ua=1,Va=1.4,Fo=(e,t,a,o)=>{W0(e),Z0(e);const s=Math.hypot(_.x,_.z)||1,n=_.x/s,i=_.z/s,r=R.x,l=R.z,c=t<0?-1:1,u=2.02+.7072*o,f=La/2,m=Ua/2,d=Va/2+.06;let h=u+m+Math.abs(t)*2.6,p=0,v=0,y=0;for(let g=0;g<12;g++){p=r-i*c*h,v=l+n*c*h,y=1e9;for(let x=0;x<1e3;x++){const z=$[x],B=$[x+1];if(!(Math.abs(z.x-p)+Math.abs(z.z-v)>16))for(let F=0;F<4;F++){const W=F/4,j=z.x+(B.x-z.x)*W-p,I=z.y+(B.y-z.y)*W-a,O=z.z+(B.z-z.z)*W-v;y=Math.min(y,Math.hypot(Math.max(Math.abs(j*n+O*i)-f,0),Math.max(Math.abs(O*n-j*i)-m,0),Math.max(Math.abs(I)-d,0)))}}if(y>=u)break;h+=u-y+.01}return y<u&&(p=r-i*c*h,v=l+n*c*h),[p,v,n,i]};for(let e=0,t=Math.round(60*(.7+.3*s0));e<t;e++){const a=e%3===2?C.range(o0,.52):C.range(0,y0),o=C.gauss(),s=C.range(.9,2.5),n=C.range(.5,.72),i=Fo(a,o,s,n);c0.push([i[0],s,i[1],n,C(),1,0,0,i[2],i[3],0,0])}if(h0.cormorants)for(let e=0;e<40;e++){const t=C.sign(),a=-7+t*C.range(6,30),o=C.range(42,64);X0(a,o)<-2&&c0.push([a,0,o,C.range(.6,.8),C(),4,0,0,0,0,C(),0])}const ja=W0(o0).clone();for(let e=0,t=Math.round(110*s0);e<t;e++){const a=e%3===0,o=a?Re:ja,s=a?y0-.007:o0-.004;c0.push([o.x+C.range(-1.2,1.2),.1,o.z+C.range(-1.2,1.2),C.range(.12,.34),C(),5,s+C()*.005,C.range(3,8),C.range(-3,3),C.range(-7,-1),0,0])}for(let e=0,t=Math.round(250*s0);e<t;e++){W0(C.range(.6,.995));const a=C()*H,o=C.range(2.6,12);c0.push([R.x+Math.cos(a)*o,R.y+C.range(-8,8),R.z+Math.sin(a)*o,C.range(.2,.46),C(),6,0,0,0,0,C(),0])}for(let e=0,t=Math.round(90*s0);e<t;e++){W0(C.range(.88,1));const a=C()*H,o=C.range(2.4,7);c0.push([R.x+Math.cos(a)*o,R.y+C.range(-6,10),R.z+Math.sin(a)*o,C.range(.2,.42),C(),6,0,0,0,0,C(),0])}const ea=(e,t)=>C0(e,{parent:t,uniforms:{uGlint:{value:h0.hour==="dusk"?T("#DCE4FF").multiplyScalar(.84):q(A[6],T("#FFC548"),.78)},uPadA:{value:A[3].clone().multiplyScalar(.8)},uPadB:{value:A0?q(A0,A[3],.35).multiplyScalar(.9):q(A[3],A[5],.45).multiplyScalar(.9)},uSheetA:{value:q(A[2],A[5],.5).multiplyScalar(.96)},uSheetB:{value:q(A[2],A[5],.82).multiplyScalar(.94)}},vert:`
        float kind = iB.y, r = iA.z, wz = 1.0;
        c = vec3(iA.x, 0.03 + 0.014 * fract(iB.x * 9.0), iA.y);
        if (kind < 0.5) { r *= 1.35; c.y += 0.012 * sin(uTime * 1.6 + iB.x * 50.0); }
        else if (kind < 1.5) { float qd = fract(uTime * 0.07 + iB.z); c.z += (0.5 - qd) * 11.0; r *= sin(3.1416 * qd); }
        else if (kind < 2.5) { float qd = fract(uTime * 0.45 + iB.z); r *= 0.25 + qd; P.z = qd; }
        else if (kind < 3.5) { float qd = fract(uTime * 0.12 + iB.z); c.xz += uWind * (qd - 0.5) * 16.0; r *= sin(3.1416 * qd); }
        else if (kind > 11.5) { float qd = fract(uTime * 0.04 + iB.z); c.xz += vec2(0.9, 0.4) * (qd - 0.5); c.y = 0.046; r *= smoothstep(0.0, 0.1, qd) * (1.0 - smoothstep(0.9, 1.0, qd)) * (1.0 - uUnderK); }      // duckweed that keeps to its drift
        else if (kind > 9.5) { float qd = fract(uTime * 0.14 + iB.z); r *= (0.4 + 0.6 * qd) * (1.0 - uUnderK); P.z = qd; c.y = 0.05; }                                                              // a slow ring
        else if (kind > 8.5) { c.y = 0.014 + 0.006 * fract(iB.x * 9.0); c.x += 0.45 * sin(uTime * 0.21 + iB.x * 20.0); c.z += 0.2 * sin(uTime * 0.17 + iB.x * 31.0); r *= 1.0 - uUnderK; wz = iB.w; }        // a sheet of deeper teal sliding on the water
        else if (kind > 7.5) { c.y = 0.05; r *= 0.62 + 0.38 * sin(uTime * 1.9 + iB.x * 40.0); c.x += 0.5 * sin(uTime * 0.6 + iB.x * 17.0); }      // a glint: a torn strip of low sun that swells and thins
        else if (kind > 6.5) { c.y = 0.05; }
        else if (kind > 5.5) { float age = (uU - iB.z) * 40.0; r *= step(0.0, age) * (0.35 + 0.9 * sqrt(max(age, 0.0))); P.z = clamp(age / 1.9, 0.0, 1.0); c.y = 0.045; }
        else if (kind > 4.5) { r *= smoothstep(iB.z - 0.05, iB.z - 0.02, uU); c.y = 0.02; }
        T = vec3(r * 2.0, 0.0, 0.0); W = vec3(0.0, 0.0, r * 2.0 * (kind > 2.5 && kind < 3.5 ? 0.3 : kind > 8.5 ? wz : kind > 7.5 ? 0.3 * max(1.0, length(c.xz - cameraPosition.xz) / 6.0) : 1.0));
        P = vec4(kind, iB.w, P.z, iB.x);`,fpars:"uniform vec3 uPadA, uPadB, uGlint, uSheetA, uSheetB;",frag:`
        float kind = vP.x; vec2 q = vQ * 2.0; float len = length(q); tearK = 0.55;
        if (kind < 0.5) {
          q *= 1.35; len = length(q);
          float ang = atan(q.y, q.x + (abs(q.x) + abs(q.y) < 1e-5 ? 1e-4 : 0.0)) - seed * 6.2832;
          ang = abs(mod(ang + 3.1416, 6.2832) - 3.1416);
          float pe = min((1.0 - len) * 2.2, (ang - 0.17) * len * 3.5 + 1.0 - smoothstep(0.08, 0.3, len));
          float se = (1.0 - length(q - uShadowDir.xz * 0.2)) * 2.2;
          vec4 n = texture2D(uPaper, vWp.xz * 0.9 + seed);
          float th = 0.06 + 0.26 * n.r;
          if (pe > th) { e = 1.0; col = mix(uPadA, uPadB, vP.y) * (0.92 + 0.1 * cos(ang * 9.0)); col = mix(col, uWhite, (1.0 - smoothstep(th + 0.03, th + 0.12, pe)) * 0.8); col = mix(col, uDeep * 0.5, uUnderK * 0.85); }
          else { e = se > 0.18 ? 1.0 : 0.0; col = mix(uShade, uDeep, 0.35); col = mix(col, uDeep * 0.5, uUnderK); }
          deck = 0.0;
        } else if (kind < 1.5) { e = (1.0 - len) * 2.0; col = mix(uPadA, uWhite, 0.25 + 0.2 * vP.y) * 1.1; deck = 0.0; }
        else if (kind < 2.5) { e = (1.0 - abs(len - 0.78) / 0.17) * (1.0 - vP.z * 0.75) * 1.3; deck = 0.0; tearK = 1.0; }
        else if (kind < 3.5) { e = (1.0 - len) * 1.5; tearK = 1.0; }
        else if (kind < 4.5) {
          float b = 1.0 - length(q * vec2(3.2, 1.25)), w = 1.0 - length(vec2(q.x * 1.05, (q.y - 0.15 + 0.3 * abs(q.x)) * 3.6));
          e = max(b, w) * 2.0; col = uShade; deck = 0.0; alpha = vP.y;
        } else if (kind > 11.5) { e = (1.0 - len) * 2.0; col = mix(uPadA, uWhite, 0.1 + 0.22 * vP.y) * 1.14; deck = 0.0; }
        else if (kind > 9.5) { e = (1.0 - abs(len - 0.8) / 0.15) * (1.0 - vP.z * vP.z * 0.8) * 1.5; deck = 0.0; tearK = 1.0; }
        else if (kind > 8.5) {
          // a large torn sheet of deeper teal with a smaller, deeper one torn over it and a white hairline at the join
          vec4 n = texture2D(uPaper, vWp.xz * 0.11 + seed), m = texture2D(uPaper, vWp.xz * 0.37 + seed * 2.3);
          e = (1.0 - len) * 1.5 + (n.a - 0.5) * 1.2 + (m.r - 0.5) * 0.3;
          float e2 = 1.0 - length((q - vec2(0.2 - 0.4 * fract(seed * 5.3), -0.12)) / vec2(0.6, 0.72)) + (n.r - 0.5) * 0.9 + (m.a - 0.5) * 0.2;
          col = mix(uSheetA, uSheetB, step(0.1, e2));
          col = mix(col, uWhite, (1.0 - smoothstep(0.0, 0.07, abs(e2 - 0.1))) * 0.75);
          tearK = 1.0;
        } else if (kind > 7.5) { vec4 n = texture2D(uPaper, vWp.xz * vec2(0.5, 1.4) + seed); e = (1.0 - len) * 1.7 + (n.a - 0.5) * 0.9; col = uGlint * (0.94 + 0.12 * n.b); tearK = 1.0; }
        else if (kind > 6.5) {
          // a raft of lily pads seen from the air: one torn green sheet with open water torn out of it and flowers as white flecks
          vec4 n = texture2D(uPaper, vWp.xz * 0.045 + seed), m = texture2D(uPaper, vWp.xz * 0.31 + seed * 3.0);
          e = min((1.0 - len) * 1.5 + (n.a - 0.5) * 1.5, (m.a - 0.34) * 5.0 + 0.45);
          col = mix(uPadA, uPadB, clamp(smoothstep(0.5, 0.56, m.r) * 0.75 + 0.25 * vP.y, 0.0, 1.0));
          col = mix(col, uWhite, step(0.8, texture2D(uPaper, vWp.xz * 0.9 + seed).b) * 0.9);
          tearK = 1.0;
        } else if (kind > 5.5) { e = (1.0 - abs(len - 0.78) / 0.2) * (1.0 - vP.z) * 1.6; deck = 0.0; tearK = 1.0; }
        else { e = (1.0 - len) * 3.0; col = uHoney * 0.85; tearK = 1.0; }
        puv = vWp.xz * 0.7 + seed;`});ea(d0,Te);const Ct=ea([[0,0,.9,0,.5,4,0,1,0,0,0,0]],E0),So=()=>C0(c0,{uniforms:{uCrA:{value:q(A[3],A[5],.15).multiplyScalar(.9)},uCrB:{value:q(A[2],T("#3F6FE0"),.4)},uApricot:{value:A[1].clone().multiplyScalar(.95)},uYellow:{value:T("#F4D23A").multiplyScalar(.92)},uLilyOpen:{value:Co},uWing:{value:q(ne.white,A[2],.3)}},vpars:"float hh(float n) { return fract(sin(n * 12.9898) * 43758.5453); }",vert:`
        float kind = iB.y, sz = iA.w, sd = iB.x; c = iA.xyz; T = flatR * sz; W = vec3(0.0, sz, 0.0);
        if (kind < 0.5) {
          float lt = (uU - iB.z) * 40.0 / 0.7, j = clamp(lt, 0.0, 1.0), hj = 4.4 * (1.0 + iC.z);
          c.xz += iC.xy * j * 2.3; c.y += 0.5 * sz + hj * j * (1.0 - j) - step(1.0, lt) * 1.5;
          P.z = j;
          if (j > 0.001 && j < 0.999) {
            // in the air the frog is cut in side view and laid along its leap: head first, the long legs trailing
            float sx = dot(vec3(iC.x, 0.0, iC.y), flatR) * 2.3, sy = hj * (1.0 - 2.0 * j), fl = sx < 0.0 ? -1.0 : 1.0, ang = clamp(atan(sy, max(abs(sx), 0.35)), -0.8, 0.8);
            T = (flatR * fl * cos(ang) + vec3(0.0, sin(ang), 0.0)) * sz * 1.7; W = (vec3(0.0, cos(ang), 0.0) - flatR * fl * sin(ang)) * sz;
            P.y = 1.0;
          }
        } else if (kind < 1.5) {
          float tt = uTime * 0.5 + sd * 10.0, cyc = floor(tt), f = smoothstep(0.55, 1.0, fract(tt));
          vec3 h0 = vec3(hh(cyc + sd * 7.0), hh(cyc * 1.3 + sd * 3.0), hh(cyc * 1.7 + sd)), h1 = vec3(hh(cyc + 1.0 + sd * 7.0), hh((cyc + 1.0) * 1.3 + sd * 3.0), hh((cyc + 1.0) * 1.7 + sd));
          vec3 hop = mix(h0, h1, f) - 0.5;            // (inside its box, which was dealt clear of our line: iC.xy is the box's long axis)
          c.xz += iC.xy * (hop.x * ${La.toFixed(1)}) + vec2(-iC.y, iC.x) * (hop.z * ${Ua.toFixed(1)}); c.y += hop.y * ${Va.toFixed(1)} + 0.06 * sin(uTime * 9.0 + sd * 30.0);
          float ro = sd * 6.2832 + 0.3 * sin(uTime * 2.0 + sd * 9.0);
          T = (camR * cos(ro) + camU * sin(ro)) * sz; W = (camU * cos(ro) - camR * sin(ro)) * sz;
        } else if (kind < 3.5) {
          c.y += 0.42 * sz; W = (vec3(0.0, 1.0, 0.0) + flatR * 0.13 * sin(uTime * 1.3 + sd * 40.0)) * sz;
        } else if (kind < 4.5) {
          float ph = fract(uTime * 0.13 + iC.z), up = 1.0 - smoothstep(0.5, 0.58, ph) + smoothstep(0.93, 1.0, ph);
          c.xz += 2.0 * vec2(sin(sd * 40.0), cos(sd * 40.0)) * ph;
          c.y += 0.5 * sz + (up - 1.0) * sz * 1.2 + 0.22 * sz * smoothstep(0.44, 0.5, ph) * (1.0 - smoothstep(0.5, 0.56, ph)) + 0.02 * sin(uTime * 2.0 + sd * 20.0);
        } else if (kind > 6.5) {
          // a fish leaps: out of the water along a random heading, an arc, and back under (drawn only above the surface)
          float tt = uTime / max(iC.x, 0.5) + iB.z, qf = fract(tt), cyc = floor(tt), h1 = hh(cyc + sd * 78.0);
          vec2 base = c.xz + (vec2(h1, fract(h1 * 7.13)) - 0.5) * 1.6;
          float j = qf / (iC.y > 0.05 ? iC.y : 0.5), air = step(j, 1.0), da = sd * 6.2832 + cyc * 2.4, vy = iB.w * 4.0 * (1.0 - 2.0 * j) / 2.3, il = 1.0 / sqrt(1.0 + vy * vy);
          vec2 tcx = cameraPosition.xz - base;        // it leaps across our view, so the whole flank shows
          vec2 d = normalize(vec2(-tcx.y, tcx.x) * (fract(sd * 13.7 + cyc * 0.37) < 0.5 ? -1.0 : 1.0) + 0.45 * length(tcx) * vec2(cos(da), sin(da)) + vec2(1e-4, 0.0));
          float upK = 1.0 - iC.w * smoothstep(0.6035, 0.608, uU);      // (iC.w: the near five, who go under between u 0.6035 and 0.608. Nothing here reads the lens's place to keep a fish under: each fish's box is stood 2 m off our line at the build)
          c = vec3(base.x + d.x * (j - 0.5) * 2.3, air * iB.w * 4.0 * j * (1.0 - j) * upK - (1.0 - air) * 0.9 - 0.04 - (1.0 - upK) * 0.6, base.y + d.y * (j - 0.5) * 2.3);
          vec3 Tf = vec3(d.x * il, vy * il, d.y * il), tc = cameraPosition - c;
          // (the quad is cut a fifth larger than the fish, so its fins and its shadow sheet have room; the back is always up)
          T = Tf * sz * 1.22; W = normalize(cross(Tf, tc) + vec3(0.0, 1e-4, 0.0)) * sz * 0.44 * 1.22; if (W.y < 0.0) W = -W;
          P.y = iC.w;
        } else if (kind > 5.5) {
          float qd = fract(uTime * 0.07 + iC.z), ro = sd * 20.0 + uTime * (0.6 + sd);
          c.y += (qd - 0.5) * 26.0; c.xz += 1.2 * vec2(sin(uTime * 0.6 + sd * 30.0), cos(uTime * 0.5 + sd * 17.0));
          // the down is a medium we fly through, so it takes the near law in the form of the kit's makeParticles: by the true distance of
          // its middle from the lens, on its alpha alone (handed to the fragment stage in P.y). The two figures, 0.6 m and 2.5 m, are those
          // of the kit's petals preset; this field cuts by coverage and throws a fragment away under alpha 0.04, so a piece whose middle is
          // inside about 0.83 m is not drawn
          sz *= sin(3.1416 * qd); P.y = smoothstep(0.6, 2.5, length((viewMatrix * modelMatrix * vec4(c, 1.0)).xyz));
          T = (camR * cos(ro) + camU * sin(ro)) * sz; W = (camU * cos(ro) - camR * sin(ro)) * sz * (0.45 + 0.4 * abs(cos(uTime * 1.3 + sd * 9.0)));
        } else {
          float lt = (uU - iB.z) * 40.0, j = max(lt, 0.0), ro = sd * 20.0 + j * (4.0 + 6.0 * sd);
          c += vec3(iC.x, iB.w, iC.y) * j; c.y -= 4.9 * j * j;
          sz *= step(0.0, lt) * (1.0 - smoothstep(1.3, 2.0, j)) * (1.0 - iC.z * smoothstep(0.45, 0.85, j));      // (iC.z: the raft's spray, which is gone before the lens reaches it)
          T = (camR * cos(ro) + camU * sin(ro)) * sz; W = (camU * cos(ro) - camR * sin(ro)) * sz * (0.4 + 0.6 * abs(cos(j * 7.0 + sd * 9.0)));
        }
        P = vec4(kind, P.y, P.z, sd);`,fpars:`uniform vec3 uCrA, uCrB, uApricot, uYellow; uniform float uLilyOpen;
float segE(vec2 p, vec2 a, vec2 b, float w) { vec2 pa = p - a, ba = b - a; return 1.0 - length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0)) / w; }`+ms+po,frag:`
        float kind = vP.x; vec2 q = vQ * 2.0; vec4 n = texture2D(uPaper, vQ * 0.4 + seed); tearK = 0.5;
        vec2 aq = vec2(abs(q.x), q.y);
        if (kind < 0.5 && vP.y > 0.5) {
          float body = 1.0 - length((q - vec2(0.1, 0.04)) / vec2(0.54, 0.31)), head = 1.0 - length((q - vec2(0.58, 0.1)) / vec2(0.3, 0.25));
          float eyeb = 1.0 - length((q - vec2(0.6, 0.31)) / vec2(0.16, 0.14)), trunk = max(max(body, head), eyeb);
          float legs = max(max(segE(q, vec2(-0.22, -0.02), vec2(-0.6, -0.27), 0.16), segE(q, vec2(-0.6, -0.27), vec2(-0.92, -0.05), 0.105)),
            max(1.0 - length((q - vec2(-0.9, 0.05)) / vec2(0.1, 0.17)), segE(q, vec2(0.36, -0.1), vec2(0.62, -0.5), 0.085)));
          e = max(trunk, legs) * 2.4;
          col = mix(uCrA, uDeep, smoothstep(0.55, 0.62, n.a) * 0.7);
          if (legs > trunk) col = mix(uCrA, uDeep, 0.4);
          else col = mix(col, uWhite * vec3(0.95, 1.0, 0.8), 1.0 - smoothstep(-0.16, -0.06, q.y - 0.12 * q.x));
          if (length((q - vec2(0.62, 0.3)) / vec2(0.08, 0.075)) < 1.0) col = uDeep * 0.5;
          if (vWp.y < 0.0) cut = true;      // (under the water line; here and below the cut is only noted, and made after paperSheet: see FIELD_FRAG)
        } else if (kind < 0.5) {
          float b = 1.0 - length((q - vec2(0.0, -0.3)) / vec2(0.78, 0.5));
          float ey = 1.0 - length((aq - vec2(0.34, 0.24)) / 0.24);
          float ft = 1.0 - length((aq - vec2(0.74, -0.7)) / vec2(0.26, 0.16));
          e = max(b, max(ey, ft)) * 2.2;
          col = mix(uCrA, uDeep, smoothstep(0.55, 0.62, n.a) * 0.7);
          col = mix(col, uWhite * vec3(0.95, 1.0, 0.8), 1.0 - smoothstep(-0.52, -0.42, q.y));
          if (ey > 0.5) col = uDeep * 0.5;
          if (vWp.y < 0.0) cut = true;
        } else if (kind < 1.5) {
          float isB = 0.0; col = hawker(q, sin(uTime * 37.0 + seed * 40.0), uCrA, mix(uCrA, uCrB, 0.3 + 0.7 * step(0.4, fract(seed * 7.0))), e, isB);
          deck = 1.0 - isB; tearK = 0.25 * (1.0 - isB);
        } else if (kind < 2.5) {
          float len = length(q), ang = atan(q.y, q.x + (abs(q.x) + abs(q.y) < 1e-5 ? 1e-4 : 0.0));
          float rr = mix(0.4, 0.55, uLilyOpen) + mix(0.1, 0.4, uLilyOpen) * abs(cos(3.0 * ang + seed * 6.0));
          e = (rr - len) * 3.0;
          col = len < 0.27 * uLilyOpen ? uApricot : mix(uWhite, uWhite * vec3(1.0, 0.9, 0.95), smoothstep(0.3, 0.9, len));
        } else if (kind < 3.5) {
          float cup = (0.46 - length(q - vec2(0.0, 0.4))) * 3.0, st = (1.0 - abs(q.x) / 0.09) * step(q.y, 0.2);
          e = max(cup, st); col = cup > 0.0 ? uYellow * (0.85 + 0.15 * smoothstep(0.0, 0.5, cup)) : uCrA;
        } else if (kind < 4.5) {
          q.x *= fract(seed * 3.1) < 0.5 ? -1.0 : 1.0;
          float b = 1.0 - length((q - vec2(-0.1, -0.62)) / vec2(0.85, 0.3));
          vec2 pa = q - vec2(0.42, -0.5), ba = vec2(0.12, 0.95);
          float nk = 1.0 - length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0)) / 0.13;
          float hd = 1.0 - length((q - vec2(0.72, 0.5)) / vec2(0.3, 0.1));
          e = max(b, max(nk, hd)) * 2.5; col = mix(uDeep * 0.5, uShade * 0.55, n.b * 0.4); deck = 0.5;
          if (vWp.y < 0.0) cut = true;
        } else if (kind > 6.5) {
          // a leaping fish cut from torn papers: a silver flank sheet with brush streaks along it, a blue back sheet torn
          // along its lower edge (white deckle on the tear), a white belly, tail and fins in rayed blue-apricot paper, a thin
          // dark gill arc, a pectoral fin with its own white rim, an eye, a white deckle rim all round and a lilac shadow
          // sheet slipped out below and behind
          vec2 fq = vec2(vQ.x * 1.22 + 0.5, q.y * 1.22);
          vec3 fe = fishE(fq), fsh = fishE(fq - vec2(-0.035, -0.2));
          float sh = max(fe.x, max(fe.y, fe.z)), shS = max(fsh.x, max(fsh.y, fsh.z)), th = 0.1 + (0.1 + 0.26 * vP.y) * n.r;
          vec4 n2 = texture2D(uPaper, vec2(fq.x * 0.9, fq.y * 0.22) + seed * 3.0);
          deck = 0.0; tearK = 0.0;
          if (sh > th) {
            e = 1.0;
            float yb = 0.1 + 0.15 * sin(fq.x * 7.0 + seed * 20.0) + (n2.r - 0.5) * 0.5;
            col = mix(mix(uWhite, uCrB, 0.16) * (0.84 + 0.3 * n2.b), uCrB * (0.68 + 0.3 * n2.b), step(yb, fq.y));
            col = mix(col, uWhite, (1.0 - smoothstep(0.0, 0.075, abs(fq.y - yb))) * 0.85);
            col = mix(col, uWhite * 1.02, 1.0 - smoothstep(-0.62, -0.5, fq.y + (n2.a - 0.5) * 0.2));
            if (fe.x <= th) col = mix(uCrB * 0.8, uApricot, fe.y > fe.z ? 0.42 : 0.25) * (0.84 + 0.3 * step(0.5, fract(fq.y * 3.5 + fq.x * 4.0)));
            else {
              vec2 pq = fq - vec2(0.57, -0.26); pq = vec2(pq.x * 0.8 + pq.y * 0.6, -pq.x * 0.6 + pq.y * 0.8);
              float pf = 1.0 - length(pq / vec2(0.17, 0.1));
              if (pf > 0.0) col = mix(uWhite, mix(uCrB * 0.8, uApricot, 0.34), smoothstep(0.16, 0.34, pf));
              float gill = abs(fq.x - (0.69 + 0.065 * (1.0 - fq.y * fq.y)));
              col = mix(col, uDeep * 0.45, (1.0 - smoothstep(0.01, 0.02, gill)) * step(abs(fq.y), 0.62) * 0.9);
              float ey = length((fq - vec2(0.86, 0.15)) / vec2(0.055, 0.125));
              if (ey < 1.0) col = ey < 0.6 ? uDeep * 0.35 : uWhite;
            }
            col = mix(col, uWhite, (1.0 - smoothstep(th + 0.03, th + 0.14, sh)) * 0.9);
          } else { e = shS > 0.16 ? 1.0 : 0.0; col = mix(uShade, uDeep, 0.2); }
          if (vWp.y < 0.0) cut = true;
        } else { e = (1.0 - length(q * vec2(1.0, 1.5))) * 1.6 + (n.r - 0.5) * 0.8; tearK = 1.0; if (kind > 5.5) alpha = vP.y; }      // (the down thins as it nears the lens)
        puv = vQ * 0.5 + seed;`});await w.yield();const Dt=e=>(Z0(e),Math.atan2(_.x,_.z)),Ia=[],ta=[],_a=[],qo=new b,Qa=new b,aa=new b,Po=new b,To=new b,Bt=new b;let Ga=null;const Ke=(e,t,a)=>{const o=N.makeFlock(e,t);return E0.add(o),Ia.push(o),_a.push({name:a,list:e,o:t,m:o}),o},Ha=(e,t,a,o,s,n,i,r,l,c)=>{W0(e),Z0(e);const u=Math.hypot(_.x,_.z)||1,f=_.x/u,m=_.z/u,d=-m,h=f;let p=d*o-f*s,v=h*o-m*s;const y=Math.hypot(p,v);p/=y,v/=y;const g=new b(R.x+f*t+d*(c.lat??0),R.y+a,R.z+m*t+h*(c.lat??0)),x=Math.atan2(p,v),z=[];for(let F=0;F<i;F++)z.push({x:-p*(F-l)*r+M.range(-.5,.5),y:M.range(-.35,.35)+.25*Math.sin(F*1.3),z:-v*(F-l)*r+M.range(-.5,.5),yaw:x+M.range(-.05,.05),scale:(c.scale??1)*M.range(.94,1.08),seed:M(),phase:F*.35,flap:1,flush:M()});const B=Ke(z,c,c.name??"crossing");return ta.push({m:B,X:g,V:new b(p*n,0,v*n),uX:e,sink:c.sink??0}),B},G0=$.map((e,t)=>{const a=$[Math.max(0,t-1)],o=$[Math.min(1e3,t+1)],s=o.x-a.x,n=o.z-a.z,i=Math.hypot(s,n)||1;return[-n/i,s/i]}),Ft=(e,t,a)=>{let o,s,n;if(e.hold){const h=e.hold,p=1-D(h.u0,h.u0+h.din,t),v=D(h.u1,h.u1+h.dout,t),y=t*h.wk+h.wp;o=h.a+h.aIn*p+h.aOut*v+h.aw*Math.sin(y),s=h.lat*(1+h.sIn*p)+h.latOut*v*v+h.lw*Math.sin(y*.73+1.3),n=h.dy+h.dyIn*p+h.dyOut*v+h.dw*Math.sin(y*1.31+2.1)}else{o=L(e.vrel*40*(e.uab-t)-(e.uE!==void 0?18*(1-D(e.uE,e.uE+e.eDur,t)):0),-70,70);const h=e.spread?1-D(e.uab-.12,e.uab-.05,t):0,p=e.peel?1-D(.5,6,o):0;s=e.lat*(1+e.spread*h)*(1+(e.peel??0)*p)+(e.latV??0)*(t-e.uab)*40,n=e.dy*(1+e.spread*h)+(e.dyFar??0)*h+1.3*p}const i=L((t+o/r0)*1e3,0,1e3),r=Math.min(999,Math.floor(i)),l=i-r,c=$[r],u=$[r+1],f=G0[r],m=G0[r+1],d=Math.max(0,(t+o/r0)*1e3-1e3);return a.set(U(c.x,u.x,l+d)+U(f[0],m[0],l)*s,e.yAbs?e.yAbs(t):Math.max(2.2,U(c.y,u.y,l+d)+n),U(c.z,u.z,l+d)+U(f[1],m[1],l)*s),a},k0=new b(...se.portalSeat.position),S0=new b(...se.portalSeat.direction),H0=new b,Eo=(e,t,a,o)=>{t0.pointAt(e,H0);const s=t.x-H0.x,n=t.y-H0.y,i=t.z-H0.z,r=s*S0.x+n*S0.y+i*S0.z;if(r<=.5)return t;const l=(k0.x-H0.x)*S0.x+(k0.y-H0.y)*S0.y+(k0.z-H0.z)*S0.z,c=l/r;if(l<=.5||c<1)return t;let u=H0.x+s*c-k0.x,f=H0.y+n*c-k0.y,m=H0.z+i*c-k0.z,d=Math.hypot(u,f,m);const h=8.4+2.2*a*c;if(d<h){if(d<.5){const v=G0[L(Math.round(e*1e3),0,1e3)],y=o<0?-1:1;u=v[0]*y,f=0,m=v[1]*y,d=1}const p=(h-d)/d/c;t.x+=u*p,t.y+=f*p,t.z+=m*p}return t},oa=(e,t,a)=>{if(t<e.show0||t>e.show1)return a.set(0,-400,0);if(e.custom)return e.custom(t,a);if(Ft(e,t,a),e.from){const o=(t-e.launch)*40,s=D(e.w0??.3,e.w1??2.8,o);a.set(U(e.from[0],a.x,s),U(e.from[1],a.y,Math.pow(s,1.6)),U(e.from[2],a.z,s))}return e.hold&&t>.6&&Eo(t,a,e.scale??1,e.hold.lat),a},St=[],x0=new b,qt=new b,vs=new b,ys=new b,xs=new b,gs=new b(0,1,0),Le=(e,t,a)=>{for(const s of e)s.pos=(n,i)=>oa(s,n,i),s.x=0,s.y=-400,s.z=0,s.show0??(s.show0=-1),s.show1??(s.show1=2);const o=Ke(e,{...t,run:0,rise:0,clipY:Math.max(t.clipY??-1e6,-300)},a);return St.push({m:o,list:e,u0:Math.min(...e.map(s=>s.show0)),u1:Math.max(...e.map(s=>s.show1)),on:!0}),o},Wo=e=>{for(const t of St){const a=e>=t.u0&&e<=t.u1;if(!a&&!t.on)continue;const o=t.m.userData.iA,s=t.list.length,n=t.m.userData.copies;for(let i=0;i<s;i++){const r=t.list[i];r.pos(e,x0);let l=r.yaw??0;if(r.yawFn)l=r.yawFn(e);else if(x0.y>-300){r.pos(e+.0012,qt);const c=qt.x-x0.x,u=qt.z-x0.z;qt.y>-300&&c*c+u*u>1e-5?l=Math.atan2(c,u)+(r.yawBias??0):r.yawOf&&(l=r.yawOf(e))}r.yawNow=l;for(let c=0;c<n;c++){const u=(i+c*s)*4;o[u]=x0.x,o[u+1]=x0.y,o[u+2]=x0.z,o[u+3]=l}}t.m.geometry.attributes.iA.needsUpdate=!0,t.on=a}},Ro=.121,Ko=Ha(Ro,7.5,3.95,.7,.7,10.5,9,4.8,2,{shadow:!0,sink:3.7,scale:1.3}),Lo={white:T("#8A4A86").multiplyScalar(.8),cream:T("#9A5A6E").multiplyScalar(.8),flush:T("#7A4690").multiplyScalar(.8),ink:T("#3E9A6A").multiplyScalar(.8),face:T("#5A3A80"),bill:q(A[5],T("#3A2A60"),.5),pouch:q(A[5],T("#3A2A60"),.5),pouchDeep:T("#3A2A60")};Ha(.25,11,3.6,-.9*v0,.42,11,14,3.1,1.5,{colors:Lo,scale:.98,neck:[.25,.1,-.3],flapRate:6.5,sink:.6,lat:v0*9.5,name:"ibis"}),await w.yield();const Ue=(e,t,a)=>{const o=L(e*1e3,0,1e3),s=Math.min(999,Math.floor(o)),n=o-s,i=$[s],r=$[s+1],l=G0[s],c=G0[s+1];return a.set(U(i.x,r.x,n)+U(l[0],c[0],n)*t,U(i.y,r.y,n),U(i.z,r.z,n)+U(l[1],c[1],n)*t)};let Ve=null,Pt=null;const ke=[],sa=(e,t,a,o)=>ke.push([e,t,o,0,M(),6,a,0,0,0,0,0]);{const t=[[6.6,-4.7,1.26],[8.8,-2.2,1.2],[11.6,-6.6,1.3]].map(([l,c,u],f)=>{const d=.42+l/80,h=-.5;return{vrel:2,uab:d,lat:c+h*(d-.42)*40,latV:h,dy:0,spread:0,scale:u,seed:M(),dal:1,phase:f*1.7,flap:1,yawBias:-.45,launch:o0-.016+f*.002,show0:o0-.02,show1:.6,yAbs:p=>.1+(.25+.2*f)*D(o0,.424,p)+3.4*D(.424,.495,p)+24*D(.462,.56,p)}});Ga=t[1],Le(t,{shadow:!0,flapRate:5.4},"dalmatians");for(const l of t)for(let c=o0-.012;c<.42+.022;c+=.0028)Ft(l,c,R),sa(R.x+M.range(-.3,.3),R.z+M.range(-.3,.3),c,M.range(.45,.7));await w.yield();const a=ne.white.clone().multiplyScalar(1.04),o=q(T("#C8782E"),A[1],.25).multiplyScalar(.86),s=Yt.map((l,c)=>{const u=l.u+.001,f=new b(l.x,.06,l.z),m=l.lat,d=c>=3&&!l.chan,h=d?Math.sign(l.lat)*12:-Math.sign(l.lat)*4,p=new b;return c===2?{scale:1.06,seed:M(),phase:Math.asin(.3)-78,flap:1,launch:.2245,yaw:Dt(l.u)+v0*1.2,show0:-1,show1:.318,uc:u,pad:f,custom:(v,y)=>y.copy(f)}:{scale:l.chan?1.08:.95,seed:l.chan?k():M(),phase:c*2.1,flap:1,launch:u-.021,yaw:Dt(l.u)+(l.lat<0?.5:-.5),show0:-1,show1:u+.09,uc:u,custom:(v,y)=>{const g=(v-u)*40;if(g<=-.84)return y.copy(f);const x=D(-.84,.1,g),z=l.chan?3.7-2.1*D(.7,2.6,g):4.6-2.8*D(.7,2.6,g);return Ue(v+z/r0,U(m,h,d?D(-.5,2.2,g):D(-1.3,1.6,g)),p),p.y=U(l.yFly??(d?.95:.74),p.y+5.2,d?D(.2,2,g):D(.9,2.4,g)),y.set(U(f.x,p.x,x),U(f.y,p.y,x*x),U(f.z,p.z,x))}}});Ve=Le(s,{colors:{white:a,ink:q(b0.uShade.value,A[5],.45).multiplyScalar(.74),face:q(a,A[4],.5),bill:q(A[2],A[5],.4),pouch:A[4].clone(),pouchDeep:A[4].clone(),flush:o,cream:q(a,o,.8),back:o.clone().multiplyScalar(.95),tail:a},foldTint:[1,.8,.5],flapRate:6.5,shadow:!0,slip:.2},"herons"),Pt=s,Ve.geometry.attributes.iD.setUsage(G.DynamicDrawUsage),await w.yield();const n=[],i=(l,c)=>{let u=1e9;for(let f=430;f<=560;f++)u=Math.min(u,l.distanceTo($[f]));return u>=c};for(const[l,c,u]of[[.5145,5.6,.9],[.5105,8.6,-.7],[.519,6,-.75],[.5225,9.6,1.5],[.527,6.6,-.3],[.506,7.6,1.2],[.492,-6.2,.9],[.476,6,-.8]]){let f=c;Ue(l,f,R),R.y=Math.max(2,R.y+u);for(let m=0;m<8&&!i(R,5);m++)f+=Math.sign(c)*.7,Ue(l,f,R),R.y=Math.max(2,R.y+u);n.push({x:R.x,y:R.y,z:R.z,yaw:Dt(l)+Math.PI+M.range(-.7,.7),scale:M.range(.7,.8),seed:M(),phase:M()*6})}for(let l=0;l<8;l++){const c=M.sign();n.push({x:-7+c*M.range(9,26),y:M.range(2.6,5),z:M.range(52,108),yaw:M()*H,scale:.5,seed:M(),phase:M()*6})}Ke(n,{colors:{white:T("#9FADD2").multiplyScalar(.8),ink:q(T("#2E3A78"),A[5],.25).multiplyScalar(.6),face:q(A[5],T("#16264A"),.75).multiplyScalar(.45),cream:T("#7C8CBC").multiplyScalar(.76),flush:T("#6F80B4").multiplyScalar(.76),back:T("#6F80B4").multiplyScalar(.72),tail:T("#E4EAF6").multiplyScalar(.85),bill:A[1].clone(),pouch:A[1].clone(),pouchDeep:A[1].clone()},lod:!0,neck:[1.2,.4,-.35],flapRate:10,shadow:!0,slip:.16},"terns").userData.u.uHover.value.set(.6,1.1,0),await w.yield()}{const e=[];for(let c=0;c<397;c++)M();const t=[[.558,.632,5.9,-2.9,1.5,1.25,.85],[.562,.648,10.2,4.4,1.5,1.16,.3],[.57,.655,12.5,-1.6,2.6,1.14,.85],[.58,.64,15.5,-4.2,-.2,1.12,.3]];for(const[c,u,f,m,d,h,p]of t)ve||e.push({hold:{u0:c,din:.05,u1:u,dout:.075,a:f,lat:m,dy:d,aIn:44,sIn:1.5,dyIn:3,aOut:62,latOut:Math.sign(m)*26,dyOut:8,aw:.7,lw:.45,dw:.35,wk:k.range(60,95),wp:k()*H},show0:c-.006,launch:c-.006,show1:u+.075,scale:h,seed:k(),phase:k()*6,flap:p,flush:k()});e.length||e.push({hold:{u0:2,din:.05,u1:2.1,dout:.05,a:10,lat:3,dy:1,aIn:0,sIn:0,dyIn:0,aOut:0,latOut:0,dyOut:0,aw:0,lw:0,dw:0,wk:1,wp:0},show0:2,launch:2,show1:2.1,scale:1,seed:.5,phase:0,flap:0,flush:.5}),await w.yield(),Le(e,{shadow:!0,hideBefore:!0},"escorts").userData.u.uHover.value.set(.25,.25,0),await w.yield();const o={vrel:1,uab:0,lat:0,dy:0,spread:0},s=1.05,n=2.3,i=.78,r=[[-7,1,10.8,1.42,0],[6.8,-.6,10.2,1.38,.3],[-5,-4.4,12.6,1.44,-.3],[11.4,4.6,13.6,1.36,.6]].map(([c,u,f,m,d],h)=>{const p=F=>v.ph+s*(F-.95)*40,v={ph:d,scale:m,seed:M(),phase:h*1.9,flap:h%2?.2:.7,flush:M(),show0:.84,show1:.994,yawFn:F=>{const W=G0[L(Math.round(F*1e3),0,1e3)],j=p(F),I=-Math.sin(j)*W[0]+Math.cos(j)*W[1],O=-Math.sin(j)*W[1]-Math.cos(j)*W[0];return Math.atan2(I,O)},custom:(F,W)=>{const j=(F-.95)*40,I=Math.max(j,0),O=Math.max(j-.7,0),V=f-1.5*j+70*(1-D(-3.6,-1,j));o.uab=F+V/40,o.lat=Math.sign(c)*(Math.abs(c)+.4*I+3.2*O*O),o.dy=u*(1+.25*I);const K=G0[L(Math.round(F*1e3),0,1e3)],Q=p(F),u0=Math.cos(Q)*n,q0=Math.sin(Q)*n;Ft(o,F,W),W.x+=K[0]*u0+K[1]*q0,W.z+=K[1]*u0-K[0]*q0;const i0=m0(F),D0=W.x-i0.x,Be=W.y-i0.y,Fe=W.z-i0.z,O0=D0*S0.x+Be*S0.y+Fe*S0.z;if(O0>.5){const fe=(k0.x-i0.x)*S0.x+(k0.y-i0.y)*S0.y+(k0.z-i0.z)*S0.z,j0=fe/O0;let te=i0.x+D0*j0-k0.x,P0=i0.y+Be*j0-k0.y,Se=i0.z+Fe*j0-k0.z,T0=Math.hypot(te,P0,Se);const Oe=8.2+2.2*m*Math.max(j0,0);if(fe>.5&&T0<Oe){T0<.5&&(te=K[0]*Math.sign(c),P0=0,Se=K[1]*Math.sign(c),T0=1);const ae=(Oe-T0)/T0/j0;W.x+=te*ae,W.y+=P0*ae,W.z+=Se*ae}}return W}};let y=-2,g=0;const x=m0(.95),z=Math.sin(i),B=Math.cos(i);for(let F=0;F<72;F++){v.ph=F/72*H,v.custom(.95,R);const W=v.yawFn(.95),j=R.x-x.x,I=R.y-x.y,O=R.z-x.z,V=(-z*Math.cos(W)*j+B*I+z*Math.sin(W)*O)/Math.hypot(j,I,O);V>y&&(y=V,g=v.ph)}return v.ph=g+d,v});Le(r,{shadow:!0},"wheelers").userData.u.uHover.value.set(.15,.15,i),await w.yield()}const st=[[.7,.03,7.6,-.54,.1,.08,.11,55,12,-1,26,1.25,.5,-.3,-.1],[.704,.03,10.5,.52,.22,-.09,.11,128,-14,-1,24,1.2,.3,.32,-.06],[.697,.03,14,-.05,0,.03,.14,80,30,-1,30,1.2,.7,-.1,-.34],[.702,.03,7.9,.3,-.5,-.04,.07,104,40,1,12,1.16,.3,.16,-.36],[.698,.03,19,-.3,.5,.13,.05,20,0,-1,20,1.2,.8,-.26,.12],[.706,.03,24,.8,-.02,-.05,.13,110,-25,-1,30,1.2,.3,.42,-.2],[.7,.03,7.8,-.7,-.46,.05,.07,74,40,1,12,1.16,.8,-.44,-.3],[.695,.03,30,.42,.56,-.12,.07,150,0,-1,20,1.2,.3,.26,.16],[.788,.03,6.3,-.45,-.04,.05,.09,62,14,-1,30,1.3,.4,-.12,-.44,.03],[.791,.03,9.6,.62,0,-.07,.12,118,-12,-1,25,1.2,.5,.36,-.12],[.793,.03,13,.12,-.26,.02,.14,85,30,-1,32,1.2,.3,.06,-.38],[.786,.03,16,-.8,.52,.12,.07,30,0,-1,22,1.2,.8,-.4,.06],[.79,.03,20,.4,-.44,-.13,.05,160,15,-1,34,1.2,.3,.24,-.4],[.794,.03,15,-.14,.36,-.02,.14,100,-20,-1,20,1.16,.7,-.18,.2],[.79,.03,27,.86,-.3,-.1,.1,135,0,-1,30,1.2,.3,.5,-.24],[.884,.03,7.2,-.52,.08,.03,.04,66,0,-1,16,1.32,.35,-.3,.1],[.887,.03,7.6,.51,.02,-.03,.04,114,0,-1,16,1.3,.6,.3,.06],[.881,.03,13.5,-.28,-.56,.06,.04,58,0,-1,22,1.2,.3,-.2,-.3],[.89,.03,15.5,.66,-.52,-.05,.04,122,0,-1,22,1.2,.8,.34,-.26],[.885,.03,21,.28,.74,-.03,0,104,0,-1,20,1.2,.3,.2,.3]].map((e,t)=>({pk:e[0],hw:e[1],D:e[2],nx:e[3],ny:e[4],vx:e[5],vy:e[6],phi:e[7]*Math.PI/180,out:e[8]*Math.PI/180,side:e[9],tilt:e[10]*Math.PI/180,scale:e[11],flap:e[12],fx:e[13],fy:e[14],fin:.056,fout:e[15]??(e[0]>.86?.036:.056),wk:70+9*(t%5),wp:t*2.4,x:0,y:-400,z:0,yaw:0,launch:-1,seed:E(),phase:E()*6,flush:E()})),je=Ke(st,{shadow:!0},"climbers");je.userData.u.uHover.value.set(.1,.08,0);for(const e of["iA","iD"])je.geometry.attributes[e].setUsage(G.DynamicDrawUsage);const Uo=Math.min(...st.map(e=>e.pk-e.hw-e.fin)),Vo=Math.max(...st.map(e=>e.pk+e.hw+e.fout)),Oa=95,Ie=new b,Y0=new b,na=new b,nt=new b,R0=new b,it=new b,Na=new b,K0=new b,ia=new b,Tt=new b,_e=new b,Et=new b;let Xa=!0;const jo=(e,t,a)=>{const o=e>Uo&&e<Vo;if(!o&&!Xa)return;const s=je.userData.iA,n=je.userData.iD,i=st.length,r=t.matrixWorld.elements;Ie.set(-r[8],-r[9],-r[10]).normalize(),Y0.set(-Ie.z,0,Ie.x),Y0.lengthSq()<1e-6&&Y0.set(1,0,0),Y0.normalize(),na.crossVectors(Y0,Ie);const l=Math.tan((t.fov??62)*Math.PI/360),c=l*(t.aspect??1.78);Et.copy(k0).sub(a);const u=Et.dot(Ie),f=u>2,m=f?Et.dot(Y0)/u:0,d=f?Et.dot(na)/u:.6*l;for(let h=0;h<i;h++){const p=st[h],v=p.pk-p.hw-p.fin,y=p.pk+p.hw+p.fout;let g=0,x=-400,z=0,B=0,F=0,W=0;if(o&&e>v&&e<y){const j=D(v,p.pk-p.hw,e)*(1-D(p.pk+p.hw,y,e)),I=(e-p.pk)/.05,O=e*p.wk+p.wp,V=1.61*p.scale;let K=Math.max(1/U(1/Oa,1/p.D,j),V/(.42*c)),Q=U(m+p.fx,(p.nx+p.vx*I+.03*Math.sin(O))*c,j),u0=U(d+p.fy,(p.ny+p.vy*I+.03*Math.sin(O*1.31+1.7))*l,j);const q0=Math.max(0,c-V/K*1.05),i0=Math.max(0,l-V/K*.96);if(Q=L(Q,-q0,q0),u0=L(u0,-i0,i0),f){const de=11.5/u+V/K*.92;let Ma=Q-m,za=u0-d,mt=Math.hypot(Ma,za);mt<de&&(mt<1e-4&&(Ma=p.nx<0?-1:1,za=0,mt=1),Q=L(m+Ma/mt*de,-q0,q0),u0=L(d+za/mt*de,-i0,i0),Math.hypot(Q-m,u0-d)<de-.001&&(u0=L(d-Math.sqrt(Math.max(de*de-(Q-m)*(Q-m),0)),-i0,i0)))}nt.copy(Ie).addScaledVector(Y0,Q).addScaledVector(na,u0).multiplyScalar(K).add(a),R0.copy(a).sub(nt).normalize(),it.copy(Y0).addScaledVector(R0,-R0.dot(Y0)).normalize(),Na.crossVectors(R0,it);const D0=p.phi+.12*Math.sin(O*.7+.6),Be=Math.cos(p.out),Fe=Math.hypot(R0.x,R0.z)||1,O0=1-j;K0.copy(it).multiplyScalar(Math.cos(D0)*Be).addScaledVector(Na,Math.sin(D0)*Be).addScaledVector(R0,-Math.sin(p.out)).multiplyScalar(j),K0.x+=O0*(-R0.x/Fe*.94+it.x*.3*Math.cos(D0)),K0.y+=O0*.22,K0.z+=O0*(-R0.z/Fe*.94+it.z*.3*Math.cos(D0)),K0.normalize(),ia.copy(R0).addScaledVector(K0,-K0.dot(R0)).normalize(),Tt.crossVectors(ia,K0),Tt.y<0&&Tt.negate();const fe=U(-1,p.side,j),j0=Math.max(p.tilt,.35*(1-Math.abs(fe))+.2);_e.copy(ia).multiplyScalar(fe*Math.cos(j0)).addScaledVector(Tt,Math.sin(j0)).normalize(),B=Math.atan2(K0.x,K0.z),W=Math.asin(L(K0.y,-1,1));const te=Math.cos(B),P0=Math.sin(B),Se=_e.x*te-_e.z*P0,T0=_e.x*P0+_e.z*te,Oe=Math.cos(W),ae=Math.sin(W);F=Math.atan2(-Se,_e.y*Oe-T0*ae),g=nt.x,x=nt.y,z=nt.z}for(let j=0;j<2;j++){const I=(h+j*i)*4;s[I]=g,s[I+1]=x,s[I+2]=z,s[I+3]=B,n[I]=F,n[I+1]=W}}je.geometry.attributes.iA.needsUpdate=!0,je.geometry.attributes.iD.needsUpdate=!0,Xa=o};await w.yield();const a0={x:0,y:-400,z:0,yaw:0,pitch:0,roll:0},e0={tanH:1.07,tanV:.6,sx:0,sy:.4,sun:!1,sunD:100},Qe=new b(0,0,-1),J0=new b(1,0,0),la=new b(0,1,0),lt=new b,L0=new b,rt=new b,$a=new b,U0=new b,ra=new b,Wt=new b,Ge=new b,Rt=new b,Io=(e,t)=>{const a=e.matrixWorld.elements;Qe.set(-a[8],-a[9],-a[10]).normalize(),J0.set(-Qe.z,0,Qe.x),J0.lengthSq()<1e-6&&J0.set(1,0,0),J0.normalize(),la.crossVectors(J0,Qe),e0.tanV=Math.tan((e.fov??62)*Math.PI/360),e0.tanH=e0.tanV*(e.aspect??1.78),Rt.copy(k0).sub(t),e0.sunD=Rt.dot(Qe),e0.sun=e0.sunD>2,e0.sx=e0.sun?Rt.dot(J0)/e0.sunD:0,e0.sy=e0.sun?Rt.dot(la)/e0.sunD:.6*e0.tanV},Za=(e,t,a,o)=>{const s=e0.tanH,n=e0.tanV,i=(t-e.pk)/.05,r=t*e.wk+e.wp,l=1.61*e.scale,c=Math.max(1/U(1/Oa,1/e.D,a),l/(.42*s));let u=U(e0.sx+e.fx,(e.nx+e.vx*i+.025*Math.sin(r))*s,a),f=U(e0.sy+e.fy,(e.ny+e.vy*i+.025*Math.sin(r*1.31+1.7))*n,a);const m=Math.max(0,s-l/c*1.05),d=Math.max(0,n-l/c*.96);if(u=L(u,-m,m),f=L(f,-d,d),e0.sun){const O=11.5/e0.sunD+l/c*.92;let V=u-e0.sx,K=f-e0.sy,Q=Math.hypot(V,K);Q<O&&(Q<1e-4&&(V=e.nx<0?-1:1,K=0,Q=1),u=L(e0.sx+V/Q*O,-m,m),f=L(e0.sy+K/Q*O,-d,d),Math.hypot(u-e0.sx,f-e0.sy)<O-.001&&(f=L(e0.sy-Math.sqrt(Math.max(O*O-(u-e0.sx)*(u-e0.sx),0)),-d,d)))}lt.copy(Qe).addScaledVector(J0,u).addScaledVector(la,f).multiplyScalar(c).add(o),L0.copy(o).sub(lt).normalize(),rt.copy(J0).addScaledVector(L0,-L0.dot(J0)).normalize(),$a.crossVectors(L0,rt);const h=(e.toSun?Math.atan2(e0.sy-f,e0.sx-u||1e-4):0)+e.phi+.1*Math.sin(r*.7+.6),p=Math.cos(e.out),v=Math.hypot(L0.x,L0.z)||1,y=1-a;U0.copy(rt).multiplyScalar(Math.cos(h)*p).addScaledVector($a,Math.sin(h)*p).addScaledVector(L0,-Math.sin(e.out)).multiplyScalar(a),U0.x+=y*(-L0.x/v*.94+rt.x*.3*Math.cos(h)),U0.y+=y*.22,U0.z+=y*(-L0.z/v*.94+rt.z*.3*Math.cos(h)),U0.normalize(),ra.copy(L0).addScaledVector(U0,-U0.dot(L0)).normalize(),Wt.crossVectors(ra,U0),Wt.y<0&&Wt.negate();const g=U(-1,e.side,a),x=Math.max(e.tilt,.35*(1-Math.abs(g))+.2);Ge.copy(ra).multiplyScalar(g*Math.cos(x)).addScaledVector(Wt,Math.sin(x)).normalize(),a0.yaw=Math.atan2(U0.x,U0.z),a0.pitch=Math.asin(L(U0.y,-1,1));const z=Math.cos(a0.yaw),B=Math.sin(a0.yaw),F=Ge.x*z-Ge.z*B,W=Ge.x*B+Ge.z*z,j=Math.cos(a0.pitch),I=Math.sin(a0.pitch);a0.roll=Math.atan2(-F,Ge.y*j-W*I),a0.x=lt.x,a0.y=lt.y,a0.z=lt.z},ca=(e,t,a)=>{let o=t-e;return o=Math.atan2(Math.sin(o),Math.cos(o)),e+o*a},_o=[[5.8,.5,1.4,5.2,-.5,.34,0,-.1,-.3],[6,2.4,1.42,6.6,.1,.5,.4,.05,-.36],[7.6,1.6,1.34,8.2,.62,.28,-.1,.2,-.28],[9.2,-.5,1.28,10,-.84,.68,.7,-.28,-.12],[10.6,6.4,1.26,12,.38,.74,.3,.12,-.18],[12.2,3.6,1.24,14,-.22,.26,-.4,-.16,-.34],[15.5,-3.4,1.24,18,.86,.62,.6,.3,-.1],[16.5,.6,1.22,21,.32,.22,.1,.24,-.38],[18.5,6.2,1.22,24,-.62,.22,.8,-.34,-.26],[20,-6.5,1.22,27,-.04,.78,-.3,-.06,-.2],[21.5,2.6,1.2,30,-.36,.6,.4,-.22,-.16],[24,-2.2,1.2,34,.58,.5,-.6,.18,-.14],[26,8,1.2,38,-.08,.36,.2,-.04,-.3],[28,4.2,1.2,42,.2,.62,.9,.1,-.24],[30,-5,1.2,46,-.16,.5,-.2,-.12,-.22],[33,.5,1.2,50,.1,.42,.5,.06,-.28]],ua=5.4,Ya=9,Ja=2*Ya/r0,Qo=.6,He=_o.map((e,t)=>{const a=o0+.003+6e-4*t;return{gap:e[0],lat:e[1],scale:e[2],D:e[3],nx:e[4],ny:e[5],fx:e[7],fy:e[8],vx:t%2?-.04:.05,vy:.07,toSun:!0,phi:(t%3-1)*.22,out:(12+4*(t%4))*Math.PI/180,side:-1,tilt:(20+3*(t%3))*Math.PI/180,pk:.52,wk:70+9*(t%5),wp:t*2.4,uL:a,sR:a+(e[0]+Ya)/r0,uIn0:.452+.0012*t,uIn1:.5+6e-4*t,uOut0:.532+8e-4*t,uOut1:.585+8e-4*t,yawJ:Y.range(-.7,.7),yawRun:0,pitchRun:0,x:0,y:0,z:0,yaw:0,launch:a,seed:Y(),phase:Math.asin(e[6])-12*ua,flap:1,flush:Y()}}),ha=(e,t,a)=>{let o=e.sR;if(t>e.uL){const i=Math.min(1,(t-e.uL)/Ja),r=e.gap/r0;o=t+r+(e.sR-e.uL-r)*(1-i)*(1-i)}const s=D(e.uL,e.uL+.01,t);Ue(o,e.lat*(1+.12*D(e.uL,.47,t)),a),a.y=.02+.3*s+2.4*D(.446,.51,t);const n=G0[L(Math.round(o*1e3),0,1e3)];return e.yawRun=Math.atan2(n[1],-n[0])+e.yawJ*(1-s),e.pitchRun=.2*s,a};for(const e of He)ha(e,0,x0),e.x=x0.x,e.y=x0.y,e.z=x0.z,e.yaw=e.yawRun;const eo=[[Ke(He.slice(0,5),{shadow:!0,flapRate:ua,slip:.1},"raft"),He.slice(0,5)],[Ke(He.slice(5),{shadow:!0,lod:!0,flapRate:ua},"raft-far"),He.slice(5)]];for(const[e]of eo){e.userData.u.uHover.value.set(.06,.05,0);for(const t of["iA","iD"])e.geometry.attributes[t].setUsage(G.DynamicDrawUsage)}await w.yield();let to=!0;const Go=(e,t)=>{const a=e<Qo;if(!(!a&&!to)){for(const[o,s]of eo){const n=o.userData.iA,i=o.userData.iD,r=s.length;for(let l=0;l<r;l++){const c=s[l];let u=0,f=-400,m=0,d=0,h=0,p=0;if(a&&e<c.uOut1){const v=D(c.uIn0,c.uIn1,e);v<1&&(ha(c,e,x0),u=x0.x,f=x0.y,m=x0.z,d=c.yawRun,h=c.pitchRun),v>0&&(Za(c,e,1-D(c.uOut0,c.uOut1,e),t),v<1?(u+=(a0.x-u)*v,f+=(a0.y-f)*v,m+=(a0.z-m)*v,d=ca(d,a0.yaw,v),h+=(a0.pitch-h)*v,p=a0.roll*v):(u=a0.x,f=a0.y,m=a0.z,d=a0.yaw,h=a0.pitch,p=a0.roll))}for(let v=0;v<2;v++){const y=(l+v*r)*4;n[y]=u,n[y+1]=f,n[y+2]=m,n[y+3]=d,i[y]=p,i[y+1]=h}}o.geometry.attributes.iA.needsUpdate=!0,o.geometry.attributes.iD.needsUpdate=!0}to=a}};{for(const e of He)for(let t=e.uL+.002,a=0;t<.4525;t+=.003,a++){ha(e,t,R);const o=G0[L(Math.round(t*1e3),0,1e3)],s=o[1],n=-o[0],i=3+6*D(e.uL,e.uL+Ja,t);sa(R.x+Y.range(-.35,.35),R.z+Y.range(-.35,.35),t,Y.range(.45,.75));for(let r=0;r<2;r++){const l=Y.range(-2.6,2.6);c0.push([R.x+Y.range(-.4,.4),.15,R.z+Y.range(-.4,.4),Y.range(.14,.34),Y(),5,t+Y()*.002,Y.range(2.6,5.2),s*i+o[0]*l,n*i+o[1]*l,1,0])}}await w.yield();for(let e=0,t=0;e<280&&t<1600;t++){(t&63)===63&&await w.yield();const a=Ue(Y.range(.412,.535),(Y.chance(.6)?1:-1)*Y.range(1.2,15),R),o=Y.range(.7,1.9);X0(a.x,a.z)>-1.5||N.fisherList.some(s=>Math.hypot(s.o[0]-a.x,s.o[1]-a.z)<1.6)||(ke.push([a.x,a.z,o,0,Y(),8,Y(),0,0,0,0,0]),e++)}}await w.yield();const Ho={D:5.7,nx:.6*v0,ny:.3,vx:.05*v0,vy:.05,fx:0,fy:0,toSun:!1,phi:(90-v0*48)*Math.PI/180,out:24*Math.PI/180,side:1,tilt:.3,scale:1.06,pk:.25,wk:80,wp:1.3},ct=new b(X[0]+v0*(X[2]+7),11.5,X[1]-9),fa=Pt[2].pad,Oo=Pt[2].yaw,No=(e,t)=>{if(e<.2||e>.32)return;const a=D(.2265,.2435,e),o=D(.262,.303,e),s=Ve.userData.iA,n=Ve.userData.iD,i=Pt.length;let r=fa.x,l=fa.y,c=fa.z,u=Oo,f=0,m=0;if(a>0&&(Za(Ho,e,1,t),r+=(a0.x-r)*a,l+=(a0.y-l)*a*a,c+=(a0.z-c)*a,u=ca(u,a0.yaw,a),f=a0.pitch*a,m=a0.roll*a,o>0)){const d=Math.atan2(ct.x-r,ct.z-c),h=Math.min(1,o*3);r+=(ct.x-r)*o,l+=(ct.y-l)*o,c+=(ct.z-c)*o,u=ca(u,d,h),f+=(.2-f)*h,m*=1-h}for(let d=0;d<2;d++){const h=(2+d*i)*4;s[h]=r,s[h+1]=l,s[h+2]=c,s[h+3]=u,n[h]=m,n[h+1]=f}Ve.geometry.attributes.iA.needsUpdate=!0,Ve.geometry.attributes.iD.needsUpdate=!0},Kt=new b(...se.portalSeat.position),Xo=new b,da=new b,pa=new b,Ce=new b,ao=e=>1-.38*D(.6,.68,e)*(1-D(.78,.9,e)),oo=(e,t)=>{t0.pointAt(e,Ce);const a=Kt.x-Ce.x,o=Kt.y-Ce.y,s=Kt.z-Ce.z,n=Math.hypot(a,s)||1,i=a/n,r=s/n,l=Math.hypot(n,o),c=-.04-.22*oe(e,.73,.86,.4),u=Math.cos(c),f=Math.sin(c),m=Math.atan(Math.max(.05,(.6009-(8.4+20.1*ao(e))/l-.014)*u*u))*(1-.5*D(.82,.88,e)),d=Math.max(.12,Math.atan2(o,n)-m);return t.set(Ce.x+(i*u-r*f)*60,Ce.y+Math.tan(d)*60,Ce.z+(i*f+r*u)*60)};await w.yield();{const e=bo.geometry.attributes.iA.array,t=new b,a=new b,o=.17;for(let s=0;s<2;s++)for(const[n,i,r]of[[.7,-.5,.15],[.79,-.41,.1]])for(const l of[-.012,0,.012])for(const c of[12,40]){await w.yield(),t0.pointAt(n+l,t),oo(n+l,a);let u=a.x-t.x,f=a.y-t.y,m=a.z-t.z;const d=Math.hypot(u,f,m);u/=d,f/=d,m/=d;const h=Math.hypot(u,m)||1,p=-m/h,v=u/h,y=-v*f,g=v*u-p*m,x=p*f;let z=u+p*i+y*r,B=f+g*r,F=m+v*i+x*r;const W=Math.atan2(B,Math.hypot(z,F)),j=Math.atan2(z,F);for(const[I,O]of Wa){let V=!1,K=0,Q=0;for(let i0=0;i0<O;i0++){const D0=ze[I+i0],Be=(I+i0)*4,Fe=((D0[0]-c*D0[7]+1700)%3400+3400)%3400-1700,O0=e[Be+1],fe=D0[3],j0=Fe-t.x,te=D0[2]-t.z,P0=Math.hypot(j0,te)||1,Se=Math.atan2(O0-t.y,P0);let T0=Math.atan2(j0,te)-j;T0=Math.atan2(Math.sin(T0),Math.cos(T0));const Oe=.45*fe*D0[5]/P0+o,ae=.45*fe/P0+o,de=Se-W;Math.abs(T0)<Oe&&(K=Math.min(K,P0*Math.tan(W-ae)-(O0-t.y)),Q=Math.max(Q,P0*Math.tan(W+ae)-(O0-t.y)),Math.abs(de)<ae&&(V=!0))}if(!V)continue;const u0=e[I*4+1]+K>60,q0=u0&&-K<Q*1.6?K:Q;for(let i0=0;i0<O;i0++)e[(I+i0)*4+1]+=q0}}}const ma=[{at:(e,t)=>{const a=m0(L(t+7/r0,0,1));return Po.set(a.x,a.y+4.3,a.z)},from:.085,to:.15,weight:.6,fade:.3},{at:(e,t)=>(Ta(L(t+8.5/r0,0,1),le*8,Bt),Bt.y=.9,Bt.lerpVectors(at,Bt,D(.148,.172,t))),from:.122,to:.218,weight:.68,fade:.3},{at:(e,t)=>To.set(X[0]-v0*4,1,X[1]-9),from:.224,to:.288,weight:.74,fade:.3},{at:[n0[0]-v0*6,1.3,n0[1]-5],from:-.03,to:.052,weight:.36,fade:.3},{at:(e,t)=>(Ft(Ga,t,aa),aa.x-=1.2,aa),from:.405,to:.495,weight:.5,fade:.3},{at:(e,t)=>xo(t,qo),from:.44,to:.625,weight:.9,fade:.22},ve?{at:(e,t)=>{const a=m0(L(t+9/r0,0,1));return Qa.set(a.x,Math.max(.8,a.y-4),a.z)},from:.585,to:.652,weight:.66,fade:.3}:{at:(e,t)=>{const a=m0(L(t+10/r0,0,1));return Qa.set(a.x,U(Math.max(.6,a.y-1.4),a.y+1.6,D(.607,.645,t)),a.z)},from:.592,to:.672,weight:.5,fade:.4725},{at:(e,t)=>oo(t,Xo),from:.612,to:.9,weight:.95,fade:.2},{at:se.portalSeat.position,from:.8,to:.975,weight:.62}];let so=0;const ws=(e,t,a=so)=>{const o=D(0,.04,e)*(1-D(.93,.985,e))*(1-.65*a);t0.pointAt(e,da),t0.posAtDist(Math.min(e*r0+Math.min(14*(1+2.4*a),Math.max(14,r0*.22)),r0),t).sub(da),t.normalize(),a>0&&(t.y*=1-.45*a,t.normalize());for(const s of ma){const n=oe(e,s.from,s.to,s.fade??.3)*s.weight*o;if(n<=.001)continue;const i=typeof s.at=="function"?s.at(0,e):s.at;i.isVector3?pa.copy(i):pa.set(i[0],i[1],i[2]),t.multiplyScalar(1-n).addScaledVector(pa.sub(da).normalize(),n).normalize()}return t},va=(e,t)=>{const a=m0(e),o=D(0,.04,e)*(1-D(.93,.985,e));t.copy(m0(L(e+14/r0,0,1))).sub(a).normalize();for(const s of ma){const n=oe(e,s.from,s.to,s.fade??.3)*s.weight*o;if(n<=.001)continue;const i=typeof s.at=="function"?s.at(0,e):s.at;i.isVector3?_.copy(i):_.set(i[0],i[1],i[2]),t.multiplyScalar(1-n).addScaledVector(_.sub(a).normalize(),n).normalize()}return t},ue={},$o=(e,t,a)=>{if(e<.572||e>.77||!ee.on)return;const o=t.matrixWorld.elements,s=Math.hypot(o[8],o[10])||1,n=-o[8]/s,i=-o[10]/s,r=Math.tan(t.fov*Math.PI/360)*t.aspect,l=ee.m.userData.iA,c=ee.m.userData.iD,u=ee.list.length,f=ee.m.userData.copies;for(let m=0;m<u;m++){const d=ee.list[m],h=m*4,p=(e-d.launch)*40;if(!d.hold||p<=0||l[h+1]<-300){if(c[h+1]!==0)for(let Q=0;Q<f;Q++)c[(m+Q*u)*4+1]=0;continue}const v=D(0,.5,p),y=l[h]-a.x,g=l[h+2]-a.z,x=1.61*(d.scale??1);let z=y*n+g*i,B=g*n-y*i;z<7.5&&(z+=(7.5-z)*v);const F=Math.max(.6,z*r*.95-x*1.1),W=1-D(17,27,Math.hypot(z,B));Math.abs(B)>F&&(B+=(Math.sign(B)*F-B)*W*v);let j=a.x+n*z-i*B,I=l[h+1],O=a.z+i*z+n*B;if(d.star){const Q=D(d.launch+.006,d.launch+.024,e)*(1-D(.64,.675,e)),u0=6.9,q0=.46*r*u0;j+=(a.x+n*u0-i*q0-j)*Q,O+=(a.z+i*u0+n*q0-O)*Q,I+=(Math.max(1,a.y-o[9]/s*u0-1.15)-I)*Q}const V=Math.atan2(I-a.y,Math.hypot(j-a.x,O-a.z)||1),K=L(V+.5,.3,.75)*(1-D(.3,.6,V))*v*(1-D(20,32,Math.hypot(z,B)));for(let Q=0;Q<f;Q++){const u0=(m+Q*u)*4;l[u0]=j,l[u0+1]=I,l[u0+2]=O,c[u0+1]=K}}ee.m.geometry.attributes.iD.needsUpdate=!0};await w.yield();{const t=m0(.6),a=va(.6,new b),o=new b,s=new b(-900,0,-900);a.y=0,a.normalize();const n=(f,m,d,h,p)=>p.set(f.x+d*(m.x*Math.cos(h)-m.z*Math.sin(h)),0,f.z+d*(m.z*Math.cos(h)+m.x*Math.sin(h))),i=N.joiners.first+vt.length+Vt.findIndex(f=>f.shoal);let r=1e9;for(let f=-19;f<=19;f++)for(let m=0;m<=12;m++){m===0&&(f&3)===0&&await w.yield();const d=f*.04,h=4.4+m*.2,p=h+4*Math.max(0,Math.abs(d)-.58)+3*Math.max(0,.3-Math.abs(d));if(p>=r)continue;n(t,a,h,d,o);let v=1e9;for(let y=540;y<=680;y++)v=Math.min(v,Math.hypot($[y].x-o.x,$[y].z-o.z,Math.max(0,$[y].y-1.3)));v<3.2||N.fisherList.some((y,g)=>g!==i&&(Math.hypot(y.c[0]-o.x,y.c[1]-o.z)<2||Math.hypot(y.o[0]-o.x,y.o[1]-o.z)<2))||(r=p,s.copy(o),ue.fisher=[+d.toFixed(2),+h.toFixed(1),+v.toFixed(1)])}s.x>-800&&(n(t,a,5,.1*Math.sign(-ue.fisher[0]),o),N.setPlace(i,s.x,s.z,Math.atan2(o.x-s.x,o.z-s.z)),N.setPhase(i,Ee(.6)-.3));{let f=-1,m=8.2;const d=N.fisherList,h=d.length;if(d.forEach((p,v)=>{if(p.joiner)return;const y=p.c[0]-t.x,g=p.c[1]-t.z,x=y*a.x+g*a.z,z=g*a.x-y*a.z,B=Math.atan2(z,x),F=Math.hypot(y,g);B<-.26&&B>-.6&&F<m&&(m=F,f=v)}),f>=0){const p=N.object.getObjectByName("fishers"),v=N.object.getObjectByName("rings"),y=Math.min(1.36,Math.max(1.3,d[f].scale*1.3));d[f].scale=y,N.setPhase(f,Ee(.6)-.3);for(const g of[0,1])p.userData.iB[(f+g*h)*4+2]=y;for(let g=0;g<3;g++)v.userData.iB[(f*3+g)*4+2]=y;ue.left=[f,+m.toFixed(1)]}}let l=0,c=0;const u=[2.3,1.7];ue.own=[s.x,s.z,u],await w.yield();for(let f=0;f<240&&l<28;f++){(f&15)===15&&await w.yield();const m=c<5&&f%2===0,d=S(),h=m?.6:.6-.002+.006*d,p=m?S.range(3.3,4.7):S.range(5.6,13),v=m?(c-2+S.range(-.3,.3))*.2:S.range(-.62,.62),y=m0(h);if(va(h,x0),x0.y=0,x0.normalize(),n(y,x0,p,v,o),!(t0.nearestXZ(o.x,o.z).dist<1.1||Math.hypot(o.x-s.x,o.z-s.z)<u[+m]||N.fisherList.some(g=>Math.hypot(g.c[0]-o.x,g.c[1]-o.z)<(m?1.5:2.1)))){if(c0.push([o.x,0,o.z,m?S.range(.86,1.04):S.range(.6,.9),S(),7,S(),m?S.range(.42,.7):S.range(.5,1.5),S.range(.95,1.4),.62,S(),0]),l++,m){const g=c0[c0.length-1],x=.1+.085*c-12/g[8];g[6]=x-Math.floor(x),g[11]=1,c++}f%5===0&&ke.push([o.x+S.range(-.6,.6),o.z+S.range(-.6,.6),S.range(.4,.75),0,S(),2,S(),0,0,0,0,0])}}for(let f=0;f<6;f++)n(t,a,S.range(1.7,3.6),S.range(-.8,.8),o),ke.push([o.x,o.z,S.range(.28,.5),0,S(),2,S(),0,0,0,0,0]);ue.fish=l}await w.yield();let no=null,Lt=null,ee=null;const ut=.6,Zo=.5725,ht=.58,Yo=N.object.getObjectByName("fishers"),Jo=N.object.getObjectByName("rings");if(ve){const e=T("#2C2F66").multiplyScalar(.62),t=m0(ut),a=m0(ut+14/r0).clone().sub(t).normalize(),o=Mt(ut,new b).sub(t).normalize(),s=.9*oe(ut,.44,.625,.22),n=a.multiplyScalar(1-s).addScaledVector(o,s);n.y=0,n.normalize();const i=new b(t.x+n.x*10,t.y+3.4,t.z+n.z*10),r=Math.cos(.42),l=Math.sin(.42),c=new b(n.x*r-n.z*l,.025,n.x*l+n.z*r).multiplyScalar(17);no=Le([{scale:1.56,seed:.3,flap:1,flush:0,show0:.52,show1:.76,custom:(d,h)=>h.copy(i).addScaledVector(c,(d-ut)*40)}],{colors:{white:e,cream:e,flush:e,tail:T("#FBF7EA").multiplyScalar(.9),ink:T("#1B1E48").multiplyScalar(.7),face:q(e,A[4],.45),bill:T("#F2C63A").multiplyScalar(.92),pouch:T("#F2C63A").multiplyScalar(.92),pouchDeep:T("#E0A92E")},lod:!0,neck:[.5,.2,-.3],flapRate:3.4},"eagle"),no.userData.u.uHover.value.set(.25,0,0),await w.yield();const u=N.fisherList.filter(d=>d.c[1]<100).map(d=>{const h=d.c[0],p=d.c[1];let v=.6,y=1e9;for(let z=540;z<=700;z++){const B=Math.hypot($[z].x-h,$[z].z-p);B<y&&(y=B,v=z/1e3)}const g=G0[Math.round(v*1e3)],x=m0(v);return{b:d,x:h,z:p,bu:v,bd:y,side:(h-x.x)*g[0]+(p-x.z)*g[1]>0?1:-1}});u.forEach((d,h)=>{d.bd<9&&(d.side=h%3?-1:1)});const f=u.filter(d=>d.bu>=.598&&d.bd<30).sort((d,h)=>d.bu+d.bd*.0012-(h.bu+h.bd*.0012)),m=[];for(let d=0;d<u.length;d++){const h=u[d];d%6===5&&await w.yield();const p=f.indexOf(h),v=p<0?0:p/Math.max(1,f.length-1);let y=p<0?ht+.004+M()*.014:ht+.001+.011*v+M()*.003;p>=0?y=Math.min(y,Math.max(ht-.004,h.bu-.024)):h.bu<.598&&(y=Math.max(y,h.bu+.004));const g=p<0?y-.03-M()*.05:.636+.165*Math.pow(v,1.1);let x=h.side*M.range(5.4,9.5)*(p<0&&h.bu>=.598?3.6:1),z=M.range(-3.2,3.4);const B=Math.hypot(x,z);B<5.7&&(x*=5.7/B,z*=5.7/B),p===0&&(x=Math.abs(x));const F={vrel:M.range(3,4.6),uab:g,lat:x,dy:z,spread:0,from:[h.x,0,h.z],launch:y,w0:.25,w1:M.range(2.1,2.6)*(p>=0?.7:1),yaw:h.b.yaw,show0:-1,show1:Math.max(g,y)+.07,scale:h.b.scale,seed:h.b.seed,dal:h.b.dal,phase:p===0?Math.PI/2-60:h.b.seed*6,flap:1};if(p>=0){const j=.652+.05*v,I=8+31*v,O=3.2+(Math.abs(x)-5.4)/4.1*.25*I,V=U(-.42*I,0,L((z+3.2)/6.6,0,1));F.hold={u0:y,din:.001,u1:j,dout:.08,a:I,lat:Math.sign(x)*Math.max(3.2,O),dy:V,aIn:0,sIn:0,dyIn:0,aOut:62,latOut:Math.sign(x)*26,dyOut:6,aw:.7,lw:.45,dw:.35,wk:60+35*h.b.seed,wp:h.b.seed*40},F.show1=j+.08,F.star=p===0,p===0&&(F.scale=Math.max(F.scale??1,1.4))}const W=F.hold??F;for(let j=0;j<8;j++){let I=1e9;for(let O=F.launch;O<F.show1;O+=.001)oa(F,O,R),I=Math.min(I,R.distanceTo(m0(O)));if(I>4.3)break;j%2===0?W.lat=-W.lat:(F.hold?(W.a+=2.6,W.lat+=Math.sign(W.lat)*.5):W.lat+=Math.sign(W.lat)*1.6,F.launch+=.005,F.show1+=.005)}m.push(F)}await w.yield(),Lt=Le(m,{lod:!0,clipY:-.02,flapRate:5},"takeoff"),ee=St[St.length-1],Lt.geometry.attributes.iD.setUsage(G.DynamicDrawUsage),Lt.visible=!1;for(const d of m){for(let h=0;h<3;h++){const p=d.launch+.004+h*.006;oa(d,p,R),sa(R.x,R.z,p,M.range(.5,.8))}for(let h=0;h<2;h++)c0.push([d.from[0]+M.range(-.6,.6),.2,d.from[2]+M.range(-.6,.6),M.range(.16,.36),M(),5,d.launch+.002+h*.006,M.range(3,7),M.range(-2.5,2.5),M.range(-5,-1),0,0])}}{const t=t0.pointAt(.34,new b),a=va(.34,new b);a.y=0,a.normalize();const o=-a.z,s=a.x,n=Math.round(.34*1e3),i=(c,u)=>{let f=1e9,m=0;for(let d=n;d<n+30;d++){const h=$[d],p=$[d+1],v=p.x-h.x,y=p.z-h.z,g=L(((c-h.x)*v+(u-h.z)*y)/(v*v+y*y),0,1),x=h.x+v*g-c,z=h.z+y*g-u,B=x*x+z*z;B<f&&(f=B,m=(d+g)*r0/1e3)}return m},r=[];let l=1/0;for(const[c,u,f,m,d,h,p]of[[3.3,-1.5,.5,1,1.25,-.42,.6],[4.6,1.9,.3,-1,1.5,-.2,.66],[5.6,-.7,.68,1,1.3,-.05,.66],[6.6,2.5,.55,-1,1.5,.1,.72],[7.6,-2.6,.22,1,1.5,0,.72],[8.8,.6,.8,-1,1.2,.15,.74],[4,2.7,.84,-1,1,-.3,.56],[10.4,-1.2,.42,1,1.4,.25,.78]]){const v=(o*m*.94+a.x*.34)*d,y=(s*m*.94+a.z*.34)*d,g=z=>i(t.x+a.x*c+o*u+v*(1-z)*2.3,t.z+a.z*c+s*u+y*(1-z)*2.3)-(.34+(1-z)*.0175)*r0,x=g(f);x>=2&&(l=Math.min(l,x)),r.push([c,u,f,v,y,h,p,g,x])}for(const[c,u,f,m,d,h,p,v,y]of r){let g=f;if(y<l){let F=f,W=1;for(let j=0;j<40;j++){const I=(F+W)/2;v(I)<l?F=I:W=I}g=W}const x=t.x+a.x*c+o*u-m*g*2.3,z=t.z+a.z*c+s*u-d*g*2.3,B=.34-g*.0175;zt(x,z)>-.1||(ke.push([x,z,p*1.5,0,k(),0,k(),k(),0,0,0,0]),c0.push([x,.06,z,p,k(),0,B,0,m,d,h,0]),ke.push([x,z,.3,0,k(),6,B,0,0,0,0,0],[x+m*2.3,z+d*2.3,.42,0,k(),6,B+.0175,0,0,0,0,0]))}}await w.yield(),ea(ke,E0),await w.yield();{const e=Math.fround,t=c0.filter(s=>s[5]===7),a=ue.own,o=t.map(s=>({x:s[0],z:s[2],h:1.6/2,slabs:[[2.3/2,-.04,e(s[7])-.04]],skin:.61*e(s[3])*Math.hypot(1,.44),keep:s[11]?1.5:s[9]?2.1:s[12]??0,own:s[9]?[a[0],a[1],a[2][s[11]]]:null}));ue.stood=await N.standFish(t0,$,o),t.forEach((s,n)=>{s[0]=o[n].x,s[2]=o[n].z})}So(),await w.yield();const ft=h0.hour==="dusk",ya=ft?T("#A9B6FF").multiplyScalar(.9):q(A[0],A[6],.2).multiplyScalar(.88),es=q(A[5],A[6],.68).multiplyScalar(.84),ts=q(A[6],T("#D8641E"),.5).multiplyScalar(.62);for(const e of[1,0]){const t=new G.PlaneGeometry(700,700);t.rotateX(e?Math.PI/2:-Math.PI/2),t.translate(-5,e?.1:-3.3,110);const a=new G.Mesh(t,ie({uCeil:{value:e},uCeilCol:{value:ya},uOlive:{value:es},uAmber:{value:ts},uCeilWarm:{value:ft?T("#8E7CF4"):A[6].clone().multiplyScalar(1.05)},uCeilFar:{value:ft?T("#5560E0"):A[6].clone().multiplyScalar(.78)}},`
        varying vec3 vW; varying float vDist;
        void main() { vW = position; vec4 mv = modelViewMatrix * vec4(position, 1.0); vDist = length(mv.xyz); gl_Position = projectionMatrix * mv; }`,`
        varying vec3 vW; varying float vDist;
        uniform float uCeil, uTime; uniform vec3 uCeilCol, uCeilWarm, uCeilFar, uOlive, uAmber, uHoney, uDeep;
        ${pe}
        void main() {
          vec2 w = vW.xz; float dist = length(vW - cameraPosition);
          vec4 a = texture2D(uPaper, w * 0.06 + vec2(uTime * 0.012, 0.0)), b = texture2D(uPaper, w * 0.023 - vec2(0.0, uTime * 0.008) + 0.4);
          vec3 col;
          if (uCeil > 0.5) {
            col = mix(uCeilCol, uCeilCol * vec3(0.84, 0.95, 1.0), smoothstep(0.48, 0.52, b.r));
            col = mix(col, uCeilWarm, smoothstep(0.52, 0.55, b.a) * 0.3);
            col = mix(col, uWhite * 1.04, (1.0 - smoothstep(0.0, 0.03, abs(a.r - 0.5))) * 0.75);
            col = mix(col, uCeilWarm * 0.857, smoothstep(0.5, 0.56, texture2D(uPaper, w * 0.011 + 0.2).a) * 0.45);
            col = mix(col, uCeilFar, 1.0 - exp(-dist * 0.022));
          } else {
            // the bed: honey paper with amber and olive-gold sheets torn over it and pale veins of light crawling across
            vec4 c2 = texture2D(uPaper, w * 0.13 + vec2(0.0, uTime * 0.02) + 0.7);
            col = mix(uHoney * 0.74, uOlive, smoothstep(0.5, 0.54, a.a) * 0.85);
            col = mix(col, uAmber, smoothstep(0.55, 0.58, b.r) * 0.8);
            col = mix(col, mix(uOlive, uDeep, 0.35) * 0.9, smoothstep(0.66, 0.69, b.a) * 0.55);
            col = mix(col, uHoney * 1.12, (1.0 - smoothstep(0.0, 0.03, abs(c2.r - 0.5))) * 0.5 * (1.0 - smoothstep(4.0, 16.0, dist)));
            col = mix(col, uHoney * 1.02, (1.0 - smoothstep(0.0, 0.025, abs(b.a - 0.5))) * 0.45);
            col *= 0.84 + 0.32 * a.b;
            col = mix(col, uHoney * 0.8, 1.0 - exp(-dist * 0.045));
          }
          gl_FragColor = vec4(col * uTint, 1.0);
        }`,{alphaToCoverage:!1}));a.frustumCulled=!1,xe.add(a)}await w.yield();{const e=M.fork("under"),t=[],a=[],o=(Re.z+ja.z)/2;for(let i=0;i<60;i++){const r=U(y0-.014,o0+.04,(i+e())/60),l=F0(L(r,0,1),(i%2?1:-1)*(3.2+5.6*Math.pow(e(),1.3))),c=e.range(3,3.4),u=e.range(.6,1.1),f=e();t0.nearestXZ(l[0],l[1]).dist<2.8||a.push([l[0],0,l[1],c,f,0,u*1.4,0,0,0,0,0])}C0(a.map(i=>{const r=i.slice();return r[5]=1,r}).concat(a),{parent:xe,geo:new G.PlaneGeometry(1,1,1,10),order:2.8,params:{transparent:!0,depthWrite:!1,alphaToCoverage:!1},uniforms:{uCeilCol:{value:ya}},vert:`
          float len = iA.w, sd = iB.x, shd = iB.y, s = q.y + 0.5, dn = 1.0 - s;
          c = vec3(iA.x, 0.1, iA.z) + vec3(uShadowDir.x * 0.42, -1.0, uShadowDir.z * 0.42) * len * dn;
          c.xz += dn * sqrt(dn) * 0.5 * vec2(sin(uTime * 0.7 + sd * 30.0), cos(uTime * 0.6 + sd * 21.0));
          c += flatR * 0.11 * dn * sin(uTime * 1.1 + s * 5.0 + sd * 17.0);
          if (shd > 0.5) { vec3 away = c - cameraPosition; c += vec3(uShadowDir.x, 0.0, uShadowDir.z) * 0.2 + away / max(length(away), 1e-3) * 0.12; c.y -= 0.06; }
          float wdt = max(iB.z * (0.58 + 0.42 * s), length(cameraPosition - c) * uPx * 3.0);
          T = flatR * wdt; W = vec3(0.0);
          P = vec4(shd, len, wdt, sd);`,fpars:"uniform vec3 uCeilCol;",frag:`
          float shd = vP.x, len = vP.y, s = vQ.y + 0.5, ax = abs(vQ.x) * 2.0, sideK = step(0.0, vQ.x);
          puv = vec2(vQ.x * vP.z * 1.6 + sideK * 0.37, s * len * 0.95) + seed;
          vec4 nr = texture2D(uPaper, vec2(seed * 3.7 + sideK * 0.5, s * len * 0.3 + seed));      // big bites out of each long edge
          e = min((1.0 - ax) * 1.3 - 0.44 * nr.a + 0.02, min(s * 6.0 + 0.08, (1.0 - s) * 5.0));
          tearK = 1.0; deck = 0.75 * (1.0 - shd);
          float th = 0.05 + 0.46 * texture2D(uPaper, puv * 0.9 + vec2(seed, seed * 1.7)).r, rim = (1.0 - smoothstep(th + 0.04, th + 0.17, e)) * (1.0 - shd);
          col = mix(mix(mix(uCeilCol, uWhite, 0.6), uHoney * 1.5, 0.42) * 1.08, mix(uShade, uHoney, 0.22) * 0.96, shd);
          alpha = mix(mix(0.42, 0.34, shd), 0.82, rim) * smoothstep(1.2, 3.2, vDist) * exp(-vDist * 0.035);`}),await w.yield();for(let i=0;i<d0.length;i++){(i&511)===511&&await w.yield();const r=d0[i];r[5]===0&&Math.abs(r[1]-o)<30&&Math.abs(r[0]+5.5)<16&&r[2]>.3&&t0.nearestXZ(r[0],r[1]).dist>1.8&&t.push([r[0],0,r[1],3.4,e(),1,.035,0,0,0,0,0])}await w.yield();for(let i=0;i<120;i++){const r=F0(e.range(y0,o0+.01),e.gauss()*2.4);t.push([r[0],-2.9,r[1],e.range(.04,.085),e(),2,0,e(),0,0,0,0])}for(let i=0;i<200;i++)t.push([-5.5+e.gauss()*6,-3.3,o+e.range(-26,24),e.range(.5,1.5),e(),3,.09,0,0,0,0,0]);C0(t,{parent:xe,order:3,params:{transparent:!0,depthWrite:!1,alphaToCoverage:!1},uniforms:{uCeilCol:{value:ya},uPadA:{value:A[3].clone().multiplyScalar(.8)}},vert:`
          float kind = iB.y, len = iA.w, sd = iB.x, s = q.y + 0.5, wd = iB.z; c = iA.xyz;
          W = vec3(0.0, len, 0.0);
          if (kind < 1.5) { c.y = -len * 0.5 + 0.03; c.xz += sin(3.1416 * s) * 0.25 * vec2(sin(uTime * 0.8 + sd * 30.0 + s * 3.0), cos(uTime * 0.7 + sd * 11.0)); }
          else if (kind < 2.5) { float qd = fract(uTime * 0.3 + iB.w); c.y += qd * 2.7; c.x += 0.1 * sin(uTime * 3.0 + sd * 40.0); len *= sin(3.1416 * qd); }
          else { c.y += len * 0.5; c.xz += s * s * 0.3 * vec2(sin(uTime * 0.9 + sd * 30.0), cos(uTime * 0.8 + sd * 13.0)); }
          float dc = length(cameraPosition - c);
          if (kind > 1.5 && kind < 2.5) { len = min(len, dc * uPx * 10.0); T = camR * len; W = camU * len; }
          else T = flatR * max(wd, dc * uPx * 2.0);
          P = vec4(kind, 0.0, 0.0, sd);`,fpars:"uniform vec3 uCeilCol, uPadA;",frag:`
          float kind = vP.x, s = vQ.y + 0.5; deck = 0.0; tearK = 0.6;
          if (kind < 1.5) { e = 1.0; col = mix(uDeep, uPadA, 0.4) * 0.8; tearK = 0.0; alpha = smoothstep(0.7, 1.9, vDist); }
          else if (kind < 2.5) { float rr = length(vQ * 2.0); e = 1.0; tearK = 0.0; alpha = 0.75 * (1.0 - smoothstep(0.35, 1.0, rr)) * smoothstep(0.7, 1.8, vDist); }
          else { e = min(1.0 - abs(vQ.x) * 2.0, (1.0 - s) * 4.0) * 1.5; col = mix(uPadA, uHoney, 0.45) * 0.8; alpha = smoothstep(0.6, 1.6, vDist); }
          col = mix(col, uHoney * 0.78, (1.0 - exp(-vDist * 0.06)) * step(0.5, kind));
          puv = vec2(vQ.x * 0.2, vQ.y * 2.0) + seed;`}),await w.yield();const s=[];for(let i=0;i<46;i++){const r=U(y0+.003,o0+.012,(i+e())/46),l=i%2?1:-1,c=F0(r,l*(e.range(1.35,2.5)+(i%3===2?e.range(1.2,3.4):0))),u=Dt(r)-l*Math.PI/2+e.range(-.45,.45);W0(r),s.push([c[0],L(R.y+e.range(-.75,.3),-2.6,-.7),c[1],e.range(1.45,1.95),e(),0,r,l,Math.sin(u),Math.cos(u),0,0])}const n=q(A[6],T("#A2561A"),.72).multiplyScalar(.8);C0(s,{parent:xe,geo:new G.PlaneGeometry(1,1,8,1),order:2,uniforms:{uBronze:{value:n},uBack:{value:q(n,ge.uDeep.value,.55).multiplyScalar(.72)},uFin:{value:q(A[1],n,.45).multiplyScalar(.92)},uDab:{value:ge.uDeep.value.clone().multiplyScalar(.5)},uCream:{value:q(A[0],A[6],.22).multiplyScalar(.9)}},vert:`
          float sd = iB.x, len = iA.w; vec3 dir = vec3(iC.x, 0.0, iC.y), sdv = vec3(-dir.z, 0.0, dir.x);
          float part = smoothstep(iB.z - 0.04, iB.z - 0.008, uU);
          c = iA.xyz + dir * (0.4 * sin(uTime * 0.3 + sd * 9.0) + part * 1.1);
          c += sdv * sin(q.x * 5.0 - uTime * (5.0 + 3.0 * part) + sd * 20.0) * 0.1 * len * (0.55 - q.x);
          c.y += 0.05 * sin(uTime * 0.8 + sd * 30.0);
          T = dir * len; W = vec3(0.0, len * 0.56, 0.0);
          P = vec4(0.0, 0.0, 0.0, sd);`,fpars:`uniform vec3 uBronze, uBack, uFin, uDab, uCream;
          // x = body, y = fins and tail (each 0 on its rim, rising inside)
          vec2 carpE(vec2 q) {
            float hb = 0.5 * (0.62 + 0.38 * smoothstep(-0.55, 0.3, q.x));
            float body = 1.0 - length((q - vec2(0.2, 0.02)) / vec2(0.74, hb));
            float t = clamp((-0.4 - q.x) / 0.56, 0.0, 1.0), ht = 0.12 + 0.7 * t;
            float tail = min(1.0 - abs(q.y) / ht, (abs(q.y) - 0.5 * smoothstep(0.55, 1.0, t)) * 5.0 + 1.0) * step(q.x, -0.4) * step(-0.97, q.x);
            float dors = 1.0 - length((q - vec2(0.06, 0.48)) / vec2(0.46, 0.3));
            float anal = 1.0 - length((q - vec2(-0.3, -0.4)) / vec2(0.17, 0.24));
            float pelv = 1.0 - length((q - vec2(0.14, -0.5)) / vec2(0.17, 0.24));
            float pect = 1.0 - length((q - vec2(0.52, -0.36)) / vec2(0.16, 0.2));
            return vec2(body, max(max(tail * 0.8, dors), max(anal, max(pelv, pect))));
          }`,frag:`
          vec2 q = vQ * 2.0; vec4 n = texture2D(uPaper, vQ * vec2(0.5, 0.3) + seed), n2 = texture2D(uPaper, vQ * vec2(1.7, 0.95) + seed * 3.0);
          tearK = 0.0; deck = 0.0;
          vec2 eb = carpE(q), es = carpE(q - vec2(-0.05, -0.13));
          float sh = max(eb.x, eb.y), th = 0.07 + 0.26 * n2.r;
          if (sh > th) {
            e = 1.0;
            if (eb.x > th) {
              col = mix(uBronze, uBack, smoothstep(0.02, 0.34, q.y + (n.b - 0.5) * 0.2));
              col = mix(col, uDab, smoothstep(0.5, 0.55, n.a) * smoothstep(-0.2, 0.05, q.y) * 0.9);
              col = mix(col, uDab, smoothstep(0.62, 0.66, n2.a) * smoothstep(-0.25, 0.0, q.y) * 0.7);
              col = mix(col, uCream, (1.0 - smoothstep(-0.34, -0.16, q.y + (n.r - 0.5) * 0.12)) * 0.9);
              float gill = abs(length((q - vec2(0.44, 0.02)) / vec2(0.2, 0.4)) - 1.0);
              col = mix(col, uBack * 0.8, (1.0 - smoothstep(0.05, 0.1, gill)) * step(0.5, q.x) * 0.8);
              float ey = length(q - vec2(0.72, 0.1));
              if (ey < 0.105) col = ey < 0.062 ? uDab * 0.8 : uCream;
            } else { col = uFin * (0.84 + 0.3 * step(0.5, fract(atan(q.y, q.x - 0.1) * 5.0 + q.x * 6.0))); }
            col = mix(col, uCream * 1.05, (1.0 - smoothstep(th + 0.02, th + 0.1, sh)) * 0.55);
          } else { e = max(es.x, es.y) > 0.16 ? 1.0 : 0.0; col = mix(uDab, uHoney, 0.5) * 0.9; alpha = 0.6; }
          col = mix(col, uHoney * 0.78, 1.0 - exp(-vDist * 0.032));
          puv = vQ * vec2(1.2, 0.6) + seed;`})}{const e=[];Z0(y0);const t=Math.hypot(_.x,_.z)||1,a=_.x/t,o=_.z/t;for(let s=0;s<3;s++)for(let n=0;n<12;n++){const i=(n+.5*s+M.range(-.15,.15))/12*H,r=1.5+.25*s+M.range(-.2,.2),l=M();-(Math.cos(i)*a+Math.sin(i)*o)>.3||e.push([Re.x,Re.z,1.7+.32*s,i,l,s,y0,r,0,0,0,0])}C0(e,{geo:new G.PlaneGeometry(1,1,1,4),uniforms:{uFlapA:{value:A[2].clone()},uFlapB:{value:q(A[2],A[5],.6)}},vert:`
          float s = q.y + 0.5, layer = iB.y, sd = iB.x;
          float open = smoothstep(iB.z - 0.05 + 0.004 * layer, iB.z - 0.014, uU);
          vec3 radial = vec3(cos(iA.w), 0.0, sin(iA.w)), tang = vec3(-radial.z, 0.0, radial.x);
          float th = open * (2.45 + 0.3 * sd) - open * 0.9 * s + 0.1 * open * sin(uTime * 5.0 + sd * 30.0);
          c = vec3(iA.x, 0.05 + 0.03 * layer, iA.y) + radial * iA.z + iB.w * s * (-radial * cos(th) + vec3(0.0, sin(th), 0.0));
          T = tang * iA.z * 0.58 * (1.0 - 0.92 * s) * step(0.001, open); W = vec3(0.0);
          P = vec4(layer, s, 0.0, sd);`,fpars:"uniform vec3 uFlapA, uFlapB;",frag:`
          float s = vP.y; tearK = 0.7;
          e = min((0.5 - abs(vQ.x)) * 2.0 + 0.2, (1.0 - s) * 2.5 + 0.15);
          col = vP.x < 0.5 ? uFlapA : vP.x < 1.5 ? uWhite : uFlapB;
          if (!gl_FrontFacing) col = uWhite * 0.97;
          puv = vec2(vQ.x, s * 2.0) + seed;`})}await w.yield();{const e=M.fork("weather"),t=[];if(ye)for(let a=0,o=Math.round(650*s0);a<o;a++)t.push([e.range(0,50),e.range(0,24),e.range(0,50),e.range(1.1,2.2),e(),0,0,0,0,0,0,0]);if(h0.hour==="dawn"){const a=(o,s,n,i,r,l)=>{const c=Math.hypot(n,i)||1;t.push([o,0,s,r,S(),1,l,0,n/c,i/c,0,0])};for(let o=0;o<13;o++){const s=.028+.0225*(o+.6*S()),n=S.range(-.3,.3);if(W0(s),Z0(s),R.y<.95)continue;const i=Math.hypot(_.x,_.z)||1,r=_.x/i,l=_.z/i,c=S.range(-1.6,1.6);a(R.x-l*c,R.z+r*c,-l*Math.cos(n)+r*Math.sin(n),r*Math.cos(n)+l*Math.sin(n),S.range(6.5,9.5),Math.min(S.range(.5,.8),R.y-.22))}for(let o=0;o<6;o++){const s=S()*H,n=Math.sqrt(S())*J[2]*.7,i=S()*H;a(J[0]+Math.cos(s)*n,J[1]+Math.sin(s)*n,Math.cos(i),Math.sin(i),S.range(8,14),S.range(.5,.85))}for(let o=0,s=0;o<14&&s<80;s++){const n=S.range(o0+.02,.66),i=S.sign(),r=F0(n,i*S.range(9,46)),l=S.range(-.5,.5);if(Z0(n),X0(r[0],r[1])>-6||Math.hypot(r[0],r[1]+2)<44||t0.nearestXZ(r[0],r[1]).dist<8)continue;const c=Math.hypot(_.x,_.z)||1,u=_.x/c,f=_.z/c;a(r[0],r[1],-f*Math.cos(l)+u*Math.sin(l),u*Math.cos(l)+f*Math.sin(l),S.range(12,22),S.range(.6,1)),o++}}t.push([30,64,-195,0,.5,2,.5,0,0,0,0,0]),C0(t,{order:5,params:{transparent:!0,depthWrite:!1,alphaToCoverage:!1},uniforms:{uRain:{value:q(A[2],A[0],.55)},uMist:{value:q(T(l0.cloud[0]),$e[6],.4).multiplyScalar(.9)}},vert:`
          float kind = iB.y;
          if (kind < 0.5) {
            vec3 dn = normalize(vec3(-0.25, -1.0, -0.1)), o = iA.xyz + dn * uTime * 11.0;
            c = cameraPosition + mod(o - cameraPosition + vec3(25.0, 12.0, 25.0), vec3(50.0, 24.0, 50.0)) - vec3(25.0, 12.0, 25.0);
            vec3 tc = cameraPosition - c;
            W = dn * iA.w; T = normalize(cross(dn, tc) + vec3(1e-4, 0.0, 0.0)) * max(0.025, length(tc) * uPx * 1.6);
          } else if (kind < 1.5) {
            vec3 along = vec3(iC.x, 0.0, iC.y);
            c = iA.xyz + along * 1.4 * sin(uTime * 0.07 + iB.x * 20.0); c.y = iB.z * 0.5 + 0.03;
            T = along * iA.w; W = vec3(0.0, iB.z, 0.0);
            P.y = iA.w; P.z = iB.z;
          } else { c = iA.xyz; T = flatR * iA.w * iB.z; W = vec3(0.0, iA.w, 0.0); }
          P = vec4(kind, P.y, P.z, iB.x);`,fpars:"uniform vec3 uRain, uMist;",frag:`
          deck = 0.0;
          if (vP.x < 0.5) { tearK = 0.0; col = uRain; alpha = 0.55 * (1.0 - abs(vQ.y) * 2.0); }
          else if (vP.x < 1.5) {
            // a strip of mist: torn along the top and at both ends (white deckle on the tear), melting into the water below
            float s = vQ.y + 0.5, len = vP.y; vec4 n = texture2D(uPaper, vec2(vQ.x * len * 0.13, s * 0.1) + seed);
            float top = (1.0 - s) * 1.25 - 0.12 + (n.a - 0.5) * 1.3 + (n.r - 0.5) * 0.5;
            e = min(top, (0.5 - abs(vQ.x)) * len * 0.8 + (n.r - 0.5) * 1.6);
            col = uMist * (0.96 + 0.1 * n.b); deck = 1.0; tearK = 0.6; farK = 0.3;
            alpha = 0.6 * smoothstep(0.0, 0.3, s) * smoothstep(1.6, 5.5, vDist);
            puv = vec2(vQ.x * len, s * vP.z) * 0.7 + seed;
          }
          else { vec4 n = texture2D(uPaper, vQ * vec2(0.4, 0.9) + seed); e = min((1.0 - abs(vQ.x) * 2.0) * 1.3 + (n.a - 0.5) * 0.9, (0.5 - abs(vQ.y)) * 5.0 + (n.r - 0.5) * 0.6);
            col = uShade * 1.05; alpha = 0.3 * smoothstep(70.0, 190.0, vDist); farK = 0.15; }
          if (vP.x < 0.5 || vP.x > 1.5) puv = vQ * vec2(3.0, 1.0) + seed;`})}{const e=N.object.getObjectByName("soarers").geometry.attributes.iA.array,t=e[3]<0?-1:1,a=[];for(let o=0,s=L(Math.round(40*ba/205),24,58);o<s;o++){const n=17+109*Math.pow((o+P())/s,.9),i=P.range(8,20+24*Math.sin(Math.PI*Math.min(1,(n-15)/113)));a.push([i,n,P()*H+t*n*.05,t*P.range(7.5,10.5)/i,P(),P.range(.85,1.2),P.chance(.2)?1:0,0,0,0,0,0])}C0(a,{uniforms:{uColumn:{value:new b(...se.columnFoot)},uInk:{value:ne.ink.clone()}},vpars:"uniform vec3 uColumn;",vert:`
          float ang = iA.z + uTime * iA.w, sd = iB.x, dirS = iA.w < 0.0 ? -1.0 : 1.0;
          vec3 radial = vec3(cos(ang), 0.0, sin(ang));
          c = uColumn + radial * (iA.x + 1.2 * sin(uTime * 0.23 + sd * 11.0)) + vec3(0.0, iA.y + 1.5 * sin(uTime * 0.37 + sd * 23.0), 0.0);
          vec3 tc = cameraPosition - c; float dc = length(tc);
          float sz = dc * 0.058 * iB.y * smoothstep(170.0, 290.0, dc);
          float bank = dirS * (0.42 + 0.12 * sin(uTime * 0.31 + sd * 9.0));
          vec3 span = radial * cos(bank) + vec3(0.0, sin(bank), 0.0);
          vec2 sp = vec2(dot(span, camR), dot(span, camU)); float sl = max(length(sp), 1e-3); vec2 sn = sp / sl;
          T = (camR * sn.x + camU * sn.y) * sz * max(sl, 0.45); W = (camU * sn.x - camR * sn.y) * sz * 0.5;
          if (W.y < 0.0) W = -W;
          P = vec4(iB.z * sin(uTime * 4.2 + sd * 31.0), 0.0, 0.0, sd);`,fpars:`uniform vec3 uInk;
          float farBird(vec2 q, float fl, float fat) {            // a pelican from below or behind: body, two long wings with a shallow kink
            float ax = abs(q.x) * (1.0 - 0.1 * fat), yc = (0.34 + 0.3 * fl) * ax * (1.0 - 0.55 * ax) - 0.12, th = 0.17 * (1.0 - 0.72 * ax) + 0.17 * exp(-ax * ax * 26.0) + 0.1 * fat;
            return 1.0 - abs(q.y - yc) / max(th, 0.02);
          }`,frag:`
          vec2 q = vQ * 2.0 * 1.12; float pe = farBird(q, vP.x, 0.0), se = max(farBird(q, vP.x, 1.0), farBird(q - vec2(-0.1, -0.14), vP.x, 0.6)), ax = abs(q.x);
          tearK = 0.0; deck = 0.0; farK = 0.25;
          if (pe > 0.12) { e = 1.0; float yc = (0.34 + 0.3 * vP.x) * ax * (1.0 - 0.55 * ax) - 0.12; col = mix(uWhite, uInk, max(smoothstep(0.56, 0.66, ax), step(q.y, yc - 0.035) * step(0.2, ax))); }
          else { e = se > 0.12 ? 1.0 : 0.0; col = mix(uShade, uInk, 0.22); }
          puv = vQ + seed;`})}await w.yield();{const e=[],t=[22,-186],a=(s,n,i,r)=>{zt(s,n)<-2.5&&Math.hypot(s,n)>60&&e.push([s,n,i,k.sign(),k(),0,r,0,0,0,0,0])};for(let s=0;s<44;s++){const n=(s+k.range(-.3,.3))/43,i=(n-.5)*3.7,r=27+s%2*2.6+k.range(-.8,.8);a(t[0]+Math.sin(i)*r,t[1]-Math.cos(i)*r*.8,k.range(.9,1.12),n*1.6)}for(let s=0;s<12;s++){const n=k()*H,i=Math.sqrt(k())*15;a(t[0]+Math.cos(n)*i,t[1]+6+Math.sin(n)*i*.7,k.range(.85,1),k())}for(let s=0;s<58;s++){const n=(s+k.range(-.3,.3))/57,i=4.2+n*.86,r=I0-14-s%2*3-7*Math.sin(n*9)+k.range(-1,1);a(Z[0]+Math.cos(i)*r,Z[1]+Math.sin(i)*r,k.range(.9,1.12),n*2.4)}for(const s of we)for(let n=0;n<7;n++){const i=k()*H,r=s[2]+k.range(4,11);a(s[0]+Math.cos(i)*r,s[1]+Math.sin(i)*r,k.range(.8,.95),k())}const o=(s,n,i,r)=>{Ea(s,n)<-2.5&&e.push([s,n,i,E.sign(),E(),0,r,0,0,0,0,0])};for(let s=0;s<40;s++){const n=(s+E.range(-.3,.3))/39,i=3.5+n*2.4,r=62+s%2*4+9*Math.sin(n*7);o(w0[0]+Math.cos(i)*r,w0[1]+24+Math.sin(i)*r*.6,E.range(.95,1.15),n*2)}for(const s of Me)for(let n=0;n<8;n++){const i=E()*H,r=s[2]+E.range(5,14);o(s[0]+Math.cos(i)*r,s[1]+Math.sin(i)*r,E.range(.85,1),E())}C0(e,{uniforms:{uInk:{value:ne.ink.clone()},uApricot:{value:A[1].clone().multiplyScalar(.95)},uBillC:{value:ne.bill.clone()}},vert:`
          float sd = iB.x; c = vec3(iA.x, 0.0, iA.y);
          c.xz += 0.7 * vec2(sin(uTime * 0.21 + sd * 30.0), cos(uTime * 0.17 + sd * 17.0));
          float dc = length(cameraPosition - c);
          float sz = mix(2.0, max(2.0, dc * 0.058), smoothstep(7.0, 20.0, cameraPosition.y)) * iA.z;
          float f = fract(uTime / 3.0 - iB.z);
          T = flatR * sz * iA.w; W = vec3(0.0, sz * 0.8, 0.0); c.y = sz * 0.24 + 0.012 * sz * sin(uTime * 1.7 + sd * 30.0);
          P = vec4(smoothstep(0.07, 0.19, f) * (1.0 - smoothstep(0.4, 0.52, f)), smoothstep(0.44, 0.54, f) * (1.0 - smoothstep(0.76, 0.92, f)), 0.0, sd);`,fpars:`uniform vec3 uInk, uApricot, uBillC;
          float segC(vec2 p, vec2 a, vec2 b, float w) { vec2 pa = p - a, ba = b - a; return 1.0 - length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0)) / w; }
          // a swimming pelican in profile, head toward +x: x = the white bird, y = bill and pouch, z = the ink of the folded wing tip
          vec3 swimmer(vec2 q, float dip, float full) {
            float body = 1.0 - length((q - vec2(-0.14, -0.3)) / vec2(0.6, 0.3 - 0.06 * dip));
            float tail = segC(q, vec2(-0.6, -0.26), vec2(-0.86, -0.02 + 0.3 * dip), 0.13);
            vec2 hd = mix(vec2(0.44, 0.5), vec2(0.5, -0.5), dip);
            float neck = max(segC(q, vec2(0.26, -0.22), mix(vec2(0.22, 0.2), vec2(0.42, -0.4), dip), 0.12), segC(q, mix(vec2(0.22, 0.2), vec2(0.42, -0.4), dip), hd, 0.11));
            float head = 1.0 - length((q - hd) / vec2(0.16, 0.13));
            float bill = segC(q, hd + vec2(0.1, 0.0), hd + vec2(0.52, -0.3 + 0.16 * full), 0.06 + 0.07 * full);
            float tip = 1.0 - length((q - vec2(-0.5, -0.36)) / vec2(0.3, 0.13));
            return vec3(max(max(body, tail), max(neck, head)), bill, tip);
          }`,frag:`
          vec2 q = vQ * 2.0; float dip = vP.x, full = vP.y;
          vec3 b = swimmer(q, dip, full), sh = swimmer(q - vec2(-0.1, -0.1), dip, full);
          float wake = (1.0 - abs(length((q - vec2(-0.1, -0.62)) / vec2(0.92, 0.2)) - 1.0) / 0.3) * step(q.y, -0.56);
          tearK = 0.0; deck = 0.0; farK = 0.3;
          if (max(b.x, b.y) > 0.1) {
            e = 1.0; col = b.y > b.x ? mix(uBillC, uApricot, 0.35 + 0.65 * full) : uWhite;
            if (b.z > 0.25 && b.x > 0.1) col = uInk;
            if (q.y < -0.56) e = 0.0;                      // the water line
          } else if (max(sh.x, sh.y) > 0.1 && q.y > -0.56) { e = 1.0; col = mix(uShade, uInk, 0.15); }
          else { e = wake > 0.0 ? 1.0 : 0.0; col = uWhite; }
          puv = vQ + seed;`})}await w.yield();const io={value:1};{const e=new b(...se.portalSeat.direction).normalize(),t=new b().crossVectors(e,new b(0,1,0)).normalize(),a=new b().crossVectors(t,e).normalize(),o=[],s=18;for(const r of[1,0])for(let l=0;l<s;l++){const c=l%2===0,u=(l+.5)/s*H+k.range(-.05,.05)*0;o.push([u,c?8.1:8.4,c?15.5+4*Math.sin(l*2.3):8+1.5*Math.cos(l*1.7),c?5.2:4,.13+l*.071,r,c?0:1,c?.011:-.016,0,0,0,0])}o.push([0,0,21,21,.61,2,2,0,0,0,0,0]);const n=N.object.getObjectByName("cloud");n&&(n.renderOrder=-2.5);const i=l0.sun.map(T);C0(o,{order:-2,params:{depthTest:!1,depthWrite:!1},uniforms:{uSeat:{value:Kt.clone()},uE1:{value:t},uE2:{value:a},uDirP:{value:e},uRayA:{value:i[0].multiplyScalar(.92)},uRayB:{value:i[1].multiplyScalar(.92)},uRayC:{value:i[2].multiplyScalar(.86)},uRayK:io},vpars:"uniform vec3 uSeat, uE1, uE2, uDirP; uniform float uRayK;",vert:`
          float kind = iB.y, ang = iA.x + uTime * iB.w, len = iA.z * (1.0 + 0.03 * sin(uTime * 0.5 + iB.x * 40.0)) * (kind < 1.5 ? uRayK : 1.0);
          vec3 ax = uE1 * cos(ang) + uE2 * sin(ang), side = uE1 * -sin(ang) + uE2 * cos(ang);
          c = uSeat + uDirP * 0.6;
          if (kind < 1.5) { c += ax * (iA.y + len * 0.5); T = side * iA.w; W = ax * len; if (kind > 0.5) c += (uE1 * -0.55 + uE2 * -0.4) * (0.6 + 0.04 * len) + uDirP * 0.2; }
          else { T = uE1 * iA.z; W = uE2 * iA.w; }
          P = vec4(kind, iB.z, len, iB.x);`,fpars:"uniform vec3 uRayA, uRayB, uRayC;",frag:`
          float kind = vP.x, s = vQ.y + 0.5; vec4 n = texture2D(uPaper, vQ * vec2(0.5, 1.3) + seed);
          farK = 0.0; tearK = 0.8;
          if (kind < 1.5) {
            // a ray: a long torn triangle, widest a little way out from its foot
            float wd = (1.0 - s) * (0.35 + 0.65 * smoothstep(0.0, 0.12, s));
            e = min((1.0 - abs(vQ.x) * 2.0 / max(wd, 0.02)) * 1.2, s * 9.0 + 0.3) + (n.a - 0.5) * 0.5;
            col = vP.y < 0.5 ? mix(uRayA, uRayC, smoothstep(0.55, 0.6, n.b) * 0.35) : uRayB;
            col = mix(col, uRayC, (1.0 - smoothstep(0.0, 0.2, s)) * 0.5);
            if (kind > 0.5) { col = uShade * 0.95; deck = 0.0; }
            puv = vec2(vQ.x * 1.5, s * vP.z * 0.3) + seed;
          } else {
            float len = length(vQ * 2.0);
            e = (1.0 - len) * 2.4 + (n.a - 0.5) * 0.7;
            col = mix(uRayC, uRayA, smoothstep(0.62, 0.9, len + (n.r - 0.5) * 0.2));
            puv = vQ * 6.0 + seed;
          }`}),b0.uSunC.value.setRGB(l0.sunLight[0],l0.sunLight[1],l0.sunLight[2]),b0.uSunK.value=h0.hour==="dusk"?.6:.9}await w.yield();const xa=[[2.9,-1.05,.12],[4,1.2,.3],[5.2,.45,.62]],as=[[1.45,-.6,.17],[3.9,1.35,.3],[5.2,.5,.62]],os=xa.map((e,t)=>[0,-400,0,.86+.08*t,P(),t,0,0,0,0,0,0]),dt=C0(os,{uniforms:{uCrB:{value:q(A[2],T("#3F6FE0"),.4)},uCrA:{value:q(A[3],A[5],.15).multiplyScalar(.9)},uWing:{value:q(ne.white,A[2],.3)}},vert:`
        float sd = iB.x, sz = iA.w; c = iA.xyz;
        c += 0.16 * vec3(sin(uTime * 2.7 + sd * 30.0), 0.6 * sin(uTime * 3.4 + sd * 17.0), cos(uTime * 2.2 + sd * 9.0));
        float ro = 0.4 * sin(uTime * 1.3 + sd * 20.0) + (iB.y - 1.0) * 0.35;
        T = (camR * cos(ro) + camU * sin(ro)) * sz; W = (camU * cos(ro) - camR * sin(ro)) * sz;
        P = vec4(sin(uTime * 37.0 + sd * 40.0), iB.y, 0.0, sd);`,fpars:"uniform vec3 uCrA, uCrB;"+po,frag:`
        float isB = 0.0; col = hawker(vQ * 2.0, vP.x, uCrA, uCrB, e, isB);
        deck = 1.0 - isB; tearK = 0.25 * (1.0 - isB);
        puv = vQ * 0.6 + seed;`});dt.geometry.attributes.iA.setUsage(G.DynamicDrawUsage);const De=new b,lo=[[.207,.256],[.293,.358]],ss=e=>{let t=0,a=0,o=0;for(let i=0;i<lo.length;i++){const[r,l]=lo[i];e>r-.012&&e<l+.006&&(t=D(r-.012,r+.008,e),a=D(l-.008,l+.006,e),o=i)}const s=dt.geometry.attributes.iA.array,n=t>0&&a<1;if(!(!n&&!dt.userData.on)){for(let i=0;i<xa.length;i++){const r=(o?as:xa)[i],l=i%2?1:-1;n?(Ue(L(e+(r[0]+18*(1-t))/r0,0,1),r[1]+l*(5*(1-t)+9*a*a),De),De.y=Math.max(.45,De.y+r[2]+4.5*a*a+1.2*(1-t))):De.set(0,-400,0),s[i*4]=De.x,s[i*4+1]=De.y,s[i*4+2]=De.z}dt.geometry.attributes.iA.needsUpdate=!0,dt.userData.on=n}};await w.yield();const he=new G.Group;he.matrixAutoUpdate=!1,he.visible=!1,Te.add(he);const V0=new G.Mesh(It,ie({uWash:{value:0},uWashC:{value:0}},`
      varying vec2 vQ; void main() { vQ = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,`
      varying vec2 vQ; uniform float uWash, uWashC, uTime; uniform vec3 uHoney;
      ${pe}
      void main() {
        vec4 n = texture2D(uPaper, vQ * vec2(1.4, 0.8) + vec2(0.0, uTime * 0.15));
        vec3 col = mix(uWhite * vec3(0.86, 0.95, 1.0), uHoney * 0.95, uWashC) * (0.9 + 0.2 * n.b);
        gl_FragColor = vec4(col * uTint, uWash * (0.8 + 0.2 * n.a));
      }`,{transparent:!0,depthTest:!1,depthWrite:!1,alphaToCoverage:!1}));V0.matrixAutoUpdate=!1,V0.frustumCulled=!1,V0.renderOrder=60,V0.visible=!1,Te.add(V0);const pt={uFold:{value:0},uBeat:{value:0},uBob:{value:0},uFrame:{value:new G.Vector2(1.07,.6)}};{const e=ft?.2:0,t=b0.uTint.value.clone().lerp(new G.Color(1,1,1),ft?.5:0),a=q(T("#22B8CC"),T("#7FE6EE"),e).multiplyScalar(.92),o=T("#1C63B0"),s=q(T("#46D2F0"),T("#D6F6FA"),e).multiplyScalar(.9),n=T("#24508C"),i=q(T("#F08A3A"),T("#F7A65E"),e*2).multiplyScalar(.95),r=ne.white.clone(),l=q(b0.uShade.value,A[5],.12),c=q(ne.ink,n,.22),u=q(c,s,.15),f=rs(),m=V=>()=>V,d=.92,h=-.06*d,p=.17*d,v=.082*d,y=.2*d,g=V=>{const K=h+V*p,Q=L((K/d+.01)/.12,0,1);return d*.1*Math.pow(Math.max(0,1-Math.pow(Q,2.2)),.85)*(1-.4*Q*Q)+d*.045*(1-D(-.012,.04,K))},x=V=>d*(.003+.025*Math.pow(1-V,1.1)),z=V=>x(V*.58)+d*.025*(1-V*V);me(f,0,{S:10,K:5,len:p,org:[0,0,h],endA:!1,hwRef:.012,hw:V=>g(V)+.003,col:m(l),tear:.4}),me(f,0,{S:4,K:3,len:y,org:[0,0,v],endA:!1,hwRef:.03,hw:V=>x(V)+.002,col:m(l),tear:.4}),me(f,6,{S:5,K:3,len:y*.58,org:[0,0,v],endA:!1,hwRef:.02,hw:z,col:m(i),tear:.2}),me(f,7,{S:6,K:5,len:y,org:[0,0,v],endA:!1,hwRef:.03,hw:x,col:(V,K)=>Math.abs(K)<.3&&V<.86?u:c,tear:.3}),me(f,3,{S:12,K:9,len:p,org:[0,0,h],endA:!1,hwRef:.012,hw:g,col:m(a),tear:.4});const B=V=>.36-.03*Math.abs(V-1.6),F=V=>.008+.03*Math.pow(Math.sin(Math.PI*(.06+.9*V)),.7),W=V=>(K,Q)=>K>.86?q(o,n,.6):Math.abs(Q)<.14?q(s,r,.45):q(Math.floor(K*9+.5*Math.abs(Q)+.3*V)%2?q(a,o,.6):a,r,.06*(V%3));for(const V of[20,40]){for(let K=0;K<5;K++)me(f,V+10+K,{S:6,K:3,len:B(K),hw:Q=>F(Q)+.004,col:m(l),tear:.4,uvo:K*.13});for(let K=0;K<5;K++)me(f,V+K,{S:7,K:5,len:B(K),hw:F,col:W(K),tear:.4,uvo:K*.21});for(let K=0;K<3;K++)me(f,V+5+K,{S:4,K:5,len:.17-.012*K,hw:Q=>.012+.03*Math.sin(Math.PI*(.08+.84*Q)),col:(Q,u0)=>Math.floor(Q*5+Math.abs(u0)*1.5)%2?q(o,n,.35):q(a,s,.5),tear:.4,uvo:K*.31})}const j=`
        attribute vec4 aData; attribute vec3 color;
        uniform float uFold, uBeat, uBob; uniform vec2 uFrame;
        varying vec3 vCol; varying vec4 vData; varying float vShd; varying vec3 vLoc;
        void main() {
          float pid = aData.w; vec2 d2; vShd = 0.0;
          float sc = clamp(uFrame.x / max(uFrame.y * 1.4, 1e-4), 0.8, 1.0);       // a little smaller on an upright screen (whose wider lens already shrinks it)
          if (pid > 19.5) {
            float side = pid > 39.5 ? 1.0 : -1.0, k = pid - (side > 0.0 ? 40.0 : 20.0), sh = step(9.5, k), j = k - 10.0 * sh;
            float fanI = j < 4.5 ? j : (j - 5.0) * 1.4 + 0.6;
            float th = mix(0.1, 0.62, uBeat) - 0.6 * uFold + (fanI - 2.0) * mix(0.1, 0.2, uBeat);
            vec2 dir = vec2(cos(th), sin(th)), nrm = vec2(-dir.y, dir.x);
            vec2 w = dir * position.z + nrm * position.x + vec2(0.03, -0.075 - 0.16 * uFold) + sh * vec2(-0.014, -0.012);
            d2 = vec2(side * (w.x * sc - uFrame.x), w.y * sc - uFrame.y);
            vShd = sh;
          } else {
            d2 = vec2(position.x, position.z) * sc + vec2(0.0, uBob - uFrame.y);
            if (pid < 0.5) { d2 += vec2(-0.011, -0.008) * sc; vShd = 1.0; }
          }
          vCol = color; vData = vec4(aData.xyz, pid * 0.137); vLoc = vec3(position.x, position.z, pid);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(d2, -1.0, 1.0);
        }`,I=`
        varying vec3 vCol; varying vec4 vData; varying float vShd; varying vec3 vLoc;
        uniform vec3 uCrA, uCrB, uCrC, uMTint; uniform vec2 uCrown;
        ${pe}
        void main() {
          vec3 col = vCol;
          if (abs(vLoc.z - 3.0) < 0.5) {
            // the crown's bars: rows of feathers ringing the base of the bill, each row a scalloped band of three flat
            // papers (a deep blue bar, turquoise, a pale azure tip), their edges a little torn
            vec2 p = vLoc.xy - vec2(0.0, uCrown.x);
            float n = texture2D(uPaper, vLoc.xy * 2.6 + vec2(0.37, 0.11)).r;
            float ang = atan(p.x, max(-p.y, 1e-4));
            float r = length(p * vec2(0.8, 1.0)) / uCrown.y - 0.42 * abs(sin(ang * 6.5)) + (n - 0.5) * 0.5 + 0.2;
            float f = fract(r), aw = clamp(fwidth(r) * 0.8, 0.02, 0.2);
            float bar = 1.0 - smoothstep(0.3 - aw, 0.3 + aw, f) + smoothstep(1.0 - aw, 1.0, f);
            col = mix(mix(uCrA, uCrC, smoothstep(0.68 - aw, 0.68 + aw, f)), uCrB, clamp(bar, 0.0, 1.0));
          }
          vec4 s = paperSheet(col, vData.xy * 5.0, vData.z, 0.5, vData.w, 1.0 - vShd);
          if (s.a < 0.04) discard;
          gl_FragColor = vec4(max(s.rgb * uMTint, vec3(0.0)), s.a);
        }`,O=new G.Mesh(cs(f),ie({...pt,uMTint:{value:t},uCrA:{value:a},uCrB:{value:o},uCrC:{value:q(s,r,.25)},uCrown:{value:new G.Vector2(v+.03*d,.027*d)}},j,I,{transparent:!0,depthTest:!1,depthWrite:!1,alphaToCoverage:!1}));O.frustumCulled=!1,O.renderOrder=50,he.add(O)}await w.yield();const z0=new b,ro=new G.Vector2,Ut=new G.Matrix4,Ms=new G.Matrix4,ga=new b,wa=new b,co=new G.Vector2(b0.uShadowDir.value.x,b0.uShadowDir.value.z).normalize();let uo=-1,ho=0;const ns=(e,t,a,o)=>{z0.setFromMatrixPosition(a.matrixWorld),w.renderer.getDrawingBufferSize(ro),ge.uPx.value=2*Math.tan((a.fov??62)*Math.PI/360)/Math.max(1,ro.y),ge.uU.value=o,io.value=ao(o);const s=z0.y<0&&!w.through;E0.visible=!s,xe.visible=s,ge.uUnderK.value=s?1:0,ge.uBackK.value=w.through?D(3,5.2,Math.abs(z0.x+17)):0,bt.position.copy(z0);{const u=1-D(.33,.42,o),f=D(.6,.72,o)*(1-u),m=1-u-f,d=jt[0],h=jt[1],p=jt[2];for(let v=0;v<8;v++)$e[v].setRGB(d[v].r*u+h[v].r*m+p[v].r*f,d[v].g*u+h[v].g*m+p[v].g*f,d[v].b*u+h[v].b*m+p[v].b*f);ka.value=1.3*u+m+.8*f}o>0&&Math.abs(o-uo)<1e-7&&(ho+=e/3),uo=o,N.setProgress(L((o-.47)/.07,0,1)),N.setWave(o>0?Ee(o)+ho:t/3),N.update(e,t,a);const n=D(-.3,.3,Math.sin(t*.9));for(const u of Ia)u.userData.u.uU.value=o;Ko.userData.u.uGlide.value=n;for(const u of ta){const f=(o-u.uX)*40;u.m.position.copy(u.X).addScaledVector(u.V,f),u.m.position.y+=Math.max(0,-f)*u.sink+.3*Math.sin(t*.8)}if(wt=L((1.3-(a.aspect??1.78))/.7,0,1),Wo(o),ss(o),Io(a,z0),Go(o,z0),No(o,z0),jo(o,a,z0),ee&&$o(o,a,z0),ve){const u=o>=ht;b0.uAlert.value=D(Zo,ht,o),Lt.visible=u,Yo.visible=!u,Jo.visible=!u}const i=D(0,.012,o);if(he.visible=i>.001&&!w.through,he.visible){const u=Math.max(D(.113,.127,o)*(1-D(.205,.22,o)),D(.495,.51,o)*(1-D(.625,.645,o)),D(.745,.762,o)*(1-D(.895,.915,o))),f=Math.max(u,D(y0-.04,y0-.014,o)*(1-D(o0+.004,o0+.03,o))),m=D(o0+.004,o0+.02,o)*(1-D(o0+.03,o0+.06,o)),d=L(f+.22*m*Math.sin(t*30),0,1),h=Math.tan((a.fov??62)*Math.PI/360),p=t*15.708+.5236;pt.uFold.value=d,pt.uBeat.value=(.5+.5*Math.sin(p))*(1-d),pt.uBob.value=.0055*Math.sin(p+1)*(1-.6*d),pt.uFrame.value.set(h*(a.aspect??1.78),h),t0.tangentAt(o,ga),t0.tangentAt(Math.min(1,o+.012),wa);const v=L((ga.z*wa.x-ga.x*wa.z)*3,-.14,.14);Ut.makeRotationZ(-v).setPosition(.006*Math.sin(t*1.7),-(1-i)*.3,0),he.matrix.multiplyMatrices(a.matrixWorld,Ut),he.matrixWorldNeedsUpdate=!0}const l=D(y0-.016,y0-.004,o)*(1-D(o0+.004,o0+.016,o))*(1-D(0,.85,Math.abs(z0.y)));V0.visible=l>.003&&!w.through,V0.visible&&(V0.material.uniforms.uWash.value=l*.92,V0.material.uniforms.uWashC.value=D(.25,-.25,z0.y),Ut.makeScale(3.4,2.2,1).setPosition(0,0,-.5),V0.matrix.multiplyMatrices(a.matrixWorld,Ut),V0.matrixWorldNeedsUpdate=!0);const c=(1-D(2.5,8,z0.y))*i;if(Ct.visible=c>.02&&!s&&!w.through,Ct.visible){const u=z0.y*3.2+.8;Ct.position.set(z0.x+co.x*u,0,z0.z+co.y*u),Ct.scale.setScalar(c*(.8+.06*Math.sin(t*12.566)))}};return{scene:Te,path:t0,duration:40,title:{morning:"The Tissue-Paper Pelicans",dawn:"The Tissue-Paper Pelicans at Dawn",evening:"The Tissue-Paper Pelicans, Evening",dusk:"The Tissue-Paper Pelicans by Moonlight"}[h0.hour],look:h0,pace:e=>1.08-.2*oe(e,.13,.215,.4)-.12*oe(e,.425,.53,.4)-.3*oe(e,.5,.66,.4),dbg:{setCalm:e=>{so=e},leanW:ot,hero:N,flocks:_a,moving:ta,waveAt:Ee,closeAt:Sa,star:Ot,islands:f0,uIn:y0,uOut:o0,shoalInfo:ue,info:{ps:le,pool:J,extra:Q0.map(e=>[+e.x.toFixed(1),+e.z.toFixed(1),+e.lat.toFixed(1)])}},camera:{fov:62,near:.2,nearThrough:.3,far:4200,lookAhead:14,sway:.7,bank:.5},pois:ma,portal:{shape:"circle",radius:7,color:l0.portal,glow:1.15,tilt:!0,revealDistance:300},post:{exposure:1,bloom:{strength:.2,radius:.5,threshold:.93},grade:{saturation:1.06,contrast:1.03,tint:"#ffffff",shadowTint:"#0a1030",vignette:.2,grain:.03,aberration:0}},ride:"none",style:"none",companion:"none",update:ns,dispose(){N.dispose(),It.dispose()}}}};export{ks as default};
