import*as t from"three";import{makePath as pe}from"../kit/core.js";import{makeSky as me,makeCloudField as Y}from"../kit/sky.js";import*as j from"../kit/fauna.js";import{mergeVertices as he}from"three/addons/utils/BufferGeometryUtils.js";import{buildHero as ye,tideHeight as W,TIDE_GLSL as X,vertexNormalsInSlices as we}from"../parts/standing-tide.js";const U=-528,ne=1300,ee=ne-U,G=-2.6,ge={day:{sunEl:38,sunAz:-80,pal:["#F1EBDD","#9FB4CC","#2FB7B0","#0F5F9A","#7FD0F2","#FFFFFF","#F28C3B"],sunC:[1,.95,.86],sky:{preset:"day",zenith:"#4FB2EA",horizon:"#EDE8DC"},fog:"#D6E6EF",fogK:31e-5,post:{exposure:.96,bloom:{strength:.3,radius:.6,threshold:.93},grade:{saturation:1.16,contrast:1.13,tint:"#fffdf8",shadowTint:"#0a1830",vignette:.33,grain:.02}}},golden:{sunEl:12,sunAz:-76,pal:["#F2DDB8","#A7A2C2","#4FBF9C","#1C6A78","#9CC4DA","#FFF6E6","#F28C3B"],sunC:[1.25,.86,.5],sky:{preset:"goldenHour",zenith:"#7FB4D8",horizon:"#F6D9A6"},fog:"#EBD6B4",fogK:34e-5,post:{exposure:1,bloom:{strength:.38,radius:.65,threshold:.92},grade:{saturation:1.1,contrast:1.06,tint:"#fff4e2",shadowTint:"#141a3a",vignette:.3,grain:.02}}},dawn:{sunEl:9,sunAz:-84,pal:["#F4DCD6","#A9A4CC","#58BDB8","#2A6C9E","#A9C8E8","#FFF4F2","#F28C3B"],sunC:[1.15,.78,.7],sky:{preset:"dawn",zenith:"#8FB6E2",horizon:"#F6CFC6"},fog:"#EBCFD2",fogK:36e-5,post:{exposure:1,bloom:{strength:.36,radius:.65,threshold:.92},grade:{saturation:1.06,contrast:1.04,tint:"#fff2f0",shadowTint:"#181a40",vignette:.3,grain:.02}}},night:{sunEl:7,sunAz:-80,pal:["#E9E6DC","#5E7198","#2A8E9C","#0C3F78","#3F6CA8","#DCE6F4","#E0803A"],sunC:[.95,.9,.82],sky:{preset:"blueHour",zenith:"#1E3C78",horizon:"#6E8FC0",bodies:[],stars:0,milkyWay:0},fog:"#5E7FB0",fogK:34e-5,post:{exposure:1.12,bloom:{strength:.42,radius:.7,threshold:.9},grade:{saturation:1.08,contrast:1.05,tint:"#eef2ff",shadowTint:"#0a1238",vignette:.32,grain:.025}}}},se={ivory:null,basalt:["#A9A9A6","#8C98AE"],rust:["#DDA982","#A49CB4"]};var Re={id:"standing-tide",name:"The Standing Tide",category:"alien",weirdness:.7,media:["air","water","open"],async build(e){const r=e.rng,c=e.vary||{},a=e.quality?.detail??1,n=c.density??1,o=Math.abs(Math.floor(Number(e.seed)||0)),l={day:"day",golden:"golden",dawn:"dawn",night:"night"}[c.hour]||["day","golden","dawn","day","golden"][o%5],h=ge[l];let v=["trade","squall","calm","calm","calm","trade","squall"][o%7];l==="dawn"&&(v="calm");const m=["ivory","basalt","rust"][o%3],w=["orange","orange","saffron","orange","white","orange","orange","saffron","white","orange","saffron"][o%11],i=w==="saffron"?"#F2B53B":"#F28C3B",s=["blacksand","seagrass","coral","coral"][o%4],d=!!c.rare,f=h.pal.slice();f[6]=i,se[m]&&(f[0]="#"+new t.Color(se[m][0]).lerp(new t.Color(h.pal[0]),.15).getHexString());const b={hourKey:l,weather:v,moonKey:m,flat:s,rare:d,detail:a,density:n,pal:f,H:h},p=new t.Scene;p.fog=new t.FogExp2(h.fog,h.fogK);const u=me({rng:r,...h.sky,sunElevation:h.sunEl,sunAzimuth:h.sunAz,clouds:!1,clouds2:!1,bake:l==="night",renderer:e.renderer});p.add(u.object);const y=u.sunDirection.clone().normalize();await e.yield();const g=await ye(e,{palette:f,detail:a,bed:!1,kelp:!0,sun:y,progress:0,boats:Math.round(t.MathUtils.clamp(38*n,24,48))});g.uniforms.SUNC.value.fromArray(h.sunC),g.uniforms.uSailW.value=w==="white"?1:0,g.uniforms.uWind.value=v==="trade"?1:v==="squall"?.35:0,p.add(g.object),await e.yield();const x=C=>{if(C<430){const _=W(430)+5.5;return Math.max(_+(320-_)*(430-C)/430,W(C)+6.5)}const T=4.5,S=W(C)+5.5,N=1.2;return Math.log(Math.exp(T/N)+Math.exp(Math.min(S,400)/N))*N},A=56,M=[],z=[0];for(let C=0;C<=A;C++){const T=C/A;M.push([0,C<6?4.5:x(ee*(1-T)),ne*(1-T)]),C&&z.push(z[C-1]+Math.hypot(M[C][1]-M[C-1][1],M[C][2]-M[C-1][2]))}const P=pe(M);await e.yield();const B=C=>{const T=t.MathUtils.clamp(C,0,1)*z[A];let S=1;for(;S<A&&z[S]<T;)S++;return(S-1+(T-z[S-1])/Math.max(z[S]-z[S-1],1e-6))/A},L=C=>{const T=t.MathUtils.clamp(C,0,1)*A,S=Math.min(A-1,Math.floor(T));return(z[S]+(z[S+1]-z[S])*(T-S))/z[A]},E={value:U},I=ee*(1-B(.61)),F={ctx:e,scene:p,hero:g,path:P,L:b,rng:r,sky:u,sunDir:y,uHeroZ:E,sOfU:B,uOfS:L,updates:[],disposables:[],flyY:x};F.mk=Ce(F),await e.yield();const D=Y({rng:r,sky:u,count:Math.round(24*a),altitude:190,altitudeJitter:50,size:[110,250],height:.5,puffs:22,center:[0,0,300],extent:[3800,3400],wind:[2.2,0,1.2],opacity:.86,filter:(C,T,S,N)=>Math.abs(C)>140+N*.6&&Math.hypot(C,S-U*.5)>520});p.add(D.object),await e.yield();const H=Y({rng:e.core.makeRng(o*7919+13),noiseTexture:D.noiseTexture,sky:u,count:Math.round(9*a),altitude:215,altitudeJitter:22,size:[150,260],height:.5,puffs:20,center:[0,0,-640],extent:[1500,520],wind:[2.2,0,1.2],opacity:.86,filter:C=>Math.abs(C)>150});p.add(H.object),await e.yield();const q=Y({rng:e.core.makeRng(o*4409+29),noiseTexture:D.noiseTexture,sky:u,count:5,altitude:150,altitudeJitter:30,size:[120,210],height:.5,puffs:20,center:[0,0,420],extent:[1300,420],wind:[2.2,0,1.2],opacity:.86,filter:C=>Math.abs(C)>230&&Math.abs(C)<640});p.add(q.object),await e.yield(),F.bedH=ze(F),await Me(F),await e.yield(),await ke(F),await e.yield(),await Ae(F),await e.yield(),Be(F),await e.yield(),await Te(F),await e.yield(),await Pe(F),await e.yield(),await Ge(F),await e.yield(),Le(F),await e.yield(),d&&qe(F),await e.yield(),v==="squall"&&await Ee(F),await e.yield();const O=(C,T,S,N)=>{const _=B(N||0),ae=U*(1-_);g.object.position.z=ae,E.value=ae,g.setProgress(_),g.update(C,T,S);const R=N||0,oe=ee*(1-_),K=t.MathUtils.smoothstep;g.uniforms.uBall.value=Math.max(150,oe-(36+80*(1-K(R,.44,.52))-80*K(R,.575,.62)+122*K(R,.66,.75))),g.uniforms.uRay0.value=Math.max(150,oe-(27+70*(1-K(R,.55,.59))-60*K(R,.625,.66)+90*K(R,.72,.79))),g.uniforms.uB0.value.set(I-23+45*(.61-R),Math.max(5.5,10.5-55*(.61-R)),0),u.update(C,T,S),D.update(C,T,S),H.update(C,T,S),q.update(C,T,S);for(const fe of F.updates)fe(C,T,S,N||0,_)};await e.yield(),O(0,0,null,0),await e.yield(),await u.prewarm(e.renderer,null,p);const Q=new t.Vector3,$=new t.Vector3;return{scene:p,path:P,duration:44,pace:C=>1.06-.38*t.MathUtils.smoothstep(C,.5,.57)*(1-t.MathUtils.smoothstep(C,.62,.7)),camera:{fov:62,near:.4,far:5200,lookAhead:50,sway:.5,bank:.4},pois:[{at:(C,T)=>Q.set(0,200,U*(1-B(T))),from:0,to:.2,weight:.3},{at:(C,T)=>(P.pointAt(T,$),$.set($.x+120,$.y+30,$.z-190)),from:.47,to:.64,weight:.5}],portal:{shape:"circle",radius:7,color:"#FFE9C4",glow:1,revealDistance:500,tilt:!0},post:h.post,ride:"none",update:O,dispose(){g.dispose(),u.dispose?.();for(const C of F.disposables)C.dispose()}}}};const be=`
#include <fog_pars_vertex>
uniform float uHeroZ;
varying vec3 vLp; varying vec3 vCam; varying vec3 vWp;
`,V=`
  vWp = wp; vLp = wp - vec3(0., 0., uHeroZ); vCam = cameraPosition - vec3(0., 0., uHeroZ);
  vec4 mvPosition = viewMatrix * vec4(wp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
`,xe=`
#include <fog_pars_fragment>
uniform float uHeroZ;
varying vec3 vLp; varying vec3 vCam; varying vec3 vWp;
vec3 fogMix(vec3 c){
#ifdef USE_FOG
  float f = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  return mix(c, fogColor, f);
#else
  return c;
#endif
}
`;function Ce(e){const r=e.hero.uniforms,c=["uTime","uSun","uQuiv","SUNC","uSailW","uWind","cIvory","cSlate","cTurq","cDeep","cAqua","cWhite","cOrange"];return(a,n,o={},l={})=>{const h=t.UniformsUtils.clone(t.UniformsLib.fog);for(const v of c)h[v]=r[v];return h.uHeroZ=e.uHeroZ,Object.assign(h,l),new t.ShaderMaterial({uniforms:h,vertexShader:X+be+a,fragmentShader:X+xe+n,fog:!0,...o})}}function ze(e){const r=e.ctx.noise,c=t.MathUtils.smoothstep;return(a,n)=>{const o=c(r.fbm2(a*.0052+3.1,n*.0052,3),.1,.42),l=c(r.n2(a*.031+7,n*.031),.15,.6),h=c(r.n2(a*.017-9,n*.017+4),.2,.75)*(1-o);let v=-2.2*o-.55*l*(1-o)+1.5*h+.12*r.n2(a*.19,n*.19);const m=Math.abs(a);m<14&&(v=Math.min(v,.2+1.3*c(m,5,14)));const w=c(1-Math.hypot((a+6)/11,(n-1209)/18),0,.45);return v+=(-.44-v)*w,G+v}}async function Me(e){const{L:r}=e,c=e.bedH,a=[0],n=[];for(let u=1.7;u<70;u+=1.7)a.push(u);for(let u=70,y=2.2;u<5300;y*=1.32,u+=y)a.push(u);const o=[...a.slice(1).reverse().map(u=>-u),...a];for(let u=1345;u>870;u-=2.9)n.push(u);const l=[];for(let u=1345,y=3.6;u<5400;y*=1.4,u+=y)l.unshift(u+y);l.push(...n);for(let u=870,y=3.6;u>-5600;y*=1.3,u-=y)l.push(u-y);const h=o.length,v=l.length,m=new Float32Array(h*v*3),w=new Float32Array(h*v);for(let u=0;u<v;u++){u%8===7&&await e.ctx.yield();for(let y=0;y<h;y++){const g=u*h+y,x=o[y],A=l[u],M=Math.max(y?o[y]-o[y-1]:2,u?Math.abs(l[u]-l[u-1]):3),z=t.MathUtils.clamp(1.15-M/14,0,1),P=G+(c(x,A)-G)*z;m[g*3]=x,m[g*3+1]=P,m[g*3+2]=A,w[g]=z>0?P-G:9}}await e.ctx.yield();const i=new Uint32Array((h-1)*(v-1)*6);let s=0;for(let u=0;u<v-1;u++)for(let y=0;y<h-1;y++){const g=u*h+y,x=g+1,A=g+h,M=A+1;i[s++]=g,i[s++]=x,i[s++]=A,i[s++]=x,i[s++]=M,i[s++]=A}const d=new t.BufferGeometry;d.setAttribute("position",new t.BufferAttribute(m,3)),d.setAttribute("aH",new t.BufferAttribute(w,1)),d.setIndex(new t.BufferAttribute(i,1)),await e.ctx.yield(),await we(d,()=>e.ctx.yield()),await e.ctx.yield();const f=r.flat==="blacksand"?new t.Vector3(.1,.1,.108):new t.Vector3(.6,.5,.34),b=e.mk(`
    attribute float aH; varying float vH; varying vec3 vN;
    void main(){ vec3 wp = position; vH = aH; vN = normal; ${V} }`,`
    varying float vH; varying vec3 vN; uniform vec3 uSand; uniform float uGrass, uSheen;
    void main(){
      vec3 toC = vCam - vLp; float dist = length(toC); vec3 V = toC / max(dist, 1e-3);
      vec2 w = vWp.xz; float r = length(vLp.xz);
      float near = 1. / (1. + dist / 45.), geo = step(vH, 8.);
      float h = mix(0., vH, geo);
      float big = fbm(w * .012);
      float chF = smoothstep(.56, .7, fbm(w * .0055 + 3.1));                       // far pattern where the mesh is flat
      float chan = mix(chF, smoothstep(-.5, -1.6, h), geo);
      // sand ripple marks: two sets, each living only in its own patches (a few metres across), with a wandering
      // direction and wavelength so the crests bunch, fork and die out; faded before they fall under ~3 pixels a wave
      // (direction and wavelength wander through the warp alone: scaling a world coordinate by a varying factor
      // would turn the marks into a fine chirp)
      vec2 wq = w + (vec2(fbm(w * .09), fbm(w * .09 + 7.3)) - .5) * 6.5 + (vec2(vn(w * .33 + 2.), vn(w * .33 + 9.)) - .5) * .9;
      vec2 d1 = vec2(.8, .6), d2 = vec2(.34, -.94);
      float ph1 = dot(wq, d1) * 7.2, ph2 = dot(wq, d2) * 10.2;
      float m1 = smoothstep(.43, .6, vn(w * .17 + 2.) * .62 + fbm(w * .045) * .38);
      float m2 = smoothstep(.45, .62, vn(w * .21 + 40.) * .62 + fbm(w * .05 + 9.) * .38) * (1. - m1);
      m1 *= smoothstep(2.5, 1., fwidth(ph1)); m2 *= smoothstep(2.5, 1., fwidth(ph2));
      float rp = sin(ph1) * m1 + sin(ph2) * m2 * .7;
      float ra = 1. - 1.5 * uSheen;                                              // a glossy bed shows them through the sheen instead
      vec3 n = normalize(vN + vec3(d1.x, 0., d1.y) * (cos(ph1) * .3 * m1 * ra) + vec3(d2.x, 0., d2.y) * (cos(ph2) * .24 * m2 * ra));
      vec3 alb = uSand * (.86 + .26 * big + .15 * rp) * (.9 + .2 * vn(w * 2.7));
      alb = mix(alb, uSand * .6 + cTurq * .1, chan * .6);
      vec2 sc = w * 2.1, si = floor(sc); float sh1 = h21(si);                        // shells and pebbles
      alb = mix(alb, mix(vec3(.75, .7, .62), vec3(.2, .19, .2), step(.5, h21(si + 5.))), smoothstep(.27, .17, length((fract(sc) - .5 - (vec2(sh1, h21(si + 2.)) - .5) * .4) * vec2(1., 1.5 + sh1))) * step(.935, sh1) * min(near * 1.6, 1.) * (1. - .45 * step(.01, uSheen)));
      // coral crust and weed on the mounds, seagrass in the meadows
      float crust = smoothstep(.35, 1.1, h) * geo + (1. - geo) * smoothstep(.62, .8, fbm(w * .017 + 4.));
      vec3 crustC = mix(vec3(.42, .3, .26), vec3(.5, .46, .3), vn(w * .7)) * (.5 + .7 * vn(w * 3.1));
      alb = mix(alb, crustC, crust * .75);
      float meadow = smoothstep(.61 - uGrass, .75 - uGrass, fbm(w * .021 + 11.)) * (1. - chan) * (1. - crust);
      alb = mix(alb, vec3(.07, .2, .12) + cTurq * .08, meadow * .8 * (.5 + .5 * vn(w * vec2(1.1, 3.4))));
      float depth = tideH(vLp.xz) - vLp.y;
      float wet = smoothstep(2100., 1450., r);
      alb *= mix(.72, 1.12, smoothstep(-.7, .9, h + (big - .5) * .8));                    // soaked hollows darker than the drying crests
      vec3 col = lit(alb * mix(1., .6, wet), n, vLp);
      if (r < 1400. && depth > 0.) {
        col = underwater(col, vLp, V);
      } else {
        // pools: water stands in the hollows at a fixed level; channels keep a deeper turquoise run
        float lvl = -.16 + .05 * big;
        float pd = mix(chF * .5, (lvl - h), geo);                                  // depth of standing water
        float pool = smoothstep(0., .06, pd);
        vec2 rs = (vec2(vn(w * 1.3 + uTime * .5), vn(w * 1.3 - uTime * .4 + 5.)) - .5) * (.07 + .1 * near);
        rs += (vec2(vn(w * 6. + uTime * 1.1), vn(w * 6. - uTime * .9)) - .5) * .09 * near;
        vec3 Nw = normalize(mix(n, vec3(0., 1., 0.), pool) + vec3(rs.x, 0., rs.y) * pool);
        vec3 R = reflect(-V, Nw); R.y = abs(R.y) + .02; R = normalize(R);
        float fres = .04 + .96 * pow(1. - clamp(dot(Nw, V), 0., 1.), 5.);
        vec4 mr = moonRay(vLp, R);
        vec3 refl = mix(skyCol(R), mr.rgb * .5 + cSlate * .1, mr.a);          // the moon lies in the pools as a dark soft shape
        vec3 poolBody = mix(col, cTurq * .5 * (.6 + .5 * moonShade(vLp)), 1. - exp(-pd * 1.4));
        col = mix(col, poolBody, pool);
        // rivulets draining toward the hill off the mounds
        vec2 dirn = vLp.xz / max(r, 1.);
        float rv = vn(vec2(dot(w, vec2(-dirn.y, dirn.x)) * 1.5 + 1.2 * vn(w * .2), dot(w, dirn) * .045 + uTime * .7));
        float riv = smoothstep(.76, .9, rv) * wet * (1. - pool) * smoothstep(.3, .6, fbm(w * .03 + 5.));   // threads, in a few runs
        float sheen = max(pool * (.5 + .5 * fres), wet * (fres * (.34 + .5 * riv) + uSheen * (.2 + 1.5 * fres + .17 * rp * (.45 + fres) + .3 * (big - .5) + .2 * (m1 + m2) * (.3 + fres))));
        sheen = clamp(sheen, 0., .92);
        col = mix(col, refl, sheen);
        col = mix(col, refl * 1.08, riv * .5);
        float edge = smoothstep(.0, .04, pd) * smoothstep(.12, .04, pd);           // bright wet rim of each pool
        col *= 1. - .3 * smoothstep(-.22, 0., pd) * (1. - pool);                    // darker soaked sand round each pool
        col += cIvory * .1 * edge;
        float sp = pow(max(dot(R, uSun), 0.), 260.) * moonShade(vLp);
        col += SUNC * sp * 6. * max(pool, wet * .35);
      }
      gl_FragColor = vec4(fogMix(col), 1.);
    }`,{},{uSand:{value:f},uGrass:{value:r.flat==="seagrass"?.16:0},uSheen:{value:r.flat==="blacksand"?.3:0}}),p=new t.Mesh(d,b);return p.frustumCulled=!1,p.renderOrder=-.5,e.scene.add(p),p}async function te(e,r,c,a){const n=[];for(let o=0,l=0;n.length<c&&l<c*30;l++){l%256===255&&await e.ctx.yield();const h=r()<.5?-1:1,v=4.5+Math.pow(r(),1.7)*120,m=h*v,w=862+r()*475,i=e.bedH(m,w);a&&!a(m,i,w,r)||(n.push([m,i,w]),o++)}return n}async function ke(e){const{L:r,scene:c}=e,a=e.rng.fork("reef"),n=r.detail*(.8+.2*r.density),o=new t.Object3D,l=new t.Color,h=Math.round((r.flat==="coral"?700:420)*n),v=await te(e,a,h,(d,f,b,p)=>(f-G>.1||p()<.25)&&!(Math.abs(d)<7&&f-G>-.5)&&(e.ctx.noise.n2(d*.07+50,b*.07+13)>.05||p()<.08));await e.ctx.yield();const m=new t.IcosahedronGeometry(1,1),w=new t.InstancedMesh(m,null,v.length),i=new Float32Array(v.length*4),s=["#D9C9A8","#B98E78","#9A8A9C","#C7B078","#8FA69C","#E4DCC8","#A9786E","#CDBB96"];return v.forEach((d,f)=>{const b=a()<.28,p=b?a.range(.9,2.3):a.range(.45,1.5)*(Math.abs(d[0])<10?.6:1);o.position.set(d[0],d[1]+(b?p*.42:p*.25),d[2]),o.scale.set(p,b?p*.2:p*a.range(.55,.8),p*a.range(.8,1.15)),o.rotation.set(a.range(-.15,.15),a()*6.28,a.range(-.15,.15)),o.updateMatrix(),w.setMatrixAt(f,o.matrix),l.set(a.pick(s)).multiplyScalar(a.range(.55,.85)),i.set([l.r,l.g,l.b,b?-a()-.01:a()+.01],f*4)}),m.setAttribute("aC",new t.InstancedBufferAttribute(i,4)),await e.ctx.yield(),w.material=e.mk(`
    attribute vec4 aC; varying vec3 vN; varying vec4 vC; varying vec3 vO;
    void main(){
      vec3 q = position; float sd = abs(aC.w) * 31.;
      float lump = vn(q.xz * 2.6 + sd) * vn(q.yx * 3.1 + sd * 1.7);
      q *= 1. + (aC.w > 0. ? .34 * lump - .08 : .1 * lump);
      if (aC.w < 0.) q.y -= .9 * (q.x * q.x + q.z * q.z) * .35 * step(q.y, 0.);     // table coral: dished underside
      vec3 wp = (modelMatrix * instanceMatrix * vec4(q, 1.)).xyz;
      mat3 im = mat3(instanceMatrix); vec3 s2 = vec3(dot(im[0], im[0]), dot(im[1], im[1]), dot(im[2], im[2]));
      vN = normalize(im * (normal / max(s2, vec3(1e-4))));
      vC = aC; vO = position * (1.2 + abs(aC.w)) + sd;
      ${V} }`,`
    varying vec3 vN; varying vec4 vC; varying vec3 vO;
    void main(){
      vec3 V = normalize(vCam - vLp), n = normalize(vN);
      // brain-coral meanders (heads) or radial plates (tables)
      float a = vn(vO.xz * 5. + vO.y * 3.), b = vn(vO.zy * 5.3 + 4.);
      float mz = abs(sin((a * 2.2 + b * 1.7 + vO.y * .8) * 9.));
      float groove = vC.w > 0. ? smoothstep(.0, .5, mz) : smoothstep(.1, .5, abs(sin(length(vO.xz - abs(vC.w) * 31.) * 9. + a * 3.)));
      vec3 alb = vC.rgb * (.5 + .62 * groove) * (.75 + .5 * vn(vO.xy * 11.));
      alb = mix(alb, vec3(.12, .2, .13), smoothstep(.1, -.5, n.y) * .6);                    // weed under the lip
      float depth = tideH(vLp.xz) - vLp.y, dry = step(depth, 0.);
      vec3 col = lit(alb * mix(1., .72, dry), n, vLp);
      col *= .55 + .45 * smoothstep(-.6, .5, n.y);                                         // contact shade
      // wet: sky sheen and thin rivulets running down the flanks
      float fres = pow(1. - max(dot(n, V), 0.), 4.);
      vec3 R = reflect(-V, n); R.y = abs(R.y);
      float riv = smoothstep(.7, .92, vn(vec2(atan(n.z + 1e-4, n.x + 2e-4) * 7., vWp.y * 2.5 + uTime * 1.6)));
      col = mix(col, skyCol(R), dry * (fres * .6 + riv * .22));
      col += SUNC * pow(max(dot(R, uSun), 0.), 60.) * (.5 + 1.5 * riv) * dry * moonShade(vLp);
      col = underwater(col, vLp, V);
      gl_FragColor = vec4(fogMix(col), 1.);
    }`),w.frustumCulled=!1,c.add(w),{spots:v}}async function Ae(e){const{L:r,scene:c}=e,a=e.rng.fork("grass"),n=r.detail*(.75+.25*r.density),o=e.ctx.noise,l=[],h=[];for(let M=0;M<3;M++)for(let z=0;z<3;z++){const P=z/2;if(l.push(-1,P,M,1,P,M),z<2){const B=M*6+z*2;h.push(B,B+1,B+2,B+1,B+3,B+2)}}const v=Math.round((r.flat==="seagrass"?4200:2800)*n),m=await te(e,a,v,(M,z,P,B)=>z-G<.5&&z-G>-1.3&&(o.fbm2(M*.02+11,P*.02,2)>(r.flat==="seagrass"?-.25:0)||B()<.12)&&(o.n2(M*.11+31,P*.11-7)>.2||B()<.04));await e.ctx.yield();const w=new Float32Array(m.length*4),i=new Float32Array(m.length*2);m.forEach((M,z)=>{w.set([M[0],M[1],M[2],a()],z*4),i.set([a.range(1.1,2.3),a()*6.28],z*2)});const s=new t.InstancedBufferGeometry;s.setAttribute("position",new t.Float32BufferAttribute(l,3)),s.setIndex(h),s.setAttribute("aG",new t.InstancedBufferAttribute(w,4)),s.setAttribute("aS",new t.InstancedBufferAttribute(i,2)),s.instanceCount=m.length,await e.ctx.yield();const d=e.mk(`
    attribute vec4 aG; attribute vec2 aS; varying vec3 vT;
    void main(){
      float t = position.y, sd = aG.w * 40. + position.z * 2.1, len = aS.x * (.75 + .25 * fract(sd * .37));
      vec3 root = aG.xyz; vec3 rl = root - vec3(0., 0., uHeroZ);
      float wetK = smoothstep(.0, 1.3, tideH(rl.xz) - root.y);
      float ya = aS.y + position.z * 2.4;
      vec2 comb = normalize(-rl.xz + vec2(cos(ya), sin(ya)) * 300.);                 // dry: combed toward the hill, fanned a little
      vec3 lie = vec3(comb.x, 0., comb.y) * (len * t) + vec3(0., .05 + .16 * len * sin(t * 2.6), 0.);
      vec2 sw = vec2(sin(uTime * 1.3 + sd + root.x * .3), cos(uTime * 1.1 + sd * 1.3 + root.z * .3)) * .32 * t * t;
      vec3 stand = vec3(sw.x + cos(ya) * .25 * t, len * t * .8, sw.y + sin(ya) * .25 * t) - vec3(comb.x, 0., comb.y) * (.35 * t * t * len);
      vec3 off = mix(lie, stand, wetK);
      vec3 sideV = normalize(vec3(-comb.y, 0., comb.x) + vec3(cos(ya), 0., sin(ya)) * .6);
      vec3 wp = root + off + sideV * position.x * .07 * (1. - t * .8) * (1. + distance(cameraPosition, root) * .012);
      wp.y += sin(uTime * 2.3 + sd) * .015 * t * (1. - wetK);
      vT = vec3(t, fract(sd * .71), wetK);
      ${V} }`,`
    varying vec3 vT;
    void main(){
      vec3 V = normalize(vCam - vLp);
      vec3 alb = mix(vec3(.03, .085, .05), vec3(.1, .2, .08), vT.x) * (.7 + .6 * vT.y);
      vec3 col = alb * (SUNC * .75 * moonShade(vLp) + cAqua * .4);
      col += SUNC * .25 * pow(vT.x, 3.) * (1. - vT.z) * moonShade(vLp);                 // wet glint on the laid blades
      col = underwater(col, vLp, V);
      gl_FragColor = vec4(fogMix(col), 1.);
    }`,{side:t.DoubleSide}),f=new t.Mesh(s,d);f.frustumCulled=!1,c.add(f),await e.ctx.yield();const b=Math.round(230*n),p=await te(e,a,b,(M,z,P)=>z-G>-.4&&Math.abs(M)>6);await e.ctx.yield();const u=new t.InstancedBufferGeometry;u.setAttribute("position",new t.Float32BufferAttribute([-.6,0,0,.6,0,0,-.6,1,0,.6,1,0],3)),u.setIndex([0,1,2,1,3,2]);const y=new Float32Array(p.length*4),g=new Float32Array(p.length*4);p.forEach((M,z)=>{y.set([M[0],M[1]-.05,M[2],a()],z*4),g.set([a.range(.9,2.4),a()*6.28,a(),a()],z*4)}),u.setAttribute("aG",new t.InstancedBufferAttribute(y,4)),u.setAttribute("aS",new t.InstancedBufferAttribute(g,4)),u.instanceCount=p.length;const x=e.mk(`
    attribute vec4 aG; attribute vec4 aS; varying vec2 vQ; varying vec3 vK;
    void main(){
      vec3 root = aG.xyz; float sd = aG.w * 50.;
      float wetK = smoothstep(0., 1.5, tideH(root.xz - vec2(0., uHeroZ)) - root.y);
      float sway = sin(uTime * (1.1 + aS.z) + sd) * mix(.03, .16, wetK) * position.y * position.y;
      vec3 ax = vec3(cos(aS.y), 0., sin(aS.y));
      vec3 wp = root + (ax * (position.x + sway) + vec3(0., position.y, 0.) + vec3(-ax.z, 0., ax.x) * sway * .6) * aS.x;
      vQ = position.xy; vK = vec3(aS.z, aS.w, sd);
      ${V} }`,`
    varying vec2 vQ; varying vec3 vK;
    void main(){
      float rad = length(vQ), ang = atan(vQ.x, vQ.y + 1e-3);
      float wob = vn(vec2(ang * 3. + vK.z, rad * 4.));
      float rib = abs(sin(ang * (11. + 6. * vK.x) + wob * 2.4 * rad));
      float web = abs(sin(rad * 34. + wob * 5.));
      float lace = max(smoothstep(.34, .12, rib), smoothstep(.3, .1, web) * .8);
      float shape = smoothstep(.98, .86, rad + .1 * vn(vec2(ang * 5., vK.z))) * smoothstep(.62, .5, abs(ang)) * smoothstep(.03, .1, rad);
      float stem = smoothstep(.05, .02, abs(vQ.x)) * step(vQ.y, .3);
      if (max(lace * shape, stem) < .4) discard;
      vec3 V = normalize(vCam - vLp);
      vec3 alb = mix(mix(vec3(.5, .24, .46), vec3(.74, .62, .5), step(.6, vK.y)), vec3(.62, .3, .34), step(.85, vK.y)) * (.6 + .5 * rad);
      vec3 col = alb * (SUNC * .8 * moonShade(vLp) + cAqua * .42);
      col = underwater(col, vLp, V);
      gl_FragColor = vec4(fogMix(col), 1.);
    }`,{side:t.DoubleSide}),A=new t.Mesh(u,x);A.frustumCulled=!1,c.add(A)}const re=[[14.5,1228,.5],[-25,1216,-.9],[42,1186,2.4],[-13,1130,.2],[13.5,1048,-.6],[-52,1080,1.4],[-17,968,2.9],[16,925,.4]];function Be(e){const{scene:r,hero:c}=e,a=e.rng.fork("stranded"),n=re.length,o=new t.InstancedBufferGeometry,l=c.boatGeometry;for(const y of["position","normal","color","aPart","uv"])o.setAttribute(y,l.attributes[y]);l.index&&o.setIndex(l.index);const h=new Float32Array(n*4),v=new Float32Array(n*4),m=[];re.forEach(([y,g,x],A)=>{const M=e.bedH(y,g),z=a.range(.27,.42)*(A%2?1:-1);h.set([y,g,x,z],A*4),v.set([M,a(),a.range(.9,1.08),a.range(.4,.62)],A*4),m.push([y+Math.cos(x)*5.4,M+1.2,g-Math.sin(x)*5.4,y+Math.cos(x+.5)*a.range(13,19),g-Math.sin(x+.5)*a.range(13,19)])}),o.setAttribute("aB",new t.InstancedBufferAttribute(h,4)),o.setAttribute("aB2",new t.InstancedBufferAttribute(v,4)),o.instanceCount=n;const w=e.mk(`
    attribute vec4 aB; attribute vec4 aB2; attribute float aPart; attribute vec3 color;
    varying vec3 vN; varying vec3 vCol; varying vec3 vPu;
    void main(){
      float sd = aB2.y * 40.;
      vec2 lxz = aB.xy - vec2(0., uHeroZ);
      float sy = surfY(lxz), depth = sy - aB2.x, fl = smoothstep(.45, 1.5, depth);
      float lean = aB.w * (1. - fl) + .05 * sin(uTime * .9 + sd) * fl, pitch = .03 * sin(uTime * .7 + sd * 2.) * fl;
      vec3 q = position, nn = normal;
      if (aPart > .5 && aPart < 1.5) {                                   // sail: brailed up to the yard, the bunt hanging in scallops
        float br = aB2.w * (1. - .0 * fl), up = (1. - uv.y);
        q.y += up * br * 8.2; q.z = q.z * .5 + sin(uv.x * 15.7) * .22 * up * br + sin(uv.y * 9. - uTime * 3. + sd) * .05 * uv.x;
        q.z += sin(uTime * 1.4 + sd + uv.x * 3.) * .12 * up;
      } else if (aPart > 1.5 && aPart < 2.5) {                           // pennant lifts toward the moon
        q.z += sin(uv.x * 5. - uTime * 7. + sd) * .25 * uv.x; q.y += uv.x * (.9 + .2 * sin(uTime * 3. + sd));
      } else if (aPart > 2.5) { q.y += sin(uTime * 3. + q.x * 2. + sd) * .04; }
      q *= aB2.z;
      float cl = cos(lean), sl = sin(lean), cp = cos(pitch), sp = sin(pitch), cy = cos(aB.z), syw = sin(aB.z);
      vec3 a = vec3(q.x, q.y * cl - q.z * sl, q.y * sl + q.z * cl), na = vec3(nn.x, nn.y * cl - nn.z * sl, nn.y * sl + nn.z * cl);
      a = vec3(a.x * cp - a.y * sp, a.x * sp + a.y * cp, a.z); na = vec3(na.x * cp - na.y * sp, na.x * sp + na.y * cp, na.z);
      vec3 b = vec3(a.x * cy + a.z * syw, a.y, -a.x * syw + a.z * cy);
      vN = vec3(na.x * cy + na.z * syw, na.y, -na.x * syw + na.z * cy);
      float baseY = max(aB2.x + .42 * cl, sy + .12 + .06 * sin(uTime * 1.3 + sd));
      vec3 wp = vec3(aB.x, baseY, aB.y) + b;
      vCol = color; vPu = vec3(aPart, uv);
      ${V} }`,`
    varying vec3 vN; varying vec3 vCol; varying vec3 vPu;
    void main(){
      vec3 V = normalize(vCam - vLp), n = normalize(vN);
      if (dot(n, V) < 0.) n = -n;
      vec3 alb = vCol;
      if (vPu.x > .5 && vPu.x < 1.5) {
        alb = mix(alb, cWhite * .7, uSailW * (1. - step(2., vPu.z * 6.) * step(vPu.z * 6., 3.)));
        float bt = abs(fract(vPu.z * 6. + .5) - .5); alb *= mix(.5, 1., smoothstep(.015, .045, bt));
        float seam = abs(fract(vPu.y * 6. + .5) - .5); alb *= mix(.8, 1., smoothstep(.008, .03, seam));
        alb *= .86 + .28 * vn(vPu.yz * vec2(26., 44.));
      } else if (vPu.x < .5) {
        alb *= .8 + .3 * vn(vWp.xy * 3.) ;                                                  // weathered planks
        alb *= mix(.62, 1., smoothstep(-.4, .5, vWp.y - (-2.6)));                           // dark wet bottom
      }
      vec3 col = lit(alb, n, vLp);
      if (vPu.x > .5) col += alb * SUNC * .55 * max(dot(-n, uSun), 0.) * moonShade(vLp);
      col = underwater(col, vLp, V);
      gl_FragColor = vec4(fogMix(col), 1.);
    }`,{side:t.DoubleSide}),i=new t.Mesh(o,w);i.frustumCulled=!1,r.add(i);const s=[],d=[],f=14;m.forEach(([y,g,x,A,M],z)=>{for(let P=0;P<=f;P++){const B=P/f,L=y+(A-y)*B+Math.sin(B*7+z)*.9*B,E=x+(M-x)*B+Math.cos(B*5+z*2)*.9*B,I=Math.max(e.bedH(L,E)+.07,g-B*9),F=M-x,D=-(A-y),H=Math.hypot(F,D)||1,q=s.length/3;s.push(L-F/H*.07,I,E-D/H*.07,L+F/H*.07,I+.05,E+D/H*.07),P<f&&d.push(q,q+1,q+2,q+1,q+3,q+2)}});const b=new t.BufferGeometry;b.setAttribute("position",new t.Float32BufferAttribute(s,3)),b.setIndex(d);const p=e.mk(`void main(){ vec3 wp = position; ${V} }`,`
    void main(){ vec3 col = vec3(.34, .3, .24) * (SUNC * .7 * moonShade(vLp) + cAqua * .4) * (.8 + .4 * step(.5, fract(vWp.x * 3. + vWp.z * 3.)));
      col = underwater(col, vLp, normalize(vCam - vLp)); gl_FragColor = vec4(fogMix(col), 1.); }`,{side:t.DoubleSide}),u=new t.Mesh(b,p);u.frustumCulled=!1,r.add(u)}const ie=new t.Matrix4,le=new t.Quaternion,ce=new t.Euler,Se=new t.Vector3,Fe=new t.Vector3;function k(e,r,c=0,a=null,n=null,o=null){let l=e.index?e.toNonIndexed():e;(a||n||o)&&(ce.set(n?n[0]:0,n?n[1]:0,n?n[2]:0),le.setFromEuler(ce),ie.compose(Se.set(a?a[0]:0,a?a[1]:0,a?a[2]:0),le,Fe.set(o?o[0]:1,o?o[1]:1,o?o[2]:1)),l.applyMatrix4(ie));const h=l.attributes.position.count,v=new Float32Array(h*3),m=new Float32Array(h),w=new t.Color(r);for(let i=0;i<h;i++)v[i*3]=w.r,v[i*3+1]=w.g,v[i*3+2]=w.b,m[i]=c;l.setAttribute("color",new t.BufferAttribute(v,3)),l.setAttribute("aPart",new t.BufferAttribute(m,1)),l.attributes.uv||l.setAttribute("uv",new t.BufferAttribute(new Float32Array(h*2),2));for(const i of Object.keys(l.attributes))["position","normal","uv","color","aPart"].includes(i)||l.deleteAttribute(i);return l}function J(e){let r=0;for(const n of e)r+=n.attributes.position.count;const c=new t.BufferGeometry,a={position:3,normal:3,uv:2,color:3,aPart:1};for(const n of Object.keys(a)){const o=new Float32Array(r*a[n]);let l=0;for(const h of e)o.set(h.attributes[n].array,l),l+=h.attributes[n].array.length;c.setAttribute(n,new t.BufferAttribute(o,a[n]))}for(const n of e)n.dispose();return c}function Z(e,r,c=[1,0,0]){const a=[],n=[],o=e.length,l=v=>{const m=e[v],w=r(v/(o-1))*.5;return[[m[0]-c[0]*w,m[1]-c[1]*w,m[2]-c[2]*w],[m[0]+c[0]*w,m[1]+c[1]*w,m[2]+c[2]*w]]};for(let v=0;v<o-1;v++){const m=l(v),w=l(v+1),i=v/(o-1),s=(v+1)/(o-1);a.push(...m[0],...m[1],...w[0],...m[1],...w[1],...w[0]),n.push(i,0,i,1,s,0,i,1,s,1,s,0)}const h=new t.BufferGeometry;return h.setAttribute("position",new t.Float32BufferAttribute(a,3)),h.setAttribute("uv",new t.Float32BufferAttribute(n,2)),h.computeVertexNormals(),h}const ue={x:-34,z:980};async function Te(e){const r=e.rng.fork("lighthouse"),c=e.ctx.noise,a=[],n=ue.x,o=ue.z,l=1.6,h=he(new t.IcosahedronGeometry(1,3).deleteAttribute("normal").deleteAttribute("uv")),v=h.attributes.position;await e.ctx.yield();for(let s=0;s<v.count;s++){const d=v.getX(s),f=v.getY(s),b=v.getZ(s),p=1+.22*c.n3(d*1.6,f*1.6,b*1.6)+.1*c.n3(d*4,f*4,b*4);v.setXYZ(s,d*p*12.5,Math.min(f*p*5.2,4.3+.25*c.n2(d*5,b*5)),b*p*10.5)}await e.ctx.yield(),h.computeVertexNormals(),a.push(k(h,"#6f6a62",1,[n,G+.4,o])),await e.ctx.yield();const m=[[3.5,0],[3.3,1.2],[3.05,6],[2.75,16],[2.5,26],[2.42,29]].map(([s,d])=>new t.Vector2(s,d));a.push(k(new t.LatheGeometry(m,28),"#c9c6bd",2,[n,l,o])),a.push(k(new t.CylinderGeometry(3.45,2.9,.55,20),"#5f7694",3,[n,l+29.2,o])),a.push(k(new t.CylinderGeometry(3.4,3.4,1.15,20,1,!0),"#5f7694",3.5,[n,l+30.05,o])),a.push(k(new t.CylinderGeometry(1.85,1.85,3.5,16,1,!0),"#31505c",4,[n,l+31.2,o])),a.push(k(new t.ConeGeometry(2.5,2.3,16),"#566c8a",3,[n,l+34.1,o])),a.push(k(new t.SphereGeometry(.42,8,6),"#566c8a",3,[n,l+35.5,o])),a.push(k(new t.CylinderGeometry(.06,.06,1.6,5),"#3a4048",5,[n,l+36.4,o])),await e.ctx.yield();for(let s=0;s<16;s++){s%4===3&&await e.ctx.yield();const d=s/15,f=.25+d*1.1,b=4.2+d*7.5,p=l+.9-d*5.4;a.push(k(new t.BoxGeometry(1.5,.09,.5),"#2f343b",5,[n+Math.cos(f)*b,p,o+Math.sin(f)*b],[0,-f,0])),s%3===0&&a.push(k(new t.CylinderGeometry(.035,.035,1.1,4),"#2f343b",5,[n+Math.cos(f)*b+Math.sin(f)*.7,p+.55,o+Math.sin(f)*b-Math.cos(f)*.7]))}for(let s=0;s<5;s++){await e.ctx.yield();const d=[.9,2.2,2.9,4.3,5.4][s],f=r.range(5.2,8.2),b=n+Math.cos(d)*f,p=o+Math.sin(d)*f,u=r.range(8,12.5),y=Math.cos(d)*r.range(1.5,3.2),g=Math.sin(d)*r.range(1.5,3.2),x=G+3.3-(f-5)*.55,A=new t.CatmullRomCurve3([new t.Vector3(b,x,p),new t.Vector3(b+y*.5,x+u*.45,p+g*.5),new t.Vector3(b+y,x+u,p+g)]),M=new t.TubeGeometry(A,7,.24,6,!1);a.push(k(M,"#6b5a47",6));const z=b+y,P=x+u,B=p+g;for(let L=0;L<11;L++){L%4===0&&await e.ctx.yield();const E=L/11*6.283+r()*.4,I=r.range(3.4,4.8),F=r.range(-.1,.5),D=[];for(let q=0;q<=5;q++){const O=q/5,Q=I*O;D.push([z+Math.cos(E)*Q,P+.3+Q*(.75-F)-O*O*I*.35,B+Math.sin(E)*Q])}const H=k(Z(D,q=>1.5*Math.sin(Math.PI*Math.min(1,q*.9+.1))+.1,[-Math.sin(E),0,Math.cos(E)]),"#3f6a2c",7+L%5*.01+s*.002);a.push(H)}}for(let s=0;s<26;s++){s%4===0&&await e.ctx.yield();const d=r()*6.283,f=r.range(.75,.98),b=n+Math.cos(d)*12*f,p=o+Math.sin(d)*10*f,u=G+.4+5*Math.sqrt(Math.max(0,1-f*f))*.8,y=r.range(1.2,3),g=[];for(let x=0;x<=3;x++)g.push([b+Math.cos(d)*x*.12,u-y*x/3,p+Math.sin(d)*x*.12]);a.push(k(Z(g,x=>.45*(1-x*.6),[-Math.sin(d),0,Math.cos(d)]),"#2c4a2a",8+r()*.4))}await e.ctx.yield();const w=J(a);await e.ctx.yield();const i=new t.Mesh(w,ve(e));i.frustumCulled=!1,e.scene.add(i)}function ve(e){return e.mk(`
    attribute float aPart; attribute vec3 color;
    varying vec3 vN; varying vec3 vCol; varying vec3 vPu;
    void main(){
      vec3 q = position, nn = normal; float sd = fract(aPart) * 100.;
    #ifdef USE_INSTANCING
      q = (instanceMatrix * vec4(q, 1.)).xyz; nn = mat3(instanceMatrix) * nn; sd += instanceMatrix[3].x * .37 + instanceMatrix[3].z * .11;
    #endif
      vec3 wp = (modelMatrix * vec4(q, 1.)).xyz;
      float t = uv.x;
      if (aPart > 6.5 && aPart < 7.5) {                                  // fronds lift toward the moon and shiver
        wp.y += t * t * (.9 + .5 * sin(uTime * 1.2 + sd * 6.)) + t * .12 * sin(uTime * 5.3 + sd * 9. + t * 6.);
        wp.xz += t * t * .3 * vec2(sin(uTime * .9 + sd * 4.), cos(uTime * 1.1 + sd * 5.));
      } else if ((aPart > 7.5 && aPart < 8.5) || (aPart > 15.5 && aPart < 16.5)) {   // hanging weed sways and drips
        wp.xz += t * t * .22 * vec2(sin(uTime * 1.6 + sd * 7.), cos(uTime * 1.3 + sd * 3.));
      } else if (aPart > 11.5 && aPart < 12.5) {                         // laundry drawn upward, flapping
        wp.y += t * (.25 + .2 * sin(uTime * 2.1 + sd * 5.)) + t * .1 * sin(uTime * 7. + sd * 8. + t * 9.);
        wp.xz += t * .22 * vec2(sin(uTime * 3.1 + sd * 6. + t * 5.), cos(uTime * 2.7 + sd * 2. + t * 4.));
      }
      vN = nn; vCol = color; vPu = vec3(aPart, uv);
      ${V} }`,`
    varying vec3 vN; varying vec3 vCol; varying vec3 vPu;
    void main(){
      vec3 V = normalize(vCam - vLp), n = normalize(vN); float p = vPu.x; vec2 uv = vPu.yz;
      if (dot(n, V) < 0.) n = -n;
      vec3 alb = vCol; float gloss = 0., thin = 0.;
      float depth = tideH(vLp.xz) - vLp.y, dry = step(depth, 0.);
      if (p < 1.5) {                                                      // rock: strata, lichen, a dark weedy tide line
        float st = vn(vec2(vWp.y * 3.2 + vn(vWp.xz * .4) * 3., vWp.x * .2)), tl = smoothstep(.3, -1.2, vWp.y);
        alb *= .62 + .5 * st + .3 * vn(vWp.xz * 1.7);
        alb = mix(alb, vec3(.5, .52, .36), smoothstep(.62, .8, vn(vWp.xz * .9 + 3.)) * smoothstep(.2, .8, n.y) * .5);
        alb = mix(alb, vec3(.07, .12, .08) + .08 * st, tl * .85); gloss = .25 + .5 * tl;
      } else if (p < 2.5) {                                               // tower: white paint, rain streaks, door, small panes
        float a = uv.x, h = uv.y * 29.;
        alb *= .9 + .12 * vn(vec2(a * 60., h * .35)) - .1 * smoothstep(3., 0., h);
        float win = 0.;
        for (int i = 0; i < 3; i++) { float wy = 9. + float(i) * 7.5, wa = .25 + .09 * float(i); win = max(win, smoothstep(.014, .009, abs(fract(a - wa + .5) - .5)) * smoothstep(.75, .6, abs(h - wy))); }
        float door = smoothstep(.022, .018, abs(a - .22)) * smoothstep(3.4, 3.2, h);
        alb = mix(alb, vec3(.07, .1, .14), win); alb = mix(alb, vec3(.2, .3, .42), door);
        alb = mix(alb, vec3(.33, .43, .56), smoothstep(.25, .1, abs(h - 28.4)));
        gloss = .08 + .5 * win;
      } else if (p < 3.25) { gloss = .3; alb *= .85 + .3 * vn(vWp.xy * 2.); }
      else if (p < 3.75) { vec2 g = fract(vec2(uv.x * 40., uv.y)); if (g.x > .16 && uv.y < .86 && uv.y > .1) discard; gloss = .3; }
      else if (p < 4.5) { float mull = step(.86, fract(uv.x * 8.)); alb = mix(vec3(.1, .2, .24), vec3(.33, .43, .56), mull); gloss = 1. - .7 * mull; }
      else if (p < 5.5) { alb *= .8 + .4 * vn(vWp.xz * 6.); gloss = .35; }
      else if (p < 6.5) { alb *= .7 + .45 * step(.5, fract(vWp.y * 2.3 + vn(vWp.xz * 2.))); }
      else if (p < 7.5) {                                                 // frond: a midrib and combed leaflets
        float w = abs(uv.y - .5) * 2., lf = abs(fract(uv.x * 15. - w * 1.6) - .5);
        if (w > .07 && (lf > .3 || w > 1. - uv.x * uv.x * .5)) discard;
        alb *= .75 + .7 * w; thin = .6;
      } else if (p < 8.5 || (p > 15.5 && p < 16.5)) { alb *= .7 + .6 * vn(vec2(uv.x * 9., uv.y * 3. + vWp.x)); gloss = .5; thin = .3;
        if (abs(uv.y - .5) > .5 - .22 * vn(vec2(uv.x * 7., vWp.z))) discard; }
      else if (p < 10.5) { alb *= (.72 + .36 * vn(vec2(vWp.y * 5.5, dot(vWp.xz, vec2(.31, .29))))) * (.8 + .3 * step(.1, fract(vWp.y * 2.6))); gloss = .1 * dry; alb *= mix(.6, 1., smoothstep(-1.4, .6, vWp.y)); }
      else if (p < 11.5) { float s = vn(vec2(dot(vWp.xz, vec2(2.3, 1.7)), vWp.y * .8)); alb *= .7 + .45 * s; alb *= .9 + .14 * smoothstep(.3, .7, fract(vWp.y * 1.4)); }
      else if (p < 12.5) { alb *= .86 + .2 * vn(uv * vec2(5., 14.)); thin = .7; }
      else if (p < 13.5) { if (abs(uv.y - .5) < .38 && fract(uv.x * 9.) > .2) discard; }
      else if (p < 14.5) { alb *= .75 + .4 * vn(vWp.xz * 4.); gloss = .2; }
      else if (p < 15.5) { vec2 g = fract(uv * vec2(7., 3.)); if (g.x > .12 && g.y > .14 && !(g.y > .3 && g.x > .3 && g.x < .86)) discard; alb = mix(alb, vec3(.5, .52, .5), step(.3, g.y) * step(.3, g.x)); }
      float nlB = max(dot(n, uSun), 0.) * moonShade(vLp);                                  // warm bounce off the sand in the shadows
      vec3 ambB = mix(cSlate * .45, mix(cAqua, cIvory, .55) * .5, n.y * .5 + .5) + cIvory * .16 * (1. - n.y * .5) * dry;
      vec3 col = alb * (SUNC * nlB + ambB);
      col += alb * SUNC * thin * .6 * max(dot(-n, uSun), 0.) * moonShade(vLp);
      vec3 R = reflect(-V, n);
      float fres = pow(1. - max(dot(n, V), 0.), 4.);
      col = mix(col, skyCol(vec3(R.x, abs(R.y), R.z)), gloss * (.12 + .7 * fres) * dry);
      col += SUNC * pow(max(dot(R, uSun), 0.), 90.) * gloss * 5. * moonShade(vLp) * dry;
      col = underwater(col, vLp, V);
      gl_FragColor = vec4(fogMix(col), 1.);
    }`,{side:t.DoubleSide})}async function Pe(e){const r=e.rng.fork("village"),c=[],a="#b9a384",n="#c2ad8a",o="#84705a",l="#b89c68";for(const[i,s]of[[-3,-2.6],[3,-2.6],[-3,2.6],[3,2.6],[0,-2.6],[0,2.6]])c.push(k(new t.CylinderGeometry(.13,.17,7.4,5),o,10,[i,3.3,s],[0,0,i*.012]));c.push(k(new t.BoxGeometry(.1,.1,7.6),o,10,[-3,3.2,0],[.85,0,0])),c.push(k(new t.BoxGeometry(.1,.1,7.6),o,10,[3,3.2,0],[-.85,0,0])),c.push(k(new t.BoxGeometry(7.2,.2,6.2),n,10,[0,6.1,0])),c.push(k(new t.BoxGeometry(5,2.3,4),a,10,[-.6,7.35,-.4])),c.push(k(new t.PlaneGeometry(.9,1.7),"#1c1a18",10,[.6,7.1,1.62])),c.push(k(new t.ConeGeometry(4.6,2.9,4,2),l,11,[-.6,9.9,-.4],[0,Math.PI/4,0],[1,1,.86])),c.push(k(new t.CylinderGeometry(.16,.2,1.1,5),o,10,[-2,10.3,-1])),c.push(k(new t.BoxGeometry(9.5,.12,1.15),n,10,[8.3,6.05,.4])),await e.ctx.yield();for(const i of[6.5,11.5])for(const s of[-.1,.9])c.push(k(new t.CylinderGeometry(.09,.11,6.6,4),o,10,[i,2.8,s]));c.push(k(new t.PlaneGeometry(3.1,.62),n,13,[-1.8,4.5,3.13],[0,0,Math.PI/2])),c.push(k(new t.PlaneGeometry(3.2,1.7),n,15,[1.6,7.15,-3]));for(let i=0;i<6;i++){const s=5.2+i*1.15+r.range(-.2,.2),d=r.range(.9,1.5),f=["#d9d6cc","#7f93b4","#3fa7a2","#c9c6bd","#9fb4cc","#e4dccb"][i];c.push(k(Z([[s,7.75,1],[s+.1,7.75+d*.5,1.1],[s+.25,7.75+d,1.3]],()=>.75,[1,0,0]),f,12+r()*.4))}c.push(k(new t.BoxGeometry(7.6,.04,.04),"#5d5548",10,[8,7.75,1]));for(const i of[4.3,11.7])c.push(k(new t.CylinderGeometry(.05,.05,1.8,4),o,10,[i,6.95,1]));c.push(k(new t.SphereGeometry(1,7,4),"#7d6a52",14,[2.2,2.7,3],[0,.3,1.15],[2.5,.34,.5])),c.push(k(new t.BoxGeometry(.05,1.5,.05),"#5d5548",10,[3,5.3,3]));for(let i=0;i<6;i++){const s=[-3,3,0][i%3],d=i<3?-2.6:2.6,f=r.range(1.6,2.6),b=r.range(1,1.9),p=r()*6.28;c.push(k(Z([[s+.16,f,d],[s+.2,f-b*.5,d+.05],[s+.22,f-b,d+.1]],u=>.5*(1-u*.5),[Math.cos(p),0,Math.sin(p)]),"#2c4a2a",16+r()*.4))}await e.ctx.yield();const h=J(c),v=[];for(let i=0;i<3;i++)for(let s=0;s<8&&v.length<22;s++){const d=[22,39,57][i]+r.range(-2.5,3.5)+(i===2?r.range(0,8):0),f=1016+s*12.2+r.range(-2,2)+i*3.5;i===1&&s===3||v.push([d,f,(r()<.75?Math.PI/2:-Math.PI/2)+r.range(-.12,.12)+(r()<.2?Math.PI/2:0),r.range(.9,1.12)])}const m=new t.InstancedMesh(h,ve(e),v.length),w=new t.Object3D;v.forEach(([i,s,d,f],b)=>{w.position.set(i,Math.min(e.bedH(i,s),e.bedH(i+3,s+3),e.bedH(i-3,s-3))-.35,s),w.rotation.set(0,d,0),w.scale.set(f,1,f),w.updateMatrix(),m.setMatrixAt(b,w.matrix)}),m.frustumCulled=!1,e.scene.add(m),e.village=v}async function Ge(e){const{L:r,scene:c,path:a,sunDir:n}=e,o=e.rng.fork("birds"),l=r.H,h=new t.Color().setRGB(l.sunC[0],l.sunC[1],l.sunC[2]),v={sunDir:n,sunColor:h,sunIntensity:r.hourKey==="night"?1.3:2.3,sky:new t.Color(l.pal[4]),skyIntensity:.95,ground:new t.Color(l.pal[2]),groundIntensity:.6},m=j.makeFauna(c,{light:v,rng:o});await e.ctx.yield();const w=r.density>1.12,i=[];for(let p=0;p<14;p++){const u=o.range(-.7,.7),y=o.range(-.35,.35),g=p<10?-9.2+p*.8+y:-11+(p-10)*2.3+y,x=p<10?1218.5-p*1.05+u+p%2*1.6:1203-(p-10)*2.2+u;i.push([g,e.bedH(g,x),x])}const s={body:"#ecece6",belly:"#f4f4f0",wing:"#d9d9d2",neckC:"#f0f0ea",cap:"#f0f0ea",beakC:"#2a2a30",legC:"#2e2a2c"};m.add(j.makeWaders({rng:o,species:w?"heron":"egret",count:i.length,positions:i,size:2.1,active:.8,heightAt:e.bedH,level:G-.25,...s}),{always:!0}),await e.ctx.yield();const d=[];for(let p=0,u=0;d.length<Math.round(46*r.detail)&&u<900;u++){const y=o.range(-95,95),g=o.range(900,1290),x=e.bedH(y,g);Math.abs(y)<12||x-G>.1||x-G<-1.2||d.push([y,x,g])}m.add(j.makeWaders({rng:o,species:"egret",count:d.length,positions:d,size:1.3,heightAt:e.bedH,level:G-.25,...s})),await e.ctx.yield();const f={body:"#ecece6",belly:"#f4f4f0",wingC:"#e6e6e0",tip:"#17171b",trail:"#17171b",neckC:"#ecece6",head:"#ecece6",beak:"#33333a",legC:"#3a3436"};m.add(j.makeFlock({rng:o,species:"flamingos",count:9,size:.85,form:"loose",spread:[7,2.5,12],speed:13,cross:{path:a,u:.085,lead:21,angle:18,side:-1,height:.5,span:180,rise:15,offset:-6,duration:44},...f}),{always:!0}),await e.ctx.yield(),m.add(j.makeFlock({rng:o,species:"gulls",count:9,size:1.15,spread:[2.6,1.3,5],along:{path:a,side:4.2,up:.6,lead:6.5,from:.46,to:.72,drift:1.5}}),{always:!0}),await e.ctx.yield();const b=(p,u,y)=>m.add(j.makeFlock({rng:o,species:"gulls",count:Math.max(4,Math.round(p*r.detail)),size:1.15,center:u,radius:y,height:y*.25}),{range:2600});b(22,[-40,30,995],46),await e.ctx.yield(),b(26,[320,150,560],95),await e.ctx.yield(),b(26,[-250,205,330],85),await e.ctx.yield(),b(18,[70,22,1130],60),e.updates.push((p,u,y,g)=>m.update(p,u,y,g))}function qe(e){const{hero:r}=e,c=(i,s,d)=>new t.Vector3(i,s,d),a=new t.CatmullRomCurve3([c(0,296,0),c(-9,305,1),c(-22,319,3),c(-30,340,5),c(-28,360,3),c(-18,377,1),c(-8,388,0),c(-3,394,0)],!1,"centripetal"),n=new t.TubeGeometry(a,96,1,12,!1),o={value:0},l={value:0},h=r.uniforms,v=t.UniformsUtils.clone(t.UniformsLib.fog);for(const i of["uTime","uSun","uQuiv","SUNC","uSailW","uWind","cIvory","cSlate","cTurq","cDeep","cAqua","cWhite","cOrange"])v[i]=h[i];v.uGrow=o,v.uBreak=l;const m=new t.Mesh(n,new t.ShaderMaterial({uniforms:v,fog:!0,transparent:!0,depthWrite:!0,vertexShader:X+`
    #include <fog_pars_vertex>
    uniform float uGrow, uBreak; varying vec2 vUv; varying vec3 vN; varying vec3 vP; varying vec3 vC; varying float vR;
    void main(){
      float t = uv.x, a = uv.y * 6.2832;
      // the two fronts: the peak climbing, the sheet reaching down; they meet at t = 0.55
      float lo = smoothstep(uGrow * .56 + .001, uGrow * .56 - .12, t), hi = smoothstep(1. - uGrow * .46 - .001, 1. - uGrow * .46 + .12, t);
      float alive = max(lo, hi);
      float tw = sin(a * 2. + t * 34. - uTime * 2.2), strand = .78 + .3 * tw;
      float rad = (3.6 + 3.4 * exp(-t * 9.) + 4.4 * exp(-(1. - t) * 7.) + .5 * sin(t * 19. - uTime * 1.7)) * strand * alive;
      float bead = .5 + .5 * sin(t * 58. + uTime * 1.2);
      rad *= mix(1., smoothstep(.25, .8, bead) * 1.5, uBreak) * (1. - smoothstep(.6, 1., uBreak));
      vec3 c = position - normal;                                                  // centre line (tube radius 1)
      c.xz += vec2(sin(t * 9. + uTime * .8), cos(t * 7. - uTime * .7)) * 1.6 * sin(t * 3.1416) + uQuiv.xy * (1. - t);
      c.y += uBreak * uBreak * 26. * t;                                            // the beads go up, faster and faster
      vec3 lp = c + normal * rad;
      vUv = uv; vN = normalize(normal + vec3(0., .5 * cos(a * 2. + t * 34. - uTime * 2.2), 0.)); vP = lp; vR = rad;
      vC = (cameraPosition - modelMatrix[3].xyz);
      vec4 mvPosition = modelViewMatrix * vec4(lp, 1.);
      gl_Position = projectionMatrix * mvPosition;
      #include <fog_vertex>
    }`,fragmentShader:X+`
    #include <fog_pars_fragment>
    uniform float uGrow, uBreak; varying vec2 vUv; varying vec3 vN; varying vec3 vP; varying vec3 vC; varying float vR;
    void main(){
      if (vR < .06) discard;
      vec3 V = normalize(vC - vP), n = normalize(vN);
      float nv = max(dot(n, V), 0.), fres = pow(1. - nv, 3.);
      vec3 R = reflect(-V, n), Rf = refract(-V, n, .75);
      vec3 body = mix(cTurq * .9, cDeep * 1.05, nv * nv) * (.55 + .5 * max(dot(n, uSun), 0.));
      body = mix(body, skyCol(vec3(-Rf.x, abs(Rf.y), -Rf.z)), .16);                 // a lens: the far sky, upside down
      float t = vUv.x, a = vUv.y;
      float streak = vn(vec2(a * 14., t * 60. - uTime * 3.)); body += cAqua * .25 * smoothstep(.55, .9, streak);
      // fish swimming up it: silver dashes in cells that climb
      vec2 fc = vec2(a * 7., t * 46. - uTime * 2.6), fi = floor(fc), ff = fract(fc) - .5; float fh = h21(fi);
      float fish = smoothstep(.12, .04, abs(ff.x - (fh - .5) * .5 + .08 * sin(ff.y * 9. + uTime * 9.))) * smoothstep(.42, .2, abs(ff.y)) * step(.5, fh);
      body = mix(body, cWhite * (.5 + .7 * h21(fi + 3.)), fish * (1. - fres) * (1. - uBreak));
      vec3 col = mix(body, skyCol(vec3(R.x, abs(R.y), R.z)) * 1.05 + cWhite * .25, fres * fres * .9);
      col += SUNC * pow(max(dot(R, uSun), 0.), 70.) * 5.;
      #ifdef USE_FOG
      col = mix(col, fogColor, 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth));
      #endif
      gl_FragColor = vec4(col, .93);
    }`}));m.frustumCulled=!1,m.renderOrder=5,m.visible=!1,r.object.add(m);const w=t.MathUtils.smoothstep;e.updates.push((i,s,d,f)=>{o.value=w(f,.74,.86),l.value=w(f,.945,.995),m.visible=f>.735})}function de(e,r,c,a,n){return e.mk(`
    varying vec2 vUv;
    void main(){ vec3 wp = position; vUv = uv;
      wp.xz += uv.x * uv.x * ${n?"6.":"1.2"} * vec2(sin(uTime * .5 + position.y * .05), cos(uTime * .4 + position.y * .04));
      ${V} }`,`
    varying vec2 vUv; uniform vec3 uCol; uniform vec3 uPar;
    void main(){
      float t = vUv.x, w = abs(vUv.y - .5) * 2.;
      float nz = ${n?"vn(vec2(vUv.y * 46., t * 5. - uTime * uPar.y)) * .7 + vn(vec2(vUv.y * 13., t * 2.5 - uTime * uPar.y * .7)) * .5":"vn(vec2(vUv.y * 2.5 + 3., t * 5. - uTime * uPar.y)) * .8 + vn(vec2(vUv.y * 6., t * 11. - uTime * uPar.y * 1.4)) * .4"};
      float a = uPar.x * smoothstep(1., ${n?".25":".1"}, w + (nz - .5) * .7) * smoothstep(0., .08, t) * smoothstep(1., ${n?".6":".3"}, t) * (.35 + .9 * nz);
      vec3 col = uCol * (SUNC * (.55 + .45 * moonShade(vLp)) + cAqua * .35);
      gl_FragColor = vec4(fogMix(col), clamp(a, 0., 1.));
    }`,{transparent:!0,depthWrite:!1,side:t.DoubleSide},{uCol:{value:new t.Color(r)},uPar:{value:new t.Vector3(c,a,0)}})}function Le(e){const r=[],c=e.rng.fork("smoke");for(let n=0;n<e.village.length;n+=3){const[o,l]=e.village[n],h=G+10.6,v=[],m=-o/Math.hypot(o,l-U),w=-(l-U)/Math.hypot(o,l-U),i=c.range(.5,1.1);for(let s=0;s<=9;s++){const d=s/9,f=17*d;v.push([o-1.2+m*f*f*.03*i,h+f,l+w*f*f*.03*i])}r.push(Z(v,s=>.5+3.2*s,[-w,0,m]))}if(!r.length)return;for(const n of r)n.setAttribute("color",new t.BufferAttribute(new Float32Array(n.attributes.position.count*3),3)),n.setAttribute("aPart",new t.BufferAttribute(new Float32Array(n.attributes.position.count),1));const a=new t.Mesh(J(r),de(e,"#d8d4cc",.42,.55,!1));a.frustumCulled=!1,a.renderOrder=6,e.scene.add(a)}async function Ee(e){const{sky:r,scene:c,rng:a}=e,n=820,o=300,l=235,h=Y({rng:a,sky:r,at:[[n,l,o,440],[n+210,l+20,o-160,320],[n-60,l+10,o+170,260]],puffs:34,height:.62,opacity:.92,litColor:"#aeb6c4",shadeColor:"#56607a",bottomColor:"#3e4862",wind:[-1.5,0,1]});c.add(h.object),e.updates.push((b,p,u)=>h.update(b,p,u)),await e.ctx.yield();const v=[],m=-n,w=U*.45-o,i=Math.hypot(m,w),s=m/i,d=w/i;for(const[b,p]of[[0,190],[70,130],[-80,150]]){const u=[];for(let g=0;g<=16;g++){const x=g/16,A=270*Math.pow(x,2.4);u.push([n-d*b+s*A,l+10-300*x+190*x*x*x,o+s*b+d*A])}const y=Z(u,()=>p,[-d,0,s]);y.setAttribute("color",new t.BufferAttribute(new Float32Array(y.attributes.position.count*3),3)),y.setAttribute("aPart",new t.BufferAttribute(new Float32Array(y.attributes.position.count),1)),v.push(y)}const f=new t.Mesh(J(v),de(e,"#7f8ca6",.5,.9,!0));f.frustumCulled=!1,f.renderOrder=6,c.add(f)}export{Re as default};
