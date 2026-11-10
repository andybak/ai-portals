import*as h from"three";import{makePath as Mt,smoothstep as $,lerp as H,clamp as ye}from"../kit/core.js";import*as Ce from"../kit/fx.js";import*as st from"../kit/fauna.js";import{buildHero as St}from"../parts/the-way-back-round.js";const ee=1600,P=Math.PI*2,y=(m,T,W)=>new h.Vector3(m,T,W),At=m=>m-Math.floor(m),zt={blossom:{name:"blossom",pal:["#EAF2F5","#F6B8C8","#FFFFFF","#5C7F8A","#2C3E46","#E9C46A","#A7D8D0"],throat:"#FFFFFF",leaf:null,leafAmt:0,raft:"#F3C3CF",raft2:"#FFFFFF",lane:"#EE8FAB"},pear:{name:"pear",pal:["#EAF2F5","#EEF3D6","#FFFFFF","#5C7F8A","#2C3E46","#C9CC62","#A7D8D0"],throat:"#FFFFFF",leaf:"#86C24E",leafAmt:.42,raft:"#F2F4E6",raft2:"#B9D88E",lane:"#E9F2B4"},autumn:{name:"autumn",pal:["#EAF2F5","#D8822E","#FFFFFF","#5C7F8A","#25333B","#E9C46A","#A9C9A6"],throat:"#F0B648",leaf:"#9A3E22",leafAmt:.28,raft:"#D8822E",raft2:"#A8472A",lane:"#E0701E"}},Ct={clear:{name:"clear",low:"#EAF2F5",high:"#C9DCDD",wash:"#E2EAEE",fog:.0015,rain:0,sky:"#EAF2F5"},rain:{name:"rain",low:"#C9D5D9",high:"#9DB1B8",wash:"#A9B9BF",fog:.0023,rain:1,sky:"#D0DCE0"},dusk:{name:"dusk",low:"#EFD3D4",high:"#D6B9C6",wash:"#EFD6D0",fog:.0015,rain:0,sky:"#EFD2D2"}};var Rt={id:"the-way-back-round",name:"The Sky Is the Far Side",category:"bizarre",weirdness:1,media:["air","water"],async build(m){const T=m.rng,W=m.vary||{},G=m.quality?.detail??1,Ke=W.density??1,A=zt[T.pick(["blossom","blossom","pear","autumn"])];let te=T.pick(["clear","clear","rain","dusk"]);W.hour==="day"&&(te=te==="dusk"?"clear":te),(W.hour==="golden"||W.hour==="dawn"||W.hour==="night")&&(te="dusk");const z=Ct[te],nt=T.pick([24,24,14,36]),it=te==="dusk"?T.pick(["egret","crane"]):T.pick(["crane","crane","crane"]),rt=!!W.rare,je=A.pal.slice();je[0]=z.sky;const b=e=>new h.Color(e),I=new h.Scene;I.fog=new h.FogExp2(b(z.low),z.fog),await m.yield();const k=await St(m,{palette:je,detail:G,lap:ee,bigS:nt,water:!1,birds:it,wash:.42,petalB:A.throat,leaf:A.leaf,leafAmount:A.leafAmt});I.add(k.object),k.uniforms.uWashCol.value.set(z.wash);const oe=k.anchors,U=k.heightAt;await m.yield();const ae=oe.portalSeat.position,lt=[...oe.flyOut.map((e,t)=>[e.x,e.y+(t===0?1:t===1?1.5:t===2?.5:0),e.z]),[-6,22.5,420],[-1,17,600],[3,14,780],[8,12.6,930],[14,11.8,1065],[19,11.5,1170],[30,11.5,1280],[41,11,1370],[38,10.5,1430],[30.5,10,1478],[26.6,9.7,1503],[ae.x,ae.y+.3,ae.z-30],[ae.x,ae.y,ae.z]],E=Mt(lt);{const e=k.craneCourse(),t=[],a=[],s=E.length,o=(l,i)=>{t.push(l),a.push(i)},c=(l,i,u,f)=>{const p=E.pointAt(ye(l+i/s,0,1),y());return y(p.x-u,p.y+f,p.z)};o(.075,e.at(e.keys[0],y())),o(.088,c(.088,36,8,0)),o(.102,c(.102,31,-4,7.5)),o(.117,c(.117,31,-12,10.5)),o(.132,c(.132,40,-10,13)),o(.149,c(.149,54,16,14)),o(.168,c(.168,60,50,15)),o(.19,y(-106,30,190)),o(.21,y(-104,22,40)),o(.228,y(-62,11,-62)),o(.25,y(0,8,-82)),o(.272,y(62,12,-60)),o(.3,y(100,26,20));for(const l of e.keys)l>.33&&l<.5&&o(l,e.at(l,y()));for(let l=t.length-1;l>=0&&t[l]>.38;l--)t.pop(),a.pop();const r=(l,i,u,f)=>{const p=E.pointAt(l,y()),v=k.imageAt(l,p.z),M=E.pointAt(ye(l+i*v.S/s,0,1),y());return y(-M.x/v.S-u,p.y/v.S+f,(M.z-v.z)/v.S)};o(.405,r(.405,150,40,12)),o(.44,r(.44,17,11,-.4)),o(.47,r(.47,16,10.5,-.8)),o(.5,r(.5,16,10.5,-1)),o(.53,r(.53,16,10.5,-1)),o(.56,r(.56,16,10.5,-1.2)),o(.6,r(.6,18,10.5,-1.2)),o(.64,r(.64,26,10.5,-1.2)),o(.68,r(.68,35,10,-1.2));for(const l of[.72,.76,.8,.84])o(l,r(l,36,9.5,-1.2));o(.88,r(.88,36,11,-2.5)),o(.93,y(-36,1,-68)),k.setCraneCourse(t,a)}const De=`
float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y); }
`,He=b(A.pal[4]).multiplyScalar(.92),J={uLow:{value:b(z.low)},uHigh:{value:b(z.high)},uDeep:{value:He.clone().lerp(b(z.low),.12)},uTree:{value:b(A.pal[3]).lerp(b(A.pal[1]),.22).lerp(b(z.high),.2)},uTime:{value:0},uCrown:{value:b(A.pal[1]).lerp(b(A.leaf||A.pal[1]),.5).multiplyScalar(.8).lerp(b(z.high),.2)},uA:{value:80},uOff:{value:new h.Vector2},uRare:{value:0},uGhost:{value:0},uRk:{value:2}},be=new h.Mesh(new h.SphereGeometry(8e3,48,24),new h.ShaderMaterial({uniforms:J,side:h.BackSide,depthWrite:!1,depthTest:!1,fog:!1,vertexShader:"varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:De+`
uniform vec3 uLow, uHigh, uDeep, uTree, uCrown; uniform float uTime, uA, uRare, uGhost, uRk; uniform vec2 uOff; varying vec3 vD;
// a blossom tree in set metres (x across, y up): flared trunk, ragged cauliflower crown. x = cover, y = trunk
float lobe(vec2 s, vec2 c, vec2 r, float n){ return smoothstep(1.03, 0.93, length((s - c) / r) + n); }
vec2 tree(vec2 s){
  // cauliflower edges: big lobes, then scallops, drifting a very little
  float n = (vnoise(s * 0.045 + 3.) - 0.5) * 0.2 + (vnoise(s * 0.13 + uTime * 0.01) - 0.5) * 0.16 + (vnoise(s * 0.37 + 7.) - 0.5) * 0.09;
  // two tiers and a top, as the real crown has, and under them a ragged hem of hanging blossom
  float hem = 5. * sin(s.x * 0.33) * sin(s.x * 0.071 + 1.);
  float low = max(lobe(s, vec2(0., 54. + hem * 0.4), vec2(64., 21.), n), max(lobe(s, vec2(-47., 45. + hem), vec2(23., 14.), n), lobe(s, vec2(48., 47. + hem), vec2(22., 14.), n)));
  float high = max(lobe(s, vec2(6., 88.), vec2(40., 19.), n), lobe(s, vec2(-5., 108.), vec2(22., 12.), n));
  float gar = smoothstep(0.5, 0.64, vnoise(vec2(s.x * 0.5, 1.7))) * smoothstep(24. + 10. * vnoise(vec2(s.x * 0.23, 9.)), 33., s.y) * step(s.y, 46.) * smoothstep(66., 54., abs(s.x));
  float crown = max(max(low, high), gar * 0.85);
  // the notch between the tiers, where the boughs show
  float w = 5.5 + 12. * exp(-max(s.y, 0.) / 6.);
  float trunk = smoothstep(w + 0.8, w - 0.8, abs(s.x + 2. * sin(s.y * 0.05))) * step(0., s.y) * smoothstep(100., 80., s.y);
  float bough = smoothstep(3.6, 1.6, abs(s.y - 33. - abs(s.x) * 0.5 - 3. * sin(s.x * 0.12))) * smoothstep(52., 34., abs(s.x));
  bough = max(bough, smoothstep(2.6, 1.2, abs(s.y - 62. - abs(s.x - 3.) * 0.75)) * smoothstep(34., 20., abs(s.x - 3.)));
  // a root arch standing in the shallows on one flank, and the low back of the rock
  vec2 ac = (s - vec2(-30., 0.5)) / vec2(11., 15.);
  float arch = smoothstep(0.16, 0.08, abs(length(ac) - 1.)) * step(0., s.y);
  float rock = smoothstep(0.5, -0.5, s.y - 5. * exp(-s.x * s.x / 2600.) + (n - 0.2) * 4.) * step(0., s.y);
  float wood = max(max(trunk, bough), max(arch, rock * 0.8));
  float skin = 0.8 + 0.2 * smoothstep(0.3, 0.7, vnoise(s * 0.07 + 9.));
  return vec2(max(crown * skin, wood), wood * (1. - crown * 0.75));
}
void main(){
  vec3 d = normalize(vD + vec3(0., 1e-3, 0.));
  vec3 col = mix(uLow, uHigh, smoothstep(0.0, 0.85, d.y));
  // under the horizon the dome is the sky again, upside down, going to slate straight down: the water sheet
  // lies over it nearly clear at a glance, so the reflected tree stands in a reflected sky
  vec3 mir = mix(uLow, uHigh, smoothstep(0.0, 0.85, -d.y)) * 0.9;
  col = mix(col, mix(mir, uDeep, smoothstep(0.1, 0.5, -d.y)), smoothstep(0.0, -0.012, d.y));
  float fwd = smoothstep(0.08, 0.3, d.z) * smoothstep(-0.01, 0.02, d.y);
  vec2 dir = d.xy / max(d.z, 0.05);
  if (uRare > 0.002) {                      // two laps of light: twice the size, paler still, and off to starboard
    // of the first, so its trunk, a bough and a tier of its crown stand clear of the nearer tree; mirrored in the sea
    float fw2 = smoothstep(0.08, 0.3, d.z) * mix(0.5, 1., smoothstep(-0.004, 0.004, d.y)) * smoothstep(0.0, 0.012, abs(d.y));
    vec2 t = tree((vec2(-1., 1.) * (vec2(dir.x, abs(dir.y)) * uA + uOff) - vec2(74., 0.)) / uRk);
    col = mix(col, uCrown, fw2 * uRare * 0.78 * t.x * (1. - t.y));
    col = mix(col, uTree, fw2 * uRare * 0.7 * t.y);
  }
  if (uGhost > 0.002) {                     // the next time round, already waiting
    vec2 t = tree(dir * 86. + vec2(26., 10.));
    col = mix(col, uTree, fwd * uGhost * (0.1 * t.x + 0.05 * t.y));
  }
  gl_FragColor = vec4(col, 1.);
}`}));be.renderOrder=-10,be.frustumCulled=!1,I.add(be),await m.yield();const N=k.uniforms,V={nx:128,nz:320},fe=new Uint8Array(V.nx*V.nz*4);for(let e=0;e<V.nz;e++){for(let t=0;t<V.nx;t++){const a=Math.round(ye((U(-60+120*(t+.5)/V.nx,-80+300*(e+.5)/V.nz)+3)/13,0,1)*255),s=(e*V.nx+t)*4;fe[s]=fe[s+1]=fe[s+2]=a,fe[s+3]=255}e%32===31&&await m.yield()}const se=new h.DataTexture(fe,V.nx,V.nz,h.RGBAFormat);se.magFilter=se.minFilter=h.LinearFilter,se.generateMipmaps=!1,se.colorSpace=h.NoColorSpace,se.needsUpdate=!0;const Pe=Object.assign(h.UniformsUtils.clone(h.UniformsLib.fog),{uDeep:{value:He},uLow:{value:b(z.low)},uHigh:{value:b(z.high)},uRaft:{value:b(A.raft)},uRaft2:{value:b(A.raft2)},uTime:N.uTime,uRain:{value:z.rain},uShade:N.uShade,uB:{value:0},uPetals:{value:ye(Ke,.7,1.3)},uLane:{value:b(A.lane)},uHt:{value:se},uShore:{value:1}}),ue=new h.Mesh(new h.PlaneGeometry(18e3,18e3,96,96),new h.ShaderMaterial({uniforms:Pe,transparent:!0,depthWrite:!1,fog:!0,vertexShader:`#include <fog_pars_vertex>
varying vec3 vW;
void main(){ vW = (modelMatrix * vec4(position, 1.)).xyz; vec4 mvPosition = viewMatrix * vec4(vW, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:De+`#include <fog_pars_fragment>
uniform vec3 uDeep, uLow, uHigh, uRaft, uRaft2, uLane; uniform float uTime, uRain, uB, uPetals, uShore; uniform vec4 uShade[12]; uniform sampler2D uHt; varying vec3 vW;
// petal lanes: four long rafts combed along our course by a current we never see. They wander and braid, so
// from the air they are curved streaks that sweep from under the lens away toward the island
float lanes(vec2 p){
  float z = p.y, n = (vnoise(p * 0.035 + 3.) - 0.5) * 8. + (vnoise(p * 0.19 + 8.) - 0.5) * 3.2, acc = 0.;
  float mid = -10. + (z - 400.) * 0.045;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float c = mid + (fi - 1.5) * 36. + 16. * sin(z * (0.0118 + 0.0021 * fi) + fi * 2.4) + 5. * sin(z * 0.031 + fi * 1.7);
    float wd = 3.4 + 1.8 * sin(z * 0.017 + fi * 4.1);
    float gap = 0.6 + 0.4 * smoothstep(0.2, 0.6, vnoise(vec2(z * 0.009 + fi * 13., fi * 7.)));
    acc = max(acc, smoothstep(wd * 1.25, 0., abs(p.x - c) + n) * gap);
  }
  return acc * smoothstep(210., 300., z) * (1. - smoothstep(1500., 1560., z));
}
// one family of rings: cells of size c, a drop every per seconds in a share of them, growing to rmax
float rings(vec2 p, float c, float per, float rmax, float share, float wid){
  vec2 g = p / c, id = floor(g); float h = hash21(id), h2 = hash21(id + 31.7);
  vec2 o = (id + 0.25 + 0.5 * vec2(h, h2)) * c;
  float age = fract(uTime / per + h * 7.), r = length(p - o);
  float k = smoothstep(wid, 0., abs(r - age * rmax)) + 0.5 * smoothstep(wid, 0., abs(r - age * rmax * 0.6));
  return k * (1. - age) * (1. - age) * step(1. - share, h2);
}
void main(){
  vec3 v = cameraPosition - vW; float dist = length(v); v /= max(dist, 1e-3);
  vec2 p = vW.xz; float near = 1. - smoothstep(60., 260., dist);
  float r1 = vnoise(p * 0.3 + uTime * vec2(0.11, 0.07)), r2 = vnoise(p * 1.9 - uTime * vec2(0.23, 0.15));
  float r3 = vnoise(vec2(p.x * 0.05 + uTime * 0.05, p.y * 0.4 - uTime * 0.3));
  float rip = (r1 - 0.5) + 0.45 * (r2 - 0.5) * near + 0.8 * (r3 - 0.5);
  float ring = rings(p, 9., 5., 3.4, 0.5, 0.16) * near + rings(p + 4.3, 5., 3.6, 2.2, 0.35, 0.12) * near;
  ring += uRain * (rings(p, 1.1, 1.3, 0.55, 1., 0.07) + rings(p + 0.6, 0.7, 0.9, 0.34, 0.8, 0.05)) * (1. - smoothstep(30., 150., dist));
  ring += uRain * 0.8 * rings(p + 2.1, 3.4, 1.5, 1.7, 0.9, 0.3) * smoothstep(20., 70., dist) * (1. - smoothstep(160., 420., dist));
  // rain takes the mirror off the sea: a matte, stippled skin out to the middle distance, in drifting squalls
  float squall = uRain * (0.45 + 0.55 * vnoise(p * 0.013 + uTime * vec2(0.05, 0.11)));
  float stip = step(0.74, vnoise(vec2(p.x * 2.3, p.y * 0.55) + uTime * vec2(1.3, 2.9))) * smoothstep(12., 80., dist) * (1. - smoothstep(280., 620., dist)) * squall;
  float f = 1. - clamp(abs(v.y) + rip * 0.15 + ring * 0.16 + squall * 0.045, 0., 1.); f = f * f * f;
  // the island's own height, baked: its shallows take the mirror off too, so the shore is soft
  vec2 hq = vec2(mix(p.x, -p.x, uB), p.y - uB * ${ee.toFixed(1)});
  float hI = mix(-3., texture2D(uHt, clamp((hq - vec2(-60., -80.)) / vec2(120., 300.), 0., 1.)).r * 13. - 3., uShore);
  float shal = smoothstep(-2.55, 0.1, hI + (r2 - 0.5) * 0.6 + (r1 - 0.5) * 0.5), rim = smoothstep(-1.5, -0.85, hI + (r1 - 0.5) * 0.7) * (1. - smoothstep(-0.4, -0.12, hI));
  // the tree's shade lies on the water too (island A, or island B once we are across)
  vec3 q = vec3(mix(p.x, -p.x, uB), 0., p.y - uB * ${ee.toFixed(1)}); float o = 0.;
  for (int i = 0; i < 12; i++) { vec4 s = uShade[i]; vec2 dd = (q.xz - s.xz) / max(s.w, 1.); o += smoothstep(-2., 14., s.y) * exp(-dot(dd, dd) * 1.5); }
  float shade = mix(1., 0.5, clamp(o * 0.85, 0., 1.));
  vec3 skyc = mix(uLow, uHigh, 0.25) * 0.9;
  vec3 col = mix(uDeep * (0.8 + 0.3 * r1 + 0.25 * r3), skyc, f) + ring * 0.12 * uLow + uRain * 0.03 * uLow * (1. - near) + stip * 0.085 * uLow;
  float alpha = mix(0.62, 0.2, f) + ring * 0.12 + (r3 - 0.5) * 0.3 + (r1 - 0.5) * 0.12 + stip * 0.2 + squall * 0.1;   // ripples break the mirror
  // wet shallows: darker, less clear, so the rock goes under without an edge
  col = mix(col, mix(uDeep, skyc, 0.3) * (0.62 + 0.3 * r2) + skyc * 0.12 * f, shal * shal * 0.5); alpha = mix(alpha, 0.94, shal * shal);
  // petals: streaks along a slow warped current, each petal an oval in its own 0.4 m cell
  // (the current wanders: streaks lie across our course at an angle and bend, never straight down it)
  vec2 w = p + 26. * vec2(vnoise(p * 0.011), vnoise(p * 0.011 + 7.3)) + 110. * vec2(vnoise(p * 0.0034 + 2.), vnoise(p * 0.0034 + 9.1));
  w = vec2(0.86 * w.x + 0.51 * w.y, -0.51 * w.x + 0.86 * w.y);
  float band = vnoise(vec2(w.x * 0.075, w.y * 0.0065) + 5.) * 0.65 + vnoise(vec2(w.x * 0.21, w.y * 0.017) + 11.) * 0.35;
  float isl = exp(-length(vec2(p.x, min(p.y + 40., 0.) + max(p.y - 180., 0.)) * vec2(1., 0.6)) / 150.) + exp(-length(vec2(p.x, min(p.y - 1540., 0.) + max(p.y - 1780., 0.)) * vec2(1., 0.6)) / 150.);
  float lane = lanes(p);
  float amt = (max(smoothstep(0.44, 0.66, band - 0.12 * isl) * 0.5, lane) + 0.035 + 0.22 * isl + rim * (0.35 + 0.6 * r1)) * uPetals;
  vec2 g = (p + 1.6 * vec2(vnoise(p * 0.37 + uTime * 0.02), vnoise(p * 0.37 + 3.1)) + 0.5 * vec2(vnoise(p * 1.3), vnoise(p * 1.3 + 8.))) / 0.42, id = floor(g), fr = fract(g) - 0.5;
  float h = hash21(id); fr += (vec2(hash21(id + 3.), hash21(id + 9.)) - 0.5) * 0.5;
  float a = h * 6.283 + uTime * 0.12 * (h - 0.5), ca = cos(a), sa = sin(a);
  vec2 e = vec2(ca * fr.x + sa * fr.y, -sa * fr.x + ca * fr.y) * vec2(1., 1.5 + 0.8 * fract(h * 5.7));
  float one = smoothstep(0.3, 0.22, length(e) * (0.8 + 0.6 * fract(h * 11.3))) * step(fract(h * 17.3), amt);
  float fw = max(fwidth(g.x), fwidth(g.y)), blur = smoothstep(0.3, 1.1, fw);
  float cover = mix(one, min(amt * (0.62 + 0.42 * vnoise(p * vec2(0.33, 0.12) + 4.)), 0.88), blur);     // rafts in clumps, not paint
  vec3 pc = mix(uRaft, uRaft2, step(0.62, fract(h * 7.3)) * (1. - blur) + 0.3 * blur) * (0.74 + 0.2 * fract(h * 3.1)) * uLow;
  pc = mix(pc, uLane * (0.8 + 0.25 * r1) * uLow, blur * 0.85 + 0.25 * (1. - blur) * step(fract(h * 23.7), 0.5));    // massed petals show their colour
  // the pearl comes and goes on the slow swell: dapples of sky that drift
  float dap = vnoise(vec2(p.x * 0.045, p.y * 0.2) + uTime * vec2(0.08, 0.3)) * vnoise(vec2(p.x * 0.1, p.y * 0.46) - uTime * vec2(0.12, 0.36));
  float dk = smoothstep(0.16, 0.62, dap) * (1. - smoothstep(250., 700., dist));
  col = mix(col, skyc, dk * 0.24); alpha += dk * 0.05;
  // cat's paws: far off, where the water is a mirror, a breath of air shows as a darker band crossing it
  float gust = smoothstep(0.42, 0.68, vnoise(vec2(p.x * 0.011 + uTime * 0.1, p.y * 0.028 - uTime * 0.36)) * 0.7 + 0.3 * vnoise(p * 0.09 + uTime * vec2(0.3, -0.5)));
  float gk = gust * (0.35 + 0.65 * f) * smoothstep(40., 160., dist) * (1. - smoothstep(800., 1500., dist));
  col = mix(col, uDeep * 1.1, gk * 0.85); alpha += gk * 0.36;
  col = mix(col, pc, cover); alpha = mix(alpha, 0.96, cover);
  col *= shade;
  gl_FragColor = vec4(col, clamp(alpha, 0., 1.));
  #include <fog_fragment>
}`}));ue.rotation.x=-Math.PI/2,ue.position.set(0,0,ee/2),ue.renderOrder=2,ue.frustumCulled=!1,I.add(ue),await m.yield();const R={pos:[],q:[],k:[],idx:[],n:0},X=(e,t,a,s,o,c,r,l,i,u,f)=>(R.pos.push(e,t,a),R.q.push(s,o,c,r),R.k.push(l,i,u,f),R.n++),ne=(e,t,a,s,o,c,r)=>{const l=R.n,i=e.length-1;for(let u=0;u<=i;u++){const f=e[u],p=u/i;X(f.x-t.x*a,f.y-t.y*a,f.z-t.z*a,-.5,p,0,s,o,c*p*p,r,0),X(f.x+t.x*a,f.y+t.y*a,f.z+t.z*a,.5,p,0,s,o,c*p*p,r,0)}for(let u=0;u<i;u++){const f=l+u*2;R.idx.push(f,f+1,f+2,f+1,f+3,f+2)}},Ie=(e,t,a,s,o,c,r,l)=>{const i=X(e,t,a,-.5,0,s,o,3,c,r,l);X(e,t,a,.5,0,s,o,3,c,r,l),X(e,t,a,.5,1,s,o,3,c,r,l),X(e,t,a,-.5,1,s,o,3,c,r,l),R.idx.push(i,i+1,i+2,i,i+2,i+3)},ie=(e,t,a,s)=>E.distanceTo(e,t,a)>s&&E.distanceTo(-e,t,a+ee)>s,ke=(e,t)=>Math.hypot(e-oe.pavilion.x,t-oe.pavilion.z)<7.5||Math.hypot(e-oe.jetty.x,t-oe.jetty.z)<4,n=T.fork?T.fork("growths"):T,Q=y(),F=[y(),y(),y(),y()],Ue=Math.round(1250*G*ye(Ke,.8,1.2));for(let e=0,t=0,a=0;t<Ue&&a<Ue*12;a++){const s=n()<.6,o=n()*P,c=s?9+n()*40:0,r=s?Math.cos(o)*c*.8:n.range(-40,40),l=s?Math.sin(o)*c:n.range(-60,200),i=U(r,l);if(i<.7||Math.hypot(r,l)<8.5||ke(r,l)||!ie(r,i+1.2,l,6.3))continue;const u=n.range(.8,1.7)*(s?1.15:.9),f=5+(n()<.5?1:0),p=n()*P,v=n();for(let M=0;M<f;M++){const g=p+M/f*P+n.range(-.3,.3),w=Math.cos(g),x=Math.sin(g),d=u*n.range(.8,1.15),C=n.range(.55,.9);F[0].set(r,i-.05,l),F[1].set(r+w*d*.3,i+d*.42*C,l+x*d*.3),F[2].set(r+w*d*.68,i+d*.56*C,l+x*d*.68),F[3].set(r+w*d,i+d*.36*C,l+x*d),Q.set(-x,.12,w),ne(F,Q,d*.2,n(),0,.22,v)}t++,t%120===0&&await m.yield()}await m.yield();const Ve=(e,t,a,s)=>{for(let o=0,c=0;o<e&&c<e*40;c++){const r=n.range(-66,206),l=n.range(-48,48),i=U(l,r);i<t||i>a||ke(l,r)||!ie(l,Math.max(i,0)+1.5,r,6.5)||(s(l,Math.max(i,-.6),r),o++)}};Ve(Math.round(300*G),.2,1.1,(e,t,a)=>{const s=n()*P,o=n.range(.8,1.2);F[0].set(e,t-.05,a),F[1].set(e,t+o*.5,a),F[2].set(e,t+o,a),Q.set(Math.cos(s),0,Math.sin(s)),ne(F.slice(0,3),Q,.34,n(),1,.1,n())}),await m.yield(),Ve(Math.round(520*G),-.75,.12,(e,t,a)=>{for(let s=0;s<2;s++){const o=n()*P,c=n.range(1.5,2.7),r=n.range(-.25,.25);F[0].set(e,t-.1,a),F[1].set(e+r*.3,t+c*.5,a),F[2].set(e+r,t+c,a+r*.5),Q.set(Math.cos(o),0,Math.sin(o)),ne(F.slice(0,3),Q,.55,n(),2,.35,n())}}),await m.yield();const We=(e,t,a,s)=>{F[0].copy(e),F[1].lerpVectors(e,t,.5),F[1].y+=.06*e.distanceTo(t),F[2].copy(t),Q.set(1,0,0),ne(F.slice(0,3),Q,a,s,5,.3,0),Q.set(0,0,1),ne(F.slice(0,3),Q,a,s,5,.3,0)},Ne=y(),Y=y(),he=y();for(let e=0,t=0;e<14&&t<600;t++){const a=n.range(96,196),s=n.range(-30,30),o=U(s,a),c=n.range(3.2,6.2);if(o<1||ke(s,a)||!ie(s,o+c*.7,a,6.5+c*.55))continue;const r=n.range(-.5,.5),l=n()*P,i=.07+c*.012,u=3+(n()<.6?1:0);Ne.set(s,o-.1,a),Y.set(s+r*.35,o+c*.42,a+r*.2),We(Ne,Y,i,n());for(let f=0;f<u;f++){const p=l+f/u*P+n.range(-.4,.4),v=c*n.range(.3,.5),M=c*(f===0?1:n.range(.62,.92));he.set(Y.x+Math.cos(p)*v,o+M,Y.z+Math.sin(p)*v),We(Y,he,i*.55,n());const g=8+Math.round(n()*3);for(let w=0;w<g;w++){const x=n(),d=c*.2*Math.sqrt(n()),C=n()*P;Ie(H(Y.x,he.x,.72+.34*x)+Math.cos(C)*d,H(Y.y,he.y,.72+.34*x)+n.range(-.25,.3)*c*.1,H(Y.z,he.z,.72+.34*x)+Math.sin(C)*d,n.range(.42,.68)*(.75+c*.07),n(),.2,.5+.5*x,Math.floor(n()*4));for(let q=1;q<=4;q++)R.k[(R.n-q)*4]=4}}e++}await m.yield();const ct=(e,t,a,s)=>{const o=U(e,t);if(o<.5||!ie(e,o+1.2,t,6.3))return;const c=5,r=n()*P,l=n();for(let i=0;i<c;i++){const u=r+i/c*P+n.range(-.3,.3),f=Math.cos(u),p=Math.sin(u),v=a*n.range(.8,1.15),M=s*n.range(.8,1.1);F[0].set(e,o-.05,t),F[1].set(e+f*v*.3,o+v*.42*M,t+p*v*.3),F[2].set(e+f*v*.68,o+v*.56*M,t+p*v*.68),F[3].set(e+f*v,o+v*.36*M,t+p*v),Q.set(-p,.12,f),ne(F,Q,v*.2,n(),0,.22,l)}},Ye=Math.round(200*Math.max(G,.75)),Te=m.noise.n3;for(let e=0,t=0;e<Ye&&t<Ye*14;t++){const a=n()<.4,s=n()*P,o=10+n()*34,c=a?Math.cos(s)*o*.85:n.range(-34,34),r=a?Math.sin(s)*o:n.range(-55,196),l=U(c,r),i=n.range(.7,2.3)*(n()<.15?1.6:1),u=i*n.range(.45,.8);if(l<.5||Math.hypot(c,r)<11||ke(c,r)||!ie(c,l+u*1.3,r,6.4+i*1.3))continue;const f=R.n,p=n(),v=n.range(.8,1.25),M=n()*P,g=Math.cos(M),w=Math.sin(M),x=i>1.15&&At(p*7.3)>.45?1:0,d=x?13:10,C=x?5:4,q=x?.3:.1,j=p*91;for(let S=0;S<=C;S++){const O=S/C*Math.PI*.5,_=Math.cos(O),D=Math.sin(O);for(let L=0;L<d;L++){const we=L/d*P,Ae=Math.cos(we)*_,ze=Math.sin(we)*_,Oe=1+q*(Te(Ae*1.3+j,D*1.3,ze*1.3)+.5*Te(Ae*3.1,D*3.1+j,ze*3.1))+(x?.12*Math.sign(Te(Ae*.9,j,ze*.9)):0),ot=Ae*i*v*Oe,at=ze*i/v*Oe,_e=ot*g-at*w,Le=ot*w+at*g,Ge=Math.hypot(_e/i,D,Le/i)||1;X(c+_e,l-.25+D*u*Oe+(S===0?-.6:0),r+Le,_e/i/Ge,Le/i/Ge,0,p,6,x,S/C,D/Ge)}}for(let S=0;S<C;S++)for(let O=0;O<d;O++){const _=f+S*d+O,D=f+S*d+(O+1)%d;R.idx.push(_,D,_+d,D,D+d,_+d)}if(i>1.1)for(let S=0,O=x?3:2;S<O;S++){const _=n()*P;ct(c+Math.cos(_)*i*1.05,r+Math.sin(_)*i*1.05,n.range(.9,1.5),.85)}e++,e%50===0&&await m.yield()}await m.yield();const Be=N.uShade.value.filter(e=>e.y>0),Ze=Math.round(340*G);for(let e=0,t=0;e<Ze&&t<Ze*10;t++){const a=Be[Math.floor(n()*Be.length)],s=a===Be[0],o=n()*P,c=Math.sqrt(n())*a.w*(s?1.15:.8),r=a.x+Math.cos(o)*c,l=a.z+Math.sin(o)*c,i=Math.hypot(r,l);if(i<13||i>60)continue;const u=s?31+n()*7+(i<30?6:0):Math.max(a.y-3-n()*5,29),f=n.range(7,17),p=Math.max(U(r,l),0)+9,v=n.range(.75,1.15),M=n();let g=u,w=0;for(;g>u-f&&g>p&&w<16;){const x=1-.5*(u-g)/f,d=v*x;if(!ie(r,g,l,7.2+d))break;Ie(r+n.range(-.3,.3),g,l+n.range(-.3,.3),d,M,(u-g)/17,.5+.5*n(),Math.floor(n()*4)),g-=d*.95,w++}w>0&&e++,e%40===0&&await m.yield()}await m.yield();const pe=new h.BufferGeometry;pe.setAttribute("position",new h.Float32BufferAttribute(R.pos,3)),pe.setAttribute("aQ",new h.Float32BufferAttribute(R.q,4)),pe.setAttribute("aK",new h.Float32BufferAttribute(R.k,4)),pe.setIndex(R.idx),await m.yield();const ft=k.groups.A.children.find(e=>e.name==="blossom").material.uniforms.uAtlas.value,ut=k.glsl.COMMON+k.glsl.FOG_V+`
attribute vec4 aQ, aK; uniform float uScale; varying vec3 vP; varying vec4 vQ, vK;
void main(){
  vec3 p = position; float sw = aK.y, ph = uTime * 1.25 + aQ.w * 6.283 + p.x * 0.21 + p.z * 0.17;
  if (aK.x > 2.5 && aK.x < 3.5) {      // hanging sprays ride their bough and swing a little below it
    p += swayOf(p); p.xz += sw * vec2(sin(ph * 0.55), cos(ph * 0.43 + 1.)) * 0.8; p.y += 0.06 * sin(ph * 2.1);
  } else p.xz += sw * vec2(sin(ph), cos(ph * 0.83)) * 0.16 + sw * sin(uTime * 0.7 + p.x * 0.05) * vec2(0.12, 0.05);
  vP = p; vQ = aQ; vK = aK;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  mvPosition.xy += vec2(aQ.x, aQ.y - 0.5) * 2. * aQ.z * uScale;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ht=k.glsl.COMMON+k.glsl.FOG_F+`
uniform sampler2D uAtlas; uniform vec3 uPetalA, uPetalB; uniform vec4 uLeaf, uFern;
varying vec3 vP; varying vec4 vQ, vK;
void main(){
  float kind = vK.x, u = vQ.x * 2., v = vQ.y, tone = vK.z, seed = vQ.w, a = 1.;
  vec3 col;
  float shadeK = 0.8;
  // the atlas is read before any branch, so its derivatives are defined on every path
  vec2 uv = (vec2(mod(vK.w, 2.), floor(vK.w * 0.5)) + vec2(vQ.x + 0.5, vQ.y)) * 0.5;
  float texels = fwidth(uv.x) * 1024.;
  vec4 t = texture2D(uAtlas, uv);
  vec3 nFlat = normalize(cross(dFdx(vP), dFdy(vP)) + vec3(0., 1e-6, 0.)); if (nFlat.y < 0.) nFlat = -nFlat;   // facets, for boulders
  if (kind < 0.5) {                    // fern frond: a tapering blade cut into pinnae, pale midrib
    float env = smoothstep(0., 0.1, v) * (1. - v * v), saw = abs(fract(v * 15. + seed) - 0.5) * 2.;
    float w = env * (0.22 + 0.78 * saw);
    a = step(abs(u), max(w, 0.07 * (1. - v)));
    col = mix(vec3(0.085, 0.2, 0.12), mix(vec3(0.3, 0.5, 0.26), uMint * 0.7, 0.35), 0.25 + 0.5 * tone + 0.25 * abs(u));
    col = mix(col, uFern.rgb, uFern.a * (0.5 + 0.5 * tone));
    col *= 0.75 + 0.5 * v; col = mix(col, col * 1.5, smoothstep(0.09, 0.0, abs(u)));
  } else if (kind < 1.5) {             // iris: three sword leaves and one pale flower with a gold throat
    float bu = u * 1.5, lean = 0.5 * v * v;
    float b1 = abs(bu - lean) , b2 = abs(bu + 0.8 + lean * 0.8), b3 = abs(bu - 0.8 + lean * 0.3);
    float wl = 0.2 * (1. - v / 0.78), leaf = step(min(b1, min(b2, b3)), wl) * step(v, 0.78);
    vec2 d = vec2(u + 0.1, (v - 0.84) * 3.4);
    float fall = min(length((d - vec2(-0.42, -0.1)) * vec2(1.6, 2.6)), length((d - vec2(0.42, -0.1)) * vec2(1.6, 2.6)));
    float fl = step(min(fall, length((d - vec2(0., 0.16)) * vec2(2.6, 1.7))), 0.5) * step(0.3, tone);
    float stem = step(abs(u + 0.1), 0.045) * step(v, 0.84) * step(0.3, tone);
    a = max(max(leaf, fl), stem);
    col = mix(vec3(0.13, 0.27, 0.17), vec3(0.3, 0.46, 0.3), v);
    vec3 pet = mix(uPearl * 0.86, vec3(0.62, 0.6, 0.86), 0.25 + 0.3 * tone);
    col = mix(col, mix(pet, uGold * 0.7, smoothstep(0.3, 0.0, length(d))), fl);
  } else if (kind < 2.5) {             // reeds: a few leaning blades, dark seed heads
    float g = u * 1.6 + seed * 5., id = floor(g), f = fract(g), h = hash21(vec2(id, seed * 91.));
    float top = 0.55 + 0.45 * h, c = 0.5 + 0.3 * (h - 0.5) + 0.22 * sin(v * 2.2 + h * 6.);
    float wb = 0.1 * (1. - 0.8 * v / top) + 0.09 * smoothstep(0.8, 0.9, v / top) * step(0.5, h);
    a = step(abs(f - c), wb) * step(v, top);
    col = mix(vec3(0.16, 0.25, 0.2), vec3(0.5, 0.56, 0.38), v / top);
    col = mix(col, vec3(0.2, 0.15, 0.11), smoothstep(0.8, 0.86, v / top) * step(0.5, h));
    col = mix(col, uFern.rgb * 1.2, uFern.a * 0.6);
    shadeK = 0.6;
  } else if (kind < 4.5) {             // a spray of blossom from the set's own atlas (kind 4: a sapling's, kept open)
    float airy = step(3.5, kind);
    float soft = clamp(max((texels - mix(1.8, 9., airy)) / mix(3.5, 26., airy), uWash * 1.5), 0., 1.);
    vec2 qc = vec2(vQ.x, vQ.y - 0.5);
    float disc = smoothstep(1.0, 0.62, length(qc) * 2. + (vnoise(qc * 5. + seed * 30.) - 0.5) * 0.5);
    disc *= mix(1., smoothstep(0.26, 0.4, vnoise(qc * 6.5 + seed * 50.)), airy);
    a = mix(t.a, disc, soft);
    float mott = vnoise(qc * 9. + seed * 20.), tn = mix(t.r, 0.25 + 0.6 * mott, soft), depth = mix(mix(0.55, 1., t.b), 0.74 + 0.26 * mott, soft);
    col = mix(uPetalA * 0.86, uPetalB * 0.8, tn * tn * 0.85 + 0.1);
    col = mix(col, uGold * 0.62, t.g * (1. - soft) * 0.75);
    col = mix(col, uLeaf.rgb * (0.6 + 0.5 * mott), step(0.001, uLeaf.a) * mix(step(t.b, 0.62), smoothstep(0.45, 0.6, mott), soft) * min(uLeaf.a * 2.6, 1.));
    // lit from the pearl all round and glowing where the light comes through
    col *= depth * mix(0.66, 1.0, tone) * mix(0.86, 1.06, vQ.y) * 1.02;
    col = mix(col, uPetalA * 0.82 * depth, 0.3);
    shadeK = 0.22;
  } else if (kind > 5.5) {             // a cushion-moss mound or a mossed boulder
    float c3 = vnoise(vP.xz * 21. + vP.y * 9.);
    vec3 nn = normalize(vec3(vQ.x, vK.w + 0.02, vQ.y) + (vec3(c3, 0., vnoise(vP.zx * 19. + 4.)) - vec3(0.5, 0., 0.5)) * 0.35);   // cushions, not plastic
    float bld = vK.y; nn = normalize(mix(nn, nFlat, bld * 0.8));
    float c1 = vnoise(vP.xz * 2.6 + seed * 9.), c2 = vnoise(vP.xz * 9. + vP.y * 5.), bare = smoothstep(0.55, 0.75, mix(fract(seed * 7.3), 0.92, bld) + 0.35 * c1 - mix(0.5, 0.62, bld) * nn.y);
    vec3 moss = mix(vec3(0.12, 0.22, 0.11), mix(vec3(0.27, 0.42, 0.2), uMint * 0.66, 0.3 + 0.5 * fract(seed * 3.7)), smoothstep(0.2, 0.75, c1) * (0.7 + 0.3 * c2));
    vec3 rock = mix(uSlate * 0.5, mix(uSlate, uPearl, 0.35) * 0.72, c1) * (0.75 + 0.5 * c2);     // pale lichened stone, never a dark hole
    // a boulder is stone: strata, pale lichen in blots, a few ochre crusts; moss only where it lies flat
    rock *= mix(1., 0.82 + 0.36 * smoothstep(0.35, 0.65, fract(vP.y * 1.9 + c1 * 1.4 + seed * 5.)), bld);
    rock = mix(rock, mix(uMint, uPearl, 0.5) * 0.66, smoothstep(0.5, 0.64, vnoise(vP.xz * 2.7 + vP.y * 3.1 + seed * 40.)) * 0.75 * bld);
    rock = mix(rock, uGold * 0.55, step(0.83, vnoise(vP.xz * 6.1 + vP.y * 5.3 + 9.)) * 0.6 * bld);
    col = mix(moss, rock, bare);
    vec2 pcell = vP.xz * 5., pf = fract(pcell) - 0.5; float ph6 = hash21(floor(pcell));
    col *= 0.78 + 0.44 * c3;
    col = mix(col, mix(uPink, uWhite, 0.4) * 0.8, step(0.9, ph6) * step(length(pf * vec2(1., 1.8) + (ph6 - 0.95) * 3.), 0.3) * smoothstep(0.5, 0.9, nn.y) * 0.9);      // a few fallen petals
    col *= mix(uBounce, uSky, clamp(nn.y * 0.6 + 0.4, 0., 1.)) / max(mix(uBounce, uSky, 0.8), vec3(1e-3)) * (0.74 + 0.4 * smoothstep(0.0, 0.6, tone));   // round, dark at the foot
    shadeK = 0.85;
  } else {                             // sapling stem
    col = mix(uChar, vec3(0.2, 0.17, 0.15), 0.5) * (0.9 + 0.6 * vnoise(vec2(u * 3., v * 30.)));
  }
  if (a < 0.5) discard;
  col *= mix(uBounce, uSky, 0.8) * mix(1., canopy(vP), shadeK);
  if (kind < 2.5) col *= mix(0.55, 1., smoothstep(0., 0.5, v));          // rooted in their own shade
  if (kind > 2.5 && kind < 4.5) col = lessWash(col, 0.62);
${k.glsl.FINISH_Y}}`,pt=A.name==="autumn"?new h.Vector4(.42,.25,.1,.55):new h.Vector4(0,0,0,0);for(const e of["A","FAR"]){const t=new h.Mesh(pe,k.makeSetMaterial(e,ut,ht,{side:h.DoubleSide,a2c:!0,uniforms:{uAtlas:{value:ft},uFern:{value:pt}}}));t.name="growths",t.frustumCulled=!1,k.groups[e].add(t),await m.yield()}const B={pos:[],col:[],side:[],bob:[],idx:[],n:0},re=(e,t,a,s,o,c,r,l,i)=>(B.pos.push(e,t,a),B.col.push(s.r,s.g,s.b),B.side.push(o,c,r),B.bob.push(l,i),B.n++),Fe=b(A.pal[4]).lerp(b("#6b5a48"),.45),vt=Fe.clone().lerp(b(z.low),.35),$e=b("#cfc7b4"),dt=b("#f2efe6"),mt=b(A.pal[4]).multiplyScalar(1.4),Je=(e,t,a,s,o,c)=>{const r=B.n,l=[[-3.2,Fe,c*1.1],[0,Fe.clone().multiplyScalar(.55),c*1.05],[.5,Fe,c],[o,vt,c*.7]];for(const[i,u,f]of l)for(let p=0;p<6;p++){const v=p/6*P;re(e+Math.cos(v)*f+a*i,i,t+Math.sin(v)*f+s*i,u,Math.cos(v),Math.sin(v),.5,0,0)}for(let i=0;i<l.length-1;i++)for(let u=0;u<6;u++){const f=r+i*6+u,p=r+i*6+(u+1)%6;B.idx.push(f,p,f+6,p,p+6,f+6)}},Z=T.fork("stakes"),Ee=y(),ve=y(),Xe=[],Re=E.length*.025,et=E.length*.6+30;for(let e=et-Math.floor((et-250)/Re)*Re;e<E.length-62;e+=Re){E.posAtDist(e,Ee),E.tangentAtDist(e,ve);const t=Math.hypot(ve.x,ve.z)||1,a=ve.x/t,s=ve.z/t,o=Ee.x-s*9,c=Ee.z+a*9;if(U(o,c)>-1.5||U(-o,c-ee)>-1.5)continue;const r=Z.range(5.5,7.5),l=o-a*r,i=c-s*r,u=o+a*r,f=c+s*r;Je(l,i,Z.range(-.05,.05),Z.range(-.05,.05),Z.range(3.7,4.5),.15),Je(u,f,Z.range(-.05,.05),Z.range(-.05,.05),Z.range(3.7,4.5),.15),Xe.push([o,c]),Xe.length%8===0&&await m.yield();const p=B.n,v=14,M=Z()*P;for(let g=0;g<=v;g++){const w=g/v,x=Math.abs(2*w-1),d=.04+.9*x*x*x*x,C=1-x*x,q=H(l,u,w),j=H(i,f,w);if(re(q,d,j,$e,-s,a,.035,C,M+w*9),re(q,d,j,$e,s,-a,.035,C,M+w*9),g<v){const S=p+g*2;B.idx.push(S,S+1,S+2,S+1,S+3,S+2)}}for(let g=1;g<8;g++){const w=g/8,x=H(l,u,w),d=H(i,f,w),C=g%2?dt:mt,q=B.n,j=1-Math.abs(2*w-1)**2,S=M+w*9,O=re(x,.3,d,C,0,0,0,j,S),_=re(x,-.14,d,C.clone().multiplyScalar(.5),0,0,0,j,S);for(let D=0;D<6;D++){const L=D/6*P;re(x+Math.cos(L)*.2,.08,d+Math.sin(L)*.2,C,Math.cos(L),Math.sin(L),.5,j,S)}for(let D=0;D<6;D++){const L=q+2+D,we=q+2+(D+1)%6;B.idx.push(O,we,L,_,L,we)}}}const le=new h.BufferGeometry;le.setAttribute("position",new h.Float32BufferAttribute(B.pos,3)),le.setAttribute("color",new h.Float32BufferAttribute(B.col,3)),le.setAttribute("aSide",new h.Float32BufferAttribute(B.side,3)),le.setAttribute("aBob",new h.Float32BufferAttribute(B.bob,2)),le.setIndex(B.idx);const gt=Object.assign(h.UniformsUtils.clone(h.UniformsLib.fog),{uTime:N.uTime,uSky:N.uSky,uBounce:N.uBounce,uRes:N.uRes}),Qe=new h.Mesh(le,new h.ShaderMaterial({uniforms:gt,fog:!0,side:h.DoubleSide,vertexShader:`#include <fog_pars_vertex>
attribute vec3 color, aSide; attribute vec2 aBob; uniform float uTime; uniform vec2 uRes; varying vec3 vC; varying float vUp, vY;
void main(){
  vec3 p = position; p.y += aBob.x * 0.05 * sin(uTime * 1.7 + aBob.y);
  vec4 mv0 = modelViewMatrix * vec4(p, 1.);
  // poles and lines never thinner than about 1.6 pixels: widen along their own outward direction
  float px = 2. / (projectionMatrix[1][1] * uRes.y) * max(-mv0.z, 0.1) * 1.6;
  p.xz += aSide.xy * (aSide.z > 0.25 ? max(px * 0.5 - 0.12, 0.) : max(aSide.z, px * 0.5));
  vC = color; vUp = aSide.z > 0.25 ? 0.6 : 1.; vY = p.y;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`#include <fog_pars_fragment>
uniform vec3 uSky, uBounce; varying vec3 vC; varying float vUp, vY;
void main(){
  vec3 col = vC * mix(uBounce, uSky, vUp) * (vY < 0. ? 0.75 : 1.);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`}));Qe.frustumCulled=!1,Qe.renderOrder=1,I.add(Qe),await m.yield();const Me={value:0},de=Ce.fxGroup();I.add(de.object);const Dt=de.add(Ce.makeMist({rng:T.fork("mist"),time:Me,count:Math.round(64*G),area:[1100,3,1100],center:[0,2.2,0],size:[70,170],color:z.low,opacity:z.rain?.28:.22,drift:[1.4,0,.6],flatten:.13,follow:!0}));await m.yield();const Pt=de.add(Ce.makeParticles({rng:T.fork("drift"),preset:A.name==="autumn"?"leaves":"petals",time:Me,count:Math.round(900*G),box:[50,34,50],colors:[A.raft,A.raft2,A.pal[1]],velocity:[.5,-1.1,.25],size:[.2,.36],lightDir:[0,1,0],intensity:1.25}));await m.yield();let xt=null;z.rain&&(xt=de.add(Ce.makeParticles({rng:T.fork("rain"),preset:"rain",time:Me,count:Math.round(5200*G),color:"#f4f8f9",opacity:.62,velocity:[6.5,-16,2.5]})),await m.yield());const tt=st.makeFauna(I,{light:{sunDir:[.2,1,.1],sunColor:z.sky,sunIntensity:.9,sky:z.sky,skyIntensity:1.5,ground:A.pal[3],groundIntensity:.8}}),wt={body:"#D9A93C",belly:"#F0D488",wingC:"#3A3A36",tip:"#1E2224",head:"#C8962E",tailC:"#2C2F30"},yt=Math.max(12,Math.round(30*G));for(const[e,t,a]of[[-22,6,1],[22,ee-58,-1]])tt.add(st.makeFlock({rng:T.fork("finch"+a),species:"swifts",count:yt,size:1.3,speed:9,center:[e,17,t],radius:12,height:4,wobble:.6,direction:a,spread:[9,4,12],wander:[4,2.5,4,.9],flap:9,glide:.25,palette:wt}),{always:!0}),await m.yield();const K={pos:[],q:[],s:[],idx:[],n:0},ce=T.fork("banks"),Se=y(),me=y();for(let e=640,t=0;e<E.length-95;e+=ce.range(78,112),t++){E.posAtDist(e,Se),E.tangentAtDist(e,me);const a=Math.hypot(me.x,me.z)||1,s=me.z/a,o=-me.x/a,c=(t%2?1:-1)*ce.range(30,150),r=ce.range(340,640),l=ce.range(4.5,7.5)+6*$(1330,1450,Se.z),i=ce(),u=ce.range(-.2,.2),f=Se.x+s*c,p=Se.z+o*c,v=s*Math.cos(u)-o*Math.sin(u),M=s*Math.sin(u)+o*Math.cos(u),g=K.n;for(const[w,x]of[[-.5,-.45],[.5,-.45],[.5,1],[-.5,1]])K.pos.push(f+v*w*r,x*l,p+M*w*r),K.q.push(w,x),K.s.push(r,i,v,M),K.n++;K.idx.push(g,g+1,g+2,g,g+2,g+3)}const ge=new h.BufferGeometry;ge.setAttribute("position",new h.Float32BufferAttribute(K.pos,3)),ge.setAttribute("aQ",new h.Float32BufferAttribute(K.q,2)),ge.setAttribute("aS",new h.Float32BufferAttribute(K.s,4)),ge.setIndex(K.idx);const bt={uTime:N.uTime,uCol:{value:b(z.low).lerp(b("#ffffff"),.35)},uOp:{value:z.rain?.76:.7}},qe=new h.Mesh(ge,new h.ShaderMaterial({uniforms:bt,transparent:!0,depthWrite:!1,side:h.DoubleSide,fog:!1,vertexShader:`attribute vec2 aQ; attribute vec4 aS; uniform float uTime; varying vec2 vQ; varying vec3 vS; varying float vDist;
void main(){
  vec3 p = position; p.xz += aS.zw * 14. * sin(uTime * 0.05 + aS.y * 40.);          // the banks creep along themselves
  vQ = aQ; vS = vec3(aS.x, aS.y, p.y);
  vec4 mv = modelViewMatrix * vec4(p, 1.); vDist = length(mv.xyz);
  gl_Position = projectionMatrix * mv;
}`,fragmentShader:De+`uniform vec3 uCol; uniform float uTime, uOp; varying vec2 vQ; varying vec3 vS; varying float vDist;
void main(){
  float v = vQ.y < 0. ? -vQ.y / 0.5 : vQ.y, x = vQ.x * vS.x;
  float n = vnoise(vec2(x * 0.011 + vS.y * 31. + uTime * 0.035, v * 1.3 + vS.y * 9.)) * 0.6 + vnoise(vec2(x * 0.034 - uTime * 0.05, v * 3.1 + vS.y * 17.)) * 0.4;
  float top = 0.4 + 0.58 * n;                                                   // a ragged top: it stands taller in places
  float prof = 1. - clamp(v / max(top, 0.05), 0., 1.); prof = prof * prof * (3. - 2. * prof);
  float ends = smoothstep(0.5, 0.16, abs(vQ.x) + (n - 0.5) * 0.12);
  float a = uOp * prof * ends * (0.62 + 0.38 * smoothstep(0.3, 0.7, n)) * smoothstep(30., 170., vDist);     // (continuous across the waterline: its foot is never a line)
  gl_FragColor = vec4(uCol * (0.97 + 0.05 * n), a);
}`}));qe.frustumCulled=!1,qe.renderOrder=3,I.add(qe),await m.yield();const kt=y(),Ft=y(),xe=y(),Tt=new h.Vector2;return{scene:I,path:E,duration:44,pace:e=>H(H(.52,1.42,$(.05,.24,e)),.86,$(.6,.76,e)),camera:{fov:62,near:.5,far:9e3,lookAhead:30,sway:.5,bank:.6},pois:[{at:()=>kt.set(0,46*k.state.S,k.state.farZ),from:.07,to:.6,weight:.5},{at:()=>{const e=Math.max(k.state.farZ-xe.z,60);return Ft.set(.3*e,-.2*e,k.state.farZ)},from:.34,to:.88,weight:.55,fade:.25}],portal:{shape:"circle",radius:7,color:"#BFF3E6",glow:1,revealDistance:560},post:{exposure:1,bloom:{strength:.25,radius:.6,threshold:.92},grade:{saturation:.95,contrast:1.04,tint:"#ffffff",shadowTint:"#0b1215",vignette:.15,grain:0}},ride:"none",style:"none",update(e,t,a,s){k.setProgress(s),k.update(e,t,a),a.getWorldPosition(xe);const o=k.state;be.position.copy(xe),J.uTime.value=t,J.uA.value=o.a,J.uOff.value.set(xe.x/o.S,xe.y/o.S),J.uRare.value=rt?$(.02,.1,s)*(1-$(.62,.8,s)):0,J.uGhost.value=$(.86,.95,s),J.uRk.value=H(1.3,2,$(.2,.38,s)),Pe.uB.value=s<.3?0:1,Pe.uShore.value=s<.3?1:$(.66,.69,s),Me.value=t,de.update(e,t,a),tt.update(e,t,a,s)},dispose(){k.dispose()}}}};export{Rt as default};
