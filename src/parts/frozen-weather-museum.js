import*as t from"three";import{mergeGeometries as Y0}from"three/addons/utils/BufferGeometryUtils.js";import{RoundedBoxGeometry as Z0}from"three/addons/geometries/RoundedBoxGeometry.js";import{clamp as _,lerp as v0,smoothstep as e0,bell as Q0}from"../kit/core.js";const $0=["#F4F1EA","#DCE6EE","#C9CED3","#B08D57","#14181E","#CFC4FF","#D98A3A"],E=150,I=Math.PI*2,b0=`
  precision highp sampler3D;
  uniform sampler3D uNoise;
  uniform float uPhase, uRise, uBreath;
  uniform vec4 uShape;   // base radius, flare radius, flare exponent, twist (rad per metre)
  uniform vec4 uBend;    // amplitude, angle, turns along height, wobble phase
  const float TH = 150.0;
  float nz(vec3 p) { vec3 q = p * 32.0; vec3 f = fract(q); q = floor(q) + f * f * (3.0 - 2.0 * f); return textureLod(uNoise, (q + 0.5) / 32.0, 0.).r; }   // explicit level: called from marching loops (Direct3D)
  vec2 tAxis(float y) {
    float h = clamp(y / TH, 0.0, 1.0); float a = uBend.y + h * uBend.z + uBend.w;
    return uBend.x * sin(3.14159 * h) * (0.7 + 0.3 * h) * vec2(cos(a), sin(a));
  }
  float tRw(float h) { float fl = smoothstep(0.8, 1.08, h); return (uShape.x + uShape.y * pow(max(h, 0.0), uShape.z) + 9.0 * fl * fl) * (1.0 + 0.08 * uBreath); }
  float tTh(float h) { return 1.2 + 3.6 * clamp(h, 0.0, 1.1); }
  float tDens(vec3 p, int oct) {
    float h = p.y / TH;
    if (p.y < 0.0 || h > 1.1) return 0.0;
    vec2 d = p.xz - tAxis(p.y); float r = length(d);
    float Rw = tRw(h), th = tTh(h);
    bool inSkirt = p.y < 14.0 && r < 27.0;
    if (r > Rw + 3.2 * th && !inSkirt) return 0.0;
    float a = -(uPhase + uShape.w * p.y); float ca = cos(a), sa = sin(a);
    vec2 q = vec2(ca * d.x - sa * d.y, sa * d.x + ca * d.y);
    vec3 tc = vec3(q.x, (p.y - uRise) * 0.3, q.y) * 0.0052;
    float n0 = nz(tc * vec3(0.41, 0.33, 0.41) + vec3(0.19, 0.0, 0.83));   // big lumps and ropes
    float n1 = nz(tc), n = n1;
    if (oct > 1) { float n2 = nz(tc * 2.3 + vec3(0.37, uPhase * 0.004, 0.11)); n = n1 * 0.62 + n2 * 0.38;
      if (oct > 2) { float n3 = nz(tc * 5.7 + vec3(0.71, -uPhase * 0.006, 0.53)); n = n1 * 0.46 + n2 * 0.32 + n3 * 0.22;
        n += (nz(tc * 15.1 + vec3(0.13, uPhase * 0.011, 0.59)) - 0.5) * 0.25; } }                 // fine dust that breaks up the bands and the silhouette
    float x = (r - Rw - ((n1 - 0.5) * 1.8 + (n0 - 0.5) * 2.6) * th) / th;
    float shell = x < 0.0 ? mix(0.16, 1.0, exp(-x * x * 1.6)) : exp(-x * x * 0.58);
    float dens = shell * smoothstep(0.37, 0.63, n + shell * 0.34 + (n0 - 0.5) * 0.3);
    dens *= 1.0 - smoothstep(0.80, 1.08, h + (n - 0.5) * 0.5);
    if (inSkirt) {
      float sk = exp(-p.y / 4.2) * smoothstep(27.0, 8.0, r) * smoothstep(0.40, 0.78, n);
      dens = max(dens, sk * 0.75);
    }
    return dens;
  }
`,J0=new t.Quaternion,ee=new t.Euler,te=new t.Vector3,oe=new t.Vector3;function h(d=0,a=0,e=0,n=0,r=0,m=0,g=1,b=g,u=g){return new t.Matrix4().compose(oe.set(d,a,e),J0.setFromEuler(ee.set(n,r,m)),te.set(g,b,u))}function q(d){const a=[],e={add(n,r,m,g=0,b=.05){const u=n.index?n.toNonIndexed():n;u.attributes.normal||u.computeVertexNormals();const A=u.attributes.position,C=A.count,v=new Float32Array(C*3),c=new Float32Array(C).fill(g),w=1+(d()-.5)*2*b;for(let M=0;M<C;M++){const R=typeof r=="function"?r(A.getX(M),A.getY(M),A.getZ(M)):r;v[M*3]=R.r*w,v[M*3+1]=R.g*w,v[M*3+2]=R.b*w}m&&u.applyMatrix4(m);for(const M of Object.keys(u.attributes))M!=="position"&&M!=="normal"&&u.deleteAttribute(M);return u.setAttribute("color",new t.BufferAttribute(v,3)),u.setAttribute("glow",new t.BufferAttribute(c,1)),a.push(u),e},box(n,r,m,g,b,u=0,A=0){const C=A>0?new Z0(n,r,m,1,Math.min(A,n*.49,r*.49,m*.49)):new t.BoxGeometry(n,r,m);return e.add(C,g,b,u)},tube(n,r,m,g,b,u=7,A=0){const C=new t.Vector3(...n),v=new t.Vector3(...r),c=v.clone().sub(C),w=c.length(),M=new t.CylinderGeometry(g,m,w,u,1),R=new t.Quaternion().setFromUnitVectors(new t.Vector3(0,1,0),c.normalize()),s=new t.Matrix4().compose(C.add(v).multiplyScalar(.5),R,new t.Vector3(1,1,1));return e.add(M,b,s,A)},merge(n,r){for(const m of n.list){const g=m.clone();r&&g.applyMatrix4(r),a.push(g)}return e},build(){const n=Y0(a,!1);for(const r of a)r.dispose();return n.computeBoundingSphere(),n},list:a};return e}const p=(d,a=1,e=null,n=0)=>{const r=new t.Color(d);return e&&r.lerp(new t.Color(e),n),r.multiplyScalar(a)};function g0(d=.72){const a=new t.MeshStandardMaterial({vertexColors:!0,roughness:d,metalness:0,side:t.DoubleSide});return a.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
attribute float glow;
varying float vGlow;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vGlow = glow;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
varying float vGlow;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance += diffuseColor.rgb * (vGlow + 0.10);`)},a.customProgramCacheKey=()=>"fwm-solid-glow",a}function ae(d,a){const e=q(d),n=7.2,r=2.3,m=.95,g=16,b=10,u=p(a[0],.78),A=p(a[6],.55,"#6b4a2a",.5),C=p(a[4],2.2,"#31525e",.6),v=p("#7a2f22",.8),c=[],w=[],M=(o,i)=>{const f=r/2*Math.pow(1-Math.pow(o,2.6),.55)*(.72+.28*e0(0,.35,o)),x=m*(1-.45*o*o*o),z=.42*Math.pow(o,2.5)+.05*(1-o)*(1-o),L=i*Math.PI/2,k=Math.sin(L),G=Math.cos(L);return[f*Math.sign(k)*Math.pow(Math.abs(k),.72),z-x*Math.pow(Math.max(G,0),.85),(o-.45)*n]};for(let o=0;o<=g;o++)for(let i=0;i<=b;i++)c.push(...M(o/g,i/b*2-1));for(let o=0;o<g;o++)for(let i=0;i<b;i++){const f=o*(b+1)+i,x=f+1,z=f+b+1,L=z+1;w.push(f,z,x,x,z,L)}const R=c.length/3;c.push(0,M(0,1)[1]-.1,M(0,0)[2]);for(let o=0;o<b;o++)w.push(R,o+1,o);const s=new t.BufferGeometry;s.setAttribute("position",new t.Float32BufferAttribute(c,3)),s.setIndex(w),s.computeVertexNormals(),e.add(s,(o,i)=>i<-.5?v:i>-.02-0*o?A:i>-.22?C:u,null,0,.02);for(const o of[-1,1]){const i=[];for(let f=0;f<=g;f++){const x=M(f/g,o);i.push(new t.Vector3(x[0],x[1]+.03,x[2]))}e.add(new t.TubeGeometry(new t.CatmullRomCurve3(i),24,.06,5),A)}for(const o of[.2,.45,.68]){const i=M(o,.62);e.box(Math.abs(i[0])*2+.05,.06,.34,A,h(0,i[1],i[2]),0,.02)}e.tube([0,-m,-.45*n+.2],[0,-m*.6,.5*n],.07,.05,v,5);for(const o of[-1,1]){const i=[o*1.15,.12,.2],f=[o*(2.9+d()*.5),.5+d()*.7,-1.5-d()];e.tube([o*.2,-.1,.9],f,.045,.04,A,5),e.box(.05,.3,1,u,new t.Matrix4().lookAt(new t.Vector3(...f),new t.Vector3(o*.2,-.1,.9),new t.Vector3(0,1,0)).setPosition(f[0],f[1],f[2]),0,.02),e.add(new t.TorusGeometry(.09,.025,5,10),p(a[3],.9),h(i[0]*.95,.1,i[2],Math.PI/2,0,0))}return e.tube([0,.3,.52*n],[.3,-1.6,.52*n+1.2],.03,.03,p(a[0],.6),4),e}function ne(d,a){const e=q(d),n=6,r=7,m=4,g=2.7,b=p(a[0],.74),u=p(a[0],.9),A=p(a[4],2.6,"#3f4a57",.5),C=p(a[4],1.6),v=p("#8a5a44",.7),c=new t.Color(1,.66,.3),w=p(a[3],.75),M=p("#5a4634",.8),R=new t.Shape;R.moveTo(-n/2,0),R.lineTo(n/2,0),R.lineTo(n/2,m),R.lineTo(0,m+g),R.lineTo(-n/2,m),R.closePath(),e.add(new t.ExtrudeGeometry(R,{depth:r,bevelEnabled:!1}),b,h(0,0,-r/2));for(const o of[-1,1]){for(let x=0;x<9;x++)e.box(.09,.47,r+.06,b,h(o*(n/2+.03),.24+x*.44,0,0,0,o*.1));for(const x of[-r/2,r/2])e.box(.22,m,.22,u,h(o*n/2,m/2,x),0,.03);const i=Math.hypot(n/2,g)+.7,f=Math.atan2(g,n/2);for(let x=0;x<7;x++){const z=(x+.5)/7,L=o*(n/2+.45-z*i*Math.cos(f)*1),k=m-.28+z*i*Math.sin(f);e.box(i/7+.16,.12,r+1,A,h(L,k+.16,0,0,0,-o*(f+.07)+(o>0?0:Math.PI)),0,.03)}for(const x of[-1.7,1.7])s(o*(n/2+.09),2.2,x,o>0?Math.PI/2:-Math.PI/2,1.1,1.5)}function s(o,i,f,x,z,L){const k=h(o,i,f,0,x,0);e.box(z+.28,L+.28,.1,u,k,0,.03),e.box(z,L,.14,c,k,3.2+d()*2,0),e.box(.07,L,.18,u,k),e.box(z,.07,.18,u,k),e.box(z+.5,.1,.3,u,h(o,i-L/2-.16,f,0,x,0),0,.03)}e.add(new t.CylinderGeometry(.2,.2,r+1.1,6),p(a[3],.8),h(0,m+g+.2,0,Math.PI/2,0,0)),s(-1.7,2.2,r/2+.03,0,1.1,1.5),s(1.6,2.2,-r/2-.03,Math.PI,1.1,1.5),s(-1.5,2.2,-r/2-.03,Math.PI,1.1,1.5),e.add(new t.CylinderGeometry(.5,.5,.12,14),c,h(0,m+1.2,r/2+.04,Math.PI/2,0,0),3.5),e.add(new t.TorusGeometry(.52,.08,5,16),u,h(0,m+1.2,r/2+.08)),e.box(1.25,2.5,.12,u,h(1.2,1.25,r/2+.03),0,.03),e.box(1,2.25,.16,w,h(1.2,1.15,r/2+.04),0,.03),e.add(new t.SphereGeometry(.07,6,5),p(a[3],1.1),h(.85,1.15,r/2+.16)),e.box(2.2,.2,1.1,u,h(1.2,-.05,r/2+.55),0,.04),e.box(1.8,.2,.6,u,h(1.2,-.28,r/2+1.1),0,.04),e.box(.85,2.6,.85,v,h(-1.4,m+g-.2,-1.2),0,.03),e.box(1.05,.2,1.05,C,h(-1.4,m+g+1.15,-1.2),0,.04),e.add(new t.CylinderGeometry(.2,.26,.5,8),v,h(-1.4,m+g+1.5,-1.2)),e.box(n+.3,.35,r+.3,C,h(0,-.17,0),0,.05);for(let o=0;o<9;o++){const i=(o%3-1)*(n/2-.3),f=(Math.floor(o/3)-1)*(r/2-.3),x=.6+d()*1.5;e.tube([i,-.3,f],[i+(d()-.5)*.5,-.3-x,f+(d()-.5)*.5],.14,.09,M,5)}for(let o=0;o<9;o++){const i=o*.42,f=h(-n/2-.6-i*.82,-.9-i*.55+Math.sin(o)*.05,r/2-.4+i*.3,.1*o,.3,.55+o*.03);e.box(.16,1.2,.05,u,f,0,.02)}return e.tube([-n/2-.4,-.75,r/2-.35],[-n/2-3.6,-3,r/2+.75],.04,.04,u,4),e}function re(d,a){const e=q(d),n=p(a[4],1.25),r=p(a[3],1),m=p(a[0],.85),g=p(a[3],1.15,"#e6c26a",.5),b=()=>{const c=new t.Shape;return c.moveTo(0,0),c.lineTo(1.5,0),c.lineTo(1.5,.9),c.bezierCurveTo(1.5,1.6,.95,1.5,.9,2.1),c.bezierCurveTo(.85,2.6,.3,2.75,0,2.5),c.closePath(),c},u=new t.Matrix4().makeRotationX(-Math.PI/2),A=new t.ExtrudeGeometry(b(),{depth:.34,bevelEnabled:!0,bevelThickness:.025,bevelSize:.025,bevelSegments:2,curveSegments:10});e.add(A,n,h(0,.66,0).multiply(u));const C=new t.ExtrudeGeometry(b(),{depth:.02,bevelEnabled:!1,curveSegments:10});e.add(C,g,h(.08,1.03,-.3,0,0,0,.9,1,.86).multiply(u),.25);for(let c=0;c<14;c++)e.tube([.16+c*.085,1.056,-.4],[.16+c*.05,1.056,-1.5-(13-c)*.06],.006,.006,m,3,.6);const v=new t.ExtrudeGeometry(b(),{depth:.035,bevelEnabled:!0,bevelThickness:.01,bevelSize:.01,bevelSegments:1,curveSegments:10});e.add(v,n,h(0,1.07,0,0,0,.62).multiply(u)),e.tube([1.3,1.05,-.9],[1.02,1.8,-.9],.018,.014,r,4),e.box(1.5,.08,.3,n,h(.75,.74,.14),0,.02),e.box(1.36,.035,.24,m,h(.75,.8,.16));for(let c=0;c<22;c++)c%7!==2&&c%7!==6&&e.box(.03,.03,.14,n,h(.1+c*.06,.825,.11));e.box(.07,.16,.34,n,h(.035,.84,.14),0,.02),e.box(.07,.16,.34,n,h(1.465,.84,.14),0,.02),e.box(1.1,.34,.03,n,h(.75,1.2,-.12,-.25,0,0),0,.01);for(const[c,w]of[[.16,-.1],[1.34,-.1],[.42,-2.25]])e.tube([c,.66,w],[c,.1,w],.085,.05,n,8),e.add(new t.SphereGeometry(.06,7,5),r,h(c,.05,w));e.tube([.66,.66,-.16],[.7,.12,-.1],.025,.025,n,5),e.tube([.84,.66,-.16],[.8,.12,-.1],.025,.025,n,5),e.box(.3,.07,.1,n,h(.75,.12,-.1),0,.02);for(const c of[.67,.75,.83])e.box(.035,.015,.14,r,h(c,.09,0));e.box(.62,.1,.36,p("#5b1a22",.9),h(.75,.52,.85,.3,.2,.1),0,.04);for(const[c,w]of[[-.25,-.13],[.25,-.13],[-.25,.13],[.25,.13]])e.tube([.75+c,.48+w*.3,.85+w],[.75+c*1.1,.02+w*.3,.72+w*1.2],.03,.02,n,5);return e}function le(d,a){const e=q(d),n=p(a[6],.8),r=p(a[4],1.5),m=p(a[3],1),g=p(a[0],.8),b=p("#5a3a24",.8),u=.34,A=s=>{e.add(new t.TorusGeometry(u,.028,6,26),r,h(s,u,0)),e.add(new t.TorusGeometry(u-.035,.012,4,26),m,h(s,u,0));for(let o=0;o<7;o++){const i=o/7*Math.PI;e.tube([s+Math.cos(i)*(u-.04),u+Math.sin(i)*(u-.04),0],[s-Math.cos(i)*(u-.04),u-Math.sin(i)*(u-.04),0],.006,.006,m,3)}e.add(new t.CylinderGeometry(.03,.03,.1,6),m,h(s,u,0,Math.PI/2,0,0)),e.add(new t.TorusGeometry(u+.05,.022,4,12,Math.PI*.8),n,h(s,u,0,0,0,Math.PI*.15))};A(-.52),A(.6);const C=[-.52,u,0],v=[-.06,.29,0],c=[-.2,.86,0],w=[.4,.9,0],M=[.45,.7,0],R=[.6,u,0];for(const[s,o,i]of[[v,c,.022],[c,w,.02],[v,M,.024],[w,M,.026]])e.tube(s,o,i,i,n,6);for(const s of[-.05,.05])e.tube([C[0],C[1],s],[v[0],v[1],s*.5],.013,.013,n,4),e.tube([C[0],C[1],s],[c[0],c[1]-.06,s*.4],.012,.012,n,4),e.tube([M[0],M[1],s*.6],[R[0],R[1],s],.014,.012,n,4);e.tube(c,[-.23,.98,0],.016,.016,m,5),e.box(.26,.05,.13,b,h(-.25,1,0,0,0,.05),0,.02),e.tube(w,[.38,1.06,0],.016,.016,m,5),e.tube([.38,1.06,-.26],[.38,1.06,.26],.014,.014,m,5);for(const s of[-.26,.26])e.tube([.38,1.06,s],[.26,1.08,s*1.12],.018,.018,b,5);return e.add(new t.CylinderGeometry(.09,.09,.012,14),m,h(v[0],v[1],.045,Math.PI/2,0,0)),e.tube([v[0],v[1],.07],[v[0]+.12,v[1]-.12,.07],.01,.01,m,4),e.tube([v[0],v[1],-.07],[v[0]-.12,v[1]+.12,-.07],.01,.01,m,4),e.box(.09,.02,.07,r,h(v[0]+.12,v[1]-.12,.11)),e.box(.09,.02,.07,r,h(v[0]-.12,v[1]+.12,-.11)),e.box(.3,.2,.34,g,h(.62,.92,0),0,.03),e.box(.26,.04,.3,p(a[6],.5),h(.62,1.03,0)),e.add(new t.SphereGeometry(.035,6,5),new t.Color(1,.85,.6),h(.5,.82,0),4),e}function se(d,a){const e=q(d),n=new t.Color(.8,.8,.8);e.box(.46,.05,.46,n,h(0,.47,0),0,.02);for(const[r,m]of[[-1,1],[1,1]])e.tube([r*.19,.46,m*.19],[r*.22,0,m*.23],.028,.018,n,6);for(const r of[-1,1])e.tube([r*.2,1.02,-.27],[r*.21,0,-.25],.022,.02,n,6),e.tube([r*.21,.2,-.24],[r*.21,.2,.22],.012,.012,n,4);e.tube([-.21,.24,.22],[.21,.24,.22],.012,.012,n,4),e.box(.48,.1,.04,n,h(0,.99,-.275,-.08,0,0),0,.015);for(const r of[.68,.82])e.box(.4,.05,.02,n,h(0,r,-.265,-.05,0,0));return e}async function ie(d,a,e,n){const r=q(d),m=p(a[3],.95),g=p(a[3],1.25,"#e9cf8f",.4),b=p("#6a1722",.85),u=p(a[0],.8),A=p(a[2],.8),C=28,v=e.ropeR,c=d.int(0,C-1),w=[[0,0],[.3,0],[.32,.04],[.2,.09],[.07,.14],[.055,.5],[.05,1.02],[.085,1.06],[.085,1.1],[.05,1.13],[.1,1.2],[.12,1.28],[.08,1.36],[0,1.38]].map(s=>new t.Vector2(s[0],s[1])),M=new t.LatheGeometry(w,10);for(let s=0;s<C;s++){const o=s/C*I+.11,i=Math.cos(o)*v,f=Math.sin(o)*v;if(r.add(M.clone(),(L,k)=>k>1.15?g:m,h(i,0,f,0,d()*6,0,1.25)),s===c)continue;const x=(s+1)/C*I+.11,z=[];for(let L=0;L<=8;L++){const k=L/8,G=v0(o,x,k);z.push(new t.Vector3(Math.cos(G)*v,1.36-.42*(1-Math.pow(2*k-1,2)),Math.sin(G)*v))}r.add(new t.TubeGeometry(new t.CatmullRomCurve3(z),10,.075,6),b),(s&3)===3&&await n.yield()}{const s=c/C*I+.11,o=[];for(let i=0;i<=8;i++){const f=i/8;o.push(new t.Vector3(Math.cos(s)*v+Math.cos(s+1.2)*f*5+Math.sin(f*7)*.5,Math.max(.08,1.36-f*4),Math.sin(s)*v+Math.sin(s+1.2)*f*5+Math.cos(f*5)*.5))}r.add(new t.TubeGeometry(new t.CatmullRomCurve3(o),14,.075,6),b)}const R=h(7,0,v+5,0,-.15,0);if(r.add(new t.LatheGeometry([[0,0],[.75,0],[.75,.12],[.62,.2],[.55,.3],[.55,1.25],[.62,1.33],[.7,1.4],[.7,1.5],[0,1.5]].map(s=>new t.Vector2(s[0],s[1])),4),(s,o,i)=>Math.sin(s*9+o*5+i*7)>.92?A:u,R.clone().multiply(h(0,0,0,0,Math.PI/4,0,1.3))),r.box(1.5,.06,1,g,R.clone().multiply(h(0,2.02,.1,.5,0,0)),.15,.02),r.box(1.62,.05,1.12,m,R.clone().multiply(h(0,2,.1,.5,0,0)),0,.02),e.curb){const s=e.floorR,o=[[s,-.5],[s,.02],[s+.5,.02],[s+.5,.5],[s+.9,.62],[s+1.1,.95],[s+1.1,1.5],[s+1.5,1.7],[s+1.5,2],[s+3.5,2],[s+3.5,-.5]].map(i=>new t.Vector2(i[0],i[1]));r.add(new t.LatheGeometry(o,96),(i,f,x)=>{const z=Math.atan2(x,i)*40;return Math.sin(z+f*3)*Math.sin(z*.37+2)>.8?A:u},null,0,0)}return r}const V0=(d,a,e)=>new t.Vector3(d,a,e);function ce(d,a,e,n=.07){const r=q(d),m=p("#a8322a",.85),g=p(a[0],.85),b=p(a[6],.5,"#8a6a3e",.6),u=p(a[3],1),A=p(a[0],.55),C=[];for(let c=0;c<=14;c++){const w=c/14,M=w*Math.PI*.86;C.push(new t.Vector2(3*Math.sin(M)*(w<.5?1:v0(1,.62,(w-.5)*2)),3.2*Math.cos(M)-(w>.5?(w-.5)*3:0)))}C.reverse();const v=new t.LatheGeometry(C,24).toNonIndexed();v.computeVertexNormals();{const c=v.attributes.position,w=[];for(let o=0;o<c.count;o+=3){const i=(c.getX(o)+c.getX(o+1)+c.getX(o+2))/3,f=(c.getZ(o)+c.getZ(o+1)+c.getZ(o+2))/3,x=(c.getY(o)+c.getY(o+1)+c.getY(o+2))/3,z=Math.floor((Math.atan2(f,i)+Math.PI)/I*12+(x>2.2||x<-1&&x>-1.8?.5:0))%2;w.push(z)}let M=0;const R=e+5.2;r.add(v,(o,i,f)=>w[Math.floor(M++/3)]?m:g,h(0,R,0),0,0),r.add(new t.TorusGeometry(.8,.07,5,16),u,h(0,R-4.4,0,Math.PI/2,0,0)),r.add(new t.SphereGeometry(.16,8,6),new t.Color(1,.7,.35),h(0,R-4.2,0),5);const s=R-6.6;r.box(1.3,1,1.3,b,h(0,s,0),0,.12),r.add(new t.TorusGeometry(.72,.07,5,16),p("#5a3a24",.8),h(0,s+.5,0,Math.PI/2,0,Math.PI/4));for(const[o,i]of[[-1,-1],[1,-1],[-1,1],[1,1]])r.tube([o*.6,s+.5,i*.6],[o*.56,R-4.4,i*.56],.03,.03,A,4);r.tube([0,.1,0],[0,s-.5,0],n,n,A,5),r.add(new t.CylinderGeometry(.5,.62,.5,10),u,h(0,.25,0)),r.add(new t.TorusGeometry(.2,.05,5,10),u,h(0,.6,0)),r.tube([.4,s+.6,.2],[10.5,s+2.6,.2],.06,.045,p("#8a6a3e",.7),5),r.box(.5,1.5,.5,u,h(10.7,s+2.65,.2,0,0,-1.37),0,.08);for(let o=0;o<16;o++){const i=o/16*I;r.tube([11.3,s+2.76,.2],[12.5+d()*.3,s+3+Math.sin(i)*.6,.2+Math.cos(i)*.6],.07,.02,g,4)}for(let o=0;o<4;o++)r.box(.3,.45,.03,o%2?m:g,h(-.5+o*.33,s-.75,.66,0,0,(d()-.5)*.3))}return r}function ue(d,a){return new t.ShaderMaterial({uniforms:Object.assign(t.UniformsUtils.merge([t.UniformsLib.fog]),d,{uFloorCol:{value:p(a.P[4],.55)},uBrass:{value:p(a.P[3],.9)},uMarble:{value:p(a.P[0],.62)},uRoom:{value:new t.Vector4(a.room?a.room.radius:0,a.room?a.room.spring:0,a.room?a.room.top:0,a.room?a.room.oculus:0)},uRings:{value:new t.Vector3(a.ropeR+6,a.ropeR+8.5,a.floorR)}}),fog:!0,vertexShader:`
      uniform mat4 uInvModel;
      varying vec3 vLocal; varying vec3 vRo;
      #include <fog_pars_vertex>
      void main() {
        vLocal = position; vRo = (uInvModel * vec4(cameraPosition, 1.0)).xyz;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${b0}
      uniform vec3 uFloorCol, uBrass, uMarble, uLight, uColA, uColB, uColSky, uColAmb, uColKey, uRoomLit, uOcu;
      uniform vec4 uRoom; uniform vec3 uRings; uniform float uSigma, uSelfLit;
      varying vec3 vLocal; varying vec3 vRo;
      #include <fog_pars_fragment>
      vec3 roomEnv(vec3 p, vec3 rd) {
        if (uRoom.x < 1.0) return uColSky * (0.25 + 0.5 * rd.y);
        float RR = uRoom.x, ys = uRoom.y, yt = uRoom.z;
        // oculus disc in the plane y = top
        float tt = (yt - p.y) / max(rd.y, 1e-3); vec2 hp = p.xz + rd.xz * tt; float rho = length(hp);
        float oc = 1.0 - smoothstep(uRoom.w - 1.2, uRoom.w + 0.4, rho);
        // wall cylinder
        float b = dot(p.xz, rd.xz), a2 = max(dot(rd.xz, rd.xz), 1e-5), c = dot(p.xz, p.xz) - RR * RR;
        float tw = (-b + sqrt(max(b * b - a2 * c, 0.0))) / a2; vec3 wp = p + rd * tw;
        vec3 col;
        if (wp.y < ys) {                                    // drum: pilasters, bays, brass cornice line
          float az = atan(wp.z, wp.x) * 16.0 / 3.14159;      // 32 bays
          float pil = smoothstep(0.38, 0.44, abs(fract(az) - 0.5));
          float hgt = wp.y / ys;
          col = uMarble * mix(0.30, 0.36, pil) * (0.45 + 0.55 * hgt);
          col *= 1.0 - 0.12 * (1.0 - pil) * smoothstep(0.06, 0.1, hgt) * (1.0 - smoothstep(0.62, 0.7, hgt));   // arched bays in shade
          col += uBrass * 1.6 * (1.0 - smoothstep(0.004, 0.012, abs(hgt - 0.24)));                              // tram rail
          col = mix(col, uMarble * 0.8, 1.0 - smoothstep(0.0, 0.03, abs(hgt - 0.97)));
        } else {                                            // dome: coffers shrinking to the oculus
          float k = clamp((rho - uRoom.w) / max(RR - uRoom.w, 1.0), 0.0, 1.0);    // 0 at oculus rim, 1 at springing
          float az = atan(hp.y, hp.x) * 16.0 / 3.14159; float rg = pow(k, 0.7) * 6.0;
          vec2 cf = abs(fract(vec2(az, rg)) - 0.5);
          float cof = smoothstep(0.30, 0.36, max(cf.x, cf.y));
          col = uMarble * mix(0.40, 0.56, cof) * mix(1.1, 0.6, k);
          col += uBrass * 0.5 * (1.0 - smoothstep(0.0, 0.03, k));
        }
        return mix(col * uRoomLit, uOcu, oc);
      }
      void main() {
        vec3 V = normalize(vLocal - vRo); vec3 R = vec3(V.x, abs(V.y), V.z);
        float r = length(vLocal.xz), az = atan(vLocal.z, vLocal.x);
        // inlays
        float aw = fwidth(r) * 1.2 + 0.02;
        float ring = (1.0 - smoothstep(0.16, 0.16 + aw, abs(r - uRings.x))) + (1.0 - smoothstep(0.16, 0.16 + aw, abs(r - uRings.y)));
        float ta = az * 36.0 / 3.14159; float tw = fwidth(ta) * 1.2;
        float major = step(abs(fract(ta / 9.0 + 0.5) - 0.5), 0.5 / 9.0);
        float tick = (1.0 - smoothstep(mix(0.045, 0.11, major), mix(0.045, 0.11, major) + tw, abs(fract(ta + 0.5) - 0.5))) * step(mix(uRings.x + 0.9, uRings.x, major), r) * step(r, uRings.y);
        float joint = (1.0 - smoothstep(0.0, aw * 0.6 + 0.03, abs(fract(r / 11.0) - 0.5) * 11.0 - 5.45)) * step(uRings.y + 2.0, r);
        float inlay = clamp(ring + tick, 0.0, 1.0);
        // marble body: faint veins
        float vn = nz(vec3(vLocal.xz * 0.0031, 0.37)) + 0.5 * nz(vec3(vLocal.zx * 0.0074, 0.71));
        float vein = 1.0 - smoothstep(0.0, 0.035, abs(vn - 0.78));
        vec3 base = uFloorCol * (0.5 + 0.3 * nz(vec3(vLocal.xz * 0.0011, 0.11))) + vec3(0.014, 0.016, 0.019) * vein;
        base = mix(base, uFloorCol * 0.25, joint * 0.7);
        base += uColA * 0.9 * uSelfLit * exp(-r * r / 700.0);            // the dust's amber light pooled on the floor
        base = mix(base, uBrass * (0.22 + 0.5 * max(uLight.y, 0.0)) * (uRoomLit + uColA * uSelfLit * 2.0 * exp(-r * r / 2600.0)), inlay);
        // reflection: march the dust along the mirrored ray
        vec3 col = vec3(0.0); float T = 1.0;
        float bq = dot(vLocal.xz, R.xz), aq = max(dot(R.xz, R.xz), 1e-5), cq = r * r - 46.0 * 46.0, disc = bq * bq - aq * cq;
        if (disc > 0.0) {
          float sq = sqrt(disc), t0 = max((-bq - sq) / aq, 0.0), t1 = (-bq + sq) / aq;
          t1 = min(t1, (TH * 1.1) / max(R.y, 1e-3));
          float jit = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
          float t = t0 + jit * 2.0;
          for (int i = 0; i < 18; i++) {                         // a mirror image: half the funnel's own step count, longer steps, dithered start
            if (t > t1 || T < 0.03) break;
            vec3 p = vLocal + R * t; float h = p.y / TH, th = tTh(h);
            float ds = (0.8 * th + 0.4) * 1.67;
            float dn = tDens(p, 2);
            if (dn > 0.004) {
              float sh = tDens(p + uLight * (1.5 + 2.0 * th), 1);
              float lit = exp(-sh * 2.4);
              vec3 alb = mix(uColA, uColB, clamp(h * 1.1, 0.0, 1.0));
              vec3 c = alb * (uColAmb * (0.4 + 0.6 * h) + uColKey * lit) + uColSky * 0.42 * smoothstep(0.7, 1.06, h) * (0.3 + 0.7 * lit);
              float a = 1.0 - exp(-dn * uSigma * ds);
              col += T * a * c; T *= 1.0 - a;
            }
            t += ds;
          }
        }
        col += T * roomEnv(vLocal, R);
        float cosv = clamp(R.y, 0.0, 1.0);
        float F0 = mix(0.3, 0.6, inlay);
        float F = F0 + (1.0 - F0) * pow(1.0 - cosv, 5.0);
        vec3 refl = col * mix(vec3(1.0), uBrass * 1.6, inlay);
        gl_FragColor = vec4(base + refl * F, 1.0);
        #include <fog_fragment>
      }`})}function fe(d,a){return new t.ShaderMaterial({uniforms:Object.assign(t.UniformsUtils.merge([t.UniformsLib.fog]),d,{uInside:{value:0}}),defines:{STEPS:a,STEPK:(56/Math.max(a,8)).toFixed(3)},fog:!0,transparent:!0,depthWrite:!1,side:t.DoubleSide,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,blendSrcAlpha:t.OneFactor,blendDstAlpha:t.OneMinusSrcAlphaFactor,vertexShader:`
      uniform mat4 uInvModel;
      varying vec3 vLocal; varying vec3 vRo;
      #include <fog_pars_vertex>
      void main() {
        vLocal = position; vRo = (uInvModel * vec4(cameraPosition, 1.0)).xyz;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${b0}
      uniform vec3 uLight, uColA, uColB, uColSky, uColAmb, uColKey;
      uniform float uSigma, uInside, uSelfLit;
      varying vec3 vLocal; varying vec3 vRo;
      #include <fog_pars_fragment>
      void main() {
        if (!gl_FrontFacing && uInside < 0.5) discard;
        vec3 rd = normalize(vLocal - vRo);
        float t = gl_FrontFacing ? length(vLocal - vRo) : 0.0;
        float jit = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
        vec3 col = vec3(0.0); float T = 1.0;
        t += jit * 0.9 * STEPK;
        for (int i = 0; i < STEPS; i++) {
          vec3 p = vRo + rd * t; float h = p.y / TH;
          if (p.y < -0.3 || h > 1.11) break;
          vec2 d = p.xz - tAxis(p.y); float r = length(d);
          float Rw = tRw(h), th = tTh(h), fo = Rw + 3.2 * th;
          float outer = max(fo, p.y < 14.0 ? 27.0 : 0.0);
          if (r > outer + 1.6 && dot(d, rd.xz) > 0.0) break;
          float ds = (r > fo ? 1.5 : 0.5 * th + 0.25) * STEPK;
          float dn = tDens(p, 3);
          if (dn > 0.004) {
            float sh = tDens(p + uLight * (1.5 + 2.0 * th), 2);
            float lit = exp(-sh * 4.0);
            float hc = clamp(h, 0.0, 1.0);
            float edge = 1.0 - smoothstep(0.0, 0.5, dn);                      // thin wisps scatter more light
            vec3 alb = mix(uColA, uColB, clamp(hc * 1.1 + edge * 0.15, 0.0, 1.0));
            vec3 c = alb * (uColAmb * (0.4 + 0.6 * hc) + uColKey * lit * (0.85 + 0.5 * edge));
            c += uColA * uSelfLit * (1.0 - hc) * (1.0 + (uSelfLit - 0.1) * 6.0 * exp(-hc * 7.0));   // the dust's own amber light, strongest at the foot
            c += uColSky * 0.42 * smoothstep(0.7, 1.06, h) * (0.3 + 0.7 * lit);   // daylight from the oculus
            float a = 1.0 - exp(-dn * uSigma * ds);
            col += T * a * c; T *= 1.0 - a;
            if (T < 0.02) break;
          }
          t += ds;
        }
        float alpha = 1.0 - T;
        if (alpha < 0.003) discard;
        gl_FragColor = vec4(col / alpha, alpha);
        #include <fog_fragment>
        gl_FragColor.rgb *= gl_FragColor.a;
      }`})}function E0(d,a,e){return new t.ShaderMaterial({uniforms:Object.assign(t.UniformsUtils.merge([t.UniformsLib.fog]),d,{uFrontPass:{value:a?1:0},uLeafA:{value:p(e[6],.95)},uLeafB:{value:p("#a8482a",.8)},uLeafC:{value:p("#e2c24a",.85)},uPage:{value:p(e[0],.8)}}),fog:!0,side:t.DoubleSide,transparent:!!a,depthWrite:!0,vertexShader:`
      ${b0}
      attribute vec4 aA, aB;
      uniform mat4 uInvModel;
      uniform float uFlow, uFlutter, uGust, uTurns, uFrontPass, uDrift;
      varying vec2 vUv; varying vec3 vN; varying vec4 vInfo;
      #include <fog_pars_vertex>
      float hullR(float h) { float hh = clamp(h, 0.0, 1.0); return tRw(hh) + 2.4 * tTh(hh); }
      void main() {
        float type = aB.x, kind = aB.w, rnd = aA.w; float sc = aB.y; vec3 c; float y, th, rr;
        if (kind < 0.5) {                                   // the gust: in at the door, round and up, out through the oculus
          float s = fract(aA.x + uFlow * 0.034 * (0.85 + 0.3 * rnd));
          float k = smoothstep(0.0, 0.2, s);
          y = 13.0 + 3.0 * sin(s * 40.0 + rnd * 6.0) * (1.0 - k) + 188.0 * pow(max(s - 0.1, 0.0) / 0.9, 1.3);
          float h = y / TH;
          float rH = (hullR(h) + 1.0 + aA.y * 3.5) * (1.0 - 0.85 * smoothstep(1.0, 1.32, h));
          rr = mix(98.0 + aA.y * 8.0, rH, k);
          th = 1.5708 + (aA.z - 0.5) * 0.16 * (1.0 + 3.0 * k) + uTurns * 6.2832 * pow(s, 0.85);
          y += (aA.z - 0.5) * (1.5 + 3.0 * k);
          sc *= smoothstep(0.0, 0.03, s) * (1.0 - smoothstep(0.92, 1.0, s)) * (1.0 - smoothstep(uGust - 0.04, uGust, s));
          c = vec3(cos(th) * rr, y, sin(th) * rr); c.xz += tAxis(y) * k;
        } else if (kind < 1.5) {                            // loose things circling the funnel
          y = mod(aA.z * TH * 1.04 + uFlow * 2.6 * (0.4 + rnd), TH * 1.04); float h = y / TH;
          rr = hullR(h) + 0.5 + aA.y * aA.y * 24.0;
          th = aA.x * 6.2832 + uPhase * (0.22 + 0.5 / (1.0 + aA.y * 4.0));
          sc *= smoothstep(0.0, 4.0, y) * (1.0 - smoothstep(TH * 0.94, TH * 1.04, y));
          c = vec3(cos(th) * rr, y, sin(th) * rr); c.xz += tAxis(y);
        } else {                                            // the long drift of pages
          float u = aA.x;
          y = mix(20.0, 82.0, u) + (aA.z - 0.5) * 5.0 + 1.5 * sin(u * 23.0 + uPhase * 0.4); float h = y / TH;
          rr = hullR(h) + 4.5 + aA.y * 5.5;
          th = uDrift + u * 5.4 + uPhase * 0.3;
          c = vec3(cos(th) * rr, y, sin(th) * rr); c.xz += tAxis(y);
        }
        vec3 ro = (uInvModel * vec4(cameraPosition, 1.0)).xyz;
        if (uFrontPass > 0.5) { vec2 ax = tAxis(c.y); if (dot(c.xz - ax, ro.xz - ax) < 0.0 || c.y > TH * 1.08) sc = 0.0; }
        // tumble
        vec3 axv = normalize(vec3(sin(rnd * 37.0), cos(rnd * 91.0) * 0.6, sin(rnd * 53.0 + 1.0)));
        float ang = rnd * 40.0 + uFlutter * (1.2 + 3.5 * fract(rnd * 7.3));
        vec2 asp = type < 0.5 ? vec2(1.0, 1.15) : (type < 1.5 ? vec2(0.72, 1.0) : vec2(1.0));
        vec3 v = vec3(position.xy * asp * sc, 0.0), nn = vec3(0.0, 0.0, 1.0);
        float ca = cos(ang), sa = sin(ang);
        v = v * ca + cross(axv, v) * sa + axv * dot(axv, v) * (1.0 - ca);
        nn = nn * ca + cross(axv, nn) * sa + axv * dot(axv, nn) * (1.0 - ca);
        vUv = uv; vN = nn; vInfo = vec4(type, aB.z, rnd, c.y / TH);
        vec4 mvPosition = modelViewMatrix * vec4(c + v, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uLight, uColSky, uColAmb, uColKey, uLeafA, uLeafB, uLeafC, uPage;
      varying vec2 vUv; varying vec3 vN; varying vec4 vInfo;
      #include <fog_pars_fragment>
      void main() {
        vec2 p = vUv * 2.0 - 1.0; float type = vInfo.x; vec3 col; float glow = 0.0;
        if (type < 0.5) {
          float a = atan(p.x, p.y), rad = length(p);
          float lobed = 0.52 + 0.4 * pow(abs(cos(a * 2.5)), 1.5);                         // maple
          float lance = abs(p.x) < 0.52 * pow(max(1.0 - p.y * p.y, 0.0), 0.8) * (1.0 + 0.1 * sin(p.y * 22.0)) ? 2.0 : 0.0;   // beech / oak
          float lim = vInfo.y < 0.4 ? lobed : lance;
          if (rad > lim || (abs(p.x) > 0.05 && p.y < -0.72 && vInfo.y < 0.4)) discard;
          col = vInfo.y < 0.33 ? uLeafA : (vInfo.y < 0.66 ? uLeafB : uLeafC);
          col = mix(col, uLeafA, 0.35 * vInfo.z);
          col *= 0.78 + 0.22 * smoothstep(0.0, 0.08, abs(p.x)) ;                           // midrib
          glow = 0.22;
        } else if (type < 1.5) {
          col = uPage * (0.86 + 0.14 * p.y * sign(vN.y + 0.001));                           // a soft curl
          glow = 0.08;
        } else {
          float rad = length(p); if (rad > 1.0) discard;
          col = vec3(1.0, 0.82, 0.5); glow = 3.0 * (1.0 - rad) * (0.4 + 0.6 * fract(vInfo.z * 13.0));
        }
        float nl = abs(dot(normalize(vN), uLight));
        vec3 lit = col * (uColAmb * (0.55 + 0.45 * vInfo.w) + uColKey * (0.25 + 0.75 * nl)) + col * glow;
        lit += col * uColSky * 0.35 * smoothstep(0.75, 1.1, vInfo.w);
        gl_FragColor = vec4(lit, 1.0);
        #include <fog_fragment>
      }`})}async function pe(d,a={}){const e=d.rng.fork?d.rng.fork("rotunda-tornado"):d.rng,n=(a.palette&&a.palette.length>=7?a.palette:$0).slice(),r=a.floorRadius??90,m=33,g=a.room===!1?null:Object.assign({radius:90,spring:130,top:220,oculus:15},a.room||{}),b=new t.Group;b.name="rotunda-tornado";const u={baseR:e.range(4,5.2),flareR:e.range(20,24),exp:e.range(1.45,2),twist:e.range(.075,.11)},A={amp:e.range(3,6.5),ang:e()*I,turns:e.range(1.2,3.6)},C=e(),v=e.range(2.6,3.6),c=l=>u.baseR+u.flareR*Math.pow(Math.max(l,0),u.exp)+9*Math.pow(e0(.8,1.08,l),2),w=l=>1.2+3.6*_(l,0,1.1),M=l=>{const y=_(l/E,0,1);return c(y)+2.4*w(y)},R=l=>{const y=_(l/E,0,1.1),S=Math.min(y,1);return Math.max(c(y)*1.08+3.2*w(y),l<14?27:0)+A.amp*Math.sin(Math.PI*S)*(.7+.3*S)+1.2},s=new Uint8Array(1024*32);for(let l=0;l<s.length;l++)s[l]=Math.floor(e()*256);const o=new t.Data3DTexture(s,32,32,32);o.format=t.RedFormat,o.type=t.UnsignedByteType,o.minFilter=o.magFilter=t.LinearFilter,o.wrapS=o.wrapT=o.wrapR=t.RepeatWrapping,o.unpackAlignment=1,o.needsUpdate=!0;const i=new t.Vector3(...a.lightDir||[-.38,.86,.34]).normalize(),f={uNoise:{value:o},uPhase:{value:e()*40},uRise:{value:e()*200},uBreath:{value:0},uShape:{value:new t.Vector4(u.baseR,u.flareR,u.exp,u.twist)},uBend:{value:new t.Vector4(A.amp,A.ang,A.turns,0)},uInvModel:{value:new t.Matrix4},uLight:{value:i},uSigma:{value:.6},uColA:{value:p(n[6],.62,"#8f8678",.62-.3*C)},uColB:{value:p(n[0],.74,n[3],.18+.2*C)},uColSky:{value:p("#EEF4FF",1)},uColAmb:{value:new t.Color(.27,.31,.42)},uColKey:{value:new t.Color(1.3,1.14,.9)},uFlow:{value:e()*30},uFlutter:{value:e()*30},uGust:{value:1.05},uTurns:{value:v},uDrift:{value:e()*I}};if(f.uSelfLit={value:.1},f.uRoomLit={value:new t.Color(1,1,1)},f.uOcu={value:new t.Color},a.colors){const l=(y,S)=>{S&&(Array.isArray(S)?y.value.setRGB(S[0],S[1],S[2]):y.value.set(S))};l(f.uColKey,a.colors.key),l(f.uColAmb,a.colors.amb),l(f.uColSky,a.colors.sky),l(f.uRoomLit,a.colors.room),typeof a.colors.self=="number"&&(f.uSelfLit.value=a.colors.self)}f.uOcu.value.copy(f.uColSky.value).multiplyScalar(5),a.colors&&a.colors.oculus&&f.uOcu.value.setRGB(...a.colors.oculus),await d.yield();let x=null;if(a.floor!==!1){const l=new t.CircleGeometry(r,96);l.rotateX(-Math.PI/2),x=new t.Mesh(l,ue(f,{P:n,room:g,ropeR:m,floorR:r})),x.position.y=.02,x.name="mirror-floor",b.add(x)}const z=[new t.Vector2(28.5,0),new t.Vector2(28.5,14)];for(let l=14.01;l<E*1.1;l+=4.5)z.push(new t.Vector2(R(l),l));z.push(new t.Vector2(R(E*1.1),E*1.1),new t.Vector2(0,E*1.1));const L=new t.LatheGeometry(z,40),k=fe(f,a.steps??56),G=new t.Mesh(L,k);G.renderOrder=2,G.name="funnel",G.frustumCulled=!1;const H=new t.Vector3,D0=new t.Matrix4;G.onBeforeRender=(l,y,S)=>{H.setFromMatrixPosition(S.matrixWorld).applyMatrix4(D0.copy(b.matrixWorld).invert()),k.uniforms.uInside.value=H.y>-1&&H.y<E*1.1+1&&Math.hypot(H.x,H.z)<R(Math.max(H.y,0))+1.5?1:0,k.uniformsNeedUpdate=!0},b.add(G),await d.yield();const O=g0(.72),q0=g0(.28),H0=g0(.38);await d.yield();const j0=await ie(e,n,{ropeR:m,floorR:r,curb:a.curb!==!1&&a.floor!==!1},d);await d.yield();const y0=new t.Mesh(j0.build(),H0);y0.name="ropes-and-plaque",b.add(y0),await d.yield();const w0=[],K=(l,y,S,F)=>{const V=Math.min(M(y)+S,47-F*.5),P={mesh:l,r:V,y,th:0,w:_(13/V,.24,.6)*e.range(.85,1.15),bobA:e.range(1,2.6),bobP:e()*I,axis:new t.Vector3(e.gauss(),e.gauss()*1.5,e.gauss()).normalize(),tum:e.range(.25,.6)*e.sign(),tum0:e()*I,yaw0:e()*I,size:F};return w0.push(P),l&&b.add(l),P},X=(l,y,S,F,V,P)=>{const N=l.build();return N.translate(-S,-F,-V),N.scale(y,y,y),N.computeBoundingSphere(),new t.Mesh(N,P)},Y=e.shuffle([0,1,2,3]),Z=e()*I,t0=K(X(ae(e,n),1.3,0,-.3,0,O),e.range(19,26),e.range(8,11),9);t0.th=Z+Y[0]*I/4+e.range(-.3,.3),t0.tum*=.5,await d.yield();const x0=K(X(re(e,n),2,.75,.7,-1.2,q0),e.range(36,47),e.range(7,10),6);x0.th=Z+Y[1]*I/4+e.range(-.3,.3),await d.yield();const Q=K(X(ne(e,n),1.15,0,3.2,0,O),e.range(58,72),e.range(11,14),12);Q.th=Z+Y[2]*I/4+e.range(-.3,.3),Q.tum*=.35,Q.axis.set(e.gauss()*.4,1,e.gauss()*.4).normalize(),await d.yield();const o0=K(X(le(e,n),2.7,0,.6,0,O),e.range(82,100),e.range(6,9),5);o0.th=Z+Y[3]*I/4+e.range(-.3,.3),o0.tum*=1.6,t0.mesh.name="boat",x0.mesh.name="piano",Q.mesh.name="house",o0.mesh.name="bicycle";const $=20,a0=se(e,n).build();a0.translate(0,-.5,0),a0.scale(2.4,2.4,2.4);const j=new t.InstancedMesh(a0,O,$);j.name="chairs",j.frustumCulled=!1;const U0=[p(n[6],.7,"#7a4a26",.6),p(n[0],.95),p(n[3],.95),p("#6a1722",1),p(n[4],2),p(n[6],.9)],N0=e()*I,O0=e.range(.42,.62),M0=[];for(let l=0;l<$;l++){const y=9+122*Math.pow((l+e())/$,1.1),S=K(null,y,e.range(4,11),2);S.th=N0+l*O0+e.range(-.25,.25),S.tum*=2.2,M0.push(S),j.setColorAt(l,e.pick(U0).clone().multiplyScalar(e.range(.85,1.1)))}b.add(j),await d.yield();let B=null;const n0=Math.PI*e.range(1.08,1.3),C0=45,R0=e.range(30,40),A0=a.balloonAt?a.balloonTether??R0:R0,r0=a.balloonAt?a.balloonScale??1:1,l0=a.balloonAt?V0(a.balloonAt[0],0,a.balloonAt[1]):V0(Math.cos(n0)*C0,0,Math.sin(n0)*C0);a.balloon!==!1&&(B=new t.Mesh(ce(e,n,A0,a.balloonAt?.11:.07).build(),O),B.name="caretaker-balloon",B.position.copy(l0),B.rotation.order="YXZ",B.rotation.y=a.balloonAt?a.balloonYaw??0:Math.PI-n0,B.scale.setScalar(r0),B.frustumCulled=!1,b.add(B));const S0=1900,z0=900,T0=520,L0=700,k0=220,s0=S0+z0+T0+L0+k0,F0=new Float32Array(s0*4),I0=new Float32Array(s0*4);let i0=0;const W=(l,y,S,F,V,P,N)=>{F0.set([l,y,S,e()],i0*4),I0.set([F,V,P,N],i0*4),i0++},K0=e.range(.1,.22);for(let l=0;l<S0;l++){const y=e()<K0;W(e(),Math.pow(e(),1.6),_(.5+e.gauss()*.22,0,1),y?1:0,y?e.range(.7,1):e.range(.45,.95),e(),0)}for(let l=0;l<z0;l++){const y=e()<.2;W(e(),e(),e(),y?1:0,y?e.range(.6,.9):e.range(.4,.8),e(),1)}for(let l=0;l<T0;l++)W(Math.pow(e(),.8),Math.abs(e.gauss())*.4,_(.5+e.gauss()*.25,0,1),1,e.range(.7,1.15),e(),2);for(let l=0;l<L0;l++)W(e(),e()*.6,Math.pow(e(),1.7),2,e.range(.1,.24),e(),1);for(let l=0;l<k0;l++)W(e(),e()*.1,Math.pow(e(),1.2),2,e.range(.13,.3),e(),1);const D=new t.InstancedBufferGeometry,c0=new t.PlaneGeometry(1,1);D.index=c0.index,D.setAttribute("position",c0.attributes.position),D.setAttribute("uv",c0.attributes.uv),D.setAttribute("aA",new t.InstancedBufferAttribute(F0,4)),D.setAttribute("aB",new t.InstancedBufferAttribute(I0,4)),D.instanceCount=s0;const u0=new t.Mesh(D,E0(f,!1,n));u0.frustumCulled=!1,u0.name="leaves";const J=new t.Mesh(D,E0(f,!0,n));J.frustumCulled=!1,J.renderOrder=3,J.name="leaves-front",b.add(u0,J),await d.yield();let f0=_(a.progress??1,0,1),h0=null,U=f.uPhase.value;f.uGust.value=_(a.gust??1,0,1)*1.05;const d0=new t.Matrix4,m0=new t.Quaternion,B0=new t.Quaternion,P0=new t.Vector3,W0=new t.Vector3(1,1,1),X0=new t.Vector3(0,1,0),G0=(l,y)=>{const S=l.th+U*l.w,F=l.y+Math.sin(U*.22+l.bobP)*l.bobA;return P0.set(Math.cos(S)*l.r,F,Math.sin(S)*l.r),m0.setFromAxisAngle(X0,l.yaw0-S),B0.setFromAxisAngle(l.axis,l.tum0+U*l.tum),m0.multiply(B0),y.compose(P0,m0,W0)},_0=()=>{for(const l of w0)l.mesh&&(G0(l,d0),l.mesh.matrix.copy(d0),l.mesh.matrixAutoUpdate=!1,l.mesh.matrixWorldNeedsUpdate=!0);for(let l=0;l<$;l++)j.setMatrixAt(l,G0(M0[l],d0));j.instanceMatrix.needsUpdate=!0};_0();const T=(l,y,S)=>new t.Vector3(l,y,S),p0=[T(0,12,120),T(0,12,92)];for(let l=1;l<=7;l++){const y=l/8,S=Math.PI/2+y*Math.PI,F=62+14*Math.pow(Math.abs(2*y-1),3);p0.push(T(Math.cos(S)*F,v0(12,90,e0(.02,.98,y)),Math.sin(S)*F))}return p0.push(T(0,90,-92),T(0,90,-130)),{object:b,radius:40,height:E,center:T(0,62,0),ground:!0,groundY:-.45,anchors:{center:T(0,62,0),funnelTop:T(0,E,0),oculus:T(0,g?g.top:220,0),doorIn:{position:T(0,12,90),direction:T(0,0,-1)},exitDoor:{position:T(0,90,-90),direction:T(0,0,-1)},portalSeat:{position:T(0,90,-90),facing:T(0,0,1)},flyThrough:p0,viewpoints:{reveal:T(0,12,130),orbitLow:T(-52,26,44),orbitHigh:T(-48,84,-44)},leafEntry:{position:T(0,14,98),direction:T(-1,0,-.25).normalize()},balloon:T(l0.x,(A0+3)*r0,l0.z),floorRadius:r,solidRadius:50},hullRadiusAt:R,setProgress(l){f0=_(l,0,1)},setGust(l){f.uGust.value=_(l,0,1)*1.05},update(l,y,S){const F=h0===null?0:y-h0;h0=y;const V=e0(.05,1,f0),P=.02+.98*V*V;U+=F*.8*P,f.uPhase.value=U,f.uRise.value+=F*7.5*P,f.uFlow.value+=F*P,f.uFlutter.value+=F*P,f.uBreath.value=Q0(f0,0,.42,.45),f.uBend.value.w=U*.21,b.updateWorldMatrix(!0,!1),f.uInvModel.value.copy(b.matrixWorld).invert(),_0(),B&&(B.rotation.z=Math.sin(y*.43)*.035,B.rotation.x=Math.sin(y*.31+1.3)*.03,B.scale.y=r0*(1+.004*Math.sin(y*.9)))},dispose(){o.dispose()}}}export{pe as buildHero};
