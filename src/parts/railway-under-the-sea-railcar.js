import*as c from"three";import{mergeGeometries as G}from"three/addons/utils/BufferGeometryUtils.js";import{CAR as u,LEVEL as E,lineX as H}from"./railway-under-the-sea-line.js";const z=u.length/2,b=u.width/2,p=1,w=b-p,B=z-p,x=96;function D(e,r){const a=Math.max(p-r,0),n=r<=p?w:Math.max(w-(r-p),0),t=r<=p?B:z-r,s=Math.PI/2;if(e<2)return[n*(e/2),-t-a];if(e<14){const o=(e-2)/12*s;return[n+a*Math.sin(o),-t-a*Math.cos(o)]}if(e<34)return[n+a,-t+(e-14)/20*2*t];if(e<46){const o=(e-34)/12*s;return[n+a*Math.cos(o),t+a*Math.sin(o)]}if(e<50)return[n-(e-46)/4*2*n,t+a];if(e<62){const o=(e-50)/12*s;return[-n-a*Math.sin(o),t+a*Math.cos(o)]}if(e<82)return[-n-a,t-(e-62)/20*2*t];if(e<94){const o=(e-82)/12*s;return[-n-a*Math.cos(o),-t-a*Math.sin(o)]}return[-n+(e-94)/2*n,-t-a]}function T(e){const r=[],a=[];for(const[t,s]of e)for(let o=0;o<x;o++){const l=D(o,t);r.push(l[0],s,l[1])}for(let t=0;t<e.length-1;t++)for(let s=0;s<x;s++){const o=t*x+s,l=t*x+(s+1)%x,d=o+x,m=l+x;a.push(o,d,l,l,d,m)}const n=new c.BufferGeometry;return n.setAttribute("position",new c.Float32BufferAttribute(r,3)),n.setIndex(a),n.computeVertexNormals(),n}const Q=e=>3.05+.33*Math.sqrt(Math.max(1-(1-e/b)*(1-e/b),0));function K(){const e=[[.075,.62],[.03,.86],[.004,1.2],[0,1.4],[0,2.2],[0,2.95],[.004,3.05]];for(const r of[.02,.05,.1,.18,.3,.46,.66,.88,1.1,1.26,b])e.push([r,Q(r)]);return T(e)}function i(e,r){const a=new c.Color(r),n=e.attributes.position.count,t=new Float32Array(n*3);for(let o=0;o<n;o++)t[o*3]=a.r,t[o*3+1]=a.g,t[o*3+2]=a.b;e.setAttribute("color",new c.BufferAttribute(t,3));const s=e.index?e.toNonIndexed():e;s!==e&&e.dispose();for(const o of Object.keys(s.attributes))o!=="position"&&o!=="normal"&&o!=="color"&&s.deleteAttribute(o);return s}const h=(e,r,a,n,t,s)=>new c.BoxGeometry(e,r,a).translate(n,t,s),C=(e,r,a,n,t,s=14)=>new c.CylinderGeometry(e,e,r,s).rotateZ(Math.PI/2).translate(a,n,t),y=(e,r,a,n,t,s,o=14)=>new c.CylinderGeometry(e,r,a,o).rotateX(Math.PI/2).translate(n,t,s);async function re(e,r){const a=new c.Group;a.name="railcar";const n=[],t=f=>(n.push(f),f),s={uCarNight:{value:0}},o=t(new c.MeshStandardMaterial({color:"#e3ab1c",roughness:.42,metalness:0}));o.onBeforeCompile=f=>{f.uniforms.uCarNight=s.uCarNight,f.vertexShader=f.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vCarP;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vCarP = position;`),f.fragmentShader=f.fragmentShader.replace("#include <common>",`#include <common>
`+W).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
`+Z)},o.customProgramCacheKey=()=>"railway-under-the-sea-railcar-shell";const l=new c.Mesh(t(K()),o);l.name="shell",a.add(l),await e.yield();const d=$();n.push(d.geometry);const m=t(new c.MeshStandardMaterial({vertexColors:!0,roughness:.7,metalness:0}));a.add(new c.Mesh(d.geometry,m)),await e.yield();const O=t(k()),j=t(new c.MeshStandardMaterial({vertexColors:!0,roughness:.55,metalness:.15})),g=new c.InstancedMesh(O,j,2);g.name="wheels",g.frustumCulled=!1,a.add(g);const A=t(new c.MeshBasicMaterial({vertexColors:!0}));a.add(new c.Mesh(t(ee()),A));const R=new c.Matrix4,I=new c.Matrix4,U=E.railHead+u.wheelRadius;function N(f){const v=f+z,F=v+u.axles[0],L=v+u.axles[1],_=H(F),q=H(L);a.position.set((_+q)/2,0,v),a.rotation.y=Math.atan((_-q)/(F-L));const Y=(f-40)/u.wheelRadius;I.makeRotationX(Y);for(let M=0;M<2;M++)R.copy(I).setPosition(0,U,u.axles[M]),g.setMatrixAt(M,R);g.instanceMatrix.needsUpdate=!0}function S(f){const v=f<0?0:f>1?1:f;s.uCarNight.value=v,A.color.setScalar(.8+1.1*v)}return N(40),S(0),{object:a,length:u.length,place:N,setNight:S,dispose(){for(const f of n)f.dispose()}}}const W=te(),Z=oe();function J(e,r){const a=r<.86?.075+-.045*(r-.62)/.24:r<1.2?.03+-.026*(r-.86)/.34:0,n=p-a,t=Math.abs(e),s=e<0?-1:1;if(t<=w)return[e,r,-(B+n),0,-1];const o=(t-w)/p;return[s*(w+n*Math.sin(o)),r,-(B+n*Math.cos(o)),s*Math.sin(o),-Math.cos(o)]}function P(e,r,a,n,t=0){const s=J(r,a),o=new c.Quaternion().setFromUnitVectors(new c.Vector3(0,0,1),new c.Vector3(s[3],0,s[4]));return e.applyQuaternion(o).translate(s[0]+s[3]*t,s[1],s[2]+s[4]*t),n>0&&e.rotateY(Math.PI),e}const V=[[-.62,1.05,.11],[.62,1.05,.11],[0,2.9,.085]],X=[[-.9,1.05,.05],[.9,1.05,.05]];function $(){const e="#232527",r="#3a3d40",a="#b4b9bd",n="#c9cdd0",t=[];t.push(i(T([[.085,.36],[.07,.64]]),e)),t.push(i(h(2.5,.04,12.2,0,.6,0),e));for(const o of[-1,1]){t.push(i(h(2.1,.18,.14,0,.55,o*6.06),e));for(const l of[-.875,.875])t.push(i(y(.05,.05,.46,l,.72,o*6.3,10),r)),t.push(i(y(.16,.16,.045,l,.72,o*6.54,16),r));t.push(i(h(.07,.13,.24,0,.7,o*6.38),r));for(const l of[-4,-1.4,1.4,4])o<0&&t.push(i(new c.CylinderGeometry(.11,.135,.1,12).translate(0,3.42,l),a));for(const l of[-.2,.2])t.push(i(y(o<0?.07:.03,o<0?.03:.07,.3,l,3.4,o*4.75,10),a));for(const[l,d,m]of V)t.push(i(P(new c.CylinderGeometry(m+.025,m+.035,.07,18).rotateX(Math.PI/2),l,d,o,.03),n));for(const[l,d,m]of X)t.push(i(P(new c.CylinderGeometry(m+.015,m+.02,.05,12).rotateX(Math.PI/2),l,d,o,.02),e))}t.push(i(h(1.5,.34,1,.25,.43,.3),e)),t.push(i(y(.17,.17,1.5,-.72,.43,-.7,14),r)),t.push(i(h(.5,.3,.9,-.75,.45,1.25),e)),t.push(i(y(.12,.12,1,.75,.47,-1.6,12),r)),t.push(i(y(.04,.04,2.4,.2,.3,-1.3,8),r));for(const o of u.axles)for(const l of[-.98,.98])t.push(i(h(.16,.2,.3,l,E.railHead+u.wheelRadius,o),r)),t.push(i(h(.08,.05,1.1,l,.55,o),e));for(const o of[-1,1]){t.push(i(h(.22,.035,1.3,o*1.37,.42,o*2.2),r));for(const l of[-.6,.6])t.push(i(h(.03,.2,.03,o*1.32,.52,o*2.2+l),r))}const s=G(t,!1);for(const o of t)o.dispose();return{geometry:s}}function k(){const e=[];for(const a of[-1,1]){e.push(i(C(u.wheelRadius,.13,a*.75,0,0,30),"#4b4f53")),e.push(i(C(u.wheelRadius+.035,.03,a*.67,0,0,30),"#3c3f42")),e.push(i(C(.13,.2,a*.75,0,0,12),"#2a2c2e"));for(let n=0;n<6;n++){const t=n*Math.PI/3;e.push(i(h(.02,.05,.05,a*.82,.24*Math.cos(t),.24*Math.sin(t)),"#1c1d1f"))}}e.push(i(C(.065,1.5,0,0,0,10),"#2a2c2e"));const r=G(e,!1);for(const a of e)a.dispose();return r}function ee(){const e=[];for(const a of[-1,1]){for(const[n,t,s]of V)e.push(i(P(new c.CircleGeometry(s,18),n,t,a,.068),a<0?new c.Color(1.5,1.28,.85):"#191c1f"));for(const[n,t,s]of X)e.push(i(P(new c.CircleGeometry(s,12),n,t,a,.048),a>0?new c.Color(1.35,.1,.06):"#2a0806"))}const r=G(e,!1);for(const a of e)a.dispose();return r}function te(){return`
varying vec3 vCarP;
uniform float uCarNight;
float carBox(vec2 p, vec2 c, vec2 h, float r) { vec2 d = abs(p - c) - h + r; return length(max(d, 0.) + 1e-5) + min(max(d.x, d.y), 0.) - r; }
float carPeri(vec2 q) {
  float x = q.x, z = q.y, ax = max(x - 0.35, 0.);
  if (z < -5.3) return x <= 0.35 ? x : 0.35 + atan(ax, max(-(z + 5.3), 1e-4));
  if (z > 5.3) return x <= 0.35 ? 14.4416 - x : 12.5208 + atan(max(z - 5.3, 0.), max(ax, 1e-4));
  return 7.2208 + z;
}
// distance to the nearest pane of glass (negative inside): the wrapped three-pane screens of both ends, four big
// side windows, the two glazed door leaves, a fifth window, and the row of small roof-edge lights above them
float carGlass(float u, float y) {
  vec2 p = vec2(u, y);
  float d = carBox(p, vec2(0., 2.16), vec2(0.6, 0.56), 0.1);
  d = min(d, carBox(p, vec2(14.4416, 2.16), vec2(0.6, 0.56), 0.1));
  d = min(d, carBox(p, vec2(1.17, 2.16), vec2(0.45, 0.56), 0.1));
  d = min(d, carBox(p, vec2(13.2716, 2.16), vec2(0.45, 0.56), 0.1));
  float j = clamp(floor((u - 3.42) / 1.47 + 0.5), 0., 3.);
  d = min(d, carBox(p, vec2(3.42 + 1.47 * j, 2.135), vec2(0.625, 0.585), 0.12));
  d = min(d, carBox(p, vec2(11.02, 2.135), vec2(0.625, 0.585), 0.12));
  d = min(d, carBox(p, vec2(9.05, 2.03), vec2(0.27, 0.67), 0.07));
  d = min(d, carBox(p, vec2(9.8, 2.03), vec2(0.27, 0.67), 0.07));
  float i = clamp(floor((u - 3.42) / 1.52 + 0.5), 0., 5.);
  d = min(d, carBox(p, vec2(3.42 + 1.52 * i, 3.15), vec2(0.5, 0.058), 0.05));
  return d;
}
// distance to the double door's gaps (its outline and the line between its two leaves)
float carDoor(float u, float y) {
  float d = abs(carBox(vec2(u, y), vec2(9.425, 1.76), vec2(0.75, 1.1), 0.03));
  return (y > 0.66 && y < 2.86) ? min(d, abs(u - 9.425)) : d;
}`}function oe(){return`
{
  vec2 cq = vCarP.x >= 0. ? vCarP.xz : -vCarP.xz;
  float cu = carPeri(cq), cy = vCarP.y;
  float gd = carGlass(cu, cy), aa = fwidth(gd) + 1e-4, ay = fwidth(cy) + 1e-4;
  float glass = 1. - smoothstep(-aa, aa, gd);
  float frame = (1. - smoothstep(0.034 - aa, 0.034 + aa, gd)) * (1. - glass);
  vec3 paint = diffuseColor.rgb;
  paint = mix(paint, vec3(0.045, 0.047, 0.05), smoothstep(1.4 - ay, 1.4 + ay, cy) * (1. - smoothstep(1.455 - ay, 1.455 + ay, cy)));
  paint *= mix(0.8, 1., smoothstep(0.62, 1.2, cy));
  paint *= 0.96 + 0.04 * sin(cu * 6.1 + cy * 2.3) * sin(cy * 3.7);
  float roof = smoothstep(3.035 - ay, 3.035 + ay, cy);
  paint = mix(paint, vec3(0.6, 0.63, 0.65) * (0.93 + 0.07 * sin(vCarP.z * 9.)), roof);
  paint = mix(paint, vec3(0.05, 0.05, 0.055), (1. - smoothstep(0.012, 0.012 + ay, abs(cy - 3.015))) * 0.8);
  float dg = carDoor(cu, cy), ag = fwidth(dg) + 1e-4;
  paint = mix(paint, vec3(0.03), (1. - smoothstep(0.007, 0.007 + ag, dg)) * 0.9);
  paint = mix(paint, vec3(0.74, 0.76, 0.78), frame);
  diffuseColor.rgb = mix(paint, vec3(0.035, 0.05, 0.065), glass);
  roughnessFactor = mix(mix(mix(roughnessFactor, 0.6, roof), 0.3, frame), 0.06, glass);
  float fz = 1. - clamp(dot(normalize(vViewPosition), normal), 0., 1.);
  vec3 sheen = vec3(0.1);
  #ifdef USE_FOG
    sheen = fogColor * (0.1 + 0.75 * fz * fz * fz);
  #endif
  totalEmissiveRadiance += glass * (sheen * (1. - 0.6 * uCarNight) + uCarNight * vec3(1.55, 1.3, 0.86));
}`}export{re as buildRailcar};
