import*as e from"three";import{smoothstep as le}from"../kit/core.js";import{makeShared as re,sharedUniforms as X,SBV_LIGHT as q,Acc as ue}from"./sledge-between-volcanoes-common.js";const V=r=>1.38*(r?.892:1),ce=`
attribute float aPart, aK, aFig;
uniform vec4 uRootA, uRootB, uSledge;      // xyz where each stands (the sledge: its middle on the snow), w: heading (yaw, radians)
uniform vec4 uGaitA, uGaitB;               // step phase (radians), lean (radians), role (0 hauls, 1 pushes), glance (0..1)
uniform vec4 uSledgeTilt;                  // pitch, roll, -, -
uniform float uSide;                       // which side the mountain is on (the glance turns that way)
varying vec3 vW, vN, vC; varying float vPart;
mat3 rotX(float a){ float c = cos(a), s = sin(a); return mat3(1., 0., 0., 0., c, s, 0., -s, c); }
mat3 rotY(float a){ float c = cos(a), s = sin(a); return mat3(c, 0., -s, 0., 1., 0., s, 0., c); }
mat3 rotZ(float a){ float c = cos(a), s = sin(a); return mat3(c, s, 0., -s, c, 0., 0., 0., 1.); }
void main(){
  vec3 p = position, n = normal; vec4 root; float yaw;
  if (aPart > 8.5) {                                         // the sledge: pitched to the slope, rocking
    mat3 m = rotX(uSledgeTilt.x)*rotZ(uSledgeTilt.y); p = m*p; n = m*n; root = uSledge;
  } else {
    vec4 g = aFig < .5 ? uGaitA : uGaitB; root = aFig < .5 ? uRootA : uRootB;
    float sc = aFig < .5 ? 1. : .892, ph = g.x, lean = g.y, push = g.z;
    float sgn = (aPart == 2. || aPart == 4. || aPart == 6.) ? 0. : 3.14159265;      // the right limbs half a cycle behind the left
    // legs: the thigh swings about the hip, biased backward (they are pushing); the knee folds as the leg comes forward
    float sw = sin(ph + sgn), thigh = -.16 + .43*sw, knee = .12 + .62*max(0., cos(ph + sgn - .5));
    vec3 hip = vec3(aPart == 4. || aPart == 6. ? -.1 : .1, .93, 0.);
    if (aPart >= 4. && aPart < 8.) {
      if (aPart >= 6.) { vec3 kn = vec3(hip.x, .5, 0.); mat3 mk = rotX(-knee); p = mk*(p - kn) + kn; n = mk*n; }
      mat3 mt = rotX(thigh); p = mt*(p - hip) + hip; n = mt*n;
    } else {
      // the trunk leans into the trace from the hips, heaving a little with each step
      float heave = lean + .05*sin(2.*ph + .6);
      if (aPart == 2. || aPart == 3.) {                      // arms: a short swing against the legs; pushing, they reach forward to the load
        vec3 sh = vec3(aPart == 2. ? -.23 : .23, 1.46, 0.); mat3 ma = rotX(mix(-.25 - .2*sw, 1.15, push)); p = ma*(p - sh) + sh; n = ma*n;
      }
      if (aPart == 1.) {                                     // the hood: head down to the work; the glance turns it up and toward the mountain
        vec3 nk = vec3(0., 1.56, 0.); mat3 mh = rotY(-uSide*.75*g.w)*rotX(-.22 + .62*g.w); p = mh*(p - nk) + nk; n = mh*n;
      }
      vec3 pv = vec3(0., .93, 0.); mat3 ml = rotX(-heave); p = ml*(p - pv) + pv; n = ml*n;
    }
    p.y += .025*cos(2.*ph) - .03;                            // the body rises and sinks with the steps
    p *= sc;
  }
  yaw = root.w; mat3 my = rotY(yaw); p = my*p + root.xyz; n = my*n;
  vec4 w = modelMatrix*vec4(p, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix)*n); vC = color; vPart = aPart;
  gl_Position = projectionMatrix*viewMatrix*w;
}`,he=`
precision highp float;
varying vec3 vW, vN, vC; varying float vPart;
${q}
void main(){
  vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
  vec3 v = normalize(cameraPosition - vW);
  vec3 c = vC*sbvLight(vW, n);
  // a soft rim so the dark coats keep their outline: red toward the fire, blue from the sky
  float rim = pow(clamp(1. - dot(n, v), 0., 1.), 3.);
  // (cloth and wood take none of it: the sledge and its load have no sheen)
  c += rim*(.05*uSkyCol + .22*sbvFire(vW, n))*(.4 + vC)*(vPart > 8.5 ? .15 : 1.);
  gl_FragColor = vec4(sbvFog(c, length(cameraPosition - vW), 1.), 1.);
}`;function ne(r,u,i,a,t,s){r.id(0).color(i),r.tube([[0,.4,.01,[.3,.255]],[0,.7,.01,[.262,.22]],[0,.93,0,[.23,.19]],[0,1.1,0,[.215,.18]],[0,1.3,0,[.245,.19]],[0,1.46,0,[.25,.17]],[0,1.55,0,[.13,.11]]],10,!0,!0),r.color(a).tube([[0,1.07,0,[.225,.19]],[0,1.13,0,[.225,.19]]],10,!1,!1),r.id(1).color(i).ball(0,1.69,.01,.15,.165,.17,10,7),r.color(a).ball(0,1.675,-.1,.105,.115,.05,8,5),r.color(t);for(let n=0;n<9;n++){const f=n/9*Math.PI*2;r.ball(Math.cos(f)*.125,1.68+Math.sin(f)*.135,-.125,.05,.05,.045,5,4)}r.color(i).tube([[0,1.5,.02,[.19,.15]],[0,1.6,.02,[.16,.15]]],8,!1,!1);for(const n of[-1,1])r.id(n<0?2:3).color(i).tube([[n*.24,1.46,0,.085],[n*.285,1.22,.02,.08],[n*.27,1.02,-.1,.07]],7,!0,!0),r.color(s).ball(n*.265,.95,-.14,.065,.085,.075,6,5);for(const n of[-1,1])r.id(n<0?4:5).color(a).tube([[n*.1,.95,0,.105],[n*.1,.5,0,.09]],7,!0,!0),r.id(n<0?6:7).color(a).tube([[n*.1,.52,0,.09],[n*.1,.1,.01,.075]],7,!0,!0),r.color(s).ball(n*.1,.055,-.07,.085,.055,.19,7,5)}function fe(r){r.id(9).color("#b9a07c");for(const a of[-1,1]){r.tube([[a*.29,.03,1.5,[.035,.03]],[a*.29,.03,-1.05,[.035,.03]],[a*.29,.1,-1.38,[.035,.03]],[a*.29,.3,-1.6,[.03,.028]]],5,!0,!0);for(const t of[-.9,-.2,.5,1.2])r.box(a*.29,.12,t,.02,.09,.03);r.box(a*.29,.21,.15,.022,.022,1.3)}r.box(0,.22,.15,.3,.015,1.3),r.tube([[-.29,.3,-1.6,.025],[.29,.3,-1.6,.025]],5,!0,!0);const u=[[.02,.37,1.02,.25,.17,.34,"#8d7e61"],[-.05,.43,.44,.28,.24,.4,"#857659"],[.06,.4,-.16,.27,.2,.37,"#93846a"],[-.03,.37,-.7,.26,.17,.35,"#88795d"],[.05,.32,-1.06,.19,.12,.21,"#7f7056"],[.09,.57,.2,.16,.085,.27,"#8a7b5f"],[-.1,.5,-.45,.14,.09,.2,"#806f55"]];for(const[a,t,s,l,c,n,f]of u)r.color(f).ball(a,t,s,l,c,n,9,6);const i=a=>{let t=.3;for(const s of u){const l=(a-s[2])/s[5];l>-1&&l<1&&(t=Math.max(t,s[1]+s[4]*Math.sqrt(1-l*l)))}return t};r.color("#2e261f");for(let a=0;a<6;a++){const t=1.2-a*.42,s=t-.42,l=(t+s)/2,c=a%2?1:-1;r.tube([[c*.3,.22,t,.011],[c*.2,i(l)*.8+.06,t*.7+l*.3,.011],[0,i(l)+.015,l,.011],[-c*.2,i(l)*.8+.06,s*.7+l*.3,.011],[-c*.3,.22,s,.011]],4,!0,!0)}}const de=`
attribute float aSide, aAlong; attribute vec3 aAcross;
uniform float uEnd, uDir;                  // drawn up to this z (uDir +1: the track runs toward -z)
varying vec2 vT; varying vec3 vW; varying float vWide;
void main(){
  vec4 w = modelMatrix*vec4(position, 1.);
  float dist = length(w.xyz - cameraPosition), half0 = .44, half1 = max(half0, dist*.0027);
  vec3 side = normalize(mat3(modelMatrix)*aAcross);
  w.xyz += side*aSide*half1; w.y += .04 + dist*.0004;
  vT = vec2(aSide*half1, aAlong); vW = w.xyz; vWide = half1/half0;
  gl_Position = projectionMatrix*viewMatrix*w;
}`,ve=`
precision highp float;
uniform float uEnd, uDir; uniform vec3 uGroove;
varying vec2 vT; varying vec3 vW; varying float vWide;
${q}
float tH(float p){ p = fract(p*.1031); p *= p + 33.33; p *= p + p; return fract(p); }
float tN(float p){ float i = floor(p), f = fract(p); f = f*f*(3. - 2.*f); return mix(tH(i), tH(i + 1.), f); }
// one walker's footmarks: a mark a step, left and right by turns, each a little out of place, of its own size and depth
float tMark(float x, float y, float stp, float off, float key){ float si = floor(y/stp), sd = mod(si, 2.) < .5 ? -1. : 1.;
  vec2 fp = vec2(x - off - sd*(.09 + .05*(tH(si + key) - .5)), y - (si + .5 + .45*(tH(si + key*1.7) - .5))*stp);
  return (1. - smoothstep(.6, 1.2, length(fp/vec2(.065 + .03*tH(si + key*2.3), .15))))*(.3 + .7*tH(si + key*3.1)); }
void main(){
  if ((uEnd - vT.y)*uDir > 0.) discard;
  float wide = clamp(vWide, 1., 40.), x = vT.x/wide, ax = abs(x);       // metres across the real track
  // (polish 1, third part, C3) a sledge track is two faint runner lines and the footmarks between them, in the blue of
  // snow in shadow, a little darker than the snow and uneven; never a solid band. Each mark is drawn as its mean over
  // the pixel's footprint (fx across the track, fy along it, in the track's own metres), so far off and end-on the
  // footmarks melt into a faint trodden middle and the two lines into one soft line. The track has no colour of its
  // own: it takes a share of the light off the snow under it (uGroove: the share kept where a mark is deepest), so it
  // is always that snow, a little darker and bluer, whatever lights it.
  float fx = max(fwidth(vT.x)/wide, 1e-4), fy = max(fwidth(vT.y), 1e-4);
  float press = mix(.55 + .9*tN(vT.y/2.7 + 3.*sign(x)), 1., smoothstep(1., 4., fy));      // the runners bite unevenly, each its own way
  float run = clamp((min(ax + .5*fx, .325) - max(ax - .5*fx, .255))/fx, 0., 1.)*press;
  float mark = max(tMark(x, vT.y, ${(V(0)/2).toFixed(4)}, .07, 7.3), tMark(x, vT.y, ${(V(1)/2).toFixed(4)}, -.07, 41.7));        // the two walk between the runners, each at its own step (stepOf: half a cycle to a mark)
  float trod = (1. - smoothstep(.14, .28, ax))*.2;                                         // what the marks come to, taken together
  float foot = mix(mark, trod, max(smoothstep(.12, .4, fy), smoothstep(.04, .14, fx)));
  float a = max(run*.55, foot*.5)*(1. - smoothstep(.38, .44, ax));
  a *= smoothstep(0., 3., abs(uEnd - vT.y));
  float q = uFogDen*length(vW - cameraPosition); a *= exp(-q*q);                          // lost in the haze as the snow under it is
  gl_FragColor = vec4(uGroove*a, a);                                                      // (blended as: the snow under it x (1 - a x (1 - uGroove)))
}`;function me(r,u,i,a={}){const t=i.length,s=new Float32Array(t*2*3),l=new Float32Array(t*2),c=new Float32Array(t*2),n=new Float32Array(t*2*3),f=[];let d=0;for(let o=0;o<t;o++){const[F,x]=i[o],A=u(F,x),M=i[Math.max(0,o-1)],P=i[Math.min(t-1,o+1)],T=P[0]-M[0],R=P[1]-M[1],C=Math.hypot(T,R)||1;o>0&&(d+=Math.hypot(F-i[o-1][0],x-i[o-1][1]));for(let h=0;h<2;h++){const v=o*2+h;s.set([F,A,x],v*3),l[v]=h?1:-1,c[v]=a.bends?d:x,n.set(a.bends?[-R/C,0,T/C]:[1,0,0],v*3)}if(o<t-1){const h=o*2;f.push(h,h+1,h+2,h+1,h+3,h+2)}}const p=new e.BufferGeometry;p.setAttribute("position",new e.BufferAttribute(s,3)),p.setAttribute("aSide",new e.BufferAttribute(l,1)),p.setAttribute("aAlong",new e.BufferAttribute(c,1)),p.setAttribute("aAcross",new e.BufferAttribute(n,3)),p.setIndex(f);const B={...X(r),uEnd:{value:a.end??-1e5},uDir:{value:1},uGroove:{value:new e.Color().setRGB(.3,.46,.82)}},H=new e.ShaderMaterial({uniforms:B,vertexShader:de,fragmentShader:ve,transparent:!0,depthWrite:!1,side:e.DoubleSide,blending:e.CustomBlending,blendSrc:e.DstColorFactor,blendDst:e.OneMinusSrcAlphaFactor,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),b=new e.Mesh(p,H);return b.name="track",b.frustumCulled=!1,b.renderOrder=1,{object:b,uniforms:B}}const pe=`
attribute float aSide, aT, aIdx;
uniform vec3 uEnds[4];
void main(){
  vec3 a = aIdx < .5 ? uEnds[0] : uEnds[2], b = aIdx < .5 ? uEnds[1] : uEnds[3];
  vec3 p = mix(a, b, aT); p.y -= .05*4.*aT*(1. - aT);
  // a trace is a thin band whose flat side is turned to the eye's place (not the lens)
  vec4 w = modelMatrix*vec4(p, 1.); vec3 along = (modelMatrix*vec4(b - a, 0.)).xyz, toEye = cameraPosition - w.xyz;
  vec3 side = normalize(cross(along, toEye) + vec3(0., 1e-5, 0.));
  w.xyz += side*aSide*max(.011, length(toEye)*.0011);
  gl_Position = projectionMatrix*viewMatrix*w;
}`,ge="precision highp float; uniform vec3 uCol; void main(){ gl_FragColor = vec4(uCol, 1.); }",we=`
attribute vec3 aI;                                 // which of the two, when in the breath it leaves (s), seed
uniform float uTime; uniform vec3 uHeadA, uHeadB; uniform vec4 uBreath;      // wind x, wind z, the walkers' speed (m/s toward -z), breath period (s)
uniform vec2 uBreathPh;                            // where in a breath each of the two is when the clock starts (s, seeded)
varying vec2 vUv; varying float vA; varying vec3 vW;
void main(){
  float per = uBreath.w*(aI.x > .5 ? .86 : 1.), age = mod(uTime + (aI.x > .5 ? uBreathPh.y : uBreathPh.x) - aI.y, per), life = 1.5, k = clamp(age/life, 0., 1.);
  vec3 p = (aI.x > .5 ? uHeadB : uHeadA) + vec3(uBreath.x*age*.55, .1*age + .05*sin(aI.z*40.), uBreath.z*age + uBreath.y*age*.55 - .28*(1. - exp(-age*3.)));
  vec4 w = modelMatrix*vec4(p, 1.);
  // the puff faces the eye's place (not the lens)
  vec3 toEye = normalize(cameraPosition - w.xyz), r = normalize(cross(vec3(0., 1., 0.), toEye) + vec3(1e-4, 0., 0.)), u = cross(toEye, r);
  vUv = position.xy*2.; w.xyz += (r*vUv.x + u*vUv.y)*(.09 + .5*sqrt(k))*.5; vW = w.xyz;
  vA = step(age, life)*smoothstep(0., .08, k)*(1. - k)*(1. - k)*.42;
  gl_Position = projectionMatrix*viewMatrix*w;
}`,xe=`
precision highp float;
varying vec2 vUv; varying float vA; varying vec3 vW;
${q}
void main(){ float r2 = dot(vUv, vUv); float a = clamp(exp(-r2*3.) - .05, 0., 1.)*vA*smoothstep(1.2, 4., length(cameraPosition - vW)); if (a < .004) discard;
  vec3 c = vec3(.8, .84, .9)*(sbvSky(vec3(0., 1., 0.)) + sbvFire(vW, normalize(uFirePos - vW))*.6); gl_FragColor = vec4(sbvFog(c, length(cameraPosition - vW), 1.)*a, a); }`;function ye(r,u,i){const t=[];for(let f=0;f<2;f++)for(let d=0;d<5;d++)t.push(f,d*.11,(f*5+d)*.137%1);const s=new e.InstancedBufferGeometry,l=new e.PlaneGeometry(1,1);s.index=l.index,s.setAttribute("position",l.getAttribute("position")),s.setAttribute("aI",new e.InstancedBufferAttribute(new Float32Array(t),3)),s.instanceCount=10;const c={...X(r),uHeadA:{value:new e.Vector3},uHeadB:{value:new e.Vector3},uBreath:{value:new e.Vector4(u[0]*2,u[1]*2,.9,2.3)},uBreathPh:{value:new e.Vector2(i[0],i[1])}},n=new e.Mesh(s,new e.ShaderMaterial({uniforms:c,vertexShader:we,fragmentShader:xe,transparent:!0,depthWrite:!1,side:e.DoubleSide,blending:e.CustomBlending,blendSrc:e.OneFactor,blendDst:e.OneMinusSrcAlphaFactor,blendSrcAlpha:e.OneFactor,blendDstAlpha:e.OneMinusSrcAlphaFactor}));return n.frustumCulled=!1,n.renderOrder=6,n.name="breath",{object:n,uniforms:c}}async function be(r,u={}){const i=u.shared||re(),a=u.ground||(()=>0),t=u.track||{x:0,z0:0},s=u.cast||{},l=r.noise,c=new e.Group;c.name="travellers";const n=u.rng||r.rng.fork("two"),f={a:n.range(0,6.283),b:n.range(0,6.283),breath:[n.range(0,2.3),n.range(0,2.3)],glance:n.range(0,6.283)},d=new ue,p=[0];ne(d,0,"#3d2c20","#241a14","#b9aa92","#7d6c58"),p.push(d.p.length/3),ne(d,1,"#75777e","#3f4148","#c9c2b4","#807260"),p.push(d.p.length/3),fe(d);const B=d.geometry(),H=d.p.length/3,b=new Float32Array(H);for(let m=p[1];m<p[2];m++)b[m]=1;B.setAttribute("aFig",new e.BufferAttribute(b,1)),await r.yield();const o={...X(i),uRootA:{value:new e.Vector4},uRootB:{value:new e.Vector4},uSledge:{value:new e.Vector4},uGaitA:{value:new e.Vector4(0,.44,0,0)},uGaitB:{value:new e.Vector4(0,.44,s.push?1:0,0)},uSledgeTilt:{value:new e.Vector4},uSide:{value:u.side??1}},F=new e.ShaderMaterial({uniforms:o,vertexShader:ce,fragmentShader:he,vertexColors:!0,side:e.DoubleSide}),x=new e.Mesh(B,F);x.name="two-and-sledge",x.frustumCulled=!1,c.add(x);const A=6,M=[],P=[],T=[],R=[],C=[];for(let m=0;m<2;m++)for(let g=0;g<=A;g++)for(let W=0;W<2;W++)if(M.push(0,0,0),P.push(W?1:-1),T.push(g/A),R.push(m),g<A&&W===0){const y=(m*(A+1)+g)*2;C.push(y,y+1,y+2,y+1,y+3,y+2)}const h=new e.BufferGeometry;h.setAttribute("position",new e.Float32BufferAttribute(M,3)),h.setAttribute("aSide",new e.Float32BufferAttribute(P,1)),h.setAttribute("aT",new e.Float32BufferAttribute(T,1)),h.setAttribute("aIdx",new e.Float32BufferAttribute(R,1)),h.setIndex(C);const v=[new e.Vector3,new e.Vector3,new e.Vector3,new e.Vector3],_=new e.Mesh(h,new e.ShaderMaterial({uniforms:{uEnds:{value:v},uCol:{value:new e.Color("#0d0a09")}},vertexShader:pe,fragmentShader:ge,side:e.DoubleSide}));_.name="traces",_.frustumCulled=!1,c.add(_);let E=null;if(u.trackLine!==!1){const m=[];for(let g=t.zFoot??t.z0+60;g>=t.z0-56;g-=2)m.push([t.xAt?t.xAt(g):t.x,g]);E=me(i,a,m),c.add(E.object)}const j=ye(i,u.wind||[-.984,.178],f.breath);c.add(j.object);const L=new e.Vector3(t.x,a(t.x,t.z0)+1,t.z0),se=V(0),$=s.lead??0,G=!!s.push,Y={object:c,position:L,track:E,uniforms:o,triangles:H/3,update(m,g,W,y=0){const z=y,O=t.z0-z,D=z/se*Math.PI*2+f.a,K=z/V(1)*Math.PI*2+f.b,ie=.1*Math.sin(2*D-.9)+.06*Math.sin(2*K-.9),w=O+5.9-ie,k=t.xAt?t.xAt(w):t.x,Z=a(k,w),N=Math.atan2(a(k,w-1.4)-a(k,w+1.4),2.8);o.uSledge.value.set(k,Z+.02,w,0),o.uSledgeTilt.value.set(N+.018*l.n2(z*1.3,5.5)+.012*Math.sin(2*D-2.2),.045*l.n2(z*.8,1.2),0,0);const J=(S,I,U,te)=>{const ae=(t.xAt?t.xAt(O+te):t.x)+U,oe=O+te;S.value.set(ae,a(ae,oe),oe,0)};J(o.uRootA,0,G?0:.55,$===0?-.35:.35),G?o.uRootB.value.set(k,a(k,w+1.95),w+1.95,0):J(o.uRootB,1,-.55,$===1?-.35:.35),o.uGaitA.value.x=D,o.uGaitB.value.x=K,o.uGaitA.value.y=.44,o.uGaitB.value.y=G?.5:.44,o.uGaitB.value.w=G?0:le(.62,.9,Math.sin(z*.9+f.glance));const Q=(S,I)=>I.set(k+S*.2,Z+.3+Math.sin(N)*1.6,w-1.6*Math.cos(N)),ee=(S,I,U)=>U.set(S.value.x,S.value.y+1*I,S.value.z+.12);Q(.5,v[0]),ee(o.uRootA,1,v[1]),G?(v[2].copy(v[0]),v[3].copy(v[0])):(Q(-.5,v[2]),ee(o.uRootB,.892,v[3])),L.set((o.uRootA.value.x+o.uRootB.value.x)*.5,o.uRootA.value.y+1,(o.uRootA.value.z+o.uRootB.value.z)*.5),E&&(E.uniforms.uEnd.value=w+1.2),j.uniforms.uHeadA.value.set(o.uRootA.value.x,o.uRootA.value.y+1.5,o.uRootA.value.z-.5),j.uniforms.uHeadB.value.set(o.uRootB.value.x,o.uRootB.value.y+1.36,o.uRootB.value.z-.46)}};return Y.update(0,0,null,0),Y}async function Be(r,u={}){const i=u.shared||re();u.shared||(i.uFirePos.value.set(200,40,-40),i.uFire.value.set(110,1.6,.25,0),i.uFireZ.value.set(-1e5,-9e4));const a=await be(r,{shared:i,track:{x:0,z0:0,zFoot:30},...u});return u.shared||a.object.scale.setScalar(8),{object:a.object,radius:14,height:14,center:new e.Vector3(0,7,16),ground:!0,groundY:-.1,update(t,s,l){a.update(t,s,l,s*.9%50)}}}export{fe as addSledge,Be as buildHero,be as buildTravellers,me as makeTrack};
