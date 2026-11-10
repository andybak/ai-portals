import*as o from"three";import{makePath as Qo}from"../kit/core.js";import{makeSky as Ho}from"../kit/sky.js";import*as Me from"../kit/fauna.js";import*as ro from"../kit/fx.js";import*as Gt from"../kit/interior.js";import{buildHero as Uo,makeGerLight as $o,gerMaterial as Xo,makeAtlas as Yo,makeGB as q,cbox as w,cyl as C,lathe as re,ATLAS as Q,GER as P,GER_GLSL as te,GER_PALETTE as Jo}from"../parts/raising-the-ger.js";const A=(a,i,d)=>{const m=Math.min(1,Math.max(0,(d-a)/(i-a)));return m*m*(3-2*m)},ie=(a,i,d)=>a+(i-a)*d,io=(a,i,d)=>Math.min(d,Math.max(i,a)),le=(a,i,d)=>"#"+new o.Color(a).lerp(new o.Color(i),d).getHexString(),X=(a,i)=>[Math.sin(a*Math.PI/180)*i,Math.cos(a*Math.PI/180)*i],Pt=a=>(a+180)*Math.PI/180,e0={autumn:{sky:"goldenHour",elev:24,az:248,sun:[3.5,2.5,1.2],skyC:[.42,.55,.95],gnd:[.42,.33,.18],warm:[.94,.72,.42],cool:[.3,.32,.47],fog:"#e6c78c",fogDen:42e-5,grassA:"#8a7236",grassB:"#66542a",grassC:"#b69a54",root:"#5e4a20",tip:"#dfb85c",dry:"#ecd490",dryAmt:.42,cloud:.5,cloudSpd:1,wind:1,beam:"#ffb650",beamGain:1.05,beamK:.92,beamElev:35,steam:1,exposure:1,tint:"#fff4e2",shadow:"#1a1830",portal:"#bcd8ff",hazeIn:"#7a6040",mtn:["#5a5486","#77665e","#ffe9c8","#bdb9d6",.62],flowers:.006,flowerColors:["#8a4c90","#c8682c","#e8d8a0","#a85a9a"],skyOpts:{zenith:"#3f6fc0",mid:"#9fb6d8",horizon:"#f1d39a",scatterColor:"#ffc66b",scatter:.8,clouds:{coverage:.33,softness:.2,absorb:1.5,lit:"#ffe0a8",shade:"#8f8cba",stretch:.55}}},summer:{sky:"day",elev:35,az:244,sun:[3.7,3.05,2.15],skyC:[.4,.6,1.05],gnd:[.3,.4,.18],warm:[.92,.78,.54],cool:[.31,.35,.46],fog:"#c4d6e6",fogDen:3e-4,grassA:"#526446",grassB:"#3e4e34",grassC:"#6c7a54",root:"#3c4c2e",tip:"#8c9c60",dry:"#bcb886",dryAmt:.3,flowers:.03,cloud:.6,cloudSpd:1.2,wind:.9,beam:"#ffca78",beamGain:.8,beamK:1.05,beamElev:41,feltT:.72,steam:.8,exposure:.98,tint:"#fff6e6",shadow:"#10203a",portal:"#ffe9b8",hazeIn:"#7c7460",mtn:["#4a6690","#4e6a48","#ffffff","#c9d9e8",.66],skyOpts:{zenith:"#1a56cc",mid:"#62a0ea",horizon:"#e4e8de",scatterColor:"#ffe2ac",scatter:.6,clouds:{coverage:.4,softness:.17,scale:.85,absorb:1.5,detail:.7,lit:"#fff2d6",shade:"#8c9cc6"}}},winter:{sky:"day",elev:20.5,az:247,sun:[3.3,2.9,2.4],skyC:[.55,.68,1],gnd:[.6,.66,.8],warm:[.84,.78,.7],cool:[.46,.56,.86],fog:"#b4c6e4",fogDen:5e-4,grassA:"#e4eaf4",grassB:"#c2d0ea",grassC:"#f4f6fa",root:"#8a7a50",tip:"#d8c890",dry:"#efe6c8",dryAmt:.6,flowers:0,cloud:.4,cloudSpd:.7,wind:.7,beam:"#ffd69a",beamGain:.95,beamK:.6,beamSigma:.04,beamElev:20.5,feltT:.8,steam:1.35,exposure:.9,tint:"#f2f6ff",shadow:"#14203c",portal:"#ffd9a0",hazeIn:"#7c8290",snow:!0,mtn:["#3f5a98","#8ea6d4","#eef2fc","#9fb6de",.2],mtnGain:.6,skyOpts:{zenith:"#2c5cb4",mid:"#7ea6dc",horizon:"#d2deee",scatterColor:"#ffdca8",scatter:.5,sunColor:"#fff0d0",clouds:{coverage:.34,softness:.24,lit:"#fff6e8",shade:"#8498c4"}}},spring:{sky:"day",elev:31,az:251,sun:[3.6,3.2,2.5],skyC:[.45,.62,1],gnd:[.36,.38,.2],warm:[.92,.8,.58],cool:[.33,.37,.47],fog:"#cfdce0",fogDen:4e-4,grassA:"#868644",grassB:"#647034",grassC:"#a6a66c",root:"#566228",tip:"#b4bc66",dry:"#d4cc90",dryAmt:.35,flowers:.015,cloud:.92,cloudSpd:5.5,wind:2.3,beam:"#ffd08a",beamGain:.95,beamK:1.25,beamElev:34,feltT:.78,steam:1,exposure:1,tint:"#fbfaf2",shadow:"#16223a",portal:"#ffe2c0",hazeIn:"#7c7660",mtn:["#526c90","#66783e","#ffffff","#d2dfe6",.46],skyOpts:{zenith:"#2f66c8",horizon:"#d8e6ee",clouds:{coverage:.62,softness:.22,absorb:2.2,wind:[.05,.018]}}},dawn:{sky:"dawn",elev:22,az:112,sun:[3.5,2.3,1.55],skyC:[.5,.52,.9],gnd:[.44,.3,.26],warm:[.96,.68,.52],cool:[.33,.3,.46],fog:"#eebfb0",fogDen:55e-5,grassA:"#8e7256",grassB:"#6c5644",grassC:"#b4947c",root:"#74583a",tip:"#d8a880",dry:"#f0c8b0",dryAmt:.5,flowers:.02,cloud:.5,cloudSpd:.8,wind:.8,beam:"#ffa070",beamGain:1.05,beamK:1.3,beamElev:35,steam:1.3,exposure:1,tint:"#fff0ee",shadow:"#201838",portal:"#cfe4ff",hazeIn:"#7c5c58",mtn:["#665a86","#7c6254","#ffd2c2","#f0c6b8",.56],skyOpts:{clouds:{coverage:.44,stretch:.6}}}},At=[{wood:"#e47326",woodLight:"#ee9848",woodDark:"#6e2a0e",blue:"#1e4fa0",green:"#3a7048",gold:"#d9a044",red:"#9c2c1a"},{wood:"#d45c24",woodLight:"#e6843e",woodDark:"#5c1c0c",blue:"#1e4fa0",green:"#3a6a50",gold:"#e2b254",red:"#8a2416"},{wood:"#2a807c",woodLight:"#48a096",woodDark:"#103c40",blue:"#d8601e",green:"#c8a040",gold:"#e0b860",red:"#9c2c1a"}];async function t0(a,i){const d=q(),m=10.4,h=5.4;d.add(w(m+.5,.9,h+.5,.14),{p:[0,.45,0],c:a.woodDark}),d.add(w(m,6.3,h,.16),{p:[0,4,0],c:a.wood,grad:[-3.2,3.2,.82,1.05]}),await i();for(const s of[-1,1])d.add(new o.PlaneGeometry(4.5,5.5),{p:[s*2.48,4,h/2+.03],c:"#ffffff",uv:Q.medallion}),d.add(w(.46,6.5,.46,.08),{p:[s*(m/2-.05),4,h/2-.05],c:a.blue}),d.add(new o.SphereGeometry(.42,8,6),{p:[s*(m/2-.05),7.5,h/2-.05],c:a.gold}),d.add(new o.TorusGeometry(.55,.1,6,12),{p:[s*(m/2+.12),4.6,0],r:[0,Math.PI/2,0],c:a.gold});d.add(w(.4,6.3,.3,.06),{p:[0,4,h/2+.05],c:a.gold}),await i();for(const s of[-1,1])d.add(new o.PlaneGeometry(4.6,5.2),{p:[s*2.5,4,-h/2-.03],r:[0,Math.PI,0],c:"#ffffff",uv:Q.lid,gain:.85});d.add(w(m+.3,.5,.2,.04),{p:[0,1.4,-h/2-.06],c:a.blue}),d.add(w(m+.3,.5,.2,.04),{p:[0,6.8,-h/2-.06],c:a.green}),await i(),d.add(w(m+.7,.75,h+.7,.15),{p:[0,7.6,0],c:le(a.wood,a.woodDark,.25)}),d.add(w(m+.74,.5,.2,.04),{p:[0,7.6,h/2+.36],c:"#ffffff",uv:[0,Q.band[1],2.5,Q.band[3]]});const v=new o.PlaneGeometry(m,h-.2);v.rotateX(-Math.PI/2),d.add(v,{p:[0,7.99,0],c:"#ffffff",uv:Q.lid}),d.add(w(.9,1.1,.16,.05),{p:[0,6.5,h/2+.2],c:a.gold}),d.add(new o.TorusGeometry(.3,.07,5,10),{p:[0,6.1,h/2+.3],c:"#8a6a30"});for(const s of[-1,1])for(const x of[-1,1])d.add(w(.9,.5,.9,.1),{p:[s*(m/2-.4),.05,x*(h/2-.4)],c:"#3a1808"});return await i(),d.build()}async function o0(a,i,d){const m=q(),h=7,v=18.5;m.add(w(h,1.6,v,.14),{p:[0,1.5,0],c:a.wood,grad:[-.8,.8,.8,1.05]});for(const y of[-1,1]){m.add(w(.2,1.1,v-1.2,.04),{p:[y*(h/2+.06),1.5,0],c:"#ffffff",uv:[0,Q.band[1],2,Q.band[3]]}),m.add(w(h+.5,y<0?4.6:3.4,.6,.14),{p:[0,y<0?2.9:2.3,y*(v/2+.1)],c:a.wood}),m.add(new o.PlaneGeometry(h-1,2.6),{p:[0,y<0?3.6:2.6,y*(v/2+.1)-y*.33],r:[0,y<0?0:Math.PI,0],c:"#ffffff",uv:Q.lid});for(const M of[-1,1])m.add(w(.8,y<0?5.2:4,.8,.1),{p:[M*(h/2+.1),y<0?2.6:2,y*(v/2+.1)],c:a.blue}),m.add(new o.SphereGeometry(.5,8,6),{p:[M*(h/2+.1),y<0?5.5:4.3,y*(v/2+.1)],c:a.gold});await d()}m.add(w(h-.4,1,v-.8,.3),{p:[0,2.8,0],c:"#e8dcc0",m:1});const s=new o.PlaneGeometry(h-.3,v-4.5,6,12),x=s.attributes.position;for(let y=0;y<x.count;y++)x.setZ(y,.16*Math.sin(x.getX(y)*1.7+x.getY(y)*.9)+.12*Math.sin(x.getY(y)*2.3));s.rotateX(-Math.PI/2),s.computeVertexNormals(),m.add(s,{p:[0,3.52,1.6],c:"#ffffff",uv:Q.quilt,gain:i}),m.add(w(h-.2,.5,v-4.4,.2),{p:[0,3.2,1.6],c:"#c8b08a",m:1});const z=C(.95,.95,h-1.2,12);z.rotateZ(Math.PI/2),m.add(z,{p:[0,4,-v/2+1.7],c:a.red,m:1}),m.add(w(h-2.4,.7,2.2,.25),{p:[0,3.7,-v/2+3.4],c:"#f0e6d0",m:1});for(const y of[-1,1])for(const M of[-1,1])m.add(w(.9,.8,.9,.1),{p:[y*(h/2-.3),.4,M*(v/2-.6)],c:"#3a1808"});return await d(),m.build()}function a0(a,i){const d={add:(s,x)=>a.add(s,{...x,m:1})},m="#54463c",h="#77665a",v=1.2;for(const s of[-1,1])for(const x of[-1,1])d.add(w(.5,1.2,.5,.08),{p:[s*1.9,.6,v+x*2.3],c:m});d.add(w(4.6,3.6,5.6,.22),{p:[0,2.9,v],c:m,grad:[-1.8,1.8,.8,1.1]}),d.add(w(5,.35,6,.1),{p:[0,4.85,v],c:h});for(const s of[1.6,4.2])d.add(w(4.72,.22,5.72,.05),{p:[0,s,v],c:h});d.add(w(2.2,1.7,.2,.06),{p:[0,2.7,v+2.86],c:h});for(let s=-2;s<=2;s++)d.add(new o.BoxGeometry(.2,1.1,.06),{p:[s*.38,2.7,v+2.99],c:[4.2,1.5,.35]});d.add(w(.5,.2,.3,.04),{p:[.9,3.4,v+3],c:i.gold}),d.add(re([[.01,5],[1.3,5.02],[2.3,5.5],[2.75,6.3],[2.9,6.36],[2.82,6.44],[2.2,5.7],[1.2,5.3],[.01,5.28]],28),{p:[0,0,v+.9],c:"#6a5a4a"});for(const s of[-1,1])d.add(new o.TorusGeometry(.42,.08,5,10),{p:[s*3.05,6.2,v+.9],r:[0,0,Math.PI/2],c:h});d.add(C(.72,.72,.5,12),{p:[0,5.2,-.5],c:h})}async function n0(a,i,d,m){a.add(Gt.tableGeometry({scale:10,width:.72,depth:.46,height:.3,legs:"square",color:i.woodLight}),{p:[0,0,10.5],keep:!0}),a.add(w(7.3,.3,.14,.04),{p:[0,2.72,10.5+2.36],c:"#ffffff",uv:[0,Q.band[1],1.5,Q.band[3]]});const v=(x,z,y,M)=>{a.add(re([[.01,0],[.32,0],[.36,.06],[.3,.1],[.62,.4],[.74,.7],[.76,.72],[.7,.72],[.58,.44],[.01,.2]],14),{p:[x,3,z],s:y,c:M,m:1}),a.add(C(.6,.6,.02,12),{p:[x,3+.56*y,z],s:[y,1,y],c:"#d9b98a",m:1}),a.add(C(.755,.755,.1,14,!0),{p:[x,3+.62*y,z],s:[y,y,y],c:i.blue,m:1})};await m(),v(-2.2,10.5+.9,1,"#f0e8d8"),v(1.4,10.5+1.2,1,"#f0e8d8"),v(2.6,10.5-1,.9,"#e8d8c0"),v(-.6,10.5-1.2,1.25,i.gold),a.add(C(1.25,1,.18,16),{p:[-2.4,3.09,10.5-.8],c:"#e8dcc8",m:1});for(let x=0;x<9;x++){const z=x*2.4,y=.5*(1-x/12);a.add(w(.9,.26,.42,.1),{p:[-2.4+Math.cos(z)*y*.5,3.3+Math.floor(x/3)*.26,10.5-.8+Math.sin(z)*y*.5],r:[0,z,0],c:le("#d8a850","#b87830",d()),m:1})}await m();const s=(x,z,y)=>{a.add(Gt.chairGeometry({scale:6.4,style:"stool",color:i.woodLight,seatColor:i.red}),{p:[x,0,z],r:[0,y,0],keep:!0})};return s(-6.2,10.5+.4,.3),s(6.3,10.5-.3,-.4),s(7.5,10.5+8.5,.9),{stool:[7.5,10.5+8.5]}}function s0(a,i,d){const m=q(),[h,v]=X(d,27.2);m.add(w(6.4,.8,3.6,.12),{p:[0,.4,0],c:i.woodDark}),m.add(w(6,9.2,3.2,.16),{p:[0,5.4,0],c:i.wood,grad:[-4.6,4.6,.82,1.05]});for(const s of[-1,1])for(let x=0;x<2;x++)m.add(new o.PlaneGeometry(2.6,4),{p:[s*1.42,3.2+x*4.4,1.63],c:"#ffffff",uv:x?Q.door:Q.medallion});for(const s of[-1,1])for(let x=0;x<2;x++)m.add(new o.SphereGeometry(.16,6,5),{p:[s*.25,3.2+x*4.4,1.75],c:i.gold});m.add(w(6.6,.6,3.8,.14),{p:[0,10.3,0],c:i.blue}),m.add(w(6.9,.3,4,.08),{p:[0,10.75,0],c:i.gold});for(let s=-1;s<=1;s++)m.add(re([[.01,0],[.5,0],[.9,.5],[1,1],[.8,1.5],[.45,1.7],[.55,1.9],[.01,1.9]],12),{p:[s*2,10.9,0],s:.9-Math.abs(s)*.15,c:s?"#8a5a3a":i.gold,m:1});a.add(m.build(),{p:[h,0,v],r:[0,Pt(d),0],keep:!0})}function r0(a,i,d,m){const[h,v]=X(d,25.2);for(let s=0;s<4;s++){const x=h+(s-1.5)*2.5*Math.cos(d*Math.PI/180),z=v-(s-1.5)*2.5*Math.sin(d*Math.PI/180)+s%2*1.2,y=m.range(.85,1.2);a.add(re([[.01,0],[.82,0],[1,2],[1.04,2.05],[.94,2.05],[.78,.2],[.01,.2]],14),{p:[x,0,z],s:y,c:s%2?"#b08850":"#c8a060",grad:[0,2,.8,1.1]});for(const j of[.5,1.6])a.add(C(.99,.95,.14,14,!0),{p:[x,j*y,z],s:[y*(.88+j*.07),y,y*(.88+j*.07)],c:"#4a4038",m:1});a.add(C(.92,.92,.03,12),{p:[x,1.7*y,z],s:[y,1,y],c:s===1?"#f4efe4":"#e6dcc8",m:1});const M=new o.TorusGeometry(.98,.05,4,14,Math.PI);a.add(M,{p:[x,2*y,z],r:[0,m.range(0,3),0],s:y,c:"#4a4038",m:1})}}function i0(a,i,d,m){for(const v of[-1,1]){for(const s of[-1,1])a.add(w(.36,7.4,.36,.06),{p:[d+s*1.5,3.5,m+v*2.6],r:[0,0,s*.4],c:i.wood});a.add(w(2.4,.3,.3,.05),{p:[d,2.2,m+v*2.6],c:i.blue})}const h=C(.22,.22,6.4,8);h.rotateX(Math.PI/2),a.add(h,{p:[d,6.75,m],c:i.woodDark})}function l0(a){const i=q(),d={add:(h,v)=>i.add(h,{...v,m:1}),build:()=>i.build()},m=new o.SphereGeometry(1,14,10);d.add(m,{p:[0,-3.2,0],s:[1.25,1.9,1.7],c:"#6a4428",grad:[-1,1,.75,1.1]}),d.add(C(.5,.75,.9,10),{p:[0,-1.3,0],c:"#7a5232"}),d.add(C(.56,.56,.16,10),{p:[0,-1,0],c:"#3a2a20"}),d.add(C(.09,.09,3.6,6),{p:[0,.2,0],c:"#c8a878"});for(const h of[-1,1])d.add(C(.06,.06,1.9,5),{p:[0,-.95,h*.9],r:[h*.45,0,0],c:"#2a2018"}),d.add(new o.SphereGeometry(.2,6,5),{p:[0,-4.9,h*.8],c:"#4a3020"});return d.build()}async function c0(a,i,d,m){const h=q();for(const y of[-1,1])for(const M of[-1,1])h.add(w(.4,5.6,.4,.06),{p:[y*3.6,2.6,M*1.1],r:[M*.38,0,0],c:i.woodDark});const v=C(.45,.45,9,10);v.rotateZ(Math.PI/2),h.add(v,{p:[0,5,0],c:i.woodDark,grad:[-.45,.45,.8,1.2]});for(const y of[-1,1]){const M=y*2,j=y<0?"#5a2f18":"#7a4a26",r=y<0?"#27304a":"#3a2230",Qe=y<0?"#8a2a1c":"#9a7a3c",B=h,H={add:(N,fe)=>B.add(N,{...fe,m:1})};H.add(w(3,.25,4.6,.1),{p:[M,5.5,0],c:r});for(const N of[-1,1])H.add(w(3,2.6,.2,.08),{p:[M,4.3,N*2.3],r:[N*-.2,0,0],c:r,grad:[-1.3,1.3,.75,1.1]}),H.add(w(3.04,.3,.24,.04),{p:[M,3.2,N*2.56],r:[N*-.2,0,0],c:Qe}),H.add(w(3.04,.12,.24,.03),{p:[M,3.75,N*2.45],r:[N*-.2,0,0],c:"#b9b4a6"});const He=C(1,1,2.4,12,!1);He.rotateZ(Math.PI/2),H.add(He,{p:[M,5.9,0],s:[1,.55,1.5],c:j,grad:[-1,1,.7,1.15]});for(const N of[-1,1]){H.add(w(.4,2,2.6,.16),{p:[M+N*1.25,6.7,0],r:[0,0,N*-.25],c:j}),H.add(w(.2,.5,2.7,.06),{p:[M+N*1.52,7.6,0],r:[0,0,N*-.25],c:"#b9b4a6"});for(let fe=-2;fe<=2;fe++)H.add(new o.SphereGeometry(.13,6,4),{p:[M+N*1.42,6.9,fe*.5],c:"#d8d4c8"})}for(let N=0;N<5;N++)H.add(new o.SphereGeometry(.14,6,4),{p:[M+(N-2)*.42,6.42,1.36],c:"#e8e4d8"});for(const N of[-1,1])H.add(w(.16,2.6,.08,.02),{p:[M,3.6,N*2.75],c:"#3a2a20"}),H.add(new o.TorusGeometry(.5,.09,5,12),{p:[M,1.9,N*2.75],r:[0,Math.PI/2,0],c:"#b8b0a0"});await m()}const[s,x]=X(d,25.3),z=await h.buildAsync(m);await m(),a.add(z,{p:[s,0,x],r:[0,Pt(d)+Math.PI/2,0],keep:!0})}function d0(a){const i=q(),d=w(2.6,3.2,.9,.12),m=d.attributes.position;for(let v=0;v<m.count;v++)m.getY(v)>0&&m.setX(v,m.getX(v)*.72);d.computeVertexNormals(),i.add(d,{p:[0,-8,0],c:"#b9773a",grad:[-1.6,1.6,.8,1.1]}),i.add(w(2.75,.3,1,.05),{p:[0,-9.55,0],c:a.woodDark}),i.add(w(1.95,.26,1,.05),{p:[0,-6.45,0],c:a.woodDark}),i.add(new o.PlaneGeometry(1.5,2.2),{p:[0,-8,.47],c:"#ffffff",uv:Q.lid}),i.add(w(.34,6.6,.3,.05),{p:[0,-3.4,0],c:a.woodDark}),i.add(w(.5,1.3,.5,.1),{p:[0,-.45,.25],r:[.5,0,0],c:a.wood}),i.add(w(.4,.9,.4,.1),{p:[0,-.2,.75],r:[1.5,0,0],c:a.wood});for(const v of[-1,1])i.add(new o.ConeGeometry(.1,.4,4),{p:[v*.14,.42,.25],c:a.wood}),i.add(C(.07,.07,1,5),{p:[v*.45,-1.3,0],r:[0,0,Math.PI/2],c:"#2a160c"}),i.add(w(.06,7.6,.05,.01),{p:[v*.09,-5,.2],c:"#efe6d0"});i.add(w(.8,.14,.3,.03),{p:[0,-8.6,.52],c:"#e8dcc0"});const h=w(.1,6.4,.1,.02);i.add(h,{p:[1.9,-5.6,.1],r:[0,0,.12],c:a.woodDark});for(let v=0;v<16;v++){const s=1.9+v%4*.35,x=(v*3%9-4)*.13,z=Math.PI+(v*5%7-3)*.1,y=le("#4f6e44","#8a9a6a",v%5/4),M=-3.4+Math.sin(x)*s*.5,j=-.9-Math.cos(x)*s*.5;i.add(new o.ConeGeometry(.11,s,4),{p:[M,j,.1+v*3%4*.1],r:[z,0,x],c:y,m:1});for(const r of[-1,1])i.add(new o.ConeGeometry(.07,.8,3),{p:[M+r*.22,j-.25,.1+v*3%4*.1],r:[z,0,x+r*.6],c:y,gain:.85,m:1})}return i.add(C(.1,.1,3.6,5),{p:[-1.7,-.3,0],r:[0,0,Math.PI/2-.2],c:"#c8a878"}),i.build()}function u0(a,i,d){const m={add:(h,v)=>a.add(h,{...v,m:1})};m.add(w(4.4,.7,3.4,.25),{p:[-25.4,4,3.2],r:[0,.2,0],c:i.blue}),m.add(w(4.5,.2,.5,.06),{p:[-25.4,4.42,3.9],r:[0,.2,0],c:i.gold}),m.add(w(3,.5,2.6,.2),{p:[-25.2,4.65,3],r:[0,-.3,0],c:le(i.blue,"#000000",.25)}),m.add(w(1.2,.36,2.8,.1),{p:[-25.2,5,3],r:[0,-.3,0],c:i.wood})}async function f0(a,i,d,m,h,v){const s=q();for(const M of[-1,1]){const j=new o.TorusGeometry(4.2,.34,6,24);s.add(j,{p:[0,4.5,M*4.6],c:"#8a6a48"});for(let r=0;r<8;r++)s.add(w(.3,8.2,.3,.05),{p:[0,4.5,M*4.6],r:[0,0,r*Math.PI/8],c:"#a07c54"});await v(),s.add(C(.7,.7,1,10),{p:[0,4.5,M*4.6],r:[Math.PI/2,0,0],c:"#5a4030"}),s.add(w(21,.5,.5,.08),{p:[-5.2,3.6,M*3],r:[0,0,.19],c:"#9a7850"}),s.add(w(13,1.2,.3,.06),{p:[.8,6.6,M*3.6],c:"#a58258"});for(let r=0;r<5;r++)s.add(w(.3,1.6,.3,.05),{p:[-4.8+r*2.8,6,M*3.6],c:"#8a6a48"});await v()}s.add(C(.4,.4,10.4,8),{p:[0,4.5,0],r:[Math.PI/2,0,0],c:"#5a4030"}),s.add(w(13.4,.5,7.4,.1),{p:[.8,5.3,0],c:"#b08a5c"}),s.add(w(.5,.5,7.4,.08),{p:[-14.4,1.1,0],c:"#8a6a48"}),await v();const x=await s.buildAsync(v);await v(),a.add(x,{p:[d[0]+4,0,d[2]+14],r:[0,.5,0],keep:!0}),await v(),a.add(re([[.01,0],[1.5,0],[2.3,2.6],[2.4,3],[2.2,3],[1.4,.3],[.01,.3]],14),{p:[13.5,0,37],c:"#9a7a4a",grad:[0,3,.7,1.1],m:1});for(let M=0;M<12;M++)a.add(new o.IcosahedronGeometry(.6,0),{p:[13.5+h.range(-1.3,1.3),2.5+h()*.9,37+h.range(-1.3,1.3)],s:[1.2,.6,1],r:[h()*3,h()*3,0],c:le("#4a3a2a","#6a5a40",h()),m:1});const z=q();z.add(re([[.01,0],[1.3,0],[1.3,.6],[.8,1],[.7,6],[.95,6.4],[.95,7.2],[.65,7.6],[.6,18.4],[.9,18.8],[.9,19.6],[.5,20.2],[.5,21.6],[.8,22],[.5,22.8],[.01,23]],12),{c:i.wood,grad:[0,23,.8,1.05]});for(const M of[6.8,19.2])z.add(C(.99,.99,.7,12,!0),{p:[0,M,0],c:i.blue});for(const M of[10.5,14.5])z.add(C(.7,.7,.5,12,!0),{p:[0,M,0],c:i.blue}),z.add(C(.72,.72,.14,12,!0),{p:[0,M+.4,0],c:i.gold,m:1}),z.add(C(.72,.72,.14,12,!0),{p:[0,M-.4,0],c:i.gold,m:1});for(let M=0;M<6;M++)z.add(w(.16,3,.1,.03),{p:[Math.sin(M*1.047)*.66,12.5,Math.cos(M*1.047)*.66],r:[0,M*1.047,0],c:i.woodDark});z.add(new o.TorusGeometry(.6,.1,5,12),{p:[0,9,.8],c:"#8a8478",m:1});const y=z.build();for(const M of m)await v(),a.add(y.clone(),{p:[M.x,0,M.z],s:[.88,P.POST_S,.88],keep:!0});y.dispose()}function v0(a){const i=q(),d={add:(v,s)=>i.add(v,{...s,m:1})};d.add(re([[30.4,0],[30.5,16.2],[31,16.7],[18,20.9],[6.5,24.6],[6.3,25.3],[.01,25.5]],44),{c:"#a9a192",grad:[0,25,.86,1.06]});for(const v of[5.4,10.8])d.add(C(30.62,30.58,.4,44,!0),{p:[0,v,0],c:"#3c3026"});d.add(C(31.1,31.1,.5,44,!0),{p:[0,16.5,0],c:"#4a3c2e"});const h=new o.TorusGeometry(6.5,.55,6,24);return h.rotateX(Math.PI/2),d.add(h,{p:[0,25,0],c:a.wood}),i.add(w(15.4,17,1.6,.2),{p:[0,8.5,30.2],c:a.wood}),i.add(w(17.4,1.2,2.2,.2),{p:[0,17.4,30.2],c:a.blue}),i.add(w(6.2,14,.3,.1),{p:[-3.6,8,31.1],c:a.blue,gain:.8}),i.add(w(6.2,14,.3,.1),{p:[3.6,8,31.1],c:a.blue,gain:.8}),d.add(C(.55,.55,7,8),{p:[0,27.5,-.5],c:"#3a3632"}),i.build()}const lo=`
uniform vec2 uPost[2]; uniform vec3 uGateC, uPortalC;
float postShade(vec3 P){
  vec2 h = normalize(uSunDir.xz + vec2(1e-5, 0.)); float tn = uSunDir.y / max(length(uSunDir.xz), .05), s = 0.;
  for (int i = 0; i < 2; i++) {
    vec2 rel = uPost[i] - P.xz; float al = dot(rel, h), pe = abs(rel.x * h.y - rel.y * h.x), soft = .3 + .035 * max(al, 0.);
    s = max(s, (1. - smoothstep(.8, .8 + soft, pe)) * smoothstep(-.5, .5, al) * (1. - smoothstep(15.2, 17.6, P.y + al * tn)));
  }
  return s;
}
// the way out: the track worn from the door to the hitching posts and the trodden ground round the gate (metres, x and z)
float wornTrack(vec2 p){
  float t = smoothstep(6.2, 2.4, abs(p.x - 1.2 * sin(p.y * .09))) * smoothstep(33., 42., p.y) * (1. - smoothstep(${(P.GATE_Z-5).toFixed(1)}, ${(P.GATE_Z+3).toFixed(1)}, p.y));
  return max(t, smoothstep(15., 7.5, length(p - vec2(0., ${(P.GATE_Z-2).toFixed(1)}))));
}
// the verges of the way out: full from the track's line out to 12 m and fading to 40 m either side; round the gate full
// out to 20 m from the trodden round's centre and fading to 45 m
float wayVerge(vec2 p){
  float t = smoothstep(40., 12., abs(p.x - 1.2 * sin(p.y * .09))) * smoothstep(33., 42., p.y) * (1. - smoothstep(${(P.GATE_Z+3).toFixed(1)}, ${(P.GATE_Z+30).toFixed(1)}, p.y));
  return max(t, smoothstep(45., 20., length(p - vec2(0., ${(P.GATE_Z-2).toFixed(1)}))));
}
vec3 gateGlow(vec3 P){
  vec2 d = (P.xz - uGateC.xz) * vec2(1., .82); float k = max(1. - length(d) / 21., 0.); k *= k;
  return uPortalC * vec3(1., .92, .78) * (k * k * .75 + k * .12) * (.86 + .14 * gNoise(P.xz * .3 + vec2(uTime * .6, -uTime * .4)));
}`,st=[[-182,286,1,.35],[-262,352,.82,-.2],[168,452,.9,.1]];var w0={id:"raising-the-ger",name:"The Raising of the Ger",category:"domestic",weirdness:.2,media:["interior","tiny"],async build(a){const{rng:i}=a,d=a.vary||{},m=a.quality?.detail??1,h=io(d.density??1,.7,1.3),v=!!d.rare,s=new o.Scene,x=i.fork("variety"),z=d.hour||"any",y=x(),M=Number.isFinite(a.seed)?Math.abs(Math.floor(a.seed))%7:Math.floor(y*7);let j=z==="golden"?"autumn":z==="dawn"||z==="night"?"dawn":z==="day"?["summer","spring","summer","spring","winter","summer","summer"][M]:["autumn","spring","dawn","spring","winter","autumn","summer"][M];v&&(j==="summer"||j==="spring")&&(j="autumn");const r=e0[j],Qe=x(),B={...Jo,...Qe<.5?At[0]:Qe<.78?At[1]:At[2]};r.snow&&(B.felt="#d9d5cd");const H=r.snow?x.pick(["#4a3a30","#52382a","#3a3230"]):x.pick(["#b08a50","#8a5a34","#9a948c","#c8a468"]),He=!r.snow&&x()<.3,N=x()<.35,fe=x()<.3,co=x.range(.85,1.05),Se=Ho({rng:i.fork("sky"),preset:r.sky,sunElevation:r.elev,sunAzimuth:r.az,sunGlow:.5,...r.skyOpts,sunIntensity:0,sunGlowTight:.12});await a.yield(),s.add(Se.object);const ve=Se.sunDirection.clone().normalize(),U=(()=>{const e=Math.max(r.beamElev??r.elev,r.elev)*Math.PI/180,t=Math.hypot(ve.x,ve.z)||1;return new o.Vector3(ve.x/t*Math.cos(e),Math.sin(e),ve.z/t*Math.cos(e))})(),m0="#"+new o.Color(r.sun[0]/3.6,r.sun[1]/3.6,r.sun[2]/3.6).getHexString(o.LinearSRGBColorSpace),ze=new o.Color(r.fog),uo=new o.Color(r.hazeIn);s.fog=new o.FogExp2(ze.clone(),r.fogDen),s.background=ze.clone();const Wt=new o.DirectionalLight(new o.Color(r.sun[0],r.sun[1],r.sun[2]).multiplyScalar(1/3.5),3.2);Wt.position.copy(ve).multiplyScalar(100);const fo=new o.HemisphereLight(new o.Color(r.skyC[0],r.skyC[1],r.skyC[2]),new o.Color(r.gnd[0],r.gnd[1],r.gnd[2]),1.25);s.add(Wt,fo);const W=$o();W.uSunCol.value.set(...r.sun),W.uSkyCol.value.set(...r.skyC),W.uGndCol.value.set(...r.gnd),W.uFeltWarm.value.set(...r.warm),W.uFeltCool.value.set(...r.cool),W.uFogCol.value.set(ze.r,ze.g,ze.b),W.uFogDen.value=r.fogDen,W.uCloudAmt.value=r.cloud,W.uCloudSpd.value=r.cloudSpd,W.uBeamK.value=r.beamK,W.uFeltT.value=r.feltT??1,await a.yield();const Ce=Qo([[0,15,-92],[0,15,-62],[-1.2,15,-46],[-4.7,15,-31],[-11.5,14.4,-21.5],[-18.5,12.2,-11],[-21.5,10.5,0],[-15.2,10.2,15.2],[0,10.2,21.5],[15.2,10.4,15.2],[21.5,10.8,0],[15.2,11.4,-15.2],[0,12,-21.5],[-15.2,12.4,-15.2],[-21.5,12.6,0],[-17,12.5,11],[-8.5,12.3,19.5],[2,12,21.5],[11,11,18.5],[17.5,10.2,10.5],[19.5,10.6,2],[17,11.2,-7],[10.5,11.2,-12.5],[2.5,10.8,-14],[-5,10,-13.5],[-13.5,9.2,-10.5],[-17.3,9.2,-1.5],[-13,9.2,7],[-3.5,9,15.5],[0,9,24],[.4,9,36],[5,9.6,52],[12.5,10.6,70],[13.5,10.2,88],[7.4,9.4,101],[2.3,9,109.5],[0,9,P.GATE_Z]]);await a.yield();const rt=50,Y=new o.Vector3,me=.87;let ce=.8,Dt=.15;for(let e=0;e<=400;e++)if(Ce.pointAt(e/400,Y),Math.hypot(Y.x,Y.z)<30.3){Dt=e/400;break}for(let e=200;e<=800;e++)if(Ce.pointAt(e/800,Y),Y.z>=P.DOOR_Z-.2&&Math.abs(Y.x)<4){ce=e/800;break}const Ue=e=>e<=ce?e*(me/ce):me+(e-ce)*(1-me)/(1-ce),K=e=>e<=me?e*(ce/me):ce+(e-me)*(1-ce)/(1-me),vo=Ue(Dt),mo=e=>1.4-.2*A(0,.2,e)-.6*A(.24,.32,e)+.3*A(.46,.53,e)+.45*A(.61,.67,e)-.75*A(.72,.78,e)+.4*A(.85,.9,e),ho=e=>mo(Ue(e));await a.yield();const it=Yo({...B,white:"#e6d8bc"});await a.yield();const $e=[52,2.2,-4];await a.yield();const J=await Uo(a,{light:W,atlas:it,palette:B,sunDir:ve,beamDir:U,uCross:vo,cart:$e,beamColor:r.beam,beamGain:r.beamGain,timeline:{roofArrive:[.385,.41],roof:[.41,.475],beam:[.425,.475],ropes:[.475,.515],door:[.665,.795]}});s.add(J.object);const po=J.timeline,he=J.anchors,Te=J.material,lt=J.materialDouble;J.parts.wall.uniforms.uWind.value=r.wind,J.parts.roof.uniforms.uWind.value=r.wind,J.parts.beam.uniforms.uSigma.value=r.beamSigma??.062,await a.yield();const D=e=>({value:new o.Color(e)}),ke=a.noise,Nt={...W,uGA:D(r.grassA),uGB:D(r.grassB),uGC:D(r.grassC),uHill:D(r.snow?"#9db4e2":"#3f62b4"),uWindK:{value:r.wind},uSnow:{value:r.snow?1:0},uGR:D(r.root),uPost:{value:[new o.Vector2(-P.POST_X,P.GATE_Z),new o.Vector2(P.POST_X,P.GATE_Z)]},uGateC:{value:new o.Vector3(0,9,P.GATE_Z)},uPortalC:D(r.portal)};{const e=[0,8,16,24,30,34,44,60,85,120,170,250,380,560,800,1100,1400,1650,1900,2150,2400,2700,3100],t=96,n=[],l=[];for(let u=0;u<e.length;u++)for(let f=0;f<=t;f++){f===0&&await a.yield();const g=f/t*6.2832,S=e[u],F=Math.sin(g)*S,I=Math.cos(g)*S,E=A(1250,2300,S)*(70+90*(.5+.5*ke.fbm2(Math.sin(g)*2.2+7,Math.cos(g)*2.2,3))+40*ke.n2(Math.sin(g)*7,Math.cos(g)*7))*(1-.5*A(2500,3100,S));n.push(F,E+2.5*A(60,400,S)*ke.n2(F*.004,I*.004),I)}for(let u=0;u<e.length-1;u++)for(let f=0;f<t;f++){const g=u*(t+1)+f,S=g+t+1;l.push(g,S,g+1,g+1,S,S+1)}await a.yield();const c=new o.BufferGeometry;c.setAttribute("position",new o.Float32BufferAttribute(n,3)),c.setIndex(l),c.computeVertexNormals();const p=new o.Mesh(c,new o.ShaderMaterial({uniforms:Nt,vertexShader:"varying vec3 vW, vN; varying float vD; void main(){ vW = position; vN = normal; vec4 mv = viewMatrix * vec4(position, 1.); vD = -mv.z; gl_Position = projectionMatrix * mv; }",fragmentShader:`
uniform vec3 uGA, uGB, uGC, uHill, uGR; uniform float uWindK, uSnow; varying vec3 vW, vN; varying float vD;
${te}
${lo}
void main(){
  float r = length(vW.xz), near = smoothstep(150., 25., vD), mid = smoothstep(420., 60., vD);
  float n1 = gFbm(vW.xz * .021), n2 = gFbm(vW.xz * .13 + 3.), n3 = gNoise(vW.xz * 1.9), n4 = gNoise(vW.xz * vec2(.7, 4.) + 9.);
  vec3 alb = mix(uGA, uGB, smoothstep(.25, .75, n1));
  alb = mix(alb, uGC, smoothstep(.55, .85, n2) * .5);
  // under the tufts: a thatch of bent blades lying with the wind, dark at the roots, a few pale stems catching the light
  vec2 wd = vec2(.93, .36), wp = vec2(-.36, .93);
  vec2 sp = vec2(dot(vW.xz, wd), dot(vW.xz, wp)) + (n2 - .5) * 3.;
  float s1 = gNoise(sp * vec2(1.6, 4.5)), s2 = gNoise(sp * vec2(3.1, 9.) + 17.), s3 = gNoise((sp.yx + sp * .35) * vec2(2.2, 6.) + 5.);
  float thatch = (s1 * .5 + s2 * .3 + s3 * .2);
  float clump = gNoise(vW.xz * .62 + 21.);
  float mott = gNoise(vW.xz * 1.1 + 2.) * .45 + gNoise(vW.xz * 3.3 + 8.) * .3 + thatch * .25;
  vec3 det = mix(uGR * .62, mix(uGR, alb, .5) * 1.12, smoothstep(.3, .7, mott));
  det = mix(det, uGC * .9, smoothstep(.8, .95, s2) * .3);
  det *= .8 + .3 * clump;
  alb = mix(alb * (.86 + .22 * n3), det, near * (1. - uSnow * .75));
  alb *= (.84 + .2 * n4 * mid) * mix(.62, .5, 1. - uSnow);
  // waves of wind running through the grass
  float wv = sin(dot(vW.xz, vec2(.045, .019)) - uTime * 1.1 * uWindK + n1 * 7.) * sin(dot(vW.xz, vec2(-.012, .03)) - uTime * .5 * uWindK);
  alb *= 1. + .12 * wv * smoothstep(31., 70., r) * (1. - uSnow * .7);
  // the trodden circle and the track out to the hitching posts
  float trod = max(max(smoothstep(37., 31., r), .12 * smoothstep(64., 54., r + 6. * (n2 - .5))), .3 * smoothstep(5.2, 1.6, abs(vW.x + 2.4 * (n2 - .5))) * step(0., vW.z) * smoothstep(52., 40., vW.z));
  float scuff = gNoise(vW.xz * .9 + 4.) * .5 + gNoise(vW.xz * 3.7) * .3 + n4 * .2;
  alb = mix(alb, mix(uGB * vec3(.7, .66, .56), uGA * vec3(.72, .78, .9), uSnow) * (.4 + .6 * scuff) * (.6 + .8 * thatch * near), trod);
  // the way out: grass worn down to pale earth and flattened straw by hooves and feet
  float wt = wornTrack(vW.xz + 1.6 * (n2 - .5));
  alb = mix(alb, mix(mix(uGC, uGR, .4) * 1.2, uGA * vec3(.74, .8, .92), uSnow) * (.5 + .5 * scuff) * (.7 + .5 * thatch), wt * .85);
  // the ring where the poles were laid out: grass trodden flat, pale straw lying every way
  float ring = smoothstep(33., 38., r) * smoothstep(64., 55., r + 6. * (n2 - .5)) * (1. - uSnow * .6);
  alb = mix(alb, mix(uGR * .5, uGC, smoothstep(.2, .8, s2 * .6 + s3 * .4)) * (.34 + .4 * thatch + .16 * scuff) * (.7 + .6 * clump), ring * .8);
  // far off the steppe lies in long bands: paler dry swells, darker hollows, then the blue of the hills
  float band = gFbm(vW.xz * vec2(.0011, .0034) + 4.);
  alb *= mix(1., .7 + .65 * band, smoothstep(120., 500., r));
  alb = mix(alb, uGC * .55, smoothstep(.6, .8, band) * smoothstep(200., 700., r) * .5 * (1. - uSnow));
  alb = mix(alb, uHill * (.42 + .3 * n1), smoothstep(700., 1900., r) * .75);
  vec3 c = gerLight(alb, normalize(vN), vW, 1.);
  c = mix(c, alb * uSkyCol * .7, .85 * postShade(vW)) + alb * gateGlow(vW);
  gl_FragColor = vec4(gerFog(c, min(vD, 600. + (vD - 600.) * .4)), 1.);
}`}));p.name="steppe",p.frustumCulled=!1,s.add(p)}await a.yield();{const[e,t,n,l,c]=r.mtn,p=[[2960,560,520,.16],[3420,520,1e3,.4],[3880,460,1560,.54]],u=360,f=7,g=[],S=[],F=[],I=[];let E=0;const $=[[[.25,.55,.6],[1.55,.5,.5],[-1.2,.6,.62],[2.8,.6,.5],[-2.5,.5,.45]],[[1.04,.36,.95],[-.36,.44,.6],[2.25,.4,.7],[-1.9,.42,.85],[-2.95,.35,.55]],[[.47,.31,1],[-.98,.38,.72],[1.9,.3,.6],[3,.4,.8],[-2.2,.3,.55]]],we=(R,_)=>{let O=R-_;return O>Math.PI&&(O-=6.2832),O<-Math.PI&&(O+=6.2832),O},G=(R,_)=>{let O=0;for(const[qe,be,se]of $[R]){const V=we(_,qe),ee=se*(Math.exp(-((V/be)**2))+.5*Math.exp(-(((V-1.05*be)/(.6*be))**2))+.34*Math.exp(-(((V+1.4*be)/(.75*be))**2)));O+=ee*ee*ee}return p[R][2]*(.16+.8*Math.cbrt(O))},L=(R,_)=>{const O=Math.sin(_),qe=Math.cos(_);return G(R,_)*(.8+.26*ke.fbm2(O*1.5+R*5.3,qe*1.5-R*2.9,3)+.1*ke.ridged2(O*6.5+R*7.1,qe*6.5-R*3.7,2))};for(let R=0;R<p.length;R++){const[_,O,qe,be]=p[R];for(let se=0;se<=u;se++){let V=se/u*6.2832;V>Math.PI&&(V-=6.2832);const ee=Math.sin(V),xe=Math.cos(V),to=L(R,V),zt=(G(R,V+.05)-G(R,V-.05))/(.1*_)*2.6,Ct=Math.hypot(1,zt,.75),jo=(-ee-xe*zt)/Ct,Zo=.75/Ct,Vo=(-xe+ee*zt)/Ct;for(let Ne=0;Ne<=f;Ne++){const kt=Ne<f?Ne/(f-1):1.12,oo=_-O*(1-kt),ao=ee*oo,no=xe*oo,qo=ke.ridged2(ao*.0026+R*3.3,no*.0026,2),so=Ne<f?to*Math.pow(kt,1.25)*(Ne===f-1?1:.8+.2*qo):to*.7;g.push(ao,so-6,no),S.push(be,kt,so/1560),F.push(jo,Zo,Vo)}(se&15)===0&&await a.yield()}for(let se=0;se<u;se++)for(let V=0;V<f;V++){const ee=E+se*(f+1)+V,xe=ee+f+1;I.push(ee,ee+1,xe,ee+1,xe+1,xe)}E+=(u+1)*(f+1)}const k=new o.BufferGeometry;k.setAttribute("position",new o.Float32BufferAttribute(g,3)),k.setAttribute("aM",new o.Float32BufferAttribute(S,3)),k.setAttribute("aN2",new o.Float32BufferAttribute(F,3)),k.setIndex(I),await a.yield(),k.computeVertexNormals();const ae=Math.max(r.sun[0],r.sun[1],r.sun[2]),ye=new o.Mesh(k,new o.ShaderMaterial({side:o.DoubleSide,uniforms:{...W,uRock:D(e),uLow:D(t),uSnowC:D(n),uHaze:D(l),uSnowLine:{value:c},uSunN:{value:new o.Vector3(r.sun[0]/ae,r.sun[1]/ae,r.sun[2]/ae).multiplyScalar(r.mtnGain??1)},uMtnK:{value:r.mtnGain??1}},vertexShader:"attribute vec3 aM, aN2; varying vec3 vW, vN, vM, vN2; void main(){ vW = position; vN = normal; vM = aM; vN2 = aN2; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.); }",fragmentShader:`
uniform vec3 uRock, uLow, uSnowC, uHaze, uSunN; uniform float uSnowLine, uMtnK; varying vec3 vW, vN, vM, vN2;
${te}
void main(){
  vec3 Ng = normalize(vN); if (Ng.y < 0.) Ng = -Ng;
  float a = atan(vW.x, vW.z + 1e-4);
  // broad strata and soft gullies on the slopes (never stripes); grass on the low slopes, rock above, snow on the heights
  float st = gFbm(vec2(a * 9., vW.y * .006)), gul = gFbm(vec2(a * 34., vW.y * .004 + 3.));
  vec3 N = normalize(normalize(vN2) * 1.6 + Ng * .4);
  // the sun is low: the faces turned to it are gold, the others stand in blue shade, the gullies fall to shade first
  vec3 sh = normalize(vec3(uSunDir.x, uSunDir.y * .6 + .12, uSunDir.z));
  float ndl = smoothstep(-.02, .5, dot(N, sh) + .16 * (gul - .5) + .1 * (st - .5));
  vec3 base = mix(uLow, uRock, smoothstep(.1, .34, vM.z + .08 * (st - .5))) * (.9 + .2 * st);
  float snow = smoothstep(uSnowLine - .04, uSnowLine + .12, vM.z + .1 * (st - .5) + .05 * (gFbm(vec2(a * 14., vW.y * .012 + 5.)) - .5));
  base = mix(base, uSnowC, snow);
  vec3 c = base * (uSkyCol * ((.5 + .16 * N.y) * mix(1., .8, gul) * mix(uMtnK, 1., .35)) + uSunN * vec3(1.06, .96, .8) * (ndl * 1.5));
  // haze lies deepest at the foot of each wall and each wall is paler than the one before it
  float hz = clamp(vM.x + .4 * (1. - smoothstep(0., .7, vM.y)) + .1 * (1. - smoothstep(0., .25, vM.z)), 0., .95);
  gl_FragColor = vec4(mix(c, uHaze, hz), 1.);
}`}));ye.name="far-ranges",ye.frustumCulled=!1,s.add(ye)}await a.yield();{const e=new o.RingGeometry(66,1500,72,10);e.rotateX(-Math.PI/2);const t=new o.Mesh(e,new o.ShaderMaterial({uniforms:{...W,uShCol:D(r.shadow)},transparent:!0,depthWrite:!1,vertexShader:"varying vec3 vW; varying float vD; void main(){ vW = vec3(position.x, 6.6, position.z); vec4 mv = viewMatrix * vec4(vW, 1.); vD = -mv.z; gl_Position = projectionMatrix * mv; }",fragmentShader:`
uniform vec3 uShCol; varying vec3 vW; varying float vD;
${te}
void main(){
  float r = length(vW.xz);
  vec2 q = vW.xz * .0046 + uTime * uCloudSpd * vec2(.034, .012) + vec2(.35, .1);
  float n = gFbm(q) * .72 + .28 * gNoise(q * 3.1 + 5.);
  float sh = smoothstep(.45, .55, n);
  float al = .7 * min(uCloudAmt * 1.5, 1.) * sh * smoothstep(66., 86., r) * (1. - smoothstep(950., 1500., r)) * mix(1., .55, smoothstep(350., 1000., r)) * smoothstep(9., 22., length(vW.xz - vec2(0., ${P.GATE_Z.toFixed(1)}))) * exp(-max(vD, 0.) * uFogDen * .5);
  gl_FragColor = vec4(uShCol * 1.5, al);
}`}));t.name="cloud-shadows",t.frustumCulled=!1,t.renderOrder=3,s.add(t)}await a.yield();const ct=[];for(let e=0;e<16;e++)ct.push(new o.Vector4(0,100,0,0));const dt={...W,uReveal:{value:4.5},uRoll:{value:.75},uOcc:{value:ct},uRA:D(r.snow?"#948c7c":"#a08a62"),uRB:D("#6a1f16"),uRC:D("#b27a20"),uRD:D(le(B.wood,"#7a5230",.45)),uRE:D("#b8a67e"),uRF:D(le(B.wood==="#2a807c"?"#7a2a1a":"#1d6a70","#20304a",.3))};{const n=[],l=[];for(let u=0;u<=50;u++)for(let f=0;f<=64;f++){const g=f/64*6.2832,S=.2+(30.38-.2)*u/50;n.push(Math.sin(g)*S,0,Math.cos(g)*S)}for(let u=0;u<50;u++)for(let f=0;f<64;f++){const g=u*65+f,S=g+64+1;l.push(g,S,g+1,g+1,S,S+1)}const c=new o.BufferGeometry;c.setAttribute("position",new o.Float32BufferAttribute(n,3)),c.setIndex(l);const p=new o.Mesh(c,new o.ShaderMaterial({uniforms:dt,side:o.DoubleSide,vertexShader:`
uniform float uReveal, uRoll; varying vec3 vW, vN, vP; varying float vD;
void main(){
  float r = length(position.xz); vec2 d = position.xz / max(r, .01);
  float over = max(r - uReveal, 0.), w = min(over / max(uRoll, .05), 9.42);
  float rr = uReveal + uRoll * sin(w) * step(1e-4, over), y = .14 + uRoll * (1. - cos(w)) * step(1e-4, over);
  rr = min(r, uReveal) + (rr - uReveal) * step(1e-4, over);
  vec3 P = vec3(d.x * rr, y, d.y * rr);
  vW = P; vP = position; vN = over > 0. ? normalize(vec3(d.x * sin(w), cos(w), d.y * sin(w))) : vec3(0., 1., 0.);
  vec4 mv = viewMatrix * vec4(P, 1.); vD = -mv.z; gl_Position = projectionMatrix * mv;
}`,fragmentShader:`
uniform vec3 uRA, uRB, uRC, uRD, uRE, uRF; uniform vec4 uOcc[16]; varying vec3 vW, vN, vP; varying float vD;
${te}
float occAt(vec2 p){
  float o = 1.;
  for (int i = 0; i < 16; i++) {
    vec4 q = uOcc[i]; float l = length(q.xy);
    vec2 d = l > 3. ? q.xy / l : vec2(0., 1.), rel = p - q.xy;
    vec2 e = max(vec2(abs(d.y * rel.x - d.x * rel.y), abs(dot(rel, d))) - q.zw, 0.);
    float k = 1. - smoothstep(0., 4.6, length(e));
    o *= 1. - .86 * k * k * step(.01, q.z);
  }
  return o;
}
void main(){
  vec2 p = vP.xz, cs = vec2(11., 7.2);
  float row = floor(p.y / cs.y); vec2 q = vec2(p.x + mod(row, 2.) * 5.5, p.y), id = floor(q / cs), f = fract(q / cs);
  vec2 dd = min(f, 1. - f) * cs; float e = min(dd.x, dd.y), hsh = gHash(id + 3.7);
  // felt rugs in four grounds: cream, ox-blood, deep turquoise and saffron
  float gk = hsh < .4 ? 0. : (hsh < .7 ? 1. : (hsh < .88 ? 2. : 3.));
  vec3 field = gk < .5 ? uRA : (gk < 1.5 ? uRB : (gk < 2.5 ? uRF : uRC));
  float felt = gFbm(p * .8), fib = gNoise(p * 9.), fine = gNoise(p * 27.);
  vec3 col = field * (.76 + .3 * felt + .12 * fib + .1 * fine);
  vec3 b1 = gk < .5 ? uRB : (gk < 1.5 ? uRC : (gk < 2.5 ? uRE : uRB)), b2 = gk < .5 ? uRF : (gk < 1.5 ? uRE : (gk < 2.5 ? uRC : uRF));
  vec2 s = (f - .5) * cs;
  // quilting: stitched diamonds over the field, a stitched lozenge and knot in the middle
  float qd = abs(fract((s.x + s.y) * .5) - .5), qe = abs(fract((s.x - s.y) * .5) - .5);
  float stitch = smoothstep(.07, .02, min(qd, qe)) * step(.5, fract((s.x + s.y * .3) * 4.));
  col = mix(col, b1 * .8, .5 * stitch * step(1.1, e));
  col *= .93 + .07 * smoothstep(0., .3, min(qd, qe));
  float m = abs(s.x) / 4.3 + abs(s.y) / 2.5;
  col = mix(col, b1, smoothstep(.06, .03, abs(m - .9)) * .6);
  col = mix(col, b2, smoothstep(.05, .02, abs(m - .76)) * .7);
  col = mix(col, b1, smoothstep(.36, .33, m) * .8); col = mix(col, uRE, smoothstep(.2, .17, m) * .8); col = mix(col, b2, smoothstep(.09, .07, m));
  // binding: a coloured edge, a pale line, a thin inner line
  col = mix(col, b1, smoothstep(.62, .56, e) * .7); col = mix(col, uRE, smoothstep(.34, .3, e) * (1. - smoothstep(.2, .16, e)) * .7); col = mix(col, b2, smoothstep(.95, .9, e) * (1. - smoothstep(.82, .77, e)) * .6);
  col *= .4 + .6 * smoothstep(.0, .14, e);
  // wear: trodden paths between the door, the stove and the beds are greyer and flatter
  float worn = smoothstep(.45, .75, gFbm(p * .09 + 2.)) * .35;
  col = mix(col, vec3(dot(col, vec3(.4, .4, .2))) * vec3(1.05, .98, .86), worn);
  vec3 N = normalize(vN); if (!gl_FrontFacing) { N = -N; col = uRA * (.5 + .25 * gNoise(p * 3.)); }
  // umber shade pooled under and beside the furniture (a little further on the side away from the bright wall),
  // round the hearth and along the foot of the wall
  vec2 hs = normalize(uSunDir.xz + vec2(1e-5, 0.));
  float clo = gerInside(vW) * (.45 * uWallC + .55 * uRoofC);
  float oc = occAt(vW.xz + hs * mix(.3, 1.5, clo));
  float rr = length(vW.xz);
  float ao = (1. - .5 * smoothstep(26.6, 30.2, rr) * mix(.4, 1., clo)) * (1. - .3 * (1. - smoothstep(3., 6.5, length(vW.xz - vec2(0., 1.2)))));
  vec3 shade = mix(vec3(1.), mix(vec3(.17, .16, .25), vec3(1.), oc), mix(.7, 1., clo));
  gl_FragColor = vec4(gerFog(gerLight(col * shade, N, vW, ao), vD), 1.);
}`}));p.name="rugs",p.frustumCulled=!1,s.add(p)}await a.yield();const go={...W,uShCol:D(r.shadow),uLen:{value:1/Math.tan(r.elev*Math.PI/180)}},oe=[],wo=()=>{const e=[],t=[],n=[];let l=0;for(const u of oe){for(const[f,g]of[[-1,0],[1,0],[-1,1],[1,1]])e.push(f,g,u[5]||0),t.push(u[0],u[1],u[2],u[3]);n.push(l,l+1,l+2,l+1,l+3,l+2),l+=4}const c=new o.BufferGeometry;c.setAttribute("position",new o.Float32BufferAttribute(e,3)),c.setAttribute("aS",new o.Float32BufferAttribute(t,4)),c.setIndex(n);const p=new o.Mesh(c,new o.ShaderMaterial({uniforms:go,transparent:!0,depthWrite:!1,side:o.DoubleSide,vertexShader:`
attribute vec4 aS; uniform vec3 uSunDir; uniform float uWallC, uRoofC, uLen; varying vec3 vQ; varying float vD, vLift;
void main(){
  vec2 c = aS.xy, dir = -normalize(uSunDir.xz + vec2(1e-5, 0.)), perp = vec2(-dir.y, dir.x);
  float ins = step(length(c), 29.) * (.5 * uWallC + .5 * uRoofC);
  float len = mix(aS.w * uLen, aS.z * .7, ins), back = aS.z * .9;
  vec2 xz = c + perp * position.x * aS.z * 1.25 + dir * mix(-back, len, position.y);
  vQ = vec3(position.x, position.y, (.5 * min(1., 14. / max(len, 1.)) + .12) * (1. - ins));
  vLift = position.z > 1. ? .85 : 1.; vec4 mv = viewMatrix * vec4(xz.x, .3 + position.z, xz.y, 1.); vD = -mv.z; gl_Position = projectionMatrix * mv;
}`,fragmentShader:`
uniform vec3 uShCol, uFogCol; uniform float uFogDen; varying vec3 vQ; varying float vD, vLift;
void main(){
  float a = (1. - vQ.x * vQ.x) * smoothstep(0., .12, vQ.y) * (1. - smoothstep(.45, 1., vQ.y));
  a *= a * (3. - 2. * a);
  gl_FragColor = vec4(uShCol, clamp(a * vQ.z * 1.9, 0., .62) * vLift * exp(-max(vD, 0.) * uFogDen));
}`}));p.name="shadows",p.frustumCulled=!1,p.renderOrder=2,s.add(p)},ne=i.fork("furniture"),Z=q(),Xe=[],ut=[124,150,210,236],yo=await t0(B,a.yield);for(let e=0;e<4;e++){const[t,n]=X(ut[e],26.3);await a.yield(),Z.add(yo,{p:[t,0,n],r:[0,Pt(ut[e]),0],keep:!0,gain:.94+.12*ne()}),oe.push([t,n,5.6,8,1])}await a.yield();for(let e=0;e<7;e++){const n=(e-3)*1.45,[l,c]=X(150,28.55-e%2*.55),p=150*Math.PI/180,u=l+Math.cos(p)*n,f=c-Math.sin(p)*n,g=.9+.25*ne();Z.add(re([[.01,0],[.5,0],[.55,.08],[.16,.3],[.12,.75],[.3,.9],[.62,1.25],[.66,1.5],[.56,1.5],[.3,1.2],[.01,1.15]],12),{p:[u,8,f],s:g,c:"#d8a848",grad:[0,1.5,.8,1.2],m:1}),Z.add(C(.5,.5,.04,10),{p:[u,8+1.42*g,f],s:[g,1,g],c:"#f0d890",m:1}),Xe.push([u,8+1.44*g,f,1.05*g]),W.uLamp.value[e].set(u,8+1.05*g,f,1),e%2&&await a.yield()}{const[e,t]=X(150,28.3);W.uLampC.value.set(e,9.4,t)}await a.yield();const Tt=await o0(B,co,a.yield);await a.yield(),Z.add(Tt,{p:[25.6,0,0],keep:!0}),await a.yield(),Z.add(Tt,{p:[-25.6,0,0],r:[0,Math.PI,0],keep:!0}),oe.push([25.6,0,9.5,4,1],[-25.6,0,9.5,4,1]),await a.yield(),a0(Z,B),oe.push([0,1.2,3.2,5,1]),await a.yield();const Ft=await n0(Z,B,ne,a.yield);oe.push([0,10.5,3.6,3,.8],[-6.2,10.9,1.5,2.8,.8],[6.3,10.2,1.5,2.8,.8],[7.5,19,2.6,2.8,.9]),await a.yield(),s0(Z,B,44);{const[e,t]=X(44,27.2);oe.push([e,t,3.2,11,1])}await a.yield(),r0(Z,B,27,ne);{const[e,t]=X(27,25.2);oe.push([e,t,3.6,2,.8])}const de=[-10.5,23.5];i0(Z,B,de[0],de[1]),oe.push([de[0],de[1],3,7,.9]),await a.yield(),await c0(Z,B,-58,a.yield);{const[e,t]=X(-58,25.3);oe.push([e,t,4.4,6.5,1])}await a.yield(),u0(Z,B,ne),await a.yield(),await f0(Z,B,$e,he.hitchPosts,ne,a.yield),oe.push([$e[0]+4,$e[2]+14,6.5,8,1],[13.5,37,2.4,3,.8],[-P.DOOR_W-.5,P.DOOR_Z+1.4,.9,17,1],[P.DOOR_W+.5,P.DOOR_Z+1.4,.9,17,1]),await a.yield();{const e=v0(B);for(const[t,n,l,c]of st)await a.yield(),Z.add(e.clone(),{p:[t,0,P.GATE_Z+n],r:[0,c,0],s:l,keep:!0}),oe.push([t,P.GATE_Z+n,27*l,22*l,1,3.3]);e.dispose()}await a.yield();const ft=new o.Mesh(await Z.buildAsync(a.yield),Te);ft.name="furniture",ft.frustumCulled=!1,s.add(ft),await a.yield();{const e=(n,l,c,p,u)=>ct[n].set(l,c,p,u);let t=0;for(const n of ut){const[l,c]=X(n,26.3);e(t++,l,c,5.5,3)}e(t++,25.6,0,9.5,3.7),e(t++,-25.6,0,9.5,3.7),e(t++,0,1.2,2.6,3.1),e(t++,0,10.5,3.8,2.5),e(t++,-6.2,10.9,1.4,1.4),e(t++,6.3,10.2,1.4,1.4),e(t++,7.5,19,1.9,1.9);{const[n,l]=X(44,27.2);e(t++,n,l,3.4,2)}{const[n,l]=X(27,25.2);e(t++,n,l,5.2,1.6)}e(t++,de[0],de[1],2.3,2.9);{const[n,l]=X(-58,25.3);e(t++,n,l,2.7,4.7)}}wo(),await a.yield();const bo=await(async()=>{const e=q(),t={add:(u,f)=>e.add(u,{...f,m:1}),build:()=>e.build()},n="#4e443c",l="#6c6258",c=new o.CylinderGeometry(.5,.5,23,16,46,!0),p=c.attributes.position;for(let u=0;u<p.count;u++){const f=p.getY(u),g=Math.atan2(p.getZ(u),p.getX(u)),S=1+.03*Math.sin(f*1.7+g*2)*Math.sin(f*.6)+.012*Math.sin(g*5+f*4);p.setX(u,p.getX(u)*S),p.setZ(u,p.getZ(u)*S)}c.computeVertexNormals(),t.add(c,{p:[0,16.5,0],c:n,grad:[-11.5,11.5,.74,1.12]}),t.add(C(.515,.515,2.6,16,!0),{p:[0,6.6,0],c:"#4a4c60"}),t.add(w(.1,23,.07,.02),{p:[0,16.5,.5],c:"#26221e"});for(let u=8.1,f=0;u<28;u+=3.3,f++){t.add(C(.57,.57,.62,16,!0),{p:[0,u,0],c:l});for(const g of[-1,1])t.add(new o.TorusGeometry(.575,.05,5,16),{p:[0,u+g*.31,0],r:[Math.PI/2,0,0],c:"#756c60"});for(let g=0;g<8;g++){const S=(g+f*.37)*Math.PI/4;t.add(new o.SphereGeometry(.06,5,4),{p:[Math.cos(S)*.58,u,Math.sin(S)*.58],c:"#8a8072"})}t.add(C(.508,.508,1.1,16,!0),{p:[0,u-.9,0],c:"#1f1c1a"}),f%2&&await a.yield()}return t.add(C(.06,.06,2,6),{p:[0,9.9,0],r:[0,0,Math.PI/2],c:l}),t.add(new o.SphereGeometry(.17,7,5),{p:[1.02,9.9,0],c:"#b08a48"}),t.add(new o.ConeGeometry(1,.8,16,1,!0),{p:[0,28.9,0],c:n}),t.add(C(.08,.08,.9,5),{p:[0,28.2,.4],c:n}),t.add(C(.08,.08,.9,5),{p:[0,28.2,-.4],c:n}),t.build()})(),xo=Xo(W,it,{grain:1,side:o.DoubleSide,gloss:1}),Fe=new o.Mesh(bo,xo);Fe.name="stove-pipe",Fe.frustumCulled=!1,Fe.position.set(0,-18.6,-.5),s.add(Fe);const Be=new o.Group;{const e=q();e.add(C(.09,.09,4.6,6),{p:[0,2,0],r:[0,0,0],c:"#b08850",m:1}),e.add(re([[.01,0],[.4,.05],[.62,.4],[.66,.6],[.58,.6],[.36,.2],[.01,.14]],10),{p:[0,-.5,0],c:"#c8a050",m:1});const t=new o.Mesh(e.build(),lt);t.rotation.z=.5,t.position.y=.2,Be.add(t),Be.position.set(.9,5.6,2.3),s.add(Be)}const pe=new o.Mesh(new o.SphereGeometry(1,16,8,0,6.2832,0,1.5708),Te);{const e=new Float32Array(pe.geometry.attributes.position.count*3),t=new o.Color("#e9d5ac");for(let n=0;n<e.length;n+=3)e[n]=t.r,e[n+1]=t.g,e[n+2]=t.b;pe.geometry.setAttribute("color",new o.BufferAttribute(e,3)),pe.geometry.attributes.uv.array.fill(.09),pe.position.set(0,5.62,2.1),pe.scale.set(2.2,.05,2.2),s.add(pe)}await a.yield();const vt=new o.Mesh(l0(B),Te);vt.position.set(de[0],6.75,de[1]),s.add(vt);const Ge=new o.Mesh(d0(B),lt);Ge.scale.setScalar(.95),Ge.frustumCulled=!1,s.add(Ge);const Mo=new o.Vector3(21.2,8.4,-15.2),So=new o.Vector3(0,15.4,-29.1),zo=new o.Quaternion().setFromEuler(new o.Euler(-Math.PI/2,0,0)).premultiply(new o.Quaternion().setFromAxisAngle(new o.Vector3(0,1,0),-2.55)),Bt=new o.Quaternion,Pe=new o.Group,Ie=new o.Group;{const e=q(),t={add:(f,g)=>e.add(f,{...g,m:1}),build:()=>e.build()},n=N?"#efe8d8":"#c89a5a",l=N?"#3a302a":"#8a5e30",c=new o.SphereGeometry(1,14,10);t.add(c,{p:[0,.95,0],s:[2.5,1,1.45],c:n,grad:[-1,1,.75,1.1]}),t.add(new o.SphereGeometry(1,10,8),{p:[2.3,.7,.5],s:[1.05,.72,.85],c:n});for(const f of[-1,1])t.add(new o.ConeGeometry(.34,.9,5),{p:[2.2,1.1,.5+f*.6],r:[f*1.9,0,.4],c:l});for(const f of[-1,1])t.add(new o.SphereGeometry(.42,7,5),{p:[1.5*f,.32,1.3],s:[1.5,.7,1],c:N?l:n});if(N)for(let f=0;f<16;f++)t.add(new o.IcosahedronGeometry(.55,0),{p:[ne.range(-2,1.9),1.3+ne()*.6,ne.range(-1,1)],c:le("#efe8d8","#d8ccb4",ne())});Pe.add(new o.Mesh(t.build(),Te));const p=q(),u=C(.12,.3,1.9,7);u.translate(0,.95,0),p.add(u,{c:l,m:1}),Ie.add(new o.Mesh(p.build(),Te)),Ie.position.set(-2.35,.75,0),Ie.rotation.z=1.25,Pe.add(Ie),Pe.position.set(Ft.stool[0],.14,Ft.stool[1]),Pe.rotation.y=2.2,s.add(Pe)}const It=Gt.makeFlames({flames:Xe,rng:i.fork("lamps"),gain:.5});s.add(It.object);const Rt=ro.makeGlows({rng:i.fork("glow"),positions:[[0,2.7,4.5],...Xe.map(e=>[e[0],e[1]+.5,e[2]])],sizes:[2.4,...Xe.map(()=>1)],color:"#ff9a48",size:3.4,intensity:.5,flicker:.7});s.add(Rt.object),await a.yield();const b=i.fork("particles"),Re=(e,t)=>{const n=new o.InstancedBufferGeometry;n.setAttribute("position",new o.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),n.setIndex([0,1,2,0,2,3]);const l=new Float32Array(e*4),c=new Float32Array(e*4);for(let p=0;p<e;p++)t(p,l,c);return n.setAttribute("aO",new o.InstancedBufferAttribute(l,4)),n.setAttribute("aK",new o.InstancedBufferAttribute(c,4)),n.instanceCount=e,n.boundingSphere=new o.Sphere(new o.Vector3(0,12,0),200),n},Oe=34,Ye=16,mt=Math.round(28*m),Co=8*st.length,Ot=Math.min(29.5/Math.hypot(U.x,U.z),23/U.y),ht={...W,uBoil:{value:0},uPipe:{value:0},uGain:{value:.58*r.steam},uCol:D("#f4efe6")},Je=new o.Mesh(Re(Oe+Ye+mt+Co,(e,t,n)=>{if(e>=Oe+Ye+mt){const[c,p,u]=st[(e-Oe-Ye-mt)%st.length];t[e*4]=c,t[e*4+1]=30*u,t[e*4+2]=P.GATE_Z+p,t[e*4+3]=b(),n[e*4]=b.range(.03,.045),n[e*4+1]=b.range(4.5,7)*u,n[e*4+2]=1,n[e*4+3]=b();return}if(e>=Oe+Ye){const c=b.range(2,Ot-1),p=b()*6.2832,u=4.4*Math.sqrt(b());t[e*4]=-U.x*c+Math.cos(p)*u,t[e*4+1]=24-U.y*c,t[e*4+2]=-U.z*c+Math.sin(p)*u,t[e*4+3]=b(),n[e*4]=b.range(.018,.034),n[e*4+1]=b.range(3.4,6.2),n[e*4+2]=2,n[e*4+3]=b();return}const l=e>=Oe;t[e*4]=l?0:b.range(-1.6,1.6),t[e*4+1]=l?29.3:6.4,t[e*4+2]=l?-.5:2.1+b.range(-1.6,1.6),t[e*4+3]=b(),n[e*4]=l?b.range(.05,.075):b.range(.085,.14),n[e*4+1]=l?b.range(3,5):b.range(2.2,3.8),n[e*4+2]=l?1:0,n[e*4+3]=b()}),new o.ShaderMaterial({uniforms:ht,transparent:!0,depthWrite:!1,blending:o.CustomBlending,blendSrc:o.OneFactor,blendDst:o.OneMinusSrcAlphaFactor,vertexShader:`
attribute vec4 aO, aK; uniform float uTime, uBoil, uPipe, uBeamOn; uniform vec3 uSunDir, uBeamDir; varying vec3 vW; varying vec3 vQ; varying float vD, vK;
float eyeInBeam(){ vec3 O = cameraPosition; vec2 q = O.xz + uBeamDir.xz * ((24.2 - O.y) / max(uBeamDir.y, .05)); return smoothstep(12.5, 6.8, length(q)) * step(O.y, 24.2); }
void main(){
  float life = fract(uTime * aK.x + aO.w), kind = aK.z, wisp = step(1.5, kind), far = step(3600., dot(aO.xz, aO.xz)); vec3 c = aO.xyz;
  vec2 dw = -normalize(uSunDir.xz + vec2(1e-5, 0.));
  vec3 rise = vec3(0., life * (kind < .5 ? 15.5 : 9. + 34. * far), 0.);
  rise.xz = (kind < .5 ? dw * (life * life * 8.5) : dw * (life * 46.)) + vec2(sin(life * 7. + aK.w * 40.), cos(life * 5.3 + aK.w * 23.)) * (.3 + 2.4 * life);
  vec3 curl = vec3(sin(life * 6.2832 + aK.w * 40.) * 1.5, (life - .5) * 4., cos(life * 4.4 + aK.w * 23.) * 1.5) - uBeamDir * ((life - .5) * 3.);
  c += mix(rise, curl, wisp);
  float sz = mix(aK.y * (kind < .5 ? mix(.6, 1.7, life) * (1. + uBoil * .25) : mix(.55, 2.3, life) * 2.2), aK.y * (1.5 + .9 * life), wisp);
  float al = mix(smoothstep(0., .1, life) * (1. - smoothstep(.45, 1., life)) * (kind < .5 ? .5 + .45 * uBoil : max(uPipe, far) * .8),
                 smoothstep(0., .3, life) * (1. - smoothstep(.7, 1., life)) * uBeamOn * mix(1., .12, eyeInBeam()), wisp);
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec3 P = c + (right * position.x + up * position.y) * sz;
  vW = P; vQ = vec3(position.xy, al); vK = kind; vec4 mv = viewMatrix * vec4(P, 1.); vD = -mv.z + aK.w * 37.; gl_Position = projectionMatrix * mv;
}`,fragmentShader:`
uniform vec3 uCol; uniform float uGain; varying vec3 vW; varying vec3 vQ; varying float vD, vK;
${te}
void main(){
  vec2 sw = vQ.xy * 3.2 + vec2(fract(vD) * 31., uTime * .25);
  float r = length(vQ.xy) * 2., n = gFbm(sw), n2 = gNoise(sw * 2.6 + 7.);
  float wisp = step(1.5, vK), steamK = 1. - step(.5, vK);
  // each puff is a ragged curl with holes in it; a puff that drifts up to the eye thins away
  float curl = mix(1., smoothstep(.25, .68, .55 * n + .45 * n2), .62 * steamK);
  float cd = length(cameraPosition - vW);
  float a = smoothstep(1., mix(.2, .42, steamK), r + (n - .5) * mix(.8, 1.2, steamK)) * curl * vQ.z * mix(uGain * smoothstep(2.5, 9., cd), .2 * smoothstep(5., 16., cd), wisp);
  float ins = gerInside(vW) * step(vW.y, 25.), vis = mix(1., gerBeam(vW), ins * uRoofC);
  // steam is white in the room's glow (paler above, where the roof lights it) and white-gold where the beam strikes it;
  // pipe smoke outside is grey; the hanging smoke shows only in the beam
  vec3 lit = mix(uSkyCol * .8, (uFeltWarm + uFeltCool) * mix(.3, .68, steamK) * (.86 + .34 * vQ.y), ins * uRoofC);
  vec3 col = uCol * (lit * (1. - wisp) + uSunCol * mix(vec3(1.), vec3(1., .82, .5), wisp) * (vis * mix(.34, .4, wisp) * uSunGate * gerCloud(vec2(0.))));
  a *= mix(1., vis, wisp);
  gl_FragColor = vec4(col * a, a * (1. - .7 * wisp));
}`}));Je.name="steam",Je.frustumCulled=!1,Je.renderOrder=5,s.add(Je);const Kt=new o.Vector2(800,450),Lt=(e,t,n,l,c,p=400,u=[1.5,6],f=0)=>new o.ShaderMaterial({uniforms:{...W,uBuf:{value:Kt},uSize:{value:e},uMinPx:{value:t},uMaxPx:{value:p},uNear:{value:new o.Vector2(u[0],u[1])},uSharp:{value:f},uFall:{value:n},uSunK:{value:l},uAmbK:{value:c},uGain:{value:0},uBeamLen:{value:Ot}},transparent:!0,depthWrite:!1,blending:o.AdditiveBlending,vertexShader:`
attribute vec4 aO, aK; uniform float uSize, uMinPx, uMaxPx, uFall, uBeamLen; uniform vec2 uBuf, uNear; varying vec3 vQ;
${te}
void main(){
  vec3 c = aO.xyz; float ph = aO.w;
  vec3 sway = vec3(sin(uTime * .21 + ph * 50.), sin(uTime * .17 + ph * 31.) * .6, cos(uTime * .19 + ph * 77.)) * (1.2 + aK.x);
  // snow: each flake comes in at the ring and rides slowly down the whole length of the beam, then starts again
  float sl = fract(aO.y - uTime * (.02 + .022 * aK.y));
  vec3 cf = vec3(aO.x, 24.2, aO.z) - uBeamDir * (sl * uBeamLen) + sway * .7;
  c = mix(c + sway, cf, step(.5, uFall));
  vec4 clip = projectionMatrix * viewMatrix * vec4(c, 1.);
  float px = clamp(uSize * (.6 + .8 * aK.z) * projectionMatrix[1][1] / max(clip.w, .1) * uBuf.y * .5, uMinPx, uMaxPx * uBuf.y / 450.);
  clip.xy += position.xy * px * 2. / uBuf * clip.w;
  float ins = gerInside(c) * step(c.y, 25.);
  vQ = vec3(position.xy, mix(1., gerBeam(c), ins * uRoofC) * (.55 + .45 * sin(uTime * (1.5 + ph * 3.) + ph * 90.)) * smoothstep(uNear.x, uNear.y, clip.w));
  gl_Position = clip;
}`,fragmentShader:`
uniform float uGain, uSunK, uAmbK, uSharp; varying vec3 vQ;
${te}
void main(){
  float r = length(vQ.xy) * 2., a = smoothstep(1., .15, r);
  a = mix(a, smoothstep(.6, .22, r) + .22 * a * a, uSharp);                // flakes: a bright core, a thin halo
  gl_FragColor = vec4((uSunCol * vec3(1., .8, .5) * (vQ.z * uSunK * uSunGate * gerCloud(vec2(0.))) + uFeltWarm * uAmbK) * (a * uGain), 1.);
}`}),_t=Math.round(1500*m),ko=Math.min(29.5/Math.hypot(U.x,U.z),24/U.y),Ke=new o.Mesh(Re(_t,(e,t,n)=>{if(e<_t*.62){const l=b.range(1,ko),c=b()*6.2832,p=5.6*Math.sqrt(b());t[e*4]=-U.x*l+Math.cos(c)*p,t[e*4+1]=24-U.y*l,t[e*4+2]=-U.z*l+Math.sin(c)*p}else{const l=b()*6.2832,c=27*Math.sqrt(b());t[e*4]=Math.cos(l)*c,t[e*4+1]=b.range(2,17),t[e*4+2]=Math.sin(l)*c}t[e*4+3]=b(),n[e*4]=b(),n[e*4+1]=b(),n[e*4+2]=b(),n[e*4+3]=b()}),Lt(.07,1.6,0,.6,.02));Ke.name="motes",Ke.frustumCulled=!1,Ke.renderOrder=7,s.add(Ke);const Go=Math.round(1500*m),ge=new o.Mesh(Re(Go,(e,t,n)=>{const l=b()*6.2832,c=5*Math.sqrt(b());t[e*4]=Math.cos(l)*c,t[e*4+1]=b(),t[e*4+2]=Math.sin(l)*c,t[e*4+3]=b(),n[e*4]=b()*.4,n[e*4+1]=b(),n[e*4+2]=b(),n[e*4+3]=b()}),Lt(.3,2,1,.62,.05,8.5,[3,10],1));ge.name="first-snow",ge.frustumCulled=!1,ge.renderOrder=7,ge.visible=!1,s.add(ge);const et=ro.makeParticles({rng:i.fork("sparks"),preset:"snow",count:Math.round(2600*m),box:[90,50,90],size:[.28,.6],colors:["#ffe2a0","#fff4d8","#ffc66b"],intensity:1.6,additive:.8});et.setOpacity(0),s.add(et.object),await a.yield();const Po=Math.round(60*m*h),pt=new o.Mesh(Re(Po,(e,t,n)=>{t[e*4]=b.range(-26,26),t[e*4+1]=b.range(3.2,4.4),t[e*4+2]=b.range(-90,-36),t[e*4+3]=b(),n[e*4]=b.range(.16,.34),n[e*4+1]=b()*6.2832,n[e*4+2]=b.range(.7,1.2),n[e*4+3]=b()}),new o.ShaderMaterial({uniforms:{...W,uCol:D(r.snow?"#6a5a3a":"#e6dc8a")},vertexShader:`
attribute vec4 aO, aK; uniform float uTime; varying vec3 vQ; varying float vD;
void main(){
  float t = fract(uTime * aK.x + aO.w), hop = clamp(t / .24, 0., 1.), on = step(t, .24);
  vec3 c = aO.xyz + vec3(sin(aK.y), 0., cos(aK.y)) * (hop * 9. * aK.z); c.y += 22. * hop * (1. - hop) * aK.z;
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec3 P = c + (right * position.x * 1.5 + up * position.y * .7) * (.9 * aK.z * on);
  vQ = vec3(position.xy, sin(hop * 40.)); vec4 mv = viewMatrix * vec4(P, 1.); vD = -mv.z; gl_Position = projectionMatrix * mv;
}`,fragmentShader:`
uniform vec3 uCol; varying vec3 vQ; varying float vD;
${te}
void main(){
  // a body with a blur of wings above it
  float body = step(length(vQ.xy * vec2(1., 2.6)), .42), wing = step(length((vQ.xy - vec2(0., .22)) * vec2(1.3, 2.4)), .5) * step(0., vQ.y) * (.5 + .5 * vQ.z);
  if (body + wing < .3) discard;
  vec3 c = mix(uCol * 1.6, uCol * .45, body) * (uSkyCol * .6 + uSunCol * .5);
  gl_FragColor = vec4(gerFog(c, vD), 1.);
}`}));pt.name="grasshoppers",pt.frustumCulled=!1,s.add(pt);const Ao={...W,uSpd:{value:r.wind}};{const e=[],t=[],n=[],l=[],c=[];let p=0;const u=[new o.Color("#2f6fe0"),new o.Color("#1e4fa0"),new o.Color("#5e9be8"),new o.Color("#9fc6f4")],f=new o.Color("#3a3026"),g=P.POST_X,S=G=>[ie(-g,g,G),16.3-.8*Math.sin(Math.PI*G),P.GATE_Z];for(let G=0;G<=24;G++)for(const L of[-1,1]){const k=S(G/24);e.push(k[0],k[1]+L*.13,k[2]),t.push(0,0,0),l.push(0),n.push(f.r,f.g,f.b)}for(let G=0;G<24;G++){const L=G*2;c.push(L,L+2,L+1,L+1,L+2,L+3)}p=50;const F=8,I=36,E=(G,L,k,ae,ye,R)=>{for(let _=0;_<=I;_++)for(const O of[-1,1])e.push(G,L,k),t.push(_/I*R,O,ye),l.push(R),n.push(ae.r,ae.g,ae.b);for(let _=0;_<I;_++){const O=p+_*2;c.push(O,O+2,O+1,O+1,O+2,O+3)}p+=(I+1)*2};for(let G=0;G<F;G++){const L=(G+.7)/(F+.4),k=S(L),ae=u[G%4===3?3:b.int(0,2)],ye=b()*6.28,R=b.range(5.4,8.2);E(k[0],k[1]-.42,k[2],ae,ye,R)}for(let G=0;G<5;G++){const L=u[G%3],k=b()*6.28,ae=b.range(6,9);E(g+.6,6.4+G*1.75,P.GATE_Z,L,k,ae)}const $=new o.BufferGeometry;$.setAttribute("position",new o.Float32BufferAttribute(e,3)),$.setAttribute("aW",new o.Float32BufferAttribute(t,3)),$.setAttribute("aL",new o.Float32BufferAttribute(l,1)),$.setAttribute("color",new o.Float32BufferAttribute(n,3)),$.setIndex(c);const we=new o.Mesh($,new o.ShaderMaterial({uniforms:Ao,side:o.DoubleSide,vertexColors:!0,vertexShader:`
attribute vec3 aW; attribute float aL; uniform float uTime, uSpd; varying vec3 vW, vC, vN; varying vec2 vT; varying float vD;
vec3 ctr(float t, float ph, float len){
  float k = t / max(len, .1), amp = .22 + 1.25 * k, sp = .6 + .4 * uSpd;
  float w1 = sin(t * 1.2 - uTime * 6.5 * sp + ph), w2 = sin(t * .5 - uTime * 2.4 * sp + ph * 2.3), w3 = sin(t * 2.7 - uTime * 10.5 * sp + ph * 1.7) * k * k;
  return vec3(.93, -.06, .34) * t + vec3(-.2, .78, .6) * ((w1 * .5 + w2 * .42) * amp + w3 * .42) + vec3(0., -1., 0.) * (k * k * .9);
}
void main(){
  float t = aW.x, ph = aW.z, len = aL; vec3 P = position, N = vec3(0., 0., -1.);
  if (len > .5) {
    float k = t / len;
    vec3 c0 = ctr(t, ph, len), T = normalize(ctr(t + .12, ph, len) - ctr(t - .12, ph, len));
    vec3 B = normalize(vec3(0., 1., 0.) - T * T.y), Nn = cross(T, B);
    float tw = (1.1 * sin(t * .75 - uTime * 3.2 + ph * 1.3) + .5 * sin(t * 1.9 - uTime * 7. + ph)) * smoothstep(0., .35, k);
    vec3 Bt = B * cos(tw) + Nn * sin(tw);
    P = position + c0 + Bt * (aW.y * .5 * (1. - .3 * k));
    N = cross(T, Bt);
  }
  vW = P; vC = color; vN = N; vT = vec2(t, aW.y); vec4 mv = viewMatrix * vec4(P, 1.); vD = -mv.z; gl_Position = projectionMatrix * mv;
}`,fragmentShader:`
varying vec3 vW, vC, vN; varying vec2 vT; varying float vD;
${te}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)), V = normalize(cameraPosition - vW); if (dot(N, V) < 0.) N = -N;
  // silk: a darker selvedge, light through the cloth from the sun's side, a long soft sheen
  vec3 alb = vC * (.82 + .18 * smoothstep(1., .7, abs(vT.y))) * (.94 + .1 * gNoise(vec2(vT.x * 3., vT.y * 2.)));
  float sp = max(dot(reflect(-uSunDir, N), V), 0.); sp *= sp; sp *= sp;
  vec3 c = gerLight(alb, N, vW, 1.) + alb * uSunCol * (.42 * max(dot(-N, uSunDir), 0.) + .22 * sp * sp + .1 * sp);
  gl_FragColor = vec4(gerFog(c, vD), 1.);
}`}));we.name="scarves",we.frustumCulled=!1,s.add(we)}await a.yield();const Wo=Math.min(h,1.08),Do=new o.Vector2(.93,.36).normalize(),No=(r.flowerColors||["#e8d8a0","#c8682c","#8a4c90"]).slice(0,3).map(e=>new o.Color(e)),To={...Nt,uFade:{value:new o.Vector2(230,330)},uTipC:D(r.tip),uDryC:D(r.dry),uPlumeC:D(r.snow?"#e4e0d4":"#e9dcb4"),uDryAmt:{value:r.dryAmt},uFlowerAmt:{value:r.flowers*2.2},uFl:{value:No},uWindDir:{value:Do}},Fo=new o.ShaderMaterial({uniforms:To,side:o.DoubleSide,vertexShader:`
attribute vec4 aO, aK; uniform float uTime, uWindK; uniform vec2 uFade, uWindDir;
varying vec2 vUv, vS; varying vec3 vW; varying vec4 vK;
float vHash(vec2 p){ p = fract(p * vec2(.1031, .1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.y); }
float vNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(vHash(i), vHash(i + vec2(1., 0.)), f.x), mix(vHash(i + vec2(0., 1.)), vHash(i + vec2(1., 1.)), f.x), f.y); }
void main(){
  vec3 root = vec3(aO.x, 0., aO.y);
  vec2 tc = cameraPosition.xz - root.xz; float d = length(cameraPosition - root);
  vec2 f = tc / max(length(tc), .01); float ja = (aO.z - .5) * 1.5, cs = cos(ja), sn = sin(ja);
  f = vec2(f.x * cs - f.y * sn, f.x * sn + f.y * cs);
  vec2 rt = vec2(f.y, -f.x);
  float fade = 1. - smoothstep(uFade.x, uFade.y, d);
  float H = aK.y * fade, Wd = aK.z;
  // the wind: long waves running down the wind, broken by slower cross swells; each card flutters a little by itself
  float ph = dot(root.xz, uWindDir) * .15 - uTime * 1.5 * (.5 + .5 * uWindK) + 5. * vNoise(root.xz * .017);
  float g1 = .5 + .5 * sin(ph), g2 = .5 + .5 * sin(dot(root.xz, vec2(-uWindDir.y, uWindDir.x)) * .023 + uTime * .4 + 1.7);
  float gust = g1 * g1 * (.45 + .55 * g2);
  float lean = (.1 + .52 * gust) * min(uWindK, 1.6) + .05 * sin(uTime * 3.1 + aO.z * 40.);
  vec3 P = root + vec3(rt.x, 0., rt.y) * (position.x * Wd) + vec3(0., position.y * H * (1. - .22 * lean * lean), 0.) + vec3(uWindDir.x, 0., uWindDir.y) * (position.y * H * lean);
  vUv = position.xy; vS = vec2(Wd, max(H, .01)); vW = P;
  vec4 mv = viewMatrix * vec4(P, 1.);
  vK = vec4(aO.w, aK.x, gust, -mv.z);
  gl_Position = projectionMatrix * mv;
}`,fragmentShader:`
uniform vec3 uGR, uTipC, uDryC, uPlumeC, uFl[3]; uniform float uDryAmt, uFlowerAmt, uSnow;
varying vec2 vUv, vS; varying vec3 vW; varying vec4 vK;
${te}
${lo}
void main(){
  float plume = step(.5, vK.y);
  float NB = mix(7., 3., plume);
  float cx = (vUv.x * .5 + .5) * NB, ci = floor(cx), px = fwidth(cx), colW = 2. * vS.x / NB, y = vUv.y;
  float cov = 0., bt = 0., bh = 0., fl = 0., pl = 0.;
  // flowers stand thickest on the verges of the way out and round the gate; the trodden ground itself bears none
  float flAmt = uFlowerAmt * (1. + 1.6 * wayVerge(vW.xz)) * (1. - wornTrack(vW.xz));
  for (int j = -1; j <= 1; j++) {
    float i = ci + float(j), ok = step(0., i) * step(i, NB - .5);
    float h1 = gHash(vec2(i * 7.3 + 1.7, vK.x * 113.)), h2 = gHash(vec2(i * 3.1 + 9.2, vK.x * 71. + 5.)), h3 = gHash(vec2(i * 5.7 + 4.4, vK.x * 37. + 11.));
    float hb = mix(.48, 1., h1), t = y / hb, tc = clamp(t, 0., 1.);
    float xc = i + .5 + (h2 - .5) * .8 + (h3 - .5) * 1.9 * tc * tc, dx = abs(cx - xc);
    // a blade tapers to a point; feather grass is a hair of a stem under a long soft plume, combed into streaks
    float tt = clamp((tc - .46) / .54, 0., 1.);
    float wB = .21 * pow(1. - tc, .65), wP = max(.04, .26 * pow(max(sin(3.1416 * tt), 0.), .7) * (1. - .45 * tt));
    float streak = mix(smoothstep(.28, .5, gNoise(vec2(dx * 11. - tc * 26., tc * 13. + h1 * 20.))), 1., smoothstep(.12, .4, px));
    float hw = max(mix(wB, wP * mix(1., streak, step(.07, dx)), plume), .55 * px);
    float a = (1. - smoothstep(hw - .5 * px, hw + .5 * px, dx)) * ok * step(t, 1.);
    if (a > cov) { cov = a; bt = tc; bh = h3; pl = plume * smoothstep(.44, .56, tc); fl = 0.; }
    // a flower head on a few blades
    float fd = length(vec2((cx - xc) * colW, (t - .95) * hb * vS.y));
    if (ok * (1. - plume) * step(h2, flAmt) * step(fd, max(.24, 1.1 * px * colW)) > .5) { cov = 1.; bt = 1.; bh = h3; fl = 1. + floor(h1 * 2.99); pl = 0.; }
  }
  if (cov < .5) discard;
  vec3 alb = mix(uTipC, uDryC, step(1. - uDryAmt, bh)) * (.78 + .44 * gHash(vec2(bh * 91., vK.x * 17.)));
  alb = mix(uGR * .75, alb, smoothstep(0., .6, bt));
  alb = mix(alb, uPlumeC, pl);
  if (fl > .5) alb = fl < 1.5 ? uFl[0] : (fl < 2.5 ? uFl[1] : uFl[2]);
  // a blade stands in the shade of the grass round it up to that grass's height: on the way out, where the grass is
  // trodden to stubble (the same wear as the blades' height), the stubble stands in the open and is lit lower down
  float ao = mix(.2, 1., smoothstep(0., 2.4 * (1. - .74 * wornTrack(vW.xz)), vW.y) * (.55 + .45 * bt));
  vec3 V = normalize(cameraPosition - vW); vec2 hs = normalize(uSunDir.xz + vec2(1e-5, 0.));
  float back = .3 + .7 * smoothstep(-.4, .9, dot(-V.xz, hs) / max(length(V.xz), .05));
  float rim = bt * bt * bt * back * (1. + .9 * pl), gust = vK.z;
  float sun = gerCloud(vW.xz) * (1. - postShade(vW)) * uSunGate;
  // the crest of a gust shows the blades' pale sides, the trough between two gusts stands darker
  vec3 lit = (uSkyCol * (.26 + .5 * ao) + uSunCol * (sun * (.22 * ao + .2 * rim))) * mix(.74, 1.2, gust);
  vec3 c = alb * .56 * lit + alb * gateGlow(vW);
  gl_FragColor = vec4(gerFog(c, vK.w), 1.);
}`}),tt=new o.InstancedBufferGeometry;tt.setAttribute("position",new o.Float32BufferAttribute([-1,0,0,1,0,0,1,1,0,-1,1,0],3)),tt.setIndex([0,1,2,0,2,3]);const ue=i.fork("blades"),Bo=(e,t)=>{if(t<30)return 1;const n=A(6.2,2.4,Math.abs(e-1.2*Math.sin(t*.09)))*A(33,42,t)*(1-A(P.GATE_Z-5,P.GATE_Z+3,t));return 1-.74*Math.max(n,A(15,7.5,Math.hypot(e,t-(P.GATE_Z-2))))},Le=async(e,t,n,l,c)=>{const p=new Float32Array(t*4),u=new Float32Array(t*4);let f=0;for(let F=0;f<t&&F<t*8;F++){const I=ie(n[0],n[2],ue()),E=ie(n[1],n[3],ue());ue()<l(I,E)&&(p[f*4]=I,p[f*4+1]=E,p[f*4+2]=ue(),p[f*4+3]=ue(),u[f*4]=c.plume?1:0,u[f*4+1]=ie(c.h[0],c.h[1],ue())*Bo(I,E),u[f*4+2]=ie(c.w[0],c.w[1],ue()),u[f*4+3]=ue(),f++),(F&1023)===0&&await a.yield()}const g=new o.InstancedBufferGeometry;g.setAttribute("position",tt.attributes.position),g.setIndex(tt.index),g.setAttribute("aO",new o.InstancedBufferAttribute(p.subarray(0,f*4),4)),g.setAttribute("aK",new o.InstancedBufferAttribute(u.subarray(0,f*4),4)),g.instanceCount=f,g.boundingSphere=new o.Sphere(new o.Vector3(0,0,30),400);const S=new o.Mesh(g,Fo);return S.name=e,S.frustumCulled=!1,s.add(S),await a.yield(),S},gt=r.snow?.5:1,T=P.GATE_Z,Et=(e,t)=>{const n=Math.hypot(e,t);return n<58?0:A(58,65,n)*(1-.6*A(80,190,n))*gt},jt=(e,t)=>{const n=Math.hypot(e,t);return n<58?0:A(58,64,n)*(.4+.6*A(62,22,Math.abs(e-(t>0?8:0))))*gt},Io=(e,t)=>{const n=Math.hypot(e,t);return n<35.8||n>64?0:(1-.7*A(57,64,n))*(t>20&&Math.abs(e)<46?1:t<-20&&Math.abs(e)<52?.7:.4)*gt},Ro=(e,t)=>Et(e,t)*(.25+.75*A(-.2,.5,a.noise.n2(e*.03,t*.03))),_e=m*Wo;await Le("grass-wide",Math.round(15e3*_e),[-170,-180,170,300],Et,{h:[2.4,4],w:[1.3,1.9]}),await Le("grass-in",Math.round(9e3*_e),[-56,-156,56,-30],jt,{h:[2,3.6],w:[1,1.5]}),await Le("grass-out",Math.round(3e4*_e),[-62,30,84,T+62],jt,{h:[2,3.8],w:[1,1.5]}),await Le("grass-short",Math.round(9e3*_e),[-65,-65,65,65],Io,{h:[.9,1.9],w:[.7,1.1]}),await Le("feather-grass",Math.round(3e3*_e),[-120,-160,120,240],Ro,{h:[4.4,6.2],w:[.9,1.3],plume:!0}),await a.yield();const wt=e=>"#"+new o.Color(e[0],e[1],e[2]).multiplyScalar(1/Math.max(1,e[0],e[1],e[2])).getHexString(o.LinearSRGBColorSpace),yt={sunDir:ve,sunColor:wt(r.sun),sunIntensity:3.1,sky:wt(r.skyC),skyIntensity:1.6,ground:wt(r.gnd),groundIntensity:1.5},Zt={species:"horse",size:9,coat:H,light:yt,...He?{tints:["#ffffff","#f4ece0","#8a7a6a","#fff8f0"]}:{}},bt=Me.makeHerd({...Zt,rng:i.fork("herd"),count:6,sizes:[1,.95,1.05,1,.92,.52],mode:"migrate",speed:11,spread:[10,110],route:[[-112,0,T+112],[-35,0,T+106],[45,0,T+110],[112,0,T+120],[120,0,T+138],[60,0,T+152],[-40,0,T+154],[-114,0,T+140]],closed:!0,start:x()});await a.yield();const ot={...Zt,geometry:bt.geometry},Vt=Me.makeHerd({...ot,rng:i.fork("herd2"),count:4,sizes:[1,.96,1.04,.9],center:[-104,0,T+236],radius:22,roam:.45});await a.yield();const qt=Me.makeHerd({...ot,rng:i.fork("foals"),count:1,sizes:[.5],center:[-58,0,T+44],radius:3,roam:.3});await a.yield();const Qt=Me.makeHerd({...ot,rng:i.fork("bucker"),count:1,sizes:[.52],center:[0,0,0],radius:.4,roam:.07,speed:.25,blobShadow:!1}),Ae=new o.Group;Ae.position.set(-42,0,T+33),Ae.add(Qt.object),s.add(bt.object,Vt.object,qt.object,Ae),await a.yield();const Ht=[[-225,T+92],[-120,T+76],[0,T+70],[120,T+74],[215,T+90],[252,T+126],[215,T+162],[90,T+178],[-90,T+178],[-215,T+162],[-255,T+126]],xt=new o.CatmullRomCurve3(Ht.map(e=>new o.Vector3(e[0],0,e[1])),!0,"centripetal"),We=xt.getLength(),De=4,Ut=(e,t)=>{let n=1e12,l=0;for(let c=0;c<300;c++){xt.getPointAt(c/300,Y);const p=(Y.x-e)**2+(Y.z-t)**2;p<n&&(n=p,l=c)}return l/300*We},$t=[],Xt=[],Ee=new o.Vector3;let je=1,Mt=0;for(let e=0;e<De;e++){const t=Me.makeHerd({...ot,rng:i.fork("run"+e),count:12,sizes:[1,.94,1.06,.98,.6,.9,1.02,.58,.96,.92,.62,1.04],mode:"migrate",gait:"run",speed:8.5,spread:[14,160],route:Ht.map(c=>[c[0],0,c[1]]),closed:!0});t.positionAt(0,void 0,Ee),e||(je=t.uniforms.uSpeed.value,Mt=Ut(Ee.x,Ee.z));const n=We/je,l=(Mt+e*We/De-Ut(Ee.x,Ee.z))/je;Xt.push((l%n+n)%n),$t.push(t),s.add(t.object),await a.yield()}const Yt=36,Jt=[0,0,0,0],Oo=Array.from({length:96},(e,t)=>(xt.getPointAt(t/96,Y),new o.Vector2(Y.x,Y.z))),at=new o.Mesh(Re(De*Yt,(e,t,n)=>{t[e*4]=Math.floor(e/Yt),t[e*4+1]=b.range(-15,15),t[e*4+2]=b.range(80,170),t[e*4+3]=b(),n[e*4]=b.range(.4,.66),n[e*4+1]=b.range(14,26),n[e*4+2]=b(),n[e*4+3]=b()}),new o.ShaderMaterial({uniforms:{...W,uBandS:{value:Jt},uLoop:{value:Oo},uLoopLen:{value:We},uRunV:{value:je},uCol:D(r.snow?"#e6ecf8":le(r.grassC,r.fog,.45))},transparent:!0,depthWrite:!1,vertexShader:`
attribute vec4 aO, aK; uniform vec2 uLoop[96]; uniform float uBandS[4], uLoopLen, uTime, uRunV; varying vec3 vQ, vW; varying float vD;
void main(){
  // where the band's front is on the loop, in metres along it; a puff lies that many metres back along the loop itself
  float sb = uBandS[0];
  if (aO.x > 2.5) sb = uBandS[3]; else if (aO.x > 1.5) sb = uBandS[2]; else if (aO.x > .5) sb = uBandS[1];
  float life = fract(uTime * aK.x + aO.w), age = life / aK.x;
  float lf = fract((sb - aO.z - uRunV * age * .9) / uLoopLen) * 96.;
  int li = min(int(lf), 95), lj = li == 95 ? 0 : li + 1, lh = li == 0 ? 95 : li - 1, lk = lj == 95 ? 0 : lj + 1;
  // the way the loop runs there is blended from the points either side, so a puff's place turns evenly round a bend
  vec2 la = uLoop[li], lb = uLoop[lj], bd = normalize(mix(normalize(lb - uLoop[lh]), normalize(uLoop[lk] - la), lf - float(li))), bq = mix(la, lb, lf - float(li));
  vec3 c = vec3(bq.x, 0., bq.y) + vec3(-bd.y, 0., bd.x) * aO.y + vec3(0., 3. + 18. * life, 0.);
  float sz = aK.y * (.55 + 1.5 * life);
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec3 P = c + (right * position.x * 1.5 + up * position.y) * sz;
  vW = P; vQ = vec3(position.xy, smoothstep(0., .1, life) * (1. - life) * (1. - life));
  vec4 mv = viewMatrix * vec4(P, 1.); vD = -mv.z; gl_Position = projectionMatrix * mv;
}`,fragmentShader:`
uniform vec3 uCol; varying vec3 vQ, vW; varying float vD;
${te}
void main(){
  float r = length(vQ.xy) * 2., n = gFbm(vQ.xy * 2.4 + vW.xz * .03 + vec2(0., -uTime * .15));
  // a billow, not a pane: the puff is thinner where its own finer noise is low
  float a = smoothstep(1., .25, r + (n - .5) * .9) * vQ.z * (.6 + .5 * gFbm(vQ.xy * 5.3 + vW.xz * .07 + vec2(3., -uTime * .22)));
  vec3 c = uCol * (uSkyCol * .5 + uSunCol * (.36 + .16 * vQ.y)) * gerCloud(vW.xz);
  gl_FragColor = vec4(gerFog(c, vD), a);
}`}));at.name="herd-dust",at.frustumCulled=!1,at.renderOrder=4,s.add(at),await a.yield();const eo=fe?Me.makeFlock({rng:i.fork("birds"),species:"eagles",count:2,size:9,wander:[0,0,0,.2],light:yt,cross:{path:Ce,u:K(.31),lead:42,height:50,angle:60,span:460,duration:rt}}):Me.makeFlock({rng:i.fork("birds"),species:"geese",count:11,size:10,speed:16,light:yt,body:"#9aa0a8",belly:"#c8ccd0",wingC:"#7c828c",tip:"#2a2c30",head:"#2a2c30",neckC:"#3a3c42",cross:{path:Ce,u:K(.31),lead:40,height:40,angle:62,span:460,duration:rt}});s.add(eo.object),await a.yield();{const e=new o.PlaneGeometry(22,.3,12,1);e.rotateX(-Math.PI/2);const t=q();t.add(e,{p:[-50,.5,T+39],r:[0,.2,0],c:"#3a3026",m:1});for(const n of[-1,1])t.add(C(.2,.26,1.6,6),{p:[-50+n*10.6,.7,T+39-n*2.2],c:B.woodDark});s.add(new o.Mesh(t.build(),lt))}await a.yield();const Ko=(()=>{const e=2*P.POST_X-.9,t=20,n=12,l=[],c=[],p=[];for(let g=0;g<=n;g++)for(let S=0;S<=t;S++){const F=S/t,I=g/n,E=16.2-.8*Math.sin(Math.PI*F);l.push((F-.5)*e,E-I*(E-2.6),T-1.1),c.push(F,I)}for(let g=0;g<n;g++)for(let S=0;S<t;S++){const F=g*(t+1)+S,I=F+t+1;p.push(F,I,F+1,F+1,I,I+1)}const u=new o.BufferGeometry;u.setAttribute("position",new o.Float32BufferAttribute(l,3)),u.setAttribute("uv",new o.Float32BufferAttribute(c,2)),u.setIndex(p);const f=new o.Mesh(u,new o.ShaderMaterial({uniforms:{...W,uSpd:{value:r.wind},uCA:D("#b9b09c"),uCB:D(B.blue),uCC:D(B.wood)},side:o.DoubleSide,vertexShader:`
uniform float uTime, uSpd; varying vec3 vW; varying vec2 vUv; varying float vD;
void main(){
  float v = uv.y, x = position.x;
  // hung over the rope in deep folds; the wind fills it from below
  float bil = (sin(x * .42 + uTime * 1.3 * (.6 + .4 * uSpd)) * .9 + sin(x * 1.1 - uTime * 2.2 + v * 3.) * .35) * v * v * (.6 + .4 * uSpd);
  vec3 P = position + vec3(0., 0., .34 * sin(x * 2.3 + v * 1.4) * (.3 + .7 * v) + bil);
  vW = P; vUv = uv; vec4 mv = viewMatrix * vec4(P, 1.); vD = -mv.z; gl_Position = projectionMatrix * mv;
}`,fragmentShader:`
uniform vec3 uCA, uCB, uCC; varying vec3 vW; varying vec2 vUv; varying float vD;
${te}
void main(){
  vec3 dx = dFdx(vW), dy = dFdy(vW), N = normalize(cross(dx, dy) + vec3(0., 0., 1e-5));
  vec3 V = normalize(cameraPosition - vW); if (dot(N, V) < 0.) N = -N;
  // unbleached canvas, a woven texture, two painted bands and a hem near the foot
  float weave = gNoise(vW.xy * vec2(9., 14.)) * .5 + gNoise(vW.xy * vec2(31., 5.)) * .5;
  vec3 alb = uCA * (.82 + .22 * weave) * (.9 + .2 * gFbm(vW.xy * .5));
  float b1 = smoothstep(.02, .0, abs(vUv.y - .8) - .03), b2 = smoothstep(.012, .0, abs(vUv.y - .89) - .012), b3 = smoothstep(.01, .0, abs(vUv.y - .715) - .006);
  alb = mix(alb, uCB * .8, b1); alb = mix(alb, uCC * .8, max(b2, b3));
  alb *= .55 + .45 * smoothstep(0., .05, min(vUv.x, 1. - vUv.x)) ;
  vec3 c = gerLight(alb, N, vW, 1.) + alb * uSunCol * (.3 * max(dot(-N, uSunDir), 0.));
  gl_FragColor = vec4(gerFog(c, vD), 1.);
}`}));return f.name="canvas-cover",f.frustumCulled=!1,s.add(f),f})();await a.yield(),await Se.prewarm(a.renderer,null,s);const Ze=new o.Vector3,Lo=new o.Vector3,nt=new o.Vector3,_o=new o.Vector3,Ve=new o.Color,Eo=he.ring.center.clone().lerp(he.beamFoot,.52),St=(e,t,n,l,c)=>A(e,t,c)*(1-A(n,l,c));return{scene:s,path:Ce,duration:rt,pace:ho,ride:"none",style:"none",camera:{fov:64,near:.3,far:4800,lookAhead:18,sway:.6,bank:.3},pois:[{at:()=>_o.copy(J.parts.crown.position),from:K(.03),to:K(.15),weight:.34},{at:[.5,19,1],from:K(.13),to:K(.31),weight:.8},{at:(e,t)=>{Ce.pointAt(t,nt);const n=Math.atan2(nt.x,nt.z)+.8;return nt.set(Math.sin(n)*4.5,24,Math.cos(n)*4.5)},from:K(.26),to:K(.44),weight:.8},{at:[9,16,2],from:K(.405),to:K(.5),weight:.6},{at:Eo,from:K(.485),to:K(.675),weight:.85},{at:he.ring.center.clone().lerp(he.beamFoot,.62),from:K(.6),to:K(.7),weight:.7},{at:(e,t)=>{const n=A(.7,.74,Ue(t)),l=(152+58*n)*Math.PI/180;return Lo.set(Math.sin(l)*25,6.2-1.2*n,Math.cos(l)*25)},from:K(.685),to:K(.752),weight:.75},{at:[8,9.5,17],from:K(.725),to:K(.805),weight:.85},{at:he.door,from:K(.785),to:K(.86),weight:.5},{at:he.portalSeat,from:K(po.door[1]),to:1,weight:.72}],portal:{shape:"circle",radius:5,color:r.portal,glow:.45,revealDistance:220},post:{exposure:r.exposure,bloom:{strength:.5,radius:.62,threshold:1.1},grade:{saturation:.97,contrast:1.06,tint:r.tint,shadowTint:r.shadow,vignette:.3,grain:.02,aberration:0}},update(e,t,n,l){const c=Ue(l);J.update(e,t,n,c),Ze.setFromMatrixPosition(n.matrixWorld),a.renderer.getDrawingBufferSize(Kt);const p=J.state,u=A(31,28,Math.hypot(Ze.x,Ze.z))*p.closure*(1-.8*p.doorOpen);Ve.copy(ze).lerp(uo,u);const f=ie(r.fogDen,.0013,u);s.fog.color.copy(Ve),s.fog.density=f,W.uFogCol.value.set(Ve.r,Ve.g,Ve.b),W.uFogDen.value=f;const g=A(.137,.24,c);dt.uReveal.value=ie(4.5,31.5,g),dt.uRoll.value=ie(.75,.25,g),Fe.position.y=ie(-18.6,0,A(.4,.45,c));const S=St(.72,.78,.86,.92,c);ht.uBoil.value=S,ht.uPipe.value=A(.44,.48,c),pe.scale.set(2.2+.7*S,.05+.75*S*(.8+.2*Math.sin(t*5)),2.2+.7*S),Be.rotation.y=.55*Math.sin(t*1.15)+.2*Math.sin(t*2.7),Be.rotation.x=.12*Math.sin(t*1.15+1),vt.rotation.x=.3*Math.sin(t*2.2)+.06*Math.sin(t*5.1);const F=A(.4,.455,c);Ge.position.lerpVectors(Mo,So,F),Ge.position.y+=Math.sin(Math.PI*F)*4,Bt.setFromAxisAngle(Ze.set(0,0,1),F*(.07*Math.sin(t*.9)+.02*Math.sin(t*2.3))),Ge.quaternion.copy(zo).slerp(Bt,F),Ze.setFromMatrixPosition(n.matrixWorld);const I=St(.76,.785,.85,.88,c);Pe.children[0].scale.set(1,1+.07*Math.sin(t*1.8),1+.03*Math.sin(t*1.8)),Ie.rotation.z=1.25-I*.95*Math.abs(Math.sin(t*7.5))+.05*Math.sin(t*1.3),Ke.material.uniforms.uGain.value=.15*p.closure+.85*p.beam;const E=v?A(.42,.48,c)*(1-A(.885,.91,c)):0;ge.visible=E>.001,ge.material.uniforms.uGain.value=E,et.setOpacity(v?A(.84,.9,c):0),et.update(e,t,n),Ko.visible=c<.56;const $=St(.885,.905,.962,.985,c),we=t*.95%1,G=io(we/.5,0,1),L=Math.sin(Math.PI*G);Ae.position.y=2*$*L*L,Ae.rotation.x=.16*$*Math.sin(6.2832*G),Ae.rotation.z=-.1*$*Math.sin(6.2832*G+.8),bt.update(e,t,n,l),Vt.update(e,t,n,l),qt.update(e,t,n,l),Qt.update(e,t,n,l),eo.update(e,t,n,l);for(let k=0;k<De;k++)$t[k].update(e,t+Xt[k],n,l);for(let k=0;k<De;k++)Jt[k]=(Mt+k*We/De+je*t)%We;It.update(e,t,n),Rt.update(e,t,n);for(let k=0;k<7;k++)W.uLamp.value[k].w=.86+.1*Math.sin(t*6.3+k*2.1)+.06*Math.sin(t*13.7+k*4.4);Se.update(e,t,n)},dispose(){it.dispose(),J.dispose(),Se.dispose&&Se.dispose()}}}};export{w0 as default};
