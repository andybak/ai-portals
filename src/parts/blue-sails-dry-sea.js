import*as l from"three";const V=e=>{const t=new l.Color(e);return[t.r,t.g,t.b]},pe=(e,t)=>{const a=e*Math.PI/180,s=t*Math.PI/180;return new l.Vector3(Math.sin(s)*Math.cos(a),Math.sin(a),-Math.cos(s)*Math.cos(a))},be=`
float bsH(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.x); }
float bsH1(float n){ return fract(sin(n*12.9898)*43758.5453); }
float bsN(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(bsH(i), bsH(i + vec2(1.,0.)), f.x), mix(bsH(i + vec2(0.,1.)), bsH(i + vec2(1.,1.)), f.x), f.y);
}
float bsF2(vec2 p){ return 0.62*bsN(p) + 0.38*bsN(p*2.07 + 9.1); }
float bsF3(vec2 p){ return 0.52*bsN(p) + 0.30*bsN(p*2.03 + 17.3) + 0.18*bsN(p*4.1 + 31.7); }
`,R=`
uniform float uTime, uG, uRun, uTack, uPx;
uniform vec2 uWind;
uniform vec4 uFog;
uniform vec3 uKeyDir, uKeyCol, uMoonDir, uMoonCol, uSkyCol, uGndCol, uSailA, uSailB, uGold;
vec3 bsLight(vec3 N){
  vec3 L = mix(uGndCol, uSkyCol, N.y*0.5 + 0.5);
  L += uKeyCol*clamp(dot(N, uKeyDir)*0.88 + 0.12, 0.0, 1.0);
  L += uMoonCol*clamp(dot(N, uMoonDir), 0.0, 1.0);
  return L;
}
float bsFogF(float d){ float x = uFog.a*d; return 1.0 - exp(-x*x); }
vec3 bsFog(vec3 c, float d){ return mix(c, uFog.rgb, bsFogF(d)); }
`,L=`
vec2 bsRun(vec4 s, vec4 s2){                                   // x: metres run along its course; y: 1 under way .. 0 at rest
  float R = s2.x, B = min(30.0, 0.4*R), raw = s.z*uG;
  float t = clamp((raw - (R - B))/max(2.0*B, 1e-3), 0.0, 1.0);
  return vec2(min(raw, R - B) + B*t*(2.0 - t), (1.0 - t)*step(0.001, R));
}
vec3 bsShipAt(vec4 s, vec4 s2){ float g = bsRun(s, s2).x; return vec3(s.x + sin(s2.w)*g, 0.0, s.y - cos(s2.w)*g); }
vec3 bsTurn(vec3 p, vec4 s2){ float c = cos(s2.w), sn = sin(s2.w); return vec3(p.x*c - p.z*sn, p.y, p.x*sn + p.z*c); }
vec3 bsPut(vec3 p, vec4 s, vec4 s2){ return bsShipAt(s, s2) + bsTurn(p, s2)*s2.y; }
float bsShipRun(vec4 s, vec4 s2){ return bsRun(s, s2).y; }
float bsShipSlack(vec4 s, vec4 s2){ float r = fract(s.w*0.61803); return smoothstep(0.15 + 0.3*r, 0.65 + 0.3*r, 1.0 - bsRun(s, s2).y); }
// a point of the sail in ship space: s from the luff (mast) to the leech, h from foot to peak
vec3 bsSail(float s, float h, float slack, float ph){
  vec3 base = mix(vec3(0.0, 3.3, -1.55), vec3(0.0, 23.6, 0.95), h);
  float chord = 11.0*(1.0 - 0.86*pow(max(h, 1e-4), 1.7));
  float ang = uTack*(mix(0.85, 1.22, slack) + slack*0.2*sin(uTime*0.8 + ph));
  vec3 along = vec3(sin(ang), 0.07, cos(ang));
  vec3 fwd = vec3(uTack*cos(ang), 0.0, -uTack*sin(ang));
  float gust = 0.86 + 0.14*sin(uTime*0.7 + ph + h*2.2);
  float belly = sin(3.1416*pow(max(s, 1e-4), 0.8))*(0.35 + 0.65*sin(3.1416*clamp(h*0.9 + 0.05, 0.0, 1.0)));
  float flut = (0.10 + 0.55*slack)*s*sin(9.0*s + h*7.0 - uTime*(4.0 + 2.5*slack) + ph) + 0.5*slack*s*sin(4.0*h - uTime*2.1 + ph*2.0);
  return base + along*chord*s*(1.0 - 0.07*belly) + fwd*(2.3*belly*gust*mix(1.0, 0.18, slack) + flut) - vec3(0.0, 0.8*slack*s*s, 0.0);
}
`;function ve(e,t){const a=e.R??0,s=Math.min(30,.4*a),i=(e.f??0)*t,m=Math.min(1,Math.max(0,(i-(a-s))/Math.max(2*s,.001)));return{s:Math.min(i,a-s)+s*m*(2-m),run:a>.001?1-m:0}}function ye(e={}){const t=(a,s=1)=>new l.Color(a).multiplyScalar(s);return{uTime:{value:0},uG:{value:0},uRun:{value:1},uTack:{value:e.tack??1},uPx:{value:.0027},uWind:{value:new l.Vector2((e.tack??1)*.6,-.8).normalize()},uFog:{value:new l.Vector4(.1,.1,.3,e.fog??.001)},uKeyDir:{value:pe(9,-60)},uKeyCol:{value:t("#E0A8C0",1.3)},uMoonDir:{value:pe(30,8)},uMoonCol:{value:t("#BFD0FF",.6)},uSkyCol:{value:t("#5868C0",.62)},uGndCol:{value:t("#8A6470",.45)},uSailA:{value:t(e.sailDeep??"#1C3CB0",.9)},uSailB:{value:t(e.sail??"#3F7FE6",1.4)},uGold:{value:t("#FFC46A",1)}}}function fe(){return{p:[],c:[],g:[],i:[],n:0}}function U(e,t,a,s,i,m=0){return e.p.push(t,a,s),e.c.push(i[0],i[1],i[2]),e.g.push(m),e.n++}function te(e,t,a,s,i){e.i.push(t,a,s,t,s,i)}function ae(e,t,a=!1,s=!1){const i=t[0].length,m=e.n;for(const p of t)for(const r of p)U(e,r[0],r[1],r[2],r[3],r[4]||0);const S=a?i:i-1;for(let p=0;p<t.length-1;p++)for(let r=0;r<S;r++){const v=m+p*i+r,f=m+p*i+(r+1)%i,o=m+(p+1)*i+(r+1)%i,u=m+(p+1)*i+r;s?te(e,v,u,o,f):te(e,v,f,o,u)}}const oe=new l.Vector3,X=new l.Vector3,K=new l.Vector3,Ge=new l.Vector3,Re=new l.Vector3;function j(e,t,a,s,i,m=0,S=1){const p=[];for(let r=0;r<t.length;r++){const v=t[Math.max(0,r-1)],f=t[Math.min(t.length-1,r+1)];oe.set(f[0]-v[0],f[1]-v[1],f[2]-v[2]).normalize(),K.set(0,1,0),Math.abs(oe.y)>.92&&K.set(1,0,0),X.crossVectors(oe,K).normalize(),K.crossVectors(X,oe).normalize();const o=typeof a=="number"?a:a[r],u=[],h=typeof i[0]=="number"?i:i[r];for(let d=0;d<s;d++){const M=d/s*Math.PI*2,N=Math.cos(M)*o,T=Math.sin(M)*o*S;u.push([t[r][0]+X.x*N+K.x*T,t[r][1]+X.y*N+K.y*T,t[r][2]+X.z*N+K.z*T,h,m])}p.push(u)}ae(e,p,!0)}function Ve(e,t,a,s,i,m,S,p,r=0){const v=t-i/2,f=t+i/2,o=a-m/2,u=a+m/2,h=s-S/2,d=s+S/2,M=(N,T,w,g)=>te(e,U(e,...N,p,r),U(e,...T,p,r),U(e,...w,p,r),U(e,...g,p,r));M([v,u,d],[f,u,d],[f,u,h],[v,u,h]),M([v,o,h],[f,o,h],[f,o,d],[v,o,d]),M([v,o,d],[f,o,d],[f,u,d],[v,u,d]),M([f,o,h],[v,o,h],[v,u,h],[f,u,h]),M([f,o,d],[f,o,h],[f,u,h],[f,u,d]),M([v,o,h],[v,o,d],[v,u,d],[v,u,h])}function Me(e,t,a,s,i,m,S=0,p=6,r=1){const v=[];for(let f=0;f<=p;f++){const o=f/p*Math.PI,u=[];for(let h=0;h<p+2;h++){const d=h/(p+2)*Math.PI*2;u.push([t+Math.sin(o)*Math.cos(d)*i,a+Math.cos(o)*i*r,s+Math.sin(o)*Math.sin(d)*i,m,S])}v.push(u)}ae(e,v,!0,!0)}function me(e,t=!1){let a=new l.BufferGeometry;return a.setAttribute("position",new l.Float32BufferAttribute(e.p,3)),a.setAttribute("color",new l.Float32BufferAttribute(e.c,3)),a.setAttribute("aGlow",new l.Float32BufferAttribute(e.g,1)),a.setIndex(e.i),t&&(a=a.toNonIndexed()),a.computeVertexNormals(),a.userData.triangles=e.i.length/3,a}const Z=8,Y=e=>{const t=Math.abs(e);return 2.35+3.2*Math.pow(t,2.8)+(e<0?1.3*Math.pow(t,9):.5*Math.pow(t,9))},ue=e=>{const t=Math.abs(e);return 1.2+2.9*Math.pow(t,2.6)+(e<0?1.2*Math.pow(t,9):.4*Math.pow(t,9))},de=e=>1.7*Math.pow(Math.max(1-Math.pow(Math.abs(e),2.4),0),.55)+.03,I=e=>Y(e/Z)-.32;function ke(e=1){const t=fe(),a=e>1,s=a?44:22,i=a?16:8,m=V("#8C6B3E"),S=V("#3f6f5c"),p=V("#cfc6b4"),r=V("#3a3026"),v=V("#b89a6a"),f=V("#FFC46A"),o=(w,g,b)=>[w[0]+(g[0]-w[0])*b,w[1]+(g[1]-w[1])*b,w[2]+(g[2]-w[2])*b],u=[];for(let w=0;w<=s;w++){const g=w/s*2-1,b=g*Z*(1+.04*Math.abs(g)),A=de(g),z=Y(g),F=ue(g),W=[];for(let C=0;C<=i;C++){const $=-Math.PI/2+Math.PI*C/i,E=Math.cos($),J=.5+.5*Math.sin(w*1.7+C*2.3)*Math.sin(w*.6+1);let D=o(m,S,Math.min(1,.15+.75*Math.pow(E,1.5)*J));D=o(D,v,.5*Math.pow(1-E,6)),W.push([A*Math.sin($),z-(z-F)*Math.pow(E,.7),b,D])}u.push(W)}ae(t,u,!1,!0);const h=[];for(let w=0;w<=s;w++){const g=w/s*2-1;if(Math.abs(g)>.86)continue;const b=g*Z*(1+.04*Math.abs(g)),A=Math.max(de(g)-.1,.02),z=Y(g)-.32,F=o(p,v,.25*(w%2));h.push([[-A,z,b,F],[0,z+.05,b,o(F,p,.5)],[A,z,b,F]])}ae(t,h,!1,!1);for(const w of[-1,1]){const g=[],b=[],A=a?30:16;for(let z=0;z<=A;z++){const F=z/A,W=-10.6+22.4*F,C=Math.max(0,1-F*4.2);g.push([w*(3-.25*C*C),.26+2.6*C*C*C+.25*Math.pow(Math.max(0,(F-.9)*10),2),W+1.2*C*C]),b.push(o(r,m,.35+.3*C))}j(t,g,.13,a?6:4,b,0,2)}for(const w of[-3.2,3]){const g=ue(w/Z)-.03,b=[],A=a?16:10;for(let z=0;z<=A;z++){const F=z/A*2-1;b.push([2.97*F,.42+(g-.42)*(1-F*F),w+1.4*F*F])}j(t,b,.3,a?6:4,o(m,r,.3),0,.3)}j(t,[[0,ue(.56)+.05,4.5],[0,.8,8.2],[0,.22,10.2],[0,.16,11.8]],[.12,.11,.09,.07],4,r,0,2.2),j(t,[[0,I(6)+1.35,6.3],[.1,I(5)+1.1,5],[.25,I(4.2)+1,4.1]],.06,4,v);const d=[],M=[],N=[],T=a?10:5;for(let w=0;w<=T;w++){const g=w/T;d.push([0,I(-2)+(26.2-I(-2))*g,-2+3.3*g]),M.push(.21-.14*g),N.push(o(r,m,.2+.5*g))}return j(t,d,M,a?8:5,N),Me(t,0,Y(-1)+.28,-Z*1.04,.24,f,3.2,a?6:3),me(t)}const Se=`
${R}
uniform float uSheen, uBounce;
varying vec3 vCol, vN, vW; varying float vGlow, vSailLit;
void main(){
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0)); if (!gl_FrontFacing) N = -N;
  vec3 Vv = cameraPosition - vW; float d = length(Vv); vec3 V = Vv/max(d, 1e-3);
  vec3 c = vCol*bsLight(N);
  float sp = clamp(dot(reflect(-V, N), uKeyDir), 0.0, 1.0); sp *= sp; sp *= sp; sp *= sp;
  c += uKeyCol*vCol*sp*uSheen;
  c += vCol*(uKeyCol*0.5 + uSkyCol*0.3)*uBounce*clamp(0.55 - 0.45*N.y, 0.0, 1.0);          // light thrown back up by the pale sand
  c += vCol*uSailB*vSailLit*clamp(N.y*0.6 + 0.4, 0.0, 1.0);
  c += vCol*max(vGlow, 0.0);
  gl_FragColor = vec4(bsFog(max(c, 0.0), d), 1.0);
}`;function Ae(e,t={}){const a=t.mode==="ship";return new l.ShaderMaterial({uniforms:{...e,uSheen:{value:t.sheen??0},uSailLit:{value:t.sailLit??0},uBounce:{value:t.bounce??0}},side:t.side??l.DoubleSide,vertexShader:`
${R}
${L}
uniform float uSailLit;
attribute vec3 color; attribute float aGlow;
${a?"attribute vec4 aShip, aShip2;":""}
varying vec3 vCol, vN, vW; varying float vGlow, vSailLit;
void main(){
  vec3 lp = position, n = normal;
  ${a?`
  float run = bsShipRun(aShip, aShip2);
  float tr = run*aShip.z;                                       // the hull trembles with its speed
  lp.y += tr*(0.035*sin(uTime*19.0 + aShip.w*7.0 + position.z*0.6) + 0.05*sin(uTime*3.1 + aShip.w));
  lp.x += tr*0.02*sin(uTime*23.0 + aShip.w*3.0) + 0.012*position.y*sin(uTime*1.3 + aShip.w);
  vec4 wp = vec4(bsPut(lp, aShip, aShip2), 1.0); n = bsTurn(n, aShip2);
  vSailLit = uSailLit*smoothstep(0.5, 3.5, position.y)*(0.8 + 0.2*sin(uTime*0.7 + aShip.w));
  vCol = color*(0.9 + 0.2*aShip2.z);`:`
  #ifdef USE_INSTANCING
  lp = (instanceMatrix*vec4(lp, 1.0)).xyz; n = mat3(instanceMatrix)*n;
  #endif
  vec4 wp = modelMatrix*vec4(lp, 1.0); n = mat3(modelMatrix)*n;
  vSailLit = uSailLit; vCol = color;`}
  vN = n; vW = wp.xyz; vGlow = aGlow;
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,fragmentShader:Se})}function Fe(){const e=fe(),t=V("#d9d2c8"),a=V("#b9a9b4"),s=V("#7a5a50"),i=V("#FFC46A");j(e,[[0,0,0],[0,.95,0],[0,1.17,0],[0,1.25,0]],[.27,.17,.2,.07],5,[a,t,t,t]),j(e,[[0,1.24,0],[0,1.33,0],[0,1.45,0],[0,1.52,0]],[.05,.1,.095,.03],4,s);const m=e.n,S=[];for(const h of[-1,-.4,.4,1]){const d=Math.sqrt(1-h*h),M=[];for(const N of[-1,-1/3,1/3,1]){const T=N*d*1;M.push(U(e,.104*Math.sin(T),1.385+.095*h,.104*Math.cos(T),i,.55))}S.push(M)}for(let h=0;h<3;h++)for(let d=0;d<3;d++)te(e,S[h][d],S[h][d+1],S[h+1][d+1],S[h+1][d]);const p=e.n;j(e,[[.2,1.15,0],[.27,.72,.06]],[.06,.04],3,t);const r=e.n;j(e,[[-.2,1.15,0],[-.25,.74,.08]],[.06,.04],3,t);const v=me(e),f=new Float32Array(e.n);for(let h=p;h<r;h++)f[h]=1;v.setAttribute("aArm",new l.BufferAttribute(f,1));const o=v.attributes.normal,u=v.attributes.position;for(let h=m;h<p;h++)o.setXYZ(h,u.getX(h)*9,.3,u.getZ(h)*9);return v}function ze(e,t,a=Fe()){const s=t.length,i=new Float32Array(s*4),m=new Float32Array(s*4),S=new Float32Array(s*4),p=new Float32Array(s*2);t.forEach((o,u)=>{i.set([o.x,o.y,o.z,o.heading??0],u*4),m.set([o.dx??0,o.dz??0,o.len??0,o.phase??u*1.7],u*4),S.set([o.f??0,o.fwd??0,o.arm??0,o.scale??1],u*4),p.set([o.th??0,o.R??0],u*2)});const r=_(a,s,[["iPos",i,4],["iMove",m,4],["iShip",S,4],["iAim",p,2]]),v=new l.ShaderMaterial({uniforms:{...e,uSheen:{value:0},uBounce:{value:0}},vertexShader:`
${R}
${L}
attribute vec3 color; attribute float aGlow, aArm; attribute vec2 iAim; attribute vec4 iPos, iMove, iShip;
varying vec3 vCol, vN, vW; varying float vGlow, vSailLit;
void main(){
  float ph = iMove.w, len = iMove.z;
  vec2 rn = bsRun(vec4(0.0, 0.0, iShip.x, 0.0), vec4(iAim.y, 0.0, 0.0, 0.0));
  vec3 go = vec3(sin(iAim.x), 0.0, -cos(iAim.x))*(rn.x + iShip.y*(1.0 - rn.y));            // how far the ship under it has run; hands go forward as she slows
  vec3 p = position, n = normal;
  float raise = iShip.z*smoothstep(0.1, 0.9, sin(uTime*0.4 + ph*3.0));
  if (aArm > 0.5) { vec2 r = p.xy - vec2(0.2, 1.15); float a = raise*2.3, ca = cos(a), sa = sin(a); p.xy = vec2(0.2, 1.15) + vec2(r.x*ca - r.y*sa, r.x*sa + r.y*ca); }
  // the gold mask keeps its own size at every distance (it used to swell with distance into a plate wider than the head)
  float mk = 1.0;
  p.x += 0.035*sin(uTime*0.9 + ph)*p.y; p.z += 0.03*sin(uTime*0.6 + ph*1.3)*p.y;
  float cyc = uTime*0.45/max(len, 1.0) + ph*0.37, fr = fract(cyc), tri = abs(fr*2.0 - 1.0);
  float turn = smoothstep(0.46, 0.54, fr)*(1.0 - smoothstep(0.95, 1.0, fr));
  float hd = iPos.w + step(0.01, len)*3.1416*turn + 0.45*sin(uTime*0.27 + ph*2.0)*(1.0 - step(0.01, len)*0.7);
  float ch = cos(hd), sh = sin(hd);
  p = vec3(p.x*ch + p.z*sh, p.y, -p.x*sh + p.z*ch); n = vec3(n.x*ch + n.z*sh, n.y, -n.x*sh + n.z*ch);
  p.y += step(0.01, len)*0.02*abs(sin(uTime*2.7 + ph));
  vec3 w = iPos.xyz + p*iShip.w + vec3(iMove.x, 0.0, iMove.y)*(1.0 - tri)*len;
  w += go;
  vN = n; vW = w; vCol = color; vGlow = aGlow*(0.75 + 0.25*sin(uTime*1.1 + ph*5.0))*min(1.0, 1.4/mk + 0.3); vSailLit = step(0.001, iShip.x)*0.5;
  gl_Position = projectionMatrix*viewMatrix*vec4(w, 1.0);
}`,fragmentShader:Se}),f=new l.Mesh(r,v);return f.frustumCulled=!1,f}function _(e,t,a){const s=new l.InstancedBufferGeometry;s.index=e.index;for(const i in e.attributes)s.setAttribute(i,e.attributes[i]);for(const[i,m,S]of a)s.setAttribute(i,new l.InstancedBufferAttribute(m,S));return s.instanceCount=t,s}function Ce(e){return new l.ShaderMaterial({uniforms:e,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,side:l.DoubleSide,vertexShader:`
${R}
${L}
attribute vec4 aShip, aShip2;
varying vec2 vUv; varying vec4 vS; varying vec3 vW;
void main(){
  float slack = bsShipSlack(aShip, aShip2);
  vec3 wp = bsPut(bsSail(uv.x, uv.y, slack, aShip.w), aShip, aShip2);
  vW = wp; vUv = uv; vS = vec4(slack, aShip.w, aShip2.z, bsShipRun(aShip, aShip2));
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
}`,fragmentShader:`
${R}
${be}
varying vec2 vUv; varying vec4 vS; varying vec3 vW;
void main(){
  float s = clamp(vUv.x, 0.0, 1.0), h = clamp(vUv.y, 0.0, 1.0), slack = clamp(vS.x, 0.0, 1.0), ph = vS.y, t = uTime;
  float chord = 1.0 - 0.86*pow(max(h, 1e-4), 1.7);
  vec2 q = vec2(s*chord*3.4 + ph*7.0, h*6.5);
  // smoke that rises through the sail: two warped layers, the fine one faster
  vec2 wq = vec2(bsN(q*0.7 + vec2(0.0, -t*0.10)), bsN(q*0.7 + 5.3 + vec2(t*0.05, -t*0.08))) - 0.5;
  float n1 = bsF3(q + 1.7*wq + vec2(t*0.04, -t*0.24));
  float n2 = bsF2(q*2.2 - 1.3*wq + vec2(-t*0.07, -t*0.55) + 3.7);
  // the cloth is densest along the mast and the middle and frays into smoke at the leech, the peak and the foot
  float core = (1.0 - 0.55*pow(max(s, 1e-4), 1.6))*(1.0 - 0.4*h*h);
  float edge = (1.0 - smoothstep(0.6, 1.0, s))*smoothstep(0.0, 0.06, h)*(1.0 - smoothstep(0.84, 1.0, h))*smoothstep(0.0, 0.015, s);
  float fray = mix(0.24, 0.92, smoothstep(0.45, 1.0, s)) + 0.35*slack + 0.5*smoothstep(0.75, 1.0, h) + 0.4*(1.0 - smoothstep(0.0, 0.12, h));
  float a = clamp((core*1.25 - fray*(1.0 - n1))*1.6, 0.0, 1.0);
  a *= 0.62 + 0.38*smoothstep(0.25, 0.7, n1 + 0.5*core);                                 // thin places where the sky shows through
  a = max(a, 0.5*edge*smoothstep(0.42, 0.75, n1)*(0.4 + 0.6*core));
  a *= mix(1.0, edge, 0.85);
  // the light inside: brightest by the mast, with paler currents climbing
  float cur = smoothstep(0.38, 0.82, n2)*(0.35 + 0.65*core);
  vec3 col = mix(uSailA, uSailB, clamp(core*0.8 + 0.3*n1 - 0.1, 0.0, 1.0));
  col = mix(col, uSailB*vec3(1.2, 1.18, 1.0) + vec3(0.05, 0.12, 0.16), 0.5*cur);
  col *= 0.5 + 0.85*n1*n1 + 0.1*sin(t*0.9 + ph*3.0 + h*3.0);
  col += uKeyCol*vec3(0.5, 0.25, 0.4)*0.22*(1.0 - core);                                 // the afterglow in the thin smoke of the edge
  col *= 0.86 + 0.28*clamp(vS.z, 0.0, 1.0);
  float d = length(cameraPosition - vW);
  a *= smoothstep(1.2, 5.0, d);
  col = mix(col, uFog.rgb, 0.7*bsFogF(d));
  gl_FragColor = vec4(col*a, a*0.94);
}`})}function Be(e){return new l.ShaderMaterial({uniforms:e,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,vertexShader:`
${R}
${L}
attribute vec4 aShip, aShip2, aSeed;
varying vec2 vQ; varying float vA;
void main(){
  float slack = bsShipSlack(aShip, aShip2), run = bsShipRun(aShip, aShip2);
  float age = fract(uTime*(0.16 + 0.1*aSeed.z) + aSeed.y);
  vec3 o = bsSail(0.78 + 0.2*aSeed.z, aSeed.x, slack, aShip.w);
  o += (vec3(uWind.x, 0.0, uWind.y)*(1.5 + 3.0*slack) + vec3(0.0, 0.0, 7.0*run*aShip.z))*age + vec3(0.0, 1.6*age + 0.5*sin(age*5.0 + aSeed.w*6.0), 0.0);
  vec3 wp = bsPut(o, aShip, aShip2);
  float size = (1.4 + 4.2*age)*(0.7 + 0.6*aSeed.w);
  vec4 mv = viewMatrix*vec4(wp, 1.0); mv.xy += position.xy*size;
  vQ = position.xy; float k = 1.0 - age;
  vA = 0.34*k*k*smoothstep(0.0, 0.12, age)*smoothstep(1.5, 6.0, -mv.z)*(1.0 - bsFogF(-mv.z));
  gl_Position = projectionMatrix*mv;
}`,fragmentShader:`
${R}
varying vec2 vQ; varying float vA;
void main(){
  float r2 = dot(vQ, vQ), g = clamp(1.0 - r2, 0.0, 1.0); g *= g;
  float a = max(vA, 0.0)*g;
  gl_FragColor = vec4(mix(uSailA, uSailB, 0.55)*a, a*0.5);
}`})}function we(e){return new l.ShaderMaterial({uniforms:e,side:l.DoubleSide,vertexShader:`
${R}
${L}
attribute vec4 aShip, aShip2, aAt;        // aAt: attach point in ship space, length
varying vec3 vC; varying float vD;
void main(){
  float run = bsShipRun(aShip, aShip2), s = position.x, ph = aShip.w*3.0 + aAt.y;
  vec3 dir = normalize(mix(vec3(uWind.x*0.85, -0.5, uWind.y*0.85 + 0.2), vec3(uTack*0.28, 0.06, 1.0), run*aShip.z + 0.1));
  vec3 side = normalize(cross(dir, vec3(0.0, 1.0, 0.0)));
  float w1 = sin(s*9.0 - uTime*(3.0 + 6.0*run) + ph), w2 = sin(s*17.0 - uTime*(5.0 + 8.0*run) + ph*1.7);
  vec3 o = aAt.xyz + dir*s*aAt.w + side*(0.55*w1 + 0.2*w2)*s + vec3(0.0, 0.3*w2*s - 0.9*s*s*(1.0 - run*aShip.z), 0.0);
  vec3 wp = bsPut(o, aShip, aShip2);
  vec3 V = cameraPosition - wp; float d = length(V);
  vec3 wd = normalize(cross(dir + side*0.5*cos(s*9.0 - uTime*4.0 + ph), V/max(d, 1e-3)) + vec3(0.0, 1e-4, 0.0));
  float wdt = max(0.22*(1.0 - 0.6*s), 0.9*uPx*d);
  wp += wd*position.y*wdt;
  float lit = 0.6 + 0.4*sin(s*9.0 - uTime*(3.0 + 6.0*run) + ph + 1.3);
  vC = mix(vec3(0.75, 0.52, 0.56), vec3(0.85, 0.74, 0.62), fract(aAt.y*0.37))*lit*(uKeyCol*0.9 + uSkyCol*0.7) + uSailB*0.12;
  vC *= min(1.0, 0.22*(1.0 - 0.6*s)/wdt);
  vD = d;
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
}`,fragmentShader:`
${R}
varying vec3 vC; varying float vD;
void main(){ gl_FragColor = vec4(bsFog(max(vC, 0.0), max(vD, 0.0)), 1.0); }`})}function Te(e){return new l.ShaderMaterial({uniforms:e,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,side:l.DoubleSide,vertexShader:`
${R}
${L}
attribute vec4 aShip, aShip2, aA, aB;      // aA: from (ship space), kind (0 fixed, 1 boom, 2 sheet); aB: to, half width
varying vec4 vC;
void main(){
  float slack = bsShipSlack(aShip, aShip2);
  vec3 a = aA.xyz, b = aB.xyz;
  if (aA.w > 1.5) a = bsSail(0.95, 0.0, slack, aShip.w);
  else if (aA.w > 0.5) { a = bsSail(0.0, 0.0, slack, aShip.w); b = bsSail(1.0, 0.0, slack, aShip.w); }
  vec3 wp = bsPut(mix(a, b, position.x), aShip, aShip2);
  vec3 V = cameraPosition - wp; float d = length(V);
  vec3 sd = normalize(cross(bsTurn(b - a, aShip2), V) + vec3(0.0, 1e-4, 0.0));
  float w = max(aB.w, 0.8*uPx*d);
  wp += sd*position.y*w;
  vec3 c = vec3(0.30, 0.22, 0.15)*(uKeyCol*0.8 + uSkyCol*0.9 + uMoonCol*0.4) + uSailB*0.06;
  float al = min(1.0, aB.w/w)*(1.0 - 0.7*bsFogF(d));
  vC = vec4(mix(c, uFog.rgb, bsFogF(d))*al, al);
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
}`,fragmentShader:`
varying vec4 vC;
void main(){ gl_FragColor = max(vC, 0.0); }`})}function je(e,t){const a=t.length,s=14,i=[],m=[];for(let o=0;o<=s;o++)i.push(o/s,-1,0,o/s,1,0);for(let o=0;o<s;o++){const u=o*2;m.push(u,u+2,u+3,u,u+3,u+1)}const S=new l.BufferGeometry;S.setAttribute("position",new l.Float32BufferAttribute(i,3)),S.setIndex(m);const p=new Float32Array(a*4),r=new Float32Array(a*4),v=new Float32Array(a*4);t.forEach((o,u)=>{p.set([o.x,o.z,0,o.phase??u*1.3],u*4),r.set([1,1,.5,0],u*4),v.set([0,o.y,0,o.len??8],u*4)});const f=new l.Mesh(_(S,a,[["aShip",p,4],["aShip2",r,4],["aAt",v,4]]),we(e));return f.frustumCulled=!1,f}function Pe(e){return new l.ShaderMaterial({uniforms:{...e,uSand:{value:new l.Color("#EBD9BE")}},transparent:!0,premultipliedAlpha:!0,depthWrite:!1,vertexShader:`
${R}
${L}
attribute vec4 aShip, aShip2, aSeed;      // aSeed: runner side, phase, two randoms
varying vec2 vQ; varying float vA, vK;
void main(){
  float run = bsShipRun(aShip, aShip2)*aShip.z;
  float age = fract(uTime*0.42 + aSeed.y);
  vec3 o = vec3(aSeed.x*3.0, 0.25, 4.5 + 4.0*aSeed.z);
  o += vec3(uWind.x*4.0*age*age + (aSeed.w - 0.5)*3.2*age + 0.5*sin(uTime*1.7 + aSeed.y*31.0)*age, (0.8 + 5.0*aSeed.z*aSeed.w)*age*sqrt(age), age*(7.0 + 34.0*run));
  vec3 wp = bsPut(o, aShip, aShip2);
  float size = (0.9 + 5.6*age)*(0.6 + 0.9*aSeed.w);
  vec4 mv = viewMatrix*vec4(wp, 1.0); mv.xy += position.xy*size*vec2(1.5, 0.8);
  vQ = position.xy; float k = 1.0 - age;
  vA = 0.42*k*sqrt(k)*smoothstep(0.0, 0.07, age)*smoothstep(0.02, 0.5, run)*smoothstep(1.0, 5.0, -mv.z)*(1.0 - bsFogF(-mv.z));
  vK = age;
  gl_Position = projectionMatrix*mv;
}`,fragmentShader:`
${R}
uniform vec3 uSand;
varying vec2 vQ; varying float vA, vK;
void main(){
  float r2 = dot(vQ, vQ), g = clamp(1.0 - r2, 0.0, 1.0); g *= g;
  vec3 c = uSand*(uSkyCol*0.4 + uMoonCol*0.25 + uKeyCol*vec3(1.0, 1.15, 0.6)*(0.6 + 0.3*clamp(vQ.y, -1.0, 1.0))) + uSailB*0.10*clamp(1.0 - vK, 0.0, 1.0);
  float a = max(vA, 0.0)*g;
  gl_FragColor = vec4(c*a, a);
}`})}function Ne(e,t,a,s={}){const i=a.length,m=new l.Group,S=(n,c)=>{const x=new Float32Array(i*n*4);for(let k=0;k<i;k++)for(let G=0;G<n;G++)x.set(c(a[k],k,G),(k*n+G)*4);return x},p=n=>S(n,c=>[c.x,c.z0,c.f,c.phase]),r=n=>S(n,c=>[c.R??0,c.size??1,c.tint??.5,c.th??0]),v=(n,c,x)=>{const k=new l.Mesh(n,c);return k.frustumCulled=!1,x!==void 0&&(k.renderOrder=x),m.add(k),k};v(_(ke(s.detail??1),i,[["aShip",p(1),4],["aShip2",r(1),4]]),Ae(t,{mode:"ship",sheen:1.2,sailLit:.7,bounce:.6}));const f=10,o=30,u=[],h=[],d=[];for(let n=0;n<=o;n++)for(let c=0;c<=f;c++)u.push(0,0,0),h.push(c/f,n/o);for(let n=0;n<o;n++)for(let c=0;c<f;c++){const x=n*(f+1)+c;d.push(x,x+1,x+f+2,x,x+f+2,x+f+1)}const M=new l.BufferGeometry;M.setAttribute("position",new l.Float32BufferAttribute(u,3)),M.setAttribute("uv",new l.Float32BufferAttribute(h,2)),M.setIndex(d);const N=p(1),T=r(1),w=_(M,i,[["aShip",N,4],["aShip2",T,4]]);v(w,Ce(t),6);const g=new l.BufferGeometry;g.setAttribute("position",new l.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),g.setIndex([0,1,2,0,2,3]);const b=20,A=28,z=s.sprites||(n=>e.core.makeRng(e.core.hashSeed(e.seed+":sand-ship:"+n))),F=a.map((n,c)=>z(c)),W=new Float32Array(i*b*4);for(let n=0;n<i*b;n++){const c=F[Math.floor(n/b)];W.set([.08+.9*c(),c(),c(),c()],n*4)}v(_(g,i*b,[["aShip",p(b),4],["aShip2",r(b),4],["aSeed",W,4]]),Be(t),7);const C=new Float32Array(i*A*4);for(let n=0;n<i*A;n++){const c=F[Math.floor(n/A)];C.set([n%2?1:-1,(n%A+c()*.6)/A,c(),c()],n*4)}v(_(g,i*A,[["aShip",p(A),4],["aShip2",r(A),4],["aSeed",C,4]]),Pe(t),5);const $=14,E=[],J=[];for(let n=0;n<=$;n++)E.push(n/$,-1,0,n/$,1,0);for(let n=0;n<$;n++){const c=n*2;J.push(c,c+2,c+3,c,c+3,c+1)}const D=new l.BufferGeometry;D.setAttribute("position",new l.Float32BufferAttribute(E,3)),D.setIndex(J);const ge=[[0,26.1,1.28,8],[0,24.9,1.12,6.5],[0,23.7,.97,7.2]];v(_(D,i*3,[["aShip",p(3),4],["aShip2",r(3),4],["aAt",S(3,(n,c,x)=>ge[x]),4]]),we(t));const ie=[[0,26,1.27,0,0,Y(-1)+.1,-8.25,.028],[0,26,1.27,0,0,Y(1)-.1,8.25,.028],[0,19,.4,0,1.7,2.35,.2,.024],[0,19,.4,0,-1.7,2.35,.2,.024],[0,3.3,-1.55,1,0,3.3,8,.075],[0,3.3,6,2,.1,I(5.6)+.25,5.6,.022]],ne=new l.BufferGeometry;ne.setAttribute("position",new l.Float32BufferAttribute([0,-1,0,0,1,0,1,1,0,1,-1,0],3)),ne.setIndex([0,2,1,0,3,2]);const O=ie.length;v(_(ne,i*O,[["aShip",p(O),4],["aShip2",r(O),4],["aA",S(O,(n,c,x)=>ie[x].slice(0,4)),4],["aB",S(O,(n,c,x)=>ie[x].slice(4)),4]]),Te(t),5);const se=[],ee=t.uTack.value;a.forEach((n,c)=>{const x=n.size??1,k=n.th??0,G=Math.cos(k),B=Math.sin(k),y=(P,Q,q)=>se.push({x:n.x+(P*G-Q*B)*x,y:I(Q)*x,z:n.z0+(P*B+Q*G)*x,f:n.f,R:n.R??0,th:k,scale:x*(n.lead?1.12:1),...q,heading:q.heading-k});y(.5,5.4,{heading:-ee*(.7+.4*(n.phase*.37%1)),phase:n.phase*3+1,arm:0});const H=1+c%2;for(let P=0;P<H;P++)y(P?-.75:.8,-.4-P*1.4,{heading:Math.PI+(P?.5:-.4),fwd:n.moored?0:3.6-P,arm:(c+P)%3===0?1:0,phase:n.phase*5+P*2.3});n.lead&&(y(-.75*ee,3.5,{heading:ee*.9,arm:1,phase:n.phase*2+.7}),y(0,-5.4,{heading:Math.PI-.2*ee,arm:0,phase:n.phase*4+2.9}),H<2&&y(-.75,-1.8,{heading:Math.PI+.5,fwd:2.6,arm:1,phase:n.phase*5+2.3}))}),m.add(ze(t,se));const re=a.map((n,c)=>c),ce=new Float32Array(i),le=new l.Vector3;let he="";function xe(n,c,x){le.setFromMatrixPosition(x.matrixWorld);const k=t.uG.value;for(let B=0;B<i;B++){const y=a[B],H=y.th??0,P=ve(y,k).s,Q=y.x+Math.sin(H)*P-le.x,q=y.z0-Math.cos(H)*P-le.z;ce[B]=Q*Q+q*q}re.sort((B,y)=>ce[y]-ce[B]);const G=re.join(",");if(G!==he){he=G;for(let B=0;B<i;B++){const y=a[re[B]];N.set([y.x,y.z0,y.f,y.phase],B*4),T.set([y.R??0,y.size??1,y.tint??.5,y.th??0],B*4)}w.attributes.aShip.needsUpdate=!0,w.attributes.aShip2.needsUpdate=!0}}return{object:m,update:xe,ships:a,count:i,crew:se.length,shipAt:(n,c)=>{const x=a[n],k=x.th??0,G=ve(x,t.uG.value).s;return c.set(x.x+Math.sin(k)*G,0,x.z0-Math.cos(k)*G)}}}async function Ie(e,t={}){const a=!t.shared,s=t.shared||ye({tack:t.tack??1});a&&s.uFog.value.set(.25,.2,.35,6e-4),await e.yield();const i=Ne(e,s,[{x:0,z0:0,f:.84,R:1e6,th:0,moored:0,size:1,tint:.6,phase:1.3,lead:!0}],{detail:2});await e.yield();const m=new l.Vector2;return{object:i.object,radius:15,height:27,center:new l.Vector3(s.uTack.value*3,11,1),shared:s,fleet:i,anchors:{tiller:new l.Vector3(.5,I(5.4),5.4),masthead:new l.Vector3(0,26.2,1.3)},update(S,p,r){a&&(s.uTime.value=p,e.renderer&&(e.renderer.getDrawingBufferSize(m),s.uPx.value=2/(Math.max(r.projectionMatrix.elements[5],.1)*Math.max(m.y,1)))),i.update(S,p,r)},dispose(){},ground:!0,groundY:0}}export{R as BS_COMMON,be as BS_NOISE,L as BS_SHIP,Me as ball,Ve as box,Ie as buildHero,I as deckY,Fe as figureGeometry,me as finish,_ as instanced,V as lin,Ae as litMaterial,ae as loft,fe as makeAcc,je as makeBanners,ze as makeFigures,Ne as makeFleet,ye as makeShared,te as quad,ke as shipGeometry,ve as shipRunAt,pe as skyDir,j as tube,U as vtx};
