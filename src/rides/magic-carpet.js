import*as o from"three";import{mergeGeometries as Y}from"three/addons/utils/BufferGeometryUtils.js";const B=1.1,I=-2.6,V=.4,$=-1,ge=(I+V)/2,be=(V-I)/2,Me=[-.78,-1.9],Ae=[.8,-1.95],Se=`
uniform vec2 uPh; uniform vec3 uMv;
float carpetH(vec2 p) {
  float fx = p.x / ${B.toFixed(2)};
  float front = smoothstep(-0.9, ${I.toFixed(2)}, p.y);
  float back = smoothstep(0.1, ${V.toFixed(2)}, p.y);
  float seat = 1.0 - smoothstep(0.25, 1.1, length(p * vec2(1.0, 0.9)));
  float amp = (0.010 + 0.035 * front + 0.05 * back) * (1.0 - 0.8 * seat) * (0.8 + 0.5 * uMv.y);
  float h = amp * sin(p.y * 4.2 - uPh.x + 0.6 * fx * fx);
  float edge = smoothstep(0.5, 1.0, abs(fx));
  h += edge * (0.008 + 0.018 * uMv.y) * sin(p.y * 9.0 - uPh.y + sign(p.x) * 1.7);
  h += 0.035 * fx * fx * fx * fx;
  h += uMv.x * fx * abs(fx) * 0.16;
  float cr = front * front * smoothstep(0.35, 1.0, abs(fx));
  h += cr * (0.022 + 0.16 * max(0.0, uMv.x * sign(p.x)) + 0.012 * sin(uPh.y * 0.7 + p.x * 3.0));
  h -= front * front * 0.02 * uMv.z;
  return h;
}`,Z=(l,r,c)=>{const h=Math.min(1,Math.max(0,(c-l)/(r-l)));return h*h*(3-2*h)};function C0(l,r,c,h){const d=l/B,i=Z(-.9,I,r),f=Z(.1,V,r),S=1-Z(.25,1.1,Math.hypot(l,r*.9));let w=(.01+.035*i+.05*f)*(1-.8*S)*(.8+.5*h.y)*Math.sin(r*4.2-c.x+.6*d*d);const z=Z(.5,1,Math.abs(d)),v=Math.sign(l);w+=z*(.008+.018*h.y)*Math.sin(r*9-c.y+v*1.7),w+=.035*d*d*d*d,w+=h.x*d*Math.abs(d)*.16;const p=i*i*Z(.35,1,Math.abs(d));return w+=p*(.022+.16*Math.max(0,h.x*v)+.012*Math.sin(c.y*.7+l*3)),w-=i*i*.02*h.z,w}const Oe=`
uniform vec3 uField, uBorder, uAccent, uIvory, uGold, uLampCol, uEnv;
uniform vec4 uLampAt;      // xyz = flame position (ride space), w = strength of its pool of light
uniform vec3 uStyle;       // medallion lobes, border motif (0 rosette, 1 lozenge), abrash offset
uniform float uTime;
varying vec2 vCp; varying vec3 vRp;
float cHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float cNoise(float x) { float i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(cHash(vec2(i, 3.0)), cHash(vec2(i + 1.0, 3.0)), f); }
vec4 carpetCol(vec2 p, float w) {           // rgb = dye colour, a = how much gold thread
  vec2 q = p - vec2(0.0, ${ge.toFixed(3)});
  vec2 aq = abs(q), hs = vec2(${B.toFixed(2)}, ${be.toFixed(2)});
  vec2 de = hs - aq; float d = min(de.x, de.y);
  float s = de.x < de.y ? q.y : q.x;       // coordinate running along the nearest edge
  float gold = 0.0; vec3 c;
  // ---- field ----
  vec3 fieldC = uField * (0.86 + 0.24 * cNoise(q.y * 7.0 + uStyle.z) );   // abrash: dye lots change row by row
  c = fieldC;
  vec2 g = vec2(q.x + q.y, q.x - q.y) / 0.16; vec2 gi = floor(g), gf = fract(g) - 0.5;
  float fl = length(gf) * 0.16; float fa = atan(gf.y, gf.x);
  float petal = 1.0 - smoothstep(-w, w, fl - 0.021 * (0.55 + 0.45 * abs(cos(fa * 2.0))));
  c = mix(c, mix(uIvory, uAccent, step(0.5, cHash(gi))) * 0.9, petal * 0.8);
  c = mix(c, uGold, (1.0 - smoothstep(-w, w, fl - 0.006)) );
  // trellis joining the flowers
  c = mix(c, uBorder, (1.0 - smoothstep(0.002, 0.004 + w, 0.08 - max(abs(gf.x), abs(gf.y)) * 0.16)) * 0.55);
  // ---- centre medallion with pendants ----
  vec2 m = q * vec2(1.0, 0.86) / 1.24; float mr = length(m), ma = atan(m.y, m.x);
  float lobes = 0.5 + 0.5 * cos(ma * uStyle.x);
  float R = 0.50 * (0.82 + 0.18 * pow(lobes, 0.6));
  vec2 pq = vec2(aq.x, aq.y - 0.95); float pend = pq.x / 0.085 + abs(pq.y) / 0.17;   // pendant lozenges fore and aft
  float md = min((mr - R) * 1.24, (pend - 1.0) * 0.07);
  if (md < 0.03) {
    vec3 mc = uBorder;
    mc = mix(mc, uAccent, 1.0 - smoothstep(-w, w, mr - R * 0.74));
    mc = mix(mc, uIvory, 1.0 - smoothstep(-w, w, abs(mr - R * 0.74) - 0.006));
    float star = mr - 0.21 * (0.62 + 0.38 * abs(cos(ma * uStyle.x * 0.5)));
    mc = mix(mc, uField * 1.1, 1.0 - smoothstep(-w, w, star));
    float gl = 1.0 - smoothstep(-w, w, abs(star) - 0.005); mc = mix(mc, uGold, gl); gold = max(gold, gl);
    float eye = 1.0 - smoothstep(-w, w, mr - 0.05 * (0.7 + 0.3 * cos(ma * 8.0))); mc = mix(mc, uGold, eye); gold = max(gold, eye);
    mc = mix(mc, uIvory, (1.0 - smoothstep(-w, w, abs(pend - 0.55) * 0.07 - 0.004)) * step(mr, 10.0) * step(R, mr));
    c = mix(c, mc, 1.0 - smoothstep(-w, w, md));
    float ol = 1.0 - smoothstep(-w, w, abs(md) - 0.007); c = mix(c, uIvory, ol);
    float ol2 = 1.0 - smoothstep(-w, w, abs(md - 0.02) - 0.003); c = mix(c, uGold, ol2); gold = max(gold, ol2);
  }
  // ---- corner spandrels: quarter medallions with scalloped edges ----
  vec2 sc = aq - (hs - 0.30); float sr = length(sc), sa = atan(sc.y, sc.x);
  float SR = 0.40 + 0.028 * cos(sa * 14.0);
  float sd = sr - SR;
  if (sd < 0.03) {
    vec3 scol = mix(uBorder, uAccent * 0.9, 1.0 - smoothstep(-w, w, sr - 0.25 - 0.02 * cos(sa * 14.0)));
    scol = mix(scol, uIvory, 1.0 - smoothstep(-w, w, abs(sr - 0.25 - 0.02 * cos(sa * 14.0)) - 0.005));
    float sp = 1.0 - smoothstep(-w, w, sr - 0.13 * (0.6 + 0.4 * abs(cos(sa * 5.0)))); scol = mix(scol, uGold, sp); gold = max(gold, sp * 0.8);
    c = mix(c, scol, 1.0 - smoothstep(-w, w, sd));
    c = mix(c, uIvory, 1.0 - smoothstep(-w, w, abs(sd) - 0.006));
    float so = 1.0 - smoothstep(-w, w, abs(sd - 0.018) - 0.003); c = mix(c, uGold, so); gold = max(gold, so);
  }
  // ---- inner guard: a rope of gold thread between two dark lines ----
  if (d < 0.31) {
    float gd = d - 0.285;
    float rope = 0.5 + 0.5 * sin((s + gd * 1.2) * 190.0);
    vec3 gc = mix(uGold * 0.55, uGold * 1.15, rope);
    gc = mix(gc, uBorder * 0.35, smoothstep(0.014 - w, 0.014 + w, abs(gd)));
    c = mix(c, gc, 1.0 - smoothstep(-w, w, abs(gd) - 0.022)); gold = max(gold, (1.0 - smoothstep(-w, w, abs(gd) - 0.014)) * (0.5 + 0.5 * rope));
  }
  // ---- main border ----
  if (d < 0.263) {
    vec3 bc = uBorder * (0.9 + 0.2 * cNoise(s * 9.0 + 40.0));
    float cell = s / 0.2 + 0.5; float ci = floor(cell); vec2 uv = vec2((fract(cell) - 0.5) * 0.2, d - 0.162);
    float vine = uv.y - 0.05 * sin(cell * 6.2832 + 1.5708);                      // the vine winds between the flowers
    bc = mix(bc, uIvory * 0.9, (1.0 - smoothstep(-w, w, abs(vine) - 0.0045)) * 0.9);
    vec2 lf = vec2(abs(fract(cell + 0.5) - 0.5) * 0.2, uv.y); float leaf = lf.x / 0.028 + abs(lf.y) / 0.06;   // buds on the cell joints
    bc = mix(bc, uGold, 1.0 - smoothstep(-w * 20.0, w * 20.0, leaf - 1.0));
    float r = length(uv), a = atan(uv.y, uv.x); float alt = mod(ci, 2.0);
    float rr = uStyle.y < 0.5 ? 0.066 * (0.68 + 0.32 * cos(a * 8.0)) : 0.07 * (1.0 / (abs(cos(a)) + abs(sin(a)))) * (0.9 + 0.1 * cos(a * 4.0));
    float ro = r - rr;
    vec3 rc = mix(uAccent, uField * 1.15, alt);
    rc = mix(rc, uIvory, 1.0 - smoothstep(-w, w, r - 0.034 * (0.7 + 0.3 * cos(a * 8.0 + 3.1416))));
    rc = mix(rc, mix(uField, uAccent, alt), 1.0 - smoothstep(-w, w, r - 0.017));
    float pip = 1.0 - smoothstep(-w, w, r - 0.008); rc = mix(rc, uGold, pip);
    bc = mix(bc, rc, 1.0 - smoothstep(-w, w, ro));
    bc = mix(bc, uIvory, 1.0 - smoothstep(-w, w, abs(ro) - 0.004));
    c = mix(c, bc, 1.0 - smoothstep(-w, w, d - 0.26));
    gold = mix(max((1.0 - smoothstep(-w * 20.0, w * 20.0, leaf - 1.0)) * 0.7 * smoothstep(-w, w, ro), pip), gold, smoothstep(0.255, 0.265, d));
  }
  // ---- outer guard stripe: ivory with a running chain of little diamonds ----
  if (d < 0.066) {
    float gd = d - 0.044; float k = abs(fract(s * 20.0) - 0.5) / 20.0 + abs(gd);
    vec3 gc = mix(mix(uAccent, uBorder, step(0.5, fract(s * 10.0))), uIvory, smoothstep(0.012 - w, 0.012 + w, k));
    c = mix(c, gc, 1.0 - smoothstep(-w, w, abs(gd) - 0.019));
    c = mix(c, uBorder * 0.4, 1.0 - smoothstep(-w, w, abs(abs(gd) - 0.021) - 0.0025));
    gold *= smoothstep(0.06, 0.07, d);
  }
  // ---- selvedge: overcast binding ----
  if (d < 0.023) { c = mix(uBorder * 0.45, uAccent * 0.5, 0.5 + 0.5 * sin(s * 260.0)); gold = 0.0; }
  return vec4(c, gold);
}`,u=o.Vector3;function O(l,r,c,h){const d=[],i=[],f=l.length,S=new u,F=new u,w=new u,z=new u;for(let p=0;p<f;p++){S.copy(l[Math.min(p+1,f-1)]).sub(l[Math.max(p-1,0)]).normalize(),F.set(0,1,0),Math.abs(S.y)>.9&&F.set(1,0,0),w.crossVectors(S,F).normalize(),z.crossVectors(w,S).normalize();for(let y=0;y<c;y++){const x=y/c*Math.PI*2,A=Math.cos(x)*r[p],C=Math.sin(x)*r[p];d.push(l[p].x+w.x*A+z.x*C,l[p].y+w.y*A+z.y*C,l[p].z+w.z*A+z.z*C)}}for(let p=0;p<f-1;p++)for(let y=0;y<c;y++){const x=p*c+y,A=p*c+(y+1)%c;i.push(x,A,x+c,A,A+c,x+c)}if(h)for(const p of[0,f-1]){const y=d.length/3;d.push(l[p].x,l[p].y,l[p].z);for(let x=0;x<c;x++){const A=p*c+x,C=p*c+(x+1)%c;p?i.push(A,C,y):i.push(C,A,y)}}const v=new o.BufferGeometry;return v.setAttribute("position",new o.Float32BufferAttribute(d,3)),v.setIndex(i),v.computeVertexNormals(),v}function Q(l,r){const c=new o.LatheGeometry(l.map(([h,d])=>new o.Vector2(Math.max(h,1e-4),d)),r);return c.deleteAttribute("uv"),c}function Qe(l,r){l.attributes.uv&&l.deleteAttribute("uv");const c=l.attributes.position,h=new Float32Array(c.count*3),d=new Float32Array(c.count),i=new o.Color;for(let f=0;f<c.count;f++){const S=r(c.getX(f),c.getY(f),c.getZ(f),i)||0;h[f*3]=i.r,h[f*3+1]=i.g,h[f*3+2]=i.b,d[f]=S}return l.setAttribute("color",new o.BufferAttribute(h,3)),l.setAttribute("aGlow",new o.BufferAttribute(d,1)),l}const Ce=(l,r,c,h,d=0,i=1)=>l.applyMatrix4(new o.Matrix4().compose(new u(r,c,h),new o.Quaternion().setFromAxisAngle(new u(0,1,0),d),new u(i,i,i))),je=[{field:"#96202a",border:"#22357a",accent:"#c9862b"},{field:"#3152ac",border:"#7c1f2a",accent:"#c7a24a"},{field:"#1c7462",border:"#5c2850",accent:"#d0733a"},{field:"#742c72",border:"#1c5266",accent:"#d9a441"},{field:"#a84e1c",border:"#2a5a5c",accent:"#e2c27a"}],De=["#c9952e","#c08350","#d09a5c"];var Ye={id:"magic-carpet",name:"Magic Carpet",media:["air","open","interior","tiny"],near:.8,gaze:.8,stow:[0,-2.6,1.4],async build(l){const{rng:r,lit:c,fill:h}=l,d=new o.Group,i=new o.Group;d.add(i);const f=r.pick(je),S=r.pick(De),F=new o.Color(f.accent),w=new o.Color(f.field),z=F.clone(),v={uPh:{value:new o.Vector2},uMv:{value:new u},uTime:{value:0},uField:{value:w},uBorder:{value:new o.Color(f.border)},uAccent:{value:F.clone()},uIvory:{value:new o.Color("#d2c5a6")},uGold:{value:new o.Color("#d6a136")},uLampCol:{value:new o.Color(1,.55,.2)},uLampAt:{value:new o.Vector4(0,0,0,.5)},uStyle:{value:new u(r.pick([8,12,16]),r.chance(.5)?0:1,r.range(0,50))},uGlowK:{value:1},uEnv:{value:new o.Color(.2,.2,.2)}},p=(e,t)=>{for(const a of t)e.uniforms[a]=v[a]},y=new o.PlaneGeometry(B*2,be*2,36,50);y.rotateX(-Math.PI/2),y.translate(0,0,ge);const x=new o.MeshStandardMaterial({color:"#ffffff",roughness:.93,metalness:0,side:o.DoubleSide});x.onBeforeCompile=e=>{p(e,["uPh","uMv","uTime","uField","uBorder","uAccent","uIvory","uGold","uLampCol","uLampAt","uStyle","uEnv"]),e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
varying vec2 vCp; varying vec3 vRp;
`+Se).replace("#include <beginnormal_vertex>",`#include <beginnormal_vertex>
          { vec2 cp = position.xz; float h0 = carpetH(cp);
            objectNormal = normalize(vec3(h0 - carpetH(cp + vec2(0.03, 0.0)), 0.03, h0 - carpetH(cp + vec2(0.0, 0.03)))); }`).replace("#include <begin_vertex>",`#include <begin_vertex>
          transformed.y += carpetH(position.xz); vCp = position.xz; vRp = transformed + vec3(0.0, ${$.toFixed(2)}, 0.0);`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
`+Oe).replace("#include <color_fragment>",`#include <color_fragment>
          float cw = length(fwidth(vCp)) * 0.75;
          vec4 cc = carpetCol(vCp, cw);
          float knotFade = clamp(1.0 - cw * 190.0, 0.0, 1.0);
          float knots = sin(vCp.x * 520.0) * sin(vCp.y * 520.0);
          cc.rgb *= 1.0 + 0.16 * knots * knotFade;
          cc.rgb *= 0.93 + 0.14 * cHash(floor(vCp * 55.0));                       // tufts take the dye unevenly
          if (!gl_FrontFacing) {                                                  // the back: the same design, ghostly, on jute
            float warp = 0.5 + 0.5 * sin(vCp.x * 300.0) * knotFade;
            cc = vec4(mix(vec3(0.42, 0.34, 0.24) * (0.8 + 0.3 * warp), cc.rgb, 0.35), 0.0);
          }
          diffuseColor.rgb = cc.rgb;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
          { float glint = pow(0.5 + 0.5 * sin(vCp.y * 5.0 + vCp.x * 2.0 + uTime * 1.7), 8.0);
            float spark = step(0.86, cHash(floor(vCp * 140.0))) * (0.5 + 0.5 * sin(uTime * 5.0 + cHash(floor(vCp * 140.0) + 7.0) * 40.0));
            totalEmissiveRadiance += uGold * cc.a * (0.10 + 1.1 * glint + 0.9 * spark * glint);      // gold thread catching the light
            vec3 dl = uLampAt.xyz - vRp; float d2 = dot(dl, dl);
            float lam = clamp(dl.y / sqrt(d2) + 0.35, 0.0, 1.0);
            totalEmissiveRadiance += cc.rgb * uLampCol * (uLampAt.w * lam / (1.0 + d2 * 16.0));
            float graze = 1.0 - abs(dot(normal, normalize(vViewPosition)));                            // the pile catches the sky at grazing angles
            vec3 skyL = mix(uEnv, vec3(dot(uEnv, vec3(0.333))), 0.55);
            totalEmissiveRadiance += cc.rgb * skyL * (0.24 + 0.40 * graze * graze); }       // the lamp's pool of light`)},x.customProgramCacheKey=()=>"magic-carpet-cloth",c(x);const A=new o.Mesh(y,x);A.position.y=$,i.add(A);const C=.25,k0=[],z0=[];for(let e=0;e<=4;e++){const t=e/4;k0.push(new u(0,0,-.014-t*(C-.014))),z0.push([.005,.014,.019,.021,.017][e])}const U=new o.OctahedronGeometry(.017,0);U.scale(1,.9,1.3),U.translate(0,0,-.008),U.deleteAttribute("uv");const ke=O(k0,z0,5,!0).toNonIndexed(),F0=Y([U,ke]),G0=40,P0=8,m0=G0+P0+4,W=new o.MeshStandardMaterial({color:"#ffffff",roughness:.85,metalness:0,side:o.DoubleSide});W.onBeforeCompile=e=>{p(e,["uPh","uMv","uEnv"]),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
uniform vec3 uEnv;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance += diffuseColor.rgb * uEnv * 0.34;   // light comes through loose threads
`),e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
attribute float aSeed;
`+Se).replace("#include <begin_vertex>",`#include <begin_vertex>
          { vec3 ip = instanceMatrix[3].xyz; float sc = length(instanceMatrix[0].xyz);
            float dirz = sign(instanceMatrix[2].z);                                // +1 front edge, -1 back edge
            float l = clamp(-position.z / ${C.toFixed(3)}, 0.0, 1.0);
            float hh = carpetH(ip.xz);
            float slope = clamp((hh - carpetH(ip.xz + vec2(0.0, 0.07 * dirz))) / 0.07, -0.35, 0.35);   // carry on along the cloth's own slope
            float ph = uPh.y * 1.7 + ip.x * 5.3 + aSeed * 1.3;
            float whip = 0.3 + 0.7 * uMv.y;
            transformed.y += hh / sc + l * ${C.toFixed(3)} * slope + l * l * (-0.062 - 0.022 * aSeed + 0.04 * uMv.y + whip * 0.045 * sin(ph - l * 2.6));
            transformed.x += l * l * (whip * 0.04 * sin(ph * 0.83 + 1.3 - l * 2.0) - uMv.x * 0.05 * dirz); }`)},W.customProgramCacheKey=()=>"magic-carpet-fringe",c(W);const q0=new Float32Array(m0);for(let e=0;e<m0;e++)q0[e]=r();F0.setAttribute("aSeed",new o.InstancedBufferAttribute(q0,1));const E=new o.InstancedMesh(F0,W,m0),J=new o.Matrix4,d0=new o.Quaternion,B0=new u(0,1,0),ze=new o.Color,E0=new o.Color("#dccfae"),Fe=new o.Color("#d9a52f"),Ge=new o.Color(r.chance(.5)?f.accent:f.field).lerp(E0,.2),Pe=r.pick([2,3,4]);let H=0;for(const e of[0,1]){d0.setFromAxisAngle(B0,e?Math.PI:0);const t=e?P0:G0;for(let a=0;a<t;a++){const s=-B+.04+(a+.5)*(B*2-.08)/t,n=.92+.2*r();J.compose(new u(s,$,e?V:I),d0,new u(n,n,n)),E.setMatrixAt(H,J),E.setColorAt(H,ze.copy(a%Pe===0?Ge:E0).multiplyScalar(.85+.25*r())),H++}for(const a of[-1,1])J.compose(new u(a*(B-.005),$,e?V:I),d0,new u(2.4,2.4,1.45)),E.setMatrixAt(H,J),E.setColorAt(H,Fe),H++}E.instanceMatrix.needsUpdate=!0,E.instanceColor.needsUpdate=!0,i.add(E);const j=new o.Color(S),L0=j.clone().multiplyScalar(.32),T=new o.MeshStandardMaterial({color:"#ffffff",vertexColors:!0,roughness:.36,metalness:.3});T.onBeforeCompile=e=>{p(e,["uGlowK","uEnv"]),e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
attribute vec3 aFx; varying vec3 vFx;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vFx = aFx;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
uniform float uGlowK; uniform vec3 uEnv; varying vec3 vFx;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
          { vec3 rf = reflect(-normalize(vViewPosition), normal);
            float sky = smoothstep(-0.35, 0.9, rf.y); float band = 0.3 * sky + 0.9 * pow(max(0.0, 1.0 - abs(rf.y - 0.2) * 2.6), 3.0) + 0.5 * pow(max(0.0, 1.0 - abs(rf.x - 0.35) * 4.0), 3.0);
            totalEmissiveRadiance += diffuseColor.rgb * (mix(uEnv, vec3(dot(uEnv, vec3(0.333))) * vec3(1.0, 0.82, 0.55), 0.6) * 0.6 + vec3(0.14, 0.09, 0.03)) * (0.10 + 0.95 * band) * vFx.y;      // a polished thing mirrors the sky it flies under
            float fr = 1.0 - abs(dot(normal, normalize(vViewPosition)));                   // glass: tea is deep in the middle and bright
            float thin = mix(1.0, 0.45 + 2.2 * fr * fr, vFx.z);                              // where the light gets round it at the sides
            totalEmissiveRadiance += diffuseColor.rgb * vFx.x * uGlowK * thin;
            float stripe = pow(max(0.0, 1.0 - abs(normal.x + 0.50) * 6.0), 2.0) + 0.35 * pow(max(0.0, 1.0 - abs(normal.x - 0.66) * 7.0), 2.0);
            totalEmissiveRadiance += (uEnv * 1.3 + vec3(0.30, 0.24, 0.16) * uGlowK) * (stripe * 0.85 + 0.5 * pow(fr, 4.0)) * vFx.z; }`)},T.customProgramCacheKey=()=>"magic-carpet-props",c(T);const b=(e,t)=>{Qe(e,t);const a=e.attributes.aGlow,s=new Float32Array(a.count*3);for(let n=0;n<a.count;n++){const m=a.getX(n);s[n*3]=m%10,s[n*3+1]=m>=10&&m<20?1:0,s[n*3+2]=m>=20?1:0}return e.deleteAttribute("aGlow"),e.setAttribute("aFx",new o.BufferAttribute(s,3)),e},I0=(e,t)=>.8+.2*Math.sin(e*t),L=[],R=new u(.262,.15,0),H0=(e,t,a)=>{const s=Math.hypot(e-R.x,t-R.y,a-R.z);return .9/(1+s*s*900)+.8/(1+s*s*30)},f0=(e,t,a,s)=>(s.copy(j).multiplyScalar(I0(t,520)*(.62+.38*Math.min(1,t/.05))),(Math.abs(t-.078)<.004||Math.abs(t-.046)<.003)&&s.copy(L0),10+H0(e,t,a)),T0=Q([[0,0],[.04,0],[.045,.004],[.041,.01],[.025,.018],[.02,.028],[.03,.036],[.058,.046],[.078,.062],[.085,.074],[.085,.082],[.078,.092],[.06,.104],[.041,.11],[.037,.114],[.038,.117],[.031,.124],[.016,.132],[.007,.137],[.011,.142],[.013,.148],[.007,.154],[0,.158]],22);T0.scale(1.12,1,.86),L.push(b(T0,f0));const R0=[],_0=[];for(let e=0;e<=8;e++){const t=e/8;R0.push(new u(.06+.2*t,.068+.012*t+.07*t*t*t+.004*Math.sin(t*3.1),0)),_0.push(e===8?.0125:.031-.021*Math.pow(t,.8))}L.push(b(O(R0,_0,10,!1),f0));const K0=new o.CylinderGeometry(.004,.005,.016,5);K0.translate(R.x-.002,R.y-.004,0),L.push(b(K0,(e,t,a,s)=>(s.set("#2a1608"),1.6)));const N0=[],V0=[];for(let e=0;e<=12;e++){const t=(-110+290*e/12)*Math.PI/180,a=.04+(e>10?(e-10)*.012:0);N0.push(new u(-.108-Math.cos(t)*a*.85+.03,.082+Math.sin(t)*a,0)),V0.push(.0075-.003*(e/12))}L.push(b(O(N0,V0,7,!0),f0));for(let e=0;e<14;e++){const t=e/14*Math.PI*2,a=new o.OctahedronGeometry(.0055,1);a.translate(Math.cos(t)*.085*1.12,.078,Math.sin(t)*.085*.86),L.push(b(a,(s,n,m,M)=>(M.copy(j).multiplyScalar(1.15),10+H0(s,n,m))))}const qe=Q([[0,0],[.05,.001],[.09,.0015],[.105,.002],[.11,0]],24);L.push(b(qe,(e,t,a,s)=>{const n=Math.hypot(e,a);return s.set(n>.085?f.accent:f.border).multiplyScalar(.8),.25/(1+n*n*150)}));const $0=Y(L.map(e=>e.index?e.toNonIndexed():e)),O0=Math.PI/2+.85,Q0=1.1;Ce($0,0,0,0,O0,Q0);const e0=new o.Mesh($0,T);i.add(e0);const Be=R.clone().applyAxisAngle(B0,O0).multiplyScalar(Q0),t0=[],Ee=Q([[0,.006],[.03,.006],[.06,.0065],[.09,.006],[.12,.0065],[.15,.006],[.172,.007],[.182,.013],[.188,.026],[.193,.027],[.187,.011],[.172,0],[0,0]],28);t0.push(b(Ee,(e,t,a,s)=>{const n=Math.hypot(e,a),m=Math.atan2(a,e);let M=.92;return n>.05&&n<.16&&(M=.74+.22*Math.abs(Math.sin(m*9+n*60))),Math.abs(n-.15)<.012&&(M=.5),s.copy(j).multiplyScalar(M),10.14}));const j0=[.075,.045],Le=Q([[0,.006],[.034,.006],[.037,.012],[.03,.02],[.046,.04],[.054,.06],[.05,.08],[.036,.096],[.027,.104],[.03,.108],[.022,.116],[.01,.122],[.006,.128],[.01,.134],[.006,.14],[0,.142]],20),D0=(e,t,a,s)=>(s.copy(j).multiplyScalar(I0(t,430)*.95),Math.abs(t-.06)<.004&&s.copy(L0),10.22),h0=[b(Le,D0)],X0=[],Y0=[];for(let e=0;e<=7;e++){const t=e/7;X0.push(new u(-.04-.055*t-.012*Math.sin(t*3.14),.045+.07*t*t+.015*t,0)),Y0.push(.012-.0075*t)}h0.push(b(O(X0,Y0,7,!1),D0));const Z0=[],U0=[];for(let e=0;e<=9;e++){const t=(-80+160*e/9)*Math.PI/180;Z0.push(new u(.045+Math.cos(t)*.036,.066+Math.sin(t)*.034,0)),U0.push(.0052)}h0.push(b(O(Z0,U0,6,!0),(e,t,a,s)=>(s.set("#2b1a12"),0)));const W0=Y(h0);Ce(W0,j0[0],0,j0[1],2.3,1),t0.push(W0);for(let e=0;e<3;e++){const t=new o.BoxGeometry(.016,.014,.016);t.rotateY(e*1.1),t.translate(-.02+e*.021,.014+(e===1?.013:0),.105-(e===1?.004:0)),t0.push(b(t,(a,s,n,m)=>(m.set("#e9e4d8"),.06)))}const Ie=Y(t0.map(e=>(e.attributes.uv&&e.deleteAttribute("uv"),e))),k=new o.Mesh(Ie,T);i.add(k);const o0=new o.Color(r.pick(["#a8380f","#b5561a","#8f2a14","#b0421c"])),a0=[],He=Q([[0,.002],[.022,.002],[.03,.003],[.045,.008],[.052,.011],[.05,.007],[.03,0],[0,0]],20);a0.push(b(He,(e,t,a,s)=>{const n=Math.hypot(e,a);return s.set(n>.046?"#c9982f":"#e6dfd0"),n>.046?10:.05}));const Te=Q([[0,.006],[.021,.006],[.024,.011],[.0195,.03],[.0185,.046],[.0235,.066],[.0282,.083],[.029,.0865],[.0304,.095],[.031,.099],[.0295,.0985],[.0282,.0875],[.0268,.0845],[.02,.0838],[0,.0838]],18),J0=o0.clone().lerp(new o.Color("#ffb04a"),.55),ee=new o.Color("#aebfb9");a0.push(b(Te,(e,t,a,s)=>{const n=Math.hypot(e,a);if(t>.097)return s.set("#ecd9a0"),10.35;if(t>.0855)return s.copy(ee).multiplyScalar(.55),20.16;if(t>.0835&&n<.0275)return n>.024?(s.copy(J0),1.5):(s.copy(o0).multiplyScalar(n>.01?.7:.4),n>.01?.5:.25);if(t<.012)return s.copy(ee).multiplyScalar(.5).lerp(o0,.25),20.14;const m=(t-.012)/.072;return s.copy(o0).multiplyScalar(.5+.4*m).lerp(J0,.3*m*m),20.34+.6*m*m}));const Re=[new u(.036,.011,-.03),new u(.04,.012,0),new u(.041,.013,.025),new u(.04,.012,.036),new u(.039,.011,.044)];a0.push(b(O(Re,[.0018,.002,.003,.007,.002],6,!0),(e,t,a,s)=>(s.set("#d8d2c4"),10)));const te=Y(a0);te.scale(1.22,1.22,1.22);const _=new o.Mesh(te,T);i.add(_);const v0=new u(-.062,.0075,-.04),_e=.1*1.22,oe=3,ae=14,se=72,x0=oe+1+ae+se,ne=new Float32Array(x0*4),re=new Float32Array(x0*3);let w0=0;const s0=(e,t,a=0,s=0,n=0)=>{ne.set([e,r(),t,r()],w0*4),re.set([a,s,n],w0*3),w0++};for(let e=0;e<oe;e++)s0(0,1-e*.28);s0(1,.36);for(let e=0;e<ae;e++)s0(2,1);for(let e=0;e<se;e++){const t=e%2?1:-1,a=r();s0(3,r.range(.01,.026)*(r.chance(.12)?1.8:1),t*(B-.05+a*a*.6),$+r.range(-.16,.12)+a*.1,I-.15)}const K=new o.InstancedBufferGeometry,y0=new o.PlaneGeometry(1,1);K.setAttribute("position",y0.attributes.position),K.setIndex(y0.index),K.setAttribute("aA",new o.InstancedBufferAttribute(ne,4)),K.setAttribute("aB",new o.InstancedBufferAttribute(re,3)),K.instanceCount=x0;const G={uPh:v.uPh,uMv:v.uMv,uTime:v.uTime,uLampCol:v.uLampCol,uGold:v.uGold,uFlame:{value:new u},uCup:{value:new u},uMote:{value:0},uPres:{value:1},uHalo:{value:.5},uSteam:{value:new o.Color(.6,.6,.6)},uSpark:{value:1}},ce=new o.Mesh(K,new o.ShaderMaterial({uniforms:G,transparent:!0,depthWrite:!1,blending:o.CustomBlending,blendEquation:o.AddEquation,blendSrc:o.OneFactor,blendDst:o.OneMinusSrcAlphaFactor,blendSrcAlpha:o.OneFactor,blendDstAlpha:o.OneMinusSrcAlphaFactor,vertexShader:`
        attribute vec4 aA; attribute vec3 aB;
        uniform vec2 uPh; uniform vec3 uMv, uFlame, uCup; uniform float uTime, uMote;
        varying vec2 vQ; varying vec4 vK;                 // vK = kind, seed, alpha, seed2
        void main() {
          float kind = aA.x, sd = aA.y, sd2 = aA.w; vec2 q = position.xy; vQ = q;
          vec3 c = uFlame; vec2 off = vec2(0.0); float alpha = 1.0;
          float flick = sin(uTime * 23.0 + sd * 9.0) * sin(uTime * 17.3 + sd2 * 5.0);
          if (kind < 0.5) {                               // flame tongues, leaning with the turn and guttering at speed
            float h = (0.058 + 0.010 * flick) * aA.z * (1.0 - 0.25 * uMv.y), w = 0.026 * (0.6 + 0.4 * aA.z);
            float y = q.y + 0.5;
            off = vec2(q.x * w + y * y * (0.012 * sin(uTime * 9.0 + sd * 6.0) * (0.4 + uMv.y) + uMv.x * 0.02), y * h - 0.004);
          } else if (kind < 1.5) {                        // halo
            c += vec3(0.0, 0.02, 0.0); off = q * aA.z * (1.0 + 0.05 * flick);
          } else if (kind < 2.5) {                        // steam off the tea, laid back by the wind of flight
            float a = fract(uTime * (0.26 + 0.1 * sd2) + sd);
            c = uCup + vec3(0.016 * a * sin(a * 7.0 + sd * 1.5 - uTime * 1.6) - uMv.x * 0.05 * a, a * (0.24 - 0.10 * uMv.y), a * a * (0.03 + 0.4 * uMv.y) + 0.01 * cos(a * 7.0 + sd * 11.0));
            off = q * (0.030 + 0.09 * a) * vec2(1.0, 1.7); alpha = sin(3.1416 * a) * sin(3.1416 * sqrt(a)) * 0.5;
          } else {                                        // gold motes shed from the edges, streaming back past the rider
            float a = fract(uMote * (0.7 + 0.6 * sd2) + sd);
            float wob = sd * 40.0 + a * 9.0;
            c = aB + vec3(sign(aB.x) * (0.05 + 0.25 * a * a) + 0.05 * sin(wob), 0.06 * sin(wob * 1.3 + 2.0) + 0.14 * a * a - 0.05 * a, a * 3.4);
            float tw = 0.45 + 0.55 * sin(uTime * (5.0 + 7.0 * sd2) + sd * 50.0);
            off = q * aA.z * (0.8 + 0.5 * tw) * 4.0; alpha = smoothstep(0.0, 0.08, a) * (1.0 - smoothstep(0.6, 1.0, a)) * (0.35 + 0.65 * tw * tw);
          }
          vK = vec4(kind, sd, alpha, sd2);
          vec4 mv = modelViewMatrix * vec4(c, 1.0); mv.xy += off;
          gl_Position = projectionMatrix * mv;
        }`,fragmentShader:`
        uniform vec3 uLampCol, uGold, uSteam; uniform float uPres, uHalo, uSpark;
        varying vec2 vQ; varying vec4 vK;
        void main() {
          float kind = vK.x; vec2 p = vQ * 2.0; float r = length(p); vec3 col = vec3(0.0); float a = 0.0;
          if (kind < 0.5) {
            float y = vQ.y + 0.5; float wd = 0.95 * sqrt(max(0.0, y)) * (1.0 - y) * 2.2 + 0.02;
            float sh = 1.0 - smoothstep(0.35, 1.0, abs(p.x) / wd); sh *= smoothstep(0.0, 0.06, y) * (1.0 - smoothstep(0.75, 1.0, y));
            vec3 hot = mix(vec3(0.25, 0.4, 1.4), vec3(5.5, 2.6, 0.7), smoothstep(0.02, 0.3, y)); hot = mix(hot, vec3(4.0, 1.2, 0.2), smoothstep(0.55, 1.0, y));
            col = hot * sh * sh * 0.75;
          } else if (kind < 1.5) {
            col = uLampCol * (exp(-r * r * 9.0) * 1.1 + exp(-r * r * 2.6) * 0.22) * (1.0 - smoothstep(0.7, 1.0, r)) * uHalo;
          } else if (kind < 2.5) {
            float s = (1.0 - smoothstep(0.1, 1.0, r)) * vK.z; col = (uSteam + uLampCol * 0.15) * s; a = s;
          } else {
            col = uGold * (exp(-r * r * 60.0) * 6.0 + exp(-r * r * 7.0) * 0.5) * (1.0 - smoothstep(0.7, 1.0, r)) * vK.z * uSpark;
          }
          gl_FragColor = vec4(col * uPres, a * uPres);
        }`}));ce.renderOrder=5,i.add(ce);const g=v.uMv.value,n0=v.uPh.value,le=new o.Color,D={h:0,s:0,l:0},ie={h:0,s:0,l:0},P=new o.Color;w.getHSL(ie);let g0=!0,ue="",X=0,r0=0,pe=0,me=0,de=r()*10,c0=0,l0=0,i0=0,u0=0;const fe=(e,t,a,s)=>{const n=C0(t,a,n0,g),m=(C0(t+.05,a,n0,g)-n)/.05,M=(C0(t,a+.05,n0,g)-n)/.05;return e.position.set(t,$+n+s,a),e.rotation.set(-M,0,m),e};return{object:d,update(e,t,a){const s=Math.min(Math.max(e||0,0),.1),n=g0||s===0,m=N=>n?1:1-Math.exp(-s*N),M=Math.max(a.speed||0,.001);(g0||X<.002)&&(X=M,r0=M),X+=(M-X)*m(.05),r0+=(M-r0)*m(1.2);const b0=a.crossing||0,Ke=Math.min(1,Math.max(.5*M/X,b0*.9)),Ne=Math.min(1,Math.max(-1,(M/r0-1)*4))+b0*.5,Ve=Math.min(.6,Math.max(-.6,-(a.turn||0)*1.8));g.x+=(Ve-g.x)*m(2.2),g.y+=(Ke-g.y)*m(1.5),g.z+=(Ne-g.z)*m(2),pe+=s*g.y*2.4,me+=s*g.y*9,de+=s*(.16+.34*g.y),n0.set(t*1.885+pe,t*5.2+me),v.uTime.value=t,G.uMote.value=de+t*.02,i.position.set(.012*Math.sin(t*.71+1.3),.032*Math.sin(t*1.885)+.01*Math.sin(t*.83+1),.03*g.z),i.rotation.set(.01*Math.sin(t*.47)-.012*g.z,.008*Math.sin(t*.39+2),.01*Math.sin(t*.6+2)),fe(e0,Me[0],Me[1],.004),fe(k,Ae[0],Ae[1],.003);const he=Math.min(.04,Math.max(-.04,-(a.turn||0)*.16-k.rotation.z*.25)),ve=Math.min(.03,Math.max(-.03,g.z*.03+k.rotation.x*.25))+.004*Math.sin(t*.9);n?(c0=he,l0=ve,i0=u0=0):(i0+=((he-c0)*26-i0*4.5)*s,u0+=((ve-l0)*26-u0*4.5)*s,c0+=i0*s,l0+=u0*s);const xe=v0.x+c0,we=v0.z+l0;_.position.set(k.position.x+xe,k.position.y+v0.y+k.rotation.z*xe-k.rotation.x*we,k.position.z+we),_.rotation.copy(k.rotation),G.uCup.value.set(_.position.x,_.position.y+_e,_.position.z);const q=a.light,$e=q&&q.has?q.level:.6,p0=Math.min(1.1,Math.max(.22,1.2-$e*1)),M0=.86+.09*Math.sin(t*11.3)*Math.sin(t*7.1)+.05*Math.sin(t*23),A0=G.uFlame.value.copy(Be).applyEuler(e0.rotation).add(e0.position);v.uLampAt.value.set(A0.x,A0.y+.03,A0.z,1.5*p0*M0),v.uGlowK.value=(.45+.75*p0)*M0,G.uHalo.value=(.3+.5*p0)*M0,q&&q.has?P.copy(q.key).multiplyScalar(Math.min(q.keyIntensity,4)*.2).add(le.copy(q.ambient).multiplyScalar(.4)):P.copy(a.fill?a.fill.value:h.value).multiplyScalar(1.5).addScalar(.12);const ye=Math.max(P.r,P.g,P.b,.001);ye>.85&&P.multiplyScalar(.85/ye),v.uEnv.value.lerp(P,m(1.5)),G.uSteam.value.lerp(P.multiplyScalar(.9).addScalar(.1),m(1.5)),G.uSpark.value=(.45+.55*p0)*(1+1.5*b0),G.uPres.value=a.presence??1;const S0=a.portalColor||"#9fd0ff";if(S0!==ue){ue=S0,le.set(S0).getHSL(D);let N=Math.abs(D.h-ie.h);N=Math.min(N,1-N),z.setHSL(D.h,Math.min(.78,Math.max(.45,D.s)),N<.09?.62:Math.min(.52,Math.max(.36,D.l))).lerp(F,.3)}v.uAccent.value.lerp(z,m(.5)),g0=!1},dispose(){y0.dispose()}}}};export{Ye as default};
