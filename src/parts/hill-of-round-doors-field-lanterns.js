import{lerp as C}from"./hill-of-round-doors-field-geo.js";const B=10.4,G=[{prof:[[0,-.05],[.75,-.45],[1,-1.12],[.75,-1.79],[0,-2.19]],segs:8,h:2.24,c:1.12},{prof:[[0,-.05],[.6,-.3],[.6,-2.5],[0,-2.75]],segs:6,h:2.8,c:1.4},{prof:[[0,-.05],[.7,-.6],[.96,-1.3],[.55,-2],[0,-2.5]],segs:6,h:2.55,c:1.25},{prof:[[0,-.05],[1.08,-.5],[1.08,-1.15],[0,-1.6]],segs:8,h:1.65,c:.82}],U=["#fff0d2","#ff93ad","#f2604f","#8fdcae","#86bdf5"];async function X(e,n,s){const d=[],_=s.count*16,g=4,F=new Map,p=(i,f,v)=>Math.floor(i/g)+","+Math.floor(f/g)+","+Math.floor(v/g);for(const i of s.sticks){const f=p(i[0],i[1],i[2]);F.has(f)||F.set(f,[]),F.get(f).push(i)}const z=(i,f,v,c)=>{for(let h=-1;h<=1;h++)for(let r=-1;r<=1;r++)for(let w=-1;w<=1;w++){const b=F.get(Math.floor(i/g)+h+","+(Math.floor(f/g)+r)+","+(Math.floor(v/g)+w));if(b){for(const u of b)if(Math.hypot(u[0]-i,u[1]-f,u[2]-v)<u[3]+c)return!0}}return!1},x=(i,f,v,c,h,r,w)=>{if(s.route(i,f-c-r.c*h,v)<B+r.h*h*.62+w*(c+r.h*h))return!1;for(let b=0;b<=3;b++)if(s.route(i,f-c*b/4,v)<B+w*c*b/4)return!1;return!0};for(let i=0;i<_&&d.length<s.count;i++){s.pause&&i%300===299&&await s.pause();const f=Math.floor(e()*n.length),v=e(),c=e.range(.55,.92),h=e(),r=Math.floor(e()*U.length),w=e(),b=e.range(.6,1),u=n[f],k=h<.34?0:h<.58?1:h<.8?2:3,t=G[k],a=u.p[0]+s.at[0],o=u.p[1]+s.at[1]-.05,l=u.p[2]+s.at[2];if(Math.hypot(a-s.trunk[0],l-s.trunk[1])<s.trunk[2])continue;const y=o-s.floorY-t.h*c,L=u.depth===2?1.6:1.2;if(y<L)continue;const S=u.depth===0?[3.5,12.5]:u.depth===1?[1.8,10]:[1.6,7];let M=Math.min(y,C(S[0],S[1],v)),m=Math.min(.1,.42/M)*b;if(!x(a,o,l,M,c,t,m)&&(M=L+.8*v,m=Math.min(.1,.42/M)*b,M>y||!x(a,o,l,M,c,t,m)))continue;const A=o-M-t.c*c;let P=!0;for(const I of d)if(Math.hypot(I.x-a,I.y-A,I.z-l)<3.3){P=!1;break}!P||z(a,A,l,t.h*c*.62+m*(M+t.h*c)+.3)||d.push({ax:a,ay:o,az:l,L:M,size:c,kind:k,tint:r,phase:w,amp:m,x:a,y:A,z:l})}return d}function Y(e){if(!e.length)return()=>0;let n=1/0,s=1/0,d=1/0,_=-1/0,g=-1/0,F=-1/0;for(const r of e)n=Math.min(n,r.x),s=Math.min(s,r.y),d=Math.min(d,r.z),_=Math.max(_,r.x),g=Math.max(g,r.y),F=Math.max(F,r.z);const p=2.5,z=10,x=z+p;n-=x,s-=x,d-=x;const i=Math.ceil((_+x-n)/p)+1,f=Math.ceil((g+x-s)/p)+1,v=Math.ceil((F+x-d)/p)+1,c=new Float32Array(i*f*v),h=Math.ceil(z/p);for(const r of e){const w=Math.round((r.x-n)/p),b=Math.round((r.y-s)/p),u=Math.round((r.z-d)/p),k=r.size*r.size*1.6;for(let t=u-h;t<=u+h;t++)for(let a=b-h;a<=b+h;a++)for(let o=w-h;o<=w+h;o++){if(o<0||a<0||t<0||o>=i||a>=f||t>=v)continue;const l=Math.hypot(n+o*p-r.x,s+a*p-r.y,d+t*p-r.z);if(l>z)continue;const y=1-l/z;c[(t*f+a)*i+o]+=k*y*y/(.35+l*l*.22)}}return(r,w,b)=>{const u=(r-n)/p,k=(w-s)/p,t=(b-d)/p;if(u<0||k<0||t<0||u>=i-1||k>=f-1||t>=v-1)return 0;const a=Math.floor(u),o=Math.floor(k),l=Math.floor(t),y=u-a,L=k-o,S=t-l,M=(A,P,I)=>c[(I*f+P)*i+A],m=C(C(C(M(a,o,l),M(a+1,o,l),y),C(M(a,o+1,l),M(a+1,o+1,l),y),L),C(C(M(a,o,l+1),M(a+1,o,l+1),y),C(M(a,o+1,l+1),M(a+1,o+1,l+1),y),L),S);return Math.min(3,m)}}const O=`
uniform float uHillTime; attribute vec3 aAnchor; attribute vec4 aHang;        // aHang: cord length, size, phase, swing in radians
vec3 hillSwing(vec3 p) {
  float w = 2.0 / sqrt(max(aHang.x, 0.6)), ph = aHang.z * 6.2832;
  float ax = aHang.w * sin(uHillTime * w + ph), az = aHang.w * 0.7 * sin(uHillTime * w * 0.83 + ph * 1.7);
  float c = cos(ax), s = sin(ax); p = vec3(p.x * c - p.y * s, p.x * s + p.y * c, p.z);
  c = cos(az); s = sin(az); return vec3(p.x, p.y * c - p.z * s, p.y * s + p.z * c);
}`;function N(e,n){const s=[],d=[],_=[],g=[],F=n.prof.length,p=n.segs,z=[];for(let i=0;i<F;i++){const[f,v]=n.prof[i],c=n.prof[Math.max(0,i-1)],h=n.prof[Math.min(F-1,i+1)];let r=-(h[0]-c[0]),w=-(h[1]-c[1]);const b=Math.hypot(r,w)||1;r/=b,w/=b,z.push(s.length/3);for(let u=0;u<=p;u++){const k=u/p*Math.PI*2,t=Math.cos(k),a=Math.sin(k);s.push(t*f,v,a*f),d.push(t*w,-r,a*w),_.push(u/p,(v-n.prof[0][1])/(n.prof[F-1][1]-n.prof[0][1]))}}for(let i=0;i<F-1;i++)for(let f=0;f<p;f++){const v=z[i]+f,c=z[i]+f+1,h=z[i+1]+f+1,r=z[i+1]+f;n.prof[i][0]>0&&g.push(v,c,h),n.prof[i+1][0]>0&&g.push(v,h,r)}const x=new e.BufferGeometry;return x.setAttribute("position",new e.Float32BufferAttribute(s,3)),x.setAttribute("normal",new e.Float32BufferAttribute(d,3)),x.setAttribute("uv",new e.Float32BufferAttribute(_,2)),x.setIndex(g),x}function j(e,n){const s=new e.MeshLambertMaterial({color:16777215});return s.onBeforeCompile=d=>{Object.assign(d.uniforms,n),d.vertexShader=d.vertexShader.replace("#include <common>",`#include <common>
`+O+`
attribute vec3 aTint; attribute vec4 aLook; varying vec3 vTint; varying vec3 vLuv; varying float vFlick;`).replace("#include <beginnormal_vertex>",`#include <beginnormal_vertex>
objectNormal = hillSwing(objectNormal);`).replace("#include <begin_vertex>",`vec3 transformed = aAnchor + hillSwing(position * aHang.y + vec3(0.0, -aHang.x, 0.0));
        vTint = aTint; vLuv = vec3(uv, aLook.x);
        vFlick = 0.9 + 0.1 * sin(uHillTime * 2.3 + aHang.z * 40.0) * sin(uHillTime * 3.7 + aHang.z * 17.0);`),d.fragmentShader=d.fragmentShader.replace("#include <common>",`#include <common>
uniform float uHillLit; uniform float uHillCore; varying vec3 vTint; varying vec3 vLuv; varying float vFlick;`).replace("#include <color_fragment>",`#include <color_fragment>
        float lk = floor(vLuv.z + 0.5), lu = vLuv.x, lv = vLuv.y, lpap = 1.0;
        float lends = 1.0 - smoothstep(0.05, 0.085, lv) * (1.0 - smoothstep(0.915, 0.95, lv));            // the wooden hoops at the two ends
        float lfu = max(fwidth(lu), 1e-5), lfv = max(fwidth(lv), 1e-5);
        if (lk == 0.0) {            // globe: ribs down it and fine hoops round it
          float rib = abs(fract(lu * 8.0) - 0.5) * 2.0;
          lpap = 1.0 - 0.42 * smoothstep(0.84 - lfu * 8.0, 0.98, rib) - 0.2 * clamp(1.0 - lfv * 40.0, 0.0, 1.0) * smoothstep(0.7, 0.95, abs(fract(lv * 11.0) - 0.5) * 2.0);
        } else if (lk == 1.0) {     // tube: pleats round it
          lpap = 0.8 + 0.2 * clamp(1.0 - lfv * 30.0, 0.0, 1.0) * sin(lv * 88.0);
        } else if (lk == 2.0) {     // onion: gores of two tones
          lpap = mix(0.7, 1.0, smoothstep(-lfu * 6.0, lfu * 6.0, abs(fract(lu * 3.0) - 0.5) - 0.25)) * (1.0 - 0.3 * smoothstep(0.88 - lfu * 6.0, 0.98, abs(fract(lu * 6.0) - 0.5) * 2.0));
        } else {                    // concertina: broad pleats and a pale band round the middle
          lpap = (0.86 + 0.14 * clamp(1.0 - lfv * 14.0, 0.0, 1.0) * sin(lv * 38.0)) * (1.0 + 0.25 * smoothstep(0.1, 0.0, abs(lv - 0.5) - 0.06));
        }
        vec3 lpaper = vTint * lpap, lskin = lpaper * lpaper;            // the paper, and the same paper seen edge on: deeper in colour
        diffuseColor.rgb = mix(mix(lskin, lpaper, 0.45) * 0.86, vec3(0.2, 0.13, 0.08), lends);`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        {
          float lface = clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), lmid = (lv - 0.55) * 2.2;
          float lf2 = lface * lface;                                                                          // a coloured paper skin, deeper at its rim, lit from within
          totalEmissiveRadiance += mix(lskin, lpaper, lf2) * (uHillLit * vFlick * (1.0 - lends) * (0.5 + 1.4 * lf2) * (0.55 + 0.7 * exp(-lmid * lmid)));
          float lcore = lf2 * sqrt(lf2) * exp(-lmid * lmid * 1.5);                                            // the light itself seen through the paper: a warm white heart
          totalEmissiveRadiance += mix(lpaper, vec3(1.0, 0.94, 0.8), 0.6) * (uHillCore * vFlick * (1.0 - lends) * lcore);
        }`).replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
        #if NUM_DIR_LIGHTS > 0
        reflectedLight.directDiffuse += directionalLights[0].color * diffuseColor.rgb * (RECIPROCAL_PI * 0.45 * (1.0 - lends) * clamp(-dot(normal, directionalLights[0].direction), 0.0, 1.0));   // sun through the paper
        #endif`)},s.customProgramCacheKey=()=>"hill-field-lantern-3",s}const D=`#ifdef USE_FOG
varying float vFogDepth;
#endif
`,H=`
#ifdef USE_FOG
uniform vec3 fogColor; varying float vFogDepth;
#ifdef FOG_EXP2
uniform float fogDensity;
#else
uniform float fogNear; uniform float fogFar;
#endif
#endif
float hillFog() {
#ifdef USE_FOG
  #ifdef FOG_EXP2
  return 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #else
  return smoothstep(fogNear, fogFar, vFogDepth);
  #endif
#else
  return 0.0;
#endif
}`;function V(e,n){return new e.ShaderMaterial({uniforms:{...e.UniformsLib.fog,...n},fog:!0,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,vertexShader:O+`
`+D+`
      attribute vec3 aTint; attribute vec4 aLook; varying vec3 vTint; varying vec2 vP;
      void main() {
        vec3 c = aAnchor + hillSwing(vec3(0.0, -aHang.x - aLook.z * aHang.y, 0.0));
        vec4 mvPosition = modelViewMatrix * vec4(c, 1.0);
        mvPosition.xy += position.xy * aHang.y * 3.6; mvPosition.z += aHang.y * 1.2;       // a little toward the eye, so the body does not cut it
        vTint = aTint * (0.9 + 0.1 * sin(uHillTime * 2.3 + aHang.z * 40.0) * sin(uHillTime * 3.7 + aHang.z * 17.0)); vP = position.xy;
        gl_Position = projectionMatrix * mvPosition;
        #ifdef USE_FOG
        vFogDepth = -mvPosition.z;
        #endif
      }`,fragmentShader:H+`
      uniform float uHillLit; varying vec3 vTint; varying vec2 vP;
      void main() {
        float d2 = dot(vP, vP), a = (0.36 * exp(-d2 * 5.0) + 0.16 * exp(-d2 * 2.2)) * smoothstep(1.0, 0.6, sqrt(d2));
        gl_FragColor = vec4(vTint * (uHillLit * a * (1.0 - 0.75 * hillFog())), 1.0);
      }`})}const W=`
float hillLine(float c, float w) {
  float f = max(fwidth(c), 1e-5), hw = max(w, 0.75 * f);
  return smoothstep(hw + f, hw, abs(c)) * clamp(w / hw, 0.3, 1.0);
}`;function Q(e,n){return new e.ShaderMaterial({uniforms:{...e.UniformsLib.fog,...n,uCord:{value:new e.Color(.05,.036,.026)}},fog:!0,transparent:!0,depthWrite:!1,side:e.DoubleSide,vertexShader:O+`
`+D+`
      varying float vC; varying float vW;
      void main() {
        vec3 b = aAnchor + hillSwing(vec3(0.0, -aHang.x, 0.0));
        vec4 va = modelViewMatrix * vec4(aAnchor, 1.0), vb = modelViewMatrix * vec4(b, 1.0), mvPosition = mix(va, vb, position.y);
        vec2 dir = vb.xy / max(-vb.z, 0.05) - va.xy / max(-va.z, 0.05); float dl = length(dir);
        vec2 side = dl > 1e-6 ? vec2(-dir.y, dir.x) / dl : vec2(1.0, 0.0);
        float half_ = max(0.05, 0.004 * max(-mvPosition.z, 0.0));                  // drawn wide enough for a pixel or two at any distance
        mvPosition.xy += side * position.x * half_; vC = position.x; vW = 0.022 / half_;
        gl_Position = projectionMatrix * mvPosition;
        #ifdef USE_FOG
        vFogDepth = -mvPosition.z;
        #endif
      }`,fragmentShader:H+W+`
      uniform vec3 uCord; varying float vC; varying float vW;
      void main() {
        float a = hillLine(vC, vW);
        #ifdef USE_FOG
        gl_FragColor = vec4(mix(uCord, fogColor, hillFog()), a);
        #else
        gl_FragColor = vec4(uCord, a);
        #endif
      }`})}function T(e,n){return new e.ShaderMaterial({uniforms:{...e.UniformsLib.fog,...n},fog:!0,transparent:!0,depthWrite:!1,side:e.DoubleSide,vertexShader:O+`
`+D+`
      attribute vec3 aTint; attribute vec4 aLook; varying vec2 vQ; varying vec3 vTint;
      void main() {
        float foot = aHang.x + aLook.w * aHang.y;                                  // from the tie down to the lantern's foot
        vec3 a = aAnchor + hillSwing(vec3(0.0, -foot + 0.06 * aHang.y, 0.0)), b = aAnchor + hillSwing(vec3(0.0, -foot - 0.85 * aHang.y, 0.0));
        vec4 va = modelViewMatrix * vec4(a, 1.0), vb = modelViewMatrix * vec4(b, 1.0), mvPosition = mix(va, vb, position.y);
        vec2 dir = vb.xy / max(-vb.z, 0.05) - va.xy / max(-va.z, 0.05); float dl = length(dir);
        vec2 side = dl > 1e-6 ? vec2(-dir.y, dir.x) / dl : vec2(1.0, 0.0);
        mvPosition.xy += side * position.x * 0.2 * aHang.y; vQ = position.xy; vTint = aTint;
        gl_Position = projectionMatrix * mvPosition;
        #ifdef USE_FOG
        vFogDepth = -mvPosition.z;
        #endif
      }`,fragmentShader:H+`
      varying vec2 vQ; varying vec3 vTint;
      void main() {
        float c = abs(vQ.x), t = vQ.y, f = max(fwidth(vQ.x), 1e-4);
        float cord = smoothstep(0.1 + f, 0.1, c) * step(t, 0.34);
        float bead = smoothstep(1.0 + f * 2.0, 1.0, length(vec2(c / 0.5, (t - 0.3) / 0.085)));
        float wid = 0.4 + 0.5 * smoothstep(0.36, 1.0, t);
        float skirt = smoothstep(wid + f, wid, c) * step(0.36, t) * (1.0 - 0.55 * smoothstep(0.82, 1.0, t) * step(0.5, fract(vQ.x * 3.5 + 0.25)));
        float a = max(max(cord, bead), skirt); if (a < 0.02) discard;
        vec3 col = mix(vTint * vTint * 0.62, vec3(0.93, 0.86, 0.7), bead * (1.0 - skirt)) * (0.75 + 0.25 * (1.0 - c));
        #ifdef USE_FOG
        col = mix(col, fogColor, hillFog());
        #endif
        gl_FragColor = vec4(col, a);
      }`})}function J(e,n,s){const d=new e.Group,_={value:0},g=s.lit,F=[],p={uHillTime:_,uHillLit:{value:g*(1.27-.65*g)},uHillCore:{value:g*(1.32-.97*g)}},z=U.map(t=>new e.Color(t)),x=new e.Vector3;let i=1;for(const t of n)x.add(new e.Vector3(t.x,t.y,t.z));n.length&&x.multiplyScalar(1/n.length);for(const t of n)i=Math.max(i,Math.hypot(t.x-x.x,t.ay-x.y,t.z-x.z)+t.L+4);const f=(t,a)=>{const o=new e.InstancedBufferGeometry,l=a.length;o.index=t.index;for(const m in t.attributes)o.setAttribute(m,t.attributes[m]);const y=new Float32Array(l*3),L=new Float32Array(l*4),S=new Float32Array(l*3),M=new Float32Array(l*4);return a.forEach((m,A)=>{y.set([m.ax,m.ay,m.az],A*3),L.set([m.L,m.size,m.phase,m.amp],A*4);const P=z[m.tint];S.set([P.r,P.g,P.b],A*3),M.set([m.kind,m.phase,G[m.kind].c,G[m.kind].h],A*4)}),o.setAttribute("aAnchor",new e.InstancedBufferAttribute(y,3)),o.setAttribute("aHang",new e.InstancedBufferAttribute(L,4)),o.setAttribute("aTint",new e.InstancedBufferAttribute(S,3)),o.setAttribute("aLook",new e.InstancedBufferAttribute(M,4)),o.instanceCount=l,o.boundingSphere=new e.Sphere(x.clone(),i),F.push(o,t),o};let v=0,c=0;if(!n.length)return{object:d,time:_,triangles:v,drawCalls:c,dispose(){}};const h=j(e,p);F.push(h),G.forEach((t,a)=>{const o=n.filter(y=>y.kind===a);if(!o.length)return;const l=N(e,t);d.add(new e.Mesh(f(l,o),h)),v+=l.index.count/3*o.length,c++});const r=(t,a,o,l)=>{const y=new e.BufferGeometry;return y.setAttribute("position",new e.Float32BufferAttribute([t,a,0,o,a,0,o,l,0,t,l,0],3)),y.setIndex([0,1,2,0,2,3]),y},w=Q(e,p);F.push(w);const b=new e.Mesh(f(r(-1,0,1,1),n),w);b.renderOrder=2,d.add(b),v+=2*n.length,c++;const u=T(e,p);F.push(u);const k=new e.Mesh(f(r(-1,0,1,1),n),u);if(k.renderOrder=2,d.add(k),v+=2*n.length,c++,g>0){const t=V(e,{uHillTime:_,uHillLit:{value:g*(1.02-.72*g)}});F.push(t);const a=n.filter((l,y)=>y%2===0),o=new e.Mesh(f(r(-1,-1,1,1),a),t);o.renderOrder=3,d.add(o),v+=2*a.length,c++}return{object:d,time:_,triangles:v,drawCalls:c,dispose(){for(const t of F)t.dispose()}}}export{B as LANTERN_AIR,W as LINE_F,G as SHAPES,U as TINTS,Y as lampField,J as makeLanterns,X as placeLanterns};
