import*as a from"three";import{makePath as re}from"../kit/core.js";const y=7.6,c=60,I=7,ne=.0075,Q=.6,X=`
  vec3 sky(vec3 d){ float h=abs(d.y), a=max(0.,-d.z);
    return vec3(.0012,.0016,.0034)+uMist*(.03*exp(-h*1.5)+.055*exp(-h*6.)+(.3*exp(-h*11.)+.1*exp(-h*3.5))*pow(a,5.)); }`,ie=`attribute vec2 aK; varying vec3 vW, vN; varying vec2 vK;
  void main(){ vK=aK; vN=normal; vec3 w=position;
    if(aK.x>.5) w=cameraPosition+position*1800.;               // the sky travels with the eye
    vW=w; gl_Position=projectionMatrix*viewMatrix*vec4(w,1.); }`,se=`precision highp float;
  uniform vec3 uMist, uColor, uShaft; uniform vec4 uPortal; uniform float uDen;
  varying vec3 vW, vN; varying vec2 vK;
  ${X}
  void main(){
    vec3 V=vW-cameraPosition; float dist=length(V); V/=max(dist,1e-4);
    vec3 col=sky(V);
    if(vK.x<.5){
      vec3 N=normalize(vN+1e-6); if(dot(N,V)>0.) N=-N;
      float s=vW.y<0.?-1.:1.;                                   // below the floor is the mirror image: its lamp is the portal's reflection
      vec3 Lp=vec3(uPortal.x,uPortal.y*s,uPortal.z)-vW; float dp=length(Lp); Lp/=max(dp,1e-3);
      float lp=max(dot(N,Lp),0.)/(1.+dp*dp*.0018);
      float rim=1.-max(dot(N,-V),0.); rim*=rim*rim;
      vec3 st=vec3(.005,.006,.009)+uColor*lp*.4+uShaft*max(N.y*s,0.)*.012+uMist*rim*.09;
      col=mix(col, st, exp(-dist*uDen*vK.y));
    }
    gl_FragColor=vec4(col,1.);
  }`,le=`varying vec3 vW, vN;
  void main(){ vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; vN=mat3(modelMatrix)*normal; gl_Position=projectionMatrix*viewMatrix*w; }`,ue=`precision highp float;
  uniform sampler2D tNext; uniform mat4 uNextPV; uniform vec4 uRect, uPortal; uniform vec3 uGain, uMist, uColor, uShaft;
  uniform float uKind, uLive, uTime, uFade, uDen, uGlow;
  varying vec3 vW, vN;
  ${X}
  void main(){
    vec3 V=vW-cameraPosition; float dist=length(V); V/=max(dist,1e-4);
    vec2 b=vW.xz-uPortal.xz; float rb=dot(b,b);
    if(uKind>.5){                                               // the shaft: soft at its edges, streaked, thinning upward
      float e=abs(dot(normalize(vN+1e-6),V)), ang=atan(b.y,b.x+1e-5), y=abs(vW.y);
      float st=.62+.38*sin(ang*5.+uTime*.07)*sin(ang*11.-uTime*.05+y*.02);
      gl_FragColor=vec4(uShaft*(e*e*st*exp(-y*.012)*(1.-smoothstep(90.,150.,y))*.075*uFade),0.); return;
    }
    float c=clamp(-V.y,0.,1.), F=.13+.65*pow(1.-c,2.2);          // how much of a mirror the floor is at this angle
    vec3 R=vec3(V.x,-V.y,V.z), col=vec3(0.);
    float t=(uPortal.z-vW.z)/min(R.z,-1e-4);
    if(t>0.){                                                   // the portal as the floor sees it: the opening, its rim and its glow
      vec3 Q=vW+R*t; vec2 q=Q.xy-uPortal.xy; float d=length(q)-uPortal.w, x=max(d,0.)/uPortal.w, r=length(q)/uPortal.w;
      if(d<0.){
        vec4 cp=uNextPV*vec4(Q,1.); vec2 uv=cp.xy/max(cp.w,1e-4)*.5+.5, lo=uRect.xy, hi=uRect.xy+uRect.zw;
        vec3 next=max(textureLod(tNext, clamp(uv,lo,hi), 0.).rgb*uGain, 0.);
        float sw=.5+.5*sin(atan(q.y,q.x+1e-5)*3.+r*5.-uTime*.4);
        vec3 veil=uColor*(.22+.75*sw*sw*(.35+.65*r))*(.35+.9*r);  // no world yet: the swirl of the ring, in broad strokes
        float edge=smoothstep(-.22*uPortal.w,0.,d), e2=edge*edge, e4=e2*e2;
        col=mix(veil,next,uLive)+uColor*(mix(e2*1.2,e4*edge*.22,uLive)+e4*e4*e4*e4*3.);
      }
      if(d>-.05) col+=(uColor*(exp(-x*x*900.)*3.2+exp(-x*7.)*.62+exp(-x*2.2)*.07)+vec3(1.5)*exp(-x*x*4000.))*uGlow;
    }
    vec3 own=uMist*.003+uShaft*.018*exp(-rb*.012)*uFade;        // the little the floor scatters: mist, and a pool where the shaft lands
    own=mix(sky(V), own, exp(-dist*uDen));                      // far off the floor is lost in the mist
    gl_FragColor=vec4(own*(1.-F)+col*F*1.25, 1.-F);
  }`,ce=`attribute vec4 aD;
  uniform float uTime, uPx, uDen, uFade; uniform vec4 uPortal; uniform vec3 uMist, uColor, uShaft;
  varying vec3 vC;
  void main(){
    vec3 c; float px;
    if(aD.z>.5){
      vec3 d=normalize(mat3(modelMatrix)*position);
      gl_Position=projectionMatrix*viewMatrix*vec4(cameraPosition+d*1500.,1.);
      c=mix(vec3(.8,.88,1.),uMist*3.,.3)*(.55+.45*sin(uTime*aD.w+aD.y))*smoothstep(.06,.45,abs(d.y))*(.25+.75*fract(aD.y*7.31));
      px=aD.x*uPx/270.;
    } else {
      vec3 p=position+vec3(sin(uTime*.11*aD.w+aD.y), .4*sin(uTime*.08*aD.w+aD.y*1.7)+uTime*.05, cos(uTime*.09*aD.w+aD.y*2.3))*1.5;
      vec3 w=(modelMatrix*vec4(p,1.)).xyz; vec4 mv=viewMatrix*vec4(w,1.); gl_Position=projectionMatrix*mv;
      float dist=max(-mv.z,.01);
      vec3 m=vec3(w.x,abs(w.y),w.z);                             // a mote under the floor is lit as its twin above
      float inB=1.-smoothstep(.5,1.,length(m.xz-uPortal.xz)/11.), dp=distance(m,uPortal.xyz);
      c=uShaft*(.1+1.3*inB*uFade)+uColor*1.1/(1.+dp*dp*.03)+uMist*.25;
      float want=aD.x*uPx*projectionMatrix[1][1]/dist; px=clamp(want,1.6,10.);
      c*=min(1.,want*want/(px*px))*smoothstep(.8,5.,dist)*exp(-dist*uDen)*(.6+.4*sin(uTime*.9*aD.w+aD.y*5.));
    }
    vC=c; gl_PointSize=px;
  }`,ve=`precision highp float; varying vec3 vC;
  void main(){ vec2 q=gl_PointCoord-.5; gl_FragColor=vec4(vC*exp(-dot(q,q)*16.),1.); }`;var de={id:"_antechamber",name:"",category:"between",antechamber:!0,weirdness:0,async build(b){const{rng:t}=b,s=b.portalView,d=new a.Scene;d.background=new a.Color(0,0,0);const V=t(),S=V<.8?t.range(.5,.76):V<.9?t.range(.86,.96):t.range(.06,.1),Y=new a.Color().setHSL(S,.6,.5),F=new a.Color().setHSL((S+t.range(-.06,.06)+1)%1,.68,.46),$=new a.Color().setHSL((S+.08)%1,.3,.85),x={uTime:{value:0},uMist:{value:Y},uColor:{value:F},uShaft:{value:$},uPortal:{value:new a.Vector4(0,y,-c,I)},uDen:{value:ne},uFade:{value:1},uGlow:{value:Q}},D=[],T=[],A=[],G=[],N=new a.Matrix4,K=new a.Matrix3,l=new a.Vector3,R=(e,o,r)=>{const n=e.attributes.position,u=e.attributes.normal,p=D.length/3;K.getNormalMatrix(N);for(let i=0;i<n.count;i++)l.fromBufferAttribute(n,i).applyMatrix4(N),D.push(l.x,l.y,l.z),l.fromBufferAttribute(u,i).applyMatrix3(K).normalize(),T.push(l.x,l.y,l.z),A.push(o,r);for(let i=0;i<e.index.count;i++)G.push(p+e.index.getX(i))},J=new a.TorusGeometry(1,.021,6,56),U=new a.SphereGeometry(1,20,12);R(U,1,0);const W=(e,o,r,n,u)=>{N.makeRotationY(n).scale(l.set(r,r,r)).setPosition(e,0,o),R(J,0,u)},Z=t.range(18.5,23),ee=t.range(14,18);let h=-t.range(25,30),_=0;for(;h>-700;){const e=-h/300;Math.abs(h+c)>7&&(_<2||t.chance(.78))&&W(0,h,Z*(1+e*.2)+t.range(-.6,.6),0,1),_++,h-=ee*(1+e)}for(let e=0,o=t.int(2,3),r=t.sign();e<o;e++,r=-r)W(r*t.range(520,1e3),-t.range(750,1400),t.range(260,480),t.range(-.7,.7),.1);const g=new a.BufferGeometry;g.setAttribute("position",new a.Float32BufferAttribute(D,3)),g.setAttribute("normal",new a.Float32BufferAttribute(T,3)),g.setAttribute("aK",new a.Float32BufferAttribute(A,2)),g.setIndex(G);const E=new a.Mesh(g,new a.ShaderMaterial({name:"ante-stone",uniforms:x,vertexShader:ie,fragmentShader:se,side:a.DoubleSide,toneMapped:!1}));E.frustumCulled=!1,d.add(E);const L={value:0},w={tNext:{value:s.texture},uNextPV:{value:s.matrix},uRect:{value:s.rect},uGain:{value:s.gain},uLive:L},k=e=>new a.ShaderMaterial({name:"ante-sheet",uniforms:{...x,...w,uKind:{value:e}},vertexShader:le,fragmentShader:ue,transparent:!0,premultipliedAlpha:!0,depthWrite:e===0,side:a.DoubleSide,toneMapped:!1}),B=new a.PlaneGeometry(6e3,6e3);B.rotateX(-Math.PI/2);const M=new a.Mesh(B,k(0));M.position.set(0,0,-1500),M.renderOrder=1,M.frustumCulled=!1,d.add(M);const q=new a.CylinderGeometry(17,9.5,150,40,1,!0);q.translate(0,75,0);const te=k(1);for(const e of[1,-1]){const o=new a.Mesh(q,te);o.position.set(0,0,-c),o.scale.y=e,o.renderOrder=e>0?2:0,o.frustumCulled=!1,d.add(o)}const f=Math.round(1500*b.quality.detail),C=420,m=new Float32Array((f+C)*3),v=new Float32Array((f+C)*4);for(let e=0;e<f;e++){let o,r,n;if(e<f*.5){const u=t.range(0,6.2832),p=10.5*Math.sqrt(t());o=p*Math.cos(u),n=-c+p*Math.sin(u),r=t.range(.3,46)}else o=t.gauss()*13,r=.4+24*t()*t(),n=t.range(-150,6);m[e*3]=o,m[e*3+1]=r,m[e*3+2]=n,v[e*4]=t.range(.035,.09),v[e*4+1]=t.range(0,6.2832),v[e*4+3]=t.range(.5,1.5)}for(let e=f;e<f+C;e++){const o=t.range(0,6.2832),r=t.range(.03,1),n=Math.sqrt(1-r*r);m[e*3]=n*Math.cos(o),m[e*3+1]=r,m[e*3+2]=n*Math.sin(o),v[e*4]=t.range(1.2,2.8),v[e*4+1]=t.range(0,6.2832),v[e*4+2]=1,v[e*4+3]=t.range(.6,2.4)}const z=new a.BufferGeometry;z.setAttribute("position",new a.BufferAttribute(m,3)),z.setAttribute("aD",new a.BufferAttribute(v,4));const H={value:270},ae=new a.ShaderMaterial({name:"ante-speck",uniforms:{...x,uPx:H},vertexShader:ce,fragmentShader:ve,blending:a.AdditiveBlending,transparent:!0,depthWrite:!1,toneMapped:!1});for(const e of[1,-1]){const o=new a.Points(z,ae);o.scale.y=e,o.renderOrder=e>0?2:0,o.frustumCulled=!1,d.add(o)}const oe=re([[0,y,0],[0,y,-c/3],[0,y,-2*c/3],[0,y,-c]]),O=new a.Vector2;let P=0,j=-1;return{scene:d,path:oe,duration:7.5,style:"none",ride:"none",companion:"none",camera:{fov:62,lookAhead:12,sway:.8,bank:0},portal:{shape:"circle",radius:I,color:F,glow:Q,style:"ring",revealDistance:4*c,blendDistance:20},post:{exposure:1.05,bloom:{strength:.5,radius:.8,threshold:.85},grade:{saturation:1.05,contrast:1.05,vignette:.45,grain:.03}},update(e,o,r,n){x.uTime.value=o,b.renderer.getDrawingBufferSize(O),H.value=O.y*.5,w.tNext.value=s.texture,w.uNextPV.value=s.matrix,w.uRect.value=s.rect,w.uGain.value=s.gain;const u=s.live?1:0;P=e>0&&Math.abs(o-j-e)<.5?P+(u-P)*(1-Math.exp(-e*2.2)):u,j=o,L.value=P;const p=(1-n)*c,i=Math.min(1,Math.max(0,(p-11)/16));x.uFade.value=i*i*(3-2*i)}}}};export{de as default};
