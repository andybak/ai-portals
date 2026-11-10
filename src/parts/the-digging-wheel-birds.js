import*as A from"three";import{Geo as E,GLSL_COMMON as L,GLSL_CLOCK as W,GLSL_MOTION_DEFAULT as I,GLSL_SHADE as P}from"./the-digging-wheel.js";const R=1.35,$=.72,M=.045,B=.31,z=.675,b=[[80.07,47.01,.23,15.66,12.63,-.086,.013,5.465,5.62,2.749,9,.015,5.9,.01,2.33],[79.89,47.98,.45,16.44,13.07,-.005,.012,4.287,4.74,2.573,9,.39,4.45,.571,1.48],[82.52,47.88,0,15.8,12.59,.046,.022,3.337,4.83,3.061,9,.601,4.75,.109,1.22],[79.27,47.89,.43,14.99,12.51,.066,.024,4.623,4.18,2.537,9,.778,4.4,.893,1.49],[80.12,38.24,12.77,15.25,4.22,-.097,.02,.647,3.02,1.508,8,.125,4.97,.159,3.91],[78.68,38.37,12.71,14.85,4.39,-.012,.024,5.282,3.67,1.437,8,.273,3.3,.49,2.88],[79.72,38.33,12.71,14.74,4.2,.086,.034,4.455,3.33,1.527,8,.358,4.44,.057,3.95],[82.56,38.25,12.78,14.96,4.23,.096,.022,1.967,3.28,1.841,8,.541,5.64,.094,4.84],[81.02,38.33,12.71,14.36,4.26,.081,.021,1.227,3.34,1.685,8,.673,5.68,.619,4.32],[80.02,38.28,12.56,14.95,4.45,.049,.045,5.979,3.58,1.45,8,.776,4.39,.165,3.5],[81.33,38.15,12.78,14.75,4.21,.067,.027,5.074,2.99,1.461,8,.916,5.38,.189,4.84],[77.98,42.25,14.52,14.98,5.21,.078,.031,5.866,3.72,1.573,-8,.158,4.08,.746,3.61],[82.2,42.6,13.45,15.09,5.28,-.054,.036,2.925,3.17,1.425,-8,.318,3.26,.516,2.86],[81.19,42.07,13.69,14.82,4.72,.035,.029,5.291,3.76,1.411,-8,.437,5.61,.329,3.95],[79.49,41.61,14.42,14.22,4.65,-.098,.021,6.157,3.15,1.513,-8,.507,3.72,.714,3.28],[82.14,42.16,13.96,14.97,4.62,-.053,.027,3.59,3.07,1.362,-8,.715,4.43,.357,3.8],[82.34,42.55,14.04,14.48,4.51,.086,.037,2.264,3.34,1.558,-8,.971,4.4,.775,3.69],[62.4,43.57,15.66,11.39,10.6,.651,.03,4.282,2.9,.895,-7.2,.076,5.81,.269,1.74],[63.9,44.02,14.5,10.33,11.24,2.757,.029,1.52,2.54,3.237,-8,.324,4.69,.797,2.15],[63,43.46,13.89,11.27,10.72,.028,.017,5.549,2.99,2.644,-7.2,.458,3.65,.223,.97],[63.82,44.77,15.96,10.88,9.96,2.344,.013,4.961,1.58,5.408,-7.2,.666,5.99,.235,1.56],[62.56,45.06,14.06,11.6,9.91,.441,.016,5.335,2.44,2.279,-7.2,.808,5.34,.947,1.36],[69.16,45.12,15.55,10.59,10.29,2.57,.033,3.782,1.77,3.739,-7.2,.857,3.91,.222,1.84],[100.95,53.51,10.3,12.08,11.28,.553,.033,.134,3.02,4.639,-7.2,.025,4.62,.982,2.08],[93.48,51.49,8.47,11.99,11.1,.123,.022,.008,3.47,4.659,-7.2,.171,3.31,.669,1.17],[92.77,51.26,6.82,11.1,10.55,1.321,.015,4.169,2.3,.987,7.2,.269,3.23,.526,1.55],[98.84,53.5,11.7,11.18,11.01,1.094,.036,.793,2.28,5.097,-7.2,.432,4.28,.159,1.19],[97.98,51.68,6.83,12.42,10.11,.065,.036,4.486,2.79,2.371,-7.2,.468,5.43,.803,2.58],[96.75,47.23,9.55,11.82,9.92,1.93,.019,.066,2.94,1.633,7.2,.585,5.87,.263,2.26],[100.96,52.51,9.18,10.38,9.89,.268,.015,3.703,2.36,3.277,-7.2,.739,4.73,.588,1.55],[98.88,50.45,5.23,10.92,11.15,.785,.021,.503,1.63,3.829,-7.2,.876,4.92,.406,2.4],[95.79,50.9,9.39,11.81,9.88,2.46,.016,6.105,1.65,4.682,7.2,.943,4.12,.916,1.86]],F=2*Math.PI;function T(e,h){const[s,r,n,i,f,d,c,o,t,a,l,u]=e,x=Math.sign(l),p=h/Math.abs(l)+u,v=F*(p-Math.floor(p))*x,g=i*(Math.cos(v)+c*Math.cos(2*v+o)),w=f*(Math.sin(v)+c*Math.sin(2*v+o)),y=Math.cos(d),k=Math.sin(d);return[s+y*g-k*w,r+t*(Math.sin(v+a)+.25*Math.sin(2*v+2.3*a+1)),n+k*g+y*w]}function N(e){const h=Math.abs(e[10]);let s=0,r=T(e,0);for(let n=1;n<=720;n++){const i=T(e,h*n/720);s+=Math.hypot(i[0]-r[0],i[1]-r[1],i[2]-r[2]),r=i}return s}const m=[.62,.62,.6],S=[.3,.325,.36],q=[.035,.035,.04],C=[.78,.5,.06];function U(e){const h=(t,a,l,u)=>[[t,a+l,0],[t,a,u],[t,a-l,0],[t,a,-u]],s=h(.21,.01,.042,.04),r=h(.07,0,.06,.056),n=h(-.17,.006,.036,.04),i=[.262,.004,0];e.mark=[e.mark[0],e.mark[1],e.mark[2],0];for(let t=0;t<4;t++){const a=(t+1)%4,l=t===0||t===3;e.tri(i,s[t],s[a],m),e.quad(s[t],r[t],r[a],s[a],m),e.quad(r[t],n[t],n[a],r[a],l?S:m)}const f=[[.238,.018,0],[.238,-.008,.013],[.238,-.008,-.013]],d=[.315,-.004,0];for(let t=0;t<3;t++)e.tri(d,f[t],f[(t+1)%3],C);const c=[-.305,.004,-.068],o=[-.305,.004,.068];for(const t of[0,2])e.tri(n[t],n[1],o,m),e.tri(n[t],o,c,m),e.tri(n[t],c,n[3],m);e.mark=[e.mark[0],e.mark[1],e.mark[2],1];for(const t of[-1,1]){const a=(y,k)=>[y,.015,t*k],l=a(.13,M),u=a(-.06,M),x=a(.165,B),p=a(-.005,B),v=a(.085,.5),g=a(-.055,.49),w=a(-.125,z);e.quad(l,x,p,u,S),e.quad(x,v,g,p,S),e.tri(v,w,g,q)}}const H=`${W}
  ${I}
  attribute vec3 color; attribute vec4 mark; attribute vec4 aux; attribute vec4 bA; attribute vec4 bB;
  uniform float uBirdPx;                                      // half the picture's height, pixels
  varying vec3 vW, vC, vUp; varying float vWing, vEase;
  void main(){
    // THE LOOP: where the bird's middle is now, how fast it goes and how it is pulled (the law and its two derivatives)
    float P = abs(bA.w), sg = sign(bA.w), w = 6.2831853 / P * sg, a = 6.2831853 * fract(uT / P + bB.x) * sg;
    float A = aux.x, B = aux.y, e = aux.w, q = bA.x, H = bA.y, qh = bA.z;
    float c1 = cos(a), s1 = sin(a), c2 = cos(2. * a + q), s2 = sin(2. * a + q), cr = cos(aux.z), sr = sin(aux.z);
    vec2 o = vec2(A * (c1 + e * c2), B * (s1 + e * s2));
    vec2 d1 = vec2(-A * (s1 + 2. * e * s2), B * (c1 + 2. * e * c2)) * w;
    vec2 d2 = vec2(-A * (c1 + 4. * e * c2), -B * (s1 + 4. * e * s2)) * w * w;
    o = vec2(cr * o.x - sr * o.y, sr * o.x + cr * o.y); d1 = vec2(cr * d1.x - sr * d1.y, sr * d1.x + cr * d1.y); d2 = vec2(cr * d2.x - sr * d2.y, sr * d2.x + cr * d2.y);
    float hy = 2. * a + 2.3 * qh + 1.;
    vec3 c = vec3(mark.x + o.x, mark.y + H * (sin(a + qh) + 0.25 * sin(hy)), mark.z + o.y);
    float vy = H * (cos(a + qh) + 0.5 * cos(hy)) * w, vh = max(length(d1), 1e-3); vec2 fh = d1 / vh;
    // ITS FRAME: ahead along its way (nosing up and down with its climb), banked into the turn by the turn's own pull
    float gam = clamp(atan(vy, vh), -0.45, 0.45);
    vec3 F = vec3(fh.x * cos(gam), sin(gam), fh.y * cos(gam)), R0 = vec3(-fh.y, 0., fh.x), U0 = cross(R0, F);
    float bank = clamp(0.9 * atan(dot(d2, vec2(-fh.y, fh.x)) / 9.81), -1.05, 1.05);
    vec3 U = cos(bank) * U0 + sin(bank) * R0, R = cos(bank) * R0 - sin(bank) * U0;
    // ITS SIZE: its own (0.965 to 1.035). HOW SOLID: nothing where its span would be under 9 pixels' footprints (there it
    // is drawn to a point: no fragment at all), whole from 13, evenly between (the fragment's alpha: it is never shrunk)
    float size = 0.965 + 0.07 * fract(bB.x * 37.71 + 0.13);
    vec4 cc = projectionMatrix * viewMatrix * vec4(c, 1.);
    float foot = max(cc.w, 1e-3) / (projectionMatrix[1][1] * uBirdPx);
    vEase = smoothstep(9., 13., ${R.toFixed(3)} * size / foot);
    float k = vEase > 0. ? size : 0.;
    // ITS WINGS: a few beats, then a glide
    vec3 p = position;
    if (mark.w > 0.5) {
      float Tc = bB.y, D = bB.w, sc = fract(uT / Tc + bB.z) * Tc, fb = floor(D * 3.1 + 0.5) / D, hb = 0.5 / fb;
      float env = smoothstep(0., hb, sc) * (1. - smoothstep(D - hb, D, sc)), psi = 6.2831853 * fb * sc;
      float t1 = mix(0.20, 0.08 + 0.60 * sin(psi), env), t2 = mix(-0.17, t1 + 0.50 * sin(psi - 1.05), env);
      float sa = abs(p.z), e1 = min(sa, ${B.toFixed(3)}) - ${M.toFixed(3)}, e2 = max(sa - ${B.toFixed(3)}, 0.);
      p.y += sin(t1) * e1 + sin(t2) * e2; p.z = sign(p.z) * (${M.toFixed(3)} + cos(t1) * e1 + cos(t2) * e2);
    }
    vW = c + (F * p.x + U * p.y + R * p.z) * k; vC = color; vUp = U; vWing = mark.w;
    gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.);
  }`,O=`${L}${P}
  varying vec3 vW, vC, vUp; varying float vWing, vEase;
  void main(){
    vec3 n = faceNormal(vW), col = vC; float through = 0.;
    if (vWing > 0.5) { through = 0.4;                         // a wing: one sheet, grey above; below a soft pale grey, 0.68 to 0.70: paler than the mantle and, as typed, a little paler than the body's WHITE, 0.62 (its tip dark on both sides)
      if (dot(n, vUp) < 0.) col = dot(vC, vec3(1.)) < 0.3 ? vec3(0.08, 0.08, 0.085) : vec3(0.68, 0.69, 0.70); }
    float sun = dot(n, uSun), cut = shadeOnce(vW);
    vec3 light = SUNC * (max(sun, 0.) + through * max(-sun, 0.)) * (1. - cut) + 1.3 * skyAmb(n)
      + vec3(0.30, 0.285, 0.25) * max(-n.y, 0.) * (1. - 0.6 * cut);         // (what the lit earth and the grain throw back up)
    gl_FragColor = vec4(haze(col * light, vW), vEase);         // (whole from 13 pixels of span; easing in from 9: see the head)
  }`;async function _(e,h){const s=new E(b.length*117);for(const o of b)s.mark=[o[0],o[1],o[2],0],s.aux=[o[3],o[4],o[5],o[6]],U(s);e&&e.yield&&await e.yield();const r=s.n/b.length,n=new Float32Array(s.n*4),i=new Float32Array(s.n*4);b.forEach((o,t)=>{for(let a=t*r;a<(t+1)*r;a++)n.set([o[7],o[8],o[9],o[10]],a*4),i.set([o[11],o[12],o[13],o[14]],a*4)});const f={value:181.5},d=new A.ShaderMaterial({side:A.DoubleSide,transparent:!0,forceSinglePass:!0,uniforms:{...h,uBirdPx:f},vertexShader:H,fragmentShader:O}),c=s.mesh(h,{material:d});return c.renderOrder=-1,c.geometry.setAttribute("bA",new A.BufferAttribute(n,4)),c.geometry.setAttribute("bB",new A.BufferAttribute(i,4)),c.onBeforeRender=o=>{const t=o.getRenderTarget();f.value=.5*(t?t.height:o.domElement.height)},{mesh:c,triangles:s.triangles,birds:b.length}}export{b as BIRDS,$ as REACH,R as SPAN,T as birdAt,N as birdLoop,_ as buildBirds};
