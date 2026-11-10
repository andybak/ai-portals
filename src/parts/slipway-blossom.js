import*as a from"three";import{mergeGeometries as Ft}from"three/addons/utils/BufferGeometryUtils.js";const Pt=["#8E3B2A","#AEB4B8","#F2B8C9","#5C646C","#C49A5A","#2E6E78","#CFE6F5"],W=Math.PI,we=W*2,O=Math.tan(3*W/180),F=240,ce=10,E=e=>Math.min(1,Math.max(0,e)),R=(e,s,o)=>e+(s-e)*o,I=(e,s,o)=>{const h=E((o-e)/(s-e));return h*h*(3-2*h)},P=e=>Math.min(e,270)*O;function Ke(e,s){const o=e.length,h=[],l=[];for(let r=0;r<o-1;r++)h.push((s[r+1]-s[r])/(e[r+1]-e[r]));l.push(h[0]);for(let r=1;r<o-1;r++)l.push(h[r-1]*h[r]<=0?0:2*h[r-1]*h[r]/(h[r-1]+h[r]));return l.push(h[o-2]),r=>{if(r<=e[0])return s[0];if(r>=e[o-1])return s[o-1];let n=0;for(;r>e[n+1];)n++;const t=e[n+1]-e[n],c=(r-e[n])/t,i=c*c,f=i*c;return(2*f-3*i+1)*s[n]+(f-2*i+c)*t*l[n]+(-2*f+3*i)*s[n+1]+(f-i)*t*l[n+1]}}const We=733.3,Pe=980/We,ye=Ke([0,117.6,245,340,440,470,490,513,535,553,575,600,620,655,We].map(e=>e/We),[0,0,50,56,62,66,80,112,150,188,240,290,312,337,360]),Lt=Ke([0,100,150,185,225,265,300,390],[ce+10*O,ce-90*O,2.2,-9.5,-4.6,-6.6,-7.3,-7.5]),Rt=Ke([0,100,185,225,262,284,304,335,390],[ce+250*O,ce+150*O,ce+65*O,ce+25*O,9.2,-12,-5.2,-8.3,-7.5]),It=[160,225,95,140,128,115],D=[[70,19],[70,-19],[150,19],[150,-19],[230,19],[230,-19]];function X(e){const s=E(e/.2),o=E((e-.6)/.4),h=14*Math.min(Math.pow(1-Math.pow(1-s,2.4),.55),Math.pow(1-Math.pow(o,2.2),.8)),l=I(.035,.335,e),r=E((e-.5)/.48),n=Math.max(e<.5?.3:.22,14*Math.min(Math.pow(l,1.1),1-r*r)),t=30+3.5*Math.pow(Math.max(0,(e-.6)/.4),2)+1.5*Math.pow(Math.max(0,(.3-e)/.3),2);let c=21.5*(1-I(.036,.048,e))+(e<.04?4*(1-e/.04):0);e>.968&&(c=t*Math.pow((e-.968)/.032,2));const i=Math.max(1-I(.05,.32,e),I(.6,.97,e)),f=1-I(.03,.05,e),u=Math.max(n,h*.86*f),v=R(Math.min(R(3.2,22,i),(t-c)*.8),(t-c)*.72,f),d=R(R(.22,.9,i),.5,f),m=R(R(1,2.6,i),1.3,f);return{zDeck:h,zW:u,yR:t,yK:c,hb:v,es:d,pf:m}}function fe(e,s,o){if(s<.5){const h=s*W;o[0]=e.yK+e.hb*(1-Math.pow(Math.max(0,Math.cos(h)),e.es)),o[1]=e.zW*Math.pow(Math.sin(h),e.es)}else{const h=(s-.5)*2;o[0]=R(e.yK+e.hb,e.yR,h),o[1]=e.zW+(e.zDeck-e.zW)*Math.pow(h,e.pf)}return o}function J(e,s){const o=X(e),h=[0,0];if(s<o.yK||s>o.yR)return 0;let l=0,r=1;for(let n=0;n<18;n++){const t=(l+r)/2;fe(o,t,h),h[0]<s?l=t:r=t}return fe(o,(l+r)/2,h)[1]}function ht(e,s){const o=X(e),h=[0,0];if(o.zW<s)return-1;let l=0,r=.5;for(let n=0;n<18;n++){const t=(l+r)/2;fe(o,t,h),h[1]<s?l=t:r=t}return fe(o,(l+r)/2,h)[0]}async function Tt(e){const s=[];for(let i=0;i<=96;i++){const f=i/96;s.push(f)}for(const i of[.004,.012,.034,.038,.041,.044,.047,.05,.972,.976,.981,.986,.993,.997])s.push(i);s.sort((i,f)=>i-f);const o=18,h=o*2+1,l=[],r=[],n=[],t=[0,0];for(let i=0;i<s.length;i++){const f=X(s[i]);let u=0,v=f.yK,d=0;const m=[];for(let x=0;x<=o;x++){const y=x/o;fe(f,y,t);const w=t[0];u+=Math.hypot(w-v,t[1]-d),v=w,d=t[1],m.push([w,t[1],u])}for(let x=-o;x<=o;x++){const y=m[Math.abs(x)];l.push(s[i]*F,y[0],Math.sign(x)*y[1]),r.push(s[i]*F,y[2])}}for(let i=0;i<s.length-1;i++)for(let f=0;f<h-1;f++){const u=i*h+f,v=u+h;n.push(u,v,u+1,v,v+1,u+1)}const c=new a.BufferGeometry;return c.setAttribute("position",new a.Float32BufferAttribute(l,3)),c.setAttribute("uv",new a.Float32BufferAttribute(r,2)),c.setIndex(n),await e(),c.computeVertexNormals(),c}const De=`
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
`;function ee(e,s,o={},h="plain"){const l=new a.MeshStandardMaterial(e),r="slipway-"+h;return l.onBeforeCompile=n=>{Object.assign(n.uniforms,s,o.uniforms||{}),n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vOp; varying vec2 vHuv;
`+(o.vHead||"")).replace("#include <beginnormal_vertex>",o.vNormal||"#include <beginnormal_vertex>").replace("#include <begin_vertex>",(o.vBegin||"#include <begin_vertex>")+`
vOp = transformed; vHuv = uv;`),n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
uniform vec3 uFill; uniform vec3 uKick; uniform vec3 uBounceV; varying vec3 vOp; varying vec2 vHuv;
`+De+(o.fHead||"")).replace("#include <color_fragment>",`#include <color_fragment>
`+(o.fColor||"")).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
`+(o.fRough||"")).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
`+(o.fNormal||"")).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
{ float up_ = dot(normal, viewMatrix[1].xyz); float bn_ = max(0., dot(normal, uBounceV)); totalEmissiveRadiance += diffuseColor.rgb * mix(uKick * (0.3 + 1.3 * bn_) + uFill * 0.5, uFill, smoothstep(-0.6, 0.5, up_)); }
`+(o.fEmis||""))},l.customProgramCacheKey=()=>r,l}const qe=`{ vec3 sx_ = dFdx(vViewPosition), sy_ = dFdy(vViewPosition); vec3 r1_ = cross(sy_, normal), r2_ = cross(normal, sx_);
  float det_ = dot(sx_, r1_); vec3 g_ = sign(det_) * (dFdx(hgt) * r1_ + dFdy(hgt) * r2_);
  normal = normalize(abs(det_) * normal - g_ * bumpK + normal * 1e-7); }`;function Nt(e,s,o=1){return ee({color:16777215,roughness:.6,metalness:.25},e,{uniforms:{uBot:{value:s.bot},uTop:{value:s.top},uBoot:{value:s.boot},uSheer:{value:s.sheer},uLine:{value:new a.Vector4(s.paintY,s.bootW,s.sheerW,s.rust)},uCaust:{value:o}},fHead:`uniform vec3 uBot, uTop, uBoot, uSheer, uHullPos, uSunCol, uAmb, uSunV; uniform vec4 uLine; uniform float uTime, uCaust; float hgt; float bumpK;
      float portRow(float x, float y, float ax, float ay){ float r = 0.3;
        float disc = 1. - smoothstep(r - ax - ay, r + ax + ay, length(vec2(x, y)));
        float bar = (1. - smoothstep(r - ay, r + ay, abs(y))) * mix(1. - smoothstep(r - ax, r + ax, abs(x)), 0.34, smoothstep(0.5, 1.6, ax)) * min(1., 0.45 / ay);
        return mix(disc, bar, smoothstep(0.12, 0.35, ax)); }
      float rivD(float along, float across, float pitch){ float a = (fract(along / pitch) - 0.5) * pitch; return sqrt(a * a + across * across); }`,fColor:`{
      float dist = length(vViewPosition), fadeN = 1. - smoothstep(26., 80., dist), fadeM = 1. - smoothstep(150., 420., dist);
      float gir = vHuv.y, k = floor(gir / 2.4), sv = fract(gir / 2.4) * 2.4;
      float px = vHuv.x + h21(vec2(k, 3.7)) * 9.6, pid = floor(px / 9.6), bx = fract(px / 9.6) * 9.6;
      float aa = clamp(fwidth(vHuv.x) + fwidth(gir), 0.002, 0.4) * 0.9;
      float rnd = h21(vec2(pid, k));
      float sheerY = 30. + 3.5 * pow(max(0., (vOp.x / 240. - 0.6) / 0.4), 2.) + 1.5 * pow(max(0., (0.3 - vOp.x / 240.) / 0.3), 2.);
      float fy = fwidth(vOp.y) + 1e-4;
      float above = smoothstep(-fy, fy, vOp.y - uLine.x), below = 1. - above;
      vec3 col = mix(uBot, uTop, above);
      float boot = smoothstep(-fy, fy, vOp.y - uLine.x) * (1. - smoothstep(-fy, fy, vOp.y - uLine.x - uLine.y));
      col = mix(col, uBoot, boot * step(0.01, uLine.y));
      float sh_ = sheerY - 2.6 - vOp.y; float sheer = smoothstep(-fy, fy, sh_) * (1. - smoothstep(-fy, fy, sh_ - uLine.z));
      col = mix(col, uSheer, sheer * step(0.01, uLine.z));
      // plate to plate tone (wide enough that the slide is obvious overhead), in-and-out strakes, big soft mottling
      float outer = mod(k, 2.);
      float fadeP = (1. - smoothstep(60., 230., dist)) * mix(1., 0.4, above);
      col *= mix(1., 0.68 + 0.5 * rnd, fadeP) * mix(1., 0.9 + 0.17 * outer, fadeP);
      col *= 0.82 + 0.34 * vn(vHuv * 0.11 + 3.) * vn(vHuv * 0.37);
      // below the paint line: some plates in fresher red lead, brush streaks along the strake, pale scuffs and dark tallow stains
      float lead = smoothstep(0.62, 0.9, h21(vec2(pid + 7., k + 3.))) * below * fadeM;
      col = mix(col, col * vec3(1.3, 0.85, 0.62) + vec3(0.02, 0., 0.), lead * 0.7);
      col *= 1. - 0.2 * below * fadeM * smoothstep(0.35, 0.8, vn(vec2(vHuv.x * 0.5 + rnd * 9., gir * 7.)));
      float scuff = smoothstep(0.6, 0.85, vn(vHuv * vec2(0.45, 1.6) + 21.) * vn(vHuv * 0.13 + 2.) * 2.1) * below * fadeM;
      col = mix(col, vec3(0.3, 0.2, 0.165) * (0.8 + 0.4 * vn(vHuv * 3.)), scuff * 0.45);
      // lap shadow under each seam and butt joints
      float fadeS = mix(fadeM, max(1. - smoothstep(35., 130., dist), 0.38 * (1. - smoothstep(120., 320., dist))), above);     // on the topsides the seams are strong only close to; out to 300 m they stay as faint strake lines, so her flank has drawing
      float lap = (1. - smoothstep(0.0, 0.12 + aa, sv)) * fadeS;
      float lapHi = smoothstep(2.4 - 0.07 - aa, 2.4, sv) * fadeS;
      float butt = (1. - smoothstep(0.02, 0.06 + aa, abs(bx - 0.04))) * fadeS;
      col *= 1. - 0.65 * lap - 0.45 * butt; col += 0.045 * lapHi * (0.6 + col);
      // rivets: double rows along the laps and the butts, single rows on the frames; a dark contact ring and a bright head
      float fr = fract(vHuv.x / 1.2) * 1.2;
      float dR = min(rivD(vHuv.x, sv - 0.2, 0.35), rivD(vHuv.x + 0.175, sv - 0.42, 0.35));
      dR = min(dR, rivD(vHuv.x, sv - 2.2, 0.35));
      dR = min(dR, min(rivD(sv, bx - 0.24, 0.35), rivD(sv + 0.175, bx - 0.46, 0.35)));
      dR = min(dR, rivD(sv, bx - 9.4, 0.35));
      float dF = rivD(sv + 0.1, fr - 0.6, 0.4);
      float rv = max(1. - smoothstep(0.075 - aa, 0.075 + aa, dR), 0.7 * (1. - smoothstep(0.055 - aa, 0.055 + aa, dF))) * fadeN;
      float ring = max(1. - smoothstep(0.085, 0.17 + aa, dR), 0.7 * (1. - smoothstep(0.065, 0.13 + aa, dF))) * fadeN * (1. - rv);
      col *= 1. - 0.45 * ring;
      col = mix(col, col * 1.9 + 0.03, rv);
      // three staggered rows of open portholes along the topsides: discs close to, and at a raking distance three fine dark lines
      // that follow her sheer, so that she reads as a liner's side and not as a wall
      { float tL = vOp.x / 240., ax = clamp(fwidth(vOp.x), 0.003, 6.), pm = smoothstep(0.1, 0.14, tL) * (1. - smoothstep(0.9, 0.93, tL)) * above * (1. - smoothstep(380., 620., dist));
        float x1 = (fract(vOp.x / 3.4) - 0.5) * 3.4, x2 = (fract(vOp.x / 3.4 + 0.5) - 0.5) * 3.4, y1 = vOp.y - sheerY + 6.4;
        float hole = max(portRow(x1, y1, ax, fy), max(portRow(x2, y1 + 3.1, ax, fy), portRow(x1, y1 + 6.2, ax, fy))) * pm;
        col = mix(col, vec3(0.014, 0.016, 0.022), hole * 0.9); }
      // rust weeps under the seams, strongest on the grey; grime toward the keel
      float streak = smoothstep(0.55, 0.85, vn(vec2(vHuv.x * 1.7, k * 5.3))) * smoothstep(0.35, 0.8, vn(vec2(vHuv.x * 0.21 + 7., k * 1.9)));
      float rustK = uLine.w * mix(1., 0.3 + 0.7 * smoothstep(0.02, 0.3, dot(uTop, vec3(0.333))), above);
      float weep = streak * pow(sv / 2.4, 1.5) * rustK;
      vec3 rust = mix(vec3(0.21, 0.07, 0.03), vec3(0.34, 0.14, 0.05), vn(vHuv * 2.3));
      rust = mix(vec3(0.07, 0.035, 0.022), rust, 0.25 + 0.75 * above);
      col = mix(col, rust, weep * mix(0.7, 0.6, above));
      float blot = smoothstep(0.6, 0.88, vn(vHuv * 0.6 + 11.) * vn(vHuv * 0.17 + 5.) * 1.9) * rustK;
      col = mix(col, rust * 0.9, blot * mix(0.6, 0.2, above));
      col *= 0.8 + 0.2 * smoothstep(0., 6., vOp.y);
      col *= mix(1., 0.8 + 0.2 * smoothstep(9., 30., vOp.y), above);          // the topsides lighten toward the rail, so the flare has form
      diffuseColor.rgb = col;
      hgt = 0.06 * rv + 0.045 * outer * smoothstep(0.0, 0.08, sv) * (1. - smoothstep(2.32, 2.4, sv)) * fadeN + 0.012 * (1. - butt) * fadeN;
      bumpK = 1.0;
    }`,fRough:"roughnessFactor = 0.66 - 0.2 * clamp(hgt / 0.06, 0., 1.);",fNormal:qe,fEmis:`{ float wx_ = vOp.x + uHullPos.x; float nw_ = (1. - smoothstep(70., 235., wx_)) * (0.55 + 0.45 * (1. - smoothstep(10., 90., wx_)));
      float dn_ = 1. - smoothstep(-0.55, 0.2, dot(normal, viewMatrix[1].xyz));
      vec2 cp_ = vec2(wx_, vOp.z) * 0.3;
      float c1_ = vn(cp_ + vec2(uTime * 0.33, uTime * 0.19)), c2_ = vn(cp_ * 1.7 + vec2(7. - uTime * 0.27, uTime * 0.31));
      float ca_ = 1. - abs(c1_ + c2_ - 1.); ca_ *= ca_; ca_ *= ca_ * ca_;
      totalEmissiveRadiance += diffuseColor.rgb * (uSunCol * (ca_ * nw_ * uCaust * 1.7) + uFill * 0.8 + uKick * 0.3) * dn_;
      float fz_ = 1. - abs(dot(normal, normalize(vViewPosition))); fz_ *= fz_;
      totalEmissiveRadiance += uAmb * (fz_ * 0.3 * (1. - dn_)) * (0.35 + diffuseColor.rgb);
      // a warm wrap of sun on the flank that faces it (unshadowed, soft), so the sunny side of her is the clearest value in the yard
      totalEmissiveRadiance += diffuseColor.rgb * uSunCol * (0.15 * smoothstep(-0.15, 0.85, dot(normal, uSunV)) * (1. - dn_));
      // and with the sun behind her a thin hot rim along whatever edge turns away from the eye
      totalEmissiveRadiance += uSunCol * (fz_ * fz_ * 0.5 * smoothstep(0.1, 0.7, -uSunV.z) * (1. - dn_)) * (0.2 + diffuseColor.rgb); }`},"hull")}const ne=new a.Matrix4,de=new a.Quaternion,pt=new a.Euler,xt=new a.Vector3,Le=new a.Vector3,oe=new a.Color,se=new a.Vector3,re=new a.Vector3,Ot=new a.Vector3(0,1,0),Vt=new a.Vector3(1,0,0);class bt{constructor(){this.list=[]}add(s,o,h){let l=s.index?s.toNonIndexed():s;h&&l.applyMatrix4(h);const r=l.attributes.position.count,n=new Float32Array(r*3);for(let t=0;t<r;t++)n[t*3]=o.r,n[t*3+1]=o.g,n[t*3+2]=o.b;l.setAttribute("color",new a.BufferAttribute(n,3)),l.attributes.uv||l.setAttribute("uv",new a.BufferAttribute(new Float32Array(r*2),2));for(const t of Object.keys(l.attributes))["position","normal","uv","color"].includes(t)||l.deleteAttribute(t);return this.list.push(l),this}box(s,o,h,l,r,n,t,c=0,i=0,f=0){return ne.compose(xt.set(s,o,h),de.setFromEuler(pt.set(c,i,f)),Le.set(1,1,1)),this.add(new a.BoxGeometry(l,r,n),t,ne)}cyl(s,o,h,l,r,n,t=!1){se.set(s[0],s[1],s[2]),re.set(o[0],o[1],o[2]);const c=se.distanceTo(re);return de.setFromUnitVectors(Ot,re.clone().sub(se).normalize()),ne.compose(se.clone().lerp(re,.5),de,Le.set(1,1,1)),this.add(new a.CylinderGeometry(l,h,c,r,1,t),n,ne)}build(){const s=Ft(this.list,!1);for(const o of this.list)o.dispose();return this.list=[],s}}class Re{constructor(){this.mat=[],this.col=[],this.anim=[],this.move=[],this.n=0}add(s,o,h,l,r,n,t,c=[0,0,0],i=null,f=null){ne.compose(xt.set(s,o,h),de.setFromEuler(pt.set(c[0],c[1],c[2],"YZX")),Le.set(l,r,n));for(let u=0;u<16;u++)this.mat.push(ne.elements[u]);this.col.push(t.r,t.g,t.b),this.anim.push(...i||[0,0,0,0]),this.move.push(...f||[0,0,0]),this.n++}span(s,o,h,l,r){se.set(s[0],s[1],s[2]),re.set(o[0],o[1],o[2]);const n=se.distanceTo(re);de.setFromUnitVectors(Vt,re.clone().sub(se).normalize()),ne.compose(se.clone().lerp(re,.5),de,Le.set(n,h,l));for(let t=0;t<16;t++)this.mat.push(ne.elements[t]);this.col.push(r.r,r.g,r.b),this.anim.push(0,0,0,0),this.move.push(0,0,0),this.n++}build(s,o){const h=s.clone();h.setAttribute("aAnim",new a.InstancedBufferAttribute(new Float32Array(this.anim),4)),h.setAttribute("aMove",new a.InstancedBufferAttribute(new Float32Array(this.move),3));const l=new a.InstancedMesh(h,o,this.n);return l.instanceMatrix.array.set(this.mat),l.instanceColor=new a.InstancedBufferAttribute(new Float32Array(this.col),3),l.castShadow=!0,l.receiveShadow=!0,l.frustumCulled=!1,l}}function Yt(){const e=new a.BoxGeometry(1,1,1).toNonIndexed(),s=e.attributes.position,o=e.attributes.normal,h=[];for(let c=0;c<s.count;c+=3)Math.abs(o.getX(c))<.5&&h.push(c,c+1,c+2);const l=[],r=[],n=[];for(const c of h)l.push(s.getX(c),s.getY(c),s.getZ(c)),r.push(o.getX(c),o.getY(c),o.getZ(c)),n.push(e.attributes.uv.getX(c),e.attributes.uv.getY(c));const t=new a.BufferGeometry;return t.setAttribute("position",new a.Float32BufferAttribute(l,3)),t.setAttribute("normal",new a.Float32BufferAttribute(r,3)),t.setAttribute("uv",new a.Float32BufferAttribute(n,2)),e.dispose(),t}const Kt=`
  vec3 sc_ = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
  float fr_ = aAnim.x < 0.5 ? -1e5 : (aAnim.x < 1.5 ? uFront.x : uFront.y);
  float e_ = clamp((fr_ - aAnim.y) / 16., 0., 1.); float ee_ = e_ * e_ * (3. - 2. * e_);
  float an_ = aAnim.z * ee_; float cs_ = cos(an_), sn_ = sin(an_);`;function Wt(e){return ee({color:16777215,roughness:.86,metalness:0},e,{vHead:"attribute vec4 aAnim; attribute vec3 aMove; uniform vec2 uFront; varying vec3 vLoc; varying vec3 vLn; varying float vSd;",vNormal:`${Kt}
      vec3 objectNormal = vec3(cs_ * normal.x - sn_ * normal.y, sn_ * normal.x + cs_ * normal.y, normal.z) * sc_;
      vLn = normal;`,vBegin:`vec3 transformed = position * sc_;
      vLoc = transformed; vSd = fract(instanceMatrix[3].x * 0.731 + instanceMatrix[3].z * 1.37 + instanceMatrix[3].y * 0.31);
      transformed.xy = vec2(cs_ * transformed.x - sn_ * transformed.y, sn_ * transformed.x + cs_ * transformed.y);
      transformed /= sc_;
      { vec3 d_ = aMove * ee_ + vec3(0., aAnim.w * abs(sin(e_ * 9.42)) * (1. - e_), 0.);
        transformed += (transpose(mat3(instanceMatrix)) * d_) / (sc_ * sc_); }`,fHead:"varying vec3 vLoc; varying vec3 vLn; varying float vSd;",fColor:`{
      vec3 an = abs(vLn); vec2 q = an.y > 0.5 ? vLoc.xz : (an.z > 0.5 ? vLoc.xy : vLoc.zy);
      float endGrain = step(0.5, an.x);
      float g1 = vn(vec2(q.x * 0.9 + vSd * 31., q.y * 22. + vSd * 7.)), g2 = vn(vec2(q.x * 3.1, q.y * 60. + vSd * 13.));
      float rings = 0.5 + 0.5 * sin(length(vLoc.zy + (vSd - 0.5) * 0.2) * 70.);
      float tone = mix(0.72 + 0.4 * g1 * (0.6 + 0.4 * g2), 0.62 + 0.3 * rings, endGrain);
      float check = smoothstep(0.78, 0.8, vn(vec2(q.x * 0.5 + 9., q.y * 34.))) * (1. - endGrain);
      diffuseColor.rgb *= tone * (1. - 0.45 * check) * (0.85 + 0.3 * vSd);
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.045, 0.036, 0.028), smoothstep(0.55, 0.9, vn(vLoc.xz * 0.8 + vSd * 40.)) * 0.4);
    }`,fEmis:`{ float fz_ = 1. - max(dot(normal, normalize(vViewPosition)), 0.); fz_ *= fz_; fz_ *= fz_;
      totalEmissiveRadiance += uFill * fz_ * 0.5 * smoothstep(0.2, 0.8, dot(normal, viewMatrix[1].xyz)); }`},"timber")}const wt=`
  float e_ = clamp((uFront.y - aFoot.x - aSeed.x * 12.) / 26., 0., 1.); float ee_ = e_ * e_;
  ee_ = ee_ + 0.06 * sin(e_ * 15.7) * e_ * (1. - e_) * 4. * step(0.8, e_);
  vec3 dir_ = normalize(mix(aHead.xyz, aFall, clamp(ee_, 0., 1.)) + vec3(0., 0.3 * sin(clamp(ee_, 0., 1.) * 3.14159), 0.));
  vec3 ref_ = abs(dir_.x) < 0.9 ? vec3(1., 0., 0.) : vec3(0., 0., 1.);
  vec3 bx_ = normalize(cross(ref_, dir_)); vec3 bz_ = cross(bx_, dir_);
  float rad_ = aSeed.y * (1. - 0.28 * position.y);
  float dst_ = length((modelViewMatrix * vec4(aFoot + dir_ * aHead.w * 0.5, 1.)).xyz);
  rad_ = max(rad_, dst_ * 0.0006);`;function Dt(e,s,o,h){const l=[],r=[],n=[],t=[],c=[];for(let x=0;x<30;x++){const y=14+x*8;for(const w of[1,-1])for(let S=0;S<10;S++){const C=y-10+e.range(-.3,.3),M=E(C/F),z=X(M),k=Math.max(z.yK+1.2,1.4)+S*(z.yR-Math.max(z.yK,0)-4.5)/9+e.range(-.5,.5),K=J(M,k);if(K<6.5||C<22)continue;const _=h(C,k,w*(K-.05)),B=w*(9.6+S*1.35+e.range(-.3,.3)),V=_[0]+e.range(-.5,.5),L=P(V)+.05;if(D.some(_e=>Math.hypot(V-_e[0],B-_e[1])<6.2))continue;const U=_[0]-V,Q=_[1]-L,G=_[2]-B,Y=Math.hypot(U,Q,G);l.push(V,L,B),r.push(U/Y,Q/Y,G/Y,Y);const Ie=Math.abs(B)<17?e.range(10,13.6):e.range(21,23.4),ie=w*Math.max(-.6,Math.min(.6,(Ie-Math.abs(B))/Y)),ge=(e.chance(.72)?-1:1)*Math.sqrt(1-ie*ie);n.push(ge,ge*O+.012+e.range(0,.03),ie),t.push(e()+S*.12,.2+Y*.007+e.range(0,.05)),oe.copy(o.timber).lerp(e.chance(.3)?o.timberPale:o.timberDark,e.range(0,.6)),c.push(oe.r,oe.g,oe.b)}}const i=new a.CylinderGeometry(1,1,1,7,1,!0).translate(0,.5,0),f=new a.InstancedBufferGeometry;f.index=i.index;for(const x of["position","normal","uv"])f.setAttribute(x,i.attributes[x]);f.setAttribute("aFoot",new a.InstancedBufferAttribute(new Float32Array(l),3)),f.setAttribute("aHead",new a.InstancedBufferAttribute(new Float32Array(r),4)),f.setAttribute("aFall",new a.InstancedBufferAttribute(new Float32Array(n),3)),f.setAttribute("aSeed",new a.InstancedBufferAttribute(new Float32Array(t),2)),f.setAttribute("aCol",new a.InstancedBufferAttribute(new Float32Array(c),3)),f.instanceCount=t.length/2;const u="attribute vec3 aFoot; attribute vec4 aHead; attribute vec3 aFall; attribute vec2 aSeed; attribute vec3 aCol; uniform vec2 uFront;",v=ee({color:16777215,roughness:.88,metalness:0},s,{vHead:u+" varying vec3 vSc; varying vec3 vSl;",vNormal:wt+`
