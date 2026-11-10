import*as o from"three";import{clamp as ee,lerp as ce,smoothstep as K,hashSeed as pe,makeRng as ve}from"../kit/core.js";const me=["#0A0418","#1B0F4A","#3A1470","#FF2BD6","#19F0FF","#FF5A7A","#FFB000"],C=1020,V=14,xe=7,E=21,fe=61,z=13,Y=1046,te=1.2,de=32,we=e=>(e=ee(e,0,1),e*e*e*(e*(e*6-15)+10)),ae=`
uniform vec3 uInkA, uInkB, uInkA2, uInkB2, uAmber;
uniform float uWipeZ;
vec3 ink(float slot, float wz) {
  float k = step(uWipeZ, wz);
  vec3 a = mix(uInkA, uInkA2, k), b = mix(uInkB, uInkB2, k);
  return slot < 0.5 ? a : (slot < 1.5 ? b : (slot < 2.5 ? uAmber : vec3(1.0)));
}
float lineP(float d, float w, float hw) {
  float px = max(w, 1e-4) * 1.2;
  float h = max(hw, px);
  return (1.0 - smoothstep(h * 0.35, h, d)) * clamp(hw / px, 0.45, 1.0);
}
vec3 hot(vec3 c, float p) { return c * (p * 1.4) + vec3(1.0) * smoothstep(0.72, 1.0, p) * 0.55; }
`,ge=`
float wetH(float n) { return fract(sin(n * 127.1) * 43758.5453); }
float wetStreak(float x, float s, float wx, float ws, float beat, float pitch, float per, float seed) {
  float q = x / pitch, st = wetH(floor(q) + seed);
  float dx = abs(fract(q) - 0.5) * pitch;
  float core = lineP(dx, wx, 0.08) + 0.4 * (1.0 - smoothstep(0.05, pitch * 0.5, dx));
  float sg = fract(s / per + st * 7.0);
  float on = smoothstep(0.0, 0.06, sg) * (1.0 - smoothstep(0.36, 0.55, sg));
  on = mix(on, 0.42, smoothstep(per * 0.25, per * 0.8, ws));
  float tw = 0.7 + 0.3 * sin(beat * 6.2832 + st * 20.0);
  return core * on * step(0.35, st) * tw * (1.0 - smoothstep(0.3, 0.7, wx));
}
// the headlamp's amber on the wet tarmac: short broken strokes fanning out 4 to 36 m ahead (x from the rider, d view depth)
float wetLamp(float x, float s, float wx, float ws, float d) {
  float fanW = 0.4 + d * 0.06;
  float q = x / 0.36, dx = abs(fract(q) - 0.5) * 0.36, st = wetH(floor(q) + 31.0);
  float sg = fract(s / 2.4 + st * 3.0);
  float on = mix(step(sg, 0.5), 0.5, smoothstep(0.6, 2.0, ws));
  return (lineP(dx, wx, 0.045) + 0.2) * on * (1.0 - smoothstep(fanW * 0.55, fanW, abs(x))) * smoothstep(3.0, 6.0, d) * (1.0 - smoothstep(22.0, 38.0, d));
}
`,oe=`
#ifdef USE_FOG
  varying float vFogDepth;
#endif
`,ne=`
#ifdef USE_FOG
  varying float vFogDepth;
  uniform vec3 fogColor;
  #ifdef FOG_EXP2
    uniform float fogDensity;
  #else
    uniform float fogNear; uniform float fogFar;
  #endif
  float fogAmt() {
    #ifdef FOG_EXP2
      return 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      return smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  }
#endif
`,re=`
#ifdef USE_FOG
  col *= 1.0 - fogAmt();
#endif
`,he=`
#ifdef USE_FOG
  { float fa = fogAmt(); col = mix(col, fogColor * 0.35, fa) ; }
#endif
`;function ye(e,t,i){const k=new Float32Array(t*32),w=new Float32Array(t*32),m=new Float32Array(32),p=new Float32Array(32),g=new Float32Array(32),h=new Float32Array(32),s=new Float32Array(32);for(let v=0;v<32;v++){const y=v%16;i===1?(m[v]=y===0?1:y===10?.7:0,p[v]=y===8?1:0,g[v]=y%4===0?.8:y%4===2?.4:0):i===2?(m[v]=y===0||y===6||y===10?1:0,p[v]=y===4||y===13?1:0,g[v]=y%2===0?.85:.5):(m[v]=y%4===0?1:0,p[v]=y===4||y===12?1:0,g[v]=y%2===0?y%4===2?1:.7:0),h[v]=e.chance(i===1?.22:.4)?e.range(.45,.85):0}let r=e.range(.35,.65),l=e.sign();const n=i===2?.06:.035,u=i===2?1:2;for(let v=0;v<32;v++)v%u===0?(r+=l*n*e.range(.7,1.5),(r>.74||r<.28||e.chance(.12))&&(l=-l),r=ee(r,.26,.76),s[v]=r):s[v]=-1;const A=new Float32Array(t),W=new Float32Array(t);for(let v=0;v<t;v++){const y=v/(t-1),O=1-K(.02,.36,y),U=K(.2,.36,y)*(1-K(.6,.78,y)),q=K(.62,.95,y),R=K(.05,.16,y)*(1-K(.3,.46,y));A[v]=ce(i===1?.5:.9,4.5,Math.pow(y,1.3)),W[v]=.05+.08*e();for(let f=0;f<32;f++){let b=.1+.1*e();const d=O*m[f]*(.82+.18*Math.cos(y*9));b=Math.max(b,d,U*p[f]*.8,q*g[f]*(.55+.45*e()),R*h[f]),s[f]>=0&&(b=Math.max(b,.92*Math.exp(-Math.pow((y-s[f])/.045,2)))),k[v*32+f]=b,w[v*32+f]=Math.max(.04,d)}}function B(v,y,O){const U=v*4,q=Math.floor(U);for(let R=0;R<t;R++){let f=0,b=0;const d=A[R];for(let x=0;x<34;x++){const D=q-x,M=(U-D)/4,I=R*32+(D%32+32)%32,L=ce(w[I],k[I],y);if(x<14){const $=L*K(0,.08,M)*Math.exp(-d*Math.max(0,M-.08));$>f&&(f=$)}const G=L*K(0,.08,M)*(1-Math.max(0,M-.35)*.75);G>b&&(b=G)}f=Math.max(f,y*W[R]*(.8+.2*Math.sin(v*.785+R*1.7))),O[R].set(f,Math.max(b,f))}}return{evaluate:B}}function be(e){const i=.0022388059701492534,c=i*160/3,k=r=>{if(r<=180)return 0;if(r>=840)return 1;if(r<340){const n=(r-180)/160;return c*n*n*n}if(r<=680)return c+i*(r-340);const l=(840-r)/160;return 1-c*l*l*l},w=r=>fe+(z-fe)*we(r/C),m=new o.Vector3,p=new o.Vector3,g=new o.Vector3(1,0,0);function h(r){const l=w(r),n=w(r+.5)-w(r-.5);m.set(0,n,-1).normalize(),p.crossVectors(g,m).normalize();const u=k(r)*Math.PI*2*e,A=Math.cos(u),W=Math.sin(u);return{axis:new o.Vector3(0,l,C-r),t:m.clone(),phi:u,r:new o.Vector3().copy(g).multiplyScalar(A).addScaledVector(p,W),u:new o.Vector3().copy(g).multiplyScalar(-W).addScaledVector(p,A)}}function s(r,l){const n=w(r),u=w(r+.5)-w(r-.5);l.t.set(0,u,-1).normalize(),p.crossVectors(g,l.t).normalize();const A=k(r)*Math.PI*2*e,W=Math.cos(A),B=Math.sin(A);return l.axis.set(0,n,C-r),l.phi=A,l.r.copy(g).multiplyScalar(W).addScaledVector(p,B),l.u.copy(g).multiplyScalar(-B).addScaledVector(p,W),l}return{ladder:h,ladderInto:s,roadY:w,phase01:k}}function ie(e,t={}){const i=[],c=[],k=[],w=(p,g,h,s,r=-1,l=1)=>{i.push(p.x,p.y,p.z),c.push(g.x,g.y,g.z),k.push(h,s,r,l)};function m(p=null,g=!1){const h=new o.InstancedBufferGeometry;if(h.setAttribute("position",new o.BufferAttribute(new Float32Array([0,-1,0,1,-1,0,1,1,0,0,1,0]),3)),h.setIndex([0,1,2,0,2,3]),p)for(const l in p)h.setAttribute(l,new o.InstancedBufferAttribute(p[l].array,p[l].size));if(h.setAttribute("aA",new o.InstancedBufferAttribute(new Float32Array(i),3)),h.setAttribute("aB",new o.InstancedBufferAttribute(new Float32Array(c),3)),h.setAttribute("aW",new o.InstancedBufferAttribute(new Float32Array(k),4)),h.instanceCount=i.length/3,g)for(const l of["aA","aB","aW"])h.attributes[l].setUsage(o.DynamicDrawUsage);const s=new o.ShaderMaterial({uniforms:e,fog:!0,transparent:!0,depthWrite:!1,depthTest:t.depthTest!==!1,blending:o.AdditiveBlending,side:o.DoubleSide,vertexShader:`
        attribute vec3 aA, aB; attribute vec4 aW;
        uniform vec2 uRes; uniform float uBeat;
        varying vec4 vL; varying vec3 vP;
        ${oe}
        ${t.pre||""}
        void main() {
          vec3 A = aA, B = aB; float gMul = 1.0;
          ${t.xform||""}
          vec4 ca = modelViewMatrix * vec4(A, 1.0), cb = modelViewMatrix * vec4(B, 1.0);
          float nz = -0.3;
          if (ca.z > nz && cb.z > nz) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vL = vec4(0.0); vP = vec3(0.0); return; }
          if (ca.z > nz) ca = mix(cb, ca, (nz - cb.z) / max(ca.z - cb.z, 1e-4));
          if (cb.z > nz) cb = mix(ca, cb, (nz - ca.z) / max(cb.z - ca.z, 1e-4));
          vec4 pa = projectionMatrix * ca, pb = projectionMatrix * cb;
          vec2 d = (pb.xy / pb.w - pa.xy / pa.w) * uRes;
          float dl = length(d); vec2 dir = dl > 1e-3 ? d / dl : vec2(1.0, 0.0);
          vec2 nrm = vec2(-dir.y, dir.x);
          vec4 cv = mix(ca, cb, position.x); vec4 p = mix(pa, pb, position.x);
          float depth = max(-cv.z, 0.3);
          float pxPerM = uRes.y * 0.5 * projectionMatrix[1][1] / depth;
          float corePx = aW.x * pxPerM * 0.5;
          float k = clamp(corePx / 1.1, 0.1, 1.0);
          float halfPx = clamp(corePx, 1.1, max(1.3, uRes.y / 300.0)) * 2.4;
          // lines seen end-on (rails and stringers running to the vanishing point) are dimmed so they do not pile up to white
          float expect = length(cb.xyz - ca.xyz) * uRes.y * 0.5 * projectionMatrix[1][1] / max(-0.5 * (ca.z + cb.z), 0.3);
          float fs = clamp(dl * 0.5 / max(expect, 1e-3) * 5.0, 0.4, 1.0);
          p.xy += (nrm * position.y * halfPx + dir * (position.x * 2.0 - 1.0) * halfPx * 0.25) / uRes * 2.0 * p.w;
          gl_Position = p;
          // beat flare for phased elements: a chase that runs along the causeway once a bar
          // phase 2..3: a pulse that leaves the rider on every beat and runs ahead (phase = 2 + path distance / 4 beats)
          float fl = aW.z < 0.0 ? 0.0 : (aW.z < 1.5 ? exp(-7.0 * fract(uBeat * 0.25 - aW.z)) : exp(-6.0 * fract(uBeat * 1.25 - aW.z)));
          vL = vec4(position.y, aW.y, aW.w * gMul * fs * (1.0 + 1.3 * fl) * mix(1.0, 0.5, clamp(depth / 1500.0, 0.0, 1.0)), k);
          vP = mix(A, B, position.x);
          #ifdef USE_FOG
            vFogDepth = depth;
          #endif
        }`,fragmentShader:`
        varying vec4 vL; varying vec3 vP; uniform float uSplit;
        ${ae} ${ne}
        void main() {
          float a = 1.0 - abs(vL.x);
          // a core ramp wide enough that a line held at the minimum width does not break into dots on a shallow slope
          float halo = a * a * a * 0.4, core = smoothstep(0.4, 0.85, a);
          vec3 c = ink(vL.y, vP.z);
          // key 2: every line a cyan and a magenta twin side by side
          vec3 twin = vL.x > 0.0 ? uInkA : uInkB;
          float tw = uSplit * step(vL.y, 1.5);
          c = mix(c, twin, tw);
          float coreT = mix(core, smoothstep(0.25, 0.5, a) * (1.0 - smoothstep(0.82, 0.97, a)), tw);
          vec3 col = (c * (halo + coreT * 0.95) * mix(vL.w, 1.0, vL.w * 0.5) + vec3(1.0) * coreT * mix(0.75, 0.35, tw) * vL.w * vL.w * vL.w) * vL.z;
          ${re}
          gl_FragColor = vec4(col, 1.0);
        }`}),r=new o.Mesh(h,s);return r.frustumCulled=!1,r.renderOrder=t.renderOrder??3,r}return{add:w,build:m,count:()=>i.length/3}}function ke(e,t,i={}){const c=new o.ShaderMaterial({uniforms:e,fog:!0,transparent:!0,depthWrite:!1,blending:o.AdditiveBlending,side:o.DoubleSide,vertexShader:`
      attribute vec3 aA, aB; attribute vec4 aW;
      uniform vec3 uVel; uniform float uBeat, uTrail;
      varying vec3 vT; varying vec3 vP;
      ${oe}
      ${i.pre||""}
      void main() {
        vec3 A = aA, B = aB; float gMul = 1.0;
        ${i.xform||""}
        float t = position.y * 0.5 + 0.5;
        vec4 mid = modelViewMatrix * vec4((A + B) * 0.5, 1.0);
        float g = aW.w * gMul * uTrail * (1.0 - smoothstep(55.0, 120.0, length(mid.xyz)));
        vec3 P = mix(A, B, position.x);
        vec4 mv = modelViewMatrix * vec4(P + uVel * t, 1.0);
        gl_Position = g < 0.004 ? vec4(2.0, 2.0, 2.0, 1.0) : projectionMatrix * mv;
        vT = vec3(t, aW.y, g); vP = P;
        #ifdef USE_FOG
          vFogDepth = max(-mv.z, 0.0);
        #endif
      }`,fragmentShader:`
      varying vec3 vT; varying vec3 vP;
      ${ae} ${ne}
      void main() {
        float f = 1.0 - vT.x;
        vec3 col = ink(vT.y, vP.z) * (f * f * vT.z);
        ${re}
        gl_FragColor = vec4(col, 1.0);
      }`}),k=new o.Mesh(t.geometry,c);return k.frustumCulled=!1,k.renderOrder=(i.renderOrder??3)-.1,k}function Ae(e){const t=[],i=[],c=[];function k(m,p,g,h,s,r,l,n,u){const A=t.length/3;t.push(m.x,m.y,m.z,p.x,p.y,p.z,g.x,g.y,g.z,h.x,h.y,h.z),i.push(s[0],s[1],u,r[0],r[1],u,l[0],l[1],u,n[0],n[1],u),c.push(A,A+1,A+2,A+1,A+3,A+2)}function w(){const m=new o.BufferGeometry;m.setAttribute("position",new o.BufferAttribute(new Float32Array(t),3)),m.setAttribute("aR",new o.BufferAttribute(new Float32Array(i),3)),m.setIndex(c);const p=new o.ShaderMaterial({uniforms:e,fog:!0,side:o.DoubleSide,vertexShader:`
        attribute vec3 aR; varying vec3 vR; varying vec3 vP; varying float vD; varying float vPx;
        uniform vec2 uRes;
        ${oe}
        void main() {
          vR = aR; vP = position;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vD = -mv.z;
          vPx = 2.0 / max(projectionMatrix[1][1] * uRes.y, 1.0);   // the angle one pixel covers
          gl_Position = projectionMatrix * mv;
          #ifdef USE_FOG
            vFogDepth = -mv.z;
          #endif
        }`,fragmentShader:`
        varying vec3 vR; varying vec3 vP; varying float vD; varying float vPx;
        uniform vec3 uFill, uHaze, uEye; uniform float uBeat, uBeatLen, uGantryZ;
        ${ae} ${ge} ${ne}
        float hash1(float n) { return fract(sin(n * 127.1) * 43758.5453); }
        // one gantry in its own plane, p = (|x|, height above the deck): distance to its five nested chevrons
        float sdSeg2(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; return length(pa - ba * clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0.0, 1.0)); }
        float chevD(vec2 p, float n) {
          float w = 17.3 - n * 1.4; vec2 sh = vec2(w, 14.0 - n * 1.7);
          return min(sdSeg2(p, vec2(w, 0.0), sh), sdSeg2(p, sh, vec2(0.0, 25.0 - n * 2.2)));
        }
        float gantryD(vec2 p) { return min(min(min(chevD(p, 0.0), chevD(p, 1.0)), min(chevD(p, 2.0), chevD(p, 3.0))), chevD(p, 4.0)); }
        // gantry k mirrored in the wet deck: the view ray, reflected about the deck, meets the gantry's plane
        float gantryRefl(vec3 dv, float k) {
          float zg = uGantryZ + k * uBeatLen, t = max((zg - vP.z) / min(dv.z, -1e-3), 0.0);
          vec2 hp = vec2(abs(vP.x + dv.x * t), max(-dv.y, 0.0) * t);
          float wr = length(dv) * (1.0 + t) * vPx;
          float fl = exp(-7.0 * fract(uBeat * 0.25 - (11.0 - k) / 12.0));
          return lineP(gantryD(hp), wr, 0.22) * (0.55 + 1.3 * fl) * step(-0.5, k) * step(k, 11.5) * (1.0 - smoothstep(25.0, 29.0, hp.y));
        }
        void main() {
          float x = vR.x, s = vR.y, kind = vR.z;
          float wx = fwidth(x), ws = fwidth(s);
          float dim = mix(1.0, 0.36, clamp(vD / 1500.0, 0.0, 1.0));
          vec3 col = mix(uFill, uHaze * 0.16, clamp(vD / 2200.0, 0.0, 1.0));
          vec3 cA = ink(0.0, vP.z), cB = ink(1.0, vP.z);
          float pitch = uBeatLen * 0.25;
          // the kerb's white core is kept for our own strand close by; further off and on the other strand it is capped
          float kcap = kind < 0.5 ? mix(1.0, 0.7, smoothstep(50.0, 180.0, vD)) : 0.7;
          float wfade = 1.0 - smoothstep(40.0, 260.0, vD);
          // a strand seen edge-on squeezes all its paint into a few pixels: fade it instead of letting it add up to white
          if (kind < 2.5) dim *= 1.0 - 0.72 * smoothstep(0.35, 1.6, wx);
          if (kind < 1.5) {
            float kerb = min(lineP(abs(abs(x) - 3.25), wx, 0.14), kcap);
            col += hot(cA, kerb) * dim;
            float lane = lineP(abs(abs(x) - 2.85), wx, 0.05) * 0.35;
            col += cA * lane * dim;
            // centre dashes, four to the beat
            float ds = fract(s / pitch);
            float dash = lineP(abs(x), wx, 0.11) * step(ds, 0.42) * smoothstep(0.0, 0.02, ds);
            col += (mix(cA, vec3(1.0), 0.3) * dash * 1.15) * dim;
            // dotted guides either side of the dashes, so the deck streaks under the wheel
            float gd = lineP(abs(abs(x) - 1.5), wx, 0.04) * 0.45 * step(0.5, fract(s / (pitch * 0.5))) * (1.0 - smoothstep(150.0, 400.0, vD));
            col += cA * gd * dim;
            // the wet strand: the hoops' light lying on it as broken strokes, and our headlamp's amber on our own
            col += (cB * 0.5 * wetStreak(x, s, wx, ws, uBeat, 0.5, 4.0, 3.0) + cA * 0.32 * wetStreak(x + 0.3, s + 2.0, wx, ws, uBeat, 1.1, 7.0, 11.0)) * wfade * dim * step(abs(x), 3.1);
            if (kind < 0.5) col += uAmber * 0.42 * wetLamp(x, s, wx, ws, vD) * step(abs(x), 3.1);
            if (kind > 0.5) {
              // oncoming traffic: pairs of headlight dashes streaming toward the headland
              float gap = uBeatLen * 3.0;
              float q = (s + uBeat * uBeatLen * 0.75) / gap;
              float cell = floor(q), f = fract(q) * gap;
              float on = step(0.15, hash1(cell));
              float lx = -1.7 + (hash1(cell + 7.0) - 0.5) * 0.6;
              float hd = lineP(abs(abs(x - lx) - 0.62), wx, 0.13) * (1.0 - smoothstep(4.5, 6.0, f)) * smoothstep(0.0, 0.4, f) * on;
              float fan = (1.0 - smoothstep(0.0, 1.9, abs(x - lx))) * smoothstep(34.0, 6.0, f) * step(6.0, f) * on * 0.16;
              col += hot(cA, hd) * 1.25 * dim + cA * fan * dim;
            }
          } else if (kind < 2.5) {
            float kerb = min(lineP(abs(abs(x) - 3.25), wx, 0.14), kcap);
            float rib = lineP(abs(fract(s / pitch + 0.5) - 0.5) * pitch, ws, 0.09) * 0.4;
            float spine = lineP(abs(x), wx, 0.07) * 0.5;
            col += hot(cA, kerb) * 0.8 * dim + cA * (rib + spine) * dim;
          } else if (kind < 3.5) {
            // boulevard: kerbs, carriageway edges, dashes handing over from the two strands to the centre
            float kerb = lineP(abs(abs(x) - 17.1), wx, 0.16);
            float inner = lineP(abs(abs(x) - 10.5), wx, 0.07) * 0.5 * (1.0 - smoothstep(250.0, 350.0, s));
            float ds = fract(s / pitch), dmask = step(ds, 0.42) * smoothstep(0.0, 0.02, ds);
            float dSide = lineP(abs(abs(x) - 14.0), wx, 0.11) * dmask * (1.0 - smoothstep(200.0, 350.0, s));
            float dMid = lineP(abs(x), wx, 0.12) * dmask * smoothstep(120.0, 300.0, s);
            float lanes = lineP(abs(abs(x) - 7.0), wx, 0.06) * 0.7 * smoothstep(250.0, 350.0, s);
            // dotted guides along the carriageways (lines that streak, never a grid)
            float hs = fract(s / (pitch * 0.5));
            lanes += (lineP(abs(abs(x) - 3.5), wx, 0.045) * step(hs, 0.5) + lineP(abs(abs(x) - 12.2), wx, 0.045) * step(0.5, hs)) * 0.5 * (1.0 - smoothstep(180.0, 450.0, vD));
            lanes += lineP(abs(abs(x) - 15.6), wx, 0.05) * 0.4;
            float joint = lineP(abs(fract(s / uBeatLen + 0.5) - 0.5) * uBeatLen, ws, 0.08) * 0.3 * step(abs(x), 17.1);
            col += hot(cA, kerb) * dim + cA * (inner + lanes + joint) * dim + (mix(cA, vec3(1.0), 0.3) * max(dSide, dMid) * 1.15) * dim;
            float cb = floor(s / uBeatLen), cs = s - cb * uBeatLen;
            float chev = lineP(abs(cs - 14.0 + abs(x) * 0.7) * 0.82, max(ws, wx), 0.16) * step(abs(x), 8.5) * step(0.6, abs(x)) * smoothstep(300.0, 380.0, s);
            col += cA * chev * (0.5 + 1.3 * exp(-6.0 * fract(uBeat * 0.25 - cb / 16.0))) * dim;
            float gap = uBeatLen * 3.0;
            float q = (s + 1020.0 + uBeat * uBeatLen * 0.75) / gap;
            float cell = floor(q), f = fract(q) * gap;
            float on = step(0.15, hash1(cell));
            float lx = -mix(14.0, 7.0, smoothstep(200.0, 350.0, s)) - 1.7 + (hash1(cell + 7.0) - 0.5) * 0.6;
            float hd = lineP(abs(abs(x - lx) - 0.62), wx, 0.13) * (1.0 - smoothstep(4.5, 6.0, f)) * smoothstep(0.0, 0.4, f) * on;
            col += hot(cA, hd) * 1.25 * dim;
            // the wet boulevard: tower-window light as streaks down both sides, the next two gantries mirrored as
            // broken chevrons, and the headlamp's amber under the wheel
            float side = smoothstep(7.5, 10.0, abs(x)) * step(abs(x), 16.9);
            col += (cB * mix(0.3, 0.52, side) * wetStreak(x, s, wx, ws, uBeat, 0.6, 4.5, 5.0) + cA * mix(0.12, 0.3, side) * wetStreak(x + 0.4, s + 3.0, wx, ws, uBeat, 1.3, 7.0, 17.0)) * wfade * dim * step(abs(x), 16.9);
            vec3 dv = vP - uEye;
            float kg = floor((vP.z - uGantryZ) / uBeatLen);
            float brk = mix(step(0.35, fract(s / 1.7 + hash1(floor(x / 0.9)))), 0.65, smoothstep(0.5, 1.6, ws));
            col += cB * 0.6 * (gantryRefl(dv, kg) + gantryRefl(dv, kg - 1.0)) * brk * (1.0 - smoothstep(60.0, 320.0, vD)) * step(abs(x), 16.9);
            col += uAmber * 0.42 * wetLamp(vP.x - uEye.x, s, wx, ws, vD);
          }
          ${he}
          gl_FragColor = vec4(col, 1.0);
        }`}),g=new o.Mesh(m,p);return g.frustumCulled=!1,g}return{quad:k,build:w,tris:()=>c.length/3}}function ze(e,t,i,c,k,w,m,p){const h=Math.round(C/4),s=xe/2,r=.55,l=()=>new o.Vector3,n=(f,b,d)=>l().copy(f.axis).addScaledVector(f.r,b).addScaledVector(f.u,d);let u=e.ladder(0);for(let f=1;f<=h;f++){const b=(f-1)*4,d=f*4,x=e.ladder(d);for(let D=0;D<2;D++){const M=D===0?V:-V,I=D,L=n(u,M-s,0),G=n(u,M+s,0),$=n(x,M-s,0),H=n(x,M+s,0),j=n(u,M-s,-r),Z=n(u,M+s,-r),N=n(x,M-s,-r),se=n(x,M+s,-r);i.quad(L,G,$,H,[-s,b],[s,b],[-s,d],[s,d],I),i.quad(j,Z,N,se,[-s,b],[s,b],[-s,d],[s,d],2),i.quad(L,j,$,N,[-3.25,b],[-3.25,b],[-3.25,d],[-3.25,d],2),i.quad(G,Z,H,se,[3.25,b],[3.25,b],[3.25,d],[3.25,d],2)}u=x}const A=8.5,W=Math.round(C/A);let B=e.ladder(0);for(let f=1;f<=W;f++){const b=e.ladder(f*A);for(const[d,x]of[[V-s-.15,.4],[V+s+.15,.5],[-V-s-.15,.28],[-V+s+.15,.28]])t.add(n(B,d,.95),n(b,d,.95),.22,0,-1,x);for(let d=0;d<4;d++){const x=d*Math.PI/2,D=Math.cos(x)*E,M=Math.sin(x)*E;w.add(n(B,D,M),n(b,D,M),.3,1,-1,.5)}B=b}const v=c/4,y=Math.floor((C-4)/v),O=V-s;let U=null;for(let f=1;f<=y;f++){const b=f*v,d=e.ladder(b);if(m.add(n(d,-O,-.28),n(d,O,-.28),.4,0,2+((p+b/c)/4%1+1)%1,.6),U){const x=f%2?1:-1;m.add(n(U,-O*x,-.28),n(d,O*x,-.28),.2,1,-1,.35)}for(const x of[V+s+.15,-V-s-.15])t.add(n(d,x,-.3),n(d,x,.95),.2,0,-1,.7);U=d}const q=Math.floor((C-10)/c),R=[];for(let f=1;f<=q;f++){const b=f*c,d=e.ladder(b),x=f/q%1,D=16,M=E+2.2;R.push(b);for(let I=0;I<D;I++){const L=I/D*Math.PI*2+Math.PI/D,G=(I+1)/D*Math.PI*2+Math.PI/D,$=(L+G)/2,H=n(d,Math.cos(L)*E,Math.sin(L)*E),j=n(d,Math.cos(G)*E,Math.sin(G)*E),Z=n(d,Math.cos(L)*M,Math.sin(L)*M),N=n(d,Math.cos(G)*M,Math.sin(G)*M);t.add(H,j,.5,1,x,1),t.add(Z,N,.32,1,x,.7),t.add(H,Z,.22,1,x,.55),t.add(H,n(d,Math.cos($)*M,Math.sin($)*M),.16,1,x,.3)}for(const I of[1,-1])t.add(n(d,I*(V+s),-.28),n(d,I*E,-.28),.34,1,x,.9),t.add(n(d,I*(V-s),-.28),n(d,I*E*.707,-E*.707),.2,1,x,.5),t.add(n(d,I*(V+s),-.28),n(d,I*E*.707,-E*.707),.2,1,x,.5)}return{hoops:R}}function Me(e,t=0){const i=e.range(870,930),c=e.range(770,840)+(t===1?-150:t===2?170:0),k=c,w=-150-(i-900);let m=[],p=t===1?74:60;for(;p<100;p+=2){m=[];const h=-18-e.range(0,6);for(let s=0;41+p*s<i+20;s++)for(const r of[1,-1]){const l=r*(41+p*s);for(let n=-12;n<30;n++){const u=h-p*n;u<-1040||Math.hypot(l,u-w)>i||Math.hypot(l,u-c)<k+22||l<0&&l>-41-p*1.5&&u<-520||m.push({x:l,z:u,k:r*(s+1),front:Math.hypot(l,u-c)-k})}}if(m.length<=310)break}const g=[...new Set(m.map(h=>h.x))].sort((h,s)=>h-s);for(const h of m)h.col=g.indexOf(h.x),h.w=t===1?e.range(32,37):t===2?e.range(23,29):e.range(27,32),h.gain=(.85+.15*K(0,420,h.front))*e.range(.9,1),h.front<120&&(h.gain=1),h.x+=e.range(-2.5,2.5),h.z+=e.range(-4,4);return{list:m,nc:g.length,pitch:p}}function Pe(e,t){const i=new o.BoxGeometry(1,1,1,1,8,1),c=new o.InstancedBufferGeometry;c.setIndex(i.index),c.setAttribute("position",i.attributes.position),c.setAttribute("normal",i.attributes.normal),c.setAttribute("uv",i.attributes.uv);const k=t.list.length,w=new Float32Array(k*8),m=new Float32Array(k*8);t.list.forEach((s,r)=>{for(let l=0;l<2;l++){const n=(r*2+l)*4;w[n]=s.x,w[n+1]=s.z,w[n+2]=s.w,w[n+3]=s.gain,m[n]=s.col,m[n+1]=l,m[n+2]=r*.618034%1,m[n+3]=s.col/Math.max(1,t.nc-1)}}),c.setAttribute("aT",new o.InstancedBufferAttribute(w,4)),c.setAttribute("aU",new o.InstancedBufferAttribute(m,4)),c.instanceCount=k*2;const p=s=>new o.ShaderMaterial({uniforms:e,fog:!0,side:o.DoubleSide,defines:s?{MIRROR:1}:{},vertexShader:`
      attribute vec4 aT, aU;
      uniform vec2 uLv[${de}]; uniform float uBeat;
      varying vec3 vF; varying vec4 vI; varying vec3 vP; varying float vDist; flat varying vec2 vS; varying float vFarK;
      ${oe}
      void main() {
        vec2 lv = uLv[int(aU.x + 0.5)];
        // the level is shaped so quiet bands sit near the 40 m base and loud ones reach 260 m
        float l = clamp(lv.x * aT.w * 1.25, 0.0, 1.0), lp = clamp(lv.y * aT.w * 1.25, 0.0, 1.0);
        float h = 30.0 + 300.0 * l * l;
        float pk = 30.0 + 300.0 * lp * lp + 9.0;
        // the peak-hold bar is thicker far away so the analyser reads across the bay
        float farK = smoothstep(380.0, 700.0, length((modelViewMatrix * vec4(aT.x, pk, aT.y, 1.0)).xyz));
        vS = aU.zw;
        float y01 = position.y + 0.5, top = step(0.5, abs(normal.y));
        float W = aU.y < 0.5 ? aT.z : aT.z + 3.0;
        float H = aU.y < 0.5 ? h : mix(2.6, 5.0, farK);
        vec3 p = vec3(position.x * W, (aU.y < 0.5 ? 0.0 : pk) + y01 * H, position.z * W);
        vI = vec4(H, aU.y, 0.0, W * 0.5); vFarK = farK;
        vF = vec3((uv.x - 0.5) * W, top > 0.5 ? (uv.y - 0.5) * W : y01 * H, top);
        #ifdef MIRROR
          float dep = p.y;
          p.y = -dep;
          p.x += sin(dep * 0.085 - uBeat * 1.5708 + aT.y * 0.013) * min(7.0, 0.4 + dep * 0.035);
          vI.z = dep;
        #endif
        p.xz += aT.xy;
        vP = p;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vDist = length(mv.xyz);
        gl_Position = projectionMatrix * mv;
        #ifdef USE_FOG
          vFogDepth = -mv.z;
        #endif
      }`,fragmentShader:`
      varying vec3 vF; varying vec4 vI; varying vec3 vP; varying float vDist; flat varying vec2 vS; varying float vFarK;
      uniform vec3 uFill, uHaze; uniform float uBeat, uCityGain;
      ${ae} ${ne}
      float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      void main() {
        float dist = vDist;
        float top = vF.z, peak = vI.y;
        float wu = fwidth(vF.x), wv = fwidth(vF.y);
        float eu = vI.w - abs(vF.x);
        float ev = top > 0.5 ? vI.w - abs(vF.y) : min(vF.y + 2.0 * (1.0 - peak), vI.x - vF.y);
        float edge = max(lineP(eu, wu, 0.42), lineP(ev, wv, 0.42));
        float far = clamp(dist / 1500.0, 0.0, 1.0);
        // analyser segments: a line every 20 m of height, and a cross on the roof
        float seg = lineP(abs(fract(vF.y / 20.0 + 0.5) - 0.5) * 20.0, wv, 0.16) * (1.0 - top) * (1.0 - peak);
        float near = 1.0 - smoothstep(240.0, 420.0, dist);
        seg *= mix(0.34, 0.5, near) * (1.0 - smoothstep(0.35, 0.8, far));
        float mull = lineP(abs(vF.x), wu, 0.12) * (1.0 - top) * (1.0 - peak) * mix(0.16, 0.3, near) * (1.0 - smoothstep(0.2, 0.5, far));
        // close towers glow: quarter mullions, two window cells in five lit (stepping with the tower's band), their panes
        // filled in one of the two inks or, rarely, amber
        float sideF = (1.0 - top) * (1.0 - peak), nearW = 1.0 - smoothstep(300.0, 650.0, dist);
        float qm = lineP(abs(abs(vF.x) - vI.w * 0.5), wu, 0.09) * sideF * 0.2 * near;
        vec2 wc = vec2(vF.x / (vI.w * 0.5), vF.y / 10.0), ci = floor(wc), cf = abs(fract(wc) - 0.5);
        float rate = vS.y < 0.34 ? 1.0 : (vS.y < 0.67 ? 2.0 : 4.0);
        float lit = step(0.6, h21(ci + vS.x * 91.0 + floor(uBeat * rate + vS.x * 4.0) * 0.37));
        float wd = max((cf.x - 0.3) * vI.w * 0.5, (cf.y - 0.3) * 10.0);
        float win = (lineP(abs(wd), max(wu, wv), 0.1) * 0.75 + step(wd, 0.0) * 0.32) * lit * sideF * nearW;
        float wh = h21(ci * 1.37 + vS.x * 57.0);
        vec3 winC = wh < 0.6 ? ink(0.0, vP.z) : (wh < 0.9 ? ink(1.0, vP.z) : uAmber * 0.6);
        // the tower as a lit level meter: a faint wash below the level, and the top 20 m segment hatched, flaring on the beat
        float topSeg = step(vI.x - 20.0, vF.y);
        float hatch = lineP(abs(fract(vF.y / 4.0) - 0.5) * 4.0, wv, 0.11) * (1.0 - smoothstep(0.8, 2.0, wv));
        float wash = (0.045 + topSeg * (0.03 + hatch * (0.2 + 0.35 * exp(-5.0 * fract(uBeat + vS.x))))) * sideF * nearW;
        // one tower in five carries a sign: a lit panel with two bars that step on the beat
        float sgn = step(0.8, h21(vS.xx * 7.3 + 0.5)) * sideF * nearW;
        vec2 sp = vec2(vF.x / max(vI.w * 2.0, 1.0), (vF.y - 28.0) / 30.0);          // -0.25..0.25 across, 0..1 up
        float inP = step(abs(sp.x), 0.25) * step(0.0, sp.y) * step(sp.y, 1.0);
        float sedge = lineP((0.25 - abs(sp.x)) * vI.w * 2.0, wu, 0.14) + lineP(min(sp.y, 1.0 - sp.y) * 30.0, wv, 0.14);
        float bi = floor(sp.y * 2.0), bl = 0.3 + 0.7 * h21(vec2(bi + vS.x * 13.0, floor(uBeat + vS.x * 3.0)));
        float bar = step(abs(fract(sp.y * 2.0) - 0.5), 0.16) * step(sp.x + 0.2, 0.4 * bl) * step(-0.2, sp.x);
        float sign = sgn * inP * (0.2 + min(sedge, 1.0) * 0.7 + bar * 0.9);
        win *= 1.0 - sgn * inP;
        float roof = top * (1.0 - peak) * lineP(abs(abs(vF.x) - abs(vF.y)) * 0.707, max(wu, wv), 0.14) * 0.4;
        vec3 c = ink(peak > 0.5 ? 0.0 : 1.0, vP.z);
        float dim = mix(1.0, 0.75, far) * uCityGain;
        vec3 fill = mix(uFill, uHaze * 0.2, smoothstep(0.1, 1.3, far));
        // the far skyline is thinned to outlines; they are lifted a little so the analyser still reads across the bay
        vec3 col = fill + (hot(c, edge) * mix(1.0, mix(1.25, 1.8, vFarK), peak) * mix(1.0, 1.3, smoothstep(0.2, 0.55, far)) + c * (seg + mull + qm + roof + wash + sign) + winC * win) * dim;
        #ifdef MIRROR
          // the reflection breaks into the sea's lines: horizontal strips that widen with depth
          float strip = smoothstep(-0.15, 0.35, sin(vI.z * 0.42 + sin(vP.x * 0.02 + uBeat * 0.785) * 1.4 - uBeat * 0.785));
          float fall = exp(-vI.z / 260.0);
          col = uFill * 0.7 + (col - fill) * mix(0.25, 1.0, strip) * fall;
        #endif
        ${he}
        gl_FragColor = vec4(col, 1.0);
      }`}),g=new o.Mesh(c,p(!1));g.frustumCulled=!1;const h=new o.Mesh(c,p(!0));return h.frustumCulled=!1,h.renderOrder=-.4,{real:g,mirror:h,tris:k*2*(i.index.count/3)}}function Fe(e,t,i){const c=-1500+3e3*((i*.25%1+1)%1);return t+2.2*Math.sin(e*.021+i*.8)+1.4*Math.sin(e*.047-t*.013-i*1.3)+5*Math.exp(-Math.pow((e-c)/170,2))+i*1.5}function Se(e,t,i){const c=new o.Mesh(new o.CircleGeometry(t,48).rotateX(-Math.PI/2),new o.MeshBasicMaterial({color:i.clone().multiplyScalar(.8),depthWrite:!1,fog:!0}));c.position.set(0,-.05,300),c.renderOrder=-.5,c.frustumCulled=!1;const k=new o.ShaderMaterial({uniforms:e,fog:!0,transparent:!0,depthWrite:!1,blending:o.AdditiveBlending,vertexShader:`
      varying vec3 vP; varying vec3 vW;
      ${oe}
      void main() {
        vP = position; vP.z += 300.0;
        vec4 w = modelMatrix * vec4(position, 1.0); vW = vec3(vP.x, 0.03, vP.z);
        vec4 mv = viewMatrix * w;
        gl_Position = projectionMatrix * mv;
        #ifdef USE_FOG
          vFogDepth = -mv.z;
        #endif
      }`,fragmentShader:`
      varying vec3 vP; varying vec3 vW;
      uniform float uBeat; uniform vec3 uHaze, uSunDir, uEye;
      ${ae} ${ne}
      float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      void main() {
        float x = vP.x, z = vP.z;
        float sx = -1500.0 + 3000.0 * fract(uBeat * 0.25);
        float sw = (x - sx) / 170.0;
        float q = z + 2.2 * sin(x * 0.021 + uBeat * 0.8) + 1.4 * sin(x * 0.047 - z * 0.013 - uBeat * 1.3)
          + 5.0 * exp(-sw * sw) + uBeat * 1.5;
        float w = length(vec2(dFdx(q), dFdy(q)));
        float cellf = q / 6.0;
        float dd = (0.5 - abs(fract(cellf) - 0.5)) * 6.0;
        float l = lineP(dd, w, 0.15);
        float flatK = smoothstep(1.6, 4.5, w);
        l = mix(l, 0.2, flatK);
        vec3 toF = vW - uEye; float dist = length(toF);
        float dim = mix(1.0, 0.4, clamp(dist / 1500.0, 0.0, 1.0));
        vec3 base = mix(ink(1.0, z), uHaze, 0.5) * mix(0.85, 0.62, smoothstep(450.0, 800.0, dist));
        vec3 col = base * l * dim;
        // the swell is a brighter crest travelling left to right once a bar
        col += base * l * exp(-sw * sw) * 1.2 * dim;
        // the causeway's light lying on the water under it
        float uu = (x + sin(z * 0.05 + uBeat * 0.785) * 5.0) / 20.0;
        float under = exp(-uu * uu) * step(0.0, z) * (1.0 - smoothstep(940.0, 1040.0, z));
        col += ink(0.0, z) * l * under * 0.55 * dim;
        // amber glitter path under the sun
        vec2 dxz = toF.xz / max(length(toF.xz), 1e-3);
        vec2 sxz = uSunDir.xz / max(length(uSunDir.xz), 1e-3);
        float gl = smoothstep(0.9965, 0.9998, dot(dxz, sxz)) * smoothstep(80.0, 900.0, dist);
        float spark = step(0.62, hash2(vec2(floor(cellf + 0.5), floor(x / 9.0) + floor(uBeat * 2.0))));
        col += uAmber * l * gl * (0.12 + 1.9 * spark) * mix(1.0, 0.45, clamp(dist / 2500.0, 0.0, 1.0));
        ${re}
        gl_FragColor = vec4(col, 1.0);
      }`}),w=new o.Mesh(new o.CircleGeometry(t,48).rotateX(-Math.PI/2),k);return w.position.set(0,.03,300),w.renderOrder=1,w.frustumCulled=!1,{floor:c,surf:w}}async function Ie(e,t={}){const i=e.rng.fork?e.rng.fork("corniche-hero"):ve(pe("corniche-hero")),c=(t.palette&&t.palette.length>=7?t.palette:me).map(a=>new o.Color(a)),k=t.rollDir??i.sign(),w=t.beatLength??42.5,m=t.song??(i.chance(.5)?0:i.int(1,2)),p=new o.Vector3().fromArray(t.sunDir??[-Math.sin(.96),.07,-Math.cos(.96)]).normalize(),g=t.inkGain??1,h=t.cityGain??1,s=t.beatOffset??30,r=c[4].clone().multiplyScalar(g),l=c[3].clone().multiplyScalar(g),n=[];for(let a=0;a<de;a++)n.push(new o.Vector2(.2,.3));const u=o.UniformsUtils.merge([o.UniformsLib.fog]);Object.assign(u,{uBeat:{value:0},uBeatLen:{value:w},uRes:{value:new o.Vector2(800,450)},uInkA:{value:r.clone()},uInkB:{value:l.clone()},uInkA2:{value:r.clone()},uInkB2:{value:l.clone()},uAmber:{value:c[6].clone()},uWipeZ:{value:1e9},uSplit:{value:0},uVel:{value:new o.Vector3},uTrail:{value:t.trail??.14},uCityGain:{value:h},uFill:{value:c[0].clone()},uHaze:{value:c[2].clone()},uSunDir:{value:p},uLv:{value:n},uEye:{value:new o.Vector3(0,60,1500)},uGantryZ:{value:t.gantryZ??1e6}});const A=new o.Group;A.name="corniche-120-hero";const W=be(k),B=ie(u),v=Ae(u),y=ie(u,{pre:"uniform vec3 uEye;",xform:"{ gMul = mix(0.3, 1.0, smoothstep(40.0, 110.0, distance((A + B) * 0.5, uEye))); }"}),O=ie(u,{pre:"uniform vec3 uEye;",xform:`{
    vec3 n = cross(B - A, vec3(0.0, 0.0, -1.0)), v = (A + B) * 0.5 - uEye;
    float graze = abs(dot(v, n)) / max(length(n) * length(v), 1e-3);
    gMul = mix(0.3, 1.0, smoothstep(0.015, 0.12, graze));
  }`});ze(W,B,v,w,i,y,O,s),await e.yield?.();{const a=(F,S,_)=>new o.Vector3(F,S,_),Q=Math.round(Y/52.3);for(let F=0;F<Q;F++){const S=F/Q*Y,_=(F+1)/Q*Y;v.quad(a(-17.5,z,-S),a(17.5,z,-S),a(-17.5,z,-_),a(17.5,z,-_),[-17.5,S],[17.5,S],[-17.5,_],[17.5,_],3),v.quad(a(-17.5,z-1.3,-S),a(17.5,z-1.3,-S),a(-17.5,z-1.3,-_),a(17.5,z-1.3,-_),[0,0],[0,0],[0,0],[0,0],4);for(const X of[1,-1])v.quad(a(X*17.5,z,-S),a(X*17.5,z-1.3,-S),a(X*17.5,z,-_),a(X*17.5,z-1.3,-_),[0,0],[0,0],[0,0],[0,0],4),B.add(a(X*(17.5+.1),z-1.3,-S),a(X*(17.5+.1),z-1.3,-_),.3,0,-1,.8),B.add(a(X*(17.5+.1),z+.6,-S),a(X*(17.5+.1),z+.6,-_),.45,0,-1,.6)}for(let F=-w/4;F>-Y;F-=w/4)for(const S of[1,-1])B.add(a(S*(17.5+.1),z,F),a(S*(17.5+.1),z+.6,F),.2,0,-1,.7);for(let F=-w;F>-Y;F-=w*2){for(const S of[1,-1])B.add(a(S*13,z-1.3,F),a(S*16,0,F),.4,1,-1,.7),B.add(a(S*13,z-1.3,F),a(S*10,0,F),.4,1,-1,.7);B.add(a(-17.5,z-1.3,F),a(17.5,z-1.3,F),.3,1,-1,.6)}B.add(a(-17.5,z+.02,0),a(17.5,z+.02,0),.4,0,-1,1)}const U=v.build();A.add(U),await e.yield?.();const q=Me(i,m),R=ye(i,q.nc,m);await e.yield?.();const f=Pe(u,q);A.add(f.real),await e.yield?.();const b=t.sea!==!1;if(b){const a=Se(u,t.seaRadius??2600,c[0]);A.add(a.floor,f.mirror,a.surf)}const d=B.build();A.add(d,y.build(),O.build()),t.trail!==0&&A.add(ke(u,d)),await e.yield?.();const x=a=>{const P=W.ladder(ee(a,0,C));return{p:P.axis.clone().addScaledVector(P.r,V).addScaledVector(P.u,te),up:P.u,tangent:P.t,roll:P.phi,axis:P.axis}},D={axis:new o.Vector3,t:new o.Vector3,r:new o.Vector3,u:new o.Vector3,phi:0};function M(a,P){const T=W.ladderInto(ee(a,0,C),D);return P.p.copy(T.axis).addScaledVector(T.r,V).addScaledVector(T.u,te),P.up.copy(T.u),P.tangent.copy(T.t),P.axis.copy(T.axis),P.roll=T.phi,P}const I=[],L=[];for(let a=0;a<=C;a+=10){const P=x(a);I.push({s:a,p:P.p.toArray(),up:P.up.toArray(),roll:P.roll}),a%20===0&&L.push(P.p.toArray())}for(let a=-25;a>-Y-4;a-=25)L.push([V*(1-K(40,350,-a)),z+te,Math.max(a,-1050)]);L.push([0,z+te,-1050]);const G=new o.Vector3(0,60,450),$={start:{position:x(0).p.toArray(),direction:[0,0,-1]},landfall:{position:x(C).p.toArray(),direction:[0,0,-1]},portalSeat:{position:[0,z+te,-1050],facing:[0,0,1]},flyThrough:L,ride:I,frame:x,frameInto:M,rollStart:x(340).p.toArray(),rollTop:x(510).p.toArray(),rollEnd:x(680).p.toArray(),viewpoints:{headland:[70,78,1420],rollTop:x(510).p.toArray(),bay:[-760,120,620]},bounds:{min:[-930,0,-1060],max:[930,345,1020]},corridor:26,rollDir:k,beatLength:w,song:m,columns:q.nc,towers:q.list.length,seaLine:Fe};let H=!1,j=0,Z=1;const N=new o.Vector2,se=(a=0,P=a,T=1e9)=>{const J=Q=>Q===1?[l,r]:[r,l];u.uInkA.value.copy(J(a)[0]),u.uInkB.value.copy(J(a)[1]),u.uInkA2.value.copy(J(P)[0]),u.uInkB2.value.copy(J(P)[1]),u.uSplit.value=a===2?1:0,u.uWipeZ.value=T},ue=new o.Matrix4,le=()=>{u.uBeat.value=j,R.evaluate(j,Z,n)};return le(),{object:A,radius:620,height:270,center:G,anchors:$,uniforms:u,ground:!1,groundY:0,setBeat(a){H=!0,j=a},setEnergy(a){Z=ee(a,0,1)},setKey:se,setProgress(a){H=!0,j=a*80},update(a,P,T){H||(j=P*2),e.renderer&&(e.renderer.getDrawingBufferSize(N),N.x>0&&u.uRes.value.copy(N)),T&&(A.updateWorldMatrix(!0,!1),u.uEye.value.setFromMatrixPosition(T.matrixWorld).applyMatrix4(ue.copy(A.matrixWorld).invert())),le()},dispose(){b||f.mirror.material.dispose()},stats:{deckTris:v.tris(),lineInstances:B.count(),towerTris:f.tris}}}export{re as GLSL_FOG_ADD,he as GLSL_FOG_MIX,ne as GLSL_FOG_PARS_F,oe as GLSL_FOG_PARS_V,ae as GLSL_INK,ge as GLSL_WET,Ie as buildHero,ie as makeLines,ke as makeTrail};
