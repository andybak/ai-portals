import*as l from"three";import{clamp as W,lerp as Ve,smoothstep as X}from"../kit/core.js";const Le=["#EFE8D8","#D5D1C4","#A3A49D","#5F6462","#2C2F30","#101112","#C8321E"],j=400,Ke=28,Oe=80,fe=`
  varying float vMistK;
  //TONE
  #ifdef DISPLAY_COMPOSE
  uniform vec3 uPaperD;
  #endif
  float hash21(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p+34.345); return fract(p.x*p.y); }
  float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
    return mix(mix(hash21(i), hash21(i+vec2(1,0)), f.x), mix(hash21(i+vec2(0,1)), hash21(i+vec2(1,1)), f.x), f.y); }
  // pigment granulation: fine two-octave grain, weaker where the ink is fully loaded (p in metres)
  float granulate(float dens, vec2 p){ float g = vnoise(p*5.3)*0.55 + vnoise(p*12.1 + 7.)*0.45;
    return dens*(1. - mix(0.3, 0.05, smoothstep(0.55, 1., dens))*(1. - g)); }
`,xe=`
  uniform highp sampler2D uSpine; uniform vec3 uSpineInfo;   // s0, 1/ds, rows
  vec3 spineFetch(float s, int row){
    float f = clamp((s - uSpineInfo.x)*uSpineInfo.y, 0., uSpineInfo.z - 1.001);
    int i = int(floor(f)); float t = f - float(i);
    return mix(texelFetch(uSpine, ivec2(i, row), 0).xyz, texelFetch(uSpine, ivec2(i+1, row), 0).xyz, t);
  }
  // world mist: a band between two world heights hides ink; .z hides everything under the band's top (seen
  // from above the cloud sea); .w is a white-out for everything farther than a few tens of metres
  uniform vec4 uMistBand; varying float vMistK;
  float mistK(vec3 w, float dist){
    float band = smoothstep(uMistBand.x, uMistBand.x + 22., w.y)*(1. - smoothstep(uMistBand.y - 22., uMistBand.y, w.y));
    band *= smoothstep(15., 90., dist);                // inside the deck, what is close still shows
    float below = (1. - smoothstep(uMistBand.y - 30., uMistBand.y, w.y))*uMistBand.z;
    return (1. - max(band, below))*(1. - uMistBand.w*smoothstep(60., 220., dist));
  }
`;function Ue(i){const u=new l.CatmullRomCurve3(i.map(s=>new l.Vector3(s[0],s[1],s[2])),!1,"centripetal");u.arcLengthDivisions=Math.min(1600,i.length*80);const A=u.getLength(),p=Math.max(2,Math.ceil(A)),z=u.getSpacedPoints(p),c=new Float32Array((p+1)*3);for(let s=0;s<=p;s++)c[s*3]=z[s].x,c[s*3+1]=z[s].y,c[s*3+2]=z[s].z;return{tab:c,n:p,len:A,step:A/p}}function Ge(i,u,A,p){const z=u/i.step,c=i.tab;if(z<=0){for(let h=0;h<3;h++)A[p+h]=c[h]+(c[3+h]-c[h])*z;return}if(z>=i.n){const h=i.n*3,C=z-i.n;for(let E=0;E<3;E++)A[p+E]=c[h+E]+(c[h+E]-c[h-3+E])*C;return}const s=Math.floor(z),v=z-s,V=s*3;for(let h=0;h<3;h++)A[p+h]=c[V+h]+(c[V+3+h]-c[V+h])*v}function je(){const i=[],u=[],A=[],p=[],z=[],c=[],s=new l.CatmullRomCurve3([new l.Vector3,new l.Vector3],!1,"centripetal"),v=new l.Vector3,V=new l.Vector3,h=(e,a)=>{const d=a*(e.length-1),t=Math.min(e.length-2,Math.floor(d)),o=d-t,g=o*o*(3-2*o);return e[t]+(e[t+1]-e[t])*g};function C(e,a,d={}){const t=d.segs??6,o=d.at??0,g=d.seed??.5,F=d.d??1,T=d.kind??0,f=d.fl??0,x=d.hide??0,w=d.dry??0;s.points=e.map(M=>new l.Vector3(M[0],M[1],M[2]));let L=0;for(let M=1;M<e.length;M++)L+=Math.hypot(e[M][0]-e[M-1][0],e[M][1]-e[M-1][1],e[M][2]-e[M-1][2]);const I=i.length/3;for(let M=0;M<=t;M++){const S=M/t;s.getPoint(S,v),s.getTangent(S,V);const k=h(a,S);for(let K=-1;K<=1;K+=2)i.push(v.x,v.y,v.z),u.push(V.x,V.y,V.z),A.push(o,K,k,S),p.push(g,F,T,f),z.push(x,L,w);if(M<t){const K=I+M*2;c.push(K,K+1,K+2,K+1,K+3,K+2)}}}function E(e,a,d,t,o={}){C([[e-t,a,d],[e+t,a,d]],[o.ry??t,o.ry??t],{...o,segs:1,kind:o.kind??3})}function $(){const e=new l.BufferGeometry;return e.setAttribute("position",new l.Float32BufferAttribute(i,3)),e.setAttribute("aDir",new l.Float32BufferAttribute(u,3)),e.setAttribute("aA",new l.Float32BufferAttribute(A,4)),e.setAttribute("aB",new l.Float32BufferAttribute(p,4)),e.setAttribute("aC",new l.Float32BufferAttribute(z,3)),e.setIndex(c),e}return{add:C,dot:E,geometry:$}}const $e=[.25,1,.8,.45,0],ee=i=>$e.map(u=>u*i);async function He(i,u,A,p,z=async()=>{}){const c=je(),s=(e,a)=>i.range(e,a),v=s(1.4,1.6),V=e=>e.map(a=>[a[0]*v,a[1]*v,a[2]*v]),h=(e,a,d)=>c.add(V(e),a.map(t=>t*v),{at:0,seed:i(),...d});for(let e=1.5;e<u*.9;e+=s(1,1.9)*(e<40?.7:1+e/u)){const a=A(e),d=1+1.3*(1-X(0,45,e)),t=a*s(.8,2.2)*d*(.55+.9*Math.abs(Math.sin(e*.19+v*9))),o=s(-.45,.45)*a,g=s(.8,1.5);c.add([[0,a*.55,o],[-t*.5*g,a*.6+t*.5,o*1.3],[-t*(.9+g*.6),a*.5+t*s(.3,.8),o*1.6]],ee(s(.3,.55)*(.6+a*.22)),{at:e,seed:i(),d:s(.7,1),fl:t*.16,dry:s(.5,1),segs:5})}await z();for(let e=14;e<u*.8;e+=s(4,8)){const a=A(e),d=a*s(.8,1.5),t=s(-.3,.3)*a;c.add([[0,-a*.6,t],[-d*.6,-a*.7-d*.5,t],[-d*1.5,-a*.6-d*.55,t]],ee(s(.3,.5)),{at:e,seed:i(),d:s(.4,.65),fl:d*.15,dry:1,segs:5})}await z();const C=[u*s(.14,.17),u*s(.19,.22),u*s(.55,.6),u*s(.62,.66)];for(let e=0;e<4;e++){const a=C[e],d=A(a),t=e%2?-1:1,o=.75+d*.22,g=s(-2.5,2.5),F=s(.9,1.15)*o,T=[0,-d*.35,t*d*.5],f=[(-2.5+g)*F,-7.5*F,t*6.2*F],x=[(6.5+g)*F,-10.2*F,t*8.2*F];c.add([T,[(1.5+g*.4)*F,-4.2*F,t*4.2*F],f],[.5*o,.82*o,.56*o,.34*o],{at:a,seed:i(),dry:.4,segs:8}),c.add([f,[(2.5+g)*F,-10.6*F,t*7.4*F],x],[.46*o,.5*o,.34*o,.26*o],{at:a,seed:i(),dry:.4,segs:8});for(let w=0;w<4;w++){const L=(w-1.5)*.9,I=s(3.2,4.4)*o;c.add([x,[x[0]+I*.55,x[1]+.9*o-Math.abs(L)*.3,x[2]+t*L*1.1*o],[x[0]+I,x[1]-1.9*o,x[2]+t*L*2*o]],[.5*o,.42*o,.26*o,0],{at:a,seed:i(),fl:.25,dry:.3,segs:6})}c.add([x,[x[0]-1.6*o,x[1]-1.2*o,x[2]],[x[0]-2.6*o,x[1]-2.8*o,x[2]]],[.4*o,.3*o,0],{at:a,seed:i(),dry:.3,segs:4});for(let w=0;w<4;w++){const L=s(4,8)*o;c.add([f,[f[0]-L*.5,f[1]+s(-1,2),f[2]+t*s(0,1.5)],[f[0]-L,f[1]+s(0,3.5),f[2]+t*s(0,2.5)]],ee(s(.16,.3)*o),{at:a,seed:i(),d:s(.75,1),fl:L*.14,dry:.7,segs:5})}}for(let e=0,a=i.int(8,11);e<a;e++){const d=(e/(a-1)-.5)*2,t=s(12,26),o=d*s(4,8),g=s(-5,5);c.add([[0,0,0],[-t*.4,o*.5,g*.4],[-t,o,g]],ee(s(.3,.6)),{at:u-s(1,8),seed:i(),d:s(.6,.95),fl:t*.1,dry:1,segs:7})}await z();for(let e=0;e<14;e++){const a=e%2?-1:1,d=s(-1.6,2.6),t=s(6,12);h([[s(0,4),d,a*1.5],[-t*.45,d+s(-1,2),a*s(2.2,3.4)],[-t,d+s(-2.5,3.5),a*s(2.5,4.5)]],ee(s(.5,.8)),{d:s(.75,1),fl:t*.09,dry:.9,segs:6})}h([[-3,.1,0],[2,1,0],[6,1.7,0],[8.6,1.5,0]],[1.9,2.5,2.35,1.6],{segs:8}),h([[7,1.35,0],[10.5,.95,0],[13.4,1.25,0],[15.3,2.1,0]],[1.6,1.25,1,1.15,.6],{segs:8}),h([[2.5,-.8,0],[6,-2.3,0],[10,-3,0],[13.8,-2.3,0]],[1.3,1.1,.8,.55,.22],{segs:8}),h([[5.5,-1.3,0],[9.5,-1.35,0],[12.2,-.7,0],[13.2,-1.1,0]],[.3,.36,.26,.06],{d:.6,fl:.25,segs:6});for(let e=0;e<5;e++)for(const a of[-1,1]){const d=9.2+e*1.15,t=e===4?1.5:s(.7,1);h([[d,.15,a*.7],[d+.1,.15-t*.6,a*.7],[d-.15,.15-t,a*.7]],[.3,.2,0],{segs:3}),e<4&&h([[d+.5,-2.2,a*.6],[d+.6,-1.7,a*.6],[d+.5,-1.3,a*.6]],[.26,.17,0],{segs:3})}for(let e=0,a=i.int(5,7);e<a;e++){const d=3.5+e*1.3,t=s(3,6.5),o=s(-.5,.5);h([[d,-2.7,o],[d-t*.35,-2.9-t*.6,o],[d-t*.95,-3-t*.85,o*2]],ee(s(.4,.6)),{d:s(.7,1),fl:t*.1,dry:.9,segs:5})}await z();const E=i.int(2,3),$=s(.9,1.25);for(const e of[-1,1]){const a=e*1.25;h([[14.7,2.3,e*.5],[15.7,3.1,e*.7],[15,3.8,e*.85]],[.36,.3,.1],{segs:4}),h([[4.8,2.5,e*1],[6.8,3.4,e*1.4],[9.2,2.9,e*1.3]],[.3,.75,.5,.08],{segs:5}),h([[3,2,e*1.9],[0,3.5,e*3.1],[-3.4,2.9,e*3.8]],ee(.85),{fl:.4,dry:.5,segs:5});const d=[[4,3,a],[1,5.4*$,a*1.5],[-3.5*$,7.6*$,a*2],[-8.5*$,8.4*$,a*2.4]];h(d,[.72,.6,.42,.24,.03],{segs:9,dry:.25});for(let T=0;T<E;T++){const f=d[1+T]||d[2],x=s(2.6,4.2)*$,w=T===2?-3.5:0;h([[f[0]+w,f[1]+(T===2?.6:0),f[2]],[f[0]+w-.4,f[1]+x*.6,f[2]+e*.3],[f[0]+w-2.2,f[1]+x,f[2]+e*.6]],[.42,.3,.03],{segs:5,dry:.25})}const t=s(26,40);c.add(V([[13,.6,e*1],[15.5,2.6,e*3.8],[9,5.2,e*6.5],[-6,4.4,e*8],[-t*.6,1.5,e*6.5],[-t,-1,e*5]]),[.34*v,.3*v,.24*v,.16*v,0],{at:0,seed:i(),fl:2.2,dry:.35,segs:26}),c.add(V([[11.5,-2.9,e*.6],[12.5,-4.6,e*1.6],[8,-6,e*2.4],[1,-5.4,e*2.6]]),[.22*v,.2*v,.12*v,0],{at:0,seed:i(),fl:1,dry:.3,segs:12});const o=7.1*v,g=1.85*v,F=e*2*v;c.dot(o,g,F,1.02*v,{ry:.78*v,kind:1,hide:e,seed:i()}),c.dot(o+.18*v,g,F*1.02,.5*v,{ry:.5*v,kind:p.redEye?2:3,hide:e,seed:i()}),c.dot(o+.26*v,g,F*1.04,.2*v,{ry:.2*v,kind:3,hide:e,seed:i()})}return await z(),c.geometry()}function qe(i,u){const A=[],p=[],z=[],c=[],v=Math.PI*2-u.gap,V=i.range(0,6.28),h=i.range(0,6.28),C=t=>(1.5+2.1*Math.exp(-Math.pow((t-.04)/.055,2))+1*X(0,.3,t)*(1-X(.35,.95,t))+.12*Math.sin(t*23+V))*u.wScale,E=t=>u.rIn+.1*Math.sin(t*9+h)+u.drift*(t-.5),$=v*(u.rIn+1);for(let t=0;t<=260;t++){const o=t/260,g=u.th0-o*v,F=E(o),T=C(o);for(let f=0;f<2;f++){const x=F+T*f;A.push(Math.cos(g)*x,Math.sin(g)*x,0),p.push(o,f*2-1,0,.37),z.push($,T*.5,0,0)}if(t<260){const f=t*2;c.push(f,f+1,f+2,f+1,f+3,f+2)}}const e=[];for(let t=0;t<9;t++){let o;do o=i();while(Math.sin(u.th0-o*v)>-.35);e.push(o)}e.sort((t,o)=>t-o);const a=10;e.forEach((t,o)=>{const g=u.th0-t*v,F=E(t)+C(t)*.72,T=Math.cos(g)*F,f=Math.sin(g)*F,x=i.range(2.2,6.5)*(t<.15?1.5:1)*(.6+.4*-Math.sin(g)),w=i.range(.13,.26)*(t<.15?1.4:1),L=i(),I=i.range(0,.45),M=A.length/3;for(let S=0;S<=a;S++)for(let k=-1;k<=1;k+=2)A.push(T,f,.02),p.push(S/a,k,1,L),z.push(x,w,t,I);for(let S=0;S<a;S++){const k=M+S*2;c.push(k,k+1,k+2,k+1,k+3,k+2)}});for(let t=0,o=i.int(26,38);t<o;t++){const g=i.chance(.6)?i.range(0,.12):i.range(.1,.9),F=u.th0-g*v+i.range(-.05,.25),T=E(g)+C(g)+i.range(.3,1)*i.range(.3,6),f=i.range(.12,.55)*(i.chance(.15)?2:1),x=i(),w=A.length/3,L=Math.cos(F)*T,I=Math.sin(F)*T;for(let M=0;M<4;M++)A.push(L,I,.03),p.push(M%2?1:-1,M<2?-1:1,2,x),z.push(f,f,g,0);c.push(w,w+1,w+2,w+1,w+3,w+2)}const d=new l.BufferGeometry;return d.setAttribute("position",new l.Float32BufferAttribute(A,3)),d.setAttribute("aE",new l.Float32BufferAttribute(p,4)),d.setAttribute("aF",new l.Float32BufferAttribute(z,4)),d.setIndex(c),{geometry:d,inner:E,width:C,sweep:v}}const ue=`
  vec3 col = mix(uInk2, uInk, clamp(dens*1.25 - 0.25, 0., 1.));
  alpha *= (1. - smoothstep(uFade.x, uFade.y, vDepth))*smoothstep(0.25, 0.7, vMistK);   // decisive: inked or bare paper, never a half-erased ghost
  if (alpha < 0.004) discard;
  col = mix(col, tint, tintAmt);
  #ifdef DISPLAY_COMPOSE
    gl_FragColor = compose(uPaperD, col, alpha);     // colours are display-linear; see opts.tone
  #else
    gl_FragColor = vec4(col, alpha);
  #endif
`,Ye=`
  ${xe}
  uniform float uGirth;
  varying vec2 vUv; varying float vBack, vHw, vDepth;
  #include <fog_pars_vertex>
  void main(){
    float s = position.x;
    vec3 C = spineFetch(s, 0), Nn = spineFetch(s, 1);
    vec3 fwd = normalize(spineFetch(s-0.9, 0) - spineFetch(s+0.9, 0));
    vec4 wp = modelMatrix*vec4(C, 1.);
    vec3 wf = normalize(mat3(modelMatrix)*fwd), wn = normalize(mat3(modelMatrix)*Nn);
    vec3 side = normalize(cross(wf, cameraPosition - wp.xyz));
    vBack = dot(side, wn);
    float hw = position.z*uGirth;
    wp.xyz += side*position.y*hw*length(modelMatrix[0].xyz);
    vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
    vUv = vec2(s, position.y); vHw = hw; vDepth = -mvPosition.z; vMistK = mistK(wp.xyz, vDepth);
    #include <fog_vertex>
  }`,We=`
  uniform vec3 uInk, uInk2; uniform float uTime, uLen, uSeed, uBelly; uniform vec2 uFade;
  varying vec2 vUv; varying float vBack, vHw, vDepth;
  ${fe}
  #include <fog_pars_fragment>
  void main(){
    float s = vUv.x, v = vUv.y, t = clamp(s/uLen, 0., 1.);
    float m = v*vHw;                                   // metres across the stroke
    float q = v*clamp(vBack*1.7, -1., 1.);             // +1 on the dorsal edge, -1 on the belly
    float n1 = vnoise(vec2(s*0.33 + uSeed, m*1.3));
    float edge = 1. - smoothstep(0.80 + 0.13*n1, 0.96 + 0.04*n1, abs(v));
    // dry-brush: the load runs out toward the tail, with one or two dry patches where the brush lifted
    float dryp = vnoise(vec2(s*0.021 + uSeed*3., 0.5));
    float dry = smoothstep(0.42, 1., t)*0.6 + smoothstep(0.62, 0.9, dryp)*0.4*smoothstep(0.1, 0.22, t)*(1. - smoothstep(0.6, 0.8, t)) + smoothstep(0.975, 1., t)*0.3;
    float st = vnoise(vec2(s*0.05 + uSeed*7., m*3.1))*0.65 + vnoise(vec2(s*0.4, m*7.7 + 3.))*0.35;
    float keep = smoothstep(dry - 0.16, dry + 0.10, st + 0.12);
    float load = mix(1., 0.7, smoothstep(0.08, 0.9, t));
    float belly = smoothstep(0.25, -0.45, q)*smoothstep(0.03, 0.12, t)*(1. - smoothstep(0.6, 0.85, t))*uBelly;
    float dens = load*mix(1., 0.4, belly);
    // belly scales: staggered crescents opening toward the tail
    vec2 sc = vec2(q*vHw/1.35, s/2.3); sc.y += 0.5*mod(floor(sc.x), 2.);
    vec2 f = fract(sc) - vec2(0.5, 0.0);
    float arc = 1. - smoothstep(0.05, 0.11, abs(length(f) - 0.46));
    dens += arc*0.5*belly;
    float ring = smoothstep(0.55, 0.9, abs(v));        // wet edge
    dens = mix(dens, min(1., dens + 0.42), ring*0.85);
    dens += 0.3*smoothstep(0.3, 0.8, q)*(1. - dens);   // spine line
    dens = clamp(dens, 0., 1.);
    dens = granulate(dens, vec2(s, m) + uSeed)*(1. + 0.03*sin(uTime*1.7 + s*0.9 + m*3.));
    dens = clamp(dens, 0., 1.);
    float alpha = dens*edge*keep*smoothstep(-2.5, 0.5, s);
    vec3 tint = vec3(0.); float tintAmt = 0.;
    ${ue}
    #include <fog_fragment>
  }`,Xe=`
  ${xe}
  attribute vec3 aDir, aC; attribute vec4 aA, aB;
  uniform float uTime, uPix;
  varying vec4 vS, vK; varying float vDepth, vThin;
  #include <fog_pars_vertex>
  void main(){
    float s = aA.x - position.x, u = aA.w, seed = aB.x;
    vec3 C = spineFetch(s, 0), Nn = normalize(spineFetch(s, 1));
    vec3 fwd = normalize(spineFetch(s-0.8, 0) - spineFetch(s+0.8, 0));
    Nn = normalize(Nn - fwd*dot(Nn, fwd)); vec3 Bv = cross(fwd, Nn);
    float ph = uTime*(1.5 + fract(seed*7.3)) - u*3.2 + seed*40.;
    float fl = aB.w*u*u;
    vec3 P = C + Nn*(position.y + fl*sin(ph)) + Bv*(position.z + fl*0.8*cos(ph*0.83 + 1.3));
    vec3 dir = normalize(fwd*aDir.x + Nn*aDir.y + Bv*aDir.z);
    vec4 wp = modelMatrix*vec4(P, 1.);
    vec3 toCam = cameraPosition - wp.xyz; float dist = length(toCam);
    vec3 side = normalize(cross(normalize(mat3(modelMatrix)*dir), toCam));
    float hw = aA.z*length(modelMatrix[0].xyz), hwUse = hw;
    if (aB.z < 0.5) hwUse = max(hw, min(dist*uPix, hw*4.) * step(0.001, hw));
    vThin = hw > 0. ? hw/hwUse : 1.;
    if (aC.x != 0. && dot(mat3(modelMatrix)*Bv*aC.x, toCam) < -0.2*dist) hwUse = 0.;   // far-side eye
    wp.xyz += side*aA.y*hwUse;
    vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
    vS = vec4(u, aA.y, seed, aB.y); vK = vec4(aB.z, aC.y, aC.z, aA.z); vDepth = -mvPosition.z; vMistK = mistK(wp.xyz, vDepth);
    #include <fog_vertex>
  }`,Je=`
  uniform vec3 uInk, uInk2, uPaper, uRed; uniform vec2 uFade;
  varying vec4 vS, vK; varying float vDepth, vThin;
  ${fe}
  #include <fog_pars_fragment>
  void main(){
    float u = vS.x, v = vS.y, seed = vS.z, dens = vS.w, alpha;
    vec3 tint = vec3(0.); float tintAmt = 0.;
    if (vK.x > 0.5) {                                  // dots: paper reserve, vermilion, ink
      vec2 p = vec2(u*2. - 1., v); float r = length(p), ang = atan(p.y, p.x);
      float R = 0.8 + 0.05*sin(ang*3. + seed*20.) + 0.03*sin(ang*7. + seed*50.);
      alpha = 1. - smoothstep(R - 0.12, R, r);
      if (vK.x < 1.5) { tint = uPaper; tintAmt = 1. - smoothstep(R - 0.42, R - 0.2, r); } else if (vK.x < 2.5) { tint = uRed*(0.9 + 0.2*smoothstep(0.9, 0.3, r)); tintAmt = 1.; }
      dens = 1.;
    } else {
      float m = v*vK.w, Lm = u*vK.y;
      float n1 = vnoise(vec2(Lm*0.5 + seed*17., m*2. + seed*5.));
      float edge = 1. - smoothstep(0.72 + 0.18*n1, 0.97, abs(v));
      float dry = vK.z*smoothstep(0.2, 1., u)*1.1;
      float st = vnoise(vec2(Lm*0.09 + seed*31., m*4.5 + seed*13.))*0.7 + vnoise(vec2(Lm*0.7, m*9. + seed))*0.3;
      float keep = smoothstep(dry - 0.16, dry + 0.1, st + 0.12);
      dens = granulate(clamp(dens*(0.94 + 0.06*smoothstep(0.45, 0.9, abs(v))), 0., 1.), vec2(Lm, m) + seed*37.);
      alpha = dens*edge*keep*mix(1., vThin, 0.55);
      float capU = vK.w/max(vK.y, 0.001), cx = min(u, 1. - u)/max(capU, 0.0001);    // round the blunt ends
      if (cx < 1.) alpha *= 1. - smoothstep(0.78, 1., length(vec2(1. - cx, v)));
    }
    ${ue}
    #include <fog_fragment>
  }`,Qe=`
  ${xe}
  attribute vec4 iA, iB, iC;      // (s0, span, phase, seed) (dir, dist) (size, density, flyFrac, speck)
  uniform float uFlow, uPix; uniform vec3 uEnsoC, uEnsoN;
  varying vec2 vP; varying vec4 vD; varying float vDepth;
  #include <fog_pars_vertex>
  void main(){
    float a = fract(uFlow/iA.y + iA.z);
    float s = iA.x + a*iA.y;
    vec3 Cu = spineFetch(s, 0), Cr = spineFetch(s, 2);
    float fly = clamp(a/iC.z, 0., 1.), flyE = 1. - pow(1. - fly, 3.);
    vec3 P = mix(Cu, Cr, fly) + iB.xyz*iB.w*flyE - vec3(0., 1., 0.)*iB.w*0.12*fly*fly;
    float landed = smoothstep(0.75, 1.0, fly);
    float spread = mix(1., smoothstep(0.0, 0.05, a - iC.z) , 0.55);
    float size = mix(0.22 + 0.25*iC.w, iC.x*spread, landed);
    vec4 wp = modelMatrix*vec4(P, 1.);
    float dist = distance(cameraPosition, wp.xyz);
    size = max(size*length(modelMatrix[0].xyz), dist*uPix*1.3);
    vec3 rel = P - uEnsoC; float radial = length(rel - uEnsoN*dot(rel, uEnsoN));
    float vis = smoothstep(0., 0.012, a)*(1. - smoothstep(0.84, 1., a))*smoothstep(16., 40., dist)*smoothstep(17., 27., radial);
    vec4 mvPosition = viewMatrix*wp; mvPosition.xy += position.xy*size*step(0.01, vis);
    gl_Position = projectionMatrix*mvPosition;
    vP = position.xy; vD = vec4(iA.w, iC.y*vis, landed, iC.w); vDepth = -mvPosition.z; vMistK = mistK(wp.xyz, vDepth);
    #include <fog_vertex>
  }`,Ze=`
  uniform vec3 uInk, uInk2; uniform vec2 uFade; uniform float uTime;
  varying vec2 vP; varying vec4 vD; varying float vDepth;
  ${fe}
  #include <fog_pars_fragment>
  void main(){
    float seed = vD.x, r = length(vP), ang = atan(vP.y, vP.x);
    float lobes = 0.07*sin(ang*2. + seed*17.) + 0.05*sin(ang*3. + seed*41.) + 0.03*sin(ang*7. + seed*5.);
    float spikes = pow(max(0., sin(ang*(4. + floor(seed*5.)) + seed*30.)), 8.)*0.25*step(0.8, fract(seed*9.));
    float R = mix(0.8, 0.66 + lobes + spikes, vD.z);
    float inside = 1. - smoothstep(R - 0.07, R + 0.02, r);
    float ring = smoothstep(R - 0.3, R - 0.04, r);
    float g = vnoise(vP*5. + seed*60.);
    float dens = mix(1., vD.y*(0.72 + 0.28*ring)*(0.8 + 0.4*g), vD.z*(1. - vD.w)) * step(0.0001, vD.y);
    dens = clamp(dens, 0., 1.);
    float alpha = dens*inside*min(1., vD.y*40.);
    vec3 tint = vec3(0.); float tintAmt = 0.;
    ${ue}
    #include <fog_fragment>
  }`,et=`
  attribute vec4 aE, aF;
  uniform float uReveal, uDrip, uTime, uPix;
  varying vec4 vE, vF; varying float vDepth, vMistK;
  #include <fog_pars_vertex>
  void main(){
    vec3 p = position; vE = aE; vF = aF;
    float kind = aE.z, ms = length(modelMatrix[0].xyz);
    float dist = distance(cameraPosition, (modelMatrix*vec4(position, 1.)).xyz);
    if (kind > 0.5 && kind < 1.5) {                    // drip: runs down from its anchor
      float t = aE.x, started = step(aF.z + 0.03, uReveal);
      float g = clamp((uDrip - aF.w)/(1. - aF.w), 0., 1.); g = 1. - pow(1. - g, 2.2);
      g = started*(0.05 + 0.95*g)*(1. + 0.02*sin(uTime*0.7 + aE.w*40.));
      float len = aF.x*g;
      float prof = (0.55 + 0.45*(1. - t))*(1. + 1.6*exp(-pow((t - 0.9)/0.07, 2.)));
      float hw = max(aF.y*prof, dist*uPix/ms)*(1. - smoothstep(0.955, 1., t))*started;
      p.y -= t*len; p.x += aE.y*hw + 0.1*sin(t*len*0.9 + aE.w*30.)*t;
    } else if (kind > 1.5) {                           // flung dot
      float on = smoothstep(aF.z, aF.z + 0.02, uReveal);
      p.xy += aE.xy*max(aF.x, dist*uPix*1.2/ms)*on;
    }
    vec4 mvPosition = modelViewMatrix*vec4(p, 1.); gl_Position = projectionMatrix*mvPosition;
    vDepth = -mvPosition.z; vMistK = 1.;
    #include <fog_vertex>
  }`,tt=`
  uniform vec3 uInk, uInk2; uniform vec2 uFade; uniform float uReveal, uTime, uGhost;
  varying vec4 vE, vF; varying float vDepth;
  ${fe}
  #include <fog_pars_fragment>
  void main(){
    float kind = vE.z, alpha, dens = 1.;
    if (kind < 0.5) {
      float a = vE.x, v = vE.y, m = v*vF.y, Lm = a*vF.x;
      float n1 = vnoise(vec2(Lm*0.6, m*1.5 + 4.));
      float edge = 1. - smoothstep(0.78 + 0.16*n1, 0.97 + 0.03*n1, abs(v));
      float dry = smoothstep(0.5, 1., a)*1.05 + 0.22*smoothstep(0.16, 0.3, a)*(1. - smoothstep(0.3, 0.5, a)) + smoothstep(0.95, 1., a)*0.5;
      float st = vnoise(vec2(Lm*0.07 + 3., m*4.2))*0.65 + vnoise(vec2(Lm*0.5, m*10.))*0.35;
      float keep = smoothstep(dry - 0.16, dry + 0.1, st + 0.12);
      float fr = uReveal*1.05 - a - vnoise(vec2(m*3., 7.))*0.012;
      float wet = 1. - smoothstep(0., 0.22, fr);
      dens = (0.92 + 0.08*smoothstep(0.5, 0.95, abs(v)))*mix(1., 0.8, smoothstep(0.5, 1., a));
      dens = clamp(granulate(dens, vec2(Lm, m))*(1. + 0.03*sin(uTime*1.5 + Lm*3.)) + wet*0.25, 0., 1.);
      float cap = smoothstep(0., 0.012, a - (1. - sqrt(max(0., 1. - v*v)))*0.03);
      // before the tail arrives the ring already hangs there as a ghost wash (uGhost), like every unvisited thing
      alpha = edge*cap*mix(uGhost*(0.8 + 0.3*n1), dens*keep, smoothstep(0., 0.012, fr));
    } else if (kind < 1.5) {
      alpha = (1. - smoothstep(0.5, 1., abs(vE.y)))*0.96;
    } else {
      float r = length(vE.xy), ang = atan(vE.y, vE.x);
      float R = 0.78 + 0.1*sin(ang*3. + vE.w*20.) + 0.07*sin(ang*7. + vE.w*50.);
      alpha = 1. - smoothstep(R - 0.12, R, r);
    }
    vec3 tint = vec3(0.); float tintAmt = 0.;
    ${ue}
    #include <fog_fragment>
  }`;async function ot(i,u={}){const A=i.rng.fork("ink-dragon-hero"),p=(n,r)=>A.range(n,r),z=(u.palette&&u.palette.length>=7?u.palette:Le).map(n=>new l.Color(n)),c=u.length??320,s=u.girth??1,v=-Ke,V=c+Oe,h=(V-v)/(j-1),C=new l.Vector3(0,60,0),E={rIn:u.ensoRadius??7.25,th0:l.MathUtils.degToRad(235+p(-14,14)),gap:l.MathUtils.degToRad(p(12,22)),drift:p(-.3,.35),wScale:p(.9,1.1)},$={sx:p(.9,1.12),sy:p(.9,1.1),sz:p(.75,1.3)},e={a1:p(3.4,5.6),l1:p(85,125),a2:p(2.2,3.8),l2:p(55,80),p1:p(0,6.28),p2:p(0,6.28),v:p(8,13)},a=p(0,6.28),d=p(0,6.28),t=p(3.8,4.4),o=n=>{const r=W(n/c,0,1);return Ve(2.5,t,X(0,.2,r))*(1-.8*X(.32,1,r))*(1+.1*Math.sin(n*.057+a)+.06*Math.sin(n*.13+d))},g=[[3,14,150],[5,3,80],[3,-3,36],[-2,-6,14],[14,-16,4],[32,-36,-12],[-11,-41,-28],[-49,-26,-36],[-64,4,-38],[-49,34,-34],[-11,50,-24],[32,44,-8],[55,30,12],[62,26,44],[52,18,84],[20,20,150]].map((n,r)=>r>=5&&r<=12?[n[0]*$.sx,4+(n[1]-4)*$.sy,n[2]*$.sz]:n).map(n=>[n[0]+C.x,n[1]+C.y,n[2]+C.z]),F=g[3],T=[[40,210,640],[-24,164,500],[18,124,370],[-8,94,250]];let f=null,x=null;const w={courseLength:0,flickTravel:0,endTravel:0,startTravel:0};function L(n,r={}){const b=n.map(m=>m.isVector3?[m.x,m.y,m.z]:[m[0],m[1],m[2]]);x=r.finale===!1?b:b.concat(g),f=Ue(x);let y=f.n,D=1e9;if(r.finale!==!1)for(let m=Math.max(0,f.n-700);m<=f.n;m++){const U=Math.hypot(f.tab[m*3]-F[0],f.tab[m*3+1]-F[1],f.tab[m*3+2]-F[2]);U<D&&(D=U,y=m)}return w.courseLength=f.len,w.flickTravel=y*f.step+c,w.endTravel=r.finale===!1?f.len:w.flickTravel+26,w.startTravel=Math.min(c*.6,w.endTravel*.2),w}L(u.course||T),await i.yield?.();const I=new Float32Array(j*3*4),M=new l.DataTexture(I,j,3,l.RGBAFormat,l.FloatType);M.minFilter=M.magFilter=l.NearestFilter,M.generateMipmaps=!1;const S=new Float32Array(j*3),k=new Float32Array(j*3),K=new Float32Array(j*3),O={travel:w.startTravel,flick:0,drip:0,driven:!1},ae=new l.Vector3,Me=new l.Vector3(0,0,-1),te=new l.Vector3,be=n=>W((n-v)/h,0,j-1.001);function oe(n,r=new l.Vector3){const b=be(n),y=Math.floor(b),D=b-y,m=y*3;return r.set(k[m]+(k[m+3]-k[m])*D,k[m+1]+(k[m+4]-k[m+1])*D,k[m+2]+(k[m+5]-k[m+2])*D)}const ie=qe(A.fork("enso"),E);await i.yield?.();const ke=n=>W((n-.12)/.68,0,1);function ve(n){for(let B=0;B<j;B++)Ge(f,O.travel-(v+B*h),S,B*3);let r=0,b=1,y=0;const D=6.2832/e.l1,m=6.2832/e.l2;for(let B=0;B<j;B++){const _=Math.max(0,B-1)*3,q=Math.min(j-1,B+1)*3,R=B*3;let N=S[_]-S[q],G=S[_+1]-S[q+1],Y=S[_+2]-S[q+2];const Q=Math.hypot(N,G,Y)||1;N/=Q,G/=Q,Y/=Q;let Z=r*N+b*G+y*Y;r-=N*Z,b-=G*Z,y-=Y*Z;const se=-N*G,Be=1-G*G,Pe=-Y*G,ne=Math.hypot(se,Be,Pe);if(ne>.25){const ge=.1*ne;r+=(se/ne-r)*ge,b+=(Be/ne-b)*ge,y+=(Pe/ne-y)*ge}const me=Math.hypot(r,b,y)||1;r/=me,b/=me,y/=me,K[R]=r,K[R+1]=b,K[R+2]=y;const _e=G*y-Y*b,Re=Y*r-N*y,Ne=N*b-G*r,de=v+B*h,De=O.travel-de,Ce=X(-10,60,de)*(.7+.6*W(de/c,0,1))*(1-X(c,c+40,de)),we=e.a1*Ce*Math.sin(D*De+D*e.v*n+e.p1),ye=e.a2*Ce*Math.sin(m*De+m*e.v*1.3*n+e.p2);k[R]=S[R]+r*we+_e*ye,k[R+1]=S[R+1]+b*we+Re*ye,k[R+2]=S[R+2]+y*we+Ne*ye}const U=O.flick,H=X(0,.14,U)*(1-X(.8,1,U));if(H>.001){const B=ke(U),_=E.th0-B*ie.sweep,q=ie.inner(B)+ie.width(B)*.5;oe(c,te);const R=(C.x+Math.cos(_)*q-te.x)*H,N=(C.y+Math.sin(_)*q-te.y)*H,G=(C.z+.6-te.z)*H;for(let Y=Math.floor(be(c-80));Y<j;Y++){const Q=v+Y*h,Z=Q<=c?Math.pow(X(c-78,c,Q),1.5):1-X(c,c+30,Q),se=Y*3;k[se]+=R*Z,k[se+1]+=N*Z,k[se+2]+=G*Z}}for(let B=0;B<j;B++){const _=B*3,q=B*4,R=(j+B)*4,N=(2*j+B)*4;I[q]=k[_],I[q+1]=k[_+1],I[q+2]=k[_+2],I[R]=K[_],I[R+1]=K[_+1],I[R+2]=K[_+2],I[N]=S[_],I[N+1]=S[_+1],I[N+2]=S[_+2]}M.needsUpdate=!0,oe(-8,ae),oe(c,te);const pe=oe(-12,Ee);Me.copy(pe).sub(ae).normalize()}const Ee=new l.Vector3;function re(n){n=W(n,0,1);const r=w.endTravel-w.startTravel,b=r/.66667,y=b*.5/3;O.travel=n<.5?w.startTravel+b*n:w.endTravel-y*Math.pow(1-(n-.5)/.5,3),O.flick=W((n-.72)/.2,0,1),O.drip=W((n-.8)/.2,0,1)}await i.yield?.();const J={uSpine:{value:M},uSpineInfo:{value:new l.Vector3(v,1/h,j)},uTime:{value:0},uInk:{value:z[5]},uInk2:{value:z[4]},uPaper:{value:z[0].clone().multiplyScalar(.82)},uRed:{value:z[6]},uPix:{value:85e-5},uFade:{value:new l.Vector2(u.fade?.[0]??1e6,u.fade?.[1]??2e6)},uGirth:{value:s},uLen:{value:c},uSeed:{value:p(0,50)},uBelly:{value:p(.75,1)},uMistBand:{value:new l.Vector4(1e5,1e5,0,0)},uFlow:{value:0},uEnsoC:{value:C},uEnsoN:{value:new l.Vector3(0,0,1)},uReveal:{value:0},uDrip:{value:0},uGhost:{value:0}},le=(n,r,b)=>{const y=l.UniformsUtils.clone(l.UniformsLib.fog);for(const D of b)y[D]=J[D];return u.tone&&(y.uPaperD={value:u.tone.paper}),new l.ShaderMaterial({vertexShader:n,fragmentShader:u.tone?r.replace("//TONE",u.tone.glsl):r,defines:u.tone?{DISPLAY_COMPOSE:1}:{},uniforms:y,fog:!0,transparent:!0,depthWrite:!1,side:l.DoubleSide})},he=new l.Group;he.name="ink-dragon";const Te=new l.Sphere(new l.Vector3(0,60,0),1e5),ce=(n,r,b)=>{n.boundingSphere=Te;const y=new l.Mesh(n,r);return y.frustumCulled=!1,y.renderOrder=b,he.add(y),y};{const r=new Float32Array(9006),b=new Uint16Array(1500*6);for(let D=0;D<=1500;D++){const m=-3+(c+3)*(D/1500),U=o(m);if(r.set([m,-1,U,m,1,U],D*6),D<1500){const H=D*2;b.set([H,H+1,H+2,H+1,H+3,H+2],D*6)}}const y=new l.BufferGeometry;y.setAttribute("position",new l.BufferAttribute(r,3)),y.setIndex(new l.BufferAttribute(b,1)),ce(y,le(Ye,We,["uSpine","uSpineInfo","uTime","uInk","uInk2","uFade","uMistBand","uGirth","uLen","uSeed","uBelly"]),2)}await i.yield?.(),ce(await He(A.fork("strokes"),c,n=>o(n)*s,{redEye:u.redEye!==!1},async()=>{await i.yield?.()}),le(Xe,Je,["uSpine","uSpineInfo","uTime","uInk","uInk2","uPaper","uRed","uPix","uFade","uMistBand"]),3),await i.yield?.();{const n=u.droplets??900,r=A.fork("drops"),b=new Float32Array(n*4),y=new Float32Array(n*4),D=new Float32Array(n*4);for(let U=0;U<n;U++){const H=Math.pow(r(),1.4)*c*.92,pe=Math.min(r.range(90,280),V-2-H);let B=r.gauss(),_=r.gauss()*.8+.25,q=r.gauss();const R=Math.hypot(B,_,q)||1,N=r.chance(.5)?1:0,G=r.chance(.08);b.set([H,pe,r(),r()],U*4),y.set([B/R,_/R,q/R,N?r.range(5,30):r.range(14,75)],U*4),D.set([N?r.range(.15,.5):(.7+Math.pow(r(),2.2)*3.2)*(G?1.8:1),N?1:r.range(.14,.6)*(G?.6:1),r.range(.03,.09),N],U*4)}const m=new l.InstancedBufferGeometry;m.setAttribute("position",new l.Float32BufferAttribute([-1,-1,0,1,-1,0,-1,1,0,1,1,0],3)),m.setIndex([0,1,2,1,3,2]),m.setAttribute("iA",new l.InstancedBufferAttribute(b,4)),m.setAttribute("iB",new l.InstancedBufferAttribute(y,4)),m.setAttribute("iC",new l.InstancedBufferAttribute(D,4)),m.instanceCount=n,ce(m,le(Qe,Ze,["uSpine","uSpineInfo","uTime","uInk","uInk2","uPix","uFade","uMistBand","uFlow","uEnsoC","uEnsoN"]),1)}const Fe=ce(ie.geometry,le(et,tt,["uTime","uInk","uInk2","uPix","uFade","uReveal","uDrip","uGhost"]),4);Fe.position.copy(C),await i.yield?.(),re(1),ve(0);const Ie=ae.clone();re(0),ve(0);const ze=E.th0,Ae=E.rIn+1.2,P=C,Se={object:he,radius:80,height:125,center:new l.Vector3(P.x-2,P.y+3,P.z-6),ground:!1,groundY:0,anchors:{portalSeat:{position:P.clone(),facing:new l.Vector3(0,0,1),radius:E.rIn-.05},flyThrough:[[0,0,260],[0,0,160],[0,0,80],[0,0,30],[0,0,0],[0,0,-20]].map(n=>new l.Vector3(P.x+n[0],P.y+n[1],P.z+n[2])),viewpoints:{approach:new l.Vector3(P.x,P.y+2,P.z+170),reveal:new l.Vector3(P.x-34,P.y+12,P.z+230),side:new l.Vector3(P.x+150,P.y+20,P.z+70),below:new l.Vector3(P.x+20,P.y-50,P.z+120)},ensoCenter:P.clone(),ensoStart:new l.Vector3(P.x+Math.cos(ze)*Ae,P.y+Math.sin(ze)*Ae,P.z),headRest:Ie,course:x},timing:w,head:ae,headDir:Me,tail:te,getBodyPoint:oe,mistBand:J.uMistBand.value,fadeRange:J.uFade.value,ensoMesh:Fe,setCourse(n,r){const b=L(n,r);return Se.anchors.course=x,b},setProgress(n){O.driven=!0,re(n)},setTravel(n){O.driven=!0,O.travel=n},setGhost(n){J.uGhost.value=W(n,0,1)},setEnso(n,r){O.driven=!0,O.flick=W(n,0,1),r!==void 0&&(O.drip=W(r,0,1))},update(n,r,b){O.driven||re(.62+.38*W(r%36/10,0,1)),J.uTime.value=r,J.uFlow.value=O.travel+r*2.5,J.uReveal.value=ke(O.flick),J.uDrip.value=O.drip,ve(r)},dispose(){M.dispose()}};return Se}export{ot as buildHero};
