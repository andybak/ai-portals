import{NOISE as ht,FOG_VERT_PARS as $,FOG_VERT as q,FOG_FRAG_PARS as Q}from"./bridges-of-marigold-air-glsl.js";import{fogUniforms as X}from"../kit/fx.js";import{sparkMaterial as Ot,sparkMesh as Wt}from"./bridges-of-marigold-air-lamps.js";import{GREAT_BRIDGE as T,HIGH_BRIDGE as M,EXIT as L,MIST as k}from"./bridges-of-marigold-plan.js";const Kt=14,ct=8,D="0.86",_t=55,jt=240,Vt=`
${ht}${$}
attribute vec4 aT, aS, aK; varying vec2 vL; varying vec4 vS; varying float vKind; varying vec3 vP;
// where level k begins (0 to 5; the fifth is the crown's foot), as a share of the tower's height
float levelAt(float k){ return k < 0.5 ? 0. : (k > 4.5 ? ${D} : ${D}*(k + (hash11(k*7.3 + aS.y*31.) - 0.5)*0.5)/5.); }
void main(){
  float rg = floor(position.y*${Kt}. + 0.5), blk = floor(rg*0.5), odd = rg - 2.*blk, bnd = blk + odd;
  float sd = dot(position.xz, position.xz) > 1e-6 ? floor(atan(position.z, position.x)*${(ct/6.2832).toFixed(4)} + 0.5) : 0.;
  float kt = 2. + floor(hash11(aS.y*17.3)*2.), thin = 3.4/aT.w;
  float deck = step(0.5, aK.z)*step(aK.z, 1.5), flat0 = step(1.5, aK.z)*step(aK.z, 2.5), spire = step(2.5, aK.z);
  float isT = step(abs(blk - kt), 0.5), crown = step(4.5, blk)*step(blk, 5.5), cap = step(5.5, blk);
  // the ring's height: a level's top is the next one's foot; the terrace is a thin level at the top of its span
  float y6 = 0.925 + (${D} + thin - 0.925)*deck + 0.005*flat0 - 0.025*spire;
  float y = abs(bnd - kt) < 0.5 ? levelAt(kt + 1.) - thin : levelAt(min(bnd, 5.));
  float uneven = step(0.5, bnd)*step(bnd, 4.5)*step(0.5, abs(bnd - kt))*step(0.5, abs(bnd - kt - 1.));
  y += uneven*(hash12(vec2(sd, bnd) + aS.y*77.) - 0.5)*5./aT.w;
  y = bnd > 5.5 ? y6 : y;
  y = rg > 12.5 ? mix(y6, 1., rg > 13.5 ? 1. : 0.62 + 0.38*flat0 - 0.22*spire) : y;
  // the ring's radius at this corner: the build (straight, swollen at the waist, or shouldered), then the level's own
  float lv = levelAt(min(blk, 5.))/${D}, waist = step(0.5, aK.w)*step(aK.w, 1.5), sh = step(1.5, aK.w);
  float rr = aT.z*(1. - aS.x*${D}*mix(lv, lv*lv, sh))*(1. + 0.24*waist*sin(3.1416*lv));
  float houses = (0.84 + 0.3*hash12(vec2(blk, 9.) + aS.y*41.))*(0.86 + 0.3*hash12(vec2(sd, blk) + aS.y*57.))*(1. + 0.1*step(blk, 0.5));
  float r = mix(rr*mix(houses, 1.4, isT), rr*(0.74 + 0.62*deck + 0.08*flat0 - 0.24*spire), crown);
  float capR = rr*(0.74 - 0.32*deck - 0.18*flat0 - 0.24*spire);
  r = mix(r, capR*(rg > 13.5 ? 0. : (rg > 12.5 ? 0.74 + 0.26*flat0 - 0.24*spire : 1.)), cap);
  vec2 off = (hash22(vec2(blk, 3.) + aS.y*23.) - 0.5)*aT.z*0.16*step(0.5, blk)*step(blk, 4.5);
  vec3 w = vec3(aT.x + position.x*r + off.x, aS.w + y*aT.w, aT.y + position.z*r + off.y);
  w.xz += aK.xy*(y*aT.w);
  vL = position.xz; vS = vec4(r, y*aT.w, aS.y, aS.z); vP = w; vKind = cap*(1. - flat0) > 0.5 ? 3. : (isT + crown*deck > 0.5 ? 2. : 1.);
  vec4 mvPosition = viewMatrix*vec4(w, 1.); gl_Position = projectionMatrix*mvPosition;
${q} }`,$t=`
${ht}${Q}
uniform float uTime; uniform vec3 uFill, uKey, uKeyDir, uWarm, uRose, uTeal, uGlow, uHaze; varying vec2 vL; varying vec4 vS; varying float vKind; varying vec3 vP;
vec3 paint(float h){ return h < 0.24 ? vec3(0.66, 0.07, 0.30) : (h < 0.4 ? vec3(0.72, 0.16, 0.16) : (h < 0.54 ? vec3(0.74, 0.32, 0.06) :
  (h < 0.67 ? vec3(0.32, 0.14, 0.62) : (h < 0.78 ? vec3(0.10, 0.22, 0.62) : (h < 0.89 ? vec3(0.06, 0.40, 0.42) : vec3(0.66, 0.54, 0.40)))))); }
vec3 lampHue(float k){ return k < 0.5 ? uTeal : (k < 1.5 ? uRose : (k < 2.5 ? uWarm : (k < 3.5 ? vec3(0.5, 0.14, 1.5) : vec3(0.6, 1.3, 0.06)))); }
void main(){
  float ang = dot(vL, vL) > 1e-6 ? atan(vL.y, vL.x) : 0.;
  vec3 fn = cross(dFdx(vP), dFdy(vP)); fn /= max(length(fn), 1e-6); fn *= dot(fn, cameraPosition - vP) < 0. ? -1. : 1.;
  float dome = step(2.9, vKind), roof = step(0.75, abs(fn.y))*(1. - dome), rim = step(1.5, vKind)*(1. - dome)*(1. - roof), wallK = (1. - dome)*(1. - roof)*(1. - rim);
  vec3 sky = uFill*(0.55 + 0.45*fn.y) + uKey*max(dot(fn, uKeyDir), 0.); float row = floor(vS.y/6.5);
  vec2 hc = vec2(ang*vS.x/(8.5*(0.7 + 1.2*hash11(row*1.7 + vS.z*3.))) + hash11(row + vS.z*13.)*5., vS.y/6.5), house = floor(hc), hf = fract(hc);
  float band = floor(row/3. + hash11(vS.z*7.)*3.), h0 = hash12(house + vS.z*91.), hh = h0 < 0.64 ? hash11(band*1.31 + vS.z*5.) : fract(h0*7.3);
  float own = step(0.36, hash12(house*1.7 + vS.z*13. + 5.))*(0.55 + 0.45*hash12(house*2.3 + 1.)), back = step(0.7, hash12(house*3.7 + 2.));
  vec2 fw = vec2(min(fwidth(hc.x), 1.), fwidth(hc.y));       // (the angle's own seam is no footprint)
  float coarse = smoothstep(0.45, 1.1, max(fw.x, fw.y)), fine = 1. - smoothstep(0.16, 0.42, max(fw.x*2., fw.y));
  vec3 light = sky + uGlow*mix((0.3 + 0.95*own)*(0.6 + 0.62*hf.y)*(1. - 0.45*back), 0.72, coarse);
  vec3 wall = mix(paint(hh), paint(hash11(band*1.31 + vS.z*5.))*0.8 + 0.06, coarse)*light*(1. - 0.5*fine*max(step(0.9, hf.y), step(0.95, hf.x)));
  vec2 wi = vec2(house.x*2. + floor(hf.x*2.), house.y), wq = vec2(fract(hf.x*2.), hf.y);
  float hs = hash12(wi*3.1 + vS.z*17.), lit = step(1. - vS.w, hash12(wi + vS.z*7.));
  float win = step(abs(wq.x - 0.5), 0.13 + 0.06*hs)*step(0.22, wq.y)*step(wq.y, 0.56 + 0.08*hs);
  float spill = (1. - smoothstep(0.12, 0.5, abs(wq.x - 0.5)))*(1. - smoothstep(0.2, 0.52, abs(wq.y - 0.4)));
  float candle = 1. - 0.4*step(0.5, fract(hs*9.7))*(0.5 + 0.5*sin(uTime*(2.5 + 5.*hs) + hs*61.));
  vec3 lampC = hs < 0.86 ? uWarm : (hs < 0.93 ? uRose : uTeal);
  vec3 col = wall + mix(uWarm*vS.w*0.14, lampC*lit*(win*(0.7 + 0.8*hs) + 0.1*spill)*candle, fine);
  // a line of lamps along the eaves of one row in five
  float lq = ang*vS.x/2.8, lrow = step(0.8, hash11(row*3.3 + vS.z*19.)), lfw = 1. - smoothstep(0.2, 0.5, min(fwidth(lq), 1.));
  float ld = step(abs(fract(lq) - 0.5), 0.3)*step(0.8, hf.y)*step(hf.y, 0.97)*(0.8 + 0.2*sin(uTime*(1.7 + 2.6*fract(floor(lq)*0.37)) + floor(lq)*5.));
  col += lrow*mix(vec3(0.5, 0.42, 0.44)*step(0.76, hf.y)*0.5, lampHue(mod(floor(lq), 5.))*ld, lfw*fine);
  float lx = ang*vS.x/4.2, lh = hash11(floor(lx) + vS.z*3.), lfine = 1. - smoothstep(0.2, 0.5, min(fwidth(lx), 1.));
  vec3 rimC = vec3(0.5, 0.4, 0.36)*(sky + uGlow*0.9) + mix(uWarm*0.22, (lh < 0.6 ? uWarm : (lh < 0.8 ? uRose : uTeal))*0.9*step(abs(fract(lx) - 0.5), 0.22), lfine);
  vec3 roofC = vec3(0.36, 0.2, 0.15)*(sky + uGlow*0.45);
  float dh = fract(vS.z*5.31);
  vec3 domeC = mix(dh < 0.3 ? vec3(0.1, 0.3, 0.55) : (dh < 0.55 ? vec3(0.1, 0.48, 0.44) : (dh < 0.8 ? vec3(0.62, 0.12, 0.3) : vec3(0.7, 0.4, 0.1))), vec3(0.8, 0.6, 0.24), 0.8*step(0.5, fract(ang*${(ct/2/6.2832).toFixed(5)})))*(sky*1.2 + uGlow*0.7);
  col = col*wallK + rimC*rim + roofC*roof + domeC*dome;
  col = mix(col, uHaze, 0.92*(1. - smoothstep(6., 42., vS.y)));          // the foot is lost in the mist it stands in
  gl_FragColor = vec4(fxApplyFog(col), 1.);
}`,Nt=`
${$}
attribute vec4 aT, aS; varying vec2 vQ; varying float vHue;
void main(){ vQ = position.xy*2.; vHue = aS.y;
  vec4 mvPosition = viewMatrix*vec4(aT.x + position.x*aT.z*7., aS.w + 12., aT.y + position.y*aT.z*7., 1.); gl_Position = projectionMatrix*mvPosition;
${q} }`,Qt=`
${Q}
uniform vec3 uWarm, uRose, uTeal; varying vec2 vQ; varying float vHue;
void main(){ float d = min(length(vQ), 1.), k = 1. - d; k *= k;
  vec3 hue = vHue < 0.6 ? uWarm : (vHue < 0.8 ? uRose : uTeal);
  gl_FragColor = vec4(hue*k*(0.3 + 0.7*k)*(1. - fxFog()), 1.); }`,Xt=`
${$}
attribute float aE; varying float vE;
void main(){ vE = aE; vec4 mvPosition = modelViewMatrix*vec4(position, 1.); gl_Position = projectionMatrix*mvPosition;
${q} }`,Yt=`
${Q}
uniform vec3 uGold; varying float vE;
void main(){ gl_FragColor = vec4(fxApplyFog(uGold*(1. - 0.6*vE*vE)), 1.); }`,Jt=`
${$}
attribute vec4 aB, aD, aH; varying vec2 vL; varying vec4 vS; varying float vKind; varying vec3 vP;
void main(){
  float c = cos(aB.w), s = sin(aB.w); vec3 q = position*aD.xyz, w = aB.xyz + vec3(q.x*c + q.z*s, q.y, q.z*c - q.x*s);
  vec2 ax = w.xz - aH.xy; float rad = max(length(ax), 1e-3);
  vL = ax/rad; vS = vec4(rad, w.y - aD.w, aH.z, aH.w); vP = w; vKind = 1.;
  vec4 mvPosition = viewMatrix*vec4(w, 1.); gl_Position = projectionMatrix*mvPosition;
${q} }`,Zt=`
${$}
attribute vec2 aU; varying vec2 vU;
void main(){ vU = aU; vec4 mvPosition = modelViewMatrix*vec4(position, 1.); gl_Position = projectionMatrix*mvPosition;
${q} }`,te=`
${ht}${Q}
varying vec2 vU;
void main(){
  float k = floor(vU.x/2.3), f = fract(vU.x/2.3), h = hash11(k*1.37 + 3.);
  if(f > 0.8*(1. - 0.5*smoothstep(0.55, 1., vU.y)*step(0.5, fract(k*0.5)))) discard;      // (every other flag is cut to a point)
  vec3 c = h < 0.2 ? vec3(0.9, 0.12, 0.42) : (h < 0.4 ? vec3(1.0, 0.5, 0.08) : (h < 0.55 ? vec3(0.1, 0.62, 0.6) : (h < 0.7 ? vec3(0.42, 0.18, 0.85) : (h < 0.85 ? vec3(0.95, 0.8, 0.2) : vec3(0.3, 0.7, 0.15)))));
  gl_FragColor = vec4(fxApplyFog(c*(0.5 - 0.14*vU.y)), 1.);
}`;async function ne(C,qt){const{THREE:a,look:B,U:ft,H:P,rng:v,lampColors:b}=qt,z=new a.Group,ut=Math.round(150*Math.min(1,.5+.5*B.detail)),vt=[],dt=[],pt=[],c=[],Lt=Math.max(T.z0,M.z1)+60,Dt=(t,s,e)=>s>T.z1&&s<T.z0+60&&Math.abs(t-T.x)<_t+e||s>M.z0&&s<M.z1+60&&Math.abs(t-M.x)<_t+e,Y=(t,s)=>(t.x-(T.x+M.x)/2)*(s.x-(T.x+M.x)/2)<0&&Math.min(t.z,s.z)<Lt,mt=(t,s,e,o,n,d,u,h,r,f,m)=>{c.push({x:t,z:s,rad:e,hgt:o,seed:d,taper:n,cap:f,lx:Math.cos(h)*r,lz:Math.sin(h)*r}),vt.push(t,s,e,o),dt.push(n,d,u*(.75+.25*B.density),k-10),pt.push(Math.cos(h)*r,Math.sin(h)*r,f,m)},wt=[[M.x+118,L.z+135,31,262,0],[T.x-118,L.z+150,28,236,2],[M.x+104,L.z+305,25,208,2]];for(const t of wt)mt(t[0],t[1],t[2],t[3],.3+.1*v(),v(),.74,0,0,t[4],0);for(let t=0;c.length<ut&&t<ut*12;t++){const s=v(),e=v(),o=v(),n=v(),d=v.range(80,300),u=v.range(.22,.52),h=v(),r=v.range(.5,.78),f=12+28*n*n,m=v()*Math.PI*2,y=.065*v()*v(),w=Math.floor(v()*4),i=Math.floor(v()*3),l=e<.42?(o-.5)*2.4:o*Math.PI*2,g=300+650*Math.sqrt(s),p=g*Math.sin(l),R=g*Math.cos(l);if(Dt(p,R,y*d+Math.max(f*1.67,w===2?f*.16+28:0))||Math.hypot(p-L.x,R-L.z)<jt)continue;let _=!0;for(const Et of c)if(Math.hypot(Et.x-p,Et.z-R)<70){_=!1;break}_&&mt(p,R,f,d,u,h,r,m,y,w,i)}await C.yield();const U=new a.CylinderGeometry(1,1,1,ct,Kt,!1).translate(0,.5,0),x=new a.InstancedBufferGeometry;x.index=U.index,x.setAttribute("position",U.attributes.position),x.setAttribute("aT",new a.InstancedBufferAttribute(new Float32Array(vt),4)),x.setAttribute("aS",new a.InstancedBufferAttribute(new Float32Array(dt),4)),x.setAttribute("aK",new a.InstancedBufferAttribute(new Float32Array(pt),4)),x.instanceCount=c.length;const yt=P.keyAz*Math.PI/180,J=new a.ShaderMaterial({fog:!0,vertexShader:Vt,fragmentShader:$t,uniforms:{...X(),uTime:ft.uTime,uFill:{value:new a.Color(P.fillSky).multiplyScalar(P.fill)},uKey:{value:new a.Color(P.key).multiplyScalar(.6*P.keyI)},uKeyDir:{value:new a.Vector3(Math.sin(yt)*300,150,-Math.cos(yt)*300).normalize()},uGlow:{value:new a.Color("#ffe2c4").multiplyScalar(.32)},uHaze:{value:new a.Color(P.mist).multiplyScalar(1.3)},uWarm:{value:new a.Color("#ffb458").multiplyScalar(1.5)},uRose:{value:b.magenta.clone().multiplyScalar(1.6)},uTeal:{value:b.teal.clone().multiplyScalar(1.6)}}}),gt=new a.Mesh(x,J);gt.frustumCulled=!1,z.add(gt);const Z=new a.PlaneGeometry(1,1),A=new a.InstancedBufferGeometry;A.index=Z.index,A.setAttribute("position",Z.attributes.position),A.setAttribute("aT",x.attributes.aT),A.setAttribute("aS",x.attributes.aS),A.instanceCount=c.length;const xt=new a.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,vertexShader:Nt,fragmentShader:Qt,uniforms:{...X(),uWarm:{value:new a.Color("#ff9438").multiplyScalar(.36)},uRose:{value:b.magenta.clone().multiplyScalar(.28)},uTeal:{value:b.teal.clone().multiplyScalar(.24)}}}),tt=new a.Mesh(A,xt);tt.frustumCulled=!1,tt.renderOrder=3,z.add(tt),await C.yield();const et=[],bt=[],at=[],O=new Set;let F=0;for(let t=0;t<c.length&&F<18;t++)for(let s=t+1;s<c.length&&F<18;s++){const e=c[t],o=c[s],n=Math.hypot(e.x-o.x,e.z-o.z);if(O.has(t)||O.has(s)||n<95||n>200||Y(e,o))continue;O.add(t),O.add(s),F++;const d=Math.min(e.hgt,o.hgt)*.5,u=(o.x-e.x)/n,h=(o.z-e.z)/n,r=et.length/3,f=18;for(let m=0;m<=f;m++){const y=m/f,w=e.rad*.8+(n-(e.rad+o.rad)*.8)*y,i=d+.14*n*4*y*(1-y);for(const l of[-1,1])et.push(e.x+u*w-h*l*4.5,i,e.z+h*w+u*l*4.5),bt.push(l);if(m<f){const l=r+m*2;at.push(l,l+1,l+2,l+1,l+3,l+2)}}}const H=new a.BufferGeometry;H.setAttribute("position",new a.Float32BufferAttribute(et,3)),H.setAttribute("aE",new a.Float32BufferAttribute(bt,1)),H.setIndex(at);const St=new a.ShaderMaterial({fog:!0,side:a.DoubleSide,vertexShader:Xt,fragmentShader:Yt,uniforms:{...X(),uGold:{value:B.glow.clone().multiplyScalar(.9)}}});if(F){const t=new a.Mesh(H,St);t.frustumCulled=!1,z.add(t)}await C.yield();const zt=[b.teal,b.magenta,b.orange,b.violet,b.lime],Mt=[],kt=[],At=[],W=new Uint8Array(c.length);let j=0;const Tt=new Set;for(let t=0;t<c.length&&j<60;t++)for(let s=t+1;s<c.length&&j<60;s++){const e=c[t],o=c[s],n=Math.hypot(e.x-o.x,e.z-o.z);if(W[t]>1||W[s]>1||n<75||n>230||Y(e,o))continue;W[t]++,W[s]++,j++,Tt.add(t+":"+s);const d=(o.x-e.x)/n,u=(o.z-e.z)/n,h=k+e.hgt*(.5+.3*e.seed),r=k+o.hgt*(.5+.3*o.seed),f=n-(e.rad+o.rad)*.7,m=Math.max(6,Math.round(f/7)),y=zt[Math.floor(e.seed*4.999)],w=zt[Math.floor(o.seed*4.999)];for(let i=0;i<m;i++){const l=(i+.5)/m,g=e.rad*.7+f*l,p=i%2?y:w;Mt.push(e.x+d*g,h+(r-h)*l-.09*n*4*l*(1-l),e.z+u*g,2.6),kt.push(1,0,0,0),At.push(p.r*.8,p.g*.8,p.b*.8,(e.seed*7.13+i*.381)%1)}}const Pt=Ot(a,ft,{drop:0,core:3.2,halo:.55}),I=Wt(a,Pt,Mt,kt,At);I.count&&z.add(I.mesh),await C.yield();const ot=[],Ft=[],st=[],V=new Uint8Array(c.length);let G=0;for(let t=0;t<c.length&&G<50;t++)for(let s=t+1;s<c.length&&G<50;s++){const e=c[t],o=c[s],n=Math.hypot(e.x-o.x,e.z-o.z);if(V[t]>1||V[s]>1||n<75||n>210||Y(e,o)||Tt.has(t+":"+s))continue;V[t]++,V[s]++,G++;const d=(o.x-e.x)/n,u=(o.z-e.z)/n,h=k+e.hgt*(.3+.3*o.seed),r=k+o.hgt*(.3+.3*e.seed),f=n-(e.rad+o.rad)*.7,m=ot.length/3,y=16;for(let w=0;w<=y;w++){const i=w/y,l=e.rad*.7+f*i,g=h+(r-h)*i-.07*n*4*i*(1-i);if(ot.push(e.x+d*l,g,e.z+u*l,e.x+d*l,g-2.8,e.z+u*l),Ft.push(f*i,0,f*i,1),w<y){const p=m+w*2;st.push(p,p+1,p+2,p+1,p+3,p+2)}}}const E=new a.BufferGeometry;E.setAttribute("position",new a.Float32BufferAttribute(ot,3)),E.setAttribute("aU",new a.Float32BufferAttribute(Ft,2)),E.setIndex(st);const Gt=new a.ShaderMaterial({fog:!0,side:a.DoubleSide,vertexShader:Zt,fragmentShader:te,uniforms:{...X()}});if(G){const t=new a.Mesh(E,Gt);t.frustumCulled=!1,z.add(t)}const nt=[],K=[],it=(t,s,e,o,n,d,u,h)=>{const r=nt.length/3,f=Math.cos(u),m=Math.sin(u),y=Math.cos(h),w=Math.sin(h);for(let i=0;i<8;i++){const l=(i&1?.5:-.5)*o,g=(i&2?.5:-.5)*n,p=(i&4?.5:-.5)*d,R=g*y+p*w,_=p*y-g*w;nt.push(t+l*f+_*m,s+R,e-l*m+_*f)}for(const i of[[0,1,3,2],[4,6,7,5],[0,4,5,1],[2,3,7,6],[0,2,6,4],[1,5,7,3]])K.push(r+i[0],r+i[1],r+i[2],r+i[0],r+i[2],r+i[3])};for(const t of c){if(t.cap!==2)continue;const s=.56*t.rad*(1-.86*t.taper),e=k-10+t.hgt,o=t.seed*19,n=15+12*t.seed,d=20+14*(t.seed*7.7%1),u=d/2-5,h=t.x+t.lx*t.hgt+Math.sin(o)*s*.35,r=t.z+t.lz*t.hgt+Math.cos(o)*s*.35;it(h,e+n/2,r,2,n,2,o,0),it(h+Math.sin(o)*u*.94,e+n-1.5+u*.34,r+Math.cos(o)*u*.94,1.5,1.5,d,o,.35),it(h,e+n-3.5,r,4.2,2.4,4.2,o,0)}const N=new a.BufferGeometry;N.setAttribute("position",new a.Float32BufferAttribute(nt,3)),N.setIndex(K);const Rt=new a.MeshBasicMaterial({color:new a.Color("#c98a45").multiplyScalar(.5),fog:!0,side:a.DoubleSide});if(K.length){const t=new a.Mesh(N,Rt);t.frustumCulled=!1,z.add(t)}await C.yield();const rt=[],Ct=[],Bt=[],Ut=Math.round(150*Math.min(1,.4+.6*B.detail));for(let t=0;t<wt.length;t++)for(let s=0;s<Ut;s++){const e=c[t],o=v()*Math.PI*2,n=v(),d=v.range(7,13),u=6.5*(1+Math.floor(v()*2)),h=v.range(1.5,5.5),r=Math.round((44+(.86*e.hgt-52)*n)/6.5)*6.5,f=e.rad*(1-e.taper*(r/e.hgt))+h-7;rt.push(e.x+Math.cos(o)*f,k-10+r+u/2,e.z+Math.sin(o)*f,Math.PI/2-o),Ct.push(d,u,14,k-10),Bt.push(e.x,e.z,e.seed,.74*(.75+.25*B.density))}const lt=new a.BoxGeometry(1,1,1),S=new a.InstancedBufferGeometry;S.index=lt.index,S.setAttribute("position",lt.attributes.position),S.setAttribute("aB",new a.InstancedBufferAttribute(new Float32Array(rt),4)),S.setAttribute("aD",new a.InstancedBufferAttribute(new Float32Array(Ct),4)),S.setAttribute("aH",new a.InstancedBufferAttribute(new Float32Array(Bt),4)),S.instanceCount=rt.length/4;const Ht=new a.ShaderMaterial({fog:!0,vertexShader:Jt,fragmentShader:$t,uniforms:J.uniforms}),It=new a.Mesh(S,Ht);return It.frustumCulled=!1,z.add(It),{object:z,triangles:c.length*(U.index.count/3+2)+at.length/3+I.count*2+st.length/3+K.length/3+S.instanceCount*12,drawCalls:3+(F?1:0)+(I.count?1:0)+(G?1:0)+(K.length?1:0),count:c.length,spans:F,strings:j,flagLines:G,update(){},dispose(){for(const t of[U,x,J,Z,A,xt,H,St,I,Pt,E,Gt,N,Rt,lt,S,Ht])t.dispose()}}}export{ne as buildFar};
