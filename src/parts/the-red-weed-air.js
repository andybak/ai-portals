import*as a from"three";import{RW_GLSL as z,withShared as M,Acc as E,C as b}from"./the-red-weed-common.js";const I=`
uniform float uTime, uU, uFlare;
attribute vec4 aP;            // base xyz, size
attribute vec4 aQ;            // corner x -1..1, corner y 0..1, when it catches (in uU's measure), seed (+2 = a ground glow)
varying vec2 vUv; varying float vOn, vSeed, vGlow;
void main(){
  float seed = fract(aQ.w), glow = step(1.5, aQ.w);
  vec3 toCam = cameraPosition - aP.xyz; vec2 rt = normalize(vec2(toCam.z, -toCam.x) + vec2(1e-5, 0.0));
  float flick = 1.0 + 0.12*sin(uTime*7.0 + seed*50.0) + 0.08*sin(uTime*13.0 + seed*90.0);
  float on = aQ.z < 0.0 ? 1.0 : smoothstep(aQ.z, aQ.z + max(uFlare, 1e-3), uU);
  float w = aP.w*mix(0.5, 2.6, glow), h = aP.w*mix(1.55*flick, 0.9, glow)*(0.35 + 0.65*on);
  vec3 p = aP.xyz + vec3(rt.x, 0.0, rt.y)*aQ.x*w + vec3(0.0, 1.0, 0.0)*(aQ.y*h - glow*h*0.3);
  vUv = vec2(aQ.x, aQ.y); vOn = on; vSeed = seed; vGlow = glow;
  gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.0);
}`,B=`
${z}
uniform float uU, uGain;
varying vec2 vUv; varying float vOn, vSeed, vGlow;
void main(){
  float x = vUv.x, y = clamp(vUv.y, 0.0, 1.0), t = uTime*1.25 + vSeed*20.0;
  vec3 col;
  if (vGlow > 0.5) {
    float r = length(vec2(x, (y - 0.3)*1.6));
    col = vec3(1.0, 0.3, 0.06)*(1.0 - smoothstep(0.0, 1.0, r))*(1.0 - smoothstep(0.0, 1.0, r))*0.16*(0.85 + 0.15*sin(uTime*3.0 + vSeed*30.0));
  } else {
    float n1 = rwN(vec2(x*2.0 + vSeed*7.0, y*2.6 - t)), n2 = rwN(vec2(x*4.6 - vSeed*3.0, y*6.5 - t*1.9));
    float prof = 1.0 - abs(x + (n1 - 0.5)*0.9*y)/max(0.95*(1.0 - 0.88*y), 0.06);
    float m = clamp(prof, 0.0, 1.0)*(1.0 - y)*(0.5 + 1.1*n2) + 0.3*(1.0 - y)*(1.0 - y)*clamp(prof, 0.0, 1.0);
    float f = smoothstep(0.1, 0.5, m);
    col = mix(vec3(0.8, 0.09, 0.01), vec3(1.0, 0.36, 0.05), smoothstep(0.22, 0.7, m));
    col = mix(col, vec3(1.0, 0.5, 0.11), smoothstep(0.8, 1.25, m))*f*0.62;
  }
  gl_FragColor = vec4(col*vOn*uGain, 1.0);
}`;function $(d,l){const r=l.flames.length,t=new Float32Array(r*4*3),e=new Float32Array(r*16),f=new Float32Array(r*16),u=[];for(let i=0;i<r;i++){const s=l.flames[i],c=[[-1,0],[1,0],[1,1],[-1,1]];for(let o=0;o<4;o++){const w=i*4+o;t[w*3]=s[0],t[w*3+1]=s[1],t[w*3+2]=s[2],e.set([s[0],s[1],s[2],s[3]],w*4),f.set([c[o][0],c[o][1],s[4],s[5]],w*4)}u.push(i*4,i*4+1,i*4+2,i*4,i*4+2,i*4+3)}const v=new a.BufferGeometry;v.setAttribute("position",new a.BufferAttribute(t,3)),v.setAttribute("aP",new a.BufferAttribute(e,4)),v.setAttribute("aQ",new a.BufferAttribute(f,4)),v.setIndex(u),v.computeBoundingSphere(),v.boundingSphere.radius+=200;const h=M(d,{uU:{value:0},uGain:{value:l.gain??1},uFlare:{value:l.flare??1}}),n=new a.Mesh(v,new a.ShaderMaterial({uniforms:h,vertexShader:I,fragmentShader:B,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending}));return n.renderOrder=3,{object:n,uniforms:h,triangles:r*2}}const L=`
${z}
attribute vec2 aL;            // 0 middle .. 1 lip; how thick the smoke is here (m)
varying vec3 vW, vN; varying vec2 vL;
void main(){
  vec3 p = position;
  float heave = rwN(p.xz*0.04 + vec2(uTime*0.02, 0.0)) + 0.5*rwN(p.xz*0.11 - vec2(0.0, uTime*0.03));
  p += normal*(heave - 0.75)*(1.3 + 0.1*min(aL.y, 34.0))*smoothstep(0.0, 3.0, aL.y);
  vW = p; vN = normal; vL = aL;
  gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.0);
}`,G=`
${z}
uniform vec3 uInk;
varying vec3 vW, vN; varying vec2 vL;
float inkB(vec3 q){ return 0.6*rwN(q.xz*0.075 + vec2(uTime*0.015, q.y*0.05)) + 0.4*rwN(q.xz*0.21 + vec2(q.y*0.17, -uTime*0.02)); }
void main(){
  vec3 vv = cameraPosition - vW; float dist = length(vv); vec3 v = vv/max(dist, 1e-3);
  // the coils: the skin's normal is turned by the slope of a slow field, more where the smoke is deep
  float bil = inkB(vW), e = 1.6;
  vec3 gr = vec3(inkB(vW + vec3(e, 0.0, 0.0)) - bil, 0.0, inkB(vW + vec3(0.0, 0.0, e)) - bil)/e;
  float deep = smoothstep(1.0, 12.0, clamp(vL.y, 0.0, 40.0));
  vec3 n = normalize(vN + vec3(0.0, 1e-4, 0.0) - gr*(3.0 + 9.0*deep));
  float ndv = clamp(dot(normalize(vN + vec3(0.0, 1e-4, 0.0)), v), 0.0, 1.0), fr = 1.0 - ndv;
  vec3 rf = reflect(-v, n); rf.y = abs(rf.y) + 0.02; rf = normalize(rf);
  // ink: nearly black; upper curves carry a dull sheen of the evening, the hollows between the coils none
  float up = smoothstep(0.15, 0.95, n.y), hollow = smoothstep(0.25, 0.75, bil);
  vec3 col = uInk*(0.55 + 0.6*bil) + rwSky(rf)*(0.02 + 0.16*fr*fr*fr)*up + rwAmb(n)*(0.012 + 0.05*up*hollow);
  vec3 gd = normalize(vec3(uGlow.x, 0.25, uGlow.z));
  float rim = clamp(dot(n, gd), 0.0, 1.0); col += (uSkyRose*0.6 + uSkyAmber*0.4)*uGlow.w*rim*rim*0.07*(0.4 + 0.6*hollow);
  // its coils are told apart: a finer roll over the slow one, grey-violet on the crowns, and the afterglow lies
  // along every crown's sky side (it is smoke, not a hill)
  float roll = rwN(vW.xz*0.55 + vec2(vW.y*0.4, uTime*0.03)), crown = smoothstep(0.45, 0.8, 0.6*bil + 0.4*roll);
  float sky2 = clamp(0.5 + 0.5*dot(n, gd), 0.0, 1.0);
  col += (0.5*uSkyRose + 0.25*uSkyAmber + 0.25*uMistCol)*uGlow.w*(0.05*crown*sky2 + 0.11*fr*fr*sky2*sky2);
  col += (0.6*uMistCol + 0.4*uSkyRose)*0.045*crown*(0.3 + 0.7*up);
  col *= 0.62 + 0.38*smoothstep(0.2, 0.6, roll);
  vec3 fd = normalize(uFire.xyz - vW); col += uFireCol*uFire.w*clamp(dot(n, fd), 0.0, 1.0)*0.035;
  // its thin lip is grey and torn, not a cut-out; its outline against the sky is soft
  float thick = clamp(vL.y, 0.0, 40.0), lipK = smoothstep(0.0, 2.2, thick + (bil - 0.5)*1.6);
  col = mix(uInk*1.6 + 0.03*uMistCol, col, lipK);
  float a = lipK*smoothstep(0.02, 0.26, ndv)*0.97;
  gl_FragColor = vec4(rwAir(col, vW, cameraPosition), a);
}`;function D(d,l){const[r,t]=l.centre,[e,f]=l.size,u=l.top??14,v=l.floor||(()=>0),h=26,n=96,i=[],s=[],c=[],o=l.heaps||[],w=l.reach?Math.atan2(l.reach[1],l.reach[0]):0,A=m=>.74+.11*Math.sin(3*m+1.3)+.07*Math.sin(5*m+4.1)+.05*Math.sin(9*m+.7)+(l.reach?.3*Math.pow(Math.max(0,Math.cos(m-w)),6):0);for(let m=0;m<=h;m++)for(let y=0;y<=n;y++){const p=Math.pow(m/h,.8),x=y/n*Math.PI*2,C=A(x),P=r+Math.cos(x)*e*p*C,T=t+Math.sin(x)*f*p*C,N=v(P,T),_=Math.max(u-N,0);let R=0;for(const k of o)R+=k[2]*Math.exp(-(Math.pow(P-r-k[0],2)+Math.pow(T-t-k[1],2))/(k[3]*k[3]));const W=_*Math.sqrt(Math.max(0,1-Math.pow(p,4)))+R*Math.min(1,_/4)*Math.max(0,1-Math.pow(p,3));i.push(P,N+W-(W<.05?.4:0),T),s.push(p,W)}for(let m=0;m<h;m++)for(let y=0;y<n;y++){const p=m*(n+1)+y,x=p+n+1;c.push(p,p+1,x+1,p,x+1,x)}const g=new a.BufferGeometry;g.setAttribute("position",new a.Float32BufferAttribute(i,3)),g.setAttribute("aL",new a.Float32BufferAttribute(s,2)),g.setIndex(c),g.computeVertexNormals(),g.computeBoundingSphere();const S=M(d,{uInk:{value:l.ink||new a.Color(.022,.022,.027)}}),F=new a.Mesh(g,new a.ShaderMaterial({uniforms:S,vertexShader:L,fragmentShader:G,transparent:!0,depthWrite:!1,side:a.DoubleSide}));return F.renderOrder=2,{object:F,uniforms:S,triangles:c.length/3}}const q=`
uniform float uT, uPx, uFlash; uniform vec3 uFrom, uTo;
attribute vec3 aS;            // along the tail 0 (head) .. 1, side -1..1, kind (0 streak, 1 head, 2 horizon bloom)
varying vec3 vS; varying float vA;
void main(){
  vec3 dir = uTo - uFrom; float len = length(dir); dir /= max(len, 1.0);
  float tt = clamp(uT, 0.0, 1.0);
  vec3 head = cameraPosition + uFrom + dir*len*tt;
  float tail = min(len*tt, len*0.15);
  vec3 p = head - dir*tail*aS.x*step(aS.z, 0.5);
  vec3 vd = normalize(p - cameraPosition), sd = normalize(cross(dir, vd) + vec3(0.0, 1e-5, 0.0));
  float dist = length(p - cameraPosition), wpx = aS.z < 0.5 ? 1.5*(1.0 - 0.75*aS.x) : (aS.z < 1.5 ? 4.5 : 0.0);
  p += sd*aS.y*wpx*uPx*dist + (aS.z > 0.5 && aS.z < 1.5 ? cross(sd, vd)*(aS.x*2.0 - 1.0)*wpx*uPx*dist : vec3(0.0));
  if (aS.z > 1.5) { p = cameraPosition + uTo + vec3(0.0, 40.0, 0.0) + sd*aS.y*len*0.16 + vec3(0.0, 1.0, 0.0)*(aS.x*2.0 - 1.0)*len*0.045; }
  vS = aS; vA = smoothstep(0.0, 0.06, uT)*(1.0 - smoothstep(0.93, 1.0, uT));
  gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.0);
}`,Q=`
uniform float uFlash;
varying vec3 vS; varying float vA;
void main(){
  vec3 col;
  float sx = clamp(vS.x, 0.0, 1.0), sy = clamp(vS.y, -1.0, 1.0);
  if (vS.z < 0.5) { float e = 1.0 - sy*sy; col = mix(vec3(0.5, 1.6, 0.7)*2.2, vec3(0.05, 0.42, 0.14), smoothstep(0.0, 0.45, sx))*e*e*(1.0 - sx)*vA; }
  else if (vS.z < 1.5) { float r = length(vec2(vS.x*2.0 - 1.0, vS.y)); float g = 1.0 - smoothstep(0.0, 1.0, r); col = vec3(0.6, 1.5, 0.8)*g*g*g*3.2*vA; }
  else { float r = length(vec2(vS.x*2.0 - 1.0, vS.y)); float g = 1.0 - smoothstep(0.0, 1.0, r); col = vec3(0.1, 0.75, 0.3)*g*g*0.55*uFlash; }
  gl_FragColor = vec4(col, 1.0);
}`;function H(d,l){const r=[],t=[],e=[],f=(n,i)=>{const s=r.length/3;for(let c=0;c<=i;c++)for(const o of[-1,1])r.push(c/i,o,n),e.push(0,0,0);for(let c=0;c<i;c++){const o=s+c*2;t.push(o,o+1,o+3,o,o+3,o+2)}};f(0,8),f(1,1),f(2,1);const u=new a.BufferGeometry;u.setAttribute("position",new a.Float32BufferAttribute(e,3)),u.setAttribute("aS",new a.Float32BufferAttribute(r,3)),u.setIndex(t),u.boundingSphere=new a.Sphere(new a.Vector3,1e6);const v={uT:{value:-1},uPx:d.uPx,uFlash:{value:0},uFrom:{value:l.from.clone()},uTo:{value:l.to.clone()}},h=new a.Mesh(u,new a.ShaderMaterial({uniforms:v,vertexShader:q,fragmentShader:Q,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,fog:!1}));return h.frustumCulled=!1,h.renderOrder=1,{object:h,uniforms:v,triangles:t.length/3}}const j=`
uniform float uTime; uniform vec4 uWake[8];
attribute vec3 color; attribute vec4 aE;      // bird, head weight, -, phase
varying vec3 vW, vN, vCol;
void main(){
  int i = int(aE.x + 0.5); vec4 wk = uWake[i];
  vec3 F = vec3(wk.z, 0.0, wk.w), R = vec3(-wk.w, 0.0, wk.z);
  vec3 lp = position; float ph = aE.w*40.0;
  lp.z -= aE.y*0.035*sin(uTime*4.6 + ph);                       // a moorhen jerks its head as it swims
  lp.y += 0.012*sin(uTime*1.7 + ph) - 0.02;
  vec3 wp = vec3(wk.x, 0.0, wk.y) + R*lp.x + vec3(0.0, lp.y, 0.0) - F*lp.z;
  vW = wp; vN = normalize(R*normal.x + vec3(0.0, normal.y, 0.0) - F*normal.z); vCol = color;
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
}`,U=`
${z}
varying vec3 vW, vN, vCol;
void main(){
  vec3 n = normalize(vN);
  vec3 col = vCol*(uKeyCol*clamp(dot(n, uKeyDir)*0.8 + 0.2, 0.0, 1.0) + rwAmb(n)*1.5 + uSkyRose*0.1*clamp(-n.y, 0.0, 1.0));
  gl_FragColor = vec4(rwAir(col, vW, cameraPosition), 1.0);
}`;function J(d,l,r={}){const t=new E,e=b("#cfcac0"),f=b("#17161a");for(let n=0;n<8;n++){const i=n<2,s=(n*.37+(r.phase||0))%1;if(t.extra(n,0,0,s),i){t.color(e),t.ball(0,.16,.05,[.26,.2,.52],8,5);for(const o of[1,-1])t.ball(o*.17,.3,.14,[.1,.13,.36],6,4);t.ball(0,.22,.6,[.09,.07,.16],5,3);const c=[[0,.24,-.4],[0,.5,-.54],[0,.74,-.5],[0,.9,-.52],[0,.93,-.64]];for(let o=0;o<c.length-1;o++)t.tube(c[o],c[o+1],.07-o*.006,.064-o*.006,6,0);t.ball(0,.93,-.66,[.055,.055,.085],6,4),t.color(b("#b8632a")),t.tube([0,.92,-.72],[0,.89,-.85],.03,.012,5,0)}else t.color(f),t.ball(0,.07,0,[.085,.075,.15],6,4),t.extra(n,1,0,s),t.ball(0,.17,-.13,[.04,.04,.05],5,3),t.color(b("#a8301c")),t.tube([0,.17,-.17],[0,.155,-.215],.016,.006,4,0),t.extra(n,0,0,s),t.color(b("#bdb8ae")),t.ball(0,.12,.15,[.03,.03,.03],4,3)}const u=t.geometry("aE",!0);u.boundingSphere=new a.Sphere(new a.Vector3,1e6);const v=M(d,{uWake:l}),h=new a.Mesh(u,new a.ShaderMaterial({uniforms:v,vertexShader:j,fragmentShader:U}));return h.frustumCulled=!1,{object:h,uniforms:v,triangles:t.triangles}}const V=`
uniform float uTime, uLift; uniform vec4 uPerch[8];
attribute vec4 aE;            // bird, wing side (-1, 0 body, 1), span along the wing 0..1, phase
varying vec3 vW, vN;
void main(){
  int i = int(aE.x + 0.5); vec4 pc = uPerch[i]; float ph = aE.w;
  float tau = clamp(uLift*1.7 - ph*0.7, 0.0, 1.0), fly = smoothstep(0.0, 0.1, tau);
  // sitting it faces along its heading; once up it wheels away outward and climbs
  float hd = pc.w + tau*(1.2 + 2.5*ph);
  vec3 F = vec3(sin(hd), 0.0, -cos(hd)), R = vec3(cos(hd), 0.0, sin(hd));
  vec3 lp = position;
  float flap = sin(uTime*(8.0 + 3.0*ph) + ph*30.0)*0.95 - 0.2;
  float ang = aE.y*mix(-1.25, flap, fly);                                 // folded down along the body, or beating
  float span = lp.x*mix(0.3, 1.0, fly);
  if (abs(aE.y) > 0.5) { lp.x = span*cos(ang); lp.y += abs(span)*sin(abs(ang))*sign(ang*aE.y); }
  lp.y += 0.03*sin(uTime*1.3 + ph*20.0)*(1.0 - fly);                     // a sitting bird shifts
  vec3 off = F*(tau*(9.0 + 12.0*ph)) + vec3(0.0, tau*(2.5 + 7.0*tau) + 0.6*fly*sin(uTime*2.0 + ph*9.0), 0.0) + R*(tau*tau*6.0*(ph - 0.5));
  vec3 wp = pc.xyz + off + R*lp.x + vec3(0.0, lp.y, 0.0) - F*lp.z;
  vW = wp; vN = normalize(R*normal.x + vec3(0.0, normal.y, 0.0) - F*normal.z);
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
}`,K=`
${z}
uniform vec3 uCol;
varying vec3 vW, vN;
void main(){
  vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
  vec3 col = uCol*(uKeyCol*clamp(dot(n, uKeyDir)*0.8 + 0.2, 0.0, 1.0) + rwAmb(n)*1.3);
  gl_FragColor = vec4(rwAir(col, vW, cameraPosition), 1.0);
}`;function X(d,l){const r=new E,t=Math.min(8,l.perches.length),e=l.size??1;for(let n=0;n<t;n++){const i=(n*.618+.13+(l.phase||0))%1;r.extra(n,0,0,i),r.ball(0,.16*e,0,[.085*e,.1*e,.2*e],6,4),r.ball(0,.27*e,-.19*e,[.055*e,.055*e,.07*e],5,3),r.tube([0,.27*e,-.24*e],[0,.25*e,-.35*e],.022*e,.006*e,4,0),r.quad([-.05*e,.15*e,.16*e],[.05*e,.15*e,.16*e],[.08*e,.12*e,.4*e],[-.08*e,.12*e,.4*e]);for(const s of[1,-1]){const c=y=>[n,s,y,i],o=.2*e,w=r.v(s*.06*e,o,-.1*e,0,1,0,c(0)),A=r.v(s*.06*e,o,.14*e,0,1,0,c(0)),g=r.v(s*.3*e,o,.16*e,0,1,0,c(.5)),S=r.v(s*.3*e,o,-.08*e,0,1,0,c(.5)),F=r.v(s*.56*e,o,.1*e,0,1,0,c(1)),m=r.v(s*.5*e,o,-.02*e,0,1,0,c(1));r.quadI(w,A,g,S),r.quadI(S,g,F,m)}}const f=r.geometry("aE",!1);f.boundingSphere=new a.Sphere(new a.Vector3,1e6);const u=[];for(let n=0;n<8;n++){const i=l.perches[Math.min(n,t-1)];u.push(new a.Vector4(i[0],i[1],i[2],i[3]))}const v=M(d,{uLift:{value:0},uPerch:{value:u},uCol:{value:b(l.color??"#141317")}}),h=new a.Mesh(f,new a.ShaderMaterial({uniforms:v,vertexShader:V,fragmentShader:K,side:a.DoubleSide}));return h.frustumCulled=!1,{object:h,uniforms:v,triangles:r.triangles}}export{H as makeFallingStar,$ as makeFarFire,D as makeInk,X as makePerched,J as makeWaterfowl};
