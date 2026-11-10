import*as d from"three";const te=["#10261C","#1F5A3A","#4E8B3A","#A6BF4F","#BCD3CC","#DE5B28","#EFB4BE"];function ue(c=te){const r=c.slice(0,4).map(n=>new d.Color(n)),e=[];for(let n=0;n<40;n++){const a=.18+n/39*2.82,t=Math.min(2,Math.floor(a)),o=a-t;e.push(r[t].clone().lerp(r[t+1],o))}return e}const fe=`
attribute vec4 iPivot;   // xyz plant foot (object space), w rest yaw (0 = flat faces +Z)
attribute vec4 iPlant;   // x yaw limit of the hinge (rad), y waveS (journey u at which a nod wave reaches it), z phase 0..1, w swing: +-u at which the plant swings aside (0 = never)
attribute vec4 iBase;    // xyz blade foot in plant coords (x right, y up, z toward the lens), w layer
attribute vec4 iAxis;    // xyz blade axis in plant coords (unit), w mode 0..3
attribute vec4 iSize;    // x length, y width, z let-down to white toward the tip, w nod amount (1 = 12 deg)
attribute vec4 iColA;    // rgb dark pigment, a stripes across (count; 0 none)
attribute vec4 iColB;    // rgb light pigment, a side veins (count; 0 none; negative = no midrib)
attribute vec4 iAnim;    // x wag (rad), y bob (m), z speed (rad/s), w phase
uniform float uU, uTime, uLean;
uniform vec4 uWave;
uniform vec2 uShut;
varying vec2 vXY;
varying float vG;
varying vec3 vA, vB;
varying vec4 vFx;
float jnsPulse(float d) {
  float a = smoothstep(0., .008, d) * (1. - smoothstep(.034, .054, d));
  float o = sin(3.14159 * clamp((d - .054) / .032, 0., 1.));
  return a - .22 * o;
}
float jnsNod(float s, float ph) {
  vec4 d = (uWave + (uU - uWave) * 2.5 - s) * step(uWave, vec4(uU));
  float n = jnsPulse(d.x) + jnsPulse(d.y) + jnsPulse(d.z) + jnsPulse(d.w);
  float solo = step(.966, fract(ph * 7.13));
  n += solo * jnsPulse(fract(uTime * .06 + ph * 3.7) * .4);
  n += .45 * jnsPulse(mod(uTime * .03 - s - (ph - .5) * .2, .22));   // the ambient wave: every 7.3 s a slow half nod runs up the path on world time, its front ragged by plant
  n = min(n, 1.15);
  return mix(n, 1. - n, uLean);
}
void main() {
  mat3 M = mat3(modelMatrix);
  vec3 camL = (cameraPosition - modelMatrix[3].xyz) * M;
  vec3 camR = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]) * M;
  vec3 camU = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]) * M;
  float mode = iAxis.w;
  float m0 = 1. - step(.5, mode);
  vec3 d = camL - iPivot.xyz;
  if (abs(d.x) + abs(d.z) < 1e-3) d.z = 1e-3;
  float yaw = iPivot.w;
  float dy = mod(atan(d.x, d.z) - yaw + 3.14159265, 6.2831853) - 3.14159265;
  yaw += clamp(dy, -iPlant.x, iPlant.x) * m0;
  float sw = abs(iPlant.w);
  if (sw > 0.) {
    float k = smoothstep(sw - .014, sw + .004, uU) - .14 * sin(3.14159 * clamp((uU - sw - .004) / .02, 0., 1.));
    yaw += sign(iPlant.w) * 1.22 * k;
  }
  float pb = clamp(atan(d.y, length(d.xz) + 1e-3), -.2, .61) * m0 * step(.01, iPlant.x);
  vec3 R = vec3(cos(yaw), 0., -sin(yaw)), N = vec3(sin(yaw), 0., cos(yaw)), U = vec3(0., 1., 0.);
  vec3 U1 = U * cos(pb) - N * sin(pb), N1 = N * cos(pb) + U * sin(pb);
  float nod = jnsNod(iPlant.y, iPlant.z);
  float a = iSize.w * .21 * nod;
  vec3 R2 = R * cos(a) + U1 * sin(a), U2 = U1 * cos(a) - R * sin(a);
  vec3 b = iBase.xyz, ax = iAxis.xyz;
  float th = (iAnim.z < 0. ? -uU * iAnim.z : uTime * iAnim.z) + iAnim.w * 6.2831853;   // a speed below zero is keyed to the journey (radians per whole flight), not to world time
  float wg = iAnim.x * sin(th);
  ax.xy = vec2(ax.x * cos(wg) - ax.y * sin(wg), ax.x * sin(wg) + ax.y * cos(wg));
  b.y += iAnim.y * max(0., sin(th));
  if (mode > 2.5) {       // petal: the fan
    float shut = smoothstep(iPlant.y, iPlant.y + .03, uShut.x) * (1. - smoothstep(iPlant.y, iPlant.y + .03, uShut.y));
    float h = length(ax.xz);
    ax.y += h * (.12 * nod + .05 * sin(uTime * .5 + iPlant.z * 40.));
    ax = mix(ax, vec3(ax.x * .1, 1., ax.z * .1), shut * .92);
    b.xz *= 1. - .6 * shut;
    ax /= max(length(ax), 1e-4);
  }
  vec3 axW = R2 * ax.x + U2 * ax.y + N1 * ax.z;
  vec3 bW = iPivot.xyz + R2 * b.x + U2 * b.y + N1 * b.z;
  vec3 C = bW + axW * (iSize.x * .5);
  vec3 toCam = camL - C;
  toCam /= max(length(toCam), 1e-4);
  vec3 W, Nn;
  if (mode < .5) { W = R2 * ax.y - U2 * ax.x; Nn = N1; }
  else if (mode > 1.5 && mode < 2.5) { W = cross(vec3(0., 1., 0.), axW); W /= max(length(W), 1e-4); Nn = vec3(0., 1., 0.); }
  else {
    W = cross(axW, toCam); W /= max(length(W), 1e-4);
    W *= (dot(W, camR) < 0. ? -1. : 1.);
    Nn = toCam;
  }
  vec3 P = bW + axW * (position.y * iSize.x) + W * (position.x * iSize.y * .5) + Nn * (iBase.w * .03);
  vec3 L = normalize(camU - camR);
  vG = dot(P - C, L) / max(.5 * max(iSize.x, iSize.y), 1e-3);
  vXY = position.xy;
  vA = iColA.rgb; vB = iColB.rgb;
  vFx = vec4(iColA.a, iColB.a, iSize.z, iSize.y);
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(P, 1.);
  gl_Position.z -= iBase.w * 1.5e-6 * gl_Position.w;
}
`,me=`
uniform vec3 uWhite;
varying vec2 vXY;
varying float vG;
varying vec3 vA, vB;
varying vec4 vFx;
void main() {
  float x = vXY.x, v = vXY.y;
  float fx = max(fwidth(x), 1e-5), fv = max(fwidth(v), 1e-5);
  float hasRib = step(0., vFx.y);
  float t = .5 + (smoothstep(-1.05, 1.05, vG) - .5) * .62;     // enamel: one local green per leaf, barely graded
  t = clamp(t + (x < 0. ? .19 : -.19) * hasRib, 0., 1.);       // the two halves a full tone apart at the rib
  vec3 c = mix(vA, vB, t);
  float n = vFx.x;
  if (n > .5) {                                                  // sword: striped across in two greens
    float tri = abs(fract(v * n) - .5) * 2.;
    float aa = clamp(fv * n * 2., 0., .5);
    float band = smoothstep(.5 - aa, .5 + aa, tri);
    band = mix(.5, band, smoothstep(3., 6., 1. / (n * fv)));
    c = mix(c, mix(vA, vB, t * .22), band * .9);
  }
  float k = vFx.y;
  if (k > .5) {                                                  // paddle: ruled side veins
    float q = (v - abs(x) * .3) * k;
    float dq = max(fwidth(q), 1e-5);
    float lw = max(.07, .75 * dq);
    float line = 1. - smoothstep(lw, lw + dq, abs(fract(q + .5) - .5));
    line *= 1. - smoothstep(.2, .34, dq);
    c = mix(c, mix(vB, vA, t), .3 * line);
  }
  c = mix(c, uWhite, vFx.z * smoothstep(.18, 1., v));            // white lets the tip down (petals, ruffs)
  float w = max(.022, .75 * fx);
  float r = (1. - smoothstep(w, w + fx, abs(x))) * hasRib;
  r *= smoothstep(4., 9., 2. / fx) * (1. - smoothstep(.86, .98, v));
  vec3 ribC = vFx.z > .01 ? vA : mix(vB, uWhite, .1);                 // petals: a deeper line; leaves: a light one
  c = mix(c, ribC, r * .85);
  gl_FragColor = vec4(c, 1.);
}
`;function _(c,r=!1,e=0){e&&(c=new d.SplineCurve(c.map(([i,h])=>new d.Vector2(i,h))).getPoints(e).map((i,h)=>[h===e?0:Math.max(.02,i.x),i.y]));const n=[];for(const[i,h]of c)n.push(new d.Vector2(i,h));for(let i=c.length-1;i>=0;i--){const[h,v]=c[i];h===0&&!r||n.push(new d.Vector2(-h,v))}const a=d.ShapeUtils.triangulateShape(n,[]),t=new Float32Array(n.length*3);n.forEach((i,h)=>{t[h*3]=i.x,t[h*3+1]=i.y});const o=new d.BufferGeometry;return o.setAttribute("position",new d.BufferAttribute(t,3)),o.setIndex(a.flat()),o}function pe(){const c=[[.1,0]];for(let n=0;n<9;n++){const a=.06+n/9*.9,t=a+.07,o=Math.sin(Math.PI*Math.pow((n+.6)/9.6,.7));c.push([.14+.1*o,a],[.3+.7*o,t+.035],[.16+.12*o,t+.03])}c.push([0,1]);const r=[];for(let n=0;n<=12;n++){const a=n/12*Math.PI;r.push([n===0||n===12?0:Math.sin(a),.5-.5*Math.cos(a)])}const e=[[0,.5],[.16,0]];for(let n=1;n<=11;n++){const a=n/12*Math.PI;e.push([Math.sin(a),.5-.5*Math.cos(a)])}return e.push([0,1]),{spear:_([[.1,0],[.34,.07],[.8,.22],[1,.42],[.86,.64],[.5,.85],[0,1]]),sword:_([[.45,0],[.86,.08],[1,.45],[.9,.78],[.5,.93],[0,1]]),paddle:_([[.07,0],[.09,.1],[.62,.17],[.94,.3],[1,.55],[.9,.78],[.62,.93],[.26,.99],[0,1]]),heart:_([[0,.14],[.3,.02],[.66,0],[.94,.12],[1,.32],[.84,.56],[.5,.8],[0,1]]),fern:_(c),fan:_([[.12,0],[.3,.3],[.8,.6],[1,.76],[.62,.92],[0,1]]),grass:_([[.8,0],[1,.3],[.6,.72],[0,1]]),petal:_([[.16,0],[.5,.08],[.9,.25],[1,.42],[.88,.6],[.6,.78],[.28,.92],[0,1]],!1,14),disc:_(r),pad:_(e),stalk:_([[1,0],[.8,.05],[.72,.5],[.78,.93],[1,1]],!0)}}const Q=32,ne=[0,0,0],ve=[0,1,0],we=[0,0,0,0];class xe{constructor(r){this.style=r,this.buf={},this.n={},this.meshes=[]}blade(r,e){let n=this.n[r]||0,a=this.buf[r];if(a||(a=this.buf[r]=new Float32Array(256*Q)),(n+1)*Q>a.length){const x=new Float32Array(a.length*2);x.set(a),a=this.buf[r]=x}const t=n*Q,o=e.pivot||ne,i=e.base||ne,h=e.axis||ve,v=e.anim||we;a[t]=o[0],a[t+1]=o[1],a[t+2]=o[2],a[t+3]=e.yaw||0,a[t+4]=e.limit??.87,a[t+5]=e.waveS??0,a[t+6]=e.phase??0,a[t+7]=e.swing||0,a[t+8]=i[0],a[t+9]=i[1],a[t+10]=i[2],a[t+11]=e.layer||0,a[t+12]=h[0],a[t+13]=h[1],a[t+14]=h[2],a[t+15]=e.mode||0,a[t+16]=e.len,a[t+17]=e.wid,a[t+18]=e.tip||0,a[t+19]=e.nod??1,a[t+20]=e.a.r,a[t+21]=e.a.g,a[t+22]=e.a.b,a[t+23]=e.stripes||0,a[t+24]=e.b.r,a[t+25]=e.b.g,a[t+26]=e.b.b,a[t+27]=e.veins||0,a[t+28]=v[0],a[t+29]=v[1],a[t+30]=v[2],a[t+31]=v[3],this.n[r]=n+1}plant(r,e){const n=this.style.greens,a=this.style.pig,t=e.kind||"spear",o=e.h||12,i=r(),h=r(),v=r(),x=Math.max(0,Math.min(29,e.gi??Math.floor(h*30)));let l=n[x],z=n[Math.min(39,x+8)];const q={pivot:[e.x,e.y||0,e.z],yaw:e.yaw||0,limit:e.limit,waveS:e.waveS,phase:i,swing:e.swing,nod:e.nod},M=e.count||{spear:9,paddle:7,sword:9,heart:8,fern:9,fan:11,torch:9}[t],I=o*.035+.12;t!=="sword"&&t!=="fern"&&this.blade("stalk",{...q,len:o*(t==="fan"?.62:t==="torch"?.5:.72),wid:I,a:n[Math.max(0,x-4)],b:n[Math.min(39,x+4)],veins:-1,stripes:t==="fan"?9:0});for(let p=0;p<M;p++){const T=M>1?p/(M-1):.5,y=T*2-1,E=1+(p%2?p:M-p);let A,C,w,R,J=t,V=0,F=0,U=0;if(t==="spear")A=y*1.2,C=o*(.34+.38*(1-Math.abs(y))),w=o*(.34+.1*(1-Math.abs(y))),R=w*.3;else if(t==="paddle")A=y*1.05,C=o*(.4+.3*(1-Math.abs(y))),w=o*(.42-.1*Math.abs(y)),R=w*.36,F=14;else if(t==="sword")A=y*1,C=0,w=o*(1-.3*Math.abs(y)),R=w*.13+.1,V=7+Math.floor(v*5),U=y*o*.05;else if(t==="heart"){const j=Math.floor(p/2);A=(p%2?1:-1)*1.15,C=o*(.3+.42*(j/Math.max(1,Math.ceil(M/2)-1))),w=o*.26,R=w*.8}else if(t==="fern")A=y*1.25,C=0,w=o*(1-.25*Math.abs(y)),R=w*.24,U=y*o*.04;else if(t==="fan")A=y*1.75,C=o*.62,w=o*.38,R=w*.2;else{J="spear";const j=Math.floor(p/2);A=(p%2?1:-1)*(.5-.04*j),C=o*(.42+.11*j*(5/Math.max(2,M/2))),w=o*.2,R=w*.34,l=a[5].clone().lerp(a[0],.22),z=a[5].clone().lerp(a[3],.3)}C>o&&(C=o*.96),this.blade(J,{...q,base:[U,C,0],axis:[Math.sin(A),Math.cos(A),0],layer:E,len:w,wid:R,a:l,b:z,stripes:V,veins:F})}for(let p=0;p<(e.dark||0);p++){const T=(p+.5)/e.dark*2-1,y=t==="sword"||t==="fern",E=t==="paddle"||t==="heart",A=T*(t==="fan"?1.6:1.12),C=o*(y?.9-.25*Math.abs(T):t==="fan"?.42:.45),w=y?0:o*(t==="fan"?.6:.3+.36*(1-Math.abs(T)));this.blade(E?"paddle":"spear",{...q,base:[0,w,0],axis:[Math.sin(A),Math.cos(A),0],layer:-1-p%2,len:C,wid:C*(E?.4:y?.28:.36),a:a[0],b:n[1],veins:-1})}}finish(r){for(const e of Object.keys(this.buf)){const n=this.n[e],a=this.style.geoms[e],t=new d.InstancedBufferGeometry;t.index=a.index,t.setAttribute("position",a.getAttribute("position"));const o=new d.InstancedInterleavedBuffer(this.buf[e].subarray(0,n*Q),Q,1);["iPivot","iPlant","iBase","iAxis","iSize","iColA","iColB","iAnim"].forEach((h,v)=>t.setAttribute(h,new d.InterleavedBufferAttribute(o,4,v*4))),t.instanceCount=n;const i=new d.Mesh(t,this.style.material);i.frustumCulled=!1,i.name="jns-"+e,r.add(i),this.meshes.push(i)}return this.buf={},this.meshes}}function ye(c=te){const r=te.map((i,h)=>c&&c[h]||i),e=r.map(i=>new d.Color(i)),n=new d.Color("#ffffff"),a={uU:{value:0},uTime:{value:0},uLean:{value:0},uWave:{value:new d.Vector4(.02,.28,.6,.9)},uShut:{value:new d.Vector2(-1,-1)},uWhite:{value:n}},t=new d.ShaderMaterial({uniforms:a,vertexShader:fe,fragmentShader:me,side:d.DoubleSide}),o={palette:r,pig:e,white:n,greens:ue(r),uniforms:a,material:t,geoms:pe()};return o.set=()=>new xe(o),o.flat=(i,h={})=>{const v=(h.ripples||[]).slice(0,24),x=[];for(let M=0;M<24;M++){const I=v[M]||[0,0,-1];x.push(new d.Vector3(I[0],I[1],I[2]))}const l=h.sky,z=l?l.sun.clone().normalize():new d.Vector3(0,1,0),q=Math.hypot(z.x,z.z)||1;return new d.ShaderMaterial({side:h.side??d.FrontSide,defines:l?{JNS_REFL:1}:{},uniforms:{uU:a.uU,uTime:a.uTime,uCol:{value:new d.Color(i)},uLine:{value:n.clone().lerp(new d.Color(i),.45)},uDark:{value:new d.Color(i).lerp(e[1],.2)},uC:{value:x},uN:{value:v.length},uSkyTop:{value:new d.Color(l?l.top:i)},uSkyMid:{value:new d.Color(l?l.mid:i)},uSkyLow:{value:new d.Color(l?l.low:i)},uSkyDisc:{value:new d.Color(l?l.disc:i)},uSunH:{value:new d.Vector4(z.x/q,z.z/q,z.y,q)},uSkyP:{value:new d.Vector4(l?.band??.2,l?.span??.5,Math.sin((l?.size??6)*.5*Math.PI/180),l?.amount??.85)},uShore:{value:new d.Vector4(0,0,75,75)},uRefl:{value:new d.Vector4(50,34,9,0)},uReflC:{value:e[1].clone().lerp(e[0],.4)}},vertexShader:"varying vec3 vP, vW; void main(){ vP = position; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
        uniform vec3 uCol, uLine, uDark, uSkyTop, uSkyMid, uSkyLow, uSkyDisc, uReflC; uniform vec4 uSunH, uSkyP, uShore, uRefl;
        uniform vec3 uC[24]; uniform float uU, uTime; uniform int uN; varying vec3 vP, vW;
        void main() {
          vec2 p = vP.xz; float px = max(max(fwidth(p.x), fwidth(p.y)), 1e-4);
          float lw = max(.07, .75 * px), per = 2.4, keep = 1. - smoothstep(per / 6., per / 3., px);
          vec3 base = uCol; float rfl = 0.;
          #ifdef JNS_REFL
          {
            vec3 v = vW - cameraPosition; v /= max(length(v), 1e-4);
            float ry = max(-v.y, 0.);                               // sine of the mirrored ray's elevation
            vec3 g = mix(uSkyLow, uSkyMid, smoothstep(0., max(uSkyP.x, 1e-3), ry));
            g = mix(g, uSkyTop, smoothstep(uSkyP.x, max(uSkyP.y, uSkyP.x + 1e-3), ry));
            base = mix(uCol, g, uSkyP.w);
            vec2 hr = v.xz / max(length(v.xz), 1e-4);
            float q = ry * 46., fq = max(fwidth(q), 1e-5);
            float odd = step(.5, fract(floor(q) * .5));
            float cr = (hr.x * uSunH.y - hr.y * uSunH.x) * uSunH.w;
            float de = (ry - uSunH.z) * .36;
            float e = max(1.45 * fwidth(cr) + fwidth(de), 1e-5);     // taken before the bars break it
            cr *= 1. + .45 * odd;
            float m = sqrt(cr * cr + de * de);
            float disc = (1. - smoothstep(uSkyP.z - e, uSkyP.z + e, m)) * step(0., dot(hr, uSunH.xy));
            float tri = abs(fract(q) - .5) * 2., aa = clamp(fq * 2., 0., .5);
            float bar = mix(.62, smoothstep(.38 - aa, .38 + aa, tri), 1. - smoothstep(.2, .34, fq));
            base = mix(base, uSkyDisc, disc * bar * .9);
            // the trees stand in the water too: a band of their dark green lies on the water under every shore, its inner
            // edge cut to a row of round heads (wider toward the far shore, thin under the disc so its ladder stays);
            // flat paint, hard edged, no gloss
            vec2 rad = max(uShore.zw, vec2(1e-3));
            vec2 q0 = (vW.xz - uShore.xy) / rad;
            float lq = max(length(q0), 1e-4);
            float dEdge = (1. - lq) / max(length(q0 / (lq * rad)), 1e-5);     // metres to the shore
            float th = atan(q0.x + step(lq, 2e-4), q0.y);
            float heads = .55 + .45 * abs(sin(th * uRefl.y * .5)) * (.8 + .2 * sin(th * uRefl.z + 2.));
            float farS = .5 + .5 * dot(q0 / lq, hr);                           // 1 on the shore we look toward
            float sunward = clamp(smoothstep(.14, .3, abs(hr.x * uSunH.y - hr.y * uSunH.x)) + step(dot(hr, uSunH.xy), 0.), 0., 1.);
            float dd = uRefl.x * heads * mix(.45, 1., farS) * mix(.35, 1., sunward) - dEdge;
            // and the far bank's own reflection, as the eye has it: the mirrored ray runs on to the shore, and a hedge
            // of round heads there stands above it (low over the water it darkens the far third; from above, a rim)
            vec2 dq = hr / rad; float dl = max(length(dq), 1e-5); vec2 dn = dq / dl;
            float bq = dot(q0, dn), tq = max(-bq + sqrt(max(bq * bq - (lq * lq - 1.), 0.)), 0.) / dl;
            vec2 hit = q0 + dn * (tq * dl); hit.y += step(dot(hit, hit), 1e-8);
            float th2 = atan(hit.x, hit.y);
            float hedge = uRefl.x * .22 * (.8 + .2 * sin(th2 * uRefl.y)) * (.85 + .15 * sin(th2 * uRefl.z + 1.)) * mix(.2, 1., sunward);
            dd = max(dd, hedge - tq * ry / max(sqrt(max(1. - ry * ry, 0.)), 1e-3));
            float ed = max(fwidth(dd), 1e-4);
            rfl = uRefl.w * smoothstep(-ed, ed, dd);
            base = mix(base, uReflC, rfl);
          }
          #endif
          float hi = 0., lo = 0.;
          for (int i = 0; i < 24; i++) {
            if (i >= uN) break;
            float r = length(p - uC[i].xy);
            float q = r / per - (uU * 16. + uTime * .1 + uC[i].z);
            float line = 1. - smoothstep(lw, lw + px, abs(fract(q + .5) - .5) * per);
            line *= smoothstep(1.4, 2.6, r) * (1. - smoothstep(5., 13., r));
            float odd = step(.5, fract(floor(q + .5) * .5));
            hi = max(hi, line * odd); lo = max(lo, line * (1. - odd));
          }
          vec3 c = mix(base, mix(base, uDark, .8), lo * keep);
          c = mix(c, mix(uLine, base, .6 * rfl), hi * keep);        // on the dark of the reflection the ruled rings are quiet
          gl_FragColor = vec4(c, 1.);
        }`})},o.sky=(i={})=>new d.ShaderMaterial({side:d.BackSide,depthWrite:!1,uniforms:{uTop:{value:new d.Color(i.top||e[4])},uLow:{value:new d.Color(i.low||e[4].clone().lerp(e[6],.38))},uDisc:{value:new d.Color(i.disc||e[5])},uSun:{value:(i.sun||new d.Vector3(.2,.19,-.96)).clone().normalize()},uRad:{value:(i.size??6)*.5*Math.PI/180},uGround:{value:new d.Color(i.ground||e[0])},uHasGround:{value:i.ground?1:0},uSpan:{value:i.span??.5},uBand:{value:i.band??.2},uStand:{value:i.stand??-1},uMid:{value:new d.Color(i.mid||new d.Color(i.low||e[4].clone().lerp(e[6],.38)).lerp(new d.Color(i.top||e[4]),.4))}},vertexShader:"varying vec3 vD; void main(){ vD = mat3(modelMatrix) * position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform vec3 uTop, uMid, uLow, uDisc, uSun, uGround; uniform float uRad, uHasGround, uSpan, uBand, uStand; varying vec3 vD;
      void main() {
        vec3 d = vD / max(length(vD), 1e-4);
        vec3 c = mix(uLow, uMid, smoothstep(0., max(uBand, 1e-3), d.y));
        c = mix(c, uTop, smoothstep(uBand, max(uSpan, uBand + 1e-3), d.y));
        // opts.stand (sine of elevation): uLow stands flat from the horizon up to it, then ONE smooth grade runs through
        // uMid (reached half way) to uTop at uSpan, with no step and no plateau at the middle stop
        float gt = smoothstep(max(uStand, 0.), max(uSpan, max(uStand, 0.) + 1e-3), d.y) * 2.;
        vec3 c2 = mix(mix(uLow, uMid, clamp(gt, 0., 1.)), uTop, clamp(gt - 1., 0., 1.));
        c = mix(c, c2, step(0., uStand));
        float ang = acos(clamp(dot(d, uSun), -1., 1.));
        float e = max(fwidth(ang), 1e-5);
        c = mix(c, uDisc, 1. - smoothstep(uRad - e, uRad + e, ang));
        float ey = max(fwidth(d.y), 1e-5);
        c = mix(c, uGround, uHasGround * (1. - smoothstep(-ey, ey, d.y + .004)));   // below the horizon: the bank's dark paint (opts.ground)
        gl_FragColor = vec4(c, 1.);
      }`}),o}function be(c,r,e=.7,n={}){const a=c.style.pig,t=c.style.greens,{back:o=!0,flip:i=1,gi:h=9,...v}=n,x={pivot:[r.x,r.y,r.z],yaw:r.yaw||0,limit:3.2,waveS:r.waveS??0,nod:0,veins:-1,...v};if(o){for(const l of[-1,0,1])c.blade(l?"spear":"paddle",{...x,base:[0,-e*1.7,0],axis:[Math.sin(l*.85),Math.cos(l*.85),0],len:e*(l?4.1:4.4),wid:e*(l?1.9:2.5),a:a[0],b:a[0],layer:-2});c.blade("spear",{...x,base:[-i*e*2.1,-e*.75,0],axis:[i*.87,.5,0],len:e*2.7,wid:e*.95,a:t[h],b:t[h+9],layer:4,veins:0})}for(const l of[-1,1])c.blade("disc",{...x,base:[l*e*.72,0,0],len:e,wid:e,a:a[2],b:a[3],layer:1}),c.blade("disc",{...x,base:[l*e*.72,e*.27,0],len:e*.46,wid:e*.46,a:a[0],b:a[0],layer:2})}function Me(c,r,e,n={}){const a=c.style.pig,t=(n.size||2.4)/2.4,o=r(),i=1.5+r()*.5,h=n.dark?a[0].clone().lerp(a[1],.15):a[5].clone().lerp(a[0],.66),v=n.dark?a[1].clone().lerp(a[2],.2):a[5].clone().lerp(a[0],.3),x={pivot:[e.x,e.y,e.z],yaw:e.yaw||0,limit:3.2,waveS:e.waveS??0,phase:o,nod:n.nod??.35},l=(M,I,p,T,y,E,A,C=h,w=v,R={})=>c.blade(M,{...x,base:[I*t,p*t,0],axis:[Math.sin(T),Math.cos(T),0],len:y*t,wid:E*t,layer:A,a:C,b:w,veins:-1,...R});l("sword",.3,.3,2,1.5,.17,20),l("spear",-.2,.42,-2,.95,.34,21),l("spear",.2,.42,2,.95,.34,21),l("paddle",0,.05,0,1.5,.95,22),l("disc",0,.42,0,.6,.5,23,v,a[5].clone().lerp(a[3],.35)),l("sword",-.36,1.3,-2.55,.95,.24,24),l("sword",.36,1.3,1.25,.95,.24,24,h,v,{anim:[.55,0,i,o]});const z=a[4],q=c.style.white.clone().lerp(a[4],.25);l("disc",0,1.22,0,1.2,1.2,25,z,q),l("disc",-.44,1.86,0,.3,.3,26),l("disc",.44,1.86,0,.3,.3,26),l("disc",0,1.4,0,.86,.82,27),l("disc",0,1.42,0,.36,.44,28,z,q);for(const M of[-1,1])l("disc",M*.19,1.8,0,.27,.27,29,a[2],a[3]),l("disc",M*.19,1.875,0,.12,.12,30,a[0],a[0]);n.orange!==!1&&l("disc",1.3,1.45,0,.62,.62,31,a[5],a[5].clone().lerp(a[3],.55),{anim:[0,1.5*t,i,o]})}const oe=[[28,50],[55,52],[107,64],[134,68],[163,53],[168,33],[190,50],[214,51],[258,53],[283,47],[311,49]];function re(c,r,e){const n=c.style,a=n.greens,t=n.pig,o=e.R,i=e.foot,h=e.heart,v=7+Math.floor(r()*3),x=8+Math.floor(r()*10),l=(r()<.5?-1:1)*(.5+r()*.5),z=r()*6.283,q=e.thick||2.4,M=e.waveS??0,I=e.waveTop??M,p=r(),T=[];for(let m=0;m<=v;m++){const L=m/v,D=m===0||m===v?0:l*(m%2?1:-1);T.push([i[0]+(h[0]-i[0])*L+Math.cos(z)*D,i[1]+(h[1]-i[1])*L,i[2]+(h[2]-i[2])*L+Math.sin(z)*D])}for(let m=0;m<v;m++){const L=T[m],D=T[m+1],G=D[0]-L[0],Y=D[1]-L[1],Z=D[2]-L[2],X=Math.hypot(G,Y,Z),O=m/v,s=q*(1-.38*O),f=M+(I-M)*O,B={pivot:L,limit:0,waveS:f,phase:p,nod:0,mode:1,axis:[G/X,Y/X,Z/X]};if(c.blade("stalk",{...B,len:X,wid:s,a:a[x-5],b:a[x+12],layer:1}),m>0&&c.blade("stalk",{...B,base:[0,-.3,0],len:.75,wid:s*1.22,a:a[Math.max(0,x-8)],b:a[x+3],layer:2,veins:-1}),m>0&&m<v){const k=m%2?1:-1,u=r()<.3,b=(r()-.5)*.9,g=(7+r()*4.5)*(1-.3*O),P=4+Math.floor(r()*16);for(const S of u?[k,-k]:[k]){const W=S*(.95+r()*.3);let N=g;e.reachX!=null&&S>0&&(N=Math.min(N,e.reachX)),e.reach!=null&&(N=Math.min(N,e.reach)),c.blade("sword",{pivot:L,yaw:b,limit:.87,waveS:f,phase:p+m*.13,base:[0,0,0],axis:[Math.sin(W*.8),Math.cos(W*.8),0],len:N*.3,wid:.3,a:a[x-4],b:a[x+8],layer:3,veins:-1}),c.blade("paddle",{pivot:L,yaw:b,limit:.87,waveS:f,phase:p+m*.13,base:[Math.sin(W*.8)*N*.22,Math.cos(W*.8)*N*.22,0],axis:[Math.sin(W),Math.cos(W),0],len:N,wid:N*.38,a:a[P],b:a[P+9],layer:4,veins:15})}}}const y=t[6],E=n.white,A=t[4],C=e.pale?A.clone().lerp(t[1],.16):y.clone().lerp(t[5],.2),w=e.pale?A.clone().lerp(E,.6):y.clone().lerp(E,.5),R={pivot:h,limit:0,waveS:I,phase:p,nod:.45},J=!!e.lite,V=J?"spear":"petal",F=(m,L,D,G,Y,Z,X,O,s,f,B,k=V,u=0,b=0)=>{for(let g=0;g<m;g++){const P=Z+g/m*6.2832,S=L+(g%2?.06:-.06),W=Math.cos(S);c.blade(k,{...R,mode:X,base:[Math.sin(P)*Y,b,Math.cos(P)*Y],axis:[Math.sin(P)*W,Math.sin(S),Math.cos(P)*W],len:D,wid:G,a:O,b:s,tip:f,layer:B,veins:u})}},U=r()*6.28,j=t[0],H=a[4];F(8,-.14,o*.46,o*.26,o*.05,U+.2,3,a[1],a[10],0,1,V,0,-o*.03),F(12,.2,o*.6,o*.24,o*.06,U+.262,3,j,H,0,2,V,-1),F(12,.25,o,o*.31,o*.07,U,3,C,w,.5,3),F(9,.46,o*.5,o*.24,o*.1,U+.52,3,j,H,0,4,V,-1),F(9,.5,o*.84,o*.31,o*.13,U+.17,3,C,w,.5,5),F(7,1,o*.42,o*.25,o*.2,U+.6,3,C.clone().lerp(e.pale?t[1]:t[5],.1),w,.45,6),c.blade("stalk",{...R,mode:1,len:o*.4,wid:o*.34,a:a[19],b:a[38],layer:7}),c.blade("disc",{...R,mode:2,base:[0,o*.4,-o*.17],axis:[0,0,1],len:o*.34,wid:o*.34,a:a[26],b:a[39],layer:1,veins:-1}),J||F(14,.95,o*.24,o*.035,o*.18,U,1,a[24],a[39],0,7,"grass",-1,o*.02);for(let m=0;m<(J?0:7);m++){const L=m?U+m*1.047:0,D=m?o*.105:0,G=o*.06;c.blade("disc",{...R,mode:2,base:[Math.sin(L)*D,o*.4,Math.cos(L)*D-G*.5],axis:[0,0,1],len:G,wid:G,a:a[2],b:a[12],layer:3,veins:-1})}return{heart:h,foot:i,R:o,seat:[h[0],h[1]+o*.4,h[2]],joints:T}}async function ge(c,r={}){const e=c.rng,n=ye(r.palette),a=n.greens,t=n.pig,o=Math.max(.6,Math.min(1,r.detail??c.quality?.detail??1)),i=r.backdrop??!0,[h,v]=r.uSpan||[.26,.56],x=h+(v-h)*.63,l=s=>s>17?h+(x-h)*Math.min(1.3,(120-s)/103):x+(v-x)*Math.min(1.6,(17-s)/70),z=new d.Group;z.name="lotus-stand";const q=n.set();await c.yield();const M=[],I=-7+(e()-.5)*1.5,p=re(q,e,{foot:[I+(e()-.5)*3,0,3+e()*3],heart:[I,63,0],R:12,pale:!1,waveS:l(17)-.14,waveTop:l(17),reachX:4.2,thick:2.4});M.push(p);const T=e()<.5,y=[[4.5,-7],[20,-16],[40,-27],[62,-36],[75,-40]],E=(s,f)=>{let B=1e9;for(let k=0;k+1<y.length;k++){const u=y[k][0],b=y[k][1],g=y[k+1][0]-u,P=y[k+1][1]-b,S=Math.max(0,Math.min(1,((s-u)*g+(f-b)*P)/(g*g+P*P)));B=Math.min(B,Math.hypot(s-u-g*S,f-b-P*S))}return B};for(let s=0;s<oe.length;s++){const f=(oe[s][0]+(e()-.5)*6)*Math.PI/180,B=oe[s][1]+(e()-.5)*5,k=Math.sin(f)*B,u=Math.cos(f)*B,b=s===5?92+e()*0:s>7?79+e()*7:53+e()*14,g=s===5?10.5+e()*0:8+e()*2.4,P=2+e()*4,S=e()*6.283,W=E(k,u);M.push(re(q,e,{foot:[k+Math.cos(S)*P,0,u+Math.sin(S)*P],heart:[k,b,u],R:g,pale:s%2===0===T,waveS:l(u)-.05,waveTop:l(u),reach:s===5?7:s>7?4.5:W<20?Math.max(2.5,W-7.5):null,thick:1.9+e()*.5})),s%4===3&&await c.yield()}Me(q,e,{x:p.seat[0],y:p.seat[1]-.2,z:p.seat[2],waveS:l(17)},{size:3.7,dark:r.darkMonkey??e()<.15});const A=M.map(s=>[s.foot[0],s.foot[2],e()]);if(r.pads!==!1){const s=Math.round(34*o);for(let f=0;f<34;f++){const B=e()*6.283,k=8+Math.sqrt(e())*60,u=5+e()*4,b=e()*6.283,g=10+Math.floor(e()*12),P=e();if(f>=s)continue;const S=Math.sin(B)*k,W=Math.cos(B)*k;M.some(N=>Math.hypot(N.foot[0]-S,N.foot[2]-W)<u*.5+2)||(q.blade("pad",{pivot:[S,.04,W],limit:0,nod:0,mode:2,base:[-Math.sin(b)*u*.5,0,-Math.cos(b)*u*.5],axis:[Math.sin(b),0,Math.cos(b)],len:u,wid:u,a:a[g],b:a[g+12],layer:2+f%3,phase:P}),A.length<24&&f%2===0&&A.push([S,W,P]))}}if(r.pool!==!1){const s=new d.Mesh(new d.CircleGeometry(75,72).rotateX(-Math.PI/2),n.flat(t[4],{ripples:A,sky:r.waterSky}));s.name="pool",z.add(s)}await c.yield();const C=[0,22,150],w=M.map(s=>Math.atan2(-s.heart[0],C[2]-s.heart[2])*180/Math.PI).filter(s=>s>2&&s<22).sort((s,f)=>s-f);let R=12,J=0;for(let s=0;s+1<w.length;s++){const f=(w[s]+w[s+1])/2;w[s+1]-w[s]>J&&f>7&&f<17&&(J=w[s+1]-w[s],R=f)}const V=R*Math.PI/180,F=11*Math.PI/180,U=new d.Vector3(-Math.sin(V)*Math.cos(F),Math.sin(F),-Math.cos(V)*Math.cos(F));let j=null;if(i){const s=[[75,-.05],[79,.4],[140,20],[1500,20]].map(([u,b])=>new d.Vector2(u,b)),f=new d.Mesh(new d.LatheGeometry(s,72),n.flat(t[0],{side:d.DoubleSide}));f.name="bank",z.add(f);const B=["spear","paddle","spear","heart","fern","paddle","fan","sword","spear","paddle"];let k=0;for(let u=0;u<7;u++){const b=81+u*9,g=Math.floor(6.283*b/(9.5+u*.6)),P=e()*6.283;for(let S=0;S<g;S++){const W=P+S/g*6.283+(e()-.5)*.04,N=b+(e()-.5)*4,$=Math.sin(W)*N,ee=Math.cos(W)*N,ie=e(),K=e(),le=e()<o||u<2,se=ie>.93,ae=se?"torch":B[Math.floor(ie*10.7)%10],de=.4+Math.max(0,N-79)*.32,he=1+u*.12,ce=(ae==="sword"?7+K*5:ae==="fern"?9+K*6:se?16+K*10:12+K*16)*he;if(!le){e(),e(),e();continue}q.plant(e,{x:$,y:de,z:ee,yaw:Math.atan2(-$,-ee)+(K-.5)*.5,h:ce,kind:ae,waveS:l(ee)+Math.abs($)/150*.05}),++k%120===0&&await c.yield()}}for(let u=0;u<150;u++){const b=u/150*6.283,g=300+e()*120,P=45+e()*40,S=e();q.plant(e,{x:Math.sin(b)*g,y:14,z:Math.cos(b)*g,yaw:b+Math.PI,h:P,kind:S<.5?"spear":S<.8?"paddle":"fan",waveS:.5})}for(let u=0;u<8;u++){const b=(e()-.5)*2.4+(u%2?0:Math.PI),g=84+e()*14,P=Math.sin(b)*g,S=Math.cos(b)*g;be(q,{x:P,y:4+e()*8,z:S,waveS:l(S)},.9+e()*.5)}j=new d.Mesh(new d.SphereGeometry(2600,32,16),n.sky({sun:U})),j.renderOrder=-.5,j.frustumCulled=!1,j.name="sky",z.add(j)}await c.yield(),q.finish(z),await c.yield();const H=p.heart,m=(s,f)=>[H[0]+18*Math.sin(s*Math.PI/180),f,18*Math.cos(s*Math.PI/180)],L={flyThrough:[[3.5,12,150],[3.5,30,105],[3.5,49,58],[3.5,62,24],m(44,67),m(70,68),m(90,68),m(113,66.5),[20,58,-16],[40,41,-27],[62,23,-36],[75,13,-40]],viewpoints:{reveal:{from:C,lookAt:[0,50,0]},closest:{from:m(80,68),lookAt:[H[0],H[1]+4.5,H[2]]},level:{from:m(113,65),lookAt:[-30,60,-50]}},great:{heart:H.slice(),foot:p.foot.slice(),radius:12,monkey:[p.seat[0],p.seat[1]+1.6,p.seat[2]]},blooms:M.map(s=>({heart:s.heart.slice(),foot:s.foot.slice(),radius:s.R})),poolRadius:75,sunDir:U.toArray(),sunBearingPort:R,treeSeat:[78,0,-42],portalSeat:{position:[104,5,-168],facing:[-.208,0,.978],radius:7},uSpan:[h,v],uOf:l};let D=!1;const G=n.uniforms,Y=!!r.shut,Z=l(17),X=s=>{if(D=!0,G.uU.value=s,Y){const f=Math.min(1,Math.max(0,(s-.36)/.08));G.uShut.value.set(s<.36?-1:h-.1+f*(v+.3-h),s<.455?-1:Z-.03+(s-.455)*1.6)}},O=new d.Vector3;return{object:z,style:n,anchors:L,setProgress:X,setShut(s,f){G.uShut.value.set(s,f)},radius:75,height:82,center:new d.Vector3(0,40,0),ground:!1,groundY:0,update(s,f,B){if(G.uTime.value=f,!D){const k=f*.024%1;G.uU.value=k,Y&&(X(k),D=!1)}j&&B&&(O.setFromMatrixPosition(B.matrixWorld),z.worldToLocal(O),j.position.copy(O))},dispose(){}}}export{me as JNS_BLADE_FRAG,fe as JNS_BLADE_VERT,te as JNS_PALETTE,xe as JnsBladeSet,ge as buildHero,be as jnsEyes,ue as jnsGreens,re as jnsLotus,Me as jnsMonkey,ye as makeJnsStyle};
