import*as a from"three";const g=`
float hash21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash21(i),hash21(i+vec2(1,0)),f.x), mix(hash21(i+vec2(0,1)),hash21(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float a=.5, s=0.; for(int i=0;i<4;i++){ s+=a*vnoise(p); p=p*2.03+7.1; a*=.5; } return s; }
`,p=`
uniform int uShape; uniform vec2 uHalf; // uHalf.x = radius / half width, uHalf.y = half height
float sdBox(vec2 p, vec2 b){ vec2 d=abs(p)-b; return length(max(d,0.))+min(max(d.x,d.y),0.); }
float portalSdf(vec2 p){
  if(uShape==0) return length(p)-uHalf.x;
  if(uShape==1) return sdBox(p, uHalf);
  // arch: box with a semicircle on top
  float r=uHalf.x; float yTop=uHalf.y-r;
  float box=sdBox(p-vec2(0.,(yTop-uHalf.y)*.5), vec2(r,(yTop+uHalf.y)*.5));
  float cap=length(p-vec2(0.,yTop))-r;
  return min(box,cap);
}
`;function N(f,e,t){if(f==="rect")return new a.PlaneGeometry(e*2,t*2);if(f==="arch"){const l=new a.Shape,i=t-e;return l.moveTo(-e,-t),l.lineTo(e,-t),l.lineTo(e,i),l.absarc(0,i,e,0,Math.PI,!1),l.lineTo(-e,-t),new a.ShapeGeometry(l,48)}return new a.CircleGeometry(e,96)}const V=["ring","iris","film","lens","corona","flock"],k="vec3 wash(){ vec4 b=textureLod(tBloom, clamp(vScr.xy/max(vScr.w,1e-4)*.5+.5,0.,1.), 0.); return clamp(b.rgb*b.a,0.,50.)*uDewash; }",L=`uniform mat4 uNextPV; varying vec2 vLocal; varying vec4 vClip, vScr; flat varying vec4 vC0, vCx, vCy; flat varying vec3 vCam;
  void main(){ vLocal=position.xy;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); vScr=gl_Position; vClip=uNextPV*vec4(position,1.);
    vC0=uNextPV[3]; vCx=uNextPV[0]; vCy=uNextPV[1];              // clip position of any local point = vC0 + x*vCx + y*vCy
    vCam=(inverse(modelViewMatrix)*vec4(0.,0.,0.,1.)).xyz; }`,M=`precision highp float;
  uniform sampler2D tNext, tBloom; uniform float uReveal, uTime, uNear, uSeed, uGlow, uDewash; uniform vec3 uColor, uGain; uniform vec4 uVeil;
  varying vec2 vLocal; varying vec4 vClip, vScr; flat varying vec4 vC0, vCx, vCy; flat varying vec3 vCam;
  ${g}${p}
  vec2 scr(vec2 q){ vec4 c=vC0+vCx*q.x+vCy*q.y; return c.xy/max(c.w,1e-4); }
  ${k}
  // the next world as it would be seen through local point q of the opening (q == vLocal gives exactly the plain window);
  // uGain shows it at its own exposure and tint rather than the host's. The result can be below zero (see wash()).
  vec3 nextAt(vec2 q){ vec2 s=vClip.xy/max(vClip.w,1e-4)+(scr(q)-scr(vLocal)); return textureLod(tNext, clamp(s*.5+.5,0.,1.), 0.).rgb*uGain-wash(); }
  // the glow inside the rim is gone at the crossing; uNear only clears what uReveal has already opened, so a portal
  // whose next world is not ready yet keeps its rim and its veil instead of going black
  float rimLeft(){ return 1.-smoothstep(.72,1.,uNear)*smoothstep(0.,1.,uReveal); }
  vec3 veilAt(vec2 p, float R){ float ang=atan(p.y,p.x), r=length(p)/R;
    float sw=fbm(vec2(ang*1.6+r*2.5-uTime*.25, r*3.5-uTime*.5)); float sw2=fbm(vec2(ang*3.-uTime*.15, r*7.+uTime*.3));
    float wr=smoothstep(1.6,3.1416,abs(ang));                    // cross-fade over the atan seam (the classic veil has a cut there)
    if(ang<0. && wr>0.){ float a2=ang+6.2832;
      sw=mix(sw, fbm(vec2(a2*1.6+r*2.5-uTime*.25, r*3.5-uTime*.5)), wr); sw2=mix(sw2, fbm(vec2(a2*3.-uTime*.15, r*7.+uTime*.3)), wr); }
    return uColor*(.12+1.5*pow(sw,2.2)+.6*pow(sw2,3.))*(.35+.9*r); }
  // portal.veil: a world may ask for one flat colour in place of the swirl. uVeil.a is then 1 and uVeil.rgb the colour
  // (linear, like uColor); each look writes it where it would write its veil. With uVeil.a 0 nothing changes.
`,h={};h.iris=`
  #define NB 9
  void main(){
    vec2 p=vLocal; float d=portalSdf(p); float R=min(uHalf.x,uHalf.y);
    float RB=uShape==0 ? R : length(uHalf);
    float edge=smoothstep(-.22*R,0.,d);
    float rev=smoothstep(0.,1.,uReveal), open=smoothstep(0.,.8,uNear);
    float a=mix(R*(.04+.5*rev), RB*1.14, open);                 // aperture radius; past the rim well before the crossing
    float Rc=RB*1.3, off=Rc-a;
    float rl=length(p), tw=.55*(1.-open)*rl/R;
    float cs=cos(tw), sn=sin(tw); vec2 pp=vec2(cs*p.x-sn*p.y, sn*p.x+cs*p.y);
    float phi=atan(pp.y,pp.x);
    float rot=uSeed*6.2832+uTime*.015+rev*.8+open*1.1;
    float px=length(fwidth(p))*.9;
    float best=-10., topE=0., topTh=rot, mx=-1e5;
    if(open<1.) for(int i=0;i<NB;i++){
      float th=rot+float(i)*6.2832/float(NB);
      float e=length(pp+vec2(cos(th),sin(th))*off)-Rc;          // >0 inside blade i
      mx=max(mx,e);
      float rel=mod(th-phi+3.14159,6.2832)-3.14159;
      if(e>-px && rel>best){ best=rel; topE=e; topTh=th; }
    }
    vec3 base=nextAt(p);
    if(rev<.999) base=mix(uVeil.a>.5 ? uVeil.rgb : veilAt(p,R)*1.2+uColor*.6, base, rev);
    vec3 col=base;
    if(open<1.){                                                 // blades are past the rim once open == 1
    vec3 cen=max((nextAt(vec2(.2,.1)*R)+nextAt(vec2(-.2,.1)*R)+nextAt(vec2(0.,-.2)*R))/3.,0.);
    vec3 light=mix(uColor*1.3, cen*1.5+uColor*.25, rev);         // the light coming through
    // the top blade at this pixel
    vec2 cb=-vec2(cos(topTh),sin(topTh))*off; vec2 rd=pp-cb;
    float th2=topTh+6.2832/float(NB);
    float e2=length(pp+vec2(cos(th2),sin(th2))*off)-Rc;          // <0: distance to the edge of the blade lying above
    float grain=vnoise(vec2(length(rd)/R*55., topTh*9.))*.6+vnoise(vec2(length(rd)/R*170., topTh*3.))*.4;
    float lit=.5+.5*dot(normalize(rd), normalize(vec2(-.5,.8)));
    vec3 metal=mix(vec3(.02,.022,.03), uColor*uColor*.2, .6)*(.25+1.5*lit*lit)*(.65+.7*grain);
    metal*=.2+.8*smoothstep(0.,.12*R,-e2);                       // shadow under the blade above
    metal+=uColor*.05*pow(1.-clamp(topE/(.5*R),0.,1.),2.);
    metal+=mix(uColor,vec3(.7,.8,1.),.5)*.17*pow(lit,5.)*(.45+grain);                  // a brushed sheen where the blades face the light
    metal-=vec3(.1)*(1.-open);                                   // under black against the haze and the bloom of the seams; the sheen stays above it
    float fall=.15+.85*exp(-max(rl-a,0.)/(.5*R));
    float te=max(topE,0.);
    metal+=light*fall*(1.8*exp(-te/(.01*R))+.07*exp(-te/(.1*R)));                   // rim light on the blade edge
    metal+=light*fall*(2.*exp(e2/(.007*R))+.12*exp(e2/(.035*R)))*(1.-.6*open);          // seam of light under the next blade
    vec3 ap=base+light*exp(min(mx,0.)/(.05*R))*.35*(1.-open);
    col=mix(ap, metal, smoothstep(-px,px,mx));
    }
    col+=uColor*(pow(edge,4.)*.18+pow(edge,16.)*2.6*(.45+.55*max(rev*.5,open)))*(.8+.2*sin(uTime*1.3+atan(p.y,p.x)*3.))*rimLeft();
    gl_FragColor=vec4(col,1.);
  }`,h.film=`
  void main(){
    vec2 p=vLocal; float d=portalSdf(p); float R=min(uHalf.x,uHalf.y);
    float edge=smoothstep(-.22*R,0.,d); float rr=clamp(1.+d/R,0.,1.);
    float rev=smoothstep(0.,1.,uReveal), thin=1.-smoothstep(.1,.9,uNear)*rev;
    vec3 col;
    if(thin>.001){
    vec2 q=p/R; float t=uTime;
    vec2 w=vec2(fbm(q*1.3+vec2(0.,t*.05)+uSeed*9.), fbm(q*1.3+vec2(5.2,-t*.04)+uSeed*3.));
    float h=fbm(q*1.1+1.9*w+vec2(t*.03,-t*.06));                 // slow marbled swirls
    float grav=.5-.5*p.y/uHalf.y;                                // the film drains: thicker toward the bottom
    float h2=fbm(q*4.3+3.*w+vec2(-t*.05,t*.04));                 // finer eddies carried by the big ones
    float thick=clamp(.06+.42*h+.16*h2+.5*grav+.2*rr*rr*rr,0.,1.4)*(.3+.7*thin);
    vec3 V=normalize(vCam-vec3(p,0.)); float cosT=abs(V.z);
    float cosIn=sqrt(1.-(1.-cosT*cosT)/1.77);
    float opd=2.*1.33*(80.+900.*thick)*cosIn;                    // optical path difference, nm
    vec3 irid=.5-.5*cos(6.2832*opd/vec3(650.,540.,450.));
    irid=mix(vec3(dot(irid,vec3(.333))), irid, mix(.58,.9,rev));  // the shut film is pearl rather than neon
    float F=pow(1.-cosT,4.);
    float A=clamp(.1+.16*h2+.5*pow(rr,3.)+2.5*F,0.,.9);
    A=mix(.82, A, pow(rev,.6))*thin;                             // the film gives way a little ahead of the reveal
    vec2 off=(w-.5)*R*.05*thin*(.3+rr);
    vec3 next=nextAt(p+off);
    vec3 under=next;
    if(rev<.999){ vec3 dark=uColor*.02+vec3(.004,.005,.008);     // far off the shut film is a dark bubble; up close it waits as a veil
      under=mix(mix(dark, uVeil.a>.5 ? uVeil.rgb : veilAt(p,R)*.5+uColor*.05, uNear), next, rev); }
    vec3 sky=mix(vec3(1.), uColor, .3)*(.9+.5*rr);
    float glint=pow(fbm(q*3.2+w*4.+vec2(t*.05,0.)),5.)*14.;
    col=under*(1.-.3*A)+irid*sky*A*(1.+glint*.35);
    col+=mix(vec3(.62), irid*.75+.25, smoothstep(0.,.3,thin))*mix(vec3(1.),uColor,.5)*(pow(edge,3.)*.45*thin+pow(edge,14.)*2.8*rimLeft());
    } else col=nextAt(p)+vec3(.62)*mix(vec3(1.),uColor,.5)*pow(edge,14.)*2.8*rimLeft();
    gl_FragColor=vec4(col,1.);
  }`,h.lens=`
  void main(){
    vec2 p=vLocal; float d=portalSdf(p); float R=min(uHalf.x,uHalf.y);
    float edge=smoothstep(-.22*R,0.,d); float r=clamp(1.+d/R,0.,1.);
    float rev=smoothstep(0.,1.,uReveal), k=uNear;
    float f=mix(-.25,1.36,smoothstep(.06,.7,k));                 // the flip: a front that runs from the centre to the rim
    float w=1.-smoothstep(f-.3,f,r);                             // 0 inverted .. 1 upright
    float bulge=1.-smoothstep(.5,.93,k), gl=1.-smoothstep(.55,.93,k);
    float up=mix(1., .5+.5*r*r, bulge);
    float inv=-.92*(.55+.45*r*r);
    float m=mix(inv, up, w);                                     // exactly 1 once k >= .93
    float ca=.035*bulge*r;
    vec2 q=p*m;
    vec3 next=vec3(nextAt(q*(1.-ca)).r, nextAt(q).g, nextAt(q*(1.+ca)).b);
    vec3 col=next;
    if(rev<.999) col=mix(uVeil.a>.5 ? uVeil.rgb : veilAt(q,R), next, rev);
    float gw=min(1.,uGlow);                                      // quiet worlds get a quiet glass
    vec3 light=mix(uColor, max(nextAt(vec2(0.)),0.)+uColor*.2, rev);
    col+=light*exp(-m*m*90.)*w*(1.-w)*5.;                        // the focus ring sweeping outward
    vec2 pn=p/R;
    float body=sqrt(max(1.-r*r,0.));
    col*=mix(1., .34+.66*smoothstep(0.,.5,body), gl);            // glass darkens toward the limb
    vec3 env=mix(uColor*.25, vec3(.85,.92,1.), smoothstep(-.6,1.,pn.y))*.6;
    col=mix(col, env, gl*.3*pow(r,12.));                         // sky mirrored at grazing angles
    vec2 hp=pn-vec2(-.4,.46);
    float h1=.45*exp(-dot(hp,hp)*120.)+.5*exp(-dot(hp-vec2(.1,-.11),hp-vec2(.1,-.11))*420.);
    float h2=pow(r,6.)*smoothstep(.2,1.,dot(normalize(pn+1e-5),normalize(vec2(.55,-.83))));
    col+=gl*gw*(vec3(1.)*h1*1.2+mix(light,vec3(1.),.4)*h2*1.1);  // window highlight and the caustic crescent opposite
    col+=mix(uColor,vec3(1.),.5)*(pow(edge,4.)*.05*gl+pow(edge,14.)*2.3*rimLeft())*gw;
    gl_FragColor=vec4(col,1.);
  }`,h.corona=`
  void main(){
    vec2 p=vLocal; float d=portalSdf(p); float R=min(uHalf.x,uHalf.y);
    float edge=smoothstep(-.22*R,0.,d); float r=clamp(1.+d/R,0.,1.);
    vec2 dn=normalize(p+1e-5);
    float rev=smoothstep(0.,1.,uReveal), k=smoothstep(0.,.85,uNear)*rev;
    float n=(fbm(dn*2.2+uSeed*5.+uTime*.04)*.16+fbm(dn*7.+uTime*.07)*.05)*smoothstep(0.,.3,r);
    float cr=mix(-.06+.74*rev, 1.7, k), soft=.3;
    float clr=(1.-smoothstep(cr-soft, cr, r+n))*smoothstep(0.,.12,uReveal);
    vec3 moon=-vec3(.12)*(1.-.4*pow(r,6.));                     // a touch under black against the bloom of its own corona
    if(rev<.999) moon=mix(moon, uVeil.a>.5 ? uVeil.rgb : veilAt(p,R)*.35, uNear*(1.-rev)); // reached before the next world is ready: embers, not a hole
    vec3 pale=mix(uColor, vec3(1.,.97,.92), .7);
    vec3 col=mix(moon, nextAt(p), clr);
    float ring=exp(-pow((r+n-cr+soft*.35)/.09,2.));
    col+=pale*ring*.14*rev*(1.-k);                                // pale light at the edge of the clearing
    col+=(mix(uColor,vec3(1.,.45,.38),.4)*pow(edge,14.)*.7+pale*pow(edge,40.)*2.2)*rimLeft();   // chromosphere and limb
    gl_FragColor=vec4(col,1.);
  }`;const H=`
  float flockCut(vec2 p){ vec2 dn=normalize(p+1e-5); float n=fbm(dn*2.6+uSeed*7.+vec2(uTime*.06,-uTime*.04));
    return mix(.8+.17*n, 1., smoothstep(.45,.95,uNear)); }      // the feather survives to the rim: no bare edge in the last metres
  float flockFeather(){ return mix(.22,.14,smoothstep(.45,.95,uNear)); }
  float flockMist(vec2 p, float rs){ vec2 dn=normalize(p+1e-5); return .45+.7*fbm(dn*5.+rs*3.-uTime*.15); }
  vec4 flockPix(vec2 p, float R, float rs, float cut, float a){  // premultiplied; a is exactly 1 over the part seen at the crossing
    float rev=smoothstep(0.,1.,uReveal), fade=1.-smoothstep(.5,.95,uNear)*rev;
    vec3 next=nextAt(p), col=next;
    if(rev<.999) col=mix(uVeil.a>.5 ? uVeil.rgb : veilAt(p,R)*.7, next, rev);
    float band=exp(-pow((rs-cut+.1)/.11,2.));
    vec3 glow=mix(uColor, next, .7*rev)*band*flockMist(p,rs)*.18*fade;   // the mist takes the next world's light, not a flat tint
    return vec4(col*a+glow, a);
  }
`;h.flock=H+`
  void main(){
    vec2 p=vLocal; float d=portalSdf(p); float R=min(uHalf.x,uHalf.y);
    float rs=1.+d/R, cut=flockCut(p);
    float a=1.-smoothstep(cut-flockFeather(), cut, rs);
    if(a<CUT_A) discard;
    gl_FragColor=flockPix(p,R,rs,cut,a);
  }`;const _=`precision highp float;
  uniform float uTime, uGlow, uReveal, uNear, uSeed, uHaloSize; uniform vec3 uColor; varying vec2 vLocal;
  ${g}${p}
`,u={};u.iris=`
  void main(){
    float d=portalSdf(vLocal); if(d<-0.05) discard;
    float R=min(uHalf.x,uHalf.y), x=max(d,0.)/R, ang=atan(vLocal.y,vLocal.x);
    float rev=smoothstep(0.,1.,uReveal);
    float lite=.45+.55*max(rev*.5,smoothstep(0.,.8,uNear));       // a shut iris keeps its light behind the blades
    float rim=exp(-x*x*2400.)*2.2*lite;
    float ring2=exp(-pow((x-.085)/.01,2.))*.8;                    // outer edge of the housing
    float ticks=exp(-pow((x-.045)/.022,2.))*pow(.5+.5*cos(ang*72.),10.)*.9;
    float soft=exp(-x*11.)*(.08+.3*rev);
    float far=exp(-x*2.2)*.05*(.4+.6*rev);
    vec3 col=uColor*(rim+ring2+ticks+soft+far)*uGlow+vec3(1.)*exp(-x*x*5000.)*1.2*lite*uGlow;
    gl_FragColor=vec4(col,1.);
  }`,u.film=`
  void main(){
    float d=portalSdf(vLocal); if(d<-0.05) discard;
    float R=min(uHalf.x,uHalf.y), x=max(d,0.)/R;
    vec2 dn=normalize(vLocal+1e-5);
    float ph=fbm(dn*2.+uSeed*9.+uTime*.03)*2.2+x*5.;
    vec3 hue=.5+.5*cos(6.2832*(ph+vec3(0.,.33,.67)));
    vec3 tint=mix(uColor, hue, .65);
    float rim=exp(-x*x*2600.)*2.4, soft=exp(-x*11.)*.4, far=exp(-x*2.6)*.05;
    gl_FragColor=vec4((tint*(rim+soft)+uColor*far+vec3(1.)*exp(-x*x*9000.)*1.2)*uGlow, 1.);
  }`,u.lens=`
  void main(){
    float d=portalSdf(vLocal); if(d<-0.05) discard;
    float R=min(uHalf.x,uHalf.y), x=max(d,0.)/R;
    vec2 dn=normalize(vLocal+1e-5);
    vec3 pale=mix(uColor, vec3(1.), .55);
    float rim=exp(-x*x*2200.)*2.1, soft=exp(-x*13.)*.08, far=exp(-x*2.4)*.04;
    float caus=exp(-x*7.)*pow(max(-dn.y*.8+dn.x*.6,0.),3.)*1.9*(1.-.7*uNear);   // light thrown out past the lower limb
    gl_FragColor=vec4((pale*(rim+soft+caus)+uColor*far+vec3(1.)*exp(-x*x*8000.)*1.1)*uGlow, 1.);
  }`,u.corona=`
  void main(){
    float d=portalSdf(vLocal); if(d<-0.05) discard;
    float R=min(uHalf.x,uHalf.y), x=max(d,0.)/R;
    vec2 dn=normalize(vLocal+1e-5);
    float open=max(smoothstep(0.,1.,uReveal)*.55, uNear);
    float ax=uSeed*3.1416; float eq=abs(dot(dn, vec2(cos(ax),sin(ax))));      // long streamers along one axis
    float s1=fbm(dn*3.2+uSeed*17.+vec2(0.,uTime*.02));
    float s2=fbm(dn*(9.+x*1.4-uTime*.12)+uSeed*3.);                           // structure drifting outward
    float rays=pow(vnoise(dn*36.+3.)*.6+vnoise(dn*88.+uTime*.05)*.4, 2.);
    float len=(.22+1.5*pow(eq,3.)*(.4+s1)+.6*s1*s1)*(1.+1.7*open);
    float stream=exp(-x/len)*(.1+1.05*s2*s2+.5*rays*exp(-x*1.4));
    float pxl=length(fwidth(vLocal))/R, dist=smoothstep(.012,.07,pxl);        // far off the limb stays at least a pixel or two wide,
    float inner=exp(-x*14.)*.5*(1.+1.5*dist)+exp(-x*x/max(1./1500.,pxl*pxl*2.5))*1.8*(1.+.6*dist);   // so the dark disc is always ringed by light
    vec2 bd=vec2(cos(uSeed*40.),sin(uSeed*40.)); float bdot=max(dot(dn,bd),0.);
    float bead=exp(-x*x*260.)*pow(bdot,160.)*6.+exp(-x*6.)*pow(bdot,24.)*.7; // the diamond on the ring
    vec3 pale=mix(uColor, vec3(1.,.97,.92), .7);
    vec3 col=pale*(inner+stream*.42)+vec3(1.)*(bead+exp(-x*x*6000.)*.7);
    col*=1.-.55*uNear;                                            // the fire thins as the streamers lengthen
    vec2 e=abs(vLocal)/uHaloSize; col*=1.-smoothstep(.72,1.,max(e.x,e.y));
    gl_FragColor=vec4(col*uGlow, 1.);
  }`,u.flock=H+`
  void main(){
    vec2 p=vLocal; float d=portalSdf(p); float R=min(uHalf.x,uHalf.y);
    float rs=1.+d/R, cut=flockCut(p), x=rs-cut, fw=flockFeather();
    float a=1.-smoothstep(cut-fw, cut, rs);
    if(a>=.5 || x>1.5) discard;                                  // the view mesh has drawn the opaque part
    vec4 o=vec4(0.);
    if(a>0.) o=flockPix(p,R,rs,cut,a);
    float rev=smoothstep(0.,1.,uReveal), xo=max(x,0.);
    vec3 tint=mix(uColor, max(nextAt(normalize(p+1e-5)*R*.6),0.), .6*rev);
    float mist=exp(-xo*6.)*flockMist(p,rs)*smoothstep(-fw*.5,0.,x);
    float fade=1.-.75*smoothstep(.5,.95,uNear);
    o.rgb+=tint*(mist*.2+exp(-xo*2.)*.04*smoothstep(-fw*.5,0.,x))*uGlow*fade;
    gl_FragColor=o;
  }`;const A=`attribute vec4 aSeed;
  uniform float uTime, uNear, uSeed, uPx;
  varying vec2 vP; varying float vL, vB, vHue;
  ${p}
  vec3 flockPos(float t){
    float th=6.2832*(aSeed.x+t*(.05+.035*aSeed.z));
    th+=.22*sin(th*2.-t*.35+uSeed*6.)+.1*sin(th*5.+t*.5);        // the flock bunches and thins as it turns
    float ph=6.2832*(aSeed.y+t*(.06+.12*fract(aSeed.z*7.31)));
    vec2 dir=vec2(cos(th),sin(th));
    float s=0.; for(int i=0;i<12;i++) s-=portalSdf(dir*s);       // walk out to the edge of the opening, whatever its shape
    float R=min(uHalf.x,uHalf.y), part=uNear*uNear, m=fract(aSeed.w*13.7);
    float minor=R*(.05+.17*m*m)*(1.+2.2*part);
    float rad=s+R*.03+R*1.15*part+minor*cos(ph)+R*.03*sin(t*.7+aSeed.x*40.);
    return vec3(dir*rad, minor*sin(ph)*1.4);
  }
  void main(){
    vec3 h=(modelViewMatrix*vec4(flockPos(uTime),1.)).xyz, tl=(modelViewMatrix*vec4(flockPos(uTime-.13),1.)).xyz;
    float R=min(uHalf.x,uHalf.y);
    float wd0=R*.013*(.6+.9*aSeed.w), wmin=max(1.2*(-h.z)/(uPx*projectionMatrix[1][1]), 1e-5);
    float wd=max(wd0,wmin), thin=min(1.,wd0/wd);                 // never thinner than a pixel, but then no brighter either
    vec2 dv=h.xy-tl.xy; float len=length(dv); vec2 dir2=len>1e-5 ? dv/len : vec2(1.,0.), side=vec2(-dir2.y,dir2.x);
    vec2 uvq=position.xy+.5;
    vec3 c=mix(tl,h,uvq.x);
    c.xy+=(dir2*(uvq.x*2.-1.)+side*(uvq.y*2.-1.))*wd*2.;
    vL=len/wd; vP=vec2(mix(-2.,vL+2.,uvq.x),(uvq.y*2.-1.)*2.);
    vHue=fract(aSeed.w*5.3);
    vB=(1.5+2.6*fract(aSeed.z*3.7))*(.62+.38*sin(uTime*(2.+4.*aSeed.z)+aSeed.x*90.))*(1.-.45*uNear*uNear);
    vB*=thin*thin*mix(.5,1.,smoothstep(0.,.25,wd0/wmin));        // far off the flock is a soft wreath, not a glare
    gl_Position=projectionMatrix*vec4(c,1.);
  }`,G=`precision highp float;
  uniform vec3 uColor; uniform float uGlow;
  varying vec2 vP; varying float vL, vB, vHue;
  void main(){
    float cx=clamp(vP.x,0.,vL); float dd=length(vP-vec2(cx,0.));
    vec2 hd=vP-vec2(vL,0.);
    float g=exp(-dd*dd*3.5)*mix(.1,1.,pow(cx/max(vL,1e-3),2.))+exp(-dot(hd,hd)*1.2)*.5;
    vec3 tint=uColor*mix(vec3(1.2,.85,.55), vec3(.7,.95,1.3), vHue);   // warm and cool lights either side of the portal colour
    gl_FragColor=vec4(mix(tint, vec3(1.), .2+.25*vHue)*g*vB*(.5+.5*uGlow), 1.);
  }`;function P(f,e){let t=f.seed;if(typeof t=="string"){let i=2166136261;for(let n=0;n<t.length;n++)i=Math.imul(i^t.charCodeAt(n),16777619);t=(i>>>0)/4294967296*1e3}(typeof t!="number"||!isFinite(t))&&(t=e.r*12.9898+e.g*78.233+e.b*37.719+(f.radius??f.width??0)*3.17+(f.height??0)*1.31+(f.revealDistance||0)*.013+(f.glow??1)*5.3);const l=Math.sin(t*12.9898+1.2345)*43758.5453;return l-Math.floor(l)}class z{constructor(e={}){const t=e.shape||"circle",l=t==="circle"?e.radius??7:(e.width??10)/2,i=t==="circle"?l:(e.height??14)/2;this.shape=t,this.hx=l,this.hy=i,this.boundR=Math.hypot(l,i);const n=new a.Color(e.color??"#9fd0ff"),o=t==="circle"?0:t==="rect"?1:2,v=e.frame===0||e.frame===!1;let s=!v&&V.includes(e.style)?e.style:"ring";t!=="circle"&&(s=s==="corona"?"iris":s==="lens"?"film":s);const r=s==="ring",c=s==="flock",b=e.halo!==!1&&!v,y={value:null};this.style=s;const m={uTime:{value:0},uColor:{value:n},uShape:{value:o},uHalf:{value:new a.Vector2(l,i)},uReveal:{value:0},uNear:{value:0},uSeed:{value:P(e,n)},uGain:{value:new a.Vector3(1,1,1)},uNextPV:{value:new a.Matrix4},tBloom:{value:null},uDewash:{value:0},uVeil:{value:new a.Vector4(0,0,0,0)}};this._shared=m,this.setVeil(e.veil),this.viewMat=new a.ShaderMaterial({uniforms:{...m,tNext:y,uGlow:{value:v?0:e.glow??1}},vertexShader:r?`uniform mat4 uNextPV; varying vec2 vLocal; varying vec4 vClip, vScr;
        void main(){ vLocal=position.xy; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); vScr=gl_Position; vClip=uNextPV*vec4(position,1.); }`:L,fragmentShader:r?`precision highp float;
        uniform sampler2D tNext, tBloom; uniform float uReveal, uTime, uGlow, uNear, uDewash; uniform vec3 uColor, uGain; uniform vec4 uVeil;
        varying vec2 vLocal; varying vec4 vClip, vScr;
        ${g}${p}${k}
        void main(){
          vec2 suv = vClip.xy/max(vClip.w,1e-4)*.5+.5;
          float d = portalSdf(vLocal);
          float R = min(uHalf.x,uHalf.y);
          float edge = smoothstep(-.22*R, 0., d);
          float ang = atan(vLocal.y, vLocal.x);
          vec2 dirn = normalize(vLocal+1e-5);
          ${v?"":"suv += dirn*edge*edge*(.010*sin(uTime*1.7+ang*5.)+.006*sin(uTime*2.9-ang*9.));"}
          vec3 next = textureLod(tNext, clamp(suv,0.,1.), 0.).rgb*uGain-wash();
          float r = length(vLocal)/R;
          float sw = fbm(vec2(ang*1.6+r*2.5-uTime*.25, r*3.5-uTime*.5));
          float sw2 = fbm(vec2(ang*3.-uTime*.15, r*7.+uTime*.3));
          float wr = smoothstep(1.6,3.1416,abs(ang));                 // cross-fade over the atan seam, or the veil shows a hard cut to the left of centre
          if(ang<0. && wr>0.){ float a2=ang+6.2832;
            sw=mix(sw, fbm(vec2(a2*1.6+r*2.5-uTime*.25, r*3.5-uTime*.5)), wr); sw2=mix(sw2, fbm(vec2(a2*3.-uTime*.15, r*7.+uTime*.3)), wr); }
          vec3 veil = uVeil.a>.5 ? uVeil.rgb : uColor*(.12+1.5*pow(sw,2.2)+.6*pow(sw2,3.))*(.35+.9*r);   // portal.veil: one flat colour
          vec3 col = mix(veil, next, uReveal);
          // light inside the rim. Before the next world shows, it is the old broad glow; once it shows, only a thin
          // bright edge is left, so the wash no longer pales the outer third of the picture. Both follow portal.glow.
          float rev = smoothstep(0., 1., uReveal);
          float wash = mix(pow(edge,2.5)*1.6 + pow(edge,10.)*3., pow(edge,5.)*.22 + pow(edge,16.)*3., rev);
          col += uColor*wash*min(uGlow,1.5)*(.8+.2*sin(uTime*1.3+ang*3.))*(1.-.5*smoothstep(.72,1.,uNear)*rev);
          gl_FragColor = vec4(col,1.);
        }`:(c?`#define CUT_A ${b?".5":".004"}
`:"")+M+h[s],side:a.DoubleSide,toneMapped:!1,fog:!1}),this.view=new a.Mesh(N(t,l,i),this.viewMat),this.view.renderOrder=5,this.view.frustumCulled=!1,c&&(this.viewMat.transparent=!0,this.viewMat.premultipliedAlpha=!0,this.view.renderOrder=-1);const d=Math.max(l,i)*(s==="corona"?5.2:2.6);this.haloMat=new a.ShaderMaterial({uniforms:c?{...m,tNext:y,uGlow:{value:e.glow??1},uHaloSize:{value:d}}:{...m,uGlow:{value:e.glow??1},uHaloSize:{value:d}},vertexShader:c?L:"varying vec2 vLocal; void main(){ vLocal=position.xy; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }",fragmentShader:c?M+u.flock:r?`precision highp float;
        uniform float uTime, uGlow; uniform vec3 uColor; varying vec2 vLocal;
        ${g}${p}
        void main(){
          float d = portalSdf(vLocal); if(d<-0.05) discard;
          float R = min(uHalf.x,uHalf.y); float x = max(d,0.)/R;
          float ang = atan(vLocal.y, vLocal.x);
          float wisp = fbm(vec2(ang*2.5+uTime*.2, x*5.-uTime*.7));
          float wr = smoothstep(1.6,3.1416,abs(ang));                 // the same cross-fade over the atan seam
          if(ang<0. && wr>0.) wisp=mix(wisp, fbm(vec2((ang+6.2832)*2.5+uTime*.2, x*5.-uTime*.7)), wr);
          float rim = exp(-x*x*900.)*3.2;
          float soft = exp(-x*7.)*(.35+.9*wisp*wisp);
          float far = exp(-x*2.2)*.07;
          vec3 col = uColor*(rim+soft+far)*uGlow + vec3(1.)*exp(-x*x*4000.)*1.5*uGlow;
          gl_FragColor = vec4(col, 1.);
        }`:_+u[s],blending:a.AdditiveBlending,depthWrite:!1,transparent:!0,side:a.DoubleSide,toneMapped:!1,fog:!1}),this.halo=new a.Mesh(new a.PlaneGeometry(d*2,d*2),this.haloMat),this.halo.position.z=-.02,this.halo.renderOrder=6,this.halo.frustumCulled=!1,c&&(this.haloMat.blending=a.NormalBlending,this.haloMat.premultipliedAlpha=!0),this.group=new a.Group,this.group.add(this.view),b&&this.group.add(this.halo),this.group.matrixAutoUpdate=!1,c&&this._makeFlock(m,e),this.rim=[];const R=16;for(let w=0;w<R;w++){const x=w/R*Math.PI*2;if(t==="circle")this.rim.push(new a.Vector3(Math.cos(x)*l,Math.sin(x)*i,0));else{const C=Math.cos(x),S=Math.sin(x),T=1/Math.max(Math.abs(C),Math.abs(S));this.rim.push(new a.Vector3(C*T*l,S*T*i,0))}}this.rim.push(new a.Vector3(0,0,0))}place(e){(this._frame||(this._frame=new a.Matrix4)).copy(e),this._grow=1,this.group.matrix.copy(e),this.group.matrixWorldNeedsUpdate=!0,this.group.updateMatrixWorld(!0)}setGrow(e){e===this._grow||!this._frame||(this._grow=e,this.group.matrix.copy(this._frame).scale(new a.Vector3(e,e,e)),this.group.matrixWorldNeedsUpdate=!0,this.group.updateMatrixWorld(!0))}setTime(e){this.viewMat.uniforms.uTime.value=e}setReveal(e){this.viewMat.uniforms.uReveal.value=e}setTexture(e){this.viewMat.uniforms.tNext.value=e}setNear(e){this._shared.uNear.value=Math.min(1,Math.max(0,e))}setGain(e,t,l){this._shared.uGain.value.set(e,t,l)}setVeil(e){const t=this._shared.uVeil.value;if(e==null||e===!1)t.set(0,0,0,0);else{const l=new a.Color(e);t.set(l.r,l.g,l.b,1)}}setDewash(e,t){this._shared.tBloom.value=t>0?e:null,this._shared.uDewash.value=e?t:0}setNextView(e){this._shared.uNextPV.value.copy(e)}dispose(){this.view.geometry.dispose(),this.halo.geometry.dispose(),this.viewMat.dispose(),this.haloMat.dispose(),this.flock&&(this.flock.geometry.dispose(),this.flock.material.dispose(),this.flock.dispose())}_makeFlock(e,t){const i=new Float32Array(2080);let n=Math.floor(e.uSeed.value*4294967296)>>>0;const o=()=>{n=n+1831565813|0;let r=Math.imul(n^n>>>15,1|n);return r=r+Math.imul(r^r>>>7,61|r)^r,((r^r>>>14)>>>0)/4294967296};for(let r=0;r<520*4;r++)i[r]=o();const v=new a.PlaneGeometry(1,1);v.setAttribute("aSeed",new a.InstancedBufferAttribute(i,4));const s=new a.ShaderMaterial({uniforms:{...e,uGlow:{value:t.glow??1},uPx:{value:270}},vertexShader:A,fragmentShader:G,blending:a.AdditiveBlending,depthWrite:!1,transparent:!0,side:a.DoubleSide,toneMapped:!1,fog:!1});this.flock=new a.InstancedMesh(v,s,520),this.flock.renderOrder=7,this.flock.frustumCulled=!1,this.flock.onBeforeRender=r=>{const c=r.getRenderTarget();s.uniforms.uPx.value=(c?c.height:r.domElement.height)*.5},this.group.add(this.flock)}static pickStyle(e,t={}){const l=typeof e=="function"?e():.5;if(l<.34)return"ring";const i=t.category==="wonders"?t.placeKind:t.category,n=t.weirdness??0,o={iris:1,film:1,lens:1,corona:1,flock:1};i==="alien"||i==="bizarre"?(o.corona=2.3,o.lens=2.1,o.iris=.8,o.film=.8,o.flock=.8):i==="interior"||i==="city"?(o.iris=1.9,o.film=1.3,o.corona=.7):i==="ocean"?(o.film=1.6,o.lens=1.5,o.flock=1.4,o.iris=.6):i==="sky"?(o.flock=1.6,o.corona=1.4,o.film=1.2):i==="wilderness"?(o.flock=1.8,o.film=1.2,o.lens=1.1,o.iris=.6):i==="domestic"&&(o.lens=1.7,o.film=1.5,o.iris=1.2,o.corona=.6),o.corona+=1.5*n,o.lens+=1.2*n;const v=Object.keys(o);let s=0;for(const c of v)s+=o[c];let r=(l-.34)/.66*s;for(const c of v)if(r-=o[c],r<0)return c;return"flock"}}export{V as PORTAL_STYLES,z as Portal};
