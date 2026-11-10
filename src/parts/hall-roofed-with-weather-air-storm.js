import*as n from"three";import{HALL as m,GALLERY as et}from"./hall-roofed-with-weather-plan.js";import{GLSL_CLOUD as E}from"./hall-roofed-with-weather-air-cloud.js";const N=(t,o,h)=>Math.min(h,Math.max(o,t)),W=(t,o,h)=>t+(o-t)*h,T=(t,o,h)=>{const s=N((h-t)/(o-t),0,1);return s*s*(3-2*s)},O=.5,at=1.3;function it(t,o){const h=[t()*100,t()*100,t()*100],s=(w,v)=>{const y=Math.sin(w*12.9898+v*78.233+h[v%3])*43758.5453;return y-Math.floor(y)},F=[0,1,2].map(()=>({x:0,z:-60,r:20,k:0})),B={flashes:F,sum:0,x:0,z:-60};return B.update=(w,v)=>{const y=o.front(v),d=o.back(v),r=Math.floor(w/O);let z=0,g=0,l=0;for(let A=0;A<3;A++){const c=r-A,C=(c%3+3)%3,S=w-c*O,u=F[C],L=T(0,.2,S)*(1-T(.35,at,S)),e=N(W(d+9,y-9,s(c,0)),m.x0+3,m.x1-3),f=W(m.zHigh+10,m.zLow-8,s(c,1));u.x=e,u.z=f,u.r=W(15,27,s(c,2)),u.k=L*W(.6,1,s(c,3))*o.at(e,v),z+=u.k,g+=u.k*e,l+=u.k*f}B.sum=z,z>1e-4&&(B.x=g/z,B.z=l/z)},B}const j=.025,U=.4,V=44,H=.14;function ot(t){const o=[];for(let h=0;h<V;h++){const s=t()<.4,F=5+50*t(),B=11.6+3.4*t(),w=t()*Math.PI,v=Math.cos(w),y=Math.sin(w),d=s?1+1.4*t():3+4*t(),r=s?9+8*t():d*(.8+.4*t()),z=Math.max(d,r),g=W(m.zHigh+3+z,et.z0-2-z,t()),l=[];if(s){l.push([F,g,-y,v,r,H*.7,t()]);for(let A=0;A<4;A++){const c=-.6+.4*A+(t()-.5)*.2,C=w+(t()-.5)*.7;l.push([F-y*c*r,g+v*c*r,Math.cos(C),Math.sin(C),Math.max(1,1.2*d*Math.sqrt(1-c*c)),H*1.5,t()])}}else{const A=t();for(let c=0;c<3;c++){const C=(A+c)*Math.PI/3,S=Math.cos(C),u=Math.sin(C);l.push([F,g,S*v-u*y,S*y+u*v,1/Math.sqrt(S*S/(d*d)+u*u/(r*r)),H,t()])}}o.push({bx:F,z:g,end:B,ca:v,sa:y,rx:d,rz:r,sheets:l})}return o}const K=`
float inWalls(float x){ return smoothstep(${(m.x0+.3).toFixed(1)},${(m.x0+.9).toFixed(1)},x)*(1.-smoothstep(${(m.x1-.9).toFixed(1)},${(m.x1-.3).toFixed(1)},x)); }
`,Q=`
uniform vec4 uGold[16], uFlash[3]; uniform vec3 uSlate, uAir; uniform float uAirDen;
// how far inside the storm's band a place is: 0 at its two edges, 1 from 10 m in
float inBand(float x){ float sa=clamp((uBand.x-x)/10.,0.,1.), sb=clamp((x-uBand.y)/10.,0.,1.), st=min(sa,sb); return st*st*(3.-2.*st); }
// what lights the rain at a place: the candles' gold (x) and the glow of the cloud over it (y)
vec2 rainLit(vec3 c){
  float gold=0., fl=0.;
  for(int i=0;i<16;i++){ vec3 dv=uGold[i].xyz-c; float q=dot(dv,dv)/45.; gold+=uGold[i].w/(1.+q*q); }
  for(int i=0;i<3;i++){ vec2 e=c.xz-uFlash[i].xy; fl+=uFlash[i].w*exp(-dot(e,e)*uFlash[i].z*.5); }
  return vec2(min(gold,1.),min(fl,1.5));
}
// its colour there: the hour's cloud, the gold and the glow; then the room's own air by its distance
vec3 rainCol(vec2 lit, vec3 p){
  vec3 col=uSlate*1.3+.06+vec3(1.,.7,.3)*(lit.x*.5)+vec3(.5,.55,1.)*(lit.y*.5), e=p-cameraPosition;
  return mix(col,uAir,1.-exp(-uAirDen*uAirDen*dot(e,e)));
}
`;function rt(t){const o=t.rng,h=Math.max(96,Math.round(320*Math.min(1,t.detail))),s=V*h,F=Math.PI*2,B=ot(o),w=new Float32Array(s*4),v=new Float32Array(s*4);let y=0;for(const a of B)for(let i=0;i<h;i++){const M=o()*F,b=Math.sqrt(o()),x=b*Math.cos(M)*a.rx,p=b*Math.sin(M)*a.rz;w.set([a.bx+x*a.ca-p*a.sa,a.z+x*a.sa+p*a.ca,N(a.end+(o()-.5)*2,11,16),o()],y*4),v.set([17+9*o(),2+3*o(),.2+.8*o(),0],y*4),y++}const d=()=>({tN:t.tN,uTime:t.uTime,uMargin:t.uMargin,uBand:t.uBand,uVault:t.uVault,uPx:t.uPx,uFlash:t.uFlash,uGold:t.uGold,uSlate:t.uSlate,uAir:{value:t.air.color.clone()},uAirDen:{value:t.air.density}}),r=new n.InstancedBufferGeometry;r.setAttribute("position",new n.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),r.setIndex([0,1,2,0,2,3]),r.setAttribute("aR",new n.InstancedBufferAttribute(w,4)),r.setAttribute("aQ",new n.InstancedBufferAttribute(v,4)),r.instanceCount=s;const z=new n.ShaderMaterial({uniforms:d(),fog:!1,transparent:!0,depthWrite:!1,side:n.DoubleSide,vertexShader:`
      ${E}
      ${K}
      ${Q}
      attribute vec4 aR, aQ; uniform float uPx;
      varying vec4 vC; varying vec2 vUv;
      void main(){
        float seed=aR.w, len=aQ.y, x0=uBand.y+aR.x; vec4 info; float whole, edge;
        float top=cloudY(vec2(x0,aR.y),info,whole,edge)-aQ.z, low=aR.z+len*.464, span=max(top-low,2.);      // (low: its middle's lowest, so its tip ends at its own end)
        float ph=fract(uTime*aQ.x/28.+seed), y=top-ph*span, alpha=smoothstep(0.,.08,ph)*(1.-smoothstep(.5,1.,ph))*smoothstep(.2,.7,whole);
        vec3 c=vec3(x0+${U}*(top-y),y,aR.y), axis=nrm(vec3(${U},-1.,0.)), p0=c+axis*(position.y*len*.5), toCam=cameraPosition-p0;
        float depth=sqrt(dot(toCam,toCam)+1e-6), px=.75*depth/uPx, halfW=max(${j},px);        // px: half of a pixel and a half, in metres at that distance
        alpha*=inBand(c.x)*inWalls(p0.x)*smoothstep(.6,2.5,depth)*min(1.,${j}/px);           // (the last term: one weight at every distance)
        vec2 lit=rainLit(c);
        vC=vec4(rainCol(lit,p0),min(.85,alpha*(.46+.34*lit.x+.22*lit.y)));
        vUv=position.xy;
        gl_Position=projectionMatrix*viewMatrix*vec4(p0+nrm(cross(axis,toCam))*(position.x*(vC.a<.004?0.:halfW)),1.);
      }`,fragmentShader:`
      varying vec4 vC; varying vec2 vUv;
      void main(){ float x2=vUv.x*vUv.x, y2=vUv.y*vUv.y, a=vC.a*(1.-x2)*(1.-y2*y2); gl_FragColor=vec4(vC.rgb,a); if(a<.004) discard; }`}),g=new n.Mesh(r,z);g.name="rain",g.frustumCulled=!1,g.renderOrder=7;const l=6,A=6,c=[],C=[],S=[];for(let a=0;a<=A;a++)for(let i=0;i<=l;i++)c.push(-1+2*i/l,a/A,0);for(let a=0;a<A;a++)for(let i=0;i<l;i++){const M=a*(l+1)+i,b=M+1,x=M+l+1,p=x+1;C.push(M,b,x,b,p,x)}for(const a of B)for(const i of a.sheets)S.push([i,a.end]);const u=S.length,L=new Float32Array(u*4),e=new Float32Array(u*4);S.forEach(([a,i],M)=>{L.set([a[0],a[1],i,a[6]],M*4),e.set([a[2],a[3],a[4],a[5]],M*4)});const f=new n.InstancedBufferGeometry;f.setAttribute("position",new n.Float32BufferAttribute(c,3)),f.setIndex(C),f.setAttribute("aA",new n.InstancedBufferAttribute(L,4)),f.setAttribute("aB",new n.InstancedBufferAttribute(e,4)),f.instanceCount=u;const G=new n.ShaderMaterial({uniforms:d(),fog:!1,transparent:!0,depthWrite:!1,side:n.DoubleSide,vertexShader:`
      ${E}
      ${Q}
      attribute vec4 aA, aB;                 // aA: its middle across the band, its z, its form's end (y), its seed; aB: its plan direction (x, z), its half length, its weight
      varying vec4 vC, vG; varying vec3 vW;  // vG: across (-1 .. 1), down (0 .. 1), and the grain's two coordinates
      void main(){
        vec2 q=vec2(uBand.y+aA.x,aA.y)+aB.xy*(aB.z*position.x); vec4 info; float whole, edge;
        float top=cloudY(q,info,whole,edge)-.3, span=max(top-aA.z,2.), y=top-position.y*span;
        vec3 p=vec3(q.x+${U}*(top-y),y,q.y); vec2 lit=rainLit(p);
        vC=vec4(rainCol(vec2(lit.x,lit.y*.6),p),aB.w*inBand(p.x)*smoothstep(.2,.7,whole)*(1.+.5*lit.x)); vW=p;
        vG=vec4(position.xy,position.x*aB.z/2.2+aA.w*13.7,y/30.+aA.w*5.3+uTime*.15);        // (the grain slips down the fall by the clock)
        gl_Position=projectionMatrix*viewMatrix*vec4(p,1.);
      }`,fragmentShader:`
      uniform sampler2D tN;
      ${K}
      varying vec4 vC, vG; varying vec3 vW;
      void main(){
        // its grain: fine threads down the fall (a few to a metre across, some metres long), thicker and thinner in broad patches
        float n=texture(tN,vG.zw).r, n2=texture(tN,vG.zw*vec2(.37,2.3)+vec2(.37,.11)).a, grain=.3+1.4*smoothstep(.38,.72,n)*(.6+.8*n2);
        float across=1.-vG.x*vG.x, body=smoothstep(0.,.1,vG.y)*(1.-smoothstep(.45,1.,vG.y)); vec3 e=vW-cameraPosition;
        float a=vC.a*across*across*body*grain*inWalls(vW.x)*smoothstep(.6,2.5,sqrt(dot(e,e)+1e-6));
        gl_FragColor=vec4(vC.rgb,a);
        if(a<.003) discard;
      }`}),q=new n.Mesh(f,G);return q.name="rain-veil",q.frustumCulled=!1,q.renderOrder=6.5,{mesh:g,veil:q,triangles:s*2+u*l*A*2,drawCalls:2,dispose(){r.dispose(),z.dispose(),f.dispose(),G.dispose()}}}function lt(t){const o=t.rng,h=[],s=[38+20*o(),38+20*o(),38+20*o(),m.zLow-m.zHigh-14],F=[o()*100,o()*100,o()*100],B=(e,f,G,q,a,i,M,b,x)=>{const p=Math.max(3,Math.round(a/1.6));let P=q,$=f,R=G;for(let I=0;I<p;I++){P=q+(P-q+(o()-.5)*.9)*.7;const D=$+Math.sin(P)*a/p,k=R+Math.cos(P)*a/p,Y=i+(M-i)*I/p,_=i+(M-i)*(I+1)/p;h.push($,R,D,k,Y,_,b*(1-.45*I/p),e);const J=o(),X=o(),Z=o(),tt=o();x>0&&J<x/p&&B(e,D,k,P+(X<.5?-1:1)*(.45+.6*Z),a*(.14+.18*tt),_,Math.min(1.1,_+.22),b*.55,0),$=D,R=k}};for(let e=0;e<(t.rare?4:3);e++)B(e,0,0,0,s[e],0,1,1,e===3?11:4);const w=h.length/8,v=new Float32Array(w*4),y=new Float32Array(w*4);for(let e=0;e<w;e++)v.set(h.slice(e*8,e*8+4),e*4),y.set(h.slice(e*8+4,e*8+8),e*4);const d=new n.InstancedBufferGeometry;d.setAttribute("position",new n.Float32BufferAttribute([-1,0,0,1,0,0,1,1,0,-1,1,0],3)),d.setIndex([0,1,2,0,2,3]),d.setAttribute("aSeg",new n.InstancedBufferAttribute(v,4)),d.setAttribute("aRun",new n.InstancedBufferAttribute(y,4)),d.instanceCount=w;const r={value:[0,1,2,3].map(()=>new n.Vector4(0,-60,0,0))},z=new n.ShaderMaterial({uniforms:{tN:t.tN,uTime:t.uTime,uMargin:t.uMargin,uBand:t.uBand,uVault:t.uVault,uCrawl:r,uAirDen:{value:t.air.density}},fog:!1,transparent:!0,depthWrite:!1,blending:n.AdditiveBlending,side:n.DoubleSide,vertexShader:`
      ${E}
      attribute vec4 aSeg, aRun; uniform vec4 uCrawl[4]; uniform float uAirDen; varying vec2 vK;
      void main(){
        vec4 cw=uCrawl[int(aRun.w+.5)];
        vec2 qa=cw.xy+aSeg.xy, qb=cw.xy+aSeg.zw, q=mix(qa,qb,position.y); vec4 info; float whole, edge;
        vec3 P=vec3(q.x,cloudY(q,info,whole,edge)-1.3,q.y);
        float t=mix(aRun.x,aRun.y,position.y), lit=smoothstep(0.,.07,cw.w-t);
        vec3 e=cameraPosition-P;
        float k=cw.z*lit*whole*step(${(m.x0+1).toFixed(1)},q.x)*step(q.x,${(m.x1-1).toFixed(1)})*exp(-uAirDen*uAirDen*dot(e,e));     // (the last term: the room's air)
        vec3 right=nrm(cross(vec3(qb.x-qa.x,0.,qb.y-qa.y),cameraPosition-P));
        P+=right*(position.x*aRun.z*(k<.003?0.:1.5));
        vK=vec2(position.x,k);
        gl_Position=projectionMatrix*viewMatrix*vec4(P,1.);
      }`,fragmentShader:`
      varying vec2 vK;
      void main(){ float d2=vK.x*vK.x; gl_FragColor=vec4((vec3(.8,.82,1.)*(exp(-d2*90.)*2.4)+vec3(.42,.38,1.)*(exp(-d2*5.)*(1.-d2)*.32))*vK.y,1.); }`}),g=new n.Mesh(d,z);g.name="crawlers",g.frustumCulled=!1,g.renderOrder=6;const l=(e,f)=>{const G=Math.sin(e*12.9898+f*78.233+F[f%3])*43758.5453;return G-Math.floor(G)},A=.5,c=t.rare?.24:.16,C=e=>l(e,0)<c,S=e=>C(e)&&!C(e-1)&&!C(e-2),u=e=>t.rare&&S(e)&&l(e,1)<.6,L={mesh:g,triangles:w*2,drawCalls:1,sum:0,x:0,z:-60,dispose(){d.dispose(),z.dispose()}};return L.update=(e,f)=>{const G=r.value,q=t.weather.front(f),a=t.weather.back(f),i=Math.floor(e/A-.5);for(let b=0;b<4;b++)G[b].z=0;let M=0;for(let b=3;b>=0;b--){const x=i-b;if(!S(x))continue;const p=u(x)&&!u(x-3),P=p?3:Math.floor(l(x,2)*3)%3,$=p?1.7:1.1,R=e-(x+.5)*A;if(R<0||R>$)continue;const I=N(p?.5*(q+a):W(a+13,q-13,l(x,3)),m.x0+9,m.x1-9),D=p?m.zHigh+7:W(m.zHigh+9,m.zLow-9-s[P],l(x,4)),k=T(0,.12,R)*(1-T($*.55,$,R))*(.82+.18*Math.sin(e*9+x))*t.weather.at(I,f);G[P].set(I,D,k,1.2*R/(p?.9:.45)),k>M&&(M=k,L.x=I,L.z=D+s[P]*.5)}L.sum=M},L}export{ot as dealForms,lt as makeCrawlers,it as makeLightning,rt as makeRain};
