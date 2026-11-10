import*as a from"three";import{clamp as Ve,lerp as ye,smoothstep as te,makePath as t0}from"../kit/core.js";import{buildHero as o0,PALETTE as Ft,OUTLINE as Ct,STYLE_GLSL as we,WATER_GLSL as Ke,slabMaterial as I,stoneMaterial as Ge,makeBatch as N,makeAtlas as a0,curve as B,offsetPoly as n0,ccw as i0,ell as be,leaf as Xe,part as E}from"../parts/garden-in-plan.js";const k0=Math.PI*2,S0=.3;function _e(n,e){const i=n.tile(300,250,[-3.7,-2.7,4,3.9]),t=e.pig,u=e.load?[[1.2,2.15],[.9,3.1],[-.4,3.55],[-1.7,3.1],[-2,2.2]]:[[1.2,2.1],[-1.5,2]],p=e.kind==="ibex"?[[3.25,2.3],[2.9,3.3],[1.9,3.75],[1.3,3.3],[2.1,3.2],[2.5,2.6]]:e.kind==="donkey"?[[3.2,2.1],[3,3.3],[2.6,3.35],[2.5,2.4]]:[[3.25,2.05],[3.5,2.95],[2.9,2.6],[2.5,3.05],[2.45,2.3]],T=B([[-3.3,1.6],[-3.25,.3],[-2.6,-.3],[1.6,-.4],[2.2,.35],[2.9,.8],[3.65,.85],[3.75,1.5],...p,[2,2.2],...u,[-2.8,2.15]],3);if(i.poly(B([[-3,1.55],[-2.95,.35],[-2.4,0],[1.5,-.1],[2,.55],[2.8,1.1],[3.4,1.12],[3.45,1.45],[3,1.85],[2.3,2],[1.2,1.8],[-1.5,1.72],[-2.6,1.85]],3),t),e.spots)for(const[h,v,D]of[[-1.9,1,.5],[-.4,.6,.62],[.9,1.15,.45],[-1,1.45,.3]])i.flat(be(h,v,D,D*.7,9,h),5);if(e.belly!=null&&i.flat(B([[-2.4,.25],[1.3,.1],[1.5,.5],[-.5,.42]],3),e.belly),e.kind==="ibex"?(i.ridge([[2.75,2],[2.6,3],[1.9,3.45]],5,1.5),i.ridge([[3.3,1.2],[3.2,.6]],5,.8)):e.kind==="donkey"?(i.poly(Xe(2.75,2,2.85,3.1,.2,4),5,{sketch:!1}),i.ridge([[2.2,2],[1.2,1.9]],5,1.2)):(i.ridge([[2.75,2.1],[2.62,2.75]],6,1.3),i.ridge([[3.1,2],[3.3,2.7]],6,1.3)),i.dot(2.95,1.55,.1,5,!1),i.ridge([[-2.95,1.6],[-3.1,.6],[-3,0]],5,.8),e.load){i.poly(B([[-1.75,2.05],[-1.45,2.95],[-.4,3.3],[.65,2.95],[.95,2.05]],3),4);for(let h=-3;h<=3;h++)i.ridge([[-.4+h*.32,2.15],[-.4+h*.4,3.1-Math.abs(h)*.07]],3,.55);i.ridge([[-1.6,2.5],[.8,2.5]],3,1.1)}const V=h=>{const v=[[h-.26,.2],[h+.26,.2],[h+.17,-2],[h+.36,-2.4],[h-.24,-2.4],[h-.17,-2]];return i.poly(v,t,{sketch:!1}),i.flat([[h-.2,-2.12],[h+.3,-2.12],[h+.33,-2.36],[h-.22,-2.36]],5),n0(i0(v),.17)},w=(h,v)=>E(i,V(h),{thick:.3,bevel:.09,hinge:[h,.1],amp:v,freq:3.1});return{parts:[E(i,T,{thick:.5}),w(-2.45,.3),w(-1.75,-.3),w(1,-.3),w(1.7,.3)],h:4,len:7.4}}function s0(n){const e=n.tile(330,290,[-5.6,-1.2,5.6,8.6]),i=[[-5.3,1.9],[-4.4,.2],[-3,-.7],[3,-.7],[4.4,.2],[5.3,1.9],[4.4,1.5],[3.1,.75],[3,8],[-3,8],[-3.1,.75],[-4.4,1.5]];e.poly(B([[-5,1.55],[-4.1,.35],[-2.9,-.4],[2.9,-.4],[4.1,.35],[5,1.55],[3.9,1],[2.6,.45],[-2.6,.45],[-3.9,1]],3),2);for(const t of[-3.4,-1.8,0,1.8,3.4])e.ridge([[t,-.25+Math.abs(t)*.08],[t,.38+Math.abs(t)*.1]],4,1.2);e.poly([[-2.6,2],[2.6,2],[2.6,7.4],[-2.6,7.4]],6);for(const t of[2,7.4])e.ridge([[-2.75,t],[2.75,t]],4,1.6);for(let t=1;t<5;t++)e.ridge([[-2.5,2+t*1.08],[2.5,2+t*1.08]],3,.45);return e.ridge([[0,.5],[0,7.7]],5,1.1),e.ridge([[-3.9,2.6],[-4.6,.3]],5,.9),e.poly(Xe(-4.55,.5,-4.95,-.9,.24,4),3,{sketch:!1}),{parts:[E(e,i,{thick:.5})],h:8,len:10.6}}function l0(n){const e=n.tile(110,180,[-1,-.1,1,2.45]),i=B([[-.75,0],[-.3,1],[-.62,1.7],[-.25,1.95],[-.25,2.3],[.3,2.3],[.32,1.95],[.7,1.65],[.85,1],[.5,1.05],[.3,1],[.8,0],[.25,0],[0,.6],[-.3,0]],2);return e.poly([[-.5,.1],[-.12,.95],[-.42,1.62],[.45,1.62],[.16,.95],[.55,.1],[.3,.1],[0,.72],[-.28,.1]],3,{sketch:!1}),e.poly([[-.24,.72],[-.1,1.08],[.15,1.08],[.3,.72]],6,{sketch:!1}),e.dot(.03,1.95,.24,3),e.flat(be(-.05,2.02,.26,.16,8),5),e.ridge([[.4,1.55],[.62,1.1]],3,1.3),{parts:[E(e,i,{thick:.3,bevel:.08})],h:2.3,len:1.8}}function r0(n){const e=n.tile(360,250,[-9.4,-.3,9.4,12.6]),i=[[-8.6,0],[8.6,0],[8.2,8.6],[8.9,9.4],[8.9,10],[5.6,10],[5.6,12.2],[3.2,11.2],[3.2,10],[-2.2,10],[-2.2,12.2],[-4.6,11.2],[-4.6,10],[-8.9,10],[-8.9,9.4],[-8.2,8.6]];e.poly([[-8.2,.3],[8.2,.3],[7.85,8.5],[-7.85,8.5]],6);for(let t=0;t<16;t++)e.flat([[-8.4+t*1.05,8.75],[-7.95+t*1.05,8.75],[-7.95+t*1.05,9.65],[-8.4+t*1.05,9.65]],[1,3,2][t%3]);e.ridge([[-8.5,8.65],[8.5,8.65]],-1,1),e.ridge([[-8.6,9.72],[8.6,9.72]],-1,1),e.poly([[-1.3,.3],[1.3,.3],[1.3,5.2],[-1.3,5.2]],3),e.ridge([[0,.5],[0,5]],5,.7),e.poly([[-1.7,5.2],[1.7,5.2],[1.7,5.9],[-1.7,5.9]],4,{sketch:!1});for(const t of[-5.4,5.4]){e.poly([[t-1.2,4.6],[t+1.2,4.6],[t+1.2,6.8],[t-1.2,6.8]],5,{sketch:!1});for(let u=-1;u<=1;u++)e.ridge([[t+u*.6,4.7],[t+u*.6,6.7]],6,.8)}for(const t of[-3.4,4.4])e.poly([[t-.9,10.1],[t+.9,10.1],[t+.9,11],[t-.9,11.75]],3,{sketch:!1});return{parts:[E(e,i,{thick:.6})],h:12.2,len:18}}function c0(n,e){const i=n.tile(430,150,[-31,-.5,31,15.5]),t=B([[-30,0],[-22,5.2],[-13,8.3],[-6,13.6],[1,11.2],[9,14.6],[17,7.4],[24,5.6],[30,0]],4);i.poly(B([[-28.6,.4],[-21.5,4.6],[-12.6,7.6],[-6,12.8],[1,10.4],[9,13.8],[16.4,6.8],[23.6,5],[28.6,.4]],4),4);for(let u=0;u<3;u++)i.ridge(B([[-24+u*3,1.2+u*2.2],[-12,3.4+u*2.3],[-5,6.2+u*2.2],[3,4.6+u*2.2],[10,6.8+u*2.2],[20-u*3.5,1.6+u*1.6]],3).slice(0,16),3,.9);for(let u=0;u<26;u++){const p=-22+e()*44,T=.8+e()*3.2;i.dot(p,T,.32,u%3?3:5,!1)}return{parts:[E(i,t,{thick:.6})],h:14.6,len:60}}function u0(n){const e=n.tile(190,640,[-1.8,-4.6,1.8,7.9]),i=B([[0,7.6],[.42,6.6],[.9,5],[1.3,2.4],[1.42,-.8],[1.2,-4.3],[-1.2,-4.3],[-1.42,-.8],[-1.3,2.4],[-.9,5],[-.42,6.6]],3);e.poly(B([[0,7.15],[.3,6.4],[.68,4.9],[1.04,2.4],[1.14,-.8],[.95,-4],[-.95,-4],[-1.14,-.8],[-1.04,2.4],[-.68,4.9],[-.3,6.4]],3),2);for(const t of[-.55,0,.55])e.ridge([[t,-3.8],[t*.95,2.2],[t*.55,5],[t*.2,6.5]],5,.5);for(let t=-3.4;t<6.9;t+=1.02){const u=t<2.4?1.08:Math.max(.2,1.06-(t-2.4)*.19);e.poly([[-u,t],[u,t],[u,t+.26],[-u,t+.26]],4,{sketch:!1}),e.ridge([[-u,t+.13],[u,t+.13]],3,.5)}return e.dot(0,4.75,.52,6),e.ridge(be(0,4.75,.36,.36,14),3,.9,!0),e.ridge(be(0,4.75,.17,.17,10),3,.9,!0),e.ridge([[.3,5],[.42,5.7],[.16,6.3]],6,1.2),{parts:[E(e,i,{thick:.45,bevel:.16})],h:12}}function d0(n){const e=n.tile(220,300,[-1.25,-.2,1.25,3.2]),i=B([[.3,0],[.28,1],[.5,1.55],[1.02,2.3],[1.1,2.72],[.55,2.98],[0,3.05],[-.55,2.98],[-1.1,2.72],[-1.02,2.3],[-.5,1.55],[-.28,1],[-.3,0]],3);e.poly([[-.15,.1],[.15,.1],[.14,1.3],[-.14,1.3]],2,{sketch:!1}),e.poly(B([[.14,1.15],[.36,1.65],[.84,2.32],[.9,2.6],[.45,2.78],[0,2.84],[-.45,2.78],[-.9,2.6],[-.84,2.32],[-.36,1.65],[-.14,1.15]],3),2);for(let t=-4;t<=4;t++){const u=t*.1;e.ridge([[Math.sin(u)*.9,1.45+Math.abs(t)*.05],[Math.sin(u)*2,.95+Math.cos(u)*1.75]],5,.5)}for(let t=-5;t<=5;t++){const u=t*.165,p=2.78-t*t*.008;e.poly(Xe(u,p,u*1.08,p+.3,.07,3),3,{sketch:!1,line:!1})}for(const t of[.25,.6,.95])e.poly([[-.17,t],[.17,t],[.17,t+.15],[-.17,t+.15]],4,{sketch:!1});return{parts:[E(e,i,{thick:.35,bevel:.1})],h:3}}function p0(n){const e=n.tile(440,300,[-7.8,-.2,7.8,10.4]),i=7.6,t=[[-1,0],[1,0],[.62,6.6],[.75,8.4],[.35,8.4],[.25,7.2],[-.25,7.2],[-.35,8.4],[-.75,8.4],[-.62,6.6]];e.poly([[-.72,.25],[.72,.25],[.4,6.5],[-.4,6.5]],6);for(const p of[1.2,3.4,5.6])e.ridge([[-.6+p*.04,p],[.6-p*.04,p]],3,.9);const u=[[-7.3,i+1],[-5.2,i+.5],[7.1,i+.34],[7.45,i-.1],[7.45,i-5.1],[5.95,i-5.1],[5.95,i-.42],[-5.2,i-.5],[-7.3,i-1],[-7.6,i]];return e.poly([[-5.4,i-.16],[6.9,i-.1],[6.9,i+.1],[-5.4,i+.16]],3,{sketch:!1}),e.poly(be(-6.35,i,.95,.72,12),5),e.ridge([[6.7,i-.1],[6.7,i-3.5]],5,.7),e.poly([[6.2,i-3.5],[7.2,i-3.5],[7,i-4.8],[6.4,i-4.8]],3),e.ridge([[6.25,i-3.9],[7.15,i-3.9]],4,.8),{parts:[E(e,t,{thick:.5}),E(e,u,{thick:.75,bevel:.12,hinge:[0,i],amp:.26,freq:.9})],h:9}}function f0(n){const e=n.tile(300,84,[-7.5,-.3,7.5,3.9]),i=[[-7.28,0],[7.28,0],[7.28,3.4],[-7.28,3.4]];e.poly([[-7.02,.25],[7.02,.25],[7.02,3.14],[-7.02,3.14]],6),e.flat([[-7.02,2.62],[7.02,2.62],[7.02,3.02],[-7.02,3.02]],3);for(let t=-5.6;t<6;t+=2.8)e.ridge([[t,.4],[t,2.5]],3,.6);for(let t=-6.3;t<6.5;t+=1.4)e.flat([[t-.22,1.5],[t+.22,1.5],[t,2.1]],5);return{parts:[E(e,i,{thick:.5})],h:3.4,len:14.56}}const Mt={r:6.2,R:7};function h0(n){const e=n.tile(250,420,[-.3,-7.4,7.4,7.4]),{r:i,R:t}=Mt,u=Math.PI/180,p=.1,T=(i+t)/2,V=-48,w=(v,D,se,U)=>{const O=[];for(let q=0;q<=U;q++){const g=(D+(se-D)*q/U)*u;O.push([Math.cos(g)*v,Math.sin(g)*v])}return O},h=(v,D,se=0,U=0,O=0,q=26)=>[...w(t-se,v+U,D-O,q),...w(i+se,D-O,v+U,q)];e.poly(h(V,90,p,1.4,.3),2),e.ridge(w(T,V+3,88,30),5,.6);for(let v=-40;v<=70;v+=18)e.poly(h(v-2.2,v+2.2,p+.03,0,0,2),4,{sketch:!1});return e.poly(h(85.2,89.6,p+.03,0,0,2),3,{sketch:!1}),e.poly(h(-90,V,p,0,1.4,10),6),e.ridge(w(T,-90,V-4,10),3,1.2),{parts:[E(e,h(V,90),{thick:.6,bevel:.07}),E(e,h(-90,V,0,0,0,10),{thick:.6,bevel:.07})],h:14}}function Y(n,e,i,t,u,p={}){const T=p.ph??0,V=p.s??1;e.parts.forEach((w,h)=>{p.only&&!p.only.includes(h)||n.add(w.geo,i,t,[u[0],u[1],T,u[2]??0],[w.hinge[0],w.hinge[1],p.still?0:w.amp,w.freq],V,!!p.mir,p.rot??0)})}const m0=[{name:"morning",pal:Ft,line:Ct,sun:[.8,.29,.53],rim:[1.27,1.27,1.27],shade:"#8fa3c4"},{name:"golden",pal:Ft,line:Ct,sun:[-.72,.22,.66],rim:[1.34,1.15,.82],shade:"#b08ad8"},{name:"moon",pal:["#C3C8CE","#3466AC","#2F6A52","#84503C","#A48D5C","#17181C","#F2F4F6"],line:"#4A3B3C",sun:[.62,.42,.66],rim:[1.3,1.34,1.4],shade:"#7f97d6"}];var z0={id:"garden-in-plan",name:"The Garden Drawn from Above",category:"domestic",weirdness:.5,media:["air","water","tiny"],async build(n){const e=n.rng,i=n.vary||{},t=Ve(n.quality?.detail??1,.6,1),u=Ve(i.density??1,.7,1.3),p=new a.Scene,T=e.fork("edition"),V=T(),w=T(),h=T(),v=m0[i.hour==="golden"?1:i.hour==="night"?2:i.hour==="dawn"||i.hour==="day"||V<.52?0:V<.86?1:2],D=w<.53?0:w<.78?1:2,se=h>.8,U=!!i.rare,O=v.pal,q=new a.Vector3(...v.sun).normalize();p.background=new a.Color(O[0]);const g=await o0(n,{palette:O,outline:v.line,detail:t,weather:se?.62:.03+.08*h,season:D});g.uniforms.uRise.value.y=.5,g.uniforms.uFrontMin.value=2.5,g.uniforms.uFrontX.value=.2,p.add(g.object),g.setSun(q);const C=g.uniforms,fe=g.anchors,y=g.figures;C.uRimC.value.set(...v.rim),C.uShadeC.value.set(v.shade),await n.yield();const H=new a.Vector3(.5,0,-.8660254),Pt=new a.Vector3(-.8660254,0,-.5),At=new a.Vector3(0,40,292),K=At.clone().addScaledVector(H,-86),xe=[];for(const o of[0,20,40,60])xe.push(K.clone().addScaledVector(H,o).toArray());xe.push([-6.2,40,300],[-1.2,40,282],[0,39.8,262],[0,39,236],[0,38,210],[0,29,181],[0,20,152],[0,11,123],[0,5.2,104],[0,2.7,91],[0,2.2,76],[0,2.2,40],[0,2.2,-10],[0,2.2,-60]);for(const o of fe.flyThrough.slice(5))xe.push(o);const G=t0(xe),X=G.length,$e=o=>Math.PI/6*(1-te(0,100,210-o)),Lt=330,oe=[[.38,-120],[.44,-200],[.5,-290],[.56,-420]],Vt=new a.Vector3,Gt=o=>{let s=G.pointAt(o,Vt).z-Lt;if(o>=oe[0][0]){let d=oe[oe.length-1][1];for(let l=1;l<oe.length;l++)if(o<oe[l][0]){const c=oe[l-1],f=oe[l];d=ye(c[1],f[1],(o-c[0])/(f[0]-c[0]));break}s=Math.min(s,d)}return U?Math.max(s,12):s},he=o=>{let s=.5,d=1e9;const l=new a.Vector3;for(let c=60;c<=400;c++){G.pointAt(c/400,l);const f=Math.abs(l.z-o)+Math.abs(l.x)*4;f<d&&(d=f,s=c/400)}return s},_t=he(84);await n.yield();const Bt=he(-96);await n.yield();const Et=he(44);await n.yield();const Be=9,Tt=64,Ze=.5,le=(o={})=>({...C,uSunL:{value:q.clone()},uFront:{value:new a.Vector4(0,0,1,1e4)},uFrontW:{value:130},uFrontX:{value:0},uFrontMin:{value:0},uCamL:{value:new a.Vector3},uEyeL:{value:new a.Vector3},uRise:{value:new a.Vector4(-1,.25,0,280)},...o}),P=a0(1536,O,v.line),r={};await n.yield(),r.ox=_e(P,{pig:3,kind:"ox",belly:6}),await n.yield(),r.cow=_e(P,{pig:6,kind:"ox",spots:!0}),await n.yield(),r.donkey=_e(P,{pig:6,kind:"donkey",load:!0}),await n.yield(),r.ibex=_e(P,{pig:4,kind:"ibex",belly:6}),await n.yield(),r.boat=s0(P),await n.yield(),r.man=l0(P),r.villa=r0(P),await n.yield(),r.hill=c0(P,e.fork("hill")),await n.yield(),r.deck=u0(P),await n.yield(),r.prow=d0(P),r.shaduf=p0(P),await n.yield(),r.wall=f0(P),r.door=h0(P),await n.yield();const[je,Je]=P.finish(n.renderer),re=o=>({...o,uAtlasC:{value:je},uAtlasD:{value:Je}}),j=540,Q=[0,30],Ee=640,ke=40,Te=150,qe=204,et=345,qt=`
      ${we}
      uniform vec4 uSky;                      // centre x, z, baseline 1, baseline 2
      uniform vec2 uSky3;                     // baselines 3 and 4
      varying vec3 vG, vN;
      void main(){
        vec3 fw = fwidth(vG); float px = max(max(length(fw.xz), fw.y)*0.75, 1e-4);
        vec2 d = vG.xz - uSky.xy; float wall = step(abs(vN.y), 0.5);
        float ang = atan(d.x, -d.y + 1e-4);
        vec2 p = mix(vG.xz, vec2(ang*${j.toFixed(1)}, vG.y), wall);
        vec3 col = stoneAt(p*0.04 + 7., px*0.04)*(1. + 0.03*(vnoise(p*0.012) - 0.5));
        float lw = max(0.5, 0.9*px), far = wall*(1. - smoothstep(2.2, 2.35, abs(ang)));
        float b1 = min(abs(vG.y - uSky.z), abs(vG.y - uSky.z + 3.2)), b2 = min(abs(vG.y - uSky.w), abs(vG.y - uSky.w + 3.2));
        float b3 = min(min(abs(vG.y - uSky3.x), abs(vG.y - uSky3.x + 3.2)), min(abs(vG.y - uSky3.y), abs(vG.y - uSky3.y + 3.2)));
        col = mix(col, uLineC, (1. - smoothstep(lw, lw + px, min(min(b1, b2), b3)))*far*0.9);
        float up = mix(1., smoothstep(418., 500., vG.y), wall);
        col = mix(col, uPig[3], gridAt(p*0.25, px*0.25, 1.)*0.3*up);
        gl_FragColor = vec4(edgeTone(col, 0.), 1.);
      }`,We=Ge(C,{uSky:{value:new a.Vector4(Q[0],Q[1],ke,Te)},uSky3:{value:new a.Vector2(qe,et)}},qt);We.side=a.DoubleSide;const tt=new a.Mesh(new a.CylinderGeometry(j,j,Ee,96,1,!0).translate(Q[0],Ee/2-20,Q[1]),We),ot=new a.Mesh(new a.CircleGeometry(j+2,64).rotateX(Math.PI/2).translate(Q[0],Ee-20,Q[1]),We);tt.frustumCulled=ot.frustumCulled=!1,p.add(tt,ot);const Se=le();Se.uFrontW.value=Be;const Wt=`
      ${we}
      ${Ke}
      uniform vec4 uLeg;                      // P0.xz, H0.xz
      uniform vec4 uWallG;                    // the cliff's corner (xz) and the direction of its face (xz)
      uniform vec3 uEyeL;
      varying vec3 vG, vN;
      vec3 segD(vec2 p, vec2 a, vec2 b){ vec2 ab = b - a; float t = clamp(dot(p - a, ab)/max(dot(ab, ab), 1e-4), 0., 1.); vec2 c = a + ab*t; return vec3(length(p - c), p - c); }
      void main(){
        vec2 p = vG.xz; vec2 fw = fwidth(p); float px = max(max(fw.x, fw.y)*0.75, 1e-4);
        float st = stageAt(vG), cut = smoothstep(2.5, 3.5, st), ink = smoothstep(1.9, 2.5, st);
        vec3 stone = stoneAt(p, px), col = stone; float e = 0.;
        vec2 sun2 = uSunL.xz/max(length(uSunL.xz), 1e-3);
        vec3 d1 = segD(p, uLeg.xy - uLeg.zw*60., uLeg.xy + uLeg.zw*66.), d2 = segD(p, uLeg.xy + uLeg.zw*66., vec2(0., 292.)), d3 = segD(p, vec2(0., 292.), vec2(0., 212.));
        vec3 dm = d1.x < d2.x ? d1 : d2; dm = dm.x < d3.x ? dm : d3;
        float d = dm.x - 14.4; vec2 g = dm.yz/max(dm.x, 1e-3);
        // the water lies against the foot of the cliff: everything between its face and the course is canal
        vec2 wn = vec2(-uWallG.w, uWallG.z), pc = p - uWallG.xy; float wf = dot(pc, wn), wx = dot(pc, uWallG.zw);
        float dW = max(max(-wf, wx), max(-wx - 136., -dot(p - uLeg.xy, vec2(uLeg.w, -uLeg.z)))), byWall = step(dW, d);
        d = min(d, dW);
        float along = dot(p - uLeg.xy, uLeg.zw);
        float lw = max(0.09, 0.8*px), lk = min(0.09/lw + 0.15, 1.);
        if (d < 0.) {
          float zc; gZig = 1.3*(1. - smoothstep(3.6, 4.0, st));
          vec4 w = waterAt(p, px, sun2, smoothstep(300., 400., distance(vG, uEyeL))*smoothstep(3.6, 4.0, st), zc);
          float pnt = paintAt(p*0.5, st, px);
          col = mix(mix(stone*(1. - 0.04*cut), mix(uPig[5], uPig[3], gLost), ink*zc*mix(0.85, 0.42, gLost)), w.rgb, pnt);
          e = w.a*cut*step(0.5, pnt + 0.5*cut);
          float wl = (1. - smoothstep(1.2, 1.2 + px, -d))*dot(-g, sun2)*2.2*(1. - byWall); e = abs(wl) > 0.05 ? min(clamp(wl, -1., 1.), 0.) : e;
        } else {
          float v = d - 4.6, cell = floor(along/3.2), f = (fract(along/3.2) - 0.5)*3.2;
          float inBand = step(abs(v), 1.9), small = smoothstep(0.5, 1.6, px);
          float inB = step(abs(f), 1.25)*step(abs(v), 1.25)*(1. - small);
          float k = mod(cell, 4.);
          vec3 pg = k < 0.5 ? uPig[1] : k < 1.5 ? uPig[3] : k < 2.5 ? uPig[2] : uPig[4];
          vec3 bandC = mix(mix(uPig[6], pg, inB), mix(uPig[6], (uPig[1] + uPig[3] + uPig[2] + uPig[4])*0.25, 0.5), small);
          col = mix(col, bandC, inBand*paintAt(p*0.5 + 9., st, px)); gChipE *= inBand; gChipS *= inBand;
          float bl = max(1. - smoothstep(lw, lw + px, abs(abs(v) - 1.9)), inB > 0.5 ? 1. - smoothstep(lw, lw + px, min(1.25 - abs(f), 1.25 - abs(v))) : 0.);
          float cop = 1. - smoothstep(lw, lw + px, abs(d - 1.1));
          col = mix(col, mix(uPig[5], uLineC, smoothstep(3.6, 4.4, st)), max(bl*step(abs(v), 2.1), cop)*lk*ink);
          vec2 bq = vec2(f, v), dd = vec2(1.25) - abs(bq), bb = (1. - smoothstep(0.22, 0.22 + px, dd))*inB;
          e = clamp(-sign(v)*dot(g, sun2)*bb.y*2.2, -1., 1.)*cut;
        }
        col = mix(col, uPig[3], gridAt(p, px, st - 1.)*0.6*(1. - smoothstep(3.6, 4.6, st)*step(d, 7.)));
        gl_FragColor = vec4(edgeTone(col, e), 1.);
      }`,Re=new a.Mesh(new a.PlaneGeometry(1300,1300,1,1).rotateX(-Math.PI/2).translate(0,-2.4,30),Ge(Se,{uLeg:{value:new a.Vector4(K.x,K.z,H.x,H.z)},uWallG:{value:new a.Vector4}},Wt));Re.frustumCulled=!1,p.add(Re),await n.yield();const Rt=13,It=.15,A=new a.Group,Ie=K.clone().addScaledVector(H,66).addScaledVector(Pt,Rt).setY(0);A.rotation.y=Math.PI/3-It,A.position.copy(Ie).sub(new a.Vector3(66,0,0).applyAxisAngle(new a.Vector3(0,1,0),A.rotation.y)),p.add(A),A.updateMatrixWorld(!0);{const o=new a.Vector3(1,0,0).applyQuaternion(A.quaternion);Re.material.uniforms.uWallG.value.set(Ie.x,Ie.z,o.x,o.z)}const ae=le();ae.uFrontW.value=Be;const $=-70,z=66,ze=100,Nt=`
      ${we}
      ${Ke}
      varying vec3 vG, vN;
      // the block border that closes the wall's end is the cornice's border cut at half its size: 1.9 m across with
      // its two white bars, less than the smallest figure of the registers is tall (a man, 2.2 m). We pass it close,
      // so beside any figure it is the painted wall's own edge and never a bar of blocks across the picture.
      const float EB = 0.5;
      void main(){
        vec2 p = vG.xy; vec2 fw = fwidth(p); float px = max(max(fw.x, fw.y)*0.75, 1e-4);
        float st = stageAt(vG), cut = smoothstep(2.5, 3.5, st), ink = smoothstep(1.9, 2.5, st);
        vec3 stone = stoneAt(p*vec2(1., 0.93) + 31., px), col = stone; float e = 0.;
        vec2 s2 = uSunL.xy/max(length(uSunL.xy), 1e-3);
        float lw = max(0.09, 0.8*px), lk = min(0.09/lw + 0.15, 1.);
        if (abs(vN.z) < 0.5) { e = clamp(dot(vN, uSunL)*1.7, -1., 1.); }
        else if (p.y < 7.4 || vG.z > 0.3) {                        // the foot register, and the ford of register 4: water
          float zc; gZig = 1.3*(1. - smoothstep(3.6, 4.0, st)); vec4 w = waterAt(p, px, s2, 0., zc); float pnt = paintAt(p*0.5, st, px);
          col = mix(mix(stone*(1. - 0.04*cut), mix(uPig[5], uPig[3], gLost), ink*zc*mix(0.85, 0.42, gLost)), w.rgb, pnt); e = w.a*cut*step(0.5, pnt + 0.5*cut);
          float top = (1. - smoothstep(0.5, 0.5 + px, 7.4 - p.y))*step(vG.z, 0.3); e = top > 0.05 ? -top*max(s2.y, 0.3)*cut : e;
        } else if (p.y < 96. && p.x < 66. - 3.8*EB) {
          float k = floor(p.y/8.), v = p.y - k*8.;                 // the ruled baseline: a sunk band of pigment under each register
          float kk = mod(k, 3.); vec3 pg = kk < 0.5 ? uPig[2] : kk < 1.5 ? uPig[3] : uPig[1];
          float inB = step(abs(v - 0.05), 0.33)*step(7.5, p.y);
          col = mix(col, pg, inB*paintAt(p*0.5 + 3., st, px)); gChipE *= inB; gChipS *= inB;
          float bl = 1. - smoothstep(lw, lw + px, min(abs(v - 0.38), min(abs(v + 0.28), abs(v - 7.72))));
          col = mix(col, mix(uPig[5], uLineC, smoothstep(3.6, 4.4, st)), bl*lk*ink*step(7.5, p.y));
          float hw = 0.14 + px*0.5;
          e = ((1. - smoothstep(hw, hw + px, abs(v + 0.2))) - (1. - smoothstep(hw, hw + px, abs(v - 0.3))))*s2.y*1.6*cut*inB;
        } else {                       // the cornice: blocks of the four colours between white bars; the same border closes the wall's end
          // (the end's border is the cornice's cut at EB of its size: q, qw and qx are a metre, a line and a pixel in its own measure)
          float eb = step(p.y, 96.), q = mix(1., EB, eb), al = mix(p.x, p.y, eb)/q, qx = px/q, qw = lw/q;
          float v = mix(p.y - 98., p.x - (66. - 1.9*EB), eb)/q, f = (fract(al/3.2) - 0.5)*3.2, k = mod(floor(al/3.2), 4.), small = smoothstep(0.5, 1.6, qx);
          float inB = step(abs(f), 1.25)*step(abs(v), 1.25)*(1. - small);
          vec3 pg = k < 0.5 ? uPig[1] : k < 1.5 ? uPig[3] : k < 2.5 ? uPig[2] : uPig[4];
          vec3 bandC = mix(mix(uPig[6], pg, inB), mix(uPig[6], (uPig[1] + uPig[3] + uPig[2] + uPig[4])*0.25, 0.5), small);
          col = mix(col, bandC, step(abs(v), 1.9)*paintAt(p*0.5 + 9., st, px)); gChipE *= step(abs(v), 1.9); gChipS *= step(abs(v), 1.9);
          float bl = max(1. - smoothstep(qw, qw + qx, abs(abs(v) - 1.9)), inB > 0.5 ? 1. - smoothstep(qw, qw + qx, min(1.25 - abs(f), 1.25 - abs(v))) : 0.);
          col = mix(col, mix(uPig[5], uLineC, smoothstep(3.6, 4.4, st)), bl*lk*ink);
          vec2 dd = vec2(1.25) - abs(vec2(f, v)), bb = (1. - smoothstep(0.22/q, 0.22/q + qx, dd))*inB;
          e = clamp((-sign(mix(f, v, eb))*s2.x*mix(bb.x, bb.y, eb) - sign(mix(v, f, eb))*s2.y*mix(bb.y, bb.x, eb))*2.2, -1., 1.)*cut;
        }
        col = mix(col, uPig[3], gridAt(p, px, st - 1.)*0.6*(1. - smoothstep(3.6, 4.6, st)));
        gl_FragColor = vec4(edgeTone(col, e), 1.);
      }`;{const o=[],s=[],d=[],l=(m,x)=>{const M=o.length/3;for(const F of m)o.push(...F),s.push(...x);d.push(M,M+1,M+2,M,M+2,M+3)};l([[$,0,0],[z,0,0],[z,ze,0],[$,ze,0]],[0,0,1]),l([[z,0,0],[z,0,-46],[z,ze,-46],[z,ze,0]],[1,0,0]),l([[$,32.38,.62],[z,32.38,.62],[z,33.65,.62],[$,33.65,.62]],[0,0,1]),l([[$,33.65,.62],[z,33.65,.62],[z,33.65,0],[$,33.65,0]],[0,1,0]),l([[z,32.38,.62],[z,32.38,0],[z,33.65,0],[z,33.65,.62]],[1,0,0]);const c=new a.BufferGeometry;c.setAttribute("position",new a.Float32BufferAttribute(o,3)),c.setAttribute("normal",new a.Float32BufferAttribute(s,3)),c.setIndex(d);const f=new a.Mesh(c,Ge(ae,{},Nt));f.frustumCulled=!1,A.add(f)}const J=N(46e3),ce=N(42e3),Ne=z-$-8,Dt=($+z)/2,at=e.fork("cliff"),Ut=new Map([[r.ox,2.42],[r.cow,2.42],[r.donkey,2.42],[r.ibex,2.42],[r.boat,.9],[r.man,.05],[y.birds[0],1.25],[y.birds[1],1.1],[y.duck,.45],[y.fish[0],2],[y.fish[1],2]]),W=(o,s,d,l,c,f,m,x={})=>{const M=Math.max(2,Math.round(Ne/l));for(let F=0;F<M;F++){const k=s[F%s.length],S=d*8+.45+(Ut.get(k)??m)*f;x.stand?Y(o,k,[$+(F+.5)*Ne/M,S,.22],0,[0,0,.25],{s:f,ph:at(),mir:at()<.5,only:x.only}):Y(o,k,[Dt,S,.24],0,[7,Ne,c],{s:f,ph:(F+(x.off??0))/M,mir:c<0,only:x.only})}};W(J,[r.boat],0,21,-.8,.74,.9),await n.yield(),W(ce,[y.birds[0]],1,8.2,1,1.35,1.6,{only:[0]}),W(J,[r.donkey],2,10.5,1.1,.98,2.42),await n.yield(),W(ce,[y.trees[0],y.pom,y.trees[1]],3,7.6,0,.31,0,{stand:!0}),await n.yield(),W(J,[r.ox,r.cow],4,9.4,1.25,1,2.42),await n.yield(),W(ce,[y.duck,y.fish[0],y.duck,y.fish[1]],5,8.6,-.7,1.3,1.6,{only:[0]}),await n.yield(),W(J,[r.cow,r.ox],6,9.4,-1.2,1,2.42),await n.yield(),W(ce,[y.trees[1],y.trees[2]],7,7.6,0,.31,0,{stand:!0}),await n.yield(),W(J,[r.boat],8,17,.9,.74,.9),await n.yield(),W(J,[r.man,r.man,r.donkey],9,5.4,1,1,.1,{off:.2}),await n.yield(),W(J,[r.ibex,r.man,r.ibex],10,8.2,-1.3,.95,.1),await n.yield(),W(ce,[y.birds[1],y.birds[0]],11,7.4,-1.1,1.3,1.6,{only:[0]}),await n.yield(),A.add(J.mesh(I(re(ae)))),await n.yield(),A.add(ce.mesh(I(ae))),await n.yield();const ue=le(),me=N(14e3),nt=N(4e4),_=e.fork("far"),de=(o,s,d,l,c,f={})=>Y(o,s,[Q[0]+(j-4)*Math.sin(d),l,Q[1]-(j-4)*Math.cos(d)],-d,[0,0,0],{s:c,ph:_(),still:!0,...f}),it=(o,s,d,l,c,f={})=>Y(o,s,[Q[0]+(j-4)*Math.sin(d),l,Q[1]-(j-4)*Math.cos(d)],-d,[0,0,0],{s:c,ph:0,still:!0,...f}),Fe=(_()<.5?1:-1)*_.range(.4,.56);de(me,r.villa,Fe,ke,4.6);const Ot=3.4*4.6,Ht=o=>{const s=Math.abs(o-Fe);return s>.078&&s<.33};for(const o of[-1,1])for(const s of[0,1])it(me,r.wall,Fe+o*(.078+.0625+s*.125),ke,4.6,{mir:o<0});for(let o=-17;o<=17;o++){const s=o*.125+_.range(-.015,.015);if(Math.abs(s-Fe)<.13)continue;const d=_.range(3.1,3.6),l=Ht(s);de(nt,y.trees[1],s,ke+(l?Ot:0),l?Math.min(d,3):d,{mir:_()<.5}),(o&7)===7&&await n.yield()}for(let o=-7;o<=7;o++){const s=o*.31+_.range(-.02,.02);de(me,r.hill,s,Te,_.range(2.2,2.6),{mir:_()<.5}),o<7&&de(me,r.ibex,s+.155,Te+2.42*5.6,5.6,{mir:_()<.5})}await n.yield();const Ce=N(3e4);for(let o=-8;o<=8;o++){const s=o*.25+.12+_.range(-.02,.02),d=_()<.5;(o&1)===0?de(Ce,r.boat,s,qe+.9*9,9,{mir:d,still:!1}):de(Ce,_()<.5?r.ox:r.cow,s,qe+2.42*11,11,{mir:d,still:!1}),it(Ce,o&1?r.ox:r.cow,o*.25-.005,et+2.42*10,10,{mir:!1,still:!1}),(o&3)===3&&await n.yield()}await n.yield(),p.add(Ce.mesh(I(re(ue)))),await n.yield(),p.add(me.mesh(I(re(ue)))),await n.yield(),p.add(nt.mesh(I(ue))),await n.yield();const st=re(le({uWeather:{value:0}})),De=N(4e3);Y(De,r.deck,[0,-2.5,0],0,[5,0,0]),Y(De,r.prow,[0,-2.62,-7.5],0,[0,0,0],{s:.52});const lt=De.mesh(I(st));lt.renderOrder=2;const Z=new a.Group;Z.add(lt),p.add(Z);const Ue=G.length*_t,Oe=G.length*Bt,rt={value:new a.Vector4(0,Ue,Oe,0)},Qt=`
      attribute vec2 aS; uniform vec4 uRib; uniform float uTime;
      varying vec3 vG, vN; varying vec2 vS; varying float vSink;
      void main(){
        float sink = smoothstep(uRib.y - 30., uRib.y - 4., aS.x)*(1. - smoothstep(uRib.z + 2., uRib.z + 16., aS.x));
        vec3 p = position; p.y -= 1.3*sink; p.y += 0.07*sin(aS.x*0.7 - uTime*2.4)*(1. - sink);
        vG = p; vN = normal; vS = aS; vSink = sink; gl_Position = projectionMatrix*modelViewMatrix*vec4(p, 1.);
      }`,Yt=`
      ${we}
      ${Ke}
      uniform vec4 uRib;
      varying vec3 vG, vN; varying vec2 vS; varying float vSink;
      void main(){
        vec2 p = vS*2.; vec2 fw = fwidth(vS); float px = max(max(fw.x, fw.y)*1.5, 1e-4);
        float ahead = vS.x - uRib.x, rag = vnoise(vec2(vS.y*1.7, vS.x*0.35 + uTime*0.2)) + 0.3*vnoise(vec2(vS.y*5.3, vS.x*1.4 + 3.));
        // the paint front on the ribbon: a hard ragged brush edge (one pixel of the stage value), then crisp soot
        // zigzags on clean stone, then only the two border lines out to the tip
        float sF = 17. + 4.*rag - ahead, wF = max(0.7*fwidth(sF), 1e-3), rubN = vnoise(vS.yx*vec2(1.1, 0.8));
        if (ahead > 29. + 3.*rag) discard;
        float rub = (ahead + 15.)/9.;                               // behind the stern the paint is rubbed away
        if (rubN > rub || ahead < -15.) discard;
        float sunk = step(0.002, vSink);
        float pnt0 = max(smoothstep(-wF, wF, sF), sunk), ink = max(smoothstep(-wF, wF, sF + 7.5), sunk), cut = max(smoothstep(-wF, wF, sF + 2.5), sunk);
        vec3 stone = stoneAt(vS.yx, px*0.5), col; float e;
        if (vN.y < 0.5) { col = stone; e = clamp(dot(vN, uSunL)*1.7, -1., 1.); }
        else {
          float pnt = pnt0;
          vec2 s2 = vec2(0.3, 0.95); float zc; gZig = 1.3*(1. - pnt); vec4 w = waterAt(p, px, s2, 0., zc);
          col = mix(mix(stone, uPig[5], ink*0.85*zc), w.rgb, pnt); e = w.a*cut;
          float lw = max(0.07, 0.8*px*0.5), bd = 2.5 - abs(vS.y);
          col = mix(col, uLineC, 1. - smoothstep(lw, lw + px*0.5, abs(bd - 0.22)));
          col = mix(col, stone, 1. - smoothstep(0.2 - px*0.5, 0.2, bd));
        }
        gl_FragColor = vec4(edgeTone(col, e), 1.);
      }`;{const o=[],s=[],d=[],l=[],c=new a.Vector3,f=new a.Vector3,m=new a.Vector3,x=.8,M=Math.ceil((X+60)/x);for(let S=0;S<=M;S++){const ie=-22+S*x;G.posAtDist(ie,c),G.tangentAtDist(ie,f),m.set(-f.z,0,f.x).normalize();{const L=Math.max(Math.hypot(f.x,f.z),.001);c.x+=2.78*f.x*f.y/L,c.y-=2.78*L,c.z+=2.78*f.z*f.y/L}for(const[L,ge,ee,zt]of[[-1,-.5,0,-1],[-1,0,0,-1],[-1,0,1,0],[1,0,1,0],[1,0,0,1],[1,-.5,0,1]])o.push(c.x+m.x*2.5*L,c.y+ge,c.z+m.z*2.5*L),s.push(m.x*zt,ee,m.z*zt),d.push(ie,2.5*L);if(S<M){const L=S*6,ge=L+6;for(const ee of[0,2,4])l.push(L+ee,L+ee+1,ge+ee,ge+ee,L+ee+1,ge+ee+1)}S%300===299&&await n.yield()}const F=new a.BufferGeometry;F.setAttribute("position",new a.Float32BufferAttribute(o,3)),F.setAttribute("normal",new a.Float32BufferAttribute(s,3)),F.setAttribute("aS",new a.Float32BufferAttribute(d,2)),F.setIndex(l);const k=new a.Mesh(F,Ge(ue,{uRib:rt},Yt,Qt));k.material.side=a.DoubleSide,k.frustumCulled=!1,p.add(k)}await n.yield();const ct=N(1500);Y(ct,r.shaduf,[-58.4,0,-6],Math.PI*.3,[0,0,0],{s:1.3,ph:.2}),g.garden.add(ct.mesh(I(re(C))));const ut=N(1500);g.place(ut,y.trees[2],[58.6,0,99],-Math.PI/2,[1,150,0],{s:.52,ph:.4,sock:!0,rock:[.02,.8]}),g.garden.add(ut.mesh(I(C)));const ve=new a.Group;ve.position.set(fe.hinge.b[0],-2.4,fe.hinge.b[2]),p.add(ve),ve.updateMatrixWorld(!0);const He=le({uRise:{value:new a.Vector4(-1,.5,0,280)}});{const o=n.core.makeRng(n.core.hashSeed("garden-in-plan-entry-trees:"+n.seed)),s=o.shuffle([0,1,2]),d=N(6e3),l=13.1;for(let c=0;c<6;c++){const f=c%2,m=c>>1;g.place(d,y.trees[s[(m+f)%3]],[-(13.5+f*24.5),0,l+m*l+f*6.5],-Math.PI/2,[1,150,0],{s:o.range(.93,1.02),mir:o.chance(.5),ph:o(),sock:!0,rock:[.02,o.range(.6,1)]})}ve.add(d.mesh(I(He)))}await n.yield();const dt={...C,uFront:{value:new a.Vector4(0,0,1,1e4)}},pt=N(1200);Y(pt,y.fish[0],[0,0,0],0,[0,0,0],{s:.9});const pe=pt.mesh(I(dt));pe.visible=!1,p.add(pe),await n.yield();const ft=[{z:30,dir:1,s0:he(57)*X}];await n.yield(),ft.push({z:-48,dir:-1,s0:he(-21)*X});const ht=re(le({uWeather:{value:0}})),Qe=N(3e3);Y(Qe,r.door,[0,0,0],0,[0,0,0],{still:!0}),Y(Qe,r.door,[0,0,0],0,[0,0,0],{still:!0,mir:!0});const Me=Qe.mesh(I(ht));{const o=new a.Vector3;G.tangentAt(1,o),Me.quaternion.setFromRotationMatrix(new a.Matrix4().lookAt(new a.Vector3,o,new a.Vector3(0,1,0))),Me.position.fromArray(fe.portalSeat.position).addScaledVector(o,-.4)}p.add(Me),ht.uSunL.value.copy(q).applyQuaternion(Me.quaternion.clone().invert()).normalize();const mt=Math.round(64*t*u),Kt=Math.round(300*t),Pe={uCtr:{value:new a.Vector3},uEye:{value:new a.Vector3},uChisel:{value:new a.Vector4(75,Ze,Be,0)},uCO:{value:A.position.clone()},uCX:{value:new a.Vector3(1,0,0).applyQuaternion(A.quaternion)},uCZ:{value:new a.Vector3(0,0,1).applyQuaternion(A.quaternion)}},Xt=`
      attribute vec4 aSeed; attribute float aPig;
      uniform vec3 uCtr, uEye, uCO, uCX, uCZ, uPig[7]; uniform vec4 uChisel; uniform float uTime, uPxAng;
      varying vec3 vCol, vN; varying vec2 vQ; varying float vE, vKind;
      void main(){
        vec3 c; float size = 0.42 + 0.5*aSeed.w, spin = uTime*(0.3 + 0.8*aSeed.w) + aSeed.x*40., pmin = 4.5, pmax = 11.;
        vE = position.z; vKind = aPig;
        if (aPig < 6.5) {
          vec3 box = vec3(84., 44., 84.);
          vec3 q = aSeed.xyz*box + vec3(uTime*(1.1 + 0.9*aSeed.w), -uTime*(0.45 + 0.8*aSeed.z), uTime*0.25);
          q.x += 1.6*sin(uTime*0.6 + aSeed.y*30.);
          c = uCtr + mod(q - uCtr + box*0.5, box) - box*0.5;
        } else {                                      // a chip struck from the face where the cut is being sunk
          float t = fract(uTime*(0.35 + 0.3*aSeed.w) + aSeed.x*7.), y = aSeed.y*94. + 1.;
          float x = uChisel.x - uChisel.y*y + (aSeed.z*1.1 - 0.05)*uChisel.z;
          c = uCO + uCX*(x + (aSeed.w - 0.5)*2.5*t) + vec3(0., y + 1.5*t - 7.*t*t, 0.) + uCZ*(0.4 + (2. + 5.*aSeed.z)*t);
          size = (0.1 + 0.17*aSeed.w)*(1. + t)*step(x, 65.)*step(-70., x); pmin = 2.2; pmax = 9.;
        }
        vec3 ax = normalize(vec3(aSeed.y - 0.5, 0.35, aSeed.z - 0.5) + 1e-3);
        float cs = cos(spin), sn = sin(spin);
        vec3 l = vec3(position.xy*size, 0.);
        // a flake is a tumbling chip the eye can read: its half-width is held between pmin and pmax pixels
        float dist = distance(c, uEye), pxs = size/max(uPxAng*dist, 1e-5); l *= clamp(pxs, pmin, pmax)/max(pxs, 1e-3)*smoothstep(7., 11., dist)*step(1e-4, size);
        vec3 r = l*cs + cross(ax, l)*sn + ax*dot(ax, l)*(1. - cs);
        vec3 n0 = vec3(0., 0., 1.); vN = n0*cs + cross(ax, n0)*sn + ax*dot(ax, n0)*(1. - cs);
        int i = int(min(aPig, 6.) + 0.5); vCol = uPig[i]; vQ = position.xy;
        gl_Position = projectionMatrix*viewMatrix*vec4(c + r, 1.);
      }`,$t=`
      ${we}
      varying vec3 vCol, vN; varying vec2 vQ; varying float vE, vKind;
      void main(){
        vec3 N = vN/max(length(vN), 1e-4); float f = dot(N, uSunL)*(gl_FrontFacing ? 1. : -1.);
        vec3 plaster = mix(uPig[0], uPig[6], 0.6), col = gl_FrontFacing ? vCol : plaster;
        float big = step(vKind, 6.5), rim = step(0.84, vE)*big, line = 0.;
        if (gl_FrontFacing && vKind < 1.5) {                      // a flake of the water still carries its zigzag
          float tz = abs(fract(vQ.x*1.2 + 0.25) - 0.5)*2. - 0.5;
          col = mix(col, uPig[5], 1. - smoothstep(0.075, 0.12, abs(vQ.y*0.9 - tz*0.42)));
        }
        if (gl_FrontFacing) col = mix(col, uLineC, line);
        col = mix(col, plaster, rim);
        gl_FragColor = vec4(edgeTone(col, clamp(f*1.3, -1., 1.)*mix(0.3, 1., max(rim, 1. - big))), 1.);
      }`;{const o=new a.InstancedBufferGeometry,s=mt+Kt,d=new Float32Array(s*4),l=new Float32Array(s),c=e.fork("flakes");o.setAttribute("position",new a.Float32BufferAttribute([0,0,0,-1,-.7,1,.8,-1,1,1,.5,1,.1,1,1,-.9,.6,1],3)),o.setIndex([0,1,2,0,2,3,0,3,4,0,4,5,0,5,1]);for(let m=0;m<s;m++){d[m*4]=c(),d[m*4+1]=c(),d[m*4+2]=c(),d[m*4+3]=c();const x=c();l[m]=m>=mt?7:x<.56?1:x<.72?2:x<.84?3:x<.93?4:6,m%800===799&&await n.yield()}o.setAttribute("aSeed",new a.InstancedBufferAttribute(d,4)),o.setAttribute("aPig",new a.InstancedBufferAttribute(l,1)),o.instanceCount=s;const f=new a.Mesh(o,new a.ShaderMaterial({uniforms:{...ue,...Pe},vertexShader:Xt,fragmentShader:$t,side:a.DoubleSide}));f.frustumCulled=!1,p.add(f)}await n.yield();const vt=44,gt=new a.Matrix4,Zt=new a.Vector3(0,1,0),Ae=new a.Vector3,R=new a.Vector3,ne=new a.Vector3,jt=new a.Quaternion,b=new a.Vector3,yt=new a.Quaternion,wt=new a.Vector3;ae.uSunL.value.copy(q).applyQuaternion(A.quaternion.clone().invert()).normalize();const bt=H.dot(K),Le=new a.Vector3;function xt(o,s,d,l=0){G.pointAt(l,Ae);const c=Gt(l),f=Math.max(0,l-Et)*vt;g.setTilt($e(Ae.z)),g.setFront(c),g.setFlight(f),g.update(o,s,d),C.uFrontW.value=13,C.uFront.value.y=-1.2,C.uFrontMin.value=U?2.5:2.5+2.2*(1-te(430,480,C.uEyeL.value.z+165)),C.uCamL.value.z+=70*te(236,270,Ae.z),U&&(C.uFrontW.value=45,C.uFront.value.set(0,1.1+3.4*te(.5,9,f),1,-c)),d.matrixWorld.decompose(R,yt,b),ne.set(0,0,-1).applyQuaternion(yt);const m=Ae.dot(H)-bt,x=Tt;ae.uFront.value.set(-1,-Ze,0,m+x),Se.uFront.value.set(-H.x,0,-H.z,m+x+bt),Se.uEyeL.value.copy(R),ue.uEyeL.value.copy(R),b.copy(R),A.worldToLocal(b),ae.uEyeL.value.copy(b),Pe.uEye.value.copy(R),Pe.uCtr.value.copy(R).addScaledVector(ne,40),Pe.uChisel.value.x=m+x,rt.value.x=l*X,Le.copy(R),ve.worldToLocal(Le),He.uCamL.value.copy(Le),He.uEyeL.value.copy(Le),n.through&&(R.copy(K),ne.copy(H)),G.posAtDist(l*X+8,b).sub(wt.copy(G.posAtDist(l*X,wt))).normalize(),b.x=b.x*.6+ne.x*.4,b.z=b.z*.6+ne.z*.4;{const k=Math.max(Math.hypot(b.x,b.z),.001),S=Math.atan2(b.y,k),ie=Math.asin(Ve(ne.y,-1,1));b.y=Math.tan(Ve(Math.max(S,ie-.14),-1.2,1.2))*k}gt.lookAt(R,ne.copy(R).add(b),Zt),Z.position.copy(R),Z.quaternion.setFromRotationMatrix(gt),Z.rotateZ(.018*Math.sin(s*1.1)),Z.translateY(.05*Math.sin(s*1.7)),b.set(0,0,-7.7).applyQuaternion(Z.quaternion).add(Z.position),g.garden.worldToLocal(b),C.uWake.value.set(b.x,b.z,te(Ue-4,Ue+10,l*X)*(1-te(Oe-2,Oe+10,l*X)),0),st.uSunL.value.copy(q).applyQuaternion(jt.copy(Z.quaternion).invert()).normalize();const M=l*X;let F=!1;for(const k of ft){const S=(M-k.s0)/17;if(S<=0||S>=1)continue;F=!0;const ie=6.8*Math.PI*Math.cos(Math.PI*S),L=Math.atan2(ie,19);pe.position.set(k.dir*ye(-9.5,9.5,S),-1.9+6.8*Math.sin(Math.PI*S),k.z),pe.scale.x=k.dir,pe.rotation.z=k.dir*L,dt.uFront.value.set(0,0,1,k.z-c)}pe.visible=F}xt(0,0,{matrixWorld:new a.Matrix4().makeTranslation(K.x,K.y,K.z),projectionMatrix:new a.Matrix4},0);const Ye=fe.portalSeat.position,Jt=new a.Vector3,kt=new a.Vector3,St=(o,s,d)=>{G.pointAt(o,kt);const l=$e(kt.z),c=d-210;return Jt.set(0,s*Math.cos(l)-c*Math.sin(l),210+c*Math.cos(l)+s*Math.sin(l))},e0=[{at:(o,s)=>{const d=te(.24,.31,s);return St(s,ye(0,40,d),ye(60,-162,d))},from:.1,to:.46,weight:.52,fade:.2},{at:(o,s)=>St(s,30,-165),from:.36,to:.86,weight:.3,fade:.12},{at:[-58,10,-6],from:.6,to:.72,weight:.45,fade:.35},{at:[Ye[0]+5,Ye[1],Ye[2]],from:.86,to:.97,weight:.3}];return{scene:p,path:G,duration:vt,pace:o=>ye(.62,1.08,te(.06,.3,o)),title:U?"The Garden Drawn from Above: the Unfinished Wall":void 0,camera:{fov:62,near:.3,far:2600,lookAhead:26,sway:.35,bank:.4},pois:e0,portal:{shape:"circle",radius:Mt.r,color:"#f3e2b0",glow:0,halo:!1,veil:O[4],tilt:!0,revealDistance:240},post:{flat:1,exposure:1,bloom:{strength:0},grade:{saturation:1,contrast:1,tint:"#ffffff",shadowTint:"#000000",vignette:0,grain:0,aberration:0}},ride:"none",style:"none",companion:"none",update:xt,dispose(){g.dispose(),je.dispose(),Je.dispose()}}}};export{z0 as default};
