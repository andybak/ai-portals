import*as t from"three";import{makePath as pt,clamp as _,lerp as q,smoothstep as Z}from"../kit/core.js";import{buildHero as yt,STYLE_GLSL as et,DISC_GLSL as tt,styleMaterial as ne,styleUniforms as wt,B_CRIT as at}from"../parts/airbrush-black-hole.js";const Ve=`
float abUnder(vec3 wp){
  vec3 cam = cameraPosition;
  if (wp.y >= 0. || cam.y <= 0.) return 1.;
  float t = cam.y / max(cam.y - wp.y, 1e-3);
  vec3 h = mix(cam, wp, t);
  return 1. - abDiscMask(h.xz, 3. + length(h - cam) * .004);
}`,ot=`
vec3 abChromeWorld(vec3 n, vec2 key, float fp){
  vec3 r = reflect(normalize(vView), n);
  float rl = max(length(r), 1e-4); r /= rl;
  // the lanes below run through the under-horizon bands
  vec2 P = vWorldPos.xz + r.xz * (max(vWorldPos.y, 1.) / max(-r.y, .04));
  float lanes = abNoise(vec3(length(P) * .045, atan(P.y, P.x + 1e-3) * 3. - uTime * .35, 3.));
  vec3 rb = r; rb.y += (lanes - .5) * .16 * step(r.y, .0);
  vec3 col = abChrome(rb, key, fp);
  // the hole's shadow and its arch, two analytic shapes in the reflection
  vec3 hd = -vWorldPos; float hl = max(length(hd), 1.); hd /= hl;
  float ang = acos(clamp(dot(r, hd), -1., 1.));
  float th = min(asin(clamp(${at.toFixed(1)} / max(hl, ${(at+1).toFixed(1)}), 0., 1.)), .3);
  float wA = max(fwidth(ang), 1e-4);
  float sh = 1. - abFrisket(ang - th, wA);
  float arch = (1. - abFrisket(ang - th * 1.4, wA)) * step(hd.y - .03, r.y);
  col = mix(col, mix(uInk[3], uInk[4], .55), arch);
  col = mix(col, uInk[0], sh);
  return col;
}`,xt=ot+`
uniform float uUnder;                                 // 0..1: the disc's light climbing the hull on the way out
vec4 abPaint(){
  vec3 n = normalize(vNormal); if (dot(n, vView) > 0.) n = -n;
  vec2 key = vPos.xz * 24.; float fp = max(max(fwidth(key.x), fwidth(key.y)), 1e-4);
  if (vUv.x > 50.){                                   // exhaust plume cards (wingman)
    float s = 1. - abs(vUv.x - 100.), k = 1. - vUv.y;
    float cov = k * k * k * smoothstep(0., .9, s) * (.45 + .6 * abNoise(vec3(vUv.y * 9. - uTime * 6., vUv.x * 3., 1.)));
    if (abSpray(cov, key, fp, 0.) < .45) discard;             // the hull material is opaque: thin spray breaks into specks
    return vec4(abRampS(.55 + .44 * cov, key, fp, 2.), 1.);
  }
  vec3 col = abChromeWorld(n, key, fp);
  // panel seams: frisket lines across the hull and one each side of the spine
  float fz = max(fwidth(vPos.z), 1e-4), fx = max(fwidth(vPos.x), 1e-4);
  float dz = abs(fract(vPos.z / 6.4 + .37) - .5) * 6.4;
  float seam = (1. - smoothstep(.03, .03 + fz, dz)) * min(.06 / fz, 1.);
  float dx = abs(abs(vPos.x) - 2.1);
  seam = max(seam, (1. - smoothstep(.03, .03 + fx, dx)) * min(.06 / fx, 1.) * step(abs(vUv.x), .93));
  col = mix(col, mix(uInk[0], uInk[1], .35), seam * .8);
  // a row of flush rivets inside each chine
  float wl = abs(vPos.x) / max(abs(vUv.x), .05);
  vec2 rv = vec2((abs(vUv.x) - .84) * wl, (fract(vPos.z / 1.3) - .5) * 1.3);
  float rd = length(rv);
  float rw = max(fwidth(rd), 1e-4);
  float vis = min(.11 / rw, 1.);
  col = mix(col, mix(uInk[0], uInk[1], .5), (1. - smoothstep(.1, .1 + rw, rd)) * .85 * vis);
  col = mix(col, vec3(1.), (1. - smoothstep(.035, .035 + rw, length(rv - vec2(.03, -.04)))) * .8 * vis);
  // the pull-up: the floor of fire drops away and its light climbs the hull: sprayed up round both chines, the fins
  // and every face that leans well outward; the spine keeps its clean chrome
  float rim = smoothstep(.15, .78, min(abs(vUv.x), 1.)), lean = 1. - smoothstep(.3, .8, n.y);
  col = mix(col, mix(uInk[3], uInk[4], .3), abSpray(uUnder * max(rim * .62, lean * .8), key, fp, 3.) * .92);
  // fins: a rivet row along the root
  if (abs(vUv.x) > 1.5){
    float am = (abs(vUv.x) - 2.) * 10.;
    vec2 fr = vec2(am - .34, (fract(vUv.y / 1.1) - .5) * 1.1);
    float fd = length(fr), fq = max(fwidth(fd), 1e-4), fv = min(.11 / fq, 1.);
    col = mix(col, mix(uInk[0], uInk[1], .5), (1. - smoothstep(.1, .1 + fq, fd)) * .85 * fv);
    col = mix(col, vec3(1.), (1. - smoothstep(.035, .035 + fq, length(fr - vec2(.03, -.04)))) * .8 * fv);
  }
  // stern plate of a wingman: two frisket-hard exhausts with their under-spray
  if (vUv.y < -.5){
    float de = length(vec2(abs(vPos.x) - 5., vPos.y - .8)) - 1.5;
    float m = 1. - abFrisket(de, max(fwidth(de), 1e-4));
    col = mix(mix(uInk[0], uInk[1], .4), mix(uInk[4], vec3(1.), .5), max(m, abSpray(abHalo(de, 40.) * 2.4, key, fp, 0.)));
  }
  return vec4(col, 1.);
}`;async function nt(f,T){const B=f?56:22,j=f?84:30,C=[],S=[],N=[],$=f?7:30,G=f?37:60,R=(b,s,g)=>{const p=$-s*G,y=(f?13.5:15)*Math.pow(1-s,.8)+.04,d=b*y;let M;if(f){M=-3.3-8.2*Math.pow(_(-p/30,0,1),1.15)-.11*y*b*b-.9*Math.pow(Math.abs(b),8)*Math.min(y,3)/3,M+=.42*Math.exp(-(d/.55)*(d/.55))*Math.pow(1-s,.3);const O=(Math.abs(d)-4.2)/1.25,I=(p+9.5)/3.4,P=O*O+I*I;P<1&&(M+=.85*Math.sqrt(1-P))}else{const k=Math.pow(Math.max(1-Math.pow(Math.abs(b),2.2),0),.8);M=g?(3.4*Math.pow(1-s,.9)+.05)*k+.5*Math.exp(-(d/.7)*(d/.7))*(1-s):-(1.2*Math.pow(1-s,.9)+.03)*k;const O=(Math.abs(d)-5)/1.6,I=(p-14)/6,P=O*O+I*I;g&&P<1&&(M+=1.1*Math.sqrt(1-P))}return[d,M,p]},X=async b=>{const s=C.length/3;for(let g=0;g<=j;g++){for(let p=0;p<=B;p++){const y=p/B*2-1,d=g/j,M=R(y,d,b);C.push(M[0],M[1],M[2]),S.push(y,d)}g%12===11&&await T()}for(let g=0;g<j;g++)for(let p=0;p<B;p++){const y=s+g*(B+1)+p,d=y+1,M=y+B+1,k=M+1;b?N.push(y,d,M,d,k,M):N.push(y,M,d,d,M,k)}};await X(!0),await T();const F=(b,s,g,p)=>{const y=C.length/3;C.push(...b,...s,...g),S.push(p[0],p[1],p[0],p[1],p[0],p[1]),N.push(y,y+1,y+2)};if(!f){await X(!1);for(let b=0;b<B;b++){const s=b/B*2-1,g=(b+1)/B*2-1,p=R(s,0,!0),y=R(g,0,!0),d=R(s,0,!1),M=R(g,0,!1);F(p,d,y,[0,-1]),F(y,d,M,[0,-1])}for(const b of[-1,1]){const s=C.length/3,g=b*5;C.push(g-2.2,.8,30,g+2.2,.8,30,g-1,.8,78,g+1,.8,78,g,-1.2,30,g,2.8,30,g,.2,78,g,1.4,78),S.push(99,0,101,0,99,1,101,1,99,0,101,0,99,1,101,1),N.push(s,s+2,s+1,s+1,s+2,s+3,s+4,s+6,s+5,s+5,s+6,s+7)}}for(const b of[-1,1]){const s=f?[[b*8.9,-7.3,-11.5],[b*10.2,-7.2,-5.5],[b*9.3,-5.5,-7.4]]:[[b*9,1.2,8],[b*13.5,.6,29],[b*15.5,7.5,31]],g=f?.55:1.2,p=10,y=5,d=Math.hypot(s[1][0]-s[0][0],s[1][1]-s[0][1],s[1][2]-s[0][2]),M=Math.hypot(s[2][0]-(s[0][0]+s[1][0])/2,s[2][1]-(s[0][1]+s[1][1])/2,s[2][2]-(s[0][2]+s[1][2])/2);for(const k of[-1,1]){const O=C.length/3;for(let I=0;I<=y;I++)for(let P=0;P<=p;P++){const L=P/p,W=I/y*.94,Y=k*(.03+g*(1-W*W)*(.3+.7*Math.sin(Math.PI*L))),ee=q(s[0][0],s[1][0],L),v=q(s[0][1],s[1][1],L),ce=q(s[0][2],s[1][2],L);C.push(q(ee,s[2][0],W)+Y,q(v,s[2][1],W),q(ce,s[2][2],W)),S.push(b*(2+W*M/10),L*d)}for(let I=0;I<y;I++)for(let P=0;P<p;P++){const L=O+I*(p+1)+P,W=L+1,Y=L+p+1,ee=Y+1;k*b>0?N.push(L,W,Y,W,ee,Y):N.push(L,Y,W,W,Y,ee)}}}const U=new t.BufferGeometry;return U.setAttribute("position",new t.Float32BufferAttribute(C,3)),U.setAttribute("uv",new t.Float32BufferAttribute(S,2)),U.setIndex(N),await T(),U.computeVertexNormals(),await T(),U}function bt(f){const T=[],B=[],j=[],C=[],S=[],N=new t.Vector3;for(const G of f){const R=G.pts.length,X=T.length/3;for(let F=0;F<R;F++){const U=G.pts[F];N.subVectors(G.pts[Math.min(F+1,R-1)],G.pts[Math.max(F-1,0)]).normalize();for(const b of[-1,1])T.push(U.x,U.y,U.z),B.push(N.x,N.y,N.z),j.push(b,F/(R-1)),C.push(G.width,G.kind,G.seed)}for(let F=0;F<R-1;F++){const U=X+F*2;S.push(U,U+1,U+2,U+1,U+3,U+2)}}const $=new t.BufferGeometry;return $.setAttribute("position",new t.Float32BufferAttribute(T,3)),$.setAttribute("aTan",new t.Float32BufferAttribute(B,3)),$.setAttribute("uv",new t.Float32BufferAttribute(j,2)),$.setAttribute("aDat",new t.Float32BufferAttribute(C,3)),$.setIndex(S),$}const gt=[[-2600,330,0],[-2540,330,0],[-2260,322,-10],[-2182,303,-26],[-1926,184,-138],[-1747,92,-227],[-1516,37,-322],[-1082,34,-440],[-784,32,-469],[-534,32,-454],[-346,32,-391],[-269,32,-328],[-204,32,-252],[-162,47,-200],[-134.3,70.3,-165.7],[-106.7,93.7,-131.3],[-79,117,-97]],Me=47;var zt={id:"airbrush-black-hole",name:"The Airbrushed Abyss",category:"sky",weirdness:.6,media:["space"],async build(f){const T=f.rng,B=f.noise,j=f.vary||{},C=f.quality?.detail??1,S=new t.Scene;S.background=new t.Color("#04040C");const N=T(),$=T(),G=T(),R=T.range(0,50),X=j.hour||"any",F=X==="night"?"violet":X==="dawn"?"verdigris":X==="day"||X==="golden"||N<.4?"cadmium":N<.7?"violet":"verdigris",U=$<.45,b=G<.45?1:G<.8?2:3,s=_(j.density??1,.7,1.3),g=F==="violet"?"#FFD27A":F==="verdigris"?"#FFB27A":"#9FF5E6",p=T.fork("craters"),y=T.fork("boulders"),d=T.fork("puffs"),M=T.fork("motes"),k=pt(gt),O=e=>q(.46,1.43,1-Z(.735,.83,e))+.42*Z(.88,1,e),I=256,P=new Float32Array(I+1);for(let e=1;e<=I;e++)P[e]=P[e-1]+1/O((e-.5)/I)/I;for(let e=1;e<=I;e++)P[e]*=Me/P[I];const L=e=>{const a=_(e,0,1)*I,i=Math.min(Math.floor(a),I-1);return q(P[i],P[i+1],a-i)},W=e=>{let a=0;for(;a<I-1&&P[a+1]<e;)a++;return(a+_((e-P[a])/Math.max(P[a+1]-P[a],1e-6),0,1))/I},Y=e=>O(e)*(P[I]>0?k.length/Me:60)*.98,ee=W(20),v=t.Vector3,ce=k.pointAt(ee,new v);await f.yield();const Re=[];for(let e=0;e<=96;e++){const a=k.pointAt(e/96,new v);Re.push([a.x,a.y,a.z])}const V=await yt(f,{edition:F,path:Re,duration:Me,conePass:{u:ee,position:[ce.x,ce.y,ce.z]},clumps:_(Math.round(11*s),8,14)});S.add(V.object);const te=V.anchors,fe=wt(V),me=te.portalSeat.position.clone();await f.yield();const D=te.moonlet.clone(),pe=187.5,st=D.clone().negate().normalize(),rt=te.companion.clone().sub(D).normalize();await f.yield();const ze=[];for(let e=0;e<36;e++){const a=p.range(0,Math.PI*2),i=e<14?p.range(.25,.98):p.range(-.6,1),o=Math.sqrt(1-i*i),c=e<4?p.range(.26,.4):e<14?p.range(.09,.18):p.range(.035,.075);ze.push(new t.Vector4(Math.cos(a)*o,i,Math.sin(a)*o,c))}const ae=new v(.3,.22,.93).normalize(),We=(e,a,i)=>{let o=11*B.fbm3(e*1.4+R,a*1.4,i*1.4,3)+2.2*B.n3(e*8,a*8+R,i*8);for(let c=0;c<14;c++){const m=ze[c],z=e-m.x,x=a-m.y,n=i-m.z,u=Math.sqrt(z*z+x*x+n*n)/m.w;if(u<1.5){const r=(u-1)/.2;o+=m.w*pe*(.22*(u<1?u*u-1:0)+.07*Math.exp(-r*r))}}if(U){const c=(e*ae.x+a*ae.y+i*ae.z-.08)/.03;o-=26*Math.exp(-c*c)}return o},ue=new t.BufferGeometry;{const i=new Float32Array(53235),o=new Uint32Array(17472*6);let c=0;for(let z=0;z<=104;z++){const x=z/104*Math.PI,n=Math.cos(x),u=Math.sin(x);for(let r=0;r<=168;r++){const l=r/168*Math.PI*2,w=Math.cos(l)*u,A=Math.sin(l)*u;let h=pe+We(w,n,A);const H=D.y+n*h;if(H>262){const K=k.distanceTo(D.x+w*h,H,D.z+A*h);K<17&&(h-=(17-K)*1.3)}i[c*3]=w*h,i[c*3+1]=n*h,i[c*3+2]=A*h,c++,c%400===0&&await f.yield()}}let m=0;for(let z=0;z<104;z++){for(let x=0;x<168;x++){const n=z*169+x,u=n+1,r=n+168+1,l=r+1;o[m++]=n,o[m++]=u,o[m++]=r,o[m++]=u,o[m++]=l,o[m++]=r}z%24===23&&await f.yield()}ue.setAttribute("position",new t.BufferAttribute(i,3)),ue.setAttribute("uv",new t.BufferAttribute(new Float32Array(17745*2),2)),ue.setIndex(new t.BufferAttribute(o,1)),await f.yield(),ue.computeVertexNormals(),await f.yield()}const De=`
      uniform vec3 uL1; uniform vec3 uL2;
      vec3 abRock(vec3 n, float sh, float hi, vec2 key, float fp){
        float l1 = dot(n, uL1);
        float c = smoothstep(-.14, .4, l1);
        float rim = pow(1. - abs(dot(n, normalize(vView))), 4.) * smoothstep(-.6, .1, l1);
        float T = c * .8 + rim * .6;
        T = T * (1. - .75 * sh) + hi * smoothstep(-.4, -.06, l1) * .55;
        T += (abNoise(vWorldPos * .11) - .5) * .3 * c;
        vec3 col = abRampS(clamp(T, 0., .98), key, fp, 1.);
        float c2 = smoothstep(.05, .7, dot(n, uL2)) * (1. - sh);
        return mix(col, uInk[6], abSpray(c2 * .5, key, fp, 4.) * .8);
      }`,qe={uCr:{value:ze},uL1:{value:st},uL2:{value:rt},uRift:{value:new t.Vector4(ae.x,ae.y,ae.z,U?1:0)}},Ae=new t.Mesh(ue,ne({hero:V,uniforms:qe,paint:`
      uniform vec4 uCr[36]; uniform vec4 uRift;
      ${De}
      vec4 abPaint(){
        vec3 n = normalize(vNormal); vec3 d = normalize(vPos);
        vec2 key = vPos.xz + vPos.y * vec2(.37, -.61); float fp = max(max(fwidth(key.x), fwidth(key.y)), 1e-3);
        float fpd = max(length(fwidth(d)), 1e-5);
        float sh = 0., hi = 0.;
        for (int i = 0; i < 36; i++){
          vec4 cr = uCr[i]; vec3 q = d - cr.xyz; float dist = length(q) / cr.w;
          if (dist < 1.25){
            vec3 lt = uL1 - cr.xyz * dot(uL1, cr.xyz); lt /= max(length(lt), 1e-3);
            float al = dot(q, lt) / cr.w, pr2 = max(dist * dist - al * al, 0.), w = fpd / cr.w;
            float inside = 1. - abFrisket(dist - 1., w);
            sh = max(sh, inside * abFrisket(sqrt(pr2 + (al + .5) * (al + .5)) - 1., w));
            hi = max(hi, inside * abFrisket(sqrt(pr2 + (al - .45) * (al - .45)) - 1., w));
          }
        }
        vec3 col = abRock(n, sh, hi, key, fp);
        float dr = abs(dot(d, uRift.xyz) - .08) - .009 - .007 * abNoise(d * 9.);
        col = mix(col, mix(uInk[3], uInk[4], .5), uRift.w * (1. - abFrisket(dr, fpd)));
        col = mix(col, uInk[3], uRift.w * abSpray(abHalo(dr, .5) * 1.6, key, fp, 6.) * .7);
        return vec4(col, 1.);
      }`}));Ae.position.copy(D),Ae.name="moonlet",S.add(Ae),await f.yield();{const e=new t.IcosahedronGeometry(1,1),a=e.attributes.position;for(let r=0;r<a.count;r++){const l=a.getX(r),w=a.getY(r),A=a.getZ(r),h=1+.32*B.n3(l*1.7+3,w*1.7,A*1.7);a.setXYZ(r,l*h,w*h*.75,A*h)}await f.yield();const i=Math.round(300*C),o=U?46:0,c=new t.InstancedMesh(e,ne({hero:V,uniforms:qe,paint:`
        ${De}
        vec4 abPaint(){
          vec3 n = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)) + vec3(0., 1e-6, 0.));
          if (dot(n, vView) > 0.) n = -n;
          vec2 key = vWorldPos.xz + vWorldPos.y * vec2(.37, -.61); float fp = max(max(fwidth(key.x), fwidth(key.y)), 1e-3);
          return vec4(abRock(n, 0., step(.55, n.y) * .5, key, fp), 1.);
        }`}),i+o),m=new t.Matrix4,z=new t.Quaternion,x=new t.Euler,n=new v,u=new v;for(let r=0;r<i+o;r++){if(r<i){const l=y.range(0,Math.PI*2),w=y.range(.5,.995),A=Math.sqrt(1-w*w),h=Math.cos(l)*A,H=Math.sin(l)*A,K=y.range(1.2,4.2)*(y()<.08?2:1),Q=pe+We(h,w,H)+K*.3;u.set(D.x+h*Q,D.y+w*Q,D.z+H*Q),n.setScalar(k.distanceTo(u.x,u.y,u.z)<12+K?.001:K)}else{const l=(r-i)/o,w=y.range(3,13)*(1-.6*l);u.copy(D).addScaledVector(ae,15).add(n.set(-.25,-.45,-.86).multiplyScalar(170+l*520)),u.x+=y.range(-30,30)*(.4+l),u.y+=y.range(-30,30)*(.4+l),u.z+=y.range(-20,20),n.setScalar(w)}z.setFromEuler(x.set(y.range(0,6.28),y.range(0,6.28),y.range(0,6.28))),c.setMatrixAt(r,m.compose(u,z,n)),r%40===39&&await f.yield()}c.frustumCulled=!1,c.name="boulders",S.add(c)}await f.yield();const se=te.companion.clone(),Ge=te.streamTip.clone(),Le=Ge.clone().sub(se).normalize();await f.yield();const ye=new t.Mesh(new t.SphereGeometry(500,56,36),ne({hero:V,disc:!0,transparent:!0,uniforms:{uTip:{value:Le}},vertex:`uniform vec3 uTip;
        vec3 abMove(vec3 p){ float k = max(dot(normalize(p), uTip), 0.); k *= k; k *= k; return p + uTip * 300. * k * k; }`,paint:Ve+`
        vec4 abPaint(){
          vec3 d = normalize(vPos);
          float mu = max(dot(normalize(vNormal), -normalize(vView)), 0.);
          vec2 key = vUv * vec2(3140., 1570.); float fp = max(max(fwidth(key.x), fwidth(key.y)), 1e-3);
          float n1 = abNoise(d * 5. + vec3(0., uTime * .09, 0.)), n2 = abNoise(d * 13. - vec3(uTime * .16, 0., uTime * .07));
          float cells = n1 * .65 + n2 * .35;
          float cm = abFrisket(cells - .5, max(fwidth(cells), 1e-4));          // frisket-cut granulation cells
          float T = .2 + .62 * pow(mu, .6) + (cm - .5) * .2 + (n2 - .5) * .15;
          vec3 dark = mix(uInk[0], uInk[6], .42);
          vec3 col = mix(dark, uInk[6], abSpray(clamp(T * 1.25, 0., 1.), key, fp, 2.));
          col = mix(col, vec3(1.), abSpray(clamp(T * 1.7 - .95, 0., 1.), key, fp, 5.) * .85);
          float a = abUnder(vWorldPos);
          if (a < .01) discard;
          return vec4(col, a);
        }`}));ye.position.copy(se),ye.renderOrder=1,ye.name="companion",S.add(ye),await f.yield();const it=Ge.clone().addScaledVector(Le,240).setY(30),Ie=new v(600,26,-1650),oe=te.splash.clone().setY(5);{const e=[],a=(n,u)=>u.set(0,0,0).addScaledVector(it,(1-n)*(1-n)).addScaledVector(Ie,2*n*(1-n)).addScaledVector(oe,n*n),i=new v,o=new v,c=new v,m=new v;for(let n=0;n<13;n++){n%4===3&&await f.yield();const u=[];for(let r=0;r<=56;r++){const l=r/56;a(l,i),a(Math.min(l+.01,1.01),o),c.subVectors(o,i).normalize(),m.set(-c.z,0,c.x);const w=n===12?0:q(105,20,Math.pow(l,.7)),A=n/12*Math.PI*2+l*8.5;u.push(i.clone().addScaledVector(m,Math.cos(A)*w).add(new v(0,Math.sin(A)*w*.5+45*(1-l),0)))}e.push({pts:u,width:n===12?150:15,kind:n===12?1:0,seed:n/13})}for(let n=0;n<2;n++){const u=[],r=n?2.3:.5,l=n?.55:.8,w=new v(n?.2:-.3,1,.1).normalize(),A=new v(-1,0,.35).normalize();for(let h=0;h<=36;h++){const H=h/36,K=A.clone().applyAxisAngle(w,r+(H-.5)*l).applyAxisAngle(new v(1,0,0),n?.5:-.35);u.push(se.clone().addScaledVector(K,500*(1+(n?.3:.42)*Math.sin(Math.PI*H))))}e.push({pts:u,width:34,kind:2,seed:.3+n*.4})}await f.yield();const z=bt(e);await f.yield();const x=new t.Mesh(z,new t.ShaderMaterial({uniforms:fe,transparent:!0,depthWrite:!1,side:t.DoubleSide,vertexShader:`
          attribute vec3 aTan; attribute vec3 aDat; uniform float uTime;
          varying vec2 vUv2; varying vec3 vDat; varying vec3 vW;
          void main(){
            vec3 c = position;
            c.y += sin(uTime * .7 + uv.y * 9. + aDat.z * 20.) * 7. * step(aDat.y, .5);
            vec4 w = modelMatrix * vec4(c, 1.);
            vec3 toC = w.xyz - cameraPosition; float dist = max(length(toC), 1.);
            vec3 sd = cross(aTan, toC); sd /= max(length(sd), 1e-4);
            w.xyz += sd * uv.x * max(aDat.x, dist * .0026);
            vUv2 = uv; vDat = aDat; vW = w.xyz;
            gl_Position = projectionMatrix * viewMatrix * w;
          }`,fragmentShader:`
          precision highp float;
          varying vec2 vUv2; varying vec3 vDat; varying vec3 vW;
          ${et}
          ${tt}
          ${Ve}
          void main(){
            float u = vUv2.x, t = vUv2.y;
            vec2 key = vec2(u * vDat.x * .12, t * 320.) + vDat.z * 31.; float fp = max(max(fwidth(key.x), fwidth(key.y)), 1e-4);
            float fu = max(fwidth(u), 1e-4);
            float pulse = abNoise(vec3(t * 16. - uTime * 1.3, vDat.z * 9., 1.));
            float cov; vec3 col;
            if (vDat.y < .5){
              cov = abFrisket(.8 - u, fu) * smoothstep(-1., .2, u) * (.4 + .8 * pulse) * smoothstep(0., .04, t);
              col = mix(mix(uInk[6], uInk[5], smoothstep(0., .3, t)), mix(uInk[4], vec3(1.), .4), smoothstep(.7, 1., t) * .7 + .3 * pulse * pulse);
            } else if (vDat.y < 1.5){
              cov = (1. - u * u) * (.2 + .32 * pulse) * smoothstep(0., .1, t);
              col = mix(uInk[5], uInk[4], smoothstep(.6, 1., t) * .6);
            } else {
              cov = abFrisket(.75 - u, fu) * smoothstep(-1., .3, u) * (.5 + .6 * pulse) * sin(3.14159 * clamp(t, 0., 1.));
              col = mix(uInk[6], vec3(1.), .5 * pulse);
            }
            float a = abSpray(clamp(cov, 0., 1.), key, fp, 0.) * abUnder(vW);
            if (a < .004) discard;
            gl_FragColor = vec4(col, a);
          }`}));x.frustumCulled=!1,x.renderOrder=1.5,x.name="stream",S.add(x)}await f.yield();{const e=Math.round(260*C),a=90,i=e+a+2,o=new Float32Array(i*4),c=new Float32Array(i*4),m=new Float32Array(i*4),z=new v(oe.x-Ie.x,0,oe.z-Ie.z).normalize();for(let u=0;u<i;u++){const r=u*4;if(u<e){const l=d.range(4.5,8),w=d.range(60,400)*(d()<.3?1:.6),A=d.range(0,Math.PI*2),h=d.range(4,44);o.set([oe.x+d.range(-60,60),2,oe.z+d.range(-60,60),d()],r),c.set([Math.cos(A)*h+z.x*14,4*w/l,Math.sin(A)*h+z.z*14,l],r),m.set([d.range(16,30),d.range(40,78),8*w/(l*l),d()],r)}else if(u<e+a){const l=d.range(0,Math.PI*2),w=d.range(.45,.98),A=Math.sqrt(1-w*w),h=pe+14;o.set([D.x+Math.cos(l)*A*h,D.y+w*h,D.z+Math.sin(l)*A*h,d()],r),c.set([Math.cos(l)*A*3+2.5,w*d.range(2,6),Math.sin(l)*A*3,d.range(7,13)],r),m.set([1.5,d.range(5,10),0,1+d()*.99],r)}else u===e+a?(o.set([se.x,se.y,se.z,0],r),c.set([0,0,0,1e6],r),m.set([1050,1050,0,2.5],r)):(o.set([oe.x,40,oe.z,0],r),c.set([0,0,0,1e6],r),m.set([520,520,0,3.5],r))}const x=new t.InstancedBufferGeometry;x.setAttribute("position",new t.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),x.setAttribute("uv",new t.Float32BufferAttribute([0,0,1,0,1,1,0,1],2)),x.setIndex([0,1,2,0,2,3]),x.setAttribute("aO",new t.InstancedBufferAttribute(o,4)),x.setAttribute("aV",new t.InstancedBufferAttribute(c,4)),x.setAttribute("aC",new t.InstancedBufferAttribute(m,4)),x.instanceCount=i;const n=new t.Mesh(x,new t.ShaderMaterial({uniforms:fe,transparent:!0,depthWrite:!1,vertexShader:`
          attribute vec4 aO; attribute vec4 aV; attribute vec4 aC; uniform float uTime;
          varying vec2 vUv2; varying vec4 vK; varying vec3 vW;
          void main(){
            float ph = fract(uTime / aV.w + aO.w), tau = ph * aV.w;
            vec3 c = aO.xyz + aV.xyz * tau - vec3(0., .5 * aC.z * tau * tau, 0.);
            float size = mix(aC.x, aC.y, ph);
            vec4 mv = viewMatrix * vec4(c, 1.);
            mv.xy += position.xy * size;
            vW = c; vUv2 = uv; vK = vec4(ph, fract(aC.w), floor(aC.w), size);
            gl_Position = projectionMatrix * mv;
          }`,fragmentShader:`
          precision highp float;
          varying vec2 vUv2; varying vec4 vK; varying vec3 vW;
          ${et}
          ${tt}
          ${Ve}
          void main(){
            vec2 q = vUv2 * 2. - 1.; float r = length(q);
            vec2 key = q * vK.w * .3 + vK.y * 57.; float fp = max(max(fwidth(key.x), fwidth(key.y)), 1e-4);
            float cov; vec3 col;
            if (vK.z < .5){
              float c0 = max(1. - r * r, 0.);
              cov = c0 * sqrt(c0) * (.22 + .6 * sin(3.14159 * vK.x));
              col = mix(uInk[5], mix(uInk[4], vec3(1.), .5), clamp(cov * 1.7 + .35 * (1. - vK.x), 0., 1.));
            } else if (vK.z < 1.5){
              float c0 = max(1. - r * r, 0.);
              cov = -c0 * c0 * .2 * sin(3.14159 * vK.x);
              col = mix(uInk[3], uInk[4], .3);
            } else {
              cov = .36 * exp(-r * 3.2) * (1. - smoothstep(.8, 1., r));
              col = vK.z < 2.5 ? uInk[6] : mix(uInk[5], uInk[4], .6);
            }
            float a = (cov < 0. ? abSpeck(-cov, key, fp, 0.) * .8 : abSpray(cov, key, fp, 0.)) * abUnder(vW);
            if (a < .004) discard;
            gl_FragColor = vec4(col, a);
          }`}));n.frustumCulled=!1,n.renderOrder=.5,n.name="puffs",S.add(n)}await f.yield();const Ke={uUnder:{value:0}},_e=ne({hero:V,uniforms:Ke,paint:xt,side:t.DoubleSide});await f.yield();const ve=new t.Mesh(await nt(!0,()=>f.yield()),_e);ve.frustumCulled=!1,ve.renderOrder=6,ve.name="ship",S.add(ve),await f.yield();const lt=await nt(!1,()=>f.yield()),Pe=[];for(let e=0;e<b;e++){const a=new t.Mesh(lt,_e);a.frustumCulled=!1,a.renderOrder=5,a.name="wingman",a.userData={ahead:[120,215,300][e],left:[34,104,70][e],up:[-16,4,24][e],ph:e*2.1},S.add(a),Pe.push(a)}const Se=.4,ct=.82,Oe={uWakeS:{value:-1e4}};{const e=[],a=[],i=[],o=new v,c=new v,m=150;for(let n=0;n<=m;n++){const u=q(Se,ct,n/m);k.pointAt(u,o),k.tangentAt(u,c);const r=c.z,l=-c.x,w=Math.hypot(r,l)||1,A=(u-Se)*k.length;for(const h of[-1,1])e.push(o.x+r/w*(34+h*9),2.5,o.z+l/w*(34+h*9)),a.push(h,A);if(n<m){const h=n*2;i.push(h,h+1,h+2,h+1,h+3,h+2)}}const z=new t.BufferGeometry;z.setAttribute("position",new t.Float32BufferAttribute(e,3)),z.setAttribute("uv",new t.Float32BufferAttribute(a,2)),z.setAttribute("normal",new t.Float32BufferAttribute(new Float32Array(e.length).fill(0).map((n,u)=>u%3===1?1:0),3)),z.setIndex(i),await f.yield();const x=new t.Mesh(z,ne({hero:V,uniforms:Oe,transparent:!0,depthWrite:!1,side:t.DoubleSide,paint:`
        uniform float uWakeS;
        vec4 abPaint(){
          float back = uWakeS - vUv.y;
          vec2 key = vec2(vUv.x * 9., vUv.y); float fp = max(max(fwidth(key.x), fwidth(key.y)), 1e-3);
          // a ragged furrow: it wanders and swells along its length, fades at both edges, and is spray all through
          float wob = abNoise(vec3(vUv.y * .043, 3., 1.)) - .5, wid = .5 + .5 * abNoise(vec3(vUv.y * .11, 7., 2.));
          float x = (vUv.x - wob * .55) / wid;
          float w = max(1. - x * x, 0.); w *= w;
          float on = step(0., back), tear = abNoise(vec3(vUv.y * .19, vUv.x * 2.5, uTime * .5));
          float cov = on * exp(-max(back, 0.) / 330.) * w * (.3 + .75 * tear);
          float core = on * exp(-x * x * 26.) * exp(-max(back, 0.) / 150.) * smoothstep(.3, .75, abNoise(vec3(vUv.y * .31, 1., uTime * .7)));
          return vec4(mix(mix(uInk[3], uInk[4], .7), vec3(1.), core * .6), abSpray(max(cov * .85, core * .7), key, fp, 0.));
        }`}));x.frustumCulled=!1,x.renderOrder=1.8,x.name="wake",S.add(x)}await f.yield();const Ue={uTime:fe.uTime,uInk:fe.uInk,uStreak:{value:new v(1,0,0)},uBurst:{value:0}};{const e=Math.round(1700*C),a=new Float32Array(e*3),i=new Float32Array(e*4);for(let m=0;m<e;m++)a.set([M(),M(),M()],m*3),i.set([M(),M(),M(),M()],m*4);await f.yield();const o=new t.InstancedBufferGeometry;o.setAttribute("position",new t.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),o.setAttribute("uv",new t.Float32BufferAttribute([0,0,1,0,1,1,0,1],2)),o.setIndex([0,1,2,0,2,3]),o.setAttribute("aB",new t.InstancedBufferAttribute(a,3)),o.setAttribute("aR",new t.InstancedBufferAttribute(i,4)),o.instanceCount=e;const c=new t.Mesh(o,new t.ShaderMaterial({uniforms:Ue,transparent:!0,depthWrite:!1,side:t.DoubleSide,vertexShader:`
          attribute vec3 aB; attribute vec4 aR; uniform float uTime; uniform vec3 uStreak; uniform float uBurst;
          varying vec2 vUv2; varying vec3 vK;
          void main(){
            vec3 box = vec3(150., 80., 150.);
            vec3 p = aB * box + uTime * (vec3(aR.x - .5, (aR.y - .5) * .4, aR.z - .5) * 7.);
            vec3 rel = mod(p - cameraPosition, box) - box * .5;
            float dist = max(length(rel), .01);
            float sl = length(uStreak);
            vec3 ds = sl > 1e-3 ? uStreak / sl : vec3(0., 1., 0.);
            vec3 sd = cross(ds, rel); sd /= max(length(sd), 1e-4);
            float big = step(aR.w, .1 + .9 * uBurst);
            float w = max((.03 + .07 * aR.y) * (1. + 1.4 * uBurst), dist * .0013) * (.6 + .4 * big);
            float len = max(sl * (.5 + aR.x), w * 2.5);
            vec3 wp = cameraPosition + rel + ds * position.y * len * .5 + sd * position.x * w;
            float fade = smoothstep(1.2, 3.5, dist) * (1. - smoothstep(52., 74., dist)) * mix(step(aR.w, .55), 1., uBurst);
            vUv2 = uv; vK = vec3(aR.z, fade, uBurst);
            gl_Position = fade > 0. ? projectionMatrix * viewMatrix * vec4(wp, 1.) : vec4(2., 2., 2., 1.);
          }`,fragmentShader:`
          precision highp float;
          uniform vec3 uInk[7];
          varying vec2 vUv2; varying vec3 vK;
          void main(){
            float x = abs(vUv2.x * 2. - 1.), y = vUv2.y;
            float tp = max(sin(3.14159 * y), 0.); tp = tp * (.4 + .6 * y);
            float a = 1. - smoothstep(.45 * tp, tp + .02, x);
            vec3 col = vK.x < .12 ? uInk[5] : (vK.x < .24 ? uInk[2] : mix(uInk[4], vec3(1.), .35 * vK.z));
            gl_FragColor = vec4(col, a * vK.y * .9);
          }`}));c.frustumCulled=!1,c.renderOrder=7,c.name="motes",S.add(c)}await f.yield();const re=te.exitDir.clone();await f.yield();const we=new t.Mesh(new t.TorusGeometry(9.4,.9,14,72),ne({hero:V,paint:ot+`
      vec4 abPaint(){
        vec3 n = normalize(vNormal);
        vec2 key = vUv * vec2(1400., 130.); float fp = max(max(fwidth(key.x), fwidth(key.y)), 1e-3);
        vec3 col = abChromeWorld(n, key, fp);
        col = mix(col, uInk[3], (1. - smoothstep(-.8, .1, n.y)) * .55);            // the underside catches the disc
        return vec4(col, 1.);
      }`}));we.position.copy(me).addScaledVector(re,.3),we.quaternion.setFromUnitVectors(new v(0,0,1),re),we.name="hoop",S.add(we);const de=new t.Mesh(new t.PlaneGeometry(40,40),ne({hero:V,transparent:!0,depthWrite:!1,side:t.DoubleSide,uniforms:{uPortalCol:{value:new t.Color(g)}},paint:`
      uniform vec3 uPortalCol;
      vec4 abPaint(){
        float r = length(vPos.xy), d = r - 10.2;
        vec2 key = vPos.xy * 5.; float fp = max(max(fwidth(key.x), fwidth(key.y)), 1e-4);
        float ang = atan(vPos.y, vPos.x + 1e-4);
        float rays = .75 + .25 * abNoise(vec3(ang * 5., uTime * .6, 3.));
        float cov = step(0., d) * .62 * exp(-max(d, 0.) / 2.7) * rays * (1. - smoothstep(13., 20., r));
        float a = mix(abSpeck(cov * 1.7, key, fp, 0.), abSpray(cov, key, fp, 0.), smoothstep(.1, .3, cov));   // closed up at the hoop, separate specks further out
        if (a < .004) discard;
        return vec4(mix(uPortalCol, vec3(1.), .3 * smoothstep(.3, .6, cov)), a * .92);
      }`}));de.position.copy(me).addScaledVector(re,1.6),de.quaternion.setFromUnitVectors(new v(0,0,1),re),de.renderOrder=1.9,de.name="hoop-halo",S.add(de);const xe=new v().crossVectors(re,new v(0,1,0)).normalize(),Fe=new v().crossVectors(xe,re).normalize(),be=[0,1,2,3,4,5].map(()=>new t.Vector4(0,0,0,1));[[xe,1],[xe,-1],[Fe,1],[Fe,-1]].forEach(([e,a],i)=>{const o=me.clone().addScaledVector(e,a*9.4*.72).addScaledVector(i<2?Fe:xe,6.486*(i%2?-1:1)*(i<2?1:-1));be[i].set(o.x,o.y,o.z,3.4)});const Ee={uGl:{value:be},uInk:fe.uInk,uTurn:{value:0}};{const e=new t.InstancedBufferGeometry;e.setAttribute("position",new t.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),e.setAttribute("uv",new t.Float32BufferAttribute([0,0,1,0,1,1,0,1],2)),e.setIndex([0,1,2,0,2,3]),e.setAttribute("aIdx",new t.InstancedBufferAttribute(new Float32Array([0,1,2,3,4,5]),1)),e.instanceCount=6;const a=new t.Mesh(e,new t.ShaderMaterial({uniforms:Ee,transparent:!0,depthWrite:!1,depthTest:!0,vertexShader:`
          attribute float aIdx; uniform vec4 uGl[6]; uniform float uTurn;
          varying vec2 vQ; varying float vPx;
          void main(){
            vec4 g = uGl[int(aIdx + .5)];
            vec4 mv = viewMatrix * vec4(g.xyz, 1.);
            float dist = max(-mv.z, 1.), size = max(g.w, dist * (aIdx < 3.5 ? .035 : .022));   // the four on the hoop stay a jewel from afar
            float a = uTurn + aIdx * .7, c = cos(a), s = sin(a);
            vQ = vec2(c * position.x + s * position.y, -s * position.x + c * position.y);
            vPx = dist * .0016 / size;
            mv.xy += position.xy * size; mv.z += min(size, 3.);
            gl_Position = projectionMatrix * mv;
          }`,fragmentShader:`
          precision highp float;
          uniform vec3 uInk[7];
          varying vec2 vQ; varying float vPx;
          void main(){
            vec2 ax = abs(vQ);
            float r1 = (1. - smoothstep(0., .06 * max(1. - ax.x, 0.) + vPx, ax.y)) * max(1. - ax.x, 0.);
            float r2 = (1. - smoothstep(0., .06 * max(1. - ax.y / .7, 0.) + vPx, ax.x)) * max(1. - ax.y / .7, 0.);
            float core = 1. - smoothstep(.05, .12 + vPx, length(vQ));
            float a = clamp(max(max(r1, r2), core) + .22 * exp(-length(vQ) * 7.), 0., 1.);
            gl_FragColor = vec4(mix(uInk[4], vec3(1.), .55), a);
          }`}));a.frustumCulled=!1,a.renderOrder=8,a.name="glints",S.add(a)}await f.yield();const ft=[{at:new v(0,40,0),from:.07,to:.26,weight:.45},{at:new v(0,40,0),from:.1,to:.8,weight:.6},{at:me.clone(),from:.8,to:1,weight:.5}],ie=new v,He=new v,he=new v,E=new v,le=new v,ut=new v(0,1,0),vt=new v,je=new t.Matrix4,dt=new t.Quaternion,ht=new v(0,0,1),Te=k.length,$e=k.pointAt(0,new v),Ce=k.pointAt(Math.min(50/Te,1),new v).sub($e).normalize(),J=new v,ge=new v,mt=.75,Qe=9*Math.PI/180,Ze=(e,a,i,o)=>{je.lookAt(vt,i,ut),e.quaternion.setFromRotationMatrix(je),e.quaternion.multiply(dt.setFromAxisAngle(ht,o)),e.position.copy(a)};function Xe(e,a,i,o){o=_(o??0,0,1);const c=L(o);V.setProgress(o),V.setEinstein(j.rare?Z(30,35,c)*(1-Z(38,40.5,c)):0),V.update(e,a,i),o>0?(ie.setFromMatrixPosition(i.matrixWorld),J.setFromMatrixColumn(i.matrixWorld,2).negate(),J.lengthSq()<1e-8&&J.copy(Ce),J.normalize().lerp(Ce,1-Z(0,.012,o)).normalize()):(ie.copy($e),J.copy(Ce)),k.tangentAt(_(o-.004,0,1),He),ge.copy(He).lerp(J,mt).normalize();const m=Math.acos(_(ge.dot(J),-1,1));m>Qe&&ge.lerp(J,1-Qe/m).normalize(),k.tangentAt(_(o-.014,0,1),he),k.tangentAt(_(o+.01,0,1),E);const z=he.z*E.x-he.x*E.z,n=Z(.42,.47,o)*(1-Z(.76,.82,o))*(.5+.5*Math.sin(a*2.3));ie.y+=n*.03*Math.sin(a*43)+.05*Math.sin(a*1.1),Ke.uUnder.value=Z(.835,.9,o),Ze(ve,ie,ge,_(-z*1.6,-.07,.07)+n*.004*Math.sin(a*37)),k.tangentAt(o,he),Ue.uStreak.value.copy(he).multiplyScalar(Y(o)*.045);const u=(c-20)/1.6;Ue.uBurst.value=Math.exp(-u*u);const r=Z(9.5,13,c),l=Z(26.5,32,c),w=c>9.2&&c<33;for(const K of Pe){const Q=K.userData;K.visible=w;const Ye=_(o+(q(-40,Q.ahead,r)+l*150)/Te,0,1);k.pointAt(Ye,le),k.tangentAt(Ye,E);const Be=E.z,Ne=-E.x,ke=Math.hypot(Be,Ne)||1,Je=q(Q.left+150,Q.left,r)+l*l*520;le.x+=Be/ke*Je,le.z+=Ne/ke*Je,le.y=Math.max(le.y+q(60,Q.up,r)+l*l*170+1.2*Math.sin(a*1.7+Q.ph),13),E.x+=Be/ke*l*.9,E.z+=Ne/ke*l*.9,E.y+=l*.25,E.normalize(),Ze(K,le,E,l*.95+.06*Math.sin(a*1.3+Q.ph))}const A=Pe[0].userData;Oe.uWakeS.value=w&&r>.6?(o-Se)*Te+A.ahead+l*150-34-l*4e3:-1e4;const h=-1+a*.035%2,H=1.9-(a*.028+.8)%2.2;be[4].set(Math.cos(h)*1280,70,Math.sin(h)*1280,16),be[5].set(Math.cos(H)*980,150,Math.sin(H)*980-500,12),Ee.uTurn.value=9e-4*(ie.x+ie.z*.7)+.05*a}return Xe(0,0,{matrixWorld:new t.Matrix4().setPosition(k.pointAt(0,new v))},0),{scene:S,path:k,duration:Me,pace:O,title:F==="cadmium"?"The Airbrushed Abyss":F==="violet"?"The Airbrushed Abyss (violet edition)":"The Airbrushed Abyss (verdigris edition)",ride:"none",style:"none",camera:{fov:70,near:.5,far:7e3,lookAhead:50,sway:.6,bank:.8},pois:ft,portal:{shape:"circle",radius:8,color:g,glow:.5,tilt:!0,revealDistance:700},post:{exposure:1,flat:1,bloom:{strength:0,radius:.5,threshold:1},grade:{saturation:1,contrast:1,tint:"#ffffff",shadowTint:"#000000",vignette:0,grain:0,aberration:0}},update:Xe,dispose(){V.dispose()}}}};export{zt as default};
