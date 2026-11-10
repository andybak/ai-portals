import*as m from"three";const k=9,T=8,D=7,I=6.5,R=1.8,ke=4.3,E=Math.sqrt(3),j=k*2/E,N=I*2/E,Q=[[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]],se=(t,e)=>[2*k*(t+e/2),k*E*e],ce=(t,e)=>(Math.abs(t)+Math.abs(e)+Math.abs(t+e))/2,O=(t,e)=>(t%e+e)%e;function pe(t,e){const a=Math.round(t/4),u=Math.round(e/4);for(let d=a-1;d<=a+1;d++)for(let c=u-1;c<=u+1;c++)if(ce(t-4*d,e-4*c)<=1)return[d,c];return null}function xe(t,e){const a=[];for(let c=0;c<6;c++)a.push(pe(t+Q[c][0],e+Q[c][1])?1:0);let u=-1,d=!1;for(let c=0;c<6;c++)a[c]&&a[O(c+3,6)]&&(d=!0,u=Math.min(c,O(c+3,6)));if(!d)for(let c=0;c<6;c++)a[c]&&a[O(c+1,6)]&&(u=c);return{open:a,corner:d,rot:u,doors:d?[]:[O(u+3,6),O(u+4,6)]}}function V(){const t=[],e=[],a=[],u=[],d=[],c={get triangles(){return d.length/3},quad(h,b,l,o,p,f=[0,0,1,1]){const r=t.length/3,v=b[0]-h[0],y=b[1]-h[1],w=b[2]-h[2],g=o[0]-h[0],s=o[1]-h[1],z=o[2]-h[2];let A=y*z-w*s,M=w*g-v*z,F=v*s-y*g;const C=Math.hypot(A,M,F)||1;A/=C,M/=C,F/=C;for(const i of[h,b,l,o])t.push(i[0],i[1],i[2]),e.push(A,M,F),u.push(p);return a.push(f[0],f[1],f[2],f[1],f[2],f[3],f[0],f[3]),d.push(r,r+1,r+2,r,r+2,r+3),c},box(h,b,l,o,p,f,r,v,y,w,g,s=""){const z=(F,C,i)=>[h[0]+b[0]*F+l[0]*C+o[0]*i,h[1]+b[1]*F+l[1]*C+o[1]*i,h[2]+b[2]*F+l[2]*C+o[2]*i];if((b[1]*l[2]-b[2]*l[1])*o[0]+(b[2]*l[0]-b[0]*l[2])*o[1]+(b[0]*l[1]-b[1]*l[0])*o[2]<0){const F=p;p=f,f=F,s=s.replace("l","L").replace("r","l").replace("L","r")}const M=[z(p,r,y),z(f,r,y),z(f,v,y),z(p,v,y),z(p,r,w),z(f,r,w),z(f,v,w),z(p,v,w)];return s.includes("f")||c.quad(M[4],M[5],M[6],M[7],g),s.includes("b")||c.quad(M[1],M[0],M[3],M[2],g),s.includes("r")||c.quad(M[5],M[1],M[2],M[6],g),s.includes("l")||c.quad(M[0],M[4],M[7],M[3],g),s.includes("t")||c.quad(M[7],M[6],M[2],M[3],g),s.includes("u")||c.quad(M[0],M[1],M[5],M[4],g),c},ball(h,b,l,o,p,f,r){for(let v=0;v<f;v++)for(let y=0;y<p;y++){const w=(g,s)=>{const z=g/p*Math.PI*2,A=s/f*Math.PI;return[h+o*Math.sin(A)*Math.cos(z),b+o*Math.cos(A),l+o*Math.sin(A)*Math.sin(z)]};c.quad(w(y,v+1),w(y+1,v+1),w(y+1,v),w(y,v),r)}return c},build(){const h=new m.BufferGeometry;return h.setAttribute("position",new m.Float32BufferAttribute(t,3)),h.setAttribute("normal",new m.Float32BufferAttribute(e,3)),h.setAttribute("uv",new m.Float32BufferAttribute(a,2)),h.setAttribute("aMat",new m.Float32BufferAttribute(u,1)),h.setIndex(d),h}};return c}const ge=[.25,1.55,2.85,4.15,5.45,6.75],U=3.6,G=6.2,P=[[-1.8,5.45,3.118],[1.8,5.45,-3.118]],ve=.55,ue=.25,W={half:2.5,w:U/2,nicheX:1.3,nicheZ:-4.45,stairZ:-3.15,stairScale:.78,mirrorX:1.9,mirrorY0:.5,mirrorY1:5.6,lamp:[0,5.45,-2.5],lampR:.24};function be(t,e){const a=(d,c)=>[d*Math.cos((30+60*c)*Math.PI/180),d*Math.sin((30+60*c)*Math.PI/180)],u=(d,c,h,b,l,o)=>t.quad([d[0],h,d[1]],[c[0],h,c[1]],[c[0],b,c[1]],[d[0],b,d[1]],l,o);for(let d=0;d<6;d++){const c=d*Math.PI/3,h=[Math.cos(c),Math.sin(c)],b=[-Math.sin(c),Math.cos(c)],l=j/2,o=(f,r)=>[h[0]*f+b[0]*r,h[1]*f+b[1]*r];e[d]&&(u(o(k,l),o(k,-l),-1,0,0),u(o(k-.25,l),o(k-.25,-l),0,R,10,[0,0,13,1]),u(o(k-.25,-l),o(k-.25,l),0,R,10,[0,0,13,1]));const p=a(j,d);(e[d]||e[(d+1)%6])&&t.box([p[0]*.972,0,p[1]*.972],[1,0,0],[0,1,0],[0,0,1],-.26,.26,0,R+.25,-.26,.26,4,"u")}return t.build()}function he(t,e){const a=V(),u=t==="edge"?[1,1,0,0,0,0]:[1,0,0,1,0,0],d=t==="edge"?[3,4]:[];if(e===3)return be(a,u);const c=e===0||e===4,h=e===0,b=[1,0,0],l=[0,1,0],o=(v,y,w,g,s,z)=>a.quad([v[0],w,v[1]],[y[0],w,y[1]],[y[0],g,y[1]],[v[0],g,v[1]],s,z),p=(v,y)=>[v*Math.cos((30+60*y)*Math.PI/180),v*Math.sin((30+60*y)*Math.PI/180)],f=[0,1,2,3,4,5].map(v=>p(j,v)),r=(v,y)=>[v[0],y,v[1]];a.quad(r(f[3],0),r(f[2],0),r(f[1],0),r(f[0],0),2,[0,0,1,1]),a.quad(r(f[5],0),r(f[4],0),r(f[3],0),r(f[0],0),2,[0,0,1,1]),a.quad(r(f[0],D),r(f[1],D),r(f[2],D),r(f[3],D),3),a.quad(r(f[0],D),r(f[3],D),r(f[4],D),r(f[5],D),3);for(let v=0;v<6;v++){const y=v*Math.PI/3,w=[Math.cos(y),Math.sin(y)],g=[-Math.sin(y),Math.cos(y)],s=(i,n)=>[w[0]*i+g[0]*n,w[1]*i+g[1]*n],z=[w[0],0,w[1]],A=[g[0],0,g[1]];if(u[v]){const i=j/2;if(o(s(k,i),s(k,-i),-1,0,0),c){a.box([0,0,0],A,l,z,-i,i,R-.16,R,k-.42,k-.08,4),a.box([0,0,0],A,l,z,-i,i,0,.22,k-.4,k-.1,4,"u");const n=13;for(let x=0;x<n;x++){const L=-i+(x+.5)*2*i/n;a.box([0,0,0],A,l,z,L-.09,L+.09,.22,R-.16,k-.34,k-.16,4,"tu")}}else o(s(k-.25,i),s(k-.25,-i),0,R,e===1?10:11,[0,0,13,1]),e===1&&o(s(k-.25,-i),s(k-.25,i),0,R,10,[0,0,13,1])}else{const i=N/2;if(d.includes(v)&&h){const n=U/2/N;o(s(I,-i),s(I,-U/2),0,D,1,[0,0,.5-n,1]),o(s(I,U/2),s(I,i),0,D,1,[.5+n,0,1,1]),o(s(I,-U/2),s(I,U/2),G,D,0);for(const x of[-1,1])a.box([0,0,0],A,l,z,x*U/2-.22,x*U/2+.22,0,G+.25,I-.3,I+.05,0,"fu");a.box([0,0,0],A,l,z,-U/2-.22,U/2+.22,G,G+.3,I-.34,I+.05,0,"f")}else o(s(I,-i),s(I,i),0,D,1,d.includes(v)?[2,0,3,1]:[0,0,1,1]);if(c){const n=d.includes(v)?[[-i,-U/2-.22],[U/2+.22,i]]:[[-i,i]];for(const[x,L]of n){for(const B of ge)a.box([0,0,0],A,l,z,x,L,B-.07,B+.07,I-.2,I,0,"flr");const S=d.includes(v)?1:3;for(let B=0;B<=S;B++){const q=x+(L-x)*B/S;a.box([0,0,0],A,l,z,q-.08,q+.08,0,D,I-.22,I,0,"ftu")}}}}const M=(v+1)%6,F=p(N,v),C=p(j,v);u[v]!==u[M]?u[v]?o(C,F,0,D,0,[0,0,.4,1]):o(F,C,0,D,0,[0,0,.4,1]):u[v]&&(e<2||c)&&a.box([C[0]*.972,0,C[1]*.972],b,l,[0,0,1],-.26,.26,0,R+.25,-.26,.26,4,"u")}if(e<2||c)for(const v of P)a.ball(v[0],v[1],v[2],ve,c?10:6,c?6:4,5),a.box([v[0],0,v[2]],b,l,[0,0,1],-.04,.04,v[1]+ve-.05,D,-.04,.04,4,"tu");return a.build()}const X=`
  float h11(float n) { return fract(sin(n) * 43758.5453); }
  float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  vec3 h23(vec2 p) { return fract(sin(vec3(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)), dot(p, vec2(419.2, 371.9)))) * 43758.5453); }
  float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
`,we=`
  attribute float aMat;
  #ifdef USE_INSTANCING
  attribute vec4 iSeed; attribute vec4 iRoom;
  #endif
  uniform vec4 uSeedOne; uniform float uTime;
  // vSeed, vSway and vKind are the instance's own (alike at every vertex of it): they go flat, so that no pixel gets
  // them a last bit off by interpolation (the flicker's hash would turn that bit into a weave of two brightnesses)
  varying vec3 vLocal; varying vec3 vWorld; varying vec3 vNL; varying vec2 vUv; varying float vMat; flat varying vec4 vSeed; flat varying vec2 vSway;
  varying vec3 vRoom; flat varying float vKind;
  void main() {
    vLocal = position; vNL = normal; vUv = uv; vMat = aMat;
    vec4 p = vec4(position, 1.);
    // the lamps hang on rods and swing a little in the draught of the shaft, each gallery's its own way (the halo swings
    // with the same numbers); the light on the walls goes with them
    #ifdef USE_INSTANCING
    vSeed = iSeed;
    float hs = iSeed.x;
    vec3 swL = transpose(mat3(instanceMatrix)) * (vec3(cos(hs * 40.), 0., sin(hs * 40.)) * ${ue.toFixed(2)} * sin(uTime * 1.6 + hs * 25.));
    // (a vestibule's globe hangs still: no sway there, of the globe or of its light)
    vSway = swL.xz * (1. - iRoom.w);
    vRoom = position * iRoom.z + vec3(iRoom.x, 0., iRoom.y); vKind = iRoom.w;
    float toRod = min(length(position.xz - vec2(${P[0][0].toFixed(3)}, ${P[0][2].toFixed(3)})), length(position.xz - vec2(${P[1][0].toFixed(3)}, ${P[1][2].toFixed(3)})));
    float rod = (aMat > 3.5 && aMat < 4.5 && position.y > 5.8 && toRod < 0.07) ? clamp((7. - position.y) / 1.55, 0., 1.) : 0.;
    p.xz += vSway * max(rod, (aMat > 4.5 && aMat < 5.5) ? 1. : 0.);
    p = instanceMatrix * p;
    #else
    vSeed = uSeedOne; vSway = vec2(0.); vRoom = position; vKind = 0.;
    #endif
    vec4 w = modelMatrix * p; vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`,de=`
  // blank spines of several heights and colours on five long shelves; x across the wall in metres, y up
  vec3 bookWall(float x, float y, vec4 seed, vec3 wood, float blur, out float gilt) {
    gilt = 0.;
    float s = (y - 0.25) / 1.3, row = floor(s), fy = fract(s) * 1.3;
    if (y < 0.25 || y > 6.75) return wood * 0.8;
    if (fy < 0.07 || fy > 1.23) return wood * 1.15;
    float bay = floor(x / 2.502), fb = fract(x / 2.502) * 2.502;
    if (fb < 0.08 || fb > 2.422) return wood;
    float key = seed.x * 91.7 + row * 7.31;
    // the crimson hexagon's books are smaller than the others
    float bx = x / mix(0.17, 0.105, seed.z), id = floor(bx), fx = fract(bx);
    vec3 h = h23(vec2(id, key)), h2 = h23(vec2(id + 31., key + 5.));
    // the shelves are well filled: one bay in fifty stands empty (half of them in a stripped gallery), one book in
    // fifty is missing from its row, and the books stand 0.74 to 1.14 m tall under boards 1.16 m apart
    float emptied = step(h21(vec2(bay + row * 13., seed.x * 57.)), 0.02 + 0.5 * step(0.93, seed.x));
    float tall = (0.74 + 0.4 * h.y) * mix(1., 0.66, seed.z), yb = fy - 0.07;
    float isBook = step(0.07, fx) * step(yb, tall) * (1. - emptied) * step(0.02, h.x);
    // bindings: leather browns and ochres, a dull red, and the district's own (green or black)
    vec3 c = mix(vec3(0.30, 0.16, 0.08), vec3(0.52, 0.36, 0.17), h.z);
    c = mix(c, vec3(0.36, 0.08, 0.06), step(0.82, h2.x));
    c = mix(c, vec3(0.62, 0.54, 0.38), step(0.9, h2.y));
    vec3 dist = seed.y < 0.5 ? c : (seed.y < 1.5 ? vec3(0.07, 0.24, 0.13) : vec3(0.045, 0.045, 0.06));
    c = mix(c, dist * (0.7 + 0.6 * h.z), step(0.5, seed.y) * step(h2.z, 0.72));
    c = mix(c, mix(vec3(0.55, 0.05, 0.05), vec3(0.75, 0.42, 0.10), step(0.7, h2.x)) * (0.7 + 0.5 * h.z), seed.z);
    float rnd = 0.62 + 0.38 * cos((fx - 0.535) * 2.9);
    float band = step(0.55, h2.y) * (step(abs(yb - tall * 0.78), 0.022) + step(abs(yb - tall * 0.70), 0.012) + step(abs(yb - tall * 0.16), 0.022));
    gilt = band * isBook * (1. - blur) * (0.5 + 0.5 * h.x);
    vec3 book = c * rnd + vec3(0.75, 0.55, 0.2) * gilt * 0.5;
    // the back and the insides of a shelf are warm wood that takes the lamps' light like the rest of the wall: lightest
    // low in the compartment, in the shade of the board above toward its top; never under a third of the wood's own tone
    vec3 back = wood * mix(0.56, 0.33, smoothstep(0.45, 1.2, fy));
    // (in the crimson hexagon the shelves are lined with dark red cloth, so the room keeps its red)
    back = mix(back, vec3(0.16, 0.03, 0.025) * (0.8 + 0.4 * wood.r / 0.3), seed.z);
    vec3 sharp = mix(back, book, isBook);
    vec3 avg = mix(wood * 0.5, mix(vec3(0.36, 0.22, 0.11), dist, step(0.5, seed.y) * 0.6), 0.82 * (1. - emptied));
    avg = mix(avg, vec3(0.5, 0.12, 0.06), seed.z * 0.8 * (1. - emptied));
    return mix(sharp, avg, blur);
  }
`,ye=`
  uniform float uTime, uFogK, uGutter, uGlobe;
  uniform vec3 uLampCol, uCrimCol, uAmb, uDepth, uHaze;
  varying vec3 vLocal; varying vec3 vWorld; varying vec3 vNL; varying vec2 vUv; varying float vMat; flat varying vec4 vSeed; flat varying vec2 vSway;
  varying vec3 vRoom; flat varying float vKind;
  ${X}
  ${de}
  void main() {
    float mat = floor(vMat + 0.5), dist = length(vWorld - cameraPosition);
    vec3 n = normalize(vNL);
    float grain = 0.75 + 0.5 * vnoise(vec2((vLocal.x + vLocal.z) * 1.7, vLocal.y * 14.));
    vec3 wood = vec3(0.30, 0.165, 0.075) * grain;
    // the two lamps: which are lit comes with the cell; in the redder hour half of them gutter
    float code = floor(vSeed.w + 0.5), onA = step(0.5, mod(code, 2.)), onB = step(1.5, code);
    // (the crimson hexagon's lamps are tended by those who kneel there: they do not gutter)
    float gut = step(0.5, h11(vSeed.x * 9.1)) * uGutter * (1. - vSeed.z);
    // the flames are never still: each gallery's lamps waver at their own slow beat, with a small quick tremor
    float breathe = 1. + 0.11 * sin(uTime * 2.6 + vSeed.x * 30.) + 0.08 * sin(uTime * 3.7 + vSeed.x * 50.) + 0.03 * sin(uTime * 6.5 + vSeed.x * 70.);
    float flick = breathe * (1. - gut * (0.45 + 0.35 * sin(uTime * (5. + 4. * h11(vSeed.x * 3.3)) + vSeed.x * 40.) * sin(uTime * 1.7 + vSeed.x * 11.)));
    vec3 lampCol = mix(uLampCol, uCrimCol * 1.15, vSeed.z);
    vec3 alb = wood, emis = vec3(0.);
    if (mat == 0.) { float pk = (vLocal.x + vLocal.z) * 1.3; alb *= (0.86 + 0.28 * h11(floor(pk))) * (1. - 0.45 * step(fract(pk), 0.035) * step(abs(n.y), 0.5)) * (1. - 0.35 * step(abs(vLocal.y - 1.3), 0.035) - 0.35 * step(abs(vLocal.y - 5.9), 0.035)); }
    float fwx = fwidth(vUv.x) * ${N.toFixed(4)};
    float giltK = 0.;
    if (mat == 1.) {
      float door = step(1.5, vUv.x), u = vUv.x - 2. * door, x = u * ${N.toFixed(4)}, y = vUv.y * ${D.toFixed(1)};
      float blur = smoothstep(0.25, 0.9, fwx / 0.17);
      alb = bookWall(x, y, vSeed, wood, blur, giltK);
      float dx = abs(x - ${(N/2).toFixed(4)});
      float inDoor = door * step(dx, ${(U/2+.22).toFixed(2)}) * step(y, ${(G+.28).toFixed(2)});
      float mouth = door * step(dx, ${(U/2).toFixed(2)}) * step(y, ${G.toFixed(2)});
      alb = mix(alb, wood * 1.1, inDoor);
      alb = mix(alb, vec3(0.012, 0.009, 0.008), mouth);
      emis += mouth * lampCol * 0.05 * smoothstep(${G.toFixed(1)}, 0., y);
      alb *= 0.55 + 0.45 * smoothstep(0., 1.0, y);
    } else if (mat == 2.) {
      float bd = floor(vLocal.x / 0.62), run = vLocal.z + 1.7 * h11(bd * 3.1);
      float pl = h21(vec2(bd, floor(run / 3.4)));
      alb = vec3(0.33, 0.19, 0.095) * (0.7 + 0.5 * pl) * grain;
      float seam = step(fract(vLocal.x / 0.62), 0.045) + step(fract(run / 3.4), 0.012);
      alb *= 1. - 0.5 * clamp(seam, 0., 1.);
      // worn pale round the middle, where the librarians walk
      alb = mix(alb, vec3(0.42, 0.30, 0.17), 0.35 * smoothstep(5.5, 1., length(vLocal.xz)) * vnoise(vLocal.xz * 0.9));
    } else if (mat == 3.) {
      float ang = atan(vLocal.z, vLocal.x + 1e-5), rad = length(vLocal.xz);
      float beam = step(abs(fract(ang * 0.95493 + 0.5) - 0.5), 0.035 / max(rad * 0.33, 0.2)) + step(abs(rad - 4.4), 0.16) + step(abs(rad - 7.3), 0.16);
      alb = mix(vec3(0.44, 0.37, 0.26), wood * 0.9, clamp(beam, 0., 1.));
    } else if (mat == 4.) {
      alb = wood * 0.85 + vec3(0.03, 0.02, 0.0);
    } else if (mat == 10. || mat == 11.) {
      // the rail as a panel: cut through between the balusters in the middle make (10), painted in the far make (11)
      float solid = step(0.9, vUv.y) + step(vUv.y, 0.12) + step(abs(fract(vUv.x) - 0.5), 0.17);
      if (solid < 0.5 && mat == 10.) discard;
      alb = wood * (solid < 0.5 ? 0.35 : 0.85);
    } else if (mat == 5.) {
      float on = mix(onB, onA, step(0., vLocal.z));
      alb = vec3(0.5, 0.42, 0.28);
      emis = lampCol * (uGlobe * on * flick * (0.8 + 0.2 * n.y) + 0.04);
    } else if (mat == 7.) {
      float hatch = step(0.55, fract(vUv.y * 13.)) * step(0.12, vUv.x) * step(vUv.x, 0.88) * step(h11(floor(vUv.y * 13.) + vSeed.x * 7.), 0.85);
      alb = mix(vec3(0.62, 0.53, 0.36), vec3(0.3, 0.29, 0.27), hatch * 0.75);
    } else if (mat == 12.) {
      // an open page of the crimson hexagon: coloured shapes that stir (no letters), inside a cream margin
      vec2 pp = vUv * vec2(3., 2.2) + vSeed.x * 9.;
      float f1 = sin(pp.x * 2.1 + uTime * 0.6) * sin(pp.y * 2.7 - uTime * 0.45) + 0.5 * sin((pp.x + pp.y) * 3.3 + uTime * 0.8);
      vec3 pic = 0.5 + 0.5 * cos(6.2831 * (f1 * 0.35 + vUv.x * 0.25 + vec3(0.0, 0.33, 0.67)));
      pic = mix(pic, vec3(1., 0.75, 0.25), step(0.82, fract(f1 * 1.5 + 0.2)));
      float inside = step(0.08, vUv.x) * step(vUv.x, 0.92) * step(0.1, vUv.y) * step(vUv.y, 0.9) * (1. - step(abs(vUv.x - 0.5), 0.015));
      alb = vec3(0.6, 0.5, 0.34);
      emis = pic * inside * (0.9 + 0.25 * sin(uTime * 1.3 + vSeed.x * 20.));
    } else if (mat == 8.) {
      alb = vec3(0.012, 0.01, 0.01);
    } else if (mat == 9.) {
      alb = vec3(0.3, 0.26, 0.2) * (0.8 + 0.4 * vnoise(vLocal.xz * 0.7));
    }
    vec3 lit = uAmb * (0.75 + 0.25 * n.y);
    // faces turned out to the shaft take its dusk: cool shade against the warm rooms
    lit += uHaze * 1.5 * clamp(dot(n.xz, vLocal.xz) / max(length(vLocal.xz), 0.5), 0., 1.) * smoothstep(5., 8., length(vLocal.xz));
    // the room's lamps at their true places in the room's space (vRoom): a gallery's two (A and B, swinging), or a
    // vestibule's one globe, which burns by lamp code 2 in lamp B's stead (lamp A is out there)
    vec3 dA = vec3(${P[0][0].toFixed(3)} + vSway.x, ${P[0][1].toFixed(2)}, ${P[0][2].toFixed(3)} + vSway.y) - vRoom;
    vec3 dB = mix(vec3(${P[1][0].toFixed(3)} + vSway.x, ${P[1][1].toFixed(2)}, ${P[1][2].toFixed(3)} + vSway.y), vec3(${W.lamp[0].toFixed(3)}, ${W.lamp[1].toFixed(2)}, ${W.lamp[2].toFixed(3)}), vKind) - vRoom;
    float a2 = dot(dA, dA), b2 = dot(dB, dB);
    float nA = clamp(dot(n, dA) / sqrt(max(a2, 1e-4)), 0., 1.), nB = clamp(dot(n, dB) / sqrt(max(b2, 1e-4)), 0., 1.);
    // (the lamps hang 2.9 m from the nearest wall, where round 1's hung 4 m: the fall-off is 26 / (14 + d2), which gives
    // the floor under a lamp and the far walls what 22 / (8 + d2) gave them and keeps the near wall from burning out)
    lit += lampCol * flick * (onA * (0.24 + 0.76 * nA) * 26. / (14. + a2) + onB * (0.24 + 0.76 * nB) * 26. / (14. + b2));
    lit = min(lit, vec3(2.4));
    vec3 col = alb * lit + emis + vec3(1., 0.72, 0.3) * giltK * lit * 0.5;
    // a gleam on the floor under each lit lamp
    if (mat == 2.) col += lampCol * flick * 0.10 * (onA * exp(-dot(dA.xz, dA.xz) * 0.3) + onB * exp(-dot(dB.xz, dB.xz) * 0.3));
    float f = 1. - exp(-dist * uFogK);
    col = mix(col, mix(uDepth, uHaze, smoothstep(50., 300., dist)), clamp(f, 0., 1.));
    gl_FragColor = vec4(col, 1.);
  }
`;function Me(t){const e={uTime:{value:0},uFogK:{value:t.fogK},uGutter:{value:t.gutter},uGlobe:{value:t.globe},uLampCol:{value:t.lampCol},uCrimCol:{value:t.crimCol},uAmb:{value:t.amb},uDepth:{value:t.depth},uHaze:{value:t.haze},uSeedOne:{value:new m.Vector4(.37,0,0,3)}};return new m.ShaderMaterial({uniforms:e,vertexShader:we,fragmentShader:ye})}const ze=[0,0,1,0];async function Ae(t,e,a,u){const d=new m.Group,c=new Map;for(const r of t){const v=r.kind+"|"+r.make+"|"+(r.chunk||0);c.has(v)||c.set(v,[]),c.get(v).push(r)}const h=new m.Matrix4,b=new m.Quaternion,l=new m.Vector3(0,1,0),o=new m.Vector3(1,1,1),p=new m.Vector3;let f=0;for(const[r,v]of c){const[y,w]=r.split("|"),g=a[y][+w];g.boundingSphere||(g.computeBoundingBox(),g.computeBoundingSphere());const s=new m.InstancedMesh(g,e,v.length),z=new Float32Array(v.length*4),A=new Float32Array(v.length*4);v.forEach((F,C)=>{b.setFromAxisAngle(l,-F.rot*Math.PI/3),s.setMatrixAt(C,h.compose(p.set(F.x,F.y,F.z),b,o.setScalar(F.scale||1))),z.set(F.seed,C*4),A.set(F.room||ze,C*4)});const M=new m.BufferGeometry;for(const F of["position","normal","uv","aMat"])M.setAttribute(F,g.getAttribute(F));M.setIndex(g.index),M.boundingBox=g.boundingBox,M.boundingSphere=g.boundingSphere,M.setAttribute("iSeed",new m.InstancedBufferAttribute(z,4)),M.setAttribute("iRoom",new m.InstancedBufferAttribute(A,4)),s.geometry=M,s.instanceMatrix.needsUpdate=!0,s.computeBoundingSphere(),d.add(s),f+=g.index.count/3*v.length,u&&d.children.length%3===0&&await u()}return{object:d,triangles:f,meshes:d.children.length}}function fe(t,e,a,u,d=new m.Vector3){const c=t.rot*Math.PI/3,h=Math.cos(c),b=Math.sin(c);return d.set(t.x+e*h-u*b,t.y+a,t.z+e*b+u*h)}function Ce(t,e){const a=t.length,u=new Float32Array(a*3),d=new Float32Array(a*4);for(let o=0;o<a;o++){const p=t[o],f=o*3,r=o*4;u[f]=p.x,u[f+1]=p.y,u[f+2]=p.z,d[r]=p.on,d[r+1]=p.hash,d[r+2]=p.crim||0,d[r+3]=p.rod?1:0}const c=new m.BufferGeometry;c.setAttribute("position",new m.BufferAttribute(u,3)),c.setAttribute("aDat",new m.BufferAttribute(d,4)),c.boundingSphere=new m.Sphere(new m.Vector3,1e5);const h={uTime:{value:0},uPx:{value:500},uLampCol:{value:e.lampCol},uCrimCol:{value:e.crimCol},uGutter:{value:e.gutter},uFogK:{value:e.fogK*.42},uGain:{value:e.halo},uSize:{value:3.4}},b=new m.ShaderMaterial({uniforms:h,transparent:!0,depthWrite:!1,blending:m.AdditiveBlending,vertexShader:`
      attribute vec4 aDat; uniform float uTime, uPx, uGutter, uFogK, uSize; varying vec3 vC; varying float vK;
      ${X}
      void main() {
        // only a globe on a rod swings (aDat.w); a hand lamp's glow, the great lamp's and a niche's stay where they are
        vec3 sw = vec3(cos(aDat.y * 40.), 0., sin(aDat.y * 40.)) * ${ue.toFixed(2)} * aDat.w * sin(uTime * 1.6 + aDat.y * 25.);
        vec4 mv = modelViewMatrix * vec4(position + sw, 1.); gl_Position = projectionMatrix * mv;
        float d = max(-mv.z, 0.1), px = uSize * uPx / d * mix(0.42, 1., step(0.5, aDat.x));
        float gut = step(0.5, h11(aDat.y * 9.1)) * uGutter * (1. - aDat.z);
        float flick = (1. + 0.11 * sin(uTime * 2.6 + aDat.y * 30.) + 0.08 * sin(uTime * 3.7 + aDat.y * 50.) + 0.03 * sin(uTime * 6.5 + aDat.y * 70.)) * (1. - gut * (0.45 + 0.35 * sin(uTime * (5. + 4. * h11(aDat.y * 3.3)) + aDat.y * 40.) * sin(uTime * 1.7 + aDat.y * 11.)));
        // under a pixel and a half the point keeps its size and gives up brightness instead
        float small = clamp(px / 2.5, 0., 1.);
        gl_PointSize = clamp(px, 2.5, 120.);
        // a lamp near the eye is its globe; the halo comes up with distance
        vK = aDat.x * flick * small * small * exp(-d * uFogK) * mix(0.07, 1., smoothstep(6., 40., d));
        vC = vec3(aDat.z);
      }`,fragmentShader:`
      uniform vec3 uLampCol, uCrimCol; uniform float uGain; varying vec3 vC; varying float vK;
      void main() {
        vec2 c = gl_PointCoord - 0.5; float r2 = clamp(dot(c, c) * 4., 0., 1.);
        float g = (1. - r2); g = g * g * (0.35 + 0.65 * g * g);
        gl_FragColor = vec4(mix(uLampCol, uCrimCol, vC.x) * g * vK * uGain, 1.);
      }`}),l=new m.Points(c,b);return l.frustumCulled=!1,l.renderOrder=5,{object:l,uniforms:h,count:a}}function Pe(t=1.35,e=14,a=!1){const u=V(),d=[0,1,0];for(let c=0;c<e;c++){const h=c/e*Math.PI*2,b=(c+1.08)/e*Math.PI*2,l=c/e*T,o=(v,y,w)=>[v*Math.cos(y),w,v*Math.sin(y)];u.quad(o(.2,h,l),o(.2,b,l),o(t,b,l),o(t,h,l),0),u.quad(o(.2,h,l-.2),o(t,h,l-.2),o(t,b,l-.2),o(.2,b,l-.2),0),u.quad(o(.2,h,l-T/e),o(t,h,l-T/e),o(t,h,l),o(.2,h,l),0),a||u.quad(o(t,h,l-.2),o(t,h,l),o(t,b,l),o(t,b,l-.2),0);const p=l+T/e;if(u.quad(o(t,h,l+1.5),o(t,b,p+1.5),o(t,b,p+1.66),o(t,h,l+1.66),4),u.quad(o(t,b,p+1.5),o(t,h,l+1.5),o(t,h,l+1.66),o(t,b,p+1.66),4),a)continue;const f=(h+b)/2,r=o(t-.05,f,l);u.box(r,[1,0,0],d,[0,0,1],-.05,.05,0,1.55,-.05,.05,4,"tu")}return u.box([0,0,0],[1,0,0],d,[0,0,1],-.22,.22,0,T,-.22,.22,0,"tu"),u.build()}const De=4.6;function me(t){const e=[],a=[],u=[],d=[],c=[],h=t==="kneel",b=t==="lean"?.5:t==="read"?.08:t==="sleep"?.12:h?.3:.05,l=h?2.5:3.75,o=Math.cos(b),p=Math.sin(b),f=(i,n,x)=>{const L=h?.9:2;if(n<=L)return[i,n,x];const S=n-L;return[i*o+S*p,L+S*o-i*p,x]},r=(i,n,x,L)=>{const S=e.length/3,[B,q,Y,K]=i.map(_=>f(_[0],_[1],_[2])),H=q[0]-B[0],$=q[1]-B[1],te=q[2]-B[2],ae=K[0]-B[0],oe=K[1]-B[1],ne=K[2]-B[2];let ie=$*ne-te*oe,le=te*ae-H*ne,re=H*oe-$*ae;const Z=Math.hypot(ie,le,re)||1;for(const _ of[B,q,Y,K])e.push(_[0],_[1],_[2]),a.push(ie/Z,le/Z,re/Z),u.push(n[0],n[1],n[2]),d.push(x,L||0);c.push(S,S+1,S+2,S,S+2,S+3)},v=(i,n,x,L,S=0)=>{const B=L/8*Math.PI*2;return[S+n*Math.cos(B),i,x*Math.sin(B)]},y=(i,n,x,L,S,B,q,Y,K=0,H=0)=>{for(let $=0;$<8;$++)r([v(i,n,x,$+1,K),v(i,n,x,$,K),v(L,S,B,$,H),v(L,S,B,$+1,H)],q,Y)},w=[1,1,1],g=[.42,.28,.19];y(0,h?1:.82,h?.9:.74,l*.55,.6,.62,w,0,h?-.5:0,0),y(l*.55,.6,.62,l,.42,.7,w,0),y(l,.42,.7,l+.22,.2,.22,w,0);const s=l+.5,z=.12;y(l+.15,.3,.3,s,.4,.4,w,1,0,z),y(s,.4,.4,s+.36,.22,.22,w,1,z,z-.05),r([[z-.05-.2,s+.36,-.2],[z-.05-.2,s+.36,.2],[z-.05+.2,s+.36,.2],[z-.05+.2,s+.36,-.2]],w,1),r([[z+.36,s-.26,.2],[z+.36,s-.26,-.2],[z+.4,s+.14,-.2],[z+.4,s+.14,.2]],g,1);const A=t==="lean"?[1.25,l-1.5]:t==="sleep"?[.55,l-1.35]:t==="climb"?[.95,l-.9]:[.9,l-1.15];for(const i of[-1,1]){const n=[.1,l-.25,i*.62],x=[A[0],A[1],i*(t==="sleep"?.12:.34)];r([[n[0],n[1]-.3,n[2]],[x[0],x[1]-.2,x[2]],[x[0],x[1]+.2,x[2]],[n[0],n[1]+.25,n[2]]].map(L=>L),w,2),r([[x[0],x[1]-.2,x[2]],[n[0],n[1]-.3,n[2]+i*.3],[n[0],n[1]+.25,n[2]+i*.3],[x[0],x[1]+.2,x[2]]],w,2),i>0?r([[n[0],n[1]+.25,n[2]],[x[0],x[1]+.2,x[2]],[x[0],x[1]+.2,x[2]+.2],[n[0],n[1]+.25,n[2]+.3]],w,2):r([[x[0],x[1]+.2,x[2]],[n[0],n[1]+.25,n[2]],[n[0],n[1]+.25,n[2]-.3],[x[0],x[1]+.2,x[2]-.2]],w,2)}const M=[.66,.57,.4],F=[.2,.1,.05];if(t==="read"||h){const i=A[0]+.1,n=A[1]+.22;r([[i-.3,n+.02,0],[i+.32,n+.3,0],[i+.32,n+.42,.62],[i-.3,n+.14,.62]],M,2,1),r([[i-.3,n+.14,-.62],[i+.32,n+.42,-.62],[i+.32,n+.3,0],[i-.3,n+.02,0]],M,2,1),r([[i-.3,n+.08,-.66],[i-.3,n+.08,.66],[i+.36,n+.36,.66],[i+.36,n+.36,-.66]],F,2)}if(t==="carry")for(let i=0;i<4;i++){const n=A[1]+.18+i*.24,x=.42-.03*(i%2),L=A[0]-.42,S=A[0]+.3,B=[[.3,.12,.07],[.12,.2,.12],[.36,.26,.12],[.1,.09,.1]][i];r([[S,n,x],[S,n,-x],[S,n+.22,-x],[S,n+.22,x]],B,2),r([[L,n,x],[S,n,x],[S,n+.22,x],[L,n+.22,x]],M,2),r([[S,n,-x],[L,n,-x],[L,n+.22,-x],[S,n+.22,-x]],M,2),i===3&&r([[L,n+.22,x],[S,n+.22,x],[S,n+.22,-x],[L,n+.22,-x]],B,2)}if(t==="climb"){const i=A[0]+.15,n=A[1]+.1;for(let x=0;x<4;x++){const L=x*Math.PI/2,S=L+Math.PI/2,B=.17;r([[i+B*Math.cos(S),n,B*Math.sin(S)],[i+B*Math.cos(L),n,B*Math.sin(L)],[i+B*Math.cos(L),n+.4,B*Math.sin(L)],[i+B*Math.cos(S),n+.4,B*Math.sin(S)]],[1,.8,.45],2,2)}}const C=new m.BufferGeometry;return C.setAttribute("position",new m.Float32BufferAttribute(e,3)),C.setAttribute("normal",new m.Float32BufferAttribute(a,3)),C.setAttribute("color",new m.Float32BufferAttribute(u,3)),C.setAttribute("aPart",new m.Float32BufferAttribute(d,2)),C.setIndex(c),C}function Le(t,e,a){const u=new m.Group,d={uTime:{value:0},uFogK:{value:a.fogK},uLampCol:{value:a.lampCol},uCrimCol:{value:a.crimCol},uAmb:{value:a.amb},uDepth:{value:a.depth},uHaze:{value:a.haze},uHand:{value:a.handLamp}},c=new m.ShaderMaterial({uniforms:d,side:m.DoubleSide,vertexColors:!0,vertexShader:`
      attribute vec2 aPart; attribute vec4 iPos; attribute vec4 iCell; attribute vec3 iCol; attribute vec4 iDat;
      uniform float uTime;
      varying vec3 vLocal; varying vec3 vWorld; varying vec3 vNL; varying vec3 vCol; varying vec3 vFig; varying vec4 vDat; varying float vFlat;
      vec2 rot(vec2 v, float a) { float c = cos(a), s = sin(a); return vec2(v.x * c - v.y * s, v.x * s + v.y * c); }
      void main() {
        vec3 p = position, n = normal; float h = iDat.x, t = uTime, climb = step(0.5, iDat.y);
        // the head turns and nods now and then; the hands and what they hold rise and fall with the breath
        if (aPart.x > 0.5 && aPart.x < 1.5) { float tu = 0.55 * sin(t * 0.31 + h * 40.) * smoothstep(0.2, 0.9, sin(t * 0.13 + h * 9.)); p.xz = rot(p.xz - vec2(0.1, 0.), tu) + vec2(0.1, 0.); n.xz = rot(n.xz, tu); }
        if (aPart.x > 1.5) p.y += 0.05 * sin(t * 0.9 + h * 20.) + 0.12 * smoothstep(0.93, 1., sin(t * 0.5 + h * 31.));
        p.x += 0.035 * (p.y / 4.6) * sin(t * 0.7 + h * 17.) + climb * 0.1 * (p.y / 4.6) * sin(t * 2.2 + h * 5.);
        float yaw = iPos.w; vec3 base = iPos.xyz;
        // one who carries an armful walks a small round of his own (1 m) at his own pace
        if (climb < 0.5 && iDat.z > 0.) { float wa = h * 6.2832 + t * iDat.z; base.xz += vec2(cos(wa), sin(wa)); yaw = wa + 1.5708; p.y += 0.05 * abs(sin(t * iDat.z * 3.4 + h * 9.)); }
        if (climb > 0.5) {
          float range = iPos.w, s = mod(h * range + t * iDat.z, range), a = s / ${T.toFixed(1)} * 6.2831853 + iCell.w;
          base += vec3(cos(a) * 0.86, s, sin(a) * 0.86); yaw = a + 1.5708;
          // he grows from nothing over the first metre of his stair's range and shrinks to nothing over the last: the
          // loop never shows a figure vanishing or appearing whole
          p *= smoothstep(0., 1., s) * smoothstep(0., 1., range - s);
        }
        p.xz = rot(p.xz, yaw); n.xz = rot(n.xz, yaw);
        vec3 w = base + p;
        vec3 l = w - iCell.xyz; l.xz = rot(l.xz, -iCell.w); vec3 nl = n; nl.xz = rot(nl.xz, -iCell.w);
        vLocal = mix(l, vec3(0., 4., 0.), climb); vNL = nl; vWorld = w; vFig = position; vDat = iDat; vFlat = aPart.y;
        vCol = color.g > 0.95 ? iCol : color.rgb;
        gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
      }`,fragmentShader:`
      uniform float uTime, uFogK, uHand; uniform vec3 uLampCol, uCrimCol, uAmb, uDepth, uHaze;
      varying vec3 vLocal; varying vec3 vWorld; varying vec3 vNL; varying vec3 vCol; varying vec3 vFig; varying vec4 vDat; varying float vFlat;
      void main() {
        vec3 n = normalize(vNL); if (!gl_FrontFacing) n = -n;
        float dist = length(vWorld - cameraPosition), climb = step(0.5, vDat.y);
        float code = floor(vDat.w + 0.5), glow = step(7.5, code); code -= 8. * glow;
        float crim = step(3.5, code); code -= 4. * crim;
        float onA = max(step(0.5, mod(code, 2.)), climb), onB = step(1.5, code);
        vec3 lampCol = mix(uLampCol, uCrimCol, crim);
        vec3 alb = vCol * (0.62 + 0.38 * clamp(vFig.y / 4.6, 0., 1.));
        // pages: cream with grey hatching, never a letter
        if (vFlat > 0.5 && vFlat < 1.5) { float hz = abs(vFig.z); alb = mix(alb, vec3(0.3, 0.29, 0.27), 0.7 * step(0.5, fract(vFig.x * 9.)) * step(0.08, hz) * step(hz, 0.54)); }
        vec3 lit = uAmb * (0.75 + 0.25 * n.y);
        vec3 dA = vec3(${P[0][0].toFixed(3)}, ${P[0][1].toFixed(2)}, ${P[0][2].toFixed(3)}) - vLocal, dB = vec3(${P[1][0].toFixed(3)}, ${P[1][1].toFixed(2)}, ${P[1][2].toFixed(3)}) - vLocal;
        float a2 = dot(dA, dA), b2 = dot(dB, dB);
        float nA = clamp(dot(n, dA) / sqrt(max(a2, 1e-4)), 0., 1.), nB = clamp(dot(n, dB) / sqrt(max(b2, 1e-4)), 0., 1.);
        lit += lampCol * (onA * (0.3 + 0.7 * nA) * 26. / (14. + a2) + onB * (0.3 + 0.7 * nB) * 26. / (14. + b2));
        // (held lower than in round 1, 0.95 for 1.25: the lamps now hang nearer the walls where the readers stand)
        lit = min(lit, vec3(0.95));
        // the small lamp a figure holds at night lights the front of his robe from the hand: only on a figure who holds
        // one (his glow is laid at the hand: a standing or kneeling figure; never one who carries an armful) and on a
        // climber, whose lamp is in his forward hand
        lit += uLampCol * uHand * max(glow, climb) * 0.5 * smoothstep(-0.2, 0.8, vFig.x) * smoothstep(4.4, 2.2, vFig.y);
        vec3 col = alb * lit;
        if (vFlat > 1.5) col = uLampCol * (2.2 + 2.2 * max(uHand, climb));
        float f = 1. - exp(-dist * uFogK);
        col = mix(col, mix(uDepth, uHaze, smoothstep(50., 300., dist)), clamp(f, 0., 1.));
        gl_FragColor = vec4(col, 1.);
      }`}),h=(p,f,r)=>{if(!f.length)return;const v=p.clone(),y=f.length,w=new Float32Array(y*4),g=new Float32Array(y*4),s=new Float32Array(y*3),z=new Float32Array(y*4);f.forEach((M,F)=>r(M,F,w,g,s,z)),v.setAttribute("iPos",new m.InstancedBufferAttribute(w,4)),v.setAttribute("iCell",new m.InstancedBufferAttribute(g,4)),v.setAttribute("iCol",new m.InstancedBufferAttribute(s,3)),v.setAttribute("iDat",new m.InstancedBufferAttribute(z,4));const A=new m.InstancedMesh(v,c,y);A.frustumCulled=!1,u.add(A)},b={};for(const p of t)(b[p.pose]||(b[p.pose]=[])).push(p);let l=0;for(const p of Object.keys(b)){const f=me(p);l+=f.index.count/3*b[p].length,h(f,b[p],(r,v,y,w,g,s)=>{y.set([r.x,r.y,r.z,r.yaw],v*4),w.set([r.cell.x,r.cell.y,r.cell.z,r.cell.rot*Math.PI/3],v*4),g.set(r.robe,v*3),s.set([r.hash,0,r.pose==="carry"?.3+.25*r.hash:0,r.lamps+(r.crim?4:0)+(r.glow?8:0)],v*4)}),f.dispose()}const o=me("climb");return l+=o.index.count/3*e.length,h(o,e,(p,f,r,v,y,w)=>{r.set([p.x,p.y,p.z,p.range],f*4),v.set([0,0,0,p.rot],f*4),y.set(p.robe,f*3),w.set([p.hash,1,p.speed,3],f*4)}),o.dispose(),{object:u,uniforms:d,triangles:l}}const Fe=1.4;async function Se(t,e,a,u){const d={uTime:{value:0},uFogK:{value:a.fogK},uDepth:{value:a.depth},uHaze:{value:a.haze},uGain:{value:a.pageGain},uLampCol:{value:a.lampCol}},c=new m.ShaderMaterial({uniforms:d,side:m.DoubleSide,vertexShader:`
      attribute vec4 iA; attribute vec4 iB; attribute vec4 iC; uniform float uTime;
      varying vec2 vUv; varying vec3 vN; varying vec3 vWorld; varying vec4 vB;
      mat3 rotAxis(vec3 ax, float a) { float c = cos(a), s = sin(a), o = 1. - c;
        return mat3(o * ax.x * ax.x + c, o * ax.x * ax.y + ax.z * s, o * ax.z * ax.x - ax.y * s, o * ax.x * ax.y - ax.z * s, o * ax.y * ax.y + c, o * ax.y * ax.z + ax.x * s, o * ax.z * ax.x + ax.y * s, o * ax.y * ax.z - ax.x * s, o * ax.z * ax.z + c); }
      void main() {
        float h = iB.x, range = max(iA.w, 1.), sp = iB.y, t = uTime;
        float s = mod(h * range + t * sp, range);
        vec3 ax = normalize(vec3(sin(h * 61.), 0.35 + 0.3 * cos(h * 17.), cos(h * 61.)));
        mat3 R = rotAxis(ax, t * (0.6 + 1.5 * fract(h * 7.3)) * (1. + iB.w) + h * 30.) ;
        vec3 p = R * (position * iB.z * smoothstep(0., 1., s) * smoothstep(0., 1., range - s));
        // a leaf side-slips as it falls, by its own slip (iC.w); a book drops straight (its slip is 0)
        float slip = iC.w;
        // a thing thrown from a shelf goes out fast and loses its way outward as it falls (out = 1 once it is clear)
        float fo = iC.z > 0.001 ? clamp(s / max(iC.z, 0.001), 0., 1.) : 1., outw = 1. - (1. - fo) * (1. - fo);
        vec2 at = mix(iC.xy, iA.xz, outw);
        vec3 c = vec3(at.x + slip * outw * sin(t * 0.6 + h * 50.), iA.y - s, at.y + slip * outw * cos(t * 0.47 + h * 23.));
        vec3 w = c + p; vWorld = w; vUv = uv; vN = R * normal; vB = iB;
        gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
      }`,fragmentShader:`
      uniform float uFogK, uGain; uniform vec3 uDepth, uHaze, uLampCol; varying vec2 vUv; varying vec3 vN; varying vec3 vWorld; varying vec4 vB;
      void main() {
        vec3 n = normalize(vN); float dist = length(vWorld - cameraPosition);
        float hatch = step(0.5, fract(vUv.y * 11.)) * step(0.12, vUv.x) * step(vUv.x, 0.88) * step(0.1, vUv.y) * step(vUv.y, 0.9);
        vec3 page = mix(vec3(0.86, 0.78, 0.6), vec3(0.42, 0.41, 0.39), hatch * 0.6);
        vec3 cover = mix(vec3(0.3, 0.13, 0.06), vec3(0.1, 0.2, 0.12), step(0.6, fract(vB.x * 13.)));
        // a book: leather on the broad faces, the cream of the leaves on the edges
        vec3 alb = mix(page, mix(vec3(0.7, 0.62, 0.45), cover, step(0.5, abs(n.z))), vB.w);
        float l = 0.34 + 0.66 * abs(n.y * 0.6 + n.x * 0.5);
        vec3 col = alb * l * uGain * (0.55 * uLampCol + 0.25);
        float f = 1. - exp(-dist * uFogK);
        col = mix(col, mix(uDepth, uHaze, smoothstep(50., 300., dist)), clamp(f, 0., 1.));
        gl_FragColor = vec4(col, 1.);
      }`}),h=new m.Group;let b=0;for(const l of[0,1]){const o=t.filter(s=>(s.book||0)===l),p=o.reduce((s,z)=>s+z.n,0);if(!p)continue;const f=l?new m.BoxGeometry(.85,.24,1.15):new m.PlaneGeometry(.8,1.05),r=new Float32Array(p*4),v=new Float32Array(p*4),y=new Float32Array(p*4);let w=0;for(const s of o)for(let z=0;z<s.n;z++,w++){u&&w%60===59&&await u();let A=s.x,M=s.z,F=s.y1,C=0,i=0,n=0,x=!1;if(s.place){const L=s.place(e);A=L.x,M=L.z,F=L.y1,C=L.ox,i=L.oz,n=L.sOut,x=!0}else if(s.spots)for(let L=0;L<12&&!x;L++){const S=s.spots[Math.floor(e()*s.spots.length)],B=e()*6.2832,q=Math.sqrt(e())*(k-.8);A=S[0]+q*Math.cos(B),M=S[1]+q*Math.sin(B),x=!s.keep||s.keep(A,M)}else for(let L=0;L<12&&!x;L++){const S=e()*6.2832,B=Math.sqrt(e())*s.spread;A=s.x+B*Math.cos(S),M=s.z+B*Math.sin(S),x=!s.keep||s.keep(A,M)}if(!x&&s.away){const L=s.away(A,M);A=L[0],M=L[1]}s.place||(C=A,i=M),r.set([A,F,M,F-s.y0],w*4),y.set([C,i,n,l?0:s.slip?s.slip(A,M):Fe],w*4),v.set([e(),l?3.4+2*e():1.5+1.6*e(),l?.9+.5*e():.8+.7*e(),l],w*4)}f.setAttribute("iA",new m.InstancedBufferAttribute(r,4)),f.setAttribute("iB",new m.InstancedBufferAttribute(v,4)),f.setAttribute("iC",new m.InstancedBufferAttribute(y,4));const g=new m.InstancedMesh(f,c,p);g.frustumCulled=!1,h.add(g),b+=p*(l?12:2)}return{object:h,uniforms:d,triangles:b}}function Ie(){const t=V(),e=W,a=(u,d,c,h,b,l)=>t.quad([u[0],c,u[1]],[d[0],c,d[1]],[d[0],h,d[1]],[u[0],h,u[1]],b,l);return a([e.half,e.w],[-e.half,e.w],0,G,0,[0,0,.4,1]),a([-e.half,-e.w],[-e.nicheX,-e.w],0,G,0,[0,0,.2,1]),a([e.nicheX,-e.w],[e.half,-e.w],0,G,0,[0,0,.2,1]),a([-e.nicheX,e.nicheZ],[e.nicheX,e.nicheZ],0,T,0,[0,0,.3,1]),a([-e.nicheX,-e.w],[-e.nicheX,e.nicheZ],0,T,0,[0,0,.3,1]),a([e.nicheX,e.nicheZ],[e.nicheX,-e.w],0,T,0,[0,0,.3,1]),t.quad([-e.half,G,-e.w],[e.half,G,-e.w],[e.half,G,e.w],[-e.half,G,e.w],3),t.quad([-e.nicheX,T,e.nicheZ],[e.nicheX,T,e.nicheZ],[e.nicheX,T,-e.w],[-e.nicheX,T,-e.w],8),a([-e.nicheX,-e.w],[e.nicheX,-e.w],G,T,8),t.ball(e.lamp[0],e.lamp[1],e.lamp[2],e.lampR,8,5,5),t.box([e.lamp[0],0,e.lamp[2]],[1,0,0],[0,1,0],[0,0,1],-.03,.03,e.lamp[1]+e.lampR-.03,T,-.03,.03,4,"tu"),t.build()}function Te(t,e){const a=W,u=new m.PlaneGeometry(2*a.mirrorX,a.mirrorY1-a.mirrorY0);u.rotateY(Math.PI),u.translate(0,(a.mirrorY0+a.mirrorY1)/2,a.w-.04);const d={uTime:{value:0},uLampCol:{value:e.lampCol},uAmb:{value:e.amb},uDepth:{value:e.depth}},c=new m.ShaderMaterial({uniforms:d,vertexShader:`
      varying vec3 vLocal; varying vec3 vCamL; varying vec2 vUv;
      void main() {
        vLocal = position; vUv = uv;
        vCamL = (inverse(instanceMatrix) * vec4(cameraPosition, 1.)).xyz;
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.);
      }`,fragmentShader:`
      uniform float uTime; uniform vec3 uLampCol, uAmb, uDepth; varying vec3 vLocal; varying vec3 vCamL; varying vec2 vUv;
      ${X}
      ${de}
      void main() {
        vec3 d = normalize(vLocal - vCamL); d.z = abs(d.z) + 1e-3;
        vec3 o = vLocal;
        // behind the glass a second passage runs beside ours: as wide and as high, shelves on its far wall, a lamp every 9 m
        float tf = d.y < 0. ? (0. - o.y) / min(d.y, -1e-4) : 1e5, tc = d.y > 0. ? (6.2 - o.y) / max(d.y, 1e-4) : 1e5;
        float tw = 3.6 / d.z;
        float t = min(min(tf, tc), min(tw, 120.));
        vec3 h = o + d * t; float gilt = 0.;
        vec3 wood = vec3(0.30, 0.165, 0.075);
        vec3 alb = wood * 0.9;
        if (t == tw) alb = bookWall(h.x + 40., h.y * 1.13, vec4(0.41, 0., 0., 3.), wood, smoothstep(8., 40., t), gilt);
        else if (t == tc) alb = vec3(0.42, 0.35, 0.25);
        // door posts of the galleries that open off it, every 9 m
        float post = step(abs(fract(h.x / 9.) - 0.5), 0.035) * step(tw - 0.01, t);
        alb = mix(alb, wood * 1.2, post);
        float lx = (floor(h.x / 9.) + 0.5) * 9.;
        vec3 dl = vec3(lx, 5.3, o.z + 1.8) - h; float l2 = dot(dl, dl);
        vec3 col = alb * (uAmb + uLampCol * 22. / (8. + l2));
        // the lamps themselves, as far as the ray runs, ahead and behind
        float k0 = floor(o.x / 9.);
        for (int i = -5; i < 6; i++) {
          vec3 L = vec3((k0 + float(i) + 0.5) * 9., 5.3, o.z + 1.8) - o; float tl = clamp(dot(L, d), 0., t); vec3 q = L - d * tl;
          col += uLampCol * (1.8 * exp(-dot(q, q) * 4.) + 0.2 * exp(-dot(q, q) * 0.45)) * exp(-tl * 0.03) * (1. + 0.05 * sin(uTime * 0.8 + float(i)));
        }
        col = mix(col, uDepth * 1.5, 1. - exp(-t * 0.02));
        // the silvering is old: a little dark, speckled at the rim; a narrow wooden frame
        vec2 e = min(vUv, 1. - vUv); float rim = min(e.x * ${(2*W.mirrorX).toFixed(1)}, e.y * ${(W.mirrorY1-W.mirrorY0).toFixed(1)});
        col *= 0.86 - 0.3 * smoothstep(0.5, 0.1, rim) * vnoise(vUv * 40.);
        col = mix(wood * (uAmb + uLampCol * 0.35), col, step(0.14, rim));
        gl_FragColor = vec4(col, 1.);
      }`}),h=new m.InstancedMesh(u,c,Math.max(1,t.length));h.count=t.length;const b=new m.Matrix4,l=new m.Quaternion,o=new m.Vector3(0,1,0),p=new m.Vector3(1,1,1);return t.forEach((f,r)=>{l.setFromAxisAngle(o,-f.rot*Math.PI/3),h.setMatrixAt(r,b.compose(new m.Vector3(f.x,f.y,f.z),l,p))}),h.instanceMatrix.needsUpdate=!0,h.frustumCulled=!1,{object:h,uniforms:d}}const J=5,ee=(t,e,a)=>{const u=a/J;return[t*Math.cos(u*Math.PI/2),e+.3*t*Math.sin(u*Math.PI/2)]};function Ge(t,e,a){for(let u=J;u>0;u--){const d=ee(t,e,u),c=ee(t,e,u-1);if(a<=c[0])return d[1]+(c[1]-d[1])*(a-d[0])/(c[0]-d[0])}return e}function Ue(t){const e=V(),a=t.radius,u=t.wallH,d=96,c=t.center.x,h=t.center.y,b=t.center.z,l=Math.max(6,Math.round(2*Math.PI*a/48.7)),o=(y,w,g)=>[c+y*Math.cos(w),h+g,b+y*Math.sin(w)],p=[.06,.25,.44,.63,.82,.96];for(let y=0;y<d;y++){const w=y/d*Math.PI*2,g=(y+1)/d*Math.PI*2,s=y/d,z=(y+1)/d;let A=0;for(const C of p){const i=C*u,n=.022*u;e.quad(o(a,w,A),o(a,g,A),o(a,g,i-n),o(a,w,i-n),6,[s,A/u,z,(i-n)/u]),e.quad(o(a,w,i-n),o(a,g,i-n),o(a-.9,g,i-n*.5),o(a-.9,w,i-n*.5),6,[s,2,z,2]),e.quad(o(a-.9,w,i-n*.5),o(a-.9,g,i-n*.5),o(a-.9,g,i+n*.5),o(a-.9,w,i+n*.5),6,[s,2,z,2]),e.quad(o(a-.9,w,i+n*.5),o(a-.9,g,i+n*.5),o(a,g,i+n),o(a,w,i+n),6,[s,2,z,2]),A=i+n}e.quad(o(a,w,A),o(a,g,A),o(a,g,u),o(a,w,u),6,[s,A/u,z,1]);const M=[.2,a*.2,a*.45,a*.72,a];for(let C=0;C<4;C++)e.quad(o(M[C],w,0),o(M[C],g,0),o(M[C+1],g,0),o(M[C+1],w,0),9);const F=C=>ee(a,u,C);for(let C=0;C<J;C++){const i=F(C),n=F(C+1);e.quad(o(i[0],w,i[1]),o(i[0],g,i[1]),o(n[0],g,n[1]),o(n[0],w,n[1]),3)}}const f={uTime:{value:0},uLamp:{value:t.lamp.clone()},uLampCol:{value:t.look.lampCol},uAmb:{value:t.look.amb},uDepth:{value:t.look.depth},uFogK:{value:t.look.fogK*.35},uWell:{value:new m.Vector2(t.well[0],t.well[1])},uCen:{value:t.center.clone()},uGain:{value:t.look.chamberGain}},r=new m.ShaderMaterial({uniforms:f,vertexShader:`
      attribute float aMat; varying vec3 vWorld; varying vec3 vN; varying vec2 vUv; varying float vMat;
      void main() { vWorld = position; vN = normal; vUv = uv; vMat = aMat; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.); }`,fragmentShader:`
      uniform float uTime, uFogK, uGain; uniform vec3 uLamp, uLampCol, uAmb, uDepth, uCen; uniform vec2 uWell;
      varying vec3 vWorld; varying vec3 vN; varying vec2 vUv; varying float vMat;
      ${X}
      void main() {
        float mat = floor(vMat + 0.5); vec3 n = normalize(vN); vec3 alb; float gold = 0.;
        vec2 rel = vWorld.xz - uCen.xz; float rad = length(rel), ang = atan(rel.y, rel.x + 1e-5);
        if (mat == 9.) {
          // the well: the seven cells of the shaft's cluster
          vec2 w = vWorld.xz - uWell; float r = w.y / ${(k*E).toFixed(4)}, q = w.x / ${(2*k).toFixed(1)} - r * 0.5;
          float x = q, z = r, y = -q - r, rx = floor(x + 0.5), ry = floor(y + 0.5), rz = floor(z + 0.5);
          float dx = abs(rx - x), dy = abs(ry - y), dz = abs(rz - z);
          if (dx > dy && dx > dz) rx = -ry - rz; else if (dy > dz) ry = -rx - rz; else rz = -rx - ry;
          if (max(abs(rx), max(abs(ry), abs(rz))) < 1.5) discard;
          float ringf = fract(rad / 6.5), spoke = fract(ang * 5.0930 + floor(rad / 6.5) * 0.5);
          float pl = h21(vec2(floor(rad / 6.5), floor(ang * 5.0930 + floor(rad / 6.5) * 0.5)));
          alb = mix(vec3(0.27, 0.15, 0.07), vec3(0.42, 0.30, 0.16), pl) * (0.8 + 0.4 * vnoise(vWorld.xz * 1.3));
          alb *= 1. - 0.45 * clamp(step(ringf, 0.03) + step(spoke, 0.012), 0., 1.);
          gold = step(abs(ringf - 0.5), 0.02) * step(0.5, fract(rad / 13.)) * 0.6;
        } else if (mat == 6.) {
          // leather: the grain, the hollows either side of each raised band, tooled panels with gilt rules and lozenges
          // (up: the panels' own coordinate, one to a panel; four gilt dots and four studs to a panel)
          float band = step(1.5, vUv.y), v = vUv.y, u = vUv.x * 96., up = vUv.x * ${l.toFixed(1)};
          float lea = 0.75 + 0.5 * vnoise(vec2(u * 3.1, vWorld.y * 1.7)) * vnoise(vec2(u * 0.4, vWorld.y * 0.21) + 7.);
          alb = vec3(0.42, 0.16, 0.075) * lea;
          vec2 pc = vec2(fract(up) - 0.5, fract(v * 5.26 - 0.1) - 0.5);
          float frame = step(abs(max(abs(pc.x) * 1.0, abs(pc.y) * 1.0) - 0.40), 0.012) + step(abs(max(abs(pc.x), abs(pc.y)) - 0.36), 0.005);
          float loz = step(abs(abs(pc.x) * 1.6 + abs(pc.y) * 1.2 - 0.3), 0.012) + step(abs(pc.x) * 1.6 + abs(pc.y) * 1.2, 0.07);
          float dots = step(length(vec2(fract(up * 4.) - 0.5, (fract(v * 5.26 - 0.1) - 0.93) * 6.)), 0.16);
          gold = (1. - band) * clamp(frame + loz + dots, 0., 1.) * (0.45 + 0.55 * vnoise(vec2(u * 2., vWorld.y * 0.9)));
          alb = mix(alb, vec3(0.5, 0.2, 0.09) * lea, band);
          gold += band * step(abs(fract(up * 4.) - 0.5), 0.06) * 0.5;
        } else {
          // the dome: dark coffers between gilt ribs, a small gilt boss in each
          vec2 cf = vec2(fract(ang * 3.8197), fract(rad / 9.)) - 0.5; float edge = max(abs(cf.x), abs(cf.y));
          float rib = step(0.455, edge);
          alb = vec3(0.20, 0.115, 0.06) * (0.45 + 1.1 * smoothstep(0.1, 0.455, edge));
          alb = mix(alb, vec3(0.42, 0.27, 0.11), rib);
          gold = rib * 0.35 + step(length(cf * vec2(1., 0.6)), 0.05) * 0.8;
        }
        vec3 dl = uLamp - vWorld; float d2 = dot(dl, dl), ndl = clamp(dot(n, dl) / sqrt(max(d2, 1e-4)), 0., 1.);
        float breathe = 1. + 0.04 * sin(uTime * 0.7);
        vec3 lit = uAmb * 1.2 + uLampCol * uGain * breathe * (0.25 + 0.75 * ndl) * (0.30 + 600. / (400. + d2));
        // held under white to the last metre: over 0.9 the light is pressed in toward 1.5 at the most (its colour kept),
        // so the floor, the ribs and the leather next to the great lamp keep their colour and their shade
        float lmax = max(lit.r, max(lit.g, lit.b)), knee = lmax < 0.9 ? lmax : 0.9 + (lmax - 0.9) / (1. + (lmax - 0.9) * 1.6);
        lit *= knee / max(lmax, 1e-3);
        vec3 col = alb * lit + vec3(1., 0.7, 0.28) * gold * lit * 0.6;
        float dist = length(vWorld - cameraPosition);
        col = mix(col, uDepth, clamp(1. - exp(-dist * uFogK), 0., 1.));
        gl_FragColor = vec4(col, 1.);
      }`});return{object:new m.Mesh(e.build(),r),uniforms:f,triangles:e.triangles}}function Be(t="day"){const e={lampCol:new m.Color(1,.78,.44),crimCol:new m.Color(1,.33,.15),amb:new m.Color(.2,.15,.105),depth:new m.Color(.055,.05,.085),haze:new m.Color(.07,.13,.215),fogK:.0085,gutter:0,globe:5.5,halo:1,pageGain:1,handLamp:0,chamberGain:1.6,out:.04};return t==="golden"&&(e.lampCol=new m.Color(1,.62,.3),e.gutter=1,e.amb=new m.Color(.21,.135,.09),e.out=.1),t==="night"&&(e.amb=new m.Color(.13,.125,.15),e.out=.6,e.handLamp=1,e.depth=new m.Color(.035,.035,.065),e.pageGain=.8),e}async function qe(t,e={}){const a=t.core.makeRng(t.core.hashSeed("shaft-hero:"+t.seed)),u=e.look||Be("day"),d=Me(u),c={edge:[0,1,2].map(g=>he("edge",g)),corner:[0,1,2].map(g=>he("corner",g))},h=[],b=[],l=[];for(let g=-2;g<=2;g++)for(let s=-2;s<=2;s++){if(ce(g,s)!==2)continue;const z=xe(g,s),[A,M]=se(g,s);for(let F=-5;F<=5;F++){const C={x:A,y:F*T,z:M,rot:z.rot,kind:z.corner?"corner":"edge",make:Math.abs(F)<=1?1:2,seed:[a(),0,0,3],chunk:0};h.push(C);for(const i of P){const n=fe(C,i[0],i[1],i[2]);b.push({x:n.x,y:n.y,z:n.z,on:1,hash:C.seed[0],rod:1})}if(a()<.3){const i=fe(C,k-1.3,0,0);l.push({pose:a()<.5?"lean":"read",x:i.x,y:i.y,z:i.z,yaw:z.rot*Math.PI/3,cell:C,robe:[.3,.26,.2],hash:a(),lamps:3})}}await t.yield()}const o=new m.Group,p=await Ae(h,d,c,()=>t.yield()),f=Ce(b,u),r=Le(l,[],u),v=[[0,0]];for(const g of Q)v.push(se(g[0],g[1]));const y=await Se([{x:0,z:0,y0:-44,y1:48,n:260,spots:v}],a,u);o.add(p.object,f.object,r.object,y.object);const w=new m.Vector2;return{object:o,radius:46,height:48,center:new m.Vector3(0,4,0),anchors:{},ground:!1,update(g,s){d.uniforms.uTime.value=s,f.uniforms.uTime.value=s,r.uniforms.uTime.value=s,y.uniforms.uTime.value=s,t.renderer&&(t.renderer.getDrawingBufferSize(w),f.uniforms.uPx.value=w.y*.8)},dispose(){}}}const $e=2.06+.25;function Re(t,e,a=4){const u=t.length*a,d=new Float32Array(u*3),c=new Float32Array(u*4);t.forEach((p,f)=>{for(let r=0;r<a;r++){const v=f*a+r;d.set([p.x,p.y,p.z],v*3),c.set([e(),(.75+.9*e())*(p.s===void 0?1:p.s),(e()<.5?-1:1)*(1.1+1.6*e()),e()*6.2832],v*4)}});const h=new m.BufferGeometry;h.setAttribute("position",new m.BufferAttribute(d,3)),h.setAttribute("aDat",new m.BufferAttribute(c,4)),h.boundingSphere=new m.Sphere(new m.Vector3,1e5);const b={uTime:{value:0},uPx:{value:500}},l=new m.ShaderMaterial({uniforms:b,transparent:!0,depthWrite:!1,vertexShader:`
      attribute vec4 aDat; uniform float uTime, uPx; varying float vA;
      void main() {
        float a = aDat.w + uTime * aDat.z, r = aDat.y * (1. + 0.25 * sin(uTime * 1.3 + aDat.x * 40.)), tilt = (aDat.x - 0.5) * 1.6;
        vec3 p = position + vec3(cos(a) * r, sin(a) * r * sin(tilt) + 0.25 * sin(uTime * 2.1 + aDat.x * 20.), sin(a) * r * cos(tilt));
        vec4 mv = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mv;
        float d = max(-mv.z, 0.1), px = 0.36 * uPx / d;
        gl_PointSize = clamp(px, 1.5, 22.);
        // the wings beat: the fleck brightens and dims many times a second
        vA = (0.55 + 0.45 * sin(uTime * 23. + aDat.x * 90.)) * clamp(px / 1.5, 0., 1.) * smoothstep(90., 40., d);
      }`,fragmentShader:`
      varying float vA;
      void main() { vec2 c = gl_PointCoord - 0.5; float a = clamp(1. - dot(c, c) * 4., 0., 1.); gl_FragColor = vec4(vec3(0.95, 0.82, 0.6) * 0.9, a * a * vA * 0.9); }`}),o=new m.Points(h,l);return o.frustumCulled=!1,o.renderOrder=4,{object:o,uniforms:b,count:u}}export{k as AP,D as CLEAR,Q as DIRS,G as DOOR_H,U as DOOR_W,ke as EYE,De as FIG_H,j as HR,P as LAMPS,ve as LAMP_R,$e as MOTH_REACH,Fe as PAGE_SLIP,T as PITCH,R as RAILH,ge as SHELF_Y,E as SQ3,ue as SWING,W as VEST,I as WALL,N as WR,qe as buildHero,he as cellGeometry,fe as cellToWorld,se as cellXZ,ee as domeRing,Ge as domeY,me as figureGeometry,xe as galleryInfo,ce as hexDist,Ae as makeCells,Ue as makeChamber,V as makeGB,Ce as makeHalos,Le as makeLibrarians,Me as makeLibraryMaterial,Be as makeLook,Te as makeMirrors,Re as makeMoths,Se as makePages,pe as shaftOf,Pe as stairGeometry,Ie as vestibuleGeometry};
