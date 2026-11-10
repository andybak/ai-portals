import*as f from"three";import{clamp as W,lerp as E,smoothstep as L}from"../kit/core.js";import"../kit/fx.js";import{makeShared as I,sharedUniforms as H,SBV_NOISE as _,SBV_LIGHT as j}from"./sledge-between-volcanoes-common.js";import{makeLavaFront as V}from"./sledge-between-volcanoes-lava.js";import{forksOf as A}from"./sledge-between-volcanoes-common.js";import{buildTravellers as O}from"./sledge-between-volcanoes-travellers.js";import{makePuffs as G}from"./sledge-between-volcanoes-ice.js";const q=a=>{const n=1-W(a,0,1);return .5*Math.pow(n,1.9)+.5*n},D=`
varying vec3 vW; varying vec3 vN; varying vec2 vPol;      // vPol: distance from the axis (m), angle
uniform vec3 uTop;
void main(){
  vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix)*normal);
  vPol = vec2(length(position.xz - uTop.xz), atan(position.z - uTop.z, position.x - uTop.x));
  gl_Position = projectionMatrix*viewMatrix*w;
}`,U=`
precision highp float;
varying vec3 vW; varying vec3 vN; varying vec2 vPol;
uniform vec3 uTop, uRock, uSnow, uLava; uniform vec4 uKind;      // x: snow cover 0..1, y: lava threads 0..1, z: crater rim radius, w: foot radius
uniform vec3 uThread;                                              // three gully angles
uniform float uTime, uHaze, uRich; uniform vec3 uHazeCol;      // uRich 1: the white mountain's richer surface (polish 1); 0: as live
${_}
${j}
void main(){
  vec3 n = normalize(vN);
  float r = max(vPol.x, 1.), an = vPol.y, t = clamp(r/uKind.w, 0., 1.);
  // ribs and gullies: the same bent radial field the mesh was pushed by, finer
  vec2 q = vec2(an*7., r/260.);
  float rib = sN2(vec2(an*19. + 3.*sN2(q), r/420.)), fine = sF2(vec2(an*46., r/90.) + 7.3);
  float steep = 1. - smoothstep(.55, .9, n.y);
  // snow lies in the gullies and on the gentle ground; rock ribs stand out of it where it is steep
  float snow = smoothstep(.34, .62, uKind.x*1.25 - steep*.75*(.4 + rib) + .3*(fine - .5) + .55*smoothstep(.25, .9, t)*uKind.x);
  snow *= 1. - (1. - uKind.x)*smoothstep(.5, .0, t)*.8;
  // ledges hold snow; at the foot the drift runs up the gullies in ragged tongues (no level line where rock meets snow)
  snow = max(snow, smoothstep(.56, .66, sN2(vec2(an*11., vW.y/40.) + 3.))*(1. - .7*steep)*.85);
  snow = max(snow, (1. - smoothstep(224. + 30.*fine, 236. + 170.*rib*rib + 70.*fine, vW.y))*(.7 + .3*fine));
  // the white mountain's slope is not one smooth mass: rock ribs stand through it and blue ice shows where the wind strips it
  snow *= 1. - .8*uKind.x*smoothstep(.66, .76, rib + uRich*(.34*(sF2(vec2(an*37., r/95.) + 3.1) - .5) + .2*(sF2(vec2(an*83., r/36.)) - .5)))*smoothstep(.2, .5, t)*(.5 + .5*fine);
  float bare = uKind.x*smoothstep(.6, .7, sF2(vec2(an*15., r/75.) + 1.3))*(1. - steep);
  vec3 rock = uRock*(.55 + .9*fine)*(.7 + .6*rib);
  // (polish 1, uRich) rock is rock: beds of lighter and darker stone, lifted out of flat black; its ribs and gullies
  // turn the slope's face a little to one side and the other; hanging ice with crevasse bands on the middle slopes
  float bedR = sN2(vec2(vW.y/9. + 2.*sN2(vec2(an*9., r/200.)), an*3.));
  // (second part, B1) dark and cold: blue-black to slate by its beds, never one flat tone; snow lies on its ledges
  // (thin shelves every few metres of height, of unlike length) and breaks every edge of every rock patch
  rock = mix(rock, mix(vec3(.010, .014, .026), vec3(.045, .056, .085), bedR)*(.65 + .7*fine), uRich);
  snow = max(snow, uRich*.92*smoothstep(.5, .62, sN2(vec2(an*15. + 2., vW.y/8. + 1.6*sN2(vec2(an*43., r/70.))))));
  { vec3 tng = normalize(vec3(-(vW.z - uTop.z), 0., vW.x - uTop.x) + vec3(1e-4, 0., 0.));
    n = normalize(n + tng*(uRich*7.*(sN2(vec2((an + .012)*19. + 3.*sN2(q), r/420.)) - rib))); }
  float hang = uRich*smoothstep(.57, .67, sF2(vec2(an*6. + 1.7, r/340.)))*smoothstep(.16, .3, t)*(1. - smoothstep(.6, .8, t));
  // its crevasse bands: short dark slots across the fall line, unlike in spacing, each band broken along its length
  float by = vW.y/14. + 2.4*sN2(vec2(an*17., r/120.)) + 1.1*sF2(vec2(an*41., r/55.));
  float band = (1. - smoothstep(.0, .09, abs(fract(by) - .5)))*smoothstep(.4, .62, sN2(vec2(an*57. + floor(by)*7.31, r/48.)));
  vec3 alb = mix(rock, mix(uSnow*(.86 + .2*fine), vec3(.15, .32, .52)*(.8 + .4*fine), bare*.65), snow);
  alb = mix(alb, mix(vec3(.2, .42, .62)*(.8 + .4*fine), vec3(.03, .07, .14), band*.8), hang*snow*.8);
  alb = mix(alb, uSnow, uRich*snow*(1. - snow)*2.);                                  // frost on the rim of every rock patch
  // ash on the snow of the fire mountain: long dirty streaks down the fall line
  alb *= 1. - (1. - uKind.x)*.5*snow*smoothstep(.35, .7, sN2(vec2(an*31., r/600.)));
  vec3 c = alb*(sbvSky(n) + uRich*.3*snow*sbvBelly(vW, n));      // (second part, B1: the fire's red on its snow only, faintly; no rock is pink)
  // the crater's own glow on the upper cone
  vec3 toC = uTop - vW; float dc = length(toC);
  c += alb*uLava*uKind.y*1.6*uFire.y*(1. + uFire.w)*clamp(dot(n, toC/max(dc, 1.)) + .5, 0., 1.)*(uKind.z*uKind.z*4./(dc*dc + uKind.z*uKind.z*4.));
  // lava threads crawling down three gullies: a hot line broken by crust, the bright stretches slide downhill
  float thr = 0., halo = 0.;
  for (int i = 0; i < 3; i++) {
    float a0 = i == 0 ? uThread.x : (i == 1 ? uThread.y : uThread.z);
    float da = an - a0 - .22*sN2(vec2(r/170., float(i)*7.1)) + .08*sN2(vec2(r/45., float(i)*3.3));
    da = abs(mod(da + 3.14159265, 6.2831853) - 3.14159265)*r;
    float w = (2.5 + 7.*smoothstep(.05, .6, t))*clamp(uKind.w/720., 1., 1.35);
    float line = 1. - smoothstep(w*.3, w, da);
    float flow = .35 + .65*smoothstep(.3, .7, sN2(vec2(r/70. - uTime*.11 - float(i)*5., float(i)*2.7)));
    float reach = smoothstep(uKind.z*.8, uKind.z*1.6, r)*(1. - smoothstep(.52, .8, t));
    thr += line*flow*reach;
    halo += (1. - smoothstep(w*.6, w*9., da))*(.4 + .6*flow)*reach;                     // the thread's light on the slope beside it
  }
  thr = clamp(thr, 0., 1.)*uKind.y;
  halo = clamp(halo, 0., 1.); c += alb*uLava*uKind.y*halo*halo*.9*(.5 + .5*uFire.y/2.2);
  c = mix(c, uLava*(.9 + 1.3*thr), thr*.9);
  // the rim itself glows where the vent is
  c += uLava*uKind.y*2.2*(1. - smoothstep(uKind.z*.55, uKind.z*1.15, r))*(.6 + .4*sN2(vec2(an*5., uTime*.4)));
  float dist = length(vW - cameraPosition);
  c = mix(c, uHazeCol, uHaze*(1. - exp(-dist/2600.)));
  gl_FragColor = vec4(sbvFog(c, dist, .25), 1.);
}`;async function $(a,n,e){const{noise:t}=a,h=e.seg??112,d=e.ring??36,w=e.radius,s=e.top,v=e.foot,R=s[1]-v,k=e.rim??0,l=e.key??0,y=new Float32Array((d+1)*h*3),T=[];for(let m=0;m<=d;m++){const i=Math.pow(m/d,1.35);for(let x=0;x<h;x++){const z=x/h*Math.PI*2,c=Math.cos(z),u=Math.sin(z),C=t.n2(c*3.1+l,u*3.1-l)*.5+t.n2(c*7.7-l*2,u*7.7+i*1.5)*.32+t.n2(c*17+i*3,u*17+l)*.18,K=t.n2(c*i*5+l*3,u*i*5+9.1),r=L(.02,.25,i)*(1-.6*L(.7,1,i)),o=w*i*(1+.1*K*r)+0;let g=v+R*q(i)*(1+.16*C*r)+22*K*r;if(k>0){const P=w*i;P<k?g=Math.min(g,s[1]-60*(1-P/k)-18*t.n2(c*2+l,u*2)):g=Math.min(g,s[1]+14*t.n2(c*4.3+l,u*4.3))}const p=(m*h+x)*3;y[p]=s[0]+c*o,y[p+1]=g,y[p+2]=s[2]+u*o}m%5===4&&await a.yield()}for(let m=0;m<d;m++)for(let i=0;i<h;i++){const x=m*h+i,z=m*h+(i+1)%h,c=x+h,u=z+h;T.push(x,z,c,z,u,c)}const b=new f.BufferGeometry;b.setAttribute("position",new f.BufferAttribute(y,3)),b.setIndex(T),await a.yield(),b.computeVertexNormals(),await a.yield();const M={...H(n),uTop:{value:new f.Vector3(s[0],s[1],s[2])},uRock:{value:new f.Color(e.rock??"#17151B")},uSnow:{value:new f.Color(e.snow??"#B7C6DD").multiplyScalar(.92)},uLava:{value:new f.Color("#FF5A1E")},uKind:{value:new f.Vector4(e.snowCover??.3,e.lava??0,Math.max(k,60),w)},uThread:{value:new f.Vector3(...e.threads??[0,2,4])},uHaze:{value:e.haze??.5},uRich:{value:e.rich??0},uHazeCol:{value:new f.Color(e.hazeColor??"#22355E")}},B=new f.ShaderMaterial({uniforms:M,vertexShader:D,fragmentShader:U}),N=new f.Mesh(b,B);return N.name=e.name??"cone",N.frustumCulled=!1,{object:N,uniforms:M,triangles:T.length/3}}function X(a,n){const e=a.core.makeRng(a.core.hashSeed("sledge-crater-flashes:"+a.seed)),t=96,h=[];let d=e.range(1,4);for(;d<t-3;){const w=e.range(.08,.85),s=n[0],v=n[2];h.push({t:d,k:e.range(.6,1),p:[E(s[0],v[0],w)+e.range(-50,50),E(s[1],v[1],w),E(s[2],v[2],w)+e.range(-50,50)]}),d+=e.range(4,9)}return w=>{const s=(w%t+t)%t;let v=null,R=0;for(const k of h){const l=s-k.t;if(l<0||l>.7)continue;const y=(l<.1?L(0,.1,l):1-L(.1,.5,l))*k.k;y>R&&(R=y,v=k)}return{v:R,f:v}}}const F=[700,1150,-2100],J=[[700,1105,-2100,115],[697,1320,-2096,150],[668,1540,-2084,200],[560,1730,-2058,255],[330,1860,-2010,300],[-60,1940,-1940,330],[-640,1985,-1832,340],[-1400,2010,-1690,300],[-2300,2025,-1520,200]],Q=["cone","tongues","bursts","rollers","steam","two"];async function se(a,n={}){const e=n.shared||I(),t=n.forks||A(n.rng||a.rng,Q),h=n.look||{},d=new f.Group;d.name="passage-fire-side";const w=h.eruption||"strong",s=w==="waning",v=w==="surge",R=s?1.6:v?2.8:2.2,k=s?.1:v?.21:.16,l=await $(a,e,{name:"black-volcano",top:F,foot:60,radius:1500,rim:150,key:3.7,rock:"#25222b",snowCover:.42,lava:1,seg:160,ring:52,threads:[Math.PI*.57+t.cone.range(-.12,.12)*.25,Math.PI*.66+t.cone.range(-.1,.1)*.3,Math.PI*.49+t.cone.range(-.1,.1)*.3]}),y={value:0},T=t.cone.range(0,600);l.uniforms.uTime=y,d.add(l.object),await a.yield();const b=J.map(r=>[r[0],s&&r[1]>1400?E(r[1],1400,.3):r[1],r[2],r[3]*(s?.82:1)]),M=X(a,b),B=a.core.makeRng(a.core.hashSeed("sledge-plume-billows:"+a.seed)),N=[],m=30,i=.05,x=(1-Math.exp(-i*m))/i;for(let r=0;r<b.length-1;r++){const o=b[r],g=b[r+1],p=1.5/x;N.push({p:[o[0],o[1],o[2]],v:[(g[0]-o[0])*p,(g[1]-o[1])*p,(g[2]-o[2])*p],spread:o[3]*.55,vr:2,n:r<3?18:16,life:m,size:[o[3]*2.3,g[3]*2.7],tone:1,alpha:[.9,.88,.85,.8,.74,.64,.5,.36][r],drag:i,flat:.7})}for(const r of[4,5,6]){const o=b[r];N.push({p:[o[0],o[1]-o[3]*.7,o[2]],v:[-9,-24,1.6],spread:o[3]*.8,vr:3,n:7,life:26,size:[150,430],tone:1,alpha:.15,drag:i,flat:.3})}const z=n.mx??1,c=G(e,{rng:B,emitters:N,wind:[0,0,0],name:"plume-billows",ashTone:s?"#9a948d":"#877f78",renderOrder:4,soft:1,glowAt:[F[0]*z,F[1]-60,F[2],420],glowCol:"#d2511c",glowK:R*.5});d.add(c.object),await a.yield();let u=null;n.ground&&n.lava!==!1&&(u=await V(a,e,{rng:t.tongues,burstsRng:t.bursts,rollersRng:t.rollers,steamRng:t.steam,noise:a.noise,ground:n.ground,wind:n.wind||[-.984,.178],pathX:0,gap:n.gap,surge:v,steam:s?1.7:1}),d.add(u.object)),await a.yield();let C=null;n.travellers!==!1&&(C=await O(a,{shared:e,ground:n.ground,track:n.track,cast:n.cast,rng:t.two}),d.add(C.object));const K={object:d,radius:1100,height:1100,center:new f.Vector3(450,1100,-1900),ground:!1,anchors:{crater:new f.Vector3(...F),plumeBase:new f.Vector3(690,1380,-2080)},cone:l,billows:c,lava:u,travellers:C,spine:b,flash:0,update(r,o,g,p=1,P=null){e.uTime.value=o;{const S=M(o);K.flash=S.v,c.uniforms.uFlashCol.value.set("#d9c8ff").multiplyScalar(.8*S.v*p),S.f&&c.uniforms.uFlashAt.value.set(S.f.p[0]*z,S.f.p[1],S.f.p[2],110)}u&&(u.update(o,p),K.flash+=.6*u.bursts.glow*p),l.uniforms.uKind.value.y=p,y.value=o+T,c.uniforms.uGlowCol2.value.set("#d2511c").multiplyScalar(R*.5*p),C&&C.update(r,o,g,P??o*.9)}};return K}export{F as CRATER,Q as HERO_FORKS,J as PLUME_SPINE,se as buildHero,$ as makeCone};
