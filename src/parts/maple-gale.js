import*as r from"three";import{makePath as vt,clamp as le,lerp as Y,smoothstep as be}from"../kit/core.js";const dt=["#C8281C","#E8742A","#F0B428","#23262B","#55606C","#E9E4D6","#1F3A2E"],st=12*Math.PI/180,ge=11,rt=-1.5,Ie=-61.5,U=16,fe=8,ze=48,xe=4,Le=14,Fe=9,Re=40,ue=180,$e=`
  #include <common>
  #include <lights_pars_begin>
  uniform float uSunGain;
  uniform vec4 uPatch;                 // world x, z of the travelling break of sun, its radius, sun gain outside it
  varying vec2 vPW;                    // world xz of this fragment
  uniform vec3 uPatch2;                // a second break of sun that rests on the tree: world x, z, radius
  float mgPatch(){
    float a = 1.0 - smoothstep(uPatch.z - 32.0, uPatch.z + 32.0, distance(vPW, uPatch.xy));
    float b = 1.0 - smoothstep(uPatch2.z*0.55, uPatch2.z*1.5, distance(vPW, uPatch2.xy));
    return mix(uPatch.w, 1.0, max(a, b));
  }
  vec3 mgSunDir(){
    #if NUM_DIR_LIGHTS > 0
      return directionalLights[0].direction;
    #else
      return vec3(0.0, 1.0, 0.0);
    #endif
  }
  vec3 mgSunCol(){
    #if NUM_DIR_LIGHTS > 0
      return directionalLights[0].color * (uSunGain * mgPatch());
    #else
      return vec3(0.0);
    #endif
  }
  vec3 mgAmb(vec3 n){
    vec3 irr = ambientLightColor;
    #if NUM_HEMI_LIGHTS > 0
      irr += getHemisphereLightIrradiance(hemisphereLights[0], n);
    #endif
    return irr;
  }
  float mgHash(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx+33.33); return fract((p.x+p.y)*p.y); }
  float mgNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
    return mix(mix(mgHash(i), mgHash(i+vec2(1.,0.)), f.x), mix(mgHash(i+vec2(0.,1.)), mgHash(i+vec2(1.,1.)), f.x), f.y); }
`,it=`
  uniform float uTime, uClock, uStripDur, uCalm;
  vec3 mgBend(vec3 p, vec4 b){
    float tau = uClock - b.z*uStripDur;                 // seconds since this branch let go
    float tp = max(tau, 0.0);
    float bare = smoothstep(0.0, 0.35, tau);
    float heave = smoothstep(-2.8, -0.15, tau);         // the front arriving, windward side first
    float gs = sin(uTime*0.9 + p.x*0.07 + b.y)*0.5 + 0.5;
    float gf = sin(uTime*2.3 - p.x*0.19 + b.y*1.7);
    float load = mix(0.30 + 0.22*gs + 0.06*gf, 1.05 + 0.22*gf, heave) * uCalm;
    float ring = exp(-1.4*tp)*cos(8.5*tp + b.y);        // unloaded limb springs back and rings
    load = mix(load, 0.42 + 0.14*gf + 0.55*ring, bare);
    float whip = b.w*(0.07 + 0.10*heave + 0.34*bare*(0.4 + 0.6*exp(-0.35*tp)));
    vec3 d = vec3(b.x*load, 0.0, 0.0);
    d.y = -b.x*load*0.38*(1.0 - bare) + b.x*0.30*bare*(1.0 + 0.6*ring);
    d += b.x*whip*vec3(sin(uTime*7.3 + b.y*5.0), 0.7*sin(uTime*9.1 + b.y*3.0), 0.9*cos(uTime*6.1 + b.y*7.0));
    return p + d;
  }
`,nt=`
  float mgLobe(float a, float a0, float w, float L){ float d = abs(a - a0)/w; return L*(1.0 - d)*(1.0 + 0.10*cos(d*15.7)); }
  float mgLeaf(vec2 q){
    float x = abs(q.x), y = q.y + 0.22;
    float r = length(vec2(x, y)) + 1e-5;
    float a = acos(clamp(y/r, -1.0, 1.0));
    float R = max(max(mgLobe(a, 0.0, 0.52, 1.20), mgLobe(a, 0.98, 0.50, 1.02)), max(mgLobe(a, 1.92, 0.46, 0.66), 0.36 - 0.10*smoothstep(2.2, 3.1, a)));
    float blade = R - r;
    float stem = min(0.05 - x, min(q.y + 0.98, -0.2 - q.y));
    return max(blade, stem*2.0);
  }
`,pt=`
  uniform float uEmber, uLeafAmb;
  vec3 mgLeafShade(vec3 col, vec3 pale, vec3 nGeo, vec3 nl, vec3 viewDir, float ao, float under){
    vec3 L = mgSunDir(), S = mgSunCol();
    vec3 n = nGeo * (dot(nGeo, viewDir) < 0.0 ? -1.0 : 1.0);     // the side we see
    float lit = max(max(dot(nl, L), dot(n, L)), 0.0);            // the seen side faces the sun: lit, whatever the blended normal says
    float back = max(-dot(n, L), 0.0);                           // sun is behind the blade: it glows through
    vec3 surf = mix(col, pale, under);
    vec3 thru = col*col*3.2 + col*0.35;                          // saturated ember
    vec3 amb = mix(mgAmb(n), mgAmb(-n), 0.4)*uLeafAmb;           // a blade takes the sky on both faces
    vec3 c = surf*RECIPROCAL_PI*(S*lit*1.15 + amb*ao);
    c += thru*RECIPROCAL_PI*(S*back*uEmber + amb*0.3)*(0.55 + 0.45*ao);
    float sp = pow(max(dot(n, normalize(L + viewDir)), 0.0), 24.0);
    c += S*sp*0.05*(1.0 - under);                                // waxy top
    return max(c, (col + thru*0.25)*(0.045*uLeafAmb));           // no leaf is darker than deep wine
  }
`,P=(t,e,i)=>new r.Vector3(t,e,i),Ge=()=>r.UniformsUtils.clone(r.UniformsLib.fog),Oe=()=>r.UniformsUtils.clone(r.UniformsLib.lights);function gt(t,e){return(i,b)=>{const _=t.fbm2(i*.09+e,b*.09-e,3),F=t.n2(i*.45+7,b*.45+3),z=Math.atan2(b+1.5,i),w=1+.16*Math.cos(z*3+e)+.09*Math.cos(z*5-e*2),g=Math.hypot(i/(11.5+2.2*_),(b+1.5)/(9.5+1.8*_))/w;let c=.55*_+.1*F-.25*Math.max(0,g-.25);const A=c+i*.085+b*.03,R=Math.floor(A/.7)*.7+.7*be(.78,1,A/.7-Math.floor(A/.7));return c=Y(c,R-i*.085-b*.03,.8),c-=1.7*be(3,8.5,b),c-=6.5*be(.78,1.12,g)*(.8+.3*F),c-=7*be(ge-3.4+1.2*_,ge-.6,i),c+=.5*Math.exp(-(i*i+b*b)/3.2),Math.max(c,-6.5)}}function xt(t,e){const _=[],F=[],z=e.range(0,6.28);_.push(0,t(0,0),0);for(let g=1;g<=20;g++){const c=g/20,A=15.5*Math.pow(c,1.25);for(let R=0;R<56;R++){const d=(R+g%2*.5)/56*Math.PI*2+z,M=Math.cos(d)*A*1,S=Math.sin(d)*A*.9-1;_.push(M,g===20?-6.6:t(M,S),S)}}for(let g=0;g<56;g++)F.push(0,1+(g+1)%56,1+g);for(let g=1;g<20;g++){const c=1+(g-1)*56,A=c+56,R=g%2;for(let d=0;d<56;d++){const M=(d+1)%56;R?F.push(c+d,c+M,A+M,c+d,A+M,A+d):F.push(c+d,c+M,A+d,c+M,A+M,A+d)}}const w=new r.BufferGeometry;return w.setAttribute("position",new r.Float32BufferAttribute(_,3)),w.setIndex(F),w.computeVertexNormals(),w}async function yt(t,e,i){const b=[],_=[13,8,6,4,3],F=[.035,.13,.2,.26,.3],z=[0,.032,.07,.115,.17],w=[0,.18,.45,.75,1],g=[10,5,4,3,0],c=P(),A=P();async function R(n,l,V,m,o,p,k,$){const Q=_[o],D=[n.clone()],O=[m],y=[p],I=[o===0?0:w[o-1]],X=l.clone().normalize(),j=n.clone(),q=o===0?m*.42:Math.max(.028,m*.36),T=[0,.07,.02,-.02,-.05][o];for(let H=1;H<=Q;H++){const se=H/Q;X.x+=e.gauss()*F[o]+(o>0?.035:0),X.y+=e.gauss()*F[o]*.6+T*(o===1?1.6-se:1),X.z+=e.gauss()*F[o],X.normalize(),j.addScaledVector(X,V/Q),D.push(j.clone()),O.push(Y(m,q,Math.pow(se,.85))),y.push(o===0?.42*Math.pow(le((j.y+1.2)/20,0,1),2):p+z[o]*V*se),I.push(o===0?.03*se:Y(w[o-1],w[o],se))}const ae={pts:D,rad:O,flex:y,tip:I,depth:o,phase:e.range(0,6.28),rel:.5,parent:k,group:$??null,dirEnd:X.clone()};b.push(ae),o===2&&ae.group==null&&(ae.group=ae);const oe=g[o];if(!oe)return ae;const ee=e.range(0,6.28);for(let H=0;H<oe;H++){const se=H===oe-1;let te=o===0?Y(.3,1,Math.pow(H/(oe-1),.9)):Y(.32,1,(H+e.range(.1,.9))/oe);se&&(te=1);const me=te*Q,Z=Math.min(Q-1,Math.floor(me)),Ce=me-Z,ie=D[Z].clone().lerp(D[Z+1],Ce),Be=D[Z+1].clone().sub(D[Z]).normalize();c.set(.31,.2,.93).cross(Be),c.lengthSq()<1e-4&&c.set(1,0,0),c.normalize(),A.crossVectors(Be,c);const he=ee+H*2.39996+e.range(-.35,.35);let ye=o===0?Y(1.22,.7,te)*e.range(.9,1.1)*(se?.3:1):se?e.range(.1,.35):e.range(.55,1);const Pe=Be.clone().multiplyScalar(Math.cos(ye)).addScaledVector(c,Math.cos(he)*Math.sin(ye)).addScaledVector(A,Math.sin(he)*Math.sin(ye));o>=1&&(Pe.y+=o===1?.22:.08,Pe.x+=.08);let ce;o===0?ce=Y(14.5,9,te)*e.range(.9,1.1):ce=V*[0,.56,.55,.56][o]*(1.15-.4*te)*e.range(.8,1.2),ce=Math.max(ce,[0,3.2,1.6,.8][o]);const De=Y(O[Z],O[Z+1],Ce),We=Math.max(.03,De*(o===0?e.range(.5,.64):e.range(.55,.7))*(se?1.1:1)),Ae=Y(y[Z],y[Z+1],Ce);await R(ie,Pe,ce,We,o+1,Ae,ae,o+1>2?ae.group:null),o===0&&await t.yield()}return ae}const d=await R(P(0,-1.2,0),P(.02,1,e.range(-.04,.02)),19.5*e.range(.96,1.04),.6,0,0,null,null);let M=0;for(const n of b)for(const l of n.pts)M=Math.max(M,l.y);const S=28.6/Math.max(M,1),s=Math.cos(st),C=Math.sin(st);for(const n of b)for(const l of n.pts){if(l.y>0){l.y*=S;const o=1+(S-1)*le(l.y/6,0,1);l.x*=o,l.z*=o}const V=l.x*s+l.y*C,m=-l.x*C+l.y*s;l.x=V,l.y=m,l.z>4&&(l.z=4+4.7*Math.tanh((l.z-4)/4.7)),l.z<-11&&(l.z=-11+3*Math.tanh((l.z+11)/3)),l.y<6&&n.depth>0&&(l.y=6-2*Math.tanh((6-l.y)/2)+0)}let f=1e9,v=-1e9;const G=n=>n.pts[Math.floor(n.pts.length*.6)].x;for(const n of b)n.depth>=1&&(f=Math.min(f,G(n)),v=Math.max(v,G(n)));const N=new Map;for(const n of b){const l=n.depth>=2?n.group:n;N.has(l)||N.set(l,e.range(-.07,.07)),n.rel=le((G(l)-f)/Math.max(v-f,1)*.86+.07+N.get(l),0,1),n.depth===0&&(n.rel=.5)}const h=e.int(6,8),L=e.range(0,6.28);for(let n=0;n<h;n++){let l=L+n/h*6.283+e.range(-.25,.25);const V=e.range(3,6),m=9,o=[],p=[],k=e.range(.2,.3);let $=Math.cos(l)*.35+.1,Q=Math.sin(l)*.35;for(let D=0;D<=m;D++){const O=D/m,y=Y(k,.045,Math.pow(O,.7)),I=i($,Q);o.push(P($,D===0?.75:Math.max(I+y*(.55-.5*O),-6.2),Q)),p.push(y),l+=e.gauss()*.22,$+=Math.cos(l)*V/m,Q+=Math.sin(l)*V/m}b.push({pts:o,rad:p,flex:o.map(()=>0),tip:o.map(()=>0),depth:5,phase:0,rel:.5,parent:d,group:null,root:!0})}return b}async function wt(t,e,i,b,_){const F=[12,7,5,4,3,6];let z=0,w=0;for(const o of e){const p=F[o.depth],k=o.pts.length;z+=(p+1)*k,w+=p*(k-1)*6}const g=new Float32Array(z*3),c=new Float32Array(z*3),A=new Float32Array(z*3),R=new Float32Array(z*2),d=new Float32Array(z*4),M=new Float32Array(z),S=new Uint32Array(w);let s=0,C=0;const f=P(),v=P(),G=P(),N=P(),h=new r.Quaternion,L=P(),n=new r.Color,l=i.int(5,7),V=i.range(0,6.28);for(let o=0;o<e.length;o++){(o&63)===0&&await t.yield();const p=e[o],k=F[p.depth],$=p.pts.length,Q=s,D=i.range(.75,1.2);let O=i.range(0,10);for(let y=0;y<$;y++){const I=p.pts[y];y<$-1?f.subVectors(p.pts[y+1],I):f.subVectors(I,p.pts[y-1]),y>0&&y<$-1&&f.add(L.subVectors(I,p.pts[y-1])),f.normalize(),y===0?(v.set(.2,.1,1).cross(f),v.lengthSq()<1e-4&&v.set(1,0,0).cross(f),v.normalize()):(h.setFromUnitVectors(N,f),v.applyQuaternion(h),v.addScaledVector(f,-v.dot(f)).normalize()),G.crossVectors(f,v),N.copy(f),y>0&&(O+=I.distanceTo(p.pts[y-1]));const X=p.rad[y];for(let j=0;j<=k;j++){const q=j/k*Math.PI*2,T=Math.cos(q),ae=Math.sin(q);let oe=X;if(p.depth===0){const se=Math.exp(-Math.max(I.y,-.4)/1.25);oe*=1+se*(.75+.5*Math.cos(l*q+V))+.07*Math.sin(q*3+I.y*1.7)+.05*Math.sin(q*5-I.y*.9)}else(p.depth===1||p.root)&&(oe*=1+.1*Math.sin(q*2+O*1.3)+(y===0?.35:0));const ee=s*3;c[ee]=v.x*T+G.x*ae,c[ee+1]=v.y*T+G.y*ae,c[ee+2]=v.z*T+G.z*ae,g[ee]=I.x+c[ee]*oe,g[ee+1]=I.y+c[ee+1]*oe,g[ee+2]=I.z+c[ee+2]*oe;const H=D*(p.root?.9:1)*(.85+.3*i())*(p.depth>=3&&!p.root?.8:1);n.copy(b).lerp(_,le(.5+.5*Math.sin(O*.7+q*2),0,1)).multiplyScalar(H),A[ee]=n.r,A[ee+1]=n.g,A[ee+2]=n.b,R[s*2]=j/k*Math.max(1,Math.round(X*14)),R[s*2+1]=O,d[s*4]=p.flex[y],d[s*4+1]=p.phase,d[s*4+2]=p.rel,d[s*4+3]=p.tip[y],M[s]=oe,s++}}for(let y=0;y<$-1;y++)for(let I=0;I<k;I++){const X=Q+y*(k+1)+I,j=X+1,q=X+k+1,T=q+1;S[C++]=X,S[C++]=q,S[C++]=j,S[C++]=j,S[C++]=q,S[C++]=T}}const m=new r.BufferGeometry;return m.setAttribute("position",new r.BufferAttribute(g,3)),m.setAttribute("normal",new r.BufferAttribute(c,3)),m.setAttribute("aCol",new r.BufferAttribute(A,3)),m.setAttribute("uv",new r.BufferAttribute(R,2)),m.setAttribute("aBend",new r.BufferAttribute(d,4)),m.setAttribute("aR",new r.BufferAttribute(M,1)),m.setIndex(new r.BufferAttribute(S,1)),m}function bt(t,e){return new r.ShaderMaterial({fog:!0,lights:!0,uniforms:{...Oe(),...Ge(),uTime:t.uTime,uClock:t.uClock,uStripDur:t.uStripDur,uCalm:t.uCalm,uPx:t.uPx,uSunGain:t.uSunGain,uPatch:t.uPatch,uPatch2:t.uPatch2,uGrow:t.uGrow,uMoss:{value:e}},vertexShader:`
      attribute vec4 aBend; attribute vec3 aCol; attribute float aR;
      uniform float uPx, uGrow;
      varying vec3 vN, vNw, vV, vCol, vOP; varying vec2 vUv; varying float vShade; varying vec2 vPW;
      #include <fog_pars_vertex>
      ${it}
      void main(){
        vec3 p = mgBend(position, aBend);
        vPW = (modelMatrix*vec4(p, 1.0)).xz;
        vec4 mvPosition = modelViewMatrix*vec4(p, 1.0);
        vec3 nv = normalize(normalMatrix*normal);
        mvPosition.xyz += nv*max(0.75*uPx*length(mvPosition.xyz) - aR, 0.0);     // twigs never thinner than 1.5 px
        float bare = smoothstep(0.0, 0.5, uClock - aBend.z*uStripDur);
        vShade = mix(1.0, mix(0.5, 1.0, max(bare, 1.0 - uGrow)), smoothstep(0.1, 0.5, aBend.w));   // twigs sit in leaf shade until stripped
        vN = nv; vNw = normalize(mat3(modelMatrix)*normal); vV = mvPosition.xyz; vCol = aCol; vOP = position; vUv = uv;
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uMoss;
      varying vec3 vN, vNw, vV, vCol, vOP; varying vec2 vUv; varying float vShade;
      ${$e}
      #include <fog_pars_fragment>
      void main(){
        vec3 n = normalize(vN), view = normalize(-vV);
        // bark: long furrows that wander, plates across them
        float fu = mgNoise(vec2(vUv.x*5.0 + 0.6*mgNoise(vec2(vUv.x*2.0, vUv.y*0.8)), vUv.y*0.55));
        float pl = mgNoise(vec2(vUv.x*2.0, vUv.y*3.2));
        float ridge = smoothstep(0.25, 0.75, fu);
        vec3 alb = vCol*(0.45 + 0.85*ridge)*(0.8 + 0.4*pl);
        float up = clamp(vNw.y, 0.0, 1.0);
        float m = smoothstep(0.35, 0.8, up*0.8 + 0.5*mgNoise(vOP.xz*1.3 + vOP.y*0.7))*(1.0 - smoothstep(4.0, 15.0, vOP.y));
        m = max(m, 0.7*(1.0 - smoothstep(0.2, 2.2, vOP.y))*smoothstep(0.3, 0.6, mgNoise(vOP.xy*2.0 + vOP.z)));
        alb = mix(alb, uMoss*(0.7 + 0.6*pl), m*0.85);
        n = normalize(n + (ridge - 0.5)*0.35*normalize(cross(n, vec3(0.31, 0.53, 0.79)) + 1e-4));
        vec3 L = mgSunDir(), S = mgSunCol();
        float ndl = max(dot(n, L), 0.0);
        vec3 c = alb*RECIPROCAL_PI*(S*ndl*vShade + mgAmb(n)*(0.55 + 0.45*vShade));
        float fr = 1.0 - max(dot(n, view), 0.0); fr *= fr; fr *= fr;
        c += mgAmb(reflect(-view, n))*RECIPROCAL_PI*fr*0.35*(1.0 - m);                        // wet bark takes the sky
        c += S*pow(max(dot(n, normalize(L + view)), 0.0), 18.0)*0.035*ridge*vShade;
        gl_FragColor = vec4(c, 1.0);
        #include <fog_fragment>
      }`})}function Pt(t,e){return new r.ShaderMaterial({fog:!0,lights:!0,uniforms:{...Oe(),...Ge(),uSunGain:t.uSunGain,uPatch:t.uPatch,uPatch2:t.uPatch2,uRock:{value:e.rock},uMoss:{value:e.moss},uRamp:{value:e.ramp},uLitter:t.uLitter},vertexShader:`
      varying vec3 vN, vNw, vV, vOP; varying vec2 vPW;
      #include <fog_pars_vertex>
      void main(){
        vPW = (modelMatrix*vec4(position, 1.0)).xz;
        vec4 mvPosition = modelViewMatrix*vec4(position, 1.0);
        vN = normalMatrix*normal; vNw = mat3(modelMatrix)*normal; vV = mvPosition.xyz; vOP = position;
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uRock, uMoss, uRamp[5]; uniform float uLitter;
      varying vec3 vN, vNw, vV, vOP;
      ${$e}
      #include <fog_pars_fragment>
      void main(){
        vec3 n = normalize(vN), nw = normalize(vNw), view = normalize(-vV);
        // thin schist beds dipping 30 degrees
        float s = dot(vOP, vec3(-0.49, 0.85, -0.17));
        float warp = mgNoise(vOP.xz*0.35)*0.5 + mgNoise(vOP.xz*1.7 + vOP.y)*0.12;
        float bed = mgNoise(vec2((s + warp)*5.0, 0.5))*0.55 + mgNoise(vec2((s + warp)*17.0, 3.5))*0.45, fine = mgNoise(vec2((s + warp)*46.0, vOP.x*0.4 + vOP.z*0.3));
        float bl = mgNoise(vOP.xz*0.6 + vOP.y*0.9);
        vec3 alb = uRock*(0.6 + 0.8*bed)*(0.7 + 0.6*fine)*(0.75 + 0.6*bl);
        alb = mix(alb, alb*vec3(1.25, 1.0, 0.78) + 0.012, smoothstep(0.62, 0.9, mgNoise(vOP.xz*0.23 + 9.0))*0.6);   // rusty weathering
        float up = clamp(nw.y, 0.0, 1.0);
        float mn = mgNoise(vOP.xz*0.8 + 3.0)*0.6 + mgNoise(vOP.xz*3.1)*0.4;
        float moss = smoothstep(0.5, 0.72, mn)*smoothstep(0.55, 0.9, up)*0.85;
        alb = mix(alb, uMoss*(0.6 + 0.9*mgNoise(vOP.xz*6.0)), moss*0.9);
        // fallen leaves: drifts in the lee and in the steps
        vec2 lc = vOP.xz*4.3; vec2 ci = floor(lc), cf = fract(lc) - 0.5;
        float h1 = mgHash(ci), h2 = mgHash(ci + 17.3);
        float drift = smoothstep(0.35, 0.8, mgNoise(vOP.xz*0.42 + 5.0)*0.7 + 0.3*smoothstep(-2.0, 7.0, vOP.x))*smoothstep(0.6, 0.9, up);
        float fleck = step(length(cf + (vec2(h1, h2) - 0.5)*0.5), 0.2 + 0.2*h2)*step(1.0 - drift*uLitter, h1*0.999);
        int li = int(min(h2*4.2, 4.0));
        vec3 lcol = uRamp[li]*(0.55 + 0.6*h1);
        alb = mix(alb, lcol, fleck);
        n = normalize(n + (bed - 0.5)*0.5*(mat3(viewMatrix)*vec3(-0.49, 0.85, -0.17))*(1.0 - moss));
        vec3 L = mgSunDir(), S = mgSunCol();
        float ndl = max(dot(n, L), 0.0);
        float ao = 0.55 + 0.45*smoothstep(-5.0, 0.5, vOP.y);
        vec3 c = alb*RECIPROCAL_PI*(S*ndl + mgAmb(n)*ao);
        float fr = 1.0 - max(dot(n, view), 0.0); fr = fr*fr*fr;
        float wet = (1.0 - moss)*(1.0 - fleck);
        c += mgAmb(reflect(-view, n))*RECIPROCAL_PI*(0.02 + 0.3*fr)*wet*ao;                    // cold sky sheen on wet rock
        c += S*pow(max(dot(n, normalize(L + view)), 0.0), 40.0)*0.10*wet*bed;
        gl_FragColor = vec4(c, 1.0);
        #include <fog_fragment>
      }`})}function lt(){const t=new r.InstancedBufferGeometry;return t.setAttribute("position",new r.Float32BufferAttribute([-1.62,-1.02,0,1.62,-1.02,0,0,2.22,0],3)),t}const je=`
  uniform vec3 uPale;
  varying vec2 vQ; varying vec3 vCol, vNg, vNl, vV; varying vec3 vAux;     // vAux = (ao, underside flash, kind); vPW comes with GLSL_LIGHT
  ${$e}
  ${nt}
  ${pt}
  #include <fog_pars_fragment>
  void main(){
    float d = mgLeaf(vQ);
    float fw = fwidth(d);
    float blob = 0.82 - length(vQ - vec2(0.0, 0.05));
    d = mix(d, blob, smoothstep(0.22, 0.6, fw));                 // far away the lobes melt into a disc: no sparkle
    if (vAux.z > 0.5) d = 0.5 - length(vQ*vec2(1.0, 0.45) - vec2(0.0, 0.1));   // graupel streak
    if (d < 0.0) discard;
    vec3 view = normalize(-vV);
    vec3 ng = normalize(vNg), nl = normalize(vNl);
    float top = dot(ng, view) > 0.0 ? 1.0 : 0.0;
    float under = max((1.0 - top)*0.85, vAux.y);
    float near = 1.0 - smoothstep(0.02, 0.10, fw);
    float ax = abs(vQ.x), yy = vQ.y + 0.22;
    float vein = max(smoothstep(0.045, 0.0, ax), smoothstep(0.04, 0.0, abs(ax*0.62 - yy*0.78)*step(0.0, yy)));
    vec3 col = vCol*(0.86 + 0.28*mgNoise(vQ*2.3 + vCol.rg*40.0))*(1.0 + 0.35*vein*near);
    col *= 0.75 + 0.25*smoothstep(0.0, 0.25, d + (1.0 - near));   // darker crisped margin
    ng = normalize(ng + cross(ng, vec3(0.37, 0.61, 0.70))*sign(vQ.x)*0.22*near);   // folded along the midrib
    vec3 c = mgLeafShade(col, mix(col, uPale, 0.45), ng, mix(nl, ng, 0.35), view, vAux.x, under);
    if (vAux.z > 0.5) c = uPale*RECIPROCAL_PI*(mgSunCol()*0.7 + mgAmb(view)*1.6);
    gl_FragColor = vec4(c, 1.0);
    #include <fog_fragment>
  }`;function At(t,e){return new r.ShaderMaterial({fog:!0,lights:!0,side:r.DoubleSide,uniforms:{...Oe(),...Ge(),uTime:t.uTime,uClock:t.uClock,uStripDur:t.uStripDur,uCalm:t.uCalm,uPx:t.uPx,uSunGain:t.uSunGain,uPatch:t.uPatch,uPatch2:t.uPatch2,uGrow:t.uGrow,uEmber:t.uEmber,uLeafAmb:t.uLeafAmb,uPale:{value:e.pale},uLip:{value:ge},uPoolY:{value:Ie},uGather:{value:new r.Vector4(-13,18,-1.5,12)},uTube:t.uTube},vertexShader:`
      attribute vec4 iPos, iBend, iRnd; attribute vec3 iOut, iCol;
      uniform float uPx, uGrow, uLip, uPoolY, uTube; uniform vec4 uGather;
      varying vec2 vQ; varying vec3 vCol, vNg, vNl, vV; varying vec3 vAux; varying vec2 vPW;
      #include <fog_pars_vertex>
      ${it}
      void main(){
        float seed = iRnd.y, h2 = fract(seed*13.7), h3 = fract(seed*29.3), h4 = fract(seed*53.9);
        float tau = uClock - (iBend.z + iRnd.x)*uStripDur, tp = max(tau, 0.0);
        float fly = step(0.0, tau);
        float heave = smoothstep(-2.8, -0.15, tau)*(1.0 - fly);
        vec3 P = mgBend(iPos.xyz, iBend);
        // torn off: accelerated to wind speed against drag, thrown up, gathered into the stream by the camera line
        float W = 13.0 + 22.0*seed, k = 1.6 + 2.6*h2;
        P.x += W*(tp - (1.0 - exp(-k*tp))/k);
        P.y += (h2*6.0 - 1.5)*(1.0 - exp(-1.6*tp))/1.6 - 0.5*tp*h3;
        float g = 0.6*(1.0 - exp(-0.4*tp));
        P.z = mix(P.z, uGather.x + uGather.y*h3, g);
        P.y = mix(P.y, uGather.z + uGather.w*h4, g*0.7);
        P.yz += (vec2(h4, fract(seed*91.7)) - 0.5)*5.0*sqrt(tp);                 // the plume frays as it goes
        float tu = min(tp*1.5, 1.0);
        P += tu*vec3(0.0, 0.55*sin(tp*3.1 + seed*40.0), 0.7*cos(tp*2.3 + seed*60.0));
        // past the lip the gust has nothing to push against: they hang, then rain down
        float over = max(P.x - uLip, 0.0), D = 18.0 + 62.0*h4*h4;
        P.x = min(P.x, uLip) + D*(1.0 - exp(-over/D));
        float tl = over/W, vt = 3.2 + 3.4*h3;
        P.y -= vt*(tl - (1.0 - exp(-0.7*tl))/0.7);
        P.z += sin(tl*2.1 + seed*50.0)*0.9*min(tl, 1.0);
        // the flight line stays open: a soft tube round the camera path from the pass, over the lip and down the dive
        { float tk = uTube*fly*smoothstep(uLip - 30.0, uLip - 6.0, P.x);
          float qx = P.x - (uLip + 20.0);
          float py = qx < 0.0 ? ${fe.toFixed(1)} : (qx < 39.83 ? -44.0 + sqrt(max(2704.0 - qx*qx, 1.0)) : -10.575 - 1.1918*(qx - 39.83));
          float cy = mix(1.0, 0.643, clamp(qx/39.83, 0.0, 1.0));
          vec2 off = vec2(P.z - ${U.toFixed(1)}, (P.y - py)*cy);
          float dd = max(length(off), 1e-2), kk = sqrt(1.0 + tk*tk/(dd*dd));
          P.z = ${U.toFixed(1)} + off.x*kk; P.y = py + off.y*kk/cy; }
        float sc = mix(smoothstep(seed*0.7, seed*0.7 + 0.3, uGrow), 1.0, fly)*smoothstep(uPoolY, uPoolY + 2.5, P.y)*mix(1.0, 0.7, smoothstep(0.3, 3.0, tp));
        // orientation: hanging and fluttering on the twig, or tumbling free
        vec3 rv = vec3(h2, h3, h4) - 0.5;
        vec3 e2 = normalize(iOut*0.55 + vec3(0.25 + 1.3*heave, -0.7 + 0.5*heave, 0.0) + rv*0.9);
        vec3 e1 = normalize(cross(e2, vec3(0.31, 0.89, 0.33) + rv) + vec3(1e-4, 0.0, 0.0));
        vec3 nA = cross(e1, e2);
        float fl = (0.3 + 1.2*heave)*sin(uTime*(5.0 + 6.0*h2) + seed*90.0)*uCalm;
        vec3 e1a = e1*cos(fl) + nA*sin(fl);
        float a1 = seed*40.0 + tp*(5.0 + 9.0*h2), a2 = seed*23.0 + tp*(1.0 + 2.0*h3);
        vec3 f1 = vec3(cos(a2), 0.0, sin(a2)), f2 = cos(a1)*vec3(0.0, 1.0, 0.0) + sin(a1)*vec3(-sin(a2), 0.0, cos(a2));
        e1 = mix(e1a, f1, fly); e2 = mix(e2, f2, fly);
        vec3 ng = cross(e1, e2);
        vec4 mvc = modelViewMatrix*vec4(P, 1.0);
        float dist = length(mvc.xyz);
        float size = max(iPos.w, 1.3*uPx*dist)*sc*step(1e-3, iPos.w)*smoothstep(0.8, mix(8.0, 13.0, fly), dist);
        vec3 wp = P + (position.x*e1 + (position.y + mix(0.75, 0.0, fly))*e2)*size;
        vec4 mvPosition = modelViewMatrix*vec4(wp, 1.0);
        vPW = (modelMatrix*vec4(wp, 1.0)).xz;
        // (seen from far up the straight the crown is a lit crimson spark: a rule from distance, the haze takes less of it)
        float farK = smoothstep(150.0, 380.0, dist);
        vQ = position.xy; vCol = iCol*(1.0 + 0.3*farK)*vec3(1.0, 1.0 - 0.38*farK, 1.0 - 0.3*farK); vV = mvPosition.xyz;
        vNg = normalMatrix*ng; vNl = normalMatrix*mix(normalize(iOut*0.8 + ng*0.45), ng, fly);
        float flash = heave*(0.45 + 0.55*sin(uTime*3.0 + seed*31.0 + iPos.x*0.6));
        vAux = vec3(mix(iRnd.w, 1.0, smoothstep(0.0, 0.8, tau)), clamp(flash, 0.0, 1.0), 0.0);
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
        #ifdef USE_FOG
          vFogDepth *= 1.0 - 0.5*farK;
        #endif
      }`,fragmentShader:je})}async function St(t,e,i,b,_,F,z){const w=e.filter(h=>!h.root&&h.depth>=2),g=w.map(h=>{let L=0;for(let n=1;n<h.pts.length;n++)L+=h.pts[n].distanceTo(h.pts[n-1]);return L*[0,0,.22,.7,1][h.depth]}),c=g.reduce((h,L)=>h+L,0),A=new Float32Array(b*4),R=new Float32Array(b*4),d=new Float32Array(b*4),M=new Float32Array(b*3),S=new Float32Array(b*3),s=P(),C=P(),f=new r.Color;let v=0,G=1;for(let h=0;h<w.length&&v<b;h++){const L=w[h],n=h===w.length-1?b-v:Math.min(b-v,Math.round(b*g[h]/c)),l=L.pts.length-1,V=[0,0,.95,.8,.65][L.depth];for(let m=0;m<n;m++){(v&1023)===0&&await t.yield();const p=(L.depth===2?i.range(.45,1):Math.pow(i(),.7))*l,k=Math.min(l-1,Math.floor(p)),$=p-k;s.copy(L.pts[k]).lerp(L.pts[k+1],$),s.x+=i.gauss()*V,s.y+=i.gauss()*V*.8-.1,s.z+=i.gauss()*V,s.z>9.3&&(s.z=9.3-i()*.4),s.y<4.6&&(s.y=4.6+i()*.6),C.subVectors(s,_),C.y*=.8;const Q=C.length();G=Math.max(G,Q),C.normalize(),A.set([s.x,s.y,s.z,i.range(.26,.4)],v*4),R.set([Y(L.flex[k],L.flex[k+1],$),L.phase,L.rel,Y(L.tip[k],L.tip[k+1],$)],v*4);const D=i.chance(.05)?i.range(.15,.6):0;d.set([i.range(-.05,.07)+D,i(),0,Q],v*4),M.set([C.x,C.y,C.z],v*3),F(f,i,C),S.set([f.r,f.g,f.b],v*3),v++}}await t.yield();for(let h=0;h<v;h++){const L=d[h*4+3]/G;d[h*4+3]=.3+.7*be(.35,.95,L)}if(z==="late")for(let h=0;h<v;h++)i.chance(.4)&&(A[h*4+3]=0);await t.yield();{let h=625341585;const L=[[A,4],[R,4],[d,4],[M,3],[S,3]];for(let n=v-1;n>0;n--){(n&4095)===0&&await t.yield(),h=Math.imul(h,1664525)+1013904223>>>0;const l=h%(n+1);if(l!==n)for(const[V,m]of L)for(let o=0;o<m;o++){const p=V[n*m+o];V[n*m+o]=V[l*m+o],V[l*m+o]=p}}}const N=lt();return N.setAttribute("iPos",new r.InstancedBufferAttribute(A,4)),N.setAttribute("iBend",new r.InstancedBufferAttribute(R,4)),N.setAttribute("iRnd",new r.InstancedBufferAttribute(d,4)),N.setAttribute("iOut",new r.InstancedBufferAttribute(M,3)),N.setAttribute("iCol",new r.InstancedBufferAttribute(S,3)),N.instanceCount=v,N}function Mt(t,e,i){return new r.ShaderMaterial({fog:!0,lights:!0,side:r.DoubleSide,defines:{NP:ze,NOBS:Le,NSTREAM:Fe},uniforms:{...Oe(),...Ge(),uTime:t.uTime,uPx:t.uPx,uSunGain:t.uSunGain,uPatch:t.uPatch,uPatch2:t.uPatch2,uEmber:t.uEmber,uLeafAmb:t.uLeafAmb,uPale:{value:i.pale},uPath:e.uPath,uPathS0:e.uPathS0,uCamS:e.uCamS,uAir:e.uAir,uStream:e.uStream,uObsA:e.uObsA,uObsB:e.uObsB,uLead:e.uLead,uAhead:e.uAhead,uFloor:e.uFloor,uClear:e.uClear,uAmount:e.uAmount,uRibA:e.uRibA,uRibB:e.uRibB,uRibAmt:e.uRibAmt},vertexShader:`
      attribute vec4 iA, iB, iC; attribute vec3 iCol;
      uniform vec3 uPath[NP]; uniform vec4 uStream[NSTREAM], uObsA[NOBS], uObsB[NOBS];
      uniform float uTime, uPx, uPathS0, uCamS, uAir, uLead, uAhead, uFloor, uClear, uAmount, uRibAmt;
      uniform vec4 uRibA[NP], uRibB[NP];   // the two ribbons at the path samples: metres right, metres up, density, braid radius
      varying vec2 vQ; varying vec3 vCol, vNg, vNl, vV; varying vec3 vAux; varying vec2 vPW;
      #include <fog_pars_vertex>
      vec3 pathAt(float s, out vec3 T){
        float f = clamp((s - uPathS0)/${xe.toFixed(1)}, 0.0, float(NP) - 1.001);
        int i = int(floor(f)); float fr = f - float(i);
        int im = i > 0 ? i - 1 : 0, ip = i < NP - 2 ? i + 2 : NP - 1;
        vec3 a = uPath[i], b = uPath[i + 1];
        T = normalize(mix(b - uPath[im], uPath[ip] - a, fr) + vec3(1e-5, 0.0, 0.0));
        return mix(a, b, fr);
      }
      void main(){
        float seed = iC.x;
        float sRel = mod(iA.x + iA.w*uTime + uAir + 3.5*sin(uTime*0.45 + seed*50.0), ${ue.toFixed(1)}) - ${Re.toFixed(1)};
        float s = uCamS + sRel;
        float edge = smoothstep(${(-Re).toFixed(1)}, ${(-Re+10).toFixed(1)}, sRel)*(1.0 - smoothstep(${(ue-Re-20).toFixed(1)}, ${(ue-Re).toFixed(1)}, sRel));
        float ahead = smoothstep(uLead, uLead + 14.0, sRel + (seed - 0.5)*16.0);
        float keep = mix(1.0, step(fract(seed*17.31), uAhead), ahead)*step(fract(seed*29.73), uAmount);
        float lat, hgt, rib = 0.0;
        if (iB.x >= 99.5) {
          // a ribbon: three strands rolling round one another along a centre line the world laid through the trunks and over
          // the stones; denser and thinner in slow waves, never empty
          float code = iB.x - 100.0, rb = step(9.5, code), strand = code - 10.0*rb;
          float f = clamp((s - uPathS0)/${xe.toFixed(1)}, 0.0, float(NP) - 1.001);
          int i = int(floor(f)); float fr = f - float(i);
          vec4 R = mix(mix(uRibA[i], uRibA[i + 1], fr), mix(uRibB[i], uRibB[i + 1], fr), rb);
          float roll = s*0.25 + uTime*(0.9 - 1.7*rb) + strand*2.094 + rb*1.7;
          float wob = 0.75 + 0.25*sin(s*0.057 + strand*1.3 + uTime*0.3);
          vec2 o = R.w*wob*vec2(cos(roll), 0.8*sin(roll)) + vec2(iA.y, iA.z)*(0.11 + 0.08*R.w);      // each strand a rope a hand-span thick, with a few strays
          lat = R.x + o.x; hgt = max(R.y + o.y, uFloor - 0.6 + 0.4*seed);
          keep = step(fract(seed*29.73), uRibAmt*R.z*(0.74 + 0.26*sin(s*0.08 - uTime*1.2 + rb*2.0 + strand)))
               * mix(1.0, step(fract(seed*17.31), 0.5), smoothstep(45.0, 110.0, sRel));
          rib = 1.0;
        } else if (iB.x >= 0.0) {
          vec4 st = uStream[int(iB.x + 0.5)];
          float roll = s*0.06 + uTime*0.8 + st.z*3.0, cr = cos(roll), sr = sin(roll);
          vec2 o = vec2(iA.y*cr - iA.z*sr, (iA.y*sr + iA.z*cr)*0.7)*st.w;      // each stream rolls like a rope
          lat = st.x + 2.9*sin(s*0.031 + st.z) + 1.2*sin(s*0.083 + st.z*1.7) + o.x;
          hgt = st.y + 1.5*sin(s*0.043 + st.z*2.3) + 0.6*sin(s*0.11 + st.z) + o.y;
        } else { lat = iC.y; hgt = iC.z + 1.2*sin(s*0.05 + seed*30.0); }
        lat += 0.3*sin(uTime*1.3 + seed*40.0 + s*0.21); hgt += 0.25*sin(uTime*1.7 + seed*71.0 + s*0.17);
        hgt = mix(max(hgt, uFloor + 0.4*seed), hgt, rib);
        { float cl = (1.0 - rib)*uClear*smoothstep(1.0, 9.0, sRel)*(1.0 + 0.085*max(sRel - 9.0, 0.0)), rr = max(length(vec2(lat, hgt)), 1e-2), kk = sqrt(1.0 + cl*cl/(rr*rr)); lat *= kk; hgt *= kk; }
        vec3 T; vec3 P = pathAt(s, T);
        vec2 Th = normalize(T.xz + vec2(1e-5, 0.0)), Nh = vec2(-Th.y, Th.x);
        P.xz += Nh*lat; P.y += hgt;
        // part round the obstacles (displacement of potential flow past a cylinder), curl in the lee
        for (int k = 0; k < NOBS; k++) {
          vec4 A = uObsA[k];
          float wv = 1.0 - smoothstep(0.0, A.w + 0.5, max(A.y - P.y, P.y - uObsB[k].x));
          float a = A.w*wv;
          vec2 d = P.xz - A.xz;
          P.xz = A.xz + d*sqrt(1.0 + a*a/max(dot(d, d), 1e-3));
          d = P.xz - A.xz;
          float side = dot(d, Nh) < 0.0 ? -1.0 : 1.0;
          // a ribbon unbraids round what it meets: the strands on one side ride up and those on the other dip, so that from
          // beside it (where the lens is) it opens like an eye round the trunk and closes again behind
          P.y += rib*side*0.7*a*(a*a/max(dot(d, d), max(a*a, 1e-3)));
          vec2 c = A.xz + Th*a*1.9 + Nh*side*a*0.75;
          vec2 dw = P.xz - c;
          float ang = -side*2.6*exp(-dot(dw, dw)/max(a*a*1.1, 1e-3))*wv;
          float ca = cos(ang), sa = sin(ang);
          P.xz = c + vec2(dw.x*ca - dw.y*sa, dw.x*sa + dw.y*ca);
        }
        vec4 mvc = modelViewMatrix*vec4(P, 1.0);
        float dist = length(mvc.xyz);
        float size = max(iB.w, 1.25*uPx*dist)*edge*keep*smoothstep(0.8, 7.0, dist);
        float a1 = iB.y + iB.z*uTime, a2 = seed*23.0 + uTime*(0.6 + seed);
        vec3 e1 = vec3(cos(a2), 0.0, sin(a2)), e2 = cos(a1)*vec3(0.0, 1.0, 0.0) + sin(a1)*vec3(-sin(a2), 0.0, cos(a2));
        if (iC.w > 0.5) { e2 = T*5.0; e1 = normalize(cross(T, vec3(0.3, 1.0, 0.2))); }       // graupel: a streak along the flow
        vec3 ng = normalize(cross(e1, e2));
        vec3 wp = P + (position.x*e1 + (position.y - 0.1)*e2)*size;
        vec4 mvPosition = modelViewMatrix*vec4(wp, 1.0);
        vPW = (modelMatrix*vec4(wp, 1.0)).xz;
        vQ = position.xy; vCol = iCol; vV = mvPosition.xyz; vNg = normalMatrix*ng; vNl = vNg;
        vAux = vec3(1.0, 0.0, iC.w);
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:je})}async function zt(t,e,i,b,_,F=0,z=0){const w=i+F+z,g=new Float32Array(w*4),c=new Float32Array(w*4),A=new Float32Array(w*4),R=new Float32Array(w*3),d=new r.Color,M=P(0,1,0),S=Array.from({length:Fe},()=>Array.from({length:3},(f,v)=>({s:(v+e.range(.15,.85))/3*ue,v:e.range(-7,3),len:e.range(5,9)})));for(let f=0;f<i;f++){(f&511)===0&&await t.yield();const v=e()<.9,G=e.chance(.12)?1.4:.48,N=_&&e.chance(.14)?1:0,h=e.int(0,Fe-1);let L=e()*ue,n=e.range(-10,5);if(v&&e.chance(.8)){const l=S[h][e.int(0,2)];L=(l.s+e.gauss()*l.len+ue*4)%ue,n=l.v}g.set([L,e.gauss()*G,e.gauss()*G,n],f*4),c.set([v&&!N?h:-1,e.range(0,6.28),e.range(3,11)*e.sign(),N?.035:e.range(.1,.19)],f*4),A.set([e(),e.range(-22,22),-3.5+17.5*Math.pow(e(),1.4),N],f*4),b(d,e,M),R.set([d.r,d.g,d.b],f*3)}const s=e.fork("ribbons");for(let f=i;f<w;f++){(f&511)===0&&await t.yield();const v=f-i<F?0:1,G=s.int(0,2),N=s.chance(.1)?3:1;g.set([s()*ue,s.gauss()*N,s.gauss()*N,s.range(-9,2.5)],f*4),c.set([100+10*v+G,s.range(0,6.28),s.range(3,11)*s.sign(),s.range(.13,.22)],f*4),A.set([s(),0,0,0],f*4),b(d,s,M),d.multiplyScalar(1.25),R.set([Math.min(d.r,.8),Math.min(d.g,.8),Math.min(d.b,.8)],f*3)}const C=lt();return C.setAttribute("iA",new r.InstancedBufferAttribute(g,4)),C.setAttribute("iB",new r.InstancedBufferAttribute(c,4)),C.setAttribute("iC",new r.InstancedBufferAttribute(A,4)),C.setAttribute("iCol",new r.InstancedBufferAttribute(R,3)),C.instanceCount=w,C}function Ct(t,e,i){return new r.ShaderMaterial({fog:!0,lights:!0,side:r.DoubleSide,defines:{NP:ze},uniforms:{...Oe(),...Ge(),uTime:t.uTime,uPx:t.uPx,uSunGain:t.uSunGain,uPatch:t.uPatch,uPatch2:t.uPatch2,uEmber:t.uEmber,uLeafAmb:t.uLeafAmb,uPale:{value:i.pale},uPath:e.uPath,uPathS0:e.uPathS0,uFrontS:e.uFrontS,uGustV:e.uGustV},vertexShader:`
      attribute vec4 aP;       // where it hangs in the crown (world), size
      attribute vec4 aQ;       // downwind at the tree (x, z), metres of front travel past the tree at which it lets go, seed
      attribute vec4 aR;       // the stream line it joins: metres right of the path, metres above it; the tree's path distance; its speed as a share of the gust's
      attribute vec3 aCol;
      uniform vec3 uPath[NP];
      uniform float uTime, uPx, uPathS0, uFrontS, uGustV;
      varying vec2 vQ; varying vec3 vCol, vNg, vNl, vV; varying vec3 vAux; varying vec2 vPW;
      #include <fog_pars_vertex>
      vec3 pathAt(float s, out vec3 T){
        float f = clamp((s - uPathS0)/${xe.toFixed(1)}, 0.0, float(NP) - 1.001);
        int i = int(floor(f)); float fr = f - float(i);
        int im = i > 0 ? i - 1 : 0, ip = i < NP - 2 ? i + 2 : NP - 1;
        vec3 a = uPath[i], b = uPath[i + 1];
        T = normalize(mix(b - uPath[im], uPath[ip] - a, fr) + vec3(1e-5, 0.0, 0.0));
        return mix(a, b, fr);
      }
      void main(){
        float seed = aQ.w, h2 = fract(seed*13.7), h3 = fract(seed*29.3), h4 = fract(seed*53.9), h5 = fract(seed*91.7), h6 = fract(seed*71.3);
        float dl = uFrontS - aR.z - aQ.z;                       // metres the front has run since this leaf let go
        float t = max(dl, 0.0)/max(uGustV, 1.0);                // seconds, at the gust's own speed
        float k = 3.0 + 2.5*h2, W = uGustV*aR.w;
        // taken up to the wind's speed against drag, and thrown ahead by the gust behind the front, which is faster than the
        // front itself: most leaves a little, a few far, so the plume is thick at the crown and drawn out to a point downwind
        // (and since we travel with the front, the thrown leaves stay in front of the lens for the rest of their flight)
        float adv = W*(t - (1.0 - exp(-k*t))/k) + (3.0 + 15.0*h6*h6)*(1.0 - exp(-2.4*t));
        vec3 A = aP.xyz + vec3(aQ.x, 0.0, aQ.y)*adv;
        A.y += (2.4 + 3.6*h3)*(1.0 - exp(-2.2*t))/2.2 - 0.6*t*t;          // flung up out of the lee of the crown, then sinking
        vec3 T1; vec3 B = pathAt(aR.z + adv, T1);
        vec2 Th = normalize(T1.xz + vec2(1e-5, 0.0)), Nh = vec2(-Th.y, Th.x);
        float roll = (aR.z + adv)*0.19 + floor(seed*3.0)*2.094 + uTime*0.7;
        vec2 o = vec2(cos(roll), 0.8*sin(roll))*(0.25 + 0.55*h5);         // three strands rolling round one another, as the ribbons do
        B.xz += Nh*(aR.x + o.x); B.y += aR.y + o.y;
        float g = 1.0 - exp(-(1.3 + 0.9*h4)*t); g = g*g*(3.0 - 2.0*g);    // gathered into the stream: straight downwind at first, then drawn across
        vec3 P = mix(A, B, g);
        P += (vec3(h4, h2, h5) - 0.5)*(0.85*sqrt(t)*(1.0 - 0.75*g));       // the jet frays a little as it leaves the crown, and closes again in the stream
        P += min(t*2.0, 1.0)*vec3(0.0, 0.4*sin(t*3.1 + seed*40.0 + uTime*1.3), 0.5*cos(t*2.3 + seed*60.0 + uTime*1.1));
        float life = 40.0 + 22.0*h3;                                      // metres of the front's travel: two seconds and more in the air, the last third of it thinning away
        float sc = smoothstep(0.0, 1.4, dl)*(1.0 - smoothstep(life*0.62, life, dl));
        float a1 = seed*40.0 + uTime*(3.0 + 8.0*h2)*(h3 < 0.5 ? -1.0 : 1.0), a2 = seed*23.0 + uTime*(0.6 + seed);
        vec3 e1 = vec3(cos(a2), 0.0, sin(a2)), e2 = cos(a1)*vec3(0.0, 1.0, 0.0) + sin(a1)*vec3(-sin(a2), 0.0, cos(a2));
        vec3 ng = normalize(cross(e1, e2));
        vec4 mvc = modelViewMatrix*vec4(P, 1.0);
        float dist = length(mvc.xyz);
        float size = max(aP.w*mix(1.3, 1.0, smoothstep(0.0, 0.7, t)), 1.25*uPx*dist)*sc*smoothstep(0.8, 7.0, dist);   // (a burst leaf keeps its own size, with the floor and the fade near the eye the flying leaves have)
        vec3 wp = P + (position.x*e1 + (position.y - 0.1)*e2)*size;
        vec4 mvPosition = modelViewMatrix*vec4(wp, 1.0);
        vPW = (modelMatrix*vec4(wp, 1.0)).xz;
        vQ = position.xy; vCol = aCol; vV = mvPosition.xyz; vNg = normalMatrix*ng; vNl = vNg;
        vAux = vec3(1.0, 0.6*(1.0 - smoothstep(0.0, 0.3, t)), 0.0);      // torn off pale side up
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:je})}async function kt(t,e,i){const b=i.reduce((s,C)=>s+C.n,0),_=b*3,F=new Float32Array(_*3),z=new Float32Array(_*4),w=new Float32Array(_*4),g=new Float32Array(_*4),c=new Float32Array(_*3),A=[-1.62,-1.02,1.62,-1.02,0,2.22],R=new r.Color,d=[];let M=0;for(const s of i){d.push(M);for(let C=0;C<s.n;C++,M++){(M&511)===0&&await t.yield();let f=e.gauss(),v=e.gauss(),G=e.gauss();const N=Math.hypot(f,v,G)||1;f/=N,v/=N,G/=N;const h=Math.min(.3*s.r,1.6)*Math.pow(e(),.45),L=f*s.t[0]+G*s.t[1],n=h/s.r,l=s.c[0]+s.t[0]*s.r*.45+f*h,V=s.c[1]+s.ry*.3+v*h*.8,m=s.c[2]+s.t[1]*s.r*.45+G*h,o=e(),p=o<.3?-10.5:o<.5?-2.5:o<.66?6.5:1e3,k=.5*s.r*L*n+(p<100?p+e.gauss()*2.1:Y(-13,18,Math.pow(e(),1.7)))*(s.tight??1),$=e.range(.16,.26)*(s.size||1),Q=e(),D=s.lat+e.gauss()*(s.fan?s.fan[0]:.3),O=s.hgt+e.gauss()*(s.fan?s.fan[1]:.25),y=e.range(.86,1.03);R.copy(s.cols[e.int(0,s.cols.length-1)]).multiplyScalar(e.range(.7,1.02));const I=Math.min(R.r,.8),X=Math.min(R.g,.8),j=Math.min(R.b,.8);for(let q=0;q<3;q++){const T=M*3+q;F[T*3]=A[q*2],F[T*3+1]=A[q*2+1],z[T*4]=l,z[T*4+1]=V,z[T*4+2]=m,z[T*4+3]=$,w[T*4]=s.t[0],w[T*4+1]=s.t[1],w[T*4+2]=k,w[T*4+3]=Q,g[T*4]=D,g[T*4+1]=O,g[T*4+2]=s.s,g[T*4+3]=y,c[T*3]=I,c[T*3+1]=X,c[T*3+2]=j}}}d.push(M);const S=new r.BufferGeometry;return S.setAttribute("position",new r.BufferAttribute(F,3)),S.setAttribute("aP",new r.BufferAttribute(z,4)),S.setAttribute("aQ",new r.BufferAttribute(w,4)),S.setAttribute("aR",new r.BufferAttribute(g,4)),S.setAttribute("aCol",new r.BufferAttribute(c,3)),S.setDrawRange(0,0),S.userData.starts=d,S}async function Rt(t,e={}){const i=t.rng.fork("maple-gale-hero"),b=t.noise,_=t.quality?.detail??1,F=Array.isArray(e.palette)&&e.palette.length>=7?e.palette:dt,[z,w,g,c,A,R,d]=F.map(a=>new r.Color(a)),M=e.season||"peak",S=e.weather||(e.hour==="golden"||e.hour==="dawn"?e.hour:"slate"),s=z.clone().lerp(w,.4),C=z.clone().multiplyScalar(.5),f=g.clone().multiplyScalar(.85),v=w.clone().lerp(c,.62),G=d.clone().lerp(new r.Color("#7d9a2e"),.6),N={pale:R.clone().lerp(z,S==="dawn"?.04:.14).multiplyScalar(.82),rock:c.clone().lerp(A,.18).lerp(new r.Color("#4a4038"),.25).multiplyScalar(2.6),moss:d.clone().lerp(new r.Color("#5d7d2a"),.55).multiplyScalar(1.15),ramp:[z,s,w.clone().multiplyScalar(.9),f,v]},h=c.clone().lerp(new r.Color("#57463a"),.6).multiplyScalar(1.25),L=h.clone().multiplyScalar(.55).lerp(A,.08),n=i.range(-.12,.16),l=(a,x,E)=>{const re=x()+n+.22*E.y;M==="early"&&x.chance(.33)?a.copy(G).lerp(f,x()*.7):re<.3?a.copy(C).lerp(z,x()):re<.82?a.copy(z).lerp(s,x()*.35):re<1.08?a.copy(z).lerp(s,.5+.5*x()):a.copy(s).lerp(w,x()*.7),a.multiplyScalar(x.range(.78,1.1))},V=(a,x)=>{const E=x();E<.36?a.copy(z).lerp(C,x()*.5):E<.58?a.copy(s):E<.79?a.copy(w).multiplyScalar(.9):E<.94?a.copy(f).lerp(w,x()*.4):a.copy(v),a.multiplyScalar(x.range(.72,1.08))},m={uTime:{value:0},uClock:{value:-9},uStripDur:{value:2},uCalm:{value:S==="dawn"?.7:1},uPx:{value:.0015},uTube:{value:6.5},uSunGain:{value:1},uPatch:{value:new r.Vector4(0,0,1e6,1)},uPatch2:{value:new r.Vector3(0,0,.001)},uGrow:{value:1},uEmber:{value:S==="golden"?2.3:1.7},uLeafAmb:{value:S==="slate"?1.7:S==="dawn"?1.45:1.3},uLitter:{value:M==="late"?1:.7}},o={uPath:{value:Array.from({length:ze},(a,x)=>P(x*xe,0,0))},uPathS0:{value:0},uCamS:{value:0},uAir:{value:0},uStream:{value:[]},uObsA:{value:Array.from({length:Le},()=>new r.Vector4(0,-9999,0,0))},uObsB:{value:Array.from({length:Le},()=>new r.Vector4(-9999,0,0,0))},uLead:{value:e.lead??25},uAhead:{value:e.ahead??.3},uFloor:{value:e.floor??-3.6},uClear:{value:0},uAmount:{value:1},uRibA:{value:Array.from({length:ze},()=>new r.Vector4(0,0,0,1))},uRibB:{value:Array.from({length:ze},()=>new r.Vector4(0,0,0,1))},uRibAmt:{value:1},uFrontS:{value:-1e4},uGustV:{value:26}},p=i.fork("streams");for(let a=0;a<Fe;a++){const x=Y(-17,17,(a+.5)/Fe)+p.range(-1.6,1.6);let E=p.range(-2.8,9.5);Math.abs(x)<5.5&&(E=p.chance(.5)?p.range(-3,-1.9):p.range(2.8,5.5)),o.uStream.value.push(new r.Vector4(x,E,p.range(0,6.28),p.range(.85,1.5)))}const k=new r.Group;k.name="maple-gale-hero";const $=gt(b,i.range(0,50));if(e.base!==!1){const a=new r.Mesh(xt($,i.fork("rock")),Pt(m,N));a.name="outcrop",k.add(a)}await t.yield();const Q=await yt(t,i.fork("skeleton"),$);await t.yield();const D=new r.Mesh(await wt(t,Q,i.fork("bark"),h,L),bt(m,N.moss));D.name="limbs",D.frustumCulled=!1,k.add(D),await t.yield();const O=new r.Box3;for(const a of Q)if(!a.root&&a.depth>=3)for(const x of a.pts)O.expandByPoint(x);const y=O.getCenter(P());y.y-=1;const I=Math.max(O.max.x-O.min.x,O.max.z-O.min.z)*.5,X=Math.round((e.mapleLeaves??34e3)*Y(1,_,.5)),j=new r.Mesh(await St(t,Q,i.fork("leaves"),X,y,l,M),At(m,N));j.name="crown-leaves",j.frustumCulled=!1,k.add(j);const q=j.geometry.instanceCount;await t.yield();const T=Math.round((e.gustLeaves??56e3)*_*(M==="late"?1.12:1)),ae=Y(.6,1,_),oe=Math.round((e.ribbonLeaves??0)*.78*ae),ee=Math.round((e.ribbonLeaves??0)*.22*ae),H=new r.Mesh(await zt(t,i.fork("gust"),T,V,S==="squall",oe,ee),Mt(m,o,N));H.name="gust",H.frustumCulled=!1,H.matrixAutoUpdate=!1,k.add(H),await t.yield();const se=Ct(m,o,N);let te=null,me=[],Z=[];const Ce=a=>rt+(a<0?-a*36/560:0),ie=[];for(const a of[-420,-340,-260,-180,-120])ie.push(P(a,Ce(a)+4.5,U));ie.push(P(-87,Ce(-87)+4.5,U),P(-45,fe+.25,U),P(0,fe,U),P(ge,fe,U),P(ge+20,fe,U));const Be=ge+20,he=50*Math.PI/180;for(let a=10;a<=50;a+=10){const x=a*Math.PI/180;ie.push(P(Be+52*Math.sin(x),fe-52*(1-Math.cos(x)),U))}const ye=ie[ie.length-1];ie.push(P(ye.x+30*Math.cos(he),ye.y-30*Math.sin(he),U));const Pe=P(ye.x+60*Math.cos(he),ye.y-60*Math.sin(he),U);ie.push(Pe.clone());const ce=[{x:.9,z:0,r:1.5,y0:-4,y1:9},{x:y.x,z:y.z,r:I*.9,y0:O.min.y+3,y1:O.max.y-1,crown:!0}],De={trunkBase:P(0,0,0),crownCentre:y.clone(),crownTop:P(y.x+1.5,O.max.y,y.z),windDir:P(1,0,0),lipX:ge,waterY:rt,poolY:Ie,pass:P(0,fe,U),flyThrough:ie,viewpoints:{farReveal:ie[0].clone(),stripStart:P(-50,fe+.3,U),bare:P(0,fe,U),openAir:P(ge+20,fe,U)},fallFoot:P(ge+3,Ie,U),spiralEye:P(Pe.x,Ie,U),portalSeat:{position:Pe.clone(),facing:P(-Math.cos(he),Math.sin(he),0)},obstacles:ce.map(a=>({...a}))},We=vt(ie.map(a=>[a.x,a.y,a.z]));let Ae=e.path||null,Se="demo",Ke=0,qe=null,ke=null,Nt="",Ye=null,ve=-9,Me=[],Te=null;const ut=ce.map(()=>({x:0,z:0,r:0,y0:0,y1:0,d:-1})),Xe=[0,1].map(()=>({x:0,z:0,r:0,y0:-1e3,y1:1e3,d:-1})),Ze=e.stripLead??50;let Je=e.lead??25;const Ue=25,_e=new r.Matrix4,ne=P(),de=P(),ct=new r.Vector2,Ne=[];let et=NaN,tt=NaN,at;function ft(a,x,E){m.uTime.value=x,k.updateWorldMatrix(!0,!1),_e.copy(k.matrixWorld),H.matrix.copy(_e).invert(),H.matrixWorldNeedsUpdate=!0;let re=1080;t.renderer?.getDrawingBufferSize&&(re=t.renderer.getDrawingBufferSize(ct).y||1080);const pe=E?.projectionMatrix?.elements[5]||1.66;m.uPx.value=2/(pe*re);const W=Ae||We;de.setFromMatrixPosition(_e),(ke===null||at!==W||et!==de.x||tt!==de.z)&&(ke=(Ae?W.nearestXZ(de.x,de.z):W.nearestXZ(0,0)).u*W.length,at=W,et=de.x,tt=de.z);const K=Se==="path"?Ke*W.length:ke-25;if(E){ne.setFromMatrixPosition(E.matrixWorld);const u=ne.distanceTo(de);j.geometry.instanceCount=Math.max(1,Math.round(q*Y(.3,1,1-be(220,450,u)))),D.visible=u<520}let Ee=1;if(qe!=null)ve=qe;else if(Se==="path")ve=Math.max(-9,(K-(ke-Ze))/(Ze/m.uStripDur.value));else{const u=((x+13)%20+20)%20;u<4?ve=-4.5+u*1.125:u<15?ve=u-4:(ve=-5,Ee=le((u-15)/4.2,0,1))}m.uClock.value=ve,m.uGrow.value=Ee;const He=Math.floor((K-Re-4)/xe)*xe,ot=o.uPath.value;for(let u=0;u<ze;u++)W.posAtDist(He+u*xe,ot[u]),Ae||ot[u].applyMatrix4(_e);if(o.uPathS0.value=He,o.uCamS.value=K,Te){const u=Math.round(He/xe),B=o.uRibA.value,J=o.uRibB.value;for(let we=0;we<ze;we++){const Ve=le(u+we,0,Te.n-1)*4;B[we].fromArray(Te.a,Ve),J[we].fromArray(Te.b,Ve)}}o.uLead.value=Se==="demo"?999:Je;const Qe=Se==="path"?K+Ue:-1e4;if(o.uFrontS.value=Qe,te){te.matrix.copy(H.matrix),te.matrixWorldNeedsUpdate=!0;let u=0,B=0;const J=me.length;for(;u<J&&me[u]<Qe-84;)u++;for(B=u;B<J&&me[B]<Qe+18;)B++;te.geometry.setDrawRange(Z[u]*3,(Z[B]-Z[u])*3)}const mt=Ye??(Se==="demo"?24:0);o.uAir.value=(mt*x%ue+ue)%ue,Ne.length=0;const ht=be(.4,2.6,ve)*Ee+(1-Ee);for(let u=0;u<ce.length;u++){const B=ce[u],J=ut[u];ne.set(B.x,0,B.z).applyMatrix4(_e),J.x=ne.x,J.z=ne.z,J.r=B.crown?B.r*Y(1,.3,ht):B.r,J.y0=B.y0+ne.y,J.y1=B.y1+ne.y,Ne.push(J)}for(const u of Xe)u.r>.01&&Ne.push(u);if(Me.length){Se==="path"&&Ae?W.posAtDist(Math.min(K+10,W.length),ne):E?ne.setFromMatrixPosition(E.matrixWorld):ne.copy(de);for(const u of Me){const B=u.x-ne.x,J=u.z-ne.z;u.d=(B*B+J*J)*(u.rib?.16:1)}Me.length>Le-2&&Me.sort((u,B)=>u.d-B.d);for(let u=0;u<Me.length&&Ne.length<Le;u++)Ne.push(Me[u])}for(let u=0;u<Le;u++){const B=Ne[u],J=o.uObsA.value[u],we=o.uObsB.value[u];if(!B){J.set(0,-9999,0,0),we.set(-9999,0,0,0);continue}const Ve=B.d>0?1-be(110,140,Math.sqrt(B.d)):1;J.set(B.x,B.y0??-1e3,B.z,Math.max(0,(B.r??1)*Ve)),we.set(B.y1??1e3,0,0,0)}}return await t.yield(),{object:k,radius:14,height:28,center:P(y.x*.7,15,0),anchors:De,ground:!0,groundY:-2.4,uniforms:m,update:ft,dispose(){},setPath(a){Ae=a||null,ke=null},setProgress(a){Se="path",Ke=le(a,0,1)},setStrip(a){qe=a??null},setObstacles(a){Me=(a||[]).map(x=>({x:x.x,z:x.z,r:x.r??1,y0:x.y0??-1e3,y1:x.y1??1e3,d:0,rib:!!x.rib}))},setHold(a,x,E,re,pe=-1e3,W=1e3){const K=Xe[a&1];K.x=x,K.z=E,K.r=Math.max(0,re),K.y0=pe,K.y1=W},setSun(a){m.uSunGain.value=Math.max(0,a)},setPatch(a,x,E,re,pe=0,W=0,K=0){m.uPatch.value.set(a,x,E,re),m.uPatch2.value.set(pe,W,Math.max(K,.001))},async setBursts(a,x){if(te||!a||!a.length)return{leaves:0,peak:0};const E=[...a].sort((W,K)=>W.s-K.s),re=await kt(t,x||i.fork("bursts"),E);me=E.map(W=>W.s),Z=re.userData.starts,te=new r.Mesh(re,se),te.name="crown-bursts",te.frustumCulled=!1,te.matrixAutoUpdate=!1,k.add(te);let pe=0;for(let W=0,K=0;W<E.length;W++){for(;me[W]-me[K]>102;)K++;pe=Math.max(pe,Z[W+1]-Z[K])}return{leaves:Z[E.length],peak:pe}},frontLead:Ue,stripClock:()=>ve,stripAmount:()=>le(ve/m.uStripDur.value,0,1),treeS:()=>ke,gust:{mesh:H,uniforms:o,setLead(a){Je=a},setAhead(a){o.uAhead.value=le(a,0,1)},setAirSpeed(a){Ye=a??null},setFloor(a){o.uFloor.value=a},setClear(a){o.uClear.value=Math.max(0,a)},setAmount(a){o.uAmount.value=le(a,0,1)},ribStep:xe,setRibbons(a){Te=a&&a.n>1?a:null},setRibbonAmount(a){o.uRibAmt.value=le(a,0,1)}}}}export{nt as GLSL_LEAF,Rt as buildHero};
