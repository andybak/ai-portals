import*as h from"three";import"../kit/core.js";import{LIGHT_GLSL as L,TOWN_LIT_GLSL as Y,STAR_DIR as V,RIVER as J}from"./old-light-arriving-common.js";const g=J,P=s=>s.toFixed(1),z=`
vec3 fleetCourse(float o, float d, out float hd){
  float Rp = 120. - o, R = max(120. + o, 1.), B = Rp*1.5708, D = R*1.5708;
  if (d < ${P(g.ARM)}) { hd = 1.5708; return vec3(${P(120+g.ARM)} - d, 0., ${P(g.ZB)} + Rp); } d -= ${P(g.ARM)};
  if (d < B) { float f = d/Rp; hd = 1.5708 - f; return vec3(120. - Rp*sin(f), 0., ${P(g.ZB)} + Rp*cos(f)); } d -= B;
  if (d < ${P(g.ZB+40)}) { hd = 0.; return vec3(o, 0., ${P(g.ZB)} - d); } d -= ${P(g.ZB+40)};
  if (d < D) { float th = d/R; hd = th; return vec3(-120. + R*cos(th), 0., -40. - R*sin(th)); } d -= D;
  if (d < ${P(g.XK-120)}) { hd = 1.5708; return vec3(-120. - d, 0., -40. - R); } d -= ${P(g.XK-120)};
  if (d < D) { float ps = d/R; hd = 1.5708 + ps; return vec3(-${P(g.XK)} - R*sin(ps), 0., -40. - R*cos(ps)); } d -= D;
  hd = 3.14159265; return vec3(-${P(g.XK)} - R, 0., -40. + d);
}
float fleetLen(float o){ return ${P(g.ARM+g.ZB+40+g.XK-120+g.ZE+40)} + 1.5708*(360. + o); }
vec3 boatPoint(vec3 p, vec4 m, vec4 s){
  vec3 c; float hd;
  if (s.y > .5) { c = vec3(m.x, 0., m.y); hd = m.z; }
  else { c = fleetCourse(m.x, mod(m.y + m.z*uTime, fleetLen(m.x)), hd); }
  p *= s.x;
  float ph = m.w, k = step(.5, s.z);                                                               // s.z = 1: it floats (rocks); 0: it stands on land
  p.y += k * (p.x*.022*sin(uTime*.7 + ph) + p.z*.012*sin(uTime*.53 + ph*1.7) + .06*sin(uTime*.9 + ph));
  float ch = cos(hd), sh = sin(hd);
  return c + vec3(p.x*ch + p.z*sh, p.y, -p.x*sh + p.z*ch);
}`,ze=s=>g.ARM+g.ZB+40+g.XK-120+g.ZE+40+Math.PI/2*(360+s);function Ie(s,a){const e=120-s,t=Math.max(120+s,1),r=e*Math.PI/2,l=t*Math.PI/2;if(a<g.ARM)return[120+g.ARM-a,g.ZB+e,Math.PI/2];if(a-=g.ARM,a<r){const i=a/e;return[120-e*Math.sin(i),g.ZB+e*Math.cos(i),Math.PI/2-i]}if(a-=r,a<g.ZB+40)return[s,g.ZB-a,0];if(a-=g.ZB+40,a<l){const i=a/t;return[-120+t*Math.cos(i),-40-t*Math.sin(i),i]}if(a-=l,a<g.XK-120)return[-120-a,-40-t,Math.PI/2];if(a-=g.XK-120,a<l){const i=a/t;return[-g.XK-t*Math.sin(i),-40-t*Math.cos(i),Math.PI/2+i]}return a-=l,[-g.XK-t,-40+a,Math.PI]}const ee=120,j=3.5,te=.55,ae=2,oe=10,ne=`
// r2: the square of the distance from the light's middle in units of its (widened) radius; light: its strength times the share of the
// card's area that is the light itself; halo: the glass and the air round it; globe: 1 for a held globe, 0 for a flame
vec3 lampLight(float r2, float light, float halo, float globe){
  float q = clamp(r2, 0., 60.), flame = light * ${ee}. * exp(-q*1.6);
  float lm = clamp(1. - q, 0., 1.), skin = light * ${oe}. * lm * sqrt(lm);                          // brightest at its middle, amber toward its limb
  float x = mix(flame, skin, globe);
  return vec3(1., .44, .095) * (${j} * (1. - exp(-x/${j})) + halo * light * exp(-q*.42));
}`,se=[-1,-1,0,3,-1,0,-1,3,0];function Te(s,a,e,t={}){const r=e.length,l=new h.InstancedBufferGeometry;l.setAttribute("position",new h.Float32BufferAttribute(se,3));const i=new Float32Array(r*4),p=new Float32Array(r*4),x=new Float32Array(r*4),y=new Float32Array(r*4);e.forEach((v,o)=>{i.set([v.p[0],v.p[1],v.p[2],v.size>=.15?v.size*te:v.size*ae*(.8+.4*((v.ph||0)*3.7%1))],o*4),p.set([v.bright,v.ph||0,v.sway||0,v.size>=.15?1:0],o*4),x.set(v.m||[0,0,0,0],o*4),y.set(v.s||[1,1,0,0],o*4)}),l.setAttribute("aP",new h.InstancedBufferAttribute(i,4)),l.setAttribute("aQ",new h.InstancedBufferAttribute(p,4)),l.setAttribute("aM",new h.InstancedBufferAttribute(x,4)),l.setAttribute("aS",new h.InstancedBufferAttribute(y,4)),l.instanceCount=r;const b=5,u=new h.ShaderMaterial({uniforms:{...s,uRes:a.uRes,uGain:{value:t.gain??1},uHalo:a.uHalo||{value:.1}},defines:t.mirror?{MIRROR:1}:{},side:h.DoubleSide,transparent:!0,depthWrite:!1,blending:h.CustomBlending,blendEquation:h.AddEquation,blendSrc:h.OneFactor,blendDst:h.OneFactor,vertexShader:`attribute vec4 aP, aQ, aM, aS; uniform vec2 uRes; uniform float uGain; varying vec2 vQ; varying float vB, vD, vPh, vGlobe; ${L} ${t.pointGLSL||z}
      void main(){ vec3 p = boatPoint(aP.xyz, aM, aS);
        // a lamp on a line or a tether sways with the wind (aQ.z metres at most)
        p.xz += aQ.z * vec2(sin(uTime*.9 + aQ.y) + .4*sin(uTime*2.3 + aQ.y*1.7), .6*sin(uTime*.7 + aQ.y*2.1));
        vec4 w = modelMatrix*vec4(p, 1.); float sy = 1.;
        #ifdef MIRROR
          w.y = -w.y; sy = ${b}.;
        #endif
        vec4 mv = viewMatrix*w; float px = max(-mv.z * 2. / (projectionMatrix[1][1] * max(uRes.y, 1.)), 1e-5);   // metres under one pixel there
        float size = aP.w * aS.x; vec2 least = olaLeast(size, px); float rad = least.x, share = least.y / sy;      // (the one law of the least pixel, in the common part)
        vQ = position.xy; float flame = aQ.w; vGlobe = 1. - flame;                                          // a lamp's flame gutters; a held globe is a steady light
        vB = aQ.x * share * uGain * (1. - flame*.22 + (.06 + .2*flame)*sin(uTime*(3.+3.*fract(aQ.y)) + aQ.y*7.) * (.6 + .4*sin(uTime*1.3 + aQ.y*3.))); vD = -mv.z; vPh = aQ.y;
        mv.xy += position.xy * rad * 3. * vec2(1., sy);
        gl_Position = projectionMatrix*mv; }`,fragmentShader:`uniform float uHalo; varying vec2 vQ; varying float vB, vD, vPh, vGlobe; ${L} ${ne}
      void main(){ vec2 q = vQ*3.;
        #ifdef MIRROR
          float yy = q.y*${b}.;                                                                  // along the image, in card units
          q.x += .45*sin(yy*1.7 + uTime*2.1 + vPh) * smoothstep(0., 2., abs(yy));                   // the water breaks the lamp's image into a wobbling streak
          float brk = .25 + .75*smoothstep(-.3, .5, sin(yy*2.6 - uTime*2.7 + vPh*3.) + .6*sin(yy*.9 + uTime*1.1 + vPh));      // and into pieces
          float r2 = q.x*q.x + q.y*q.y; vec3 c = lampLight(r2, vB * brk, 0., vGlobe) * .45;
        #else
          float r2 = dot(q, q); vec3 c = lampLight(r2, vB, uHalo, vGlobe);
        #endif
        if (max(abs(vQ.x), abs(vQ.y)) > 1.) discard;
        c *= (1. - smoothstep(5., 9., r2));
        gl_FragColor = vec4(c * exp(-vD*vD*uFogDen*uFogDen*.5), 1.); }`}),f=new h.Mesh(l,u);return f.renderOrder=t.mirror?2:3,t.sphere?l.boundingSphere=new h.Sphere(new h.Vector3(t.sphere[0],t.sphere[1],t.sphere[2]),t.sphere[3]):f.frustumCulled=!1,{object:f,material:u,count:r}}function D(s,a,e){const{P:t,N:r,C:l,K:i,I:p}=s,x=[.115,.11,.12],y=[.045,.045,.055],b=[.2,.17,.135];let u=null;for(const f of a){const v=[];for(const[o,n,c,m,d,w]of[[-f.half,f.deck,b,0,1,1],[-f.half,f.deck,x,-1,.2,0],[-f.half*.86,.35,y,-1,.1,0],[-f.half*.7,-.3,y,-.8,-.5,0],[f.half*.7,-.3,y,.8,-.5,0],[f.half*.86,.35,y,1,.1,0],[f.half,f.deck,x,1,.2,0],[f.half,f.deck,b,0,1,1]])t.push(o,n,f.z),r.push(m,d,0),l.push(c[0],c[1],c[2]),i.push(w===1?e:0),v.push(t.length/3-1);if(u){for(const o of[1,2,4,5])p.push(u[o],u[o+1],v[o],u[o+1],v[o+1],v[o]);p.push(u[0],v[0],u[7],v[0],v[7],u[7])}u=v}}function A(s,a,e,t,r,l,i,p,x=0){const{P:y,N:b,C:u,K:f,I:v}=s,o=(n,c)=>{const m=y.length/3;for(const d of n)y.push(d[0],d[1],d[2]),b.push(c[0],c[1],c[2]),u.push(p[0],p[1],p[2]),f.push(x);v.push(m,m+1,m+2,m,m+2,m+3)};o([[a,t,i],[e,t,i],[e,r,i],[a,r,i]],[0,0,1]),o([[e,t,l],[a,t,l],[a,r,l],[e,r,l]],[0,0,-1]),o([[e,t,i],[e,t,l],[e,r,l],[e,r,i]],[1,0,0]),o([[a,t,l],[a,t,i],[a,r,i],[a,r,l]],[-1,0,0]),o([[a,r,i],[e,r,i],[e,r,l],[a,r,l]],[0,1,0])}function Z(s,a,e,t,r,l){const{P:i,N:p,C:x,K:y,I:b}=s,u=i.length/3;for(let f=0;f<=e;f++)for(let v=0;v<=a;v++){const o=t(v/a,f/e);i.push(o[0],o[1],o[2]),p.push(0,1,0),x.push(r[0],r[1],r[2]),y.push(l)}for(let f=0;f<e;f++)for(let v=0;v<a;v++){const o=u+f*(a+1)+v;b.push(o,o+a+1,o+1,o+1,o+a+1,o+a+2)}}const K=()=>({P:[],N:[],C:[],K:[],I:[]});function re(s,a,e){let t=0;for(let r=0;r<e.length;r+=3){const l=e[r]*3,i=e[r+1]*3,p=e[r+2]*3,x=s[i]-s[l],y=s[i+1]-s[l+1],b=s[i+2]-s[l+2],u=s[p]-s[l],f=s[p+1]-s[l+1],v=s[p+2]-s[l+2],o=y*v-b*f,n=b*u-x*v,c=x*f-y*u,m=Math.hypot(o,n,c),d=a[l]+a[i]+a[p],w=a[l+1]+a[i+1]+a[p+1],M=a[l+2]+a[i+2]+a[p+2],S=Math.hypot(d,w,M);m>1e-9&&S>1e-9&&o*d+n*w+c*M<-.25*m*S&&t++}return t}function ie(s,a,e,t){const r=re(s,a,e);if(r)throw new Error(`old-light-arriving: ${r} of ${e.length/3} triangles of ${t} are wound against the normals they store`)}const I=(s,a="a solid")=>{ie(s.P,s.N,s.I,a);const e=new h.BufferGeometry;return e.setAttribute("position",new h.Float32BufferAttribute(s.P,3)),e.setAttribute("normal",new h.Float32BufferAttribute(s.N,3)),e.setAttribute("color",new h.Float32BufferAttribute(s.C,3)),e.setAttribute("aPart",new h.Float32BufferAttribute(s.K,1)),e.setIndex(s.I),e},le=[.21,.22,.27],T=[.06,.05,.05];function ce(){const s=K(),a=[];for(let e=0;e<=10;e++){const t=e/10,r=-22+44*t,l=Math.abs(2*t-1);a.push({z:r,half:4.5*Math.pow(Math.max(1-Math.pow(l,3.2),.02),.6),deck:1.5+1.1*Math.pow(l,2.4)*(t<.5?1:.6)})}D(s,a,1);for(const e of[-7,1,9])for(const t of[-3.6,3.6])A(s,t-.12,t+.12,1.5,4.4,e-.12,e+.12,T);return Z(s,4,5,(e,t)=>[-4.1+8.2*e,4.4+.9*Math.sin(Math.PI*e),-8+18*t],le,2),A(s,-.16,.16,1.5,12,-13.2,-12.8,T),A(s,-1.6,1.6,1.5,3.4,13,18,[.13,.12,.12]),I(s)}function he(){const s=K(),a=[];for(let e=0;e<=7;e++){const t=e/7,r=-5+10*t,l=Math.abs(2*t-1);a.push({z:r,half:1.5*Math.pow(Math.max(1-Math.pow(l,2.6),.02),.6),deck:.8+.5*Math.pow(l,2.2)})}return D(s,a,1),A(s,-.07,.07,.8,9.4,-1.1,-.9,T),Z(s,3,4,(e,t)=>[.05+.5*Math.sin(Math.PI*t)*Math.sin(Math.PI*e),2+6.6*t,-.8+(4.6-3.4*t)*e],[.3,.31,.36],2.5),I(s)}function fe(){const s=K(),a=[];for(let t=0;t<=12;t++){const r=t/12,l=-45+90*r,i=Math.abs(2*r-1);a.push({z:l,half:9*Math.pow(Math.max(1-Math.pow(i,4),.02),.6),deck:2.4+1.4*Math.pow(i,2.6)})}D(s,a,1);const e=[.3,.3,.34];for(const[t,r,l,i]of[[7.4,-34,34,2.4],[6.2,-27,27,6.2],[5,-19,20,10]])A(s,-t,t,i,i+.5,r,l,e),A(s,-t+.3,t-.3,i+.5,i+3.1,r+.5,l-.5,[1,1,1],3),A(s,-t-.9,t+.9,i+3.1,i+3.5,r-1.2,l+1.2,[.11,.1,.11]);return A(s,-.25,.25,13.5,24,-6.3,-5.7,T),I(s)}const $e={barge:{len:44,beam:9,top:12},sail:{len:10,beam:3,top:9.4},great:{len:90,beam:18,top:24}},Qe=s=>s==="barge"?ce():s==="sail"?he():fe();function Ke(s,a,e,t,r,l={}){const i=new h.InstancedBufferGeometry;i.index=a.index;for(const f of["position","normal","color","aPart"])i.setAttribute(f,a.getAttribute(f));const p=new Float32Array(e.length*4),x=new Float32Array(e.length*4);e.forEach((f,v)=>{p.set(f.m,v*4),x.set(f.s,v*4)});const y=new Float32Array(e.length*2);e.forEach((f,v)=>{y[v*2]=f.lit||0,y[v*2+1]=f.y||0}),i.setAttribute("aM",new h.InstancedBufferAttribute(p,4)),i.setAttribute("aS",new h.InstancedBufferAttribute(x,4)),i.setAttribute("aL",new h.InstancedBufferAttribute(y,2)),i.instanceCount=e.length;const b=new h.ShaderMaterial({uniforms:{...s},side:h.DoubleSide,defines:l.house?{HOUSE:1}:{},vertexShader:`attribute vec3 color; attribute float aPart; attribute vec4 aM, aS; attribute vec2 aL; varying vec3 vW, vN, vCol, vL, vNL; varying float vPart, vTint, vLit; ${L} ${Y} ${r||z}
      void main(){ vec3 p = position; float cloth = step(1.5, aPart) * step(aPart, 2.7), skin = step(5.5, aPart);
        p += skin * normal * .12 * sin(uTime*.8 + p.z*.21 + aM.w) * sin(p.z*.07 + 1.);                 // a sewn envelope breathes a little
        p.y += cloth * (.16*sin(uTime*1.7 + p.z*.9 + aM.w) + .1*sin(uTime*2.9 + p.x*1.3)) * (aPart > 2.2 ? 0. : 1.);      // the canopy lifts and falls
        p.x += step(2.2, aPart) * step(aPart, 2.7) * .35*sin(uTime*1.3 + p.y*.7 + aM.w) * smoothstep(2., 6., p.y);       // the sail breathes
        vec3 a = boatPoint(p, aM, aS), b = boatPoint(p + normal, aM, aS); a.y += aL.y; b.y += aL.y;
        vLit = aS.y > .5 ? aL.x : olaTownLit(boatPoint(vec3(0.), aM, aS));      // (a craft that stands or lies still carries the star's light found at its place in the build; one under way finds it where it is: the town's hill's shade law)
        vec4 w = modelMatrix*vec4(a, 1.); vW = olaW(w.xyz); vN = olaW(mat3(modelMatrix)*(b - a)); vCol = color; vL = position; vNL = normal; vPart = aPart; vTint = aS.w;
        gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`varying vec3 vW, vN, vCol, vL, vNL; varying float vPart, vTint, vLit; ${L}
      void main(){ if (vW.y < -.02) discard;
        vec3 n = normalize(vN + vec3(0., 1e-4, 0.)); if (!gl_FrontFacing) n = -n;
        vec3 alb = vCol * (.8 + .4*vTint);
        float fwX = fwidth(vL.x), fwY = fwidth(vL.y), fwZ = fwidth(vL.z);                              // (every derivative is taken here, before any branch)
        float deck = step(.5, vPart) * step(vPart, 1.5), fine = clamp(1.3 - 3.*fwX, 0., 1.);
        alb *= 1. - .25*deck*fine*step(.86, fract(vL.x*2.2));                                      // deck planks
        float roof = step(3.5, vPart) * step(vPart, 4.5), wall = step(4.5, vPart);
        float fineR = clamp(1.2 - 4.*(fwX + fwZ), 0., 1.);
        alb *= 1. - .16*roof*fineR*step(.8, fract((abs(vNL.x) > .3 ? vL.z : vL.x)*1.25));            // roof ribs, down the slope
        alb *= 1. - .1*roof*clamp(1.2 - 5.*fwY, 0., 1.)*step(.82, fract(vL.y*3.1));                   // and the tiles' courses across it
        alb = mix(alb, vec3(.5,.54,.62), uSnow * roof * step(.3, n.y));                             // snow on the roofs
        vec3 Ve = olaW(cameraPosition) - vW, Vn = Ve / max(length(Ve), 1e-3);
        float rim = 1. - abs(dot(n, Vn)); rim *= rim*rim;                                           // the turn of a hull, a roof's edge, an envelope's flank
        vec3 c = alb * olaLight(n, vLit) + alb * (uBandCol*.9 + uStarCol*vLit*.8) * rim;              // (a faint cool rim from the far side's light and the star's)
        #ifdef HOUSE
          c += vCol * vec3(1., .44, .095) * .55 * step(n.y, -.5) * (1. - roof) * (1. - wall);       // the eaves' undersides take the windows' and the lamps' amber
          c += vCol * vec3(1., .44, .095) * .1 * step(.5, n.y) * (1. - roof) * (1. - wall);         // and the plinth before the door
        #else
          c += vCol * vec3(1., .44, .095) * .35 * deck;                                             // a deck lies in its own lamps' light
        #endif
        if (vPart > 2.7 && vPart < 3.5) {                                                                         // the lit decks: wide amber openings between posts
          float bayD = floor(vL.z/3.4), post = step(.12, fract(vL.z/3.4)), sill = smoothstep(.0, .25, fract((vL.y - .4)/3.8));
          float bay = .55 + .45*sin(3.14159*clamp((fract(vL.z/3.4) - .12)/.88, 0., 1.));           // (the lamps hang in the middle of each bay: its light falls off toward the posts)
          c = vec3(1., .44, .095) * 1.3 * bay * post * sill * (.82 + .18*sin(uTime*3.1 + 6.2832*olaHash(vec2(bayD, floor(vTint*997.) + step(0., vL.x)*31.))));      // (the one amber, no brighter than a boat's lamp; each opening gutters at its own seeded phase)
        }
        c += vCol * step(1.5, vPart) * step(vPart, 2.7) * vec3(1., .44, .095) * .06;               // cloth takes a little of the lamps under it
        if (vPart > 5.5) {                                                                         // an airship's cloth: sewn in gores, the seams show
          // (the gore a point lies in is found from its place round the hull without an arc tangent: sixteen gores, by the signs and the
          // ratio of its two coordinates; the seam's width is given in metres from the footprint of a pixel on the hull's own coordinates)
          vec2 hq = vL.xy; float hr = max(length(hq), 1e-3); vec2 hu = hq / hr;
          float c4 = abs(hu.x*hu.x - hu.y*hu.y), s4 = abs(2.*hu.x*hu.y), c8 = abs(c4*c4 - s4*s4), s8 = abs(2.*c4*s4);      // the angle folded four times: sixteen equal gores
          float foldA = min(c8, s8) / max(max(c8, s8), 1e-3);                                      // 0 on a seam line, 1 between two seams
          float pxh = max(fwX + fwY, 1e-4), seamW = clamp(.14 + 4.8*pxh/hr, .14, .8);
          float seam = (1. - smoothstep(0., seamW, foldA)) * clamp(1.4 - pxh/(hr*.2), 0., 1.);
          float hoop = 1. - smoothstep(0., .25 + fwZ, abs(fract(vL.z/9. + .5) - .5)*9.);
          float pan = .93 + .07*olaHash(vec2(floor(4.*step(0., hu.x) + 2.*step(0., hu.y) + step(abs(hu.y), abs(hu.x))), floor(vL.z/9. + .5)));           // each panel takes the light a little differently
          c = vCol * pan * (1. - .3*max(seam, hoop*.6)) * (olaLight(n, vLit) + (uBandCol*.9 + uStarCol*vLit*.8) * rim);
          c += vCol * vec3(1., .44, .095) * .05 * (1. - smoothstep(-.9, .2, n.y));                           // its belly takes a little of the gondola's lamps
        }
        if (wall > .5 && vPart < 5.5) {                                                            // a house wall: pale stone between dark timber posts, and openings that are not alike
          float u = abs(vNL.z) > .5 ? vL.x : vL.z + 31.7, seed = floor(vTint*997.), bw = 2.1 + 1.3*fract(vTint*7.31);      // each house has its own bay
          float fy = mod(vL.y - .35, 3.1), bay = floor(u/bw), flo = floor((vL.y - .35)/3.1), fu = fract(u/bw);
          float aa = clamp((abs(vNL.z) > .5 ? fwX : fwZ)/bw*.6, 0., .2), ay = clamp(fwY*.9, 0., .6);
          float kind = olaHash(vec2(bay + flo*17., seed));                                         // what this opening is tonight: dark, a low window, a room lit low, or wide open
          float between = smoothstep(.07 - aa, .09 + aa, fu) * (1. - smoothstep(.91 - aa, .93 + aa, fu));
          float hi = kind < .36 ? 1.3 : 2.6, lo = kind < .36 ? .8 : .75;
          float open = between * smoothstep(lo - ay, lo + .1 + ay, fy) * (1. - smoothstep(hi - ay, hi + .1 + ay, fy)) * step(.22, kind);
          float dimmed = step(.36, kind) * step(kind, .62);                                        // a room lit low: the same opening, less light
          // an opening is a room seen into: brightest about its middle, falling off toward the frame; a pale stone sill under it; one
          // timber post down the middle of a wide one
          float pu = (fu - .5)/.42, pv = (fy - (lo + hi)*.5)/max((hi - lo)*.5 + .05, .1), pane = 1. - .62*clamp(pu*pu*.75 + pv*pv*.55, 0., 1.);
          float mull = 1. - .85*(1. - smoothstep(.014 + aa, .03 + aa, abs(fu - .5))) * step(.62, kind);
          float sill = between * smoothstep(lo - .2 - ay, lo - .16 + ay, fy) * (1. - smoothstep(lo - .02 - ay, lo + .02 + ay, fy)) * step(.22, kind);
          float bright = mix(1., .42, dimmed) * (.6 + .4*olaHash(vec2(bay*3.1 + flo, seed + 3.)));
          float post = 1. - between, beam = max(1. - smoothstep(.1, .16, fy), smoothstep(2.82, 2.9, fy));
          vec3 wallC = mix(mix(vec3(.31,.31,.34) * (.9 + .2*olaHash(vec2(bay, flo + seed))), vec3(.42,.43,.47), sill), vec3(.085,.07,.065), max(post, beam)) * (olaLight(n, vLit) + vec3(1., .44, .095)*.12);
          c = mix(wallC, vec3(1., .44, .095) * .95 * pane * mull * bright * (.86 + .14*sin(uTime*2.3 + 6.2832*olaHash(vec2(bay + flo*13., seed + 5.)))), open);
        }
        gl_FragColor = vec4(olaFog(c, length(vW - olaW(cameraPosition))), 1.); }`}),u=new h.Mesh(i,b);return t?i.boundingSphere=new h.Sphere(new h.Vector3(t[0],t[1],t[2]),t[3]):u.frustumCulled=!1,{object:u,material:b}}function Ee(){const s={P:[],N:[],C:[],K:[],I:[]};return{G:s,box:(a,e,t,r,l,i,p,x=0)=>A(s,a,e,t,r,l,i,p,x),pole:(a,e,t,r,l=0)=>{const{P:i,N:p,C:x,K:y,I:b}=s,u=e[0]-a[0],f=e[2]-a[2],v=Math.hypot(u,f),o=v>.001?u/v:1,n=v>.001?f/v:0;for(const[c,m]of[[o,n],[-n,o],[-o,-n],[n,-o]]){const d=-m,w=c,M=i.length/3;for(const[S,C]of[[a,-1],[a,1],[e,1],[e,-1]])i.push(S[0]+c*t+d*t*C,S[1],S[2]+m*t+w*t*C),p.push(c,0,m),x.push(r[0],r[1],r[2]),y.push(l);b.push(M,M+2,M+1,M,M+3,M+2)}},blob:(a,e,t,r,l=0,i=0)=>{const{P:p,N:x,C:y,K:b,I:u}=s,f=p.length/3,v=ve.getAttribute("position");for(let o=0;o<v.count;o++){const n=v.getX(o),c=v.getY(o),m=v.getZ(o),d=1+.24*Math.sin(n*7.1+c*3.3+m*5.7+a[0]*1.3+a[2]*.7);p.push(a[0]+n*e*d,a[1]+c*t*(.85+.15*d),a[2]+m*e*d),x.push(n,c*.8+.2,m);const w=.62+.38*(c*.5+.5);y.push(r[0]*w,r[1]*w,r[2]*w),b.push(l+2*i)}for(let o=0;o<v.count;o++)u.push(f+o)},geometry:()=>I(s)}}const ve=new h.IcosahedronGeometry(1,0);function Ge(s,a,e=[.9,-.44]){const t=new h.ShaderMaterial({uniforms:{...s,uWind:{value:new h.Vector2(e[0],e[1]).normalize()}},side:h.DoubleSide,vertexShader:`attribute vec3 color; attribute float aPart; uniform vec2 uWind; varying vec3 vW, vN, vCol; varying float vLit, vCrown; ${L}
      void main(){ float sw = floor(aPart*.5 + .001); vLit = aPart - 2.*sw; vec3 p = position; vCrown = step(.5, sw);
        if (sw > .5) { float wt = .3 + .7*clamp((normal.y + .6)/1.6, 0., 1.);      // a crown in the wind: its top goes farthest
          p.xz += uWind * (.38*sin(uTime*1.1 + sw*1.3 + p.x*.05) + .16*sin(uTime*2.7 + sw*2.9 + p.z*.07)) * wt; }
        vec4 w = modelMatrix*vec4(p, 1.); vW = olaW(w.xyz); vN = olaW(mat3(modelMatrix)*normal); vCol = color; gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`varying vec3 vW, vN, vCol; varying float vLit, vCrown; ${L}
      void main(){ if (vW.y < -.02) discard; vec3 n = normalize(vN + vec3(0., 1e-4, 0.)); if (!gl_FrontFacing) n = -n;
        // a crown is leaves in clumps, not a smooth ball: lighter and darker masses, the snow lying on the upper clumps unevenly
        float leaf = olaNoise(vW.xz*.75 + vW.y*.6)*.6 + olaNoise(vW.xz*2.1 - vW.y*1.7)*.4, cr = step(.5, vCrown);
        vec3 alb = mix(vCol * mix(1., .62 + .8*leaf, cr), vec3(.5,.54,.62), uSnow * smoothstep(.45, .8, n.y + cr*.5*(leaf - .5)));
        vec3 Ve = olaW(cameraPosition) - vW, Vn = Ve / max(length(Ve), 1e-3); float rim = 1. - abs(dot(n, Vn));
        // (a crown has no outline of straight edges: toward its turning edge the leaves thin out raggedly, by the same clumps; only where
        // a clump is wider than a pixel)
        float nearC = clamp(1.6 - 1.2*(fwidth(vW.x) + fwidth(vW.z)), 0., 1.);
        if (cr > .5 && rim > mix(1.1, .34 + .7*olaNoise(vW.xz*.75 + vW.y*.6), nearC)) discard;
        rim *= rim;      // a crown's turning edge takes the far side's pearl, and the star's cold light where it is lit
        vec3 c = alb * (olaLight(n, vLit * olaBands(vW.xz)) + (uBandCol*1.1 + uStarCol*vLit) * rim + vec3(1., .44, .095) * .07 * (1. - smoothstep(-.6, .3, n.y)));      // (and from below a little of the lamps)
        gl_FragColor = vec4(olaFog(c, length(vW - olaW(cameraPosition))), 1.); }`});return{object:new h.Mesh(a,t),material:t}}const ue=`
float olaPerson(vec2 q, vec3 k){
  float sc = max(k.x, .3), x = abs(q.x - k.z*q.y) / sc, y = q.y / sc;
  float top = mix(.98, 1.62, k.y), sh = top - .3, hem = mix(.37, .25, k.y), shw = mix(.26, .215, k.y);
  float body = step(x, mix(hem, shw, smoothstep(.05, sh - .08, y)) * sqrt(clamp((sh + .04 - y)/.1, 0., 1.))) * step(0., y);
  float hood = step(x, mix(.2, .1, clamp((y - (sh - .06))/.2, 0., 1.))) * step(sh - .06, y) * step(y, top - .12);
  vec2 hc = vec2(x, y - (top - .14)); float head = step(dot(hc, hc), .0182);
  return max(body, max(hood, head)); }`,de=[[.19,.2,.25],[.23,.19,.2],[.15,.18,.225],[.25,.225,.22],[.18,.21,.2]],Oe=[[.19,.2,.25],[.15,.18,.225],[.17,.185,.23],[.205,.18,.24],[.185,.16,.215]],_=.3,qe=(s,a,e,t=[0,-1])=>{const r=(e||0)*2.3%1<.5?-1:1;return[s[0]-t[1]*r*_,s[1]+(a>1.4?.78:.38),s[2]+t[0]*r*_]};function De(s,a,e={}){const t=[],r=[],l=e.face||[0,-1];for(let n=0;n<2;n++){const c=t.length/3;t.push(-.5,0,n,.5,0,n,.5,1,n,-.5,1,n),r.push(c,c+1,c+2,c,c+2,c+3)}const i=new h.InstancedBufferGeometry;i.setAttribute("position",new h.Float32BufferAttribute(t,3)),i.setIndex(r);const p=a.length,x=new Float32Array(p*4),y=new Float32Array(p*4),b=new Float32Array(p*4),u=new Float32Array(p*4),f=e.cloths||de;a.forEach((n,c)=>{const m=f[n.tint%f.length],d=(n.ph||0)*2.3%1<.5?-1:1;x.set([n.p[0],n.p[1],n.p[2],n.h],c*4),y.set([m[0],m[1],m[2],n.lit??0],c*4),b.set(n.m||[0,0,0,0],c*4);const w=n.s||[1,1,0,0];u.set([w[0],w[1],w[2],n.lamp?d:0],c*4)});for(const[n,c]of[["aP",x],["aC",y],["aM",b],["aS",u]])i.setAttribute(n,new h.InstancedBufferAttribute(c,4));i.instanceCount=p;const v=new h.ShaderMaterial({uniforms:{...s,uFace:{value:new h.Vector2(l[0],l[1]).normalize()}},side:h.DoubleSide,vertexShader:`attribute vec4 aP, aC, aM, aS; uniform vec2 uFace; varying vec3 vW, vN, vT, vCol, vL; varying vec4 vK; varying vec2 vQ; varying float vWho; ${L} ${z}
      void main(){ float h = aP.w, stand = step(1.4, h), sc = h / mix(.98, 1.62, stand), prof = position.z;
        vec2 ax = mix(vec2(-uFace.y, uFace.x), uFace, prof);                                       // the card's own direction on the map
        float wide = .94 * sc * mix(1., .72, prof); vQ = vec2(position.x * .94 * sc, position.y * h * 1.03);
        vec3 q = aP.xyz + vec3(ax.x, 0., ax.y) * position.x * wide + vec3(0., position.y * h * 1.03, 0.);
        vec3 a = boatPoint(q, aM, aS), b = boatPoint(q + vec3(-ax.y, 0., ax.x), aM, aS), t = boatPoint(q + vec3(ax.x, 0., ax.y), aM, aS);
        vec4 w = modelMatrix*vec4(a, 1.); vW = olaW(w.xyz); vN = olaW(mat3(modelMatrix)*(b - a)); vT = olaW(mat3(modelMatrix)*(t - a));
        vCol = aC.rgb; vL = q; vK = vec4(sc, stand, aS.w * (1. - prof), aC.a); vWho = olaHash(aP.xz*3.7 + aP.y); gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`varying vec3 vW, vN, vT, vCol, vL; varying vec4 vK; varying vec2 vQ; varying float vWho; ${L} ${ue} ${e.litGLSL||""}
      void main(){ float fw = fwidth(vQ.x), seen = clamp(1.6 - 5.*fw, 0., 1.), stand = step(.5, vK.y);      // 1 where a person is wider than a few pixels
        float who = vWho, sc = vK.x * (who < .125 ? .72 : 1.);              // (a child one in eight)
        float inside = mix(step(abs(vQ.x), .17*sc) * step(vQ.y, mix(.9, 1.5, stand)*sc), olaPerson(vQ, vec3(sc, stand, (who - .5)*.08)), seen);
        if (inside < .5) discard;
        vec3 Ve = olaW(cameraPosition) - vW, n = normalize(vN + vec3(0., 1e-4, 0.)); if (dot(n, Ve) < 0.) n = -n;
        n = normalize(n + normalize(vT + vec3(1e-4, 0., 0.)) * (vQ.x/(.3*sc)) * .8 * seen + vec3(0., .25, 0.));      // round the body a little
        float lit = ${e.litGLSL?"bowlLit(vL)":"vK.w"};
        vec3 cl = vCol * (1. + .18 * seen * step(mix(.68, 1.32, stand)*sc, vQ.y));                    // (the hood a tone lighter)
        // the held globe's warm light, by the metres from it (it hangs low at one side; on the profile card it is beside the body)
        float hold = abs(vK.z), gy = vQ.y - mix(.38, .78, stand), gx = vQ.x - vK.z*${_};
        float warm = mix(.16 * hold, hold * 1.1/(1. + (gx*gx + gy*gy)/.06), seen);                    // (far off: the mean of a lit body)
        vec3 c = cl * (olaLight(n, lit) + vec3(1., .44, .095) * (.06 + warm));
        gl_FragColor = vec4(olaFog(c, length(vW - olaW(cameraPosition))), 1.); }`}),o=new h.Mesh(i,v);return e.sphere?i.boundingSphere=new h.Sphere(new h.Vector3(e.sphere[0],e.sphere[1],e.sphere[2]),e.sphere[3]):o.frustumCulled=!1,{object:o,material:v,count:p}}const E=52;function _e(s,a){const e=new h.InstancedBufferGeometry,t=new h.PlaneGeometry(2,1,1,8);e.index=t.index,e.setAttribute("position",t.getAttribute("position"));const r=a.length,l=new Float32Array(r*4),i=new Float32Array(r*4);a.forEach((y,b)=>{l.set(y.m,b*4),i.set([y.s[0],y.s[1],0,y.stern],b*4)}),e.setAttribute("aM",new h.InstancedBufferAttribute(l,4)),e.setAttribute("aS",new h.InstancedBufferAttribute(i,4)),e.instanceCount=r;const p=new h.ShaderMaterial({uniforms:{...s},side:h.DoubleSide,transparent:!0,depthWrite:!1,blending:h.CustomBlending,blendEquation:h.AddEquation,blendSrc:h.OneFactor,blendDst:h.OneFactor,vertexShader:`attribute vec4 aM, aS; varying vec2 vQ; varying float vOn; varying vec3 vW; ${L} ${z}
      void main(){ float u = (position.y + .5) * ${E}., hd; vQ = vec2(position.x * (2.5 + .36*u), u);
        float d0 = mod(aM.y + aM.z*uTime, fleetLen(aM.x)), astern = (aS.w + u) * aS.x;               // metres of course behind the boat's middle
        vec3 p = fleetCourse(aM.x, max(d0 - astern, 0.), hd); vOn = step(astern, d0);                 // (a boat just come onto its course has laid no wake yet)
        p += vec3(cos(hd), 0., -sin(hd)) * vQ.x * aS.x; p.y = .04;
        vec4 w = modelMatrix*vec4(p, 1.); vW = olaW(w.xyz); gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`varying vec2 vQ; varying float vOn; varying vec3 vW; ${L}
      void main(){ float fx = fwidth(vQ.x), u = clamp(vQ.y, 0., ${E}.), x = min(abs(vQ.x), 60.), e = 1.2 + .28*u, wd = .4 + .035*u, wide = max(wd, .75*fx), d = clamp((x - e)/wide, -8., 8.);
        float arm = exp(-d*d) * wd/wide * (.45 + .55*sin(u*1.7 - uTime*2.4 + x*.6)), inside = 1. - smoothstep(e*.55, e, x);
        float rip = .5 + .5*sin(u*1.15 - uTime*2.2 + x*.9);
        float a = (max(arm, 0.)*.5 + inside*rip*.2*exp(-u*.05) + inside*.45*exp(-u*.16)) * exp(-u*.055) * smoothstep(0., 2.5, u) * (1. - smoothstep(${(E*.5).toFixed(1)}, ${E}., u)) * vOn;
        float dist = length(vW - olaW(cameraPosition)), f = exp(-min(dist*dist*uFogDen*uFogDen, 60.));
        gl_FragColor = vec4((uHemiSky*.55 + uBandCol*.3) * a * f, 1.); }`}),x=new h.Mesh(e,p);return x.frustumCulled=!1,x.renderOrder=.5,{object:x,material:p}}function Ne(s,a,e={}){const t=new h.InstancedBufferGeometry,r=new h.PlaneGeometry(2,1,1,2);t.index=r.index,t.setAttribute("position",r.getAttribute("position"));const l=a.length,i=new Float32Array(l*4),p=new Float32Array(l*4),x=new Float32Array(l*4);a.forEach((f,v)=>{i.set([f.a[0],f.a[1],f.a[2],f.w],v*4),p.set([f.b[0],f.b[1],f.b[2],f.w1??f.w],v*4),x.set([f.c[0],f.c[1],f.c[2],f.k??1],v*4)});for(const[f,v]of[["aA",i],["aB",p],["aC",x]])t.setAttribute(f,new h.InstancedBufferAttribute(v,4));t.instanceCount=l;const y=e.side?new h.Vector3(e.side[0],e.side[1],e.side[2]):new h.Vector3(-V.z,0,V.x).normalize(),b=new h.ShaderMaterial({uniforms:{...s,uSide:{value:y}},side:h.DoubleSide,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,vertexShader:`attribute vec4 aA, aB, aC; uniform vec3 uSide; varying vec2 vQ; varying float vK; varying vec3 vW; ${L}
      void main(){ float s = position.y + .5; vec3 c = s < .25 ? aA.xyz : (s < .75 ? aB.xyz : aC.xyz);
        float hw = mix(aA.w, aB.w, s) * 1.6; c += uSide * position.x * hw; c.y += .07;
        vQ = vec2(position.x, s); vK = aC.w; vec4 w = modelMatrix*vec4(c, 1.); vW = olaW(w.xyz); gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`varying vec2 vQ; varying float vK; varying vec3 vW; ${L}
      void main(){ float soft = mix(.25, .9, vQ.y), e = 1. - smoothstep(1. - soft, 1., abs(vQ.x));      // the edge softens with the blade's length, as a moon shadow's does
        float a = .6 * uStar * vK * e * (1. - smoothstep(.6, 1., vQ.y)) * smoothstep(0., .02, vQ.y);
        float dist = length(vW - olaW(cameraPosition)); a *= exp(-dist*dist*uFogDen*uFogDen);
        gl_FragColor = vec4(vec3(.012, .018, .042), a); }`}),u=new h.Mesh(t,b);return u.frustumCulled=!1,u.renderOrder=1,{object:u,material:b,count:l}}const pe=[.33,.335,.365],$=[.225,.235,.285],R=[.27,.28,.32],X=[.11,.095,.085],U=[{w:13,d:8,floors:1},{w:11,d:8,floors:2,skirt:!0},{w:15,d:8.4,floors:1,bel:[6,4.4]},{w:24,d:7.5,floors:1}];function He(s){const a=K(),e=U[s],t=e.w/2,r=e.d/2,l=.35+3.1*e.floors,{P:i,N:p,C:x,K:y,I:b}=a,u=(o,n,c)=>{const m=i.length/3,d=o[0],w=o[1],M=o[2],S=w[0]-d[0],C=w[1]-d[1],B=w[2]-d[2],k=M[0]-d[0],N=M[1]-d[1],H=M[2]-d[2];let G=C*H-B*N,F=B*k-S*H,O=S*N-C*k;const q=Math.hypot(G,F,O)||1,Q=(c===4?F<0:F>0)?-1:1;G*=Q/q,F*=Q/q,O*=Q/q;for(const W of o)i.push(W[0],W[1],W[2]),p.push(G,F,O),x.push(n[0],n[1],n[2]),y.push(c);for(let W=1;W<o.length-1;W++)Q>0?b.push(m,m+W,m+W+1):b.push(m,m+W+1,m+W)},f=(o,n,c,m)=>{const d=c+.28,w=d+m*n,M=Math.max(o-n,.5);return A(a,-o,o,c,d,-n,n,R,0),u([[-o,d,-n],[o,d,-n],[M,w,0],[-M,w,0]],$,4),u([[o,d,n],[-o,d,n],[-M,w,0],[M,w,0]],$,4),u([[-o,d,n],[-o,d,-n],[-M,w,0]],$,4),u([[o,d,-n],[o,d,n],[M,w,0]],$,4),u([[-o,c,-n],[o,c,-n],[o,c,n],[-o,c,n]],X,0),A(a,-M-.3,M+.3,w-.05,w+.2,-.22,.22,R,0),w+.2};A(a,-t-1.6,t+1.6,-2.5,.35,-r-2.4,r+1.2,pe),A(a,-t,t,.35,l,-r,r,[.5,.5,.5],5);for(let o=-t-1.1;o<=t+1.11;o+=(2*t+2.2)/Math.round((2*t+2.2)/4.2))A(a,o-.11,o+.11,.35,e.skirt?3.45:l,-r-1.95,-r-1.73,T);if(e.skirt){const n=t+2.3,c=r+2.5,m=t+.05,d=r+.05,w=3.45+.24,M=3.45+1;for(const[S,C,B,k]of[[[-n,w,-c],[n,w,-c],[m,M,-d],[-m,M,-d]],[[n,w,c],[-n,w,c],[-m,M,d],[m,M,d]],[[-n,w,c],[-n,w,-c],[-m,M,-d],[-m,M,d]],[[n,w,-c],[n,w,c],[m,M,d],[m,M,-d]]])u([S,C,B,k],$,4);for(const[S,C,B,k]of[[[-n,3.45,-c],[n,3.45,-c],[m,3.45,-d],[-m,3.45,-d]],[[n,3.45,c],[-n,3.45,c],[-m,3.45,d],[m,3.45,d]],[[-n,3.45,c],[-n,3.45,-c],[-m,3.45,-d],[-m,3.45,d]],[[n,3.45,-c],[n,3.45,c],[m,3.45,d],[m,3.45,-d]]])u([S,C,B,k],X,0);A(a,-n,n,3.45,w,-c,-c+.2,R,0),A(a,-n,n,3.45,w,c-.2,c,R,0),A(a,-n,-n+.2,3.45,w,-c,c,R,0),A(a,n-.2,n,3.45,w,-c,c,R,0)}let v=f(t+(e.skirt?1.5:2.3),r+(e.skirt?1.7:2.5),l,e.bel?.12:.2);if(e.bel){const o=e.bel[0]/2,n=e.bel[1]/2,c=l+.28+.12*(r+2.5)*.45;A(a,-o,o,c-.9,c+2.75,-n,n,[.5,.5,.5],5),v=f(o+1.5,n+1.6,c+2.75,.22)}return a.top=v,Object.assign(I(a),{userData:{top:v}})}const Ve=U.map(s=>({w:s.w,d:s.d,top:.35+3.1*s.floors+.28+(s.bel?.12*(s.d/2+2.5)*.45+2.75+.28+.22*(s.bel[1]/2+1.6):.2*(s.d/2+(s.skirt?1.7:2.5)))+.2}));function je(s,a,e,t={}){const r=e.length,l=new h.PlaneGeometry(1,1,6,1),i=new h.InstancedBufferGeometry;i.index=l.index,i.setAttribute("position",l.getAttribute("position"));const p=new Float32Array(r*4),x=new Float32Array(r*4),y=new Float32Array(r*4),b=new Float32Array(r*4);e.forEach((o,n)=>{p.set([o.a[0],o.a[1],o.a[2],o.w??.03],n*4),x.set([o.b[0],o.b[1],o.b[2],o.sag??0],n*4),y.set(o.m||[0,0,0,0],n*4),b.set(o.s||[1,1,0,0],n*4)});for(const[o,n]of[["aA",p],["aB",x],["aM",y],["aS",b]])i.setAttribute(o,new h.InstancedBufferAttribute(n,4));i.instanceCount=r;const u=t.color||[.11,.105,.11],f=new h.ShaderMaterial({uniforms:{...s,uRes:a.uRes},transparent:!0,depthWrite:!1,side:h.DoubleSide,vertexShader:`attribute vec4 aA, aB, aM, aS; uniform vec2 uRes; varying float vA; varying vec3 vW; ${L} ${t.pointGLSL||z}
      vec4 clipAt(float t, out vec3 wp){ vec3 a = boatPoint(aA.xyz, aM, aS), b = boatPoint(aB.xyz, aM, aS), p = mix(a, b, t); p.y -= aB.w * aS.x * 4.*t*(1.-t);
        p.xz += .25*aB.w * sin(uTime*.8 + aM.w + aA.x) * 4.*t*(1.-t); vec4 w = modelMatrix*vec4(p, 1.); wp = w.xyz; return projectionMatrix*viewMatrix*w; }
      void main(){ float t = position.x + .5; vec3 wp, w2; vec4 c0 = clipAt(t, wp), c1 = clipAt(t + .04, w2); vW = olaW(wp);
        vec2 d = (c1.xy/max(c1.w, 1e-3) - c0.xy/max(c0.w, 1e-3)) * uRes; d = normalize(d + vec2(1e-5, 0.)); vec2 nrm = vec2(-d.y, d.x);
        float px = max(c0.w * 2. / (projectionMatrix[1][1] * max(uRes.y, 1.)), 1e-5), hw = max(aA.w * aS.x, .75*px); vA = aA.w * aS.x / hw;      // (the divisor has a floor: a vertex in the eye's own plane)
        c0.xy += nrm * position.y * 2. * hw / px * 2. / uRes * c0.w; gl_Position = c0; }`,fragmentShader:`varying float vA; varying vec3 vW; ${L}
      void main(){ vec3 c = vec3(${u[0]}, ${u[1]}, ${u[2]}) * olaLight(vec3(0., 1., 0.), 0.);
        gl_FragColor = vec4(olaFog(c, length(vW - olaW(cameraPosition))), clamp(vA, 0., 1.)); }`}),v=new h.Mesh(i,f);return v.frustumCulled=!1,v.renderOrder=1.5,{object:v,material:f,count:r}}function Ze(s,a,e){const t=[],r=[],l=[];for(let u=0;u<3;u++){const f=u*Math.PI/3+.3,v=Math.cos(f),o=Math.sin(f),n=.22*(u-1),c=t.length/3;t.push(-.16*v,0,-.16*o,.16*v,0,.16*o,n*o*.5,.55,-n*v*.5,n*o,1,-n*v),r.push(0,0,.55,1),l.push(c,c+1,c+2,c+2,c+1,c+3)}const i=new h.InstancedBufferGeometry;i.setAttribute("position",new h.Float32BufferAttribute(t,3)),i.setAttribute("aK",new h.Float32BufferAttribute(r,1)),i.setIndex(l);const p=a.length,x=new Float32Array(p*4);a.forEach((u,f)=>x.set([u.x,u.z,u.h,u.ph],f*4)),i.setAttribute("aR",new h.InstancedBufferAttribute(x,4)),i.instanceCount=p;const y=new h.ShaderMaterial({uniforms:{...s,uWind:{value:new h.Vector2(e[0],e[1]).normalize()}},side:h.DoubleSide,vertexShader:`attribute float aK; attribute vec4 aR; uniform vec2 uWind; varying vec3 vW; varying float vK; ${L}
      void main(){ float c = cos(aR.w*7.), s = sin(aR.w*7.); vec3 p = vec3(position.x*c + position.z*s, position.y, -position.x*s + position.z*c) * vec3(1.3, aR.z, 1.3);
        float bend = aK*aK * aR.z * (.16 + .1*sin(uTime*1.1 + aR.w + aR.x*.07 + aR.y*.05) + .05*sin(uTime*2.7 + aR.w*3.));
        p.xz += uWind * bend; p.y -= bend*bend*.2; p += vec3(aR.x, -.25, aR.y);
        vK = aK; vec4 w = modelMatrix*vec4(p, 1.); vW = olaW(w.xyz); gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`varying vec3 vW; varying float vK; ${L}
      void main(){ if (vW.y < -.02) discard; vec3 c = mix(vec3(.045,.075,.05), vec3(.15,.17,.11), vK) * olaLight(vec3(0., 1., 0.), 0.);
        gl_FragColor = vec4(olaFog(c, length(vW - olaW(cameraPosition))), 1.); }`}),b=new h.Mesh(i,y);return b.frustumCulled=!1,{object:b,count:p}}export{$e as BOATS,z as BOAT_GLSL,de as CLOTHS,te as FLAME,oe as GLOBE_SKIN,ae as HELD,_ as HELD_OUT,Ve as HOUSES,ne as LAMP_GLSL,j as LAMP_LIMIT,ee as LAMP_TRUE,se as ONE_TRI,ue as PERSON_GLSL,Oe as TOWN_CLOTHS,ie as assertWound,Qe as boatGeometry,Ie as fleetAt,ze as fleetLength,qe as heldAt,He as houseGeometry,Ne as makeBlades,Ke as makeCraft,De as makeFigures,je as makeLines,Ze as makeReeds,Ge as makeSolid,Te as makeSprites,_e as makeWakes,Ee as solidBuilder,re as woundAgainst};
