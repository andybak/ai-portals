import*as a from"three";import{clamp as We,lerp as K,smoothstep as q}from"../kit/core.js";const zt=["#05060D","#6B3FD0","#E8409A","#F2A0A8","#F6C27A","#27406B","#FF6A1F"],V=Math.PI*2,Z=Math.PI/180,x=(i=0,t=0,o=0)=>new a.Vector3(i,t,o),pt=29.87*Z,pe=Math.cos(pt),Pe=Math.sin(pt),ke=[1.84,.667],Ze=2.373,Le=[ke[0]-Pe*Ze,ke[1]+pe*Ze],le=3,Je=0,mt=1,dt=2,O=3,Tt=4,yt=5,Ft=6,Lt=7,et=8;class tt{constructor(){this.P=[],this.N=[],this.C=[],this.U=[],this.D=[],this.I=[],this.n=0,this.m=new a.Matrix4,this.s={m:0,c:[1,1,1],rnd:0,f:0,g:0}}style(t,o,h=0,w=0,p=0){return this.s={m:t,c:o,rnd:h,f:w,g:p},this}v(t,o,h,w,p,y,c=0,A=0,m=null){const r=this.m.elements,f=this.s;this.P.push(r[0]*t+r[4]*o+r[8]*h+r[12],r[1]*t+r[5]*o+r[9]*h+r[13],r[2]*t+r[6]*o+r[10]*h+r[14]);const d=r[0]*w+r[4]*p+r[8]*y,v=r[1]*w+r[5]*p+r[9]*y,e=r[2]*w+r[6]*p+r[10]*y,l=Math.hypot(d,v,e)||1;return this.N.push(d/l,v/l,e/l),this.C.push(f.c[0],f.c[1],f.c[2]),this.U.push(c,A),this.D.push(f.m,f.rnd,m===null?f.f:m,f.g),this.n++}quad(t,o,h,w){this.I.push(t,o,h,t,h,w)}get tris(){return this.I.length/3}lathe(t,o,h={}){const w=t.length,p=[];for(let c=0;c<w-1;c++){const A=t[c+1][0]-t[c][0],m=t[c+1][1]-t[c][1],r=Math.hypot(A,m)||1;p.push([m/r,-A/r])}let y=0;for(let c=0;c<w-1;c++){h.styles&&h.styles(c,this);const A=Math.hypot(t[c+1][0]-t[c][0],t[c+1][1]-t[c][1]),m=h.smooth&&c>0?[p[c][0]+p[c-1][0],p[c][1]+p[c-1][1]]:p[c],r=h.smooth&&c<w-2?[p[c][0]+p[c+1][0],p[c][1]+p[c+1][1]]:p[c],f=this.n;for(let d=0;d<=o;d++){const v=(h.a0||0)+((h.a1??V)-(h.a0||0))*(d/o),e=Math.cos(v),l=Math.sin(v);this.v(t[c][0]*e,t[c][0]*l,t[c][1],m[0]*e,m[0]*l,m[1],d/o,y),this.v(t[c+1][0]*e,t[c+1][0]*l,t[c+1][1],r[0]*e,r[0]*l,r[1],d/o,y+A)}for(let d=0;d<o;d++){const v=f+d*2;this.quad(v,v+2,v+3,v+1)}y+=A}return this}bevelBox(t,o,h,w){const p=t/2,y=o/2,c=p-w,A=y-w,m=h-w,r=(n,s,b)=>[[-n,-s,b],[n,-s,b],[n,s,b],[-n,s,b]],f=r(p,y,0),d=r(p,y,m),v=r(c,A,h),e=[[0,-1,0],[1,0,0],[0,1,0],[-1,0,0]];for(let n=0;n<4;n++){const s=(n+1)%4,b=e[n];let g=this.v(...f[n],...b,0,0),P=this.v(...f[s],...b,1,0),S=this.v(...d[s],...b,1,.8),L=this.v(...d[n],...b,0,.8);this.quad(g,P,S,L);const T=[b[0]*.7,b[1]*.7,.7];g=this.v(...d[n],...T,0,.8,1),P=this.v(...d[s],...T,1,.8,1),S=this.v(...v[s],...T,1,1,1),L=this.v(...v[n],...T,0,1,1),this.quad(g,P,S,L)}const l=v.map((n,s)=>this.v(...n,0,0,1,s===1||s===2?1:0,s>1?1:0));return this.quad(l[0],l[1],l[2],l[3]),this}tube(t,o,h=6){const w=x(.31,.9,.3).normalize(),p=x(),y=x(),c=x(),A=this.n;for(let m=0;m<t.length;m++){p.copy(t[Math.min(m+1,t.length-1)]).sub(t[Math.max(m-1,0)]).normalize(),y.crossVectors(p,w).normalize(),c.crossVectors(p,y);for(let r=0;r<=h;r++){const f=r/h*V,d=Math.cos(f),v=Math.sin(f),e=y.x*d+c.x*v,l=y.y*d+c.y*v,n=y.z*d+c.z*v;this.v(t[m].x+e*o,t[m].y+l*o,t[m].z+n*o,e,l,n,r/h,m/(t.length-1))}}for(let m=0;m<t.length-1;m++)for(let r=0;r<h;r++){const f=A+m*(h+1)+r;this.quad(f,f+1,f+h+2,f+h+1)}return this}build(){const t=new a.BufferGeometry;return t.setAttribute("position",new a.Float32BufferAttribute(this.P,3)),t.setAttribute("normal",new a.Float32BufferAttribute(this.N,3)),t.setAttribute("color",new a.Float32BufferAttribute(this.C,3)),t.setAttribute("uv",new a.Float32BufferAttribute(this.U,2)),t.setAttribute("aData",new a.Float32BufferAttribute(this.D,4)),t.setIndex(this.n>65535?new a.Uint32BufferAttribute(this.I,1):new a.Uint16BufferAttribute(this.I,1)),t.computeBoundingSphere(),t}}function Q(i,t,o=0,h=x()){const w=K(ke[0],Le[0],t)+pe*o,p=K(ke[1],Le[1],t)+Pe*o;return h.set(w*Math.sin(i),p,w*Math.cos(i))}function _e(i,t,o=0,h=0){const w=Math.sin(i),p=Math.cos(i),y=new a.Matrix4;return y.makeBasis(x(p,0,-w),x(-Pe*w,pe,-Pe*p),x(pe*w,Pe,pe*p)),h&&y.multiply(new a.Matrix4().makeRotationZ(h)),y.setPosition(Q(i,t,o))}function Bt(i,t,o){const h=new tt,w=new tt,p=new tt,y=new a.Matrix4().makeRotationX(-Math.PI/2),c=t==="foil"?[.52,.53,.56]:t==="gumdrop"?[.06,.062,.075]:[.5,.37,.24],A=t==="foil"?[.6,.58,.5]:t==="gumdrop"?[.11,.11,.125]:[.62,.6,.56],m=t==="foil"?1:t==="gumdrop"?2:0,r=[.3,.31,.34],f=[.035,.034,.04],d=[.105,.085,.078],v=128,e=[],l=4.8,n=[];for(let z=0;z<=9;z++){const C=1.868*Math.sin(z/9*Math.PI/2*.999+1e-4)**.9;e.push([C,l-Math.sqrt(l*l-C*C)-.0025]),n.push(Je)}for(const z of[[1.93,.415],[1.975,.47],[1.997,.535],[2,.59],[1.985,.64],[1.955,.675],[1.91,.692],[1.862,.694],[ke[0]+.004,ke[1]+.004]])e.push(z),n.push(Je);e.push([Le[0],Le[1]]),n.push(mt),e.push([.64,Le[1]+.035]),n.push(O),e.push([.64,le-.03]),n.push(O),e.push([.615,le]),n.push(O),e.push([.53,le]),n.push(O),e.push([.52,2.8]),n.push(et),e.push([0,2.8]),n.push(et),h.m.copy(y),h.lathe(e,v,{smooth:!0,styles:(z,C)=>{const N=n[z+1];C.style(N,N===Je?d:N===mt?f:N===O?r:f,0,0,m)}});const s={pod:[0,.17,.2],winA:[24*Z,.5,.21],winB:[-158*Z,.5,.21],thrL:[-90*Z,.36,.26],thrR:[90*Z,.36,.26],umb:[-40*Z,.26,.2]},b=i.range(-.2,.2),g=(z,C)=>{const N=Q(z,C),I=x();for(const U in s){const D=s[U];if(N.distanceTo(Q(D[0]+(U==="pod"?0:b),D[1],0,I))<D[2])return!0}return!1},P=[60,54,48,44,38,32,24],S=.025,L=.975,T=.014,F=x(),k=(z,C,N,I,U,D)=>(Q(z,C,N,F),h.v(F.x,F.y,F.z,pe*Math.sin(z),Pe,pe*Math.cos(z),I,U,D));h.m.identity();for(let z=0;z<P.length;z++){const C=K(S,L,z/P.length),N=K(S,L,(z+1)/P.length),I=P[z],U=i()*V,D=.0045,$=.004,ae=i.int(3,6),me=i.int(0,5);for(let H=0;H<I;H++){const J=U+H/I*V,Ve=U+(H+1)/I*V,Ie=(J+Ve)/2;if(g(Ie,(C+N)/2))continue;const G=K(ke[0],Le[0],(C+N)/2),ne=.011/G,be=.009/G,ue=((H+me)%(ae*2)<ae!=(z%2===0)?i.chance(.85):i.chance(.08))?A:c,ee=i.range(.82,1.08)*(i.chance(.06)?.6:1);h.style(dt,[ue[0]*ee,ue[1]*ee*i.range(.97,1.03),ue[2]*ee],i(),0,m);const de=[],Me=[],ie=[],te=[];for(let W=0;W<=2;W++){const ye=W/2,Ce=K(J+ne+be,Ve-ne-be,ye),Ne=K(J+ne,Ve-ne,ye);de.push(k(Ne,C+D,0,ye,0,1)),Me.push(k(Ce,C+D+$,T,ye,.04,0)),ie.push(k(Ce,N-D-$,T,ye,.96,0)),te.push(k(Ne,N-D,0,ye,1,1))}for(let W=0;W<2;W++)h.quad(de[W],de[W+1],Me[W+1],Me[W]),h.quad(Me[W],Me[W+1],ie[W+1],ie[W]),h.quad(ie[W],ie[W+1],te[W+1],te[W]);h.quad(de[0],Me[0],ie[0],te[0]),h.quad(Me[2],de[2],te[2],ie[2])}}return{G:h,cover:w,pod:p,feats:s,rot:b,yUp:y,metal:r,dark:f,tan:c,pale:A,skinF:m,blocked:g}}function Ct(i,t){const{G:o,cover:h,pod:w,feats:p,rot:y,yUp:c,metal:A,dark:m,skinF:r}=i,f=()=>new a.Matrix4,d=[.42,.43,.46],v=[.55,.4,.16];for(const s of["winA","winB"]){const b=p[s];o.m.copy(_e(b[0]+y,b[1],0)),o.style(O,d,t(),0,r).lathe([[.205,0],[.2,.034],[.165,.04],[.15,.034],[.146,.012]],28),o.style(Tt,[1,1,1],t()).lathe([[.146,.012],[1e-4,.012]],28);for(let g=0;g<12;g++){const P=g/12*V;o.m.copy(_e(b[0]+y,b[1],.03)).multiply(f().makeTranslation(Math.cos(P)*.183,Math.sin(P)*.183,0)),o.style(O,[.2,.2,.22]).lathe([[.009,0],[.009,.008],[1e-4,.011]],6)}}for(const s of["thrL","thrR"]){const b=p[s],g=s==="thrL"?-1:1,P=_e(b[0]+y,b[1],0);o.m.copy(P),o.style(O,[.26,.26,.28],t(),0,r).bevelBox(.4,.34,.075,.03);for(let S=0;S<4;S++){const L=S%2?1:-1,T=S<2?-1:1;o.m.copy(P).multiply(f().makeTranslation(L*.095,T*.075,.07)).multiply(f().makeRotationY(L*.5)).multiply(f().makeRotationX(-T*.3)),o.style(yt,[.1,.09,.09],t(),0,g).lathe([[.034,0],[.056,.085],[.048,.085],[.018,.012],[1e-4,.012]],14)}}{const s=p.umb,b=_e(s[0]+y,s[1],0);o.m.copy(b),o.style(O,d,t(),0,r).bevelBox(.3,.22,.03,.012);for(let g=0;g<6;g++)o.m.copy(b).multiply(f().makeTranslation((g%3-1)*.085,(g<3?-1:1)*.05,.03)),o.style(O,g%2?v:[.14,.14,.15],t()).lathe([[.026,0],[.026,.018],[.018,.022],[.012,.006],[1e-4,.006]],10)}o.m.identity();for(const[s,b,g]of[[-13,.33,.62],[52,.2,.52],[-64,.48,.8],[128,.3,.62],[-122,.3,.62],[9,.66,.9],[180,.12,.42]]){const P=[],S=s*Z+y;P.push(Q(S,b,.012),Q(S,b+.012,.055));for(let T=1;T<4;T++)P.push(Q(S,K(b+.012,g-.012,T/4),.055));P.push(Q(S,g-.012,.055),Q(S,g,.012)),o.style(O,d,t()).tube(P,.011,6);const L=[Q(S,(b+g)/2,.012),Q(S,(b+g)/2,.055)];o.tube(L,.008,5)}for(let s=0;s<3;s++){const b=[];for(let g=0;g<=10;g++)b.push(Q(y+(s*120+14+g*9.2)*Z,.945,g===0||g===10?.012:.05));o.style(O,d,t()).tube(b,.01,5)}const e=x(),l=x();for(let s=0;s<22;s++){const b=t.int(1,6),g=K(.025,.975,b/7),P=t()*V,S=t.range(.25,.6),L=K(ke[0],Le[0],g),T=S/L,F=t.range(.022,.034)/Ze;if(i.blocked(P+T/2,g))continue;const k=t.sign(),z=t.range(.25,.6),C=t.range(.03,.09);o.style(Ft,[.62,.63,.66],t());const N=o.n,I=8;for(let U=0;U<=I;U++){const D=U/I,$=P+T*(k>0?D:1-D),ae=q(1-z,1,D),me=.017+ae*ae*C;for(const H of[-1,1])Q($,g+H*F,me,l),e.set(pe*Math.sin($),Pe,pe*Math.cos($)),o.v(l.x,l.y,l.z,e.x,e.y,e.z,D,H*.5+.5,ae)}for(let U=0;U<I;U++){const D=N+U*2;o.quad(D,D+2,D+3,D+1)}}for(let s=0;s<3;s++){const b=s*V/3+.4;o.m.copy(c).premultiply(f().makeTranslation(Math.sin(b)*.27,2.8,Math.cos(b)*.27)),o.style(O,[.34,.33,.3],t()).lathe([[.085,0],[.085,.15],[.07,.16],[.06,.15],[.055,.03],[1e-4,.03]],12);const g=b+V/6,P=[];o.m.identity();for(let S=0;S<=12;S++){const L=S/12,T=Math.sin(L*Math.PI*4)*.07,F=.33+Math.cos(L*Math.PI*4)*.05;P.push(x(Math.sin(g+(L-.5)*.9)*F,2.84+.05+T*.6,Math.cos(g+(L-.5)*.9)*F))}o.style(Lt,[.62,.3,.1],t()).tube(P,.022,5),o.m.copy(c).premultiply(f().makeTranslation(Math.sin(g)*.585,le-.005,Math.cos(g)*.585)),o.style(O,d,t()).bevelBox(.07,.07,.045,.012)}o.m.copy(c).premultiply(f().makeTranslation(0,2.8,0)),o.style(O,[.3,.3,.32],t()).lathe([[.11,0],[.11,.1],[.07,.13],[1e-4,.13]],14);for(let s=0;s<6;s++){const b=s*V/6+y+.3;o.m.copy(c).premultiply(f().makeTranslation(Math.sin(b)*1.915,.69,Math.cos(b)*1.915)),o.style(O,[.2,.19,.19],t()).lathe([[.045,0],[.043,.016],[.032,.022],[1e-4,.022]],12)}o.m.identity(),h.m.copy(c).premultiply(f().makeTranslation(0,le,0)),h.style(dt,i.pale,.37,0,r).lathe([[.665,-.05],[.665,.03],[.62,.075],[.4,.115],[.16,.135],[1e-4,.14]],48,{smooth:!0}),h.style(et,m).lathe([[1e-4,-.05],[.665,-.05]],48);for(let s=0;s<12;s++){const b=s*V/12;h.m.copy(c).premultiply(f().makeTranslation(Math.sin(b)*.56,le+.085,Math.cos(b)*.56)),h.style(O,[.25,.25,.27]).lathe([[.016,0],[.016,.012],[1e-4,.016]],6)}const n=_e(0,p.pod[1],0);w.m.copy(n),w.style(O,d,.2).bevelBox(.2,.26,.022,.008),w.m.identity();for(const s of[-1,1])w.style(O,[.2,.2,.22],.5).tube([x(s*.07,-.09,.02),x(s*.06,-.14,.3),x(s*.045,-.2,.56)].map(b=>b.applyMatrix4(n)),.014,6);return w.tube([x(0,.09,.02),x(0,-.05,.3),x(0,-.2,.56)].map(s=>s.applyMatrix4(n)),.012,6),w.m.copy(n).multiply(f().makeTranslation(0,-.22,.52)),w.style(O,[.16,.16,.18],.8).bevelBox(.15,.2,.13,.02),w.m.copy(n).multiply(f().makeTranslation(0,-.12,.585)).multiply(f().makeRotationX(-Math.PI/2)),w.style(yt,[.05,.05,.06],0,0,0).lathe([[.042,0],[.042,.03],[.034,.034],[.03,.01],[1e-4,.01]],14),i}const De=`
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm(vec2 p){ return vn(p) * .5 + vn(p * 2.03 + 7.1) * .25 + vn(p * 4.1 + 3.3) * .125 + vn(p * 8.3 + 1.7) * .0625; }
`;function Nt(i){return new a.ShaderMaterial({fog:!0,side:a.DoubleSide,vertexColors:!0,uniforms:{...a.UniformsUtils.clone(a.UniformsLib.fog),...i},vertexShader:`
      attribute vec4 aData; uniform float uTime;
      varying vec3 vN, vWP, vLP, vCol; varying vec2 vUv; varying vec4 vData;
      #include <fog_pars_vertex>
      void main(){
        vec3 p = position;
        if (aData.x > 5.5 && aData.x < 6.5) p += normal * aData.z * aData.z * (0.012 + 0.03 * sin(uTime * (11. + aData.y * 9.) + position.x * 17. + position.z * 13.)) ;
        vLP = p; vUv = uv; vCol = color; vData = aData;
        vec4 wp = modelMatrix * vec4(p, 1.); vWP = wp.xyz; vN = normalize(mat3(modelMatrix) * normal);
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:De+`
      uniform float uTime, uFire, uLip, uWet, uGlossK; uniform vec2 uThr;
      uniform vec3 uSunDir, uSunCol, uSky, uBounce, uMag, uVio, uOra;
      varying vec3 vN, vWP, vLP, vCol; varying vec2 vUv; varying vec4 vData;
      #include <fog_pars_fragment>
      vec3 envc(vec3 r){ return mix(uBounce, uSky, smoothstep(-.25, .45, r.y)) + uSunCol * pow(max(dot(r, uSunDir), 0.), 48.) * 1.6; }
      void main(){
        vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
        vec3 V = normalize(cameraPosition - vWP);
        float mat = vData.x, rnd = vData.y, skin = vData.w;
        float az = atan(vLP.x, abs(vLP.z) < 1e-5 ? 1e-5 : vLP.z);
        vec3 alb = vCol, emi = vec3(0.); float gloss = .06, ao = 1., wet = 0., bead = 0.;
        float dim = 1. - .88 * uFire;
        vec2 c = vec2(az * 1.9, vUv.y) * 42.; float fw = fwidth(c.x) + fwidth(c.y), gw = fwidth(vLP.x) + fwidth(vLP.y) + fwidth(vLP.z);
        if (mat < .5) {                                   // char: honeycomb, cracks that cool from cherry to black
          vec2 r = vec2(1., 1.7320508), hh = r * .5, a = mod(c, r) - hh, b = mod(c - hh, r) - hh, g = dot(a, a) < dot(b, b) ? a : b;
          float cell = h21(floor((c - g) * 2.) + .5); g = abs(g);
          float hd = .5 - max(dot(g, vec2(.5, .8660254)), g.x);
          float honey = smoothstep(.02, .02 + .09 + fw, hd) * (1. - smoothstep(.35, 1.1, fw));
          float big = fbm(c * .055), cd = abs(fbm(c * .13 + 3.) - .47), crk = 1. - smoothstep(.0, .028 + fw * .01, cd), halo = 1. - smoothstep(0., .16, cd);
          alb = vCol * (.55 + .9 * big) * (1. + honey * (.5 + .7 * cell)) + vec3(.03, .015, .0) * big;
          float cool = vn(c * .06 + 9.) * .5 + .1, hot = smoothstep(cool - .2, cool + .3, uLip) * sqrt(max(uLip, 0.));
          emi += vec3(1.7, .13, .03) * crk * hot * (.7 + .6 * hot) + vec3(.75, .05, .012) * hot * (halo * .4 + hot * big * (1. - honey * .6) * .7);
          emi += uOra * uFire * (1.2 + 1.6 * smoothstep(.75, .2, vLP.y)) * (.5 + .5 * big);
          // out of the cloud the char is wet: dark and glossy in patches, beaded with water, rivulets creeping to the edge
          float lod = 1. - smoothstep(.25, .9, fw);
          float riv = smoothstep(.6, .8, vn(vec2(c.x * 1.1, c.y * .1 - uTime * .35))) * lod;
          // (beads at two sizes, each fading before its cells shrink to a pixel, so some always sparkle at the lip's range)
          float b1 = fw * 16., b2 = fw * 5., b3 = fw * 1.6, b4 = fw * .5;      // cells per pixel of each bead octave: one is always a few pixels wide
          bead = smoothstep(.89, .96, vn(c * 16. + 5.)) * smoothstep(.06, .12, b1) * (1. - smoothstep(.34, .6, b1)) + smoothstep(.89, .96, vn(c * 5. + 15.)) * smoothstep(.06, .12, b2) * (1. - smoothstep(.34, .6, b2))
            + smoothstep(.89, .96, vn(c * 1.6 + 25.)) * smoothstep(.06, .12, b3) * (1. - smoothstep(.34, .6, b3)) + smoothstep(.89, .96, vn(c * .5 + 35.)) * smoothstep(.06, .12, b4) * (1. - smoothstep(.34, .6, b4));
          wet = uWet;
          float tw = .2 + .8 * smoothstep(.35, .7, vn(c * 2.1 + vec2(uTime * 1.9, -uTime * 1.4)));
          alb *= mix(1., (.3 + .28 * big) * (1. - .45 * honey), wet);
          N = normalize(N + (vec3(vn(c * 1.9 + 1.), vn(c * 1.9 + 7.), vn(c * 1.9 + 13.)) - .5) * .1 * wet * lod);
          gloss = .03 + wet * (.05 + .05 * honey + .3 * riv);
          bead *= tw;
        } else if (mat < 1.5) { alb = vCol; ao = .6; }
        else if (mat < 2.5) {                             // tiles: bevel soot, fans streaming back, scorch near the shoulder
          float u = vUv.x, v = vUv.y, bev = vData.z;
          float fan = vn(vec2((u - .5) / (.3 + v) * 3.2 + rnd * 31., rnd * 7. + v * .7));
          float soot = pow(max(1. - v, 0.), 1.4) * smoothstep(.3, .75, fan) * .55 + smoothstep(.12, 0., min(u, 1. - u)) * .25 + smoothstep(.1, 0., 1. - v) * .2;
          float scorch = smoothstep(2.7, .8, vLP.y) * (.25 + .75 * fbm(vec2(az * 3., vLP.y * 2.5) + rnd));
          float grain = mix(.5, vn(vLP.xz * 160. + vLP.y * 90.), 1. - smoothstep(.12, .4, gw * 160.));      // (fades before it can alias into blotches)
          alb = vCol * (1. - .78 * clamp(soot + scorch * .55, 0., 1.)) * (.88 + .24 * grain) * (1. - .5 * bev);
          alb = mix(alb, alb * vec3(1.1, .82, .6), scorch * .6);
          if (skin > .5 && skin < 1.5) {                   // foil: fine crinkles (two octaves, each fading as it nears a pixel) catching thin highlights
            float k1 = 1. - smoothstep(.12, .4, gw * 70.), k2 = 1. - smoothstep(.12, .4, gw * 260.);
            N = normalize(N + (vec3(vn(vLP.xz * 70. + rnd * 9.), vn(vLP.yx * 70. + 3.), vn(vLP.zy * 70. + 5.)) - .5) * .2 * k1 + (vec3(vn(vLP.xz * 260. + 2.), vn(vLP.yx * 260. + 8.), vn(vLP.zy * 260. + 1.)) - .5) * .14 * k2);
            gloss = .75 * uGlossK;
          }
          if (skin > 1.5) gloss = .6 * uGlossK;
        } else if (mat < 3.5) { alb = vCol * (.8 + .4 * vn(vLP.xy * 60. + vLP.z * 40.)); gloss = .35; ao = 1. - .4 * vData.z; }
        else if (mat < 4.5) {                             // window: warm cabin light, one shadow moving inside
          float rho = 1. - vUv.y / .146, th = vUv.x * 6.2831853; vec2 q = rho * vec2(cos(th), sin(th));
          float bx = sin(uTime * .45 + rnd * 6.) * .55, sh = smoothstep(.5, .25, length((q - vec2(bx, -.35)) * vec2(1., .55))) + smoothstep(.22, .12, length(q - vec2(bx + .04, .28)));
          emi = vec3(2.6, 1.35, .5) * (1. - .85 * clamp(sh, 0., 1.)) * (.75 + .25 * smoothstep(1., .3, rho)) * (.8 + .2 * vn(q * 3. + 4.));
          alb = vec3(.02); gloss = .9;
        } else if (mat < 5.5) {                           // nozzles: glow when they fire
          float fire = vData.w < -.5 ? uThr.x : vData.w > .5 ? uThr.y : 0.;
          emi = mix(uVio, vec3(1.), .5) * fire * 3.5 * smoothstep(.0, .1, vUv.y); gloss = .3;
        } else if (mat < 6.5) { N = normalize(N + (vec3(vn(vUv * vec2(40., 6.) + rnd * 20.), vn(vUv * vec2(40., 6.) + 7.), 0.5) - .5) * .5 * mix(.45, 1., uGlossK)); gloss = .85 * mix(.6, 1., uGlossK); }
        else if (mat < 7.5) { alb = vCol * (.7 + .3 * step(.5, fract(vUv.y * 40.))); }
        else { ao = .5; }
        float ndl = dot(N, uSunDir), rim = pow(max(1. - max(dot(N, V), 0.), 0.), 4.);
        vec3 amb = mix(uBounce, uSky, N.y * .5 + .5) * dim * ao;
        vec3 col = alb * (uSunCol * max(ndl, 0.) * dim + amb);
        col += envc(reflect(-V, N)) * dim * gloss * (.25 + .75 * rim) * ao;
        if (wet > 0.) {                                   // a sharp sun glint, a rim in the key colour on the sun side, sparkling beads
          float sl = clamp(ndl * .5 + .5, 0., 1.), sr = max(dot(reflect(-V, N), uSunDir), 0.), s2 = sr * sr, s8 = s2 * s2 * s2 * s2;
          float edge = 1. - max(dot(N, V), 0.); edge *= edge * edge;
          col += uSunCol * (s8 * s8 * s8 * s8 * s8 * (.4 + 3. * gloss) + (edge * .4 + rim * 1.1) * sl * sl * 1.2 + bead * (.7 + 2.6 * sl * sl)) * wet * dim;
        }
        // plasma wash: magenta and violet bands pouring up the wall, orange at the shock edge
        float bnd = vn(vec2(az * 2.2 + 1.3, vLP.y * 1.1 - uTime * 7.)), bnd2 = vn(vec2(az * 5. - 2., vLP.y * 2.4 - uTime * 13.));
        vec3 pl = mix(uVio, uMag, smoothstep(.3, .7, bnd)) * (.75 + .5 * bnd2) + uOra * smoothstep(1.3, .5, vLP.y) * .9;
        col += (alb * 1.5 + .03 + gloss * .5 * rim) * pl * uFire * (.55 + .45 * max(dot(N, normalize(vec3(vLP.x, .3, vLP.z) + 1e-4)), 0.)) * ao;
        col += emi;
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}const Oe=48,Be=10,xt=50,oe=64,gt=6;function Ut(){const i=r=>100*Z*Math.pow(r,2.4),t=(r,f,d)=>{const v=new Float32Array(oe),e=new Float32Array(oe),l=d/(oe-1);v[0]=f;for(let n=1;n<oe;n++){const s=r((n-.5)/(oe-1));v[n]=v[n-1]+l*Math.cos(s),e[n]=e[n-1]+l*Math.sin(s)}return{r:v,z:e}},o=t(i,0,1),h=(17.5-1.5)/o.r[oe-1],w=(r,f,d)=>{let v=.05,e=1.6;for(let l=0;l<40;l++){const n=(v+e)/2;t(r(n),f,h).r[oe-1]>d?v=n:e=n}return t(r((v+e)/2),f,h)},p=(r,f)=>d=>v=>d*(1-Math.exp(-Math.pow(v/r,f)))/(1-Math.exp(-Math.pow(1/r,f))),y=[w(p(.03,1),.16,.34),w(p(.07,1.2),.45,2),w(p(.2,1.7),.8,7),t(i,1.5,h),w(r=>f=>r*Math.pow(f,3),1.6,19)];y.push(y[4]);const c=new Uint16Array(oe*gt*4),A=[];y.forEach((r,f)=>{const d=r.r[oe-1],v=Math.sqrt(xt*xt-d*d),e=r.z[oe-1];for(let l=0;l<oe;l++){const n=(f*oe+l)*4;c[n]=a.DataUtils.toHalfFloat(r.r[l]),c[n+1]=a.DataUtils.toHalfFloat(v+e-r.z[l]),c[n+2]=0,c[n+3]=a.DataUtils.toHalfFloat(1)}A.push({rSkirt:d,hSkirt:v,hCrown:v+e})});const m=new a.DataTexture(c,oe,gt,a.RGBAFormat,a.HalfFloatType);return m.minFilter=m.magFilter=a.LinearFilter,m.wrapS=m.wrapT=a.ClampToEdgeWrapping,m.generateMipmaps=!1,m.needsUpdate=!0,{tex:m,info:A,S:h}}const wt=`
uniform sampler2D uProf; uniform float uStage, uExtend, uTime, uPhase, uRipple, uRipA, uTremble, uBulge, uSquash, uInward;
uniform vec3 uOrigin, uAxis, uE1, uE2;
vec2 prof(float s){ return textureLod(uProf, vec2((clamp(s, 0., 1.) * 63. + .5) / 64., (uStage + .5) / 6.), 0.).xy; }
// pan = (gore, ring, s0, s1); a across the gore 0..1; v down the sail 0..1
vec3 canopyPoint(vec4 pan, float a, float v){
  float s = mix(pan.z, pan.w, v) - step(8.5, pan.y) * v * a * (1. - a) * .1;
  float th = (pan.x + a) * 0.1308997 + uPhase;
  vec2 p = prof(s), t = prof(s + .025) - prof(s - .025);
  vec2 mn = vec2(-t.y, t.x); mn /= max(length(mn), 1e-5);
  float w = p.x * .0654;
  float d = uBulge * w * 4. * a * (1. - a) * (.4 + 1.0 * v * v);
  float rp = (s - (1.15 - uRipple * 1.4)) / .1; d += uRipA * exp(-rp * rp);
  d += uTremble * (.22 * sin(s * 38. - uTime * 23. + pan.x * 1.7) + .16 * sin(s * 15. + uTime * 31. + pan.x * .9)) * min(1., p.x * .6);
  float sq = max(cos(th - uInward), 0.);
  float r = p.x * (1. + .014 * sin(pan.x * 2.4 + uPhase * 7.)) * (1. - uSquash * sq * sq * sq) * step(1e-4, uExtend) + mn.x * d * step(1e-4, uExtend);
  float h = (p.y + mn.y * d) * uExtend;
  vec3 whip = (uE1 * sin(h * .21 - uTime * 8.3 + uPhase * 3.) + uE2 * sin(h * .17 - uTime * 6.9 + uPhase * 5.)) * uTremble * smoothstep(0., 30., h) * 1.1;
  return uOrigin + uAxis * h + (cos(th) * uE1 + sin(th) * uE2) * r + whip;
}
`,bt=i=>{const t=i<4?.011:.0035;return[i/Be+(i===0?0:t),(i+1)/Be-(i===Be-1?0:t)]};function _t(i,t){const p=Oe*Be*20,y=new Float32Array(p*4),c=new Float32Array(p*3),A=[],m=i.pick([4,4,6,8]),r=i.pick([2,2,3]),f=i.int(0,7),d=i.int(0,15);let v=0;for(let l=0;l<Oe;l++)for(let n=0;n<Be;n++){let s;t==="quarters"?s=(Math.floor(l/12)+(n>=8?1:0))%2===0:t==="onegore"?s=(l+d)%16<2||n===0||n===Be-1&&l%4<2:s=n<2?!0:(Math.floor((l+f)/m)+Math.floor(n/r))%2===0;const[b,g]=bt(n),P=v;for(let S=0;S<=3;S++)for(let L=0;L<=4;L++)y[v*4]=l,y[v*4+1]=n,y[v*4+2]=b,y[v*4+3]=g,c[v*3]=L/4,c[v*3+1]=S/3,c[v*3+2]=s?1:0,v++;for(let S=0;S<3;S++)for(let L=0;L<4;L++){const T=P+S*5+L;A.push(T,T+4+1,T+1,T+1,T+4+1,T+4+2)}}const e=new a.BufferGeometry;return e.setAttribute("position",new a.BufferAttribute(new Float32Array(p*3),3)),e.setAttribute("aPan",new a.BufferAttribute(y,4)),e.setAttribute("aAv",new a.BufferAttribute(c,3)),e.setIndex(A),e.boundingSphere=new a.Sphere(x(0,40,-25),120),e}function Dt(i){return new a.ShaderMaterial({fog:!0,side:a.DoubleSide,uniforms:{...a.UniformsUtils.clone(a.UniformsLib.fog),...i},vertexShader:wt+`
      attribute vec4 aPan; attribute vec3 aAv;
      varying vec3 vN, vWP; varying vec4 vPan; varying vec3 vAv; varying float vS;
      #include <fog_pars_vertex>
      void main(){
        vec3 P0 = canopyPoint(aPan, aAv.x, aAv.y), Pa = canopyPoint(aPan, aAv.x + .08, aAv.y), Pv = canopyPoint(aPan, aAv.x, aAv.y + .1);
        vec3 n = cross(Pv - P0, Pa - P0); n /= max(length(n), 1e-6);
        vPan = aPan; vAv = aAv; vS = mix(aPan.z, aPan.w, aAv.y);
        vec4 wp = modelMatrix * vec4(P0, 1.); vWP = wp.xyz; vN = normalize(mat3(modelMatrix) * n + 1e-6);
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:De+`
      uniform vec3 uSunDir, uSunCol, uSky, uBounce, uOrange, uWhite; uniform float uGlow, uFlash;
      varying vec3 vN, vWP; varying vec4 vPan; varying vec3 vAv; varying float vS;
      #include <fog_pars_fragment>
      void main(){
        vec3 N = normalize(vN), V = normalize(cameraPosition - vWP);
        float inside = gl_FrontFacing ? 0. : 1.; vec3 Nf = gl_FrontFacing ? N : -N;
        float a = vAv.x, v = vAv.y, fa = fwidth(a), fv = fwidth(v);
        float ea = min(a, 1. - a), ev = min(v, 1. - v);
        float tape = 1. - smoothstep(.035, .035 + fa * 1.5, ea), hem = 1. - smoothstep(.05, .05 + fv * 1.5, ev);
        float seam = max(tape, hem) * (1. - smoothstep(.5, 1.6, fa * 8.));
        float fade = 1. - smoothstep(.15, .6, fa * 4.);
        float rip = (smoothstep(.42, .5, abs(fract(a * 6.) - .5)) + smoothstep(.42, .5, abs(fract(v * 5.) - .5))) * .5 * fade;
        float crease = vn(vec2(vPan.x * 3.1 + a * 3., vS * 46.)) * .6 + vn(vec2((vPan.x + a) * 9., vS * 17. + vPan.y)) * .4;
        vec3 alb = mix(uWhite, uOrange, vAv.z) * (.86 + .22 * crease) * (1. - .1 * rip);
        alb *= 1. - .3 * seam;
        // light: sun on the lit face, sun THROUGH the cloth on the far face, blue-violet skyshine in shadow
        float ndl = dot(Nf, uSunDir), lit = max(ndl, 0.), thru = pow(max(-ndl, 0.), .55);
        float lsh = 1. - .4 * smoothstep(.45, .75, vS) * (1. - smoothstep(.03, .06 + fa, abs(fract(vPan.x + a + (1. - vS) * 5.5) - .5)));
        vec3 tcol = mix(vec3(.80, .72, .62), vec3(1., .215, .02), vAv.z) * (.8 + .35 * crease);
        vec3 col = alb * mix(vec3(1.), tcol * .45, inside) * uSunCol * lit;
        col += tcol * uSunCol * thru * uGlow * mix(.5, 1., inside) * (1. - .72 * seam) * lsh * (1. - .18 * rip);
        vec3 amb = mix(uBounce, uSky, Nf.y * .5 + .5);
        col += alb * amb * (.75 + .25 * inside) + alb * alb * uSunCol * .12 * inside;
        col += alb * uFlash * vec3(1.6, 1.2, .8) * smoothstep(40., 0., length(vWP - cameraPosition));
        col = min(col, vec3(1.6, 1.3, 1.1));
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}function Vt(i){const h=[],w=[],p=[];let y=0;const c=(m,r,f)=>{const d=y;for(let v=0;v<=f;v++)for(const e of[-1,1])h.push(m,v/f,e,r),w.push(0,0),y++;for(let v=0;v<f;v++){const e=d+v*2;p.push(e,e+1,e+2,e+2,e+1,e+3)}};for(let m=0;m<Oe;m++)c(m,0,14);c(0,1,4);for(let m=0;m<14;m++){const r=i.int(0,Oe-1),f=i.range(.25,.95),d=i(),v=i.range(.6,1.4);for(let e=0;e<4;e++)h.push(r,f,e,2),w.push(d,v);p.push(y,y+1,y+2,y,y+2,y+3),y+=4}const A=new a.BufferGeometry;return A.setAttribute("position",new a.BufferAttribute(new Float32Array(y*3),3)),A.setAttribute("aL",new a.Float32BufferAttribute(h,4)),A.setAttribute("aS",new a.Float32BufferAttribute(w,2)),A.setIndex(p),A.boundingSphere=new a.Sphere(x(0,40,-25),120),A}function It(i){const[t,o]=bt(Be-1);return new a.ShaderMaterial({fog:!0,side:a.DoubleSide,transparent:!0,depthWrite:!1,uniforms:{...a.UniformsUtils.clone(a.UniformsLib.fog),...i},vertexShader:wt+`
      attribute vec4 aL; attribute vec2 aS;
      uniform float uSag, uWaveF, uWaveA, uPuff, uDeploy, uResY; uniform vec3 uFit;
      varying vec4 vInfo; varying vec2 vQ; varying vec3 vWP;
      #include <fog_pars_vertex>
      vec3 linePoint(float gore, float f){
        vec3 sk = canopyPoint(vec4(gore, 9., ${t.toFixed(4)}, ${o.toFixed(4)}), 0., 1.);
        vec3 d = sk - uOrigin; float len = length(d);
        float th = gore * 0.1308997 + uPhase; vec3 rad = cos(th) * uE1 + sin(th) * uE2;
        vec3 p = uOrigin + d * f;
        float bow = sin(f * 3.14159);
        float slack = uSag * len * .11, mouth = length(d - uAxis * dot(d, uAxis));
        // slack lines belly inward and droop (seen from the capsule, a line that bows outward is a hoop wider than its canopy)
        float inw = min(bow * slack, mouth * f * .55);
        p += (uE1 * .3 * sin(gore * 1.3 + uTime * 2.1) - rad * (.6 + .4 * sin(gore * 2.7))) * inw - uAxis * (.5 * bow * slack);
        float wv = (f - uWaveF) / .09; p += rad * uWaveA * exp(-wv * wv) * sin(f * 70. - uTime * 30.) * 1.2;
        p += rad * bow * .05 * sin(f * 24. - uTime * 37. + gore) * (1. - uSag);
        return p;
      }
      void main(){
        float kind = aL.w; vec3 P, T = vec3(0., 1., 0.); float half0 = .022, alpha = 1.; vQ = vec2(0.);
        if (kind < .5) { P = linePoint(aL.x, aL.y); T = linePoint(aL.x, aL.y + .03) - P; }
        else if (kind < 1.5) { P = mix(uFit, uOrigin, aL.y * uDeploy); T = uOrigin - uFit; half0 = .05; alpha = step(.01, uDeploy); }
        else {
          P = linePoint(aL.x, aL.y);
          float th = aL.x * 0.1308997 + uPhase; P += (cos(th) * uE1 + sin(th) * uE2) * (.4 + 2.2 * uPuff) * (aS.x - .3) + uAxis * (-1.5 * uPuff * aS.x);
        }
        vec4 mv = viewMatrix * modelMatrix * vec4(P, 1.);
        float dist = max(-mv.z, .05), px = 2. * dist / (projectionMatrix[1][1] * uResY);
        if (kind < 1.5) {
          vec3 tv = mat3(viewMatrix) * mat3(modelMatrix) * T, sdir = cross(tv, mv.xyz); sdir /= max(length(sdir), 1e-6);
          float hw = max(half0, .8 * px); alpha *= clamp(half0 / hw, .14, 1.);
          mv.xyz += sdir * aL.z * hw * step(1e-4, uExtend); vQ = vec2(aL.z, aL.y);
        } else {
          vec2 c = vec2(aL.z < .5 || aL.z > 2.5 ? -1. : 1., aL.z < 1.5 ? -1. : 1.);
          float sz = aS.y * (.4 + 2.3 * sqrt(max(uPuff, 0.))) * step(.001, uPuff);
          mv.xy += c * sz; vQ = c; alpha = (1. - uPuff) * (1. - uPuff) * smoothstep(0., .06, uPuff) * .26;
        }
        vInfo = vec4(kind, alpha, aS.x, aL.y); vWP = (modelMatrix * vec4(P, 1.)).xyz;
        vec4 mvPosition = mv; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:De+`
      uniform vec3 uSunDir, uSunCol, uSky, uBounce; uniform float uTime;
      varying vec4 vInfo; varying vec2 vQ; varying vec3 vWP;
      #include <fog_pars_fragment>
      void main(){
        vec3 col; float al = vInfo.y;
        if (vInfo.x < 1.5) {
          float e = 1. - abs(vQ.x);
          col = vec3(.74, .70, .62) * (uSunCol * (.35 + .4 * e) + mix(uBounce, uSky, .6));
          if (vInfo.x > .5) col *= vec3(1., .62, .34) * (.7 + .3 * step(.5, fract(vQ.y * 30.)));
        } else {
          float r = length(vQ), puff = (1. - smoothstep(.15, 1., r)) * (.45 + .55 * fbm(vQ * 2.2 + vInfo.z * 17. + uTime * .3));
          col = vec3(.95, .97, 1.) * (uSunCol * .6 + uSky * 1.2 + .15); al *= puff;
        }
        if (al < .003) discard;
        gl_FragColor = vec4(col, al);
        #include <fog_fragment>
      }`})}const ze=24,je=16;function Wt(i,t,o){const h=[],w=[],p=[],y=[],c=[];let A=0;const m=9,r=e=>[.45+3.05*Math.sin(e*1.25)/Math.sin(1.25),ze+6+2.6*(1-e*e)],f=(e,l,n,s,b,g,P,S,L,T)=>(h.push(e,l,n),w.push(s,b,g),p.push(P[0],P[1],P[2]),y.push(S,L,T,0),A++);for(let e=0;e<m;e++){const l=(e+.14)/m,n=(e+.86)/m,s=e%3===1?o:t;for(let b=0;b<je;b++){const g=A;for(let P=0;P<=3;P++){const S=(b+P/3)/je*V,L=1+.07*Math.sin(P/3*Math.PI);for(const T of[l,n]){const[F,k]=r(T),z=.55;f(Math.sin(S)*F*L,k,Math.cos(S)*F*L,Math.sin(S)*z,.84,Math.cos(S)*z,s,0,0,T)}}for(let P=0;P<3;P++){const S=g+P*2;c.push(S,S+2,S+1,S+1,S+2,S+3)}}}for(let e=0;e<je;e++){const l=e/je*V,n=Math.sin(l),s=Math.cos(l),b=A,g=.05;for(let F=0;F<=6;F++){const[k,z]=r(F/6);for(const C of[-1,1])f(n*(k+.02)+s*C*g,z+.02,s*(k+.02)-n*C*g,n*.55,.84,s*.55,[.5,.42,.34],0,0,F/6)}for(let F=0;F<6;F++){const k=b+F*2;c.push(k,k+2,k+1,k+1,k+2,k+3)}const[P,S]=r(1),L=x(n*P,S-ze,s*P).normalize(),T=A;for(let F=0;F<=3;F++){const k=F/3;for(const z of[-1,1])f(n*P*k,ze+(S-ze)*k,s*P*k,L.x,L.y,L.z,[.72,.68,.6],1,z,k)}for(let F=0;F<3;F++){const k=T+F*2;c.push(k,k+2,k+1,k+1,k+2,k+3)}}const d=A;for(let e=0;e<=8;e++)for(const l of[-1,1])f(0,ze*(e/8),0,0,1,0,[.8,.5,.25],1,l*1.8,0);for(let e=0;e<8;e++){const l=d+e*2;c.push(l,l+2,l+1,l+1,l+2,l+3)}const v=new a.BufferGeometry;return v.setAttribute("position",new a.Float32BufferAttribute(h,3)),v.setAttribute("normal",new a.Float32BufferAttribute(w,3)),v.setAttribute("color",new a.Float32BufferAttribute(p,3)),v.setAttribute("aK",new a.Float32BufferAttribute(y,4)),v.setIndex(c),v.boundingSphere=new a.Sphere(x(0,16,0),40),v}function Et(i){return new a.ShaderMaterial({fog:!0,side:a.DoubleSide,vertexColors:!0,uniforms:{...a.UniformsUtils.clone(a.UniformsLib.fog),...i},vertexShader:`
      attribute vec4 aK; uniform float uTime, uOpen, uLen, uSpin, uResY;
      varying vec3 vN, vWP, vCol; varying vec2 vK;
      #include <fog_pars_vertex>
      void main(){
        vec3 p = position; float top = max(p.y - ${ze.toFixed(1)}, 0.);
        float m = mix(.07, 1., uOpen) * (1. + .05 * sin(uTime * 6.3 + uSpin) * uOpen);
        p.xz *= m; p.y = min(p.y, ${ze.toFixed(1)}) + top * mix(1.3, 1., uOpen);
        p.xz += (1. - uOpen) * .5 * vec2(sin(p.y * .5 - uTime * 19.), cos(p.y * .43 - uTime * 16.)) * smoothstep(0., 20., p.y);
        p.xz += vec2(sin(top * 9. + uTime * 27. + position.x), cos(top * 8. + uTime * 23.)) * .05 * step(.01, top) * (1.3 - uOpen);
        float ca = cos(uSpin), sa = sin(uSpin); p.xz = mat2(ca, -sa, sa, ca) * p.xz; p.y *= uLen; p.xz *= step(1e-4, uLen);
        vec3 nn = normal; nn.xz = mat2(ca, -sa, sa, ca) * nn.xz;
        vec4 wp = modelMatrix * vec4(p, 1.), mv = viewMatrix * wp;
        if (aK.x > .5) {
          vec3 tv = mat3(viewMatrix) * mat3(modelMatrix) * nn, sd = cross(tv, mv.xyz); sd /= max(length(sd), 1e-6);
          float px = 2. * max(-mv.z, .05) / (projectionMatrix[1][1] * uResY);
          mv.xyz += sd * sign(aK.y) * max(.016 * abs(aK.y), .75 * px) * step(1e-4, uLen);
        }
        vWP = wp.xyz; vN = normalize(mat3(modelMatrix) * nn); vCol = color; vK = aK.xz;
        vec4 mvPosition = mv; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunDir, uSunCol, uSky, uBounce; uniform float uGlow, uFlash;
      varying vec3 vN, vWP, vCol; varying vec2 vK;
      #include <fog_pars_fragment>
      void main(){
        vec3 col;
        if (vK.x > .5) col = vCol * (uSunCol * .6 + mix(uBounce, uSky, .6));
        else {
          vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
          float ndl = dot(N, uSunDir), e = min(fract(vK.y * 9.) , 1. - fract(vK.y * 9.));
          vec3 t = pow(vCol, vec3(1.25)) * 1.25;
          col = vCol * uSunCol * max(ndl, 0.) + t * uSunCol * pow(max(-ndl, 0.), .55) * uGlow + vCol * mix(uBounce, uSky, N.y * .5 + .5);
          col += vCol * uFlash * vec3(1.6, 1.2, .8);
          col = min(col, vec3(1.75, 1.5, 1.3));
        }
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}const Ee=`
uniform float uTime, uFire, uTear, uTail; uniform vec3 uMag, uVio, uOra, uBend; uniform vec4 uKinkA, uKinkB;
vec3 bendAt(float y){ return uBend * (1. - exp(-max(y + .8, 0.) / 6.)); }
vec3 kink(float y){
  float a = (y - 4. - uKinkA.z * 85.) / 9., b = (y - 4. - uKinkB.z * 85.) / 9.;
  return vec3(uKinkA.x, 0., uKinkA.y) * uKinkA.w * exp(-a * a) + vec3(uKinkB.x, 0., uKinkB.y) * uKinkB.w * exp(-b * b);
}
float wakeR(float y){ return mix(3.75, 2.5, smoothstep(2., 46., y)); }
`;function Rt(i,t,o){const h=new a.Group,w=[[.001,-.9],[1,-.86],[1.9,-.68],[2.7,-.34],[3.25,.3],[3.75,1.2],[4.25,2.6],[4.65,4.4],[4.75,6.5],[4.45,10],[3.8,17],[3.2,27],[2.8,40],[2.5,58],[2.5,80]],p=64,y=44,c=[],A=[],m=[],r=[],f=F=>{const k=F*(w.length-1),z=Math.min(w.length-2,Math.floor(k)),C=k-z,N=C*C*(3-2*C)*.5+C*.5;return[K(w[z][0],w[z+1][0],N),K(w[z][1],w[z+1][1],N)]};for(let F=0;F<=y;F++){const k=Math.pow(F/y,1.25),[z,C]=f(k),[N,I]=f(Math.min(1,k+.01)),[U,D]=f(Math.max(0,k-.01)),$=N-U,ae=I-D,me=Math.hypot($,ae)||1;for(let H=0;H<=p;H++){const J=H/p*V;c.push(Math.sin(J)*z,C,Math.cos(J)*z),A.push(Math.sin(J)*ae/me,-$/me,Math.cos(J)*ae/me),m.push(H/p,C)}}for(let F=0;F<y;F++)for(let k=0;k<p;k++){const z=F*(p+1)+k;r.push(z,z+1,z+p+1,z+1,z+p+2,z+p+1)}const d=new a.BufferGeometry;d.setAttribute("position",new a.Float32BufferAttribute(c,3)),d.setAttribute("normal",new a.Float32BufferAttribute(A,3)),d.setAttribute("uv",new a.Float32BufferAttribute(m,2)),d.setIndex(r),d.boundingSphere=new a.Sphere(x(0,40,0),60);const v={transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,side:a.DoubleSide},e=new a.Mesh(d,new a.ShaderMaterial({...v,uniforms:o,vertexShader:Ee+`
      varying vec3 vN, vWP; varying vec2 vUv;
      void main(){ vec3 p = position + kink(position.y) * smoothstep(3., 12., position.y) + bendAt(position.y); vUv = uv; vN = normalize(mat3(modelMatrix) * normal); vec4 wp = modelMatrix * vec4(p, 1.); vWP = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:De+Ee+`
      varying vec3 vN, vWP; varying vec2 vUv;
      void main(){
        float y = vUv.y, az = vUv.x * 6.2831853;
        float edge = 1. - abs(dot(normalize(vN), normalize(cameraPosition - vWP)));
        float tw = az * 9. + y * .42 + uTime * .8;
        float strand = .5 + .5 * cos(tw), s2 = .5 + .5 * cos(tw * .3333 + 1.7);
        float f1 = vn(vec2(vUv.x * 46., y * .16 - uTime * 5.)), f2 = vn(vec2(vUv.x * 110. + 3., y * .38 - uTime * 11.)), f3 = vn(vec2(vUv.x * 230., y * .9 - uTime * 23.));
        float streak = smoothstep(.45, .9, f1) * (.35 + .65 * strand) + smoothstep(.6, .95, f2) * .55 + smoothstep(.72, .98, f3) * .5;
        vec3 col = mix(uVio, uMag, smoothstep(.3, .7, s2));
        col = mix(col, uOra * 1.4, clamp(smoothstep(1.8, -.5, y) * .85 + smoothstep(.75, .98, f3) * .5, 0., 1.));
        float body = exp(-max(y - 2., 0.) / 11.) * smoothstep(80., 40., y);
        float shred = smoothstep(uTear * 1.25 - .25, uTear * 1.25, fbm(vec2(vUv.x * 7., y * .12 - uTime * 2.) + 5.));
        float I = streak * (.1 + 1.25 * edge * edge) * body * uFire * shred + smoothstep(.2, -.9, y) * (.2 + .5 * edge * edge) * uFire * (.5 + .5 * f1);
        gl_FragColor = vec4(col * I * 1.5, 1.);
      }`}));e.frustumCulled=!1,e.renderOrder=3,h.add(e);const l=9,n=Math.round(86*(.6+.4*t)),s=6,b=[],g=[];let P=0;for(let F=0;F<l;F++){const k=i()*V,z=i.range(.75,1.25),C=F===0?1:i.range(.25,.9);for(let N=0;N<=n;N++)for(let I=0;I<=s;I++)b.push(F,N/n,I/s*V,k,z,C,0,0);for(let N=0;N<n;N++)for(let I=0;I<s;I++){const U=P+N*(s+1)+I;g.push(U,U+1,U+s+1,U+1,U+s+2,U+s+1)}P+=(n+1)*(s+1)}const S=new a.BufferGeometry,L=new a.InterleavedBuffer(new Float32Array(b),8);S.setAttribute("position",new a.BufferAttribute(new Float32Array(P*3),3)),S.setAttribute("aA",new a.InterleavedBufferAttribute(L,4,0)),S.setAttribute("aB",new a.InterleavedBufferAttribute(L,4,4)),S.setIndex(g),S.boundingSphere=new a.Sphere(x(0,150,0),170);const T=new a.Mesh(S,new a.ShaderMaterial({...v,uniforms:o,vertexShader:Ee+`
      attribute vec4 aA, aB; varying vec3 vN, vWP; varying vec4 vI; varying float vTear;
      vec3 centre(float s, float y, float ph){
        float th = s * 0.6981317 + y * .034 + uTime * .22 + .55 * sin(y * .085 + ph + uTime * .6);
        float r = wakeR(y) * (1. + .2 * sin(y * .12 + ph * 2. + uTime * .45)) * (1. + .5 * smoothstep(120., 300., y));
        return vec3(sin(th) * r, y, cos(th) * r) + kink(y) + bendAt(y);
      }
      void main(){
        float y = 3.2 + 297. * pow(aA.y, 2.1);
        vec3 c = centre(aA.x, y, aA.w), t = centre(aA.x, y + .5, aA.w) - c; t /= max(length(t), 1e-5);
        vec3 rad = vec3(c.x, 0., c.z); rad /= max(length(rad), 1e-4); vec3 tan2 = cross(t, rad);
        float rho = (.5 + .28 * sin(y * .2 + aA.w * 3. - uTime * 2.)) * aB.x * mix(.55, 1., smoothstep(3., 9., y)) * (1. + y * .004);
        vec3 nn = rad * cos(aA.z) + tan2 * sin(aA.z), p = c + nn * rho;
        vI = vec4(aA.x, y, aA.z, aA.w); vTear = aB.y; vN = normalize(mat3(modelMatrix) * nn);
        vec4 wp = modelMatrix * vec4(p, 1.); vWP = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:De+Ee+`
      varying vec3 vN, vWP; varying vec4 vI; varying float vTear;
      void main(){
        float y = vI.y, k = mod(vI.x, 3.);
        float ndv = abs(dot(normalize(vN), normalize(cameraPosition - vWP)));
        float flow = fbm(vec2(vI.z * 1.1 + vI.w, y * .34 - uTime * (7. + vI.w)));
        float fil = smoothstep(.25, .8, flow);
        vec3 col = k < .5 ? uMag : k < 1.5 ? uVio : mix(uOra, uMag, .25);
        col = mix(col, col * .6 + vec3(.5, .35, .3), fil * fil * .22);
        float along = (exp(-max(y - 8., 0.) / 7.) * .95 + uTail * exp(-y / 140.)) * smoothstep(300., 215., y) * smoothstep(3.2, 6.5, y);
        float torn = smoothstep(max(vTear - .7, 0.), vTear, uTear);
        float alive = (1. - smoothstep(vTear - .12, vTear, uTear)) * smoothstep(torn * 1.1 - .2, torn * 1.1 + .05, fbm(vec2(y * .07 - uTime * 1.5, vI.w * 9.)) + .25 * (1. - torn));
        float I = pow(ndv, 1.6) * (.3 + .9 * fil) * along * alive * uFire;
        gl_FragColor = vec4(col * I * 1.45, 1.);
      }`}));return T.frustumCulled=!1,T.renderOrder=2,h.add(T),{group:h,sheath:e,streamers:T}}function qt(i,t,o){const h=Math.round(400*t),w=Math.round(130*t),p=h+w,y=[],c=[],A=[];for(let f=0;f<p;f++){const d=[i(),i(),i(),i()],v=f<h?0:1;for(const e of[[-1,-1],[1,-1],[1,1],[-1,1]])y.push(...d),c.push(e[0],e[1],v,0);A.push(f*4,f*4+1,f*4+2,f*4,f*4+2,f*4+3)}const m=new a.BufferGeometry;m.setAttribute("position",new a.BufferAttribute(new Float32Array(p*12),3)),m.setAttribute("aSeed",new a.Float32BufferAttribute(y,4)),m.setAttribute("aC",new a.Float32BufferAttribute(c,4)),m.setIndex(A),m.boundingSphere=new a.Sphere(x(0,60,0),90);const r=new a.Mesh(m,new a.ShaderMaterial({transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,side:a.DoubleSide,uniforms:o,vertexShader:Ee+`
      attribute vec4 aSeed, aC; uniform float uLipFx, uResY; uniform mat4 uWake; varying vec3 vQ; varying float vB;
      void main(){
        vec3 P, dir = vec3(0., 1., 0.); float len, wid;
        if (aC.z < .5) {
          float age = fract(aSeed.x + uTime * (.5 + aSeed.y * .8));
          float y = -.5 + age * 7. + age * age * (40. + 90. * aSeed.z);
          float th = aSeed.w * 6.2831853 + y * .03 + uTime * .2;
          float r = mix(2.2 + 1.5 * smoothstep(-.5, 3.5, y), wakeR(y) * (.7 + .55 * aSeed.z), smoothstep(2.5, 15., y)) + .3 * sin(aSeed.x * 40. + y * .4);
          P = vec3(sin(th) * r, y, cos(th) * r) + kink(y) * smoothstep(3., 12., y) + bendAt(y); P = (uWake * vec4(P, 1.)).xyz;
          dir = normalize(mat3(uWake) * vec3(sin(th) * .35 * (1. - smoothstep(0., 6., y)), 1., cos(th) * .35 * (1. - smoothstep(0., 6., y))));
          len = .5 + age * 5.; wid = .03; vB = (1. - age) * (1. - age) * smoothstep(0., .03, age) * uFire * (.5 + aSeed.y);
        } else {
          float age = fract(aSeed.x + uTime * (.1 + aSeed.y * .12)), th = aSeed.w * 6.2831853 + age * (aSeed.z - .5);
          float r = 2.0 + age * (.15 + aSeed.z * .7), y = .6 + age * (.5 + aSeed.y * 2.4);
          P = vec3(sin(th) * r, y, cos(th) * r) + vec3(sin(uTime * 1.7 + aSeed.x * 50.), 0., cos(uTime * 1.3 + aSeed.y * 50.)) * .06 * age;
          dir = normalize(vec3(sin(uTime * 3. * aSeed.y + aSeed.x * 9.), 1., cos(uTime * 2.3 * aSeed.z)));
          len = .014 + .02 * aSeed.z; wid = len * (.3 + .4 * aSeed.y); vB = -uLipFx * (1. - age) * smoothstep(0., .1, age);
        }
        vec4 mv = viewMatrix * modelMatrix * vec4(P, 1.);
        vec3 av = normalize(mat3(viewMatrix) * mat3(modelMatrix) * dir), sd = cross(av, mv.xyz); sd /= max(length(sd), 1e-6);
        float px = 2. * max(-mv.z, .05) / (projectionMatrix[1][1] * uResY);
        if (aC.z > .5) vB *= smoothstep(.35, .9, -mv.z);
        mv.xyz += av * aC.y * len * .5 + sd * aC.x * max(wid, .8 * px);
        vQ = vec3(aC.xy, aSeed.z); gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform vec3 uOra; varying vec3 vQ; varying float vB;
      void main(){
        float s = vB >= 0. ? (1. - vQ.x * vQ.x) * (1. - vQ.y * vQ.y) * smoothstep(-1., .2, vQ.y) : smoothstep(1., .75, abs(vQ.x) + abs(vQ.y) * (.6 + .8 * vQ.z));
        vec3 col = vB >= 0. ? mix(uOra * 1.6, vec3(2.6, 2.0, 1.3), vQ.z * smoothstep(-.2, 1., vQ.y)) * vB : vec3(1.8, .3, .06) * -vB;
        gl_FragColor = vec4(col * s, 1.);
      }`}));return r.frustumCulled=!1,r.renderOrder=4,r}function Gt(i,t){const o=[],h=[],w=[];let p=0;const y=x();for(const[m,r]of[["thrL",-1],["thrR",1]]){const f=_e(i.feats[m][0]+i.rot,i.feats[m][1],.12),d=p,v=12,e=6;for(let l=0;l<=e;l++)for(let n=0;n<=v;n++){const s=l/e,b=n/v*V,g=.1+.55*Math.pow(s,.8);y.set(Math.cos(b)*g,Math.sin(b)*g,s*2.6).applyMatrix4(f),o.push(y.x,y.y,y.z),h.push(r,s,b,0),p++}for(let l=0;l<e;l++)for(let n=0;n<v;n++){const s=d+l*(v+1)+n;w.push(s,s+1,s+v+1,s+1,s+v+2,s+v+1)}}for(const m of[[-1,-1],[1,-1],[1,1],[-1,1]])o.push(0,le+.15,0),h.push(m[0],m[1],0,2);w.push(p,p+1,p+2,p,p+2,p+3);const c=new a.BufferGeometry;c.setAttribute("position",new a.Float32BufferAttribute(o,3)),c.setAttribute("aA",new a.Float32BufferAttribute(h,4)),c.setIndex(w),c.boundingSphere=new a.Sphere(x(0,2,0),12);const A=new a.Mesh(c,new a.ShaderMaterial({transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,side:a.DoubleSide,uniforms:t,vertexShader:`
      attribute vec4 aA; uniform float uFlash; uniform vec2 uThr; varying vec4 vA; varying float vI;
      void main(){
        vec4 mv = viewMatrix * modelMatrix * vec4(position, 1.); vA = aA;
        if (aA.w > 1.) { mv.xy += aA.xy * 3.2 * step(.002, uFlash); vI = uFlash; } else vI = aA.x < 0. ? uThr.x : uThr.y;
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:De+`
      uniform float uTime; uniform vec3 uVio; varying vec4 vA; varying float vI;
      void main(){
        vec3 col;
        if (vA.w > 1.) { float r = length(vA.xy); col = vec3(3.2, 2.3, 1.3) * (exp(-r * r * 7.) + .25 * exp(-r * 2.5) * (1. - smoothstep(.6, 1., r))) * vI; }
        else { float f = vA.y, nz = vn(vec2(vA.z * 3., f * 6. - uTime * 30.)); col = mix(vec3(1.7, 1.6, 1.9), uVio, smoothstep(0., .5, f)) * (1. - f) * (1. - f) * (.35 + .65 * nz) * vI * .8; }
        gl_FragColor = vec4(col, 1.);
      }`}));return A.frustumCulled=!1,A.renderOrder=5,A}function Mt(i,t){if(t<=i[0][0])return i[0][1];for(let o=1;o<i.length;o++)if(t<i[o][0])return K(i[o-1][1],i[o][1],q(i[o-1][0],i[o][0],t));return i[i.length-1][1]}async function jt(i,t={}){const o=i.rng.fork("splashdown-hero"),h=i.quality?.detail??1,w=(t.palette&&t.palette.length>=7?t.palette:zt).map(u=>new a.Color(u)),p=t.skin||o.pick(["tile","tile","tile","tile","foil","gumdrop"]),y=t.pattern||o.pick(["blocks","blocks","blocks","quarters","onegore"]),c=t.lagThird??o.chance(.1),A=t.lagAt??22.6,m=(t.spread??22)*Z,r=o.range(-.25,.25),f=[o()*V,o()*V,o()*V],d=new a.Group;d.name="splashdown-hero";const v=(u,M=1)=>new a.Vector3(u.r*M,u.g*M,u.b*M),e=u=>({value:u}),l={uTime:e(0),uResY:e(450),uGlow:e(1.2),uFlash:e(0),uSunDir:e((t.sunDir?t.sunDir.clone():x(-.8,.4,-.45)).normalize()),uSunCol:e(v(new a.Color("#FFD9A0"),1.25)),uSky:e(v(new a.Color("#4A4F9A"),1.9)),uBounce:e(v(w[3],.3))},n={uTime:l.uTime,uResY:l.uResY,uFlash:l.uFlash,uFire:e(0),uTear:e(0),uLipFx:e(0),uThr:e(new a.Vector2),uTail:e(.07),uBend:e(x()),uWake:e(new a.Matrix4),uMag:e(v(w[2],1.55)),uVio:e(v(w[1],1.9)),uOra:e(v(w[6],1.25).add(x(.1,.22,.05))),uKinkA:e(new a.Vector4(1,0,-9,0)),uKinkB:e(new a.Vector4(-1,0,-9,0))},s={...l,uFire:n.uFire,uLip:e(0),uWet:e(0),uGlossK:e(t.gloss??1),uThr:n.uThr,uMag:n.uMag,uVio:n.uVio,uOra:n.uOra},b=Bt(o.fork("capsule"),p,h);await i.yield?.();const g=Ct(b,o.fork("dress"));await i.yield?.();const P=Nt(s),S=new a.Mesh(g.G.build(),P);d.add(S),await i.yield?.();const L=new a.Mesh(g.pod.build(),P);L.visible=t.pod!==!1,d.add(L);const T=new a.Group;T.position.set(0,le,0);const F=new a.Mesh(g.cover.build(),P);T.add(F),d.add(T),await i.yield?.();const k=Rt(o.fork("plasma"),h,n);d.add(k.group),k.group.position.set(0,1,0),k.sheath.position.y=k.streamers.position.y=-1;const z=qt(o.fork("sparks"),h,n);d.add(z);const C=Gt(g,n);d.add(C);const N=[];{let u=o.range(.9,1.5),M=o.sign();for(;u<5.9;)N.push({t:u,side:M,amp:o.range(1.1,2)}),M=o.chance(.75)?-M:M,u+=o.range(.75,1.5)}await i.yield?.();const I=Ut(),U=I.info,D=v(w[6],.8).add(x(0,.02,0)),$=x(.76,.74,.7);y==="quarters"&&D.set(.72,.045,.02);const ae=_t(o.fork("canopy"),y),me=Vt(o.fork("lines")),H=u=>{const M=u*V/3+.4+V/6;return x(Math.sin(M)*.585,le+.03,Math.cos(M)*.585)},J=[];for(let u=0;u<3;u++){const M={uProf:e(I.tex),uStage:e(3),uExtend:e(1),uPhase:e(o()*V),uRipple:e(0),uRipA:e(0),uTremble:e(0),uBulge:e(.5),uSquash:e(0),uInward:e(0),uOrigin:e(x()),uAxis:e(x(0,1,0)),uE1:e(x(1,0,0)),uE2:e(x(0,0,1)),uSag:e(0),uWaveF:e(2),uWaveA:e(0),uPuff:e(0),uDeploy:e(1),uFit:e(H(u)),uOrange:e(D),uWhite:e($)},B=new a.Mesh(ae,Dt({...l,...M}));B.frustumCulled=!1,d.add(B);const re=new a.Mesh(me,It({...l,...M}));re.frustumCulled=!1,re.renderOrder=6,d.add(re);const ce=u*.045+o.range(0,.03),ge=c&&u===2,ve=ge?[[16.6,0],[16.72,1.15],[16.9,.93],[17.1,1],[A,1],[A+.08,2.25],[A+.2,2],[A+.42,4],[A+.75,2.8],[A+1.05,3.12],[A+1.35,3]]:[[16.6,0],[16.72,1.15],[16.9,.93],[17.1,1],[17.6,1],[17.7,2.25],[17.86,1.9],[18.05,2],[18.6,2],[18.85,4],[19.2,2.8],[19.5,3.12],[19.8,3]];J.push({CU:M,cloth:B,lines:re,delay:ce,keys:ve,snaps:ge?[16.6,A,A+.2]:[16.6,17.6,18.6],alpha:(210+120*u)*Z+r,axis:x(0,1,0),stage:3,extend:1})}await i.yield?.();const Ve=Wt(o.fork("small"),[D.x,D.y,D.z],[$.x,$.y,$.z]),Ie=[];for(let u=0;u<5;u++){const M={...l,uOpen:e(1),uLen:e(1),uSpin:e(o()*V)},B=new a.Mesh(Ve,Et(M));B.frustumCulled=!1,u>=2&&B.scale.setScalar(.42),d.add(B),Ie.push({mesh:B,U:M,spin:o.range(.5,1.1)*o.sign(),ph:o()*V})}const G=x(),ne=x(1,0,0),be=x(),se=x(),ue=x(0,le,0),ee=x(),de=x(),Me=new a.Quaternion,ie=x(0,1,0);let te=(t.lean??35)*Z;const W=Q(0,g.feats.pod[1],.75),ye=x(0,Pe,pe),Ce=new a.Matrix4,Ne=u=>{te=u*Z,G.set(0,Math.cos(te),-Math.sin(te)),be.set(0,Math.sin(te),Math.cos(te)),se.copy(ue).addScaledVector(G,8),k.group.rotation.x=-te,n.uWake.value.makeTranslation(0,1,0).multiply(Ce.makeRotationX(-te)).multiply(Ce.makeTranslation(0,-1,0)),ee.copy(W).applyMatrix4(Ce.copy(n.uWake.value).invert()),n.uBend.value.set(ee.x,0,ee.z)};Ne(t.lean??35);const St=x(o.range(-1,1),o.range(-.3,.3),o.range(-1,1)).normalize(),ot=[o.range(2,5)*o.sign(),o.range(1,3)],at=[-.17,.17],nt=u=>{const M=We(u,0,4),B=Math.floor(M),re=M-B;return K(U[B].hCrown,U[Math.min(4,B+1)].hCrown,re)},At=(u,M,B,re)=>{const ce=m*K(.32,1,q(.9,3,B))+.012*Math.sin(re*.52+M*2.1),ge=u.alpha+.03*Math.sin(re*.37+M*1.7);ee.copy(ne).multiplyScalar(Math.cos(ge)).addScaledVector(be,Math.sin(ge)),u.axis.copy(G).multiplyScalar(Math.cos(ce)).addScaledVector(ee,Math.sin(ce)).normalize();const ve=u.CU.uE1.value.crossVectors(ie,u.axis).normalize(),Te=u.CU.uE2.value.crossVectors(u.axis,ve);u.CU.uAxis.value.copy(u.axis),u.CU.uOrigin.value.copy(se),de.copy(G).addScaledVector(u.axis,-G.dot(u.axis)),u.CU.uInward.value=Math.atan2(de.dot(Te),de.dot(ve))},xe={T:0,fire:0,lip:0,flash:0,jolt:0,stage:[3,3,3],thruster:[0,0]};let E=t.restTime??21,st=!1,it=0,Ke=0,rt=NaN,lt=NaN;const ut=(u,M)=>{if(M){const B=E-M.t;u.set(-M.side,.3*M.side,B,M.amp*q(0,.15,B)*(1-q(1.2,3.2,B)))}else u.set(1,0,-9,0)},Re=u=>{Ke=u,l.uTime.value=u,xe.T=E,rt=E,lt=u;const M=it<3,B=1-q(6.3,7,E),re=We((E-6.2)/.8,0,1),ce=E<7.02;n.uFire.value=ce?B*(.93+.07*Math.sin(u*23)*Math.sin(u*7.3)):0,n.uTear.value=re,xe.fire=ce?B:0;const ge=E<7?1:Math.max(1-q(7,13.2,E),.4*q(26.6,27.2,E)*(1-q(28.8,33,E)));s.uLip.value=ge,xe.lip=ge,n.uLipFx.value=E>6.8&&E<14?Math.pow(ge,.7)*q(6.8,7.6,E):0;let ve=0,Te=0,Ye=null,vt=null;for(const _ of N){const R=E-_.t;if(R<0||!ce)continue;const j=q(0,.05,R)*(1-q(.22,.34,R));_.side<0?ve=Math.max(ve,j):Te=Math.max(Te,j),vt=Ye,Ye=_}n.uThr.value.set(ve,Te),xe.thruster[0]=ve,xe.thruster[1]=Te,ut(n.uKinkA.value,Ye),ut(n.uKinkB.value,vt),k.group.visible=z.visible=M||ce||n.uLipFx.value>0,k.sheath.visible=k.streamers.visible=M||ce;const X=E-15,He=X<0||X>.9?0:X<.1?X/.1:Math.exp(-(X-.1)/.11);l.uFlash.value=He,xe.flash=He,C.visible=M||He>.002||ve+Te>.001,X<=0?(T.position.copy(ue),T.quaternion.identity(),T.visible=!0):(T.visible=X<3.2,T.position.copy(ue).addScaledVector(G,X*15+.4).addScaledVector(ne,X*ot[0]).addScaledVector(be,X*ot[1]-2.2*X*X),T.quaternion.setFromAxisAngle(St,X*8.5)),F.position.set(0,-le,0);let Xe=X>0?Math.exp(-X/.2):0;J.forEach((_,R)=>{const j=E-_.delay,Y=_.CU,Fe=j>16.2,$e=Fe?K(.03,1,q(16.2,16.6,j)):0;let fe=Mt(_.keys,j);const ft=q(_.keys[_.keys.length-1][0]-.4,_.keys[_.keys.length-1][0]+1.5,j);fe+=ft*.075*Math.sin(u*V/2.4+f[R]),_.stage=fe,_.extend=$e,xe.stage[R]=Fe?fe:0,Y.uStage.value=We(fe,0,4.4),Y.uExtend.value=$e,Y.uTremble.value=(1-q(1.15,2.9,fe))*(fe<.5?.55:1)+.035*ft,Y.uBulge.value=.16+.42*q(1.4,3,fe),Y.uSquash.value=.09*q(2.5,3,fe)*(1+.5*Math.sin(u*1.1+R*2));let he=-1;for(let Ue=0;Ue<3;Ue++)j>=_.snaps[Ue]&&(he=Ue);let ht=.85,we=9;if(he>=0){we=j-_.snaps[he];const Ue=he===0?.85:[.5,.42][he-1],kt=he<2?q(_.snaps[he]+.3,_.snaps[he+1],j)*[.5,.42][he]:0;ht=Math.max(Ue*(1-q(0,.07,we)),kt),(R===0||_.snaps[he]>20)&&(Xe=Math.max(Xe,Math.exp(-we/.2)))}Y.uSag.value=ht,Y.uWaveF.value=we<.45?we/.34*1.15:2,Y.uWaveA.value=we<.45?1-we/.45:0,Y.uPuff.value=we<1.1?we/1.1:0;const Ge=j-_.snaps[2]-.12;Y.uRipple.value=We(Ge/.95,0,1),Y.uRipA.value=Ge>0&&Ge<.95?.85*Math.sin(Ge/.95*Math.PI):0,Y.uDeploy.value=Fe?q(16.2,16.35,j):0,At(_,R,fe,u),_.cloth.visible=_.lines.visible=M||Fe;const Ae=Ie[2+R];Ae.mesh.visible=M||Fe,Ae.mesh.position.copy(se).addScaledVector(_.axis,nt(fe)*$e+.3),Ae.mesh.quaternion.setFromUnitVectors(ie,ee.copy(_.axis).addScaledVector(ne,.05*Math.sin(u*1.3+R*2)).normalize()),Ae.U.uOpen.value=Fe?.82+.1*Math.sin(u*5+R):0,Ae.U.uLen.value=Fe?1:0,Ae.U.uSpin.value=Ae.ph+u*Ae.spin}),xe.jolt=Xe;for(let _=0;_<2;_++){const R=Ie[_],j=E-16.2,Y=E>15.02&&j<1.7;R.mesh.visible=M||Y,ee.copy(G).addScaledVector(ne,at[_]+.03*Math.sin(u*2.3+_*3)).addScaledVector(be,.03*Math.sin(u*1.9+_)).normalize(),R.mesh.quaternion.setFromUnitVectors(ie,ee),R.mesh.position.copy(ue),j>0&&R.mesh.position.addScaledVector(ee,j*34+j*j*14),R.U.uLen.value=Y?q(15.02,15.42,E):0,R.U.uSpin.value=R.ph+u*R.spin*1.6,R.U.uOpen.value=Y?Mt([[15.36,0],[15.72,1.13],[15.9,.94],[16.1,1]],E)*(1-.65*q(0,.5,j)):0}};Ne(t.lean??35);const qe=u=>{const M=(210+120*u)*Z+r;return G.clone().multiplyScalar(Math.cos(m)).addScaledVector(ne,Math.cos(M)*Math.sin(m)).addScaledVector(be,Math.sin(M)*Math.sin(m)).normalize()},ct=x(0,38,-26),Se={mounts:{along:{position:W.clone(),target:W.clone().addScaledVector(G,20),up:ye.clone()},image:{position:W.clone(),target:W.clone().addScaledVector(G,20).add(x(0,-6,-7)),up:ye.clone()},outward:{position:x(0,1.25,1.8),target:x(0,1.25-.707,1.8+.707),up:x(0,1,0)}},apex:ue.clone(),confluence:se.clone(),clusterAxis:G.clone(),wakeAxis:G.clone(),wakeEnd:x(0,1,0).addScaledVector(G,300),crowns:[0,1,2].map(u=>se.clone().addScaledVector(qe(u),U[3].hCrown)),canopyCenters:[0,1,2].map(u=>se.clone().addScaledVector(qe(u),U[3].hSkirt+5)),drogues:at.map(u=>ue.clone().addScaledVector(G.clone().addScaledVector(ne,u).normalize(),ze+7)),thrusters:[Q(g.feats.thrL[0]+g.rot,g.feats.thrL[1],.1),Q(g.feats.thrR[0]+g.rot,g.feats.thrR[1],.1)],window:Q(g.feats.winA[0]+g.rot,g.feats.winA[1],0),portalSeat:{position:x(0,-12,0),normal:x(0,1,0),radius:7},flyThrough:[x(44,6,78),x(22,8,40),x(12,6,14),x(10,2,-6),x(15,-4,-32),x(26,-8,-64)],viewpoints:[{position:x(60,20,110),target:ct.clone()},{position:x(-95,60,-20),target:x(0,40,-28)},{position:x(4.5,2.2,6),target:x(0,1.4,0)}]},Pt=new a.Vector2,Qe={object:d,radius:40,height:70,center:ct,anchors:Se,ground:!1,groundY:0,state:xe,pod:L,capsule:S,skin:p,pattern:y,lagThird:c,bursts:N,uniforms:{shared:l,plasma:n,capsule:s,mains:J.map(u=>u.CU)},setProgress(u){Qe.setFlightTime(We(u,0,1)*40)},setFlightTime(u,M){E=u,st=!0,Re(M??Ke)},setSun(u,M){l.uSunDir.value.copy(u).normalize(),M&&l.uSunCol.value.set(M.r,M.g,M.b)},setAmbient(u,M){u&&l.uSky.value.set(u.r,u.g,u.b),M&&l.uBounce.value.set(M.r,M.g,M.b)},setWet(u){s.uWet.value=u},setLean(u){Ne(u),Re(Ke);const M=Se.mounts;M.along.target.copy(W).addScaledVector(G,20),M.image.target.copy(M.along.target).add(x(0,-6,-7)),Se.confluence.copy(se),Se.clusterAxis.copy(G),Se.wakeAxis.copy(G),Se.wakeEnd.set(0,1,0).addScaledVector(G,300);for(let B=0;B<3;B++)Se.crowns[B].copy(se).addScaledVector(qe(B),U[3].hCrown),Se.canopyCenters[B].copy(se).addScaledVector(qe(B),U[3].hSkirt+5)},canopyWorld(u,M=x()){const B=J[u];return M.copy(se).addScaledVector(B.axis,K(U[3].hSkirt,nt(B.stage),.5)*B.extend).applyMatrix4(d.matrixWorld)},update(u,M,B){i.renderer&&(l.uResY.value=Math.max(64,i.renderer.getDrawingBufferSize(Pt).y)),t.demo&&!st&&(E=M%42),(rt!==E||lt!==M)&&Re(M),it++},dispose(){I.tex.dispose()}};return d.userData.hero=Qe,Re(0),Qe}export{jt as buildHero};
