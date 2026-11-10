import*as c from"three";import{makePath as Fn,clamp as xt,lerp as lt,smoothstep as St,makeRng as Nn,hashSeed as Hn}from"../kit/core.js";const Vn=["#F3D9B8","#FFC766","#E8892B","#CFC3A8","#5E8F3A","#173A26","#0E6F8E"],gt=500,yt=320,F={x:0,z:120,r:45},Ra=1152,mo=1024,q=Math.PI*2,Ln=[[-109.061,31.313,367.076],[-93.05,30.2,351.6],[-79,30.6,336],[-62,37,290],[-30,57,202],[-15,35,160],[-8,21,134],[-4,9.5,110],[0,4.4,88],[6,4,60],[16,3.6,22],[11,3.5,-18],[15,3.5,-56],[0,3.5,-98],[-30,3.5,-128],[-66,3.5,-140],[-102,4,-131],[-130,5,-108],[-144,6.5,-75],[-146,8.5,-40],[-137,10,-5],[-121,8.5,30],[-92,6.8,46],[-64,5.2,58],[-42,4.5,74],[-30,4.2,96],[-30.5,4.4,120],[-38,5,142],[-80.75,7.5,259.5]],It=[{x:-130.5,z:-71.4,R:3.9,seed:3.1},{x:-149.5,z:21.5,R:6.4,seed:8.7,mother:!0}],ot={ax:10,az:44,bx:13,bz:-12,w:15,y:0},Ie=["9., 23.5","2.6","4., 27.5","2.3","-1.5, 31.5","3.","-7.5, 34.5","3.8"],_t=`
uniform sampler2D uMask;
uniform vec3 uSunDir, uSunH, uSunCol, uShade, uBounce, uSkyAmb, uHazeCol, uCam;
uniform vec4 uHall;   // x roof height, y haze density, z time, w 1/mask span
uniform vec4 uWx;     // x ground fog, y wet, z moss, w night
uniform vec4 uMist;   // x ground mist density, y strata in the haze, z sun caught by the mist, w dimming when seen from above the dome
uniform vec3 uMistCol;
uniform vec4 uOc;     // courtyard x, z, radius, how far the low sun reaches across its floor
uniform vec4 uRing;   // the exit ring: centre, strength of the light it throws on the arch and the floor round it
uniform vec3 uRingCol;
uniform vec4 uG1, uG2, uHol, uHolD;   // the giants (x, z, radius, depth of the shade pooled at the foot); the mother's hollow (x, z, radius, depth) and its axis (x, z, half length)
uniform vec4 uWrap;   // x glow of the sunward haze on whatever faces it, y warm rim on bark, z share of the haze laid on bark, w cool cast of the haze away from the sun
uniform vec4 uStage;  // x 1 while the camera is above the roof (the hall under the eave of the well is then in deep shade), y side light on bark, z depth tone of far bark, w spare
float hash11(float n){ return fract(sin(n * 127.1) * 43758.5453); }
float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y);
}
float fbm2(vec2 p){ return vnoise(p) * .55 + vnoise(p * 2.13 + 7.1) * .3 + vnoise(p * 4.7 + 3.3) * .15; }
// the rain pool: metres outside its ragged shore (negative over the water)
float poolD(vec2 p){
  vec2 a = vec2(${ot.ax.toFixed(1)}, ${ot.az.toFixed(1)}), ba = vec2(${(ot.bx-ot.ax).toFixed(1)}, ${(ot.bz-ot.az).toFixed(1)}), pa = p - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);
  float dc = length(pa - ba * h) - (${ot.w.toFixed(1)} + 6. * vnoise(p * .07 + 3.) + 2. * vnoise(p * .31));
  // a spit of mud runs out into it from the west shore, and ends in an islet
  float rg = 1.2 * vnoise(p * .45 + 7.) + .5 * vnoise(p * 1.3);
  float isl = min(min(length(p - vec2(${Ie[0]})) - ${Ie[1]} - rg, length(p - vec2(${Ie[2]})) - ${Ie[3]} - rg), min(length(p - vec2(${Ie[4]})) - ${Ie[5]} - rg, length(p - vec2(${Ie[6]})) - ${Ie[7]} - rg));
  return max(dc, -isl);
}
// the courtyard is open to the sky: sun on its floor on the side away from the sun, the rim's lumpy shadow on the near side
float courtSun(vec3 P){
  vec2 q = P.xz - uOc.xy;
  float inC = 1. - smoothstep(uOc.z - 2., uOc.z + 2.5, length(q));
  float edge = -dot(q, uSunH.xz) + uOc.z * uOc.w + (vnoise(q * .07 + 3.) - .5) * 24. + (vnoise(q * .31) - .5) * 6.;
  return inC * smoothstep(-1.7, 1.7, edge);
}
// direct sun reaching P: the mask at P slid along the sun to roof height, flickered by moving leaves
float sunVis(vec3 P){
  float t = max(uHall.x - P.y, 0.) / max(uSunDir.y, .03);
  t += (vnoise(P.xz * .43 + P.y * .29) - .5) * 9. + (vnoise(P.xz * 1.9 + P.y * 1.3) - .5) * 2.5;
  vec2 q = P.xz + uSunDir.xz * t;
  float m = texture2D(uMask, q * uHall.w + .5, 1.2).r;
  float fl = .7 + .3 * vnoise(q * .33 + vec2(uHall.z * .21, uHall.z * .13));
  float brk = .3 + .7 * smoothstep(.28, .62, vnoise(P.xz * 1.15 + P.y * 1.7 + 3. + uHall.z * vec2(.3, .21)));     // leaf shadows break the bars up
  return max(m * fl * brk, courtSun(P));
}
// open sky straight overhead, blurred (pools of cool light under gaps, the courtyard, the rim)
float skyVis(vec3 P){ return texture2D(uMask, P.xz * uHall.w + .5, 3.5).r; }
float footShade(vec3 P){     // whatever is as big as a giant stands in a pool of its own shade; the hollow is dark inside
  float low = 1. - smoothstep(1., 9., P.y);
  float a = uG1.w * (1. - smoothstep(uG1.z * .9, uG1.z * 2.3, length(P.xz - uG1.xy))) + uG2.w * (1. - smoothstep(uG2.z * .9, uG2.z * 2.1, length(P.xz - uG2.xy)));
  return 1. - min(a, .6) * low;
}
float hollowIn(vec3 P){      // inside the mother's hollow: no sun, hardly any sky
  vec2 hd = P.xz - uHol.xy; float al = clamp(dot(hd, uHolD.xy), -uHolD.z, uHolD.z);
  return uHol.w * (1. - smoothstep(uHol.z * .6, uHol.z, length(hd - uHolD.xy * al))) * (1. - smoothstep(7.5, 11., P.y));
}
vec3 hallLight(vec3 P, vec3 N, float ao){
  float hol = hollowIn(P);
  ao *= footShade(P) * (1. - .8 * hol);
  float sv = sunVis(P) * (1. - hol), kv = skyVis(P);
  float ndl = dot(N, uSunDir);
  float dif = clamp(ndl * .8 + .2, 0., 1.);
  vec3 amb = uShade * (.62 + .38 * N.y) + uBounce * (.5 - .5 * N.y) + uSkyAmb * kv * (.55 + .45 * N.y);
  vec3 rd = P - uRing.xyz; float rk = uRing.w / (1. + dot(rd, rd) * .011);
  float wr = max(dot(N, uSunH), 0.);
  vec3 inHol = uBounce * hol * (.5 + .5 * max(dot(N.xz, uHolD.xy), 0.)) * 1.5 * (1. - uWx.w * .6);      // the hollow's own light: day bounced in off the litter at its mouth, warm on whatever faces out
  return uSunCol * sv * dif + amb * ao + inHol + uSunCol * uWrap.x * wr * wr * (.4 + .6 * ao) * (1. - hol) + uRingCol * rk * (.6 + .4 * dot(N, -rd / max(length(rd), 1e-3)));
}
vec3 hallHaze(vec3 col, vec3 P){
  vec3 v = P - uCam; float d = length(v); vec3 vd = v / max(d, 1e-3);
  float s = max(dot(vd, uSunH), 0.), kv = skyVis(P), t = uHall.z;
  // strata: the haze lies in soft layers between the trunks (misty weather only)
  float strata = 1. + uMist.y * (vnoise(vec2(P.y * .45 + vnoise(P.xz * .013 + 5.) * 3.5, t * .012 + P.x * .004)) - .42) * 1.7;
  strata *= 1. - uMist.y * .6 * smoothstep(3., 13., P.y);          // mist is a thing of the floor: the roof stays dark and green
  float ro = length(P.xz - uOc.xy);
  float cw = uStage.w * smoothstep(uOc.z - 3., uOc.z + 7., ro) * (1. - smoothstep(13., 19., P.y)) * smoothstep(18., 55., d);      // from the open court the hall under the eave is seen through clear air, in the roof's shade
  float h = (1. - exp(-d * uHall.y * max(strata, .25))) * (1. - .72 * cw);
  float away = 1. - smoothstep(-.35, .55, dot(vd, uSunH));
  vec3 hc = uHazeCol * mix(vec3(1.), vec3(.74, .98, 1.1), uWrap.w * away) * (1. + .5 * kv) + uSunCol * .045 * s * s * s;
  // the deep hall, far from the light well: the air between the trunks is leaf-shade, greener and darker than the mist by the well
  hc *= mix(vec3(1.), vec3(.6, .84, .64), smoothstep(uOc.z + 95., uOc.z + 165., ro) * (1. - uWx.w));
  col = mix(col, hc, h);
  if (uMist.x > 0.) {
    // ground mist: an exponential layer on the floor, integrated along the line of sight, so the litter shows through
    // under us and the far pillars stand in a bright floor; patchy, drifting, torn where our wings pass
    float y0 = max(uCam.y, 0.), y1 = max(P.y, 0.), dy = y1 - y0;
    float e0 = exp(-y0 / 1.4), e1 = exp(-y1 / 1.4);
    float avg = abs(dy) > .05 ? 1.4 * (e0 - e1) / dy : e0;
    vec2 mp = P.xz;
    float ptc = vnoise(mp * .045 + vec2(t * .02, -t * .013)) * .5 + vnoise(mp * .13 + vec2(-t * .04, t * .03)) * .28 + vnoise(mp * vec2(.47, .21) + vec2(t * .07, -t * .05)) * .22;   // banks, patches, wisps
    float tear = smoothstep(2., 13., length(mp - uCam.xz));
    float tau = uMist.x * d * avg * (.03 + 2.1 * ptc * ptc * ptc) * (.25 + .75 * tear);
    tau *= 1. - .75 * (1. - smoothstep(uOc.z - 8., uOc.z + 6., length(mp - uOc.xy)));      // burnt off where the courtyard is open to the sun
    float gf = (1. - exp(-tau)) * (1. - .55 * smoothstep(.08, .45, -vd.y)) * (1. - .75 * uStage.x) * (1. - .72 * cw);     // looked down on, a thin layer shows the floor through it
    float lit = texture2D(uMask, (mp + uSunDir.xz * ((uHall.x - 1.5) / max(uSunDir.y, .03))) * uHall.w + .5, 2.5).r;
    lit = max(lit, courtSun(P));
    vec3 mc = uMistCol * (.6 + .4 * kv) + uSunCol * uMist.z * (lit * (.4 + .6 * s * s) + .1 * s * s);
    col = mix(col, mc, gf * .92);
  }
  col *= mix(vec3(1.), vec3(.6, .7, .62), cw);
  float eave = uStage.x * smoothstep(uOc.z - 1., uOc.z + 5., ro) * (1. - smoothstep(uOc.z + 45., uOc.z + 95., ro)) * (1. - smoothstep(13., 19., P.y));
  return col * uMist.w * mix(vec3(1.), vec3(.3, .4, .43), eave);      // from the air, whatever stands under the eave of the well is in the roof's shade
}
`,ue=`#include <fog_pars_vertex>
`,ae=`#include <fog_pars_fragment>
`;function Un(G){return new c.Color(G)}function Tt(G,ft,T){return G.clone().lerp(ft,T)}class ze{constructor(){this.p=[],this.n=[],this.u=[],this.c=[],this.i=[],this.count=0}v(ft,T,qt,ct,wt,pe,le,ne,se,Gt,pt){return this.p.push(ft,T,qt),this.n.push(ct,wt,pe),this.u.push(le,ne),this.c.push(se,Gt,pt),this.count++}quad(ft,T,qt,ct){this.i.push(ft,T,qt,ft,qt,ct)}geometry(){const ft=new c.BufferGeometry;return ft.setAttribute("position",new c.BufferAttribute(new Float32Array(this.p),3)),ft.setAttribute("normal",new c.BufferAttribute(new Float32Array(this.n),3)),ft.setAttribute("uv",new c.BufferAttribute(new Float32Array(this.u),2)),ft.setAttribute("color",new c.BufferAttribute(new Float32Array(this.c),3)),ft.setIndex(new c.BufferAttribute(new Uint32Array(this.i),1)),ft}async geometryY(ft){const T=new c.BufferGeometry;return T.setAttribute("position",new c.BufferAttribute(new Float32Array(this.p),3)),await ft.yield(),T.setAttribute("normal",new c.BufferAttribute(new Float32Array(this.n),3)),await ft.yield(),T.setAttribute("uv",new c.BufferAttribute(new Float32Array(this.u),2)),T.setAttribute("color",new c.BufferAttribute(new Float32Array(this.c),3)),await ft.yield(),T.setIndex(new c.BufferAttribute(new Uint32Array(this.i),1)),await ft.yield(),T}}function Bt(G,ft,T,qt,ct,wt,pe,le,ne){const se=qt.length,Gt=G.count,pt=[0,0,0],zt=[0,0,0];for(let tt=0;tt<se;tt++){const vt=qt[tt];ft(vt,pt),ft(Math.min(1,vt+.02),zt);let rt=zt[0]-pt[0],it=zt[1]-pt[1],E=zt[2]-pt[2];rt*rt+it*it+E*E<1e-10&&(ft(Math.max(0,vt-.02),zt),rt=pt[0]-zt[0],it=pt[1]-zt[1],E=pt[2]-zt[2]);const At=Math.hypot(rt,it,E)||1;rt/=At,it/=At,E/=At;let Dt,J,Q;Math.abs(it)>.8?(Dt=1-rt*rt,J=-rt*it,Q=-rt*E):(Dt=-it*rt,J=1-it*it,Q=-it*E);const ie=Math.hypot(Dt,J,Q)||1;Dt/=ie,J/=ie,Q/=ie;const Pe=it*Q-E*J,xe=E*Dt-rt*Q,Ft=rt*J-it*Dt;for(let fe=0;fe<=ct;fe++){const Nt=fe/ct*q,et=Math.cos(Nt),Z=Math.sin(Nt),Ct=T(vt,Nt),at=et*Dt+Z*Pe,_e=et*J+Z*xe,He=et*Q+Z*Ft,ye=wt(vt,Nt);G.v(pt[0]+at*Ct,pt[1]+_e*Ct,pt[2]+He*Ct,at,_e,He,fe/ct*pe,vt*le,ye[0],ye[1],ye[2])}}const Xt=ct+1;for(let tt=0;tt<se-1;tt++)for(let vt=0;vt<ct;vt++){const rt=Gt+tt*Xt+vt;G.quad(rt,rt+1,rt+Xt+1,rt+Xt)}if(ne){const tt=G.p,vt=G.n;for(let rt=0;rt<se;rt++)for(let it=0;it<=ct;it++){const E=it===ct?0:it,At=(Gt+rt*Xt+it)*3,Dt=(Gt+rt*Xt+(E===0?ct-1:E-1))*3,J=(Gt+rt*Xt+E+1)*3,Q=(Gt+Math.max(0,rt-1)*Xt+it)*3,ie=(Gt+Math.min(se-1,rt+1)*Xt+it)*3,Pe=tt[J]-tt[Dt],xe=tt[J+1]-tt[Dt+1],Ft=tt[J+2]-tt[Dt+2],fe=tt[ie]-tt[Q],Nt=tt[ie+1]-tt[Q+1],et=tt[ie+2]-tt[Q+2];let Z=xe*et-Ft*Nt,Ct=Ft*fe-Pe*et,at=Pe*Nt-xe*fe;const _e=Math.hypot(Z,Ct,at);if(_e<1e-9)continue;const He=(Z*vt[At]+Ct*vt[At+1]+at*vt[At+2]<0?-1:1)/_e;vt[At]=lt(vt[At],Z*He,ne),vt[At+1]=lt(vt[At+1],Ct*He,ne),vt[At+2]=lt(vt[At+2],at*He,ne);const ye=Math.hypot(vt[At],vt[At+1],vt[At+2])||1;vt[At]/=ye,vt[At+1]/=ye,vt[At+2]/=ye}}}function Dn(G,ft,T,qt,ct,wt,pe,le,ne,se){const Gt=pe.length,pt=le.length,zt=new Float32Array(Gt*pt*3),Xt=new Float32Array(Gt*pt*3),tt=G.count,vt=le[0];for(let rt=0;rt<Gt;rt++)for(let it=0;it<pt;it++){const E=le[it],At=wt(pe[rt],E),Dt=ne(pe[rt],E),J=(rt*pt+it)*3;zt[J]=ft+Math.cos(E)*At,zt[J+1]=qt+pe[rt]*ct,zt[J+2]=T+Math.sin(E)*At,Xt[J]=Dt[0],Xt[J+1]=Dt[1],Xt[J+2]=Dt[2]}for(let rt=0;rt<Gt;rt++)for(let it=0;it<pt;it++){const E=(rt*pt+it)*3,At=(rt*pt+(it===0?pt-2:it-1))*3,Dt=(rt*pt+(it===pt-1?1:it+1))*3,J=(Math.max(0,rt-1)*pt+it)*3,Q=(Math.min(Gt-1,rt+1)*pt+it)*3,ie=zt[Dt]-zt[At],Pe=zt[Dt+1]-zt[At+1],xe=zt[Dt+2]-zt[At+2],Ft=zt[Q]-zt[J],fe=zt[Q+1]-zt[J+1],Nt=zt[Q+2]-zt[J+2];let et=fe*xe-Nt*Pe,Z=Nt*ie-Ft*xe,Ct=Ft*Pe-fe*ie;const at=Math.hypot(et,Z,Ct)||1;et/=at,Z/=at,Ct/=at,G.v(zt[E],zt[E+1],zt[E+2],et,Z,Ct,(le[it]-vt)/q*se,pe[rt]*ct,Xt[E],Xt[E+1],Xt[E+2])}for(let rt=0;rt<Gt-1;rt++)for(let it=0;it<pt-1;it++){const E=tt+rt*pt+it;G.quad(E,E+pt,E+pt+1,E+1)}}async function _n(G,ft={}){const T=G.rng.fork("banyan-hall"),qt=G.noise,ct=t=>Nn(Hn("banyan-"+t+":"+G.seed)),wt=G.quality?.detail??1,pe=(ft.palette&&ft.palette.length>=7?ft.palette:Vn).map(Un),[le,ne,se,Gt,pt,zt,Xt]=pe,tt=ft.hour==="day"?"day":ft.hour==="night"?"night":"sunrise",vt=ft.season==="figs"?"figs":ft.season==="monsoon"?"monsoon":"flush",rt=ft.weather==="fog"?"fog":ft.weather==="shower"?"shower":"clear",it=xt(ft.density??1,.8,1.2),E=new c.Group;E.name="banyan-hall";const At=(tt==="night"?262:tt==="day"?102:96)*Math.PI/180,Dt=(tt==="night"?11:tt==="day"?28:8)*Math.PI/180,J=ft.sunDir?ft.sunDir.clone().normalize():new c.Vector3(Math.sin(At)*Math.cos(Dt),Math.sin(Dt),-Math.cos(At)*Math.cos(Dt));J.y<.05&&(J.y=.05,J.normalize());const Q=new c.Vector3(J.x,0,J.z);Q.lengthSq()<1e-6&&Q.set(1,0,0),Q.normalize();const ie=new c.Color(1,1,1),Pe=tt==="night"?new c.Color(.55,.7,1).multiplyScalar(2.1):tt==="day"?Tt(ne,ie,rt==="fog"?.3:.5).multiplyScalar(rt==="fog"?3:3.3):Tt(ne,ie,.3).multiplyScalar(2.5),xe=tt==="night"?new c.Color(.5,.66,1):tt==="day"?Tt(ne,ie,rt==="fog"?.14:.4):Tt(ne,le,.25),Ft=16,fe=Ln.map(t=>t.slice()),Nt=ft.path||Fn(fe),et=560,Z=new Float32Array(et+1),Ct=new Float32Array(et+1),at=new Float32Array(et+1);{const t=new c.Vector3;for(let e=0;e<=et;e++)Nt.pointAt(e/et,t),Z[e]=t.x,Ct[e]=t.y,at[e]=t.z}const _e=1-128/Nt.length,He=(()=>{const t=It[1],e=[.672,.688,.704].map(a=>Nt.pointAt(a));return(a,d,b)=>{for(const y of e){const o=t.x-y.x,s=t.z-y.z,r=xt(((a-y.x)*o+(d-y.z)*s)/(o*o+s*s),0,1);if(Math.hypot(a-y.x-o*r,d-y.z-s*r)<b)return!0}return!1}})(),ye={d:0,i:0};function Zt(t,e){let a=1e12,d=0;for(let b=0;b<=et;b++){if(Ct[b]>13)continue;const y=Z[b]-t,o=at[b]-e,s=y*y+o*o;s<a&&(a=s,d=b)}return ye.d=Math.sqrt(a),ye.i=d,ye}function dt(t,e,a){let d=1e12;for(let b=0;b<=et;b+=2){const y=Z[b]-t,o=Ct[b]-e,s=at[b]-a,r=y*y+o*o+s*s;r<d&&(d=r)}return Math.sqrt(d)}const de=(()=>{for(let t=0;t<=et;t++)if(Ct[t]<13)return t;return 0})(),Xe=T.range(0,500),Lt=(t,e)=>Math.sqrt(t/gt*(t/gt)+e/yt*(e/yt)),kt=(t,e)=>Math.hypot(t-F.x,e-F.z),bt=(t,e)=>.16+.14*qt.n2(t*.021+Xe,e*.021),Ve=It[0],no=It[1],go=no.x-Ve.x,po=no.z-Ve.z,Ia=go*go+po*po,Ro=(t,e)=>{const a=xt(((t-Ve.x)*go+(e-Ve.z)*po)/Ia,-.12,1.12);return 1-St(16,56,Math.hypot(t-Ve.x-go*a,e-Ve.z-po*a))},xo=(t,e)=>Math.min(Math.hypot(t-Ve.x,e-Ve.z)-Ve.R,Math.hypot(t-no.x,e-no.z)-no.R),Ke=(t,e)=>{const a=ot.bx-ot.ax,d=ot.bz-ot.az,b=xt(((t-ot.ax)*a+(e-ot.az)*d)/(a*a+d*d),0,1);return ot.w+4-Math.hypot(t-ot.ax-a*b,e-ot.az-d*b)},Ht=(t,e)=>16.2+3.2*qt.fbm2(t*.011+Xe,e*.011-4,3)+7.5*Ro(t,e);function Ze(t,e,a=26){const d=Math.floor(t/a),b=Math.floor(e/a);let y=9;for(let s=-1;s<=1;s++)for(let r=-1;r<=1;r++){const f=d+s,g=b+r,u=Math.sin(f*127.1+g*311.7+Xe)*43758.5453,w=Math.sin(f*269.5+g*183.3+Xe*1.7)*43758.5453,i=(f+.15+.7*(u-Math.floor(u)))*a,l=(g+.15+.7*(w-Math.floor(w)))*a,v=.3+.2*(u*7.13-Math.floor(u*7.13)),m=((t-i)*(t-i)+(e-l)*(e-l))/(a*a*v);m<y&&(y=m)}const o=Math.max(0,1-y);return .35*o+.65*Math.sqrt(o)}function Ot(t,e){const a=Math.min(Lt(t,e),1),d=a*a,b=Math.pow(Math.max(0,1-d*d*d),.42),y=Math.abs(qt.n2(t/62+Xe,e/62+9)),o=Ze(t,e);let s=(1-y)*3.4-2.2+6.6*o+1.5*Ze(t+40,e-17,9.5)*(.35+.65*o)+.6*qt.n2(t/19-3,e/19+Xe);const r=Math.hypot(t-F.x,e-F.z),f=1-St(F.r+8,F.r+62,r);if(f>0){const g=-(e-F.z)/Math.max(r,1);s+=f*(g>0?3.2*g:3.4*g)}return 9+b*(17+s+6.5*Ro(t,e))}const _a=Math.min(J.y/Math.max(.001,Math.hypot(J.x,J.z))*1.6,.26)/1.6,Oa=[5,11,19,30,46],yo=new c.Vector3(Q.x,Math.min(J.y/Math.max(.001,Math.hypot(J.x,J.z)),.27),Q.z).normalize(),Ta=(t,e)=>Lt(t,e)>1||kt(t,e)<F.r?0:Ot(t,e);function je(t,e,a){let d=-9;for(let b=0;b<5;b++){const y=Oa[b],o=Ta(t+Q.x*y,a+Q.z*y)-(e+y*_a*1.6);o>d&&(d=o)}return 1-St(-.8,1.8,d)}const wo=[0,0,0];function ea(t,e,a){const d=(Ot(t+4,a)-Ot(t-4,a))/8,b=(Ot(t,a+4)-Ot(t,a-4))/8,y=Math.hypot(d,1,b),o=je(t,e,a),s=(-d*yo.x+yo.y-b*yo.z)/y;return wo[0]=o,wo[1]=St(-.12,.5,s)*lt(.05,1,o),wo[2]=Ze(t,a),wo}const me={x:-138+.25*T.range(-8,8),z:-24+.25*T.range(-10,10),r:74},Io=(t,e)=>St(me.r,me.r*.35,Math.hypot(t-me.x,e-me.z)),ge=Math.atan2(me.z-It[1].z,me.x-It[1].x);function Se(t,e){const a=xt(Math.round(t*et),0,et-1),d=Z[a+1]-Z[a],b=at[a+1]-at[a],y=Math.hypot(d,b)||1;return[Z[a]-b/y*e,at[a]+d/y*e]}const Ga=[["chital",.415,-9.5,0],["peacockA",.53,6.5,0],["peacockB",.437,6.2,0],["langurs",.563,0,4],["glider",.79,0,3]],_o={chital:12,peacockA:4.6,peacockB:4.6,chital2:7.5},ve={},$a=(t,e=6)=>{const a=xt(t-e,0,et),d=xt(t+e,0,et),b=Z[t]-Z[a],y=at[t]-at[a],o=Z[d]-Z[t],s=at[d]-at[t];return Math.atan2(b*s-y*o,b*o+y*s)},Oo=Zt(It[0].x,It[0].z).i,oa=$a(Oo)<0?-1:1,we=Zt(me.x,me.z).i,qa=[["chital2",.46,11,.7,7.5,9],["batBough",we/et,0,Ct[we]+3.6,10,5]],re=[];{const t=J.y/Math.max(.001,Math.hypot(J.x,J.z)),e=vt==="monsoon"?30:15,a=(o,s)=>Lt(o,s)<.94&&kt(o,s)>F.r+9;let d=0,b=de+26;for(;b<et-2;){const o=[Z[b],Ct[b],at[b]],s=Z[b+1]-Z[b],r=at[b+1]-at[b],f=Math.hypot(s,r)||1,g=T.range(-9,9),u=T.range(1,7.5),w=o[0]-r/f*g,i=o[2]+s/f*g,l=(Ft-u)/t,v=w+Q.x*l,m=i+Q.z*l,p=T.chance(.45);a(v,m)&&re.push({gx:v,gz:m,a:p?T.range(1.6,3.2):T.range(3.5,8),b:p?T.range(7,15):T.range(2.2,4.5),I:T.range(.7,1.15)*(vt==="monsoon"?1.5:1)}),d=T.range(e*.85,e*1.5),b+=Math.max(2,Math.round(d/(Nt.length/et)))}for(const o of Ga){const s=Se(o[1],o[2]);ve[o[0]]=new c.Vector3(s[0],bt(s[0],s[1])+o[3],s[1]);const r=(Ft-1-o[3])/t,f=s[0]+Q.x*r,g=s[1]+Q.z*r;a(f,g)&&re.push(o[0]==="chital"?{gx:f,gz:g,a:9,b:xt(1.4/t,8,13),I:1.05}:o[0].startsWith("peacock")?{gx:f,gz:g,a:6.5,b:xt(1.7/t,5.5,15),I:1.15}:{gx:f,gz:g,a:5.5,b:5,I:1.1})}for(const o of It){let s=(Ft-8.5)/t+o.R,r=o.x+Q.x*s,f=o.z+Q.z*s,g=o.R*1.6;if(o.mother){const u=-Q.z,w=Q.x,i=(Math.cos(ge)*u+Math.sin(ge)*w)*o.R;g=o.R*.42;const l=xt(i-(i<0?-1:1)*(g+2.9),-o.R*.7,o.R*.7);s=(Ft-7)/t+o.R*.95,r=o.x+Q.x*s+u*l,f=o.z+Q.z*s+w*l}a(r,f)&&re.push({gx:r,gz:f,a:g,b:xt(5.5/t,9,28),I:o.mother?1.15:1.1})}for(let o=_e*Nt.length+16;o<Nt.length-4;o+=32){const s=xt(Math.round(o/Nt.length*et),0,et),r=(Ft-.5)/t,f=Z[s]+Q.x*r,g=at[s]+Q.z*r;a(f,g)&&re.push({gx:f,gz:g,a:3.2,b:xt(1.2/t,4,9),I:.95,av:1,x:1})}const y=vt==="monsoon"?8:26;for(let o=0;o<y;o++){const s=T.int(de+20,et-1),r=T.range(0,q),f=T.range(22,110),g=Z[s]+Math.cos(r)*f+Q.x*60,u=at[s]+Math.sin(r)*f+Q.z*60;a(g,u)&&re.push({gx:g,gz:u,a:T.range(2.5,7),b:T.range(2.5,9),I:T.range(.5,1)})}for(const o of qa){const s=Se(o[1],o[2]);ve[o[0]]=new c.Vector3(s[0],bt(s[0],s[1])+o[3],s[1]);const r=(Ft-o[3])/t,f=s[0]+Q.x*r,g=s[1]+Q.z*r;a(f,g)&&re.push({gx:f,gz:g,a:o[4],b:xt(o[5]*.14/t,o[5]*.6,o[5]*1.5),I:1.12,x:1})}}await G.yield();const bo=document.createElement("canvas");bo.width=bo.height=mo;let Mo=()=>{};{const t=bo.getContext("2d"),e=mo/Ra,a=mo/2;t.fillStyle="#fff",t.fillRect(0,0,mo,mo),t.fillStyle="#000",t.beginPath(),t.ellipse(a,a,gt*.985*e,yt*.985*e,0,0,q),t.fill();const d=(o,s,r,f,g,u)=>{t.save(),t.translate(a+o*e,a+s*e),t.rotate(u),t.scale(Math.max(1.2,f*e),Math.max(1.2,r*e));const w=t.createRadialGradient(0,0,0,0,0,1);w.addColorStop(0,`rgba(255,255,255,${g})`),w.addColorStop(.62,`rgba(255,255,255,${g})`),w.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=w,t.beginPath(),t.arc(0,0,1,0,q),t.fill(),t.restore()};d(F.x,F.z,F.r+3,F.r+3,1,0);for(let o=0;o<70;o++){const s=T.range(0,q),r=F.r+T.range(-2,5);d(F.x+Math.cos(s)*r,F.z+Math.sin(s)*r,T.range(2,6),T.range(2,6),.9,0)}const b=Math.atan2(Q.z,Q.x);await G.yield();for(const o of re)d(o.gx,o.gz,o.a,o.b,Math.min(1,o.I),b);Mo=o=>d(o.gx,o.gz,o.a,o.b,Math.min(1,o.I),b),await G.yield();const y=vt==="monsoon"?60:280;for(let o=0;o<y;o++){const s=T.int(de,et),r=T.range(0,q),f=T.range(0,170),g=Z[s]+Math.cos(r)*f+Q.x*70,u=at[s]+Math.sin(r)*f+Q.z*70;d(g,u,T.range(1.2,3.2),T.range(1.5,4.5),T.range(.4,.85),T.range(0,3)),(o&31)===31&&await G.yield()}}const Le=new c.CanvasTexture(bo);Le.flipY=!1,Le.wrapS=Le.wrapT=c.ClampToEdgeWrapping,Le.minFilter=c.LinearMipmapLinearFilter,Le.magFilter=c.LinearFilter,Le.generateMipmaps=!0,Le.colorSpace=c.NoColorSpace,await G.yield();const jt=tt==="night"?1:0,Ka=jt?new c.Color(.078,.108,.17):Tt(zt,new c.Color(.4,.55,.72),.72).multiplyScalar(.78),ja=jt?new c.Color(.034,.044,.064):Tt(se,le,.45).multiplyScalar(.36),Wa=jt?new c.Color(.11,.16,.28):Tt(le,new c.Color(.6,.85,.95),.5).multiplyScalar(.5),To=jt?new c.Color(.045,.07,.115):Tt(Tt(pt,zt,.45),new c.Color(.72,.78,.62),.32).multiplyScalar(.6),Ue=rt==="fog",aa=jt?new c.Color(.1,.14,.22):tt==="day"?new c.Color(.4,.43,.36):Tt(le,new c.Color(.6,.62,.48),.4).multiplyScalar(.6);Ue&&To.lerp(aa,tt==="day"?.38:.5);const Jt={uMask:{value:Le},uSunDir:{value:J},uSunH:{value:Q},uSunCol:{value:Pe},uShade:{value:Ka},uBounce:{value:ja},uSkyAmb:{value:Wa},uHazeCol:{value:To},uHall:{value:new c.Vector4(Ft,.0105,0,1/Ra)},uWx:{value:new c.Vector4(rt==="fog"?1:0,rt==="shower"?1:0,vt==="monsoon"?1:0,jt)},uMist:{value:new c.Vector4(Ue?tt==="day"?.048:.06:0,Ue?1:0,jt?.14:tt==="day"?.24:.18,1)},uMistCol:{value:aa},uOc:{value:new c.Vector4(F.x,F.z,F.r,tt==="day"?.06:.12)},uG1:{value:new c.Vector4(It[0].x,It[0].z,It[0].R,.5)},uG2:{value:new c.Vector4(It[1].x,It[1].z,It[1].R,.55)},uHol:{value:new c.Vector4(0,-900,1,0)},uHolD:{value:new c.Vector4(1,0,1,0)},uWrap:{value:new c.Vector4(jt?.035:tt==="day"?.05:.075,jt?.1:tt==="day"?.2:.26,Ue?.56:.6,jt?.3:Ue?.85:.7)},uStage:{value:new c.Vector4(0,jt?.5:1,1,0)},uOutK:{value:0},uRing:{value:new c.Vector4(0,-500,0,0)},uRingCol:{value:jt?new c.Color(.3,.4,.62):new c.Color(.62,.42,.2)},uCam:{value:new c.Vector3},uCamDir:{value:new c.Vector3(0,0,-1)},uWake:{value:1},uPx:{value:600},uWave:{value:new c.Vector4(0,-900,0,.001)}},Ea=Ue?tt==="day"?.0072:.0085:jt?.0092:.0105,Vt=t=>{const e=new c.ShaderMaterial({fog:!0,...t});return e.uniforms={...c.UniformsUtils.clone(c.UniformsLib.fog),...Jt,...t.uniforms||{}},e},zo=25,Po=(t,e)=>Math.hypot(t-It[1].x,e-It[1].z),We=Se((we-1.9)/et,-9.4);let Je=Se((we+1.9)/et,9.8);for(let t=9.8;t<17&&Po(Je[0],Je[1])<zo;t+=.6)Je=Se((we+1.9)/et,t);for(let t=9.4;t<17&&Po(We[0],We[1])<zo;t+=.6){const e=Se((we-1.9)/et,-t);We[0]=e[0],We[1]=e[1]}const Go=[[We[0],We[1],2.2],[Je[0],Je[1],2.2]];Go.push([ve.peacockA.x,ve.peacockA.z,5.2]);const so=(t,e,a)=>{for(const d of Go)if(Math.hypot(t-d[0],e-d[1])<d[2]+a)return!0;return!1},ro=110,na=t=>{const e=[1,6,16,34],a=t-F.r;for(let d=1;d<=6;d++)e.push(lt(34,a-34,d/6));return e.push(a-14,a-3),e},$o=(t,e)=>Math.min(Ht(t,e)+1.1,Ot(t,e)-.6);function sa(t,e){const a=t/ro*q,d=Math.cos(a),b=Math.sin(a),y=na(Wo(d,b));let o=0;for(;o<y.length-2&&y[o+1]<e;)o++;const s=xt((e-y[o])/Math.max(y[o+1]-y[o],.001),0,1),r=F.r+y[o],f=F.r+y[o+1];return lt($o(F.x+d*r,F.z+b*r),$o(F.x+d*f,F.z+b*f),s)}function ra(t,e){const a=t-F.x,d=e-F.z,b=Math.hypot(a,d)-F.r;let y=Math.atan2(d,a);y<0&&(y+=q);const o=y/q*ro,s=Math.floor(o)%ro;return Math.max(sa(s,b),sa((s+1)%ro,b))}const Ce=[],Qa=[.825,.84,.855,.87,.885,.9].map(t=>Nt.pointAt(t)),So=Nt.pointAt(1),Ya=(t,e,a)=>{for(const d of Qa){const b=So.x-d.x,y=So.z-d.z,o=xt(((t-d.x)*b+(e-d.z)*y)/(b*b+y*y),0,1);if(Math.hypot(t-d.x-b*o,e-d.z-y*o)<2.6+a*1.7)return!0}return!1};{const t=12.5/Math.sqrt(it);for(let e=-yt;e<=yt;e+=t){await G.yield();for(let a=-gt;a<=gt;a+=t){let d=a+T.range(-.42,.42)*t,b=e+T.range(-.42,.42)*t;const y=T(),o=T(),s=T(),r=T();if(Lt(d,b)>.962||kt(d,b)<F.r+4)continue;const f=(p,x)=>{for(const h in _o)if(Math.hypot(p-ve[h].x,x-ve[h].z)<_o[h])return!0;for(const h of It)if(Math.hypot(p-h.x,x-h.z)<h.R*2.5+5)return!0;return so(p,x,1.2)?!0:He(p,x,7.5)};if(f(d,b))continue;const g=Io(d,b),u=y<.3+.5*g,w=u?.72+o*.45+g*.38:.15+o*.14;let i=Zt(d,b);const l=(i.i>_e*et?8.4:6.4)+w*1.2;if(i.d<l){let p=d-Z[i.i],x=b-at[i.i];const h=Math.hypot(p,x);if(h<.5)continue;const k=(l+s*1.6)/h;if(d=Z[i.i]+p*k,b=at[i.i]+x*k,i=Zt(d,b),i.d<l-.05||kt(d,b)<F.r+4||f(d,b))continue}const v=i.d<19?0:i.d<70?1:2;if(v===2&&(i.d>250&&Lt(d,b)<.8||r>wt*.88||!u&&i.d>170&&r>.5))continue;const m=Math.min(Ht(d,b)+.9,Ot(d,b)-1);Ce.push({x:d,z:b,r:w,col:u,tier:v,d:i.d,ni:i.i,top:m,topX:v===0?m:Math.max(m,ra(d,b)+1.3),s,gf:g,ghost:Ya(d,b,w)})}}}await G.yield();let be=null,Ee=null,lo=Math.round((Oo+we)/2);{const t=f=>{const g=xt(f.ni,0,et-1);return(f.x-Z[g])*-(at[g+1]-at[g])+(f.z-at[g])*(Z[g+1]-Z[g])<0?-1:1};for(const f of[0,1]){if(be)break;const g=Ce.filter(w=>w.tier===0&&w.col&&!w.ghost&&w.gf>(f?0:.2)&&w.ni>Oo+10&&w.ni<we-(f?4:10));let u=1e9;for(let w=0;w<g.length;w++)for(let i=w+1;i<g.length;i++){const l=g[w],v=g[i],m=Math.hypot(l.x-v.x,l.z-v.z);if(m<7||m>(f?18:14)||t(l)!==t(v))continue;let p=1e9;for(let h=0;h<=1.001;h+=.125)p=Math.min(p,Zt(lt(l.x,v.x,h),lt(l.z,v.z,h)).d);if(p<6||so((l.x+v.x)/2,(l.z+v.z)/2,6)||xo((l.x+v.x)/2,(l.z+v.z)/2)<9)continue;const x=l.d+v.d;if(x<u){u=x;const h=l.ni<=v.ni;be=h?[l.x,l.z]:[v.x,v.z],Ee=h?[v.x,v.z]:[l.x,l.z],lo=Math.round((l.ni+v.ni)/2)}}}const e=!be;e&&(be=Se((lo-3)/et,9.8*oa),Ee=Se((lo+3)/et,6.9*oa)),be.own=e;const a=(be[0]+Ee[0])/2,d=(be[1]+Ee[1])/2,b=Ct[lo]+1.2;ve.langurLimb=new c.Vector3(a,b,d);const y=J.y/Math.max(.001,Math.hypot(J.x,J.z)),o=(Ft-Math.min(b,Ft-2))/y,s=a+Q.x*o,r=d+Q.z*o;if(Lt(s,r)<.94&&kt(s,r)>F.r+9){const f={gx:s,gz:r,a:6,b:xt(.7000000000000001/y,3,7.5),I:1.12,x:1};re.push(f),Mo(f)}}const Qt={outer:[],court:[],hall:[],pool:[],mid:[]},$t=new ze,ht=Tt(Gt,new c.Color(.55,.56,.52),.25).multiplyScalar(rt==="shower"?jt?.86:.62:Ue?jt?.88:.72:jt?.94:tt==="day"?.74:.8);Ue&&!jt&&(ht.r*=1.08,ht.b*=.9);const Xa=[0,.025,.065,.13,.25,.42,.6,.76,.88,.95,1],Za=[0,.04,.3,.65,.94,1],Ja=[0,.07,.5,.92,1],tn=[0,.06,1],en=[0,1],Y=[0,0,0],ke=[],qo=8,io=[];for(let t=0;t<qo;t++)io.push({S:new ze,x:0,z:0,n:0,r:0});const on=[0,.03,.08,.16,.3,.5,.7,.86,.95,1],an=[0,.05,.14,.35,.65,.9,1],nn=[0,.08,.4,.8,1];let Oe=$t;function to(t,e,a,d,b,y,o,s=0,r=null,f=0,g=0){const u=s||bt(t,e)-.45,w=d-u,i=(g||d)-u,l=C=>{const D=Math.sin(y*91.7+C*37.3)*43758.5453;return D-Math.floor(D)},v=l(1)*q,m=(o?.035:.07)*l(2),p=(o?.45:.9)*(l(3)-.5),x=Math.cos(v),h=Math.sin(v),k=4+Math.floor(l(4)*3),L=(l(5)-.5)*5,n=l(6)*q,B=.26+.2*l(7),V=.84+.3*l(8),S=l(9),N=ht.r*V*(.95+.1*S),z=ht.g*V,R=ht.b*V*(1.06-.14*S);let M=1;const H=(C,D)=>{const U=p*Math.sin(Math.PI*C),_=m*C*w;D[0]=t+x*_+h*U,D[1]=u+C*w,D[2]=e+h*_-x*U},P=(C,D)=>{const U=C*w,_=s?0:Math.exp(-U/1.5),O=Math.exp(-Math.abs(i-U)/2.2)*(U>i?.5:1);if(b===2)return M=.8,a*(1.42-.5*C)*(s?.03+.97*St(0,.6,C):1);const K=a*(1-.12*C)*(1+(o?1.45:2.2)*_+(o?.95:1.6)*O)*(s?.03+.97*St(0,.6,C):1);M=Math.pow(Math.abs(Math.sin(.5*(k*D+L*C+n))),.7);const I=o?B+.5*Math.exp(-U/1.25)+.25*O:.1;return K*(1+I*(M-.62))},A=C=>{const D=C*w,U=.5+.5*M,_=1-.45*Math.exp(-D/.9),O=1-.5*Math.exp(-Math.max(i-D,0)/3),K=U*_*O;return Y[0]=N*K,Y[1]=z*K,Y[2]=R*K,Y};if(b===0?Bt(Oe,H,P,o?Xa:Za,o?14:6,A,o?k:2,w,o?.8:0):b===1?Bt(Oe,H,P,o?Ja:tn,o?6:4,A,o?k:2,w):Bt(Oe,H,P,en,3,A,3,w),b===0&&o&&!s&&l(10)<.42){const C=l(11)*q,D=a*2.2+1.2+l(12)*1.6,U=(.45+.35*l(13))*w,_=.12+.12*l(14),O=t+Math.cos(C)*D,K=e+Math.sin(C)*D,I=[0,0,0];H(U/w,I),Bt(Oe,(X,st)=>{const ut=X*X*(3-2*X)*.35+X*.65;st[0]=lt(O,I[0],ut),st[1]=u+X*(U-.2),st[2]=lt(K,I[2],ut)},X=>_*(1+1.8*Math.exp(-X*U/.8)+.8*Math.exp(-(1-X)*U/1.2)),[0,.07,.4,.8,1],5,X=>{const st=.9*(1-.4*Math.exp(-X*U/.8));return Y[0]=N*st*1.05,Y[1]=z*st,Y[2]=R*st*.95,Y},2,U)}if(r&&!s){const C=o?f?3:4+(l(20)<.5?1:0):1+(l(20)<.45?1:0),D=[0,0,0];for(let U=0;U<C;U++){const _=(U+.7*l(21+U))/C*q+n,O=(l(31+U)<.5?-1:1)*(.5+1.3*l(41+U)),K=l(51+U)*q,I=o?a*(.2+.16*l(61+U)):a*(.42+.3*l(61+U)),$=o?.9+1.3*l(71+U):.7+1.5*l(71+U),j=o?1:.5+.45*l(81+U),W=.92+.3*l(91+U);Bt(r,(nt,Pt)=>{const Ut=nt*j,oe=Ut*w;H(Ut,D);const Fe=a*(1-.12*Ut)*(1+(o?.5:.4)*Math.exp(-oe/1.5)),Vo=o?1:1-St(.75,1,nt),Mt=(Fe*(o?.92:.7)+I*.3+$*Math.exp(-oe/(o?1.15:2.6))+(o?.55*Math.exp(-(w-oe)/1.7):0))*Vo,Kt=_+O*Ut+.3*Math.sin(Ut*7+K);Pt[0]=D[0]+Math.cos(Kt)*Mt,Pt[1]=D[1],Pt[2]=D[2]+Math.sin(Kt)*Mt},nt=>I*(1+1.3*Math.exp(-nt*j*w/.55)+(o?.4*Math.exp(-(1-nt)*w/1.5):0))*(o?1:1-.5*nt),o?f?an:on:nn,o?f?4:5:3,(nt,Pt)=>{const Ut=nt*j*w,oe=W*(.82+.18*Math.cos(Pt))*(1-.42*Math.exp(-Ut/.8));return Y[0]=N*oe*1.04,Y[1]=z*oe,Y[2]=R*oe*.95,Y},1,w*j)}}}const sn=t=>io[xt(Math.floor((t/et-.25)/.75*qo),0,qo-1)];let Co=[0,0,0];const De=[];for(let t=0;t<Ce.length;t++){const e=Ce[t],a=$t.i.length,d=!e.ghost&&e.d<40?sn(e.ni):null;d&&(d.x+=e.x,d.z+=e.z,d.n++),to(e.x,e.z,e.col?e.r:e.r*1.5,e.topX,e.tier,t+e.s*7,e.col,e.ghost?Math.min(9.5+2.5*e.s,e.top-3):0,d?d.S:null,e.tier===0?0:1,e.top),Co[e.tier]++,!e.ghost&&e.tier<2&&Ke(e.x,e.z)>(e.tier===0?-32:-58)&&De.push(a,$t.i.length),e.tier===0&&e.col&&ke.push(e),t%6===5&&await G.yield()}{const t=ct("rimpoles"),e=Math.atan2(at[0]/yt,(Z[0]+75)/gt);for(let a=0;a<120;a++){const d=e+(t()-.5)*.84,b=t.range(.972,1.008),y=1+t.int(0,2);for(let o=0;o<y;o++){const s=gt*b*Math.cos(d)+(o?t.range(-1.8,1.8):0),r=yt*b*Math.sin(d)+(o?t.range(-1.2,1.2):0),f=o?t.range(.13,.24):t.range(.24,.5);to(s,r,f,11+t.range(0,5),1,3e3+a*7.3+o,f>.3)}}}await G.yield();const la=Nt.pointAt(1),ia=Nt.tangentAt(1),Qe=new c.Vector3(ia.x,0,ia.z).normalize(),eo=new c.Vector3(-Qe.z,0,Qe.x),te=new c.Vector3(la.x,7.5,la.z);Jt.uRing.value.set(te.x,6,te.z,1);{const t=[0,.02,.05,.1,.18,.28,.4,.52,.64,.75,.85,.93,1];for(const o of[-1,1]){const s=5+(o>0?1:0),r=T.range(0,q),f=T.range(2,4)*o,g=o*(9.7+T.range(0,.5)),u=T.range(-.8,.8),w=bt(te.x+eo.x*g,te.z+eo.z*g)-.45;let i=1;Bt($t,(p,x)=>{const h=g*(1-p*p*p),k=w+p*(18.6-w);x[0]=te.x+eo.x*h+Qe.x*u*(1-p),x[1]=k,x[2]=te.z+eo.z*h+Qe.z*u*(1-p)},(p,x)=>{const h=p*18.6;return i=Math.pow(Math.abs(Math.sin(.5*(s*x+f*p+r))),.7),1.22*(1-.2*p)*(1+1.5*Math.exp(-h/1.6)+.45*Math.exp(-(18.6-h)/2.5))*(1+(.2+.5*Math.exp(-h/1.3))*(i-.62))},t,16,p=>{const x=(.5+.5*i)*(1-.45*Math.exp(-p*18.6/.9));return Y[0]=ht.r*x,Y[1]=ht.g*x,Y[2]=ht.b*x,Y},s,19,.8)}const e=Ht(te.x,te.z)+1.2,a=(o,s)=>{s[0]=te.x+.6*Math.sin(o*2),s[1]=17.2+o*(e-17.2),s[2]=te.z};let d=1;Bt($t,a,(o,s)=>(d=Math.pow(Math.abs(Math.sin(.5*(7*s+3*o))),.7),(1.75-.5*Math.sin(Math.PI*o)+1.3*o*o)*(1+.25*(d-.6))),[0,.15,.4,.7,1],12,()=>{const o=.45+.4*d;return Y[0]=ht.r*o,Y[1]=ht.g*o,Y[2]=ht.b*o,Y},7,4)}await G.yield();const Rt=[];{const t=Ce.filter(s=>s.d<48),e=22,a=new Map,d=(s,r)=>Math.floor(s/e)+":"+Math.floor(r/e);t.forEach((s,r)=>{const f=d(s.x,s.z);a.has(f)||a.set(f,[]),a.get(f).push(r)});let b=0;const y=300,o=[0,.14,.3,.5,.7,.86,1];for(let s=0;s<t.length&&b<y;s++){(s&63)===63&&await G.yield();const r=t[s],f=[],g=Math.floor(r.x/e),u=Math.floor(r.z/e);for(let i=-1;i<=1;i++)for(let l=-1;l<=1;l++){const v=a.get(g+i+":"+(u+l));if(v)for(const m of v){if(m<=s)continue;const p=t[m],x=Math.hypot(p.x-r.x,p.z-r.z);x>8&&x<23&&f.push([x,m])}}f.sort((i,l)=>i[0]-l[0]);const w=r.col?2:1;for(let i=0;i<Math.min(w,f.length)&&b<y;i++){const l=t[f[i][1]],v=f[i][0],m=xt(r.r*.7,.26,.9),p=xt(l.r*.7,.26,.9),x=(r.x+l.x)/2,h=(r.z+l.z)/2,k=Zt(x,h),L=T.range(2.4,4.6),n=k.d<12?Math.max(0,Ct[k.i]+6.4-Math.min(r.top,l.top)+L):0,B=T.range(-.7,1.6)+n,V=T.range(-1.6,1.6),S=T.range(0,q),N=-(l.z-r.z)/v,z=(l.x-r.x)/v,R=T.range(.2,.36),M=T.range(0,q),H=(D,U)=>{const _=V*Math.sin(Math.PI*D)*Math.sin(D*5+S);U[0]=lt(r.x,l.x,D)+N*_,U[1]=lt(r.top,l.top,D)-L+B*Math.sin(Math.PI*D)+.3*Math.sin(D*8+M),U[2]=lt(r.z,l.z,D)+z*_},P=D=>lt(m,p,D)*(.66+.34*Math.cos(D*q)*Math.cos(D*q))*(1+.22*Math.sin(D*11+M));Bt($t,H,P,o,5,(D,U)=>{const _=R*(.8-.25*Math.sin(U));return Y[0]=ht.r*_,Y[1]=ht.g*_,Y[2]=ht.b*_,Y},2,v);const C=[0,0,0];for(let D=1;D<8;D++)H(D/8,C),Rt.push(C[0],C[1]-P(D/8),C[2],k.d);b++}}}await G.yield();const Te=[];{const t=[0,.015,.035,.06,.095,.14,.2,.28,.37,.47,.57,.67,.76,.84,.91,.96,1],e=[0,.02,.05,.1,.18,.28,.4,.52,.64,.76,.88,1],a=[],d=[],b=[0,.08,.18,.3,.44,.58,.72,.86,1];for(let o=0;o<=15;o++)a.push(o/15);for(let o=0;o<=12;o++)d.push(o/12);const y=[0,0,0];for(let o=0;o<It.length;o++){const s=It[o],r=ct("giant"+o),f=s.R,g=bt(s.x,s.z)-.6,u=Math.min(Ht(s.x,s.z)+1.6,Ot(s.x,s.z)-.8),w=u-g,i=9+r.int(0,2),l=r.range(0,q),v=r.range(-2.2,2.2),m=2*i+3,p=r.range(0,q);let x=1,h=0,k=0;const L=(A,C)=>{const D=A*w,U=Math.exp(-D/3.4),_=Math.exp(-(w-D)/4.5);x=Math.pow(Math.abs(Math.sin(.5*(i*C+v*A+l))),.6);const O=Math.pow(Math.abs(Math.sin(.5*(m*C-v*1.4*A+p))),.8);return f*(1-.1*A)*(1+.5*U+.5*_)*(1+(.2+.9*U+.25*_)*(x-.5)+.08*(O-.5))+.3*qt.n2(Math.cos(C)*1.7+s.seed+D*.11,Math.sin(C)*1.7-D*.07)},n=!!s.mother,B=ge,V=A=>Math.atan2(Math.sin(A),Math.cos(A)),S=A=>n&&A<9.6?.37*Math.pow(1-A/9.6*(A/9.6),.6):0,N=n?(A,C)=>{const D=L(A,C),U=A*w,_=S(U),O=Math.abs(V(C-B));h=_>0?1-St(_*.72,_*1.08+.015,O):0;const K=_>0?Math.exp(-Math.pow((O-_*1.45)/.11,2)):0;return k=K,lt(D*(1+.2*K),f*(.3+.045*Math.sin(C*23+U*1.3)),h)}:L,z=A=>{const C=A*w,D=(.36+.64*x)*(1-.5*Math.exp(-C/1.2))*(1-.45*Math.exp(-(w-C)/3.5))*(1-.8*h),U=1+.85*k*(1-h);return Y[0]=ht.r*D*U*(1+.12*k),Y[1]=ht.g*D*(1-.1*h)*U,Y[2]=ht.b*D*(1-.25*h)*U*(1-.12*k),Y};if(n){const A=[];let C=0;for(;C<q-.03;)A.push(B+Math.PI+C),C+=Math.abs(C-Math.PI)<.62?.042:.105;A.push(B+Math.PI+q),Dn($t,s.x,s.z,g,w,N,[0,15,35,60,95,130,170,210,250,285,315,340,370,420,500,600,700,800,880,940,1e3].map(D=>D/1e3),A,z,Math.round(q*f*1.2/1.15)),Jt.uHol.value.set(s.x+Math.cos(B)*f*.62,s.z+Math.sin(B)*f*.62,3.3,.78),Jt.uHolD.value.set(Math.cos(B),Math.sin(B),f*.36,0)}else Bt($t,(A,C)=>{C[0]=s.x,C[1]=g+A*w,C[2]=s.z},N,t,32,z,Math.round(q*f*1.2/1.15),w,.85);const R=11+r.int(0,3)+(n?4:0),M=[];for(let A=0;A<R;A++){const C=(A+r.range(-.3,.3))/R*q,D=r.range(.5,1.15)*(.75+.05*f),U=r.range(.28,.62)*w,_=r.range(-.35,.35);let O=f*r.range(1.5,2.15);Zt(s.x+Math.cos(C)*O,s.z+Math.sin(C)*O).d<7.6+D&&(O=f*(n?1.2:1.42));const K=3+r.int(0,2),I=r.range(0,q);n&&Math.abs(V(C-B))<.8||M.push([C,D,U,_,O,K,I,1.5])}if(n)for(const A of[-1,1])M.push([B+A*.6,1.15,.46*w,-A*.36,f*1.3,4,1.3+A,.55]);for(const[A,C,D,U,_,O,K,I]of M){let $=1;Bt($t,(st,ut)=>{const nt=st*w,Pt=A+U*st,Ut=lt(_,N(st,Pt)*.93+C*.25,St(0,D,nt));ut[0]=s.x+Math.cos(Pt)*Ut,ut[1]=g+nt,ut[2]=s.z+Math.sin(Pt)*Ut},(st,ut)=>{const nt=st*w;return $=Math.pow(Math.abs(Math.sin(.5*(O*ut+K+3*st))),.7),C*(1+I*Math.exp(-nt/1.3)+.5*Math.exp(-(w-nt)/3))*(1-.45*St(D*.8,w,nt))*(1+.24*($-.6))},e,9,st=>{const ut=st*w,nt=(.55+.45*$)*(1-.45*Math.exp(-ut/.9));return Y[0]=ht.r*nt*1.04,Y[1]=ht.g*nt,Y[2]=ht.b*nt*.94,Y},O,w,.85)}const H=12+r.int(0,3)+(n?9:0);for(let A=0;A<H;A++){const C=r.range(0,q),D=r.sign()*r.range(1.2,2.8),U=r.range(.17,.32)*(n?1.25:1),_=r.range(0,.15),O=r.range(.6,1),K=r.range(0,q);if(n){let W=!1;for(let X=0;X<=12;X++){const st=lt(_,O,X/12),ut=S(st*w);ut>0&&Math.abs(V(C+D*st-B))<ut*1.5+.3&&(W=!0)}if(W)continue}Bt($t,(W,X)=>{const st=lt(_,O,W),ut=C+D*st+.25*Math.sin(st*9+K),nt=N(st,ut)+U*.45;X[0]=s.x+Math.cos(ut)*nt,X[1]=g+st*w,X[2]=s.z+Math.sin(ut)*nt},W=>U*(1+.6*Math.exp(-W*6))*(1-.5*W),a,5,(W,X)=>{const st=.8+.2*Math.cos(X);return Y[0]=ht.r*st*1.06,Y[1]=ht.g*st,Y[2]=ht.b*st*.9,Y},1,(O-_)*w)}const P=n?13:9;for(let A=0;A<P;A++){const C=(A+r.range(-.3,.3))/P*q,D=r.range(12,22),U=r.range(-.9,.9),_=r.range(0,q),O=r.range(.55,.9)*(n?1.2:1);if(n&&Math.abs(V(C-B))<.46)continue;Bt($t,(j,W)=>{const X=C+U*j+.3*Math.sin(j*6+_),st=f*1.25+j*D;W[0]=s.x+Math.cos(X)*st,W[2]=s.z+Math.sin(X)*st,W[1]=bt(W[0],W[2])+.05+.9*(1-j)*(1-j)},j=>O*(1-.85*j)+.06,b,n?9:7,(j,W)=>{const X=.74+.3*Math.cos(W-1.57);return Y[0]=ht.r*X,Y[1]=ht.g*X*.97,Y[2]=ht.b*X*.9,Y},1,D)}await G.yield();for(let A=0;A<6;A++){A>0&&await G.yield();const C=(A+r.range(-.25,.25))/6*q+.4,D=r.range(20,31),U=w*r.range(.6,.78),_=Math.cos(C),O=Math.sin(C),K=s.x+_*(f+D),I=s.z+O*(f+D),$=Math.min(Ht(K,I)+.9,Ot(K,I)-1),j=Math.min($-2.5,g+U+r.range(1,4)),W=r.range(1,1.35)*(f/5),X=r.range(.5,2.2),st=r.range(0,q),ut=r.range(-3,3),nt=r.range(.24,.36),Pt=r.range(.45,.65),Ut=[r(),r(),r(),r(),r()],oe=(Mt,Kt)=>{const he=f*.7+Mt*(D+f*.3),Ne=ut*Math.sin(Math.PI*Mt);Kt[0]=s.x+_*he-O*Ne,Kt[1]=lt(g+U,j,Mt)+X*Math.sin(Math.PI*Mt)+.25*Math.sin(Mt*9+st),Kt[2]=s.z+O*he+_*Ne},Fe=Mt=>lt(W,.5,Math.sqrt(Mt))*(1+.5*Math.exp(-Mt*7))*(1+.1*Math.sin(Mt*13+st));let Vo=!0;for(let Mt=0;Mt<=10;Mt++)oe(Mt/10,y),(dt(y[0],y[1]-Fe(Mt/10),y[2])<5.2||kt(y[0],y[2])<F.r+3)&&(Vo=!1);if(Vo){Bt($t,oe,Fe,d,8,(Mt,Kt)=>{const he=nt*(.85-.3*Math.sin(Kt))*(1+1.2*Math.exp(-Mt*5));return Y[0]=ht.r*he,Y[1]=ht.g*he,Y[2]=ht.b*he,Y},3,D);for(let Mt=1;Mt<12;Mt++){oe(Mt/12,y);const Kt=Fe(Mt/12);Rt.push(y[0],y[1]-Kt,y[2],10,y[0],y[1]-Kt,y[2],10)}await G.yield();for(const Mt of[1,Pt]){oe(Mt,y);const Kt=y[0],he=y[2];if(Zt(Kt,he).d<10.5||Lt(Kt,he)>.95||He(Kt,he,6.5))continue;const Ne=Mt===1?$:y[1]+.3;to(Kt,he,Mt===1?.5:.36,Ne,0,700+o*31+A*7+Mt,!0),ke.push({x:Kt,z:he,r:.5,top:Ne,pole:!0})}for(let Mt=0;Mt<5;Mt++){const Kt=.1+.62*Ut[Mt];oe(Kt,y);const he=y[0],Ne=y[1]-Fe(Kt),Cn=y[2],kn=r.range(5,12),An=10+r.int(0,8);for(let Da=0;Da<An;Da++){const Lo=he+r.gauss()*.7,Uo=Cn+r.gauss()*.7,Do=Math.min(kn*r.range(.55,1.15),Ne-bt(Lo,Uo)-.6),Bn=r();Do<2||dt(Lo,Ne-Do,Uo)<5.5||dt(Lo,Ne-Do*.5,Uo)<5.5||Te.push(Lo,Ne,Uo,Do,Bn)}}}}await G.yield()}}const ce={a:new c.Vector3,b:new c.Vector3,mid:new c.Vector3,sag:.9,r:.3};{const t=ft.boughU??.563,e=xt(Math.round(t*et),1,et-2),a=Z[e+1]-Z[e],d=at[e+1]-at[e],b=Math.hypot(a,d)||1,y=-d/b,o=a/b,s=Ct[e]+3.5,r=13.5;ce.a.set(Z[e]+y*r,s+.9,at[e]+o*r),ce.b.set(Z[e]-y*r,s+.9,at[e]-o*r),ce.mid.set(Z[e],s,at[e]);for(const w of[ce.a,ce.b]){const i=Math.min(Ht(w.x,w.z)+.9,Ot(w.x,w.z)-1);to(w.x,w.z,.44,i,0,901.3+w.x,!0),ke.push({x:w.x,z:w.z,r:.44,top:i,pole:!0})}Bt($t,(w,i)=>{i[0]=lt(ce.a.x,ce.b.x,w),i[1]=lt(ce.a.y,ce.b.y,w)-ce.sag*Math.sin(Math.PI*w)+.08*Math.sin(w*17),i[2]=lt(ce.a.z,ce.b.z,w)},w=>ce.r*(1+.45*Math.pow(Math.abs(2*w-1),3))*(1+.12*Math.sin(w*23)),[0,.06,.14,.24,.36,.5,.64,.76,.86,.94,1],8,(w,i)=>{const l=.42*(.85-.3*Math.sin(i));return Y[0]=ht.r*l,Y[1]=ht.g*l,Y[2]=ht.b*l,Y},2,27)}const ca=[18,24],ha=24,co=1.5,rn=6,ua=6,ko=1.2;let oo=null;const Re=new Float32Array(49);await G.yield();{const t=ct("greatroot"),e=It[0],a=[0,0],d=t.range(-.9,.9),b=t.range(0,q),y=t.range(0,q),o=t(),s=(m,p)=>(x,h)=>{const k=m+d*x+.3*Math.sin(x*6+b),L=e.R*1.25+x*p;h[0]=e.x+Math.cos(k)*L,h[1]=e.z+Math.sin(k)*L},r=m=>{let p=0,x=0;for(let h=0;h<=48;h++)m(h/48,a),Re[h]=h?Re[h-1]+Math.hypot(a[0]-p,a[1]-x):0,p=a[0],x=a[1];return Re[48]},f=(m,p,x,h,k)=>(m-x)*(m-x)+(p-h)*(p-h)<k*k,g=(m,p,x)=>{if(Zt(m,p).d<rn)return!0;if(x)return!1;if(so(m,p,co)||f(m,p,be[0],be[1],1+co)||f(m,p,Ee[0],Ee[1],1+co))return!0;for(const h of Ce)if(!h.ghost&&f(m,p,h.x,h.z,h.r*(h.col?2:1.6)+co))return!0;for(const h of ke)if(h.pole&&f(m,p,h.x,h.z,h.r*2+co))return!0;return!1},u=(m,p)=>{for(let x=0;x<=48;x++)if(m(x/48,a),g(a[0],a[1],p))return!1;return!0};for(let m=t.range(ca[0],ca[1]);!oo;m-=2){let p=m;for(let k=0;k<6;k++)p*=m/r(s(0,p));const x=m<=ua*ko,h=[];for(let k=0;k<ha;k++){const L=s(y+k/ha*q,p);u(L,x)&&h.push(L),(k&3)===3&&await G.yield()}(h.length||x)&&(oo=h.length?h[Math.min(h.length-1,Math.floor(o*h.length))]:s(y,p))}r(oo);for(let m=0;m<=6;m++)oo(m/6,a),Go.push([a[0],a[1],3]);oo(.5,a),ve.langurRoot=new c.Vector3(a[0],bt(a[0],a[1])+2.6,a[1]);const w=J.y/Math.max(.001,Math.hypot(J.x,J.z)),i=(Ft-2.6)/w,l=a[0]+Q.x*i,v=a[1]+Q.z*i;if(Lt(l,v)<.94&&kt(l,v)>F.r+9){const m={gx:l,gz:v,a:6.5,b:xt(1.2600000000000002/w,5.3999999999999995,13.5),I:1.12,x:1};re.push(m),Mo(m)}}const Me=new ze,Wt={rootSeats:[],perchA:new c.Vector3,batBough:null,langurLimb:null,featThreads:[]};{const t=ct("features"),e=[0,0,0],a=[0,0,0],d=(y,o=0)=>(Y[0]=ht.r*y*(1+.05*o),Y[1]=ht.g*y,Y[2]=ht.b*y*(1-.08*o),Y);{const y=v=>2.05*Math.exp(-Math.pow((v-.27)/.135,2))+1.35*Math.exp(-Math.pow((v-.66)/.11,2)),o=v=>(.5-.14*v)*(.55+.45*St(0,.08,v)*(1-St(.9,1,v))),s=(v,m)=>{oo(v,a),m[0]=a[0],m[2]=a[1],m[1]=bt(a[0],a[1])-.3+.62*St(0,.1,v)*(1-St(.88,1,v))+y(v)};let r=1;const f=t.range(0,q),g=(v,m)=>(r=Math.pow(Math.abs(Math.sin(.5*(5*m+9*v+f))),.7),o(v)*(1+.24*(r-.6))*(1+.1*Math.sin(v*31+f))),u=(v,m)=>d(1.4*(.5+.5*r)*(.72+.28*Math.cos(m))*(.75+.25*St(0,1.2,y(v))),.5),w=[];for(let v=0;v<=30;v++)w.push(v/30);Bt(Me,s,g,w,12,u,5,26,.7);const i=ct("troop"),l=[];{const v=L=>{const n=xt(L,0,1)*48,B=Math.min(47,Math.floor(n));return lt(Re[B],Re[B+1],n-B)},m=L=>{let n=0;for(;n<47&&Re[n+1]<L;)n++;return(n+(L-Re[n])/Math.max(Re[n+1]-Re[n],1e-6))/48},p=v(.1),x=v(.88)-p,h=Math.min(ua,1+Math.floor(x/ko)),k=[];for(let L=0;L<h;L++)k.push(i());k.sort((L,n)=>L-n);for(let L=0;L<h;L++)l.push(m(p+k[L]*(x-(h-1)*ko)+L*ko))}for(const v of l)s(v,e),s(v+.02,a),Wt.rootSeats.push({x:e[0],y:e[1]+o(v)*.86,z:e[2],ax:a[0]-e[0],az:a[2]-e[2],turn:t.range(-.5,.5)});{const v=[0,0,0];Wt.rootAt=(m,p)=>(s(m,v),p.set(v[0],v[1]+o(m),v[2]))}for(let v=0;v<7;v++){const m=v<4?.16+.07*v+t.range(-.02,.02):.58+.06*(v-4),p=v%2?1:-1,x=t.range(.8,1.9),h=t.range(.1,.17),k=t.range(0,q);s(m,e),s(Math.min(1,m+.02),a);let L=-(a[2]-e[2]),n=a[0]-e[0];const B=Math.hypot(L,n)||1;L*=p/B,n*=p/B;const V=e[0],S=e[1]-o(m)*.5,N=e[2],z=V+L*x,R=N+n*x,M=bt(z,R)-.25;Bt(Me,(H,P)=>{const A=H*H;P[0]=lt(z,V,A)+.12*Math.sin(H*5+k),P[1]=lt(M,S,H),P[2]=lt(R,N,A)},H=>h*(1+1.5*Math.exp(-H*6)+.5*H),[0,.1,.3,.6,.85,1],5,(H,P)=>d(.78+.2*Math.cos(P),1),1,2)}for(const[v,m]of[[.45,1],[.8,-1],[.1,1]]){s(v,e),s(Math.min(1,v+.02),a);let p=-(a[2]-e[2]),x=a[0]-e[0];const h=Math.hypot(p,x)||1;p*=m/h,x*=m/h;const k=e[0],L=e[2],n=t.range(5,9),B=t.range(-.8,.8),V=Math.atan2(x,p),S=t.range(0,q);Bt(Me,(N,z)=>{const R=V+B*N+.3*Math.sin(N*6+S),M=.2+N*n;z[0]=k+Math.cos(R)*M,z[2]=L+Math.sin(R)*M,z[1]=bt(z[0],z[2])+.04+.3*(1-N)*(1-N)},N=>.26*(1-.8*N)+.05,[0,.1,.22,.36,.52,.68,.84,1],6,(N,z)=>d(.62+.25*Math.cos(z-1.57)),1,n)}}{const y=ve.peacockA,o=t.range(0,q),s=Math.cos(o),r=Math.sin(o),f=bt(y.x,y.z);let g=1;const u=(i,l)=>{const v=(i-.5)*5.6;l[0]=y.x+s*v+r*.5*Math.sin(i*5),l[2]=y.z+r*v-s*.5*Math.sin(i*5),l[1]=f-.45+.86*Math.sin(Math.PI*i)*Math.sin(Math.PI*i)};Bt(Me,u,(i,l)=>(g=Math.pow(Math.abs(Math.sin(.5*(4*l+6*i))),.7),(.2+.26*Math.sin(Math.PI*i))*(1+.22*(g-.6))),[0,.08,.18,.3,.42,.5,.58,.7,.82,.92,1],10,(i,l)=>d((.5+.5*g)*(.75+.25*Math.cos(l)),.5),4,5.6,.7),u(.5,e),Wt.perchA.set(e[0],e[1]+.44,e[2]);for(let i=0;i<4;i++){const l=o+1.2+i*1.5+t.range(-.3,.3),v=t.range(2.5,5),m=t.range(-.9,.9),p=t.range(0,q);Bt(Me,(x,h)=>{const k=l+m*x+.3*Math.sin(x*6+p),L=.3+x*v;h[0]=y.x+Math.cos(k)*L,h[2]=y.z+Math.sin(k)*L,h[1]=bt(h[0],h[2])+.03+.28*(1-x)*(1-x)},x=>.17*(1-.8*x)+.04,[0,.14,.3,.5,.72,1],5,(x,h)=>d(.62+.25*Math.cos(h-1.57)),1,v)}}const b=(y,o,s,r,f,g,u,w=!0)=>{const i={a:new c.Vector3(y[0],s,y[1]),b:new c.Vector3(o[0],r,o[1]),sag:g,r:f};if(Oe=Me,w)for(const h of[i.a,i.b]){const k=Math.min(Ht(h.x,h.z)+.9,Ot(h.x,h.z)-1);to(h.x,h.z,.5,k,0,u+h.x*.37,!0,0,Me,0),ke.push({x:h.x,z:h.z,r:.5,top:k,pole:!0})}Oe=$t;const l=i.a.distanceTo(i.b),v=t.range(0,q),m=(h,k)=>{k[0]=lt(i.a.x,i.b.x,h),k[1]=lt(i.a.y,i.b.y,h)-g*Math.sin(Math.PI*h)+.1*Math.sin(h*15+v),k[2]=lt(i.a.z,i.b.z,h)},p=(h,k)=>f*(1+.5*Math.pow(Math.abs(2*h-1),3))*(1+.1*Math.sin(h*21+v))*(1+.12*Math.sin(3*k+h*9)),x=[];for(let h=0;h<=16;h++)x.push(h/16);Bt(Me,m,p,x,9,(h,k)=>d(.72*(.84-.26*Math.sin(k)),.3),3,l,.6),i.at=(h,k)=>(m(h,e),k.set(e[0],e[1],e[2]));for(let h=0;h<3;h++){const k=.2+.3*h+t.range(-.06,.06),L=t.range(0,q),n=t.range(3,5.5),B=t.range(1,2.6);m(k,e);const V=e[0],S=e[1],N=e[2];Bt(Me,(z,R)=>{R[0]=V+Math.cos(L)*B*z*z,R[1]=S+n*z,R[2]=N+Math.sin(L)*B*z*z},z=>f*(.62-.3*z),[0,.2,.5,1],5,(z,R)=>d(.6+.1*Math.cos(R)),2,n)}return i};{const y=Ct[we]+4.3;Wt.batBough=b(We,Je,y+.5,y+.9,.4,.7,941.7);const o=Ct[lo]+.55;Wt.langurLimb=b(be,Ee,o+.3,o+.7,.36,.55,977.3,!!be.own);const s=new c.Vector3;for(const[r,f]of[[Wt.batBough,26],[Wt.langurLimb,16]])for(let g=0;g<f;g++){const u=t.range(.06,.94);r.at(u,s);const w=s.x+t.range(-.25,.25),i=s.z+t.range(-.25,.25),l=s.y-r.r,v=Zt(w,i),m=Math.min(t.range(1.2,6.5),l-bt(w,i)-.5,v.d<6?Math.max(0,l-(Ct[v.i]+3)):99);m>.5&&Wt.featThreads.push(w,l,i,m,t())}}}await G.yield();const fa=[new ze,new ze,new ze];Wt.roost=[];{const t=ct("roost"),e=[0,0,0],a=Nt.length/et,d=Math.round(.57*et),b=Math.round(.73*et),y=J.y/Math.max(.001,Math.hypot(J.x,J.z)),o=(m,p=0)=>(Y[0]=ht.r*m*(1+.05*p),Y[1]=ht.g*m,Y[2]=ht.b*m*(1-.08*p),Y),s=10,r=(m,p)=>{if(so(m,p,1.6)||Po(m,p)<zo||xo(m,p)<4.5||Zt(m,p).d<8.6||Lt(m,p)>.95)return!1;for(const x of Ce){const h=x.r*1.6+2,k=x.x-m,L=x.z-p;if(k*k+L*L<h*h)return!1}for(const x of ke){if(!x.pole)continue;const h=x.x-m,k=x.z-p;if(h*h+k*k<9)return!1}return!0},f=[];for(let m=0;m<=14;m++)f.push(m/14);const g=m=>{const p=(Ft-Math.min(m.y,Ft-2))/y,x=m.x+Q.x*p,h=m.z+Q.z*p;if(Lt(x,h)<.94&&kt(x,h)>F.r+9){const k={gx:x,gz:h,a:5.5,b:xt(.7000000000000001/y,3,7.5),I:1.12,x:1};re.push(k),Mo(k)}},u=.6*Nt.length+17,w=t.range(34,40),i=[u-w,u];for(let m=2;m<6;m++)i.push(i[m-1]+t.range(21,26));const l=(m,p)=>{const x=Zt(m,p),h=xt(x.i,0,et-1);return((m-Z[h])*-(at[h+1]-at[h])+(p-at[h])*(Z[h+1]-Z[h])<0?-1:1)*x.d},v=(m,p,x)=>{let h=1e9,k=.5;const L=new c.Vector3;for(let n=.12;n<=.881;n+=.02){m(n,L);const B=Math.abs(l(L.x,L.z)-p*x);B<h&&(h=B,k=n)}return k};for(let m=0;m<6;m++){const p=t.sign(),x=t.sign()*t.range(.9,2.4),h=t.range(3.6,4.6),k=t.range(5.3,5.9),L=t.range(.34,.42),n=t.range(0,900),B=t.range(0,q),V=[t.range(-.06,.06),t.range(0,q),t.range(3,5.5),t.range(1,2.6),t.range(-.06,.06),t.range(0,q),t.range(3,5.5),t.range(1,2.6)],S=xt(Math.round(i[m]/a),1,et-2);if(S>b-4||S<d+2)continue;if(m!==1&&Math.abs(S-we)*a<11){const I=Wt.batBough,$=v(I.at,p,h),j=I.at($,new c.Vector3);j.y-=I.r,g(j),Wt.roost.push({a:I.a,b:I.b,r:I.r,at:I.at,hangT:$,hang:j,side:p,d:we*a,own:!1,alarm:!1});continue}let N=null,z=null,R=S;for(const I of[0,2,-2,4,-4]){if(N&&z||m===1&&I)break;R=xt(S+I,1,et-2);for(const $ of[1,-1,0]){if(N&&z)break;N=z=null;for(let j=9.3;j<16.5&&!N;j+=.6){const W=Se((R-$*x)/et,-j);r(W[0],W[1])&&(N=W)}for(let j=9.3;j<16.5&&!z;j+=.6){const W=Se((R+$*x)/et,j);r(W[0],W[1])&&(z=W)}}}if(!N||!z)continue;{const I=Ct[R]+(m===1?3.9:k)+.5-.7-L;let $=!1;for(let j=0;j<=1.001;j+=.1){const W=lt(N[0],z[0],j),X=lt(N[1],z[1],j);Po(W,X)<zo&&I<bt(W,X)+s&&($=!0)}if($)continue}const M=fa[xt(Math.floor((R-d)/Math.max(1,b-d)*3),0,2)],H=Ct[R]+(m===1?3.9:k),P={a:new c.Vector3(N[0],H+.5,N[1]),b:new c.Vector3(z[0],H+.9,z[1]),sag:.7,r:L};Oe=M;for(const I of[P.a,P.b]){const $=Math.min(Ht(I.x,I.z)+.9,Ot(I.x,I.z)-1);to(I.x,I.z,.46,Math.max($,ra(I.x,I.z)+1.3),0,n+I.x*.37,!0,0,M,1,$)}Oe=$t;const A=P.a.distanceTo(P.b),C=(I,$)=>{$[0]=lt(P.a.x,P.b.x,I),$[1]=lt(P.a.y,P.b.y,I)-P.sag*Math.sin(Math.PI*I)+.1*Math.sin(I*15+B),$[2]=lt(P.a.z,P.b.z,I)};Bt(M,C,(I,$)=>L*(1+.5*Math.pow(Math.abs(2*I-1),3))*(1+.1*Math.sin(I*21+B))*(1+.12*Math.sin(3*$+I*9)),f,8,(I,$)=>o(.72*(.84-.26*Math.sin($)),.3),3,A,.6),P.at=(I,$)=>(C(I,e),$.set(e[0],e[1],e[2]));for(let I=0;I<2;I++){const $=.3+.4*I+V[I*4],j=V[I*4+1],W=V[I*4+2],X=V[I*4+3];C($,e);const st=e[0],ut=e[1],nt=e[2];Bt(M,(Pt,Ut)=>{Ut[0]=st+Math.cos(j)*X*Pt*Pt,Ut[1]=ut+W*Pt,Ut[2]=nt+Math.sin(j)*X*Pt*Pt},Pt=>L*(.62-.3*Pt),[0,.2,.5,1],5,(Pt,Ut)=>o(.6+.1*Math.cos(Ut)),2,W)}const U=v(P.at,p,h),_=P.at(U,new c.Vector3);_.y-=L,g(_);const O=Math.min(Ht(P.a.x,P.a.z)+.9,Ot(P.a.x,P.a.z)-1),K=Math.min(Ht(P.b.x,P.b.z)+.9,Ot(P.b.x,P.b.z)-1);Wt.roost.push({a:P.a,b:P.b,r:L,at:P.at,hangT:U,hang:_,side:p,d:R*a,own:!0,alarm:m===1,latA:l(P.a.x,P.a.z),headA:O,headB:K}),await G.yield()}}await G.yield();{const t=[0,.12,.26,.42,.6,.8,1];let e=0;for(const a of ke){if(a.pole)continue;(e++&15)===15&&await G.yield();const d=2+(T.chance(.5)?1:0);for(let b=0;b<d;b++){const y=T.range(0,q),o=T.range(5,12),s=T.range(-1.3,1.3),r=T.range(.4,1.1),f=T.range(0,q),g=a.r*T.range(.28,.42),u=(l,v)=>{const m=y+s*l+.3*Math.sin(l*3.4+f)*r,p=a.r*1.3+l*o;v[0]=a.x+Math.cos(m)*p,v[2]=a.z+Math.sin(m)*p,v[1]=bt(v[0],v[2])+.02+.2*(1-l)*(1-l)},w=l=>g*(1-.8*l)+.07,i=(l,v)=>{const m=.62+.25*Math.cos(v-1.57);return Y[0]=ht.r*m,Y[1]=ht.g*m*.97,Y[2]=ht.b*m*.9,Y};if(!a.ghost){const l=$t.count;Bt($t,u,w,t,4,i,1,o);for(let v=l;v<$t.count;v++)$t.u[v*2]+=1e3}}}}await G.yield();const Ko=[];{const t=ct("ribs"),e=[0,.1,.22,.36,.5,.64,.78,.9,1],a=[0,0,0],d=(r,f,g,u,w)=>{for(let i=0;i<u+w;i++){const l=t.range(.08,.92),v=t.sign(),m=i>=u;r(l,a);const p=a[0],x=a[2];r(Math.min(1,l+.03),a);let h=-(a[2]-x),k=a[0]-p;const L=Math.hypot(h,k)||1;h/=L,k/=L;const n=f(l)*(m?t.range(1.1,2.6):t.range(.7,1.9))+(m?.1:.05),B=p+h*n*v,V=x+k*n*v;if(Ke(B,V)>-3||kt(B,V)<F.r)continue;const S=m?.05:.04+f(l)*.5*Math.max(0,1-(n-f(l)*.7)/(f(l)*1.2));Ko.push(B,bt(B,V)+S,V,m?t.range(.1,.17):t.range(.3,.52),t(),m?0:Math.atan2(k*v,h*v)+t.range(-.7,.7),m?0:t.range(.25,.8),m?2:0)}},b=(r,f,g,u,w,i,l,v,m)=>{const p=t.range(0,q),x=t.range(.04,.16),h=(B,V)=>{const S=g+i*(B-.5)+.25*Math.sin(B*5+p),N=(B-.5)*u;V[0]=r+Math.cos(S)*N,V[2]=f+Math.sin(S)*N,V[1]=bt(V[0],V[2])-w*.55+(w*.95+x)*Math.pow(Math.sin(Math.PI*B),.7)},k=B=>w*(.3+.7*Math.pow(Math.sin(Math.PI*B),.6))*(1+.14*Math.sin(B*17+p))+.03;for(let B=0;B<=8;B++)if(h(B/8,a),Ke(a[0],a[2])>-2.5||kt(a[0],a[2])<F.r+1.5||Lt(a[0],a[2])>.95)return;const L=(B,V)=>{const S=.66+.26*Math.cos(V-1.57);return Y[0]=ht.r*S,Y[1]=ht.g*S*.97,Y[2]=ht.b*S*.9,Y},n=l.count;Bt(l,h,k,e,6,L,1,u);for(let B=n;B<l.count;B++)l.u[B*2]+=1e3;d(h,k,u,v,m)};let y=1;for(let r=de+34;r<et-8;r+=5){(r&31)<5&&await G.yield(),y=-y;const f=Z[r+1]-Z[r],g=at[r+1]-at[r],u=Math.atan2(g,f),w=y*t.range(2.2,7.5),i=t.range(-4,4),l=Z[r]-Math.sin(u)*w+Math.cos(u)*i,v=at[r]+Math.cos(u)*w+Math.sin(u)*i,m=u+t.range(.5,1.3)*t.sign(),p=t.range(5.5,10.5),x=t.range(.17,.3),h=t.range(-.9,.9),k=9+t.int(0,5),L=3+t.int(0,3);if(so(l,v,1.5)||xo(l,v)<6)continue;let n=!1;for(const B in _o)ve[B]&&Math.hypot(l-ve[B].x,v-ve[B].z)<(B==="chital"?9:3.5)&&(n=!0);n||b(l,v,m,p,x,h,$t,k,L)}const o=It[1],s=ct("mouthroots");for(let r=0;r<4;r++){const f=r%2?1:-1,g=ge+f*(.36+.2*(r>>1)+s.range(-.04,.04)),u=o.R*(1.5+.5*(r>>1))+s.range(0,1.2),w=s.range(7,10.5);b(o.x+Math.cos(g)*u+Math.cos(ge)*w*.3,o.z+Math.sin(g)*u+Math.sin(ge)*w*.3,ge+f*s.range(.25,.7),w,s.range(.34,.46),f*s.range(.3,.8),Me,16,7)}for(const r of[-1,1]){const f=ge+r*.58,g=o.x+Math.cos(f)*o.R*1.42,u=o.z+Math.sin(f)*o.R*1.42,w=12.5+s.range(0,1.5),i=s.range(7,9.5);for(let l=0;l<11;l++){const v=g+s.gauss()*.45,m=u+s.gauss()*.45,p=Math.min(i*s.range(.6,1.1),w-bt(v,m)-.8);p>2&&dt(v,w-p,m)>5&&dt(v,w-p*.5,m)>5&&Te.push(v,w,m,p,s())}}}const Ao=`
    varying vec3 vP, vN, vC; varying vec2 vUv;
    ${ue}
    void main(){
      vP = position; vN = normal; vC = color; vUv = uv;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
      gl_Position = projectionMatrix * mvPosition;
      #include <fog_vertex>
    }`,ln=`
    vec3 bumpN(vec3 P, vec3 N, float h, float k){
      vec3 dpx = dFdx(P), dpy = dFdy(P); float hx = dFdx(h), hy = dFdy(h);
      vec3 r1 = cross(dpy, N), r2 = cross(N, dpx); float det = dot(dpx, r1);
      vec3 grad = (det < 0. ? -1. : 1.) * (hx * r1 + hy * r2);
      return normalize(abs(det) * N - k * grad + vec3(0., 1e-6, 0.));
    }`,va=t=>`
      varying vec3 vP, vN, vC; varying vec2 vUv;
      ${_t}
      ${ln}
      ${ae}
      void main(){
        ${t?`if (vP.y < ${ot.y.toFixed(2)}) discard;`:`if (vP.y < ${(ot.y+.03).toFixed(2)} && poolD(vP.xz) < 0.) discard;      // under the pool's surface`}
        vec3 Ng = normalize(vN + vec3(0., 1e-4, 0.));
        float dist = length(vP - uCam);
        float df = 1. - smoothstep(35., 130., dist), dn = 1. - smoothstep(8., 30., dist);
        // every layer of relief is drawn only while its lines are a few pixels wide: far pillars are clean pale shafts with the
        // soft fluting of their lofted lobes, the lattice of roots comes in under 30 m, the fine grain under 12
        float fwx = fwidth(vUv.x) + 1e-5;
        float wob = vnoise(vec2(vUv.x * 2.3, vUv.y * .22)) * 5.;
        float phA = vUv.x * 18.85 + wob + vUv.y * .6 + .8 * sin(vUv.y * .9 + vUv.x * 2.);
        float kA = (1. - smoothstep(.07, .16, fwx * 3.)) * (1. - smoothstep(26., 58., dist));
        float rA0 = (.5 + .5 * sin(phA)) * (.72 + .28 * sin(phA * .5 + 1.3));                 // cables side by side, some standing prouder
        float bare = smoothstep(.3, .62, vnoise(vec2(vUv.x * .8 + 3., vUv.y * .16)));         // ... in places; plain bark between
        kA *= .35 + .65 * bare;
        // a few thick roots wind up the column standing proud of it, thinner ones cross between them on the other slant
        float c1 = vUv.x + vUv.y * .4 + vnoise(vec2(vUv.x * .9, vUv.y * .2)) * 1.7;
        float c2 = vUv.x * 2. - vUv.y * .7 + vnoise(vec2(vUv.x * 1.1 + 7., vUv.y * .29)) * 2.6;
        float c3 = vUv.x * 3. + vUv.y * 1.3 + vnoise(vec2(vUv.x * 1.6 + 2., vUv.y * .4)) * 2.2;
        float h1 = hash11(floor(c1) + 11.), h2 = hash11(floor(c2) + 17.), h3 = hash11(floor(c3) + 5.);
        float w1 = .17 + .17 * h1, w2 = .07 + .09 * h2, w3 = .06 + .06 * h3;
        float d1 = abs(fract(c1) - .5), d2 = abs(fract(c2) - .5), d3 = abs(fract(c3) - .5);
        float kT = smoothstep(1.2, 2.6, w1 / (fwidth(c1) + 1e-5)) * (1. - smoothstep(34., 64., dist)) * step(.42, hash11(floor(c1) + 3.));
        float kN2 = smoothstep(1.2, 2.6, w2 / (fwidth(c2) + 1e-5)) * (1. - smoothstep(11., 26., dist)) * step(.56, hash11(floor(c2) + 31.));
        float kN3 = smoothstep(1.2, 2.6, w3 / (fwidth(c3) + 1e-5)) * (1. - smoothstep(9., 20., dist)) * step(.66, hash11(floor(c3) + 23.));
        ${t?"kA *= .35; kT *= .45; kN2 = 0.; kN3 = 0.; dn = 0.;                                 // in the water the bark is softened":""}
        float thick = sqrt(max(1. - (d1 / w1) * (d1 / w1), 0.)) * kT;                         // round in section
        float thin = max((1. - smoothstep(w2 * .4, w2, d2)) * kN2, (1. - smoothstep(w3 * .4, w3, d3)) * kN3 * .8);
        float shadow = (1. - smoothstep(w1, w1 * 1.8, d1)) * kT * (1. - step(d1, w1));         // the crease each thick root lies in
        float over = max(thick, thin);
        float rA = mix(.62, rA0, kA);
        float strand = max(rA, over);
        float fine = .5 + .5 * sin(vUv.x * 56.5 + wob * 2.3 + vUv.y * 1.1);
        float kF = dn * (1. - smoothstep(.05, .12, fwx * 9.));
        float fleck = vnoise(vec2(vUv.x * 64., vUv.y * 7.)), crack = smoothstep(.62, .7, vnoise(vec2(vUv.x * 23. + wob, vUv.y * 2.1)));
        float h = (rA - .62) * .07 + thick * .13 + thin * .05 + kF * (fine * .022 + fleck * .012 - crack * .018);
        vec3 N = bumpN(vP, Ng, h, 2.2 * df);
        float crease = (1. - smoothstep(.12, .6, rA0)) * kA;
        float streak = vnoise(vec2(vUv.x * 9., vUv.y * .3 + 3.));
        float blotch = vnoise(vP.xz * .9 + vP.y * .37);
        float isRoot = step(500., vUv.x);                                                       // a surface root lying on the litter
        vec3 alb = vC * mix(.84, .76 + .2 * rA, kA) * (.74 + .42 * streak) * vec3(1., .95, .84);
        alb = mix(alb, alb * vec3(1.16, 1.1, 1.) + vec3(.012, .01, .006), over * .7);          // roots standing proud are younger, paler
        alb *= 1. - .42 * shadow;
        alb *= 1. - kF * (.3 * (1. - fine) * (1. - crease) + .35 * crack - .22 * smoothstep(.74, .8, fleck));      // fine strands, cracks, pale lenticels
        alb = mix(alb, alb * vec3(.64, .6, .54), crease * (.55 + .45 * smoothstep(.3, .7, streak)));         // the creases are dark and damp
        alb = mix(alb, alb * vec3(.8, .92, .84), smoothstep(.55, .8, blotch) * .6);            // lichen
        float moss = uWx.z * smoothstep(.35, .7, vnoise(vP.xz * .5 + vP.y * .2 + 9.)) * (1. - smoothstep(2., 9., vP.y));
        alb = mix(alb, mix(vec3(.07, .16, .04), vec3(.17, .27, .1), isRoot), moss * .8);
        alb = mix(alb, vec3(.24, .15, .075), (1. - smoothstep(.1, .9, vP.y)) * .55 * (1. - isRoot));      // litter banked at the foot
        float ao = (1. - .34 * crease - .25 * shadow) * mix(.56 + .44 * smoothstep(.1, 1.5, vP.y), .92, isRoot);     // and it stands in its own shade
        float holK = 1. - hollowIn(vP);                                                        // nothing rims or fills the inside of the hollow
        vec3 col = alb * (hallLight(vP, N, ao) + (uShade * .38 + uSkyAmb * .1) * (.5 + .5 * ao) * (.12 + .88 * holK));      // shaded bark is cool grey-brown, never black
        // every trunk has a side to the low sun and a side away from it: warm and a little lifted, cool and a good deal darker
        float sl = smoothstep(-.7, .8, dot(Ng, uSunH));
        vec3 sideT = mix(vec3(.6, .72, .9), mix(vec3(1.2, 1.1, .9), vec3(1.12, 1.18, 1.28), uWx.w), sl);
        col *= mix(vec3(1.), sideT, uStage.y * holK * (1. - .75 * isRoot));
        col += alb * (uBounce * 1.1 + uShade * .55) * smoothstep(.1, .8, -Ng.y) * holK;       // the underside of a bough is lit by the floor
        col += alb * (uBounce * .3 + uShade * .2) * isRoot;                                    // a root on the floor lies in the floor's own light: never a black line
        vec3 V = normalize(uCam - vP + vec3(0., 1e-4, 0.));
        float sp = max(dot(reflect(-uSunDir, N), V), 0.); sp *= sp; sp *= sp;
        col += uSunCol * sunVis(vP) * sp * sp * (.04 + .5 * uWx.y) * holK;
        float edge = 1. - max(dot(N, V), 0.), moon = max(dot(N, uSunH), 0.);
        col += alb * uSunCol * uWx.w * (.1 * moon * moon + .22 * moon * edge * edge);        // night: a silver-blue edge on the moon side
        // the low sun's glow in the haze rims every trunk on its sunward edge, warm; the far side falls to cool shade
        float sunSide = max(dot(Ng, uSunH), 0.), rimK = edge * edge * (.35 + .65 * sunSide) * smoothstep(-.25, .35, dot(Ng, uSunH));
        col += (alb * 1.6 + vec3(.03, .022, .012)) * uSunCol * uWrap.y * rimK * (.6 + .4 * smoothstep(.5, 4., vP.y)) * holK;
        // near bark is solid (it takes a share of the haze only); beyond 30 m each pillar takes more of the air in front of it,
        // so each stands a step paler than the one before it and the farthest are lost in the green-gold of the hall
        float hs = mix(uWrap.z, 1., smoothstep(26., 105., dist) * (1. - uStage.x));
        col = hallHaze(col, uCam + (vP - uCam) * hs * (.45 + .55 * holK));
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`,ho=Vt({vertexColors:!0,vertexShader:Ao,fragmentShader:va(!1)}),cn=`
    varying vec3 vP, vN, vC; varying vec2 vUv;
    ${ue}
    void main(){
      vP = position; vN = normal; vC = color; vUv = uv;
      vec4 mvPosition = modelViewMatrix * vec4(position.x, ${(2*ot.y).toFixed(2)} - position.y, position.z, 1.);
      gl_Position = projectionMatrix * mvPosition;
      #include <fog_vertex>
    }`,hn=Vt({vertexColors:!0,side:c.DoubleSide,vertexShader:cn,fragmentShader:va(!0)}),jo=await $t.geometryY(G),da=new c.Mesh(jo,ho);da.frustumCulled=!1,E.add(da);{let t=0;for(let o=0;o<De.length;o+=2)t+=De[o+1]-De[o];const e=new Uint32Array(t),a=jo.index.array;let d=0;for(let o=0;o<De.length;o+=2)e.set(a.subarray(De[o],De[o+1]),d),d+=De[o+1]-De[o];const b=new c.BufferGeometry;for(const o of["position","normal","uv","color"])b.setAttribute(o,jo.attributes[o]);b.setIndex(new c.BufferAttribute(e,1));const y=new c.Mesh(b,hn);y.frustumCulled=!1,y.renderOrder=-5,E.add(y),Qt.pool.push(y)}await G.yield();for(const t of io){if(!t.S.count)continue;t.x/=Math.max(t.n,1),t.z/=Math.max(t.n,1);const e=t.S.p;let a=0;for(let d=0;d<e.length;d+=3){const b=e[d]-t.x,y=e[d+2]-t.z;b*b+y*y>a&&(a=b*b+y*y)}t.r=Math.sqrt(a),t.mesh=new c.Mesh(await t.S.geometryY(G),ho),t.mesh.frustumCulled=!1,E.add(t.mesh),await G.yield()}{const t=new c.Mesh(await Me.geometryY(G),ho);t.frustumCulled=!1,E.add(t),Qt.mid.push(t);for(const e of fa){if(!e.count)continue;const a=new c.Mesh(await e.geometryY(G),ho);a.geometry.computeBoundingSphere(),E.add(a),Qt.mid.push(a)}}await G.yield();{const e=Math.ceil(gt*2.24/20),a=Math.ceil(yt*2.3/20),d=new ze;for(let s=0;s<=a;s++)for(let r=0;r<=e;r++){const f=-gt*1.12+r*20,g=-yt*1.15+s*20;d.v(f,bt(f,g),g,0,1,0,0,0,1,1,1)}for(let s=0;s<a;s++)for(let r=0;r<e;r++){const f=s*(e+1)+r;d.quad(f,f+e+1,f+e+2,f+1)}const b=Tt(se,new c.Color(.26,.15,.07),.68),y=Vt({uniforms:{uOchre:{value:Tt(ne,Gt,.62).multiplyScalar(.55)},uCopper:{value:b.multiplyScalar(.62)},uGrass:{value:Tt(pt,Gt,.35).multiplyScalar(.6)},uCourtK:{value:tt==="day"?.5:1},uDome:{value:new c.Vector2(gt,yt)}},vertexShader:Ao,vertexColors:!0,fragmentShader:`
        varying vec3 vP, vN, vC; varying vec2 vUv;
        uniform vec3 uOchre, uCopper, uGrass; uniform vec2 uDome; uniform float uCourtK;
        ${_t}
        ${ae}
        vec4 leafCell(vec2 p){     // xy: tilt, z: coverage, w: id
          vec2 i = floor(p), f = fract(p); float id = hash21(i);
          vec2 c = vec2(.32) + .36 * vec2(hash21(i + 7.7), hash21(i + 3.1));
          float a = id * 6.283; vec2 d = vec2(cos(a), sin(a)); vec2 r = f - c;
          float along = dot(r, d), across = dot(r, vec2(-d.y, d.x));
          float sz = .55 + .45 * hash21(i + 1.3);
          float e = 1. - smoothstep(.6, 1., length(vec2(along * 1.5, across * 2.7)) * 2.5 / sz);
          return vec4(d * e, e, id);
        }
        void main(){
          float rr = length(vP.xz / uDome);
          float edge = rr + .03 * vnoise(vP.xz * .06);
          if (edge > 1.1) discard;
          float pd = poolD(vP.xz);
          if (pd < 0.) discard;                                         // the rain pool: the floor leaves a hole for it
          float dist = length(vP - uCam), df = 1. - smoothstep(9., 46., dist);
          vec2 w = vP.xz + (vec2(vnoise(vP.xz * .8), vnoise(vP.xz * .8 + 31.)) - .5) * .9;
          vec4 l1 = leafCell(w * 2.3);
          vec4 l2 = leafCell(mat2(.8, -.6, .6, .8) * w * 1.55 + 17.3);
          vec4 l3 = leafCell(mat2(.6, .8, -.8, .6) * w * 3.4 + 5.1);
          float mott = fbm2(vP.xz * .09), big = vnoise(vP.xz * .023 + 4.);
          vec3 avg = mix(uOchre, uCopper, smoothstep(.3, .7, mott)) * .78;
          vec3 c1 = mix(uOchre, uCopper, step(.45, fract(l1.w * 5.3))) * (.65 + .6 * fract(l1.w * 9.1));
          vec3 c2 = mix(uOchre * 1.15, uCopper, step(.6, fract(l2.w * 3.7))) * (.75 + .4 * fract(l2.w * 7.9));
          vec3 c3 = mix(uCopper * .6, uOchre * .8, fract(l3.w * 4.1));
          vec3 nearC = mix(avg * .62, c3, l3.z);
          nearC = mix(nearC, c1, l1.z); nearC = mix(nearC, c2, l2.z);
          vec3 alb = mix(avg, nearC, df) * (.8 + .3 * big);
          float fig = step(.975, hash21(floor(w * 5.))) * df * step(length(fract(w * 5.) - .5), .28);
          alb = mix(alb, vec3(.42, .03, .02), fig);
          float court = 1. - smoothstep(uOc.z - 6., uOc.z + 5., length(vP.xz - uOc.xy));
          float outside = smoothstep(.93, 1.03, edge);
          // the courtyard: tussocky pale grass with leaf-strewn earth between, straw where it has dried
          // (in the open the rust blotches of the hall floor are calmed: pale dry earth strewn with leaves under the grass)
          // (in the open: pale dry earth, cracked and pebbled, strewn with the same curled ochre and copper leaves)
          float pebble = vnoise(vP.xz * 3.3) * .6 + vnoise(vP.xz * 9.1) * .4;
          vec3 earth = uOchre * (.4 + .26 * mott) * (.78 + .44 * pebble * df) * (1. - .3 * df * smoothstep(.55, .62, vnoise(vP.xz * 1.3 + 9.)) * step(.5, vnoise(vP.xz * 4.7)));
          // drifts of leaf lie in its hollows, and the biggest leaves (curled, a hand long) still read from the well's height
          float drift = smoothstep(.44, .7, vnoise(vP.xz * .19 + 5.) * .6 + vnoise(vP.xz * .57) * .4), dfc = 1. - smoothstep(34., 120., dist);
          earth = mix(earth, mix(uOchre, uCopper, smoothstep(.25, .75, mott)) * .66, drift * .6);
          vec3 strewn = mix(earth, c3 * 1.2, l3.z * .8); strewn = mix(strewn, c1 * 1.15, l1.z); strewn = mix(strewn, c2 * 1.1, l2.z);
          vec4 l4 = leafCell(mat2(.7, .71, -.71, .7) * w * .95 + 9.4);
          vec3 c4 = mix(uOchre * 1.3, uCopper * 1.2, step(.5, fract(l4.w * 7.3))) * (.8 + .4 * fract(l4.w * 3.1));
          vec3 courtC = mix(earth * 1.05, strewn, df);
          courtC = mix(courtC, c4, l4.z * step(.4, fract(l4.w * 11.7)) * dfc * (.5 + .5 * drift));
          alb = mix(alb, courtC, court);
          alb = mix(alb, alb * vec3(.36, .33, .3), (1. - smoothstep(.3, 3.4, pd)) * .9);          // wet mud and sodden leaves along the pool's shore
          alb = mix(alb, vec3(.2, .17, .12) * (.8 + .5 * vnoise(vP.xz * 2.3)), 1. - smoothstep(.05, .5, pd));      // and a paler rim of drying silt at the water
          float tus = vnoise(vP.xz * .9 + 2.) * .55 + vnoise(vP.xz * 2.9) * .45;
          float gr = max(court * smoothstep(.22, .55, vnoise(vP.xz * .3) * .6 + tus * .4), outside);
          vec3 straw = mix(uGrass, vec3(.4, .33, .15), smoothstep(.3, .8, vnoise(vP.xz * .17 + 7.)));
          float blade = .5 + .5 * vnoise(vP.xz * vec2(11., 13.));
          alb = mix(alb, straw * (.3 + .95 * tus) * mix(1., .6 + .6 * blade, df), gr * .85);
          alb *= mix(1., uCourtK, court);                              // under a high sun the open floor must not bleach
          // the open floor has relief under a low sun: every tussock and drift has a flank turned to the sun and throws
          // a shadow away from it, a metre or two long, over the earth and the lower grass behind it
          vec2 s1 = vP.xz + uSunH.xz * .5, s2 = vP.xz + uSunH.xz * 1.5;
          float hgt = tus * (.35 + .65 * gr), tus1 = vnoise(s1 * .9 + 2.) * .55 + vnoise(s1 * 2.9) * .45, tus2 = vnoise(s2 * .9 + 2.) * .55 + vnoise(s2 * 2.9) * .45;
          float gr2 = smoothstep(.22, .55, vnoise(s2 * .3) * .6 + tus2 * .4);
          float flank = clamp((hgt - tus1 * (.35 + .65 * gr)) * 4., -1., 1.);
          float shd = smoothstep(.1, .34, tus2 * (.35 + .65 * gr2) - hgt) * (1. - smoothstep(60., 170., dist));
          float relief = court * (1. - outside);
          vec3 N = normalize(vec3(0., 1., 0.) + (vec3(l1.x, 0., l1.y) * .8 + vec3(l2.x, 0., l2.y) * .8 + vec3(l3.x, 0., l3.y) * .4) * df);
          vec3 lit = hallLight(vP, N, (.82 + .18 * mott) * (1. - .28 * court * df * (1. - max(l1.z, l2.z)))) + uBounce * .9;      // each leaf in the open lies on its own small shadow
          // the open courtyard is divided by the low sun: a pool of gold where it comes over the rim, cool blue-green shade under the lip
          float cs = courtSun(vP);
          lit = mix(lit, lit * vec3(.36, .58, .7), court * (1. - cs));
          lit *= 1. + relief * (.3 + .7 * cs) * (.42 * flank - .1);
          lit = mix(lit, lit * vec3(.4, .55, .68), relief * cs * shd * .8);
          // curled leaves that happen to face the low sun flare
          float sv = sunVis(vP);
          lit += uSunCol * sv * (.22 + .5 * smoothstep(.2, .9, dot(N, uSunDir)) * df) * (1. + .8 * court * cs);
          vec3 col = hallHaze(alb * lit, vP);
          gl_FragColor = vec4(col, 1.);
          #include <fog_fragment>
        }`}),o=new c.Mesh(d.geometry(),y);o.frustumCulled=!1,E.add(o)}function Wo(t,e){const a=t*t/(gt*gt)+e*e/(yt*yt),d=2*(F.x*t/(gt*gt)+F.z*e/(yt*yt)),b=F.x*F.x/(gt*gt)+F.z*F.z/(yt*yt)-1;return(-d+Math.sqrt(Math.max(0,d*d-4*a*b)))/(2*a)}async function un(t,e,a,d,b){const y=new ze,o=e(100).length;for(let r=0;r<=t;r++){(r&15)===15&&await G.yield();const f=r/t*q,g=Math.cos(f),u=Math.sin(f),w=Wo(g,u),i=e(w);for(let l=0;l<o;l++){const v=F.r+i[l],m=F.x+g*v,p=F.z+u*v,x=d(m,p,i[l],w);y.v(m,a(m,p,i[l],w),p,0,1,0,i[l],w-F.r-i[l],x,x,x)}}await G.yield();for(let r=0;r<t;r++)for(let f=0;f<o-1;f++){const g=r*o+f;b?y.quad(g,g+o,g+o+1,g+1):y.quad(g,g+1,g+o+1,g+o)}await G.yield();const s=await y.geometryY(G);return s.computeVertexNormals(),await G.yield(),s}const ee=(t,e,a)=>{const d=Math.pow(St(0,15,a),.55);return lt(Ht(t,e)-1.5,Ot(t,e)-1.2*(1-d),d)};await G.yield();async function fn(){const t=3+(1-wt)*3,e=(l,v,m,p,x)=>{const h=[];for(let n=m;n<=p+.001;n+=t)h.push(n);let k=t,L=h[h.length-1];for(;L<v;)k=Math.min(x,k*1.2),L=Math.min(v,L+k),h.push(L);for(k=t,L=m;L>l;)k=Math.min(x,k*1.2),L=Math.max(l,L-k),h.unshift(L);return h},a=e(-gt*1.04,gt*1.04,-128,46,14),d=e(-yt*1.04,yt*1.04,62,323,12),b=a.length,y=d.length,o=b*y,s=new Float32Array(o*3),r=new Float32Array(o*3),f=new Float32Array(o*3),g=new Float32Array(o*2),u=new Uint8Array(o);for(let l=0;l<y;l++){(l&1)===1&&await G.yield();for(let v=0;v<b;v++){let m=a[v],p=d[l];const x=Lt(m,p),h=l*b+v,k=h*3;x>1&&(m/=x,p/=x);const L=kt(m,p),n=L-F.r,B=Wo((m-F.x)/Math.max(L,.001),(p-F.z)/Math.max(L,.001));s[k]=m,s[k+1]=x>1?7.5:ee(m,p,Math.max(n,-1.5)),s[k+2]=p,f[k]=Ze(m,p),f[k+1]=je(m,s[k+1],p),f[k+2]=1,g[h*2]=n,g[h*2+1]=x>1?0:B-L,u[h]=x<1.03&&n>-4.5?1:0}}await G.yield();for(let l=0;l<y;l++)for(let v=0;v<b;v++){const m=(l*b+v)*3,p=(l*b+Math.max(0,v-1))*3,x=(l*b+Math.min(b-1,v+1))*3,h=(Math.max(0,l-1)*b+v)*3,k=(Math.min(y-1,l+1)*b+v)*3,L=s[x]-s[p],n=s[x+1]-s[p+1],B=s[x+2]-s[p+2],V=s[k]-s[h],S=s[k+1]-s[h+1],N=s[k+2]-s[h+2];let z=S*B-N*n,R=N*L-V*B,M=V*n-S*L;const H=Math.hypot(z,R,M);H<1e-6||R<=0?(z=0,R=1,M=0):(z/=H,R/=H,M/=H),r[m]=z,r[m+1]=R,r[m+2]=M}await G.yield();const w=[];for(let l=0;l<y-1;l++)for(let v=0;v<b-1;v++){const m=l*b+v,p=m+1,x=m+b+1,h=m+b;u[m]+u[p]+u[x]+u[h]!==0&&w.push(m,h,x,m,x,p)}const i=new c.BufferGeometry;return i.setAttribute("position",new c.BufferAttribute(s,3)),i.setAttribute("normal",new c.BufferAttribute(r,3)),i.setAttribute("color",new c.BufferAttribute(f,3)),i.setAttribute("uv",new c.BufferAttribute(g,2)),i.setIndex(new c.BufferAttribute(new Uint32Array(w),1)),i}const vn=await fn();await G.yield();const dn=await un(ro,na,(t,e)=>$o(t,e),()=>1,!1),ma=Tt(zt,pt,.18),ao=Tt(pt,zt,.45);{const t=ao.r*.3+ao.g*.6+ao.b*.1;ao.lerp(new c.Color(t,t,t*.9),.28)}const mn=Tt(se,new c.Color(.24,.17,.07),.72).multiplyScalar(.62),gn=vt==="monsoon"?.04:vt==="figs"?.22:.4,pn=jt?new c.Color(.12,.18,.32):Tt(le,new c.Color(.7,.92,1),tt==="day"?.7:.45).multiplyScalar(tt==="day"?1.25:1.7),uo={uLeafA:{value:ma},uLeafB:{value:ao},uLeafC:{value:mn},uFlush:{value:gn},uSkyGlow:{value:pn},uFig:{value:vt==="figs"?1:.35}},ga=(t,e)=>{const a=t.r*.3+t.g*.6+t.b*.1;return t.clone().lerp(tt==="night"?new c.Color(a*.78,a*1,a*1.1):new c.Color(a*1.12,a*.97,a*.62),tt==="night"?.55:e)},pa=(tt==="day"?.42:.36)+(vt==="monsoon"?.08:0),Ae={...uo,uLeafA:{value:ga(ma,Math.min(.7,pa*1.3))},uLeafB:{value:ga(ao,pa)},uDomeK:{value:tt==="day"?.7:tt==="night"?.6:1},uGlint:{value:tt==="day"?.2:tt==="night"?.6:.7},uAir:{value:tt==="night"?new c.Vector4(.085,.13,.23,.6):tt==="day"?new c.Vector4(.6,.68,.7,.36):new c.Vector4(.8,.64,.46,.3)},uSunTint:{value:tt==="day"?new c.Vector3(1.14,1,.7):new c.Vector3(1,1,1)},uSunLow:{value:yo},uGust:{value:new c.Vector4(.34,-.94,0,11)},uShadeK:{value:tt==="day"?2.5:tt==="night"?.23:1}};{const t=Ae.uLeafA.value.clone().lerp(Ae.uLeafB.value,.5),e=new c.Vector3(t.r*.86,t.g,t.b*.98);e.lerp(new c.Vector3(1,1,1).multiplyScalar((e.x+e.y+e.z)/3),.2);const a=e.x*.3+e.y*.6+e.z*.1;Ae.uFill={value:new c.Vector4(e.x/Math.max(a,1e-5),e.y/Math.max(a,1e-5),e.z/Math.max(a,1e-5),tt==="day"?.064:tt==="night"?.02:.055)}}const Eo=`
    uniform vec4 uAir, uGust, uFill; uniform vec3 uSunTint, uSunLow; uniform float uShadeK;
    // the crown's deepest shade is lifted to the sky's fill (the darkest most, the lit not at all) by where the LEAF is:
    // m says how open to the sky its place is (0 deep in a crease, 1 on a head) and y is its height in the crown (the
    // heads stand in the open sky; the hem at the rim hangs in the tree's own shade and takes rather over half the fill)
    vec3 domeFill(vec3 col, float m, float y){
      col = max(col, vec3(0.));
      float l = dot(col, vec3(.3, .6, .1)), lf = uFill.w * (1. + .35 * clamp(m, 0., 1.));
      float l2 = max(l, lf * .8 + l * .2);            // nothing darker than the fill; what was darker keeps a fifth of its own modelling
      return col + uFill.rgb * (l2 - l) * (.58 + .42 * smoothstep(6., 18., y));
    }
    vec3 domeAir(vec3 col, vec2 p, float dist, float crown, float back, float well){
      float hol = (1. - crown) * (.3 + .7 * vnoise(p * .018 + vec2(uHall.z * .012, 0.)));
      float low = 1. - smoothstep(10., 26., uCam.y);                              // from inside the court the lip is leaf against the sky, green not gold
      if (low > .001) {      // gold-green crowns and blue-green ones, a copper flush here and there, dark between the leaf heads: foliage, never rock
        float lum = dot(col, vec3(.3, .6, .1)), kind = smoothstep(.35, .65, vnoise(p * .05 + 7.));
        vec3 leafy = lum * mix(vec3(.62, 1.14, .3), vec3(.4, .98, .66), kind);
        leafy = mix(leafy, lum * vec3(1.3, .64, .3), smoothstep(.6, .78, vnoise(p * .11 + 2.)) * (.25 + 1.2 * uFlush) * smoothstep(24., 62., dist));
        leafy *= .56 + .8 * (vnoise(p * .8) * .55 + vnoise(p * 2.1 + 4.) * .45);
        col = mix(col, leafy, low * .88);
      }
      float air = uAir.w * ((1. - exp(-dist * .0021)) * .62 + hol * (.03 + .31 * smoothstep(50., 240., dist))) * well * (1. - .7 * low);
      return mix(col, uAir.rgb * (1. + .35 * back * back), clamp(air, 0., .8));
    }
    float gustBand(vec2 p, float tt){      // one pale front of turned leaves running over the crowns ahead of us, on the wind we ride
      float s = dot(p, uGust.xy) - uGust.z + (vnoise(p * .021 + 3.) - .5) * 30. + (vnoise(p * .09) - .5) * 7.;
      return (1. - smoothstep(uGust.w * .3, uGust.w, abs(s))) * (.55 + .45 * smoothstep(.25, .6, vnoise(p * .045 + vec2(tt * .2, 0.))));
    }
    vec3 domeShade(){ return (uSkyAmb * .42 + uShade * .95) * vec3(.7, .98, 1.14); }      // the shadow side of a crown: blue-green`,Ge=`
    uniform vec3 uLeafA, uLeafB, uLeafC, uSkyGlow; uniform float uFlush, uFig;
    vec4 leafCell(vec2 p){        // x coverage, y id, z along, w across (leaf space, -1..1)
      vec2 i = floor(p), f = fract(p); float id = hash21(i);
      vec2 c = vec2(.3) + .4 * vec2(hash21(i + 7.7), hash21(i + 3.1));
      float a = id * 6.283; vec2 d = vec2(cos(a), sin(a)); vec2 r = f - c;
      float along = dot(r, d) * 3.4, across = dot(r, vec2(-d.y, d.x)) * 6.2;
      float e = 1. - smoothstep(.6, 1., length(vec2(along, across)));
      return vec4(e, id, along, across);
    }
    vec4 leafCellB(vec2 p){       // bigger blades, for the crown seen from the air (the small ones leave it four fifths gap)
      vec2 i = floor(p), f = fract(p); float id = hash21(i);
      vec2 c = vec2(.34) + .32 * vec2(hash21(i + 7.7), hash21(i + 3.1));
      float a = id * 6.283; vec2 d = vec2(cos(a), sin(a)); vec2 r = f - c;
      float along = dot(r, d) * 2.5, across = dot(r, vec2(-d.y, d.x)) * 4.1;
      float e = 1. - smoothstep(.62, .92, length(vec2(along, across)));
      return vec4(e, id, along, across);
    }
    vec3 leafColor(float id, float pch){
      vec3 c = mix(uLeafA, uLeafB, smoothstep(.2, .9, fract(id * 7.3)));
      return mix(c, uLeafC, step(1. - uFlush * (.1 + 1.1 * pch), fract(id * 3.7)));
    }
    vec3 leafField(vec2 q, vec3 avgLeaf, float pch, out float cover){     // three layers of blades over the dark between them
      vec4 lc = leafCellB(q * .8), lc2 = leafCellB(mat2(.8, -.6, .6, .8) * q + 9.3), lc3 = leafCellB(mat2(.6, .8, -.8, .6) * q * .9 + 3.1);
      vec3 c = mix(avgLeaf * .68, leafColor(lc3.y, pch) * (.7 + .4 * fract(lc3.y * 9.7)), lc3.x);
      c = mix(c, leafColor(lc2.y, pch) * (.8 + .5 * fract(lc2.y * 13.7)), lc2.x);
      c = mix(c, leafColor(lc.y, pch) * (.9 + .6 * fract(lc.y * 5.3)) * (.72 + .28 * smoothstep(0., .22, abs(lc.w))), lc.x);
      cover = max(lc.x, max(lc2.x, lc3.x * .8));
      return c;
    }`,xa=`
    vec3 mounds(vec2 p){          // rounded heads of leaf with creases between: x height, yz slope away from the head's centre
      vec2 i = floor(p), f = fract(p); float best = 8.; vec2 bd = vec2(0.);
      for (int yy = -1; yy <= 1; yy++) for (int xx = -1; xx <= 1; xx++) {
        vec2 g = vec2(float(xx), float(yy));
        vec2 o = vec2(hash21(i + g), hash21(i + g + 17.3));
        vec2 d = g + o - f; float dd = dot(d, d);
        if (dd < best) { best = dd; bd = d; }
      }
      float h = sqrt(max(1. - min(best * 1.35, 1.), 0.));
      return vec3(h, bd * 1.6 / max(h, .4));
    }`,xn=Vt({uniforms:{...Ae},vertexColors:!0,vertexShader:Ao,fragmentShader:`
      varying vec3 vP, vN, vC; varying vec2 vUv;
      ${_t}
      ${Ge}
      ${ae}
      uniform float uDomeK, uGlint;
      ${xa}
      ${Eo}
      void main(){
        vec2 p = vP.xz;
        if (vUv.y < 2.6 * vnoise(p * .7) + .2) discard;                    // ragged hem of the skirt
        if (vUv.x < -1.2 + 2.4 * vnoise(p * .9 + 5.)) discard;             // ragged lip of the oculus
        float dist = length(vP - uCam), df = 1. - smoothstep(34., 120., dist);
        vec2 pw = p + (vec2(vnoise(p * .11), vnoise(p * .11 + 9.)) - .5) * 9. + (vec2(vnoise(p * .85 + 2.), vnoise(p * .85 + 7.)) - .5) * 1.7;   // leafy, not ruled, creases
        vec3 m1 = mounds(pw / 6.2 + 3.), m2 = mounds(pw / 2.3 - 7.);
        float d2 = 1. - smoothstep(110., 420., dist);
        float h = min(m1.x, mix(1., .35 + .65 * m2.x, d2));
        vec2 sl = m1.yz * .6 + m2.yz * .5 * d2 + (vec2(vnoise(p * .8), vnoise(p * .8 + 5.)) - .5) * .5 * d2;
        vec3 Ng = normalize(vN + vec3(0., 1e-4, 0.));
        vec3 N = normalize(Ng + vec3(-sl.x, 0., -sl.y));
        float sh = mix(.5, .36, df) + mix(.5, .64, df) * smoothstep(0., .6, h);              // far off the florets close up: crowns, not moss
        // leaves: big leathery ovals, each tilted its own way, dark between them
        float pch = smoothstep(.3, .75, vnoise(p * .1 + 11.) * .6 + vnoise(p * .03 + 4.) * .4), cover;
        vec3 avgLeaf = mix(mix(uLeafA, uLeafB, .4), uLeafC, uFlush * (.05 + .45 * pch));
        vec3 nearLeaf = leafField(p, avgLeaf, pch, cover);
        float steep = 1. - smoothstep(.62, .84, Ng.y);                 // on a steep flank the leaves are laid on the slope, not smeared down it
        if (steep > .01 && df > .01) {
          vec2 tgd = normalize(vec2(-Ng.z, Ng.x) + vec2(1e-4, 0.)); float cv2;
          nearLeaf = mix(nearLeaf, leafField(vec2(dot(p, tgd), vP.y * 1.05), avgLeaf, pch, cv2), steep); cover = mix(cover, cv2, steep);
        }
        float crown = smoothstep(.02, .55, vC.r);                      // 0 in the creases between sub-crowns, 1 on their heads
        vec3 alb = mix(avgLeaf, nearLeaf * 1.12, df) * sh * (.36 + .7 * crown);            // dark in the creases where heads meet
        alb *= mix(vec3(1.12, 1., .74), vec3(.8, .97, 1.1), smoothstep(.25, .75, vnoise(p * .023 + 3.) * .6 + vnoise(p * .071) * .4)) * uDomeK;   // crown to crown: yellower, bluer
        // the well: from far above a dark hole (its lip in shadow to well back from the edge); as we come down into it the lip lights up
        float well = mix(1., smoothstep(1., 24., vUv.x), (1. - uMist.w) / .8);
        // gust fronts: bands of paler leaf (undersides turned up) sweep across the dome, the leaves in them fluttering
        float tt = uHall.z;
        float gb = vnoise(p * .012 + vec2(tt * .1, tt * .04)) * .7 + vnoise(p * .035 - vec2(tt * .16, tt * .05)) * .3;
        float gband = gustBand(p, tt), gust = max(smoothstep(.5, .7, gb) * .6, gband), flut = vnoise(p * 1.1 + vec2(tt * 2.3, -tt * 1.9));
        alb = mix(alb, alb * vec3(1.7, 1.8, 1.55) + vec3(.02, .028, .02), gust * (.4 + .6 * flut) * .85);
        alb = mix(alb, alb * 1.5 + vec3(.05, .075, .055), gband * (.5 + .5 * flut) * .8);             // the band itself: undersides turned up, grey-green
        // the big form decides: the sunward flank and the top of each sub-crown are lit, the far flank and whatever lies in
        // the next crown's long shadow fall to blue-green shade; the leaf heads on it model the light, they do not replace it
        float reach = vC.g;
        float difG = smoothstep(-.04, .58, dot(Ng, uSunLow)) * mix(.04, 1., reach);
        float difD = max(dot(N, uSunLow), 0.); difD = difD / (difD + .3) * 1.3;
        float dif = difG * (.42 + .58 * difD);
        dif *= mix(1., .05 + .95 * smoothstep(.45, .92, Ng.y) * crown, uWx.w);                   // by night the moon silvers only the tops of the crowns
        vec3 V = normalize(uCam - vP + vec3(0., 1e-4, 0.));
        float back = max(dot(-V, uSunH), 0.), rim = 1. - max(dot(N, V), 0.);
        vec3 amb = domeShade() * (.72 + .28 * N.y) * (.36 + .56 * crown) * uShadeK;
        vec3 lit = uSunCol * uSunTint * (dif * 1.2 + .28 * back * back * rim * rim * reach) + amb * (.5 + .5 * well);
        vec3 col = alb * lit * (.3 + .7 * well) * (1. - .34 * uWx.w);              // by night the dome is a deep blue-green mass, darker than the sky behind it
        float sp = max(dot(reflect(-uSunDir, N), V), 0.); sp *= sp; sp *= sp;
        col += uSunCol * sp * sp * .12 * sh * cover * df * reach * uGlint;                    // leathery leaves glint
        col = domeFill(col, (.3 + .7 * smoothstep(0., .6, h)) * (.4 + .6 * crown) * (.55 + .45 * cover * df + .45 * (1. - df)), vP.y);
        col = domeAir(col, p, dist, crown, back, well);
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`}),Qo=new c.Mesh(vn,xn);Qo.frustumCulled=!1,E.add(Qo),Qt.court.push(Qo);const ya=t=>`
    vec3 roofCol(vec2 pw){
      float t = uHall.z;
      vec2 p = pw + (vec2(vnoise(pw * .4 + t * .25), vnoise(pw * .4 - t * .21 + 9.)) - .5) * .7;
      ${t?"float gap = textureLod(uMask, p * uHall.w + .5, 0.).r, soft = textureLod(uMask, p * uHall.w + .5, 3.).r;":"float gap = texture2D(uMask, p * uHall.w + .5).r, soft = texture2D(uMask, p * uHall.w + .5, 3.).r;"}
      float b = vnoise(p * 1.7) * .6 + vnoise(p * 5.1) * .4;
      vec4 lc = leafCell(p * .8 + b);
      vec4 lcb = leafCell(mat2(.8, -.6, .6, .8) * p * 1.1 + 4.7); if (lcb.x > lc.x) lc = lcb;
      float pin = smoothstep(.8, .93, vnoise(p * 2.7 + 3.)) * .5;
      float open = smoothstep(.3, .66, gap * 1.2 + pin - b * .5);
      vec4 la = leafCellB(p * .55 + 3.3), lb = leafCellB(mat2(.8, -.6, .6, .8) * p * .8 + 7.1), lc3 = leafCellB(mat2(.6, .8, -.8, .6) * p * 1.15 + 1.9);
      float lace = max(max(la.x, lb.x), lc3.x);
      lace = max(lace, smoothstep(.42, .6, vnoise(p * .55 + 1.) * .6 + vnoise(p * 1.9 + 6.) * .4));                    // whole sprays hang across
      float twig = 1. - smoothstep(.02, .07, abs(vnoise(p * .3 + 4.) * 7. - floor(vnoise(p * .3 + 4.) * 7.) - .5));
      float hole = open * (1. - lace) * (1. - .85 * twig) * (1. - .75 * lc.x * (1. - gap));
      float pch = smoothstep(.35, .7, vnoise(p * .035 + 11.));
      vec3 leaf = mix(uLeafA * .8, mix(uLeafA, leafColor(lc.y, pch), .6), lc.x);
      float clump = .55 + .45 * smoothstep(.3, .7, vnoise(p * .22 + 2.));
      leaf = mix(leaf, uLeafB, .3);
      vec3 col = leaf * (uBounce * 1.7 + uShade * 1.5) * (.6 + .6 * lc.x) * clump * vec3(1.15, 1.6, 1.05);      // leaf-green by the light off the floor, never black
      col += leaf * uSunCol * (.035 + .16 * soft) * (.4 + b) * (.4 + lc.x);              // sun soaking through the leaves
      col += leafColor(la.y + lb.y, pch) * vec3(1.25, 1.2, .5) * uSunCol * open * lace * (1. - .6 * twig) * (.22 + .3 * b);   // the leaves across a gap glow green-gold
      return mix(col, uSkyGlow, hole);
    }`,yn=ya(!1),wn=Vt({uniforms:{...uo},vertexColors:!0,vertexShader:Ao,fragmentShader:`
      varying vec3 vP, vN, vC; varying vec2 vUv;
      ${_t}
      ${Ge}
      ${yn}
      ${ae}
      void main(){
        float e = (vUv.x - .6) / 5.5;                                   // metres in from the lip of the light well
        if (e < 1.) {
          vec2 q = vP.xz * .5;
          float lf = max(max(leafCellB(q).x, leafCellB(mat2(.8, -.6, .6, .8) * q * 1.4 + 3.7).x), leafCellB(mat2(.6, .8, -.8, .6) * q * .8 + 9.1).x * .9);
          if (lf * (.45 + .8 * vnoise(vP.xz * .23 + 5.)) < 1. - e) discard;
        }
        vec3 col = hallHaze(roofCol(vP.xz), vP);
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`}),wa=new c.Mesh(dn,wn);wa.frustumCulled=!1,E.add(wa);let Bo=null;{const t=Math.min(ot.ax,ot.bx)-26,e=Math.max(ot.ax,ot.bx)+26,a=Math.min(ot.az,ot.bz)-26,d=Math.max(ot.az,ot.bz)+26,b=p=>{const x=new c.BufferGeometry;return x.setAttribute("position",new c.BufferAttribute(new Float32Array([t,p,a,e,p,a,e,p,d,t,p,d]),3)),x.setIndex([0,2,1,0,3,2]),x},y="varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",o=new c.Mesh(b(ot.y-.02),Vt({fog:!1,depthWrite:!1,side:c.DoubleSide,uniforms:{...uo},vertexShader:y,fragmentShader:`
        varying vec3 vP;
        ${_t}
        ${Ge}
        ${ya(!0)}
        void main(){
          if (poolD(vP.xz) > .6) discard;
          vec3 v = vP - uCam; float d = length(v); vec3 vd = v / max(d, 1e-3);
          vec3 R = normalize(vec3(vd.x, max(abs(vd.y), .03), vd.z));
          float t = min((uHall.x + 1.2 - vP.y) / R.y, 420.);
          vec3 Pr = vP + R * t;
          // the mirror shows the dark roof and its lace of gaps; only the far water whitens toward the haze
          // (softened: the lace of gaps is a glow, not a speckle), and the far water is all lit haze
          vec3 Ph = vP + R * min(t, 230.);
          float soft = textureLod(uMask, Pr.xz * uHall.w + .5, 3.5).r;
          vec3 calm = uLeafA * (uBounce * 1.1 + uShade * .5) * .42 + uSkyGlow * soft * .16 + uLeafB * uSunCol * soft * .05;
          vec3 col = hallHaze(mix(roofCol(Pr.xz), calm, .72), vec3(Ph.x, max(Ph.y, 9.), Ph.z)) * .86;
          gl_FragColor = vec4(col, 1.);
        }`}));o.frustumCulled=!1,o.renderOrder=-6,E.add(o);const s=new c.Mesh(b(ot.y-.01),Vt({fog:!1,colorWrite:!1,side:c.DoubleSide,vertexShader:y,fragmentShader:`
        varying vec3 vP;
        ${_t}
        void main(){ if (poolD(vP.xz) > .6) discard; gl_FragColor = vec4(0.); }`}));s.frustumCulled=!1,s.renderOrder=-4,E.add(s);const r=new c.Mesh(b(ot.y),Vt({fog:!1,transparent:!0,depthWrite:!1,side:c.DoubleSide,vertexShader:y,fragmentShader:`
        varying vec3 vP;
        ${_t}
        void main(){
          float pd = poolD(vP.xz);
          if (pd > 0.) discard;
          vec2 p = vP.xz; float t = uHall.z;
          vec3 v = vP - uCam; float d = length(v); vec3 vd = v / max(d, 1e-3);
          // looked along, the water is a mirror; looked down into, it is clear and tea-coloured over a bed of sunk leaves
          float gz = 1. - clamp(abs(vd.y), 0., 1.);
          float F = clamp(.05 + 1.25 * gz * gz * gz, 0., 1.);
          float depth = smoothstep(0., 9., -pd), shallow = 1. - smoothstep(0., 3.5, -pd);
          vec2 bp = p + vd.xz * (.5 + 1.5 * depth);                                          // the bed lies under the surface
          float bedN = vnoise(bp * 1.7) * .55 + vnoise(bp * 5.3) * .45, bedL = vnoise(bp * .23 + 4.);
          vec3 bedA = mix(vec3(.2, .14, .07), vec3(.42, .3, .13), smoothstep(.35, .75, bedN));    // ochre and copper leaves lying on the mud
          bedA = mix(bedA, vec3(.1, .075, .04), smoothstep(.55, .8, bedL) * .6);
          bedA *= mix(vec3(1.), vec3(.62, .46, .24), depth);                                  // deeper, the tea of the water takes over
          float sv = sunVis(vP), kv = skyVis(vP);
          vec3 bed = bedA * (uShade * .9 + uBounce * 1.5 + uSkyAmb * (.35 + .6 * kv) + uSunCol * sv * (.55 + .3 * bedN));
          // slow rings where a fig or a drop has fallen, each cell in its own time
          vec2 g = p / 7.; vec2 gi = floor(g); float ring = 0.;
          vec2 c = (gi + .25 + .5 * vec2(hash21(gi), hash21(gi + 5.3))) * 7.;
          float age = fract(t * .11 + hash21(gi + 9.1)), rr = length(p - c);
          ring = (1. - smoothstep(0., .26, abs(rr - age * 4.2))) * (1. - age) * (1. - age) * smoothstep(.05, .2, age);
          ring += .6 * (1. - smoothstep(0., .22, abs(rr - age * 2.7))) * (1. - age) * (1. - age) * smoothstep(.1, .3, age);
          vec2 g2 = (p + 3.5) / 7.; vec2 gj = floor(g2);
          vec2 c2 = (gj + .25 + .5 * vec2(hash21(gj + 2.2), hash21(gj + 7.9))) * 7. - 3.5;
          float age2 = fract(t * .09 + hash21(gj + 4.4)), rr2 = length(p - c2);
          ring += (1. - smoothstep(0., .26, abs(rr2 - age2 * 4.2))) * (1. - age2) * (1. - age2) * smoothstep(.05, .2, age2);
          // a breath of wind now and then roughens a patch: the mirror dulls there
          float ruf = smoothstep(.62, .8, vnoise(p * .09 + vec2(t * .05, -t * .03))) * (.5 + .5 * vnoise(p * vec2(3.1, 1.3) + t * .6));
          vec3 sheen = uSkyAmb * (.5 + .6 * kv) + uHazeCol * .6 + uSunCol * sv * .12;
          // a pale meniscus where the water meets the mud
          float lip = (1. - smoothstep(0., .22, -pd)) * .5;
          vec3 col = bed + sheen * (ring * .8 + ruf * .45 + lip);
          float a = clamp((1. - F) * .96 + ring * .45 + ruf * .4 + lip, 0., .97);
          {
            // rafts of lily pads in the quiet water off the shores: flat green plates, each with its notch, the sun's bars lying on them
            float raft = smoothstep(.46, .6, vnoise(p * .1 + 17.) * .65 + vnoise(p * .29 + 5.) * .35) * smoothstep(.4, 2.2, -pd) * (1. - smoothstep(9., 15., -pd));
            vec2 lg = p / 1.05, li = floor(lg), lf = fract(lg) - .5;
            vec2 ld = lf - (vec2(hash21(li + 3.1), hash21(li + 8.7)) - .5) * .42;
            float lr = .2 + .22 * hash21(li + 1.9), ldist = length(ld);
            float la = atan(ld.y, ld.x + 1e-5) + hash21(li) * 6.283;
            float notch = step(.2, abs(sin(la * .5))) + step(ldist, lr * .18);
            float aa = clamp(fwidth(ldist) * 1.5, .01, .2);
            float pad = (1. - smoothstep(lr - aa, lr, ldist)) * min(notch, 1.) * step(hash21(li + 5.5), raft * 1.15);
            vec3 padA = mix(vec3(.05, .13, .035), vec3(.16, .3, .07), hash21(li + 2.7)) * (.8 + .2 * smoothstep(.0, .06, abs(sin(la * 5.))) ) * (1. - .25 * smoothstep(lr * .3, lr, ldist));
            vec3 padC = padA * (uShade * .9 + uBounce * .4 + uSkyAmb * (.5 + .7 * kv) + uSunCol * sv * .8) + sheen * .1 * gz * gz;
            col = mix(col, padC, pad); a = max(a, pad * .97);
          }
          // ground mist lies on the water too
          float mist = clamp(uMist.x * 5. * (1. - exp(-d * .012)) * smoothstep(.3, .75, vnoise(p * .06 + vec2(t * .02, 0.))), 0., .5);
          col = mix(col, uMistCol * (.7 + .3 * kv) + uSunCol * uMist.z * sv * .5, mist);
          a = max(a, mist);
          gl_FragColor = vec4(col * uMist.w, a);
        }`}));r.frustumCulled=!1,r.renderOrder=2,E.add(r);const f=p=>p-Math.floor(p),g=(p,x)=>{let h=f(p*123.34),k=f(x*456.21);const L=h*(h+45.32)+k*(k+45.32);return h+=L,k+=L,f(h*k)},u=(p,x)=>{const h=Math.floor(p),k=Math.floor(x);let L=p-h,n=x-k;return L=L*L*(3-2*L),n=n*n*(3-2*n),lt(lt(g(h,k),g(h+1,k),L),lt(g(h,k+1),g(h+1,k+1),L),n)},w=Ie.map(p=>p.split(",").map(Number)),i=(p,x)=>{const h=ot.bx-ot.ax,k=ot.bz-ot.az,L=xt(((p-ot.ax)*h+(x-ot.az)*k)/(h*h+k*k),0,1),n=Math.hypot(p-ot.ax-h*L,x-ot.az-k*L)-(ot.w+6*u(p*.07+3,x*.07+3)+2*u(p*.31,x*.31)),B=1.2*u(p*.45+7,x*.45+7)+.5*u(p*1.3,x*1.3);let V=1e9;for(let S=0;S<8;S+=2)V=Math.min(V,Math.hypot(p-w[S][0],x-w[S][1])-w[S+1][0]-B);return[Math.max(n,-V),V]},l=ct("rushes"),v=[];for(let p=0,x=0;p<460&&x<3e4;x++){const h=x%3===0,k=h?l.range(-13,13):l.range(t+4,e-4),L=h?l.range(19,39):l.range(a+4,d-4),n=i(k,L);n[0]<-1.3||n[0]>1.1||!h&&u(k*.16+11,L*.16)<.5||dt(k,1.5,L)<5.2||(v.push(k,n[0]<0?ot.y-.05:bt(k,L)-.05,L,l.range(0,Math.PI),l.range(.9,1.9)*(n[0]<0?1.1:.85),l()),p++)}const m=v.length/6;if(m){const p=new Float32Array(m*24),x=new Float32Array(m*24),h=new Float32Array(m*16),k=new Uint32Array(m*12);for(let S=0;S<m;S++)for(let N=0;N<2;N++){for(let R=0;R<4;R++){const M=(S*2+N)*4+R;p[M*3]=v[S*6],p[M*3+1]=v[S*6+1],p[M*3+2]=v[S*6+2],x[M*3]=v[S*6+3]+N*1.571,x[M*3+1]=v[S*6+4],x[M*3+2]=v[S*6+5],h[M*2]=R===0||R===3?-1:1,h[M*2+1]=R<2?0:1}const z=(S*2+N)*4;k.set([z,z+1,z+2,z,z+2,z+3],(S*2+N)*6)}const L=new c.BufferGeometry;L.setAttribute("position",new c.BufferAttribute(p,3)),L.setAttribute("aT",new c.BufferAttribute(x,3)),L.setAttribute("uv",new c.BufferAttribute(h,2)),L.setIndex(new c.BufferAttribute(k,1));const n=S=>Vt({side:c.DoubleSide,vertexShader:`
          attribute vec3 aT; uniform vec4 uHall;
          varying vec3 vP; varying vec2 vUv; varying float vS;
          ${ue}
          void main(){
            float h = aT.y, sd = aT.z, t = uHall.z;
            vec3 r = vec3(cos(aT.x), 0., sin(aT.x));
            float gust = sin(dot(position.xz, vec2(.21, .17)) - t * 1.1) * .5 + .5;
            vec3 P = position + r * uv.x * h * .5 + vec3(0., uv.y * h, 0.);
            P.xz += vec2(sin(t * 1.7 + sd * 40.), cos(t * 1.3 + sd * 23.)) * uv.y * uv.y * h * (.04 + .08 * gust);
            vP = P; vUv = uv; vS = sd;
            vec4 mvPosition = modelViewMatrix * vec4(P.x, ${S?(2*ot.y).toFixed(2)+" - P.y":"P.y"}, P.z, 1.);
            gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          varying vec3 vP; varying vec2 vUv; varying float vS;
          ${_t}
          ${ae}
          void main(){
            float x = vUv.x, y = vUv.y;
            float far = smoothstep(12., 40., length(vP - uCam));
            float bl = x / max(.16 + .84 * y, 1e-3) * 3.2 + vS * 7.;
            float w = abs(fract(bl) - .5), hgt = mix(.45 + .55 * hash11(floor(bl) + vS * 31.), .9, far * .7);
            if (w > mix(.26, .5, far) * (1. - .8 * y / hgt) || y > hgt || abs(x) > .16 + .84 * y) discard;
            vec3 alb = mix(vec3(.035, .075, .03), vec3(.2, .3, .09), smoothstep(.05, .9, y / hgt)) * (.75 + .5 * hash11(floor(bl) * 1.7 + vS * 3.));
            alb = mix(alb, vec3(.2, .12, .05), step(.8, hash11(floor(bl) + vS * 13.)) * smoothstep(.78, .86, y / hgt));       // a brown seed head here and there
            vec3 v = vP - uCam; vec3 vd = v / max(length(v), 1e-3);
            float thru = max(dot(vd, uSunDir), 0.);
            vec3 col = alb * (hallLight(vP, vec3(0., 1., 0.), .4 + .6 * y) * 1.1 + uSunCol * sunVis(vP) * (.3 + .8 * thru * thru));
            col = hallHaze(col, vP)${S?" * .8":""};
            gl_FragColor = vec4(col, 1.);
            #include <fog_fragment>
          }`});Bo=n(!1);const B=new c.Mesh(L,Bo);B.frustumCulled=!1,E.add(B);const V=new c.Mesh(L,n(!0));V.frustumCulled=!1,V.renderOrder=-4.7,E.add(V)}}await G.yield();{const t=[],e=Math.round(1500*wt),a=Rt.length/4;for(let u=0,w=0;u<e&&w<e*6;w++){const i=T.int(de,et),l=T.range(0,q),v=42*Math.sqrt(T());let m=Z[i]+Math.cos(l)*v,p=at[i]+Math.sin(l)*v,x=Ht(m,p)+1-T.range(0,2.3);const h=T.chance(.3)&&a>0,k=T.int(0,Math.max(0,a-1))*4;if(h&&(m=Rt[k]+T.range(-1,1),x=Rt[k+1]+.8,p=Rt[k+2]+T.range(-1,1)),Lt(m,p)>.95||kt(m,p)<F.r+2)continue;const L=h?T.range(1.2,2.4):T.range(1.8,4.2);dt(m,x-L,p)<5.4||(t.push(m,x,p,L,T.range(0,q),T.range(-.35,.35),0,T()),u++)}{const u=ct("lip");for(let w=0;w<Math.round(560*(.6+.4*wt));w++){const i=u.range(0,q),l=u.chance(.55),v=l?u.range(-.6,5.5):u.range(-.4,9)*u(),m=F.x+Math.cos(i)*(F.r+v),p=F.z+Math.sin(i)*(F.r+v),x=l?u.range(2.2,4.6):u.range(1.6,3.2),h=ee(m,p,v)-(l?.2:.5);dt(m,h+(l?-x:x)*.5,p)<6.5||t.push(m,h,p,x,i+Math.PI/2+u.range(-.7,.7),u.range(-.5,.3),l?0:1,u())}}const d=t.length/8,b=new Float32Array(d*12),y=new Float32Array(d*16),o=new Float32Array(d*12),s=new Uint32Array(d*6);for(let u=0;u<d;u++){for(let w=0;w<4;w++){const i=u*4+w,l=w===0||w===3?-1:1,v=w<2?0:1;b[i*3]=t[u*8],b[i*3+1]=t[u*8+1],b[i*3+2]=t[u*8+2],y[i*4]=l,y[i*4+1]=v,y[i*4+2]=t[u*8+3],y[i*4+3]=t[u*8+7],o[i*3]=t[u*8+4],o[i*3+1]=t[u*8+5],o[i*3+2]=t[u*8+6]}s.set([u*4,u*4+1,u*4+2,u*4,u*4+2,u*4+3],u*6)}const r=new c.BufferGeometry;r.setAttribute("position",new c.BufferAttribute(b,3)),r.setAttribute("aCard",new c.BufferAttribute(y,4)),r.setAttribute("aRot",new c.BufferAttribute(o,3)),r.setIndex(new c.BufferAttribute(s,1));const f=Vt({uniforms:{...uo},side:c.DoubleSide,vertexShader:`
        attribute vec4 aCard; attribute vec3 aRot;
        uniform vec4 uHall;
        varying vec3 vP, vN; varying vec2 vUv; varying vec2 vK;
        ${ue}
        void main(){
          float kind = aRot.z, sz = aCard.z, t = uHall.z;
          vec3 right = vec3(cos(aRot.x), 0., sin(aRot.x));
          vec3 fw = vec3(-right.z, 0., right.x);
          float dirY = kind < .5 ? -1. : 1.;                       // sprays under the roof hang down
          vec3 up = normalize(vec3(0., dirY, 0.) + fw * aRot.y);
          float gust = sin(dot(position.xz, vec2(.06, .045)) - t * .9 + aCard.w * 6.283);
          float fl = aCard.y * (.06 + .1 * (.5 + .5 * gust)) * sz;
          vec3 P = position + right * aCard.x * sz * .62 + up * aCard.y * sz
                 + fw * fl * sin(t * 2.3 + aCard.w * 40. + aCard.x) + right * fl * .5 * sin(t * 1.7 + aCard.w * 17.);
          vP = P; vN = normalize(cross(right, up)); vUv = vec2(aCard.x * .5 + .5, aCard.y); vK = vec2(kind, aCard.w);
          vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        varying vec3 vP, vN; varying vec2 vUv; varying vec2 vK;
        ${_t}
        ${Ge}
        ${ae}
        void main(){
          vec2 q = vUv * vec2(4.4, 5.2) + vK.y * 13.;
          vec4 a = leafCell(q), b = leafCell(mat2(.8, -.6, .6, .8) * q * 1.13 + 5.37);
          vec4 lc = a.x > b.x ? a : b;
          vec4 c3 = leafCell(mat2(.6, .8, -.8, .6) * q * .9 + 2.1); if (c3.x > lc.x) lc = c3;
          float env = smoothstep(0., .12, vUv.y) * (1. - smoothstep(.8, 1., vUv.y)) * (1. - smoothstep(.72, 1., abs(vUv.x * 2. - 1.)));
          float twig = (1. - smoothstep(.012, .03, abs(vUv.x - .5 + .08 * sin(vUv.y * 7. + vK.y * 9.)))) * step(vUv.y, .8);
          if (lc.x * env < .2 && twig < .5) discard;
          vec3 alb = leafColor(lc.y + vK.y, .6) * (.6 + .4 * smoothstep(.0, .22, abs(lc.w)));       // pale midrib
          float fig = uFig * step(.82, fract(lc.y * 11.3)) * step(length(vec2(lc.z, lc.w) - vec2(.5, .3)), .3);
          alb = mix(alb, vec3(.6, .04, .03), fig);
          alb = mix(alb, vec3(.09, .07, .05), twig * (1. - lc.x));
          vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
          vec3 V = normalize(uCam - vP + vec3(0., 1e-4, 0.));
          if (dot(N, V) < 0.) N = -N;
          vec3 col;
          float thru = max(dot(-V, uSunDir), 0.);
          if (vK.x > .5 && vK.x < 1.5) {                     // on the crown: full sun, glowing through when backlit
            col = alb * (uSunCol * (.25 + .6 * max(dot(N, uSunDir), 0.) + .9 * thru * thru) + uSkyAmb * .5 + uShade * .3);
          } else {
            float sv = sunVis(vP);
            col = alb * .75 * (hallLight(vP, N, 1.) + uSunCol * sv * (.35 + 1.1 * thru * thru));
            col = hallHaze(col, vP);
          }
          gl_FragColor = vec4(col, 1.);
          #include <fog_fragment>
        }`}),g=new c.Mesh(r,f);g.frustumCulled=!1,E.add(g)}await G.yield();const ba=[],Et=[],Ye=[];function Be(t,e,a,d,b,y,o,s,r,f,g,u,w,i,l,v,m){const p=Math.hypot(b,y,o)||1;b/=p,y/=p,o/=p;let x=y*f-o*r,h=o*s-b*f,k=b*r-y*s;const L=Math.hypot(x,h,k)||1;x/=L,h/=L,k/=L;for(let n=0;n<u;n++){const B=(n+.6)/u,V=n%2?1:-1,S=n===u-1?.15:.95;Et.push(e+b*g*B,a+y*g*B-m*B*B*g,d+o*g*B,b*.6+x*V*S+t.range(-.25,.25),y*.6+h*V*S-m*(.5+B)+t.range(-.2,.2),o*.6+k*V*S+t.range(-.25,.25),s+t.range(-.4,.4),r+t.range(-.4,.4),f+t.range(-.4,.4),w*t.range(.75,1.15),t(),i,l,v)}}{const t=ct("clumps"),e=[],a=[],d=(n,B,V,S,N)=>{(dt(n,B,V)<12.5?e:a).push(n,B,V,S,t.range(.62,.9)*(N===2?.5:1),t.range(0,q),N,t())},b=Math.round(2600*(.5+.5*wt));for(let n=0;n<b;n++){(n&511)===511&&await G.yield();const B=t.int(0,de+4),V=Z[B]+t.gauss()*34,S=at[B]+t.range(-9,9),N=kt(V,S)-F.r,z=Ze(V,S),R=t.range(2,3.3)*(.6+1*z*z),M=t.chance(.25+.75*z);if(Lt(V,S)>.995||N<.5||z<.22||!M)continue;const H=ee(V,S,N)+R*.1;dt(V,H+R,S)<6.5||d(V,H,S,R,0)}for(let n=0;n<Math.round(700*(.5+.5*wt));n++){const B=t.range(0,q),V=-.5+12*t()*t(),S=F.x+Math.cos(B)*(F.r+V),N=F.z+Math.sin(B)*(F.r+V),z=t.range(1.9,3.3),R=ee(S,N,V)-z*.08;dt(S,R+z*.5,N)<6.5||d(S,R,N,z,2)}for(let n=0;n<Math.round(330*(.5+.5*wt));n++){const B=Z[0]+t.range(-190,190),V=t.range(.93,.985),S=yt*V*Math.sqrt(Math.max(0,1-B/gt*(B/gt)/(V*V))),N=t.range(2.2,4.4),z=Math.max(Ot(B,S),9.5)+N*.2;dt(B,z+N,S)<7||a.push(B,z,S,N,t.range(.6,.9),t.range(0,q),0,t())}for(let n=0;n<190;n++){const B=Z[0]+t.range(-130,130),V=t.range(.992,1.03),S=yt*V*Math.sqrt(Math.max(0,1-B/gt*(B/gt)/(V*V))),N=t.range(3.4,5.4),z=t.range(3.2,9.5);a.push(B,z,S,N,t.range(.6,.85),t.range(0,q),.5,t())}{const n=ct("rimwall");for(let V=0;V<Math.round(210*(.6+.4*wt));V++){const S=xt(Z[0]+62+n.gauss()*115,-330,300),N=n.range(.972,.998),z=yt*N*Math.sqrt(Math.max(0,1-S/gt*(S/gt)/(N*N))),R=n.range(2.6,4.6),M=Math.max(Ot(S*.975,z*.975),15),H=lt(13,M+1.5,Math.pow(n(),.8)),P=n.range(.62,.86),A=n.range(0,q),C=n();dt(S,H+R*.6,z)<8.5||a.push(S,H,z,R,P,A,.5,C)}const B=ct("liphd");for(let V=0;V<Math.round(440*(.5+.5*wt));V++){const S=B.range(0,q),N=B.chance(.62)?B.range(.8,15):B.range(15,42),z=F.x+Math.cos(S)*(F.r+N),R=F.z+Math.sin(S)*(F.r+N),M=B.range(2.4,4.4),H=ee(z,R,N)+M*.15,P=B.range(.62,.88),A=B.range(0,q),C=B();dt(z,H+M*.5,R)<7.5||a.push(z,H,R,M,P,A,0,C)}}for(let n=0;n<Math.round(300*wt);n++){const B=t.range(0,q),V=Math.sqrt(t())*.97,S=Math.cos(B)*gt*V,N=Math.sin(B)*yt*V,z=kt(S,N)-F.r;if(z<3||N<-140)continue;const R=t.range(2.6,4.8),M=ee(S,N,z)+R*.2;dt(S,M+R,N)<7||a.push(S,M,N,R,t.range(.6,.85),t.range(0,q),0,t())}await G.yield();const y=[],o=[];for(let n=0;n<a.length;n+=8){const B=kt(a[n],a[n+2])<F.r+62?y:o;for(let V=0;V<8;V++)B.push(a[n+V])}for(const[n,B,V]of[[e,1,Qt.court],[y,0,Qt.court],[o,0,Qt.outer]]){const S=n.length/8;if(!S)continue;const N=new c.IcosahedronGeometry(1,B);N.deleteAttribute("uv"),N.setAttribute("normal",N.attributes.position.clone());const z=new Float32Array(S*2),R=new Float32Array(S*3),M=new c.InstancedMesh(N,null,S),H=new c.Matrix4,P=new c.Quaternion,A=new c.Euler,C=new c.Vector3,D=new c.Vector3;for(let U=0;U<S;U++){const _=U*8,O=n[_+3];if(P.setFromEuler(A.set((n[_+7]-.5)*.7,n[_+5],(n[_+4]-.75)*1.2)),M.setMatrixAt(U,H.compose(D.set(n[_],n[_+1],n[_+2]),P,C.set(O,O*n[_+4],O))),z[U*2]=n[_+6],z[U*2+1]=n[_+7],n[_+6]<1){const K=ea(n[_],n[_+1],n[_+2]);R[U*3]=K[0],R[U*3+1]=K[1],R[U*3+2]=K[2]}else R[U*3]=je(n[_],n[_+1],n[_+2]),R[U*3+1]=0,R[U*3+2]=1;(U&255)===255&&await G.yield()}N.setAttribute("aB",new c.InstancedBufferAttribute(z,2)),N.setAttribute("aM",new c.InstancedBufferAttribute(R,3)),M.instanceMatrix.needsUpdate=!0,M.frustumCulled=!1,M.userData.clumps=!0,E.add(M),V.push(M),await G.yield()}const s=Vt({uniforms:{...Ae},vertexShader:`
        attribute vec2 aB; attribute vec3 aM;
        uniform vec4 uHall; uniform vec3 uCam;
        varying vec3 vP, vN, vL, vM; varying vec2 vK;
        ${ue}
        void main(){
          vec3 p = position * (1. + .2 * sin(dot(position, vec3(3.1, 2.3, 4.7)) + aB.y * 40.) + .13 * sin(dot(position, vec3(-5.3, 6.1, 4.2)) + aB.y * 71.));
          if (aB.x > .25 && aB.x < .75) p *= step(21., uCam.y);            // the hem of heads at the rim is for the air only: from the hall it would be lumps under the skirt
          vec4 wp = instanceMatrix * vec4(p, 1.);
          vec3 org = instanceMatrix[3].xyz; float sc = length(instanceMatrix[0].xyz), t = uHall.z;
          float gb = sin(dot(org.xz, vec2(.045, .03)) - t * .8) * .5 + .5;
          float sw = (.25 + .75 * gb) * sc * (.5 + .5 * position.y);
          wp.x += sin(t * 1.9 + aB.y * 30. + position.z * 2.) * .05 * sw;
          wp.z += cos(t * 1.6 + aB.y * 17. + position.x * 2.) * .04 * sw;
          wp.y += sin(t * 2.6 + aB.y * 50. + position.x * 3.) * .022 * sw;
          vP = wp.xyz; vN = normalize(mat3(instanceMatrix) * normal + vec3(0., 1e-4, 0.)); vL = position; vK = aB; vM = aM;
          vec4 mvPosition = modelViewMatrix * wp;
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        varying vec3 vP, vN, vL, vM; varying vec2 vK;
        ${_t}
        ${Ge}
        ${xa}
        ${ae}
        uniform float uDomeK, uGlint;
        ${Eo}
        void main(){
          vec3 V = normalize(uCam - vP + vec3(0., 1e-4, 0.)), Ng = normalize(vN);
          float ndv = dot(Ng, V), tt = uHall.z; vec2 p = vP.xz;
          float dist = length(vP - uCam), df = 1. - smoothstep(34., 120., dist), dfe = 1. - smoothstep(22., 55., dist);
          vec2 tg = normalize(vec2(-Ng.z, Ng.x) + vec2(1e-4, 0.));
          vec2 q = abs(Ng.y) > .62 ? p : vec2(dot(p, tg), vP.y * 1.05);
          vec3 fm = mounds((vec2(vP.x + vP.y * .55, vP.z + vP.y * .4) + (vec2(vnoise(vP.xz * 1.9 + vP.y), vnoise(vP.xz * 1.9 - vP.y + 7.)) - .5) * .7) / 1.5 + vK.y * 9.);      // florets on the clump
          float pch = smoothstep(.3, .75, vnoise(p * .1 + 11.) * .6 + vnoise(p * .03 + 4.) * .4), cover;
          vec3 avgLeaf = mix(mix(uLeafA, uLeafB, .4), uLeafC, uFlush * (.05 + .45 * pch));
          vec3 nearLeaf = leafField(q, avgLeaf, pch, cover);
          float edge = mix(fm.x, cover, dfe);
          if (ndv < .8 && edge < (.8 - ndv) * 1.25) discard;                                  // the outline is leaves, not an edge
          vec3 N = normalize(Ng + vec3(-fm.y, 0., -fm.z) * .5);
          float core = step(1.5, vK.x);                                                       // the dark mass behind the leaves of the lip
          float crown = mix(smoothstep(.02, .55, vM.z), 1., core);
          vec3 alb = mix(avgLeaf, nearLeaf * 1.1, df) * uDomeK * (.36 + .64 * smoothstep(0., .55, fm.x)) * (.5 + .56 * crown) * mix(1., .9, core);
          alb *= mix(vec3(1.12, 1., .74), vec3(.8, .97, 1.1), smoothstep(.25, .75, vnoise(p * .023 + 3.) * .6 + vnoise(p * .071) * .4));
          float gb = vnoise(p * .012 + vec2(tt * .1, tt * .04)) * .7 + vnoise(p * .035 - vec2(tt * .16, tt * .05)) * .3;
          float gband = gustBand(p, tt), gust = max(smoothstep(.5, .7, gb) * .6, gband), flut = vnoise(p * 1.1 + vec2(tt * 2.3, -tt * 1.9));
          alb = mix(alb, alb * vec3(1.7, 1.8, 1.55) + vec3(.02, .028, .02), gust * (.4 + .6 * flut) * .85 * (1. - core));
          alb = mix(alb, alb * 1.5 + vec3(.05, .075, .055), gband * (.5 + .5 * flut) * .8 * (1. - core));
          float ao = .44 + .56 * smoothstep(-.75, .45, vL.y);                         // dark where it sits in the crown
          // lit as the shell under it is: the sub-crown's flank decides, the head itself only models the light
          float own = smoothstep(-.12, .5, dot(normalize(mix(Ng, vec3(0., 1., 0.), .3)), uSunLow)) * mix(.04, 1., vM.x);
          float difG = mix(mix(vM.y, own, .5), own, core);
          float difD = max(dot(N, uSunLow), 0.); difD = difD / (difD + .3) * 1.3;
          float dif = difG * (.3 + .7 * difD);
          float back = max(dot(-V, uSunH), 0.), rim = 1. - max(ndv, 0.);
          float od = length(p - uOc.xy) - uOc.z;
          float well = mix(1., smoothstep(1., 24., od), (1. - uMist.w) / .8);
          vec3 amb = domeShade() * (.72 + .28 * N.y) * (.62 + .38 * crown) * (1. + 1.3 * core) * uShadeK;
          vec3 lit = uSunCol * uSunTint * (dif * 1.2 + .28 * back * back * rim * rim * vM.x) + amb * (.5 + .5 * well);
          vec3 col = alb * lit * ao * (.3 + .7 * well);
          float sp = max(dot(reflect(-uSunDir, N), V), 0.); sp *= sp; sp *= sp;
          col += uSunCol * sp * sp * .1 * cover * df * vM.x * uGlint * (1. - core);
          col = domeFill(col, smoothstep(0., .55, fm.x) * ao * (.4 + .6 * crown), vP.y);
          col = domeAir(col, p, dist, crown, back, well);
          // from under the roof the heads along the rim are dark leaf against the light outside
          float under = (1. - smoothstep(12., 20., uCam.y)) * smoothstep(.86, .93, length(p / vec2(${gt.toFixed(1)}, ${yt.toFixed(1)})));
          col = mix(col, hallHaze(col * .3 + uLeafB * (uShade + uBounce) * .22, uCam + (vP - uCam) * .4), under);
          gl_FragColor = vec4(col, 1.);
          #include <fog_fragment>
        }`});E.traverse(n=>{n.userData.clumps&&(n.material=s)}),await G.yield();const r=ct("saplings"),f=new ze,g=[.13,.1,.07],u=[0,0,0],w=J.y/Math.max(.001,Math.hypot(J.x,J.z)),i=[];for(let n=0;n<110;n++){const B=r.range(0,q),V=F.r*Math.sqrt(r())*.93,S=F.x+Math.cos(B)*V,N=F.z+Math.sin(B)*V,z=r.range(2.4,4.8),R=r.range(-.2,.2),M=r.range(0,q),H=bt(S,N)-.1;if(dt(S,z,N)<7||dt(S,.5,N)<5.2)continue;const P=S+Math.cos(M)*R*z,A=N+Math.sin(M)*R*z,C=(_,O)=>{O[0]=lt(S,P,_*_),O[1]=H+_*z*.9,O[2]=lt(N,A,_*_)};Bt(f,C,_=>.02*z*(1-.7*_)+.012,[0,.3,.65,1],5,()=>g,1,z);const D=3+(r.chance(.5)?1:0)+(z>2.8?1:0),U=r.range(.8,1.1)*(.7+.08*z);for(let _=0;_<D;_++){const O=.4+.5*(_/D)+r.range(0,.08),K=_*2.4+r.range(0,.9),I=z*r.range(.26,.42),$=r.range(.25,.7);C(O,u);const j=u[0],W=u[1],X=u[2],st=Math.cos(K),ut=Math.sin(K);Bt(f,(nt,Pt)=>{Pt[0]=j+st*I*nt,Pt[1]=W+$*I*nt-.12*I*nt*nt,Pt[2]=X+ut*I*nt},nt=>.018*(1-.6*nt)+.006,[0,.5,1],3,()=>g,1,I),Be(r,j+st*I*.15,W+$*I*.15,X+ut*I*.15,st,$*.8,ut,0,1,0,I*.95,5+r.int(0,2),U,0,1,1,.12)}Be(r,P,H+z*.86,A,Math.cos(M)*.25,1,Math.sin(M)*.25,Math.cos(M+1.6),.7,Math.sin(M+1.6),.45,3,U,0,1,1,0),ba.push({x:S,z:N,h:z}),i.push(S,N,z,z*.5)}await G.yield();{const n=ct("lipleaf"),B=Math.round(1100*(.6+.4*wt));for(let V=0;V<B;V++){(V&127)===127&&await G.yield();const S=n.range(0,q),N=Math.cos(S),z=Math.sin(S),R=n(),M=n.range(-.9,.9),H=n.range(2.4,4),P=7+n.int(0,3),A=n.range(.85,1.25);let C,D,U,_,O,K,I,$,j,W;R<.42?(C=.5+9*n()*n(),U=-N-z*M,_=.25,O=-z+N*M,K=-N*.3,I=1,$=-z*.3,j=.1,W=1):R<.8?(C=n.range(-.4,2.2),U=-N*.5-z*M*.6,_=-.9,O=-z*.5+N*M*.6,K=-N,I=.35,$=-z,j=.15,W=.8):(C=n.range(.3,4.2),U=-z*M*.5,_=-1,O=N*M*.5,K=-N,I=.1,$=-z,j=.05,W=.5);const X=F.x+N*(F.r+C),st=F.z+z*(F.r+C);R<.42?D=ee(X,st,C)+n.range(.5,1.3):R<.8?D=ee(X,st,C)+n.range(-.3,.6):D=Ht(X,st)-n.range(1.4,3.2);const ut=Math.hypot(U,_,O);dt(X,D,st)<7.5||dt(X+U/ut*H,D+_/ut*H,st+O/ut*H)<6||Be(n,X,D,st,U,_,O,K,I,$,H,P,A,1,je(X,D,st),W,j)}}await G.yield();{const n=ct("exitrim");for(let B=0;B<Math.round(520*(.6+.4*wt));B++){(B&127)===127&&await G.yield();const V=n.range(1.25,3.05),S=Math.cos(V),N=Math.sin(V),z=n.chance(.55),R=z?.3+16*n()*n():n.range(-.5,1.6),M=n.range(-.9,.9),H=F.x+S*(F.r+R),P=F.z+N*(F.r+R),A=n.range(2.2,4.4),C=6+n.int(0,3),D=n.range(.9,1.35),U=z?Math.max(ee(H,P,R),Math.min(Ot(H,P),ee(H,P,R)+9))+n.range(.2,1.2):ee(H,P,R)+n.range(-.4,.5);dt(H,U,P)<7.5||dt(H-S*A*.5,U-(z?0:A),P-N*A*.5)<6||(z?Be(n,H,U,P,-S*.5-N*M,n.range(.5,1.5),-N*.5+S*M,-S*.4,1,-N*.4,A,C,D,1,je(H,U+2,P),1,.12):Be(n,H,U,P,-S*.35-N*M*.4,-1,-N*.35+S*M*.4,-S,.3,-N,A*1.25,C+2,D,1,je(H,U,P),.85,.08))}}await G.yield();{const n=ct("crownleaf"),B=Math.round(1e3*wt);for(let V=0;V<B;V++){(V&127)===127&&await G.yield();const S=n.int(0,de+2),N=Z[S]+n.gauss()*19,z=at[S]+n.range(-8,8),R=kt(N,z)-F.r,M=Ze(N,z),H=n.range(0,q),P=n.range(1.6,3.1),A=n.range(.2,.9),C=n.range(2.4,4.2),D=6+n.int(0,3),U=n.range(.85,1.3)*.78;if(Lt(N,z)>.98||R<1||M<.35)continue;const _=ee(N,z,R)+(.6+M*M)*P;dt(N,_+3,z)<7||Be(n,N,_,z,Math.cos(H),A,Math.sin(H),0,1,0,C,D,U,2,ea(N,_,z)[1],1,.08)}}await G.yield();{const n=ct("rimleaf");for(let B=0;B<Math.round(480*(.6+.4*wt));B++){(B&127)===127&&await G.yield();const V=xt(Z[0]+58+n.gauss()*92,-300,146),S=n.range(.984,1.002),N=yt*S*Math.sqrt(Math.max(0,1-V/gt*(V/gt)/(S*S)));let z=V/(gt*gt),R=N/(yt*yt);const M=Math.hypot(z,R)||1;z/=M,R/=M;const H=Math.max(Ot(V*.975,N*.975),14),P=lt(10.5,H+1,n()),A=n.range(-.9,.9),C=n.range(2.6,4.4),D=7+n.int(0,3),U=n.range(.95,1.4);dt(V,P,N)<8||Be(n,V+z*.7,P,N+R*.7,z*.5-R*A,-.75,R*.5+z*A,z,.45,R,C,D,U,1,je(V+z*4,P,N+R*4),.9,.12)}}await G.yield();const l=Math.atan2(So.z/yt,So.x/gt),v=.5,m=Math.hypot(gt*Math.sin(l),yt*Math.cos(l)),p=n=>Math.max(2.7,3.9+1.9*qt.n2(n*15,4.2)+1*qt.n2(n*47,9.1)+.5*qt.n2(n*140,2.3))+5.5*St(.55,1,Math.abs(n-l)/v);{const n=new ze,B=Math.round(170*(.6+.4*wt)),V=4;for(let R=0;R<2;R++){const M=n.count;for(let H=0;H<=B;H++){const P=l-v+2*v*H/B,A=Math.cos(P),C=Math.sin(P),D=(R?.972:.99)+.005*qt.n2(P*60+R*9,2.2+R),U=p(P)+R*1.3;let _=A/gt,O=C/yt;const K=Math.hypot(_,O);_/=K,O/=K;const I=Math.min(Ot(gt*D*A,yt*D*C)-.4,21);for(let $=0;$<=V;$++){const j=$/V,W=D+.007*j*j;n.v(gt*W*A,lt(I,U,j),yt*W*C,_,0,O,(P-l)*m+R*31,j,I,U,1)}}for(let H=0;H<B;H++)for(let P=0;P<V;P++){const A=M+H*(V+1)+P;n.quad(A,A+1,A+V+2,A+V+1)}}const S=Vt({uniforms:{...Ae},side:c.DoubleSide,vertexShader:`
          uniform vec4 uHall; uniform float uOutK; attribute vec3 color;
          varying vec3 vP, vN; varying vec2 vUv;
          ${ue}
          void main(){
            vec3 P = position; float t = uHall.z;
            // seen from the plain the hem hangs higher, in swags, and the outermost pillars stand in the shade under it
            float hO = 9.2 + 1.7 * sin(uv.x * .071) + 1.1 * sin(uv.x * .23 + 2.) + .6 * sin(uv.x * .61 + 4.);
            P.y = mix(P.y, mix(color.r, max(color.g, hO), uv.y), uOutK);
            P += normal * (sin(t * .8 + uv.x * .13) * .22 + sin(t * 1.7 + uv.x * .41) * .08) * uv.y * uv.y;      // the hem stirs
            vP = P; vN = normal; vUv = uv;
            vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
            gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          varying vec3 vP, vN; varying vec2 vUv;
          ${_t}
          ${Ge}
          ${ae}
          uniform float uDomeK;
          void main(){
            vec2 q = vec2(vUv.x, vP.y);
            float rag = vnoise(vec2(q.x * .11, 3.)) * .5 + vnoise(vec2(q.x * .45, 7.)) * .3 + vnoise(q * vec2(1.3, .9)) * .2;
            vec4 lc = leafCell(q * .9), lc2 = leafCell(mat2(.8, -.6, .6, .8) * q * 1.25 + 4.7);
            float leafy = max(lc.x, lc2.x);
            float thr = smoothstep(.76, 1., vUv.y + (rag - .5) * .3);
            if (thr > .01 && leafy < thr * 1.02) discard;                         // the lower edge frays into single leaves
            vec3 alb = mix(uLeafA * .4, leafColor(lc.x > lc2.x ? lc.y : lc2.y, .5) * (.6 + .7 * fract(lc.y * 5.3)), leafy);
            vec3 V = normalize(uCam - vP + vec3(0., 1e-4, 0.)), N = normalize(vN + vec3(0., 1e-4, 0.));
            float outside = smoothstep(-.05, .05, dot(N, V));
            vec3 cOut = alb * uDomeK * (uSunCol * clamp(dot(N, uSunDir) * .9 + .22, 0., 1.) * (.3 + .7 * leafy) + uSkyAmb * .45 + uShade * .7) * (.4 + .6 * smoothstep(3., 12., vP.y));
            vec3 cIn = alb * (uShade * .5 + uBounce * .45) + alb * uSkyGlow * .05 * thr;      // from inside: dark leaf, the frayed edge glowing a little
            cIn = hallHaze(cIn, uCam + (vP - uCam) * .4);
            gl_FragColor = vec4(mix(cIn, cOut, outside), 1.);
            #include <fog_fragment>
          }`}),N=new c.Mesh(n.geometry(),S);N.frustumCulled=!1,E.add(N);const z=ct("hem");for(let R=0;R<Math.round(330*(.6+.4*wt));R++){const M=l+z.range(-.86,.86)*v,H=z.chance(.4)?1:0,P=(H?.972:.99)+.005*qt.n2(M*60+H*9,2.2+H)+.005,A=Math.cos(M),C=Math.sin(M),D=gt*P*A,U=yt*P*C,_=p(M)+H*1.3+z.range(.3,3),O=z.range(-.7,.7);Be(z,D,_,U,-C*O,-1,A*O,-A,.1,-C,z.range(1.8,3.2),6+z.int(0,3),z.range(.7,1),3,0,1,.05)}for(let R=0;R<Math.round(340*(.6+.4*wt));R++){const M=l+z.range(-.8,.8)*v,H=z.range(.968,.992),P=gt*H*Math.cos(M),A=yt*H*Math.sin(M),C=p(M)+z.range(.8,3),D=Math.min(z.range(2,5.5),C-bt(P,A)-.5);D>1&&Ye.push(P,C,A,D,z())}}await G.yield();const x=[],h=[],k=[];{const n=ct("lobes"),B=(M,H,P,A,C)=>{if(Lt(M,H)>.95||kt(M,H)<F.r+(A?-1.2:.8))return;const D=C??Ht(M,H)+.9,U=P*n.range(.52,.9),_=P*n.range(.8,1.25),O=n.range(0,q),K=n();dt(M,D-U,H)<5.6+P*.45||dt(M,D-U*.5,H)<5.2+P*.8||x.push(M,D,H,P,U,_,O,K,A)},V=Math.round(400*(.6+.4*wt));for(let M=0;M<V;M++){const H=n.int(de+10,et),P=n.range(0,q),A=Math.min(Math.abs(n.gauss())*17+3,44);B(Z[H]+Math.cos(P)*A,at[H]+Math.sin(P)*A,n.range(2.3,4.7),0)}for(const M of ke){if(M.ghost)continue;const H=M.pole?1:2;for(let P=0;P<H;P++){const A=n.range(0,q),C=(M.r||.5)+n.range(.6,2.4);B(M.x+Math.cos(A)*C,M.z+Math.sin(A)*C,n.range(1.9,3.3),0,Math.min(M.top+.4,Ht(M.x,M.z)+.9))}}await G.yield();for(let M=0;M<150;M++){const H=n.range(0,q),P=n.range(-.8,6),A=F.x+Math.cos(H)*(F.r+P),C=F.z+Math.sin(H)*(F.r+P);B(A,C,n.range(2.2,3.8),1,Math.max(Ht(A,C)+1,ee(A,C,Math.max(P,0))-.6))}for(let M=0;M<x.length;M+=9){if(x[M+8]>.5||Zt(x[M],x[M+2]).d>30)continue;const H=n.chance(.6)?n.chance(.4)?2:1:0;for(let P=0;P<H;P++){const A=n.range(0,q),C=x[M+3]*n.range(.1,.6),D=x[M]+Math.cos(A)*C,U=x[M+2]+Math.sin(A)*C,_=x[M+1]-x[M+4]*.8,O=n.range(1.8,3.4),K=n.range(-.5,.5);dt(D,_-O,U)<5.4||Be(n,D,_,U,Math.cos(A)*.3+K*.2,-1,Math.sin(A)*.3,Math.cos(A),.25,Math.sin(A),O,6+n.int(0,3),n.range(.75,1.05),4,0,1,.06)}}await G.yield();const S=ct("ferns"),N=(M,H,P,A,C,D,U,_)=>{for(let O=0;O<D;O++){const K=Zt(M,H),I=Math.atan2(at[K.i]-H,Z[K.i]-M),$=S.chance(.65)?I+S.range(-1.3,1.3):S.range(0,q),j=S.range(A,C),W=Math.cos($),X=Math.sin($);if(_!==void 0&&j<11.5&&Math.abs(Math.atan2(Math.sin($-_),Math.cos($-_)))<.6)continue;const st=M+W*P,ut=H+X*P,nt=S.range(.75,1.35)*U;dt(st+W*nt,j,ut+X*nt)<4.6||h.push(st,j,ut,W*.8,.6,X*.8,nt,S())}};for(const M of ke)if(!(M.ghost||M.pole)&&(S.chance(.75)&&N(M.x,M.z,M.r*1.02,2.2,Math.min(11,M.top-3),1+S.int(0,2),1),S.chance(.6))){const H=S.range(0,q),P=M.r*2.3+S.range(.2,1.4),A=M.x+Math.cos(H)*P,C=M.z+Math.sin(H)*P;Ke(A,C)<-5&&h.push(A,bt(A,C)+.05,C,S.range(-.15,.15),1,S.range(-.15,.15),S.range(1.1,1.9),S())}for(const M of It){N(M.x,M.z,M.R*1,2.5,13,M.mother?30:14,1.35,M.mother?ge:void 0);for(let H=0;H<(M.mother?16:9);H++){const P=S.range(0,q),A=M.R*S.range(1.5,2.5),C=M.x+Math.cos(P)*A,D=M.z+Math.sin(P)*A;M.mother&&Math.abs(Math.atan2(Math.sin(P-ge),Math.cos(P-ge)))<.42||h.push(C,bt(C,D)+.05,D,S.range(-.15,.15),1,S.range(-.15,.15),S.range(1.3,2.3),S())}}for(let M=0,H=Rt.length/4;M<90&&H;M++){const P=S.int(0,H-1)*4,A=Rt[P],C=Rt[P+1]+.75,D=Rt[P+2],U=S.range(.9,1.6);Rt[P+3]>26||dt(A,C,D)<4.6+U||h.push(A,C,D,S.range(-.2,.2),1,S.range(-.2,.2),U,S())}await G.yield();const z=ct("pools"),R=J.y/Math.max(.001,Math.hypot(J.x,J.z));for(const M of re){const H=M.gx-Q.x*(Ft/R),P=M.gz-Q.z*(Ft/R),A=Zt(H,P);if(M.av||A.d>24||Lt(H,P)>.93||kt(H,P)<F.r+3||A.i>.9*et)continue;const C=Math.round(xt(M.a*M.b*1.1,10,34)*(.6+.4*wt));for(let D=0;D<C;D++){const U=z.range(0,q),_=Math.sqrt(z())*1.05,O=Math.cos(U)*_*Math.max(M.b,2.2),K=Math.sin(U)*_*Math.max(M.a,2.2),I=H+Q.x*O-Q.z*K,$=P+Q.z*O+Q.x*K;if(Ke(I,$)>-4.5||xo(I,$)<1.5)continue;const j=bt(I,$)-.03,W=z();if(W<.76)k.push(I,j,$,z.range(0,Math.PI),z.range(.5,1.15)*(1.25-.4*_),z());else if(W<.88)h.push(I,j+.06,$,z.range(-.12,.12),1,z.range(-.12,.12),z.range(.8,1.5),z());else{const X=z.range(0,q);Be(z,I,j,$,Math.cos(X)*.2,1,Math.sin(X)*.2,Math.cos(X+1.6),.45,Math.sin(X+1.6),z.range(.5,1.1),3+z.int(0,2),z.range(.42,.66),4,0,1,.05)}}}}await G.yield();{const n=Et.length/14,B=new Uint8Array(n),V=[0,0,0];for(let H=0;H<n;H++){const P=H*14,A=Et[P+11];B[H]=A>.5&&A<2.5?A<1.5&&kt(Et[P],Et[P+2])<F.r+62?1:2:0,V[B[H]]++}const S=[],N=new c.Matrix4,z=N.elements,R=[0,0,0];for(let H=0;H<3;H++){const P=new c.BufferGeometry;P.setAttribute("position",new c.BufferAttribute(new Float32Array([-.34,0,0,.34,0,0,.34,0,1,-.34,0,1]),3)),P.setIndex([0,1,2,0,2,3]);const A=new c.InstancedMesh(P,null,Math.max(V[H],1));A.count=V[H],P.setAttribute("aF",new c.InstancedBufferAttribute(new Float32Array(Math.max(V[H],1)*4),4)),S.push(A)}for(let H=0;H<n;H++){const P=H*14,A=Et[P+9];let C=Et[P+3],D=Et[P+4],U=Et[P+5],_=Et[P+6],O=Et[P+7],K=Et[P+8];const I=Math.hypot(C,D,U)||1;C/=I,D/=I,U/=I;let $=O*U-K*D,j=K*C-_*U,W=_*D-O*C;const X=Math.hypot($,j,W);if(X<.001){$=U,j=0,W=-C;const Ut=Math.hypot($,W)||1;$/=Ut,W/=Ut,Ut===1&&$===0&&W===0&&($=1)}else $/=X,j/=X,W/=X;_=D*W-U*j,O=U*$-C*W,K=C*j-D*$,z[0]=$*A,z[1]=j*A,z[2]=W*A,z[3]=0,z[4]=_*A,z[5]=O*A,z[6]=K*A,z[7]=0,z[8]=C*A,z[9]=D*A,z[10]=U*A,z[11]=0,z[12]=Et[P],z[13]=Et[P+1],z[14]=Et[P+2],z[15]=1;const st=B[H],ut=S[st],nt=R[st]++,Pt=ut.geometry.attributes.aF.array;ut.setMatrixAt(nt,N),Pt[nt*4]=Et[P+10],Pt[nt*4+1]=Et[P+11],Pt[nt*4+2]=Et[P+12],Pt[nt*4+3]=Et[P+13],(H&2047)===2047&&await G.yield()}const M=S[0];M.material=Vt({uniforms:{...Ae},side:c.DoubleSide,vertexShader:`
          attribute vec4 aF;
          uniform vec4 uHall; uniform vec3 uCam; uniform float uOutK;
          varying vec3 vP, vN, vR, vAx; varying vec2 vUv; varying vec4 vK;
          ${ue}
          void main(){
            float t = uHall.z, sd = aF.x;
            vec3 org = instanceMatrix[3].xyz, rt = instanceMatrix[0].xyz, nr = instanceMatrix[1].xyz, ax = instanceMatrix[2].xyz;
            float sc = max(length(ax), 1e-4);
            vec3 lp = position;
            if (aF.y > 1.5 && aF.y < 2.5) lp *= 1. - smoothstep(46., 78., length(org - uCam));      // crown-top shoots: only close to
            vec4 wp = instanceMatrix * vec4(lp, 1.);
            if (aF.y > 2.5 && aF.y < 3.5) wp.y += uOutK * 5.5;
            float gb = sin(dot(org.xz, vec2(.045, .03)) - t * .8) * .5 + .5;        // gust bands: the tip of the blade moves most
            float w = position.z * (.3 + .7 * gb);
            wp.xyz += nr * sin(t * (2.4 + 2. * sd) + sd * 40.) * .16 * w + rt * sin(t * 1.7 + sd * 23.) * .07 * w;
            vP = wp.xyz; vN = nr / sc; vR = rt / sc; vAx = ax / sc; vUv = vec2(position.x / .34, position.z); vK = aF;
            vec4 mvPosition = modelViewMatrix * wp;
            gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          varying vec3 vP, vN, vR, vAx; varying vec2 vUv; varying vec4 vK;
          ${_t}
          ${Ge}
          ${ae}
          uniform float uDomeK, uGlint;
          ${Eo}
          void main(){
            float x = vUv.x, y = vUv.y, sd = vK.x, kind = vK.y;
            float wd = pow(max(sin(3.1416 * pow(max(y, 1e-4), .82)), 0.) + 1e-5, .62) * .96 * smoothstep(.04, .14, y);     // a broad oval, blunt at the tip
            float stalk = step(y, .14) * step(abs(x), .09);
            if (abs(x) > wd && stalk < .5) discard;
            vec3 alb = leafColor(sd, kind < .5 ? .42 : kind < 1.5 ? .26 : .5) * (.8 + .5 * fract(sd * 9.1)) * (kind < .5 ? 1.3 : kind < 1.5 ? 1.15 : .95);
            if (kind > 1.5 && kind < 2.5) alb = mix(alb, vec3(.5, .035, .025), uFig * step(.9, fract(sd * 17.3)) * step(length(vec2(x, y - .2)), .16));       // a fig at the base of a crown-top leaf
            float rib = smoothstep(0., .13, abs(x));
            float vein = smoothstep(.06, .22, abs(fract(y * 6.5 - abs(x) * 1.3 + sd) - .5));
            alb *= (.6 + .4 * rib) * (.85 + .15 * vein);
            if (kind > .5 && kind < 2.5) alb = mix(alb, alb * 1.4 + vec3(.06, .09, .065), gustBand(vP.xz, uHall.z) * .7);      // undersides turned up in the gust
            alb = mix(alb, vec3(.07, .055, .04), stalk * step(wd, abs(x)));
            vec3 V = normalize(uCam - vP + vec3(0., 1e-4, 0.));
            vec3 Nf = normalize(vN + vec3(0., 1e-4, 0.));
            vec3 N = normalize(Nf - vR * x * .5 + vAx * (y - .45) * .45);          // cupped across, drooping along
            if (dot(Nf, V) < 0.) N = -N;
            float ndl = dot(N, uSunDir), front = max(ndl, 0.), trans = max(-ndl, 0.);
            float sp = max(dot(reflect(-uSunDir, N), V), 0.); sp *= sp; sp *= sp; sp *= sp;
            float od = length(vP.xz - uOc.xy) - uOc.z;
            float well = mix(1., smoothstep(1., 24., od), (1. - uMist.w) / .8);
            vec3 col;
            if (kind > 3.5) {                                   // under the roof: young leaves, fresh green, a few still copper, the light coming through them
              vec3 fresh = mix(vec3(.07, .17, .04), vec3(.2, .33, .07), fract(sd * 7.3));
              fresh = mix(fresh, vec3(.34, .15, .05), step(.86, fract(sd * 3.7)) * (.4 + .6 * uFlush));
              fresh *= (.6 + .4 * rib) * (.85 + .15 * vein);
              float sv = sunVis(vP);
              col = fresh * (hallLight(vP, N, 1.) * 1.25 + uSkyAmb * .25 + uSunCol * sv * (front * .5 + trans * 1.1) * vec3(1.1, 1.1, .6));
              col = hallHaze(col, vP);
            } else if (kind > 2.5) {                            // the hem at the exit, seen from inside the hall
              float sv = sunVis(vP);
              col = alb * .85 * (hallLight(vP, N, 1.) + uSunCol * sv * (trans * .8 + sp * .2));
              col = hallHaze(col, uCam + (vP - uCam) * .4);
            } else {
              float sunK = kind < .5 ? courtSun(vP) : vK.z;
              vec3 amb = (uShade * .75 + uSkyAmb * .65) * vK.w * (kind > .5 && kind < 1.5 ? 2.4 * (.55 + .45 * N.y) : 1.);      // the eave stands under open sky
              vec3 sunC = kind < .5 ? uSunCol : uSunCol * uSunTint;
              col = alb * (sunC * sunK * (front * .95 + .13) + amb)
                  + alb * vec3(1.3, 1.2, .45) * sunC * sunK * trans * .55         // the sun through the blade
                  + uSunCol * sunK * sp * .12 * uGlint;
              if (kind < .5) col = hallHaze(col, vP);
              else { col *= uDomeK * (.14 + .86 * well); col = domeFill(col, .5, vP.y); col = domeAir(col, vP.xz, length(vP - uCam), 1., 0., well); }
            }
            gl_FragColor = vec4(col, 1.);
            #include <fog_fragment>
          }`});for(let H=0;H<3;H++){const P=S[H];P.material=M.material,P.frustumCulled=!1,E.add(P),H&&(H===1?Qt.court:Qt.outer).push(P)}}await G.yield();{const n=x.length/9;if(n){const N=[.55,1.12,1.74],z=[0,-1,0],R=[];for(let O=0;O<N.length;O++)for(let K=0;K<6;K++){const I=K/6*q+O*.5;z.push(Math.sin(N[O])*Math.cos(I),-Math.cos(N[O]),Math.sin(N[O])*Math.sin(I))}for(let O=0;O<6;O++)R.push(0,1+O,1+(O+1)%6);for(let O=0;O<N.length-1;O++)for(let K=0;K<6;K++){const I=1+O*6+K,$=1+O*6+(K+1)%6;R.push(I,I+6,$+6,I,$+6,$)}const M=new c.BufferGeometry;M.setAttribute("position",new c.BufferAttribute(new Float32Array(z),3)),M.setIndex(R);const H=new Float32Array(n*2),P=new c.InstancedMesh(M,null,n),A=new c.Matrix4,C=new c.Quaternion,D=new c.Euler,U=new c.Vector3,_=new c.Vector3;for(let O=0;O<n;O++){const K=O*9;C.setFromEuler(D.set((x[K+7]-.5)*.5,x[K+6],(x[K+7]*7.3%1-.5)*.5)),P.setMatrixAt(O,A.compose(_.set(x[K],x[K+1],x[K+2]),C,U.set(x[K+3],x[K+4],x[K+5]))),H[O*2]=x[K+7],H[O*2+1]=x[K+8],(O&255)===255&&await G.yield()}M.setAttribute("aB",new c.InstancedBufferAttribute(H,2)),P.material=Vt({uniforms:{...uo},side:c.DoubleSide,vertexShader:`
            attribute vec2 aB;
            uniform vec4 uHall;
            varying vec3 vP, vN, vL; varying vec2 vK;
            ${ue}
            void main(){
              vec3 p = position * (1. + .22 * sin(dot(position, vec3(3.1, 2.3, 4.7)) + aB.x * 40.) + .14 * sin(dot(position, vec3(-5.3, 6.1, 4.2)) + aB.x * 71.));
              vec4 wp = instanceMatrix * vec4(p, 1.);
              vec3 org = instanceMatrix[3].xyz; float t = uHall.z, low = clamp(-position.y, 0., 1.);
              float gb = sin(dot(org.xz, vec2(.045, .03)) - t * .8) * .5 + .5;
              wp.x += sin(t * 1.3 + aB.x * 30. + position.z * 2.) * .1 * (.3 + .7 * gb) * low;
              wp.z += cos(t * 1.1 + aB.x * 17. + position.x * 2.) * .08 * (.3 + .7 * gb) * low;
              vP = wp.xyz; vN = normalize(mat3(instanceMatrix) * position + vec3(0., 1e-4, 0.)); vL = position; vK = aB;
              vec4 mvPosition = modelViewMatrix * wp;
              gl_Position = projectionMatrix * mvPosition;
              #include <fog_vertex>
            }`,fragmentShader:`
            varying vec3 vP, vN, vL; varying vec2 vK;
            ${_t}
            ${Ge}
            ${ae}
            void main(){
              vec3 V = normalize(uCam - vP + vec3(0., 1e-4, 0.)), Ng = normalize(vN);
              float ndv = abs(dot(Ng, V)); vec2 p = vP.xz;
              float dist = length(vP - uCam), df = 1. - smoothstep(30., 95., dist);
              vec2 tg = normalize(vec2(-Ng.z, Ng.x) + vec2(1e-4, 0.));
              vec2 q = (abs(Ng.y) > .6 ? p : vec2(dot(p, tg), vP.y * 1.05)) * 1.15 + vK.x * 31.;
              float pch = smoothstep(.3, .75, vnoise(p * .1 + 11.) * .6 + vnoise(p * .03 + 4.) * .4), cover;
              vec3 avgLeaf = mix(mix(uLeafA, uLeafB, .5), uLeafC, uFlush * (.03 + .1 * pch));
              vec3 nearLeaf = leafField(q, avgLeaf, pch * .3, cover);
              float clump = vnoise(q * .42 + 3.) * .6 + vnoise(q * 1.1) * .4;                    // sprays of leaf with air between them
              float keep = cover * (.55 + .9 * clump);
              // the outline is leaves; the top frays into the roof; here and there a hole shows the roof and the sky behind
              float thr = max((.72 - ndv) * 1.1, 0.) + .34 * smoothstep(-.28, .1, vL.y) + .5 * (1. - smoothstep(.3, .52, clump)) * df;
              if (keep < thr) discard;
              vec3 N = dot(Ng, V) < 0. ? -Ng : Ng;
              vec3 alb = (mix(avgLeaf, nearLeaf * 1.1, df) * 1.5 + vec3(.006, .014, .004)) * vec3(.86, 1.16, .8) * (.62 + .6 * clump);
              float kv = skyVis(vP + vec3(0., 0., 0.)), sv = sunVis(vP);
              float inner = 1. - .58 * smoothstep(-.95, -.1, vL.y);                               // dark up under the roof, lighter at the hanging tips
              float edge = 1. - ndv;
              vec3 col = alb * hallLight(vP, N, inner) * 1.05;
              // light comes down through the leaves where the roof is thin: the mass glows green-gold at its edges
              col += alb * vec3(.95, 1.25, .4) * uSunCol * (kv * (.04 + .16 * edge * edge) + sv * .3 * max(dot(-V, uSunDir), 0.));
              col += alb * uSkyGlow * kv * .08 * (1. - uWx.w * .6);
              col = hallHaze(col, vP);
              gl_FragColor = vec4(col, 1.);
              #include <fog_fragment>
            }`}),P.instanceMatrix.needsUpdate=!0,P.frustumCulled=!1,E.add(P)}await G.yield();const B=h.length/8;if(B){const N=[],z=[],R=[];for(let I=0;I<6;I++){const $=I/6*q+I%2*.35,j=Math.cos($),W=Math.sin($),X=I%2?.52:.36,st=N.length/3;for(let ut=0;ut<=2;ut++){const nt=ut/2,Pt=nt*(.95-.12*nt),Ut=X*Math.sin(Math.PI*Math.min(nt*.9,1)*.85)-.1*nt*nt,oe=.2;for(const Fe of[-1,1])N.push(j*Pt-W*Fe*oe,Ut,W*Pt+j*Fe*oe),z.push(Fe,nt)}for(let ut=0;ut<2;ut++){const nt=st+ut*2;R.push(nt,nt+1,nt+3,nt,nt+3,nt+2)}}const M=new c.BufferGeometry;M.setAttribute("position",new c.BufferAttribute(new Float32Array(N),3)),M.setAttribute("uv",new c.BufferAttribute(new Float32Array(z),2)),M.setIndex(R);const H=new Float32Array(B),P=new c.InstancedMesh(M,null,B),A=new c.Matrix4,C=new c.Quaternion,D=new c.Quaternion,U=new c.Vector3,_=new c.Vector3,O=new c.Vector3(0,1,0),K=new c.Vector3;for(let I=0;I<B;I++){const $=I*8,j=h[$+6];C.setFromUnitVectors(O,K.set(h[$+3],h[$+4],h[$+5]).normalize()).multiply(D.setFromAxisAngle(O,h[$+7]*q)),P.setMatrixAt(I,A.compose(_.set(h[$],h[$+1],h[$+2]),C,U.set(j,j,j))),H[I]=h[$+7]}M.setAttribute("aB",new c.InstancedBufferAttribute(H,1)),P.material=Vt({side:c.DoubleSide,vertexShader:`
            attribute float aB;
            uniform vec4 uHall;
            varying vec3 vP, vN; varying vec2 vUv; varying float vS;
            ${ue}
            void main(){
              vec4 wp = instanceMatrix * vec4(position, 1.);
              float t = uHall.z, w = uv.y * uv.y * length(instanceMatrix[0].xyz);
              wp.xyz += vec3(sin(t * 1.6 + aB * 40. + position.x * 5.), sin(t * 2.3 + aB * 23. + position.z * 4.) * .6, cos(t * 1.3 + aB * 31.)) * .05 * w;
              vP = wp.xyz; vN = normalize(mat3(instanceMatrix) * vec3(0., 1., 0.) + vec3(0., 1e-4, 0.)); vUv = uv; vS = aB;
              vec4 mvPosition = modelViewMatrix * wp;
              gl_Position = projectionMatrix * mvPosition;
              #include <fog_vertex>
            }`,fragmentShader:`
            varying vec3 vP, vN; varying vec2 vUv; varying float vS;
            ${_t}
            ${ae}
            void main(){
              float x = abs(vUv.x), y = vUv.y, far = smoothstep(14., 40., length(vP - uCam));
              float env = pow(max(sin(3.1416 * pow(clamp(y, 0., 1.), .7)), 0.) + 1e-4, .6) * (1. - .25 * y);
              float pin = abs(fract(y * 11. + vS * 3.) - .5) * 2.;                                  // the pinnae, each a small blade
              float cut = mix(env * (.14 + .86 * smoothstep(.1, .62, 1. - pin)), env * .7, far);
              if (x > max(cut, .07 * (1. - y))) discard;
              vec3 alb = mix(vec3(.05, .13, .03), vec3(.2, .36, .08), smoothstep(.0, .9, y) * (.6 + .4 * fract(vS * 7.3)));
              alb *= .7 + .3 * smoothstep(.0, .12, x);                                               // the dark midrib
              vec3 V = normalize(uCam - vP + vec3(0., 1e-4, 0.)), N = normalize(vN);
              if (dot(N, V) < 0.) N = -N;
              float sv = sunVis(vP), thru = max(dot(-V, uSunDir), 0.);
              vec3 col = alb * (hallLight(vP, N, .55 + .45 * y) * 1.2 + uSunCol * sv * (.25 + .9 * thru * thru) * vec3(1.1, 1.1, .6));
              col = hallHaze(col, vP);
              gl_FragColor = vec4(col, 1.);
              #include <fog_fragment>
            }`}),P.instanceMatrix.needsUpdate=!0,P.frustumCulled=!1,E.add(P),Qt.hall.push(P)}const V=k.length/6;if(V&&Bo){const S=new Float32Array(V*24),N=new Float32Array(V*24),z=new Float32Array(V*16),R=new Uint32Array(V*12);for(let P=0;P<V;P++)for(let A=0;A<2;A++){for(let D=0;D<4;D++){const U=(P*2+A)*4+D;S[U*3]=k[P*6],S[U*3+1]=k[P*6+1],S[U*3+2]=k[P*6+2],N[U*3]=k[P*6+3]+A*1.571,N[U*3+1]=k[P*6+4],N[U*3+2]=k[P*6+5],z[U*2]=D===0||D===3?-1:1,z[U*2+1]=D<2?0:1}const C=(P*2+A)*4;R.set([C,C+1,C+2,C,C+2,C+3],(P*2+A)*6)}const M=new c.BufferGeometry;M.setAttribute("position",new c.BufferAttribute(S,3)),M.setAttribute("aT",new c.BufferAttribute(N,3)),M.setAttribute("uv",new c.BufferAttribute(z,2)),M.setIndex(new c.BufferAttribute(R,1));const H=new c.Mesh(M,Bo);H.frustumCulled=!1,E.add(H),Qt.hall.push(H)}}if(await G.yield(),f.count){const n=new c.Mesh(f.geometry(),ho);n.frustumCulled=!1,E.add(n)}const L=i.length/4;if(L){const n=new Float32Array(L*12),B=new Float32Array(L*8),V=new Uint32Array(L*6),S=-Q.x,N=-Q.z,z=-N,R=S,M=[[-1,0],[1,0],[1,1],[-1,1]];for(let C=0;C<L;C++){const D=i[C*4],U=i[C*4+1],_=i[C*4+2],O=i[C*4+3],K=Math.min(_/w,22)+O;for(let I=0;I<4;I++){const $=(C*4+I)*3,j=D+S*K*M[I][1]+z*O*M[I][0],W=U+N*K*M[I][1]+R*O*M[I][0];n[$]=j,n[$+1]=bt(j,W)+.07,n[$+2]=W,B[(C*4+I)*2]=M[I][0],B[(C*4+I)*2+1]=M[I][1]}V.set([C*4,C*4+1,C*4+2,C*4,C*4+2,C*4+3],C*6)}const H=new c.BufferGeometry;H.setAttribute("position",new c.BufferAttribute(n,3)),H.setAttribute("uv",new c.BufferAttribute(B,2)),H.setIndex(new c.BufferAttribute(V,1));const P=Vt({fog:!1,transparent:!0,depthWrite:!1,side:c.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,blending:c.CustomBlending,blendSrc:c.ZeroFactor,blendDst:c.SrcColorFactor,blendEquation:c.AddEquation,vertexShader:"varying vec2 vUv; varying vec3 vP; void main(){ vUv = uv; vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
          varying vec2 vUv; varying vec3 vP;
          ${_t}
          void main(){
            float dap = smoothstep(.2, .6, vnoise(vP.xz * 1.1 + 3.) * .55 + vnoise(vP.xz * 2.9 + uHall.z * .15) * .45);                // leaves and the gaps between them
            float fray = (vnoise(vP.xz * .7 + 11.) - .5) * .5;
            float tr = (1. - smoothstep(.04, .34, abs(vUv.x + fray * .3))) * (1. - smoothstep(.36, .66, vUv.y)) * smoothstep(0., .08, vUv.y) * (.35 + .4 * dap);   // the stem: a soft streak
            float cr = (1. - smoothstep(.2, 1., length(vec2(vUv.x + fray * .4, (vUv.y - .72) * 2.9)))) * (.2 + .8 * dap);                // the crown, drawn out long and broken into dapples
            float a = max(tr, cr) * .95 * courtSun(vP) * (1. - smoothstep(.86, 1., vUv.y));
            gl_FragColor = vec4(mix(vec3(1.), vec3(.24, .38, .52), a), 1.);
          }`}),A=new c.Mesh(H,P);A.frustumCulled=!1,A.renderOrder=1,E.add(A)}}await G.yield();function Yo(t,e,a){const d=new Float32Array(t*4*e),b=new Float32Array(t*8),y=new Uint32Array(t*6),o=new Float32Array(e);for(let f=0;f<t;f++){a(f,o);for(let g=0;g<4;g++)d.set(o,(f*4+g)*e),b[(f*4+g)*2]=g===0||g===3?-1:1,b[(f*4+g)*2+1]=g<2?-1:1;y.set([f*4,f*4+1,f*4+2,f*4,f*4+2,f*4+3],f*6)}const s=new c.BufferGeometry,r=new c.InterleavedBuffer(d,e);return s.setAttribute("uv",new c.BufferAttribute(b,2)),s.setIndex(new c.BufferAttribute(y,1)),s.userData.ib=r,s}const $e=(t,e,a,d)=>t.setAttribute(e,new c.InterleavedBufferAttribute(t.userData.ib,a,d));await G.yield();{const t=Math.round(900*wt),e=5,a=[];for(let u=0,w=0;u<t&&w<t*8;w++){let i,l,v;if(T.chance(.5)&&Rt.length){const k=T.int(0,Rt.length/4-1)*4;i=Rt[k]+T.range(-.3,.3),l=Rt[k+1],v=Rt[k+2]+T.range(-.3,.3)}else{const k=T.int(de+8,et),L=T.range(0,q),n=34*Math.sqrt(T());i=Z[k]+Math.cos(L)*n,v=at[k]+Math.sin(L)*n,l=Ht(i,v)+.6}if(Lt(i,v)>.95||kt(i,v)<F.r+1.5)continue;const m=Zt(i,v),p=bt(i,v);let x=T.chance(.14)?1:0,h=x?l-p+.2:T.range(2,10.5);if(m.d<3.6){if(x=0,h=Math.min(h,l-(Ct[m.i]+4.2)),h<1.2)continue}else m.d<6.5&&x&&(x=0);h=Math.min(h,l-p-.3),a.push(i,l,v,h,x,T(),0),u++,(u&127)===127&&await G.yield()}await G.yield();{const u=ct("curtain");for(let i=0;i<Math.round(72*(.6+.4*wt));i++){const l=u.range(0,q),v=u.range(4,8),m=9+u.int(0,8);for(let p=0;p<m;p++){const x=l+u.gauss()*.04,h=u.range(.2,3.4),k=F.x+Math.cos(x)*(F.r+h),L=F.z+Math.sin(x)*(F.r+h),n=ee(k,L,h)-.3,B=Math.min(v*u.range(.55,1.15),n-bt(k,L)-.6),V=u();B<2||dt(k,n-B*.5,L)<5.5||dt(k,n-B,L)<5.5||dt(k,n,L)<5.5||a.push(k,n,L,B,0,V,1)}}{const i=ct("exitcurtain");for(let l=0;l<22;l++){const v=i.range(1.3,3),m=i.range(5,10),p=7+i.int(0,6);for(let x=0;x<p;x++){const h=v+i.gauss()*.035,k=i.range(-.3,1.6),L=F.x+Math.cos(h)*(F.r+k),n=F.z+Math.sin(h)*(F.r+k),B=ee(L,n,Math.max(k,.2))-.2,V=Math.min(m*i.range(.55,1.15),B-bt(L,n)-.6),S=i();V<2||dt(L,B-V*.5,n)<5.5||dt(L,B-V,n)<5.5||dt(L,B,n)<5.5||a.push(L,B,n,V,0,S,1)}}}for(let i=0;i<Ye.length;i+=5)a.push(Ye[i],Ye[i+1],Ye[i+2],Ye[i+3],0,Ye[i+4],.7);for(let i=0;i<Te.length;i+=5)a.push(Te[i],Te[i+1],Te[i+2],Te[i+3],0,Te[i+4],.45);for(let i=0;i<Wt.featThreads.length;i+=5)a.push(Wt.featThreads[i],Wt.featThreads[i+1],Wt.featThreads[i+2],Wt.featThreads[i+3],0,Wt.featThreads[i+4],.3);await G.yield();const w=ct("pillarthreads");for(const i of Ce){if(i.ghost||i.d>40||!i.col)continue;const l=i.tier===0?2+w.int(0,2):1+w.int(0,1);for(let v=0;v<l;v++){const m=w.range(0,q),p=i.r*1.6+w.range(.5,2.6),x=i.x+Math.cos(m)*p,h=i.z+Math.sin(m)*p,k=w(),L=Math.min(i.top-w.range(.6,2.6),Ht(x,h)+.4),n=Math.min(w.range(2.5,9),L-bt(x,h)-.4);n<1.5||dt(x,L-n,h)<5.6||dt(x,L-n*.5,h)<5.6||kt(x,h)<F.r+1.5||a.push(x,L,h,n,0,k,.25)}}}const d=a.length/7,b=new Float32Array(d*e*6),y=new Float32Array(d*e*8),o=new Float32Array(d*e*4),s=new Uint32Array(d*(e-1)*6);await G.yield();for(let u=0;u<d;u++){(u&511)===511&&await G.yield();for(let w=0;w<e;w++)for(let i=0;i<2;i++){const l=(u*e+w)*2+i;b[l*3]=a[u*7],b[l*3+1]=a[u*7+1],b[l*3+2]=a[u*7+2],y[l*4]=w/(e-1),y[l*4+1]=i*2-1,y[l*4+2]=a[u*7+3],y[l*4+3]=a[u*7+5],o[l*2]=a[u*7+4],o[l*2+1]=a[u*7+6],w<e-1&&i===0&&s.set([l,l+1,l+3,l,l+3,l+2],(u*(e-1)+w)*6)}}await G.yield();const r=new c.BufferGeometry;r.setAttribute("position",new c.BufferAttribute(b,3)),r.setAttribute("aT",new c.BufferAttribute(y,4)),r.setAttribute("aK",new c.BufferAttribute(o,2)),r.setIndex(new c.BufferAttribute(s,1));const f=Vt({uniforms:{uRootCol:{value:Tt(Gt,new c.Color(.4,.3,.2),.5).multiplyScalar(.42)}},side:c.DoubleSide,vertexShader:`
        attribute vec4 aT; attribute vec2 aK;
        uniform vec4 uHall; uniform vec3 uCam; uniform float uOutK;
        varying vec3 vP; varying vec3 vI; varying float vSd;
        ${ue}
        void main(){
          float t = aT.x, L = aT.z, sd = aT.w, time = uHall.z;
          vec3 P = position; P.y -= t * L;
          if (aK.y > .6 && aK.y < .8) P.y += uOutK * 4.5;                // the hem's threads hang from wherever the hem is
          float om = .9 + 2.4 / sqrt(max(L, 1.));
          float gust = .55 + .45 * sin(dot(position.xz, vec2(.06, .045)) - time * .9);
          float stir = 1. + 2.2 * (1. - smoothstep(3., 15., length(position.xz - uCam.xz)));
          vec2 swF = vec2(sin(time * om + sd * 40. - t * 1.3), cos(time * om * .83 + sd * 23. - t * 1.1));
          vec2 swT = vec2(sin(time * 7. + sd * 31.), cos(time * 6.1 + sd * 12.));
          P.xz += mix(swF * .075 * L * pow(max(t, 0.) + 1e-5, 1.6) * gust * stir, swT * .03 * sin(3.14159 * t) * stir, aK.x);
          vec3 toC = uCam - P; float d = length(toC);
          vec3 s = cross(vec3(0., 1., 0.), toC); s = s / max(length(s), 1e-4);
          float w = max(mix(.03, .065, aK.x) * (1.6 - .9 * t * (1. - aK.x)) * (1. + .9 * aK.y), d * .0013 * (1. + .5 * aK.y));      // the curtain's ropes are a little thicker
          w *= mix(1. - .88 * smoothstep(.55, 1., t), 1., aK.x);          // a free root tapers to its growing tip
          P += s * aT.y * w;
          vP = P; vI = vec3(t, aK.x, sd); vSd = aT.y;
          vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        varying vec3 vP; varying vec3 vI; varying float vSd; uniform vec3 uRootCol;
        ${_t}
        ${ae}
        void main(){
          vec3 toC = vec3(uCam.x - vP.x, 0., uCam.z - vP.z); vec3 N = toC / max(length(toC), 1e-3);
          N = normalize(N * sqrt(max(1. - vSd * vSd, 0.)) + vec3(-N.z, 0., N.x) * vSd + vec3(0., 1e-4, 0.));      // a rope, round in section
          vec3 alb = uRootCol * (.75 + .5 * hash11(floor(vI.z * 64.))) * (.55 + .45 * (1. - vSd * vSd));
          alb = mix(alb, vec3(.42, .075, .04), smoothstep(.86, .97, vI.x) * (1. - vI.y) * (1. - .75 * uWx.w) * (.35 + .65 * step(.5, fract(vI.z * 7.3))));       // red growing tips, on the younger ones
          vec3 col = alb * (hallLight(vP, N, 1.) + uSunCol * sunVis(vP) * .5);
          col = hallHaze(col, vP);
          gl_FragColor = vec4(col, 1.);
          #include <fog_fragment>
        }`}),g=new c.Mesh(r,f);g.frustumCulled=!1,E.add(g)}await G.yield();{const t=Math.round(3600*wt),e=Math.round(900*wt),a=Ko.length/8,d=Yo(t+e+a,8,(o,s)=>{if(o>=t+e){for(let f=0;f<8;f++)s[f]=Ko[(o-t-e)*8+f];return}const r=o>=t;for(let f=0;f<12;f++){const g=T.int(de+4,et),u=T.range(0,q),w=(r?24:14)*Math.sqrt(T()),i=Z[g]+Math.cos(u)*w,l=at[g]+Math.sin(u)*w;if(s[0]=i,s[2]=l,s[1]=r?Math.min(Ht(i,l),17):Ke(i,l)>-5?ot.y+.02:bt(i,l)+.03,Lt(i,l)<.95&&(!r||kt(i,l)>F.r))break}s[3]=r?T.range(.22,.4):T.range(.2,.42),s[4]=T(),s[5]=T.range(0,q),s[6]=r?1:T.range(.1,.6),s[7]=r?1:0});$e(d,"position",3,0),$e(d,"aL",2,3),$e(d,"aR",3,5);const b=Vt({uniforms:{uOchre:{value:Tt(ne,Gt,.4).multiplyScalar(.6)},uCopper:{value:Tt(se,new c.Color(.26,.15,.07),.62).multiplyScalar(.7)}},side:c.DoubleSide,vertexShader:`
        attribute vec2 aL; attribute vec3 aR;
        uniform vec4 uHall; uniform vec3 uCam, uCamDir; uniform float uWake;
        varying vec3 vP, vN; varying vec2 vUv; varying float vS;
        ${ue}
        void main(){
          float sz = aL.x, sd = aL.y, time = uHall.z, yaw = aR.x, tilt = aR.y, fig = step(1.5, aR.z);
          vec3 C = position;
          float spin = 0.;
          if (aR.z > .5 && aR.z < 1.5) {                     // falling: tumble down from the roof, drift, land, start again
            float f = fract(sd * 7.13 + time * (.05 + .03 * sd));
            C.y = mix(C.y, .1, f);
            C.xz += vec2(sin(time * 1.1 + sd * 50.), cos(time * .9 + sd * 31.)) * (.5 + sd) + vec2(f * 2.5, 0.);
            spin = time * (2. + 2. * sd) + sd * 20.; tilt = 1.1 * sin(spin * .7);
          } else {                                           // litter: lifted and whirled by the wings going by
            vec2 dv = C.xz - uCam.xz; vec2 fd = uCamDir.xz / max(length(uCamDir.xz), 1e-3);
            float along = -dot(dv, fd), lat = dot(dv, vec2(-fd.y, fd.x));
            float k = uWake * (1. - smoothstep(1.5, 6.5, abs(lat))) * smoothstep(-16., -3., along) * (1. - smoothstep(8., 34., along));
            k *= .35 + .65 * sd;
            // the figs take no part in that wake: a fig lies where it fell
            k *= 1. - fig;
            C.y += k * (.4 + 2.3 * fract(sd * 9.7));
            C.xz += vec2(-fd.y, fd.x) * sign(lat) * k * 1.4 + fd * k * 2.;
            spin = k * (5. + time * 6. * (sd - .3)); tilt += k * 1.3 * sin(spin);
          }
          float a = yaw + spin;
          float dc = length(C - uCam);
          sz *= mix(1., smoothstep(2.2, 7.5, dc), max(aR.z * (1. - fig), clamp(C.y - position.y, 0., 1.)));      // nothing big and flat across the lens
          vec3 right = vec3(cos(a), 0., sin(a)), fw = vec3(-right.z, 0., right.x);
          vec3 fw2 = normalize(fw * cos(tilt) + vec3(0., 1., 0.) * sin(tilt));
          vec3 P = C + right * uv.x * sz * .55 + fw2 * uv.y * sz + vec3(0., 1., 0.) * .25 * sz * uv.x * uv.x * (1. - fig);   // curled edges
          if (fig > .5) {                                    // a fallen fig: a little ball, drawn as a disc turned to the eye
            vec3 toC = uCam - C; vec3 fr = cross(vec3(0., 1., 0.), toC); fr = fr / max(length(fr), 1e-4);
            vec3 fu = cross(toC, fr); fu = fu / max(length(fu), 1e-4);
            P = C + vec3(0., sz * .8, 0.) + (fr * uv.x + fu * uv.y) * sz;
          }
          vP = P; vN = normalize(cross(fw2, right)); vUv = uv; vS = sd + 2. * fig;
          vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        varying vec3 vP, vN; varying vec2 vUv; varying float vS; uniform vec3 uOchre, uCopper;
        ${_t}
        ${ae}
        void main(){
          if (vS > 1.5) {                                    // a fig: scarlet, round, a pale speck where the sky shows on it, dark underneath
            float rr = dot(vUv, vUv);
            if (rr > 1.) discard;
            vec3 Nf = normalize(vec3(vUv.x * .7, vUv.y + .25, .6 * sqrt(max(1. - rr, 0.)) + 1e-3));
            vec3 af = mix(vec3(.46, .035, .02), vec3(.3, .05, .03), fract(vS * 7.7)) * (.55 + .45 * smoothstep(-.9, .5, vUv.y));
            vec3 cf = af * (hallLight(vP, vec3(0., 1., 0.), .5 + .5 * smoothstep(-.8, .3, vUv.y)) * (.7 + .5 * Nf.y) + uSunCol * sunVis(vP) * .35 * max(Nf.y, 0.));
            gl_FragColor = vec4(hallHaze(cf, vP), 1.);
            #include <fog_fragment>
            return;
          }
          float e = length(vec2(vUv.x * (1.15 + .45 * vUv.y), vUv.y));
          if (e > 1.) discard;
          vec3 alb = mix(uOchre, uCopper, smoothstep(.2, .8, fract(vS * 5.3))) * (.7 + .5 * fract(vS * 11.7));
          float rib = smoothstep(.0, .1, abs(vUv.x));                                                // midrib
          float vein = smoothstep(.05, .2, abs(fract((vUv.y * .5 + .5) * 5. - abs(vUv.x) * 1.6) - .5)); // side veins
          alb *= (.6 + .4 * rib) * (.8 + .2 * vein) * (.75 + .5 * abs(vUv.x)) * (.85 + .3 * vnoise(vUv * 6. + vS * 40.));
          alb = mix(alb, alb * vec3(.55, .42, .3), smoothstep(.75, 1., e) * .7);                    // dry curled rim
          vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
          vec3 col = alb * (hallLight(vP, N, 1.) + uSunCol * sunVis(vP) * .55);
          col = hallHaze(col, vP);
          gl_FragColor = vec4(col, 1.);
          #include <fog_fragment>
        }`}),y=new c.Mesh(d,b);y.frustumCulled=!1,E.add(y),Qt.hall.push(y)}await G.yield();const bn=J.clone().multiplyScalar(-1),Mn=ct("shafts6"),fo=re.map(t=>{const e=new c.Vector3(t.gx,Ft,t.gz).addScaledVector(J,9+7*Ro(t.gx,t.gz)/Math.max(J.y,.13)),a=new c.Vector3(t.gx,Ft,t.gz).addScaledVector(bn,(Ft+.5)/J.y);return{A:e,B:a,a:t.a,bv:Math.max(.55,t.b*J.y*1.6),I:t.I,seed:t.x?Mn():T()}}),Ma=`
    vec3 bH = cross(ax, vec3(0., 1., 0.)); bH = bH / max(length(bH), 1e-4); vec3 bV = cross(bH, ax);`;{const e=fo.length,a=new Float32Array(e*5*6),d=new Float32Array(e*5*6),b=new Float32Array(e*5*8),y=new Float32Array(e*5*4),o=new Uint32Array(e*4*6);for(let u=0;u<e;u++)for(let w=0;w<5;w++)for(let i=0;i<2;i++){const l=(u*5+w)*2+i,v=fo[u];a.set([v.A.x,v.A.y,v.A.z],l*3),d.set([v.B.x,v.B.y,v.B.z],l*3),b.set([w/4,i*2-1,v.a,v.bv],l*4),y.set([v.I,v.seed],l*2),w<4&&i===0&&o.set([l,l+1,l+3,l,l+3,l+2],(u*4+w)*6)}const s=new c.BufferGeometry;s.setAttribute("position",new c.BufferAttribute(a,3)),s.setAttribute("aB",new c.BufferAttribute(d,3)),s.setAttribute("aS",new c.BufferAttribute(b,4)),s.setAttribute("aI",new c.BufferAttribute(y,2)),s.setIndex(new c.BufferAttribute(o,1));const r=u=>Vt({fog:!1,transparent:!u,depthWrite:!1,blending:c.AdditiveBlending,side:c.DoubleSide,uniforms:{uShaftCol:{value:xe},uShaftI:{value:(jt?.6:tt==="day"?.7:1)*(Ue?tt==="day"?1.2:1.5:1)*(u?.75:1)}},vertexShader:`
        attribute vec3 aB; attribute vec4 aS; attribute vec2 aI;
        uniform vec3 uCam;
        varying vec3 vP; varying vec4 vS; varying vec2 vI;
        void main(){
          vec3 d = aB - position; float len = length(d); vec3 ax = d / max(len, 1e-3);
          vec3 P = mix(position, aB, aS.x);
          vec3 toC = uCam - P; vec3 s = cross(ax, toC); s = s / max(length(s), 1e-4);
          ${Ma}
          float w = max(length(vec2(dot(s, bH) * aS.z, dot(s, bV) * aS.w)), .45);
          P += s * aS.y * w * 1.25;
          vP = P; vS = vec4(aS.x, aS.y, len, aS.z * aS.w / w); vI = aI;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(P.x, ${u?(2*ot.y).toFixed(2)+" - P.y":"P.y"}, P.z, 1.);
        }`,fragmentShader:`
        varying vec3 vP; varying vec4 vS; varying vec2 vI;
        uniform vec3 uShaftCol; uniform float uShaftI;
        ${_t}
        void main(){
          float prof = 1. - vS.y * vS.y; prof *= prof;
          float ends = smoothstep(0., .07, vS.x) * (1. - .35 * vS.x);
          float time = uHall.z;
          float dust = .5 + .5 * vnoise(vec2(vS.x * vS.z * .22 - time * .1, vS.y * 1.6 + vI.y * 19.));
          dust *= .7 + .3 * vnoise(vec2(vS.x * vS.z * .9 + time * .23, vS.y * 4. - vI.y * 7.));
          float flick = .62 + .38 * vnoise(vec2(time * .7 + vI.y * 40., vI.y * 13.));
          vec3 v = vP - uCam; float d = length(v); vec3 vd = v / max(d, 1e-3);
          float nearF = smoothstep(2.5, 11., d);
          float toSun = max(dot(vd, uSunH), 0.);
          float phase = .8 + .75 * toSun * toSun;
          float dens = 1. - exp(-vS.w * .22);
          // never meet the floor (or end) at a line: fade out over the last metres above the litter, edges broken by leaf shadow
          float soft = smoothstep(.15, 3.4, vP.y) * (1. - smoothstep(.8, 1., vS.x));
          soft *= .72 + .28 * vnoise(vec2(vS.y * 3.1 + vI.y * 5., vS.x * vS.z * .35));
          float a = prof * ends * soft * dust * flick * nearF * phase * dens * vI.x * uShaftI * exp(-d * uHall.y * .55);
          gl_FragColor = vec4(uShaftCol * a * 1.35, 1.);
        }`}),f=new c.Mesh(s,r(!1));f.frustumCulled=!1,f.renderOrder=6,E.add(f);const g=new c.Mesh(s,r(!0));g.frustumCulled=!1,g.renderOrder=-4.5,E.add(g)}const Fo=36,Xo=Vt({fog:!1,transparent:!0,depthWrite:!1,blending:c.AdditiveBlending,side:c.BackSide,uniforms:{uShaftCol:{value:xe},uCol:{value:new c.Vector4(F.x,F.z,F.r-1.5,Fo)},uColI:{value:1}},vertexShader:`
      varying vec3 vP;
      void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,fragmentShader:`
      varying vec3 vP; uniform vec3 uShaftCol; uniform vec4 uCol; uniform float uColI;
      ${_t}
      void main(){
        vec3 ro = uCam, v = vP - uCam; float dl = length(v); vec3 rd = v / max(dl, 1e-3);
        vec2 oc = ro.xz - uCol.xy;
        float a = max(dot(rd.xz, rd.xz), 1e-5), b = dot(oc, rd.xz), c = dot(oc, oc) - uCol.z * uCol.z;
        float disc = b * b - a * c;
        float sq = sqrt(max(disc, 0.));
        float t0 = max((-b - sq) / a, 0.), t1 = (-b + sq) / a;
        float ry = abs(rd.y) < 1e-4 ? 1e-4 : rd.y;
        float ta = (0. - ro.y) / ry, tb = (uCol.w - ro.y) / ry;
        t0 = max(t0, min(ta, tb)); t1 = min(min(t1, max(ta, tb)), dl + 2.);
        float chord = max(t1 - t0, 0.) * step(0., disc);
        vec3 pm = ro + rd * (t0 + t1) * .5;
        float s = dot(pm.xz - uCol.xy, uSunH.xz);
        float shadowH = uCol.w - 9. - (uCol.z - s) * uSunDir.y / max(length(uSunDir.xz), .05);
        float lit = .68 + .32 * smoothstep(-7., 7., pm.y - shadowH);
        float mote = .7 + .3 * vnoise(vec2(pm.x * .11 + pm.z * .07, pm.y * .16 - uHall.z * .04));
        float fadeTop = 1. - smoothstep(uCol.w - 12., uCol.w, pm.y);
        // the crown round the well is lumpy, so the sun comes over it in beams: the air of the well is barred with light
        // and shade along the sun (three places along the line through it, each asked which beam it stands in)
        vec3 bH = cross(uSunDir, vec3(0., 1., 0.)); bH = bH / max(length(bH), 1e-3); vec3 bV = cross(bH, uSunDir);
        float beam = 0.;
        for (int k = 0; k < 3; k++) {
          vec3 pk = ro + rd * (t0 + chord * (.18 + .32 * float(k)));
          vec2 bp = vec2(dot(pk, bH), dot(pk, bV));
          beam += smoothstep(.36, .68, vnoise(vec2(bp.x * .15 + 3., bp.y * .045)) * .68 + vnoise(vec2(bp.x * .47 + 7., bp.y * .13)) * .32);
        }
        beam *= .3333;
        float g = (1. - exp(-chord * .012)) * lit * mote * (.35 + .65 * fadeTop) * exp(-t0 * uHall.y * .45) * (.6 + .95 * beam);
        float inside = (1. - smoothstep(uCol.z + 2., uCol.z + 17., length(oc))) * (1. - smoothstep(uCol.w - 8., uCol.w, ro.y));
        g *= mix(1., (.2 + .34 * beam) * (1. - .75 * smoothstep(.1, .6, rd.y)), inside);                    // from within the court it is the air we are in, not a wall of gold
        // from the court floor the far lip of the well is leaf in clear morning air: the gold hangs under the eave, not over the crowns
        g *= 1. - .86 * smoothstep(5., 15., ro.y + rd.y * t1) * (1. - smoothstep(12., 20., ro.y)) * smoothstep(-.02, .06, rd.y);
        gl_FragColor = vec4(uShaftCol * g * uColI * 1.9, 1.);
      }`});{const t=new c.CylinderGeometry(F.r-1.5,F.r-1.5,Fo,48,1,!0);t.translate(F.x,Fo/2,F.z);const e=new c.Mesh(t,Xo);e.frustumCulled=!1,e.renderOrder=5,E.add(e);const a=new c.CircleGeometry(F.r-1.5,48);a.rotateX(-Math.PI/2),a.translate(F.x,Fo,F.z);const d=new c.Mesh(a,Xo);d.frustumCulled=!1,d.renderOrder=5,E.add(d)}{const t=Math.round(2600*wt),e=new Float32Array(t*3),a=new Float32Array(t*3),d=new Float32Array(t*4),b=new Float32Array(t*2),y=ct("motes");for(let f=0;f<t&&fo.length;f++){const g=fo[y.int(0,fo.length-1)];e.set([g.A.x,g.A.y,g.A.z],f*3),a.set([g.B.x,g.B.y,g.B.z],f*3);const u=y.range(0,q),w=Math.sqrt(y());d.set([y.range(.1,1),Math.cos(u)*w,Math.sin(u)*w,y()],f*4),b.set([g.a,g.bv],f*2)}const o=new c.BufferGeometry;o.setAttribute("position",new c.BufferAttribute(e,3)),o.setAttribute("aB",new c.BufferAttribute(a,3)),o.setAttribute("aD",new c.BufferAttribute(d,4)),o.setAttribute("aE",new c.BufferAttribute(b,2));const s=Vt({fog:!1,transparent:!0,depthWrite:!1,blending:c.AdditiveBlending,uniforms:{uShaftCol:{value:xe}},vertexShader:`
        attribute vec3 aB; attribute vec4 aD; attribute vec2 aE;
        uniform vec3 uCam; uniform vec4 uHall; uniform float uPx;
        varying float vA;
        void main(){
          vec3 d = aB - position; float len = length(d); vec3 ax = d / max(len, 1e-3);
          ${Ma}
          float time = uHall.z, sd = aD.w, gnat = step(.78, sd);
          float t = fract(aD.x + time * .003 * (sd - .5));
          vec3 P = mix(position, aB, t) + bH * aE.x * aD.y * .9 + bV * aE.y * aD.z * .9;
          float sp = mix(.35, 3.2, gnat), am = mix(.35, .22, gnat);
          P += vec3(sin(time * sp + sd * 91.), sin(time * sp * 1.31 + sd * 47.) * mix(.5, 1.4, gnat), cos(time * sp * .87 + sd * 63.)) * am;
          vec4 mv = modelViewMatrix * vec4(P, 1.);
          float dist = max(-mv.z, .1);
          float ideal = mix(.03, .05, gnat) * uPx / dist;
          gl_PointSize = clamp(ideal, 1.5, 7.);
          float tw = .55 + .45 * sin(time * (1.5 + 4. * sd) + sd * 200.);
          vA = min(1., ideal / 1.5) * tw * smoothstep(1.5, 5., dist) * exp(-dist * uHall.y) * smoothstep(.02, .1, t) * mix(1., .75, gnat);
          gl_Position = projectionMatrix * mv;
        }`,fragmentShader:`
        varying float vA; uniform vec3 uShaftCol;
        void main(){
          vec2 q = gl_PointCoord - .5; float r = dot(q, q) * 4.;
          float a = max(1. - r, 0.); a *= a;
          gl_FragColor = vec4(uShaftCol * a * vA * 2.6, 1.);
        }`}),r=new c.Points(o,s);r.frustumCulled=!1,r.renderOrder=7,E.add(r)}await G.yield();const za=Tt(se,new c.Color(.45,.2,.05),.5).multiplyScalar(.75),Pa=se.clone();{const t=ct("hungcolony"),e=[],a=Math.round(2900*wt*it),d=Rt.length/4;for(let f=0,g=0;f<a&&g<a*8;g++){let u,w,i;const l=t();if(l<.62&&d){const v=t.int(0,d-1)*4,m=Io(Rt[v],Rt[v+2]);if(!t.chance(.3+.7*m))continue;const p=2+t.int(0,5);for(let x=0;x<p;x++)e.push(Rt[v]+t.range(-.9,.9),Rt[v+1]+t.range(-.05,.1),Rt[v+2]+t.range(-.9,.9),t.range(.56,.74),t(),0);f+=p;continue}else if(l<.9){const v=t.int(de+6,et),m=t.range(0,q),p=38*Math.sqrt(t());if(u=Z[v]+Math.cos(m)*p,i=at[v]+Math.sin(m)*p,w=Ht(u,i)+.7-t.range(0,1.4),Lt(u,i)>.95||kt(u,i)<F.r+1||!t.chance(.35+.65*Io(u,i)))continue}else{const v=t.range(0,q),m=t.range(-1,7);u=F.x+Math.cos(v)*(F.r+m),i=F.z+Math.sin(v)*(F.r+m),w=ee(u,i,m)-t.range(.6,1.6)}dt(u,w-.5,i)<4.6||(e.push(u,w,i,t.range(.56,.74),t(),0),f++)}const b=e.length/6,y=[];for(let f=0;f<b;f++)t.chance(.24)&&y.push(f);const o=Yo(b+y.length,7,(f,g)=>{const u=(f<b?f:y[f-b])*6;g[0]=e[u],g[1]=e[u+1],g[2]=e[u+2],g[3]=e[u+3],g[4]=e[u+4],g[5]=f<b?0:1,g[6]=0});$e(o,"position",3,0),$e(o,"aH",4,3);const s=Vt({side:c.DoubleSide,uniforms:{uMantle:{value:za},uAmber:{value:Pa}},vertexShader:`
        attribute vec4 aH;
        uniform vec4 uHall, uWave; uniform vec3 uCam;
        varying vec3 vP; varying vec2 vUv; varying vec2 vK;
        ${ue}
        void main(){
          float sz = aH.x, sd = aH.y, kind = aH.z, time = uHall.z;
          vec3 H = position;
          sz *= smoothstep(uWave.w * .55, uWave.w, length(H - uWave.xyz) + (sd - .5) * uWave.w * .3);      // rare event: the colony lets go
          vec3 toC = vec3(uCam.x - H.x, 0., uCam.z - H.z); toC = toC / max(length(toC), 1e-3);
          vec3 right = vec3(toC.z, 0., -toC.x);
          float ph = time * (1.3 + sd) + sd * 50.;
          float shuffle = smoothstep(.93, 1., sin(time * .35 + sd * 77.));              // now and then one shifts its grip
          float sw = .13 * sin(ph) + .05 * sin(ph * 2.7 + 1.) + .25 * shuffle * sin(time * 9.);
          vec3 dn = normalize(vec3(0., -1., 0.) + right * sw + toC * .08 * cos(ph * .8));
          vec3 P;
          if (kind < .5) P = H + right * uv.x * sz * .3 + dn * (uv.y * .5 + .5) * sz;
          else {
            float side = sd > .5 ? 1. : -1.;
            float open = smoothstep(-.2, .9, sin(time * (.5 + .6 * sd) + sd * 9.)) * (.75 + .25 * sin(time * (5. + 3. * sd)));   // fanning
            P = H + dn * sz * (.22 + (uv.y * .5 + .5) * .9) + right * side * sz * (.12 + (uv.x * .5 + .5) * (.25 + 1.25 * open));
          }
          vP = P; vUv = uv; vK = vec2(kind, sd);
          vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        varying vec3 vP; varying vec2 vUv; varying vec2 vK; uniform vec3 uMantle, uAmber;
        ${_t}
        ${ae}
        void main(){
          float y = vUv.y * .5 + .5, x = vUv.x;
          vec3 alb; float thru = 0.;
          if (vK.x < .5) {
            float w = mix(.14, 1., smoothstep(0., .34, y)) * (1. - .62 * smoothstep(.72, 1., y));
            if (abs(x) > w) discard;
            float m = smoothstep(.52, .66, y) * (1. - smoothstep(.8, .9, y)) * (1. - smoothstep(.25, .6, abs(x)));
            alb = mix(vec3(.022, .018, .016), uMantle, m);
            alb = mix(alb, vec3(.012), smoothstep(.0, .5, abs(x)) * step(y, .6) * .5);
          } else {
            float sp = x * .5 + .5;
            float trail = .95 - .25 * abs(sin(sp * 7.85)) - .35 * sp;
            if (y > trail || y < .12 * sp) discard;
            float bone = 1. - smoothstep(.02, .06, abs(fract(atan(y - .02, sp + .12) * 2.6) - .5) * .5);
            alb = vec3(.03, .022, .018); thru = 1. - bone;
          }
          float sv = sunVis(vP);
          vec3 lit = hallLight(vP, vec3(0., -.4, 0.) + normalize(vec3(uCam.x - vP.x, 0., uCam.z - vP.z) + 1e-4) * .9, 1.);
          vec3 col = alb * lit * 1.3 + uAmber * uSunCol * sv * (.06 + .55 * thru) + uMantle * uSunCol * sv * .25 * (1. - vK.x);
          col = hallHaze(col, vP);
          gl_FragColor = vec4(col, 1.);
          #include <fog_fragment>
        }`}),r=new c.Mesh(o,s);r.frustumCulled=!1,E.add(r)}await G.yield();const Sa=[],qe={uPour:{value:0},uBat:{value:new c.Vector4(0,0,F.x,F.z)},uS0:{value:new c.Vector3},uS1:{value:new c.Vector3},uMantle:{value:za},uAmber:{value:Pa}};{const t=ct("wingbats"),e=new c.Vector3(Z[0]-Z[40],0,at[0]-at[40]).normalize();qe.uS1.value.set(F.x,0,F.z).addScaledVector(e,30),qe.uS0.value.set(F.x,0,F.z).addScaledVector(e,900);const a=[],d=[.215,.245,.3,.36,.43,.5,.585,.61,.635,.66,.685,.71];for(let g=0;g<d.length;g++){const u=Math.min(et-2,Math.round((d[g]+.012)*et)),w=Z[u+1]-Z[u],i=at[u+1]-at[u],l=Math.hypot(w,i)||1,v=(g%2?1:-1)*t.range(2.5,6),m=Z[u]-i/l*v,p=at[u]+w/l*v,x=Ct[u]<13?Math.max(Ct[u]+5.6,Math.min(Ht(m,p)-2.4,Ct[u]+7)):Ct[u]-3;a.push(m,x,p,Math.atan2(i,w)+t.range(-.3,.3),d[g],0,t()),Sa.push({u:d[g],position:new c.Vector3(m,x,p)})}for(let g=0;g<38;g++){let u,w,i,l;if(g<10){const v=t.range(0,q);u=F.x+Math.cos(v)*(F.r+2.5),i=F.z+Math.sin(v)*(F.r+2.5),w=Ht(u,i)-1,l=v+t.range(-.5,.5)}else{const v=t.int(de+10,et),m=t.range(0,q),p=t.range(6,16);u=Z[v]+Math.cos(m)*p,i=at[v]+Math.sin(m)*p,w=Ht(u,i)-2.3,l=t.range(0,q),(dt(u,w-1.5,i)<5||kt(u,i)<F.r+2)&&(u+=1e4)}a.push(u,w,i,l,-1,t(),t())}const b=a.length/7,y=Math.round(3e3*wt*it),o=Math.round(900*wt*it),s=Yo((y+o)*2+b*5,10,(g,u)=>{if(g<(y+o)*2)g%2===0&&(u[0]=t(),u[1]=t(),u[2]=t(),u[3]=t()),u[4]=u[5]=u[6]=0,u[7]=0,u[8]=g%2?1:-1,u[9]=g<y*2?0:1;else{const w=g-(y+o)*2,i=Math.floor(w/5)*7,l=w%5;u[0]=a[i],u[1]=a[i+1],u[2]=a[i+2],u[3]=a[i+3],u[4]=a[i+4],u[5]=a[i+5],u[6]=a[i+6],u[7]=l===4?3:l<2?1:2,u[8]=l===4?0:l%2?1:-1,u[9]=2}});$e(s,"position",3,0),$e(s,"aQ",4,3),$e(s,"aV",3,7);const r=Vt({side:c.DoubleSide,uniforms:qe,vertexShader:`
        attribute vec4 aQ; attribute vec3 aV;
        uniform vec4 uHall, uBat; uniform vec3 uCam, uS0, uS1; uniform float uPour;
        varying vec3 vP; varying vec3 vW;
        ${ue}
        vec3 flyPos(float time, vec3 sd, float sw, float mode, out float vis){
          if (mode < .5) {
            float h0 = fract(sd.x - time * .02 * (.8 + .4 * sw)), hh = h0 * sqrt(sqrt(h0));       // thickest low over the well
            float r = 7. + 30. * pow(hh, .8) + (sd.y - .5) * 9. * (.3 + hh);
            float ang = (floor(sd.z * 3.) / 3. + (fract(sd.z * 3.) - .5) * .2) * 6.2832 - 12. * log(10. + 34. * hh);
            float fy = 11. + 127. * pow(hh, 1.3) + (sw - .5) * 6.;
            vis = smoothstep(0., .03, hh) * (1. - smoothstep(.93, 1., hh)) * (1. - uPour * (1. - smoothstep(26., 46., fy)));
            return vec3(uBat.z + cos(ang) * r, fy, uBat.w + sin(ang) * r);
          }
          float s = fract(sd.x + time * .011 * (.85 + .3 * sw));
          vec3 ax = uS1 - uS0; vec3 perp = vec3(-ax.z, 0., ax.x) / max(length(ax.xz), 1e-3);
          float l = sd.y * 2. - 1.;
          float lat = (l < 0. ? -1. : 1.) * (7. + 80. * l * l) + 3. * sin(s * 40. + sw * 30.);
          vis = smoothstep(0., .03, s) * (1. - smoothstep(.94, 1., s));
          return mix(uS0, uS1, s) + perp * lat + vec3(0., 46. + (sd.z - .5) * 24. + 2.5 * sin(s * 55. + sw * 17.), 0.);
        }
        void main(){
          float part = aV.x, side = aV.y, mode = aV.z, time = uHall.z;
          vec3 F, A, Rl, D; float phi, spread, vis, sd;
          if (mode < 1.5) {
            sd = aQ.x; float v2;
            vec3 p0 = flyPos(time, position, sd, mode, vis), p1 = flyPos(time + .12, position, sd, mode, v2);
            vec3 d = p1 - p0; A = d / max(length(d), 1e-4);
            F = p0 - A * .28;
            float fl = sin(time * (15. + 3. * sd) + sd * 100.);
            float glide = smoothstep(.6, .9, sin(time * .7 + sd * 31.));
            phi = .12 + .78 * fl * (1. - .8 * glide); spread = 1.;
            Rl = vec3(-A.z, 0., A.x); Rl = Rl / max(length(Rl), 1e-3);
          } else {
            sd = aQ.w;
            float p = aQ.y < 0. ? fract(time / (10. + 6. * sd) + aQ.z)
                    : mix(fract(time / 9. + sd), clamp(.46 + (uBat.x - aQ.y) / .16, 0., .86), uBat.y);
            vec3 a = vec3(cos(aQ.x), 0., sin(aQ.x)), up = vec3(0., 1., 0.), Hk = position;
            Rl = vec3(-a.z, 0., a.x);
            float f = clamp(p / .4, 0., 1.), g = smoothstep(.4, .52, p), h = clamp((p - .52) / .36, 0., 1.), dp = clamp((p - .88) / .12, 0., 1.);
            vec3 Q = Hk - up * 1.25 - a;
            F = Q - a * 42. * (1. - f) - up * 2.5 * (1. - f) * (1. - f);
            F = mix(F, Hk, g) + a * sin(3.1416 * g) * .7 - up * sin(3.1416 * g) * .3;
            F += -up * 1.6 * sin(1.5708 * dp) + a * 40. * dp * dp;
            float th = 4.7124 * g + .6 * exp(-5. * h) * sin(h * 26.) * step(.52, p) + 1.5708 * smoothstep(0., .5, dp);
            A = a * cos(th) + up * sin(th);
            float wfly = clamp(1. - smoothstep(0., .25, h) + smoothstep(0., .3, dp), 0., 1.);
            float fl = sin(time * 16. + sd * 40.);
            phi = mix(-1.3, .15 + .7 * fl * (1. - .6 * g) + .6 * sin(3.1416 * g), wfly);
            spread = mix(.14, 1., wfly);
            vis = smoothstep(0., .03, p) * (1. - smoothstep(.5, 1., dp));
          }
          D = cross(Rl, A);
          vec3 Fc = F + A * .28, P;
          if (part > 2.5) {
            vec3 toC = uCam - Fc; vec3 wd = cross(A, toC); wd = wd / max(length(wd), 1e-4);
            P = F + A * (uv.y * .5 + .5) * .46 + wd * uv.x * .11;
            vW = vec3(uv.x, uv.y, 3.);
          } else {
            float s01 = uv.x * .5 + .5;
            float sp = part < .5 ? s01 : part < 1.5 ? s01 * .5 : .5 + s01 * .5;
            float ph2 = phi * (1. + .5 * sp);
            vec3 arm = Rl * side * cos(ph2) + D * sin(ph2);
            P = F + A * (.3 - uv.y * .2 * (.45 + .55 * spread) - .1 * sp * spread) + arm * sp * .66 * spread;
            vW = vec3(sp, uv.y, 0.);
          }
          float dc = length(uCam - Fc);
          float fk = step(.5, mode);
          P = Fc + (P - Fc) * vis * clamp(dc / mix(92., 170., fk), 1., mix(3.6, 2.6, fk)) * smoothstep(5., 11., dc);      // none so near that the frame's edge cuts it
          vP = P;
          vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        varying vec3 vP; varying vec3 vW; uniform vec3 uMantle, uAmber;
        ${_t}
        ${ae}
        void main(){
          float sp = vW.x, c = vW.y, bone = 0.; vec3 alb = vec3(.024, .019, .017);
          if (vW.z > 2.5) {
            float y = clamp(c * .5 + .5, 0., 1.);
            if (abs(sp) > .25 + .75 * sqrt(max(sin(3.1416 * y), 0.))) discard;
            alb = mix(alb, uMantle, smoothstep(.5, .66, y) * (1. - smoothstep(.84, .95, y)));
            bone = 1.;
          } else {
            float lead = -.9 + .55 * abs(sp - .42);
            float trail = .8 - .5 * sp - .24 * abs(sin(sp * 7.854));
            if (c < lead || c > trail || sp > .985) discard;
            float armB = 1. - smoothstep(.02, .16, c - lead);
            float ang = atan(c + .62, sp - .42 + 1e-4);
            float fing = (1. - smoothstep(.03, .1, abs(fract(ang * 1.9 + .25) - .5))) * step(.42, sp);
            float body = 1. - smoothstep(.04, .16, sp);
            bone = max(max(armB, fing), body);
            alb = mix(alb, uMantle, body * (1. - smoothstep(-.5, .1, c)) * .8);
          }
          vec3 v = vP - uCam; vec3 vd = v / max(length(v), 1e-3);
          float above = smoothstep(15., 24., vP.y);
          float sv = mix(sunVis(vP), 1., above);
          // dark wings, chestnut mantle; only a wing between us and the sun glows amber, its bones dark in it
          float th = max(dot(vd, uSunDir), 0.); th *= th; th *= th;
          float webv = .65 + .5 * vnoise(vec2(sp * 14., c * 9.));
          vec3 col = alb * (uSkyAmb * .7 + uShade * .7 + uSunCol * sv * .45);
          col += uAmber * uSunCol * sv * (1. - bone) * webv * (.012 + .018 * (1. - above) + .55 * th);
          col = mix(hallHaze(col, vP), col, above);
          gl_FragColor = vec4(col, 1.);
          #include <fog_fragment>
        }`}),f=new c.Mesh(s,r);f.frustumCulled=!1,E.add(f)}{const a=new Float32Array(1218),d=new Float32Array(406*3),b=[];for(let r=0;r<=13;r++)for(let f=0;f<=28;f++){const g=r/13,u=f/28*q,w=8.5+30*Math.pow(g,.8)+3.5*g,i=(r*29+f)*3;if(a[i]=F.x+Math.cos(u)*w,a[i+1]=9+129*Math.pow(g,1.3),a[i+2]=F.z+Math.sin(u)*w,d[i]=Math.cos(u),d[i+1]=g,d[i+2]=Math.sin(u),r<13&&f<28){const l=r*29+f;b.push(l,l+1,l+28+2,l,l+28+2,l+28+1)}}const y=new c.BufferGeometry;y.setAttribute("position",new c.BufferAttribute(a,3)),y.setAttribute("aH",new c.BufferAttribute(d,3)),y.setIndex(b);const o=Vt({fog:!1,transparent:!0,depthWrite:!1,side:c.DoubleSide,vertexShader:`
        attribute vec3 aH; varying vec3 vP, vH;
        void main(){ vP = position; vH = aH; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,fragmentShader:`
        varying vec3 vP, vH;
        ${_t}
        void main(){
          vec3 v = vP - uCam; float d = length(v), t = uHall.z;
          vec2 vh = v.xz / max(length(v.xz), 1e-3);
          float face = abs(dot(vec2(vH.x, vH.z), vh));                                   // deep through the middle, nothing at the outline
          float n = vnoise(vP.xz * .3 + vec2(t * .45, vP.y * .17)) * .55 + vnoise(vec2(vP.x * .95 - t * .8, vP.y * .7 + vP.z * .95)) * .45;
          float wisp = vnoise(vec2(vP.y * .045 - t * .05, vP.x * .03 + vP.z * .03));
          float a = face * face * (.3 + .7 * smoothstep(.36, .66, n)) * (.55 + .45 * wisp) * smoothstep(0., .05, vH.y) * (1. - smoothstep(.42, .98, vH.y)) * smoothstep(75., 200., d);
          gl_FragColor = vec4(vec3(.03, .026, .024) * (uSkyAmb + uShade), a * .56);
        }`}),s=new c.Mesh(y,o);s.frustumCulled=!1,s.renderOrder=4,E.add(s)}await G.yield();const vo=t=>Nt.pointAt(t),Yt=(t,e,a)=>new c.Vector3(t,e,a),Zo=(t,e=.04)=>({position:vo(t),target:vo(Math.min(1,t+e))});function zn(t,e,a){const d=Math.max(0,Ft-e)/Math.max(.001,J.y/Math.max(.001,Math.hypot(J.x,J.z))),b=t+Q.x*d,y=a+Q.z*d;if(kt(b,y)<F.r)return 1;let o=0;for(let s=0;s<re.length;s++){const r=re[s],f=b-r.gx,g=y-r.gz,u=Math.hypot((f*Q.x+g*Q.z)/Math.max(r.b,1.3),(g*Q.x-f*Q.z)/Math.max(r.a,1.3));u<1&&(o=Math.max(o,Math.min(1,r.I)*(1-St(.62,1,u))))}return o}const Pn={flyThrough:fe,portalSeat:{position:te.clone(),facing:Qe.clone().multiplyScalar(-1)},oculus:{center:Yt(F.x,27,F.z),radius:F.r,rimY:27},courtyard:{center:Yt(F.x,.2,F.z),radius:F.r},funnelTop:Yt(F.x,138,F.z),stream:{from:qe.uS0.value.clone(),to:qe.uS1.value.clone()},sunDir:J.clone(),sunColor:Pe.clone(),grove:Yt(me.x,8,me.z),bounds:{rx:gt,rz:yt,height:32,ceiling:[13,20]},viewpoints:{entry:{position:vo(0),target:Yt(F.x,30,F.z)},dive:Zo(.22),firstHall:Zo(.33),nave:Zo(.65),column:{position:vo(.78),target:Yt(F.x,10,F.z)},avenue:{position:vo(.9),target:te.clone()}},stations:ve,perches:Sa,bough:ce,saplings:ba,feats:Wt,limbUnder:Rt,litAt:zn,giants:It.map((t,e)=>({x:t.x,z:t.z,r:t.R,top:Math.min(Ht(t.x,t.z)+1.6,Ot(t.x,t.z)-.8),mouth:e===1?ge:null})),pool:{a:Yt(ot.ax,ot.y,ot.az),b:Yt(ot.bx,ot.y,ot.bz),w:ot.w,y:ot.y},pillars:Ce.filter(t=>t.d<60).map(t=>({x:t.x,z:t.z,r:t.r*(t.col?2:1.6)})),columns:ke.map(t=>({x:t.x,z:t.z,r:t.r,top:t.top,pole:!!t.pole,d:t.d??14,ghost:!!t.ghost})),archFeet:[-1,1].map(t=>new c.Vector3(te.x+eo.x*t*9.9,0,te.z+eo.z*t*9.9)),pois:[{at:Yt(F.x,26,F.z),from:.05,to:.2,weight:.4},{at:Yt(F.x,9,F.z),from:.74,to:.84,weight:.35}]},Sn=ft.view||"hall",Ca={hall:[Yt(-60,4,-62),20,6],nave:[Yt(me.x,6,me.z),9,5],dome:[Yt(F.x,22,F.z),110,90],well:[Yt(F.x,8,F.z),10,44],arch:[Yt(te.x-Qe.x*22,6.5,te.z-Qe.z*22),9,4],column:[Yt(F.x,5,F.z),45,4],mix:[Yt(F.x,14,F.z),45,60]},Jo=Ca[Sn]||Ca.hall,ta=new c.Matrix4,mt=new c.Vector3,ka=new c.Vector3,Aa=new c.Vector2;let Ba=0,No=0,Fa=1,Na=1,Ha=1,Rn=!0;const Va=Qt.mid.map(t=>{t.geometry.boundingSphere||t.geometry.computeBoundingSphere();const e=t.geometry.boundingSphere;return{m:t,x:e.center.x,z:e.center.z,r:e.radius}}),Ho=(t,e)=>{for(let a=0;a<t.length;a++)t[a].visible=e};function La(t,e,a){if(Jt.uHall.value.z=e,a){E.updateWorldMatrix(!0,!1),ta.copy(E.matrixWorld).invert(),mt.setFromMatrixPosition(a.matrixWorld).applyMatrix4(ta);const d=a.matrixWorld.elements;ka.set(-d[8],-d[9],-d[10]).transformDirection(ta),Jt.uCam.value.copy(mt),Jt.uCamDir.value.copy(ka);const b=(1-St(.97,1.03,Lt(mt.x,mt.z)))*(1-St(19,27,mt.y));Fa=lt(.32,lt(1,.5,St(8,18,mt.y)),b),Ha=lt(1,.3,1-St(F.r-2,F.r+6,kt(mt.x,mt.z)))*(1-.96*St(15,25,mt.y)),Jt.uMist.value.w=1-.8*St(33,50,mt.y)*St(96,150,kt(mt.x,mt.z)),Jt.uOutK.value=Lt(mt.x,mt.z)>1||mt.y>21?1:0,Ae.uGust.value.z=mt.x*Ae.uGust.value.x+mt.z*Ae.uGust.value.y+66+9*Math.sin(e*.3),G.renderer?.getDrawingBufferSize?.(Aa),Jt.uPx.value=(Aa.y||720)*.5*a.projectionMatrix.elements[5]}Jt.uHall.value.y=Ea*Ua*Fa,Jt.uStage.value.x=St(16,26,mt.y),Jt.uStage.value.w=(1-St(F.r+4,F.r+18,kt(mt.x,mt.z)))*(1-St(13,21,mt.y));{const d=!No,b=mt.y<21,y=Lt(mt.x,mt.z)>.97,o=kt(mt.x,mt.z),s=mt.y>27,r=d||b||o<F.r+3&&!s;Ho(Qt.outer,d||s||y),Ho(Qt.court,d||!b||y||o<200),Ho(Qt.hall,r);{const f=ot.bx-ot.ax,g=ot.bz-ot.az,u=xt(((mt.x-ot.ax)*f+(mt.z-ot.az)*g)/(f*f+g*g),0,1);Ho(Qt.pool,d||b&&Math.hypot(mt.x-ot.ax-f*u,mt.z-ot.az-g*u)<125)}for(let f=0;f<Va.length;f++){const g=Va[f];g.m.visible=d||b&&Math.hypot(mt.x-g.x,mt.z-g.z)<g.r+160}for(let f=0;f<io.length;f++){const g=io[f];g.mesh&&(g.mesh.visible=d||r&&Math.hypot(mt.x-g.x,mt.z-g.z)<g.r+85)}qe.uPour.value=No*(1-St(43,59,o))*St(5,9,mt.y)*(1-St(40,50,mt.y))}Xo.uniforms.uColI.value=Ha,Jt.uWake.value=Na*(mt.y<11?1:0),qe.uBat.value.x=Ba,qe.uBat.value.y=No}let Ua=1;return La(0,0,null),{object:E,radius:Jo[1],height:Jo[2],center:Jo[0],anchors:Pn,update:La,setProgress(t){Ba=t,No=1},setHaze(t,e=1){t&&To.set(t),Ua=e},setWake(t){Na=t},setWave(t,e,a,d){Jt.uWave.value.set(t,e,a,Math.max(.001,d))},shared:{GL_COMMON:_t,GL_FOG_V:ue,GL_FOG_F:ae,U:Jt,mkMat:Vt,Store:ze,loft:Bt,floorY:bt,ceilY:Ht,domeY:Ot,rho:Lt,ocDist:kt,poolIn:Ke,hour:tt,season:vt,weather:rt,ROOF:Ft},stats:{pillars:Ce.length,near:Co[0],mid:Co[1],far:Co[2],shafts:re.length},dispose(){Le.dispose()},ground:!0,groundY:-.25}}export{_n as buildHero};
