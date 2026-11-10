import*as z from"three";import{makePath as ta,clamp as ye,lerp as B,smoothstep as F}from"../kit/core.js";import{mergeGeometries as ct}from"three/addons/utils/BufferGeometryUtils.js";import{buildHero as aa,createStyle as oa,STYLE_GLSL as ht,beadQuadGeometry as le,beadMaterial as fe,rowMaterial as Lt,threadMaterial as Kt,threadTubeGeometry as Xt,backingMaterial as na,PALETTE as ra}from"../parts/unstrung-falls.js";const L=z.Vector3,ce=C=>{const E=Math.sin(C*12.9898+4.137)*43758.5453;return E-Math.floor(E)},sa=["#06070F","#7E9BCB","#7A8CAB","#CFDBEA","#F2F0E8","#E4533F","#EEF6FF"],H=Math.PI/180;var ma={id:"unstrung-falls",name:"The Unstrung Falls",category:"wilderness",weirdness:.55,media:["air","open"],async build(C){const E=new z.Scene,ut=C.vary||{},dt=ut.hour||"any",We=!!ut.rare,be=ye(ut.density??1,.7,1.3),he=ye(C.quality?.detail??1,.6,1),ae=C.noise,D=C.rng.fork("uf-look");let j=D.pick([0,0,0,1,1,2,2]);dt==="dawn"||dt==="golden"?j=1:dt==="night"&&j===1&&(j=0);const Me=D.chance(.3)&&!We,Se=D.pick([0,0,0,1,2,2]),W=D.pick([0,0,0,1,2,2]),Y={willowSeed:D.range(0,100),bank:D.range(0,100),ridge:D.range(0,100),curt:D.range(0,6)},ze=(Me?sa:ra).slice();j===1?ze[6]=Me?"#FBE9EA":"#F7E2E4":j===2&&(ze[6]="#DCEBFF");const ft=1,St=(e,t)=>new L(-Math.sin(e*H)*Math.cos(t*H),Math.sin(t*H),Math.cos(e*H)*Math.cos(t*H)).normalize(),Ae=St([42,40,46][j],[17,11,27][j]),Fe=St(104,[25,15,37][j]),N=oa({palette:ze,exposure:ft,moon:Fe,glintGain:j===2?1.9:1.6,deep:Me?"#3E5C9A":ze[1],navy:Me?"#5673AE":null}),Ee=N.uniforms,qt=[];await C.yield();const V=await aa(C,{palette:ze,detail:he,exposure:ft,mirror:!0,style:N,run:We,light:Fe});V.object.rotation.y=Math.PI,V.object.position.set(0,0,300),V.object.updateMatrixWorld(!0),E.add(V.object),await C.yield();const oe=V.anchors,pe=(e,t=new L)=>t.set(-e.x,e.y,300-e.z),ne=(e,t=new L,a=-1)=>pe(V.strandPoint(e,t,a),t),I=pe(oe.portalSeat.position),G=new L(-oe.portalSeat.axis.x,oe.portalSeat.axis.y,-oe.portalSeat.axis.z).normalize(),re=pe(oe.snagTip),Ve=pe(oe.tailTip),De=pe(oe.dropFrom),Ft=new L(I.x-re.x,0,I.z-re.z).normalize(),Ce=new L(Ft.z,0,-Ft.x);let Q=0;{let e=1e9;const t=new L;for(let a=0;a<V.strandLength;a+=1){const r=ne(a,t).distanceToSquared(re);r<e&&(e=r,Q=a)}}const Ue=V.strandLength,Pt=pe(oe.climbFoot),Rt=pe(oe.climbTop),He=I.clone().addScaledVector(G,-62),Pe=e=>new L().lerpVectors(Pt,Rt,e),pt=We?10:0,mt=(e,t,a)=>ne(Q+e).addScaledVector(Ce,t).add(new L(0,a,0)),je=mt(70,12,9.5+pt),Wt=[[0,6,58],[0,6,78],[0,6.4,97],[-3.5,10.5,119],[-1.5,9.2,137],[0,7.5,154],[0,7.6,190],[0,8.2,222],[0,9.6,236],Pe(.045).add(new L(0,-.6,0)),Pe(.2),Pe(.4),Pe(.6),Pe(.8).add(new L(1.2,0,0)),Pe(.95).add(new L(4,-.5,0)),[4,101.6,301],[2,101.3,313],[0,101.8,326],[-2,103,340],[-2,105,352],[4,107.5,364],[12,112,377],[18,122,392],[12,136,409],[-1,147,422],mt(30,14.5,3.5+pt*.4),mt(50,12,5.5+pt),je,new L().lerpVectors(je,He,.34),new L().lerpVectors(je,He,.67),He,I.clone().addScaledVector(G,-31),I.clone()],K=ta(Wt,{samples:480});await C.yield();const se=e=>{let t=0,a=1e18;const r=new L;for(let o=0;o<=600;o++){K.pointAt(o/600,r);const n=e(r,o/600);n<a&&(a=n,t=o/600)}return t},kt=se(e=>Math.abs(e.z-150)+(e.y>30?1e6:0)),ge=se(e=>e.distanceTo(Pt)),Z=se(e=>e.distanceTo(Rt));await C.yield();const ia=se(e=>e.distanceTo(new L(-1.5,102.6,335))),J=se(e=>Math.abs(e.z-362)+(e.y<100?1e6:0)),Vt=se(e=>Math.abs(e.z-205)+(e.y>30?1e6:0));await C.yield();const ie=se(e=>Math.abs(e.z-352)+(e.y<100?1e6:0)),me=se(e=>Math.abs(e.z-406)+(e.y<100?1e6:0));await C.yield();const wt=se(e=>Math.abs(e.z-366)+(e.y<100?1e6:0)),gt=se(e=>e.distanceTo(He)),Bt=se(e=>e.distanceTo(je));await C.yield();const Gt=e=>{let t=1.3;return t=B(t,1.1,F(kt-.05,kt+.03,e)),t=B(t,.95,F(ge-.04,ge+.03,e)),t=B(t,.9,F(Z-.045,Z+.015,e)),t=B(t,1.4,F(Z+.012,Z+.05,e)),t=B(t,.4,F(ie-.05,ie,e)),t=B(t,1.2,F(me,me+.07,e)),B(t,1,F(.84,.92,e))},Tt=42,Ye=new Float32Array(257);{let e=0;for(let t=1;t<=256;t++)e+=1/ye(Gt((t-.5)/256),.35,2.5),Ye[t]=e;for(let t=1;t<=256;t++)Ye[t]*=Tt/e}const Ze=e=>{const t=ye(e,0,1)*256,a=Math.min(255,Math.floor(t));return B(Ye[a],Ye[a+1],t-a)},Ut=Ze(Vt),vt=Ze(J)-.8,la=e=>{let t=0,a=1;for(let r=0;r<20;r++){const o=(t+a)/2;Ze(o)<e?t=o:a=o}return t};await C.yield();const Re={uGF:{value:new z.Vector4(400,Se===1?0:1,Se===2?1:0,Se===1?.25:1)},uCamP:{value:new L(0,6,0)},uPart:{value:1}},_e=`
      uniform vec4 uGF; uniform vec3 uCamP; uniform float uPart;
      // 0..1: how hard the air pushes at p. One front travelling down the gorge at 12 m/s, relaxing over ten seconds
      // behind it; in a steady wind, a front every five seconds, the beads relaxing to blue well before the next.
      float gustAt(vec3 p){
        float b = p.z - uGF.x;
        // (behind the front the beads relax along a slanting edge, lower rows last: the turned stretch is a band some
        // 50 m long crossing the wall, and the walls beside the fall are never turned: they stay its dark flanks)
        float one = smoothstep(0., 9., b)*(1. - smoothstep(40., 60., b + 0.55*p.y))*(1. - uGF.z);
        // (the front slants across a cliff face, so on the buttress it is one silver band a quarter of the face wide)
        float f = fract((p.z + 0.34*abs(p.x) - 0.3*p.y + 12.*uTime)/60. + 0.05*sin(p.x*0.03));
        float train = smoothstep(0., 0.05, f)*(1. - smoothstep(0.07, 0.2, f))*uGF.z;
        return (one + train)*uGF.y*(1. - smoothstep(254., 274., p.z));
      }
      // a fringe that is let down as we come: 0.03 (its beads bunched at the bough) far off, 1 (hanging its full length) near
      float letK(vec2 xz, float ph){ float d = length(xz - uCamP.xz); return max(1. - smoothstep(11. + 3.*ph, 30. + 3.*ph, d), 0.03); }
      // the bead curtain is let down as we come: metres of each strand released (its crystal weight runs down the
      // thread and the bugles come off the roll behind it), the outer strands first
      float curtRel(float ph){ return 84.*(1. - smoothstep(26., 62., 150. - uCamP.z - ph*14.)); }
      // a strung bead d metres down its strand from the pivot: pendulum with lag running down the strand, pushed
      // down-gorge by the gust, and swung aside from the moth (rad = how far it clears us)
      vec3 swayAt(vec3 p, float d, float ph, float rad){
        float cu = rad < -6.5 ? 1. : 0.;                                 // a strand of the curtain: long and heavy
        float g = (gustAt(p + vec3(0., 0., -d*0.9))*(1. - 0.3*uGF.z) + 0.3*uGF.z)*(1. - 0.72*cu);
        float a = (0.035*sin(uTime*0.85 + ph*6.283 - d*0.21) + 0.02*sin(uTime*1.37 + ph*17. - d*0.33))*uGF.w;
        float c = 0.03*sin(uTime*0.61 + ph*11. - d*0.17)*uGF.w*(1. - 0.55*cu) + cu*0.012*sin(uTime*1.9 + ph*23. - d*0.38);
        vec3 o = vec3(c*d, 0., -(a + 0.42*g + 0.05*g*sin(uTime*2.1 + ph*40. - d*0.4))*d);
        o.y = 0.14*g*g*d;
        if (cu > 0.5) {                                                  // it swings out from the moth as a pendulum and clacks back behind
          vec2 dc = (p.xz + o.xz - uCamP.xz)*vec2(1., 0.42); float lc = length(dc);
          float nr = (1. - smoothstep(5.5, 11.5, lc))*uPart; float dk = clamp(d/62., 0., 1.); nr *= dk*sqrt(dk);
          o.x += (p.x > uCamP.x ? 1. : -1.)*nr*2.6; o.z += 0.6*nr*sin(uTime*5. + ph*30.);
          return o;
        }
        float zs = 1.;
        vec2 dx = (p.xz + o.xz - uCamP.xz)*vec2(1., zs); float l = length(dx);
        float near = (1. - smoothstep(rad*0.55, rad, l))*(1. - smoothstep(4., 9., abs(p.y - uCamP.y)))*min(d*0.3, 1.)*uPart;
        vec2 dir = l > 1e-3 ? dx/l : vec2(1., 0.);
        dir = normalize(vec2(dir.x + (p.x > uCamP.x ? 0.9 : -0.9), dir.y*0.35));
        o.xz += dir*near*(rad - l*0.6);
        return o;
      }`,Et=[];function Dt(e){const t={name:e,p:[],ax:[],k:[],s:[],n:0,add(a,r,o,n,c,f,s,h,i=0,l=0,u=0,d=0,x=0,w=0){t.p.push(a,r,o,n),t.ax.push(c,f,s),t.k.push(h,i,(t.n*.61803+d)%1,l),t.s.push(u,d,x,w),t.n++}};return Et.push(t),t}const Ht=fe(N,{uniforms:Re,header:`attribute vec4 aP, aK, aS; attribute vec3 aAx; ${_e}`,body:`
      C = aP.xyz; R = aP.w; SEED = aK.z; LINED = aK.w;
      float hang = aS.x;
      if (aS.z > 6.5) { float lk = letK(aP.xz, aS.y); C.y += hang*(1. - lk); hang *= lk; }     // its beads slide down their thread from the bough
      vec3 P0 = aP.xyz;
      if (aS.z < -6.5) {                                  // a bead of the curtain: on the roll until its strand is let down past it
        float rel = curtRel(aS.y);
        if (aS.w < 0.5) R *= smoothstep(-0.4, 2.2, rel - hang);
        if (hang > rel) { C.y += hang - rel; hang = rel; }
        P0 = C;
      }
      if (hang > 0.) C += swayAt(P0, hang, aS.y, aS.z);
      if (aS.z > 3.25 && aS.z < 3.35) R *= 1. - smoothstep(80., 140., length(aP.xyz - cameraPosition));
      AX = aAx*inversesqrt(max(dot(aAx, aAx), 1e-6));
      vec3 e = cross(AX, vec3(0.2, 0.9, 0.4)); if (dot(e, e) < 1e-3) e = vec3(1., 0., 0.); E1 = normalize(e);
      float ci = aK.x;
      COLA = ci < 0.5 ? uBlue : (ci < 1.5 ? uSlate : (ci < 2.5 ? uSilver : (ci < 3.5 ? uPearl : (ci < 4.5 ? uCoral : (ci < 5.5 ? uThread : (ci < 6.5 ? mix(uSilver, uGlint, 0.55) : (ci < 7.5 ? uVelvet*2.6 + vec3(0.015) : uNavy)))))));
      if (aS.x <= 0. && aS.y > 0.5) {                     // a bead of the inner gorge walls: far off (from the river) the wall is one plain midnight, the fall's dark flank
        float far = smoothstep(85., 150., length(aP.xyz - cameraPosition));
        if (ci < 0.5) COLA = uDeep;
        COLA = mix(COLA, uDeep, far); LINED *= 1. - far;
      }
      COLB = COLA;
      if (aS.w > 0.5 && aS.z > -6.5) {                    // a two-tone bead on a wall: the gust turns it blue to silver
        float tn = clamp(gustAt(aP.xyz)*1.6, 0., 1.)*(1. - smoothstep(55., 100., length(aP.xyz - cameraPosition)));
        COLB = uSilver; LINED = tn; float th = (tn - 0.5)*3.14159;
        E1 = normalize(cross(AX, vec3(0.3, 0.2, 0.9)))*cos(th) + normalize(cross(AX, cross(AX, vec3(0.3, 0.2, 0.9))))*sin(th);
        if (tn > 0.98) COLA = uSilver; if (tn < 0.02) COLB = COLA;
      }
      KIND = aK.y > 0.5 && aK.y < 1.5 ? 1. : 0.; LEN = aK.y > 2.5 ? 3. : (aK.y > 1.5 ? 0.6 : 0.);
      if (aS.x > 0. && abs(ci - 4.) > 0.5 && aS.z > -6.5) {              // strung seed beads too far to draw are held to a couple of pixels: they take the tone of the bank behind them instead of adding up to a veil
        float pxd = 2.*R*projectionMatrix[1][1]*uResY*0.5/max(-(viewMatrix*vec4(C, 1.)).z, 0.05);
        float cov = clamp(pxd/2.4, 0.25, 1.);
        vec3 dim = aP.x > 0. ? mix(uSilver, uSlate, 0.3) : mix(uBlue, uSlate, 0.2);
        COLA = mix(dim, COLA, cov); COLB = mix(dim, COLB, cov);
      }`});async function jt(e){const t=le(e.n);t.setAttribute("aP",new z.InstancedBufferAttribute(new Float32Array(e.p),4)),await C.yield(),t.setAttribute("aAx",new z.InstancedBufferAttribute(new Float32Array(e.ax),3)),await C.yield(),t.setAttribute("aK",new z.InstancedBufferAttribute(new Float32Array(e.k),4)),await C.yield(),t.setAttribute("aS",new z.InstancedBufferAttribute(new Float32Array(e.s),4)),await C.yield();const a=new z.Mesh(t,Ht);return a.frustumCulled=!1,a.name=e.name,E.add(a),e.p=e.ax=e.k=e.s=null,a}function Ie(e,t,a){const r=new Float32Array((e+1)*(t+1)*3),o=new Float32Array((e+1)*(t+1)*2),n=[],c=[0,0,0,0,0];for(let s=0,h=0;s<=t;s++)for(let i=0;i<=e;i++,h++)a(i/e,s/t,c),r[h*3]=c[0],r[h*3+1]=c[1],r[h*3+2]=c[2],o[h*2]=c[3],o[h*2+1]=c[4];for(let s=0;s<t;s++)for(let h=0;h<e;h++){const i=s*(e+1)+h,l=i+e+1;n.push(i,i+1,l,i+1,l+1,l)}const f=new z.BufferGeometry;return f.setAttribute("position",new z.BufferAttribute(r,3)),f.setAttribute("uv",new z.BufferAttribute(o,2)),f.setIndex(n),f.computeVertexNormals(),f}await C.yield();const ke=e=>.9*Math.cos(ye(e/17,-1.5,1.5))+3.5*F(15,24,Math.abs(e))-.4,Be=e=>23-3*F(150,215,e)+1.5*F(245,300,e),xt=e=>150+.17*(e-23)-11*Math.exp(-(((e-42)/19)**2))+4*ae.n2(e*.02+Y.ridge,3.1),Ne=(e,t)=>Math.pow(Math.pow(Math.abs(e)/60,2.6)+Math.pow(Math.abs(t-372)/74,2.6),1/2.6),$e=pe(oe.pinnacleFoot),Le=(e,t)=>{const a=Ne(e,t),r=Math.abs(e),o=113+9*ae.fbm2(e*.011+Y.ridge,t*.011,3)+16*Math.exp(-(((r-95)/40)**2)-((t-185)/45)**2)-60*Math.exp(-(((r-26)/26)**2)-((t-156)/34)**2)+27*Math.exp(-(((r-46)/27)**2)-((t-266)/40)**2)+14*Math.exp(-((e-$e.x)**2+(t-$e.z)**2)/2600);let c=B(95.5,o,Math.max(F(1.1,1.7,a),1-F(292,322,t)))-78*F(120,300,r)*(1-F(260,420,t))-60*F(240,330,r)-60*F(640,800,t);if(t>425){const f=K.nearestXZ(e,t);c=Math.min(c,f.y-11.5+.011*f.dist*f.dist)}return c},ve=(e,t)=>{const a=Math.abs(e);return ke(e)+.07*Math.max(a-24,0)+34*F(70,230,a)*(.7+.5*ae.n2(e*.01,t*.012+Y.bank))+1.6*ae.n2(e*.05+Y.bank,t*.05)*F(22,40,a)},Ge=[];for(const e of[1,-1]){const t=[];for(let h=300;h>Be(150)+9;h-=9)t.push(new L(e*h,0,xt(h)));for(let h=161;h<=306;h+=8)t.push(new L(e*(Be(h)+1.1*ae.n2(h*.045+e*7,Y.ridge)),0,h));const a=new z.CatmullRomCurve3(t,!1,"centripetal");a.arcLengthDivisions=400;const r=a.getLength(),o=Math.ceil(r/2.5),n=a.getSpacedPoints(o),c=[];let f=0,s=1e9;for(let h=0;h<=o;h++){const i=n[Math.max(0,h-1)],l=n[Math.min(o,h+1)],u=l.x-i.x,d=l.z-i.z,x=Math.hypot(u,d)||1;c.push([d/x*e,-u/x*e]),Math.abs(n[h].x)<60&&n[h].z<s&&(s=n[h].z,f=h*2.5)}Ge.push({sd:e,P:n,Nn:c,n:o,L:o*2.5,sCorner:f+14})}await C.yield();function _(e,t,a,r){const o=ye(t/2.5,0,e.n),n=Math.min(e.n-1,Math.floor(o)),c=o-n,f=B(e.P[n].x,e.P[n+1].x,c),s=B(e.P[n].z,e.P[n+1].z,c),h=B(e.Nn[n][0],e.Nn[n+1][0],c),i=B(e.Nn[n][1],e.Nn[n+1][1],c),l=1-F(e.sCorner-8,e.sCorner+4,t),u=Math.pow(Math.abs(Math.sin(t*.085+e.sd)),3)*(1.6+2.4*l)+1.3*ae.n2(t*.04+e.sd*9,a*.03+Y.ridge),d=(e.sd>0?.035:.05)*a+2.6*F(27,30.5,a)+2.6*F(62,66,a)-u*F(0,12,a)*(1-.5*F(60,110,a))+3-2*F(232,288,s)*F(55,100,a)*(1-l);return r[0]=f+h*d,r[1]=a,r[2]=s+i*d,r[3]=t,r[4]=a+d*.6,r[5]=h,r[6]=i,r}const Qe=(e,t)=>{const a=_(e,t,100,[0,0,0,0,0,0,0]);return Le(a[0]+a[5]*3,a[2]+a[6]*3)},It=`
      // the zigzag pattern every cliff carries: returns 0 body, 1 accent (three rows), 2 pearl (one row), 3 slate row
      float bandOf(float cl, float rw){
        float zz = abs(mod(cl*0.5 + 600., 26.) - 13.), band = mod(rw - zz + 800., 17.);
        return mod(rw, 34.) < 1. ? 3. : (band < 3. ? 1. : (band < 4. ? 2. : 0.));
      }`,Oe=(e,t)=>{const a=Math.abs(((e*.5+600)%26+26)%26-13),r=((t-a+800)%17+17)%17;return(t%34+34)%34<1?3:r<3?1:r<4?2:0},yt=Lt(N,{uniforms:Re,header:"attribute vec2 aAux;",vertex:"AUX = vec4(aAux, 0., 0.);",fragHeader:_e+It,fragment:`
      float front = AUX.x; float sd = AUX.y;
      PITCH = front > 1.5 ? 1.6 : (front > 0.5 ? 3. : 1.2); if (front > 2.5) DARK = 1.;   // the massif's top lies under impostor beads
      if (front < 0.5 && uv.y > 60.) { PITCH = 2.4; DARK = 1.; }                     // the upper gorge walls: 2.4 m beads (real ones lie on them)
      float farW = (1. - smoothstep(0.3, 0.7, front))*smoothstep(85., 150., length(vVP));   // far off the inner walls are one plain midnight
      vec2 pc = (floor(uv/41.) + 0.5)*41. + (vec2(hash2(floor(uv/41.)), hash2(floor(uv/41.) + 7.3)) - 0.5)*22.;
      vec2 pd = uv - pc; uv -= pd*exp(-dot(pd, pd)/(30.*PITCH))*0.4;                 // a pucker: tension pulled too tight
      float rw = floor(uv.y/PITCH), cl = floor(uv.x/PITCH + 0.5*mod(rw, 2.));
      float bd = bandOf(cl, rw);
      // Values are grouped: each wall is one calm plane, its zigzag in a tone close to its body. The buttress that
      // faces the moon (left) is slate with navy rows and one silver-lined row; the rest is midnight with navy rows. Up the gorge
      // both walls are the fall's dark flanks (a deeper blue in frost); the valley floor is a slate and navy carpet.
      float inner = 1. - smoothstep(0.3, 0.7, front), floorK = step(1.5, front)*step(front, 2.5);
      vec3 body = mix(uBlue, uDeep, inner), acc = uNavy;
      COLW = uSlate;
      if (sd > 0.) {                                                                 // the left side
        // (up the gorge it changes bead by bead to midnight, so the fall stands between dark walls)
        float inn = clamp(sd - 1., 0., 1.);
        vec2 fwc = fwidth(vRow); float pxl = PITCH/max(max(fwc.x, fwc.y), 1e-5);
        float sel = max(mix(inn, step(hash2(vec2(cl, rw)*1.31 + 2.7), inn), smoothstep(3., 6.5, pxl)), floorK);
        float thin = step(1.5, bd)*step(bd, 2.5);                                    // the one row of the zigzag that is silver-lined
        vec3 lb = mix(uSlate, mix(body, uSlate, floorK), sel), la = mix(mix(uNavy, uSilver, thin), acc, sel);
        COLA = bd > 0.5 ? la : lb; COLB = COLA; LINED = (1. - sel)*thin;
      } else {                                                                       // the right side: the gust turns it
        COLA = bd > 0.5 ? acc : body; COLB = uSilver;
        if (bd < 0.5) { TURN = clamp(gustAt(vWP)*1.6, 0., 1.)*(1. - smoothstep(55., 100., length(vVP))); LINED = TURN; } else COLB = COLA;   // (the turn shows on the walls beside us, never far off beside the fall)
      }
      COLA = mix(COLA, uDeep, farW); COLB = mix(COLB, uDeep, farW); LINED *= 1. - farW;`,side:z.DoubleSide}),ue=Dt("fixed-beads");for(const e of Ge){const t=Math.round(e.L/5),a=30,r=new Float32Array((t+1)*(a+1)*2),o=[0,0,0,0,0,0,0],n=new Float32Array(t+1),c=new Float32Array((t+1)*(a+1)*5);for(let i=0;i<=t;i++)n[i]=Qe(e,i/t*e.L);await C.yield();for(let i=0,l=0;i<=a;i++){for(let u=0;u<=t;u++,l++){const d=u/t,x=i/a,w=d*e.L,g=n[u],b=Math.max(0,(x-.9)/.1),M=B(-4,g,Math.min(x/.9,1)**.85);_(e,w,M,o),c[l*5]=o[0]+o[5]*b*7,c[l*5+1]=M-b*b*1.2,c[l*5+2]=o[2]+o[6]*b*7,c[l*5+3]=o[3],c[l*5+4]=o[4]+b*7}i%6===5&&await C.yield()}let f=0;const s=Ie(t,a,(i,l,u)=>{for(let d=0;d<5;d++)u[d]=c[f+d];f+=5});for(let i=0,l=0;i<=a;i++)for(let u=0;u<=t;u++,l++)r[l*2]=u/t*e.L<e.sCorner?1:0,r[l*2+1]=e.sd>0?1+F(e.sCorner-6,e.sCorner+8,u/t*e.L):e.sd;if(s.setAttribute("aAux",new z.BufferAttribute(r,2)),e.sd>0){const i=s.index.array;for(let l=0;l<i.length;l+=3){const u=i[l+1];i[l+1]=i[l+2],i[l+2]=u}s.computeVertexNormals()}const h=new z.Mesh(s,yt);h.name="cliff"+e.sd,E.add(h),await C.yield();for(let i=2;i<e.L;){const l=i<e.sCorner,u=l?1.55:.95,d=Math.round(i),x=Qe(e,i);_(e,i,x,o);const w=d%11===3?1:l&&e.sd>0?d%5===0?2:1:d%5===0?8:0;ue.add(o[0],x+u*.55,o[2],u,-o[6],0,o[5],w,d%7===0&&l?1:2,w===2?1:0,0,l?0:1,0,0),i+=u*2.05+(l?0:.5)}}await C.yield();{const c=new Uint8Array(10185),f=new Float32Array(10185*3);for(let d=0,x=0;d<=96;d++){for(let w=0;w<=104;w++,x++){let g=B(-330,330,w/104),b=B(128,800,d/96),M=0;const p=xt(Math.max(Math.abs(g),23))+7;b<p&&(b=p,M=1),b<314&&Math.abs(g)<Be(b)+8&&(g=(g>=0?1:-1)*(Be(b)+8),M=1);const m=Ne(g,b);m<1.05&&(m<.05?(g=63,b=372):(g*=1.05/m,b=372+(b-372)*1.05/m),M=1),c[x]=M,f[x*3]=g,f[x*3+1]=Le(g,b)-(M?.8:1.1),f[x*3+2]=b}await C.yield()}const s=Ie(104,96,(d,x,w)=>{const g=Math.round(x*96)*105+Math.round(d*104);w[0]=f[g*3],w[1]=f[g*3+1],w[2]=f[g*3+2],w[3]=w[0],w[4]=w[2]});await C.yield();const h=s.index.array,i=[];for(let d=0;d<h.length;d+=6)if(!(c[h[d]]&&c[h[d+1]]&&c[h[d+2]]&&c[h[d+5]]))for(let x=0;x<6;x++)i.push(h[d+x]);s.setIndex(i),s.computeVertexNormals();const l=new Float32Array(10185*2);for(let d=0;d<l.length;d+=2)l[d]=3,l[d+1]=-1;s.setAttribute("aAux",new z.BufferAttribute(l,2));const u=new z.Mesh(s,yt);u.name="massif-top",E.add(u)}await C.yield();{const a=new Float32Array(4558),r=Ie(52,42,(n,c,f)=>{const s=n*2-1,h=Math.sign(s)*Math.pow(Math.abs(s),1.7)*300,i=B(-170,215,c),l=Math.abs(h);f[0]=h,f[2]=i,f[1]=ve(h,i)-1.6*(1-F(18.5,22.5,l)),f[3]=i,f[4]=h;const u=(Math.round(c*42)*53+Math.round(n*52))*2;a[u]=2,a[u+1]=h>0?1:-1});r.setAttribute("aAux",new z.BufferAttribute(a,2));const o=new z.Mesh(r,yt);o.name="valley",E.add(o)}await C.yield();const bt={uFlow:{value:0}};{const e=Ie(22,44,(r,o,n)=>{n[0]=B(-22.5,22.5,r),n[2]=B(202,-170,o),n[1]=ke(n[0]),n[3]=300-n[2],n[4]=-n[0]}),t=Lt(N,{uniforms:bt,side:z.DoubleSide,fragHeader:"uniform float uFlow;",fragment:`
        PITCH = 1.4; ROLL = 1.; SHEAR = 0.7; SCROLL = uFlow*3.; COLA = uSlate; COLB = mix(uSlate, uBlue, 0.6); COLW = uNavy; LINED = 0.; BRICK = 0.; GLINT = 0.5;
        if (mod(floor(uv.y/PITCH), 5.) < 1.) { COLA = uNavy; COLB = uBlue; }`}),a=new z.Mesh(e,t);a.name="river-bed",E.add(a)}const Je=380,Yt=214;{const t=Math.round(250*he),a=21*t,r=new Float32Array(a*4),o=D.fork("river");for(let s=0,h=0;s<21;s++)for(let i=0;i<t;i++,h++){const l=o.chance(.07);r[h*4]=(s-20/2)*1.5+o.range(-.15,.15),r[h*4+1]=(i+o.range(.1,.9))/t,r[h*4+2]=l?o.range(.85,1.15):o.range(.52,.72),r[h*4+3]=o()}const n=le(a);n.setAttribute("aL",new z.InstancedBufferAttribute(r,4));const c=fe(N,{uniforms:bt,header:"attribute vec4 aL; uniform float uFlow;",body:`
        float lane = floor(aL.x/1.5 + 10.5), big = step(0.8, aL.z);
        float sp = 3.*(1. + 0.5*(hash1(lane) - 0.5))*(1. - 0.55*big);
        float d = fract(aL.y + uFlow*sp/${Je.toFixed(1)})*${Je.toFixed(1)};       // metres travelled from the top
        float z = ${Yt.toFixed(1)} - d;
        R = aL.z*smoothstep(0., 14., d)*(1. - smoothstep(${(Je-20).toFixed(1)}, ${Je.toFixed(1)}, d));
        float x = aL.x + sin(z*0.05 + lane)*0.25;
        C = vec3(x, 0.9*cos(clamp(x/17., -1.5, 1.5)) - 0.4 + 3.5*smoothstep(15., 24., abs(x)) + R*0.72 + 0.12*sin(uFlow*2.3 + aL.w*40.), z);
        float ang = d/max(aL.z, 0.2) + aL.w*6.283;
        AX = normalize(vec3(1., 0.25*(aL.w - 0.5), 0.3*(aL.w - 0.5))); E1 = normalize(cross(AX, vec3(0., cos(ang), sin(ang))));
        COLA = uPearl; COLB = aL.w < 0.3 ? uSilver : (aL.w > 0.955 ? uSlate : mix(uPearl, uSilver, 0.5)); LINED = aL.w < 0.3 ? 1. : 0.25; SEED = aL.w;
        // the river is strung in lanes as it leaves the fall: every third lane pearl, the two between slate and midnight
        // (one wrong bead here and there), so the floor is dark with white rows running to the fall's stroke
        float dl = step(0.5, mod(lane, 5.))*smoothstep(8., 40., d)*step(aL.w, 0.975);
        COLA = mix(COLA, mod(lane, 2.) < 0.5 ? uSlate : uBlue, dl); COLB = mix(COLB, mod(lane, 2.) < 0.5 ? mix(uSlate, uBlue, 0.5) : mix(uBlue, uSlate, 0.35), dl); LINED *= 1. - dl;
        if (big > 0.5) { KIND = aL.w > 0.6 ? 1. : 0.; COLA = KIND > 0.5 ? mix(uSilver, uGlint, 0.5) : uPearl; COLB = COLA; LINED = 0.25; }`}),f=new z.Mesh(n,c);f.frustumCulled=!1,f.name="river-beads",E.add(f)}await C.yield();for(let e=-1;e<=1;e+=2)for(let t=0;t<2;t++)for(let a=-150+t*1.6;a<199;a+=3.15){const r=-e*(19.5+t*3.3+Math.sin((300-a)*.11)*1.2),o=1.5-t*.25,n=Math.round(300-a)+t,c=n%9===0?e<0?2:1:t?8:e<0?1:0;ue.add(r,ke(r)+o*.7,a,o,.2*e,.1,1,c,n%13===0?1:0,c===2?1:0)}{const e=[0,0,0,0,0,0,0],t=1.2,a=D.fork("near");let r=0,o=0;for(const f of Ge)for(let s=0;s<50;s++)for(let h=Math.ceil((f.sCorner+3)/t);h*t<f.L-4;h++){++o%300===0&&await C.yield();const i=(h+.5-.5*(s%2))*t,l=(s+.5)*t;let u=l-2;if(_(f,i,u,e),u+=l-e[4],_(f,i,u,e),u+=l-e[4],_(f,i,u,e),u<ke(e[0])-.3)continue;const d=Oe(h,s),x=a()<.045;let w,g=0,b=0;w=x?1:d===0?0:8,b=f.sd<0&&w===0?1:0,f.sd>0&&ce(h*1.31+s*57.7)>=F(f.sCorner-6,f.sCorner+8,i)&&(w=x?0:d===0?1:d===2?2:8,g=w===2?1:0),ue.add(e[0]-e[5]*.34,u,e[2]-e[6]*.34,t*.49,e[6],0,-e[5],w,0,g,0,1,0,b),++r%800===0&&await C.yield()}const n=2.4;for(const f of Ge)for(let s=25;s<62;s++)for(let h=Math.ceil((f.sCorner+2)/n);h*n<f.L-2;h++){++o%200===0&&await C.yield();const i=(h+.5-.5*(s%2))*n,l=(s+.5)*n,u=Qe(f,i);_(f,i,u,e);const d=e[4];let x,w,g;if(l>d){const v=(l-d)/7;if(v>1.05)continue;x=e[0]+e[5]*v*7,w=u-v*v*1.2+.5,g=e[2]+e[6]*v*7}else{let v=l-4;_(f,i,v,e),v+=l-e[4],_(f,i,v,e),v+=l-e[4],_(f,i,v,e),x=e[0]-e[5]*.6,w=v,g=e[2]-e[6]*.6}const b=Oe(h,s),M=a()<.045;let p,m=0,y=0;p=M?1:b===0?0:8,y=f.sd<0&&p===0?1:0,ue.add(x,w,g,n*.49,e[6],0,-e[5],p,0,m,0,1,0,y),++r%800===0&&await C.yield()}const c=3;for(const f of Ge)for(let s=0;s<46;s++)for(let h=Math.ceil((f.sCorner-165)/c);h*c<f.sCorner;h++){++o%200===0&&await C.yield();const i=(h+.5-.5*(s%2))*c,l=(s+.5)*c;let u=l-2;if(_(f,i,u,e),u+=l-e[4],_(f,i,u,e),u+=l-e[4],_(f,i,u,e),u>Qe(f,i)-1.2||u<ve(e[0],e[2])-1)continue;const d=Oe(h,s),x=a()<.045;let w,g=0,b=0;f.sd>0?(w=x?0:d===0?1:d===2?2:8,g=w===2?1:0):(w=x?1:d===0?0:8,b=w===0?1:0),ue.add(e[0]-e[5]*.8,u,e[2]-e[6]*.8,c*.49,e[6],0,-e[5],w,0,g,0,0,0,b),++r%800===0&&await C.yield()}}await C.yield();const Zt=N.sceneColor(j===1?"#1C1846":"#0E1838"),_t=N.sceneColor(ze[0]);{const e=new z.Mesh(new z.SphereGeometry(1,24,12),new z.ShaderMaterial({uniforms:{uA:{value:_t},uB:{value:Zt},uC:{value:Ee.uBlue.value},uD:{value:Ee.uSlate.value},uE:{value:Ee.uSilver.value},uMz:{value:new z.Vector2(Ae.x,Ae.z).normalize()}},side:z.BackSide,depthWrite:!1,depthTest:!1,vertexShader:"varying vec3 vD; void main(){ vD = position; vec4 p = projectionMatrix*viewMatrix*vec4(position*100. + cameraPosition, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }",fragmentShader:`uniform vec3 uA, uB, uC, uD, uE; uniform vec2 uMz; varying vec3 vD;
          float hs(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
          void main(){ vec3 d = vD*inversesqrt(max(dot(vD, vD), 1e-6));
            float el = asin(clamp(d.y, -1., 1.))*57.2958, az = atan(d.x, abs(d.z) < 1e-5 ? 1e-5 : d.z)*57.2958;
            float hl = max(length(d.xz), 1e-4), toM = 0.5 + 0.5*dot(d.xz/hl, uMz), lift = 0.5 + 0.5*toM*toM;
            const float P = 1.25; float row = floor(el/P), e = (row + 0.5)*P;
            float cf = az*max(cos(e*0.0174533), 0.25)/P + 0.5*mod(row, 2.);
            vec2 f = vec2(fract(cf), fract(el/P))*2. - 1.; float r = length(f);
            float t = max(e, 0.)/lift + 2.2*(hs(vec2(floor(cf), row)) - 0.5);
            vec3 c = t < 5.5 ? mix(uD, uE, 0.45) : (t < 8.5 ? uD : (t < 15. ? uC : (t < 23. ? uB : uA)));
            if (hs(vec2(row, floor(cf))*1.7 + 3.) < 0.045) c = t < 15. ? uB : uC;                 // the wrong bead
            float px = P*0.0174533/max(fwidth(d.y), 1e-6);
            // (sewn by hand, not printed: the beads differ in size, and the higher rows are sewn ever more sparsely into the black)
            float sz = 0.6 + 0.28*hs(vec2(floor(cf), row)*2.3 + 1.7), gone = step(hs(vec2(floor(cf), row)*0.7 + 9.1), clamp((t - 10.)/28., 0., 0.5));
            float aa = 2.4/max(px, 1.), inside = (1. - smoothstep(sz - aa, sz, r))*(1. - gone);
            vec3 bead = c*(1. - 0.34*r*r);
            gl_FragColor = vec4(mix(mix(uA, c, 0.5*(1. - gone)), mix(uA, bead, inside), smoothstep(3., 6., px))*step(-9., e) + uA*(1. - step(-9., e)), 1.); }`}));e.renderOrder=-3,e.frustumCulled=!1,e.name="velvet",E.add(e);const t=44,a=900+t,r=new Float32Array(a*4),o=D.fork("stars");for(let p=0;p<900;p++){const m=Math.pow(o(),.75)*.97+.02,y=o()*Math.PI*2,v=Math.sqrt(1-m*m);r[p*4]=Math.cos(y)*v,r[p*4+1]=m,r[p*4+2]=Math.sin(y)*v,r[p*4+3]=o()}{const p=D.fork("notch-stars");for(let m=900;m<a;m++){const y=p.range(-6.5,6.5)*H,v=(17+30*Math.pow(p(),1.4))*H;r[m*4]=Math.sin(y)*Math.cos(v),r[m*4+1]=Math.sin(v),r[m*4+2]=Math.cos(y)*Math.cos(v),r[m*4+3]=p.range(.45,1)}}const n=le(a);n.setAttribute("aD",new z.InstancedBufferAttribute(r,4));const c=new z.ShaderMaterial({uniforms:Ee,depthWrite:!1,transparent:!0,vertexShader:`${ht} attribute vec4 aD; varying vec2 vQ; varying vec2 vS;
          void main(){
            vec4 p = projectionMatrix*viewMatrix*vec4(aD.xyz*100. + cameraPosition, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4;
            float px = (6. + 9.*aD.w*aD.w*aD.w)*max(uResY/450., 1.)*0.75 + 2.;      // the quad's half-size in pixels
            float ca = cos(aD.w*40.)*0.966 , sa = sin(aD.w*40.)*0.26;
            vec2 q = vec2(position.x*ca - position.y*sa, position.x*sa + position.y*ca);
            p.xy += q*px/uResY*2.*p.w*vec2(projectionMatrix[0][0]/projectionMatrix[1][1], 1.);
            vQ = position.xy; vS = vec2(aD.w, px);
            gl_Position = p.xyww;
          }`,fragmentShader:`${ht} varying vec2 vQ; varying vec2 vS;
          void main(){
            vec2 a = abs(vQ)/0.66;
            float star = pow(a.x, 0.62) + pow(a.y, 0.62);                                // a four-point faceted crystal
            float aa = 1.5/max(vS.y*0.66, 1.);
            float inS = 1. - smoothstep(1. - aa, 1., star);
            vec2 d = vec2(vQ.x - vQ.y, vQ.x + vQ.y)*0.7071;                             // two thread ticks hold it to the velvet
            float tick = (1. - smoothstep(0.05, 0.05 + 1.2/max(vS.y, 1.), abs(d.x)))*step(0.2, abs(d.y))*(1. - step(0.62, abs(d.y)));
            float facet = (vQ.x > 0. ? 0.16 : -0.1) + (vQ.y > 0. ? 0.1 : -0.12) + (a.x > a.y ? 0.08 : -0.06);
            float br = 0.5 + 0.5*sin(uTime*(0.25 + 0.3*vS.x) + vS.x*90.);
            vec3 c = mix(uSilver, uGlint, 0.5 + 0.5*br)*(0.78 + facet);
            float core = 1. - smoothstep(0.0, 0.6, star);
            vec3 col = toScene(mix(uThread*0.55, c, inS))*(1. + core*br*uGlintGain*0.8);
            float al = max(inS, tick*0.8);
            if (al < 0.02) discard;
            gl_FragColor = vec4(col, al);
          }`}),f=new z.Mesh(n,c);f.renderOrder=-2,f.frustumCulled=!1,f.name="stars",E.add(f);const s=2.4,h=[],i=6200,l=[6,7,5][j],u=[12.5,16,8.5][j]*s*H,d=Math.tan(u/2)*i/(l+.5),x=new L(0,1,0).addScaledVector(Ae,-Ae.y).normalize(),w=new L().crossVectors(x,Ae).normalize();for(let p=0;p<2;p++){const m=d*(l+(p?3.6:2)),y=Math.round(2*Math.PI*m/(d*(p?1.25:.72)));for(let v=0;v<y;v++){if(p&&v%8>4)continue;const A=(v+.5)/y*Math.PI*2;h.push(Math.cos(A)*m,Math.sin(A)*m,A,4)}}for(let p=0;p<=l;p++){const m=p===0?1:Math.round(2*Math.PI*p*.99);for(let y=0;y<m;y++){const v=(y+p%2*.5)/m*Math.PI*2,A=p*d*(p===l-1?1+.07*Math.sin(v*3+1)*(Math.sin(v)>.2?1:0):1);h.push(Math.cos(v)*A,Math.sin(v)*A,v+p*.7,p===4&&y===5?1:p===l?2:0)}}const g=le(h.length/4);g.setAttribute("aM",new z.InstancedBufferAttribute(new Float32Array(h),4));const b=fe(N,{uniforms:{uMD:{value:Ae.clone().multiplyScalar(i)},uMU:{value:x},uMS:{value:w},uMR:{value:d*.5},uMC:{value:new z.Color(j===1?"#F3D9D8":j===2?"#E6F0FF":ze[4])}},header:"attribute vec4 aM; uniform vec3 uMD, uMU, uMS, uMC; uniform float uMR;",body:`
          C = cameraPosition + uMD + uMS*aM.x + uMU*aM.y; R = uMR; SEED = fract(aM.z*3.7 + aM.x*0.01);
          float mth = atan(aM.y, abs(aM.x) < 1e-3 ? (aM.x < 0. ? -1e-3 : 1e-3) : aM.x);
          AX = normalize(-uMS*sin(mth) + uMU*cos(mth) + uMD*1e-6); E1 = normalize(uMD);
          COLA = aM.w > 1.5 ? mix(uMC, uSilver, 0.5) : (aM.w > 0.5 ? uSlate : uMC); COLB = COLA; LINED = aM.w > 1.5 ? 0.6 : 0.15; LEN = 0.;
          if (aM.w > 3.5) { R = uMR*0.56; COLA = mix(uSilver, uGlint, 0.5); COLB = COLA; LINED = 1.; }`});b.depthWrite=!1;const M=new z.Mesh(g,b);M.renderOrder=-1,M.frustumCulled=!1,M.name="moon",E.add(M)}await C.yield();const de={pos:[],r:[],t:[],idx:[],n:0};function Ke(e,t,a,r,o,n,c,f,s=0,h=.16,i=0,l=0){const u=de.n;for(let d=0;d<=o;d++)for(let x=-1;x<=1;x+=2){const w=d/o;de.pos.push(e+i*w,t-r*w,a+l*w),de.r.push(x,s+r*w,n,c),de.t.push(f,h),de.n++}for(let d=0;d<o;d++){const x=u+d*2;de.idx.push(x,x+2,x+1,x+1,x+2,x+3)}}const $t=new z.ShaderMaterial({uniforms:{...Ee,...Re},side:z.DoubleSide,vertexShader:`${ht} ${_e}
        attribute vec4 aR; attribute vec2 aT; varying vec4 vR; varying vec3 vT; varying vec3 vVP;
        void main(){
          vec3 P = position; float hang = aR.y;
          if (aR.w > 6.5) { float lk = letK(position.xz, aR.z); P.y += hang*(1. - lk); hang *= lk; }
          vec3 P0 = position;
          if (aR.w < -6.5) { float rel = curtRel(aR.z); if (hang > rel) { P.y += hang - rel; hang = rel; } P0 = P; }
          if (hang > 0.) P += swayAt(P0, hang, aR.z, aR.w);
          vec4 mv = viewMatrix*vec4(P, 1.);
          float minW = 0.8*max(-mv.z, 0.05)/(projectionMatrix[1][1]*uResY*0.5);
          float w = max(aT.y, minW);
          mv.x += aR.x*w;
          vR = vec4(aR.x*w/aT.y, aR.y, aR.z, aT.y); vT = vec3(aT.x, w/aT.y, position.x > 0. ? 1. : 0.); vVP = mv.xyz;
          gl_Position = projectionMatrix*mv;
        }`,fragmentShader:`${ht}
        varying vec4 vR; varying vec3 vT; varying vec3 vVP;
        void main(){
          vec3 V = normalize(-vVP), M = mat3(viewMatrix)*uMoon;
          float mode = vT.x, wid = vR.w;
          vec3 thread = uThread*(0.62 + 0.3*(1. - abs(vR.x)/max(vT.y, 1.)));
          // a thread held to its least width far off takes the tone of the bank behind it (no veil of hairlines)
          float cov = clamp(1./max(vT.y, 1.), 0.25, 1.);
          vec3 dim = vT.z > 0.5 ? mix(uSilver, uSlate, 0.3) : mix(uBlue, uSlate, 0.2);
          if (mode < -0.5) { gl_FragColor = vec4(toScene(thread), 1.); return; }       // the curtain's thread: waxed grey, never a veil
          if (mode < 0.5) { gl_FragColor = vec4(toScene(mix(dim, thread, cov)), 1.); return; }
          float pitch = wid*2.3, g = vR.y/pitch, id = floor(g);
          float px = pitch/max(fwidth(vR.y), 1e-5);
          vec2 f = vec2(vR.x, (fract(g)*2. - 1.)*1.12);
          float r2 = dot(f, f), sd = hash2(vec2(id, vR.z*91.));
          vec3 body = sd < 0.5 ? uSilver : (sd < 0.8 ? uPearl : (sd < 0.93 ? uBlue : uSlate));
          float lined = sd < 0.5 ? 1. : 0.;
          if (mode > 2.5) { body = sd < 0.62 ? uBlue : (sd < 0.84 ? uSlate : (sd < 0.95 ? uSilver : uPearl)); lined = sd >= 0.84 && sd < 0.95 ? 1. : 0.; }
          vec3 n = normalize(vec3(f.x, f.y, sqrt(max(1. - r2, 0.04))));
          vec4 cg = beadShade(body, lined, n, V, vec3(0., 1., 0.), M, sd);
          float aa = 2.4/max(px, 1.);
          float inside = 1. - smoothstep(1. - aa, 1., sqrt(r2));
          vec3 gap = abs(vR.x) < 0.3 ? thread : vec3(-1.);
          float k = smoothstep(3., 6., px);
          vec3 avg = mix(dim, mix(uThread*0.5, mode > 2.5 ? mix(uBlue, uSlate, 0.3) : mix(uSilver, uPearl, 0.4), 0.62), cov);
          if (k > 0.5 && inside < 0.5 && gap.x < 0.) discard;
          vec4 o = mix(vec4(avg, 0.), mix(vec4(max(gap, 0.), 0.), cg, inside), k);
          gl_FragColor = vec4(beadOut(o), 1.);
        }`}),X=Dt("strung-beads"),et=[];{const e=D.fork("willows"),t=[[126,44.5,6.2,21],[100,57,6.5,22],[80,68.5,6.5,22.5]];for(let a=0;a<8;a++){const r=a%2?1:-1,o=a<6?t[a>>1]:null,n=o?o[0]+e.range(-2,2)+(r>0?3:0):103+(r>0?3.5:0),c=r*(o?o[1]+e.range(-1.5,1.5):44);et.push({x:c,z:n,sd:r,h:o?o[3]*e.range(.95,1.06):31,ph:e(),reach:!o,crown:o?o[2]:5,nf:Math.max(3,Math.round((o?5:3)*Math.min(be,1.2)))})}for(const a of et){const r=ve(a.x,a.z),o=-a.sd*.1,n=a.reach?6:9,c=1.3,f=a.sd>0,s=f?0:1;let h=0;for(let l=0,u=0;u<a.h*.86;l++){const d=B(.95,.5,u/a.h)*c,x=f?l%4===3?2:l%2?0:1:l%4===3?2:l%2?1:8;X.add(a.x+o*u,r+u+d,a.z,d,o,1,.05,x,2,x===2?1:0),u+=d*2.5,h=u}for(let l=0;l<11;l++){const u=l<6?0:1,d=l*(u?1.257:1.047)+a.ph*6,x=(u?.95:1.55)*c,w=r+h+(u?1.5:.2)*c;X.add(a.x+o*h+Math.cos(d)*x,w,a.z+Math.sin(d)*x,(u?.72:.85)*c,-Math.sin(d),.2,Math.cos(d),l%4===1?2:s,2,l%4===1?1:0)}X.add(a.x+o*h,r+h+4.2*c,a.z,.8*c,0,1,0,6,1,0);{const l=a.crown*.95,u=.72,d=r+h+3.6*c,x=a.x+o*h;for(let w=1,g=u*1.5;g<=l;w++,g+=u*1.75){const b=Math.max(5,Math.round(2*Math.PI*g/(u*2.02))),M=d-.75*l*(g/l)**2,p=g+u*1.75>l;for(let m=0;m<b;m++){const y=(m+.5*(w%2))/b*Math.PI*2+a.ph*6,A=ce(m*3.3+w*17+a.ph*99)<.045?f?1:0:p?f?1:2:s;X.add(x+Math.cos(y)*g,M,a.z+Math.sin(y)*g,u,-Math.sin(y),0,Math.cos(y),A,0,A===2?1:0)}}}const i=a.sd>0?3:0;for(let l=0;l<n;l++){const u=a.reach&&l===i,d=u?a.sd>0?Math.PI:0:(l+e.range(-.2,.2))/n*Math.PI*2,x=u?Math.abs(a.x)-.1*(h+.6)-5.6:a.crown*e.range(.86,1.04),w=r+(u?h+.6:a.h*e.range(.74,.84)),g=a.x+o*(w-r),b=u?6:a.nf,M=(v,A)=>(A[0]=g+Math.cos(d)*x*v,A[2]=a.z+Math.sin(d)*x*v,A[1]=w+x*(.42*v-.36*v*v)+a.h*.1*v,A),p=[0,0,0],m=[0,0,0],y=1.35;for(let v=.08;v<1;v+=.9*y/Math.max(4,x)){M(v,p),M(v+.02,m);const A=Math.round(v*20)%5===0?f?1:2:s;X.add(p[0],p[1],p[2],B(.45,.26,v)*y,m[0]-p[0],m[1]-p[1],m[2]-p[2],A,2,A===2?1:0)}for(let v=0;v<b;v++){const A=u?1-v*.036:(v+.6+e.range(-.2,.2))/b;M(A,p);const S=e(),P=u?ke(p[0])+e.range(1.4,3.6):Math.max(ve(p[0],p[2])+1.2,r-1+e.range(1.5,6)),R=u?p[1]-P:Math.min(B(4.5,12.5,A)*e.range(.85,1.12),p[1]-P);if(!(R<4))if(u){Ke(p[0],p[1],p[2],R,9,S,6.6,0,0,.05);const k=.54,$=Math.floor((R-1.2)/k);for(let q=1;q<$;q++){const te=ce(q*7+Math.floor(S*977)),U=te<.5?2:te<.8?3:te<.93?0:1;X.add(p[0],p[1]-q*k,p[2],.26,0,1,0,U,0,U===2?1:0,q*k,S,6.6)}X.add(p[0],p[1]-R+.6,p[2],.2,0,1,0,2,3,1,R-.6,S,6.6),X.add(p[0],p[1]-R-.3,p[2],v%2?.17:.27,0,1,0,v%2?5:4,0,0,R,S,6.6)}else{Ke(p[0],p[1],p[2],R,5,S,4.6,0,0,.06);const k=.86,$=Math.floor((R-.8)/k);for(let q=1;q<$;q++){const te=ce(q*7+Math.floor(S*977)),U=te<.8?s:te<.92?f?1:8:f?8:2;X.add(p[0],p[1]-q*k,p[2],.4,0,1,0,U,0,U===2?1:0,q*k,S,4.6)}X.add(p[0],p[1]-R+.5,p[2],.28,0,1,0,f?1:2,3,f?0:1,R-.5,S,4.6),v%3===1&&X.add(p[0],p[1]-R-.45,p[2],.36,0,1,0,4,0,0,R,S,4.6)}}}await C.yield()}}await C.yield();const Mt=[];{const e=r=>67+8*(r/27)**2+.5*Math.sin(r*.4+Y.curt),t=[];for(let r=-30;r<=30;r+=3)t.push(new L(r,e(r),150+.02*r*r*.2));Mt.push(Xt(t,.16,5,!1,0));const a=Me?7:0;for(let r=-1;r<=1;r+=2)for(let o=0;o<10;o++){const n=r*(7.6+o*1.35),c=e(n),f=ce(o*3.1+r+Y.curt)*.35+o*.065,s=ke(n)+(Math.abs(n)>16.4?3.7:1.5)+1.4*ce(o+r*5+Y.curt),h=c-s,i=150+.004*n*n;Ke(n,c,i,h,14,f,-9,-1,0,.1),X.add(n,c,i,.42,1,0,0,3,0,0);for(let l=2.5,u=0;l<h-2.4;u++,l+=2.6){const d=u%2===0,x=ce(u*5.3+o*17.1+r)<.045;let w=d?u%4===0!==x?2:a:u%4===1?3:1;X.add(n,c-l,i,d?.42:.52,0,1,0,w,d?3:0,w===2?1:0,l,f,-9,0)}X.add(n,c-h,i,.8,0,1,0,o%3===0?3:o%3===1?4:6,o%3===2?1:0,0,h,f,-9,1)}}await C.yield();{const e=D.fork("reeds"),t=Math.round(1300*he*Math.min(be,1.15));for(let o=0;o<t;o++){o%250===249&&await C.yield();const n=e.chance(.5)?1:-1,c=e.range(-70,204),f=ae.n2(c*.06+n*20,Y.bank),s=n*(20.8+Math.abs(e.gauss())*3.2+(f<-.1?14*e():0)),h=ve(s,c),i=e.range(2.2,3.6),l=e();if(c>148&&Math.abs(s)>Be(c)+1.5||c>36&&ce(o*1.37+.5)<.93*F(36,96,c))continue;Ke(s,h+i,c,i,2,l,3.4,0,.3,.03);const u=e.chance(n<0?.7:.12)?0:2;X.add(s,h+i*.52,c,.105,0,1,0,u,3,u===2?1:0,i*.5,l,3.4),X.add(s,h+i*.52+.9,c,.105,0,1,0,e.chance(.2)?1:2,3,1,i*.75,l,3.4),X.add(s,h+i+.1,c,.13,0,1,0,o%4?1:3,0,0,i,l,3.4)}await C.yield();const a=Math.round(300*be*(.7+.3*he)),r=[0,0,0,0,0,0,0];for(let o=0;o<a;o++){o%60===59&&await C.yield();let n,c,f,s=0,h=1,i=0;const l=o%3,u=e();if(l<2){const M=e.chance(.5)?1:-1;f=e.range(-40,146),n=M*(o%2?21.5+40*e()*e():30+75*e()),c=ve(n,f)+e.range(1,1.9),s=-M*.55,i=-.5,h=.67}else{const M=Ge[o%2^(e.chance(.5)?1:0)],p=e.range(M.sCorner-40,M.L-6),m=e.chance(.6)?31.6:67;_(M,p,m,r),n=r[0]-r[5]*.9,c=m+e.range(.6,1.4),f=r[2]-r[6]*.9,s=-r[5]*.8,i=-r[6]*.8,h=.6}const d=Math.hypot(s,h,i);s/=d,h/=d,i/=d;const x=new L(-i,0,s).normalize(),w=new L().crossVectors(new L(s,h,i),x),g=l<2?1:1.5,b=l<2?3.4:3.3;Ke(n,c,f,l<2?c-ve(n,f):1.2,1,u,3.4,0,0,.03),X.add(n,c,f,.15*g,s,h,i,3,0,0,.6,u,b);for(let M=0;M<5;M++)for(let p=0;p<6;p++){const m=M/5*Math.PI*2+u*6,y=(p+.5)/6*Math.PI*2,v=(.42-.34*Math.cos(y))*g,A=.21*Math.sin(y)*g,S=.18*(1-Math.cos(y))*g,P=x.x*(Math.cos(m)*v-Math.sin(m)*A)+w.x*(Math.sin(m)*v+Math.cos(m)*A)+s*S,R=x.y*(Math.cos(m)*v-Math.sin(m)*A)+w.y*(Math.sin(m)*v+Math.cos(m)*A)+h*S,k=x.z*(Math.cos(m)*v-Math.sin(m)*A)+w.z*(Math.sin(m)*v+Math.cos(m)*A)+i*S;X.add(n+P,c+R,f+k,.1*g,-R,P,k*.5+.01,(o*5+M)%23===0?3:4,0,0,.6+v*1.6,u,b)}}}await C.yield();{const e=Math.round((W===1?220:60)*(.7+.3*he)),t=new Float32Array(e*7*4),a=D.fork("fish");for(let c=0;c<e;c++){const f=(a.chance(.5)?1:-1)*a.range(2.5,13),s=a.range(4,226),h=a();for(let i=0;i<7;i++){const l=(c*7+i)*4;t[l]=f,t[l+1]=s,t[l+2]=h,t[l+3]=i}}const r=le(e*7);r.setAttribute("aF",new z.InstancedBufferAttribute(t,4));const o=fe(N,{header:"attribute vec4 aF;",body:`
        float T = 2.6 + 1.6*fract(aF.z*7.31);
        float tt = uTime/T + aF.z - aF.w*0.42/(9.5*1.05);
        float cyc = floor(tt), ph = fract(tt)*T/1.05;                  // the leap lasts 1.05 s of each period
        float h1 = hash1(cyc*1.7 + aF.z*31.), h2 = hash1(cyc*2.9 + aF.z*57.);
        float up = clamp(ph, 0., 1.);
        float x = aF.x + (h1 - 0.5)*5., z = aF.y + h2*26. + up*9.5;
        float arc = 4.*up*(1. - up);
        float ry = 0.9*cos(clamp(x/17., -1.5, 1.5)) - 0.4;
        C = vec3(x + sin(up*9. + aF.w*0.8)*0.22, ry + 0.2 + arc*(2.1 + 1.3*h1) - 0.5*(1. - arc), z);
        R = mix(0.36, 0.13, aF.w/6.)*smoothstep(0., 0.06, up)*(1. - smoothstep(0.94, 1., up));
        AX = normalize(vec3(0.1, (1. - 2.*up)*0.9, 1.)); E1 = normalize(cross(AX, vec3(1., 0.2, 0.)));
        COLA = aF.w < 0.5 ? uPearl : mix(uSilver, uGlint, 0.6); COLB = aF.w < 0.5 ? uPearl : uSilver; LINED = 1.; SEED = fract(aF.z*13. + aF.w*0.17);
        KIND = aF.w < 0.5 ? 1. : 0.;`}),n=new z.Mesh(r,o);n.frustumCulled=!1,n.name="bead-fish",E.add(n)}await C.yield();const zt=[],At=[],Xe=D.fork("highfish");{const e=Xe,t=Math.round((W===1?110:20)*(.7+.3*he)),a=zt,r=At,o=new L,n=new L;for(let c=0,f=0;c<t&&f<t*14;f++){f%50===49&&await C.yield();const s=W===1?B(Z-.01,1.3,e()):B(Z-.01,wt+.06,e());K.pointAt(Math.min(s,1),o),K.pointAt(Math.min(s,1)-.06,n).sub(o).negate();const h=e.chance(.5)?1:-1,i=20+(W===1?250:60)*Math.pow(e(),1.3),l=Math.hypot(n.x,n.z)||1,u=Math.max(s-1,0)*900,d=o.x+h*n.z/l*i+n.x/l*u,x=o.z-h*n.x/l*i+n.z/l*u,w=Ne(d,x),g=e(),b=e(),M=e.range(.85,1.3);if(Math.hypot(d-$e.x,x-$e.z)<34||Math.hypot(d-re.x,x-re.z)<30||w>.86&&w<1.14||x<306||Math.abs(d)>300||x>770)continue;const p=w<.86,m=p?96.5:Le(d,x)+.6,y=p?Math.atan2(0-d*.6,300-x)+(b-.5)*.5:Math.atan2(n.x,n.z)+(b-.5)*1.2-h*.4,v=d+Math.sin(y)*24,A=x+Math.cos(y)*24,S=Ne(v,A);if(!p&&S<1.14)continue;const P=p?96.5:Le(v,A)+.6;for(let R=0;R<7;R++)a.push(d,m,x,g),r.push(R,y,M,ye(P-m,-6,6));c++}}await C.yield();const O={uCompC:{value:new L(0,20,250)},uComp:{value:0},uClimb:{value:0},uFishU:{value:new L(0,.891,.454)},uDrag:{value:W===2?1:0},uRingC:{value:I.clone()},uRingK:{value:0},uRingE:{value:0},uFishTop:{value:2},uGreatA:{value:new L(0,-999,0)},uGreatB:{value:new L(0,-999,0)},uGreatF:{value:new L(0,0,1)},uGreatR:{value:new L(1,0,0)},uNeck:{value:Array.from({length:12},(e,t)=>ne(Q+6+(Ue-Q-14)*t/11))},uNeckK:{value:0},uEndC:{value:new L().lerpVectors(Ve,De,.4)},uEndS:{value:new L(1,0,0)},uEndK:{value:0}};{const e=K.pointAt(J,new L),t=O.uEndC.value,a=t.x-e.x,r=t.z-e.z,o=Math.hypot(a,r)||1;O.uEndS.value.set(r/o,0,-a/o)}const tt=`
      uniform vec3 uRingC; uniform float uRingK, uRingE, uFishTop;
      // (round 7) under the necklace the leaping fish keep to the land: the top of a leap stays under uFishTop (the frame's
      // height in clip units; 2 = no limit), so no arc crosses the necklace, the horns or the ring from the lingering place
      float topScale(vec3 base, vec3 apex){
        vec4 a = projectionMatrix*viewMatrix*vec4(base, 1.), b = projectionMatrix*viewMatrix*vec4(apex, 1.);
        float ya = a.y/max(a.w, 0.1), yb = b.y/max(b.w, 0.1);
        return (a.w > 0.1 && b.w > 0.1) ? clamp((uFishTop - ya)/max(yb - ya, 1e-3), 0., 1.) : 1.;
      }
      vec3 ringPart(vec3 p, float sg, float hw){
        vec3 dR = uRingC - cameraPosition; float LR = length(dR); vec3 aR = dR/max(LR, 1e-3);
        vec3 sR = vec3(aR.z, 0., -aR.x); sR *= inversesqrt(max(dot(sR, sR), 1e-4));
        vec3 d = p - cameraPosition; float al = dot(d, aR), sx = dot(d, sR);
        float need = 0.37*max(al, 0.) + hw;
        float k = uRingK*smoothstep(-2., 6., al)*(1. - smoothstep(LR + 30., LR + 80., al));
        return p + sR*(sg*max(sg*sx, need) - sx)*k;
      }
      // (round 7) under the necklace the hero is seen whole. Three rules, each a size (1 = as it is, 0 = gone) for a whole
      // creature from where its body is: it grows small and is gone as it comes before (a) the dangling end: the three lowest
      // balls, the frayed tail and the ball that falls hang in one upright line, kept clear a ball's width to either side
      // (uEndK); (b) the necklace itself, a corridor a ball and a half wide along twelve places of the sag, while the ball
      // leaves, falls and bursts (uNeckK); (c) the ring, a ring's width to either side of the line from the eye to it, from
      // the lingering place until the last climb, where ringPart() takes over (uRingE). Nothing is pushed: no creature piles
      // up at an edge or jumps a side.
      uniform vec3 uEndC, uEndS, uNeck[12]; uniform float uEndK, uNeckK;
      float heroKeep(vec3 p, float hw){
        float f = 1.;
        vec2 dA = uEndC.xz - cameraPosition.xz; float LT = max(length(dA), 1.); vec2 aT = dA/LT;
        vec2 d2 = p.xz - cameraPosition.xz; float al = dot(d2, aT), sx = dot(d2, vec2(aT.y, -aT.x));
        float need = (12.5/max(LT, 20.))*max(al, 0.) + hw;
        float k = uEndK*smoothstep(-2., 6., al)*(1. - smoothstep(LT + 45., LT + 90., al))*(1. - smoothstep(uEndC.y + 36., uEndC.y + 48., p.y));
        f = min(f, 1. - k*(1. - smoothstep(need*0.8, need*1.15, abs(sx))));
        vec3 d = p - cameraPosition;
        if (uNeckK > 0.) for (int i = 0; i < 12; i++) {
          vec3 a = uNeck[i] - cameraPosition; float L = max(length(a), 1.); a /= L;
          float an = dot(d, a), ll = length(d - a*an), nd = (11./L)*max(an, 0.) + hw;
          f = min(f, 1. - uNeckK*smoothstep(0., 6., an)*(1. - smoothstep(L + 40., L + 80., an))*(1. - smoothstep(nd*0.8, nd*1.15, ll)));
        }
        vec3 aR = uRingC - cameraPosition; float LR = max(length(aR), 1.); aR /= LR;
        float ar = dot(d, aR), lr = length(d - aR*ar), nr = 0.11*max(ar, 0.) + hw;
        f = min(f, 1. - uRingE*smoothstep(0., 6., ar)*(1. - smoothstep(LR + 30., LR + 80., ar))*(1. - smoothstep(nr*0.8, nr*1.15, lr)));
        return f;
      }
      float beadCap(vec3 c, float r, float k){ return min(r, k*max(-(viewMatrix*vec4(c, 1.)).z, 0.05)); }`;{const e=D.fork("moths"),t=W===1?0:Math.round(110*he*be),a=10,r=[],o=[],n=[],c=new L().lerpVectors(Ve,De,.4);let f=0;const s=new L(G.z,0,-G.x).normalize(),h=W===2?1:0,i=(w,g,b,M,p,m,y=h,v=null)=>{const A=e(),S=v?v.ph:A,P=e.range(.25,.6)*(e.chance(.5)?1:-1)*(5/Math.max(M,2.5)),R=v?v.sgn:p?w>0?1:-1:(w-I.x)*s.x+(b-I.z)*s.z>=0?1:-1;for(let k=0;k<4;k++)r.push(w,g,b,M),o.push(S,P,4,k),n.push(p,m,R,y);for(let k=0;k<4;k++)for(let $=0;$<16;$++)r.push(w,g,b,M),o.push(S,P,k,($+.5)/16),n.push(p,m,R,y)};for(let w=0;w<t;w++){const g=w%10;if(W===2&&g<5)i((e.chance(.5)?1:-1)*e.range(17.5,27),e.range(3.5,8),e.range(-10,150),e.range(2.5,5),0,e.range(1.1,1.6));else if(W!==2&&g<2&&et.length){const b=et[Math.floor(w/10+g)%6];i(b.x-b.sd*e.range(0,12),ve(b.x,b.z)+b.h*e.range(.45,1.05),b.z+e.range(-5,5),e.range(4,10),0,e.range(.9,1.4))}else if(g<(W===2?7:4))if(f++<6){const b=e.range(-6,12),M=e.range(-11,17),p=e.range(-6,8),m=e.range(7,12),y=e.range(2,2.6);i(c.x,c.y+6+M*.2,c.z,13+m*.5,3,y,h,{ph:(f-1>>1)/3+(b+6)/18*.2,sgn:f%2?1:-1})}else e.range(0,1);else if(g<(W===2?8:5))i((e.chance(.5)?1:-1)*e.range(12,16),e.range(8,30),e.range(150,240),e.range(2.5,4.5),0,e.range(.9,1.4));else{const b=ne(Q+e.range(26,Ue-Q-78)),M=e.range(10,26);w%4===0&&i(b.x-Ce.x*M,b.y+e.range(2,15),b.z-Ce.z*M,e.range(4.5,8),0,e.range(2,2.5))}}{const w=D.fork("nightmoths"),g=new L,b=new L,M=new L,p=Math.round(96*he*be);for(let m=0;m<p;m++){const y=B(me+.02,.975,(m+w())/p);K.pointAt(y,g),K.pointAt(Math.min(y+.01,1),b),b.sub(g).normalize(),M.set(b.z,0,-b.x).normalize();const v=m%8===2&&y<.88,A=!v&&m%3===0,P=(m%2?1:-1)*(v?w.range(8.5,11):A?w.range(40,88):w.range(y>.84?19:13,36));i(g.x+M.x*P,g.y+(A?w.range(6,42):w.range(-5,10)),g.z+M.z*P,v?w.range(2.6,3.4):A?w.range(9,17):w.range(4,8),0,v?w.range(1.6,2):A?w.range(3.4,5):w.range(1.9,2.6),1)}K.pointAt(me-.015,g),g.addScaledVector(Ae,82);for(let m=0;m<13;m++)i(g.x+w.range(-9,9),g.y+w.range(-7,7),g.z+w.range(-9,9),w.range(6,13),0,w.range(2.2,2.7),m<9?h||(W===1?1:0):1)}for(let w=0;w<3;w++){const g=e.range(3,12),b=(w%2?1:-1)*e.range(19.5,22);i(I.x-G.x*g+Ce.x*b,I.y-G.y*g+e.range(-5,5),I.z-G.z*g+Ce.z*b,e.range(2.2,2.8),0,e.range(1.5,1.8),W===0?0:1)}{const w=D.fork("claspflies");for(let g=0;g<12;g++){const b=w.range(-34,16),M=(g%2?1:-1)*w.range(19,40);i(I.x-G.x*b+Ce.x*M,I.y-G.y*b+w.range(-9,16),I.z-G.z*b+Ce.z*M,w.range(2.4,5),0,w.range(1.6,2.6),1)}}if(W!==1)for(let w=0;w<a;w++)i((w%2?1:-1)*e.range(4.6,9),e.range(-2.6,3.4),e.range(-6,8),e.range(1,2),1,e.range(1,1.3));i(-9.2,5.2,-2,.8,2,2.2,h),i(9.6,5.8,3,.8,2,1.9,h);const l=Math.max(1,r.length/4),u=le(l);u.setAttribute("aA",new z.InstancedBufferAttribute(new Float32Array(r.length?r:[0,-999,0,1]),4)),u.setAttribute("aB",new z.InstancedBufferAttribute(new Float32Array(o.length?o:[0,0,0,0]),4)),u.setAttribute("aC",new z.InstancedBufferAttribute(new Float32Array(n.length?n:[0,0,1,0]),4));const d=fe(N,{uniforms:O,header:"attribute vec4 aA, aB, aC; uniform vec3 uCompC, uGreatA, uGreatB, uGreatF, uGreatR; uniform float uComp, uDrag;"+tt,body:`
        float a = uTime*aB.y + aB.x*6.283, sc = aC.y, DG = max(uDrag, aC.w);
        vec3 ctr = aA.xyz;
        if (aC.x > 2.5) { }
        else if (aC.x > 1.5) { ctr = aA.x < 0. ? uGreatA : uGreatB; sc *= uComp; }
        else if (aC.x > 0.5) { ctr += uCompC; sc *= uComp; }
        float vy = 1.7*a + aB.x*9.;
        vec3 pos = ctr + vec3(cos(a)*aA.w, sin(vy)*aA.w*0.32, sin(a)*aA.w*0.8);
        vec3 fw = normalize(vec3(-sin(a), cos(vy)*0.55, cos(a)*0.8))*(aB.y < 0. ? -1. : 1.);
        if (aC.x > 2.5) {                                             // one of the ring round the dangling end
          vec3 nE = cross(uEndS, vec3(0., 1., 0.));
          pos = ctr + uEndS*(aC.z*aA.w*(1. + 0.25*cos(a))) + vec3(0., sin(a)*19., 0.) + nE*(sin(vy)*2.);
          fw = normalize(uEndS*(-aC.z*aA.w*0.25*sin(a)) + vec3(0., 19.*cos(a), 0.) + nE*0.3)*(aB.y < 0. ? -1. : 1.);
        } else if (aC.x > 1.5) {                                      // a great one: it flies our course, weaving a little, turned a little outward so its body is seen
          pos = ctr + vec3(sin(a)*0.5, sin(vy*0.6)*0.4, cos(a*0.7)*0.5);
          fw = normalize(uGreatF + uGreatR*(aA.x < 0. ? -0.42 : 0.42) + vec3(cos(a)*0.1, cos(vy*0.6)*0.08, 0.));
        }
        vec3 rt = cross(fw, vec3(0., 1., 0.)); rt *= inversesqrt(max(dot(rt, rt), 1e-4)); vec3 up = cross(rt, fw);
        if (aC.x > 2.5) { rt = cross(fw, cross(uEndS, vec3(0., 1., 0.))); rt *= inversesqrt(max(dot(rt, rt), 1e-4)); up = cross(rt, fw); }     // (its wing loops lie open to the eye)
        else if (aC.x > 1.5) { rt = uGreatR - fw*dot(uGreatR, fw); rt *= inversesqrt(max(dot(rt, rt), 1e-4)); up = cross(rt, fw); }   // (its back is turned to the eye: both pairs of wing loops are seen open)
        vec3 l; R = 0.085*sc; COLA = uCoral; COLB = uCoral; SEED = fract(aB.x*17. + aB.w*3.1 + aB.z*0.37); AX = fw; E1 = up;
        if (aB.z > 3.5) {                                             // body: crystal head, coral thorax and abdomen (dragonfly: one long bugle)
          float b = aB.w;
          l = fw*(b < 0.5 ? 0.3 : (b < 1.5 ? 0. : (b < 2.5 ? -0.31 - 0.3*DG : -0.56 - 0.75*DG)));
          if (b < 0.5) { KIND = 1.; COLA = mix(uSilver, uGlint, 0.5); COLB = COLA; R = 0.14*sc; }
          else { R = (b < 1.5 ? 0.19 : (b < 2.5 ? 0.15 : 0.115))*sc*(1. - 0.3*DG); LEN = DG*(b < 1.5 ? 0.6 : (b < 2.5 ? 3. : 1.2)); if (b > 2.5) COLB = mix(uCoral, uPearl, 0.35); }
        } else {
          float side = aB.z < 1.5 ? 1. : -1., fore = mod(aB.z, 2.) < 0.5 ? 1. : 0.;
          float th = aB.w*6.283, L = mix(0.78, 1.12, fore)*(1. + 0.3*DG), W = mix(0.3, 0.38, fore)*(1. - 0.55*DG);
          float lx = 0.16 + (0.5 - 0.5*cos(th))*L, lz = sin(th)*W + (fore > 0.5 ? 0.34 : -0.3)*lx/L + (fore > 0.5 ? 0.1 : -0.12);
          float flap = sin(uTime*(13. + 5.*fract(aB.x*5.3))*(1. + DG) + aB.x*30. - (1. - fore)*0.5)*mix(0.8, 0.3, DG) + 0.22*(1. - DG);
          l = rt*side*lx*cos(flap) + up*lx*sin(flap) + fw*lz;
          float k16 = floor(aB.w*16.);
          if (abs(k16 - 5. - aB.z) < 0.5) { COLA = uPearl; COLB = uPearl; }                     // one pearl in each loop
          else if (mod(k16, 4.) < 0.5) { COLB = mix(uCoral, uPearl, 0.22); }
          if (DG > 0.5 && aC.x < 1.5) { COLA = uPearl; COLB = mix(uSilver, uGlint, 0.5); LINED = 1.; if (abs(k16 - 8.) < 0.5) { COLA = uCoral; COLB = uCoral; LINED = 0.; } }     // white seed loops, a coral bead at the tip
          float hl = 0.5*L, per = 6.283*sqrt(0.5*(hl*hl + W*W));        // the loop's length: sixteen beads touch all round it
          R = per/32.*1.06*sc;
        }
        float keep = 1.;
        if (aC.x < 0.5) { pos = ringPart(pos, aC.z, 1.7*sc); keep = heroKeep(pos, 1.7*sc); }
        float cut = aC.y > 3.2 ? 300. : (aC.y > 1.65 ? 128. : 78.);
        R *= 1. - smoothstep(cut, cut*1.1 + 2., length(pos - cameraPosition));      // far moths are not drawn (never a red speck): the small ones of the river and gorge beyond 90 m, the big ones of the strand beyond 140 m
        C = pos + l*sc*keep; R = beadCap(C, R, 0.03)*keep;`}),x=new z.Mesh(u,d);x.frustumCulled=!1,x.name="moths",E.add(x)}await C.yield();{const e=W===1?18:11,t=new Float32Array(e*7*4),a=D.fork("climbfish");for(let c=0;c<e;c++){const f=c%2?1:-1,s=f*(1.8+(c>>1)%4*.4+a.range(0,.3)),h=a.range(-4,9),i=a();for(let l=0;l<7;l++){const u=(c*7+l)*4;t[u]=s,t[u+1]=h,t[u+2]=i,t[u+3]=l}}const r=le(e*7);r.setAttribute("aF",new z.InstancedBufferAttribute(t,4));const o=fe(N,{uniforms:O,header:"attribute vec4 aF; uniform vec3 uCompC, uFishU; uniform float uClimb;"+tt,body:`
        float T = 2.0 + 1.2*fract(aF.z*7.31), tt = uTime/T + aF.z;
        float cyc = floor(tt), up = clamp(fract(tt)*T/1.45, 0., 1.), h1 = hash1(cyc*1.7 + aF.z*31.), sd = aF.x < 0. ? -1. : 1.;
        // along the water's run 15 m ahead of us (level in the gorge, up the face of the pour on the climb), and out of it
        vec3 dU = uFishU, n0 = cross(dU, vec3(1., 0., 0.)), dN = n0/max(length(n0), 1e-3);
        // the arc: a half circle on the chord cD (up the face and out of it), its belly along wD: in toward the pour's
        // centre line. It leaves the pour's flank, bows in over the white of the fall (never nearer its middle than 1.5 m)
        // and goes back; the plane of the bow is seen open both from the gorge and from the climb
        vec3 cD = normalize(dU + dN*0.4), wD = vec3(-sd, 0., 0.);
        float rho = 2.9 + 0.9*h1, arcL = 3.14159*rho;
        vec3 base = uCompC + vec3(sd*(rho + 1.5 + abs(aF.x) - 1.8 + h1*0.5), 0., 0.) + dU*(aF.y*0.3 - 3.2 + (h1 - 0.5)*2.4) + dN*(-2.4);       // (the water runs about 3 m under our course: the leaps stay low over it, against its white, and end at our own height)
        float kS = clamp(0.03*max(-(viewMatrix*vec4(base + cD*rho + wD*rho, 1.)).z, 0.05)/0.42, 0.4, 2.3);   // one size for the whole fish: its head 6% of the frame's height, near or far
        float r0 = 0.42*kS, dl = 0.047*kS, b = aF.w;
        float dB = 2.*r0*b - dl*b*b, Lf = 12.*r0 - 36.*dl;             // each bead touches the next: its distance behind the head, and the fish's length
        float th = (up*(arcL + Lf) - dB)/rho;
        C = base + cD*(rho*(1. - cos(clamp(th, 0., 3.14159)))) + wD*(rho*sin(clamp(th, 0., 3.14159)));
        R = (r0 - dl*b)*smoothstep(0., 0.16, th)*(1. - smoothstep(2.98, 3.14159, th))*uClimb;
        AX = normalize(cD*sin(th) + wD*cos(th)); vec3 e = cross(AX, vec3(0.2, 0.3, 0.93)); if (dot(e, e) < 1e-3) e = vec3(1., 0., 0.); E1 = normalize(e);
        // (a crystal head, slate and midnight beads by turns, a coral bead for the tail: dark fish against the white pour)
        float sl = step(0.5, mod(aF.w, 2.));
        COLA = aF.w < 0.5 ? mix(uSilver, uGlint, 0.6) : (aF.w > 5.5 ? uCoral : mix(uSlate, uBlue, sl)); COLB = aF.w < 0.5 ? uSilver : (aF.w > 5.5 ? uCoral : mix(mix(uSlate, uBlue, 0.5), uBlue, sl));
        LINED = aF.w < 0.5 ? 1. : 0.; SEED = fract(aF.z*13. + aF.w*0.17); KIND = aF.w < 0.5 ? 1. : 0.;`}),n=new z.Mesh(r,o);n.frustumCulled=!1,n.name="climb-fish",E.add(n)}if(W===1){const e=D.fork("skyfish"),t=Math.round(64*he*be),a=new Float32Array(t*7*4),r=new Float32Array(t*7*4),o=new L,n=new L;for(let l=0;l<t;l++){const u=B(me-.02,.95,(l+e())/t);K.pointAt(u,o),K.pointAt(Math.min(u+.01,1),n),n.sub(o);const d=Math.hypot(n.x,n.z)||1,x=(l%2?1:-1)*e.range(u>.84?21:12,l%3?30:46),w=Math.atan2(n.x,n.z)+e.range(-.3,.3),g=e(),b=e.range(1.1,1.9),M=o.y-e.range(13,20),p=e();for(let m=0;m<7;m++){const y=(l*7+m)*4;a[y]=o.x+n.z/d*x,a[y+1]=M,a[y+2]=o.z-n.x/d*x,a[y+3]=g,r[y]=m,r[y+1]=w,r[y+2]=b,r[y+3]=p}}const c=le(t*7);c.setAttribute("aF",new z.InstancedBufferAttribute(a,4)),c.setAttribute("aG",new z.InstancedBufferAttribute(r,4));const f=G.z/Math.hypot(G.x,G.z),s=-G.x/Math.hypot(G.x,G.z),h=fe(N,{uniforms:O,header:"attribute vec4 aF, aG;"+tt,body:`
        float T = 3.4 + 1.6*fract(aG.w*7.31), tt = uTime/T + aF.w - aG.x*0.027*aG.z;
        float up = clamp(fract(tt)*1.25, 0., 1.), arc = 4.*up*(1. - up);
        float H = 10. + 8.*fract(aG.w*3.7), Ln = 26. + 14.*fract(aG.w*5.3);       // (they leap from the cobbles and fall back: the sky above the eye line is the dragonflies')
        vec3 dh = vec3(sin(aG.y), 0., cos(aG.y));
        vec3 lead = aF.xyz + dh*((fract(uTime/T + aF.w)*1.25 - 0.5)*Ln);          // the whole fish parts as one
        float sgn = (aF.x - uRingC.x)*${f.toFixed(4)} + (aF.z - uRingC.z)*${s.toFixed(4)} >= 0. ? 1. : -1.;
        float hs = topScale(aF.xyz, aF.xyz + vec3(0., H, 0.)); H *= hs;
        C = aF.xyz + dh*((up - 0.5)*Ln) + vec3(0., arc*H, 0.);
        C += ringPart(lead, sgn, 4.) - lead;
        R = mix(1.05, 0.4, aG.x/6.)*aG.z*smoothstep(0., 0.05, up)*(1. - smoothstep(0.95, 1., up))*smoothstep(0.02, 0.3, hs)*heroKeep(lead, 4.); R = beadCap(C, R, 0.022);
        AX = normalize(dh*Ln + vec3(0., 4.*(1. - 2.*up)*H, 0.)); vec3 e = cross(AX, vec3(0.3, 0.1, 0.9)); if (dot(e, e) < 1e-3) e = vec3(1., 0., 0.); E1 = normalize(e);
        // (round 7) not the necklace's pearl: a crystal head, a body of slate and silver-lined beads by turns, a coral tail
        float sl = step(0.5, mod(aG.x, 2.));
        COLA = aG.x < 0.5 ? mix(uSilver, uGlint, 0.6) : (aG.x > 5.5 ? uCoral : mix(uSilver, uSlate, sl));
        COLB = aG.x < 0.5 ? uSilver : (aG.x > 5.5 ? uCoral : mix(mix(uSilver, uGlint, 0.5), mix(uSlate, uBlue, 0.5), sl));
        LINED = (aG.x > 5.5 || (aG.x > 0.5 && sl > 0.5)) ? 0. : 1.; SEED = fract(aF.w*13. + aG.x*0.17); KIND = aG.x < 0.5 ? 1. : 0.;`}),i=new z.Mesh(c,h);i.frustumCulled=!1,i.name="sky-fish",E.add(i)}const we=new z.Group;we.name="ride-moth",we.matrixAutoUpdate=!1,E.add(we);const at={uBeat:{value:0},uIn:{value:0}};{const e=`
        uniform float uBeat, uIn;
        // w.x: wing side (+-1, 0 = body), w.y: antenna weight
        vec3 rideP(vec3 p, vec2 w){
          if (abs(w.x) > 0.5) {
            vec2 root = vec2(0.22*w.x, -0.8), rel = p.xy - root;
            float reach = length(rel);
            float ang = w.x*(-0.01 + 0.05*sin(uBeat - reach*0.42) + 0.01*sin(uBeat*2. + 1.));    // a small stroke: the loops' tops beat within the lowest sixth of the frame
            float c = cos(ang), s = sin(ang);
            p.xy = root + vec2(rel.x*c - rel.y*s, rel.x*s + rel.y*c);
          }
          p.x += w.y*sin(uTime*1.1 + p.z*2. + (p.x > 0. ? 0. : 2.))*0.05; p.y += w.y*sin(uTime*1.6 + p.z*3.)*0.035 + 0.02*sin(uBeat)*step(abs(w.x), 0.5);
          p.y -= 0.12 + (1. - uIn)*3.6;                 // below the frame until the flight begins (nothing of the mount shows in the previous portal's picture)
          return p;
        }`,t=[],a=[],r=[],o=[],n=(g,b,M,p,m,y,v,A,S,P=1,R=0,k=0)=>{t.push(g,b,M,p),a.push(m,y,t.length*.137%1,v,P,R,k,0),r.push(A,S)},c=(g,b,M,p,m)=>{for(let y=0;y<b;y++){const v=Xt([0,1,2,3].map(P=>g((y+P/3)/b)),M,4,!1,0),A=v.getAttribute("position").count,S=new Float32Array(A*2);for(let P=0;P<A;P++){S[P*2]=p;const R=(y+Math.floor(P/5)/3)/b;S[P*2+1]=m*R*R}v.setAttribute("aW",new z.BufferAttribute(S,2)),o.push(v)}};n(0,-1.38,-3,.12,2,1,1,0,0,.1,.3,1),n(-.17,-1.37,-3.04,.05,4,0,0,0,0),n(.17,-1.37,-3.04,.05,4,0,0,0,0);for(const g of[-1,1]){const b=new z.CatmullRomCurve3([new L(g*.08,-1.33,-3.1),new L(g*.3,-1.5,-3.5),new L(g*.6,-1.72,-4),new L(g*.85,-1.98,-4.4),new L(g*.95,-2.14,-4.6)]);c(M=>b.getPointAt(Math.min(M*.985,1)),6,.011,0,1);for(let M=1;M<=13;M++){const p=M/13.4,m=b.getPointAt(p),y=b.getTangentAt(p);n(m.x,m.y,m.z,B(.062,.03,p),M===13?4:M%4===0?1:M%2?3:2,0,M%2?0:1,0,p*p,y.x,y.y,y.z)}}for(const g of[-1,1]){const b=(M,p,m=new L)=>{const y=(-36+252*p)*H,v=Math.cos(y)*M,A=Math.sin(y)*M;return m.set(g*(2.25+v*.94-A*.34),-1.86+v*.34+A*.94,-3.12+.22*Math.cos(y))};for(let M=0;M<2;M++){const p=.87-M*.128,m=M?26:30;c(y=>b(p,y),14,.012,g,0);for(let y=0;y<m;y++){const v=b(p,(y+.5)/m),A=b(p,(y+.56)/m).sub(b(p,(y+.44)/m)).normalize(),P=M===1&&y===(g>0?11:14)?4:M?Me?y%5===2?0:1:y%5===2?3:1:Me?y%2?0:1:y%2?3:2;n(v.x,v.y,v.z,.06,P,0,P===2?1:0,g,0,A.x,A.y,A.z)}}}const f=t.length/4,s=le(f),h=new Float32Array(a),i=new Float32Array(f*4),l=new Float32Array(f*3);for(let g=0;g<f;g++)i.set(h.subarray(g*8,g*8+4),g*4),l.set(h.subarray(g*8+4,g*8+7),g*3);s.setAttribute("aP",new z.InstancedBufferAttribute(new Float32Array(t),4)),s.setAttribute("aK",new z.InstancedBufferAttribute(i,4)),s.setAttribute("aAx",new z.InstancedBufferAttribute(l,3)),s.setAttribute("aW",new z.InstancedBufferAttribute(new Float32Array(r),2));const u=fe(N,{uniforms:at,header:`attribute vec4 aP, aK; attribute vec3 aAx; attribute vec2 aW; ${e}`,body:`
        C = rideP(aP.xyz, aW); R = aP.w; SEED = aK.z; LINED = aK.w;
        AX = aAx*inversesqrt(max(dot(aAx, aAx), 1e-6)); vec3 e = cross(AX, vec3(0.2, 0.9, 0.4)); if (dot(e, e) < 1e-3) e = vec3(1., 0., 0.); E1 = normalize(e);
        float ci = aK.x;
        COLA = ci < 0.5 ? uDeep : (ci < 1.5 ? uSlate : (ci < 2.5 ? uSilver : (ci < 3.5 ? uPearl : (ci < 4.5 ? uCoral : mix(uSilver, uGlint, 0.6))))); COLB = COLA;
        KIND = aK.y > 0.5 && aK.y < 1.5 ? 1. : 0.; LEN = aK.y > 1.5 ? 0.6 : 0.;`}),d=new z.Mesh(s,u);d.frustumCulled=!1,we.add(d);const x=ct(o,!1);o.forEach(g=>g.dispose());const w=new z.Mesh(x,Kt(N,{uniforms:at,header:`attribute vec2 aRad, aW; ${e}`,body:"RAD = aRad.x; CEN = rideP(position, aW);",tone:1.3,twist:9}));w.frustumCulled=!1,we.add(w)}await C.yield();{const e=Lt(N,{header:"attribute vec3 aRg;",vertex:"AUX = vec4(aRg, 0.);",fragHeader:It,side:z.DoubleSide,fragment:`
        PITCH = AUX.x; DARK = 1.; float rw = floor(uv.y/PITCH), cl = floor(uv.x/PITCH + 0.5*mod(rw, 2.));
        float bd = bandOf(cl*AUX.y, rw);
        COLA = uBlue; COLW = uSilver;
        COLW = uSlate;
        if (bd > 2.5) { COLA = uSlate; } else if (bd > 1.5) { COLA = uSilver; LINED = 1.; } else if (bd > 0.5) { COLA = uNavy; }`}),t=[[560,9,110,100,0,30],[1050,18,190,170,0,70],[2100,36,330,340,1,140],[4500,75,560,760,1,240]],a=[];for(let o=0;o<t.length;o++){const[n,c,f,s,h,i]=t[o],l=o<2?150:110,u=6,d=m=>f+s*(.55*Math.abs(ae.n2(Math.cos(m)*2.3+o*9+Y.ridge,Math.sin(m)*2.3))+.45*Math.abs(ae.n2(Math.cos(m)*6+o*5,Math.sin(m)*6+Y.ridge)))*(1+(o>1?1.1:.4)*Math.exp(-((Math.atan2(Math.sin(m-.49),Math.cos(m-.49))/.55)**2))),x=Ie(l,u,(m,y,v)=>{const A=m*Math.PI*2,S=d(A),P=n-(1-y)*S*1.05+14*c*.1*Math.sin(A*23+o);v[0]=Math.sin(A)*P,v[2]=330+Math.cos(A)*P,v[1]=-30+(S+30)*y**.8,v[3]=m*Math.PI*2*n,v[4]=y*(S+30)*1.4}),w=new Float32Array((l+1)*(u+1)*3);for(let m=0;m<w.length;m+=3)w[m]=c,w[m+1]=o<2?1:.5,w[m+2]=h;x.setAttribute("aRg",new z.BufferAttribute(w,3)),a.push(x);const g=Math.floor(Math.PI*2*n/c);for(let m=0;m<g;m++){const y=(m+.5)/g*Math.PI*2,v=d(y),A=m%11===5?1:m%3===0?3:2;ue.add(Math.sin(y)*n,v+c*.2,330+Math.cos(y)*n,c*.52,Math.cos(y),0,-Math.sin(y),A,0,A===2?1:0)}const b=o<2?1:.5;let M=0,p=0;for(let m=0;m<60;m++)for(let y=0;y<g;y++){++p%400===0&&await C.yield();const v=(y+.5-.5*(m%2))*c/n,A=Math.cos(v);if(330+A*n<-60)continue;const S=d(v),P=(m+.5)*c/((S+30)*1.4);if(P>.985)continue;const R=-30+(S+30)*P**.8;if(R<i)continue;const k=n-(1-P)*S*1.05+14*c*.1*Math.sin(v*23+o)-c*.2,$=Oe((y-m%2)*b,m),q=P>.87?m%2?3:2:$===3?1:$===2?2:$===1?8:ce(y*3.7+m*91.3+o)<.045?1:0;ue.add(Math.sin(v)*k,R,330+A*k,c*.5,A,0,-Math.sin(v),q,0,q===2?1:0),++M%700===0&&await C.yield()}if(W===1)for(let m=0,y=26-o*2;m<y;m++){const v=(m+Xe())/y*2.7-1.35,A=n-c*.7,S=Xe(),P=Xe()<.5?0:Math.PI,R=.95+.3*Xe();for(let k=0;k<7;k++)zt.push(Math.sin(v)*A,d(v)-c*.5,330+Math.cos(v)*A,S),At.push(k,v+Math.PI/2+P,R,0)}await C.yield()}const r=new z.Mesh(ct(a,!1),e);a.forEach(o=>o.dispose()),r.name="ridges",r.frustumCulled=!1,E.add(r)}{const e=zt,t=At,a=Math.max(1,e.length/4),r=le(a);r.setAttribute("aF",new z.InstancedBufferAttribute(new Float32Array(e.length?e:[0,-999,0,0]),4)),r.setAttribute("aG",new z.InstancedBufferAttribute(new Float32Array(t.length?t:[0,0,1,0]),4));const o=G.z/Math.hypot(G.x,G.z),n=-G.x/Math.hypot(G.x,G.z),c=fe(N,{uniforms:O,header:"attribute vec4 aF, aG;"+tt,body:`
        float far = length(aF.xyz - cameraPosition);
        float S = aG.z*clamp(far/15., 1., 340.), Lp = 9.5*S, T = 3.1 + 2.2*fract(aF.w*7.31), Tl = 1.7;     // distance makes them bigger (and fewer): a far shoal is a few huge fish
        float tt = uTime/T + aF.w - (0.72*aG.x - 0.0383*aG.x*aG.x)*S*Tl/(Lp*T);       // (round 7: each bead touches the next, head to tail)
        float cyc = floor(tt), up = clamp(fract(tt)*T/Tl, 0., 1.);       // the leap lasts 1.7 s of each period
        float h1 = hash1(cyc*1.7 + aF.w*31.);
        vec2 dir = vec2(sin(aG.y), cos(aG.y));
        float arc = 4.*up*(1. - up), H = (3.3 + 1.6*h1)*S;
        float hs = topScale(aF.xyz, aF.xyz + vec3(0., H, 0.)); H *= hs;
        C = vec3(aF.x + dir.x*up*Lp, aF.y + aG.w*up + arc*H - 0.9*S*(1. - arc), aF.z + dir.y*up*Lp);
        C.xz -= dir*Lp*0.5;
        C.xz += vec2(dir.y, -dir.x)*sin(up*9. + aG.x*0.8)*0.22*S;
        // (round 7: the whole leap keeps to its own side of the line from the eye to the ring, and clear of the dangling end)
        float sgn = (aF.x - uRingC.x)*${o.toFixed(4)} + (aF.z - uRingC.z)*${n.toFixed(4)} >= 0. ? 1. : -1.;
        C += ringPart(aF.xyz, sgn, 0.5*Lp + 2.*S) - aF.xyz;
        R = mix(0.36, 0.13, aG.x/6.)*S*smoothstep(0., 0.06, up)*(1. - smoothstep(0.94, 1., up))*(1. - smoothstep(5600., 5900., far))*smoothstep(62., 96., cameraPosition.y)*smoothstep(0.02, 0.3, hs)*heroKeep(aF.xyz, min(0.5*Lp, 14.) + 2.*min(S, 3.));     // nothing of them from the river: the V of sky over the lip keeps to the three discs
        AX = normalize(vec3(dir.x*Lp, H*4.*(1. - 2.*up) + aG.w, dir.y*Lp)); E1 = normalize(cross(AX, vec3(dir.y, 0.2, -dir.x)));
        // (round 7) a crystal head, a body of silver-lined and slate beads by turns, a coral tail: never the necklace's pearl
        float sl = step(0.5, mod(aG.x, 2.));
        COLA = aG.x < 0.5 ? mix(uSilver, uGlint, 0.6) : (aG.x > 5.5 ? uCoral : mix(uSilver, uSlate, sl));
        COLB = aG.x < 0.5 ? uSilver : (aG.x > 5.5 ? uCoral : mix(mix(uSilver, uGlint, 0.5), mix(uSlate, uBlue, 0.5), sl));
        LINED = (aG.x > 5.5 || (aG.x > 0.5 && sl > 0.5)) ? 0. : 1.; SEED = fract(aF.w*13. + aG.x*0.17);
        KIND = aG.x < 0.5 ? 1. : 0.;`}),f=new z.Mesh(r,c);f.frustumCulled=!1,f.name="high-fish",E.add(f)}await C.yield(),await C.yield();{const e=D.fork("horns"),t=[],a=[[175,640],[-150,650],[10,730],[-205,400],[215,345],[-240,255],[245,225],[-120,760]],r=new L(G.x,0,G.z).normalize(),o=new L(r.z,0,-r.x),n=Math.hypot(Fe.x,Fe.z)||1,c=Fe.x/n,f=Fe.z/n;for(let s=0;s<a.length+2;s++){const h=s>=a.length,i=s===a.length?1:-1;let l,u,d,x,w,g,b;if(h)l=I.x+r.x*150+o.x*i*76,u=I.z+r.z*150+o.z*i*76,b=Le(l,u)-6,d=I.y+(i>0?185:162)-b,x=d*.07,w=60,g=Math.atan2(-o.z*i-r.z*.25,-o.x*i-r.x*.25);else if(l=a[s][0]+e.range(-12,12),u=a[s][1]+e.range(-12,12),d=e.range(42,78),x=d*e.range(.085,.11),w=e.range(.1,.3)*d,g=e.range(0,6.28),b=Le(l,u)-4,K.distanceTo(l,b+d*.5,u)<40)continue;const M=(S,P)=>(P.set(l+Math.cos(g)*w*S*S,b+d*S,u+Math.sin(g)*w*S*S),P),p=new L,m=h?7:2.4+(s>6?.8:0),y=[];for(let S=0,P=0;S<d;P++){const R=S/d,k=x*Math.pow(1-R,.8)+.5;M(R,p);const $=Math.max(3,Math.round(2*Math.PI*k/m)),q=P%9===8?3:P%9===7||P%9===0?2:P%17===5?1:0;for(let te=0;te<$;te++){const U=(te+P%2*.5)/$*Math.PI*2;let rt=Math.cos(U)*c+Math.sin(U)*f+.2*(ce(te*3.1+P*17.3)-.5)>.22?q===0?3:q===1?1:2:q===0?0:q===3?1:8;if(h){const st=p.x+Math.cos(U)*k-I.x,Ct=p.y-I.y,it=p.z+Math.sin(U)*k-I.z,lt=st*G.x+Ct*G.y+it*G.z,Ot=Math.sqrt(Math.max(st*st+Ct*Ct+it*it-lt*lt,0)),ea=-(Math.cos(U)*(st-lt*G.x)+Math.sin(U)*(it-lt*G.z))/Math.max(Ot,1);ce(te*7.7+P*3.3+i)<(1-F(22,96,Ot))*(.2+.5*F(-.2,.6,ea))&&(rt=4)}ue.add(p.x+Math.cos(U)*k,p.y,p.z+Math.sin(U)*k,m*.5,-Math.sin(U),0,Math.cos(U),rt,0,rt===2?1:0,0,0,0,rt===0?1:0)}y.push(new z.Vector2(Math.max(k-m*.3,.05),S)),S+=m*.9}ue.add(p.x,p.y+m*.9,p.z,m*.6,0,1,0,6,1,0);const v=new z.LatheGeometry(y,9);v.deleteAttribute("uv");const A=v.getAttribute("position");for(let S=0;S<A.count;S++){const P=A.getY(S)/d;A.setXYZ(S,A.getX(S)+l+Math.cos(g)*w*P*P,A.getY(S)+b,A.getZ(S)+u+Math.sin(g)*w*P*P)}t.push(v)}if(t.length){const s=new z.Mesh(ct(t,!1),na(N,"uVelvet*1.6 + uBlue*0.22",z.DoubleSide));t.forEach(h=>h.dispose()),s.name="horn-backing",E.add(s)}}await C.yield();{const e=new z.BufferGeometry;e.setAttribute("position",new z.Float32BufferAttribute(de.pos,3)),e.setAttribute("aR",new z.Float32BufferAttribute(de.r,4)),e.setAttribute("aT",new z.Float32BufferAttribute(de.t,2)),e.setIndex(de.idx),e.boundingSphere=new z.Sphere(new L(0,40,80),400);const t=new z.Mesh(e,$t);t.frustumCulled=!1,t.name="strands",E.add(t);const a=ct(Mt,!1);Mt.forEach(o=>o.dispose());const r=new z.Mesh(a,Kt(N,{header:"attribute vec2 aRad;",body:"RAD = aRad.x;"}));r.name="slung-thread",E.add(r)}await C.yield();{const e=Math.round(420*be*he),t=new Float32Array(e*4),a=D.fork("spray");for(let c=0;c<e;c++)t[c*4]=a.range(-13,13),t[c*4+1]=a(),t[c*4+2]=a.range(.1,.19),t[c*4+3]=a();const r=le(e);r.setAttribute("aY",new z.InstancedBufferAttribute(t,4));const o=fe(N,{uniforms:Re,header:`attribute vec4 aY; ${_e}`,body:`
        float T = 3.2 + 1.5*aY.w, t = fract(uTime/T + aY.y)*T;
        float gz = 0.5 + 0.5*gustAt(vec3(aY.x, 95., 296.));
        vec3 p = vec3(aY.x*(1. + 0.12*t) + sin(t*2. + aY.w*20.)*0.8, 93.2 + (3.5 + 5.*aY.w)*t - 2.6*t*t, 299.5 - (5. + 9.*fract(aY.w*7.3))*t*gz - 1.6*t*t);
        vec3 d = p - uCamP; float l = length(d); p += d/max(l, 1e-3)*max(0., 2.6 - l);
        C = p; R = aY.z*smoothstep(0., 0.25, t)*(1. - smoothstep(T - 0.7, T, t))*(1. - smoothstep(130., 220., length(p - cameraPosition))); SEED = aY.w;   // spray is nothing from the river: the lip stays clean under the three discs
        float sp = t*(3. + 5.*aY.w); AX = normalize(vec3(cos(sp), 0.4, sin(sp))); E1 = normalize(cross(AX, vec3(0.1, 1., 0.2)));
        COLA = aY.w < 0.5 ? uPearl : uSilver; COLB = aY.w < 0.5 ? mix(uPearl, uSilver, 0.8) : mix(uSilver, uGlint, 0.5); LINED = aY.w < 0.5 ? 0.3 : 1.;`}),n=new z.Mesh(r,o);n.frustumCulled=!1,n.name="spray",n.visible=Se===2,E.add(n)}{const e=D.fork("cobble");let t=0,a=0;const r=(n,c,f)=>{const s=K.nearestXZ(n,c).dist,h=ae.n2(n*.03,c*.03+Y.ridge);return s<=46+10*h||f<1.32&&c<470?0:s<=150+28*ae.n2(n*.012+5,c*.012+Y.ridge)?1:2},o=[[2.4,290,668,46],[5,135,800,68],[10,130,810,34]];for(let n=0;n<3;n++){const[c,f,s,h]=o[n];for(let i=0;f+i*c*.87<s;i++)for(let l=-h;l<=h;l++){++a%90===0&&await C.yield();const u=(l+.5*(i%2))*c,d=f+i*c*.87,x=Math.abs(u);if(x>334||d<xt(Math.max(x,23))+5+c*.4)continue;const w=Ne(u,d);if(w<1.07||d<316&&x<Be(Math.min(d,306))+7.5+c*.6||r(u,d,w)!==n)continue;const g=Le(u,d),b=Oe(l,i),M=e()<.045;if(K.distanceTo(u,g,d)<3.6+c*.5)continue;let p=b===3?1:b===2?2:b===1?8:0;M&&(p=1),ue.add(u,g+.25-(c-2.4)*.06,d,c*.5,1,0,.15,p,0,p===2?1:0,0,0,0,p===0?1:0),++t%700===0&&await C.yield()}await C.yield()}}await C.yield();for(const e of Et)e.n&&await jt(e),await C.yield();const qe=new L().lerpVectors(Ve,De,.5),Te=new L,T=new L,ee=new L,Qt=pe(oe.impact),ot={db:33,dp:8,dt:26,de:11},Jt=[{at:[0,62,296],from:.03,to:ge-.02,weight:.35},{at:(e,t)=>{ne(Q+34,Te,e).lerp(qe,.42),Te.y+=8;const a=F(ie-.035,ie+.012,t);if(a>0){K.pointAt(t,T);const r=Math.atan2(-(re.x-T.x),re.z-T.z),o=Math.atan2(re.y+8-T.y,Math.hypot(re.x-T.x,re.z-T.z));ne(Q+46,ee,e);const n=Math.atan2(-(ee.x-T.x),ee.z-T.z),c=Math.atan2(ee.y+4.5-T.y,Math.hypot(ee.x-T.x,ee.z-T.z));ne(Q+18,ee,e);const f=Math.atan2(ee.y+4.5-T.y,Math.hypot(ee.x-T.x,ee.z-T.z)),s=Math.atan2(-(I.x-T.x),I.z-T.z);let h=Math.max(Math.min(B(r,n,.5),s+35*H),r-ot.db*H),i=Math.min(Math.max(o,c,f)-(28-ot.dp)*H,34*H);const l=Math.hypot(qe.x-T.x,qe.z-T.z),u=Math.atan2(-(qe.x-T.x),qe.z-T.z);h=Math.max(h,u-B(44,ot.dt,F(J-.012,J+.016,t))*H);const d=Math.atan2(De.y+4-T.y,l)+(ot.de-28)*H;i=B(i,Math.min(i,d),F(J+.012,J+.036,t)),T.x-=Math.sin(h)*Math.cos(i)*70,T.y+=Math.sin(i)*70,T.z+=Math.cos(h)*Math.cos(i)*70;const x=F(J+.0365,J+.0525,t);x>0&&(ne(Q+56,ee,e),ee.y-=5,T.lerp(ee,x)),Te.lerp(T,a)}return Te},from:Z-.038,to:me+.03,weight:.86,fade:.1},{at:(e,t)=>ne(Q+B(40,Ue-Q-30,F(wt,gt,t)),Te,e),from:wt+.04,to:Bt+.05,weight:.3},{at:(e,t)=>ne(Ue-34,Te,e).lerp(I,F(gt-.03,gt+.05,t)),from:Bt+.02,to:1,weight:.6}],xe=new L,nt=new L,Nt=new L;return{scene:E,path:K,duration:Tt,pace:Gt,camera:{fov:56,near:.25,far:9e3,lookAhead:22,sway:.5,bank:.6},pois:Jt,portal:{shape:"circle",radius:7,tilt:!0,color:"#EAF4FF",glow:0,halo:!1,veil:"#F1D3C6",revealDistance:300,blendDistance:25},post:{flat:1,exposure:ft,bloom:{strength:.12,radius:.2,threshold:1},grade:{saturation:1,contrast:1,tint:"#ffffff",shadowTint:"#000000",vignette:0,grain:0,aberration:0}},ride:"none",style:"none",companion:"none",_dbg:{tailTip:Ve.toArray(),dropFrom:De.toArray(),impact:Qt.toArray(),snagTip:re.toArray(),low:ne(Q+46).toArray(),ring:I.toArray(),u:{uFoot:ge,uLip:Z,uLingA:ie,uLingB:me,uDropBeat:J}},update(e,t,a,r){N.update(t,C.renderer),xe.setFromMatrixPosition(a.matrixWorld),Re.uCamP.value.copy(xe),bt.uFlow.value=t;const o=Ze(r||0);if(Re.uGF.value.x=213-12*(o-Ut),V.setGust(Se===1?0:Se===2?.45+.4*Math.sin(t*.63):F(1,4,o)*Math.exp(-Math.max(o-4,0)/9)),We){const s=o-vt-.3;V.setCycle(V.cycleSpan-6+ye(o-(vt-13.5),-.01,6)),V.setRun(r>0?s:-1,s>0?5*Math.exp(-s*1.6)*Math.sin(s*9):0,s>.6?15*(1-Math.exp(-(s-.6)*.5)*Math.cos((s-.6)*1.15))*F(.6,4.5,s):0),V.setSurge(F(3.2,5,s)*(1-F(10.5,13,s)))}else V.setCycle(V.cycleSpan-6+Math.max(o-(vt-7.5),-.01));V.update(e,t,a),we.visible=!C.through,we.matrix.copy(a.matrixWorld),we.matrixWorld.copy(a.matrixWorld);for(const s of we.children)s.matrixWorld.copy(a.matrixWorld);at.uIn.value=F(0,.012,r||0),at.uBeat.value=t*9.42;const n=r||0;K.pointAt(Math.min(n+15/K.length,1),O.uCompC.value);const c=F(ge-.14,ge-.08,n)*(1-F(Z-.04,Z-.008,n));K.tangentAt(Math.min(n+15/K.length,1),O.uFishU.value).normalize(),O.uClimb.value=c;{const s=a.matrixWorld.elements,h=F(ge-.035,ge+.02,n)*(1-F(Z-.03,Z+.005,n)),i=O.uCompC.value,l=O.uGreatA.value,u=O.uGreatB.value,d=Math.sin(t*.43),x=Math.sin(t*.31+1.7);nt.set(xe.x-s[8]*14-s[0]*(5.2+.4*d)+s[4]*(1.9+.4*x),xe.y-s[9]*14-s[1]*(5.2+.4*d)+s[5]*(1.9+.4*x),xe.z-s[10]*14-s[2]*(5.2+.4*d)+s[6]*(1.9+.4*x)),Nt.set(xe.x-s[8]*15.5+s[0]*(5.7+.4*x)+s[4]*(.3-.4*d),xe.y-s[9]*15.5+s[1]*(5.7+.4*x)+s[5]*(.3-.4*d),xe.z-s[10]*15.5+s[2]*(5.7+.4*x)+s[6]*(.3-.4*d)),l.set(i.x-9.2,i.y+5.2,i.z-2).lerp(nt,h),u.set(i.x+9.6,i.y+5.8,i.z+3).lerp(Nt,h),K.tangentAt(Math.min(n+.004,1),O.uGreatF.value).normalize(),nt.set(-s[8]*.5+s[4]*.85,-s[9]*.5+s[5]*.85,-s[10]*.5+s[6]*.85).normalize(),O.uGreatF.value.lerp(nt,Math.max(h,.45)).normalize(),O.uGreatR.value.set(s[0],s[1],s[2]).normalize(),V.setClear(l,u,3.7*h)}O.uComp.value=Math.max(c,W===1?0:F(me+.03,me+.08,n)*(1-F(.7,.76,n))),O.uEndK.value=F(ie-.05,ie-.012,n)*(1-F(J+.05,J+.085,n));const f=F(.7,.78,n);O.uRingE.value=F(ie-.02,ie+.015,n)*(1-f),O.uFishTop.value=B(2,-.1,F(Z-.03,Z,n)*(1-F(.69,.77,n))),O.uNeckK.value=F(ie-.05,ie-.012,n)*(1-F(J+.03,J+.055,n)),O.uRingK.value=f},dispose(){V.dispose();for(const e of qt)e.dispose()}}}};export{ma as default};
