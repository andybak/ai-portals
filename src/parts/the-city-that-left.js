import*as x from"three";import{clamp as ne,lerp as te,smoothstep as de}from"../kit/core.js";import{RIM as q,STREET as H,LIP as pe,AVE0 as he,PITCH as ae,STREET_W as me,GLOW_DIR as fe,TOWER as oe,toGrid as re,fromGrid as Z,makeKeelShape as ge,makeShared as ve,sharedU as se,makeRouteProbe as we,makeForks as xe,sectorAngles as be,GLSL_COMMON as ie,GLSL_ROCK as Me,Acc as le,makePropMaterial as ue}from"./the-city-that-left-common.js";import*as ke from"../kit/structures.js";import{buildTown as ye}from"./the-city-that-left-town.js";import{Strands as Se,makeStrandMaterial as ze,Sheets as Re,makeFallMaterial as Ne,tunnelInto as Ae}from"./the-city-that-left-thin.js";const J=Math.PI*2;async function Fe(E,L,y,K,V){const j=V.mouths.map(n=>Math.atan2(n[1],n[0])<0?Math.atan2(n[1],n[0])+J:Math.atan2(n[1],n[0])),G=be(336,.42,[[2.6,1.5,1.25],...j.map(n=>[n,.14,1.6])]),v=66,B=337,m=v*B,w=new Float32Array(m*3),h=new Float32Array(m*4),T=(n,t)=>{const o=re(n,t);return Math.abs(o[0])<10.5&&Math.abs(o[1])>150};let M=0;for(let n=0;n<B;n++){const t=G[n],o=Math.cos(t),a=Math.sin(t);let d=pe,A=q;for(let b=0;b<=46;b++){const S=b/46,e=q*(1-Math.pow(1-S,1.45));let s=o*e,i=a*e,r=y.under(s,i);if(b>=45){const f=y.wallR(t,r),p=te(e,f,b===46?1:.5);s=o*p,i=a*p,r=y.under(o*q,a*q),b===46&&(d=r,A=p)}w[M*3]=s,w[M*3+1]=r,w[M*3+2]=i,h[M*4+3]=0,M++}const C=T(o*q,a*q)?H-3.2:H;for(let b=1;b<=13;b++){const S=b/13,e=te(d,C-.4,Math.pow(S,.9)),s=te(A,y.wallR(t,e),Math.min(1,S*3));w[M*3]=o*s,w[M*3+1]=e,w[M*3+2]=a*s,h[M*4+3]=0,M++}const D=y.wallR(t,C),Q=[D-.6,D-4,D-11,D-24,150,0];for(let b=0;b<6;b++){const S=Q[b],e=o*S,s=a*S;w[M*3]=e,w[M*3+1]=(T(e,s)?H-3.2:H-.32)-(b===0?.25:0),w[M*3+2]=s,h[M*4+3]=1,M++}n%40===39&&await E.yield()}const k=new Uint32Array((v-1)*336*6);let R=0;for(let n=0;n<336;n++)for(let t=0;t<v-1;t++){const o=n*v+t,a=o+1,d=(n+1)*v+t+1,A=(n+1)*v+t;k[R++]=o,k[R++]=a,k[R++]=d,k[R++]=o,k[R++]=d,k[R++]=A}const P=new x.BufferGeometry;P.setAttribute("position",new x.BufferAttribute(w,3)),P.setIndex(new x.BufferAttribute(k,1)),await E.yield(),P.computeVertexNormals(),await E.yield();const N=P.attributes.normal.array;for(let n=0;n<v;n++){const t=n*3,o=(336*v+n)*3;for(let a=0;a<3;a++){const d=(N[t+a]+N[o+a])*.5;N[t+a]=d,N[o+a]=d}}const I=fe[0],$=fe[1];for(let n=0;n<B;n++){n%40===39&&await E.yield();for(let t=0;t<v;t++){const o=n*v+t,a=w[o*3],d=w[o*3+1],A=w[o*3+2];let C=1,D=1;if(t<=59){const b=(n+336-2)%336,S=(n+2)%336,e=Math.max(0,t-2),s=Math.min(59,t+2),i=(w[(b*v+t)*3+1]+w[(S*v+t)*3+1]+w[(n*v+e)*3+1]+w[(n*v+s)*3+1])*.25;C=t<=46?ne(.8-(d-i)*.16,.35,1.15):1;let r=-1;for(let f=1;f<=9;f++){const p=f*f*3.2,l=a+I*p,u=A+$*p;if(Math.hypot(l,u)>q+4)break;const O=y.smoothUnder(l,u);r=Math.max(r,(d-2-O)/p)}D=1-de(-.02,.2,r),t>46&&(D=Math.max(D,de(-.1,.5,(a*I+A*$)/Math.max(1,Math.hypot(a,A)))))}let Q=0;for(const b of K){const S=b.p[0]-a,e=b.p[1]-d,s=b.p[2]-A,i=S*S+e*e+s*s,r=Math.sqrt(i);if(r>b.reach)continue;const f=Math.max(.15,(N[o*3]*S+N[o*3+1]*e+N[o*3+2]*s)/Math.max(.5,r)),p=1-r/b.reach;Q+=b.power*f*p*p/(1+i*.012)}h[o*4]=C,h[o*4+1]=D,h[o*4+2]=Math.min(4,Q)}}P.setAttribute("bake",new x.BufferAttribute(h,4)),P.computeBoundingSphere();const g=new x.ShaderMaterial({uniforms:se(L,{uAve0:{value:new x.Vector2(he[0],he[1])},uPitch:{value:new x.Vector2(ae[0],ae[1])},uStreetW:{value:me},uBoiler:{value:0}}),vertexShader:`
      attribute vec4 bake;
      varying vec3 vWorld, vLocal, vN; varying vec4 vBake;
      void main(){
        vLocal = position; vBake = bake; vN = normal;
        vec4 wp = modelMatrix*vec4(position, 1.); vWorld = wp.xyz;
        gl_Position = projectionMatrix*viewMatrix*wp;
      }`,fragmentShader:ie+Me+`
      uniform vec2 uAve0, uPitch; uniform float uStreetW, uBoiler;
      varying vec3 vWorld, vLocal, vN; varying vec4 vBake;
      void main(){
        vec3 p = vLocal, toCam = cameraPosition - vWorld;
        vec3 v = toCam / max(length(toCam), 1e-4);
        vec3 nS = normalize(vN + vec3(0., 1e-5, 0.));
        vec3 fx_ = dFdx(vWorld), fy_ = dFdy(vWorld);
        vec3 nF = cross(fx_, fy_); nF = nF / max(length(nF), 1e-9); if (dot(nF, nS) < 0.) nF = -nF;
        float top = clamp(vBake.a, 0., 1.);
        float dist = length(toCam), fine = 1. - smoothstep(90., 420., dist);
        // faces that look down lie along the beds: there the rock came away in terraces
        float flat_ = (1. - top)*(1. - smoothstep(-.62, -.3, nS.y));
        float wetK, bedF; vec3 facet; vec3 col = ctlRock(p, dist, flat_, wetK, facet, bedF);
        vec2 radial = p.xz / max(length(p.xz), 1e-3);
        float wE = .012 + dist*.0005, riser = (1. - smoothstep(.15 - wE, .15 + wE, bedF))*step(.5, flat_);
        vec3 nTread = normalize(vec3(-.11, -1., .07) + facet*.28), nRiser = normalize(vec3(radial.x, -.22, radial.y) + facet*.5);
        vec3 nWall = normalize(mix(nS, nF, .2) + facet*.34*fine);
        vec3 n = normalize(mix(nWall, mix(nTread, nRiser, riser*.85), flat_));
        n = normalize(mix(n, vec3(0., 1., 0.), top));
        // the lip above a slab's broken edge throws a line of shade
        col *= 1. - .5*step(.5, flat_)*(1. - smoothstep(0., wE*2.5, abs(bedF - .15 - wE)))*clamp(.03/wE, 0., 1.);
        col *= .78 + .44*cF3(p*.33 + 3.);                                // water stains and weathering, a few metres across
        float depth = ${H.toFixed(1)} - p.y, ang = atan(p.z, p.x), arc = ang*${q.toFixed(1)};
        // the top of the cut: pavement slab, soil, fill with old brick, then weathered rock
        float soilD = 2.2 + 2.2*cN(vec2(arc*.05, 3.)), fillD = soilD + 2.5 + 3.5*cN(vec2(arc*.031, 9.));
        float wall = (1. - top)*smoothstep(.25, .6, 1. - abs(nS.y));
        vec3 soil = vec3(.05, .038, .03)*(.6 + .8*cN3(p*vec3(.5, 1.6, .5)));
        vec3 fill = mix(vec3(.1, .095, .088), vec3(.1, .07, .058), step(.62, cN3(p*vec3(.35, .9, .35))))*(.55 + .7*cN3(p*2.1));
        float kS = (1. - smoothstep(soilD - .5, soilD + .5, depth))*wall, kF = (1. - smoothstep(fillD - 1., fillD + 1., depth))*wall;
        col = mix(col, fill, kF); col = mix(col, soil, kS);
        // cellars the cut went through: brick foundation walls, here and there a room standing open
        float cu = arc/9.5, cid = floor(cu), cf = fract(cu), ch = cH(vec2(cid, 3.3)), cv = (depth - .9)/3.3;
        float found = step(.3, ch)*step(.06, cf)*step(cf, .94)*step(0., cv)*step(cv, 1.25)*wall;
        vec2 bk = vec2(arc*2.2 + step(.5, fract(p.y*3.2))*.5, p.y*6.4);
        vec3 brick = mix(vec3(.11, .052, .038), vec3(.075, .04, .032), cH(floor(bk)))*(.4 + .6*smoothstep(.04, .12, min(fract(bk.x), fract(bk.y))));
        col = mix(col, brick, found);
        float room = step(.5, ch)*step(.14, cf)*step(cf, .86)*step(.08, cv)*step(cv, .92)*wall;
        float lamp = step(.74, ch);                                      // some of them still have a lamp burning
        vec2 rc = vec2(cf - .5, cv - .5);
        vec3 roomC = vec3(.008, .007, .008) + uGold*(.012 + .09*lamp)*(1. - smoothstep(.0, .5, length(rc*vec2(1., 1.3) + vec2(0., .3))));
        roomC += uGold*lamp*1.1*(1. - smoothstep(.0, .03, length(rc*vec2(2.9, 1.) + vec2(0., .36))));
        col = mix(col, vec3(.2, .19, .18), wall*(1. - smoothstep(.35, .5, depth)));
        // drains and service tunnels the cut went through, all round the rim: a brick ring, a dark round opening,
        // in most of them a lamp still burning a little way in
        float tu = arc/31., th = cH(vec2(floor(tu), 8.1)), tOn = step(.45, th)*wall;
        vec2 tc = vec2((fract(tu) - .5)*31. + (th - .5)*14., depth - (9.5 + 7.*cH(vec2(floor(tu), 2.7))));
        float tR = length(tc*vec2(1., 1.12)), tRad = .7 + .9*th;
        col = mix(col, brick*1.3, tOn*(1. - smoothstep(tRad + .3, tRad + .42, tR)));
        float bore = tOn*(1. - smoothstep(tRad - .08, tRad + .04, tR));
        vec3 boreC = vec3(.006, .006, .007) + uGold*step(.6, th)*(.05*(1. - smoothstep(0., tRad, tR)) + 1.3*(1. - smoothstep(.0, .16, length(tc - vec2(.3*tRad, -.35*tRad)))));
        wetK *= 1. - kF;
        // the top surface: the street grid carries on to the cut edge
        vec2 d0 = p.xz - uAve0, g = vec2((d0.x + d0.y)*.70711, (-d0.x + d0.y)*.70711);
        vec2 cell = abs(fract(g/uPitch + .5) - .5)*uPitch;
        float street = 1. - smoothstep(uStreetW*.5 - .4, uStreetW*.5, min(cell.x, cell.y));
        float kerb = smoothstep(uStreetW*.5 - 1.6, uStreetW*.5 - 1.2, min(cell.x, cell.y))*street;
        vec3 paving = mix(vec3(.085, .083, .082)*(.8 + .4*cN(p.xz*.7)), vec3(.032, .033, .037)*(.8 + .4*cN(p.xz*.35)), street);
        paving = mix(paving, vec3(.1, .098, .095), kerb*.7);
        float edge = smoothstep(${(q-5).toFixed(1)}, ${(q-.5).toFixed(1)}, length(p.xz));
        paving = mix(paving, soil*1.2, edge*.7*step(.35, cN(p.xz*.9)));
        col = mix(col, paving, top);
        // light
        float ao = clamp(vBake.r, 0., 1.2), slot = clamp(vBake.g, 0., 1.);
        // under the keel the dusk comes up off the land: a cool fill on faces that look down, so the rock is never black
        vec3 bounce = vec3(.36, .4, .6)*clamp(.3 - n.y*.7, 0., 1.)*(1. - top)*(.75 + .5*slot);
        vec3 lit = col*(ctlLight(n)*mix(.7, 1., top) + bounce)*mix(ao, 1., top);
        vec3 Ls = normalize(vec3(uGlowAz.x, .03, uGlowAz.y));
        float rake = clamp(dot(n, Ls)*1.1 + .12, 0., 1.); rake *= rake;
        vec3 bandPale = mix(uBand, vec3(dot(uBand, vec3(.3, .5, .2))), .45);
        lit += col*bandPale*rake*slot*(1. - top)*(.44 + .34*flat_);
        // and the water in the hole gives the afterglow back up onto the belly: a faint moving light, strongest
        // toward the side the band is on
        float westK = smoothstep(-.9, .7, dot(p.xz, normalize(uGlowAz))/${q.toFixed(1)});
        lit += col*mix(uRose, bandPale, .6)*flat_*(.1 + .3*westK)*(.6 + .8*cF(p.xz*.035 + vec2(uTime*.05, -uTime*.035)));
        // wet rock mirrors the slot of afterglow
        float ndv = clamp(dot(n, v), 0., 1.), fres = .03 + .97*pow(1. - ndv, 4.);
        vec3 r = reflect(-v, n);
        float wet = clamp(wetK*(1. - top)*(.55 + .45*uWet) + uWet*top*.7, 0., 1.);
        lit = mix(lit, lit*.6, wet*.6);
        lit += ctlSky(vec3(r.x, abs(r.y)*.6 + .02, r.z))*fres*wet*slot*.8;
        // lamps in the roots
        float fl = 1. + .1*sin(uTime*7.3 + p.x*.31) + .06*sin(uTime*17.1 + p.z*.23);
        lit += col*uGold*clamp(vBake.b, 0., 4.)*fl*2.2;
        lit = mix(lit, roomC, room);
        lit = mix(lit, boreC, bore);
        gl_FragColor = vec4(ctlFog(lit, vWorld - cameraPosition), 1.);
      }`});return{mesh:new x.Mesh(P,g),material:g,triangles:k.length/3}}function We(E,L,y,K,V,F){const _=new le,U=[],W=[],j=[],G=Math.PI/180,v=(e,s)=>{let i=null,r=-2;for(const f of[[Math.SQRT1_2,Math.SQRT1_2],[-Math.SQRT1_2,-Math.SQRT1_2],[-Math.SQRT1_2,Math.SQRT1_2],[Math.SQRT1_2,-Math.SQRT1_2]]){const p=f[0]*e+f[1]*s;p>r&&(r=p,i=f)}return i},B=F.subwayLines,m=F.bellyMouths,w=F.lining,h=F.caissons,T=F.piles,M=F.stubs,k=F.trains,R=e=>V.line("hero",[e.p[0],e.p[1]+2.5,e.p[2]],[e.p[0]+e.d[0]*(e.out+8),e.p[1]+1,e.p[2]+e.d[1]*(e.out+8)],14);for(const[e,s]of[[0,!0],[2*ae[1],!0],[-2*ae[1],!0],[-2*ae[0],!1],[2*ae[0],!1]]){const i=H-B.range(13,24),r=s?Z(0,e):Z(e,0),f=s?Z(1,e):Z(e,1);for(const p of[1,-1]){const l=B.range(2.5,5.5),u=[(f[0]-r[0])*p,(f[1]-r[1])*p];let z=150;for(let Y=0;Y<7;Y++){const X=r[0]+u[0]*z,ee=r[1]+u[1]*z;z+=y.wallR(Math.atan2(ee,X),i)-1.5-Math.hypot(X,ee)}const O={p:[r[0]+u[0]*z,i-2.6,r[1]+u[1]*z],d:u,out:l,wall:!0};O.open=R(O),j.push(O)}}for(let e=0;e<9;e++){const s=(e+m.range(.1,.9))/9*J,i=m.range(100,160),r=m.range(4,9),f=v(Math.cos(s),Math.sin(s));let p=null;for(let l=0;l<7;l++){const u=i+(l%2?1:-1)*Math.ceil(l/2)*12,z=Math.cos(s)*u,O=Math.sin(s)*u;if(p={p:[z,y.under(z,O)-5.6,O],d:f,out:r,wall:!1},p.open=u>60&&u<q-30&&R(p),p.open)break}j.push(p)}const P=new le;for(const e of j)Ae(e.open?_:P,e,w),e.open&&(W.push(e),U.push({p:[e.p[0]+e.d[0]*(e.out+1.5),e.p[1]+3,e.p[2]+e.d[1]*(e.out+1.5)],reach:38,power:1.25}));const N=[.105,.1,.092],I=[.055,.052,.05],$=[],g=K.city.buildings.filter(e=>e.h>34).sort((e,s)=>s.h-e.h).slice(0,44);for(const e of g){const s=e.h>70?2:1;for(let i=0;i<s;i++){const r=e.x+(s>1?(i-.5)*e.w*.45:0)+h.range(-2,2),f=e.z+h.range(-2,2),p=y.under(r,f),l=ne(e.h*h.range(.14,.26),5,25),u=ne(e.w*.09,1.8,4.2),z=h.chance(.3);Math.hypot(r,f)>q-12||!V.line("hero",[r,p+3,f],[r,p-l,f],u+13)||(z?_.box(r,p-l/2+3,f,u*1.8,l+6,u*1.8,N):_.cyl([r,p+3,f],[r,p-l,f],u,u*.94,9,N,0,1,I),$.push({x:r,z:f,y:p-l,r:u}))}}let c=0,n=0;for(const e of K.city.buildings)if(!(e.h>34||e.h<14||!T.chance(.3)||n>=160))for(let s=0;s<3;s++){n++;const i=e.x+T.range(-.35,.35)*e.w,r=e.z+T.range(-.35,.35)*e.d,f=y.under(i,r),p=[i+T.range(-.5,.5),f-T.range(3,11),r+T.range(-.5,.5)];Math.hypot(i,r)>q-10||!V.line("hero",[i,f+2,r],p,10)||(_.cyl([i,f+2,r],p,.55,.5,5,N,0,1,I),c++)}const t=[];for(let e=0;e<34;e++){const s=M.range(0,J),i=H-M.range(2.5,9),r=M.range(.35,1.1),f=M.range(1.2,4);for(let p=0;p<9;p++){const l=s+(p%2?1:-1)*Math.ceil(p/2)*4*G,u=y.wallR(l,i),z=Math.cos(l),O=Math.sin(l),Y=[z*(u+f),i-f*.08,O*(u+f)];if(V.hero(Y,9)){_.cyl([z*(u-2),i,O*(u-2)],Y,r,r,7,[.05,.04,.036],0,1,[.008,.008,.008]),t.push({p:Y,a:l,rad:r});break}}}const o=F.rimPiers,a=[200,-200].map(e=>{const s=Z(0,e);return Math.atan2(s[1],s[0])});let d=0;for(let e=0;e<48;e++){const s=(e+o.range(.15,.85))/48*J,i=o.range(8,23),r=o.range(.8,1.7),f=o.chance(.5),p=Math.cos(s),l=Math.sin(s),u=y.wallR(s,H-i*.5)+r*.3,z=[p*u,H-.6,l*u],O=[p*u,H-i,l*u];a.some(Y=>Math.abs(Math.atan2(Math.sin(s-Y),Math.cos(s-Y)))<7*G)||!V.line("hero",z,O,r+9)||(f?(_.box(z[0],H-.6-i/2,z[2],r*1.8,i,r*1.8,N),_.box(z[0],H-i-.5,z[2],r*2.8,1,r*2.8,I)):_.cyl(z,O,r,r*.94,8,N,0,1,I),d++)}const A=new x.Mesh(_.build(),ue(L,{flicker:1})),C=new le,D=j.filter(e=>e.wall);C.box(0,1.9,-6,2.5,3.1,12,[.07,.085,.08]),C.box(0,2.45,-6,2.56,.85,11,[.2,.18,.12],1.7),C.box(0,1.9,.02,2.1,1.4,.1,[.2,.18,.12],1.4);for(const e of[-.8,.8])C.box(e,1,.06,.34,.34,.1,[.3,.3,.25],4);const Q=new x.InstancedMesh(C.build(),ue(L,{flicker:1}),Math.max(1,D.length));Q.frustumCulled=!1;const b=D.map(e=>({T:e,period:k.range(14,22),start:k(),m:new x.Matrix4().makeBasis(new x.Vector3(e.d[1],0,-e.d[0]),new x.Vector3(0,1,0),new x.Vector3(e.d[0],0,e.d[1]))})).filter(e=>e.T.open);Q.count=b.length;const S=new x.Group;return S.add(A,Q),{object:S,lamps:U,tunnels:W,mouths:j,caissons:$,stubs:t,rimPiers:d,triangles:_.triangles+C.triangles*b.length,update(e){for(let s=0;s<b.length;s++){const i=b[s],r=i.T,f=te(-9,r.out-.8,.5-.5*Math.cos(J*(e/i.period+i.start)));Q.setMatrixAt(s,i.m.setPosition(r.p[0]+r.d[0]*f,r.p[1],r.p[2]+r.d[1]*f))}Q.instanceMatrix.needsUpdate=!0}}}function Pe(E,L,y,K,V,F,_){const U=V.hero,W=F.ladders,j=F.stubPipes,G=F.pipes,v=F.cables,B=F.treeRoots;let m=j;const w=new Se,h=Math.PI/180,T=[.045,.04,.036],M=[.085,.045,.028],k=[.07,.072,.078];let R=0;for(let c=150;c<=232&&R<9;c+=4.6){const n=(c+W.range(-1.2,1.2))*h,t=W.range(40,70),o=Math.cos(n),a=Math.sin(n),d=y.wallR(n,H)+.5,A=W.range(0,.07),C=W.range(-.012,.012),D=W.range(0,J),Q=W.range(.012,.03),b=2.2/Math.sqrt(t/9.8)*W.range(.8,1.1),S=l=>{const u=Math.max(0,l),z=d+.7+u*A+(l<0?l:0);return[o*z,H-.4-u+(l<0?.25:0),a*z]};let e=!0;for(let l=0;l<=t;l+=6)U(S(l),10+l*Q*1.4)||(e=!1);if(!e)continue;const s=[[],[]],i=[[],[]],r=Math.ceil(t/2.6),f=W.int(0,1),p=W.range(.72,.93);for(let l=-2;l<=r;l++){const u=l<0?l*3:t*l/r,z=S(u),O=C*Math.max(0,u),Y=-a*Math.cos(O)+o*Math.sin(O),X=o*Math.cos(O)+a*Math.sin(O);for(let ee=0;ee<2;ee++){if(ee===f&&u>t*p)continue;const ce=ee?.72:-.72;s[ee].push([z[0]+Y*ce,z[1],z[2]+X*ce]),i[ee].push([Math.max(0,u),D,Q,b])}}for(let l=0;l<2;l++)w.line(s[l],.09,T,u=>i[l][u]);for(let l=-5;l<t*p;l+=1.35){if(l>8&&W.chance(.12+.5*l/t))continue;const u=S(l),z=C*Math.max(0,l),O=-a*Math.cos(z)+o*Math.sin(z),Y=o*Math.cos(z)+a*Math.sin(z),X=1.15;w.line([[u[0]-O*X,u[1],u[2]-Y*X],[u[0]+O*X,u[1],u[2]+Y*X]],.13,[.05,.036,.026],()=>[Math.max(0,l),D,Q,b])}R++}let P=0;const N=(c,n,t,o,a)=>{const d=m.range(0,J),A=a?.006:m.range(.015,.04),C=2.4/Math.sqrt(Math.max(4,n)/9.8)*m.range(.8,1.2),D=a?m.range(.3,.8):2,Q=m.range(-1,1),b=m.range(-1,1),S=a?3:7,e=[],s=[];for(let i=0;i<=S;i++){const r=i/S,f=n*r,p=a?r>D?(r-D)*n*.35:0:Math.sin(r*2.6)*n*.06,l=[c[0]+Q*p,c[1]-f+0,c[2]+b*p];if(!U(l,9+f*A*1.5))return!1;e.push(l),s.push(f)}return w.line(e,t,o,i=>[s[i],d,A,C]),P++,!0};for(const c of K.stubs)m.chance(.55)&&N([c.p[0],c.p[1]-c.rad*.5,c.p[2]],m.range(4,22),Math.min(.35,c.rad*.45),m.chance(.5)?M:T,!0);m=G;for(let c=0;c<400&&P<124;c++){const n=m.chance(.4),t=m.range(0,J);if(n){const o=H-m.range(1.5,8),a=y.wallR(t,o)+.4;N([Math.cos(t)*a,o,Math.sin(t)*a],m.range(5,34),m.range(.05,.16),m.pick([T,M,k]),m.chance(.3))}else{const o=q*Math.sqrt(m.range(.02,.97)),a=Math.cos(t)*o,d=Math.sin(t)*o;N([a,y.under(a,d)+.5,d],m.range(4,26),m.range(.05,.2),m.pick([T,M,k]),m.chance(.45))}}const I=K.caissons;for(let c=0,n=0;c<90&&n<22&&I.length>3;c++){const t=v.pick(I),o=v.pick(I),a=Math.hypot(t.x-o.x,t.z-o.z);if(t===o||a<14||a>70)continue;const d=a*v.range(.1,.22),A=[],C=[],D=10,Q=t.y+v.range(1,4),b=o.y+v.range(1,4),S=v.range(0,J);let e=!0;for(let s=0;s<=D;s++){const i=s/D,r=4*i*(1-i)*d,f=[te(t.x,o.x,i),te(Q,b,i)-r,te(t.z,o.z,i)];U(f,10)||(e=!1),A.push(f),C.push(r)}e&&(w.line(A,.06,T,s=>[C[s],S,.07,1.1]),n++)}for(const c of _.rimTrees||[])for(let n=0;n<7;n++){const t=c.a+B.range(-.02,.02),o=H-B.range(.8,2.6),a=y.wallR(t,o)+.25,d=B.range(2,9),A=B.range(0,J),C=B.range(-.25,.25),D=[],Q=[];for(let S=0;S<=5;S++){const e=S/5;D.push([Math.cos(t+C*e*d/q)*(a+.5*Math.sin(e*3)),o-d*e,Math.sin(t+C*e*d/q)*(a+.5*Math.sin(e*3))]),Q.push(d*e)}const b=B.range(.05,.14);D.every(S=>U(S,8))&&w.line(D,b,[.07,.05,.035],S=>[Q[S],A,.02,2.6])}const $=ze(L);return{object:new x.Mesh(w.build(),$),triangles:w.triangles,ladders:R,pipes:P,update(){}}}function Te(E,L,y,K,V,F){const _=new Re,U=Math.PI/180,W=F.riverFall,j=F.mains,G=F.drips;for(const h of[1]){const M=$=>{const g=te(-10.2,10.2,$/12),c=Z(g,h*200),n=Math.atan2(c[1],c[0]);let t=h*200;for(let a=0;a<4;a++){const d=Z(g,t),A=Math.hypot(d[0],d[1]);t+=h*(y.wallR(n,H-3)-.3-A)}const o=Z(g,t);return[o[0],H-3,o[1]]},k=M(6),R=Math.hypot(k[0],k[2]),P=[k[0]/R,k[2]/R],N=W.range(0,50),I=W.range(0,50);_.sheet(12,M,{len:230,out:h>0?30:19,dir:P,seed:N,kind:0,nd:26,spread:h>0?.5:.3}),V.fall("hero",k,P,h>0?38:24,215,22,.8)&&_.sheet(12,$=>{const g=M($);return[g[0]-P[0]*.8,g[1]+.25,g[2]-P[1]*.8]},{len:215,out:h>0?38:24,dir:P,seed:I,kind:0,nd:26,spread:.75})}let v=0;for(const h of K.stubs){const T=j.chance(.5),M=[Math.cos(h.a),Math.sin(h.a)],k=j.range(70,170),R=j.range(3,9)*(.5+h.rad),P=h.rad*j.range(.6,1.1)*.6,N=j.range(0,50),I=[h.p[0],h.p[1]-h.rad*.3,h.p[2]];v>=5||!T||!V.fall("hero",I,M,R,k,12,.8)||(_.sheet(2,()=>I,{len:k,out:R,dir:M,width:P,seed:N,kind:0,nd:14,spread:1.6}),v++)}let B=0;for(let h=0;h<900&&B<70;h++){const T=G.range(0,J),M=q*Math.sqrt(G.range(.01,1)),k=Math.cos(T)*M,R=Math.sin(T)*M,P=re(k,R),N=G.chance(.55),I=G.range(90,190),$=G.range(.07,.13),g=G.range(0,90),c=y.under(k,R)+.3;Math.abs(P[0])>30&&N||!V.fall("hero",[k,c,R],[1,0],0,I,5,.85)||(_.sheet(1,()=>[k,c,R],{len:I,out:0,dir:[1,0],width:$,seed:g,kind:2,nd:6,spread:0}),B++)}const m=Ne(L),w=new x.Mesh(_.build(),m);return w.renderOrder=3,w.frustumCulled=!1,{object:w,material:m,triangles:_.triangles,mains:v,drips:B,update(h){m.uniforms.uFlow.value=1-.62*ne(h,0,1)}}}const Ce=60;function _e(E,L){const y=q+Ce,K=new x.ShaderMaterial({uniforms:se(L,{}),transparent:!0,depthWrite:!1,side:x.DoubleSide,blending:x.CustomBlending,blendSrc:x.OneFactor,blendDst:x.OneFactor,blendSrcAlpha:x.ZeroFactor,blendDstAlpha:x.OneFactor,vertexShader:`
      varying vec3 vWorld, vN;
      void main(){ vec4 wp = modelMatrix*vec4(position, 1.); vWorld = wp.xyz; vN = mat3(modelMatrix)*normal; gl_Position = projectionMatrix*viewMatrix*wp; }`,fragmentShader:ie+`
      varying vec3 vWorld, vN;
      void main(){
        vec3 toCam = cameraPosition - vWorld; float dist = length(toCam);
        vec3 v = toCam / max(dist, 1e-4), n = normalize(vN + vec3(0., 1e-5, 0.));
        float g = clamp(1. - abs(dot(n, v)), 0., 1.), g2 = g*g, limb = g2*g2*g2;
        // where the eye is close to the skin it shows as slow rings round the nearest point
        float nearK = 1. - smoothstep(10., 130., dist);
        float ring = .5 + .5*sin(dist*.33 - uTime*2.2);
        vec3 col = vec3(.36, .46, .75)*limb*.009 + vec3(.3, .4, .7)*ring*ring*nearK*nearK*.02;
        gl_FragColor = vec4(col*(1. - ctlFogF(toCam)), 0.);
      }`}),V=new x.Mesh(new x.SphereGeometry(y,64,40),K);return V.position.set(0,85,0),V.renderOrder=4,{object:V,radius:y,triangles:2560*2}}function Be(E,L,y,K,V){const F=[],_=[],U=[],W=[],j=[];let G=0;const v=(g,c,n,t)=>{const o=G;for(let a=0;a<=c;a++)for(const d of[-1,1])F.push(g[0],g[1],g[2]),_.push(d,a/c),U.push(n[0],n[1],n[2],n[3]),W.push(t[0],t[1],t[2],t[3]),G++;for(let a=0;a<c;a++){const d=o+a*2;j.push(d,d+1,d+2,d+1,d+3,d+2)}},B=V.smoke,m=V.steam,w=V.flags,h=[.5,-.86],T=(g,c,n,t)=>{for(let o=0;o<=12;o++){const a=o/12,d=1-(1-a)*(1-a),A=c*(.25*a+.75*a*a);if(!K.hero([g[0]+h[0]*A,g[1]+c*d*(n?.55:1),g[2]+h[1]*A],12+t*a*1.2+c*a*.035))return!1}return!0};(y.mill?y.mill.stacks:[]).forEach((g,c)=>{const n=c%2===0||B.chance(.4),t=[g.x,H-.3+g.h+1,g.z],o=B.range(105,135),a=B.range(26,38),d=B.range(0,60);n&&T(t,o,0,a)&&v(t,18,[o,2.4,a,d],[0,0,0,0])});const k=y.city.buildings.filter(g=>g.h>26).sort((g,c)=>c.h-g.h);for(let g=0;g<k.length&&g<30;g++){const c=k[g],n=m.chance(.3),t=[c.x+m.range(-.3,.3)*c.w,H+c.h+.5,c.z+m.range(-.3,.3)*c.d],o=m.range(14,30),a=m.range(5,10),d=m.range(0,60);n&&T(t,o,1,a)&&v(t,10,[o,.9,a,d],[1,0,0,0])}for(let g=0,c=0;c<6&&g<k.length;g++){const n=k[g],t=n.x+.32*n.w*(g%2?1:-1),o=n.z+.32*n.d*(g%3?1:-1),a=H+n.h+.4,d=w.range(0,60),A=w.range(0,1),C=w.range(0,1);K.line("hero",[t,a,o],[t+h[0]*5.2,a+9,o+h[1]*5.2],14)&&(v([t,a,o],1,[9,.09,.09,d],[3,0,0,0]),v([t,a+7.4,o],8,[5.2,1.5,1.5,d],[2,A,C,0]),c++)}const R=V.towerFlags,P=re(oe.x,oe.z);for(const[g,c]of[[-1,-1],[1,-1],[1,1],[-1,1]]){const n=Z(P[0]+g*13.4,P[1]+c*13.4),t=n[0],o=n[1],a=H+97.4,d=R.range(0,60),A=R.range(0,1),C=R.range(0,1);K.line("hero",[t,a,o],[t+h[0]*8,a+10,o+h[1]*8],14)&&(v([t,a,o],1,[10,.1,.1,d],[3,0,0,0]),v([t,a+7.8,o],8,[8,2.2,2.2,d],[2,A,C,0]))}const N=new x.BufferGeometry;N.setAttribute("position",new x.Float32BufferAttribute(F,3)),N.setAttribute("aUV",new x.Float32BufferAttribute(_,2)),N.setAttribute("aA",new x.Float32BufferAttribute(U,4)),N.setAttribute("aK",new x.Float32BufferAttribute(W,4)),N.setIndex(j);const I=new x.ShaderMaterial({uniforms:se(L,{}),transparent:!0,depthWrite:!1,side:x.DoubleSide,blending:x.CustomBlending,blendSrc:x.OneFactor,blendDst:x.OneMinusSrcAlphaFactor,vertexShader:`
      attribute vec2 aUV; attribute vec4 aA, aK;
      uniform float uTime;
      varying vec3 vWorld; varying vec2 vUV; varying vec4 vA, vK;
      void main(){
        float t = aUV.y, kind = aK.x, H = aA.x, seed = aA.w;
        vec3 p = position; vec2 wind = vec2(.5, -.86);
        float halfW = mix(aA.y, aA.z, t);
        if (kind < 1.5) {
          // smoke and steam: up fast, then slower, carried downwind, wavering more the higher it is
          float rise = 1. - (1. - t)*(1. - t);
          p.y += H*rise*mix(1., .55, kind);
          p.xz += wind*H*(.25*t + .75*t*t) + vec2(sin(uTime*.31 + seed + t*5.), cos(uTime*.27 + seed*1.7 + t*4.))*t*H*.035;
        } else if (kind < 2.5) {
          // a flag: t runs along the cloth from the pole, the side coordinate is its height; it waves
          float w = sin(t*6.5 - uTime*5.2 + seed)*.42*t + sin(t*3.1 - uTime*3.1 + seed*2.)*.25*t;
          p.xz += wind*H*t + vec2(-wind.y, wind.x)*w;
          p.y += aUV.x*halfW - .25*t*t;
          halfW = 0.;
        } else { p.y += H*t; }
        vec4 wp = modelMatrix*vec4(p, 1.);
        vec3 toCam = cameraPosition - wp.xyz; vec2 rt = vec2(toCam.z, -toCam.x); rt = rt / max(length(rt), 1e-4);
        wp.xz += rt*aUV.x*halfW;
        vWorld = wp.xyz; vUV = aUV; vA = aA; vK = aK;
        gl_Position = projectionMatrix*viewMatrix*wp;
      }`,fragmentShader:ie+`
      varying vec3 vWorld; varying vec2 vUV; varying vec4 vA, vK;
      void main(){
        float t = clamp(vUV.y, 0., 1.), x = clamp(vUV.x, -1., 1.), kind = vK.x, seed = vA.w;
        vec3 toP = vWorld - cameraPosition;
        vec2 h = toP.xz / max(length(toP.xz), 1e-4);
        float back = clamp(dot(h, uGlowAz), 0., 1.); back *= back;
        vec3 col; float a;
        if (kind < 1.5) {
          float nz = cF(vec2(x*1.3 + seed, t*mix(7., 4., kind) - uTime*mix(.22, .5, kind))) + .5*cN(vec2(x*3.7 - seed, t*19. - uTime*.8));
          float body = 1. - x*x;
          a = smoothstep(.45, 1.05, nz*.8 + body*.55)*body*smoothstep(0., .05, t)*(1. - smoothstep(.5, 1., t))*mix(.62, .4, kind);
          vec3 lit = uHemiSky*.5 + uRose*.9*back + uBand*.35*back + uGold*.1*(1. - t);
          col = mix(vec3(.05, .048, .055), vec3(.2, .2, .22), kind)*lit;
        } else if (kind < 2.5) {
          // two plain bands of colour, nothing written on them
          vec3 c1 = mix(mix(vec3(.2, .05, .04), vec3(.05, .09, .2), step(.5, vK.y)), vec3(.2, .15, .04), step(.75, vK.z)), c2 = c1;
          col = mix(c1, c2, step(0., x))*(uHemiSky*.6 + uGold*.5)*(.8 + .25*sin(t*6.5 - uTime*5.2 + seed + 1.));
          a = 1.;
        } else { col = vec3(.03, .03, .034)*uHemiSky; a = 1. - smoothstep(.6, 1., abs(x)); }
        if (a < .004) discard;
        float f = ctlFogF(toP);
        gl_FragColor = vec4(mix(col, uFogCol, f)*a, a);
      }`}),$=new x.Mesh(N,I);return $.frustumCulled=!1,$.renderOrder=2,{object:$,triangles:j.length/3}}async function Le(E,L={}){const y=L.forks||xe(E),K=L.shared||ve(),V=K.uniforms,F=L.shape||ge(E.noise),_=L.mats||ke.makeMaterials({night:.85,lit:.66,glow:3,streetY:H,warm:"#FFC56B",cool:"#FFD9A0",streetGlow:.14,glass:"#101820"}),U=new x.Group,W=L.probe||we(),j=W.hero,G=await ye(E,K,_,{shape:F,vary:L.vary,floraMat:L.floraMat,probe:W,forks:y});U.add(G.object),await E.yield();const v=We(E,K,F,G,W,y);U.add(v.object),await E.yield();const B=await Fe(E,K,F,v.lamps.concat(G.lamps||[]),{mouths:[Z(0,219),Z(0,-219)]});U.add(B.mesh),await E.yield();const m=Pe(E,K,F,v,W,y,G);U.add(m.object),await E.yield();const w=Te(E,K,F,v,W,y);U.add(w.object);const h=_e(E,K);U.add(h.object);const T=Be(E,K,G,W,y);return U.add(T.object),await E.yield(),{object:U,radius:230,height:240,center:new x.Vector3(0,80,0),ground:!1,shared:K,mats:_,town:G,keel:B,roots:v,hanging:m,falls:w,field:h,shape:F,clear:j,probe:W,fieldR:h.radius,anchors:{portalSeat:new x.Vector3(oe.x-9*Math.SQRT1_2,H+oe.crown,oe.z-9*Math.SQRT1_2)},triangles:G.triangles+B.triangles+v.triangles+m.triangles+w.triangles+h.triangles+T.triangles,update(M,k,R,P=0){L.shared||(V.uTime.value=k),G.update(M,k,R),v.update(k),m.update(R),w.update(P)},dispose(){}}}export{Le as buildHero};
