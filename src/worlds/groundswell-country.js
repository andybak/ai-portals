import*as t from"three";import{makePath as v0,clamp as Ve,lerp as at,smoothstep as ie}from"../kit/core.js";import{makeSky as m0,makeCloudField as p0}from"../kit/sky.js";import{buildHero as g0}from"../parts/groundswell-country.js";const Le=Math.PI*2,He=Math.PI/180,ee={x:-1100,z:1290},s0=1680,Tt=190,St=[0,170,562,788,1049,1361,1680],n0=[0,5,12,20,25.5,36,46],Xe={r:168,w:80,h0:25,h1:9},r0=.12,i0=.78,Nt=[300,640],Ee={x:-450,z:900,r0:1e3,r1:2600,k:0},et=292;function qt(h){if(h<=0)return h/34;for(let y=1;y<St.length;y++)if(h<=St[y])return at(n0[y-1],n0[y],(h-St[y-1])/(St[y]-St[y-1]));return 46+(h-s0)/32}const y0=h=>(qt(h-30)+2*qt(h)+qt(h+30))/4;function x0(h,y){const me={x:0,y:0,z:0,nx:0,ny:1,nz:0,J:1},le={hs:1,ys:1,nf:1,bow:0,dbr:0,ux:0,uz:0},V=(Z,ve)=>{const ke=Z-ee.x,_=ve-ee.z,O=Math.hypot(ke,_),l=ie(-.2,.5,-_/Math.max(O,1)),Fe=1-ie(180,300,O),De=(1-l)*(1-ie(180,620,O)),o=Math.max(O-Xe.r,0)/Xe.w,te=ie(.5,.92,-_/Math.max(O,1))*Math.exp(-o*o);return le.hs=ie(200,330,O),le.ys=(1+r0*Fe*l)*(1-.6*De)*at(i0,1,ie(Nt[0],Nt[1],O))*(Ee.k?1+Ee.k*ie(Ee.r0,Ee.r1,Math.hypot(Z-Ee.x,ve-Ee.z)):1),le.nf=.4+.6*ie(260,520,O),le.bow=te,le.dbr=-2*o/Xe.w*te,le.ux=ke/Math.max(O,1),le.uz=_/Math.max(O,1),le};let fe=NaN,pe=0;const $=Z=>(Z!==fe&&(fe=Z,pe=y.zc(Z)),pe),ce=(Z,ve,ke)=>{if(!y)return 0;const _=(ve-$(ke))/y.W,O=(Z-y.x)/(Z<y.x?y.S*y.P:y.S);return y.A*Math.exp(-_*_-O*O)},U=(Z,ve,ke,_=me)=>{const O=V(Z,ve);let l=0,Fe=0,De=0,o=1,te=0,We=0,Be=1;for(let _e=0;_e<3;_e++){const Ne=h[_e],mt=Ne.k*(Ne.dx*Z+Ne.dz*ve)-Ne.om*ke-Ne.ph,nt=Math.sin(mt),ut=Math.cos(mt);_e===0&&(Be=ut);const Ye=_e?Ne.A*O.nf:Ne.A;l-=Ne.dx*Ye*nt,Fe-=Ne.dz*Ye*nt,De+=Ye*ut,o-=Ne.k*Ye*ut,te+=Ne.dx*Ne.k*Ye*nt,We+=Ne.dz*Ne.k*Ye*nt}let Ge=0;if(y){Ge=ce(Z,ve,ke);const _e=(ve-$(ke))/y.W;We+=2*_e/y.W*Ge;const Ne=Z<y.x?y.S*y.P:y.S;te+=2*(Z-y.x)/(Ne*Ne)*Ge}const Re=Xe.h0-Xe.h1*Be,qe=te*O.ys-O.dbr*Re*O.ux,st=We*O.ys-O.dbr*Re*O.uz;_.x=Z+l*O.hs,_.z=ve+Fe*O.hs,_.y=De*O.ys+Ge+O.bow*Re,_.J=o;const ct=Math.hypot(qe,o,st)||1;return _.nx=qe/ct,_.ny=o/ct,_.nz=st/ct,_},X=(Z,ve,ke)=>{const _=V(Z,ve);let O=0,l=1;for(let o=0;o<3;o++){const te=h[o],We=te.k*(te.dx*Z+te.dz*ve)-te.om*ke-te.ph,Be=Math.cos(We);o===0&&(l=Be);const Ge=o?te.A*_.nf:te.A;O+=Ge*Be}let Fe=0;y&&(Fe=ce(Z,ve,ke));const De=Xe.h0-Xe.h1*l;return O*_.ys+Fe+_.bow*De},se=new Float64Array(2),x=(Z,ve,ke)=>{const _=V(Z,ve);let O=0,l=0;for(let Fe=0;Fe<3;Fe++){const De=h[Fe],o=De.k*(De.dx*Z+De.dz*ve)-De.om*ke-De.ph,te=Math.sin(o),We=Fe?De.A*_.nf:De.A;O-=De.dx*We*te,l-=De.dz*We*te}se[0]=Z+O*_.hs,se[1]=ve+l*_.hs};return{at:U,inv:(Z,ve,ke,_=me)=>{let O=Z,l=ve;for(let Fe=0;Fe<5;Fe++)x(O,l,ke),O+=Z-se[0],l+=ve-se[1];return U(O,l,ke,_),_.x0=O,_.z0=l,_},height:(Z,ve,ke)=>{let _=Z,O=ve;for(let l=0;l<5;l++)x(_,O,ke),_+=Z-se[0],O+=ve-se[1];return X(_,O,ke)},quick:(Z,ve,ke)=>{let _=Z,O=ve;for(let l=0;l<2;l++)x(_,O,ke),_+=Z-se[0],O+=ve-se[1];return X(_,O,ke)},yAt:X,trains:h,rogue:y}}const $e=`
uniform vec4 uTr[3]; uniform vec2 uTo[3]; uniform float uTw; uniform vec4 uRogue; uniform vec2 uRogue2;
vec4 gsShape(vec2 p0, out vec2 ur, out float nf){
  vec2 e = p0 - vec2(${ee.x.toFixed(1)}, ${ee.z.toFixed(1)}); float r = length(e); ur = e / max(r, 1.); nf = 0.4 + 0.6 * smoothstep(260., 520., r);
  float up = smoothstep(-0.2, 0.5, -ur.y);
  float near = 1. - smoothstep(180., 300., r), lee = (1. - up) * (1. - smoothstep(180., 620., r));
  float q = max(r - ${Xe.r.toFixed(1)}, 0.) / ${Xe.w.toFixed(1)}, g = smoothstep(0.5, 0.92, -ur.y) * exp(-min(q * q, 40.));
  return vec4(smoothstep(200., 330., r), (1. + ${r0.toFixed(3)} * near * up) * (1. - 0.6 * lee) * mix(${i0.toFixed(3)}, 1., smoothstep(${Nt[0].toFixed(1)}, ${Nt[1].toFixed(1)}, r)) * (1. + ${Ee.k.toFixed(2)} * smoothstep(${Ee.r0.toFixed(1)}, ${Ee.r1.toFixed(1)}, length(p0 - vec2(${Ee.x.toFixed(1)}, ${Ee.z.toFixed(1)})))), g, -2. * q / ${Xe.w.toFixed(1)} * g);
}
// displacement of rest point p0 at clock tw: xyz = offset (add xz to p0), far fades trains 2 and 3
vec3 gsOff(vec2 p0, float tw, float far, out vec3 nrm, out float J){
  vec2 ur; float nf; vec4 sh = gsShape(p0, ur, nf); vec2 o = vec2(0.), sl = vec2(0.); float y = 0., c0 = 1.; J = 1.;
  for (int i = 0; i < 3; i++) {
    vec4 t = uTr[i]; float f = i == 0 ? 1. : far * nf;
    float th = t.z * dot(t.xy, p0) - uTo[i].x * tw - uTo[i].y, s = sin(th), c = cos(th), a = t.w * f; if (i == 0) c0 = c;
    o -= t.xy * a * s; y += a * c; J -= t.z * a * c; sl += t.xy * t.z * a * s;
  }
  float rS = p0.x < uRogue2.x ? uRogue2.y * ${(1/3.2).toFixed(4)} : uRogue2.y;
  float q = (p0.y - uRogue.y - uRogue.z * tw) * uRogue.w, l = (p0.x - uRogue2.x) * rS;
  float ry = uRogue.x * exp(-min(q * q + l * l, 40.));
  float bh = ${Xe.h0.toFixed(1)} - ${Xe.h1.toFixed(1)} * c0;
  sl *= sh.y; sl += vec2(2. * l * rS, 2. * q * uRogue.w) * ry; sl -= ur * sh.w * bh;
  nrm = normalize(vec3(sl.x, max(J, 0.05), sl.y));
  return vec3(o.x * sh.x, y * sh.y + ry + sh.z * bh, o.y * sh.x);
}
// rest point of a world xz (three fixed-point steps)
vec2 gsInv(vec2 p, float tw){
  vec2 p0 = p; vec3 n; float J;
  for (int i = 0; i < 3; i++) { vec3 d = gsOff(p0, tw, 1., n, J); p0 += p - (p0 + d.xz); }
  return p0;
}
`,Pe=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uGndCol, uFogCol; uniform float uFogDen, uMist, uShHue; uniform sampler2D uCloud; uniform vec4 uCloudX, uShK; uniform vec2 uMistY;
float gsCloud(vec2 p){ return 1. - uCloudX.w * smoothstep(0.3, 0.5, texture2D(uCloud, (p - uCloudX.xy) * uCloudX.z).r); }
// haze (exp2, the scene fog) plus dawn mist that pools low, so it lies in the troughs and travels with them
float gsMistN = 0.8; vec3 gsMistC = vec3(1.);       // the ground sets these: wisps (0..1.6) and the glow toward the sun
vec3 gsFog(vec3 c, float d, float y){
  float f = 1. - exp(-uFogDen * uFogDen * d * d);
  float mh = 1. - smoothstep(uMistY.x, uMistY.y, y); mh *= sqrt(mh);                 // it lies in the bottom of the troughs
  float m = min(uMist * mh * (1. - exp(-d * d / 400000.)) * (0.03 + 0.2 * smoothstep(0.55, 1.6, gsMistN)), 0.2 + 0.2 * clamp(gsMistC.r - 1.1, 0., 0.4));   // brightest toward the sun   // a veil, never a lid: the trough's land, stream and shadows show through it   // strands and holes: the land shows between them
  c = mix(c, uFogCol * gsMistC * mix(vec3(1.1, 1.1, 1.12), vec3(0.94, 1.0, 1.1), smoothstep(0.08, 0.2, m)), m);   // wisps: luminous where thin, cool where it lies deep
  return mix(c, uFogCol, clamp(f, 0., 1.));
}
// sun (shadowed by sh) + sky/ground hemisphere; tr = translucency (leaves and blades glow against the sun)
vec3 gsLit(vec3 alb, vec3 n, float sh, float tr){
  float nl = dot(n, uSunDir);
  float dif = max(nl, 0.) + tr * max(-nl, 0.) * 0.7;
  vec3 hemi = mix(uGndCol, uSkyCol, n.y * 0.5 + 0.5);
  hemi *= mix(vec3(0.6, 0.72, 0.9), vec3(1.), clamp((sh - 1.) / max(uCloudX.w, 0.05) + 1., 0., 1.));   // under a cloud the fill cools and drops too
  float wsk = uShK.w * (1. - smoothstep(0.1, 0.45, sh)); hemi = hemi * (1. + 1.1 * wsk) + uSunCol * vec3(0.05, 0.055, 0.06) * wsk;   // + a little light thrown back by the sunlit backs                                        // a swell's own shadow lies under open sky: luminous blue shade
  vec3 r = alb * (uSunCol * dif * sh + hemi);
  r = mix(r, (dot(alb, vec3(0.3, 0.5, 0.2)) + 0.02) * uSkyCol * 1.7, 0.2 * wsk * uShHue);
  r = mix(r, dot(r, vec3(0.3, 0.5, 0.2)) * uSkyCol / max(dot(uSkyCol, vec3(0.3, 0.5, 0.2)), 1e-3), 0.5 * wsk * uShHue);   // in a swell's shadow the tone keeps its brightness and takes half its hue from the sky: straw goes violet-grey, green goes blue-green, never brown (uShHue: by the hour)
  r *= 1. - 0.4 * wsk * smoothstep(0.07, 0.2, dot(r, vec3(0.3, 0.5, 0.2)));   // and a pale sward (straw, a flowered crest) in that shadow is a clear step darker than where the sun reaches it: a shadow, never a second pale ground
  return r;
}
// drifts: the season's flowers lie in long torn bands, 6-12 m across and several times as long, along the swell; plain grass between
float gsDrift(sampler2D nzt, vec2 a0){ return smoothstep(0.59, 0.69, texture2D(nzt, a0 * vec2(0.00071, 0.0025) + 0.31).g * 0.8 + texture2D(nzt, a0 * vec2(0.0041, 0.0113) + 0.6).b * 0.2); }
vec3 gsHold(vec3 c){ return c * min(1., 0.88 / max(max(c.r, c.g), max(c.b, 1e-3))); }   // daisy white and lit rims stay under the bloom threshold
// the sea's tones, one function for the ground, the tufts and the far cards: a multiplier for the meadow's albedo.
// rel: -1 on the faces ahead of the crests ... +1 on their sunlit backs; hN: 0 in the trough ... 1 on the crest.
// uSeaK = (lift of the backs, depth of the faces, depth of the trough band), set by the hour
uniform vec3 uSeaK;
vec3 gsSea(float rel, float hN, float dist){
  float frontF = smoothstep(0.04, 0.7, -rel), backF = smoothstep(0.02, 0.65, rel), trough = 1. - smoothstep(0.04, 0.46, hN);
  float farK = 0.45 + 0.55 * smoothstep(50., 300., dist);                       // underfoot the face keeps its detail; it deepens as it falls away
  float v = (1. + uSeaK.x * backF * (1. - 0.6 * trough)) * mix(1., uSeaK.y, frontF * farK) * mix(1., uSeaK.z, trough * farK);
  v *= 1. + 0.22 * min(1., uSeaK.x * 3.4) * smoothstep(0.55, 0.95, hN) * (1. - frontF);
  vec3 hue = mix(vec3(1.), vec3(0.7, 0.96, 1.26), max(frontF, 0.8 * trough) * farK);
  hue = mix(hue, vec3(1.12, 1.06, 0.7), 0.55 * min(1., uSeaK.x * 3.4) * backF * (1. - trough));
  return v * hue;
}
`,ot=`
float gsWaveH(vec2 q, float tw){ float h = 0.; for (int j = 0; j < 3; j++) h += uTr[j].w * cos(uTr[j].z * dot(uTr[j].xy, q) - uTo[j].x * tw - uTo[j].y); return h; }
float gsWaveSh(vec2 p0, float lift, float tw){
  if (uShK.w < 0.01) return 1.;
  float y0 = gsWaveH(p0, tw) + lift, sh = 0.;
  for (int i = 1; i <= 7; i++) {
    float s = float(i * i) * 6.5;
    sh = max(sh, smoothstep(0., 4. + 0.04 * s, gsWaveH(p0 + uShK.xy * s, tw) - y0 - s * uShK.z));
  }
  return 1. - uShK.w * sh;
}
`,w0={day:{elev:38,sun:"#FFF4DE",sunI:3.1,sky:"#8FC7E8",skyI:.62,gnd:"#4d6b3a",gndI:.28,zenith:"#2f77c6",mid:"#7fb9e6",horizon:"#dfeaf1",fog:"#b9d6ea",fogDen:33e-5,mist:0,cloudShadow:.65,exposure:1,tint:"#ffffff",shadowTint:"#0a1420",sat:1.08,preset:"day"},golden:{elev:12,sun:"#FFC27A",sunI:3.4,sky:"#7fa2e0",skyI:.5,gnd:"#4a5a52",gndI:.25,zenith:"#3a69b4",mid:"#9fb4d6",horizon:"#f6d9b0",fog:"#d9c8b8",fogDen:34e-5,mist:.12,cloudShadow:.6,exposure:1.05,tint:"#fff3e2",shadowTint:"#0c1630",sat:1.1,preset:"goldenHour"},dawn:{elev:9,sun:"#FFB89A",sunI:2.6,sky:"#9db4e6",skyI:.6,gnd:"#566a6c",gndI:.3,zenith:"#5d86c8",mid:"#b9c4e0",horizon:"#f7d6c8",fog:"#e6d5d6",fogDen:29e-5,mist:.85,cloudShadow:.55,exposure:1.02,tint:"#fff0ee",shadowTint:"#141a34",sat:1.02,preset:"dawn"}},b0={long:[[600,46,20,0],[370,8,16,22],[210,3.5,12,-31]],cross:[[600,37,20,0],[440,12,17,38],[330,8,15,-44]],glassy:[[600,40,20,0],[410,2.5,16,18],[230,1,12,-27]]},z0={summer:["#5FA052","#2F6B45","#C9DC7A","#F5F3EA","#D9609A","#2F6B45","#8fc24e",0],spring:["#63AC4E","#2F7240","#D3E272","#F3DC5A","#F0A0C2","#3f7d45","#F9BFD3",1],autumn:["#B8952F","#6B5B27","#E8C552","#F1E7CF","#A8456E","#9C4A22","#E08A2E",.55]};function S0(h){const y=h.rng.fork?h.rng.fork("look24588"):h.rng,me=h.vary||{};let le=me.hour==="day"?"day":me.hour==="golden"||me.hour==="night"?"golden":me.hour==="dawn"?"dawn":null;const V=y();le||(le=V<.42?"day":V<.74?"golden":"dawn");const fe=y(),pe=fe<.5?"long":fe<.78?"cross":"glassy",$=y(),ce=$<.5?"summer":$<.77?"spring":"autumn";return{hour:le,sea:pe,season:ce,H:w0[le],S:z0[ce],rare:!!me.rare,density:Ve(me.density??1,.7,1.3),dapple:y()<.4,secondHerd:y()<.45,swallows:y()<.35,runners:Math.round(at(120,200,y()))}}function M0(h,y,me){const fe=s0,pe=o=>25+(18.0841-25)*ie(150,330,o)+(45-18.0841)*ie(500,600,o)+(26.1933-45)*ie(790,900,o)+(57.99-26.1933)*ie(1e3,1120,o),$=new Float32Array(fe+1),ce=new Float32Array(fe+1),U=new Float32Array(fe+1),X=new Float32Array(fe+1),se=new Float32Array(fe+1),x=new Float32Array(fe+1),Ae=fe-Tt,Se=Math.hypot(me.x,me.z);for(let o=1;o<=Ae;o++){const te=pe(o-.5)*He;$[o]=$[o-1]-Math.sin(te),ce[o]=ce[o-1]+Math.cos(te)}const Me=y.x-me.x*Tt-$[Ae],Z=y.z-me.z*Tt-ce[Ae];for(let o=0;o<=Ae;o++){const te=ie(Ae-400,Ae,o);$[o]+=Me*te,ce[o]+=Z*te}for(let o=Ae+1;o<=fe;o++)$[o]=y.x-me.x*(fe-o),ce[o]=y.z-me.z*(fe-o);const ve=y.y-me.y*Tt;for(let o=0;o<=fe;o+=2){const te=y0(o);se[o]=te;const We=h.height($[o],ce[o],te);let Be=Math.max(We,h.height($[o],ce[o],te-.9),h.height($[o],ce[o],te+.9));o<140&&(Be=Math.max(Be,h.height($[o],ce[o],te+2),h.height($[o],ce[o],te+3.4),h.height($[o],ce[o],te-1.6))),o>196&&o<440&&(Be=We-1.7),X[o]=Be,x[o]=We;const Ge=at(36,3.5,ie(40,166,o))+31*ie(436,512,o)-15*ie(524,590,o)-12.4*ie(552,612,o);let Re=Math.max(We+Ge,Be+5);const qe=o<Ae?ve:ve+(o-Ae)*me.y;Re=at(Re,qe,ie(Ae-100,Ae,o)),U[o]=o>Ae?Math.max(qe,o<fe-70?Be+5:-1e9):Re}for(let o=1;o<fe;o+=2)U[o]=(U[o-1]+U[o+1])/2,X[o]=(X[o-1]+X[o+1])/2,se[o]=(se[o-1]+se[o+1])/2,x[o]=(x[o-1]+x[o+1])/2;const ke=U[0];for(let o=0;o<=60;o++)U[o]=ke;const _=(o,te)=>{const We=U.slice();for(let Be=0;Be<=te;Be++){let Ge=0,Re=0;for(let qe=-o;qe<=o;qe+=2){const st=Ve(Be+qe,0,fe);Ge+=We[st],Re++}U[Be]=Ge/Re}},O=fe-110;_(20,O),_(20,O);for(let o=0;o<3;o++){for(let te=0;te<=O;te++)U[te]=Math.max(U[te],X[te]+4.6);_(8,O)}let l=1e9;for(let o=0;o<=O;o++)U[o]<X[o]+4.2&&(U[o]=X[o]+4.2),l=Math.min(l,U[o]-X[o]);for(let o=0;o<=50;o++)U[o]=Math.max(U[o],at(U[0],U[50],ie(0,50,o)));const Fe=3.5;l=1e9;for(let o=0;o<=O;o++)U[o]<x[o]+Fe&&(U[o]=x[o]+Fe),l=Math.min(l,U[o]-x[o]);const De=[];for(let o=0;o<fe-8;o+=14)De.push(new t.Vector3($[o],U[o],ce[o]));return De.push(new t.Vector3(y.x,y.y,y.z)),{X:$,Z:ce,Y:U,G:X,TWs:se,pts:De,minClr:l,N:fe}}function k0(h,y,me,le,V){const pe=new Uint8Array(262144),$=new Float32Array(512*512);for(const U of h)for(const X of U.blobs){const se=(U.x+X[0]-me)/y*512+256,x=(U.z+X[1]-le)/y*512+512/2,Ae=X[2]/y*512;for(let Se=Math.max(0,Math.floor(x-Ae));Se<=Math.min(511,Math.ceil(x+Ae));Se++)for(let Me=Math.max(0,Math.floor(se-Ae));Me<=Math.min(511,Math.ceil(se+Ae));Me++){const Z=Math.hypot(Me+.5-se,Se+.5-x)/Ae;Z<1&&($[Se*512+Me]+=.85*(1-ie(.15,1,Z)))}}if(V)for(let U=0;U<120;U++){const X=V()*512,se=V()*512,x=(80+190*V())/y*512,Ae=x*(.5+.5*V()),Se=.5+.4*V();for(let Me=Math.max(0,Math.floor(se-Ae));Me<=Math.min(511,Math.ceil(se+Ae));Me++)for(let Z=Math.max(0,Math.floor(X-x));Z<=Math.min(511,Math.ceil(X+x));Z++){const ve=Math.hypot((Z+.5-X)/x,(Me+.5-se)/Ae);ve<1&&($[Me*512+Z]+=Se*(1-ie(.2,1,ve)))}}for(let U=0;U<512*512;U++)pe[U]=Math.round(255*Math.min(1,$[U]));const ce=new t.DataTexture(pe,512,512,t.RedFormat,t.UnsignedByteType);return ce.wrapS=ce.wrapT=t.ClampToEdgeWrapping,ce.minFilter=ce.magFilter=t.LinearFilter,ce.generateMipmaps=!1,ce.needsUpdate=!0,ce}var N0={id:"groundswell-country",name:"The Groundswell",category:"alien",weirdness:.65,media:["air","open"],async build(h){const y=h.rng,me=Ve(h.quality?.detail??1,.5,1),le=S0(h),V=le.H,fe=le.S,pe=new t.Scene,$=e=>new t.Color(e),ce={grass:$(fe[0]),dark:$(fe[1]),lime:$(fe[2]),cap:$(fe[3]),accent:$(fe[4]),crown:$(fe[5]),crownLit:$(fe[6]),granite:$("#7C8791"),blossom:le.season==="spring"?1:0,drift:le.season==="autumn"?.8:1},U=b0[le.sea].map(([e,a,s,i],u)=>{const d=i*He,r=Le/e;return{dx:-Math.sin(d),dz:Math.cos(d),k:r,A:a,om:r*s,ph:u===0?r*et:y.range(0,Le)}}),X=le.rare?{A:172,W:165,x:ee.x-370,S:320,P:3.2}:null;if(X){const e=[-20,0,18,33,40,46,70],a=[520,700,862,ee.z-180,ee.z+60,ee.z+270,ee.z+1100],s=i=>{if(i<=e[0])return a[0];for(let u=1;u<e.length;u++)if(i<=e[u])return at(a[u-1],a[u],(i-e[u-1])/(e[u]-e[u-1]));return a[a.length-1]};X.zc=i=>(s(i-1.5)+2*s(i)+s(i+1.5))/4,X.cAt=i=>X.zc(i+.5)-X.zc(i-.5)}const se=x0(U,X),x={uTr:{value:U.map(e=>new t.Vector4(e.dx,e.dz,e.k,e.A))},uTo:{value:U.map(e=>new t.Vector2(e.om,e.ph))},uTw:{value:0},uTime:{value:0},uRogue:{value:X?new t.Vector4(X.A,X.zc(0),0,1/X.W):new t.Vector4(0,0,0,1)},uRogue2:{value:X?new t.Vector2(X.x,1/X.S):new t.Vector2(0,1)},uSunDir:{value:new t.Vector3},uSunCol:{value:$(V.sun).multiplyScalar(V.sunI/Math.PI)},uSkyCol:{value:$(V.sky).multiplyScalar(V.skyI*.8)},uGndCol:{value:$(V.gnd).multiplyScalar(V.gndI*.85)},uFogCol:{value:$(V.fog)},uFogDen:{value:V.fogDen},uMist:{value:V.mist},uMistY:{value:new t.Vector2(-U[0].A*.95,-U[0].A*.2)},uCloud:{value:null},uCloudX:{value:new t.Vector4(0,0,1/7e3,V.cloudShadow)},uShK:{value:new t.Vector4(0,-1,1,0)},uShHue:{value:le.hour==="golden"?1:0}},Ae=Math.cos(V.elev*He),Se=x.uSunDir.value.set(-Math.sin(125*He)*Ae,Math.sin(V.elev*He),Math.cos(125*He)*Ae).normalize();{const e=Math.hypot(Se.x,Se.z)||1;x.uShK.value.set(Se.x/e,Se.z/e,Math.tan(V.elev*He),V.elev<25?.8:0)}const Me=await g0(h,{palette:[fe[0],fe[1],fe[2],fe[3],"#7C8791",V.sky,fe[4]],detail:me,skirt:!1});Me.object.position.set(ee.x,0,ee.z),Me.object.rotation.y=Math.PI,pe.add(Me.object);const Z=e=>new t.Vector3(ee.x-e.x,e.y,ee.z-e.z),ve=Z(Me.anchors.portalSeat.position),ke=Me.anchors.portalSeat.travel,_=new t.Vector3(-ke.x,ke.y,-ke.z).normalize(),O=Z(Me.anchors.bay);Me.setGroundSampler((e,a,s)=>{const i=ee.x-e,u=ee.z-a;return e*e+a*a<39204?se.yAt(i,u,s):se.height(i,u,s)}),Me.setLight(Se,x.uSunCol.value.clone().multiplyScalar(2.6),x.uSkyCol.value.clone().multiplyScalar(2.2));{const e=x.uShK.value,a=(s,i,u)=>{let d=0;for(let r=0;r<3;r++){const p=U[r];d+=p.A*Math.cos(p.k*(p.dx*s+p.dz*i)-p.om*u-p.ph)}return d};Me.setShade?.((s,i,u,d)=>{if(e.w<.01)return 1;const r=ee.x-s,p=ee.z-i,b=a(r,p,d)+u;let v=0;for(let M=1;M<=7;M++){const w=M*M*6.5;v=Math.max(v,ie(0,4+.04*w,a(r+e.x*w,p+e.y*w,d)-b-w*e.z))}return 1-v})}await h.yield();const l=M0(se,ve,_);await h.yield();const Fe=v0(l.pts);await h.yield();const De=new Float32Array(257);{let e=0;const a=new t.Vector3;for(let s=0;s<=256;s++){for(Fe.pointAt(s/256,a);;){const i=(l.X[e]-a.x)**2+(l.Z[e]-a.z)**2,u=Math.min(e+1,l.N),d=(l.X[u]-a.x)**2+(l.Z[u]-a.z)**2;if(u>e&&d<=i)e=u;else break}De[s]=l.TWs[e]}}const o=e=>{const a=Ve(e,0,1)*256,s=Math.min(255,Math.floor(a));return at(De[s],De[s+1],a-s)},te=e=>{let a=0;for(;a<l.N&&l.TWs[a]<e;)a+=2;return Math.min(a,l.N)};await h.yield();const We=m0({rng:y,preset:V.preset,zenith:V.zenith,mid:V.mid,horizon:V.horizon,ground:V.fog,sunDirection:Se.clone(),sunColor:V.sun,sunSize:1.1,clouds:!1,clouds2:{coverage:.34,stretch:1,opacity:.4,scale:1.4,wind:[.001,-.006]},fogColor:V.fog});pe.add(We.object),await h.yield(),pe.fog=new t.FogExp2(x.uFogCol.value.clone(),V.fogDen);const Be=new t.DirectionalLight($(V.sun),V.sunI);Be.position.copy(Se).multiplyScalar(1e3),pe.add(Be,Be.target),pe.add(new t.HemisphereLight($(V.sky).multiplyScalar(V.skyI*.85),$(V.gnd).multiplyScalar(V.gndI*.9),Math.PI));const Ge=new t.DirectionalLight($(V.sky).lerp($("#ffffff"),.35),1.15*V.skyI/.62);Ge.position.set(800,450,-400),pe.add(Ge,Ge.target);const Re=y.fork?y.fork("clouds"):y,qe=[];for(let e=0,a=0;qe.length<16&&a<600;a++){const s=Re.range(-3100,1500),i=Re.range(-300,4300),u=Re.range(400,900);if(qe.some(r=>Math.hypot(r.x-s,r.z-i)<(r.w+u)*.62))continue;const d=[];for(let r=0;r<5;r++)d.push([Re.range(-.3,.3)*u,Re.range(-.22,.22)*u,u*Re.range(.28,.42)]);qe.push({x:s,z:i,w:u,blobs:d}),e++}const st=-9,ct=700,_e=p0({rng:y,mode:"cumulus",sky:We,at:qe.map(e=>[e.x,ct,e.z,e.w]),height:.6,puffs:30,wind:[0,0,st],opacity:.9,farFade:[9e3,14e3],fogFade:.55});pe.add(_e.object),await h.yield();const Ne={span:7e3,cx:-700,cz:1800};x.uCloud.value=k0(qe,Ne.span,Ne.cx,Ne.cz,h.core.makeRng(((h.seed|0)^20907)+9173));const mt=(ct+150)/Math.tan(Math.max(V.elev,22)*He),nt=Math.hypot(Se.x,Se.z),ut={x:Ne.cx-Ne.span/2-Se.x/nt*mt,z:Ne.cz-Ne.span/2-Se.z/nt*mt};await h.yield();const Ye=(()=>{const a=new Uint8Array(65536),s=y.fork?y.fork("noise"):y;for(let u=0;u<4;u++){const d=new Float32Array(16384);for(let r=0;r<16384;r++)d[r]=s();for(let r=0;r<128;r++)for(let p=0;p<128;p++){const b=d[r*128+p],v=d[r*128+(p+1)%128],M=d[(r+1)%128*128+p],w=d[(r+1)%128*128+(p+1)%128];a[(r*128+p)*4+u]=Math.round(Ve((b*.4+(v+M)*.22+w*.16-.5)*1.7+.5,0,1)*255)}}const i=new t.DataTexture(a,128,128,t.RGBAFormat);return i.wrapS=i.wrapT=t.RepeatWrapping,i.minFilter=t.LinearMipmapLinearFilter,i.magFilter=t.LinearFilter,i.generateMipmaps=!0,i.anisotropy=Math.min(8,h.renderer?.capabilities?.getMaxAnisotropy?.()||1),i.needsUpdate=!0,i})();x.uNoise={value:Ye},await h.yield(),x.uCamRest={value:new t.Vector2},x.uHerd={value:new t.Vector4(0,400,12.8,1)},x.uGrass={value:ce.grass},x.uDarkG={value:ce.dark},x.uLime={value:le.hour==="day"?ce.lime.clone().lerp(ce.grass,.45).multiplyScalar(.92):ce.lime},x.uCap={value:ce.cap.clone().multiplyScalar(.8)},x.uAccent={value:ce.accent},x.uDrift={value:ce.drift},x.uEye={value:le.season==="summer"?new t.Color(.85,.6,.08):le.season==="spring"?new t.Color(.62,.8,.3):new t.Color(.55,.45,.3)},x.uStreak={value:le.sea==="glassy"?.55:1},x.uRelK={value:le.hour==="day"?.42:.24},x.uSeaK={value:le.hour==="day"?new t.Vector3(.1,.4,.55):new t.Vector3(.3,.72,.68)},x.uSkyRefl={value:$(V.zenith).lerp($(V.horizon),.45)};{const e=Math.hypot(Se.x,Se.z)||1;x.uBackDir={value:new t.Vector2(Se.x/e*.45,Se.z/e*.45-.55).normalize()}}const Ze=148,Mt=140,l0=(()=>{const e=new Float32Array(Ze*Mt*3),a=new Uint32Array(Ze*(Mt-1)*6);for(let r=0;r<Mt;r++){const p=r===0?0:70*(Math.exp(.03247*r)-1)*(.55+.45*ie(0,40,r));for(let b=0;b<Ze;b++){const v=(b+(r&1)*.5)/Ze*Le,M=(r*Ze+b)*3;e[M]=Math.cos(v)*p,e[M+2]=Math.sin(v)*p}}let s=0;for(let r=0;r<Mt-1;r++)for(let p=0;p<Ze;p++){const b=r*Ze+p,v=r*Ze+(p+1)%Ze,M=b+Ze,w=v+Ze;r&1?(a[s++]=b,a[s++]=w,a[s++]=v,a[s++]=b,a[s++]=M,a[s++]=w):(a[s++]=b,a[s++]=M,a[s++]=v,a[s++]=v,a[s++]=M,a[s++]=w)}const i=new t.BufferGeometry;i.setAttribute("position",new t.BufferAttribute(e,3)),i.setIndex(new t.BufferAttribute(a,1));const u=new t.ShaderMaterial({uniforms:x,side:t.DoubleSide,vertexShader:$e+`
uniform vec2 uCamRest; varying vec2 vP0; varying vec3 vW;
void main(){
  vec2 p0 = uCamRest + position.xz; float far = 1. - smoothstep(2000., 3000., length(position.xz));
  vec3 n; float J; vec3 d = gsOff(p0, uTw, far, n, J);
  vP0 = p0; vW = vec3(p0.x + d.x, d.y, p0.y + d.z);
  gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.);
}`,fragmentShader:$e+Pe+ot+`
uniform vec2 uCamRest, uCapJ; uniform sampler2D uNoise; uniform float uTime, uDrift, uStreak, uRelK; uniform vec4 uHerd;
uniform vec3 uGrass, uDarkG, uLime, uCap, uAccent, uSkyRefl; uniform vec2 uBackDir;
varying vec2 vP0; varying vec3 vW;
void main(){
  vec3 toCam = cameraPosition - vW; float dist = length(toCam); vec3 V = toCam / max(dist, 1e-3);
  float far = 1. - smoothstep(2000., 3000., length(vP0 - uCamRest));
  vec3 n; float J; gsOff(vP0, uTw, far, n, J);
  float n1 = texture2D(uNoise, vP0 * 0.0027).r, n2 = texture2D(uNoise, vP0 * 0.017 + 0.37).g;
  float n3 = texture2D(uNoise, vP0 * 0.13).b, n4 = texture2D(uNoise, vP0 * vec2(1.7, 0.9)).a, n5 = texture2D(uNoise, vP0 * 0.61 + 0.11).r;
  float nearF = 1. - smoothstep(25., 150., dist), midF = 1. - smoothstep(150., 1100., dist);
  vec3 alb = mix(uGrass, uLime, 0.15 + 0.45 * n1 + 0.22 * smoothstep(-5., 42., vW.y));
  float fb = n1 * 0.45 + texture2D(uNoise, vP0 * 0.0071 + 0.19).b * 0.33 + n2 * 0.22;
  alb = mix(alb, uDarkG, 0.5 * smoothstep(0.3, 0.75, fb) * (0.5 + 0.5 * midF));
  float hN = smoothstep(-1., 0.95, vW.y / max(uTr[0].w, 1.));                 // 0 in the trough, 1 on the crest
  float th = uTr[0].z * dot(uTr[0].xy, vP0) - uTo[0].x * uTw - uTo[0].y, thw = mod(th + 3.14159265, 6.2831853) - 3.14159265;
  float rel = clamp(dot(n.xz, uBackDir) * 3.4, -1., 1.), frontF = smoothstep(0.04, 0.7, -rel), backF = max(rel, 0.);   // -1 on the faces ahead of the crests, +1 on their sunlit backs
  alb *= (0.8 + 0.4 * mix(0.5, n3, midF)) * (0.74 + 0.52 * mix(0.5, n4, nearF));
  alb = mix(alb, uLime, 0.3 * smoothstep(0.6, 1., hN) * (1. - frontF) + 0.2 * backF);
  alb = mix(alb, uDarkG, 0.18 * max(frontF, 1. - smoothstep(0.04, 0.46, hN)) * smoothstep(50., 300., dist));
  alb *= gsSea(rel, hN, dist);
  vec2 urB; float nfB; float bowB = gsShape(vP0, urB, nfB).z;
  // the crest line of the swell we are on (and the heap against the tor), seen from its face: a lit rim with a torn white streak
  float rimN = max(smoothstep(0.9, 0.985, cos(th)) * smoothstep(0.55, 0.9, hN), smoothstep(0.5, 0.9, bowB)) * smoothstep(45., 150., dist) * (1. - smoothstep(420., 1000., dist));
  alb *= 1. + 0.35 * rimN; alb = mix(alb, uLime, 0.4 * rimN);
  { float rim = smoothstep(0.5, 0.97, cos(th)) * (1. - smoothstep(0.02, 0.3, thw)), farW = smoothstep(380., 1000., dist);
    alb *= 1. + 0.32 * rim * farW; alb = mix(alb, uLime, 0.25 * farW * rim); }
  // under the tufts and the far cards the ground is the shade between blades
  alb *= mix(1., 0.7, 1. - smoothstep(260., 1500., dist));
  float nT = texture2D(uNoise, vP0 * 0.037 + 0.71).a, nS = texture2D(uNoise, vec2(dot(vP0, vec2(0.95, 0.25)) * 0.045, dot(vP0, vec2(-0.25, 0.95)) * 0.006)).r;
  alb *= (0.87 + 0.26 * nT) * (0.86 + 0.28 * nS); alb = mix(alb, uLime, 0.18 * smoothstep(0.55, 0.85, nS));
  float sheen = smoothstep(0.52, 0.8, texture2D(uNoise, vP0 * vec2(0.0035, 0.0105) + vec2(0.011, -0.034) * uTime).g);
  alb = mix(alb, uLime * 1.08, 0.3 * sheen * (0.4 + 0.6 * midF));
  // flowers: flecks that thicken in patches; whitecaps where the trochoid crowds the land (J small)
  float pch = smoothstep(0.35, 0.7, n2 * 0.6 + n1 * 0.5);
  float fl = smoothstep(0.7, 0.82, n5) * (0.2 + 0.5 * pch) * nearF + 0.04 * pch * n3 * (1. - nearF) * midF;                 // between the drifts the grass is plain
  float loosen = 0.1 * smoothstep(150., 900., dist);
  float w = 1. - smoothstep(uCapJ.x + loosen, uCapJ.y + loosen, J + (n2 - 0.5) * 0.10 + (n1 - 0.5) * 0.06);
  float rq = (vP0.y - uRogue.y - uRogue.z * uTw) * uRogue.w, rl = (vP0.x - uRogue2.x) * (vP0.x < uRogue2.x ? uRogue2.y * ${(1/3.2).toFixed(4)} : uRogue2.y);
  w = max(w, step(1., uRogue.x) * smoothstep(0.45, 0.9, exp(-min(rq * rq + rl * rl, 40.)) + (n2 - 0.5) * 0.3) * smoothstep(-0.9, 0.4, rq));
  float wbr = smoothstep(0.3, 0.62, texture2D(uNoise, vP0 * vec2(0.0021, 0.0103) + 0.57).b * 0.6 + n2 * 0.4);          // the cap is torn along the crest, in rags
  float cap = clamp(fl * 0.55 + w * wbr * (0.2 + 0.62 * mix(mix(n3, 0.8, smoothstep(200., 800., dist)), n5, nearF)), 0., 1.);
  // far whitecaps: ragged streaks 60-200 m long lying just behind the crest lines of the long swell
  { float crN = floor(th / 6.2831853 + 0.5), along = dot(vec2(-uTr[0].y, uTr[0].x), vP0);
    float brk = texture2D(uNoise, vec2(along * 0.00013 + crN * 0.37, crN * 0.19 + 0.05)).g * 0.7 + texture2D(uNoise, vec2(along * 0.0006, crN * 0.41 + 0.3)).r * 0.3;
    float wdt = 0.09 + 0.26 * smoothstep(0.45, 0.72, brk) + 0.1 * (n2 - 0.5);
    float band = (1. - smoothstep(wdt * 0.5, wdt, abs(thw + 0.1))) * smoothstep(0.43, 0.52, brk) * smoothstep(0.22, 0.42, n2 * 0.6 + n1 * 0.5);
    cap = max(cap, uStreak * band * smoothstep(230., 460., dist) * (1. - smoothstep(3600., 5200., dist)) * (0.72 + 0.28 * n3));
    vec2 urT; float nfT; float bowG = gsShape(vP0, urT, nfT).z;                                   // and on the heap of land against the tor
    cap = max(cap, smoothstep(0.5, 0.86, bowG + (n2 - 0.5) * 0.5 + (n1 - 0.5) * 0.3) * (0.3 + 0.6 * mix(n3, 0.7, smoothstep(150., 500., dist))) * smoothstep(0.42, 0.6, brk + n1 * 0.3)); }
  float acc = smoothstep(0.74, 0.86, texture2D(uNoise, vP0 * 0.47 + 0.63).a) * (0.25 + 0.5 * pch) * mix(midF * 0.12, 1., nearF);
  float farF = 1. - smoothstep(1500., 4500., dist);
  float dr1 = gsDrift(uNoise, vP0), dr2 = gsDrift(uNoise, vP0 + vec2(517., 263.)) * smoothstep(0.35, 0.6, n2 * 0.6 + n1 * 0.5);
  cap = clamp(cap + uDrift * dr1 * (0.24 + 0.3 * nT) * (0.35 + 0.65 * n3) * farF * (1. - 0.5 * nearF), 0., 1.);   // a drift is a flecked pale band, never a painted patch
  acc = clamp(acc + dr2 * 0.3 * smoothstep(0.52, 0.72, n5) * (0.55 + 0.45 * n3) * farF * (1. - 0.6 * nearF) * (1. - smoothstep(250., 700., dist)), 0., 1.);   // campion drifts are flecks among the grass, never a painted band
  cap = max(cap, step(1., uRogue.x) * smoothstep(0.5, 0.86, exp(-min(rq * rq * 2.5 + rl * rl * 0.5, 40.)) + (n2 - 0.5) * 0.25) * (0.5 + 0.4 * n3));   // the rogue: white along its whole crest
  cap = max(cap, step(1., uRogue.x) * smoothstep(0.5, 0.8, exp(-min(rq * rq * 5., 40.)) * (1. - smoothstep(1.0, 1.7, abs(rl))) + (n2 - 0.5) * 0.3) * wbr * (0.55 + 0.4 * n3));   // a torn streak the length of its crest line
  cap = max(cap, rimN * smoothstep(0.3, 0.5, texture2D(uNoise, vP0 * vec2(0.0016, 0.019) + 0.23).b * 0.7 + n2 * 0.3) * (0.7 + 0.3 * n3));   // the torn streak of the season's flowers along the crest we ride
  // CAMPION DRIFTS IN THE GRASS: the campion's own drift field, a function of the rest place alone (the field the heads stand in and the
  // flecks are painted by). A drift is flowers, never a wash: clumps a stride or two across, crowded in the drift's core (nearly two fifths of the ground there) and thinning to none at its
  // edge (0.6: only the upper part of the field bears them), each clump small flecks with live's grass between. A fleck is the campion's own hue at its full strength: a place is grass or it is flower, and nothing is darkened or dulled. The caps and flecks go on over it as before
  { float drC = gsDrift(uNoise, vP0 + vec2(517., 263.)); alb = mix(alb, uAccent / max(uAccent.r, max(uAccent.g, uAccent.b)), smoothstep(0.44, 0.56, 0.3 * nT + 0.35 * n2 + 0.35 * texture2D(uNoise, vP0 * 0.0083 + 0.57).r - 0.04 - 0.6 * (1. - drC)) * smoothstep(0.42, 0.58, 0.45 * n5 + 0.55 * n3 + 0.06)); }
  alb = mix(alb, uCap, cap); alb = mix(alb, uAccent, acc * 0.7 * (1. - 0.6 * w));
  // the herd's trodden wake: darker, flattened grass behind crest C0 where the runners have passed
  float age = (${et.toFixed(1)} + 20. * uTw - vP0.y) / 20., hx = uHerd.x + uHerd.z * age;
  float tread = uHerd.w * smoothstep(-0.25, 0.1, age) * exp(-max(age, 0.) / 4.5) * smoothstep(hx - 14., hx + 4., vP0.x) * (1. - smoothstep(hx + uHerd.y - 4., hx + uHerd.y + 14., vP0.x));
  alb = mix(alb, uDarkG * 0.8, tread * (0.45 + 0.3 * n4));
  // streams lying in the troughs of the long swell, travelling with them
  float dz = (mod(th, 6.2831853) - 3.14159265) / uTr[0].z + (sin(vP0.x * 0.0113 + 1.3) * 16. + sin(vP0.x * 0.0291) * 7. + sin(vP0.x * 0.071 + 2.) * 2.5);
  float pres = smoothstep(-0.75, -0.4, sin(vP0.x * 0.0031 + floor(th / 6.2831853) * 2.4));
  pres *= 1. - step(1., uRogue.x) * smoothstep(0.02, 0.1, exp(-min(rq * rq + rl * rl, 40.)));           // a stream lies in its trough: it stops at the foot of the rogue crest, never climbs it
  float wd = 2.2 + 3.2 * n1 + dist * 0.005, stream = pres * (1. - smoothstep(wd, wd + 1.2 + dist * 0.004, abs(dz)));
  n = normalize(n + vec3(n3 - 0.5, 0., n4 - 0.5) * (0.5 * nearF + 0.12) * (1. - stream));
  float sh = gsCloud(vW.xz) * gsWaveSh(vP0, 0., uTw);
  vec3 c = gsLit(alb, n, sh, 0.) + alb * uSkyCol * 0.3 * frontF + alb * uSunCol * 0.7 * rimN * gsCloud(vW.xz);                              // faces in shade are blue-green, never black
  float back = max(dot(-V, uSunDir), 0.); c += alb * uLime * uSunCol * sh * back * back * 0.55 * (1. - cap);        // blades glow against the sun
  vec3 R = reflect(-V, vec3(0., 1., 0.)); float gl = max(dot(R, uSunDir), 0.); gl *= gl; gl *= gl; gl *= gl; gl *= gl;
  float rip = texture2D(uNoise, vP0 * 0.09 + vec2(uTime * 0.05, 0.)).r;
  c = gsHold(c);
  vec3 water = uSkyRefl * (0.45 + 0.5 * (1. - max(V.y, 0.))) + uSunCol * sh * gl * (1.5 + 6. * rip);
  c = mix(c, water, stream);
  // dawn mist: slow wisps lying along the troughs, thin enough for the land to show through, glowing toward the sun
  { vec2 mp = vP0 + vec2(0.9, -0.4) * uTime * 3.;
    gsMistN = clamp(0.1 + 2.1 * texture2D(uNoise, mp * 0.00021).a * texture2D(uNoise, mp * vec2(0.0011, 0.0029) + 0.4).g * 2. * (0.8 + 0.4 * texture2D(uNoise, mp * vec2(0.004, 0.011) + 0.2).r) + 0.5 * (n1 - 0.5), 0.04, 1.7);
    float sunw = max(dot(normalize(vec3(-V.x, 0.02, -V.z)), normalize(vec3(uSunDir.x, 0.02, uSunDir.z))), 0.);
    gsMistC = vec3(1.02) + uSunCol * (0.1 + 0.45 * sunw * sunw); }
  gl_FragColor = vec4(gsFog(c, dist, vW.y), 1.);
}`}),d=new t.Mesh(i,u);return d.frustumCulled=!1,d.name="ground",d})();pe.add(l0),await h.yield();const pt=[],gt=[x.uCloud.value,Ye],F0=`
// world position of a vertex 'l' (local, +Y up) of something rooted at rest point a0; lean = how far it tilts with the slope
vec3 gsRoot(vec2 a0, vec3 l, float tw, float lean, out vec3 gn, out float J, out vec3 base){
  vec3 d = gsOff(a0, tw, 1., gn, J); base = vec3(a0.x + d.x, d.y, a0.y + d.z);
  vec3 up = normalize(mix(vec3(0., 1., 0.), gn, lean));
  vec3 tx = normalize(vec3(up.y, -up.x, 0.)), tz = cross(tx, up);
  return base + tx * l.x + up * l.y + tz * l.z;
}`,rt=(e,a,s)=>{let i=1e9;const u={};for(let d=0;d<=l.N;d+=6){const r=l.X[d]-e,p=l.Z[d]-a;if(!(r*r+p*p>12100))for(let b=-1;b<=1;b++){se.at(e,a,l.TWs[d]+b*.9,u);const v=u.x-l.X[d],M=u.z-l.Z[d],w=Math.max(0,l.Y[d]-(u.y+s),u.y-l.Y[d]);i=Math.min(i,Math.hypot(v,M,w))}}return i};x.uRain={value:0},x.uWin={value:new t.Vector2};{const e=1-U.reduce((a,s)=>a+s.k*s.A,0);x.uCapJ={value:le.sea==="glassy"?new t.Vector2(e-.03,e+.07):new t.Vector2(e+.1,e+.26)}}const Oe=(e,a,s)=>{const i=new t.InstancedBufferGeometry;i.index=e.index;for(const u in e.attributes)i.setAttribute(u,e.attributes[u]);for(const u in s)i.setAttribute(u,new t.InstancedBufferAttribute(s[u].a,s[u].n));return i.instanceCount=a,i.boundingSphere=new t.Sphere(new t.Vector3(ee.x/2,0,ee.z/2),9e3),i},c0=`
// the meadow's broad tones, the same fields the ground shader paints: dark cool troughs, bright crests, patches,
// and where daisy caps (fl.x) and campion drifts (fl.y) lie
uniform float uDrift, uRelK; uniform vec2 uBackDir;
vec3 gsTint(vec2 a0, float y, float J, vec2 nxz, float dist, out vec2 fl){
  float n1 = texture2D(uNoise, a0 * 0.0027).r, n2 = texture2D(uNoise, a0 * 0.017 + 0.37).g, nT = texture2D(uNoise, a0 * 0.037 + 0.71).a;
  float fb = n1 * 0.45 + texture2D(uNoise, a0 * 0.0071 + 0.19).b * 0.33 + n2 * 0.22;
  float hN = smoothstep(-1., 0.95, y / max(uTr[0].w, 1.));
  float rel = clamp(dot(nxz, uBackDir) * 3.4, -1., 1.);
  vec3 t = gsSea(rel, hN, dist) * (1. - 0.28 * smoothstep(0.3, 0.75, fb)) * (0.9 + 0.2 * nT);
  float w = 1. - smoothstep(uCapJ.x + 0.04, uCapJ.y + 0.04, J + (n2 - 0.5) * 0.10 + (n1 - 0.5) * 0.06);
  float dr1 = gsDrift(uNoise, a0), dr2 = gsDrift(uNoise, a0 + vec2(517., 263.));
  fl = vec2(clamp(w * 0.9 + uDrift * dr1 * 0.8, 0., 1.), dr2 * 0.6 * (1. - w));
  return t;
}
`,it=120;let yt="";const Ot=(e,a,s,i,u)=>{const d=[],r=[];for(let w=0;w<2;w++){const F=w*Math.PI/2+.3,N=Math.cos(F)*.75,z=Math.sin(F)*.75,R=[[-1,0],[1,0],[1,1],[-1,0],[1,1],[-1,1]];for(const[W,I]of R)d.push(N*W,I*1.2,z*W),r.push(I,W*.5+.5+w*1.7)}const p=new t.BufferGeometry;p.setAttribute("position",new t.Float32BufferAttribute(d,3)),p.setAttribute("aBlade",new t.Float32BufferAttribute(r,2));const b=new Float32Array(s*4);for(let w=0;w<s;w++)b[w*4]=i()*e,b[w*4+1]=i()*e,b[w*4+2]=i(),b[w*4+3]=i();const v=new t.ShaderMaterial({uniforms:x,side:t.DoubleSide,vertexShader:$e+Pe+ot+`
attribute vec2 aBlade; attribute vec4 aOff; uniform vec2 ${a}, uCapJ; uniform float uTime; uniform sampler2D uNoise;
varying vec3 vC; varying vec2 vT; varying vec3 vW; varying vec3 vN; varying float vSh; varying vec3 vTint; varying vec2 vFl;
varying float vDr;                                                                   // the campion drift at this blade's rest place, 0..1 (CAMPION DRIFTS IN THE GRASS)
// the meadow's broad tones, the same fields the ground shader paints: dark cool troughs, bright crests, patches,
// and where daisy caps (fl.x) and campion drifts (fl.y) lie
uniform float uDrift, uRelK; uniform vec2 uBackDir;
vec3 gsTint(vec2 a0, float y, float J, vec2 nxz, float dist, out vec2 fl){
  float n1 = texture2D(uNoise, a0 * 0.0027).r, n2 = texture2D(uNoise, a0 * 0.017 + 0.37).g, nT = texture2D(uNoise, a0 * 0.037 + 0.71).a;
  float fb = n1 * 0.45 + texture2D(uNoise, a0 * 0.0071 + 0.19).b * 0.33 + n2 * 0.22;
  float hN = smoothstep(-1., 0.95, y / max(uTr[0].w, 1.));
  float rel = clamp(dot(nxz, uBackDir) * 3.4, -1., 1.);
  vec3 t = gsSea(rel, hN, dist) * (1. - 0.28 * smoothstep(0.3, 0.75, fb)) * (0.9 + 0.2 * nT);
  float w = 1. - smoothstep(uCapJ.x + 0.04, uCapJ.y + 0.04, J + (n2 - 0.5) * 0.10 + (n1 - 0.5) * 0.06);
  float dr1 = gsDrift(uNoise, a0), dr2 = gsDrift(uNoise, a0 + vec2(517., 263.));
  fl = vec2(clamp(w * 0.9 + uDrift * dr1 * 0.8, 0., 1.), dr2 * 0.6 * (1. - w));
  return t;
}
void main(){
  vec2 a0 = ${a} + mod(aOff.xy - ${a}, ${e.toFixed(1)}) - ${(e/2).toFixed(1)};
  float edge = 1. - smoothstep(${(e*.36).toFixed(1)}, ${(e*.49).toFixed(1)}, length(a0 - ${a}));
  float t = aBlade.x, card = step(1.6, aBlade.y), sc = (0.75 + 0.55 * aOff.w) * edge;
  float lu = (aBlade.y - card * 1.7 - 0.5) * 1.5;                                  // metres along the card
  // wind: gusts combing across the swells, the grass flattening on the crowded lips
  float gust = texture2D(uNoise, a0 * vec2(0.0035, 0.0105) + vec2(0.011, -0.034) * uTime).g;
  vec3 gn0; float J0; vec3 d0 = gsOff(a0, uTw, 1., gn0, J0);
  float flt = 1. - smoothstep(uCapJ.x, uCapJ.y + 0.1, J0);
  float bend = (0.2 + 0.85 * gust + 0.7 * flt) * t + 0.08 * sin(uTime * 3.1 + aOff.z * 40. + a0.x * 0.4) * t;
  float wa = (aOff.w - 0.5) * 1.5; vec2 wd = vec2(0.25 * cos(wa) + 0.95 * sin(wa), -0.95 * cos(wa) + 0.25 * sin(wa));
  vec3 gn = gn0; float J = J0; vec3 b = vec3(a0.x + d0.x, d0.y, a0.y + d0.z);
  // the two cards of a tuft stand either side of broadside to the eye and, seen from above, lean back to face it:
  // a tuft is a feathery clump from every height, never a cross
  vec3 Vc = cameraPosition - b; float cd = max(length(Vc), 1e-3); Vc /= cd; float hl = length(Vc.xz); vec2 hd = hl > 1e-3 ? Vc.xz / hl : vec2(0., 1.);
  float ja = (aOff.z - 0.5) * 1.0 + (card - 0.5) * 1.05, cj = cos(ja), sj = sin(ja);
  vec2 sd = vec2(-hd.y * cj - hd.x * sj, -hd.y * sj + hd.x * cj);
  vec3 upF = cross(vec3(sd.x, 0., sd.y), Vc); if (upF.y < 0.) upF = -upF;
  vec3 up = normalize(mix(normalize(gn + vec3(0., 0.5, 0.)), upF, 0.66 * smoothstep(0.08, 0.45, Vc.y)));
  float hgt = t * 1.2 * sc;
  vec3 w = b + vec3(sd.x, 0., sd.y) * lu * sc + up * hgt * (1. - 0.4 * bend) + vec3(wd.x, 0., wd.y) * bend * hgt - up * 0.1;
  vW = w; vT = vec2(t, aBlade.y); vN = normalize(gn + vec3(0., 0.6, 0.)); vSh = gsCloud(w.xz) * gsWaveSh(a0, 0., uTw);
  vC = vec3(aOff.w, 0., aOff.z);
  vec2 fl0; vTint = gsTint(a0, d0.y, J0, gn0.xz, distance(vec3(a0.x + d0.x, d0.y, a0.y + d0.z), cameraPosition), fl0); vFl = vec2(0.);
  vDr = gsDrift(uNoise, a0 + vec2(517., 263.));                                      // the campion's drift where this tuft is rooted: its rest place alone
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
}`,fragmentShader:Pe+`
uniform vec3 uGrass, uDarkG, uLime, uCap, uAccent; uniform sampler2D uNoise;
varying vec3 vC; varying vec2 vT; varying vec3 vW; varying vec3 vN; varying float vSh; varying vec3 vTint; varying vec2 vFl;
varying float vDr;                                                                   // the campion drift at this blade's rest place, 0..1 (CAMPION DRIFTS IN THE GRASS)
void main(){
  float dist = length(cameraPosition - vW);
  float x = vT.y * 6. + vC.z * 31., i = floor(x), f = fract(x) - 0.5;
  vec2 hk = texture2D(uNoise, vec2((i + 0.5) / 128., vC.x)).rg;
  float h = 0.42 + 0.58 * hk.x, r = vT.x / h;
  f += (hk.y - 0.5) * 1.1 * vT.x * vT.x;
  float seedHead = smoothstep(0.72, 0.85, r) * (1. - smoothstep(0.95, 1., r)) * step(0.45, hk.y);
  float wdt = 0.34 * (1. - r) + 0.17 * seedHead + 0.2 * smoothstep(18., 70., dist) * (1. - r);
  if (r > 1. || abs(f) > wdt) discard;
  float rs = mix(r, 0.55 + 0.45 * r, vC.y);                                          // far cards: less dark at the root, so no dashes
  vec3 alb = mix(mix(uDarkG, uGrass, 0.5) * 0.92, mix(uGrass, uLime, 0.3 + 0.5 * vC.x), smoothstep(0., 0.55, rs));
  float drB = smoothstep(0.5, 0.78, r) * step(0.5, texture2D(uNoise, vec2((i + 0.5) / 128., vC.x)).b - 0.1 - 0.6 * (1. - vDr)); alb = mix(alb, uAccent / max(uAccent.r, max(uAccent.g, uAccent.b)), drB);   // in a campion drift a blade is grass or it flowers, blade by blade (one in three in the drift's core, none at its edge), and a flowering blade's top is the campion's own hue at its full strength, nothing darkened; laid UNDER the seed heads, the caps and the campion heads, which go on over it below exactly as they do outside a drift
  alb = mix(alb, mix(uLime, uCap, 0.5) * 0.95, seedHead * 0.85);
  alb *= (0.85 + 0.3 * hk.x) * vTint;
  float fw = step(0.35, hk.y) * smoothstep(0.5, 0.78, r);                          // far flowers: the heads themselves whiten or redden
  alb = mix(alb, uCap, min(vFl.x, 1.) * max(fw, clamp(vFl.x - 1., 0., 1.) * smoothstep(0.15, 0.45, r))); alb = mix(alb, uAccent, vFl.y * fw * step(0.55, hk.x));   // vFl.x over 1: the whole blade whitens (the comber's peeling line)
  vec3 V = normalize(cameraPosition - vW);
  vec3 c = gsLit(alb, vN, vSh, 1.) * (0.74 + 0.26 * rs) * (1. + 0.1 * vC.y);
  float back = max(dot(-V, uSunDir), 0.); c += alb * uLime * uSunCol * vSh * back * back * 0.9 * r;
  c += uAccent * (vec3(0.05, 0.04, 0.09) + uSkyCol * 0.3) * drB * (1. - seedHead * 0.85) * (1. - min(vFl.x, 1.) * max(fw, clamp(vFl.x - 1., 0., 1.) * smoothstep(0.15, 0.45, r)));   // as the heads do, a rose blade top keeps its colour in shade; none of it on a pale seed head or a whitened top (the same weights as the two lines that lay them on)
  gl_FragColor = vec4(gsFog(gsHold(c), dist, vW.y), 1.);
}`}),M=new t.Mesh(Oe(p,s,{aOff:{a:b,n:4}}),v);M.frustumCulled=!1,M.name=u,pe.add(M),yt=v.fragmentShader};Ot(it,"uWin",Math.round(6400*me*Ve(le.density,.8,1.15)),y.fork?y.fork("grass"):y,"grass"),await h.yield(),x.uWin0={value:new t.Vector2};{const e=yt;Ot(46,"uWin0",Math.round(4800*me),h.core.makeRng(((h.seed|0)^6595)+733),"grass-near"),yt=e}await h.yield();const ht=460;x.uWin2={value:new t.Vector2},x.uFwd={value:new t.Vector2(0,1)};{const e=Math.round(8400*me*Ve(le.density,.85,1.1)),a=h.core.makeRng(((h.seed|0)^12061)+4421),s=new t.BufferGeometry;s.setAttribute("position",new t.Float32BufferAttribute([-1,0,0,1,0,0,1,1,0,-1,0,0,1,1,0,-1,1,0],3));const i=new Float32Array(e*4);for(let r=0;r<e;r++)i[r*4]=a()*ht,i[r*4+1]=a()*ht,i[r*4+2]=a(),i[r*4+3]=a();const u=new t.ShaderMaterial({uniforms:x,side:t.DoubleSide,vertexShader:$e+Pe+ot+`
attribute vec4 aOff; uniform vec2 uWin2, uFwd, uCapJ; uniform float uTime; uniform sampler2D uNoise;
varying vec3 vC; varying vec2 vT; varying vec3 vW; varying vec3 vN; varying float vSh; varying vec3 vTint; varying vec2 vFl;
varying float vDr;                                                                   // the campion drift at this blade's rest place, 0..1 (CAMPION DRIFTS IN THE GRASS)
// the meadow's broad tones, the same fields the ground shader paints: dark cool troughs, bright crests, patches,
// and where daisy caps (fl.x) and campion drifts (fl.y) lie
uniform float uDrift, uRelK; uniform vec2 uBackDir;
vec3 gsTint(vec2 a0, float y, float J, vec2 nxz, float dist, out vec2 fl){
  float n1 = texture2D(uNoise, a0 * 0.0027).r, n2 = texture2D(uNoise, a0 * 0.017 + 0.37).g, nT = texture2D(uNoise, a0 * 0.037 + 0.71).a;
  float fb = n1 * 0.45 + texture2D(uNoise, a0 * 0.0071 + 0.19).b * 0.33 + n2 * 0.22;
  float hN = smoothstep(-1., 0.95, y / max(uTr[0].w, 1.));
  float rel = clamp(dot(nxz, uBackDir) * 3.4, -1., 1.);
  vec3 t = gsSea(rel, hN, dist) * (1. - 0.28 * smoothstep(0.3, 0.75, fb)) * (0.9 + 0.2 * nT);
  float w = 1. - smoothstep(uCapJ.x + 0.04, uCapJ.y + 0.04, J + (n2 - 0.5) * 0.10 + (n1 - 0.5) * 0.06);
  float dr1 = gsDrift(uNoise, a0), dr2 = gsDrift(uNoise, a0 + vec2(517., 263.));
  fl = vec2(clamp(w * 0.9 + uDrift * dr1 * 0.8, 0., 1.), dr2 * 0.6 * (1. - w));
  return t;
}
void main(){
  vec2 a0 = uWin2 + mod(aOff.xy - uWin2, ${ht.toFixed(1)}) - ${(ht/2).toFixed(1)};
  float edge = 1. - smoothstep(${(ht*.3).toFixed(1)}, ${(ht*.48).toFixed(1)}, length(a0 - uWin2));
  vec3 gn; float J; vec3 d = gsOff(a0, uTw, 1., gn, J);
  vec3 b = vec3(a0.x + d.x, d.y, a0.y + d.z);
  float cd = distance(b, cameraPosition);
  edge *= smoothstep(34., 62., cd);                                            // the real tufts take over near the camera
  float t = position.y, ja = (aOff.z - 0.5) * 1.1, ca = cos(ja), sa = sin(ja);
  vec3 Vc = (cameraPosition - b) / max(cd, 1e-3); float hl = length(Vc.xz); vec2 hd = hl > 1e-3 ? Vc.xz / hl : vec2(0., 1.);
  vec2 side = vec2(-hd.y, hd.x); side = vec2(side.x * ca - side.y * sa, side.x * sa + side.y * ca);
  vec2 urB; float nfB; float bowB = gsShape(a0, urB, nfB).z;
  float rimC = max(smoothstep(0.9, 0.985, cos(uTr[0].z * dot(uTr[0].xy, a0) - uTo[0].x * uTw - uTo[0].y)) * smoothstep(0.55, 0.9, smoothstep(-1., 0.95, d.y / max(uTr[0].w, 1.))), smoothstep(0.5, 0.9, bowB)) * smoothstep(45., 150., cd);
  float wid = (1.9 + 1.5 * aOff.w) * (1. + cd * 0.004), hgt = (1.25 + 0.6 * aOff.w) * edge * (1. + cd * 0.0022) * (1. + 0.6 * rimC);
  float gust = texture2D(uNoise, a0 * vec2(0.0035, 0.0105) + vec2(0.011, -0.034) * uTime).g;
  float flt = 1. - smoothstep(uCapJ.x, uCapJ.y + 0.1, J);
  float bend = (0.2 + 0.85 * gust + 0.7 * flt) * t + 0.07 * sin(uTime * 3.1 + aOff.z * 40. + a0.x * 0.4) * t;
  vec3 upF = cross(vec3(side.x, 0., side.y), Vc); if (upF.y < 0.) upF = -upF;      // seen from above the cards lean back to face the eye
  vec3 up = normalize(mix(normalize(gn + vec3(0., 0.4, 0.)), upF, 0.72));
  vec3 w = b + vec3(side.x, 0., side.y) * position.x * wid + up * t * hgt * (1. - 0.4 * bend) + vec3(0.25, 0., -0.95) * bend * t * hgt - up * 0.15;
  vW = w; vT = vec2(t, (position.x * 0.5 + 0.5) * 1.5); vN = normalize(gn + vec3(0., 0.6, 0.)); vSh = gsCloud(w.xz) * gsWaveSh(a0, 0., uTw);
  vC = vec3(aOff.w, 1., aOff.z);
  vTint = gsTint(a0, d.y, J, gn.xz, cd, vFl); vFl *= smoothstep(40., 75., cd);
  vTint *= 1. + 1.0 * rimC; vFl.x = max(vFl.x, rimC * (0.8 + 1.0 * step(0.45, aOff.z)));
  vDr = gsDrift(uNoise, a0 + vec2(517., 263.));                                      // the campion's drift where this card is rooted: its rest place alone
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
}`,fragmentShader:yt}),d=new t.Mesh(Oe(s,e,{aOff:{a:i,n:4}}),u);d.frustumCulled=!1,d.name="far-grass",pe.add(d)}await h.yield();{const e=Me.lip,a=5800,s=h.core.makeRng(((h.seed|0)^27423)+1231),i=new t.BufferGeometry;i.setAttribute("position",new t.Float32BufferAttribute([-1,0,0,1,0,0,1,1,0,-1,0,0,1,1,0,-1,1,0],3));const u=new Float32Array(a*4);for(let p=0;p<a;p++){const b=Ve(s.gauss()*1.05,-2.3,2.3),v=s();u[p*4]=(b/Le%1+1)%1*e.segments,u[p*4+1]=v<.4?s.range(.15,6):v<.56?s.range(6,10.5):s.range(8,e.rows-1.2),u[p*4+2]=s(),u[p*4+3]=s(),v>=.56&&(u[p*4]+=1e3)}const d=new t.ShaderMaterial({uniforms:{...x,uLip:{value:e.texture}},side:t.DoubleSide,vertexShader:$e+Pe+ot+`
attribute vec4 aLp; uniform sampler2D uLip, uNoise; uniform vec2 uCapJ; uniform float uTime;
varying vec3 vC; varying vec2 vT; varying vec3 vW; varying vec3 vN; varying float vSh; varying vec3 vTint; varying vec2 vFl;
varying float vDr;                                                                   // the campion drift at this blade's rest place, 0..1 (CAMPION DRIFTS IN THE GRASS)
`+c0+`
vec4 gsLipT(float i, float v){ return texture2D(uLip, vec2((i + 0.5) / ${e.segments.toFixed(1)}, (v + 0.5) / ${e.rows.toFixed(1)})); }
void main(){
  float soilS = step(500., aLp.x), ax = aLp.x - 1000. * soilS;
  float i0 = floor(ax), fi = ax - i0, v0 = floor(aLp.y), fv = aLp.y - v0;
  vec4 A = gsLipT(i0, v0), B = gsLipT(i0 + 1., v0), C = gsLipT(i0, v0 + 1.), D = gsLipT(i0 + 1., v0 + 1.);
  vec4 P = mix(mix(A, B, fi), mix(C, D, fi), fv);
  vec3 nn = cross(B.xyz - A.xyz, C.xyz - A.xyz); float nl = length(nn);
  vec3 Nl = nl > 1e-4 ? nn / nl : vec3(0., 1., 0.);
  float tt = aLp.y < 7. ? 0.45 * aLp.y / 7. : 0.45 + 0.55 * (aLp.y - 7.) / 14.;                 // 0 at the foot, 0.45 where it peels, 1 at the torn tip
  // sods on the soil side: through the sheet (its thickness thins toward the tip), in rags
  float hang = smoothstep(-0.3, -0.65, Nl.y) * (1. - soilS);                                      // the grass side where it hangs face down: the hollow, bare soil and roots
  P.xyz -= Nl * soilS * (0.5 + (2.4 * pow(max(1. - tt, 0.), 0.8) + 3.4 * smoothstep(0.25, 0.55, tt) * (1. - smoothstep(0.82, 1., tt))) * min(1., P.w * 2.2)); Nl = mix(Nl, -Nl, soilS);
  vec3 b = (modelMatrix * vec4(P.xyz, 1.)).xyz, wn = normalize(mat3(modelMatrix) * Nl);
  float ragN = texture2D(uNoise, vec2(ax * 0.021, aLp.y * 0.043)).r;
  float show = smoothstep(0.04, 0.2, P.w) * mix(1., 0.8 + 0.2 * ragN, soilS) * (1. - 0.5 * smoothstep(0.93, 1., tt)) * (1. - hang);
  vec2 a0 = b.xz; vec3 gn; float J; vec3 d = gsOff(a0, uTw, 1., gn, J);
  float cd = distance(b, cameraPosition); vec3 Vc = (cameraPosition - b) / max(cd, 1e-3);
  // blades grow out of the sod and turn up toward the light; the card stands broadside to the eye along that line
  vec3 G = normalize(wn * 0.8 + vec3(0., 0.55, 0.));
  vec3 sdv = cross(G, Vc); float sl = length(sdv);
  if (sl > 0.05) sdv /= sl; else { sdv = cross(vec3(0., 1., 0.), Vc); sdv = length(sdv) > 1e-3 ? normalize(sdv) : vec3(1., 0., 0.); }
  vec3 upF = cross(Vc, sdv); if (dot(upF, G) < 0.) upF = -upF;
  vec3 up = normalize(mix(G, upF, 0.7));
  float t = position.y, wid = (1.7 + 1.4 * aLp.z) * (1. + cd * 0.004), hgt = (1.25 + 0.7 * aLp.z) * show * (1. + cd * 0.0022);
  float gust = texture2D(uNoise, a0 * vec2(0.0035, 0.0105) + vec2(0.011, -0.034) * uTime).g;
  float bend = (0.3 + 0.8 * gust) * t + 0.07 * sin(uTime * 3.1 + aLp.w * 40. + a0.x * 0.4) * t;
  vec3 w = b + wn * 0.15 + sdv * position.x * wid * show + up * t * hgt * (1. - 0.3 * bend) + vec3(0.25, 0., -0.95) * bend * t * hgt * 0.6;
  vW = w; vT = vec2(t, (position.x * 0.5 + 0.5) * 1.5); vN = normalize(gn + vec3(0., 0.6, 0.));
  vSh = gsCloud(w.xz) * gsWaveSh(a0, max(w.y - d.y, 0.), uTw);
  vC = vec3(aLp.z, 1., aLp.w);
  vTint = gsTint(a0, d.y, J, gn.xz, cd, vFl);
  vTint *= 1. + 0.25 * soilS;                                                                   // the crest catches the light
  // the crest line: the torn streak of the season's flowers runs the whole length of the comber. On top of the thrown lip it is the
  // leading third of the sheet (and torn patches behind it); on the rising face it is where the sheet stands upright and turns over.
  // It is broken card by card (aLp.w) and by a fine noise along the lip, never by gaps longer than a few metres
  float peelN = texture2D(uNoise, vec2(ax * 0.11, 0.31)).g * 0.5 + 0.5 * aLp.w;
  float peel = soilS * max(smoothstep(0.62, 0.74, tt) * smoothstep(0.14, 0.3, peelN), smoothstep(0.5, 0.6, tt) * smoothstep(0.42, 0.58, peelN));
  float crestC = (1. - soilS) * smoothstep(0.34, 0.42, tt) * (1. - smoothstep(-0.25, -0.5, Nl.y)) * smoothstep(0.16, 0.32, peelN);
  vTint *= 1. + 0.35 * crestC;
  vFl = vec2(max(max(vFl.x, max(peel, crestC) * 1.9), 0.6 * step(0.62, aLp.w)), vFl.y);
  vDr = 0.;                                                                          // no drift on the comber: its grass stays as it is
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
}`,fragmentShader:yt}),r=new t.Mesh(Oe(i,a,{aLp:{a:u,n:4}}),d);r.frustumCulled=!1,r.name="lip-grass",Me.object.add(r),Me.setMeadow(new t.Color(.62,.66,.6))}await h.yield();const Jt=`
mat3 gsBasis(vec2 a0, float tw, float lean, out vec3 gn, out float J, out vec3 base){
  vec3 d = gsOff(a0, tw, 1., gn, J); base = vec3(a0.x + d.x, d.y, a0.y + d.z);
  vec3 up = normalize(mix(vec3(0., 1., 0.), gn, lean)); vec3 tx = normalize(vec3(up.y, -up.x, 0.));
  return mat3(tx, up, cross(tx, up));
}`;{const e=Math.round(11e3*me*le.density),a=y.fork?y.fork("flowers"):y,s=new t.BufferGeometry;s.setAttribute("position",new t.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,-1,0,1,1,0,-1,1,0],3));const i=new Float32Array(e*4);for(let r=0;r<e;r++)i[r*4]=a()*it,i[r*4+1]=a()*it,i[r*4+2]=a(),i[r*4+3]=a();const u=new t.ShaderMaterial({uniforms:x,vertexShader:$e+Pe+ot+`
attribute vec4 aOff; uniform vec2 uWin, uCapJ; uniform float uTime; uniform sampler2D uNoise;
varying vec2 vUv; varying vec4 vK; varying vec3 vW; varying float vSh;
void main(){
  vec2 a0 = uWin + mod(aOff.xy - uWin, ${it.toFixed(1)}) - ${(it/2).toFixed(1)};
  float edge = 1. - smoothstep(${(it*.36).toFixed(1)}, ${(it*.49).toFixed(1)}, length(a0 - uWin));
  float pch = texture2D(uNoise, a0 * 0.017 + 0.37).g * 0.6 + texture2D(uNoise, a0 * 0.0027).r * 0.5;
  vec3 gn; float J; vec3 d = gsOff(a0, uTw, 1., gn, J);
  float w = 1. - smoothstep(uCapJ.x, uCapJ.y + 0.02, J);
  float campion = step(0.86, aOff.w);
  float dr1 = gsDrift(uNoise, a0), dr2 = gsDrift(uNoise, a0 + vec2(517., 263.));
  float keep = mix(smoothstep(0.2, 0.6, dr1 + w * 0.5 + aOff.z * 0.15), smoothstep(0.2, 0.6, dr2 + aOff.z * 0.15), campion);   // heads lie in drifts and on the caps
  float gust = texture2D(uNoise, a0 * vec2(0.0035, 0.0105) + vec2(0.011, -0.034) * uTime).g;
  float h = mix(0.75 + 0.5 * aOff.z, 1.45 + 0.4 * aOff.z, campion);
  vec3 p = vec3(a0.x + d.x, d.y, a0.y + d.z) + gn * h;
  float sway = (0.3 + 0.9 * gust) * mix(0.5, 1., campion) + 0.12 * sin(uTime * (2.6 + aOff.z) + aOff.z * 50.);
  p.xz += vec2(0.25, -0.95) * sway * h * 0.55;
  vec4 mv = viewMatrix * vec4(p, 1.); float dist = -mv.z;
  float s = mix(0.13 + 0.11 * w, 0.19, campion) * (0.75 + 0.5 * aOff.z);
  // between the drifts, within a stone's throw of the eye, campion still stands above the grass (two heads in five) and a lone daisy
  // here and there: flowers in the near grass always, plain grass farther off
  keep = max(keep, step(mix(0.9, 0.6, campion), fract(aOff.z * 7.13)) * (1. - smoothstep(24., 44., dist)));
  s = min(max(s, min(dist, 70.) * 0.0042), max(dist, 0.5) * 0.011) * edge * keep;      // heads stay a few pixels across out to the window's edge, and none fills more than a fiftieth of the frame at the lens
  mv.xy += position.xy * s;
  vUv = position.xy; vK = vec4(campion, aOff.z, w, dist); vW = p; vSh = gsCloud(p.xz) * gsWaveSh(a0, 1., uTw);
  gl_Position = projectionMatrix * mv;
}`,fragmentShader:Pe+`
uniform vec3 uCap, uAccent, uEye; varying vec2 vUv; varying vec4 vK; varying vec3 vW; varying float vSh;
void main(){
  float r = length(vUv), ang = atan(vUv.y, abs(vUv.x) < 1e-4 ? 1e-4 : vUv.x) + vK.y * 6.283;
  float lobes = mix(11., 5., vK.x), pet = 0.74 + 0.26 * cos(ang * lobes) * mix(0.6, 1., vK.x);
  if (r > pet) discard;
  vec3 alb = mix(uCap, uAccent * (0.75 + 0.5 * vK.y), vK.x);
  float eye = 1. - smoothstep(0.2, 0.3, r);
  alb = mix(alb, mix(uEye, vec3(0.95, 0.85, 0.75), vK.x), eye * (1. - 0.6 * vK.x));
  alb *= 0.82 + 0.18 * smoothstep(0.2, 0.9, r);
  vec3 n = normalize(vec3(vUv.x * 0.5, 1., vUv.y * 0.5));
  vec3 c = gsLit(alb, n, vSh, 0.6) + alb * (vec3(0.05, 0.04, 0.09) + uSkyCol * 0.3);   // a lilac shadow side; a head keeps its colour in shade
  gl_FragColor = vec4(gsFog(gsHold(c), vK.w, vW.y), 1.);
}`}),d=new t.Mesh(Oe(s,e,{aOff:{a:i,n:4}}),u);d.frustumCulled=!1,d.name="flowers",pe.add(d)}await h.yield();{const e=y.fork?y.fork("erratics"):y,a=Math.round(290*Math.max(me,.75)),s=z=>{const R=new t.IcosahedronGeometry(1,z).toNonIndexed(),W=R.attributes.position;for(let I=0;I<W.count;I++){const j=W.getX(I),ae=W.getY(I),H=W.getZ(I),m=1+.26*h.noise.n3(j*1.3+7,ae*1.3,H*1.3)+.1*h.noise.n3(j*3.1,ae*3.1+5,H*3.1),J=P=>Math.sign(P)*Math.pow(Math.abs(P),.8);W.setXYZ(I,J(j)*m,J(ae)*m*.72,J(H)*m)}R.computeVertexNormals();{const I=R.attributes.normal,j=new t.Vector3,ae=new t.Vector3;for(let H=0;H<W.count;H++)j.fromBufferAttribute(I,H),ae.fromBufferAttribute(W,H).normalize(),j.lerp(ae,.55).normalize(),I.setXYZ(H,j.x,j.y,j.z)}return R},i=s(1),u=s(0),d=[],r=[],p=[],b=[];for(let z=0;(d.length+p.length)/2<a&&z<a*12;z++){z%60===59&&await h.yield();const R=Math.floor(e.range(0,l.N-150)),W=e()<.5?-1:1,I=8+420*Math.pow(e(),2.2),j=e.range(-30,60),ae=Math.atan2(l.X[Math.min(R+4,l.N)]-l.X[R],l.Z[Math.min(R+4,l.N)]-l.Z[R]),H=l.X[R]+Math.cos(ae)*I*W+Math.sin(ae)*j,m=l.Z[R]-Math.sin(ae)*I*W+Math.cos(ae)*j;if(Math.hypot(H-ee.x,m-ee.z)<215)continue;const J=se.inv(H,m,l.TWs[R],{}),P=e.range(1,4)*(e()<.12?1.5:1)*.55;rt(J.x0,J.z0,P*1.2)<7.5+P||((I>70?p:d).push(J.x0,J.z0),(I>70?b:r).push(e.range(0,Le),P*e.range(.8,1.3),P*e.range(.7,1.2),e()))}const v=[[262,-27,2.6],[330,26,3.2],[374,-31,3.4],[1085,14,2.4]];for(let z=0;z<15;z++)v.push([132+z*26,(z%2?1:-1)*(z%3===0?9.5:z%3===1?15:21),1.1+.9*(z*.37%1)]);for(let z=0;z<12;z++)v.push([1060+z*27,(z%2?1:-1)*(z%3===0?10:z%3===1?17:26),1+1*(z*.43%1)]);for(const[z,R,W]of v){const I=Math.atan2(l.X[z+4]-l.X[z],l.Z[z+4]-l.Z[z]),j=se.inv(l.X[z]+Math.cos(I)*R,l.Z[z]-Math.sin(I)*R,l.TWs[z],{});rt(j.x0,j.z0,W*1.2)<5.5+W||(d.push(j.x0,j.z0),r.push(z*1.7,W,W*.9,z%7/7))}const M=d.length/2,w=new t.ShaderMaterial({uniforms:x,vertexShader:$e+Pe+ot+Jt+`
attribute vec2 aAnc; attribute vec4 aRS; varying vec3 vN; varying vec3 vL; varying vec3 vW; varying vec2 vSh;
void main(){
  float c = cos(aRS.x), s = sin(aRS.x);
  vec3 l = vec3(position.x * c - position.z * s, position.y, position.x * s + position.z * c) * vec3(aRS.y, aRS.z, aRS.y);
  vec3 nl = vec3(normal.x * c - normal.z * s, normal.y, normal.x * s + normal.z * c);
  vec3 gn; float J; vec3 base; mat3 B = gsBasis(aAnc, uTw, 1., gn, J, base);
  l.y += aRS.z * 0.22;
  vW = base + B * l; vN = B * nl; vL = position * aRS.y + aRS.w * 37.; vSh = vec2(gsCloud(vW.xz) * gsWaveSh(aAnc, 1., uTw), smoothstep(-0.1, 0.5, l.y / max(aRS.z, 0.1)));
  gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.);
}`,fragmentShader:Pe+`
uniform sampler2D uNoise; uniform vec3 uLime, uGrass; varying vec3 vN; varying vec3 vL; varying vec3 vW; varying vec2 vSh;
void main(){
  vec3 n = normalize(vN);
  float a = texture2D(uNoise, vL.xz * 0.21 + vL.y * 0.13).r, b = texture2D(uNoise, vL.xy * 0.9 + vL.z * 0.31).g, c2 = texture2D(uNoise, vL.zy * 0.33).b;
  vec3 alb = vec3(0.4, 0.42, 0.43) * (0.65 + 0.7 * a) * (0.8 + 0.4 * b);
  float c3 = texture2D(uNoise, vL.xz * 0.11 + vL.y * 0.07 + 0.3).a;
  alb = mix(alb, vec3(0.5, 0.52, 0.44), smoothstep(0.45, 0.6, c3) * 0.6);                                      // pale grey-green crust
  alb = mix(alb, vec3(0.5, 0.37, 0.1), smoothstep(0.46, 0.6, c2) * smoothstep(-0.1, 0.6, n.y) * 0.85);       // ochre lichen in patches
  alb *= 0.9 + 0.25 * texture2D(uNoise, vL.xy * 2.3 + vL.z * 1.7).r;                                           // grain
  alb = mix(alb, uGrass * 0.6, (1. - vSh.y) * 0.8);                                                         // moss and turf at the foot
  alb *= 0.5 + 0.5 * vSh.y;
  vec3 c = gsLit(alb, n, vSh.x, 0.) + alb * (uSunCol * vec3(0.07, 0.11, 0.05) + uSkyCol * 0.4 * (0.6 + 0.4 * n.y));   // shade on granite is slate, not black
  gl_FragColor = vec4(gsFog(c, length(cameraPosition - vW), vW.y), 1.);
}`}),F=new t.Mesh(Oe(i,M,{aAnc:{a:new Float32Array(d),n:2},aRS:{a:new Float32Array(r),n:4}}),w);F.frustumCulled=!1,F.name="erratics",pe.add(F),p.length||(p.push(d[0],d[1]),b.push(0,1,1,.5));const N=new t.Mesh(Oe(u,p.length/2,{aAnc:{a:new Float32Array(p),n:2},aRS:{a:new Float32Array(b),n:4}}),w);N.frustumCulled=!1,N.name="erratics-far",pe.add(N),gt.push(i,u)}await h.yield();const Dt=async(e,a)=>{const s=e===2,i=[],u=[],d=[],r=[],p=[],b=new t.Matrix4,v=new t.Vector3,M=new t.Vector3,w=new t.Matrix3,F=(c,f,q,E,ne,oe)=>{const ue=c.index?c.toNonIndexed():c,xe=ue.attributes.position,we=ue.attributes.normal;w.getNormalMatrix(f);for(let re=0;re<xe.count;re++){v.fromBufferAttribute(xe,re).applyMatrix4(f),M.fromBufferAttribute(we,re).applyMatrix3(w).normalize(),i.push(v.x,v.y,v.z),u.push(M.x,M.y,M.z),d.push(E(v),q),p.push(oe?oe(v,M):1);const be=ne?ne(re):[0,0];r.push(be[0],be[1])}ue.dispose(),ue!==c&&c.dispose()},N=()=>{const c=new t.BufferGeometry;return c.setAttribute("position",new t.Float32BufferAttribute(i,3)),c.setAttribute("normal",new t.Float32BufferAttribute(u,3)),c.setAttribute("aPart",new t.Float32BufferAttribute(d,2)),c.setAttribute("uv",new t.Float32BufferAttribute(r,2)),c.setAttribute("aSh",new t.Float32BufferAttribute(p,1)),c.userData.clumps=H,c},z=9.5,R=c=>ie(3,14,c.y),W=new t.Vector3(0,13.2,0),I=new t.Vector3(5.7,4.3,5.7),j=new t.CylinderGeometry(.34,.62,z+1.5,s?8:e?6:5,s?4:e?3:2,!0);j.translate(0,(z+1.5)/2-.3,0);{const c=j.attributes.position;for(let f=0;f<c.count;f++){const q=c.getY(f),E=1+1.3*Math.pow(1-Ve(q/3,0,1),3);c.setX(f,c.getX(f)*E+.25*Math.sin(q*.5)),c.setZ(f,c.getZ(f)*E)}j.computeVertexNormals()}F(j,b.identity(),0,R);const ae=e===2?24:e===1?11:6,H=[];for(let c=0,f=0;c<ae&&f<400;f++){const q=a.range(0,Le),E=a.range(-.5,1),ne=Math.sqrt(Math.max(0,1-E*E)),oe=c%5===4?a.range(.45,.65):a.range(.82,1.02),ue=new t.Vector3(W.x+Math.cos(q)*ne*I.x*oe,W.y+E*I.y*oe,W.z+Math.sin(q)*ne*I.z*oe),xe=e===2?a.range(1.45,2.15):e===1?a.range(1.9,2.7):a.range(2.5,3.4);H.some(we=>we.c.distanceTo(ue)<(we.r+xe)*.62)||(H.push({c:ue,r:xe,rf:oe,out:ue.clone().sub(W).divide(I)}),c++)}await h.yield();{const c=new t.IcosahedronGeometry(1,0);for(let f=0;f<c.attributes.position.count;f++)c.attributes.normal.setXYZ(f,c.attributes.position.getX(f),c.attributes.position.getY(f),c.attributes.position.getZ(f));e?F(c,b.makeScale(3.2,2.5,3.2).setPosition(W.x,W.y,W.z),1,R,null,()=>.26):c.dispose()}if(e)for(let c=0;c<H.length&&c<(s?8:5);c++){const f=H[c].c,q=new t.Vector3(0,z-.6,0),E=f.clone().sub(q),ne=E.length(),oe=new t.CylinderGeometry(.07,.2,ne,4,1,!0);oe.translate(0,ne/2,0);const ue=new t.Quaternion().setFromUnitVectors(new t.Vector3(0,1,0),E.normalize());F(oe,b.compose(q,ue,new t.Vector3(1,1,1)),0,R)}const m=[[0,0],[1,0],[1,1],[0,0],[1,1],[0,1]],J=[[-1,-1],[1,-1],[1,1],[-1,-1],[1,1],[-1,1]],P=new t.Vector3,Y=new t.Vector3,T=new t.Vector3,k=new t.Vector3,n=new t.Vector3,C=new t.Vector3(.21,.97,.13),B=e===2?7:e===1?5:6,A=e===2?10:e===1?6:2;for(let c=0;c<H.length;c++){const f=H[c],q=Ve(f.out.length(),0,1.1),E=.42+.62*ie(.35,1,q);if(!e){const ne=new t.IcosahedronGeometry(1,0),oe=ne.attributes.position;for(let ue=0;ue<oe.count;ue++){const xe=oe.getX(ue),we=oe.getY(ue),re=oe.getZ(ue),be=1+.3*h.noise.n3(xe*1.7+f.c.x,we*1.7+f.c.y,re*1.7);oe.setXYZ(ue,xe*be,we*be*.85,re*be),ne.attributes.normal.setXYZ(ue,xe,we,re)}F(ne,b.makeScale(f.r,f.r,f.r).setPosition(f.c.x,f.c.y,f.c.z),1,R,null,(ue,xe)=>E*(.78+.3*xe.y))}for(let ne=0;ne<A;ne++){const oe=a.range(0,Le),ue=a.range(-.55,1),xe=Math.sqrt(Math.max(0,1-ue*ue));P.set(Math.cos(oe)*xe,ue,Math.sin(oe)*xe),k.copy(P).lerp(v.set(a.range(-1,1),a.range(-.3,1),a.range(-1,1)).normalize(),.4).normalize(),Y.crossVectors(k,C).normalize(),T.crossVectors(k,Y);const we=f.r*a.range(.95,1.35)*(e?1:1.25),re=f.r*(e?a.range(.6,.9):.95);n.copy(P).multiplyScalar(.72).addScaledVector(f.out,.5).normalize();const be=E*(.74+.34*(.5+.5*P.y))*(.8+.3*ie(-.2,.8,P.dot(f.out)/Math.max(q,.2)));for(let S=0;S<6;S++)v.copy(f.c).addScaledVector(P,re).addScaledVector(Y,J[S][0]*we*.5).addScaledVector(T,J[S][1]*we*.5),i.push(v.x,v.y,v.z),u.push(n.x,n.y,n.z),d.push(R(v),2+(B-5)*.1),p.push(be),r.push(m[S][0]*B,m[S][1]*B),f.reach=Math.max(f.reach||0,v.distanceTo(f.c))}c%6===5&&await h.yield()}if(!s)return N();const G=new t.ConeGeometry(3.4,.9,10,1,!0);G.translate(0,.25,0),F(G,b.identity(),3,()=>0);for(let c=0;c<14;c++){const f=c/14*Le+a.range(-.2,.2),q=a.range(1.6,3.6),E=new t.PlaneGeometry(1.5,2.2,1,2),ne=E.attributes.position;for(let oe=0;oe<ne.count;oe++){const ue=ne.getY(oe)+1.1;ne.setY(oe,ue*(1-.18*ue)),ne.setZ(oe,.3*ue*ue)}E.computeVertexNormals(),F(E.toNonIndexed(),b.makeRotationY(f).setPosition(Math.sin(f)*q,.15,Math.cos(f)*q),4,()=>0,oe=>[[0,0],[1,0],[0,.5],[1,0],[1,.5],[0,.5],[0,.5],[1,.5],[0,1],[1,.5],[1,1],[0,1]][oe%12])}return N()},Lt=new t.ShaderMaterial({uniforms:x,side:t.DoubleSide,vertexShader:$e+Pe+ot+Jt+`
attribute vec2 aPart; attribute vec2 aAnc; attribute vec4 aRS; attribute float aSh; uniform float uTime;
varying vec3 vN; varying vec3 vW; varying vec4 vK; varying vec2 vUv; varying vec3 vL; varying float vSh; varying vec3 vCn;
void main(){
  float c = cos(aRS.x), s = sin(aRS.x);
  vec3 l = vec3(position.x * c - position.z * s, position.y, position.x * s + position.z * c) * aRS.y;
  vec3 nrm0 = normal;
  vec3 nl = vec3(nrm0.x * c - nrm0.z * s, nrm0.y, nrm0.x * s + nrm0.z * c);
  vec3 gn; float J; vec3 b0; mat3 B0 = gsBasis(aAnc, uTw, 0.85, gn, J, b0);
  vec3 g1; float J1; vec3 b1; mat3 B1 = gsBasis(aAnc, uTw - 0.45, 0.85, g1, J1, b1);
  float lag = aPart.x, leaf = step(0.5, aPart.y) * step(aPart.y, 2.5);
  // leaves flutter; whole crowns breathe in the gusts
  float fl = sin(uTime * 2.3 + l.x * 0.7 + aRS.w * 30.) * 0.2 + sin(uTime * 5.1 + l.y * 1.3 + l.z) * 0.16 * step(1.5, aPart.y);
  l.xz += vec2(0.25, -0.95) * (0.35 + fl * 2.) * lag * leaf; l.y += fl * 0.8 * lag * leaf * step(1.5, aPart.y);
  vec3 w0 = B0 * l, w1 = b1 - b0 + B1 * l;
  vW = b0 + mix(w0, w1, lag * 0.8); vN = normalize(mix(B0 * nl, B1 * nl, lag * 0.8));
  { vec3 cl = (position - vec3(0., 13.2, 0.)) / vec3(5.7, 4.3, 5.7) + vec3(0., 0.12, 0.); cl /= max(length(cl), 1e-3); vCn = B0 * vec3(cl.x * c - cl.z * s, cl.y, cl.x * s + cl.z * c); }   // the crown's own rounded form: the way out from its middle
  vK = vec4(aPart.y, aRS.z, gsCloud(vW.xz) * gsWaveSh(aAnc, l.y, uTw), aRS.w); vUv = uv; vL = position; vSh = aSh;
  gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.);
}`,fragmentShader:Pe+`
uniform sampler2D uNoise; uniform vec3 uCrown, uCrownLit, uGrass, uDarkG, uLime; uniform float uTime, uBlossom;
varying vec3 vN; varying vec3 vW; varying vec4 vK; varying vec2 vUv; varying vec3 vL; varying float vSh; varying vec3 vCn;
void main(){
  float id = vK.x; vec3 n = normalize(vN); if (!gl_FrontFacing && (id < 1.5 || id > 2.5)) n = -n;
  vec3 V = normalize(cameraPosition - vW); float tr = 0.; vec3 alb;
  float nA = texture2D(uNoise, vL.xz * 0.27 + vL.y * 0.19).r, nB = texture2D(uNoise, vL.xy * 0.9 + vL.z * 0.4).g, leafV = 1., hxL = -1.;
  float dcam = length(cameraPosition - vW), lod = smoothstep(20., 62., dcam), nearK = smoothstep(3., 15., dcam);   // nearK: leaves shrink to nothing inside 3 m of the lens
  if (id > 0.5 && id < 2.5 && dcam < 3.) discard;
  if (id < 0.5) {                                                        // bark: ridged, lichen-green on the weather side
    float ridge = texture2D(uNoise, vec2(atan(vL.z, abs(vL.x) < 1e-4 ? 1e-4 : vL.x) * 1.3, vL.y * 0.09)).b;
    float rd2 = texture2D(uNoise, vec2(atan(vL.z, abs(vL.x) < 1e-4 ? 1e-4 : vL.x) * 3.1, vL.y * 0.035)).r;
    alb = vec3(0.27, 0.215, 0.16) * (0.3 + 0.75 * ridge + 0.75 * smoothstep(0.35, 0.65, rd2)); alb = mix(alb, uDarkG * 0.5, 0.35 * nA);
  } else if (id < 2.5) {
    if (id > 1.5) {                                                      // leaf sprays: alpha-tested clusters
      float keep = 0., hx = 0.5, ly = 1.;                                // two leaf lattices, turned against each other, so no dot screen shows
      // a spray is a rounded, lumpy tuft, never a square plate: cut to a wobbling radius round the card's middle
      { float G = 5. + floor((id - 2.) * 10. + 0.5); vec2 cq = vUv / G - 0.5; float wob = texture2D(uNoise, cq * 0.13 + vK.w * 7.3 + vL.yz * 0.011).g;
        if (length(cq) * 2. > 0.6 + 0.52 * wob) discard;
        if (texture2D(uNoise, vL.xy * 0.19 + vL.z * 0.13 + vK.w * 3.).a < 0.2 * lod) discard; }                    // a few sky holes in a far crown
      for (int q = 0; q < 2; q++) {
        vec2 uq = q == 0 ? vUv : vec2(vUv.x * 0.8 - vUv.y * 0.53, vUv.x * 0.53 + vUv.y * 0.8) * 0.87 + 3.37;
        vec2 ci = floor(uq), cf = fract(uq) - 0.5;
        vec4 hh = textureLod(uNoise, (ci * 7. + 0.5 + floor(vK.w * 97.) + float(q) * 31.) / 128., 0.);
        cf -= (hh.xy - 0.5) * 0.42; float la = hh.z * 12.566, lc = cos(la), ls = sin(la), sz = max((0.7 + 0.5 * hh.w) * (1. + 1.5 * lod) * nearK, 1e-3);
        vec2 lr = vec2(cf.x * lc - cf.y * ls, cf.x * ls + cf.y * lc);
        if (lr.x * lr.x / (0.2 * sz) + lr.y * lr.y / (0.1 * sz) <= 1. && hh.w > 0.2 && nearK > 0.03) { keep = 1.; hx = hh.x; ly = abs(lr.y); }
      }
      if (keep < 0.5) discard;
      leafV = mix(0.75 + 0.5 * hx - 0.25 * (1. - smoothstep(0.0, 0.02, ly)), 1., 0.75 * lod); hxL = hx;
    }
    float nC = texture2D(uNoise, vL.zy * 0.47 + vL.x * 0.23).b, nD = texture2D(uNoise, vL.xz * 1.9 + vL.y * 1.1).a;
    if (id < 1.5 && abs(dot(n, V)) < 0.5 * (0.2 + nB * 0.7 + nD * 0.5)) discard;                 // ragged, leafy silhouette
    n = normalize(n * 2.4 + (vec3(nA, nC, nB) - 0.5) * 1.0 + (vec3(nD, nB, nD) - 0.5) * 0.4);
    vec3 cn3 = vCn / max(length(vCn), 1e-3); n = normalize(mix(n, cn3, 0.3 + 0.5 * lod));                       // from far off a crown shades as one rounded mass: a lit top and sunward side, a shaded underside
    alb = mix(uCrown, uCrownLit, (0.06 + 0.5 * nA * nC + 0.3 * vK.y) * (1. - uBlossom)) * mix(0.5 + 0.5 * nB + 0.4 * nD, 0.95, 0.6 * lod) * leafV;
    alb *= mix(vec3(0.92, 1.02, 0.9), vec3(1.1, 0.98, 0.9), vK.y);                // every tree its own cast

    alb = mix(alb, uCrownLit * (0.8 + 0.3 * nB), uBlossom * (hxL < 0. ? smoothstep(0.4, 0.62, nD * 0.55 + nA * 0.55 + 0.12 * vK.y) : mix(step(hxL, 0.5 + 0.45 * nA), smoothstep(0.38, 0.6, nA * 1.1 + 0.12 * vK.y), lod)));   // near: each leaf is blossom or leaf, whole     // spring: blossom in drifts over the leaves
    alb = mix(alb, uLime * 0.85, smoothstep(0.1, -0.6, n.y) * 0.45);          // lime undersides
    // the inner crown is shade seen between sprays: dark toward the centre, darker in the gaps between leaf clusters
    alb *= id < 1.5 ? vSh * (0.62 + 0.6 * smoothstep(0.35, 0.65, nD)) : vSh * 1.08;
    alb *= mix(1., 0.62 + 0.5 * smoothstep(-0.55, 0.45, cn3.y), 0.35 + 0.65 * lod);
    tr = 0.3;
  } else if (id < 3.5) { alb = mix(vec3(0.13, 0.1, 0.07), uDarkG * 0.7, 0.35 + 0.5 * nA); }                    // root pad
  else { float e = abs(vUv.x - 0.5) * 2.; if (e > 1. - 0.75 * vUv.y + 0.18 * sin(vUv.y * 40.) ) discard; alb = mix(uDarkG, uGrass, vUv.y) * (0.7 + 0.5 * nB); tr = 0.6; }
  vec3 c = gsLit(alb, n, vK.z, tr);
  float back = max(dot(-V, uSunDir), 0.); c += alb * uLime * uSunCol * vK.z * back * back * tr * 0.8;
  if (id < 0.5) c += alb * (uSkyCol * 0.25 + uSunCol * 0.12);                       // trunks keep their brown in shade
  float leafy = step(0.5, id) * step(id, 2.5);
  c *= mix(1., 0.72 + 0.28 * smoothstep(8., 16., vL.y), leafy);
  // sky and sun seen through the canopy: undersides glow lime, with flecks of direct sun
  float under = smoothstep(0.25, -0.5, n.y) * leafy, fleck = smoothstep(0.6, 0.78, texture2D(uNoise, vL.xz * 0.9 + vL.y * 0.7 + uTime * 0.02).a);
  c += alb * (uSkyCol * 0.9 + uLime * uSunCol * vK.z * (0.25 + 1.1 * fleck)) * under;                             // shade inside the crown's underside
  gl_FragColor = vec4(gsFog(c, length(cameraPosition - vW), vW.y), 1.);
}`});x.uCrown={value:ce.crown},x.uCrownLit={value:ce.crownLit},x.uBlossom={value:ce.blossom};const ft=[];{const e=y.fork?y.fork("trees"):y,a={},s=[],i=[],u=[],d=[],r=[],p=[],b=[],v=(m,J)=>{let P=1e9;for(let Y=0;Y<=l.N;Y+=8){const T=l.X[Y]-m,k=l.Z[Y]-J,n=T*T+k*k;n<P&&(P=n)}return Math.sqrt(P)},M=m=>Math.atan2(l.X[Math.min(m+6,l.N)]-l.X[m],l.Z[Math.min(m+6,l.N)]-l.Z[m]),w=(m,J,P)=>(se.inv(m,J,l.TWs[P],a),[a.x0,a.z0]);{const J=w(l.X[84],l.Z[84],84),P=h.core.makeRng(((h.seed|0)^20001)+77);for(let Y=0,T=0;Y<13&&T<300;T++){T%8===7&&await h.yield();const k=P.range(0,Le),n=24*Math.sqrt(P()),C=J[0]+Math.cos(k)*n,B=J[1]+Math.sin(k)*n-4,A=P.range(1.22,1.42);let G=rt(C,B,17.4*A)>12.5;for(let c=0;c<s.length;c+=2)Math.hypot(s[c]-C,s[c+1]-B)<6.5&&(G=!1);G&&(s.push(C,B),i.push(P.range(0,Le),A,P(),P()),Y++)}}await h.yield();{const J=M(196),P=Math.sin(J),Y=Math.cos(J),T=h.core.makeRng(((h.seed|0)^31281)+611),k=l.X[196]-Y*27,n=l.Z[196]+P*27;for(let C=0,B=0;C<6&&B<200;B++){B%8===7&&await h.yield();const A=T.range(0,Le),G=15*Math.sqrt(T()),c=w(k+Math.cos(A)*G,n+Math.sin(A)*G*1.5,196),f=T.range(1.12,1.34);let q=rt(c[0],c[1],17.4*f)>10.5;for(let E=0;E<s.length;E+=2)Math.hypot(s[E]-c[0],s[E+1]-c[1])<7&&(q=!1);q&&(s.push(c[0],c[1]),i.push(T.range(0,Le),f,T(),T()),C++)}}await h.yield();{const J=M(924),P=Math.sin(J),Y=Math.cos(J);for(let T=0;T<3;T++)for(let k=-3;k<=3;k++)for(const n of[-1,1]){if(T===2&&(k+3)%2)continue;const C=k*8.5+e.range(-2,2),B=n*(T===0?e.range(5.6,6.6):T===1?e.range(13,17):e.range(22,28)),A=Ve(Math.round(924+C),0,l.N),G=l.X[A]+Y*B,c=l.Z[A]-P*B,f=w(G,c,A),q=e.range(1.16,1.3);rt(f[0],f[1],9.5*q)<4.8||(b.push(s.length,A),s.push(f[0],f[1]),i.push(e.range(0,Le),q,e(),e()))}}await h.yield();{const m=h.core.makeRng(((h.seed|0)^15447)+97),J=Le/U[0].k,P=m.range(-J,J),Y=et-m.range(0,J/2);for(let T=0,k=0;T<7&&k<200;k++){const n=m.range(0,Le),C=15*Math.sqrt(m()),B=[P+Math.cos(n)*C,Y+Math.sin(n)*C],A=m.range(1,1.25);let G=rt(B[0],B[1],17.4*A)>26;for(let c=0;c<r.length;c+=2)Math.hypot(r[c]-B[0],r[c+1]-B[1])<7&&(G=!1);G&&(r.push(B[0],B[1]),p.push(m.range(0,Le),A,m(),m()),T++)}}await h.yield();const F=(m,J,P,Y)=>{for(let T=0,k=0;T<P&&k<P*8;k++){const n=e.range(0,Le),C=Y*.8*Math.sqrt(e()),B=m+Math.cos(n)*C,A=J+Math.sin(n)*C,G=e.range(.85,1.2);if(Math.hypot(B-ee.x,A-ee.z)<270||rt(B,A,18.5*G)<60)continue;const c=v(B,A)<190;(c?r:u).push(B,A),(c?p:d).push(e.range(0,Le),G,e(),e()),T++}},N=[[140,-1,90],[230,1,150],[330,-1,230],[420,1,70],[520,-1,180],[610,1,260],[700,-1,60],[800,1,190],[1010,-1,140],[1100,1,90],[1230,1,330],[1320,-1,150],[1190,1,150],[1310,1,215]];for(const[m,J,P]of N){const Y=M(m),T=P*e.range(.85,1.25)*J;F(l.X[m]+Math.cos(Y)*T,l.Z[m]-Math.sin(Y)*T,e.int(8,16),e.range(17,26)),await h.yield()}for(const[m,J,P]of[[ee.x+250,ee.z+235,9],[ee.x+165,ee.z+375,11],[ee.x-150,ee.z+460,10]])F(m,J,P,22),await h.yield();{const m=h.core.makeRng(((h.seed|0)^11117)+1907);for(const J of[10,12]){const P=m.range(0,Le),Y=m.range(330,520);F(ee.x+Math.cos(P)*Y,ee.z-Math.sin(P)*Y,J,20),await h.yield()}}if(X)for(const m of[X.x+190,X.x-110,X.x-430])F(m,X.zc(15)+e.range(-12,12),10,24),await h.yield();const z=Math.round(9*me*le.density);for(let m=0,J=0;m<z&&J<400;J++){const P=e.range(-3400,1500),Y=e.range(150,3900);let T=1e9;for(let k=0;k<=l.N;k+=40)T=Math.min(T,Math.hypot(l.X[k]-P,l.Z[k]-Y));T<380||(F(P,Y,e.int(8,14),e.range(18,30)),m++,await h.yield())}await h.yield();const R=await Dt(2,e);await h.yield();{const Y=g=>.8*ie(3,14,g),T=new t.Vector3,k=[],n=[],C=[],B={},A={},G=[0,0];for(let g=0;g<=Fe.length;g+=.5)Fe.posAtDist(g,T),k.push(T.x,T.y,T.z,o(g/Fe.length));for(let g=0;g<5;g++){const D=-.3+2.75*g;n.push(.25*Math.sin(.5*D),D,0,Y(D),0),g<4&&C.push(g,g+1,(.62-.07*g)*(1+1.3*(1-Ve(D/3,0,1))**3),0,2.4)}n.push(0,8.9,0,Y(8.9),0),R.userData.clumps.slice(0,8).forEach((g,D)=>{n.push(g.c.x,g.c.y,g.c.z,Y(g.c.y),0),C.push(5,6+D,.2,.12,2.4)});const c=n.length/5,f=(1+Math.sqrt(5))/2,q=Math.hypot(1,f);let E=0;for(const[g,D,Q]of[[-1,f,0],[1,f,0],[-1,-f,0],[1,-f,0],[0,-1,f],[0,1,f],[0,-1,-f],[0,1,-f],[f,0,-1],[f,0,1],[-f,0,-1],[-f,0,1]]){const K=13.2+2.5*D/q;n.push(3.2*g/q,K,3.2*Q/q,Y(K),.35*Y(K)/.8)}for(const g of R.userData.clumps){const D=n.length/5;n.push(g.c.x,g.c.y,g.c.z,Y(g.c.y-g.reach),.35,g.c.x,g.c.y,g.c.z,Y(g.c.y+g.reach),.35),C.push(D,D+1,g.reach,.7636,3.2),E=Math.max(E,Math.hypot(g.c.x,g.c.y-13.2,g.c.z)+g.reach)}const ne=n.length/5,oe=C.length/5,ue=k.length/4,xe=Math.ceil(k[k.length-1]*20)+128,we=new Float64Array(ne*3),re=new Float64Array(ne*3),be=new Int32Array(ue*21*4),S=new Float64Array((xe+ue*4)*12),Ct=new Int32Array(xe),At=Math.max(3.2+.7636,2.4,3.8),wt=1.12*U.reduce((g,D)=>g+D.A*D.om,0)+6,Pt=.36*wt,h0=U.reduce((g,D)=>g+D.A,0)+Pt+At+.35;let Rt=0,lt=0,Kt=0,jt=0,Et=0,$t=0,_t=0,Yt=0,Qt=0,Ke=0,Ie=0;const Vt=(g,D,Q,K)=>{se.at(g,D,Q,B);let L=B.nx*.85,de=.15+B.ny*.85,ye=B.nz*.85;const ge=Math.hypot(L,de,ye);L/=ge,de/=ge,ye/=ge;let he=de,Te=-L;const Ce=Math.hypot(he,Te);return he/=Ce,Te/=Ce,S[K]=B.x,S[K+1]=B.y,S[K+2]=B.z,S[K+3]=he,S[K+4]=Te,S[K+5]=0,S[K+6]=L,S[K+7]=de,S[K+8]=ye,S[K+9]=Te*ye,S[K+10]=-he*ye,S[K+11]=he*de-Te*L,K},Gt=(g,D,Q)=>Ct[Q+64]===Kt?(Q+64)*12:(Ct[Q+64]=Kt,Vt(g,D,Q*.05,(Q+64)*12)),e0=(g,D,Q,K)=>{const L=S[D]-k[g],de=S[D+1]-k[g+1],ye=S[D+2]-k[g+2],ge=13.2*K,he=Ve(-(L*S[D+6]+de*S[D+7]+ye*S[D+8]),0,10.7*K),Te=L+S[D+6]*ge,Ce=de+S[D+7]*ge,ze=ye+S[D+8]*ge,Ue=S[Q]-S[D]+(S[Q+6]-S[D+6])*ge,dt=S[Q+1]-S[D+1]+(S[Q+7]-S[D+7])*ge,vt=S[Q+2]-S[D+2]+(S[Q+8]-S[D+8])*ge,bt=Ve(-(Te*Ue+Ce*dt+ze*vt)/(Ue*Ue+dt*dt+vt*vt||1),0,1);G[0]=Math.hypot(L+S[D+6]*he,de+S[D+7]*he,ye+S[D+8]*he)-1.8*K-Pt-2.4,G[1]=Math.hypot(Te+Ue*bt,Ce+dt*bt,ze+vt*bt)-E*K-.35-At},t0=(g,D,Q,K)=>{if(e0(g,D,Q,K),G[0]<0||G[1]<0){const L=Rt++*4;be[L]=g,be[L+1]=D,be[L+2]=Q,be[L+3]=G[1]<0?1:0}},f0=(g,D,Q)=>{Rt=0,Kt++;const K=(h0+(13.2+E)*Q)**2;for(let L=0;L<k.length;L+=4){if((k[L]-g)**2+(k[L+2]-D)**2>K)continue;const de=k[L+3],ye=Math.round(de*20);let ge=!1;for(let he=-18;he<=18&&!ge;he+=9){const Te=Gt(g,D,ye+he);e0(L,Te,Te,Q),ge=G[0]<.28*wt||G[1]<Pt+.28*wt}if(ge){for(let he=Math.ceil((de-.9)*10);he<=(de+.9)*10;he++)t0(L,Gt(g,D,he*2),Gt(g,D,he*2-9),Q);for(let he=0;he<2;he++){const Te=(xe+L+he*2)*12;t0(L,Vt(g,D,de+he*1.8-.9,Te),Vt(g,D,de+he*1.8-1.35,Te+12),Q)}}}},a0=(g,D)=>{for(let Q=g;Q<D;Q++){const K=we[Q*3],L=we[Q*3+1],de=we[Q*3+2],ye=n[Q*5+3],ge=S[Ke+3]*K+S[Ke+6]*L+S[Ke+9]*de,he=S[Ke+4]*K+S[Ke+7]*L+S[Ke+10]*de,Te=S[Ke+5]*K+S[Ke+8]*L+S[Ke+11]*de,Ce=_t+S[Ie+3]*K+S[Ie+6]*L+S[Ie+9]*de,ze=Yt+S[Ie+4]*K+S[Ie+7]*L+S[Ie+10]*de,Ue=Qt+S[Ie+5]*K+S[Ie+8]*L+S[Ie+11]*de;re[Q*3]=jt+ge+(Ce-ge)*ye,re[Q*3+1]=Et+he+(ze-he)*ye,re[Q*3+2]=$t+Te+(Ue-Te)*ye}},o0=(g,D,Q)=>{for(let K=g;K<D;K++){const L=C[K*5]*3,de=C[K*5+1]*3,ye=re[de]-re[L],ge=re[de+1]-re[L+1],he=re[de+2]-re[L+2],Te=ye*ye+ge*ge+he*he,Ce=Te>0?Ve(-(re[L]*ye+re[L+1]*ge+re[L+2]*he)/Te,0,1):0,ze=Math.hypot(re[L]+ye*Ce,re[L+1]+ge*Ce,re[L+2]+he*Ce)-C[K*5+2]*Q-C[K*5+3]-C[K*5+4];ze<lt&&(lt=ze)}},d0=(g,D)=>{const Q=Math.cos(g),K=Math.sin(g);lt=1e9;for(let L=0;L<ne;L++){const de=n[L*5],ye=n[L*5+2],ge=n[L*5+4];we[L*3]=D*(de*Q-ye*K)+.25*ge,we[L*3+1]=D*n[L*5+1],we[L*3+2]=D*(de*K+ye*Q)-.95*ge}for(let L=0;L<Rt*4&&lt>0;L+=4){const de=be[L];if(Ke=be[L+1],Ie=be[L+2],jt=S[Ke]-k[de],Et=S[Ke+1]-k[de+1],$t=S[Ke+2]-k[de+2],_t=S[Ie]-S[Ke],Yt=S[Ie+1]-S[Ke+1],Qt=S[Ie+2]-S[Ke+2],a0(0,6),o0(0,4,D),be[L+3]){a0(6,ne),o0(4,oe,D);let ye=0,ge=0,he=0,Te=-1e9;for(let ze=c;ze<c+12;ze++)ye+=re[ze*3],ge+=re[ze*3+1],he+=re[ze*3+2];const Ce=Math.hypot(ye,ge,he)||1;for(let ze=c;ze<c+12;ze++)Te=Math.max(Te,-(re[ze*3]*ye+re[ze*3+1]*ge+re[ze*3+2]*he)/Ce);lt=Math.min(lt,-Te-.393-3.8)}}return lt>0};for(let g=s.length-2,D=b.length-2;g>=0;g-=2){const Q=i[g*2+1];let K=0,L=!1;if(D>=0&&b[D]===g)K=b[D+1],D-=2;else for(let Ce=0,ze=1e9;Ce<=l.N;Ce++){const Ue=(l.X[Ce]-s[g])**2+(l.Z[Ce]-s[g+1])**2;Ue<ze&&(ze=Ue,K=Ce)}se.at(s[g],s[g+1],l.TWs[K],A);const de=A.x,ye=A.z,ge=Math.hypot(de-l.X[K],ye-l.Z[K])||1,he=(de-l.X[K])/ge,Te=(ye-l.Z[K])/ge;for(let Ce=0;Ce<=28&&!L;Ce++){await h.yield();const ze=Ce?w(de+he*.5*Ce,ye+Te*.5*Ce,K):[s[g],s[g+1]];let Ue=!0;if(Ce){se.at(ze[0],ze[1],l.TWs[K],A);const dt=A.x,vt=A.y,bt=A.z;for(let zt=0;zt<s.length&&Ue;zt+=2)zt!==g&&(se.at(s[zt],s[zt+1],l.TWs[K],A),Ue=Math.hypot(A.x-dt,A.y-vt,A.z-bt)>=4.2)}Ue&&(f0(ze[0],ze[1],Q),d0(i[g*2],Q)&&(L=!0,Ce&&(s[g]=ze[0],s[g+1]=ze[1])))}L||(s.splice(g,2),i.splice(g*2,4))}}for(let m=0;m<s.length;m+=2)ft.push(s[m],s[m+1],i[m*2+1]);for(let m=0;m<r.length;m+=2)ft.push(r[m],r[m+1],p[m*2+1]);for(let m=0;m<u.length;m+=2)ft.push(u[m],u[m+1],d[m*2+1]);const W=await Dt(1,e);await h.yield();const I=await Dt(0,e);await h.yield(),r.length||(r.push(u[0]??0,u[1]??0),p.push(0,1,.5,.5));const j=new t.Mesh(Oe(W,r.length/2,{aAnc:{a:new Float32Array(r),n:2},aRS:{a:new Float32Array(p),n:4}}),Lt);j.frustumCulled=!1,j.name="copses-mid",pe.add(j),gt.push(W);const ae=new t.Mesh(Oe(R,s.length/2,{aAnc:{a:new Float32Array(s),n:2},aRS:{a:new Float32Array(i),n:4}}),Lt),H=new t.Mesh(Oe(I,u.length/2,{aAnc:{a:new Float32Array(u),n:2},aRS:{a:new Float32Array(d),n:4}}),Lt);ae.frustumCulled=H.frustumCulled=!1,ae.name="copses-near",H.name="copses-far",pe.add(ae,H),gt.push(R,I)}await h.yield();const It=e=>{const a=[],s=[],i=[],u=new t.Vector3,d=new t.Vector3,r=new t.Matrix4,p=new t.Matrix3,b=(M,w,F)=>{const N=M.index?M.toNonIndexed():M,z=N.attributes.position,R=N.attributes.normal;p.getNormalMatrix(w);for(let W=0;W<z.count;W++){const I=u.fromBufferAttribute(z,W).clone();u.applyMatrix4(w),d.fromBufferAttribute(R,W).applyMatrix3(p).normalize();const j=F(u,I);a.push(u.x,u.y,u.z),s.push(d.x,d.y,d.z),i.push(j[0],j[1],j[2])}N.dispose(),N!==M&&M.dispose()};{const M=new t.SphereGeometry(1,e?10:6,e?8:5);M.rotateX(Math.PI/2);const w=M.attributes.position;for(let F=0;F<w.count;F++){const N=w.getZ(F),z=.78+.3*ie(-.6,.7,N),R=w.getY(F);w.setXYZ(F,w.getX(F)*.55*z,(R<0?R*(.56+.26*ie(-.3,.8,N)):R*.46)*z+.06*N,N*1.32)}M.computeVertexNormals(),b(M,r.makeTranslation(0,2,0),()=>[0,0,0])}{const M=new t.CylinderGeometry(.2,.39,1.75,e?7:4,e?3:1,!0);M.translate(0,.875,0),b(M,r.makeRotationX(1.02).setPosition(0,2.2,.95),()=>[1,0,0]);const w=new t.ConeGeometry(.27,.95,e?7:4,1);w.rotateX(Math.PI/2),w.scale(.85,1.05,1),b(w,r.makeRotationX(.25).setPosition(0,3.2,2.62),()=>[1,1,0]);for(const F of[-1,1]){const N=new t.BufferGeometry;N.setAttribute("position",new t.Float32BufferAttribute([F*.1,3.33,2.36,F*.13,3.25,2.22,F*.2,3.62,1.88],3)),N.computeVertexNormals(),b(N,r.identity(),()=>[1,2,0])}}for(let M=0;M<4;M++){const w=new t.CylinderGeometry(1,1,1.7,e?5:3,e?4:2,!0);b(w,r.identity(),F=>{const N=.85-F.y,z=(.17-.055*N)*(1+.35*Math.exp(-((N-.85)**2)*30))*(N>1.6?1.3:1),R=[2,M,N];return F.set(F.x*z,0,F.z*z),R})}{const M=e?8:3;for(let F=0;F<M;F++){const N=F/M,z=(F+1)/M,R=[0,3.12-.86*N,2.3-1.36*N],W=[0,3.12-.86*z,2.3-1.36*z],I=new t.BufferGeometry;I.setAttribute("position",new t.Float32BufferAttribute([...R,...W,...W,...R,...W,...R],3)),I.setAttribute("normal",new t.Float32BufferAttribute([1,.3,0,1,.3,0,1,.3,0,1,.3,0,1,.3,0,1,.3,0],3));let j=0;const ae=[0,0,1,0,1,1],H=[N,z,z,N,z,N];b(I,r.identity(),()=>{const m=[3,H[j],ae[j]];return j++,m})}const w=e?5:3;for(let F=0;F<(e?2:1);F++)for(let N=0;N<w;N++){const z=N/w,R=(N+1)/w,W=new t.BufferGeometry;W.setAttribute("position",new t.Float32BufferAttribute(new Array(18).fill(0),3)),W.setAttribute("normal",new t.Float32BufferAttribute([1,.4,0,1,.4,0,1,.4,0,1,.4,0,1,.4,0,1,.4,0],3));let I=0;const j=[-1,-1,1,-1,1,1],ae=[z,R,R,z,R,z];b(W,r.identity(),H=>{const m=[4,ae[I],j[I]*(F?.5:1)];return H.set(F,0,0),I++,m})}}const v=new t.BufferGeometry;return v.setAttribute("position",new t.Float32BufferAttribute(a,3)),v.setAttribute("normal",new t.Float32BufferAttribute(s,3)),v.setAttribute("aB",new t.Float32BufferAttribute(i,3)),v},Ut=$e+Pe+`
attribute vec3 aB; attribute vec4 aRun; uniform vec4 uHerdK; uniform vec2 uHd; uniform float uTime;
varying vec3 vN; varying vec3 vW; varying vec4 vK; varying vec3 vL;
void main(){
  float kind = aB.x, sc = aRun.w, seed = aRun.z, calf = step(sc, 0.8);
  float stride = uHerdK.z * (1. + 0.08 * (seed - 0.5)) + seed * 7.; float ph = fract(stride);
  vec3 l = position; vec3 nl = normal;
  float th = 0.1 * sin(6.2832 * ph + 0.8), bob = 0.14 * sin(12.566 * ph + 1.) + 0.06;
  bob += calf * 1.5 * max(0., sin(3.14159 * clamp(fract(stride / 5.) * 5., 0., 1.)));          // calves pronk every fifth stride
  if (kind < 0.5) { l.y += l.z * th; }
  else if (kind < 1.5) { l.y += 0.9 * th - (l.z - 0.9) * th * 1.3; l.z += 0.06 * sin(6.2832 * ph); }
  else if (kind < 2.5) {
    float id = aB.y, s = aB.z, fore = step(1.5, id), side = mod(id, 2.) * 2. - 1.;
    float o = id < 0.5 ? 0. : id < 1.5 ? 0.1 : id < 2.5 ? 0.5 : 0.6, f = fract(ph + o);
    float p = f < 0.35 ? f / 0.35 : 1. - (f - 0.35) / 0.65;
    float al = 0.66 * cos(3.14159 * p) + mix(-0.12, 0.14, fore);
    float sw = sin(3.14159 * clamp((f - 0.35) / 0.65, 0., 1.)); sw *= sw;
    float a2 = al - (0.12 + 1.5 * sw);
    vec3 hip = vec3(side * 0.2, 1.74 + mix(-0.85, 0.9, fore) * th, mix(-0.85, 0.9, fore));
    l = hip + vec3(0., -cos(al), sin(al)) * min(s, 0.85) + vec3(0., -cos(a2), sin(a2)) * max(s - 0.85, 0.) + position;
  } else if (kind < 3.5) {
    float w = aB.z; l.y += 0.9 * th - (l.z - 0.9) * th * 1.3;
    l += vec3(0.16 * sin(uTime * 9. + aB.y * 5. + seed * 20.), 0.2 + 0.1 * sin(uTime * 7. + aB.y * 9.), -0.62) * w * (1. + calf * 0.5);
  } else {
    float t = aB.y, wv = sin(uTime * 8. - t * 4.5 + seed * 30.);
    vec3 c = vec3(0.26 * t * wv, 2.18 - l.z * th + 0.28 * t - 0.5 * t * t + 0.1 * t * sin(uTime * 6. - t * 3.), -1.25 - 1.85 * t);
    float wd = 0.07 + 0.3 * sin(3.14159 * min(t * 1.25, 1.)) ; l = c + mix(vec3(0., wd * aB.z, 0.), vec3(wd * aB.z * 2., 0., 0.), position.x);
  }
  l.y += bob;
  vec2 xz = vec2(uHerdK.x + aRun.x + 3. * (1. - uHerdK.w) * sin(uTime * 0.23 + seed * 17.), uHerdK.y + aRun.y + 1.4 * sin(uTime * 0.31 + seed * 29.));
  vec2 p0 = gsInv(xz, uTw); vec3 gn; float J; vec3 d = gsOff(p0, uTw, 1., gn, J);
  vec3 up = normalize(mix(vec3(0., 1., 0.), gn, 0.7)), hd = vec3(uHd.x, 0., uHd.y);
  vec3 fw = normalize(hd - up * dot(hd, up)), rt = cross(up, fw);
  mat3 B = mat3(rt, up, fw);
  // heads turn to watch the camera as it comes by: the neck swings round from the withers, the mane with it
  if ((kind > 0.5 && kind < 1.5) || (kind > 2.5 && kind < 3.5)) {
    vec3 toC = cameraPosition - vec3(xz.x, d.y + 2.6 * sc, xz.y); float cdl = max(length(toC), 1e-3), lx = dot(toC, rt), lz = dot(toC, fw);
    float ya = clamp(atan(lx, lz + (abs(lx) + abs(lz) < 1e-3 ? 1e-2 : 0.)), -1.2, 1.2) * smoothstep(0.02, 0.3, abs(lx) / cdl) * (1. - smoothstep(26., 60., cdl)) * step(0.22, seed);
    ya *= smoothstep(0.8, 2.0, l.z); float cy = cos(ya), sy = sin(ya); vec2 q = l.xz - vec2(0., 0.95);
    l.xz = vec2(0., 0.95) + vec2(q.x * cy + q.y * sy, -q.x * sy + q.y * cy); nl.xz = vec2(nl.x * cy + nl.z * sy, -nl.x * sy + nl.z * cy);
  }
  float fm = 1. + 0.8 * smoothstep(140., 330., distance(vec3(xz.x, d.y, xz.y), cameraPosition));   // far runners drawn a little large, so a herd on a skyline reads as a frieze
  vW = vec3(xz.x, d.y, xz.y) + B * (l * sc * fm); vN = B * nl; vL = position;
  vK = vec4(kind, aB.y, aB.z, seed);
  gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.);
}`,Ht=Pe+`
uniform sampler2D uNoise; uniform vec3 uAccent; uniform float uDapple;
varying vec3 vN; varying vec3 vW; varying vec4 vK; varying vec3 vL;
void main(){
  vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
  float kind = vK.x; vec3 cream = vec3(0.70, 0.655, 0.55), alb = cream; float tr = 0.;
  float spots = texture2D(uNoise, vL.zy * 0.33 + vK.w * 3.).r;
  if (kind < 1.5) {
    alb = mix(cream, vec3(0.42, 0.44, 0.45), uDapple * smoothstep(0.45, 0.62, spots) * 0.8);
    alb = mix(alb, vec3(0.30, 0.36, 0.30), 0.45 * (1. - smoothstep(0.03, 0.1, abs(vL.x))) * smoothstep(2.15, 2.3, vL.y) * step(kind, 0.5));     // dorsal stripe
    alb *= (0.52 + 0.48 * smoothstep(1.35, 2.25, vL.y)) * (0.86 + 0.26 * vK.w);
    alb = mix(alb, cream * 1.12, 0.5 * smoothstep(2.12, 2.42, vL.y) * step(kind, 0.5) * smoothstep(0.08, 0.2, abs(vL.x)));              // pale saddle: a back that reads from the masthead
    alb = mix(alb, vec3(0.2, 0.17, 0.15), step(0.5, kind) * smoothstep(2.82, 3.0, vL.z));                                           // dark muzzle
  } else if (kind < 2.5) { alb = mix(cream * 0.92, vec3(0.085, 0.075, 0.07), smoothstep(0.8, 1.02, vK.z)); }                        // stockings
  else if (kind < 3.5) { alb = mix(vec3(0.62, 0.52, 0.25), vec3(0.85, 0.76, 0.45), vK.z); tr = 0.8; }
  else { alb = mix(vec3(0.75, 0.66, 0.4), uAccent, smoothstep(0.45, 0.75, vK.y)); tr = 0.8; }
  vec3 c = gsLit(alb, n, gsCloud(vW.xz), tr) + alb * (uSunCol * vec3(0.07, 0.09, 0.06) + vec3(0.02, 0.02, 0.04));
  gl_FragColor = vec4(gsFog(c, length(cameraPosition - vW), vW.y), 1.);
}`,kt=[],tt={};{const e=y.fork?y.fork("herd"):y,a=It(!0);await h.yield();const s=It(!1);gt.push(a,s),await h.yield();const i=400,u=te(13),d=l.X[u]-5,r=(v,M,w,F,N)=>{const z=[],R=[];for(let ae=0;ae<v+M;ae++){const H=ae>=v,m=H?i-150*e()*e()-4:i*(1-Math.pow(e(),1.25)),J=H?e.range(N-1,N+6):e.range(F,N)+2.5*e.gauss();(m>i-w?z:R).push(m,J,e(),H?e.range(.5,.62):e.range(.92,1.08))}const W={value:new t.Vector4},I=new t.Group,j=new t.ShaderMaterial({uniforms:{...x,uHerdK:W,uHd:{value:new t.Vector2(-.539,.842)},uDapple:{value:le.dapple?1:0}},vertexShader:Ut,fragmentShader:Ht,side:t.DoubleSide});for(const[ae,H]of[[z,a],[R,s]]){if(!ae.length)continue;const m=new t.Mesh(Oe(H,ae.length/4,{aRun:{a:new Float32Array(ae),n:4}}),j);m.frustumCulled=!1,I.add(m)}return I.name="herd",pe.add(I),W},p=Math.round(le.runners*(.55+.45*me)),b=r(p,40,56,1,9);kt.push((v,M)=>{const w=d-i-12.8*(v-13);b.value.set(w,et+20*v,M*2.4,0),x.uHerd.value.set(w,i,12.8,1)});{const M=21*He,w=-Math.sin(M)*26,F=Math.cos(M)*26,N=[],z=42;for(let T=0,k=0;T<z+10&&k<1400;k++){const n=T>=z,C=Math.round(n?e.range(170,450):124+T/z*356+e.range(-7,7)),A=(n?e()<.5?-1:1:T%2?1:-1)*(n?e.range(13,22):T%4===3?e.range(17,28):e.range(8.4,13.5)),G=Math.atan2(l.X[C+6]-l.X[C],l.Z[C+6]-l.Z[C]),c=l.TWs[C],f=l.X[C]+Math.cos(G)*A-w*c,q=l.Z[C]-Math.sin(G)*A-F*c;let E=!0;for(let ne=0;ne<N.length;ne+=4)Math.hypot(N[ne]-f,N[ne+1]-q)<5.2&&(E=!1);E&&(N.push(f,q,e(),n?e.range(.5,.62):e.range(.96,1.12)),T++)}const R={value:new t.Vector4},W=new t.ShaderMaterial({uniforms:{...x,uHerdK:R,uHd:{value:new t.Vector2(w/26,F/26)},uDapple:{value:le.dapple?1:0}},vertexShader:Ut,fragmentShader:Ht,side:t.DoubleSide}),I=new t.Mesh(Oe(a,N.length/4,{aRun:{a:new Float32Array(N),n:4}}),W);I.frustumCulled=!1,I.name="herd-band",pe.add(I);const j={};kt.push((T,k)=>{R.value.set(w*T,F*T,k*2.6+.21,.72)});const ae=new t.Vector3,H=new t.Vector3,m=-Math.sin(7*He),J=Math.cos(7*He);tt.up=T=>{Fe.pointAt(T,ae),se.inv(ae.x,ae.z,o(T),j);let k=-j.nx,n=-j.nz;const C=Math.hypot(k,n);return C>.05&&n>0?(k=k/C*.8+m*.2,n=n/C*.8+J*.2):(k=m,n=J),ae.set(ae.x+k*60,ae.y+9,ae.z+n*60)};const P=new t.Vector3,Y=new t.Vector3;tt.entry=T=>(Fe.pointAt(Math.min(T+.03,1),Y),Y.y-=13,Y),tt.sea=T=>{Fe.pointAt(T,P);const k=ee.x-P.x,n=ee.z-P.z,C=Math.hypot(k,n)||1;return P.set(P.x+k/C*420,-30,P.z+n/C*420)},tt.herd=T=>{const k=o(T),n=d-12.8*(k-13)-95,C=et+20*k;return H.set(n,se.height(n,C,k)+2,C)}}if(X){const v=r(Math.round(70*me),0,0,-4,6);kt.push((M,w)=>v.value.set(X.x-330-3*(M-25),X.zc(M)-2,w*2.9+.5,0))}pt.push((v,M,w,F,N)=>{for(const z of kt)z(N,M)})}await h.yield();{const a=[],s=[],i=[],u=y.fork?y.fork("ranges"):y;[7e3,1e4,14e3].forEach((p,b)=>{const v=u.range(0,100),M=a.length/3;for(let w=0;w<=180;w++){const F=w/180*Le,N=Math.cos(F)*3+v,z=Math.sin(F)*3,R=(.35+.65*Math.abs(h.noise.fbm2(N,z,4))+.5*Math.max(0,h.noise.n2(N*.4+9,z*.4)))*(260+190*b);if(a.push(Math.cos(F)*p,-250,Math.sin(F)*p,Math.cos(F)*p,R,Math.sin(F)*p),s.push(b,0,b,1),w<180){const W=M+w*2;i.push(W,W+1,W+2,W+1,W+3,W+2)}}});const d=new t.BufferGeometry;d.setAttribute("position",new t.Float32BufferAttribute(a,3)),d.setAttribute("aK",new t.Float32BufferAttribute(s,2)),d.setIndex(i);const r=new t.Mesh(d,new t.ShaderMaterial({uniforms:x,side:t.DoubleSide,vertexShader:`
attribute vec2 aK; uniform float uTw; varying vec2 vK; varying float vY;
void main(){
  vec3 p = position; p.xz += cameraPosition.xz;
  p.y += aK.y * 110. * sin(0.0026 * p.x - uTw * 0.12 + aK.x * 2.1) + 60. * sin(0.0011 * p.z + uTw * 0.09 + aK.x) - 30.;
  vK = aK; vY = p.y; gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,fragmentShader:`
uniform vec3 uFogCol, uSkyCol, uSunCol; varying vec2 vK; varying float vY;
void main(){
  vec3 c = mix(vec3(0.22, 0.42, 0.62), vec3(0.3, 0.5, 0.72), vK.x * 0.5) * (0.55 + 0.5 * dot(uSunCol, vec3(0.33))) ;
  c = mix(c, uFogCol, 0.62 + 0.12 * vK.x + 0.2 * (1. - smoothstep(-50., 260., vY)));
  gl_FragColor = vec4(c, 1.);
}`}));r.frustumCulled=!1,r.renderOrder=-.5,r.name="ranges",pe.add(r)}await h.yield();{const e=[],a=[],s=(n,C,B,A,G,c)=>{e.push(...n,...C,...B),a.push(...A,...G,...c)},i=(n,C,B,A=5)=>{const G=[];for(let c=0;c<A;c++){const f=c/A*Le+.3;G.push([Math.cos(f)*C,B+Math.sin(f)*C*.85,n])}return G},u=(n,C,B,A)=>{const G=n.length;for(let c=0;c<G;c++){const f=(c+1)%G;s(n[c],n[f],C[c],[0,B,0],[0,B,0],[0,A,0]),s(n[f],C[f],C[c],[0,B,0],[0,A,0],[0,A,0])}},d=[i(-.52,.012,.02),i(-.3,.085,0),i(0,.15,-.02),i(.28,.125,.01),i(.44,.055,.05)];for(let n=0;n<d.length-1;n++)u(d[n],d[n+1],0,0);const r=[i(.42,.05,.05,4),i(.82,.03,.08,4),i(1.2,.028,.1,4),i(1.29,.05,.11,4),i(1.37,.03,.11,4)];for(let n=0;n<r.length-1;n++)u(r[n],r[n+1],3,3);for(let n=0;n<4;n++)s(r[4][n],r[4][(n+1)%4],[0,.1,1.62],[0,4,0],[0,4,0],[0,4,0]);const p=[i(-.3,.03,-.05,3),i(-1.22,.014,-.03,3)];u(p[0],p[1],5,5);for(const n of[-1,1]){const C=[0,.18,.36,.5,.64,.78,.9,1],B=[.2,.27,.31,.32,.28,.2,.1,-.02],A=[-.2,-.25,-.25,-.23,-.2,-.17,-.13,-.1];for(let G=0;G<C.length-1;G++){const c=C[G],f=C[G+1],q=[n*c*1.1,.03,B[G]],E=[n*f*1.1,.03,B[G+1]],ne=[n*c*1.1,.03,A[G]],oe=[n*f*1.1,.03,A[G+1]];s(q,E,oe,[n*c,1,0],[n*f,1,0],[n*f,1,1]),s(q,oe,ne,[n*c,1,0],[n*f,1,1],[n*c,1,1])}}const b=new t.BufferGeometry;b.setAttribute("position",new t.Float32BufferAttribute(e,3)),b.setAttribute("aW",new t.Float32BufferAttribute(a,3));const v=le.swallows,M=Math.round((v?46:40)*(.6+.4*me)),w=v?.5:1,F=M*7,N=new Float32Array(F*4),z=new Float32Array(F*4),R=[],W=Oe(b,F,{aP:{a:N,n:4},aQ:{a:z,n:4}});W.attributes.aP.setUsage(t.DynamicDrawUsage),W.attributes.aQ.setUsage(t.DynamicDrawUsage);const I=new t.Mesh(W,new t.ShaderMaterial({uniforms:x,side:t.DoubleSide,vertexShader:Pe+`
attribute vec3 aW; attribute vec4 aP, aQ; varying vec3 vC; varying vec3 vW; varying vec3 vNb; varying vec3 vG;
void main(){
  vec3 l = position; float sp = abs(aW.x), fl = aQ.y, st = 1. - fl;             // fl: 0 standing, wings shut .. 1 flying
  float op = smoothstep(0.0, 0.28, fl), shut = 1. - op;                          // the wings snap open as the bird leaves the grass: never half-open on the ground
  float a1 = ((0.5 + 0.35 * (1. - fl)) * sin(aQ.x) + 0.08 + 0.3 * (1. - fl)) * op - shut * 1.45, a2 = (0.55 * sin(aQ.x - 0.9) - 0.32) * op - shut * 2.95;
  vec3 nb = vec3(position.x, position.y - 0.02, 0.); nb /= max(length(nb), 1e-3);
  if (aW.y < 0.5) l.xy *= 1.35;                                                  // a full white body
  float inner = min(sp, 0.5), outer = max(sp - 0.5, 0.);
  if (aW.y > 0.5 && aW.y < 2.5) {                                              // wings: arm and hand hinged at the wrist; shut, they lie doubled along the flank
    float sx = sign(aW.x), r1 = 1.1, ang = sp > 0.5 ? a1 + a2 : a1; l.x = sx * (0.1 * shut + r1 * (inner * cos(a1) + outer * cos(a1 + a2))); l.y += r1 * (inner * sin(a1) + outer * sin(a1 + a2));
    l.z = mix(l.z, l.z * 0.8 - 0.1, shut) * 1.2; l.y += 0.035 * sin(3.14159 * aW.z) * op;      // a little camber
    nb = normalize(vec3(-sx * sin(ang), cos(ang), 0.25 - 0.5 * aW.z));
  } else if (aW.y > 2.5 && aW.y < 4.5) {                                       // neck and bill: straight out in flight, raised when standing
    float an = st * 1.05 - 0.05 * fl * sin(aQ.x + 0.7), cn = cos(an), sn = sin(an); vec2 q = l.zy - vec2(0.42, 0.05);
    l.zy = vec2(0.42, 0.05) + vec2(q.x * cn - q.y * sn, q.x * sn + q.y * cn);
  } else if (aW.y > 4.5) {                                                     // legs: trailing in flight, straight down when standing
    float an = -st * 1.5, cn = cos(an), sn = sin(an); vec2 q = l.zy - vec2(-0.2, -0.06);
    l.zy = vec2(-0.2, -0.06) + vec2(q.x * cn + q.y * sn, -q.x * sn + q.y * cn); l.x += st * sign(position.x + 1e-4) * 0.05;
  }
  { float bp = st * 0.42, cb = cos(bp), sb = sin(bp); if (aW.y < 4.5) l.zy = vec2(l.z * cb - l.y * sb, l.z * sb + l.y * cb); }   // standing birds carry the body tilted up
  l *= aQ.w; l.y += fl * 0.07 * sin(aQ.x + 1.6) + st * 0.86 * aQ.w;
  float c = cos(aP.w), s = sin(aP.w), bk = aQ.z, cb2 = cos(bk), sb2 = sin(bk);
  l.xy = vec2(l.x * cb2 - l.y * sb2, l.x * sb2 + l.y * cb2); nb.xy = vec2(nb.x * cb2 - nb.y * sb2, nb.x * sb2 + nb.y * cb2);
  vW = aP.xyz + vec3(l.x * c + l.z * s, l.y, -l.x * s + l.z * c); vNb = vec3(nb.x * c + nb.z * s, nb.y, -nb.x * s + nb.z * c);
  vec3 alb = aW.y > 4.5 ? vec3(0.07, 0.065, 0.07) : aW.y > 3.5 ? vec3(0.5, 0.36, 0.1) : vec3(0.8, 0.79, 0.76);
  if (aW.y > 2.5 && aW.y < 3.5) alb = mix(alb, vec3(0.1, 0.09, 0.1), smoothstep(1.02, 1.16, position.z) * 0.85);       // a dark face and throat
  ${v?"alb = aW.y > 0.5 && aW.y < 2.5 ? vec3(0.06, 0.08, 0.16) : aW.y < 0.5 ? vec3(0.5, 0.45, 0.4) : vec3(0.08, 0.09, 0.15);":""}
  vC = alb; vG = vec3(sp, aW.z, aW.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.);
}`,fragmentShader:Pe+`
varying vec3 vC; varying vec3 vW; varying vec3 vNb; varying vec3 vG;
void main(){
  vec3 alb = vC;
  if (vG.z > 0.5 && vG.z < 2.5) {                                              // the hand of the wing: black primaries, fingered at the tip
    if (vG.x > 0.84 && fract(vG.y * 4. + 0.15) < 0.4 * (vG.x - 0.84) / 0.16) discard;
    alb = mix(alb, ${v?"alb":"vec3(0.06, 0.06, 0.08)"}, smoothstep(0.6, 0.66, vG.x + 0.16 * vG.y));
    alb *= 0.9 + 0.1 * smoothstep(0.1, 0.6, vG.y);
  }
  vec3 V = normalize(cameraPosition - vW), n = vNb / max(length(vNb), 1e-3); if (dot(n, V) < 0.) n = -n;
  float dif = mix(0.4, 1., smoothstep(-0.25, 0.7, dot(n, uSunDir)));                 // the shaded side is still a white bird: warm light thrown up by the meadow
  vec3 c = alb * (uSunCol * dif * (0.45 + 0.55 * gsCloud(vW.xz)) + uSkyCol * (0.85 + 0.35 * n.y) + uGndCol * 0.8 * (0.5 - 0.5 * n.y) + uSunCol * vec3(0.06, 0.065, 0.08));   // a lit side and a luminous blue-grey shaded side
  c *= min(1., 0.88 / max(max(c.r, c.g), max(c.b, 1e-3)));                    // white, never above the bloom threshold
  gl_FragColor = vec4(gsFog(c, length(cameraPosition - vW), vW.y), 1.);
}`}));I.frustumCulled=!1,I.name="cranes",pe.add(I);const j=190,ae=(600-j)/20,H={},m={},J={x:0,z:0},P=(n,C)=>{let B=n.x0+C*n.hx,A=n.z0-C*j;const G=B-ee.x,c=A-ee.z,f=Math.hypot(G,c);if(f<320){const q=320/Math.max(f,1);B=ee.x+G*q,A=ee.z+c*q}J.x=B,J.z=A},Y=(n,C,B,A)=>{const G=(C-n.T0)/ae,c=Math.floor(G),f=(G-c)*ae;if(c!==n.n&&(n.n=c,P(n,c),se.at(J.x,J.z,n.T0+c*ae,H),n.Sx=H.x,n.Sy=H.y,n.Sz=H.z,P(n,c+1),n.Lx=J.x,n.Lz=J.z),se.at(n.Lx,n.Lz,C,H),f>=n.F)return A.x=H.x,A.y=H.y+.1,A.z=H.z,A.fly=0,A.yaw=n.yaw0,A;const q=f/n.F,E=.5*q+.5*q*q*(3-2*q),ne=ie(0,1.2,f)*(1-ie(n.F-1.3,n.F-.15,f)),oe=H.x-n.Sx,ue=H.z-n.Sz,xe=Math.hypot(oe,ue)||1,we=1.3*Math.sin(B*.4+n.seed*40)*ne,re=n.Sx+oe*E+ue/xe*we,be=n.Sz+ue*E-oe/xe*we,S=n.cap*Math.pow(Math.max(Math.sin(Math.PI*q),0),.75)+.8*Math.sin(B*.7+n.seed*20)*ne;A.x=re,A.z=be,A.y=Math.max(se.quick(re,be,C)+.1+.45*Math.max(S,0),n.Sy+(H.y-n.Sy)*q+S);const Ct=Math.atan2(oe,ue),At=(Ct-n.yaw0+Math.PI*3)%Le-Math.PI,wt=ie(0,.8,f)*(1-ie(n.F-.9,n.F,f));return A.fly=ne,A.yaw=n.yaw0+At*wt+.12*Math.sin(B*.5+n.seed*90)*ne,A};let T=300;for(;T<l.N-200&&l.Z[T]<et+20*l.TWs[T]-20;)T+=2;const k=h.core.makeRng(((h.seed|0)^23823)+3301);for(let n=0;n<7;n++){const C=k.range(-70,70),B={x:-190,z:490},A=Le/U[0].k,G=n===0?0:k.range(ee.x,B.x),c=n===0?0:k.range(B.z,B.z+A),f=80,q=et+20*l.TWs[T];for(let E=0;E<M;E++){let ne=G+k.range(-f,f),oe=c+Ve(k.gauss()*8,-18,18),ue=k.range(7,24);if(n===0){oe=q-20*k.range(.4,3.6);let we=T;for(;we>200&&l.Z[we]>oe;)we-=2;ne=l.X[we]+k.range(-22,22),ue=k.range(10,26)}const xe={x0:ne,z0:oe,hx:C,F:k.range(15.4,17.4),cap:ue,seed:k(),yaw0:k.range(0,Le),n:NaN,T0:0,Sx:0,Sy:0,Sz:0,Lx:0,Lz:0};for(let we=0;we<8;we++){xe.T0=(xe.z0-et)/20,xe.n=NaN;let re=!0;for(let be=0;be<=l.N&&re;be+=2){const S=l.TWs[be];Y(xe,S,S,m),Math.abs(m.x-l.X[be])<7&&Math.abs(m.z-l.Z[be])<7&&Math.hypot(m.x-l.X[be],m.y-l.Y[be],m.z-l.Z[be])<7&&(re=!1)}if(re)break;xe.x0+=7.5}xe.n=NaN,R.push(xe),await h.yield()}}pt.push((n,C,B,A,G)=>{for(let c=0;c<F;c++){const f=Y(R[c],G,C,m),q=c*4,E=R[c].seed;N[q]=f.x,N[q+1]=f.y,N[q+2]=f.z,N[q+3]=f.yaw,z[q]=C*(v?16:7.5)*(.9+.2*E)+E*30,z[q+1]=f.fly,z[q+2]=(.3*Math.sin(E*77)+.16*Math.sin(C*.6+E*9))*f.fly,z[q+3]=w*(1+.18*E)}W.attributes.aP.needsUpdate=!0,W.attributes.aQ.needsUpdate=!0})}await h.yield();{const e=y.fork?y.fork("motes"):y,a=Math.round(1500*me),s=Math.round(260*me),i=Math.round(220*me),u=a+s+i,d=new t.BufferGeometry;d.setAttribute("position",new t.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,-1,0,1,1,0,-1,1,0],3));const r=new Float32Array(u*4),p=new Float32Array(u*2);for(let v=0;v<u;v++)r[v*4]=e()*100,r[v*4+1]=e()*100,r[v*4+2]=e(),r[v*4+3]=e(),p[v*2]=v<a?0:v<a+s?1:2,p[v*2+1]=e();const b=new t.Mesh(Oe(d,u,{aOff:{a:r,n:4},aK:{a:p,n:2}}),new t.ShaderMaterial({uniforms:x,side:t.DoubleSide,vertexShader:$e+Pe+`
attribute vec4 aOff; attribute vec2 aK; uniform vec2 uWin, uCapJ; uniform float uTime, uRain;
varying vec2 vUv; varying vec4 vK; varying vec3 vW;
void main(){
  float kind = aK.x, sd = aK.y, W = kind < 0.5 ? (uRain > 0.01 ? 40. : 100.) : 56.;
  vec2 drift = kind < 0.5 ? vec2(0.25, -0.95) * (7. + 4. * sd) * uTime : vec2(sin(uTime * 0.31 + sd * 40.), cos(uTime * 0.27 + sd * 23.)) * 2.5;
  vec2 ctr = (kind < 0.5 && uRain > 0.01) ? mix(cameraPosition.xz, uWin, 0.3) : uWin;
  vec2 a0 = ctr + mod(aOff.xy * W * 0.01 + drift - ctr, W) - W * 0.5;
  float edge = 1. - smoothstep(W * 0.36, W * 0.49, length(a0 - ctr));
  vec3 gn; float J; vec3 d = gsOff(a0, uTw, 1., gn, J);
  float cap = 1. - smoothstep(uCapJ.x, uCapJ.y + 0.06, J), life = fract(uTime * (0.16 + 0.1 * aOff.z) + aOff.w), s, h;
  if (kind < 0.5) { h = 0.7 + 4.5 * life * (0.4 + aOff.z) + 0.5 * sin(uTime * 2. + sd * 30.); s = (0.06 + 0.05 * sd) * sin(3.14159 * life) * (0.04 + 0.96 * cap); }
  else if (kind < 1.5) { h = 1.3 + 1.6 * aOff.z + 0.5 * sin(uTime * 1.7 + sd * 50.); s = 0.11 + 0.05 * sd; }
  else { h = 0.9 + 1.2 * aOff.z + 0.25 * sin(uTime * 3.3 + sd * 70.); s = 0.045; }
  vec3 p = vec3(a0.x + d.x, d.y + h, a0.y + d.z);
  if (kind < 0.5 && uRain > 0.) {                                                   // the rain: falling through the air round the camera
    float fall = fract(aOff.w + uTime * (0.16 + 0.1 * aOff.z));
    p.y = mix(p.y, cameraPosition.y + 13. - 26. * fall + 2. * sin(uTime + sd * 9.), min(uRain * 4., 1.));
    s = mix(s, (0.27 + 0.2 * sd) * sin(3.14159 * fall) * step(aOff.z, 0.5), uRain);
  }
  vec4 mv = viewMatrix * vec4(p, 1.); float dist = -mv.z;
  s = max(s, dist * 0.0022 * step(0.001, s)) * edge;
  if (kind < 0.5) s *= smoothstep(2.6, 4.6, length(mv.xyz));
  vec2 q = position.xy; float rot = kind < 0.5 ? uTime * (2. + 4. * sd) + sd * 20. : 0.6 * sin(uTime * 0.9 + sd * 12.);
  if (kind > 0.5 && kind < 1.5) q.x *= abs(sin(uTime * 13. + sd * 30.)) * 0.9 + 0.1;            // butterfly wings closing
  if (kind < 0.5) q.y *= 0.45 + 0.55 * abs(sin(uTime * 3. + sd * 11.));                        // petals tumbling
  q = vec2(q.x * cos(rot) - q.y * sin(rot), q.x * sin(rot) + q.y * cos(rot));
  mv.xy += q * s;
  vUv = position.xy; vK = vec4(kind, sd, gsCloud(p.xz), dist); vW = p;
  gl_Position = projectionMatrix * mv;
}`,fragmentShader:Pe+`
uniform vec3 uCap, uAccent; varying vec2 vUv; varying vec4 vK; varying vec3 vW;
void main(){
  float r = length(vUv); vec3 alb; float kind = vK.x;
  if (kind < 0.5) { if (abs(vUv.x) > 0.62 * (1. - vUv.y * vUv.y) * (0.8 + 0.25 * vUv.y) + 0.04) discard; alb = mix(uCap * 1.15, uAccent, step(0.9, vK.y)) * (0.78 + 0.22 * vUv.y + 0.12 * vUv.x); }
  else if (kind < 1.5) { vec2 q = abs(vUv); if (q.x * q.x * 0.8 + (q.y - 0.25 * q.x) * (q.y - 0.25 * q.x) * 1.6 > 0.8 || q.x < 0.06) discard; alb = mix(vec3(0.12, 0.3, 0.85), vec3(0.45, 0.7, 1.), 1. - r) ; alb = mix(alb, vec3(0.03), smoothstep(0.75, 0.95, r)); }
  else { if (r > 0.9) discard; alb = mix(vec3(0.55, 0.38, 0.05), vec3(0.04), step(0.35, abs(vUv.y))); }
  vec3 c = alb * (uSunCol * (0.6 + 0.4 * vK.z) * 1.05 + uSkyCol);
  gl_FragColor = vec4(gsFog(c, vK.w, vW.y), 1.);
}`}));b.frustumCulled=!1,b.name="motes",pe.add(b)}if(await h.yield(),ft.length){const s=[],i=[];for(let b=0;b<=2;b++)for(let v=0;v<=4;v++)s.push(v/4,0,b/2*2-1);for(let b=0;b<2;b++)for(let v=0;v<4;v++){const M=b*5+v,w=M+1,F=M+4+1,N=F+1;i.push(M,F,w,w,F,N)}const u=new t.BufferGeometry;u.setAttribute("position",new t.Float32BufferAttribute(s,3)),u.setIndex(i);const d=Math.min(13/Math.tan(V.elev*He),46)+5,r=Math.hypot(Se.x,Se.z),p=new t.Mesh(Oe(u,ft.length/3,{aAnc:{a:new Float32Array(ft),n:3}}),new t.ShaderMaterial({uniforms:{...x,uShDir:{value:new t.Vector3(-Se.x/r,d,-Se.z/r)}},transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,vertexShader:$e+Pe+ot+`
attribute vec3 aAnc; uniform vec3 uShDir; varying vec2 vUv; varying vec3 vW; varying float vLit;
void main(){
  vec2 dir = uShDir.xz, prp = vec2(-dir.y, dir.x); float w = 5.2 * aAnc.z;
  vec2 a0 = aAnc.xy + dir * (position.x * uShDir.y * aAnc.z - 3.) + prp * position.z * w * (1. - 0.2 * position.x);
  vec3 gn; float J; vec3 d = gsOff(a0, uTw, 1., gn, J);
  vW = vec3(a0.x + d.x, d.y + 0.35, a0.y + d.z); vUv = vec2(position.x, position.z); vLit = (gsWaveSh(aAnc.xy, 6., uTw) - (1. - uShK.w)) / max(uShK.w, 0.01);
  gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.);
}`,fragmentShader:Pe+`
uniform vec3 uDarkG; varying vec2 vUv; varying vec3 vW; varying float vLit;
void main(){
  float x = vUv.x, core = smoothstep(0., 0.12, x) * (1. - smoothstep(0.55, 1., x)), a = core * (1. - smoothstep(0.35, 1., abs(vUv.y))) * 0.62 * gsCloud(vW.xz);
  float dist = length(cameraPosition - vW); a *= 1. - (1. - exp(-uFogDen * uFogDen * dist * dist));
  { float mh = 1. - smoothstep(uMistY.x, uMistY.y, vW.y); a *= clamp(vLit, 0., 1.) * (1. - min(uMist * mh * sqrt(mh) * (1. - exp(-dist * dist / 400000.)) * 1.5, 1.)); }   // no shadow drawn on the mist, or inside a swell's shadow
  gl_FragColor = vec4(uDarkG * vec3(0.16, 0.2, 0.27) + uSkyCol * 0.03, a * 0.92);
}`}));p.frustumCulled=!1,p.renderOrder=1,p.name="tree-shadows",pe.add(p)}await h.yield(),pt.push((e,a,s,i,u)=>{x.uRain.value=Math.max(X?ie(33,37,u):0,.85*ie(.86,.92,i))}),await h.yield(),await We.prewarm(h.renderer,null,pe),await h.yield();let Je=0,Wt=!1,Ft=0,Xt=0;const Zt=new t.Vector3,xt=new t.Vector3,Qe={},je=new t.Vector3,Bt=new t.Vector3(ee.x,120,ee.z),u0=new t.Vector3(ee.x-30,70,ee.z-200);return{scene:pe,path:Fe,duration:46,pace:e=>.93+.34*ie(.07,.14,e)-.5*ie(.2,.27,e)+.52*ie(.44,.5,e)-.47*ie(.59,.65,e)+.12*ie(.8,.9,e),camera:{fov:62,near:.5,far:16e3,lookAhead:40,sway:.8,bank:.3},pois:[{at:(e,a)=>tt.entry(a),from:0,to:.055,weight:.4,fade:.3},{at:(e,a)=>tt.up(a),from:.05,to:.305,weight:.8,fade:.25},{at:(e,a)=>tt.herd(a),from:.28,to:.315,weight:.4,fade:.3},{at:Bt,from:.27,to:.33,weight:.4},{at:(e,a)=>tt.sea(a),from:.285,to:.335,weight:.45,fade:.3},{at:(e,a)=>Zt,from:.3,to:.5,weight:.68,fade:.25},{at:Bt,from:.46,to:.62,weight:.4},{at:Bt,from:.6,to:.76,weight:.3},{at:u0,from:.77,to:.96,weight:.3,fade:.32}],portal:{shape:"circle",radius:7,color:"#FFF2CF",glow:1,revealDistance:700,tilt:!0},post:{exposure:V.exposure,bloom:{strength:.32,radius:.6,threshold:.93},grade:{saturation:V.sat,contrast:1.05,tint:V.tint,shadowTint:V.shadowTint,vignette:.26,grain:.02,aberration:0}},ride:"none",update(e,a,s,i){const u=o(i);if(i<=0)Je=u+1.3*Math.sin(a*.42),Wt=!0;else if(!Wt||Math.abs(i-Ft)>.012*Math.max(1,h.flight?h.flight.rate:1)||a<Xt-.01||u-Je>3||Je-u>3.6)Je=u,Wt=!0;else{const r=Math.max(.4,h.flight?h.flight.rate:1),p=Math.min(32,Math.max(1,Math.round(r)));for(let b=1;b<=p;b++){const v=Je-(b<p?o(Ft+(i-Ft)*b/p):u);Je+=e/p*r*(v>0?Math.exp(-v/.7):1+Math.min(3,-v*1.5))}}if(Ft=i,Xt=a,x.uTw.value=Je,x.uTime.value=a,X){const r=X.cAt(Je);x.uRogue.value.z=r,x.uRogue.value.y=X.zc(Je)-r*Je}s.getWorldPosition(xt),se.inv(xt.x,xt.z,Je,Qe),x.uCamRest.value.set(Qe.x0,Qe.z0),s.getWorldDirection(je);const d=Math.hypot(je.x,je.z)||1;x.uWin.value.set(Qe.x0+je.x/d*44,Qe.z0+je.z/d*44),x.uWin0.value.set(Qe.x0+je.x/d*13,Qe.z0+je.z/d*13),x.uWin2.value.set(Qe.x0+je.x/d*150,Qe.z0+je.z/d*150),x.uFwd.value.set(je.x/d,je.z/d),x.uCloudX.value.x=ut.x,x.uCloudX.value.y=ut.z+st*a,Zt.set(xt.x-21,xt.y-5,et+20*Je+3),Me.setProgress(Je),Me.update(e,a,s);for(let r=0;r<pt.length;r++)pt[r](e,a,s,i,Je);We.update(e,a,s),_e.update(e,a,s)},dispose(){We.dispose(),Me.dispose();for(const e of gt)e.dispose?.()}}}};export{N0 as default};
