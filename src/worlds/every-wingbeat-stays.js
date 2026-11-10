import*as l from"three";import{makePath as pt,clamp as Me,lerp as ue,smoothstep as ee,bell as We}from"../kit/core.js";import{buildHero as at,flightPlan as dt,makeTone as mt,GLSL_COLOUR as je,GLSL_INK as gt}from"../parts/every-wingbeat-stays.js";const W=Math.PI*2,wt={noon:{sky:["#F2E7D0","#EBD9A8","#BFD6C8","#8FBFB0","#4F9F92","#1E8C72","#1B5E73"],sun:"#FBF3DC",wedge:["#F7EBC9","#EBCB86"],dune:["#E3D2A6","#D6C28F","#5B4A86","#4A3C74","#1E8C72","#2C9C80"],rock:"#E9DDC2",warm:"#EBD9A8",cool:"#4F9F92",pal:["#F3C52E","#E24A2A","#B5347C","#2747A8","#1E8C72","#F2E7D0","#221F2A"],leaf:["#1E8C72","#5B4A86","#2C6E8C"],rod:"#BFD6C8",ring:"#FFF2CF"},evening:{sky:["#FBE6C4","#F6C9A2","#EDA59A","#D0839F","#A56BA6","#75559A","#46407A"],sun:"#FFF1D2",wedge:["#FDE3B8","#F3B98A"],dune:["#F0C8A0","#E4B088","#5A3F7A","#472F66","#8A5E8E","#9A6C98"],rock:"#F3DCC4",warm:"#F6C9A2",cool:"#75559A",pal:["#FFF0C4","#F07E2A","#C4264E","#5C2670","#3E7F8C","#F8E8CE","#2A1F33"],leaf:["#3E7F8C","#5A3F7A","#7A4E86"],rod:"#EDA59A",ring:"#FFF0D8"},blue:{sky:["#FBEEDC","#EBCBD8","#B9AEE4","#8E90D4","#6472BC","#43549C","#273772"],sun:"#FFFFFF",wedge:["#FCEFE2","#F0CFD6"],dune:["#746CB2","#655DA4","#2E2B64","#262354","#4565AA","#5173B6"],rock:"#E8E3F0",warm:"#D9C6E6",cool:"#5A6AB4",pal:["#FBF9F0","#7FE0BE","#2B55C8","#20244E","#2E8C8C","#F1EEF6","#1C1D33"],mids:["#C4D3F4","#8FD6CC",null,null,"#343C7C"],comps:["#384A94","#34609E","#2A4FA8","#C6BCEC","#8E92DA"],leaf:["#3FA8A0","#B9AEE4","#8FB0E0"],rod:"#B9AEE4",ring:"#FFFFFF"}};function vt(a,f){const F=a.length,m=[],s=new Array(F);for(let n=0;n<F-1;n++)m.push((f[n+1]-f[n])/Math.max(a[n+1]-a[n],1e-6));s[0]=m[0],s[F-1]=m[F-2];for(let n=1;n<F-1;n++)s[n]=m[n-1]*m[n]<=0?0:2*m[n-1]*m[n]/(m[n-1]+m[n]);return n=>{n=Me(n,a[0],a[F-1]);let c=0;for(;c<F-2&&n>a[c+1];)c++;const V=a[c+1]-a[c],g=(n-a[c])/Math.max(V,1e-6),w=g*g,i=w*g;return f[c]*(2*i-3*w+1)+s[c]*V*(i-2*w+g)+f[c+1]*(-2*i+3*w)+s[c+1]*V*(i-w)}}const ye=[[2600,150],[1900,-130],[1400,90],[1e3,-70],[700,0],[520,0],[455,15],[270,37],[120,-40],[-160,50],[-520,-80],[-900,70],[-1400,-110],[-1900,100],[-2600,-90]];function pe(a){for(let f=0;f<ye.length-1;f++){const F=ye[f],m=ye[f+1];if(a<=F[0]&&a>=m[0])return ue(F[1],m[1],(F[0]-a)/(F[0]-m[0]))}return a>0?ye[0][1]:ye[ye.length-1][1]}const Be=220,be=a=>{const f=Math.sin(a*127.1+311.7)*43758.5453;return f-Math.floor(f)};function ot(){const a=[],f=[],F=[],m=[],s=(n,c,V,g,w)=>{a.push(n[0],n[1],n[2],c[0],c[1],c[2],V[0],V[1],V[2]);const i=w===3?1:0,D=w===1?1:0,j=w===2?1:0;f.push(1,D,j,i,1,j,i,D,1);const Z=(n[0]+c[0]+V[0])/3,y=(n[1]+c[1]+V[1])/3,X=(n[2]+c[2]+V[2])/3;for(let _=0;_<3;_++)F.push(g.r,g.g,g.b),m.push(Z,y,X)};return{tri(n,c,V,g){s(n,c,V,g,0)},quad(n,c,V,g,w,i=w,D=!1){s(n,c,V,w,D?0:1),s(n,V,g,i,D?0:2)},count:()=>a.length/9,geometry(n){const c=n?new l.InstancedBufferGeometry:new l.BufferGeometry;return c.setAttribute("position",new l.Float32BufferAttribute(a,3)),c.setAttribute("aBary",new l.Float32BufferAttribute(f,3)),c.setAttribute("aColor",new l.Float32BufferAttribute(F,3)),c.setAttribute("aCen",new l.Float32BufferAttribute(m,3)),c}}}const Mt=`
  attribute vec3 aBary, aColor, aCen; uniform float uNearPlain;
  varying vec3 vBary, vCol, vSky; varying float vLight;
  ${je}
  void main(){
    vec4 cw = modelMatrix * vec4(aCen, 1.);
    float dc = distance(cw.xyz, cameraPosition), st = depthSteps(dc);
    vSky = skyTone(cw.xyz - cameraPosition); vLight = 0.16*st;
    // the ground right under the lens is plain cut paper: its ink lines begin 45 m out (a line on a facet seen at a
    // grazing angle from a few metres is a heavy black bar across the foreground)
    vCol = mix(aColor, vSky, vLight); vBary = mix(aBary, vec3(1.), uNearPlain*(1. - smoothstep(45., 110., dc)));
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.);
  }
`,Ge=`
  varying vec3 vBary, vCol, vSky; varying float vLight;
  ${gt}
  void main(){ gl_FragColor = vec4(inked(vCol, vBary, vLight, vSky), 1.); }
`,yt=`
  attribute vec3 aColor; varying vec3 vCol; uniform float uSpin; uniform vec3 uAxis;
  void main(){
    vec3 p = position;
    #ifdef WEDGE
      float c = cos(uSpin), s = sin(uSpin);
      p = p*c + cross(uAxis, p)*s + uAxis*dot(uAxis, p)*(1. - c);     // the fan turns about the sun's own axis
    #endif
    vCol = aColor;
    vec4 mv = viewMatrix * vec4(mat3(modelMatrix) * p + cameraPosition, 1.);
    vec4 cp = projectionMatrix * mv;
    if (abs(cp.w) < 1e-4) cp.w = 1e-4;                                 // a vertex exactly beside a level camera
    gl_Position = cp.xyww;                                             // at the far plane, behind everything
  }
`,bt="varying vec3 vCol; void main(){ gl_FragColor = vec4(vCol, 1.); }",nt=17;function kt(a,f){return a<=-1?f<40?1:f<85?2:0:a>=1?f>180?1:f>135?2:0:f<40||f>180?1:f<70||f>165?2:f<95?1:0}function st(a){return a<40?1-a/40:a<85?0:Math.pow((a-85)/135,1.12)}function At(a,f){const F=(g,w)=>{let i=37+8*a.n2(g*3.7+11,w/260);g>=-1&&g<=1&&(i=ue(i,43-2*Math.abs(g)-(g<0?1:0),ee(150,240,w)*(1-ee(760,900,w))));const D=Math.min(Math.abs(g)-1,4);return D>0&&(i*=1+.65*D),i},m=(g,w)=>ue(.3,1,ee(215,350,Math.hypot(g,w))),s={n:0,px:[],py:[],pz:[],x0:1e9,x1:-1e9,z0:1e9,z1:-1e9},n=new l.Vector3;for(let g=0;g<=260&&(f.pointAt(g/260*.5,n),!(n.y>120));g++)s.px.push(n.x),s.py.push(n.y),s.pz.push(n.z),s.n++,s.x0=Math.min(s.x0,n.x-62),s.x1=Math.max(s.x1,n.x+62),s.z0=Math.min(s.z0,n.z-62),s.z1=Math.max(s.z1,n.z+62);const c=(g,w,i)=>{const D=pe(i)+g*Be+w;let j;g<=-1?j=(w<62?F(g,i):F(g+1,i))*st(w):g>=1?j=(w<158?F(g,i):F(g+1,i))*st(220-w):j=w<40?F(0,i)*(1-w/40):w>180?F(1,i)*(w-180)/40:w<70||w>165?0:nt*(w<95?(w-70)/25:Math.pow((165-w)/70,1.12));let Z=j*m(D,i);if(Z>30&&D>s.x0&&D<s.x1&&i>s.z0&&i<s.z1){let y=1e9,X=0;for(let o=0;o<s.n;o++){const B=s.px[o]-D,T=s.pz[o]-i,oe=B*B+T*T;oe<y&&(y=oe,X=s.py[o])}const _=Math.sqrt(y);_<60&&(Z=Math.min(Z,X-12+Math.max(0,_-5)*.9))}return Z};return{raw:c,at:(g,w)=>{const i=g-pe(w),D=Math.floor(i/Be);return c(D,i-D*Be,w)},crestH:F,basin:m}}async function Ze(a,f,F,m,s,n,c,V,g,w){const i=m.dune.map(o=>F(o)),D=F(m.sky[0],.94),j=(o,B,T)=>F(new l.Color(o).lerp(new l.Color(B),T)),Z=[j(m.dune[0],m.dune[2],.42),j(m.dune[0],m.dune[2],.58),j(m.dune[0],m.dune[2],.3)],y=[];for(let o=n;o<=c;o++){const B=V(o);for(let T=0;T<B.length-(o<c?1:0);T++)y.push({i:B[T]>=220?o+1:o,s:B[T]>=220?B[T]-220:B[T],key:o*400+B[T]})}const X=s.length,_=new Array(y.length);for(let o=0;o<y.length;o++){o%6===5&&await w();const B=y[o],T=o===0||o===y.length-1,oe=_[o]=new Array(X);for(let G=0;G<X;G++){const Y=G<X-1?Math.abs(s[G+1]-s[G]):50,se=T?0:(be(B.key*1.31+G*7.7)-.5)*Math.min(Y*.5,14),r=s[G]+se,E=B.s===0,$=T?0:(be(B.key*2.17+G*3.3)-.5)*(E?Math.abs(B.i)<=1&&r>120&&r<800?1:3.2:Math.min(Y*.45,9));let L=f.raw(B.i,B.s+$*(E?0:1),r);const H=Math.abs(B.i)<=1&&r>120&&r<800;E&&!H&&(L*=1-.1*be(G*5.1+B.i)),T&&g&&(L-=.35),oe[G]=[pe(r)+B.i*Be+B.s+$,L,r]}}for(let o=0;o<y.length-1;o++){const B=y[o].s,T=y[o+1].s===0?219:(B+.5)%220,oe=y[o].i,G=kt(oe,T),Y=y[o+1].s===0?y[o+1].i:y[o].i+(B>=62?1:0),se=G===0&&(oe>=1?B<22:oe===0?B<108:Y!==0&&(y[o+1].s===0||B>=196&&B<220)),r=G===0&&!se&&(y[o].i===0||y[o].i===-1)&&B>=132&&B<148;o%8===7&&await w();for(let E=0;E<X-1;E++){const $=_[o][E],L=_[o+1][E],H=_[o][E+1],K=_[o+1][E+1],re=be(y[o].key*.731+Math.floor(E/(g?1:2))*13.7),ce=be(y[o].key*1.9+E*3.1),te=r?Z[2]:se?Z[re>.55?1:0]:G===0&&ce>.9?D:i[G*2+(re>.55?1:0)],ge=r?ce>.5?Z[2]:Z[0]:se?Z[ce>.62?1:0]:i[G*2+(ce>.62?1:0)];(o+E)%2?a.quad($,L,K,H,te,G===2?te:ge):a.quad(L,K,H,$,te,G===2?te:ge)}}}function xt(a,f,F,m){const s=new l.Group,n=new l.Vector3(0,1,0).cross(m).normalize(),c=new l.Vector3().crossVectors(m,n),V=[],g=[],w=F.sky.map(r=>f(r)),i=new l.Color,D=(r,E)=>{const $=Math.sin(r),L=Math.cos(r),H=$*Math.cos(E),K=$*Math.sin(E);return[m.x*L+n.x*H+c.x*K,m.y*L+n.y*H+c.y*K,m.z*L+n.z*H+c.z*K]},j=64,Z=[],y=a.range(0,W);for(let r=0;r<j;r++)Z.push(y+(r+a.range(-.38,.38))/j*W);for(let r=0;r<j;r++){const E=Z[r],$=Z[(r+1)%j]+(r===j-1?W:0);let L=.035+a.range(0,.1),H=0;for(;L<Math.PI-.02;){const te=Math.min(L+a.range(.15,.3),Math.PI-.02),ge=(L+te)*.5*57.296;let Q=Me(ge/27.5+(r%2?.2:-.2)+(be(r*7.3+H*3.1)-.5)*.3,0,6);Q=Math.round(Q*3)/3;const we=Math.min(Math.floor(Q),5);i.copy(w[we]).lerp(w[we+1],Q-we);const ze=D(L,E),de=D(L,$),Ee=D(te,E),ae=D(te,$);V.push(...ze,...Ee,...ae,...ze,...ae,...de);for(let ke=0;ke<6;ke++)g.push(i.r,i.g,i.b);L=te,H++}const K=D(.14,E),re=D(.14,$),ce=w[0];V.push(m.x,m.y,m.z,...K,...re);for(let te=0;te<3;te++)g.push(ce.r,ce.g,ce.b)}const X=(r,E,$)=>{const L=new l.BufferGeometry;L.setAttribute("position",new l.Float32BufferAttribute(r,3)),L.setAttribute("aColor",new l.Float32BufferAttribute(E,3));const H=new l.Mesh(L,new l.ShaderMaterial({uniforms:{uSpin:{value:0},uAxis:{value:m.clone()}},defines:$,vertexShader:yt,fragmentShader:bt,depthWrite:!1,depthTest:!0,side:l.DoubleSide,fog:!1,toneMapped:!1}));return H.frustumCulled=!1,s.add(H),H};X(V,g,{}).renderOrder=-30;const _=(r,E)=>[m.x+(n.x*Math.cos(r)+c.x*Math.sin(r))*E,m.y+(n.y*Math.cos(r)+c.y*Math.sin(r))*E,m.z+(n.z*Math.cos(r)+c.z*Math.sin(r))*E],o=[],B=[],T=F.wedge.map(r=>f(r));for(let r=0;r<20;r++){const E=r/20*W,$=Math.tan((35+35*be(r*3.3+a.range(0,1)))/57.296),L=.055+.018*(r%3),H=T[r%2];o.push(..._(E,.03),..._(E-L,$),..._(E+L,$));for(let K=0;K<3;K++)B.push(H.r,H.g,H.b)}const oe=X(o,B,{WEDGE:1});oe.renderOrder=-29;const G=[],Y=[],se=f(F.sun);for(let r=0;r<10;r++){G.push(..._(0,0),..._(r/10*W,.0437),..._((r+1)/10*W,.0437));for(let E=0;E<3;E++)Y.push(se.r,se.g,se.b)}return X(G,Y,{}).renderOrder=-28,{group:s,update(r){oe.material.uniforms.uSpin.value=r*.01745}}}const Ie=`
  attribute vec3 aBary; attribute vec4 aInfo;            // aInfo: role, part, extra, extra
  attribute float aI; attribute vec4 aM, aM2;            // per mover
  uniform float uT, uN, uD, uPx; uniform float uBand[4];
  varying vec3 vBary, vCol, vSky; varying float vLight;
  ${je}
  const float TAU = 6.2831853;
  float echoTime(float t, float o){ return aI < 0.5 ? t : (floor((t + o)/uD) - (aI - 1.))*uD - o; }
  // colour is time: life 0 (now) .. 1 (oldest self); each border is crossed softly, in under half a second
  vec3 lifeColour(float life, float role){
    float w = 0.45/max(uN*uD, 0.5);
    float k1 = smoothstep(uBand[0], uBand[0]+w, life), k2 = smoothstep(uBand[1], uBand[1]+w, life);
    float k3 = smoothstep(uBand[2], uBand[2]+w, life), k4 = smoothstep(uBand[3], uBand[3]+w, life);
    vec3 h = mix(mix(mix(mix(uHue[0], uHue[1], k1), uHue[2], k2), uHue[3], k3), uHue[4], k4);
    vec3 m = mix(mix(mix(mix(uMid[0], uMid[1], k1), uMid[2], k2), uMid[3], k3), uMid[4], k4);
    vec3 c = mix(mix(mix(mix(uComp[0], uComp[1], k1), uComp[2], k2), uComp[3], k3), uComp[4], k4);
    return role < 0.5 ? h : role < 1.5 ? m : role < 2.5 ? c : role < 3.5 ? uCream : uInk;
  }
  // small things keep a floor of a few pixels and shrink to nothing far away; the last three selves shrink away
  float sizeFloor(vec3 centre, float size, float age){
    float d = distance(centre, cameraPosition), px = size*uPx/max(d, 1.);
    return max(1., 3./max(px, 0.01)) * (1. - smoothstep(560., 720., d)) * (1. - smoothstep(uN - 3., uN, age/uD));
  }
  void finish(vec3 P, vec3 centre, float age, float role){
    float st = depthSteps(distance(centre, cameraPosition));
    vSky = skyTone(centre - cameraPosition); vLight = 0.16*st;
    vCol = mix(lifeColour(clamp(age/(uN*uD), 0., 1.), role), vSky, vLight); vBary = aBary;
    gl_Position = projectionMatrix * viewMatrix * vec4(P, 1.);
  }
`,Ct=`
  ${Ie}
  void main(){
    float te = echoTime(uT, aM.w), age = uT - te;
    float tau = mod(te + aM.w*7.31 + 40., aM2.x), cyc = floor((te + aM.w*7.31 + 40.)/aM2.x);
    float f = clamp(tau/5., 0., 1.), sw = TAU*tau/6.4 + aM2.z;       // one slow sweep in a fall: twelve selves draw a single arc, not a zigzag
    float yaw = aM2.y + 0.6*sin(cyc*2.3 + aM.w);
    vec3 dir = vec3(cos(yaw), 0., sin(yaw));
    float big = step(1.9, aM2.w);                                    // the four great leaves by the entry
    float amp = aM2.w > 1.9 ? 14. : aM2.w > 1.6 ? 6.5 : 4.;          // they swing arcs a quarter of the frame wide
    // a great leaf crosses its arc at one even speed (end to end in 4 s), sagging 4 m in the middle like a pendulum: its
    // twelve selves stand 2.4 m apart all along the curve, never bunched at the ends
    float sg = 1. - 4.*abs(fract(tau/7.) - 0.5);
    vec3 c = aM.xyz + dir*(amp*mix(sin(sw)*smoothstep(0., 0.15, f), sg, big)) + vec3(0., -14.*f + mix(0.9*sin(sw)*sin(sw), -4.*(1. - sg*sg), big), 0.);
    float live = step(tau, 5.) * smoothstep(0., 0.04, f) * (1. - smoothstep(0.93, 1., f));
    float roll = mix(0.95, 0.3, big)*cos(sw), cr = cos(roll), sr = sin(roll);   // a great leaf barely rolls: its selves keep one size
    // a great leaf keeps all twelve selves whole to the blue tail (only the very last shrinks away)
    float sf = mix(sizeFloor(c, 1.4*aM2.w, age), (1. - smoothstep(560., 720., distance(c, cameraPosition))) * (1. - smoothstep(uN - 0.7, uN, age/uD)), big);
    vec3 q = position * aM2.w * live * sf;
    vec3 l = vec3(q.x*cr - q.y*sr, q.x*sr + q.y*cr, q.z);          // bank into the swing
    vec3 side = vec3(-dir.z, 0., dir.x);
    // a great leaf stands upright in the plane of its swing, facing the entry axis, its tip leaning the way it goes:
    // every self shows its whole kite (a small leaf lies flat and banks)
    float lean = 0.45*(1. - 2.*smoothstep(3.3, 3.7, tau)), cl = cos(lean), sl = sin(lean);
    vec3 P0 = c + dir*l.x + vec3(0., l.y, 0.) + side*l.z;
    vec3 P1 = c + dir*(q.x*cl + q.z*sl) + vec3(0., q.z*cl - q.x*sl, 0.) + side*q.y;
    finish(mix(P0, P1, big), c, age, aInfo.x);
  }
`,Ft=`
  ${Ie}
  uniform float uTrX[64], uTrY[64], uZA, uZB, uZ0;
  vec3 rotX(vec3 p, float a){ float c = cos(a), s = sin(a); return vec3(p.x, p.y*c - p.z*s, p.y*s + p.z*c); }
  float trX(float z){ float f = clamp((uZA - z)/(uZA - uZB), 0., 1.)*63.; int i = int(floor(f)); return mix(uTrX[i], uTrX[min(i + 1, 63)], fract(f)); }
  float trY(float z){ float f = clamp((uZA - z)/(uZA - uZB), 0., 1.)*63.; int i = int(floor(f)); return mix(uTrY[i], uTrY[min(i + 1, 63)], fract(f)); }
  void main(){
    float te = echoTime(uT, aM.w), age = uT - te;
    float zs = aM2.w > 0.5 ? uZA : uZ0;                  // lane 0 begins where the crest has stepped clear of the path
    float span = zs - aM2.z, dist = aM2.x*te + aM.z, south = 1. - step(0.5, aM2.w);    // lane 0 runs south, toward the lens: the living runner leads, its past recedes
    float z = mix(zs - mod(dist, max(span, 1.)), aM2.z + mod(dist, max(span, 1.)), south);
    float flat0 = step(0.5, aM2.w);
    vec3 c = vec3(trX(z) + aM.x, mix(trY(z), 43., flat0) + aM.y - 0.25, z);
    vec3 fwd = normalize(vec3(trX(z - 1.5) - trX(z + 1.5), 0., -3.)) * (1. - 2.*south);
    vec3 side = vec3(-fwd.z, 0., fwd.x);
    float ph = TAU*dist/6.4, part = aInfo.y;
    vec3 p = position;
    if (part > 0.5 && part < 8.5) {                       // legs: hip swing, knee folding on the recovery
      float l = part > 4.5 ? part - 4. : part;
      float off = l < 1.5 ? 0. : l < 2.5 ? 0.55 : l < 3.5 ? 3.3 : 3.85;
      vec3 hip = vec3(aInfo.z, 3.6, aInfo.w);
      float th = 0.6*sin(ph + off), kn = 1.05*max(0., sin(ph + off + 1.9));
      if (part > 4.5) { vec3 knee = hip - vec3(0., 1.8, 0.); p = knee + rotX(p - knee, kn); }
      p = hip + rotX(p - hip, th);
    } else if (part > 8.5) { vec3 nb = vec3(0., 4.35, 1.1); p = nb + rotX(p - nb, 0.16*sin(ph + 0.7)); }
    p.y += 0.2*sin(2.*ph) - 0.12;
    float sc = aM2.y * smoothstep(aM2.z, aM2.z + 22., z) * (1. - smoothstep(zs - 20., zs, z)) * (1. - smoothstep(uN - 3., uN, age/uD));
    p *= sc;
    finish(c + side*p.x + vec3(0., p.y, 0.) + fwd*p.z, c + vec3(0., 3., 0.), age, aInfo.x);
  }
`,Bt=`
  ${Ie}
  uniform float uTs, uFlap, uStretch, uGrow; uniform vec4 uFA[6], uFB[6];
  void main(){
    int f = int(aM2.x + 0.5);
    float t = f == 0 ? uTs : uT;
    float te = echoTime(t, aM.w), age = t - te, tl = te - aM2.w;
    vec4 A = uFA[f], B = uFB[f];
    float th = B.x*tl + B.y, cs = cos(th), sn = sin(th);
    float wob = sin(tl*1.3 + aM2.y);
    vec3 c = vec3(A.x + (A.w + aM.x + 2.*wob)*cs, A.y + B.z*(1. - cos(th - B.w)) + aM.y + 1.2*cos(tl*1.7 + aM2.y), A.z + (A.w + aM.x + 2.*wob)*sn);
    float sg = B.x < 0. ? -1. : 1.;
    vec3 fwd = normalize(vec3(-sn*sg, B.z*sin(th - B.w)*sg/max(A.w, 1.), cs*sg));
    vec3 right = normalize(cross(fwd, vec3(0., 1., 0.))), up = cross(right, fwd);
    float bank = 0.55*sg; right = right*cos(bank) + up*sin(bank); up = cross(right, fwd);
    vec3 p = position;
    if (aInfo.y > 0.5) { float a = (0.15 + 0.75*sin(TAU*5.*te + aM2.y*3.))*uFlap*(p.x > 0. ? 1. : -1.); float ca = cos(a), sa = sin(a); p = vec3(p.x*ca - p.y*sa, p.x*sa + p.y*ca, p.z); }
    // far off a self is a few pixels and sixteen of them are sixteen dots: each one draws out along its own track
    // until it meets the next, so a distant flock is a sheaf of fine strokes running from now to long ago
    float far = smoothstep(110., 300., distance(c, cameraPosition)) * (f == 0 ? 0. : 1.);
    p.z *= 1. + uStretch*far; p.x *= 1. - 0.4*far;
    float life = clamp(age/(uN*uD), 0., 1.), self = step(0.5, aI);
    // each comb of selves tapers from the bird to its oldest self; in the bow flock a self is a dart a third as wide as
    // its bird, so a comb is a fine line with a whole bird at its head
    // (the bow flock is a dense swirl of whole selves, its living birds half as large again as their newest selves)
    float taper = f == 0 ? mix(1.45, mix(1.15, 0.5, life), self) * uGrow : mix(1.3, 0.5, life);
    p *= aM2.z * sizeFloor(c, 2.6*aM2.z, age) * taper * (f == 0 ? 1. : 1. - smoothstep(240., 340., distance(c, cameraPosition)));
    finish(c + right*p.x + up*p.y + fwd*p.z, c, age, aInfo.x);
  }
`,zt=`
  ${Ie}
  void main(){
    float te = echoTime(uT, aM.w), age = uT - te;
    float q = (te + aM.w)/uD + 0.0005, n = floor(q), fr = q - n;
    float hop = aI < 0.5 ? smoothstep(0., 0.12, fr) : 0.;
    float idx = mod(n + aM2.w, 14.), along = (idx - 1. + hop) * 5.;
    vec3 dir = vec3(sin(aM.z), 0., cos(aM.z)), side = vec3(dir.z, 0., -dir.x);
    vec3 c = vec3(aM.x, aM2.y + aM2.z*along, aM.y) + dir*along;
    c.y += aI < 0.5 ? 3.2*sin(3.14159*clamp(fr/0.12, 0., 1.)) : 0.;
    float sc = aM2.x * smoothstep(0.2, 1.6, idx + hop) * (1. - smoothstep(11.5, 13., idx + hop));
    vec3 p = position * sc;
    if (aI > 0.5 && aInfo.y < 0.5) p = vec3(0., -1., 0.);          // ghosts: the windward body folds away
    finish(c + side*p.x + vec3(0., p.y, 0.) + dir*p.z, c, age, aInfo.x);
  }
`,Et=`
  attribute vec3 aBary; attribute vec4 aM, aM2; attribute vec3 aColor;
  uniform float uT; varying vec3 vBary, vCol, vSky; varying float vLight;
  ${je}
  void main(){
    float tau = fract((uT + aM.w)/aM2.x)*aM2.x, len = aM.z;
    float off = tau < 0.45 ? 300.*(1. - tau/0.45)*(1. - tau/0.45) : tau < 1.45 ? 0. : -len*min((tau - 1.45)/0.5, 1.)*min((tau - 1.45)/0.5, 1.);
    float live = step(tau, 1.95);
    vec3 axis = normalize(vec3(aM2.y, 1., aM2.z)), foot = vec3(aM.x, aM2.w, aM.y);
    vec3 mid = foot + axis*(off + 0.5*len);
    float w = max(0.7, distance(mid, cameraPosition)*0.0055) * live;      // slats of rain with weight, never hair lines
    vec3 P = foot + axis*max(off + position.y*len, -2.) + vec3(position.x, 0., position.z)*w;
    float st = depthSteps(distance(foot, cameraPosition));
    vSky = skyTone(foot - cameraPosition); vLight = 0.16*st;
    vCol = mix(aColor, vSky, vLight); vBary = aBary;
    gl_Position = projectionMatrix * viewMatrix * vec4(P, 1.);
  }
`;function De(a,f,F,m,s){return new l.ShaderMaterial({uniforms:{...a,uT:s,uN:{value:F},uD:{value:m},uPx:a.uPx,uBand:{value:[.09,.16,.495,.77]}},vertexShader:f,fragmentShader:Ge,side:l.DoubleSide,fog:!1,toneMapped:!1})}function Pe(a,f,F,m,s){const n=new l.InstancedBufferGeometry,c=[],V=[],g=[];for(const y of a){c.push(...y.p[0],...y.p[1],...y.p[2]);const X=y.hide||0,_=X===3?1:0,o=X===1?1:0,B=X===2?1:0;V.push(1,o,B,_,1,B,_,o,1);for(let T=0;T<3;T++)g.push(y.role,y.part||0,y.x||0,y.y||0)}n.setAttribute("position",new l.Float32BufferAttribute(c,3)),n.setAttribute("aBary",new l.Float32BufferAttribute(V,3)),n.setAttribute("aInfo",new l.Float32BufferAttribute(g,4));const w=f.length*(F+1),i=new Float32Array(w),D=new Float32Array(w*4),j=new Float32Array(w*4);f.forEach((y,X)=>{for(let _=0;_<=F;_++){const o=X*(F+1)+_;i[o]=_,D.set(y.a,o*4),j.set(y.b,o*4)}}),n.setAttribute("aI",new l.InstancedBufferAttribute(i,1)),n.setAttribute("aM",new l.InstancedBufferAttribute(D,4)),n.setAttribute("aM2",new l.InstancedBufferAttribute(j,4)),n.instanceCount=w;const Z=new l.Mesh(n,m);return Z.name=s,Z.frustumCulled=!1,Z}function St(){const a=ye.map(s=>s[0]),f=[2250,1650,1200,900];for(let s=875;s>700;s-=25)f.push(s);for(let s=693;s>240;s-=7)f.push(s);for(let s=240;s>-300;s-=16)f.push(s);f.push(-330,-365,-410,-465,-600,-700,-800,-1050,-1200,-1650,-2250);const F=[2250,1650,1200,850,610,380,195,45,-65,-250,-340,-430,-640,-770,-1050,-1200,-1650,-2250],m=s=>[...a,...s.filter(n=>a.every(c=>Math.abs(c-n)>3))].sort((n,c)=>c-n);return{fine:m(f),coarse:m(F)}}const Tt=(()=>{const a=[62,73,85];for(let f=93;f<216;f+=8)a.push(f);return a.push(220,227,234,241,248,254,260,271,282),a})(),It=[62,85,112,139,166,193,220,233,246,260,282],Dt=[62,85,130,175,198,220,240,260,282],Pt=[62,70,79,87,95,108,122,136,150,165,180,190,200,210,220,242,275,310,355,378],_t=[158,180,193,207,220,242,275,310,355,378],Vt=[158,180,200,220,242,290,355,378];var $t={id:"every-wingbeat-stays",name:"Every Wingbeat Stays",category:"bizarre",weirdness:.85,media:["air","open"],async build(a){const{rng:f,noise:F}=a,m=a.vary||{},s=Me(a.quality?.detail??1,.5,1),n=Me(m.density??1,.7,1.3),c=new l.Scene,V=m.mood??f(),g=m.hour||"any",w=g==="day"?"noon":g==="golden"||g==="dawn"?"evening":g==="night"||V<.2?"blue":V<.38?"evening":"noon",i=wt[w],D=f.fork("visit"),j=D.pick(["crane","crane","crane","condor","frigate"]),Z=D.chance(.3),y=D.chance(.35),X=Math.round(Me(40*n,24,56)),_=!!m.rare,o=mt(1);c.background=o(i.sky[2]);const B=new l.Vector3(-Math.cos(.489),Math.sin(.489),0),T=await at(a,{palette:i.pal,mids:i.mids,comps:i.comps,variant:j,detail:s,exposure:1,depthK:.1,ribbons:!1,crumble:12,blueFrom:.69});T.setSky(i.warm,i.cool,B),c.add(T.object),await a.yield();const oe=new l.Sphere(new l.Vector3(0,150,0),6e3),G=t=>t.traverse(e=>{e.geometry&&(e.geometry.boundingSphere=oe.clone())}),Y=T.uniforms,se=dt(T),r=pt(se.map(t=>t.p)),E=r.curve.getLengths(r.curve.arcLengthDivisions),$=E.length-1,L=[],H=[];se.forEach((t,e)=>{t.t!==null&&(L.push(E[Math.round(e/(se.length-1)*$)]/r.length),H.push(t.t))});const K=vt(L,H);await a.yield();const re={uSkyWarm:Y.uSkyWarm,uSkyCool:Y.uSkyCool,uSunDir:Y.uSunDir,uInkF:Y.uInkF,uLineW:Y.uLineW,uBack:Y.uBack,uHue:Y.uHue,uMid:Y.uMid,uComp:Y.uComp,uCream:Y.uCream,uInk:Y.uInk,uAges:Y.uAges},ce=t=>new l.ShaderMaterial({uniforms:{...re,uNearPlain:{value:t?1:0}},vertexShader:Mt,fragmentShader:Ge,side:l.DoubleSide,fog:!1,toneMapped:!1}),te=(t,e)=>{const d=new l.Mesh(t.geometry(!1),ce(e==="dunes"));return d.geometry.boundingSphere=oe.clone(),d.name=e,d.frustumCulled=!1,c.add(d),d},ge=xt(f.fork("sky"),o,i,B);c.add(ge.group),await a.yield();const Q=At(F,r),we=St();{const t=ot(),e=()=>a.yield();await Ze(t,Q,o,i,we.fine,-3,2,d=>d===-1?Tt:d===0?Pt:d>0?_t:It,!1,e),await a.yield(),await Ze(t,Q,o,i,we.coarse,-15,-4,()=>Dt,!0,e),await Ze(t,Q,o,i,we.coarse,3,14,()=>Vt,!0,e),await a.yield(),te(t,"dunes"),await a.yield()}await a.yield();const ze=[],de={value:0},Ee={value:0};re.uPx={value:400};const ae=i.pal,ke=[];{const t=ot(),e=f.fork("trees"),d=i.leaf.map(M=>o(M)),z=o(ae[5]),I=o(ae[6]),S=o(i.dune[3]),R=(M,A,v,x,C)=>{const u=Q.at(M,A)-.5,k=Me(v-u,9,22),h=[e.range(-.6,.6),e.range(-.6,.6)],p=O=>[M+h[0]*O*O,u+k*O,A+h[1]*O*O],N=Math.cos(x),J=Math.sin(x),U=p(0),le=p(1),he=.34;for(let O=0;O<3;O++){const ne=O/3*W,ie=(O+1)/3*W;t.quad([U[0]+Math.cos(ne)*he,U[1],U[2]+Math.sin(ne)*he],[U[0]+Math.cos(ie)*he,U[1],U[2]+Math.sin(ie)*he],[le[0]+Math.cos(ie)*.07,le[1],le[2]+Math.sin(ie)*.07],[le[0]+Math.cos(ne)*.07,le[1],le[2]+Math.sin(ne)*.07],O===0?I:S)}for(let O=0;O<20;O++){const ne=.26+.74*(O/19),ie=p(ne),Fe=O%2?1:-1,me=ue(.15,1.25,ne)+e.range(-.12,.12),Se=ue(5.2,2.4,ne)*(C?1.1:1)*e.range(.85,1.1),Ke=Se*.2,Le=[N*Math.cos(me)*Fe,Math.sin(me),J*Math.cos(me)*Fe],qe=[-N*Math.sin(me)*Fe,Math.cos(me),-J*Math.sin(me)*Fe],Je=e.range(-.5,.5),Qe=[-J*Je,0,N*Je],Te=(Ne,Oe)=>[ie[0]+Le[0]*Ne+(qe[0]+Qe[0])*Oe,ie[1]+Le[1]*Ne+qe[1]*Oe,ie[2]+Le[2]*Ne+(qe[2]+Qe[2])*Oe],et=Te(.1,0),ut=Te(Se*.42,Ke),tt=Te(Se,0),ft=Te(Se*.42,-Ke),ht=d[(O+(O>>2))%3];t.tri(et,ut,tt,ht),t.tri(et,tt,ft,O%3?z:d[(O+1)%3])}ke.push({x:M,z:A,y0:u,h:k,near:C})};for(let M=668,A=0;M>262;M-=20.5,A++){const v=r.nearestXZ(0,M),x=r.pointAt(v.u).x;(M>505||A%2===0)&&R(x-11-A%3*1.2,M,v.y-1+A%3*-2.2,1.57+e.range(-.5,.5),!0),M>505&&R(x+11+A%2*1.5,M-10,v.y-4-A%3*2,1.57+e.range(-.5,.5),!0)}for(let M=0;M<6;M++){const A=628-M*44,v=pe(A)+96+M%3*22;R(v,A,Q.at(v,A)+13+M%2*3,1.57+e.range(-.5,.5),!0)}await a.yield();const b=Math.round(118*s*n);for(let M=0,A=0;M<b&&A<4e3;A++){const v=e.int(-4,4),x=e.range(-420,980),C=pe(x)+v*Be+e.range(-5,3);Math.hypot(C,x)<265||r.nearestXZ(C,x).dist<30||(R(C,x,Q.at(C,x)+e.range(10,16),e.range(0,W),!1),M++,M%16===15&&await a.yield())}await a.yield();const P=[o(ae[3]),o(ae[3],.72),o(i.dune[3]),o(i.dune[2])],q=Math.round(420*s);for(let M=0;M<q;M++){const A=e.range(0,W),v=110+e.gauss()*20;if(v<30||v>250)continue;const x=Math.cos(A)*v,C=Math.sin(A)*v,u=Q.at(x,C)+.25,k=e.range(1.6,5.5),h=e.range(0,W),p=[0,1,2].map(N=>{const J=h+N*2.094+e.range(-.5,.5),U=k*e.range(.5,1);return[x+Math.cos(J)*U,u+(N===0?e.range(0,k*.5):0),C+Math.sin(J)*U]});t.tri(p[0],p[2],p[1],P[M%4]),M%400===399&&await a.yield()}{const M=T.anchors.portalSeat.position,A=o(ae[5]),v=o(i.sky[1]),x=o(i.dune[2]),C=(u,k,h)=>{const p=u/14*W+.224;return[M.x+h,M.y+Math.sin(p)*k,M.z+Math.cos(p)*k]};for(let u=0;u<14;u++)t.quad(C(u,7.35,.15),C(u,9.1,-.5),C(u+1,9.1,-.5),C(u+1,7.35,.15),u%2?A:v),t.quad(C(u,9.1,-.5),C(u,8.3,1.6),C(u+1,8.3,1.6),C(u+1,9.1,-.5),x)}await a.yield(),te(t,"trees")}await a.yield();{const t=f.fork("leaves"),e=[],d=[0,.06,0],z=.75,I=.36,S=[0,0,-z],R=[-I,0,.05],b=[0,0,z],P=[I,0,.05];e.push({p:[S,d,R],role:0},{p:[R,d,b],role:0},{p:[b,d,P],role:1},{p:[P,d,S],role:1});const q=ke.filter(u=>u.near),M=ke.filter(u=>!u.near&&u.z>-100&&Math.abs(u.x)<520),A=[],v=Math.round(340*s*n);for(let u=0;u<4;u++){const k=u%2?1:-1,h=u>>1;A.push({a:[k*(29+8*h),55-2*h,566-30*h-u%2*6,h*.36+u%2*.17+t.range(0,.02)],b:[5.2+.1*u,k>0?0:Math.PI,-1.57,2.6]})}const x=Math.round(26*Math.max(s,.8));for(let u=0;u<x+v;u++){const k=u<x?q[u%q.length]:M.length?t.pick(M):q[0],h=k.near?(t.chance(.5)?0:Math.PI)+t.range(-.45,.45):t.range(0,W);A.push({a:[k.x,k.y0+k.h*t.range(.7,1.02),k.z,t.range(0,9)],b:[t.range(5.6,9),h,t.range(0,W),k.near?t.range(1.3,1.7):t.range(1.1,1.5)]})}const C=De(re,Ct,12,.3,de);C.uniforms.uBand={value:[.1,.26,.5,.74]},c.add(Pe(e,A,12,C,"leaves"))}await a.yield();let Ae=0,ve=0,Ve=null,He=0;const Ue={value:0},Ye=new l.Vector3,xe=(t,e,d,z,I,S,R={})=>{t.push({p:[e,d,z],role:S,hide:1,...R},{p:[e,z,I],role:R.role2??S,hide:2,...R})},Re=(t,e,d,z,I,S,R)=>{for(let b=0;b<3;b++){const P=b/3*W+.5,q=(b+1)/3*W+.5;xe(t,[e[0]+Math.cos(P)*z,e[1],e[2]+Math.sin(P)*z],[e[0]+Math.cos(q)*z,e[1],e[2]+Math.sin(q)*z],[d[0]+Math.cos(q)*I,d[1],d[2]+Math.sin(q)*I],[d[0]+Math.cos(P)*I,d[1],d[2]+Math.sin(P)*I],S[b%S.length],R)}};{const t=f.fork("runners"),e=[],d=[0,4.6,1.25],z=[-.52,3.75,1.2],I=[.52,3.75,1.2],S=[0,4.2,-1.3],R=[-.3,3.6,-1.3],b=[.3,3.6,-1.3],P=[0,3.35,1.55];xe(e,d,z,R,S,0),xe(e,d,S,b,I,1),xe(e,z,I,b,R,2),e.push({p:[d,z,P],role:3},{p:[d,P,I],role:1},{p:[z,I,P],role:2},{p:[S,R,b],role:2}),e.push({p:[S,[0,5,-2.8],[0,3.9,-2.3]],role:2},{p:[[0,4.5,-.2],[0,5.3,-1.1],[0,4.3,-1]],role:3}),Re(e,[0,4.3,1.05],[0,5.8,2.4],.3,.14,[0,1,2],{part:9}),e.push({p:[[-.16,5.86,2.3],[.16,5.86,2.3],[0,5.62,3.3]],role:3,part:9},{p:[[-.16,5.86,2.3],[0,5.62,3.3],[0,5.55,2.35]],role:0,part:9},{p:[[.16,5.86,2.3],[0,5.62,3.3],[0,5.55,2.35]],role:1,part:9}),e.push({p:[[0,5,1.6],[0,6.2,1.3],[0,5.7,2.2]],role:2,part:9}),[[-.4,.95],[.4,.95],[-.32,-.95],[.32,-.95]].forEach(([h,p],N)=>{const J={part:N+1,x:h,y:p},U={part:N+5,x:h,y:p};Re(e,[h,3.7,p],[h,1.8,p],.24,.13,[0,1,0],J),Re(e,[h,1.8,p],[h,.05,p],.13,.08,[2,2,1],U),e.push({p:[[h-.16,.02,p-.1],[h+.16,.02,p-.1],[h,.12,p+.5]],role:3,...U})});const M=720,A=130,v=515,x=[],C=[];for(let h=0;h<64;h++){const p=M-h*(M-A)/63;x.push(pe(p)),C.push(Q.raw(0,0,p))}const u=[];for(let h=0;h<X;h++){const p=h%5===1||h%10===2?2:h%5===0?0:h%5===3||h%10===7?-1:1,N=p===2?340:p?262:A,J=p===2?95:p*Be,U=p===2?nt-43.4:p?-2-(p<0?1:0):0,le=t.range(-.3,.3),he=t.range(0,(p?M:v)-N),O=t.range(0,.2),ne=t.range(11,13),ie=t.range(.9,1.12),Fe=Math.ceil(X/5),me=Math.floor(h/5);u.push({a:[J+le,U,p===0?(me+.5)/Fe*(v-A)+(O-.1)*40:he,O],b:[p===0?12:ne,ie*(p===0?1.3:1),N,p===2?2:p?1:0]})}const k=De(re,Ft,14,.2,de);Object.assign(k.uniforms,{uTrX:{value:x},uTrY:{value:C},uZA:{value:M},uZB:{value:A},uZ0:{value:v}}),c.add(Pe(e,u,14,k,"runners"))}await a.yield();{const t=f.fork("swifts"),e=[];if(y){const k=[0,0,.9],h=[0,0,-1.1],p=[0,.16,.15];for(const N of[1,-1]){const J=[N*1.5,0,.1];e.push({p:[k,J,p],role:N>0?0:1,part:1},{p:[J,h,p],role:N>0?2:3,part:1})}e.push({p:[h,[.12,0,-2.4],[-.12,0,-2.4]],role:4})}else{const k=[0,0,.62],h=[0,.13,.05],p=[0,0,-.6],N=[-.2,0,0],J=[.2,0,0];e.push({p:[k,N,h],role:0},{p:[k,h,J],role:1},{p:[h,N,p],role:1},{p:[h,p,J],role:0}),e.push({p:[p,[-.28,0,-1.05],[-.04,0,-.75]],role:4},{p:[p,[.28,0,-1.05],[.04,0,-.75]],role:4});for(const U of[1,-1]){const le=[U*.12,.02,.3],he=[U*.62,.02,.52],O=[U*1.8,.02,-.8],ne=[U*.62,.02,.08],ie=[U*.12,.02,-.2];e.push({p:[le,he,ne],role:0,part:1},{p:[he,O,ne],role:2,part:1},{p:[le,ne,ie],role:1,part:1})}}const d=y?.42:1,z=16,I=y?.5:.25,S=.25,R=K(.252),b=r.pointAt(S).addScaledVector(r.tangentAt(S),62),P=24,q=-2.36/(z*I);Ye.set(b.x,b.y+9+.35*13,b.z-.4*P);const M=[new l.Vector4(b.x,b.y+9,b.z,P)],A=[new l.Vector4(q,-.85*Math.PI-q*(R-.3),13,-Math.PI/2)],v=(k,h,p,N,J,U)=>{M.push(new l.Vector4(k,h,p,N)),A.push(new l.Vector4(J*22*d/N,t.range(0,W),U,t.range(0,W)))};v(-270,92,240,64,-1,8),v(0,232,0,_?27:54,1,5),v(-95,78,600,60,1,9),v(0,96,0,236,-1,10),v(250,84,380,85,-1,12);const x=[],C=Math.round(48*s);for(let k=0;k<36;k++)x.push({a:[t.range(-10,10),t.range(0,7),0,t.range(0,I)],b:[0,t.range(0,W),t.range(.85,1.2)*(y?1.25:1)*1.9,t.range(0,.7)]});for(let k=1;k<6;k++)for(let h=0;h<C;h++)x.push({a:[t.range(-6,6),t.range(0,5.5),0,t.range(0,I)],b:[k,t.range(0,W),t.range(.85,1.2)*(y?1.25:1),t.range(0,2.6)]});const u=De(re,Bt,z,I,de);Object.assign(u.uniforms,{uTs:Ee,uFlap:{value:y?.12:1},uStretch:{value:y?.3:2.3},uGrow:Ue,uFA:{value:M},uFB:{value:A}}),c.add(Pe(e,x,z,u,"swifts"))}await a.yield();{const t=f.fork("jump"),e=[],d=6,z=b=>[b*7,3.6*(1-b*b)+.35,-1.5+5.5*b*b],I=b=>[b*8.6,0,-9.5+7*b*b],S=b=>[b*6.2,0,.8+4.6*b*b];for(let b=0;b<d;b++){const P=-1+2*b/d,q=-1+2*(b+1)/d;xe(e,I(P),z(P),z(q),I(q),1,{role2:1}),xe(e,z(P),S(P),S(q),z(q),2,{part:1,role2:2})}const R=[];for(let b=0,P=0;b<60&&P<3e3;P++){const q=t.range(0,W),M=t.range(48,242),A=Math.cos(q)*M,v=Math.sin(q)*M,x=t.chance(.5)?1:-1,C=(pe(v-20)-pe(v+20))/-40,u=Math.atan2(C*x,x),k=A+Math.sin(u)*60,h=v+Math.cos(u)*60;if(Math.hypot(k,h)<40||Math.hypot(A+Math.sin(u)*30,v+Math.cos(u)*30)<40)continue;const p=Q.at(A,v),N=Q.at(k,h);Math.abs(N-p)>5||(R.push({a:[A,v,u,t.range(0,6)],b:[t.range(.8,1.5),p-.5,(N-p)/60,t.int(0,13)]}),b++)}c.add(Pe(e,R,3,De(re,zt,3,6,de),"jumping-dunes"))}await a.yield();{const t=f.fork("squall"),e=new l.InstancedBufferGeometry,d=[],z=[];for(let v=0;v<3;v++){const x=v/3*W,C=(v+1)/3*W,u=(k,h)=>[Math.cos(k),h,Math.sin(k)];d.push(...u(x,0),...u(C,0),...u(C,1),...u(x,0),...u(C,1),...u(x,1)),z.push(1,1,0,0,1,0,0,1,1,1,0,1,0,0,1,0,1,1)}d.push(1,1,0,-.5,1,.866,-.5,1,-.866),z.push(1,0,0,0,1,0,0,0,1),e.setAttribute("position",new l.Float32BufferAttribute(d,3)),e.setAttribute("aBary",new l.Float32BufferAttribute(z,3));const I=[],S=[],R=[],b=[o(i.rod),o(i.rod,.86),o(i.sky[3])],P=[t.range(.22,.34),t.range(-.12,.12)],q=(v,x)=>{const C=b[I.length/4%3|0];I.push(v,x,t.range(70,130),t.range(0,4)),S.push(t.range(2.6,4.2),P[0]+t.range(-.03,.03),P[1],Q.at(v,x)-1),R.push(C.r,C.g,C.b)},M=Math.round(280*s);for(let v=0;v<M;v++){const x=t.range(0,W),C=Math.sqrt(t())*240;q(-540+Math.cos(x)*C,40+Math.sin(x)*C*1.3)}if(Z)for(let v=0,x=0,C=Math.round(300*s);v<C&&x<3e3;x++){const u=t.range(0,W),k=Math.sqrt(t())*300,h=Math.cos(u)*k-20,p=500+Math.sin(u)*k;r.nearestXZ(h,p).dist<26||r.nearestXZ(h+P[0]*40,p+P[1]*40).dist<26||r.nearestXZ(h+P[0]*90,p+P[1]*90).dist<26||(q(h,p),v++)}e.setAttribute("aM",new l.InstancedBufferAttribute(new Float32Array(I),4)),e.setAttribute("aM2",new l.InstancedBufferAttribute(new Float32Array(S),4)),e.setAttribute("aColor",new l.InstancedBufferAttribute(new Float32Array(R),3)),e.instanceCount=I.length/4;const A=new l.Mesh(e,new l.ShaderMaterial({uniforms:{...re,uT:de},vertexShader:Et,fragmentShader:Ge,side:l.DoubleSide,fog:!1,toneMapped:!1}));A.name="squall",A.frustumCulled=!1,c.add(A)}await a.yield();let fe=null;if(_){const t=[ae[3],ae[2],ae[1],ae[0],ae[4],ae[5],ae[6]],e=.7;fe=await at({...a,rng:f.fork("second")},{palette:t,comps:i.comps?[...i.comps].reverse():void 0,variant:j==="frigate"?"crane":"frigate",detail:s,needle:!1,swifts:!1,ribbons:!1,shells:40,crumble:8,bands:[.1,.18,.3,.45],climb:-1,y0:58/e,phase:2.2,depthK:.1,farHue:.5}),fe.setSky(i.warm,i.cool,B),fe.object.scale.set(e,e,-e),c.add(fe.object),await a.yield()}G(c),await a.yield();const $e=(t,e,d)=>{r.pointAt(e,t);const z=t.y,I=Math.atan2(t.z,t.x)-ue(.62,.44,ee(.34,.42,e)),S=ee(.29,.34,e)*(1-ee(.44,.5,e));return t.set(ue(0,110*Math.cos(I),S),z+ue(d,32,S),ue(0,110*Math.sin(I),S))},it=T.anchors.portalSeat.position.clone(),Ce=(t,e)=>(T.birdAt(Ae-.6*(1-ee(.7,.77,e)),t),t.y+=5*We(e,.66,.84,.3)+12*(1-ee(.7,.77,e))-3*ee(.8,.88,e),_e.copy(it),_e.y+=ue(-9,7,ee(.885,.935,e))*We(e,.86,.995,.3),_e.z+=12*We(e,.86,.995,.3),t.lerp(_e,.42*ee(.8,.87,e)+.58*ee(.88,.94,e))),lt=K(0),ct=K(1);return{scene:c,path:r,duration:46.5,pace:t=>{const e=Math.max(t-.012,0),d=Math.min(t+.012,1);return Me(Math.pow((ct-lt)*(d-e)/Math.max(K(d)-K(e),.001),.85),.62,1.75)},camera:{fov:50,near:.3,far:5e3,lookAhead:30,sway:.3,bank:.6},pois:[{at:(t,e)=>jt.set(0,185+55*ee(.09,.16,e)-125*ee(.165,.22,e),0),from:0,to:.3,weight:.5},{at:(t,e)=>{r.pointAt(e,Xe);const d=Xe.z-60;return Xe.set(pe(d),46,d)},from:.165,to:.235,weight:.55,fade:.35},{at:Ye,from:.2,to:.3,weight:.6,fade:.4},{at:(t,e)=>$e(Gt,e,-14),from:.27,to:.58,weight:.62},{at:(t,e)=>$e(qt,e,4),from:.28,to:.41,weight:.55,fade:.3},{at:(t,e)=>Ce(Wt,e),from:.63,to:.97,weight:.86,fade:.25},{at:(t,e)=>Ce(Zt,e),from:.655,to:.95,weight:.9,fade:.2},{at:(t,e)=>Ce(Rt,e),from:.655,to:.94,weight:.9,fade:.2},{at:(t,e)=>Ce(Lt,e),from:.66,to:.94,weight:.9,fade:.2},{at:(t,e)=>Ce(Nt,e),from:.665,to:.92,weight:.9,fade:.2},{at:(t,e)=>Ce(Ot,e),from:.665,to:.92,weight:.9,fade:.2}],portal:{shape:"circle",radius:7,color:i.ring,glow:.6,revealDistance:500},post:{exposure:1,bloom:{strength:0,radius:.1,threshold:4},grade:{saturation:1.1,contrast:1.05,vignette:.1,grain:.02,aberration:0}},ride:"none",style:"none",companion:"none",update(t,e,d,z){const I=K(z);if(Ve!==null){const S=e-Ve,R=z-He;S<0||S>20||Math.abs(R)>.03?ve=0:R<=1e-7?ve=Math.min(ve+S*Math.max(.15,1-ve/8),10):ve=Math.max(0,ve-.5*S)}Ve=e,He=z,Ae=I+ve,T.setClock(Ae),T.update(t,e,d),fe&&(fe.setClock(Ae),fe.update(t,e,d)),ge.update(e),de.value=e,Ee.value=Ae,Ue.value=ee(.05,.13,z)*(1-ee(.34,.4,z)),a.renderer.getDrawingBufferSize(rt),re.uPx.value=rt.y*.5*d.projectionMatrix.elements[5];for(const S of ze)S(t,e,d,z,Ae)},dispose(){T.dispose(),fe&&fe.dispose()}}}};const Xe=new l.Vector3,Rt=new l.Vector3,Lt=new l.Vector3,qt=new l.Vector3,_e=new l.Vector3,Nt=new l.Vector3,Ot=new l.Vector3,Wt=new l.Vector3,jt=new l.Vector3,Gt=new l.Vector3,Zt=new l.Vector3,rt=new l.Vector2;export{$t as default};
