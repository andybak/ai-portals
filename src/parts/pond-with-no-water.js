import*as e from"three";import{mergeGeometries as ae}from"three/addons/utils/BufferGeometryUtils.js";const le=["#E8EAE3","#0E0D0C","#3A3A38","#85867F","#C3C5BD","#B3261E"];function Ce(s=le){const o={uTime:{value:0},uPaper:{value:new e.Color(le[0])},uBurnt:{value:new e.Color(le[1])},uHeavy:{value:new e.Color(le[2])},uGrey:{value:new e.Color(le[3])},uPale:{value:new e.Color(le[4])},uCinnabar:{value:new e.Color(le[5])},uWet:{value:new e.Vector2(125,300)},uViewH:{value:720},uDry:{value:0}},l=n=>{const h=["uPaper","uBurnt","uHeavy","uGrey","uPale","uCinnabar"];for(let r=0;r<6;r++)n&&n[r]&&o[h[r]].value.set(n[r])};return l(s),{STYLE:o,setPalette:l,shellMaterial:n=>Te(o,n),hullMaterial:n=>je(o,n),lineMaterial:n=>Ue(o,n),dabMaterial:(n,h)=>Qe(o,n,h),makePaperDome:n=>Ye(o,n),leafMaterial:(n,h)=>Ke(o,n,h)}}const se=`
uniform float uTime, uViewH, uDry;
uniform vec3 uPaper, uBurnt, uHeavy, uGrey, uPale, uCinnabar;
uniform vec2 uWet;
float hash31(vec3 p){ p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
float vnoise(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  float a = mix(mix(hash31(i), hash31(i + vec3(1,0,0)), f.x), mix(hash31(i + vec3(0,1,0)), hash31(i + vec3(1,1,0)), f.x), f.y);
  float b = mix(mix(hash31(i + vec3(0,0,1)), hash31(i + vec3(1,0,1)), f.x), mix(hash31(i + vec3(0,1,1)), hash31(i + vec3(1,1,1)), f.x), f.y);
  return mix(a, b, f.z);
}
float fbm3(vec3 p){ return 0.57 * vnoise(p) + 0.29 * vnoise(p * 2.03 + 7.1) + 0.14 * vnoise(p * 4.1 + 3.3); }
float fibre(vec3 p){
  vec3 q = p + 1.7 * vec3(vnoise(p * 0.21), vnoise(p * 0.21 + 9.0), vnoise(p * 0.21 + 4.0));
  return 0.6 * vnoise(q * vec3(5.5, 0.55, 5.5)) + 0.4 * vnoise(vec3(q.x * 0.82 + q.y * 0.57, q.y * 0.82 - q.x * 0.57, q.z + q.x * 0.3) * vec3(7.0, 0.8, 7.0) + 11.0);
}
vec3 paperCol(vec3 dir){
  vec3 d = dir / max(length(dir), 1e-4);
  vec3 w = d * 3.0 + 0.8 * vec3(vnoise(d * 2.3), vnoise(d * 2.3 + 5.0), vnoise(d * 2.3 + 9.0));
  float f = 0.6 * vnoise(w * vec3(34.0, 5.0, 34.0)) + 0.4 * vnoise(w.yzx * vec3(60.0, 9.0, 60.0));
  return uPaper * (0.988 + 0.024 * f);
}
vec3 inkTone(float load){
  load = clamp(load, 0.0, 1.0);
  vec3 c = mix(uPale, uGrey, smoothstep(0.14, 0.24, load));
  c = mix(c, uHeavy, smoothstep(0.46, 0.56, load));
  return mix(c, uBurnt, smoothstep(0.80, 0.90, load));
}
float distLoad(vec3 wp, float n){
  float d = length(wp - cameraPosition) + (n - 0.5) * 60.0;
  return mix(1.0, 0.12, smoothstep(uWet.x, uWet.y, d));
}
`,Pe=`
float fibreF(vec3 p){ float w = length(fwidth(p)) * 4.0; return mix(fibre(p), 0.47, smoothstep(0.35, 1.1, w)); }
`,qe=`
float lineRadius(float r, vec4 mv){ return max(r, 1.1 * abs(mv.z) / max(projectionMatrix[1][1] * uViewH * 0.5, 1e-4) ); }
`,Fe="vec3 deform(vec3 p, vec3 a){ return p; }",_e="vec2 wash(vec3 p, vec3 n, vec2 uv){ return vec2(0.0); }";function Te(s,{wash:o=_e,deform:l=Fe,uniforms:n={},side:h=e.FrontSide}={}){return new e.ShaderMaterial({side:h,uniforms:{...s,uFib:{value:1},uFar:{value:0},uDrag:{value:1},...n},vertexShader:se+`
      attribute vec3 aAnim; varying vec3 vP, vN, vW; varying vec2 vUv;
      ${l}
      void main(){ vec3 p = deform(position, aAnim); vP = position; vN = normal; vUv = uv;
        vec4 w = modelMatrix * vec4(p, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:se+Pe+`
      varying vec3 vP, vN, vW; varying vec2 vUv; uniform float uFib, uFar, uDrag;
      // what a wash() may tell the hand about its sweep (all optional): gQ = the stroke's own coordinates for the streak noise (one unit =
      // about 0.4 m across the hairs, about 9 m along them; set gOwn = 1 with it), gT = 0 where the brush landed .. 1 where it ran out,
      // gE = metres inside the sweep's edge (99: unknown, no rim)
      vec3 gQ = vec3(0.0); float gT = 0.35, gE = 99.0, gOwn = 0.0, gBig = 1.0;   // gBig: how many times larger than a leaf's the sweep is (the rock: its hand shows from further off)
      ${o}
      void main(){
        vec3 n = vN / max(length(vN), 1e-4);
        vec2 k = wash(vP, n, vUv);
        float fb = fibreF(vP * 0.75);
        float pxs = length(fwidth(vP)) / gBig, nearH = (1.0 - smoothstep(0.07, 0.2, pxs)) * uDrag;          // close enough to see the hand (about 40 m)
        // FLYING WHITE: the brush dragged one way and its hairs split: streaks of bare paper 0.1 to 0.4 m wide and metres long ALONG the stroke,
        // more of them toward its end and beside its edge. In the stroke's own coordinates; gone (flat ink) before they are thinner than 2 pixels.
        vec3 sp = mix(vec3(dot(vP, vec3(0.80, 0.30, 0.52)) * 0.11, dot(vP, vec3(-0.30, 0.95, 0.0)) * 2.4, dot(vP, vec3(-0.52, -0.10, 0.80)) * 2.4), gQ, gOwn);
        float spw = length(fwidth(sp));
        float drag = 0.62 * vnoise(sp) + 0.38 * vnoise(sp * vec3(2.2, 2.2, 2.0) + 9.0);
        float edgeN = 1.0 - smoothstep(0.3, 2.6, gE);
        float dthr = mix(0.78, 0.47, clamp(0.85 * gT * gT + 0.3 * edgeN * step(gE, 90.0), 0.0, 1.0)), da = clamp(spw * 0.5, 0.012, 0.2);
        k.x *= 1.0 - nearH * smoothstep(dthr - da, dthr + da, drag) * (1.0 - smoothstep(0.4, 0.9, spw));
        float fleck = step(0.74, fibreF(vP * 1.9 + 5.0)) * step(0.6, vnoise(vP * 0.4 + 2.0)) * (1.0 - smoothstep(0.02, 0.05, pxs * gBig));   // scattered flecks where a fibre resisted (very near only, whatever the sweep's size)
        k.x *= 1.0 - nearH * fleck;
        float load = k.y * max(distLoad(vW, vnoise(vP * 0.013)), uFar) * (1.0 - 0.3 * uDry);                    // dry brush: a load over 1.2 (pupils, the bird) still lands black
        // the tide line: the ink pooled where the wet sweep stopped, a rim 0.3 to 0.6 m wide one step darker than the body beside it, broken
        float rimW = 0.3 + 0.3 * vnoise(vP * 0.35 + 4.0), rimOn = smoothstep(0.34, 0.44, vnoise(vP * 0.13 + 11.0));
        load += 0.34 * (1.0 - smoothstep(rimW - 0.06, rimW + 0.06, gE + 0.25 * (fb - 0.47))) * rimOn * nearH * step(load, 0.95);
        // the paper's fibre shows through the ink as fine lighter threads (one ink step lighter)
        float thread = max(smoothstep(0.605, 0.66, fibreF(vP * 0.55 + 41.0)) * (1.0 - smoothstep(0.05, 0.10, pxs)), smoothstep(0.62, 0.67, fibreF(vP * 1.5 + 7.0)) * (1.0 - smoothstep(0.018, 0.04, pxs)));
        load -= 0.30 * thread * nearH * uFib * step(load, 1.25);
        vec3 ink = inkTone(load) * (1.0 + 0.12 * uFib * (fb - 0.45) * (1.0 - 0.6 * min(load, 1.0)));    // fibres show through the ink
        vec3 col = mix(paperCol(vW - cameraPosition), min(ink, uPaper), clamp(k.x, 0.0, 1.0));
        gl_FragColor = vec4(col, 1.0);
      }`})}function je(s,{width:o=2,load:l=1,gaps:n=.3,gapScale:h=.02,deform:r=Fe,keep:w="",uniforms:x={},floorPx:p=1.1,minLoad:G=0,body:q=.72,gapGLSL:M="float g = fbm3(vP * uGapS + 17.0), G = uGaps;"}={}){return new e.ShaderMaterial({side:e.BackSide,uniforms:{...s,...x,uW:{value:o},uLoad:{value:l},uGaps:{value:n},uGapS:{value:h},uFloorPx:{value:p/1.1},uMinLoad:{value:G},uBody:{value:q}},vertexShader:se+qe+`
      attribute vec3 aAnim; uniform float uW, uFloorPx; varying vec3 vP, vW, vN; varying vec2 vUv;
      ${r}
      void main(){ vec3 p = deform(position, aAnim); vP = position; vN = normal; vUv = uv;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        float wob = 0.75 + 0.5 * vnoise(position * 0.11 + 3.0);
        p += normal * max(uW * 0.5, lineRadius(0.0, mv) * uFloorPx) * 2.0 * wob;
        vec4 w = modelMatrix * vec4(p, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:se+Pe+`
      uniform float uLoad, uGaps, uGapS, uMinLoad, uBody; varying vec3 vP, vW, vN; varying vec2 vUv;
      void main(){
        ${M}                                               // where the brush lifted: the outline does not close
        float open = smoothstep(G - 0.02, G + 0.02, 1.0 - g);
        ${w}
        float fb = fibreF(vP * 0.4);
        float dry = smoothstep(G + 0.02, G + 0.11, 1.0 - g);   // 0 beside a gap (streaked dry) .. 1 mid stroke (pooled)
        float pxs = length(fwidth(vP)), nearH = 1.0 - smoothstep(0.07, 0.2, pxs);
        if (open < 0.5 || fb < (1.0 - dry) * 0.62 + 0.3 * uDry) discard;
        if (nearH * (0.55 * fibreF(vP * 1.7 + 3.0) + 0.45 * vnoise(vP * vec3(2.2, 0.35, 2.2) + 9.0)) > 0.66) discard;   // flecks of paper the hairs skipped
        float load = max(uLoad * (uBody + (1.0 - uBody) * dry) * distLoad(vW, vnoise(vP * 0.013)), uMinLoad);
        vec3 ink = inkTone(load) * (1.0 + 0.45 * (fb - 0.45) * (1.0 - 0.6 * load));
        gl_FragColor = vec4(min(ink, uPaper), 1.0);
      }`})}function Ue(s,{load:o=.72,dryLen:l=12,deform:n=Fe,uniforms:h={}}={}){return new e.ShaderMaterial({uniforms:{...s,uHead:{value:1},uFloor:{value:0},...h,uLoad:{value:o},uDryLen:{value:l}},vertexShader:se+qe+`
      attribute vec3 aAnim; attribute vec4 aStroke; uniform float uHead, uFloor; varying vec4 vS; varying vec3 vP, vW; varying float vA, vF;
      ${n}
      void main(){ vec3 p = deform(position, aAnim); vS = aStroke; vP = position; vA = uv.y;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vec3 nv = normalMatrix * normal, ev = -mv.xyz;                                    // vF: 1 down the middle of the line as seen, 0 at its two edges
        vF = abs(dot(nv, ev)) / max(length(nv) * length(ev), 1e-4);
        float bead = 1.0 + 0.55 * step(uHead, 0.999) * exp(-abs(aStroke.x - uHead * aStroke.y) * 0.5)
                   + 0.2 * exp(-aStroke.x / max(1.3 * aStroke.w, 1e-3));                  // the blob where the loaded brush first touched
        float lr = max(lineRadius(aStroke.w, mv), uFloor * abs(mv.z) / max(projectionMatrix[1][1] * uViewH * 0.5, 1e-4));
        p += normal * (lr * bead - aStroke.w);
        vec4 w = modelMatrix * vec4(p, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:se+Pe+`
      uniform float uLoad, uDryLen, uHead; varying vec4 vS; varying vec3 vP, vW; varying float vA, vF;
      void main(){
        float s = vS.x, len = max(vS.y, 1e-3), rw = max(vS.w, 0.05);
        if (s > uHead * len) discard;
        float dry = smoothstep(len - uDryLen, len, s) * step(0.999, uHead);
        // the brush running dry splits into two or three parallel HAIRS that run on for metres (long along the stroke, keyed to the stroke)
        float streak = vnoise(vec3(s * 0.035 / rw, vA * 7.0, vS.z * 7.0)) * 0.72 + 0.28 * fibreF(vP * 1.2);
        if (streak < dry * 0.8 + 0.25 * uDry - 0.04) discard;
        float pxs = length(fwidth(vP)), nearH = 1.0 - smoothstep(0.05, 0.16, pxs);
        float hair = 0.86 * vnoise(vec3(s * max(0.035 / rw, 2.6 / len), vA * 13.0, vS.z * 3.0 + 5.0)) + 0.14 * fibreF(vP * 2.3 + 2.0);   // each hair starts and stops inside the stroke
        float along = smoothstep(0.25, 0.9, s / len);                                                       // more of them toward the end of the stroke
        if (nearH * hair * smoothstep(0.3, 0.62, vF) > 0.675 - 0.055 * along) discard;                                                    // flying white: streaks of bare paper inside the stroke
        float pool = exp(-s / max(1.6 * vS.w, 1e-3)) + step(uHead, 0.999) * exp(-abs(s - uHead * len) * 0.4);
        // the ink settled: a faint darker edge either side of a slightly lighter core (near only; far the line is one tone)
        float rim = (1.0 - smoothstep(0.30, 0.52, vF)) * 0.12 - smoothstep(0.55, 0.9, vF) * 0.05 * step(hair, 0.5);
        float load = (uLoad + 0.3 * pool - 0.25 * dry + rim * nearH * (1.0 - dry)) * distLoad(vW, vnoise(vP * 0.013));
        float fb = fibreF(vP * 1.3);
        vec3 ink = inkTone(load) * (1.0 + 0.45 * (fb - 0.45) * (1.0 - 0.6 * clamp(load, 0.0, 1.0)));
        gl_FragColor = vec4(min(ink, uPaper), 1.0);
      }`})}function Qe(s,o=1,l={}){return Te(s,{...l,uniforms:{uDrag:{value:l.drag??0},...l.uniforms||{}},side:e.DoubleSide,wash:`vec2 wash(vec3 p, vec3 n, vec2 uv){ return vec2(1.0, ${o.toFixed(3)}); }`})}function Ye(s,o=3e3){const l=new e.Mesh(new e.SphereGeometry(o,40,24),new e.ShaderMaterial({side:e.BackSide,depthWrite:!1,depthTest:!1,uniforms:{...s},vertexShader:"varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:se+"varying vec3 vD; void main(){ gl_FragColor = vec4(paperCol(vD), 1.0); }"}));return l.renderOrder=-10,l.frustumCulled=!1,l}const fe=new e.Vector3,tt=new e.Vector3,ze=new e.Vector3,Ve=new e.Vector3;function he(s,o,l={}){const n=l.radial??6,h=l.seed??0;let r=s;if(!l.raw){const f=new e.CatmullRomCurve3(s,!1,"centripetal"),u=Math.max(2,Math.ceil(f.getLength()/(l.step??o*2.5)));r=f.getSpacedPoints(u)}const w=r.length,x=w+4,p=new Float32Array(x*(n+1)*3),G=new Float32Array(p.length),q=new Float32Array(x*(n+1)*4),M=new Float32Array(x*(n+1)*2),T=l.anim?new Float32Array(p.length):null;let W=0;const P=[0];for(let f=1;f<w;f++)W+=r[f].distanceTo(r[f-1]),P.push(W);const F=new e.Vector3(0,1,.31).normalize(),k=new e.Vector3;let b=0;for(let f=0;f<x;f++){const u=Math.min(w-1,Math.max(0,f-2));Ve.copy(r[Math.min(w-1,u+1)]).sub(r[Math.max(0,u-1)]).normalize(),k.crossVectors(Ve,F),k.lengthSq()<1e-6&&k.set(1,0,0),k.normalize(),F.crossVectors(k,Ve).normalize();const d=f<2?f:f>=x-2?x-1-f:2,a=o*(l.width?l.width(P[u]/Math.max(W,.001)):1)*(d===0?.02:d===1?.72:1),v=o*(d===0?.42:d===1?.3:0)*(f<2?-1:1);ze.copy(r[u]).addScaledVector(Ve,v);for(let g=0;g<=n;g++,b++){const m=g/n*Math.PI*2;if(fe.copy(F).multiplyScalar(Math.cos(m)).addScaledVector(k,Math.sin(m)),p[b*3]=ze.x+fe.x*a,p[b*3+1]=ze.y+fe.y*a,p[b*3+2]=ze.z+fe.z*a,G[b*3]=fe.x,G[b*3+1]=fe.y,G[b*3+2]=fe.z,q[b*4]=P[u],q[b*4+1]=W,q[b*4+2]=h,q[b*4+3]=a,M[b*2]=P[u]/Math.max(W,.001),M[b*2+1]=g/n,T){const V=l.anim(r[u],P[u]/Math.max(W,.001));T[b*3]=V[0],T[b*3+1]=V[1],T[b*3+2]=V[2]}}}const t=[];for(let f=0;f<x-1;f++)for(let u=0;u<n;u++){const d=f*(n+1)+u,a=d+n+1;t.push(d,d+1,a,d+1,a+1,a)}const A=new e.BufferGeometry;return A.setAttribute("position",new e.BufferAttribute(p,3)),A.setAttribute("normal",new e.BufferAttribute(G,3)),A.setAttribute("uv",new e.BufferAttribute(M,2)),A.setAttribute("aStroke",new e.BufferAttribute(q,4)),T&&A.setAttribute("aAnim",new e.BufferAttribute(T,3)),A.setIndex(t),A}function ke(s,o=1,l=18,n=.5,h=1){const r=[0,0,.06*o],w=[],x=s()*6.28,p=2+n*3,G=1+(s()-.5)*.5*h;for(let M=0;M<l;M++){const T=M/l*Math.PI*2,W=Math.cos(T),P=Math.sin(T),F=Math.pow(Math.pow(Math.abs(W),p)+Math.pow(Math.abs(P),p),-1/p),k=o*F*(.86+h*(.16*Math.sin(T*2+x)+.1*Math.sin(T*5+x*2.3))+.08*h*(s()-.5));r.push(W*k*G,P*k,0),w.push(0,1+M,1+(M+1)%l)}const q=new e.BufferGeometry;return q.setAttribute("position",new e.Float32BufferAttribute(r,3)),q.setIndex(w),q.computeVertexNormals(),q.setAttribute("uv",new e.Float32BufferAttribute(new Float32Array((l+1)*2),2)),q}const Ne=(s,o)=>Math.exp(-(s*s)/(2*o*o)),ye=(s,o)=>{let l=s-o;for(;l>Math.PI;)l-=2*Math.PI;for(;l<-Math.PI;)l+=2*Math.PI;return l};function Se(s,o,l,n,h){const r=h*h,w=r*h;return .5*(2*o+(-s+l)*h+(2*s-5*o+4*l-n)*r+(-s+3*o-3*l+n)*w)}async function $e(s,o,l,n){const h=s.noise,r=Math.round(160*(.6+.4*l)),w=Math.round(128*(.6+.4*l)),x=new e.Vector2(-15+o.range(-4,4),5+o.range(-4,4)),p=Math.atan2(-42-x.y,-36-x.x),G=Math.atan2(66-x.y,-34-x.x),q=47+o.range(-3,3),M=24+o.range(-3,5),T=19,W=20+o.range(-4,6),P=o()*100,F=1+(n.twoLumps?.5:0),k=n.twoLumps?.62:1,b=i=>{const y=q+M*Ne(ye(i,p),.8)+T*Ne(ye(i,G),.55)+7*h.n2(Math.cos(i)*1.3+P,Math.sin(i)*1.3),z=W*Ne(ye(i,p),.9)+5*h.n2(Math.cos(i)*2+9,Math.sin(i)*2+P);return[[0,0],[6.2,.4],[5.8,7],[6.4,26],[8.5,50],[12.5,72],[20,90],[y*.5,106-z*.45],[y*.86,119-z],[y,146-z*.4],[y*k,165],[y*.98,180],[y*.86,191],[y*.6,198],[y*.3,201],[0,202]]},t=r+1,A=new Float32Array(t*(w+1)*3),f=new Float32Array(t*(w+1)*2);for(let i=0;i<=r;i++){const y=i%r/r*Math.PI*2,z=b(y),N=Math.cos(y),L=Math.sin(y),Q=z.length-1;for(let D=0;D<=w;D++){const C=Math.pow(D/w,.9)*Q,_=Math.min(Q-1,Math.floor(C)),K=C-_,j=re=>z[Math.max(0,Math.min(Q,re))];let Y=Math.max(0,Se(j(_-1)[0],j(_)[0],j(_+1)[0],j(_+2)[0],K)),I=Se(j(_-1)[1],j(_)[1],j(_+1)[1],j(_+2)[1],K);(D===0||D===w)&&(Y=0);const ee=s.core.smoothstep(30,150,I),E=x.x*ee,R=x.y*ee;let $=E+N*Y,X=R+L*Y;const Ae=s.core.smoothstep(60,115,I),ce=(h.fbm3($*.013+P,I*.013,X*.013,3)*7.5*F+h.fbm3($*.05,I*.05+P,X*.05,2)*1.5)*(.12+.88*Ae),pe=Math.max(105,Math.min(175,I)),ge=$-E,xe=X-R,oe=Math.hypot(ge,I-pe,xe)||1;$+=ge/oe*ce,I+=(I-pe)/oe*ce*(D===0?0:1),X+=xe/oe*ce;const ue=Math.hypot($+34,X-66);I+=36*Ne(ue,18)*s.core.smoothstep(150,190,I);for(let re=0;re<n.keepOut.length-1;re++){const U=n.keepOut[re],me=n.keepOut[re+1],ne=me[0]-U[0],ie=me[1]-U[1],te=me[2]-U[2],c=Math.max(0,Math.min(1,(($-U[0])*ne+(I-U[1])*ie+(X-U[2])*te)/(ne*ne+ie*ie+te*te))),S=$-U[0]-ne*c,B=I-U[1]-ie*c,O=X-U[2]-te*c,Z=Math.hypot(S,B,O);if(Z<n.clear&&Z>.001){const J=n.clear/Z-1;$+=S*J,I+=B*J,X+=O*J}}const Me=(D*t+i)*3;A[Me]=$,A[Me+1]=I,A[Me+2]=X,f[(D*t+i)*2]=i/r,f[(D*t+i)*2+1]=D/w}await s.yield()}for(let i=0;i<=w;i++)for(let y=0;y<3;y++)A[(i*t+r)*3+y]=A[i*t*3+y];const u=new Uint32Array(r*w*6);let d=0;for(let i=0;i<w;i++)for(let y=0;y<r;y++){const z=i*t+y,N=z+t;u[d++]=z,u[d++]=N,u[d++]=z+1,u[d++]=z+1,u[d++]=N,u[d++]=N+1}const a=new e.BufferGeometry;a.setAttribute("position",new e.BufferAttribute(A,3)),a.setAttribute("uv",new e.BufferAttribute(f,2)),a.setIndex(new e.BufferAttribute(u,1)),await s.yield(),a.computeVertexNormals();const v=a.attributes.normal.array;for(let i=0;i<=w;i++){const y=i*t*3,z=(i*t+r)*3;for(let N=0;N<3;N++){const L=(v[y+N]+v[z+N])*.5;v[y+N]=L,v[z+N]=L}}for(let i=0;i<=r;i++)v.set([0,-1,0],i*3),v.set([0,1,0],(w*t+i)*3);await s.yield();const g=(i,y)=>{const z=Math.round((y/(Math.PI*2)%1+1)%1*r)%r,N=Math.max(0,Math.min(w,Math.round(i*w))),L=(N*t+z)*3;return{p:new e.Vector3(A[L],A[L+1],A[L+2]),n:new e.Vector3(v[L],v[L+1],v[L+2])}};let m=0;for(let i=1;i<A.length;i+=3)A[i]>A[m*3+1]&&(m=(i-1)/3);const V=new e.Vector3(A[m*3],A[m*3+1],A[m*3+2]),H=[];for(let i=0;i<9;i++){const y=g(i<2?o.range(.12,.3):o.range(.52,.86),i<4?p+o.range(-1.2,1.2):o.range(0,6.28));H.push(new e.Vector4(y.p.x,y.p.y,y.p.z,(i<2?o.range(4.4,6.2):i<4?o.range(8,14):.01)*(n.soaked?1.5:1)))}{const i=g(.3,2.4).p,y=g(.235,1.45).p;H[6].set(i.x,i.y,i.z,5.6),H[7].set(y.x,y.y,y.z,4.6)}{const i=g(.8,G+1.6).p;H[8].set(i.x,i.y,i.z,12)}return H[4].set(V.x-7,V.y-19,V.z-3,9.5),H[5].set(V.x+2,V.y-30,V.z+9,7),{geo:a,at:g,horn:V,blots:H,aSW:p,aN:G,top:x}}const Ze=`
uniform vec4 uBlot[9]; uniform float uSoak; uniform vec2 uAxis;
vec2 wash(vec3 p, vec3 n, vec2 uv){
  float nz = fbm3(p * 0.011 + 2.0), sl = vnoise(p * vec3(0.55, 0.05, 0.55) + 31.0);
  // the underside: the heaviest ink in the world, one solid mass stopped by a hard tide line where the rock turns upward.
  // Laid by smooth rock-local position only (never by the facet's normal), so its edge is a curve at any distance.
  vec2 dxz = p.xz - uAxis * smoothstep(30.0, 150.0, p.y); float rl = max(length(dxz), 1e-3); vec2 dd = dxz / rl;   // round the leaning axis
  float lob = 0.22 * (vnoise(vec3(dd * 2.6, 1.0)) - 0.5);
  float m = min(min(0.42, (p.y - 86.0 + (nz - 0.5) * 34.0) * 0.045), (158.0 + (nz - 0.5) * 30.0 + 60.0 * lob - p.y) * 0.045) + (nz - 0.5) * 0.3 + lob + uSoak * 0.2;
  float px = length(fwidth(p));
  float cov = smoothstep(0.10 - 0.02 * min(px, 1.0), 0.112, m), load = mix(0.74, 1.3, smoothstep(0.29, 0.35, m + (vnoise(p * 0.028 + 9.0) - 0.5) * 0.12 + (fibre(p * 0.6) - 0.47) * 0.09 * (1.0 - smoothstep(0.1, 0.3, px))));
  load = mix(0.74, load, smoothstep(0.15, 0.17, m) + smoothstep(0.5, 1.5, px));   // heavy beside the edge; the pooled dark tide line is laid on it by the shell (gE)
  vec2 sx = dd * 84.0; float swd = length(fwidth(sx));                    // past it the brush ran dry: streaks dragged on, paper between
  float stk = 0.6 * vnoise(vec3(sx, rl * 0.012 + p.y * 0.01)) + 0.4 * vnoise(vec3(sx * 0.31, 8.0 + p.y * 0.012));
  float past = 1.0 - smoothstep(-0.16, 0.10, m);
  float dcov = smoothstep(0.30 + 0.62 * past, 0.34 + 0.62 * past, stk) * (1.0 - smoothstep(0.5, 1.2, swd)) * step(0.001, past) * step(past, 0.999);
  load = mix(0.66, load, cov);
  cov = max(cov, dcov);
  cov *= mix(1.0, smoothstep(0.17, 0.2, sl + 0.5 * load), 1.0 - smoothstep(0.3, 0.9, px));   // slivers of bare paper the sweep left (near only)
  float belly = cov;
  gOwn = 1.0; gBig = 2.6; gQ = vec3(dd * 42.0, rl * 0.03 + p.y * 0.04);                                 // the sweeps ran up and outward round the bulge
  gE = (m - 0.11) * 22.0; gT = 0.25 + 0.5 * (1.0 - smoothstep(0.1, 0.3, m));
  // a few mid-grey wash blots on the bare paper of the stem and the shoulder: flat, no paper inside them, and a
  // darker tide line along the LOWER side only (the wash ran down and stopped); they never lie on the black
  float nb = fbm3(p * 0.03 + 8.0);
  for (int i = 0; i < 9; i++) {
    vec3 q = (p - uBlot[i].xyz) * vec3(1.0, mix(0.34, 0.7, smoothstep(60.0, 100.0, p.y)), 1.0);
    float rb = max(uBlot[i].w, 1e-3);
    float d = length(q) / rb + (nb - 0.5) * 1.1 + 0.2 + 0.5 * (vnoise(p * 0.3 + 3.0) - 0.5) + 0.25 * (vnoise(p * 0.9) - 0.5) * (1.0 - smoothstep(0.1, 0.5, px));
    float c = (1.0 - smoothstep(0.985, 1.0, d)) * (1.0 - belly);
    float lowSide = step(q.y, -0.12 * rb) * step(0.9, d);
    float l = mix(0.30 + 0.06 * uSoak, 0.62, lowSide);
    load = mix(load, l, c);
    cov = max(cov, c);
    gE = mix(gE, (1.0 - d) * rb * 0.6, c);
  }
  return vec2(cov, load);
}`,de=`
uniform float uTail;
vec3 deform(vec3 p, vec3 a){
  float s = clamp((p.x + 3.0) / 18.0, 0.0, 1.0); s *= s;
  p.z += s * (uTail * 7.0 + 0.8 * sin(uTime * 0.8 - p.x * 0.12));       // the tail hangs and sculls; uTail flicks it
  p.z += a.x * sin(uTime * 1.9 + a.y);                                   // fins scull
  p.z += sign(p.z) * a.z * (0.5 + 0.5 * sin(uTime * 1.25));              // the gill lifts
  return p;
}`,He=`
vec2 wash(vec3 p, vec3 n, vec2 uv){
  float s = uv.x, b = 1.0 - abs(uv.y - 0.5) * 2.0;                       // b: 1 on the back ridge, 0 on the belly
  float nz = fbm3(p * 0.33 + 5.0), sl = vnoise(vec3(p.x * 0.16, uv.y * 70.0, 2.0));
  // three sweeps along the back, each stopped by its own tide line, with slivers of paper where they meet
  float e = 0.50 + 0.10 * sin(s * 10.0 + 1.3) + (nz - 0.5) * 0.3 + 0.25 * (1.0 - smoothstep(0.0, 0.03, s)) - 0.2 * smoothstep(0.7, 0.86, s);
  float m = b - e;
  float gap = min(abs(s - 0.33 - (nz - 0.5) * 0.09 - b * 0.07), abs(s - 0.585 + (nz - 0.5) * 0.09 + b * 0.09));
  float gw = 0.006 + 0.011 * vnoise(vec3(uv.y * 9.0, s * 3.0, 4.0)) + 0.01 * (1.0 - b);                // the slivers open toward the belly
  float cov = smoothstep(0.0, 0.004, m) * smoothstep(gw, gw + 0.0015, gap) * (1.0 - smoothstep(0.84, 0.87, s + (nz - 0.5) * 0.05));
  float load = mix(0.36, mix(1.0, 0.72, smoothstep(0.5, 0.8, s)), smoothstep(0.026, 0.032, m));            // black, and ONE grey tide line
  cov *= smoothstep(0.16, 0.2, sl + 0.55 * load);
  float sy = uv.y * 170.0, fine = smoothstep(0.5, 1.1, fwidth(sy));                                       // dragged dry toward the tail: streaks, fibre between
  float stk = 0.55 * vnoise(vec3(s * 5.0, sy, 2.0)) + 0.45 * fibre(p * 1.6);
  float thr = (0.62 * smoothstep(0.36, 0.84, s) + 0.3 * (1.0 - smoothstep(0.0, 0.16, m)) * smoothstep(0.2, 0.45, s)) * (1.0 - fine);
  cov *= smoothstep(thr - 0.02, thr + 0.02, stk + 0.08);
  // the tail: dry rays, torn at the far edge
  float ray = vnoise(vec3(uv.y * 56.0, s * 3.0, 7.0)), far = smoothstep(0.86, 1.0, s);
  float tc = smoothstep(0.845, 0.855, s + (nz - 0.5) * 0.03) * smoothstep(0.16 + 0.5 * far, 0.22 + 0.5 * far, ray + 0.2 * fibre(p * 2.0));
  gOwn = 1.0; gQ = vec3(s * 3.3, uv.y * 58.0, 3.0); gT = smoothstep(0.45, 0.95, s) * 0.45; gE = 99.0;   // the lead, 12:20: the back keeps its black mass (its own dry drag toward the tail is above); no second tearing along its edge
  return vec2(max(cov, tc), mix(load, 0.86 - 0.45 * far, step(cov, tc - 0.001)));
}`,Ee=`
vec2 wash(vec3 p, vec3 n, vec2 uv){
  float ray = vnoise(vec3(uv.x * 13.0, floor(uv.x * 0.0) + 3.0, p.x * 0.05));
  float cov = smoothstep(0.12 + 0.4 * uv.y, 0.17 + 0.4 * uv.y, ray + 0.25 * fibre(p * 2.0));
  return vec2(cov, 0.95 - 0.5 * uv.y);
}`;function Ge(s,o,l){const n=Math.round(76*(.7+.3*o)),h=28,r=30,w=l.flatHead?1:0,x=(a,v)=>{const g=v*(a.length-1),m=Math.min(a.length-2,Math.floor(g)),V=g-m,H=i=>a[Math.max(0,Math.min(a.length-1,i))];return Se(H(m-1),H(m),H(m+1),H(m+2),V)},p=w?[1,2.2,2.9,3.3,3.5,3.5,3.3,2.9,2.3,1.6,1.15,2.1,3]:[1.5,3.3,4.3,5,5.4,5.3,4.8,4,3,2,1.3,2.3,3.3],G=w?[1.3,2.3,2.6,2.7,2.7,2.6,2.3,1.9,1.4,.9,.5,.2,.1]:[1.2,2.1,2.6,2.9,3,2.9,2.5,2,1.4,.9,.5,.2,.1],q=w?[-.3,0,.2,.4,.5,.5,.4,.3,.2,.1,0,0,0]:[-1,-.5,.2,.9,1.3,1.4,1.2,.9,.5,.2,0,.1,.2],M=s.range(.9,1.1),T=s.range(.92,1.08),W=(a,v,g=new e.Vector3)=>{const m=a<.05?Math.sqrt(Math.max(0,1-Math.pow(1-a/.05,2))):1,V=x(p,a)*M*m,H=x(G,a)*T*m,i=x(q,a),y=Math.cos(v),z=Math.sin(v),N=2.6-.6*a,L=Math.pow(Math.pow(Math.abs(y),N)+Math.pow(Math.abs(z),N),-1/N),Q=Math.max(0,(a-.86)/.14),D=Q*4.2*(Math.pow(Math.abs(y),1.5)-.6)+Q*.7*Math.sin(v*9+1),C=y>0?.82:1;return g.set(-r/2+a*r*.94+D+.5*Math.sin(v*5+a*30)*Q,i-y*L*V*C,z*L*H)},P=h+1,F=new Float32Array((n+3)*P*3),k=new Float32Array((n+3)*P*2),b=new e.Vector3;for(let a=0;a<n+3;a++){const v=Math.max(0,Math.min(n,a-1)),g=Math.pow(v/n,1.25),m=a===0||a===n+2;for(let V=0;V<=h;V++){const H=V%h/h*Math.PI*2;if(W(g,H,b),m){const i=W(g,0,new e.Vector3),y=W(g,Math.PI,new e.Vector3);b.set((i.x+y.x)/2+(a===0?-.5:0),(i.y+y.y)/2,0)}F.set([b.x,b.y,b.z],(a*P+V)*3),k.set([g,V/h],(a*P+V)*2)}}const t=[];for(let a=0;a<n+2;a++)for(let v=0;v<h;v++){const g=a*P+v,m=g+P;t.push(g,m,g+1,g+1,m,m+1)}const A=new e.BufferGeometry;A.setAttribute("position",new e.BufferAttribute(F,3)),A.setAttribute("uv",new e.BufferAttribute(k,2)),A.setIndex(t),A.computeVertexNormals();const f=A.attributes.normal.array;for(let a=0;a<n+3;a++){const v=a*P*3,g=(a*P+h)*3;for(let m=0;m<3;m++){const V=(f[v+m]+f[g+m])*.5;f[v+m]=V,f[g+m]=V}}for(let a=0;a<=h;a++)f.set([-1,0,0],a*3),f.set([1,0,0],((n+2)*P+a)*3);const u=(a,v,g,m,V,H)=>{const z=[],N=[],L=[],Q=[],D=s()*6.28;for(let _=0;_<=7;_++){const K=_/7,j=(K-.5)*V,Y=m*(.7+.3*Math.sin(K*Math.PI)+.14*(s()-.5));for(let I=0;I<=5;I++){const ee=(.04+.96*I/5)*Y;if(b.copy(a).addScaledVector(v,Math.cos(j)*ee).addScaledVector(g,Math.sin(j)*ee),z.push(b.x,b.y,b.z),N.push(K,I/5),L.push(H*(I/5)*(I/5),D+K*1.5,0),_<7&&I<5){const E=_*6+I,R=E+5+1;Q.push(E,R,E+1,E+1,R,R+1)}}}const C=new e.BufferGeometry;return C.setAttribute("position",new e.Float32BufferAttribute(z,3)),C.setAttribute("uv",new e.Float32BufferAttribute(N,2)),C.setAttribute("aAnim",new e.Float32BufferAttribute(L,3)),C.setIndex(Q),C.computeVertexNormals(),C},d=[];for(const a of[1,-1]){const v=W(.3,a*.62),g=new e.Vector3(.62,-.72,a*.3).normalize();d.push(u(v,g,new e.Vector3(.6,.5,a*.25).normalize(),w?3.6:4.4,1.25,.8))}return d.push(u(W(.56,Math.PI),new e.Vector3(.55,.83,0).normalize(),new e.Vector3(1,0,0),w?2:2.6,1.5,.35)),d.push(u(W(.74,0),new e.Vector3(.6,-.8,0).normalize(),new e.Vector3(1,0,0),2.6,1.2,.5)),{geo:A,at:W,fins:ae(d),L:r}}function Le(s,o,l){const n=new e.Group,h=o/3.2,r=o/2-.225*h,w=3,x=s()*6.28,p=s.range(1.04,1.14),G=(f,u=1)=>{const d=Math.cos(f),a=Math.sin(f),v=Math.pow(Math.pow(Math.abs(d),w)+Math.pow(Math.abs(a),w),-1/w);return[d*v*r*p*u,a*v*r*u*(1+.07*Math.sin(f+x))]},q=[],M=3.5+s.range(-.3,.3),T=40;for(let f=0;f<=T;f++){const u=M-f/T*(Math.PI*2+.5),d=G(u,1+.1*(f/T));q.push(new e.Vector3(d[0],d[1],.16*h))}const W=new e.Mesh(he(q,.225*h,{seed:s()*9,step:.22*h,radial:6}),l.ring),P=new e.Mesh(ke(s,o*.56,20,.6),l.paper);P.position.z=.05*h;const F=.74*h,k=new e.Mesh(ke(s,F,18,.15,.35),l.dab);n.add(P,W,k);const b=new e.Vector3,t={a:Math.PI/2+s.range(-.25,.25),open:1},A=()=>{const f=G(t.a,(r-.225*h-F*.42)/r);k.position.set(f[0],f[1],.36*h)};return A(),{group:n,pupil:k,ring:W,disc:P,look(f,u=.016){n.worldToLocal(b.copy(f));let d=Math.PI/2;if(b.z>0){const a=Math.atan2(b.y+o*.6,b.x)-Math.PI/2;d=Math.PI/2+Math.max(-.6,Math.min(.6,ye(a,0)*.8))}t.a+=(d-t.a)*Math.min(1,u*2.2),A()}}}const We=`
vec3 deform(vec3 p, vec3 a){ float b = sin(uTime * 1.05); return p + vec3(p.x, (p.y - 5.0) * 0.6, p.z) * 0.022 * b * step(4.2, p.y); }`,Ie=`
vec2 wash(vec3 p, vec3 n, vec2 uv){
  float nz = fbm3(p * 0.4 + 3.0);
  float lo = vnoise(p * 0.22 + 3.0);
  float m = 0.72 - n.x * 0.95 + n.y * 0.45 + (lo - 0.5) * 0.4 + smoothstep(9.9, 10.7, p.y) + 0.9 * (1.0 - smoothstep(-1.2, -0.2, p.x));   // the chest faces forward; everything else is the back
  float back = smoothstep(0.43, 0.445, m);
  float sliver = (smoothstep(0.37, 0.378, m) - back) * step(0.42, vnoise(p * 0.55 + 7.0));      // the back sweep does not quite meet the chest
  float belly = smoothstep(-0.9, -0.82, n.y + 0.25 * n.x);                                      // bare paper underneath
  gOwn = 1.0; gQ = vec3(p.xz / max(length(p.xz), 0.3) * 8.5, p.y * 0.11); gT = (0.5 + 0.45 * (1.0 - smoothstep(2.5, 10.5, p.y))) * back; gE = mix(99.0, (m - 0.445) * 4.0, back);
  return vec2((1.0 - sliver) * max(back, belly), mix(0.345, 1.3, back));                        // ONE flat grey chest, black back (black even with a dry brush)
}`;function De(s,o){const l=new e.SphereGeometry(1,30,22),n=l.attributes.position,h=new e.Vector3,r=new e.Vector3,w=o==="quail"?4.6:3.9,x=o==="quail"?3.6:4.3,p=o==="quail"?6.6:8.2,G=new e.Vector3(.66,.75,0).normalize(),q=new e.Vector3(-.8,-.6,0).normalize(),M=o==="kingfisher"?1.25:1;for(let t=0;t<n.count;t++){r.fromBufferAttribute(n,t).normalize();const A=Math.max(0,r.dot(G)),f=Math.max(0,r.dot(q)),u=1+.5*M*Math.pow(A,3.5)+(o==="quail"?.8:1.1)*Math.pow(f,7)-.1*Math.max(0,r.x)*Math.max(0,-r.y+.2);h.set(r.x*w*u,r.y*x*u,r.z*3.3*u*(1-.25*Math.pow(f,4))),h.x+=1.35*(h.y/x)*(h.y>0?1:.3),n.setXYZ(t,h.x,h.y+p,h.z)}l.computeVertexNormals();const T=[],W=(t,A)=>T.push(he(t.map(f=>new e.Vector3(...f)),A,{seed:s()*9,step:.5})),P=o==="kingfisher"?3.6:2.2,F=new e.Vector3(.62,-.78,0).normalize(),k=new e.CylinderGeometry(.28,1.15,P*1.75,7,1);k.scale(1,1,.6),k.applyQuaternion(new e.Quaternion().setFromUnitVectors(new e.Vector3(0,1,0),F)),k.translate(5+F.x*P*.875,p+3.5+F.y*P*.875,0);for(const t of[1,-1])W([[1.6,p+1.2,t*3.25],[-.6,p+.6,t*3.5],[-2.6,p-1.4,t*3.1],[-3.8,p-3.2,t*2.2]],.26);if(o==="quail")for(let t=0;t<2;t++)W([[-3.4-t*.5,p-2.2,(t-.5)*.9],[-5.4-t*.6,p-3.9-t*.4,(t-.5)*1.2],[-6.5-t*.7,p-5.6-t*.7,(t-.5)*1.5]],.6);else for(let t=0;t<3;t++)W([[-3-t*.5,p-3,(t-1)*.7],[-5-t*.7,p-6.2-t*.5,(t-1)*1],[-5.6-t*.9,p-8.6-t*.9,(t-1)*1.3]],.62);const b=t=>{const A=[],f=(u,d)=>A.push(he(u.map(a=>new e.Vector3(...a)),d,{seed:s()*9,step:.5}));f([[.5,p-x+.6,t],[.9,2.2,t],[.3,.25,t]],.34);for(const u of[-.7,0,.7])f([[.3,.3,t],[1.3,.22,t+u*.9],[2,.18,t+u*1.5]],.18);return f([[.3,.3,t],[-1.2,.2,t]],.18),ae(A)};return{geo:l,beak:k,lines:ae(T),legA:b(.5),legB:b(-.5),eyeAt:new e.Vector3(4.6*(o==="kingfisher"?1.07:1),p+3.5*(o==="kingfisher"?1.07:1),0),eyeZ:o==="kingfisher"?2.1:1.95}}function Re(s,{width:o=40,id:l=0,sweeps:n=7,droop:h=.3,torn:r=!1,lean:w,plain:x=!1}={}){const M=o/2,T=[],W=[],P=[],F=[],k=[],b=[],t=s()*6.28,A=s()*6.28,f=s(),u=s()*50,d=s.range(.1,.22),a=w??A,v=3+Math.round(n)%3,g=.28+h*1.15,m=N=>{const L=Math.sin(N*12.9898+u*78.233)*43758.5453;return L-Math.floor(L)},V=[];for(let N=0;N<4;N++)V.push(!x&&N<1+v%2?-2+(N+.2+.6*m(N))*(4/(v-1)):99);const H=x?1.9:1,i=x?.55+.75*m(31):1,y=(f-.5)*2;for(let N=0;N<=24;N++)for(let L=0;L<=40;L++){const Q=L%40/40,D=Q*Math.PI*2,C=a+D,_=N/24,K=.5+.5*Math.cos(D);let j=.44+.56*Math.pow(K,.7);j*=1+H*(.17*Math.sin(2*D+t)+.12*Math.sin(3*D+t*1.7))+.04*Math.sin(7*D+t*2.3),x&&(j*=1/Math.sqrt(Math.pow(Math.cos(D),2)+Math.pow(Math.sin(D)/i,2))*(i>1?1/i:1));for(let E=0;E<4;E++)if(V[E]<90){const R=ye(D,V[E]+.4*(Math.abs(V[E])*7.3%1-.5));j*=1-(.08+.16*m(E+20))*Math.exp(-(R*R)/.012)}if(r){const E=ye(D,y);j*=1-.55*Math.exp(-(E*E)/.05)}const Y=_*j,I=Y*M,ee=M*(d*.5*Math.sin(Math.min(Y,1)*Math.PI*.9)-g*Math.pow(Y,1.3)*(.35+.65*K)+.035*Y*Y*Math.sin(5*D+t));if(T.push(Math.cos(C)*I,ee,Math.sin(C)*I),W.push(L/40,_),P.push(l,u,M),F.push(Math.cos(D)*Y,Math.sin(D)*Y),k.push(V[0],V[1],V[2],V[3]),N<24&&L<40){const E=N*41+L,R=E+41;b.push(E,R,E+1,E+1,R,R+1)}}const z=new e.BufferGeometry;return z.setAttribute("position",new e.Float32BufferAttribute(T,3)),z.setAttribute("uv",new e.Float32BufferAttribute(W,2)),z.setAttribute("aLeaf",new e.Float32BufferAttribute(P,3)),z.setAttribute("aQ",new e.Float32BufferAttribute(F,2)),z.setAttribute("aCut",new e.Float32BufferAttribute(k,4)),z.setIndex(b),z}function Ke(s,o=32,{deform:l=Fe,uniforms:n={},darkest:h=!1}={}){const r=[];for(let w=0;w<o;w++)r.push(new e.Vector2(0,0));return new e.ShaderMaterial({side:e.DoubleSide,transparent:!0,depthWrite:!1,blending:e.CustomBlending,blendEquation:h?e.MinEquation:e.AddEquation,blendSrc:h?e.OneFactor:e.DstColorFactor,blendDst:h?e.OneFactor:e.ZeroFactor,uniforms:{...s,...n,uLeaf:{value:r},uAbs:{value:h?1:0}},vertexShader:se+`
      attribute vec3 aAnim, aLeaf; attribute vec2 aQ; attribute vec4 aCut; uniform vec2 uLeaf[${o}];
      varying vec3 vP, vL; varying vec2 vUv, vSt, vQ; varying vec4 vCut;
      ${l}
      void main(){ vec3 p = deform(position, aAnim); vP = position; vUv = uv; vL = aLeaf; vQ = aQ; vCut = aCut;
        vSt = uLeaf[int(clamp(aLeaf.x + 0.5, 0.0, ${o-1}.0))];
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }`,fragmentShader:se+Pe+`
      uniform float uAbs; varying vec3 vP, vL; varying vec2 vUv, vSt, vQ; varying vec4 vCut;
      void main(){
        float f = vUv.y, seed = vL.y, wet = vSt.x, dried = vSt.y;
        vec2 q = vQ; float rho = length(q); vec2 dir = q / max(rho, 1e-3);
        float th = atan(q.y, abs(q.x) < 1e-5 ? 1e-5 : q.x);
        float px = max(length(fwidth(q)), 1e-5);                                // leaf units per pixel
        float near = 1.0 - smoothstep(0.012, 0.03, px);                         // 1: big enough on screen to show the brush
        float isWet = smoothstep(0.0, 0.3, wet);
        // the wet: a blot round a heart that sits off-centre, toward the hanging side; it stops dead at ONE tide line
        vec2 hc = vec2(0.27, 0.08 * sin(seed));
        float nb = vnoise(vec3(q * 2.3, seed)), nb2 = vnoise(vec3(q * 6.5, seed + 4.0));
        float dh = length((q - hc) * vec2(0.82, 1.0)) + 0.24 * (nb - 0.5) + 0.07 * (nb2 - 0.5) * near;
        float tide = wet * 0.64;
        float inside = 1.0 - smoothstep(tide - px, tide + px, dh);
        float past = clamp((dh - tide) / 0.42, 0.0, 1.0);
        // beyond it the brush ran dry: parallel streaks dragged out from the neck, bare paper between them, hard-edged
        vec2 sd = dir * 8.0; float sw = length(fwidth(sd)) + 2.0 * (1.0 - smoothstep(0.02, 0.1, rho));
        float s1 = vnoise(vec3(sd, rho * 1.1 + seed)), s2 = vnoise(vec3(dir * 4.0, rho * 0.7 + seed + 9.0));
        float streak = clamp((0.62 * s1 + 0.38 * s2 - 0.5) * 2.4 + 0.5, 0.0, 1.0);
        float ext = vnoise(vec3(dir * 2.4, seed + 5.0));                                 // some sweeps drag far, some stop short
        float dryS = smoothstep(0.56, 0.70, ext);                                      // only some sweeps ran dry: the rest end wet and hard
        float farL = step(wet, -0.1);                                                  // a leaf beyond reach: one pale mass, one tide line, one ragged dry side
        float dryW = mix(0.42, 1.0, dryS);                                             // every sweep drags a little before it stops; some run right out
        float side = smoothstep(-0.25, 0.75, cos(th - seed * 2.0));                    // (far) the side the brush left by
        float D = mix(mix(0.04 + 0.30 * rho * rho, 0.06 + 0.9 * side * smoothstep(0.3, 0.95, rho), farL), (0.05 + 0.8 * past * past) * dryW, isWet) * (1.0 - inside) + 0.3 * uDry * (1.0 - inside) * dryS;
        D = max(D, 0.92 * smoothstep(0.62, 1.0, f) * mix(dryW, side, farL));                 // and every sweep runs dry before the rim, wet or not
        float aa = clamp(sw * 0.45, 0.008, 0.07);
        float fine = smoothstep(0.45, 1.0, sw);
        float cov = mix(smoothstep(D - aa, D + aa, streak), step(D, 0.56 + 0.1 * (s2 - 0.5)), fine);     // too fine to see: one flat blot with a hard edge
        float e = mix(0.93 + 0.07 * s2 - 0.04 * s1, 1.0, fine);
        cov *= 1.0 - smoothstep(e - clamp(1.5 * fwidth(f), 0.0008, 0.012), e, f);                                                        // each sweep ends torn
        float mpp = length(fwidth(vP));                       // metres per pixel: each size of the paper's long fibres shows only while it is a sliver a few pixels wide
        float fth = 0.84 - 0.08 * smoothstep(0.25, 0.95, rho) - 0.05 * past;
        float w0 = smoothstep(0.045, 0.09, mpp), w1 = smoothstep(0.011, 0.022, mpp) * (1.0 - smoothstep(0.06, 0.11, mpp)), w2 = 1.0 - smoothstep(0.014, 0.028, mpp);
        float hole = max(max(step(fth + 0.5 * (1.0 - w0), fibreF(vP.xzy * 0.15)), step(fth + 0.5 * (1.0 - w1), fibreF(vP.xzy * 0.6 + 13.0))), step(fth + 0.5 * (1.0 - w2), fibreF(vP.xzy * 2.4 + 29.0)));
        cov *= 1.0 - hole * step(0.08, rho) * (1.0 - fine) * near * step(0.74, vnoise(vec3(q * 3.1, seed + 21.0)) + 0.3 * past);   // flecks of bare paper where fibres resisted the ink: in patches, not everywhere
        // FLYING WHITE: where the brush ran dry its hairs split and left long streaks of bare paper ALONG the sweep (out from the neck),
        // 0.1 to 0.4 m wide, metres long, more of them toward the end of the stroke. Keyed to the leaf's own plane; flat when too fine.
        float R = max(vL.z, 1.0);
        vec2 fq = dir * (1.5 * R); float fww = length(fwidth(fq)) + 3.0 * (1.0 - smoothstep(0.03, 0.12, rho));
        float fly = 0.6 * vnoise(vec3(fq, rho * R * 0.10 + seed * 3.0)) + 0.4 * vnoise(vec3(fq * 2.3 + 17.0, rho * R * 0.17 + seed));
        float endS = smoothstep(0.58, 0.98, f), deep = inside * (1.0 - smoothstep(0.55, 1.0, dh / max(tide, 0.05)));
        float fray = mix(0.22, 1.0, smoothstep(0.38, 0.62, ext));                     // only some sweeps ran right out: the rest of the rim stays a wet mass with a hard edge
        float amt = clamp(0.06 + 0.55 * endS * fray + 0.5 * past * isWet * mix(0.5, 1.0, fray) + 0.25 * (1.0 - isWet) * smoothstep(0.3, 0.8, rho) - 0.6 * deep, 0.0, 1.0);
        float fthr = mix(0.80, 0.47, amt), fa = clamp(fww * 0.5, 0.015, 0.2);
        float white = smoothstep(fthr - fa, fthr + fa, fly) * (1.0 - smoothstep(0.4, 0.95, fww)) * (1.0 - farL);
        cov *= 1.0 - white;
        // slivers of bare paper where two sweeps failed to meet: few, bent, unequal, opening toward the rim
        float ath = px / max(rho, 0.05);
        for (int k = 0; k < 4; k++) {
          float c = vCut[k], hk = fract(abs(c) * 7.3), bend = 0.5 * (hk - 0.5);
          float dth = abs(mod(th - c - bend * rho + 3.14159265, 6.2831853) - 3.14159265);
          float w = (0.012 + 0.05 * fract(hk * 5.7)) * smoothstep(0.22 + 0.3 * hk, 0.85, rho);
          float sl = smoothstep(w - ath, w + ath, dth);
          cov *= mix(1.0, sl, clamp(w * rho / (1.5 * px), 0.0, 1.0) * step(c, 90.0) * (1.0 - farL));
        }
        // tone: burnt heart, heavy body, ONE grey line where the wet stopped (broken, never a ring), the same ink dragged dry beyond
        float heart = tide * (0.46 + 0.3 * (nb2 - 0.5));
        // graded only INSIDE the sweep: black pooled where the brush began, the hairs of the brush dragging heavy and grey toward the tide line
        float hair = vnoise(vec3(dir * 19.0, rho * 1.2 + seed + 3.0)), pool = vnoise(vec3(q * 4.6, seed + 7.0));
        float out01 = clamp((dh - heart) / max(tide - heart, 0.02), 0.0, 1.0);
        float body = 0.68 - 0.26 * smoothstep(0.50, 0.66, hair) * smoothstep(0.15, 0.9, out01) * near
                   + 0.30 * smoothstep(0.63, 0.73, pool + 0.2 * (1.0 - out01) + 0.25 * (fibreF(vP * 1.3) - 0.47)) * (1.0 - smoothstep(0.45, 0.6, out01)) * near;       // pools of burnt ink that ran from the heart
        float fb = fibreF(vP * 1.3), grain = (fb - 0.47) * near;
        float hw = 0.025 * near;                                                          // near, the heart grades into the body through the paper's grain, never along a clean curve
        float load = mix(1.0 - 0.36 * smoothstep(0.70, 0.76, hair * 0.6 + 0.4 * nb2) * smoothstep(0.1, 0.3, rho) * near, body, smoothstep(heart - px - hw, heart + px + hw, dh + 0.2 * grain + 0.2 * (hair - 0.5) * near));   // the black runs out along the hairs of the brush
        // the tide line: where the wet front stopped the ink POOLED, a rim one step darker than the body, 0.3 to 0.6 m wide, broken
        float bw = (0.3 + 0.3 * s2) / R, arc = smoothstep(0.40, 0.52, vnoise(vec3(dir * 1.6, seed + 2.0)) + 0.3 * (s1 - 0.5));
        float rimVis = smoothstep(1.6, 3.2, bw / px);                                   // a band, never a hairline: too thin to draw, it is left out
        load = mix(load, 1.0, smoothstep(tide - bw - px, tide - bw * 0.6 + px, dh + 0.012 * grain + 0.03 * (hair - 0.5)) * arc * near * rimVis * (1.0 - 0.5 * dried));
        float dragged = 0.64 - 0.30 * smoothstep(0.35, 0.75, past + 0.5 * (hair - 0.5)) * near;   // beyond the tide the same ink dragged dry: heavy, then grey
        float farTide = (1.0 - smoothstep(0.03, 0.03 + 2.0 * px, abs(dh - 0.46))) * arc * step(px, 0.02);   // (far) one grey line where the wet once stopped
        load = mix(mix(mix(0.08, 0.30, farTide * farL), dragged, isWet), load, inside);
        load *= mix(1.0, 0.6, dried) * (1.0 - 0.3 * uDry);
        // the paper's fibre shows THROUGH the ink as fine lighter threads (one ink step lighter), only while a thread is a few pixels wide
        float thr1 = smoothstep(0.605, 0.66, fibreF(vP.xzy * 0.55 + 41.0)) * (1.0 - smoothstep(0.05, 0.10, mpp));
        float thr2 = smoothstep(0.62, 0.67, fibreF(vP.xzy * 1.5 + 7.0)) * (1.0 - smoothstep(0.018, 0.04, mpp));
        load -= 0.30 * max(thr1, thr2) * near * step(0.05, rho);
        vec3 ink = inkTone(load) * (1.0 + 0.3 * (fb - 0.45) * (1.0 - 0.6 * clamp(load, 0.0, 1.0)));
        vec3 soak = min(ink, uPaper);                                                     // uAbs 1: MIN blending, the ink itself; 0: multiply, ink over paper
        // while the leaf is still wet the ink creeps about a metre past the tide line into the bare paper, pale, along the fibres
        float bl = (dh - tide) * R;
        float bn = 0.6 * fibreF(vP.xzy * 0.5 + 3.0) + 0.4 * fibreF(vP.xzy * 1.6 + 8.0);     // it wicks along the fibres in fingers: a hard-edged pale stain, never a soft gradient
        float bleed = smoothstep(-0.05, 0.05, bn - 0.15 - 0.55 * bl) * step(0.0, bl) * isWet * (1.0 - dried) * near * (1.0 - smoothstep(e - 0.07, e - 0.02, f));
        vec3 pale = min(inkTone(0.08), uPaper);
        vec3 one = max(uPaper, vec3(1e-3));
        vec3 under = mix(vec3(1.0), mix(pale / one, pale, uAbs), 0.85 * bleed);
        gl_FragColor = vec4(mix(under, mix(soak / one, soak, uAbs), clamp(cov, 0.0, 1.0)), 1.0);
      }`})}const Xe=[36,0,332],Oe=[[-36,76,-156],[-40,54,-100],[-46,64,-46],[-2,70,34],[40,98,-2],[0,130,-88],[-70,172,-94],[-102,198,-66],[-94,218,-32],[-72,240,-6],[-55,245,12],[-46.5,245,30],[-46.5,245,80]];async function ot(s,o={}){const l=s.rng,n=Math.max(.6,Math.min(1,o.detail??1)),h=o.ink||Ce(o.palette||le),{STYLE:r,shellMaterial:w,hullMaterial:x,lineMaterial:p,dabMaterial:G,makePaperDome:q,leafMaterial:M}=h,T=l()<.6?"loaded":l()<.5?"dry":"soaked",W=o.brush||T,P={soaked:W==="soaked",dry:W==="dry",flatHead:o.fish?o.fish==="flat":l.chance(.35),twoLumps:o.rock?o.rock==="lumps":l.chance(.3),bird:o.bird??l.pick(["mynah","mynah","quail","kingfisher"]),keepOut:Oe,clear:11};r.uDry.value=P.dry?.8:0;const F=o.dome??!0,k=new e.Group;k.name="pond-with-no-water-hero";let b=null;F&&(b=q(2600),b.renderOrder=-.5,k.add(b));const t=await $e(s,l.fork("rock"),n,P),A=new e.Mesh(t.geo,w({wash:Ze,uniforms:{uBlot:{value:t.blots},uSoak:{value:P.soaked?1:0},uAxis:{value:t.top},uFar:{value:.86}}})),f=new e.Mesh(t.geo,x({width:2.2,load:1,gaps:.39,gapScale:.013,floorPx:3.2,minLoad:.82,body:.93,gapGLSL:"float lowR = 1.0 - smoothstep(0.33, 0.45, vUv.y); float g = mix(fbm3(vP * uGapS + 17.0), fbm3(vP * vec3(0.06, 0.03, 0.06) + 3.0), lowR), G = mix(uGaps, 0.3, lowR);"}));k.add(A,f),await s.yield();const u=l.fork("creases"),d=[],a=(c,S,B,O,Z,J)=>{const ve=[];for(let we=0;we<=Z;we++){const be=we/Z,Be=t.at(c+(S-c)*be,B+(O-B)*be+J*Math.sin(be*7+B));ve.push(Be.p.addScaledVector(Be.n,.5))}d.push(he(ve,1,{seed:u()*9,step:2.5}))};a(.03,.44,t.aSW+2.4+u.range(-.4,.4),t.aSW+2.9,10,.12),a(.05,.36,t.aSW-1,t.aSW-.5+u.range(-.3,.3),9,.1),a(.4,.57,t.aSW+.9,t.aSW+.45,8,.1),a(.58,.8,t.aSW-.9+u.range(-.3,.3),t.aSW-1.5,10,.15),a(.62,.84,t.aN+1,t.aN+1.7+u.range(-.3,.3),10,.15),a(.8,.86,t.aN-1.5,t.aN+.3,12,.05),a(.74,.93,t.aN+1.9,t.aN+1.3,10,.12),a(.7,.86,t.aN+2.5,t.aN+2.2,8,.1),k.add(new e.Mesh(ae(d),p({load:1.15,dryLen:26}))),await s.yield();const v=[],g=new e.Quaternion,m=new e.Matrix4,V=new e.Vector3(0,0,1),H=new e.Vector3(1,1,1);for(let c=0;c<12;c++){const S=Math.floor(c/3),B=t.at(.875+.02*S+u.range(-.012,.012),t.aN-.7+S*.42+u.range(-.08,.08)+c%3*.07),O=ke(u,u.range(1.6,3.4),14,.3);O.applyMatrix4(m.compose(B.p.addScaledVector(B.n,.45),g.setFromUnitVectors(V,B.n.normalize()),H)),v.push(O)}for(let c=0;c<7;c++){let S=null,B=1e9;const O=new e.Vector3(t.horn.x-4-1.6*c+u.range(-1.5,1.5),t.horn.y-5-4.2*c,t.horn.z+u.range(-7,7));for(let J=0;J<40;J++)for(let ve=0;ve<26;ve++){const we=t.at(.66+ve*.01,t.aN-.7+J*.035),be=we.p.distanceToSquared(O);be<B&&(B=be,S=we)}const Z=ke(u,u.range(.9,1.9),12,.3);Z.applyMatrix4(m.compose(S.p.addScaledVector(S.n.normalize(),.4),g.setFromUnitVectors(V,S.n),H)),v.push(Z),c%2===1&&await s.yield()}for(let c=0;c<9;c++){const S=Math.floor(c/3),B=t.at(.83+.03*S+u.range(-.012,.012),t.aN+1.15+S*.38+u.range(-.06,.06)+c%3*.06),O=ke(u,u.range(1.5,3),14,.3);O.applyMatrix4(m.compose(B.p.addScaledVector(B.n,.45),g.setFromUnitVectors(V,B.n.normalize()),H)),v.push(O)}const i=G(1.3);k.add(new e.Mesh(ae(v),i)),await s.yield();const y=l.fork("fish"),z=Ge(y,n,P),N={value:0};await s.yield();const L=new e.Group;L.position.set(-28,62,-42),L.rotation.set(0,-Math.atan2(.6,.8),-.066);const Q={uTail:N};L.add(new e.Mesh(z.geo,w({wash:He,deform:de,uniforms:Q}))),await s.yield(),L.add(new e.Mesh(z.geo,x({width:.45,load:.92,gaps:.26,gapScale:.1,deform:de,uniforms:Q,keep:"if (vUv.x > 0.87) discard;"}))),L.add(new e.Mesh(z.fins,w({wash:Ee,deform:de,uniforms:Q,side:e.DoubleSide})));const D=[],C=(c,S,B=1.035)=>{const O=z.at(c,S);return O.y*=B,O.z*=B,O},_=(c,S)=>D.push(he(c,.225,{seed:y()*9,step:.14,radial:8,anim:()=>[0,0,S]})),K=C(0,1.25).add(C(0,-1.25)).multiplyScalar(.5);K.x-=.45,_([C(.115,.55),C(.06,.9),C(.022,1.14),K,C(.022,-1.14),C(.06,-.9),C(.115,-.55)],0),await s.yield();for(const c of[1,-1])_([C(.265,c*2.5),C(.3,c*2.05),C(.312,c*1.5),C(.295,c*1),C(.26,c*.66)],.4),await s.yield();const j=p({load:.9,dryLen:4,deform:de,uniforms:Q});L.add(new e.Mesh(ae(D),j)),await s.yield();const Y={paper:w(),ring:p({load:1,dryLen:3.2}),dab:i};await s.yield();const I=[];for(const c of[1,-1]){const S=Le(y,3.2,Y),B=z.at(.15,c*2),O=z.at(.19,c*2).sub(z.at(.11,c*2)).cross(z.at(.15,c*2.25).sub(z.at(.15,c*1.75))).normalize();O.z*c<0&&O.negate(),O.lerp(new e.Vector3(0,.1,c),.6).normalize(),S.group.position.copy(B).addScaledVector(O,.5),S.group.quaternion.setFromRotationMatrix(m.lookAt(O,new e.Vector3,new e.Vector3(0,1,0))),L.add(S.group),I.push(S)}k.add(L),await s.yield();const ee=l.fork("bird"),E=De(ee,P.bird),R=new e.Group;await s.yield();const $=1.3;R.scale.setScalar($),R.position.copy(t.horn).add(new e.Vector3(0,-.3,0)),R.rotation.y=-Math.PI/2+ee.range(-.15,.15),R.add(new e.Mesh(E.geo,w({wash:Ie,deform:We,uniforms:{uFib:{value:0}}}))),await s.yield(),R.add(new e.Mesh(E.geo,x({width:.45,load:1,gaps:.2,gapScale:.12,deform:We})));const X=p({load:.95,dryLen:2.5});R.add(new e.Mesh(E.lines,X),new e.Mesh(E.beak,i));const Ae=3.6,ce=[E.legA,E.legB].map(c=>{c.translate(0,-Ae,0);const S=new e.Mesh(c,X);return S.position.y=Ae,R.add(S),S});ce[1].scale.set(1,.12,1),await s.yield();const pe=[],ge=[];for(const c of[1,-1]){const S=Le(ee,1.75,Y);S.group.position.set(E.eyeAt.x,E.eyeAt.y,c*E.eyeZ),S.group.rotation.set(0,c>0?.5:Math.PI-.5,0),S.group.scale.setScalar(.001),R.add(S.group),pe.push(S);const B=new e.Mesh(he([new e.Vector3(-.62,.08,0),new e.Vector3(0,-.07,0),new e.Vector3(.62,.04,0)],.17,{seed:ee()*9,step:.3}),X);B.position.copy(S.group.position),B.position.z+=c*.25,B.rotation.copy(S.group.rotation),R.add(B),ge.push(B)}k.add(R),await s.yield(),k.updateMatrixWorld(!0);const xe=I.map(c=>k.worldToLocal(c.group.getWorldPosition(new e.Vector3))),oe={worldOffset:Xe.slice(),flyThrough:Oe.map(c=>c.slice()),portalSeat:{position:[-46.5,245,80],facing:[0,0,-1]},fishSnout:[-40,63,-51],fishTail:[-16,61,-33],fishCentre:[-28,62,-42],fishEyeNW:xe[1].toArray(),fishEyeSE:xe[0].toArray(),horn:t.horn.toArray(),bird:[t.horn.x,t.horn.y+6,t.horn.z],birdEye:[t.horn.x-2.5,t.horn.y+9.8,t.horn.z+2.7],minnowRest:[10,122,-66],viewpoints:{reveal:[-40,54,-100],eyePass:[-46,64,-46],stem:[-22,67,-3],exit:[-45,228,40]},variant:{brush:W,fish:P.flatHead?"flat":"hump",rock:P.twoLumps?"lumps":"anvil",bird:P.bird}},ue=new e.Vector3,Me=new e.Vector3,re=new e.Vector2,U={u:-1,wake:0,leg:0},me=c=>(c=Math.max(0,Math.min(1,c)),c*c*(3-2*c));function ne(c){U.u=c;const S=(c-.355)/.035;N.value=S>0&&S<1?Math.sin(S*Math.PI*2)*(1-S)*1.1:0,U.wake=me((c-.945)/.012),U.leg=me((c-.955)/.02);for(let B=0;B<2;B++)pe[B].group.scale.setScalar(Math.max(.001,U.wake)),ge[B].scale.setScalar(Math.max(.001,1-U.wake));ce[0].scale.y=1-.88*U.leg,ce[1].scale.y=.12+.88*U.leg,R.position.x=t.horn.x,R.position.z=t.horn.z+1*U.leg*Math.cos(R.rotation.y)}if(ne(0),F&&o.focus==="leaf"){const c=l.fork("leafdemo"),S=M(4),B=Re(c,{width:44,id:0,sweeps:7}),O=Re(c,{width:30,id:1,sweeps:6,torn:!0});B.translate(-52,112,-70),O.translate(-10,100,-78),S.uniforms.uLeaf.value[0].set(1,0),S.uniforms.uLeaf.value[1].set(.45,0);const Z=new e.Mesh(ae([B,O]),S);Z.renderOrder=5,k.add(Z)}const ie=F?o.focus??null:null,te={fish:[9,14,oe.fishCentre],eye:[3,5,oe.fishEyeNW],bird:[5,10,oe.bird],foot:[14,40,[0,60,0]],top:[30,30,[-30,200,40]],leaf:[26,30,[-30,96,-66]],reveal:[20,30,oe.fishCentre]}[ie];return(ie==="bird"||ie==="top")&&ne(.97),{object:k,radius:te?te[0]:78,height:te?te[1]:222,center:te?new e.Vector3(...te[2]):new e.Vector3(-18,112,-6),anchors:oe,ground:!1,groundY:0,uniforms:r,ink:h,setProgress:ne,parts:{fish:L,bird:R,rockShell:A,rockHull:f,eyes:I,birdEyes:pe},update(c,S,B){r.uTime.value=S,s.renderer&&(r.uViewH.value=s.renderer.getDrawingBufferSize(re).y),B.getWorldPosition(ue),b&&b.position.copy(k.worldToLocal(Me.copy(ue))),L.position.y=62+.55*Math.sin(S*.33),L.rotation.x=.03*Math.sin(S*.27+1);const O=Math.sin(S*1.15),Z=Math.max(0,O);R.scale.set($*(1+.022*O),$*(1+.04*Z+.012*O),$*(1+.035*O)),R.rotation.z=.018*Math.sin(S*1.15-.9);for(const J of I)J.look(ue,c);if(U.wake>.5)for(const J of pe)J.look(ue,c)},dispose(){}}}function at(s,o,{flat:l=!1,detail:n=1,eyeMats:h}={}){const r=Ge(o,n,{flatHead:l}),w={value:0},x={uTail:w},p=new e.Group,G=new e.Matrix4;p.add(new e.Mesh(r.geo,s.shellMaterial({wash:He,deform:de,uniforms:x}))),p.add(new e.Mesh(r.geo,s.hullMaterial({width:.45,load:.92,gaps:.26,gapScale:.1,deform:de,uniforms:x,keep:"if (vUv.x > 0.87) discard;"}))),p.add(new e.Mesh(r.fins,s.shellMaterial({wash:Ee,deform:de,uniforms:x,side:e.DoubleSide})));const q=[],M=(F,k,b=1.035)=>{const t=r.at(F,k);return t.y*=b,t.z*=b,t},T=(F,k)=>q.push(he(F,.225,{seed:o()*9,step:.14,radial:8,anim:()=>[0,0,k]})),W=M(0,1.25).add(M(0,-1.25)).multiplyScalar(.5);W.x-=.45,T([M(.115,.55),M(.06,.9),M(.022,1.14),W,M(.022,-1.14),M(.06,-.9),M(.115,-.55)],0);for(const F of[1,-1])T([M(.265,F*2.5),M(.3,F*2.05),M(.312,F*1.5),M(.295,F*1),M(.26,F*.66)],.4);p.add(new e.Mesh(ae(q),s.lineMaterial({load:.9,dryLen:4,deform:de,uniforms:x})));const P=[];for(const F of[1,-1]){const k=Le(o,3.2,h),b=r.at(.15,F*2),t=r.at(.19,F*2).sub(r.at(.11,F*2)).cross(r.at(.15,F*2.25).sub(r.at(.15,F*1.75))).normalize();t.z*F<0&&t.negate(),t.lerp(new e.Vector3(0,.1,F),.6).normalize(),k.group.position.copy(b).addScaledVector(t,.5),k.group.quaternion.setFromRotationMatrix(G.lookAt(t,new e.Vector3,new e.Vector3(0,1,0))),p.add(k.group),P.push(k)}return{group:p,eyes:P,uTail:w}}function st(s,o,l="quail",{eyeMats:n,awake:h=!1}={}){const r=De(o,l),w=new e.Group,x=s.lineMaterial({load:.95,dryLen:2.5});w.add(new e.Mesh(r.geo,s.shellMaterial({wash:Ie,deform:We,uniforms:{uFib:{value:0}}}))),w.add(new e.Mesh(r.geo,s.hullMaterial({width:.45,load:1,gaps:.2,gapScale:.12,deform:We})));const p=[r.lines,r.legA],G=[];for(const q of[1,-1])if(h){const M=Le(o,1.75,n);M.group.position.set(r.eyeAt.x,r.eyeAt.y,q*r.eyeZ),M.group.rotation.set(0,q>0?.5:Math.PI-.5,0),w.add(M.group),G.push(M)}else{const M=he([new e.Vector3(-.62,.08,0),new e.Vector3(0,-.07,0),new e.Vector3(.62,.04,0)],.17,{seed:o()*9,step:.3});M.rotateY(q>0?.5:Math.PI-.5),M.translate(r.eyeAt.x,r.eyeAt.y,q*(r.eyeZ+.25)),p.push(M)}return w.add(new e.Mesh(ae(p),x),new e.Mesh(r.beak,n.dab)),{group:w,eyes:G}}const Je=`
uniform float uSide;
vec2 wash(vec3 p, vec3 n, vec2 uv){
  float nz = fbm3(p * 0.09 + 2.0), side = 0.5 + 0.5 * cos(uv.x * 6.2831853 - uSide);
  float m = min(uv.y - 0.34 + (nz - 0.5) * 0.2, 0.56 + 0.2 * side + (nz - 0.5) * 0.22 - uv.y);        // the underside, heaviest on one side
  float cov = smoothstep(0.0, 0.012, m), load = mix(0.36, 1.3, smoothstep(0.035, 0.045, m));          // black, and ONE grey tide line
  cov *= smoothstep(0.17, 0.2, vnoise(p * vec3(0.9, 0.12, 0.9) + 31.0) + 0.5 * load);                 // slivers the sweep left
  return vec2(cov, load);
}`;function rt(s,o,{height:l=30,side:n=0}={}){const x=l,p=new Float32Array(1665*3),G=new Float32Array(1665*2),q=[[0,0],[.07,.01],[.06,.12],[.08,.3],[.2,.46],[.4,.58],[.46,.74],[.4,.88],[.24,.97],[0,1]],M=o()*6.28,T=o()*6.28,W=o.range(-.22,.22),P=o.range(-.22,.22),F=q.length-1;for(let d=0;d<=36;d++)for(let a=0;a<=44;a++){const v=a%44/44*Math.PI*2,g=d/36*F,m=Math.min(F-1,Math.floor(g)),V=g-m,H=L=>q[Math.max(0,Math.min(F,L))];let i=Math.max(0,Se(H(m-1)[0],H(m)[0],H(m+1)[0],H(m+2)[0],V))*x,y=Se(H(m-1)[1],H(m)[1],H(m+1)[1],H(m+2)[1],V)*x;(d===0||d===36)&&(i=0);const z=Math.min(1,Math.max(0,(y/x-.3)/.25));i*=1+z*(.24*Math.sin(v*2+M)+.13*Math.sin(v*3+T+y*.2)+.07*Math.sin(v*5+y*.35+M)),y+=z*x*.05*Math.sin(v*2+T);const N=(d*45+a)*3;p[N]=Math.cos(v)*i+W*x*z,p[N+1]=y,p[N+2]=Math.sin(v)*i+P*x*z,G[(d*45+a)*2]=a/44,G[(d*45+a)*2+1]=d/36}const k=[];for(let d=0;d<36;d++)for(let a=0;a<44;a++){const v=d*45+a,g=v+45;k.push(v,g,v+1,v+1,g,g+1)}const b=new e.BufferGeometry;b.setAttribute("position",new e.BufferAttribute(p,3)),b.setAttribute("uv",new e.BufferAttribute(G,2)),b.setIndex(k),b.computeVertexNormals();const t=b.attributes.normal.array;for(let d=0;d<=36;d++){const a=d*45*3,v=(d*45+44)*3;for(let g=0;g<3;g++){const m=(t[a+g]+t[v+g])*.5;t[a+g]=m,t[v+g]=m}}for(let d=0;d<=44;d++)t.set([0,-1,0],d*3),t.set([0,1,0],(1620+d)*3);const A=new e.Group;A.add(new e.Mesh(b,s.shellMaterial({wash:Je,uniforms:{uSide:{value:n},uFar:{value:.86}}}))),A.add(new e.Mesh(b,s.hullMaterial({width:.75,load:1,gaps:.34,gapScale:.07,floorPx:2.6,minLoad:.82,body:.93})));let f=0;for(let d=1;d<p.length;d+=3)p[d]>p[f*3+1]&&(f=(d-1)/3);const u=(d,a)=>{const v=Math.round((a/(Math.PI*2)%1+1)%1*44)%44,g=Math.max(0,Math.min(36,Math.round(d*36))),m=(g*45+v)*3;return{p:new e.Vector3(p[m],p[m+1],p[m+2]),n:new e.Vector3(t[m],t[m+1],t[m+2]).normalize()}};return{group:A,top:new e.Vector3(p[f*3],p[f*3+1],p[f*3+2]),at:u}}export{de as FISH_DEFORM,le as PALETTE,Pe as STYLE_FRAG_GLSL,se as STYLE_GLSL,Xe as WORLD_OFFSET,ot as buildHero,ke as dabGeometry,Re as leafGeometry,st as makeBird,rt as makeBoulder,Le as makeEye,at as makeFish,Ce as makeInk,he as strokeGeometry};
