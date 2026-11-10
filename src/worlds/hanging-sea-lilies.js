import*as S from"three";import{makePath as At,clamp as fe,lerp as pe,smoothstep as Ae}from"../kit/core.js";import{buildHero as St,buildSatellites as kt,WATER_GLSL as ht,LIGHT_GLSL as Tt}from"../parts/hanging-sea-lilies.js";const ft=["#2A9478","#5FC6A0","#E9F6E4","#F2B631","#C9577A","#3A2A1E","#0A1F1E"],m=(e,y,t)=>new S.Vector3(e,y,t),Ee=e=>new S.Color(e),Ct={morning:{sun:[.16,.819,-.55],gain:1.55,ambient:.58,sunK:1,cloud:.3,calm:1,rain:0,shaft:.13,warm:1,level:"#2A9478",up:"#5FC6A0",sky:"#E9F6E4"},noon:{sun:[.05,.985,-.16],gain:1.68,ambient:.62,sunK:1.12,cloud:.85,calm:.3,rain:0,shaft:.06,warm:.7,level:"#27988A",up:"#62CDB4",sky:"#F1F8F0"},squall:{sun:[.12,.93,-.35],gain:1.5,ambient:1.05,sunK:.24,cloud:1,calm:1.25,rain:1,shaft:0,warm:.12,level:"#4FA68C",up:"#93D0B8",sky:"#DDEBE0"}},Pt=`
varying vec3 vD;
void main(){ vD = position; vec4 p = projectionMatrix*modelViewMatrix*vec4(position, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p; }`,Lt=`
${ht}
varying vec3 vD;
void main(){ vec3 d = vD/max(length(vD), 1e-4); gl_FragColor = vec4(waterColor(d, uCamL.y + d.y*30.), 1.); }`,Ft=`
varying vec3 vP;
void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.); }`,Vt=`
${ht}
uniform vec3 uSkyCol; uniform float uCalm, uRain, uCloud, uSunK;
uniform vec4 uDimple;                                                // x, z, age (s), strength: a podmate breaking the surface
varying vec3 vP;
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
vec2 ring(vec2 w, float cell, float rate, float seed){                // one expanding raindrop ring per cell: (slope, light)
  vec2 id = floor(w/cell), f = fract(w/cell) - .5;
  float h = h21(id + seed), t = fract(uTime*rate + h*7.), r = t*.42;
  vec2 o = (vec2(h21(id + seed + 3.1), h21(id + seed + 7.7)) - .5)*.3;
  float d = length(f - o), band = (d - r)/.05;
  float g = exp(-band*band)*(1. - t)*(1. - t);
  return vec2(g*sign(d - r + 1e-4), g);
}
float rnet(vec2 q, float t){                                         // the net of bright lines a rippled surface makes
  q += .45*sin(q.yx*1.3 + t*.6);
  float v = abs(sin(q.x) + sin(q.y) + sin((q.x + q.y)*.71 + 1.3 + t*.4));
  return 1. - smoothstep(0., .95, v);
}
void main(){
  vec3 d = vP - uCamL; float l = max(length(d), 1e-3); d /= l;
  vec2 w = vP.xz;                                                    // swell 9 m long moving with the wind, plus chop
  vec2 n = uCalm*vec2(.05*sin(w.x*.9 + uTime*.8) + .03*sin(dot(w, vec2(2.1, 1.7)) + uTime*1.7),
                .09*sin(w.y*.698 - uTime*1.6) + .03*sin(dot(w, vec2(-1.6, 2.4)) - uTime*1.3));
  n += .012*vec2(sin(dot(w, vec2(5.3, 3.1)) + uTime*2.3), sin(dot(w, vec2(-3.7, 4.9)) - uTime*2.0))*(.4 + .6*uCalm);
  float near = exp2(-l/26.), mid = exp2(-l/70.), rainL = 0.;
  if (uRain > 0.) {
    vec2 r1 = ring(w, .9, .9, 0.), r2 = ring(w + 13.7, 1.7, .6, 5.), r3 = ring(w*1.0 + 41.3, .45, 1.3, 9.);
    float rs = (r1.x + r2.x + .6*r3.x)*uRain; rainL = (r1.y + r2.y + .6*r3.y)*uRain*near;
    n += .08*rs*near*vec2(sin(w.x*3.), cos(w.y*3.));
  }
  vec2 dp = w - uDimple.xy; float dd = length(dp), da = uDimple.z;      // rings spreading from a breath
  float dw = sin(dd*5. - da*9.)*exp(-dd*.55)*exp(-da*.7)*smoothstep(0., .3, da)*step(dd, da*2.4 + .6)*uDimple.w;
  n += .16*dw*dp/max(dd, .05);
  // the surface read from below: facets of the swell gather the light into a slow net of bright lines (two sizes; the
  // fine one only while it resolves), stretched along the swell far off so it never turns to noise
  float calmK = .5 + .5*min(uCalm, 1.);
  float netA = rnet(w*vec2(1.25, .85) + vec2(uTime*.45, -uTime*.3), uTime);
  float netB = rnet(w*vec2(3.7, 2.9) + vec2(-uTime*.8, uTime*.55) + 3., uTime*1.3);
  float calmP = .45 + 1.1*vn(w*.19 + vec2(uTime*.03, 7.));               // calmer and busier patches
  float net = (netA*.8*mid + netB*.55*near)*calmK*calmP;
  float c = d.y + dot(n, d.xz)*1.2 + (netA - .3)*.07*mid*calmK;
  float win = smoothstep(.60, .70, c);                               // Snell's window: 48.6 degrees from straight up
  vec3 sd = d + vec3(n.x, 0., n.y)*.9; sd /= max(length(sd), 1e-4);
  float s = max(dot(sd, uSunDir), 0.); float s2 = s*s; s2 *= s2; s2 *= s2; s2 *= s2;
  vec2 cw = w*.085 + sd.xz*2.2 + vec2(uTime*.012, 0.);                // cloud blurs seen through the window
  float cl = smoothstep(.62 - .45*uCloud, .95 - .3*uCloud, vn(cw) *.6 + vn(cw*2.3 + 7.)*.4);
  vec3 sky = mix(mix(uWUp, uSkyCol, .42)*.6, uSkyCol*.8, cl*(.45 + .5*uCloud));   // kept under white: a sky, not a pane
  sky *= (.66 + .95*net)*mix(.62, 1., smoothstep(.64, .9, c));         // the net of light, and a darker rim to the window
  sky += vec3(1., .95, .8)*(2.4*s2*s2*(.3 + 1.6*net) + .13*s2)*uSunK*(1. - .6*cl);   // the sun broken into glitter
  sky += vec3(.9, 1., .95)*rainL*.35;
  vec3 mir = waterColor(vec3(d.x + n.x, -.25 - .5*d.y, d.z + n.y)/1.3, -4.)*(.82 + 1.6*abs(n.x + n.y) + 1.25*net) + uWSilver*(rainL*.22 + .5*net*net*mid);
  vec3 colr = mix(mir, sky, win);
  vec3 sl = uSunDir*vec3(1., .42, 1.); sl /= max(length(sl), 1e-4);     // the surface on the sunward side is gold-green
  float wg = max(dot(d, sl), 0.); wg = wg*wg*uWarm;
  // (fifth polish) clean and luminous, never olive: away from the sun the ceiling keeps its own aquamarine (only a
  // step brighter toward the light); the warm gold is a tight core round the sun, laid in at the ceiling's own
  // brightness so the net of light stays written in it
  float wc = wg*wg; wc *= wc;                                          // the 8th power of the cosine
  colr *= 1. + .16*clamp(wg, 0., 1.);
  colr = mix(colr, vec3(1.5, .93, .22)*(dot(colr, vec3(.3, .5, .2))*1.3 + .07), clamp(wc*1.7, 0., 1.)*.9);     // a clear warm GOLD, saturated enough to stay gold through the tone map
  colr = colr/(1. + .22*max(colr.g - .9, 0.));                        // a soft shoulder: the sunward ceiling keeps its net of light
  gl_FragColor = vec4(mix(waterColor(d, uCamL.y + d.y*30.), colr, exp2(-l/max(uHalf*1.3, 1.))), 1.);
}`,Ut=`
uniform float uTime; uniform vec3 uSunDir, uCamL;
attribute vec4 aShaft;                                               // x, z at the surface, width, phase
varying vec2 vUv; varying float vA, vDeep;
void main(){
  float deepK = step(1.35, aShaft.z), len = mix(42., 66., deepK);   // (sixth polish) the widest shafts reach down into the blue under the open-water legs
  vDeep = deepK;
  vec2 o = aShaft.xy + vec2(sin(uTime*.11 + aShaft.w), cos(uTime*.09 + aShaft.w*1.7))*1.6;
  vec3 top = vec3(o.x, 0., o.y), p = top - uSunDir*(position.y*len);
  vec3 V = uCamL - p; vec3 S = cross(uSunDir, V); S /= max(length(S), 1e-4);
  p += S*position.x*aShaft.z*(1. + position.y*.6);
  vUv = vec2(position.x, position.y);
  float dist = length(V);
  vA = (.5 + .5*sin(uTime*.23 + aShaft.w*5.))*smoothstep(2., 9., dist)*exp2(-dist/70.);
  gl_Position = projectionMatrix*modelViewMatrix*vec4(p, 1.);
}`,Dt=`
uniform vec3 uShaftCol;
varying vec2 vUv; varying float vA, vDeep;
void main(){
  float x = 1. - vUv.x*vUv.x; x = max(x, 0.);
  float a = x*x*(1. - smoothstep(mix(.25, .45, clamp(vDeep, 0., 1.)), 1., vUv.y))*smoothstep(0., .03, vUv.y)*(.35 + .65*vA);
  gl_FragColor = vec4(uShaftCol*a, 1.);
}`;function Nt(e){const{U:y,scene:t,W:r,R:M}=e,z=new S.Mesh(new S.SphereGeometry(320,24,16),new S.ShaderMaterial({uniforms:{...y},vertexShader:Pt,fragmentShader:Lt,side:S.BackSide,depthWrite:!1,depthTest:!1}));z.renderOrder=-1,z.frustumCulled=!1,z.name="water-dome",t.add(z);const u=new S.PlaneGeometry(1400,1400);u.rotateX(Math.PI/2),e.ceilU={...y,uSkyCol:{value:Ee(r.sky)},uCalm:{value:r.calm},uRain:{value:r.rain},uCloud:{value:r.cloud},uSunK:{value:r.sunK},uDimple:{value:new S.Vector4(0,0,99,0)}};const w=new S.Mesh(u,new S.ShaderMaterial({uniforms:e.ceilU,vertexShader:Ft,fragmentShader:Vt,side:S.DoubleSide}));if(w.frustumCulled=!1,w.name="ceiling",t.add(w),r.shaft>0){const d=new S.InstancedBufferGeometry,P=[],l=[],h=6,p=44,V=24;for(let a=0;a<=h;a++)P.push(-1,a/h,0,1,a/h,0);for(let a=0;a<h;a++){const c=a*2;l.push(c,c+1,c+2,c+1,c+3,c+2)}d.setAttribute("position",new S.Float32BufferAttribute(P,3)),d.setIndex(l);const g=new Float32Array((p+V)*4);for(let a=0;a<p;a++){if(a<16){const T=a%2?1:-1;g.set([M.range(-17,17),T*M.range(3.5,16)-3,M.range(.25,.9),M.range(0,6.28)],a*4);continue}const c=e.path.pointAt(M.range(0,1)),b=M.chance(.5)?1:-1,n=e.path.tangentAt(.5);e.path.tangentAt(fe(e.path.nearestXZ(c.x,c.z).u,0,1),n);const o=b*M.range(7,24);g.set([c.x-n.z*o+e.sunDir.x/e.sunDir.y*c.y,c.z+n.x*o+e.sunDir.z/e.sunDir.y*c.y,M.range(.4,1.3),M.range(0,6.28)],a*4)}{const a=e.ctx.core.makeRng(5150+(e.ctx.seed|0)%1e5),c=m(0,0,0),b=m(0,0,1);for(let n=0;n<V;n++){const o=a.range(.45,.78),T=n%2?1:-1,x=T*a.range(5,15),k=a.range(6,20),R=a.range(3,8);e.path.pointAt(o,c),e.path.tangentAt(o,b);const I=c.x+b.x*k-b.z*x,E=c.z+b.z*k+b.x*x,C=-c.y+R;g.set([I+e.sunDir.x/e.sunDir.y*C,E+e.sunDir.z/e.sunDir.y*C,a.range(1.4,2.3),a.range(0,6.28)],(p+n)*4)}}d.setAttribute("aShaft",new S.InstancedBufferAttribute(g,4)),d.instanceCount=p+V;const s=new S.Mesh(d,new S.ShaderMaterial({uniforms:{uTime:y.uTime,uSunDir:y.uSunDir,uCamL:y.uCamL,uShaftCol:{value:Ee(r.up).lerp(Ee("#FFE6A0"),.6).multiplyScalar(r.shaft*1.25)}},vertexShader:Ut,fragmentShader:Dt,transparent:!0,depthWrite:!1,blending:S.AdditiveBlending,side:S.DoubleSide}));s.frustumCulled=!1,s.renderOrder=9,s.name="shafts",t.add(s)}e.updaters.push((d,P,l,h,p)=>{z.position.copy(p)})}const Bt=`
varying vec3 vP; varying float vR;
void main(){ vec4 wp = modelMatrix*vec4(position, 1.); vP = wp.xyz; vR = length(position.xy); gl_Position = projectionMatrix*viewMatrix*wp; }`,It=`
${ht}
uniform float uCover; uniform vec3 uRingC, uRingN;
varying vec3 vP; varying float vR;
void main(){
  vec3 d = vP - uCamL; d /= max(length(d), 1e-4);
  float dn = dot(d, uRingN); dn = (dn < 0. ? -1. : 1.)*max(abs(dn), 1e-4);
  float t = dot(uRingC - uCamL, uRingN)/dn;                          // where this line of sight meets the ring's own plane
  float r = length(uCamL + d*t - uRingC);
  float a = t > 0. ? 1. - smoothstep(9.5, 14., r) : 0.;               // solid over the ring, feathered over its glow, from any side
  gl_FragColor = vec4(waterColor(d, uCamL.y + d.y*30.), uCover*a);
}`;function Et(e){const{A:y,M:t,scene:r,U:M}=e,z=y.portalSeat,u={...M,uCover:{value:1},uRingC:{value:z.position.clone()},uRingN:{value:z.facing.clone().normalize()}},w=new S.SphereGeometry(1,28,18),d=new S.Mesh(w,new S.ShaderMaterial({uniforms:u,vertexShader:Bt,fragmentShader:It,transparent:!0,depthWrite:!1}));d.position.copy(z.position),d.quaternion.setFromUnitVectors(m(0,0,1),z.facing.clone().normalize()),d.scale.set(14.5,14.5,3.4),d.renderOrder=8,d.frustumCulled=!1,d.name="ring-cover",r.add(d),e.updaters.push((P,l,h,p)=>{const V=1-Ae(t.east0+.005,t.east0+.05,p);u.uCover.value=V,d.visible=V>.002})}var fa={id:"hanging-sea-lilies",name:"The Hanging Meadow",category:"prehistoric",weirdness:.5,media:["underwater"],async build(e){const y=e.rng.fork("hanging-meadow-world"),t=e.vary||{},r=fe(e.quality?.detail??1,.5,1),M=fe(t.density??1,.7,1.3),z=y(),u=t.mood??z;let w=u<.2||u>=.5?"morning":u<.33?"squall":"noon";t.hour==="day"?w="noon":(t.hour==="dawn"||t.hour==="golden")&&(w="morning");const d=u*7.3%1,P=d<.55?"saffron":d<.8?"coral":"lemon",l=Ct[w],h=m(l.sun[0],l.sun[1],l.sun[2]).normalize(),p=new S.Scene;p.background=Ee(l.level);const V=[l.level,l.up,l.sky,ft[3],ft[4],ft[5],"#0A2C38"],g=await St(e,{palette:V,backdrop:!1,sunDir:h,detail:r,crowns:P});g.setLight({ambient:l.ambient,sun:l.sunK,gain:l.gain,half:55}),g.uniforms.uWarm.value=l.warm,p.add(g.object),await e.yield();const s=g.anchors,a=[[-17.6,-6.5,23],[-14.2,-6,15.5],[-11.2,-5.2,9.2],[-8.2,-4.3,4.6]].map(q=>m(q[0],q[1],q[2])),c=[[9.5,-14.6,-24.5],[15,-12.6,-31.5],[22,-10.7,-35.5],[31,-9.7,-35.5],[39.5,-9.1,-32.5],[44.2,-8.6,-27],[45.6,-8,-20.5],[44.6,-7.2,-13.8],[42,-6.9,-8.7]].map(q=>m(q[0],q[1],q[2])),b=s.underLog.slice(2),n=[...a,...b,...s.leadIn,...s.helix,...s.exit,...c,...s.dive.slice(2)],o=At(n,{samples:640});await e.yield();const T={log0:b[0],log1:s.underLog[s.underLog.length-1],helix0:s.helix[0],helix1:s.helix[s.helix.length-1],out:c[0],turn:c[1],side:c[1],east0:c[2],east1:c[6],dive0:s.dive[2],under:s.viewpoints.underFoot},x={},k=Object.keys(T),R=k.map(()=>1e9),I=m(0,0,0);for(let q=0;q<=600;q++){o.pointAt(q/600,I);for(let B=0;B<k.length;B++){const de=I.distanceToSquared(T[k[B]]);de<R[B]&&(R[B]=de,x[k[B]]=q/600)}}await e.yield();const E={ctx:e,scene:p,hero:g,U:g.uniforms,path:o,W:l,weather:w,R:y,sunDir:h,detail:r,density:M,vary:t,M:x,A:s,updaters:[],disposers:[],rare:!!t.rare};E.frameAt=Ht(o),await Rt(E),await e.yield(),Nt(E),await e.yield(),Et(E),await e.yield(),Ot(E),await e.yield(),Gt(E),await e.yield(),await Xt(E),await e.yield(),await Jt(E),await e.yield(),oa(E),await e.yield(),ia(E),await e.yield(),E.rare&&ha(E),await e.yield();const C=m(0,0,0),N=m(0,0,0),f=m(0,0,-1),D=m(0,500,0),$=m(0,-10,-3.6),Z=m(5.2,-3.4,-13),j=m(-1.5,-16.5,-6.7),O=m(0,-8.5,-3),be=m(10.6,-7.5,-47.5),Te=m(0,-10,-3.6),ce=m(0,0,0),ze=m(0,0,0),ye=m(0,0,0);return{scene:p,path:o,duration:40,pace:q=>{const B=Ae(x.log0-.05,x.log0+.01,q),de=Ae(x.log1-.01,x.helix0+.03,q),se=Ae(x.helix1-.03,x.helix1+.04,q),je=Ae(.84,.97,q),tt=(q-E.giant1U)/.04,Xe=(q-E.giantU+.01)/.035,$e=(q-x.east0-.02)/.05;return pe(pe(pe(pe(.95,.8,B),.6,de),1.15,se),1,je)-.3*Math.exp(-tt*tt)-.25*Math.exp(-Xe*Xe)-.3*Math.exp(-$e*$e)},title:"The Hanging Meadow \xB7 182 million years ago",ride:"none",companion:"none",style:"none",camera:{fov:62,near:.3,far:400,lookAhead:8,sway:.15,bank:.5},pois:[{at:O,from:0,to:x.log0-.03,weight:.5},{at:(q,B)=>ce.set(fe(o.pointAt(fe(B,0,1),ce).x+8.5,-8.5,8.8),-2.6,-1),from:x.log0-.03,to:x.log1-.005,weight:.75},{at:(q,B)=>$.set(0,pe(-10,-17.2,Ae(.385,.44,B)),pe(-3.6,-6.2,Ae(.385,.44,B))),from:.25,to:x.helix1+.01,weight:.6},{at:(q,B)=>{const de=Ae(.338,.378,B);return Z.set(5.2,pe(-5,-13.5,de),pe(-13,-21,de))},from:.29,to:.385,weight:.9,fade:.25},{at:j,from:.885,to:.975,weight:.4},{at:(q,B)=>E.giantAt(B,ze),from:E.giant1U-.06,to:E.giant1U+.02,weight:.4},{at:(q,B)=>E.giantAt(B,ye),from:E.giantU-.07,to:E.giantU+.03,weight:.5},{at:s.viewpoints.underFoot,from:x.dive0-.1,to:x.dive0+.03,weight:.7}],portal:{shape:"circle",radius:5,color:"#ffab3a",glow:1.05,revealDistance:110,tilt:!0,style:"ring"},post:{exposure:1,bloom:{strength:.35,radius:.6,threshold:.92},grade:{saturation:1.1,contrast:1.05,tint:"#ffffff",shadowTint:"#06231c",vignette:.15,grain:.012}},update(q,B,de,se){de.getWorldPosition(C),se>0?(o.pointAt(se,N),o.tangentAt(se,f),g.setWake(N,f)):g.setWake(D,f),g.setLight({half:55+30*(1-Ae(.02,x.log0,se))+22*Ae(x.out,x.turn,se)*(1-Ae(x.dive0,x.dive0+.08,se))}),g.update(q,B,de);for(let je=0;je<E.updaters.length;je++)E.updaters[je](q,B,de,se,C)},dispose(){for(const q of E.disposers)q();g.dispose&&g.dispose()}}}};async function Rt(e){const{path:y,R:t,scene:r,ctx:M,hero:z,M:u}=e,w=et(),d=(g,s)=>{const a=[];let c=1;for(let b=g;b<=s;b+=1.6/y.length,c=-c){e.frameAt(b,w);const n=w.p.clone().addScaledVector(w.r,c*t.range(1.95,2.5)).add(m(0,t.range(0,1.2),0));n.u=b,a.push(n)}return a},P=[{x:8,z:-46,yaw:.12,len:15,n:70,depth:16,alt:1},{x:22.5,z:-34.5,yaw:0,len:18,n:104,depth:17.5,alt:1,gate:[u.east0-.05,u.east0+.04]},{x:22.5,z:-29.1,yaw:-.05,len:15,n:88,depth:17,alt:1,gate:[u.east0-.05,u.east0+.04]},{x:45.3,z:-20,yaw:-.1,len:13,n:70,depth:13,lanes:[-.1],alt:1,gate:[u.east1-.02,u.east1+.04]},{x:24,z:-2.2,yaw:.06,len:12,n:55,depth:14,gate:[u.dive0-.03,u.dive0+.06],ghost:1},{x:33,z:-13.6,yaw:-.08,len:11,n:44,depth:13.5,alt:1,ghost:1},{x:-3.5,z:19.5,yaw:-.25,len:9,n:42,depth:9.5},{x:-39,z:14,yaw:.5,len:12,n:50,depth:12},{x:-19.5,z:9.5,yaw:-1.147,len:12,n:52,depth:12.5,flip:1},{x:5.8,z:-13.2,yaw:.06,len:15,n:100,depth:18.5,lanes:[1.3],gate:[u.helix1+.012,u.out-.012]}],l=P.map(g=>({...g,check:!0,gates:g.gate?d(g.gate[0],g.gate[1]):[]}));l[l.length-1].gates.forEach(g=>{g.u>.512&&(g.skip=!0)});{const g=l[l.length-1],s=M.core.makeRng(90173+(M.seed|0)%1e5);for(let a=0;a<30;a++){const c=-2.4-6.8*Math.pow(s(),.8),b=m(g.x+s.range(-6.6,6.6),c,g.z+c*.364+s.range(-.9,.9));b.dress=!0,g.gates.push(b)}}const h=[[36,30],[-34,-34],[68,-22],[-18,-70],[72,-66],[8,-92],[-62,-12],[22,62],[-58,48],[40,-90],[-45,-62],[70,18],[-12,70],[34,-58],[64,-44]],p=Math.round(h.length*(e.detail<.8?.6:1));for(let g=0;g<p;g++){const s=h[g],a=s[0]+t.range(-4,4),c=s[1]+t.range(-4,4),b=t.range(10,16),n=t.range(-.6,.6),o=t.range(11,17);y.nearestXZ(a,c).dist<17||l.push({x:a,z:c,yaw:n,len:b,n:Math.round(26*fe(e.density,.8,1.2)),depth:o,check:!1,alt:g%3===1?1:0})}l.push({x:24,z:.9,yaw:.06,len:12,n:47,depth:14,check:!0,own:1,gates:[]},{x:32.5,z:-8.7,yaw:-.06,len:11,n:40,depth:13.5,alt:1,check:!0,own:1,gates:[]},{x:-35,z:-2,yaw:.1,len:14,n:30,depth:17,alt:1,check:!0,own:1,gates:[]});const V=await kt(M,z,l,(g,s,a)=>y.distanceTo(g,s,a));r.add(V.object),e.rafts=P}function Ht(e){const y=m(0,1,0);return(t,r)=>{e.posAtDist(t*e.length,r.p),e.tangentAtDist(t*e.length,r.t),r.r.crossVectors(r.t,y);const M=r.r.length();return M>1e-4?r.r.multiplyScalar(1/M):r.r.set(1,0,0),r.n.crossVectors(r.r,r.t).normalize(),r}}const et=()=>({p:m(0,0,0),t:m(0,0,-1),r:m(1,0,0),n:m(0,1,0)}),qt=[[0,.01,-.014,.01],[.035,.027,-.031,.021],[.075,.047,-.051,.036],[.115,.07,-.072,.055],[.15,.098,-.094,.08],[.18,.13,-.118,.11],[.21,.17,-.15,.146],[.26,.236,-.22,.2],[.33,.282,-.28,.236],[.4,.3,-.3,.246],[.48,.29,-.29,.234],[.56,.258,-.256,.204],[.64,.214,-.21,.164],[.72,.16,-.156,.12],[.79,.112,-.106,.082],[.85,.074,-.072,.052],[.9,.05,-.056,.034],[.935,.04,-.052,.022]];function dt(e,y){let t=0;for(;t<e.length-2&&e[t+1][0]<y;)t++;const r=e[Math.max(t-1,0)],M=e[t],z=e[t+1],u=e[Math.min(t+2,e.length-1)],w=fe((y-M[0])/(z[0]-M[0]),0,1),d=w*w,P=d*w,l=[y,0,0,0];for(let h=1;h<4;h++){const p=(z[h]-r[h])/(z[0]-r[0])*(z[0]-M[0]),V=(u[h]-M[h])/(u[0]-M[0])*(z[0]-M[0]);l[h]=(2*P-3*d+1)*M[h]+(P-2*d+w)*p+(-2*P+3*d)*z[h]+(P-d)*V}return l[3]=Math.max(l[3],.004),l}function wt(e={}){const t=e.jaw??1,r=e.rings??40,M=e.sides??20,z=qt.map(n=>[n[0]<.21?n[0]*pe(t,1,n[0]/.21):n[0],n[1],n[2],n[3]]),u=[],w=[],d=[],P=!!e.head,l=n=>3*(.5-n),h=(n,o,T,x,k,R)=>(u.push(n,o,T),w.push(x,k,R),u.length/3-1),p=[];for(let n=0;n<=r;n++){const o=P?n/r*.3:n/r,T=.935*(o<.3?o*(.22/.3):.22+(o-.3)*(.78/.7)),x=dt(z,T),k=(x[1]+x[2])*.5,R=(x[1]-x[2])*.5,I=[];for(let E=0;E<M;E++){const C=E/M*Math.PI*2,N=Math.cos(C),f=Math.sin(C),D=k+R*Math.sign(N)*Math.pow(Math.abs(N),N>0?1.12:1);I.push(h(x[3]*Math.sign(f)*Math.pow(Math.abs(f),1),D,l(T),0,R,0))}p.push(I)}const V=h(0,-.003,l(0)+.012,0,.007,0),g=h(0,-.006,l(P?.21:.94),0,.045,0);for(let n=0;n<r;n++)for(let o=0;o<M;o++){const T=(o+1)%M;d.push(p[n][o],p[n][T],p[n+1][T],p[n][o],p[n+1][T],p[n+1][o])}for(let n=0;n<M;n++){const o=(n+1)%M;d.push(V,p[0][o],p[0][n],g,p[r][n],p[r][o])}const s=(n,o,T,x,k,R,I,E,C=10)=>{const N=m(...T).normalize(),f=m(...x).normalize(),D=m(0,0,0).crossVectors(N,f).normalize(),$=[];for(let j=0;j<=C;j++){const O=j/C,be=Math.max(R(O),.002),Te=I(O),ce=[],ze=o[0]+N.x*k*O+f.x*Te,ye=o[1]+N.y*k*O+f.y*Te,Ne=o[2]+N.z*k*O+f.z*Te;for(let q=0;q<6;q++){const B=q/6*Math.PI*2,de=Math.cos(B)*be,se=Math.sin(B)*be*E*(.6+.4*Math.cos(B));ce.push(h(ze+f.x*de+D.x*se,ye+f.y*de+D.y*se,Ne+f.z*de+D.z*se,n,Math.cos(B),O))}$.push(ce)}for(let j=0;j<C;j++)for(let O=0;O<6;O++){const be=(O+1)%6;d.push($[j][O],$[j+1][be],$[j+1][O],$[j][O],$[j][be],$[j+1][be])}const Z=h(o[0]+N.x*k*1.03+f.x*I(1),o[1]+N.y*k*1.03+f.y*I(1),o[2]+N.z*k*1.03+f.z*I(1),n,.1,1);for(let j=0;j<6;j++)d.push($[C][j],$[C][(j+1)%6],Z)},a=l(.925);if(!P){s(1,[0,-.01,a+.02],[0,.93,-.36],[0,.36,.93],.37,o=>.105*Math.pow(1-o,.75)+.008,o=>-.16*o*o,.16,12),s(1,[0,-.02,a+.02],[0,-.9,-.44],[0,-.44,.9],.4,o=>.115*Math.pow(1-o,.7)+.008,o=>-.13*o*o,.2,12);const n=dt(z,.45);s(2,[0,n[1]-.03,l(.45)],[0,.9,-.42],[0,.42,.9],.34,o=>.17*(1-o)+.01,o=>-.12*o,.14);for(const o of[-1,1]){const T=dt(z,.275),x=dt(z,.6);s(3,[o*T[3]*.82,T[2]*.62,l(.275)],[o*.62,-.55,-.56],[o*.42,-.2,.88],.46,k=>.035+.1*Math.sin(Math.PI*Math.pow(k,.75))*(1-.35*k),k=>-.05*k,.16),s(3,[o*x[3]*.8,x[2]*.7,l(.6)],[o*.55,-.6,-.58],[o*.45,-.2,.87],.23,k=>.02+.055*Math.sin(Math.PI*Math.pow(k,.75))*(1-.35*k),k=>-.03*k,.16,6)}}const c=new S.BufferGeometry;c.setAttribute("position",new S.Float32BufferAttribute(u,3)),c.setAttribute("aInfo",new S.Float32BufferAttribute(w,3)),c.setIndex(d),c.computeVertexNormals();const b=.168*pe(t,1,.168/.21);return c.userData.eye=new S.Vector3(l(b),.034,.05),c.userData.hinge=l(.2*1),c}const ct=`
${ht}
${Tt}
vec3 litAnimal(vec3 alb, vec3 N, vec3 p, float gloss, float back){
  vec3 V = uCamL - p; V /= max(length(V), 1e-4);
  float nl = dot(N, uSunDir);
  float wr = clamp(nl*.62 + .38, 0., 1.); wr *= wr;                  // a soft terminator: round bodies turn slowly out of the light
  float dif = .7*wr + .3*(.5 + .5*N.y) + back*max(-nl, 0.);
  vec3 c = alb*(sunAt(p)*dif + ambAt(N, p.y));
  float f = 1. - max(dot(N, V), 0.); f = f*f*f;
  c += f*uWUp*.22*uAmbient;
  float f2 = 1. - max(dot(N, V), 0.); f2 *= f2; f2 *= f2;                     // (fifth polish) RIM LIGHT from the shafts: the edge of a body turned toward the sun catches gold
  c += f2*clamp(dot(N, uSunDir)*.75 + .45, 0., 1.)*sunAt(p)*vec3(.4, .4, .32)*(.35 + .65*uWarm);
  vec3 H = uSunDir + V; H /= max(length(H), 1e-4);
  float sp = max(dot(N, H), 0.); sp *= sp; sp *= sp; sp *= sp; sp *= sp;
  c += gloss*sp*sunAt(p)*.5;
  float sp2 = max(dot(N, H), 0.); sp2 *= sp2; sp2 *= sp2;             // the broad wet sheen under the tight glint
  c += gloss*sp2*sunAt(p)*.17;
  return waterFade(c, p);
}`,_t=`
attribute vec3 aInfo; attribute vec4 aSwim;                      // per instance: tail phase, amplitude, paddle trim, seed
varying vec3 vL, vN, vP, vInfo; varying float vSeed;
void main(){
  vec3 p = position, n = normal;
  float s = clamp(.5 - p.z/3., 0., 1.);
  float w = smoothstep(.17, 1., s); w = w*w*(1. + .5*s);
  float ph = aSwim.x - s*5.2;
  float k = aSwim.y*.33;
  p.x += k*w*sin(ph) - k*.07*sin(aSwim.x - 1.)*(1. - s);         // the wave grows toward the tail; the head barely answers
  float qb = s - .45; p.x -= (aSwim.z*1.5 + (fract(aSwim.w*5.3) - .5)*.55)*qb*qb;   // (sixth polish) the whole body arcs into a turn, and no two hold the same line
  float slope = k*(w*cos(ph)*5.2/3. );                              // d(offset)/dz, to turn the normals with the body
  n = vec3(n.x - slope*n.z*.8, n.y, n.z + slope*n.x*.8); n /= max(length(n), 1e-4);
  if (aInfo.x > 2.5) { float t = aInfo.z*aInfo.z; p.y += t*(.05*sin(aSwim.x*.35 + aSwim.w*6.) + aSwim.z*.12); }
  vL = position; vInfo = aInfo; vSeed = aSwim.w;
  #ifdef USE_INSTANCING
  mat4 m = modelMatrix*instanceMatrix;
  #else
  mat4 m = modelMatrix;
  #endif
  vec4 wp = m*vec4(p, 1.);
  vP = wp.xyz; vN = mat3(m)*n;
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,jt=`
${ct}
uniform vec3 uTop, uBelly, uEye; uniform float uHinge, uPat;
varying vec3 vL, vN, vP, vInfo; varying float vSeed;
float ih(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
float ivn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(ih(i), ih(i + vec2(1., 0.)), f.x), mix(ih(i + vec2(0., 1.)), ih(i + vec2(1., 1.)), f.x), f.y); }
void main(){
  vec3 N = vN/max(length(vN), 1e-4); if (!gl_FrontFacing) N = -N;
  float dist = distance(vP, uCamL), fin = step(.5, vInfo.x), nearK = 1. - smoothstep(7., 20., dist);
  vec3 alb; float gloss = .22 + .3*nearK, shade = 1.;
  if (fin < .5) {
    float hd = max(vInfo.y, .01);
    // the wavy line between back and belly: long scallops, then finer ones; on the head it runs into the mouth line
    float wav = sin(vL.z*2.7 + vSeed*6.3)*.6 + sin(vL.z*6.3 + 1.3 + vSeed*11.)*.3 + (ivn(vec2(vL.z*5., vSeed*9.)) - .5)*.5;
    float f = clamp((vL.z - uHinge)/max(1.5 - uHinge, .01), 0., 1.);
    float mouthY = mix(-.052, -.006, f);
    float lineY = mix(-.16*hd + .42*hd*wav, mouthY, smoothstep(uHinge - .35, uHinge + .02, vL.z));
    float kTop = smoothstep(lineY - .012, lineY + .02, vL.y);
    float up = clamp((vL.y - lineY)/max(hd*1.2, .02), 0., 1.);       // 0 at the line, 1 on the spine
    // broad saddles down from the spine (dark on mid slate), a paler flank, then fine speckle
    float pS = 1. + .35*(uPat - 1.);
    float sn = ivn(vec2(vL.z*1.9*pS + vSeed*17., vSeed*3.));
    // (sixth polish) skin at two scales that READS at 10 m: a dark cape over the spine with a scalloped lower edge, a
    // paler slate flank, and on it a row of dark blotches thinning toward the belly line (colours are licence)
    float headK = smoothstep(uHinge - .3, uHinge + .05, vL.z);
    float cape = smoothstep(.36, .6, up + .15*sin(vL.z*7.5*pS + vSeed*20.) + .22*(sn - .5));
    vec3 top = mix(uTop*mix(1.95, 1.3, headK), uTop*.8, cape);
    vec2 bq = vec2(vL.z*3.3*uPat + vSeed*13., up*2.7 + .4*sn), bi = floor(bq), bf = fract(bq) - .5;
    bf += (vec2(ih(bi + 3.1), ih(bi + 9.7)) - .5)*.42;
    float bl = smoothstep(.36, .2, length(bf*vec2(1., 1.25)))*step(.3, ih(bi + vSeed*7.))*(1. - cape)*(1. - headK);
    top = mix(top, uTop*.5, bl*.8);
    float spk = ivn(vL.zy*vec2(46., 60.)*uPat + vL.x*31.)*ivn(vL.zy*vec2(19., 27.)*uPat + 7.);
    top *= 1. + nearK*(.32*smoothstep(.36, .62, spk) - .07);              // pale flecks, only just visible
    float under = smoothstep(.2, 1., -vL.y/hd);                         // 0 on the flank, 1 along the keel of the belly
    vec3 bel = mix(uBelly*(.9 + .1*ivn(vL.zx*30.)), uBelly*vec3(.6, .74, .7), under*.7);   // cream only on the flank: grey-green shadow below
    alb = mix(bel, top, kTop);
    shade = mix(.44, 1., smoothstep(-.7, .5, N.y));                    // the belly falls into its own shadow underneath
    if (abs(vL.x) > .012) {                                           // the huge eye: black disc in a pale ring of bony plates
      vec2 e = vec2(vL.z - uEye.x, vL.y - uEye.y); float de = length(e), r = uEye.z;
      float ang = (abs(e.x) + abs(e.y) > 1e-5) ? atan(e.y, e.x) : 0.;
      alb *= mix(1., .5, smoothstep(r*2.7, r*1.6, de));                 // a dark mask round the eye, so the pale ring reads from far off
      vec3 ringC = mix(alb, vec3(.66, .62, .45), uPat > 1.5 ? .34 : .74)*(.84 + .16*step(.5, fract(ang*2.228)));   // fourteen plates of pale bone: the huge ringed eye is this animal's face
      alb = mix(alb, ringC, smoothstep(r*1.5, r*1.3, de));
      alb = mix(alb, vec3(.004, .006, .008), smoothstep(r*1.06, r*.96, de));
      float hl = smoothstep(r*.22, r*.1, length(e - vec2(.3, .38)*r));
      alb += vec3(.5)*hl; gloss += 1.2*smoothstep(r*1.1, r*.9, de);
      float ml = 1. - smoothstep(.006, .013, abs(vL.y - mouthY));       // the mouth line, back to under the eye
      alb *= 1. - .78*ml*smoothstep(uHinge - .16, uHinge - .06, vL.z);
      if (de > r*1.5) alb = mix(alb, alb*vec3(.8, .62, .6) + vec3(.012, .004, .004), .5*smoothstep(uHinge, uHinge + .3, vL.z)*(1. - kTop));   // the lower jaw a warmer cream
    }
  } else {
    // fins: darker leading edge, pale trailing edge, and the rows of finger bones showing through the paddle skin
    float ch = vInfo.y, t = vInfo.z;
    vec3 base = uTop*(1.25 + .35*t);
    base *= mix(1.25, .45, smoothstep(-.2, .95, ch));
    if (vInfo.x > 2.5) { float bones = smoothstep(.1, .7, sin(t*34. - ch*2.)*sin(ch*8.5 + 1.2)); base *= 1. + .3*bones*nearK*(1. - .5*t); }
    else base *= .85 + .3*sin(ch*9. + t*5.);
    alb = base + uBelly*.04*smoothstep(-.5, -1., ch);
  }
  vec3 c = litAnimal(alb*shade, N, vP, gloss, 0.);
  // the slow net of light crawling over the back, bright enough to read on dark skin
  float T = exp2(-dist/max(uHalf, 1.));
  c += vec3(.62, .74, .6)*caust(vP)*logShade(vP)*uSun*smoothstep(.1, .75, N.y)*.22*T*(1. - .5*fin);
  gl_FragColor = vec4(c, 1.);
}`;function bt(e,y,t,r,M=1){return new S.ShaderMaterial({uniforms:{...e.U,uTop:{value:Ee(y)},uBelly:{value:Ee(t)},uEye:{value:r.userData.eye},uHinge:{value:r.userData.hinge},uPat:{value:M}},vertexShader:_t,fragmentShader:jt,side:S.DoubleSide})}function Ot(e){const{path:y,M:t,R:r,scene:M}=e,z=Ae,u=wt(),w=5+Math.floor(r()*4.999),d=r.chance(.45),P=w+(d?1:0),l=2,h=new S.InstancedMesh(u,bt(e,"#43595F","#EFE8D6",u),P+l);h.frustumCulled=!1,h.name="pod";const p=new Float32Array((P+l)*4),V=new S.InstancedBufferAttribute(p,4);V.setUsage(S.DynamicDrawUsage),u.setAttribute("aSwim",V),h.instanceMatrix.setUsage(S.DynamicDrawUsage);const g=pe(t.log0,t.log1,.78),s=[{E:[5.6,-2.3,-1.3],L:[8,.4,-.5],H:[9,.3,-.3],T:[6.5,-5.6,-2.2],D:[13,0,-.3],roll:-1,size:1},{E:[5,2.5,-1.1],L:[7.5,2.2,.1],H:[14.5,.2,.4],T:[4.5,6.2,-1.6],D:[5.5,3.6,-1.3],roll:pe(t.log0,g,.25),rollTo:pe(t.log0,g,.8),size:1.04}];for(let i=2;i<w;i++){const v=i%2?1:-1;s.push({E:[r.range(9,24),v*r.range(4,10),r.range(-3,1.5)],L:[r.range(0,14),r.range(4.5,10),r.range(-2.5,1.2)],H:[r.range(-1,13),r.range(6.3,8.6),r.range(-2.5,2.5)],T:v>0?[r.range(5,10),r.range(4.5,8),r.range(-3.8,-2.7)]:[r.range(2,10),-r.range(4.5,9),r.range(-3.6,-1.2)],D:[r.range(3.5,11),v*r.range(3.2,6),r.range(-3,-.7)],roll:r.range(.05,.9),size:r.range(.9,1.1)})}if(d){const i=s[2+Math.floor(r()*(w-2))]||s[1],v=L=>[L[0]-.5,L[1]+(L[1]>0?.55:-.55),L[2]-.35];s.push({E:v(i.E),L:v(i.L),H:v(i.H),T:v(i.T),D:v(i.D),roll:-1,size:.27,par:i,dOf:v})}s[0].O=[9.5,-5.2,-2.2],s[1].O=[12.5,6.4,-2.8],s[1].T=[9,4.4,-2.4],s[0].H=[6.2,.9,-1.9],s[1].H=[10.5,-.7,-3.1],s[2].H=[7,1.5,-1.2];const a=.337;for(const i of s)i.T[1]>2.5&&(i.T=[i.T[0],-(i.T[1]+1.5),i.T[2]]),i.T[1]<-7.5&&(i.T=[i.T[0]+2,-7.5,i.T[2]]);const c=[[10.5,-5,-1.8],[15,5,-1],[9.5,-6.4,-.4],[16,-3.4,-4.6],[15,-8.8,-3.6],[10,3.6,-2.8],[13.5,-6.2,-.2]],b=[[5.7,-4.1,-1.1],[8.2,7.4,.6],[14.1,5.1,2.1],[11.9,-5.3,-3.4],[8.4,-7.1,1.3],[15.1,9.8,-1.6],[16,-8.2,0]];s.forEach((i,v)=>{v>=2&&!i.par&&(i.T=c[(v-2)%7],i.D=b[(v-2)%7],i.roll<.5&&(i.roll=.5+i.roll*.8),i.L=[Math.max(i.L[0],9),i.L[1],-.5-.4*Math.abs(i.L[2])])}),s[0].E=[8.5,-2.6,-1.7],s[0].L=[13,-.6,-1.8],s[1].L=[9,1.6,-.9],s.forEach(i=>{i.par&&(i.T=i.dOf(i.par.T),i.D=i.dOf(i.par.D))}),s[1].D=[5.6,3.3,-1.7],s[0].D=[16,-3.8,-.8],s.forEach((i,v)=>{i.free=v>=2,i.kf=1.15+.6*(v*.618%1),i.O||(i.O=i.T),i.seed=r(),i.rate=r.range(1.8,2.3)*(i.size<.5?1.8:1),i.rollTo===void 0&&(i.rollTo=i.roll+.05),p[v*4+3]=i.seed,p[v*4+1]=1}),s.forEach((i,v)=>{i.sgE=[],i.sgT=[];for(let L=0;L<v;L++)i.sgE.push(-1),i.sgT.push(i.T[2]>=s[L].T[2]?1:-1)});const n=et(),o=[0,0,0],T=(i,v)=>{const L=z(t.log0-.07,t.log0,v),F=z(t.log1-.01,t.helix0+.015,v),X=z(t.helix1-.01,t.helix1+.03,v),J=z(t.dive0-.03,t.dive0+.05,v),le=z(t.turn-.05,t.turn-.005,v),Ce=1-L,we=L*(1-F),Me=F*(1-X),Be=X*(1-J)*(1-le),Se=X*(1-J)*le,_=J;for(let U=0;U<3;U++)o[U]=Ce*i.E[U]+we*i.L[U]+Me*i.H[U]+Be*i.O[U]+Se*i.T[U]+_*i.D[U];const he=pe(Math.abs(o[1])*i.kf+2+5*(i.kf-1.15),(Math.abs(o[1])*(1.02+.12*(i.kf-1.15))+1.5)*(1-.3*J),X);return i.free&&o[0]<he&&(o[0]=he),o},x=(i,v,L,F)=>{if(T(i,L),v===1){const X=(L-g)/.022;o[2]+=Math.exp(-X*X)*(3.15-i.L[2])}if(v===0&&(o[0]+=3*z(.9,1,L)),e.frameAt(L+o[0]/y.length,n),F.copy(n.p).addScaledVector(n.r,o[1]).addScaledVector(E,o[2]),v===2){const X=(L-a)/.034;F.y=pe(F.y,-.36,Math.exp(-X*X))}return F},k=m(1,0,0),R=m(0,1,0),I=m(0,0,-1),E=m(0,1,0),C=m(0,0,0),N=m(0,0,0),f=m(0,0,0),D=m(0,0,1),$=m(0,0,1),Z=m(1,0,0),j=m(0,1,0),O=new S.Matrix4,be=m(1,1,1);let Te=1,ce=.6;const ze=(i,v,L)=>{if(v<.01)return;C.subVectors(f,L);const F=C.dot(I),X=v*z(-4,1,F);if(X<.001)return;const J=Math.max(F,5.5),le=C.dot(k),Ce=C.dot(R),we=Math.max(J*Te*.84-1.8*i.size,.8),Me=Math.max(J*ce*.8-1.4*i.size,.5);f.addScaledVector(k,(fe(le,-we,we)-le)*X).addScaledVector(R,(fe(Ce,-Me,Me)-Ce)*X).addScaledVector(I,(J-F)*X)};e.pod={mates:s,positions:s.map(()=>m(0,0,0)),uBreath:g,mesh:h};let ye=-99,Ne=0;const q=6,B=10,de=2,se=1.2,je=.5,tt=.25,Xe=.05,$e=4*y.length/40,ut=.8,rt=1,at=s.map(()=>m(0,0,0)),A=m(0,0,0),te=s.map(()=>({p:m(0,0,0),f:m(0,0,1),s:m(0,0,0),bank:0})),ne=s.map((i,v)=>s.slice(0,v).map(()=>({on:0,side:1,way:0,sx:1,shut:0})));let ue=!0,ie=!1,Y=!1,W=0,G=0;const K=[];let re=0;{const i=new S.Matrix4,v=new S.Matrix4,L=m(0,0,0),F=(le,Ce)=>{const we=Ce?Ce.clone():new S.Matrix4;for(let ae=le;ae;ae=ae.parent)we.premultiply(i.compose(ae.position,ae.quaternion,ae.scale));const Me=le.geometry.getAttribute("position"),Be=new Map;let Se=1/0,_=-1/0;for(let ae=0;ae<Me.count;ae++){const ke=Me.getX(ae);ke<Se&&(Se=ke),ke>_&&(_=ke)}const he=m(Se,0,0).applyMatrix4(we),U=m(_,0,0).applyMatrix4(we).sub(he),H=U.length();if(H<.5||he.y>50)return;U.multiplyScalar(1/H);for(let ae=0;ae<Me.count;ae++){L.fromBufferAttribute(Me,ae).applyMatrix4(we);const ke=Math.round(L.x*2)+","+Math.round(L.y*2)+","+Math.round(L.z*2),Fe=Be.get(ke);Fe?(Fe[0]+=L.x,Fe[1]+=L.y,Fe[2]+=L.z,Fe[3]++):Be.set(ke,[L.x,L.y,L.z,1])}const Pe=new Float32Array(Be.size*3);let Le=0,Re=0;for(const ae of Be.values()){const ke=ae[0]/ae[3],Fe=ae[1]/ae[3],Ke=ae[2]/ae[3];Pe[Le++]=ke,Pe[Le++]=Fe,Pe[Le++]=Ke,L.set(ke,Fe,Ke).sub(he),L.addScaledVector(U,-fe(L.dot(U),0,H)),Re=Math.max(Re,L.length()),Fe<re&&(re=Fe)}K.push({a:he,u:U,len:H,far:Re,pts:Pe})},X=e.hero.object.getObjectByName("log"),J=M.getObjectByName("raft-logs");if(X&&F(X,null),J)for(let le=0;le<J.count;le++)J.getMatrixAt(le,v),F(J,v)}const Q=(i,v,L,F)=>{const X=fe(C.subVectors(F,f).dot(L),-v,v);C.copy(f).addScaledVector(L,X).sub(F);const J=C.length();J<i&&J>.001&&f.addScaledVector(C,(i-J)/J)};e.updaters.push((i,v,L,F,X)=>{const le=L.matrixWorld.elements;ce=Math.tan((L.fov||62)*Math.PI/360),Te=ce*(L.aspect||1.78),k.set(le[0],le[1],le[2]).normalize(),R.set(le[4],le[5],le[6]).normalize(),I.set(-le[8],-le[9],-le[10]).normalize();const Ce=e.ctx.flight,we=Ce&&Ce.rate>=0?Ce.rate:1,Me=ue||Y||Math.abs(v-W-i)>Xe||(i>0?F<G||(F-G)*y.length>$e*we*i:ie);ue=!1,Y=i===0&&ie,ie=Me,W=v,G=F;for(let U=0;U<P;U++){const H=s[U];x(H,U,F-.004,C),x(H,U,F+.004,N),x(H,U,F,f),A.copy(f),D.subVectors(N,C);const Pe=D.length();Pe>1e-5?D.multiplyScalar(1/Pe):D.set(0,0,1),x(H,U,F+3*.004,C),$.subVectors(C,N).normalize(),e.frameAt(F+T(H,F)[0]/y.length,n),D.addScaledVector(n.t,.9).normalize(),D.y=fe(D.y,-.4,.5);const Le=fe((D.x*$.z-D.z*$.x)*6,-.6,.6);let Re=0;{const ge=z(t.dive0-.03,t.dive0+.05,F),ve=z(t.helix1-.05,t.helix1-.005,F)*(1-ge),Ve=z(t.log0-.07,t.log0,F);D.addScaledVector(n.r,-(.46*ge+.45*ve+.4*(1-Ve)+(H.free?.55:.25)*Ve*(1-z(t.log1-.01,t.helix0+.015,F)))*fe(o[1]/1.5,-1,1)).normalize(),Re=o[1]}const ae=U*2.1+H.seed*9;f.x+=.35*Math.sin(v*.5+ae),f.y+=.22*Math.sin(v*.37+ae*1.3),f.z+=.35*Math.sin(v*.43+ae*.7),f.addScaledVector(D,.5*Math.sin(v*.23+ae*1.7)),f.y>-.32&&(f.y=-.32);const ke=Math.max(4*z(t.helix1-.03,t.helix1+.01,F)+2.2*z(t.helix1+.01,t.helix1+.05,F),H.free?5.5*(1-z(t.log1-.03,t.log1,F)):0),Fe=()=>{if(ke>.01){C.subVectors(f,X);const ge=C.length();ge<ke&&ge>.001&&f.addScaledVector(C,(ke-ge)/ge)}};Fe();const Ke=Math.max(1-(H.free?z(t.log1-.03,t.log1,F):z(t.log0-.07,t.log0-.03,F)),z(t.helix1+.005,t.helix1+.04,F)),ot=1-z(t.helix0-.02,t.helix0+.02,F)*(1-z(t.helix1+.005,t.helix1+.04,F)),Mt=F<t.helix0+.1;if(ze(H,Ke,X),e.giantOn>.01){C.subVectors(f,e.giantPos);const ge=fe(C.dot(e.giantDir),-5.5,5.5);C.addScaledVector(e.giantDir,-ge),C.addScaledVector(I,-.6*C.dot(I));const ve=C.length();ve<3.8&&(ve>.001?f.addScaledVector(C,(3.8-ve)/ve*e.giantOn):f.y+=3.8*e.giantOn)}for(let ge=Me?0:-1;ge<3;ge++){for(let ve=0;ve<U;ve++){const Ve=at[ve],Ye=H.size<.5?1.1:3.4,oe=ne[U][ve];C.subVectors(f,Ve);const De=C.length();if(Me&&ge===0&&(oe.on=0,oe.way=0,oe.shut=0),ge>=0&&De<Ye&&(De>.001?f.addScaledVector(C,(Ye-De)/De):f.y-=Ye),ot<.01||H.par||s[ve].par){oe.on=0;continue}N.subVectors(f,X),C.subVectors(Ve,X);const qe=N.dot(I),We=C.dot(I);if(qe<2||We<2){ge<0&&(oe.shut+=i)>=1&&(oe.on=0);continue}const He=qe/We,Qe=.5*(1+fe(He,.6,3)),nt=N.dot(k),st=N.dot(R),Je=nt-C.dot(k)*He,it=st-C.dot(R)*He,Ze=3.3*Qe,Oe=Math.abs(Je)/Ze;if(ge<0){oe.shut=0,Oe>=1+tt&&(oe.on=0);continue}if(Oe>=1)continue;const Ge=1.25*Qe*Math.sqrt(1-Oe*Oe),Ie=(Mt?H.sgE:H.sgT)[ve],lt=Math.max(qe*ce*.8-1.4*H.size,.5);if(Me){const xe=Ie*it;if(oe.on=1,oe.side=xe>=0?Ie:-Ie,xe>=Ge)continue;const me=(Ge-xe)*z(-1.6*Ge,-.9*Ge,xe);if(Ke<.5||Math.abs(st+Ie*me)<=lt)f.addScaledVector(R,Ie*me*ot),oe.side=xe+me*ot>=0?Ie:-Ie;else{const Ue=Math.max(qe*Te*.84-1.8*H.size,.8),_e=Je>=0?1:-1,xt=(1-Oe)*Ze,yt=Math.abs(nt+_e*xt)<=Ue;f.addScaledVector(k,(yt?_e*xt:-_e*(1+Oe)*Ze)*ot),oe.way=1,oe.sx=yt?_e:-_e}continue}if(oe.on||(oe.on=1,oe.way=0,oe.shut=0,oe.side=Ie*it>=0?Ie:-Ie),oe.way===0){const xe=oe.side*it;if(xe>=Ge)continue;if(Ke<.5||Math.abs(st+oe.side*(Ge-xe))<=lt){f.addScaledVector(R,oe.side*(Ge-xe)*ot);continue}const me=Math.max(qe*Te*.84-1.8*H.size,.8),Ue=Je>=0?1:-1;oe.way=1,oe.sx=Math.abs(nt+Ue*(1-Oe)*Ze)<=me?Ue:-Ue}f.addScaledVector(k,oe.sx*(Ze-oe.sx*Je)*ot)}ge>=0&&Ke>.01&&ze(H,Ke,X)}!Me&&f.y>-.32&&(f.y=-.32),Fe();const pt=Math.max(Ke,z(t.helix1-.04,t.helix1-.005,F));if(pt>.01){C.subVectors(f,X);const ge=fe(-C.dot(R)/Math.max(C.length(),.001)*3.2,0,1),ve=.57+.25*ge;C.y=0;const Ve=C.length(),Ye=-fe(Re/1.5,-1,1),oe=Math.abs(Ye);if(Ve>.001&&oe>.001){const De=-C.z/Ve,qe=C.x/Ve,We=Ye>0?1:-1,He=We*(D.x*De+D.z*qe);if(He<ve&&He>-ve){const Qe=(pe(-ve,ve,z(-ve,-.3,He))-He)*We*oe*pt;D.x+=De*Qe,D.z+=qe*Qe,D.normalize()}}}const ee=te[U];if(at[U].copy(f),Me)ee.p.copy(f),ee.f.copy(D),ee.bank=Le;else if(i>0){N.subVectors(f,ee.p);const ge=N.length();Z.copy(ee.p);const ve=A.distanceTo(ee.s)+Math.min(q+ge,B)*we*i;ge<=ve?ee.p.copy(f):ee.p.addScaledVector(N,ve/ge),f.copy(ee.p);for(let xe=0;xe<U;xe++){const me=H.size<.5?1.1:3.4;C.subVectors(f,e.pod.positions[xe]);const Ue=C.length();Ue<me&&(Ue>.001?f.addScaledVector(C,(me-Ue)/Ue):f.y-=me)}f.y>-.32&&(f.y=-.32);const Ve=1.5*H.size;if(f.y>re-rt-Ve)for(let xe=0;xe<K.length;xe++){const me=K[xe];if(C.subVectors(f,me.a),C.addScaledVector(me.u,-fe(C.dot(me.u),0,me.len)),C.length()>me.far+rt+Ve)continue;const Ue=me.pts;for(let _e=0;_e<Ue.length;_e+=3)Q(rt,Ve,ee.f,j.set(Ue[_e],Ue[_e+1],Ue[_e+2]))}if(e.giantOn>.01){const xe=e.giantOn*3;for(let me=-3;me<=3;me++)Q(ut*(1+xe),Ve,ee.f,j.copy(e.giantPos).addScaledVector(e.giantDir,.5*me*xe))}N.subVectors(f,Z);const Ye=N.length(),oe=ve+B*we*i;if(Ye>oe&&f.copy(Z).addScaledVector(N,oe/Ye),f.y>-.32&&(f.y=-.32),ke>.01)for(let xe=0;xe<4;xe++){Fe();for(let me=-1;me<=1;me+=2)j.copy(f),N.copy(f).addScaledVector(ee.f,me*Ve),f.copy(N),Fe(),f.sub(N).add(j);if(f.y>-.32)f.y=-.32;else break}ee.p.copy(f),N.subVectors(f,Z).sub(A).add(ee.s);const De=je/Math.max(ve,N.length(),1e-9),qe=Math.max(Math.hypot(D.x,D.z),1e-6),We=D.x/qe+N.x*De,He=D.z/qe+N.z*De,Qe=fe((D.y+N.y*De)/Math.max(Math.hypot(D.x+N.x*De,D.y+N.y*De,D.z+N.z*De),1e-6),-.4,.5),nt=Math.atan2(We*ee.f.z-He*ee.f.x,We*ee.f.x+He*ee.f.z),st=Math.asin(fe(ee.f.y,-1,1)),Je=Math.asin(Qe)-st,it=Math.hypot(nt,Je),Ze=de*we*i,Oe=it>Ze?Ze/it:1,Ge=ee.f.x*ee.f.x+ee.f.z*ee.f.z>1e-12?Math.atan2(ee.f.x,ee.f.z)+nt*Oe:Math.atan2(We,He),Ie=st+Je*Oe,lt=Math.cos(Ie);ee.f.set(Math.sin(Ge)*lt,Math.sin(Ie),Math.cos(Ge)*lt),ee.bank+=fe(Le-ee.bank,-se*we*i,se*we*i)}f.copy(ee.p),D.copy(ee.f),ee.s.copy(A);const vt=(H.roll>=0?U===1?Math.PI*2*z(H.roll,H.rollTo,F):.3*Math.sin(Math.PI*z(H.roll,H.rollTo+.03,F)):0)+ee.bank;Z.crossVectors(E,D),Z.lengthSq()<1e-6&&Z.set(1,0,0),Z.normalize(),j.crossVectors(D,Z);const mt=Math.cos(vt),gt=Math.sin(vt);C.copy(Z).multiplyScalar(mt).addScaledVector(j,gt),N.copy(j).multiplyScalar(mt).addScaledVector(Z,-gt);const zt=F+(T(H,F)[0]+(U===0?3*z(.9,1,F):0))/y.length>1.004?.001:1;O.makeBasis(C,N,D),be.setScalar(H.size*zt),O.scale(be),O.setPosition(f),h.setMatrixAt(U,O),e.pod.positions[U].copy(f),p[U*4]=v*6.2832*H.rate+F*y.length*.75+H.seed*20,p[U*4+2]=ee.bank}const Be=e.giantDir,Se=e.giantPos;Z.crossVectors(E,Be).normalize(),j.crossVectors(Be,Z);for(let U=0;U<l;U++){const H=P+U,Pe=U?-1:e.giantFar||1,Le=v*.6+U*2.4;f.copy(Se).addScaledVector(Be,(U?-4.4:4.8)+.4*Math.sin(Le)).addScaledVector(j,(U?2.3:3.4)+.25*Math.sin(Le*1.3)).addScaledVector(Z,Pe*((U?3.6:3.1)+.3*Math.cos(Le)));const Re=Pe*.25+.12*Math.sin(Le*.8),ae=Math.cos(Re),ke=Math.sin(Re);C.copy(Z).multiplyScalar(ae).addScaledVector(j,ke),N.copy(j).multiplyScalar(ae).addScaledVector(Z,-ke),O.makeBasis(C,N,Be),be.setScalar(Math.max((U?.94:1.03)*e.giantOn,.001)),O.scale(be),O.setPosition(f),h.setMatrixAt(H,O),p[H*4]=v*6.2832*1.5+U*2.2,p[H*4+1]=.9,p[H*4+2]=.1*Math.sin(Le),p[H*4+3]=.23+.5*U}h.instanceMatrix.needsUpdate=!0,V.needsUpdate=!0,F>=g&&Ne<g&&(ye=v,e.breathMate=1),F<g&&(ye=-99),F>=a&&Ne<a&&(ye=v,e.breathMate=2),Ne=F;const _=e.ceilU.uDimple.value,he=e.pod.positions[e.breathMate||1];ye>-90&&v-ye<9?(v-ye<.1&&(_.x=he.x,_.y=he.z),_.z=v-ye,_.w=1):(_.z=99,_.w=0),e.breathAge=ye>-90?v-ye:99}),M.add(h)}function Gt(e){const{path:y,M:t,scene:r}=e,M=wt({jaw:1.45});M.userData.eye.z*=.62;const z=new Float32Array([0,.8,0,.61]),u=new S.InstancedBufferAttribute(z,4);u.setUsage(S.DynamicDrawUsage),M.setAttribute("aSwim",u);const w=new S.InstancedMesh(M,bt(e,"#2A4A4C","#93AD9F",M,2.6),1);w.frustumCulled=!1,w.name="giant",r.add(w);const d=et(),P=(n,o,T,x,k,R)=>(e.frameAt(n,d),{uc:n,sp:.6,base:d.p.clone().addScaledVector(d.t,o).add(m(0,-T,0)).addScaledVector(d.r,x),dir:d.t.clone().multiplyScalar(k).addScaledVector(d.r,R).setY(.02).normalize()}),l=P(t.helix1+.05,13,4.4,-1,.3,.95),h=P(t.east1-.04,13,3.2,5,0,-1),p=(l.uc+h.uc)/2;h.sp=.7;for(const n of[l,h]){const o=y.pointAt(n.uc),T=m(0,1,0).cross(n.dir).normalize();n.far=n.base.clone().sub(o).dot(T)>=0?1:-1}e.giant1U=l.uc,e.giantU=h.uc,e.giantDir=l.dir.clone(),e.giantPos=m(0,-99,0),e.giantOn=0,e.giantAt=(n,o)=>{const T=n<p?l:h;return o.copy(T.base).addScaledVector(T.dir,(n-T.uc)*y.length*T.sp)};const V=m(0,0,0),g=m(1,0,0),s=m(0,1,0),a=new S.Matrix4,c=m(3,3,3),b=m(0,1,0);e.updaters.push((n,o,T,x)=>{const k=x<p?l:h,R=k.dir;e.giantAt(x,V),V.y+=.4*Math.sin(o*.4);const I=x<p?Ae(l.uc-.085,l.uc-.05,x)*(1-Ae(l.uc+.05,l.uc+.085,x)):Ae(h.uc-.12,h.uc-.085,x)*(1-Ae(h.uc+.07,h.uc+.11,x));e.giantOn=I,e.giantPos.copy(V),e.giantDir.copy(R),e.giantFar=k.far,g.crossVectors(b,R).normalize(),s.crossVectors(R,g),c.setScalar(Math.max(3*I,.001)),a.makeBasis(g,s,R),a.scale(c),a.setPosition(V),w.setMatrixAt(0,a),w.instanceMatrix.needsUpdate=!0,z[0]=o*Math.PI+x*40,u.needsUpdate=!0})}function Kt(){const e=[],y=[],t=[],r=(l,h,p,V,g,s)=>(e.push(l,h,p),y.push(V,g,s),e.length/3-1),z=(l,h,p,V)=>{const g=[];for(let s=0;s<6;s++){const a=s/6*6.2832;g.push(r(Math.cos(a)*h,Math.sin(a)*h*.85,l,p,0,V&&(s===0||s===3)?1:0))}return g},u=r(0,0,.15,.75,0,0),w=z(.03,.03,1,0),d=z(-.065,.027,1,1);for(let l=0;l<6;l++){const h=(l+1)%6;t.push(u,w[h],w[l],w[l],w[h],d[h],w[l],d[h],d[l])}for(let l=0;l<5;l++){const h=l/5*6.2832+.3,p=h+.75,V=r(Math.cos(h)*.022,Math.sin(h)*.02,-.065,.9,1,0),g=r(Math.cos(p)*.022,Math.sin(p)*.02,-.065,.9,1,0),s=r(Math.cos(h+.37)*.007,Math.sin(h+.37)*.007,-.15,1.25,1,0);t.push(V,g,s)}for(const l of[-1,1]){const h=r(l*.02,0,.09,1.1,0,0),p=r(l*.02,0,.035,1.1,0,0),V=r(l*.062,0,.05,1.3,0,0);t.push(h,p,V)}const P=new S.BufferGeometry;return P.setAttribute("position",new S.Float32BufferAttribute(e,3)),P.setAttribute("color",new S.Float32BufferAttribute(y,3)),P.setIndex(t),P.computeVertexNormals(),P}const Yt=`
uniform float uTime; uniform vec3 uCamL, uWakePos, uWakeDir, uShoalC, uShoalAx; uniform float uShoalYaw, uShoalK, uShoalRing;
attribute vec3 color; attribute vec4 aFish;                         // loop angle, ring fraction, height fraction, seed
varying vec3 vP, vN, vC; varying float vSeed;
vec3 shoalAt(float a){
  float rr = mix(.3 + .7*aFish.y, .8 + .2*aFish.y, uShoalRing);     // a cloud, or (re-formed) a ribbon winding in a ring
  vec3 q = vec3(cos(a)*rr*uShoalAx.x, (aFish.z*.75 + .25*sin(2.*a + aFish.w*6.28))*uShoalAx.y*(1.15 - .4*rr), sin(a)*rr*uShoalAx.z);
  q.x += .7*sin(a*3. + aFish.w*20.); q.z += .6*cos(a*2. + aFish.w*31.); q.y += .3*sin(a*5. + aFish.w*11.);
  float cy = cos(uShoalYaw), sy = sin(uShoalYaw);
  return uShoalC + vec3(q.x*cy + q.z*sy, q.y, -q.x*sy + q.z*cy);
}
void main(){
  float a = aFish.x + uTime*.11 + .25*sin(uTime*.21 + aFish.x);      // the whole shoal turns as one
  vec3 c = shoalAt(a), T = shoalAt(a + .03) - c; T /= max(length(T), 1e-4);
  c += T*.06*sin(uTime*6.3 + aFish.w*40.);                          // each jet a small surge
  vec3 d = c - uCamL; float l = max(length(d), 1e-3);                // nobody nearer than a metre and a half
  c += d/l*1.8*(1. - smoothstep(.3, 4.5, l));
  vec3 w = c - uWakePos; float al = dot(w, uWakeDir);                // and a tunnel opens ahead of us
  vec3 rad = w - uWakeDir*al; float rl = max(length(rad), 1e-3);
  float open = (1. - smoothstep(.4, 3.2, rl))*smoothstep(-3., 1., al)*(1. - smoothstep(6., 16., al));
  c += rad/rl*1.9*open; T = T + rad/rl*open*1.2; T /= max(length(T), 1e-4);
  vec3 X = cross(vec3(0., 1., 0.), T); X /= max(length(X), 1e-4); vec3 Y = cross(T, X);
  float sc = .85 + .35*fract(aFish.w*7.3);
  vec3 lp = position*sc*uShoalK; lp.x += color.g*.012*sin(uTime*6.3 + aFish.w*40. + position.z*30.);
  vec3 p = c + X*lp.x + Y*lp.y + T*lp.z;
  vP = p; vN = X*normal.x + Y*normal.y + T*normal.z; vC = color; vSeed = aFish.w;
  gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.);
}`,Wt=`
${ct}
uniform vec3 uBodyCol;
varying vec3 vP, vN, vC; varying float vSeed;
void main(){
  vec3 N = vN/max(length(vN), 1e-4); if (!gl_FrontFacing) N = -N;
  vec3 alb = uBodyCol*vC.r*(.85 + .3*fract(vSeed*13.7));
  alb = mix(alb, vec3(.02, .015, .02), smoothstep(.55, .9, vC.b));  // the big dark eye
  vec3 c = litAnimal(alb, N, vP, .9, .75);                          // glassy: the sun comes through it
  gl_FragColor = vec4(c, 1.);
}`;async function Xt(e){const{path:y,M:t,R:r,scene:M,U:z,ctx:u}=e,w=Math.round(1400*e.detail*fe(e.density,.8,1.15)),d=Kt(),P=new Float32Array(w*4);for(let O=0;O<w;O++)P[O*4]=r()*6.2832,P[O*4+1]=Math.sqrt(r()),P[O*4+2]=r.gauss()*.45,P[O*4+3]=r(),O%800===799&&await u.yield();const l=Math.round(w*.4),h=w-l,p=Ae,V=(O,be,Te)=>{const ce=new S.InstancedBufferGeometry;ce.index=d.index;for(const Ne of["position","normal","color"])ce.setAttribute(Ne,d.getAttribute(Ne));ce.setAttribute("aFish",new S.InstancedBufferAttribute(P.slice(O*4,(O+be)*4),4)),ce.instanceCount=be;const ze={...z,uShoalC:{value:m(0,0,0)},uShoalAx:{value:m(12,3.2,6)},uShoalYaw:{value:0},uShoalK:{value:1},uShoalRing:{value:0},uBodyCol:{value:Ee("#D98A7A")}},ye=new S.Mesh(ce,new S.ShaderMaterial({uniforms:ze,vertexShader:Yt,fragmentShader:Wt,side:S.DoubleSide}));return ye.frustumCulled=!1,ye.name=Te,M.add(ye),ze},g=V(0,h,"belemnites"),s=V(h,l,"belemnites-b"),a=et();e.frameAt(27/y.length,a);const c=a.p.clone().addScaledVector(a.r,1.5),b=c.y,n=Math.atan2(-a.t.z,a.t.x)+.5,o=m(12,3,5.5),T=m(10.5,-19.8,-27),x=m(13,2.2,8);e.frameAt(t.east0,a);const k=a.p.clone().addScaledVector(a.t,17).addScaledVector(a.r,2.5).add(m(0,-4.6,0)),R=m(11,2.3,6.5);e.frameAt(pe(t.east0,t.east1,.7),a);const I=a.p.clone().addScaledVector(a.t,15).addScaledVector(a.r,1.5).add(m(0,-7.4,0)),E=m(10.5,2.4,7.5),C=e.A.portalSeat.position,N=m(C.x+2,C.y-3.6,C.z),f=m(10.5,1.6,10.5),D=m(1.5,-19.6,-7),$=m(9.5,1.3,8.5),Z=m(0,0,0),j=m(0,0,0);e.shoal={c0:c,c1:Z},e.updaters.push((O,be,Te,ce)=>{const ze=ce>t.log1,ye=p(.025,t.log0*.62,ce);c.y=b-3.4-5.1*(1-ye),o.y=pe(1.5,2.2,ye);const Ne=Math.max(.001,ze?p(t.log1,t.helix0+.03,ce):1-p(t.log0+.01,t.log1-.01,ce)),q=p(t.out,t.east0-.012,ce);Z.copy(T).lerp(k,q),j.copy(x).lerp(R,q);for(const B of[g,s])B.uShoalC.value.copy(ze?Z:c),B.uShoalAx.value.copy(ze?j:o),B.uShoalYaw.value=ze?0:n,B.uShoalRing.value=ze?1:0,B.uShoalK.value=Ne*(ze?1.22:1);if(ze){const B=p(pe(t.east0,t.east1,.3),pe(t.east0,t.east1,.72),ce);g.uShoalC.value.lerp(I,B),g.uShoalAx.value.lerp(E,B);const de=p(t.helix1+.03,t.east0,ce);s.uShoalC.value.copy(D).lerp(N,de),s.uShoalAx.value.copy($).lerp(f,de)}})}function $t(){const e=[],y=[],t=[],z=Math.log(2.25)/6.2832,u=.105,w=-Math.PI/2,d=(a,c,b,n,o,T)=>(e.push(a,c,b),y.push(n,o,T),e.length/3-1);let P=null,l=null;for(let a=0;a<=15;a++){const c=w-14.45136*(1-a/15),b=u*Math.exp(z*(c-w)),n=.46*b,o=.2*b,T=Math.cos(c),x=Math.sin(c),k=c-w,R=[d(T*(b-.75*n),x*(b-.75*n),-o*.8,k,-1,0),d(T*(b+.5*n),x*(b+.5*n),-o,k,-.5,0),d(T*(b+n),x*(b+n),0,k,0,0),d(T*(b+.5*n),x*(b+.5*n),o,k,.5,0),d(T*(b-.75*n),x*(b-.75*n),o*.8,k,1,0)];if(P)for(let I=0;I<4;I++)t.push(P[I],R[I],R[I+1],P[I],R[I+1],P[I+1]);P=R,l={r:b,h:n,w:o}}const h=0,p=-l.r,V=(a,c,b,n)=>d(h+a,p+c,b,0,0,n),g=V(.012,-.01,0,1);for(let a=0;a<4;a++)t.push(P[a],g,P[a+1]);for(let a=0;a<8;a++){const c=a/8*6.2832,b=Math.cos(c),n=Math.sin(c),o=V(.004,b*.022-.004,n*.016,1),T=V(.004,b*.022+.008-.004,n*.016+.006,1),x=V(.075+.02*b,b*.034-.016,n*.026,1);t.push(o,T,x)}for(const a of[-1,1]){const c=V(-.006,-.012,a*l.w*.86,2),b=V(.018,-.012,a*l.w*.8,2),n=V(.006,.012,a*l.w*.9,2),o=V(.006,-.03,a*l.w*.7,2);t.push(c,b,n,c,o,b)}const s=new S.BufferGeometry;return s.setAttribute("position",new S.Float32BufferAttribute(e,3)),s.setAttribute("aUv",new S.Float32BufferAttribute(y,3)),s.setIndex(t),s.computeVertexNormals(),s}const Zt=`
uniform float uTime;
attribute vec3 aUv; attribute vec4 aHome, aHead;                    // home xyz + size; yaw, seed, track length, speed
varying vec3 vP, vN, vUv; varying float vSeed;
void main(){
  float ph = fract(uTime*aHead.w/max(aHead.z, .5) + aHead.y);        // along its track, shell-first
  float jet = fract(uTime*1.05 + aHead.y*7.), surge = exp(-jet*3.5); // one jet a second
  float grow = smoothstep(0., .08, ph)*(1. - smoothstep(.92, 1., ph));
  vec3 F = vec3(cos(aHead.x), 0., sin(aHead.x)), Sd = vec3(-F.z, 0., F.x);
  float rock = .13*sin(jet*6.2832) + .06*sin(uTime*.7 + aHead.y*20.);
  vec3 lp = position; float cr = cos(rock), sr = sin(rock);
  lp.xy = vec2(lp.x*cr - lp.y*sr, lp.x*sr + lp.y*cr);
  if (aUv.z > .5 && aUv.z < 1.5) lp.y += .012*sin(uTime*5. + position.x*60. + aHead.y*9.)*smoothstep(.0, .08, position.x);
  vec3 c = aHome.xyz - F*((ph - .5)*aHead.z + .05*surge) + vec3(0., .05*surge - .02, 0.);
  vec3 p = c + (F*lp.x + vec3(0., 1., 0.)*lp.y + Sd*lp.z)*aHome.w*grow;
  vec3 n = normal; n.xy = vec2(n.x*cr - n.y*sr, n.x*sr + n.y*cr);
  vP = p; vN = F*n.x + vec3(0., 1., 0.)*n.y + Sd*n.z; vUv = aUv; vSeed = aHead.y;
  gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.);
}`,Qt=`
${ct}
uniform vec3 uShellA, uShellB;
varying vec3 vP, vN, vUv; varying float vSeed;
void main(){
  vec3 N = vN/max(length(vN), 1e-4); if (!gl_FrontFacing) N = -N;
  float dist = distance(vP, uCamL), av = abs(vUv.y), near = 1. - smoothstep(5., 14., dist);
  float rib = sin(vUv.x*7.5 - 5.5*av*(1.3 - av) + 2.*av*av);          // sickle ribs: forward on the flank, swept back at the keel
  float band = smoothstep(.55, .9, sin(vUv.x*4.2 + vSeed*6. + 1.6*av))*.7;   // narrow rust-rose growth bands across the whorl: a striped shell, never one red patch
  vec3 alb = mix(uShellA, uShellB, clamp(band, 0., 1.)*.85)*(1. + .2*rib*mix(.35, 1., near));
  alb *= .78 + .22*smoothstep(.0, .12, av);                           // the keel reads as a darker line
  alb *= 1. - .5*smoothstep(.72, 1., av);                             // the seam where each whorl laps the one inside it: the coil reads as a spiral
  float soft = step(.5, vUv.z);
  alb = mix(alb, vec3(.66, .5, .38), soft);
  alb = mix(alb, vec3(.01, .012, .014), step(1.5, vUv.z));
  N = N + rib*near*.18*vec3(0., 1., 0.)*(1. - soft); N /= max(length(N), 1e-4);
  gl_FragColor = vec4(litAnimal(alb, N, vP, .7 - .4*soft, .25), 1.);
}`;async function Jt(e){const{path:y,M:t,R:r,scene:M,U:z,ctx:u}=e,w=Math.round(150*e.detail*fe(e.density,.8,1.2)),d=r.chance(.5),P=d?Math.round(100*e.detail):0,l=w+P,h=$t(),p=new S.InstancedBufferGeometry;p.index=h.index;for(const A of["position","normal","aUv"])p.setAttribute(A,h.getAttribute(A));const V=new Float32Array(l*4),g=new Float32Array(l*4),s=et(),a=m(0,0,0),c=[[t.log0+.01,t.helix1+.03,.42],[t.turn,t.east1+.04,.2],[t.under-.07,.992,.1]],b=.6,n=1.75,o=2.2,T=.05,x=-.02,k=.03,R=-1.2,I=1e-4;let E=0;{const A=h.getAttribute("position"),te=h.getAttribute("aUv");for(let ne=0;ne<A.count;ne++)E=Math.max(E,Math.hypot(A.getX(ne),A.getY(ne),A.getZ(ne))+(te.getZ(ne)>.5&&te.getZ(ne)<1.5?.012*Ae(0,.08,A.getX(ne)):0))}const C=.05,N=4,f=Math.ceil(y.length/C),D=new Float64Array((f+1)*3),$=m(0,0,0),Z={x:0,z:0};for(let A=0;A<=f;A++)y.posAtDist(Math.min(A*C,y.length),$),D[A*3]=$.x,D[A*3+1]=$.y,D[A*3+2]=$.z,A%500===499&&await u.yield();const j=(A,te,ne,ue,ie,Y,W,G)=>{const K=D[A*3]-te,re=D[A*3+1]-ne,Q=D[A*3+2]-ue,i=K*ie+Q*Y,v=Q*ie-K*Y,L=i<W?i-W:i>G?i-G:0,F=re<x?re-x:re>k?re-k:0;return L*L+F*F+v*v},O=new Int32Array(2*f+8);let be=0;const Te=(A,te,ne,ue,ie,Y,W,G)=>{const K=(G+C*N/2)*(G+C*N/2),re=G*G;let Q=re,i=-1;be=0;for(let v=0;v<=f;v=v<f?Math.min(v+N,f):f+1)if(!(j(v,A,te,ne,ue,ie,Y,W)>=K))for(let L=Math.max(v-N/2,0);L<=Math.min(v+N/2,f);L++){const F=j(L,A,te,ne,ue,ie,Y,W);F<re&&(O[be++]=L),F<Q&&(Q=F,i=L)}return i},ce=(A,te,ne,ue,ie,Y,W,G,K,re,Q)=>{let i=0,v=re-K+2*Q+1;for(let L=0;L<32;L++){const F=(i+v)/2;let X=!1;for(let J=0;J<be&&!X;J++)X=j(O[J],A+ue*F,te+ie*F,ne+Y*F,W,G,K,re)<Q*Q;X?i=F:v=F}return v},ze=(A,te,ne)=>{const ue=Math.max(A-1,0)*3,ie=Math.min(A+1,f)*3,Y=-(D[ie+2]-D[ue+2]),W=D[ie]-D[ue],G=Math.hypot(Y,W)||1,K=(te-D[A*3])*Y+(ne-D[A*3+2])*W<0?-1:1;Z.x=K*Y/G,Z.z=K*W/G},ye=.105,Ne=.17,q=e.hero.object.getObjectByName("log"),B=q.geometry.getAttribute("position"),de=q.geometry.index,se=new Float64Array(B.count*4),je=new S.Matrix4,tt=new S.Matrix4;for(let A=q;A;A=A.parent)je.premultiply(tt.compose(A.position,A.quaternion,A.scale));const Xe=(A,te)=>Math.hypot(B.getX(A)-B.getX(te),B.getY(A)-B.getY(te),B.getZ(A)-B.getZ(te));for(let A=0;A<de.count;A+=3){const te=de.getX(A),ne=de.getX(A+1),ue=de.getX(A+2),ie=Xe(te,ne),Y=Xe(ne,ue),W=Xe(ue,te),G=Math.max(ie,Y,W),K=(ie+Y+W)/2,re=Math.sqrt(Math.max(K*(K-ie)*(K-Y)*(K-W),0)),Q=2*G*G<ie*ie+Y*Y+W*W&&re>0?ie*Y*W/(4*re):G/2;for(const i of[te,ne,ue])Q>se[i*4+3]&&(se[i*4+3]=Q)}let $e=1/0;for(let A=0;A<B.count;A++)$.set(B.getX(A),B.getY(A),B.getZ(A)),se[A*4+3]+=Ne+ye*Math.hypot($.y,$.z),$.applyMatrix4(je),se[A*4]=$.x,se[A*4+1]=$.y,se[A*4+2]=$.z,$e=Math.min($e,$.y-se[A*4+3]);const ut=(A,te,ne,ue,ie,Y,W,G)=>{if(te+k+G<=$e)return!1;for(let K=0;K<se.length;K+=4){const re=se[K]-A,Q=se[K+1]-te,i=se[K+2]-ne,v=re*ue+i*ie,L=i*ue-re*ie,F=G+se[K+3],X=v<Y?v-Y:v>W?v-W:0,J=Q<x?Q-x:Q>k?Q-k:0;if(X*X+J*J+L*L<F*F)return!0}return!1},rt=(A,te,ne,ue,ie)=>{const Y=Math.cos(Math.fround(te)),W=Math.sin(Math.fround(te)),G=Math.fround(ne)/2,K=-G-T,re=E*Math.fround(ue),Q=ie+re,i=Math.fround(A.x),v=Math.fround(A.y),L=Math.fround(A.z);if(Te(i,v,L,Y,W,K,G,b+re)<0)return;const F=Te(i,v,L,Y,W,K,G,Q),X=j(F,i,v,L,Y,W,K,G),J=(_,he,U,H)=>{let Pe=Te(_,he,U,Y,W,K,G,Q);for(let Re=0;Re<3&&Pe>=0;Re++){if(H)he=Math.fround(he+H*ce(_,he,U,0,H,0,Y,W,K,G,Q+I));else{ze(Pe,_,U);const ae=ce(_,he,U,Z.x,0,Z.z,Y,W,K,G,Q+I);_=Math.fround(_+Z.x*ae),U=Math.fround(U+Z.z*ae)}Pe=Te(_,he,U,Y,W,K,G,Q)}const Le=he<=R&&!ut(_,he,U,Y,W,K,G,re);return{x:_,y:he,z:U,v:H,ok:Pe<0&&Le,air:Le?Pe<0?Q*Q:j(Pe,_,he,U,Y,W,K,G):-1,move:Math.hypot(_-i,he-v,U-L)}},le=J(i,v,L,1),Ce=J(i,v,L,-1),we=J(i,v,L,0),Me=le.ok&&(!Ce.ok||le.move<Ce.move)?le:Ce,Be=F*C>=c[2][0]*y.length;let Se=Me.ok&&(Be||!we.ok||Me.move<=we.move)?Me:we;if(!Se.ok){let _=we;if(le.air>_.air&&(_=le),Ce.air>_.air&&(_=Ce),Se=_.air>X?_:{x:i,y:v,z:L,air:X},Se.air<(b+re)*(b+re))for(const he of _.v?[J(_.x,_.y,_.z,0)]:[J(_.x,_.y,_.z,-1),J(_.x,_.y,_.z,1)])(he.air>Se.air||he.ok&&Se.ok&&he.move<Se.move)&&(Se=he)}A.x=Se.x,A.y=Se.y,A.z=Se.z};for(let A=0;A<l;A++){const te=A>=w,ne=r(),ue=r()*6.2832,ie=r.range(1.75,5.5),Y=r(),W=r.gauss(),G=r(),K=r.range(.12,.24),re=r.range(4,7),Q=r.range(.85,1.25);let i;const v=ne<c[0][2]?c[0]:ne<c[0][2]+c[1][2]?c[1]:ne<c[0][2]+c[1][2]+c[2][2]?c[2]:null;if(v){e.frameAt(pe(v[0],v[1],Y),s),a.copy(s.p).addScaledVector(s.r,Math.cos(ue)*ie).addScaledVector(s.n,Math.sin(ue)*ie*.8),i=Math.atan2(s.t.z,s.t.x)+(G>.5?Math.PI:0);let L=0;for(;y.distanceTo(a.x,a.y,a.z)<n&&L++<6;)a.addScaledVector(s.r,Math.cos(ue)>=0?.6:-.6)}else{const L=-2-Y*16.5;a.set(r.range(-9.5,9.5),L,L*Math.tan(.349)+W*1.6),i=(G>.5?0:Math.PI)+W*.3,y.distanceTo(a.x,a.y,a.z)<o&&(a.z+=4.5)}a.y>-1.2&&(a.y=-1.2),rt(a,i,re*(te?.5:1),te?Q*.22:Q,v?n:o),A%20===19&&await u.yield(),V.set([a.x,a.y,a.z,te?Q*.22:Q],A*4),g.set([i,G,re*(te?.5:1),K],A*4),A%100===99&&await u.yield()}p.setAttribute("aHome",new S.InstancedBufferAttribute(V,4)),p.setAttribute("aHead",new S.InstancedBufferAttribute(g,4)),p.instanceCount=l;const at=new S.Mesh(p,new S.ShaderMaterial({uniforms:{...z,uShellA:{value:Ee("#DDC79A").multiplyScalar(.9)},uShellB:{value:Ee("#B5443F")}},vertexShader:Zt,fragmentShader:Qt,side:S.DoubleSide}));at.frustumCulled=!1,at.name="ammonites",M.add(at)}function ea(){const e=[],y=[],t=[],M=(a,c,b,n)=>(e.push(a,c,b),y.push(b,c,n),e.length/3-1),z=[[.05,.04,-.036,.016],[.13,.098,-.088,.034],[.22,.142,-.135,.047],[.34,.172,-.172,.056],[.5,.185,-.195,.058],[.64,.165,-.175,.05],[.76,.115,-.12,.036],[.85,.052,-.054,.018],[.91,.028,-.028,.009]],u=10,w=a=>.4*(.5-a),d=[];for(const[a,c,b,n]of z){const o=(c+b)/2,T=(c-b)/2,x=[];for(let k=0;k<u;k++){const R=k/u*6.2832,I=Math.cos(R),E=Math.sin(R);x.push(M(n*Math.sign(E)*Math.pow(Math.abs(E),.8),o+T*I,w(a),0))}d.push(x)}const P=M(0,0,w(0),0);for(let a=0;a<u;a++)t.push(P,d[0][(a+1)%u],d[0][a]);for(let a=0;a<d.length-1;a++)for(let c=0;c<u;c++){const b=(c+1)%u;t.push(d[a][c],d[a][b],d[a+1][b],d[a][c],d[a+1][b],d[a+1][c])}const l=M(0,.026,w(.9),1),h=M(0,-.026,w(.9),1),p=M(0,.105,w(1.045),1),V=M(0,0,w(1),1),g=M(0,-.105,w(1.045),1);t.push(l,p,V,l,V,h,h,V,g);for(const a of[1,-1]){let c=null,b=null;for(let n=0;n<=6;n++){const o=pe(.42,.87,n/6),T=a*(pe(.186,.045,Math.pow(Math.max(o-.46,0)/.41,1.6))+(o<.5?.002:0))-(a<0?.006:0),x=M(0,T*.94,w(o),1),k=M(0,T+a*(.062*Math.sin(Math.PI*Math.min(n/6+.12,1))+.012),w(o+.045),1);c!==null&&t.push(c,x,k,c,k,b),c=x,b=k}}const s=new S.BufferGeometry;return s.setAttribute("position",new S.Float32BufferAttribute(e,3)),s.setAttribute("aUv",new S.Float32BufferAttribute(y,3)),s.setIndex(t),s.computeVertexNormals(),s}const ta=`
uniform float uTime; uniform vec3 uCamL;
attribute vec3 aUv; attribute vec4 aHome, aLoop;                    // home xyz + size; loop radius, angular speed, seed, tilt
varying vec3 vP, vN, vUv, vTd, vYd; varying float vSeed;
void main(){
  // They hold station under the drifting wood, all heading into the flow (+z, each a little off it), so from our
  // line along the log every one is seen BROADSIDE, upright: a plate on edge, never a card tilted at the lens.
  float yaw = .45 + (aLoop.w - .5)*.8 + .22*sin(uTime*.31 + aLoop.z*21.) + step(.86, fract(aLoop.z*7.7))*3.1416;
  vec3 T = vec3(sin(yaw), 0., cos(yaw));
  vec3 c = aHome.xyz + T*(.35*aLoop.x*sin(uTime*abs(aLoop.y)*1.3 + aLoop.z*30.)) + vec3(0., .07*sin(uTime*.9 + aLoop.z*17.), 0.);
  vec3 d = c - uCamL; float l = max(length(d), 1e-3);               // they part at two and a half metres
  c += d/l*2.7*(1. - smoothstep(.4, 5.2, l));
  float keepK = smoothstep(1.7, 2.5, distance(c, uCamL));           // and nothing is ever a blur against the lens
  vec3 X = vec3(T.z, 0., -T.x), Y = vec3(0., 1., 0.);
  vec3 lp = position;
  float wag = sin(uTime*5. + aLoop.z*40. + position.z*9.);
  lp.x += .012*wag*smoothstep(.05, -.2, position.z) + aUv.z*.01*sin(uTime*9. + position.z*45. + aLoop.z*17.);   // tail scull, fin ripple
  vec3 p = c + (X*lp.x*1.3 + Y*lp.y + T*lp.z)*aHome.w*keepK;                  // (sixth polish) 0.15 m through: deep and flat-sided, rounded at back and belly; 0.24 m read as a balloon from below
  vP = p; vN = X*normal.x*.77 + Y*normal.y + T*normal.z; vUv = aUv; vSeed = aLoop.z; vTd = T; vYd = Y;
  gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.);
}`,aa=`
${ct}
uniform vec3 uPewter;
varying vec3 vP, vN, vUv, vTd, vYd; varying float vSeed;
void main(){
  vec3 N = vN/max(length(vN), 1e-4); if (!gl_FrontFacing) N = -N;
  float dist = distance(vP, uCamL), near = 1. - smoothstep(6., 16., dist), fin = step(.5, vUv.z);
  // the plate is a LENS, not a card: its normal leans outward toward the rim, so light and shade run across it
  vec2 dq = vec2((vUv.x + .012)/.215, vUv.y/.2); float rad = min(length(dq), 1.2);
  vec3 Nb = N + (vTd*dq.x + vYd*dq.y)*.35*smoothstep(.15, 1., rad)*(1. - fin); N = Nb/max(length(Nb), 1e-4);
  float hgt = clamp(vUv.y/.19, -1., 1.);
  vec2 q = vec2(vUv.x*40. + vUv.y*27., vUv.x*40. - vUv.y*27.);        // rhombic armour scales in oblique rows
  vec2 f = abs(fract(q) - .5);
  float seam = smoothstep(.3, .5, max(f.x, f.y)), cell = fract(sin(dot(floor(q), vec2(12.9, 78.2)))*4375.5);
  float head = smoothstep(.085, .11, vUv.x);                          // the head is smooth bone, darker, with a gill-cover edge
  vec3 back = uPewter*vec3(.11, .17, .17), flank = uPewter*vec3(.7, .6, .36), belly = vec3(.5, .45, .29);   // olive-black back, bronze-pewter flank, a buff belly: a mid-toned fish, never a pale card
  vec3 alb = mix(flank, back, smoothstep(.2, .85, hgt)); alb = mix(alb, belly, smoothstep(-.3, -.9, hgt)*.85);
  float near2 = 1. - smoothstep(9., 24., dist);
  float near3 = 1. - smoothstep(2., 5.5, dist);
  alb *= (1. - .3*seam*near3*(1. - head))*(1. + .22*(cell - .5)*near2);   // scale seams only where a scale is several pixels: further off a smooth armoured flank, never stripes   // the armour of rhombic scales reads as far as the fish does
  alb = mix(alb, alb*vec3(.6, .64, .62), head*.8);
  float gill = abs(length(vec2(vUv.x - .15, vUv.y - .015)) - .085);
  alb *= 1. - .55*(1. - smoothstep(.003, .011, gill))*step(vUv.x, .1)*step(abs(vUv.y - .01), .13);
  alb *= 1. - .18*smoothstep(.86, 1.02, rad);                           // the rim falls into shade
  vec2 e = vec2(vUv.x - .132, vUv.y - .03);                           // a big eye in a ring of pale gold
  alb = mix(alb, vec3(.86, .7, .34), smoothstep(.032, .026, length(e)));
  alb = mix(alb, vec3(.008), smoothstep(.019, .015, length(e)));
  alb += vec3(.5)*smoothstep(.007, .003, length(e - vec2(.006, .007)));
  float sheen = .5 + .5*sin(uTime*.55 + vUv.x*7. + vSeed*30.);         // a slow sheen runs down the flank
  float gloss = (.2 + .7*sheen*(1. - seam))*(1. - fin);
  vec3 finC = vec3(.33, .27, .13)*(.9 + .1*sin(vUv.x*210. + vUv.y*60.))*(.7 + .6*smoothstep(.17, .25, abs(vUv.y)));   // rayed amber fins, the light through them
  alb = mix(alb*(.8 + .35*sheen), finC, fin);
  alb *= mix(.34, 1., smoothstep(-.75, .35, N.y));                     // seen from below, a fish is in its own shade: a dark shape against the bright ceiling
  gl_FragColor = vec4(litAnimal(alb, N, vP, gloss, .1 + .7*fin), 1.);
}`;function oa(e){const{R:y,scene:t,U:r}=e,M=60,z=ea(),u=new S.InstancedBufferGeometry;u.index=z.index;for(const l of["position","normal","aUv"])u.setAttribute(l,z.getAttribute(l));const w=new Float32Array(M*4),d=new Float32Array(M*4);for(let l=0;l<M;l++){const h=y.chance(.3);w.set([y.range(-9.5,10.5),y.range(-3.3,-1)-(h?1.5:0),h?y.range(3,7):y.range(.9,4.2),y.range(.8,1.2)],l*4),d.set([y.range(.5,1.5),(y.chance(.5)?1:-1)*y.range(.22,.45),y(),y()],l*4)}u.setAttribute("aHome",new S.InstancedBufferAttribute(w,4)),u.setAttribute("aLoop",new S.InstancedBufferAttribute(d,4)),u.instanceCount=M;const P=new S.Mesh(u,new S.ShaderMaterial({uniforms:{...r,uPewter:{value:Ee("#9FB3A6")}},vertexShader:ta,fragmentShader:aa,side:S.DoubleSide}));P.frustumCulled=!1,P.name="dapedium",t.add(P)}const na=`
uniform float uTime, uPx, uU, uInkSpan; uniform vec3 uCamL, uBurst0, uBurst1, uBurstDir; uniform vec2 uBurstAge;
attribute vec4 aS;
varying float vKind, vA, vSeed;
void main(){
  vec3 p = position; float size = .005, a = 1., minPx = 1.6, maxPx = 9.;
  if (aS.x < .5) {                                                   // snow: a 36 m box that follows us, sinking 0.05 m/s
    p.y -= uTime*.05; p.x += .15*sin(uTime*.3 + aS.y*40.); p.z += .15*cos(uTime*.23 + aS.z*40.);
    p = mod(p*.6667 - uCamL + 12., 24.) - 12.; float l = length(p);
    a = (1. - smoothstep(8., 12., l))*smoothstep(.3, .9, l)*(.5 + .5*aS.y);
    p += uCamL; size = .003 + .005*aS.z; minPx = 1.8;
  } else if (aS.x < 1.5) {                                           // ink: squirted as we arrive, hangs, dissolves
    float age = (uU - aS.w)/max(uInkSpan, 1e-4);
    a = smoothstep(0., .08, age)*(1. - smoothstep(.25, 1., age))*.3*step(1e-5, uU);
    size = .05 + .45*smoothstep(0., 1., age); p.y += .1*age; minPx = 0.; maxPx = 60.;
  } else {                                                           // bubbles: rise wobbling to the ceiling
    float em = step(.5, aS.w), age = mix(uBurstAge.x, uBurstAge.y, em) - aS.y*mix(.7, .35, em);
    vec3 o = mix(uBurst0, uBurst1 - uBurstDir*aS.z*1.7, em);
    float rise = age*(.5 + .9*aS.z*aS.y + .3*em);
    p = o + p*(.4 + .5*clamp(age, 0., 2.)) + vec3(.06*sin(age*7. + aS.y*30.), rise, .06*cos(age*6. + aS.z*30.));
    a = step(0., age)*(1. - smoothstep(-.25, -.05, p.y))*(1. - smoothstep(2.5, 4., age));
    size = .012 + .03*aS.y*aS.z + .02*em*aS.z; maxPx = 22.;
  }
  vec4 mv = viewMatrix*vec4(p, 1.);
  float px = size/max(-mv.z*uPx, 1e-5);
  vA = a*clamp(px/minPx, .45, 1.); vKind = aS.x; vSeed = aS.y;
  gl_PointSize = clamp(px, max(minPx, 1.), maxPx);
  gl_Position = projectionMatrix*mv;
  if (a < .003) gl_Position = vec4(2., 2., 2., 1.);
}`,sa=`
uniform vec3 uSnowCol, uInkCol, uBubCol;
varying float vKind, vA, vSeed;
void main(){
  vec2 q = gl_PointCoord*2. - 1.; float r = length(q), soft = 1. - smoothstep(.5, 1., r);
  vec3 c = uSnowCol; float a = vA*soft;
  if (vKind > 1.5) { float ring = smoothstep(.45, .8, r)*(1. - smoothstep(.85, 1., r)); float hl = 1. - smoothstep(0., .3, length(q - vec2(-.35, -.35)));
    c = uBubCol*(.6 + .9*hl); a = vA*clamp(ring*.85 + hl + .12*soft, 0., 1.); }
  else if (vKind > .5) { c = uInkCol; a = vA*(1. - smoothstep(.15, 1., r))*(.7 + .3*sin(q.x*5. + vSeed*20.)*sin(q.y*6. + vSeed*9.)); }
  gl_FragColor = vec4(c, a);
}`;function ia(e){const{R:y,scene:t,U:r,path:M,M:z,hero:u}=e,w=Math.round(2500*e.detail),d=Math.round(120*e.detail),P=60,l=170,h=w+d+P+l,p=new Float32Array(h*3),V=new Float32Array(h*4),g=et();let s=0;for(let T=0;T<w;T++,s++)p.set([y.range(-18,18),y.range(-18,18),y.range(-18,18)],s*3),V.set([0,y(),y(),0],s*4);const a=20/M.length,c=47/M.length;for(let T=0;T<d;T++,s++){const x=pe(a,c,y()),k=y()*6.2832,R=y.range(1.5,3.3);e.frameAt(x+9/M.length,g),p.set([g.p.x+g.r.x*Math.cos(k)*R,g.p.y+Math.sin(k)*R*.8,g.p.z+g.r.z*Math.cos(k)*R],s*3),V.set([1,y(),y(),x],s*4)}for(let T=0;T<P+l;T++,s++){const x=()=>y.gauss()*.13;p.set([x(),x()*.6,x()],s*3),V.set([2,y(),y(),T<P?0:1],s*4)}const b=new S.BufferGeometry;b.setAttribute("position",new S.BufferAttribute(p,3)),b.setAttribute("aS",new S.BufferAttribute(V,4));const n={uTime:r.uTime,uPx:r.uPx,uCamL:r.uCamL,uU:{value:0},uInkSpan:{value:34/M.length},uBurst0:{value:m(0,50,0)},uBurst1:{value:m(0,50,0)},uBurstDir:{value:m(0,-1,0)},uBurstAge:{value:new S.Vector2(-9,-9)},uSnowCol:{value:Ee("#E9F6E4").multiplyScalar(.95)},uInkCol:{value:Ee("#2A1A10")},uBubCol:{value:Ee("#F4FBF4").multiplyScalar(1.15)}},o=new S.Points(b,new S.ShaderMaterial({uniforms:n,vertexShader:na,fragmentShader:sa,transparent:!0,depthWrite:!1}));o.frustumCulled=!1,o.renderOrder=9,o.name="specks",t.add(o),e.specks=n,e.updaters.push((T,x,k,R)=>{n.uU.value=R;const I=e.breathAge??99;I<5&&e.pod?(I<.12&&(n.uBurst0.value.copy(e.pod.positions[e.breathMate||1]).y=-.45),n.uBurstAge.value.x=I):n.uBurstAge.value.x=-9})}function ra(){const e=[],y=[],t=[],r=(u,w,d,P,l=0)=>(e.push(u,w,d),y.push(P,l,0),e.length/3-1),M=(u,w,d,P,l=0)=>{let h=null;u.forEach((p,V)=>{const g=u[Math.max(V-1,0)],s=u[Math.min(V+1,u.length-1)],a=m(s[0]-g[0],s[1]-g[1],s[2]-g[2]).normalize(),c=m(0,1,0);Math.abs(a.y)>.9&&c.set(1,0,0),c.addScaledVector(a,-c.dot(a)).normalize();const b=m(0,0,0).crossVectors(a,c),n=[];for(let o=0;o<d;o++){const T=o/d*6.2832,x=Math.cos(T)*w[V],k=Math.sin(T)*w[V];n.push(r(p[0]+c.x*x+b.x*k,p[1]+c.y*x+b.y*k,p[2]+c.z*x+b.z*k,P,l))}if(h)for(let o=0;o<d;o++){const T=(o+1)%d;t.push(h[o],h[T],n[T],h[o],n[T],n[o])}h=n})};M([[0,0,-.09],[0,.002,-.05],[0,.006,0],[0,.01,.05],[0,.014,.085]],[.008,.026,.035,.03,.016],7,0),M([[0,.014,.08],[0,.03,.115],[0,.04,.15]],[.015,.013,.017],6,0),M([[0,.04,.14],[0,.042,.175],[0,.036,.215]],[.012,.021,.014],6,0),M([[0,.036,.21],[0,.03,.26],[0,.026,.305]],[.013,.008,.002],5,2);for(let u=0;u<6;u++)for(const w of[-1,1]){const d=.225+u*.013;t.push(r(w*.006,.026,d,2),r(w*.007,.026,d+.008,2),r(w*.012,.012,d+.012,2))}for(const u of[-1,1])t.push(r(u*.0205,.05,.168,3),r(u*.0205,.05,.186,3),r(u*.0205,.036,.177,3));M([[0,0,-.085],[0,.004,-.25],[0,.006,-.42]],[.007,.004,.003],4,0),t.push(r(0,.006,-.39,1),r(0,.045,-.44,1),r(0,.006,-.49,1),r(0,.006,-.39,1),r(0,.006,-.49,1),r(0,-.03,-.44,1));for(const u of[-1,1]){M([[u*.018,-.012,-.06],[u*.04,-.03,-.12],[u*.045,-.02,-.2]],[.008,.005,.003],4,0);const w=[u*.03,.012,.055],d=[u*.12,.016,.02],P=[u*.21,.014,.075],l=[u*.5,.004,-.07],h=[u*.045,-.018,-.2];M([w,d,P],[.009,.007,.005],4,0,.2),M([P,[u*.36,.01,.02],l],[.005,.004,.002],4,0,.8);const p=(o,T)=>r(o[0],o[1]-.004,o[2],1,T),V=p(w,.05),g=p(d,.25),s=p(P,.45),a=p([u*.36,.01,.02],.75),c=p(l,1),b=p(h,.05),n=p([u*.25,0,-.12],.6);t.push(V,g,b,g,n,b,g,s,n,s,a,n,a,c,n);for(const o of[[u*.007,.046,0],[u*.01,.048,.05]])t.push(r(0,.03,o[2]-.03,0),r(o[0],o[1],o[2],0),r(0,.03,o[2]+.02,0))}const z=new S.BufferGeometry;return z.setAttribute("position",new S.Float32BufferAttribute(e,3)),z.setAttribute("aUv",new S.Float32BufferAttribute(y,3)),z.setIndex(t),z.computeVertexNormals(),z}const la=`
uniform float uFold, uFlap;
attribute vec3 aUv;
varying vec3 vP, vN, vL, vUv;
void main(){
  vec3 p = position; float w = aUv.y, ax = abs(p.x);
  if (w > 0.) { p.z -= (1. - uFold)*ax*1.05*w; p.x *= mix(.42, 1., mix(1., uFold, w)); p.y += ax*sin(uFlap)*.75*uFold*w; }
  vec4 wp = modelMatrix*vec4(p, 1.);
  vP = wp.xyz; vN = mat3(modelMatrix)*normal; vL = position; vUv = aUv;
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,ca=`
${ct}
varying vec3 vP, vN, vL, vUv;
void main(){
  vec3 N = vN/max(length(vN), 1e-4); if (!gl_FrontFacing) N = -N;
  float fur = sin(vL.z*190. + 4.*sin(vL.x*130.))*sin(vL.x*170. + vL.y*150.);
  vec3 alb = mix(vec3(.40, .26, .15), vec3(.13, .08, .05), smoothstep(-.01, .03, vL.y))*(1. + .3*fur);   // dark back, tawny below
  alb = mix(alb, vec3(.62, .50, .36), smoothstep(.08, .13, vL.z)*smoothstep(.03, .0, vL.y));              // pale throat
  float part = vUv.x, back = 0.;
  if (part > .5 && part < 1.5) { alb = vec3(.42, .25, .17)*(1. + .25*sin(vL.x*60. + vL.z*45.)); back = .8; }   // membrane: the light comes through
  if (part > 1.5) alb = mix(vec3(.75, .6, .3), vec3(.08, .06, .05), smoothstep(.26, .3, vL.z));
  if (part > 2.5) alb = vec3(.01);
  gl_FragColor = vec4(litAnimal(alb, N, vP, .25, back), 1.);
}`;function ha(e){const{path:y,M:t,scene:r,U:M}=e,z=Ae,u={...M,uFold:{value:0},uFlap:{value:0}},w=new S.Mesh(ra(),new S.ShaderMaterial({uniforms:u,vertexShader:la,fragmentShader:ca,side:S.DoubleSide}));w.frustumCulled=!1,w.name="pterosaur",w.matrixAutoUpdate=!1,r.add(w);const d=pe(t.log0,t.log1,.1),P=d+7.5/y.length,l=et();e.frameAt(d+7.6/y.length,l);const h=m(l.p.x-.6,.3,l.p.z+1.5),p=m(.4,-.88,.12).normalize(),V=m(0,0,0),g=m(0,0,1),s=m(1,0,0),a=m(0,1,0),c=m(0,0,0),b=m(1,1,1);let n=-99,o=0;const T=l.t.clone().add(m(0,.3,0)).normalize();e.rareU=[d,P],e.updaters.push((x,k,R,I)=>{const E=fe((I-d)/(P-d),0,1),C=I>d&&I<P,N=2.7*z(0,.3,E)*(1-z(.6,.97,E))-1.2*z(.85,1,E),f=z(.5,.72,E);V.copy(h).addScaledVector(p,N),V.x+=.5*f,V.z+=.3*f,g.copy(p).multiplyScalar(1-2*f).add(c.set(.5,0,.3).multiplyScalar(Math.sin(f*Math.PI))).normalize(),s.crossVectors(T,g).normalize(),a.crossVectors(g,s),b.setScalar(C?1.75:.001),C||V.set(h.x,40,h.z),w.matrix.makeBasis(s,a,g).scale(b).setPosition(V),w.matrixWorldNeedsUpdate=!0,u.uFold.value=.12+z(.52,.72,E)*.75,u.uFlap.value=k*16,I>=d&&o<d&&(n=k),I<d&&(n=-99),o=I;const D=n>-90?k-n:99,$=e.specks,Z=e.ceilU.uDimple.value;D<5?($.uBurst1.value.copy(h).addScaledVector(p,.3),$.uBurstDir.value.copy(p).negate(),$.uBurstAge.value.y=D+.25,Z.set(h.x,h.z,D,1.6)):$.uBurstAge.value.y=-9})}export{fa as default};
