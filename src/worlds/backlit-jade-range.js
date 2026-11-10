import*as c from"three";import{makePath as Tn,makeRng as jn,hashSeed as Wn,clamp as X,lerp as C,smoothstep as w}from"../kit/core.js";import*as ce from"../kit/fauna.js";import{buildHero as Ln}from"../parts/backlit-jade-range.js";const La=["#EEF5E4","#8FCB86","#3F8F5A","#0B2318","#D9DCCB","#A4522A","#C8372C"],H=(T,te,I)=>new c.Color(T,te,I),Pn={day:{zen:H(.014,.075,.115),mid:H(.085,.3,.37),hor:H(.6,.74,.6),sun:H(1.72,1.72,1.6),fill:H(.085,.2,.24),lamp:H(.6,.8,.58),cloud:H(.5,.56,.47),cloudFar:H(.74,.82,.72),fog:H(.43,.59,.56),snow:H(.76,.78,.74),exposure:1,stars:0,glow:1,portal:"#e4f6e0"},sunrise:{zen:H(.012,.06,.15),mid:H(.15,.27,.42),hor:H(.86,.58,.36),sun:H(2.05,1.6,.8),fill:H(.09,.15,.23),lamp:H(.95,.7,.4),cloud:H(.5,.435,.48),cloudFar:H(.94,.72,.56),fog:H(.55,.47,.49),snow:H(.8,.76,.76),exposure:1.05,stars:0,glow:1.25,portal:"#ffe6b8"},night:{zen:H(.002,.006,.02),mid:H(.012,.03,.07),hor:H(.035,.065,.11),sun:H(.42,.56,.8),fill:H(.03,.06,.11),lamp:H(.26,.38,.52),cloud:H(.11,.16,.22),cloudFar:H(.22,.31,.42),fog:H(.035,.065,.1),snow:H(.6,.7,.8),exposure:1.55,stars:1,glow:.7,portal:"#cfe4ff"}},Ae=`
  float jh(vec3 p){ p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yxz + 33.33); return fract((p.x + p.y) * p.z); }
  float jn(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(mix(jh(i), jh(i + vec3(1,0,0)), f.x), mix(jh(i + vec3(0,1,0)), jh(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(jh(i + vec3(0,0,1)), jh(i + vec3(1,0,1)), f.x), mix(jh(i + vec3(0,1,1)), jh(i + vec3(1,1,1)), f.x), f.y), f.z); }`,lt=`
  uniform vec3 uFogCol, uCloudCol; uniform float uFogD, uCloudY;
  vec3 atmos(vec3 col, vec3 wp, float dist, float basin){
    col = mix(col, uCloudCol, basin * (1. - smoothstep(uCloudY - 6., uCloudY + 5., wp.y)));
    return mix(col, uFogCol, 1. - exp(-dist * uFogD));
  }`,Xt=`
  uniform vec3 uVeil;
  float veil(vec3 wp){ return 1. - uVeil.z * smoothstep(.4, .7, jn(vec3((wp.xz - uVeil.xy) / 120., 2.7))); }`;var Gn={id:"backlit-jade-range",name:"The Jade Range",category:"wilderness",weirdness:.4,media:["air"],async build(T){const te=T.rng,I=T.noise,ct=T.vary||{hour:"any",rare:!1,density:1,mood:.5},ke=T.quality?.detail??1,ht=X(ct.density??1,.7,1.3),Zt=te.fork("weather"),Uo=Zt(),Se=ct.hour==="night"?"night":ct.hour==="dawn"||ct.hour==="golden"?"sunrise":ct.hour==="day"||Uo<.46?"day":Uo<.76?"sunrise":"night",Pe=Zt.chance(.3),de=Zt.chance(.3),go=Zt.chance(.5),Pa=!!ct.rare,jt=jn(Wn("jade-gate:"+T.seed)),Q=Pn[Se],Wt=Se==="night",ft=La.map(e=>new c.Color(e)),wo=40,Y=124,xo=134.6,Ho=142.5,J=new c.Scene;J.background=Q.fog.clone(),J.fog=new c.FogExp2(Q.fog.clone(),3e-4);const N=Tn([[-31.6,100,52.2],[-78.9,100,15.2],[-132.1,101.5,-26.4],[-185.3,116,-67.9],[-274.3,143.5,-132.6],[-355.1,143.4,-187.1],[-436,149.5,-241.6],[-482.9,165.5,-270.3],[-532.1,183.8,-294.8],[-583.3,202,-315],[-636,220,-330.6],[-679.7,231.5,-341.5],[-723.3,236.8,-352.4],[-781.5,237.5,-366.9]]),Re=N.length,me=N.start,se=N.end,ee=new c.Vector2(se.x-me.x,se.z-me.z).normalize(),oe=new c.Vector2(-ee.y,ee.x),Lt=(e,t)=>(e-me.x)*ee.x+(t-me.z)*ee.y,yo=(e,t)=>(e-me.x)*oe.x+(t-me.z)*oe.y,Pt=-700,Eo=3200,bo=Eo-Pt+1,Oo=new Float32Array(bo),Ko=new Float32Array(bo);{const e=new c.Vector3;let t=-1e9,o=0,a=0;for(let n=-800;n<=Re+2600;n+=1.5){N.posAtDist(n,e);const s=Lt(e.x,e.z),r=yo(e.x,e.z);if(t>-1e8)for(let p=Math.max(Pt,Math.ceil(t));p<=Math.min(Eo,Math.floor(s));p++){const u=(p-t)/Math.max(s-t,1e-6);Oo[p-Pt]=C(o,r,u),Ko[p-Pt]=C(a,e.y,u)}t=s,o=r,a=e.y}}const Qo=(e,t)=>{const o=X(t-Pt,0,bo-1.001),a=o|0;return e[a]+(e[a+1]-e[a])*(o-a)},ue=e=>Qo(Oo,e),dt=e=>Qo(Ko,e),E=(e,t,o)=>{const a=t+ue(e);return o.x=me.x+ee.x*e+oe.x*a,o.z=me.z+ee.y*e+oe.y*a,o},ve=Lt(se.x,se.z);await T.yield();const Bt=.8,Ba=1.2,Ue=c.MathUtils.degToRad(25),O=await Ln(T,{palette:La,hour:Se,weather:Pe?"gale":"clear",season:de?"autumn":"spring",cloudApron:!1,sunElevation:Se==="day"?22:void 0,maxHaze:6e-5}),Ce=new c.Vector3(-Math.cos(Ue),0,Math.sin(Ue)),qt=new c.Vector3(Math.sin(Ue),0,Math.cos(Ue)),qa=N.pointAt(.42),Da=2200;{const e=O.anchors.viewpoints.reveal.lookAt.z,t=qa.clone().addScaledVector(qt,-Da),o=N.startTangent,a=t.clone().sub(me),n=X(-(a.x*o.z-a.z*o.x)/(Ce.x*o.z-Ce.z*o.x),700,1700),s=O.anchors.hornTop.x*Bt+n,r=e*Bt;O.object.scale.setScalar(Bt),O.object.rotation.y=Ue,O.object.position.set(t.x+Ce.x*s-qt.x*r,131-60*Bt,t.z+Ce.z*s-qt.z*r),O.object.updateMatrixWorld(!0),J.add(O.object)}const Jt=e=>e.clone().applyMatrix4(O.object.matrixWorld),eo=Jt(O.anchors.hornTop),Yo=Jt(O.anchors.viewpoints.reveal.lookAt),Je=O.anchors.sunDir.clone().applyAxisAngle(new c.Vector3(0,1,0),Ue).normalize(),Na=O.anchors.sunDirEnd.clone().applyAxisAngle(new c.Vector3(0,1,0),Ue).normalize(),Be=qt.clone().multiplyScalar(-1).setY(.42).normalize(),He=O.anchors.wind.clone().applyAxisAngle(new c.Vector3(0,1,0),Ue).setY(0).normalize(),ge=[new c.Vector3,new c.Vector3,new c.Vector3,new c.Vector3],Mo=new c.Vector3,zo=new c.Vector3,$o=new c.Vector3;{const e=se,t=new c.Vector3(-N.endTangent.z,0,N.endTangent.x),o=N.endTangent,a=N.pointAt(.42),n=Jt(O.anchors.viewpoints.reveal.lookAt).setY(Y+250),s=n.clone().sub(a).setY(0).normalize(),r=a.clone().addScaledVector(s,430).addScaledVector(Ce,-128);r.y=Y+86,ge[0].copy(r).addScaledVector(Ce,-100),ge[1].copy(r).addScaledVector(Ce,180).setY(Y+100),O.anchors.skeinLine.spread.value=2,O.anchors.skeinLine.minPx.value=11,ge[2].copy(e).addScaledVector(o,330).addScaledVector(t,300).setY(e.y+95),ge[3].copy(e).addScaledVector(o,500).addScaledVector(t,-420).setY(e.y+150)}const Xo=e=>{const t=X((e-.3)/.7,0,1),o=1-t;Mo.set(0,0,0).addScaledVector(ge[0],o*o*o).addScaledVector(ge[1],3*o*o*t).addScaledVector(ge[2],3*o*t*t).addScaledVector(ge[3],t*t*t),zo.set(0,0,0).addScaledVector(ge[0],-o*o).addScaledVector(ge[1],o*o-2*o*t).addScaledVector(ge[2],2*o*t-t*t).addScaledVector(ge[3],t*t).normalize(),O.anchors.skeinLine.from.copy(O.object.worldToLocal($o.copy(Mo).addScaledVector(zo,-300))),O.anchors.skeinLine.to.copy(O.object.worldToLocal($o.copy(Mo).addScaledVector(zo,300))),O.anchors.skeinLine.s.value=300/Bt};Xo(0),await T.yield();const re={uTime:{value:0},uProg:{value:0},uSun:{value:Je.clone()},uSunCol:{value:Q.sun.clone()},uSkyCol:{value:Q.fill.clone()},uLamp:{value:Be},uLampCol:{value:Q.lamp.clone()},uPale:{value:ft[0]},uApple:{value:ft[1]},uDeep:{value:ft[2]},uDark:{value:ft[3]},uRind:{value:ft[5]},uAccent:{value:de?new c.Color("#b4541f"):ft[6]},uSnowCol:{value:Q.snow.clone()},uWind:{value:He},uFogCol:{value:Q.fog.clone()},uCloudCol:{value:Q.cloud.clone().multiplyScalar(.8)},uFogD:{value:34e-5},uCloudY:{value:Y},uZen:{value:Q.zen.clone()},uMid:{value:Q.mid.clone()},uHor:{value:Q.hor.clone()},uWallC:{value:new c.Vector3},uWallN:{value:qt.clone()},uWallT:{value:Ce.clone()},uCrestS:{value:new c.Vector2(0,100)},uCrest:{value:new Array(25).fill(1800)},uAxS:{value:new c.Vector4(me.x,me.z,ee.x,ee.y)},uBl:{value:Array.from({length:20},()=>new c.Vector4(1e6,1e6,0,0))},uGate:{value:new c.Vector3(1,0,2.4)},uGale:{value:Pe?1:0},uVH:{value:900},uAsp:{value:16/9},uShaft:{value:new c.Vector4(0,0,0,0)},uVeil:{value:new c.Vector3(0,0,.26)},uNight:{value:Wt?1:0},uFloor:{value:Se==="sunrise"?1.45:1}};{const e=O.anchors.crest.map(Jt),t=e[12].clone();t.y=Y,re.uWallC.value.copy(t);const o=e[0].clone().sub(t).dot(Ce),a=e[24].clone().sub(t).dot(Ce);re.uCrestS.value.set(o,(a-o)/24),re.uCrest.value=e.map(n=>n.y)}const he=e=>{const{own:t,...o}=e,a=new c.ShaderMaterial(o);return Object.assign(a.uniforms,re,t||{}),a},be=te.range(-40,40),to=te.range(-40,40),Zo=(e,t,o)=>{const a=X(.5+.5*(t-e)/o,0,1);return C(t,e,a)-o*a*(1-a)},Ga=e=>-15+8*Math.sin(e/43+1+be*.1),et=(e,t)=>{const o=(e-414)/(e>414?38:48),a=(t-6-5*Math.sin(e*.045+1))/(30*(1+.16*Math.sin(e*.13+2))),n=e-437,s=t-14;return 1-o*o-a*a+.13*Math.sin(e*.21+t*.17)+.08*Math.sin(t*.45-e*.11+1.7)-1.5*Math.exp(-(n*n+s*s)/13)},Ee=e=>C(C(Ga(e),-3+5*Math.sin(e/37+2),w(150,232,e)),1.4,w(325,368,e)),tt=e=>w(212,240,e)*(1-w(330,368,e)),Ia=e=>{const t=X(e,0,1)*3,o=Math.min(Math.floor(t),2),a=t-o;return(o+.2*a+.8*w(.66,.95,a))/3},_a=e=>e<150?78:e<212?78+34*Ia((e-150)/62):e<320?112+25.5*(e-212)/108:137.5,Jo=e=>C(38,19,w(215,300,e)),Dt=e=>w(552,584,e)*(1-w(704,736,e)),Ra=(e,t)=>Math.cos(6.2832*((e+5*(.6*Math.sin(t/61+be)+.4*Math.sin(t/27+2.1+to)))/48+to*.07)),Ua=(e,t)=>w(.76,.99,Ra(e,t)),ea=(e,t,o,a)=>{const n=e+22*I.n2(t/7.5+3.3+be,e/70+1.7)+9*I.n2(o/17+3,a/17-2)+3.5*I.n2(o/5.5+9,a/5.5);return w(736,772,n)*(.5+.5*w(744,800,n))},Ha=(e,t)=>{const o=t-ue(e),a=Math.abs(o),n=o<0?-1:1,s=dt(e),r=I.n2(e/170+3.1+be,t/170+to),p=I.n2(e/47+9.7,t/47-be),u=I.n2(e/13+to,t/13),v=w(138,158,e)*(1-w(205,222,e)),i=_a(e+(.2*a-4+8*I.n2(t/23+be,e/61+2))*v)+p*C(3,.9,w(185,225,e));let l=C(i,102+14*r+6*p,w(322,372,e));const f=322+22*I.n2(t/140+be,4.4);if(e<f+2){const d=C(38,19,w(215,300,e))+(n>0?7*w(262,296,e):0),g=a-d+6*I.n2(e/38+5,n*7.3+be)*(1-.6*w(262,296,e))+2.2*u;if(g>0){const h=262+60*r+55*I.ridged2(e/210+2+be,t/210,3)+12*p;let m=3.4*g-22*w(26,36,g)-20*w(57,67,g)+5*u*w(8,30,g);m=Zo(m,h,26),l+=Math.max(0,m)*(1-w(f-50,f,e))}else{const h=w(136,166,e),m=C(17,3.6,h)*(1-w(196,214,e)),y=Math.abs(o-Ee(e));m>.01&&(l-=m*Math.exp(-Math.pow(y/C(5.5,3.4,h),2))*w(-3,-8,g)),l-=.9*w(205,225,e)*(1-w(3,6+7*tt(e),y))}}if(e>282&&e<358){const d=Math.abs((e+30)/10.8%1-.5)*2,g=3.4*(1-Math.pow(d,1.5)),h=C(46,15,w(292,350,e)),m=a-(n>0?26:20)-g-.8*u,y=(n>0?66*Math.pow(1-w(298,336,e),.7):124*Math.pow(1-w(318,357,e),.7))*w(282,296,e)*(.8+.2*d),b=Math.min(6.5*m,6.5*(h+2-m-2*g),y+6*p);b>0&&(l=Math.max(l,i+b))}if(e>296&&e<524){const d=Math.exp(-Math.pow((e-414)/56,2)),g=w(318,366,e),h=e<340?i:C(137.5,139.8,w(340,470,e))+.9*p,m=o>0?C(19,28,g)+27*d+5*p*g:C(19,25,g)+16*d+5*I.n2(e/31+7,be)*g,y=Math.max(0,a-m),b=h+.6*u*w(3,12,a)+1.5*I.n2(e/19+3,t/19)*w(8,22,a)*(1-w(0,4,y))-.82*y-2.2*w(0,7,y)+2.4*u*w(2,12,y);l=Math.max(l,b-80*w(488,524,e))}if(e>440&&e<850){const d=Dt(e),g=s-9,h=w(456,468,e)*(1-w(494,512,e));let m;o>=0?m=g-.62*Math.max(0,o-12-10*d-15*h)-1.1*h*w(5,12,o)+d*(4.5*w(4.2,6.8,o)+3.7*w(14,17.5,o)):m=g-.55*Math.max(0,-o-13)-.002*Math.pow(Math.max(0,-o-13),2),m+=.9*u*w(4,14,a)+3*p*w(14,50,a),l=Math.max(l,m-500*(1-w(440,462,e)*(1-w(796,846,e))))}if(e>600){const d=1-w(45,150,Math.abs(e-(ve+4))),g=Math.pow(Math.max(0,a-56),1.1)*(.8+.3*r),h=n<0?Ua(e,t)*w(62,92,a)*(1-w(210,330,a)):0;let m=230+1.4*p-3.5*w(ve-62,ve-20,e)-.95*Math.max(0,ve-70-e)-.16*Math.max(0,e-ve-20)+(n>0?Math.min(g*.2,30):Zo(g,240+90*r,80)+h*(10+4*p+2.5*u))*d;if(n>0){const y=w(92,205,o+24*p+7*u);m=C(m,84+8*p,y)+9*u*y*(1-y)*4*.5}l=Math.max(l,m)}if(t<-360&&(l=Math.max(l,96+w(-380,-760,t)*(250+170*I.ridged2(e/300+be,t/300+5,3)+40*p))),e>360&&e<506){const d=et(e,o);d>-1&&(l=d>=0?xo:Math.min(l,xo+.2+6*Math.pow(-d,1.15)))}if(o>7&&e>451&&e<526){const d=w(454,459.5,e)*(1-w(516,525,e))*w(8.2,9.8,o)*(1-w(C(30,25,w(490,510,e)),C(35,29,w(490,510,e)),o+3*u));d>0&&(l=C(l,Math.max(Ho+.045*(e-459),s-4.6)+.22*u,d))}if(e>700&&e<729&&o<-7&&o>-24){const d=w(703.5,707.5,e)*(1-w(721.5,725.5,e))*w(-8.9,-10.4,o)*(1-w(-18.2,-21,o+1.2*u));d>0&&(l=C(l,s-1.6+.2*u,d))}return Math.min(l,s-7.2+Math.max(0,a-6)*1.7)},we=[],qe=[];{let e=-30,t=3.6;const o=[];for(;e>-230;)t*=1.35,e-=t,o.push(e);for(o.reverse(),we.push(...o),e=-30;e<=900;e+=3.6)we.push(e);for(t=3.6,e=we[we.length-1];e<2500;)t*=1.22,e+=t,we.push(e)}{const e=a=>{const n=[0];let s=0,r=3.5;for(;s<80;)s+=3.5,n.push(s);for(;s<a;)s+=5,n.push(s),r=5;for(;s<1800;)r*=1.165,s+=r,n.push(s);return n},t=e(196),o=e(0);for(let a=t.length-1;a>0;a--)qe.push(-t[a]);qe.push(...o)}const Oe=we.length,Z=qe.length,ut=new Float32Array(Oe*Z);for(let e=0;e<Oe;e++){const t=we[e],o=ue(t);for(let a=0;a<Z;a++)ut[e*Z+a]=Ha(t,qe[a]+o);(e&3)===3&&await T.yield()}const ta=(e,t)=>{let o=0,a=e.length-1;if(t<=e[0])return 0;if(t>=e[a])return a-1e-4;for(;a-o>1;){const n=o+a>>1;e[n]<=t?o=n:a=n}return o+(t-e[o])/(e[a]-e[o])},Ea=we.indexOf(-30),Oa=qe.indexOf(0),Ka=e=>e>=-30&&e<896?Ea+(e+30)/3.6:ta(we,e),Qa=e=>e>-80&&e<80?Oa+e/3.5:ta(qe,e),ae=(e,t)=>{const o=Ka(e),a=Qa(t-ue(e)),n=o|0,s=a|0,r=o-n,p=a-s,u=n*Z+s;return(ut[u]*(1-p)+ut[u+1]*p)*(1-r)+(ut[u+Z]*(1-p)+ut[u+Z+1]*p)*r},_=(e,t)=>ae(Lt(e,t),yo(e,t)),vt=Oe*Z,ot=new Float32Array(vt*3),Fe=new Float32Array(vt*4),Nt=new Float32Array(vt*4),Gt=new Float32Array(vt*4),at=new Uint32Array((Oe-1)*(Z-1)*6);{const e=new c.Vector3;let t=0;for(let o=0;o<Oe;o++)for(let a=0;a<Z;a++){const n=o*Z+a;E(we[o],qe[a],e),ot[n*3]=e.x,ot[n*3+1]=ut[n],ot[n*3+2]=e.z}for(let o=0;o<Oe-1;o++)for(let a=0;a<Z-1;a++){const n=o*Z+a,s=n+1,r=n+Z,p=r+1;at[t++]=n,at[t++]=s,at[t++]=r,at[t++]=s,at[t++]=p,at[t++]=r}}const De=new c.BufferGeometry;De.setAttribute("position",new c.BufferAttribute(ot,3)),De.setIndex(new c.BufferAttribute(at,1)),await T.yield(),De.computeVertexNormals(),await T.yield();const oa=(e,t,o,a)=>{let n=0,s=0;for(let r=0;r<10;r++){const p=3*Math.pow(1.9,r),u=(s+p)*.5,v=p-s,i=_(e+a.x*u,o+a.z*u)-(t+a.y*u);n+=v*X(i/(v*.5)+.5,0,1),s=p}return n},Ao=de?236:318,Ya=Je.clone().negate();{const e=De.attributes.normal.array;for(let t=0;t<Oe;t++){const o=we[t];for(let a=0;a<Z;a++){const n=t*Z+a,s=qe[a],r=ot[n*3],p=ot[n*3+1],u=ot[n*3+2],v=e[n*3+1],i=Math.abs(s)<420&&o>-120&&o<1300,l=Dt(o)*w(11.5,12.3,s)*(1-w(23,29,s));let f=60+500*w(420,150,p),d=0;if(i){f=oa(r,p,u,Je),d=Math.exp(-f/5);const x=e[n*3]*Je.x+v*Je.y+e[n*3+2]*Je.z;x>-.2&&(f+=oa(r,p,u,Ya)*w(-.2,.15,x));const S=5,L=(_(r+S,u)+_(r-S,u)+_(r,u+S)+_(r,u-S))*.25;f=C(f,Math.min(f,C(11,2.2,w(300,360,o))),X((p-L-.5)/3.2,0,1)),f=Math.max(f,420*l)}Fe[n*4]=f;let g=1;if(i){const S=(_(r+11,u)+_(r-11,u)+_(r,u+11)+_(r,u-11))*.25;g=X(1-(S-p)/16,.3,1)}Fe[n*4+1]=g;const h=Dt(o),m=w(.52,.72,v);let y=ea(o,s,r,u)*w(.42,.6,v)*(1+.3*I.n2(r/21+3,u/21));y=Math.max(y,h*w(4.6,6,s)*(1-w(11,11.9,s))*.97),y=Math.max(y,m*w(Ao-30,Ao+30,p)*.9),o>600&&s>0&&(y*=1-.8*w(100,135,s)),o>700&&s<-52&&(y=Math.max(y,.8*w(700,745,o)*w(-52,-70,s)*w(.25,.55,v))),(o>702&&o<727&&s<-8&&s>-22.5||!1)&&(y=Math.max(y,.97*w(.6,.8,v)),f=Math.max(f,140),Fe[n*4]=f),Fe[n*4+2]=y,Fe[n*4+3]=w(448,475,o)*(1-w(ve+60,ve+120,o))*(1-w(90,150,Math.abs(s)))*w(.35,.6,v)*(1-l)*(o>735&&s<0?1-w(44,66,-s):1);const M=Ee(o),z=Math.abs(s-M),A=tt(o),V=o>356&&o<480?et(o,s):-9,k=w(205,222,o)*(1-w(368,376,o))*(1-w(4+7*A,7.5+8*A,z)),j=w(326,346,o)*(1-w(470,500,o)),F=w(-.08,.26,I.n2(r/12+5,u/12-3)+.45*I.n2(r/4.3,u/4.3+2))*(1-w(-.5,-.16,V));Fe[n*4+3]=Math.max(Fe[n*4+3],Math.max(j,k)*(1-w(60,110,Math.abs(s)))*w(.35,.6,v)),Nt[n*4]=w(305,335,o),Nt[n*4+3]=d,Nt[n*4+1]=Math.max((1-w(318,340,o))*(p<Ao?1:.3),j*F*(1-w(444,458,o)*w(1,6,s)))*w(.5,.7,v)*(1-k),Nt[n*4+2]=w(205,300,o),Gt[n*4]=o,Gt[n*4+1]=s,Gt[n*4+2]=w(203,211,o)*(1-w(371,377,o))*(1-w(14,18,z)),Gt[n*4+3]=M}(t&1)===1&&await T.yield()}}{const e=new Float32Array(vt);for(let t=0;t<vt;t++)e[t]=Math.log(Math.max(Fe[t*4],.5));await T.yield();for(let t=1;t<Oe-1;t++){const o=we[t];if(!(o<-120||o>1300)){for(let a=1;a<Z-1;a++){if(Math.abs(qe[a])>400)continue;const n=t*Z+a;Fe[n*4]=Math.exp((e[n]*4+(e[n-1]+e[n+1]+e[n-Z]+e[n+Z])*2+e[n-Z-1]+e[n-Z+1]+e[n+Z-1]+e[n+Z+1])/16)}(t&63)===63&&await T.yield()}}}De.setAttribute("aD",new c.BufferAttribute(Fe,4)),De.setAttribute("aE",new c.BufferAttribute(Nt,4)),De.setAttribute("aS",new c.BufferAttribute(Gt,4)),De.computeBoundingSphere();const oo=he({vertexShader:`
        attribute vec4 aD, aE, aS;
        varying vec3 vW, vN; varying vec4 vD, vE, vS;
        void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vN = mat3(modelMatrix) * normal; vD = aD; vE = aE; vS = aS; gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`
        uniform vec3 uSun, uSunCol, uSkyCol, uLamp, uLampCol, uPale, uApple, uDeep, uDark, uRind, uAccent, uSnowCol, uWind;
        uniform float uTime, uGale, uFloor; uniform vec4 uAxS; uniform vec4 uBl[20]; uniform vec3 uGate;
        uniform vec3 uZen, uMid, uHor, uWallC, uWallN, uWallT; uniform vec2 uCrestS; uniform float uCrest[25];
        varying vec3 vW, vN; varying vec4 vD, vE, vS;
        ${Ae}
        ${lt}
        ${Xt}
        vec4 stones(vec2 p){                                   // xy: vector from the nearest stone centre, z: distance to its border, w: its id
          vec2 i = floor(p), f = fract(p), rb = vec2(0.); float d1 = 8., d2 = 8., id = 0.;
          for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
            vec2 g = vec2(float(x), float(y)); vec3 h3 = vec3(i + g, 7.);
            vec2 r = g + .12 + .76 * vec2(jh(h3), jh(h3 + 13.7)) - f; float q = dot(r, r);
            if (q < d1) { d2 = d1; d1 = q; id = jh(h3 + 31.1); rb = r; } else if (q < d2) d2 = q;
          }
          return vec4(-rb, sqrt(d2) - sqrt(d1), id);
        }
        // CARVED FACETS, fixed in world space: the stone is cut in flat planes a few metres across (standing flakes, taller than
        // wide). x: distance to the nearest edge between two facets (0 on the edge), yzw: the facet's own random triple;
        // dir: from the facet's middle toward this point (the way its bevelled edge leans).
        vec4 facet(vec3 p, out vec3 dir){
          vec3 i = floor(p), f = fract(p), id = vec3(.5), rb = vec3(0., 1., 0.); float d1 = 8., d2 = 8.;
          for (int z = -1; z <= 1; z++) for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
            vec3 g = vec3(float(x), float(y), float(z)); float h = jh(i + g + 3.7);
            vec3 o = fract(h * vec3(1., 57.31, 193.7) + vec3(0., .31, .67));
            vec3 r = g + .1 + .8 * o - f; float q = dot(r, r);
            if (q < d1) { d2 = d1; d1 = q; id = o; rb = r; } else if (q < d2) d2 = q;
          }
          dir = -rb * inversesqrt(max(d1, 1e-6));
          return vec4(sqrt(d2) - sqrt(d1), id);
        }
        // the same cells as facet(): x = distance to the nearest edge, y = this facet's own number, z = the number of the facet across that edge
        vec3 cell2(vec3 p){
          vec3 i = floor(p), f = fract(p); float d1 = 8., d2 = 8., r1 = .5, r2 = .5;
          for (int z = -1; z <= 1; z++) for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
            vec3 g = vec3(float(x), float(y), float(z)); float h = jh(i + g + 3.7);
            vec3 o = fract(h * vec3(1., 57.31, 193.7) + vec3(0., .31, .67));
            vec3 r = g + .1 + .8 * o - f; float q = dot(r, r);
            if (q < d1) { d2 = d1; r2 = r1; d1 = q; r1 = o.z; } else if (q < d2) { d2 = q; r2 = o.z; }
          }
          return vec3(sqrt(d2) - sqrt(d1), r1, r2);
        }
        // a trail trodden in the snow along the flight: xy = slope of each print's dimple (for its lit rim), z = its depth 0..1, w = the trough
        vec4 trail(float A, float P, float ph, float amp, float stp, float gate, float px){
          float c = (amp * sin(A * .043 + ph) + amp * .4 * sin(A * .117 + ph * 2.3)) * gate + (fract(ph * 3.7) - .5) * 5.;
          float q = P - c, i = floor(A / stp), fa = (fract(A / stp) - .5) * stp;
          float sd = mod(i, 2.) * 2. - 1.;
          vec2 d = vec2(fa, q - sd * .24); float r = length(d);
          float dim = (1. - smoothstep(.12, .3, r)) * (1. - smoothstep(.1, .28, px));
          float line = (1. - smoothstep(.3, .7 + px * 1.5, abs(q))) * (1. - smoothstep(.9, 2.6, px));
          return vec4(d / max(r, .05) * dim * smoothstep(.05, .2, r), dim, line);
        }
        // one size of loose stone: xyz = lit colour, w = how much of this pixel the stone covers
        vec4 stoneLayer(vec2 sp, float fq, float px, vec3 Lw, float keep){
          vec4 s = stones(sp * fq); float id = s.w, w = px * fq;
          float g = .03 + .2 * fract(id * 5.3), m = smoothstep(g - w, g + .05 + w, s.z) * step(1. - keep, fract(id * 3.7)) * (1. - smoothstep(.25, .6, w));
          float bev = smoothstep(g, g + .16, s.z);                                             // flat top, bevelled edge
          vec3 n = normalize(vec3(s.x * (1. - bev) * 2.4 + (fract(id * 17.) - .5) * .8, 1., s.y * (1. - bev) * 2.4 + (fract(id * 29.) - .5) * .8));
          vec3 tone = mix(vec3(.075, .105, .088), vec3(.38, .44, .36), id * id);
          tone = mix(tone, vec3(.5, .54, .42), step(.62, id) * step(id, .7) * .8);              // pale lichen crust
          tone = mix(tone, vec3(.34, .15, .06), step(.88, id) * .85);                         // rust lichen
          tone = mix(tone, vec3(.4, .33, .11), step(id, .06) * .8);                           // ochre lichen
          return vec4(tone * (.26 + 1.3 * max(dot(n, Lw), 0.) + .22 * n.y) * (.55 + .45 * bev), m);
        }
        void main(){
          vec3 N = vN * inversesqrt(max(dot(vN, vN), 1e-8));
          vec3 toCam = cameraPosition - vW; float dist = max(length(toCam), 1e-3); vec3 V = toCam / dist;
          float px = max(length(fwidth(vW)), 1e-3), ao = vD.y;
          vec3 dWx = dFdx(vW), dWy = dFdy(vW); float pxs = sqrt(max(min(length(dWx), length(dWy)), 1e-3) * px);   // for ground seen at a glancing angle
          vec3 q = vW * vec3(1., .6, 1.);
          vec3 wq = q + 28. * vec3(jn(q / 95. + 4.), jn(q / 95. + 19.), jn(q / 95. + 31.));
          float f1 = 1. - smoothstep(18., 36., px), f2 = 1. - smoothstep(4., 8., px), f3 = 1. - smoothstep(.5, 1., px), f4 = 1. - smoothstep(.05, .12, px);
          float n1 = jn(wq / 72.), n2 = jn(wq / 17. + 7.3), n3 = jn(wq / vec3(2.6, 8., 2.6) + 3.1), n4 = jn(vW * vec3(2.3, 1.1, 2.3));
          float vein = smoothstep(.56, .86, n1) * f1 * .7 + smoothstep(.62, .9, n2) * f2 * .4 + (1. - smoothstep(0., .05, abs(n2 - .47))) * f2 * .2 * smoothstep(.45, .7, n1) + (1. - smoothstep(0., .06, abs(n3 - .5))) * f3 * .22 * smoothstep(.4, .7, n2);
          float moss = smoothstep(.56, .8, jn(wq / 40. + 11.)) * f1 + smoothstep(.62, .85, n3) * f3 * .5;
          // carved blades (pinnacles, flakes, gendarmes) carry -(place across the face) in aD.w: 0 mid-face .. 1 on an arete
          float ar = max(-vD.w, 0.), bit = step(.005, ar);
          // strata: beds a few metres thick standing nearly on end, and broad tonal bands behind them (walls only)
          float fS = 1. - smoothstep(1.2, 3., px);
          float bed = jn(vec3(wq.x / 5.5, wq.y / 46., wq.z / 5.5) + 7.7), bed2 = jn(vec3(wq.x / 19., wq.y / 140., wq.z / 19.) + 2.2);
          float strata = ((bed - .5) * fS + (bed2 - .5) * f2 * 1.2) * (1. - bit);
          float tool = cos(dot(vW, vec3(5.1, 1.3, 3.7)) + 2.5 * jn(vW * .5));
          float k = 1. + .3 * ((n1 * 2. - 1.) * f1 * .7 + (n2 * 2. - 1.) * f2 * .5) + .55 * moss - .32 * vein + .9 * strata;
          k = max(mix(k, 1. + 1.15 * moss - .8 * vein + tool * .1 * f4, bit), .14);
          // THE COL'S WEST SLOPE (and the far side of the saddle): snow-plastered carved stone. Which facets hold snow is settled
          // further down, facet by facet in the stone's own world-space cells, so snow and stone meet along crisp cut edges
          // and nothing is drawn out along the fall line.
          float westK = step(690., vS.x) * smoothstep(52., 66., -vS.y);
          float snowV = vD.z, Ny0 = N.y;
          // facets: two sizes, each fading to its mean before its bevel is under two pixels. Every facet has its own tilt (so the
          // waxy highlight and the fill break into planes), a little more or less stone behind it, and a narrow bevel round its
          // edge that leans outward: the bevels that face the light carry a thin bright line, the others lie in shade.
          // (no cobbles on a steep face or on the crag under the herd's terrace: bare chiselled stone there, no stretched mosaic)
          float scrK = vD.w * smoothstep(.7, .84, N.y) * (1. - smoothstep(455., 460., vS.x) * (1. - smoothstep(514., 523., vS.x)) * smoothstep(5.6, 6.8, vS.y) * (1. - smoothstep(10., 11.5, vS.y)));
          scrK *= 1. - smoothstep(552., 584., vS.x) * (1. - smoothstep(704., 736., vS.x)) * smoothstep(3.3, 4.1, vS.y) * (1. - smoothstep(6.9, 7.8, vS.y));   // nor on the bank under the hunt's snow tongue
          float cov = clamp(max(scrK, max(snowV * 1.4 * (1. - westK), vE.y)), 0., 1.);
          float fw = (1. - smoothstep(.45, .9, cov)) * (1. - .5 * bit);
          float fA0 = 1. - smoothstep(1., 2.2, px), fA = fA0 * fw, fB = (1. - smoothstep(.26, .6, px)) * fw, fC = (1. - smoothstep(3.6, 8., px)) * fw * (1. - bit), eF = 0., crease = 0.; vec3 tiltF = vec3(0.);
          vec3 Lr = normalize(uLamp * (.25 + .75 * vE.z) + vec3(0., .8, 0.));
          vec3 fpc = vW + 7. * (vec3(jn(vW * .033 + 5.), jn(vW * .033 + 17.), jn(vW * .033 + 29.)) - .5);
          vec3 fp = vW + 1.8 * (vec3(jn(vW * .13 + 5.), jn(vW * .13 + 17.), jn(vW * .13 + 29.)) - .5);
          if (westK > .001) {
            vec3 cw = cell2(fp / vec3(6.5, 12., 6.5) + 3.3), cb = cell2(fpc / vec3(24., 44., 24.) + 7.1);
            float amt = clamp(vD.z * 1.05 + (Ny0 - .62) * .9, 0., .95);
            float e1 = .5 + .5 * smoothstep(0., max(.1, 2. * px / 6.5), cw.x), e2 = .5 + .5 * smoothstep(0., max(.06, 2. * px / 24.), cb.x);
            float s1 = mix(step(1. - amt, cw.z), step(1. - amt, cw.y), e1);                  // a facet holds snow, or is swept bare
            float bare = mix(step(cb.z, .34), step(cb.y, .34), e2), full = mix(step(.8, cb.z), step(.8, cb.y), e2);   // whole planes bare, whole planes drifted
            float sW = mix(amt, max(s1 * (1. - bare), full * step(.3, amt)), fA0) * step(.04, vD.z);
            snowV = mix(snowV, sW, westK);
          }
          if (fC > .01) {                                       // the big planes (24 x 44 m): what a wall shows from hundreds of metres
            vec3 dC;
            vec4 FC = facet(fpc / vec3(24., 44., 24.) + 7.1, dC); float wC = max(.07, 2.4 * px / 24.), bC = (1. - smoothstep(0., wC, FC.x)) * fC;
            dC = normalize(dC * vec3(1., .55, 1.));
            tiltF = (FC.yzw - .5) * vec3(1., .45, 1.) * (.5 * fC) + dC * (bC * .7);
            eF = bC * bC * max(dot(dC, Lr), 0.) * .8; crease = bC * bC * max(-dot(dC, Lr), 0.) * .8;
            k *= mix(1., .7 + .7 * FC.y, .8 * fC);
          }
          if (fA > .01) {
            vec3 dA, dB;
            vec4 FA = facet(fp / vec3(6.5, 12., 6.5) + 3.3, dA); float wA = max(.11, 2.4 * px / 6.5), bA = (1. - smoothstep(0., wA, FA.x)) * fA;
            dA = normalize(dA * vec3(1., .54, 1.));
            tiltF += (FA.yzw - .5) * vec3(1., .45, 1.) * (.45 * fA) + dA * (bA * .8);
            eF = max(eF, bA * bA * max(dot(dA, Lr), 0.)); crease = max(crease, bA * bA * max(-dot(dA, Lr), 0.));
            k *= mix(1., .74 + .6 * FA.y, .8 * fA);
            if (fB > .01) {
              vec4 FB = facet(fp / vec3(1.7, 3.2, 1.7) + 11.7, dB); float wB = max(.13, 2.4 * px / 1.7), bB = (1. - smoothstep(0., wB, FB.x)) * fB;
              dB = normalize(dB * vec3(1., .54, 1.));
              tiltF += (FB.yzw - .5) * vec3(1., .45, 1.) * (.28 * fB) + dB * (bB * .5);
              eF = max(eF, bB * bB * max(dot(dB, Lr), 0.) * .6); crease = max(crease, bB * bB * max(-dot(dB, Lr), 0.) * .6);
              k *= mix(1., .86 + .28 * FB.z, fB);
              float fD = (1. - smoothstep(.07, .18, px)) * fw;
              if (fD > .01) {                                   // chisel cuts half a metre across, for stone a few metres from the lens
                vec3 dD; vec4 FD = facet(fp / vec3(.5, .9, .5) + 5.3, dD); float wD = max(.14, 2.4 * px / .5), bD = (1. - smoothstep(0., wD, FD.x)) * fD;
                dD = normalize(dD * vec3(1., .55, 1.));
                tiltF += (FD.yzw - .5) * vec3(1., .45, 1.) * (.22 * fD) + dD * (bD * .4);
                eF = max(eF, bD * bD * max(dot(dD, Lr), 0.) * .45); crease = max(crease, bD * bD * max(-dot(dD, Lr), 0.) * .45);
                k *= mix(1., .9 + .2 * FD.z, fD);
              }
            }
          }
          k += .9 * (1. - smoothstep(0., .035, abs(jn(wq / 6.5 + 13.) - .5))) * f2 * fw;       // dark veins: thin seams of thicker stone
          vec3 Nb = N + vec3(.6, 0., -.8) * (tool * .06 * f4) + vec3(n4 - .5, 0., jn(vW * 2.1 + 9.) - .5) * (.35 * f4) + tiltF;
          N = Nb * inversesqrt(max(dot(Nb, Nb), 1e-8));
          // the ladder for near stone is far steeper than the Lit Wall's: a gorge wall is black-green mass, and only
          // what is a few metres thick toward the sun (flakes, fins, ledge lips, the arch's cut edges) glows
          float L = vD.x * k;
          float aw = fwidth(ar) * 1.5, edge = smoothstep(.87 - aw, .985, ar) * bit;      // the arete: a thin line, never under a pixel and a half
          L = mix(L, min(L, 1.3), edge);
          vec3 T = mix(uPale * 1.05, uApple * .8, smoothstep(1.2, 8., L));
          T = mix(T, uDeep * .36, smoothstep(7., 30., L));
          T = mix(T, uDark * .2, smoothstep(26., 95., L));
          float c = dot(-V, uSun), fwd = clamp(c * .5 + .5, 0., 1.), phase = .35 + .65 * fwd * fwd * fwd;
          float nds = dot(N, uSun), back = 1. - smoothstep(-.25, .35, nds);
          float shut = 1. - vE.w;                              // rock (its own or a wall across the gorge) between here and the sun
          vec3 col = min(uSunCol * T * phase * .7, vec3(1.25)) * mix(shut, 1., back) * mix(1., ao, .5);
          // bare to the sun: plain dark waxy stone, never pale
          col += mix(uDark * 2.4, uDeep * .62, .3 + .4 * n2 * f2) * uSunCol * max(nds, 0.) * (1. - shut) * .42 * ao * (1. + 1.3 * strata);
          float hemi = N.y * .5 + .5, lam = max(dot(N, uLamp), 0.) * vE.z;
          col += (uDark * (1.4 + 2. * hemi) * (1. + .9 * vein) * (1. + 1.1 * strata) * uFloor + uSkyCol * .045 * hemi * hemi) * mix(1., ao, .8);
          col += uDeep * (.45 + .5 * vein) * uLampCol * lam * (.2 + .06 * bit) * ao;
          col += uApple * vein * (.035 + .1 * bit * phase) * (.4 + .6 * ao);   // cloudy inclusions hanging inside the stone
          // the Gate Horn's crest (its vertices carry aS.x = -5000 and the glow in aS.w): the light burns through the thin stone
          col += min(uSunCol * mix(uApple, uPale, .8) * (step(vS.x, -4000.) * vS.w * 1.3), vec3(1.45));
          // one broad waxy highlight from the sky
          vec3 Ls = normalize(uLamp * vE.z + vec3(0., 1., 0.)), Hh = Ls + V; Hh *= inversesqrt(max(dot(Hh, Hh), 1e-6));
          float nh = max(dot(N, Hh), 0.), nh2 = nh * nh, nh8 = nh2 * nh2 * nh2 * nh2;
          float fres = .05 + .95 * pow(clamp(1. - max(dot(N, V), 0.), 0., 1.), 4.);
          float gl = mix(.1, 1., vE.z);                        // the gorge sees a slot of sky: a faint broad matt sheen, no glint
          col += uSkyCol * (nh8 * nh8 * .4 * gl + nh2 * nh2 * .07 + fres * .1 * hemi * gl) * ao;
          col += uSunCol * T * pow(clamp(1. - max(dot(N, V), 0.), 0., 1.), 3.) * smoothstep(-.2, .5, c) * .5 * mix(shut, 1., back);   // thin edges glow along the rim
          // every edge between two facets is thin stone: it catches a rim of the backlight (most where we look toward the sun and
          // where the place is open to the Lit Wall), and the cut beside it lies in shade; a wet sheen where a facet mirrors the sky
          col *= 1. - .34 * crease;
          col += uSunCol * mix(uApple, uPale, .35) * eF * (.035 + .3 * fwd * fwd * fwd) * mix(.3, 1., vE.z) * mix(.5, 1., ao);
          col += (uSkyCol * 1.6 + uLampCol * .5 * vE.z) * nh8 * nh8 * nh8 * nh8 * nh8 * nh8 * .55 * gl * ao * fA;

          // ---- cover: matt things lit by the sky from above and the wall from the side
          vec3 amb = uSkyCol * (.55 + .9 * hemi) + uLampCol * (.09 + 1.25 * lam);
          vec3 ambS = mix(amb, vec3(dot(amb, vec3(.3, .5, .2))), .62); amb = mix(amb, vec3(dot(amb, vec3(.3, .5, .2))), .5);
          float cob = .5;
          if (scrK > .01) {
            // scree: cobbles lying apart on smaller stones on gravel; each a crisp angular cell with its own tilt, lit from the wall
            vec2 sp = vW.xz + vW.y * vec2(.31, .23);
            vec3 Lw2 = normalize(uLamp * (.35 + .65 * vE.z) + vec3(0., .55, 0.));
            vec4 a1 = stoneLayer(sp + 3.1, 1.25, pxs, Lw2, .62), a2 = stoneLayer(sp + 7.3, 3.7, pxs, Lw2, .8), a3 = stoneLayer(sp, 10.5, pxs, Lw2, .9);
            vec3 alb = vec3(.05, .066, .055) * (.7 + .6 * n4);                                 // grit between the stones
            alb = mix(alb, a3.xyz, a3.w); alb = mix(alb, a2.xyz * (.9 + .2 * n4), a2.w); alb = mix(alb, a1.xyz * (.85 + .3 * n4), a1.w);
            cob = max(a1.w, a2.w * .7);
            col = mix(col, alb * amb * ao * 1.6, scrK * .96);
          }
          // the herd's terrace: a pale slab crusted with lichen, short dry sedge gold-green in its joints, lit by the wall
          float terK = smoothstep(455., 460., vS.x) * (1. - smoothstep(514., 523., vS.x)) * smoothstep(8.6, 10.2, vS.y) * (1. - smoothstep(mix(29., 24., smoothstep(490., 510., vS.x)), mix(34., 28., smoothstep(490., 510., vS.x)), vS.y)) * smoothstep(.7, .88, N.y);
          if (terK > .01) {
            float turf = smoothstep(.4, .62, jn(vec3(vW.xz * .8, 3.)) * .6 + n4 * .4), fleck = jn(vec3(vW.xz * 7., 1.));
            vec3 alb = mix(vec3(.3, .36, .27), vec3(.47, .41, .16), turf) * (.78 + .44 * mix(.5, fleck, f4));
            alb = mix(alb, vec3(.5, .2, .08), smoothstep(.72, .8, jn(vec3(vW.xz * .45 + 9., 7.))) * .6);
            col = mix(col, alb * amb * ao * 1.45, terK);
          }
          float rd = smoothstep(.4, .6, vE.y + (n2 - .5) * .6 + (n4 - .5) * .3 * f3) * (1. - terK);
          if (rd > .01) {
            vec3 alb = mix(uRind * .2, uRind * .62, n4 * .6 + jn(vW * .37) * .4);
            alb = mix(alb, uAccent, smoothstep(.7, .8, jn(vW * 1.3 + 7.)) * f3 * .8);
            col = mix(col, alb * amb * ao * 1.35, rd);
          }
          float sw = .05 + min(px * .12, .1);
          float sn = smoothstep(.5 - sw, .5 + sw, snowV + (n2 - .5) * .34 * f2 + (n4 - .5) * .3 * f3 + (.5 - cob) * .26 * f3 * smoothstep(0., .25, scrK));
            // wind-carved snow: on level snow sastrugi are terraces drawn out along the wind (2:1, they lead the eye to the arch),
            // each ending in a sharp step that is bump-lit from the wall and carries a thin line of shade at its foot; on steep
            // banks, where anything drawn out smears, only small even scallops show
          vec2 wd = normalize(uWind.xz + vec2(1e-4, 0.));
          float al = dot(vW.xz, wd), ac = dot(vW.xz, vec2(-wd.y, wd.x));
          float bank = smoothstep(.6, .84, N.y);
          // drift waves lying ACROSS the wind, as ripples lie in sand: the phase runs along the wind, warped so the crest lines waver,
          // fork and join; each wave a long gentle back (0 in the trough .. 1 on the crest line) and a short steep lee face
          float w0 = jn(vec3(ac * .11, al * .06, 9.)), wv = jn(vec3(ac * .19, al * .09, 3.)), wf = jn(vec3(ac * .6 + 4., al * .3, 5.));
          // (each pattern gives way to its mean where its phase runs more than a third of a turn per pixel: at a glancing angle it
          // would break into blocks)
          float ph1 = al / 3.6 + wv * 2.8 + wf * .5, fph = fwidth(ph1), kph = 1. - smoothstep(.05, .17, fph);
          float kw = (1. - smoothstep(.3, .9, px)) * bank * kph, pw = min(max(px * .6, fph * 1.7), .2), kb = (1. - smoothstep(.1, .34, px)) * kph;
          float f1s = fract(ph1), t1 = mix(.5, min(f1s / .78, (1. - f1s) / .22), kw);
          // and the small sharp-nosed sastrugi cut into their backs (even scallops on a steep bank)
          float w2 = mix(jn(vec3(ac * 1.1 + w0 * 2., al * 1.1, 5.)), jn(vec3(ac * 1.3 + wv * 2.6, al * .85 + w0 * 3., 7.)), bank), w3 = jn(vec3(ac * 4.2 + w2 * 1.7, al * 2.9, 11.));
          float fw2 = fwidth(w2), fw3 = fwidth(w3), k2 = 1. - smoothstep(.1, .3, fw2), k3 = 1. - smoothstep(.1, .3, fw3);
          float e2 = max(px * 5., fw2 * 2.), e3 = max(px * 9., fw3 * 1.6);          // (no edge thinner than four pixels: a thin near-level line would break into steps)
          float t2 = mix(.5, smoothstep(.5 - e2, .54 + e2, w2), k2), t3 = mix(.5, smoothstep(.5 - e3, .58 + e3, w3), k3);
          float hS = mix(.5, t1, kb) * .62 + t2 * .24 * mix(.45, 1., kb) + t3 * .1 * f4 + w0 * .1 + w2 * .06 * f3;
          float lee = smoothstep(.775 - pw, .81 + pw, f1s) * (1. - smoothstep(.9 - pw, 1., f1s)) * kw * 1.25 * (1. - smoothstep(.2, .7, px) * .5) + t2 * (1. - t2) * 2. * f3;         // the lee face of each wave, the foot of each step
          vec3 dpx = dWx, dpy = dWy; float dhx = dFdx(hS), dhy = dFdy(hS);
          // on the col: the long shadows the avenue's blades throw across the snow, away from the Lit Wall (green, the light
          // having come through them), and the trails the blue sheep have trodden to the gate
          float shB = 0.; vec4 trk = vec4(0.);
          if (vS.x > 640.) {
            vec2 sd = uGate.xy, sp2 = vec2(-uGate.y, uGate.x);
            for (int i = 0; i < 20; i++) {
              vec4 b = uBl[i]; vec2 d = vW.xz - b.xy; float t = dot(d, sd) / max(b.z * uGate.z, 1.), soft = .1 + .8 * t;
              shB = max(shB, (1. - smoothstep(b.w * (1. - .8 * t) + .15 - soft * .5, b.w * (1. - .8 * t) + .15 + soft, abs(dot(d, sp2)))) * smoothstep(-.02, .02, t) * (1. - smoothstep(.8, 1., t)) * (1. - .3 * t));
            }
            float gk = 1. - smoothstep(${(ve-50).toFixed(1)}, ${(ve-8).toFixed(1)}, vS.x);
            trk = (trail(vS.x, vS.y, 1.3, 4.4, 1.05, gk, px) + trail(vS.x, vS.y, 4.1, 5.4, 1.2, gk, px) + trail(vS.x, vS.y, 2.6, 3., 1.7, gk, px)) * smoothstep(664., 692., vS.x) * (1. - smoothstep(${(ve+4).toFixed(1)}, ${(ve+12).toFixed(1)}, vS.x));
          }
          if (sn > .01) {
            vec3 r1 = cross(dpy, vN), r2 = cross(vN, dpx); float det = dot(dpx, r1);
            vec3 grad = (r1 * dhx + r2 * dhy) * (sign(det) / max(abs(det), 1e-7)) * length(vN);
            float gl = length(grad); grad *= min(1., 2.2 / max(gl, 1e-4));
            vec3 Ns = N - grad * mix(.3, .55, bank) * mix(.5, 1., kb); Ns *= inversesqrt(max(dot(Ns, Ns), 1e-8));
            vec3 Lw = normalize(uLamp + vec3(0., .15, 0.));
            float lit = smoothstep(-.05, .55, dot(Ns, Lw)), up2 = Ns.y * .5 + .5;
            vec3 sc = uSnowCol * (uSkyCol * (.8 + 1.1 * up2) + (uLampCol * lit * .9 * mix(.3, 1., vE.z) + uLampCol * .1) * (1. - .92 * shB) + uApple * uLampCol * .34 * shB);
            sc = mix(sc, vec3(dot(sc, vec3(.3, .5, .2))), .35) * mix(.72, 1., ao);
            sc *= .76 + .2 * t1 + .09 * t2 + .1 * w0;                                        // wind-packed crests paler than the scoured troughs
            sc = mix(sc, sc * vec3(.74, .93, 1.06), (1. - t1) * .5);
            sc = mix(sc, sc * vec3(.6, .79, .98), min(lee, 1.) * .7);                         // lee faces in blue shade: crisp lines across the wind
            // spindrift snakes crossing the snow (short puffs: nothing drawn out along the line of sight)
            float snake = smoothstep(.45, .78, jn(vec3(ac * .22, al * .16 - uTime * .9, 1.7))) * jn(vec3(ac * .9, al * .55 - uTime * 2.6, 4.)) * smoothstep(.35, .7, jn(vec3(vW.xz * .03 - uTime * .12, 8.)));
            sc += uSnowCol * (uSkyCol + uLampCol * .8) * snake * (.5 + .9 * uGale) * f2;
            // the trodden trail: a shallow trough, a print every stride, each with its far wall lit by the Lit Wall
            vec2 lap = vec2(dot(uLamp.xz, uAxS.zw), dot(uLamp.xz, vec2(-uAxS.w, uAxS.z)));
            sc *= mix(vec3(1.), vec3(.4, .74, .6), shB);
            sc *= 1. - .3 * min(trk.w, 1.) - .3 * min(trk.z, 1.);
            sc += uSnowCol * uLampCol * (.36 * max(-dot(trk.xy, lap), 0.) - .2 * max(dot(trk.xy, lap), 0.));
            col = mix(col, max(sc, 0.), sn);
          }
          col *= mix(vec3(1.), vec3(.5, .78, .64), shB * (1. - sn));
          // ---- water, drawn on the ground it lies on: the braided outflow, then the tarn
          if (vS.z > .002) {
            float A = vS.x, qd = vS.y - vS.w, B = smoothstep(212., 240., A) * (1. - smoothstep(330., 368., A));
            float d1 = abs(qd - B * 5. * sin(A * .052 + 1.)) - (1.5 + .5 * sin(A * .11));
            float d2 = abs(qd - B * (1.5 - 4.4 * sin(A * .047 + 2.6))) - (1.05 + .4 * sin(A * .17 + 1.));
            float d3 = abs(qd - B * (7.5 * sin(A * .031 + 4.2) - 1.)) - (.85 + .3 * sin(A * .21 + 2.));
            float d = min(d1, min(d2, d3)) + (n4 - .5) * .7 * f3 + (n2 - .5) * .8 * f2;
            float wpx = px * 1.2, water = (1. - smoothstep(-wpx, wpx, d)) * vS.z;
            col *= 1. - .5 * (1. - smoothstep(0., 1.6, d)) * vS.z;                              // wet gravel along the channels
            // glacier milk: pale jade pools with slow flow lines in them, white water only where the bed steepens into a riffle
            float kf = 1. - smoothstep(.5, 1.8, px), kn = 1. - smoothstep(.12, .5, px);
            float rif = smoothstep(.48, .68, jn(vec3(A * .11, floor(qd * .2 + 9.), 7.))), fl = jn(vec3(A * .3 + uTime * 1.3, qd * 3.4, 2.));
            float fo = smoothstep(.5, .78, jn(vec3(A * .8 + uTime * 3.4, qd * 4.5, 4.)) * .65 + jn(vec3(A * 2.3 + uTime * 5., qd * 9., 6.)) * .35 * kn + .18 * rif);
            float white = clamp(mix(.1 + .2 * rif, fo * (.22 + .78 * rif), kf) + smoothstep(-.45, -.05, d) * .3, 0., 1.);
            vec3 pool = vec3(.15, .4, .33) * (uSkyCol * 1.5 + uLampCol * .8) * (.82 + .36 * mix(.5, fl, kf));
            vec3 wcol = mix(pool, uSkyCol * 2.4 + uLampCol * .9, white);
            col = mix(col, wcol * mix(1., ao, .5), water);
          }
          float Tn = -9.;
          if (vS.x > 356. && vS.x < 480.) {
            float A = vS.x, P = vS.y, da = (A - 414.) / (A > 414. ? 38. : 48.), dp = (P - 6. - 5. * sin(A * .045 + 1.)) / (30. * (1. + .16 * sin(A * .13 + 2.))), ia = A - 437., ip = P - 14.;
            Tn = 1. - da * da - dp * dp + .13 * sin(A * .21 + P * .17) + .08 * sin(P * .45 - A * .11 + 1.7) - 1.5 * exp(-(ia * ia + ip * ip) / 13.);
          }
          if (Tn > -.3) {
            float eT = Tn + (n4 - .5) * .035 * f3, wat = smoothstep(-px * .07, px * .07, eT), deep = smoothstep(0., .5, Tn);
            col *= 1. - .45 * smoothstep(-.3, -.02, Tn);                                        // the wet beach
            col = mix(col, uPale * amb * .55, (1. - smoothstep(0., .02 + px * .07, abs(eT + .012))) * .5);   // a pale line of silt at the water's edge
            // ripples, and cat's-paws of wind crossing the water
            vec2 rp = vW.xz * .5 + uWind.xz * uTime * .7;
            float gust = smoothstep(.42, .8, jn(vec3(vW.xz * .07 - uWind.xz * uTime * .4, 4.)));
            vec2 rn = (vec2(jn(vec3(rp, uTime * .3)), jn(vec3(rp + 31., uTime * .3))) - .5) * (.03 + .1 * gust) * (1. - smoothstep(.4, 2.5, px))
                    + (vec2(jn(vec3(rp * 3.3 + 7., uTime * .7)), jn(vec3(rp * 3.3 + 19., uTime * .7))) - .5) * (.02 + .06 * gust) * f3;
            vec3 Nw = normalize(vec3(rn.x, 1., rn.y)), R = reflect(-V, Nw); R.y = abs(R.y);
            // the mirror is drawn tall (the reflected ray steepened), so the whole Lit Wall stands in the tarn from where we fly
            vec3 Rm = normalize(vec3(R.x, R.y * 3. + .015, R.z));
            vec3 refl = mix(mix(uHor, uMid, smoothstep(-.01, .2, Rm.y)), uZen, smoothstep(.16, .8, Rm.y));
            float den = -dot(Rm, uWallN);
            if (den > .03) {
              vec3 Hp = vW + Rm * (dot(vW - uWallC, uWallN) / den);
              float sx = dot(Hp - uWallC, uWallT), cr = (sx - uCrestS.x) / uCrestS.y, cs = clamp(cr, 0., 23.999); int ci = int(cs);
              float cy = mix(uCrest[ci], uCrest[ci + 1], cs - float(ci)), fh = (Hp.y - uCloudY) / max(cy - uCloudY, 1.);
              float flute = .5 + .5 * sin(sx * .05 + 4. * jn(vec3(sx * .004, fh * 2., 1.)));
              vec3 wc = mix(uDark * 1.5, uDeep * .5, smoothstep(.04, .36, fh));
              wc = mix(wc, uApple * (uLampCol + .25) * 1.05, smoothstep(.3, .58, fh));
              wc = mix(wc * (.72 + .28 * flute), uPale * (uLampCol * .8 + .32) * (.7 + .3 * flute), smoothstep(.74, .95, fh));
              refl = mix(refl, wc, (1. - smoothstep(.97, 1.02, fh)) * smoothstep(-.02, .02, fh) * smoothstep(-.3, .3, cr) * (1. - smoothstep(23.7, 24.3, cr)));
            }
            float sg = max(dot(Rm, uSun), 0.), sg4 = sg * sg * sg * sg, sg16 = sg4 * sg4 * sg4 * sg4;
            refl += uSunCol * (sg16 * sg16 * sg16 * .5 + sg16 * .1);                             // the hidden sun's bloom, a glitter in the water
            float frW = mix(.6, 1., pow(1. - clamp(dot(V, Nw), 0., 1.), 2.));
            vec3 body = mix(vec3(.2, .46, .35), vec3(.025, .12, .095), deep) * (uSkyCol * 1.4 + uLampCol * .75);   // milky jade in the shallows, deep jade further out
            vec3 wc2 = mix(body, refl, frW * mix(.45, 1., deep)) + (uSkyCol * .5 + uLampCol * .2) * gust * .1;
            col = mix(col, wc2, wat);
          }
          // cloud laps round the foot of every blade that stands in the sea: the sink into it is taller and it moves
          vec3 wa = vW; wa.y -= bit * (5.5 + 5. * jn(vec3(vW.xz / 7., uTime * .22)));
          gl_FragColor = vec4(max(atmos(col * veil(vW), wa, dist, vE.x), 0.), 1.);
        }`}),aa=new c.Mesh(De,oo);aa.name="land",J.add(aa),await T.yield();let Ve=[],pt=[],mt=[],gt=[];const ko=[Ve,pt,mt,gt],na=[[],[],[],[]],sa=[[],[],[],[]],ao=e=>{[Ve,pt,mt,gt]=e},ra=[[0,.5,1],[0,.16,.5,.84,1],[0,.08,.24,.5,.76,.92,1]],Me=(e,t,o,a,n,s,r,p,u,v={})=>{const i=v.rng||te,l=ra[s],f=l.length,d=v.nf??i.int(3,5),g=Ve.length/3,h=i.range(0,100),m=v.la??i.range(0,6.28),y=v.sq??i.range(.5,.8),b=v.qa??i.range(0,3.14),M=Math.cos(b),z=Math.sin(b),A=v.tw??i.range(-.4,.4),V=v.ledges??2,k=v.snow??.7,j=v.hollow??.14,F=v.thick??58,x=[],S=[];for(let W=0;W<d;W++)x.push(i.range(.74,1.2)),S.push(i.range(.55,1.6));const L=i.range(0,6.28),q=(v.chisel??.34)*n,G=v.shoulder??i.range(.62,.76),D=v.waist??i.range(.5,.64),U=v.ledgeLo??.1,K=[],le=[];for(let W=0;W<=r;W++)K.push([W/r,0,-1]);for(let W=0;W<V;W++){const P=C(U,G*1.04,(W+.5+i.range(-.22,.22))/V),R=i.range(.02,.032)*(v.groove??1);le.push(i.range(0,6.28)),K.push([P-R*1.7,0,-1],[P-R,1,W],[P-.004,2,W],[P,3,W],[P+.012,4,W],[P+R,0,-1])}K.sort((W,P)=>W[0]-P[0]);const ne=K.length,B=d*f;for(let W=0;W<ne;W++){const P=X(K[W][0],0,1),R=K[W][1],fe=K[W][2],ye=W===ne-1,Kt=P<G?C(1,D,Math.pow(P/G,.8)):D*(1-Math.pow((P-G)/(1-G),1.35)),An=n*(Kt*(.9+.1*Math.cos(P*7+h))+.008),kn=t+a*P,Sa=w(G,1,P),Ca=u*a*P*P,Sn=e+Math.cos(m)*Ca+Math.cos(L)*q*Sa,Cn=o+Math.sin(m)*Ca+Math.sin(L)*q*Sa,Fn=v.grade?v.grade[1]+v.grade[0]*Math.pow(1-P,2.2):C(F,8,w(.74,1,P));for(let mo=0;mo<B;mo++){const Qt=Math.floor(mo/f),Yt=l[mo%f],$t=(Qt+Yt)/d*6.2832+A*P,it=Math.abs(Yt-.5)*2,Vn=Math.cos(Math.PI/d)/Math.cos((Yt-.5)*2*Math.PI/d)*C(x[Qt],x[(Qt+1)%d],Yt)*(1-j*(1-it*it));let Fa=1,Le=0;fe>=0&&(Le=v.ring?1:w(-.35,.3,Math.cos($t-le[fe])),Fa=R===1?1-.13*Le:R===2?1-.17*Le:R===3?1+.06*Le:1+.01*Le);const Va=ye?.04:An*Vn*Fa*(1+.05*I.n3(Math.cos($t)*1.3+h,P*4.2,Math.sin($t)*1.3)),Ta=Math.cos($t)*Va,ja=Math.sin($t)*Va*y;Ve.push(Sn+Ta*M-ja*z,kn,Cn+Ta*z+ja*M);let ze=1.4+Fn*C(S[Qt],S[(Qt+1)%d],Yt)*(1-it*it*it),Wa=(.55+.45*w(0,.4,P))*(.78+.22*it),Ro=P>.95?.75*k:0;R===1||R===2?(ze=C(ze,Math.max(ze,40),Le),Wa*=1-.4*Le):R===3?ze=C(ze,Math.min(ze,3),Le):R===4&&(ze=C(ze,Math.min(ze,9),Le),Ro=Math.max(Ro,k*.98*w(.3,.7,Le)*(v.shelf??1))),pt.push(ze,Wa,Ro,-(.02+.98*it*(v.grade?C(.66,1,w(.3,.8,P)):1))),mt.push(p,0,v.lamp??1,Math.exp(-ze/5))}}for(let W=0;W<ne-1;W++)for(let P=0;P<B;P++){if(P%f===f-1)continue;const R=g+W*B+P,fe=R+1,ye=R+B,Kt=fe+B;gt.push(R,ye,fe,fe,ye,Kt)}},ia=(e,t,o,a,n,s,r,p,u={},v=0)=>{const i=u.rng||te;for(let l=0;l<s;l++){const f=p===null?i.range(0,6.28):p+i.range(-1.1,1.1),d=n*i.range(.75,1.15),g=e+Math.cos(f)*d,h=o+Math.sin(f)*d,m=v+(a-v)*i.range(.32,.6);if(N.distanceTo(g,t+m*.6,h)<13){i(),i();continue}Me(g,t,h,m,n*i.range(.4,.56),1,8,r,.16,{la:f,ledges:1,nf:i.int(3,4),ledgeLo:v/m+.1,...u})}},no=[];{const e=new c.Vector3,t=te.fork("pinnacles"),o=te.fork("pinnacle-shapes");let a=t.chance(.5)?1:-1;for(let r=0;r<14;r++){const p=350+r*11.5+t.range(-3,3),u=Math.exp(-Math.pow((p-414)/56,2)),v=a<0,i=r<9;a=-a;const l=i&&v,f=l?6:34,d=l?-t.range(30,40)-12*u:(v?-1:1)*((v?56+14*u:62+26*u)+t.range(6,i?26:80)),g=l?t.range(5,7.5):t.range(8,12.5),h=(l?t.range(22,42):v?t.range(28,56):t.range(11,24))+f,m=t.range(0,.07),y=t.range(-.5,.5);E(p,d,e);const b=l?_(e.x,e.z)-f:Y-f;N.distanceTo(e.x,b+f+8,e.z)<15+g||l&&et(p,d)>-.3||(l||no.push({x:e.x,z:e.z,top:b+h,r:g,near:!0}),Me(e.x,b,e.z,h,g,2,14,l?0:1,m,{rng:o,snow:de?1:0,ledges:3,ledgeLo:f/h+.1,thick:l?62:84,la:Math.atan2(oe.y*Math.sign(d),oe.x*Math.sign(d))+y,chisel:.2}),ia(e.x,b,e.z,h,g,2,l?0:1,null,{rng:o,snow:de?.8:0,thick:l?50:66},f),await T.yield())}const n=te.fork("cairns"),s=[[236,0,1],[262,0,-1],[287,0,1],[312,0,-1],[350,24,0],[372,36,0],[398,43,0],[423,45,0],[437,14,0],[448,41,0],[400,-31,0],[432,-33,0],[462,-22,0],[492,30,0]];for(const[r,p,u]of s){const v=r+(r===437?0:n.range(-3,3)),i=u?Ee(v)+u*(8*tt(v)+5.5+n.range(0,3)):p;E(v,i,e);const l=_(e.x,e.z),f=n.range(3.4,5.8),d=n.range(.95,1.5);if(!(N.distanceTo(e.x,l+f,e.z)<6.5||r!==437&&et(v,i)>-.06)){Me(e.x,l-.8,e.z,f+.8,d,0,5,0,n.range(0,.05),{rng:n,nf:n.int(4,5),ledges:3,ledgeLo:.22,groove:2.4,ring:1,shoulder:.8,waist:.76,snow:0,thick:7,hollow:.1,chisel:.12,sq:n.range(.8,.95)});for(let g=0;g<2;g++){const h=n.range(0,6.28),m=d*n.range(1.5,2.3),y=e.x+Math.cos(h)*m,b=e.z+Math.sin(h)*m,M=Lt(y,b),z=f*n.range(.4,.62),A=d*n.range(.5,.7);N.distanceTo(y,l+2,b)<6.5||et(M,yo(y,b)-ue(M))>-.04||Me(y,_(y,b)-.6,b,z+.6,A,0,4,0,.04,{rng:n,nf:4,ledges:1,ledgeLo:.25,groove:2.4,ring:1,shoulder:.78,waist:.76,snow:0,thick:6,chisel:.1})}}}await T.yield();{const r=te.fork("shards"),p=(v,i,l,f,d,g)=>{E(v,i,e);const h=_(e.x,e.z);if(h<Y+4||N.distanceTo(e.x,h+l*.55,e.z)<11+f||v>356&&v<470&&et(v,i)>-.1){r(),r();return}Me(e.x,h-2.5,e.z,l+2.5,f,1,6,0,d,{rng:r,nf:r.int(3,4),sq:r.range(.42,.6),tw:r.range(-.15,.15),la:g,ledges:0,snow:0,grade:[100+3*l,6.5],shoulder:.42,waist:.74,chisel:.26,hollow:.2})},u=v=>Math.atan2(ee.y*Math.cos(v)+oe.y*Math.sin(v),ee.x*Math.cos(v)+oe.x*Math.sin(v));for(const[v,i,l]of[[398,41,15],[415,46.5,12],[434,45,17],[452,41,11],[386,-19,15],[405,-28,12],[305,23.2,21],[318,23.6,15],[331,23.4,23],[344,22.6,14],[311,-17.6,13]]){const f=i>0?Math.PI/2:-Math.PI/2;p(v,i,l*r.range(.9,1.15),l*r.range(.1,.135),r.range(.03,.1),u(f+r.range(-.7,.7)));for(let d=0;d<3;d++){const g=f+r.range(-1.9,1.9),h=r.range(2.4,4.8),m=l*r.range(.3,.66);p(v+Math.cos(g)*h,i+Math.sin(g)*h,m,m*r.range(.11,.16),r.range(.08,.2),u(g))}}}await T.yield();for(let r=0;r<16;r++){if((r&3)===0&&await T.yield(),E(t.range(380,760),(t.chance(.7)?1:-1)*t.range(150,700),e),_(e.x,e.z)>Y-8)continue;const p=t.range(60,110);no.push({x:e.x,z:e.z,top:Y-40+p,r:13}),Me(e.x,Y-40,e.z,p,t.range(10,19),0,7,1,t.range(0,.1),{ledges:1,ledgeLo:40/p+.15,thick:70})}}{const e=new c.Vector3,t=te.fork("flakes"),o=Math.atan2(ee.y,ee.x);ao(na);for(let a=0;a<52;a++){const n=-34+a*6.2+t.range(-2.5,2.5),s=a&1?1:-1,r=C(38,19,w(215,300,n)),p=s*(r+t.range(4,24)),u=t.range(10,24),v=t.range(3,5.2);E(n,p,e);const i=_(e.x,e.z);if(n>284||N.distanceTo(e.x,i+u*.5,e.z)<17+v){t();continue}Me(e.x+oe.x*s*1.5,i-6,e.z+oe.y*s*1.5,u+6,v,1,7,0,.12,{nf:4,sq:t.range(.4,.55),qa:o+t.range(-.35,.35),tw:.12,la:Math.atan2(-oe.y*s,-oe.x*s),ledges:0,snow:0,lamp:0,grade:[90,1.5],shoulder:.5,waist:.72,chisel:.22}),(a&7)===7&&await T.yield()}ao(ko)}const So=[],xe=N.endTangent.clone().setY(0).normalize(),pe=new c.Vector3(-xe.z,0,xe.x),so=se.y-11,ro=1.35;for(const e of[-1,1]){await T.yield();const t=se.clone().addScaledVector(pe,e*27.5).addScaledVector(xe,4.5),o=_(t.x,t.z)-3,a=Math.atan2(pe.z*e,pe.x*e);Me(t.x,o,t.z,e<0?47:40,9,2,16,0,.05,{ledges:3,snow:1,sq:.74,thick:48,hollow:.2,ledgeLo:.16,chisel:.2}),ia(t.x,o,t.z,e<0?47:40,10,3,0,a,{snow:1,thick:40}),So.push([t.x,t.z,e<0?44:37,5.5])}await T.yield();{const e=N.pointAt(.6),t=te.fork("ranges");for(let o=0;o<3;o++){const a=[3300,4500,5900][o],n=[620,800,1e3][o],s=150,r=Ve.length/3,p=t.range(0,50);for(let u=0;u<=s;u++){const v=u/s*6.2832,i=Math.cos(v),l=Math.sin(v),f=Y+n*(.45+.75*I.ridged2(i*2.6+p,l*2.6+o*9,4)+.12*I.n2(i*9+p,l*9)),d=a*(1+.05*I.n2(i*3+7,l*3+p));for(let g=0;g<4;g++){const h=g/3;Ve.push(e.x+i*d*(1-.1*h),C(Y-60,f,h),e.z+l*d*(1-.1*h)),pt.push(C(700,6,Math.pow(h,.6)),.6+.4*h,w(.75,1,h)*(de?.9:.62),0),mt.push(1,0,1,0)}}for(let u=0;u<s;u++)for(let v=0;v<3;v++){const i=r+u*4+v,l=i+4;gt.push(i,l,i+1,l,l+1,i+1)}await T.yield()}}ao(sa);const la=[],Co=[],Fo=585;{const e=new c.Vector3,t=jt.fork("avenue"),o=Math.atan2(pe.z,pe.x),a=(n,s,r,p)=>{E(n,s,e);const u=_(e.x,e.z),v=r*t.range(.105,.135),i=t.range(.02,.07),l=Math.atan2(oe.y*Math.sign(s),oe.x*Math.sign(s))+t.range(-.6,.6),f=t.chance(.65),d=t.range(0,6.28),g=t.range(1.4,2.1),h=t.range(.28,.45);if(N.distanceTo(e.x,u+r*.5,e.z)<8.5+v*.6)return;Me(e.x,u-2.5,e.z,r+2.5,v,1,7,0,i,{rng:t,nf:t.int(3,4),sq:t.range(.4,.52),qa:o+t.range(-.45,.45),tw:t.range(-.12,.12),la:l,ledges:0,snow:0,grade:[24+1.3*r,2.4],shoulder:.4,waist:.78,chisel:.24,hollow:.22}),p&&la.push([e.x,e.z,r,v]);const m=e.x+Math.cos(d)*v*g,y=e.z+Math.sin(d)*v*g;f&&N.distanceTo(m,u+3,y)>10&&Me(m,_(m,y)-1.5,y,r*h+1.5,v*.5,1,5,0,.1,{rng:t,nf:3,sq:.5,qa:o+t.range(-.6,.6),tw:0,la:d,ledges:0,snow:0,grade:[20,2.4],shoulder:.4,waist:.78,chisel:.24,hollow:.2})};for(const[n,s,r]of[[722,12.5,0],[746,13,0],[746,-12.5,0],[770,12.5,0],[770,-13.5,0],[796,13.5,0],[792,-12.5,0],[841,17,0],[832,-17,0],[713,21,2],[731,22,1],[760,23,1],[781,22,1],[812,24,1],[713,-28,1],[731,-23,1],[755,-22,1],[781,-23.5,1],[802,-22,1]])a(n+t.range(-.8,.8),s+t.range(-.7,.7),r===1?t.range(18,24):r?t.range(11,13):t.range(12,16.5),s>0||n>745&&!r);await T.yield();{const n=jt.fork("needles-eye"),s=E(600,-20,new c.Vector3),r=E(600.5,30,new c.Vector3);s.y=_(s.x,s.z)-4,r.y=_(r.x,r.z)-4;const p=new c.Vector3().subVectors(r,s).setY(0),u=new c.Vector3(-p.z,0,p.x).normalize(),v=50,i=36,l=[],f=n.range(0,50);for(let A=0;A<=i;A++){const V=A/i,k=Math.sin(Math.PI*V),j=.5-.5*Math.cos(Math.PI*V)+.045*Math.sin(2*Math.PI*V),F=2.4*Math.sin(Math.PI*V*2+.8)*k;l.push([s.x+p.x*j+u.x*F,C(s.y,r.y,j)+v*Math.pow(k,.6)*(1+.04*Math.sin(V*9+f)),s.z+p.z*j+u.z*F,C(8.5,4.2,Math.pow(k,.6))*(1+.24*I.n2(V*6+f,7.7)+.12*I.n2(V*17+f,2.2)),k])}const d=5,g=ra[1],h=g.length,m=d*h,y=Ve.length/3,b=new c.Vector3,M=new c.Vector3,z=[];for(let A=0;A<d;A++)z.push(n.range(.7,1.3));for(let A=0;A<=i;A++){const V=l[A],k=l[Math.max(A-1,0)],j=l[Math.min(A+1,i)];b.set(j[0]-k[0],j[1]-k[1],j[2]-k[2]).normalize(),M.crossVectors(u,b).normalize();for(let F=0;F<m;F++){const x=Math.floor(F/h),S=g[F%h],L=(x+S-.5)/d*6.2832+.3*Math.sin(A*.19+f),q=Math.abs(S-.5)*2,G=V[3]*Math.cos(Math.PI/d)/Math.cos((S-.5)*2*Math.PI/d)*(1-.13*(1-q*q))*(1+.1*I.n3(Math.cos(L)*1.3+f,A*.3,Math.sin(L)*1.3)),D=Math.cos(L)*G,U=Math.sin(L)*G*.72;Ve.push(V[0]+M.x*D+u.x*U,V[1]+M.y*D,V[2]+M.z*D+u.z*U);const K=1.2+(16+V[3]*V[3]*1.9+90*Math.pow(1-V[4],2.5))*C(z[x],z[(x+1)%d],S)*(1-q*q*q),le=x===0?w(.4,.8,M.y)*(1-w(.7,.95,q)):0;pt.push(K,(.5+.5*w(0,.3,V[4]))*(.8+.2*q)*(Math.cos(L)<-.3?.78:1),.95*le,0),mt.push(0,0,1,Math.exp(-K/5))}}for(let A=0;A<i;A++)for(let V=0;V<m;V++){if(V%h===h-1)continue;const k=y+A*m+V,j=k+1,F=k+m,x=j+m;gt.push(k,j,F,j,x,F)}for(const[A,V,k]of[[s,3,0],[r,3,1]])for(let j=0;j<V;j++){const F=(k?Math.atan2(oe.y,oe.x):Math.atan2(ee.y,ee.x))+n.range(-1.1,1.1),x=n.range(8,12),S=A.x+Math.cos(F)*x,L=A.z+Math.sin(F)*x,q=n.range(8,17);Me(S,_(S,L)-2.5,L,q+2.5,q*n.range(.11,.15),1,6,0,n.range(.08,.2),{rng:n,nf:n.int(3,4),sq:n.range(.42,.6),qa:n.range(0,3.14),tw:n.range(-.15,.15),la:F,ledges:0,snow:0,grade:[100+3*q,6.5],shoulder:.42,waist:.74,chisel:.26,hollow:.2})}}await T.yield();{const p=Ve.length/3,u=se.clone().addScaledVector(xe,540),v=150,i=Fo,l=jt.range(0,40),f=(d,g)=>{const h=1-Math.abs(Math.sin(Math.PI*d/g));return h*h*h};for(let d=0;d<=30;d++)for(let g=0;g<=60;g++){const h=-330+660*g/60,m=Math.abs(h),y=w(330,215,m),b=Math.exp(-Math.pow(m/125,1.22))+.34*Math.exp(-Math.pow((h+165)/62,2))+.2*Math.exp(-Math.pow((h-185)/56,2))+.05*I.ridged2(h/46+l,3.3,2),M=v+(i-v)*Math.min(b,1.03)*y,z=v-45+(M-v+45)*(1-Math.pow(1-d/30,1.6)),A=M-z,V=I.n2(h/90+l,z/110),k=f(h+.06*A+9*V,38)*w(0,30,A),j=Math.pow(1-Math.abs(Math.sin(Math.PI*(h+20)/170)),2)*w(60,300,A),F=1+.4*A*(.85+.3*V)+k*(2.5+.035*Math.min(A,260))+24*j+3*I.n2(h/17,z/17+l)*w(10,80,A);Ve.push(u.x+pe.x*h-xe.x*F,z,u.z+pe.z*h-xe.z*F);const x=.8+.035*A+.0011*A*A*(.75+.5*(V*.5+.5))+k*1.6*w(20,90,A)+5*j;pt.push(x,.6+.4*k,w(.1,.45,I.n2(h/55+3+l,z/70))*w(110,230,A)*.9,0),mt.push(0,0,1,0),Co.push(Math.exp(-A/30)*(.3+.7*Math.exp(-Math.pow((h-4)/60,2)))*y)}for(let d=0;d<30;d++)for(let g=0;g<60;g++){const h=p+d*61+g;gt.push(h,h+1,h+61,h+1,h+61+1,h+61)}Co.base=p}}ao(ko),await T.yield();{const e=la.concat(So).slice(0,20),t=new c.Vector2(-Be.x,-Be.z).normalize();e.forEach((o,a)=>re.uBl.value[a].set(o[0],o[1],o[2],o[3])),re.uGate.value.set(t.x,t.y,Math.hypot(Be.x,Be.z)/Math.max(Be.y,.1))}const Vo=async(e,t,o)=>{const a=new c.BufferGeometry,n=e[0].length/3,s=new Float32Array(n*4);if(o)for(let p=0;p<o.length;p++)s[(o.base+p)*4]=-5e3,s[(o.base+p)*4+3]=o[p];a.setAttribute("position",new c.Float32BufferAttribute(e[0],3)),a.setAttribute("aD",new c.Float32BufferAttribute(e[1],4)),a.setAttribute("aE",new c.Float32BufferAttribute(e[2],4)),a.setAttribute("aS",new c.BufferAttribute(s,4)),a.setIndex(e[3]),await T.yield(),a.computeVertexNormals(),a.computeBoundingSphere();const r=new c.Mesh(a,oo);return r.name=t,J.add(r),r};oo.side=c.DoubleSide;const Bn=await Vo(ko,"pinnacles-ranges");await T.yield();const $a=await Vo(na,"gorge-flakes");await T.yield();const Xa=await Vo(sa,"gate-stone",Co);await T.yield();{const e=new c.Shape;e.moveTo(-11,0),e.lineTo(-11.3,12.5),e.quadraticCurveTo(-13.4,15.5,-12.2,18.2),e.quadraticCurveTo(-11.2,20.8,-8.6,21.9),e.quadraticCurveTo(-4.5,22.4,0,24.2),e.quadraticCurveTo(4.5,22.4,8.6,21.9),e.quadraticCurveTo(11.2,20.8,12.2,18.2),e.quadraticCurveTo(13.4,15.5,11.3,12.5),e.lineTo(11,0),e.lineTo(8,0),e.lineTo(8,9.5),e.absarc(0,9.5,8,0,Math.PI,!1),e.lineTo(-8,0),e.lineTo(-11,0);const t=(f,d,g,h,m,y,b,M,z)=>{const A=[],V=[];for(let k=0;k<=z;k++){const j=k/z,F=C(m,y,j),x=C(g,h,j),S=C(b,M,Math.pow(j,.8)),L=Math.max(x-S,.03);A.push(new c.Vector2(f+Math.cos(F)*(x+S),d+Math.sin(F)*(x+S))),V.push(new c.Vector2(f+Math.cos(F)*L,d+Math.sin(F)*L))}e.holes.push(new c.Path(A.concat(V.reverse())))},o=(f,d,g,h,m)=>t(f,d,.37*g,g,h,h+m*4.3,.34*g,.05*g,12);for(const f of[-1,1]){const d=g=>f>0?g:Math.PI-g;t(f*8.9,17.15,.52,2.05,d(-1.9),d(-1.9)+f*8.4,.36,.23,32),o(f*1.95,20.6,1.25,d(.4),-f),o(f*5.45,20.25,.95,d(2.6),f),o(f*10.25,13.35,.62,d(1.2),-f),o(f*9.75,10.9,.66,d(-1.6),f),o(f*9.75,7.3,.66,d(1.6),-f),o(f*9.75,4.2,.66,d(-1.6),f)}const a=new c.Shape;a.moveTo(8.95,2.3),a.lineTo(8.95,9.5),a.absarc(0,9.5,8.95,0,Math.PI,!1),a.lineTo(-8.95,2.3),a.lineTo(-8.02,2.3),a.lineTo(-8.02,9.5),a.absarc(0,9.5,8.02,Math.PI,0,!0),a.lineTo(8.02,2.3),a.lineTo(8.95,2.3);const n=(f,d,g,h)=>{const m=new c.Shape;return m.moveTo(f,d),m.lineTo(g,d),m.lineTo(g,h),m.lineTo(f,h),m.lineTo(f,d),m},s=[[e,2.4,.33,1],[a,3.3,.22,1.9]];for(const f of[-1,1])s.push([n(Math.min(f*7.55,f*11.6),0,Math.max(f*7.55,f*11.6),2.3),3.8,.22,2.2]),s.push([n(Math.min(f*7.75,f*11.65),9,Math.max(f*7.75,f*11.65),9.9),3.5,.18,1.8]);const r=[],p=[],u=[],v=[];await T.yield();for(const[f,d,g,h]of s.reverse()){const m=new c.ExtrudeGeometry(f,{depth:d-2*g,bevelEnabled:!0,bevelThickness:g,bevelSize:g*.9,bevelOffset:-g*.9,bevelSegments:2,curveSegments:14,steps:1});m.translate(0,0,-d/2+g),await T.yield();const y=m.attributes.position,b=m.attributes.normal,M=y.array,z=b.array;for(let A=0;A<y.count;A++){(A&2047)===2047&&await T.yield();const V=M[A*3],k=M[A*3+1],j=z[A*3+2],F=j*j,x=(13+15*w(21,11,k)+150*Math.pow(w(13,0,k),1.5))*C(.5,1.55,w(13,-13,V))*h,S=f===e?w(9.7,11.2,V):0;r.push(V,k,M[A*3+2]),p.push(z[A*3],z[A*3+1],j);const L=C(1.5,C(x,Math.min(x,2.6),S),F*F);u.push(L,.62+.38*w(0,6,k),0,0),v.push(0,0,1,Math.exp(-L/5))}m.dispose(),await T.yield()}const i=new c.BufferGeometry;i.setAttribute("position",new c.Float32BufferAttribute(r,3)),i.setAttribute("normal",new c.Float32BufferAttribute(p,3)),i.setAttribute("aD",new c.Float32BufferAttribute(u,4)),i.setAttribute("aE",new c.Float32BufferAttribute(v,4)),i.setAttribute("aS",new c.BufferAttribute(new Float32Array(r.length/3*4),4)),i.computeBoundingSphere();const l=new c.Mesh(i,oo);l.name="arch",l.matrixAutoUpdate=!1,l.matrix.makeBasis(pe,new c.Vector3(0,1,0),xe.clone().negate()).scale(new c.Vector3(ro,ro,ro)).setPosition(se.x,so-.4,se.z),J.add(l)}await T.yield();const qn=new c.Vector2(-ee.x,-ee.y);let io;{const e=[],t=[];let o=318,a=2.2;for(;o<=600;o+=2.2)e.push(o);for(o=e[e.length-1];o<6400;)a*=1.26,o+=a,e.push(o);{const x=[0];let S=0,L=2.7;for(;S<84;)S+=2.7,x.push(S);for(;S<5400;)L*=1.25,S+=L,x.push(S);for(let q=x.length-1;q>0;q--)t.push(-x[q]);t.push(...x)}const n=e.length,s=t.length,r=new Float32Array(n*s*3),p=new Float32Array(n*s*4),u=new Float32Array(n*s*4),v=new Uint32Array((n-1)*(s-1)*6),i=new c.Vector3;let l=0;const f=x=>0*x,d=216,g=Math.min(Y,dt(d)-6.4),h=new Float32Array(n);{let x=0;for(let S=1;S<n;S++)x+=(e[S]-e[S-1])*C(1,.85,f((e[S]+e[S-1])*.5)),h[S]=x}for(let x=0;x<n;x++){const S=e[x],L=f(S),q=C(38,19,w(215,300,S));for(let G=0;G<s;G++){const D=x*s+G,U=t[G];E(S,U,i);let K=Y,le=1,ne=0,B=0;if(S<322){const W=Math.min(Math.abs(U)/q,1.4),P=158+20*W*W+11*I.n2(U/15+3.3,1.7);if(S>=d)K=Math.min(Y,dt(S)-6.4);else{const R=X((S-P)/(d-P),0,1),fe=85.5+2*I.n2(U/9,S/9);K=C(fe,g,Math.sqrt(1-(1-R)*(1-R))),ne=Math.sin(Math.PI*Math.min(1,R*1.15))*(1-w(d-8,d+6,S))}K-=4.5*W*W*L,le=w(P-2,P+28,S)}else if(S<800&&Math.abs(U)<760)for(const W of no){const P=i.x-W.x,R=i.z-W.z,fe=P*P+R*R,ye=W.r*1.15+4;fe<ye*ye*6&&(B=Math.max(B,Math.exp(-fe/(ye*ye))))}r[D*3]=i.x,r[D*3+1]=K,r[D*3+2]=i.z,p[D*4]=L,p[D*4+1]=le,p[D*4+2]=h[x],p[D*4+3]=ne,u[D*4]=U+ue(S),u[D*4+1]=B,u[D*4+2]=U,u[D*4+3]=S}(x&15)===15&&await T.yield()}{const x=s-1>>1,S=(L,q)=>{const G=L*s+q,D=G+1,U=G+s,K=U+1;v[l++]=G,v[l++]=D,v[l++]=U,v[l++]=D,v[l++]=K,v[l++]=U};for(let L=n-2;L>=0;L--){for(let q=0;q<x;q++)S(L,q);for(let q=s-2;q>=x;q--)S(L,q)}}const m=new c.BufferGeometry,y=new c.BufferAttribute(r,3),b=new c.BufferAttribute(p,4),M=new c.BufferAttribute(u,4);m.setAttribute("position",y),m.setAttribute("aC",b),m.setAttribute("aG",M),m.setIndex(new c.BufferAttribute(v,1)),await T.yield(),m.computeVertexNormals(),m.computeBoundingSphere(),m.boundingSphere.radius+=30,await T.yield();const z=new c.BufferGeometry;{const x=[],S=s-1>>1,L=[];let q=0;for(;q+2<n&&e[q+2]<735;)q+=2;for(let D=S%2;D+2<s;D+=2)Math.abs(t[D])<150&&Math.abs(t[D+2])<150&&L.push(D);const G=(D,U)=>{const K=D*s+U,le=K+2,ne=K+2*s,B=ne+2;x.push(K,le,ne,le,B,ne)};for(let D=q-2;D>=0;D-=2){for(const U of L)U<S&&G(D,U);for(let U=L.length-1;U>=0;U--)L[U]>=S&&G(D,L[U])}z.setAttribute("position",y),z.setAttribute("aC",b),z.setAttribute("aG",M),z.setAttribute("normal",m.attributes.normal),z.setIndex(x),z.boundingSphere=m.boundingSphere.clone()}await T.yield();const A=`
        // x: height in metres (the shape the mesh takes), y: finer relief for the shading only, z: how high in its billow (.36 in a hollow, 1 on a dome)
        // The sea is broad cumulus: domes with rounded hollows between them. The fall pours in RANKS: rolls lying across the
        // flow, 12 m from crest to crest and 3 to 4 m high, round on top, each broken along its length into billows and riding
        // the bigger lobes under it, so from the lens (6 m up, looking along the flow) rank stands behind rank all the way to
        // the notch: a shaded flank under a pale crest, again and again.
        float dome(float n){ float a = min(sqrt(n * n + .03), 1.); return a * (2. - a); }
        vec3 cloudH(vec2 q, float t, float fall){
          vec2 f = q + vec2(t * 4., 0.);
          float big = jn(vec3(f / 170., t * .015)) - .5;
          float bm = dome(2. * jn(vec3(f / 34. + 7., t * .04)) - 1.), b2 = dome(2. * jn(vec3(f / 12.5 + 3., t * .09)) - 1.), bd = dome(2. * jn(vec3(f / 4.6 + 11., t * .16)) - 1.);
          float h = big * 5. + (bm - .62) * mix(9.5, 3.2, fall) + (b2 - .62) * mix(6., 2.4, fall);
          float be = dome(2. * jn(vec3(f / 1.9 + 4., t * .25)) - 1.);
          float hd = (bd - .62) * mix(1.25, 1.6, fall) + (be - .62) * .5, z = b2 * .5 + bd * .3 + bm * .2;   // cauliflower: two finer sizes of dome, for the shading
          if (fall > .001) {
            float ph = f.x / 10.2 + .9 * jn(vec3(f / 26. + 5., t * .05)), sr = sin(3.14159 * ph), ar = min(sqrt(sr * sr + .1), 1.);
            float rk = ar * (2. - ar) * (.8 + .34 * jn(vec3(f.x / 17., f.y / 9. + 2., t * .08)));     // .42 in the trough between two ranks .. 1.14 on a crest
            float bl = dome(2. * jn(vec3(f / 7.5 + 5., t * .12)) - 1.);
            h += fall * ((rk - .78) * 6.6 + (bl - .62) * 1.6); hd += fall * (rk - .78) * 1.4;
            z = mix(z, .36 + .64 * clamp((rk - .45) / .62, 0., 1.) * (.7 + .3 * bd), fall);
          }
          h -= max(0., h - mix(6.5, 4., fall)) * mix(.7, .8, fall);                           // under the flight line the billows never reach the lens
          return vec3(h, hd, z);
        }`,V=`
        attribute vec4 aC, aG; uniform float uTime, uOff; uniform vec2 uAx;
        varying vec3 vW, vNb; varying vec4 vC, vG; varying vec2 vQ;
        ${Ae}
        ${A}
        void main(){
          vec3 p = position; vec2 q = vec2(aC.z, aG.x);
          float h = cloudH(q, uTime, aC.x).x * mix(.25, 1., aC.y);
          h += aG.y * (4.6 + 1.7 * sin(uTime * .55 + q.x * .21 + q.y * .17));     // the sea swells in a collar round every pinnacle, and laps
          p.y += h + uOff; p.xz -= uAx * h * aC.w * .8;                           // the nose of the fall bulges forward as well as up
          vW = p; vC = aC; vG = aG; vQ = q; vNb = normal; gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
        }`,k=(x,S,L)=>({uAx:{value:new c.Vector2(ee.x,ee.y)},uCloudShade:{value:Q.cloud.clone()},uCloudFar:{value:Q.cloudFar.clone()},uOff:{value:x},uA:{value:S},uSeed:{value:L}}),j=he({transparent:!0,own:k(0,1,0),vertexShader:V,fragmentShader:`
          uniform vec3 uLamp, uLampCol, uPale, uCloudShade, uCloudFar, uSkyCol; uniform float uTime; uniform vec4 uShaft; uniform vec2 uAx;
          varying vec3 vW, vNb; varying vec4 vC, vG; varying vec2 vQ;
          ${Ae}
          ${lt}
          ${Xt}
          ${A}
          void main(){
            vec3 toCam = cameraPosition - vW; float dist = max(length(toCam), 1e-3), px = max(length(fwidth(vW.xz)), 1e-3); vec3 V = toCam / dist;
            float t = uTime, fall = vC.x, st = mix(1., .85, fall), e = max(.5, px), k = mix(.25, 1., vC.y);
            vec3 c0 = cloudH(vQ, t, fall), ca = cloudH(vQ + vec2(e * st, 0.), t, fall), cl = cloudH(vQ + vec2(0., e), t, fall);
            float nd = (1. - smoothstep(.3, 1.2, px)) * .6, h = c0.x + c0.y * nd, ha = ca.x + ca.y * nd, hl = cl.x + cl.y * nd;
            // fibres: vapour drawn out along the flow in three sizes, streaming toward the gorge, near the lens only
            float nearK = 1. - smoothstep(30., 85., dist);
            float fa = jn(vec3((vQ.x + t * 9.) / 12., vQ.y / 1.9, t * .12)), fb = jn(vec3((vQ.x + t * 13.) / 4.4, vQ.y / .72 + 3., t * .2)), fc = jn(vec3((vQ.x + t * 18.) / 1.6, vQ.y / .27, t * .35));
            float fine = ((smoothstep(.28, .72, fa) - .5) * .95 + (fb - .5) * .8 * (1. - smoothstep(.2, .6, px)) + (fc - .5) * .45 * (1. - smoothstep(.07, .22, px))) * nearK;   // -1..1
            vec3 Nb = vNb * inversesqrt(max(dot(vNb, vNb), 1e-8));
            vec2 lat = vec2(-uAx.y, uAx.x);
            vec3 N = Nb * (1. + vC.w) - vec3(uAx.x, 0., uAx.y) * ((ha - h) / e * k - fine * .14) - vec3(lat.x, 0., lat.y) * ((hl - h) / e * k) + vec3(lat.x, 0., lat.y) * fine * (.34 + .2 * fall);
            N *= inversesqrt(max(dot(N, N), 1e-8));
            float bl = clamp((c0.z - .36) / .6, 0., 1.);
            float nv = clamp(dot(N, V), 0., 1.), nv0 = max(dot(Nb, V), .02), turn = nv / nv0;     // turn: 1 on level cloud, more on a flank that faces the lens, 0 where a crest goes over
            // milk jade, BACKLIT: the light is ahead of the lens (the Lit Wall across the sea, the notch up the fall), so the
            // flank each billow turns to us is its shaded side: ranks of grey-green flanks under pale tops and frayed crests.
            // Hollows stay grey-green, never dark (not under about .4 of a crest).
            // (the brief: grey-green in the wall's shade so the pale geese read against it, white only on billow crests)
            vec3 Lk = normalize(mix(uLamp - vec3(0., .1, 0.), vec3(uAx.x + lat.x * .5, .45, uAx.y + lat.y * .5), fall));   // down the fall the light comes from the notch and a little from the right
            // (the fall as a whole slopes toward the lens, away from its light: it is in shade, and only what tips over a crest is pale)
            float lit = smoothstep(mix(-.3, -.04, fall), mix(.32, .34, fall), dot(N, Lk));
            lit = min(1., lit + fall * .6 * smoothstep(.55, .95, bl));                            // the top of each rank catches the light from the notch
            float top = mix(.3, smoothstep(mix(.3, .56, fall), .94, bl), 1. - smoothstep(3., 12., px));   // pale only high on a billow (in the fall only the top quarter of each rank, so crest stands against the shaded rank behind); its mean before the billows are under a pixel
            float flankV = smoothstep(1.15, 1.9, turn) * (1. - smoothstep(70., 220., dist)) * (1. - fall);   // over the sea, whatever flank is turned to the lens
            float w = clamp(lit * (.1 + .9 * top) * (1. - .55 * flankV) + fine * mix(.2, .3, fall) + vC.w * .6, 0., 1.);   // the nose of the fall, facing the sky, stays pale
            vec3 lo = uCloudShade * mix(.4, .43, fall) + uSkyCol * .34, hi = uCloudShade * .98 + uCloudFar * .16 + uLampCol * .09;
            vec3 col = mix(lo, hi, w) * (1. + fine * .4);
            float crest = (1. - smoothstep(.06, .5, turn)) * (1. - smoothstep(200., 700., dist));         // each billow's far edge thins out pale
            col = mix(col, uCloudFar * .95 + uLampCol * .08, crest * (.55 + .25 * fall));
            col = mix(col, uCloudFar, smoothstep(500., 2800., dist) * .7) * veil(vW);
            vec2 sd = vW.xz - uShaft.xy; col += (uPale * .9 + uCloudFar * .4) * uShaft.z * (.6 + .6 * w) * exp(-dot(sd, sd) / 900.);
            // the foot of the fall frays out softly over the canopy
            float wn = jn(vec3((vQ.x + t * 6.) / 9., vQ.y / 5., t * .2)) * .6 + jn(vec3((vQ.x + t * 9.) / 3.1, vQ.y / 2.2, t * .4)) * .4;
            float al = vC.y >= .999 ? 1. : smoothstep(0., 1., vC.y * 1.7 - (1. - vC.y) * wn * 1.3) * smoothstep(0., .25, vC.y);
            // near the lens every crest dissolves where it goes over, torn along the fibres, into the rank behind it (the grid is
            // drawn far rows first), so no billow ends in the straight edge of a mesh
            al *= mix(1., smoothstep(.04, .62, turn + fine * .3), (1. - smoothstep(55., 120., dist)) * (1. - vC.w) * (1. - smoothstep(60., 82., abs(vG.z))) * (1. - smoothstep(690., 725., vG.w)) * smoothstep(.9, 1., vC.y));
            if (al < .004) discard;
            col = mix(col, uFogCol, 1. - exp(-dist * uFogD));
            gl_FragColor = vec4(max(col, 0.), al);
          }`});io=new c.Mesh(m,j),io.name="cloud-sea",io.renderOrder=-1,J.add(io),await T.yield();{const x=new c.Mesh(z,he({transparent:!0,own:k(-2.2,1,0),vertexShader:V,fragmentShader:`
            uniform vec3 uCloudShade, uCloudFar, uSkyCol; uniform float uTime;
            varying vec3 vW, vNb; varying vec4 vC, vG; varying vec2 vQ;
            ${Ae}
            ${lt}
            ${Xt}
            void main(){
              float a = smoothstep(.8, 1., vC.y); if (a < .004) discard;
              float dist = length(cameraPosition - vW), n = jn(vec3((vQ.x + uTime * 5.) / 9., vQ.y / 5., uTime * .1));
              vec3 col = (uCloudShade * .64 + uSkyCol * .26 + uCloudFar * .07) * (.9 + .2 * n) * veil(vW);
              gl_FragColor = vec4(max(mix(col, uFogCol, 1. - exp(-dist * uFogD)), 0.), a);
            }`}));x.name="cloud-underlay",x.renderOrder=-2,x.frustumCulled=!1,J.add(x)}await T.yield();const F=`
        uniform vec3 uLampCol, uPale, uCloudShade, uCloudFar; uniform float uTime, uA, uSeed; uniform vec4 uShaft;
        varying vec3 vW, vNb; varying vec4 vC, vG; varying vec2 vQ;
        ${Ae}
        ${lt}
        ${Xt}
        void main(){
          vec3 toCam = cameraPosition - vW; float dist = max(length(toCam), 1e-3), px = max(length(fwidth(vW.xz)), 1e-3);
          float t = uTime, fall = vC.x, k2 = 1. - smoothstep(.4, 1.2, px), k3 = 1. - smoothstep(.12, .4, px);
          // vapour torn into fibres along the flow, holes between; each octave gives way to its mean before it is a pixel wide
          float f1 = jn(vec3((vQ.x + t * 7.) / 12., vQ.y / 4.4, t * .12 + uSeed)), f2 = jn(vec3((vQ.x + t * 11.) / 3.8, vQ.y / 1.4, t * .2 + uSeed * 2.)), f3 = jn(vec3((vQ.x + t * 16.) / 1.3, vQ.y / .5, t * .33));
          float n = f1 * .56 + mix(.15, f2 * .3, k2) + mix(.07, f3 * .14, k3);
          float torn = smoothstep(mix(.54, .47, fall), mix(.78, .73, fall), n);
          vec3 Nb = vNb * inversesqrt(max(dot(vNb, vNb), 1e-8)); float nv = abs(dot(Nb, toCam / dist));
          float a = torn * uA * mix(.6, .42, fall) * (1. + (1. - nv) * .4);
          a *= smoothstep(3., 12., dist) * mix(.3, 1., smoothstep(14., 50., dist)) * (1. - smoothstep(90., 220., dist) * (1. - .75 * fall)) * (1. - smoothstep(110., 150., abs(vG.z))) * (1. - smoothstep(680., 728., vG.w)) * smoothstep(.1, .5, vC.y);
          a = min(a, .85);
          if (a < .004) discard;
          vec3 col = (uCloudShade * 1.02 + uCloudFar * .19 + uLampCol * .09) * (.86 + .3 * n) * veil(vW);
          vec2 sd = vW.xz - uShaft.xy; col += (uPale * .9 + uCloudFar * .4) * uShaft.z * .8 * exp(-dot(sd, sd) / 900.);
          col = mix(col, uFogCol, 1. - exp(-dist * uFogD));
          gl_FragColor = vec4(max(col, 0.), a);
        }`;for(const[x,S,L,q]of[[1.5,.27,3.1,0],[3.3,.17,8.7,1]]){const G=new c.Mesh(z,he({transparent:!0,depthWrite:!1,own:k(x,S,L),vertexShader:V,fragmentShader:F}));G.name="cloud-sheet",G.renderOrder=q,G.frustumCulled=!1,J.add(G)}await T.yield();{const x=te.fork("wisps"),S=[],L=B=>Math.round(B*(.6+.4*ke)),q=B=>[ee.x*Math.cos(B)-oe.x*Math.sin(B),ee.y*Math.cos(B)-oe.y*Math.sin(B)];for(let B=L(200);B>0;B--){const W=x.range(118,352),P=w(200,225,W),R=Ee(W)+2.5*Math.sin(W/29)+x.range(-1,1)*(4.5+5*tt(W)+5*(1-P)),fe=R+ue(W);E(W,R,i);const ye=q(x.range(-.2,.2)),Kt=(ae(W+7,fe)-ae(W-7,fe))/14;S.push([i.x,ae(W,fe)+x.range(1.6,6)+3*(1-P)*x(),i.z,x(),ye[0],ye[1],x.range(8,18),x.range(1.5,4.2)*C(1,.62,P),x.range(7,12),36,x.range(.34,.6)*C(1,.42,P),X(Kt,0,.9)])}for(let B=L(26);B>0;B--){const W=x.range(92,150);E(W,x.range(-30,30),i);const P=q(x.range(-.7,.7));S.push([i.x,x.range(84,97)+Math.max(0,W-120)*.3,i.z,x(),P[0],P[1],x.range(8,18)*1.3,x.range(2.2,5.5),x.range(1.5,4),30,x.range(.35,.65),0])}for(let B=L(26);B>0;B--){const W=x.range(240,340),P=(x.chance(.5)?1:-1)*x.range(9,19);E(W,P,i);const R=q(Math.PI/2+x.range(-.7,.7));S.push([i.x,ae(W,P+ue(W))+x.range(3,12),i.z,x(),R[0],R[1],x.range(10,22),x.range(1.6,3.4),x.range(6,11),70,x.range(.13,.24),.2])}for(let B=L(70);B>0;B--){E(x.range(330,530),(x.chance(.5)?1:-1)*x.range(50,112),i);const W=q(Math.PI/2+x.range(-.7,.7));S.push([i.x,Y+x.range(3.5,9.5),i.z,x(),W[0],W[1],x.range(9,20),x.range(1.5,3.4),x.range(6,11),60,x.range(.22,.38),0])}for(const B of no)if(B.near)for(let W=0;W<3;W++){const P=x.range(0,6.28),R=B.r*.8+2.5;S.push([B.x+Math.cos(P)*R,Y+x.range(3.5,9),B.z+Math.sin(P)*R,x(),-Math.sin(P),Math.cos(P),B.r*x.range(1.2,1.8),x.range(2.6,4.6),x.range(.8,1.6),7,x.range(.4,.6),0])}const G=S.length,D=new c.InstancedBufferGeometry,U=new Float32Array(G*4),K=new Float32Array(G*4),le=new Float32Array(G*4);D.setAttribute("position",new c.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),D.setIndex([0,1,2,0,2,3]),S.forEach((B,W)=>{U.set([B[0],B[1],B[2],B[3]],W*4),K.set([B[4],B[5],B[6],B[7]],W*4),le.set([B[8],B[9],B[10],B[11]],W*4)}),D.setAttribute("iA",new c.InstancedBufferAttribute(U,4)),D.setAttribute("iB",new c.InstancedBufferAttribute(K,4)),D.setAttribute("iC",new c.InstancedBufferAttribute(le,4)),D.instanceCount=G;const ne=new c.Mesh(D,he({transparent:!0,depthWrite:!1,side:c.DoubleSide,own:{uAx:{value:new c.Vector2(ee.x,ee.y)},uCloudShade:{value:Q.cloud.clone()},uCloudFar:{value:Q.cloudFar.clone()}},vertexShader:`
            attribute vec4 iA, iB, iC; uniform float uTime; uniform vec2 uAx;
            varying vec2 vUv; varying vec4 vK;
            void main(){
              float ph = fract(uTime * iC.x / iC.y + iA.w), run = (ph - .5) * iC.y;
              vec3 c = iA.xyz - vec3(uAx.x, iC.w, uAx.y) * run;                                 // carried down the flow, round and round
              vec3 axis = normalize(vec3(iB.x, 0., iB.y)), view = c - cameraPosition; float dist = max(length(view), 1e-3);
              vec3 side = cross(axis, view / dist); side = side * inversesqrt(max(dot(side, side), 1e-4));
              vec3 wp = c + axis * position.x * iB.z + side * position.y * iB.w * (.7 + .6 * ph);
              vUv = position.xy; vK = vec4(sin(ph * 3.1416) * iC.z * smoothstep(5., 16., dist) * (1. - smoothstep(260., 420., dist)), iA.w * 37., iB.z / iB.w, ph);
              gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
            }`,fragmentShader:`
            uniform vec3 uCloudShade, uCloudFar, uSkyCol, uLampCol, uFogCol; uniform float uTime;
            varying vec2 vUv; varying vec4 vK;
            ${Ae}
            void main(){
              float n = jn(vec3(vUv.x * vK.z * .55 + vK.y, vUv.y * 1.3 + vK.y, uTime * .25)) * .6 + jn(vec3(vUv.x * vK.z * 1.6 - uTime * .3, vUv.y * 3.2, vK.y)) * .4;
              float ex = 1. - vUv.x * vUv.x, body = exp(-vUv.y * vUv.y * 3.2) * ex * ex;
              float a = body * smoothstep(.28, .8, n + body * .35) * vK.x * (1. - smoothstep(.75, 1., abs(vUv.y)));
              if (a < .003) discard;
              vec3 col = (uCloudShade * 1.1 + uCloudFar * .46 + uLampCol * .1) * (.66 + .3 * (vUv.y * .5 + .5) + .4 * n) + uSkyCol * .12;
              gl_FragColor = vec4(col, a);
            }`}));ne.frustumCulled=!1,ne.renderOrder=2,ne.name="cloud-wisps",J.add(ne)}}await T.yield();const It=new c.Mesh(new c.SphereGeometry(7600,32,20),he({side:c.BackSide,depthWrite:!1,depthTest:!1,own:{uZen:{value:Q.zen.clone()},uMid:{value:Q.mid.clone()},uHor:{value:Q.hor.clone()},uStars:{value:Q.stars},uGlow:{value:Q.glow}},vertexShader:"varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.); }",fragmentShader:`
        uniform vec3 uZen, uMid, uHor, uSun, uSunCol, uFogCol; uniform float uTime, uStars, uGlow;
        varying vec3 vDir;
        ${Ae}
        void main(){
          vec3 d = normalize(vDir);
          float h = d.y;
          vec3 col = mix(mix(uHor, uMid, smoothstep(-.01, .2, h)), uZen, smoothstep(.16, .8, h));
          float cs = max(dot(d, uSun), 0.);
          col += uSunCol * uGlow * (pow(cs, 6.) * .06 + pow(cs, 40.) * .14 + pow(cs, 400.) * .4);
          // thin cirrus veils
          vec2 cp = d.xz / max(d.y + .3, .08);
          float ci = jn(vec3(cp * vec2(1.3, 3.6) + vec2(uTime * .006, 0.), 1.)) * .65 + jn(vec3(cp * vec2(4., 9.) + vec2(uTime * .01, 3.), 2.)) * .35;
          col += (uHor * .5 + uSunCol * .12 * pow(cs, 3.)) * smoothstep(.56, .9, ci) * smoothstep(.02, .3, h) * .4;
          if (uStars > .5) {
            vec3 g = d * 190., gi = floor(g); float r = jh(gi), tw = .6 + .4 * sin(uTime * 2.3 + r * 60.);
            float sdot = 1. - smoothstep(.1, .34, length(fract(g) - .5));
            col += vec3(.7, .82, 1.) * step(.992, r) * sdot * tw * smoothstep(.02, .25, h) * 1.3;
          }
          col = mix(col, uFogCol, 1. - smoothstep(-.06, .03, h));
          gl_FragColor = vec4(col, 1.);
        }`}));It.renderOrder=-10,It.frustumCulled=!1,It.name="sky",J.add(It);const Za=he({side:c.DoubleSide,vertexShader:`
        attribute vec3 aCol; attribute float aF; attribute vec4 aS;
        uniform float uTime, uGale; uniform vec3 uWind;
        varying vec3 vW, vN, vC, vO; varying float vF, vB, vSd;
        void main(){
          vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.);
          // gust bands roll through the crowns; small things shiver
          float g = sin(uTime * 1.25 + dot(wp.xz, vec2(.05, .034))) * .6 + sin(uTime * 3.1 + aS.x * 6.28) * .25 + sin(uTime * 7.3 + aS.x * 40.) * .2 * step(3., aS.z);
          wp.xz += uWind.xz * (g + .4) * max(wp.y - instanceMatrix[3].y, 0.) * aS.z * .03 * (1. + uGale);
          vW = wp.xyz; vN = mat3(modelMatrix) * (mat3(instanceMatrix) * normal); vC = aCol * aS.y; vO = position; vSd = aS.x * 17.; vF = aF; vB = aS.w;   // aS.w: 1 sinks into the cloud sea, 2 stands half-drifted in snow
          gl_Position = projectionMatrix * viewMatrix * wp;
        }`,fragmentShader:`
        uniform vec3 uSun, uSunCol, uSkyCol, uLamp, uLampCol, uAccent, uSnowCol;
        varying vec3 vW, vN, vC, vO; varying float vF, vB, vSd;
        ${Ae}
        ${lt}
        ${Xt}
        void main(){
          vec3 N = vN * inversesqrt(max(dot(vN, vN), 1e-8)); if (!gl_FrontFacing) N = -N;
          vec3 toCam = cameraPosition - vW; float dist = max(length(toCam), 1e-3); vec3 V = toCam / dist;
          float px = max(length(fwidth(vW)), 1e-3), fd = 1. - smoothstep(.25, .7, px);
          float sp = jn((vO + vSd) * 2.6), sp2 = jn((vO + vSd) * 7.1 + 4.);
          vec3 alb = vC * (.72 + .56 * mix(.5, sp * .6 + sp2 * .4, fd));
          // flower trusses: the one accent
          if (vF > .01) {
            // round trusses scattered over the dark leaf (a stereographic map of the dome keeps them round all over it)
            vec3 dn = vO - vec3(0., .3, 0.); dn *= inversesqrt(max(dot(dn, dn), 1e-6));
            vec2 st = dn.xz / (1.2 + dn.y) * 12.5 + vSd, ci = floor(st), cf = fract(st); float best = 4., bid = 0.;
            for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
              vec2 g = vec2(float(x), float(y)); vec3 h3 = vec3(ci + g, 3.);
              vec2 r = g + .22 + .56 * vec2(jh(h3), jh(h3 + 7.7)) - cf; float q = dot(r, r);
              if (q < best) { best = q; bid = jh(h3 + 19.3); }
            }
            float dsp = sqrt(best), wpx = px * 2.2, truss = (1. - smoothstep(.3 - wpx, .36 + wpx, dsp)) * step(.26, bid);
            alb *= 1. - .45 * fd * (1. - smoothstep(.36, .5, dsp)) * step(.26, bid);                 // the shadow each truss sits in
            alb = mix(alb, uAccent * (.8 + 1.2 * (1. - smoothstep(0., .34, dsp))) * (.8 + .5 * fract(bid * 7.3)), vF * mix(.42, truss, fd));
          }
          float hemi = N.y * .5 + .5, lam = max(dot(N, uLamp), 0.);
          vec3 light = uSkyCol * (.6 + .9 * hemi) + uLampCol * (.2 + .8 * lam) * .95; light = mix(light, vec3(dot(light, vec3(.3, .5, .2))), .55);
          vec3 col = alb * light * 1.6;
          float c = max(dot(-V, uSun), 0.);
          col += alb * uSunCol * pow(clamp(1. - max(dot(N, V), 0.), 0., 1.), 3.) * (.12 + .6 * c * c);
          if (vB > 1.5) {                                         // a boulder on the col: a cap of drift on its top and lee side, blue shade at its foot
            float cap = smoothstep(.2, .52, N.y + (sp - .5) * .5 - dot(N.xz, uLamp.xz) * .12);
            vec3 sc = uSnowCol * (uSkyCol * (.8 + 1.1 * hemi) + uLampCol * (.1 + .9 * lam));
            col = mix(col * (.55 + .45 * smoothstep(-.3, .25, vO.y)), mix(sc, vec3(dot(sc, vec3(.3, .5, .2))), .35), cap);
          }
          gl_FragColor = vec4(max(atmos(col * veil(vW), vW, dist, min(vB, 1.)), 0.), 1.);
        }`}),wt=()=>({P:[],C:[],Fw:[],I:[]}),xt=(e,t=!0)=>{const o=new c.BufferGeometry;return o.setAttribute("position",new c.Float32BufferAttribute(e.P,3)),o.setAttribute("aCol",new c.Float32BufferAttribute(e.C,3)),o.setAttribute("aF",new c.Float32BufferAttribute(e.Fw,1)),t&&o.setIndex(e.I),o.computeVertexNormals(),o},ie=(e,t,o,a,n,s=0)=>(e.P.push(t,o,a),e.C.push(n[0],n[1],n[2]),e.Fw.push(s),e.P.length/3-1),Ke=(e,t,o)=>[C(e[0],t[0],o),C(e[1],t[1],o),C(e[2],t[2],o)],yt=te.fork("rind"),_t=(e,t,o)=>{const a=wt(),n=[.05,.028,.018],s=[.2,.085,.04];for(let r=0;r<=e;r++){const p=Math.max(.02,r/e*Math.PI*.63);for(let u=0;u<t;u++){const v=u/t*6.2832+(r&1)*(3.1416/t),i=Math.sin(p)*Math.cos(v),l=Math.cos(p),f=Math.sin(p)*Math.sin(v),d=w(.05,.5,I.n3(i*3.1+o,l*3.1,f*3.1+o)),g=1+.24*I.n3(i*1.9+o,l*1.9+3,f*1.9)+.11*I.n3(i*4.6,l*4.6+o,f*4.6)+.09*d;ie(a,i*g,l*g*.74+.3,f*g,Ke(n,s,.12+.55*d*l+.5*(g-1)),(.45+.55*d)*w(-.3,.25,l))}}for(let r=0;r<e;r++)for(let p=0;p<t;p++){const u=r*t+p,v=r*t+(p+1)%t,i=u+t,l=v+t;a.I.push(u,i,v,v,i,l)}return xt(a)},Ja=()=>{const e=wt(),t=[.03,.027,.02],o=[.13,.065,.032],a=7;for(let s=0;s<6;s++){const r=.1+s*.143,p=.17*(1-s/6.6),u=e.P.length/3;for(let i=0;i<a;i++){const l=i/a*6.2832+s*.6,f=1+.18*Math.cos(i*2.4+s);ie(e,Math.cos(l)*p*f,r-.035*f,Math.sin(l)*p*f,o)}const v=ie(e,0,r+.3,0,t);for(let i=0;i<a;i++)e.I.push(u+i,v,u+(i+1)%a)}const n=e.P.length/3;for(let s=0;s<4;s++){const r=s*1.5708;ie(e,Math.cos(r)*.022,0,Math.sin(r)*.022,t),ie(e,Math.cos(r)*.014,.3,Math.sin(r)*.014,t)}for(let s=0;s<4;s++){const r=n+s*2,p=n+(s+1)%4*2;e.I.push(r,r+1,p,p,r+1,p+1)}return xt(e)},en=()=>{const e=wt(),t=[.62,.59,.5],o=[.16,.14,.12],a=de?[.42,.22,.05]:[.3,.13,.09],n=de?[.6,.33,.045]:[.36,.17,.11],s=yt.fork("birch"),r=(l,f,d,g,h)=>{const m=new c.Vector3(1,0,0).cross(f);m.lengthSq()<1e-4&&m.set(0,0,1),m.normalize();const y=new c.Vector3().crossVectors(f,m),b=e.P.length/3;for(let M=0;M<h;M++){const z=M/h*6.2832;ie(e,l.x+(m.x*Math.cos(z)+y.x*Math.sin(z))*d,l.y+(m.y*Math.cos(z)+y.y*Math.sin(z))*d,l.z+(m.z*Math.cos(z)+y.z*Math.sin(z))*d,g)}return b},p=(l,f,d,g)=>{let h=-1;for(let m=0;m<l.length;m++){const y=new c.Vector3().subVectors(l[Math.min(m+1,l.length-1)],l[Math.max(m-1,0)]).normalize(),b=r(l[m],y,f[m],d[m%d.length],g);if(h>=0)for(let M=0;M<g;M++){const z=h+M,A=h+(M+1)%g;e.I.push(z,z+(b-h),A,A,z+(b-h),A+(b-h))}h=b}},u=(l,f,d,g)=>{const h=new c.Vector3(-f.z,0,f.x);h.lengthSq()<1e-4&&h.set(1,0,0),h.normalize();for(let m=0;m<g;m++){const y=(m/(g-1)-.5)*1.5,b=d*s.range(.7,1.15),M=s.range(.25,.8),z=.0085,A=new c.Vector3(l.x+(f.x*Math.cos(y)+h.x*Math.sin(y))*b,l.y+M*b+Math.abs(y)*-.05,l.z+(f.z*Math.cos(y)+h.z*Math.sin(y))*b);for(const V of[[h.x,0,h.z],[0,1,0]]){const k=ie(e,l.x-V[0]*z,l.y-V[1]*z,l.z-V[2]*z,a),j=ie(e,l.x+V[0]*z,l.y+V[1]*z,l.z+V[2]*z,a),F=ie(e,A.x,A.y,A.z,n,de?0:.2);e.I.push(k,j,F)}}},v=(l,f)=>{const d=e.P.length/3,g=3,h=6,m=s.range(0,9),y=[n[0]*.45,n[1]*.4,n[2]*.5];ie(e,l.x,l.y+f*.85,l.z,n);for(let b=1;b<=g;b++)for(let M=0;M<h;M++){const z=b/(g+.6)*Math.PI,A=M/h*6.2832+b*.5,V=f*(.8+.4*Math.abs(Math.sin(M*2.3+b*1.7+m)));ie(e,l.x+Math.sin(z)*Math.cos(A)*V,l.y+Math.cos(z)*V*.8,l.z+Math.sin(z)*Math.sin(A)*V,Ke(n,y,.2+.7*b/g))}for(let b=0;b<h;b++)e.I.push(d,d+1+b,d+1+(b+1)%h);for(let b=0;b<g-1;b++)for(let M=0;M<h;M++){const z=d+1+b*h+M,A=d+1+b*h+(M+1)%h;e.I.push(z,z+h,A,A,z+h,A+h)}},i=(l,f,d)=>new c.Vector3(l,f,d);p([i(0,0,0),i(.012,.2,.005),i(-.006,.42,.012),i(.02,.62,-.004),i(.03,.82,.01),i(.045,1,.02)],[.036,.03,.025,.019,.012,.004],[o,t,t,o,t,t],6),u(i(.045,1,.02),i(.4,0,.2).normalize(),.16,4);for(let l=0;l<7;l++){const f=.34+l*.09,d=l*2.4+s.range(0,1),g=s.range(.2,.36)*(1-l*.05),h=Math.cos(d),m=Math.sin(d),y=i(.01,f,.005),b=i(h*g*.55,f+g*.3,m*g*.55),M=i(h*g,f+g*.78,m*g);p([y,b,M],[.012,.008,.004],[t,t,a],4),u(M,i(h,0,m),.2,5),de&&v(M.clone().add(i(h*.04,.06,m*.04)),s.range(.09,.14))}return de&&v(i(.05,.98,.02),.12),xt(e)},$={d0:[],d1:[],d2:[],dw:[],dw2:[],fir:[],birch:[],stoneA:[],stoneB:[],tuft:[],cush:[]},Te=new c.Matrix4,To=new c.Quaternion,tn=new c.Vector3,on=new c.Vector3,jo=new c.Vector3(0,1,0),Ne=(e,t,o)=>{if(!t.length)return null;const a=new c.InstancedMesh(e,Za,t.length),n=new Float32Array(t.length*4);return t.forEach((s,r)=>{To.setFromAxisAngle(jo,s.rot),s.tilt&&To.multiply(new c.Quaternion().setFromAxisAngle(new c.Vector3(1,0,0),s.tilt)),Te.compose(tn.set(s.x,s.y,s.z),To,on.set(s.s,s.sy??s.s,s.s)),a.setMatrixAt(r,Te),n.set([s.ph,s.tint,s.sway,s.basin||0],r*4)}),e.setAttribute("aS",new c.InstancedBufferAttribute(n,4)),a.instanceMatrix.needsUpdate=!0,a.computeBoundingSphere(),a.name=o,J.add(a),a};{const e=new c.Vector3,t=yt.fork("forest"),o=ke*(.75+.25*ht);for(let a=-70;a<330;a+=5.8)for(let n=-104;n<=104;n+=5.8){const s=a+t.range(-2.7,2.7),r=n+t.range(-2.7,2.7),p=t(),u=t(),v=t(),i=t(),l=r+ue(s),f=ae(s,l),d=Math.hypot(ae(s+2,l)-ae(s-2,l),ae(s,l+2)-ae(s,l-2))/4;if(d>1.8||f>270||Math.abs(r-Ee(s))<(s<205?5.5:4+9*tt(s)))continue;const g=C(38,19,w(215,300,s)),h=Math.abs(r)<g+4,m=dt(s),y=Math.abs(r),b=h&&s>214;if(b&&i>.52)continue;E(s,r,e);const M={x:e.x,y:f,z:e.z,rot:p*6.28,ph:u,tint:.8+.4*v,basin:0};if(d>1)y>(s>250?34:24)&&i<.7&&$.fir.push(Object.assign(M,{s:12+12*v,sway:.5,y:f-1.5}));else if(b?i<.34:h?i<.86:i<.3){const z=b?1.5+1.7*v:3.9+2.3*v;if(f+z*1.1>m-8&&y<16)continue;Object.assign(M,{s:z,sy:z*(.85+.3*u),y:f-.4,sway:1.1}),b?$.d1.push(M):y<15?$.d0.push(M):y<36?t()<.55+.45*o&&$.d1.push(M):t()<o&&$.d2.push(M)}else(h?i<.95:i<.55)?(b?y>9&&f+6.5<m-6:y>25)&&$.birch.push(Object.assign(M,{s:b?4+2.5*v:8+5*v,sway:1.6,tint:.85+.3*v})):y>(s>250?34:24)&&t()<.5+.5*o&&$.fir.push(Object.assign(M,{s:13+12*v,sway:.5,y:f-.6}))}}await T.yield();const an=(e,t)=>{const o=tt(e),a=t-Ee(e);return Math.min(Math.abs(a-o*5*Math.sin(e*.052+1))-(1.5+.5*Math.sin(e*.11)),Math.abs(a-o*(1.5-4.4*Math.sin(e*.047+2.6)))-(1.05+.4*Math.sin(e*.17+1)),Math.abs(a-o*(7.5*Math.sin(e*.031+4.2)-1))-(.85+.3*Math.sin(e*.21+2)))},lo=(e,t,o)=>e>356&&e<480&&et(e,t)>-o*.05||e>203&&e<376&&an(e,t)<o;{const e=new c.Vector3,t=yt.fork("dwarf"),o=Math.round(270*ke*(.75+.25*ht));for(let a=0;a<o;a++){const n=t.range(216,668),s=(t()<.5?-1:1)*(2-Math.log(1-t()*.95)*8.5),r=2+t.int(0,3);for(let p=0;p<r;p++){const u=n+t.range(-2.8,2.8),v=s+t.range(-2.8,2.8),i=t.range(.55,1.45)*(u<330?1.3:1),l=t(),f=t(),d=t(),g=ae(u,v+ue(u));(u<322?Math.abs(v)>Jo(u)-5:g<xo+.6)||lo(u,v,1.2)||g+i>dt(u)-6.5||u>451&&u<527&&v>6&&v<37||Dt(u)>.05&&v>3.6&&v<20||u>500&&(d>.62||Math.abs(v)>26)||u>698&&u<731&&v<-6||(E(u,v,e),(u<430?$.dw:$.dw2).push({x:e.x,y:g-.16*i,z:e.z,rot:l*6.28,ph:f,tint:.85+.45*d,s:i,sy:i*(.7+.35*f),sway:2.6,basin:0}))}}}const Qe=[Ne(_t(7,13,3.3),$.d0,"rhodo-near"),Ne(_t(4,8,7.1),$.d1,"rhodo-mid"),Ne(_t(2,6,1.7),$.d2,"rhodo-far"),Ne(_t(4,8,5.3),$.dw,"rhodo-dwarf"),Ne(Ja(),$.fir,"firs"),Ne(en(),$.birch,"birches"),Ne(_t(4,8,5.3),$.dw2,"rhodo-dwarf-spur")];await T.yield();const ca=(e,t)=>{const o=new c.IcosahedronGeometry(1,e),a=o.attributes.position,n=wt(),s=yt.fork("stone"+t);for(let r=0;r<a.count;r+=3){const p=(a.getX(r)+a.getX(r+1)+a.getX(r+2))/3,u=(a.getY(r)+a.getY(r+1)+a.getY(r+2))/3,v=(a.getZ(r)+a.getZ(r+1)+a.getZ(r+2))/3,i=.78+.5*s();let l=[.105*i,.15*i,.118*i];const f=Math.sin(p*2.3+t)*Math.cos(v*1.9-t)+.25*u;u>-.05&&f>.42&&(l=Ke(l,t===2?[.3,.17,.08]:[.34,.29,.12],.75));for(let d=0;d<3;d++){const g=a.getX(r+d),h=a.getY(r+d),m=a.getZ(r+d),y=1+.3*I.n3(g*1.4+t,h*1.4,m*1.4)+.12*I.n3(g*3.7,h*3.7+t,m*3.7);ie(n,g*y*1.15,h*y*.62,m*y,Ke(l,[.02,.03,.025],h<-.2?.7:0))}}return o.dispose(),xt(n,!1)},nn=()=>{const e=wt(),t=yt.fork("tuft"),o=[.16,.09,.03],a=[.6,.47,.2];for(let n=0;n<10;n++){const s=n/10*6.2832+t.range(-.3,.3),r=t.range(.12,.5),p=t.range(.35,.62),u=Math.cos(s),v=Math.sin(s),i=ie(e,u*.05-v*.045,0,v*.05+u*.045,o),l=ie(e,u*.05+v*.045,0,v*.05-u*.045,o),f=ie(e,u*r,p,v*r,a);e.I.push(i,l,f)}return xt(e)},sn=()=>{const e=wt(),t=7,o=[.11,.06,.035],a=[.26,.13,.06];for(let n=0;n<=3;n++)for(let s=0;s<t;s++){const r=Math.max(.03,n/3*1.45),p=s/t*6.2832+n*.3,u=1+.16*Math.cos(s*2.1+n);ie(e,Math.sin(r)*Math.cos(p)*u,Math.cos(r)*.5,Math.sin(r)*Math.sin(p)*u,Ke(a,o,n/3),n<2?.8:.15)}for(let n=0;n<3;n++)for(let s=0;s<t;s++){const r=n*t+s,p=n*t+(s+1)%t;e.I.push(r,r+t,p,p,r+t,p+t)}return xt(e)};{const e=new c.Vector3,t=yt.fork("spur"),o=Math.round(2300*ke),a=Math.round(3600*ke*ht),n=Math.round(440*ke*ht),s=(i,l,f)=>{const d=t.range(i,l),g=(t()<.5?-1:1)*(-Math.log(1-t()*.97)*f),h=g+ue(d);return E(d,g,e),{a:d,p:g,x:e.x,z:e.z,y:ae(d,h),steep:Math.hypot(ae(d+1.5,h)-ae(d-1.5,h),ae(d,h+1.5)-ae(d,h-1.5))/3,rot:t()*6.28,ph:t(),basin:1}},r=i=>i.a>452&&i.a<526&&i.p>7&&i.p<37||i.a>700&&i.a<729&&i.p<-7&&i.p>-24,p=i=>Dt(i.a)>.05&&i.p>4.4&&i.p<19.5,u=i=>ea(i.a,i.p,i.x,i.z),v=i=>i.steep>.75||i.a<322&&Math.abs(i.p)>Jo(i.a)-3;for(let i=0;i<o;i++){const l=s(216,812,15),f=.16+1.25*Math.pow(t(),2.6),d=t(),g=u(l),h=g>.4;l.y<Y-2||Math.abs(l.p)>70||p(l)&&(f>.3||d<.6)||g>.5&&f<.5&&d<.8||v(l)||r(l)&&f>.24||lo(l.a,l.p,f>.45?0:-9)||(Object.assign(l,{s:f,y:l.y+f*(h?.02:.18),tint:.75+.5*t(),sway:0,tilt:t.range(-.4,.4),basin:h?2:1}),(Math.abs(l.p)<10.5&&f>.44||h&&f>.62?$.stoneA:$.stoneB).push(l))}for(let i=0;i<a;i++){const l=s(214,792,11),f=u(l);l.y<Y||Math.abs(l.p)>48||p(l)||v(l)||r(l)&&l.p<18||lo(l.a,l.p,.5)||f>.5&&(f>.95||I.n2(l.x/3.4+1.5,l.z/3.4)<.3)||$.tuft.push(Object.assign(l,{s:t.range(.8,1.7),tint:.7+.6*t(),sway:14,y:l.y-.03}))}for(let i=0;i<n;i++){const l=s(300,780,13);l.y<Y||Math.abs(l.p)>50||p(l)||u(l)>.5||v(l)||r(l)||lo(l.a,l.p,.8)||$.cush.push(Object.assign(l,{s:t.range(.3,.9),tint:.8+.5*t(),sway:0,y:l.y-.05}))}}const ha=[],fa=[];for(const[e,t,o]of[[ca(1,2),$.stoneA,"stones-near"],[ca(0,5),$.stoneB,"stones"],[nn(),$.tuft,"tussocks"],[sn(),$.cush,"cushions"]])ha.push(Ne(e,t.filter(a=>a.a<545),o)),fa.push(Ne(e.clone(),t.filter(a=>a.a>=545),o+"-col"));await T.yield();const da=(()=>{const e=[],t=[],o=[],a=[],n=[],s=(g,h,m,y,b,M)=>(e.push(g,h,m),t.push(y[0],y[1],y[2]),o.push(b[0],b[1],b[2],b[3]),a.push(M[0],M[1]),e.length/3-1),r=[.8,.83,.72],p=[.88,.9,.82],u=[.5,.54,.48],v=[.05,.04,.03],i=[.85,.36,.05],l=[[.3,.012,.004,.003],[.235,.012,.04,.018],[.14,0,.076,.06],[.02,-.005,.1,.086],[-.1,-.004,.096,.086],[-.2,.002,.066,.06],[-.27,.014,.037,.037],[-.39,.03,.026,.026],[-.49,.044,.024,.025],[-.525,.052,.032,.033],[-.556,.056,.036,.035],[-.59,.05,.028,.026],[-.612,.044,.016,.013],[-.665,.038,.004,.003]],f=10;l.forEach((g,h)=>{for(let m=0;m<f;m++){const y=m/f*6.2832,b=Math.sin(y),M=Math.cos(y),z=M>.3;let A=h<=1?z?u:p:h<=5?z?Ke(u,r,.45):r:h<=8?z?u:p:h<=11?p:i;(h===9||h===11)&&M>.1&&(A=v),h===3&&M<-.5&&(A=Ke(r,u,.4)),s(b*g[2],g[1]+M*g[3],g[0],A,[0,X((h-5)/8,0,1),0,h>=6?2:0],[0,0])}});for(let g=0;g<l.length-1;g++)for(let h=0;h<f;h++){const m=g*f+h,y=g*f+(h+1)%f;n.push(m,y,m+f,y,y+f,m+f)}for(const g of[-1,1]){const h=e.length/3,m=10,y=3;for(let b=0;b<=m;b++)for(let M=0;M<=y;M++){const z=b/m,A=M/y,V=-.13+.15*Math.pow(z,2.2),k=.115-.09*z*z*z+.02*Math.sin(Math.PI*z),j=A>.5&&z>.2||z>.7,F=j?v:A>.3?Ke(r,u,.4):r;s(g*(.06+.72*z),.045+.022*Math.sin(Math.PI*A)*(1-z),C(V,k,A),F,[g,.72*z,w(.42,.58,z),1],[z,A])}for(let b=0;b<m;b++)for(let M=0;M<y;M++){const z=h+b*(y+1)+M,A=z+y+1;n.push(z,A,z+1,z+1,A,A+1)}}const d=new c.BufferGeometry;return d.setAttribute("position",new c.Float32BufferAttribute(e,3)),d.setAttribute("aCol",new c.Float32BufferAttribute(t,3)),d.setAttribute("aW",new c.Float32BufferAttribute(o,4)),d.setAttribute("aU",new c.Float32BufferAttribute(a,2)),d.setIndex(n),d.computeVertexNormals(),d})(),ua=e=>({side:c.DoubleSide,own:{uFlap:{value:e}},vertexShader:`
        attribute vec3 aCol; attribute vec4 aW; attribute vec2 aU; attribute vec4 aI;
        uniform float uTime; uniform vec3 uFlap;      // beats a second, depth of the beat, dihedral the wings are held at
        varying vec3 vW, vN, vC; varying vec2 vU; varying float vGlow, vWing, vYoung;
        vec2 rot(vec2 p, float a){ float c = cos(a), s = sin(a); return vec2(c * p.x - s * p.y, s * p.x + c * p.y); }
        void main(){
          vec3 p = position, n = normal;
          float ph = 6.2832 * (uTime * uFlap.x - aI.x), side = aW.x;
          if (abs(side) > .5) {
            float th1 = (sin(ph) * .8 + .1) * uFlap.y + uFlap.z, th2 = (sin(ph - 1.1) * .5 - .12 - .3 * max(0., cos(ph))) * uFlap.y - uFlap.z * .7;
            vec2 wr = vec2(side * .42, .045), sh = vec2(side * .06, .045);
            float a2 = th2 * side * aW.z, a1 = th1 * side * smoothstep(0., .1, aW.y);
            p.xy = wr + rot(p.xy - wr, a2); n.xy = rot(n.xy, a2);
            p.xy = sh + rot(p.xy - sh, a1); n.xy = rot(n.xy, a1);
            p.z += aW.z * .05 * max(0., cos(ph)) * uFlap.y;
          } else {
            p.y -= sin(ph) * .018 * uFlap.y;
            if (aW.w > 1.5) { p.z -= sin(ph + .7) * .014 * aW.y; p.y += sin(ph + 1.4) * .008 * aW.y; }
          }
          vec4 wp = modelMatrix * instanceMatrix * vec4(p * aI.w, 1.);
          vW = wp.xyz; vN = mat3(modelMatrix) * (mat3(instanceMatrix) * n); vC = aCol; vU = aU; vWing = abs(side); vYoung = aI.y;
          vGlow = (.5 - .5 * cos(ph)) * uFlap.y + aI.z;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }`,fragmentShader:`
        uniform vec3 uSun, uSunCol, uSkyCol, uLamp, uLampCol, uPale; uniform vec4 uShaft;
        varying vec3 vW, vN, vC; varying vec2 vU; varying float vGlow, vWing, vYoung;
        ${lt}
        void main(){
          vec3 N = vN * inversesqrt(max(dot(vN, vN), 1e-8)); if (!gl_FrontFacing) N = -N;
          vec3 toCam = cameraPosition - vW; float dist = max(length(toCam), 1e-3); vec3 V = toCam / dist;
          vec3 alb = vC;
          float paleK = smoothstep(.2, .6, alb.g);
          alb = mix(alb, alb * vec3(.62, .64, .62), vYoung * paleK * (1. - vWing));          // grey-necked young of the year
          // incised feathers: vanes across the chord, repeating along the span, faded before they alias
          float fx = vU.x * 19. + vU.y * .8, fw = fwidth(fx), f = fract(fx);
          float vane = smoothstep(0., .14, f) * (1. - smoothstep(.86, 1., f));
          float row = smoothstep(0., .1, abs(vU.y - .34)) * smoothstep(0., .1, abs(vU.y - .64));
          alb *= mix(1., (.7 + .3 * vane) * (.78 + .22 * row), vWing * (1. - smoothstep(.2, .6, fw)));
          float hemi = N.y * .5 + .5, lam = max(dot(N, uLamp), 0.);
          vec3 light = uSkyCol * (.7 + .9 * hemi) + uLampCol * (.25 + .75 * lam) * 1.05;
          light = mix(light, vec3(dot(light, vec3(.3, .5, .2))), .45) * mix(.6, 1., smoothstep(-.35, .45, N.y));   // the underside in its own shade
          vec3 col = alb * light * 1.38;
          float c = max(dot(-V, uLamp), 0.);
          col += alb * uLampCol * c * c * vWing * .4;                                         // the wall shining through the plaque
          col += uPale * paleK * (vWing * (vGlow * vGlow * .5 + uShaft.w * 1.3) + (1. - vWing) * (.05 + uShaft.w * .7));
          col += alb * uSunCol * pow(clamp(1. - max(dot(N, V), 0.), 0., 1.), 3.) * .12;
          gl_FragColor = vec4(max(atmos(col, vW, dist, 0.), 0.), 1.);
        }`}),rn=he(ua(new c.Vector3(2.8,1,0))),bt=[],Wo=Math.round(C(9,15,(ht-.7)/.6)),ln=e=>4.4+2.5*(e-1)+.07*(e-1)*(e-1),va=e=>-(2.55+.315*(e-1)),Lo=-va(11);for(let e=1;e<=11;e++)bt.push({role:e===11?"lead":"arm",k:e,ah:e===11?35.2:ln(e),la:va(e),ve:-1.42-.03*e,rank:11-e});for(let e=1;e<=Wo;e++)bt.push({role:"left",k:11+e,ah:35.2-3.2*e,la:-(Lo+1.5*e),ve:-1.6+.05*e,rank:e});bt.push({role:"out",k:12,ah:4.2,la:2.7,ve:-1.25,rank:12},{role:"sub",k:13,ah:-7,la:4.6,ve:-1.1,rank:13});const Po=bt.length,Mt=new c.InstancedMesh(da,rn,Po);{const e=new Float32Array(Po*4),t=te.fork("skein");bt.forEach((o,a)=>{o.seed=t.range(0,6.28),e.set([o.rank*.2+t.range(-.04,.04),de&&t.chance(.4)?1:0,0,t.range(1.06,1.18)],a*4)}),da.setAttribute("aI",new c.InstancedBufferAttribute(e,4))}Mt.frustumCulled=!1,Mt.name="skein",J.add(Mt);const Ge=new c.Vector3,zt=new c.Vector3,Ye=new c.Vector3,co=new c.Vector3,Rt=new c.Vector3,At=new c.Vector3,ho=new c.Vector3,fo=new c.Vector3,pa=(e,t,o)=>{const a=w(.455,.585,t),n=w(.84,.955,t),s=w(.8,.875,t),r=Pe?2.1:1,p=t*Re,u=w(.55,.6,t)*(1-w(.71,.76,t)),v=re.uAsp.value,i=X(v/1.35,.42,1),l=(1-i)/.58,f=1-.18*l;let d=0,g=0;if(N.posAtDist(p,At),o&&!T.through){const h=o.matrixWorld.elements;ho.set(-h[8],-h[9],-h[10]).normalize(),N.posAtDist(p+30,fo).sub(At).normalize(),d=Math.atan2(ho.x,ho.z)-Math.atan2(fo.x,fo.z),d=X(Math.atan2(Math.sin(d),Math.cos(d)),-.8,.8),g=X(Math.asin(X(ho.y,-1,1))-Math.asin(X(fo.y,-1,1)),-.1,.45)}for(let h=0;h<Po;h++){const m=bt[h];let y=m.ah,b=m.la,M=m.ve;if(m.role==="lead")y=35.2-3.2*(Wo+1)*a,b=-(Lo+1.5*(Wo+1)*a+3*Math.sin(Math.PI*a)),M+=.8*Math.sin(Math.PI*a);else if(m.role==="out"){const F=Math.pow(a,.8);y=C(4.2*f,35.2,F),b=C(2.7,-Lo,a),M=-1.25-.9*Math.sin(Math.PI*a)}else m.role==="sub"?(y=C(-7,4.3*f,s),b=C(4.6,2.8,s)):m.role==="arm"&&(y*=f);if(b*=i,u>0&&b<-8&&(b=C(b,-8-.12*m.rank,u)),n>0){const F=5+3*m.k,x=(m.k&1?-.95:.95)-.25;m.role==="sub"?b=C(b,1.9,n):(y=C(y,F,n),b=C(b,x,n),M=C(M,-1.5,n))}const z=e*.45-y*.09;b+=(.3*Math.sin(e*.37+m.seed)+.5*Math.sin(z))*r*(1-.6*n)*(.5+.5*i)*(.35+.65*w(4,16,y)),M+=.2*Math.sin(e*.53+m.seed*2.3)+.28*Math.sin(e*.3-y*.07)*r-(Pe?.5:0),y+=.3*Math.sin(e*.29+m.seed*1.3);const A=p+y;if(A>Re-.6){Te.makeScale(0,0,0),Mt.setMatrixAt(h,Te);continue}N.posAtDist(A,Ge),N.tangentAtDist(A,zt),Ye.set(-zt.z,0,zt.x).normalize(),Ge.addScaledVector(Ye,b),Ge.y+=M;const V=(.95-.2*w(12,36,y))*(1-n);if(V>.001&&(d!==0||g!==0)){const F=Ge.x-At.x,x=Ge.z-At.z,S=Math.cos(d*V),L=Math.sin(d*V),q=F*S+x*L,G=-F*L+x*S;Ge.x=At.x+q,Ge.z=At.z+G,y>0&&(Ge.y+=Math.hypot(q,G)*Math.tan(g*V))}const k=.22*Math.cos(z)*r,j=Pe?-.2:0;Rt.copy(zt).addScaledVector(Ye,j).normalize(),Ye.crossVectors(Rt,jo).normalize(),co.crossVectors(Ye,Rt),Ye.addScaledVector(co,k).normalize(),co.crossVectors(Ye,Rt),zt.copy(Rt).negate(),Te.makeBasis(Ye,co,zt).setPosition(Ge),Mt.setMatrixAt(h,Te)}Mt.instanceMatrix.needsUpdate=!0};pa(0,0),await T.yield();const cn=(()=>{const e=[],t=[],o=[],a=[],n=[],s=(h,m,y,b,M,z)=>(e.push(h,m,y),t.push(b[0],b[1],b[2]),o.push(M[0],M[1],M[2],M[3]),a.push(z[0],z[1]),e.length/3-1),r=[.05,.052,.06],p=[.15,.16,.18],u=[.6,.27,.07],v=[.74,.56,.3],i=[.02,.02,.022],l=[.3,.27,.2],f=[[.27,.004,.012,.01,r,r],[.2,.002,.05,.036,r,u],[.08,-.004,.085,.066,r,u],[-.06,-.006,.092,.074,r,u],[-.19,0,.074,.062,p,u],[-.27,.012,.047,.045,v,u],[-.33,.022,.04,.041,v,v],[-.375,.024,.037,.036,i,v],[-.41,.016,.022,.024,l,i],[-.45,-.004,.004,.006,l,l]],d=9;f.forEach((h,m)=>{for(let y=0;y<d;y++){const b=y/d*6.2832,M=Math.sin(b),z=Math.cos(b);s(M*h[2],h[1]+z*h[3],h[0],z>.25?h[4]:h[5],[0,X((m-4)/5,0,1),0,m>=5?2:0],[0,0])}});for(let h=0;h<f.length-1;h++)for(let m=0;m<d;m++){const y=h*d+m,b=h*d+(m+1)%d;n.push(y,b,y+d,b,b+d,y+d)}{const h=s(-.012,-.004,-.4,i,[0,1,0,2],[0,0]),m=s(.012,-.004,-.4,i,[0,1,0,2],[0,0]),y=s(0,-.05,-.425,i,[0,1,0,2],[0,0]);n.push(h,m,y)}{const h=[[0,.2],[.085,.3],[.115,.4],[.07,.52],[0,.6],[-.07,.52],[-.115,.4],[-.085,.3]],m=s(0,.004,.4,r,[0,0,0,0],[.5,.5]),y=h.map((b,M)=>s(b[0],.004-.012*(b[1]-.2),b[1],M===4?i:r,[0,0,0,0],[b[0]*3+.5,b[1]]));for(let b=0;b<8;b++)n.push(m,y[b],y[(b+1)%8])}for(const h of[-1,1]){const m=e.length/3,y=9,b=3,M=.74,z=k=>h*(.06+.94*k),A=k=>-.125+.06*k*k,V=k=>.15-.045*k;for(let k=0;k<=y;k++)for(let j=0;j<=b;j++){const F=k/y*M,x=j/b,S=x<.34?F<.5?i:r:x>.7?p:r;s(z(F),.045+.02*Math.sin(Math.PI*x)*(1-F),C(A(F),V(F),x),S,[h,.94*F,w(.38,.52,F),1],[F,x])}for(let k=0;k<y;k++)for(let j=0;j<b;j++){const F=m+k*(b+1)+j,x=F+b+1;n.push(F,x,F+1,F+1,x,x+1)}for(let k=0;k<6;k++){const j=k/6,F=(k+.86)/6,x=C(A(M),V(M),j),S=C(A(M),V(M),F),L=.27-.022*k-(k===0?.03:0),q=(k-1.6)*.17,G=(x+S)/2,D=(S-x)*.5,U=z(M)+h*L*Math.cos(q),K=G+L*Math.sin(q),le=k<2?r:p,ne=M+L,B=s(z(M),.045,x,le,[h,.94*M,1,1],[M,j]),W=s(z(M),.045,S,le,[h,.94*M,1,1],[M,F]),P=s(U,.05,K-D*.3,i,[h,.94*ne,1,1],[ne,j]),R=s(U,.05,K+D*.3,i,[h,.94*ne,1,1],[ne,F]);n.push(B,P,W,W,P,R)}}const g=new c.BufferGeometry;return g.setAttribute("position",new c.Float32BufferAttribute(e,3)),g.setAttribute("aCol",new c.Float32BufferAttribute(t,3)),g.setAttribute("aW",new c.Float32BufferAttribute(o,4)),g.setAttribute("aU",new c.Float32BufferAttribute(a,2)),g.setAttribute("aI",new c.InstancedBufferAttribute(new Float32Array([.3,0,0,2.8]),4)),g.setIndex(n),g.computeVertexNormals(),g})(),nt=new c.InstancedMesh(cn,he(ua(new c.Vector3(.21,.1,.16))),1);nt.frustumCulled=!1,nt.name="lammergeier",J.add(nt);const hn=.604,fn=.62,kt=96,Ie=new Float32Array((kt+1)*3);let uo=1,ma=0;{const e=new c.Vector3,t=[[505,-108,168],[533,-33,166.3],[543.5,-1.5,167.2],[553,26,171.6],[571,45,177],[612,56,188],[680,62,216]].map(([n,s,r])=>(E(n,s,e),new c.Vector3(e.x,r,e.z))),o=new c.CatmullRomCurve3(t,!1,"centripetal");o.arcLengthDivisions=400,uo=o.getLength();let a=1e9;for(let n=0;n<=kt;n++){o.getPointAt(n/kt,e),Ie[n*3]=e.x,Ie[n*3+1]=e.y,Ie[n*3+2]=e.z;const s=e.distanceTo(t[2]);s<a&&(a=s,ma=n/kt*uo)}}const Ut=new c.Vector3,Bo=new c.Vector3,St=new c.Vector3,$e=new c.Vector3,st=new c.Vector3,Ht=new c.Vector3,ga=e=>ma+fn*(e-hn)*Re,vo=(e,t)=>{const o=X(e/uo,0,1)*kt,a=Math.min(Math.floor(o),kt-1),n=o-a,s=a*3;return t.set(C(Ie[s],Ie[s+3],n),C(Ie[s+1],Ie[s+4],n),C(Ie[s+2],Ie[s+5],n))},dn=(e,t)=>vo(ga(e),t),wa=(e,t)=>{const o=ga(t);if(t<.5||t>.705||o<3||o>uo-3){Te.makeScale(0,0,0),nt.setMatrixAt(0,Te),nt.instanceMatrix.needsUpdate=!0;return}vo(o,Ut),vo(o+2.5,Bo),vo(o-2.5,Ht),St.subVectors(Bo,Ht),st.subVectors(Bo,Ut),$e.subVectors(Ut,Ht);const a=Math.atan2(st.x,st.z)-Math.atan2($e.x,$e.z);St.normalize();const n=X(Math.atan2(Math.sin(a),Math.cos(a))*14,-.65,.65)+.06*Math.sin(e*.8);Ut.y+=.2*Math.sin(e*.6),$e.crossVectors(St,jo).normalize(),st.crossVectors($e,St),$e.addScaledVector(st,n).normalize(),st.crossVectors($e,St),Ht.copy(St).negate(),Te.makeBasis($e,st,Ht).setPosition(Ut),nt.setMatrixAt(0,Te),nt.instanceMatrix.needsUpdate=!0};wa(0,0),await T.yield();const qo=e=>"#"+e.getHexString(),je={sunDir:[Be.x,Be.y,Be.z],sunColor:qo(Q.lamp),sunIntensity:Wt?2.6:2.3,sky:qo(Q.fill),skyIntensity:Wt?3:2.3,ground:qo(Q.cloud),groundIntensity:.6},We=ce.makeFauna(J,{light:je});await T.yield();const _e=te.fork("fauna"),Et=(ht-.7)/.6,xa=e=>{const t=e.h,o=e.bodyLen*t,a=o/2,n=-o/2,s=e.depth*t/2,r=e.neckAng*Math.PI/180,p=e.neckLen*t,u=e.headPitch*Math.PI/180,v=e.headR*t,i=e.headLen*t,l=[0,t+s*.25,a+.02*o],f=[0,l[1]+Math.sin(r)*p,l[2]+Math.cos(r)*p];return{H:t,hr:v,hl:i,ry:s,bl:o,pivot:[0,l[1]-s*.2,l[2]],tail:[0,t*e.hip-s*.25,n-.3*s],at:(d,g,h)=>[d,g*Math.cos(u)-h*Math.sin(u)+f[1]+v*.25,g*Math.sin(u)+h*Math.cos(u)+f[2]+v*.1]}},ya=(e,t)=>{const o=new c.BufferGeometry,a=e.attributes.position.count;for(const[p,u]of[["position",3],["normal",3],["color",3],["aAnim",4],["aPivot",3],["aGlow",1]]){const v=new Float32Array((a+t.attributes.position.count)*u);v.set(e.attributes[p].array,0),v.set(t.attributes[p].array,a*u),o.setAttribute(p,new c.BufferAttribute(v,u))}const n=e.index.array,s=t.index.array,r=new Uint32Array(n.length+s.length);r.set(n,0);for(let p=0;p<s.length;p++)r[n.length+p]=s[p]+a;return o.setIndex(new c.BufferAttribute(r,1)),o.computeBoundingSphere(),e.dispose(),t.dispose(),o},rt={...ce.HERD_PRESETS.antelope,h:.9,bodyLen:1.16,width:.44,depth:.54,hip:1,chest:1.12,leg:[.078,.054,.038],neckLen:.3,neckAng:40,neck:[.21,.14],headLen:.29,headR:.1,headPitch:24,ears:.09,horns:0,antlers:0,tail:.14,tailType:"thin",coat:"#8f5c38",belly:"#e0cfae",legs:"#2c1e16",sock:"#cdb490",accent:"#2a1c14",horn:"#3a3226",pattern:"band",speed:1.3,stride:.9,varieties:0},ba=e=>{const t=xa(e),o=new ce.Geo,a=.56*t.H,n=new c.Color("#2b261d"),s=new c.Color("#7a6c50");for(const r of[-1,1]){const p=r*t.hr*.42,u=[[p,t.hr*.7,-.04*t.hl],[p+r*a*.2,t.hr+a*.3,-.1*t.hl],[p+r*a*.52,t.hr+a*.44,-.1*t.hl-a*.1],[p+r*a*.84,t.hr+a*.4,-.1*t.hl-a*.32],[p+r*a*1.02,t.hr+a*.27,-.1*t.hl-a*.56],[p+r*a*1.04,t.hr+a*.2,-.1*t.hl-a*.72]];o.tube(u.map(v=>t.at(v[0],v[1],v[2])),[.066*t.H,.062*t.H,.054*t.H,.042*t.H,.026*t.H,0],6,n,s)}return o.anim([0,o.n],()=>[1,0,2,0]),o.pivot([0,o.n],t.pivot[0],t.pivot[1],t.pivot[2]),o.glow([0,o.n],1),ya(ce.quadrupedGeometry(e),o.build())},Ct=ba(rt);await T.yield();const Do={...ce.HERD_PRESETS.deer,h:.62,bodyLen:1.95,width:.52,depth:.54,hip:.96,chest:1.05,leg:[.125,.092,.072],hoofFlare:1.55,hoof:"#d8d8c8",neckLen:.24,neckAng:14,neck:[.26,.22],headLen:.42,headR:.2,headPitch:8,ears:.07,tail:.02,tailType:"thin",antlers:0,horns:0,graze:0,coat:"#e9eadb",belly:"#f4f4ea",legs:"#e2e2d2",sock:"#ecece0",accent:"#7a4426",horn:"#000000",pattern:"spots",speed:2.2,stride:1.3,count:1,varieties:0},un=(()=>{const e=xa(Do),t=new ce.Geo,o=e.H,a=1.8*o,[,n,s]=e.tail,r=new c.Color("#e6e8d8"),p=new c.Color("#5e3520"),u=[[0,0,.07],[-.07,.14,.085],[-.15,.3,.092],[-.2,.46,.095],[-.21,.62,.095],[-.17,.78,.09],[-.09,.92,.08],[0,1.02,.06],[.03,1.06,0]],v=t.tube(u.map(i=>[0,n+i[0]*a,s-i[1]*a]),u.map(i=>i[2]*o),8,r,r);return t.paint(v,(i,l,f,d)=>{const g=(s-f)/a;(Math.sin(g*26)>.45||g>.9)&&d.copy(p)}),t.anim(v,(i,l,f)=>[0,X((s-f)/a,0,1),3,0]),t.pivot(v,0,n,s),t.glow(v,1),ya(ce.quadrupedGeometry(Do),t.build())})();await T.yield();const No=.7;{const e=_e.fork("run"),t=Math.round(C(5,7,Et));for(let o=0;o<t;o++)We.add(ce.makeHerd({rng:e.fork("r"+o),preset:rt,geometry:o?Ct.clone():Ct,count:1,size:1.7+.1*(o*3%4-1.5),sizes:[1],mode:"migrate",gait:"run",speed:2,heightAt:_,spread:[.01,.01],cross:{path:N,u:No,lead:13.5+7.2*o+e.range(-1.2,1.2),offset:8.5+(o&1?1.5:-1.3)+e.range(-.4,.4),angle:0,side:1,span:120,bow:0,height:0,duration:wo},light:je})),await T.yield()}We.add(ce.makeHerd({rng:_e.fork("leo"),preset:Do,geometry:un,count:1,size:1.95,sizes:[1],mode:"migrate",gait:"run",speed:2.2,heightAt:_,spread:[.01,.01],cross:{path:N,u:No,lead:7.5,offset:12.7,angle:0,side:1,span:120,bow:0,height:0,duration:wo},light:je,fill:.55})),await T.yield();{const e=new c.Vector3,t=jt.fork("lookout");for(const[o,a,n]of[[709.6,-12.3,2.15],[715.2,-15.8,2],[720.6,-12.7,2.1]])E(o,a,e),We.add(ce.makeHerd({rng:t.fork("b"+o),preset:rt,geometry:Ct.clone(),count:1,size:n,sizes:[1],center:[e.x,0,e.z],radius:.2,roam:.3,heightAt:_,light:je,fill:.55,rim:.9})),await T.yield()}{const e=se.clone().addScaledVector(xe,-62).addScaledVector(pe,_e.chance(.5)?-40:-37);We.add(ce.makeHerd({rng:_e.fork("graze"),preset:rt,geometry:Ct.clone(),count:Math.round(C(4,8,Et)),size:1.5,center:[e.x,0,e.z],radius:10,heightAt:_,path:N,clear:13,light:je}))}await T.yield();const Ma={body:"#15110e",belly:"#1c1613",wingC:"#100d0b",beak:"#e8c020"};We.add(ce.makeFlock({rng:_e.fork("choughs"),species:"crows",count:Math.round(C(24,36,Et)),center:[se.x+xe.x*16,so+43,se.z+xe.z*16],radius:24,height:4,spread:[14,5,14],...Ma,light:je})),await T.yield(),We.add(ce.makeFlock({rng:_e.fork("escort"),species:"crows",count:6,spread:[3,1.6,6],along:{path:N,side:-4.6,up:3.2,lead:10,from:.83,to:1.03},...Ma,light:je})),await T.yield();{const e=E(296,0,new c.Vector3);We.add(ce.makeFlock({rng:_e.fork("lammergeier"),species:"eagles",count:go?3:2,size:3.1,center:[e.x,170,e.z],spread:[12,9,16],soarRadius:15,radius:9,height:3,body:"#2a2018",belly:"#b06a30",light:je}),{always:!0})}await T.yield();{const e=new c.Vector3,t=_e.fork("terrace"),o=[[461.5,12.3,2.35],[470.5,12.8,2.3],[481,12.4,2.3],[477,24,2.4],[496,12.6,2.6],[506.5,12.2,2.4],[503,22.5,2.7],[467,26,2.5],[489,20.5,1.6],[514,18.5,2.3],[485,28.5,2.3]],a=Math.round(C(8,11,Et));for(let s=0;s<a;s++){const[r,p,u]=o[s];E(r,p,e),We.add(ce.makeHerd({rng:t.fork("b"+s),preset:rt,geometry:Ct.clone(),count:1,size:u,sizes:[1],center:[e.x,0,e.z],radius:.25,roam:.42,heightAt:_,light:je,fill:.55,rim:.9})),await T.yield()}const n=go?{...rt,h:1,coat:"#5a3a24",belly:"#8a6a48",legs:"#1e1410",sock:"#5e4630",neck:[.26,.17]}:rt;E(246,Ee(246)+10+8*tt(246),e),We.add(ce.makeHerd({rng:_e.fork("valley"),preset:n,geometry:go?ba(n):Ct.clone(),count:Math.round(C(4,6,Et)),size:1.7,center:[e.x,0,e.z],radius:5.5,roam:.45,heightAt:_,path:N,clear:5,light:je}))}await T.yield();const Go=N.startTangent.clone().setY(0).normalize(),vn=new c.Vector3(-Go.z,0,Go.x),za=(e,t,o,a,n,s)=>{const r=new c.BufferGeometry,p=new Float32Array(e*3),u=new Float32Array(e*3);for(let i=0;i<e;i++)t(i,p,u);r.setAttribute("position",new c.BufferAttribute(p,3)),r.setAttribute("aR",new c.BufferAttribute(u,3));const v=new c.Points(r,he({own:o,transparent:!0,depthWrite:!1,blending:s?c.AdditiveBlending:c.NormalBlending,vertexShader:a,fragmentShader:n}));return v.frustumCulled=!1,v.renderOrder=4,J.add(v),v};{const e=te.fork("petals");za(Math.round(1500*ke),(t,o,a)=>{o[t*3]=e.range(0,265),o[t*3+1]=e.range(-40,40),o[t*3+2]=e.range(80,127),a[t*3]=e(),a[t*3+1]=e.range(.15,.34),a[t*3+2]=e()},{uO:{value:me.clone()},uDg:{value:Go},uRg:{value:vn},uPetal:{value:de?new c.Color(.8,.5,.06):new c.Color(.86,.1,.06)}},`
          attribute vec3 aR; uniform float uTime, uVH, uGale; uniform vec3 uO, uDg, uRg;
          varying float vA, vS;
          void main(){
            float g = mod(position.x - uTime * (8. + 8. * aR.x) * (1. + .6 * uGale), 265.) - 15.;
            float lat = position.y + sin(uTime * .9 + aR.x * 30.) * 1.7 + sin(g * .05 + aR.z * 6.) * 3.;
            vec3 wp = uO + uDg * g + uRg * lat;
            wp.y = position.z + sin(uTime * 1.3 + aR.z * 50.) * 1.1 + max(0., g - 150.) * .36 - (250. - g) * .012;
            vec4 mv = viewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mv;
            float px = aR.y * uVH * projectionMatrix[1][1] / (2. * max(gl_Position.w, .05));
            gl_PointSize = clamp(px, 1.6, 26.);
            vA = smoothstep(-15., 0., g) * (1. - smoothstep(232., 250., g)) * clamp(px / 1.6, .25, 1.) * smoothstep(.7, 2.2, gl_Position.w);
            vS = aR.z * 6.283 + uTime * (2. + 3. * aR.x);
          }`,`
          uniform vec3 uPetal, uSkyCol, uLampCol; varying float vA, vS;
          void main(){
            vec2 q = gl_PointCoord - .5; float c = cos(vS), s = sin(vS); q = vec2(c * q.x - s * q.y, s * q.x + c * q.y);
            q.y *= 1.5 + 1.4 * abs(sin(vS * 1.7));                       // tumbling: the petal turns edge-on
            float a = (1. - smoothstep(.3, .5, length(q))) * vA;
            gl_FragColor = vec4(uPetal * (uSkyCol * 1.6 + uLampCol * .9 + .15) * (1.1 + .5 * sin(vS * 1.7)), a);
          }`,!1)}{const e=te.fork("spindrift"),t=new c.Vector3;za(Math.round((Pe?1500:760)*ke),(o,a,n)=>{const s=e()<(Pe?.7:.55)?e.range(Pe?462:556,760):e.range(748,ve+45),r=e.range(-60,60)*(s<748?.5:1);E(s,r,t),a[o*3]=t.x,a[o*3+1]=_(t.x,t.z)+e.range(.25,1.7),a[o*3+2]=t.z,n[o*3]=e(),n[o*3+1]=e.range(1.6,3.8)*(s<640?.6:1),n[o*3+2]=e()},{},`
          attribute vec3 aR; uniform float uTime, uVH, uGale, uAsp; uniform vec3 uWind;
          varying float vA; varying vec2 vDir;
          void main(){
            float life = fract(uTime * (.1 + .1 * aR.x) * (1. + uGale) + aR.z);
            vec3 wp = position + uWind * ((life - .5) * 18. * (1. + uGale)) + vec3(0., life * life * (1.2 + uGale), 0.);
            gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
            float px = aR.y * (.6 + life) * uVH * projectionMatrix[1][1] / (2. * max(gl_Position.w, .05));
            gl_PointSize = clamp(px * 1.7 * (1. + .5 * uGale), 2., 190.);
            vA = sin(life * 3.1416) * smoothstep(5., 14., gl_Position.w) * min(1., 150. / max(px, 1.)) * (.6 + .4 * aR.x);
            vec4 c2 = projectionMatrix * viewMatrix * vec4(wp + uWind, 1.); vec2 sd = c2.xy / max(c2.w, .05) - gl_Position.xy / max(gl_Position.w, .05); sd.x *= uAsp;
            vDir = sd * inversesqrt(max(dot(sd, sd), 1e-8));
          }`,`
          uniform vec3 uSnowCol, uSkyCol, uLampCol; uniform float uGale; varying float vA; varying vec2 vDir;
          void main(){ vec2 q = gl_PointCoord - .5; q.y = -q.y; q = vec2(dot(q, vDir), dot(q, vec2(-vDir.y, vDir.x)) * 5.2); float d = dot(q, q) * 4.; float a = exp(-d * 5.) * (1. - smoothstep(.7, 1., d)) * vA * .24 * (1. + 1.1 * uGale);
            gl_FragColor = vec4(uSnowCol * (uSkyCol * 1.2 + uLampCol * 1.1), a); }`,!1)}let Ft=null;{const e=jt.fork("ribbons"),t=22,o=new c.Vector3,a=[],n=[],s=[],r=[],p=[],u=He.clone().multiplyScalar(.55).addScaledVector(pe,.85).setY(0).normalize(),v=(f,d,g,h,m,y,b,M,z,A,V)=>{const k=a.length/3,j=e.range(0,60);for(let F=0;F<=t;F++){const x=F/t,S=f+h.x*m*x,L=g+h.z*m*x,q=V?_(S,L)+.3+.7*x:d;for(const G of[-1,1])a.push(S,q,L),n.push(x,G,m,j),s.push(y,b,M,z),r.push(h.x,h.z,A)}for(let F=0;F<t;F++){const x=k+F*2;p.push(x,x+1,x+2,x+1,x+3,x+2)}},i=Math.round((Pe?26:18)*(.6+.4*ke));for(let f=0;f<i;f++){const d=664+(f+e.range(-.3,.3))*(188/i),g=e.range(-32,-12);E(d,g,o),v(o.x,0,o.z,u,e.range(32,50),.3,e.range(.9,1.6),0,e.range(.42,.6),e.range(1.6,2.6),!0)}await T.yield();for(let f=0;f<6;f++){const d=(f&1?1:-1)*e.range(17,50);E(ve-e.range(56,78),d,o),v(o.x,_(o.x,o.z)+.6,o.z,u,e.range(34,52),1,e.range(5,7.5),e.range(.16,.26),e.range(.3,.42),e.range(.8,1.3),!1)}for(const f of So)v(f[0],_(f[0],f[1])+f[2]-1,f[1],He,e.range(26,34),.8,e.range(4.5,6.5),.12,.4,1.1,!1);v(se.x,so+24.2*ro-.8,se.z,He,30,1,6,.1,.36,1.2,!1);{const f=se.clone().addScaledVector(xe,540);v(f.x+pe.x*4,Fo-4,f.z+pe.z*4,He,260,10,70,.1,.6,.5,!1)}E(600.2,5,o),v(o.x,_(o.x,o.z)+49,o.z,He,28,.8,5.5,.1,.36,1.1,!1);const l=new c.BufferGeometry;l.setAttribute("position",new c.Float32BufferAttribute(a,3)),l.setAttribute("aP",new c.Float32BufferAttribute(n,4)),l.setAttribute("aQ",new c.Float32BufferAttribute(s,4)),l.setAttribute("aR",new c.Float32BufferAttribute(r,3)),l.setIndex(p),Ft=new c.Mesh(l,he({transparent:!0,depthWrite:!1,side:c.DoubleSide,vertexShader:`
          attribute vec4 aP, aQ; attribute vec3 aR; uniform float uTime, uVH, uGale;
          varying vec2 vUv; varying vec4 vK; varying float vDist;
          void main(){
            float t = aP.x, len = aP.z; vec3 dir = normalize(vec3(aR.x, 1e-4, aR.y)), lat = vec3(-dir.z, 0., dir.x);
            vec3 p = position;
            p.y += aQ.z * len * t * t + sin(t * 6. - uTime * 1.1 + aP.w) * (.2 + .012 * len * aQ.z * 4.) * t;
            p += lat * (sin(t * 4.3 - uTime * .8 + aP.w * 1.7) * (.5 + .04 * len) * t);
            vec3 view = cameraPosition - p, side = cross(dir, view); side *= inversesqrt(max(dot(side, side), 1e-8));
            vec4 c = projectionMatrix * viewMatrix * vec4(p, 1.);
            float mpp = max(c.w, .1) * 2. / (projectionMatrix[1][1] * uVH);
            float wd = max(mix(aQ.x, aQ.y, sqrt(t)) * (1. + .4 * uGale), 2.5 * mpp);
            p += side * (aP.y * wd * .5);
            vUv = vec2(t, aP.y); vK = vec4(len, aP.w, aQ.w * (1. + .5 * uGale), aR.z); vDist = c.w;
            gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
          }`,fragmentShader:`
          uniform vec3 uSnowCol, uSkyCol, uLampCol, uSunCol, uFogCol; uniform float uTime, uFogD;
          varying vec2 vUv; varying vec4 vK; varying float vDist;
          ${Ae}
          void main(){
            float t = vUv.x, e = vUv.y, sc = max(3.2, vK.x / 13.);
            vec3 q = vec3(t * vK.x / sc - uTime * vK.w, e * 1.3 + vK.y, vK.y * 3. + uTime * .07);
            float n = jn(q) * .62 + jn(q * 2.6 + 5.) * .38;
            float edge = 1. - e * e; edge *= edge;
            float a = edge * smoothstep(0., .12, t) * pow(max(1. - t, 0.), .8) * smoothstep(.42, .82, n + .2 * (1. - t)) * vK.z * smoothstep(7., 24., vDist);
            if (a < .004) discard;
            vec3 col = uSnowCol * (uSkyCol * 1.3 + uLampCol * 1.45) + uSunCol * .06;
            col = mix(col, vec3(dot(col, vec3(.3, .5, .2))), .4) * (.8 + .35 * n);
            gl_FragColor = vec4(mix(col, uFogCol, 1. - exp(-vDist * uFogD)), min(a, .7));
          }`})),Ft.frustumCulled=!1,Ft.renderOrder=4,Ft.name="spindrift-ribbons",J.add(Ft)}let Vt=null;{const e=se.clone().addScaledVector(xe,512).addScaledVector(pe,4),t=new c.PlaneGeometry(2,2);Vt=new c.Mesh(t,he({transparent:!0,depthWrite:!1,blending:c.AdditiveBlending,own:{uAt:{value:new c.Vector3(e.x,Fo-14,e.z)}},vertexShader:`
          uniform vec3 uAt; varying vec2 vQ;
          void main(){ vQ = position.xy; vec4 mv = viewMatrix * vec4(uAt, 1.); mv.xy += position.xy * vec2(150., 100.); gl_Position = projectionMatrix * mv; }`,fragmentShader:`
          uniform vec3 uSunCol, uApple, uPale; uniform float uNight; varying vec2 vQ;
          void main(){
            vec2 q = vQ; q.y += .22 * q.x * q.x;
            float r = length(q * vec2(1., 1.5)), core = exp(-r * r * 26.), halo = exp(-r * 5.) * (1. - smoothstep(.6, 1., length(vQ)));
            float ray = exp(-abs(q.y) * 22.) * exp(-abs(q.x) * 3.2) * (1. - smoothstep(.6, 1., abs(vQ.x)));
            vec3 c = min(uSunCol * mix(uApple, uPale, .85), vec3(1.5));
            gl_FragColor = vec4(c * (core * .8 + halo * .34 + ray * .22) * mix(1., .55, uNight), 1.);
          }`})),Vt.frustumCulled=!1,Vt.renderOrder=3,Vt.name="horn-glare",J.add(Vt)}await T.yield();{const e=te.fork("water"),t=Math.round(24*(.5+.5*ke)),o=22,a=[],n=[],s=[],r=[],p=new c.Vector3,u=[];for(let m=0;m<t;m++){const y=e.range(12,288),b=e.chance(.5)?1:-1,M=C(38,19,w(215,300,y)),z=e.range(34,58),A=e.range(0,10),V=a.length/3;u.length=0;for(let k=0;k<=o;k++){const j=z*(1-k/o)+1,F=y+1.2*Math.sin(k*.9+A),x=b*(M+j);E(F,x,p),u.push(p.x-oe.x*b*.3,ae(F,x+ue(F))+.3,p.z-oe.y*b*.3)}for(let k=0;k<=o;k++){const j=Math.min(k+1,o),F=j-1;for(const x of[-1,1])a.push(u[k*3],u[k*3+1],u[k*3+2]),n.push(u[j*3]-u[F*3],u[j*3+1]-u[F*3+1],u[j*3+2]-u[F*3+2]),s.push(k/o,x,A)}for(let k=0;k<o;k++){const j=V+k*2;r.push(j,j+1,j+2,j+1,j+3,j+2)}}const v=new c.BufferGeometry;v.setAttribute("position",new c.Float32BufferAttribute(a,3)),v.setAttribute("aDir",new c.Float32BufferAttribute(n,3)),v.setAttribute("aT",new c.Float32BufferAttribute(s,3)),v.setIndex(r);const i=new c.Mesh(v,he({transparent:!0,depthWrite:!1,side:c.DoubleSide,vertexShader:`
          attribute vec3 aDir, aT; uniform float uVH; varying vec3 vT; varying float vDist;
          void main(){
            vec3 view = cameraPosition - position, side = cross(normalize(aDir + vec3(0., 1e-4, 0.)), view) + vec3(1e-5, 0., 0.);
            side *= inversesqrt(max(dot(side, side), 1e-8));
            vec4 c = projectionMatrix * viewMatrix * vec4(position, 1.);
            float mpp = max(c.w, .1) * 2. / (projectionMatrix[1][1] * uVH);          // metres per pixel here: never thinner than 1.7 px
            vec3 wp = position + side * aT.y * max(.3, 1.7 * mpp) * .5;
            vT = aT; vDist = c.w; gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
          }`,fragmentShader:`
          uniform vec3 uSkyCol, uLampCol, uFogCol; uniform float uTime, uFogD; varying vec3 vT; varying float vDist;
          void main(){
            float f = fract(vT.x * 4. - uTime * .45 + vT.z), g = smoothstep(.7, .92, f) * (1. - smoothstep(.92, 1., f));
            vec3 col = (uSkyCol * 2.2 + uLampCol * .6) * (.34 + 1.5 * g);
            float a = (1. - vT.y * vT.y) * (.36 + .5 * g) * smoothstep(0., .08, vT.x);
            gl_FragColor = vec4(mix(col, uFogCol, 1. - exp(-vDist * uFogD)), a);
          }`}));i.name="meltwater",i.renderOrder=3,i.frustumCulled=!1,J.add(i);const l=[],f=[],d=[];for(let m=-64,y=0;m<=215;m+=m<134?4:2,y++){const b=Ee(m),M=w(136,166,m),z=b+ue(m),A=ae(m,z),V=X(Math.abs(ae(m+2,z)-ae(m-2,z))/4*1.3-.2,0,1);for(const k of[-1,1])E(m,b+k*C(3.4,2.5,M),p),l.push(p.x,A+C(1,.75,M),p.z),f.push(m,k,V);if(y){const k=(y-1)*2;d.push(k,k+1,k+2,k+1,k+3,k+2)}}const g=new c.BufferGeometry;g.setAttribute("position",new c.Float32BufferAttribute(l,3)),g.setAttribute("aU",new c.Float32BufferAttribute(f,3)),g.setIndex(d);const h=new c.Mesh(g,he({side:c.DoubleSide,vertexShader:"attribute vec3 aU; varying vec3 vU; varying vec3 vW; void main(){ vU = aU; vW = position; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.); }",fragmentShader:`
          uniform vec3 uSkyCol, uLampCol; uniform float uTime; varying vec3 vU; varying vec3 vW;
          ${Ae}
          ${lt}
          void main(){
            float n = jn(vec3(vU.y * 2.4, vU.x * .3 + uTime * 2.4, 1.)) * .6 + jn(vec3(vU.y * 6., vU.x * .9 + uTime * 4.2, 5.)) * .4;
            float foam = max(smoothstep(.36, .7, n) * (1. - vU.y * vU.y * .7), vU.z * (.5 + .5 * n) * (1. - vU.y * vU.y * .45));
            vec3 col = mix(vec3(.02, .07, .07), (uSkyCol * 2.4 + uLampCol * .9), foam);
            gl_FragColor = vec4(atmos(col, vW, length(cameraPosition - vW), 0.), 1.);
          }`}));h.name="torrent",J.add(h)}await T.yield();let Xe=null;const Ze=new c.Vector3,Io=N.pointAt(.5),Ot=N.tangentAt(.5).setY(0).normalize(),Aa=new c.Vector3(-Ot.z,0,Ot.x);if(Pa){const e=new c.BufferGeometry,t=[],o=[];for(let a=0;a<=16;a++)if(t.push(-1,a/16,0,1,a/16,0),a){const n=(a-1)*2;o.push(n,n+1,n+2,n+1,n+3,n+2)}e.setAttribute("position",new c.Float32BufferAttribute(t,3)),e.setIndex(o),Xe=new c.Mesh(e,he({transparent:!0,depthWrite:!1,side:c.DoubleSide,blending:c.AdditiveBlending,own:{uFrom:{value:new c.Vector3},uTo:{value:new c.Vector3}},vertexShader:`uniform vec3 uFrom, uTo; varying vec2 vUv; varying float vD;
          void main(){
            vec3 c = mix(uFrom, uTo, position.y), axis = normalize(uTo - uFrom), view = c - cameraPosition; float dist = max(length(view), 1e-3);
            vec3 side = cross(axis, view / dist); side *= inversesqrt(max(dot(side, side), 1e-4));
            vUv = position.xy; vD = dist; gl_Position = projectionMatrix * viewMatrix * vec4(c + side * position.x * 24., 1.);
          }`,fragmentShader:`uniform vec3 uSunCol; uniform vec4 uShaft; uniform float uTime; varying vec2 vUv; varying float vD;
          ${Ae}
          void main(){
            float e = 1. - vUv.x * vUv.x, dust = .75 + .5 * jn(vec3(vUv.x * 3., vUv.y * 40. - uTime * .15, 2.));
            float a = e * e * smoothstep(0., .3, vUv.y) * (1. - smoothstep(.97, 1., vUv.y)) * smoothstep(40., 150., vD) * dust;
            gl_FragColor = vec4(uSunCol * .26 * a * uShaft.z, 1.);
          }`})),Xe.frustumCulled=!1,Xe.renderOrder=5,Xe.name="sun-shaft",J.add(Xe)}const pn=eo.clone().setY(C(Y,eo.y,.62)),mn=eo.clone().setY(C(Y,eo.y,.42)),gn=(()=>{const e=No*Re+13,t=N.posAtDist(e),o=N.tangentAtDist(e).setY(0).normalize();return t.addScaledVector(new c.Vector3(-o.z,0,o.x),10.5),t.y=_(t.x,t.z)+3.2,t})(),wn=se.clone().setY(so+15),_o=new c.Vector3,xn=(e,t)=>(N.posAtDist(t*Re+42,_o),_o.y-=10,_o),Tt=new c.Vector3,yn=(e,t)=>{N.posAtDist(t*Re,Tt);const o=Math.max(471,Lt(Tt.x,Tt.z)+18);return E(o,16.5-4.5*w(.52,.55,t)-12*w(.555,.6,t),Tt),Tt.y=C(Ho+5.5,dt(o)-2.5,w(.53,.6,t)),Tt},bn=new c.Vector3,Mn=(e,t)=>dn(Math.min(t,.612),bn),zn=Yo.clone().setY(C(Y,Yo.y,Ba)),ka=(e,t,o,a)=>w(t,t+a,e)*(1-w(o-a,o,e)),po=new c.Vector2;return{scene:J,path:N,duration:wo,ride:"none",style:"none",pace:e=>1-.2*ka(e,.36,.63,.08)-.1*ka(e,.66,.77,.04),title:Se==="night"?"The Jade Range, Full Moon":Se==="sunrise"?"The Jade Range, Sunrise":"The Jade Range",camera:{fov:62,near:.4,far:9e3,lookAhead:30,sway:.6,bank:.8},pois:[{at:pn,from:.03,to:.24,weight:.3},{at:xn,from:.17,to:.36,weight:.3},{at:zn,from:.3,to:.535,weight:.62,fade:.25},{at:yn,from:.445,to:.6,weight:.8},{at:Mn,from:.565,to:.632,weight:.55},{at:mn,from:.655,to:.8,weight:.36},{at:gn,from:.63,to:.765,weight:.8},{at:wn,from:.72,to:1,weight:.6}],portal:{shape:"circle",radius:9.5,color:Q.portal,glow:.9,revealDistance:420},post:{exposure:Q.exposure,bloom:{strength:.3,radius:.55,threshold:.92},grade:{saturation:1.08,contrast:1.05,tint:Se==="sunrise"?"#fff4e6":Se==="night"?"#e8f0ff":"#f4fbf2",shadowTint:Se==="night"?"#02060c":"#04100c",vignette:.3,grain:.02,aberration:0}},update(e,t,o,a){re.uTime.value=t,re.uProg.value=a,re.uVeil.value.set(He.x*t*15,He.z*t*15,.26),re.uSun.value.copy(Je).lerp(Na,a).normalize(),T.renderer&&(T.renderer.getDrawingBufferSize(po),re.uVH.value=po.y,re.uAsp.value=po.x/Math.max(po.y,1)),O.anchors.skeinLine.minPx.value=Math.max(11,.034*re.uVH.value),O.setProgress(a),O.setLift(1-w(.1,.3,a)),Xo(a),O.update(e,t,o),It.position.setFromMatrixPosition(o.matrixWorld),pa(t,a,o),wa(t,a),We.update(e,t,o,a);for(const n of ha)n&&(n.visible=a>.12);for(const n of fa)n&&(n.visible=a>.33);Qe[3]&&(Qe[3].visible=a>.12&&a<.6),Qe[6]&&(Qe[6].visible=a>.33),Qe[0]&&(Qe[0].visible=a<.245);for(const n of[1,2,4,5])Qe[n]&&(Qe[n].visible=a<.39);if($a.visible=a<.39,Xa.visible=a>.3,Vt.visible=a>.3,Ft.visible=a>.5,Xe){const n=w(.455,.48,a)*(1-w(.54,.565,a)),s=X((a-.455)/.11,0,1),r=a*Re,p=r+C(160,-35,s);N.posAtDist(p,Ze),N.tangentAtDist(p,Ot),Aa.set(-Ot.z,0,Ot.x).normalize(),Ze.addScaledVector(Aa,C(190,-80,Math.pow(s,.9))).setY(Y),N.posAtDist(r+14,Io);const u=Math.hypot(Ze.x-Io.x,Ze.z-Io.z);re.uShaft.value.set(Ze.x,Ze.z,n*(Wt?.3:1),n*(1-w(14,50,u))*(Wt?.45:1)),Xe.material.uniforms.uTo.value.copy(Ze),Xe.material.uniforms.uFrom.value.copy(Ze).addScaledVector(re.uSun.value,1100)}},dispose(){O.dispose&&O.dispose()}}}};export{Gn as default};
