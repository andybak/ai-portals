import*as o from"three";const I={R:30,WALL_H:16,RING_Y:24,RING_R:6,POLES:81,POLE_LEN:25.4,DOOR_W:7.3,DOOR_Z:29.6,GATE_Z:116,POST_X:6.3,POST_S:.74},U=I.R,Qe=I.WALL_H,we=I.RING_Y,ae=I.POLES,B=(r,i,a)=>{const e=Math.min(1,Math.max(0,(a-r)/(i-r)));return e*e*(3-2*e)},fe=(r,i,a)=>r+(i-r)*a,ve=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uGndCol, uFeltWarm, uFeltCool, uFogCol, uBeamDir, uBeamFoot, uLampCol, uLampC;
uniform vec4 uLamp[7];
uniform float uWallC, uRoofC, uFogDen, uTime, uCloudAmt, uCloudSpd, uSunGate, uBeamOn, uBeamK, uFeltT;
float gHash(vec2 p){ p = fract(p * vec2(.1031, .1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.y); }
float gNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(gHash(i), gHash(i + vec2(1., 0.)), f.x), mix(gHash(i + vec2(0., 1.)), gHash(i + vec2(1., 1.)), f.x), f.y); }
float gFbm(vec2 p){ return gNoise(p) * .55 + gNoise(p * 2.13 + 7.1) * .3 + gNoise(p * 4.7 + 3.3) * .15; }
float gerCloud(vec2 xz){ float n = gFbm(xz * .0032 + uTime * uCloudSpd * vec2(.011, .004)); return 1. - uCloudAmt * smoothstep(.46, .7, n); }
// the beam: the roof ring carried down the beam's own direction (a little steeper than the sun stands outside, so that
// it lands on the bed and not high on the wall); a soft penumbra, so that its oval has a glowing rim
float gerBeam(vec3 P){ float t = (24.2 - P.y) / max(uBeamDir.y, .05); vec2 q = P.xz + uBeamDir.xz * t;
  return smoothstep(6.25, 4.7, length(q)) * step(P.y, 24.2); }
