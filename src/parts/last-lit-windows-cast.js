import*as h from"three";import{NL_GLSL as g,FIG_POSE as A}from"./last-lit-windows.js";class y{constructor(){this.p=[],this.n=[],this.b=[],this.k=[],this.i=[]}tube(o,t,l,e=[0,0,0,0],s=!0,a=!0){const i=this.p.length/3;o.forEach((r,c)=>{const n=Array.isArray(l[0])?l[c]:l,f=Array.isArray(e[0])?e[c]:e;for(let p=0;p<t;p++){const m=p/t*Math.PI*2+Math.PI/t,w=Math.cos(m),d=Math.sin(m);this.p.push(r[0]+w*r[3],r[1]+d*r[4],r[2]),this.n.push(w,d,0),this.b.push(...n),this.k.push(...f)}});for(let r=0;r<o.length-1;r++)for(let c=0;c<t;c++){const n=i+r*t+c,f=i+r*t+(c+1)%t,p=n+t,m=f+t;this.i.push(n,p,f,f,p,m)}const u=(r,c)=>{const n=o[r],f=Array.isArray(l[0])?l[r]:l,p=Array.isArray(e[0])?e[r]:e,m=this.p.length/3;this.p.push(n[0],n[1],n[2]),this.n.push(0,0,c?-1:1),this.b.push(...f),this.k.push(...p);for(let w=0;w<t;w++){const d=i+r*t+w,b=i+r*t+(w+1)%t;c?this.i.push(m,b,d):this.i.push(m,d,b)}};s&&u(0,!0),a&&u(o.length-1,!1)}limb(o,t,l,e){const s=this.p.length/3;o.forEach((a,i)=>{for(let u=0;u<t;u++){const r=u/t*Math.PI*2+Math.PI/t,c=Math.cos(r),n=Math.sin(r);this.p.push(a[0]+c*a[3],a[1],a[2]+n*a[3]*(a[4]??1)),this.n.push(c,0,n),this.b.push(...l[i]),this.k.push(...e[i])}});for(let a=0;a<o.length-1;a++)for(let i=0;i<t;i++){const u=s+a*t+i,r=s+a*t+(i+1)%t,c=u+t,n=r+t;this.i.push(u,r,c,r,n,c)}}geometry(){const o=new h.BufferGeometry;return o.setAttribute("position",new h.Float32BufferAttribute(this.p,3)),o.setAttribute("normal",new h.Float32BufferAttribute(this.n,3)),o.setAttribute("aB",new h.Float32BufferAttribute(this.b,4)),o.setAttribute("aK",new h.Float32BufferAttribute(this.k,4)),o.setIndex(this.i),o}}function B(){const v=new y,o=[0,0,0,0],t=e=>[0,0,0,e];v.tube([[0,1.42,-1.3,.2,.24],[0,1.5,-.75,.33,.4],[0,1.47,0,.37,.44],[0,1.56,.62,.47,.62],[0,1.66,1,.34,.44],[0,1.62,1.4,.24,.27],[0,1.52,1.75,.2,.21],[0,1.4,2.2,.1,.1]],10,o,[t(-1),t(-.6),t(0),t(.5),t(.8),t(1),t(1),t(1)]);for(const e of[-1,1])v.tube([[e*.15,1.86,1.36,.07,.09],[e*.2,2.02,1.2,.01,.01]],4,o,t(1),!1,!1);v.tube([[0,1.46,-1.3,.08,.08],[0,1.32,-1.75,.06,.06],[0,1.02,-2.15,.03,.03]],5,o,[t(-1),t(-1.6),t(-2.2)],!1,!0);const l=(e,s,a,i,u,r,c,n)=>v.limb([[e,s,a,n*1.5,1.3],[e,i,u,n,1.1],[e,i,u,n,1.1],[e,.1,r,n*.75,1],[e,0,r+.1,n*1.1,1.5]],6,[[s,a,c,1],[s,a,c,1],[s,a,c,2],[s,a,c,2],[s,a,c,2]],[[i,u,0,0],[i,u,0,0],[i,u,0,0],[i,u,0,0],[i,u,0,0]]);return l(-.3,1.36,.66,.74,.74,.7,.5,.115),l(.3,1.36,.66,.74,.74,.7,.6,.115),l(-.27,1.34,-.9,.72,-1.12,-.95,0,.12),l(.27,1.34,-.9,.72,-1.12,-.95,.1,.12),v.geometry()}function P(){const v=new y,o=[0,0,0,0],t=[0,0,0,0];v.tube([[0,7,-.1,1.7,1],[0,9.4,.25,2,1.25],[0,11.3,.9,2.3,1.2],[0,12,1.3,1,.8]].map(e=>[e[0],e[2],e[1],e[3],e[4]]),8,o,t);{const e=v.p,s=v.n;for(let a=0;a<e.length;a+=3){const i=e[a+1],u=e[a+2];e[a+1]=u,e[a+2]=i;const r=s[a+1];s[a+1]=0,s[a+2]=r}}v.limb([[0,13.9,1.75,.5,1],[0,13.4,1.8,.95,1.1],[0,12.4,1.7,.85,1],[0,11.9,1.4,.5,1]],6,[o,o,o,o],[t,t,t,t]);const l=(e,s,a,i,u,r,c,n,f)=>v.limb([[e,s,a,f*1.3,1],[e,i,u,f,1],[e,i,u,f,1],[e,r+.3,c,f*.8,1],[e,r,c+.2,f*1,1.5]],6,[[s,a,n,1],[s,a,n,1],[s,a,n,2],[s,a,n,2],[s,a,n,2]],[0,1,2,3,4].map(()=>[i,u,0,0]));return l(-1,7.3,0,3.8,.2,0,0,0,.62),l(1,7.3,0,3.8,.2,0,0,.5,.62),l(-2.7,11,.8,8,.7,5,1.1,.5,.45),l(2.7,11,.8,8,.7,5,1.1,0,.45),v.geometry()}const S=`
${g}
uniform vec4 uAt[20];       // x, y, z, heading (0 = +Z)
uniform vec4 uGait[20];     // stride phase (turns), how hard it runs (0..1), size, unused
uniform vec4 uRig;          // swing of the limbs (rad), bend of the second joint, bob (m), flex of the spine
uniform vec3 uAlb; uniform float uRim, uFire;
attribute float aId; attribute vec4 aB; attribute vec4 aK;
varying vec3 vCol; varying vec3 vW;
vec2 rot(vec2 p, vec2 c, float a){ float s = sin(a), co = cos(a); vec2 d = p - c; return c + vec2(d.x*co - d.y*s, d.x*s + d.y*co); }
void main(){
  int id = int(aId + 0.5);
  vec4 at = uAt[id]; vec4 gait = uGait[id];
  float ph = gait.x*6.2831853, run = gait.y;
  vec3 p = position; vec3 n = normal;
  if (aB.w > 0.5) {
    float lp = ph + aB.z*6.2831853;
    float swing = uRig.x*run*sin(lp);
    if (aB.w > 1.5) { float bend = uRig.y*run*max(0.0, sin(lp + 1.9)); p.yz = rot(p.yz, aK.xy, bend); }
    p.yz = rot(p.yz, aB.xy, swing); n.yz = rot(n.yz, vec2(0.0), swing);
    p.y += uRig.z*run*sin(ph*2.0 + 0.8)*0.5;
  } else {
    p.y += uRig.z*run*sin(ph*2.0 + 0.8) + uRig.w*run*aK.w*abs(aK.w)*sin(ph + 0.4)*0.5;
  }
  p *= gait.z;
  float cy = cos(at.w), sy = sin(at.w);
  vec3 wp = vec3(p.x*cy + p.z*sy, p.y, -p.x*sy + p.z*cy) + at.xyz;
  vec3 N = normalize(vec3(n.x*cy + n.z*sy, n.y, -n.x*sy + n.z*cy));
  vec3 toE = cameraPosition - wp; vec3 V = toE/max(length(toE), 1e-3);
  // firelight carries far over a black plain to a thing as big as a horse: the pits redden it from uFire times their reach
  vec3 fire = vec3(0.0); float fr = 1.0 - abs(dot(N, V));        // the edge of the body, whichever way its plates are wound
  for (int i = 0; i < 4; i++) {
    vec3 dl = uPit[i].xyz - wp; float r2 = dot(dl, dl), rw = uPit[i].w*uFire;
    float ndl = max(dot(N, dl)*inversesqrt(r2 + 1e-3), 0.0);
    // (a black thing by a fire: little of the red lies on its body, most of it runs along the edge turned from us)
    fire += (uAlb*(0.02 + 0.25*ndl) + 0.24*uRim*fr*fr*fr*fr)*uPitCol[i]/(1.0 + r2/(rw*rw));
  }
  vCol = nlKey(wp, N, V, uAlb, uRim*0.5) + fire + nlPales(wp, N, V, uAlb*1.5, uRim) + uAlb*vec3(0.004, 0.0045, 0.007);
  vW = wp;
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
}`,x=`precision highp float;
${g}
varying vec3 vCol; varying vec3 vW;
void main(){ gl_FragColor = vec4(nlFog(vCol, vW), 1.0); }`;function R(v,o,t,l){const e=new h.InstancedBufferGeometry;e.index=o.index;for(const i of["position","normal","aB","aK"])e.setAttribute(i,o.attributes[i]);e.setAttribute("aId",new h.InstancedBufferAttribute(new Float32Array(t).map((i,u)=>u),1)),e.instanceCount=t;const s={...v.uniforms,uAt:{value:Array.from({length:20},()=>new h.Vector4(0,-500,0,0))},uGait:{value:Array.from({length:20},()=>new h.Vector4(0,1,1,0))},uRig:{value:new h.Vector4(...l.rig)},uAlb:{value:new h.Color(...l.albedo)},uRim:{value:l.rim??.9},uFire:{value:l.fire??1}},a=new h.Mesh(e,new h.ShaderMaterial({uniforms:s,vertexShader:S,fragmentShader:x}));return a.frustumCulled=!1,a.name=l.name||"creatures",{mesh:a,uniforms:s,at:s.uAt.value,gait:s.uGait.value,count:t,triangles:t*o.index.count/3}}function E(v,o){const t=[],l=[],e=[],a=[[0,.82],[.5,.74],[2.2,.56],[3.9,.5],[4.35,.62],[4.7,.34],[5,.38],[5.35,.26],[5.5,.02]];a.forEach(n=>{for(let f=0;f<9;f++){const p=f/9*6.2832;t.push(Math.cos(p)*n[1]*1.45*(n[0]>4&&n[0]<4.6?1.25:1),n[0],Math.sin(p)*n[1]*1.45*.8),l.push(Math.cos(p),.2,Math.sin(p))}});for(let n=0;n<a.length-1;n++)for(let f=0;f<9;f++){const p=n*9+f,m=n*9+(f+1)%9,w=p+9,d=m+9;e.push(p,m,w,m,d,w)}const i=new h.InstancedBufferGeometry;i.setAttribute("position",new h.Float32BufferAttribute(t,3)),i.setAttribute("normal",new h.Float32BufferAttribute(l,3)),i.setIndex(e),i.setAttribute("aId",new h.InstancedBufferAttribute(new Float32Array(o).map((n,f)=>f),1)),i.instanceCount=o;const u={...v.uniforms,uAt:{value:Array.from({length:12},()=>new h.Vector4(0,-500,0,0))}},r=new h.ShaderMaterial({uniforms:u,fragmentShader:x,vertexShader:`
      ${g}
      uniform vec4 uAt[12];      // x, y, z, a phase of its own
      attribute float aId;
      varying vec3 vCol; varying vec3 vW;
      void main(){
        vec4 at = uAt[int(aId + 0.5)];
        vec3 p = position; float hang = 1.0 - smoothstep(0.0, 4.7, p.y);
        // the shroud trails and sways below; the whole shape leans a little into its going, and rocks, slowly
        float ph = uTime*0.9 + at.w;
        p.x -= hang*hang*(0.55 + 0.25*sin(ph + p.z*2.0));
        p.z += hang*0.18*sin(ph*1.3 + p.x*3.0);
        p.x += 0.05*p.y*(1.0 + 0.4*sin(ph*0.5));
        vec3 wp = p + at.xyz;
        vec3 N = normalize(normal);
        vec3 toE = cameraPosition - wp; vec3 V = toE/max(length(toE), 1e-3);
        vec3 alb = vec3(0.02, 0.02, 0.024)*(0.7 + 0.5*nlN(vec2(position.y*3.0 + at.w, atan(position.z, position.x + 1e-4)*2.0)));
        vCol = nlKey(wp, N, V, alb, 0.03) + nlPits(wp, N, V, alb, 0.05);
        vW = wp;
        gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
      }`}),c=new h.Mesh(i,r);return c.frustumCulled=!1,c.name="walkers",{mesh:c,uniforms:u,at:u.uAt.value,count:o,triangles:o*e.length/3}}function F(v,o){const t=new h.InstancedBufferGeometry;t.setAttribute("position",new h.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),t.setIndex([0,1,2,0,2,3]),t.setAttribute("aPos",o.aPos),t.setAttribute("aVar",o.aVar),t.instanceCount=o.count,t.boundingSphere=o.sphere;const l={...v.uniforms,uEye:o.uniforms.uEye,uWave:o.uniforms.uWave},e=new h.ShaderMaterial({uniforms:l,transparent:!0,depthWrite:!1,blending:h.AdditiveBlending,side:h.DoubleSide,vertexShader:`
      uniform float uTime; uniform vec2 uRes;
      ${A}
      varying vec2 vQ; varying float vS; varying vec3 vW; varying vec2 vK;
      void main(){
        float yaw = figYaw(), raise = figRaise();
        vec3 hand = figHand(raise) + vec3(0.0, 0.1, 0.02);
        // the disc stands on edge in the hand, its face turned a little outward; raised, it tips toward the dark
        vec3 q = vec3(position.x*0.1, position.y*0.3, position.x*0.3);
        vec3 c0 = figPlace(hand, yaw), toE = cameraPosition - c0;
        float pix = length(toE)*1.2498/max(uRes.y, 1.0), hw = max(0.3, 1.2*pix), farK = smoothstep(0.3, 0.55, 1.2*pix);
        vec3 right = normalize(vec3(toE.z, 0.0, -toE.x) + vec3(1e-4, 0.0, 0.0));
        vec3 wp = mix(figPlace(hand + q, yaw), c0 + right*(position.x*hw) + vec3(0.0, position.y*hw, 0.0), farK);
        vQ = position.xy; vS = aVar.y; vW = wp; vK = vec2(farK, 0.3/hw);
        gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
      }`,fragmentShader:`precision highp float;
      ${g}
      varying vec2 vQ; varying float vS; varying vec3 vW; varying vec2 vK;
      void main(){
        float r = length(vQ), a = atan(vQ.y, vQ.x + 1e-5);
        float spin = a*3.0 + uTime*(9.0 + 5.0*vS) + vS*40.0;
        float rimL = smoothstep(0.82, 0.9, r)*(1.0 - smoothstep(0.94, 1.0, r));
        float blade = (1.0 - smoothstep(0.0, 0.9, r))*(0.25 + 0.75*smoothstep(0.2, 0.9, sin(spin)));
        float hub = 1.0 - smoothstep(0.0, 0.22, r);
        float wheel = (2.0*rimL + 0.7*blade + 1.3*hub)*(1.0 - smoothstep(0.96, 1.0, r));
        float k = clamp(vK.y, 0.0, 1.0);
        float point = 1.1*exp(-r*r*5.0)*(1.0 - smoothstep(0.8, 1.0, r))*k*k;
        float flick = 0.82 + 0.18*sin(uTime*(6.0 + 5.0*vS) + vS*50.0);
        vec3 c = vec3(0.72, 0.83, 1.0)*(mix(wheel, point, clamp(vK.x, 0.0, 1.0))*flick);
        gl_FragColor = vec4(c*(1.0 - nlFogAmount(vW, uFog.x*0.5)), 1.0);
      }`}),s=new h.Mesh(t,e);return s.name="discs",s.renderOrder=3,{mesh:s,uniforms:l,triangles:o.count*2}}export{F as buildDiscs,E as buildWalkers,P as giantGeometry,B as houndGeometry,R as makeCreatures};
