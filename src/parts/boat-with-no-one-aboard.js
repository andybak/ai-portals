import*as o from"three";import{clamp as pe,lerp as N,smoothstep as q}from"../kit/core.js";import*as de from"../kit/fx.js";const se=420,ve=12,ee=25,Be=3.5,He=14,$=512,re=14,ne=-300,Te=1748,s=(e,n=1)=>{const t=new o.Color(e);return[t.r*n,t.g*n,t.b*n]},Ee=(e,n,t)=>[N(e[0],n[0],t),N(e[1],n[1],t),N(e[2],n[2],t)],st=s,xe=[[61,.18,.34,.3],[43,-.42,.24,2.1],[29,.66,.17,4.4],[19,-.95,.12,1.2],[11.5,1.3,.08,5.3],[6.7,-1.7,.05,3.7]],ue=9.81,Ie=xe.map(([e,n,t,a])=>{const u=2*Math.PI/e;return{k:u,dx:Math.sin(n),dz:Math.cos(n),a:t,w:Math.sqrt(ue*u),ph:a}}),rt=["deep","crest","foam","glow","skyHi","skyLo","fog","key","amb","keyDir"],nt=["swell","foamAmt","rough","under","stars","cloud","dens","rainbow","phos","milk","chop","spec","fogH"],Ne={deep:[0,0,0],crest:[0,0,0],foam:[1,1,1],glow:[0,0,0],skyHi:[0,0,0],skyLo:[0,0,0],fog:[0,0,0],key:[0,0,0],amb:[.1,.1,.1],keyDir:[0,1,0],swell:.3,foamAmt:.3,rough:.5,under:0,stars:0,cloud:.5,dens:1/900,rainbow:0,phos:0,milk:0,chop:.5,spec:.5,fogH:0};function ge(e,n){const t=(i,f,w)=>{const p=new o.Color(i);return p.offsetHSL(w,0,0),[p.r*f,p.g*f,p.b*f]},a=n.mood-.5,u=n.coastSide,d=n.iceSide,m=n.river,h=ee,l=(e.wall1-e.wall0)/4,b=(e.squall+e.wall0)/2;return[{a:-1e4,b:-200-h,...m,skyLo:m.astern,fog:m.astern.map(i=>i*.8)},{a:-200+h,b:e.bar-h,...m},{a:e.bar+h,b:e.milk-h,deep:t("#0b4a36",.3,a*.05),crest:t("#46d89a",.5,a*.05),foam:s("#f2faf4",1),glow:t("#0f6b4a",.12,a*.05),skyHi:s("#3c4c62",.95),skyLo:s("#93aab2",.9),fog:s("#7c949c",.8),key:s("#cfe4e0",.9),keyDir:[.2,.7,-.6],amb:s("#647a82",.9),swell:.3,foamAmt:.42,rough:.7,cloud:.9,dens:1/800,chop:.9,spec:.5},{a:e.milk+h,b:e.green-h,deep:s("#4c6a8a",.5),crest:s("#c4d2e2",.7),foam:s("#ffffff",.95),glow:s("#dfe8e6",.09),skyHi:s("#0f1c40",1),skyLo:s("#5c79a8",.85),fog:s("#415a84",.85),key:s("#dfe8ee",.25),keyDir:[0,1,0],amb:s("#9db2c4",.75),swell:.15,foamAmt:.25,rough:.35,under:1,stars:1,cloud:.5,dens:1/900,milk:1,chop:.3,spec:.15},{a:e.green+h,b:e.violet-h,deep:t("#06281c",1,a*.04),crest:t("#1c8a58",.9,a*.04),foam:s("#d2f0dc",.9),glow:t("#0e6a44",.6,a*.04),skyHi:s("#08161c",1),skyLo:s("#0e3428",.9),fog:s("#0c2c22",.9),key:s("#9fe0b8",.3),keyDir:[0,1,0],amb:s("#2c6a50",.7),swell:.3,foamAmt:.12,rough:.5,under:.35,stars:.8,cloud:.4,dens:1/700,phos:1,chop:.6,spec:.3},{a:e.violet,b:e.violet,deep:s("#3a2a50",.8),crest:s("#d8a8a0",.9),foam:s("#fff0d8",.95),glow:s("#5a3a40",.3),skyHi:s("#6a4a78",.9),skyLo:s("#ffe6b0",.95),fog:s("#f2d2a4",.8),key:s("#ffe6b0",1),keyDir:[.5*-u,.3,-.8],amb:s("#8a6a80",.8),swell:.3,foamAmt:.3,rough:.5,stars:.2,cloud:.5,dens:1/520,chop:.5,spec:.6},{a:e.violet+h,b:e.ice-h,deep:t("#1a0c2e",1,a*.06),crest:t("#7a3cc0",.9,a*.06),foam:s("#ecd2f4",.9),glow:t("#34125a",.3,a*.06),skyHi:t("#4a2470",.85,a*.05),skyLo:s("#b4503c",.85),fog:s("#7a3a58",.75),key:s("#ff8a44",1.5),keyDir:[.72*-u,.2,-.62],amb:t("#46286c",.8,a*.05),swell:.34,foamAmt:.3,rough:.55,cloud:.75,dens:1/900,rainbow:1,chop:.55,spec:1},{a:e.ice,b:e.ice,deep:s("#3c3460",.8),crest:s("#b0a0d0",.9),foam:s("#f4ecff",.95),glow:s("#4a4070",.2),skyHi:s("#8a7cae",.8),skyLo:s("#b4a4cc",.85),fog:s("#a898c4",.8),key:s("#e8e0ff",.6),keyDir:[.4*d,.5,-.7],amb:s("#7c70a0",.8),swell:.25,foamAmt:.25,rough:.4,cloud:.6,dens:1/150,chop:.4,spec:.3,fogH:1},{a:e.ice+h,b:e.squall-h,deep:s("#3f6f9a",.55),crest:s("#cfd9e0",.85),foam:s("#ffffff",.95),glow:s("#8fa8ba",.12),skyHi:s("#9db0c6",.8),skyLo:s("#e4e8ea",.85),fog:s("#c0cad6",.8),key:s("#f6f8ff",1.3),keyDir:[.5*-d,.32,-.8],amb:s("#7f95ad",.85),swell:.24,foamAmt:.2,rough:.35,cloud:.65,dens:1/800,chop:.4,spec:1.2},{a:b,b:e.wall0-l,deep:s("#101822",1),crest:s("#3c4c60",.9),foam:s("#dfe6ee",.9),glow:[0,0,0],skyHi:s("#323c4a",.9),skyLo:s("#3a4452",.9),fog:s("#2c3542",.9),key:s("#aab8cc",.5),keyDir:[0,.8,-.4],amb:s("#39445a",.8),swell:.5,foamAmt:.8,rough:.9,cloud:1,dens:1/He,chop:1,spec:.3},{a:e.wall0+l,b:e.wall1-l,deep:s("#3a0c08",1),crest:s("#c22a12",.8),foam:s("#ffd0a0",.9),glow:s("#5a1408",.4),skyHi:s("#c22a12",.9),skyLo:s("#d8401a",.9),fog:s("#c22a12",.85),key:s("#ffb060",1),keyDir:[0,.6,-.7],amb:s("#a03018",.9),swell:.45,foamAmt:.6,rough:.8,cloud:1,dens:1/Be,chop:.9,spec:.5},{a:e.wall1+h,b:e.star-h,deep:t("#070d34",1,a*.03),crest:t("#2038c4",.9,a*.03),foam:s("#cdd8ff",.9),glow:t("#0a1658",.3,a*.03),skyHi:t("#16289c",1,a*.03),skyLo:t("#1a2a90",.9,a*.03),fog:t("#131c6c",.9,a*.03),key:s(n.fire,.7),keyDir:[.85,.25,-.3],amb:t("#1c2c98",.8,a*.03),swell:.5,foamAmt:.35,rough:.6,cloud:.35,dens:1/1e3,chop:.7,spec:1},{a:e.star+h,b:1e4,deep:s("#060a24",1),crest:s("#141c58",.9),foam:s("#efe6c8",.9),glow:[0,0,0],skyHi:s("#04071a",1),skyLo:s("#0c1238",1),fog:s("#0a0f30",1),key:s("#ffe2a0",.9),keyDir:[0,.3,-.95],amb:s("#34325c",.9),swell:.22,foamAmt:.12,rough:.3,under:.3,stars:1,cloud:.05,dens:1/1400,chop:.3,spec:.8}].map(i=>({...Ne,...i}))}function qe(e,n){if(e.violet===void 0)return{roads:0,fire:0,bolt:0,rain:0,snow:0,petals:0,bar:0};const t=ee,a=(e.squall+e.wall0)/2,u=(e.wall1-e.wall0)/4,d=b=>q(b-t,b+t,n),m=q(e.squall-t,a,n),h=q(a,e.wall0+u,n),l=q(e.wall1-u,e.wall1+t,n);return{roads:d(e.ice)*(1-m),fire:l,bolt:d(e.ice)*(1-h),rain:m*(1-h),snow:d(e.green)*(1-d(e.violet)),petals:d(e.coast0)*(1-d(e.coast1)),bar:q(e.bar,e.crest[0],n)*(1-q(e.crest[2],e.crest[2]+35,n))}}function We(e,n,t=ge(e,n)){const a=new Float32Array($*re*4),u=new Uint16Array($*re*4),d=(Te-ne)/($-1);let m=0,h=0;const l=(g,i,f,w)=>{const p=(g*$+i)*4;a[p]=f[0],a[p+1]=f[1],a[p+2]=f[2],a[p+3]=w};return{stops:t,data:a,half:u,ds:d,fill:(g=1)=>{const i=Math.min($,Math.round(g*$));for(let f=h;f<i;f++){const w=ne+f*d;let p=0;for(;p<t.length-1&&w>t[p+1].a;)p++;const S=t[p],z=w<=S.b||p===t.length-1,D=z?S:t[p+1],M=z?0:q(S.b,D.a,w),T=B=>N(S[B],D[B],M),R=B=>Ee(S[B],D[B],M),G=T("dens");m+=G*d,l(0,f,R("deep"),T("swell")*n.swellK),l(1,f,R("crest"),T("foamAmt")),l(2,f,R("foam"),T("rough")),l(3,f,R("glow"),T("under")),l(4,f,R("skyHi"),T("stars")),l(5,f,R("skyLo"),T("cloud")),l(6,f,R("fog"),G),l(7,f,[T("rainbow"),T("phos"),T("milk")],T("chop")),l(8,f,R("key"),T("spec")),l(9,f,R("keyDir"),m),l(10,f,R("amb"),T("fogH"));const W=qe(e,w);l(11,f,[0,W.roads,W.fire],W.bolt),l(12,f,[W.rain,W.snow,W.petals],0),l(13,f,[W.bar,0,0],0);for(let B=0;B<re;B++){const L=(B*$+f)*4;for(let H=0;H<4;H++)u[L+H]=o.DataUtils.toHalfFloat(a[L+H])}}h=Math.max(h,i)}}}function Oe(e,n,t=ge(e,n),a=null){const u=a||We(e,n,t);u.fill(1);const d=u.data,m=u.half,h=u.ds;t=u.stops;const l=(r,v)=>{let c=0;for(;c<t.length-1&&r>t[c+1].a;)c++;const x=t[c];if(r<=x.b||c===t.length-1)return x[v];const k=t[c+1],y=q(x.b,k.a,r);return typeof x[v]=="number"?N(x[v],k[v],y):Ee(x[v],k[v],y)},b=new o.DataTexture(m,$,re,o.RGBAFormat,o.HalfFloatType);b.magFilter=o.LinearFilter,b.minFilter=o.LinearFilter,b.wrapS=b.wrapT=o.ClampToEdgeWrapping,b.generateMipmaps=!1,b.needsUpdate=!0;const g=(r,v,c=[0,0,0,0])=>{const x=pe((v-ne)/h,0,$-1.001),k=Math.floor(x),y=x-k,A=(r*$+k)*4;for(let F=0;F<4;F++)c[F]=N(d[A+F],d[A+4+F],y);return c},i=[[e.bar,0],[e.crest[0],2.2],[(e.crest[0]+e.crest[1])/2,-2.2],[e.crest[1],3],[(e.crest[1]+e.crest[2])/2,-3],[e.crest[2],2.5],[e.crest[2]+35,0]],f=(r,v)=>{if(r<=i[0][0]||r>=i[6][0])return 0;let c=0;for(;r>i[c+1][0];)c++;const x=(r-i[c][0])/(i[c+1][0]-i[c][0]),k=.5-.5*Math.cos(Math.PI*x),y=i[c][1],A=i[c+1][1];if(!v)return N(y,A,k);const F=A>y?k:1-k;return Math.min(y,A)+Math.abs(A-y)*F*F},w=r=>f(r,!0),p=r=>f(r,!1),S=r=>1-q(150,200,Math.abs(r)),z=n.roll||[0,0,0],D=r=>q(ve,ve+58,Math.abs(r)),M=r=>D(r)*(11*Math.sin(r*.019+z[0])+6*Math.sin(r*.047+z[1])),T=r=>1+D(r)*(.2*Math.sin(r*.031+z[2])+.13*Math.sin(r*.083+z[0]*2)-.08),R=[0,0,0,0],G=(r,v)=>{const c=-v,x=J.uBlueStar.value,k=J.uBay.value;if(c<x.x)return 0;let y=q(-30,30,c-(k.x+k.y*Math.max(Math.abs(r)-k.z,0)));for(const A of J.uIsl.value)A.z>=1&&(y=Math.max(y,q(1.75,1.15,Math.hypot(r-A.x,v-A.y)/A.z)));return y},W=(r,v)=>{const c=-v,x=J.uBlueStar.value;return c<x.x?c:N(x.x,Math.max(c,x.y),G(r,v))},B=(r,v,c)=>{const x=g(0,W(r,v),R)[3];let k=0;for(const y of Ie)k+=x*y.a*Math.sin(y.k*(y.dx*r+y.dz*v)-y.w*c+y.ph);return k},L=(r,v)=>w(-v+M(r))*T(r)*S(r),H=(r,v)=>p(-v+M(r))*T(r)*S(r),U=(r,v,c)=>L(r,v)+B(r,v,c),I=[0,0,0,0],ae=[0,0,0,0],P=(r,v,c,x,k,y)=>{const A=Math.hypot(x-r,k-v,y-c),F=Math.abs(y-c);return N(g(6,-c,I)[3],Math.abs(g(9,-y,I)[3]-g(9,-c,ae)[3])/Math.max(F,1),q(2,14,F))*A*N(1,Math.exp(-Math.max(.5*(k+v)-6,0)/14),g(10,-(c+y)/2,I)[3])},O=(r,v,c,x,k,y,A=0)=>{const F=P(r,v,c,x,k,y);return Math.exp(-F*(1-A*(1-q(1,3,F))))},Q=(r,v,c)=>{const x=Math.max(Math.abs(v-r),.001),k=g(9,-r,I)[3],y=Math.abs(g(9,-v,I)[3]-k),A=y*Math.min(.4,.7/Math.max(c,.001));let F=0,V=0,K=1,oe=y,Y=4/x;for(let Z=0;Z<4;Z++){if(Y<K){const j=Math.abs(g(9,-N(r,v,Y),I)[3]-k);j<A?(F=Y,V=j):(K=Y,oe=j)}Y*=4}return F+(K-F)*pe((A-V)/Math.max(oe-V,1e-6),0,1)},C=256,X=new Uint16Array(C*C*4),ce=(r,v,c)=>{let x=Math.imul(r,374761393)+Math.imul(v,668265263)+Math.imul(c+1,1442695041)|0;return x=Math.imul(x^x>>>13,1274126177),((x^x>>>16)&255)/255};{const r=[0,1,2,3].map(c=>{const x=16<<c,k=new Float32Array(x*x);for(let y=0;y<x;y++)for(let A=0;A<x;A++)k[y*x+A]=ce(A,y,c);return k}),v=new Float32Array(4);for(let c=0;c<C;c++)for(let x=0;x<C;x++){let k=.5,y=0;for(let V=0;V<4;V++){const K=16<<V,oe=(x+.5)/C*K,Y=(c+.5)/C*K,Z=Math.floor(oe),j=Math.floor(Y),me=oe-Z,we=Y-j,ze=me*me*(3-2*me),Me=we*we*(3-2*we),fe=r[V],ke=(Z+1)%K,Ae=(j+1)%K;v[V]=N(N(fe[j*K+Z],fe[j*K+ke],ze),N(fe[Ae*K+Z],fe[Ae*K+ke],ze),Me),y+=k*v[V],k*=.62}const A=(c*C+x)*4,F=y/1.1214;X[A]=o.DataUtils.toHalfFloat(.9*q(.5,.68,F)),X[A+1]=o.DataUtils.toHalfFloat(1-q(.32,.5,F)),X[A+2]=o.DataUtils.toHalfFloat(v[0]),X[A+3]=o.DataUtils.toHalfFloat(1)}}const _=new o.DataTexture(X,C,C,o.RGBAFormat,o.HalfFloatType);_.magFilter=o.LinearFilter,_.minFilter=o.LinearFilter,_.wrapS=_.wrapT=o.RepeatWrapping,_.generateMipmaps=!1,_.needsUpdate=!0;const J={tTable:{value:b},uTime:{value:0},uBufH:{value:450},uIsl:{value:Array.from({length:ie},()=>new o.Vector4(0,0,0,0))},uBay:{value:new o.Vector4(1e6,3,60,0)},uBlueStar:{value:new o.Vector2(1e6,1e6)},uExt:{value:i.map(r=>new o.Vector2(r[0],r[1]))},uRollPh:{value:new o.Vector3(z[0],z[1],z[2])},uFold:{value:new o.Vector2(0,0)},uSheet:{value:new o.Vector4(0,1,0,12)},uSheetAir:{value:0},tFold:{value:_}};return{stops:t,tex:b,row:g,valueAt:l,rollerS:w,rideS:p,rideAt:H,rollerEnv:S,swellAt:B,standingAt:L,heightAt:U,nightAt:G,sOf:W,uniforms:J,ext:i,wander:M,heave:T,depth:P,dim:O,fogShare:Q}}const ie=4,te=`
uniform sampler2D tTable; uniform float uTime; uniform vec4 uIsl[${ie}]; uniform vec4 uBay; uniform vec2 uBlueStar;
#define TUS(s) clamp(((s) - (${ne.toFixed(1)})) / ${(Te-ne).toFixed(1)}, 0., 1.)
vec4 seaRowS(float r, float s){ return textureLod(tTable, vec2(TUS(s) * ${(($-1)/$).toFixed(6)} + ${(.5/$).toFixed(6)}, (r + .5) / ${re.toFixed(1)}), 0.); }
vec4 seaRow(float r, float z){ return seaRowS(r, -z); }
// the star sea is a bay of night that opens ahead in the blue sea, and a pool of night round each near star island
float seaNightW(vec2 xz, float w){
  float s = -xz.y; if (s < uBlueStar.x) return 0.;
  float n = smoothstep(-w, w, s - (uBay.x + uBay.y * max(abs(xz.x) - uBay.z, 0.)));
  for (int i = 0; i < ${ie}; i++){ vec4 I = uIsl[i]; n = max(n, step(1., I.z) * smoothstep(1.75, 1.15, length(xz - I.xy) / max(I.z, 1.))); }
  return n;
}
float seaNight(vec2 xz){ return seaNightW(xz, 30.); }
float seaSW(vec2 xz, float w){ float s = -xz.y; return s < uBlueStar.x ? s : mix(uBlueStar.x, max(s, uBlueStar.y), seaNightW(xz, w)); }
float seaS(vec2 xz){ return seaSW(xz, 30.); }
vec4 seaAt(float r, vec2 xz){ return seaRowS(r, seaS(xz)); }
// THE DEPTH OF WEATHER between the eye and a place: the table's own fog summed along the ray (exact for a medium that
// is layered along the voyage: the summed row 9). Every thing of this world takes its fog from this one depth.
float seaDepth(vec3 wp){
  float zc = cameraPosition.z, zf = wp.z, d = distance(cameraPosition, wp), dz = abs(zf - zc);
  float avg = mix(seaRow(6., zc).a, abs(seaRow(9., zf).a - seaRow(9., zc).a) / max(dz, 1.), smoothstep(2., 14., dz));
  float hf = mix(1., exp(-max(.5 * (wp.y + cameraPosition.y) - 6., 0.) / 14.), seaRow(10., mix(zc, zf, .5)).a);
  return avg * d * hf;
}
// THE FOG'S COLOUR IS THE AIR'S WHERE THE FOG IS SEEN: the place along the ray at which the depth from the eye
// reaches two fifths of the whole (thin air: near the ray's middle), and never more than 0.7 of a depth (deep
// weather: the air by the eye; so nothing beyond a wall of weather is fogged to the colour of the sea beyond it).
// Found on the summed row: 4, 16, 64 and 256 m of voyage from the eye are tried, then one straight step between
// the two that hold the place (no jump from ray to ray). Returns the share of the ray.
float seaFogAt(float zc, float zf, float tau){
  float dz = max(abs(zf - zc), 1e-3), o0 = seaRow(9., zc).a, tot = abs(seaRow(9., zf).a - o0), want = tot * min(.4, .7 / max(tau, 1e-3));
  float a = 0., fa = 0., b = 1., fb = tot, m = 4. / dz;
  for (int i = 0; i < 4; i++){
    if (m < b){ float fm = abs(seaRow(9., mix(zc, zf, m)).a - o0); if (fm < want){ a = m; fa = fm; } else { b = m; fb = fm; } }
    m *= 4.;
  }
  return a + (b - a) * clamp((want - fa) / max(fb - fa, 1e-6), 0., 1.);
}
// THE RED AIR IS FOLDED, AND ITS FOLDS STAND IN THE WORLD; every thing that takes the fog takes them. Where the red
// air lies thick (banks) and where thin (rifts) is read ON TWO FIXED SHEETS OF THE WALL'S OWN AIR, where the ray
// from the eye meets them: ONE UPRIGHT SHEET across the voyage where the red air ends up the voyage (uSheet.z, a
// voyage metre) and ONE LEVEL SHEET at a set height over the mean sea (uSheet.w m) between the red air's two ends
// (uSheet.x: their middle, uSheet.y: half the way between them, voyage metres). A sheet's picture is a law of its
// own two world coordinates and the world clock alone: folds 40 to 120 m long and half as tall, smaller folds on
// them down to 10 m, drifting at about a metre a second (uFold: the visit's own place in the pattern). So an eye
// that moves sees the same bank from another place: a bank on the upright sheet comes nearer, is passed, and is
// seen from its other side astern; a bank on the level sheet comes up from ahead, stands overhead and abeam, and
// goes astern. THE PATTERN IS BAKED IN A SMALL TILE (tFold, made with the table: the bank's dark share, the rift's
// lit share, and the longest folds alone), so a sheet is read with ONE read of that tile: two reads a pixel, and
// little for a driver to compile (the law is in every material that takes the fog).
uniform vec2 uFold; uniform vec4 uSheet; uniform float uSheetAir; uniform sampler2D tFold;
vec3 redTile(vec2 cell){ return textureLod(tFold, (cell + uFold) / 16., 0.).rgb; }
// (a place in the pattern on a level sheet: across and along; the pattern taken 5.3 and 9.7 cells off, so that the
// level sheet and the upright one do not carry one picture)
vec2 redFlat(vec2 xz){ return vec2(xz.x * .011 + uTime * .012 + 5.3, xz.y * .015 + uTime * .007 + 9.7); }
// WHAT A RAY FROM THE EYE SHOWS OF THE FOLDED AIR (plain: the air's one colour). A BANK is the plain colour
// deepening to dark crimson at its heart; A RIFT is open air lit by the fire that burns low on the sea-line beyond
// the wall: a brighter vermilion, to orange where the rift opens toward that fire (ahead up the voyage and within
// a few degrees of the sea-line). THE UPRIGHT SHEET shows to a ray that meets it beyond the eye: nothing within 3
// degrees of edge-on and whole from 17 (a sheet seen along itself is no picture), and BY THE AIR BETWEEN THE EYE
// AND IT, as any thing in weather: the table's summed fog between the two voyage metres (uSheetAir, found each
// frame where the eye is), taken along the ray: nothing where no air lies between (the eye is in the sheet), whole
// from one depth. So the eye goes through it with no step, and nothing here reads how far the eye is from anything
// but as depth of air. THE LEVEL SHEET shows to a ray that rises to it (nothing under 2 degrees of rise, whole
// from 12: lower rays meet it too far off) where the place they meet lies between the red air's two ends (going
// out over 20 m about each end), and there it stands before the upright sheet. Where neither shows, the air is its
// plain colour. It is the air's own law, no body: it reads the ray, the eye's place and the world's sheets, and
// nothing else. (The weights are straight ramps: there is nothing to see of their corners in this air.)
vec3 redFold(vec3 plain, vec3 dir){
  vec3 eye = cameraPosition; float se = -eye.z, ds = -dir.z, ad = max(abs(ds), .05), tU = (uSheet.z - se) * ds / (ad * ad);
  float wU = step(0., tU) * clamp(ad * 4. - .2, 0., 1.) * min(uSheetAir / ad, 1.);
  vec2 pU = eye.xy + dir.xy * tU, pL = eye.xz + dir.xz * (max(uSheet.w - eye.y, 0.) / max(dir.y, .03));
  float wL = clamp(dir.y * 6. - .2, 0., 1.) * clamp(.5 - (abs(-pL.y - uSheet.x) - uSheet.y) / 20., 0., 1.);
  vec2 f = mix(redTile(vec2(pU.x * .011 + uTime * .012, pU.y * .024 - uTime * .004)).rg * wU, redTile(redFlat(pL)).rg, wL);
  return mix(mix(plain, vec3(.12, .003, .012), f.r), mix(vec3(.74, .055, .012), vec3(.95, .2, .03), smoothstep(-.3, .6, ds) * exp(-abs(dir.y) * 7.)), f.g);
}
// THE FOG'S COLOUR for a thing at wp behind tau depths of air: the air's colour where the fog is seen (seaFogAt),
// FOLDED where that air is the red wall's: by the red air's share of the table's air at that place (its fog a
// tenth of a depth to the metre: none; a quarter: whole) and by the depth of air before the thing (under one
// depth the plain colour: a thing so near stands in the air about the eye; from three depths the folds whole:
// there the thing itself is lost, and its fog shows what the wall's own cloud shows along the same ray).
vec3 seaFogCol(vec3 wp, float tau){
  vec3 fp = mix(cameraPosition, wp, seaFogAt(cameraPosition.z, wp.z, tau)); vec4 air = seaAt(6., fp.xz);
  float w = smoothstep(.09, .25, air.a) * smoothstep(1., 3., tau);
  if (w > .004) air.rgb = mix(air.rgb, redFold(air.rgb, normalize(wp - cameraPosition)), w);
  return air.rgb;
}
// keep: how much of a light holds against thin air. Nothing holds against deep weather: the hold is whole up to
// one depth and gone at three (the squall and the red wall close over every light alike).
vec3 seaFog(vec3 col, vec3 wp, float keep){
  float tau = seaDepth(wp), f = 1. - exp(-tau);
  return mix(col, seaFogCol(wp, tau), f * (1. - keep * (1. - smoothstep(1., 3., tau))));
}
// what is left of a light seen through the weather. It holds against thin air by a share (hold) of the depth (0: as any
// surface) up to one depth; from one depth to three the hold goes: deep weather closes over every light alike.
float seaDim(vec3 wp, float hold){ float tau = seaDepth(wp); return exp(-tau * (1. - hold * (1. - smoothstep(1., 3., tau)))); }
vec3 seaLight(vec3 n, vec3 wp, vec3 albedo, float wrap){
  float s = seaS(wp.xz);
  vec3 hi = seaRowS(10., s).rgb, lo = seaRowS(3., s).rgb * 1.6 + seaRowS(0., s).rgb * .5;
  vec4 key = seaRowS(8., s); vec3 kd = seaRowS(9., s).xyz; kd /= max(length(kd), 1e-3);
  float nl = clamp((dot(n, kd) + wrap) / (1. + wrap), 0., 1.);
  return albedo * (mix(lo, hi, n.y * .5 + .5) + key.rgb * nl);
}
`,le=12,Re=.86,ye=24,be=6,he=12,Le=`
uniform vec4 uDoors[${le}]; uniform vec4 uDoorK[${le}]; uniform vec4 uSunA; uniform vec4 uSunB; uniform vec3 uDogA; uniform vec3 uDogB; uniform vec3 uDawn; uniform vec4 uFire; uniform float uFlash; uniform vec2 uSquall; uniform float uWall; uniform vec4 uFar; uniform vec4 uRed; uniform vec4 uSunSea;
float skyStars(vec3 d){
  vec3 p = d * 150., c = floor(p), f = fract(p); vec3 o = hash33(c) * .7 + .15;
  float r = length(f - o), b = hash13(c + 7.3);
  float tw = .7 + .3 * sin(uTime * (.4 + b * .9) + b * 40.);
  return smoothstep(.085, .02, r) * step(.62, b) * (b * b) * 3.2 * tw;
}
// A SUN STANDS IN ITS OWN SEA'S SKY AT ONE STRENGTH, FOR EVER, AND IS SEEN FROM ANY SEA; ONLY THE WEATHER BETWEEN
// THE EYE AND IT DIMS IT. A disc's strength is a constant of its own sea (sun.w; the cloud that stands over that sea
// is in the constant: the disc's own dull colour; the suns stand low, under the ceiling, and a ray at their
// heights has not climbed to the ceiling in the length of the voyage to their seas, so no other sea's cloud
// stands between and the sky's cloud cover takes nothing of them). What a place sees of it is that constant
// times what the table's summed fog lets through between that place and the nearest metre of the sun's own sea
// (sea: that sea's first and last metre between its joins), WHICHEVER WAY THAT SEA LIES: the sun is a thing of its
// sea. From before its sea the ray toward it runs on up the voyage into that sea's clear air; inside it nothing is
// between; from beyond it the sun is still held to stand in that sea's sky, and the air counted is the air the
// place has between itself and that sea, astern. The depth is the summed row between the two voyage metres, taken
// along the ray (metres of ray to a metre of voyage in the sun's bearing), as the doors take the squall's and the
// red wall's air: here every air of the table counts, haze, dawn, mist, squall and wall alike. One value for the
// disc, its glow and its mock suns. The table holds no weight of a sun to be read at or ahead of whoever looks
// (row 11 keeps one weight, the roads of the two mock suns on the ice sea's water, read at the water's own place:
// a road on the water is the water's): nothing comes on, there is only air between.
float sunSeen(vec4 sun, vec2 sea, float fs){
  return sun.w * exp(-abs(seaRowS(9., clamp(fs, sea.x, sea.y)).a - seaRowS(9., fs).a) / max(abs(sun.z), .02));
}
// A MOCK SUN IS A SOFT PATCH ON THE RING AND HAS NO DISC. It lies where the ring (22 degrees from the white sun)
// passes the mock sun's own bearing: longer along the ring than across it (3 by 1.5 degrees to half strength), its
// brightest part a sixteenth of the white sun's disc; pale red-brown on its inner edge, toward the sun, white in its
// middle, and bluish white in a faint tail that runs out away from the sun (3 degrees to 1/e). ONE LAW WHEREVER
// A MOCK SUN IS DRAWN (the open sky and what mirrors it, the squall's cloud); what a place sees of it is the white
// sun's own sunSeen. cb: the cosine of the angle from the white sun; al2: mockAl2 below.
vec3 mockSun(float cb, float al2){
  float rho = (.927 - cb) / .375, core = exp(-min(rho * rho / .000247 + al2 / .000987, 30.));
  float tail = smoothstep(0., .02, rho) * exp(-min(max(rho, 0.) / .055 + al2 / .0005, 30.));
  vec3 tint = mix(mix(vec3(1., .95, .86), vec3(1., .62, .4), smoothstep(-.004, -.022, rho)), vec3(.8, .88, 1.), smoothstep(.004, .03, rho));
  return tint * (.34 * core + .1 * tail);
}
// (the square of the angle, in radians, that a ray lies ALONG the ring from a mock sun's bearing: its angle from
// that bearing less its part across the ring)
float mockAl2(vec3 dir, vec3 dog, float cb){
  float c0 = dot(dog, uSunB.xyz), rd = (c0 - cb) / sqrt(max(1. - c0 * c0, .01));
  return max(2. * (1. - dot(dir, dog)) - rd * rd, 0.);
}
// A PATCH LIES ON ITS AIR AND IS NO LIGHT OF ITS OWN: what a mock sun adds to the air it is drawn on (the open sky,
// the squall's cloud) is never more than that air's own lightness at its place, so a patch at the most doubles
// the air it lies on: whole on the ice sea's pearl, a faint paling on the squall's dark cloud. ONE LAW FOR EVERY AIR.
vec3 mockOn(vec3 air, vec3 lit){
  return lit * min(1., dot(air, vec3(.3, .5, .2)) / max(dot(lit, vec3(.3, .5, .2)), 1e-4));
}
// reach: how the squall closes the sky. 0: closed at the squall's middle (no light of the seas beyond it);
// 1: open beyond it; under 0: the place's own, BY THE SQUALL'S AIR BEFORE THE EYE (below)
vec3 skyColR(vec3 dir, vec3 from, float detail, float reach){
  float e = max(dir.y, 0.); vec2 h = dir.xz / max(length(dir.xz), 1e-4);
  float tn = max(e, .04) / sqrt(max(1. - e * e, 1e-4));
  // the colour of the sky is that of the sea a little way on in that direction: 26 m of rise to a metre of table
  float run = 240. * (1. - exp(-26. / tn / 240.));
  // (the edge of the bay of night is wide in the sky and torn like cloud: the place read wanders sideways with a
  // noise of the direction, so no edge stands straight up the sky)
  vec2 wq = vec2(-h.y, h.x) * ((fbmLo(h * 2.2 + vec2(e * 5., 0.)) - .5) * 220.);
  float s = seaSW(from.xz + h * run + wq, 260.), s2 = seaSW(from.xz + h * run * .6 + wq * .6, 260.), s3 = seaSW(from.xz + h * run * .25 + wq * .25, 260.);
  // THE SQUALL AND THE RED WALL CLOSE THE VIEW AS WEATHER DOES. The sky is found twice: closed (nothing of the
  // table beyond the squall's middle is read) and open (read as far as the red wall's far face; beyond the
  // wall's own colour as wide as the weather is deep: the reach grows to the whole table by what the red air
  // between the place the sky is seen from and that air's far end lets through, the summed fog). The two are
  // mixed by what the squall's air between the eye and the wall's near face lets through (the summed fog): so
  // the red sky comes up through the squall as that air thins before the eye, with no step at any place.
  float fs = -from.z, open = max(uWall - 5., fs) + 400. * exp(-max(seaRowS(9., uRed.z).a - seaRowS(9., clamp(fs, uRed.x, uRed.z)).a, 0.));
  float w = reach < 0. ? exp(-max(seaRowS(9., uRed.x).a - seaRowS(9., min(fs, uRed.x)).a, 0.)) : reach;
  float sc = min(s, uSquall.x), sc2 = min(s2, uSquall.x), sc3 = min(s3, uSquall.x); s = min(s, open); s2 = min(s2, open); s3 = min(s3, open);
  // one graded dome: the mean of the seas from here to the reach in that direction, the far one's low light on the sea-line
  vec4 hi = mix(seaRowS(4., sc) + seaRowS(4., sc2) + seaRowS(4., sc3), seaRowS(4., s) + seaRowS(4., s2) + seaRowS(4., s3), w) / 3.;
  vec4 lo = mix(.5 * seaRowS(5., sc) + .3 * seaRowS(5., sc2) + .2 * seaRowS(5., sc3), .5 * seaRowS(5., s) + .3 * seaRowS(5., s2) + .2 * seaRowS(5., s3), w);
  // THE WEATHER OF THE SKY ITSELF (the table's row 11: the fire, the lightning) BY THE SKY'S OWN
  // WEIGHTS: read at the same places of the table as the sky's colour in this direction and mixed as that colour
  // is (the low light's weights near the sea-line, the dome's mean higher up). So the fire lies along the blue
  // sea's sea-line and the lightning lights the squall's own cloud, as the dome's colours lie: THE DOME'S OWN LAW,
  // for what is the sky's own colour. (The two suns are no part of it: sunSeen, above.)
  vec4 e1 = seaRowS(11., sc), e2 = seaRowS(11., sc2), e3 = seaRowS(11., sc3), e4 = seaRowS(11., s), e5 = seaRowS(11., s2), e6 = seaRowS(11., s3);
  vec4 ev = mix(mix(.5 * e1 + .3 * e2 + .2 * e3, .5 * e4 + .3 * e5 + .2 * e6, w), mix(e1 + e2 + e3, e4 + e5 + e6, w) / 3., 1. - exp(-e * 5.));
  s = mix(sc, s, w);
  vec2 qc = from.xz + h * min(380. / tn, 5000.);
  float cl = fbmLo(qc * vec2(.0023, .0046) + vec2(uTime * .004, 0.));
  float cov = smoothstep(.62 - .5 * lo.a, .95 - .5 * lo.a, cl + .25 * lo.a);
  vec3 top = mix(hi.rgb, mix(hi.rgb * .5, lo.rgb * 1.05 + hi.rgb * .25, cl * cl), cov * .85);
  top += uFlash * ev.a * vec3(.55, .65, 1.) * (.35 + cov) * smoothstep(60., 0., abs(s - uSquall.x) - uSquall.y);
  // far lightning: the cloud round the stroke's own place lights up
  { vec2 fd = (qc - uFar.xy) / 300.; top += uFar.z * vec3(.5, .62, 1.) * (.25 + cov) * exp(-min(dot(fd, fd), 30.)); }
  float up = 1. - exp(-e * 5.);
  vec3 col = mix(lo.rgb, top, up);
  // THE ICE SEA'S SKY IS GRADED BY THE WHITE SUN'S BEARING AND BY HEIGHT. Its pearl is the table's (rows 4 and 5);
  // the grade is a share of that pearl, weighed by the table's own weight of the ice sea at the sky's place in
  // this direction (ev.y, row 11: whole over the ice sea, nothing over any other), so it comes and goes through
  // that sea's joins as its sky does and no other sea's sky takes any of it. Low and toward the white sun's
  // bearing the pearl is warmed (a sixth more red, a quarter less blue: a low sun's own band, whole within some 20
  // degrees of the bearing, gone 70 degrees off it); round from there, on the ice front's hand and astern, it is
  // cooler and deeper (to two thirds); overhead it is deepest and bluest (to a half). So white ice in the
  // sun stands against a sky darker than itself overhead and on the ice's hand.
  { float sunW = smoothstep(.35, .95, dot(h, uSunB.xz / max(length(uSunB.xz), 1e-3)));
    col *= mix(vec3(1.), mix(mix(vec3(.66, .76, .93), vec3(1.16, 1., .72), sunW), vec3(.52, .65, .9), up), ev.y); }
  if (detail > .5) col += skyStars(dir) * hi.a * up * (1. - cov);
  float runFull = (${se.toFixed(1)} - min(from.y, 400.)) / max(e, .012) * sqrt(max(1. - e * e, 0.));
  // doors
  vec2 dh = from.xz + h * min(runFull, 4200.); float door = 0.;
  float halo = 0.;
  // each door is a rent torn in the night: its outline its own (stretched and turned, ragged by noise), a lit torn
  // rim, and through it a brighter sky thick with stars
  float rim = 0., dseed = 0.;
  for (int i = 0; i < ${le}; i++){ vec4 D = uDoors[i], K = uDoorK[i]; vec2 dq = dh - D.xy, dl = vec2(dq.x * K.x + dq.y * K.y, dq.y * K.x - dq.x * K.y) * vec2(K.z, 1. / max(K.z, .2));
    float q0 = length(dq) / max(D.z, 1.), q = length(dl) / max(D.z, 1.);
    if (q0 < 2.6){ q += (fbmLo(dq * .021 + K.w) - .5) * .95 + (vnoise(dq * .083 + K.w * 1.7) - .5) * .3;
      float rent = D.w * smoothstep(1., ${Re.toFixed(2)}, q); if (rent > door){ door = rent; dseed = K.w; }
      rim = max(rim, D.w * smoothstep(.1, 0., abs(q - .95))); }
    halo += D.w * exp(-q0 * q0 * .7); }
  // A DOOR STANDS OPEN ALWAYS. It is closed to a ray only by weather: by the depth of the squall's and the red
  // wall's air along the ray from the place it is seen from to the ceiling (the table's summed fog between the
  // two voyage metres, within the stretch where that weather stands; metres of ray to a metre of voyage as the
  // red air takes them). From the blue sea on, no such air lies on the way.
  float w0 = uSquall.x - uSquall.y - ${ee.toFixed(1)}, wa = clamp(fs, w0, uRed.z), wb = clamp(-dh.y, w0, uRed.z);
  float seen = step(runFull, 4200.) * smoothstep(.0, .05, e) * exp(-abs(seaRowS(9., wb).a - seaRowS(9., wa).a) / max(abs(dir.z), .02));
  vec3 through = vec3(.08, .15, .5) * (.6 + .8 * fbmLo(dh * .011 + dseed)) + vec3(.12, .1, .04);
  if (detail > .5) through += (skyStars(dir * 1.9 + dseed) * 4. + skyStars(dir * .8 - dseed) * 6.) * vec3(1., .95, .8);
  col = mix(col, through, door * seen) + vec3(1.2, .92, .44) * rim * (1. - door * .5) * seen + vec3(.36, .27, .13) * min(halo, 1.5) * .3 * seen;
  // the low blotted sun of the violet sea, the small white sun of the ice sea
  float ca = dot(dir, uSunA.xyz), evA = sunSeen(uSunA, uSunSea.xy, fs), evB = sunSeen(uSunB, uSunSea.zw, fs);
  if (evA > .001){
    float disc = smoothstep(.99905, .99935, ca);
    vec2 sp = (dir.xy - uSunA.xy) * 60. + dir.z * 13.; float blot = smoothstep(.52, .7, vnoise(sp * 1.7 + 3.)) * .9 + smoothstep(.6, .8, vnoise(sp * 4.3)) * .5;
    col = mix(col, vec3(3.4, .95, .28) * (1. - clamp(blot, 0., .93)), disc * evA);
    col += vec3(1.1, .32, .12) * evA * (pow(clamp(ca, 0., 1.), 60.) * .5 + pow(clamp(ca, 0., 1.), 900.) * .9) * (1. - disc);
  }
  float cb = dot(dir, uSunB.xyz);
  if (evB > .001){
    // THE RING IS A SHARE OF THE SKY IT STANDS ON: 22 degrees about the white sun the sky's own colour at that
    // place is lifted by a share (a tenth; 0.18 beside the two mock suns and over the ring's top; nothing at the
    // sea-line, whole from some 7 degrees up), so the ring is rose on a rose sky and pale on a pale one, and on
    // a dark sky there is next to nothing of it. It goes with the white sun by the sun's own law (evB).
    float ring = (clamp(cb, 0., 1.) - .927) / .011, alA = mockAl2(dir, uDogA, cb), alB = mockAl2(dir, uDogB, cb);
    float share = (.1 + .08 * max(max(exp(-min(alA / .02, 30.)), exp(-min(alB / .02, 30.))), smoothstep(uSunB.y + .18, uSunB.y + .34, dir.y))) * smoothstep(0., .12, dir.y);
    col *= 1. + evB * share * exp(-min(ring * ring, 30.));
    col += evB * (vec3(5., 5.2, 5.6) * smoothstep(.99982, .99992, cb) + vec3(.55, .58, .64) * pow(clamp(cb, 0., 1.), 220.) + vec3(.2, .22, .26) * pow(clamp(cb, 0., 1.), 24.));
    // two mock suns stand 22 degrees to either side of it at its own height, on the ring: soft patches, no discs
    col += mockOn(col, evB * (mockSun(cb, alA) + mockSun(cb, alB)));
  }
  // THE DAWN STANDS IN ITS JOIN: a slab of pale light across the voyage, 2 x JOIN m thick about the join's own place
  // (uDawn.x, a voyage metre), thinning upward (1/e at 10 m). A ray takes of it what lies beyond the eye along that
  // ray, at the height where the ray meets the slab; it is dimmed by the haze the table holds between (row 9) and
  // by its range (1/e at 120 m, half the sky's own reach). So it is a light ahead from the seas before it, all
  // round within it, and astern beyond it; brightest toward the low sun's hand (uDawn.y).
  { float az = max(abs(dir.z), .2), dzs = (-uDawn.x - from.z) * (dir.z < 0. ? -1. : 1.), tm = (max(dzs, 0.) + ${(.4*ee).toFixed(1)}) / az;
    float slab = smoothstep(${(-ee).toFixed(1)}, ${ee.toFixed(1)}, dzs) * exp(-max(from.y + e * tm, 0.) / 10.);
    float haze = exp(-abs(seaRowS(9., uDawn.x).a - seaRow(9., from.z).a) / az - min(tm, 3000.) / 120.);
    col += vec3(1., .9, .69) * uDawn.z * slab * haze * (.6 + .4 * smoothstep(-.3, .9, h.x * uDawn.y)); }
  // fire low along the sea-line to port and starboard
  float fl = vnoise(vec2(atan(h.x, -h.y) * 26., uTime * .7)) * .6 + vnoise(vec2(atan(h.x, -h.y) * 71., uTime * 1.6)) * .4;
  col += uFire.rgb * ev.z * exp(-e / (.02 + .032 * fl)) * (1. - seaNightW(from.xz + h * 650., 150.)) * (.5 + 1.1 * fl);
  return col;
}
vec3 skyCol(vec3 dir, vec3 from, float detail){ return skyColR(dir, from, detail, -1.); }
`,Ce=160,$e=`
uniform vec2 uWallOff;
// cells in space: (distance to the nearest cell wall, the cell's own number)
vec2 wallCells(vec3 x){
  vec3 n = floor(x), f = fract(x), r1 = vec3(8.), r2 = vec3(8.); float d1 = 64., d2 = 64., id = 0.;
  for (int k = -1; k <= 1; k++) for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){
    vec3 g = vec3(float(i), float(j), float(k)), r = g + hash33(n + g) - f; float d = dot(r, r);
    if (d < d1){ d2 = d1; r2 = r1; d1 = d; r1 = r; id = hash13(n + g + 17.3); } else if (d < d2){ d2 = d; r2 = r; }
  }
  return vec2(dot(.5 * (r1 + r2), normalize(r2 - r1)), id);
}
vec4 redAir(vec3 eye, vec3 dir){
  float se = -eye.z, ds = -dir.z, k = 1. / max(abs(ds), .02);
  float s0 = clamp(se, uRed.x, uRed.z), sX = ds > 0. ? uRed.z : uRed.x, o0 = seaRowS(9., s0).a, tot = abs(seaRowS(9., sX).a - o0), tau = tot * k;
  // the place one depth along the ray (half the whole where the air is thinner than two): eight places across
  // the red air are tried, then one straight step between the two that hold it (no jump from ray to ray)
  float want = min(1., .5 * tau) / k, a = s0, fa = 0., b = sX, fb = tot;
  for (int i = 1; i < 8; i++){ float m = mix(s0, sX, float(i) / 8.), fm = abs(seaRowS(9., m).a - o0); if (fm < want){ a = m; fa = fm; } else if (abs(m - s0) < abs(b - s0)){ b = m; fb = fm; } }
  float sp = a + (b - a) * clamp((want - fa) / max(fb - fa, 1e-6), 0., 1.);
  vec3 p = eye + dir * (abs(sp - se) * k);
  // (the pattern shifts a little across with depth into the wall)
  vec2 w = p.xy - p.z * vec2(.06, .04);
  float c1 = fbm(vec2(w.x * .018 + uTime * .01, w.y * .03) + uWallOff), c2 = fbmLo(vec2(w.x * .05 - uTime * .035, w.y * .06 + uTime * .02));
  vec3 red = mix(vec3(.3, .02, .01), vec3(.8, .1, .03), c1) * (.75 + .5 * c2);
  // the lichens of sun: patches some 30 m across, each a crust of blots a few metres across made of small cells
  // (an eighth of a metre, cells in space: of one shape from every side; from inside the wall, where the pattern
  // stands a depth off, hundreds are in view and never a few great ones)
  vec3 gp = vec3(w.x * .05 + uTime * .03, w.y * .06 - uTime * .012, p.z * .055) + vec3(c1 * .6, c1 * .6, 0.), xc = gp * ${Ce.toFixed(1)} + fbmLo(gp.xy * 9.) * 1.6; vec2 cell = wallCells(xc);
  // (anti-aliasing: where a cell is smaller than a pixel or two of the picture it is drawn as the mean of cells,
  // so the far crust is a glow and never a dust of sparks)
  float mean = smoothstep(.4, 1.2, length(fwidth(xc))), edge = mix(smoothstep(.03, .16, cell.x), .7, mean), id = mix(cell.y, .5, mean);
  float gold = smoothstep(.5, .62, fbm(gp.xy)) * smoothstep(.3, .5, fbm(gp * 5. + 3.7)) * edge * (.5 + .5 * id) * smoothstep(.2, .5, vnoise(gp * 31.) + id * .5);
  red = mix(red, mix(vec3(.9, .34, .04), vec3(1.3, .86, .2), id), gold);
  float blue = smoothstep(.68, .76, fbmLo(vec2(w.x * .009 + 7.3, w.y * .028 + 2.1) + uWallOff.yx));
  red = mix(red, vec3(.2, .62, 1.05), blue);
  // THE WALL'S CLOUD STANDS IN ITS NEAR HALF, toward the squall: over the 5 m before the wall's middle (by the
  // place in the wall the ray shows, the same for every eye) folds, lichens and smears go into the plain colour of
  // the red air, and beyond the middle the air is plain. So what stands beyond the wall looms out of one colour,
  // the same that fogs it, and the backstop at the middle is crossed with nothing to show for it.
  // THE WALL'S FOOT IS THE SEA'S PLAIN VAPOUR, by the height over the mean sea of the place in the wall the ray
  // shows (world metres, the same for every eye and from either side): plain under 3 m, the cloud whole from 6 m
  // up. So the wall meets the water in the one colour that fogs the water, and no line stands at the sea's rim.
  // THE PLAIN COLOUR IS THE FOLDED AIR'S (redFold, with the seas' GLSL), read from the same place and by the same
  // share as the fog of a thing far off along this ray (seaFogCol: the place near the eye where that fog is
  // seen, the red air's share of the air there, the depth of red air along the ray), so that a thing lost in
  // the red air is lost in this cloud and stands on it as no shape. (eye is the camera's place in every call.)
  vec3 off = cameraPosition + dir * 3000., fp = mix(cameraPosition, off, seaFogAt(cameraPosition.z, off.z, seaDepth(off)));
  vec3 air = seaRowS(6., sp).rgb; float wf = smoothstep(.09, .25, seaAt(6., fp.xz).a) * smoothstep(1., 3., tau);
  if (wf > .004) air = mix(air, redFold(air, dir), wf);
  red = mix(red, air, max(smoothstep(uRed.y - 5., uRed.y, sp), 1. - smoothstep(3., 6., p.y)));
  float rag = fbmLo(vec2(p.x * .012, uTime * .02)) * 46.;
  return vec4(red, (1. - exp(-tau)) * smoothstep(uRed.w, uRed.w - 70., p.y + rag));
}
`;function Ke(){return{uDoors:{value:Array.from({length:le},()=>new o.Vector4(0,0,1,0))},uSunA:{value:new o.Vector4(0,.07,-1,0)},uSunB:{value:new o.Vector4(0,.2,-1,0)},uDawn:{value:new o.Vector3(1e6,1,0)},uFire:{value:new o.Vector4(1,.2,.03,0)},uFlash:{value:0},uSquall:{value:new o.Vector2(735,20)},uWall:{value:775},uRed:{value:new o.Vector4(1e6,1e6,1000001,170)},uWallOff:{value:new o.Vector2(0,0)},uSunSea:{value:new o.Vector4(0,0,0,0)},uDoorK:{value:Array.from({length:le},()=>new o.Vector4(1,0,1,0))},uDogA:{value:new o.Vector3(.37,.2,-.9)},uDogB:{value:new o.Vector3(-.37,.2,-.9)},uFar:{value:new o.Vector4(0,0,0,0)}}}function Ge(e){const n=new o.ShaderMaterial({side:o.BackSide,depthWrite:!1,depthTest:!1,uniforms:e,vertexShader:"varying vec3 vDir; void main(){ vDir = position; vec4 p = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }",fragmentShader:de.GLSL_NOISE+te+Le+$e+`varying vec3 vDir;
      void main(){ vec3 d = normalize(vDir); vec3 c = skyCol(d, cameraPosition, 1.); if (d.y < 0.) c = mix(c, seaAt(6., cameraPosition.xz + d.xz / max(length(d.xz), 1e-4) * 300.).rgb, smoothstep(0., -.08, d.y));
        // THE RED WALL IS WEATHER: for an eye that stands in its air the sky is seen through what is left of that air
        // along the ray, so the sky comes clear as the air thins (the same law as the wall's backstop: redAir)
        float se = -cameraPosition.z;
        if (se > uRed.x && se < uRed.z){ vec4 ra = redAir(cameraPosition, d); c = mix(c, ra.rgb, ra.a); }
        gl_FragColor = vec4(c, 1.); }`}),t=new o.Mesh(new o.SphereGeometry(100,24,12),n);return t.renderOrder=-10,t.frustumCulled=!1,t}const Ue=Array.from({length:8},(e,n)=>[4.9*Math.pow(.71,n),.3+(n*2.39996%3.4-1.7)*(.55+.06*n),.07+.017*n,n*1.7]),E=e=>e.toFixed(4),Fe=xe.map(([e,n,t,a],u)=>{const d=2*Math.PI/e,m=Math.sqrt(ue*d);return`{ float p = ${E(d)} * dot(vec2(${E(Math.sin(n))}, ${E(Math.cos(n))}), xz) - ${E(m)} * uTime + ${E(a)}; float f = FADE(${E(e)}); h += A * ${E(t)} * sin(p) * f; sl += vec2(${E(Math.sin(n))}, ${E(Math.cos(n))}) * (A * ${E(t*d)} * cos(p) * f); }`}).join(`
`),Ve=Ue.map(([e,n,t,a])=>{const u=2*Math.PI/e,d=Math.sqrt(ue*u);return`{ float p = ${E(u)} * dot(vec2(${E(Math.sin(n))}, ${E(Math.cos(n))}), xz) - ${E(d)} * uTime + ${E(a)}; sl += vec2(${E(Math.sin(n))}, ${E(Math.cos(n))}) * (chop * ${E(t*.62)} * cos(p) * FADE(${E(e)})); }`}).join(`
`),Se=`
uniform vec2 uExt[7]; uniform vec3 uRollPh;
// (height, its slope along the voyage, its slope across): the crest line wanders and heaves across the voyage
vec3 roller(vec2 xz){
  float ax = abs(xz.x), tk = clamp((ax - ${ve.toFixed(1)}) / 58., 0., 1.), wk = tk * tk * (3. - 2. * tk), dwk = 6. * tk * (1. - tk) / 58. * sign(xz.x);
  float wv = 11. * sin(xz.x * .019 + uRollPh.x) + 6. * sin(xz.x * .047 + uRollPh.y);
  float dw = dwk * wv + wk * (.209 * cos(xz.x * .019 + uRollPh.x) + .282 * cos(xz.x * .047 + uRollPh.y));
  float hv = 1. + wk * (.2 * sin(xz.x * .031 + uRollPh.z) + .13 * sin(xz.x * .083 + uRollPh.x * 2.) - .08);
  float s = -xz.y + wk * wv, h = 0., d = 0.;
  for (int i = 0; i < 6; i++){ vec2 a = uExt[i], b = uExt[i + 1]; if (s > a.x && s <= b.x){ float w = b.x - a.x, t = (s - a.x) / w, c = .5 - .5 * cos(3.14159 * t), dc = .5 * 3.14159 * sin(3.14159 * t) / w;
      float up = step(a.y, b.y), q = mix(1. - c, c, up); h = min(a.y, b.y) + abs(b.y - a.y) * q * q; d = abs(b.y - a.y) * 2. * q * dc * (up * 2. - 1.); } }
  float env = 1. - smoothstep(150., 200., ax);
  return vec3(h, d, d * dw) * (hv * env);
}`,_e=`
uniform vec2 uCenter; varying vec3 vWp; varying vec2 vXZ; varying float vH;
`+te+Se+`
#define FADE(l) (1. - smoothstep(l * .25, l * .5, sp))
void main(){
  vec2 xz = position.xz + uCenter; float sp = .088 * length(position.xz);
  float A = seaAt(0., xz).a, h = 0.; vec2 sl = vec2(0.);
  ${Fe}
  vec3 r = roller(xz);
  vXZ = xz; vH = h;
  // the top of a roller leans back against the river's run (a lip): the water above 0.55 of the lowest crest is
  // carried up to 1.7 m upstream
  float lip = smoothstep(1.2, 2.3, r.x); lip *= lip * 1.7;
  vWp = vec3(xz.x - sl.x * 1.6, h + r.x, xz.y - sl.y * 1.6 + lip);
  gl_Position = projectionMatrix * viewMatrix * vec4(vWp, 1.);
}`,Pe=de.GLSL_NOISE+te+Le+Se+`
uniform vec4 uBoat; uniform vec4 uBow; uniform float uBoatK;
uniform vec4 uLampP[${ye}]; uniform vec4 uLampC; uniform vec4 uFunP[${be}]; uniform vec2 uReef;
uniform vec4 uBerg[${he}]; uniform vec4 uBergK[${he}]; uniform vec2 uBergS;
varying vec3 vWp; varying vec2 vXZ; varying float vH;
#define FADE(l) smoothstep(l * .55, l * .2, fp)
// sharp points lying under the surface, in cells of 'cell' metres; fp is the pixel's footprint in metres
float pointLayer(vec2 uv, float cell, float seed, float fp){
  vec2 g = uv / cell, c = floor(g), f = fract(g); vec2 o = hash22(c + seed) * .7 + .15; float b = hash12(c + seed + 3.1);
  float rad = .032 + .034 * b, px = fp / cell, r = length(f - o);
  float tw = .65 + .35 * sin(uTime * (.5 + b) + b * 31.);
  return smoothstep(rad + px, rad * .35, r) * min(1., rad * rad / max(px * px, 1e-5)) * step(.4, b) * tw;
}
void main(){
  vec2 xz = vXZ; vec3 wp = vWp;
  float fp = max(length(dFdx(xz)), length(dFdy(xz)));
  vec3 toEye = cameraPosition - wp; float dist = length(toEye); vec3 v = toEye / max(dist, 1e-3);
  // the join between two seas wanders: tongues of one water in the other
  float zt = seaS(xz + vec2(0., (fbmLo(xz * .011 + vec2(0., uTime * .006)) - .5) * 44.));
  vec4 deep = seaRowS(0., zt), crest = seaRowS(1., zt), foamR = seaRowS(2., zt), glow = seaRowS(3., zt), misc = seaRowS(7., zt), key = seaRowS(8., zt);
  vec3 amb = seaRowS(10., zt).rgb; vec3 kd = seaRowS(9., zt).xyz; kd /= max(length(kd), 1e-3);
  // rougher and calmer patches wander over every sea
  float A = seaAt(0., xz).a, chop = misc.a * (.5 + 1.0 * vnoise(xz * .043 + vec2(uTime * .012, -uTime * .008))), h = 0.; vec2 sl = vec2(0.);
  ${Fe}
  ${Ve}
  vec3 rl = roller(xz); sl.y -= rl.y; sl.x += rl.z;
  // two layers of ripples that keep their size in metres
  float rf = FADE(1.2);
  // (each layer drawn out across its own heading, so the bumps are short crests and not scales)
  vec2 q1 = vec2(xz.x * .8 + xz.y * .25, xz.y * 1.9 - xz.x * .3) + vec2(uTime * .23, -uTime * .31), q2 = vec2((xz.x - xz.y) * 1.5, (xz.x + xz.y) * 3.6) - vec2(uTime * .41, uTime * .19);
  vec2 q0 = vec2(xz.x * .3 - xz.y * .12, xz.y * .7 + xz.x * .1) + vec2(-uTime * .11, uTime * .17);
  sl += (vec2(vnoise(q1 + vec2(.3, 0.)) - vnoise(q1 - vec2(.3, 0.)), vnoise(q1 + vec2(0., .3)) - vnoise(q1 - vec2(0., .3))) * .15
       + vec2(vnoise(q2 + vec2(.3, 0.)) - vnoise(q2 - vec2(.3, 0.)), vnoise(q2 + vec2(0., .3)) - vnoise(q2 - vec2(0., .3))) * .1) * foamR.a * rf
     + vec2(vnoise(q0 + vec2(.3, 0.)) - vnoise(q0 - vec2(.3, 0.)), vnoise(q0 + vec2(0., .3)) - vnoise(q0 - vec2(0., .3))) * .2 * chop * FADE(3.2);
  vec3 n = normalize(vec3(-sl.x, 1., -sl.y));
  float nv = clamp(dot(n, v), 0., 1.);
  float rough = 1. - smoothstep(.05, 3., fp);
  float fres = (.02 + .98 * pow(1. - nv, 5.)) * mix(1., .22, misc.b) * mix(1., .4, misc.g) * mix(.55, 1., rough);
  vec3 r = reflect(-v, n); r.y = max(abs(r.y), .13); r = normalize(r);
  vec3 sky = skyCol(r, wp, 0.);
  // the body of the water: dark in the trough, the crest's colour where it is thin and where a face turns to the eye
  float hn = clamp(h / max(A, .05) * .5 + .5, 0., 1.), face = smoothstep(0., .35, dot(n.xz, v.xz));
  float thin = clamp(hn * hn * .35 + hn * face * .5, 0., 1.);
  vec3 body = mix(deep.rgb, crest.rgb, thin * .85) + glow.rgb * (.55 + .45 * hn);
  // a roller is a body: its faces shaded by the key that stands beyond the crest, its trough dark, and the light
  // coming through its top third where the eye looks toward the key
  float onRoll = step(1e-3, abs(rl.x) + abs(rl.y));
  float rkk = clamp(rl.x / 2.4, -1., 1.), rtop = smoothstep(.3, 1., rkk);
  vec3 nr = normalize(vec3(-rl.z * 2.5, 1., rl.y * 2.5));
  float rlit = smoothstep(.3, .95, dot(nr, kd)), back = smoothstep(-.3, .7, dot(-v.xz, kd.xz) / max(length(kd.xz), 1e-3));
  body = mix(body, body * mix(.42, 1.12, rlit) * (1. - .4 * smoothstep(0., -1., rkk)) + crest.rgb * rtop * rtop * (.3 + .75 * back), onRoll);
  // under the surface: star points, rainbow bands, phosphorus
  vec2 par = v.xz / max(v.y, .18);
  float isl = 0.;
  for (int i = 0; i < ${ie}; i++){ vec4 I = uIsl[i]; isl = max(isl, step(1., I.z) * smoothstep(1.25, .55, length(xz - I.xy) / max(I.z, 1.))); }
  float under = max(glow.a, isl), near = smoothstep(120., 30., dist);
  vec2 dr = vec2(sin(uTime * .05), cos(uTime * .04)) * 2.;
  float pts = pointLayer(xz - par * .8 + dr, 1.15, 1., fp) + .7 * pointLayer(xz - par * 2.2 - dr, 1.9, 5., fp) + .45 * pointLayer(xz - par * 4. + dr.yx, 3.1, 9., fp);
  vec3 gold = mix(vec3(1.6, 1.25, .62), vec3(1.3, 1.35, 1.45), misc.b);
  // (far off the points run together into a faint light of their own; the milk sea is lit already and takes less of it)
  vec3 sub = gold * under * (pts * near * 2.2 + (1. - near) * .16 * mix(1., .45, misc.b) + isl * .22);
  // the rainbows under the water: three long soft arcs lying beside the voyage on the open hand, 24, 36 and 52 m
  // wide with the whole spectrum across each, the nearest edge 16 m off, bowing outward as they run on toward the
  // sea-line (wide, because a band on the water is seen edge on from a boat)
  if (misc.r > .003){
    float off = uBow.z * (xz.x - uBow.x) + (vnoise(xz * .02 + uTime * .03) - .5) * 5., ds = -xz.y - uBow.y; vec3 arcs = vec3(0.);
    for (int i = 0; i < 3; i++){ float fi = float(i), hw = 12. + 6. * fi + 2. * fi * fi, c = 28. + 42. * fi + 12. * fi * fi + (.00016 + .00009 * fi) * ds * ds, t = (off - c) / hw;
      arcs += clamp(.55 + .6 * cos(6.2832 * (t * .36 + vec3(0., .33, .67))), 0., 1.2) * smoothstep(1., .55, abs(t)); }
    sub += arcs * misc.r * 1.6 * (.7 + .3 * vnoise(xz * .7 + uTime * .2));
  }
  float ph = smoothstep(.6, .9, vnoise(xz * .8 + vec2(uTime * .22, 0.))) * smoothstep(.35, .8, vnoise(xz * 4.1 - uTime * .7));
  sub += mix(vec3(1.6, 1.3, .25), vec3(.3, .8, 1.6), smoothstep(.35, .65, vnoise(xz * .21 + uTime * .13))) * ph * misc.g * 2.6 * FADE(2.);
  // the boat's own wash (foam along the hull and a wake astern)
  vec2 bq = xz - uBoat.xy; float lz = dot(bq, uBoat.zw), lx = bq.x * uBoat.w - bq.y * uBoat.z;
  float hw = 2.3 * sqrt(max(1. - pow(clamp((lz - 1.) / 4., 0., 1.), 2.3), 0.));
  float washD = abs(lx) - hw - max(-lz, 0.) * .32;
  float wash = uBoatK * smoothstep(1.6, .0, abs(washD)) * smoothstep(6.8, 4.6, lz) * smoothstep(-70., -4., lz);
  sub += mix(vec3(1.5, 1.25, .25), vec3(.3, .75, 1.5), smoothstep(-2., -30., lz)) * wash * misc.g * 1.2;
  // THE BERGS STAND IN THIS WATER AND THE WATER CARRIES THEM (uBerg: a berg's middle x, z and its half breadth and
  // half length at the waterline; uBergK: the cosine and sine of its turn, its height; a law of the bergs' own
  // places, read only between the first and the last of them along the voyage, uBergS). About each foot the ice
  // that lies under the water shows turquoise through it, out to its own width again beyond the waterline. And
  // where this water's mirrored ray passes a berg below its top, the water shows the berg and not the sky: its
  // shaded side dark blue, its sunlit side pale, broken by the ripples the ray is turned by; no road of light
  // lies on the water there (the suns' roads below are cut by the bergs).
  float bergM = 0., bergSun = 0.;
  if (-xz.y > uBergS.x && -xz.y < uBergS.y){
    vec2 bh = r.xz / max(length(r.xz), 1e-3); float brs = max(length(r.xz), .05), glw = 0.;
    for (int i = 0; i < ${he}; i++){ vec4 B = uBerg[i], K = uBergK[i]; if (B.z < .5) continue;
      vec2 c = wp.xz - B.xy, o = vec2(c.x * K.x - c.y * K.y, c.x * K.y + c.y * K.x) / B.zw, d = vec2(bh.x * K.x - bh.y * K.y, bh.x * K.y + bh.y * K.x) / B.zw;
      glw = max(glw, smoothstep(2., 1., length(o)));
      float ts = -dot(o, d) / max(dot(d, d), 1e-6), y = wp.y + ts * r.y / brs, thin = 1. - .45 * clamp(y / K.z, 0., 1.);
      float m = step(0., ts) * smoothstep(1.05, .8, length(o + d * ts) / thin) * (1. - smoothstep(.85 * K.z, 1.05 * K.z, y));
      if (m > bergM){ bergM = m; bergSun = smoothstep(-.2, .5, dot(-bh, kd.xz / max(length(kd.xz), 1e-3))); } }
    sub += vec3(.06, .5, .46) * glw * glw * (.75 + .25 * vnoise(xz * .9 + uTime * .15));
    sky = mix(sky, mix(vec3(.07, .18, .3), amb * 1.2 + key.rgb * .42, bergSun * .8) * (.82 + .18 * vnoise(vec2(xz.x * 1.7, xz.y * .5 - uTime * .3))), bergM);
  }
  vec3 col = mix(body + sub * (1. - fres * .75), sky, fres);
  // the key's glitter road
  float rk = clamp(dot(r, kd), 0., 1.);
  col += key.rgb * key.a * (pow(rk, 240.) * 3. + pow(rk, 28.) * .1) * rough * (1. - bergM);
  // the two mock suns lay their own roads on the ice sea's water (the table's row at the water's own place, as
  // the key's road is the water's own key): under a soft patch a broad dim glitter, no second sun's bar
  vec4 evw = seaRow(11., xz.y);
  if (evw.y > .001){ float ra = clamp(dot(r, uDogA), 0., 1.), rb = clamp(dot(r, uDogB), 0., 1.);
    col += vec3(.82, .88, 1.) * evw.y * key.a * ((pow(ra, 240.) + pow(rb, 240.)) * .35 + (pow(ra, 40.) + pow(rb, 40.)) * .1) * rough * (1. - bergM); }
  // the mirrored view ray of this water against each lantern: a road of light that lies from under the lamp toward
  // whoever looks, drawn out up and down by the ripples' slopes and wavering with them
  vec3 rm = vec3(-v.x, v.y, -v.z); float rml = max(length(rm.xz), 1e-3);
  if (-xz.y < uLampC.a){
    float wav = (vnoise(vec2(xz.x * .9 + uTime * .5, xz.y * .35 - uTime * .8)) - .5) * .09 + n.x * .22, road = 0.;
    float dash = smoothstep(.3, .62, vnoise(vec2(xz.x * 1.6, xz.y * 1.1 - uTime * .9))) * (.5 + .5 * vnoise(vec2(xz.x * 4., xz.y * 3. + uTime * 1.7)));
    for (int i = 0; i < ${ye}; i++){ vec4 Lp = uLampP[i]; vec3 tl = Lp.xyz - wp; float hl = max(length(tl.xz), 1e-3), dl = max(length(tl), 1e-3);
      float az = (rm.x * tl.z - rm.z * tl.x) / (rml * hl) + wav, el = tl.y / dl - rm.y;
      road += Lp.w * step(0., dot(rm.xz, tl.xz)) * exp(-az * az * 900.) * exp(-el * el * 9.) / (1. + dl * .012); }
    col += uLampC.rgb * road * (.25 + 1.3 * dash) * (1. - misc.b);
  }
  // and against each funnel of fire: a red-gold road on the dark swell
  if (evw.z > .01){
    float wav = n.x * .3, road = 0.;
    for (int i = 0; i < ${be}; i++){ vec4 Fp = uFunP[i]; vec3 tl = vec3(Fp.x, Fp.y, Fp.z) - wp; float hl = max(length(tl.xz), 1e-3), dl = max(length(tl), 1e-3);
      float az = (rm.x * tl.z - rm.z * tl.x) / (rml * hl) + wav, el = tl.y / dl - rm.y, wd = 14. / hl;
      road += Fp.w * step(0., dot(rm.xz, tl.xz)) * exp(-az * az / (wd * wd + .0009)) * exp(-el * el * 2.2) * smoothstep(900., 150., hl); }
    col += uFire.rgb * evw.z * road * (.2 + .5 * vnoise(vec2(xz.x * 1.3, xz.y * .9 - uTime * 1.1))) * rough;
  }
  // mirrors of the star islands: where the reflected ray passes a heap
  vec2 rh = r.xz / max(length(r.xz), 1e-3); float rs = length(r.xz);
  for (int i = 0; i < ${ie}; i++){ vec4 I = uIsl[i]; vec2 c = I.xy - wp.xz; float al = dot(c, rh), off = abs(c.x * rh.y - c.y * rh.x) / max(I.z, 1.);
    float y = wp.y + al * r.y / max(rs, .05), prof = 1. - smoothstep(.0, 1., off * 1.15); float top = I.w * prof * prof + 4.;
    float m = step(1., I.z) * step(0., al) * prof * smoothstep(top, top * .25, y) * (.55 + .45 * hash12(floor(vec2(off * 40., y * .7)) + floor(xz * 3.)));
    col += vec3(1.5, 1.2, .62) * m * .45 * fres; }
  // foam: born on the crests, ageing into lace; white where the rollers break and at their ends
  float lace = smoothstep(.42, .7, fbm(xz * .42 + vec2(uTime * .03, uTime * .05))) * (.55 + .45 * smoothstep(.3, .7, vnoise(xz * 2.6 + uTime * .1)));
  float patch_ = smoothstep(.7 - .32 * crest.a, .92, fbmLo(xz * .037 + vec2(uTime * .008, 0.)));
  float env = 1. - smoothstep(150., 200., abs(xz.x));
  // which lengths of a roller break: each crest breaks along some of its length and is glass along the rest; on the
  // reef's hand it breaks everywhere
  float reefW = smoothstep(-14., 10., (xz.x - uReef.x) * uReef.y) * step(.5, abs(uReef.y));
  float brk = max(smoothstep(.36, .6, vnoise(vec2(xz.x * .034 + 3., xz.y * .011 + uTime * .04))), reefW);
  float rfoam = 0., fshade = 1.;
  if (onRoll > .5){
    // the lip alone is thick white water (the top quarter metre of a crest, where that length of it breaks); from it
    // a net of foam (cells that keep their size in metres) runs out down the upper lee and thins away, and a thinner
    // lace slides back down the top of the river-side face. Between the threads the green body shows.
    float rc = rl.x / 2.2; vec3 vo = voronoi(vec2(xz.x, xz.y - uTime * 1.3 * sign(rl.y)) * .85 + fbmLo(xz * .31) * .8);
    float net = smoothstep(.13, .02, vo.y) * (.55 + .45 * vo.z);
    float lipF = smoothstep(.86, .99, rc + (vnoise(xz * 1.3 + vec2(0., uTime * .8)) - .5) * .12);
    float lee = smoothstep(.05, -.1, rl.y) * smoothstep(-.2, .9, rc), riv = smoothstep(-.02, .1, rl.y) * smoothstep(.55, .95, rc);
    rfoam = brk * (lipF + net * (lee * .7 + riv * .3)) + step(.02, env) * (1. - env) * smoothstep(.2, 1.5, abs(rl.x) / max(env, .05)) * 1.2;
    float bump = vnoise(xz * 2.3 + vec2(uTime * .3, 0.)) - vnoise(xz * 2.3 + vec2(uTime * .3, 0.) + kd.xz * .35);
    fshade = clamp(.72 + bump * 1.6 + .3 * rlit, 0., 1.);
  }
  float foam = clamp(smoothstep(.62, .98, hn) * crest.a * (.35 + .65 * lace) + patch_ * lace * crest.a + rfoam * (.45 + .55 * lace) + wash * (.5 + .5 * lace), 0., 1.) * mix(1., .6, 1. - rough);
  vec3 foamLit = foamR.rgb * (amb * 1.5 + key.rgb * (.4 + .35 * clamp(dot(n, kd), 0., 1.)) + glow.rgb * 1.2) * mix(vec3(.46, .64, .6), vec3(1.), fshade);
  col = mix(col, foamLit * (.82 + .18 * vnoise(xz * 3.3 + uTime * .2)), foam);
  // UNDER THE RED AIR THE WATER TAKES THE SAME BANKS as moving shade and glow, on its swell as it stands: the sea's
  // own face is a level sheet of the pattern, read at the water's own place by its longest folds alone (shade
  // under a bank, glow under a rift), as much as the air over that water is the red wall's. (The fog over it is
  // folded by the one law: seaFog.)
  float wrW = smoothstep(.09, .25, seaAt(6., xz).a);
  if (wrW > .004) col *= mix(1., mix(.62, 1.38, smoothstep(.64, .36, redTile(redFlat(xz) + vec2(3.1, 1.7)).b)), wrW);
  gl_FragColor = vec4(seaFog(col, wp, 0.), 1.);
}`;function Ye(e,n,t={}){const d=new Float32Array(47952),m=[];for(let i=0;i<=110;i++){const f=i===0?0:.4*Math.pow(1.0885,i);for(let w=0;w<144;w++){const p=w/144*Math.PI*2,S=(i*144+w)*3;d[S]=Math.cos(p)*f,d[S+2]=Math.sin(p)*f}}for(let i=0;i<110;i++)for(let f=0;f<144;f++){const w=i*144+f,p=i*144+(f+1)%144,S=w+144,z=p+144;m.push(w,S,p,p,S,z)}const h=new o.BufferGeometry;h.setAttribute("position",new o.BufferAttribute(d,3)),h.setIndex(m);const l={...e.uniforms,...n,uCenter:{value:new o.Vector2},uBoat:{value:new o.Vector4(0,9999,0,-1)},uBoatK:{value:0},uBow:{value:new o.Vector4(0,0,1,0)},uLampP:{value:Array.from({length:ye},()=>new o.Vector4(0,5,0,0))},uLampC:{value:new o.Vector4(0,0,0,-1e6)},uFunP:{value:Array.from({length:be},()=>new o.Vector4(0,40,0,0))},uReef:{value:new o.Vector2(0,0)},uBerg:{value:Array.from({length:he},()=>new o.Vector4(0,0,0,0))},uBergK:{value:Array.from({length:he},()=>new o.Vector4(1,0,1,0))},uBergS:{value:new o.Vector2(1e6,-1e6)}},b=new o.ShaderMaterial({uniforms:l,vertexShader:_e,fragmentShader:Pe,side:o.DoubleSide}),g=new o.Mesh(h,b);return g.frustumCulled=!1,g.renderOrder=-5,{mesh:g,uniforms:l,follow(i,f){l.uCenter.value.set(i,f)}}}function De(e,n,t,a){const u=t-e.x,d=a-e.z,m=Math.hypot(u,d),h=m/e.R;if(h>=1)return 0;const l=.5+.85*n.fbm2(t*.021+e.x*.37,a*.021-e.z*.11,3)+.25*n.ridged2(t*.06,a*.06);let b;if(e.ring){const i=(m-e.ring.crest)/(m<e.ring.crest?e.ring.crest-e.ring.inner:e.R-e.ring.crest);b=Math.max(0,1-i*i),b*=b}else b=Math.pow(1-Math.pow(h,1.6),1.5);let g=e.H*b*pe(l,.35,1.25);if(e.saddle&&d*e.saddle.dir>0){const i=Math.exp(-(u*u)/(e.saddle.half*e.saddle.half));g=N(g,Math.min(g,e.saddle.low*b),i)}return g}const je=.0056;async function Xe(e,n,t){const a=t.rng,u=e.noise,d=n.reduce((w,p)=>w+p.points,0),m=new Float32Array(d*3),h=new Float32Array(d*4);let l=0;for(const w of n){const p=w.ring?[w.ring.inner,w.R*1.05]:[0,w.R*.34];for(let S=0,z=0;S<w.points&&z<w.points*6;z++){const D=a()<w.column;let M,T,R;if(D){const H=a()*Math.PI*2,U=Math.pow(a(),1.9),I=Math.sqrt(N(p[0]*p[0],p[1]*p[1],a()));M=w.x+Math.cos(H)*I,R=w.z+Math.sin(H)*I,T=N(De(w,u,M,R)*.7,se,U)}else{const H=a()*Math.PI*2,U=w.R*Math.sqrt(a());M=w.x+Math.cos(H)*U,R=w.z+Math.sin(H)*U;const I=De(w,u,M,R);if(I<.6&&a()<.7)continue;T=a()<.62?I*(1-.1*a()*a()):I*Math.pow(a(),1.5)}if(t.clear&&!t.clear(M,T,R))continue;const G=l*3;m[G]=M,m[G+1]=T+.15,m[G+2]=R;const W=a()<.06,B=(w.far?2.4:1)*(W?a.range(.5,.8):a.range(.16,.36))*(D?1.25:1),L=t.lineDist?Math.min(B,je*t.lineDist(M,T,R)):B;h[l*4]=L,h[l*4+1]=a(),h[l*4+2]=a(),h[l*4+3]=(D?.6:1)*B/L,l++,S++,l%1500===0&&await e.yield()}await e.yield()}const b=new o.InstancedBufferGeometry;b.setAttribute("position",new o.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),b.setIndex([0,1,2,0,2,3]),b.setAttribute("aPos",new o.InstancedBufferAttribute(m.subarray(0,l*3),3)),b.setAttribute("aDat",new o.InstancedBufferAttribute(h.subarray(0,l*4),4)),b.instanceCount=l;const g={...t.seas.uniforms,uGain:{value:1}},i=new o.ShaderMaterial({uniforms:g,transparent:!0,depthWrite:!1,blending:o.AdditiveBlending,vertexShader:te+`
      attribute vec3 aPos; attribute vec4 aDat; uniform float uBufH; varying vec2 vUv; varying vec4 vCol;
      void main(){
        vec3 c = aPos; c.y += .5 * sin(uTime * .5 + c.x * .013 + c.z * .017) * smoothstep(40., 0., c.y);
        vec4 mv = viewMatrix * vec4(c, 1.); float d = max(-mv.z, .1);
        // a star is sized in metres (aDat.x, dealt at build). Anti-aliasing: it is never drawn thinner than the
        // drawing buffer can hold, its light thinned to match
        float px = 2. / (projectionMatrix[1][1] * max(uBufH, 1.)), want = aDat.x, size = max(want, d * px * 1.25), k = (want * want) / (size * size);
        float tw = .62 + .38 * sin(uTime * (.35 + aDat.y * .9) + aDat.z * 50.);
        vec3 tint = mix(vec3(1., .66, .16), vec3(1., .92, .7), aDat.z * aDat.z);
        vec3 col = tint * 1.9 * aDat.w * tw * k;
        vCol = vec4(col * seaDim(c, .2), 1.); vUv = position.xy;
        mv.xy += position.xy * size; gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`varying vec2 vUv; varying vec4 vCol; uniform float uGain;
      void main(){ float r = length(vUv); float a = smoothstep(1., .5, r); gl_FragColor = vec4(vCol.rgb * a * uGain, 1.); }`}),f=new o.Mesh(b,i);return f.frustumCulled=!1,f.renderOrder=6,{mesh:f,uniforms:g,count:l}}function Je(e,n,t,a){const u=new o.InstancedBufferGeometry;return u.setAttribute("position",new o.BufferAttribute(new Float32Array([0,0,.32,0,0,-.3,-1,0,-.12,0,0,.32,1,0,-.12,0,0,-.3]),3)),u.setAttribute("aA",new o.InstancedBufferAttribute(n,4)),u.setAttribute("aB",new o.InstancedBufferAttribute(t,4)),u.setAttribute("aC",new o.InstancedBufferAttribute(a,4)),u.instanceCount=e,u}function Ze(e,n,t,a={}){return new o.ShaderMaterial({uniforms:e,side:o.DoubleSide,...a,vertexShader:te+`
      attribute vec4 aA; attribute vec4 aB; attribute vec4 aC; uniform float uBufH; varying vec3 vCol;
      `+n+t+`
      void main(){
        vec3 fwd; float vis; vec3 c = birdPos(fwd, vis);
        fwd = normalize(fwd + vec3(0., 1e-4, 0.));
        vec3 side = cross(fwd, vec3(0., 1., 0.)); side = side / max(length(side), 1e-3) ; vec3 up = cross(side, fwd);
        float d = distance(cameraPosition, c), px = 2. / (projectionMatrix[1][1] * max(uBufH, 1.));
        float span = aC.x * .5, size = max(span, d * px * 1.5), k = pow(span / size, 1.2);
        size *= vis;
        float fl = sin(uTime * 6.2832 * aC.z + aC.y * 6.2832) * .95 + .15, w = position.x;
        vec3 p = c + fwd * (position.z * size) + (side * (w * cos(fl)) + up * (abs(w) * sin(fl))) * size;
        vCol = birdCol(.75 + .25 * sin(fl) * abs(w), c) * k * seaDim(c, .1);
        gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
      }`,fragmentShader:"varying vec3 vCol; void main(){ gl_FragColor = vec4(vCol, 1.); }"})}const Qe=`
vec3 birdPos(out vec3 fwd, out float vis){
  float HT = ${(se+12).toFixed(1)}, y = fract(aB.x + uTime * aB.y / HT) * HT + 2.2 * sin(uTime * .37 + aC.y * 6.2832);
  float up = smoothstep(0., 230., y), rho = mix(aA.z, aB.z, up), th = aA.w + aB.w * y * .004 + .12 * sin(y * .027 + aB.x * 40.);
  vis = smoothstep(0., 5., y) * smoothstep(HT, HT - 14., y);
  fwd = vec3(-sin(th) * aB.w * .45, 1., cos(th) * aB.w * .45);
  return vec3(aA.x + cos(th) * rho, y, aA.y + sin(th) * rho);
}`,et="vec3 birdCol(float shade, vec3 wp){ return mix(vec3(1.7, 1.05, .22), vec3(1.8, 1.5, .8), aC.w) * shade; }";async function tt(e,n,t){const a=t.rng,u=n.reduce((i,f)=>i+f.birds,0),d=new Float32Array(u*4),m=new Float32Array(u*4),h=new Float32Array(u*4);let l=0;for(const i of n){const f=Math.max(3,Math.round(i.birds/420)),w=i.ring?[i.ring.inner+4,i.R]:[i.R*.08,i.R*.36],p=i.rise||{},S=p.speed||[7,13],z=p.turn||[.5,1.6],D=p.wide||[.25,.8],M=p.from||[i.R*.55,i.R*1.2],T=t.clear&&t.clearNear?t.clearNear(i):null,R=!!T,G=t.clearTop*.004,W=256/6.2832,B=L=>{const H=d[L+3],U=m[L+3]*G,I=Math.floor((H-.13+Math.min(0,U))*W),ae=Math.floor((H+.13+Math.max(0,U))*W);let P=!1;for(let O=I;O<=ae&&!P;O++)P=T[(O%256+256)%256]===1;if(!P)return!0;for(let O=0;O<=t.clearTop;O+=1.5){const Q=H+m[L+3]*O*.004+.12*Math.sin(O*.027+m[L]*40),C=d[L+2]+(m[L+2]-d[L+2])*q(0,230,O);if(!t.clear(d[L]+Math.cos(Q)*C,O,d[L+1]+Math.sin(Q)*C))return!1}return!0};for(let L=0;L<f;L++){const H=a()*6.283,U=a(),I=a.range(S[0],S[1]),ae=a.sign()*a.range(z[0],z[1]),P=a.range(-.5,.5),O=a.range(M[0],M[1]),Q=a.range(w[0],w[1]),C=a.range(D[0],D[1]),X=Math.floor(i.birds/f);for(let ce=0;ce<X;ce++,l++){const _=a.gauss()*C,J=a.gauss()*.035,r=l*4;if(d[r]=i.x,d[r+1]=i.z,d[r+2]=O*(1+.1*a.gauss()),d[r+3]=H+_,m[r]=U+J+_*P*.08,m[r+1]=I,m[r+2]=Q*(1+.12*a.gauss()),m[r+3]=ae,h[r]=(i.far?1.6:1)*a.range(.42,.6),h[r+1]=a(),h[r+2]=a.range(4.5,7),h[r+3]=a()*a(),R){const v=d[r+3];for(let c=1;c<=40&&!B(r);c++)d[r+3]=v+(c%2?1:-1)*.2*Math.ceil(c/2)}l%1e3===999&&await e.yield()}}}const b={...t.seas.uniforms},g=new o.Mesh(Je(l,d.subarray(0,l*4),m.subarray(0,l*4),h.subarray(0,l*4)),Ze(b,Qe,et,{transparent:!0,depthWrite:!1,blending:o.AdditiveBlending}));return g.frustumCulled=!1,g.renderOrder=7,{mesh:g,uniforms:b,count:l}}function at(e,n){const t=[],a=[],u=[],d=[];for(const i of e){const f=t.length/3,w=i.pillar||{},p=i.door*Re*(w.width??1);for(let S=0;S<=28;S++){const z=S/28*Math.PI*2;for(const D of[0,se])t.push(i.x+Math.cos(z)*p,D,i.z+Math.sin(z)*p),a.push(i.x,i.z,p,i.far?1:.6),u.push(w.rise??9,w.low??.5)}for(let S=0;S<28;S++){const z=f+S*2;d.push(z,z+2,z+1,z+1,z+2,z+3)}}const h=new o.BufferGeometry;h.setAttribute("position",new o.Float32BufferAttribute(t,3)),h.setAttribute("aAxis",new o.Float32BufferAttribute(a,4)),h.setAttribute("aPil",new o.Float32BufferAttribute(u,2)),h.setIndex(d);const l={...n.seas.uniforms},b=new o.ShaderMaterial({uniforms:l,transparent:!0,depthWrite:!1,side:o.DoubleSide,forceSinglePass:!0,blending:o.AdditiveBlending,vertexShader:"attribute vec4 aAxis; attribute vec2 aPil; varying vec4 vAxis; varying vec2 vPil; varying vec3 vWp; void main(){ vAxis = aAxis; vPil = aPil; vWp = position; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.); }",fragmentShader:de.GLSL_HASH+de.GLSL_VALUE_NOISE+te+`varying vec4 vAxis; varying vec2 vPil; varying vec3 vWp;
      // one layer of sparkle on the cylinder: cells 3.4 m across, px the picture's footprint there in cells
      float sparkle(vec2 uv, float px){ vec2 c = floor(uv), f = fract(uv); vec2 o = hash22(c) * .7 + .15; float b = hash12(c + 2.7);
        return smoothstep(.07 + px, .02, length(f - o)) * min(1., .0049 / max(px * px, 1e-5)) * step(.5, b); }
      void main(){
        vec2 n = (vWp.xz - vAxis.xy) / max(vAxis.z, 1.); vec3 v = cameraPosition - vWp; float dh = length(v.xz); vec2 vh = v.xz / max(dh, 1e-3);
        // leave: half the line's chord over the radius, at the place where the ray leaves the cylinder (elsewhere
        // nothing is drawn); share: how much of that chord lies between the eye and this place
        float leave = -dot(n, vh);
        if (leave <= 0.) discard;
        float share = clamp(dh / max(2. * vAxis.z * leave, 1e-3), 0., 1.);
        // (the light is fuller in some places than others: a slow noise of the place round the pillar and the height)
        float ang = atan(n.y, n.x), yk = vWp.y / ${se.toFixed(1)};
        float thick = pow(clamp(leave, 0., 1.), 4.) * share * (.45 + .9 * vnoise(vec3(n * 1.7 + vAxis.xy * .1, vWp.y * .011 - uTime * .015)));
        float body = 2. * thick * (.016 + .1 * vPil.y * (1. - yk) * (1. - yk) + .12 * (1. - vPil.y) * yk * yk * yk);
        // (anti-aliasing: a spark smaller than the picture's own footprint at its place is drawn as wide as that, its light kept)
        vec2 uv = vec2(ang * vAxis.z, vWp.y - uTime * vPil.x) / 3.4; float px = max(length(dFdx(vWp)), length(dFdy(vWp))) / 3.4;
        float spark = (sparkle(uv, px) + sparkle(uv + vec2(41.3, 17.7 + uTime * vPil.x * .09), px)) * vAxis.w;
        vec3 col = vec3(1., .8, .42) * body + vec3(2.2, 1.6, .5) * spark * thick * 1.4;
        gl_FragColor = vec4(col * seaDim(vWp, .3), 1.);
      }`}),g=new o.Mesh(h,b);return g.frustumCulled=!1,g.renderOrder=5,{mesh:g,uniforms:l}}async function it(e,n={}){const t={bar:-9e3,crest:[-8970,-8915,-8860]},a={mood:.5,coastSide:-1,iceSide:1,swellK:1,fire:"#e2461a",river:{astern:[0,0,0]}},d=ge({bar:110,crest:[140,195,250],milk:250,green:340,violet:400,mist:590,ice:602.5,squall:720,wall0:750,wall1:775,star:880},a).pop(),m=Oe(t,a,[{...d,a:-1e5,b:1e5}]),h=Ke(),l=Ye(m,h),b=Ge({...m.uniforms,...h}),g={x:0,z:0,R:80,H:55,ring:{inner:45,crest:62},saddle:{dir:1,half:22,low:25},points:16e3,column:.14,birds:16e3,door:85};h.uDoors.value[0].set(0,0,85,1),m.uniforms.uIsl.value[0].set(0,0,80,55);const i=e.core.makeRng(e.core.hashSeed("hero:"+e.seed)),f=await Xe(e,[g],{rng:i,seas:m}),w=await tt(e,[g],{rng:i,seas:m}),p=at([g],{seas:m}),S=new o.Group;S.add(b,l.mesh,p.mesh,f.mesh,w.mesh);const z=new o.Vector2,D=new o.Vector3;return{object:S,radius:80,height:60,center:new o.Vector3(0,28,0),ground:!1,anchors:{portalSeat:new o.Vector3(0,46,0),saddleLine:[new o.Vector3(0,46,62),new o.Vector3(0,46,0)]},update(M,T,R){m.uniforms.uTime.value=T,D.setFromMatrixPosition(R.matrixWorld),l.follow(D.x,D.z),e.renderer&&(e.renderer.getDrawingBufferSize(z),m.uniforms.uBufH.value=z.y)}}}const lt=Se+`
float surfaceH(vec2 xz){
  float A = seaAt(0., xz).a, h = 0.;
  ${xe.map(([e,n,t,a])=>{const u=2*Math.PI/e;return`h += A * ${E(t)} * sin(${E(u)} * dot(vec2(${E(Math.sin(n))}, ${E(Math.cos(n))}), xz) - ${E(Math.sqrt(ue*u))} * uTime + ${E(a)});`}).join(`
  `)}
  return h + roller(xz).x;
}`;export{se as CEIL,lt as GLSL_FLOAT,$e as GLSL_REDAIR,te as GLSL_SEAS,Le as GLSL_SKY,ee as JOIN,he as NBERG,le as NDOOR,be as NFUN,ie as NISL,ye as NLAMP,Re as PILLAR,Be as RED_DEPTH,ve as ROLL_FLAT,He as SQUALL_DEPTH,je as STAR_NEAR,xe as SWELLS,Ce as WALL_CELLS,Je as birdGeometry,Ze as birdMaterial,it as buildHero,De as heapHeight,st as linear,at as makeColumns,tt as makeGoldenBirds,Ye as makeSea,Oe as makeSeas,Ge as makeSkyDome,Xe as makeStarIslands,ge as seaStops,We as seaTable,Ke as skyUniforms,qe as weatherAt};