vec3 objectNormal = bx_ * normal.x + dir_ * normal.y + bz_ * normal.z;`,vBegin:"vec3 transformed = aFoot + dir_ * (position.y * aHead.w) + (bx_ * position.x + bz_ * position.z) * rad_; vSc = aCol; vSl = vec3(position.y * aHead.w, aSeed.x, aHead.w);",fHead:"varying vec3 vSc; varying vec3 vSl;",fColor:`{ float g1 = vn(vec2(vSl.x * 0.7 + vSl.y * 37., vHuv.x * 26.)); float band = smoothstep(0.6, 0.85, vn(vec2(vSl.x * 0.35 + vSl.y * 11., 2.)));
      // rough-barked spars, weathered grey-brown: long checks, darker knots, tarred feet and bruised heads
      float bark = vn(vec2(vSl.x * 0.22 + vSl.y * 53., vHuv.x * 61.)), knot = smoothstep(0.7, 0.86, vn(vec2(vSl.x * 1.3 + vSl.y * 19., vHuv.x * 9.)));
      vec3 sc_ = mix(vec3(dot(vSc, vec3(0.3, 0.5, 0.2))), vSc, 0.62) * 0.74;
      diffuseColor.rgb = sc_ * (0.66 + 0.4 * g1 + 0.22 * bark) * (1. - 0.3 * band) * (1. - 0.5 * knot);
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.05, 0.04, 0.03), max((1. - smoothstep(0., 1.6, vSl.x)) * 0.6, (1. - smoothstep(0., 0.7, vSl.z - vSl.x)) * 0.5)); }`},"shore"),d=new a.Mesh(f,v);d.frustumCulled=!1,d.castShadow=!0,d.receiveShadow=!0;const m=new a.MeshDepthMaterial({depthPacking:a.RGBADepthPacking});return m.onBeforeCompile=x=>{x.uniforms.uFront=s.uFront,x.vertexShader=x.vertexShader.replace("#include <common>",`#include <common>
`+u).replace("#include <begin_vertex>",wt+`
vec3 transformed = aFoot + dir_ * (position.y * aHead.w) + (bx_ * position.x + bz_ * position.z) * rad_;`)},m.customProgramCacheKey=()=>"slipway-shore-depth",d.customDepthMaterial=m,i.dispose(),d}function qt(e,s){const o=[],h=[],l=[],r=(u,v,d,m,x,y)=>{for(const w of[u,v,d,u,d,m])o.push(...w),l.push(...x),h.push(y,0)},n=[-40,270,290],t=[-O,1,0];for(let u=0;u<2;u++){const v=n[u],d=n[u+1],m=P(v),x=P(d);r([v,m,30],[d,x,30],[d,x,-30],[v,m,-30],u===0?t:[0,1,0],0);for(const w of[1,-1]){const S=[v,m,w*30],C=[d,x,w*30],M=[d,-6,w*30.6],z=[v,-6,w*30.6];w>0?r(C,S,z,M,[0,.02,1],1):r(S,C,M,z,[0,.02,-1],1)}}r([290,P(290),-30],[290,P(290),30],[290.5,-6,30.6],[290.5,-6,-30.6],[1,0,0],2),r([-40,P(-40),30],[-40,P(-40),-30],[-40.5,-6,-30],[-40.5,-6,30],[-1,0,0],2);const c=new a.BufferGeometry;c.setAttribute("position",new a.Float32BufferAttribute(o,3)),c.setAttribute("normal",new a.Float32BufferAttribute(l,3)),c.setAttribute("uv",new a.Float32BufferAttribute(h,2));const i=ee({color:16777215,roughness:.85,metalness:0},e,{uniforms:{uWood:{value:s.deck},uStone:{value:s.stone},uPetal:{value:s.pink}},fHead:"uniform vec3 uWood, uStone, uPetal, uSunCol; uniform float uTime; float hgt; float bumpK; float gloss;",fColor:`{
      float dist = length(vViewPosition), fade = 1. - smoothstep(60., 220., dist);
      vec3 col;
      if (vHuv.x < 0.5) {
        float pw = 0.42, pid = floor(vOp.x / pw), px = fract(vOp.x / pw);
        float zz = vOp.z + h21(vec2(pid, 1.)) * 7., seg = floor(zz / 7.), ez = fract(zz / 7.) * 7.;
        float rnd = h21(vec2(pid, seg));
        float aa = clamp(fwidth(vOp.x) / pw, 0.001, 0.5);
        float seam = (1. - smoothstep(0.03, 0.07 + aa, min(px, 1. - px))) * (1. - smoothstep(0.25, 0.6, aa));
        float butt = (1. - smoothstep(0.02, 0.06, min(ez, 7. - ez))) * fade;
        float grain = vn(vec2(vOp.z * 0.8 + rnd * 40., vOp.x * 16.));
        col = uWood * mix(1., 0.72 + 0.5 * rnd, 0.35 + 0.65 * fade) * (0.8 + 0.3 * grain * fade);
        col *= 0.8 + 0.3 * vn(vOp.xz * 0.06) + 0.12 * vn(vOp.xz * 0.5);
        col *= 1. - 0.6 * seam - 0.4 * butt;
        // pale new weed and moss in the seams, petals drifted against the gantry feet
        float weed = seam * smoothstep(0.5, 0.75, vn(vOp.xz * 0.35 + 9.));
        col = mix(col, vec3(0.2, 0.27, 0.1), weed * 0.7);
        float lane = abs(abs(vOp.z) - 7.);
        float grease = (1. - smoothstep(1.0, 2.6, lane)) * (0.55 + 0.45 * vn(vec2(vOp.x * 0.25, vOp.z * 2.)));
        float tallow = (1. - smoothstep(0.9, 1.5, lane)) * smoothstep(0.45, 0.8, vn(vec2(vOp.x * 0.5, vOp.z * 5.)));
        col = mix(col, vec3(0.075, 0.062, 0.05), grease * 0.75); col = mix(col, vec3(0.5, 0.45, 0.3), tallow * 0.4);
        float nave = (1. - smoothstep(4., 9., abs(vOp.z))); col *= 1. - 0.15 * nave * vn(vOp.xz * 0.9);
        float drift = smoothstep(0.56, 0.92, vn(vOp.xz * vec2(0.07, 0.3) + 4.) * (0.35 + 0.65 * smoothstep(17., 27., abs(vOp.z))) + 0.14 * vn(vOp.xz * 1.1) - 0.04);
        col = mix(col, uPetal * (0.75 + 0.25 * vn(vOp.xz * 7.)), drift * 0.42 * smoothstep(4., 14., vOp.x));
        float wet = 1. - smoothstep(0., 9., vOp.x); col *= 1. - 0.5 * wet; col = mix(col, vec3(0.08, 0.14, 0.09), wet * 0.4 * vn(vOp.xz * 0.4));
        gloss = max(grease * 0.6, wet * 0.6);
        hgt = -0.012 * seam * fade; bumpK = 1.;
      } else {
        vec2 q = vec2(vHuv.x > 1.5 ? vOp.z : vOp.x, vOp.y); float row = floor(q.y / 0.8); q.x += h21(vec2(row, 2.)) * 2.;
        float bid = floor(q.x / 1.7); vec2 f = vec2(fract(q.x / 1.7) * 1.7, fract(q.y / 0.8) * 0.8);
        float joint = 1. - smoothstep(0.02, 0.06, min(min(f.x, 1.7 - f.x), min(f.y, 0.8 - f.y)));
        col = uStone * (0.75 + 0.4 * h21(vec2(bid, row))) * (0.8 + 0.3 * vn(q * 1.3)) * (1. - 0.5 * joint * fade);
        float tide = 1. - smoothstep(0.2, 2.2, vOp.y); col = mix(col, vec3(0.06, 0.1, 0.07), tide * 0.75);
        col = mix(col, vec3(0.16, 0.2, 0.1), smoothstep(0.6, 0.8, vn(q * 0.4)) * 0.5);
        gloss = 0.; hgt = -0.02 * joint * fade; bumpK = 1.;
      }
      diffuseColor.rgb = col;
    }`,fRough:"roughnessFactor = mix(0.9, 0.32, gloss);",fNormal:qe,fEmis:`{ float fz_ = 1. - max(dot(normal, normalize(vViewPosition)), 0.); fz_ *= fz_; fz_ *= fz_;
      vec2 cp_ = vOp.xz * 0.3; float c1_ = vn(cp_ + vec2(uTime * 0.33, uTime * 0.19)), c2_ = vn(cp_ * 1.7 + vec2(7. - uTime * 0.27, uTime * 0.31));
      float ca_ = 1. - abs(c1_ + c2_ - 1.); ca_ *= ca_; ca_ *= ca_ * ca_; ca_ *= (1. - smoothstep(10., 215., vOp.x)) * smoothstep(-2., 3., vOp.x);
      totalEmissiveRadiance += (diffuseColor.rgb * (uFill * 0.9 + uKick * 0.35 + uSunCol * ca_ * 1.2) + uFill * fz_ * (0.25 + 1.1 * gloss)) * step(vHuv.x, 0.5); }`},"slip"),f=new a.Mesh(c,i);return f.receiveShadow=!0,f.castShadow=!1,f}function Et(e){return ee({color:16777215,roughness:.7,metalness:.35},e,{vHead:"attribute vec4 aAnim; attribute vec3 aMove; uniform float uTime; varying vec3 vLoc; varying float vSd; varying float vWy;",vBegin:`vec3 transformed = position;
      { vec3 sc_ = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
        float dst_ = length((modelViewMatrix * instanceMatrix * vec4(0., 0., 0., 1.)).xyz);
        transformed.yz *= max(vec2(1.), dst_ * 0.0017 / sc_.yz);
        vLoc = position * sc_; vSd = fract(instanceMatrix[3].x * 0.37 + instanceMatrix[3].y * 0.71 + instanceMatrix[3].z * 0.13);
        vec3 d_ = aMove * sin(uTime * aAnim.z + aAnim.w) * step(2.5, aAnim.x);
        transformed += (transpose(mat3(instanceMatrix)) * d_) / (sc_ * sc_); vWy = (instanceMatrix * vec4(transformed, 1.)).y; }`,fHead:"varying vec3 vLoc; varying float vSd; varying float vWy; uniform vec3 uSunCol, uSunV;",fColor:`{ float r = vn(vec2(vLoc.x * 0.9 + vSd * 50., vSd * 9.)); float r2 = vn(vec2(vLoc.x * 5., vSd * 77.));
      diffuseColor.rgb *= 0.8 + 0.3 * r2;
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.3, 0.12, 0.05) * (0.7 + 0.6 * r2), smoothstep(0.5, 0.82, r) * 0.7);
      float gus = 1. - smoothstep(0.1, 0.22, abs(fract(vLoc.x / 2.5) - 0.5) * 2.5);
      diffuseColor.rgb *= 1. - 0.18 * gus; }`,fEmis:`{ float fz_ = 1. - abs(dot(normal, normalize(vViewPosition))); fz_ *= fz_;
      totalEmissiveRadiance += uSunCol * (fz_ * 0.4 * smoothstep(0.1, 0.6, -uSunV.z) * smoothstep(34., 56., vWy)) * (0.25 + diffuseColor.rgb); }`},"steel")}function Gt(e,s,o,h){const l=new Re,r=new Re,n=[],t=(i,f,u,v,d=u)=>l.span(i,f,d,u,v),c=(i,f,u,v,d=u)=>r.span(i,f,d,u,v);for(const i of[1,-1]){const f=[];for(let u=0;u<7;u++){const v=30+u*40,d=i*26,m=P(v),x=55,y=[],w=oe.copy(o.steel).lerp(o.oxide,e.range(.25,.55)).clone(),S=w.clone().multiplyScalar(.8),C=i>0&&v<=230;for(let _=0;_<=10;_++){const B=_/10,V=m+x*(1-Math.pow(1-B,1.25));y.push([V,R(3.4,2.2,B),R(3,2.2,B)])}const M=(_,B,V)=>[v+B*y[_][1],y[_][0],d+V*y[_][2]],z=[[-1,-1],[1,-1],[1,1],[-1,1]];for(const _ of z)t(M(0,_[0],_[1]),M(10,_[0],_[1]),.6,w);for(let _=0;_<=10;_++)for(let B=0;B<4;B++){const V=z[B],L=z[(B+1)%4];if(_>0&&c(M(_,V[0],V[1]),M(_,L[0],L[1]),.3,S),_<10){const U=(_+B)%2===0;if(C&&(B===0||B===3)&&y[_+1][0]-m>12&&y[_][0]-m<45)continue;c(M(_,...U?V:L),M(_+1,...U?L:V),.26,S),_<2&&c(M(_,...U?L:V),M(_+1,...U?V:L),.26,S)}}const k=m+x,K=[v,k-.6,i*17];for(const _ of[-2.2,2.2])t([v+_,k,d-i*2.2],[v+_*.35,k-.4,i*16.4],.34,w),c([v+_,y[8][0],d-i*y[8][2]],[v+_*.35,k-.9,i*17.6],.26,S);c([v-.9,k-.5,i*16.6],[v+.9,k-.5,i*16.6],.3,S);for(const _ of[-.35,.35])c([v+_,m,d+i*3.25],[v+_,k,d+i*2.45],.09,S);f.push([v,k,d]),n.push([v,k+1.2,d]),h.push(K),t([v,k,d],[v,k+1.3,d],3.6,S,3.6),t([v,k+1.3,d],[v,k+4.5,d],.16,w)}for(let u=0;u<6;u++){const v=f[u],d=f[u+1],m=oe.copy(o.steel).lerp(o.oxide,.2).clone(),x=(y,w,S)=>[R(v[0],d[0],y),R(v[1],d[1],y)+w,v[2]+S];for(const y of[-1.5,1.5])for(const w of[-.2,-3.4])t(x(.05,w,y),x(.95,w,y),.36,m);for(let y=0;y<8;y++){const w=.05+y*.1125,S=w+.1125,C=y%2===0;for(const M of[-1.5,1.5])c(x(S,-.2,M),x(S,-3.4,M),.2,m),c(x(C?w:S,-.2,M),x(C?S:w,-3.4,M),.2,m);c(x(S,-.2,-1.5),x(S,-.2,1.5),.2,m)}if(t([v[0],v[1]-1.3,i*17],[d[0],d[1]-1.3,i*17],.42,m,.7),e.chance(.6)&&!(i>0&&u===5)){const y=e.range(.3,.7),w=R(v[0],d[0],y),S=R(v[1],d[1],y)-1.9,C=e.range(6,14),M=l.n,z=e.range(5,9),k=e.range(.06,.11),K=e.range(0,we);if(i>0&&u===2)continue;t([w-1.2,S,i*17],[w+1.2,S,i*17],1.1,o.oxide,.8),t([w,S,i*17],[w,S-C,i*17],.1,o.dark),t([w,S-C,i*17],[w,S-C-1.3,i*17],.6,o.oxide,.5);for(let _=M;_<l.n;_++)l.anim.splice(_*4,4,3,0,k,K),l.move.splice(_*3,3,z,z*O,0)}}}return{S:l,S2:r,tops:n}}function Xt(e,s,o){const h=Math.atan(O),l=(r,n=.25)=>oe.copy(r).multiplyScalar(1+e.range(-n,n)).clone();for(const r of[1,-1]){for(let n=-34;n<262;n+=12)o.add(n,P(n)+.3,r*7,11.9,.6,1.9,l(s.grease,.15),[0,0,h]);for(let n=0;n<30;n++){const t=18+n*8+e.range(-1.2,1.2),c=r*(4.75+e.range(-.15,.35)),i=e.int(2,3),f=e.range(-.15,.15);for(let u=0;u<i;u++){const v=u===i-1,d=v&&e.chance(.45),m=-e.range(5,22);o.add(t+e.range(-.1,.1),P(t)+.26+u*.5,c+e.range(-.08,.08),1.5,.5,u%2?1.25:1.4,l(u%2?s.timber:s.timberDark),[0,f+(u%2?W/2:0)+e.range(-.08,.08),h*(u%2?0:1)],d?[2,t+e.range(0,14),e.sign()*e.range(4,11),e.range(.4,.9)]:null,d?[m,m*O-u*.5,r*e.range(-.4,1.2)]:null)}if(e.chance(.6))for(let u=0;u<4;u++)o.add(t+2.2+e.range(-.5,.5),P(t+2.2)+.09+(u>2?.16:0),c+e.range(-.5,.5),1,.15,.24,l(s.timberPale),[0,e.range(0,W),h*.5+e.range(-.1,.1)]);if(e.chance(.55)){const u=t-2.4+e.range(-.6,.6),v=c+r*e.range(-.3,.9),d=e.range(0,we);o.add(u,P(u)+.1,v,1,.06,.06,s.timberPale,[0,d,.05]),o.add(u+Math.cos(d)*.5,P(u)+.13,v-Math.sin(d)*.5,.2,.2,.34,s.dark,[0,d,0])}}for(let n=14;n<249;n+=2.5)o.add(n,P(n)+.78,r*8.15,.24,.16,1.5,l(s.timberPale,.2),[e.range(-.05,.05),e.range(-.1,.1),h],[1,n-8+e.range(-2,2),e.range(-.3,.3),.12],[e.range(-.3,.1),-.66,r*e.range(.5,1.1)]);for(let n=0;n<7;n++)for(const t of[-3.4,3.4])for(const c of[-3,3]){const i=30+n*40+t;o.add(i,P(i)+.16,r*26+c,1.6,.32,1.6,l(s.timberDark))}}return o}function Ut(e,s,o,h,l){for(const r of[1,-1])for(let n=0;n<11;n++){const t=34+n*19+e.range(-4,4);if(r>0&&t>196||r<0&&e.chance(.5))continue;if(r>0&&t>100){(t<=150||!e.chance(.65))&&(e.range(7,25),e.range(7,11),e.range(.75,1.1),e.range(.75,1.1));continue}const c=e.range(7,25),i=E((t-10)/F),f=J(i,c),u=e.range(7,11),v=l(t-10,c,0)[1],d=r*Math.max(16.2,f+2.2),m=P(t)+53.6;for(const x of[-.33,.33])o.add(t,v,d+x,u,.09,.6,oe.copy(s.timberPale).multiplyScalar(e.range(.75,1.1)).clone(),[0,0,Math.atan(O)]);for(const x of[-1,1]){const y=t+x*(u/2-.5),w=v+x*(u/2-.5)*O;h.span([y,w,d-.6],[y,w,d+.6],.14,.14,s.timberDark),h.span([y,w,d],[y,m,r*17],.07,.07,s.rope),h.span([y,w+1.1,d-.62],[y-x*(u-1),w+1.1-x*(u-1)*O,d-.62],.05,.05,s.rope)}}}function jt(e,s,o){const h=-ce+.95,l=(r,n=.2)=>oe.copy(r).multiplyScalar(1+e.range(-n,n)).clone();for(const r of[1,-1]){for(let t=9;t<236;t+=10)o.add(t,h,r*7,9.9,.7,1.5,l(s.grease,.2));let n=null;for(let t=8;t<=234;t+=2){const c=t/F,i=X(c),f=c<.17||c>.83;if((t-8)%4!==0&&!f||i.yK>12)continue;let u=ht(c,7),v=7;u<0&&(u=i.yK+i.hb*.85,v=Math.max(.6,J(c,u)));const d=[t,h+.35,r*7],m=[t,u-.15,r*v];o.span(d,m,f?.62:.5,f?.62:.5,l(f?s.timberDark:s.timber)),o.add(t,u-.02-(v<7?.5:.12),r*(v+(v<7?.25:0)),1.3,.26,1,l(s.timberPale),[0,0,0]),n&&(t-8)%8===0&&o.span([t-(f?2:4),h+.5,r*7.42],[t,R(h,n,.86),r*R(7.42,v+.42,.86)],.3,.22,l(s.timberDark)),n=u}for(const t of[.3,.68])for(let c=14;c<232;c+=12){const i=Math.max(0,ht(c/F,7));R(h,i,t)>i-.3&&t>.5||o.add(c,R(h,0,t),r*7.4,11.9,.34,.26,l(s.timber))}}}async function Qt(e,s,o,h){const l=new bt,r=o.deck;{const t=[],c=[],i=[];let f=0;for(let m=0;m<=80;m++){const x=.004+m/80*.99,y=X(x),w=y.yR-1.1,S=Math.max(.05,J(x,w)-.06),C=.8+.3*e();for(const M of[-1,1])t.push(x*F,w,M*S),c.push(r.r*C,r.g*C,r.b*C);m>0&&i.push(f-2,f,f-1,f-1,f,f+1),f+=2}const u=new a.BufferGeometry;u.setAttribute("position",new a.Float32BufferAttribute(t,3)),u.setIndex(i),u.computeVertexNormals();const v=u.toNonIndexed(),d=new Float32Array(v.attributes.position.count*3);for(let m=0;m<i.length;m++)d[m*3]=c[i[m]*3],d[m*3+1]=c[i[m]*3+1],d[m*3+2]=c[i[m]*3+2];v.setAttribute("color",new a.BufferAttribute(d,3)),v.setAttribute("uv",new a.BufferAttribute(new Float32Array(v.attributes.position.count*2),2)),l.list.push(v),u.dispose()}await h();const n=t=>X(t/F).yR-1.1;for(const[t,c,i]of[[78,16,9],[104,12,8],[128,12,8],[152,18,10],[186,9,6],[52,9,6]]){l.box(t,n(t)+.6,0,c,1.2,i,s.steelDark),l.box(t,n(t)+1.22,0,c-.7,.04,i-.7,s.black);for(let f=-1;f<=1;f++)l.box(t+f*c*.3,n(t)+1.3,0,.3,.3,i+.3,s.oxideDark)}for(let t=14;t<40;t+=3)l.box(t,n(t)+.12,0,.35,.24,2*J(t/F,n(t))-1.5,s.oxideDark);for(let t=30;t<220;t+=21)for(const c of[1,-1]){const i=c*(J(t/F,n(t))-1.4);for(const f of[-.5,.5])l.cyl([t+f,n(t),i],[t+f,n(t)+.9,i],.26,.3,7,s.dark)}l.box(218,n(218)+.7,0,3.4,1.4,5.2,s.steelDark);for(const t of[1,-1])l.cyl([218,n(218)+1.2,t*1.9],[218,n(218)+1.2,t*3.3],.9,.9,9,s.dark);for(const t of[230.5,6,120])l.cyl([t,n(t),0],[t,n(t)+(t===120?14:11),0],.2,.12,6,s.timberPale);await h();{const t=new a.Shape,c=[[10.1,1.3],[5.4,.9],[3.9,3.2],[3.8,15.5],[5.4,19.2],[9.4,20.6],[10.1,20.6]];t.moveTo(c[0][0],c[0][1]);for(let f=1;f<c.length;f++)t.lineTo(c[f][0],c[f][1]);t.closePath();const i=new a.ExtrudeGeometry(t,{depth:.5,bevelEnabled:!0,bevelThickness:.12,bevelSize:.12,bevelSegments:1,steps:1}).translate(0,0,-.25);l.add(i,o.bot),l.cyl([9.9,19.5,0],[9.9,25,0],.5,.5,8,o.bot);for(const f of[3,8,13,18])l.box(10.2,f,0,1.4,.5,.9,s.oxideDark);for(const f of[5.5,10.5,15.5])l.box(7,f,0,6.2,.22,.62,s.oxideDark)}for(const t of[1,-1]){await h(),l.cyl([47,4.9,t*4.9],[15.4,4.8,t*5.6],1.25,.8,10,o.bot),l.cyl([17.2,4.8,t*5.6],[18.4,10.2,t*1.1],.34,.4,6,o.bot),l.cyl([17.2,4.8,t*5.6],[18.2,1.6,t*.5],.34,.4,6,o.bot);const c=[],i=[0,0];for(let m=0;m<26;m++){const x=.3+m*.016,y=x+.016,w=fe(X(x),.27,[0,0]).slice(),S=fe(X(y),.27,i),C=.95*Math.sin(W*(m/26))**.4,M=.95*Math.sin(W*((m+1)/26))**.4,z=[x*F,w[0],t*w[1]],k=[y*F,S[0],t*S[1]],K=[z[0],z[1]-C*.7,z[2]+t*C*.7],_=[k[0],k[1]-M*.7,k[2]+t*M*.7];c.push(...z,...k,..._,...z,..._,...K)}const f=new a.BufferGeometry;f.setAttribute("position",new a.Float32BufferAttribute(c,3)),f.computeVertexNormals(),l.add(f,o.bot);const u=224,v=21.5,d=J(u/F,v);l.cyl([u,v,t*(d-.6)],[u+.5,v-.5,t*(d+.45)],.85,.95,9,s.dark),l.box(u+.4,v-2.2,t*(d+.5),.45,3.4,.45,s.dark,0,0,.12),l.box(u+.2,v-4,t*(d+.5),2.6,.6,.6,s.dark);for(const m of[-1,1])l.box(u+.2+m*1.1,v-3.3,t*(d+.55),.5,1.7,.4,s.dark,0,0,m*.35)}return l.cyl([238.6,33.2,0],[242.7,34.4,0],.16,.1,6,s.timberPale),l.cyl([242.2,34.25,0],[242.2,30,0],.05,.05,5,s.rope),await h(),l.build()}function $t(e){const s=new bt;for(let o=0;o<4;o++){const r=[],n=[];for(let c=0;c<=7;c++)for(let i=0;i<=4;i++){const f=c/7,u=.6+f*2.4,v=i/4*2-1,d=.2+1.15*Math.pow(Math.sin(W*Math.pow(f,.62)*.96+.06),.8),m=Math.atan(5.5/(we*u)),x=v*d*Math.cos(m)/u+o*W/2+.25*f,y=v*d*Math.sin(m)-.12*f;r.push(y,u*Math.cos(x),u*Math.sin(x))}for(let c=0;c<7;c++)for(let i=0;i<4;i++){const f=c*5+i,u=f+4+1;n.push(f,u,f+1,u,u+1,f+1)}const t=new a.BufferGeometry;t.setAttribute("position",new a.Float32BufferAttribute(r,3)),t.setIndex(n),t.computeVertexNormals(),s.add(t,e.bronze)}return s.cyl([-.9,0,0],[.9,0,0],.8,.72,12,e.bronze),s.cyl([-.9,0,0],[-2.3,0,0],.72,.08,12,e.bronze),s.build()}const Ee=120,yt=150;function Zt(e,s,o){const h=[],l=[],r=[],n=[];let t=0;for(let x=0;x<6;x++){const S=e.range(0,50);for(let C=0;C<=7;C++)for(let M=0;M<=18;M++){const z=C/7,k=M/18*we,K=1+.16*Math.sin(k*3+S)*z+.1*Math.sin(k*7+S*2+z*5),_=4.7*Math.pow(z,.8)*K,B=5*Math.pow(Math.cos(z*W/2),.85)*(.9+.1*Math.sin(k*2+S));h.push(Math.cos(k)*_,B,Math.sin(k)*_),l.push(M/18*26,z*9),r.push(x)}for(let C=0;C<7;C++)for(let M=0;M<18;M++){const z=t+C*19+M,k=z+18+1;n.push(z,z+1,k,k,z+1,k+1)}t+=152}const c=new a.BufferGeometry;c.setAttribute("position",new a.Float32BufferAttribute(h,3)),c.setAttribute("uv",new a.Float32BufferAttribute(l,2)),c.setAttribute("aPile",new a.Float32BufferAttribute(r,1)),c.setIndex(n),c.computeVertexNormals();const i={value:D.map(x=>new a.Vector4(x[0],x[0],Math.sign(x[1]),0))},f="{ float r = vn(vOp.xz * 1.1 + vOp.y) * vn(vOp.xy * 3.7 + 5.); diffuseColor.rgb = mix(uIron, uRust * (0.7 + 0.6 * vn(vOp.zy * 6.)), smoothstep(0.12, 0.42, r));",u=new a.Mesh(c,ee({color:16777215,roughness:.8,metalness:.3},s,{uniforms:{uChain:i,uIron:{value:o.iron},uRust:{value:o.rust}},vHead:"attribute float aPile; uniform vec4 uChain[6]; varying float vPay;",vBegin:`vec3 transformed = position;
      { vec4 ch_ = uChain[int(aPile + 0.5)]; float pay_ = ch_.w; vPay = pay_;
        transformed.y *= 1. - 0.9 * pay_; transformed.xz *= 1. - 0.3 * pay_; transformed.x -= pay_ * (3. + 1.2 * position.y);
        transformed += vec3(ch_.y, min(ch_.y, 270.) * ${O.toFixed(5)}, ch_.z * 19.); }`,fHead:"uniform vec3 uIron, uRust; varying float vPay; float hgt; float bumpK;",fColor:`{ vec2 q = vHuv * vec2(1.9, 3.); q.x += floor(q.y) * 0.5; vec2 f = fract(q) - 0.5;
      float ring = abs(length(f * vec2(1., 1.5)) - 0.3); float link = 1. - smoothstep(0.07, 0.16, ring);
      float rr = vn(vHuv * 0.9) * vn(vHuv * 3.1 + 4.);
      float lf = 1. - smoothstep(50., 170., length(vViewPosition));
      diffuseColor.rgb = mix(uIron * mix(1., 0.7, lf), mix(uIron * 1.6, uRust * (0.7 + 0.5 * vn(vHuv * 5.)), smoothstep(0.08, 0.42, rr)), mix(0.6, link, lf));
      hgt = 0.16 * link * (1. - smoothstep(60., 160., length(vViewPosition))); bumpK = 1.; }`,fNormal:qe},"mound"));u.castShadow=!0,u.receiveShadow=!0,u.frustumCulled=!1;const v=new a.TorusGeometry(.42,.13,4,6),d=[];for(let x=0;x<6;x++)for(let y=0;y<Ee;y++)d.push(x,y/Ee,e(),y%2);v.setAttribute("aLink",new a.InstancedBufferAttribute(new Float32Array(d),4));const m=new a.InstancedMesh(v,ee({color:16777215,roughness:.75,metalness:.4},s,{uniforms:{uChain:i,uIron:{value:o.iron},uRust:{value:o.rust}},vHead:"attribute vec4 aLink; uniform vec4 uChain[6]; uniform float uTime;",vNormal:"vec3 objectNormal = aLink.w > 0.5 ? normal : normal.xzy * vec3(1., 1., -1.);",vBegin:`vec3 transformed = aLink.w > 0.5 ? position : position.xzy * vec3(1., 1., -1.);
      { vec4 ch_ = uChain[int(aLink.x + 0.5)]; float cx_ = ch_.x + aLink.y * ${yt.toFixed(1)};
        float out_ = step(cx_, ch_.y - 2.5); float q_ = 1. - aLink.y;
        float lane_ = ch_.z * (mix(15.6, 19., smoothstep(0., 60., cx_ - ch_.x)) + sin(aLink.y * 31. + aLink.z * 2.) * 0.5 * (1. - aLink.y * 0.5));
        transformed.x *= 1.5; transformed *= out_ * 1.4;
        float jit_ = (aLink.z - 0.5) * 0.25 + 0.05 * sin(uTime * 23. + aLink.z * 40.) * step(0.001, ch_.w) * step(ch_.w, 2.5);
        transformed += vec3(cx_, min(cx_, 270.) * ${O.toFixed(5)} + 0.7 + aLink.w * 0.36 + jit_ * out_, lane_); }`,fHead:"uniform vec3 uIron, uRust;",fColor:f+" }"},"links"),6*Ee);return m.frustumCulled=!1,m.castShadow=!1,m.receiveShadow=!0,{mound:u,links:m,uChain:i}}function Jt(e,s,o,h){const l=[],r=[],n=Math.round(150*h),t=Math.round(26*h),c=Math.round(34*h);for(let d=0;d<n;d++){const m=e.range(-20,255);l.push(m,P(m)+.8,e.sign()*7+e.range(-1,1)),r.push(0,e(),e.range(3.2,6.2),0)}for(let d=0;d<6;d++)for(let m=0;m<t;m++){const x=D[d][0]-(m<t*.4?e.range(-2,20):e.range(15,150));l.push(x,P(x)+1.5,Math.sign(D[d][1])*e.range(14.5,21.5)),r.push(1,e(),e.range(6,10.5),d)}for(let d=0;d<c;d++)l.push(e.range(-6,30),e.range(0,3),e.range(-17,17)),r.push(2,e(),e.range(5,11),0);for(let d=0;d<c*.7;d++)l.push(e.range(200,244),e.range(0,3),e.range(-15,15)),r.push(3,e(),e.range(4,9),0);const i=new a.InstancedBufferGeometry,f=new a.PlaneGeometry(2,2);i.index=f.index,i.setAttribute("position",f.attributes.position),i.setAttribute("uv",f.attributes.uv),i.setAttribute("aCenter",new a.InstancedBufferAttribute(new Float32Array(l),3)),i.setAttribute("aK",new a.InstancedBufferAttribute(new Float32Array(r),4)),i.instanceCount=r.length/4;const u=new a.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!0,uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{uSmokeCol:{value:o.smoke},uDustCol:{value:o.rustDust}}]),vertexShader:`
      attribute vec3 aCenter; attribute vec4 aK; uniform float uTime; uniform vec4 uChain[6]; uniform vec4 uLaunch; uniform vec3 uHullPos; uniform vec2 uHullRot, uHullYaw; uniform vec2 uSpray;
      varying vec2 vQ; varying vec4 vCol; varying float vSeed; uniform vec3 uSmokeCol, uDustCol, uAmb, uSunCol;
      #include <fog_pars_vertex>
      void main() {
        vec3 c = aCenter; float size = aK.z, alpha = 0.; vec3 col = uSmokeCol;
        float ph = fract(uTime * (0.07 + 0.05 * aK.y) + aK.y * 7.31);
        if (aK.x < 0.5) {               // grease smoke: under the moving hull and lingering on the emptied ways
          float under = step(uLaunch.x, c.x) * step(c.x, uLaunch.y);
          float passed = clamp((c.x - uLaunch.y - 8.) / 22., 0., 1.) * (1. - smoothstep(120., 300., c.x - uLaunch.y)) * step(0.5, uLaunch.w);     // the ways smoke from just behind her forefoot
          alpha = (under * uLaunch.z * 0.09 + passed * (0.08 + 0.09 * uLaunch.z)) * sin(ph * 3.14159) * step(0., c.x);
          c.y += ph * (1.5 + 2.5 * passed); c.z += sign(c.z) * ph * 2.5 + sin(ph * 5. + aK.y * 20.) * 0.6; size *= 0.5 + ph * (0.6 + 0.5 * passed);
        } else if (aK.x < 1.5) {        // rust dust thrown up as the chain ploughs past, keyed to slide distance
          vec4 ch = uChain[int(aK.w + 0.5)]; float age = (c.x - ch.x) / 85.; float live = step(0., age) * step(age, 1.) * step(ch.x, ch.y - 0.5);
          float a = clamp(age, 0., 1.); alpha = live * smoothstep(0., 0.05, a) * (1. - a) * (1. - a) * 0.34 * (0.3 + 0.7 * uLaunch.z); col = uDustCol;
          c.y += a * 7. + sin(uTime * 0.7 + aK.y * 30.) * 0.4; c.z += sign(c.z) * a * 5.; size *= 0.4 + 0.9 * sqrt(a);
        } else {                         // white water thrown by the plunging stern (2) and the dropping bow (3), carried with the hull
          float I = aK.x < 2.5 ? uSpray.x : uSpray.y;
          vec3 h = vec3(c.x, 0., c.z * (0.7 + 0.6 * I));
          { vec3 o_ = vec3(h.x * uHullRot.x, h.x * uHullRot.y, h.z); c = uHullPos + vec3(o_.x * uHullYaw.x + o_.z * uHullYaw.y, o_.y, -o_.x * uHullYaw.y + o_.z * uHullYaw.x); } c.y = 0.6 + (aCenter.y + 9. * aK.y) * I * (0.6 + 0.4 * sin(ph * 6.283));
          alpha = I * (0.55 + 0.3 * sin(ph * 6.283 + 1.)); col = vec3(0.92, 0.95, 0.97); size *= 0.5 + 0.9 * I;
        }
        vCol = vec4(col * (uAmb * 0.62 + uSunCol * 0.42), alpha); vQ = position.xy; vSeed = aK.y;
        vec4 mvPosition = modelViewMatrix * vec4(c, 1.);
        if (aK.x < 0.5) alpha *= smoothstep(12., 42., -mvPosition.z); else if (aK.x < 1.5) alpha *= smoothstep(38., 90., -mvPosition.z);
        vCol.a = alpha; mvPosition.xy += position.xy * size * step(0.004, alpha);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec2 vQ; varying vec4 vCol; varying float vSeed; uniform float uTime;
      #include <common>
      #include <fog_pars_fragment>
      ${De}
      void main() {
        float d = dot(vQ, vQ); if (d > 1.) discard;
        float n = vn(vQ * 2.3 + vSeed * 31. + vec2(0., -uTime * 0.25)) * 0.6 + vn(vQ * 5.1 - vSeed * 17.) * 0.4;
        float a = vCol.a * (1. - d) * sqrt(1. - d) * (0.3 + 0.7 * smoothstep(0.2, 0.8, n + 0.3 * (1. - d)));
        gl_FragColor = vec4(vCol.rgb * (0.82 + 0.3 * n + 0.2 * vQ.y), a);
        #include <fog_fragment>
      }`});for(const d of["uTime","uLaunch","uHullPos","uHullRot","uHullYaw","uSpray","uAmb","uSunCol"])u.uniforms[d]=s[d];const v=new a.Mesh(i,u);return v.frustumCulled=!1,v.renderOrder=6,f.dispose(),v}function eo(e,s){const h=[],l=[],r=[],n=[],t=[],c=[],i=[];let f=0;for(const m of e){const x=(m.aHull?1:0)+(m.bHull?2:0)+(m.mode==="tape"?0:4);for(let y=0;y<=26;y++)for(const w of[-1,1])h.push(...m.a),l.push(...m.b),r.push(y/26,w,m.len,m.seed),n.push(m.color.r,m.color.g,m.color.b),t.push(m.rel,x,m.width,m.span||22),c.push(...m.fly);for(let y=0;y<26;y++){const w=f+y*2;i.push(w,w+1,w+2,w+2,w+1,w+3)}f+=54}const u=new a.BufferGeometry;u.setAttribute("position",new a.Float32BufferAttribute(h,3)),u.setAttribute("aB",new a.Float32BufferAttribute(l,3)),u.setAttribute("aP",new a.Float32BufferAttribute(r,4)),u.setAttribute("aC",new a.Float32BufferAttribute(n,3)),u.setAttribute("aR",new a.Float32BufferAttribute(t,4)),u.setAttribute("aFly",new a.Float32BufferAttribute(c,3)),u.setIndex(i);const v=new a.ShaderMaterial({side:a.DoubleSide,fog:!0,uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{}]),vertexShader:`
      attribute vec3 aB, aC, aFly; attribute vec4 aP, aR; uniform float uTime; uniform vec4 uLaunch; uniform vec3 uHullPos; uniform vec2 uHullRot, uHullYaw; uniform float uS;
      varying vec3 vC; varying vec3 vN; varying float vV;
      #include <fog_pars_vertex>
      vec3 hullX(vec3 p) { vec3 o_ = vec3(p.x * uHullRot.x - p.y * uHullRot.y, p.x * uHullRot.y + p.y * uHullRot.x, p.z); return uHullPos + vec3(o_.x * uHullYaw.x + o_.z * uHullYaw.y, o_.y, -o_.x * uHullYaw.y + o_.z * uHullYaw.x); }
      void main() {
        float q = aP.x, len = aP.z, sd = aP.w, flag = aR.y;
        float fa = mod(flag, 2.), fb = mod(floor(flag / 2.), 2.), ended = step(3.5, flag);
        vec3 a = mix(position, hullX(position), fa), b = mix(aB, hullX(aB), fb);
        vec3 tgt = mix((a + b) * 0.5, b, ended);
        float r = clamp((uS - aR.x) / aR.w, 0., 1.); r = r * r * (3. - 2. * r);
        vec3 d0 = tgt - a; float l0 = max(length(d0), 1e-3);
        vec3 dir = normalize(mix(d0 / l0, normalize(aFly + vec3(0., 0.25 * sin(uTime * 0.6 + sd * 20.), 0.2 * sin(uTime * 0.43 + sd * 9.))), r) + vec3(0., 1e-4, 0.));
        vec3 n1 = normalize(cross(dir, abs(dir.y) > 0.95 ? vec3(1., 0., 0.) : vec3(0., 1., 0.))), n2 = cross(dir, n1);
        float L = mix(l0, len, r), w = r * q * (0.5 + L * 0.035);
        float k1 = q * L * 0.42 - uTime * 4.2 + sd * 6.283, k2 = q * L * 0.27 - uTime * 3.1 + sd * 17.;
        float sagv = (1. - (1. - q) * (1. - q)) * l0 * 0.07 * (1. - ended);
        vec3 p = a + dir * (q * L) + n1 * (w * sin(k1)) + n2 * (w * 0.7 * sin(k2)); p.y -= r * q * q * L * 0.22 + sagv * (1. - r);
        float tw = q * L * 0.22 + sd * 6. + r * (uTime * 1.3 + 0.8 * sin(k1));
        vec3 wd = normalize(n1 * cos(tw) + n2 * sin(tw));
        vec4 mv0 = modelViewMatrix * vec4(p, 1.);
        float width = max(aR.z, -mv0.z * 0.0015) * mix(1., 0.45 + 0.55 * step(q, 0.999), step(aR.z, 0.3));
        p += wd * aP.y * width * 0.5;
        vC = aC; vN = normalize(normalMatrix * cross(dir, wd)); vV = q * L;
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec3 vC; varying vec3 vN; varying float vV; uniform vec3 uSunV, uSunCol, uAmb;
      #include <common>
      #include <fog_pars_fragment>
      void main() {
        float nl = abs(dot(normalize(vN + vec3(1e-5)), uSunV));
        vec3 col = vC * (uAmb * 0.75 + uSunCol * (0.22 + 0.5 * nl));
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`});for(const m of["uTime","uLaunch","uHullPos","uHullRot","uHullYaw","uS","uSunV","uSunCol","uAmb"])v.uniforms[m]=s[m];const d=new a.Mesh(u,v);return d.frustumCulled=!1,d}function to(e,s,o,h,l){const r=[],n=[],t=[];for(let v=0;v<h;v++){r.push(e.range(178,262),e.range(18,62),e.range(-30,34)),n.push(e(),e(),e.range(.8,1.5),e());const d=e.pick(o);t.push(d.r,d.g,d.b)}const c=new a.InstancedBufferGeometry,i=new a.PlaneGeometry(1,1);c.index=i.index,c.setAttribute("position",i.attributes.position),c.setAttribute("aBase",new a.InstancedBufferAttribute(new Float32Array(r),3)),c.setAttribute("aK",new a.InstancedBufferAttribute(new Float32Array(n),4)),c.setAttribute("aC",new a.InstancedBufferAttribute(new Float32Array(t),3)),c.instanceCount=h;const f=new a.ShaderMaterial({side:a.DoubleSide,fog:!0,uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{uOrigin:{value:new a.Vector3(...l)}}]),vertexShader:`
      attribute vec3 aBase, aC; attribute vec4 aK; uniform float uTime, uU; uniform vec3 uOrigin, uSunCol, uAmb; varying vec3 vC;
      #include <fog_pars_vertex>
      void main() {
        float e = clamp((uU - ${(.243*Pe).toFixed(4)} - aK.x * 0.02) / 0.05, 0., 1.), fall = clamp((uU - ${(.25*Pe).toFixed(4)}) / 0.5, 0., 1.);
        float burst = 1. - (1. - e) * (1. - e);
        vec3 c = mix(uOrigin, aBase, burst); c.y -= fall * (22. + 20. * aK.y) - 10. * burst * (1. - burst);
        c.z += fall * 26. + sin(uTime * 1.3 + aK.w * 40.) * 1.2; c.x += cos(uTime * 1.1 + aK.y * 50.) * 1.2;
        c.y = max(c.y, min(c.x, 270.) * ${O.toFixed(5)} + 0.1);
        float vis = step(0.001, e) * (1. - smoothstep(0.62, 0.8, uU));
        vec4 mv = modelViewMatrix * vec4(c, 1.);
        float size = max(0.3 * aK.z, -mv.z * 0.0022) * vis * smoothstep(2.5, 7., -mv.z);     // a flake against the lens is a flat square: gone inside 2.5 m
        float a1 = uTime * (3. + 5. * aK.w) + aK.x * 30., a2 = uTime * (2. + 4. * aK.y) + aK.w * 11.;
        vec2 ax1 = vec2(cos(a1), sin(a1)), ax2 = vec2(-sin(a1), cos(a1)) * (0.25 + 0.75 * abs(cos(a2)));
        mv.xy += (ax1 * position.x + ax2 * position.y) * size;
        vC = aC * (uAmb * 0.8 + uSunCol * (0.25 + 0.5 * abs(cos(a2))));
        vec4 mvPosition = mv; gl_Position = projectionMatrix * mv;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec3 vC;
      #include <common>
      #include <fog_pars_fragment>
      void main() { gl_FragColor = vec4(vC, 1.);
        #include <fog_fragment>
      }`});for(const v of["uTime","uU","uSunCol","uAmb"])f.uniforms[v]=s[v];const u=new a.Mesh(c,f);return u.frustumCulled=!1,i.dispose(),u}function oo(e){const s=new a.PlaneGeometry(520,420,1,1).rotateX(-W/2).translate(-240,.12,0),o=new a.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!0,uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{}]),vertexShader:`varying vec2 vP;
      #include <fog_pars_vertex>
      void main() { vP = position.xz; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec2 vP; uniform float uTime, uBow; uniform vec4 uWake, uRing; uniform vec3 uSunCol, uAmb, uHullPos; uniform vec2 uHullYaw;
      #include <common>
      #include <fog_pars_fragment>
      ${De}
      void main() {
        float n = vn(vP * 0.35 + vec2(uTime * 0.2, 0.)) * 0.55 + vn(vP * 1.3 - vec2(0., uTime * 0.3)) * 0.45, n2 = vn(vP * 0.08 + 3.);
        // collar along the waterline of the immersed part of the hull, in her own frame (x from the counter to the stem, y to starboard),
        // so that it follows her when she swings on her chains
        vec2 dh = vP - uHullPos.xz, hl = vec2(dh.x * uHullYaw.x - dh.y * uHullYaw.y, dh.x * uHullYaw.y + dh.y * uHullYaw.x);
        float lx = clamp(hl.x, uWake.x, max(uWake.x, uWake.y)), tL = clamp(lx / 240., 0., 1.), ff = clamp((tL - 0.5) / 0.48, 0., 1.);
        float hbw = 14. * min(pow(max(smoothstep(0.035, 0.335, tL), 1e-4), 1.1), 1. - ff * ff);
        float ex = abs(hl.x - lx), dIn = abs(hl.y) - hbw, d = ex > 0.001 ? length(vec2(ex, max(dIn, 0.))) : dIn;
        float I = uWake.w;
        float collar = (1. - smoothstep(1.2, 6. + 32. * I, d)) * smoothstep(-3.5, -0.4, d) * step(1., uWake.y - uWake.x);
        // churned track from the slip foot out to the stern end
        float track = (1. - smoothstep(9., 26., abs(vP.y))) * smoothstep(uHullPos.x - 4., uHullPos.x + 30., vP.x) * (1. - smoothstep(-12., 4., vP.x)) * uWake.z * 0.6;
        // while she still has way on (she goes astern), the water closes behind her stem in a spreading V and a ragged core
        float bw = hl.x - 240., bq = max(bw, 0.), arm = 1. - smoothstep(0., 2.2 + bq * 0.13, abs(abs(hl.y) - (0.9 + bq * 0.3))), core = (1. - smoothstep(0., 2. + bq * 0.1, abs(hl.y))) * 0.8;
        float bowWake = max(arm, core) * smoothstep(-3., 2., bw) * (1. - smoothstep(10., 72., bw)) * uBow * 0.66 * (1. - smoothstep(-14., 2., vP.x));
        // the launch wave: an expanding crest
        vec2 rc = vP - uRing.xy; float rd = length(rc * vec2(1., 0.8));
        float rw = 9. + uRing.z * 0.035; float ring = (1. - smoothstep(0., rw, abs(rd - uRing.z + 6. * n2))) * uRing.w * (0.55 + 0.6 * n2) + (1. - smoothstep(0., rw * 0.6, abs(rd - uRing.z * 0.74 + 8. * n2))) * uRing.w * 0.4;
        ring *= 1. - smoothstep(-30., -2., vP.x);
        float wl_ = vP.x + 1.2 - 1.5 * sin(uTime * 0.7 + vP.y * 0.21) - 0.9 * sin(uTime * 1.13 - vP.y * 0.47);
        float wash = (1. - smoothstep(0.1, 2.3, abs(wl_))) * (1. - smoothstep(29., 31., abs(vP.y))) * (0.5 + 0.3 * sin(uTime * 0.7 + vP.y * 0.21 + 1.2));
        float we_ = length(vec2((vP.x + 12.) * 0.4, abs(abs(vP.y) - 7.) - 1.1)); wash = max(wash, (1. - smoothstep(0.25, 1.1 + 0.35 * sin(uTime * 1.4 + vP.x), we_)) * 0.42);
        float foam = max(max(max(collar * (0.9 + 0.6 * I), track), ring * 1.25), bowWake);
        float a = smoothstep(0.32, 0.7, foam * (0.6 + 0.9 * n) + (n2 - 0.5) * 0.2) * smoothstep(0., 0.2, foam);
        // the wash on the slip foot and round the way ends is a thin, broken lace of foam that the timber shows through
        float lace = vn(vP * 1.7 + vec2(uTime * 0.22, 0.3)) * 0.6 + vn(vP * 4.3 - vec2(0.2, uTime * 0.35)) * 0.4;
        a = max(a, wash * smoothstep(0.4, 0.62, lace + 0.12 * wash) * 0.6);
        a *= (1. - smoothstep(190., 208., abs(vP.y))) * smoothstep(-498., -470., vP.x);
        if (a < 0.004) discard;
        gl_FragColor = vec4((uAmb * 0.85 + uSunCol * 0.42) * (0.78 + 0.22 * n), a * 0.95);
        #include <fog_fragment>
      }`});for(const l of["uTime","uWake","uRing","uSunCol","uAmb","uHullPos","uHullYaw","uBow"])o.uniforms[l]=e[l];const h=new a.Mesh(s,o);return h.frustumCulled=!1,h.renderOrder=3,h}function ao(e,s,o){const h=new a.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!0,side:a.BackSide,uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{uBot:{value:o.bot},uTop:{value:o.top},uSheer:{value:o.sheer},uLine:{value:new a.Vector2(o.paintY,o.sheerW)}}]),vertexShader:`
      uniform mat4 uInner, uInnerInv; uniform float uTime; uniform vec3 uSunV, uSunCol, uAmb, uBot, uTop, uSheer; uniform vec2 uLine;
      varying vec3 vCol; varying vec3 vK; varying vec2 vW;
      #include <fog_pars_vertex>
      void main() {
        vec3 sp = (uInnerInv * modelMatrix * vec4(position, 1.)).xyz, cam = (uInnerInv * vec4(cameraPosition, 1.)).xyz;
        vec3 m = vec3(sp.x, -sp.y, sp.z), to = m - cam;
        vec3 side = normalize(vec3(-to.z, 0., to.x) + vec3(1e-4, 0., 0.));
        float rip = (sin(sp.y * 1.7 + uTime * 1.9 + sp.x * 0.11) + 0.6 * sin(sp.y * 4.1 - uTime * 2.6 + sp.z * 0.23)) * (0.12 + 0.06 * max(sp.y, 0.));
        m += side * rip;
        float t = (cam.y - 0.16) / max(cam.y - m.y, 0.5);
        vec3 w = cam + (m - cam) * t;
        vec3 nv = normalize(mat3(viewMatrix) * mat3(modelMatrix) * normal + vec3(0., 1e-5, 0.));
        float sheerY = 30. + 3.5 * pow(max(0., (position.x / 240. - 0.6) / 0.4), 2.) + 1.5 * pow(max(0., (0.3 - position.x / 240.) / 0.3), 2.);
        vec3 base = mix(uBot, uTop, smoothstep(-0.4, 0.4, position.y - uLine.x));
        base = mix(base, uSheer, (1. - smoothstep(0.3, 0.7, abs(sheerY - 2.6 - uLine.y * 0.5 - position.y) / max(uLine.y, 0.05))) * step(0.01, uLine.y));
        vCol = base * (uAmb * 0.55 + uSunCol * (0.12 + 0.62 * max(dot(nv, uSunV), 0.)));
        vK = vec3(sp.y, w.x, length(w.xz - cam.xz)); vW = w.xz;
        vec4 mvPosition = viewMatrix * uInner * vec4(w, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec3 vCol; varying vec3 vK; varying vec2 vW; uniform float uTime;
      #include <common>
      #include <fog_pars_fragment>
      void main() {
        if (vK.x < 0. || vK.y > -1.) discard;                    // nothing of her under the water, nothing on the land
        // the image is cut into bright bands by the ripples (bands across the line of sight, wandering), and thins toward her rail
        float wob = sin(vW.x * 0.19 + uTime * 0.7) + sin(vW.y * 0.23 - uTime * 0.5);
        float band = 0.5 + 0.5 * sin(vK.z * 1.35 + wob * 1.6 - uTime * 1.9), band2 = 0.5 + 0.5 * sin(vK.z * 3.1 - wob * 2.3 + uTime * 2.7);
        float cut = mix(1., smoothstep(0.25, 0.7, band) * (0.6 + 0.4 * band2), smoothstep(1., 9., vK.x));
        float fall = 1. - smoothstep(2., 31., vK.x);
        float a = 0.82 * fall * sqrt(fall) * smoothstep(0., 0.8, vK.x) * (0.22 + 0.78 * cut);
        gl_FragColor = vec4(vCol * vec3(0.5, 0.6, 0.66), a);
        #include <fog_fragment>
      }`});for(const r of["uTime","uSunV","uSunCol","uAmb","uInner","uInnerInv"])h.uniforms[r]=s[r];const l=new a.Mesh(e,h);return l.frustumCulled=!1,l.renderOrder=2,l.visible=!1,l}function no(e,s,o,h){const l=new a.SphereGeometry(1.5,12,8,0,W).toNonIndexed(),r=l.attributes.position,n=new Float32Array(r.count*3);for(let f=0;f<r.count;f+=3){const u=(r.getX(f)+r.getX(f+1)+r.getX(f+2))/3,v=(r.getZ(f)+r.getZ(f+1)+r.getZ(f+2))/3,d=(r.getY(f)+r.getY(f+1)+r.getY(f+2))/3,m=Math.floor(Math.atan2(v,u)/W*6+100),y=Math.abs(d)>1.32?h:m%2?s:o;for(let w=0;w<3;w++)n[(f+w)*3]=y.r,n[(f+w)*3+1]=y.g,n[(f+w)*3+2]=y.b}l.setAttribute("color",new a.BufferAttribute(n,3));const t=ee({vertexColors:!0,roughness:.8,metalness:0,side:a.DoubleSide},e),c=new a.Group,i=[];for(const f of[0,1]){const u=new a.Group,v=new a.Mesh(l,t);v.position.y=-1.5,v.rotation.y=f*W,v.castShadow=!0,u.position.y=1.5,u.add(v),c.add(u),i.push(u)}return{group:c,pivots:i}}function so(e){const o=new Float32Array(2448),h=[];for(let i=0;i<12;i++)for(let f=0;f<33;f++){const u=(i*34+f)*2;h.push(u,u+1,u+2,u+2,u+1,u+3)}const l=new a.BufferGeometry;l.setAttribute("position",new a.BufferAttribute(o,3).setUsage(a.DynamicDrawUsage)),l.setIndex(h);const r=new a.Mesh(l,new a.MeshBasicMaterial({color:e.wire,side:a.DoubleSide,fog:!0}));r.frustumCulled=!1;const n=[0,0,0],t=[0,0,0];function c(i,f,u,v){for(let d=0;d<6;d++){const m=D[d][1],x=Math.sign(m),y=i[d],w=f[d][0],S=w<D[d][0]-.01;S?(t[0]=w,t[1]=P(w)+.5,t[2]=x*15.6):(t[0]=D[d][0]-1,t[1]=P(D[d][0])+4.6,t[2]=m-x*1.2);const C=Math.hypot(y[0]-t[0],y[1]-t[1],y[2]-t[2]),M=S?0:Math.max(0,u[d]-C),z=Math.min(1,M/8),k=Math.min(2.4,M*.045);for(let K=0;K<34;K++){const _=K/33,B=I(0,.14,_)*(1-I(.8,1,_))*z;n[0]=R(t[0],y[0],_)+Math.cos(_*31+d)*k*.5*B;const V=Math.max(n[0]*O,-.4)+.14,L=R(t[1],y[1],_);n[1]=R(L,Math.min(L,V),B)-(1-z)*Math.sin(_*W)*C*.012,n[2]=R(t[2],y[2],_)+Math.sin(_*we*3.5+d*1.7)*k*B+x*2.2*B;const U=Math.hypot(n[0]-v.x,n[1]-v.y,n[2]-v.z),Q=Math.max(.16,U*.0013)*.5;for(let G=0;G<2;G++){const Y=((d*2+G)*34+K)*2*3;o[Y]=n[0],o[Y+1]=n[1]-(G?Q:0),o[Y+2]=n[2]-(G?0:Q),o[Y+3]=n[0],o[Y+4]=n[1]+(G?Q:0),o[Y+5]=n[2]+(G?0:Q)}}}l.attributes.position.needsUpdate=!0}return{mesh:r,update:c}}async function io(e,s={}){const o=e.rng,h=e.quality?.detail??1,l=s.frame==="brief",r=(s.palette&&s.palette.length>=7?s.palette:Pt).map(p=>new a.Color(p)),n=(p,g,b)=>new a.Color(p,g,b),t=(p,g)=>p.clone().multiplyScalar(g),c=t(r[4],.62).lerp(n(.2,.11,.05),.35).lerp(n(.2,.18,.15),.42),i={oxide:t(r[0],.92),oxideDark:t(r[0],.55),dove:t(r[1],.82),pink:t(r[2],.85),steel:t(r[3],.9),steelDark:t(r[3],.45),bronze:t(r[4],1.1),timber:c,timberPale:t(r[4],.8).lerp(r[6],.2).lerp(n(.42,.4,.36),.4),timberDark:t(c,.68),grease:n(.17,.14,.1),deck:t(r[4],.5).lerp(r[3],.3),stone:t(r[3],.85).lerp(n(.36,.32,.27),.45),dark:n(.03,.03,.035),black:n(.004,.004,.005),iron:n(.105,.085,.072),rust:n(.34,.15,.065),rope:n(.42,.35,.22),wire:n(.05,.045,.04),smoke:n(.8,.8,.8),rustDust:n(.62,.31,.16)},f=o.fork("slipway-livery")(),u=s.livery||(f<.72?"dove":f<.82?"black":"mail"),v={bot:new a.Color("#8a3828").lerp(n(.17,.115,.1),.3),top:new a.Color("#767d86"),boot:new a.Color("#b8321f"),sheer:n(.84,.84,.8),paintY:10.2+o.range(-.6,.8),bootW:1.3,sheerW:.9,rust:o.range(.4,.75),deck:t(r[0],.6).lerp(i.steel,.35)};u==="black"&&(v.top=new a.Color("#2a3038"),v.sheer=n(.86,.86,.82),v.sheerW=.9,v.bootW=1.1),u==="mail"&&(v.top=new a.Color("#cdb588"),v.boot=t(r[5],.5),v.bootW=1.5,v.sheer=n(.84,.83,.79),v.sheerW=2.3,v.rust*=.9);const d=s.fill??.6,m={uTime:{value:0},uFill:{value:new a.Color("#7C97B0").multiplyScalar(.9*d)},uKick:{value:new a.Color("#B88A6A").multiplyScalar(.8*d)},uBounceV:{value:new a.Vector3(0,-1,0)},uFront:{value:new a.Vector2(-1e4,-1e4)},uHullPos:{value:new a.Vector3},uHullRot:{value:new a.Vector2(1,0)},uHullYaw:{value:new a.Vector2(1,0)},uS:{value:0},uU:{value:0},uLaunch:{value:new a.Vector4},uSpray:{value:new a.Vector2},uWake:{value:new a.Vector4},uRing:{value:new a.Vector4(-165,0,0,0)},uBow:{value:0},uInner:{value:new a.Matrix4},uInnerInv:{value:new a.Matrix4},uSunV:{value:new a.Vector3(0,1,0)},uSunCol:{value:new a.Color("#FFF1D6").multiplyScalar(.95)},uAmb:{value:new a.Color("#9DB6CE").multiplyScalar(.9)}},x=(p,g,b)=>l?[p,g,b]:[b,g,115-p],y=(p,g,b)=>l?[p,g,b]:[b,g,-p],w=new a.Vector3(-.2364,.4067,.8824),S=(p,g)=>{p&&(l?w.set(p[0],p[1],p[2]):w.set(-p[2],p[1],p[0]),w.normalize()),g&&m.uSunCol.value.set(g).multiplyScalar(.95)};S(s.sun);const C=new a.Group,M=new a.Group;C.add(M),l||(M.rotation.y=W/2,M.position.set(0,0,115));const z=(p,g={})=>{const b=ye(p),A=Lt(b),j=Rt(b),H=Math.asin(Math.max(-1,Math.min(1,(j-A)/F))),T=10-b*Math.cos(Math.atan(O)),N=(ye(p+.004)-ye(p-.004))/.008/80;return g.s=b,g.sternX=T,g.sternY=A,g.bowX=T+F*Math.cos(H),g.bowY=j,g.pitch=H,g.speed=N,g.c=Math.cos(H),g.sn=Math.sin(H),g},k={},K={},_={},B=(p,g,b,A=V)=>[A.sternX+p*A.c-g*A.sn,A.sternY+p*A.sn+g*A.c,b],V=z(0),L=new a.Group;L.rotation.order="YZX",M.add(L);const U=s.swing===-1?-1:1,Q=.12,G=Nt(m,v,s.caustics??1);G.side=a.DoubleSide,await e.yield();const Y=new a.Mesh(await Tt(e.yield),G);Y.castShadow=!0,Y.receiveShadow=!0,L.add(Y),await e.yield();const Ie=ee({vertexColors:!0,roughness:.72,metalness:.2,side:a.DoubleSide},m),ie=new a.Mesh(await Qt(o,i,v,e.yield),Ie);ie.castShadow=!0,ie.receiveShadow=!0,L.add(ie),await e.yield();const ge=$t(i),_e=ee({vertexColors:!0,roughness:.3,metalness:.55,side:a.DoubleSide},m),Te=[];for(const p of[1,-1]){const g=new a.Mesh(ge,_e);g.position.set(14.2,4.8,p*5.6),g.scale.z=p,g.castShadow=!0,L.add(g),Te.push(g)}await e.yield(),M.add(qt(m,i)),await e.yield();const Ge=[],he=Gt(o,m,i,Ge),Ne=new Re,Oe=new a.BoxGeometry(1,1,1),Xe=Wt(m);await e.yield(),Xt(o,i,Ne),Ut(o,i,Ne,he.S,B),await e.yield();const Ve=Yt(),Ue=Et(m),je=he.S2.build(Ve,Ue);await e.yield();const Qe=Ne.build(Oe,Xe);je.castShadow=!1,Qe.castShadow=!1,M.add(he.S.build(Ve,Ue),je,Qe),Ve.dispose(),await e.yield();const $e=new Re;jt(o,i,$e);const Ze=$e.build(Oe,Xe);L.add(Ze),Oe.dispose(),await e.yield();const Je=Dt(o,m,i,B);M.add(Je),await e.yield();const Me=Zt(o,m,i);M.add(Me.mound,Me.links),await e.yield();const et=so(i);M.add(et.mesh),await e.yield();const tt=Jt(o,m,i,h);tt.material.uniforms.uChain=Me.uChain,M.add(tt);const ot=It,gt=ot.map(p=>Math.hypot(p-10,6,6)+1.5),_t=D.map(p=>[p[0],3,Math.sign(p[1])*(J(p[0]/F,3)+.1)]);await e.yield();const $=["#D8262C","#F1EEE4","#6B3FA0","#F2C230","#2E9E5B"].map(p=>new a.Color(p)),Se=(s.tapes||(o.chance(.75)?"five":"redwhite"))==="five"?$:[$[0],$[1]],me=[],at=[239.5,X(.998).yR-.1,0],ze=p=>X(p/F).yR-.2;for(const p of[1,-1]){const g=he.tops.filter(H=>Math.sign(H[2])===p),b=Ge.filter(H=>Math.sign(H[2])===p),A=(H,T)=>[(H[0]+T[0])/2,(H[1]+T[1])/2-1.2,H[2]];[g[6],g[5],g[4],A(g[5],g[6]),A(g[4],g[5]),b[6],b[5],g[3],A(g[3],g[4]),b[4]].forEach((H,T)=>{const N=H[0]>=250?239.5:Math.max(196,238-(250-H[0])*.55-o.range(0,4)),te=N>239?[at[0],at[1],p*.3]:[N,ze(N),p*J(N/F,ze(N))],ue=B(te[0],te[1],te[2]),ae=Math.hypot(H[0]-ue[0],H[1]-ue[1],H[2]-ue[2])/2,Z=Se[(T+(p>0?0:2))%Se.length],xe=o.range(2,30),ve=o(),Be=p>0?H[0]>=228?16:30:(Math.abs(H[2])-9)/.78;me.push({a:H,aHull:!1,b:te,bHull:!0,mode:"tape",len:Math.min(ae,Be),rel:xe,fly:[o.range(-.2,.2),-.62,.75],width:.55,color:Z,seed:ve}),me.push({a:te,aHull:!0,b:H,bHull:!1,mode:"tape",len:Math.min(ae,42),rel:xe,fly:[.8,-.38,.3+p*.25],width:.55,color:Z,seed:ve+.37})});for(let H=0;H<8;H++){const T=o.range(204,238),N=[T,ze(T),p*J(T/F,ze(T))];me.push({a:N,aHull:!0,b:[N[0],N[1]-.2,N[2]],bHull:!0,mode:"end",len:o.range(12,28),rel:o.range(1,46),span:14,fly:[o.range(.4,.8),-.55,p*o.range(.1,.5)+.25],width:.24,color:o.pick($),seed:o()})}}const le=[242.2,28.5,0];for(let p=0;p<10;p++)me.push({a:le,aHull:!0,b:[le[0],le[1]-.1,0],bHull:!0,mode:"end",len:o.range(8,18),rel:47+o.range(0,9),span:9,fly:[o.range(.1,.7),-.85,o.range(-.5,.6)],width:.24,color:o.pick($),seed:o()});const Mt=o.shuffle([$[0],$[1],i.pink.clone(),$[3]]);[[230.5,11],[6,11],[120,14]].forEach(([p,g],b)=>{const A=[p,X(p/F).yR-1.1+g-1.5,0];me.push({a:A,aHull:!0,b:[A[0],A[1],.2],bHull:!0,mode:"end",len:6,rel:-1e4,fly:[-.15,-.14,1],width:2.8,color:Mt[b],seed:o()})}),await e.yield(),M.add(eo(me,m)),await e.yield();const pe=no(m,Se[0],Se[1],n(.75,.55,.15));pe.group.position.set(le[0],le[1],0),L.add(pe.group),M.add(to(o,m,[...$,i.pink,$[1]],Math.round(520*h),B(le[0],le[1],0,z(.255*Pe)))),await e.yield(),s.wake!==!1&&M.add(oo(m)),await e.yield();const Ae=s.reflection===!1?null:ao(Y.geometry,m,v);Ae&&L.add(Ae),await e.yield();let nt=0;const ke=D.map(p=>[p[0],0]),Ce=D.map(()=>[0,0,0]),Ye=new a.Vector3(0,40,300),He=new a.Vector3;function st(p,g){const b=z(p,k),A=b.s,j=I(282,318,A);b.sternY+=.25*Math.sin(g*.45)*j,b.bowY+=.3*Math.sin(g*.37+1)*j,b.pitch=Math.asin((b.bowY-b.sternY)/F),b.c=Math.cos(b.pitch),b.sn=Math.sin(b.pitch);const H=U*(.14*I(292,334,A)+.012*Math.sin(g*.21)*j),T=Math.cos(H),N=Math.sin(H),te=b.sternX+F*Q*(1-T)*b.c,ue=F*Q*N*b.c;L.position.set(te,b.sternY,ue),L.rotation.set(.012*Math.sin(g*.31)*j,H,b.pitch);const ae=E(b.speed/14);Ze.position.y=-17*I(284,312,A),m.uHullPos.value.set(te,b.sternY,ue),m.uHullRot.value.set(b.c,b.sn),m.uHullYaw.value.set(T,N),m.uS.value=A,m.uU.value=p,m.uLaunch.value.set(b.sternX,b.bowX,ae,A>.05?1:0);const Z=p/Pe;m.uFront.value.set(Z<.068?-1e4:R(0,300,(Z-.068)/.03),Z<.088?-1e4:Z<.103?R(-10,100,(Z-.088)/.015):100+(Z-.103)*1150);for(let q=0;q<6;q++){const ft=Math.max(0,A-ot[q]),mt=D[q][0]-ft;ke[q][0]=mt,ke[q][1]=E(ft/yt*1.5),Me.uChain.value[q].set(mt,D[q][0],Math.sign(D[q][1]),ke[q][1]);const be=_t[q],vt=be[0]*b.c-be[1]*b.sn,dt=be[2];Ce[q][0]=te+vt*T+dt*N,Ce[q][1]=b.sternY+be[0]*b.sn+be[1]*b.c,Ce[q][2]=ue-vt*N+dt*T}et.update(Ce,ke,gt,Ye);const xe=Math.max(0,A-150)*.2;Te[0].rotation.x=xe,Te[1].rotation.x=-xe+.6;const ve=I(.243,.272,Z),Be=.07*Math.sin(g*2.3)*ve;pe.pivots[0].rotation.x=-(ve*1.2+Be),pe.pivots[1].rotation.x=ve*1.2-Be,pe.group.rotation.z=.05*Math.sin(g*1.1)-ae*.22;const it=Math.max(I(104,182,A)*(1-I(215,290,A)),.42*I(24,64,A)*(1-I(150,200,A))*(.45+.55*ae)),lt=I(262,282,A)*(1-I(296,319,A));m.uSpray.value.set(it,lt);let ut=b.sternX,Fe=b.sternX;b.sternY<0&&b.bowY<0?Fe=b.bowX:b.sternY<0?Fe=b.sternX+F*-b.sternY/(b.bowY-b.sternY):b.bowY<0&&(ut=b.bowX-F*-b.bowY/(b.sternY-b.bowY),Fe=b.bowX),m.uWake.value.set(ut-b.sternX,Math.min(Fe,0)-b.sternX,(.35+.65*ae)*I(30,110,A),Math.max(it,lt*.8)+.12*ae),m.uBow.value=I(272,292,A)*E(.3+b.speed/6),Ae&&(Ae.visible=A>250);const ct=rt(p,_);return m.uRing.value.set(-165,0,ct.radius,ct.strength),b}function rt(p,g={}){const b=ye(p),A=I(172,192,b)*(1-I(296,320,b)*.7);return g.x=-165,g.z=0,g.radius=Math.max(0,b-172)*2.1,g.strength=A,g.height=1.6*A,g}const St=100,zt=70,At=new a.Vector3(...x(115,24,0)),kt=p=>{He.set(w.x*.7,-.8,w.z*.7).normalize().transformDirection(M.matrixWorld).transformDirection(p.matrixWorldInverse),m.uBounceV.value.copy(He)};st(0,0);const Ct=[[218.5,18.1,.6],[236,21.2,6.4],[250.4,24.2,18.1],[259.8,27.4,34],[263,30.8,52.1],[259.7,34.2,70.3],[250.2,37.6,86.2],[235.8,40.9,97.7],[218.3,42,103.5],[199.8,42,102.8],[182.8,42,95.7],[169.3,39.9,83],[159.1,37.4,67.5],[149,34.8,52],[138.9,32.1,36.4],[127.6,29.8,21.7],[113,27.5,10.3],[96,25.3,3.1]],Ht={portalSeat:{position:x(-58,13,0),normal:y(1,0,0)},flyThrough:[x(-40,8,0),x(10,5,0),x(200,15,0),...Ct.map(p=>x(p[0],p[1],p[2])),x(77.6,23,0),x(30,13,0),x(-58,13,0)],entry:x(-40,8,0),naveStart:x(10,5,0),naveEnd:x(200,15,0),turnCentre:x(211,42,52),straightStart:x(77.6,23,0),hullPoi:p=>x(...B(120,15,0,z(p))),bowTip:p=>x(...B(240,33.5,0,z(p))),sternTip:p=>x(...B(0,30,0,z(p))),doveBaskets:[x(246,P(246)+1.2,12),x(246,P(246)+1.2,-12)],launchStand:x(282,P(282),0),gantryTops:he.tops.map(p=>x(p[0],p[1],p[2])),chainPiles:D.map(p=>x(p[0],P(p[0])+2.5,p[1])),viewpoints:{entry:{position:x(-40,8,0),target:x(10,14,0)},quarter:{position:x(177,41.5,91),target:x(...B(150,20,0,z(.62)))},cradle:{position:x(96,25.3,3.1),target:x(20,8,0)}}},Bt=p=>({s:p.s,sternX:p.sternX,sternY:p.sternY,bowX:p.bowX,bowY:p.bowY,pitch:p.pitch,speed:p.speed});return{object:C,radius:St,height:zt,center:At,extent:165,anchors:Ht,ground:!0,groundY:-.05,livery:u,setProgress(p){nt=E(p)},setSun:S,slideAt:p=>ye(E(p)),hullState:p=>Bt(z(E(p))),waveAt:(p,g)=>rt(E(p),g),pointOnHull(p,g,b,A,j){const H=z(E(p),K),T=H.sternX+g*H.c-b*H.sn,N=H.sternY+g*H.sn+b*H.c;return l?j.set(T,N,A):j.set(A,N,115-T)},setTone(p={}){p.amb&&m.uAmb.value.set(p.amb).multiplyScalar(.9),p.fill&&m.uFill.value.set(p.fill).multiplyScalar(.9*d),p.kick&&m.uKick.value.set(p.kick).multiplyScalar(.8*d)},update(p,g,b){m.uTime.value=g,b&&(M.updateWorldMatrix(!0,!1),m.uInner.value.copy(M.matrixWorld),m.uInnerInv.value.copy(M.matrixWorld).invert(),Ye.setFromMatrixPosition(b.matrixWorld),M.worldToLocal(Ye),He.copy(w).transformDirection(M.matrixWorld).transformDirection(b.matrixWorldInverse),m.uSunV.value.copy(He),kt(b)),st(nt,g)},dispose(){Je.customDepthMaterial?.dispose()}}}export{io as buildHero};
