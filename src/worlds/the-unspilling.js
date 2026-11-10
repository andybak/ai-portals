import*as u from"three";import{makePath as Vt,clamp as T0,lerp as p0,smoothstep as F0}from"../kit/core.js";import*as X from"../kit/interior.js";import{buildHero as jt,HERO_GLSL as Z0,makePchip as Le}from"../parts/the-unspilling.js";const j=Math.PI,B0=j*2,nt=12,G0=-115,i0=u.Vector3,U=-30,Q=48,m0=52,K=-470,Q0=42,Ce=[[-40,-110],[-140,-210],[-240,-310],[-326,-410]],Se=[-424,-460],J0=[...Ce,Se],oe="#ECE8DF",ke="#8E9AA8",h0="#B5673A",Ae="#C8791C",X0="#9DB24C",Io="#3A2A22",qt="#2F8F8C",pe=t=>{const e=t.onBeforeCompile,r=t.customProgramCacheKey;return t.onBeforeCompile=(n,a)=>{e.call(t,n,a),n.fragmentShader=n.fragmentShader.replace("#include <opaque_fragment>",`outgoingLight = max(outgoingLight, vec3(0.));
#include <opaque_fragment>`)},t.customProgramCacheKey=()=>r.call(t)+":pos",t},Et=`
{
  vec2 fp = vObjPos.xz, fc = floor(fp / 6.), ff = fract(fp / 6.) * 6. - 3., af = abs(ff);
  float fwp = length(fwidth(fp)), lodP = clamp(1.6 - fwp * 3.2, 0., 1.), m = max(af.x, af.y);
  float band = 1. - smoothstep(0., .05 + fwp, abs(m - 2.42) - .1), line = 1. - smoothstep(0., .04 + fwp, abs(m - 2.08) - .03);
  vec2 cq = af - vec2(2.42); float dia = 1. - smoothstep(.24, .28 + fwp, abs(cq.x) + abs(cq.y));
  float chk = mod(fc.x + fc.y, 2.), rr = length(ff), an = atan(ff.y, ff.x + (abs(ff.x) < 1e-4 ? 2e-4 : 0.));
  float pet = 1. - smoothstep(0., .08 + fwp, rr - (.72 + .58 * abs(cos(an * 4.)))), ring = 1. - smoothstep(0., .05 + fwp, abs(rr - 1.62) - .05), core = 1. - smoothstep(.3, .34 + fwp, rr);
  vec3 pc = diffuseColor.rgb;
  pc = mix(pc, uTileCol, band * .82 * lodP); pc = mix(pc, uTileCol * .55, line * .7 * lodP); pc = mix(pc, uAccCol, dia * .9 * lodP);
  pc = mix(pc, mix(uTileCol, pc, .3), chk * pet * .8 * lodP); pc = mix(pc, uTileCol * .6, chk * ring * .65 * lodP); pc = mix(pc, uAccCol, chk * core * .85 * lodP);
  // the spill
  vec2 sd = fp - uSpill.xy; float sl = length(sd), sr = sl / max(uSpill.z, 1.) + (i_fbm2(fp * .085 + 3.) - .5) * .85 + (i_n2(fp * .5) - .5) * .12;
  float sheet = (1. - smoothstep(uSpill.w - .07, uSpill.w, sr)) * step(.02, uSpill.w);
  float rim = sheet * (1. - sheet) * 4.;
  float rip = sin(sl * 2.6 + uSpillT * 2.2 + 2. * i_n2(fp * .2)) * (.5 + .5 * sin(sl * .7 - uSpillT * .6));
  pc = mix(pc, mix(pc * mix(vec3(1.), uSpillCol.rgb, .92), uSpillCol.rgb, uSpillCol.a) * (1. - .3 * rim), sheet);
  diffuseColor.rgb = pc;
  iGloss = mix(iGloss, .97, sheet); iH = mix(iH, rip * .0028, sheet * .9);
}
`,it=`
{
  vec2 mp = vObjPos.xz; float mfw = length(fwidth(mp)), ml = clamp(1.5 - mfw * 4., 0., 1.);
  float cl = i_fbm2(mp * .07 + 11.), cl2 = i_fbm2(mp * .31 + 4.);
  vec2 wq = mp + 4.2 * vec2(i_fbm2(mp * .1 + 2.), i_fbm2(mp * .1 + 9.));
  float v1 = 1. - smoothstep(0., .028 + mfw * .5, abs(i_n2(wq * .17) - .5));                    // long veins: level lines of a warped field
  float v2 = 1. - smoothstep(0., .03 + mfw * .9, abs(i_n2(wq * .55 + 5.) - .5));                 // their branches
  float v3 = 1. - smoothstep(0., .045 + mfw * 1.6, abs(i_n2(wq * 1.7 + 13.) - .5));              // hairlines
  float vm = (.56 * v1 * (.3 + .7 * i_n2(mp * .23 + 3.)) + .3 * v2 * smoothstep(.3, .75, i_n2(mp * .13 + 7.)) + .1 * v3 * smoothstep(.45, .8, cl2)) * ml;
  vec3 mc = diffuseColor.rgb * (.88 + .2 * cl) * (.965 + .07 * cl2);
  mc = mix(mc, mc * vec3(.52, .55, .6), vm);
  mc = mix(mc, mc * vec3(1.06, 1.02, .94), smoothstep(.55, .9, i_fbm2(mp * .045 + 20.)) * .6);  // warm clouds
  diffuseColor.rgb = mc;
}
`,Ut=`
{
  vec2 dp = vObjPos.xz; float dn = i_fbm2(dp * .22 + 31.), dg = i_n2(dp * 2.6);
  float du = 0.;
  du += (1. - smoothstep(.45, 1., length((dp - vec2(19.5, -272.6)) / vec2(6.4, 5.8)) + (dn - .5) * .7));
  du += (1. - smoothstep(.45, 1., length((dp - vec2(14.2, -282.)) / vec2(3.2, 7.)) + (dn - .5) * .8)) * .7;
  du += (1. - smoothstep(.45, 1., length((dp - vec2(9., -247.)) / vec2(3.4, 6.5)) + (dn - .5) * .8)) * .8;
  du += (1. - smoothstep(.5, 1., length((dp - vec2(21.5, -166.)) / vec2(8., 16.)) + (dn - .5) * .7)) * .7;
  du += (1. - smoothstep(.45, 1., length((dp - vec2(-3.5, -391.)) / vec2(6., 4.5)) + (dn - .5) * .8)) * .8;
  du = clamp(du, 0., 1.) * (.55 + .45 * dg) * step(vObjPos.y, 20.);
  diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 1.22 + vec3(.1, .095, .08), du * .8);
  iGloss = mix(iGloss, .05, du);
}
`,rt="uniform vec3 uBandSun; uniform vec4 uBandWin[5]; uniform vec3 uBandShade; uniform vec3 uBandLit; uniform float uBandK;",ct=`
{
  vec3 bh = vObjPos + uBandSun * max((${(-30).toFixed(1)} - vObjPos.x) / min(uBandSun.x, -.05), 0.);
  float bm = 0.;
  for (int i = 0; i < 5; i++) { vec4 bw = uBandWin[i]; bm += smoothstep(bw.x - 1.3, bw.x + 1.3, bh.z) * (1. - smoothstep(bw.y - 1.3, bw.y + 1.3, bh.z)) * smoothstep(bw.z - 1.3, bw.z + 1.3, bh.y) * (1. - smoothstep(bw.w - 1.3, bw.w + 1.3, bh.y)); }
  diffuseColor.rgb *= mix(vec3(1.), mix(uBandShade, uBandLit, clamp(bm, 0., 1.)), uBandK);
}
`;function Dt(t,e){const r=t.onBeforeCompile,n=t.customProgramCacheKey;return t.onBeforeCompile=(a,o)=>{r.call(t,a,o),Object.assign(a.uniforms,e),a.fragmentShader=a.fragmentShader.replace("#include <common>",`#include <common>
`+rt).replace("#include <alphamap_fragment>",it.replace(".3 * v2",".12 * v2").replace(".1 * v3",".03 * v3")+Ut+ct+`
#include <alphamap_fragment>`)},t.customProgramCacheKey=()=>n.call(t)+":veins",t}function Gt(t,e){const r=t.onBeforeCompile,n=t.customProgramCacheKey;return t.onBeforeCompile=(a,o)=>{r.call(t,a,o),Object.assign(a.uniforms,e),a.fragmentShader=a.fragmentShader.replace("#include <common>",`#include <common>
uniform vec3 uTileCol; uniform vec3 uAccCol; uniform vec4 uSpill; uniform vec4 uSpillCol; uniform float uSpillT; `+rt).replace("#include <alphamap_fragment>",it+Et+ct+`
#include <alphamap_fragment>`)},t.customProgramCacheKey=()=>n.call(t)+":inlay",t}const q=(t,e,r)=>"#"+new u.Color(t).lerp(new u.Color(e),r).getHexString(),w0=X.surf(X.SURF.STONE,.55),ce=X.surf(X.SURF.PLAIN,.05),P0=X.surf(X.SURF.WOOD,.45),ae=X.surf(X.SURF.WOOD,.2),x0=X.surf(X.SURF.PLAIN,.72,1),n0=X.surf(X.SURF.PLAIN,.8,1),le=X.surf(X.SURF.PLAIN,.4,.75),g0=X.surf(X.SURF.PLAIN,.85),$0=X.surf(X.SURF.FABRIC,.04),R0=X.surf(X.SURF.PLAIN,.1),W0=X.surf(X.SURF.PLAIN,.9),he=[1,.55,1,1],Oe=[1,.78,0,1],Wt=[1,.5,0,1],lt=X.surf(X.SURF.PLAIN,.6,1);function It(t,e){const r={add(n,a={}){return a.surf===x0?e.add(n,{...a,surf:he}):a.surf===n0?e.add(n,{...a,surf:Oe}):a.surf===lt?e.add(n,{...a,surf:Wt}):t.add(n,a),r},quad(n,a,o,l,b,B){return t.quad(n,a,o,l,b,B),r}};return r}function $(t,e,r,n=.12){const a=new u.BoxGeometry(t,e,r,3,3,3),o=a.attributes.position,l=a.attributes.normal,b=t/2,B=e/2,F=r/2;n=Math.min(n,b*.49,B*.49,F*.49);const L=(c,S)=>Math.abs(c)>S*.5?Math.sign(c)*S:Math.sign(c)*(S-n);for(let c=0;c<o.count;c++){const S=L(o.getX(c),b),h=L(o.getY(c),B),k=L(o.getZ(c),F),N=T0(S,-(b-n),b-n),R=T0(h,-(B-n),B-n),O=T0(k,-(F-n),F-n),z=S-N,G=h-R,W=k-O,D=Math.hypot(z,G,W)||1;o.setXYZ(c,N+z/D*n,R+G/D*n,O+W/D*n),l.setXYZ(c,z/D,G/D,W/D)}return a.deleteAttribute("uv"),a}const b0=(t,e,r)=>{const n=new u.BoxGeometry(t,e,r);return n.deleteAttribute("uv"),n};function Be(t=5.4,e=6.6,r=2.3){const n=new u.Shape;n.moveTo(0,0),n.lineTo(t,0),n.lineTo(t,-.9),n.quadraticCurveTo(t*.86,-e*.66,t*.34,-e*.8),n.quadraticCurveTo(t*.2,-e*.84,t*.2,-e),n.lineTo(0,-e),n.lineTo(0,0);const a=new u.ExtrudeGeometry(n,{depth:r,bevelEnabled:!1,curveSegments:5});return a.translate(0,0,-r/2),a.deleteAttribute("uv"),a}const J=(t,e=14)=>{const r=new u.LatheGeometry(t.map(n=>new u.Vector2(Math.max(n[0],.001),n[1])),e);return r.deleteAttribute("uv"),r},u0=(t,e,r,n=10,a=!1)=>{const o=new u.CylinderGeometry(t,e,r,n,1,a);return o.deleteAttribute("uv"),o},V0=(t,e=10,r=7)=>{const n=new u.SphereGeometry(t,e,r);return n.deleteAttribute("uv"),n},_0=(t,e,r=6,n=16,a=B0)=>{const o=new u.TorusGeometry(t,e,r,n,a);return o.deleteAttribute("uv"),o};function ee(t,e,r,n=!0,a=!0){const o=[],l=[],b=[],B=new i0;for(let c=0;c<t;c++)for(let S=0;S<e;S++){const h=r(c,S/e*B0,B)??1;o.push(B.x,B.y,B.z),l.push(h,h,h)}for(let c=0;c+1<t;c++)for(let S=0;S<e;S++){const h=c*e+S,k=c*e+(S+1)%e,N=h+e,R=k+e;b.push(h,N,k,k,N,R)}const F=(c,S,h)=>{let k=0,N=0,R=0,O=0;for(let G=0;G<e;G++){const W=(c*e+G)*3;k+=o[W],N+=o[W+1],R+=o[W+2],O+=l[W]}const z=o.length/3;o.push(k/e,N/e+h,R/e),l.push(O/e,O/e,O/e);for(let G=0;G<e;G++){const W=c*e+G,D=c*e+(G+1)%e;S?b.push(z,W,D):b.push(z,D,W)}};n&&F(0,!0,0),a&&F(t-1,!1,typeof a=="number"?a:0);const L=new u.BufferGeometry;return L.setAttribute("position",new u.Float32BufferAttribute(o,3)),L.setAttribute("color",new u.Float32BufferAttribute(l,3)),L.setIndex(b),L.computeVertexNormals(),L}const Ge=[0,.02,.07,.15,.25,.33,.396,.4,.45,.454,.476,.48,.49,.494,.56,.64,.71,.77,.82,.855,.875,.9,.94,1],ut=t=>t>.398&&t<.452||t>.478&&t<.492,$t=Le([0,.02,.08,.22,.5,.7,.82,.865,.9,.94,1],[.7,.86,.96,1,.93,.78,.5,.3,.36,.5,.6]);function ft(t={}){const e=t.h??5,r=t.r??1.9,n=t.seg??26,a=t.lean??.3,o=t.phase??0,l=t.gathers??9,b=t.leanDir??0;return ee(Ge.length,n,(B,F,L)=>{const c=Ge[B],S=.04+.5*F0(.5,.86,c),h=Math.pow(.5+.5*Math.cos(l*F+o+2.2*c),2),k=1+.09*Math.cos(F-b)*(1-c)+.05*Math.cos(4*F+o)*(1-c)+.035*Math.sin(3*F-o*2+c*5)*F0(0,.2,c),N=r*$t(c)*(1-.6*S*h)*k*(1+.03*Math.sin(c*31+F*2+o)*F0(.05,.4,c)*(1-F0(.6,.8,c))),R=a*c*c*e*.16;return L.set(Math.cos(F)*N+Math.cos(b)*R,c*e+(c>.87?.035*e*Math.sin(l*.5*F+o)*(c-.87)/.13:0)-.02*e*F0(.3,0,c)*Math.max(0,Math.cos(F-b))*0,Math.sin(F)*N+Math.sin(b)*R),(1-.75*S*h)*(.72+.28*F0(0,.12,c))*(c>.99?.5:1)},!0,-.07*e)}function se(t,e,r){const n=new u.InstancedBufferGeometry;n.index=t.index;for(const a in t.attributes)n.setAttribute(a,t.attributes[a]);for(const a in r)n.setAttribute(a,new u.InstancedBufferAttribute(r[a][0],r[a][1]));return n.instanceCount=e,n}const me=()=>{const t=new u.BufferGeometry;return t.setAttribute("position",new u.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),t.setIndex([0,1,2,0,2,3]),t},Zt=[{name:"tea",load:"tea",band:1,sunDir:[-.86,.34,-.38],sunColor:"#ffdfab",sunI:9.5,beams:1,ambSky:"#94a3b8",ambGround:"#c4aa88",amb:.78,fill:3,bounce:2,fog:"#8f8e8c",fogD:.0013,skyTop:"#A9C4DC",skyLow:"#e6e6de",wallSun:1,plaster:"#d9a654",accent:Ae,lift:.85,exposure:.98,tint:"#fff8ee",shadowTint:"#0a1222",sat:1.1,saucer:null,wall:"#c5c5c1",vault:"#aab2be",walnut:"#4c362b",copper:h0,ware:[1,.86,.74],heroSun:[2.25,1.92,1.46],heroSky:.62,heroFill:"#272f39",heroBounce:"#64503a",window:9,rays:1.15,rayCol:"#ffe6bd",raySoft:1.3,street:.92,rug:["#8c2a22","#1d2f5c","#e2d3ae","#c08a2c"],fruit:"#e6c21c"},{name:"milk",load:"milk",sunDir:[-.88,.27,-.38],sunColor:"#ffd29a",sunI:8.6,beams:.9,ambSky:"#aebccf",ambGround:"#b2b4b8",amb:.66,fill:3.4,bounce:1.3,fog:"#a2a9b1",fogD:.0014,lift:1,skyTop:"#cfd8e0",skyLow:"#eef0ee",wallSun:.6,plaster:"#d2b486",accent:"#e8b21c",exposure:1,tint:"#f4f7ff",shadowTint:"#101a2e",sat:.98,saucer:"#6f8196",wall:"#c3c8ce",vault:"#b7bcc6",walnut:"#3a2e2a",copper:h0,ware:[.8,.8,.83],heroSun:[2.1,1.8,1.36],heroSky:.68,heroFill:"#343f4e",heroBounce:"#4c4a48",window:9.5,rays:1.25,rayCol:"#ffe2b8",raySoft:3.2,street:1,rug:["#3c4c68","#6c727e","#e6e3da","#c9a23a"],fruit:"#e8c020"},{name:"sherbet",load:"sherbet",sunDir:[-.91,.21,-.37],sunColor:"#ffb884",sunI:14.5,beams:1,ambSky:"#6e73ac",ambGround:"#8c7482",amb:.5,fill:2,bounce:1.2,fog:"#655e7a",fogD:.0014,skyTop:"#b9b6cf",skyLow:"#f0cdb6",wallSun:1,plaster:"#e09a5c",accent:"#c2283a",lift:.8,exposure:1.02,tint:"#fff3ea",shadowTint:"#120c28",sat:1.14,saucer:null,wall:"#b4adc2",vault:"#b6afc4",walnut:"#4a342b",copper:h0,ware:[1,.84,.74],heroSun:[2.7,1.7,1.1],heroSky:.46,heroFill:"#1f2238",heroBounce:"#4c3636",window:8,rays:.8,rayCol:"#ffc296",raySoft:1.3,street:.9,rug:["#5a1c46","#16305e","#e8d2b8","#c8862c"],fruit:"#a01c2c"}],k0={w:22,y0:10.8,y1:28.8,r:11};async function Xt(t,e,r,n,a,o){const l=r.wall,b=q(oe,"#000000",.2),B=q(b,"#a09684",.5),F=q(r.walnut,"#9a6a3c",.5),L=q(r.walnut,"#b88a58",.62),c="#d8d5cd",S=q(n,"#ffffff",.2),h=q(n,"#000000",.25),k=X.makeBuilder();k.quad([U,0,m0],[Q,0,m0],[Q,0,K],[U,0,K],"#ffffff"),k.tessellate(13),await t.yield();const N=X.interiorMaterial({rig:e,pattern:"floor",mode:3,colors:[q("#efe7d6","#000000",.27),q("#e2d2b4","#000000",.27),q("#8c8274","#3a4048",.3),"#a8772c"],patA:[.5,.0045,0,.5],patB:[.7,0,0,0]}),R=new u.Mesh(k.build(),N);R.name="floor",await t.yield();const O=X.makeBuilder(),z=(y,v,f,d,M)=>O.quad([y,M,f],[v,M,f],[v,M,d],[y,M,d],"#ffffff");z(12,30,e0.z0,e0.z1,18.008),z(5.4,30.6,e0.z0+.6,e0.z1-.6,10.808),z(-12.7,12.7,-384.65,K,10.808),O.tessellate(11),await t.yield();const G=X.interiorMaterial({rig:e,pattern:"floor",mode:3,colors:[q("#ece4d4","#000000",.4),q("#ddd0b8","#000000",.42),q("#8c8274","#3a4048",.4),"#a8772c"],patA:[.5,.0045,0,.6],patB:[.7,0,0,0]});G.polygonOffset=!0,G.polygonOffsetFactor=-2,G.polygonOffsetUnits=-2,pe(N),pe(G),Gt(N,o),Dt(G,{uBandSun:o.uBandSun,uBandWin:o.uBandWin,uBandShade:o.uBandShade,uBandLit:o.uBandLit,uBandK:o.uBandK});const W=new u.Mesh(O.build(),G);W.name="tops",await t.yield();const D=X.makeBuilder(),g=X.makeBuilder(),H=y=>q(l,r.vault,.85*F0(9,40,y)),a0=(y,v,f,d,M,p,x,A)=>{const m=Math.max(f,d),T=Math.min(f,d);v>0?D.quad([y,M,m],[y,M,T],[y,p,T],[y,p,m],x,A):D.quad([y,M,T],[y,M,m],[y,p,m],[y,p,T],x,A)},i=(y,v,f,d,M,p)=>{const x=[0,8,16,24,31,38,Q0].filter(m=>m>M&&m<p),A=[M,...x,p];for(let m=0;m+1<A.length;m++)a0(y,v,f,d,A[m],A[m+1],H((A[m]+A[m+1])/2),ce)},s=[[m0,J0[0][0]]];for(let y=0;y<J0.length;y++)s.push([J0[y][1],y+1<J0.length?J0[y+1][0]:K]);for(const[y,v]of s){i(U,1,y,v,0,Q0);const f=Math.abs(y-v);if(f<40&&f>12){const d=(y+v)/2,M=Math.min(14,f-4);if(g.add($(1.6,34,M,.3),{p:[U+.8,21,d],c:b,surf:w0,grad:[8,38,1,.62]}),g.add($(2.6,3.2,M+3,.4),{p:[U+1.3,1.6,d],c:B,surf:w0}),g.add($(2.4,1.4,M+2.4,.3),{p:[U+1.2,37.4,d],c:q(b,r.vault,.4),surf:w0}),g.add($(3.2,1,M+4,.3),{p:[U+1.6,38.6,d],c:q(b,r.vault,.4),surf:w0}),await t.yield(),f>20){for(const[p,x,A,m]of[[9.2,.7,0,11.4],[19.2,.7,0,11.4],[14.2,9.3,-5.35,.7],[14.2,9.3,5.35,.7]])g.add(b0(.5,x,m),{p:[U+1.75,p,d+A],c:n,surf:g0});for(let p=0;p<4;p++)for(let x=0;x<4;x++){const A=(p===1||p===2)&&(x===1||x===2);g.add(b0(.36,2.2,2.38),{p:[U+1.72,10.75+x*2.3,d-3.75+p*2.5],c:A?S:q("#000000",c,.82+.18*((p*3+x*5)%4/3)),surf:g0})}g.add($(.9,.9,.9,.2),{p:[U+1.9,14.2,d],r:[j/4,0,0],c:h,surf:g0}),await t.yield(),a.add(u0(.13,.13,11,6),{p:[U+2.5,22.4,d],r:[j/2,0,0],c:"#d2a84e",surf:Oe});for(let p=0;p<5;p++){const x=d-4.4+p*2.2,A=1.6+p%2*.9,m=.75+p*7%3*.22;a.add(u0(.07,.07,A,5),{p:[U+2.5,22.4-A/2,x],c:h0,surf:he});const T=J([[.02,0],[m*.7,.04],[m,.4],[m*1.04,.5],[m*.94,.3],[m*.6,.14]],12);T.rotateZ(-j/2),a.add(T,{p:[U+2.2,22.4-A-m,x],c:p%2?"#c9a24e":h0,surf:p%2?Oe:he})}await t.yield(),g.add($(2.6,.5,12,.15),{p:[U+2.4,26.2,d],c:b,surf:w0});for(const p of[-1,1])g.add(Be(2.2,2.4,.7),{p:[U+1.6,25.95,d+p*4.6],c:B,surf:w0});for(let p=0;p<4;p++){const x=d-4.2+p*2.8,A=.85+p*5%3*.14;p%2?a.add(J([[.02,0],[.8,0],[1.05,.5],[.95,1.5],[.55,2.1],[.45,2.5],[.6,2.62],[.02,2.66]],12),{p:[U+2.5,26.45,x],s:A,c:h0,surf:he}):g.add(J([[.02,0],[.7,0],[1.1,.7],[1,1.7],[.5,2.2],[.55,2.5],[.02,2.5]],12),{p:[U+2.5,26.45,x],s:A,c:p?"#e2ddd2":n,surf:W0})}}else for(let p=-1;p<=1;p++)g.add($(.7,22,1,.2),{p:[U+1.75,20,d+p*2.8],c:q(b,"#ffffff",.2),surf:w0})}await t.yield()}for(const[y,v]of J0){const f=(y+v)/2,d=y-v,M=Math.round(d/14);i(U,1,y,v,0,8),i(U,1,y,v,38,Q0),D.quad([U,8,y],[U-3,8,y],[U-3,38,y],[U,38,y],l,ce),D.quad([U,8,v],[U,38,v],[U-3,38,v],[U-3,8,v],l,ce),D.quad([U,38,y],[U-3,38,y],[U-3,38,v],[U,38,v],l,ce),D.quad([U-3,8,y],[U,8,y],[U,8,v],[U-3,8,v],b,w0),g.add($(2.6,.9,d+3,.25),{p:[U+.6,7.75,f],c:b,surf:w0}),g.add($(1.4,1.6,d+2,.3),{p:[U+.5,38.9,f],c:q(b,r.vault,.4),surf:w0}),await t.yield();const p="#2c3a40";for(let A=0;A<=M;A++)g.add($(.9,30,A%M?.7:1.3,.12),{p:[U-1.5,23,y-A/M*d+(A===0?-.6:A===M?.6:0)],c:p,surf:R0});for(let A=0;A<=3;A++)g.add($(.9,A%3?.7:1.3,d,.12),{p:[U-1.5,8+A*10+(A===0?.6:A===3?-.6:0),f],c:p,surf:R0});g.add($(6,.9,d-4,.3),{p:[U+3.2,4.6,f],c:b,surf:w0});const x=Math.max(2,Math.round(d/18));for(let A=0;A<x;A++)g.add($(4.6,4.2,1.6,.35),{p:[U+2.6,2.1,y-5-A*(d-10)/(x-1)],c:B,surf:w0});await t.yield()}g.add($(.5,.5,m0-K,.15),{p:[U+.3,6.2,(m0+K)/2],c:n,surf:g0}),i(Q,-1,m0,K,24,Q0);const C=9;for(let y=m0,v=0;y>K;y-=C,v++)for(let f=0;f<4;f++){const d=.8+.2*((v*7+f*13)%5/4),M=f===0?q(ke,"#3c4650",.35):q(c,r.vault,f*.12);D.quad([Q,f*6,Math.max(y-C,K)],[Q,f*6,y],[Q,f*6+6,y],[Q,f*6+6,Math.max(y-C,K)],q("#000000",M,d),g0)}await t.yield(),g.add($(.5,1.4,m0-K,.15),{p:[Q-.2,24.4,(m0+K)/2],c:n,surf:g0}),g.add($(.4,.5,m0-K,.12),{p:[Q-.2,12,(m0+K)/2],c:n,surf:g0}),g.add($(.4,.5,m0-K,.12),{p:[Q-.2,6.1,(m0+K)/2],c:h,surf:g0});for(let y=m0-3,v=0;y>K+2;y-=4.5,v++)g.add(b0(.3,1.5,1.5),{p:[Q-.12,14.1,y],r:[j/4,0,0],c:v%2?n:S,surf:g0});await t.yield();for(const[y,v]of[[0,14],[14,28],[28,Q0]])D.quad([Q,y,m0],[U,y,m0],[U,v,m0],[Q,v,m0],H((y+v)/2),ce);{const y=new u.Shape;y.moveTo(U,0),y.lineTo(Q,0),y.lineTo(Q,Q0),y.lineTo(U,Q0),y.lineTo(U,0);const v=new u.Path,f=k0.y1-k0.r;v.moveTo(-k0.r,k0.y0),v.lineTo(-k0.r,f),v.absarc(0,f,k0.r,j,0,!0),v.lineTo(k0.r,k0.y0),v.lineTo(-k0.r,k0.y0),y.holes.push(v);const d=new u.ShapeGeometry(y,20);d.deleteAttribute("uv"),D.add(d,{p:[0,0,K],c:l,surf:ce,tint:(m,T,V,E)=>E.set(H(T))}),await t.yield();const M=26,p=(m,T)=>{const V=m/M;if(V<.2)return[-T,p0(k0.y0,f,V/.2)];if(V>.8)return[T,p0(f,k0.y0,(V-.8)/.2)];const E=j-(V-.2)/.6*j;return[Math.cos(E)*T,f+Math.sin(E)*T]};for(let m=0;m<M;m++){const T=p(m,k0.r),V=p(m+1,k0.r);D.quad([T[0],T[1],K],[V[0],V[1],K],[V[0],V[1],K-4],[T[0],T[1],K-4],m%2?"#e2dfd6":"#d2d0c8",g0);const E=Math.atan2(V[1]-T[1],V[0]-T[0]),o0=Math.hypot(V[0]-T[0],V[1]-T[1]),r0=p(m+.5,k0.r+.75),C0=p(m+.5,k0.r+3.2),y0=p(m+.5,k0.r+5.55);g.add(b0(o0*1.03,1.4,.5),{p:[r0[0],r0[1],K+.25],r:[0,0,E],c:m%2?"#e9e6dd":"#dcd9d0",surf:g0}),g.add(b0(o0*1.2,3.3,.8),{p:[C0[0],C0[1],K+.4],r:[0,0,E],c:m%2?n:S,surf:g0}),g.add(b0(.7,.7,.3),{p:[C0[0],C0[1],K+.86],r:[0,0,E+j/4],c:"#e9e6dd",surf:g0}),g.add(b0(o0*1.4,1.1,.5),{p:[y0[0],y0[1],K+.25],r:[0,0,E],c:"#e9e6dd",surf:g0}),(m&3)===3&&await t.yield()}const x=k0.r+6.3,A=2.6;for(let m=-8;m<8;m++)for(let T=0;T<10;T++){T===0&&(m&3)===0&&await t.yield();const V=(m+.5)*A,E=11.9+(T+.5)*A,o0=Math.max(E-f,0);if(Math.abs(V)<x&&(E<f||Math.hypot(V,o0)<x))continue;const C0=((m*5+T*3)%11+11)%11===0;g.add(b0(A-.14,A-.14,.3),{p:[V,E,K+.15],c:C0?S:q("#000000",c,.8+.2*(((m*7+T*13)%5+5)%5)/4),surf:g0})}g.add(b0(42.6,.8,.5),{p:[0,38.3,K+.25],c:n,surf:g0});for(const m of[-1,1])g.add(b0(.8,27.2,.5),{p:[m*21.2,25.1,K+.25],c:n,surf:g0});await t.yield(),a.add($(24,.6,5.4,.25),{p:[0,k0.y0+.1,K-1.6],c:h0,surf:he}),a.add(u0(.5,.5,24,10),{p:[0,k0.y0+.25,K+1.15],r:[0,0,j/2],c:h0,surf:he});for(const m of[-1,1])for(let T=0;T<3;T++){const V=m*(17.5+T*1.1),E=m*(T%2?.5:-.5),o0=K+1.2+T*.5,r0=q("#8fae9f","#6f9186",.35*T),C0=q("#b4cdbd","#93b3a4",.35*T);g.add($(3.6,17,.5,.15),{p:[V,19.5,o0],r:[0,E,0],c:r0,surf:R0});for(const y0 of[-1.55,1.55])g.add(b0(.5,17,.3),{p:[V+y0*Math.cos(E),19.5,o0+.3-y0*Math.sin(E)],r:[0,E,0],c:C0,surf:R0});for(const y0 of[11.3,19.5,27.7])g.add(b0(2.7,.6,.3),{p:[V,y0,o0+.3],r:[0,E,0],c:C0,surf:R0});for(let y0=0;y0<9;y0++)y0!==4&&g.add(b0(2.7,1,.22),{p:[V,12.6+y0*1.72,o0+.32],r:[.55,E,0],c:y0%2?"#a9c6b6":"#9dbcad",surf:R0});T===0&&a.add(_0(.42,.09,5,12),{p:[V-m*1.1,18.2,o0+.75],r:[0,E,0],c:"#c9a04a",surf:Oe})}}await t.yield();const w=Math.round((m0-K)/29),P=(m0-K)/w,_=8;for(let y=0;y<w;y++){const v=m0-y*P;for(let f=0;f<_;f++){const d=v-f/_*P,M=v-(f+1)/_*P,p=38.5+4.5*Math.sin(j*f/_),x=38.5+4.5*Math.sin(j*(f+1)/_),A=q("#000000",r.vault,.84+.13*Math.sin(j*(f+.5)/_)+.03*((f+y)%2));for(let m=0;m<3;m++){const T=U+m/3*(Q-U),V=U+(m+1)/3*(Q-U);D.quad([T,p,d],[T,x,M],[V,x,M],[V,p,d],A,ce)}}y&&(g.add($(Q-U,3.4,2.6,.4),{p:[(U+Q)/2,38.2,v],c:F,surf:ae}),g.add($(Q-U-12,.7,3.2,.2),{p:[(U+Q)/2,36.4,v],c:q(F,"#c89a5c",.3),surf:ae}),g.add(Be(),{p:[U,36.5,v],c:L,surf:ae}),g.add(Be(),{p:[Q,36.5,v],r:[0,j,0],c:L,surf:ae})),(y&3)===3&&await t.yield()}return await t.yield(),D.tessellate(14),await t.yield(),g.tessellate(16,3.5),{floor:R,tops:W,wb:D,tb:g}}const Kt=`
varying vec3 vW;
void main() { vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,Yt=`
uniform float uTime; uniform vec3 uPlaster; uniform vec3 uSkyTop; uniform vec3 uSkyLow; uniform vec3 uSun; uniform vec4 uP;   // uP: axis (0 = z, 1 = x), wash, sun amount, gain
varying vec3 vW;
float h21(vec2 p) { p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm(vec2 p) { return .5 * vn(p) + .25 * vn(p * 2.03 + 7.) + .125 * vn(p * 4.1 + 13.) + .0625 * vn(p * 8.3 + 3.); }
float box(vec2 p, vec2 c, vec2 h, float s) { vec2 d = abs(p - c) - h; return 1. - smoothstep(0., s, max(d.x, d.y)); }
void main() {
  float a = mix(vW.z, vW.x, uP.x), y = vW.y;
  float eave = 58. + 3. * step(.5, fract(a / 190. + .2));
  // sky
  float sv = clamp((y - 40.) / 70., 0., 1.);
  vec3 sky = mix(uSkyLow, uSkyTop, smoothstep(0., .8, sv));
  sky = mix(sky, vec3(.95, .95, .93), .32 * smoothstep(.45, .8, fbm(vec2(a * .012 + uTime * .006, y * .03))));
  // plaster wall
  vec3 col = uPlaster * (.82 + .3 * fbm(vec2(a, y) * .07) + .08 * vn(vec2(a, y) * .9));
  col *= 1. - .25 * (1. - smoothstep(0., 8., y)) - .12 * smoothstep(50., 58., y);                      // damp foot, shade under the eave
  float house = floor(a / 95. + .3); col *= .9 + .2 * h21(vec2(house, 3.));                      // house fronts differ
  col = mix(col, col * vec3(.82, .9, 1.04), step(.6, h21(vec2(house, 9.))) * .5);
  // windows: shuttered, stone frames, three floors
  vec2 c = vec2((floor(a / 19.) + .5) * 19., 0.);
  for (int f = 0; f < 3; f++) {
    float cy = 14. + float(f) * 15.;
    float fr = box(vec2(a, y), vec2(c.x, cy), vec2(4.2, 5.6), .25), gl = box(vec2(a, y), vec2(c.x, cy), vec2(3.4, 4.8), .2);
    float lou = .75 + .25 * step(.5, fract(y * 1.3));
    vec3 sh = mix(vec3(.16, .25, .26), vec3(.05, .07, .09), step(.55, h21(vec2(floor(a / 19.), float(f)))));
    col = mix(col, vec3(.72, .68, .6), fr * .8); col = mix(col, sh * lou, gl);
    col *= 1. - .3 * box(vec2(a, y), vec2(c.x + 1., cy - 6.6), vec2(4.6, .9), 1.2);              // sill shadow
  }
  // the dark timber bay on brackets
  float bz = (floor(a / 152. + .35) + .5 - .35) * 152.;
  float bay = box(vec2(a, y), vec2(bz, 31.), vec2(13., 9.), .3);
  vec3 tim = vec3(.085, .06, .045) * (.8 + .5 * vn(vec2(a * 3., y * .3)));
  tim = mix(tim, vec3(.03, .05, .07), box(vec2(mod(a - bz + 13., 6.5), y), vec2(3.25, 32.), vec2(2., 4.8), .2));
  tim = mix(tim, vec3(.2, .13, .08), step(.9, fract(y * .45)) * .5);
  col = mix(col, tim, bay);
  col *= 1. - .45 * box(vec2(a, y), vec2(bz + 2., 19.5), vec2(14., 2.8), 2.5);                  // its shadow below
  // plane-tree shadow: big soft leaf masses that sway, with flickering gaps
  float sway = sin(uTime * .9 + a * .02) * 4.5 + sin(uTime * 1.4 + y * .05) * 2.;
  float leaf = fbm(vec2(a + sway, y - sway * .5) * .05 + vec2(0., uTime * .01));
  float fine = vn(vec2(a + sway * 1.6, y + sway) * .42 + uTime * .12);
  float shade = smoothstep(.42, .6, leaf + .16 * (fine - .5)) * (1. - smoothstep(30., 64., y)) * (.55 + .45 * sin(a * .011 + 1.));
  vec3 lit = col * (uSun * uP.z + vec3(.36, .42, .52));
  vec3 shd = col * vec3(.3, .36, .5);
  col = mix(lit, shd, clamp(shade, 0., 1.) * uP.z + (1. - uP.z) * .0);
  // tiled eave and roof, chimney
  float roof = smoothstep(eave - 1.2, eave - .6, y);
  vec3 tiles = vec3(.42, .2, .13) * (.7 + .5 * step(.5, fract(a * .55 + floor(y * .9) * .5))) * (uSun * .5 * uP.z + .45);
  col = mix(col, tiles, roof);
  float cz = (floor(a / 118.) + .5) * 118. + 21.;
  float chim = box(vec2(a, y), vec2(cz, eave + 9.), vec2(2.6, 6.), .3);
  float top = smoothstep(eave + 6.5 + 1.5 * sin(a * .08), eave + 7.5 + 1.5 * sin(a * .08), y);
  col = mix(col, sky, top);
  col = mix(col, vec3(.3, .2, .16) * (uSun * .6 * uP.z + .5), chim);
  // smoke drawn DOWN into the chimney: a plume whose pattern flows toward its root
  vec2 sp = vec2(a - cz - (y - eave - 15.) * .55, y - eave - 15.);
  float plume = smoothstep(0., 4., sp.y) * (1. - smoothstep(10., 42., sp.y)) * (1. - smoothstep(1.5 + sp.y * .32, 3.5 + sp.y * .42, abs(sp.x + 2.5 * sin(sp.y * .16 + uTime * .5))));
  plume *= .35 + .65 * fbm(vec2(sp.x * .2, sp.y * .13 + uTime * .55));
  col = mix(col, vec3(.74, .74, .76), plume * .55);
  float mist = fbm(vec2(a * .018 + uTime * .16, y * .05 - uTime * .035));
  col = mix(col, vec3(.8, .82, .84), (1. - uP.z) * .6 * smoothstep(.3, .68, mist));               // overcast: mist drifting down the street
  col = mix(col, vec3(.86, .88, .9), uP.y);                                                      // haze of the street
  gl_FragColor = vec4(max(col * uP.w, 0.), 1.);
}`;function Ht(t,e){const r=new u.Group;r.name="street";const n=(B,F,L)=>new u.ShaderMaterial({vertexShader:Kt,fragmentShader:Yt,side:u.DoubleSide,uniforms:{uTime:e,uPlaster:{value:new u.Color(t.plaster)},uSkyTop:{value:new u.Color(t.skyTop)},uSkyLow:{value:new u.Color(t.skyLow)},uSun:{value:new u.Color(t.sunColor).multiplyScalar(1.15)},uP:{value:new u.Vector4(B,F,t.wallSun,L)}}}),a=new u.Mesh(new u.PlaneGeometry(700,190),n(0,.1,t.street));a.rotation.y=j/2,a.position.set(U-34,65,-200);const o=new u.Mesh(new u.PlaneGeometry(420,190),n(1,.34,.8*t.street));o.position.set(0,65,K-52);const l=new u.Mesh(new u.PlaneGeometry(1,1),new u.MeshBasicMaterial({color:new u.Color("#8d8a84").multiplyScalar(.55+.25*t.wallSun)}));l.rotation.x=-j/2,l.scale.set(160,760,1),l.position.set(U-60,-1.5,-230);const b=l.clone();return b.scale.set(420,70,1),b.position.set(0,k0.y0-14,K-30),r.add(a,o,l,b),r}const e0={x0:6,x1:30,z0:-40,z1:-290,top:10.8},M0={x0:12,x1:30,top:18},ye=-280,j0={x:18,h:7.6,r:3.2,off:3.1,hm:7.5},Ve=(t,e)=>e.set(j0.x,M0.top+j0.hm*Math.cos(t)+j0.off*Math.sin(t),ye+j0.off+j0.hm*Math.sin(t)-j0.off*Math.cos(t)),dt=j/2-.1,vt=t=>9*(1-T0((t-.447)/.189,0,1)),Qt=t=>9*(1-T0((t-.447)/.189,-.28,1)),pt=t=>dt*F0(3,5,t);function We(t,e,r,n,a,o,l,b,B){const F=new u.Matrix4().makeRotationY(a).setPosition(e,r,n),L=[o,o,o],c=q(l,"#1a0f0a",.62),S=q(l,"#ffd0a0",.28),h="#c9a24e";t.add(J([[.05,0],[.98,0],[1.08,.05],[1.1,.14],[1.2,.22],[1.31,.55],[1.27,1.05],[1.08,1.5],[.8,1.78],[.7,1.86],[.7,1.9]],16),{s:L,pre:F,c:l,surf:x0,tint:(N,R,O,z,G,W)=>z.multiplyScalar(W<.3?.36+1.7*W:.9+.22*Math.sin((W-.3)*2.1))}),t.add(J([[.72,1.9],[.74,1.96],[.6,2.02],[.3,2.12],[.1,2.16],[.02,2.16]],16),{s:L,pre:F,c:S,surf:x0}),t.add(_0(.71,.035,3,14),{p:[0,1.9*o,0],r:[j/2,0,0],s:L,pre:F,c,surf:x0}),t.add(_0(1.3,.04,3,14),{p:[0,.62*o,0],r:[j/2,0,0],s:L,pre:F,c:S,surf:x0}),t.add(J([[.02,0],[.1,.02],[.17,.12],[.2,.2],[.1,.3],[.02,.32]],8),{p:[0,2.14*o,0],s:L,pre:F,c:h,surf:n0});const k=new u.TubeGeometry(new u.QuadraticBezierCurve3(new i0(1.1,.72,0),new i0(1.78,.86,0),new i0(2.04,1.78,0)),7,.17,7,!1);k.deleteAttribute("uv"),t.add(k,{s:L,pre:F,c:l,surf:x0,tint:(N,R,O,z,G,W)=>z.multiplyScalar(W>1.66?.5:1)}),t.add(_0(.24,.05,3,8),{p:[1.2*o,.76*o,0],r:[0,j/2,.25],s:L,pre:F,c,surf:x0}),t.add(_0(.85,.075,5,12,j*1.15),{p:[-.25*o,1.9*o,0],r:[0,0,-.08],s:L,pre:F,c:"#2a211c",surf:le});for(const[N,R]of[[.6,1.9],[-1,1.52]])for(const O of[-.11,.11])t.add(V0(.085,5,3),{p:[N*o,R*o,O*o],s:L,pre:F,c:h,surf:n0});b&&b.push([e,r+.04,n,2.3*o,.62]),B&&B.push([e,r+.06,n,3.6*o,.5])}function Jt(t,e,r,n){const[a,o,l]=e,b="#a4843a",B="#6a5122",F="#d0ae5a",L=(c,S,h,k,N,R,O)=>{const z=R>2&&R<2.26||R>4.14&&R<4.4||R>1.18&&R<1.3;k.multiplyScalar(z?.5:.84+.24*Math.sin(R*2.2+1)),z&&Math.sin(Math.atan2(O,N)*14)>.15&&k.multiplyScalar(1.7)};t.add($(3.3,.5,3.3,.14),{p:[a,o+.25,l],c:B,surf:n0});for(const[c,S]of[[-1,-1],[1,-1],[1,1],[-1,1]])t.add(V0(.3,6,4),{p:[a+c*1.3,o+.2,l+S*1.3],c:F,surf:n0});t.add(J([[.02,.5],[1.25,.5],[1.25,.72],[.8,.9],[.62,1.25],[.9,1.5],[1.5,1.8],[1.74,2.7],[1.78,4],[1.6,4.7],[1.15,5.15],[1.2,5.3],[1,5.42],[.72,5.55],[.62,6.1],[.8,6.2],[.8,6.32],[.3,6.5],[.02,6.52]],20),{p:[a,o,l],c:b,surf:n0,tint:L}),t.add(_0(1.2,.07,4,18),{p:[a,o+5.3,l],r:[j/2,0,0],c:F,surf:n0}),t.add(_0(1.79,.06,4,18),{p:[a,o+3.25,l],r:[j/2,0,0],c:F,surf:n0});for(const c of[-1,1]){const S=_0(.62,.085,5,10,j);S.rotateZ(j/2),S.rotateY(c*j/2),t.add(S,{p:[a,o+3.7,l+c*1.72],c:B,surf:n0}),t.add(u0(.15,.15,.72,7),{p:[a,o+3.7,l+c*2.34],c:"#24170f",surf:ae})}t.add(u0(.13,.17,1.2,7),{p:[a-2.1,o+2,l],r:[0,0,j/2],c:F,surf:n0}),t.add(u0(.11,.08,.5,6),{p:[a-2.55,o+1.8,l],c:F,surf:n0}),t.add(u0(.05,.05,.5,5),{p:[a-2.3,o+2.3,l],c:B,surf:n0}),t.add(_0(.2,.05,4,8),{p:[a-2.3,o+2.7,l],c:B,surf:n0}),r&&r.push([a,o+.04,l,3.4,.66]),n&&n.push([a,o+.06,l,5.2,.45])}function Te(t,e,r,n,a,o,l,b,B){t.add(J([[.02,0],[a*.96,0],[a,.08],[a*1.03,.42],[a*1.07,.46],[a*1,.5],[a*.96,.4]],22),{p:[e,r,n],c:h0,surf:x0}),t.add(u0(a*.965,a*.965,.06,16),{p:[e,r+.36,n],c:o,surf:X.surf(0,.55),tint:(F,L,c,S)=>{const h=(F-e)*1.6+(c-n)*.9,k=(F-e)*-.9+(c-n)*1.6,N=Math.abs((h%1+1)%1-.5)<.08||Math.abs((k%1+1)%1-.5)<.08?.5:1;S.multiplyScalar(N*(.85+.3*Math.sin(F*3.1+c*1.7)*.5))}});for(let F=0;F<l;F++){const L=b()*B0,c=Math.sqrt(b())*a*.86;t.add(V0(.16,5,3),{p:[e+Math.cos(L)*c,r+.41,n+Math.sin(L)*c],s:[1,.45,1],c:X0,surf:R0})}B.push([e,r+.04,n,a*1.5,.6])}async function eo(t,e,r,n,a,o,l){const b=n.walnut,B=q(n.walnut,"#8a5a34",.3),F=q(n.walnut,"#000000",.3),L=q(oe,"#000000",.3),c="#d2a84e",S=(e0.x0+e0.x1)/2,h=(e0.z0+e0.z1)/2,k=e0.z0-e0.z1,N=e0.x1-e0.x0;e.add($(N+.4,.9,k+.4,.15),{p:[S,.45,h],c:F,surf:ae}),e.add($(N,8.9,k,.2),{p:[S,5.3,h],c:b,surf:P0}),e.add($(N+.5,.35,k+.5,.1),{p:[S,9.78,h],c:B,surf:P0}),e.add($(N+1.2,.9,k+1.2,.3),{p:[S,10.35,h],c:L,surf:w0});const R=Math.round(k/8),O=k/R;for(let i=0;i<R;i++){i&&(i&3)===0&&await t.yield();const s=e0.z0-(i+.5)*O,C=e0.x0-.12,w=.1+.16*r();if(e.add(b0(.5,9.1,.7),{p:[C-.05,5.3,s+O/2],c:F,surf:P0}),e.add($(.36,1.9,O-1.3,.12),{p:[C,8.3,s],c:q(b,"#8a5a34",w+.12),surf:P0}),e.add(J([[.02,0],[.26,.04],[.3,.18],[.14,.3],[.1,.42],[.02,.44]],6),{p:[C-.1,8.3,s],r:[0,0,j/2],c,surf:n0}),i%5===2){e.add($(.3,5.4,O-1.3,.1),{p:[C+.5,4,s],c:q(b,"#000000",.22),surf:ae});for(const P of[2.5,4.4])e.add(b0(.3,.22,O-1.5),{p:[C+.32,P,s],c:B,surf:P0});e.add(J([[.02,0],[1.6,0],[2.3,.6],[2.5,1.5],[2.6,1.55],[2.4,.5],[1.6,.12]],14),{p:[C-1.4,.95,s],c:h0,surf:x0})}else for(const P of[-1,1]){const _=s+P*(O-1.3)/4;e.add($(.36,5.4,(O-1.6)/2,.12),{p:[C,4,_],c:q(b,"#8a5a34",w),surf:P0}),e.add(b0(.3,3.8,(O-1.6)/2-1.3),{p:[C-.16,4,_],c:q(b,"#8a5a34",w+.2),surf:P0}),e.add(V0(.2,5,3),{p:[C-.35,5.2,s+P*.4],c,surf:n0})}}await t.yield(),e.add(u0(.11,.11,k-6,6),{p:[e0.x0-1,9.1,h],r:[j/2,0,0],c,surf:n0});for(let i=0;i<9;i++){const s=e0.z0-12-i*(k-24)/8;if(s<-122&&s>-150)continue;e.add(u0(.09,.09,1,5),{p:[e0.x0-.5,9.1,s-3.5],r:[0,0,j/2],c,surf:n0});const C=new u.PlaneGeometry(2.6,3.4,4,6);C.deleteAttribute("uv"),C.rotateY(j/2);const w=i%2?"#a23a34":a;e.add(C,{p:[e0.x0-1.12,7.4,s],c:"#b9b3a4",surf:$0,sway:[5.7,9.1,1,0],tint:(P,_,y,v)=>{const f=_-5.7;(f>.3&&f<.5||f>.7&&f<.8)&&v.set(w),v.multiplyScalar(.9+.1*Math.sin(y*5))}})}for(const[i,s]of[[e0.z0,1],[e0.z1,-1]])for(let C=0;C<4;C++){const w=e0.x0+3+C*6;e.add($(5,5.4,.36,.12),{p:[w,4,i+s*.12],c:q(b,"#8a5a34",.14+.08*(C&1)),surf:P0}),e.add($(3.6,3.9,.3,.14),{p:[w,4,i+s*.26],c:q(b,"#8a5a34",.3),surf:P0}),e.add($(5,1.9,.36,.1),{p:[w,8.3,i+s*.12],c:q(b,"#8a5a34",.24),surf:P0}),e.add(J([[.02,0],[.26,.04],[.3,.18],[.14,.3],[.1,.42],[.02,.44]],8),{p:[w,8.3,i+s*.3],r:[s*j/2,0,0],c,surf:n0})}await t.yield();const z=(M0.x0+M0.x1)/2;e.add($(M0.x1-M0.x0,.8,k,.2),{p:[z,M0.top-.4,h],c:L,surf:w0}),e.add($(.3,.3,k,.1),{p:[M0.x0+.2,M0.top-.95,h],c:"#9a7a3a",surf:n0});const G=[[.02,0],[.5,0],[.5,.3],[.3,.5],[.22,.9],[.3,1.2],[.2,1.5],[.2,4.6],[.3,4.9],[.22,5.2],[.3,5.5],[.48,5.75],[.48,5.9],[.02,5.9]];for(let i=0;i<=14;i++)for(const s of[M0.x0+.8,M0.x1-.8])e.add(J(G,7),{p:[s,e0.top,e0.z0-i/14*k],s:[1,6.4/5.9,1],c,surf:n0});e.add(u0(.1,.1,k,6),{p:[M0.x1-.5,M0.top+1.3,h],r:[j/2,0,0],c,surf:n0});for(let i=0;i<=28;i++)e.add(u0(.07,.07,1.3,5),{p:[M0.x1-.5,M0.top+.65,e0.z0-i/28*k],c,surf:n0});await t.yield();for(let i=0;i<26;i++){const s=e0.z0-6-r()*(k-12),C=26.3+r()*2.4;if(!(Math.abs(s+165)<14||Math.abs(s-ye)<12))if(r()<.6){const w=3+Math.floor(r()*7);for(let P=0;P<w;P++)e.add(J([[.02,0],[.5,0],[.82,.1],[.86,.15],[.5,.07]],9),{p:[C+(r()-.5)*.06,M0.top+P*.11,s+(r()-.5)*.06],c:P%3?"#e8e3d8":n.accent===Ae?"#a23a34":n.accent,surf:W0})}else e.add(J([[.02,0],[.5,0],[.56,.1],[.9,.5],[.95,.95],[.88,1],[.8,.6],[.4,.2]],12),{p:[C,M0.top,s],c:"#e8e3d8",surf:W0}),e.add(J([[.02,0],[.86,0],[.6,.3],[.14,.42],[.16,.56],[.02,.6]],12),{p:[C,M0.top+.98,s],c:a,surf:W0})}await t.yield();{let i=.4137;const s=()=>(i=(i*7919.31+.2137)%1,i),C=n.accent===Ae?"#a23a34":n.accent,w="#e8e3d8",P=(M,p,x,A)=>{const m=[[.02,0],[.5,0]];for(let T=0;T<A;T++)m.push([.84,T*.11+.1],[.87,T*.11+.16],[.58,T*.11+.14]);m.push([.02,A*.11+.05]),e.add(J(m,10),{p:[M,p,x],c:w,surf:W0,tint:(T,V,E,o0)=>{const r0=Math.floor((V-p-.05)/.11);r0>=0&&r0%3===1&&o0.set(C)}}),o.push([M,p+.04,x,1.4,.5])},_=(M,p,x,A)=>{e.add(J([[.02,0],[.5,0],[.56,.1],[.9,.5],[.95,.95],[.88,1],[.8,.6],[.4,.2]],12),{p:[M,p,x],c:w,surf:W0,tint:(m,T,V,E)=>{Math.abs(T-p-.72)<.07&&E.set(a)}}),A?e.add(J([[.84,.78],[.6,.98],[.3,1.1],[.02,1.14]],9),{p:[M,p,x],c:A,surf:R0,tint:(m,T,V,E)=>E.multiplyScalar(.75+.5*Math.abs(Math.sin(m*23.1+V*17.7)))}):e.add(J([[.02,0],[.86,0],[.6,.3],[.14,.42],[.16,.56],[.02,.6]],10),{p:[M,p+.98,x],c:a,surf:W0}),o.push([M,p+.04,x,1.5,.5])},y=(M,p,x,A)=>e.add($(2.6,.3,1.9,.12),{p:[M,p+.15,x],r:[0,A,0],c:"#d9d2c0",surf:$0,tint:(m,T,V,E,o0)=>{Math.abs(Math.abs(o0)-.8)<.14&&E.set(C)}}),v=(M,p,x,A,m,T)=>{e.add($(A,.3,m,.1),{p:[M,p+.15,x],r:[0,T,0],c:q(oe,"#000000",.16),surf:X.surf(X.SURF.STONE,.12)});const V=new u.PlaneGeometry(A*.72,m*.7,6,6);V.deleteAttribute("uv"),V.rotateX(-j/2),e.add(V,{p:[M+.2,p+.33,x-.2],r:[0,T+.08,0],c:"#eadfb9",surf:R0,tint:(E,o0,r0,C0)=>C0.multiplyScalar(.9+.1*Math.sin(E*2.1)*Math.sin(r0*1.7))}),e.add(u0(.12,.12,Math.max(A,m)*1.08,6),{p:[M-.3,p+.5,x+.3],r:[j/2,T+.55,0],c:"#7a5232",surf:P0})},f=M0.top,d=e0.top;v(19.5,f,-272.6,7.4,6.4,0),o.push([j0.x,f+.04,ye,4.3,.7]);for(const[M,p,x]of[[15.2,-284,6],[19.3,-286.3,8],[22.6,-284.2,5],[23.4,-279.6,7],[24.6,-270.6,4],[16.2,-264.6,6],[21.2,-262.8,3]])P(M,f,p,x);for(const[M,p,x]of[[16.7,-285.8,0],[21.5,-287.8,X0],[24.5,-276.6,0],[23.9,-266.5,X0],[15,-262.2,0]])_(M,f,p,x);y(24.6,f,-283.2,.3);for(let M=-184;M>-259;M-=6.2){const p=16+s()*7.5,x=s(),A=M-s()*2.5;if(x<.4?P(p,f,A,3+Math.floor(s()*6)):x<.66?_(p,f,A,s()<.4?X0:0):x<.82?y(p,f,A,s()*3):Te(e,p,f,A,1.5+s()*.5,"#c98a2c",7,s,o),s()<.55){const m=p+(p>20?-3:3)+s();s()<.6?P(m,f,A-1.2,2+Math.floor(s()*5)):_(m,f,A-1.4,0)}}await t.yield(),v(9,d,-247,4.2,7,.06),Te(e,9,d,-186,1.9,"#c98a2c",8,s,o),Te(e,9.2,d,-263.5,2,"#d2a04a",8,s,o),Te(e,8.9,d,-283,2.2,"#c98a2c",9,s,o);for(const[M,p,x]of[[8.2,-193.5,5],[8.4,-211,7],[10.3,-210.2,4],[8.3,-269.5,6],[10.4,-270.6,3],[10.3,-288.2,5],[8.6,-226.6,4]])P(M,d,p,x);for(const[M,p,x]of[[10.2,-195.6,0],[9.4,-276.2,X0],[7.9,-287.4,0],[10.2,-224.5,X0],[9.6,-172.5,0]])_(M,d,p,x);y(8.6,d,-199.5,1.3),y(9.3,d,-253.3,.2),y(10.1,d,-150.5,.25),P(8.2,d,-157,4),P(10.3,d,-163.6,3),P(8.4,d,-179.5,5);for(const[M,p,x]of[[22.6,-160.5,5],[24.3,-158.2,3],[22.4,-168.3,6],[27.2,-156.3,7],[27.5,-161,4],[27.4,-172.6,5],[26.8,-176.4,3],[16.4,-150.2,6],[18.6,-148.6,4],[25.2,-152.4,5],[21.6,-173.4,4],[15.4,-144.2,3]])P(M,f,p,x);for(const[M,p,x]of[[23.2,-163.8,0],[24.6,-170.4,X0],[27,-167.2,0],[20.6,-150.8,0],[17.2,-146.4,X0],[21.8,-155.6,0]])_(M,f,p,x);y(25.6,f,-164.6,.4),y(23.4,f,-149.5,.5),P(7.6,d,-160.4,4),P(8.9,d,-167.4,6),_(10.4,d,-169.6,0),_(7.8,d,-153.2,X0),P(9.9,d,-154.8,3)}await t.yield();const W=[-47,-60,-92,-108,-204,-232,-256],D=[];W.forEach((i,s)=>{const C=8.8+s%2*.5,w=2.4+r()*1.2,P=1.5+.2*r();We(e,C,e0.top,i,w,P,q(h0,"#e08a50",r()*.4),o,l),D.push([C+Math.cos(w)*2*P,e0.top+1.8*P,i-Math.sin(w)*2*P,s<3?2.4:1.2])});const g=[9,e0.top,-218];Jt(e,g,o,l),e.add(J([[.02,0],[.5,0],[.9,.3],[1,.7],[1.05,.75],[.9,.3],[.5,.08]],12),{p:[g[0]-2.7,g[1],g[2]],c:"#e8e3d8",surf:W0}),e.add(J([[.02,0],[.55,0],[.75,.4],[.6,.9],[.3,1.05],[.1,1.2],[.02,1.22]],12),{p:[g[0],g[1]+6.45,g[2]],c:"#e8e3d8",surf:W0,tint:(i,s,C,w)=>{Math.abs(s-g[1]-6.9)<.12&&w.set(a)}}),await t.yield();const H="#c98a2c",a0=[[-74,20],[-100,17],[-118,24],[-200,19],[-232,23],[-276,18],[-86,26],[-212,26]];for(let i=0;i<a0.length;i++){const[s,C]=a0[i];Te(e,C,e0.top,s,3+i%3*.5,i%2?H:q(H,"#e0b060",.5),Math.round(22*n.density),r,o),i&1&&await t.yield()}for(const[i,s]of[[-126,26],[-184,25],[-246,25],[-270,26]])e.add(J([[.02,0],[1.4,0],[1.5,.15],[1.5,2],[1.62,2.1],[1.45,2.1],[1.4,.2]],14),{p:[s,e0.top,i],c:h0,surf:x0}),e.add(u0(1.42,1.42,.05,14),{p:[s,e0.top+1.75,i],c:n.accent,surf:X.surf(0,.9,0,.15)}),e.add(u0(.07,.07,3.6,5),{p:[s-.9,e0.top+2.7,i],r:[0,0,.45],c,surf:n0}),o.push([s,e0.top+.04,i,2.6,.6]);e.add(J([[.02,0],[.9,0],[1,.2],[.7,.5],[.8,.8],[1.2,2],[1.3,2.1],[1.1,2],[.7,.9]],14),{p:[9.2,e0.top,-238],c,surf:n0}),e.add(u0(.16,.24,3,7),{p:[9.5,e0.top+2.4,-238],r:[0,0,-.3],c,surf:n0}),await t.yield();for(const i of[-156,-176]){e.add($(8,.5,11,.15),{p:[21.5,e0.top+.25,i],c:q(oe,"#000000",.18),surf:X.surf(X.SURF.STONE,.15)}),e.add(u0(.12,.12,12.5,6),{p:[21,e0.top+.75,i+1],r:[j/2,.5,0],c:B,surf:P0});const s=new u.PlaneGeometry(6.4,8.6,6,8);s.deleteAttribute("uv"),s.rotateX(-j/2),e.add(s,{p:[21.6,e0.top+.56,i-.5],c:"#e9dcb4",surf:R0,tint:(C,w,P,_)=>_.multiplyScalar(.9+.1*Math.sin(C*2.1)*Math.sin(P*1.7))})}e.add(J([[.02,0],[.9,0],[1.1,.2],[2,.8],[2.2,1.3],[2.1,1.3],[1.8,.8],[.9,.25]],14),{p:[9.5,e0.top,-124],c:"#e8e3d8",surf:W0,tint:(i,s,C,w)=>{s>e0.top+1.05&&w.set(a)}});for(let i=0;i<9;i++){const s=i*2.4,C=i<6?1:.3;e.add(V0(.62,9,7),{p:[9.5+Math.cos(s)*C,e0.top+(i<6?1.3:2.1),-124+Math.sin(s)*C],s:[1,.86,1.2],r:[0,s,0],c:q("#e9c81c","#f0d860",r()),surf:X.surf(0,.45)})}await t.yield();{const i=(s,C,w,P,_,y)=>{const v=new u.Color(q("#c9a56c","#a98a58",r())),f=new u.Color(y),d=r()*B0,M=r()*B0;e.add(ft({h:w,r:P,lean:_,leanDir:d,phase:r()*6,gathers:8+Math.floor(r()*4)}),{p:[s,0,C],r:[0,M,0],surf:$0,tint:(p,x,A,m,T,V)=>{const E=m.r;m.copy(ut(V/w)?f:v).multiplyScalar(E*(.93+.07*Math.sin(V*23+T*3)))}}),e.add(_0(P*.33,.07,5,14),{p:[s+Math.cos(d-M)*_*w*.12,w*.866,C-Math.sin(d-M)*_*w*.12],r:[j/2,0,0],c:"#7a6a4a",surf:R0}),o.push([s,.05,C,P*1.5,.6])};i(-6,-3,5.4,2.05,.5,"#3d5a8a"),i(-10,-8.5,4.5,1.85,.9,"#a23a34"),await t.yield(),i(39.5,-12,5,1.95,.6,"#a23a34"),i(42,-5.5,4.2,1.7,1,"#3d5a8a"),await t.yield();for(const[s,C,w,P]of[[-13.5,-13.5,"#4f6a2c",.3],[-15.6,-16.2,"#b98a24",-.2]])e.add($(1.7,2.5,1.7,.14),{p:[s,1.25,C],r:[0,P,0],c:w,surf:X.surf(0,.6,.6),tint:(_,y,v,f)=>{y>.8&&y<1.9&&f.set("#d9cfa8"),Math.abs(y-1.35)<.18&&f.set("#7a2a22")}}),e.add(u0(.22,.22,.24,8),{p:[s+.45,2.6,C+.45],c,surf:n0}),e.add(_0(.4,.05,4,10,j),{p:[s-.15,2.5,C-.15],r:[0,P,0],c,surf:n0}),o.push([s,.05,C,1.7,.6]);{e.add(J([[.02,0],[2,0],[2.5,.35],[2.85,.9],[3,1.5],[3.12,1.62],[3,1.72],[2.8,1.5],[2.5,.6],[2,.25]],20),{p:[35,0,-6],c:"#9a7440",surf:$0,tint:(w,P,_,y)=>y.multiplyScalar(.72+.34*Math.abs(Math.sin(P*11))*(.8+.2*Math.sin(Math.atan2(_- -6,w-35)*22+Math.floor(P*3.5)*1.6)))});for(let w=0;w<13;w++){const P=w*2.4,_=w<8?1.75:w<12?.8:0;e.add(V0(.66,10,8),{p:[35+Math.cos(P)*_,w<8?1:w<12?1.75:2.35,-6+Math.sin(P)*_],s:[1,.86,1.22],r:[.3*Math.sin(w),P,0],c:q("#e9c81c","#f0d860",r()),surf:X.surf(0,.45)})}o.push([35,.05,-6,4.2,.6])}await t.yield(),e.add(J([[.02,0],[2.2,0],[2.9,.5],[3.3,1.4],[3.45,2.6],[3.4,3.05],[3.6,3.2],[3.66,3.32],[3.5,3.36],[3.3,3],[3.1,1.2],[2.3,.3],[.02,.26]],24),{p:[37.5,0,1],c:q(h0,"#e08a50",.3),surf:x0}),e.add(u0(.12,.12,6.4,6),{p:[39.5,3.6,1],r:[0,0,-.5],c,surf:n0});for(const s of[-1,1])e.add(_0(.55,.1,5,10),{p:[37.5,2.9,1+s*3.55],r:[0,j/2,0],c:"#2a211c",surf:le});o.push([37.5,.05,1,4.6,.65]),We(e,24.5,e0.top,-47.5,.4,1.7,q(h0,"#e08a50",.3),o,l),D.push([24.5+Math.cos(.4)*3.4,e0.top+3.06,-47.5-Math.sin(.4)*3.4,2.4]),D.push([37.2,3.3,1.4,2.2])}return We(e,-26.4,5.05,-52,.5,1.7,q(h0,"#e08a50",.3),o,l),D.push([-26.4+Math.cos(.5)*3.4,5.05+3.06,-52-Math.sin(.5)*3.4,2.3]),D.push([g[0],g[1]+7.7,g[2],1.3]),{SAM:g,spouts:D}}const s0={x0:10,x1:18,z0:-300,z1:-385,lo:8,hi:16,top:24},z0={x0:-12,x1:12,z0:-385,z1:K,top:10.8},Ie=[-398,-413.5,-429,-444.5],de={z:-458.2,at:[...Array(8).keys()].map(t=>[-6.3+1.8*t,-456.8]).concat([...Array(7).keys()].map(t=>[-5.4+1.8*t,-459.6]))};async function to(t,e,r,n,a,o,l,b){const B=a.walnut,F=q(a.walnut,"#8a5a34",.3),L=q(oe,"#000000",.3),c="#d2a84e",S="#15171a",h="#4d545e",k="#6c747f",N=X.surf(X.SURF.PLAIN,.55,.3),R=[-18,-112,-206,-300,-394];for(const[i,s]of R.entries()){e.add($(4.5,30,24,.5),{p:[Q-2.2,15,s],c:"#d3d0c8",surf:g0,grad:[2,30,1,.68]}),e.add($(5.5,1.6,26,.4),{p:[Q-2.6,30.4,s],c:L,surf:w0}),e.add($(3.4,12,16,.6),{p:[Q-1.6,37,s],c:q(a.wall,a.vault,.7),surf:ce});for(let w=0;w<9;w++){const P=j*(w+.5)/9;e.add(b0(.7,2.6,2.75),{p:[Q-4.5,9.5+Math.sin(P)*8.2,s+Math.cos(P)*8.2],r:[j/2-P,0,0],c:w%2?o:"#e9e6dd",surf:g0})}const C=u0(7,7,.7,24,!1);C.rotateZ(j/2),e.add(C,{p:[Q-4.5,9.5,s],c:h,surf:N,tint:(w,P,_,y)=>y.multiplyScalar(.8+.035*(P-2.5))}),e.add($(.8,9.5,14,.2),{p:[Q-4.5,4.75,s],c:h,surf:N,tint:(w,P,_,y)=>y.multiplyScalar(.8+.035*Math.max(P-2.5,0))});for(const[w,P]of[[2.6,13.4],[6.4,13.4],[12.2,12.6]])e.add($(.5,.6,P,.15),{p:[Q-5.1,w,s],c:k,surf:N});e.add($(.45,15.6,.55,.15),{p:[Q-5.08,8.3,s],c:k,surf:N}),e.add(_0(3.3,.2,5,24,j),{p:[Q-5,12.5,s],r:[0,j/2,0],c:k,surf:N});for(const w of[-1,1])e.add(J([[.02,.42],[.45,.36],[.8,.14],[.9,0]],10),{p:[Q-4.86,9.3,s+w*3.3],r:[0,0,j/2],c:"#c9a24e",surf:n0});for(let w=0;w<10;w++)e.add(V0(.3,6,4),{p:[Q-5,2+w%5*3.1,s+(w<5?-6:6)],c:"#7d848e",surf:N});e.add(u0(.22,.22,4.4,7),{p:[Q-5.6,8.6,s+3.2],c,surf:n0}),e.add($(6.5,.8,20,.25),{p:[Q-3.2,.4,s],c:L,surf:w0}),await t.yield();{const w=i===R.length-1,P=w?-438:s-47,_=w?50:62,y=w?6:7;e.add(u0(.16,.16,_,6),{p:[Q-1.6,22,P],r:[j/2,0,0],c:S,surf:le});for(let v=0;v<y;v++){const f=P+(_/2-4)-v*(_-8)/(y-1)+n()*2,d=2+n()*1.6,M=21.6-d-1.4,p=[M-d,22,1,0],x=q(h0,"#e08a50",n()*.5),A=Q-1.25,m=J([[.02,0],[d*.8,0],[d*.88,.07],[d*.99,.6],[d*1.02,.72]],16);m.rotateZ(j/2),r.add(m,{p:[A,M,f],c:x,surf:x0,sway:p});const T=J([[.02,.1],[d*.25,.1],[d*.5,.1],[d*.72,.11],[d*.8,.16],[d*.9,.5],[d*.985,.72]],16);T.rotateZ(j/2),r.add(T,{p:[A,M,f],c:"#6a6460",surf:lt,sway:p,tint:(E,o0,r0,C0)=>{const y0=Math.hypot(o0-M,r0-f)/d;C0.multiplyScalar(y0<.2?.75:y0<.4?1.15:y0<.6?.8:y0<.76?1.1:.6)}});const V=_0(d*1.01,.085+d*.012,4,18);V.rotateY(j/2),r.add(V,{p:[A-.74,M,f],c:q(x,"#ffd0a0",.45),surf:x0,sway:p}),r.add(b0(.12,2.3,.55),{p:[A-.5,M+d+.95,f],c:S,surf:le,sway:p}),r.add(_0(.3,.07,5,10),{p:[A-.5,M+d+2.15,f],r:[0,j/2,0],c:S,surf:le,sway:p}),l.push([Q-.07,M-.5,f+.75,d*1.45,-.5]),b.push([Q-.1,M,f,d*2.7,-.55]),v&1&&await t.yield()}await t.yield(),e.add($(2.8,.5,_-6,.15),{p:[Q-1.5,9.2,P],c:L,surf:w0});for(let v=0;v<4;v++)e.add(Be(2.4,2.6,.7),{p:[Q,8.95,P+(_/2-6)-v*(_-12)/3],r:[0,j,0],c:q(L,ke,.5),surf:w0});for(let v=0;v<9;v++){const f=P+(_/2-5)-v*(_-10)/8+n()*1.2,d=.9+n()*.5;v%3===1?e.add(J([[.02,0],[.8,0],[1.2,.8],[1.1,1.9],[.6,2.4],[.6,2.7],[.02,2.7]],10),{p:[Q-1.6,9.45,f],s:d,c:v%2?"#e2ddd2":o,surf:W0}):e.add(J([[.02,0],[.9,0],[1.25,.5],[1.15,1.6],[.7,2.2],[.5,2.8],[.68,2.95],[.02,3]],10),{p:[Q-1.6,9.45,f],s:d,c:q(h0,"#e08a50",n()*.5),surf:x0})}}await t.yield()}for(const[i,[s,C]]of J0.entries()){const w=Math.round(6*a.density*(s-C)/70);for(let P=0;P<w;P++){const _=s-6-(P+n()*.6)*(s-C-12)/w,y=U+3.2+(n()-.5)*1.6;if(n()<.55){const v=3.6+n()*1.2,f=new u.Color(q("#b3a88e","#9c8f72",n())),d=new u.Color(i%2?"#a23a34":"#3d5a8a");e.add(ft({h:v,r:1.75,seg:12,lean:.3+n()*.6,leanDir:n()*B0,phase:n()*6,gathers:7+Math.floor(n()*3)}),{p:[y,5.05,_],r:[0,n()*3,0],surf:$0,tint:(M,p,x,A,m,T)=>{const V=A.r;A.copy(ut(T/v)?d:f).multiplyScalar(V*(.93+.07*Math.sin(T*23+m*3)))}})}else{const v=n()<.5?"#4f6a2c":"#b98a24";e.add($(2,3,2,.14),{p:[y,6.55,_],r:[0,n()*.6,0],c:v,surf:X.surf(0,.6,.6),tint:(f,d,M,p)=>{d>6.2&&d<7.3&&p.set("#d9cfa8")}}),e.add(u0(.3,.3,.4,8),{p:[y+.5,8.2,_+.5],c,surf:n0})}}await t.yield()}for(const i of[-1,1]){const s=V0(1,10,6);s.scale(.75,.42,1.7),e.add(s,{p:[U+9,.4,-128+i*1.1],r:[0,j/2+i*.12,0],c:"#7a2630",surf:$0}),e.add(u0(.72,.8,.14,10),{p:[U+10.2,.5,-128+i*1.1],s:[1.1,1,1],c:"#d9cfb8",surf:$0})}{const s=new u.PlaneGeometry(5.2,9,6,10);s.deleteAttribute("uv"),s.rotateY(j/2),r.add(s,{p:[U+2.5,15.5,-225],c:"#bdb7a8",surf:$0,sway:[11,20,1,0],tint:(C,w,P,_)=>{const y=1.3+(20-w)*.16;Math.abs(w-12.2)<.25&&_.set(o),_.multiplyScalar(.92+.08*Math.sin(P*4+w))}}),e.add(u0(.14,.14,1.6,6),{p:[U+2.2,20,-225],r:[0,0,j/2],c,surf:n0})}await t.yield();const O=s0.z0-s0.z1,z=(s0.z0+s0.z1)/2,G=(s0.x0+s0.x1)/2,W=q(a.walnut,"#8a5a34",.42),D=q(a.walnut,"#a06c40",.62);for(let i=0;i<=5;i++){const s=s0.z0-i/5*O,C=i===0||i===5;if(e.add($(1,25.4,1,.16),{p:[s0.x1-.5,12.7,s],c:W,surf:P0}),C){e.add($(1,25.4,1,.16),{p:[s0.x0+.5,12.7,s],c:W,surf:P0});for(const w of[3.4,11.6,19.6])e.add($(7,.7,.7,.12),{p:[G,w,s],c:D,surf:P0});e.add(V0(.75,8,6),{p:[s0.x0+.5,25.8,s],c,surf:n0})}else for(const w of[s0.lo,s0.hi,s0.top])e.add($(7.6,.7,.6,.12),{p:[G+.2,w-.95,s],c:W,surf:P0});if(i<5)for(const w of[-1,1])e.add($(.3,.6,19.5,.1),{p:[s0.x1-.3,12,s-O/10],r:[w*.44,0,0],c:W,surf:ae})}e.add($(1,25.4,1,.16),{p:[s0.x0+.5,12.7,z],c:W,surf:P0}),e.add(V0(.75,8,6),{p:[s0.x0+.5,25.8,z],c,surf:n0});for(let i=0;i<10;i++)e.add($(.3,16.9,O/10-.12,.08),{p:[s0.x1-.2,15.55,s0.z0-(i+.5)*O/10],c:q(a.walnut,"#140b07",.5+.08*(i%3)),surf:ae});await t.yield();for(const i of[1.2,s0.lo-.3,s0.hi-.3,s0.top-.3])e.add($(8.4,.6,O+1.4,.15),{p:[G,i,z],c:D,surf:P0}),e.add($(.2,.3,O+1.4,.06),{p:[s0.x0-.3,i+.1,z],c:"#9a7a3a",surf:n0});await t.yield();for(let i=0;i<8;i++){const s=s0.z0-6-i*10.5;b.push([s0.x0-2.5,.07,s,5.5,.4]),e.add(J([[.02,0],[2,0],[2.7,.8],[2.9,2.6],[3.1,2.7],[2.8,2.4],[2.6,.9],[2,.2]],14),{p:[G,1.5,s],s:.8+n()*.35,c:q(h0,"#e08a50",n()*.5),surf:x0})}for(let i=0;i<12;i++){const s=s0.z0-4-i*7;e.add(J([[.02,0],[1.4,0],[1.8,.4],[1.7,1.9],[1.9,2],[1.6,1.9],[1.5,.4]],10),{p:[G+n()-.5,s0.top,s],s:[1,.7+n()*.6,1],c:i%3?"#b99a62":q(h0,"#e08a50",.3),surf:i%3?$0:x0})}await t.yield();const g=z0.z0-z0.z1,H=(z0.z0+z0.z1)/2;e.add($(24,9.8,g,.3),{p:[0,4.9,H],c:L,surf:w0}),e.add($(25.4,1,g+.7,.3),{p:[0,z0.top-.5,H+.35],c:q(oe,"#000000",.26),surf:w0}),e.add($(24.8,1.2,g+.4,.2),{p:[0,.6,H+.2],c:q(L,ke,.5),surf:w0});for(let i=0;i<6;i++){const s=-10+i*4;e.add($(3.4,6.4,.3,.14),{p:[s,5.2,z0.z0+.12],c:q(oe,"#000000",.22),surf:w0}),e.add(b0(1.5,1.5,.3),{p:[s,5.2,z0.z0+.3],r:[0,0,j/4],c:i%2?o:q(o,"#ffffff",.25),surf:g0})}for(const i of[-1,1])for(let s=0;s<10;s++){const C=z0.z0-4.2-s*8.4;e.add(b0(.3,6.4,7),{p:[i*12.12,5.2,C],c:q(oe,"#000000",.22),surf:w0}),e.add(b0(.3,1.5,1.5),{p:[i*12.3,5.2,C],r:[j/4,0,0],c:s%2?o:q(o,"#ffffff",.25),surf:g0})}await t.yield();for(const i of Ie){const s=J([[.02,.1],[5.4,.1],[5.7,.2],[6,.55],[6.1,.6],[5.9,.3],[5.4,.22],[.02,.22]],48),C=s.attributes.position;for(let w=0;w<C.count;w++){const P=C.getX(w),_=C.getZ(w);if(Math.hypot(P,_)>5.5){const v=1+.035*Math.cos(Math.atan2(_,P)*16);C.setX(w,P*v),C.setZ(w,_*v)}}e.add(s,{p:[0,z0.top,i],c:h0,surf:x0,tint:(w,P,_,y)=>{const v=Math.hypot(w,_-i);y.multiplyScalar(.8+.25*Math.sin(v*3.9)*(v<5.3?1:0)+.12*Math.sin(w*7+_*5))}}),l.push([0,z0.top+.05,i,8.6,.72])}e.add($(15.4,.22,6.4,.1),{p:[0,z0.top+.11,de.z],c:h0,surf:x0,tint:(i,s,C,w)=>w.multiplyScalar(.82+.2*Math.sin(i*2.6)*Math.sin(C*2.9)+.1*Math.sin(i*9+C*7))});for(const i of[-3.2,3.2])e.add(u0(.2,.2,15.4,8),{p:[0,z0.top+.32,de.z+i],r:[0,0,j/2],c:h0,surf:x0});for(const i of[-7.7,7.7])e.add(u0(.2,.2,6.4,8),{p:[i,z0.top+.32,de.z],r:[j/2,0,0],c:h0,surf:x0}),e.add(_0(.7,.12,5,12),{p:[i+Math.sign(i)*.75,z0.top+.36,de.z],r:[j/2,0,0],c:"#c9a04a",surf:n0});l.push([0,z0.top+.05,de.z,7.4,.6]),b.push([0,z0.top+.06,de.z+4.4,5.5,.5]);const a0=[];for(let i=0;i<5;i++)for(const s of[-1,1]){const C=Ie[0]+7.75-i*15.5,w=s*8.9;if(!(i===0&&s>0)){e.add(J([[.02,0],[1.2,0],[1.3,.5],[2.3,.75],[2.45,.9],[2.3,.86],[1.2,.62]],16),{p:[w,z0.top,C],c:"#e8e3d8",surf:W0,tint:(P,_,y,v)=>{Math.hypot(P-w,y-C)>2.2&&v.set(o)}});for(let P=0;P<9;P++){const _=P*.7,y=P<6?1.1:.4;e.add(b0(1,.5,.7),{p:[w+Math.cos(_*1.5)*y,z0.top+1.05+(P<6?0:.5),C+Math.sin(_*1.5)*y],r:[0,_+j/4,0],c:q("#c98a2c","#e0b060",n()),surf:X.surf(0,.6)}),e.add(V0(.14,5,3),{p:[w+Math.cos(_*1.5)*y,z0.top+1.34+(P<6?0:.5),C+Math.sin(_*1.5)*y],c:X0,surf:R0})}l.push([w,z0.top+.05,C,3.6,.6]),a0.push([w,z0.top+.85,C])}}await t.yield();for(const[i,s]of[[U,-21.5],[21.5,Q]]){const C=Math.round((s-i)/3.2),w=(s-i)/C;for(let P=0;P<C;P++)for(let _=0;_<3;_++)e.add(b0(w-.12,3.4,.35),{p:[i+(P+.5)*w,1.9+_*3.52,K+.18],c:q("#000000","#e2dfd6",.84+.16*((P*5+_*3)%4/3)),surf:g0});e.add($(s-i,.9,.6,.15),{p:[(i+s)/2,11.2,K+.3],c:o,surf:g0})}for(const i of[15.5,23.5]){e.add($(21,.5,3,.15),{p:[35,i,K+1.6],c:F,surf:P0});for(const s of[26,35,44])e.add($(.5,2.2,2.4,.15),{p:[s,i-1.3,K+1.3],r:[.5,0,0],c:B,surf:P0});for(let s=0;s<6;s++){const C=26.5+s*3.4+n()*.6,w=.8+n()*.5;s%2?e.add(J([[.02,0],[1.2,0],[1.5,.5],[1.3,1.5],[.9,2],[.5,2.1],[.02,2.1]],14),{p:[C,i+.25,K+1.7],s:w,c:q(h0,"#e08a50",n()*.5),surf:x0,tint:(P,_,y,v)=>v.multiplyScalar(.85+.2*Math.sin(Math.atan2(y-K-1.7,P-C)*10))}):e.add(J([[.02,0],[.9,0],[1.3,.6],[1.2,1.6],[.6,2.2],[.5,2.6],[.7,2.7],[.02,2.75]],12),{p:[C,i+.25,K+1.7],s:w,c:s%4?"#e8e3d8":o,surf:W0})}}e.add(u0(.12,.12,7.5,6),{p:[-25.5,21,K+.9],r:[0,0,j/2],c:S,surf:le});for(let i=0;i<4;i++){const s=-28.4+i*1.9,C=5+i%2*1.2;r.add(u0(.09,.09,C,5),{p:[s,21-C/2,K+.9],c,surf:n0,sway:[21-C-1,21,1,0]}),r.add(J([[.02,0],[.5,.05],[.75,.4],[.8,.7],[.72,.45],[.45,.14]],10),{p:[s,21-C-.6,K+.9],r:[1.2,0,0],c:i%2?h0:c,surf:x0,sway:[21-C-1,21,1,0]})}return{domes:a0}}const te="#include <fog_pars_vertex>",ne="#include <fog_pars_fragment>",je=`
  vec4 wp = modelMatrix * vec4(P, 1.); vL = wp.xyz + vec3(0., 0., ${(-G0).toFixed(1)}); vN = N; vView = cameraPosition - wp.xyz;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>`,$e=`
vec3 rod(vec3 k, float a, vec3 v) { float c = cos(a), s = sin(a); return v * c + cross(k, v) * s + k * dot(k, v) * (1. - c); }`,oo=`
uniform float uTime; uniform vec3 uWareTint;
attribute vec3 color; attribute vec4 surf;
varying vec3 vLocal; varying vec3 vN; varying vec3 vView; varying vec3 vColor; varying vec3 vSurf; varying vec3 vObj;
#include <fog_pars_vertex>
void main() {
  float sw = 1. - surf.w; vec3 P = position;
  P.z += sw * .16 * sin(uTime * .9 + position.z * .05); P.x -= sw * .04 * (1. + sin(uTime * 1.7 + position.z * .05));
  vColor = (color * mix(1.1, .95, surf.z) + vec3(.05, .015, 0.) * surf.z) * mix(vec3(1.), uWareTint, surf.z); vSurf = surf.xyz; vObj = position;
  vec4 wp = modelMatrix * vec4(P, 1.); vLocal = wp.xyz + vec3(0., 0., ${(-G0).toFixed(1)}); vN = normal; vView = cameraPosition - wp.xyz;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ao=`
attribute vec2 aD;
uniform vec3 uCamP;
varying vec3 vW; varying float vWt;
void main() {
  vec3 P = vec3(position.x, position.y, uCamP.z - aD.x); vW = P; vWt = aD.y * step(${(K+.6).toFixed(1)}, P.z) * step(P.z, ${(m0-.6).toFixed(1)});
  gl_Position = projectionMatrix * viewMatrix * vec4(P, 1.);
}`,so=`
uniform vec3 uSunDir; uniform vec3 uRayCol; uniform vec3 uCamP; uniform vec4 uWinR[5]; uniform vec4 uRay;      // uRay: wall x, time, gain, softness of the beam's sides
varying vec3 vW; varying float vWt;
float h21(vec2 p) { p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
void main() {
  if (vWt < 1e-4) discard;
  float t = (vW.x - uRay.x) / max(-uSunDir.x, .05);
  vec3 h = vW + uSunDir * t;
  float s = uRay.w + vWt * .12, m = 0.;
  for (int i = 0; i < 5; i++) { vec4 w = uWinR[i]; m += smoothstep(w.x - s, w.x + s, h.z) * (1. - smoothstep(w.y - s, w.y + s, h.z)); }
  float e = uRay.w * .35;
  m *= smoothstep(8. - e, 8. + e, h.y) * (1. - smoothstep(38. - e, 38. + e, h.y));
  m *= (1. - .85 * (1. - smoothstep(.4, .4 + e, abs(h.y - 18.)))) * (1. - .85 * (1. - smoothstep(.4, .4 + e, abs(h.y - 28.))));
  float fine = .5 + vn(vec2(h.y * 1.3, h.z * .13)) * .7 + vn(vec2(h.y * .37 + 3., h.z * .05 + uRay.y * .03)) * .5;
  float leaf = .55 + .45 * smoothstep(.3, .7, vn(vec2(h.z * .06 + uRay.y * .1, h.y * .08 - uRay.y * .06)));
  float dust = .75 + .5 * vn(vW.xy * .11 + vec2(uRay.y * .13, vW.z * .07 - uRay.y * .05));
  vec3 rv = vW - uCamP; float dist = length(rv); vec3 rd = rv / max(dist, 1e-3);
  float cf = max(dot(rd, uSunDir), 0.), ph = 1. + .7 * cf * cf * cf;
  float face = smoothstep(.1, .5, abs(rd.z));
  float v = m * fine * leaf * dust * ph * exp(-t * .007) * exp(-dist * .021) * face * vWt;   // (the far slices fade fast: down the length of the room the beams are shafts, not a veil)
  gl_FragColor = vec4(uRayCol * (uRay.z * v), 1.);
}`;function no(t,e){const r=[];for(let L=4;L<440;L=L*1.13+1.6)r.push(L);const n=[],a=[],o=[];r.forEach((L,c)=>{const S=((r[c+1]??L*1.13+1.6)-(r[c-1]??2.4))/2;n.push(U,0,0,Q,0,0,Q,Q0,0,U,Q0,0);for(let h=0;h<4;h++)a.push(L,S);o.push(c*4,c*4+1,c*4+2,c*4,c*4+2,c*4+3)});const l=new u.BufferGeometry;l.setAttribute("position",new u.Float32BufferAttribute(n,3)),l.setAttribute("aD",new u.Float32BufferAttribute(a,2)),l.setIndex(o);const B={uSunDir:{value:new i0(t.sunDir[0],t.sunDir[1],t.sunDir[2]).normalize()},uRayCol:{value:new u.Color(t.rayCol)},uCamP:{value:new i0(0,10,0)},uWinR:{value:J0.map(([L,c])=>new u.Vector4(c,L,0,0))},uRay:{value:new u.Vector4(U,0,.0096*t.rays,t.raySoft)}},F=new u.Mesh(l,new u.ShaderMaterial({vertexShader:ao,fragmentShader:so,uniforms:B,transparent:!0,depthWrite:!1,blending:u.AdditiveBlending,side:u.DoubleSide}));return F.frustumCulled=!1,F.renderOrder=7,F.name="beams",{mesh:F,uniforms:B,triangles:r.length*2}}async function io(t,e,r,n,a){const o=(m0-K)/18,l="#6e5a3c",b="#15171a",B=["#8c9a5e","#6f7a44","#9a9a6a","#7d8f6c","#a79a58"],F=["#817c96","#a89a5c","#8c9a5e","#b5a468","#93606a"],L=(c,S,h)=>{const k=Math.sin(c*12.9898+S*78.233+h*37.719)*43758.5453;return k-Math.floor(k)};for(let c=1;c<18;c++){const S=m0-c*o;for(const h of[-25.5,-21.5,-17.5,10.5,15.5,21,26.5,33,39.5]){const k=(h===10.5||h===15.5||h===-17.5)&&S<-92&&S>-188,N=r(),R=S+(r()-.5)*1,O=36.1,z=(4.4+r()*2.4)*(k?.55:1),G=O-z,W=[G-.5,O,1,0],D=r()*B0;if(!(r()>(h>30?.55:.88)*T0(n.density,.8,1.2)))if(e.add(u0(.05,.05,.9,4),{p:[h,O+.2,R],c:l,surf:R0}),N<.36){const g=.7+r()*.4,H=[.38,1,1.08,.82,.36,.2,.13],a0=new u.Color(B[Math.floor(r()*B.length)]),i=new u.Color(F[Math.floor(r()*F.length)]);e.add(ee(7,10,(s,C,w)=>{const P=s/6,_=Math.sin(C*5+D+s*.9),y=H[s]*g*(1+(.36-.3*P)*_);return w.set(Math.cos(C)*y,-z*(1-P)-.5*_*(1-P)*(1-P),Math.sin(C)*y),.66+.34*_},!0,!0),{p:[h,O,R],surf:$0,sway:W,tint:(s,C,w,P,_,y,v)=>{const f=P.r,d=L(_,y,v);P.copy(-y/z>.62+.25*d?i:a0).multiplyScalar(f*(.75+.5*d))}}),e.add(u0(.32*g,.32*g,.3,5,!0),{p:[h,O-z*.25,R],c:"#c9b890",surf:R0,sway:W})}else if(N<.62){e.add(u0(.05,.05,z,4),{p:[h,O-z/2,R],c:l,surf:R0,sway:W});const g=9+Math.floor(r()*4);for(let H=0;H<g;H++){if(k&&H%2){r();continue}const a0=D+H*2.4,i=O-.9-H*(z-1.3)/g,s=new u.ConeGeometry(.33,1.3,5);s.deleteAttribute("uv"),s.rotateX(j),e.add(s,{p:[h+Math.cos(a0)*.3,i,R+Math.sin(a0)*.3],r:[Math.sin(a0)*.55,0,-Math.cos(a0)*.55],c:q("#a8221a","#d6481a",r()),surf:X.surf(0,.75),sway:W})}}else if(N<.8){const g=r()<.45,H=6+Math.floor(r()*3);e.add(u0(.09,.09,z,5),{p:[h,O-z/2,R],c:"#b8a880",surf:R0,sway:W});for(let a0=0;a0<H;a0++){if(k&&a0%2){r();continue}const i=D+a0*j*.75,s=O-1.1-a0*(z-1.5)/H,C=V0(g?.55:.46,6,4);C.scale(1,g?.9:.82,1),e.add(C,{p:[h+Math.cos(i)*.42,s,R+Math.sin(i)*.42],c:g?q("#c08a3a","#a85e22",r()):q("#e6dcc6","#cfc2a6",r()),surf:X.surf(0,g?.55:.2),sway:W})}}else{const g=.8+r()*.5,H=q(h0,"#e08a50",r()*.5),a0=Math.max(z,2.6*g+.5),i=O-a0;e.add(u0(.05,.05,a0-2.6*g,4),{p:[h,O-(a0-2.6*g)/2,R],c:b,surf:le,sway:W}),e.add(_0(1*g,.07,4,10,j),{p:[h,i+1.6*g,R],r:[0,D,0],c:b,surf:le,sway:W}),e.add(J([[.02,0],[.8,0],[1.1,.35],[1.15,1.2],[1.05,1.55],[1.2,1.62],[1.02,1.5],[.02,.2]],10),{p:[h,i,R],s:g,c:H,surf:x0,sway:W})}}(c&1)===0&&await t.yield()}}const ro=`
${Z0.light}
varying vec3 vLocal; varying vec3 vN; varying vec3 vView; varying vec3 vColor; varying vec3 vSurf; varying vec3 vObj;
#include <fog_pars_fragment>
vec3 cell(vec2 p) {
  vec2 ip = floor(p), fp = fract(p); float best = 9.; vec2 off = vec2(0.);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j)); vec2 o = g + vec2(hash21(ip + g), hash21(ip + g + 17.3)) - fp; float d = dot(o, o);
    if (d < best) { best = d; off = o; }
  }
  return vec3(sqrt(best), off);
}
void main() {
  vec3 V = normalize(vView + vec3(1e-5)), N = normalize(vN + vec3(0., 1e-5, 0.)); if (dot(N, V) < 0.) N = -N;
  vec3 alb = vColor; float gloss = vSurf.y, cop = step(.5, vSurf.z) * step(vSurf.z, 1.5);
  vec3 an = abs(N); vec2 hq = (an.y > .62 ? vObj.xz : (an.x > an.z ? vObj.zy : vObj.xy)) * 4.2;
  float hf = clamp(1.5 - 1.3 * length(fwidth(hq)), 0., 1.) * cop;
  vec3 c = cell(hq);
  vec3 t1 = normalize(cross(N, vec3(.31, .2, .93)) + vec3(1e-4)), t2 = cross(N, t1);
  float fac = hash21(floor((hq + c.yz) * 4. + .5));
  N = normalize(N + (t1 * c.y + t2 * c.z) * .17 * hf + (t1 * (fac - .5) + t2 * (fract(fac * 7.3) - .5)) * .07 * hf);
  alb *= 1. + hf * (.12 * (fac - .5) - .1 * smoothstep(.36, .52, c.x));
  alb *= (.84 + .3 * vnoise(vObj.xz * .9 + vObj.y * .7 + 3.)) * (1. - (1. - cop) * .12 * (.5 + .5 * sin(vObj.y * 31.)));
  float beam = beamMask(vLocal); vec3 L = normalize(uSunDir), R = reflect(-V, N);
  float nv = max(dot(N, V), 0.), f1 = 1. - nv, fres = f1 * f1 * f1 * f1, nl = dot(N, L), wrap = max(nl * .55 + .45, 0.);
  vec3 env = envLight(R, beam), F0 = min(alb * 1.25, vec3(1.));
  vec3 col = alb * (uSunCol * beam * wrap * wrap * .55 + ambient(N) * 1.5 + ambient(R) * .6);
  col += mix(F0, vec3(1.), fres * .7) * env * (.26 + .34 * gloss) / (1. + env * .45);
  float rl = max(dot(R, L), 0.);
  col += F0 * uSunCol * beam * (.45 * pow(rl, 16.) + 3.2 * gloss * pow(rl, 160.));
  col += F0 * (uBounceCol * 1.3 + uSunCol * beam * vec3(.32, .26, .18)) * .55 * clamp(.6 - N.y, 0., 1.);
  if (dot(vView, vView) < 4.) discard;
  gl_FragColor = vec4(clamp(col, 0., 20.), 1.);
  #include <fog_fragment>
}`,co=`
${Z0.light}
uniform vec3 uGlowCol;
varying vec2 vUv; varying float vA; varying vec3 vL;
void main() {
  float d = dot(vUv, vUv), a = 1. - smoothstep(0., 1., d); a *= a * vA;
  gl_FragColor = vec4(uGlowCol * (ambient(vec3(-.7, .3, 0.)) * 1.6 + uSunCol * beamMask(vL) * .55) * a, 1.);
}`,lo=`
attribute vec4 iPr;                                           // x, z, turn, the cat's z when this paw stands on it
uniform float uCatZ;
varying vec2 vUv; varying float vA; varying vec3 vL;
${te}
void main() {
  float c = cos(iPr.z), s = sin(iPr.z); vec2 q = position.xy * 1.7;
  vec3 P = vec3(iPr.x + q.x * c - q.y * s, ${(M0.top+.035).toFixed(3)}, iPr.y + q.x * s + q.y * c);
  vUv = position.xy * 2.; vA = smoothstep(0., .4, uCatZ - iPr.w) * mix(1., .45, clamp((-178. - iPr.y) / 110., 0., 1.));
  vec4 wp = modelMatrix * vec4(P, 1.); vL = wp.xyz + vec3(0., 0., ${(-G0).toFixed(1)});
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,uo=`
${Z0.light}
uniform vec3 uPrintCol;
varying vec2 vUv; varying float vA; varying vec3 vL;
${ne}
float dot2(vec2 p, vec2 c, vec2 r) { vec2 q = (p - c) / r; return 1. - smoothstep(.75, 1., dot(q, q)); }
void main() {
  float m = dot2(vUv, vec2(0., -.22), vec2(.46, .38));
  m = max(m, dot2(vUv, vec2(-.46, .22), vec2(.17, .2))); m = max(m, dot2(vUv, vec2(-.17, .5), vec2(.17, .21)));
  m = max(m, dot2(vUv, vec2(.17, .5), vec2(.17, .21))); m = max(m, dot2(vUv, vec2(.46, .22), vec2(.17, .2)));
  float a = m * vA; if (a < .02) discard;
  gl_FragColor = vec4(uPrintCol * (ambient(vec3(0., 1., 0.)) * 1.3 + uSunCol * beamMask(vL) * .4), a * .62);
  #include <fog_fragment>
}`,fo=`
uniform float uT;
attribute vec4 iF0; attribute vec4 iF1; attribute vec4 iF2;   // rest xz, landing xz | leaves at, flight time, radius, seed | its place in the bowl
varying vec3 vL; varying vec3 vN; varying vec3 vView; varying vec3 vObj;
${$e}
${te}
void main() {
  float r = iF1.z, T1 = iF1.y, tl = iF1.x + T1, dt = uT - iF1.x, roll = 0.;
  vec2 dv = iF0.xy - iF0.zw; float len = length(dv); vec2 dir = dv / max(len, 1e-3); vec3 C;
  if (dt <= 0.) C = iF2.xyz;
  else if (uT < tl) { vec2 vh = (iF0.zw - iF2.xz) / T1; float vy = (r - iF2.y + 4.9 * T1 * T1) / T1; C = vec3(iF2.x + vh.x * dt, iF2.y + vy * dt - 4.9 * dt * dt, iF2.z + vh.y * dt); roll = dt * 2.2; }
  else { float s = uT - tl, f = 1. - exp(-.5 * s); C = vec3(iF0.z + dv.x * f, r + 1.1 * abs(sin(s * 3.3)) * exp(-1.5 * s), iF0.w + dv.y * f); roll = T1 * 2.2 + len * f / r; }
  vec3 ax = normalize(vec3(dir.y, 0., -dir.x) + vec3(1e-4, 0., 0.));
  float a = roll + iF1.w * 6.;
  vec3 p = rod(ax, a, position * vec3(1., .9, 1.24) * r), N = normalize(rod(ax, a, normal * vec3(1., 1.1, .82)));
  vec3 P = C + p; vObj = position;
  ${je}
}`,vo=`
${Z0.light}
uniform vec3 uFruit;
varying vec3 vL; varying vec3 vN; varying vec3 vView; varying vec3 vObj;
${ne}
void main() {
  vec3 V = normalize(vView + vec3(1e-5)), N = normalize(vN + vec3(0., 1e-5, 0.)); if (dot(N, V) < 0.) N = -N;
  float beam = beamMask(vL); vec3 Ls = normalize(uSunDir);
  float nl = dot(N, Ls), nv = clamp(dot(N, V), 0., 1.), tip = smoothstep(.86, 1., abs(vObj.z));
  vec3 alb = uFruit * (.86 + .25 * vnoise(vObj.xy * 9. + vObj.z * 5.)) * mix(vec3(1.), vec3(.62, .7, .4), tip);
  vec3 col = alb * (uSunCol * max(nl * .75 + .25, 0.) * beam * .7 + ambient(N) * 1.35);
  col += alb * uSunCol * beam * .35 * pow(1. - nv, 2.5) + uSunCol * beam * .5 * pow(max(dot(reflect(-V, N), Ls), 0.), 26.) + uSkyCol * .25 * pow(1. - nv, 3.);
  col *= .55 + .45 * smoothstep(-.9, .2, N.y);
  gl_FragColor = vec4(clamp(col, 0., 24.), 1.);
  #include <fog_fragment>
}`,ie={n:2200,x:-23.4,dx:5,z:-231,dz:11,t0:2.4,dt:2.8,T1:3.15,dT:.5},ht=`
uniform float uTauN; uniform float uTauS; uniform vec3 uMouth; uniform vec3 uCam;
attribute vec4 iA; attribute vec4 iB; attribute vec4 iC;
vec3 nutPos(out float dtOut, out float grow) {
  float dt = mix(uTauN, uTauS, iC.w) - iA.z; dtOut = dt; grow = smoothstep(0., .12, dt);       // (the stream has a clock of its own that runs on past 9 s: all of it lies still before its turn)
  vec2 L1 = iA.xy; float T1 = iA.w; vec2 dir = vec2(cos(iB.x), sin(iB.x));
  if (dt <= T1) { float t = max(dt, 0.); vec2 vh = (L1 - uMouth.xz) / T1; float vy = (.16 - uMouth.y + 4.9 * T1 * T1) / T1; return vec3(uMouth.x + vh.x * t, uMouth.y + vy * t - 4.9 * t * t, uMouth.z + vh.y * t); }
  float s = dt - T1, vy1 = iB.z, d1 = vy1 / 4.9, h1 = iB.y;
  if (s < d1) return vec3(L1.x + dir.x * h1 * s, .16 + vy1 * s - 4.9 * s * s, L1.y + dir.y * h1 * s);
  float s2 = s - d1, vy2 = vy1 * .45, d2 = vy2 / 4.9, h2 = h1 * .6; vec2 q = L1 + dir * h1 * d1;
  if (s2 < d2) return vec3(q.x + dir.x * h2 * s2, .16 + vy2 * s2 - 4.9 * s2 * s2, q.y + dir.y * h2 * s2);
  q += dir * (h2 * d2 + iB.w * (1. - exp(-3.2 * (s2 - d2))));
  return vec3(q.x, .16, q.y);
}`,po=`
${ht}
${$e}
uniform vec3 uNutK;                                           // x: 1 pistachio, 0 hazelnut; y: size
varying vec3 vL; varying vec3 vE1; varying vec3 vE2; varying vec3 vTo; varying vec4 vNut; varying vec2 vUv;
${te}
void main() {
  float dt, grow; vec3 C = nutPos(dt, grow);
  vec3 ax = normalize(vec3(sin(iC.x * 91.), cos(iC.x * 57.), sin(iC.x * 23.) + .2));
  float ang = iC.x * 40. + iC.z * (min(max(dt, 0.), iA.w + 1.2) + 1.2 * (1. - exp(-2. * max(dt - iA.w - 1.2, 0.))));
  vec3 la = rod(ax, ang, normalize(vec3(cos(iC.x * 13.), .25 * sin(iC.x * 29.), sin(iC.x * 13.))));      // the long axis
  vec3 away = C - uCam; float ad = length(away); C += away / max(ad, 1e-3) * max(0., 5. - ad) * vec3(1., .6, 1.);   // never through the lens
  vec3 toC = cameraPosition - C; toC = toC / max(length(toC), 1e-3);
  vec3 lp = la - toC * dot(la, toC); float fl = length(lp);
  vec3 e1 = fl > .02 ? lp / fl : normalize(cross(toC, vec3(0., 1., 0.)) + vec3(1e-4, 0., 0.)), e2 = cross(toC, e1);
  float R = uNutK.y * iC.y * grow, Lh = R * mix(1., mix(1.25, 1.75, uNutK.x), fl);
  vec3 P = C + e1 * (position.x * 2. * Lh) + e2 * (position.y * 2. * R);
  vUv = position.xy * 2.; vE1 = e1; vE2 = e2; vTo = toC; vNut = vec4(fl, iC.x, ang * .6 + iC.x * 50., dot(la, toC));
  vec4 wp = modelMatrix * vec4(P, 1.); vL = wp.xyz + vec3(0., 0., ${(-G0).toFixed(1)});
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ho=`
${Z0.light}
uniform vec3 uKernel; uniform vec3 uShell; uniform vec3 uNutK;
varying vec3 vL; varying vec3 vE1; varying vec3 vE2; varying vec3 vTo; varying vec4 vNut; varying vec2 vUv;
${ne}
void main() {
  float d = dot(vUv, vUv); if (d > 1.) discard;
  float zc = sqrt(1. - d), seed = vNut.y;
  vec3 N = normalize(vE1 * vUv.x * mix(1., .55, vNut.x) + vE2 * vUv.y + vTo * zc);
  // the split runs along the nut, wide at one end; it faces the camera for part of each turn
  float roll = vNut.z, face = .3 + .7 * max(cos(roll), 0.), gc = sin(roll) * .7 * sqrt(max(1. - vUv.x * vUv.x, 0.));
  float gw = (.15 + .32 * smoothstep(-.9, .7, vUv.x)) * sqrt(face) * uNutK.x;
  float gap = (1. - smoothstep(gw * .55, gw, abs(vUv.y - gc))) * step(.02, gw) * smoothstep(-1., -.75, vUv.x);
  float lip = (1. - smoothstep(gw, gw * 1.5 + .05, abs(vUv.y - gc))) * step(.02, gw) * (1. - gap);
  float cap = (1. - uNutK.x) * (1. - smoothstep(-.62, -.45, vUv.x + .25 * sin(roll)));                 // the hazelnut's pale cap
  vec3 shell = uShell * (.86 + .22 * fract(seed * 7.3)) * (.9 + .1 * sin(vUv.y * 9. + seed * 20.));
  shell = mix(shell, uShell * vec3(1.25, 1.2, 1.05) + .04, cap);
  vec3 kern = uKernel * (1.05 + .4 * fract(seed * 3.7)) * mix(vec3(1.), vec3(.75, .55, .6), smoothstep(.4, 1., abs(vUv.y - gc) / max(gw, .02)));
  vec3 alb = mix(shell * (1. - .45 * lip), kern, gap);
  float beam = beamMask(vec3(vL.x, vL.y - .85 * max(vL.y - 17., 0.), vL.z)); vec3 Ls = normalize(uSunDir), V = vTo;
  float nl = dot(N, Ls), wrap = max(nl * .6 + .4, 0.), up = smoothstep(4., 14., vL.y);
  vec3 col = alb * (uSunCol * wrap * beam * (.6 + .25 * up) + ambient(N) * 1.3);
  col += uKernel * uSunCol * beam * gap * (.2 + .3 * up + .45 * pow(max(dot(-V, Ls), 0.), 2.));           // the kernel glows green with the sun in it
  col += alb * uSunCol * beam * .3 * up * (1. - zc);                                                      // and the thin shell cream at its edge
  col += uSunCol * beam * .3 * pow(1. - zc, 3.) * max(-dot(V, Ls) * .5 + .5, 0.);                         // rim
  col += uSunCol * beam * .5 * pow(max(dot(reflect(-V, N), Ls), 0.), 24.) * (1. - gap);                    // the shell is smooth: a small highlight
  gl_FragColor = vec4(clamp(col, 0., 24.), 1.);
  #include <fog_fragment>
}`,mt=`
attribute vec4 iPos; attribute vec2 iRad;
varying vec2 vUv; varying float vA; varying vec3 vL;
${te}
void main() {
  float wall = step(iRad.x, 0.);
  vec3 P = iPos.xyz + mix(vec3(position.x, 0., position.y), vec3(0., position.y, position.x), wall) * 2. * iPos.w;
  vUv = position.xy * 2.; vA = abs(iRad.x);
  vec4 wp = modelMatrix * vec4(P, 1.); vL = wp.xyz + vec3(0., 0., ${(-G0).toFixed(1)});
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,mo=`
${ht}
varying vec2 vUv; varying float vA; varying vec3 vL;
${te}
void main() {
  float dt, grow; vec3 C = nutPos(dt, grow);
  float h = max(C.y - .16, 0.), r = iC.y * (1.5 + h * .2);
  vec3 P = vec3(C.x + position.x * r + h * .5, .05, C.z + position.y * r);
  vUv = position.xy * 2.; vA = grow * .24 / (1. + h * .8);
  vec4 wp = modelMatrix * vec4(P, 1.); vL = wp.xyz + vec3(0., 0., ${(-G0).toFixed(1)});
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,yt=`
${Z0.light}
varying vec2 vUv; varying float vA; varying vec3 vL;
${ne}
void main() {
  float d = dot(vUv, vUv); float a = vA * (1. - smoothstep(.15, 1., d)) * (.55 + .45 * beamMask(vL));
  gl_FragColor = vec4(vec3(.03, .045, .09), a);
  #include <fog_fragment>
}`;async function yo(t,e,r,n,a){const o=Math.round(9e3*T0(t.quality?.detail??1,.5,1)*T0(n.density,.8,1.15)),l=Math.round(ie.n*T0(t.quality?.detail??1,.6,1)),b=o+l,B=new i0,F=Ve(dt,new i0),L=Ve(0,new i0),c=new Float32Array(b*4),S=new Float32Array(b*4),h=new Float32Array(b*4);B.copy(F);for(let z=0;z<o;z++){z&&z%3e3===0&&await t.yield();const G=e()<.42,W=G?F:L;let D,g;for(let M=0;M<8;M++){const p=e()*B0,x=(G?26:25)*Math.pow(e(),.75);if(D=-10+Math.cos(p)*x,g=(G?-238:-296)+Math.sin(p)*x*(G?.95:.9),D>-23.5&&D<1.5&&(G?g>-263:g<-274-.25*(D+10)))break;D=T0(D,-23.5,1.5),g=G?Math.max(g,-263):Math.min(g,-274-.25*(D+10))}const H=Math.atan2(g-W.z,D-W.x)+(e()-.5)*1.1,a0=2.2+e()*3.2,i=1.5+e()*3.5,s=.6+e()*3,C=a0/4.9,w=a0*.45/4.9,P=i*C+i*.6*w+s,_=D-Math.cos(H)*P,y=g-Math.sin(H)*P,v=Math.hypot(_-W.x,y-W.z),f=G?4.3+e()*1.1:e()*e()*2.6+e()*.6,d=G?p0(2.6,2.1,T0((v-14)/25,0,1))+e()*.3:2.5+e()*.4;c.set([_,y,f,d],z*4),S.set([H,i,a0,s],z*4),h.set([e(),.62+e()*.34,(e()-.5)*9,0],z*4)}await t.yield();for(let z=o;z<b;z++){const G=ie.x+(e()-.5)*ie.dx,W=ie.z+(e()-.5)*ie.dz,D=Math.atan2(W-F.z,G-F.x)+(e()-.5)*.8,g=2+e()*1.8,H=1.2+e()*2.4,a0=.4+e()*1.6,i=g/4.9,s=g*.45/4.9,C=H*i+H*.6*s+a0;c.set([G-Math.cos(D)*C,W-Math.sin(D)*C,ie.t0+e()*ie.dt,ie.T1+e()*ie.dT],z*4),S.set([D,H,g,a0],z*4),h.set([e(),.78+e()*.3,(e()-.5)*7,1],z*4)}const k={uTauN:{value:9},uTauS:{value:11.5},uMouth:{value:B},uCam:{value:new i0(0,1e4,0)},uKernel:{value:new u.Color(a==="hazel"?"#c08a44":"#a9c24a")},uShell:{value:new u.Color(a==="hazel"?"#8a5a2c":"#d8c59a")},uNutK:{value:new i0(a==="hazel"?0:1,a==="hazel"?.17:.135,0)}},N={iA:[c,4],iB:[S,4],iC:[h,4]},R=new u.Mesh(se(me(),b,N),r(po,ho,k));R.frustumCulled=!1;const O=new u.Mesh(se(me(),Math.ceil(o*.5),N),r(mo,yt,k,{transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}));return O.frustumCulled=!1,O.renderOrder=1,{nuts:R,shadows:O,uniforms:k,mouth:B,triangles:b*4}}function wo(t,e){const r=X.makeBuilder(),n=new u.Color("#ae9462"),a=new u.Color("#2f5f9a"),o=j0.h,l=j0.r,b=30,B=[...Ge.slice(0,14),.57,.66,.75,.83,.9,.96,1],F=Le([0,.02,.08,.2,.45,.7,.9,1],[.74,.9,.99,1.05,.98,.91,.89,.91]),L=(N,R)=>Math.pow(.5+.5*Math.cos(7*N+1.3+1.6*R),3),c=N=>.12*Math.sin(3*N+1)+.05*Math.sin(5*N);r.add(ee(B.length,b,(N,R,O)=>{const z=B[N],G=.045+.1*F0(.45,1,z),W=L(R,z),D=Math.sin(z*27+2*Math.sin(R*2+1))*F0(.03,.2,z)*(1-.6*F0(.38,.5,z)*(1-F0(.5,.6,z))),g=1+.1*Math.cos(R-.6)*(1-z)*F0(0,.1,z)+.045*Math.cos(4*R+.5)*(1-z)+.03*Math.sin(3*R+z*6),H=l*F(z)*(1-G*W)*(g+.03*D);return O.set(Math.cos(R)*H,z*o+c(R)*z,Math.sin(R)*H),(1-1.7*G*W)*(.7+.3*F0(0,.1,z))*(1-.3*Math.max(0,-D))},!0,!1),{surf:$0,tint:(N,R,O,z,G,W,D)=>{const g=z.r,H=.9+.1*Math.sin(W*26)*Math.sin(Math.atan2(D,G)*40);z.copy(n).multiplyScalar(g*H)}}),r.add(ee(9,b,(N,R,O)=>{const z=N/8*B0,G=L(R,1),W=l*.91*(1-.145*G)*(1+.03*Math.sin(3*R+6)),D=.34*(1+.22*Math.sin(5*R+2)+.12*Math.sin(11*R)),g=W+.12+D*Math.cos(z);return O.set(Math.cos(R)*g,o+c(R)-.1+D*.85*Math.sin(z),Math.sin(R)*g),(.78+.22*Math.sin(z))*(.9+.1*Math.sin(9*R+z*2))},!1,!1),{surf:$0,tint:(N,R,O,z)=>{const G=z.r;z.copy(n).multiplyScalar(G*1.08)}});const S=new u.Color(e),h=new u.Color(t),k=new u.Color("#3a2c1c");return r.add(ee(7,26,(N,R,O)=>{const z=N/6,G=l*.86*Math.cos(z*j/2)+.02,W=.11*Math.sin(R*9+N*2.3)*Math.sin(N*1.9+R*4)*(.3+z);return O.set(Math.cos(R)*G*(1+.04*Math.sin(R*13+N)),o-.55+c(R)*.8+.95*Math.sin(z*j/2)+W,Math.sin(R)*G*(1+.04*Math.cos(R*11+N))),.6+.4*z},!1,!0),{surf:R0,tint:(N,R,O,z,G,W,D)=>{const g=z.r,H=Math.abs(Math.sin(G*51.7+D*37.3+W*13.1)*43758.5)%1;z.copy(H<.55?S:H<.82?h:k).multiplyScalar(g*(.8+.4*(H*7%1)))}}),r.build()}const xo=`
attribute vec3 color;
varying vec3 vL; varying vec3 vN; varying vec3 vView; varying vec3 vObj; varying vec3 vColor;
${te}
void main() {
  vec3 P = position, N = normalize(mat3(modelMatrix) * normal);
  vObj = position; vColor = color;
  ${je}
}`,go=`
${Z0.light}
varying vec3 vL; varying vec3 vN; varying vec3 vView; varying vec3 vObj; varying vec3 vColor;
${ne}
void main() {
  vec3 V = normalize(vView + vec3(1e-5)), N = normalize(vN + vec3(0., 1e-5, 0.)); if (dot(N, V) < 0.) N = -N;
  float ang = atan(vObj.z, vObj.x + (abs(vObj.x) < 1e-4 ? 2e-4 : 0.));
  // a coarse plain weave: every thread a rounded ridge passing over and under, dark in the gaps
  vec2 w = vec2(ang * 21., vObj.y * 7.4 + .35 * sin(ang * 9.)); float fw = clamp(1.35 - 1.3 * length(fwidth(w)), 0., 1.);
  vec2 wc = fract(w) - .5; float over = mod(floor(w.x) + floor(w.y), 2.);
  float across = over > .5 ? abs(wc.x) : abs(wc.y), along = over > .5 ? wc.y : wc.x;
  float wv = cos(across * 3.1416) * (.72 + .28 * cos(along * 6.2832)) * (.8 + .4 * hash21(floor(w)));
  vec3 alb = vColor * mix(1., .6 + .64 * wv, fw) * (.86 + .28 * vnoise(vec2(ang * 3., vObj.y * .9)));
  // the two woven stripes follow the cloth: t is the height along it, as the sack was lofted (creases and slump included)
  float st = vObj.y / (${j0.h.toFixed(2)} + .12 * sin(3. * ang + 1.) + .05 * sin(5. * ang)), sfw = fwidth(st) * 1.2 + 1e-4;
  float stripe = max(smoothstep(.398 - sfw, .398 + sfw, st) * (1. - smoothstep(.452 - sfw, .452 + sfw, st)), smoothstep(.478 - sfw, .478 + sfw, st) * (1. - smoothstep(.492 - sfw, .492 + sfw, st)));
  stripe *= step(vObj.y, ${(j0.h*.6).toFixed(2)});
  float shadeV = clamp(vColor.r / .42, 0., 1.4);
  alb = mix(alb, vec3(.03, .12, .36) * shadeV * mix(1., .62 + .7 * wv, fw) * (1. + .5 * step(.5, over) * fw), stripe);
  float beam = beamMask(vec3(vL.x, vL.y - .85 * max(vL.y - 17., 0.), vL.z)), nl = dot(N, normalize(uSunDir)), nv = clamp(dot(N, V), 0., 1.);
  vec3 sun = mix(vec3(dot(uSunCol, vec3(.3333))), uSunCol, .6);                 // jute is a dull cloth: the sun on it is paler than on brass
  vec3 col = alb * (sun * max(nl * .86 + .14, 0.) * beam * .68 + ambient(N) * mix(1.25, 1.02, beam));
  col += alb * (sun * beam * .45 + uSkyCol * .5) * pow(1. - nv, 3.);
  gl_FragColor = vec4(clamp(col, 0., 24.), 1.);
  #include <fog_fragment>
}`,bo=`
uniform float uTauC;
attribute vec3 color; attribute vec4 surf; attribute vec4 iPos; attribute vec4 iCol; attribute vec4 iLid;
varying vec3 vL; varying vec3 vN; varying vec3 vView; varying vec3 vObj; varying vec3 vColor; varying vec4 vCol; varying float vPart;
${$e}
${te}
void main() {
  vec3 p = position, n = normal; float part = surf.x, dt = uTauC - iPos.w;
  float fly = step(1.5, part) * step(.5, iLid.w) * step(0., dt);
  if (fly > .5) {
    float Tf = iLid.z, s = min(dt, Tf), a = 12.566 * s / Tf, vy = (.25 - iPos.y - 2.85 + 4.9 * Tf * Tf) / Tf;
    vec3 c = vec3(0., 3.05, 0.);
    float rat = exp(-3. * max(dt - Tf, 0.)) * step(Tf, dt) * .5 * sin((dt - Tf) * 9.);
    p = c + rod(vec3(0., 0., 1.), a + rat, p - c); n = rod(vec3(0., 0., 1.), a + rat, n);
    p += vec3(iLid.x * s / Tf, vy * s - 4.9 * s * s, iLid.y * s / Tf);
  } else {
    float ang = .2 * exp(-.42 * max(dt, 0.)) * step(0., dt) * step(iPos.w, 900.) * sin(dt * 5.2 + iCol.w * 6.);
    p = rod(vec3(1., 0., 0.), ang, p); n = rod(vec3(1., 0., 0.), ang, n);
  }
  vec3 P = iPos.xyz + p, N = n;
  vObj = position; vColor = color; vCol = iCol; vPart = part;
  ${je}
}`,Mo=`
${Z0.light}
${Z0.tea}
uniform vec3 uVes;                                            // ribs, cell size, glass tint gain
// one layer of the pieces in a jar: tone, cover and the piece's own number. kp: pieces round, rows per metre, 0 cube | 1 oval, size
vec3 pieces(vec2 cp, vec4 kp, float kind, float seed) {
  cp.x += hash21(vec2(floor(cp.y), seed * 91.));
  vec2 ci = vec2(mod(floor(cp.x), kp.x), floor(cp.y)); float cell = hash21(ci + seed * 31.), c2 = fract(cell * 7.31), c3 = fract(cell * 13.7);
  vec2 q = fract(cp) - .5 + (vec2(c2, c3) - .5) * .3;
  float ra = (c2 - .5) * (kind < .5 ? 1.2 : 3.1), cr = cos(ra), sr = sin(ra); q = vec2(cr * q.x - sr * q.y, sr * q.x + cr * q.y);
  float sz = kp.w * (.85 + .3 * c3);
  float dq = kp.z < .5 ? (length(max(abs(q) - sz, 0.)) - .1) * 3. + 1. : length(q / vec2(sz, sz * (kind > 2.5 ? .92 : .62)));
  float rnd = sqrt(max(1. - dq * dq * .8, 0.));
  float tone = (.7 + .45 * cell) * (.5 + .6 * rnd) + .3 * smoothstep(.3, .0, length(q - vec2(-.1, .11)));
  return vec3(tone, 1. - smoothstep(.88, 1.06, dq), cell);
}
varying vec3 vL; varying vec3 vN; varying vec3 vView; varying vec3 vObj; varying vec3 vColor; varying vec4 vCol; varying float vPart;
${ne}
void main() {
  vec3 V = normalize(vView + vec3(1e-5)), N = normalize(vN + vec3(0., 1e-5, 0.)); if (dot(N, V) < 0.) N = -N;
  float beam = beamMask(vL); vec3 Ls = normalize(uSunDir), R = reflect(-V, N);
  float nv = clamp(dot(N, V), 0., 1.), fres = (1. - nv) * (1. - nv) * (1. - nv), nl = dot(N, Ls);
  vec3 col;
  if (vPart < .5) {
    float ang = atan(vObj.z, vObj.x + (abs(vObj.x) < 1e-4 ? 2e-4 : 0.));
    float rib = .5 + .5 * cos(ang * uVes.x), jar = step(.5, uVes.y), kind = floor(vCol.w + 1e-3), seed = fract(vCol.w);
    vec3 clear = envLight(-V, beam) * .42 + uSkyCol * .2, lit;
    if (jar > .5) {
      // what is in the jar: two layers of pieces heaped behind the glass - cubes of lokum under sugar, sugared almonds,
      // rose petals, whole lemons - every row slid by its own amount, every piece its own size, turn and tone
      vec4 kp = kind < .5 ? vec4(16., 2.3, .1, .25) : kind < 1.5 ? vec4(22., 3.1, 1., .34) : kind < 2.5 ? vec4(30., 4.2, 1., .4) : vec4(10., 1.5, 1., .44);
      vec2 cp = vec2(ang * .15915 * kp.x, vObj.y * kp.y + seed * 9.);
      vec3 A = pieces(cp, kp, kind, seed), B = pieces(cp + vec2(.5, .53), kp, kind, seed + .37);
      vec3 pcA = vCol.rgb, pcB = vCol.rgb;
      if (kind > 1.5 && kind < 2.5) { pcA *= mix(vec3(.55, .45, .55), vec3(1.25, 1., 1.05), A.z); pcB *= mix(vec3(.55, .45, .55), vec3(1.25, 1., 1.05), B.z); }
      if (kind < .5) pcA = mix(pcA, vec3(1.), .3 * smoothstep(.45, .8, vnoise(cp * 7.)));                           // icing sugar
      vec3 inside = mix(mix(vCol.rgb * .34, pcB * B.x * .6, B.y), pcA * A.x, A.y);
      lit = inside * (uSunCol * max(nl * .5 + .5, 0.) * beam * .7 + ambient(N) * 1.35);
      lit += inside * uSunCol * beam * (.5 * pow(max(dot(-V, Ls), 0.), 1.5) + .3 + .25 * (1. - nv));        // sun-filled: the light comes through it
      lit = mix(lit, clear * .9 + vCol.rgb * .1, 1. - smoothstep(-.2, .08, 2.26 - vObj.y - .06 * sin(ang * 5. + seed * 40.)));   // heaped, not level
    } else {
      // a laid glass: the same clear tea as the hero's, its level a finger under the gold rim
      float top = vColor.g, rr = length(vObj.xz) / .39, core = mix(nv, .35 + .65 * smoothstep(.55, .98, rr), top);
      lit = teaShadeK(N, V, vL, core, 220.);
      lit = mix(lit, lit * .8 + uTea * uSkyCol * 1.2, top * (1. - smoothstep(.3, .9, rr)) * (1. - uTeaP.x));
    }
    col = mix(clear, lit, vColor.r);
    col *= 1. - uVes.z * .22 * rib;
    col += envLight(R, beam) * (.08 + .55 * fres) * (.55 + .45 * rib) * (1. - vColor.g);
    // the windows, as one long light down the glass, broken by the flutes
    vec2 Nh = normalize(N.xz + vec2(1e-4, 0.)), Hh = normalize((vec3(-.85, .4, -.15) + V).xz + vec2(1e-4, 0.));
    col += uSkyCol * uFill.a * mix(.2, .34, jar) * pow(max(dot(Nh, Hh), 0.), mix(60., 34., jar)) * (1. - uVes.z * .6 * (1. - rib)) * (1. - vColor.g) * smoothstep(1., .6, abs(N.y));
    col += uSunCol * beam * 1.2 * pow(max(dot(R, Ls), 0.), 60.);
  } else {
    float metal = step(1.5, vPart);
    vec3 alb = vColor;
    col = alb * ((1. - metal * .5) * uSunCol * max(nl, 0.) * beam + (1. - metal * .5) * ambient(N) * 1.15);
    col += mix(vec3(.05), alb, metal) * envLight(R, beam) * mix(.25, 1.2, metal) + fres * .2 * envLight(R, beam);
    col += mix(vec3(.6), alb, metal) * uSunCol * beam * pow(max(dot(R, Ls), 0.), 40.) * 1.2;
  }
  gl_FragColor = vec4(clamp(col, 0., 24.), 1.);
  #include <fog_fragment>
}`;function wt(t,e,r,n){const a=e.length,o=new Float32Array(a*4),l=new Float32Array(a*4),b=new Float32Array(a*4);e.forEach((F,L)=>{o.set(F.pos,L*4),l.set(F.col,L*4),b.set(F.lid||[0,0,1,0],L*4)});const B=new u.Mesh(se(t,a,{iPos:[o,4],iCol:[l,4],iLid:[b,4]}),r(bo,Mo,n));return B.frustumCulled=!1,B}const ve=t=>[t,0,0,1],xt=t=>(e,r,n,a)=>a.setRGB(r<t?1:0,0,0);function zo(t,e,r,n,a){const o=X.makeBuilder();o.add(J([[.02,.03],[1,.03],[1.15,.28],[1.17,1.2],[1.15,2.2],[.97,2.55],[.8,2.7],[.8,2.86]],20),{surf:ve(0),tint:xt(2.6)}),o.add(J([[.02,2.86],[.9,2.86],[.93,3.02],[.55,3.1],[.16,3.14],[.2,3.3],[.02,3.36]],16),{c:h0,surf:ve(2)}),o.add(J([[.02,0],[1.02,0],[1.02,.05]],14),{c:"#0a0c10",surf:ve(1)});const l=[["#eda4b8",0],["#bfe0b0",0],["#ead9b4",1],["#c2304e",2],["#e9c41c",3],["#f3c9d2",1],["#d8e4f2",1]],b=[],B=22,F=(s0.z0-s0.z1-5)/(B-1);for(let c=0;c<2;c++)for(let S=0;S<B;S++){const h=s0.z0-2.5-S*F+(t()-.5)*.5,k=15.3+(t()-.5)*.8,N=c?s0.hi:s0.lo,R=l[(S*3+c*2+Math.floor(t()*2))%l.length],O=new u.Color(R[0]),z=c===0&&(S===3||S===7)?[-13-S,3.5-S,1.25,1]:null;b.push({pos:[k,N,h,n(c,h)],col:[O.r,O.g,O.b,R[1]+t()*.98],lid:z})}return{mesh:wt(o.build(),b,e,{uTauC:r,uVes:{value:new i0(18,3.4,1)},uTea:{value:new u.Color("#C8791C")},uTeaP:{value:new i0(0,1,.4)}}),triangles:o.triangles*b.length}}function Co(t,e,r,n,a){const o={vs:[0,.07,.2,.36,.5,.62,.78,.92,1],rs:[.3,.365,.39,.34,.27,.275,.35,.425,.47]},l=1.5,b=X.makeBuilder();b.add(J(o.vs.map((c,S)=>[o.rs[S],.1+c*l]),9),{surf:ve(0),tint:xt(.1+.86*l)}),b.add(J([[.02,.1+.86*l],[.385,.1+.86*l]],9),{surf:ve(0),tint:(c,S,h,k)=>k.setRGB(1,1,0)}),b.add(J([[.455,.1+.93*l],[.49,.1+l],[.45,.1+l]],9),{c:"#e2b85a",surf:ve(2)}),b.add(J([[.02,0],[.5,0],[.86,.1],[.9,.16],[.5,.08],[.02,.08]],10),{c:"#ebe6da",surf:ve(1),tint:(c,S,h,k)=>{const N=Math.hypot(c,h);N>.6&&N<.88&&k.set(a)}});const B=new u.Color(n),F=[];for(const c of Ie)for(const[S,h]of[[1.7,5],[3.3,8],[4.75,11]])for(let k=0;k<h;k++){const N=(k+t()*.2)/h*B0+S;F.push({pos:[Math.cos(N)*S,z0.top+.22,c+Math.sin(N)*S,1e3],col:[B.r,B.g,B.b,t()*.98]})}for(const[c,S]of de.at)F.push({pos:[c,z0.top+.22,S,1e3],col:[B.r,B.g,B.b,t()*.98]});return{mesh:wt(b.build(),F,e,{uTauC:{value:0},uVes:{value:new i0(0,.01,0)},uTea:{value:B},uTeaP:{value:new i0(r.load==="milk"?1:0,1,r.load==="milk"?.3:.45)}}),sources:F.map(c=>[c.pos[0],c.pos[1]+1.5,c.pos[2],.95]),triangles:b.triangles*F.length}}const qe=16,ue=1.1,Pe=4.2,Ee=[0,3.22,3.05],gt=`
uniform mat4 uBone[${qe}]; uniform vec4 uShellP;        // fur length, comb back along the body, droop, -
attribute vec3 color; attribute vec4 skin; attribute vec2 furA; attribute float aShell;
varying vec3 vL; varying vec3 vN; varying vec3 vView; varying vec3 vObj; varying vec3 vColor; varying vec3 vFur;
${te}
void main() {
  mat4 A = uBone[int(skin.x + .5)], Bm = uBone[int(skin.y + .5)];
  vec3 P = mix((A * vec4(position, 1.)).xyz, (Bm * vec4(position, 1.)).xyz, skin.z);
  vec3 N = normalize(mix(mat3(A) * normal, mat3(Bm) * normal, skin.z) + vec3(0., 1e-5, 0.));
  vec3 back = normalize(mat3(A) * vec3(0., -.3, -1.) + vec3(0., 1e-5, 0.));
  float h = aShell * furA.x * uShellP.x;
  P += (N + back * (uShellP.y * aShell)) * h; P.y -= uShellP.z * h * aShell;
  vObj = position; vColor = color; vFur = vec3(aShell, furA.x, skin.w);
  ${je}
}`,bt=`
${Z0.light}
uniform vec4 uFur; uniform vec3 uEye;                         // uFur: rgb stripe colour, a how tabby; uEye: the iris
varying vec3 vL; varying vec3 vN; varying vec3 vView; varying vec3 vObj; varying vec3 vColor; varying vec3 vFur;
${ne}
float h1(float n) { return fract(sin(n) * 43758.5453); }
float n3(vec3 p) {
  vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); float n = i.x + i.y * 57. + i.z * 113.;
  return mix(mix(mix(h1(n), h1(n + 1.), f.x), mix(h1(n + 57.), h1(n + 58.), f.x), f.y), mix(mix(h1(n + 113.), h1(n + 114.), f.x), mix(h1(n + 170.), h1(n + 171.), f.x), f.y), f.z);
}
void main() {
  vec3 V = normalize(vView + vec3(1e-5)), N = normalize(vN + vec3(0., 1e-5, 0.)); if (dot(N, V) < 0.) N = -N;
  float sh = vFur.x, coat = vFur.y, head = step(.5, vFur.z), furry = step(.02, coat);
  vec3 alb = vColor;
  // tabby: bands across the back and round the tail, rings on the legs, darker along the spine
  float wob = n3(vObj * 1.4) * 1.6, band = smoothstep(.15, .6, sin(vObj.z * 4.6 + wob)) * smoothstep(1.5, 2.6, vObj.y) * (1. - head);
  band = max(band, smoothstep(.2, .6, sin(vObj.y * 7.5 + wob)) * (1. - smoothstep(1.3, 1.9, vObj.y)) * step(.25, vObj.y));
  band = max(band, .7 * smoothstep(.35, .0, abs(vObj.x)) * smoothstep(2.9, 3.25, vObj.y) * (1. - head));
  float tone = .86 + .24 * n3(vObj * vec3(7., 7., 3.));
  alb = mix(alb * tone, uFur.rgb * tone, band * uFur.a * furry);
  // the face, in the head's own space: almond eyes set in dark rims with a slit pupil and a catch light, the nose, the mouth
  vec3 hp = vObj - vec3(${Ee[0].toFixed(2)}, ${Ee[1].toFixed(2)}, ${Ee[2].toFixed(2)});
  vec2 e = vec2(abs(hp.x) - .36, hp.y - .1); e = vec2(e.x * .978 + e.y * .208, -e.x * .208 + e.y * .978);
  float al = pow(abs(e.x) / .235, 1.6) + (e.y * e.y) / .0155, front = head * step(.2, hp.z);
  float eye = (1. - smoothstep(.8, 1., al)) * front * (1. - smoothstep(.062, .09, e.y)), rimE = (1. - smoothstep(1.05, 1.24, al)) * front;
  vec2 nq = vec2(hp.x, hp.y + .2);
  float nose = (1. - smoothstep(.075, .1, max(abs(nq.x) + nq.y * .7, -nq.y * 1.5 - .03))) * head * step(.82, hp.z);
  float mouth = (1. - smoothstep(.012, .03, abs(abs(hp.x) - .1 * smoothstep(-.3, -.42, hp.y)))) * step(hp.y, -.27) * step(-.42, hp.y) * head * step(.7, hp.z);
  float paint = max(max(rimE, nose), mouth);
  if (sh > .01 && paint > .3) discard;                          // no fur over the eyes and the nose
  float beam = beamMask(vL); vec3 Ls = normalize(uSunDir);
  float nl = dot(N, Ls), nv = clamp(dot(N, V), 0., 1.);
  alb = mix(alb, vec3(.03, .025, .02), rimE * .9); alb = mix(alb, vec3(.42, .2, .19), nose); alb = mix(alb, vec3(.12, .07, .06), mouth * .8);
  float pupil = 1. - smoothstep(.8, 1.15, length(e / vec2(.056, .11)));
  vec3 iris = mix(uEye * 1.12, uEye * .34, smoothstep(.3, 1., al)) * (1. - .93 * pupil);
  // coat: a soft wrapped light, shade from sky and floor, and the sun caught along the edge of the fur
  float wrap = max(nl * .62 + .38, 0.);
  vec3 col = alb * (uSunCol * wrap * beam * .56 + ambient(N) * 1.25) * mix(1., mix(.66, 1.1, sh), furry);
  col += alb * uSunCol * beam * (.55 + .12 * sh) * pow(1. - nv, 2.5) * max(nl * .5 + .5, 0.) * furry;
  col += alb * (ambient(-N) * .5 + uSkyCol * .3) * (1. - nv) * (1. - nv) * furry * (1. - .7 * sh);
  col = mix(col, iris * (uSunCol * beam * .35 + ambient(vec3(0., 1., 0.)) * 2.2) + vec3(1.6) * (1. - smoothstep(.02, .045, length(e - vec2(-.06, .04)))), eye);
  col += (nose + rimE * (1. - eye)) * uSunCol * beam * .25 * pow(max(dot(reflect(-V, N), Ls), 0.), 20.);
  float a = 1.;
  if (sh > .01) {
    float strand = .4 * n3(vObj * vec3(8.5, 8.5, 4.)) + .3 * n3(vObj * vec3(27., 27., 12.) + 7.) + .3 * n3(vObj * vec3(2.7, 2.7, 1.5) + 3.);
    a = smoothstep(sh * .8, sh * .8 + .28, strand + .16) * furry * (1. - .62 * sh);       // the outer shells are thin: tufts, not a halo
    if (a < .05) discard;
  }
  gl_FragColor = vec4(clamp(col, 0., 24.), a);
  #include <fog_fragment>
}`;function So(){const t=[],e=[],r=[],n=[],a=[],o=[],l=new u.Color,b={skin:[0,0,0,0],fur:1};let B=0;return{add(F,L){const c=F.attributes.position,S=F.attributes.normal,h=F.attributes.color,k=F.index;for(let N=0;N<c.count;N++){const R=c.getX(N),O=c.getY(N),z=c.getZ(N);l.setRGB(1,1,1),b.fur=1,L(R,O,z,h?h.getX(N):1,l,b),t.push(R,O,z),e.push(S.getX(N),S.getY(N),S.getZ(N)),r.push(l.r,l.g,l.b),n.push(b.skin[0],b.skin[1],b.skin[2],b.skin[3]),a.push(b.fur,0)}for(let N=0;N<k.count;N++)o.push(k.getX(N)+B);B+=c.count},build(F){const L=new u.InstancedBufferGeometry;return L.setAttribute("position",new u.Float32BufferAttribute(t,3)),L.setAttribute("normal",new u.Float32BufferAttribute(e,3)),L.setAttribute("color",new u.Float32BufferAttribute(r,3)),L.setAttribute("skin",new u.Float32BufferAttribute(n,4)),L.setAttribute("furA",new u.Float32BufferAttribute(a,2)),L.setIndex(o),L.setAttribute("aShell",new u.InstancedBufferAttribute(new Float32Array(F),1)),L.instanceCount=F.length,L},get triangles(){return o.length/3}}}const we=[[0,2.5,-1.3],[0,2.45,0],[0,2.4,1.3],[0,3.05,2.55],[.5,2.3,1.45],[-.5,2.3,1.45],[.56,2.4,-1.5],[-.56,2.4,-1.5],[.5,1.15,1.45],[-.5,1.15,1.45],[.56,1.2,-1.5],[-.56,1.2,-1.5],[0,2.72,-2.15],[0,2.72,-3.4],[0,2.72,-4.6],[0,0,0]],Ze=[{up:4,lo:8,body:2,l1:1.15,l2:1.3,bend:-1,ph:0},{up:5,lo:9,body:2,l1:1.15,l2:1.3,bend:-1,ph:.5},{up:6,lo:10,body:0,l1:1.2,l2:1.45,bend:1,ph:.55},{up:7,lo:11,body:0,l1:1.2,l2:1.45,bend:1,ph:.05}];function ko(t,e){const r=new u.Color(e?"#c06c26":"#e9e6df"),n=new u.Color(e?"#ecd2a4":"#f2f0ea"),a=new u.Color("#c98f88"),o=So(),l=F0,b=Ee,B=[[-2.3,.22,.26,2.62],[-2.1,.6,.68,2.52],[-1.7,.84,.9,2.42],[-1.2,.9,.96,2.38],[-.6,.8,.84,2.42],[0,.74,.78,2.46],[.6,.8,.86,2.42],[1.1,.88,.98,2.36],[1.5,.84,1,2.38],[1.85,.7,.9,2.5],[2.1,.56,.74,2.66],[2.3,.5,.62,2.82],[2.5,.47,.56,2.98],[2.7,.5,.56,3.1]];o.add(ee(B.length,18,(v,f,d)=>{const[M,p,x,A]=B[v],m=Math.sin(f),T=Math.cos(f),V=Math.exp(-(((M-1.4)/.38)**2))*Math.max(m,0)**2*Math.abs(T)*.5+Math.exp(-(((M+1.45)/.5)**2))*Math.abs(T)**1.5*.13;return d.set(-p*T*(1+V),A+x*m*(m<0?.9:1+.4*V),M),1},!0,!0),(v,f,d,M,p,x)=>{const A=l(2.2,1.75,f)*(d>1.3?1:.8),m=l(1.7,2.2,d)*l(2.9,2.3,f);p.copy(r).lerp(n,Math.max(A,m)),x.fur=1+.35*m+.15*A,d<0?(x.skin[0]=0,x.skin[1]=1,x.skin[2]=l(-1.6,0,d)):d<1.6?(x.skin[0]=1,x.skin[1]=2,x.skin[2]=l(0,1.5,d)):(x.skin[0]=2,x.skin[1]=3,x.skin[2]=l(1.9,2.7,d)),x.skin[3]=0});const F=[[-.78,.2,.2,0],[-.6,.56,.52,.02],[-.3,.76,.68,.04],[.05,.86,.72,.02],[.32,.84,.68,-.02],[.5,.7,.56,-.08],[.64,.5,.42,-.16],[.8,.4,.33,-.2],[.92,.3,.25,-.22],[1,.16,.14,-.2]];o.add(ee(F.length,20,(v,f,d)=>{const[M,p,x,A]=F[v],m=Math.sin(f),T=Math.cos(f),V=v>=2&&v<=5?.16*Math.sqrt(Math.max(-m,0))*Math.abs(T):0;return d.set(b[0]-p*T*(1+V),b[1]+A+x*m*(m>0?.92:1),b[2]+M),1},!0,!0),(v,f,d,M,p,x)=>{const A=d-b[2],m=f-b[1],T=l(.5,.72,A);p.copy(r).lerp(n,Math.max(T,l(-.2,-.5,m))),x.fur=p0(.55+.45*l(.1,-.4,m)*l(.6,.2,A),.2,T),x.skin[0]=3,x.skin[1]=3,x.skin[2]=0,x.skin[3]=1});for(const v of[-1,1])for(const f of[0,1]){const d=new u.PlaneGeometry(1,1,4,4),M=d.attributes.position,p=new u.Matrix4().makeRotationFromEuler(new u.Euler(-.12,v*.5,-v*.3,"YXZ")),x=new i0,A=new Float32Array(M.count);for(let m=0;m<M.count;m++){const T=M.getX(m),V=M.getY(m)+.5;x.set(T*.7*(1-.9*Math.pow(V,1.3)),V*.84,-.17*(1-4*T*T)*(1-V)-(f?.04:0)).applyMatrix4(p),M.setXYZ(m,b[0]+v*.5+x.x,b[1]+.46+x.y,b[2]-.08+x.z),A[m]=!f&&Math.abs(T)<.3*(1-V)+.06&&V<.82?1:0}if(f){const m=d.index.array;for(let T=0;T<m.length;T+=3){const V=m[T+1];m[T+1]=m[T+2],m[T+2]=V}}d.computeVertexNormals(),d.setAttribute("color",new u.Float32BufferAttribute(new Float32Array(M.count*3),3));for(let m=0;m<M.count;m++)d.attributes.color.setX(m,A[m]);o.add(d,(m,T,V,E,o0,r0)=>{o0.copy(r).lerp(a,E),r0.fur=E>.5?.1:f?.4:.3,r0.skin[0]=3,r0.skin[1]=3,r0.skin[2]=0,r0.skin[3]=0})}const L=[[-1.15,.24,.26],[-.8,.26,.29],[-.45,.31,.36],[-.1,.38,.45],[.25,.42,.5]],c=[[-1.3,.14,.2,.27],[-1.22,.13,.27,.36],[-1.04,.03,.19,.21],[-.6,0,.2,.21],[-.2,0,.225,.24],[.1,0,.24,.26]],S=[[-1.2,.26,.3,0],[-.85,.34,.48,-.05],[-.45,.44,.66,-.1],[-.05,.5,.78,-.1],[.3,.46,.7,-.05]],h=[[-1.45,.16,.2,.3],[-1.36,.14,.27,.38],[-1.2,.02,.19,.22],[-.95,-.25,.17,.2],[-.72,-.42,.2,.24],[-.45,-.3,.21,.27],[-.15,-.08,.25,.32],[.1,0,.27,.34]];Ze.forEach(v=>{const f=v.bend>0,d=we[v.up],M=we[v.lo],p=f?S:L,x=f?h:c;o.add(ee(p.length,10,(A,m,T)=>{const V=p[A];return T.set(d[0]+Math.cos(m)*V[1],d[1]+V[0],d[2]+(V[3]||0)+Math.sin(m)*V[2]),1},!1,!0),(A,m,T,V,E,o0)=>{const r0=(m-d[1]+p[0][0]*-1)/(p[p.length-1][0]-p[0][0]);E.copy(r),o0.fur=.8,o0.skin[0]=v.up,o0.skin[1]=v.body,o0.skin[2]=.7*l(.5,1,r0),o0.skin[3]=0}),o.add(ee(x.length,10,(A,m,T)=>{const V=x[A],E=A<2?1+.07*Math.cos(3*m-j/2)*Math.max(Math.sin(m),0):1;return T.set(M[0]+Math.cos(m)*V[2]*E,M[1]+V[0],M[2]+V[1]+Math.sin(m)*V[3]*E),1},!0,!0),(A,m,T,V,E,o0)=>{const r0=m-M[1];E.copy(r).lerp(n,l(-.9,-1.15,r0)),o0.fur=p0(.5,.26,l(-.9,-1.15,r0)),o0.skin[0]=v.lo,o0.skin[1]=v.up,o0.skin[2]=.5*l(-.35,.1,r0),o0.skin[3]=0})});const k=12,N=-5.85,R=-2.05;o.add(ee(k,10,(v,f,d)=>{const M=v/(k-1),p=v===0?.1:p0(.21,.31,M)*(1-.12*Math.sin(M*9));return d.set(-Math.cos(f)*p,2.72+Math.sin(f)*p,p0(N,R,M)),1},!0,!0),(v,f,d,M,p,x)=>{p.copy(r).lerp(n,l(-5.4,-5.85,d)*.7),x.fur=1.5-.3*l(-5,-5.85,d),x.skin[3]=0,d>-3.7?(x.skin[0]=12,x.skin[1]=13,x.skin[2]=l(-2.7,-3.7,d)):(x.skin[0]=13,x.skin[1]=14,x.skin[2]=l(-3.9,-4.9,d))});const O=[],z=[];for(let v=0;v<qe;v++)O.push(new u.Matrix4),z.push(new u.Matrix4);const G={uBone:{value:O},uFur:{value:new u.Vector4(.2,.065,.02,e?1:0)},uEye:{value:new u.Color(e?"#7ea83a":"#d79a1e")},uShellP:{value:new u.Vector4(.3,.55,.22,0)}},W=new u.Mesh(o.build([0]),t(gt,bt,G));W.frustumCulled=!1,W.name="cat";const D=new u.Mesh(o.build([.2,.4,.6,.8,1]),t(gt,bt,G,{transparent:!0,depthWrite:!1}));D.frustumCulled=!1,D.renderOrder=3,D.name="cat-coat";const g=new u.Matrix4,H=new u.Matrix4,a0=new u.Quaternion,i=new u.Euler,s=new i0,C=new i0(1,1,1),w=new i0,P=new i0(ue,ue,ue),_=(v,f,d,M,p,x,A,m)=>{i.set(x,A,m,"YXZ"),a0.setFromEuler(i),s.set(d,M,p),H.compose(s,a0,C),f?v.multiplyMatrices(f,H):v.copy(H)};function y(v){const f=v.curl,d=1-f,M=v.s/(Pe*ue),p=M*B0,x=v.air>=0?Math.sin(v.air*j):0,A=v.time;i.set(v.air>=0?.36*Math.cos(v.air*j)*v.hopSign:0,v.yaw||0,0,"YXZ"),a0.setFromEuler(i),s.set(v.x,v.y,v.z),g.compose(s,a0,P);const m=.045*Math.sin(p*2)*d,T=.035*Math.sin(A*1.6)*f;_(z[1],null,.2*f,2.28+m-1.33*f+T,0,0,0,0),_(z[0],z[1],0,.05,-1.3,-.05*Math.sin(p+.6)*d+.2*x*v.hopSign,.08*Math.sin(p)*d+.75*f,0),_(z[2],z[1],0,-.05,1.3,.04*Math.sin(p)*d-.18*x*v.hopSign,-.08*Math.sin(p)*d-.8*f,0),_(z[3],z[2],0,.65,1.25,.08*d+.05*Math.sin(p*2+1)*d+.42*f+.1*x,(v.look||0)*d+.08*Math.sin(A*.9)*d-.95*f,.22*f);const V=.28*Math.sin(A*1.3)*d+.1*Math.sin(p);_(z[12],z[0],0,.22,-.85,p0(.8-.45*x,-.12,f),V*.6+.95*f,0),_(z[13],z[12],0,0,-1.25,p0(.25,0,f),V*.8+.95*f,0),_(z[14],z[13],0,0,-1.2,p0(-.8,0,f),.4*Math.sin(A*2.1+1)*(.3+.7*d)+.85*f,0);for(const E of Ze){const o0=we[E.body],r0=we[E.up],C0=E.bend>0;w.set(r0[0]-o0[0],r0[1]-o0[1],r0[2]-o0[2]).applyMatrix4(z[E.body]);const y0=((M+E.ph)%1+1)%1;let K0,Y0;if(y0<.62)K0=r0[2]+Pe*(y0-.31),Y0=0;else{const re=(y0-.62)/.38;K0=r0[2]+Pe*(.31-.62*re*re*(3-2*re)),Y0=.55*Math.sin(j*re)}K0=p0(K0,w.z+(C0?-.9:.9),x),Y0=p0(Y0,w.y-1.95,x),K0=p0(K0,w.z+(C0?.8:.9),f),Y0=p0(Y0,w.y-.5,f);const fe=K0-w.z,xe=w.y-Y0,H0=T0(Math.hypot(fe,xe),Math.abs(E.l1-E.l2)+.05,E.l1+E.l2-.02),ge=Math.atan2(fe,xe)+E.bend*Math.acos(T0((E.l1*E.l1+H0*H0-E.l2*E.l2)/(2*E.l1*H0),-1,1)),Re=w.y-E.l1*Math.cos(ge),be=w.z+E.l1*Math.sin(ge);_(z[E.up],null,w.x,w.y,w.z,-ge,0,0),_(z[E.lo],null,w.x,Re,be,-Math.atan2(K0-be,Math.max(Re-Y0,.05)),0,0)}for(let E=0;E<qe-1;E++){const o0=we[E];H.makeTranslation(-o0[0],-o0[1],-o0[2]),O[E].multiplyMatrices(g,z[E]).multiply(H)}O[qe-1].copy(g)}return{mesh:W,fur:D,pose:y,triangles:o.triangles*6}}const Ao=`
uniform float uTime;
attribute vec4 iS; attribute vec4 iR;
varying vec2 vUv; varying vec2 vA; varying vec3 vL;
${te}
void main() {
  float age = fract(iR.x - uTime * iR.y); vec3 C; float size;
  if (iR.z < .5) {
    float w = iS.w, wob = sin(age * 5. + iR.x * 40.);
    vec2 d = vec2(cos(iR.w), sin(iR.w)) * (age * 1.5 + .45 * wob) * w * age;
    C = iS.xyz + vec3(d.x, (age * age * 6.5 + age * 2.2) * w, d.y); size = w * (.55 + 3.4 * age);
    vA = vec2(smoothstep(0., .1, age) * (1. - age) * (1. - age) * .5, 0.);
  } else {
    float f = 1. - age, g = 1. - (1. - f) * (1. - f);
    C = iS.xyz + vec3(0., iS.w * g, 0.); size = .3; vA = vec2(.95 * smoothstep(0., .08, f) * (1. - smoothstep(.93, 1., f)), 1.);
  }
  vUv = position.xy * 2.;
  vec4 wp = modelMatrix * vec4(C, 1.); vL = wp.xyz + vec3(0., 0., ${(-G0).toFixed(1)});
  vec4 mvPosition = viewMatrix * wp; mvPosition.xy += position.xy * size; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,To=`
${Z0.light}
uniform vec3 uDrop;
varying vec2 vUv; varying vec2 vA; varying vec3 vL;
${ne}
void main() {
  float d = dot(vUv, vUv), beam = beamMask(vL);
  float soft = 1. - smoothstep(.1, 1., d);
  vec3 steam = uSunCol * beam * .3 + uSkyCol * 1.5 + uFill.rgb * 1.2 + uBounceCol * .3;
  vec3 col = mix(steam, uDrop * (uSunCol * beam + uSkyCol) * 1.4, vA.y);
  float a = vA.x * mix(soft * soft, 1. - smoothstep(.5, .8, d), vA.y);
  gl_FragColor = vec4(clamp(col, 0., 24.), a);
  #include <fog_fragment>
}`;function Po(t,e,r,n,a,o,l,b){const B=[],F=[];for(const S of n){const h=Math.round(22*b);for(let k=0;k<h;k++)B.push(S[0],S[1],S[2],S[3]*(.8+t()*.5)),F.push(t(),.1+t()*.06,0,t()*B0)}for(const S of a)t()>.85*b||(B.push(S[0],S[1],S[2],S[3]*(.7+t()*.5)),F.push(t(),.16+t()*.1,0,t()*B0));for(let S=0;S<4;S++)B.push(o[0]-2.62,o[1]+.75,o[2],1.6),F.push(S/4+t()*.1,.42,1,0);const L=F.length/4,c=new u.Mesh(se(me(),L,{iS:[new Float32Array(B),4],iR:[new Float32Array(F),4]}),e(Ao,To,{uTime:r,uDrop:{value:new u.Color(l)}},{transparent:!0,depthWrite:!1}));return c.frustumCulled=!1,c.renderOrder=9,{mesh:c,triangles:L*2}}const Fo=`
uniform float uTime; uniform float uU;
attribute vec3 color; attribute vec4 surf; attribute vec4 iP; attribute vec4 iQ;
varying vec3 vN; varying vec3 vColor; varying vec3 vView;
${te}
void main() {
  float sit = step(.5, iQ.w), k = smoothstep(.9, .99, uU) * sit, flying = mix(1., smoothstep(0., .08, k), sit);
  vec3 p = position, n = normal; float side = surf.x < .5 ? 0. : (surf.x < 1.5 ? 1. : -1.);
  float flap = sin(uTime * (9. + 3. * fract(iQ.x * 7.)) + iQ.x * 30.) * .85 * flying + (1. - flying) * 1.25;
  if (side != 0.) {                                             // wings hinge on the shoulder; folded down the flanks when sitting
    float a = flap * side, c = cos(a), s = sin(a); vec2 h = vec2(.3 * side, .2);
    vec2 q = p.xy - h; q.x *= mix(1., .35, 1. - flying); p.xy = h + vec2(q.x * c - q.y * s, q.x * s + q.y * c); n.xy = vec2(n.x * c - n.y * s, n.x * s + n.y * c);
  }
  float dir = iP.w < 0. ? -1. : 1.;                             // facing; travel is the opposite way
  p.z *= dir; p.x *= dir; n.z *= dir; n.x *= dir;
  vec3 C;
  if (iQ.y < .5) { C = vec3(iP.x, iP.y + iQ.z * sin(uTime * .7 + iQ.x * 20.), -492. + mod(iP.z - iP.w * uTime + 5500., 560.)); }
  else { p = vec3(p.z, p.y, -p.x); n = vec3(n.z, n.y, -n.x); C = vec3(-150. + mod(iP.x - iP.w * uTime + 3000., 300.), iP.y + iQ.z * sin(uTime * .7 + iQ.x * 20.), iP.z); }
  if (sit > .5) { p = vec3(position.x, position.y, position.z); n = normal; if (side != 0.) { float a = flap * side, c = cos(a), s = sin(a); vec2 h = vec2(.3 * side, .2); vec2 q = p.xy - h; q.x *= mix(.35, 1., flying); p.xy = h + vec2(q.x * c - q.y * s, q.x * s + q.y * c); }
    C = iP.xyz + k * k * vec3(iQ.z * 9., 15., -34.) + vec3(0., .5 * flying * sin(uTime * 3.), 0.); }
  vec3 P = C + p * 1.9;
  vec4 wp = modelMatrix * vec4(P, 1.); vN = n; vColor = color; vView = cameraPosition - wp.xyz;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,No=`
uniform vec3 uSunDir; uniform vec3 uSunCol; uniform vec3 uSkyCol; uniform float uOut;
varying vec3 vN; varying vec3 vColor; varying vec3 vView;
${ne}
void main() {
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)), V = normalize(vView + vec3(1e-5)); if (dot(N, V) < 0.) N = -N;
  vec3 col = vColor * (uSunCol * uOut * .45 * max(dot(N, normalize(uSunDir)) * .6 + .4, 0.) + uSkyCol * (2.2 + N.y));
  gl_FragColor = vec4(clamp(col, 0., 24.), 1.);
  #include <fog_fragment>
}`;function Ro(t,e,r,n,a){const o=X.makeBuilder(),l="#7f8a98",b="#3d4654",B=V0(1,10,7);B.scale(.42,.42,1),o.add(B,{c:l,surf:[0,0,0,1],tint:(k,N,R,O)=>{R>.55&&O.set("#3f6a5c"),N<-.2&&O.multiplyScalar(1.25)}}),o.add(V0(.26,8,6),{p:[0,.3,1],c:b,surf:[0,0,0,1]}),o.add(new u.ConeGeometry(.07,.3,5),{p:[0,.27,1.32],r:[j/2,0,0],c:"#d8b060",surf:[0,0,0,1]});const F=(k,N,R)=>{for(let O=1;O+1<k.length;O++)o.quad(k[0],k[O],k[O+1],k[O+1],R,[N,0,0,1])};F([[0,.05,-.7],[.5,.05,-1.75],[.2,.05,-1.9],[-.2,.05,-1.9],[-.5,.05,-1.75]],0,b);for(const k of[1,-1])F([[k*.3,.2,.55],[k*1.5,.2,.6],[k*2.5,.2,.15],[k*2.6,.2,-.35],[k*1.4,.2,-.5],[k*.3,.2,-.45]],k>0?1:2,l),F([[k*1.3,.22,.1],[k*2.5,.22,.05],[k*2.6,.22,-.35],[k*1.4,.22,-.5]],k>0?1:2,b);const L=[],c=[],S=24;for(let k=0;k<S;k++){const N=Math.floor(k/3),R=(7+N*37%5)*(N%2?1:-1);if(k<18)L.push(U-12-N%3*5-t()*3,14+N*5.3%17+t()*4,N*117+k%3*7+t()*3,R),c.push(t(),0,.8+t(),0);else if(k<22)L.push(N*70+k%3*7,16+k%3*3.5+t()*3,K-26-t()*12,R*.8),c.push(t(),1,.6+t(),0);else{const O=k===22?-1:1;L.push(O*9.6,k0.y0+1.2,K+3.2,1),c.push(t(),0,O,1)}}const h=new u.Mesh(se(o.build(),S,{iP:[new Float32Array(L),4],iQ:[new Float32Array(c),4]}),e(Fo,No,{uTime:r,uU:n,uOut:{value:a.wallSun}}));return h.frustumCulled=!1,{mesh:h,triangles:o.triangles*S}}const _o=[[16,7,18.5],[16,7,0],[2,7.3,-24],[-14,7.8,-50],[-19.5,8.6,-80],[-9.5,12.5,-104],[-10.5,18.5,-117.5],[-7.2,27,-130],[-1,28.5,-142],[2,26,-152],[1,23,-168],[-13,14.8,-214],[-14.5,15.2,-237],[4.5,18.8,-257.5],[11.4,21,-267],[9.7,21.3,-274.4],[3,19.5,-282],[-2,15,-293],[3.8,11.9,-320],[4.1,12.3,-345],[3.6,19.6,-366],[.8,17.4,-389],[0,18.8,-408],[0,18.8,-468]],Fe=Vt(_o),Ne={lag:7.5,a:[.3376,.3945],b:[.408,.462]};function Lo(t){const e=t.length,r=new u.Vector3,n=o=>Ne.lag*F0(Ne.a[0]*e,Ne.a[1]*e,o)*(1-F0(Ne.b[0]*e,Ne.b[1]*e,o)),a={base:t,length:e,points:t.points,curve:t.curve,start:t.start,end:t.end,startTangent:t.startTangent,endTangent:t.endTangent,lagSlope:o=>n(o*e+.5)-n(o*e-.5),posAtDist(o,l=new u.Vector3){return t.posAtDist(o-n(o),l)},tangentAtDist(o,l=new u.Vector3){return a.posAtDist(o+.3,l),a.posAtDist(o-.3,r),l.sub(r).normalize()},pointAt(o,l=new u.Vector3){return a.posAtDist(o*e,l)},tangentAt(o,l=new u.Vector3){return a.tangentAtDist(o*e,l)},nearestXZ:(o,l)=>t.nearestXZ(o,l),distanceTo:(o,l,b)=>t.distanceTo(o,l,b),isClear:(o,l,b,B,F)=>t.isClear(o,l,b,B,F),frameAt:(o,l,b)=>t.frameAt(o,l,b)};return a}const Mt=Lo(Fe),zt=525.6925,Xe=t=>1-(1-t)*Fe.length/zt,Ct=zt/511.187,Ue=t=>1-(1-t)*Ct,Oo=t=>1-(1-t)/Ct,l0={walk:.572,hold:[.588,.618],hop1:[.63,.66],hop2:[.735,.765],curl:[.795,.822],lane:11.6,stand:[13.6,-287.2],off:[13.6,-287.3]},Bo=Ue(l0.hop1[1]),Vo=Le([.36,.4,.45,.51,l0.walk],[-180,-187.5,-212,-247,-285.5]),jo=Le([Bo,.7,l0.hop2[0]],[-313,-327.5,-350.5]);function De(t,e){const r=F0;if(e.air=-1,e.hopSign=1,e.x=l0.lane,e.yaw=0,t<=l0.walk)return e.z=Vo(t),e.y=M0.top,e.x=p0(14.4,13,r(.37,.41,t)),e.s=-e.z,e.curl=0,e;if(t<=l0.hop1[0]){const a=r(l0.walk,l0.hold[0],t),o=r(l0.hold[1],l0.hop1[0],t);return e.x=p0(p0(13,l0.stand[0],a),l0.off[0],o),e.z=p0(p0(-285.5,l0.stand[1],a),l0.off[1],o),e.y=M0.top,e.yaw=-1.2*a*(1-o)-.12*o,e.s=285.5+4.2*a-3.7*o,e.curl=0,e}if(t<l0.hop1[1]){const a=(t-l0.hop1[0])/(l0.hop1[1]-l0.hop1[0]);return e.z=p0(l0.off[1],-313,a),e.x=p0(l0.off[0],l0.lane,a)-4.4*Math.sin(j*Math.pow(a,.85)),e.y=p0(M0.top,s0.lo,Math.pow(a,1.2))+2*Math.sin(j*a),e.air=a,e.hopSign=-1,e.yaw=-.12*(1-a),e.s=p0(286,313,a),e.curl=0,e}const n=Ue(t);if(n<=l0.hop2[0])e.z=jo(n),e.y=s0.lo;else if(n<l0.hop2[1]){const a=(n-l0.hop2[0])/(l0.hop2[1]-l0.hop2[0]);e.z=p0(-350.5,-364.5,a),e.y=p0(s0.lo,s0.hi,a)+4.4*Math.sin(j*a),e.air=a}else{const a=T0((n-l0.hop2[1])/(.8-l0.hop2[1]),0,1);e.z=p0(-364.5,-382.6,a*(2-a)),e.y=s0.hi}return e.s=-e.z,e.curl=r(l0.curl[0],l0.curl[1],n),e}const St={mouth:.12,sack:.09},qo=.55,Eo=.3,kt=t=>Math.max((l0.curl[1]-Ue(t))*46,0),U0=(()=>{const r=new i0(-10.5,18.5,-117.5),n=new i0;let a=1e9,o=.29;for(let l=0;l<=3e3;l++){const b=.22+.14*l/3e3,B=Fe.pointAt(b,n).distanceTo(r);B<a&&(a=B,o=b)}return{L0:506.99,sA0:147.81,uA0:147.81/506.99,uA:o,sA1:o*Fe.length,L1:Fe.length}})(),At=t=>t<U0.uA?t*U0.uA0/U0.uA:(t*U0.L1-U0.sA1+U0.sA0)/U0.L0,Uo=t=>t<U0.uA0?t*U0.uA/U0.uA0:(t*U0.L0-U0.sA0+U0.sA1)/U0.L1;var $o={id:"the-unspilling",name:"The Unspilling",category:"interior",weirdness:.35,media:["interior","air"],async build(t){const{rng:e}=t,r=t.quality?.detail??1,n=t.vary||{},a=new u.Scene,o=n.hour||"any",l=o==="dawn"?1:o==="night"?2:o==="day"||o==="golden"?0:Math.floor(e.fork("look76")()*3)%3,b=e.fork("swaps"),B=b(),F=b()<.35?"hazel":"pist",c=b()<.35?l===2?"#2552c8":"#2a4f9c":l===2?"#10a59e":qt,S=l===1?q(c,"#98a4ac",.62):c,h={...Zt[l],density:T0(n.density??1,.7,1.3)},k=!!n.rare,N=l===2&&B<.5,R=l===0?Ae:l===1?"#efeadf":"#a01428",O=h.saucer||(l===2?"#7a1f3a":"#a23a34"),z=new u.Color(h.fog);a.background=z.clone(),a.fog=new u.FogExp2(z,h.fogD);const G={value:0},W={value:0},D={value:99},g=X.makeLightRig({scale:nt,sunDir:h.sunDir,sunColor:h.sunColor,sunIntensity:h.sunI,ambient:h.amb,ambientSky:h.ambSky,ambientGround:h.ambGround,bounceColor:"#f0d2a4",bounce:h.bounce,aoStrength:.9,dapple:{amount:l===1?.45:.6,size:1.1,speed:1.5}});g.addWindowRow({origin:[U,23,-75],axis:[0,0,-1],normal:[1,0,0],width:70,height:30,spacing:100,count:3,mullions:[5,3],bar:.45,sky:h.skyTop,skyIntensity:h.fill}),g.addWindowRow({origin:[U,23,(Ce[3][0]+Ce[3][1])/2],axis:[0,0,-1],normal:[1,0,0],width:Ce[3][0]-Ce[3][1],height:30,count:1,mullions:[6,3],bar:.45,sky:h.skyTop,skyIntensity:h.fill}),g.addWindowRow({origin:[U,23,(Se[0]+Se[1])/2],axis:[0,0,-1],normal:[1,0,0],width:Se[0]-Se[1],height:30,count:1,mullions:[3,3],bar:.45,sky:h.skyTop,skyIntensity:h.fill});const H=g.addWindowRow({origin:[0,19.8,K],axis:[1,0,0],normal:[0,0,1],width:22,height:18,count:1,arch:1,mullions:[1,1],bar:0,sky:h.skyLow,skyIntensity:h.fill*.75}),a0=g.addWindowRow({origin:[9,15,m0],axis:[1,0,0],normal:[0,0,-1],width:44,height:28,count:1,sun:!1,sky:h.skyLow,skyIntensity:h.fill*1.5});a0&&(a0.noShaft=!0),H&&(H.noShaft=!0),g.setBounds([U,0,K],[Q,Q0,m0],0);const i=g.addOccluder([14,18,-165],6.6),s=g.addOccluder([14,20,-178],2.6);g.addOccluder([j0.x,21,ye],3.6),g.addOccluder([9,13,-218],2.4);for(const[Z,I,t0,Y,d0]of[[15,-6,-31,30,40],[1,-5,-102,32,30],[1,-5,-117,32,30]])g.addLight({position:[Z,I,t0],color:"#ffdcb4",intensity:Y*h.lift,range:d0});await t.yield();const C=X.makeBuilder(),w=l===0?[1,.6,.2,.1]:l===1?[.93,.92,.88,.56]:[.86,.1,.17,.22],P={uTileCol:{value:new u.Color(S)},uAccCol:{value:new u.Color(l===1?"#c8922c":"#b5582e")},uSpill:{value:new u.Vector4(-5,-114,27,0)},uSpillCol:{value:new u.Vector4().fromArray(w)},uSpillT:{value:0},uBandSun:{value:new i0().fromArray(h.sunDir).normalize()},uBandWin:{value:J0.map(([Z,I])=>new u.Vector4(I,Z,8,38))},uBandShade:{value:new i0(.7,.77,.92)},uBandLit:{value:new i0(1.1,1.05,.96)},uBandK:{value:h.band??0}},_=await Xt(t,g,h,S,C,P);await t.yield();const y=pe(X.propMaterial({rig:g,side:u.DoubleSide,sway:{dir:[.3,0,1],amp:.045,freq:.9}})),v=pe(X.propMaterial({rig:g,side:u.DoubleSide,highlights:!1})),f=new u.Group;f.name="room",a.add(f),f.add(_.floor,_.tops);for(const Z of _.wb.buildChunks(4,480))f.add(new u.Mesh(Z,v));await t.yield();for(const Z of _.tb.buildChunks(4,480))f.add(new u.Mesh(Z,y));await t.yield(),f.add(Ht(h,G));const d=X.makeRugs({rig:g,rng:e.fork("rugs"),scale:nt,colors:h.rug,rugs:[{position:[16,0,-15.5],width:14,length:23,seed:.37,fringe:1.1},{position:[-10.5,0,-350],width:15,length:56,seed:.81,fringe:1.3}]});pe(d.object.material),f.add(d.object);const M=X.makeWindowLight({rig:g,rng:e.fork("wl"),panes:!1,shafts:!1,motesPerWindow:Math.round(190*r),maxMotes:1100,moteSize:.014,moteGain:.75});f.add(M.object);const p=no(h,G);a.add(p.mesh),await t.yield();const x=await jt(t,{load:h.load,stage:!1,rare:k,palette:[oe,ke,h.copper,Ae,X0,h.walnut,S],saucerColor:h.saucer||void 0,windows:{wallX:U,y0:8,y1:38,z:J0.map(([Z,I])=>[Z-G0,I-G0])},sunDir:h.sunDir,sunColor:new u.Color(h.heroSun[0],h.heroSun[1],h.heroSun[2]),skyColor:new u.Color(ke).multiplyScalar(h.heroSky),bounceColor:new u.Color(h.heroBounce),fillColor:h.heroFill,windowGain:h.window,beams:h.beams,restZ:e0.z0+4-G0,camAt:(Z,I)=>(Mt.pointAt(Uo(Z),I),I.z-=G0,I)});x.object.position.set(0,0,G0),x.object.updateMatrixWorld(!0),a.add(x.object);const A=x.uniforms,m={uSunDir:A.uSunDir,uSunCol:A.uSunCol,uSkyCol:A.uSkyCol,uBounceCol:A.uBounceCol,uWin:A.uWin,uWall:A.uWall,uFill:A.uFill},T=(Z,I,t0={},Y={})=>new u.ShaderMaterial({uniforms:{...u.UniformsUtils.merge([u.UniformsLib.fog]),...m,...t0},vertexShader:Z,fragmentShader:I,fog:!0,side:u.DoubleSide,...Y});await t.yield();const V=X.makeBuilder(),E=It(V,C),o0=e.fork("props"),r0=[],C0=[],y0=await eo(t,E,o0,h,S,r0,C0);await t.yield();const K0=await to(t,E,E,o0,h,S,r0,C0);await t.yield(),await io(t,E,e.fork("hang"),h,C0),await t.yield();for(const Z of V.buildChunks(5,480))f.add(new u.Mesh(Z,y));await t.yield();const Y0=T(oo,ro,{uTime:G,uWareTint:{value:new i0().fromArray(h.ware||[1,1,1])}});for(const Z of C.buildChunks(3,480)){const I=new u.Mesh(Z,Y0);I.frustumCulled=!1,f.add(I)}await t.yield();{const Z=X.makeBuilder();for(const t0 of K0.domes){const Y=new u.SphereGeometry(2.25,16,8,0,B0,0,j/2);Y.deleteAttribute("uv"),Z.add(Y,{p:t0,s:[1,1.05,1],c:"#dfeef2"}),Z.add(V0(.3,8,6),{p:[t0[0],t0[1]+2.5,t0[2]],c:"#dfeef2"})}const I=new u.Mesh(Z.build(),pe(X.glassMaterial({rig:g,opacity:.2,side:u.DoubleSide})));I.renderOrder=5,f.add(I)}{const Z=r0.length,I=new Float32Array(Z*4),t0=new Float32Array(Z*2);r0.forEach((S0,N0)=>{I.set([S0[0],S0[1],S0[2],S0[3]],N0*4),t0[N0*2]=S0[4]});const Y=new u.Mesh(se(me(),Z,{iPos:[I,4],iRad:[t0,2]}),T(mt,yt,{},{transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));Y.frustumCulled=!1,Y.renderOrder=1,Y.name="contact-shadows",a.add(Y);const d0=C0.length,c0=new Float32Array(d0*4),A0=new Float32Array(d0*2);C0.forEach((S0,N0)=>{c0.set([S0[0],S0[1],S0[2],S0[3]],N0*4),A0[N0*2]=S0[4]});const q0=new u.Mesh(se(me(),d0,{iPos:[c0,4],iRad:[A0,2]}),T(mt,co,{uGlowCol:{value:new u.Color(.95,.4,.13)}},{transparent:!0,depthWrite:!1,blending:u.AdditiveBlending,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3}));q0.frustumCulled=!1,q0.renderOrder=2,q0.name="copper-glow",a.add(q0)}const fe=new u.Group;fe.position.set(j0.x,M0.top,ye+j0.off),f.add(fe);const xe=new u.Mesh(wo(F==="hazel"?"#c08a44":"#a9c24a",F==="hazel"?"#8a5a2c":"#d8c59a"),T(xo,go));xe.position.set(0,0,-j0.off),fe.add(xe),await t.yield();const H0=await yo(t,e.fork("nuts"),T,h,F);a.add(H0.shadows,H0.nuts),await t.yield();const v0={x:0,y:0,z:0,s:0,air:-1,curl:0,hopSign:1,look:0,time:0,yaw:0},ge=(Z,I)=>{const t0=Z?s0.hi:s0.lo;for(let Y=0;Y<=400;Y++){const d0=l0.hop1[1]+(Oo(l0.curl[1])-l0.hop1[1])*Y/400;if(De(d0,v0),v0.air<0&&Math.abs(v0.y-t0)<.1&&v0.z<=I)return v0.z<I-1.5?1e3:kt(d0)}return 1e3},Re=zo(e.fork("jars"),T,D,ge,h);a.add(Re.mesh),await t.yield();const be=Co(e.fork("laid"),T,h,R,O);a.add(be.mesh),await t.yield();const re=ko(T,N);a.add(re.mesh,re.fur);const Ke={uCatZ:{value:0},uPrintCol:{value:new u.Color(l===0?"#7a420e":l===1?"#6e7680":"#7c1422")}};{const Z=[];for(let c0=0;c0<=300;c0++)De(.36+(l0.walk-.36)*c0/300,v0),Z.push([v0.z,v0.x]);const I=c0=>{for(let A0=1;A0<Z.length;A0++)if(Z[A0][0]<=c0)return Z[A0][1];return Z[Z.length-1][1]},t0=[],Y=e.fork("prints");for(const c0 of Ze){const A0=we[c0.up];for(let q0=-80;q0<80;q0++){const S0=ue*(A0[2]+Pe*(c0.ph-q0-.31)),N0=S0-ue*A0[2];N0>-181||N0<-283||t0.push(I(N0)+ue*A0[0]*1.05+(Y()-.5)*.15,S0+.12,(Y()-.5)*.3,N0-ue*Pe*.31)}}const d0=new u.Mesh(se(me(),t0.length/4,{iPr:[new Float32Array(t0),4]}),T(lo,uo,Ke,{transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3}));d0.frustumCulled=!1,d0.renderOrder=2,d0.name="paw-prints",a.add(d0)}{const Z=e.fork("fruit"),I=10,t0=[],Y=[],d0=[],c0=[9.5,e0.top+2.3,-124];for(let S0=0;S0<I;S0++){const N0=-5.5+Z()*6.5,tt=c0[2]+(Z()-.5)*18,ot=(Z()<.5?1:-1)*(j/2+(Z()-.5)*.9),at=14+Z()*30,Ot=T0(N0+Math.cos(ot)*at*.45-4-Z()*8,-22,1),Bt=T0(tt+Math.sin(ot)*at,-182,-58),st=S0*2.4;t0.push(Ot,Bt,N0,tt),Y.push(1.9+Z()*1.2,1.5+Z()*.3,.6+Z()*.14,Z()),d0.push(c0[0]+Math.cos(st)*.7,c0[1]+.35*(S0%3),c0[2]+Math.sin(st)*.7,0)}const A0=V0(1,12,9),q0=new u.Mesh(se(A0,I,{iF0:[new Float32Array(t0),4],iF1:[new Float32Array(Y),4],iF2:[new Float32Array(d0),4]}),T(fo,vo,{uT:A.uT,uFruit:{value:new u.Color(h.fruit)}}));q0.frustumCulled=!1,q0.name="fruit",a.add(q0)}const Tt=Po(e.fork("air"),T,G,y0.spouts,be.sources,y0.SAM,R,r);a.add(Tt.mesh);const Pt=Ro(e.fork("pigeons"),T,G,W,h);a.add(Pt.mesh),await t.yield();const Me=Mt,f0=F0,_e=new i0,E0=new i0,L0=new i0,O0=new i0,I0=new i0,D0=new i0,Ft=new i0(-8,3,-262),Nt=new i0(j0.x,22.2,ye),Ye=new i0(0,19,K+2),He=(Z,I)=>(x.trayPose(x.clockAt(Z,k),_e),I.set(_e.x,_e.y,_e.z+G0)),Qe=(Z,I)=>(De(Math.max(Z,.36),v0),I.set(v0.x+.6*Math.sin(v0.yaw),v0.y+2.5-1.3*v0.curl,v0.z+.6*Math.cos(v0.yaw))),Je=(Z,I,t0)=>{t0.copy(Z).sub(O0);const Y=Math.cos(I),d0=Math.sin(I),c0=t0.x,A0=t0.z;return t0.x=c0*Y+A0*d0,t0.z=-c0*d0+A0*Y,t0.add(O0)},et=(Z,I)=>{if(I<.002)return;Me.posAtDist(Z*Me.length+22,I0).sub(O0).normalize(),D0.copy(E0).sub(O0);const t0=Math.max(D0.length(),.001);D0.multiplyScalar(1/t0);const Y=.86,d0=I0.dot(D0),c0=(1-Y)*d0+Math.sqrt(Math.max((1-Y)*(1-Y)*(d0*d0-1)+Y*Y,0));D0.multiplyScalar(c0).addScaledVector(I0,-(1-Y)).normalize(),L0.copy(O0).addScaledVector(D0,t0),E0.lerp(L0,I)},Rt=[{at:(Z,I)=>{const t0=At(I),Y=Xe(I),d0=Ue(Y);if(Me.pointAt(I,O0),He(Math.min(t0,.44),E0),E0.y+=(1.2+.6*f0(.31,.35,t0)-2.1*f0(.3,.33,t0)*(1-f0(.35,.378,t0)))*f0(.27,.3,t0)*(1-Eo*f0(.385,.405,t0)),t0>.36&&et(I,f0(.365,.385,t0)*(1-f0(.4095,.4325,I))),t0>.38){Qe(Y,L0),I0.copy(L0).sub(O0).normalize(),D0.copy(Ye).sub(O0).normalize(),L0.copy(O0).addScaledVector(I0,30).addScaledVector(D0,15),I<.44&&(I0.copy(E0).sub(O0),E0.copy(O0).addScaledVector(I0,p0(1,L0.distanceTo(O0)/Math.max(I0.length(),.001),f0(.4095,.421,I))));{const c0=T0((I-.4095)/.023,0,1);E0.lerp(L0,.5*(c0+c0*c0*(3-2*c0)))}E0.lerp(Ft,f0(.455,.495,Y)),Ve(pt(vt(Y)),L0),E0.lerp(Je(L0,St.mouth,I0),f0(.5,.545,Y)),D0.copy(Nt),D0.y+=1.4*f0(.596,.612,Y)*(1-f0(.628,.645,Y)),E0.lerp(Je(D0,St.sack+.17*f0(.611,.624,Y),I0),f0(.555,.59,Y)),Y>.6&&(Qe(Y,L0),E0.lerp(L0,f0(.622,.644,Y)),Y>.64&&(I0.copy(L0).sub(O0).normalize(),D0.copy(Ye).sub(O0).normalize(),L0.copy(O0).addScaledVector(I0,30).addScaledVector(D0,12.5+8*f0(.775,.8,d0)),E0.lerp(L0,f0(.648,.68,Y))),et(I,f0(.63,.68,Y)*(1-f0(.796,.822,d0)))),d0>.8&&(L0.set(0,12.5,Math.max(O0.z-30,K+4)),E0.lerp(L0,f0(.801,.8265,d0)))}return E0},from:0,to:.975,fade:.04,weight:.86}],_t=Z=>{const I=Xe(Z);return(1.15-.6*f0(.2,.275,I)-.13*f0(.365,.386,Z)+.63*f0(.427,.47,I)-.42*f0(.555,.6,I)+.12*f0(.625,.66,I)+.3*f0(.82,.89,I))/Math.max(1-Me.lagSlope(Z),.5)},ze=new i0,Lt=p.uniforms.uRay.value.z;return{scene:a,path:Me,duration:46,pace:_t,camera:{fov:62,near:.3,far:1600,lookAhead:22,sway:.6,bank:.4},pois:Rt,portal:{shape:"arch",width:16,height:15.5,color:"#ffe6bd",glow:.6,revealDistance:300},post:{exposure:h.exposure,bloom:{strength:.22,radius:.6,threshold:1.15},grade:{saturation:h.sat,contrast:1.05,tint:h.tint,shadowTint:h.shadowTint,vignette:.3,grain:.02,aberration:0}},ride:"none",update(Z,I,t0,Y){const d0=At(Y),c0=Xe(Y);G.value=I,W.value=Y,x.setProgress(d0,k),x.update(Z,I,t0),P.uSpill.value.w=1.06*f0(.95,3.2,x.clockAt(d0,k)),P.uSpillT.value=I;const A0=vt(c0);H0.uniforms.uTauN.value=A0,H0.uniforms.uTauS.value=Qt(c0);const q0=pt(A0)+.012*Math.sin(I*1.9)*f0(0,.3,A0);fe.rotation.x=q0,Ve(q0,H0.mouth),ze.setFromMatrixPosition(t0.matrixWorld),H0.uniforms.uCam.value.copy(ze),p.uniforms.uCamP.value.copy(ze),p.uniforms.uRay.value.y=I,p.uniforms.uRay.value.z=Lt*(1-qo*f0(.4,.47,c0)*(1-f0(.67,.74,c0)));const S0=c0+.0015*Math.sin(I*1.25)*f0(.36,.4,c0)*(1-f0(.8,.845,c0));De(T0(S0,.3,1),v0),v0.time=I;let N0=Math.atan2(ze.x-v0.x,ze.z-v0.z)-v0.yaw;N0-=B0*Math.round(N0/B0),v0.look=T0(N0,-1.1,1.1)*.75*f0(.4,.45,c0),re.pose(v0),Ke.uCatZ.value=v0.z,D.value=kt(S0),He(d0,i.position),s.position.set(v0.x,v0.y+1.6,v0.z),g.update(I,null),M.update(Z,I,t0)},dispose(){}}}};export{$o as default};
