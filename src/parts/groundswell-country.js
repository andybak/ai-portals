import*as t from"three";import{clamp as ce,lerp as O,smoothstep as $}from"../kit/core.js";import{makeRng as xt}from"../kit/core.js";const ct=["#5FA052","#2F6B45","#C9DC7A","#F5F3EA","#7C8791","#8FC7E8","#D9609A"],q=Math.PI*2,X={x:-80,y:96,z:50},ye=Math.atan2(X.x,X.z),et=Math.hypot(X.x,X.z);function yt(e){const s=[{L:600,A:33,c:20,ang:0},{L:370,A:5,c:16,ang:22*Math.PI/180},{L:210,A:2,c:12,ang:-31*Math.PI/180}].map(d=>({k:q/d.L,A:d.A,c:d.c,dx:Math.sin(d.ang),dz:-Math.cos(d.ang),ph:e.range(0,q)}));return s[0].ph=s[0].k*420,(d,T,w)=>{let S=0;for(let x=0;x<3;x++){const b=s[x],y=b.k*(b.dx*d+b.dz*T-b.c*w)+b.ph,V=Math.cos(y);S+=b.A*(V+.22*(V*V-.5)*2*.5)}const k=Math.hypot(d,T),L=$(-.2,.5,T/Math.max(k,1)),g=1-$(200,330,k),C=(1-L)*(1-$(180,620,k));return S*(1+.35*g*L)*(1-.6*C)}}function ft(e){if(e<0)return 170-e*.32;if(e<110){const d=e/110;return 95+75*Math.pow(1-d,2.6)}if(e<165){const d=(e-110)/55;return 95+13*Math.sin(d*Math.PI*.5)}const s=ce((e-165)/70,0,1);return 108-50*s*s}function Mt(e,s){const d=[],T=(o,h,u,B,z,f)=>{let a=u,v=e.range(0,q);for(;a<B;){const F=Math.min(B-a,e.range(15,46)),l=ft(a+F*.5),n=h*l+e.range(-5,5),i=o+e.range(-.06,.06);v+=e.range(-.1,.1);const r=z*l*e.range(.88,1.1);d.push({y0:a-1,y1:a+F,cx:Math.sin(i)*n,cz:Math.cos(i)*n,hx:r*e.range(.9,1.1)*f,hz:r*e.range(.9,1.1)/f,c:Math.cos(v),s:Math.sin(v),bev:e.range(1.2,3.2)}),a+=F}};T(0,0,-75,e.range(196,214),.64,1);const w=e.int(7,10),S=e.range(0,q);for(let o=0;o<w;o++){const h=S+(o+e.range(-.3,.3))/w*q;T(h,e.range(.42,.56),-75,e.range(120,236),e.range(.36,.5),e.range(.8,1.25))}const k=e.int(3,4),L=e.range(0,q);for(let o=0;o<k;o++){const h=L+o/k*q+e.range(-.4,.4),u=o===0?14:e.range(26,46);let B=185,z=o===0?280:e.range(226,262),f=e.range(0,q),a=o===0?30:e.range(17,25);for(;B<z;){const v=Math.min(z-B,e.range(9,20));f+=e.range(-.3,.3),d.push({y0:B-1,y1:B+v,cx:Math.sin(h)*u+e.range(-3,3),cz:Math.cos(h)*u+e.range(-3,3),hx:a*e.range(.85,1.1),hz:a*e.range(.85,1.1),c:Math.cos(f),s:Math.sin(f),bev:e.range(1,2.5)}),B+=v,a*=e.range(.8,.97)}}const g=[];for(let o=0;o<24;o++)g.push(((o+.5+e.range(-.3,.3))/24-.5)*(200*Math.PI/180));const C=[];for(let o=-70;o<290;)C.push(o),o+=e.range(6,15);const x=[];for(let o=0;o<C.length;o+=2)x.push(C[o]);let b=NaN,y=[];const V=(o,h)=>{const u=Math.sin(o),B=Math.cos(o);let z=0;h!==b&&(b=h,y=d.filter(f=>h>=f.y0&&h<=f.y1));for(let f=0;f<y.length;f++){const a=y[f],v=-(a.cx*a.c+a.cz*a.s),F=-(-a.cx*a.s+a.cz*a.c),l=u*a.c+B*a.s,n=-u*a.s+B*a.c;let i=-1e9,r=1e9;if(Math.abs(l)>1e-6){const c=(-a.hx-v)/l,A=(a.hx-v)/l;i=Math.max(i,Math.min(c,A)),r=Math.min(r,Math.max(c,A))}else if(Math.abs(v)>a.hx)continue;if(Math.abs(n)>1e-6){const c=(-a.hz-F)/n,A=(a.hz-F)/n;i=Math.max(i,Math.min(c,A)),r=Math.min(r,Math.max(c,A))}else if(Math.abs(F)>a.hz)continue;if(r<=Math.max(i,0))continue;const p=r-Math.max(0,a.bev-(a.y1-h))*1.1;p>z&&(z=p)}return z};return{surfR:(o,h)=>{let u=V(o,h);if(u<=.5)return .02;const B=Math.sin(o)*u,z=Math.cos(o)*u,f=20*s.n2(Math.sin(o)*2.2+3,Math.cos(o)*2.2)+9*s.n2(o*7,5),a=$(-45,-30,h)*(1-$(44+f,60+f,h)),v=(1-$(36+f,56+f,h))*.66;if(v>0){const r=h+s.n2(o*2.3+11,h*.03)*5;let p=-80,c=300;for(let R=0;R<x.length;R++)if(x[R]<=r)p=x[R];else{c=x[R];break}const A=ce((r-p)/Math.max(c-p,1),0,1),m=p+(c-p)*(.5+.5*Math.pow(A,2.6))+(h-r),G=.3+.7*$(-.35,.3,s.n2(o*4.1+2,(p+c)*.021));u=O(u,ft(O(h,m,.85*G))*(.97+.13*s.n2(Math.sin(o)*1.3+5,Math.cos(o)*1.3)),v)}u+=s.fbm3(B*.012,h*.02,z*.012,4)*9*(1-.6*a),u+=s.fbm3(B*.06+9,h*.11,z*.06,3)*2.2*(1-.75*a);const F=h+s.n2(o*3,h*.04)*2;let l=1e9;for(let r=0;r<C.length;r++){const p=Math.abs(F-C[r]);p<l&&(l=p)}if(u-=1.6*(1-$(0,1.3,l))*(1-.5*a),h<72){let r=0;const p=((o+Math.PI)%q+q)%q-Math.PI;for(let c=0;c<24;c++){const A=Math.abs(p-g[c])*u;A<10&&(r=Math.max(r,1-A/10))}u-=2.6*r*r*(3-2*r)*(1-$(55,72,h))}let n=o-ye;n=Math.atan2(Math.sin(n),Math.cos(n));const i=1-$(.15,.36,Math.abs(n));if(i>0){const r=$(X.y-17,X.y-5,h),p=et+15+(X.y-5-h)*.5+5*s.n2(n*11+2,h*.07)-10*r*r+3*s.n2(n*31,h*.21),c=et-21-5*Math.cos(n*7)-$(X.y,X.y+30,h)*4+$(X.y+34,X.y+62,h)*30,A=h<X.y-5?Math.max(u,p):Math.min(u,c);u=O(u,A,i)}return Math.max(u,.02)},gullies:g,boxes:d}}const Ue=`
float gsH3(vec3 p){ p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3)); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float gsVn(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(gsH3(i), gsH3(i + vec3(1,0,0)), f.x), mix(gsH3(i + vec3(0,1,0)), gsH3(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(gsH3(i + vec3(0,0,1)), gsH3(i + vec3(1,0,1)), f.x), mix(gsH3(i + vec3(0,1,1)), gsH3(i + vec3(1,1,1)), f.x), f.y), f.z); }
float gsFb(vec3 p){ return gsVn(p) * 0.5 + gsVn(p * 2.03) * 0.25 + gsVn(p * 4.1) * 0.125 + gsVn(p * 8.3) * 0.0625; }
`,D=192,ve=102,Ae=-72,He=286;async function bt(e,s,d,T,w,S){const k=(n,i)=>{const r=(n/q%1+1)%1*D,p=ce((i-Ae)/(He-Ae),0,1)*(ve-1),c=Math.floor(r)%D,A=(c+1)%D,m=Math.min(ve-2,Math.floor(p)),G=r-Math.floor(r),R=p-m;return O(O(T[m*D+c],T[m*D+A],G),O(T[(m+1)*D+c],T[(m+1)*D+A],G),R)},x=new Float32Array(D*56);for(let n=0;n<D;n++){let i=0;for(let r=55;r>=0;r--){const p=-66+166*r/55;i=Math.max(i,k(n/D*q,p)),x[r*D+n]=i}}const b=(n,i)=>{const r=(n/q%1+1)%1*D,p=ce((i- -66)/166,0,1)*55,c=Math.floor(r)%D,A=(c+1)%D,m=Math.min(54,Math.floor(p)),G=r-Math.floor(r),R=p-m;return O(O(x[m*D+c],x[m*D+A],G),O(x[(m+1)*D+c],x[(m+1)*D+A],G),R)},y=new Float32Array((D+1)*ve*3),V=new Float32Array((D+1)*ve*3);for(let n=0;n<ve;n++){const i=Ae+(He-Ae)*n/(ve-1);for(let r=0;r<=D;r++){const p=r%D,c=p/D*q,A=T[n*D+p],m=(n*(D+1)+r)*3;y[m]=Math.sin(c)*A,y[m+1]=i,y[m+2]=Math.cos(c)*A;let G=0,R=0;for(let I=-3;I<=3;I+=3)for(let Y=-4;Y<=4;Y+=4){const j=ce(n+I,0,ve-1);G+=T[j*D+(p+Y+D)%D],R++}const J=ce(.92+(A-G/R)/15,.55,1.06);V[m]=V[m+1]=V[m+2]=J}}await w?.();const W=new Uint32Array(D*(ve-1)*6);let o=0;for(let n=0;n<ve-1;n++)for(let i=0;i<D;i++){const r=n*(D+1)+i,p=r+1,c=r+D+1,A=c+1;W[o++]=r,W[o++]=p,W[o++]=c,W[o++]=p,W[o++]=A,W[o++]=c}const h=new t.BufferGeometry;h.setAttribute("position",new t.BufferAttribute(y,3)),h.setAttribute("color",new t.BufferAttribute(V,3)),h.setIndex(new t.BufferAttribute(W,1)),await w?.();const u=new Float32Array(y.length),B=(n,i,r)=>{const p=y[n*3],c=y[n*3+1],A=y[n*3+2],m=y[r*3]-y[i*3],G=y[r*3+1]-y[i*3+1],R=y[r*3+2]-y[i*3+2],J=p-y[i*3],I=c-y[i*3+1],Y=A-y[i*3+2],j=G*Y-R*I,P=R*J-m*Y,H=m*I-G*J;u[n*3]+=j,u[n*3+1]+=P,u[n*3+2]+=H,u[i*3]+=j,u[i*3+1]+=P,u[i*3+2]+=H,u[r*3]+=j,u[r*3+1]+=P,u[r*3+2]+=H};for(let n=0;n<ve-1;n++){for(let i=0;i<D;i++){const r=n*(D+1)+i,p=r+1,c=r+D+1,A=c+1;B(r,p,c),B(p,A,c)}n%16===15&&await w?.()}for(let n=0;n<u.length;n+=3){const i=Math.hypot(u[n],u[n+1],u[n+2])||1;u[n]/=i,u[n+1]/=i,u[n+2]/=i}h.setAttribute("normal",new t.BufferAttribute(u,3)),h.boundingSphere=new t.Sphere(new t.Vector3(0,(Ae+He)/2,0),320),await w?.();const z=new t.MeshStandardMaterial({color:s[4],roughness:.92,metalness:0,vertexColors:!0}),f=new t.Color(s[1]).lerp(new t.Color(s[0]),.45);z.onBeforeCompile=n=>{n.uniforms.uTurf={value:f},n.uniforms.uSeed={value:d},n.uniforms.uSunW=S,n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vLp;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vLp = position;`),n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vLp;
uniform vec3 uTurf, uSunW; uniform float uSeed;
float gsRough, gsHgt;
`+Ue).replace("#include <color_fragment>",`#include <color_fragment>
      {
        vec3 p = vLp + uSeed;
        vec3 fnr = cross(dFdx(vLp), dFdy(vLp)); float fl = length(fnr); fnr = fl > 1e-9 ? fnr / fl : vec3(0.0, 1.0, 0.0);
        float big = gsFb(p * 0.021), fine = gsFb(p * 0.33);
        float yy = vLp.y + 6.0 * gsVn(p * 0.027) + 2.2 * gsVn(p * 0.12);
        float s = atan(vLp.x, abs(vLp.z) < 1e-4 ? 1e-4 : vLp.z) * 92.0;
        // the scoured band (worked out first: inside it the blocks' tints and joints are polished away); its top
        // breaks into the blocks along ledges at different heights, never along one ruled line
        float bandTop = vLp.y - 20.0 * (gsVn(p * 0.011 + 3.0) - 0.5) - 9.0 * (gsVn(p * 0.04) - 0.5);
        bandTop = floor(bandTop / 6.0) * 6.0 + 6.0 * smoothstep(0.55, 1.0, fract(bandTop / 6.0));       // stepped: a staircase of ledges
        float band = smoothstep(-52.0, -40.0, vLp.y) * (1.0 - smoothstep(46.0, 58.0, bandTop));
        float inBand = smoothstep(0.0, 0.6, band);
        // natural jointing: undulating sheeting joints of uneven spacing (most of them partial), a few leaning master
        // joints, a sparse diagonal set. No courses, no staggered uprights.
        float yA = vLp.y + 16.0 * gsVn(p * 0.014 + 1.0) + 4.0 * gsVn(p * 0.07), yB = vLp.y + 11.0 * gsVn(p * 0.02 + 7.0) + 2.0 * gsVn(p * 0.13);
        float sv = s + 13.0 * gsVn(p * 0.017 + 4.0) + 0.22 * vLp.y * (gsVn(vec3(floor(s / 31.0), 2.0, uSeed)) - 0.5);
        float rowA = floor(yA / 15.0), colA = floor(sv / 31.0);
        float cell = gsH3(vec3(rowA, colA, 7.0 + uSeed));
        float fwA = max(fwidth(yA), 1e-3), fwB = max(fwidth(yB), 1e-3), fs = max(fwidth(sv), 1e-3);
        float dA = abs(fract(yA / 15.0) - 0.5) * 15.0, dB = abs(fract(yB / 4.7 + 0.3) - 0.5) * 4.7;
        float jv = (gsH3(vec3(colA, 9.0, uSeed)) - 0.5) * 0.5, dV = abs(fract(sv / 31.0) - 0.5 - jv) * 31.0;
        float dg = sv * 0.55 + yA * 0.84, dD = abs(fract(dg / 43.0) - 0.5) * 43.0, fd = max(fwidth(dg), 1e-3);
        float mA = smoothstep(0.4, 0.58, gsVn(vec3(sv * 0.045, rowA * 3.1, 2.0)) * 0.75 + 0.25 * gsVn(vec3(sv * 0.21, rowA * 1.3, 12.0)));                         // where each joint is open
        float mB = smoothstep(0.56, 0.7, gsVn(vec3(sv * 0.08, floor(yB / 4.7) * 1.7, 5.0)));
        float mV = smoothstep(0.42, 0.58, gsVn(vec3(colA * 2.3, yA * 0.035, 4.0)));
        float mD = smoothstep(0.6, 0.72, gsVn(vec3(floor(dg / 43.0) * 1.9, sv * 0.02, 11.0)));
        float wA = 0.07 + 0.24 * gsVn(vec3(sv * 0.11, rowA, 3.0)), wV = 0.07 + 0.22 * gsVn(vec3(colA, yA * 0.1, 6.0));
        float lA = (1.0 - smoothstep(wA * 0.4 + fwA * 0.4, wA + fwA * 1.2, dA)) * clamp(0.5 / fwA, 0.12, 1.0) * mA;
        float lB = (1.0 - smoothstep(0.02 + fwB * 0.3, 0.07 + fwB, dB)) * clamp(0.22 / fwB, 0.0, 1.0) * 0.4 * mB;
        float lV = (1.0 - smoothstep(wV * 0.4 + fs * 0.4, wV + fs * 1.2, dV)) * clamp(0.5 / fs, 0.12, 1.0) * mV;
        float lD = (1.0 - smoothstep(0.03 + fd * 0.4, 0.1 + fd * 1.2, dD)) * clamp(0.3 / fd, 0.0, 1.0) * 0.55 * mD;
        float crk = max(max(lA, lV), max(lB, lD)) * (1.0 - 0.5 * inBand);
        // grain: feldspar and mica at arm's length, fading with distance
        float px = fwidth(vLp.x) + fwidth(vLp.y) + fwidth(vLp.z), grainK = clamp(0.1 / max(px, 1e-3), 0.0, 1.0);
        float grain = gsVn(p * 5.3) * 0.55 + gsVn(p * 13.0) * 0.45;
        vec3 g = diffuseColor.rgb * (0.9 + 0.42 * big) * (0.86 + 0.28 * fine) * (0.9 + 0.2 * mix(cell, 0.5, 0.4 * inBand));
        g *= mix(vec3(1.06, 1.0, 0.94), vec3(0.93, 0.99, 1.08), gsVn(p * 0.008 + 5.0));   // warm and cool blocks
        g *= 1.0 + grainK * (0.5 * (grain - 0.5) + 0.3 * step(0.8, grain));
        g *= 1.0 - 0.46 * crk;
        g *= 1.0 - 0.2 * (1.0 - smoothstep(0.0, 1.6, dA)) * mA * (1.0 - inBand) - 0.12 * (1.0 - smoothstep(0.0, 1.2, dV)) * mV * (1.0 - inBand);   // weathered dark along the open joints
        // dark seep streaks
        float sc = s + 3.0 * gsVn(p * 0.05);                                              // round-the-rock coordinate WITHOUT the per-course shift (streaks must run through the courses)
        float seep = smoothstep(0.52, 0.78, gsVn(vec3(sc * 0.21, yy * 0.011, 3.0))) * smoothstep(0.35, 0.7, gsVn(vec3(sc * 0.05, yy * 0.024, 7.0)));
        g *= 1.0 - 0.5 * seep;
        // the scoured band: pale, polished, faintly striated
        // pale, polished, with faint long striations (soft noise stretched round the rock, never ruled lines)
        float stri = gsVn(vec3(sc * 0.035, yy * 0.55, 4.0)) * 0.6 + gsVn(vec3(sc * 0.09, yy * 1.7, 9.0)) * 0.4 * clamp(0.6 / max(fwidth(yy), 1e-3), 0.0, 1.0);
        float lowS = gsFb(vec3(sc * 0.012, yy * 0.05, 2.0));
        float scour = (1.0 - smoothstep(0.0, 0.5, abs(fract(yy * 0.31 + 0.6 * gsVn(vec3(sc * 0.02, 1.0, 5.0))) - 0.5))) * smoothstep(0.45, 0.7, gsVn(vec3(sc * 0.03, floor(yy * 0.31), 8.0))) * clamp(0.5 / max(fwidth(yy), 1e-3), 0.0, 1.0);
        // five to eight broad scour grooves round the foot: a dark cut with a pale lip under it
        float gy = yy / 12.5 + 0.7 * gsVn(vec3(sc * 0.016, 1.0, 5.0)), gd = abs(fract(gy) - 0.5), gfw = max(fwidth(gy), 1e-3);
        float groove = (1.0 - smoothstep(0.02 + gfw * 0.5, 0.07 + gfw * 1.5, gd)) * smoothstep(0.25, 0.5, gsVn(vec3(sc * 0.022, floor(gy) * 1.7, 8.0))) * clamp(0.25 / gfw, 0.0, 1.0);
        float glip = (1.0 - smoothstep(0.06, 0.2, gd)) * (1.0 - groove);
        vec3 pale = mix(vec3(0.5, 0.455, 0.38), vec3(0.4, 0.385, 0.35), smoothstep(0.3, 0.7, lowS)) * (0.86 + 0.2 * fine) * (0.88 + 0.22 * stri) * (1.0 - 0.14 * scour) * (1.0 + grainK * (0.4 * (grain - 0.5) + 0.25 * step(0.8, grain)));
        pale *= (1.0 - 0.5 * groove) * (1.0 + 0.1 * glip) * (0.86 + 0.28 * mix(0.5, cell, 0.7)) * (1.0 - 0.4 * crk);
        pale *= 1.0 - 0.3 * (1.0 - smoothstep(-52.0, -30.0, vLp.y));                               // darker, damp at the very foot
        g = mix(g, pale * mix(vColor.r, 1.0, 0.45) * (1.0 - 0.6 * seep), band * 0.86);
        // ochre lichen above the break line, turf on the ledges
        float lich = smoothstep(0.47, 0.6, gsFb(p * 0.09 + 20.0)) * smoothstep(0.42, 0.6, gsFb(p * 0.6 + 2.0)) * smoothstep(55.0, 85.0, vLp.y) * (1.0 - band);
        g = mix(g, vec3(0.5, 0.4, 0.16) * (0.7 + 0.6 * fine) * vColor.r, lich * 0.65);
        float lich2 = smoothstep(0.5, 0.6, gsFb(p * 0.13 + 41.0)) * smoothstep(0.4, 0.6, gsFb(p * 0.9 + 12.0)) * (1.0 - band);
        g = mix(g, vec3(0.5, 0.54, 0.47) * (0.75 + 0.5 * fine) * vColor.r, lich2 * 0.5);     // grey-green crust
        float upS = dot(normalize(vNormal), normalize((viewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz)) * (gl_FrontFacing ? 1.0 : -1.0);   // the smooth normal: turf must not show the mesh's facets
        float turf = smoothstep(0.7, 0.9, mix(upS, fnr.y, 0.25) + 0.3 * (fine - 0.5) + 0.25 * (gsVn(p * 0.4 + 8.0) - 0.5)) * smoothstep(0.3, 0.5, gsFb(p * 0.045 + 3.0)) * smoothstep(52.0, 68.0, vLp.y) * (1.0 - smoothstep(262.0, 276.0, vLp.y));
        g = mix(g, uTurf * (0.55 + 0.9 * fine) * vColor.r, turf * 0.9);
        diffuseColor.rgb = g;
        gsRough = mix(0.93, 0.8, band * (1.0 - seep)) + 0.05 * turf;
        gsHgt = (-0.5 * crk + 0.9 * gsFb(p * 0.1 + 11.0) + 0.3 * fine + 0.05 * gsVn(p * 2.1) + 0.09 * grainK * grain) * (1.0 - 0.35 * band) * (1.0 - 0.7 * turf) - 0.7 * groove * band;
      }`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = gsRough;`).replace("#include <normal_fragment_begin>",`#include <normal_fragment_begin>
      { vec3 sx = dFdx(-vViewPosition), sy = dFdy(-vViewPosition); vec2 dH = vec2(dFdx(gsHgt), dFdy(gsHgt));
        vec3 r1 = cross(sy, normal), r2 = cross(normal, sx); float det = dot(sx, r1);
        vec3 nn = abs(det) * normal - sign(det) * (dH.x * r1 + dH.y * r2); float nl2 = length(nn);
        normal = nl2 > 1e-9 ? nn / nl2 : normal; }`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
{ vec3 upV = normalize((viewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz), sunV = normalize((viewMatrix * vec4(uSunW, 0.0)).xyz);
  float upn = dot(normal, upV) * 0.5 + 0.5, sn = dot(normal, sunV);
  totalEmissiveRadiance += diffuseColor.rgb * (vec3(0.5, 0.66, 1.0) * (0.03 + 0.17 * upn * upn) + vec3(1.0, 0.8, 0.55) * 0.2 * smoothstep(-0.55, 0.05, sn) * (1.0 - smoothstep(0.05, 0.5, sn))) * vColor.r; }   // shade is slate, never black`)};const a=new Float64Array(M*5*56);for(let n=0;n<M*5;n++){const i=Math.floor(n/5)/M*q,r=n%5,c=((r===0?i:r===1?i-Ke*.5:r===2?i+Ke*.5:r===3?i-Ke:i+Ke)/q%1+1)%1*D,A=Math.floor(c)%D,m=(A+1)%D,G=c-Math.floor(c);for(let R=0;R<56;R++)a[n*56+R]=O(x[R*D+A],x[R*D+m],G)}const v=(n,i)=>{const r=ce((i- -66)/166,0,1)*55,p=Math.min(54,Math.floor(r)),c=r-p,A=n*5*56+p;return O(a[A],a[A+1],c)},F=n=>{const i=ce((Re[0]- -66)/166,0,1)*55,r=Math.min(54,Math.floor(i)),p=i-r,c=n*5*56+r;Re[1]=Math.max(O(a[c],a[c+1],p),O(a[c+56],a[c+56+1],p),O(a[c+112],a[c+112+1],p),O(a[c+168],a[c+168+1],p),O(a[c+224],a[c+224+1],p))};return{mesh:new t.Mesh(h,z),torR:k,footR:b,footSeg:v,lipRock:F}}function Oe(e,s,d,T,w,S,k,L,g,C,x){const b=new t.BoxGeometry(1,1,1,3,3,3).toNonIndexed(),y=b.attributes.position,V=new Float32Array(y.count*3),W=new t.Matrix4().makeRotationFromEuler(new t.Euler(C,g,C*.6)),o=new t.Vector3,h=new t.Vector3,u=b.attributes.normal;for(let B=0;B<y.count;B++){o.fromBufferAttribute(y,B);const z=Math.max(Math.abs(o.x),Math.abs(o.y),Math.abs(o.z)),f=o.length()/Math.max(z,1e-4);o.multiplyScalar(O(1,.86/f*1.3,.38)),o.x*=S,o.y*=k,o.z*=L,h.set(o.x/(S*S),o.y/(k*k),o.z/(L*L)).normalize().applyMatrix4(W),u.setXYZ(B,h.x,h.y,h.z);const a=s.fbm3(o.x*.16+d,o.y*.16+T,o.z*.16+w,3);o.multiplyScalar(1+a*.16),o.applyMatrix4(W),y.setXYZ(B,o.x+d,o.y+T,o.z+w);const v=x*ce(.72+o.y/Math.max(k,.1)*.3+a*.2,.45,1);V[B*3]=V[B*3+1]=V[B*3+2]=v}b.setAttribute("color",new t.BufferAttribute(V,3)),b.deleteAttribute("uv"),e.push(b)}function At(e){const s=[];for(let d=0;d<ve-1;d++){const T=Ae+(He-Ae)*d/(ve-1),w=Ae+(He-Ae)*(d+1)/(ve-1);if(!(w<58))for(let S=0;S<D;S++){const k=S/D*q,L=e(k,T),g=e(k,w);let C=k-ye;C=Math.atan2(Math.sin(C),Math.cos(C)),L-g>5&&L>10&&!(Math.abs(C)<.36&&w<150)&&s.push({a:k,yLo:T,yHi:w,rEdge:L,rBack:g})}}return s}const tt=(e,s)=>{const d=O(e.rEdge,e.rBack,s);return{x:Math.sin(e.a)*d,y:O(e.yLo,e.yHi,s),z:Math.cos(e.a)*d,r:d}};async function zt(e,s,d,T,w){const S=[],k=Math.sin(ye),L=Math.cos(ye),g=L,C=-k,x=46,b=8,y=[],V=[],W=[],o=e.range(-1.6,1.6),h=e.chance(.5)?1:-1;for(let z=0;z<=x;z++){const f=z/x,a=f*Math.PI,v=Math.cos(a),F=Math.sin(a),l=-12.2*Math.sign(v)*Math.pow(Math.abs(v),.58)+o*F,n=X.y-7+29.2*Math.pow(Math.abs(F),.72)+1.2*s.n2(f*5,3),i=2.2*s.n2(f*4,9)*F,r=1-.13*Math.pow(Math.abs(Math.sin(f*x*.45+s.n2(f*7,1))),12),p=1+.35*Math.max(0,h*v)+.5*(1-F)*(1-F),c=O(2.7,2.2,F)*p*r,A=O(3.8,3.1,F)*p*r,m=12.2*.58*Math.pow(Math.max(Math.abs(v),.02),-.42)*F,G=28.6*.72*Math.pow(Math.max(F,.02),-.28)*v,R=Math.hypot(m,G)||1,J=G/R,I=-m/R;for(let Y=0;Y<b;Y++){const j=Y/b*q+Math.PI/8,P=Math.cos(j),H=Math.sin(j),N=1/Math.max(Math.abs(P),Math.abs(H))*.92,E=1+.2*s.fbm3(f*9,Y*1.7,4,3),Z=P*N*c*E,ee=H*N*A*E,oe=l+J*Z,K=n+I*Z,ne=ee+i;y.push(X.x+g*oe+k*ne,K,X.z+C*oe+L*ne);const fe=ce(.9+.12*I*P+.16*s.n3(f*14,Y,2),.7,1.05);V.push(fe,fe,fe)}}for(let z=0;z<x;z++)for(let f=0;f<b;f++){const a=z*b+f,v=z*b+(f+1)%b,F=a+b,l=v+b;W.push(a,F,v,v,F,l)}let u=new t.BufferGeometry;u.setAttribute("position",new t.Float32BufferAttribute(y,3)),u.setAttribute("color",new t.Float32BufferAttribute(V,3)),u.setIndex(W),u.computeVertexNormals(),u=u.toNonIndexed(),S.push(u),await w?.();for(let z=0;z<11;z++){const f=.06+.88*(z+e.range(-.25,.25))/10,a=f*Math.PI,v=Math.cos(a),F=Math.sin(a),l=(-12.2*Math.sign(v)*Math.pow(Math.abs(v),.58)+o*F)*1.07,n=X.y-7+29.2*Math.pow(Math.abs(F),.72)+.9*F,i=e.range(5.2,7.4)*(1+.25*(1-F)),r=e.range(-1.2,1.2);Oe(S,s,X.x+g*l+k*r,n,X.z+C*l+L*r,i*e.range(.85,1.1),i*e.range(.7,.95),i*e.range(1,1.35),ye+e.range(-.5,.5),e.range(-.3,.3),e.range(.85,1.02))}await w?.(),Oe(S,s,X.x+g*o,X.y+24.6,X.z+C*o,11,4.2,7.5,ye+.2,.06,1);for(const z of[-1,1])for(let f=0;f<3;f++){const a=z*(11.5+e.range(-2,5)+f*2.5),v=e.range(-5,6),F=e.range(3,6.5)/(1+f*.4);Oe(S,s,X.x+g*a+k*v,X.y-4+F*.3,X.z+C*a+L*v,F*1.3,F,F*1.1,e.range(0,3),e.range(-.2,.2),.85)}let B=0;for(let z=0;z<300&&B<44&&d.length;z++){const f=e.pick(d);if(f.rEdge-f.rBack<7||f.yHi<62)continue;const a=e.range(1.6,5.4),v=tt(f,e.range(.25,.7));Oe(S,s,v.x,v.y+a*.3,v.z,a*e.range(1,1.7),a*e.range(.6,1.1),a*e.range(.9,1.4),e.range(0,3),e.range(-.25,.25),.9),B++,B%8===0&&await w?.()}return await w?.(),T(S,!1)}function St(){const e=[],s=[],d=[];return{pos:e,col:s,sw:d,tri:(S,k,L,g,C,x,b,y,V,W)=>{e.push(S.x,S.y,S.z,k.x,k.y,k.z,L.x,L.y,L.z),s.push(g.r,g.g,g.b,C.r,C.g,C.b,x.r,x.g,x.b),d.push(b,W,y,W,V,W)},nfix:[]}}const ie=(e,s,d)=>new t.Vector3(e,s,d);function ht(e,s,d,T,w,S,k,L,g,C){const x=[],b=ie(0,1,0),y=ie(),V=ie(),W=ie();for(let o=0;o<s.length;o++){W.subVectors(s[Math.min(o+1,s.length-1)],s[Math.max(o-1,0)]).normalize(),y.crossVectors(W,Math.abs(W.y)>.95?ie(1,0,0):b).normalize(),V.crossVectors(y,W);const h=o/(s.length-1),u=O(d,T,h),B=[];for(let z=0;z<w;z++){const f=z/w*q;B.push(s[o].clone().addScaledVector(y,Math.cos(f)*u).addScaledVector(V,Math.sin(f)*u))}x.push(B)}for(let o=0;o<x.length-1;o++)for(let h=0;h<w;h++){const u=o/(x.length-1),B=(o+1)/(x.length-1),z=(h+1)%w,f=S.clone().lerp(k,u).multiplyScalar(.8+.4*(h%2)),a=S.clone().lerp(k,B).multiplyScalar(.8+.4*(h%2));e.tri(x[o][h],x[o][z],x[o+1][h],f,f,a,O(L,g,u),O(L,g,u),O(L,g,B),C),e.tri(x[o][z],x[o+1][z],x[o+1][h],f,a,a,O(L,g,u),O(L,g,B),O(L,g,B),C)}}function Ft(e,s,d,T,w,S,k,L){const g=s.range(0,q),C=new t.Color("#5e4733"),x=new t.Color("#94714c"),b=new t.Color("#25402c"),y=new t.Color("#46633a"),V=new t.Color("#9ea85a"),W=new t.Color("#1d3029"),o=[],h=s.range(.18,.32)*w,u=s.range(.7,1.5)*(s()<.5?-1:1),B=s.range(4,7);for(let l=0;l<=7;l++){const n=l/7,i=u*Math.sin(n*B)*(.4+.6*n);o.push(ie(T.x+S.x*h*n*n+S.z*i,T.y-1.5+(w+1.5)*n,T.z+S.z*h*n*n-S.x*i))}ht(e,o,w*.046,w*.012,6,C,x,0,.5,g);const z=s.int(4,6),f=ie(),a=ie(),v=L.attributes.position,F=(l,n,i)=>{for(let r=0;r<n;r++){const p=i(r);e.nfix.push(l+r,p.x,p.y,p.z)}};for(let l=0;l<z;l++){const n=O(.42,1,l/(z-1)),i=o[Math.round(n*7)],r=w*s.range(.16,.38)*(1.15-n*.5),p=s.range(-.5,.5),c=ie(i.x+(S.x*(.6+.4*s())-S.z*p)*r,i.y+s.range(-.3,.6),i.z+(S.z*(.6+.4*s())+S.x*p)*r);ht(e,[i.clone(),i.clone().lerp(c,.5).add(ie(0,-.5,0)),c.clone().add(ie(0,-.4,0))],w*.013,w*.005,4,C,x,n*.5,n*.8,g);const A=w*s.range(.2,.29)*(1.2-.45*n),m=.6+.4*n;for(let R=0;R<5;R++){const J=s.range(0,q),I=R===0?0:A*s.range(.4,.8),Y=A*(R===0?.62:s.range(.36,.56)),j=s.range(.34,.5),P=Math.cos(J)*I+S.x*A*.3*(R?1:0),H=Math.sin(J)*I+S.z*A*.3*(R?1:0),N=s.range(-.1,.16)*A,E=e.pos.length/3,Z=[],ee=[],oe=[];for(let K=0;K<v.count;K++){a.fromBufferAttribute(v,K);const ne=1+.34*d.n3(a.x*1.9+l*3+R,a.y*1.9+g,a.z*1.9);f.set(a.x*Y*ne,(a.y>0?a.y:a.y*.4)*Y*j*ne,a.z*Y*ne),Z.push(ie(c.x+P+f.x,c.y+N+f.y,c.z+H+f.z));const fe=ce(a.y*.95+.12+.3*d.n3(a.x*4,a.y*4+l,a.z*4+R),0,1);ee.push(a.y<-.2?W.clone():b.clone().lerp(y,Math.min(1,fe*2)).lerp(V,Math.max(0,fe*2-1)*.9)),oe.push(ie(a.x,a.y*1.6+.35,a.z).normalize())}for(let K=0;K<Z.length;K+=3)e.tri(Z[K],Z[K+1],Z[K+2],ee[K],ee[K+1],ee[K+2],m,m,m,g+l);F(E,Z.length,K=>oe[K])}const G=14;for(let R=0;R<G;R++){const J=R/G*q+s.range(-.2,.2),I=Math.cos(J),Y=Math.sin(J),j=Math.max(0,I*S.x+Y*S.z),P=A*s.range(.6,.9),H=P+A*s.range(.28,.5)*(.7+.9*j),N=A*s.range(.1,.17),E=c.y+s.range(-.06,.1)*A,Z=ie(c.x+I*P-Y*N,E,c.z+Y*P+I*N),ee=ie(c.x+I*P+Y*N,E,c.z+Y*P-I*N),oe=ie(c.x+I*H,E-A*s.range(.02,.16),c.z+Y*H),K=e.pos.length/3,ne=b.clone().lerp(y,s.range(.3,.9)),fe=y.clone().lerp(V,s.range(.2,.7));e.tri(Z,ee,oe,ne,ne,fe,m,m,1,g+l),F(K,3,()=>ie(I*.25,.95,Y*.25).normalize())}}}function ut(e,s,d,T,w,S,k,L){const g=k[1].clone().lerp(k[0],.5),C=k[2].clone().lerp(k[0],.35),x=T.z,b=-T.x;for(let y=0;y<w;y++){const V=s.range(0,q),W=S*s.range(.55,1.25),o=W*s.range(.16,.26),h=s.range(-.9,.9),u=T.x*Math.cos(h)+x*Math.sin(h),B=T.z*Math.cos(h)+b*Math.sin(h),z=s.range(-1,1)*S*.5,f=s.range(.25,.5),a=s()<L,v=s.range(.55,.9),F=a?1:s.range(.8,1.15),l=a?Vt:g,n=a?kt:C;let i=0,r=0,p=0,c=0,A=0,m=0,G=0,R=0,J=0,I=0;for(let Y=0;Y<=4;Y++){const j=Y/4,P=f*W*Math.sin(j*1.5),H=W*(.14*j-j*j*.95),N=o*(1-j*j)*.5,E=d.x+x*z+u*P,Z=d.y+.25+H,ee=d.z+b*z+B*P,oe=E-B*N,K=ee+u*N,ne=E+B*N,fe=ee-u*N,ze=O(l.r*v,n.r*F,j),Me=O(l.g*v,n.g*F,j),Se=O(l.b*v,n.b*F,j);Y>0&&(e.pos.push(i,r,p,c,A,m,oe,Z,K),e.col.push(G,R,J,G,R,J,ze,Me,Se),e.sw.push(I,V,I,V,j,V),Y<4&&(e.pos.push(c,A,m,ne,Z,fe,oe,Z,K),e.col.push(G,R,J,ze,Me,Se,ze,Me,Se),e.sw.push(I,V,j,V,j,V))),i=oe,r=Z,p=K,c=ne,A=Z,m=fe,G=ze,R=Me,J=Se,I=j}}}const Vt=new t.Color("#8f8a4e"),kt=new t.Color("#c9c486");async function Lt(e,s,d,T,w,S,k){const L=St(),g=ie(.2,0,-.98),C=new t.IcosahedronGeometry(1,0),x=[],b=d.filter(f=>f.rEdge-f.rBack>8&&f.yHi>74&&f.yHi<268);for(let f=0;f<600&&x.length<9&&b.length;f++){const a=e.pick(b),v=tt(a,e.range(.3,.6));x.some(F=>Math.hypot(F.x-v.x,F.y-v.y,F.z-v.z)<26)||(x.push(v),Ft(L,e,s,v,e.range(31,46),g,T,C),await k?.())}C.dispose();const y=Math.round(270*w);for(let f=0;f<y&&d.length;f++){const a=e.pick(d),v=tt(a,e.range(0,.12));ut(L,e,v,ie(Math.sin(a.a),0,Math.cos(a.a)),e.int(4,6),e.range(2.4,5.5),T,.25),f%30===29&&await k?.()}const V=Math.sin(ye),W=Math.cos(ye),o=W,h=-V;for(let f=0;f<16;f++){const a=e.range(-9,9),v=e.chance(.5)?1:-1,F=X.y+24-Math.abs(a)*.35+e.range(-1.5,1),l=ie(X.x+o*a+V*v*2.6,F,X.z+h*a+W*v*2.6);ut(L,e,l,ie(V*v,0,W*v),e.int(3,5),e.range(2,4),T,.35)}const u=new t.BufferGeometry;u.setAttribute("position",new t.Float32BufferAttribute(L.pos,3)),u.setAttribute("color",new t.Float32BufferAttribute(L.col,3)),u.setAttribute("aSw",new t.Float32BufferAttribute(L.sw,2)),u.boundingSphere=new t.Sphere(new t.Vector3(0,110,0),360),await k?.(),u.computeVertexNormals();{const f=u.attributes.normal;for(let a=0;a<L.nfix.length;a+=4)f.setXYZ(L.nfix[a],L.nfix[a+1],L.nfix[a+2],L.nfix[a+3])}await k?.();const B=new t.MeshStandardMaterial({vertexColors:!0,side:t.DoubleSide,roughness:.82});return B.onBeforeCompile=f=>{f.uniforms.uT=S,f.vertexShader=f.vertexShader.replace("#include <common>",`#include <common>
attribute vec2 aSw; uniform float uT;`).replace("#include <begin_vertex>",`#include <begin_vertex>
      { float w = aSw.x * aSw.x; float s = 0.34 * sin(uT * 1.1 + aSw.y) + 0.16 * sin(uT * 2.7 + aSw.y * 1.7 + position.x * 0.3);
        transformed += vec3(0.2, 0.05, -0.98) * w * (0.25 + s); }`),f.fragmentShader=f.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
  totalEmissiveRadiance += diffuseColor.rgb * vec3(0.5, 0.6, 0.66) * 0.5;   // sky fill: foliage in shade stays green`)},{mesh:new t.Mesh(u,B),pines:x}}const M=144,Le=16,$e=.75,dt=e=>{let s=e/M*q-ye;return s=Math.abs(Math.atan2(Math.sin(s),Math.cos(s))),.42+.58*$(.1,.36,s)};function Rt(e){let s=null,d=7;const T=(g,C,x)=>{const b=g/M*q,y=Math.sin(b),V=Math.cos(b);let W=-64,o=98;for(let h=0;h<9;h++){const u=(W+o)*.5,B=e(g,u);s(y*B,V*B,C)>u?W=u:o=u}x.y=(W+o)*.5,x.r=e(g,x.y)},w={y:0,r:0};return{state:(g,C,x,b)=>{for(let y=0;y<M;y++){T(y,g,w);const V=y/M*q,W=Math.sin(V)*(w.r+6),o=Math.cos(V)*(w.r+6),h=(s(W,o,g+.3)-s(W,o,g-.3))/.6;C[y]=w.y,x[y]=w.r,b[y]=$(.1*d,.72*d,h)*$(-34,-6,w.y)}},reach:(g,C)=>{T(g,C,w);const x=g/M*q,b=Math.sin(x)*(w.r+6),y=Math.cos(x)*(w.r+6),V=(s(b,y,C+.3)-s(b,y,C-.3))/.6;return w.y+16*$(.1*d,.72*d,V)*$(-34,-6,w.y)},setSampler:g=>{s=g;let C=0;for(let x=0;x<30;x+=.5)C=Math.max(C,Math.abs(g(0,430,x+.3)-g(0,430,x-.3))/.6);d=ce(C,4.5,8)}}}function Ct(e){return{uSunDir:{value:new t.Vector3(-.6,.7,.4).normalize()},uSunCol:{value:new t.Color("#FFF4DE").multiplyScalar(2.6)},uSkyCol:{value:e[5].clone().multiplyScalar(.75)},uTone:{value:new t.Color(1,1,1)}}}const me=30,ue=22,mt=72,Ge=7,vt=[-3,.6,4,10,20,34,52];function Bt(e,s,d,T,w,S,k,L,g,C,x){const b=new t.Group,y=new Float32Array(M*me*3),V=new Float32Array(M*me*3),W=new Float32Array(M*me*2),o=[];for(let P=0;P<M;P++)for(let H=0;H<me-1;H++){const N=P*me+H,E=(P+1)%M*me+H;o.push(N,N+1,E,E,N+1,E+1)}const h=new t.BufferGeometry;h.setAttribute("position",new t.BufferAttribute(y,3).setUsage(t.DynamicDrawUsage)),h.setAttribute("normal",new t.BufferAttribute(V,3).setUsage(t.DynamicDrawUsage)),h.setAttribute("aCap",new t.BufferAttribute(W,2).setUsage(t.DynamicDrawUsage)),h.setIndex(o),h.boundingSphere=new t.Sphere(new t.Vector3,d+60);const u=new t.MeshStandardMaterial({color:"#ffffff",roughness:.9});u.onBeforeCompile=P=>{Object.assign(P.uniforms,{uT:w,uG0:{value:e[0]},uG1:{value:e[1]},uG2:{value:e[2]},uW:{value:e[3]},uM:{value:e[6]},uSeed:{value:S}}),P.vertexShader=P.vertexShader.replace("#include <common>",`#include <common>
attribute vec2 aCap; varying vec3 vLp; varying vec3 vCap;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vLp = position; vCap = vec3(aCap, normal.z);`),P.fragmentShader=P.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vLp; varying vec3 vCap; uniform float uT, uSeed; uniform vec3 uG0, uG1, uG2, uW, uM;
`+Ue).replace("#include <color_fragment>",`#include <color_fragment>
      {
        vec3 p = vec3(vLp.x, 0.0, vLp.z) + uSeed;
        float big = gsFb(p * 0.011), mid = gsFb(p * 0.09 + 4.0), fine = gsVn(p * 1.3);
        float sheen = gsVn(vec3(p.x * 0.012 + uT * 0.05, 1.0, p.z * 0.03 + uT * 0.3));          // wind combing the grass
        float backF = smoothstep(-0.12, 0.2, vCap.z);                                              // sunlit back or dark front face
        vec3 g = mix(uG1, mix(uG0, uG2, 0.35), backF);
        g = mix(g, uG1, 0.3 * smoothstep(0.4, 0.75, big)); g = mix(g, uG2, 0.4 * smoothstep(0.5, 0.85, sheen) * (0.4 + 0.6 * backF) + 0.12 * mid);
        float blades = gsVn(vec3(p.x * 0.9, 3.0, p.z * 4.0 + uT * 0.6));
        g *= (0.72 + 0.26 * fine + 0.3 * blades) * (0.86 + 0.28 * mid);
        float fw = clamp(fwidth(vLp.x) + fwidth(vLp.z), 0.0, 4.0);
        float far = clamp(fw * 1.2, 0.0, 1.0), speck = smoothstep(0.6, 0.72, gsVn(p * 2.6 + 9.0));
        g = mix(g, uG2 * 1.05, smoothstep(0.66, 0.8, gsVn(p * 6.0 + 2.0)) * 0.35 * (1.0 - far));   // seed heads
        float rag = smoothstep(0.47, 0.6, gsFb(vec3(p.x * 0.011, uT * 0.02, p.z * 0.045) + 7.0));   // ragged whitecap streaks
        float streak = smoothstep(0.42, 0.62, gsFb(vec3(p.x * 0.07, 2.0, p.z * 0.3)));
        g = mix(g, uW * 0.78, vCap.x * rag * mix(speck * 0.9, 0.42 * streak, far));
        float camp = smoothstep(0.86, 0.9, gsVn(p * 5.5 + 31.0)) * (1.0 - far);
        g = mix(g, uM * 0.8, camp * 0.7);
        g = mix(g, vec3(0.09, 0.075, 0.05) + 0.25 * g, vCap.y * (0.45 + 0.4 * mid));                // torn, trodden edge at the rock
        diffuseColor.rgb = g;
      }`)};const B=new t.Mesh(h,u);B.frustumCulled=!1,B.visible=T,b.add(B);const z=ue*2,f=new Float32Array(M*z*3),a=new Float32Array(M*z*3),v=new Float32Array(M*z*4),F=new Float32Array(M*z),l=new Float32Array(M*z).fill(1),n=[];for(let P=0;P<M;P++)for(let H=0;H<z-1;H++){const N=P*z+H,E=(P+1)%M*z+H;n.push(N,E,N+1,E,E+1,N+1)}const i=new t.BufferGeometry;i.setAttribute("position",new t.BufferAttribute(f,3).setUsage(t.DynamicDrawUsage)),i.setAttribute("normal",new t.BufferAttribute(a,3).setUsage(t.DynamicDrawUsage)),i.setAttribute("aL",new t.BufferAttribute(v,4).setUsage(t.DynamicDrawUsage)),i.setAttribute("aArc",new t.BufferAttribute(F,1).setUsage(t.DynamicDrawUsage)),i.setAttribute("aShd",new t.BufferAttribute(l,1).setUsage(t.DynamicDrawUsage)),i.setIndex(n),i.boundingSphere=new t.Sphere(new t.Vector3,300);let r=0;for(let P=0;P<24;P++)r+=s(P/24*q,0);r=(r/24+14)*q/M;const p=new t.MeshStandardMaterial({color:"#ffffff",roughness:.9,side:t.DoubleSide});p.onBeforeCompile=P=>{Object.assign(P.uniforms,{uT:w,uG0:{value:e[0]},uG2:{value:e[2]},uW:{value:e[3]},uM:{value:e[6]},uTone:k.uTone}),P.vertexShader=P.vertexShader.replace("#include <common>",`#include <common>
attribute vec4 aL; attribute float aArc, aShd; varying vec4 vL; varying float vArc, vShd;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vL = aL; vArc = aArc; vShd = aShd;`),P.fragmentShader=P.fragmentShader.replace("#include <common>",`#include <common>
varying vec4 vL; varying float vArc, vShd; uniform float uT; uniform vec3 uG0, uG2, uW, uM, uTone;
float gsFill;
`+Ue).replace("#include <color_fragment>",`#include <color_fragment>
      {
        float xm = vL.x * ${r.toFixed(3)};                                                        // metres round the foot, measured
        float m = vArc;                                                                // metres up the sheet
        float rg = gsVn(vec3(vL.x * 0.9, uT * 0.6, 2.0)) * 0.45 + gsVn(vec3(vL.x * 4.3, uT * 1.1, 5.0)) * 0.55;   // ragged, tearing edge
        float rg2 = gsVn(vec3(xm * 1.3, m * 1.1 - uT * 0.4, 9.0));
        float tipE = 0.84 + 0.15 * rg - 0.13 * step(0.55, rg2) * smoothstep(0.72, 0.9, vL.y);       // the tip is torn in notches
        if (vL.z < 0.03 || vL.y > tipE) discard;
        float curlT = smoothstep(0.4, 0.5, vL.y);                                                   // 0 on the rising face, 1 in the roll
        // the grass side is the ground between the blades (the world plants its own meadow grass on this sheet): the
        // meadow's own tone (uTone), grain the same size in both directions, flecked with daisies
        float g1 = gsVn(vec3(xm * 0.9, m * 0.9, 1.0)), g2 = gsVn(vec3(xm * 3.1, m * 3.1, 6.0)), g3 = gsVn(vec3(xm * 0.21, m * 0.21, 3.0));
        float toneL = dot(uTone, vec3(0.3333));
        vec3 wht = uW * (0.45 + 0.55 * toneL);
        vec3 turf = mix(uG0, uG2, 0.18 + 0.3 * g3) * (0.6 + 0.3 * g1 + 0.28 * g2) * uTone;
        turf = mix(turf, wht * 0.8, smoothstep(0.66, 0.74, gsVn(vec3(xm * 2.3, m * 2.3, 3.0))) * (0.35 + 0.5 * vL.y));    // daisies thicken toward the crest
        turf = mix(turf, uM * 0.8 * toneL, smoothstep(0.86, 0.9, gsVn(vec3(xm * 2.9 + 7.0, m * 2.9, 11.0))) * 0.7);
        float cl = abs(vL.y - 0.43 - 0.05 * (rg - 0.5)), clw = 0.03 + 0.035 * gsVn(vec3(xm * 0.3, 4.0, uT * 0.2));
        turf = mix(turf, wht * 0.95, (1.0 - smoothstep(clw, clw + 0.035, cl)) * smoothstep(0.26, 0.44, gsVn(vec3(xm * 0.4, uT * 0.15, 31.0))) * (0.55 + 0.45 * g2) * smoothstep(0.42, 0.62, gsVn(vec3(xm * 2.3, m * 2.3, 3.0))) * (0.25 + 0.75 * smoothstep(0.3, 0.7, vL.z)));   // the peeling edge: a broken, dotted white line of daisies, faint on the low fringe (never a painted band)
        // the lip thrown out over the meadow wears the meadow on its top (the far side of the sheet) with a torn white line of
        // flowers along its leading edge; what hangs under it, and the hollow at the top of the rising face, is shadowed soil
        float edgeL = (1.0 - smoothstep(0.05, 0.1, abs(vL.y - 0.83 - 0.06 * (rg - 0.5)))) * smoothstep(0.3, 0.46, gsVn(vec3(xm * 0.4, uT * 0.15, 31.0)));
        vec3 topTurf = mix(turf, wht * 0.95, max(edgeL * (0.6 + 0.4 * g2), 0.5 * smoothstep(0.6, 0.7, gsVn(vec3(xm * 2.3, m * 2.3, 3.0))) * smoothstep(0.55, 0.8, vL.y)));
        // the underside of the sod: crumbly earth in three browns, stones, short pale roots each with its own slant, rags of turf
        vec3 sq = vec3(xm, m, 0.0), so = vec3(0.0, 0.0, 1.0);
        float e1 = gsVn(sq * 0.31 + so * 4.0), e2 = gsVn(sq * 1.3 + so * 14.0);
        float clod = gsVn(sq * 2.4 + so * 27.0), clod2 = gsVn(sq * 6.5 + so * 33.0);
        vec3 soil = mix(vec3(0.085, 0.04, 0.018), vec3(0.17, 0.082, 0.036), e1) * (0.75 + 0.5 * e2);
        soil = mix(soil, vec3(0.22, 0.14, 0.07), smoothstep(0.5, 0.7, gsVn(sq * 0.7 + so * 41.0)) * 0.7);           // a third, paler brown: dry crumbs
        soil *= (0.5 + 0.95 * smoothstep(0.3, 0.7, clod)) * (0.8 + 0.4 * clod2);                                          // clods and the pits between them
        // short pale roots: one to a cell in two cells out of five, each turned its own way, so no two run parallel
        vec2 rc = vec2(xm, m) / 1.2, ri = floor(rc), rf = fract(rc) - 0.5; float rh = gsH3(vec3(ri, 5.0)), rh2 = gsH3(vec3(ri, 9.0));
        float ra = rh * 6.2832, rcs = cos(ra), rsn = sin(ra); rf -= (vec2(rh2, fract(rh * 13.7)) - 0.5) * 0.3;
        vec2 rq = vec2(rf.x * rcs - rf.y * rsn, rf.x * rsn + rf.y * rcs);
        float root = (1.0 - smoothstep(0.02, 0.05, abs(rq.y - 0.07 * sin(rq.x * 11.0 + rh * 20.0)))) * (1.0 - smoothstep(0.16, 0.3, abs(rq.x))) * step(0.6, fract(rh2 * 7.3));
        soil = mix(soil, vec3(0.4, 0.33, 0.23), root * 0.6);
        soil = mix(soil, vec3(0.5, 0.48, 0.45), smoothstep(0.8, 0.86, gsVn(sq * 1.9 + so * 21.0)) * 0.7);            // stones
        soil = mix(soil, turf * 1.15, smoothstep(0.64, 0.72, gsVn(sq * 0.5 + so * 19.0) * 0.7 + 0.3 * clod) * 0.85);   // rags of sod still attached
        soil *= 0.8 + 0.25 * smoothstep(0.6, 0.95, vL.y);
        // the crest line, where the sheet stands upright and turns over: the leading edge the eye reads as the top of the wave.
        // It carries the same torn streak of the season's flowers as the swell's own crest; soil begins only under it, in the hollow
        float crestB = vL.w > 0.5 ? 0.0 : smoothstep(-0.2, -0.08, vL.w) * (1.0 - smoothstep(0.1, 0.2, vL.w)) * smoothstep(0.33, 0.42, vL.y) * smoothstep(0.1, 0.3, vL.z);
        crestB *= smoothstep(0.24, 0.4, gsVn(vec3(xm * 0.11, 17.0, uT * 0.05)) * 0.7 + 0.3 * rg2) * (0.7 + 0.3 * g2);
        turf = mix(turf, wht * 0.8, crestB);
        float soilK = vL.w > 0.5 ? 1.0 - smoothstep(0.02, 0.1, vL.y) : smoothstep(0.2, 0.38, vL.w);          // soil and roots only where the sheet hangs face down, in the hollow under the crest
        diffuseColor.rgb = mix(vL.w > 0.5 ? topTurf : turf, soil * (vL.w > 0.5 ? 1.0 : 0.62), soilK);
        // the torn leading edge of the thrown lip, on both sides of the sheet: the last three or four metres before the tear are
        // crowded with the season's flowers, a broken pale band that is the comber's crest line from in front and from below;
        // soil and roots begin behind it, in the hollow
        float tornN = gsVn(vec3(xm * 0.11, 17.0, uT * 0.05)) * 0.7 + 0.3 * rg2;
        float tipB = smoothstep(tipE - 0.36, tipE - 0.2, vL.y) * smoothstep(0.03, 0.12, vL.z) * smoothstep(0.14, 0.3, tornN) * (0.78 + 0.22 * g2);
        // and the top of the thrown lip (the far side of the sheet) carries the streak back from the edge in torn patches, as the swell's crest does
        float topB = vL.w > 0.5 ? smoothstep(0.44, 0.56, vL.y) * smoothstep(0.03, 0.12, vL.z) * smoothstep(0.34, 0.5, gsVn(vec3(xm * 0.07, m * 0.3, 21.0)) * 0.75 + 0.25 * g1) * (0.5 + 0.3 * g2) : 0.0;
        vec3 whtB = uW * (0.7 + 0.3 * toneL);
        float bandB = max(tipB, topB) * (0.72 + 0.28 * smoothstep(0.3, 0.6, gsVn(vec3(xm * 2.3, m * 2.3, 3.0))));   // heads, not paint
        diffuseColor.rgb = mix(diffuseColor.rgb, whtB * 0.95, bandB);
        diffuseColor.rgb *= mix(vec3(0.3, 0.42, 0.58), vec3(1.0), clamp(vShd + 0.6 * bandB, 0.0, 1.0));   // in a swell's shadow the comber is as cool and dark as the meadow it rises from; its flower streak stays the palest thing on it
        gsFill = max(mix(0.05, 0.42, soilK), 0.85 * bandB);                                              // petals pass the sky's light: the streak glows a little on its shaded side
      }`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance += diffuseColor.rgb * gsFill;   // sky fill: soil in shade stays brown, never black`).replace("#include <opaque_fragment>",`outgoingLight *= min(1.0, 0.88 / max(max(outgoingLight.r, outgoingLight.g), max(outgoingLight.b, 1e-3)));   // the crest streak stays under the bloom threshold
#include <opaque_fragment>`)};const c=new t.Mesh(i,p);c.frustumCulled=!1,b.add(c);const A=new Uint16Array(M*ue*4),m=new t.DataTexture(A,M,ue,t.RGBAFormat,t.HalfFloatType);m.minFilter=m.magFilter=t.NearestFilter,m.wrapS=t.RepeatWrapping,m.needsUpdate=!0;{const H=new t.InstancedBufferGeometry,N=new Float32Array(520*4);H.setAttribute("position",new t.Float32BufferAttribute([-.5,0,0,.5,0,0,.5,1,0,-.5,0,0,.5,1,0,-.5,1,0],3));for(let ee=0;ee<520;ee++){const oe=ce(g.gauss()*.8,-2.2,2.2),K=g()<.4;N[ee*4]=(oe/q%1+1)%1*M,N[ee*4+1]=K?g.range(ue-5.5,ue-1.6):g.range(8.2,ue-2.2),N[ee*4+2]=g.range(.9,2.4)*(K?1.2:.8),N[ee*4+3]=g()}H.setAttribute("aR",new t.InstancedBufferAttribute(N,4)),H.instanceCount=520,H.boundingSphere=new t.Sphere(new t.Vector3,320);const E=new t.ShaderMaterial({fog:!0,side:t.DoubleSide,uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...k,uT:w,uViewH:L,uLip:{value:m}},vertexShader:`
        uniform sampler2D uLip; uniform float uT, uViewH; attribute vec4 aR; varying vec3 vQ; varying float vPx;
        #include <fog_pars_vertex>
        vec4 gsLipT(float i, float v) { return texture2D(uLip, vec2((i + 0.5) / ${M}.0, (v + 0.5) / ${ue}.0)); }
        void main() {
          float i0 = floor(aR.x), fi = aR.x - i0, v0 = floor(aR.y), fv = aR.y - v0, vv = aR.y;
          vec4 A = gsLipT(i0, v0), B = gsLipT(i0 + 1.0, v0), C = gsLipT(i0, v0 + 1.0), D = gsLipT(i0 + 1.0, v0 + 1.0);
          vec4 P = mix(mix(A, B, fi), mix(C, D, fi), fv);
          vec3 nn = cross(B.xyz - A.xyz, C.xyz - A.xyz); float nl = length(nn);
          vec3 N = nl > 1e-4 ? nn / nl : vec3(0.0, 1.0, 0.0);
          float t = vv < 7.0 ? 0.45 * vv / 7.0 : 0.45 + 0.55 * (vv - 7.0) / 14.0;
          float thick = 0.6 + 2.4 * pow(max(1.0 - t, 0.0), 0.8) * min(1.0, P.w * 2.2);
          float show = smoothstep(0.24, 0.5, P.w), len = aR.z * show * min(1.0, P.w * 1.5);   // no curtain of roots on the low fringe
          vec4 wp = modelMatrix * vec4(P.xyz + N * 0.05 * thick, 1.0);                 // from the underside of the thrown lip
          vec3 toC = cameraPosition - wp.xyz; float d = max(length(toC), 1e-3);
          vec3 sdv = cross(vec3(0.0, 1.0, 0.0), toC / d); float sl = length(sdv); sdv = sl > 1e-3 ? sdv / sl : vec3(1.0, 0.0, 0.0);
          float pm = 2.0 * d / max(projectionMatrix[1][1] * uViewH, 1.0);              // metres to a pixel at this distance
          float W = max(0.6, 5.0 * pm), y = position.y;
          vec3 outw = normalize(mat3(modelMatrix) * N); vec3 lat = cross(outw, vec3(0.0, 1.0, 0.0)); float ll = length(lat); lat = ll > 1e-3 ? lat / ll : vec3(1.0, 0.0, 0.0);                                // out of the soil side, then drooping
          wp.xyz += sdv * position.x * W * show + (outw * (0.75 * y - 0.3 * y * y) + lat * ((fract(aR.w * 13.7) - 0.5) * 1.5 * y) - vec3(0.0, 1.0, 0.0) * ((0.05 + 0.4 * fract(aR.w * 5.3)) * y + (0.3 + 0.6 * fract(aR.w * 9.1)) * y * y)) * len + vec3(0.24, 0.0, -0.97) * (0.25 * y * y * len * (0.6 + 0.6 * sin(uT * 1.7 + aR.w * 40.0)));
          vQ = vec3(position.x, y, aR.w); vPx = pm / W;
          vec4 mvPosition = viewMatrix * wp;
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        ${Ye}
        varying vec3 vQ; varying float vPx;
        void main() {
          float y = vQ.y, sd = vQ.z;
          float th = max(0.055 * (1.0 - 0.7 * y), 0.8 * vPx);                         // half thickness in quad widths: never under about 1.6 pixels
          float x1 = vQ.x - 0.22 * sin(y * 5.0 + sd * 30.0) * y - 0.12, x2 = vQ.x + 0.2 * sin(y * 4.0 + sd * 50.0) * y + 0.15;
          float a = max(1.0 - smoothstep(th * 0.6, th, abs(x1)), (1.0 - smoothstep(th * 0.6, th, abs(x2))) * step(y, 0.4 + 0.5 * fract(sd * 7.3)));
          float crumb = 1.0 - smoothstep(0.1, 0.16, length(vec2(vQ.x - 0.02, (y - 0.05) * 1.6)));     // a crumb of soil where it leaves the sod
          if (max(a, crumb) < 0.5) discard;
          vec3 c = mix(mix(vec3(0.36, 0.3, 0.21), vec3(0.24, 0.17, 0.11), fract(sd * 3.7)), vec3(0.2, 0.12, 0.07), max(crumb, 1.0 - smoothstep(0.0, 0.25, y)));
          gl_FragColor = vec4(c * (uSunCol * 0.2 + uSkyCol * 0.75), 1.0);
          #include <fog_fragment>
        }`}),Z=new t.Mesh(H,E);Z.frustumCulled=!1,Z.name="lip-roots",b.add(Z)}const G=new Float32Array(M*Ge*3),R=new Float32Array(M*Ge*3),J=[];for(let P=0;P<M;P++)for(let H=0;H<Ge-1;H++){const N=P*Ge+H,E=(P+1)%M*Ge+H;J.push(N,E,N+1,E,E+1,N+1)}const I=new t.BufferGeometry;I.setAttribute("position",new t.BufferAttribute(G,3).setUsage(t.DynamicDrawUsage)),I.setAttribute("aF",new t.BufferAttribute(R,3).setUsage(t.DynamicDrawUsage)),I.setIndex(J),I.boundingSphere=new t.Sphere(new t.Vector3,300);const Y=new t.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!0,side:t.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-4,uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...k,uT:w,uW:{value:e[3]},uM:{value:e[6]},uG1:{value:e[1]}},vertexShader:`
      attribute vec3 aF; varying vec3 vF; varying vec3 vP;
      #include <fog_pars_vertex>
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        wp.y += 0.3 + 0.003 * distance(wp.xyz, cameraPosition);                    // stay clear of the coarse far ground
        vF = aF; vP = position;
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${Ye}
      ${Ue}
      uniform float uT; uniform vec3 uW, uM, uG1; varying vec3 vF; varying vec3 vP;
      void main() {
        float dr = max(vF.y, 0.0);
        float rag = gsFb(vec3(vF.x * 0.045, uT * 0.05, 3.0)), rag2 = gsVn(vec3(vF.x * 0.31, dr * 0.2 - uT * 0.5, 7.0));
        float reach = 3.0 + 20.0 * rag * rag + 12.0 * vF.z + 5.0 * rag2;
        float foam = 1.0 - smoothstep(0.2 * reach, reach, dr);
        float fw = clamp((fwidth(vP.x) + fwidth(vP.z)) * 0.9, 0.0, 1.0);
        float speck = smoothstep(0.4, 0.6, gsVn(vec3(vP.x * 1.3, vP.z * 1.3, 2.0 + uT * 0.2)));
        float tongue = smoothstep(0.35, 0.7, gsVn(vec3(vF.x * 0.12, dr * 0.08 - uT * 0.25, 1.0)));     // tongues of white sliding along the foot
        float patchy = smoothstep(0.38, 0.62, gsVn(vec3(vP.x * 0.31, vP.z * 0.31, 5.0))) * (0.45 + 0.55 * smoothstep(0.3, 0.6, gsVn(vec3(vP.x * 0.09, vP.z * 0.09, 12.0))));
        float aw = clamp(foam * (0.3 + 0.7 * tongue), 0.0, 1.0) * mix(speck, patchy, fw) * 0.96;
        float flick = smoothstep(0.8, 0.86, gsVn(vec3(vP.x * 0.9 + 5.0, vP.z * 0.9, 9.0))) * foam * (1.0 - fw);
        float sh = (1.0 - smoothstep(0.0, 7.0, dr)) * 0.6;
        vec3 lit = uSunCol * 0.36 + uSkyCol * 0.95;
        vec3 white = mix(mix(uW, vec3(0.95, 0.95, 0.93), 0.8) * 0.9, uM * 0.9, flick) * lit;   // churned pale whatever the season's cap colour
        vec3 dark = uG1 * 0.22 * (uSkyCol * 1.4);
        float r2 = 3.5 + 9.0 * rag2 + 8.0 * gsVn(vec3(vF.x * 0.19, 3.0, 1.0)) + 6.0 * gsVn(vec3(vF.x * 0.9, 5.0, 2.0)) * (1.0 - fw) + 5.0 * vF.z;
        float torn = smoothstep(0.42, 0.6, gsVn(vec3(vF.x * 0.07, 29.0, 3.0)) * 0.6 + 0.4 * gsVn(vec3(vP.x * 0.21, vP.z * 0.21, 8.0))) * (1.0 - smoothstep(0.12, 0.34, vF.z));   // short lengths of torn sod, none where the comber's foot is sewn into the land
        float soil = (1.0 - smoothstep(0.4 * r2, r2, dr)) * (0.3 + 0.5 * smoothstep(0.35, 0.65, gsVn(vec3(vP.x * 0.17, vP.z * 0.17, 23.0)))) * torn;                    // torn turf and soil stain at the contact, ragged
        sh *= 1.0 - smoothstep(0.1, 0.3, vF.z);
        aw *= smoothstep(0.4, 0.62, gsVn(vec3(vF.x * 0.033, 11.0, uT * 0.03))) * (0.3 + 0.7 * patchy) * mix(1.0, speck, 0.6) * (1.0 - smoothstep(0.1, 0.3, vF.z) * (1.0 - smoothstep(12.0, 22.0, dr) * patchy));   // a ragged scatter of flower heads, never a ruled ribbon
        vec3 soilC = mix(vec3(0.13, 0.08, 0.045), vec3(0.22, 0.145, 0.08), gsVn(vec3(vP.x * 0.6, vP.z * 0.6, 3.0))) * lit;
        soilC = mix(soilC, uG1 * 0.5 * lit, smoothstep(0.5, 0.75, gsVn(vec3(vP.x * 0.23, vP.z * 0.23, 17.0))));      // sods still green among the soil
        float aS = max(soil, sh * (1.0 - soil));
        vec3 under = mix(dark, soilC, soil / max(aS, 1e-3));
        float a = max(aw, aS * (1.0 - aw));
        if (a < 0.01) discard;
        gl_FragColor = vec4(mix(under, white, aw / max(a, 1e-3)), a);
        #include <fog_fragment>
      }`}),j=new t.Mesh(I,Y);return j.frustumCulled=!1,j.renderOrder=1,b.add(j),{grp:b,skirt:B,sGeo:h,lGeo:i,fGeo:I,fPos:G,fA:R,sPos:y,sNor:V,sCap:W,lPos:f,lNor:a,lUv:v,lArc:F,lShd:l,footSeg:C,lipRock:x,skirtRadius:d,lipData:A,lipTex:m,shade:null,lump:null}}const Qe=8,xe=.45,Ke=q/M,Re=new Float64Array(2);function pt(e){return e<Qe?xe*e/(Qe-1):xe+(1-xe)*(e-Qe+1)/(ue-Qe)}function gt(e,s,d){return e<xe?s-.3*(e/xe)*(e/xe):s-.3-d*(e-xe)/(1-xe)}const wt=new Float64Array(ue),Ie=new Float64Array(ue*3);for(let e=0;e<ue;e++){const s=pt(e);wt[e]=s,Ie[e*3]=2.6*Math.pow(1-s,.8),Ie[e*3+1]=$(xe-.2,xe+.1,s),Ie[e*3+2]=1-$(.82,1,s)}function Tt(e,s,d,T,w,S,k,L){const{sPos:g,sNor:C,sCap:x,lPos:b,lNor:y,lUv:V,lArc:W,lShd:o,footSeg:h,lipRock:u,skirtRadius:B,lipData:z,lump:f}=e,a=t.DataUtils.toHalfFloat;if(e.skirt.visible){for(let l=0;l<M;l++){const n=l/M*q,i=Math.sin(n),r=Math.cos(n),p=w[l];for(let c=0;c<me;c++){const A=(l*me+c)*3;let m,G;if(c===0)m=p-2.5,G=T[l]+1.2;else{const J=(c-1)/(me-2);m=p+.4+(B-p)*Math.pow(J,1.75),G=s(i*m,r*m,d),c===1&&(G=Math.max(G,T[l]))}g[A]=i*m,g[A+1]=G,g[A+2]=r*m;const R=(l*me+c)*2;x[R]=$(14,40,G)*$(0,30,m-p),x[R+1]=1-$(1,11+14*S[l],m-p)}}for(let l=0;l<M;l++){const n=(l+1)%M*me,i=(l+M-1)%M*me;for(let r=0;r<me;r++){const p=(l*me+r)*3,c=Math.min(r+1,me-1),A=Math.max(r-1,0),m=(l*me+c)*3,G=(l*me+A)*3,R=(n+r)*3,J=(i+r)*3,I=g[m]-g[G],Y=g[m+1]-g[G+1],j=g[m+2]-g[G+2],P=g[R]-g[J],H=g[R+1]-g[J+1],N=g[R+2]-g[J+2];let E=Y*N-j*H,Z=j*P-I*N,ee=I*H-Y*P;Z<0&&(E=-E,Z=-Z,ee=-ee);const oe=Math.hypot(E,Z,ee)||1;C[p]=E/oe,C[p+1]=Z/oe,C[p+2]=ee/oe}}e.sGeo.attributes.position.needsUpdate=!0,e.sGeo.attributes.normal.needsUpdate=!0,e.sGeo.attributes.aCap.needsUpdate=!0}{const{fPos:l,fA:n}=e;for(let i=0;i<M;i++){const r=i/M*q,p=Math.sin(r),c=Math.cos(r),A=w[i];for(let m=0;m<Ge;m++){const G=(i*Ge+m)*3,R=A+vt[m];l[G]=p*R,l[G+1]=m===0?T[i]+2.6:Math.max(s(p*R,c*R,d),m===1?T[i]:-1e9),l[G+2]=c*R,n[G]=(i+M/2)%M*7.4,n[G+1]=vt[m],n[G+2]=S[i]}}e.fGeo.attributes.position.needsUpdate=!0,e.fGeo.attributes.aF.needsUpdate=!0}const v=ue*2,F=xe;for(let l=0;l<M;l++){const n=l/M*q,i=Math.sin(n),r=Math.cos(n);let p=0,c=0;for(let _=-5;_<=5;_++){const te=6-Math.abs(_);p+=te*S[(l+M+_)%M],c+=te}const A=dt(l);let m=Math.max($(.02,.4,p/c),.3+.06*k.n2(l*.21+11,3.3))*A;{let _=n-ye;if(_=Math.atan2(Math.sin(_),Math.cos(_)),Math.abs(_)<1.2){const te=Math.abs(Math.sin(_))*w[l],se=Math.cos(_)*w[l],pe=X.y+9-Math.max(0,se-et)*.364-26-T[l],de=(.45*mt+20)*m;m*=O(ce(pe/Math.max(de,1),.12,1),1,$(40,85,te))}}const G=.94+.2*k.n2(l*.13,d*.2)+.1*k.n2(l*.6,d*.45),R=.45*mt*m*ce(G,.72,1.2),J=Math.min(6+6.5*m,.4*R+1.2)*$(.03,.2,m)*ce(G,.8,1.15),I=(h(l,T[l]+3)-h(l,T[l]-3))/6,Y=Math.atan2(1,Math.min(I,-.15))-.1,j=(1.3+.2*$(-18,30,T[l]))*(.92+.16*k.n2(l*.11+40,d*.15)),P=2.4,H=T[l]-1.5-5.5*$(.3,.8,m),N=Math.min(1,m*2.2),E=3.4*N,Z=a(m);Re[0]=H,u(l);let ee=Re[1],oe=H,K=oe,ne=0,fe=0,ze=0,Me=0,Se=0,U=0,Q=0;const ae=e.shade?e.shade(i*(w[l]+4),r*(w[l]+4),.35*R,d):1;for(let _=0;_<ue;_++){const te=wt[_],se=gt(te,Y,j);if(_>0){const re=gt((te+ne)*.5,Y,j),Te=(te<=F?R/F:j*J/(1-F))*(te-ne)+(_===1?7*$(.3,.8,m):0);ee+=Math.cos(re)*Te,oe+=Math.sin(re)*Te}ne=te,Re[0]=oe,u(l);const pe=Re[1];ee<pe&&(ee=pe);const de=Math.sin(se),we=-Math.cos(se),Fe=(.55+Ie[_*3]*N+E*Ie[_*3+1]*Ie[_*3+2])*.5,le=(l*v+_)*3,ge=(l*v+(v-1-_))*3,Ve=(l*v+_)*4,be=(l*v+(v-1-_))*4;let he=ee+de*(P+2*Fe);const Ce=oe+we*(P+2*Fe);if(te<=F){Re[0]=Ce,u(l);const re=Re[1]+P;he<re&&(he=re)}let We=Ce;if(_===0){const re=he+5,Te=s(i*re,r*re,d)-1.5;Te<Ce&&(he=re,We=Te)}b[le]=i*he,b[le+1]=We,b[le+2]=r*he,o[l*v+_]=o[l*v+(v-1-_)]=ae;{const re=(_*M+l)*4;z[re]=a(i*he),z[re+1]=a(We),z[re+2]=a(r*he),z[re+3]=Z}y[le]=i*de,y[le+1]=we,y[le+2]=r*de;const je=te>F?f[l*ue+_]*Math.min(1,m*3):0;let ke=ee+de*(P-je);const _e=oe+we*(P-je);if(te<=F){Re[0]=_e,u(l);const re=Re[1]+.5;ke<re&&(ke=re)}b[ge]=i*ke,b[ge+1]=_e,b[ge+2]=r*ke,y[ge]=-i*de,y[ge+1]=-we,y[ge+2]=-r*de;const Be=(l+M/2)%M;V[Ve]=Be,V[Ve+1]=te,V[Ve+2]=m;{const re=-we;V[Ve+3]=re>.1?.45*$(.1,.55,re):-.2*$(.1,-.3,re)}V[be]=Be,V[be+1]=te,V[be+2]=m,V[be+3]=1,_>0&&(fe+=Math.hypot(he-Me,Ce-Se),ze+=Math.hypot(ke-U,_e-Q)),Me=he,Se=Ce,U=ke,Q=_e,W[l*v+_]=fe,W[l*v+(v-1-_)]=ze,oe>K&&(K=oe)}L[l]=K}e.lGeo.attributes.position.needsUpdate=!0,e.lGeo.attributes.normal.needsUpdate=!0,e.lGeo.attributes.aL.needsUpdate=!0,e.lGeo.attributes.aArc.needsUpdate=!0,e.lGeo.attributes.aShd.needsUpdate=!0,e.lipTex.needsUpdate=!0}const ot=`
uniform sampler2D uHist; uniform float uT, uViewH;
attribute vec4 aSeed; attribute vec3 aRnd;
vec4 gsLaunch(float life, out float age) {
  float cyc = floor((uT + aSeed.y) / life), t0 = cyc * life - aSeed.y;
  age = uT - t0;
  float m0 = floor(t0 / ${$e.toFixed(2)});
  return texture2D(uHist, vec2((aSeed.x + 0.5) / ${M}.0, (mod(m0, ${Le}.0) + 0.5) / ${Le}.0));
}
float gsMinSize(float size, vec3 wp, float px) {
  float d = length(wp - cameraPosition);
  return max(size, px * 2.0 * d / max(projectionMatrix[1][1] * uViewH, 1.0));
}`,Ye=`
uniform vec3 uSunDir, uSunCol, uSkyCol;
#include <common>
#include <fog_pars_fragment>`;function Pt(e,s,d,T,w,S,k,L,g){const C=new t.Group,x=()=>({...t.UniformsUtils.clone(t.UniformsLib.fog),...T,uT:w,uHist:S,uViewH:k}),b=(l,n,i=0,r=.75,p=0)=>{const c=new Float32Array(l*4),A=new Float32Array(l*3);for(let m=0;m<l;m++){const G=e.gauss(),R=m<l*p?ce(i+G*r,i-1.1,2.4):ce(G*.75,-2.4,2.4);c[m*4]=Math.floor((R/q%1+1)%1*M)%M,c[m*4+1]=e.range(0,n*4),c[m*4+2]=e(),c[m*4+3]=e(),A[m*3]=e(),A[m*3+1]=e(),A[m*3+2]=e()}return[new t.InstancedBufferAttribute(c,4),new t.InstancedBufferAttribute(A,3)]},y=Math.round(5200*d),V=new t.InstancedBufferGeometry;V.setAttribute("position",new t.Float32BufferAttribute([-.5,-.5,0,0,-.5,.22,.5,-.5,0,-.5,.5,0,0,.5,.22,.5,.5,0],3)),V.setIndex([0,2,5,0,5,3]);const[W,o]=b(y,11,.42,.5,.6);V.setAttribute("aSeed",W),V.setAttribute("aRnd",o),V.instanceCount=y,V.boundingSphere=new t.Sphere(new t.Vector3(0,80,0),420);const h=new t.ShaderMaterial({side:t.DoubleSide,fog:!0,uniforms:{...x(),uWhite:{value:s[3].clone().multiplyScalar(.8)},uMag:{value:s[6]},uAxisP:{value:L},uAxisD:{value:g}},vertexShader:`
      ${ot}
      uniform vec3 uAxisP, uAxisD;
      varying vec3 vN; varying vec2 vQ; varying float vMag;
      #include <fog_pars_vertex>
      void main() {
        float life = 8.0 + 3.0 * aSeed.z, age;
        vec4 h = gsLaunch(life, age);
        float E = h.z * smoothstep(-30.0, 4.0, h.w), an = (aSeed.x + aRnd.x) / ${M}.0 * 6.2831853;
        vec3 outw = vec3(sin(an), 0.0, cos(an)), up = vec3(0.0, 1.0, 0.0);
        float k = 1.0 - exp(-age / 2.6);
        float v0 = (20.0 + 56.0 * aRnd.y * sqrt(aRnd.y)) * sqrt(max(E, 0.0)) * (0.55 + 0.45 * cos(aSeed.x / 144.0 * 6.2831853));   // most of it stays low, thick along the crest it is thrown from; a few fly high
        vec3 p = outw * (h.x + 2.0 + aRnd.z * 5.0) + up * (h.y - 2.0 * aRnd.x);
        p += up * (v0 * 2.6 * k - 1.5 * max(age - 2.5, 0.0)) + outw * (3.0 + 16.0 * aRnd.z) * k * (0.4 + E);
        p += vec3(0.24, 0.0, -0.97) * 8.0 * age * smoothstep(0.3, 3.5, age) * (0.35 + 0.65 * aSeed.w);     // streaming downwind
        p += vec3(outw.z, 0.0, -outw.x) * (aRnd.x - 0.5) * 34.0 * k;                                         // fanning along the crest
        p += vec3(sin(age * 0.9 + aSeed.w * 40.0), 0.6 * sin(age * 1.3 + aRnd.y * 30.0), cos(age * 0.7 + aRnd.x * 50.0)) * (1.0 + 0.6 * age);
        vec3 da = p - uAxisP; float al = dot(da, uAxisD); vec3 rad = da - al * uAxisD; float rl = length(rad);   // clear tube on the approach line
        if (al > -40.0 && al < 320.0 && rl < 6.0) p += (rl > 1e-3 ? rad / rl : up) * (6.0 - rl);
        float show = step(aRnd.z, E * 2.6) * smoothstep(0.0, 0.25, age) * (1.0 - smoothstep(life - 2.5, life, age));
        float size = gsMinSize(0.5 + 0.4 * aRnd.y, (modelMatrix * vec4(p, 1.0)).xyz, 2.7) * show;
        float a1 = aSeed.w * 30.0 + age * (1.5 + 2.0 * aRnd.x), a2 = aRnd.y * 20.0 + age * (1.1 + 1.8 * aRnd.z);
        vec3 X = vec3(cos(a1) * cos(a2), sin(a2), sin(a1) * cos(a2)), Z0 = vec3(-sin(a1), 0.0, cos(a1)), N = cross(X, Z0);
        vec3 wp = p + (X * position.x * 0.8 + Z0 * position.y + N * position.z) * size;
        vN = mat3(modelMatrix) * N; vQ = position.xy; vMag = step(0.833, aSeed.w);
        vec4 mvPosition = viewMatrix * modelMatrix * vec4(wp, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${Ye}
      uniform vec3 uWhite, uMag; varying vec3 vN; varying vec2 vQ; varying float vMag;
      void main() {
        if (dot(vQ, vQ) > 0.27) discard;
        float nl = abs(dot(vN, uSunDir));
        vec3 alb = mix(uWhite, uMag * 0.9, vMag);
        vec3 sunW = mix(uSunCol, vec3(dot(uSunCol, vec3(0.3, 0.59, 0.11))), 0.75);        // a petal is thin: it glows its own colour from either side, whatever the hour
        vec3 col = alb * (sunW * (0.3 + 0.42 * nl) + uSkyCol * vec3(0.3, 0.28, 0.4));     // sunlit, a cool shadow side; petals wink as they turn
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`}),u=new t.Mesh(V,h);u.frustumCulled=!1,C.add(u);const B=Math.round(900*d),z=new t.InstancedBufferGeometry;z.setAttribute("position",new t.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),z.setIndex([0,1,2,0,2,3]);const[f,a]=b(B,11,.5,.42,1);z.setAttribute("aSeed",f),z.setAttribute("aRnd",a),z.instanceCount=B,z.boundingSphere=V.boundingSphere;const v=new t.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!0,uniforms:{...x(),uWhite:{value:s[3].clone().multiplyScalar(.8)},uMag:{value:s[6]}},vertexShader:`
      ${ot}
      varying vec2 vQ; varying vec3 vA;
      #include <fog_pars_vertex>
      void main() {
        float life = 8.0 + 3.0 * aSeed.z, age;
        vec4 h = gsLaunch(life, age);
        float E = max(h.z, 0.0) * smoothstep(-30.0, 4.0, h.w), an = (aSeed.x + aRnd.x) / ${M}.0 * 6.2831853;
        vec3 outw = vec3(sin(an), 0.0, cos(an));
        float k = 1.0 - exp(-age / 2.6), v0 = (20.0 + 50.0 * aRnd.y * sqrt(aRnd.y)) * sqrt(E) * (0.55 + 0.45 * cos(an));
        vec3 p = outw * (h.x + 4.0 + aRnd.z * 6.0) + vec3(0.0, h.y + v0 * 2.6 * k - 1.2 * max(age - 3.0, 0.0), 0.0) + outw * (4.0 + 10.0 * aRnd.z) * k;
        p += vec3(0.24, 0.0, -0.97) * 8.0 * age * smoothstep(0.3, 3.5, age) * (0.4 + 0.5 * aSeed.w) + vec3(outw.z, 0.0, -outw.x) * (aRnd.x - 0.5) * 30.0 * k;
        vec4 mvPosition = viewMatrix * modelMatrix * vec4(p, 1.0);
        float size = (13.0 + 17.0 * aRnd.x) * (0.55 + 0.22 * age);
        mvPosition.xy += position.xy * size;
        float show = smoothstep(0.02, 0.26, E) * smoothstep(0.0, 1.2, age) * (1.0 - smoothstep(life * 0.5, life, age)) * smoothstep(45.0, 130.0, -mvPosition.z);
        vQ = position.xy; vA = vec3(show, aSeed.w * 37.0, age);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${Ye}
      ${Ue}
      uniform vec3 uWhite, uMag; varying vec2 vQ; varying vec3 vA;
      void main() {
        float r = length(vQ) * 2.0, fall = 1.0 - smoothstep(0.15, 1.0, r);
        float sp2 = gsVn(vec3(vQ * 5.0 - vA.y, vA.z * 0.3));
        // near: separate petals, one to a cell, denser toward the core; far (cells under a pixel): a soft body
        vec2 gq = vQ * 15.0 + vA.y; vec2 ci = floor(gq), cf = fract(gq) - 0.5; float fw = clamp(fwidth(gq.x) * 1.6 - 0.25, 0.0, 1.0);
        float h1 = gsH3(vec3(ci.x, ci.y, 3.0)), h2 = gsH3(vec3(ci.x, ci.y, 11.0)), h3 = gsH3(vec3(ci.x, ci.y, 23.0));
        cf -= (vec2(h2, h3) - 0.5) * 0.45; float pa = h1 * 6.2832 + vA.z * (0.6 + 1.6 * h2), pc = cos(pa), ps = sin(pa);
        vec2 pq = vec2(cf.x * pc - cf.y * ps, cf.x * ps + cf.y * pc);
        float flake = (1.0 - smoothstep(0.75, 1.0, pq.x * pq.x / 0.07 + pq.y * pq.y / 0.022)) * step(h3, fall * (0.55 + 0.7 * sp2));
        float a = vA.x * mix(flake * 0.95, fall * (0.3 + 0.4 * sp2) * 0.8, fw);
        if (a < 0.004) discard;
        vec3 c = mix(uWhite, uMag, mix(step(0.8, h2), 0.3, fw)) * (mix(uSunCol, vec3(dot(uSunCol, vec3(0.3, 0.59, 0.11))), 0.75) * 0.42 + uSkyCol * 0.3) * mix(0.8 + 0.4 * h1, 0.9, fw);   // rose-white petals with their own shade, so they read on a pale sky
        gl_FragColor = vec4(c, a);
        #include <fog_fragment>
      }`}),F=new t.Mesh(z,v);return F.frustumCulled=!1,F.renderOrder=2,C.add(F),{grp:C,petals:u,seeds:b,common:x}}function _t(e,s,d,T){const w=Math.round(380*(.5+.5*T)),S=new t.IcosahedronGeometry(1,0),k=new t.InstancedBufferGeometry;k.setAttribute("position",S.attributes.position),k.setAttribute("normal",S.attributes.normal),S.index&&k.setIndex(S.index);const[L,g]=e.seeds(w,6,.42,.55,.6);k.setAttribute("aSeed",L),k.setAttribute("aRnd",g),k.instanceCount=w,k.boundingSphere=new t.Sphere(new t.Vector3(0,30,0),300);const C=new t.ShaderMaterial({fog:!0,uniforms:{...e.common(),uTurf:{value:d[0]}},vertexShader:`
      ${ot}
      varying vec3 vN; varying vec3 vO;
      #include <fog_pars_vertex>
      void main() {
        float life = 4.5 + 1.5 * aSeed.z, age;
        vec4 h = gsLaunch(life, age);
        float E = max(h.z, 0.0), an = (aSeed.x + aRnd.x) / ${M}.0 * 6.2831853;
        vec3 outw = vec3(sin(an), 0.0, cos(an)), up = vec3(0.0, 1.0, 0.0), tang = vec3(cos(an), 0.0, -sin(an));
        vec3 p = outw * (h.x + 1.0 + 4.0 * aRnd.z) + up * (h.y - 3.0 * aRnd.x);
        vec3 v = outw * (5.0 + 15.0 * aRnd.z) * (0.4 + E) + up * (12.0 + 20.0 * aRnd.y) * sqrt(E) + tang * (aSeed.w - 0.5) * 9.0;
        p += v * age - up * 4.9 * age * age;
        float show = step(aRnd.x, E * 1.8) * smoothstep(0.0, 0.15, age) * (1.0 - smoothstep(life - 0.6, life, age));
        float size = gsMinSize(0.55 + 2.3 * aRnd.y * aRnd.y, (modelMatrix * vec4(p, 1.0)).xyz, 1.8) * show;
        vec3 ax = normalize(vec3(aRnd.x - 0.5, 0.35 + aRnd.y, aRnd.z - 0.5));
        float ang = age * (1.5 + 4.0 * aSeed.w), c = cos(ang), s = sin(ang);
        vec3 q = position * vec3(1.0, 0.35 + 0.25 * aSeed.w, 0.8) * (0.62 + 0.7 * fract(sin(dot(position + aRnd, vec3(12.9898, 78.233, 37.719))) * 43758.5453));
        vec3 qr = q * c + cross(ax, q) * s + ax * dot(ax, q) * (1.0 - c);
        vec3 nr = normal * c + cross(ax, normal) * s + ax * dot(ax, normal) * (1.0 - c);
        vN = mat3(modelMatrix) * nr; vO = position;
        vec4 mvPosition = viewMatrix * modelMatrix * vec4(p + qr * size, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${Ye}
      uniform vec3 uTurf; varying vec3 vN; varying vec3 vO;
      void main() {
        float nl = max(dot(normalize(vN + vec3(0.0, 1e-4, 0.0)), uSunDir), 0.0);
        float rootlet = step(0.82, fract(sin(dot(floor(vO * 5.0), vec3(12.9898, 78.233, 37.719))) * 43758.5453));
        vec3 alb = mix(vec3(0.3, 0.18, 0.095), vec3(0.66, 0.6, 0.46), rootlet * 0.7);
        alb = mix(alb, uTurf * (0.75 + 0.45 * rootlet), smoothstep(0.05, 0.4, vO.y));                // a sod: grass on top, soil and roots below
        gl_FragColor = vec4(alb * (uSunCol * (0.12 + 0.88 * nl) + uSkyCol * 1.2), 1.0);
        #include <fog_fragment>
      }`}),x=new t.Mesh(k,C);return x.frustumCulled=!1,e.grp.add(x),S.dispose(),x}function Gt(e,s,d,T,w){const S=[],k=[],L=[];e.gullies.forEach((o,h)=>{const u=S.length/3,B=Math.abs(Math.sin(h*12.9898+1.7)*43758.5453)%1,z=4.5+19*B*B;for(let f=0;f<=40;f++){const a=O(64,-54,f/40),v=s(o,a)+1.1+h%3*.3,F=1+1*$(0,1,(36-a)/80);for(let l=-2;l<=2;l++){const n=o+l*.5*z*F/Math.max(v,30),i=Math.max(v,s(n,a)+.5+h%3*.3)+.5-.12*Math.abs(l);S.push(Math.sin(n)*i,a,Math.cos(n)*i),k.push(l*.5,h,o)}}for(let f=0;f<40;f++)for(let a=0;a<4;a++){const v=u+f*5+a,F=v+5;L.push(v,v+1,F,v+1,F+1,F)}});const b=new t.BufferGeometry;b.setAttribute("position",new t.Float32BufferAttribute(S,3)),b.setAttribute("aW",new t.Float32BufferAttribute(k,3)),b.setIndex(L),b.boundingSphere=new t.Sphere(new t.Vector3(0,0,0),300);const y=[];for(let o=0;o<24;o++)y.push(new t.Vector4(0,0,0,0));const V=new t.ShaderMaterial({fog:!0,side:t.DoubleSide,uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...T,uT:w,uGul:{value:y},uG0:{value:d[0]},uG2:{value:d[2]},uW:{value:d[3]},uM:{value:d[6]}},vertexShader:`
      attribute vec3 aW; uniform vec4 uGul[24]; varying vec4 vG; varying vec3 vW; varying vec3 vN;
      #include <fog_pars_vertex>
      void main() {
        vG = uGul[int(aW.y + 0.5)]; vW = vec3(aW.x, position.y, aW.y);
        vN = mat3(modelMatrix) * vec3(sin(aW.z), 0.35, cos(aW.z));
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${Ye}
      ${Ue}
      uniform float uT; uniform vec3 uG0, uG2, uW, uM; varying vec4 vG; varying vec3 vW; varying vec3 vN;
      void main() {
        float gv2 = fract(vW.z * 0.381 + 0.5);                                     // every gully drains from its own height
        if (vW.y < vG.x - 1.0 || vW.y > vG.y - 24.0 * gv2 * gv2 || vG.z < 0.02) discard;
        float fall = vW.y + uT * (9.0 + 3.0 * fract(vW.z * 0.37));                 // the pattern slides down
        float strand = gsVn(vec3(vW.x * 7.0 + vW.z * 7.0, fall * 0.04, 1.0)) * 0.55 + gsVn(vec3(vW.x * 19.0, fall * 0.11, vW.z)) * 0.45;   // long thin strands: as it drains it thins to threads, never to blocks
        float head = smoothstep(vG.y - 24.0 * gv2 * gv2, vG.y - 24.0 * gv2 * gv2 - 14.0, vW.y);                          // thin at the top where it has drained
        float gv = fract(vW.z * 0.618 + 0.13); float cover = min(1.0, vG.z * 1.6) * (1.0 - 0.75 * vW.x * vW.x) * (0.5 + 0.5 * head) * (0.35 + 0.65 * gv);
        if (strand > cover * 0.95) discard;
        vec3 c = mix(uG0 * 0.85, uG2, smoothstep(0.3, 0.95, strand / max(cover, 0.05)) * 0.7);
        float fl = gsVn(vec3(vW.x * 9.0 + vW.z * 3.0, fall * 0.9, 3.0));
        c = mix(c, uW * 0.85, smoothstep(0.62, 0.7, fl)); c = mix(c, uM * 0.85, smoothstep(0.2, 0.16, fl) * 0.8);
        float nl = max(dot(normalize(vN), uSunDir), 0.0);
        gl_FragColor = vec4(c * (uSunCol * (0.16 + 0.44 * nl) + uSkyCol * 0.8), 1.0);
        #include <fog_fragment>
      }`});return{mesh:new t.Mesh(b,V),gul:y}}async function Ut(e,s={}){const d=(s.palette||ct).map(U=>new t.Color(U));for(;d.length<7;)d.push(new t.Color(ct[d.length]));const T=ce(s.detail??e.quality?.detail??1,.6,1),w=e.rng.fork?e.rng.fork("stillstone"):e.rng,S=e.noise,{mergeGeometries:k}=await import("three/addons/utils/BufferGeometryUtils.js"),L=new t.Group;L.name="stillstone";const g={value:0},C={value:0},x={value:1080},b=Ct(d),y=Mt(w,S);await e.yield?.();const V=new Float32Array(D*ve);for(let U=0;U<ve;U++){const Q=Ae+(He-Ae)*U/(ve-1);for(let ae=0;ae<D;ae++)V[U*D+ae]=y.surfR(ae/D*q,Q);U%2===1&&await e.yield?.()}const W=()=>e.yield?.(),o=await bt(y,d,w.range(0,50),V,W,b.uSunDir);L.add(o.mesh),await e.yield?.();const h=At(o.torR);await e.yield?.(),L.add(new t.Mesh(await zt(w,S,h,k,W),o.mesh.material)),await e.yield?.();{const U=xt(((e.seed|0)^19479)+2609),Q=64,ae=new Float32Array(Q*6),_=[],te=new t.Vector3,se=new t.Vector3,pe=new t.Vector3,de=new t.Matrix4;for(let le=0;le<Q*6;le++)ae[le]=U();for(let le=0;le<Q;le++){const ge=le*6,Ve=(le+ae[ge])/Q*q,be=Math.sin(Ve),he=Math.cos(Ve),Ce=(5+10*Math.pow(ae[ge+2],1.3))*(1-.65*$(.5,.92,he)),We=Ce*(.6+.35*(ae[ge+4]*5.3%1)),je=Ce*(.6+.35*(ae[ge+5]*7.7%1)),ke=Math.max(2.5,.35*je),_e=Pe=>(o.torR(Ve,Pe-ke)-o.torR(Ve,Pe+ke))/(2*ke);let Be=O(-30,44,ae[ge+1]);for(let Pe=1;Pe<90&&_e(Be)<.7;Pe++)Be+=Pe%2?-Pe:Pe;const re=Math.max(_e(Be),.7),Te=Math.hypot(1,re),Ne=1/Te,De=re/Te,at=We*(.5-O(.15,.35,ae[ge+3])),st=o.torR(Ve,Be)+Ne*at,Xe=be*st,Ze=Be+De*at,Je=he*st;Oe(_,S,Xe,Ze,Je,Ce,We,je,0,0,.82);const nt=ae[ge+4]-.5,qe=Math.cos(nt),Ee=Math.sin(nt),rt=(ae[ge+5]-.5)*.7,it=Math.cos(rt),lt=Math.sin(rt);te.set(he*qe+be*De*Ee,-Ne*Ee,-be*qe+he*De*Ee),se.set(be*Ne,De,he*Ne),pe.set(-he*Ee+be*De*qe,-Ne*qe,be*Ee+he*De*qe),de.makeBasis(te.clone().multiplyScalar(it).addScaledVector(se,lt),se.clone().multiplyScalar(it).addScaledVector(te,-lt),pe),_[le].translate(-Xe,-Ze,-Je).applyMatrix4(de).translate(Xe,Ze,Je),le%16===15&&await e.yield?.()}const we=k(_,!1);we.boundingSphere=new t.Sphere(new t.Vector3(0,7,0),230);const Fe=new t.Mesh(we,o.mesh.material);Fe.name="foot-clitter",L.add(Fe)}await e.yield?.();const u=await Lt(w,S,h,d,T,C,W);L.add(u.mesh),await e.yield?.();const B=Math.sin(ye),z=Math.cos(ye),f=Math.cos(20*Math.PI/180),a=Math.sin(20*Math.PI/180),v=new t.Vector3(X.x,X.y+9,X.z),F=new t.Vector3(-B*f,a,-z*f),l=F.clone().negate(),n=(U,Q=0)=>v.clone().addScaledVector(l,U).add(new t.Vector3(0,Q,0)),i=Rt(o.footSeg);let r=yt(w);i.setSampler(r);const p=Bt(d,o.footR,s.skirtRadius??640,s.skirt!==!1,C,w.range(0,50),b,x,e.core?.makeRng?e.core.makeRng(((e.seed|0)^965)+77):w,o.footSeg,o.lipRock);{const U=p.lump=new Float64Array(M*ue);for(let Q=0;Q<M;Q++)for(let ae=0;ae<ue;ae++){const _=pt(ae);_>xe&&(U[Q*ue+ae]=.45*(.6+1.5*S.n2(Q*.83+7,ae*1.37)+2.2*S.n2(Q*.29+3,ae*.41))*$(xe,xe+.12,_))}}L.add(p.grp),await e.yield?.();const c=new Uint16Array(M*Le*4),A=new t.DataTexture(c,M,Le,t.RGBAFormat,t.HalfFloatType);A.minFilter=A.magFilter=t.NearestFilter,A.needsUpdate=!0;const G=Pt(w,d,T,b,g,{value:A},x,v,l);await e.yield?.(),_t(G,w,d,T),L.add(G.grp),await e.yield?.();const R=Gt(y,o.torR,d,b,g);L.add(R.mesh),await e.yield?.();const J=new t.Vector2;G.petals.onBeforeRender=U=>{U.getDrawingBufferSize(J),x.value=J.y};const I=new Float32Array(M),Y=new Float32Array(M),j=new Float32Array(M),P=new Float32Array(M),H=new Float32Array(M),N=new Float32Array(M),E=new Float32Array(M),Z=new Int32Array(Le).fill(-1e9),ee=new Float32Array(M*Le),oe=t.DataUtils.toHalfFloat,K=y.gullies.map(U=>(Math.round(U/q*M)%M+M)%M),ne=36,fe=new Int32Array(ne).fill(-1e9),ze=new Float32Array(ne*24);let Me=null;const Se=U=>{g.value=U,i.state(U,I,Y,j),Tt(p,r,U,I,Y,j,S,P);const Q=Math.floor(U/$e);let ae=!1;for(let _=Q-Le+1;_<=Q;_++){const te=(_%Le+Le)%Le;if(Z[te]!==_){i.state(_*$e,H,N,E),Z[te]=_,ae=!0;for(let se=0;se<M;se++){const pe=(te*M+se)*4,de=(E[(se+M-1)%M]+2*E[se]+E[(se+1)%M])/4*dt(se),we=H[se]+16*de;c[pe]=oe(N[se]),c[pe+1]=oe(we),c[pe+2]=oe(de),c[pe+3]=oe(H[se]),ee[te*M+se]=we}}}ae&&(A.needsUpdate=!0);for(let _=Q-ne+1;_<=Q;_++){const te=(_%ne+ne)%ne;if(fe[te]!==_){fe[te]=_;for(let se=0;se<K.length;se++)ze[te*24+se]=i.reach(K[se],_*$e)}}for(let _=0;_<K.length;_++){const te=K[_];let se=-1e9,pe=Q;for(let Fe=Q-ne+1;Fe<=Q;Fe++){const le=ze[(Fe%ne+ne)%ne*24+_];le>se&&(se=le,pe=Fe)}const de=Math.min(63,se),we=Math.max(0,U-pe*$e);R.gul[_].set(I[te],de,(1-$(13,26,we))*$(2,9,de-I[te]),we)}};return Se(0),{object:L,radius:190,height:280,center:new t.Vector3(0,100,0),anchors:{portalSeat:{position:v.clone(),facing:l.clone(),travel:F.clone(),radius:7,tiltDeg:20},flyThrough:[n(190),n(130),n(80),n(40),n(15),n(0)],archFeet:new t.Vector3(X.x,X.y-5,X.z),bay:v.clone().addScaledVector(F,16),summit:new t.Vector3(0,280,0),upstream:new t.Vector3(0,0,1),wind:new t.Vector3(.24,0,-.97),viewpoints:{reveal:new t.Vector3(-420,70,960),surf:new t.Vector3(-330,45,420),waterfalls:new t.Vector3(-260,40,250)},pines:u.pines.map(U=>new t.Vector3(U.x,U.y,U.z))},setProgress(U){Me=U},setGroundSampler(U){r=U||r,i.setSampler(r),Z.fill(-1e9),fe.fill(-1e9)},lip:{texture:p.lipTex,segments:M,rows:ue,riseRows:8,riseFrac:.45},setShade(U){p.shade=U||null},setMeadow(U){U&&b.uTone.value.copy(U)},setLight(U,Q,ae){U&&b.uSunDir.value.copy(U).normalize(),Q&&b.uSunCol.value.copy(Q),ae&&b.uSkyCol.value.copy(ae)},contact(U){const Q=(Math.round(U/q*M)%M+M)%M;return{y:I[Q],r:Y[Q],lip:j[Q]}},update(U,Q,ae){C.value=Q,Se(Me===null?Q:Me)},dispose(){A.dispose(),p.lipTex.dispose()},ground:!1,groundY:-40}}export{Ut as buildHero};
