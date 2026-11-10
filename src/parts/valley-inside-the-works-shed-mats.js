import{barMaterial as v}from"./valley-inside-the-works-plan.js";import{COMMON as p,SURFACE_FUNCS as y,IRON_FUNCS as A,SURFACE_MAIN as w,SURFACE_NORMAL as L}from"./valley-inside-the-works-shed-glsl.js";import{LACE_FUNCS as x,LACE_MAIN as M,GLASS_VERT as P,GLASS_PANES as G,GLASS_SKY as N,GLASS_FRAG_HEAD as D,GLASS_FRAG_MAIN as O}from"./valley-inside-the-works-shed-glsl2.js";const I={brick:0,ashlar:1,granite:2,boards:3,planks:4,iron:5,flute:6,plain:7,sugar:8,mint:9},K={web:0,truss:1,rail:2,grate:3,bracket:4},j={roof:0,wall:1,wheel:2},_={day:{glass:1.55,lift:.34,bounce:.12},golden:{glass:1.5,lift:.3,bounce:.13},dawn:{glass:1.45,lift:.3,bounce:.11},night:{glass:1.6,lift:.3,bounce:.08}},C={day:{top:[.06,.17,.58],mid:[.13,.32,.72],low:[.66,.68,.64],cloud:[1.16,1.13,1.07],dark:[.5,.57,.7],k:[.54,.16,1,1]},golden:{top:[.045,.12,.48],mid:[.15,.28,.6],low:[.95,.66,.38],cloud:[1.25,.86,.4],dark:[.48,.4,.5],k:[.55,.16,1,1]},dawn:{top:[.2,.36,.7],mid:[.42,.5,.75],low:[.95,.58,.56],cloud:[1.15,.72,.68],dark:[.55,.46,.62],k:[.54,.18,.8,1]},night:{top:[.08,.2,.56],mid:[.16,.34,.68],low:[.6,.64,.66],cloud:[.98,.99,1],dark:[.42,.46,.55],k:[.45,.14,.35,1]}};function R(e,c){const o=c.look,s=_[o.hour]||_.day,b=o.sun.clone().multiply(new e.Color(.62,.6,.42)).multiplyScalar(s.bounce),l={uShedTime:{value:0},uShedSky:{value:o.sky.clone()},uShedSun:{value:o.sun.clone()},uShedBounce:{value:b},uShedLift:{value:s.lift},uShedPaint:{value:new e.Color(.4,.52,.48)},uShedRail:{value:new e.Color(.14,.24,.24)},uShedGlassBar:{value:new e.Color(.07,.1,.095)},uShedGlassGain:{value:s.glass},uShedLight:{value:c.lightDir.clone().normalize()}},a=C[o.hour]||C.day,r=n=>new e.Color(n[0],n[1],n[2]);Object.assign(l,{uShedSkyTop:{value:r(a.top)},uShedSkyMid:{value:r(a.mid)},uShedSkyLow:{value:r(a.low)},uShedCloud:{value:r(a.cloud)},uShedCloudDark:{value:r(a.dark)},uShedSkyK:{value:new e.Vector4(a.k[0],a.k[1],a.k[2],a.k[3])}});const d=`varying vec4 vP;
uniform float uShedTime, uShedLift; uniform vec3 uShedSky, uShedSun, uShedBounce, uShedPaint, uShedRail;
float shedRough = 0.85, shedTilt = 0.0; vec3 shedGlow = vec3(0.0);
`+p,m=n=>{n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
attribute vec4 aP;
varying vec4 vP;
#ifdef SHED_TALL
attribute float aTall;
attribute float aCane;
varying float vCane;
#endif`).replace("#include <begin_vertex>",`#include <begin_vertex>
vP = aP;
#ifdef SHED_TALL
transformed.y += aP.w * aTall; vP.y = transformed.y; vCane = aCane;
#endif`)},S=(n,k)=>{const i=new e.MeshStandardMaterial({vertexColors:!0,roughness:.85,metalness:0});return i.defines=Object.assign({},i.defines||{},k||{}),i.onBeforeCompile=u=>{Object.assign(u.uniforms,l),m(u),u.fragmentShader=u.fragmentShader.replace("#include <common>",`#include <common>
`+d+y+A).replace("#include <color_fragment>",`#include <color_fragment>
`+w).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = shedRough;`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
`+L).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance += diffuseColor.rgb * shedGlow;`)},i.customProgramCacheKey=()=>"valley-shed-surface:"+n,v(i)},f=S("solid"),g=S("column",{SHED_TALL:""}),t=new e.MeshLambertMaterial({vertexColors:!0,side:e.DoubleSide,transparent:!0,depthWrite:!1});t.onBeforeCompile=n=>{Object.assign(n.uniforms,l),m(n),n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
`+d+x).replace("#include <color_fragment>",`#include <color_fragment>
`+M).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance += diffuseColor.rgb * uShedBounce * 0.6 * mix(0.15, 4.5, lightBar(vValleyBar));`)},t.customProgramCacheKey=()=>"valley-shed-lace",v(t);const h=new e.ShaderMaterial({uniforms:Object.assign(e.UniformsUtils.merge([e.UniformsLib.fog]),l),vertexShader:P,fragmentShader:D+p+G+N+O,fog:!0,vertexColors:!0,side:e.DoubleSide});return{solid:f,column:g,lace:t,glass:h,uniforms:l,all:[f,g,t,h]}}export{I as KIND,K as LACE,j as PANE,R as makeMaterials};