float gerInside(vec3 P){ return smoothstep(31.6, 30.7, length(P.xz)); }
// the butter lamps: seven small warm pools (xyz the flame, w its flicker) and the soft glow of the whole row
vec3 gerLamps(vec3 N, vec3 P){
  vec3 dc = uLampC - P; float c2 = dot(dc, dc), s = 0.;
  if (c2 > 520.) return vec3(0.);
  for (int i = 0; i < 7; i++) {
    vec3 d = uLamp[i].xyz - P; float d2 = dot(d, d), q = d2 * .36;
    s += uLamp[i].w * (.25 + .75 * max(dot(N, d * inversesqrt(d2 + .01)), 0.)) / (1. + q * q);
  }
  s += .5 * (.35 + .65 * max(dot(N, dc * inversesqrt(c2 + .01)), 0.)) / (1. + c2 * c2 * .0011);
  return uLampCol * (s * (1. - smoothstep(380., 520., c2)));
}
// Outdoors: sun and sky. Indoors, as the felts close: the glow of the felt (warm and strong from the sun's side and the
// roof, cool and softer from the far side, so every object has a lit and a shaded face but none stands in the dark: the
// room is a white shell and its light goes round), the one beam, the warm light thrown back by the beam's oval, and
// the butter lamps.
vec3 gerAmb(vec3 N, vec3 P, float ins){
  vec2 h = normalize(uSunDir.xz + vec2(1e-5, 0.));
  float clo = ins * (.45 * uWallC + .55 * uRoofC);
  vec3 hemi = mix(uGndCol, uSkyCol, N.y * .5 + .5);
  float w = clamp(.5 + .5 * dot(N.xz, h) + .24 * N.y, 0., 1.); w = w * w * (3. - 2. * w);
  float bb = clamp(dot(P.xz, h) / 30., -1., 1.);                         // nearer the sun's wall: more of its warm light, a little less of the far wall's cool
  vec3 felt = mix(uFeltCool * (.94 - .16 * bb), uFeltWarm * (.8 + .3 * bb), w);
  return mix(hemi, felt, clo);
}
vec3 gerDirect(vec3 N, vec3 P, float ao, float ins){
  vec2 h = normalize(uSunDir.xz + vec2(1e-5, 0.));
  float b = dot(P.xz, h), disc = max(b * b - dot(P.xz, P.xz) + 900., 0.);
  float hW = P.y + (sqrt(disc) - b) * uSunDir.y / max(length(uSunDir.xz), .05);
  float wallSh = smoothstep(17., 15., hW) * uWallC;
  float roofIn = ins * uRoofC;
  float vis = mix(1., mix(1. - wallSh, gerBeam(P), uRoofC), ins);
  float cl = mix(gerCloud(P.xz), gerCloud(vec2(0.)), ins);
  float ndl = mix(max(dot(N, uSunDir), 0.), max(dot(N, uBeamDir), 0.) * uBeamK, roofIn);
  vec3 tf = uBeamFoot - P; float d2 = dot(tf, tf);
  float bnc = uBeamOn * ins * (.3 + .7 * max(dot(N, tf * inversesqrt(d2 + .01)), 0.)) / (1. + d2 / 110.);
  // indoors the sun reaches things only as the beam: gold, and held low enough that its oval keeps its colour
  vec3 key = uSunCol * mix(vec3(1.), vec3(.74, .58, .37), roofIn);
  return key * (ndl * vis * cl * uSunGate) + uSunCol * vec3(.2, .14, .075) * (bnc * cl * ao) + gerLamps(N, P);
}
vec3 gerLightIn(vec3 alb, vec3 N, vec3 P, float ao, float ins){
  return alb * (gerAmb(N, P, ins) * ao + gerDirect(N, P, ao, ins));
}
vec3 gerLight(vec3 alb, vec3 N, vec3 P, float ao){ return gerLightIn(alb, N, P, ao, gerInside(P)); }
vec3 gerFog(vec3 c, float d){ return mix(uFogCol, max(c, vec3(0.)), exp(-max(d, 0.) * uFogDen)); }      // max: multisampling can extrapolate the depth below zero on an edge-on triangle
`;function ze(){const r=(a,e,l)=>({value:new o.Vector3(a,e,l)}),i=a=>({value:a});return{uSunDir:r(-.9135,.4067,0),uSunCol:r(3.2,2.3,1.2),uSkyCol:r(.5,.62,.9),uGndCol:r(.4,.33,.2),uFeltWarm:r(.86,.72,.5),uFeltCool:r(.6,.6,.68),uFogCol:r(.8,.7,.5),uLampCol:r(1.5,.74,.22),uLampC:r(0,-500,0),uLamp:{value:Array.from({length:7},()=>new o.Vector4(0,-500,0,0))},uBeamDir:r(-.8192,.5736,0),uBeamFoot:r(29,4,0),uBeamOn:i(0),uBeamK:i(1.2),uFeltT:i(1),uWallC:i(0),uRoofC:i(0),uFogDen:i(6e-4),uTime:i(0),uCloudAmt:i(.5),uCloudSpd:i(1),uSunGate:i(1)}}const We=`
varying vec3 vW, vN, vC, vL, vNl; varying vec2 vUv; varying float vD;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal);
  vL = position; vNl = normal;                                    // the paint and the planks belong to the piece: they travel with it
  vC = color; vUv = uv; vec4 mv = viewMatrix * w; vD = -mv.z; gl_Position = projectionMatrix * mv;
}`,De=`
uniform sampler2D uMap; uniform float uGrain, uGloss;
varying vec3 vW, vN, vC, vL, vNl; varying vec2 vUv; varying float vD;
${ve}
void main(){
  vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
  vec3 alb = vC * texture2D(uMap, vUv).rgb;
  float em = step(1.6, max(vC.r, max(vC.g, vC.b)));
  float pnt = step(.126, vUv.y);                                   // painted ornament from the atlas
  float soft = step(.06, vUv.x) * (1. - pnt);                      // cloth, hide, fur, iron, brass, clay: no planks
  float wood = (1. - soft) * (1. - em);
  // breakup: long grain along the dominant axis, soft blotches, fine speckle, so nothing is a flat CAD colour up close
  vec3 q = vL * uGrain; vec3 an = abs(vNl);
  vec2 g2 = an.y > .6 ? q.xz : (an.x > an.z ? q.zy : q.xy);
  float grain = gNoise(g2 * vec2(1.3, 9.)) * .6 + gNoise(g2 * vec2(7., 2.3) + 5.) * .4;
  float blot = gFbm(g2 * .35 + 11.), fine = gNoise(g2 * 23.);
  // planks: every board its own tone (some redder, some sun-bleached), a dark joint between two boards
  float bw = 1.3, bi = floor(g2.y / bw), bh = gHash(vec2(bi, floor(g2.x / 12. + bi * .37) + 3.));
  float sd = abs(fract(g2.y / bw) - .5) * bw, joint = smoothstep(bw * .5 - .06, bw * .5 - .012, sd);
  alb *= mix(1., .78 + .4 * bh, wood * (1. - .5 * pnt));
  alb = mix(alb, alb * vec3(1.1, .93, .8), wood * (1. - pnt) * smoothstep(.55, .8, bh) * .7);
  alb = mix(alb, alb * vec3(.93, 1., 1.08) + .02, wood * (1. - pnt) * smoothstep(.3, .1, bh) * .5);
  alb *= 1. - wood * joint * mix(.55, .25, pnt);
  alb *= mix(1., (.74 + .3 * grain) * (.84 + .28 * blot) * (.92 + .16 * fine), 1. - em);
  // wear: old paint rubbed thin in patches (darker wood shows through), and dirt gathered low down
  float rub = smoothstep(.56, .84, gFbm(g2 * .9 + 3.) * .72 + .28 * grain);
  alb = mix(alb, alb * vec3(.56, .46, .4), wood * .5 * rub);
  alb = mix(alb, alb * vec3(.5, .42, .36), (1. - em) * .5 * smoothstep(.62, .9, gFbm(g2 * 1.7 + 3.)) * smoothstep(7., 0., vW.y));
  float gi = gerInside(vW), clo = gi * (.45 * uWallC + .55 * uRoofC);
  // things stand in their own shade: the nearer the floor, the less of the room's glow reaches them
  float ao = mix(1., .34 + .66 * smoothstep(0., 5.5, vW.y), clo) * mix(1., .72, (1. - clo) * (1. - smoothstep(0., 3., vW.y)));
  vec3 c = gerLightIn(alb, N, vW, ao, gi);
  // lacquer: painted wood, brass and iron catch the glowing wall (indoors) or the sun (outdoors): a broad soft sheen
  // and a small hard highlight, both dulled where the paint is rubbed
  vec3 V = normalize(cameraPosition - vW); float fr = 1. - max(dot(N, V), 0.); fr *= fr;
  c += alb * fr * .2 * mix(uSkyCol, uFeltWarm, gi * uRoofC);
  vec2 h = normalize(uSunDir.xz + vec2(1e-5, 0.));
  vec3 Lg = normalize(mix(uSunDir, vec3(h.x, .45, h.y), gi * uRoofC));
  float rv = max(dot(reflect(-V, N), Lg), 0.), rv2 = rv * rv, rv8 = rv2 * rv2 * rv2 * rv2;
  float sp = (rv8 * rv2 * .7 + rv8 * rv8 * rv8 * rv8 * rv8 * 1.1) * uGloss * (1. - .6 * rub * wood) * (1. - .5 * soft);
  c += (alb * .55 + .1) * mix(uSunCol * .5 * (1. - uWallC * gi), uFeltWarm * 1.5, gi * uRoofC) * sp * mix(1., ao, .6);
  c = mix(c, vC * .5, em);
  gl_FragColor = vec4(gerFog(c, vD), 1.);
}`;function Te(r,i,a={}){return new o.ShaderMaterial({uniforms:{...r,uMap:{value:i},uGrain:{value:a.grain??1},uGloss:{value:a.gloss??.42}},vertexShader:We,fragmentShader:De,vertexColors:!0,side:a.side??o.FrontSide})}const ge=new o.Color,Ne=new o.Matrix4,ke=new o.Quaternion,Ge=new o.Euler,Ee=new o.Vector3,Ie=new o.Vector3,Pe=new o.Matrix3,et=new o.Vector3,Le=[.03,.04],Be=[.09,.04];function be(){const r=[],i=[],a=[],e=[],l=[];let s=0,u=0;const t=(n,d,f)=>{const b=new d(f);let x=0;for(const p of n)b.set(p,x),x+=p.length;return b},v={add(n,d={}){const f=n.attributes.position,b=n.attributes.normal,x=n.attributes.color,p=n.attributes.uv,w=n.index,g=n.attributes.shade,y=d.m?Be:Le,c=d.p||[0,0,0],h=d.r||[0,0,0],m=d.s==null?[1,1,1]:typeof d.s=="number"?[d.s,d.s,d.s]:d.s;Ne.compose(Ee.set(c[0],c[1],c[2]),ke.setFromEuler(Ge.set(h[0],h[1],h[2])),Ie.set(m[0],m[1],m[2])),Pe.getNormalMatrix(Ne),Array.isArray(d.c)?ge.setRGB(d.c[0],d.c[1],d.c[2]):ge.set(d.c??"#ffffff");const N=ge.r,z=ge.g,L=ge.b,A=d.grad,T=d.uv,R=d.gain??1,W=f.count,ee=f.array,de=b.array,se=x&&d.keep?x.array:null,Z=x?x.itemSize:3,X=p?p.array:null,ue=g?g.array:null,D=Ne.elements,V=Pe.elements,M=A?1/(A[1]-A[0]):0,C=new Float32Array(W*3),O=new Float32Array(W*3),k=new Float32Array(W*3),q=new Float32Array(W*2);for(let G=0,F=0;G<W;G++,F+=3){const H=ee[F],Y=ee[F+1],K=ee[F+2],me=de[F],Q=de[F+1],te=de[F+2];C[F]=D[0]*H+D[4]*Y+D[8]*K+D[12],C[F+1]=D[1]*H+D[5]*Y+D[9]*K+D[13],C[F+2]=D[2]*H+D[6]*Y+D[10]*K+D[14];const he=V[0]*me+V[3]*Q+V[6]*te,J=V[1]*me+V[4]*Q+V[7]*te,ie=V[2]*me+V[5]*Q+V[8]*te,le=1/(Math.sqrt(he*he+J*J+ie*ie)||1);O[F]=he*le,O[F+1]=J*le,O[F+2]=ie*le;let j=R;if(A){const E=(Y-A[0])*M;j*=A[2]+(A[3]-A[2])*(E<0?0:E>1?1:E)}if(ue&&(j*=ue[G]),se){const E=G*Z;k[F]=se[E]*N*j,k[F+1]=se[E+1]*z*j,k[F+2]=se[E+2]*L*j}else k[F]=N*j,k[F+1]=z*j,k[F+2]=L*j;const _=G*2;T&&X?(q[_]=T[0]+(T[2]-T[0])*X[_],q[_+1]=T[1]+(T[3]-T[1])*X[_+1]):d.keep&&X?(q[_]=X[_],q[_+1]=X[_+1]):(q[_]=y[0],q[_+1]=y[1])}let $;if(w){const G=w.array,F=G.length;$=new Uint32Array(F);for(let H=0;H<F;H++)$[H]=G[H]+s}else{$=new Uint32Array(W);for(let G=0;G<W;G++)$[G]=G+s}return r.push(C),i.push(O),a.push(k),e.push(q),l.push($),s+=W,u+=$.length,n.dispose(),v},get triangles(){return u/3},build(){const n=new o.BufferGeometry;return n.setAttribute("position",new o.BufferAttribute(t(r,Float32Array,s*3),3)),n.setAttribute("normal",new o.BufferAttribute(t(i,Float32Array,s*3),3)),n.setAttribute("color",new o.BufferAttribute(t(a,Float32Array,s*3),3)),n.setAttribute("uv",new o.BufferAttribute(t(e,Float32Array,s*2),2)),n.setIndex(new o.BufferAttribute(t(l,Uint32Array,u),1)),n.computeBoundingSphere(),n},async buildAsync(n){const d=new o.BufferGeometry;return d.setAttribute("position",new o.BufferAttribute(t(r,Float32Array,s*3),3)),await n(),d.setAttribute("normal",new o.BufferAttribute(t(i,Float32Array,s*3),3)),await n(),d.setAttribute("color",new o.BufferAttribute(t(a,Float32Array,s*3),3)),d.setAttribute("uv",new o.BufferAttribute(t(e,Float32Array,s*2),2)),await n(),d.setIndex(new o.BufferAttribute(t(l,Uint32Array,u),1)),await n(),d.computeBoundingSphere(),await n(),d}};return v}function P(r,i,a,e=.12){const l=new o.BoxGeometry(r,i,a,3,3,3).toNonIndexed(),s=l.attributes.position,u=l.attributes.normal,t=l.attributes.uv,v=[r/2,i/2,a/2],n=[0,0,0],d=new Float32Array(s.count);for(let f=0;f<s.count;f++){n[0]=s.getX(f),n[1]=s.getY(f),n[2]=s.getZ(f);const b=Math.abs(u.getX(f)),x=Math.abs(u.getY(f)),p=b>.5?0:x>.5?1:2;let w=!1;for(let g=0;g<3;g++){if(g===p)continue;const y=Math.min(e,v[g]*.45),c=n[g]/v[g];Math.abs(c)>.9?w=!0:n[g]=Math.sign(c)*(v[g]-y)}w&&(n[p]-=Math.sign(n[p])*Math.min(e,v[p]*.45)),s.setXYZ(f,n[0],n[1],n[2]),d[f]=w?.5:1}l.setAttribute("shade",new o.BufferAttribute(d,1));for(let f=0;f<t.count;f++){const b=x=>x<.2?0:x>.8?1:(x-.3333333333333333)*3;t.setXY(f,Math.min(1,Math.max(0,b(t.getX(f)))),Math.min(1,Math.max(0,b(t.getY(f)))))}return l.computeVertexNormals(),l}const Ae=(r,i,a,e=10,l=!1)=>new o.CylinderGeometry(r,i,a,e,1,l),Oe=(r,i=12)=>new o.LatheGeometry(r.map(a=>new o.Vector2(a[0],a[1])),i),ye={medallion:[0,.5,.5,1],door:[.5,.5,1,1],band:[0,.375,1,.5],quilt:[0,.125,.5,.375],lid:[.5,.125,1,.375]};function Ve(r){const a=document.createElement("canvas");a.width=a.height=1024;const e=a.getContext("2d"),{wood:l,woodDark:s,blue:u,green:t,white:v,gold:n,red:d}=r;e.fillStyle="#ffffff",e.fillRect(0,0,1024,1024);const f=(c,h)=>{e.strokeStyle=c,e.lineWidth=h,e.lineJoin="round",e.lineCap="round",e.stroke()},b=(c,h,m,N,z)=>{e.beginPath(),e.moveTo(c+z,h),e.arcTo(c+m,h,c+m,h+N,z),e.arcTo(c+m,h+N,c,h+N,z),e.arcTo(c,h+N,c,h,z),e.arcTo(c,h,c+m,h,z),e.closePath()},x=(c,h,m,N,z)=>{e.save(),e.translate(c,h),e.rotate(Math.PI/4);const L=m*.42,A=m*.13;for(let T=0;T<2;T++)for(let R=-1;R<=1;R++)for(let W=0;W<2;W++)e.beginPath(),W===0?(e.moveTo(-m*.92,R*L),e.lineTo(m*.92,R*L)):(e.moveTo(R*L,-m*.92),e.lineTo(R*L,m*.92)),f(T===0?s:W===0?N:z,T===0?A*1.7:A);for(let T=0;T<4;T++){e.rotate(Math.PI/2);for(const R of[-.5,.5])e.beginPath(),e.arc(R*L,-m*.92,L/2,Math.PI,0),f(s,A*1.7),e.beginPath(),e.arc(R*L,-m*.92,L/2,Math.PI,0),f(T%2?N:z,A)}e.restore()},p=(c,h,m,N,z)=>{e.save(),e.translate(c,h),e.scale(m,N),e.beginPath(),e.moveTo(0,70),e.bezierCurveTo(0,20,20,0,70,0),f(z,9),e.beginPath(),e.arc(34,34,16,.6,5.4),f(z,7),e.beginPath(),e.arc(66,20,9,1.2,6.4),f(z,5),e.beginPath(),e.arc(20,66,9,0,5.2),f(z,5),e.restore()},w=(c,h,m,N,z)=>{e.fillStyle=l,e.fillRect(c,h,m,N);const L=e.createRadialGradient(c+m/2,h+N/2,m*.1,c+m/2,h+N/2,m*.75);L.addColorStop(0,"rgba(255,200,120,0.22)"),L.addColorStop(1,"rgba(60,10,0,0.28)"),e.fillStyle=L,e.fillRect(c,h,m,N),b(c+14,h+14,m-28,N-28,10),f(u,16),b(c+29,h+29,m-58,N-58,8),f(v,3),b(c+40,h+40,m-80,N-80,8),f(t,4);for(const[R,W]of[[1,1],[-1,1],[1,-1],[-1,-1]])p(c+m/2-R*(m/2-62),h+N/2-W*(N/2-62),R,W,n);const A=c+m/2,T=h+N/2;if(z===0){e.beginPath(),e.arc(A,T,m*.3,0,6.2832),e.fillStyle=u,e.fill(),f(n,10),e.beginPath(),e.arc(A,T,m*.255,0,6.2832),f(v,4),x(A,T,m*.15,n,t);for(let R=0;R<12;R++){const W=R*Math.PI/6;e.beginPath(),e.arc(A+Math.cos(W)*m*.345,T+Math.sin(W)*m*.345,9,0,6.2832),e.fillStyle=R%2?n:v,e.fill()}}else if(z===1){for(const R of[-.2,.2])e.save(),e.translate(A,T+R*N),e.rotate(Math.PI/4),e.fillStyle=u,e.fillRect(-m*.14,-m*.14,m*.28,m*.28),e.beginPath(),e.rect(-m*.14,-m*.14,m*.28,m*.28),f(n,8),e.restore(),x(A,T+R*N,m*.085,n,v);e.beginPath(),e.moveTo(c+60,T),e.lineTo(c+m-60,T),f(n,7),e.beginPath(),e.arc(A,T,20,0,6.2832),e.fillStyle=d,e.fill(),f(n,5)}else b(c+70,h+60,m-140,N-120,30),f(n,6),x(A,T,N*.2,u,t)};w(0,0,512,512,0),w(512,0,512,512,1),w(512,640,512,256,2),e.fillStyle=l,e.fillRect(0,512,1024,128),e.fillStyle=u,e.fillRect(0,512,1024,18),e.fillRect(0,622,1024,18),e.fillStyle=v,e.fillRect(0,530,1024,4),e.fillRect(0,618,1024,4),e.fillStyle=t,e.fillRect(0,536,1024,4),e.fillRect(0,612,1024,4);for(let c=0;c<16;c++){const h=c*64,m=552;e.beginPath(),e.moveTo(h,m+48),e.lineTo(h,m),e.lineTo(h+48,m),e.lineTo(h+48,m+34),e.lineTo(h+16,m+34),e.lineTo(h+16,m+17),e.lineTo(h+32,m+17),e.moveTo(h,m+48),e.lineTo(h+64,m+48),f(n,6)}const g=[v,l,v,n,d,v,u,v,l,n,v,d];for(let c=0;c<12;c++)e.fillStyle=g[c],e.fillRect(c*512/12,640,512/12+1,256);e.fillStyle="rgba(70,40,20,0.18)",e.fillRect(0,640,512,256),e.fillStyle="rgba(40,20,10,0.3)";for(let c=1;c<12;c++)e.fillRect(c*512/12-1,640,2,256);e.fillStyle="rgba(40,20,10,0.35)";for(let c=0;c<9;c++)for(let h=0;h<64;h++)e.fillRect(h*8+c%2*4,652+c*29,4,2);e.fillStyle="#ffffff",e.fillRect(0,896,1024,128);const y=new o.CanvasTexture(a);return y.colorSpace=o.SRGBColorSpace,y.wrapS=o.RepeatWrapping,y.anisotropy=4,y.generateMipmaps=!0,y.minFilter=o.LinearMipmapLinearFilter,y}const S={ARC0:7.8,S0:1.087,NJE:28,NJW:25,LEN:20.3,SIN:.6157,FOLD:.1,XTR:6};S.ENDE=S.ARC0+3*S.NJE*S.S0,S.ENDW=S.ARC0+3*S.NJW*S.S0;const ne="varying vec3 vW, vN; varying vec3 vT; varying float vD;";async function _e(r,i){const l=[],s=[],u=[];let t=0;const v=[];for(const p of[1,-1]){const w=p>0?S.NJE:S.NJW;for(let g=0;g<3;g++)for(let y=g===0?-S.XTR:0,c=g===2?w+S.XTR:w;y<c;y++)for(const h of[1,-1])v.push([p,g,y,h]);v.push([p,0,-100,0],[p,2,100,0])}let n=0;for(const[p,w,g,y]of v){(++n&63)===0&&await i();for(let c=0;c<=6;c++)for(let h=0;h<5;h++){const m=h/5*6.2832;l.push(Math.cos(m),c/6,Math.sin(m)),s.push(p,w,g,y)}for(let c=0;c<6;c++)for(let h=0;h<5;h++){const m=t+c*5+h,N=t+c*5+(h+1)%5;u.push(m,m+5,N,N,m+5,N+5)}t+=35}for(const p of[1,-1]){const w=p>0?S.NJE:S.NJW;for(let g=0;g<3;g++)for(let y=0;y<w;y++)l.push(0,0,0,0,1,0,0,0,0,0,1,0),s.push(p,g,y,2,p,g,y,2,p,g,y+1,2,p,g,y+1,2),u.push(t,t+2,t+1,t+1,t+2,t+3),t+=4}await i();const d=new o.BufferGeometry;d.setAttribute("position",new o.Float32BufferAttribute(l,3)),d.setAttribute("aL",new o.Float32BufferAttribute(s,4)),await i(),d.setIndex(u),d.boundingSphere=new o.Sphere(new o.Vector3(0,10,0),40);const f={...r,uOpenE:{value:new o.Vector3(.1,.1,.1)},uOpenW:{value:new o.Vector3(.1,.1,.1)},uWood:{value:new o.Color("#b99a68")}},b=new o.ShaderMaterial({uniforms:f,side:o.DoubleSide,vertexShader:`
attribute vec4 aL; uniform vec3 uOpenE, uOpenW; ${ne}
void main(){
  float side = aL.x, sec = aL.y, j = aL.z, fam = aL.w;
  vec3 op = side > 0. ? uOpenE : uOpenW; float nj = side > 0. ? ${S.NJE}. : ${S.NJW}.;
  float f = sec < .5 ? op.x : (sec < 1.5 ? op.y : op.z);
  float prev = (sec > .5 ? op.x : 0.) + (sec > 1.5 ? op.y : 0.);
  float s0 = ${S.ARC0} + (prev * nj + (j + .5) * f) * ${S.S0};
  float sinT = ${S.SIN} * f, cosT = sqrt(1. - sinT * sinT);
  float t = (position.y - .5) * ${S.LEN};
  float lim = ${S.ARC0} + (op.x + op.y + op.z) * nj * ${S.S0};          // where this side ends now (it grows as the sections open)
  float post = 1. - abs(fam), famS = fam + post;
  float arc = s0 + fam * t * sinT, arcC = clamp(arc, ${S.ARC0}, lim);
  t += (arcC - arc) / (famS * max(sinT, .02));
  if (post > .5) { arcC = j < 0. ? ${S.ARC0} - .16 : lim + .16; t = (position.y - .5) * ${S.LEN} * 1.03; sinT = 0.; }
  float y = (t + ${(S.LEN/2).toFixed(2)}) * cosT, ang = side * arcC / 30.;
  vec3 rad = vec3(sin(ang), 0., cos(ang)), tn = vec3(cos(ang), 0., -sin(ang)) * side;
  vec3 wid = tn * mix(cosT, 1., post) - vec3(0., fam * sinT, 0.);
  vec3 nn = wid * position.x + rad * position.z;
  vec3 P = rad * (30. + fam * .15 - post * .12) + vec3(0., max(y, 0.), 0.) + (wid * (position.x * 1.25) + rad * position.z) * (.085 + .1 * post);
  vW = P; vN = normalize(nn + vec3(0., 1e-4, 0.)); vT = vec3(t, j + sec * 31. + fam * 7., side * (1. + post));
  if (fam > 1.5) {
    // the belt lies inside the laths at the wall head; it is drawn out from the line of the heads, up and down, as its
    // section comes fully open, and its weave is laid by the cloth's own length, so it travels with the laths
    float sb = ${S.ARC0} + (prev * nj + j * f) * ${S.S0}, top = ${S.LEN} * cosT, tight = smoothstep(.9, 1., f);
    float ab = side * sb / 30.;
    vec3 rb = vec3(sin(ab), 0., cos(ab));
    P = rb * 29.6 + vec3(0., top + (0.5 - (1. - position.y) * 1.2) * tight, 0.);
    vW = P; vN = -rb; vT = vec3(${S.ARC0} + (sec * nj + j) * ${S.S0}, position.y, side * 3.);
  }
  vec4 mv = viewMatrix * vec4(P, 1.); vD = -mv.z; gl_Position = projectionMatrix * mv;
}`,fragmentShader:`
uniform vec3 uWood; ${ne}
${ve}
void main(){
  vec3 N = normalize(vN); vec3 V = normalize(cameraPosition - vW); if (dot(N, V) < 0.) N = -N;
  float h = gHash(vec2(vT.y, vT.z * 3.1));
  vec3 alb = uWood * (.72 + .5 * h) * (.85 + .3 * gNoise(vec2(vT.x * 5., vT.y)));
  float tie = abs(fract(vT.x / .883 + .5) - .5) * .883;                  // hide ties at every crossing
  alb = mix(vec3(.2, .12, .07), alb, smoothstep(.07, .13, tie));
  // the end posts: a stouter, darker upright, bound to its neighbour with wide bands of hide
  float post = step(1.5, abs(vT.z));
  alb = mix(alb, uWood * vec3(.6, .5, .42) * (.8 + .4 * gNoise(vec2(vT.x * 3., 1.))), post);
  alb = mix(alb, vec3(.5, .4, .28) * (.7 + .3 * step(.5, fract(vT.x * 9.))), post * smoothstep(.42, .34, abs(fract(vT.x / 2.65) - .5) * 2.65));
  // the inner girth band: red wool with a run of lozenges, cream outlines, blue hearts, blue and cream selvedges. The run
  // has 99 lozenges to the whole round (the two sides' arcs together, 188.43 m), so it is unbroken where the sides meet
  float belt = step(2.5, abs(vT.z));
  if (belt > .5) {
    float s = vT.x, v = vT.y, m = abs(fract(s / 1.9034) - .5) * 2., z = abs(v - .5) * 2., d = z * .62 + m;
    vec3 col = vec3(.5, .09, .07);
    col = mix(col, vec3(.82, .74, .58), smoothstep(.08, .03, abs(d - .62)));
    col = mix(col, vec3(.09, .13, .4), smoothstep(.36, .3, d));
    col = mix(col, vec3(.72, .5, .16), smoothstep(.13, .09, d));
    col = mix(col, vec3(.09, .13, .4), step(.78, z));
    col = mix(col, vec3(.82, .74, .58), step(.78, z) * step(z, .86));
    alb = col * (.82 + .18 * gNoise(vec2(s * 37., v * 23.))) * (.92 + .08 * step(.5, fract(v * 19.)));
  }
  // indoors the laths stand against the glowing felt: a net of dark diamonds
  gl_FragColor = vec4(gerFog(gerLight(alb, N, vW, mix(1., mix(.5, .8, belt), .45 * uWallC + .55 * uRoofC)), vD), 1.);
}`}),x=new o.Mesh(d,b);return x.frustumCulled=!1,x.name="lattice",{mesh:x,uniforms:f,triangles:u.length/3}}const xe={RH:30.25,PSI1:Math.PI-.3217,DU:.03};function qe(r,i,a){const e=[0,.03,.14,.38,.62,.86,.97,1],l=7,s=[],u=[],t=[];let v=0;for(let p=0;p<ae;p++){let w=(p+.5)/ae*6.2832;w>Math.PI&&(w-=6.2832);const g=Math.max(0,Math.abs(w)*U-S.ARC0);for(let y=0;y<e.length;y++)for(let c=0;c<l;c++){const h=c/l*6.2832;s.push(Math.cos(h),e[y],Math.sin(h)),u.push(w,i[p],g,w>=0?1:-1)}for(let y=0;y<e.length-1;y++)for(let c=0;c<l;c++){const h=v+y*l+c,m=v+y*l+(c+1)%l;t.push(h,m,h+l,m,m+l,h+l)}v+=e.length*l}const n=new o.BufferGeometry;n.setAttribute("position",new o.Float32BufferAttribute(s,3)),n.setAttribute("aP",new o.Float32BufferAttribute(u,4)),n.setIndex(t),n.boundingSphere=new o.Sphere(new o.Vector3(0,10,0),70);const d=p=>({value:new o.Color(p)}),f={...r,uU:{value:0},uReachE:{value:0},uReachW:{value:0},uWood:d(a.wood),uBlue:d(a.blue),uGreen:d(a.green),uWhite:d(a.white)},b=new o.ShaderMaterial({uniforms:f,vertexShader:`
attribute vec4 aP; uniform float uU, uReachE, uReachW, uTime, uRoofC; ${ne}
void main(){
  float a = aP.x, seat = aP.y, reach = aP.w > 0. ? uReachE : uReachW;
  float lift = smoothstep(aP.z + 2., aP.z + 8., reach);
  float hy = mix(.95, 16.35, lift);                                       // lying, they rest on the trodden grass
  float psi0 = -asin(clamp((hy - .95) / ${I.POLE_LEN}, 0., .99));
  float tt = clamp((uU - seat + ${xe.DU}) / ${xe.DU}, 0., 1.);
  // up and over quickly from a short run-up, then a slow settle onto the crown that ends in a soft knock
  float w = tt * tt / (tt + .12 * (1. - tt)), q = 1. - w;
  float s = w * (1. + .75 * q * (1. + q));
  float psi = mix(psi0, ${xe.PSI1.toFixed(4)}, s);
  float tau = max(uU - seat, 0.) * 90.;
  float shiver = step(seat, uU) * .5 * exp(-tau * 2.2) * sin(tau * 16.);
  float t = position.y, rr = mix(.3, .19, t);
  // seated poles thrum in the wind (they only ever sag inward, never up into the felt) until the roof felt weighs them down
  float loose = step(seat, uU) * (1. - .88 * uRoofC), gust = .55 + .45 * sin(uTime * .8 + a * 2.);
  float hum = loose * gust * .13 * (.5 + .5 * sin(uTime * (2.4 + 1.7 * fract(a * 7.31)) + a * 23.));
  float humT = loose * gust * .09 * sin(uTime * (2.0 + 1.3 * fract(a * 3.77)) + a * 41.);
  vec2 d = vec2(cos(psi), sin(psi)), nn = vec2(-d.y, d.x);
  vec2 pr = vec2(${xe.RH}, hy) + d * (t * ${I.POLE_LEN}) + nn * ((shiver + hum) * sin(3.1416 * t) + position.x * rr);
  vec3 rad = vec3(sin(a), 0., cos(a)), tn = vec3(cos(a), 0., -sin(a));
  vec3 P = rad * pr.x + vec3(0., pr.y, 0.) + tn * (position.z * rr + humT * sin(3.1416 * t));
  vW = P; vN = normalize((rad * nn.x + vec3(0., nn.y, 0.)) * position.x + tn * position.z); vT = vec3(t, a * 13., seat);
  vec4 mv = viewMatrix * vec4(P, 1.); vD = -mv.z; gl_Position = projectionMatrix * mv;
}`,fragmentShader:`
uniform vec3 uWood, uBlue, uGreen, uWhite; ${ne}
${ve}
void main(){
  vec3 N = normalize(vN); float t = vT.x;
  // every pole its own paint: most orange, some rubbed back to red-brown, none of them quite the same
  float ph = gHash(vec2(vT.y, 2.));
  vec3 alb = uWood * vec3(.95, .87, .8) * (.8 + .32 * gNoise(vec2(t * 60., vT.y))) * (.86 + .22 * ph);
  alb = mix(alb, alb * vec3(.8, .56, .5), smoothstep(.62, .9, gHash(vec2(vT.y, 5.))) * .8);
  alb = mix(alb, alb * vec3(.7, .6, .56), .6 * smoothstep(.5, .85, gFbm(vec2(t * 5., vT.y * 1.7))));
  // painted bands at the foot and under the crown
  // painted cuffs at the foot and under the crown: ultramarine, edged with a thin ochre line; the rest is orange
  float e = t < .5 ? t : 1. - t, b = (e - .03) * 25.4;                    // metres into the cuff
  if (e > .03 && e < .086) {
    vec3 cuff = uBlue;
    float ed = min(b, 1.42 - b);
    cuff = mix(cuff, vec3(.6, .36, .1), smoothstep(.11, .08, abs(ed - .1)));          // a thin ochre line near each edge
    cuff = mix(cuff, uBlue * .55, smoothstep(.05, .03, abs(b - .71)));               // and a darker line round the middle
    alb = cuff * (.85 + .2 * gNoise(vec2(t * 200., vT.y)));
  }
  float ring = max(smoothstep(.004, .002, abs(t - .3)), smoothstep(.004, .002, abs(t - .7)));
  alb = mix(alb, vec3(.72, .46, .14), ring);
  // worn paint and soot toward the crown, where the smoke goes
  alb *= 1. - .22 * smoothstep(.55, .85, gFbm(vec2(t * 9., vT.y * 3.))) - .25 * uRoofC * smoothstep(.72, 1., t);
  alb *= .8 + .2 * smoothstep(-.6, .3, N.y);
  // under the roof the poles take the light thrown up from the rugs as well, so they stay orange against the felt
  float gi = gerInside(vW) * uRoofC;
  // under the felt the poles are orange only where the sun's side of the roof glows through onto them; round the far
  // half they fall to ox-blood and brown, each pole a little different, with a soft sheen along its length
  vec2 hs = normalize(uSunDir.xz + vec2(1e-5, 0.));
  float ss = dot(normalize(vW.xz + vec2(1e-4, 0.)), hs), lit = smoothstep(-.3, .8, ss + .35 * (gHash(vec2(vT.y, 7.)) - .5));
  vec3 ox = vec3(dot(alb, vec3(.5, .35, .15))) * vec3(.62, .2, .17);
  // a paint that is not red (the blue-green woodwork) has no ox-blood in it: its far half falls to a deep shade of its own colour
  ox = mix(ox, alb * .7, smoothstep(0., .1, max(uWood.g, uWood.b) - uWood.r));
  // (raised and not yet under felt they already do this: the fan is never one loud orange)
  float gs = max(gi, .8 * smoothstep(9., 16.5, vW.y) * gerInside(vW));
  // under the closed felt the far half stands in the white room's own light: a deep shade of its paint, never black against the felt
  vec3 deep = mix(ox, mix(ox, alb, .45), gi);
  alb = mix(alb, mix(deep, alb * vec3(.92, .8, .74), lit), gs);
  vec3 V = normalize(cameraPosition - vW);
  float sheen = pow(max(1. - abs(dot(N, V)), 0.), 2.5) * (.5 + .5 * gNoise(vec2(t * 30., vT.y)));
  vec3 c = gerLight(alb, N, vW, mix(1., mix(mix(.62, .85, gi), 1., lit), gs)) + alb * uFeltWarm * (gi * (.34 * lit * (1. - .5 * N.y) + .22 * sheen)) + alb * uFeltCool * (.2 * gi * (1. - lit)) + uFeltCool * (.05 * gi * sheen * (1. - lit));
  gl_FragColor = vec4(gerFog(c, vD), 1.);
}`}),x=new o.Mesh(n,b);return x.frustumCulled=!1,x.name="poles",{mesh:x,uniforms:f,triangles:t.length/3}}const Re=`
uniform vec3 uFelt; uniform float uRope; ${ne}
${ve}
// felt: pressed wool with thick and thin places, stray fibres, and rows of quilting stitches that pucker it
vec3 feltBody(float a, float b){
  float thick = gFbm(vec2(a, b) * .21), fib = gNoise(vec2(a * 2.3, b * 7.)), fine = gNoise(vec2(a * 13., b * 11.)) * .6 + gNoise(vec2(a * 31. + 5., b * 4.)) * .4;
  float qa = abs(fract((a + b) / 2.9) - .5) * 2.9, qb = abs(fract((a - b) / 2.9) - .5) * 2.9, qd = min(qa, qb);
  float stitch = smoothstep(.07, .03, qd) * step(.45, fract((a * .7 + b * .3) * 2.4));
  float pucker = smoothstep(0., .5, qd);
  return uFelt * (.8 + .2 * thick + .08 * fib + .08 * fine) * (.9 + .1 * pucker) * (1. - .24 * stitch);
}`;function je(r,i){const l=[],s=[],u=[];let t=0;const v=S.ARC0/U-.012;for(const x of[1,-1]){const p=(x>0?S.ENDE:S.ENDW)/U+.02;for(let w=0;w<=84;w++)for(let g=0;g<=12;g++){const y=fe(v,p,w/84);l.push(x,y,g/12),u.push(Math.sin(x*y)*U,g/12*16.6,Math.cos(y)*U)}for(let w=0;w<84;w++)for(let g=0;g<12;g++){const y=t+w*13+g,c=y+12+1;s.push(y,c,y+1,y+1,c,c+1)}t+=1105}const n=new o.BufferGeometry;n.setAttribute("position",new o.Float32BufferAttribute(u,3)),n.setAttribute("aF",new o.Float32BufferAttribute(l,3)),n.setIndex(s);const d={...r,uFelt:{value:new o.Color(i.felt)},uRollE:{value:v},uRollW:{value:v},uRollR:{value:1.7},uRope:{value:0},uWind:{value:1}},f=new o.ShaderMaterial({uniforms:d,side:o.DoubleSide,vertexShader:`
attribute vec3 aF; uniform float uRollE, uRollW, uRollR, uRope, uWind, uTime; ${ne}
void main(){
  float side = aF.x, roll = side > 0. ? uRollE : uRollW;
  float a = min(aF.y, roll), y = aF.z * 16.6, laid = 1. - step(roll, aF.y);
  float rip = sin(a * 17. + y * .4 + uTime * 2.3) * sin(a * 5.3 - uTime * 1.1 + y * .13);
  float ropeOn = smoothstep(0., .15, uRope * 3.5 - a);
  float dr = min(abs(y - 4.15), min(abs(y - 8.3), abs(y - 12.45)));
  float rad = 30.46 + laid * (uWind * .17 * rip * sin(3.1416 * aF.z) * (1. - .6 * ropeOn) - .14 * ropeOn * (1. - smoothstep(0., .8, dr))) + (1. - laid) * uRollR;
  float ang = side * a;
  vec3 P = vec3(sin(ang) * rad, y, cos(ang) * rad);
  vW = P; vN = vec3(sin(ang), 0., cos(ang)); vT = vec3(a * 30., y, rip * laid);
  vec4 mv = viewMatrix * vec4(P, 1.); vD = -mv.z; gl_Position = projectionMatrix * mv;
}`,fragmentShader:Re+`
void main(){
  vec3 No = normalize(vN), V = normalize(cameraPosition - vW);
  float inside = step(dot(No, V), 0.), arc = vT.x, y = vT.y;
  vec3 alb = feltBody(arc, y);
  // overlapping seams laced with cord, sag folds under the wall head, dust and damp along the foot
  float seam = abs(fract(arc / 23.5 + .25) - .5) * 23.5;
  alb *= .7 + .3 * smoothstep(.04, .3, seam);
  alb *= 1. - .4 * smoothstep(.62, .5, seam) * smoothstep(.3, .4, seam) * step(.55, fract(y * 1.3));
  // soft folds: the felt hangs from the wall head in shallow swags, deeper toward the top, and sags between the ropes
  float fold = .5 + .5 * sin(arc * 2.9 + 2.5 * gNoise(vec2(arc * .3, y * .2)));
  float swag = .5 + .5 * sin(arc * .82 + 1.7 * gNoise(vec2(arc * .11, 7.)) + y * .18);
  float folds = 1. - .16 * smoothstep(7., 16.6, y) * fold - .13 * swag * smoothstep(0., 9., y);
  alb *= folds;
  alb *= mix(vec3(.66, .6, .52), vec3(1.), smoothstep(0., 3.2, y + 1.6 * gNoise(vec2(arc * .4, 3.)) - .8));
  float ropeOn = smoothstep(0., .15, uRope * 3.5 - arc / 30.);
  float dr = min(abs(y - 4.15), min(abs(y - 8.3), abs(y - 12.45)));
  float ropeShade = 1. - ropeOn * .32 * (1. - smoothstep(.05, 1.1, dr));
  // the horsehair girth ropes themselves, seen from outside: a dark twisted line
  float ropeLine = ropeOn * (1. - inside) * smoothstep(.16, .1, dr) * (.75 + .25 * step(.5, fract(arc * 3. + y)));
  alb = mix(alb, vec3(.16, .12, .09), ropeLine);
  alb *= mix(.5, mix(.66, 1., uRoofC), inside);                            // in open sun felt is a soft cream, not a white-out
  vec2 h = normalize(uSunDir.xz + vec2(1e-5, 0.)); float sunSide = dot(No.xz, h);
  float d1 = abs(fract((arc + y * .7813) / 1.087) - .5), d2 = abs(fract((arc - y * .7813) / 1.087) - .5);
  float net = 1. - .3 * smoothstep(-.2, .8, sunSide) * (smoothstep(.36, .46, d1) + smoothstep(.36, .46, d2));
  float T = smoothstep(-.6, .9, sunSide); T *= sqrt(T);
  float thick = .62 + .76 * gFbm(vec2(arc, y) * .11 + 5.);
  float drift = 1. - uCloudAmt * .7 * smoothstep(.36, .7, gFbm(vW.xz * .022 + vec2(y * .012) + uTime * (.6 + .4 * uCloudSpd) * vec2(.07, .03)));
  float roofIn = inside * uRoofC;
  // inside: the felt is lit by the whole white room (warm round the sun's side, cooler and a little dimmer opposite, never
  // dark), takes all of the beam's oval and the lamps, and glows with what comes through it
  vec3 Ni = inside > .5 ? -No : No;
  vec3 glow = mix(uFeltCool * 1.02, uFeltWarm * .8, smoothstep(-.6, .7, sunSide)) * mix(.8, .42, smoothstep(.15, 1., sunSide)) * mix(.8, 1., smoothstep(-1., -.35, sunSide));
  vec3 c = alb * (mix(gerAmb(Ni, vW, inside), glow, roofIn) + gerDirect(Ni, vW, mix(1., .5, roofIn), inside));
  // what comes through: warm where the sun lies on the outside, strongest at mid height, blue sky on the far side
  float band = mix(.55, 1., smoothstep(0., 7., y)) * mix(1., .8, smoothstep(11., 16.6, y));
  // (amber, deepest in the folds and along the seams where the felt lies double)
  vec3 amber = mix(vec3(1., .46, .13), vec3(1., .33, .06), .6 * (1. - folds * folds) + .4 * (1. - smoothstep(.04, .5, seam)));
  c += inside * alb * (uSunCol * amber * (.52 * uFeltT * T * net * thick * drift * uSunGate) + uSkyCol * (.1 * (.7 + .3 * drift)) * smoothstep(.2, -.8, sunSide) * (1. - uRoofC)) * band;
  c *= mix(1., .46 + .54 * smoothstep(0., 3.2, y), roofIn);               // the wall stands in its own shade at the floor
  c *= 1. + .22 * vT.z * inside;
  c *= ropeShade;
  gl_FragColor = vec4(gerFog(c, vD), 1.);
}`}),b=new o.Mesh(n,f);return b.frustumCulled=!1,b.name="wall-felt",{mesh:b,uniforms:d,A0:v,triangles:s.length/3}}function $e(r,i,a){const s=[],u=[],t=[];for(let b=0;b<=96;b++)for(let x=0;x<=10;x++){const p=b/96*6.2832,w=x/10,g=fe(30.75,6.25,w);s.push(p,w),t.push(Math.sin(p)*g,fe(16.7,24.75,w),Math.cos(p)*g)}for(let b=0;b<96;b++)for(let x=0;x<10;x++){const p=b*11+x,w=p+10+1;u.push(p,w,p+1,p+1,w,w+1)}const v=new o.BufferGeometry;v.setAttribute("position",new o.Float32BufferAttribute(t,3)),v.setAttribute("aRf",new o.Float32BufferAttribute(s,2)),v.setIndex(u);const n={...r,uFelt:{value:new o.Color(i.felt)},uHem:{value:0},uArrive:{value:0},uCart:{value:new o.Vector3(a[0],a[1],a[2])},uRope:{value:0},uWind:{value:1}},d=new o.ShaderMaterial({uniforms:n,side:o.DoubleSide,vertexShader:`
attribute vec2 aRf; uniform float uHem, uArrive, uWind, uTime; ${ne}
void main(){
  float k = min(aRf.y, uHem), a = aRf.x, hem = step(uHem + 1e-4, aRf.y);
  float rip = sin(a * 9. + k * 7. + uTime * 1.3) * sin(a * 4. - uTime * .6);
  float w = (aRf.y - uHem) * 12.566;
  float r = mix(30.75, 6.25, k) - hem * .55 * sin(w), y = mix(16.7, 24.75, k) + hem * .55 * (1. - cos(w)) + (1. - hem) * uWind * .1 * rip * sin(3.1416 * k);
  vec3 P = vec3(sin(a) * r, y, cos(a) * r);
  // until it is thrown over, the roof felt lies rolled in a hoop on the grass round the site
  float rr0 = mix(33.8, r, uArrive), yy0 = mix(.5, y, uArrive);
  P = vec3(sin(a) * rr0, yy0, cos(a) * rr0);
  vW = P; vN = normalize(vec3(sin(a) * .316, .949, cos(a) * .316)); vT = vec3(a, k, rip * (1. - hem));
  vec4 mv = viewMatrix * vec4(P, 1.); vD = -mv.z; gl_Position = projectionMatrix * mv;
}`,fragmentShader:Re+`
void main(){
  vec3 No = normalize(vN), V = normalize(cameraPosition - vW);
  float inside = step(dot(No, V), 0.), a = vT.x, k = vT.y, r = mix(30.75, 6.25, k);
  vec3 alb = feltBody(a * r, k * 25.);
  float seam = min(abs(fract(a / 1.5708 + .3) - .5) * 1.5708 * r, abs(k - .52) * 25.);
  alb *= .7 + .3 * smoothstep(.04, .3, seam);
  alb *= 1. - .34 * inside * smoothstep(.66, 1., k + .1 * gNoise(vec2(a * 6., k * 9.)));       // smoke has browned the felt round the ring
  alb *= mix(.5, 1., inside * uRoofC);
  float T = max(dot(No, uSunDir), 0.);
  float thick = .62 + .76 * gFbm(vec2(a * r, k * 25.) * .11 + 9.);
  float drift = 1. - uCloudAmt * .7 * smoothstep(.36, .7, gFbm(vW.xz * .022 + uTime * (.6 + .4 * uCloudSpd) * vec2(.07, .03)));
  float roofIn = inside * uRoofC;
  vec3 Ni = inside > .5 ? -No : No;
  float sg = smoothstep(0., .6, T);
  vec3 glow = mix(uFeltCool * 1.02, uFeltWarm * .8, sg) * mix(.8, .46, sg);
  vec3 c = alb * (mix(gerAmb(Ni, vW, inside), glow, roofIn) + gerDirect(Ni, vW, mix(1., .5, roofIn), inside));
  c += inside * alb * (uSunCol * vec3(1., .48, .15) * (.44 * uFeltT * T * thick * drift * uSunGate) + uSkyCol * (.08 * (.7 + .3 * drift)));
  c *= 1. + .22 * vT.z * inside;
  gl_FragColor = vec4(gerFog(c, vD), 1.);
}`}),f=new o.Mesh(v,d);return f.frustumCulled=!1,f.name="roof-felt",{mesh:f,uniforms:n,triangles:u.length/3}}function He(r,i,a){const l=[],s=[];for(let f=0;f<2;f++)for(let b=0;b<28;b++){const x=b/28*6.2832;l.push(Math.cos(x)*7-i.x*46*f,24.3-i.y*46*f,Math.sin(x)*7-i.z*46*f)}for(let f=0;f<28;f++){const b=(f+1)%28;s.push(f,b,f+28,b,b+28,f+28)}for(let f=1;f<27;f++)s.push(0,f+1,f),s.push(28,28+f,28+f+1);const t=new o.BufferGeometry;t.setAttribute("position",new o.Float32BufferAttribute(l,3)),t.setIndex(s);const v={...r,uBeamCol:{value:new o.Color(a)},uBeamGain:{value:0},uSigma:{value:.062}},n=new o.ShaderMaterial({uniforms:v,side:o.BackSide,depthTest:!1,depthWrite:!1,transparent:!0,blending:o.AdditiveBlending,vertexShader:"varying vec3 vW; void main(){ vW = position; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.); }",fragmentShader:`
uniform vec3 uBeamCol; uniform float uBeamGain, uSigma; varying vec3 vW;
${ve}
void main(){
  vec3 O = cameraPosition, Dv = normalize(vW - O + vec3(1e-5)), S = uBeamDir; float k = 1. / max(S.y, .05);
  vec2 q0 = O.xz + S.xz * (k * (24.2 - O.y)), qd = Dv.xz - S.xz * (k * Dv.y);
  float a = dot(qd, qd), b = dot(q0, qd), c = dot(q0, q0) - 31.4, disc = b * b - a * c, len = 0., tm = 0.;
  if (disc > 0. && a > 1e-6) {
    float sq = sqrt(disc), t0 = max((-b - sq) / a, 0.), t1 = (-b + sq) / a;
    float dy = abs(Dv.y) > 1e-4 ? Dv.y : 1e-4, tp = (24.2 - O.y) / dy;
    if (dy > 0.) t1 = min(t1, tp); else { t0 = max(t0, tp); t1 = min(t1, -O.y / dy); }
    float a2 = max(dot(Dv.xz, Dv.xz), 1e-5), b2 = dot(O.xz, Dv.xz), c2 = dot(O.xz, O.xz) - 918., d2 = b2 * b2 - a2 * c2;
    if (d2 > 0.) t1 = min(t1, (-b2 + sqrt(d2)) / a2);
    len = max(t1 - t0, 0.); tm = (t0 + t1) * .5;
  }
  // smoke hangs in the beam in slow curls: dense, so the blade has a hard edge and a bright body
  vec3 M = O + Dv * tm, M1 = O + Dv * (tm - .22 * len), M2 = O + Dv * (tm + .22 * len);
  float n = .5 * (gFbm(M1.xz * .16 + vec2(M1.y * .21 - uTime * .13, uTime * .05)) + gFbm(M2.xz * .16 + vec2(M2.y * .21 - uTime * .13, uTime * .05)));
  float n2 = gNoise(M.xz * .5 + vec2(uTime * .2, M.y * .6 - uTime * .35));
  n = smoothstep(.22, .78, n);
  // the blade is brightest under the ring and thins toward its foot
  float along = clamp((24.2 - M.y) / max(24.2 - uBeamFoot.y, 1.), 0., 1.);
  // seen lengthwise the blade is no brighter than seen across (the lit air is counted for 14 m at most), and its
  // edge is soft: a chord near the rim carries little light
  float lenC = min(len, 14.), rim = smoothstep(0., 5.5, len);
  float I = .52 * rim * (1. - exp(-lenC * uSigma * 1.7 * (.3 + 1.4 * n + .4 * n2) * mix(1.25, .6, along)));
  // the beam is a thing seen across the room: where it begins close to the lens, and with the eye inside it, the lit
  // air thins away so that the room is never veiled
  float eyeIn = smoothstep(19., 8., length(q0)) * step(O.y, 24.2) * step(dot(O.xz, O.xz), 918.);
  float t0n = max((-b - sqrt(max(disc, 0.))) / max(a, 1e-6), 0.);
  I *= mix(mix(.1, 1., smoothstep(2.5, 17., t0n)), .1, eyeIn);
  // shafts: the light comes down in streaks that keep their place across the ring
  vec2 qs = M.xz + S.xz * (k * (24.2 - M.y));
  I *= .66 + .68 * gNoise(qs * 1.25 + vec2(uTime * .03, 0.)) * (.6 + .4 * gNoise(qs * 3.1 + 4.));
  gl_FragColor = vec4(uBeamCol * (I * uBeamGain * gerCloud(vec2(0.)) * uSunGate), 1.);
}`}),d=new o.Mesh(t,n);return d.frustumCulled=!1,d.renderOrder=6,d.name="beam",{mesh:d,uniforms:v}}async function Ue(r,i){const a=be(),e=ye.band;a.add(Oe([[5.5,-.5],[6.3,-.5],[6.48,-.2],[6.48,.2],[6.3,.5],[5.5,.5],[5.36,.2],[5.36,-.2],[5.5,-.5]],54),{c:"#ffffff",uv:[0,e[1],6,e[3]]}),await i();for(let s=0;s<ae;s++){const u=(s+.5)/ae*6.2832;a.add(new o.BoxGeometry(.3,.3,.22),{p:[Math.sin(u)*6.5,.02,Math.cos(u)*6.5],r:[0,u,0],c:"#2a160c"}),(s&15)===0&&await i()}await i();const l=(s,u,t,v,n)=>{const d=new o.TorusGeometry(s,u,6,n);d.rotateX(Math.PI/2),a.add(d,{p:[0,t,0],c:v})};l(4,.26,1.15,r.blue,36),l(1.35,.3,2.45,r.wood,18),l(1.35,.12,2.8,r.gold,18);for(let s=0;s<8;s++){const u=s/8*6.2832,t=u+.42,v=new o.CatmullRomCurve3([new o.Vector3(Math.sin(u)*5.6,.1,Math.cos(u)*5.6),new o.Vector3(Math.sin(u+.1)*4.4,.95,Math.cos(u+.1)*4.4),new o.Vector3(Math.sin(u+.3)*2.8,1.9,Math.cos(u+.3)*2.8),new o.Vector3(Math.sin(t)*1.45,2.45,Math.cos(t)*1.45)]),n=new o.TubeGeometry(v,10,.24,6,!1);a.add(n,{c:s%2?r.wood:r.woodLight,grad:[0,2.5,.85,1.1]}),a.add(new o.SphereGeometry(.34,7,5),{p:[Math.sin(u+.1)*4.4,.95,Math.cos(u+.1)*4.4],c:r.gold}),await i()}await i();for(const s of[-1,1])a.add(P(1.5,.5,1.5,.12),{p:[s*4,.55,0],c:r.green});return await i(),a.buildAsync(i)}const re=(r,i,a,e=.06)=>({geo:P(r,i,a,e),uv:[0,ye.band[1],Math.max(.05,r/((i-2*e)*8)),ye.band[3]]});async function Xe(r,i){const a=be(),e=24;a.add(P(1.9,.5,1.9,.12),{p:[0,.25,0],c:r.woodDark}),a.add(P(1.6,.6,1.6,.14),{p:[0,.8,0],c:r.blue}),a.add(P(1.3,.3,1.3,.08),{p:[0,1.25,0],c:r.gold}),a.add(new o.CylinderGeometry(.44,.52,e-2.6,8,6),{p:[0,1.4+(e-2.6)/2,0],r:[0,Math.PI/8,0],c:r.wood,grad:[-(e-2.6)/2,(e-2.6)/2,.84,1.06]}),await i();for(const l of[4.4,11.6,18.8]){for(let s=0;s<4;s++){const u=re(1.06,.84,.1,.03),t=s*Math.PI/2;a.add(u.geo,{p:[Math.sin(t)*.5,l,Math.cos(t)*.5],r:[0,t,0],c:"#ffffff",uv:u.uv})}await i();for(const s of[-1,1])a.add(P(1.2,.2,1.2,.05),{p:[0,l+s*.54,0],c:r.blue}),a.add(P(1.12,.1,1.12,.03),{p:[0,l+s*.7,0],c:r.gold});await i()}await i();for(const l of[8,15.2])a.add(new o.TorusGeometry(.5,.07,5,12),{p:[0,l,0],r:[Math.PI/2,0,0],c:r.gold});a.add(P(3.4,.7,1.05,.14),{p:[0,e-.75,0],c:r.wood}),a.add(P(2.2,.5,1.2,.12),{p:[0,e-.25,0],c:r.blue}),a.add(P(1.5,.24,1.5,.06),{p:[0,e-1.25,0],c:r.gold}),await i();for(const l of[-1,1])a.add(P(.4,2.3,.6,.08),{p:[l*1.05,e-1.9,0],r:[0,0,l*.72],c:r.woodLight}),a.add(new o.SphereGeometry(.22,7,5),{p:[l*1.72,e-1.05,0],c:r.gold});return await i(),a.buildAsync(i)}async function Je(r,i){const a=be(),e=I.DOOR_Z,l=I.DOOR_W;for(const s of[-1,1]){const u=s*(l+.55);a.add(P(1.1,16.4,1.5,.14),{p:[u,8.2,e],c:r.wood,grad:[-8,8,.86,1.06]});{const t=re(14,1.2,.5);a.add(t.geo,{p:[u,8.2,e+.62],r:[0,0,Math.PI/2],c:"#ffffff",uv:t.uv})}{const t=re(13.2,.8,.12,.04);a.add(t.geo,{p:[s*(l-.03),8.4,e-.3],r:[0,Math.PI/2,Math.PI/2],c:"#ffffff",uv:t.uv})}for(const t of[-.74,.14])a.add(P(.14,13.6,.16,.04),{p:[s*(l-.04),8.4,e+t],c:r.blue});await i();for(const t of[1.5,15.3])a.add(P(.3,.5,.96,.08),{p:[s*(l-.06),t,e-.3],c:r.gold}),a.add(P(.24,.9,.9,.08),{p:[s*(l-.05),t+(t<8?-.6:.6),e-.3],c:r.blue});for(let t=0;t<6;t++)a.add(new o.SphereGeometry(.15,6,4),{p:[s*(l-.1),3+t*2.16,e-.3],c:r.gold});{const t=re(14,.9,.3);a.add(t.geo,{p:[u,8.2,e-.66],r:[0,0,Math.PI/2],c:"#ffffff",uv:t.uv})}a.add(P(1.5,.8,1.9,.16),{p:[u,.4,e],c:r.blue}),a.add(P(1.36,.22,1.76,.06),{p:[u,.92,e],c:r.gold}),await i()}{const s=re(l*2+3.2,1.3,1.7,.16);a.add(s.geo,{p:[0,16.85,e],c:"#ffffff",uv:s.uv})}{const s=re(l*2-.2,.9,.1,.03);a.add(s.geo,{p:[0,16.2,e],r:[Math.PI/2,0,0],c:"#ffffff",uv:s.uv})}a.add(P(l*2+4.2,.5,2.3,.14),{p:[0,17.75,e],c:r.blue}),a.add(P(l*2+3.4,.35,2,.1),{p:[0,18.15,e],c:r.gold}),a.add(P(l*2+2.2,.45,1.6,.14),{p:[0,.22,e],c:r.woodDark}),a.add(P(l*2-.1,.12,.5,.03),{p:[0,.5,e],c:"#b08a48"});for(let s=-5;s<=5;s++)a.add(new o.ConeGeometry(.34,.8,4),{p:[s*1.6,18.72,e],r:[0,Math.PI/4,0],c:s%2?r.blue:r.wood});return await i(),a.buildAsync(i)}async function Ze(r,i){const a=be(),e=I.DOOR_W-.08,l=15.2,s=.6,u=.95;for(const n of[u/2,e-u/2])a.add(P(u,l,.6,.1),{p:[n,s+l/2,0],c:r.wood,grad:[-l/2,l/2,.86,1.05]});for(const n of[s+.5,s+l/2,s+l-.5]){const d=re(e-2*u+.1,1,.62,.08);a.add(d.geo,{p:[e/2,n,0],c:"#ffffff",uv:d.uv})}await i();const t=l/2-1.5,v=e-2*u;for(let n=0;n<2;n++){const d=s+1+t/2+n*(l/2-.5);a.add(P(v+.1,t+.1,.26,.06),{p:[e/2,d,0],c:r.woodDark});for(const f of[.15,-.15]){const b=new o.PlaneGeometry(v-.1,t-.1);f<0&&b.rotateY(Math.PI),a.add(b,{p:[e/2,d,f],c:"#ffffff",uv:ye.door})}for(const f of[.2,-.2])for(const b of[-1,1])a.add(P(.16,t,.12,.04),{p:[e/2+b*(v/2-.02),d,f],c:r.blue}),a.add(P(v,.16,.12,.04),{p:[e/2,d+b*(t/2-.02),f],c:r.blue})}await i();for(const n of[-.02,e+.02]){a.add(P(.1,l-.3,.3,.04),{p:[n,s+l/2,0],c:r.blue});for(let d=0;d<8;d++)a.add(new o.SphereGeometry(.11,6,4),{p:[n+Math.sign(n)*.05,s+1+d*1.9,0],c:r.gold})}await i();for(const n of[.31,-.31])for(const d of[u/2,e-u/2])for(let f=0;f<5;f++)a.add(new o.SphereGeometry(.13,6,4),{p:[d,s+1.6+f*3,n],c:r.gold});for(const n of[.4,-.4])a.add(new o.TorusGeometry(.5,.09,6,14),{p:[e-1,7.4,n],c:r.gold}),a.add(new o.SphereGeometry(.22,8,6),{p:[e-1,7.95,n],c:r.gold}),a.add(P(.7,.9,.08,.03),{p:[e-1,7.95,n*.82],c:"#8a6a30"});for(const n of[2.5,8.2,13.9])a.add(P(2.4,.36,.7,.06),{p:[1.15,n,0],c:"#3a2a20"}),a.add(Ae(.2,.2,.9,8),{p:[-.04,n,0],c:"#2a2019"});return await i(),a.buildAsync(i)}function Ye(r){const i=be(),a={add:(t,v)=>i.add(t,{...v,m:1}),build:()=>i.build()},e=new o.Color(r.felt).multiplyScalar(.27),l=[e.r,e.g,e.b],s=new o.CylinderGeometry(1,1,1,24,8,!0),u=s.attributes.position;for(let t=0;t<u.count;t++){const v=Math.atan2(u.getZ(t),u.getX(t)),n=1+.035*Math.sin(v*3+u.getY(t)*9)+.02*Math.sin(u.getY(t)*31+v);u.setX(t,u.getX(t)*n),u.setZ(t,u.getZ(t)*n)}s.computeVertexNormals(),a.add(s,{p:[0,.5,0],c:l,grad:[-.5,.5,.86,1.06]});for(const t of[0,1])for(let v=0;v<7;v++){const n=new o.RingGeometry(v/7,v/7+.115,24);n.rotateX(t?-Math.PI/2:Math.PI/2),a.add(n,{p:[0,t+(t?.002:-.002)*v,0],c:l,gain:(v%2?.5:.92)*(.6+.4*v/6)})}for(const t of[.16,.5,.84])a.add(Ae(1.05,1.05,.022,24,!0),{p:[0,t,0],c:"#4a3828"});{const t=new o.PlaneGeometry(.5,1,1,6);a.add(t,{p:[1.02,.5,.24],r:[0,Math.PI/2-.5,0],c:l,gain:.8})}return a.build()}const Ke={wood:"#e47326",woodLight:"#ee9848",woodDark:"#6e2a0e",blue:"#1e4fa0",green:"#3a7048",white:"#e6d8bc",gold:"#d9a044",red:"#9c2c1a",felt:"#ded6c8"};async function tt(r,i={}){const a={...Ke,...i.palette||{}},e=i.light||ze(),l=(i.sunDir?new o.Vector3().copy(i.sunDir):new o.Vector3(-.9135,.4067,0)).normalize();e.uSunDir.value.copy(l);const s=(i.beamDir?new o.Vector3().copy(i.beamDir):l.clone()).normalize();e.uBeamDir.value.copy(s);const t={lattice:[.008,(i.uCross??.15)+.04],crown:[.045,.135],poles:[.245,.425],rolls:[.25,.35],wallFelt:[.35,.415],roofArrive:[.405,.43],roof:[.43,.508],ropes:[.5,.54],beam:[.47,.535],door:[.7,.83],...i.timeline||{}},v=i.poleSeat||(()=>{const M=new Float32Array(ae);for(let C=0;C<ae;C++){let O=(C+.5)/ae*360;O>180&&(O-=360);const k=((O+60)%360+360)%360;M[C]=fe(t.poles[0],t.poles[1],k/360)}return M})(),n=new o.Group;n.name="raising-the-ger";const d=i.atlas||Ve(a),f=!i.atlas,b=Te(e,d,{grain:1}),x=Te(e,d,{grain:1,side:o.DoubleSide});await r.yield();const p=await _e(e,r.yield);n.add(p.mesh),await r.yield();const w=qe(e,v,a);n.add(w.mesh),await r.yield();const g=je(e,a);await r.yield();const y=i.cart||[50,2.2,6],c=$e(e,a,y);n.add(g.mesh,c.mesh),await r.yield();const h=new o.Mesh(await Ue(a,r.yield),b);h.name="crown",n.add(h),await r.yield();const m=await Xe(a,r.yield),N=[-1,1].map(M=>{const C=new o.Mesh(m,b);return C.position.set(M*4,0,0),C.name="pillar",n.add(C),C});await r.yield();const z=new o.Mesh(await Je(a,r.yield),b);z.name="door-frame",n.add(z),await r.yield();const L=await Ze(a,r.yield),A=[-1,1].map(M=>{const C=new o.Mesh(L,x);return C.position.set(M*I.DOOR_W,0,I.DOOR_Z+.5),C.name="door-leaf",n.add(C),C});await r.yield();const T=Ye(a),R=[0,1].map(M=>{const C=new o.Mesh(T,x);return C.name="felt-roll",n.add(C),C});for(const M of[h,z,...N,...A,...R])M.frustumCulled=!1;await r.yield();const W=He(e,s,i.beamColor||"#ffc66b");n.add(W.mesh);const ee=new o.Vector3;{const M=Math.hypot(s.x,s.z),C=29.5/M,O=(we-2.5)/s.y,k=Math.min(C,O);ee.set(-s.x*k,we-s.y*k,-s.z*k),e.uBeamFoot.value.copy(ee)}const de=3*S.NJE*S.S0,se=3*S.NJW*S.S0,Z=S.FOLD,X=new o.Vector3,ue=new o.Vector3,D={u:0,closure:0,beam:0,doorOpen:0,crownUp:0,hem:0};function V(M,C=0){D.u=M;const O=.012*Math.sin(C*.9),k=t.lattice[0],q=t.lattice[1],$=q-k,G=[B(k,k+$*.42,M),B(k+$*.2,k+$*.74,M),B(k+$*.46,q,M)];for(const E of[p.uniforms.uOpenE,p.uniforms.uOpenW])E.value.set(Z+(1-Z)*G[0]+O*(1-G[0]),Z+(1-Z)*G[1]+O*(1-G[1]),Z+(1-Z)*G[2]+O*(1-G[2]));const F=(G[0]+G[1]+G[2])/3,H=17*B(q-.01,q+.03,M);w.uniforms.uReachE.value=F*de+H,w.uniforms.uReachW.value=F*se+H,w.uniforms.uU.value=M;const Y=B(t.crown[0],t.crown[1],M),K=(1-Y)*1.309+.004*Math.sin(C*.7)*(1-Y),me=K*(90/75);D.crownUp=Y,h.position.set(0,24*Math.cos(K),-24*Math.sin(K)),h.rotation.x=-me;for(const E of N)E.rotation.x=-K;const Q=B(t.rolls[0],t.rolls[1],M),te=B(t.wallFelt[0],t.wallFelt[1],M),he=B(t.roofArrive[0],t.roofArrive[1],M),J=fe(1.7,.24,te);g.uniforms.uRollR.value=J;for(let E=0;E<2;E++){const Se=E?-1:1,Fe=(Se>0?S.ENDE:S.ENDW)/U+.02,pe=fe(g.A0,Fe,te),oe=R[E];(Se>0?g.uniforms.uRollE:g.uniforms.uRollW).value=pe,X.set(Math.sin(Se*pe)*(30.46+J),0,Math.cos(pe)*(30.46+J)),ue.set(y[0]+(E?4:0),0,y[2]-9+E*4.5);const ce=Q*Q*(3-2*Q);if(oe.position.lerpVectors(ue,X,ce),E)oe.position.z+=Math.sin(Math.PI*ce)*26;else{const Ce=Math.max(0,ce-.2),Me=Ce*Ce*(1-ce);oe.position.x+=40*Me,oe.position.z+=93*Me}oe.position.y+=Math.sin(Math.PI*ce)*5+(1-ce)*1.7,oe.rotation.set((1-B(0,.6,Q))*Math.PI/2,C*0+pe*6*te,0),oe.scale.set(J,16.6,J)}c.uniforms.uArrive.value=he;const ie=B(t.roof[0],t.roof[1],M);D.hem=ie,c.uniforms.uHem.value=ie;const le=B(t.ropes[0],t.ropes[1],M);g.uniforms.uRope.value=le,c.uniforms.uRope.value=le,e.uWallC.value=B(t.wallFelt[0]+.005,t.wallFelt[1],M),e.uRoofC.value=B(t.roof[0]+.005,t.roof[1],M),D.closure=.45*e.uWallC.value+.55*e.uRoofC.value;const j=B(t.door[0],t.door[1],M),_=j*1.78+.012*Math.sin(C*1.3)*(1-j);D.doorOpen=j,A[0].rotation.y=-_,A[1].rotation.y=Math.PI+_,D.beam=B(t.beam[0],t.beam[1],M)*(1-B(.885,.91,M)),W.uniforms.uBeamGain.value=D.beam*(i.beamGain??1),W.mesh.visible=D.beam>.001,e.uBeamOn.value=D.beam}return V(0,0),{object:n,radius:60,height:27,center:new o.Vector3(0,12,0),ground:!0,groundY:0,light:e,atlas:d,material:b,materialDouble:x,palette:a,timeline:t,state:D,seat:v,beamDir:s,parts:{lattice:p,poles:w,wall:g,roof:c,crown:h,pillars:N,frame:z,leaves:A,rolls:R,beam:W},triangles:p.triangles+w.triangles+g.triangles+c.triangles,anchors:{crown:new o.Vector3(0,we,0),crownStart:new o.Vector3(0,6.2,-23.2),ring:{center:new o.Vector3(0,we,0),radius:I.RING_R},door:new o.Vector3(0,8,I.DOOR_Z),threshold:new o.Vector3(0,9,I.DOOR_Z),portalSeat:new o.Vector3(0,9,I.GATE_Z),hitchPosts:[new o.Vector3(-I.POST_X,0,I.GATE_Z),new o.Vector3(I.POST_X,0,I.GATE_Z)],beamFoot:ee,seam:new o.Vector3(Math.sin(S.ENDE/U)*U,0,Math.cos(S.ENDE/U)*U)},setProgress:V,update(M,C,O,k){e.uTime.value=C,V(k??Math.min(1,C%46/40)*.9,C)},dispose(){f&&d.dispose()}}}export{ye as ATLAS,I as GER,ve as GER_GLSL,Ke as GER_PALETTE,Be as SOFT_UV,Le as WHITE_UV,tt as buildHero,P as cbox,Ae as cyl,Te as gerMaterial,Oe as lathe,Ve as makeAtlas,be as makeGB,ze as makeGerLight};
