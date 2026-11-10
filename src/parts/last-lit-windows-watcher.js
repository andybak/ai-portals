import*as i from"three";import{NL_GLSL as Q}from"./last-lit-windows.js";const pe=(v,S,l)=>Math.min(l,Math.max(S,v)),N=(v,S,l)=>{const p=pe((l-v)/(S-v),0,1);return p*p*(3-2*p)},xe=[[-52,0,84,98,138],[22,0,72,100,170],[44,-60,56,46,126],[44,60,56,46,126],[86,0,50,54,100],[92,-46,32,30,34],[92,46,32,30,34],[-72,-68,52,40,82],[-72,68,52,40,82],[-112,0,30,46,46],[102,0,38,50,78]],D={a:118,y:97,ra:46,ry:32,rb:38,tilt:.3},be=`
uniform float uTime, uPhase;
attribute vec4 aInfo;                  // breath weight, height above the ground, a seed, unused
attribute vec3 aGlow; attribute vec3 aPol;      // aPol: cos and sin of the bearing round the body, distance out from the spine
varying vec3 vW, vN, vGlow, vPol; varying vec4 vInfo;
void main(){
  float br = sin(uTime*0.5712 + uPhase), br2 = sin(uTime*0.5712 + uPhase - 0.9);
  vec3 p = position + normal*(0.8*br*aInfo.x) + vec3(0.0, 0.35*br2*aInfo.x, 0.0);
  vN = normal; vGlow = aGlow; vInfo = aInfo; vPol = aPol;
  vec4 wp = modelMatrix*vec4(p, 1.0); vW = wp.xyz;
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,Ne=`
precision highp float;
${Q}
uniform float uRimK; uniform vec4 uDome; uniform vec3 uDomeCol;
varying vec3 vW, vN, vGlow, vPol; varying vec4 vInfo;
void main(){
  vec3 P = vW; vec3 toEye = cameraPosition - P; float dist = length(toEye); vec3 V = toEye/max(dist, 1e-3);
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0));
  float px = dist*0.0018;
  // hide: slow blotches, folds that run down the flanks from the spine, a grain close by
  vec2 pol = vPol.xy;
  float n1 = nlN3(P*0.045), n3 = nlN3(P*0.8 + 11.0);
  float n2 = nlN(pol*15.0 + vPol.z*vec2(1.9, -1.3) + 5.0), n2b = nlN(pol*41.0 - vPol.z*vec2(2.3, 3.1) + 17.0);
  float fold = 1.0 - abs(2.0*n2 - 1.0), fine = 1.0 - abs(2.0*n2b - 1.0);
  float kf = 1.0 - smoothstep(0.25, 1.2, px), km = 1.0 - smoothstep(0.6, 3.0, px);
  // close by the hide is in plates, cracked apart, a few metres across: a pattern of the place, not of the flank's run
  float plate = 1.0 - abs(2.0*nlN3(P*0.17 + 5.0) - 1.0), crack = smoothstep(0.84, 0.97, plate)*km;
  float plate2 = 1.0 - abs(2.0*nlN3(P*0.47 + 23.0) - 1.0), crack2 = smoothstep(0.86, 0.97, plate2)*kf;
  float hgt = fold*0.9 + fine*0.3*km + n3*0.3*kf + n1*0.5 - 0.6*crack - 0.3*crack2;
  vec3 dpx = dFdx(P), dpy = dFdy(P); float dhx = dFdx(hgt), dhy = dFdy(hgt);
  vec3 r1 = cross(dpy, N), r2 = cross(N, dpx); float det = dot(dpx, r1);
  vec3 grad = (r1*dhx + r2*dhy)/(abs(det) > 1e-7 ? det : 1e-7);
  vec3 Nb = normalize(N - grad*0.7*(1.0 - smoothstep(1.0, 4.0, px)));
  vec3 alb = mix(vec3(0.06, 0.056, 0.056), vec3(0.15, 0.135, 0.12), n1)*(0.55 + 0.7*fold*fold)*(1.0 - 0.3*crack)*(1.0 - 0.18*crack2);
  // a pale crust that has had an age to grow up the lowest twenty metres
  float crust = (1.0 - smoothstep(9.0, 23.0, vInfo.y + 9.0*(n1 - 0.5)))*smoothstep(0.3, 0.62, nlN3(P*0.19 + 3.0));
  alb = mix(alb, vec3(0.15, 0.155, 0.13)*(0.7 + 0.5*n3), crust*0.85);
  // ash sliding off its back: thin pale streams that creep down the folds
  float lane = smoothstep(0.66, 0.8, nlN(pol*33.0 + 9.0));
  float stream = lane*smoothstep(0.5, 0.85, nlN(vec2(n2*7.0 + pol.x*23.0, vInfo.y*0.06 + uTime*0.3)))*smoothstep(12.0, 40.0, vInfo.y)*(1.0 - vInfo.w);
  alb = mix(alb, vec3(0.24, 0.23, 0.22), stream*0.7);
  // The face is a light miles wide: three places on it are taken (low and near, half-way up, high), so that its amber
  // lies broad on whatever looks toward it or up at it and wraps onto the ridges of the folds. The side turned from it is
  // dark but not void: the cold of the sky's rim is on it, least in the folds. Every edge that turns from us is rimmed
  // amber; the pits redden it from below, far up the flank; the dome throws its cold light up under the jaw.
  vec2 q = clamp(P.xz, vec2(-1150.0), vec2(1150.0)); vec2 tq = normalize(P.xz - q + 1e-3).yx*vec2(1.0, -1.0);
  vec3 L0 = normalize(vec3(q*0.96 + tq*380.0, 140.0).xzy - P), L1 = normalize(vec3(q*0.89 - tq*300.0, 420.0).xzy - P), L2 = normalize(vec3(q*0.78, 800.0).xzy - P);
  float fall = sqrt(clamp(nlKeyFall(P), 0.0, 1.0));
  float ka = 0.5*max(dot(Nb, L0) + 0.3, 0.0)/1.3 + 0.4*max(dot(Nb, L1) + 0.3, 0.0)/1.3 + 0.3*max(dot(Nb, L2) + 0.3, 0.0)/1.3, nlg = max(dot(N, L1), 0.0);
  float fr = 1.0 - max(dot(N, V), 0.0), fr2 = fr*fr;
  vec3 col = alb*(uAmb + vec3(0.15, 0.18, 0.29)*((0.35 + 0.65*(0.5 + 0.5*Nb.y))*(0.4 + 0.6*fold)) + uKeyCol*(ka*fall));
  col += uKeyCol*(fr2*fr2*(0.16 + 0.84*nlg)*(0.25 + 0.75*fold)*0.1*uRimK*fall);
  vec3 dd = uDome.xyz - P; float rd2 = dot(dd, dd);
  col += (alb + 0.02*fr2*fr)*uDomeCol*((0.2 + 0.8*max(dot(Nb, dd)*inversesqrt(rd2 + 1e-3), 0.0))/(1.0 + rd2/(uDome.w*uDome.w)));
  col += nlPales(P, Nb, V, alb*1.6, uRimK) + (alb*2.2 + 0.01)*vGlow;
  gl_FragColor = vec4(nlFog(col, P), 1.0);
}`,Me=`
uniform float uTime, uPhase; uniform vec2 uRes;
attribute vec4 aInfo;
varying vec3 vW, vN; varying float vH;
void main(){
  float br = sin(uTime*0.5712 + uPhase), br2 = sin(uTime*0.5712 + uPhase - 0.9);
  vec3 p = position + normal*(0.8*br*aInfo.x) + vec3(0.0, 0.35*br2*aInfo.x, 0.0);
  vec4 wp = modelMatrix*vec4(p, 1.0);
  float pix = length(cameraPosition - wp.xyz)*1.2498/max(uRes.y, 1.0);
  wp.xyz += normalize(normal)*max(0.6, 2.2*pix);
  vW = wp.xyz; vN = normal; vH = aInfo.y;
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,Pe=`
precision highp float;
${Q}
uniform float uRimK; uniform vec4 uDome; uniform vec3 uDomeCol;
varying vec3 vW, vN; varying float vH;
void main(){
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0)); vec3 L = normalize(uKeyAt - vW);
  float k = 0.07 + 0.93*smoothstep(-0.3, 0.7, dot(N, L));
  // broken along its length, as light is on a rough hide
  k *= 0.55 + 0.9*nlN3(vW*0.21);
  vec3 col = uKeyCol*(0.36*k*uRimK*sqrt(clamp(nlKeyFall(vW), 0.0, 1.0)))*smoothstep(2.0, 16.0, vH);
  for (int i = 0; i < 4; i++) { vec3 dl = uPit[i].xyz - vW; col += uPitCol[i]*(0.22/(1.0 + dot(dl, dl)/(uPit[i].w*uPit[i].w*2.0))); }
  vec3 dd = uDome.xyz - vW; col += uDomeCol*(0.03/(1.0 + dot(dd, dd)/(uDome.w*uDome.w)));
  gl_FragColor = vec4(nlFog(col, vW), 1.0);
}`,ze=`
precision highp float;
${Q}
uniform float uTurn, uEr; uniform vec3 uLampC; uniform vec4 uDome; uniform vec3 uDomeCol;
varying vec3 vW, vN, vL;
void main(){
  vec3 toEye = cameraPosition - vW; vec3 V = toEye/max(length(toEye), 1e-3);
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0));
  // a dark wet lens that holds the windows of the last house: a small field of amber points, which slides across it as
  // the eye turns and as we pass (the mirror swings about the vertical with the turn)
  float ca = cos(uTurn), sa = sin(uTurn);
  vec3 Nr = normalize(vec3(N.x*ca + N.z*sa, N.y, -N.x*sa + N.z*ca));
  vec3 R = reflect(-V, Nr);
  vec2 lp = vL.xy/max(uEr, 1e-3);
  vec2 c = lp*4.2 + vec2(R.x - 9.0*uTurn, R.y)*2.6, ci = floor(c), cf = c - ci;
  float towards = 1.0 - smoothstep(-0.35, 0.25, R.z + 0.325*R.y);                    // the part of the lens that looks at the face
  float lit = step(0.38, nlH(ci + 5.0));
  vec2 q = cf - 0.5 - 0.3*(vec2(nlH(ci + 1.3), nlH(ci + 8.1)) - 0.5);
  float pt = exp(-dot(q, q)*30.0)*(0.7 + 0.3*sin(uTime*(1.0 + 2.0*nlH(ci)) + nlH(ci + 2.0)*30.0))*(0.4 + 0.6*nlH(ci + 3.7));
  float rl = length(lp), field = (1.0 - smoothstep(0.55, 0.9, rl))*(0.35 + 0.65*towards);
  float fr = 1.0 - max(dot(N, V), 0.0);
  vec2 cw = fwidth(c); float farK = smoothstep(0.35, 1.2, max(cw.x, cw.y));              // far off the points run together into a dull glint
  // one dim lens: a dull glow of the house's light over the whole of it, deepest at its middle, and the points faint in it
  float body = (1.0 - smoothstep(0.35, 1.0, rl))*(0.5 + 0.5*towards);
  vec3 col = vec3(0.003, 0.003, 0.005) + uLampC*(mix(0.9*pt*lit, 0.1, farK)*field + 0.05*field + 0.1*body);
  col += vec3(0.05, 0.055, 0.07)*fr*fr*fr;                                    // wet
  // the lid's shadow above, a line of cold light along the lower lid from the dome
  col *= 0.3 + 0.7*(1.0 - smoothstep(0.45, 1.0, lp.y + 0.25));
  vec3 dd = uDome.xyz - vW; float rd2 = dot(dd, dd);
  col += uDomeCol*(0.05*pow(max(dot(reflect(-V, N), dd*inversesqrt(rd2 + 1e-3)), 0.0), 24.0) + 0.012*smoothstep(0.6, 0.95, rl))/(1.0 + rd2/(uDome.w*uDome.w));
  col += nlPales(vW, N, V, vec3(0.02), 0.6);
  gl_FragColor = vec4(nlFog(col, vW), 1.0);
}`;async function Se(v,S,l){const p=v.noise,u=l.tall/170,w=(l.lenK??1)*u,P=(l.widK??1)*u,h=l.f,M=[-h[1],h[0]],q=l.c[0],I=l.c[1],F=l.seed??0,ee=xe.map((e,o)=>[e[0]*w,e[1]*P,e[2]*w,e[3]*P,e[4]*u*(o===1?l.hump??1:1)]),we=(e,o)=>{let r=0;for(let a=0;a<ee.length;a++){const t=ee[a],n=(e-t[0])/t[2],d=(o-t[1])/t[3],c=1-n*n-d*d;if(c>0){const s=t[4]*Math.sqrt(c),A=s*s;r+=A*A*s}}return Math.pow(r,.2)},K=l.rings??108,m=l.sectors??160,W=172*w,C=116*P,ye=(e,o)=>{const r=we(e,o);if(r<=0)return 0;const a=Math.min(1,r/(28*u)),t=Math.hypot(e/W,o/C),n=t>1e-4?e/W/t:1,d=t>1e-4?o/C/t:0;let c=7*u*Math.exp(-((o/(13*P))**2))*N(60*u,120*u,r)*(.45+.55*p.n2(e/(15*w)+F,3.3));return c+=(12*p.ridged2(n*2.7+t*.45+F,d*2.7-t*.3,2)-5)*u*a*N(.1,.42,t),c+=(4*p.ridged2(e/(44*w)+7+F,o/(44*P)-3,2)+2.2*p.n2(e/(9*w),o/(9*P)+F)-2)*u*a,Math.max(0,r+c)},V=1+K*m,g=new Float32Array(V*3),B=new Float32Array(V*4),te=new Float32Array(V*3),T=new Float32Array(V*3),oe=(e,o,r)=>{const a=ye(o,r),t=q+h[0]*o+M[0]*r,n=I+h[1]*o+M[1]*r;g[e*3]=t,g[e*3+1]=a,g[e*3+2]=n;const d=a/l.tall,c=l.ground?l.ground(t,n):0,s=Math.hypot(o/W,r/C);T[e*3]=s>1e-4?o/W/s:1,T[e*3+1]=s>1e-4?r/C/s:0,T[e*3+2]=s,B[e*4]=N(.08,.4,d)*(1-.6*N(60*w,110*w,o)),B[e*4+1]=a-c,B[e*4+2]=(o*.37+r*.11)%1,B[e*4+3]=0};oe(0,0,0);for(let e=1;e<=K;e++){const o=e/K,r=1-Math.pow(1-o,1.45);for(let a=0;a<m;a++){const t=a/m*Math.PI*2;oe(1+(e-1)*m+a,r*W*Math.cos(t),r*C*Math.sin(t))}(e&3)===3&&await v.yield()}const E=[];for(let e=0;e<m;e++)E.push(0,1+(e+1)%m,1+e);for(let e=1;e<K;e++)for(let o=0;o<m;o++){const r=1+(e-1)*m+o,a=1+(e-1)*m+(o+1)%m,t=r+m,n=a+m;g[r*3+1]<=0&&g[a*3+1]<=0&&g[t*3+1]<=0&&g[n*3+1]<=0||(E.push(r,a,t,a,n,t),o===m-1&&(e&31)===31&&await v.yield())}await v.yield();const y=new i.BufferGeometry;y.setAttribute("position",new i.BufferAttribute(g,3)),y.setIndex(E),y.computeVertexNormals(),await v.yield();const ae=l.headSeg??44,f=new i.SphereGeometry(1,ae,Math.round(ae*.7)),x=f.attributes.position,z=x.count,R=new Float32Array(z*4),re=new Float32Array(z*3),H=new Float32Array(z*3),ne=l.headTilt??D.tilt,_=Math.cos(ne),G=Math.sin(ne),b=[D.a*w,D.y*u*(l.headUp??1),0],le=e=>{const o=[.4,-.02,.92*e],r=Math.hypot(...o);return o.map(a=>a/r)},j=(e,o,r)=>{let a=1;for(const c of[-1,1]){const s=le(c),A=e*s[0]+o*s[1]+r*s[2],Y=Math.acos(pe(A,-1,1));a-=.055*Math.exp(-(Y*Y)/(.2*.2))}a+=.17*Math.exp(-(((o-.42)/.15)**2))*N(-.3,.3,e)*(.75+.25*Math.abs(r)),a-=.16*N(.72,1,e),a+=.09*N(.1,-.5,o)*N(-.3,.4,e),a-=.05*Math.exp(-(((o+.08)/.07)**2))*N(.25,.8,e),a+=.12*p.ridged2(e*2.3+r*1.7+F,o*2.3-r,3)-.05+.07*p.n3(e*4.5,o*4.5,r*4.5+F);const t=e*D.ra*w*a,n=o*D.ry*u*a,d=r*D.rb*P*a;return[b[0]+t*_-n*G,b[1]+t*G+n*_,b[2]+d]};for(let e=0;e<z;e++){const o=x.getY(e),r=x.getZ(e),a=x.getX(e),t=j(o,r,a);x.setXYZ(e,q+h[0]*t[0]+M[0]*t[2],t[1],I+h[1]*t[0]+M[1]*t[2]),R[e*4]=.15,R[e*4+1]=t[1],R[e*4+2]=.5,R[e*4+3]=1,H[e*3]=o*.55+.3*a+.5,H[e*3+1]=r*.55-.22*a-.3,H[e*3+2]=.5+.4*a}f.computeVertexNormals();{const e=f.attributes.normal,o=[q+h[0]*b[0],b[1],I+h[1]*b[0]];let r=0;for(let a=0;a<z;a+=7)r+=(x.getX(a)-o[0])*e.getX(a)+(x.getY(a)-o[1])*e.getY(a)+(x.getZ(a)-o[2])*e.getZ(a)<0?1:-1;if(r>0){for(let t=0;t<z;t++)e.setXYZ(t,-e.getX(t),-e.getY(t),-e.getZ(t));const a=f.index.array;for(let t=0;t<a.length;t+=3){const n=a[t+1];a[t+1]=a[t+2],a[t+2]=n}}}await v.yield();const ie=(e,o,r,a)=>{if(l.glow)for(const t of[].concat(l.glow))for(let n=0;n<a;n++){const d=t.at[0]-e[n*3],c=t.at[1]-e[n*3+1],s=t.at[2]-e[n*3+2],A=d*d+c*c+s*s,Y=Math.sqrt(A)||1,ue=Math.max(0,(o[n*3]*d+o[n*3+1]*c+o[n*3+2]*s)/Y),$=1+A/(t.reach*t.reach),ve=t.low?Math.max(0,Math.min(1,(t.low[1]-e[n*3+1])/(t.low[1]-t.low[0]))):1,J=t.power*(t.low?ue:.12+.88*ue)/(t.sharp?$*$:$)*ve*ve;r[n*3]+=t.color[0]*J,r[n*3+1]+=t.color[1]*J,r[n*3+2]+=t.color[2]*J}};ie(g,y.attributes.normal.array,te,V),ie(x.array,f.attributes.normal.array,re,z),y.setAttribute("aInfo",new i.BufferAttribute(B,4)),y.setAttribute("aGlow",new i.BufferAttribute(te,3)),y.setAttribute("aPol",new i.BufferAttribute(T,3)),f.setAttribute("aInfo",new i.BufferAttribute(R,4)),f.setAttribute("aGlow",new i.BufferAttribute(re,3)),f.setAttribute("aPol",new i.BufferAttribute(H,3)),f.deleteAttribute("uv"),y.computeBoundingSphere(),f.computeBoundingSphere();const se={uDome:{value:new i.Vector4(...l.dome?l.dome.at:[0,-1e3,0],l.dome?l.dome.reach:1)},uDomeCol:{value:new i.Color(...l.dome?l.dome.color:[0,0,0])}},U={...S.uniforms,...se,uPhase:{value:l.phase??0},uRimK:{value:l.rim??1}},ce=new i.ShaderMaterial({uniforms:U,vertexShader:be,fragmentShader:Ne}),k=new i.Group;k.name="watcher";const X=new i.Mesh(y,ce);X.name="watcher-body",k.add(X);const Z=new i.Mesh(f,ce);Z.name="watcher-head",k.add(Z);const de=new i.ShaderMaterial({uniforms:U,vertexShader:Me,fragmentShader:Pe,side:i.BackSide}),he=new i.Mesh(y,de);he.name="watcher-rim",k.add(he);const me=new i.Mesh(f,de);me.name="watcher-rim",k.add(me);const L=4.6*u,O=[],fe={...S.uniforms,...se,uTurn:{value:0},uEr:{value:L},uLampC:{value:new i.Color("#FFC46B")}},ge=new i.ShaderMaterial({uniforms:fe,fragmentShader:ze,vertexShader:"varying vec3 vW, vN, vL; void main(){ vL = position; vN = normalize(mat3(modelMatrix)*normal); vec4 wp = modelMatrix*vec4(position, 1.0); vW = wp.xyz; gl_Position = projectionMatrix*viewMatrix*wp; }"});for(const e of[-1,1]){const o=le(e),r=j(o[0],o[1],o[2]),a=j(o[0]*1,o[1],o[2]),t=new i.SphereGeometry(1,20,10,0,Math.PI*2,0,Math.PI/2);t.rotateX(Math.PI/2),t.scale(L,L,L*.6);const n=new i.Mesh(t,ge);n.name="watcher-eye";const d=[o[0]*_-o[1]*G,o[0]*G+o[1]*_,o[2]],c=new i.Vector3(h[0]*d[0]+M[0]*d[2],d[1],h[1]*d[0]+M[1]*d[2]).normalize(),s=new i.Vector3(q+h[0]*r[0]+M[0]*r[2],r[1],I+h[1]*r[0]+M[1]*r[2]).addScaledVector(c,.04*L);n.position.copy(s),n.quaternion.setFromUnitVectors(new i.Vector3(0,0,1),c),k.add(n),O.push({mesh:n,at:s.clone().addScaledVector(c,.4*L),dir:c,sgn:e,q2:a})}return{group:k,uniforms:U,eyeUniforms:fe,eyes:O,eye:O[0].at,bodyMesh:X,headMesh:Z,headAt:new i.Vector3(q+h[0]*b[0],b[1],I+h[1]*b[0]),top:l.tall,triangles:2*(E.length/3+f.index.count/3)+400*2}}export{Se as buildWatcher};
