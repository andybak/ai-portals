import*as s from"three";import*as H from"../kit/fx.js";import*as re from"../kit/flora.js";import{BS_NOISE as le,BS_COMMON as V,lin as K,makeAcc as J,loft as ce,tube as ve,box as qe,ball as ee,finish as Y,litMaterial as Be,makeFigures as Ke,instanced as q}from"./blue-sails-dry-sea.js";import{WATER_Y as I,QUAY_Y as B,FLOOR_Y as _,BASIN as W,BRIDGES as je,LAMP_ROW as D,AVENUE_LAMPS as ye,RING_LAMPS as te,TIER_LAMPS as Je,STAIR_LAMPS as oe,WALL_LAMPS as ue,STAIRS as $e,stairZ as Ae,lathe as Ie}from"./blue-sails-dry-sea-town.js";const $={x:11.5,z0:-715,dz:12,n:6},Ye=t=>`
${V}
${le}
uniform vec3 uWine, uMoonA, uMoonB, uMoonColA, uMoonColB;
uniform vec4 uLampRow, uJets; uniform float uLampN, uJetN, uJetPh[12];
varying vec3 vW;
float rip(vec2 p, float t){ return bsN(p*0.5 + vec2(t*0.10, -t*0.07)) + 0.5*bsN(p*1.6 + vec2(-t*0.19, t*0.15)) + 0.26*bsN(p*4.3 + vec2(t*0.33, t*0.28)) + 0.1*bsN(p*9.7 + vec2(-t*0.5, t*0.41)); }
void main(){
  vec2 p = vW.xz; float t = uTime;
  ${t?"p.y += t*1.1; p *= 2.2;":`
  float inCanal = step(abs(p.x), 7.0)*step(-746.0, p.y);
  float rb = length(p - vec2(${W.x.toFixed(1)}, ${W.z.toFixed(1)}));
  if (inCanal < 0.5 && rb > ${W.r.toFixed(1)}) discard;`}
  vec3 Vv = cameraPosition - vW; float d = length(Vv); vec3 V = Vv/max(d, 1e-3);
  float fp = max(length(dFdx(vW.xz)), length(dFdy(vW.xz)));
  float e = 0.14, h0 = rip(p, t), hx = rip(p + vec2(e, 0.0), t), hz = rip(p + vec2(0.0, e), t);
  float amp = ${t?"0.16":"0.075"}*(1.0 - smoothstep(0.5, 4.0, fp));
  vec2 sl = vec2(hx - h0, hz - h0)/e*amp;
  ${t?"":`
  // rings run out from the foot of every fountain jet
  for (int s = 0; s < 2; s++) for (int j = 0; j < 6; j++) {
    vec2 c = vec2(s == 0 ? -uJets.x : uJets.x, uJets.y - uJets.w*float(j));
    vec2 q = vW.xz - c; float r = length(q) + 1e-3;
    float w = sin(r*2.4 - t*3.2 + uJetPh[s*6 + j])*exp(-r*0.16)*smoothstep(0.3, 1.5, r);
    sl += q/r*w*0.05*(1.0 - smoothstep(1.0, 4.0, fp));
  }`}
  vec3 N = normalize(vec3(-sl.x, 1.0, -sl.y));
  vec3 R = reflect(-V, N);
  float nv = clamp(dot(N, V), 0.0, 1.0), om = 1.0 - nv, F = 0.03 + 0.97*om*om*om*om*om;
  float Fr = clamp(F*1.25, ${t?"0.22, 0.6":"0.05, 0.66"})*(0.82 + 0.3*(h0 - 0.85));
  // the canals run with wine: its own deep colour under a plain pale light (the blue of the dusk would turn it navy)
  vec3 wl = vec3(0.30) + uKeyCol*0.14 + uMoonCol*0.22;
  vec3 body = uWine*wl*(0.62 + 0.3*h0);
  vec3 col = body*(1.0 - Fr) + uWine*wl*0.5*Fr;
  // the moons lie on the water as broken paths of light
  float ma = clamp(dot(R, uMoonA), 0.0, 1.0), mb = clamp(dot(R, uMoonB), 0.0, 1.0);
  float xa = 1.0 - ma, xb = 1.0 - mb;                                 // exp of the small angle keeps its precision where pow of a number near one does not
  col += uMoonColA*(exp(-2600.0*xa)*1.5 + exp(-220.0*xa)*0.035) + uMoonColB*(exp(-3200.0*xb)*1.2 + exp(-260.0*xb)*0.025);
  ${t?`
  // the rill is clear running water over pale stone: it carries the dusk, the moons and the gold of the fruit as moving light
  col = vec3(0.50, 0.55, 0.80)*bsLight(vec3(0.0, 1.0, 0.0))*(0.42 + 0.4*h0)*(1.0 - Fr);
  col += mix(uFog.rgb*1.3 + uKeyCol*0.3, uSkyCol*1.2, clamp(R.y*1.4, 0.0, 1.0))*Fr;
  float run1 = smoothstep(0.62, 0.92, bsN(p*vec2(3.0, 0.45))), run2 = smoothstep(0.7, 0.96, bsN(p*vec2(5.0, 0.8) + 7.0));
  col += ((uMoonCol + uKeyCol*0.7)*0.9*run1 + uGold*1.1*run2)*(1.0 - smoothstep(0.6, 3.0, fp));`:`
  // the lamps: each lays a long wavering path toward the eye
  float kf = floor((uLampRow.z - vW.z)/uLampRow.w), wsum = 0.0;
  vec3 Nw = normalize(vec3(-sl.x*1.5, 1.0, -sl.y*1.5));
  for (int s = 0; s < 2; s++) for (int j = 0; j < 6; j++) {
    float k = kf + float(j), ok = step(-0.5, k)*step(k, uLampN - 0.5);
    vec3 L = vec3(s == 0 ? -uLampRow.x : uLampRow.x, uLampRow.y, uLampRow.z - uLampRow.w*k) - vW;
    float dl = max(length(L), 1e-3); L /= dl;
    float nh = clamp(dot(Nw, normalize(L + V)), 0.0, 1.0);
    nh *= nh; nh *= nh; nh *= nh; nh *= nh; nh *= nh; nh *= nh; nh *= nh; nh *= nh; nh *= nh;      // a highlight as tight as a lamp is small
    wsum += ok*nh/(1.0 + dl*0.03);
  }
  col += uGold*1.2*min(wsum, 1.4);
  // darker along the walls, a pale line where the water meets the stone
  float edge = max(inCanal*(7.0 - abs(vW.x)), ${W.r.toFixed(1)} - rb);
  col *= 0.7 + 0.3*smoothstep(0.0, 1.6, edge);
  col += (uSkyCol*0.6 + uKeyCol*0.2)*0.25*(1.0 - smoothstep(0.0, 0.12 + 0.1*h0, edge));
  // one water: the canal's sheet lets the built mirror under it show; over its last 30 m before the basin (metres
  // along the canal, none across) that share falls to a quarter, and the whole basin has that quarter. What the
  // sheet no longer lets through it gives back on its ripples: the low sky, in the wine's own colour
  float thru = 0.25 + 0.75*smoothstep(${(W.z+W.r).toFixed(1)}, ${(W.z+W.r+30).toFixed(1)}, vW.z);
  float glint = 1.0 - smoothstep(0.0, 0.4, abs(R.y - 0.08));
  col += uWine/max(max(uWine.r, max(uWine.g, uWine.b)), 0.02)*dot(uFog.rgb, vec3(0.3333))*(1.0 - thru)*Fr*(0.12 + 0.6*glint);
  // and a few pale glints ride its ripples from bank to bank, as the moons' do down the middle
  float spark = smoothstep(0.83, 0.96, bsN(p*3.7 + vec2(t*0.45, -t*0.38)))*smoothstep(0.5, 0.9, bsN(p*8.9 + vec2(-t*0.6, t*0.5)))*(1.0 - smoothstep(0.6, 3.0, fp));
  col += (uMoonCol*0.5 + uSkyCol*0.25)*0.6*spark*(1.0 - thru);`}
  float fg = bsFogF(d);
  col = mix(col, uFog.rgb, fg);
  gl_FragColor = vec4(col, 1.0 - 0.6*Fr*(1.0 - fg)${t?"*0.0":"*thru"});
}`;function Ze(t,a={}){const c={...t,uWine:{value:new s.Color(a.color??"#6A45A0")},uMoonA:{value:new s.Vector3(0,.3,-1).normalize()},uMoonB:{value:new s.Vector3(0,.4,-1).normalize()},uMoonColA:{value:new s.Color("#FFF1D8")},uMoonColB:{value:new s.Color("#CFE0FF")},uLampRow:{value:new s.Vector4(D.x,D.y,D.z0,D.dz)},uLampN:{value:D.n},uJets:{value:new s.Vector4($.x,$.z0,0,$.dz)},uJetN:{value:$.n},uJetPh:{value:Array.from({length:12},()=>a.phases?a.phases()*6.283:0)}},n="varying vec3 vW; void main(){ vec4 w = modelMatrix*vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }",o=new s.Group,y=(e,l,m,F,S,f,k)=>{const N=new s.BufferGeometry;N.setAttribute("position",new s.Float32BufferAttribute([e,S,m,l,S,m,l,f,F,e,f,F],3)),N.setIndex([0,1,2,0,2,3]);const R=new s.Mesh(N,new s.ShaderMaterial({uniforms:c,vertexShader:n,fragmentShader:Ye(k),transparent:!k,premultipliedAlpha:!0,depthWrite:k}));return R.frustumCulled=!1,k||(R.renderOrder=2),o.add(R),R};y(-W.r-1,W.r+1,-515,W.z-W.r-1,I,I,!1),y(-1,1,-430.2,-516.7,8.6,8.72,!0);const r=[[8.2,-430.3]];for(let e=$e.n-1;e>=0;e--){const l=Math.max(.3*e-.6,0)+.05,m=Ae(e);r.push([l,Ae(e+1)+.1],[l,m-.04]),e>0&&r.push([Math.max(.3*(e-1)-.6,0)+.08,m+.1])}r.push([.04,-397.5]);const u=[],i=[],v=[];let d=0;r.forEach((e,l)=>{if(l&&(d+=Math.hypot(e[0]-r[l-1][0],e[1]-r[l-1][1])),u.push(-.5,e[0],e[1],.5,e[0],e[1]),i.push(0,d,1,d),l){const m=(l-1)*2;v.push(m,m+1,m+3,m,m+3,m+2)}});const p=new s.BufferGeometry;p.setAttribute("position",new s.Float32BufferAttribute(u,3)),p.setAttribute("uv",new s.Float32BufferAttribute(i,2)),p.setIndex(v);const b=new s.Mesh(p,new s.ShaderMaterial({uniforms:t,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,side:s.DoubleSide,vertexShader:"varying vec2 vUv; varying vec3 vW; void main(){ vUv = uv; vW = position; gl_Position = projectionMatrix*viewMatrix*vec4(position, 1.0); }",fragmentShader:`
${V}
${le}
varying vec2 vUv; varying vec3 vW;
void main(){
  float x = vUv.x - 0.5, t = uTime;
  float w = 0.26 + 0.12*bsN(vec2(vUv.y*0.7 - t*0.8, 3.0)) + 0.05*sin(vUv.y*5.0 - t*6.0);
  float a = 1.0 - smoothstep(w*0.5, w, abs(x + 0.08*sin(vUv.y*1.3 - t*1.4)));
  float streak = 0.5 + 0.5*bsN(vec2(x*14.0, vUv.y*2.2 - t*5.5));
  float glint = smoothstep(0.72, 0.95, bsN(vec2(x*9.0 + 3.0, vUv.y*3.1 - t*7.0)));
  vec3 c = (uSkyCol*0.9 + uMoonCol*0.9 + uKeyCol*0.5)*(0.25 + 0.5*streak) + (uMoonCol + uKeyCol)*1.6*glint;
  a *= 0.55 + 0.45*streak;
  float d = length(cameraPosition - vW);
  gl_FragColor = vec4(bsFog(c, d)*a, a*0.85);
}`}));b.frustumCulled=!1,b.renderOrder=3,o.add(b);const P=[[8.74,-516.3],[8.72,-516.72],[8.58,-516.86],[I+.03,-516.95],[I+.03,-517.85]],z=[],g=[],h=[];let M=0;P.forEach((e,l)=>{if(l&&(M+=Math.hypot(e[0]-P[l-1][0],e[1]-P[l-1][1])),z.push(-1,e[0],e[1],1,e[0],e[1]),g.push(0,M,1,M),l){const m=(l-1)*2;h.push(m,m+1,m+3,m,m+3,m+2)}});const A=new s.BufferGeometry;A.setAttribute("position",new s.Float32BufferAttribute(z,3)),A.setAttribute("uv",new s.Float32BufferAttribute(g,2)),A.setIndex(h);const w=new s.Mesh(A,b.material);return w.frustumCulled=!1,w.renderOrder=3,o.add(w),{object:o,uniforms:c}}const xe=K("#8C6B3E"),ge=K("#FFC46A"),he=(t,a)=>[t[0]*a,t[1]*a,t[2]*a];function Xe(){const t=[];for(const c of[-1,1])for(let n=0;n<D.n;n++)t.push({x:c*D.x,y:B,z:D.z0-D.dz*n,mirror:!0});for(let c=0;c<14;c++){const n=(c+.5)/te.n*Math.PI*2,o=Math.sin(n)*te.r,y=W.z-Math.cos(n)*te.r;Math.abs(o)<te.gap||t.push({x:o,y:B,z:y,mirror:!0})}for(const c of[-1,1]){for(let n=0;n<ye.n;n++)t.push({x:c*ye.x,y:B,z:ye.z0-ye.dz*n});t.push({x:c*16,y:_,z:-438},{x:c*11.2,y:B,z:W.z-Math.sqrt(te.r*te.r-11.2*11.2),mirror:!0})}for(const c of[-1,1]){for(let n=0;n<oe.n;n++)t.push({x:c*oe.x,y:oe.y0+oe.dy*n,z:oe.z0-oe.dz*n});for(let n=0;n<ue.n;n++)t.push({x:c*(ue.x0+ue.dx*n),y:B,z:ue.z,s:ue.s})}const a=Je;for(let c=0;c<a.rows;c++)for(let n=-8;n<=8;n++){const o=(n+.5-.5*(c%2))*a.da,y=a.r0+a.dr*c,r=Math.sin(o)*y;Math.abs(o)>a.amax||Math.abs(r)<a.clear||t.push({x:r,y:a.y0+a.dy*c,z:W.z-Math.cos(o)*y,s:a.s,mirror:c<2})}return t}function He(t,a,c,n,o){const y=J(),r=new s.Group;Ie(y,[[.34,0],[.34,.05],[.08,.12],[.06,.42],[.2,.5],[.46,.72],[.5,.78],[.44,.78],[.2,.6],[0,.58]],0,0,0,8,e=>he(xe,.7+.05*e)),ee(y,0,.74,0,.1,ge,2.2,3);for(const[e,l]of[[1.7,.035],[2.7,.045],[3.7,.06]])ee(y,.04*Math.sin(e*3),e,.04*Math.cos(e*3),l,ge,2.6,3);ee(y,0,5,0,.38,ge,3.4,6,1.18);const u=new s.InstancedMesh(Y(y),Be(t,{sheen:.9}),a.length),i=new s.Matrix4;a.forEach((e,l)=>{const m=e.s??1;i.makeScale(m,m,m).setPosition(e.x,e.y,e.z),u.setMatrixAt(l,i)}),u.frustumCulled=!1,r.add(u);const v=a.map(e=>[e.x,e.y+5*(e.s??1),e.z]),d=e=>.35+.65*(e.s??1),p=H.makeGlows({positions:v,sizes:a.map(d),color:"#FFC46A",size:3,intensity:1.45,flicker:.12,time:c,renderOrder:4,rng:o}),b=a.filter(e=>e.mirror),P=H.makeGlows({positions:b.map(e=>[e.x,2*I-(e.y+5*(e.s??1)),e.z]),sizes:b.map(d),color:"#FFB860",size:3,intensity:1.5,flicker:.35,time:c,renderOrder:1,rng:o});r.add(p.object,P.object);const z=6,g=a.length*z,h=new Float32Array(g*4),M=new Float32Array(g*4);for(let e=0;e<g;e++){const l=a[Math.floor(e/z)],m=l.s??1,F=n(),S=n();h.set([l.x,l.y+5*m,l.z,F*6.28],e*4),M.set([(.45+1*S)*(.4+.6*m),1.4+2.2*F,S*6.28,.6+.8*(F*7.3%1)],e*4)}const A=new s.BufferGeometry;A.setAttribute("position",new s.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),A.setIndex([0,1,2,0,2,3]);const w=new s.Mesh(q(A,g,[["iP",h,4],["iS",M,4]]),new s.ShaderMaterial({uniforms:t,transparent:!0,depthWrite:!1,blending:s.AdditiveBlending,vertexShader:`
${V}
attribute vec4 iP, iS; varying vec2 vQ; varying float vA;
void main(){
  float th = uTime*iS.y + iP.w, r = iS.x*(0.75 + 0.25*sin(uTime*0.7 + iS.z));
  vec3 wp = iP.xyz + vec3(cos(th)*r, 0.35*sin(th*1.7 + iS.z) + 0.25*sin(uTime*0.9 + iP.w), sin(th)*r);
  vec4 mv = viewMatrix*vec4(wp, 1.0);
  float sz = max(0.05*iS.w, 1.1*uPx*(-mv.z));
  mv.xy += position.xy*sz;
  vQ = position.xy; vA = (0.6 + 0.4*sin(uTime*9.0 + iP.w*5.0))*min(1.0, 0.05*iS.w/sz)*(1.0 - bsFogF(-mv.z));
  gl_Position = projectionMatrix*mv;
}`,fragmentShader:`
${V}
varying vec2 vQ; varying float vA;
void main(){ float g = clamp(1.0 - dot(vQ, vQ), 0.0, 1.0); gl_FragColor = vec4(uGold*2.6*g*g*clamp(vA, 0.0, 1.0), 1.0); }`}));return w.frustumCulled=!1,w.renderOrder=5,r.add(w),{object:r,update(e,l,m){p.update(e,l,m),P.update(e,l,m)}}}function et(){const t=J(),a=(r,u,i)=>[r[0]+(u[0]-r[0])*i,r[1]+(u[1]-r[1])*i,r[2]+(u[2]-r[2])*i],c=he(xe,.45),n=K("#E0B070"),o=(r,u,i,v,d)=>{const p=[],P=Math.cos(r),z=Math.sin(r);for(let g=0;g<=7;g++){const h=g/7,M=.25+u*(h-d*h*h*h),A=.12+v*Math.pow(h,2.1),w=i*Math.pow(Math.sin(Math.PI*(.12+.86*h)),.75),e=a(he(xe,.85),n,Math.pow(h,3)),l=[];for(const[m,F]of[[-1,.16],[-.5,.03],[0,-.03],[.5,.03],[1,.16]]){const S=m*w,f=M;l.push([S*P+f*z,A+F*w*1.4,-S*z+f*P,Math.abs(m)>.9?a(e,n,.5):e])}p.push(l)}ce(t,p,!1,!1)};o(0,2.6,.55,1.5,.3),o(Math.PI,2.3,.6,1.25,.34);for(const r of[-1,1])o(r*.62,1.9,.5,.95,.42),o(r*1.45,1.25,.6,.8,.5),o(r*2.35,1.8,.5,.95,.42);const y=[];for(let r=0;r<=3;r++){const u=r/3,i=[];for(let v=0;v<10;v++){const d=v/10*6.283;i.push([Math.sin(d)*.75*(.3+.7*u),-.12+.3*u*u,Math.cos(d)*1.5*(.3+.7*u),c])}y.push(i)}return ce(t,y,!0,!1),qe(t,0,.3,.2,.7,.14,.6,K("#cfc6b4")),ve(t,[[0,.15,-1.1],[0,1.2,-1.25],[0,2,-.85],[0,2.2,-.3]],[.05,.04,.035,.03],4,he(xe,.9)),ee(t,0,2.06,-.3,.17,ge,3.6,4),Y(t)}function tt(t,a,c,n){const o=new s.Group,y=a.length,r=new s.InstancedMesh(et(),Be(t,{sheen:1}),y);r.frustumCulled=!1,o.add(r);const u=H.makeGlows({positions:a.map(h=>[h.x,I+2.1,h.z]),color:"#FFC46A",size:2.4,intensity:1.8,flicker:.2,time:c,rng:n}),i=H.makeGlows({positions:a.map(h=>[h.x,I-2.1,h.z]),color:"#FFB860",size:2.2,intensity:1.4,flicker:.4,time:c,renderOrder:1,rng:n});o.add(u.object,i.object);const v=new s.Matrix4,d=new s.Quaternion,p=new s.Euler,b=new s.Vector3,P=new s.Vector3(1,1,1),z=new s.Vector3;function g(h,M,A){for(let w=0;w<y;w++){const e=a[w];b.set(e.x+.4*Math.sin(M*.11+e.ph*2),I+.04*Math.sin(M*1.1+e.ph),e.z+3.5*Math.sin(M*.06+e.ph)),p.set(.03*Math.sin(M*.9+e.ph),e.ph+.55*Math.sin(M*.08+e.ph*3),.05*Math.sin(M*.7+e.ph*1.3)),v.compose(b,d.setFromEuler(p),P),r.setMatrixAt(w,v),z.set(0,2.06,-.3).applyMatrix4(v),u.setPosition(w,z.x,z.y,z.z),i.setPosition(w,z.x,2*I-z.y,z.z)}r.instanceMatrix.needsUpdate=!0,u.update(h,M,A),i.update(h,M,A)}return{object:o,update:g}}const Re=19;function ot(t,a){const c=$.n*2,n=230,o=[],y=60;for(let e=0;e<26;e++){const l=(e+.5)/26*Math.PI*2,m=Math.sin(l)*36.6;Math.abs(m)<9.5||o.push([m,W.z-Math.cos(l)*36.6,l])}const r=c*n+o.length*y,u=new Float32Array(r*4),i=new Float32Array(r*4),v=new Float32Array(r*4),d=Array.from({length:c+o.length},()=>a()*6.283);for(let e=0;e<r;e++){const l=e*.61803%1,m=e*.7548%1;if(e<c*n){const F=Math.floor(e/n),S=F<$.n?-1:1,f=F%$.n;u.set([S*$.x,I,$.z0-$.dz*f,d[F]],e*4),i.set([e%n/n+.02*l,l*6.28,m,e%17===0?-1:.6+.8*(l*5.3%1)],e*4),v.set([0,0,Re,1],e*4)}else{const F=e-c*n,S=Math.floor(F/y),f=o[S];u.set([f[0],I+.9,f[1],d[c+S]],e*4),i.set([F%y/y+.02*l,l*6.28,m*.45,.5+.6*(l*5.3%1)],e*4),v.set([-Math.sin(f[2])*8.5,Math.cos(f[2])*8.5,3.6,0],e*4)}}const p=new s.BufferGeometry;p.setAttribute("position",new s.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),p.setIndex([0,1,2,0,2,3]);const b=new s.Mesh(q(p,r,[["iP",u,4],["iS",i,4],["iD",v,4]]),new s.ShaderMaterial({uniforms:t,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,vertexShader:`
${V}
attribute vec4 iP, iS, iD; varying vec2 vQ; varying float vA, vT;
void main(){
  float H = iD.z*(0.45 + 0.55*(0.5 + 0.5*sin(uTime*0.45 + iP.w)*sin(uTime*0.17 + iP.w*2.3)));      // each tall jet breathes between about 9 and 19 m
  float a = fract(uTime*0.36 + iS.x);
  // every drop is thrown up and a little outward, and falls back in an arc; one in seventeen is a soft puff of spray
  float up = 4.0*a*(1.0 - a), spread = 0.25 + 2.1*iS.z*iS.z;
  vec2 dir = vec2(cos(iS.y), sin(iS.y));
  vec3 wp = iP.xyz + vec3(dir.x*spread*a + iD.x*a, H*up*(0.82 + 0.18*iS.z) - 0.9*a*(1.0 - iD.w), dir.y*spread*a + iD.y*a);
  wp.x += uWind.x*0.9*a*a;
  vec4 mv = viewMatrix*vec4(wp, 1.0);
  float puff = step(iS.w, 0.0), px = uPx*(-mv.z);
  float sz = mix(max(0.045*abs(iS.w), 0.75*px), 0.7 + 1.5*a, puff);
  mv.x += position.x*sz; mv.y += position.y*sz*mix(1.0 + 1.6*abs(1.0 - 2.0*a), 1.2, puff);
  vQ = position.xy; vT = a;
  vA = mix(min(1.0, 0.045*abs(iS.w)/max(0.75*px, 1e-4))*0.95, 0.045*sin(3.1416*a), puff)*smoothstep(0.0, 0.04, a)*(1.0 - smoothstep(0.95, 1.0, a))*(1.0 - bsFogF(-mv.z));
  gl_Position = projectionMatrix*mv;
}`,fragmentShader:`
${V}
varying vec2 vQ; varying float vA, vT;
void main(){
  float g = clamp(1.0 - dot(vQ, vQ), 0.0, 1.0); g *= g;
  vec3 c = (uSkyCol*1.5 + uMoonCol*2.2 + uKeyCol*0.9 + uGold*0.35)*(0.8 + 0.5*clamp(1.0 - vT, 0.0, 1.0));
  float a = clamp(vA, 0.0, 1.0)*g;
  gl_FragColor = vec4(c*a, a*0.5);
}`}));b.frustumCulled=!1,b.renderOrder=5;const P=10,z=[],g=[],h=new Float32Array(c*4);for(let e=0;e<=P;e++)z.push(e/P,-1,0,e/P,1,0);for(let e=0;e<P;e++){const l=e*2;g.push(l,l+2,l+3,l,l+3,l+1)}for(let e=0;e<c;e++)h.set([(e<$.n?-1:1)*$.x,I,$.z0-$.dz*(e%$.n),d[e]],e*4);const M=new s.BufferGeometry;M.setAttribute("position",new s.Float32BufferAttribute(z,3)),M.setIndex(g);const A=new s.Mesh(q(M,c,[["iP",h,4]]),new s.ShaderMaterial({uniforms:t,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,side:s.DoubleSide,vertexShader:`
${V}
attribute vec4 iP; varying vec2 vUv; varying float vA;
void main(){
  float H = ${Re.toFixed(1)}*(0.45 + 0.55*(0.5 + 0.5*sin(uTime*0.45 + iP.w)*sin(uTime*0.17 + iP.w*2.3)));
  float s = position.x;
  vec3 wp = iP.xyz + vec3(uWind.x*0.35*s*s, H*0.94*s, 0.0);
  vec3 Vv = cameraPosition - wp; float d = length(Vv);
  vec3 side = normalize(cross(vec3(0.0, 1.0, 0.0), Vv) + vec3(1e-4, 0.0, 0.0));
  wp += side*position.y*(0.2 + 0.55*s*s);
  vUv = vec2(position.y, s*H); vA = smoothstep(0.0, 0.04, s)*(1.0 - smoothstep(0.7, 1.0, s))*(1.0 - bsFogF(d));
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
}`,fragmentShader:`
${V}
${le}
varying vec2 vUv; varying float vA;
void main(){
  float x = clamp(vUv.x, -1.0, 1.0), core = 1.0 - smoothstep(0.15, 1.0, abs(x));
  float streak = 0.55 + 0.45*bsN(vec2(x*3.0, vUv.y*1.3 - uTime*9.0));
  float a = core*streak*clamp(vA, 0.0, 1.0)*0.6;
  vec3 c = uSkyCol*1.5 + uMoonCol*2.2 + uKeyCol*0.9 + uGold*0.35;
  gl_FragColor = vec4(c*a, a*0.6);
}`}));A.frustumCulled=!1,A.renderOrder=5;const w=new s.Group;return w.add(A,b),{object:w}}const Ee=`
uniform vec3 uCZen, uCHor, uCFloor;
vec3 crEnv(vec3 d){
  float up = clamp(d.y, 0.0, 1.0);
  vec3 sky = mix(uCHor, uCZen, sqrt(up));
  float west = clamp(dot(normalize(d.xz + vec2(1e-4, 0.0)), normalize(uKeyDir.xz)), 0.0, 1.0);
  float low = 1.0 - up; low *= low; low *= low;
  sky += uKeyCol*0.6*west*west*low;
  float mo = clamp(dot(d, uMoonDir), 0.0, 1.0); mo *= mo; mo *= mo; mo *= mo; mo *= mo;
  sky += uMoonCol*1.4*mo*mo;
  vec3 gnd = uCFloor*(0.55 + 0.45*clamp(-d.y*3.0, 0.0, 1.0));
  return mix(gnd, sky, smoothstep(-0.25, 0.25, d.y));       // (floor and sky meet in a facet as a gradual sheen, not on a line)
}`;function _e(t,a={}){return{...t,uCZen:{value:new s.Color(a.zenith??"#1A1F4E")},uCHor:{value:new s.Color(a.horizon??"#7C6BB8")},uCFloor:{value:new s.Color(a.floor??"#6E6A9C")},uTint:{value:new s.Color(a.tint??"#a8c4ff")},uGlowCol:{value:new s.Color(a.glowColor??"#8fb8ff")},uGlow:{value:a.glow??.12},uFleck:{value:a.fleck??0},uBody:{value:a.body??.6}}}function ke(t,a={}){return new s.ShaderMaterial({uniforms:_e(t,a),side:s.DoubleSide,vertexShader:`
attribute vec2 aQ; varying vec2 vQ;
varying vec3 vW, vL;
void main(){
  vQ = aQ;
  vec3 lp = position;
  #ifdef USE_INSTANCING
  lp = (instanceMatrix*vec4(lp, 1.0)).xyz;
  #endif
  vec4 wp = modelMatrix*vec4(lp, 1.0); vW = wp.xyz; vL = position;
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,fragmentShader:`
${V}
${le}
${Ee}
uniform vec3 uTint, uGlowCol; uniform float uGlow, uFleck, uBody;
varying vec3 vW, vL; varying vec2 vQ;
void main(){
  vec3 Vv = cameraPosition - vW; float d = length(Vv); vec3 V = Vv/max(d, 1e-3);
  vec3 N = normalize(cross(dFdx(vW), dFdy(vW)) + vec3(0.0, 1e-7, 0.0)); if (dot(N, V) < 0.0) N = -N;
  float nv = clamp(dot(N, V), 0.0, 1.0), om = 1.0 - nv, F = 0.06 + 0.94*om*om*om*om;
  vec3 R = reflect(-V, N);
  vec3 T = normalize(refract(-V, N, 0.7) + R*1e-3);
  vec3 T2 = reflect(T, normalize(N + vec3(0.35, 0.5, -0.25)));
  vec3 thru = crEnv(T)*0.55 + crEnv(T2)*0.45;
  vec3 c = thru*uTint*uBody*(1.0 - F) + crEnv(R)*F*1.1;
  // a pale light inside, in slow veins
  float vein = bsN(vec2(vL.x*1.3 + vL.z*1.7, vL.y*0.35 - uTime*0.09)); vein *= vein;
  c += uGlowCol*uGlow*(0.15 + 2.2*vein)*(0.3 + 0.7*nv);
  // facets that throw the afterglow into the eye
  float kg = clamp(dot(R, uKeyDir), 0.0, 1.0); kg *= kg; kg *= kg; kg *= kg; kg *= kg;
  c += uKeyCol*1.5*kg*kg;
  // the arrises between facets catch the light as thin bright lines
  vec2 fq = clamp(vQ, 0.0, 1.0);                                      // (a varying runs past its range at an antialiased edge)
  vec2 eq = min(fq, 1.0 - fq), ew = fwidth(vQ)*1.2 + 1e-4;
  float edge = (1.0 - smoothstep(0.0, ew.x, eq.x))*(0.25 + 0.75*bsN(vec2(vL.y*0.8, vL.x*3.0 + vL.z*2.0) + 2.0));
  c += (crEnv(vec3(R.x, abs(R.y) + 0.3, R.z))*0.4 + uMoonCol*0.3 + uKeyCol*0.15)*edge*0.6*(1.0 - smoothstep(30.0, 110.0, d));
  // no two facets alike: each passes a little more or less of the light behind it
  float fid = dot(floor(N.xz*5.0 + 0.5), vec2(7.0, 13.0));
  c *= 0.72 + 0.56*bsN(vec2(fid*1.37, vL.y*0.45));
  // and now and then one flashes as the vanes turn the last light through it
  float tw = bsH(vec2(fid, floor(vL.y*0.7)));
  c += (uMoonCol*0.45 + uKeyCol*0.3)*smoothstep(0.8, 1.0, sin(uTime*(0.7 + 1.9*tw) + tw*50.0))*step(0.72, tw)*(1.0 - abs(2.0*fq.x - 1.0))*(1.0 - abs(2.0*fq.y - 1.0))*(1.0 - abs(2.0*fract(vL.y*0.7) - 1.0))*(1.0 - smoothstep(40.0, 120.0, d));       // (the flash dies toward the ends of its stretch of the facet: a sheen, no pale rectangle)
  // gold flecks deep in the crystal where the fruit's light is caught
  float fl = bsN(vec2(vL.x*4.0 + vL.z*5.0, vL.y*2.2) + 9.0);
  c += uGold*uFleck*smoothstep(0.74, 0.92, fl)*(0.5 + 0.5*sin(uTime*1.3 + vL.y*2.0))*(0.3 + 0.7*nv);
  gl_FragColor = vec4(bsFog(max(c, 0.0), d), 1.0);
}`})}function at(t,a={}){return new s.ShaderMaterial({uniforms:_e(t,a),side:s.DoubleSide,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,vertexShader:`
varying vec3 vW, vN;
void main(){ vec4 wp = modelMatrix*vec4(position, 1.0); vW = wp.xyz; vN = normal; gl_Position = projectionMatrix*viewMatrix*wp; }`,fragmentShader:`
${V}
${le}
${Ee}
varying vec3 vW, vN;
void main(){
  vec3 Vv = cameraPosition - vW; float d = length(Vv); vec3 V = Vv/max(d, 1e-3);
  vec2 fq = vec2(vW.z*0.42 + vW.y*0.21, vW.y*0.42 - vW.z*0.21), fi = floor(fq), ff = abs(fract(fq) - 0.5);
  float fh = bsH(fi + 3.0), fh2 = bsH(fi + 11.0);
  vec3 N = normalize(vN + vec3(0.0, (fh - 0.5)*0.5, (fh2 - 0.5)*0.5) + vec3(1e-5, 0.0, 0.0)); if (dot(N, V) < 0.0) N = -N;
  float nv = clamp(dot(N, V), 0.0, 1.0), om = 1.0 - nv, F = 0.06 + 0.94*om*om*om*om;
  vec3 R = reflect(-V, N);
  vec3 T = normalize(refract(-V, N, 0.75) + R*1e-3);
  float edge = smoothstep(0.43, 0.5, max(ff.x, ff.y))*(1.0 - smoothstep(25.0, 90.0, d));
  float vein = bsN(vec2(vW.z*1.3, vW.y*0.35 - uTime*0.07)); vein *= vein;
  vec3 c = crEnv(T)*vec3(0.62, 0.74, 1.0)*0.6*(0.65 + 0.7*fh) + crEnv(R)*F*1.1;
  c += vec3(0.5, 0.65, 1.0)*0.16*(0.5 + 1.6*vein);                    // (the pane has body: a soft sheen in slow veins)
  c += (uMoonCol*0.5 + uKeyCol*0.25)*edge*0.14;                       // (and its cut lines are faint in it, never bare)
  float gl = bsN(vec2(vW.z*0.8, vW.y*0.8) + 5.0); gl *= gl;
  c += uGold*0.3*gl;
  float a = clamp(0.64 + 0.3*F + 0.06*edge, 0.0, 0.92);
  gl_FragColor = vec4(bsFog(max(c, 0.0), d)*a, a);
}`})}const U=(()=>{const t=[];for(const a of[-20,-9,9,20])for(let c=0;c<10;c++)t.push({x:a,y:_,z:-448.5-7*c,inner:Math.abs(a)<10});for(const a of[1,6,11,16])for(const c of[-1,1]){const n=48+1.6*(a+.5);t.push({x:c*12,y:B+a+1,z:W.z-Math.sqrt(n*n-144),inner:!1,avenue:!0,k:1.5})}return t})();function Pe(t){const a=t.attributes.position.count,c=new Float32Array(a*2),n=[0,0,1,0,1,1,0,0,1,1,0,1];for(let o=0;o<a;o++)c[o*2]=n[o%6*2],c[o*2+1]=n[o%6*2+1];return t.setAttribute("aQ",new s.Float32BufferAttribute(c,2)),t}function st(t,a,c,n=1){const o=J(),y=[1,1,1],r=[];return[[1.16,0],[1.16,.035],[1,.06],[.93,.5],[.9,.86],[1+.36*n,.94],[.86+.2*n,.966],[.5,.992],[.02,1]].forEach((i,v)=>{const d=[];for(let p=0;p<c;p++){const b=(p+.12*v)/c*6.283;d.push([Math.sin(b)*i[0]*t,i[1]*a,Math.cos(b)*i[0]*t,y])}r.push(d)}),ce(o,r,!0,!1),Pe(Y(o,!0))}async function nt(t,a,c,n={}){const o=n.rng,y=new s.Group,r=a.uTime,u=new s.Matrix4,i=new s.Vector3,v=ke(a,{...n.sky,glow:.14}),d=new s.InstancedMesh(st(1.1,16,10),v,U.length);U.forEach((x,C)=>{const T=x.k??1;u.makeRotationY(C*.7).scale(i.set(T,T,T)).setPosition(x.x,x.y,x.z),d.setMatrixAt(C,u)}),d.frustumCulled=!1,y.add(d),await t.yield();const p=[],b=[],P=[];let z=0;for(const x of[-20,20])for(let C=0;C<9;C++){const T=-448.5-7*C-1.2,L=T-4.6,j=_+.4,G=_+12.5+1.5*Math.sin(C*1.9);p.push(x,j,T,x,j,L,x,G,L,x,G,T);for(let Q=0;Q<4;Q++)b.push(-Math.sign(x),0,0);P.push(z,z+1,z+2,z,z+2,z+3),z+=4}const g=new s.BufferGeometry;g.setAttribute("position",new s.Float32BufferAttribute(p,3)),g.setAttribute("normal",new s.Float32BufferAttribute(b,3)),g.setIndex(P);const h=new s.Mesh(g,at(a,n.sky));h.renderOrder=3,y.add(h),await t.yield();const M=J();for(let x=0;x<6;x++){const C=x/6*6.283,T=Math.cos(C),L=Math.sin(C),j=[];for(let G=0;G<=6;G++){const Q=G/6,Ge=.85+2.5*Q,De=1.25*Math.sin(Q*1.9)-.5*Q*Q,we=1.05*Math.pow(Math.sin(Math.PI*(.08+.86*Q)),.6)+.08,Ce=(Ve,Oe)=>[T*Ge-L*Ve*we,De+Oe,L*Ge+T*Ve*we,[1,1,1]];j.push([Ce(-1,.24*we),Ce(0,0),Ce(1,.24*we)])}ce(M,j,!1,!1)}const A=new s.InstancedMesh(Pe(Y(M,!0)),ke(a,{...n.sky,glow:.16}),U.length);A.frustumCulled=!1,y.add(A),await t.yield();const w=J(),e=K("#FFC46A"),l=K("#cfe0ff"),m=[l[0]*.5,l[1]*.5,l[2]*.5];ve(w,[[0,0,-.03],[0,0,.05]],[.12,.035],5,[[.05,.08,.2],[.3,.4,.7]]),ve(w,[[0,0,0],[0,-.03,.2],[0,-.1,.34]],[.024,.02,.014],3,m),ee(w,0,-.2,.42,.175,e,1,4,1.12),ve(w,[[0,-.02,.14],[.17,-.2,.3]],[.016,.01],3,m),ee(w,.2,-.29,.33,.115,e,.85,3,1.1);const F=320,S=U.filter(x=>!x.avenue),f=U.filter(x=>x.avenue),k=F+f.length*6,N=new Float32Array(k*4),R=new Float32Array(k*4),E=n.rng2;for(let x=F;x<k;x++){const C=f[(x-F)%f.length],T=E()*6.283;N.set([C.x+Math.sin(T)*1.52,C.y+3.5+E()*15,C.z+Math.cos(T)*1.52,T],x*4),R.set([E()*6.283,.8+.5*E(),E(),E()],x*4)}for(let x=0;x<F;x++){let C,T,L,j;if(x%5<3){const G=o()<.5?-1:1,Q=o()<.8;C=G*20+(Q?-G:G)*.02,L=-448.5-7*o.int(0,8)-1.4-o()*4.2,T=_+1.2+o()*10.5,j=(Q?-G:G)*Math.PI/2}else{const G=S[o.int(0,S.length-1)];j=o()*6.283,T=G.y+2.5+o()*10,C=G.x+Math.sin(j)*1,L=G.z+Math.cos(j)*1}N.set([C,T,L,j],x*4),R.set([o()*6.283,.8+.5*o(),o(),o()],x*4)}const Z=new s.Mesh(q(Y(w),k,[["iP",N,4],["iS",R,4]]),new s.ShaderMaterial({uniforms:a,vertexShader:`
${V}
attribute vec3 color; attribute float aGlow; attribute vec4 iP, iS;
varying vec3 vC, vN, vW; varying float vG;
void main(){
  vec3 p = position*iS.y*1.45, n = normal;                             // (a fruit is as big as two fists)
  float nod = 0.22*sin(uTime*(0.9 + 0.5*iS.z) + iS.x) + 0.1*sin(uTime*2.3 + iS.x*3.0);       // swing about the stem's root
  float w = clamp(p.z/0.6, 0.0, 1.0);
  p.x += nod*w*0.3; p.y -= abs(nod)*w*0.06;
  float ca = cos(iP.w), sa = sin(iP.w);
  p = vec3(p.x*ca + p.z*sa, p.y, -p.x*sa + p.z*ca); n = vec3(n.x*ca + n.z*sa, n.y, -n.x*sa + n.z*ca);
  vec3 wp = iP.xyz + p; vW = wp; vN = n; vC = color; vG = aGlow*(0.8 + 0.2*sin(uTime*0.8 + iS.x*2.0))*(0.75 + 0.5*iS.w);
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
}`,fragmentShader:`
${V}
varying vec3 vC, vN, vW; varying float vG;
void main(){
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0)); vec3 Vv = cameraPosition - vW; float d = length(Vv); vec3 V = Vv/max(d, 1e-3);
  float nv = clamp(dot(N, V), 0.0, 1.0);
  vec3 c = vC*bsLight(N)*0.5 + vC*max(vG, 0.0)*(0.5 + 1.25*nv*nv)*vec3(1.0, 0.9, 0.75);         // lit from inside: brighter at the heart, a round rim
  gl_FragColor = vec4(bsFog(max(c, 0.0), d), 1.0);
}`}));Z.frustumCulled=!1,y.add(Z);const X=H.makeGlows({positions:Array.from({length:k},(x,C)=>[N[C*4]+Math.sin(N[C*4+3])*.5,N[C*4+1]-.2,N[C*4+2]+Math.cos(N[C*4+3])*.5]),color:"#FFC46A",size:1.5,intensity:.2,flicker:.12,time:r,renderOrder:4,rng:n.phases});y.add(X.object),await t.yield();const ae=4,se=U.filter(x=>x.inner),O=se.length*ae,ne=new Float32Array(O*4),fe=new Float32Array(O*4);for(let x=0;x<O;x++){const C=se[Math.floor(x/ae)],T=o()*6.283,L=1.9+o()*1.2;ne.set([C.x+Math.sin(T)*L,_+15.6+o()*.8,C.z+Math.cos(T)*L,2.6+o()*2.6],x*4),fe.set([o()*6.283,.6+o()*.8,o(),o()],x*4)}const ie=[],pe=[];for(let x=0;x<=10;x++)ie.push(x/10,-1,0,x/10,1,0);for(let x=0;x<10;x++){const C=x*2;pe.push(C,C+2,C+3,C,C+3,C+1)}const Me=new s.BufferGeometry;Me.setAttribute("position",new s.Float32BufferAttribute(ie,3)),Me.setIndex(pe);const be=new s.Mesh(q(Me,O,[["iP",ne,4],["iS",fe,4]]),new s.ShaderMaterial({uniforms:a,transparent:!0,depthWrite:!1,blending:s.AdditiveBlending,side:s.DoubleSide,vertexShader:`
${V}
attribute vec4 iP, iS; varying vec2 vUv; varying float vA, vPh;
void main(){
  float s = position.x, sw = 0.16*iS.y*sin(uTime*(0.8 + 0.5*iS.z) + iS.x), sw2 = 0.12*iS.y*sin(uTime*0.6 + iS.x*2.0);
  vec3 wp = iP.xyz + vec3(sin(sw)*s*iP.w, -cos(sw)*s*iP.w, sin(sw2)*s*iP.w);
  vec3 Vv = cameraPosition - wp; float d = length(Vv);
  vec3 side = normalize(cross(vec3(0.0, 1.0, 0.0), Vv/max(d, 1e-3)) + vec3(1e-4, 0.0, 0.0));
  float w = max(0.035, 0.8*uPx*d);
  wp += side*position.y*w;
  vUv = vec2(s*iP.w, position.y); vA = min(1.0, 0.035/w)*smoothstep(1.0, 4.0, d)*(1.0 - bsFogF(d)); vPh = iS.x;
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
}`,fragmentShader:`
${V}
varying vec2 vUv; varying float vA, vPh;
void main(){
  float bead = smoothstep(0.55, 0.95, sin(vUv.x*10.0 + vPh));                               // crystal beads along the strand
  float glint = bead*smoothstep(0.5, 1.0, sin(uTime*2.1 + vUv.x*3.0 + vPh*5.0));
  vec3 c = vec3(0.45, 0.6, 1.0)*0.8 + (uMoonCol + uKeyCol*0.5)*1.1*bead + uGold*2.6*glint;
  gl_FragColor = vec4(c*clamp(vA, 0.0, 1.0)*clamp(1.0 - 0.5*abs(vUv.y), 0.0, 1.0), 1.0);
}`}));be.frustumCulled=!1,be.renderOrder=5,y.add(be);const Se=10,de=U.length*Se,Ne=new Float32Array(de*4),We=new Float32Array(de);for(let x=0;x<de;x++){const C=U[Math.floor(x/Se)];Ne.set([C.x,C.z,o(),o()*6.283],x*4),We[x]=C.y}const ze=new s.BufferGeometry;ze.setAttribute("position",new s.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),ze.setIndex([0,1,2,0,2,3]);const Fe=new s.Mesh(q(ze,de,[["iP",Ne,4],["iY",We,1]]),new s.ShaderMaterial({uniforms:a,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,vertexShader:`
${V}
attribute vec4 iP; attribute float iY; varying vec2 vQ; varying float vA;
void main(){
  float a = fract(uTime*0.11 + iP.z);
  vec3 wp = vec3(iP.x + cos(iP.w)*(1.4 + 1.2*a) + uWind.x*a*1.5, iY + 15.8 - 14.5*a*(0.4 + 0.6*a), iP.y + sin(iP.w)*(1.4 + 1.2*a));
  vec4 mv = viewMatrix*vec4(wp, 1.0);
  float sz = 1.3 + 2.4*a;
  mv.x += position.x*sz; mv.y += position.y*sz*1.5;
  vQ = position.xy; vA = 0.05*sin(3.1416*a)*smoothstep(2.5, 9.0, -mv.z)*(1.0 - bsFogF(-mv.z));
  gl_Position = projectionMatrix*mv;
}`,fragmentShader:`
${V}
varying vec2 vQ; varying float vA;
void main(){ float g = clamp(1.0 - dot(vQ, vQ), 0.0, 1.0); g *= g; float a = clamp(vA, 0.0, 1.0)*g; gl_FragColor = vec4((uSkyCol*1.2 + uMoonCol + uKeyCol*0.5 + uGold*0.12)*a, a); }`}));Fe.frustumCulled=!1,Fe.renderOrder=6,y.add(Fe);const Te=new s.Euler,Qe=new s.Quaternion,Ue=new s.Vector3,me=U.map(()=>o()*6.283);function Le(x,C,T){T&&X.update(x,C,T);for(let L=0;L<U.length;L++){const j=U[L];Te.set(.16+.05*Math.sin(C*.21+me[L]),-1.05+.5*Math.sin(C*.13+me[L]*.9)+.12*Math.sin(C*.41+me[L]*2.1),.1*Math.sin(C*.17+me[L]*1.3),"YXZ");const G=j.k??1;u.compose(Ue.set(j.x,j.y+15*G,j.z),Qe.setFromEuler(Te),i.set(G,G,G)),A.setMatrixAt(L,u)}A.instanceMatrix.needsUpdate=!0}return Le(0,0,null),{object:y,update:Le}}function it(t,a,c){const n=J(),o=[1,1,1],y=9.2,r=1.15,u=[];for(const i of[-1,1]){const v=[];for(const[d,p]of[[1.3,0],[1.3,.5],[1,.9],[1,c.y-B]]){const b=[];for(let P=0;P<6;P++){const z=P/6*6.283+.35;b.push([i*y+Math.sin(z)*r*d,B+p,c.z+Math.cos(z)*r*d,o])}v.push(b)}ce(n,v,!0,!1)}for(let i=0;i<=18;i++){const v=i/18*Math.PI;u.push([Math.cos(v)*y,c.y+Math.sin(v)*y,c.z])}return ve(n,u,r,6,o),new s.Mesh(Pe(Y(n,!0)),ke(t,{...a,glow:.4,glowColor:"#CFE0FF",body:.8}))}function rt(t){const a=[],c=[],n=[],o=[];let y=0;const r=[.2,.36,.29],u=[.36,.52,.43],i=[.7,.6,.33],v=[.17,.3,.25],d=[.4,.56,1],p=(g,h,M)=>[g[0]+(h[0]-g[0])*M,g[1]+(h[1]-g[1])*M,g[2]+(h[2]-g[2])*M],b=(g,h,M,A,w,e,l,m)=>(a.push(g,h,M),c.push(A[0],A[1],A[2]),n.push(w,e,l,m),y++),P=(g,h,M,A,w,e,l,m,F,S)=>{const f=Math.cos(A),k=Math.sin(A),N=Math.cos(w),R=Math.sin(w),E=k*N,Z=-R,X=f*N,ae=f,se=-k,O=e*.36,ne=b(g,-h,M,p(l,v,.3),h,F,m,S),fe=b(g+E*e*.45+ae*O,-h+Z*e*.45+.04*e,M+X*e*.45+se*O,l,h,F,m,S),ie=b(g+E*e,-h+Z*e,M+X*e,p(l,i,.3),h,F,m,S),pe=b(g+E*e*.45-ae*O,-h+Z*e*.45+.04*e,M+X*e*.45-se*O,l,h,F,m,S);o.push(ne,fe,ie,ne,ie,pe)};for(let g=0;g<5;g++){const h=(g/4-.5)*.9;P(h,-.03,-.1-.08*(g%2),Math.PI+(t()-.5)*1.6+(g%2?0:Math.PI),.1,.24+.1*t(),p(r,u,t()),t()*6.283,3,h)}for(let g=0;g<6;g++){const h=(t()-.5)*1,M=.05+.3*t(),A=g===0?1:.35+.6*t(),w=t()*6.283,e=3;for(let F=0;F<e;F++){const S=A*F/e,f=A*(F+1)/e,k=b(h-.011,-S,M,v,S,0,w,h),N=b(h+.011,-S,M,v,S,0,w,h),R=b(h+.011,-f,M,v,f,0,w,h),E=b(h-.011,-f,M,v,f,0,w,h);o.push(k,E,R,k,R,N)}const l=5,m=t()<.5?1:-1;for(let F=0;F<l;F++){const S=A*(F+.3+.6*t())/l,f=S/A;g%3===0&&F===3?P(h,S,M+.02,t()*6.283,.1,.12,d,w,2,h):P(h,S,M,(F%2?1:-1)*m*(Math.PI/2-.5+t()*.8),.75+.55*t(),(.3+.2*t())*(1-.35*f),p(p(r,u,t()),i,.7*f*f*f),w,1,h)}}const z=new s.BufferGeometry;return z.setAttribute("position",new s.Float32BufferAttribute(a,3)),z.setAttribute("color",new s.Float32BufferAttribute(c,3)),z.setAttribute("aV",new s.Float32BufferAttribute(n,4)),z.setIndex(o),z.computeVertexNormals(),z}function lt(t,a,c,n){const o=[],y=(w,e,l,m,F,S)=>o.push([w,e,l,m,F,S,a()*6.283,a()]);for(const w of[-1,1])for(let e=-519;e>-705;e-=1.5+a()*2.2){if(a()<.35){e-=6*a();continue}y(w*7,B,e,1.25+a()*.5,w<0?Math.PI/2:-Math.PI/2,1.2+a()*1.6)}for(let w=0;w<46;w++){const e=a()*6.283,l=Math.sin(e)*38,m=W.z-Math.cos(e)*38;Math.abs(l)<8&&m>W.z||y(l,B,m,1.25+a()*.45,e+Math.PI,1.2+a())}const r=o.length;for(const w of je)for(const e of[-1.52,1.52])for(let l=-15;l<15;l+=.8+a()*1.4){if(a()<.3)continue;const m=Math.abs(l)/21,F=B+11.4*(1-m*m);y(l,F,w+e*1.08,Math.min(1.6+a()*3.2,F-15.8),e>0?0:Math.PI,.7+a()*.8)}const u=c,i=(w,e,l,m,F,S)=>o.push([w,e,l,m,F,S,u()*6.283,u()]);for(const w of[-1,1])for(let e=24;e<230;e+=3.2+u()*4){if(u()<.12){e+=10+26*u();continue}i(w*e,B-1.25,-429.55,1.4+u()*3.4,0,2.2+u()*2.2)}const v=o.length,d=new Float32Array(v*4),p=new Float32Array(v*4);o.forEach((w,e)=>{d.set(w.slice(0,4),e*4),p.set(w.slice(4),e*4)});const b=rt(n),P=q(b,v,[["iP",d,4],["iS",p,4]]),z=q(b,r,[["iP",d.slice(0,r*4),4],["iS",p.slice(0,r*4),4]]),g=w=>new s.ShaderMaterial({uniforms:t,side:s.DoubleSide,vertexShader:`
${V}
attribute vec3 color; attribute vec4 aV, iP, iS;
varying vec3 vC, vN, vW; varying float vGl;
void main(){
  float down = aV.x, kind = aV.y, ph = aV.z + iS.z;
  float ca = cos(iS.x), sa = sin(iS.x);
  // the tuft is as wide as its place on the ledge; a strand is as long as that place lets it hang
  vec3 lp = vec3(aV.w*iS.y + (position.x - aV.w)*1.2, position.y, position.z);
  float len = iP.w, hang = down*len;
  // (down the strand, leaves keep their own size; the strand wanders from side to side as it hangs)
  lp.y = position.y + down - hang;
  lp.x += step(kind, 2.5)*0.11*sin(hang*2.6 + ph)*smoothstep(0.0, 0.5, hang);
  float lo = step(kind, 2.5);                                          // the mat on the ledge does not swing
  float sw = lo*hang*hang*0.045*(sin(uTime*(0.8 + 0.3*iS.w) + ph + hang*0.9) + 0.5*sin(uTime*1.7 + ph*2.0 + hang*2.0));
  float fl = lo*step(0.5, kind)*0.05*sin(uTime*2.6 + ph*3.0 + down*17.0);
  lp.x += sw*0.8 + fl; lp.z += sw*0.6 + abs(sw)*0.3 + fl*0.6;
  vec3 wp = iP.xyz + vec3(lp.x*ca + lp.z*sa, lp.y, -lp.x*sa + lp.z*ca);
  vec3 n = vec3(normal.x*ca + normal.z*sa, normal.y, -normal.x*sa + normal.z*ca);
  ${w?`wp.y = 2.0*${I.toFixed(2)} - wp.y; n.y = -n.y; wp.x += 0.06*sin(wp.y*2.3 + uTime*1.7 + wp.z*0.4);`:""}
  vC = color*(0.8 + 0.4*iS.w); vN = n; vW = wp; vGl = step(1.5, kind)*step(kind, 2.5);
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
}`,fragmentShader:`
${V}
varying vec3 vC, vN, vW; varying float vGl;
void main(){
  ${w?`if (vW.y > ${I.toFixed(2)}) discard;`:""}
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0)); if (!gl_FrontFacing) N = -N;
  float d = length(cameraPosition - vW);
  vec3 alb = max(vC, 0.0);
  // a leaf is thin: it takes the light on both faces, and the lamps' gold from below
  vec3 c = alb*(bsLight(N)*0.75 + bsLight(-N)*0.35 + uGold*0.22) + alb*clamp(vGl, 0.0, 1.0)*1.3;
  ${w?"c *= vec3(0.42, 0.36, 0.46);":""}
  gl_FragColor = vec4(bsFog(max(c, 0.0), d), 1.0);
}`}),h=new s.Group,M=new s.Mesh(P,g(!1)),A=new s.Mesh(z,g(!0));return M.frustumCulled=!1,A.frustumCulled=!1,h.add(M,A),h}function ct(t,a,c){const n=new Float32Array(c*4);for(let r=0;r<c;r++)n.set([a(),a(),a(),.09+.1*a()],r*4);const o=new s.BufferGeometry;o.setAttribute("position",new s.Float32BufferAttribute([-1,0,0,0,-.45,0,1,0,0,0,.45,0],3)),o.setIndex([0,1,2,0,2,3]);const y=new s.Mesh(q(o,c,[["iP",n,4]]),new s.ShaderMaterial({uniforms:t,side:s.DoubleSide,vertexShader:`
${V}
attribute vec4 iP; varying vec3 vC, vW;
void main(){
  float h = iP.z, spd = 0.9 + 1.6*fract(h*7.3);
  vec2 lo = vec2(-21.5, -516.0), sz = vec2(43.0, 86.0);
  vec2 q = lo + mod(iP.xy*sz + uWind*uTime*spd + vec2(sin(uTime*0.31 + h*40.0), 0.0)*1.5, sz);
  float edge = smoothstep(0.0, 3.0, q.y - lo.y)*smoothstep(0.0, 3.0, lo.y + sz.y - q.y)*smoothstep(0.0, 1.5, q.x - lo.x)*smoothstep(0.0, 1.5, lo.x + sz.x - q.x)*smoothstep(1.0, 1.6, abs(q.x));
  float hop = abs(sin(uTime*(1.1 + 1.7*fract(h*3.1)) + h*20.0)); hop *= hop; hop *= hop;
  float a = uTime*(1.5 + 3.0*fract(h*5.7))*(0.3 + 0.7*hop) + h*40.0;
  vec3 ax = vec3(cos(a), 0.5*sin(a*0.7), sin(a)), ay = normalize(cross(ax, vec3(0.3, 1.0, 0.2)));
  vec3 wp = vec3(q.x, ${_.toFixed(1)} + 0.04 + 0.5*hop, q.y) + (ax*position.x + ay*position.y)*iP.w*edge;
  vec3 N = normalize(cross(ax, ay) + vec3(0.0, 1e-4, 0.0)); N.y = abs(N.y);
  vC = mix(vec3(0.62, 0.58, 0.80), vec3(0.86, 0.80, 0.92), fract(h*11.0))*(bsLight(N) + uGold*0.12);
  vW = wp;
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
}`,fragmentShader:`
${V}
varying vec3 vC, vW;
void main(){ gl_FragColor = vec4(bsFog(max(vC, 0.0), length(cameraPosition - vW)), 1.0); }`}));return y.frustumCulled=!1,y}function vt(t,a,c,n){const o=[],y=Math.PI;for(let i=0;i<40;i++){const v=i%2?1:-1,d=v*(12.2+t()*6.3),p=-522-t()*176,b=t()<.5?1:-1;o.push({x:d,y:B,z:p,heading:b>0?0:y,dx:0,dz:b,len:t()<.3?0:8+t()*22,phase:t()*40,arm:t()<.2?1:0})}for(const i of je)for(let v=0;v<4;v++){const d=(v%2?1:-1)*(11.5+t()*5),p=Math.abs(d)/21;o.push({x:d,y:B+11.4*(1-p*p),z:i+(t()-.5)*1.6,heading:t()<.5?0:y,phase:t()*40,arm:t()<.35?1:0})}const r={0:[.7,.96],2:[.38,.84],5:[.84,.9]};for(const i of a){const v=r[i.kind];if(!(!v||o.length>92))for(let d=0;d<2;d++){const p=t()*6.283,b=i.r*v[1];o.push({x:i.x+Math.sin(p)*b,y:i.y+i.h*v[0],z:i.z-Math.cos(p)*b,heading:Math.PI-p,phase:t()*40,arm:t()<.3?1:0})}}for(let i=0;i<30;i++){const v=1+t.int(0,13),d=c.r0+c.dr*(v+.55);let p=(t()-.5)*2.9;Math.abs(Math.sin(p)*d)<14&&(p=Math.sign(p||1)*(Math.asin(14/d)+t()*.3)),o.push({x:Math.sin(p)*d,y:B+v+1-.5,z:W.z-Math.cos(p)*d,heading:-p,phase:t()*40,arm:t()<.15?1:0})}for(const i of[-103,-45,45,103])o.push({x:i+1,y:9.5,z:-375,heading:0,phase:t()*40,arm:1});for(let i=0;i<12;i++){const v=i%2?1:-1;o.push({x:v*(14+t()*190),y:i<4?_:B,z:-433.5-t()*2,heading:(t()-.5)*.8,phase:t()*40,arm:t()<.5?1:0}),i<4&&(o[o.length-1].x=v*(13+t()*7))}for(const i of[-1,1])for(let v=0;v<3;v++){const d=i*(.33+v*.06),p=42.5+v%2*1.5;o.push({x:Math.sin(d)*p,y:B,z:W.z-Math.cos(d)*p,heading:-d,phase:t()*40,arm:v===1?1:0})}const u=n;for(let i=0;i<100;){const v=1+u.int(0,16),d=c.r0+c.dr*(v+.55);let p=(u()-.5)*2.9;Math.abs(Math.sin(p)*d)<16&&(p=Math.sign(p||1)*(Math.asin(16/d)+u()*.3));const b=1+u.int(0,2);for(let P=0;P<b;P++,i++){const z=p+P*.95/d;o.push({x:Math.sin(z)*d,y:B+v+1-.5,z:W.z-Math.cos(z)*d,heading:-z+(u()-.5)*.5,phase:u()*40,arm:u()<.15?1:0})}}for(let i=0;i<18;i++){const v=i%2?1:-1,d=1+u.int(0,20),p=u()<.4;o.push({x:v*(10+u()*6),y:$e.rise*(d+1),z:Ae(d)-.38,heading:p?v*y/2:(u()-.5)*1.2,dx:v,dz:0,len:p?2+u()*1.5:0,phase:u()*40,arm:u()<.4?1:0})}for(let i=0;i<14;i++){const v=i%2?1:-1,d=u()<.5?1:-1;o.push({x:v*(12.6+u()*4.4),y:_,z:-447-u()*62,heading:d>0?0:y,dx:0,dz:d,len:u()<.4?0:6+u()*12,phase:u()*40,arm:u()<.25?1:0})}return o}async function mt(t,a,c,n={}){const o=n.streams,y=o.boats,r=new s.Group,u=a.uTime,i=t.quality?.detail??1,v=null,d=Ze(a,{color:n.water,phases:n.phases});r.add(d.object),await t.yield();const p=He(a,Xe(),u,o.moths,n.phases);r.add(p.object),await t.yield();const b=[];for(let f=0;f<(n.boats??9);f++){const k=f>=(n.boats??9)-2;b.push(k?{x:(f%2?1:-1)*(4.6+y()*3.4),z:W.z+8-y()*28,ph:y()*6.283}:{x:(f%2?1:-1)*(4.7+y()*.6),z:-540-(f+y()*.6)*(150/Math.max((n.boats??9)-2,1)),ph:y()*6.283})}const P=tt(a,b,u,n.phases);r.add(P.object),await t.yield(),r.add(ot(a,o.fountains).object),await t.yield();const z=await nt(t,a,v,{rng:o.house,rng2:o.avenue,sky:n.sky,phases:n.phases});r.add(z.object),await t.yield();const g=H.makeMist({rng:o.houseMist,count:Math.round(26*i),area:[38,3,64],center:[0,_+1.6,-480],size:[6,12],color:"#b4bcec",opacity:.05,drift:[.25,0,.5],time:u});r.add(g.object),r.add(it(a,n.sky,{y:17,z:-810.6})),await t.yield(),r.add(lt(a,o.creeper,o.creeperWall,o.creeperLeaves)),await t.yield(),r.add(ct(a,o.leaves,Math.round(300*i))),await t.yield();const h=[];for(const f of[-1,1]){for(let k=0;k<5;k++)h.push([f*15.6,B,-539-32*k]);h.push([f*17.5,_,-440],[f*13.5,_,-519.5])}for(let f=0;f<6;f++){const k=(f<3?-1:1)*(.55+f%3*.62),N=45.2;h.push([Math.sin(k)*N,B,W.z+Math.cos(k)*N])}for(let f=0;f<8;f++){const k=(f<4?-1:1)*(.32+f%4*.33),N=78.4;h.push([Math.sin(k)*N,c.tiers.yTop,W.z-Math.cos(k)*N])}const M=J(),A=he(K("#E6E0D6"),.7);for(const f of h)Ie(M,[[.85,0],[1.05,.45],[1,.85],[.8,.85],[.8,.7]],f[0],f[1],f[2],10,()=>A);r.add(new s.Mesh(Y(M),c.stone)),await t.yield();const e={wind:re.makeWind({direction:[a.uWind.value.x,a.uWind.value.y],strength:.7,speed:.8}),backlight:.5,backlightTint:"#f0d8f0",ambient:2.6,leafAmbient:3,emissive:"#8478b8",emissiveIntensity:.3};await re.prepareLeafTexture(e,t.yield);const l=re.windMaterial(e);await t.yield();const m=[];for(let f=0;f<3;f++)m.push(re.birchGeometry({rng:[o.treeA,o.treeB,o.treeC][f],height:6.4+f*.5,detail:1,leaf:"#b4acd4",leafLight:"#ece4f6",leafDark:"#7a70a8",bark:"#d8d2cc"})),await t.yield();const F=re.makeScatter({rng:o.trees,variants:m,material:l,tint:.08,hue:.02,sink:0,tilt:.02,stretch:.1,points:h.map((f,k)=>({x:f[0],y:f[1]+.7,z:f[2],s:.95+.2*(k*.618%1),rot:k*2.4,d:0,u:0,v:k}))});r.add(F.object),await t.yield();const S=Ke(a,vt(o.folk,c.towers,c.tiers,o.folkStairs));return r.add(S),await t.yield(),{object:r,water:d,env:v,update(f,k,N){p.update(f,k,N),P.update(f,k,N),z.update(f,k,N),g.update(f,k,N),F.update(f,k,N)}}}export{$ as JETS,D as LAMP_ROW,U as PILLARS,Xe as lampPlaces,tt as makeBoats,ot as makeFountains,nt as makeHouse,He as makeLamps,mt as makeLife,Ze as makeWater};
