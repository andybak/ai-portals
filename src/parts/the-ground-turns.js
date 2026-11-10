import*as e from"three";const u=Math.PI/180,Z=52.5;function ee(o){const s=o<.12?0:o<.2?(o-.12)*(o-.12)/.16:.04+(o-.2);return Z*s/.84}const Xe=o=>.16+.84*o/Z,be=28,Se=2.4,Be=o=>be*(1-Math.pow(Math.max(0,1-o),Se));function te(o,s,c,n=new e.Vector3){const h=-Math.cos(s)*Math.sin(o),v=Math.sin(c)*Math.sin(s)+Math.cos(c)*Math.cos(s)*Math.cos(o),m=Math.cos(c)*Math.sin(s)-Math.sin(c)*Math.cos(s)*Math.cos(o);return n.set(h,v,-m).normalize()}const Oe=[[2.53,89.26,6,"#E6EEFF"],[11.062,61.75,4.6,"#FFE9C8"],[11.031,56.38,3.4,"#DCE6FF"],[11.897,53.69,3.4,"#DCE6FF"],[12.257,57.03,2.4,"#DCE6FF"],[12.9,55.96,4.6,"#DCE6FF"],[13.399,54.93,4,"#DCE6FF"],[13.792,49.31,4.4,"#CFE0FF"],[.153,59.15,3.6,"#F2F0E6"],[.675,56.54,3.8,"#FFE0B8"],[.945,60.72,3.8,"#CFE0FF"],[1.43,60.24,3,"#DCE6FF"],[1.907,63.67,2.2,"#CFE0FF"],[5.278,46,7,"#FFE08A"]],H=`
  uniform vec3 uLandUp, uSunDir, uGal; uniform float uSunAlt, uPx, uTime, uCells2; uniform vec4 uStar[14]; uniform vec3 uStarCol[14]; uniform vec4 uVenus;
  float gtH21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
  float gtVn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
    return mix(mix(gtH21(i),gtH21(i+vec2(1.,0.)),f.x), mix(gtH21(i+vec2(0.,1.)),gtH21(i+vec2(1.,1.)),f.x), f.y); }
  float gtFbm(vec2 p){ return .5*gtVn(p)+.25*gtVn(p*2.03+7.1)+.125*gtVn(p*4.01+3.3)+.0625*gtVn(p*8.1+1.7); }
  vec2 gtOct(vec3 d){ d/=(abs(d.x)+abs(d.y)+abs(d.z)); vec2 p=d.xz;
    if(d.y<0.){ vec2 s=vec2(p.x>=0.?1.:-1., p.y>=0.?1.:-1.); p=(1.-abs(p.yx))*s; } return p; }
  vec3 gtUnoct(vec2 p){ vec3 v=vec3(p.x, 1.-abs(p.x)-abs(p.y), p.y); float t=max(-v.y,0.);
    v.x+= v.x>=0.? -t : t; v.z+= v.z>=0.? -t : t; return normalize(v); }
  // one star per cell at a hashed place kept clear of the cell's edge, so no neighbour search is needed
  vec3 gtLayer(vec3 dir, float cells, float gain, float cap, float sig, float lowTw, float dens, float veil){
    vec2 g=(gtOct(dir)*.5+.5)*cells, id=floor(g);
    float h1=gtH21(id+11.3), h2=gtH21(id+47.7), h3=gtH21(id+83.1), h4=gtH21(id+5.9);
    vec3 sd=gtUnoct(((id+.14+.72*vec2(h1,h2))/cells)*2.-1.);
    vec3 dv=dir-sd; float d2=dot(dv,dv);
    float hh=max(h3,.012); float peak=min(gain*dens/(hh*sqrt(hh)), cap);
    float tw=1.+(.20+.40*lowTw)*sin(uTime*(3.+6.*h4)+h1*40.);
    float vis=clamp(1.-veil/max(peak,1e-3), 0., 1.);
    vec3 tint=mix(vec3(.62,.75,1.), vec3(1.,.80,.56), h4*h4);
    float sg=sig*(1.+.55*smoothstep(1.,2.4,peak));                                     // the brightest are a little wider, not sharper: a round shape for the bloom
    return tint*(peak*tw*vis*exp(-d2/(2.*sg*sg)));
  }
  vec3 gtSmoothSky;                                                                  // the last sky4 without its stars and sun (for the still waters)
  vec3 sky4(vec3 dir, float w, float glow, float mwG){
    float h=dot(dir,uLandUp);
    float hp=max(h,0.);
    // night: zenith, and an airglow band hugging the land's horizon
    vec3 col=(mix(vec3(.030,.040,.066), vec3(.019,.026,.050), smoothstep(0.,.9,hp))+vec3(.016,.030,.036)*exp(-hp/.060))*glow;
    // the Milky Way: a river of star clouds about the galactic plane, not a beam: it wanders, swells and thins along its
    // length, is knotted with brighter clouds and split by dark rifts, and sinks into the haze near the land's horizon
    // (brightness only: its place in the sky is a function of dir alone)
    float b=dot(dir,uGal);
    vec3 ax=normalize(cross(uGal,vec3(.31,.72,.62))); vec3 ay=cross(uGal,ax);
    float la=atan(dot(dir,ay),dot(dir,ax)+1e-6);
    vec2 mp=vec2(la*4., b*9.);
    float f1=gtFbm(mp*1.7+3.), f2=gtFbm(mp*5.+11.);
    float f3=gtFbm(mp*vec2(2.6,9.)+23.);
    float wl=gtVn(vec2(la*2.3+1.7,.5)), wl2=gtVn(vec2(la*5.1+8.,3.5));
    float bw=b+.050*(wl-.5)+.040*(f1-.5);                                          // the band meanders
    float wid=.080+.085*wl2;                                                       // and is nowhere the same width
    float lane=(1.-smoothstep(0.,.040,abs(bw-.012-.05*(f1-.5))))*.95+(1.-smoothstep(0.,.026,abs(bw+.062-.07*(f2-.5))))*.6;
    float band=exp(-(bw*bw)/(wid*wid));
    float cloud=smoothstep(.25,.85,f2)*.9+.35;
    float knots=.30+1.15*smoothstep(.28,.78,gtFbm(vec2(la*3.1+5.,b*13.)+f1));      // star clouds and gaps along it
    float mw=band*(.32+.68*f1)*knots*(1.-.90*min(lane,1.)*(.35+.65*f3));
    float core=exp(-(bw*bw)/(.032*.032))*cloud*(1.-min(lane,1.)*.9)*(.35+1.0*wl);
    float ext=.30+.70*smoothstep(0.,.045,hp);                                      // it stands on the land's horizon: only the last two degrees thin in the haze
    col+=(vec3(.235,.335,.600)*(.40*mw*(.40+1.2*f2))+vec3(.62,.50,.44)*(.29*core*f1)+vec3(.19,.28,.54)*(.060*exp(-abs(bw)/.20)))*(mwG*ext);
    // dawn is a place: a band along the tilted horizon, strongest toward the sun's azimuth, from the sun's depth alone.
    // First a deep blue on the low rim (the sun some 20 degrees down, u 0.45), then rose (u 0.6), then peach and gold against the sea line.
    float tw=smoothstep(-.40,-.14,uSunAlt);
    float dawn=smoothstep(-.31,-.04,uSunAlt);
    vec3 sh=uSunDir-uLandUp*dot(uSunDir,uLandUp); sh/=max(length(sh),1e-3);
    vec3 dh=dir-uLandUp*h; dh/=max(length(dh),1e-3);
    float caz=dot(dh,sh);
    float azw=exp(-(1.-caz)/(.09+.27*tw));                                         // a place: a third of the compass at most
    float day=smoothstep(-.02,.06,uSunAlt);
    float d15=dawn*sqrt(dawn);
    // the blue belongs to the rim on the sun's side (no floor round the compass, a low scale height): the sky away from it stays night
    vec3 dawnB=vec3(.022,.072,.235)*(exp(-hp/(.060+.085*tw))*tw*(.03+.97*azw)*2.0);
    vec3 dawnC=vec3(.50,.135,.165)*(exp(-hp/(.040+.075*dawn))*d15*azw*.62)
      +vec3(1.45,.60,.19)*(azw*azw*exp(-hp/(.020+.058*dawn))*dawn*dawn*1.05)
      +vec3(.95,.50,.24)*(day*azw*azw*exp(-hp/.13)*.50)
      +vec3(.008,.022,.066)*(dawn*dawn*(.3+.7*day)*azw*exp(-hp/.45));
    dawnC*=glow/(1.+.85*max(dawnC.r,max(dawnC.g,dawnC.b)));                          // a soft knee that keeps the hue: the rim glows rose and gold, never white
    dawnB*=glow/(1.+2.5*max(dawnC.r,dawnC.g));                                      // and the blue gives way where the warm rim is, so the two do not sum to lavender
    col+=dawnC+dawnB;
    gtSmoothSky=col;
    float veil=dot(dawnC+.22*dawnB,vec3(.3,.5,.2))*7.;                              // only the rim's own glow puts stars out: never the fixed sky at large
    // stars: two hashed layers and fourteen real ones, each a gaussian never narrower than about 1.2 pixels, flux kept
    float sig=.52*uPx*w, fl=1./(w*w);
    float lowTw=exp(-hp/.2);
    col+=gtLayer(dir,64.,.0105*fl,2.6*fl,sig,lowTw,1.+.8*min(mw,1.2),veil);
    col+=gtLayer(dir,uCells2,.0030*fl,.62*fl,sig*.9,lowTw,1.+2.4*min(mw,1.2),veil);
    for(int i=0;i<14;i++){ vec3 dv=dir-uStar[i].xyz; float d2=dot(dv,dv); float s2=sig*1.45;
      float tw=1.+(.025+.2*lowTw)*sin(uTime*(3.1+.43*float(i))+float(i)*1.7);
      col+=uStarCol[i]*(uStar[i].w*fl*tw*clamp(1.-veil/uStar[i].w,0.,1.))*(.85*exp(-d2/(2.*s2*s2))+step(w,1.08)*(.055*exp(-sqrt(d2)/(uPx*2.4))+.010*exp(-sqrt(d2)/(uPx*7.)))); }
    { vec3 pv=dir-uStar[0].xyz; vec3 px=normalize(cross(uStar[0].xyz,vec3(0.,0.,1.))); vec3 py=cross(px,uStar[0].xyz);
      float ax=abs(dot(pv,px)), ay=abs(dot(pv,py)), l2=dot(pv,pv);
      float vis0=clamp(1.-veil/3.,0.,1.);
      col+=vec3(.75,.85,1.)*(fl*vis0*(1.1*(exp(-ax/.0016-ay/.030)+exp(-ay/.0016-ax/.030))+.35*exp(-sqrt(l2)/.012))); }
    // the rare morning star: steady, no twinkle
    { vec3 dv=dir-uVenus.xyz; float s2=sig*1.5; col+=vec3(1.,.8,.56)*(uVenus.w*fl*exp(-dot(dv,dv)/(2.*s2*s2))); }
    // the sun: a disc of 0.27 degrees that never moves, and a small coloured aureole
    { vec3 dv=dir-uSunDir; float th=sqrt(dot(dv,dv)); float ed=max(uPx*w,3e-4);
      col+=vec3(30.,22.,13.)*(1.-smoothstep(.0047-ed,.0047+ed,th))
          +vec3(1.,.62,.30)*(glow*(10.*exp(-th/.0115)+1.1*exp(-th/.036)+dawn*dawn*(.26*exp(-th/.10)+.030*exp(-th/.26)))); }
    return col;
  }
  vec3 sky(vec3 dir, float w, float glow){ return sky4(dir,w,glow,glow); }
`,B=`
  uniform vec3 uSunLocal, uGalLocal; uniform float uSunI, uDawn, uTw; uniform vec3 uBoxMin[9], uBoxMax[9];
  float gtShadow(vec3 p){
    vec3 L=uSunLocal; L=vec3(abs(L.x)<1e-4?1e-4:L.x, abs(L.y)<1e-4?1e-4:L.y, abs(L.z)<1e-4?1e-4:L.z);
    vec3 inv=1./L; float sh=0.;
    for(int i=0;i<9;i++){ vec3 a=(uBoxMin[i]-p)*inv, b=(uBoxMax[i]-p)*inv; vec3 lo=min(a,b), hi=max(a,b);
      float tn=max(max(lo.x,lo.y),lo.z), tf=min(min(hi.x,hi.y),hi.z);
      sh=max(sh, smoothstep(0.,.9,tf-max(tn,0.02))); }
    return 1.-sh;
  }
  // n and p in the land frame; lit = how much of the sun reaches this point besides the eight boxes (the turf's own shadows)
  vec3 gtLit2(vec3 alb, vec3 n, vec3 p, float graze, float lit){
    float up=.35+.65*(.5+.5*n.y);
    vec3 amb=mix(vec3(.012,.015,.021), vec3(.215,.26,.355)*(1.+.20*uTw), up);
    amb+=vec3(.35,.46,.70)*(.05*max(dot(n,uGalLocal),0.));
    // the glowing rim of the sky lights the land from its own side long before the sun: sky light, no lamp, no shadow
    vec3 dl=normalize(vec3(uSunLocal.x,.32,uSunLocal.z)+vec3(1e-4,0.,0.)); float dw=max(dot(n,dl)*.8+.2,0.);
    amb+=(vec3(.040,.095,.270)*(uTw*(1.-.6*uDawn))+vec3(.95,.36,.22)*(uDawn*uDawn))*((dw*dw+.34*min(graze,1.))*.66*(1.-.6*min(uSunI,1.)));
    float bsh=1.; if(uSunI>0.) bsh=gtShadow(p+n*.03);                                // nine boxes: not walked while there is no sun (the term below is multiplied by uSunI)
    vec3 sun=vec3(1.,.55,.28)*(uSunI*(max(dot(n,uSunLocal),0.)+graze)*bsh*lit);
    return alb*(amb+sun);
  }
  vec3 gtLit(vec3 alb, vec3 n, vec3 p, float graze){ return gtLit2(alb,n,p,graze,1.); }
`,ke=`
  float gH(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
  float gN(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(gH(i),gH(i+vec2(1.,0.)),f.x), mix(gH(i+vec2(0.,1.)),gH(i+vec2(1.,1.)),f.x), f.y); }
  float gtOnTurf(vec2 p){ return smoothstep(1.0,1.55,abs(p.x))+step(4.,p.y); }                 // 0 on the track, 1 on the grass
  // the low relief, 0..1: rows the west wind has combed (long east-west) and tussocks about a metre across
  float gtRelS(vec2 p){ return (.52*gN(vec2(p.x*.17,p.y*.78)+5.)+.48*gN(p*1.05+17.))*min(gtOnTurf(p),1.); }
  float gtRel(vec2 p, float k1, float k2){ return gtRelS(p)*k1+.20*gN(p*3.3+3.)*k2*min(gtOnTurf(p),1.); }
  float gtBig(vec2 p){ return gN(p*.045+3.)*.6+gN(p*.13+7.)*.4; }                              // drifts of paler bent and darker turf
  vec3 gtTurfCol(float big, float h){ return mix(vec3(.056,.078,.058), vec3(.122,.148,.086), clamp(big*.7+.35*h,0.,1.))*(.50+.85*h); }
  float gtGust(vec2 p, float t){ float gx=p.x*.050-t*.42+1.7*gN(p*.02), gz=p.y*.09+t*.03;
    return smoothstep(.50,.92,gN(vec2(gx,gz)))+.5*smoothstep(.55,.95,gN(vec2(gx*2.3+9.,gz*2.1))); }   // the west wind crossing the grass
`;function _e(o=30){const s=o*u,c=23.44*u,n=-(.26+.27)*u,h=new e.Vector3(0,Math.sin(s),-Math.cos(s)),m=-Math.acos((Math.sin(n)-Math.sin(s)*Math.sin(c))/(Math.cos(s)*Math.cos(c)))-ee(.895)*u,d=90*u+m,a=te(m,c,s),k=te(d-12.857*15*u,27.13*u,s),y=Oe.map(([N,O,L,_])=>({dir:te(d-N*15*u,O*u,s),peak:L,tint:new e.Color(_)})),f=a.clone().applyAxisAngle(h,-12*u);return{latDeg:o,k:h,sun:a,gal:k,stars:y,venus:f,lst:d}}const Je=(o,s)=>{const c=Math.max(0,s-26),n=c<14?c*c/28:c-7,h=Math.max(0,o-10),v=h<14?h*h/28:h-7;return-(.115*n+.1*v)},Pe="float gtGY(vec2 xz){ float t=max(0.,-xz.y-26.); float a=t<14.?t*t/28.:t-7.; float e=max(0.,xz.x-10.); float b=e<14.?e*e/28.:e-7.; return -(.115*a+.10*b); }",T=new e.Quaternion,We=new e.Matrix4,$e=new e.Matrix4,je=new e.Vector3,Le=new e.Vector2,V=new e.Vector3,A=new e.Vector3,F=(o,s,c)=>{const n=Math.min(1,Math.max(0,(c-o)/(s-o)));return n*n*(3-2*n)};async function Ke(o,s={}){const c=s.detail??1,n=_e(s.lat??30),h=s.path,v=s.lamps||[],m=12,d=t=>new e.Color(t),a={uLandUp:{value:new e.Vector3(0,1,0)},uSunDir:{value:n.sun.clone()},uGal:{value:n.gal.clone()},uSunAlt:{value:-.5},uPx:{value:.003},uTime:{value:0},uCells2:{value:Math.round(110+50*Math.min(1,Math.max(0,(c-.6)/.4)))},uStar:{value:n.stars.map(t=>new e.Vector4(t.dir.x,t.dir.y,t.dir.z,t.peak))},uStarCol:{value:n.stars.map(t=>new e.Vector3(t.tint.r,t.tint.g,t.tint.b))},uVenus:{value:new e.Vector4(n.venus.x,n.venus.y,n.venus.z,s.rare?8:0)},uTurn:{value:0},uWindow:{value:1},uCard:{value:1},uRes:{value:new e.Vector2(800,450)},uLampOut:{value:new Array(m).fill(9)},uP:{value:new e.Vector3},uK:{value:n.k.clone()},uSunLocal:{value:n.sun.clone()},uGalLocal:{value:new e.Vector3(.6,.5,-.6).normalize()},uSunI:{value:0},uDawn:{value:0},uTw:{value:0},uBoxMin:{value:[0,1,2,3,4,5,6,7,8].map(()=>new e.Vector3(0,-50,0))},uBoxMax:{value:[0,1,2,3,4,5,6,7,8].map(()=>new e.Vector3(0,-49,0))},uCalm:{value:s.calm?1:0},uG:{value:new e.Vector3(0,6,0)},uCis:{value:new e.Vector3(5,-44,2.65)},uNeedle:{value:new e.Vector3(0,-900,0)}},k=[];for(let t=0;t<m;t++)k.push(t<v.length?ee(s.lampOutU?.[t]??2)*u:0);a.uLampOut.value=k;const y=new e.Group;y.name="sky-frame";const f=new e.Group;f.name="land-frame",f.matrixAutoUpdate=!1;const N="float gtDither(){ return (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233)))*43758.5453)-.5)*.0012; }",O=new e.ShaderMaterial({uniforms:a,depthWrite:!1,side:e.BackSide,vertexShader:`varying vec3 vDir;
      void main(){ vDir=position; vec4 p=projectionMatrix*viewMatrix*vec4(position+cameraPosition,1.); if(abs(p.w)<1e-4) p.w=1e-4; gl_Position=p.xyww; }`,fragmentShader:`precision highp float; varying vec3 vDir; ${H} ${N}
      void main(){ vec3 d=normalize(vDir); vec3 c=sky(d,1.,1.);
        c=mix(vec3(.020,.029,.024), c, smoothstep(-.03,-.006,dot(d,uLandUp)));       // under the sea rim: nothing
        gl_FragColor=vec4(max(c+gtDither(),0.),1.); }`}),L=new e.Mesh(new e.IcosahedronGeometry(1,3),O);L.frustumCulled=!1,L.renderOrder=2,L.name="dome",y.add(L),await o.yield();const _=h.pointAt(1,new e.Vector3),ae=h.tangentAt(1,new e.Vector3),ze=new e.ShaderMaterial({uniforms:a,transparent:!0,depthWrite:!1,side:e.DoubleSide,vertexShader:"varying vec3 vW; varying vec2 vUv; void main(){ vUv=uv; vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }",fragmentShader:`precision highp float; varying vec3 vW; varying vec2 vUv; uniform float uCard; ${H} ${N}
      void main(){ vec3 dv=vW-cameraPosition; vec3 d=dv/max(length(dv),1e-3);
        float r=length(vUv-.5)*2.; float k=1.-uCard; float o=mix(1.2,.62,clamp(k/.35,0.,1.));   // the sky opens on the hoop first (the rim inward, in the first third), then gives way evenly inside it
        gl_FragColor=vec4(max(sky(d,1.,1.)+gtDither(),0.), (1.-smoothstep(o-.15,o,r))*(1.-smoothstep(.35,1.,k))*step(1e-4,uCard)); }`}),b=new e.Mesh(new e.CircleGeometry(8.6,48),ze);b.position.copy(_).addScaledVector(ae,-1.5),b.lookAt(je.copy(b.position).sub(ae)),b.renderOrder=9,b.frustumCulled=!1,b.name="card",y.add(b);const C=s.seaY??-58,R=[0,40,110,260,600,1300,2800,6e3,14300],g=128,oe=[],se=[];for(let t=0;t<R.length;t++)for(let i=0;i<g;i++){const r=i/g*Math.PI*2;oe.push(Math.sin(r)*R[t],C,-Math.cos(r)*R[t])}for(let t=0;t<R.length-1;t++)for(let i=0;i<g;i++){const r=t*g+i,l=t*g+(i+1)%g,p=r+g,x=l+g;se.push(r,l,p,l,x,p)}const P=new e.BufferGeometry;P.setAttribute("position",new e.Float32BufferAttribute(oe,3)),P.setIndex(se);const ne="uniform vec3 uK; uniform float uTurn; vec3 gtRotN(vec3 v){ float c=cos(uTurn), s=sin(uTurn); return v*c+cross(uK,v)*s+uK*(dot(uK,v)*(1.-c)); }",ie="varying vec3 vL, vW; void main(){ vL=position; vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }",Me=(s.seaRocks||[]).map(([t,i,r])=>`{ float d=length(p-vec2(${t.toFixed(1)},${i.toFixed(1)}))-${(r*.93).toFixed(1)}; float nz=gtVn(p*.09+vec2(uTime*.10,-uTime*.06)+${(t*.01).toFixed(2)});
          float br=.5+.5*sin(d*.42-uTime*.9+7.*nz); foam=max(foam,(1.-smoothstep(1.,${(r*.55+4).toFixed(1)}+10.*nz,d))*(.35+.65*br*br)*smoothstep(-4.,1.,d)); }`).join(`
        `),Te=new e.ShaderMaterial({uniforms:a,vertexShader:ie,side:e.DoubleSide,fragmentShader:`precision highp float; varying vec3 vL, vW; uniform float uCalm, uSunI; uniform vec3 uG; ${H} ${N} ${ne}
      vec2 wave(vec2 p, vec2 dir, float len, float amp, float per){ float k=6.2832/len; float ph=dot(p,dir)*k-uTime*6.2832/per; return dir*(amp*k*cos(ph)); }
      void main(){
        vec3 dv=vW-cameraPosition; float dist=length(dv); vec3 V=dv/max(dist,1e-3);
        vec2 p=vL.xz;
        float fp=64./(dist*dist*max(uPx,1e-5));                                   // screen size of one metre of water along the line of sight, in pixels
        float swell=smoothstep(1.5,4.,90.*fp), c1=smoothstep(1.2,3.5,18.*fp), c2=smoothstep(1.2,3.5,6.*fp), c3=smoothstep(1.2,3.5,2.2*fp);
        vec2 g=wave(p+40.*gtVn(p*.006),vec2(.82,.57),90.,.4,9.)*swell*(1.-.85*uCalm);  // the long swell from the north-west, its crests a little bent
        // the chop is noise, never a sine: a slope along the line of sight throws a star's image far up or down the water and a
        // slope across it hardly at all, so each star falls as a thin broken thread
        vec2 q1=p*.055+vec2(uTime*.045,uTime*.02), q2=p*.17-vec2(uTime*.07,-uTime*.05), q3=p*.46+vec2(uTime*.11,uTime*.16);
        float a1=gtVn(q1), a2=gtVn(q2), a3=gtVn(q3);
        vec2 ch=vec2(gtVn(q1+vec2(.25,0.))-a1, gtVn(q1+vec2(0.,.25))-a1)*(.22*c1)
               +vec2(gtVn(q2+vec2(.25,0.))-a2, gtVn(q2+vec2(0.,.25))-a2)*(.16*c2)
               +vec2(gtVn(q3+vec2(.25,0.))-a3, gtVn(q3+vec2(0.,.25))-a3)*(.11*c3);
        g+=ch*(1.-.93*uCalm);
        // far water, where a pixel holds many waves: the crests face the lens, so a star's image is thrown up and down its own
        // column and falls as a thin, broken, shimmering thread (a point again in a calm)
        vec2 hv=vL.xz-uG.xz; float hd=max(length(hv),1.); hv/=hd;
        float az=atan(hv.x,-hv.y+1e-6), al=atan(64.,hd);
        float th=(gtVn(vec2(az*70.,al*135.-uTime*.8))-.5)*2.+(gtVn(vec2(az*150.+9.,al*290.+uTime*1.3))-.5);
        g+=hv*(th*.013*smoothstep(120.,450.,hd)*(1.-.92*uCalm));
        vec3 n=normalize(vec3(-g.x,1.,-g.y));
        vec3 N=normalize(gtRotN(n));
        vec3 R=reflect(V,N); float rh=dot(R,uLandUp); if(rh<.004) R=normalize(R+uLandUp*(.004-rh)*1.02+uLandUp*1e-4);
        float c=max(dot(-V,N),0.); float F=.02+.98*pow(1.-c,5.);
        float Fm=mix(F,1.,.42);                                                          // the mirror the stars and the Milky Way get: a little kinder than Fresnel
        float w=mix(1.12, 3.0, smoothstep(140.,1100.,dist));                             // points near; far water keeps the average glitter
        vec3 sr=sky4(R,w,.46,1.0);
        // glints: facets of the chop catching the brightest sky (the Milky Way, the dawn rim, the sun's road), near water only
        float sp=gtVn(p*.9+vec2(uTime*.9,uTime*.35))*gtVn(p*1.7-vec2(uTime*.6,uTime*1.1)); sp=smoothstep(.42,.75,sp);
        float lum=dot(sr,vec3(.3,.5,.2));
        vec3 col=vec3(.011,.017,.021)+sr*(F*.95)+max(sr-vec3(.045),0.)*((Fm-F)*1.1)            // what is brighter than the airglow (stars, the Milky Way, the dawn) gets the kinder mirror
          +sr*(sp*4.*smoothstep(.02,.12,lum)*(1.-smoothstep(250.,900.,dist))*(1.-.8*uCalm)*F);
        // the swell comes in sets: long pale backs a quarter of a kilometre apart that catch the sky, so the water is water and
        // not a dark slab; they melt into their mean where a pixel holds more than one
        float dawnS=smoothstep(-.244,-.006,uSunAlt);
        float setPh=dot(p,vec2(.82,.57))/250.+1.5*gtVn(p*.0019+3.)+.5*gtVn(p*.0061+9.)-uTime*.012;
        float sets=.5+.5*sin(6.2832*setPh); sets=sets*sets*(.35+.65*gtVn(p*vec2(.004,.0023)+17.));
        float seeSets=smoothstep(1.2,4.,250.*fp)*(1.-.7*uCalm);
        col+=(vec3(.0050,.0085,.0145)+vec3(.014,.020,.046)*dawnS*dawnS)*((mix(.45,sets,seeSets)-.2)*1.5);
        float foam=0.;
        ${Me}
        col=mix(col, vec3(.060,.076,.105)*(1.+1.2*dawnS*dawnS)+vec3(1.,.60,.34)*(uSunI*.16), min(foam,1.)*.92);
        gl_FragColor=vec4(max(col+gtDither(),0.),1.); }`}),W=new e.Mesh(P,Te);W.frustumCulled=!1,W.name="sea",f.add(W),await o.yield();const w=s.cistern||{x:5,z:-44,r:2.65,y:.84};a.uCis.value.set(w.x,w.z,w.r);const re=new e.ShaderMaterial({uniforms:a,vertexShader:ie,fragmentShader:`precision highp float; varying vec3 vL, vW; uniform float uDawn; ${H} ${ne}
      void main(){
        vec3 dv=vW-cameraPosition; vec3 V=dv/max(length(dv),1e-3);
        vec2 p=vL.xz;
        vec3 n=normalize(vec3(.0007*sin(p.x*2.6+uTime*1.3)+.0004*sin(p.y*4.1-uTime*1.1), 1., .0007*sin(p.y*2.9-uTime*1.2+p.x*1.3)));   // so gentle a breath that a star stays a point
        vec3 N=normalize(gtRotN(n));
        vec3 R=reflect(V,N); float rh=dot(R,uLandUp); if(rh<.004) R=normalize(R+uLandUp*(.004-rh)*1.02+uLandUp*1e-4);
        float c=max(dot(-V,N),0.); float f1=1.-c; float F=.42+.58*f1*f1*f1;
        float rr=length(p)/2.62; float rim=1.-.6*smoothstep(.80,1.,rr);                 // the wall's own dark reflection round the edge
        vec3 sk=sky4(R,1.05,.4,.4); vec3 sm=gtSmoothSky; vec3 pts=max(sk-sm,0.);              // the stars alone, apart from the sky they lie in
        sm*=2.5; float sl=dot(sm,vec3(.3,.5,.2)); sm=mix(sm, vec3(.42,.72,1.75)*sl, .75*uDawn)*(1.-.45*uDawn*uDawn);   // deep water: by dawn it keeps the blue overhead, not the rose of the rim
        pts*=7./(1.+2.6*max(pts.r,max(pts.g,pts.b)));                                          // lifted, but no single point hot enough to make the bloom show its squares
        gl_FragColor=vec4(vec3(.003,.004,.007)+(sm*.80+pts)*(F*rim),1.); }`}),$=new e.Mesh(new e.CircleGeometry(w.r,40).rotateX(-Math.PI/2),re);$.position.set(w.x,w.y,w.z),$.name="cistern-water",f.add($);const j=`uniform vec3 uK, uP; uniform float uTurn; uniform float uLampOut[12]; uniform vec2 uRes;
    vec3 gtRot(vec3 v, float t){ float c=cos(t), s=sin(t); return v*c+cross(uK,v)*s+uK*(dot(uK,v)*(1.-c)); }`,D=Math.round(64+32*Math.min(1,Math.max(0,(c-.6)/.4))),le=[],ce=[],ve=[],he=[],ue=[];for(let t=0;t<v.length;t++)for(let i=0;i<=D;i++)for(const r of[-1,1])if(le.push(v[t].x,v[t].y,v[t].z),ce.push(i/D),ve.push(r),he.push(t),i<D&&r===-1){const l=(t*(D+1)+i)*2;ue.push(l,l+1,l+2,l+1,l+3,l+2)}const z=new e.BufferGeometry;z.setAttribute("position",new e.Float32BufferAttribute(le,3)),z.setAttribute("aS",new e.Float32BufferAttribute(ce,1)),z.setAttribute("aSide",new e.Float32BufferAttribute(ve,1)),z.setAttribute("aIdx",new e.Float32BufferAttribute(he,1)),z.setIndex(ue);const Fe=(Z*u).toFixed(6),Ne=new e.ShaderMaterial({uniforms:a,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.DoubleSide,vertexShader:`attribute float aS, aSide, aIdx; varying float vSide, vS, vLen, vHw, vId; ${j}
      vec4 at(float t){ float v=.16+.84*t/${Fe}; vec3 w=uP+.5*gtRot(position-vec3(0.,6.,-${be.toFixed(1)}*(1.-pow(max(1.-v,1e-4),${Se.toFixed(2)}))), t); return projectionMatrix*viewMatrix*vec4(w,1.); }
      void main(){
        float tEnd=min(uTurn, uLampOut[int(aIdx+.5)]);
        float t=aS*tEnd;
        vec4 a=at(t), b=at(t+.004);
        vec2 pa=a.xy/max(a.w,1e-3), pb=b.xy/max(b.w,1e-3);
        vec2 d=(pb-pa)*uRes; float dl=length(d); d= dl>1e-5 ? d/dl : vec2(1.,0.);
        float hw=max(4., uRes.y/95.);                                 // half-width in pixels of the quad: a crisp core and a faint skirt
        a.xy+=vec2(-d.y,d.x)*aSide*hw*2./uRes*a.w;
        vSide=aSide; vS=aS; vLen=tEnd; vHw=hw; vId=aIdx; gl_Position=a; }`,fragmentShader:`precision highp float; varying float vSide, vS, vLen, vHw, vId; uniform vec2 uRes;
      void main(){ float sc=max(uRes.y/450.,.6), px=abs(vSide)*vHw/sc;                // pixels from the line's centre, at 450 lines
        float core=exp(-px*px/(2.*.74*.74)), skirt=exp(-px/1.5)*(1.-smoothstep(.7,1.,abs(vSide)));
        float on=smoothstep(0.,.012,vLen);
        float age=.55+.45*vS*vS;                                       // brightest at the lamp; the oldest end still half as bright
        float each=.72+.28*sin(vId*2.4+.6);                            // no two lamps the same strength: the trails part from one another
        vec3 amber=mix(vec3(1.,.36,.085), vec3(1.,.52,.20), vS*.6+.4*(.5+.5*sin(vId*1.7)));
        gl_FragColor=vec4(amber*((1.65*core+.045*skirt)*on*age*each),1.); }`}),E=new e.Mesh(z,Ne);E.frustumCulled=!1,E.renderOrder=6,E.name="arcs",y.add(E);const de=[],fe=[];for(let t=0;t<v.length;t++)de.push(v[t].x,v[t].y,v[t].z),fe.push(t);const K=new e.BufferGeometry;K.setAttribute("position",new e.Float32BufferAttribute(de,3)),K.setAttribute("aIdx",new e.Float32BufferAttribute(fe,1));const Ce=new e.ShaderMaterial({uniforms:a,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,vertexShader:`attribute float aIdx; varying float vOn; ${j} uniform float uTime; uniform vec3 uG;
      void main(){ float o=uLampOut[int(aIdx+.5)]; vOn=(1.-smoothstep(o-.013,o,uTurn))*(.9+.1*sin(uTime*(2.+aIdx*.37)+aIdx*2.));
        vec3 pl=uG+.5*(position-uG);                                 // half-way to the lens: the same pixel, clear of the headland's depth
        gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(pl,1.); gl_PointSize=clamp(uRes.y/58.,6.,24.); }`,fragmentShader:`precision highp float; varying float vOn;
      void main(){ vec2 q=gl_PointCoord*2.-1.; float r2=dot(q,q); float g=exp(-r2*14.)+.16*exp(-r2*3.2)*(1.-smoothstep(.6,1.,r2));
        gl_FragColor=vec4(vec3(1.,.585,.255)*(6.*g*vOn),1.); }`}),G=new e.Points(K,Ce);G.frustumCulled=!1,G.renderOrder=7,G.name="lamps",f.add(G),await o.yield();const Y=[],me=[],pe=[],ge=[],we=6-C;for(let t=0;t<v.length;t++){const i=v[t],r=i.x,l=i.z+18,p=Math.hypot(r,l),x=r/p,S=l/p,U=we/(we+(i.y-C)),Ue=.5*U,He=Math.min(.975,1.9*U),ye=7,M=Y.length/3;for(const[X,Qe]of[[Ue,0],[He,1]])for(const J of[-1,1])Y.push(x*p*X-S*ye*J,C+2.5,-18+S*p*X+x*ye*J),me.push(J,(X-U)/U),pe.push(t);ge.push(M,M+1,M+2,M+1,M+3,M+2)}const q=new e.BufferGeometry;q.setAttribute("position",new e.Float32BufferAttribute(Y,3)),q.setAttribute("aUv",new e.Float32BufferAttribute(me,2)),q.setAttribute("aIdx",new e.Float32BufferAttribute(pe,1)),q.setIndex(ge);const qe=new e.ShaderMaterial({uniforms:a,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.DoubleSide,vertexShader:`attribute vec2 aUv; attribute float aIdx; varying vec2 vUv; varying float vOn, vId; ${j}
      void main(){ float o=uLampOut[int(aIdx+.5)]; vOn=1.-smoothstep(o-.013,o,uTurn); vUv=aUv; vId=aIdx;
        gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.); }`,fragmentShader:`precision highp float; varying vec2 vUv; varying float vOn, vId; uniform float uTime, uCalm;
      void main(){ float along=exp(-vUv.y*vUv.y*mix(5.,60.,uCalm));
        float sh=.5+.5*sin(vUv.y*46.+uTime*2.3+vId*3.1+3.*sin(vUv.y*13.-uTime*.9+vId));
        float wob=sin(vUv.y*31.-uTime*1.7+vId*5.)*.16*(1.-uCalm);
        float across=exp(-(vUv.x-wob)*(vUv.x-wob)*5.);
        gl_FragColor=vec4(vec3(1.,.585,.255)*(1.5*along*across*mix(.25+.75*sh*sh,1.,uCalm)*vOn),1.); }`}),I=new e.Mesh(q,qe);I.frustumCulled=!1,I.renderOrder=5,I.name="streaks",f.add(I);const Ve=`attribute vec3 color; attribute vec2 aMat; varying vec3 vL, vN, vC; varying float vM; uniform float uTime;
    void main(){ vec3 p=position; float sw=aMat.y;
      p.x+=sw*(.10+.07*sin(uTime*1.9+p.y*1.3+p.z*.8)+.04*sin(uTime*4.7+p.x*5.+p.y*3.));          // the west wind in the twigs
      p.z+=sw*.05*sin(uTime*2.6+p.x*2.1+p.y*1.7); p.y+=sw*.03*sin(uTime*3.3+p.x*3.);
      vL=p; vN=normal; vC=color; vM=aMat.x; gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(p,1.); }`,Ae=new e.ShaderMaterial({uniforms:a,vertexShader:Ve,side:e.DoubleSide,fragmentShader:`precision highp float; varying vec3 vL, vN, vC; varying float vM; ${B}
      uniform vec3 uNeedle;                                                            // THE NEEDLE's place (east, the terrace top's height, z of the axis), read by code 9 and by the damp ring's line alone
      float sH(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
      float sN(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(sH(i),sH(i+vec2(1.,0.)),f.x), mix(sH(i+vec2(0.,1.)),sH(i+vec2(1.,1.)),f.x), f.y); }
      // coursed stones of uneven length: returns (tone of this stone, darkness of the joint)
      vec2 stones(vec2 uv, float ch, float len, float joint){
        float row=floor(uv.y/ch); float x=uv.x/len+sH(vec2(row,7.3))*7.; float i=floor(x); float w=.35+.65*sH(vec2(i,row));
        float fx=fract(x); float c= fx<w ? i : i+.5; float lx= fx<w ? fx/w : (fx-w)/max(1.-w,1e-3); float wl= fx<w ? w : 1.-w;
        float fy=fract(uv.y/ch);
        float ex=min(lx,1.-lx)*wl*len, eyy=min(fy,1.-fy)*ch;
        float j=1.-smoothstep(0.,joint,min(ex,eyy));
        return vec2(sH(vec2(c*3.1,row*1.7)), j); }
      const float gtWallFoot=-.3;
      void main(){ vec3 n=normalize(vN+vec3(1e-5)); if(!gl_FrontFacing) n=-n;
        float horiz=1.-smoothstep(.5,.8,abs(n.y));
        vec2 uv=mix(vL.xz, vec2(abs(n.x)>abs(n.z)?vL.z:vL.x, vL.y), horiz);              // wall faces: along the wall and up; tops: plan
        vec3 alb=vC; float m=vM;
        float fw=fwidth(uv.x)+fwidth(uv.y);                                           // metres under one pixel: patterns finer than this melt into their mean
        vec2 u9=vec2((n.x*n.z>0.?vL.x-vL.z:vL.x+vL.z)*.7071, vL.y); float fw9=fwidth(u9.x)+fwidth(u9.y);   // THE NEEDLE's own face coordinate (read by code 9 alone): its faces stand at 45 degrees, where the choice above is a tie; metres along the face (east plus north, or east minus north) and up it
        if(m<.5){ float mo=sN(uv*1.3)*.5+sN(uv*4.7)*.3+sN(uv*17.)*.2;                    // whitewash: lime, a little uneven, damp at the foot
          alb*=.86+.20*mo; alb*=mix(vec3(.80,.85,.82),vec3(1.),smoothstep(-2.9,-2.2,vL.y-.25*sN(vec2(uv.x*1.5,2.))));
          alb=mix(vec3(.085,.09,.10)*(.8+.4*mo), alb, smoothstep(-2.93,-2.89,vL.y));                 // the tarred plinth
          alb*=1.-.10*smoothstep(.55,.8,sN(vec2(uv.x*6.,uv.y*.35+3.)))*horiz; }
        else if(m<1.5){ vec2 st=stones(uv+.03*sN(uv*9.), .17, .42, .022);                  // drystone: small coursed stones, deep joints, lichen
          float q=1.-smoothstep(.10,.34,fw); alb*=mix(.80+.34*sN(uv*1.6), (.60+.62*st.x)*(1.-.80*st.y), q);
          vec2 s2=stones(uv+.05*sN(uv*3.), .40, 1.15, .07); float q2=(1.-q)*(1.-smoothstep(.45,1.4,fw));        // from far off: the big through-stones and the courses, never a flat band
          float fwy=fwidth(uv.y), qc=(1.-smoothstep(.035,.10,fwy))*(1.-q)*horiz; float rw=floor(uv.y/.17), cf=fract(uv.y/.17);   // seen along its length: the courses still part, each its own tone
          alb*=mix(1., (.70+.55*sH(vec2(rw,3.7)+floor(uv.x/2.3)*.37))*(1.-.6*(1.-smoothstep(0.,.16,min(cf,1.-cf)))), qc);
          alb*=mix(1., (.66+.62*s2.x)*(1.-.55*s2.y), q2)*(.78+.30*smoothstep(-.2,1.1,vL.y-gtWallFoot)); alb=mix(alb, vec3(.60,.61,.50), .5*smoothstep(.62,.82,sN(uv*2.3+11.))*(1.-st.y*q)); }
        else if(m<2.5){ vec2 su=vec2(vL.x, vL.z*2.2); vec2 st=stones(su, .26, .34, .012); float q=1.-smoothstep(.03,.12,fw), q2=1.-smoothstep(.10,.30,fw);
          float cr=fract(su.y/.26); alb*=mix(1., (.84+.30*st.x)*(1.-.6*st.y), q)*mix(1., .74+.44*cr, q2)*(.9+.2*sN(su*.8)); }   // slates in courses
        else if(m<3.5){ alb*=.8+.4*sN(vL.xy*6.); }
        else if(m<4.5){ float f=sN(vL.xy*.02)*.6+sN(vL.xy*.07)*.4; alb*=.65+.7*f; }       // the far headland: fields and heath, barely told apart
        else if(m>8.5){ vec3 q=vL-uNeedle; float h=q.y, fid=(n.x>0.?1.:0.)+(n.z>0.?2.:0.), wash=step(3.,h);                // THE NEEDLE: old limewash over ashlar, on flat faces. h: metres above the terrace's top; fid: which of the four faces; wash: 1 above the 3 m of bare stone
          float a9=h<22.?3.-.6*max(h,0.)/22.:2.4*max(29.-h,0.)/7., s=(n.x*n.z>0.?q.x-q.z:q.x+q.z)*.7071, dA=max(a9*.7071-abs(s),0.);   // the half-diagonal at this height (3.0 m at the terrace, 2.4 at the shoulder, 0 at the point); metres along the face from its middle; metres to the nearer arris
          float mo=sN(u9*vec2(.9,2.1)+17.)*.6+sN(u9*vec2(3.1,7.))*.4, gr=mix(1., .86+.28*mo, 1.-smoothstep(.25,.90,fw9));          // the stone's own grain melts with distance (the first freeze's law, as it was)
          float crs=floor((h-3.)/1.2), bi=floor(s*.5+.5*mod(crs,2.)); gr*=mix(1., .90+.16*sH(vec2(bi*3.1+fid*17.,crs*1.7+5.)), wash);   // BUILT OF BLOCKS: courses 1.2 m tall counted from the wash line, blocks 2.0 m long, alternate courses breaking joint by half a block; each block its own tone, 0.90 to 1.06; no joint line
          float pat=smoothstep(.42,.72,sN((vec2(s,h)+fid*vec2(37.,11.))*.38+3.)), arr=(1.-smoothstep(0.,.5,dA))*(.55+.45*sN(vec2(h*.9,fid*7.+1.)));   // THE WASH IS WORN: patches 2.5 to 4 m across (a noise of 2.6 m cells), and the half metre next to each arris, unevenly
          float c=floor(s/1.2), r1=sH(vec2(c,fid+2.)), r2=sH(vec2(c+13.,fid+5.)), r3=sH(vec2(c+29.,fid+9.)), sw=.4+.4*r1;                  // rain streaks from under the shoulder: one in each 1.2 m of face, 0.4 to 0.8 m wide,
          float str=(1.-smoothstep(sw*.5-.1,sw*.5,abs(s-(c+.5)*1.2-(r3-.5)*(1.2-sw))))*(1.-smoothstep(0.,3.+3.*r2,22.-h))*step(h,22.);    // 3 to 6 m long, strongest at the shoulder (22 m) and dying downward
          alb=mix(alb, vec3(.50,.49,.46), max(pat,max(arr,str))*(n.x<0.?.55:.3)*wash)*gr;                                        // the wall's stone W shows through: up to 0.55 of the way on the two weather faces (west), 0.3 on the others
          float run=sN(vec2(u9.x*1.4,u9.y*.09)+71.); alb*=1.-.20*smoothstep(.45,.85,run)*(.4+.6*sN(u9*.3+9.))*horiz;          // rain runs down the faces from the point
          alb*=mix(.8,1.,clamp(h/.8,0.,1.));                                                                                // THE FOOT IS DAMP: the lowest 0.8 m darkens evenly to 0.8 at the step
          alb*=mix(vec3(.64,.71,.66), vec3(1.), smoothstep(-.9,-.1,n.x)); }                                                 // the weather faces (west) are damp and a little green; the others clean
        else if(m>7.5){ float bed=sN(vec2((vL.x+vL.z)*.06, vL.y*.55)), bl=sN(vec2((vL.x-vL.z)*.11, vL.y*.16)+31.);       // the stack: bedded, weathered in blocks,
          alb*=(.55+.5*bed+.35*bl)*(.75+.5*smoothstep(-58.,-20.,vL.y));                                                    // dark and wet at the foot,
          alb=mix(alb, vec3(.42,.41,.37), .65*smoothstep(.45,.8,n.y)*smoothstep(.35,.6,sN(vL.xz*.4+vL.y*.3)));            // its ledges paler
          alb=mix(alb, vec3(.030,.034,.036), 1.-smoothstep(-57.5,-53.,vL.y+2.*sN(vL.xz*.2))); }
        else if(m>6.5){ float bed=sN(vec2((vL.x+vL.z)*.5, vL.y*9.)); alb*=(.60+.34*sN(vL.xz*2.1+vL.y)+.22*bed);        // bare limestone: bedded, lichened
          alb=mix(alb, vec3(.52,.50,.36), .45*smoothstep(.60,.80,sN(vL.xz*3.7+vL.y*2.+19.))); }
        else if(m<5.5){ vec2 st=stones(uv, .30, .62, .014); alb*=(.82+.30*st.x)*(1.-.55*st.y)*(.9+.2*sN(uv*11.)); }   // dressed stone
        if(m>.5&&m<1.5){ vec3 q=vL-uNeedle; alb*=1.-.15*(1.-smoothstep(0.,.5,(abs(q.x)+abs(q.z)-3.)*.7071))*step(abs(q.y),.05)*step(.8,n.y); }   // THE NEEDLE's damp ring on the upper step's top: 0.85 at the shaft's foot, 1 at 0.5 m from it; exactly 1 everywhere else (and everywhere when uNeedle is parked)
        gl_FragColor=vec4(gtLit(alb,n,vL,0.),1.); }`}),Re=new e.ShaderMaterial({uniforms:a,side:e.DoubleSide,vertexShader:`attribute float aK; varying vec3 vL, vW; varying float vK;
      void main(){ vL=position; vK=aK; vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`,fragmentShader:`precision highp float; varying vec3 vL, vW; varying float vK; uniform float uTime, uPx; ${B} ${ke}
      void main(){ vec2 p=vL.xz; float dist=length(vW-cameraPosition), far=smoothstep(30.,150.,dist);
        float fp=dist*dist*max(uPx,1e-5)/6.;                                            // metres of turf under one pixel along the line of sight
        float k1=1.-smoothstep(.45,2.0,fp), k2=1.-smoothstep(.14,.60,fp), k3=1.-smoothstep(.04,.20,fp);
        // the track: two worn ruts, a crown where grass has come back, grit and stones; its edges are ragged with turf
        float wob=.16*(gN(vec2(p.y*.55,3.))-.5)+.07*(gN(vec2(p.y*2.7,9.))-.5);
        float ax=abs(p.x+wob*.6), edge=1.2+wob+.30*(gN(p*vec2(1.3,2.6)+40.)-.5)*k2;
        float tr=(1.-smoothstep(edge-.12,edge+.08,ax))*step(p.y,4.);
        // the relief and its slope
        float h0=gtRel(p,k1,k2), hx=gtRel(p+vec2(.16,0.),k1,k2), hz=gtRel(p+vec2(0.,.16),k1,k2);
        vec2 gr=vec2(hx-h0,hz-h0)*(.50/.16);                                            // half a metre of relief
        float big=gtBig(p), h=mix(.5,h0/.9,k1);
        float fine=gN(p*vec2(5.2,3.1))*.6+gN(p*11.)*.4;
        vec3 grass=gtTurfCol(big,h)*(1.+.42*(fine-.5)*k3);
        float gust=gtGust(p,uTime);
        grass+=vec3(.062,.088,.104)*(gust*(.35+1.1*h)*(1.-.5*far));
        float rut=exp(-(ax-.68)*(ax-.68)/.030);
        float crown=(1.-smoothstep(.16,.40,ax+.30*(gN(vec2(p.x*3.,p.y*.9))-.5)*k2))*smoothstep(.06,.30,gN(vec2(1.3,p.y*.31)));
        float peb=mix(.45, gN(p*7.)*.45+gN(p*19.)*.35+.2*step(.5,gH(floor(p*23.))), k3);
        vec2 sc=floor(p*4.), sf=fract(p*4.)-.5; float hs=gH(sc+3.);
        vec2 so=sf-(vec2(gH(sc),gH(sc+9.))-.5)*.5;
        float stone=(1.-smoothstep(.09+.10*hs,.15+.10*hs,length(so)))*step(.58,hs)*k3;   // loose stones, most of them in the crown and at the edges
        stone*=1.-.75*rut;
        vec3 track=vec3(.50,.485,.43)*(.50+.52*rut+.50*(peb-.45))*(1.-.22*smoothstep(.55,.8,gN(vec2(p.x*.7,p.y*.12)+70.)))*(.66+.60*gN(vec2(p.x*1.1+3.,p.y*.62)));   // damp and dry reaches, potholes: never one flat tone
        track=mix(track, vec3(.64,.62,.56)*(.8+.4*gH(sc+5.)), stone*.8);
        track=mix(track, gtTurfCol(big,.55+.4*fine)*1.35+vec3(.02,.025,.015), crown*(.74+.2*k3*step(.45,fine)));
        float verge=(1.-smoothstep(.0,.7,abs(ax-edge)))*.35;
        vec3 alb=mix(grass*(1.+verge), track, tr);
        vec3 n=normalize(vec3(-gr.x,1.,-gr.y));
        vec3 nt=normalize(vec3((peb-.45)*.5*k3-stone*so.x*5., 1., (gN(p*7.+13.)-.5)*.5*k3-stone*so.y*5.));
        n=normalize(mix(n,nt,tr));
        // the turf's own long shadows when the sun is low: five looks toward the sun across the relief
        float lit=1.;
        if(uSunI>.001){ vec2 sd=uSunLocal.xz; float sl=max(length(sd),1e-3); sd/=sl; float ta=max(uSunLocal.y,0.)/sl;
          float hb=gtRelS(p), s=.4, sh=0.;
          for(int i=0;i<5;i++){ sh=max(sh, smoothstep(0.,.07,(gtRelS(p+sd*s)-hb)*.50-s*ta-.015)); s*=2.15; }
          lit=1.-sh*mix(.35,.92,k1)*(1.-.45*tr); }                                     // (the bare track is spared most of it: the boxes' long shadows read across it)
        // by night the hollows are darker and the side toward the Milky Way a shade paler
        vec2 gd=uGalLocal.xz; gd/=max(length(gd),1e-3);
        alb*=1.+.9*dot(n.xz,gd)*(1.-tr)*(1.-min(uSunI,1.)*.7);
        float graze=mix(.12+.10*(1.-k1), .04+.26*peb*peb+.12*rut*(1.-crown)+.42*stone, tr);    // the grit takes the low sun stone by stone, not as one pale sheet
        float sx=gN(vec2(p.x*.9+p.y*.9,vL.y*.22)), sy=gN(vec2(p.x*.25-p.y*.25,vL.y*1.6));
        vec3 rock=mix(vec3(.10,.10,.105), vec3(.26,.25,.235), sx*.6+sy*.4)*(.6+.4*smoothstep(.3,.6,sy));   // the cliff: bedded limestone
        float k=smoothstep(.25,.75,vK);
        alb=mix(alb, rock, k);
        n=normalize(mix(n, vec3(0.,.25,-1.), k));
        gl_FragColor=vec4(gtLit2(alb,n,vL,graze*(1.-k),mix(lit,1.,k)),1.); }`}),De=new e.ShaderMaterial({uniforms:a,side:e.DoubleSide,vertexShader:`attribute vec4 aOff; varying vec3 vL, vBase, vTip; varying float vT, vF, vLit; uniform float uTime, uPx; uniform vec3 uG, uCis; ${Pe} ${B} ${ke}
      void main(){ float t=position.y; float a=aOff.w*6.2832; vec2 r=vec2(cos(a),sin(a)); vec2 q=aOff.xy;
        float gy=gtGY(q);
        float d=length(vec3(q.x,gy,q.y)-uG);                                           // distance from the lens (the lens is G(u) in the land frame)
        float wide=max(1., d*uPx*1.3/.07);                                               // never thinner than about 1.3 pixels
        float keep=(1.-smoothstep(42.,90.,d))*step(uCis.z+.55, length(q-uCis.xy));       // blades are near detail: they sink into the turf with distance (and none grows in the tank)
        float h=gtRelS(q), big=gtBig(q), hsh=fract(aOff.w*37.7);
        float gw=gtGust(q,uTime);
        float gust=.30+.3*sin(uTime*1.7+q.x*.21+q.y*.07+aOff.w*3.)+.2*sin(uTime*.6-q.x*.045)+.35*gw;
        float hz=aOff.z*(.40+1.75*h)*keep;                                               // tufts stand tall on the tussocks, cropped in the hollows
        vec3 p=vec3(q.x+r.x*position.x*wide*keep+t*t*gust*hz*.9, gy+t*hz*(1.-.25*t*gust), q.y+r.y*position.x*wide*keep+t*t*.15*hz*sin(uTime*2.3+aOff.w*9.));
        vBase=gtTurfCol(big,h/.9)*(1.05+.4*hsh)+vec3(.062,.088,.104)*gw*(.35+1.1*h);
        vTip=mix(vBase*1.6, vec3(.34,.33,.23)*(.55+.75*hsh), .25+.55*hsh*h)+vec3(.062,.088,.104)*gw*.5;   // bent grass: straw-pale heads, paler where the wind lays them over
        float lit=1.;
        if(uSunI>.001){ vec2 sd=uSunLocal.xz; float sl=max(length(sd),1e-3); sd/=sl; float ta=max(uSunLocal.y,0.)/sl; float s=.4, sh=0.;
          for(int i=0;i<5;i++){ sh=max(sh, smoothstep(0.,.07,(gtRelS(q+sd*s)-h)*.50-s*ta-.015)); s*=2.15; }
          lit=1.-sh*.92; }
        vLit=lit; vL=p; vT=t; vF=1./wide; gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(p,1.); }`,fragmentShader:`precision highp float; varying vec3 vL, vBase, vTip; varying float vT, vF, vLit; ${B}
      void main(){ float t=clamp(vT,0.,1.);                                                   // vT is 0 at the root and 1 at the tip; multisampling extrapolates it far outside that on a blade seen edge-on, and its square below would make one sample blaze
        vec3 alb=mix(vBase, vTip, t*t*(.35+.65*vF));
        float nearB=smoothstep(.30,.95,vF);                                                   // far blades take the turf's own light: no bright specks
        gl_FragColor=vec4(gtLit2(alb,vec3(0.,1.,0.),vec3(vL.x,vL.y-vT*.3+.02,vL.z),mix(.20,.12+.95*t*t,nearB),mix(vLit,1.,t*t*.6*nearB)),1.); }`}),Ee=new e.ShaderMaterial({uniforms:a,vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.); }",fragmentShader:`precision highp float; varying vec2 vUv; uniform float uWindow, uTime;
      void main(){ vec2 q=abs(vUv-.5); float bars=step(.035,q.x)*step(.035,q.y)*step(q.x,.46)*step(q.y,.45);
        gl_FragColor=vec4(vec3(.004,.006,.012)+vec3(1.,.585,.255)*(6.5*uWindow*bars*(.94+.06*sin(uTime*7.))),1.); }`});await o.yield();const Ge=new e.Vector3(0,1,0).addScaledVector(n.gal,-n.gal.y).normalize(),Ie=(t,i,r)=>{a.uBoxMin.value[t].set(i[0],i[1],i[2]),a.uBoxMax.value[t].set(r[0],r[1],r[2])},Q={turn:0,sunAlt:0};function xe(t,i,r,l,p){const x=ee(l)*u;h.pointAt(l,V),A.set(0,6,-Be(l)),T.setFromAxisAngle(n.k,x),f.matrix.makeTranslation(V.x,V.y,V.z).multiply(We.makeRotationFromQuaternion(T)).multiply($e.makeTranslation(-A.x,-A.y,-A.z)),f.matrixWorldNeedsUpdate=!0,a.uP.value.copy(V),a.uG.value.copy(A),a.uTurn.value=x,a.uTime.value=i,a.uLandUp.value.set(0,1,0).applyQuaternion(T);const S=Math.asin(Math.max(-1,Math.min(1,n.sun.dot(a.uLandUp.value))));a.uSunAlt.value=S,T.invert(),a.uSunLocal.value.copy(n.sun).applyQuaternion(T),a.uGalLocal.value.copy(Ge).applyQuaternion(T),a.uDawn.value=F(-.31,-.04,S),a.uTw.value=F(-.4,-.14,S),a.uWindow.value=1-F(.1,.119,l),a.uCard.value=1-F(.9,.95,l),a.uSunI.value=1.25*F(.895,.915,l)*(.45+.55*F(.9,1,l)),p&&(p.getDrawingBufferSize(Le),a.uRes.value.copy(Le)),r&&(a.uPx.value=2/(Math.max(.05,r.projectionMatrix.elements[5])*Math.max(1,a.uRes.value.y))),Q.turn=x,Q.sunAlt=S}return xe(0,0,null,0,null),{sky:y,land:f,uniforms:a,astro:n,update:xe,state:Q,setBox:Ie,cistern:w,seaY:C,materials:{solid:Ae,ground:Re,grass:De,window:Ee,water:re}}}async function Ze(o,s={}){const{makePath:c}=o.core,n=c([[0,0,0],[0,52.3,-1499]]),h=[];for(let d=0;d<12;d++){const a=(10+16*d/11)*u;h.push(new e.Vector3(Math.sin(a)*2500,8+d*5%12*5.6,-Math.cos(a)*2500))}const v=await Ke(o,{path:n,lamps:h,lampOutU:h.map(()=>2),detail:o.quality?.detail??1}),m=new e.Group;return m.add(v.sky,v.land),{object:m,radius:60,height:20,center:new e.Vector3(0,6,-40),anchors:{},update(d,a,k){v.update(d,a,k,.12+.6*(.5-.5*Math.cos(a*.15)),o.renderer)},dispose(){},ground:!1,groundY:0}}export{be as DRIFT,Se as DRIFT_P,B as LAND_GLSL,H as SKY_GLSL,Z as TURN_MAX,Ze as buildHero,Be as driftN,Je as groundY,_e as makeAstronomy,Ke as makeDevice,ee as turnDeg,Xe as uOfTurn};
