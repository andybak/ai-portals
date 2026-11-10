import*as e from"three";const ze=1,f={S:[0,10,-138],H:[0,15,-258],L:[180,14,-283],E:[180,14,-138],wallZ:[-253,-225,-197,-168,-138.4],XB:84,XE:286,ZN:-137.6,rho:[3.5,2.1,1.55,1.22,1],ring:[0,14.2,-228,7],fallZ:-226,wallSlope:21/258,ceil:48,portalR:15,cone:13.5},Ue=-.9,Ye=.5,ge=(t,n,o)=>t+(n-t)*o,He=t=>Math.min(1,Math.max(0,t)),Y=(t,n,o)=>{const R=He((o-t)/(n-t));return R*R*(3-2*R)},Fe=1,Le=0,at=1,st=1,rt=1,we={go:3,rise:1.5,behindPier:6,out:10,inShadow:4.5,lower:6,lowTo:-325,farZ:-350},xe={half:4,proud:6,slot0:f.XB-8,module:30,farZ:-350,clearS:4.5},nt=at?4*.5/1.125:1,ye=`
  float h21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
  float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
    return mix(mix(h21(i),h21(i+vec2(1,0)),f.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x), f.y); }
  float fbm(vec2 p){ return .5*vn(p)+.25*vn(p*2.03+7.1)+.125*vn(p*4.01+3.3)+.0625*vn(p*8.07+1.7); }
`,Me=`
  uniform vec3 uSun, uSunCol, uFill, uShadow, uHaze, uEye; uniform float uTime, uHazeK, uFront;
  // one cloud's shadow lies across the middle of the valley at the entry (sun on the forest under us, sun on the head of the valley
  // beyond it) and travels on up the valley ahead of us, over the foot of the fall and up the headwall; uFront = z of its near edge
  float cfront(vec3 p){ float e=uFront-p.z+16.*sin(p.x*.031+1.3)+7.*sin(p.x*.083+p.z*.027)+.14*p.x; return 1.-.55*smoothstep(-14.,14.,e)*(1.-smoothstep(82.,116.,e)); }
  vec3 vlit(vec3 alb, vec3 n, float sh){
    float nl=max(dot(n,uSun),0.)*sh, hemi=.5+.5*n.y;
    vec3 amb=uFill*(.30+.80*hemi)+uSunCol*vec3(.9,.85,.6)*.07*(1.-hemi)*(.4+.6*sh);       // sky from above, warm ground bounce from below
    return alb*(uSunCol*nl+amb)+alb*uShadow*(1.-nl)*.30; }
  vec3 vhaze(vec3 c, vec3 p){ vec3 v=p-uEye; float d=length(v);
    float f=1.-exp(-d*uHazeK*(.42+.75*exp(-max(p.y+8.,0.)*.016)));
    float sd=max(dot(v/max(d,1e-3),uSun),0.);
    return mix(c, uHaze*(1.+.30*sd*sd), f); }
`;async function it(t,n,o){const v=new Float32Array(11760);for(let u=0;u<112;u++){for(let i=0;i<105;i++)v[u*105+i]=n.h(-208+i*4,140-u*4);u%8===7&&await t.yield()}const r=(u,i)=>{const h=Math.min(103.999,Math.max(0,(u- -208)/4)),a=Math.min(112-1.001,Math.max(0,(140-i)/4)),l=h|0,w=a|0,L=h-l,E=a-w,F=w*105+l;return(v[F]*(1-L)+v[F+1]*L)*(1-E)+(v[F+105]*(1-L)+v[F+105+1]*L)*E},c=o.x,p=o.y,C=o.z;return(u,i,h)=>{if(Math.abs(u)>206||h>138||h<-302)return 1;let a=1;for(let l=1;l<=24;l++){const w=2.5*l+.42*l*l,L=r(u+c*w,h+C*w)-(i+1.5+p*w);if(L>0&&(a=Math.min(a,1-L/(.07*w+2)),a<=0))return 0}return a}}const Ce={r0:34,r1:62,p0:78,p1:46,s:36,w:15e3};function lt(t){const n=y=>ge(11*Math.sin(y*.019+.6)+5*Math.sin(y*.043+2.1),3.5,Y(-150,-222,y)),o=(y,s=0)=>46+6*t.n2(y*.008,3.1)+(s<0?1:-1)*11*Math.sin(y*.026+.9)*Y(30,-20,y);return{rc:n,half:o,h:(y,s)=>{const b=n(s),T=Math.abs(y-b*.3),v=Math.abs(y-b);let r=-6.3+.004*T*T+2*t.fbm2(y*.021,s*.021,3);s>-226&&(r=ge(r,-8.2,Y(8,2.6,v)));const c=o(s,y),p=Y(c-5,c+34,T),C=ge(1,.42,Y(-50,-250,s));r+=C*(p*(118+22*t.fbm2(y*.011,s*.011,3))+p*(1-p)*46*t.ridged2(y*.03+9,s*.022,3)),r+=Y(c+30,c+200,T)*30*(.5+t.fbm2(y*.006,s*.006,3));const u=Y(-225.5,-231,s);u>0&&(r=Math.max(r,ge(r,5.6+1.2*t.n2(y*.08,s*.08),u)));const i=Y(-234,-288,s);r+=i*(40+24*t.fbm2(y*.012+7,s*.012,3)-16*Math.exp(-y*y/900)+22*Y(16,46,Math.abs(y)));const h=Y(-300,-560,s);r+=h*(34+80*t.ridged2(y*.0045+3,s*.0045,4))*(.55+.45*Y(0,160,Math.abs(y)+60));const a=y-26,l=s+705,w=Math.exp(-(a*a+l*l*.7)/21e3);r+=w*(205+70*t.ridged2(y*.011+1,s*.011,3))+60*Math.exp(-(a*a*.5+l*l)/2600);const L=Y(-300,-430,s);if(L>0){const E=Ce.r0+Ce.r1*t.ridged2(y*.0045+3,s*.0045,4),F=Math.exp(-(a*a+l*l*.7)/Ce.w)*(Ce.p0+Ce.p1*t.ridged2(y*.011+1,s*.011,3))+Ce.s*Math.exp(-(a*a*.5+l*l)/2600);r=ge(r,E+F,L)}return r}}}async function ht(t,n,o,R,y,s){const{h:b,rc:T,half:v}=n,r=t.noise,c=new e.Vector3(26,0,-705);for(let F=-40;F<=92;F+=6)for(let V=-645;V>=-765;V-=6){const d=b(F,V);d>c.y&&c.set(F,d,V)}const p=new e.ShaderMaterial({name:"pwys-terrain",uniforms:{...R,uFlower:{value:new e.Color(o.flower||"#F3E9B0")},uBand:{value:new e.Color(o.band||o.rock)},uStrata:{value:o.strata??0},uGully:{value:o.snow?1:0},uHeadRock:{value:o.headRock??0},uBounce:{value:o.bounce??.05},uRockC:{value:new e.Color(o.rock)},uSnowY:{value:(o.snow??150)-55},uPeak:{value:c}},vertexColors:!0,fog:!1,side:e.DoubleSide,vertexShader:`
      attribute float aSh, aRk; uniform float uHeadRock; varying vec3 vP, vN, vC; varying float vSh, vRk;
      void main(){ vP=position; vN=normal; vC=color; vSh=aSh; vRk=aRk*uHeadRock; gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.); }`,fragmentShader:`precision highp float;
      varying vec3 vP, vN, vC; varying float vSh, vRk; uniform vec3 uFlower, uBand, uRockC, uPeak; uniform float uStrata, uGully, uBounce, uSnowY; ${ye} ${Me}
      // THE PEAK IN THE NOTCH: ar\xEAtes and gullies run down from the summit (th = bearing round the summit, ro = metres out from it),
      // three sizes of rib, each a crest with a sharp edge; the finer ones only where they are wider than a pixel or two
      float prib(float th, float ro){ float a=vn(vec2(th, ro)); return 1.-abs(a*2.-1.); }
      float prel(float th, float ro, float w2, float w3){
        return .55*prib(th*2.3, ro*.0040)+.30*w2*prib(th*6.1+1.3, ro*.0085+5.)+.15*w3*prib(th*14.3+4.1, ro*.019+9.); }
      void main(){
        vec3 n=normalize(vN+vec3(0.,1e-4,0.));
        float dist=length(vP-uEye), near=1.-smoothstep(40.,150.,dist);
        float big=fbm(vP.xz*.035+3.), med=fbm(vP.xz*.35);
        float rock=max(smoothstep(.50,.72,1.-n.y+(big-.5)*.16), smoothstep(.35,.75,vRk));
        // rock: tall ribs and gullies cut along the face (the sun rakes across them), uneven beds that step back as ledges
        // with a shadow line under each, a few big joints; grass only where the ground really levels
        vec3 tw=vec3(n.z,0.,-n.x); tw/=max(length(tw),1e-3);                                 // along the face, level
        float along=dot(vP,tw)+vP.y*.22;
        float rb=vn(vec2(along*.050, vP.y*.010)+11.)*.62+vn(vec2(along*.135+3., vP.y*.028))*.38;
        float rbs=(vn(vec2(along*.050+.030, vP.y*.010)+11.)-vn(vec2(along*.050-.030, vP.y*.010)+11.))*.62
                 +(vn(vec2(along*.135+3.05, vP.y*.028))-vn(vec2(along*.135+2.95, vP.y*.028)))*.38;      // its slope along the face
        float bed=vP.y*.085*(1.+1.1*uStrata)+along*.012+((1.5-.9*uStrata)*vn(vP.xz*.016)+.5*vn(vP.xz*.07+7.))*mix(1.,.22,vRk), bi=floor(bed), fb=fract(bed);   // at the head of the valley the beds lie level
        float bw=.30+.55*h21(vec2(bi,7.)), strong=smoothstep(.35,.75,vn(vec2(along*.03,bi*3.7))), ledge=smoothstep(bw,bw+.05,fb)*strong, under=smoothstep(bw-.14,bw,fb)*(1.-smoothstep(bw,bw+.05,fb))*strong;
        float quiet=max(smoothstep(.70,.90,min(vC.r,min(vC.g,vC.b))), .92*(1.-smoothstep(-300.,-258.,vP.z))); ledge*=1.-.92*quiet; under*=1.-.92*quiet;   // snow and far faces carry no beds (they read as contour swirls)
        float gentle=1.-smoothstep(.22,.50,1.-n.y);                                               // on the easier slopes ribs and beds are quieter (no contour-map swirls)
        vec3 nr=n-tw*rbs*7.5*(1.-.88*max(gentle,vRk))*(1.-quiet)+vec3(0.,(ledge*.55-under*.35)*(1.-.7*gentle),0.); nr/=max(length(nr),1e-3);
        float tone=mix(.80+.26*h21(vec2(bi,3.)), .93, .65*gentle)*mix(.74+.50*rb, .97, .6*gentle)*(.92+.16*vn(vP.xz*1.3+vP.y*.9))*(1.-.22*under*(1.-.7*gentle));
        tone*=1.-.16*smoothstep(.46,.5,abs(vn(vec2(along*.021, vP.y*.007)+rb*.4)-.5)*2.)*(1.-quiet); tone=mix(tone, .93+.10*rb, .85*quiet);       // a few long joints
        vec3 rk=vC*tone*mix(1., mix(.76+.48*h21(vec2(bi,3.)), 1., .55*gentle), uStrata);
        rk=mix(rk, uBand*tone, uStrata*.46*(1.-.5*gentle)*step(.62,h21(vec2(bi,9.))));                                // strata: beds of another stone, level across the cliffs
        rk*=mix(vec3(1.), vec3(1.14,1.0,.82), smoothstep(.45,.8,vn(vP.xz*.017+vP.y*.011)))*mix(vec3(1.), vec3(1.20,1.07,.90), .7*uGully);               // weathering stain, warm
        rk=mix(rk, vec3(.90,.94,1.), uGully*.80*(1.-smoothstep(.20,.31,rb))*smoothstep(62.,108.,vP.y+22.*big)*smoothstep(.50,.68,vn(vec2(along*.011,5.3)+vP.y*.004))*(1.-gentle)*(1.-vRk));  // old snow lying in the gullies between the ribs
        // meadow: mottled turf, wind running over it, a scatter of flowers near the eye
        float wind=vn(vP.xz*.06+vec2(uTime*.55,uTime*.21));
        float blade=vn(vP.xz*3.1)*vn(vP.xz*7.3+2.);
        vec3 gr=vC*(.70+.42*med+.26*big)*(.90+.22*smoothstep(.35,.8,wind))*(.86+.5*blade*near);
        vec2 fc=vP.xz*1.35; float fl=step(.955,h21(floor(fc)))*(1.-smoothstep(.12,.34,length(fract(fc)-.5)))*near*smoothstep(.45,.7,big)*(1.-rock)*smoothstep(.86,.95,n.y);
        gr=mix(gr, uFlower, fl*.85);
        // THE HEAD OF THE VALLEY AND THE PEAKS IN THE NOTCH are a few big triangles: their rock and snow are drawn here, per pixel
        // (steep ribs of bare rock standing out of the snow, snow lying in the gullies and on every shelf), never smeared from the corners.
        float hw=1.-smoothstep(-296.,-256.,vP.z);
        vec2 fq=vec2(vP.x*.017+vP.z*.006, vP.y*.021);
        float f1=fbm(fq+5.), f2=fbm(fq*2.7+9.), ribv=vn(vec2(vP.x*.050+vP.z*.025+f1*1.1, vP.y*.006))*.6+vn(vec2(vP.x*.135+vP.z*.06+f2*.8, vP.y*.016))*.4;
        float snowL=smoothstep(.44,.60, ribv*.78+f1*.22+(n.y-.5)*.8+(vP.y-uSnowY)*.0055)*uGully;
        vec3 rockc=uRockC*(.50+.75*f2)*(.70+.60*ribv)*mix(vec3(1.), vec3(1.12,1.,.86), smoothstep(.45,.8,f1));
        vec3 hc=mix(mix(rk*(.72+.56*f2)*(.80+.40*ribv), rockc, uGully), vec3(.50,.53,.58)*(.86+.22*f2), snowL);
        float hrock=hw*smoothstep(16.,52.,vP.y+18.*f1)*mix(.0,1.,uGully);
        rock=max(rock, hrock); rk=mix(rk, hc, hw);
        vec3 alb=mix(gr, rk, rock); n=normalize(mix(n, nr, rock)+vec3(0.,1e-4,0.));
        alb*=mix(vec3(1.), vec3(1.40,1.13,.76), uGully*rock*(1.-snowL*hw)*smoothstep(.05,.55,dot(n,uSun))*.85);          // the slate takes the sun warm and keeps its blue in the shade
        n=normalize(n+(tw*(ribv-.5)*1.5+vec3(0.,(f2-.5)*.7+.5*snowL,0.))*hw*rock+vec3(0.,1e-4,0.));
        // BEYOND THE HEADWALL (alpine): the second ridge and the snow peak. Crisp, sunlit snow with clear ridges and blue shade:
        // every rib has a sunlit flank (the sun rakes in from the left) and a flank in shade, meeting in one sharp edge; bare slate
        // where a flank is steep and below the snow line; nothing is stretched down the face and nothing follows the contours.
        float pkw=(1.-smoothstep(-345.,-305.,vP.z))*uGully, shP=1.;
        if(pkw>0.){
          vec2 pd=vP.xz-uPeak.xz; float ro=length(pd)+1e-3, th=atan(pd.x, abs(pd.y)<1e-4?1e-4:pd.y)+(f1-.5)*.50;
          float w2=smoothstep(22.,70.,ro), w3=smoothstep(70.,170.,ro);
          float r0=prel(th,ro,w2,w3), sl=(prel(th+.012,ro,w2,w3)-prel(th-.012,ro,w2,w3))/.024;       // the ribs' slope across the fall line
          vec3 tg=vec3(pd.y,0.,-pd.x)/ro, ng=normalize(vN+vec3(0.,1e-4,0.));
          vec3 np=normalize(ng-tg*sl*.24*ng.y*(.75+.5*f2));
          vec3 rake=normalize(vec3(uSun.x*1.9, uSun.y*.50, uSun.z*.55));
          shP=smoothstep(-.02,.13,dot(np,rake));                                                  // the edge between light and shade is sharp
          float line=smoothstep(52.,96.,vP.y+30.*(f1-.5)+16.*(r0-.5));                             // the snow line
          float steepK=max(smoothstep(.50,.78,abs(sl)*.21+(f2-.5)*.30), smoothstep(.62,.80,1.-ng.y));
          float snowP=line*(1.-.85*steepK);
          vec3 rockP=uRockC*(.34+.42*f2)*(.80+.40*r0)*mix(vec3(.80,.92,1.12), vec3(1.30,1.10,.82), shP);        // slate: warm in the sun, blue in the shade
          vec3 snowC=mix(vec3(.50,.61,.84), vec3(.70,.70,.68), shP)*(.94+.12*r0);                    // snow: white in the sun, blue in the shade
          alb=mix(alb, mix(rockP, snowC, snowP), pkw); n=normalize(mix(n, np, pkw)+vec3(0.,1e-4,0.)); shP=mix(1., shP, pkw); }
        float cl=.56+.44*smoothstep(.40,.58,vn(vP.xz*.014+vec2(uTime*.16,uTime*.045))*.75+vn(vP.xz*.031-vec2(uTime*.2,uTime*.05)+4.)*.25);                   // drifting cloud shade
        cl*=cfront(vP);
        vec3 c=vlit(alb, n, cl*vSh*shP);
        c+=alb*uSunCol*uBounce*(1.-cl*vSh)*(.35+.65*rock)*(.55+.45*n.y)*(1.-pkw);                        // light thrown back into the shade by the sunlit flank
        gl_FragColor=vec4(vhaze(c,vP),1.);
      }`}),C=new e.Color(o.meadow),u=new e.Color(o.meadow2),i=new e.Color(o.rock),h=new e.Color(o.rockDark),a=new e.Color(o.bank),l=new e.Color,w=new e.Color("#F4F7FA"),L=new e.Color(o.tree).lerp(C,.45),E=async(F,V,d,A,g,m,k)=>{const W=new Float32Array((g+1)*(m+1)*3),N=new Float32Array((g+1)*(m+1)*3),M=new Float32Array((g+1)*(m+1)*3),j=new Float32Array((g+1)*(m+1)),$=new Float32Array((g+1)*(m+1)),K=(V-F)/g,I=(A-d)/m;let S=0;for(let X=0;X<=m;X++){const P=d+I*X;for(let Z=0;Z<=g;Z++,S+=3){const x=F+K*Z,re=b(x,P),J=1.5,se=b(x+J,P)-b(x-J,P),Q=b(x,P+J)-b(x,P-J),U=1/Math.hypot(se,2*J,Q);W[S]=x,W[S+1]=re,W[S+2]=P,M[S]=-se*U,M[S+1]=2*J*U,M[S+2]=-Q*U;const le=Y(.55,.8,1-M[S+1]),he=Math.abs(x-T(P)*.3),Ve=Y(v(P,x)+20,v(P,x)+60,he);l.copy(C).lerp(u,He(.5+.9*r.fbm2(x*.03+5,P*.03,2))),l.lerp(L,(o.floorDark??.55)*Y(-.25,.3,r.fbm2(x*.016+40,P*.016,2))*(re<46?1:0)),P>-226&&l.lerp(a,Y(9,4,Math.abs(x-T(P)))*.8),$[S/3]=Y(-233,-246,P)*Y(2,9,re),l.lerp(i,Math.max(le,Y(-233,-246,P)*.92)).lerp(h,le*He(.5+r.n2(x*.02,re*.05))*.6),l.lerp(u,Ve*(1-le)*Y(.8,.93,M[S+1])*.25),P<-231&&l.lerp(h,.75*Math.exp(-x*x/2200)*Y(70,20,re)),o.snow&&l.lerp(w,Y(o.snow,o.snow+45,re+30*r.n2(x*.01,P*.01))*(1-.55*le)),N[S]=l.r,N[S+1]=l.g,N[S+2]=l.b,j[S/3]=s(x,re,P)}X%6===5&&await t.yield()}const B=[];for(let X=0;X<m;X++)for(let P=0;P<g;P++){if(k&&k(F+K*(P+.5),d+I*(X+.5)))continue;const Z=X*(g+1)+P,x=Z+1,re=Z+g+1,J=re+1;B.push(Z,x,re,x,J,re)}let z=W,O=M,q=N,D=j,oe=$;if(!k){const X=[];for(let Q=0;Q<=g;Q++)X.push(m*(g+1)+Q);const P=[],Z=[];for(let Q=0;Q<=m;Q++)P.push(Q*(g+1)),Z.push(Q*(g+1)+g);const x=[X,P,Z],re=X.length+P.length+Z.length,J=W.length/3;z=new Float32Array(W.length+re*3),O=new Float32Array(z.length),q=new Float32Array(z.length),D=new Float32Array(z.length/3),oe=new Float32Array(z.length/3),z.set(W),O.set(M),q.set(N),D.set(j),oe.set($);let se=J;for(const Q of x)for(let U=0;U<Q.length;U++,se++){const le=Q[U]*3;z[se*3]=W[le],z[se*3+1]=W[le+1]-110,z[se*3+2]=W[le+2],O[se*3]=M[le],O[se*3+1]=M[le+1],O[se*3+2]=M[le+2],q[se*3]=N[le],q[se*3+1]=N[le+1],q[se*3+2]=N[le+2],D[se]=j[Q[U]],oe[se]=$[Q[U]],U>0&&B.push(Q[U-1],Q[U],se-1,Q[U],se,se-1)}}const ae=new e.BufferGeometry;ae.setAttribute("position",new e.BufferAttribute(z,3)),ae.setAttribute("normal",new e.BufferAttribute(O,3)),ae.setAttribute("color",new e.BufferAttribute(q,3)),ae.setAttribute("aSh",new e.BufferAttribute(D,1)),ae.setAttribute("aRk",new e.BufferAttribute(oe,1)),ae.setIndex(B);const _=new e.Mesh(ae,p);return _.frustumCulled=!1,_.layers.set(ze),y.add(_),await t.yield(),_};return await E(-120,120,126,-294,80,140,null),await E(-240,240,-294,-774,40,40,null),await E(-720,720,216,-1104,48,44,(F,V)=>Math.abs(F)<120&&V>-294||Math.abs(F)<240&&V<-294&&V>-774),p}function ct(t){const n=[],o=[],R=[],y=[],s=(v,r,c,p,C,u,i,h)=>{const a=Math.hypot(p,C,u)||1;return n.push(v,r,c),o.push(p/a,C/a,u/a),R.push(i,h),n.length/3-1},b=(v,r,c)=>{const p=n.length/3;for(let C=0;C<c;C++){const u=C/c*6.2832,i=Math.cos(u),h=Math.sin(u);s(i*v,0,h*v,i,.1,h,.6,1),s(i*v*.6,r,h*v*.6,i,.1,h,.6,1)}for(let C=0;C<c;C++){const u=p+C*2,i=p+(C+1)%c*2;y.push(u,u+1,i,i,u+1,i+1)}};if(t==="fir"){b(.016,.3,4);const v=7,r=10;for(let c=0;c<v;c++){const p=c/(v-1),C=.11+.72*Math.pow(p,.9)*.86,u=.235*(1-.8*p),i=Math.min(1,C+.2+.1*(1-p)),h=c*.9,a=s(0,i,0,0,1,0,.12,0),l=n.length/3;for(let w=0;w<r;w++){const L=w/r*6.2832+h,E=w%2===0,F=u*(E?1:.74),V=Math.cos(L),d=Math.sin(L);s(V*F,C-(E?.03:0),d*F,V,.6,d,E?1:.5,0)}for(let w=0;w<r;w++)y.push(a,l+(w+1)%r,l+w)}}else{const v=t==="birch";b(v?.014:.026,v?.86:.55,5);const r=v?[[.42,.9,.13],[.56,3.2,.12],[.68,5.1,.1]]:[[.22,.6,.2],[.32,2.9,.22],[.42,4.6,.18]];for(const[c,p,C]of r){const u=Math.cos(p),i=Math.sin(p),h=v?.006:.012,a=s(0,c-h*2.2,0,-i,.2,u,.5,1),l=s(0,c+h*2.2,0,-i,.2,u,.5,1),w=s(u*C,c+C*(v?1.1:.7),i*C,-i,.2,u,.5,1);y.push(a,l,w)}}const T=new e.InstancedBufferGeometry;return T.setAttribute("position",new e.Float32BufferAttribute(n,3)),T.setAttribute("normal",new e.Float32BufferAttribute(o,3)),T.setAttribute("aL",new e.Float32BufferAttribute(R,2)),T.setIndex(y),T}async function ft(t,n,o,R,y,s,b,T=1){const{h:v,rc:r,half:c}=n,p=t.rng.fork("pwys-trees"),C=t.noise,u=ct(o.treeKind||"fir"),i=Math.round((o.sage||0)*Math.min(1,s/800)),h=Math.round(s*.4),a=new Float32Array((s+i+h)*4),l=new Float32Array((s+i+h)*3);let w=0,L=0;for(;w<s&&L<s*30;){L++;const S=p.range(-112,112),B=p.range(-246,122),z=v(S,B),O=Math.abs(S-r(B)),q=Math.abs(S-r(B)*.3),D=c(B,S);if(O<6.5||z>24||B<-224&&Math.abs(S)<16||Math.abs(v(S+2,B)-z)+Math.abs(v(S,B+2)-z)>3.4)continue;const ae=.25+.75*Y(-.25,.3,C.fbm2(S*.016+40,B*.016,2))+.5*Y(D-22,D-4,q);if(p()>ae*o.treeDensity)continue;let _=p.range(9,16)*o.treeScale;o.sizeVar&&(_*=.5+1.15*Math.pow(p(),1.7)),Math.abs(S)<16&&(_=Math.min(_,p.range(4.4,6)-z)),!(_<(o.sizeVar?2.6:5))&&(a[w*4]=S,a[w*4+1]=z-.4,a[w*4+2]=B,a[w*4+3]=_,l[w*3]=p(),l[w*3+1]=p()*6.283,l[w*3+2]=b(S,z+_*.6,B),w++,L%300===0&&await t.yield())}const E=w;for(let S=0,B=0;S<i&&B<i*20;B++){const z=p.range(-70,70),O=p.range(-224,122),q=v(z,O);Math.abs(z-r(O))<5||q>8||Math.abs(v(z+2,O)-q)+Math.abs(v(z,O+2)-q)>2.2||C.fbm2(z*.05+11,O*.05,2)<-.12||(a[w*4]=z,a[w*4+1]=q-.25,a[w*4+2]=O,a[w*4+3]=p.range(1.3,2.7),l[w*3]=p(),l[w*3+1]=p()*6.283,l[w*3+2]=b(z,q+1,O),w++,S++,B%300===299&&await t.yield())}for(let S=0,B=0;S<h&&B<h*8;B++){const z=p.range(-240,122),O=p()<.5?-1:1,q=r(z)*.3+O*(c(z,O)+p.range(0,30)),D=Math.abs(q)<118?v(q,z):0;if(B%200===199&&await t.yield(),D<=24||D>100)continue;const oe=Math.abs(v(q+2,z)-D)+Math.abs(v(q,z+2)-D);if(oe>9)continue;const ae=Y(24,100,D),_=(1-ae)*(.35+.65*Y(-.2,.3,C.fbm2(q*.016+40,z*.016,2)));if(p()>_*Math.min(1,o.treeDensity*1.4))continue;const X=ge(10,5,ae)*p.range(.8,1.25)*o.treeScale;a[w*4]=q,a[w*4+1]=D-(.4+.25*oe)*X/10,a[w*4+2]=z,a[w*4+3]=X,l[w*3]=p(),l[w*3+1]=p()*6.283,l[w*3+2]=b(q,D+X*.6,z),w++,S++}const F=14,V=-126,d=-260,A=18,g=28,m=Array.from({length:A*g},()=>[]),k=R.uSun.value,W=Math.hypot(k.x,k.z)/Math.max(k.y,.2),N=-k.x/Math.max(Math.hypot(k.x,k.z),.001),M=-k.z/Math.max(Math.hypot(k.x,k.z),.001);for(let S=0;S<E;S++){const B=Math.floor((a[S*4]-V)/F),z=Math.floor((a[S*4+2]-d)/F);B>=0&&B<A&&z>=0&&z<g&&m[z*A+B].push(S)}const j=o.treeShadow??0,$=(S,B)=>{if(!j)return 1;const z=Math.floor((S-V)/F),O=Math.floor((B-d)/F);let q=0;for(let D=O-1;D<=O+1;D++)for(let oe=z-1;oe<=z+1;oe++)if(!(oe<0||oe>=A||D<0||D>=g))for(const ae of m[D*A+oe]){const _=a[ae*4],X=a[ae*4+2],P=a[ae*4+3],Z=Math.min(P*.85*W,13),x=.26*P+1.2,re=S-_,J=B-X,se=Math.min(Z,Math.max(0,re*N+J*M)),Q=Math.hypot(re-N*se,J-M*se);Q<x&&(q=Math.max(q,(1-Q/x)*(.55+.45*se/Math.max(Z,1))))}return 1-j*Math.min(1,q*1.6)};u.instanceCount=w,u.setAttribute("aInst",new e.InstancedBufferAttribute(a,4)),u.setAttribute("aTint",new e.InstancedBufferAttribute(l,3));const K=new e.ShaderMaterial({name:"pwys-trees",fog:!1,side:e.DoubleSide,uniforms:{...R,uTreeA:{value:new e.Color(o.tree)},uTreeB:{value:new e.Color(o.tree2)},uTip:{value:new e.Color(o.treeTip||o.tree2)},uBark:{value:new e.Color(o.bark||"#4A3A2C")},uMottle:{value:o.treeKind&&o.treeKind!=="fir"?1:.3},uGlow:{value:o.leafGlow??.06}},vertexShader:`
      attribute vec4 aInst; attribute vec3 aTint; attribute vec2 aL; uniform float uTime; varying vec3 vP, vN, vO; varying vec4 vT; varying float vSh;
      void main(){
        float ca=cos(aTint.y), sa=sin(aTint.y);
        vec3 q=vec3(position.x*ca-position.z*sa, position.y, position.x*sa+position.z*ca)*vec3(1.+.3*(aTint.x-.5),1.,1.+.3*(aTint.x-.5));
        vec3 p=q*aInst.w; vO=p;
        float sw=position.y*position.y, gust=.6+.4*sin(uTime*.31+aInst.x*.021+aInst.z*.017);
        p.x+=sw*.34*gust*sin(uTime*1.1+aTint.y+aInst.x*.05); p.z+=sw*.24*gust*sin(uTime*.83+aTint.y*1.7+aInst.z*.05);
        p+=aInst.xyz; vP=p; vT=vec4(aTint.x, position.y, aL.x, aL.y); vSh=aTint.z;
        vN=vec3(normal.x*ca-normal.z*sa, normal.y, normal.x*sa+normal.z*ca);
        gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(p,1.); }`,fragmentShader:`precision highp float;
      varying vec3 vP, vN, vO; varying vec4 vT; varying float vSh; uniform vec3 uTreeA, uTreeB, uTip, uBark; uniform float uMottle, uGlow; ${ye} ${Me}
      void main(){
        float e=clamp(vT.z,0.,1.), near=1.-smoothstep(60.,170.,length(vP-uEye));
        float m=vn(vO.xz*1.1+vO.y*.8+vT.x*9.)*.6+vn(vO.xy*2.6+vO.z*1.9)*.4;                       // soft clumps of needles or leaves
        float leaf=vn(vO.xz*3.3+vO.y*2.7+vT.x*5.);
        vec3 fol=mix(uTreeA,uTreeB,vT.x)*(.84+.30*vT.y)*(.74+.52*vn(vP.xz*.035+3.));
        float firK=1.-step(.5,uMottle);                                                   // the firs: lighter, yellower needles toward the outside of every bough, so the sunlit side of the wood is green and not black
        fol=mix(fol, uTip, smoothstep(.55,1.,e)*(.16+.30*vT.x)); fol=mix(fol, mix(fol*1.7,uTip*1.15,.45), firK*smoothstep(.25,.95,e));
        fol=mix(fol, vec3(.46,.33,.055)*(.36+.50*smoothstep(.1,.9,e)), firK*step(.89,fract(vT.x*7.77))*.80*mix(.20,1.,smoothstep(-172.,-140.,vP.z-vO.z)));                 // one tree in seven is a larch, turning
        fol*=(.50+.50*smoothstep(0.,.8,e))*mix(1., .80+.40*m, (.35+.45*uMottle)*(.35+.65*near))*(gl_FrontFacing?1.:.82);   // darker deep inside the crown
        vec3 bark=uBark*(.75+.45*step(.62,fract(vP.y*1.3+vT.x*5.+m)));
        vec3 alb=mix(fol, bark, step(.5,vT.w));
        // one big soft normal for the whole crown (out from its middle), so each tree has a sunlit side and a shadow side
        float ht=vO.y/max(vT.y,.02), cy=mix(.52,.70,uMottle);
        vec3 nb=vec3(vO.x, (vT.y-cy)*ht*mix(.35,.9,uMottle)+.12*ht*.1, vO.z); nb/=max(length(nb),1e-3);
        vec3 n=mix(vN, nb, .72*(1.-step(.5,vT.w)))+vec3((m-.5)*.5,1e-3,(leaf-.5)*.5)*near; n/=max(length(n),1e-3);
        float nlr=dot(nb,uSun);
        alb*=1.+(leaf-.5)*.30*uMottle*near;
        float gust=smoothstep(.52,.86, vn(vP.xz*.028+vec2(uTime*.42,uTime*.17))*.7+vn(vP.xz*.11-vec2(uTime*.9,uTime*.3))*.3);   // wind running over the canopy turns the leaves pale
        alb*=1.+gust*(.16+.30*uMottle)*(1.-step(.5,vT.w))*smoothstep(.2,.9,e);
        float cl=.56+.44*smoothstep(.40,.58,vn(vP.xz*.014+vec2(uTime*.16,uTime*.045))*.75+vn(vP.xz*.031-vec2(uTime*.2,uTime*.05)+4.)*.25);                   // the same drifting cloud shade as the ground
        cl*=cfront(vP);
        vec3 c=vlit(alb, n, vSh*cl)+alb*uFill*.85+alb*uSunCol*uGlow*vSh*(1.-vT.w)*(.6+.8*(1.-smoothstep(-.6,.2,nlr)));        // light coming through the leaves on the far side
        gl_FragColor=vec4(vhaze(c,vP),1.); }`}),I=new e.Mesh(u,K);return I.frustumCulled=!1,I.layers.set(ze),y.add(I),o.treeKind&&o.treeKind!=="fir"&&ut(o,R,y,u.getAttribute("aInst"),u.getAttribute("aTint"),w,T),{mesh:I,count:w,inst:a,shade:$}}function ut(t,n,o,R,y,s,b){const T=t.treeKind==="birch",v=T?10:8,r=T?[.36,1,.19,.165]:[.24,1,.33,.25],c=[],p=[],C=[],u=[];for(let l=0;l<v;l++){const w=(l-.5)/(v-1),L=l===0?0:Math.sin(Math.PI*(.1+.8*w)),E=l*2.399,F=l===0?r[1]-r[3]*.55:r[0]+(r[1]-r[0]-r[3]*.9)*w,V=r[2]*L*.85,d=r[3]*(l===0?.8:.72+.42*L),A=c.length/3;for(const[g,m]of[[-1,-1],[1,-1],[1,1],[-1,1]])c.push(Math.cos(E)*V,F,Math.sin(E)*V),p.push(g,m),C.push(d,l);u.push(A,A+1,A+2,A,A+2,A+3)}const i=new e.InstancedBufferGeometry;i.instanceCount=s,i.setAttribute("position",new e.Float32BufferAttribute(c,3)),i.setAttribute("aC",new e.Float32BufferAttribute(p,2)),i.setAttribute("aS",new e.Float32BufferAttribute(C,2)),i.setAttribute("aInst",R),i.setAttribute("aTint",y),i.setIndex(u);const h=new e.ShaderMaterial({name:"pwys-leaves",fog:!1,side:e.DoubleSide,uniforms:{...n,uTreeA:{value:new e.Color(t.tree)},uTreeB:{value:new e.Color(t.tree2)},uTip:{value:new e.Color(t.treeTip||t.tree2)},uRust:{value:new e.Color(t.rust||t.tree)},uGreen:{value:new e.Color(t.green||t.tree)},uGlow:{value:t.leafGlow??.06},uCrown:{value:new e.Vector4(...r)},uMx:{value:b}},vertexShader:`
      attribute vec4 aInst; attribute vec3 aTint; attribute vec2 aC, aS; uniform float uTime; uniform vec4 uCrown;
      varying vec2 vUv; varying vec4 vT; varying vec3 vC, vNb; varying float vSh;
      float hh(float x){ return fract(sin(x*127.1)*43758.5453); }
      void main(){
        float k=aS.y, sd=aTint.x*61.7+k*7.31;
        float h1=hh(sd), h2=hh(sd+3.1), h3=hh(sd+9.7), h4=hh(sd+17.3);
        float wide=.72+.62*hh(aTint.x*33.1), tall=.78+.44*hh(aTint.x*77.7);                // each tree its own build: slender or spreading
        vec3 c=position; c.xz=c.xz*wide+(vec2(h1,h2)-.5)*uCrown.z*.9; c.y=uCrown.x+(c.y-uCrown.x)*tall+(h3-.5)*.09;
        float size=aS.x*(.68+.66*h4)*step(.22,h3+step(k,.5));                               // about a fifth of the masses are missing (never the top one)
        float ca=cos(aTint.y), sa=sin(aTint.y);
        vec3 q=vec3(c.x*ca-c.z*sa, c.y, c.x*sa+c.z*ca), p=q*aInst.w;
        float sw=c.y*c.y, gust=.6+.4*sin(uTime*.31+aInst.x*.021+aInst.z*.017);
        p.x+=sw*.34*gust*sin(uTime*1.1+aTint.y+aInst.x*.05); p.z+=sw*.24*gust*sin(uTime*.83+aTint.y*1.7+aInst.z*.05);
        p+=vec3(sin(uTime*1.7+sd), .5*sin(uTime*1.3+sd*1.7), cos(uTime*1.5+sd*.6))*.006*aInst.w;   // and every mass stirs a little on its own
        p+=aInst.xyz;
        vec3 rt=vec3(viewMatrix[0][0],viewMatrix[1][0],viewMatrix[2][0]), up=vec3(viewMatrix[0][1],viewMatrix[1][1],viewMatrix[2][1]);
        float R=size*aInst.w;
        vec4 wc=modelMatrix*vec4(p,1.); wc.xyz+=(rt*aC.x+up*aC.y)*R;
        vUv=aC; vC=p; vT=vec4(aTint.x, h1, k, R); vSh=aTint.z;
        vNb=vec3(q.x, (c.y-mix(uCrown.x,uCrown.y,.45))*.9, q.z);                            // out from the middle of the crown
        gl_Position=projectionMatrix*viewMatrix*wc; }`,fragmentShader:`precision highp float;
      varying vec2 vUv; varying vec4 vT; varying vec3 vC, vNb; varying float vSh;
      uniform vec3 uTreeA, uTreeB, uTip, uRust, uGreen; uniform float uGlow, uMx; ${ye} ${Me}
      void main(){
        float seed=vT.x*37.+vT.z*5.3, R=vT.w, r=length(vUv);
        float lob=vn(vUv*2.1+seed)*.60+vn(vUv*4.7+seed*1.7)*.40;                           // the outline of the mass: lobed
        float edge=.46+.54*lob, rn=r/max(edge,.05);
        if(rn>1.) discard;
        float near=1.-smoothstep(50.,150.,length(vC-uEye));
        vec2 lp=vUv*R*1.5+.04*vec2(sin(uTime*2.1+seed), cos(uTime*1.7+seed));              // leaves: toward the rim the mass breaks into sprays (they shiver)
        float leaf=vn(lp*2.2+seed*3.)*.6+vn(lp*5.1+seed)*.4;
        if(leaf<smoothstep(.40,1.,rn)*.66) discard;
        vec3 rt=vec3(viewMatrix[0][0],viewMatrix[1][0],viewMatrix[2][0]), up=vec3(viewMatrix[0][1],viewMatrix[1][1],viewMatrix[2][1]), bk=vec3(viewMatrix[0][2],viewMatrix[1][2],viewMatrix[2][2]);
        vec2 nu=vUv/max(edge,.05); float nz=sqrt(max(1.-dot(nu,nu),.04));
        vec3 nW=rt*nu.x+up*nu.y+bk*nz, n=vec3(nW.x*uMx,nW.y,nW.z);
        vec3 nb=vNb/max(length(vNb),1e-3);
        n=n*.55+nb*.75+vec3((leaf-.5)*.5,1e-3,(lob-.5)*.5)*near; n/=max(length(n),1e-3);
        float t=clamp(vT.x+(vT.y-.5)*.24,0.,1.);                                           // every tree its own colour, every mass a little off its tree
        vec3 fol=mix(uRust, uTreeA, smoothstep(.02,.24,t)); fol=mix(fol, uTreeB, smoothstep(.28,.62,t)); fol=mix(fol, uTip, smoothstep(.68,1.,t));
        fol=mix(fol, uGreen, step(.89,fract(vT.x*7.77))*.70);
        fol*=(.70+.55*leaf)*(.80+.40*vn(vC.xz*.035+3.))*(.60+.40*smoothstep(-.9,.3,nu.y));  // leaf by leaf; darker under each mass
        float nlr=dot(nb,uSun);
        float gust=smoothstep(.52,.86, vn(vC.xz*.028+vec2(uTime*.42,uTime*.17))*.7+vn(vC.xz*.11-vec2(uTime*.9,uTime*.3))*.3);
        fol*=1.+gust*.30;
        float cl=.56+.44*smoothstep(.40,.58,vn(vC.xz*.014+vec2(uTime*.16,uTime*.045))*.75+vn(vC.xz*.031-vec2(uTime*.2,uTime*.05)+4.)*.25);
        cl*=cfront(vC);
        vec3 c=vlit(fol,n,vSh*cl)+fol*uFill*.85+fol*uSunCol*uGlow*vSh*(.6+.8*(1.-smoothstep(-.6,.2,nlr)));
        gl_FragColor=vec4(vhaze(c,vC),1.); }`}),a=new e.Mesh(i,h);return a.frustumCulled=!1,a.layers.set(ze),o.add(a),a}function dt(t,n,o,R,y,s){const{h:b,rc:T,half:v}=n,r=t.rng.fork("pwys-rocks"),c=t.noise,p=new e.IcosahedronGeometry(1,0).getAttribute("position"),C=[],u=[],i=[],h=[],a=new e.Color,l=new e.Color(o.rock),w=new e.Color(o.rockDark),L=new e.Color(o.band||o.rock),E=new e.Vector3,F=new e.Vector3,V=new e.Vector3,d=new e.Euler,A=new e.Quaternion,g=[new e.Vector3,new e.Vector3,new e.Vector3];for(let W=0,N=0;W<o.boulders&&N<o.boulders*12;N++){const M=r.range(-222,112),j=r()<.5?-1:1,$=r()<.7,K=T(M)*.3+j*($?v(M,j)-r.range(-3,13):r.range(9,34)),I=b(K,M),S=r.range(.7,2.3)*(r()<.12?1.9:1),B=r.range(.5,.85),z=r()*50;if(d.set(r()*.5,r()*6.283,r()*.5),A.setFromEuler(d),Math.abs(K-T(M))<7||I>6||Math.abs(K)<9&&I+S>2)continue;a.copy(l).lerp(w,r()*.6).lerp(L,r()<.3?.6:0);const O=s(K,I+S,M);for(let q=0;q<p.count;q+=3){for(let D=0;D<3;D++){V.fromBufferAttribute(p,q+D);const oe=1+.32*c.n2(V.x*1.7+z,V.y*1.7+V.z*2.3);g[D].set(V.x*oe*S*1.25,V.y*oe*S*B,V.z*oe*S).applyQuaternion(A),g[D].x+=K,g[D].y+=I+S*B*.35,g[D].z+=M}E.subVectors(g[1],g[0]),F.subVectors(g[2],g[0]),E.cross(F).normalize();for(let D=0;D<3;D++)C.push(g[D].x,g[D].y,g[D].z),u.push(E.x,E.y,E.z),i.push(a.r,a.g,a.b),h.push(O)}W++}const m=new e.BufferGeometry;m.setAttribute("position",new e.Float32BufferAttribute(C,3)),m.setAttribute("normal",new e.Float32BufferAttribute(u,3)),m.setAttribute("color",new e.Float32BufferAttribute(i,3)),m.setAttribute("aSh",new e.Float32BufferAttribute(h,1)),m.setAttribute("aRk",new e.Float32BufferAttribute(new Float32Array(h.length).fill(1),1));const k=new e.Mesh(m,y);return k.frustumCulled=!1,k.layers.set(ze),R.add(k),k}function vt(t,n,o,R,y){const s=t.rng.fork("pwys-fall"),b=Math.round(n.leafFall*y),T=[],v=[],r=[],c=[];for(let i=0;i<b;i++){const h=s.range(-24,24),a=s.range(-7,23),l=s.range(-205,24),w=s(),L=i*4;for(const[E,F]of[[-1,-1],[1,-1],[1,1],[-1,1]])T.push(h,a,l),v.push(E,F),r.push(w);c.push(L,L+1,L+2,L,L+2,L+3)}const p=new e.BufferGeometry;p.setAttribute("position",new e.Float32BufferAttribute(T,3)),p.setAttribute("aC",new e.Float32BufferAttribute(v,2)),p.setAttribute("aS",new e.Float32BufferAttribute(r,1)),p.setIndex(c);const C=new e.ShaderMaterial({name:"pwys-leaffall",fog:!1,side:e.DoubleSide,uniforms:{...o,uTreeB:{value:new e.Color(n.tree2)},uTip:{value:new e.Color(n.treeTip||n.tree2)},uRust:{value:new e.Color(n.rust||n.tree)}},vertexShader:`
      attribute vec2 aC; attribute float aS; uniform float uTime; varying vec2 vUv; varying vec3 vC; varying float vS;
      float hh(float x){ return fract(sin(x*127.1)*43758.5453); }
      void main(){
        float sd=aS*91.; vec3 c=position;
        c.y=-7.+mod(c.y+7.-uTime*(.9+.8*hh(sd)), 30.);                                      // down, and round again from the top
        c.x=-24.+mod(c.x+24.+uTime*.7+1.4*sin(uTime*(.7+hh(sd+1.))+sd), 48.);                // sideways on the wind, swinging
        c.z+=1.1*sin(uTime*(.5+hh(sd+2.))+sd*3.);
        vec4 wc=modelMatrix*vec4(c,1.);
        vec3 rt=vec3(viewMatrix[0][0],viewMatrix[1][0],viewMatrix[2][0]), up=vec3(viewMatrix[0][1],viewMatrix[1][1],viewMatrix[2][1]);
        float R=max(.10+.06*hh(sd+5.), length(wc.xyz-cameraPosition)*.0034);                // never under about two pixels${st?`
        R*=smoothstep(.6,2.5,length(wc.xyz-cameraPosition));                                // [C1-LEAF] the near law: size only, by the distance from the leaf's centre to the eye of the pass that draws it`:""}${rt?`
        R*=smoothstep(0.,2.,23.-c.y)*smoothstep(0.,2.,c.y+7.);                              // [C2-LID] the leaf's own wrapped height, 23 the lid and -7 the floor of its wrap (the line c.y=-7.+mod(..., 30.) above): it grows in over its first two metres under the lid and goes out over its last two above the floor; nothing of the eye, the route, the clock's phase or the seed`:""}
        float sp=uTime*(2.+3.*hh(sd+7.))+sd, cs=cos(sp), sn=sin(sp);
        vec2 q=vec2(aC.x*(.35+.65*abs(cos(sp*.7))), aC.y*.62); q=vec2(q.x*cs-q.y*sn, q.x*sn+q.y*cs);   // it turns over as it falls
        wc.xyz+=(rt*q.x+up*q.y)*R;
        vUv=aC; vC=c; vS=hh(sd+11.);
        gl_Position=projectionMatrix*viewMatrix*wc; }`,fragmentShader:`precision highp float;
      varying vec2 vUv; varying vec3 vC; varying float vS; uniform vec3 uTreeB, uTip, uRust; ${ye} ${Me}
      void main(){
        if(dot(vUv,vUv)>1.) discard;
        vec3 alb=mix(mix(uRust,uTreeB,smoothstep(.0,.35,vS)), uTip, smoothstep(.5,1.,vS));
        vec3 c=alb*(uSunCol*.62+uFill*1.1);
        gl_FragColor=vec4(vhaze(c,vC),1.); }`}),u=new e.Mesh(p,C);return u.frustumCulled=!1,u.layers.set(ze),R.add(u),u}function mt(t,n,o){const R=[[3.5,-4.5,-221,15,6.5,.55,0],[-58,44,-158,62,17,.42,.9],[14,-1.5,-118,46,6.5,.3,.25]],y=[],s=[],b=[],T=[];R.forEach(([p,C,u,i,h,a,l],w)=>{const L=Math.cos(l),E=Math.sin(l),F=w*4;for(const[V,d]of[[-1,-1],[1,-1],[1,1],[-1,1]])y.push(p+V*i*L,C+d*h,u+V*i*E),s.push(V,d),b.push(w*3.7,a);T.push(F,F+1,F+2,F,F+2,F+3)});const v=new e.BufferGeometry;v.setAttribute("position",new e.Float32BufferAttribute(y,3)),v.setAttribute("uv",new e.Float32BufferAttribute(s,2)),v.setAttribute("aS",new e.Float32BufferAttribute(b,2)),v.setIndex(T);const r=new e.ShaderMaterial({name:"pwys-mist",fog:!1,side:e.DoubleSide,transparent:!0,depthWrite:!1,uniforms:{...n,uMist:{value:t.mist??1}},vertexShader:"attribute vec2 aS; varying vec2 vUv, vS; varying vec3 vP; void main(){ vUv=uv; vS=aS; vP=position; gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.); }",fragmentShader:`precision highp float;
      varying vec2 vUv, vS; varying vec3 vP; uniform float uMist; ${ye} ${Me}
      void main(){
        float r=dot(vUv,vUv);
        float body=fbm(vUv*vec2(2.6,1.5)+vec2(uTime*.035+vS.x, -uTime*.02))*.75+fbm(vUv*vec2(6.,3.4)-vec2(uTime*.06, vS.x))*.25;      // it drifts and thins
        float a=(1.-smoothstep(.15,1.,r))*smoothstep(.30,.72,body)*vS.y*uMist*(1.-smoothstep(-.2,1.,vUv.y)*.55)*smoothstep(18.,60.,length(vP-uEye));   // a veil thins as you come up to it (no grey smear over the near pines)
        float sd=max(dot(normalize(vP-uEye+vec3(0.,1e-3,0.)),uSun),0.);
        gl_FragColor=vec4(uHaze*(1.05+.25*sd), a); }`}),c=new e.Mesh(v,r);return c.frustumCulled=!1,c.renderOrder=5,c.layers.set(ze),o.add(c),c}function pt(t,n,o,R,y,s){const{rc:b}=n,T=[],v=[],r=[],c=[],p=170;for(let h=0;h<=p;h++){const a=ge(214,-226,h/p),l=1,w=b(a-l)-b(a+l),L=-2*l,E=1/Math.hypot(w,L),F=-L*E,V=w*E,d=3.6,A=s(b(a),-7.55,a);if(T.push(b(a)-F*d,-7.55,a-V*d,b(a)+F*d,-7.55,a+V*d),v.push(-1,-a,1,-a),r.push(A,A),h<p){const g=h*2;c.push(g,g+1,g+2,g+1,g+3,g+2)}}const C=new e.BufferGeometry;C.setAttribute("position",new e.Float32BufferAttribute(T,3)),C.setAttribute("uv",new e.Float32BufferAttribute(v,2)),C.setAttribute("aSh",new e.Float32BufferAttribute(r,1)),C.setIndex(c);const u=new e.ShaderMaterial({name:"pwys-river",fog:!1,side:e.DoubleSide,uniforms:{...R,uRiver:{value:new e.Color(o.river)},uSkyRef:{value:new e.Color(o.sky)}},vertexShader:"attribute float aSh; varying vec3 vP; varying vec2 vUv; varying float vSh; void main(){ vP=position; vUv=uv; vSh=aSh; gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.); }",fragmentShader:`precision highp float;
      varying vec3 vP; varying vec2 vUv; varying float vSh; uniform vec3 uRiver, uSkyRef; ${ye} ${Me}
      void main(){
        float fl=vUv.y+uTime*3., ax=abs(vUv.x);                                            // toward us at 3 m/s
        float warp=vn(vec2(fl*.15,vUv.x*1.3));
        float rip=vn(vec2(vUv.x*3.+warp*1.5, fl*.22)), rip2=vn(vec2(vUv.x*9.-1.3, fl*.7+warp));
        float cf=cfront(vP);
        vec3 light=uSunCol*.50*vSh*cf+uFill*.95;
        vec3 c=mix(uRiver*.40, mix(uRiver, uSkyRef, .45)*1.05, .25+.65*rip)*light;         // dark where it runs deep, sky where it lies flat
        float riffle=smoothstep(.55,.85,vn(vec2(vUv.x*2.3+5., vUv.y*.06)))*smoothstep(.45,.8,rip2);   // broken water over the shallows
        c=mix(c, vec3(.92,.96,.98)*light, riffle*.5);
        float gl=smoothstep(.64,.90,vn(vec2(vUv.x*7., fl*.9)))*smoothstep(.25,.75,rip2)*(1.-smoothstep(.6,1.,ax));
        c+=uSunCol*(gl*1.5+.05)*vSh*vSh*cf*cf;                                                    // the sun on it: a sheet of light with sparks in it
        float edge=smoothstep(.70,.99,ax+.22*(vn(vec2(vUv.x*4., fl*.5))-.5));              // a lace of foam and wet stones along the banks
        c=mix(c, mix(uRiver*.30*uFill, vec3(.9,.94,.96)*light, smoothstep(.4,.7,rip2)), edge*.7);
        gl_FragColor=vec4(vhaze(c,vP),1.); }`}),i=new e.Mesh(C,u);return i.frustumCulled=!1,i.layers.set(ze),y.add(i),i}function wt(t,n,o,R){const y=new e.ShaderMaterial({name:"pwys-sky",fog:!1,side:e.BackSide,depthWrite:!1,depthTest:!1,uniforms:{...o,uSkyLow:{value:new e.Color(n.sky)},uSkyTop:{value:new e.Color(n.skyTop)},uCloud:{value:new e.Color(n.cloud)}},vertexShader:"varying vec3 vD; void main(){ vD=position; gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.); }",fragmentShader:`precision highp float;
      varying vec3 vD; uniform vec3 uSkyLow, uSkyTop, uCloud; ${ye} ${Me}
      void main(){
        vec3 d=normalize(vD); float up=max(d.y,0.);
        vec3 c=mix(uHaze, uSkyLow, smoothstep(0.,.22,up)); c=mix(c, uSkyTop, smoothstep(.2,.95,up));
        float sd=max(dot(d,uSun),0.); c+=uSunCol*(.10*sd*sd*sd*sd);
        float az=atan(d.x, -d.z+1e-5);                                                     // three slow cumulus over the head of the valley
        for(int i=0;i<3;i++){ float fi=float(i);
          vec2 cc=vec2(-.75+.8*fi+uTime*.0035, .33+.09*sin(fi*2.3)); vec2 q=(vec2(az,d.y)-cc)/vec2(.34,.11);
          float m=1.-dot(q,q); float nn=fbm(vec2(az*7.+fi*9.+uTime*.01, d.y*11.));
          float dn=smoothstep(.0,.35, m*.6+ (nn-.45)*.9* step(0.,m+1.) ) * smoothstep(-1.2,.2,m);
          float lit=.62+.38*smoothstep(-.6,.9,q.y+nn*.6);
          c=mix(c, uCloud*lit*(uSunCol*.6+uFill*.55), dn*.92); }
        gl_FragColor=vec4(c,1.); }`}),s=new e.Mesh(new e.SphereGeometry(1900,24,12),y);return s.frustumCulled=!1,s.renderOrder=-10,s.layers.set(ze),R.add(s),s}const je=`
  varying vec3 vP, vN;
  void main(){ vP=position; vN=normal; gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.); }`,Je=Math.floor(we.lowTo/we.go)*we.go,Se=t=>t.toFixed(1),xt=`uniform vec2 uStair;                                                    // [F5-STAIR] z of the first riser; metres the flank stands out from wall W
  const float SGO=${Se(we.go)}, SRISE=${Se(we.rise)}, SNA=${Se(we.lower)}, SNB=${Se(Math.ceil((Je-we.farZ)/we.go))}, SZT=${Se(Je)}, SZF=${Se(we.farZ)};
  float footLaw(float h){ h=max(h,0.); return 1.-.20*exp(-h/1.5)-.10*exp(-h/.25); }                    // live's foot shade of a wall, by the height over what it stands on
  float stairZ(float j){ return j<=SNA? uStair.x-SGO*(j-1.) : SZT-SGO*(j-SNA-1.); }                   // z of riser j (1 ..)
  float stairN(float z){ return z>uStair.x? 0. : (z>SZT? min(floor((uStair.x-z)/SGO)+1., SNA) : SNA+min(floor((SZT-z)/SGO)+1., SNB)); }   // risers at or north of z: the tread under z
  float stairProfD(float z, float y){ float j=stairN(z), dv=y-SRISE*j, dz=j<SNA+SNB? z-stairZ(j+1.) : 1e3, dy=y-SRISE*(j+1.);      // metres from a point over the stair to its profile:
    return min(dv, dy>0.? length(vec2(dz,dy)) : dz); }                                               // the tread below, the next riser to the south (or its top edge)
  `,yt=`if(p.y>.5){ float j=floor(p.y/SRISE+.5); if(j<SNA+SNB) dm=min(dm, max(p.z-stairZ(j+1.),0.)); }      // [F5-STAIR] a tread: to the riser at its back (the tread is known by its height)
      else if(p.z<uStair.x+20. && p.x<xw+40.) dm=min(dm, length(max(vec2((p.x-xw)/WLEN-uStair.y, p.z-uStair.x),0.)));          // [F5-STAIR] the floor: to the stair's foot (first riser, flank)
      `,bt=`if(p.z<uStair.x+12. && p.z>SZF-.5 && dW<uStair.y+60.){ float fy=p.y, dS=dW-uStair.y;                 // [F5-STAIR] dS<=0: between wall W and the flank (.01 m is for rounding only)
        if(n.z>.5 && dS<.01){ if(p.z>SZF+1.){ float j=p.z>SZT+1.? floor((uStair.x-p.z)/SGO+.5) : SNA+floor((SZT-p.z)/SGO+.5); fy=p.y-SRISE*j; }      // a riser stands on the tread before it
          else fy=p.y-SRISE*(SNA+SNB); }                                                                                       // the far wall stands on the top landing
        else if(n.z>.5){ float top=SRISE*(SNA+SNB); if(p.z<SZF+1.) dc=min(dc, p.y<top? dS : length(vec2(dS,p.y-top))); }       // the far wall beside the stair: its inside corner with the flank
        else if(dW<.5) fy=max(stairProfD(p.z,p.y),0.);                                                                         // wall W over the stair: it stands on the treads and meets the risers
        else if(abs(dS)<.5) dc=min(dc, max(p.z-SZF,0.));                                                                       // the flank: its inside corner with the far wall
        tone*=footLaw(fy)/footLaw(p.y); }                                                                                      // live's foot shade (two lines on) taken from the floor and given to the stair's own level
      `,gt=`uniform vec2 uFarP;                                                     // [F5-PIERS] x of the first and of the last pier's middle
  const float FPH=${Se(xe.half)}, FPP=${Se(xe.proud)}, FPM=${Se(xe.module)}, FPZ=${Se(xe.farZ)};
  float farPierX(float x){ return x-uFarP.x-FPM*clamp(floor((x-uFarP.x)/FPM+.5), 0., floor((uFarP.y-uFarP.x)/FPM+.5)); }      // metres east of the nearest pier's middle
  `,St=`if(p.z<FPZ+30.) dm=min(dm, boxD(vec2(farPierX(p.x), p.z-FPZ-.5*FPP), vec2(FPH,.5*FPP)));          // [F5-PIERS] the flags round a pier's foot
      `,zt=`if(p.z<FPZ+FPP+.1){ float fx=abs(farPierX(p.x))-FPH;                                               // [F5-PIERS]
        if(n.z>.5 && p.z<FPZ+.1 && fx>0.) dc=min(dc, fx);                                                                      // the far wall beside a pier
        else if(abs(n.x)>.5 && abs(fx)<.1) dc=min(dc, max(p.z-FPZ,0.)); }                                                      // a pier's flank, where it meets the wall
      `,kt=`precision highp float;
  uniform float uK, uTime; uniform vec3 uPlaster, uFlag, uDay, uMouth; uniform vec3 uBird[3], uBirdV[3]; uniform vec4 uFin[5]; uniform float uShR; uniform vec4 uWN[5], uWX[5]; uniform vec3 uSkyL;
  ${ye}
  const float SLOPE=0.0813953, WLEN=1.0033071, XB=${f.XB.toFixed(1)}, XE=${f.XE.toFixed(1)}, SL0=${(f.XB-8).toFixed(1)}, SL1=${(f.XE-64).toFixed(1)}; const float FSH=.42; const vec4 PA=vec4(23.5,-168.,4.,4.), PB=vec4(7.38256,-262.41563,7.,5.), PBR=vec4(0.9967038,0.0811271,0.0811271,-0.9967038);
  // daylight from arm two: tone by facing, never darker than a cool grey, the wedge across arm one's floor, pools under
  // the six skylights, and a soft darkening where floor, walls and piers meet (so every edge shows as a step of tone)
  float slotZ(vec3 p, float a, float b){ float zc=p.x<XB?-315.:-262., hw=p.x<XB?25.:78.; return 1.-smoothstep(hw*a, hw*b, abs(p.z-zc)); }   // the skylights' reach across the arm and the room
  float boxD(vec2 q, vec2 h){ vec2 d=abs(q)-h; return length(max(d,0.))+min(max(d.x,d.y),0.); }
  // DAYLIGHT THAT FALLS. The skylight has a direction (uSkyL points up into it: from beyond the row of cut walls, toward us).
  // Each wall throws a long shadow over the flags, soft with distance, and its hole lets an ellipse of light through:
  // the ray from p toward the light meets each wall's plane; it is stopped there if it lands on the slab and outside
  // the cone from L that cuts the hole. The first wall met decides (each bay is lit from its own skylights).
  const vec3 LP=vec3(${f.L[0].toFixed(1)},${f.L[1].toFixed(1)},${f.L[2].toFixed(1)}); const float EZ=${f.E[2].toFixed(1)}, CEILY=${f.ceil.toFixed(1)};
  float wallShadow(vec3 p, out float tHit){
    float acc=0., S=0.; tHit=0.; float pxw=.7*length(fwidth(p));                             // a pixel on this surface, in metres (taken before the loop)
    for(int i=0;i<5;i++){
      float dn=dot(uWN[i].xyz,uSkyL); dn=abs(dn)<1e-3?1e-3:dn;
      float t=-(dot(uWN[i].xyz,p)+uWN[i].w)/dn;
      if(t>.02){ vec3 h=p+uSkyL*t; float w=max(.03+.0087*t, pxw);                                // half the edge's width: a slot shows a patch of sky a degree across (1.7 cm of edge per metre of throw), where it was 4.8 cm per metre and every shade a blur
        float inx=smoothstep(-w,w, dot(h.xz,uWX[i].xy)-uWX[i].z)*(1.-smoothstep(CEILY-w*1.6, CEILY+w*1.6, h.y));
        vec3 dl=h-LP; float dz=max(dl.z,1e-2), tt=(EZ-LP.z)/dz; float rr=length(dl.xy*tt);
        float blk=smoothstep(-w,w,(rr-uWX[i].w)*dz/(EZ-LP.z));
        float k=(1.-acc)*inx; S+=k*blk; tHit+=k*t; acc+=k; } }
    return S; }
  // THE SLOTS THROW SUN. A point is in a bar of sun if its ray toward the light leaves through one of the five slots.
  float slotBar(vec3 p){ float t=(CEILY-p.y)/uSkyL.y; vec3 c=p+uSkyL*t; float w=.25+.006*t;      // the bar's soft edge stays well inside one flag (3 m): 0.9 m at the floor, where it was 1.6 m a side and a bar was a blur
    float sl=abs(fract((c.x-SL0)/30.)-.5)*30.;
    return (1.-smoothstep(3.-w,3.+w,sl))*step(SL0-6.,c.x)*step(c.x,SL1)*smoothstep(-342.-w,-338.+w,c.z)*(1.-smoothstep(-186.-w,-182.+w,c.z)); }
  float shwIn(vec3 p){ float m=0.;                                                       // 1 within about 50 m downstream of a cut wall (where its hole's ellipse lies)
    for(int i=0;i<5;i++){ float dn=dot(uWN[i].xyz,uSkyL); dn=abs(dn)<1e-3?1e-3:dn; float t=-(dot(uWN[i].xyz,p)+uWN[i].w)/dn;
      vec3 h=p+uSkyL*t; float inx=step(0.,dot(h.xz,uWX[i].xy)-uWX[i].z)*step(.02,t)*(1.-smoothstep(40.,62.,t)); m=max(m,inx); }
    return m; }
  // WHAT A PIER HIDES OF THE MOUTH OF ARM TWO. Arm one has its daylight from the mouth: the opening in the plane x 72 between the corner of
  // the L (z -280) and the far wall (z -350). From a point of the floor the mouth is an arc of bearings, measured from the mouth's own
  // normal (+x); every ray to it runs toward +x. A pier (floor to ceiling, so the matter is flat) stops exactly the rays that meet the part
  // of it lying beyond the point toward the mouth: so the pier is cut at the point's own line (the plane x = the point's x; PIN, a
  // millimetre, only keeps a division off zero) and the arc is that of what is left: its corners, and where its edges cross that line.
  // A pier beside or behind the point is cut away whole and hides nothing; floor that sees the whole mouth is lit on whichever side of a
  // pier it lies. The share of the mouth left is the light left: an umbra close behind the pier, a penumbra widening with distance. The
  // two piers' arcs are added: no point of arm one's floor has both between itself and the mouth (pier B stands against wall W, west of A).
  // Checked against a plain ray test on the floor's own metres: shots/painted-where-you-stood/flight2/tmp/piershade.mjs.
  const float PIN=1e-3;
  vec2 pierCorner(int k, vec4 box, vec4 rot){ vec2 q=vec2(k<2?-box.z:box.z, (k==0||k==3)?-box.w:box.w); return box.xy+rot.xy*q.x+rot.zw*q.y; }
  float pierHides(vec2 p, vec4 box, vec4 rot, float a0, float a1){
    float lo=9., hi=-9.; vec2 a=pierCorner(3,box,rot)-p;
    for(int k=0;k<4;k++){ vec2 b=pierCorner(k,box,rot)-p;                                // the edge from corner a to corner b
      if(a.x>PIN){ float t=atan(a.y/a.x); lo=min(lo,t); hi=max(hi,t); }                  // a corner beyond the point's line: its bearing
      if((a.x-PIN)*(b.x-PIN)<0.){ float d=b.x-a.x; d=abs(d)<1e-6?(d<0.?-1e-6:1e-6):d;    // an edge that crosses the line: the bearing of the crossing
        float t=atan((a.y+(b.y-a.y)*clamp((PIN-a.x)/d,0.,1.))/PIN); lo=min(lo,t); hi=max(hi,t); }
      a=b; }
    return max(min(hi,a1)-max(lo,a0), 0.); }                                             // nothing beyond the line: hi < lo, nothing hidden
  float mouthSeen(vec2 p){ if(p.x>71.) return 1.;                                        // the mouth lights arm one; beyond it the skylights do
    float mx=max(72.-p.x,1.); float a0=atan((-280.-p.y)/mx), a1=atan((-350.-p.y)/mx); float lo=min(a0,a1), hi=max(a0,a1), span=max(hi-lo,1e-3);
    float hid=pierHides(p,PA,vec4(1.,0.,0.,1.),lo,hi)+pierHides(p,PB,PBR,lo,hi);
    return clamp(1.-hid/span, 0., 1.); }
  // A JOINT OF THE FLAGS, AS BUILT. Its section, across the joint: an open bed JW wide and as deep as it is wide, and on each side the
  // flag's arris eased at 45 degrees over half the bed's width. Nothing here is a strength chosen by eye: each of the three faces takes
  // the hall's light as its own facing lets it. The hall's light at a point of the floor is the even light of the room (1 on the flat)
  // and the daylight that has a direction (from the mouth of arm two in arm one, from the skylights in arm two), DN times the even light
  // when it falls square on a face: the walls' own two tones, .82 turned to it and .47 turned away, say how much ((.82-.47)/.47).
  //   the flat of the flag:            1 + DN*lit*sinE                        (sinE: the daylight's height over the floor at this point)
  //   an eased arris, 45 degrees:      AC + DN*lit*(sinE +- cosE*al)/sqrt(2)  (AC = (1+cos 45)/2, the share of the room a face tipped 45 degrees sees;
  //                                    + on the arris turned to the light, the lit lip; - on the one turned from it, never under 0)
  //   the bed:                         AB + DN*lit*sinE*(1 - sh)              (AB = sqrt(2)-1, the share of the room seen from the bottom of a groove as deep as
  //                                    wide; sh = the share of the bed in the shade the lightward arris throws = cotE*al, at most 1)
  // lit = the share of that daylight not stopped on its way here (by a pier, by a cut wall). Each face is drawn at its true width and
  // weighted by the share it covers of the picture element it falls in (a box one and a half elements across: the brief's own floor
  // for a thin thing), so a joint goes to the flags' mean tone with distance by itself, whatever the picture's size.
  const float JW=.024, DN=.745, AC=.854, AB=.414;                                        // JW in flags: 7.2 cm, live's joint
  float cover(float a, float b, float t, float h){ return clamp((min(b,t+h)-max(a,t-h))/(2.*h), 0., 1.); }
  float flagJoint(float tq, float fw, float al, float sinE, float cosE, float lit){
    float h=max(.75*fw, 1e-5), w=.5*JW, flat_=1.+DN*lit*sinE, r2=.70711;
    float lip=AC+DN*lit*(sinE+cosE*al)*r2, away=AC+DN*lit*max(sinE-cosE*al,0.)*r2;
    float sh=min(cosE*al/max(sinE,.05), 1.), bed=AB+DN*lit*sinE*(1.-sh);
    return 1.+(cover(-w,w,tq,h)*(bed-flat_)+cover(w,2.*w,tq,h)*(away-flat_)+cover(-2.*w,-w,tq,h)*(lip-flat_))/flat_; }
  ${Fe?xt:""}${Le?gt:""}vec3 hallShade(vec3 n, vec3 p, out float joint, out vec2 blk){
    float sunW=0.; blk=vec2(.5,0.);
    vec2 b0=vec2((abs(n.x)>.5?p.z:p.x)/6., p.y/3.), bfw=fwidth(b0);                       // the walls and piers are built in courses: blocks 6 m by 3 m, the flags' ruler going on up the walls
    vec3 tl=uMouth-p; float dl=length(tl); tl/=max(dl,1e-3);
    float tone=mix(.47,.82,smoothstep(-.6,.7,dot(n,tl)));
    joint=1.;
    float xw=-21.-SLOPE*p.z;
    float cs=smoothstep(.52,.70, vn(vec2((p.x*.5-p.z*.86-uTime*8.)*.04, (p.x*.86+p.z*.5)*.022)));       // cloud shade crossing the skylights (8 m/s: the brief's 2 m/s read as frozen)
    float arm2=smoothstep(60.,84.,p.x);
    if(n.y>.5){ tone=.74;
      vec2 g=p.xz/3.; vec2 fw=fwidth(g);
      float fade=1.-smoothstep(.02,.12,max(fw.x,fw.y));                                 // joints go to their mean tone before they alias
      float fade2=1.-smoothstep(.10,.42,max(fw.x,fw.y));                             // each flag its own stone: told apart until a flag is two pixels
      float ftone=1.+(h21(floor(g))-.5)*mix(.10*fade,.06*fade2,arm2);                      // each flag its own stone (live's)
      vec2 m=p.xz-vec2(72.,-315.); float along=-m.x*.86+m.y*.5, across=m.x*.5+m.y*.86;      // the wedge from the mouth of arm two
      // its edge is the shade of the mouth's two jambs: one flag (3 m) wide where it leaves the mouth, wider by 4 cm a metre as it goes
      float wl=22.+max(along,0.)*.18; float wedge=(1.-smoothstep(wl, wl+3.+max(along,0.)*.04, abs(across)))*smoothstep(-10.,20.,along)*(1.-smoothstep(120.,260.,along));
      // THE PIERS STAND IN THAT DAYLIGHT. Floor from which a pier hides the mouth has lost the wedge, and of the plain daylight keeps what
      // a face turned away from arm two keeps (the brief's 0.62 against the floor's 0.74)
      float seen=mix(mouthSeen(p.xz), 1., arm2);
      tone*=mix(.62/.74, 1., seen)*(1.+.18*wedge*seen*(1.-.85*cs));
      float sl=abs(fract((p.x-SL0)/30.)-.5)*30.;                                            // pools under the skylights
      float pool=exp(-sl*sl/36.)*step(SL0-6.,p.x)*step(p.x,SL1)*slotZ(p,.64,1.28);
      float tH; float shw=wallShadow(p,tH)*smoothstep(XB-12.,XB+6.,p.x);                   // the cut walls' long shadows, with the ellipse of light each hole lets through
      float open_=1.-shw, day=1.-.70*cs;                                                   // cloud shade: the shadows fade and return
      tone*=(1.+.46*pool*day*(.35+.65*open_))*(1.-(.11+.05*arm2)*cs)*(1.-.07*arm2);
      float si=shwIn(p);                                                                   // open floor is in plain daylight; the sun itself lands in the holes' ellipses and in the bars under the slots
      tone*=1.+arm2*(day*(.20+.26*si)*open_-(.30-.08*smoothstep(50.,120.,tH))*shw*(.4+.6*day));
      float bar=slotBar(p)*open_*arm2*day; tone*=1.+.60*bar;
      // THE RULER UNDER THE PAINT, AS RELIEF. The daylight at this point: its height and bearing (toward the mouth of arm two in arm one, up into
      // the skylights in arm two) and how much of it arrives (what a pier leaves of the mouth; what a cut wall does not stop).
      vec3 l3=mix(tl, uSkyL, arm2); float cosE=max(length(l3.xz),1e-3), sinE=clamp(l3.y/max(length(l3),1e-3), .05, 1.); vec2 ld=l3.xz/cosE; cosE=sqrt(max(1.-sinE*sinE,0.));
      vec2 tq=(fract(g+.5)-.5)*vec2(ld.x<0.?-1.:1., ld.y<0.?-1.:1.);                      // from each joint's middle, positive toward the light
      float lit=mix(seen, open_, arm2);
      joint=flagJoint(tq.x,fw.x,abs(ld.x),sinE,cosE,lit)*flagJoint(tq.y,fw.y,abs(ld.y),sinE,cosE,lit)*ftone;
      sunW=arm2*max(bar, .62*open_*si*day);
      float dR=p.z>-280.? (p.x<XB-4.? (xw+70.*WLEN-p.x)/WLEN : min(p.x-XB, XE-p.x)) : (p.x>72.? (p.x<XB? -280.-p.z : min(length(p.xz-vec2(XB,-280.)), XE-p.x)) : length(p.xz-vec2(72.,-280.)));
      vec2 qb=p.xz-PB.xy; qb=vec2(dot(qb,PBR.xy),dot(qb,PBR.zw));
      float dm=min(min((p.x-xw)/WLEN, dR), min(p.z+350., min(boxD(p.xz-PA.xy,PA.zw), boxD(qb,PB.zw))));
      ${Fe?yt:""}${Le?St:""}for(int i=0;i<5;i++){ vec2 a=uFin[i].xy, ab=uFin[i].zw-a; vec2 ap=p.xz-a;                 // where the five cut walls stand on the floor
        float h=clamp(dot(ap,ab)/max(dot(ab,ab),1e-4),0.,1.); dm=min(dm, max(length(ap-ab*h)-.25,0.)); }
      tone*=1.-.26*exp(-max(dm,0.)/1.5)-.10*exp(-max(dm,0.)/.25); }
    else if(n.y<-.5){ tone=.68*(1.-(.07+.05*arm2)*cs); }
    else { vec2 qc=p.xz-PB.xy; qc=vec2(dot(qc,PBR.xy),dot(qc,PBR.zw)); float dW=(p.x-xw)/WLEN, dB=boxD(qc,PB.zw);
      float dc=min(dW>.06?dW:1e3, dB>.06?dB:1e3);                                           // the inside corner of wall and pier: a dark plumb line
      ${Fe?bt:""}${Le?zt:""}tone*=1.-.22*exp(-dc/1.6)-.16*exp(-dc/.22);
      tone*=(1.-.20*exp(-max(p.y,0.)/1.5)-.10*exp(-max(p.y,0.)/.25))*(1.-.08*exp(-max(48.-p.y,0.)/3.))*(.97+.03*smoothstep(0.,30.,p.y)); tone*=1.-(.13+.04*arm2)*cs;
      float sl=abs(fract((p.x-SL0)/30.)-.5)*30.; float bay=exp(-sl*sl/90.)*step(SL0-12.,p.x)*step(p.x,SL1+6.);            // a wash of light down the wall under each skylight
      tone*=1.+arm2*(.26*bay*smoothstep(4.,48.,p.y)*(1.-.85*cs)-.08);
      float bar=slotBar(p)*arm2*smoothstep(0.,.35,dot(n,uSkyL))*(1.-.85*cs); tone*=1.+.85*bar; sunW=bar;
      vec2 bb=vec2(b0.x+.5*mod(floor(b0.y),2.), b0.y), ba=abs(fract(bb)-.5);
      float bfade=1.-smoothstep(.07,.22,max(bfw.x*2.,bfw.y)); vec2 bw=max(vec2(.007,.014), bfw*.9);                             // the joints go to their mean tone before they alias
      float bj=max(smoothstep(.5-bw.x-max(bfw.x,1e-6),.5-bw.x,ba.x), smoothstep(.5-bw.y-max(bfw.y,1e-6),.5-bw.y,ba.y))*bfade;      // a joint is never thinner than two pixels
      tone*=(1.-mix(.05,.06,arm2)*bj)*(1.+(h21(floor(bb)+2.3)-.5)*mix(.06,.025,arm2)*(.3+.7*bfade));                // all through the hall: under the paint too, so a cliff is seen to lie on a wall (joints never deeper than the flags' 6 percent: a white wall first)
      blk=vec2(h21(floor(bb)+5.1), bfade); }                                              // the block this point is in, for the paint it took (the round's one line here; live's closing brace stands after it)
    float sh=0.;                                                                          // swallow shadows along the daylight
    for(int i=0;i<3;i++){ vec3 r=p-uBird[i]; float al=dot(r,uDay); vec3 pr=r-uDay*al;
      vec3 f=uBirdV[i]-uDay*dot(uBirdV[i],uDay); f/=max(length(f),1e-3); vec3 sd=cross(uDay,f);
      float rad=((i==1?uShR:.85)+.014*max(al,0.))*1.25, a=dot(pr,f)/rad, b=abs(dot(pr,sd))/rad;      // half the span of the shadow, soft with distance
      float wd=max(abs(a-(.16-.80*b*b))-(.17*(1.-b)+.03), b-1.);                                   // swept wings
      float bd=length(vec2((a+.10)/.55, b/.12))-1.;                                              // body and tail
      float dd=min(wd, bd*.12), soft=.05+.0025*max(al,0.);
      sh=max(sh, (1.-smoothstep(-soft, soft, dd))*step(0.,al)*(1.-smoothstep(30.,70.,al))); }
    tone*=1.-.52*sh;
    float a2=smoothstep(60.,84.,p.x);
    // arm two: decided light, the steps of tone half again as deep. The flags stay a PALE floor in shade (the shadows on them are
    // shallower than on plaster; the daylight on them is as it was), and the shade is a cool grey, not a blue: arm two has no colour of its own
    float fl=step(.5,n.y);
    tone=mix(tone, mix(max(.40, .74+(tone-.74)*1.55), mix(max(FSH,.74+(tone-.74)*1.12), .74+(tone-.74)*1.55, step(.74,tone)), fl), a2);
    vec3 tint=mix(mix(vec3(.86,.915,1.), mix(vec3(.695,.795,.97), vec3(.82,.90,1.02), fl), a2), mix(vec3(1.,.992,.965), vec3(.985,.995,1.), a2), smoothstep(.56,.84,tone));
    tint=mix(tint, vec3(1.03,1.06,1.10), .72*sunW);                                        // where the daylight itself lands: a clear cool white (no sun, no colour in the hall)
    return tint*tone; }
`,Mt=`${kt}
  varying vec3 vP, vN;
  uniform sampler2D tPaint; uniform mat4 uProj; uniform vec3 uO, uRingCol, uSea1, uSea2, uFallCol, uSwiftCol;
  uniform vec4 uRing, uPA, uPB, uPBrot; uniform vec4 uSwift[7]; uniform vec3 uSwiftV[7]; uniform float uFallZ, uBrush, uStop;
  bool segBox(vec2 o, vec2 p, vec4 box, vec4 rot){
    vec2 a=o-box.xy, b=p-box.xy; a=vec2(dot(a,rot.xy),dot(a,rot.zw)); b=vec2(dot(b,rot.xy),dot(b,rot.zw));
    vec2 dir=b-a; dir=vec2(abs(dir.x)<1e-5?1e-5:dir.x, abs(dir.y)<1e-5?1e-5:dir.y);
    vec2 t1=(-box.zw-a)/dir, t2=(box.zw-a)/dir; vec2 lo=min(t1,t2), hi=max(t1,t2);
    float tn=max(lo.x,lo.y), tf=min(hi.x,hi.y);
    return tn<tf && tn<.997 && tf>0.; }
  void main(){
    vec3 n=normalize(vN+vec3(0.,1e-5,0.)), p=vP;
    vec3 od=p-uO; float dist=length(od); vec3 d=od/max(dist,1e-3);
    float apx=length(fwidth(d))+1e-6;                                                   // radians per pixel, in projector space
    vec2 gfl=p.xz/3., gfw=fwidth(gfl);                                                   // the flags, 3 m square (derivative taken here, before any loop)
    // BRUSHWORK (only once the hall is lit: everything here is weighted by uK). The surface is laid out in patches about
    // 3 m across, each painted in one direction (the surface's own, turned by chance: see below); a patch is rows of dabs, and every dab is ONE flat colour: the picture looked up at the dab's centre.
    vec3 t1=abs(n.y)>.5?vec3(1.,0.,0.):normalize(vec3(-n.z,0.,n.x)+vec3(1e-5,0.,0.)), t2=cross(n,t1);
    vec2 s=vec2(dot(p,t1),dot(p,t2));
    float fs=max(fwidth(s.x),fwidth(s.y))+1e-5;                                          // metres of surface per pixel
    // on a floor seen at a low angle a pixel is long one way and short the other: a stroke is still told apart while the mean
    // of the two (the root of the area a pixel covers), leaning three tenths toward the long one, is under about half its width
    float fq=mix(sqrt(length(cross(dFdx(p),dFdy(p)))+1e-10), fs, .3)+1e-5;
    // A DAY'S WORK. The picture was laid in sections about 11 m across (a painter's reach from one stand of the scaffold or one
    // kneeling board), their edges wandering 3.5 m: each section a breath lighter or darker, warmer or cooler than its neighbours,
    // with a seam where the later one laps the earlier. Fixed to the surface, large enough to be seen from across the hall.
    vec2 gw=(s+3.5*vec2(vn(s*.07+3.), vn(s*.07+41.)))/11.; vec2 gi=floor(gw), ga=abs(fract(gw)-.5);
    float gh=h21(gi+7.7), gh2=h21(gi.yx+2.9), gedge=(.5-max(ga.x,ga.y))*11.;                // metres from the seam
    float gseam=(1.-smoothstep(0., .10+1.5*fs, gedge))*min(1., .10/max(fs,1e-3)+.35);
    vec2 swp=s+1.1*vec2(vn(s*.31), vn(s*.31+17.3));                                      // patch edges wander
    vec2 pc=(floor(swp/3.)+.5)*3.; float ph=h21(floor(swp/3.)+3.7);
    vec3 pc3=p+t1*(pc.x-swp.x)+t2*(pc.y-swp.y), dc=pc3-uO; float distc=length(dc); dc/=max(distc,1e-3);
    // THE STROKES LIE IN THE SURFACE'S OWN DIRECTIONS, not along the drag: each patch is brushed one way, anywhere within 69 degrees
    // of the surface's own axis (the flags' rows on the floor; on a wall the level, tipped 29 degrees as a right hand tips a brush).
    // Laid along the drag (as they were) the strokes lengthened every streak of the dragged picture; laid across it they cut the
    // streaks into dabs, which is what a picture pulled askew over a painted floor looks like.
    float ang=(ph-.5)*2.4+(abs(n.y)>.5?0.:.5);
    float scl=clamp(distc/45.,1.,3.2), graze=clamp(1./sqrt(max(abs(dot(dc,n)),.08)),1.,2.2);
    vec2 dab=vec2(min(.62*graze*scl,2.2),.26*scl);                                                   // a dab: 0.62 m by 0.26 m near the station (a wall brush), growing with the distance from the station as the picture's own grain does (to 2.2 m by 0.83 m)
    vec2 cs=vec2(cos(ang),sin(ang)); vec2 sl=swp-pc; vec2 sr=vec2(dot(sl,cs), dot(sl,vec2(-cs.y,cs.x)))/dab;
    sr+=.30*vec2(vn(sl*1.9+ph*31.)-.5, vn(sl*1.9+ph*31.+11.)-.5);                        // edges wobble: no ruled lines
    // two interleaved layers of lens-shaped strokes: A on top, B (half a stroke along and across) showing between them
    vec2 cfA=fract(sr)-.5, cfB=fract(sr+.5)-.5;
    float la=.5*(1.-3.*cfA.x*cfA.x)-abs(cfA.y);                                          // above zero inside a stroke of layer A
    float onA=step(0.,la);
    vec2 cf=mix(cfB,cfA,onA), cell=mix(floor(sr+.5)+vec2(17.,31.), floor(sr), onA);
    float ch=h21(cell+ph*57.), ch2=h21(cell.yx+ph*23.+5.);
    float bfade=uBrush*uK*smoothstep(1.3,3.2,dab.y/fq);                                 // dabs smaller than two pixels melt back into the plain picture
    vec2 off=-cf*dab; off=cs*off.x+vec2(-cs.y,cs.x)*off.y;
    vec3 pb=p+(t1*off.x+t2*off.y)*(.94*bfade);
    vec4 q=uProj*vec4(pb,1.); vec2 uv=q.xy/max(q.w,1e-4)*.5+.5;
    float de=abs(la)*dab.y;                                                             // metres from the edge of the upper stroke
    float drim=(1.-smoothstep(0., .030+1.2*fs, de))*mix(1.,.55,onA);                    // a darker line where one stroke laps the next
    float bristle=vn(vec2(sr.y*11.+ch*40., sr.x*1.3+ch2*9.));                           // hairs of the brush, along the stroke
    float big=smoothstep(2.5,7.,dab.y/fq);                                              // per-stroke accents only where a stroke is several pixels wide
    float dabTone=(1.+(ch-.5)*.34*(.4+.6*big))*(1.-.40*drim*big)*(1.+.14*(bristle-.5)*big);      // stroke to stroke a sixth lighter or darker, a lap line two fifths down: the steps a loaded and a spent brush leave
    vec4 q0=uProj*vec4(p,1.); vec2 uv0=q0.xy/max(q0.w,1e-4)*.5+.5;
    // the picture's outer border ends in stroke ends (whole dabs in or out, a few metres ragged), never a ruled line
    float eb=min(min(uv.x,1.-uv.x),min(uv.y,1.-uv.y)), eb0=min(min(uv0.x,1.-uv0.x),min(uv0.y,1.-uv0.y));
    bool cov=q0.w>1e-3 && q.w>1e-3 && eb0>0. && eb>(.004+.030*ch2+.022*vn(s*.23+ph*9.))*uBrush*uK;
    // DRY BRUSH. Where the picture is dragged out at a low angle the brush runs dry: hairs and long streaks of bare
    // stone or plaster are left along the drag, more toward the end of each stroke. Two scales; what is bare is decided below (PAINT IS OPAQUE).
    float dryK=smoothstep(1.2,2.1,graze)*.75+.25*smoothstep(1.5,3.,scl);
    vec2 dr=vec2(dot(sl,cs), dot(sl,vec2(-cs.y,cs.x)));                                   // metres along and across the drag, in this patch
    float hair=vn(vec2(sr.y*5.3+ch*40., sr.x*.55+ch2*9.)), ends=smoothstep(.20,.5,abs(cf.x));
    float dragS=vn(vec2(dr.y*2.3+ph*50., dr.x*.16+ph*7.))*.7+vn(vec2(dr.y*5.9+ph*11., dr.x*.4))*.3;
    vec3 hueS=1.+((ch-.5)*(.4+.6*big)*bfade+(ph-.5)*.8*uBrush*uK*(1.-smoothstep(.3,1.2,fs)))*vec3(.17,.03,-.20);   // stroke to stroke, patch to patch: warmer, cooler
    // the gaps behind the piers and round the corner end where a stroke ends: the test is made for the stroke's own middle (pb), so a
    // whole stroke is in or out and the picture stops in stroke ends with bare block between them, not at a ruled line
    bool hid=segBox(uO.xz,pb.xz,uPA,vec4(1.,0.,0.,1.)) || segBox(uO.xz,pb.xz,uPB,uPBrot);
    vec2 cr=vec2(72.,-280.)-uO.xz, pr=pb.xz-uO.xz;
    hid=(hid || (pb.x>72.2 && cr.x*pr.y-cr.y*pr.x>0.)) && uStop>.5;                                    // arm two round the corner of the L
    float pm=cov?(hid?1.-smoothstep(.12,.60,uK):1.):0.;                                  // the bare gaps behind the piers come up with the hall's daylight (no white sliver in the valley while k is still 0)
    vec3 tex=texture2D(tPaint, clamp(uv,.001,.999)).rgb;
    tex*=mix(1., dabTone, bfade)*hueS;
    tex*=mix(vec3(1.), (1.+(gh-.5)*.13)*(1.+(gh2-.5)*vec3(.10,.02,-.12))*(1.-.22*gseam), uBrush*uK);      // section to section: 6 percent of tone, 5 of warmth; the seam a fifth darker (wet paint over dry)
    // ---- the fall: ray against the plane z = uFallZ
    float dz=min(d.z,-1e-4);
    vec2 fh=uO.xy+d.xy*((uFallZ-uO.z)/dz);
    float fx=smoothstep(.6,1.6,fh.x)*(1.-smoothstep(5.2,6.4,fh.x)), fy=step(fh.y,6.)*step(-8.6,fh.y);
    float streak=vn(vec2(fh.x*3.1, fh.y*.35+uTime*9.*.35))*.6+vn(vec2(fh.x*7.3+3., fh.y*.9+uTime*9.*.9))*.4;
    float fallA=fx*fy*step(d.z,-1e-3)*(.55+.45*smoothstep(.25,.7,streak));
    float mist=exp(-pow(abs(fh.y+7.6)/3.2,2.)-pow(abs(fh.x-3.5)/5.5,2.))*(.45+.3*vn(vec2(fh.x*.5-uTime*.4,fh.y*.6+uTime*.7)))*step(d.z,-1e-3);
    vec3 paint=mix(tex, uFallCol*(.78+.3*streak), fallA);
    paint=mix(paint, uFallCol*.95, mist*.7);
    // ---- the ring: ray against the plane of the ring
    vec2 rh=uO.xy+d.xy*((uRing.z-uO.z)/dz)-uRing.xy; float r=length(rh), R=uRing.w;
    float fr=fwidth(r)+apx*abs((uRing.z-uO.z)/dz);
    vec2 v=rh/R;
    float hz=-.12, below=hz-v.y;
    float band=.5+.5*sin(18./max(below+.12,.03)+uTime*1.4+v.x*3.);
    float glit=smoothstep(.82,.98,vn(vec2(v.x*26., 9./max(below+.1,.03)+uTime*2.2)))*exp(-v.x*v.x*9.)*step(0.,below);
    vec3 sea=mix(uSea1,uSea2,band*.55+.3*smoothstep(0.,.9,below))*(.80+.25*band)+vec3(1.,.98,.9)*glit*1.4;
    vec3 sky=mix(vec3(.93,.98,.96), uSea2*1.05, smoothstep(0.,1.1,v.y-hz))+vec3(1.,.95,.85)*.35*exp(-max(v.y-hz,0.)*5.);
    vec3 inside=min(mix(sky, sea, smoothstep(-.012,.012,below))*1.05, vec3(4.));
    float x=max(r-R,0.)/R;
    float wisp=fbm(v*1.6+vec2(x*5.-uTime*.7, uTime*.2));
    float glow=exp(-x*x*900.)*1.6+exp(-x*7.)*(.30+.8*wisp*wisp)+exp(-x*2.2)*.07;
    float rimw=max(.2, .9*fr), rim=1.-smoothstep(rimw*.6, rimw, abs(r-(R-.2)));
    float disc=1.-smoothstep(R-.4-fr, R-.4, r);
    float ringOn=step(d.z,-1e-3);
    paint=mix(paint, inside, disc*ringOn);
    vec3 lightRing=uRingCol*(glow*(1.-disc)*(1.-.72*uK)+rim*3.)*ringOn;
    paint=paint*(1.-rim*ringOn)+lightRing;
    // ---- seven swifts: darts in projector space (no texture, no derivative in here)
    float sw=0.;
    for(int i=0;i<7;i++){ vec3 sp=uSwift[i].xyz-uO; float sd=length(sp); vec3 sn=sp/max(sd,1e-3);
      vec3 e=d-sn*dot(d,sn); vec3 vv=uSwiftV[i]-sn*dot(uSwiftV[i],sn); vv/=max(length(vv),1e-3);
      float al=dot(e,vv); vec3 side=e-vv*al; float ac=length(side);
      float hs=max(.5*uSwift[i].w/max(sd,1.), 2.4*apx), px=apx/hs;                       // half span, never under 2.4 pixels
      float a=al/hs, b=ac/hs;
      float wd=abs(a-(.16-.80*b*b))-max(.15*(1.-b)+.015, .7*px);
      wd=max(wd, b-1.);
      float bd=length(vec2((a+.12)/.52, b/max(.085,.7*px)))-1.;
      float dd=min(wd, bd*.08); sw=max(sw, (1.-smoothstep(-px*.4, px*.6, dd))*step(0.,dot(d,sn))); }
    paint=mix(paint, uSwiftCol, sw*.92);
    // ---- the hall's own light
    float joint; vec2 blk; vec3 shd=hallShade(n,p,joint,blk);
    float fine=1.-smoothstep(.06,.25,fs);
    float trowel=vn(s*vec2(1.3,5.))*.6+vn(s*vec2(7.,2.1)+9.)*.4;                         // the plaster under the paint: trowel marks and grain
    float grain=(.96+.08*vn(s*9.)*vn(s*31.+3.))*(1.-.10*(trowel-.5)*fine);
    vec3 bare=(n.y>.5?uFlag*(.955+.07*vn(s*.55+floor(s/3.)*7.)+.05*(vn(s*2.7)-.5)*fine):uPlaster*(.975+.04*vn(s*.21)+.03*(vn(s*vec2(1.3,5.))-.5)*fine));   // clouded stone, trowelled plaster
    if(n.y<-.5 && p.x>72.){ float sl=abs(fract((p.x-SL0)/30.)-.5)*30.;
      float slot=(1.-smoothstep(2.4,3.,sl))*slotZ(p,.96,1.)*step(SL0-6.,p.x)*step(p.x,SL1);
      float sk=smoothstep(.38,.66, vn(vec2((p.x*.5-p.z*.86-uTime*8.)*.04, (p.x*.86+p.z*.5)*.022)));                // the sky in the slots: blue, with the same clouds that shade the room crossing it
      bare=mix(bare, mix(vec3(.50,.74,1.16), vec3(1.02,1.04,1.06), sk), slot); shd=mix(shd, vec3(1.), slot); }
    // PAINT ON STONE FLAGS AND COURSED BLOCK. The build is under the paint as relief (the grooves and their light are in hallShade and lie
    // on paint and bare stone alike); every flag and every block took the paint a little differently, and a few flags drank it and dried a tone down.
    float fv=0.;
    if(n.y>.5){ float gm=max(gfw.x,gfw.y), tfade=1.-smoothstep(.12,.50,gm);
      float fh=h21(floor(gfl)+3.3); fv=((fh-.5)*.19-.12*smoothstep(.86,.97,h21(floor(gfl)+9.1)))*tfade; }      // flag to flag a tenth either way; one flag in ten 12 percent down (just past what any flag differs by, so it is told apart)
    else if(n.y>-.5) fv=(blk.x-.5)*.12*blk.y;                                             // block to block 6 percent either way: plaster-faced block drinks less unevenly than stone
    float solid=max(max(disc,rim),max(fallA,sw))*ringOn;                                // ring, fall and swifts are never broken
    // PAINT IS OPAQUE. A point is painted or it is bare: where the brush ran dry it left HAIRS AND STREAKS OF BARE GROUND with an edge (0.06 of
    // the hair's own noise wide), not a wash of plaster through paint. uBrush is 0.8 for the whole flight, so each threshold stands a fifth of the way from its base to 1.03 (a hair 0.69 to 0.98, a streak 0.81 to 0.89, a thin-dragged stroke's hair 0.77): LESS is bare than where live's ramp had reached its top, and at 0.98 (dryK and ends both 0) the hair's noise, 1 at most, never clears the edge's top at 1.01: that hair is nine tenths bare at its barest and never wholly. As a hair or a streak
    // nears the width of a pixel it narrows to nothing (its threshold rises to 1.03), and
    // none is drawn as a scratch a pixel wide: a hair of the dry brush is about 0.057 of its stroke's width across (5.3 hairs to a
    // stroke, three tenths of each bare), a hair of a thin-dragged stroke 0.027 (11 to a stroke), a streak along the drag 10 cm; each
    // is gone before a pixel is half as wide as it is.
    float cut=.03, fA=smoothstep(.25,.5,fs/(.057*dab.y)), fB=smoothstep(.25,.5,fs/.10), fT=smoothstep(.25,.5,fs/(.027*dab.y)), brOn=uBrush*uK*(1.-solid);
    float hA=mix(.97-.20*dryK-.16*ends, 1.+cut, max(fA, 1.-brOn)), hB=mix(.86-.10*dryK, 1.+cut, max(fB, 1.-brOn)), hT=mix(.70, 1.+cut, max(max(fT, 1.-big*bfade), 1.-brOn));
    float bareIn=max(max(smoothstep(hA-cut,hA+cut,hair), smoothstep(hB-cut,hB+cut,dragS)), step(.92,ch2)*smoothstep(hT-cut,hT+cut,bristle));
    // PAINT HAS THE RANGE OF PIGMENT. Under the hall's light the brightest thing a brush can leave is white paint, and white paint on white
    // plaster is as bright as the plaster (PW, the plaster's own albedo), never brighter. Up to half of that the picture keeps its
    // values exactly (meadow, pines, rock, shade); above, sky, snow, river and the ring's sea close up toward white and keep their hue.
    float PW=max(uPlaster.r,max(uPlaster.g,uPlaster.b)), knee=.5*PW;
    vec3 alb=paint*grain*(1.+fv*(1.-solid))/.80; float ma=max(alb.r,max(alb.g,alb.b));
    float mc=ma<=knee? ma : knee+(PW-knee)*(1.-exp(-(ma-knee)/(PW-knee)));
    vec3 pig=alb*(mc/max(ma,1e-4));
    // THE RING, THE FALL AND THE SWIFTS are not the picture from the target: they keep the range the brief gives them (min(paint, 0.86) over
    // 0.80, as live), so the rim is the brightest paint in the hall, the sea under it keeps its bands and glitter and the fall is white.
    // The fall's mist is the fall. (No flag or block tone on them: fv is already off wherever they are.)
    float mxp=max(paint.r,max(paint.g,paint.b)), ana=clamp(max(solid, mist*.7), 0., 1.);
    pig=mix(pig, paint*grain/(.80*max(1., mxp/.86)), ana);
    vec3 lit=mix(bare, mix(pig, bare, bareIn), pm)*shd*joint;
    vec3 raw=mix(bare, paint, pm);
    gl_FragColor=vec4(mix(raw, lit, uK),1.);
  }`,me=t=>-21-f.wallSlope*t,ke=Math.hypot(1,f.wallSlope),be=[f.wallSlope/ke,-1/ke],de=[1/ke,f.wallSlope/ke],Be=t=>me(t)+70*ke,Re={cx:23.5,cz:-168,hx:4,hz:4},Ae={cx:be[0]*5+de[0]*7,cz:-258+be[1]*5+de[1]*7,hx:7,hz:5};function Qe(){const t=Ae,n=we,o=f.S,R=(a,l)=>[t.cx+de[0]*a+be[0]*l,t.cz+de[1]*a+be[1]*l],y=[R(-t.hx,-t.hz),R(t.hx,-t.hz),R(t.hx,t.hz),R(-t.hx,t.hz)],s=Math.floor((Math.min(...y.map(a=>a[1]))-n.behindPier)/n.go)*n.go,b=Math.floor(n.lowTo/n.go)*n.go,T=Math.ceil((b-n.farZ)/n.go),v=[];for(let a=0;a<n.lower;a++)v.push(s-n.go*a);for(let a=0;a<T;a++)v.push(b-n.go*a);let r=y[0];for(const a of y)(a[0]-o[0])/(o[2]-a[1])>(r[0]-o[0])/(o[2]-r[1])&&(r=a);const c=Math.hypot(r[0]-o[0],r[1]-o[2]),p=(r[0]-o[0])/c,C=(r[1]-o[2])/c,u=(a,l)=>C*(a-o[0])-p*(l-o[2]);let i=n.out;for(const a of[s,n.farZ])i=Math.min(i,((n.inShadow+p*(a-o[2]))/C+o[0]-me(a))/ke);const h=Math.min(u(me(s)+i*ke,s),u(me(n.farZ)+i*ke,n.farZ));return{zA:s,zT:b,risers:v,lower:n.lower,upper:T,D:i,margin:h,yTerrace:n.rise*n.lower,yTop:n.rise*(n.lower+T),landing:v[v.length-1]-n.farZ}}function et(){const t=xe,n=f.S,o=t.farZ+t.proud,R=n[0]+(Be(-280)-n[0])*(o-n[2])/(-280-n[2]),y=[];for(let s=1;t.slot0+t.module*s+t.half<f.XE;s++)t.slot0+t.module*s-t.half>=R+t.clearS&&y.push(t.slot0+t.module*s);return{xs:y,zF:o,xEnd:R}}const Ie=[de[0],0,de[1]];function Tt(){const t=[],n=[],o=[],R=new e.Vector3,y=new e.Vector3,s=new e.Vector3,b=(d,A,g,m,k)=>{R.set(A[0]-d[0],A[1]-d[1],A[2]-d[2]),y.set(g[0]-d[0],g[1]-d[1],g[2]-d[2]),s.crossVectors(R,y);const W=s.x*k[0]+s.y*k[1]+s.z*k[2]<0,N=t.length/3,M=W?[d,m,g,A]:[d,A,g,m];for(const j of M)t.push(j[0],j[1],j[2]),n.push(k[0],k[1],k[2]);o.push(N,N+1,N+2,N,N+2,N+3)},T=(d,A,g,m,k,W,N=0,M=f.ceil)=>b([d,N,A],[g,N,m],[g,M,m],[d,M,A],[k,0,W]),v=f.ceil,r=-220,c=440,p=280,C=-440,u=150,i=f.XE;b([r,0,p],[c,0,p],[c,0,C],[r,0,C],[0,1,0]),b([r,v,p],[c,v,p],[c,v,C],[r,v,C],[0,-1,0]),T(me(u),u,me(-350),-350,de[0],de[1]),T(me(u),u,Be(u),u,0,-1),T(Be(u),u,Be(-280),-280,-de[0],-de[1]),T(Be(-280),-280,f.XB,-280,0,-1),T(f.XB,-280,f.XB,f.ZN,1,0),T(me(-350),-350,i,-350,0,1),T(i,f.ZN,i,-350,-1,0),T(f.XB,f.ZN,i,f.ZN,0,-1);const h=Re;T(h.cx-h.hx,h.cz+h.hz,h.cx+h.hx,h.cz+h.hz,0,1),T(h.cx-h.hx,h.cz-h.hz,h.cx+h.hx,h.cz-h.hz,0,-1),T(h.cx-h.hx,h.cz+h.hz,h.cx-h.hx,h.cz-h.hz,-1,0),T(h.cx+h.hx,h.cz+h.hz,h.cx+h.hx,h.cz-h.hz,1,0);const a=Ae,l=(d,A)=>[a.cx+de[0]*d+be[0]*A,a.cz+de[1]*d+be[1]*A],w=l(-a.hx,-a.hz),L=l(a.hx,-a.hz),E=l(a.hx,a.hz),F=l(-a.hx,a.hz);if(T(w[0],w[1],L[0],L[1],-be[0],-be[1]),T(L[0],L[1],E[0],E[1],de[0],de[1]),T(E[0],E[1],F[0],F[1],be[0],be[1]),Fe){const d=Qe(),A=d.risers,g=A.length,m=M=>me(M)+d.D*ke,k=M=>we.rise*M,W=we.farZ,N=(M,j,$,K)=>{R.set(j[0]-M[0],j[1]-M[1],j[2]-M[2]),y.set($[0]-M[0],$[1]-M[1],$[2]-M[2]),s.crossVectors(R,y);const I=t.length/3;for(const S of s.x*K[0]+s.y*K[1]+s.z*K[2]<0?[M,$,j]:[M,j,$])t.push(S[0],S[1],S[2]),n.push(K[0],K[1],K[2]);o.push(I,I+1,I+2)};for(let M=1;M<=g;M++){const j=A[M-1],$=M<g?A[M]:W,K=k(M-1),I=k(M);b([me(j),K,j],[m(j),K,j],[m(j),I,j],[me(j),I,j],[0,0,1]),b([me(j),I,j],[m(j),I,j],[m($),I,$],[me($),I,$],[0,1,0]);const S=[m(W),K,W],B=[m(j),K,j],z=[m(j),I,j],O=[m($),I,$],q=[m(W),I,W];N(S,B,z,Ie),M<g?(N(S,z,O,Ie),N(S,O,q,Ie)):N(S,z,q,Ie)}}if(Le){const d=et(),A=xe.farZ;for(const g of d.xs)T(g-xe.half,d.zF,g+xe.half,d.zF,0,1),T(g-xe.half,A,g-xe.half,d.zF,-1,0),T(g+xe.half,A,g+xe.half,d.zF,1,0)}const V=new e.BufferGeometry;return V.setAttribute("position",new e.Float32BufferAttribute(t,3)),V.setAttribute("normal",new e.Float32BufferAttribute(n,3)),V.setIndex(o),V}const Ct=`precision highp float;
  varying vec3 vP, vN; uniform vec3 uL, uE, uPlaster, uSkyL; uniform vec4 uPrev[4]; uniform float uCone, uTone, uTime, uScale, uCham, uCollar, uLitR, uExit, uSea; uniform vec3 uBird[3], uExitCol; uniform vec2 uAx;
  ${ye}
  const float SL0=${(f.XB-8).toFixed(1)}, SL1=${(f.XE-64).toFixed(1)};
  void main(){
    vec3 p=vP;
    vec2 b0=vec2(dot(p.xz,uAx)/6., p.y/3.), bfw=fwidth(b0);                              // courses of blocks, 6 m by 3 m: the hole is cut across them
    float keep=1.; for(int i=0;i<4;i++){ keep=min(keep, dot(uPrev[i].xyz,p)+uPrev[i].w); }      // each wall stops at the walls before it
    if(keep<0.) discard;
    vec3 dl=p-uL; float t=(uE.z-uL.z)/max(dl.z,1e-3); vec2 h=uL.xy+dl.xy*t-uE.xy; float rr=length(h);
    float fw=fwidth(rr)+1e-5; float a=smoothstep(uCone-fw*.6, uCone+fw*.6, rr);
    if(dl.z<1e-3) a=1.;
    if(a<.03) discard;
    float e=max(rr-uCone,0.)*(6.3/uCone);
    float occ=1.-.10*exp(-e/2.5);
    vec3 n=normalize(vN+vec3(0.,1e-5,0.));
    float cs=smoothstep(.52,.70, vn(vec2((p.x*.5-p.z*.86-uTime*8.)*.04, (p.x*.86+p.z*.5)*.022+p.y*.02)));   // cloud shade drifting over the skylights: its soft edge crosses each slab
    float day=1.-.70*cs;
    // THE FALL OF DAYLIGHT. The light comes down from beyond the row, toward us: the faces we see are the shade side, lit
    // from the skylights above them (bright at the top, in soft scallops under each slot, falling to shade at the foot);
    // the far faces and the sills of the holes take the light itself.
    float nl=max(dot(n,uSkyL),0.);
    float hy=clamp(p.y/44.,0.,1.);
    float sl=abs(fract((p.x-SL0)/30.)-.5)*30.;
    float scal=exp(-sl*sl/(60.+900.*(1.-hy)))*(1.-smoothstep(SL1-4.,SL1+22.,p.x));              // a scallop under each skylight, spreading as it falls
    // THE TWO WALLS THAT CROSS THE ROOM. From L only a collar of each shows (through the hole before it): the collar keeps the
    // wall's tone, so the five rims are what they were. Outside the collar the face stands in the daylight of the slot above
    // it: the last wall all over, the fourth in a broad pool round the axis that falls away to its dark blue-grey.
    float freeW=smoothstep(uCollar-fw, uCollar+fw, rr)*step(.5,uCollar)*(1.-step(.5,uLitR)*smoothstep(uLitR*.5, max(uLitR,1e-6), length(p.xy-uE.xy)));
    float hs=hy*hy*(3.-2.*hy);
    float fall=mix(mix(.44,.95,hs), mix(.36,1.10,hs), freeW)+.55*scal*hy*day;
    float face=fall*(1.+.32*smoothstep(.5,.9,-n.x)-.08*smoothstep(.5,.9,n.x))+.75*nl*day;      // a fin's free end (1.4 m of it) looks west, straight up into the three slots over the open room: a lit edge, a third brighter than the face so that so narrow an end is told from it
    vec3 tint=mix(vec3(.72,.81,.975), vec3(1.,.992,.965), smoothstep(.2,.85,mix(uTone,.80,freeW)*fall));      // shade is a cool grey (as dark as it was, half as blue), light is plaster white: tone and temperature, no colour of the hall's own
    float foot=1.-.20*exp(-max(p.y,0.)/1.5);
    float dm=max(rr-uCone,0.)*uScale, fwm=fw*uScale;                                       // metres on this wall from its cut edge
    float trowel=.975+.05*vn(p.xy*.23+p.z*.11)+.02*(vn(p.xy*vec2(1.1,4.3))-.5)*(1.-smoothstep(.02,.1,fwm));
    // THE LAST WALL. From L only a collar of it shows (through the hole before): that collar keeps the wall's tone, so the five
    // rims are what they were. Outside the collar the face is plaster in full daylight from the slot above it.
    float T=mix(uTone, .80, freeW)/.80;
    vec3 c=uPlaster*tint*T*occ*face*foot*trowel*(1.-.15*cs);
    vec2 bb=vec2(b0.x+.5*mod(floor(b0.y),2.), b0.y), ba=abs(fract(bb)-.5);
    float bfade=1.-smoothstep(.07,.22,max(bfw.x*2.,bfw.y)); vec2 bw=max(vec2(.007,.014), bfw*.9);
    float bj=max(smoothstep(.5-bw.x-max(bfw.x,1e-6),.5-bw.x,ba.x), smoothstep(.5-bw.y-max(bfw.y,1e-6),.5-bw.y,ba.y))*bfade;      // a joint is never thinner than two pixels
    c*=(1.-.05*bj)*(1.+(h21(floor(bb)+uTone*7.)-.5)*.012*(.3+.7*bfade));        // the five slabs are plain sheets: the joints a breath, no block-to-block tone
    // the cut edge, wide enough to read from the axis: a splay round the hole whose lower arc looks up into the light
    // and whose upper arc looks down, away from it; one ruled line where the splay meets the face
    float sinT=h.y/max(rr,1e-3), low=smoothstep(-.85,.70,-sinT);
    float vis=1.-smoothstep(.30,.80,fwm);
    float ch=(1.-smoothstep(uCham-fwm, uCham+fwm, dm))*vis;
    vec3 splay=uPlaster*mix(vec3(.76,.84,.98)*max(T*.50,.16), vec3(.99,1.,1.02)*max(T*1.9,.80)*(.60+.40*day), low)*trowel;
    c=mix(c, splay, ch);
    float rule=smoothstep(uCham-fwm,uCham,dm)*(1.-smoothstep(uCham+.07,uCham+.07+fwm*1.5,dm))*vis;
    c*=1.-.28*rule;
    c*=1.-.30*step(.5,uCollar)*(1.-smoothstep(0.,.12+fwm*1.5,abs(rr-uCollar)*uScale));     // the collar's edge: one ruled line
    c*=1.-.45*(1.-smoothstep(.05,.05+fwm*1.2,dm))*vis;                                    // the cut itself: one fine dark line, the same all the way round
    float Rh=uCone*uScale, bx=(p.x-(uE.x-.25*Rh))/(Rh*1.25);                              // light thrown up from the lit ellipse at the wall's foot
    float bounce=exp(-max(p.y,0.)/(4.+.5*Rh))*exp(-bx*bx)*day*step(n.z,-.3);
    c+=uPlaster*vec3(.94,.98,1.04)*bounce*(.10+.22*T)*trowel*(1.-uExit);
    // the two last walls stand over flags lit by the way out: its colour comes up their feet, strongest beside the hole
    float ex=abs(p.x-uE.x)/(Rh*2.2);
    c+=uPlaster*uExitCol*uExit*exp(-max(p.y,0.)/7.)*exp(-ex*ex)*(.52+.14*vn(vec2(p.x*.2+uTime*.12, uTime*.08)))*freeW;
    // the swallows' shadows on the lit faces (the slot's light comes down and forward onto them)
    float bsh=0.; const vec3 dW=vec3(.30,-.36,.884);
    for(int i=0;i<3;i++){ vec3 r=p-uBird[i]; float al=dot(r,dW); vec3 pr=r-dW*al; float rad=1.05+.035*max(al,0.);
      bsh=max(bsh, (1.-smoothstep(rad*.35,rad,length(pr)))*step(0.,al)*(1.-smoothstep(14.,30.,al))); }
    c*=1.-.30*bsh;
    // THE WAY OUT'S OWN LIGHT. What comes through the last hole is thrown from wall to wall back up the cone: the face round
    // each hole takes the colour of the sea beyond, deeper wall by wall, moving as light off water moves. No lamp, no glow:
    // each wall keeps its step of tone, so the five rims are the same five rims, now going from white to sea-green.
    float sea=uSea*exp(-e/8.)*(1.-freeW);
    float rip=.86+.28*(vn(h*.16+vec2(uTime*.17,-uTime*.11))*.65+vn(h*.45-vec2(uTime*.23,uTime*.14)+5.)*.35);
    c=mix(c, c*vec3(.50,1.06,.92)*1.55*rip, sea)+uPlaster*uExitCol*(.15*sea*rip);
    gl_FragColor=vec4(c,a);
  }`;function Ge(t){return f.cone*f.rho[t]*(f.wallZ[t]-f.L[2])/(f.E[2]-f.L[2])}function At(t,n,o,R){const y=new e.Vector3(...f.L),s=new e.Vector3(...f.E),b=f.wallZ,T=[.88,.6,.41,.28,.19],v=new e.Matrix4,r=new e.Euler,c=new e.Vector3,p=[],C=[],u=new e.Vector4(0,0,1,900),i=Ue,h=Ye,a=[],l=[],w=[],L=[];for(let d=0;d<5;d++){const A=o[d][0]*Math.PI/180,g=o[d][1]*Math.PI/180,m=d>0?f.cone*f.rho[d-1]*(b[d]-f.L[2])/(f.E[2]-f.L[2])+1.2:0,k=d<3?-Math.max(Ge(d)+1.3,m)/Math.cos(A):-(f.E[0]-f.XB+5),W=f.XE-f.E[0]+(d<3?1:14),N=new e.BoxGeometry(W-k,150,h-i);N.translate((k+W)/2,10,(h+i)/2),r.set(g,A,0,"YXZ"),v.makeRotationFromEuler(r).setPosition(f.E[0],14,b[d]),N.applyMatrix4(v),c.set(0,0,1).applyEuler(r);const M=-14/Math.cos(g),j=new e.Vector3(k,M,.25).applyMatrix4(v),$=new e.Vector3(W,M,.25).applyMatrix4(v);n.uWN.value[d].set(c.x,c.y,c.z,-(c.x*f.E[0]+c.y*14+c.z*b[d])-i),n.uWX.value[d].set(Math.cos(A),-Math.sin(A),f.E[0]*Math.cos(A)-b[d]*Math.sin(A)+k,f.cone*f.rho[d]),n.uFin.value[d].set(j.x,j.z,$.x,$.z);const K=[u,u,u,u],I=new e.ShaderMaterial({name:"pwys-cut",fog:!1,alphaToCoverage:!0,uniforms:{uTime:n.uTime,uPlaster:n.uPlaster,uL:{value:y},uE:{value:s},uPrev:{value:K},uCone:{value:f.cone*f.rho[d]},uTone:{value:T[d]},uSkyL:n.uSkyL,uCham:{value:Math.min(1.05,Math.max(.62,.075*Ge(d)))},uCollar:{value:0},uLitR:{value:0},uExit:{value:0},uSea:{value:0},uAx:{value:new e.Vector2(Math.cos(A),-Math.sin(A))},uExitCol:{value:new e.Color("#BFE6DC")},uBird:n.uBird,uScale:{value:(b[d]-f.L[2])/(f.E[2]-f.L[2])}},vertexShader:je,fragmentShader:Ct}),S=new e.Mesh(N,I);S.frustumCulled=!1,R.add(S),p.push(S),C.push(new e.Vector4(c.x,c.y,c.z,-(c.x*f.E[0]+c.y*14+c.z*b[d])-.3));const B=v.clone().invert(),z=y.clone().applyMatrix4(B),O=f.cone*f.rho[d],q=64,D=a.length/3;for(let _=0;_<=q;_++){const X=_/q*Math.PI*2,P=new e.Vector3(s.x+O*Math.cos(X),s.y+O*Math.sin(X),s.z).applyMatrix4(B),Z=P.sub(z);for(const x of[i,h]){const re=(x-z.z)/Z.z,J=new e.Vector3().copy(z).addScaledVector(Z,re).applyMatrix4(v);a.push(J.x,J.y,J.z),l.push(Math.sin(X),x===i?0:1,T[d]),L.push(0,X)}if(_<q){const x=D+_*2;w.push(x,x+1,x+2,x+1,x+3,x+2)}}const oe=a.length/3,ae=.06/Ge(d);for(let _=0;_<=q;_++){const X=_/q*Math.PI*2;for(const[P,Z]of[[1,i],[1+ae,i+.03]]){const x=new e.Vector3(s.x+O*P*Math.cos(X),s.y+O*P*Math.sin(X),s.z).applyMatrix4(B).sub(z),re=(Z-z.z)/x.z,J=new e.Vector3().copy(z).addScaledVector(x,re).applyMatrix4(v);a.push(J.x,J.y,J.z),l.push(Math.sin(X),0,T[d]),L.push(0,X)}if(_<q){const P=oe+_*2;w.push(P,P+1,P+2,P+1,P+3,P+2)}}}const E=new e.BufferGeometry;E.setAttribute("position",new e.Float32BufferAttribute(a,3)),E.setAttribute("aLin",new e.Float32BufferAttribute(l,3)),E.setAttribute("aSea",new e.Float32BufferAttribute(L,2)),E.setIndex(w);const F=new e.ShaderMaterial({name:"pwys-reveal",fog:!1,side:e.DoubleSide,uniforms:{uPlaster:n.uPlaster,uTime:n.uTime,uExitCol:{value:new e.Color("#BFE6DC")}},vertexShader:"attribute vec3 aLin; attribute vec2 aSea; varying vec3 vLin; varying vec2 vSea; void main(){ vLin=aLin; vSea=aSea; gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.); }",fragmentShader:`precision highp float; varying vec3 vLin; varying vec2 vSea; uniform vec3 uPlaster, uExitCol; uniform float uTime; ${ye}
      void main(){ float up=.5-.5*vLin.x;                                                    // the sill of the hole looks up at the skylights, its head looks down
        // the inside of the hole is a surface 1.4 m deep, lit as the room is: the daylight comes down along (-.36,-.46,-.81), so the sill and the
        // flank that faces +x take it (its share in the wall's own plane is (.616,.788)), the head and the other flank stand in shade
        float sun=max(0., -cos(vSea.y)*.616-vLin.x*.788);
        float t=(.20+.45*up*up+.70*sun)*(1.-.22*vLin.y)*mix(.80,1.,smoothstep(.2,.9,vLin.z));
        t*=1.+.30*(1.-smoothstep(0.,.14,vLin.y))*up;                                         // the arris toward us: a worn edge 0.2 m wide (a seventh of the 1.4 m), lighter where it looks up
        vec3 c=uPlaster*mix(vec3(.74,.82,.98), vec3(1.), up)*t/.80;
        float rip=.70+.60*vn(vec2(vSea.y*5.+uTime*.21, vLin.y*2.-uTime*.13));                   // the sea's light running round the inside of the hole
        c=mix(c, uPlaster*uExitCol*(.62+.75*vLin.y)*rip*1.25, vSea.x*.86);
        gl_FragColor=vec4(c,1.); }`}),V=new e.Mesh(E,F);return V.frustumCulled=!1,R.add(V),p}const Pt=`precision highp float;
  varying vec3 vP; uniform vec3 uCamC, uSkyL, uLP, uE; uniform vec4 uPl, uPrevPl; uniform vec4 uWN[5], uWX[5]; uniform float uRc, uK, uTime, uGain, uCone0; ${ye}
  void main(){
    vec3 V=vP-uCamC; float sF=length(V); V/=max(sF,1e-3);
    float nl=max(dot(uPl.xyz,uSkyL),.05);
    float t0=-(dot(uPl.xyz,uCamC)+uPl.w)/nl, t1=-dot(uPl.xyz,V)/nl;                        // metres downstream of the wall along the light: t0+t1*s
    vec3 a=uCamC+uSkyL*t0-uLP, b=V+uSkyL*t1;                                              // where that light crossed the wall, seen from L: a+b*s
    float K=uE.z-uLP.z, K2=K*K, R2=uRc*uRc;
    float A=K2*dot(b.xy,b.xy)-R2*b.z*b.z, B=K2*dot(a.xy,b.xy)-R2*a.z*b.z, C=K2*dot(a.xy,a.xy)-R2*a.z*a.z;
    float dq=B*B-A*C; if(dq<=0. || A<1e-6) discard;
    float sq=sqrt(max(dq,0.)), s0=max((-B-sq)/A,0.), s1=min((-B+sq)/A, sF+.5);
    if(abs(t1)>1e-5){ float sc=-t0/t1; if(t1>0.) s0=max(s0,sc); else s1=min(s1,sc); } else if(t0<0.) discard;      // downstream of its wall
    if(abs(V.y)>1e-5){ float sc=-uCamC.y/V.y; if(V.y>0.) s0=max(s0,sc); else s1=min(s1,sc); }                      // above the flags
    float pd=dot(uPrevPl.xyz,V), p0=dot(uPrevPl.xyz,uCamC)+uPrevPl.w;                                               // short of the wall before
    if(abs(pd)>1e-5){ float sc=-p0/pd; if(pd>0.) s0=max(s0,sc); else s1=min(s1,sc); } else if(p0<0.) discard;
    float camW=1.-smoothstep(1.5,9.,length(uCamC.xy-uE.xy));                              // 1 when the eye is on the axis of the cone
    float sMid=clamp(-B/A, 0., sF); vec3 hq=a+b*sMid; float rmin=K*length(hq.xy)/max(hq.z,1e-2);   // how near the shaft's axis this view ray passes
    float feather=1.-smoothstep(.62,1.,rmin/uRc);                                         // the shaft has no ruled edge: it thins to nothing at its sides
    float sNear=9.+9.*camW; float len=s1-s0; if(len<=0.) discard;
    len*=smoothstep(sNear, sNear+14., .5*(s0+s1));                                        // the air right round the eye is clear: no veil while we fly through a shaft
    // A SHAFT IS NEVER DRAWN OVER A HOLE, from any eye point: where this view ray goes on (or came) through the hole of any
    // of the five walls it shows nothing, so every opening stays an opening and the piece of the next world keeps its colour
    float thr=1.;
    for(int j=0;j<5;j++){ float dn=dot(uWN[j].xyz,V); dn=abs(dn)<1e-4?1e-4:dn; float sj=-(dot(uWN[j].xyz,uCamC)+uWN[j].w)/dn;
      vec3 hj=uCamC+V*sj-uLP; float rj=K*length(hj.xy)/max(hj.z,1e-2);
      thr*=mix(1., smoothstep(uWX[j].w*1.02, uWX[j].w*1.30, rj), step(0.,sj)); }
    float sm=.5*(s0+s1), tm=t0+t1*sm; vec3 pm=uCamC+V*sm, hm=pm+uSkyL*tm; vec2 hc=hm.xy-uE.xy;
    float ray=vn(hc*.55+vec2(uTime*.045,3.))*.55+vn(hc*1.7-vec2(7.,uTime*.07))*.45;                               // dust in the light: striations along the shaft, drifting
    float cs=smoothstep(.52,.70, vn(vec2((pm.x*.5-pm.z*.86-uTime*8.)*.04, (pm.x*.86+pm.z*.5)*.022)));             // the same cloud shade as the floor
    float dens=(1.-exp(-len*.050))*mix(.50+.85*ray, .80+.25*ray, camW)*(1.-.75*cs)*exp(-max(tm,0.)/70.)*(1.-.35*camW);
    float ez=max(uE.z-uCamC.z,1.), vz=max(V.z,1e-3); vec2 eh=uCamC.xy+V.xy*(ez/vz)-uE.xy;                          // where this view ray meets the plane of the exit
    float guard=mix(1., smoothstep(uRc*.97,uRc*1.25,length(eh))*step(1e-3,V.z), camW);
    gl_FragColor=vec4(vec3(.90,.955,1.04)*uGain*dens*guard*thr*feather*uK, 1.);          // cool daylight: nothing in the hall has colour
  }`;function Et(t,n,o,R){const y=new e.Vector3(...f.L),s=new e.Vector3(...f.E),b=f.wallZ,T=t.uSkyL.value,v=Ue,r=Ye,c=48,p=new e.Matrix4,C=new e.Euler,u=new e.Vector3,i=new e.Vector3,h=[new e.Vector3,new e.Vector3,new e.Vector3],a=new e.Vector3,l=new e.Vector3,w=[];let L=new e.Vector4(0,0,0,1);for(let E=0;E<5;E++){C.set(n[E][1]*Math.PI/180,n[E][0]*Math.PI/180,0,"YXZ"),p.makeRotationFromEuler(C).setPosition(f.E[0],14,b[E]),u.set(0,0,1).applyEuler(C);const F=p.clone().invert(),V=y.clone().applyMatrix4(F),d=f.cone*f.rho[E],A=[],g=[],m=new e.Vector3,k=new e.Vector3;for(let I=0;I<c;I++){const S=I/c*Math.PI*2,B=new e.Vector3(s.x+d*1.03*Math.cos(S),s.y+d*1.03*Math.sin(S),s.z).applyMatrix4(F).sub(V),z=new e.Vector3().copy(V).addScaledVector(B,(v-.07-V.z)/B.z).applyMatrix4(p);let O=(z.y-.05)/T.y;E>0&&(O=Math.min(O,(i.x*(z.x-f.E[0])+i.y*(z.y-14)+i.z*(z.z-b[E-1])-(r+.07))/i.dot(T))),A.push(z),g.push(new e.Vector3().copy(z).addScaledVector(T,-Math.max(O,.01))),m.add(z),k.add(g[I])}m.multiplyScalar(1/c),k.multiplyScalar(1/c);const W=new e.Vector3().addVectors(m,k).multiplyScalar(.5),N=[],M=(I,S,B)=>{a.subVectors(S,I),l.subVectors(B,I),a.cross(l),h[0].copy(I).sub(W);const z=a.dot(h[0])<0?[I,B,S]:[I,S,B];for(const O of z)N.push(O.x,O.y,O.z)};for(let I=0;I<c;I++){const S=(I+1)%c;M(A[I],A[S],g[I]),M(A[S],g[S],g[I]),M(m,A[I],A[S]),M(k,g[I],g[S])}const j=new e.BufferGeometry;j.setAttribute("position",new e.Float32BufferAttribute(N,3));const $=new e.ShaderMaterial({name:"pwys-beam",fog:!1,side:e.BackSide,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,uniforms:{uCamC:{value:R},uSkyL:t.uSkyL,uLP:{value:y},uE:{value:s},uPl:{value:t.uWN.value[E]},uPrevPl:{value:L},uWN:t.uWN,uWX:t.uWX,uRc:{value:d},uK:t.uK,uTime:t.uTime,uGain:{value:.7},uCone0:{value:f.cone}},vertexShader:je,fragmentShader:Pt}),K=new e.Mesh(j,$);K.frustumCulled=!1,K.renderOrder=3,o.add(K),w.push(K),i.copy(u),L=new e.Vector4(u.x,u.y,u.z,-(u.x*f.E[0]+u.y*14+u.z*b[E])-r)}return w}const Ft=`precision highp float;
  varying vec3 vP; uniform vec3 uCamC, uSkyL, uLP, uE; uniform vec4 uWN[5], uWX[5], uSlot; uniform float uK, uTime, uGain; ${ye}
  void main(){
    vec3 V=vP-uCamC; float sF=length(V); V/=max(sF,1e-3);
    float kx=uSkyL.x/uSkyL.y, kz=uSkyL.z/uSkyL.y, CY=${f.ceil.toFixed(1)}; const float XB4=${f.XB.toFixed(1)};
    float ax=uCamC.x+(CY-uCamC.y)*kx-uSlot.x, bx=V.x-V.y*kx, az=uCamC.z+(CY-uCamC.y)*kz, bz=V.z-V.y*kz;      // where the light through a point of the view ray left the ceiling
    float s0=0., s1=sF;
    if(abs(bx)>1e-5){ float ta=(-uSlot.y-ax)/bx, tb=(uSlot.y-ax)/bx; s0=max(s0,min(ta,tb)); s1=min(s1,max(ta,tb)); } else if(abs(ax)>uSlot.y) discard;
    if(abs(bz)>1e-5){ float ta=(uSlot.z-az)/bz, tb=(uSlot.w-az)/bz; s0=max(s0,min(ta,tb)); s1=min(s1,max(ta,tb)); } else if(az<uSlot.z || az>uSlot.w) discard;
    if(abs(V.y)>1e-5){ float ta=-uCamC.y/V.y, tb=(CY-uCamC.y)/V.y; s0=max(s0,min(ta,tb)); s1=min(s1,max(ta,tb)); }
    if(abs(V.x)>1e-5){ float tc=(73.-uCamC.x)/V.x; if(V.x>0.) s0=max(s0,tc); else s1=min(s1,tc); } else if(uCamC.x<73.) discard;   // only in arm two: never in the air in front of the paint
    float len=s1-s0; if(len<=0.) discard;
    float d0=(ax+bx*s0)/uSlot.y, d1=(ax+bx*s1)/uSlot.y;
    float I=len*max(1.-(d0*d0+d0*d1+d1*d1)/3., 0.);                                         // the ray's length in the sheet, weighted by a parabola across it
    float sm=.5*(s0+s1); vec3 pm=uCamC+V*sm; float zs=az+bz*sm, xs=ax+bx*sm;
    float ends=smoothstep(uSlot.z,uSlot.z+9.,zs)*(1.-smoothstep(uSlot.w-9.,uSlot.w,zs));
    float ray=vn(vec2(zs*.21+uTime*.035, xs*.5+uSlot.x))*.6+vn(vec2(zs*.63-uTime*.05, xs*1.3+7.))*.4;      // dust: striations along the light, drifting
    float cs=smoothstep(.52,.70, vn(vec2((pm.x*.5-pm.z*.86-uTime*8.)*.04, (pm.x*.86+pm.z*.5)*.022)));
    float dens=.55*(1.-exp(-I*.160))*(.15+1.50*ray*ray)*(1.-.75*cs)*ends*smoothstep(5.,26.,sm)*(.50+.50*smoothstep(0.,36.,pm.y))*smoothstep(73.,90.,pm.x);
    float K=uE.z-uLP.z, thr=1.;
    for(int j=0;j<5;j++){ float dn=dot(uWN[j].xyz,V); dn=abs(dn)<1e-4?1e-4:dn; float sj=-(dot(uWN[j].xyz,uCamC)+uWN[j].w)/dn;
      vec3 hj=uCamC+V*sj-uLP; float rj=K*length(hj.xy)/max(hj.z,1e-2);
      thr*=mix(1., smoothstep(uWX[j].w*1.02, uWX[j].w*1.30, rj), step(0.,sj));
      if(j==3){ vec3 hw=uCamC+V*sj; thr*=1.-.85*step(0.,sj)*step(hw.y,CY)*step(0.,hw.y)*step(XB4,hw.x); } }      // nothing veils the dark far wall: it stays the darkest thing in the room
    gl_FragColor=vec4(vec3(.90,.955,1.04)*uGain*dens*thr*uK, 1.);
  }`;function Lt(t,n,o){const R=t.uSkyL.value,y=R.x/R.y,s=R.z/R.y,b=f.ceil,T=-349.7,v=.06,r=3,c=[];for(let p=0;p<5;p++){const C=f.XB-8+15+30*p,u=-340,i=C>170?-256:-186,h=b-(u-T)/s,a=[[b,u],[b,i],[v,i-(b-v)*s],[v,T],[h,T]],l=[],w=[],L=new e.Vector3;for(const k of[-1,1])for(const[W,N]of a){const M=new e.Vector3(C+k*(r+.05)-(b-W)*y,W,N);l.push(M),L.add(M)}L.multiplyScalar(1/l.length);const E=new e.Vector3,F=new e.Vector3,V=new e.Vector3,d=(k,W,N)=>{E.subVectors(W,k),F.subVectors(N,k),E.cross(F),V.copy(k).sub(L);const M=E.dot(V)<0?[k,N,W]:[k,W,N];for(const j of M)w.push(j.x,j.y,j.z)};for(let k=1;k<4;k++)d(l[0],l[k],l[k+1]),d(l[5],l[5+k],l[5+k+1]);for(let k=0;k<5;k++){const W=(k+1)%5;d(l[k],l[W],l[5+k]),d(l[W],l[5+W],l[5+k])}const A=new e.BufferGeometry;A.setAttribute("position",new e.Float32BufferAttribute(w,3));const g=new e.ShaderMaterial({name:"pwys-sheet",fog:!1,side:e.BackSide,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,uniforms:{uCamC:{value:o},uSkyL:t.uSkyL,uLP:{value:new e.Vector3(...f.L)},uE:{value:new e.Vector3(...f.E)},uWN:t.uWN,uWX:t.uWX,uSlot:{value:new e.Vector4(C,r,u,i)},uK:t.uK,uTime:t.uTime,uGain:{value:.46}},vertexShader:je,fragmentShader:Ft}),m=new e.Mesh(A,g);m.frustumCulled=!1,m.renderOrder=3,n.add(m),c.push(m)}return c}function Bt(t,n,o){const R=[0,0,-.16,.035,.02,0,-.035,.02,0,0,-.03,0,0,0,.2,.03,.01,-.06,.2,.01,0,.03,.01,.06,.375,.01,.1,-.03,.01,-.06,-.2,.01,0,-.03,.01,.06,-.375,.01,.1],y=[0,0,0,0,0,0,.5,0,1,0,.5,0,1],s=[0,1,2,0,2,3,0,3,1,4,2,1,4,3,2,4,1,3,5,6,7,6,8,7,9,11,10,10,11,12],b=new e.BufferGeometry;b.setAttribute("position",new e.Float32BufferAttribute(R,3)),b.setAttribute("aWing",new e.Float32BufferAttribute(y,1)),b.setIndex(s);const T=[];for(let v=0;v<3;v++){const r=new e.ShaderMaterial({name:"pwys-bird",fog:!1,side:e.DoubleSide,uniforms:{uTime:n.uTime,uPhase:{value:v*2.1}},vertexShader:`attribute float aWing; uniform float uTime, uPhase; varying float vY;
        void main(){ vec3 p=position*1.5; float f=sin(uTime*17.+uPhase)*smoothstep(-.2,.3,sin(uTime*1.3+uPhase*2.));
          p.y+=aWing*(.16*f+.03); p.x*=1.-.18*aWing*abs(f); vY=aWing;
          gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(p,1.); }`,fragmentShader:`precision highp float; varying float vY;
        void main(){ gl_FragColor=vec4(mix(vec3(.05,.06,.09), vec3(.10,.12,.16), vY),1.); }`}),c=new e.Mesh(b,r);c.frustumCulled=!1,o.add(c),T.push(c)}return T}async function Rt(t,n){const{P:o,scene:R,path:y}=n,s=n.mirror?-1:1,b=(n.stopU??.23)*(n.uK??1),T=n.detail??t.quality?.detail??1,v=!!t.quality?.mobile,r=new e.Group;r.name="pwys-root",r.scale.x=s,r.updateMatrixWorld(!0);const c=new e.Group,p=new e.Group,C=new e.Group;r.add(c,p,C);const u=new e.Vector3(...o.sunDir).normalize(),i={uSun:{value:u},uSunCol:{value:new e.Color(o.sunCol).multiplyScalar(o.sunPower)},uFill:{value:new e.Color(o.fill).multiplyScalar(o.fillPower)},uShadow:{value:new e.Color(o.shadow)},uHaze:{value:new e.Color(o.haze)},uEye:{value:new e.Vector3(...f.S)},uTime:{value:0},uHazeK:{value:o.hazeK},uFront:{value:-72}},h=lt(t.noise),a=await it(t,h,u);await t.yield();const l=await ft(t,h,o,i,c,Math.round(2600*T*Math.min(n.density??1,1.1)*(o.treeKind==="fir"||!o.treeKind?1:.8)),a,s);await t.yield();const w=await ht(t,h,o,i,c,(G,ee,pe)=>a(G,ee,pe)*(ee<40?l.shade(G,pe):1));await t.yield(),o.boulders&&(dt(t,h,o,c,w,a),await t.yield()),pt(t,h,o,i,c,a),o.leafFall&&vt(t,o,i,c,T),mt(o,i,c);const L=wt(t,o,i,c);await t.yield();const E=new e.Vector2;t.renderer.getDrawingBufferSize(E);const F=v?1:1.5,V=G=>Math.min(v?F:Math.max(F,1700/Math.max(G,1)),2400/Math.max(G,1)),d=V(E.x),A=new e.WebGLRenderTarget(Math.max(8,Math.round(E.x*d)),Math.max(8,Math.round(E.y*d)),{type:e.HalfFloatType,format:e.RGBAFormat,minFilter:e.LinearFilter,magFilter:e.LinearFilter,generateMipmaps:!1,depthBuffer:!0,samples:v?0:4}),g=1.4,m=new e.PerspectiveCamera(62,t.aspect||16/9,.3,2600);m.layers.set(ze),m.position.set(f.S[0]*s,f.S[1],f.S[2]),m.updateMatrixWorld(!0),m.updateProjectionMatrix(),m.projectionMatrix.elements[0]/=g,m.projectionMatrix.elements[5]/=g,m.projectionMatrixInverse.copy(m.projectionMatrix).invert();const k={saved:!1,pos:new e.Vector3,quat:new e.Quaternion,proj:new e.Matrix4},W=new e.Vector3(0,10,0),N={uCamC:{value:W},uK:{value:0},uTime:i.uTime,uPlaster:{value:new e.Color("#F2EFE8").multiplyScalar(.72)},uFlag:{value:new e.Color("#C9C2B4").multiplyScalar(.78)},uDay:{value:new e.Vector3(-.4,-.42,-.81).normalize()},uMouth:{value:new e.Vector3(95,34,-315)},uBird:{value:[new e.Vector3(0,-99,0),new e.Vector3(0,-99,0),new e.Vector3(0,-99,0)]},uBirdV:{value:[new e.Vector3(1,0,0),new e.Vector3(1,0,0),new e.Vector3(1,0,0)]},uShR:{value:.8},uFin:{value:Array.from({length:5},()=>new e.Vector4(0,900,1,900))},uWN:{value:Array.from({length:5},()=>new e.Vector4(0,0,1,900))},uWX:{value:Array.from({length:5},()=>new e.Vector4(1,0,9e3,1))},uWT:{value:[.88,.6,.41,.28,.19]},uSkyL:{value:new e.Vector3(.36,.46,.81).normalize()}},M={...N,tPaint:{value:A.texture},uProj:{value:new e.Matrix4},uO:{value:new e.Vector3(...f.S)},uRingCol:{value:new e.Color(o.ring)},uSea1:{value:new e.Color(o.sea1)},uSea2:{value:new e.Color(o.sea2)},uFallCol:{value:new e.Color(o.fall)},uSwiftCol:{value:new e.Color(o.swift)},uRing:{value:new e.Vector4(...f.ring)},uPA:{value:new e.Vector4(Re.cx,Re.cz,Re.hx,Re.hz)},uPB:{value:new e.Vector4(Ae.cx,Ae.cz,Ae.hx,Ae.hz)},uPBrot:{value:new e.Vector4(de[0],de[1],be[0],be[1])},uSwift:{value:Array.from({length:7},()=>new e.Vector4(0,20,-190,.6))},uSwiftV:{value:Array.from({length:7},()=>new e.Vector3(1,0,0))},uFallZ:{value:f.fallZ},uBrush:{value:.8},uStop:{value:0}};if(Fe){const G=Qe();M.uStair={value:new e.Vector2(G.zA,G.D)}}if(Le){const G=et();M.uFarP={value:new e.Vector2(G.xs[0],G.xs[G.xs.length-1])}}const j=new e.ShaderMaterial({name:"pwys-hall",fog:!1,uniforms:M,vertexShader:je,fragmentShader:Mt}),$=new e.Mesh(Tt(),j);$.frustumCulled=!1,p.add($);const K=At(t,N,n.slants,p),I=Et(N,n.slants,p,W),S=Lt(N,p,W),B=Bt(t,i,C);n.rare&&B[2].scale.setScalar(1.6),await t.yield();const z=t.rng.fork("pwys-swifts"),O=[];for(let G=0;G<7;G++)O.push({c:[z.range(-16,16),z.range(9,24),f.S[2]-z.range(34,76)],r:[z.range(7,15),z.range(1.5,4.5),z.range(4,9)],w:z.range(.45,.8)*(z.chance(.5)?1:-1),ph:z.range(0,6.283),tilt:z.range(.6,1.6)});const q=(G,ee,pe)=>{const ie=G.ph+ee*G.w;return pe.set(G.c[0]+G.r[0]*Math.cos(ie),G.c[1]+G.r[1]*Math.sin(ie*2+G.tilt),G.c[2]+G.r[2]*Math.sin(ie))},D=[{c:[30,20,-226],r:[20,4,32],w:.42,ph:1},{c:[122,22,-306],r:[34,5,14],w:-.5,ph:2.2},{c:[104,20,-250],r:[12,5,22],w:.62,ph:4}],oe=(G,ee,pe)=>{const ie=G.ph+ee*G.w;return pe.set(G.c[0]+G.r[0]*Math.cos(ie),G.c[1]+G.r[1]*Math.sin(ie*2),G.c[2]+G.r[2]*Math.sin(ie))},ae=y.pointAt((b+.02)/(n.uK??1),new e.Vector3);ae.x*=s;const _=new e.Vector3(f.H[0]-ae.x,0,f.H[2]-ae.z).normalize(),X=new e.Vector3(-_.z,0,_.x),P=new e.Vector3,Z=new e.Vector3,x=new e.Vector3,re=new e.Matrix4,J=new e.Vector2,se=new e.Quaternion,Q=new e.Vector3,U=new e.Vector3,le={triangles:0,calls:0,trees:l.count},he=(G,ee,pe)=>Y(G,ee,pe),Ve=n.uK??1;function tt(G,ee,pe,ie,ve){const ue=ie*Ve;i.uTime.value=ee,i.uFront.value=-72-345*he(0,.2,ue)-700*he(.2,.5,ue),W.setFromMatrixPosition(pe.matrixWorld),W.x*=s;const ot=he(b,b+.016,ue),Oe=ue<b;M.uK.value=ot,M.uStop.value=Oe?0:1;for(let H=0;H<7;H++)q(O[H],ee,P),q(O[H],ee+.05,Z),M.uSwift.value[H].set(P.x,P.y,P.z,.6),M.uSwiftV.value[H].copy(Z).sub(P).normalize();C.visible=!Oe;let qe=0,Pe=0;for(let H=0;H<3;H++){if(oe(D[H],ee,P),oe(D[H],ee+.06,Z),H===0){const te=1-he(b+.045,b+.085,ue),ne=(ue-(b+.02))/.016*14;x.copy(ae).addScaledVector(_,6+Math.max(0,ne)*.5).addScaledVector(X,ne),x.y+=-.6+.02*ne,P.lerp(x,te),Z.lerp(x.addScaledVector(X,1).addScaledVector(_,.5),te);const ce=he(.335,.365,ue)*(1-he(.455,.49,ue)),fe=(ue-.345)/.11,Te=Math.sin(ee*1.9);x.set(ge(7,23,fe)+1.2*Te,ge(15.5,10.5,fe)+.5*Math.sin(ee*2.7),ge(-322,-258,fe)),P.lerp(x,ce),Z.lerp(x.set(x.x+.25,x.y-.05,x.z+1),ce)}if(H===1){const te=he(b-.004,b+.008,ue)*(1-he(b+.07,b+.11,ue)),ne=Math.min(30,Math.max(-6,(b+.0445-ue)/.03*6));N.uShR.value=.8+1.9*te,x.set(3.9+ne,18.4+.03*ne+.25*Math.sin(ee*2.3),-250.6+Math.abs(ne)*.15),P.lerp(x,te),Z.lerp(x.set(x.x-1,x.y,x.z+(ne<-2?.8:0)),te)}if(H===2){const te=he(.455,.49,ie)*(1-he(.53,.565,ie));if(B[2].scale.setScalar((n.rare?1.6:1)*(1+.6*he(.455,.49,ie))),Pe=1-te,te>0){const ne=.0125+.05*he(.56,.66,ie),ce=ee*1.5,fe=2.8;y.pointAt(Math.min(1,ie+ne),x),x.x*=s,x.y-=1.7,U.set(x.x+fe*Math.cos(ce+.07),x.y+.9*Math.sin(ce+1.07),x.z+fe*Math.sin(ce+.07)),x.set(x.x+fe*Math.cos(ce),x.y+.9*Math.sin(ce+1),x.z+fe*Math.sin(ce)),P.lerp(x,te),Z.lerp(U,te),qe=te*1.05}}if(H===2&&n.rare){const te=(n.uL??.81)*Ve,ne=he(te-.07,te-.015,ue);y.pointAt(ie+.015,x),x.x*=s,y.pointAt(ie+.017,U),U.x*=s;const ce=1.7*Math.cos(ee*1.3),fe=-2.8+1*Math.sin(ee*1.9);x.x+=ce,x.y+=fe,U.x+=ce-.9*Math.sin(ee*1.3),U.y+=fe+.95*Math.cos(ee*1.9),P.lerp(x,ne),Z.lerp(U,ne),qe=-ne*.6*Math.sin(ee*1.3),Pe*=1-ne}let Ee=H===2?qe:0;if(H<2){const te=H===1?he(.575,.615,ie):he(.6,.65,ie);if(te>0){y.pointAt(Math.min(ie,.75),x),x.x*=s;const ne=f.E[0]-x.x,ce=-251-x.z,fe=Math.max(Math.hypot(ne,ce),.001),Te=25-5*H,_e=13+5*H+42*he(.715,.755,ie),Xe=x.x+ne/fe*Te+ce/fe*_e,Ke=x.z+ce/fe*Te-ne/fe*_e,$e=10.5+5.5*H,We=ee*(H===0?.8:-.95)+H*2.3,De=We+(H===0?.06:-.06),Ne=4.2-H;x.set(Xe+Ne*Math.cos(We),$e+1.3*Math.sin(We*2+H),Ke+Ne*Math.sin(We)),U.set(Xe+Ne*Math.cos(De),$e+1.3*Math.sin(De*2+H),Ke+Ne*Math.sin(De)),P.lerp(x,te),Z.lerp(U,te)}B[H].scale.setScalar(Math.max(nt,1+.9*te)),Pe=te}U.set(W.x-P.x,W.y-P.y,W.z-P.z).normalize().multiplyScalar(.9*Pe),U.y+=1-.55*Pe,B[H].up.copy(U).normalize(),B[H].position.copy(P),B[H].lookAt(x.copy(P).applyMatrix4(r.matrixWorld).add(U.copy(Z).sub(P))),B[H].quaternion.normalize(),Ee!==0&&B[H].rotateZ(Ee),N.uBird.value[H].copy(P),Z.sub(P),Z.lengthSq()>1e-8&&N.uBirdV.value[H].copy(Z).normalize()}if(Oe?(pe.matrixWorld.decompose(m.position,m.quaternion,Q),m.projectionMatrix.copy(pe.projectionMatrix),m.projectionMatrix.elements[0]/=g,m.projectionMatrix.elements[5]/=g,m.projectionMatrixInverse.copy(m.projectionMatrix).invert(),ue>0&&(k.saved=!0,k.u=ue,k.pos.copy(m.position),k.quat.copy(m.quaternion),k.proj.copy(m.projectionMatrix))):k.saved&&b-k.u<.02?(m.position.copy(k.pos),m.quaternion.copy(k.quat),m.projectionMatrix.copy(k.proj),m.projectionMatrixInverse.copy(k.proj).invert()):(m.position.set(f.S[0]*s,f.S[1],f.S[2]),m.quaternion.identity(),m.projectionMatrix.copy(Ze),m.projectionMatrixInverse.copy(Ze).invert()),m.updateMatrixWorld(!0),M.uO.value.set(m.position.x*s,m.position.y,m.position.z),i.uEye.value.copy(M.uO.value),M.uProj.value.multiplyMatrices(m.projectionMatrix,m.matrixWorldInverse).multiply(r.matrixWorld),L.position.copy(M.uO.value),ue<.55&&ve){ve.getDrawingBufferSize(J);const H=V(J.x),Ee=Math.max(8,Math.round(J.x*H)),te=Math.max(8,Math.round(J.y*H));(A.width!==Ee||A.height!==te)&&A.setSize(Ee,te);const ne=ve.getRenderTarget(),ce=ve.info.render.triangles,fe=ve.info.render.calls,Te=ve.info.autoReset;ve.info.autoReset=!1,ve.setRenderTarget(A),ve.render(R,m),ve.setRenderTarget(ne),ve.info.autoReset=Te,le.triangles=ve.info.render.triangles-ce,le.calls=ve.info.render.calls-fe}}const Ze=m.projectionMatrix.clone();return{root:r,update:tt,stats:le,uniforms:M,valleyCam:m,target:A,dispose(){A.dispose()}}}export{Le as FAR_PIERS,f as GEO,ze as LAYER_VALLEY,rt as LEAF_LID,st as LEAF_NEAR,Fe as LEE_STAIR,Re as PIER_A,Ae as PIER_B,at as SWALLOW_SPAN,Rt as buildDevice,Ge as cutRadius,et as farPierPlan,Qe as stairPlan,lt as valleyShape};
