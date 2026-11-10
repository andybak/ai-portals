import*as t from"three";import{mergeVertices as la}from"three/addons/utils/BufferGeometryUtils.js";import{makePath as ca,clamp as de,lerp as it,smoothstep as R}from"../kit/core.js";import{makeSky as ha,makeLightRig as ua}from"../kit/sky.js";import*as da from"../kit/water.js";import*as _e from"../kit/fauna.js";import*as gt from"../kit/fx.js";import{buildHero as fa}from"../parts/island-being-born.js";const Se=120,ze=-800,Po=-132.2*Math.PI/180,Rt=32.5,lo=37,Y=38,Ae=[0,0,14,.0225,40,.045];function Vo(n){if(n<=Ae[0])return Ae[1];for(let l=2;l<Ae.length;l+=2)if(n<=Ae[l])return it(Ae[l-1],Ae[l+1],(n-Ae[l-2])/(Ae[l]-Ae[l-2]));return .045}const co=Ae[Ae.length-1],ma=.26*co,It=4.5,pa=3,xt=.6,bt=1.2,Do=15,Lo=45,va=22,wa=25,ya=46,ga=120,Da=.28,$t=50,xa=62,W=46,ba={morning:{el:28,preset:"day",sun:"#FFF4E0",sunI:1,amb:"#B9C0C8",ambI:1,zenith:"#1E57B8",horizon:"#BFD6EC",haze:12e-5,exposure:1,tint:"#ffffff",shadow:"#080c18",deep:"#193D78",shallow:"#3FA98C",night:!1,surge:.8},noon:{el:54,preset:"day",sun:"#FFFBF0",sunI:1.08,amb:"#BEC6D0",ambI:1.05,zenith:"#1A52B8",horizon:"#C4DAEE",haze:1e-4,exposure:.96,tint:"#ffffff",shadow:"#070b16",deep:"#1A417E",shallow:"#3EB282",night:!1,surge:.85},afternoon:{el:16,preset:"day",heroSun:"#FFE2C2",sun:"#FFE2C2",sunI:1.06,amb:"#A9A6D8",ambI:.98,zenith:"#2052AC",horizon:"#D6D2DC",haze:13e-5,exposure:1,tint:"#fff8f0",shadow:"#120c2a",deep:"#1A3B74",shallow:"#3AA27A",night:!1,surge:.78},night:{el:36,preset:"night",sun:"#B4C6F0",sunI:.7,amb:"#8090B8",ambI:.3,zenith:null,horizon:null,haze:12e-5,exposure:1.5,tint:"#e6eeff",shadow:"#04081a",deep:"#123676",shallow:"#3FA98C",night:!0,surge:.22}},ge=`
float wsH12(vec2 p){ vec3 q = fract(vec3(p.xyx)*0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y)*q.z); }
vec2 wsH22(vec2 p){ vec3 q = fract(vec3(p.xyx)*vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz)*q.zy); }
float wsVN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(wsH12(i), wsH12(i + vec2(1.0, 0.0)), f.x), mix(wsH12(i + vec2(0.0, 1.0)), wsH12(i + vec2(1.0, 1.0)), f.x), f.y); }
float wsH13(vec3 p){ p = fract(p*0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y)*p.z); }
float wsVN3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(mix(wsH13(i), wsH13(i + vec3(1,0,0)), f.x), mix(wsH13(i + vec3(0,1,0)), wsH13(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(wsH13(i + vec3(0,0,1)), wsH13(i + vec3(1,0,1)), f.x), mix(wsH13(i + vec3(0,1,1)), wsH13(i + vec3(1,1,1)), f.x), f.y), f.z); }
`,St=`
uniform vec4 uWA[18]; uniform vec4 uWB[18];
uniform float uSeaT, uSpacing, uR0, uRadius, uShoreDamp; uniform vec2 uSeaCam;
uniform sampler2D uDepthTex; uniform vec4 uDepthRect; uniform vec2 uShoal;
vec3 seaDisp(vec2 xz, out vec3 nrm){
  float r = length(xz - uSeaCam), sp = (r + uR0)*uSpacing;
  vec3 d = vec3(0.0); vec2 sl = vec2(0.0); float q = 0.0;
  for (int i = 0; i < 8; i++) { vec4 a = uWA[i], b = uWB[i];
    float f = smoothstep(2.0, 4.5, b.w/sp);
    float th = a.z*dot(a.xy, xz) - a.w*uSeaT + b.z; float c = cos(th), s = sin(th);
    d.xz += a.xy*(b.y*b.x*c*f); d.y += b.x*s*f; sl += a.xy*(a.z*b.x*c*f); q += b.y*a.z*b.x*s*f; }
  float k = 1.0 - smoothstep(0.3*uRadius, 0.8*uRadius, r);
  vec2 uv = (xz - uDepthRect.xy)*uDepthRect.zw; vec2 e = min(uv, 1.0 - uv); float sd = 1000.0;
  if (min(e.x, e.y) > 0.0) sd = mix(1000.0, texture2D(uDepthTex, uv).r/uShoal.x, smoothstep(0.0, 0.05, min(e.x, e.y)));
  k *= mix(uShoreDamp, 1.0, smoothstep(0.0, 1.0, sd));
  d *= k; nrm = normalize(vec3(-sl.x*k, 1.0 - q*k, -sl.y*k));
  return d;
}
`,Et=`
uniform float uRaftT, uStoneK;
float raftPathX(float z){ return 11.0*clamp(-z/80.0, 0.0, 1.0) - 26.0*clamp((-80.0 - z)/170.0, 0.0, 1.0) - 45.0*clamp((-250.0 - z)/150.0, 0.0, 1.0) - 50.0*clamp((-400.0 - z)/100.0, 0.0, 1.0) - 16.0*clamp((-500.0 - z)/77.0, 0.0, 1.0); }
float raftMask(vec2 xz){
  float ax = xz.x - raftPathX(xz.y) + 7.0*sin(xz.y*0.013);
  float band = (1.0 - smoothstep(20.0, 35.0, abs(ax)))*smoothstep(-650.0, -570.0, xz.y)*(1.0 - smoothstep(25.0, 60.0, xz.y));
  float rows = wsVN(vec2(ax*0.055 + 3.7, xz.y*0.007))*0.62 + wsVN(vec2(ax*0.17, xz.y*0.023 + 9.0))*0.38;
  return band*smoothstep(uRaftT, uRaftT + 0.1, rows);
}
`,We=`uniform vec3 uSun; uniform vec3 uSunCol; uniform vec3 uSkyCol;
`;function Sa(n,l){const C=n.uniforms;return{uWA:C.uWA,uWB:C.uWB,uSeaT:C.uTime,uSpacing:C.uSpacing,uR0:C.uR0,uRadius:C.uRadius,uShoreDamp:C.uShoreDamp,uSeaCam:{value:l},uDepthTex:C.uDepthTex,uDepthRect:C.uDepthRect,uShoal:C.uShoal,uStoneK:{value:1.04}}}const Ro=n=>11*de(-n/80,0,1)-26*de((-80-n)/170,0,1)-45*de((-250-n)/150,0,1)-50*de((-400-n)/100,0,1)-16*de((-500-n)/77,0,1),ho=`
float stoneAt(vec4 aP, out vec2 c, out vec3 d, out vec3 nrm){
  c = mod(aP.xy - uSeaCam + ${(W/2).toFixed(1)}, ${W.toFixed(1)}) - ${(W/2).toFixed(1)} + uSeaCam;
  d = seaDisp(c, nrm);
  return aP.z*step(aP.w*0.75 + 0.12, raftMask(c))*(1.0 - smoothstep(uStoneK, uStoneK + 0.04, aP.w))*(1.0 - smoothstep(${(W*.38).toFixed(1)}, ${(W*.49).toFixed(1)}, length(c - uSeaCam)));
}
`;async function za(n,l,C,G,V,B,U){const e=new t.Group;e.name="pumice";const ee=new t.ShaderMaterial({fog:!1,uniforms:{...G,...V,uRaftT:B},vertexShader:`
      attribute vec4 aP; attribute float aPit;
      varying vec3 vN; varying vec4 vC; varying vec3 vL;
      ${je}
      ${ge}
      ${St}
      ${Et}
      ${ho}
      void main(){
        vec2 c; vec3 d, nrm; float sc = stoneAt(aP, c, d, nrm);
        float ph = aP.w*61.0;
        // each stone rocks and bobs on its own as well as riding the swell
        vec3 up = normalize(nrm + vec3(sin(uSeaT*1.7 + ph), 0.0, cos(uSeaT*1.3 + ph*1.7))*0.16);
        vec3 fw = normalize(cross(vec3(cos(ph), 0.0, sin(ph)), up)); vec3 rt = cross(up, fw);
        vec3 q = position*sc;
        vec3 w = vec3(c.x + d.x, d.y + sc*(0.16 + 0.07*sin(uSeaT*2.3 + ph*3.0)), c.y + d.z) + rt*q.x + up*q.y + fw*q.z;
        vN = normalize(rt*normal.x + up*normal.y + fw*normal.z);
        vL = position*(1.0 + 2.0*aP.z) + ph;                       // bigger stones show more, finer pits
        vC = vec4(vec3(0.335, 0.34, 0.345)*(0.72 + 0.36*aPit)*(0.8 + 0.4*fract(aP.w*7.3)), position.y);
        vec4 mvPosition = viewMatrix*vec4(w, 1.0); gl_Position = projectionMatrix*mvPosition;
        ${Qe}
      }`,fragmentShader:`
      ${We}
      varying vec3 vN; varying vec4 vC; varying vec3 vL;
      ${Ke}
      ${ge}
      void main(){
        float fwL = fwidth(vL.x) + fwidth(vL.y) + fwidth(vL.z);
        float k1 = 1.0 - smoothstep(0.08, 0.3, fwL), k2 = 1.0 - smoothstep(0.03, 0.12, fwL);
        float p1 = wsVN3(vL*5.5), p2 = wsVN3(vL*13.0 + 7.0);
        // vesicles: dark pits, coarse and fine, melting into an average tone with distance
        float pit = 1.0 - k1*0.5*smoothstep(0.52, 0.74, p1) - k2*0.3*smoothstep(0.5, 0.72, p2);
        vec3 N = normalize(vN + (vec3(p1, p2, wsVN3(vL*5.5 + 31.0)) - 0.5)*(0.5*k1));
        float ndl = dot(N, uSun);
        // the wet waterline: dark below, a thin bright lick of water right at it
        float wl = vC.w + (p1 - 0.5)*0.14;
        float wet = 1.0 - smoothstep(-0.2, -0.02, wl);
        vec3 alb = vC.rgb*pit*mix(1.0, 0.34, wet);
        vec3 col = alb*(uSunCol*smoothstep(-0.1, 0.55, ndl)*0.98 + uSkyCol*(0.34 + 0.24*N.y));
        col += uSkyCol*0.1*wet*pow(max(1.0 - abs(N.y), 0.0), 2.0);
        gl_FragColor = vec4(col, 1.0);
        ${Xe}
      }`}),A=[];for(let z=0;z<5;z++){const te=z>=3,Z=z===2;let F=new t.IcosahedronGeometry(1,te?2:Z?0:1);F.deleteAttribute("uv"),F.deleteAttribute("normal"),F=la(F,1e-4);const a=F.attributes.position,p=a.count,y=l.range(.8,1.25),k=l.range(.5,.75),u=l.range(.8,1.2),c=l.range(0,50),v=new Float32Array(p);for(let I=0;I<p;I++){const b=a.getX(I),T=a.getY(I),g=a.getZ(I),$=Math.sin(b*3.1+c)*Math.sin(T*2.7+c*1.3)*Math.sin(g*3.4-c),ae=Math.sin(b*7.3-c)*Math.sin(g*6.1+T*5+c),P=.78+.2*$+(te?.09:.06)*ae;a.setXYZ(I,b*P*y,T*P*k,g*P*u),v[I]=.5+.5*ae+.3*$}F.computeVertexNormals();const s=Math.floor(te?C*.05:Z?C*.6:C*.15),x=new Float32Array(s*4);for(let I=0;I<s;I++)x[I*4]=l.range(0,W),x[I*4+1]=l.range(0,W),x[I*4+2]=te?l.range(.45,.8):Z?l.range(.07,.17):l.range(.14,.36),x[I*4+3]=l();{const I=Array.from({length:s},(T,g)=>g).sort((T,g)=>x[T*4+3]-x[g*4+3]),b=x.slice();for(let T=0;T<s;T++){const g=I[T]*4;x[T*4]=b[g],x[T*4+1]=b[g+1],x[T*4+2]=b[g+2],x[T*4+3]=b[g+3],A.push(b[g],b[g+1],b[g+2],b[g+3])}}const E=new t.InstancedBufferGeometry;E.index=F.index,E.setAttribute("position",F.attributes.position),E.setAttribute("normal",F.attributes.normal),E.setAttribute("aPit",new t.BufferAttribute(v,1)),E.setAttribute("aP",new t.InstancedBufferAttribute(x,4)),E.instanceCount=s,E.boundingSphere=new t.Sphere(new t.Vector3,1e5);const M=new t.Mesh(E,ee);M.frustumCulled=!1,M.userData.full=s,e.add(M),await n.yield()}const O=new t.PlaneGeometry(2,2);O.deleteAttribute("normal"),O.deleteAttribute("uv");const H=new t.InstancedBufferGeometry;H.index=O.index,H.setAttribute("position",O.attributes.position),H.setAttribute("aP",new t.InstancedBufferAttribute(new Float32Array(A),4)),H.instanceCount=A.length/4,H.boundingSphere=new t.Sphere(new t.Vector3,1e5);const h=new t.Mesh(H,new t.ShaderMaterial({fog:!1,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-3,uniforms:{...G,...V,uRaftT:B},vertexShader:`
      attribute vec4 aP; varying vec3 vQ;
      ${je}
      ${ge}
      ${St}
      ${Et}
      ${ho}
      void main(){
        vec2 c; vec3 d, nrm; float sc = stoneAt(aP, c, d, nrm);
        vec3 fw = normalize(cross(vec3(1.0, 0.0, 0.0), nrm)); vec3 rt = cross(nrm, fw);
        float R = sc*2.3;
        vec3 w = vec3(c.x + d.x, d.y + 0.045, c.y + d.z) + (rt*position.x + fw*position.y)*R;
        vQ = vec3(position.xy, aP.w*53.0);
        vec4 mvPosition = viewMatrix*vec4(w, 1.0); gl_Position = projectionMatrix*mvPosition;
        ${Qe}
      }`,fragmentShader:`
      ${We}
      uniform float uSeaT;
      varying vec3 vQ;
      ${Ke}
      ${ge}
      void main(){
        float r = length(vQ.xy);
        float n = wsVN(vQ.xy*4.2 + vQ.z + vec2(uSeaT*0.15, 0.0))*0.6 + wsVN(vQ.xy*10.0 - vQ.z)*0.4;
        float ring = smoothstep(0.26, 0.4, r)*(1.0 - smoothstep(0.42, 0.98, r + (n - 0.5)*0.5));
        float lace = smoothstep(0.3, 0.62, n + 0.5*(1.0 - smoothstep(0.38, 0.6, r)));
        float a = ring*lace*(0.8 + 0.2*sin(uSeaT*1.9 + vQ.z))*0.85;
        if (a < 0.01) discard;
        gl_FragColor = vec4(vec3(0.82, 0.86, 0.88)*(uSunCol*0.62 + uSkyCol*0.42), a);
        ${Xe}
      }`}));h.name="stoneFoam",h.frustumCulled=!1,h.renderOrder=2,e.add(h),await n.yield();const j=[];for(let z=0;z<A.length/4&&j.length<208;z++)A[z*4+2]>.24&&j.push(A[z*4],A[z*4+1],A[z*4+2],A[z*4+3]);const le=await ka(n,A,j,U,G,B,e.children.filter(z=>z.userData.full>0).map(z=>z.userData.full)),X=new t.InstancedBufferGeometry;X.index=O.index,X.setAttribute("position",O.attributes.position),X.setAttribute("aP",new t.InstancedBufferAttribute(new Float32Array(j),4)),X.instanceCount=j.length/4,X.boundingSphere=new t.Sphere(new t.Vector3,1e5),X.setAttribute("aW",new t.InstancedBufferAttribute(Float32Array.from({length:j.length/4},(z,te)=>te),1));const N=new t.Mesh(X,new t.ShaderMaterial({fog:!1,transparent:!0,depthWrite:!1,uniforms:{...G,...V,uRaftT:B,uDeal:{value:le.table},uDealK:{value:le.cells}},vertexShader:`
      attribute vec4 aP; attribute float aW; varying vec3 vQ;
      uniform highp sampler2D uDeal; uniform vec4 uDealK;      // the wisps' deal; uDealK: the table's first repeat of the box (x, z) and how many it holds each way
      ${je}
      ${ge}
      ${St}
      ${Et}
      ${ho}
      void main(){
        vec2 c; vec3 d, nrm; float sc = stoneAt(aP, c, d, nrm);
        // THE DEAL, read by place. k0: which repeat of the box the wisp's own stone stands in at c. A wisp dealt to a second stone can stand up to half a box
        // from its own, so the eight repeats round that one are read too: of the wisps of this number that are dealt (and whose own stone stands in its
        // repeat by the raft's mask, as live asks), the one whose second stone is nearest the box's middle is drawn, there, by that stone's own scale (the
        // stones' law of STONE_GLSL at that place: the raft's mask, the surge's hiding, the box's edge), so it comes and goes with its stone as live's do.
        // A wisp that is not dealt and is drawn by live (sc at least 1e-4) is left as the line above made it: nothing below touches it.
        vec2 k0 = floor((c - aP.xy)/${W.toFixed(1)} + 0.5) - uDealK.xy, cb = c; vec4 t0 = vec4(0.0), tb = vec4(0.0); float rb = 1e9;
        for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
          vec2 g = vec2(float(i), float(j)), kk = k0 + g, p = c + g*${W.toFixed(1)};
          if (kk.x < 0.0 || kk.y < 0.0 || kk.x >= uDealK.z || kk.y >= uDealK.w) continue;
          vec4 t = texelFetch(uDeal, ivec2(int(aW + 0.5), int(kk.y*uDealK.z + kk.x + 0.5)), 0);
          if (t.z == 0.0 || raftMask(p) < aP.w*0.75 + 0.12) continue;      // not dealt there, or its own stone does not stand there: no wisp of that repeat is moved
          if (i == 0 && j == 0) t0 = t;
          if (t.z < 0.0) continue;                                          // (dealt to no stone: see dealWisps)
          float r = length(p + t.xy - uSeaCam);
          if (r < rb) { rb = r; tb = t; cb = p + t.xy; }
        }
        if (tb.z > 0.0 && (t0.z != 0.0 || sc < 1e-4)) {
          c = cb; d = seaDisp(c, nrm);
          sc = tb.z*step(tb.w*0.75 + 0.12, raftMask(c))*(1.0 - smoothstep(uStoneK, uStoneK + 0.04, tb.w))*(1.0 - smoothstep(${(W*.38).toFixed(1)}, ${(W*.49).toFixed(1)}, rb));
        } else if (t0.z != 0.0) sc = 0.0;
        float on = step(1e-4, sc), h = 0.8 + 1.4*fract(aP.w*13.7);
        vec3 base = vec3(c.x + d.x, d.y + sc*0.5, c.y + d.z);
        vec3 toCam = cameraPosition - base; vec3 right = cross(vec3(0.0, 1.0, 0.0), toCam); right = right/max(length(right), 1e-3);
        float yy = position.y*0.5 + 0.5;
        vec3 w = base + right*(position.x*h*0.6*on) + vec3(0.8, 0.0, -0.6)*(yy*yy*h*0.7) + vec3(0.0, yy*h*on, 0.0);
        vQ = vec3(position.xy, aP.w*91.0);
        vec4 mvPosition = viewMatrix*vec4(w, 1.0); gl_Position = projectionMatrix*mvPosition;
        ${Qe}
      }`,fragmentShader:`
      ${We}
      uniform float uSeaT;
      varying vec3 vQ;
      ${Ke}
      ${ge}
      void main(){
        float yy = vQ.y*0.5 + 0.5, sd = vQ.z;
        float sway = (wsVN(vec2(yy*2.6 - uSeaT*0.7 + sd, sd)) - 0.5)*1.5*yy;
        float wd = mix(0.24, 0.92, yy);
        float body = 1.0 - smoothstep(wd*0.12, wd, abs(vQ.x - sway));
        float tex = wsVN(vec2((vQ.x - sway)*3.0 + sd, yy*4.0 - uSeaT*1.3 + sd));
        float a = body*smoothstep(0.3, 0.8, tex + 0.3*(1.0 - yy))*smoothstep(0.0, 0.15, yy)*(1.0 - smoothstep(0.3, 1.0, yy))*0.5;
        if (a < 0.01) discard;
        gl_FragColor = vec4(vec3(0.84, 0.85, 0.86)*(uSunCol*0.6 + uSkyCol*0.45), a);
        ${Xe}
      }`}));return N.name="stoneSteam",N.frustumCulled=!1,N.renderOrder=3,e.add(N),e}async function ka(n,l,C,G,V,B,U){const e=Math.fround,ee=C.length/4,A=l.length/4,O=2+.05,H=.02,h=o=>e(o-Math.floor(o)),j=o=>Math.min(1,Math.max(0,o)),le=e(.1031),X=e(33.33),N=e(B.value),z=(o,m,f)=>{const w=e(j(e(e(f-o)/e(m-o))));return e(e(w*w)*e(3-e(2*w)))},te=(o,m,f)=>e(e(o*e(1-f))+e(m*f)),Z=(o,m)=>{let f=h(e(o*le)),w=h(e(m*le)),D=f;const S=e(e(e(f*e(w+X))+e(w*e(D+X)))+e(D*e(f+X)));return f=e(f+S),w=e(w+S),D=e(D+S),h(e(e(f+w)*D))},F=(o,m)=>{o=e(o),m=e(m);const f=Math.floor(o),w=Math.floor(m);let D=h(o),S=h(m);return D=e(e(D*D)*e(3-e(2*D))),S=e(e(S*S)*e(3-e(2*S))),te(te(Z(f,w),Z(f+1,w),D),te(Z(f,w+1),Z(f+1,w+1),D),S)},a=o=>e(e(e(e(e(11*e(j(e(-o/80))))-e(26*e(j(e(e(-80-o)/170)))))-e(45*e(j(e(e(-250-o)/150)))))-e(50*e(j(e(e(-400-o)/100)))))-e(16*e(j(e(e(-500-o)/77))))),p={band:0,mask:0},y=(o,m)=>{o=e(o),m=e(m);const f=e(e(o-a(m))+e(7*e(Math.sin(e(m*e(.013))))));p.band=e(e(e(1-z(20,35,Math.abs(f)))*z(-650,-570,m))*e(1-z(25,60,m)));const w=e(e(F(e(e(f*e(.055))+e(3.7)),e(m*e(.007)))*e(.62))+e(F(e(f*e(.17)),e(e(m*e(.023))+9))*e(.38)));return p.mask=e(p.band*z(N,e(N+e(.1)),w)),p},k=o=>e(e(o*e(.75))+e(.12)),u=64,c=new Float64Array(u),v=new Float64Array(u),s=new Float64Array(u),x=new Float64Array(u);let E=0;for(let o=0;o<u;o++){const m=o*2*Math.PI/u,f=Math.cos(m),w=Math.sin(m);let D=0;for(let S=0;S<8;S++)D+=Math.abs(V.uWB.value[S].y*V.uWB.value[S].x*(V.uWA.value[S].x*f+V.uWA.value[S].y*w));c[o]=f,v[o]=w,s[o]=D,x[o]=Math.max(0,.7*(.8*f-.6*w)),E=Math.max(E,D)}const M=V.uDepthTex.value.image,I=V.uDepthRect.value,b=M.width,T=t.DataUtils.fromHalfFloat,g=(o,m)=>{const f=(o-I.x)*I.z,w=(m-I.y)*I.w;if(Math.min(f,1-f,w,1-w)<.05)return 1;const D=Math.floor(w*b-.5)*b+Math.floor(f*b-.5),S=Math.max(T(M.data[D]),T(M.data[D+1]),T(M.data[D+b]),T(M.data[D+b+1]));return it(V.uShoreDamp.value,1,R(0,1,S/V.uShoal.value.x))},$=Math.floor((G.length+96)/.5)+1,ae=new Float64Array($),P=new Float64Array($),Q=new Map,ke=8,Ne=E+(.7+.6)*2.2+O,Ze=Math.ceil(Ne/ke),fe=new t.Vector3,rt=new Map;for(let o=0;o<$;o++){G.posAtDist(o*.5-96,fe),ae[o]=fe.x,P[o]=fe.z;const m=Math.floor(fe.z/ke);Q.has(m)||Q.set(m,[]),Q.get(m).push(o);for(let f=Math.floor((fe.z-Ne)/W);f<=Math.floor((fe.z+Ne)/W);f++)for(let w=Math.floor((fe.x-Ne)/W);w<=Math.floor((fe.x+Ne)/W);w++)rt.set(f*4096+w,[w,f])}const Re=(o,m,f)=>{const w=O+.6*f,D=Math.floor(m/ke);let S=-1,se=w+E+.7*f;for(let ue=0;ue<=2*Ze;ue++){const tt=Q.get(D+(ue&1?ue+1>>1:-(ue>>1)));if(tt)for(let Be=0;Be<tt.length;Be++){const Ge=tt[Be],be=ae[Ge]-o,oe=P[Ge]-m,Pe=be*be+oe*oe;if(Pe>=se*se)continue;if(Pe<w*w)return!1;if(S<0&&(S=g(o,m),se=w+S*E+.7*f,Pe>=se*se))continue;let Me=-1e9;for(let ve=0;ve<u;ve++){const ne=be*c[ve]+oe*v[ve]-S*s[ve]-f*x[ve];ne>Me&&(Me=ne)}if(Me<w)return!1}}return!0};await n.yield();const lt=new Uint8Array(A);for(let o=0,m=0;o<A&&m<ee;o++)l[o*4+2]>.24&&(lt[o]=1,m++);const zt=new Uint8Array(A);for(let o=0,m=0;o<U.length;o++)for(let f=0;f<U[o]&&m<A;f++,m++)zt[m]=f+1<U[o]*(e(l[m*4+3])+.12-.04)?1:0;const ct=[[],[]];for(let o=0;o<A;o++)!lt[o]&&zt[o]&&ct[l[o*4+2]>.24?0:1].push(o);const qe=new Map,Ye=(o,m)=>{const f=e(l[o])-e(C[m]);return f-W*Math.round(f/W)},he=(o,m)=>{let f=qe.get(o*2+m);if(f)return f;const w=ct[m],D=new Float64Array(w.length);for(let S=0;S<w.length;S++){const se=Ye(w[S]*4,o*4),ue=Ye(w[S]*4+1,o*4+1);D[S]=se*se+ue*ue}return f=Uint16Array.from(w.keys()).sort((S,se)=>D[S]-D[se]||S-se).map(S=>w[S]),qe.set(o*2+m,f),f},Ie=new Set,me=[];let Fe=1e9,$e=-1e9,Ee=1e9,Ue=-1e9,kt=1e9;for(const[o,m]of[...rt.keys()].sort((f,w)=>f-w).map(f=>rt.get(f))){m!==kt&&(kt=m,await n.yield());for(let f=0;f<ee;f++){const w=e(C[f*4])+W*o,D=e(C[f*4+1])+W*m,S=e(C[f*4+3]),se=e(e(.8)+e(e(1.4)*h(e(S*e(13.7)))));if(Re(w,D,se)||y(w,D).band<k(S)-H)continue;let ue=0,tt=0,Be=-1,Ge=0;if(p.mask>=k(S)-H)for(let be=0;be<2&&Be<0;be++)for(const oe of he(f,be)){const Pe=Ye(oe*4,f*4),Me=Ye(oe*4+1,f*4+1),ve=w+Pe,ne=D+Me,ot=(oe*64+Math.round((ve-e(l[oe*4]))/W)+32)*64+Math.round((ne-e(l[oe*4+1]))/W)+32;if(!(Ie.has(ot)||y(ve,ne).mask<k(e(l[oe*4+3]))+H||!Re(ve,ne,se))){Ie.add(ot),ue=Pe,tt=Me,Be=l[oe*4+2],Ge=l[oe*4+3];break}}me.push(o,m,f,ue,tt,Be,Ge),Fe=Math.min(Fe,o),$e=Math.max($e,o),Ee=Math.min(Ee,m),Ue=Math.max(Ue,m)}}const pe=me.length?$e-Fe+1:0,xe=me.length?Ue-Ee+1:0,Je=new Float32Array(Math.max(1,ee)*Math.max(1,pe*xe)*4);for(let o=0;o<me.length;o+=7)for(let m=0;m<4;m++)Je[(((me[o+1]-Ee)*pe+me[o]-Fe)*ee+me[o+2])*4+m]=me[o+3+m];const et=new t.DataTexture(Je,Math.max(1,ee),Math.max(1,pe*xe),t.RGBAFormat,t.FloatType);return et.needsUpdate=!0,{table:et,cells:new t.Vector4(pe?Fe:0,xe?Ee:0,pe,xe)}}function Ma(n,l,C,G,V){const e=new Float32Array(15249),ee=[];for(let a=0,p=0;a<=220;a++){const y=60-a*3.190909090909091,k=Ro(y)-7*Math.sin(y*.013);for(let u=0;u<=22;u++,p++)e[p*3]=k+(u/22-.5)*84,e[p*3+1]=0,e[p*3+2]=y}for(let a=0;a<220;a++)for(let p=0;p<22;p++){const y=a*23+p,k=y+22+1;ee.push(y,k,y+1,y+1,k,k+1)}const A=new t.BufferGeometry;A.setAttribute("position",new t.BufferAttribute(e,3)),A.setIndex(ee),A.boundingSphere=new t.Sphere(new t.Vector3(-60,0,-300),420);const O=a=>{a.sort((y,k)=>y[0]-k[0]||y[1]-k[1]);const p=[];for(let y=0,k=0;y<2;y++,k=p.length,a.reverse()){for(const u of a){for(;p.length-k>=2;){const c=p[p.length-2],v=p[p.length-1];if((v[0]-c[0])*(u[1]-c[1])-(v[1]-c[1])*(u[0]-c[0])<=0)p.pop();else break}p.push(u)}p.pop()}return p},H=a=>{let p=0;for(let y=0;y<a.length;y++){const k=a[y],u=a[(y+1)%a.length];p+=k[0]*u[1]-u[0]*k[1]}return Math.abs(p)/2},h=(a,p)=>{const y=[];for(let k=0;k<a.length;k++){const u=a[k],c=a[(k+1)%a.length],v=u[1]>=p,s=c[1]>=p;if(v&&y.push(u),v!==s){const x=(p-u[1])/(c[1]-u[1]);y.push([u[0]+(c[0]-u[0])*x,p])}}return y},j=-.16,le=V.map(a=>{const p=a.geometry.attributes.position,y=p.count,k=Array.from({length:y},(P,Q)=>[p.getX(Q),p.getY(Q),p.getZ(Q)]);let u=0,c=0,v=0;for(const P of k)u=Math.max(u,Math.abs(P[0])),c=Math.max(c,Math.abs(P[2]));const s=H(O(k.map(P=>[P[0],P[2]])));for(let P=0;P<8;P++){const Q=P*Math.PI/8,ke=Math.cos(Q),Ne=Math.sin(Q);v+=H(h(O(k.map(Ze=>[Ze[0]*ke+Ze[2]*Ne,Ze[1]])),j))/8}const x=Math.sqrt(s/Math.PI),E=x*Math.sqrt(u/c),M=x*Math.sqrt(c/u),I=P=>{const Q=Math.min(1,-j/P);return x*P*(Math.PI-Math.acos(Q)+Q*Math.sqrt(1-Q*Q))};let b=.05,T=3;for(let P=0;P<40;P++){const Q=(b+T)/2;I(Q)<v?b=Q:T=Q}const g=a.geometry.attributes.aP.array,$=a.userData.full;let ae=0;for(let P=0;P<$;P++)ae+=g[P*4+2]*g[P*4+2];return{plan:s,side:v,ax:E,ay:(b+T)/2,az:M,n:$,e2:ae}}),X=[[[2,2],.07,.17,1,.6],[[0,1],.14,.36,2,1.9],[[3,4],.45,.8,3,2.9]].map(([a,p,y,k,u])=>{const c=le[a[0]],v=le[a[1]],s=a[0]===a[1]?c.n:c.n+v.n,x=a[0]===a[1]?c.e2:c.e2+v.e2,E=W/Math.sqrt(Math.max(s,1)),M=(p+y)/2,I=Math.max(c.ax,c.az,v.ax,v.az),b=.16+Math.max(c.ay,v.ay),T=(b+.27)*y/((k*1.1+.64)*E-I*y);return{C:E,s0:p,s1:y,steps:k,turn:u,tau:x/(W*W),sm:M,tmin:T,A:c,B:v,wide:I,top:b,planM:(c.plan+v.plan)/2,sideM:(c.side+v.side)/2,deep:c.ax+c.az+v.ax+v.az}}),N=a=>{const p=String(+a.toFixed(5));return p.includes(".")?p:p+".0"},z=a=>`vec3(${N(a.ax)}, ${N(a.ay)}, ${N(a.az)})`,te=(a,p)=>`
        { float kk = smoothstep(1.0, 2.5, ${N(a.sm)}*(${N(a.deep/2)}*tn + ${N(a.top)}*min(1.0, tn/${N(a.tmin)}))/fShort)*grow, tau = S*G2*${N(a.tau)};
          float cov = 1.0 - exp(-tau*(${N(a.planM)} + ${N(a.sideM)}/tnM)); vec4 L = vec4(0.0);
          if (kk > 0.003) L = rfKind(vXZ, e, max(tn, ${N(a.tmin)}), ${N(a.C)}, ${N(a.s0)}, ${N(a.s1)}, ${z(a.A)}, ${z(a.B)}, ${N(a.wide)}, ${N(17+24*p)}, ${a.steps}, vec2(${N(Math.cos(a.turn))}, ${N(Math.sin(a.turn))}), fShort, Ns);
          // (the stones further along the sight line than the steps reach, whose tops it still passes through: their mean, behind the lumps)
          float rest = (1.0 - L.a)*(1.0 - exp(-tau*${N(a.sideM)}*max(1.0/tn - ${N(1/a.tmin)}, 0.0)));
          stone = stone + mix(meanCol*cov, L.rgb*L.a + meanCol*rest, kk)*(1.0 - A); A = A + mix(cov, L.a + rest, kk)*(1.0 - A); }`,Z=new t.ShaderMaterial({fog:!1,transparent:!0,depthWrite:!1,side:t.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-2,uniforms:{...n,...l,uRaftT:C,uAmp:G.uAmp,uContrast:G.uContrast},vertexShader:`
      uniform float uAmp;
      varying vec2 vXZ; varying vec3 vNs; varying vec3 vW; varying float vH;
      ${je}
      ${St}
      void main(){
        vec3 nrm; vec3 d = seaDisp(position.xz, nrm);
        float dist = length(position.xz - uSeaCam);
        vec3 w = vec3(position.x + d.x, d.y + 0.05 + dist*0.0016, position.z + d.z);
        vXZ = position.xz; vNs = nrm; vW = w; vH = d.y/uAmp;      // (vH: the sea's own measure of crest and trough, as its shader has it)
        vec4 mvPosition = viewMatrix*vec4(w, 1.0); gl_Position = projectionMatrix*mvPosition;
        ${Qe}
      }`,fragmentShader:`
      ${We}
      uniform float uSeaT, uContrast; uniform vec2 uSeaCam; uniform vec4 uWA[18]; uniform vec4 uWB[18];
      varying vec2 vXZ; varying vec3 vNs; varying vec3 vW; varying float vH;
      ${Ke}
      ${ge}
      ${Et}
      // LOBE: how far a lump's faces turn from a smooth lump's (the real stones are lobed). BULGE: along a low sight line the real stones show their bulges,
      // which are their pale parts (it reads the sight line's rise: the head's 5). Both set by count so that the lumps' mean tone is the real stones' from eyes 2 to 30 m up (within 1 in 100)
      const float LOBE = 0.45, BULGE = 0.23;
      const float TOP = ${N(X[2].planM)}, SIDE = ${N(X[2].sideM)};      // the big stones' mean plan area and side area over the water, in sizes squared: they weigh the mean of the faces a low eye sees (law 3)
      // THE SEA'S OWN SLOPE AT A PIXEL, as the sea's own shader works it for its light (kit/water.js, OCEAN_FRAG: its eight waves that move the surface,
      // each fading as the pixel's footprint nears its length, the shorter ones bent and grouped by the sea's own two noises): the same waves, phase and
      // clock as the water beside the stones, so the mean of the stones is lit and hidden by the swell the eye sees there. Left out: the kit's ripple
      // trains (its waves 9 to 18), its micro ripples and its gloss (the roughness it gathers from what it fades). foot: the kit's own capped measure of
      // the footprint, handed by main (see the head)
      const mat2 RF1 = mat2(0.7986, 0.6018, -0.6018, 0.7986), RF2 = mat2(-0.3256, 0.9455, -0.9455, -0.3256);
      vec3 seaNrm(vec2 xz, float foot){
        vec2 wq = vec2(wsVN(RF2*xz*0.05 + uSeaT*0.03), wsVN(RF1*xz*0.14 - uSeaT*0.05)) - 0.5;
        float gust = 0.5 + wsVN(xz*0.0065 + uSeaT*0.012) + 0.4*(wq.x + 0.5);
        vec2 slope = vec2(0.0); float q = 0.0;
        for (int i = 0; i < 8; i++) { vec4 a = uWA[i], b = uWB[i];
          float ka = a.z*b.x, f0 = smoothstep(1.2, 4.0, b.w/foot), g = 1.0;
          if (f0 <= 0.0) continue;
          float th = a.z*dot(a.xy, xz) - a.w*uSeaT + b.z;
          int m3 = i - (i/3)*3; float e = m3 == 0 ? wq.x : m3 == 1 ? wq.y : -wq.x - wq.y;
          if (i >= 3) { float sm = smoothstep(16.0, 6.0, b.w);
            th += ((i & 1) == 0 ? wq.x : wq.y)*mix(1.2, 5.0, sm); g *= clamp(1.0 + mix(1.9, 3.4, sm)*e, mix(0.3, 0.08, sm), 2.0)*mix(1.0, smoothstep(0.55, 1.5, gust)*1.5, sm); }
          float c = cos(th), s = sin(th), f = f0*g;
          slope += a.xy*(ka*c*f); q += b.y*ka*f*s; }
        return normalize(vec3(-slope.x, 1.0 - q, -slope.y));
      }
      // four numbers of a cell: xy where its stone lies in it, z the stone's number (what it stands by, turns by, is toned by), w its size
      vec4 rfH(vec2 p){ vec4 q = fract(p.xyxy*vec4(0.1031, 0.1030, 0.0973, 0.1099)); q += dot(q, q.wzxy + 33.33); return fract((q.xxyz + q.yzzw)*q.zywx); }
      // ONE KIND OF STONE: the lump the sight line from p meets first (law 1), lit; rgb its colour, a its cover of the pixel.
      // p: the pixel's sea point; e: the sight line's heading in plan, away from the eye; tn: its rise a metre; C: the kind's cell; s0, s1: its sizes;
      // salt: the kind's own cells; rot: the turn of its cells (each kind's grid lies its own way); pix: the footprint's short axis; upv: the sea's normal
      vec4 rfKind(vec2 p, vec2 e, float tn, float C, float s0, float s1, vec3 axA, vec3 axB, float wide, float salt, int steps, vec2 rot, float pix, vec3 upv){
        vec2 pr = vec2(rot.x*p.x + rot.y*p.y, rot.x*p.y - rot.y*p.x), er = vec2(rot.x*e.x + rot.y*e.y, rot.x*e.y - rot.y*e.x);
        float bt = -1.0, bc = 0.0, bw = 0.0, bsc = 1.0; vec3 bh = vec3(0.0, 1.0, 0.0), bax = vec3(1.0); vec2 bcs = vec2(1.0, 0.0);
        for (int j = 0; j <= steps; j++) {
          vec2 i0 = floor((pr - er*(float(j)*1.1*C))/C - 0.5);
          for (int n = 0; n < 4; n++) {
            vec2 g = i0 + vec2(float(n & 1), float(n >> 1)); vec4 h = rfH(g + salt);
            vec2 cr = (g + 0.5 + (h.xy - 0.5)*0.72)*C, c = vec2(rot.x*cr.x - rot.y*cr.y, rot.x*cr.y + rot.y*cr.x);
            // law 4: the real stone's own scale at that place, and the sheet's stone grown to the rest of the area
            float q0 = 1.0 - smoothstep(${(W*.38).toFixed(1)}, ${(W*.49).toFixed(1)}, length(c - uSeaCam));
            float sc = mix(s0, s1, h.w)*sqrt(max(1.0 - q0*q0, 0.0));
            if (sc < 0.002) continue;
            vec2 d = p - c;
            if (abs(d.x*e.y - d.y*e.x) > wide*sc + pix) continue;      // (wide: the kind's greatest half width: the sight line passes it by)
            float ph = h.z*61.0, cs = cos(ph), sn = sin(ph);
            vec2 rk = vec2(sin(uSeaT*1.7 + ph), cos(uSeaT*1.3 + ph*1.7))*0.16;      // rocking, by the real stone's own line
            // the lump: one of the kind's two shapes by its number (half of each, as the real stones are dealt), turned by its number, its middle 0.16 of its size over the water and bobbing
            vec3 ax = (fract(h.z*17.3) < 0.5 ? axA : axB)*sc;
            vec3 o = vec3(cs*d.x + sn*d.y, dot(rk, d) - sc*(0.16 + 0.07*sin(uSeaT*2.3 + ph*3.0)), cs*d.y - sn*d.x)/ax, dir = vec3(-(cs*e.x + sn*e.y), tn - dot(rk, e), -(cs*e.y - sn*e.x))/ax;
            float a = dot(dir, dir), b = dot(o, dir), oo = dot(o, o), dm = sqrt(max(oo - b*b/a, 0.0));
            float t = (-b + sqrt(max(b*b - a*(oo - 1.0), 0.0)))/a;
            float edge = (1.0 - dm)*min(ax.x, ax.z)/max(pix, 1e-4) + 0.5;      // the lump's rim, one pixel soft
            if (edge <= 0.0 || t < 0.0 || t <= bt) continue;
            if (raftMask(c) < h.z*0.75 + 0.12) continue;      // the real stones' rule, at the stone's own place
            bt = t; bc = min(edge, 1.0); bh = o + dir*t; bax = ax; bw = h.z; bsc = sc; bcs = vec2(cs, sn);
          }
        }
        if (bt < 0.0) return vec4(0.0);
        // lit as the real stone is: its normal (turned back, on the rocking sea), its mottle, its wet waterline
        float ph = bw*61.0, o1 = bw*50.0;
        vec3 nl = (bh + LOBE*sin(bh.yzx*4.1 + o1)*cos(bh.zxy*3.3 - o1))/bax;      // (the real stone is lobed: its faces turn more ways than a smooth lump's)
        vec3 up = normalize(upv + vec3(sin(uSeaT*1.7 + ph), 0.0, cos(uSeaT*1.3 + ph*1.7))*0.16);
        vec3 N = normalize(vec3(bcs.x*nl.x - bcs.y*nl.z, 0.0, bcs.y*nl.x + bcs.x*nl.z) + up*nl.y);
        float h1 = sin(bh.x*3.1 + o1)*sin(bh.y*2.7 + o1*1.3)*sin(bh.z*3.4 - o1), h2 = sin(bh.x*7.3 - o1)*sin(bh.z*6.1 + bh.y*5.0 + o1);
        float wet = 1.0 - smoothstep(-0.2, -0.02, bh.y*bax.y/bsc), ndl = dot(N, uSun);
        float pitM = 1.0 - 0.14*(1.0 - smoothstep(0.08, 0.3, 2.0*pix*(1.0 + 2.0*bsc)/bsc));      // the real stone's coarse pits, in the mean, melting by the footprint as its own do (the head's 6)
        vec3 alb = vec3(0.335, 0.34, 0.345)*(0.9 + 0.18*h2 + 0.108*h1)*(0.8 + 0.4*fract(bw*7.3))*mix(1.0, 0.34, wet)*pitM*(1.0 + BULGE*(1.0 - bh.y*bh.y)/(1.0 + 3.0*tn));
        vec3 col = alb*(uSunCol*smoothstep(-0.1, 0.55, ndl)*0.98 + uSkyCol*(0.34 + 0.24*N.y)) + uSkyCol*0.1*wet*pow(max(1.0 - abs(N.y), 0.0), 2.0);
        return vec4(col, bc);
      }
      void main(){
        vec3 Ns = normalize(vNs), toE = cameraPosition - vW; float dist = length(toE); vec3 V = toE/max(dist, 1e-3);
        // law 1: the sight line's rise over the sea's own surface here (never under 0.004: a face turned from the eye is all stone)
        float sn = clamp(dot(V, Ns), 0.004, 0.999), tn = sn/sqrt(1.0 - sn*sn);
        vec2 e = vW.xz - cameraPosition.xz; e = e/max(length(e), 1e-3);
        // law 2: the pixel's footprint on the sea, its long and its short axis
        vec2 dx = dFdx(vXZ), dy = dFdy(vXZ); float fa = dot(dx, dx), fb = dot(dy, dy), fc = dot(dx, dy);
        float fLong = sqrt(max(0.5*(fa + fb + sqrt((fa - fb)*(fa - fb) + 4.0*fc*fc)), 1e-10)), fShort = abs(dx.x*dy.y - dx.y*dy.x)/fLong;
        float m = raftMask(vXZ), S = clamp((m - 0.12)/0.75, 0.0, 1.0);      // the share of the stones that stands here, by the real stones' rule
        // law 4, for the mean: the area the sheet's stones have here
        float q0 = 1.0 - smoothstep(${(W*.38).toFixed(1)}, ${(W*.49).toFixed(1)}, length(vXZ - uSeaCam)), G2 = 1.0 - q0*q0, grow = step(0.0005, G2);
        // law 3: the sight line's rise over the sea's own slope at the pixel; the mean tone (see the head). The footprint handed to seaNrm is the kit
        // ocean's own line: the pixel's width at that distance (the short axis) over the sight line's fall, the fall never taken under 0.03
        vec3 Nf = seaNrm(vXZ, fShort/max(abs(V.y), 0.03)); float snM = clamp(dot(V, Nf), 0.004, 0.999), tnM = snM/sqrt(1.0 - snM*snM);
        vec3 side = normalize(vec3(V.x, 0.0, V.z)*0.67 + Nf*0.42), Nm = normalize(Nf*(TOP*snM) + side*SIDE);
        float sunM = smoothstep(-0.1, 0.55, dot(Nm, uSun))*0.98*clamp(dot(Nf, uSun)/max(uSun.y, 0.2), 0.4, 1.6);
        vec3 meanCol = vec3(0.335, 0.34, 0.345)*0.76*(uSunCol*sunM + uSkyCol*(0.34 + 0.24*Nm.y))*mix(1.0, 0.5 + 0.5*smoothstep(-1.0, 0.25, vH), uContrast);
        vec3 stone = vec3(0.0); float A = 0.0;
        ${te(X[2],2)}${te(X[1],1)}${te(X[0],0)}
        if (A < 0.004) discard;
        gl_FragColor = vec4(stone/A, A);
        ${Xe}
      }`}),F=new t.Mesh(A,Z);return F.name="raft",F.renderOrder=2,F.frustumCulled=!1,F}function Ca(n,l,C){const G=[],V=[],B=[];for(let h=0;h<12;h++){const j=-338-h*21+n.range(-6,6),le=Ro(j)+n.range(-8,8),X=n.range(230,420),N=n.range(.3,.6),z=n.range(4.5,10),te=n.range(6,16),Z=n.range(.012,.022),F=n.range(0,6.28),a=n.range(0,40),p=G.length/3;for(let y=0;y<=48;y++){const k=y/48,u=(k-N)*X,c=te*(Math.sin(u*Z+F)-Math.sin(F)),v=z*(.35+.65*Math.sin(Math.PI*k));for(let s=-1;s<=1;s+=2)G.push(le+.8*u- -.6*(c+s*v),0,j+-.6*u+.8*(c+s*v)),V.push(s,k,a,X/z);if(y>0){const s=p+y*2;B.push(s-2,s-1,s,s,s-1,s+1)}}}const A=new t.BufferGeometry;A.setAttribute("position",new t.Float32BufferAttribute(G,3)),A.setAttribute("aR",new t.Float32BufferAttribute(V,4)),A.setIndex(B),A.boundingSphere=new t.Sphere(new t.Vector3(-40,0,-450),700);const O=new t.ShaderMaterial({fog:!1,transparent:!0,depthWrite:!1,side:t.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-2,uniforms:{...l,...C},vertexShader:`
      attribute vec4 aR; varying vec4 vR; varying vec3 vNs;
      ${je}
      ${St}
      void main(){
        vec3 nrm; vec3 d = seaDisp(position.xz, nrm);
        float dist = length(position.xz - uSeaCam);
        vec3 w = vec3(position.x + d.x, d.y + 0.05 + dist*0.0016, position.z + d.z);
        vR = aR; vNs = nrm;
        vec4 mvPosition = viewMatrix*vec4(w, 1.0); gl_Position = projectionMatrix*mvPosition;
        ${Qe}
      }`,fragmentShader:`
      ${We}
      uniform float uSeaT;
      varying vec4 vR; varying vec3 vNs;
      ${Ke}
      ${ge}
      void main(){
        float al = vR.y*vR.w - uSeaT*0.05;                       // the stain slides slowly down its own length
        float n = wsVN(vec2(al*0.55 + vR.z, vR.x*1.3 + vR.z))*0.6 + wsVN(vec2(al*1.9, vR.x*3.1 - vR.z))*0.4;
        float edge = abs(vR.x) + (n - 0.5)*0.7;
        float a = (1.0 - smoothstep(0.25, 0.95, edge))*smoothstep(0.0, 0.12, vR.y)*(1.0 - smoothstep(0.85, 1.0, vR.y))*(0.45 + 0.55*n)*0.5;
        if (a < 0.01) discard;
        vec3 col = vec3(0.34, 0.2, 0.05)*(0.8 + 0.5*n)*(uSunCol*(0.35 + 0.5*clamp(dot(vNs, uSun), 0.0, 1.0)) + uSkyCol*0.4);
        gl_FragColor = vec4(col, a);
        ${Xe}
      }`}),H=new t.Mesh(A,O);return H.name="ochre",H.renderOrder=2,H.frustumCulled=!1,H}const uo=`
uniform vec4 uMist, uMistCyl; uniform vec3 uMistCol;
float mistShare(vec3 d){
  float dist = length(d), cy = cameraPosition.y;
  float top = uMist.y;
  float ta = top*0.62, tb = top*1.38, dyq = abs(d.y) < 1e-3 ? 1e-3 : d.y;
  float ha = cy < ta ? (d.y > 0.0 ? clamp((ta - cy)/dyq, 0.0, 1.0) : 1.0) : (d.y < 0.0 ? 1.0 - clamp((ta - cy)/dyq, 0.0, 1.0) : 0.0);
  float hb = cy < tb ? (d.y > 0.0 ? clamp((tb - cy)/dyq, 0.0, 1.0) : 1.0) : (d.y < 0.0 ? 1.0 - clamp((tb - cy)/dyq, 0.0, 1.0) : 0.0);
  vec2 a = cameraPosition.xz - uMistCyl.xy;
  float A = dot(d.xz, d.xz), B = dot(a, d.xz), C = dot(a, a) - uMistCyl.z*uMistCyl.z, disc = B*B - A*C, t0 = 0.0, t1 = 0.0;
  if (A < 1e-6) { t1 = C < 0.0 ? 1.0 : 0.0; }
  else if (disc > 0.0) { float sq = sqrt(disc); t0 = clamp((-B - sq)/A, 0.0, 1.0); t1 = clamp((-B + sq)/A, 0.0, 1.0); }
  float fa = cy < ta ? max(min(t1, ha) - t0, 0.0) : max(t1 - max(t0, 1.0 - ha), 0.0);
  float fb = cy < tb ? max(min(t1, hb) - t0, 0.0) : max(t1 - max(t0, 1.0 - hb), 0.0);
  float side = smoothstep(0.0, 80.0, uMistCyl.z - sqrt(max(dot(a, a) - B*B/max(A, 1e-6), 0.0))*clamp((length(a) - uMistCyl.z)/30.0 + 1.0, 0.0, 1.0));
  float L = dist*0.5*(fa + fb)*uMist.x*side;
  return 1.0 - exp(-L*L);
}
`,je="varying float vLawDepth; varying vec3 vLawD;",Qe="vLawDepth = -mvPosition.z; vLawD = transpose(mat3(viewMatrix))*mvPosition.xyz;",Ke=`uniform vec4 uSeaHaze; varying float vLawDepth; varying vec3 vLawD;${uo}`,Xe="{ float lawHz = uSeaHaze.w*vLawDepth; gl_FragColor.rgb = mix(gl_FragColor.rgb, uSeaHaze.rgb, 1.0 - exp(-lawHz*lawHz)); if (uMist.x > 1e-5) gl_FragColor.rgb = mix(gl_FragColor.rgb, uMistCol, mistShare(vLawD)); }";function Io(n,l){const C=new t.ShaderMaterial({transparent:!0,depthWrite:!1,depthTest:!l,side:t.BackSide,fog:!1,uniforms:{uCloud:n.uCloud,uFlow:n.uFlow,uGlowA:n.uGlowA,uGlowB:n.uGlowB,uGlowP:n.uGlowP,uGlowQ:n.uGlowQ,uIn:n.uIn,uSeedV:n.uSeedV,uLightV:n.uLightV,uCover:{value:l?1:0},uRad:{value:l?40:3e3},uMist:n.uMist,uMistCyl:n.uMistCyl,uMistCol:n.uMistCol,uSunCol:n.uSunCol,uSkyCol:n.uSkyCol,uSurgeCol:n.uSurgeCol},vertexShader:`
      uniform float uRad; varying vec3 vDir;
      void main(){ vDir = position; gl_Position = projectionMatrix*viewMatrix*vec4(cameraPosition + position*uRad, 1.0); }`,fragmentShader:`
      uniform vec4 uGlowA, uGlowB; uniform vec3 uCloud, uFlow, uSeedV, uLightV; uniform float uCover;   // uCloud: the layer's top, the world's clock, the cloud's strength (by the surge's life and growth and the eye's height under the cloud's top)
      uniform vec3 uSunCol, uSkyCol, uSurgeCol;                                                        // the hero's own light and the surge's own colour
      uniform vec4 uGlowP, uGlowQ; uniform float uIn;
      varying vec3 vDir;
      ${uo}
      ${ge}
      const float RAG = 10.0, LG = 4.5, C2 = 0.45, C3 = 0.5, BG = 1.0, B2 = 1.2, B3 = 1.6, FE = 0.25, GK = 70.0, PK = 60.0;
      vec4 vnS(vec3 p){
        vec3 i = floor(p), w = fract(p), f = w*w*(3.0 - 2.0*w), du = 6.0*w*(1.0 - w);
        float a = wsH13(i), b = wsH13(i + vec3(1,0,0)), c = wsH13(i + vec3(0,1,0)), e = wsH13(i + vec3(1,1,0)), g = wsH13(i + vec3(0,0,1)), h = wsH13(i + vec3(1,0,1)), j = wsH13(i + vec3(0,1,1)), k = wsH13(i + vec3(1,1,1));
        return vec4(du*vec3(mix(mix(b - a, e - c, f.y), mix(h - g, k - j, f.y), f.z), mix(mix(c - a, e - b, f.x), mix(j - g, k - h, f.x), f.z), mix(mix(g - a, h - b, f.x), mix(j - c, k - e, f.x), f.y)),
                    mix(mix(mix(a, b, f.x), mix(c, e, f.x), f.y), mix(mix(g, h, f.x), mix(j, k, f.x), f.y), f.z));
      }
      // one slab of billows at world point p (f = 1 / billow size): x = the ash's density there (0..1), y = the light on it (about 0..1),
      // z = the light on it for an eye inside the body (order 4: the great billows' form and the rolls' folds lit from the light's side, see the block above; lb2, lb3 = the light's side in the two smaller sizes' own lattices).
      // THREE SIZES SUMMED, EACH ON A LATTICE TURNED ITS OWN WAY by a fixed turn (value noise on an unturned lattice makes billows and gaps
      // with upright and level sides, a cell wide: a faint hard-edged pane 13 m from the lens; turned, no side of a cell is upright or level
      // and no two sizes' cells line up). THE LIGHT IS FORM FROM THE LIGHT'S SIDE: the largest size is read a second time, up to 0.42 of a
      // cell toward the light across the sight line (o1, see main: the part of the light's direction that lies across the line; nothing
      // on a line turned straight at the light or away from it), and the billow is lit where the ash thins that way and shaded where it
      // thickens: one wide run across the whole heap, a difference over two fifths of a cell and so without a crease. The smaller sizes
      // ride on it: their crests take more light and their hollows less (LG, C2, C3: the shares of the three sizes in the light)
      const mat3 R1 = mat3(0.808, 0.571, -0.145, -0.342, 0.655, 0.674, 0.479, -0.496, 0.724);
      const mat3 R2 = mat3(0.282, 0.422, -0.862, -0.355, 0.88, 0.315, 0.891, 0.217, 0.398);
      const mat3 R3 = mat3(0.731, -0.358, 0.581, -0.226, 0.676, 0.701, -0.644, -0.644, 0.413);
      vec3 slab(vec3 p, float f, vec3 o1, vec3 lb2, vec3 lb3){
        vec3 q = p*f + uSeedV, q1 = R1*q;
        vec4 n2 = vnS(R2*q*2.3 + 7.1), n3 = vnS(R3*q*5.3 + 19.0);
        float v1 = wsVN3(q1), v2 = n2.w, v3 = n3.w, big = (v1 - wsVN3(q1 + o1))*LG, c2 = 2.0*v2 - 1.0, c3 = 2.0*v3 - 1.0;
        return vec3(v1*0.58 + v2*0.28 + v3*0.14, 0.5 + big + (v2 - 0.5)*C2 + (v3 - 0.5)*C3,
                    0.5 + big*BG - B2*c2*inversesqrt(c2*c2 + FE)*dot(n2.xyz, lb2) - B3*c3*inversesqrt(c3*c3 + FE)*dot(n3.xyz, lb3));
      }
      // (the farthest slab, seen through the two before it and the haze, is of the two larger sizes only: the density's shares 0.58 and 0.28 over their sum)
      vec3 slabFar(vec3 p, float f, vec3 o1, vec3 lb2){
        vec3 q = p*f + uSeedV, q1 = R1*q;
        vec4 n2 = vnS(R2*q*2.3 + 7.1);
        float v1 = wsVN3(q1), v2 = n2.w, big = (v1 - wsVN3(q1 + o1))*LG, c2 = 2.0*v2 - 1.0;
        return vec3(v1*0.674 + v2*0.326, 0.5 + big + (v2 - 0.5)*C2, 0.5 + big*BG - B2*c2*inversesqrt(c2*c2 + FE)*dot(n2.xyz, lb2));
      }
      // where the surge is, in plan (the wall's own law, copied from the part's SURGE_VERT with its numbers: whoever retunes it there retunes it
      // here): it is held in by the crater and pours out through the breach, a tongue that widens seaward
      float held(vec2 xz){
        vec2 c = xz - vec2(${Se.toFixed(1)}, ${ze.toFixed(1)}); float al = dot(c, vec2(-0.741, 0.671)), pe = abs(dot(c, vec2(0.671, 0.741)));
        return max(1.0 - smoothstep(168.0, 204.0, length(c)), smoothstep(-30.0, 50.0, al)*(1.0 - smoothstep(66.0, 104.0 + max(al - 150.0, 0.0)*0.3, pe)));
      }
      void main(){
        vec3 d = normalize(vDir);
        if (uCover < 0.5) {
          if (uMist.x < 1e-5) discard;
          float fogA = mistShare(d*3000.0);
          if (fogA <= 0.0) discard;      // (no cut-off above nothing: the sky carries the law's share to the last thousandth, as a body does)
          gl_FragColor = vec4(uMistCol, fogA);
          return;
        }
        float inL = uCloud.z;
        if (inL < 1e-4) discard;
        float cy = cameraPosition.y, t = uCloud.y, top = uCloud.x;
        // where the sight line enters the body (t0, metres; nothing where the eye stands inside it). A line that meets no body within 125 m shows none of it
        vec2 a = cameraPosition.xz - uMistCyl.xy;
        float A = dot(d.xz, d.xz), B = dot(a, d.xz), aa = dot(a, a), C = aa - uMistCyl.z*uMistCyl.z, t0 = 0.0;
        if (C > 0.0) {
          float disc = B*B - A*C;
          if (A < 1e-6 || B >= 0.0 || disc <= 0.0) discard;
          t0 = (-B - sqrt(disc))/A;
          if (t0 >= 125.0) discard;
        }
        float wO = inL*(1.0 - smoothstep(85.0, 125.0, t0));
        // (a line that only grazes the body shows none of it: the cloud comes in over the first 30 m by which the line's nearest pass of the vent's
        // axis lies inside the front. Seen from outside this is the body's soft side; it eases out over the first 30 m the eye stands inside, as the part's does)
        float eo = sqrt(aa) - uMistCyl.z;      // how far the eye itself stands outside the body, in plan (m; negative inside): one number for the frame
        wO *= smoothstep(0.0, 30.0, uMistCyl.z - sqrt(max(aa - B*B/max(A, 1e-6), 0.0))*clamp(eo/30.0 + 1.0, 0.0, 1.0));
        // the three slabs' places on the sight line: 13, 32 and 78 m inside the body, never under the sea, never within 4 m of the eye
        float sea = d.y < -1e-3 ? 0.85*cy/(-d.y) : 1e6;
        float e1 = max(min(t0 + 13.0, sea), 4.0), e2 = max(min(t0 + 32.0, sea), 4.0), e3 = max(min(t0 + 78.0, sea), 4.0);
        // everything streams away from where the surge comes from, and rolls slowly upward
        vec3 drift = uFlow*(t*11.0) - vec3(0.0, t*1.3, 0.0);
        vec3 la = uLightV - d*dot(uLightV, d), o1 = R1*(la*0.42), lb2 = R2*la, lb3 = R3*la;
        vec3 s1 = slab(cameraPosition + d*e1 + drift, 1.0/10.0, o1, lb2, lb3), s2 = slab(cameraPosition + d*e2 + drift*0.8 + 31.0, 1.0/17.0, o1, lb2, lb3), s3 = slabFar(cameraPosition + d*e3 + drift*0.6 + 77.0, 1.0/31.0, o1, lb2);
        // how thick the ash is at each place: a wide soft run of the density, so a billow's edge is soft
        float h1 = smoothstep(0.38, 0.64, s1.x), h2 = smoothstep(0.38, 0.64, s2.x), h3 = smoothstep(0.38, 0.64, s3.x);
        // how deep each place lies inside the body (m, from the front inward): the cloud is only inside, and its face is in the sun
        float d1 = uMistCyl.z - length(a + d.xz*e1), d2 = uMistCyl.z - length(a + d.xz*e2), d3 = uMistCyl.z - length(a + d.xz*e3);
        // (and only where the surge is: in the crater and in the tongue through the breach, as the wall's own lobes are)
        // (THE FACE IS RAGGED INWARD ONLY: it comes in over 16 m of depth, the thin ash up to RAG (10 m) deeper than the thick. Nothing stands before the front)
        float i1 = smoothstep(0.0, 16.0, d1 - (1.0 - h1)*RAG)*held(cameraPosition.xz + d.xz*e1), i2 = smoothstep(0.0, 16.0, d2 - (1.0 - h2)*RAG)*held(cameraPosition.xz + d.xz*e2), i3 = smoothstep(0.0, 16.0, d3 - (1.0 - h3)*RAG)*held(cameraPosition.xz + d.xz*e3);
        // the cloud lies between the sea and the top of the layer (ragged), so it opens overhead as we climb out
        float y1 = cy + d.y*e1, y2 = cy + d.y*e2, y3 = cy + d.y*e3, tw = top*(0.8 + 0.5*h3), twa = tw*0.75, twb = tw*1.3;
        // (THE BODY'S SKIN, SEEN FROM OUTSIDE, IS DENSER THAN ITS INSIDE: over its first 46 m of depth, k, the gaps between a slab's billows are half
        // filled, so that the face is a wall of billows and not scattered puffs with dark gaps, and it wears the wall's lit tone (see the tones). It is
        // a FACE only for an eye that stands outside the body: kf, by eo, how far the eye itself is outside the body in plan (one number for the frame, not
        // the sight line's way to the body): all of it from 40 m outside, none for an eye inside. An eye inside sees the inside's billows from the first metre: open gaps, through which the trunks show, in the
        // inside's own light. Without kf the first seconds inside were one pale filled screen)
        // (and where k is 1 the body stands on the water; elsewhere the cloud thins toward the water over its lowest 5 m, so that from inside the
        // water's own ripples show under it)
        // (THE CLOUD IS A MEDIUM NEAR THE LENS: a billow thins to nothing as its place comes within 12 to 3 m of the lens's place)
        float kf = smoothstep(0.0, 40.0, eo), k1 = kf*clamp((46.0 - d1)/42.0, 0.0, 1.0), k2 = kf*clamp((46.0 - d2)/42.0, 0.0, 1.0), k3 = kf*clamp((46.0 - d3)/42.0, 0.0, 1.0);
        float a1 = (h1 + (1.0 - h1)*0.5*k1)*0.56*wO*i1*smoothstep(-0.6*k1, 5.0 - 4.2*k1, y1)*(1.0 - smoothstep(twa, twb, y1))*clamp((e1 - 3.0)/9.0, 0.0, 1.0);
        float a2 = (h2 + (1.0 - h2)*0.5*k2)*0.62*wO*i2*smoothstep(-0.6*k2, 5.0 - 4.2*k2, y2)*(1.0 - smoothstep(twa, twb, y2))*clamp((e2 - 3.0)/9.0, 0.0, 1.0);
        float a3 = (h3 + (1.0 - h3)*0.5*k3)*0.8*wO*i3*smoothstep(-0.6*k3, 5.0 - 4.2*k3, y3)*(1.0 - smoothstep(twa, twb, y3))*clamp((e3 - 3.0)/9.0, 0.0, 1.0);
        float hz = 0.15*wO*i2*(1.0 - smoothstep(top*0.7, top*1.4, y2));
        // THE LIGHT ON A BILLOW (0 shaded .. 1 lit): the slab's own light (form from the light's side and the crests of the smaller sizes, see
        // slab) smoothed over 1.6 of its own range: one wide soft run from the lit side to the shaded, never a steepened step
        // (ORDER 4: for an eye inside the body, by uIn, the light is the slab's z: the rolls lit from the light's side, smoothed over 1.55 of its range)
        float l1 = smoothstep(-0.3, 1.3, s1.y), l2 = smoothstep(-0.3, 1.3, s2.y), l3 = smoothstep(-0.3, 1.3, s3.y);
        if (uIn > 0.0) { l1 = mix(l1, smoothstep(-0.45, 1.1, s1.z), uIn); l2 = mix(l2, smoothstep(-0.45, 1.1, s2.z), uIn); l3 = mix(l3, smoothstep(-0.45, 1.1, s3.z), uIn); }
        // THE TONES, FROM THE LOOK'S OWN LIGHT (one law for every look): the surge's own colour with the design's warm lean, under the hero's
        // sun (its share by the light l on the billow: 0.15 + 0.47 l l inside, the shaded side lifted toward the mist's tone; 0.62 to 0.95 on the body's face seen from outside, as the wall's
        // lobes) and sky (0.4 of it, times 0.45 + 0.75 l)
        vec3 sunT = uSurgeCol*vec3(1.02, 1.0, 0.97)*uSunCol, skyT = uSurgeCol*vec3(1.02, 1.0, 0.97)*uSkyCol*0.4;
        // the lightning's glow soaks into the thick parts: a swell of each billow's own tone, at most 0.26 of it in any colour (before the front; inside uGlowA is nothing)
        vec3 glow = vec3(0.26, 0.15, 0.24)*(uGlowA.w*(0.9*exp(-(1.0 - dot(d, uGlowA.xyz))*5.0) + 0.1));
        vec3 c1 = (sunT*mix(0.15 + 0.47*l1*l1, 0.62 + 0.33*l1, k1) + skyT*(0.45 + 0.75*l1))*(1.0 + glow*(0.4 + 0.6*h1));
        vec3 c2 = (sunT*mix(0.15 + 0.47*l2*l2, 0.62 + 0.33*l2, k2) + skyT*(0.45 + 0.75*l2))*(1.0 + glow*(0.4 + 0.6*h2));
        vec3 c3 = (sunT*mix(0.15 + 0.47*l3*l3, 0.62 + 0.33*l3, k3) + skyT*(0.45 + 0.75*l3))*(1.0 + glow*(0.4 + 0.6*h3));
        // ORDER 4, INSIDE: the two glows' lobes (gk) and the bomb's pool (pk), each a bounded lift of the slab's tone toward the light's own tone, the billow's light kept in it
        float db = 1.0 - dot(d, uGlowB.xyz);
        vec3 gk = (uGlowP.w*exp(-(1.0 - dot(d, uGlowP.xyz))*GK) + uGlowQ.w*exp(-(1.0 - dot(d, uGlowQ.xyz))*GK))*vec3(1.2, 1.9, 2.6), pk = (uGlowB.w*uIn*exp(-db*PK))*vec3(1.5, 2.5, 2.0);
        gk = gk/(1.0 + gk); pk = pk/(1.0 + pk);
        vec3 glT = (sunT*1.3 + skyT*2.6)*vec3(0.97, 0.9, 1.0), poT = dot(sunT*0.62 + skyT*1.2, vec3(0.3333))*vec3(2.2, 0.85, 0.25) + vec3(0.04, 0.013, 0.003);
        c1 = mix(mix(c1, glT*(0.7 + 0.3*l1), gk.x), poT*(0.7 + 0.3*l1), pk.x); c2 = mix(mix(c2, glT*(0.7 + 0.3*l2), gk.y), poT*(0.7 + 0.3*l2), pk.y); c3 = mix(mix(c3, glT*(0.7 + 0.3*l3), gk.z), poT*(0.7 + 0.3*l3), pk.z);
        vec3 acc = c1*a1; float tr = 1.0 - a1;
        acc += tr*hz*uMistCol; tr *= 1.0 - hz;
        acc += tr*a2*c2; tr *= 1.0 - a2;
        // (the ember is a dull point inside grey cloud: it shows only where a billow really stands on that sight line, below the layer's
        // ragged top. Through a gap, or above the layer as we rise out of it, it lay over the white trunk and the sky as a pink stain)
        float gB = uGlowB.w*(exp(-db*420.0) + 0.1*exp(-db*45.0));
        gB *= smoothstep(0.25, 0.8, max(a2/max(0.62*wO, 1e-3), a3/max(0.8*wO, 1e-3)));
        acc += vec3(1.0, 0.33, 0.1)*gB*tr*wO; float ab = clamp(gB*0.7*wO, 0.0, 0.8); tr *= 1.0 - ab;
        acc += tr*a3*c3; tr *= 1.0 - a3;
        float Al = 1.0 - tr;
        if (Al < 0.003) discard;
        gl_FragColor = vec4(acc/Al, Al);
      }`}),G=new t.Mesh(new t.SphereGeometry(1,24,14),C);return G.name=l?"mistOver":"mistSky",G.frustumCulled=!1,G.renderOrder=l?30:0,G}function Aa(n,l,C){const G=[],V=[],B=(u,c,v,s,x)=>{for(const E of[u,c,v,u,v,s])G.push(E[0],E[1],E[2]),V.push(x[0],x[1],x[2],x[3])},U=(u,c)=>{const v=new t.Color(u);return[v.r,v.g,v.b,c]},e=(u,c,v,s,x,E,M,I=0)=>{const b=Math.cos(I),T=Math.sin(I),g=[];for(let $=0;$<8;$++){const ae=($&1?.5:-.5)*s,P=($&2?1:0)*x,Q=($&4?.5:-.5)*E;g.push([u+ae*b-P*T,c+ae*T+P*b,v+Q])}B(g[0],g[1],g[3],g[2],M),B(g[4],g[5],g[7],g[6],M),B(g[0],g[1],g[5],g[4],M),B(g[2],g[3],g[7],g[6],M),B(g[0],g[2],g[6],g[4],M),B(g[1],g[3],g[7],g[5],M)},ee=U(l,1),A=U("#6E7072",2),O=U(C,0),H=U("#1b1d20",0),h=U("#4a4f52",1),j=U("#FF5A1F",3),le=U("#5a1c14",1),X=14,N=u=>3.5*(u<.12?.82+.18*u/.12:1-Math.pow((u-.12)/.88,2.3))+.06,z=u=>1.7+1.9*u*u+.35*(1-u)*(1-u),te=u=>{const c=N(u),v=z(u),s=it(-13,13,u);return[[0,-1.7,s],[c*.7,-1.2,s],[c,.25,s],[c*1.03,v,s],[c*1.03,v+.75,s]]};for(let u=0;u<X;u++){const c=te(u/X),v=te((u+1)/X);for(const s of[-1,1]){const x=E=>[E[0]*s,E[1],E[2]];B(x(c[0]),x(v[0]),x(v[1]),x(c[1]),le),B(x(c[1]),x(v[1]),x(v[2]),x(c[2]),le),B(x(c[2]),x(v[2]),x(v[3]),x(c[3]),ee),B(x(c[3]),x(v[3]),x(v[4]),x(c[4]),ee)}B([-c[3][0],c[3][1]+.12,c[3][2]],[c[3][0],c[3][1]+.12,c[3][2]],[v[3][0],v[3][1]+.12,v[3][2]],[-v[3][0],v[3][1]+.12,v[3][2]],A)}const Z=te(0);B([-Z[4][0],Z[4][1],-13],[Z[4][0],Z[4][1],-13],[Z[1][0],Z[1][1],-13],[-Z[1][0],Z[1][1],-13],ee);const F=z(.25)+.1;e(0,F,-6.2,5.2,2.5,6.4,O),e(0,F+2.5,-5.4,4.3,2.3,4.2,O),e(0,F+4.8,-5.4,4.7,.18,4.8,h),e(0,F+3.25,-3.27,3.9,.85,.1,H),e(2.17,F+3.25,-5.2,.1,.85,3.2,H),e(-2.17,F+3.25,-5.2,.1,.85,3.2,H),e(0,F+.9,-2.97,.9,1.2,.08,H),e(1.2,F+4.9,-7.2,.9,2.2,.9,H),e(1.2,F+7.1,-7.2,1,.25,1,h);const a=z(.55)+.1;e(0,a,1.5,.34,11,.34,h),e(0,a+8.2,1.5,3.6,.16,.16,h),e(0,a+10.2,1.5,.5,.5,.5,j),e(.25,a+.8,1.5,.22,9.5,.22,h,-.95),e(-.25,a+.8,1.5,.22,9.5,.22,h,.95),e(0,a+4,1.5,.2,6,.2,h,0),e(0,a,4.6,2.4,1.1,1.6,h),e(0,a,-.6,1.8,.9,1.3,H),e(-2.6,z(.12)+.1,-10.4,.25,4.6,.25,h),e(2.6,z(.12)+.1,-10.4,.25,4.6,.25,h),e(0,z(.12)+4.6,-10.4,5.5,.25,.25,h),e(0,F+5,-4.4,.45,.45,.45,j),e(0,z(.93)+.2,11.2,.25,1.4,.25,h);const p=new t.BufferGeometry;p.setAttribute("position",new t.Float32BufferAttribute(G,3)),p.setAttribute("aCol",new t.Float32BufferAttribute(V,4)),p.computeBoundingSphere();const y=new t.ShaderMaterial({fog:!1,side:t.DoubleSide,uniforms:{...n},vertexShader:`
      attribute vec4 aCol; varying vec4 vC; varying vec3 vL; varying vec3 vW;
      ${je}
      void main(){ vC = aCol; vL = position; vec4 wp = modelMatrix*vec4(position, 1.0); vW = wp.xyz;
        vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
        ${Qe}
      }`,fragmentShader:`
      ${We}
      varying vec4 vC; varying vec3 vL; varying vec3 vW;
      ${Ke}
      ${ge}
      void main(){
        vec3 dx = dFdx(vW), dy = dFdy(vW); vec3 N = cross(dx, dy); N = N/max(length(N), 1e-6);
        vec3 V = normalize(cameraPosition - vW); if (dot(N, V) < 0.0) N = -N;
        vec3 alb = vC.rgb; float flag = vC.a;
        float streak = smoothstep(0.5, 0.85, wsVN(vec2(vL.z*1.9 + vL.x*0.7, vL.y*0.28)))*smoothstep(0.3, 0.7, wsVN(vL.zy*vec2(0.4, 0.9) + 3.0));
        float isHull = step(0.5, flag)*step(flag, 1.5), isDeck = step(1.5, flag)*step(flag, 2.5);
        alb = mix(alb, vec3(0.19, 0.075, 0.03), streak*0.8*isHull);
        alb *= 1.0 - 0.3*isHull*(1.0 - smoothstep(0.2, 1.2, vL.y));                            // wet, dark boot-topping
        alb = mix(alb, vec3(0.2, 0.2, 0.205)*(0.7 + 0.6*wsVN(vL.xz*2.3)), isDeck*0.9);          // deck dusted with ash
        alb = mix(alb, vec3(0.19, 0.19, 0.195), (1.0 - isDeck)*smoothstep(0.6, 1.0, N.y)*0.5);  // ash settles on every top
        float ndl = dot(N, uSun);
        vec3 col = alb*(uSunCol*smoothstep(-0.02, 0.25, ndl)*(0.55 + 0.45*clamp(ndl, 0.0, 1.0)) + uSkyCol*(0.32 + 0.2*N.y));
        if (flag > 2.5) col = vec3(1.0, 0.354, 0.122)*4.2;
        gl_FragColor = vec4(col, 1.0);
        ${Xe}
      }`}),k=new t.Mesh(p,y);return k.name="trawler",k}function Na(n){const l=new t.PlaneGeometry(2,2);l.deleteAttribute("normal"),l.deleteAttribute("uv");const C=new t.InstancedBufferGeometry;C.index=l.index,C.setAttribute("position",l.attributes.position),C.setAttribute("aK",new t.InstancedBufferAttribute(new Float32Array([0,.3,1,.7,2,.1,3,0,3,.5,3,1]),2)),C.instanceCount=6,C.boundingSphere=new t.Sphere(new t.Vector3,1e5);const G=new t.ShaderMaterial({fog:!1,transparent:!0,depthWrite:!1,uniforms:{...n,uEv:{value:new t.Vector4(-99,0,0,0)},uAt:{value:new t.Vector3},uFrom:{value:new t.Vector3(0,1,0)},uSeaT:{value:0}},vertexShader:`
      attribute vec2 aK; uniform vec4 uEv; uniform vec3 uAt, uFrom, uSun;
      varying vec4 vQ; varying vec3 vK;      // vQ: quad xy, kind, seed.  vK: alpha, phase, sun across
      ${je}
      void main(){
        float kind = aK.x, t = uEv.x, alpha = 0.0, ph = 0.0; vec3 c = uAt, axis = vec3(0.0, 1.0, 0.0); vec2 sz = vec2(0.001);
        if (kind < 0.5) {              // the bomb, 75 m/s down its line
          c = uAt + uFrom*(max(-t, 0.0)*75.0); sz = vec2(2.6); alpha = step(t, 0.0)*step(-3.4, t);
        } else if (kind < 1.5) {       // the thread of steam behind it: it hangs a second after the bomb has struck
          c = uAt + uFrom*(max(-t, 0.0)*75.0 + 27.0); sz = vec2(1.7, 27.0); axis = uFrom;
          alpha = step(-3.4, t)*(1.0 - smoothstep(0.0, 1.3, t))*0.5;
        } else if (kind < 2.5) {       // the crown of white water
          ph = clamp(t/2.8, 0.0, 1.0); float up = sin(min(ph*1.3, 1.0)*3.1416);
          sz = vec2(4.4 + 3.6*ph, 0.6 + 5.6*sqrt(max(up, 0.0))); c.y += sz.y*0.9;      // (its tallest fingers stand 12 m)
          alpha = step(0.0, t)*(1.0 - smoothstep(0.72, 1.0, ph));
        } else {                       // steam leaning away downwind
          ph = clamp((t - 1.5 - aK.y*1.3)/10.0, 0.0, 1.0); float rr = 3.5 + 12.0*sqrt(ph);      // (it rises out of the crown as the water falls back: sooner, it hid the crown)
          sz = vec2(rr, rr*1.1); c += vec3(0.8, 0.0, -0.6)*(ph*34.0 + aK.y*5.0) + vec3(0.0, 2.0 + rr*0.8 + ph*13.0, 0.0);
          alpha = smoothstep(0.0, 0.12, ph)*(1.0 - smoothstep(0.3, 1.0, ph))*0.55;
        }
        vec3 toCam = cameraPosition - c; float dist = length(toCam);
        vec3 right = cross(axis, toCam); right = right/max(length(right), 1e-3);
        if (kind > 0.5) alpha *= kind > 2.5 ? smoothstep(sz.x*1.2 + 10.0, sz.x*1.2 + 45.0, dist) : smoothstep(9.0, 24.0, dist);          // never a card at the lens: a billow of steam thins out as it nears, by its own size
        if (alpha < 0.002) sz = vec2(0.0);
        vec3 w = c + right*(position.x*sz.x) + axis*(position.y*sz.y);
        vQ = vec4(position.xy, kind, aK.y*31.0 + 3.0); vK = vec3(alpha, ph, dot(right, uSun));
        vec4 mvPosition = viewMatrix*vec4(w, 1.0); gl_Position = projectionMatrix*mvPosition;
        ${Qe}
      }`,fragmentShader:`
      ${We}
      uniform float uSeaT;
      varying vec4 vQ; varying vec3 vK;
      ${Ke}
      ${ge}
      void main(){
        vec2 q = vQ.xy; float kind = vQ.z, sd = vQ.w, a, yy = q.y*0.5 + 0.5;
        float lit = clamp(0.62 + 0.3*q.x*vK.z + 0.25*q.y, 0.0, 1.0);
        vec3 col = mix(vec3(0.2, 0.28, 0.42)*uSkyCol*1.35, vec3(0.9, 0.89, 0.85)*uSunCol, kind > 1.5 && kind < 2.5 ? smoothstep(0.25, 0.7, lit) : lit);
        if (kind < 0.5) {              // a glowing clast with a dark crust and a small soft halo
          float d = length(q), crust = smoothstep(0.45, 0.7, wsVN(q*3.1 + sd + uSeaT*2.0));
          a = 1.0 - smoothstep(0.42, 0.5, d);
          col = vec3(1.0, 0.354, 0.122)*mix(4.4, 0.6, crust*0.8);
          float halo = exp(-d*d*5.0)*0.5*(1.0 - smoothstep(0.7, 1.0, d));
          col = mix(vec3(1.0, 0.354, 0.122)*2.2, col, a); a = max(a, halo);
        } else if (kind < 1.5) {
          float n = wsVN(vec2(q.x*2.0 + sd, yy*9.0 - uSeaT*0.4));
          a = (1.0 - smoothstep(0.15, 0.95, abs(q.x) + (n - 0.5)*0.7))*smoothstep(0.0, 0.1, yy)*(1.0 - smoothstep(0.3, 1.0, yy))*(0.5 + 0.5*n);
        } else if (kind < 2.5) {       // a ragged crown: many fine fingers of spray that break into drops, over a low wide lobe of mist
          // (the water fans outward as it rises; each finger is solid at its root, torn into shreds toward its tip and drops beyond it)
          float xs = q.x/(0.5 + 0.8*yy);
          float f1 = wsVN(vec2(xs*4.0 + sd, 1.0 + sd)), f2 = wsVN(vec2(xs*10.0 - sd*3.0, 5.0 + sd)), f3 = wsVN(vec2(xs*23.0 + sd*7.0, 9.0 - sd));
          float top = max(mix(0.3, 1.0, smoothstep(0.2, 0.8, f1*0.5 + f2*0.32 + f3*0.18))*(1.0 - 0.6*min(xs*xs, 1.0)), 0.05), tt = yy/top;
          float tear = wsVN(vec2(xs*31.0 + sd, yy*15.0 - vK.y*9.0))*0.6 + wsVN(vec2(xs*67.0 - sd, yy*36.0 - vK.y*15.0))*0.4;
          float thr = mix(0.08, 0.7, smoothstep(0.3, 1.2, tt));
          float spray = smoothstep(thr, thr + 0.2, tear)*(1.0 - smoothstep(0.95, 1.4, tt))*(1.0 - smoothstep(0.55, 1.0, abs(xs)));
          float mist = (1.0 - smoothstep(0.0, 0.36, yy + (f2 - 0.5)*0.14))*(1.0 - smoothstep(0.35, 1.0, abs(q.x)))*0.5*(0.7 + 0.3*tear);
          a = min(max(spray*0.86, mist), 0.86);
        } else {                       // a round billow with an eroded rim
          float d = length(q) + (wsVN(q*2.3 + sd + vec2(0.0, -uSeaT*0.06)) - 0.5)*0.55 + (wsVN(q*5.5 - sd) - 0.5)*0.2;
          float body = wsVN(q*3.4 - sd*2.0 + vec2(0.0, -uSeaT*0.1));      // (thicker and thinner inside, with shaded hollows: a billow, not a disc)
          a = (1.0 - smoothstep(0.3, 0.85, d))*(0.6 + 0.4*smoothstep(0.2, 0.7, body));
          col *= 0.84 + 0.2*body;
        }
        a *= vK.x; if (kind > 0.5) a *= 1.0 - smoothstep(0.8, 1.0, max(abs(q.x), abs(q.y)));
        if (a < 0.004) discard;
        gl_FragColor = vec4(col, a);
        ${Xe}
      }`}),V=new t.Mesh(C,G);return V.name="portSplash",V.frustumCulled=!1,V.renderOrder=5,V}function Fa(n,l,C){const V=new t.PlaneGeometry(2,1,1,10);V.translate(0,.5,0),V.deleteAttribute("normal"),V.deleteAttribute("uv");const B=new t.InstancedBufferGeometry;B.index=V.index,B.setAttribute("position",V.attributes.position);const U=new Float32Array(32);for(let A=0;A<8;A++)for(let O=0;O<2;O++)U[(A*2+O)*2]=A,U[(A*2+O)*2+1]=O;B.setAttribute("aB",new t.InstancedBufferAttribute(U,2)),B.instanceCount=16,B.boundingSphere=new t.Sphere(new t.Vector3,1e5);const e=new t.ShaderMaterial({fog:!1,transparent:!0,depthWrite:!1,side:t.DoubleSide,uniforms:{...n,uClockB:{value:0},uPeriod:{value:C},uSeedB:{value:l.range(0,100)},uZone:{value:new t.Vector3},uSpan:{value:new t.Vector3(100,200,40)},uVentB:{value:new t.Vector3},uAlo:{value:new t.Vector3(.741,0,-.671)},uSeaT:{value:0}},vertexShader:`
      attribute vec2 aB; uniform float uClockB, uPeriod, uSeedB; uniform vec3 uZone, uSpan, uVentB, uAlo, uSun;      // aB: the volley slot it flies in, kind (0 clast, 1 steam)
      varying vec4 vQ; varying vec2 vK;      // vQ: quad xy, kind, seed.  vK: alpha, sun across
      ${je}
      ${ge}
      // where the bomb thrown by volley N is s seconds after the volley (uAlo: along the slot, away from the breach)
      vec3 flight(float N, float s){
        vec2 k = vec2(N*1.371 + uSeedB*1.73, 3.7);
        float h1 = wsH12(k), h2 = wsH12(k + 19.19), h3 = wsH12(k + 41.7);
        vec3 z0 = uZone + uAlo*mix(uSpan.x, uSpan.y, h2) - vec3(0.0, 2.0*uSpan.z*h1, 0.0);
        float rise = max(z0.y - uVentB.y, 1.0), sc = sqrt(2.0*rise/9.81)*mix(0.88, 1.12, h3);
        vec3 v0 = vec3((z0.x - uVentB.x)/sc, rise/sc + 4.905*sc, (z0.z - uVentB.z)/sc);
        return uVentB + vec3(v0.x*s, v0.y*s - 4.905*s*s, v0.z*s);
      }
      void main(){
        float kind = aB.y, n = floor(uClockB/uPeriod), N = n - mod(n - aB.x, 8.0), age = uClockB - N*uPeriod;
        float tau = clamp(position.y, 0.0, 1.0), alpha = smoothstep(0.4, 1.4, age);
        vec3 c = flight(N, age), wpos; vec2 q;
        if (kind < 0.5) {              // the clast: the same strip, squared up and turned to the eye
          vec3 toCam = cameraPosition - c; float dist = length(toCam);
          vec3 right = cross(vec3(0.0, 1.0, 0.0), toCam); right = right/max(length(right), 1e-3); vec3 up = cross(toCam, right); up = up/max(length(up), 1e-3);
          float sz = max(2.6, dist*0.0095); q = vec2(position.x, tau*2.0 - 1.0);
          alpha *= smoothstep(0.0, 12.0, c.y);
          if (alpha < 0.002) sz = 0.0;
          wpos = c + (right*q.x + up*q.y)*sz; vK = vec2(alpha, 0.0);
        } else {                       // the steam it has shed over the last 3.2 s: each point hangs where the bomb was, rising a little
          float ts = max(age - tau*3.2, 0.0), sa = age - ts;
          vec3 p = flight(N, ts) + vec3(0.0, 1.1*sa, 0.0), p0 = flight(N, max(ts - 0.12, 0.0)) + vec3(0.0, 1.1*(sa + 0.12), 0.0);
          vec3 T = p - p0; float tl = length(T); T = tl > 1e-3 ? T/tl : vec3(0.0, 1.0, 0.0);
          vec3 toCam = cameraPosition - p; float dist = length(toCam);
          vec3 side = cross(T, toCam); side = side/max(length(side), 1e-3);
          // (far off it is drawn wider than it is, and thinner in the same measure: a soft wisp, never a hairline)
          float wt = 1.4 + 3.6*(1.0 - exp(-sa/1.3)), w = max(wt, dist*0.008);
          alpha *= 0.62*mix(0.5, 1.0, wt/w)*smoothstep(0.0, 30.0, p.y)*(1.0 - smoothstep(0.9, 0.99, abs(dot(T, toCam/max(dist, 1e-3)))));      // (seen end-on it fades instead of folding to a sliver)
          if (alpha < 0.002) w = 0.0;
          q = vec2(position.x, 1.0 - 2.0*tau);
          wpos = p + side*(position.x*w); vK = vec2(alpha, dot(side, uSun));
        }
        vQ = vec4(q, kind, fract(N*0.618)*31.0 + 3.0);
        vec4 mvPosition = viewMatrix*vec4(wpos, 1.0); gl_Position = projectionMatrix*mvPosition;
        ${Qe}
      }`,fragmentShader:`
      ${We}
      uniform float uSeaT;
      varying vec4 vQ; varying vec2 vK;
      ${Ke}
      ${ge}
      void main(){
        // (the across and along coordinates are clamped to their own range before anything is worked out from them)
        vec2 q = clamp(vQ.xy, -1.0, 1.0); float kind = vQ.z, sd = vQ.w, a; vec3 col;
        if (kind < 0.5) {              // a glowing clast with a dark crust and a small soft halo
          float d = length(q), crust = smoothstep(0.45, 0.7, wsVN(q*3.1 + sd + uSeaT*2.0));
          a = 1.0 - smoothstep(0.34, 0.44, d);
          col = vec3(1.0, 0.354, 0.122)*mix(4.6, 0.7, crust*0.8);
          float halo = exp(-d*d*5.0)*0.55*(1.0 - smoothstep(0.7, 1.0, d));
          col = mix(vec3(1.0, 0.354, 0.122)*2.4, col, a); a = max(a, halo);
        } else {                       // steam: a thread at the bomb, widening, torn and thinning behind it
          float yy = q.y*0.5 + 0.5, w = mix(0.95, 0.2, yy*yy);
          float n = wsVN(vec2(q.x*2.2 + sd, yy*11.0 + uSeaT*0.25))*0.6 + wsVN(vec2(q.x*5.0 - sd, yy*27.0 - uSeaT*0.4))*0.4;
          a = (1.0 - smoothstep(w*0.25, w, abs(q.x) + (n - 0.5)*0.6))*smoothstep(0.0, 0.3, yy)*(1.0 - smoothstep(0.93, 1.0, yy))*(0.45 + 0.55*n);
          float lit = clamp(0.6 + 0.35*q.x*vK.y, 0.0, 1.0);
          col = mix(vec3(0.2, 0.28, 0.42)*uSkyCol*1.35, vec3(0.9, 0.89, 0.85)*uSunCol, lit);
        }
        a *= vK.x;
        // the haze and the mist cut it: what they would have painted grey is taken out of the bomb instead (by the one fog law, as they paint it)
        { float cutHz = uSeaHaze.w*vLawDepth; a *= exp(-cutHz*cutHz)*(uMist.x > 1e-5 ? 1.0 - mistShare(vLawD) : 1.0); }
        if (a < 0.004) discard;
        gl_FragColor = vec4(col, a);
        ${Xe}
      }`}),ee=new t.Mesh(B,e);return ee.name="skyBombs",ee.frustumCulled=!1,ee.renderOrder=5,ee}var La={id:"island-being-born",name:"The Island Being Born",category:"ocean",weirdness:.3,media:["air","open","water"],async build(n){const{rng:l}=n,C=n.quality?.detail??1,G=n.vary||{},V=G.density??1,B=l(),U=l(),e=l(),ee=l(),A=l(),O=G.hour||"any",H=O==="night"?"night":O==="golden"?"afternoon":O==="dawn"?"morning":O==="day"?B<.6?"morning":"noon":B<.4?"morning":B<.6?"noon":B<.85?"afternoon":"night",h=ba[H],j=U<.25?"light":U<.5?"strong":U<.75?"rainbow":"trade",le=j==="light"?12:j==="strong"?40:25,X=e<.3?.2:.9,N=ee<.5,z=A<.45?"trawler":A<.75?"research":"none",te=!!G.rare,Z=h.el*Math.PI/180,F=new t.Vector3(Math.sin(Po)*Math.cos(Z),Math.sin(Z),-Math.cos(Po)*Math.cos(Z)).normalize(),a=new t.Scene,p={rng:l,preset:h.preset,clouds:!1,clouds2:!1};h.night?Object.assign(p,{bodyOverrides:{0:{elevation:h.el,azimuth:-132.2,size:2.3,phase:1}},bake:!0,renderer:n.renderer}):Object.assign(p,{zenith:h.zenith,horizon:h.horizon,sunElevation:h.el,sunAzimuth:-132.2,lightColor:h.sun}),H==="afternoon"&&Object.assign(p,{scatterColor:"#FFE6CC",scatter:.1,scatterHigh:.03}),await n.yield();const y=ha(p);a.add(y.object),await n.yield();const k=ua(y,{bounce:.4});a.add(k.object);const u=y.colorAt(new t.Vector3(.5,.03,-.85).normalize()).clone(),c=new t.FogExp2(u.clone(),h.haze);a.fog=c,await n.yield();const v=h.heroSun||h.sun,s=await fa(n,{sunDir:F.clone(),sunColor:v,skyColor:h.amb,sunIntensity:h.sunI,skyIntensity:h.ambI,night:h.night,lean:le,age:X,washY:.9});s.setLight({sunDir:F,sunColor:v,skyColor:h.amb,sunIntensity:h.sunI,skyIntensity:h.ambI}),s.setHaze(u,h.haze);const x=s.uniforms.uSurgeCol.value.clone().multiply(new t.Color(1.02,1,.97)).multiply(s.uniforms.uSunCol.value.clone().multiplyScalar(.3).add(s.uniforms.uSkyCol.value.clone().multiplyScalar(.4)));s.object.position.set(Se,0,ze),a.add(s.object),s.object.updateMatrixWorld(!0),await n.yield();const E=s.anchors.flyThrough.map(i=>new t.Vector3(i.x+Se,i.y+(i.y<10?.4:0),i.z+ze)),M=ca(E),I=i=>1.05-.68*R(.38,.47,i)*(1-R(.55,.64,i))+.55*R(.58,.68,i)*(1-R(.84,.92,i)),b=s.anchors.ventK.clone().add(new t.Vector3(Se,0,ze)),T=s.anchors.ventW.clone().add(new t.Vector3(Se,0,ze)),g=s.anchors.jetsMid.clone().add(new t.Vector3(Se,0,ze)),$=new Float32Array(2001);for(let i=0;i<2e3;i++)$[i+1]=$[i]+1/de(I((i+.5)/2e3),.35,2.5);const ae=i=>{const r=i/$t*$[2e3];let d=0;for(;d<2e3&&$[d+1]<r;)d++;return(d+(r-$[d])/($[d+1]-$[d]))/2e3},P=i=>{const r=de(i,0,1)*2e3,d=Math.min(1999,Math.floor(r));return $t*($[d]+($[d+1]-$[d])*(r-d))/$[2e3]},Q=i=>s.timeline.clockAtBriefTime(P(i)),ke=ae(Rt),Ne=ae(lo),Ze=ae(ya),fe=M.pointAt(ke),rt=(Math.hypot(fe.x-b.x,fe.z-b.z)-s.timeline.surgeR0)/s.timeline.surgeSpeed;let Re=(s.timeline.surgeDelay+rt-Q(ke))%12;Re=(Re+18)%12-6;const lt=Q(ke)+Re-rt,zt=(i,r,d)=>Math.min(1,2*Vo(i)*Math.sqrt((r>=-.05?1:0)*R(0,.9,r)*(1-R(190,330,i)))/co)*(1-R(Y-22,Y+3,d))*(1-R(Y-33,Y-9,d)),ct=Rt-1,qe=new Float32Array((lo+3-ct)*50+1);{const i=new t.Vector3;let r=0;for(let d=0;d<qe.length;d++){const L=(ct+d/50)/$t*$[2e3];for(;r<1999&&$[r+1]<L;)r++;const ie=de((r+(L-$[r])/($[r+1]-$[r]))/2e3,0,1),J=Q(ie)+Re-lt;M.pointAt(ie,i),qe[d]=zt(s.timeline.surgeR0+s.timeline.surgeSpeed*Math.max(J,0)-Math.hypot(i.x-b.x,i.z-b.z),J,i.y)}}const Ye=i=>{const r=(i-ct)*50,d=Math.floor(r);return r>0&&d<qe.length-1?qe[d]+(qe[d+1]-qe[d])*(r-d):0},he=224,Ie=1120,me=Se-Ie/2,Fe=ze-Ie/2,$e=Ie/he,Ee=new Float32Array(he*he),Ue=n.noise;for(let i=0;i<he;i++){for(let r=0;r<he;r++){const d=me+(r+.5)*$e-Se,L=Fe+(i+.5)*$e-ze,ie=Math.hypot(d,L),J=d*.8-L*.6,ye=d*.6+L*.8,ce=468+62*Ue.fbm2(ye*.012+5,J*.003,3)+13*Ue.n2(ye*.05,J*.012)+7.5*Ue.n2(ye*.085+40,J*.0055)+Math.max(0,J)*.1;let Ce=2.8+4.7*R(ce-60,ce+30,ie)+52*R(ce+26,ce+70,ie);ie<430&&(Ce=Math.min(Ce,-s.heightAt(d,L)*.9)),Ee[i*he+r]=Ce}await n.yield()}const kt=(i,r)=>{const d=Math.floor((i-me)/$e),L=Math.floor((r-Fe)/$e);return Ee[(L<0?0:L>=he?he-1:L)*he+(d<0?0:d>=he?he-1:d)]},pe=30,xe=-212,Je=-.8,et=.6;await n.yield();const o=da.makeOcean({rng:l.fork("sea"),sky:y,preset:"swell",height:1.3,wavelength:70,contrast:.42,foam:j==="strong"?.42:.18,deep:h.deep,shallowColor:h.shallow,windAngle:Math.atan2(-.6,.8),depthAt:kt,depthRect:[me,Fe,me+Ie,Fe+Ie],depthRes:he,shoalDepth:7,shoalWidth:30,shallows:z==="none"?[]:[{x:pe+Je*11,z:xe+et*11,radius:2,falloff:10}],scatter:"#479C6E",...h.night?{}:{zenith:"#33588F"}});a.add(o.object);const m=o.uniforms,f=[m.uDeep.value.clone(),m.uShallowColor.value.clone(),m.uScatter.value.clone()],w=[new t.Color("#3b3d3e").multiplyScalar(h.surge),new t.Color("#77797a").multiplyScalar(h.surge),new t.Color("#8a8b8a").multiplyScalar(h.surge)],D="gl_FragColor.rgb = mix(col, mix(fogColor, hz, hf), kitFog());",S=o.material.fragmentShader.includes(D),se={value:new t.Vector4(u.r,u.g,u.b,h.haze)},ue={value:0},Be=S&&o.material.fragmentShader.includes("float fa = ")?`if (uSeaIn > 0.0) {
      float sIn = uSeaIn*smoothstep(0.0, 24.0, uMistCyl.z - length(vXZ - uMistCyl.xy));
      float sL = dot(col, vec3(0.2126, 0.7152, 0.0722)), sM = max(dot(uMistCol, vec3(0.2126, 0.7152, 0.0722)), 0.02);
      col = mix(col, uMistCol*(sL/sM), 0.6*sIn)*((1.0 + 0.25*(1.0 - fa)*sIn)*pow(clamp(sL/(sM*0.4), 0.25, 4.0), 0.2*sIn)) + uMistCol*(0.04*(1.0 - fa)*sIn);
    }
    `:"";S&&(o.material.fragmentShader="uniform vec4 uSeaHaze; uniform float uSeaIn;"+uo+o.material.fragmentShader.replace(D,Be+"float seaHz = uSeaHaze.w*vFogDepth; gl_FragColor.rgb = mix(col, mix(uSeaHaze.rgb, hz, hf), 1.0 - exp(-seaHz*seaHz)); if (uMist.x > 1e-5) gl_FragColor.rgb = mix(gl_FragColor.rgb, uMistCol, mistShare(vWorld - cameraPosition));"),Object.assign(o.material.uniforms,{uMist:s.uniforms.uMist,uMistCyl:s.uniforms.uMistCyl,uMistCol:s.uniforms.uMistCol,uSeaHaze:se,uSeaIn:ue})),await n.yield();const Ge=new t.Vector2,be=Sa(o,Ge),oe={uSun:{value:F},uSunCol:{value:new t.Color(h.sun).multiplyScalar(h.sunI)},uSkyCol:{value:new t.Color(h.amb).multiplyScalar(h.ambI)}};Object.assign(oe,{uSeaHaze:se,uMist:S?s.uniforms.uMist:{value:new t.Vector4(0,Y,0,0)},uMistCyl:s.uniforms.uMistCyl,uMistCol:s.uniforms.uMistCol});const Pe={value:(z==="none"?.36:.4)-(V-1)*.15},Me=await za(n,l.fork("stones"),Math.round(1800*C),be,oe,Pe,M);a.add(Me),await n.yield();const ve=Ma(be,oe,Pe,{uAmp:m.uAmp,uContrast:m.uContrast},Me.children.slice(0,5));a.add(ve),await n.yield(),a.add(Ca(l.fork("ochre"),be,oe)),await n.yield();let ne=null,ot=null;const $o=[new t.Vector3(0,12.9,1.5),new t.Vector3(0,7.35,-4.4)],Mt=new t.Vector3;z!=="none"&&(ne=Aa(oe,z==="trawler"?"#1f4a36":"#c8ccd0",z==="trawler"?"#e6e4dc":"#d8742a"),ne.rotation.order="YXZ",ne.rotation.y=Math.atan2(Je,et),ne.position.set(pe,0,xe),a.add(ne),ot=gt.makeGlows({rng:l.fork("lamps"),positions:[[pe,13,xe],[pe,7.4,xe]],color:"#FF5A1F",size:2.4,intensity:2.2}),a.add(ot.object)),await n.yield(),await n.yield();const at=_e.makeFauna(a,{light:_e.lightFrom(a)}),Gt=N?{body:"#f4f1e8",belly:"#ffffff",wingC:"#4a3c2c",trail:"#32281e",tip:"#16130f",beak:"#9fc0d8",head:"#f1e9d0"}:{body:"#f1f2f0",belly:"#ffffff",wingC:"#c2c8d0",trail:"#dfe3e8",tip:"#30333a",beak:"#e4572a",head:"#15161a"};await n.yield(),at.add(_e.makeFlock({rng:l.fork("terns"),species:"gulls",count:14,size:N?1.1:.92,speed:20,flap:4.2,glide:.25,spread:[8,2.2,2.6],wander:[1.8,1.5,1.2,.6],...Gt,along:{path:M,side:-2.5,up:1.1,lead:5.8,from:.14,to:.43,drift:1.2}})),await n.yield(),at.add(_e.makeFlock({rng:l.fork("shear"),species:"gulls",count:16,size:.85,glide:.92,flap:3,spread:[16,.7,22],wander:[3,.5,3,.3],body:"#3a3028",belly:"#f2f0ea",wingC:"#40362c",trail:"#2e261f",tip:"#1c1814",beak:"#3a3a3a",head:"#3a3028",along:{path:M,side:-13,up:-1.2,lead:30,from:0,to:.46,drift:6}})),await n.yield(),at.add(_e.makeFlock({rng:l.fork("line"),species:"gulls",count:Math.round(20*V),size:.8,...Gt,center:[-45,13,-350],radius:55,wander:[5,2.5,4,.35],maxSigma:3,keepClear:{path:M,dist:2.5,up:!0,step:2}})),await n.yield();let fo=.7;for(let i=0;i<=100;i++){const r=.55+i*.004;if(M.pointAt(r).y>=235){fo=r;break}}const mo=M.pointAt(fo),po={body:"#17171c",belly:"#1e1e24",wingC:"#15151a",trail:"#101014",tip:"#0c0c10",beak:"#8a8a90",head:"#17171c",tailC:"#121216"};at.add(_e.makeFlock({rng:l.fork("frig"),species:"eagles",count:6,size:1.2,soarRadius:9,soarLift:4,spread:[12,16,12],center:[mo.x-.671*26,290,mo.z-.741*26],radius:5,height:0,...po})),await n.yield(),at.add(_e.makeFlock({rng:l.fork("frig2"),species:"gulls",count:3,size:2.5,glide:.97,flap:1.3,spread:[3,3,7],wander:[1.2,1.2,1.6,.35],...po,along:{path:M,side:1.5,up:-9,lead:24,from:.655,to:1-(ga+24)/M.length,drift:2}})),await n.yield();const Ot=gt.makeParticles({rng:l.fork("ash"),preset:"ash",count:Math.round(1500*C)});a.add(Ot.object),await n.yield();let Ct=null;j==="rainbow"&&!h.night&&(Ct=gt.makeRainbow({sunDir:F,intensity:.26}),a.add(Ct.object));let st=null;te&&(st=gt.makeDustDevil({rng:l.fork("spout"),position:[T.x,0,T.z],height:300,radius:[7,42],size:[40,110],color:"#d8d5cc",colorTop:"#f1eee6",shadowColor:"#7F93AD",opacity:.5,debrisSize:1.2,sunDir:F}),st.object.visible=!1,a.add(st.object));const At=Na(oe);a.add(At);const vo=ae(Do),Ht=At.material.uniforms.uAt.value,Eo=At.material.uniforms.uFrom.value;{const i=M.pointAt(vo),r=vo*M.length,d=M.posAtDist(r-2),L=M.posAtDist(r+2),ie=L.x-d.x,J=L.z-d.z,ye=Math.hypot(ie,J)||1;Ht.set(i.x+J/ye*Lo,0,i.z-ie/ye*Lo);const ce=b.x-Ht.x,Ce=b.z-Ht.z,Le=Math.hypot(ce,Ce)||1;Eo.set(ce/Le*.64,.77,Ce/Le*.64).normalize()}const Go=3.4,_t=new t.Vector3(b.x-fe.x,0,b.z-fe.z).normalize(),Oe={uCloud:{value:new t.Vector3(Y,0,0)},uFlow:{value:_t},uGlowA:{value:new t.Vector4(0,1,0,0)},uGlowB:{value:new t.Vector4(0,1,0,0)},uGlowP:{value:new t.Vector4(0,1,0,0)},uGlowQ:{value:new t.Vector4(0,1,0,0)},uIn:{value:0},uSeedV:{value:new t.Vector3(U*97,e*61,ee*83)},uLightV:{value:F.clone().add(new t.Vector3(0,1,0)).normalize()},uMist:s.uniforms.uMist,uMistCyl:s.uniforms.uMistCyl,uMistCol:s.uniforms.uMistCol,uSunCol:s.uniforms.uSunCol,uSkyCol:s.uniforms.uSkyCol,uSurgeCol:s.uniforms.uSurgeCol};a.add(Io(Oe,!1),Io(Oe,!0)),await n.yield();const Wt=i=>s.uniforms.uSurgeCol.value.clone().multiply(new t.Color(1.02,1,.97)).multiply(s.uniforms.uSunCol.value.clone().multiplyScalar(i).add(s.uniforms.uSkyCol.value.clone().multiplyScalar(.4))),Nt=gt.makeParticles({rng:l.fork("streaks"),preset:"ash",mode:"streak",shape:"disc",count:Math.round(280*C),box:[44,26,44],velocity:[-_t.x*30,-.6,-_t.z*30],velocityRandom:[9,3,9],turbulence:[.6,.3,.8],size:[.13,.3],stretch:.05,core:0,colors:[Wt(.04),Wt(.16),Wt(.72)],intensity:1,opacity:1,additive:0,near:[3,8],renderOrder:31});Nt.setOpacity(0),a.add(Nt.object),at.add(_e.makeFlock({rng:l.fork("terns2"),species:"gulls",count:6,size:N?1.1:.92,speed:20,flap:4.2,glide:.25,spread:[5,1.8,2.4],wander:[1.6,1.3,1.2,.6],...Gt,along:{path:M,side:3.2,up:.8,lead:7.4,from:.19,to:.42,drift:1}})),await n.yield();const ht=s.anchors.portalSeat.position.clone().add(new t.Vector3(Se,0,ze)),pt=s.anchors.roof.clone().add(new t.Vector3(Se,0,ze)),jt=Fa(oe,l.fork("skybombs"),s.timeline.period);a.add(jt);{const i=jt.material.uniforms,r=Math.hypot(pt.x-ht.x,pt.z-ht.z);i.uZone.value.copy(ht),i.uSpan.value.set(r,2*r,(pt.y-ht.y)/4),i.uVentB.value.copy(b),i.uAlo.value.set(pt.x-ht.x,0,pt.z-ht.z).normalize()}await n.yield();const Oo=new t.Vector3(.74*.8+.67*.45,.5,-.67*.8+.74*.45).normalize(),Ho=new t.Vector3(.74*.25-.67*.55,.8,-.67*.25-.74*.55).normalize();await n.yield(),await y.prewarm(n.renderer,null,a);let Qt=0;for(let i=150;i<=330;i+=5)Qt=Math.max(Qt,s.heightAt(.741*i,-.671*i));let _o=Ne;for(let i=Ne*M.length;i<Ze*M.length;i+=2.5)if(M.posAtDist(i).y>=Qt){_o=i/M.length;break}const Ta=new t.Vector3(Se,0,ze),Ft=[[.6,0,40],[.685,0,57],[.748,-17,-35],[.795,13,-27],[.843,-19,42],[.925,0,58],[1,0,58]],Wo=new t.Vector3,wo=new t.Vector3;function jo(i,r){let d=1;for(;d<Ft.length-1&&r>Ft[d][0];)d++;const L=Ft[d-1],ie=Ft[d],J=R(L[0],ie[0],r),ye=it(L[1],ie[1],J)*Math.PI/180,ce=it(L[2],ie[2],J)*Math.PI/180,Ce=Math.cos(ye),Le=Math.sin(ye);return wo.set((.741*Ce+.671*Le)*Math.cos(ce),Math.sin(ce),(-.671*Ce+.741*Le)*Math.cos(ce)),M.pointAt(r,Wo).addScaledVector(wo,300)}const yo=ae(va),Qo=ae(wa),Ko=ae(Rt+(lo-Rt)/3),Kt=n.core.makeRng(n.core.hashSeed("ember:"+n.seed)),Xo=Kt()*It,Zo=Kt()*1e3,Yo=Kt()*.75,we=(i,r)=>{const d=Math.sin(i*127.1+r*311.7+Zo)*43758.5453;return d-Math.floor(d)},Uo=(i,r)=>{const d=i-(r*.75+we(r,2)*.3);return we(r,1)<.86&&d>0?(d<.3?R(0,.3,d):Math.exp(-(d-.3)/.3))*(.6+.4*we(r,4)):0},Jo=(i,r)=>{const d=i-(r*.75+we(r,2)*.3);if(!(we(r,1)<.86&&d>0&&d<bt))return 0;const L=d<xt?d/xt:(bt-d)/(bt-xt);return(L-.3*Math.sin(2*Math.PI*L)/(2*Math.PI))*(.6+.4*we(r,4))},ea=(i,r)=>r.set((b.x+T.x)*.5+(we(i,7)-.5)*300,10+90*we(i,8),(b.z+T.z)*.5+(we(i,9)-.5)*300),ta=(i,r)=>r.set(b.x+(we(i,5)-.5)*80,60+240*we(i,3),b.z+(we(i,6)-.5)*80),re=new t.Vector3,He=new t.Vector3,Ve=new t.Vector3,Xt=new t.Color,Tt=s.timeline;let Zt=-1,go=0,ut=0,xo=0,bo=1,Yt=0;const vt=[-1e9,-1e9],So=[0,0],dt=[0,0],De=[1,1],ft=[0,0],qt=[0,0];function oa(i,r,d,L){d.getWorldPosition(re);const ie=Zt<0?1:Math.abs(L-Zt),J=de(r-go,0,30);if(ie>.02)ut=0;else if(ie<1e-7)ut+=J;else{const K=Math.round(ut/12)*12;ut+=de(K-ut,-.35*J,.35*J)}Zt=L,go=r;const ye=Q(L)+Re,ce=ye+ut;s.setClock(ce),s.setLightningGain(1-R(.9,.93,L));const Ce=s.surge(ce),Le=ye-lt,Ut=Le>=-.05?1:0,Jt=Tt.surgeR0+Tt.surgeSpeed*Math.max(Le,0),nt=Jt-Math.hypot(re.x-b.x,re.z-b.z),Bt=Ut*R(0,.9,Le)*(1-R(190,330,nt)),eo=Vo(nt)*Math.sqrt(Bt),mt=eo/co,to=1.04*(1-R(.5,1,mt));be.uStoneK.value=to,Me.visible=to>.001&&re.y<Y+12;for(let K=0;K<5;K++){const _=Me.children[K];_.geometry.instanceCount=Math.min(_.userData.full,Math.ceil(_.userData.full*Math.max(0,to+.12)))}ve.visible=re.y<Y+12;{const K=jt.material.uniforms;K.uClockB.value=ce,K.uSeaT.value=r}s.update(i,r,d);const aa=h.night&&!n.through?R(Y,Y+50,re.y):0;s.setLight({skyIntensity:h.ambI*(1+1.2*aa)});const sa=nt>0?Math.exp(-eo*eo*nt*nt):1,zo=Ce.strength*(Ut&&ye<lt+Tt.surgeLife-.02?1:0)*R(1/50,1/4,sa),ko=zo>.002;s.uniforms.uSurge.value.y=zo,s.setSurgeShown(ko),s.setNear(Ut>0&&nt>0&&!ko&&!n.through),s.setNearGrow(R(0,Y,re.y));const Mo=1-R(Y-22,Y+3,re.y),na=mt,Co=R(0,180,Jt-Tt.surgeR0),Ao=ma*Math.sqrt(Bt)*Co*(1-.92*R(Y-26,Y+70,re.y)),wt=Math.min(Ao,.014)*Mo*mt,Pt=r+Yo,oo=Math.floor(Pt/.75);let Vt=0;He.set(0,0,0);for(let K=0;K<3;K++){const _=Uo(Pt,oo-K);_>0&&(Vt=Math.max(Vt,_),He.addScaledVector(ta(oo-K,Ve).sub(re).normalize(),_))}const yt=Math.min(1,2*mt)*Mo;Xt.copy(x).multiplyScalar(1+.05*Vt*(1-yt)),s.setMist(Ao,Y,Xt,Jt);const ao=R(-110,-30,nt)*Math.min(1,Bt*2)*(1-.9*R(60,180,re.y));m.uDeep.value.copy(f[0]).lerp(w[0],ao),m.uShallowColor.value.copy(f[1]).lerp(w[1],ao*.92),m.uScatter.value.copy(f[2]).lerp(w[2],ao),c.density=Math.hypot(h.haze,wt),c.color.copy(u).lerp(Xt,wt*wt/(wt*wt+h.haze*h.haze)),S||se.value.set(c.color.r,c.color.g,c.color.b,c.density),Oe.uCloud.value.set(Y,r,Math.min(1,Math.sqrt(Bt)*2.2)*Co*(1-R(Y-33,Y-9,re.y))),He.lengthSq()<1e-8&&He.set(0,1,0),He.normalize(),Oe.uGlowA.value.set(He.x,He.y,He.z,Vt*(1-yt)),Oe.uIn.value=yt,ue.value=yt;const so=yt*(1-R(Y-33,Y-9,re.y)),Dt=P(L),no=J>1e-4&&J<=.25&&ie<=.05,Lt=no?de((Dt-xo)/J,0,40):1;xo=Dt,Yt=no?Yt+1:0;const ia=Lt+(Yt>1?.7*Math.max(0,(Lt-bo)/J-.3):0);bo=Lt,no||(vt[0]=vt[1]=-1e9);for(let K=0;K<2;K++){const _=oo-K,q=_&1,Te=Pt-_*.75-we(_,2)*.3,To=q?Oe.uGlowQ.value:Oe.uGlowP.value;let io=0;if(Te>0&&Te<bt&&(so>0||vt[q]===_)){const qo=vt[q]!==_;qo&&(vt[q]=_,So[q]=Dt-Lt*Te);const ro=Math.min(Ye(So[q]),Ye(Dt+ia*(bt-Te)));if(qo)dt[q]=ro,De[q]=1,ft[q]=0,qt[q]=0;else if(ft[q]===0){const Bo=.98*dt[q]*De[q]-.005;qt[q]=ro<Bo?qt[q]+1:0,so<Bo||qt[q]>2?ft[q]=De[q]/Math.max(.36,.72-Te):De[q]+=de((dt[q]>1e-6?Math.min(1,ro/dt[q]):0)-De[q],-J/xt,J/xt)}ft[q]>0&&(De[q]=Math.max(0,De[q]-J*ft[q])),io=Jo(Pt,_)*(ft[q]>0?dt[q]*De[q]:Math.min(dt[q]*De[q],so))}io>0?(ea(_,Ve).sub(re).normalize(),To.set(Ve.x,Ve.y,Ve.z,io)):To.w=0}const ra=mt*(1-R(Y-30,Y-20,re.y)),No=de(((r+Xo)%It+It)%It/pa,0,1);Ve.copy(Oo).lerp(Ho,No).normalize(),Oe.uGlowB.value.set(Ve.x,Ve.y,Ve.z,Math.pow(Math.sin(Math.PI*No),.7)*.7*ra),Ot.setOpacity(de(.2+.45*R(.2,.5,L)+na,0,1)*(h.night?.45:1));const Fo=mt*(1-R(Y-30,Y-13,re.y));Nt.setOpacity(Fo>.02?Math.min(.6,Fo):0),Nt.update(i,r,d),y.update(i,r,d),k.update(i,r,d),o.update(i,r,d),Ge.set(o.surface.position.x,o.surface.position.z),Ot.update(i,r,d);{const K=P(L)-Do,_=At.material.uniforms,q=!n.through&&K>-Go-.1&&K<13;_.uEv.value.x=q?K:-99,q&&(_.uSeaT.value=r,_.uAt.value.y=o.heightAt(_.uAt.value.x,_.uAt.value.z,r))}if(Ct&&Ct.update(i,r,d),at.update(i,r,d,L),ne){const K=o.heightAt(pe+Je*10,xe+et*10,r),_=o.heightAt(pe-Je*10,xe-et*10,r),q=o.heightAt(pe,xe,r);ne.position.y=(K+_+q)/3*.7-.1,ne.rotation.x=-Math.atan2(K-_,20)*1.5,ne.rotation.z=.035*Math.sin(r*.8),ne.updateMatrixWorld();for(let Te=0;Te<2;Te++)Mt.copy($o[Te]).applyMatrix4(ne.matrixWorld),ot.setPosition(Te,Mt.x,Mt.y,Mt.z);ot.update(i,r,d)}if(st){const K=R(yo,Qo,L)*(1-R(ke,Ko,L)),_=R(yo,ke,L);st.object.visible=K>.01,st.uniforms.uBase.value.set(it(T.x,Se-30,_),-300*(1-K),it(T.z,ze+70,_)),st.update(i,r,d)}}return{scene:a,path:M,duration:$t,pace:I,camera:{fov:xa,near:.3,far:9e3,lookAhead:30,nearThrough:.3},pois:[{at:[(b.x+T.x)/2,600,(b.z+T.z)/2],from:.045,to:.14,weight:.4,fade:.33},{at:[g.x,g.y,g.z],from:.17,to:.56,weight:.6},{at:jo,from:.615,to:.95,weight:.94,fade:.1}],portal:{shape:"circle",radius:9,color:"#FFE2C0",glow:1,revealDistance:420,tilt:!0},post:{exposure:h.exposure,bloom:{strength:.34,radius:.6,threshold:.93},grade:{saturation:.97,contrast:1.05,tint:h.tint,shadowTint:h.shadow,vignette:.3,grain:.02,aberration:0}},ride:"none",update:oa,dispose(){y.dispose()}}}};export{La as default};
