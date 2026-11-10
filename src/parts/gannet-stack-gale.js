import*as n from"three";import{clamp as Pe,lerp as $,smoothstep as Le,makeRng as ht,hashSeed as ct}from"../kit/core.js";const Me=170,Fe=40,We=15,Ue=13,Ve=26,ot=1.1,fe=Math.PI*2,wt=["#12161C","#3B4650","#1D564E","#2E9A7E","#F4F0E4","#E3B04B","#7FE6C8"],gt=0,At=(e,t,i)=>.5*(e+t+Math.sqrt((e-t)*(e-t)+i*i)),bt=e=>(e=(e+Math.PI)%fe,e<0&&(e+=fe),e-Math.PI),dt=e=>(e%=fe,e<0?e+fe:e),yt=e=>e<=Ue?We:e>=Ve?0:We*Math.sqrt(1-((e-Ue)/(Ve-Ue))**2);function Mt(e,t){const i={bodyR:e.range(44,46.5),eastFlat:e.range(6,9),prowX:e.range(67,71),prowW:e.range(15.5,17.5),prowY0:e.range(36,46),prowY1:e.range(88,108),nAmp:e.range(2,3.2),nOff:e.range(0,50),lean:e.range(.35,.6),taper:e.range(.82,1)},g=[],E=e.int(3,5);for(let o=0;o<E;o++)g.push({th:e.range(1.2,fe-1.2),w:e.range(.06,.12),d:-e.range(2.2,4.5),y0:e.range(10,90),y1:e.range(110,175)});for(let o=0;o<2;o++){const d=e.range(40,110);g.push({th:e.range(1.3,fe-1.3),w:e.range(.25,.45),d:e.range(1.6,3.2),y0:d,y1:d+e.range(22,40)})}const S=e.int(4,6);for(let o=0;o<S;o++)g.push({th:e.range(.9,fe-.9),w:e.range(.22,.5),d:e.range(2.5,6)*(e.chance(.45)?-1:.8),y0:e.range(-20,50),y1:e.range(90,200)});const b=e.int(2,3);for(let o=0;o<b;o++)g.push({th:e.range(1,fe-1),w:e.range(.4,.8),d:-e.range(3.5,7),y0:e.range(35,135),y1:400,sharp:1});const z=e.range(1.2,3),H=e.range(0,fe),k=[];let u=0;const U=o=>{let d=(i.bodyR-28-u)*Math.pow(Pe(o/Me,0,1),i.taper)+z*Math.sin(Pe(o/Me,0,1)*Math.PI)*Math.sin(o*.045+H);for(const A of k)d+=A.d*Le(A.y,A.y+.5,o);return d};function B(o,d){const A=U(d),j=bt(o),Z=Math.cos(j),v=Math.abs(Math.sin(j));let D=i.bodyR-A-i.eastFlat*Math.exp(-(j/.9)*(j/.9))*(1-.6*Le(60,150,d));if(Z>.15){const q=Le(i.prowY0,i.prowY1,d),Y=$(i.prowX,D,q)-A*.5,ie=i.prowW*(1-.5*q)-A*.4;D=At(D,Math.min(Y,ie/Math.max(v,.001)),2)-.4}D+=i.nAmp*t.fbm3(Math.cos(j)*1.7+i.nOff,Math.sin(j)*1.7,d*.013,3);for(const q of g){if(d<=q.y0||d>=q.y1)continue;const Y=bt(o-q.th)/q.w;Math.abs(Y)>3||(D+=q.d*(q.sharp?Le(2.2,1.2,Math.abs(Y)):Math.exp(-Y*Y))*Le(q.y0,q.y0+(q.sharp?1:8),d)*(1-Le(q.y1-8,q.y1,d)))}return D}const C=[-4,e.range(5,7.5)];for(;C[C.length-1]<Me-9.5;)C.push(C[C.length-1]+e.range(4.6,9));C.push(Me);const L=C.length-1,a=[0];for(;;){const o=a[a.length-1]+e.range(9,26)/40;if(o>fe-.2)break;a.push(o)}const r=a.length,p=[];for(let o=0;o<=L;o++){const d=new Float32Array(r);if(o>0)for(let A=0;A<r;A++)d[A]=(o===L?.5:1.7)*e.range(-1,1)*(e.chance(.3)?.2:1);p.push(d)}const x=o=>{o=dt(o);let d=r-1;for(;d>0&&a[d]>o;)d--;return d},h=(o,d)=>C[o]+p[o][x(d)],f=new Float32Array(L+1);for(let o=0;o<=L;o++)f[o]=e.range(0,100);for(const[o,d]of[[46,62],[90,108],[130,146]]){const A={y:e.range(o,d),d:e.range(2.6,4.6)};k.push(A),u+=A.d}const c=new Float64Array(L+2).fill(NaN),m=new Float64Array(L+2),l=(o,d)=>{if(c[o]===d)return m[o];const A=B(d,Math.max(C[o],0))+1.25*t.n2(Math.cos(d)*5.5+f[o],Math.sin(d)*5.5-f[o]);return c[o]=d,m[o]=A,A},F=.62,w=(o,d)=>o===0?l(0,d):Math.min(l(o,d),l(o-1,d)+i.lean-F),N=(o,d)=>w(o,d)+i.lean,K=(o,d)=>{const A=x(d);let j=0;for(;j<L-1&&C[j+1]+p[j+1][A]<o;)j++;return j},I=(o,d)=>{const A=K(d,o),j=h(A,o),Z=h(A+1,o);return w(A,o)+i.lean*Pe((d-j)/Math.max(Z-j,.1),0,1)};return{P:i,yb:C,nT:L,blocks:a,nB:r,blockOf:x,tierY:h,footR:w,topR:N,surfR:I,lipRadius:(o,d)=>{let A=0;for(let j=0;j<L;j++){const Z=C[j+1];Z>d-11&&Z<d+6&&(A=Math.max(A,N(j,o)+.35))}return A||N(L-1,o)},wallRadius:(o,d)=>{let A=I(o,Pe(d,0,Me));const j=x(o);for(let Z=0;Z<L;Z++){const v=C[Z+1]+p[Z+1][j];v>d-4.5&&v<d+4.5&&(A=Math.max(A,N(Z,o)+.3))}return A},ledgeNear:(o,d)=>{let A=0,j=1e9;for(let Z=0;Z<L-1;Z++){const v=Math.abs(h(Z+1,o)-d);v<j&&(j=v,A=Z)}return{r:N(A,o),y:h(A+1,o)}},shapeR:B}}const Ge=.3,st=.22,xt=(e,t,i,g)=>{const E=Math.cos(t),S=Math.sin(t),b=e.n2(E*9+3,S*9),z=e.n2(E*5-7,S*5+2);return[i,1.9+.7*b+g,i+4.5+1.5*z,1.1+.6*b,i+9.5+2.5*z,.2+.5*z,i+13+2.5*z,-3.5]};async function St(e,t,i,g){const E=[],S=[],b=[],z=[];let H=0;const k=(h,f,c,m,l,F,w)=>(E.push(Math.cos(h)*f,c,Math.sin(h)*f),S.push(m,l,F,w),z.push(H),E.length/3-1),u=(h,f,c,m)=>{b.push(h,f,c,h,c,m)},{nT:U,blocks:B,nB:C,tierY:L,footR:a,topR:r}=e;let p=null;for(let h=0;h<U;h++){const f=[];for(let w=0;w<C;w++){const N=B[w],K=w+1<C?B[w+1]:fe,I=Math.max(18,a(h,(N+K)*.5));let _=N;for(;_<K-1e-5;){let G=t.range(1.25,2.5)/I;_+G>K-.7/I&&(G=K-_),f.push({a:_,b:_+G,jit:t.range(-Ge,Ge)*(t.chance(.2)?.25:1),drop:0,mf:t.range(.3,.7),bulge:t.range(-st,st),h:t()}),_+=G}}await g.yield();const c=E.length/3,m=h===U-1,l=[];for(const w of f){l.length%20===18&&await g.yield();for(let N=0;N<2;N++){const I=N===0?w.a+75e-5:w.b-75e-5,_=a(h,I)+w.jit,G=r(h,I)+w.jit,X=L(h,I),o=L(h+1,I),d=o-Math.min(w.drop,(o-X)*.3),A=d-X,j=$(X,d,w.mf),Z=m?3:G-w.jit-a(h+1,I);H=m||o>9.5&&Z>=.42?$(.85,1.5,Le(.42,2.6,Z)):.12;const v=k(I,_,X,0,A,A,w.h);k(I,$(_,G,w.mf)+w.bulge,j,0,d-j,A,w.h),k(I,G,d,0,0,A,w.h),k(I,G,d,1,0,A,w.h);const D=m?G-2.2:a(h+1,I)-.4;k(I,D,m?o+.35:o+.04,1,Math.max(G-D,.1),A,w.h),l.push(v)}}H=0;const F=l.length;for(let w=0;w<F;w++){const N=l[w],K=l[(w+1)%F];u(N,K,K+1,N+1),u(N+1,K+1,K+2,N+2),u(N+3,K+3,K+4,N+4)}if(h===0&&(p=f),m){const w=[];await g.yield();for(const K of f)for(let I=0;I<2;I++){const _=I===0?K.a+.001:K.b-.001,G=r(h,_)-2.2,X=Me+.35,o=k(_,G*.6,X+1.2+1.3*i.n2(Math.cos(_)*3,Math.sin(_)*3),1,6,4,K.h);k(_,G*.27,X+2.2+1.2*i.n2(Math.cos(_)*2+9,Math.sin(_)*2),1,9,4,K.h),w.push(o)}const N=k(0,0,Me+3.2,1,12,4,.5);for(let K=0;K<F;K++){const I=l[K]+4,_=l[(K+1)%F]+4,G=w[K],X=w[(K+1)%F];u(I,_,X,G),u(G,X,X+1,G+1),b.push(G+1,X+1,N)}}await g.yield()}{const h=[];for(const c of p)for(let m=0;m<2;m++){h.length%30===29&&await g.yield();const l=m===0?c.a+.001:c.b-.001,F=xt(i,l,a(0,l)+c.jit-.4,c.jit),w=k(l,F[0],F[1],2,0,0,c.h);k(l,F[2],F[3],2,4.5,0,c.h),k(l,F[4],F[5],2,9.5,0,c.h),k(l,F[6],F[7],2,13,0,c.h),h.push(w)}const f=h.length;for(let c=0;c<f;c++){const m=h[c],l=h[(c+1)%f];u(m,l,l+1,m+1),u(m+1,l+1,l+2,m+2),u(m+2,l+2,l+3,m+3)}}await g.yield();{const h=(v,D,q)=>{let Y=0,ie=90;for(let se=0;se<14;se++){const ue=(Y+ie)*.5;Math.hypot(v,ue)<e.surfR(Math.atan2(q*ue,v),Math.max(D,0))?Y=ue:ie=ue}return q*(Y+.45)},f=(v,D,q,Y,ie,se)=>(E.push(v,D,q),S.push(3,Y,ie,se),z.push(0),E.length/3-1),c=(v,D)=>Math.max(D[0],Math.min(D[1],v)),m=[-4,1,5,9,12.2,15.6],l=m.length;let F=-1e9,w=1e9;for(const v of[-1,1]){const D=Fe+v*We,q=[];for(const we of m)q.push([h(D,we,-1),h(D,we,1)]),await g.yield();let Y=-1e9,ie=1e9;for(const we of q)Y=Math.max(Y,we[1]),ie=Math.min(ie,we[0]);F=Math.max(F,Y),w=Math.min(w,ie);let se=Y,ue=null,ye=0;for(;se>ie;){const we=t.range(.75,1.2),qe=t(),pe=.15+.8*Math.pow(t(),1.6)+.35*(.5+.5*i.n2(se*.13,v*9)),re=[],Ce=[],me=[];for(let te=0;te<l;te++){const xe=D+v*(pe+(te>0&&te<l-1?t.range(-.1,.1):0));re.push(xe),Ce.push(f(xe,m[te],c(se,q[te]),1,-1,qe)),me.push(f(xe,m[te],c(se-we,q[te]),1,1,qe))}for(let te=0;te+1<l;te++)u(Ce[te],me[te],me[te+1],Ce[te+1]);if(ue){const te=[],xe=[];for(let ne=0;ne<l;ne++){const Ie=c(se,q[ne]);te.push(f(ue[ne],m[ne],Ie,1,0,qe)),xe.push(f(re[ne],m[ne],Ie,1,0,qe))}for(let ne=0;ne+1<l;ne++)u(te[ne],xe[ne],xe[ne+1],te[ne+1])}ue=re,se-=we,++ye%16===0&&await g.yield()}}await g.yield();const N=30,K=ot,I=1.25,_=Math.ceil((F-w)/I)+2,G=F+I,X=_+2,o=v=>{const D=Math.min(Math.abs((v+.5-N/2)*K)/We,1);return Ue+(Ve-Ue)*Math.sqrt(1-D*D)},d=new Float32Array(N*X),A=new Float32Array(N*X),j=[];for(let v=0;v<N;v++){for(let q=-1;q<=_;q++){const Y=t(),ie=t();d[v*X+q+1]=o(v)+.2+1*Y*Y+.7*(.5+.5*i.n2(v*.35+4,q*.3)),A[v*X+q+1]=ie}const D=Pe(Fe+(v+.5-N/2)*K,Fe-We+.2,Fe+We-.2);j.push([h(D,o(v)+.6,-1),h(D,o(v)+.6,1)]),v%3===2&&await g.yield()}const Z=(v,D)=>[Fe+(v-N/2)*K+(D+v&1?-1:1)*.18*K+.06*i.n2(v*7.3+1,D*3.1),G-D*I*.5+.1*i.n2(v*5.1,D*4.7+9)];for(let v=0;v<N;v++){const D=j[v];for(let q=0;q<_;q++){const Y=2*q+(v&1),ie=G-Y*I*.5;if(ie-I>D[1]+.3||ie<D[0]-.3)continue;const se=d[v*X+q+1],ue=A[v*X+q+1],ye=[Z(v,Y),Z(v,Y+1),Z(v,Y+2),Z(v+1,Y+2),Z(v+1,Y+1),Z(v+1,Y)],we=ye.map(re=>f(re[0],se,c(re[1],D),0,0,ue)),qe=f((ye[1][0]+ye[4][0])*.5,se+t.range(-.14,.1),c(ie-I*.5,D),1,0,ue);for(let re=0;re<6;re++)b.push(we[re],we[(re+1)%6],qe);const pe=(re,Ce,me,te)=>{const xe=d[me*X+te+1],ne=se<xe?ue:A[me*X+te+1];u(f(re[0],se,c(re[1],D),1,0,ne),f(Ce[0],se,c(Ce[1],D),1,0,ne),f(Ce[0],xe,c(Ce[1],D),1,0,ne),f(re[0],xe,c(re[1],D),1,0,ne))};pe(ye[2],ye[3],v,q+1),v+1<N&&(pe(ye[3],ye[4],v+1,v&1?q+1:q),pe(ye[4],ye[5],v+1,v&1?q:q-1))}await g.yield()}}await g.yield(),await g.yield();const x=new n.BufferGeometry;return x.setAttribute("position",new n.BufferAttribute(new Float32Array(E),3)),await g.yield(),x.setAttribute("aData",new n.BufferAttribute(new Float32Array(S),4)),x.setAttribute("aFill",new n.BufferAttribute(new Float32Array(z),1)),await g.yield(),x.setIndex(new n.BufferAttribute(new Uint32Array(b),1)),x.boundingSphere=new n.Sphere(new n.Vector3(0,85,0),125),x}const Ze=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uShadeCol;
vec3 gsLight(vec3 alb, vec3 n, float occl) {
  float ndl = max(dot(n, uSunDir), 0.);
  vec3 amb = mix(uShadeCol, uSkyCol, n.y * .5 + .5) * (.55 + .45 * occl);
  amb += uSunCol * .1 * smoothstep(-.7, .4, dot(n, uSunDir));
  return alb * (uSunCol * ndl * occl + amb);
}`,nt=`
float h11(float p) { p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
float h13(vec3 p) { p = fract(p * .1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float vn3(vec3 p) {
  vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(mix(h13(i), h13(i + vec3(1, 0, 0)), f.x), mix(h13(i + vec3(0, 1, 0)), h13(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(h13(i + vec3(0, 0, 1)), h13(i + vec3(1, 0, 1)), f.x), mix(h13(i + vec3(0, 1, 1)), h13(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}`;function Ct(e,t){const i=new n.ShaderMaterial({side:n.DoubleSide,fog:!0,uniforms:n.UniformsUtils.merge([n.UniformsLib.fog,{uRock:{value:t.rock},uGuanoCol:{value:t.guano},uAlgae:{value:t.algae},uGuano:{value:t.guanoAmt},uLichen:{value:t.lichenAmt},uSeed:{value:t.seed},uWindTo:{value:new n.Vector2(t.wind?t.wind.x:.92,t.wind?t.wind.z:-.38).normalize()}}]),vertexShader:`
      attribute vec4 aData; attribute float aFill;
      varying vec3 vP, vV; varying vec4 vD; varying float vFill;
      #include <fog_pars_vertex>
      void main() {
        vD = aData; vP = position; vFill = aFill;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
        vV = mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uRock, uGuanoCol, uAlgae; uniform float uGuano, uLichen, uSeed, uTime; uniform vec2 uWindTo;
      varying vec3 vP, vV; varying vec4 vD; varying float vFill;
      ${Ze}
      ${nt}
      #include <fog_pars_fragment>
      // (order 4) a ruled line cut into cells with UNEVEN borders: every whole number's border stands up to a quarter to either side
      // of it, by its own hash (key picks the family; per closes the ring). Returns the cell's number, the place inside it (0..1)
      // and its width (0.5 to 1.5): neighbours differ, some cells are twice as wide as others.
      vec3 gsCell(float x, float key, float per) {
        float i = floor(x), a = i + .5 * (h11(mod(i, per) * 3.7 + key) - .5), b = i + 1. + .5 * (h11(mod(i + 1., per) * 3.7 + key) - .5);
        if (x < a) { b = a; i -= 1.; a = i + .5 * (h11(mod(i, per) * 3.7 + key) - .5); }
        else if (x >= b) { a = b; i += 1.; b = i + 1. + .5 * (h11(mod(i + 1., per) * 3.7 + key) - .5); }
        return vec3(mod(i, per), (x - a) / (b - a), b - a);
      }
      void main() {
        float kind = vD.x;
        float axr = abs(vP.x - ${Fe.toFixed(1)});
        if (kind < 2.5 && vP.y < ${Ve.toFixed(1)} && axr < ${We.toFixed(1)}) {
          // the opening is cut column by column (the lining's own columns), so its outline is stepped, not a hoop
          float q = min((floor((axr + ${(ot*.25).toFixed(3)}) / ${ot.toFixed(2)}) + .5) * ${(ot/We).toFixed(5)}, 1.);
          if (vP.y < ${Ue.toFixed(1)} + ${(Ve-Ue).toFixed(1)} * sqrt(max(1. - q * q, 0.))) discard;
        }
        vec3 nv = normalize(cross(dFdx(vV), dFdy(vV)) + vec3(0., 0., 1e-9));
        vec3 n = normalize((vec4(nv, 0.) * viewMatrix).xyz), n0 = n;      // (n0: the facet's own normal, before the flutes turn it)
        // three ranges of detail: fine (inside 45 m), mid (cracks, joints, grain: to 260 m), far (streak lengths: to 700 m)
        float dist = length(vV), fine = 1. - smoothstep(10., 36., dist), detail = 1. - smoothstep(70., 260., dist), far = 1. - smoothstep(380., 700., dist);
        float nearK = 1. - smoothstep(22., 90., dist);      // (the band of distance live's own tongues use: all near at 22 m, all far from 90 m)
        vec3 p = vP;
        float fw = max(fwidth(vP.y), max(fwidth(vP.x), fwidth(vP.z)));      // metres to a pixel
        // columnar jointing: 546 flutes round the stack (0.46 m wide at 40 m from the axis), the same on every facet,
        // so streaks and cracks run on across triangles; in the arch the flutes stand along its length. A riser's
        // tier id comes from the height of its lip (height + metres below the lip), which no facet edge breaks.
        float ang = atan(p.z, abs(p.x) < 1e-3 ? 1e-3 : p.x), tier = kind < .5 ? floor((p.y + vD.y) * .731 + .37) : 0.;
        vec3 t3 = kind > 2.5 ? vec3(0., 0., 1.) : vec3(-sin(ang), 0., cos(ang));
        // (order 4) THE COLUMNS ARE STONE, NOT RIBS. The 546 flutes have uneven widths (gsCell: a half to one and a half of the mean,
        // by the flute's own number: the same from every eye), their cross joints lie at uneven heights staggered from column to
        // column, every column is a prism whose flat face is turned its own way and bevelled into its cracks (even round ribs read
        // as sheet metal or planks whatever their colour), and here and there one is broken back under its lip (the riser, below).
        vec3 cc = gsCell(ang * 86.8986 + .25 * sin(p.y * .21 + uSeed), 1.3, 546.);
        float cid = cc.x, cf = cc.y, cw = cc.z;
        float cs = cf * cf * (3. - 2. * cf), c0 = h11(cid * 13.7 + tier * 5.1 + uSeed), c1 = h11(mod(cid + 1., 546.) * 13.7 + tier * 5.1 + uSeed);
        float cellN = c0, cellS = mix(c0, c1, cs), cellF = h11(floor(ang * 14.4831) * 7.3 + tier * 5.1 + uSeed);
        float cellH = mix(.3, mix(cellF, cellS, detail), far);
        float edge = min(cf, 1. - cf) * cw, cols = kind < .5 || kind > 2.5 ? 1. : 0.;      // (edge: in mean flutes, so a crack is as wide beside a narrow column as beside a broad one)
        float crack = (1. - smoothstep(.0, .09, edge)) * detail * step(.01, cols);
        // each column is broken into blocks of its own length by cross joints
        float jy = p.y * (.3 + .45 * h11(cid * 5.3 + 2.9)) + 9. * h11(cid * 3.1 + 1.7);
        vec3 jc = gsCell(jy, cid * 1.37 + 7.1, 4096.);
        float blk = h11(cid * 7.7 + jc.x * 3.3), jd = min(jc.y, 1. - jc.y) * jc.z;      // (jd: how far from the nearest cross joint, in mean blocks)
        float tilt = (h11(cid * 9.1 + 4.3) - .5) * .7 + (cf - .5) * .2 + sign(cf - .5) * smoothstep(.26, .5, abs(cf - .5)) * .45, bkK = kind < .5 ? 1.4 * nearK : fine;
        // (the flutes, their cracks, joints and turned faces above and below are order 4's lines; colM is one flute's
        // width in metres at this radius, for the terms further down that measure from a crack in metres; two of them act out to 260 m)
        float rr = max(length(p.xz), 8.), colM = rr * .011508;
        if (kind > 2.5) {
          // the arch's lining is modelled column by column: its cracks follow the real edges (vD.y, vD.z), its
          // tone and joints the column's own number (vD.w)
          cellN = cellS = cellH = vD.w; edge = min(vD.y, 1. - abs(vD.z));
          float ew = max(.07, fwidth(edge) * 1.5);
          crack = (1. - smoothstep(0., ew, edge)) * (.07 / ew) * detail;
          cf = .5 + .5 * vD.z;
          jy = p.y * (.32 + .4 * vD.w) + 23. * vD.w; blk = fract(h11(floor(jy) * 3.3 + 1.7) + vD.w);
          jd = .5 - abs(fract(jy) - .5); tilt = (cf - .5) * .75;      // (the lining's modelled columns keep live's own joints and turn)
        }
        n = normalize(n + t3 * tilt * detail * cols);
        float joint = (1. - smoothstep(.0075, .035, jd)) * detail * step(.01, cols);
        n = normalize(n + t3 * (blk - .5) * .22 * bkK * cols);      // (each block of a riser's column stands a little its own way through the near band, not only inside 36 m)
        // rock grain: facets, a little relief in the normal, finer close to
        float g1 = vn3(p * vec3(2.3, 0.7, 2.3) + uSeed), g2 = vn3(p * 7. + 3.), g3 = vn3(p * vec3(9., 4., 9.) + 5.);
        n = normalize(n + detail * .22 * (vec3(g1, vn3(p * 2.9 + 11.), g2) - .5) + fine * .3 * (vec3(g3, g2, vn3(p * 11. + 9.)) - .5));
        vec3 alb = uRock * (0.6 + 0.3 * vD.w + 0.3 * g1 + .4 * mix(cellH, cellN, detail)) * (1. - .5 * joint) * (1. - .7 * crack) * mix(1., .86 + .28 * blk, bkK);
        alb = mix(alb, alb * vec3(1.25, 1.02, .85), smoothstep(.55, .8, vn3(p * .21 + uSeed)));
        float y = p.y, occl = 1., spec = 0., wet = 0., gu = 0.; vec3 gcol = vec3(0.);
        float sect = .35 + .65 * smoothstep(.18, .62, vn3(p * vec3(.045, .02, .045) + uSeed * 1.7));
        // nothing nests round the opening: the spray keeps the rock black there, a dark frame for the keyhole
        float archK = 1. - (1. - smoothstep(15.5, 20., axr + 1.5 * (g1 - .5))) * (1. - smoothstep(27., 33., y + 2. * g1));
        if (kind < .5) {
          // riser: black columns. Guano is caked thick and lumpy under the lip (a lobe to each column), thins into
          // ragged runs, and stops: the lower third to half of every riser is dark wet rock, at arm's length as from 300 m
          float d = vD.y, rh = max(vD.z, .5);
          // the finest octaves of the crust's edge fade as they near a pixel in size (they broke it into pixel flakes at 7-12 m)
          float k13 = 1. - smoothstep(.15, .5, fw * 13.), k19 = 1. - smoothstep(.15, .5, fw * 19.);
          vec2 qa = p.xz / rr * 40.;      // along the face only, so streaks run true down a leaning wall
          // (order 4) the whitewash's noises are keyed by the lip's HEIGHT (tq: one cell to 7.7 m), no longer by the tier's number:
          // where a ledge steps up or down at a block's border the number jumped and every noise with it, so the white ended in
          // a straight cut on the corner line; now it runs on across the corner and only the lip steps. kf1: the 0.9 m noises
          // fade to their mean as they near a pixel in size.
          float lipY = p.y + d, tq = lipY * .13, kf1 = 1. - smoothstep(.15, .5, fw * 1.1);
          float n1 = vn3(vec3(qa.x * .6, uSeed + tq, qa.y * .6));
          float n2 = mix(.5, vn3(vec3(qa.x * 3.1, 4.7, qa.y * 3.1)), far);
          float n3 = mix(.5, vn3(vec3(qa.x * 9., p.y * .3, qa.y * 9.)), detail);
          float gT = vn3(vec3(qa.x * .13, uSeed + 11. + tq, qa.y * .13)), zone = smoothstep(.56, .86, gT);      // about a third of sectors carry long curtains
          // THE SEVENTH MEND: DARK COLUMNAR ROCK, STAINED. The whitewash is no coat and no comb. All of it is a law of the stack's own
          // place (bearing, height, tier, the ledge's fullness vFill, the wind's bearing) and of the distance band live's own
          // tongues use (nearK: all near at 22 m, all far from 90 m); of the eye only its distance is read, never its facing; nothing reads the route or the seed's still.
          //  WHERE THE BIRDS ARE THICK (gather): a slow noise of the place (17 m along the face, 20 m of height) with the tier's own,
          //  raised on the windward bearings, under the broad ledges and toward the summit, none under an empty ledge, and fewer
          //  beside and over the arch (within 24 to 40 m of its axis, under 36 to 52 m), where the burst's spray washes the lips.
          // (order 4: where a ledge narrows to nothing across one panel its fullness runs down in a straight ramp, and the pours' lengths
          // with it: the white ended on a straight slant, a triangle. Close to, each column takes the ramp at its own step: order 5, a small
          // one, a third of what it was (a column's own share in the white is small against the stain's), and the ramp is taken by the
          // place's own noises along the lip (1.7 m and 0.3 m): the slant wanders in tongues.)
          float wwB = smoothstep(-.2, .8, -dot(normalize(p.xz + vec2(1e-4, 0.)), uWindTo)), seat = smoothstep(.3, .8, vFill + nearK * (.12 * (c0 - .5) + .3 * (n1 - .5) + .12 * (n2 - .5))), broad = smoothstep(.85, 1.5, vFill);
          float gN = vn3(vec3(qa.x * .06, lipY * .05 + uSeed * 2.3, qa.y * .06));
          // (order 4) FROM AFAR THE FIELDS LIE ACROSS SEVERAL TIERS WITH SOFT BORDERS: the slow noise of the place counts more (0.85 for
          // 0.6), the 7.7 m one less (0.15 for 0.45), the border is wider (0.4 to 0.66), windward and summit count a little more
          float gather = smoothstep(mix(.4, .44, nearK), mix(.66, .6, nearK), mix(.85, .6, nearK) * gN + mix(.15, .45, nearK) * gT + mix(.16, .1, nearK) * wwB + .08 * broad + mix(.25, .2, nearK) * smoothstep(120., 160., lipY)) * seat
            * (1. - .45 * (1. - smoothstep(24., 40., axr + 6. * (gN - .5))) * (1. - smoothstep(36., 52., lipY)));
          //  WHERE A LIP POURS (sw over thr) AND HOW FAR EACH POUR RUNS (L): noises of the place at 3 m, 0.9 m, 0.27 m and 8 cm along
          //  the lip, each tier its own. Close to (order 5) nothing is gated: one stain along a seated lip whose length wanders by
          //  these noises (mend 7 had streaks on stone there, two fifths of a full lip pouring); from afar: see ORDER 4 below
          //  (mend 7's far law, a gathered stretch pouring along nearly all its lip and to the foot, made whole faces white).
          //  (order 4) FROM AFAR THE WHITE IS A STAIN THAT HANGS FROM THE LIPS, NEVER A FACE: stripes, tier over tier. Every seated lip
          //  shows its pale line (the apron below, ungated from afar) and a stain under it: tongues by the 3 m and 0.9 m noises
          //  (much finer than a face's width), 0.28 of the riser where the birds are thin to 0.5 where they are thick plus each
          //  tongue's own length, and never more than 0.58 of the riser: no pour reaches the foot from afar, none lies corner to
          //  corner. (It was: a gathered stretch pours along nearly all its lip and to the foot: whole faces white, the next dark.)
          //  (ORDER 5) CLOSE TO, THE WHITE IS ONE STAIN THAT HANGS FROM THE LIP AND RUNS ACROSS THE COLUMNS' BORDERS. Order 4's near law
          //  gated the lip into pours by the place's noises along the lip alone: a pour's sides stood upright from the lip to the foot, as
          //  wide as a column or a few (white boards beside dark boards, a fence). Now, close to, nothing is gated (Wk is 1 at 22 m): the
          //  stain lies along the whole seated lip and its LENGTH wanders (Ln): a sum of the place's noises at 3 m, 0.9 m, 0.27 m and 8 cm
          //  along the lip, the wide ones carrying most of it (so a long tongue is a wide one and no side is upright for long), drawn
          //  toward long where the birds are thick and toward a short crust where they are thin (gather). The place the tongues are read
          //  at drifts along the lip with height (qw: 0.35 m to either side, over 2 m of height), so a tongue's sides wander as they run
          //  down. The far law (nearK 0, from 90 m) is as it was in every value; between 22 and 90 m the two are mixed.
          //  (The shares .55 / .29 / .11 / .05 and the knee .4 wide were tuned on the bench's whole field at chance places, beside live:
          //  with more on the fine noises and a narrower knee a gap stood as a dark spire one column wide with upright sides, and a
          //  thinly seated lip carried next to no white where live has tongues.)
          float wv = (vn3(vec3(qa.x * .5, p.y * .45, qa.y * .5) + 7.) - .5) * .7 * nearK; vec2 qw = qa + t3.xz * wv;
          float a1 = vn3(vec3(qw.x * .33, uSeed * 1.3 + tq, qw.y * .33)), b1 = mix(.5, vn3(vec3(qw.x * 1.1, 3.1 + tq, qw.y * 1.1)), kf1);
          float b2 = mix(.5, vn3(vec3(qw.x * 3.7, 7.7 + tq, qw.y * 3.7)), far), b3 = mix(.5, vn3(vec3(qw.x * 12., 1.3 + tq, qw.y * 12.)), nearK * k13);
          float sw = mix(.55, .15, nearK) * a1 + mix(.45, .35, nearK) * b1 + mix(0., .35, nearK) * b2 + .15 * nearK * b3;
          float thr = mix(mix(.62, .3, gather), mix(.56, .52, gather), nearK), eW = mix(.1 + .3 * fw, .025, nearK), Wk = mix(smoothstep(thr - eW, thr + eW, sw), 1., nearK);
          float e1 = mix(.5, vn3(vec3(qw.x * .8, 5.3 + tq, qw.y * .8)), kf1), e2 = mix(.5, vn3(vec3(qw.x * 2.9, 9.3 + tq, qw.y * 2.9)), far);
          float L0 = min(rh * (mix(mix(.28, .42, nearK), mix(.5, 1., nearK), gather) + .5 * e1 * e1 * e1 + mix(.1, .25, nearK) * zone + mix(.05, .2, nearK) * (e2 - .5) + .3 * (1. - nearK) * (a1 - .5)) * mix(.75, 1., smoothstep(thr, thr + .12, sw)) * sect * uGuano * mix(.12, mix(.9, 1.2, broad), seat), rh * mix(.58, .88, nearK));
          float Tn = .55 * a1 + .29 * b1 + .11 * b2 + .05 * b3, tlo = mix(.36, .22, gather), Tk = smoothstep(tlo, tlo + .4, Tn);
          float Ln = min(rh * (.1 + .78 * Tk + .2 * (e2 - .5) * Tk) * sect * uGuano * mix(.12, mix(.9, 1.2, broad), seat), rh * .88);
          float L = mix(L0, Ln, nearK);
          float rag = (n3 - .5) * .9 + (vn3(vec3(qa.x * 2.3, 1.9, qa.y * 2.3)) - .5) * .8 * detail + (vn3(vec3(qa.x * 21., p.y * 1.1, qa.y * 21.)) - .5) * .4 * nearK * k19;
          float dd = d + rag * (.2 + .12 * L), v = dd / max(L, .2);
          float sN = vn3(vec3(qa.x * 7., p.y * .7, qa.y * 7.)) * .6 + mix(.5, vn3(vec3(qa.x * 19., p.y * 2.3, qa.y * 19.)), k19) * .4;
          // (a pour's end: from afar a soft-edged tongue; close to it thins into dribbles and flecks, as before)
          // (order 4: from afar a tongue ends over the last quarter of its length, never sharper than a pixel: fwL)
          float fwL = fw / max(L, .2), tailS = 1. - smoothstep(.5 - .25, 1.1, v), cov = Wk * tailS;
          float cake = Wk * mix(1. - smoothstep(mix(.72, .5, nearK) - fwL, 1.05 + fwL, v), smoothstep(-.07, .07, tailS - sN * .9), nearK * .4);
          //  THE APRON: a short crust under a seated lip (0.1 to 1 m, its own depth by the place), none along the bare stretches
          //  (order 4: from afar it lies along EVERY seated lip, a little deeper, its edge no sharper than a pixel: the tier's pale line.
          //  Close to, the lip itself keeps a crust of 0.1 to 0.26 m all along, so the line a tier shows from afar is there at arm's length too)
          float apD = (mix(.25, .1, nearK) + .3 * n3 + .3 * b1) * mix(1., 1.3, broad), apron = (1. - smoothstep(.3 * apD - fw, apD + fw, d + .3 * rag * apD)) * .95 * seat * mix(1., smoothstep(thr - .03 - .05, thr - .03 + .05, sw), nearK);
          apron = max(apron, (1. - smoothstep(.04, .1 + .16 * n3, d)) * .9 * seat);
          //  LIGHT AND SHADE IN THE WHITE: the upper part of a pour is thick crust, its lower part a thin wash (less of it, and grey: below)
          float thinK = smoothstep(.35, .95, v);
          gu = max(cake * mix(1., .62, thinK), apron);
          // spatter on the dark rock below: flecks and dribbles, sparse
          gu = max(gu, smoothstep(.7, .78, vn3(p * vec3(8., 5., 8.) + 3.)) * smoothstep(.45, .7, vn3(p * 1.7 + 31.)) * detail * .4 * (1. - .85 * nearK));      // (from a little way off; at arm's length the flecks were round spots on a plate)
          // (the rock shows at column edges and joints in patches only: ruled lines all over would read as planks)
          float bare = smoothstep(.42, .7, vn3(p * vec3(1.1, .6, 1.1) + 17.));
          // where the crust is thick (the upper part of the curtain) it bridges the cracks between the flutes and fills their
          // hollows: one white band under the lip, breaking into tongues lower down, not a row of planks
          float thick = max(cake * (1. - smoothstep(.35, .8, v)), apron);
          gu *= smoothstep(6.5, 15., y + 3. * n1) * (1. - mix(.55, .55 + .4 * bare, fine) * crack * (1. - .85 * thick) * mix(.15, 1., nearK)) * (1. - .4 * joint * fine * bare * (1. - .85 * thick)) * archK;
          // THE BLACK FOOT: no whitewash reaches the lowest 1.15 m of a riser (a sitting bird's height) and it thins out over
          // the 1 to 1.7 m above that, so the frieze of the ledge below stands cream against black rock at every distance
          // (order 4: close to, the fade above the black foot starts at a height of each column's own, up to 2 m higher: a long pour
          // feathers out in tongues there and does not end on one level line)
          gu *= 1. - smoothstep(rh - (2.1 + .7 * n1) - 2. * nearK * (.6 * e2 + .4 * sN), rh - 1.15, d);
          // (order 4) HERE AND THERE A COLUMN IS BROKEN BACK UNDER ITS LIP (about one in six, 0.3 to 1.3 m down, by its own number): the
          // face in the notch is in the lip's shade and carries little whitewash, its floor is a pale sill: the lip line steps
          // (order 5: in the one stain the notches stood as black squares, missing tiles; the notch's face now keeps three quarters of its
          // whitewash and half of that shade: a step in the white, not a hole)
          float brk = step(.82, h11(cid * 3.3 + tier * 7.9 + 2.1)) * nearK, brD = .3 + h11(cid * 6.1 + tier * 2.3 + 9.);
          float notch = brk * (1. - smoothstep(brD - .04, brD + .04, d)), sill = brk * smoothstep(brD - .04, brD + .02, d) * (1. - smoothstep(brD + .03, brD + .18, d));
          gu = max(gu * (1. - .25 * notch), .85 * sill * seat);
          n = normalize(mix(n, vec3(0., 1., 0.), .55 * sill));
          n = normalize(mix(n, n0, .7 * thick * gu));
          // close to, it is caked and splattered, not painted: rock shows through in pocks and at the column edges
          float spl = vn3(vec3(p.x + p.y * .35, p.y - p.z * .3, p.z + p.x * .4) * 6.5) * .55 + mix(.5, vn3(vec3(p.x + p.z * .6 + p.y * .3, p.y - p.x * .4, p.z - p.x * .7) * 13. + 7.), k13) * .45, drip2 = vn3(vec3(qa.x * 23., p.y * 1.3, qa.y * 23.));      // (sheared, so the noise's grid never lines up with the wall)
          gu *= mix(1., .4 + .6 * smoothstep(.34, .52, spl + .25 * (gu - .5)), fine) * (1. - .6 * fine * bare * (1. - smoothstep(.0, .2, edge)));
          gu *= mix(1., .5 + .5 * smoothstep(.28, .5, vn3(p * vec3(2.6, 1.7, 2.6) + 3.)), fine * .85);      // thin, scuffed patches the size of a bird
          // (no whitewash is run down the joints: the gap between two flutes stays dark, as live draws it)
          // the crust's lumps are in its colour (l0, below); its normal is live's own line, so the flutes' own turn reads through it
          vec3 lp = p * vec3(5., 3.2, 5.) + 1.; float l0 = vn3(lp);
          n = normalize(n + fine * gu * .5 * (vec3(spl, drip2, vn3(p * 31. + 3.)) - .5));
          // (mend 7) THE BARE COLUMNS ARE DARK BASALT, NOT OCHRE BOARDS: close to, the rock between the streaks loses most of its warm
          // cast and half its lightness (live's slate floor and the sky on the cracks' edges stay); each face keeps a tone of its own, less
          // (order 4) THE ROCK IS BLACK AND ITS HUE STANDS APART FROM THE SEA'S. The albedo stays as dark as mend 7 made it; its cast is
          // now the one that turns the low key into a warm dark GREY on the lit faces (the key over a neutral albedo read as rust).
          // The lightness that comes back comes back as LIGHT, on lit faces only (the lighting below); so does the teal's cure.
          alb = mix(alb, dot(alb, vec3(.3333)) * vec3(.8, 1., 1.35), .8 * nearK) * mix(1., .5, nearK);
          // (order 4: the lichen's fine grain fades as it nears a pixel in size, and it stains a little more: it is the design's warmth
          // on the upper tiers, rusty orange and sea-ivory where the white is thin)
          float k43 = 1. - smoothstep(.15, .5, fw * 4.3);
          float lich = smoothstep(.56, .7, vn3(p * .55 + 20.)) * (.35 + .65 * mix(.5, smoothstep(.3, .6, vn3(p * 4.3)), k43)) * smoothstep(98., 128., y + 14. * n1) * uLichen;
          vec3 lc = mix(vec3(.50, .22, .035), vec3(.42, .43, .33), step(.6, vn3(p * .17 + 40.)));
          // (order 5: close to, the stone is half as light as live's and the lichen was not: it stood as bright orange paint beside the
          // one stain. Close to it takes three quarters of its tone and live's own share; from 90 m every value is as it was.)
          alb = mix(alb, lc * mix(.8, .6, nearK), lich * (1. - gu) * (.5 - .2 * nearK + .3 * n3));
          // the foot of the riser is wet and darker; rust weeps from a few joints
          float foot = smoothstep(.25, .7, d / rh);
          // (close to, the columns must read: each face its own tone, lifted out of black; from far off the riser stays black)
          alb *= mix(1., .8, foot) * mix(1., 1.02 + .4 * (c0 - .5), nearK);
          alb = mix(alb, alb * vec3(1.35, .98, .7), smoothstep(.6, .8, vn3(vec3(qa.x * 3.3, p.y * .35 + 5., qa.y * 3.3))) * foot * .28 * detail * (1. - .6 * nearK)
            * mix(1., clamp(1.6 * (1. - smoothstep(0., .14, edge * colM)) + 1.6 * joint, 0., 1.6), nearK));      // close to, the rust keeps to the joints it weeps from
          wet = max(wet, (1. - gu) * (.25 + .4 * foot) * mix(1., .3, smoothstep(8., 30., y)));      // (order 4: the rock is wet black below 8 m; by 30 m up it is three tenths as wet: the sky's sheen on wet ribs, seen along the wall, was half of the teal sheet metal)
          float drip = vn3(vec3(qa.x * 15., p.y * .7, qa.y * 15.)), old = vn3(p * vec3(.9, .5, .9) + 23.);
          // THE WHITEWASH IS WHITE. Its fresh crust has the birds' own cream (the design's albedo 0.78: uGuanoCol x 1.03 at the
          // middle of this bracket); age, stain, thin runs and lumps only grey it a little (they were brown: live's mean
          // was 0.48 0.45 0.37, a tan; now 0.64 0.61 0.52 against the birds' 0.74 0.71 0.64, counted over every riser the
          // climb, the crest and the run-in see)
          gcol = uGuanoCol * (.91 + .1 * n3 + .08 * cellH) * mix(vec3(1.), vec3(.98, .96, .9), n2 * (1. - smoothstep(0., 2.5, d)));
          gcol *= mix(vec3(1.), vec3(.92, .89, .82), smoothstep(.4, .72, old) * (1. - .35 * cake));      // older layers under the fresh: a little greyer and warmer
          gcol *= mix(1., .8, smoothstep(.3, 1., d / max(L, .3)) * n1) * mix(1., (.7 + .5 * drip) * (.76 + .48 * drip2), fine) * (1. - .4 * joint * (1. - .85 * thick)) * (.8 + .36 * l0) * (1. - .3 * (1. - smoothstep(0., .1, edge * colM)) * detail * (1. - .6 * thick) * mix(.15, 1., nearK));      // lumps, and a groove where a crack runs under the crust (thick crust hides the columns' cross joints and all but a trace of the groove: caked guano, not whitewashed masonry)
          gcol *= mix(1., .72, thinK * (1. - apron)) * (1. - .4 * smoothstep(.58, .74, vn3(vec3(qa.x * 6.3, p.y * .11 + 9., qa.y * 6.3))) * (1. - .5 * thick));      // (mend 7) the thin wash is grey, the wet runs (0.16 m wide, metres long) darker; the thick crust stays pale
          // nest stain: a warm smear 0.2-1.1 m below each lip
          gcol = mix(gcol, gcol * vec3(.93, .87, .76), smoothstep(.15, .4, d) * (1. - smoothstep(.7, 1.2, d)) * (.35 + .65 * n3) * .55 * detail);
          gcol = mix(dot(gcol, vec3(.3333)) * vec3(.95, .98, 1.07), gcol, mix(1., smoothstep(.2, .7, gu), nearK));      // (order 4) close to, a thin wash is a grey bloom on the stone, not cream paint thinned
          alb = mix(alb, gcol * .5, .14 * cov * (1. - gu) * nearK);      // a thin grey wash round the dribbles
          alb = mix(alb, gcol, gu);
          occl = mix(.45, 1., smoothstep(0., 1.6, rh - d)) * mix(.8, 1., smoothstep(0., .5, d)) * (1. - .3 * notch);
          // a column that stands proud of its neighbour shades it along the crack, on the side away from the light
          float sT = dot(uSunDir, t3), cN = sT > 0. ? c1 : h11(mod(cid - 1., 546.) * 13.7 + tier * 5.1 + uSeed), eN = (sT > 0. ? 1. - cf : cf) * cw * colM;
          occl *= 1. - .6 * (1. - smoothstep(0., .06 + .5 * max(cN - c0, 0.), eN)) * step(c0, cN) * smoothstep(.05, .3, abs(sT)) * detail * (1. - mix(.9, .5, nearK) * cake);
        } else if (kind < 1.5) { // tread: a whitewashed, trampled floor: nests at pecking distance, each a dark ring of weed round a pale saucer, mud between
          float sp = mix(.5, vn3(p * 5.), detail), up0 = n.y;
          float mot = vn3(p * vec3(1.3, .5, 1.3) + 9.);
          gu = clamp(.55 + .45 * sect + .2 * uGuano - .25 * smoothstep(.6, .8, sp), 0., 1.) * smoothstep(8., 14., y) * smoothstep(-.2, .3, up0) * archK;      // the lowest ledges are in the splash: wet black rock, no whitewash (one of them read as a pale slab by the south-west pier)
          // (mend 7) THE FLOOR IS TRAMPLED MUD AND WET ROCK WITH THE WHITEWASH IN SPLASHES (it was white all over, and a white bird was lost
          // on it): by the summit's own trampling noise, a little more of it under the broad ledges; the summit floor as it was
          float topK = smoothstep(168., 170.5, y) * step(.5, up0), kfS = 1. - smoothstep(.1, .28, fw);
          // (order 4) NOTHING THINNER THAN A PIXEL: a ledge seen so flat that its whole width (0.42 to 2.6 m, read back from vFill) is less
          // than a pixel and a half loses its whitewash in proportion; such white slivers were the far stack's hair-thin line shimmer
          gu *= mix(clamp((.42 + 3.35 * clamp(vFill - .85, 0., .65)) / (1.5 * max(fwidth(vD.y), 1e-4)), 0., 1.), 1., topK);
          float tr0 = vn3(p * vec3(.33, .2, .33) + 4.) * .5 + vn3(p * vec3(1.1, .4, 1.1) + 17.) * .3 + mix(.5, vn3(p * vec3(3.7, .5, 3.7) + 29.), kfS) * .2, tramp = smoothstep(.25, .75, tr0);
          gu *= mix(.3, 1., smoothstep(.45, .6, tr0 + .06 * smoothstep(.85, 1.5, vFill)) * (1. - topK) + topK);
          gcol = uGuanoCol * (.8 + .12 * sp + .14 * mot) * mix(vec3(.96, .94, .88), vec3(1.), mot) * mix(1., .78 + .4 * g3, fine);      // (the white tread: a tone under the risers' fresh crust)
          // close to, a tread is the ends of the columns under it: a pavement of six-sided heads half a metre across,
          // each its own tone and tilt, the whitewash worn through along the joints and off the proud heads
          vec2 hq = p.xz * 2.05 + .25 * vec2(vn3(p * .7 + 3.), vn3(p * .7 + 19.)), hs = vec2(1., 1.7320508), ha = mod(hq, hs) - .5 * hs, hb = mod(hq - .5 * hs, hs) - .5 * hs, hg = dot(ha, ha) < dot(hb, hb) ? ha : hb;
          float hd = .5 - max(abs(hg.x), dot(abs(hg), vec2(.5, .8660254))), hh = h13(vec3(floor((hq - hg) * 2. + .5), 9.)), hK = (1. - smoothstep(.05, .2, fw)) * step(.5, up0);
          float hj = (1. - smoothstep(.0, .035 + 2. * fw, hd)) * hK;
          alb *= mix(1., .78 + .44 * hh, hK) * (1. - .6 * hj);
          gu *= 1. - hK * (.5 * hj + .3 * smoothstep(.62, .8, hh) * smoothstep(.35, .6, sp));
          // the rows wander, a quarter of the places are bare, every nest has its own size and a ring broken by trampling
          vec2 nq = p.xz / .82 + vec2(.3 * sin(p.z * 1.3 + uSeed) + .13 * sin(p.x * 2.9 + p.z * 1.7), .3 * sin(p.x * 1.1 - uSeed) + .13 * sin(p.z * 3.1 - p.x * 1.3)), ni = floor(nq), nf = fract(nq) - .5;
          float nh = h13(vec3(ni, 7.)), nsz = .72 + .5 * h13(vec3(ni, 11.)), nr = length(nf - (vec2(nh, h13(vec3(ni, 3.))) - .5) * .5) / nsz;
          float nestK = (1. - smoothstep(22., 60., dist)) * step(.26, nh) * step(.5, up0);
          float ring = smoothstep(.11, .16, nr) * (1. - smoothstep(.2, .27, nr)) * smoothstep(.28, .55, vn3(p * 6.5 + 3.) + .3 * nh);
          // (the summit floor keeps this to 45 m and is a tone darker than the ledges' whitewash further off, so the birds on it stand above it)
          // (the summit floor carries no drawn nests: from the crest a floor of rings read as a stamped pattern. Its birds
          // bring their own; the floor is trampled guano, darker than the ledges' whitewash and mud-dark in irregular
          // patches of every size, so the cream bodies stand two tones above it)
          nestK *= 1. - topK;
          gcol = mix(gcol, gcol * vec3(.56, .52, .42), nestK * smoothstep(.3, .5, nr * nsz + .2 * (sp - .5)) * (.45 + .5 * mot));      // trampled, damp ground between the nests
          gcol *= mix(vec3(1.), mix(.66, .9, tramp) * vec3(1., .97, .9), topK);
          // each bird on the summit stands in rows 0.82 m apart: a short shadow lies down-sun of every place
          vec2 gq = (p.xz + 34.) / .82, gi = floor(gq + .5), gf = (gq - gi) * .82, dn = -normalize(uSunDir.xz + vec2(1e-4, 0.));
          float al = clamp(dot(gf, dn) - .06, 0., .5), smear = (1. - smoothstep(.07, .19, length(gf - dn * (al + .06)))) * (1. - .55 * al / .5);
          gcol *= 1. - .55 * smear * topK * kfS * step(h13(vec3(gi, 5.)), .9) * smoothstep(2.4, 3.2, vD.y);      // (no bird stands on the outer 2.7 m of the floor)
          gcol = mix(gcol, vec3(.15, .125, .07) * (.7 + .6 * sp), nestK * ring * .62);                               // the ring of weed
          gcol *= 1. + nestK * .2 * (1. - smoothstep(.02, .13, nr));                                                   // the pale saucer
          alb = mix(alb, gcol, gu);
          occl = mix(.6, 1., smoothstep(-.3, .2, up0)) * (1. - .22 * nestK * ring);
          // the floor's own facets are smoothed away (they showed as a slab's edges from the crest); its relief is the nests' and the grain's
          n = normalize(mix(n, vec3(0., 1., 0.), .75 * step(.5, up0)) + (vec3(g1, .5, g2) - .5) * .28 * step(.5, up0) + vec3(nf.x, 0., nf.y) * ring * nestK * 1.6
            + vec3(hh - .5, 0., fract(hh * 7.3) - .5) * .3 * hK + vec3(hg.x, 0., hg.y) * hj * .9);
        } else if (kind < 2.5) { // skirt: tar-black shelf under heaving kelp, water sheeting off it, foam
          n = normalize(mix(n, vec3(0., 1., 0.), .72) + .35 * (vec3(g1, .5, g2) - .5));
          float k = smoothstep(.45, .7, vn3(p * vec3(.9, .3, .9) + 5.));
          alb = mix(uRock * .45, vec3(.075, .06, .02), k);
          float heave = .7 * sin(uTime * .74 + p.x * .21 + p.z * .17);
          float kelp = smoothstep(.5, .68, vn3(vec3(p.x * .7 + heave, 7., p.z * .7 - heave))) * smoothstep(.35, .6, vn3(vec3(p.x * 4.5 + heave * 2., 2., p.z * 1.4)));
          alb = mix(alb, vec3(.105, .075, .02) * (.6 + .9 * g2), kelp * .85);
          float wash = .5 + .5 * sin(uTime * .74 - vD.y * .45 + 6.28 * vn3(p * .06));
          // white water: lace (thin walls where slow noises cross a level, never a sheet) in the runnels, and
          // streams pouring off the outer lip as each wave drains
          float l1 = vn3(vec3(p.x * .5 + uTime * .5, uTime * .25, p.z * .5)), l2 = vn3(vec3(p.xz * 1.9, uTime * .9).xzy), l3 = vn3(vec3(p.xz * 5.3, uTime * 1.4).xzy);
          // (the two noises sum close to their mean nearly everywhere, so the walls are cut narrow: a wide band was a sheet, and the shelf read as pale concrete)
          float lace = (1. - smoothstep(.004, .016 + .028 * wash, abs(l1 * .6 + l2 * .4 - .5))) * (.4 + .6 * l3);
          lace = max(lace, (1. - smoothstep(.003, .02, abs(l2 * .55 + l3 * .45 - .52))) * .55 * (.3 + .7 * wash));
          float pour = smoothstep(8., 11., vD.y) * smoothstep(.6, .8, vn3(vec3(ang * 46., vD.y * .4 - uTime * 1.2, 2.)) * .75 + .25 * l3) * (.5 + .5 * wash);
          // (the lace is faint and soft; the white water is the apron: a ragged fringe along the outer lip that swells and drains with each wave)
          float apron = smoothstep(6.5 - 3. * wash, 11.5, vD.y + 3. * (l1 - .5)) * smoothstep(.3, .62, l2 * .6 + l3 * .4 + .25 * wash) * (.45 + .55 * wash);
          float foam = clamp(max(max(lace * (.1 + .25 * wash), pour * .85), apron * .8), 0., 1.);
          alb = mix(alb, vec3(.56, .64, .62) * (.72 + .4 * l3), foam * .9);
          wet = (1. - foam) * .55;
        } else { // the arch's lining: the stack's own black rock, wet, slimed green to the tide line
          float tide = 1. - smoothstep(3., 10.5, y + 2.5 * g1);
          alb = mix(alb * 1.3, mix(alb * .7, uAlgae * .36, smoothstep(.3, .8, g2)), tide * .75);
          wet = 1.;
        }
        float low = 1. - smoothstep(5., 10.5, y + 2.5 * g1);
        if (kind < 1.5) { alb = mix(alb, mix(alb * .5, uAlgae * .22, smoothstep(.3, .9, g1) * .6), low); wet = max(wet, low); }
        // the waterline: over the weed a band of barnacles (4 to 10 m: the swell's reach): a grey-buff crust that
        // thickens and thins down each column face and is rough close to; the rock stays dark under it
        if (kind < 1.5 || kind > 2.5) {
          float by = y + 2. * g1, bn = vn3(p * vec3(2.6, .5, 2.6) + 13.) * .6 + vn3(p * vec3(11., 6., 11.) + 5.) * .4;
          float barn = smoothstep(3.5, 5.5, by) * (1. - smoothstep(7.5, 10.5, by)) * smoothstep(.34, .7, bn);
          alb = mix(alb, vec3(.19, .185, .15) * mix(1., .6 + .8 * vn3(p * 23. + 5.), fine), barn * mix(.22, .42, fine) * (1. - gu));
        }
        vec3 vdir = normalize((vec4(-normalize(vV), 0.) * viewMatrix).xyz);
        vec3 hv = normalize(uSunDir + vdir);
        float ndv = max(dot(n, vdir), 0.), fres = pow(max(1. - ndv, 0.), 3.), sunL = dot(uSunCol, vec3(.3333));
        vec3 seaCol = vec3(.07, .3, .24) * sunL;                 // light thrown up by the green water
        vec3 col;
        if (kind > 2.5) {
          // inside the arch: slate light from the south mouth, brass from the north one, green from the surge below,
          // and the wet rock mirroring whichever of them it faces; never black
          float open = smoothstep(6., 34., abs(p.z)), north = 1. - smoothstep(-30., 14., p.z);
          float cau = vn3(vec3(p.x * .45, p.y * .45 - uTime * .7, p.z * .45 + uTime * .35));
          vec3 Lm = normalize(vec3(${Fe.toFixed(1)}, 9., -78.) - p), r = reflect(-vdir, n);
          float hm = max(dot(n, normalize(Lm + vdir)), 0.);
          vec3 amb = mix(uShadeCol, uSkyCol, n.y * .5 + .5) * (.4 + .6 * open) + uSkyCol * .7 * max(n.z, 0.) * (1. - .6 * north);
          amb += uSunCol * (1.1 * max(dot(n, Lm), 0.) * (.35 + .65 * north) + .03);
          amb += seaCol * 4.4 * (.16 + .84 * exp(-max(y, 0.) / 9.)) * (.65 - .35 * n.y) * (.5 + 1. * cau);
          vec3 env = uSunCol * 1.1 * smoothstep(.2, .9, -r.z) * smoothstep(-.4, .1, r.y) + uSkyCol * .6 * smoothstep(.2, .9, r.z) * smoothstep(-.4, .1, r.y)
            + seaCol * 1.6 * smoothstep(0., .6, -r.y) * (.6 + .8 * cau);
          // water runs down the columns in threads: only those glint
          float streak = smoothstep(.62, .8, vn3(vec3(p.x * 4.5, p.y * .35 + uTime * .5, p.z * 4.5)));
          col = alb * amb * (1. - .35 * crack) + env * (.02 + .26 * fres) * (.55 + .45 * streak)
            + uSunCol * (pow(hm, 90.) * .35 * streak + pow(hm, 12.) * .07 * north);
        } else {
          // wet rock glints only where water runs down it in threads: a broad sheen would turn every lit column face into a pale board
          float ndh = max(dot(n, hv), 0.), thr = smoothstep(.55, .8, vn3(vec3(p.x * 4.5, p.y * .35 + 3., p.z * 4.5)));
          spec = kind > 1.5 ? wet * pow(ndh, 90.) * .8 * (.25 + .75 * thr) : wet * pow(ndh, 120.) * (.12 + 1.1 * thr) + (1. - gu) * mix(.03, .006, nearK * step(kind, .5)) * pow(ndh, 10.);      // (order 4: close to, the risers' broad lobe in the key's colour is a fifth: on dark ribs it was the rust of the sheet metal)      // the shelf glints in threads too: a broad lobe under the low sun made it a pale slab
          col = gsLight(alb, n, occl) + uSunCol * spec * occl + uSkyCol * wet * (.03 + .32 * fres * (kind > 1.5 ? .55 : 1.));
          // the low key wraps round guano, so the flank beside the light is a bright edge; the sea lights the foot
          float sd = dot(n, uSunDir), wrap = max((sd + .7) / 1.7, 0.) - max(sd, 0.);
          float farK = smoothstep(60., 170., dist);      // from far off the lit flank must read as one bright edge of the tower
          vec2 sxz = normalize(uSunDir.xz + vec2(1e-4, 0.)), pxz = normalize(p.xz + vec2(1e-4, 0.));
          float flank = smoothstep(-.6, .4, dot(pxz, sxz));      // the side of the tower toward the light
          // and the rock whose own bearing from the axis lies within about 50 degrees of the light's blazes whatever the
          // seed has put there (a recess or a terrace takes little of the flank term): the sun's rule, the same from
          // anywhere (the far-range factor is the same one every other far term here carries)
          float rim = smoothstep(.62, .97, dot(pxz, sxz)) * smoothstep(115., 215., dist) * step(kind, 1.5);
          col += gcol * gu * uSunCol * (wrap * mix(mix(.8, .3, step(kind, .5)), 1.25, farK) + farK * (.3 * smoothstep(-.8, -.1, sd) * (1. - max(sd, 0.)) + mix(1.6, 2.1, smoothstep(170., 260., dist)) * flank * (1. - .6 * max(sd, 0.))) + 1.7 * rim) * mix(occl, 1., .5 * rim);      // (the far terms are live's times 0.74, the flank's 0.69: the whitewash's old mean albedo over its new is 0.75 and the windward curtains are longer, so no more of the lit flank's white stands at 250 and over than did in live: 0.8 and 1.2% of it on two seeds, as before)
          col += (alb * 1.6 + uGuanoCol * .2) * uSunCol * (flank * farK + 1.5 * rim) * (1. - gu) * (1. - low) * step(kind, 1.5);      // and the spray-lit rock of that flank (order 4's lift, 1.6 and .2: the bare rock of the lit flank stays dark between the white curtains, so the stripes hold from the run-in), above the wet foot (low): for about 4 m up from the waterline, thinning out by about 9 m, the rock keeps its own dark tone
          // close to, a face turned from the light is slate with form (sky off the sea and the spray), never black
          float nearR = (1. - smoothstep(30., 75., dist)) * step(kind, .5), shadeK = (1. - smoothstep(-.05, .3, sd)) * nearR;
          float fillN = max(dot(n, normalize(vec3(-uSunDir.x, .3, -uSunDir.z))), 0.);
          // (order 4) THE TEAL WAS THIS SLATE: the sky's own cyan (0.30 0.38 0.42 in the golden hour) comes off the grade as the sea's green
          // (38 55 51 of 255 on the floor below). The floor's light is now two thirds of the way to neutral with a cool cast: slate, not sea.
          vec3 sl0 = uSkyCol * .6 + uShadeCol * .4, slate = mix(vec3(dot(sl0, vec3(.3333))), sl0, .35) * vec3(.95, .97, 1.1);
          col += slate * (.1 + .1 * fillN) * shadeK * (1. - .5 * gu) * (.85 + .3 * c0) * (1. - .7 * crack) * max(occl, .5);
          // and nothing beside the climb is black but the cracks: the foot of a riser and a column in its neighbour's shade keep
          // a slate floor with the column's own tone in it (a crack is as dark against its rib as live's albedo makes it:
          // 0.3 of it), and the edge beside each crack catches the sky
          float dk = 1. - smoothstep(.015, .07, dot(col, vec3(.3333)));
          // a tread seen from below (the soffit under an overhanging tier) is rock in shade too: the same slate floor, from any distance
          float under = step(.5, kind) * step(kind, 1.5) * smoothstep(.1, .5, -n.y);
          // (in the golden hour the grade's toe turns anything under 0.04 linear to pure black, so the floor sits at 0.046 to 0.09: 18 to 80 of 255 on screen; only the cracks go under. By night the toe and the mood's colours are lower and the floor was not measured there)
          // (order 4) the floor now has the STONE in it: each column its own tone (proud ones lighter), each block its own, the cross
          // joints dark, the prism faces turned to or from the sky's fill; and from afar every riser keeps a floor of 0.16 (the far
          // rock between the stains is dark slate, not pure black). kc: the columns' tones fade as a column nears a pixel in
          // width; lw: a crack or a joint thinner than a pixel loses its darkness in proportion (no hair lines from afar).
          float kc = 1. - smoothstep(.25, .6, fw / colM), lw = clamp(.06 / max(fw, 1e-4), 0., 1.);
          col = max(col, slate * (max(max(nearR, under) * .23, .16 * step(kind, .5)) * mix(1., (.775 + .45 * c0) * mix(1., .88 + .24 * blk, nearK) * (.8 + .8 * fillN) * (.93 + .14 * g1), kc) * (1. - .7 * crack * lw) * (1. - .5 * joint * lw)));
          // (order 4) HALF OF MEND 7'S DARKENING BACK ON THE LIT FACES, AS LIGHT: the key again over the slate floor, on the bare rock of the
          // risers close by (the floor alone made a sunlit column as dark as a shaded one); warm dark grey, the cracks black
          col += alb * uSunCol * (max(sd, 0.) * occl * .8 * nearK * step(kind, .5) * (1. - gu));
          col += slate * (.12 * smoothstep(0., .035, edge * colM) * (1. - smoothstep(.06, .2, edge * colM)) * nearR * detail * dk * (1. - gu));
          col += alb * seaCol * .9 * exp(-max(y, 0.) / 9.) * (.65 - .35 * n.y);
          // (order 4) NO BLOWN WHITE CLOSE BY: the risers' whitewash is bent over at 0.78 of a white lit by half the key and six tenths of
          // the sky (what is over keeps 0.15 of its excess), and its wrap of the key close by is 0.3 (was 0.8: the birds' own is
          // 0.17); so its lit value stays under the seated birds' own white and they stand out against it
          float gl = dot(col, vec3(.3333)), gk = .78 * dot(uGuanoCol * (uSunCol * .5 + uSkyCol * .6), vec3(.3333));
          col *= mix(1., min(1., (gk + .15 * max(gl - gk, 0.)) / max(gl, 1e-4)), gu * (1. - farK) * step(kind, .5));
        }
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`});return Object.assign(i.uniforms,e),i}const Ye=-.75*Math.PI,Je=-1.46*Math.PI,Tt=30,Rt=170,ft=e=>$(Tt,Rt,(e-.08*e*e*e)/.92),Qe=(e,t)=>{const i=dt(Ye-e)/(Ye-Je);if(i>1.12&&i<fe/(Ye-Je)-.1)return 900;const g=i>1.12?i-fe/(Ye-Je):i;return Math.abs(t-ft(Pe(g,0,1))+1)};async function Et(e,t,i,g){const{nT:E,tierY:S,footR:b,topR:z,blockOf:H}=e,k=[],u=[],U=(a,r)=>{const p=z(E-1,a)-2.2,x=Pe(r/Math.max(p,1),0,1),h=Math.cos(a),f=Math.sin(a),c=Me+.35,m=c+1.2+1.3*i.n2(h*3,f*3),l=c+2.2+1.2*i.n2(h*2+9,f*2),F=Me+3.2;return x>.6?$(m,c,(x-.6)/.4):x>.27?$(l,m,(x-.27)/.33):$(F,l,x/.27)},B=(a,r)=>Qe(a,r)+t();for(let a=0;a<E-1;a++){let r=t.range(0,.02),p=0;for(;r<fe;){++p%24===0&&await g.yield();const x=z(a,r),h=S(a+1,r),f=Qe(r,h)<24,c=(f?.66:.8)/x,m=H(r);if(h>9.5&&H(r-.55/x)===m&&H(r+.55/x)===m){const l=f?.54:.68,F=x-b(a+1,r),w=F<.42?0:Pe(Math.floor((F-.2)/l),1,6),N=i.n2(r*7+a*3.3,a*1.7);for(let K=0;K<w;K++){const I=t(),_=t(),G=t(),X=f?G>.985:N<-.6||G>.94;if(X&&f)continue;const o=r+(I-.5)*.3*c+K%2*.5*c,d=z(a,o)-Math.min(.36,F*.5)-K*l-_*.08,A=Math.cos(o)*d,j=Math.sin(o)*d;if(!(h<Ve+1.5&&Math.abs(A-Fe)<yt(h-1.5)+1.2)){if(X){u.push({x:A,y:h+.04,z:j,sc:Qe(o,h)+.5+K*1.5});continue}k.push({x:A,y:h+.04,z:j,sc:B(o,h)+K*1.5})}}}r+=c}await g.yield()}for(let a=-34;a<=34;a+=.82){Math.round(a/.82)%3===0&&await g.yield();for(let r=-34;r<=34;r+=.82){const p=t(),x=t(),h=t(),f=a+(p-.5)*.4,c=r+(x-.5)*.4,m=Math.hypot(f,c),l=Math.atan2(c,f);if(!(m>z(E-1,l)-2.7)){if(h>.9||i.n2(f*.13+50,c*.13)<-.62){u.push({x:f,y:U(l,m)+.03,z:c,sc:990});continue}k.push({x:f,y:U(l,m)+.03,z:c,sc:60+h*30})}}}await g.yield();let C=[];for(let a=0;a<k.length;a+=1500)C.push(k.slice(a,a+1500).sort((r,p)=>r.sc-p.sc)),await g.yield();for(;C.length>1;){const a=[];for(let r=0;r<C.length;r+=2){if(r+1>=C.length){a.push(C[r]);break}const p=C[r],x=C[r+1],h=new Array(p.length+x.length);let f=0,c=0,m=0;for(;f<p.length&&c<x.length;)h[m++]=x[c].sc<p[f].sc?x[c++]:p[f++];for(;f<p.length;)h[m++]=p[f++];for(;c<x.length;)h[m++]=x[c++];a.push(h),await g.yield()}C=a}const L=C[0]||[];return L.gaps=u,L}function it(e){const t=new n.Color(e[4]).multiplyScalar(.86),i=new n.Color(e[5]);return i.setRGB(i.r*.98,i.g*.8,i.b*.5),{cream:t,saff:i,black:new n.Color(.018,.018,.022),bill:new n.Color(.36,.45,.52),nest:new n.Color("#4A4630")}}function mt(e,t,i,g,E){const S=new n.BufferGeometry;return S.setAttribute("position",new n.BufferAttribute(new Float32Array(e),3)),S.setAttribute("color",new n.BufferAttribute(new Float32Array(t),3)),S.setAttribute("aAnim",new n.BufferAttribute(new Float32Array(i),3)),S.setAttribute("aOpen",new n.BufferAttribute(new Float32Array(g),3)),S.setIndex(E),S.computeVertexNormals(),S}function Ft(e){const t=it(e),i=[],g=[],E=[],S=[],b=[],z=(a,r,p,x,h,f=0,c=0,m=null)=>(i.push(a,r,p),g.push(x.r,x.g,x.b),E.push(h,f,c),m?S.push(m[0],m[1],m[2]):S.push(a,r,p),i.length/3-1),H=[[-.27,.115,.082,.065,t.black,t.cream,0],[-.07,.215,.142,.165,t.cream,t.cream,0],[.09,.385,.122,.135,t.cream,t.cream,0],[.148,.575,.06,.066,t.cream.clone().lerp(t.saff,.85),t.cream.clone().lerp(t.saff,.3),.35],[.19,.705,.052,.058,t.saff,t.saff.clone().lerp(t.cream,.15),1]],k=z(0,.04,-.46,t.black,0),u=[];for(let a=0;a<H.length;a++){const[r,p,x,h,f,c,m]=H[a],l=H[Math.max(a-1,0)],F=H[Math.min(a+1,H.length-1)];let w=F[0]-l[0],N=F[1]-l[1];const K=Math.hypot(w,N);w/=K,N/=K;const I=[];for(let _=0;_<5;_++){const G=Math.PI/2+_/5*fe,X=Math.cos(G),o=Math.sin(G);I.push(z(X*x,p+o*h*w,r-o*h*N,o>.2?f:c,m))}u.push(I)}const U=z(0,.672,.345,t.bill,1,0,1);for(let a=0;a<5;a++){const r=(a+1)%5;b.push(k,u[0][r],u[0][a]);for(let p=0;p+1<u.length;p++)b.push(u[p][a],u[p][r],u[p+1][r],u[p][a],u[p+1][r],u[p+1][a]);b.push(u[4][a],u[4][r],U)}for(const a of[-1,1]){const r=z(a*.13,.43,.1,t.cream,0),p=z(a*.146,.3,-.02,t.cream,0),x=z(a*.125,.21,-.2,t.cream,0,a*.55,0,[a*.5,.5,.03]),h=z(a*.045,.12,-.48,t.black,0,a,0,[a*.93,.46,-.07]);b.push(r,p,x,p,h,x)}t.nest.lerp(t.cream,.3);const B=z(0,.08,-.04,t.nest,-1),C=i.length/3;for(let a=0;a<4;a++){const r=a/4*fe+.6;z(Math.cos(r)*.25,-.02,Math.sin(r)*.25-.04,t.nest.clone().multiplyScalar(.7+.3*(a%2)),-1)}for(let a=0;a<4;a++)b.push(B,C+(a+1)%4,C+a);const L=new n.Color("#4A4630").multiplyScalar(1.5);for(const a of[-1,1]){const r=z(a*.14,.03,-.17,t.nest,-1),p=z(a*.21,.03,-.1,t.nest,-1),x=z(a*(.27+.05*a),.07,-.56-.08*a,L,-2);b.push(r,p,x)}return mt(i,g,E,S,b)}function qt(e){const t=e?new n.Color(.2,.14,.1):new n.Color(.6,.61,.6),i=t.clone().multiplyScalar(e?.7:.74),g=e?new n.Color(.26,.19,.14):new n.Color(.7,.7,.68),E=new n.Color(.05,.05,.06),S=[],b=[],z=[],H=[],k=[],u=(p,x,h,f,c,m=0)=>(S.push(p,x,h),b.push(f.r,f.g,f.b),z.push(c,0,m),H.push(p,x,h),S.length/3-1),U=[u(.1,.02,.11,i,0),u(-.1,.02,.11,i,0),u(-.11,.02,-.1,i,0),u(.11,.02,-.1,i,0)],B=u(0,.22,-.03,t,0);for(let p=0;p<4;p++)k.push(U[p],B,U[(p+1)%4]);const C=u(-.05,.25,.1,E,1),L=u(.05,.25,.1,E,1),a=u(0,.33,.07,g,1),r=u(0,.245,.2,E,1,1);return k.push(B,C,a,B,a,L,C,L,a,C,r,L,U[1],C,B,U[0],B,L,U[1],U[0],L,U[1],L,C),mt(S,b,z,H,k)}function Kt(e){const t=it(e),i=[],g=[],E=[],S=[],b=[],z=(x,h,f,c,m,l=0)=>(i.push(x,h,f),g.push(c.r,c.g,c.b),E.push(m,0,l),S.push(x,h,f),i.length/3-1),H=z(0,.05,-.46,t.black,0),k=z(0,.4,-.06,t.cream,0),u=z(-.17,.09,-.02,t.cream.clone().multiplyScalar(.8),0),U=z(.17,.09,-.02,t.cream.clone().multiplyScalar(.8),0),B=z(0,.1,.2,t.cream,0);b.push(H,u,k,H,k,U,k,u,B,k,B,U);const C=z(-.07,.3,.1,t.cream,0),L=z(.07,.3,.1,t.cream,0),a=z(0,.7,.19,t.saff,.7);b.push(k,C,a,C,L,a,L,k,a);const r=[z(0,.775,.17,t.saff,1),z(.062,.66,.2,t.saff,1),z(-.062,.66,.2,t.saff,1)],p=z(0,.675,.36,t.bill,1,1);return b.push(r[0],r[1],p,r[1],r[2],p,r[2],r[0],p,r[0],r[2],r[1]),mt(i,g,E,S,b)}const kt=`
float gsBehave(float s, float t, out vec4 b) {
  float ph = t / (2.4 + 1.8 * h11(s * 7.13)) + s * 37.;
  float k = floor(ph), f = fract(ph), beh = h11(s * 91.7 + k * 1.37);
  float e = smoothstep(0., .22, f) * (1. - smoothstep(.72, 1., f)), lean = 0.;
  b = vec4(.06 * sin(t * 1.3 + s * 50.), .45 * sin(t * .8 + s * 40.) * sin(t * .31 + s * 9.), 0., 0.);
  if (beh < .26) { }
  else if (beh < .47) { b.x += 1.05 * e; lean = .28 * e; }
  else if (beh < .63) { b.x += .6 * e * (.5 + .5 * sin(f * 44.)); lean = .1 * e; }
  else if (beh < .76) { b.y += .6 * e * sin(f * 52.); b.x -= .35 * e; }
  else if (beh < .88) { b.x -= 1.15 * e; b.z = .14 * e; }
  else { b.w = e; b.z = .05 * e; }
  return lean;
}`;function Bt(e){const t=new n.ShaderMaterial({side:n.DoubleSide,fog:!0,uniforms:n.UniformsUtils.merge([n.UniformsLib.fog,{}]),vertexShader:`
      attribute vec3 aAnim, aOpen, iPos; attribute vec4 iRot;
      uniform float uTime;
      varying vec3 vCol, vN; varying float vBill, vAo, vWrap;
      ${nt}
      ${kt}
      #include <fog_pars_vertex>
      void main() {
        // iRot.y = seed, + 2 or + 4 for the two birds of a fencing pair (which share one seed)
        float fz = floor(iRot.y * .5 + .01), s = iRot.y - 2. * fz; vec4 b; float lean = gsBehave(s, uTime, b);
        if (fz > .5) {      // a pair fencing bills: necks up, bills crossing and clattering side to side, in bouts
          float on = smoothstep(-.25, .15, sin(uTime * .5 + s * 40.)), sg = fz > 1.5 ? -1. : 1.;
          b = mix(b, vec4(-.5 + .14 * sin(uTime * 7. + s * 9.), sg * .42 * sin(uTime * 10.5 + s * 20.), .13, 0.), on); lean = mix(lean, .17, on);
        }
        vec3 p = position, n = normal;
        // the nest's weed tails whip in the wind (aAnim.x = -2 at their tips)
        p += step(aAnim.x, -1.5) * vec3(.1 * sin(uTime * 9. + s * 40.) + .05 * sin(uTime * 17. + s * 13.), .03 + .07 * sin(uTime * 13. + s * 21.), .04 * sin(uTime * 11. + s * 5.));
        vAo = mix(.35, 1., smoothstep(.05, .45, position.y)) * mix(.75, 1., smoothstep(-.6, .3, normal.y));
        float isBird = step(-.5, aAnim.x), hw = max(aAnim.x, 0.), w = abs(aAnim.y);
        float fl = fract(uTime / (2.4 + 1.8 * h11(s * 7.13)) + s * 37.);
        p = mix(p, aOpen + vec3(0., .16 * sin(fl * 75.) * w, .05 * sin(fl * 75. + 1.) * w), b.w * step(.01, w));
        vec3 piv = vec3(0., .55, .13), q = p - piv;
        q.y *= 1. + b.z * hw * 2.;
        float a = b.x * hw, ca = cos(a), sa = sin(a);
        q.yz = vec2(q.y * ca - q.z * sa, q.z * ca + q.y * sa); n.yz = vec2(n.y * ca - n.z * sa, n.z * ca + n.y * sa);
        a = b.y * hw; ca = cos(a); sa = sin(a);
        q.xz = vec2(q.x * ca + q.z * sa, q.z * ca - q.x * sa); n.xz = vec2(n.x * ca + n.z * sa, n.z * ca - n.x * sa);
        p = q + piv;
        a = lean * isBird; ca = cos(a); sa = sin(a);
        p.yz = vec2(p.y * ca - p.z * sa, p.z * ca + p.y * sa); n.yz = vec2(n.y * ca - n.z * sa, n.z * ca + n.y * sa);
        ca = cos(iRot.x); sa = sin(iRot.x);
        p.xz = vec2(p.x * ca + p.z * sa, p.z * ca - p.x * sa); n.xz = vec2(n.x * ca + n.z * sa, n.z * ca - n.x * sa);
        p = p * iRot.z + iPos;
        vCol = color * iRot.w; vBill = aAnim.z; vN = normalize(mat3(modelMatrix) * n);
        vWrap = mix(.4, 1., smoothstep(150., 171., iPos.y));
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec3 vCol, vN; varying float vBill, vAo, vWrap;
      ${Ze}
      #include <fog_pars_fragment>
      void main() {
        vec3 n = normalize(vN + vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) n = -n;
        vec3 alb = mix(vCol, vec3(.02), smoothstep(.03, .08, vBill) * (1. - smoothstep(.2, .3, vBill)));
        // plumage takes the low key round its edge and the sky on its shaded side (blue-grey, never the floor's grey):
        // on the summit, seen against the light, each bird is a cream body above the floor. The lit side is unchanged.
        float sd = dot(n, uSunDir), wrap = max((sd + .85) / 1.85, 0.) - max(sd, 0.);
        float topW = clamp((vWrap - .4) / .6, 0., 1.);      // on the summit the pale floor throws the low sun back up: shaded sides are cream, not slate
        gl_FragColor = vec4(gsLight(alb, n, vAo) + alb * (uSunCol * .42 * wrap + (uSkyCol * .3 + uSunCol * .3 * topW) * (1. - max(sd, 0.))) * vWrap * vAo, 1.);
        #include <fog_fragment>
      }`});return t.vertexColors=!0,Object.assign(t.uniforms,e),t}function Dt(e,t){const i=it(t),g=new n.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!0,uniforms:n.UniformsUtils.merge([n.UniformsLib.fog,{uCream:{value:i.cream},uSaff:{value:i.saff.clone().multiplyScalar(1.1)},uNest:{value:i.nest}}]),vertexShader:`
      attribute vec3 iPos; attribute vec4 iRot;
      uniform float uTime;
      varying vec2 vUv; varying vec4 vB; varying vec3 vR, vU, vF; varying vec2 vSide, vFar;
      ${nt}
      ${kt}
      #include <fog_pars_vertex>
      void main() {
        vec3 c = (modelMatrix * vec4(iPos, 1.)).xyz;
        vec3 cr = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), cu = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
        vec3 r = normalize(vec3(cr.x, 0., cr.z) + vec3(1e-5, 0., 0.));
        vec3 u = normalize(mix(vec3(0., 1., 0.), cu, .65));
        vec4 b; float lean = gsBehave(iRot.y, uTime, b); vB = b; vB.z += lean;
        vec3 f = vec3(sin(iRot.x), 0., cos(iRot.x));
        float sd = dot(f, r);
        vSide = vec2(sd < 0. ? -1. : 1., mix(.5, 1., abs(sd)));
        vUv = position.xy; vR = r; vU = u; vF = normalize(cross(r, u));
        vec3 wp = c + (r * position.x * .55 + u * position.y * .9) * iRot.z;
        vec4 mvPosition = viewMatrix * vec4(wp, 1.);
        vFar = vec2(smoothstep(22., 60., -mvPosition.z), mix(.4, 1., smoothstep(150., 171., c.y)));
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uCream, uSaff, uNest;
      varying vec2 vUv; varying vec4 vB; varying vec3 vR, vU, vF; varying vec2 vSide, vFar;
      ${Ze}
      #include <fog_pars_fragment>
      float seg(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0., 1.); return length(pa - ba * h); }
      void main() {
        vec2 m = vec2(vUv.x * .55 * vSide.x / vSide.y, vUv.y * .9);
        float px = max(max(fwidth(vUv.x) * .55, fwidth(vUv.y) * .9), 1e-4);
        vec2 hc = vec2(.17, .68) + vec2(.16 * vB.x, -.2 * max(vB.x, 0.) + .09 * max(-vB.x, 0.) + .2 * vB.z * 0.);
        vec2 bd = m - vec2(-.03, .31); float ca = cos(.6), sa = sin(.6);
        bd = vec2(bd.x * ca + bd.y * sa, bd.y * ca - bd.x * sa) / vec2(.27, .15);
        float lb = length(bd), body = 1. - smoothstep(1. - px * 5., 1. + px * 5., lb);
        float farK = clamp(vFar.x, 0., 1.), rh = clamp(max(.062, mix(.5, 1.05, farK) * px), .062, .135);      // beyond 25 m the head is drawn larger, two pixels across from 60 to 130 m (mend 6: .66 and .18 before; at 100 m a card showed 2 px of saffron of its 29, now 4); the cap keeps the head under half the body's area, so from 150 m out a row of birds is cream touched with saffron, not an orange line: the saffron must survive
        float neck = 1. - smoothstep(-px, px, seg(m, vec2(.1, .43), hc) - rh * .9);
        float head = 1. - smoothstep(-px, px, length(m - hc) - rh);
        float bill = 1. - smoothstep(-px, px, seg(m, hc, hc + vec2(.16, -.035)) - .02);
        float tail = 1. - smoothstep(-px, px, seg(m, vec2(-.2, .22), vec2(-.44, .07)) - .04);
        float open = vB.w * (1. - smoothstep(-px, px, seg(m, vec2(-.05, .5), vec2(-.5, .78 + .1 * sin(vB.w * 40.))) - .05));
        vec2 nd = (m - vec2(0., .03)) / vec2(.3, .07); float nest = 1. - smoothstep(1. - px * 6., 1. + px * 6., length(nd));
        float a = max(max(max(body, neck), max(head, bill)), max(max(tail, nest), open));
        if (a < .02) discard;
        vec3 alb = uNest * .8;
        alb = mix(alb, vec3(.02), tail);
        alb = mix(alb, uCream * (1. - .42 * (1. - smoothstep(-.75, .3, bd.y)) * (1. - open)), max(body, open));      // the belly is in its own shade: a body, not a white chip
        alb = mix(alb, mix(uCream, uSaff * (1. + .35 * farK), smoothstep(mix(.4, .3, farK), .62, m.y)), neck);
        alb = mix(alb, vec3(.33, .42, .5), bill * (1. - head));
        alb = mix(alb, uSaff * (1. + .5 * farK), head);
        vec2 n2 = clamp(mix(bd * vec2(.9, .9), (m - hc) / rh, head), -1., 1.) * .8;
        vec3 n = normalize(vR * n2.x * vSide.x + vU * (n2.y + .25) + vF * sqrt(max(1. - dot(n2, n2), .05)));
        float sd = dot(n, uSunDir), wrap = max((sd + .85) / 1.85, 0.) - max(sd, 0.);
        float topW = clamp((vFar.y - .4) / .6, 0., 1.);      // the summit floor's warm bounce, as on the modelled birds
        vec3 col = gsLight(alb, n, 1.) + alb * (uSunCol * .42 * wrap + (uSkyCol * .3 + uSunCol * .3 * topW) * (1. - max(sd, 0.))) * clamp(vFar.y, 0., 1.) * (1. - nest * (1. - max(max(body, neck), head)));
        gl_FragColor = vec4(col, a * step(abs(vUv.x), 1.) * step(vUv.y, 1.));
        #include <fog_fragment>
      }`});return Object.assign(g.uniforms,e),g}function et(e,t,i,g,E){const S=new n.InstancedBufferGeometry;S.index=e.index;for(const b of Object.keys(e.attributes))S.setAttribute(b,e.attributes[b]);if(S.setAttribute("iPos",new n.InstancedBufferAttribute(i,3)),S.setAttribute("iRot",new n.InstancedBufferAttribute(g,4)),E)for(const b of Object.keys(E))S.setAttribute(b,E[b]);return S.instanceCount=t,S.boundingSphere=new n.Sphere(new n.Vector3(0,200,0),400),S}function Pt(e){const t=it(e),i=[],g=[],E=[],S=[],b=(B,C,L,a=0,r=0)=>(i.push(B,0,C),g.push(L.r,L.g,L.b),E.push(a,r),i.length/3-1),z=b(0,.5,t.saff),H=b(0,-.46,t.cream),k=b(-.075,.04,t.cream),u=b(.075,.04,t.cream);S.push(z,u,k,H,k,u);for(const B of[-1,1]){const C=b(B*.07,.2,t.cream,B,0),L=b(B*.07,-.1,t.cream,B,0),a=b(B*.5,.15,t.cream,B,.5),r=b(B*.47,-.1,t.cream.clone().multiplyScalar(.5),B,.5),p=b(B*.94,-.05,t.black,B,1);S.push(C,L,a,L,r,a,a,r,p)}const U=new n.BufferGeometry;return U.setAttribute("position",new n.BufferAttribute(new Float32Array(i),3)),U.setAttribute("color",new n.BufferAttribute(new Float32Array(g),3)),U.setAttribute("aW",new n.BufferAttribute(new Float32Array(E),2)),U.setIndex(S),U}function Lt(e,t){const i=new n.ShaderMaterial({side:n.DoubleSide,fog:!0,uniforms:n.UniformsUtils.merge([n.UniformsLib.fog,{uWindDir:{value:t.wind},uShear:{value:t.shear},uWave:{value:new n.Vector3(t.arms,t.pitch,t.rise)}}]),vertexShader:`
      attribute vec2 aW; attribute vec4 iOrb; attribute vec4 iFly;
      uniform float uTime; uniform vec3 uShear, uWave, uWindDir;
      varying vec3 vCol, vN;
      #include <fog_pars_vertex>
      void main() {
        float s = iOrb.w, t = uTime;
        float th = iOrb.z - iFly.x * t;
        th += (.62 / uWave.x) * sin(uWave.x * th - iOrb.y * uWave.y + t * uWave.z);
        float y = iOrb.y + 7. * sin(t * .21 + s * 30.) + 3. * sin(t * .53 + s * 77.);
        float r = iOrb.x * (1. + .07 * sin(th * 3. + s * 11.)) + 4. * sin(t * .17 + s * 50.);
        float sh = smoothstep(60., 470., y); sh *= sqrt(sh);
        vec3 fw = vec3(sin(th), 0., -cos(th));
        fw = normalize(fw + vec3(0., .12 * sin(t * .4 + s * 21.), 0.));
        float bank = clamp(16. / max(r, 12.), .12, .8) + .12 * sin(t * .9 + s * 13.);
        float vis = 1., hang = step(.5, iFly.w);
        if (hang > .5) { // birds that step off a ledge into the updraft, or hang on the wind coming in to land
          float cy = fract(t / (6. + 3. * fract(s * 7.3)) + s * 13.);
          cy = mix(cy, 1. - cy, step(.5, fract(s * 3.7)));
          th = iOrb.z + .02 * sin(t * .5 + s * 9.);
          r = iOrb.x + mix(.2, 12., smoothstep(0., .75, cy)) + .6 * sin(t * .9 + s * 5.);
          y = iOrb.y + .5 + 4. * smoothstep(0., .3, cy) - 8. * cy * cy + .8 * sin(t * .7 + s * 3.);
          vis = smoothstep(0., .07, cy) * (1. - smoothstep(.86, 1., cy));
          sh = 0.;
          fw = normalize(-uWindDir + vec3(0., .25 - .3 * cy, 0.));
          bank = .3 * sin(t * 1.3 + s * 4.);
        }
        vec3 toC = vec3(-cos(th), 0., -sin(th));
        vec3 c = uShear * sh + vec3(cos(th) * r, y, sin(th) * r);
        vec3 up = normalize(vec3(0., cos(bank), 0.) + toC * sin(bank));
        vec3 rt = normalize(cross(up, fw)); up = cross(fw, rt);
        // wing beat: 3.5 a second, with glides
        float glide = smoothstep(.15, .55, sin(t * .43 + s * 20.) + .35 * sin(t * 1.1 + s * 5.));
        float A = mix(mix(.08, .8, glide), .3, hang), ph = t * mix(22., 31., hang) + s * 100.;
        float a1 = A * sin(ph) + .1 + .4 * hang, a2 = a1 + A * .9 * sin(ph - .9);
        vec3 p = position; vec3 n = vec3(0., 1., 0.);
        float w = aW.y, sx = aW.x;
        if (w > .25) {
          float dx = abs(p.x) - .07;
          vec2 mid = vec2(.07 + .43 * cos(a1), .43 * sin(a1));
          vec2 q = w > .75 ? mid + .45 * vec2(cos(a2), sin(a2)) : vec2(.07 + (dx / .43) * .43 * cos(a1), (dx / .43) * .43 * sin(a1));
          p.x = sx * q.x; p.y = q.y;
          float an = w > .75 ? a2 : a1; n = vec3(-sx * sin(an), cos(an), 0.);
        } else if (abs(sx) > .5) { n = vec3(-sx * sin(a1), cos(a1), 0.); }
        p.y -= .12 * A * sin(ph) * (1. - w);
        // far off a bird keeps about two pixels of wing (the tower must not thin to dust from the entry); from 24 m in
        // to 9 these simple birds draw back to nothing (the modelled flyers are the ones made to be seen near). Inside
        // the clear air (2 m and its half span from the lens) none is drawn back: PLACE keeps them out of it (clearAir)
        float cd = distance((modelMatrix * vec4(c, 1.)).xyz, cameraPosition);
        p *= iFly.y * vis * (1.3 + clamp((cd - 30.) / 130., 0., 2.1)) * max(smoothstep(9., 24., cd), step(cd, 2. + 1.23 * iFly.y));      // (and wings that read as wings at 50 to 150 m)
        vec3 wp = c + rt * p.x + up * p.y + fw * p.z;
        vN = normalize(mat3(modelMatrix) * (rt * n.x + up * n.y));
        vCol = mix(color, mix(vec3(.11, .075, .05), color, .12), iFly.z);
        vec4 mvPosition = modelViewMatrix * vec4(wp, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec3 vCol, vN;
      ${Ze}
      #include <fog_pars_fragment>
      void main() {
        vec3 n = normalize(vN + vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) n = -n;
        n = normalize(n + uSunDir * .35); // thin feathers pass some light
        gl_FragColor = vec4(gsLight(vCol, n, 1.), 1.);
        #include <fog_fragment>
      }`});return i.vertexColors=!0,Object.assign(i.uniforms,e),i}const Nt=6.2;function Ot(e,t,i,g,E){const S=new n.BufferGeometry;S.setAttribute("position",new n.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),S.setIndex([0,1,2,0,2,3]);const b=i+E,z=new Float32Array(b*4),H=new Float32Array(b*4);for(let B=0;B<b;B++){const C=B>=i,L=B%5>=3,a=e(),r=e(),p=e(),x=e(),h=e(),f=e(),c=(B/5|0)%20,m=C||c<11?0:c<17?1:2,l=C?1.14:m===1?1.24:m===2?.8:1,F=m===1?.62:1;if(L){const w=$(33,-22,a);z.set([$(25.2,28.5,r),-1,w,(132.8-w)/37.4-.9+h*.3],B*4);const N=$(7,16.5,Math.pow(p,.7))*l;H.set([$(.5,5,x),N,$(-7,-2,x*.5+r*.5),C?-$(.09,.22,f):$(.9,1.7,f)*(.75+N/50)*F+10*m],B*4)}else{z.set([$(8,25.5,a),-1,$(45,36.5,a)+5*r,h*h*.5],B*4);const w=$(9,31,Math.pow(p,.6))*l;H.set([($(-7,3.5,x)+(a-.5)*4)*(m===1?1.3:1),w,$(-1.5,5,r*.4+x*.6),C?-$(.1,.28,f):$(1.3,2.6,f)*(.7+w/60)*F+10*m],B*4)}}const k=new n.InstancedBufferGeometry;k.index=S.index,k.setAttribute("position",S.attributes.position),k.setAttribute("iO",new n.InstancedBufferAttribute(z,4)),k.setAttribute("iV",new n.InstancedBufferAttribute(H,4)),k.instanceCount=b,k.boundingSphere=new n.Sphere(new n.Vector3(30,15,10),90);const u=new n.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!0,uniforms:n.UniformsUtils.merge([n.UniformsLib.fog,{uBurstT:{value:0},uPx:{value:.0027},uWind:{value:g.clone()}}]),vertexShader:`
      attribute vec4 iO, iV;
      uniform float uBurstT, uPx; uniform vec3 uWind, uSunDir;
      varying vec2 vUv; varying vec4 vA, vRay; varying vec2 vLens, vBend; varying vec4 vSun; varying vec3 vFan;
      #include <fog_pars_vertex>
      void main() {
        float t = uBurstT - iO.w, live = step(0., t), run = step(1., iO.w);
        t = max(t, 0.);
        float drop = step(iV.w, 0.), drag = 1. - exp(-t * .3), life = mix(1., .56, run);
        // what each sprite is: 1 a droplet, 2 fine mist, 3 a strand (a ligament of water at the fan's edge), 0 a sheet
        float code = drop > .5 ? 0. : floor(iV.w * .1 + .001), size0 = iV.w - 10. * code, what = drop > .5 ? 1. : code > 1.5 ? 2. : code > .5 ? 3. : 0.;
        float mist = what == 2. ? 1. : 0.;
        vec3 c = iO.xyz + iV.xyz * (drag / .3) + uWind * (t * t * .4 + mist * t * 2.6) - vec3(0., 2.45 * t * t * (1. - .55 * mist), 0.);
        float a = smoothstep(0., .12, t) * (1. - smoothstep(2.9 * life, 5.2 * life, t)) * smoothstep(-4., .5, c.y) * live;
        a *= 1. - .85 * smoothstep(30.5, 35.5, c.x) * (1. - .5 * mist);                    // nothing white across the keyhole
        vec4 mvPosition = modelViewMatrix * vec4(c, 1.);
        float dz = -mvPosition.z; vec2 off;
        vec3 v = iV.xyz * exp(-t * .3) + uWind * t * .8 - vec3(0., 4.9 * t, 0.);
        vec2 dir = (modelViewMatrix * vec4(v, 0.)).xy; float sp = length(dir); vBend = vec2(0., 1.);
        dir = sp > 1e-3 ? dir / sp : vec2(0., 1.);
        if (what == 1.) {
          // a droplet is never larger than about one part in ninety of its distance from the lens (a bead a hand's
          // breadth across at 3 m was a white oval over the picture); close to, it is fainter and longer
          float size = min(max(-iV.w, dz * uPx * 1.3), max(dz * .011, dz * uPx * 1.3));
          off = dir * position.y * size * (1.6 + min(sp * .09, 3.2)) + vec2(dir.y, -dir.x) * position.x * size;
          a *= smoothstep(2.5, 9., dz) * mix(.45, 1., smoothstep(5., 30., dz)) * (1. - smoothstep(2.4 * life, 4.4 * life, t));
        } else if (what == 2.) {
          float size = size0 * (1.9 + 2.2 * smoothstep(0., 4., t));
          dir = vec2(0., 1.); off = position.xy * size;
          a *= smoothstep(6., 22., dz);
        } else if (what == 3.) {
          // a ligament: a fifth of a sheet's width, drawn out along its flight, and it curves over: the water at its
          // tail left earlier, so it has fallen (and blown downwind) further than the straight line back from its head.
          // The quad is widened to hold that droop; the fragment shader draws the bent strand inside it (vBend).
          // (seen from far off it is a soft torn tongue on the fan's edge, three to five times as long as broad; inside
          // 45 m it is a short torn gust, and inside 26 m it thins away: long bright lines never lie across the wall beside us)
          float nearL = 1. - smoothstep(18., 45., dz);
          float size = size0 * (.5 + .5 * smoothstep(0., 2.2, t)) * (1. + .45 * smoothstep(70., 200., dz));
          float halfL = size * (1.5 + min(sp * .07, 1.2)) * (1. - .45 * nearL), halfW = max(size * mix(.3, .42, nearL), dz * uPx * 2.5);
          vec2 perp = vec2(dir.y, -dir.x), acc = (modelViewMatrix * vec4(uWind * .8 - vec3(0., 4.9, 0.), 0.)).xy;
          float span = min(2. * halfL / max(sp, 3.), 1.), droop = clamp(.5 * dot(acc, perp) * span * span * 2.2, -.8 * halfL, .8 * halfL), wq = halfW + .67 * abs(droop);
          off = dir * position.y * halfL + perp * position.x * wq;
          vBend = vec2(droop / wq, halfW / wq);
          a *= smoothstep(9., 26., dz) * (1. - .5 * run);
        } else {
          // THE FALLING VEIL: a sheet on its way down is drawn out along its fall and thinner across it (and the
          // fragment shader tears it into finer threads): the fan's water comes down as a veil, not as the cloud it rose in
          float size = size0 * (.85 + 1.0 * smoothstep(0., 2.2, t)) * (1. + .3 * smoothstep(70., 200., dz)), fallK = smoothstep(2., 14., -v.y);
          off = dir * position.y * size * (1.25 + min(sp * .04, .7)) * (1. + .7 * fallK) + vec2(dir.y, -dir.x) * position.x * size * (1. - .25 * fallK);
          vBend = vec2(fallK, 1.);
          a *= smoothstep(4., 15., dz) * mix(1., smoothstep(7., 24., dz), run);      // thinned only right at the lens; the run up the wall beside us is thinned further out, so the wall stays solid rock behind it
        }
        // THE FINGERS: the fan's water leaves the pier in tongues. Each sprite of the fan knows the bearing it was thrown
        // on (across the fan) and how hard (its rise); where the tongues' pattern (two sines of that bearing: five to seven
        // tongues across the fan) has a gap, the hard-thrown water is not there. So the fan's upper edge is fingers with air
        // between them, and its body below is whole. A law of each sprite's own throw: no stream, no clock, no eye in it.
        if (run < .5 && what != 2.) {
          float vk = what == 1. ? 1.14 : what == 3. ? 1.24 : 1.;
          float ph = atan(iV.x, iV.y), hard = smoothstep(.42, .8, (iV.y / vk - 9.) / 22.);
          float gap = smoothstep(.38, .6, .5 + .27 * sin(ph * 23. + 1.3) + .23 * sin(ph * 37. + 4.1));
          a *= what == 1. ? mix(1., .2 + .8 * gap, hard) : 1. - .92 * hard * (1. - gap);          // (the droplets keep to the tongues too: few hang loose in the gaps)
        }
        vFan = vec3(mix(vec2(17., 40.), iO.xz, run), run);                                  // the foot of this sprite's burst, and which burst
        vUv = position.xy; vA = vec4(a, iO.w * 9.7 + abs(iV.w) * 3. + iO.x, t / life, what); vLens = vec2(smoothstep(12., 42., dz), smoothstep(70., 200., dz));
        mvPosition.xy += off * step(.001, a);
        // the light in this sprite's own frame (x across, y along its flight, z to the eye), and how nearly we look into it
        vec3 sv = (viewMatrix * vec4(uSunDir, 0.)).xyz;
        float back = max(dot(normalize(c - cameraPosition + vec3(0., 1e-4, 0.)), uSunDir), 0.);
        vSun = vec4(dot(sv.xy, vec2(dir.y, -dir.x)), dot(sv.xy, dir), sv.z, back * back);
        // where this fragment lies on a sphere through its burst, about the eye: sprites that overlap on screen read
        // the same noise there, so light and shade run on from sprite to sprite and the fan is one body of water
        vec3 src = mix(vec3(17., 8., 40.), iO.xyz + vec3(0., 5., 0.), run);
        vRay = vec4(mvPosition.xyz * mat3(viewMatrix), distance(src, cameraPosition));
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec2 vUv; varying vec4 vA, vRay; varying vec2 vLens, vBend; varying vec4 vSun; varying vec3 vFan;
      ${Ze}
      ${nt}
      #include <fog_pars_fragment>
      void main() {
        if (vA.x < .003) discard;
        float a; vec3 col;
        float age = clamp(vA.z / 4.2, 0., 1.), u = vUv.x, v = vUv.y, r2 = min(dot(vUv, vUv), 1.);
        float env = max(1. - u * u, 0.) * max(1. - v * v, 0.);
        // THE BURST HAS FORM, AND A SOFT BODY. The lit water is the slot's brass on white; the shade inside the body is a
        // blue-grey under the sky's own tone. (Once lit and shade were both sky-white, .72 and .8 of it, and some five
        // hundred sheets summed to one flat white; then the shade stood so far under it, .22, that the body went grey and
        // mottled and the bright droplets on it read as loose white dots. This is the middle: the body is one soft pale
        // burst again, shaded enough to have a core and a lit flank, and the droplets are its own tone at its edge.)
        vec3 lit = uSunCol * .6 + uSkyCol * .72, shade = uSkyCol * .36 + uShadeCol * .2;
        // every sprite is a rounded lump of spray: its side toward the slot is lit, the other is blue-grey
        float sl = dot(normalize(vec3(u, v, sqrt(max(1. - r2, 0.)) + .35)), vSun.xyz) * .5 + .5, back = vSun.w;
        // WHERE this fragment is in its burst (its place on the sphere through the burst about the eye, so sprites that
        // overlap on screen agree): its height over the sea, how far to the sunward side of the burst's foot it lies, and
        // how deep inside the body. The body's tone is laid by PLACE: shade in the core low down, light on the sunward
        // flank and toward the top where the water is thin, lumps of the place that fall with the water.
        vec3 q = normalize(vRay.xyz + vec3(0., 0., 1e-6)) * vRay.w, wp = q + cameraPosition, qn = q - vec3(0., 1.4 * vA.z, 0.);
        float run = vFan.z, h = wp.y + 1.;
        float side = clamp(dot(wp.xz - vFan.xy, uSunDir.xz) / max(length(uSunDir.xz), 1e-4) / mix(11., 5., run), -1., 1.);
        float core = (1. - smoothstep(.3, 1., abs(wp.x - vFan.x) / (mix(6., 3., run) + .4 * h))) * (1. - smoothstep(.45, 1., h / mix(34., 16., run)));
        float w1 = vn3(qn * .45), w2 = vn3(qn * 1.3 + 9.);
        float body = clamp(.55 - .6 * core + .4 * side + .2 * smoothstep(4., 30., h) + .6 * (w1 - .5) + .45 * (w2 - .5), 0., 1.);
        if (vA.w > 2.5) { // a ligament thrown clear of the body: it arcs over (see the vertex shader) and breaks into beads from the tail up
          float tn = .5 - .5 * v, uc = vBend.x * (tn * tn - .33), uu = (u - uc) / max(vBend.y, .04), prof = max(1. - uu * uu, 0.);
          float n1 = vn3(vec3(vA.y * 3., v * 2.4 - vA.z * .8, vA.y)), brk = clamp(.55 * age + .75 * tn - .12 + .3 * (n1 - .5), 0., 1.);
          float cells = 3.5 + 3. * fract(vA.y * .37), f = fract(v * cells + vA.y * 1.7), bead = 1. - smoothstep(.16, .46, abs(f - .5));
          float drop = step(.45, fract(floor(v * cells + vA.y * 1.7) * .618 + vA.y));          // some beads have already fallen away
          float bd = mix(1., bead * mix(1., drop, smoothstep(.6, .95, brk)), smoothstep(.2, .6, brk));
          a = prof * prof * max(1. - v * v, 0.) * bd * (.6 + .5 * n1) * vA.x * .8;
          col = mix(shade, lit, clamp(.35 + .4 * body + .35 * sl, 0., 1.)) + uSunCol * .3 * back;
        } else if (vA.w > 1.5) { // mist, drifting off downwind
          float soft = 1. - r2, n = vn3(vec3(vUv * 1.7 + vA.y, vA.z * .3));
          a = soft * soft * smoothstep(.15, .85, n + .3 * soft) * vA.x * .28;                 // (the soft spray behind and under the droplets)
          col = mix(shade, lit, .25 + .5 * body + .2 * sl) * (.9 + .2 * n) + uSunCol * .14 * back;
        } else if (vA.w > .5) { // a bead of thrown water, lit by the slot: the droplets at the fan's edge
          // torn along its flight: a soft streak broken by a noise that rides with it, never a clean oval
          float nb = vn3(vec3(u * 2.1 + vA.y * 3., v * 2.6 - vA.z * 1.3, vA.y * 1.7)), pb = max(1. - u * u, 0.) * max(1. - v * v, 0.);
          col = uSunCol * .85 + uSkyCol * .95; a = pb * pb * smoothstep(.22, .7, nb + .4 * pb) * vA.x * .55;
        } else {
          // a sheet: translucent, soft to its edge, drawn out into ligaments along its flight (they thin as it ages);
          // falling (vBend.x), it is a veil of finer threads with more air in it
          float fk = vBend.x;
          float f1 = vn3(vec3(u * (3.2 + 3.5 * fk) + vA.y * 7., v * .9 - vA.z * .5, vA.y * 3.)), f2 = vn3(vec3(u * (8.5 + 6. * fk) - vA.y * 5., v * 2.3 - vA.z * .9, vA.y));
          float fil = f1 * .6 + f2 * .4 + .45 * (w2 - .5);
          float dens = env * env * (.22 + 1.2 * smoothstep(.22 + .34 * age + .12 * fk, .78 + .3 * age, fil));
          a = clamp(dens, 0., 1.) * vA.x * mix(.55, .8, vLens.y) * (1. - .35 * age) * (1. - .25 * fk);
          float thin = 1. - smoothstep(0., .45, dens);
          float li = clamp(body + .5 * (fil - .5) + .22 * (sl - .5) + .25 * thin, 0., 1.);
          col = mix(shade, lit, li) + uSunCol * (.34 * back + .1) * thin;
        }
        if (a < .004) discard;
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
      }`});Object.assign(u.uniforms,t);const U=new n.Mesh(k,u);return U.frustumCulled=!1,U.renderOrder=6,U}async function Ht(e,t={}){const i=e.rng.fork("white-stack"),g=e.noise,E=(t.palette&&t.palette.length>=6?t.palette:wt).slice();for(;E.length<7;)E.push(wt[E.length]);const S=e.quality?.detail??1,b=(t.windDir?t.windDir.clone():new n.Vector3(.92,0,-.38)).setY(0).normalize(),z=(t.sunDir?t.sunDir.clone():new n.Vector3(-.7,.14,-.7)).normalize(),H={uTime:{value:0},uSunDir:{value:z},uSunCol:{value:new n.Color(t.sunColor||"#FFE9C4").multiplyScalar(t.sunIntensity??1.2)},uSkyCol:{value:t.skyColor?new n.Color(t.skyColor):new n.Color(.26,.335,.375)},uShadeCol:{value:t.shadeColor?new n.Color(t.shadeColor):new n.Color(.105,.155,.16)}},k=new n.Group;k.name="white-stack";const u=Mt(i.fork("form"),g);await e.yield();const U=await St(u,i.fork("rock"),g,e),B=s=>{const y=xt(g,s,u.footR(0,s)+Ge-.4,Ge),M=[];for(let T=0;T<u.nT;T++)M.push(u.tierY(T+1,s));return T=>{if(T>Me+4.5||T<-4.5)return 0;const R=T-.5,W=Math.min(T+.5,Me);let V=u.surfR(s,W);for(let O=0;O<u.nT;O++)M[O]>R&&M[O]<=W&&(V=Math.max(V,u.topR(O,s)));for(let O=0;O<6;O+=2)Math.max(y[O+1],y[O+3])>=R&&(V=Math.max(V,(y[O+3]>=R?y[O+2]:$(y[O],y[O+2],(y[O+1]-R)/(y[O+1]-y[O+3])))-Ge-st));return V+Ge+st}};await e.yield();const C=i.fork("look"),L=new n.Mesh(U,Ct(H,{rock:new n.Color("#2A2C2E").multiplyScalar(1.6),guano:new n.Color(E[4]).multiplyScalar(.84),algae:new n.Color(E[2]),guanoAmt:C.range(.75,1.15),lichenAmt:C.range(.45,1),seed:C.range(0,40),wind:b}));L.frustumCulled=!1,k.add(L),await e.yield();const a=await Et(u,i.fork("spots"),g,e);await e.yield();const r=Math.min(t.fullBirds??1500,a.length),p=Math.min(t.midBirds??2400,a.length-r),x=Math.round((t.cardBirds??14e3)*S),h=i.fork("birds"),f=Math.atan2(-b.x,-b.z),c=async(s,y,M)=>{const T=Math.max(0,Math.ceil((y-s)/M)),R=new Float32Array(T*3),W=new Float32Array(T*4);for(let V=0;V<T;V++){const O=a[s+V*M],ge=h(),le=h(),Ke=h(),_e=h();R[V*3]=O.x,R[V*3+1]=O.y,R[V*3+2]=O.z,W[V*4]=f+(ge<.14?(le-.5)*5:(le-.5)*1.1),W[V*4+1]=Ke,W[V*4+2]=1.12+.22*_e,W[V*4+3]=.9+.1*ge,V%1200===1199&&await e.yield()}return{n:T,iPos:R,iRot:W}},m=Bt(H),l=await c(0,r,1),F=C.fork("pairs"),w=new Uint8Array(l.n);for(let s=0,y=0;s<500&&y<28&&l.n>2;s++){const M=Math.floor(F()*l.n);if(w[M])continue;let T=-1,R=.82*.82;for(let O=0;O<l.n;O++){if(O===M||w[O]||Math.abs(l.iPos[O*3+1]-l.iPos[M*3+1])>.15)continue;const ge=l.iPos[O*3]-l.iPos[M*3],le=l.iPos[O*3+2]-l.iPos[M*3+2],Ke=ge*ge+le*le;Ke<R&&Ke>.2&&(R=Ke,T=O)}if(T<0)continue;const W=Math.atan2(l.iPos[T*3]-l.iPos[M*3],l.iPos[T*3+2]-l.iPos[M*3+2]),V=l.iRot[M*4+1];l.iRot[M*4]=W,l.iRot[T*4]=W+Math.PI,l.iRot[M*4+1]=V+2,l.iRot[T*4+1]=V+4,w[M]=w[T]=1,y++,s%40===39&&await e.yield()}await e.yield();const N=new n.Mesh(et(Ft(E),l.n,l.iPos,l.iRot),m);N.frustumCulled=!1,k.add(N),await e.yield();const K=t.season==="august",I=Math.floor(l.n/3),_=new Float32Array(I*3),G=new Float32Array(I*4);{let s=0;for(let M=1;M<l.n&&s<I;M+=3){if(w[M])continue;const T=l.iPos[M*3],R=l.iPos[M*3+1],W=l.iPos[M*3+2],V=Math.max(Math.hypot(T,W),1),O=F()<.5?-1:1,ge=.2+.08*F(),le=O*(.14+.1*F());_.set([T-T/V*ge-W/V*le,R,W-W/V*ge+T/V*le],s*3),G.set([l.iRot[M*4]+(F()-.5)*1.6,F(),K?1.9+.3*F():.9+.3*F(),.9+.1*F()],s*4),s++}const y=new n.Mesh(et(qt(K),s,_,G),m);y.frustumCulled=!1,k.add(y)}await e.yield();const X=await c(r,r+p,1);await e.yield();const o=a.length-r-p,d=Math.max(1,Math.ceil(o/Math.max(x,1))),A=await c(r+p,a.length,d);await e.yield();const j=ht(ct("gannet-frieze:"+e.seed)),Z=p>0?a[r+p-1].sc:-1,v=a.gaps||[],D=async s=>{const y=s.length,M=new Float32Array(y*3),T=new Float32Array(y*4);for(let R=0;R<y;R++){const W=s[R],V=j(),O=j(),ge=j(),le=j();M[R*3]=W.x,M[R*3+1]=W.y,M[R*3+2]=W.z,T[R*4]=f+(V<.14?(O-.5)*5:(O-.5)*1.1),T[R*4+1]=ge,T[R*4+2]=1.12+.22*le,T[R*4+3]=.9+.1*V,R%1200===1199&&await e.yield()}return{n:y,iPos:M,iRot:T}},q=(s,y)=>{const M=new Float32Array((s.n+y.n)*3),T=new Float32Array((s.n+y.n)*4);return M.set(s.iPos),M.set(y.iPos,s.n*3),T.set(s.iRot),T.set(y.iRot,s.n*4),{n:s.n+y.n,iPos:M,iRot:T}},Y=await D(v.filter(s=>s.sc<=Z)),ie=await D(v.filter(s=>s.sc>Z).filter((s,y)=>y%d===0)),se=q(X,Y),ue=q(A,ie);await e.yield();const ye=new n.Mesh(et(Kt(E),se.n,se.iPos,se.iRot),m);ye.frustumCulled=!1,k.add(ye),await e.yield();const we=new n.BufferGeometry;we.setAttribute("position",new n.BufferAttribute(new Float32Array([-2,0,0,2,0,0,0,2,0]),3)),we.setIndex([0,1,2]);const qe=new n.Mesh(et(we,ue.n,ue.iPos,ue.iRot),Dt(H,E));qe.frustumCulled=!1,qe.renderOrder=2,k.add(qe),await e.yield();const pe=i.fork("tower"),re={wind:b.clone(),shear:b.clone().multiplyScalar(pe.range(65,95)),arms:pe.pick([2,2,3]),pitch:pe.range(.022,.034),rise:pe.range(.22,.34)};let Ce=null,me=0,te=0,xe=()=>{};if(t.tower!==!1){me=Math.round((t.towerBirds??3900)*S);const s=16,y=Math.round(me/150),M=Math.round(me*.25),T=me+s*y+M,R=new Float32Array(T*4),W=new Float32Array(T*4),V=Math.min(Math.floor(a.length*.3),6e3),O=Math.max(0,Math.min(a.length-V,9e3)),ge={};for(let Q=0;Q<me;Q++){const Oe=pe(),de=pe(),Se=pe(),ee=pe(),he=pe(),Re=pe(),ke=60+410*Math.pow(Oe,1.55),Be=ke<105?80:ke<182?70:8,De=Math.sqrt($(Be*Be,14400,Math.pow(de,1.25)));if(R.set([De,ke,Se*fe,ee],Q*4),W.set([$(13,19,he)/De,1+.35*Re,Q%12===5?1:0,0],Q*4),Q%11===3&&O>0){const ve=a[ge[Q]=V+Math.floor(de*O)%O];R.set([Math.hypot(ve.x,ve.z),ve.y,Math.atan2(ve.z,ve.x),ee],Q*4),W[Q*4+1]=1.15+.2*Re,W[Q*4+3]=1}Q%300===299&&await e.yield()}await e.yield();let le=me;const Ke=Q=>Math.floor(dt(Q)/fe*s)%s;{const Q=ht(ct("gannet-trickle:"+e.seed)),Oe=new Int32Array(s),de=[];for(let ee=0;ee<s;ee++)de.push([]);for(let ee=3;ee<me;ee+=11)R[ee*4+1]<=Me&&Oe[Ke(R[ee*4+2])]++;for(let ee=0;ee<a.length;ee++){const he=a[ee];if(he.y<62||he.y>158)continue;const Re=Math.atan2(he.z,he.x);Qe(Re,he.y)>=30&&de[Ke(Re)].push(ee)}for(let ee=0;ee<s;ee++){const he=de[ee],Re=Math.min(y-Oe[ee],he.length);for(let ke=0;ke<Re;ke++){const Be=ke+Math.floor(Q()*(he.length-ke)),De=he[Be];he[Be]=he[ke];const ve=a[De],ae=Q(),P=Q(),oe=Q()<1/12?1:0,be=Math.hypot(ve.x,ve.z);R.set([be,ve.y,Math.atan2(ve.z,ve.x),ae],le*4),W.set([16/be,1.15+.2*P,oe,1],le*4),ge[le++]=De}}await e.yield();const Se=ht(ct("gannet-tower:"+e.seed));for(let ee=0,he=0;ee<M&&he<M*3;he++){const Re=Se(),ke=Se(),Be=Se(),De=Se(),ve=Se(),ae=Se(),P=Se()<1/12?1:0,oe=60+410*Math.pow(Re,1.55);if(oe>165&&oe<228)continue;const be=oe<105?80:oe<182?70:8,Ee=Math.sqrt($(be*be,14400,Math.pow(ke,1.25)));R.set([Ee,oe,Be*fe,De],le*4),W.set([$(13,19,ve)/Ee,1+.35*ae,P,0],le*4),le++,ee++,he%300===299&&await e.yield()}}await e.yield();const _e=et(Pt(E),le,new Float32Array(3),new Float32Array(4),{iOrb:new n.InstancedBufferAttribute(R,4),iFly:new n.InstancedBufferAttribute(W,4)});te=le-me,_e.deleteAttribute("iPos"),_e.deleteAttribute("iRot"),await e.yield(),Ce=new n.Mesh(_e,Lt(H,re)),Ce.frustumCulled=!1,k.add(Ce),xe=async Q=>{const Oe=re.shear,de=[],Se=[],ee=P=>{const oe=Le(60,470,P);return oe*Math.sqrt(oe)};for(let P=0;P<Q.length;P+=6){const oe=ee(Q[P+1]);de.push(Q[P],Q[P+1],Q[P+2]),Se.push(Math.hypot(Q[P]-Oe.x*oe,Q[P+2]-Oe.z*oe))}const he=(P,oe,be,Ee,ce)=>{for(const ze of P){const J=Math.max(Math.abs(de[ze+1]-be)-10,0);if(J>=ce)continue;const He=ee(Pe(de[ze+1],be-10,be+10)),Ae=de[ze]-Oe.x*He,je=de[ze+2]-Oe.z*He,Xe=Math.max(Math.abs(Math.hypot(Ae,je)-oe*(1+.07*Math.sin(3*Math.atan2(je,Ae)+11*Ee)))-4,0);if(Xe*Xe+J*J<ce*ce)return!0}return!1},Re=(P,oe)=>{const be=Math.hypot(P.x,P.z),Ee=[];for(let ce=0;ce<de.length;ce+=3)(de[ce]-P.x)**2+(de[ce+1]-P.y)**2+(de[ce+2]-P.z)**2<900&&Ee.push(ce);for(let ce=0;Ee.length&&ce<=20;ce++){const ze=ce/20,J=1+$(.2,12,Le(0,.75,ze))/be,He=P.x*J,Ae=P.z*J,je=P.y+.5+4*Le(0,.3,ze)-8*ze*ze,Xe=oe+Math.hypot(1,.02*be*J);for(const lt of Ee)if((de[lt]-He)**2+(de[lt+1]-je)**2+(de[lt+2]-Ae)**2<Xe*Xe)return!0}return!1};let ke=0,Be=0,De=0,ve=0,ae;for(let P=0;P<le;P++){const oe=R[P*4],be=R[P*4+1],Ee=R[P*4+3],ce=2.5+1.23*W[P*4+1],ze=[];if(W[P*4+3]&&P>=me){const J=Ke(R[P*4+2]),He=a.length;for(ae=0;ae<He;ae++){const Ae=a[(ge[P]+ae)%He],je=Math.atan2(Ae.z,Ae.x);if(!(ae&&(Ae.y<62||Ae.y>158||Ke(je)!==J||Qe(je,Ae.y)<30))){if(!Re(Ae,ce-.25)){ae&&R.set([Math.hypot(Ae.x,Ae.z),Ae.y,je],P*4);break}ae%64===63&&await e.yield()}}ae===He&&De++}else if(W[P*4+3]){for(ae=0;ae<O;ae++){const J=a[V+(ge[P]-V+ae)%O];if(!Re(J,ce-.25)){ae&&R.set([Math.hypot(J.x,J.z),J.y,Math.atan2(J.z,J.x)],P*4);break}ae%1024===1023&&await e.yield()}ae===O&&ke++}else{for(let J=0;J<Se.length;J++)Math.abs(Se[J]-oe)<.07*oe+9+ce&&ze.push(J*3);if(ze.length&&he(ze,oe,be,Ee,ce)){for(ae=1;ae<600;ae++){const J=be+(ae&1?.5:-.5)*(ae+1>>1);if(J>=60&&J<=470&&oe>=(J<105?80:J<182?70:8)&&!he(ze,oe,J,Ee,ce)){R[P*4+1]=J;break}}ae===600&&(P<me?Be++:ve++)}}P%20===19&&await e.yield()}return _e.attributes.iOrb.needsUpdate=!0,{hangers:ke,wheelers:Be,hangersMore:De,wheelersMore:ve}}}await e.yield();const ne=t.burstPeriod??8.5;let Ie=null,rt=-1;t.burst!==!1&&(Ie=Ot(i.fork("burst"),H,Math.round(900*Math.max(S,.7)),b,Math.round(420*Math.max(S,.7))),k.add(Ie)),await e.yield();const ut=new n.Vector2,Te=56,Ne=new Float32Array(Te+1),pt=new Float32Array(Te+1),$e=new Float32Array(Te+1);for(let s=0;s<=Te;s++){const y=s/Te,M=$(Ye,Je,y),T=ft(y);let R=0;for(let W=-2;W<=2;W++)R=Math.max(R,u.wallRadius(M+W*.03,T));$e[s]=Math.max(R+7,36.5),s%2===1&&await e.yield()}for(let s=0;s<=Te;s++)Ne[s]=Math.max($e[Math.max(s-1,0)],$e[s],$e[Math.min(s+1,Te)]);for(let s=0;s<2;s++){for(let y=0;y<=Te;y++)pt[y]=(Ne[Math.max(y-1,0)]+2*Ne[y]+Ne[Math.min(y+1,Te)])/4;Ne.set(pt)}for(let s=0;s<=Te;s++)Ne[s]=Math.max(Ne[s],$e[s]-.5);const tt=(s,y=new n.Vector3)=>{s=Pe(s,0,1);const M=s*Te,T=Math.min(Math.floor(M),Te-1),R=$(Ne[T],Ne[T+1],M-T),W=$(Ye,Je,s);return y.set(Math.cos(W)*R,ft(s),Math.sin(W)*R)},vt=[];for(let s=0;s<=16;s++)vt.push(tt(s/16));const zt={archAxis:{from:new n.Vector3(Fe,11,60),to:new n.Vector3(Fe,11,-45)},archCenter:new n.Vector3(Fe,12,0),burstOrigin:new n.Vector3(21,0,30),flyThrough:vt,helixAt:tt,lipRadius:u.lipRadius,wallRadius:u.wallRadius,ledgeAt:(s,y,M=new n.Vector3)=>{const T=u.ledgeNear(s,y);return M.set(Math.cos(s)*T.r,T.y,Math.sin(s)*T.r)},summit:new n.Vector3(0,Me+2,0),viewpoints:{entry:new n.Vector3(40,7,317),climb:tt(.5),crest:new n.Vector3(55,206,58)},tower:{center:new n.Vector3(0,0,0),radius:120,yMin:60,yMax:470,shear:re.shear.clone()},windDir:b.clone(),sunDir:z.clone(),surfRadius:u.surfR,archHalf:yt,rockColumn:B,rockGeometry:U},at={object:k,radius:72,height:Me,center:new n.Vector3(8,80,0),anchors:zt,uniforms:H,clearAir:xe,counts:{chicks:I,fullBirds:l.n,midBirds:X.n,cardBirds:A.n,towerBirds:me,tiers:u.nT,spots:a.length,beside:a.findIndex(s=>s.sc>12),friezeMids:Y.n,friezeCards:ie.n,towerMore:te},setLight(s={}){s.sunDir&&H.uSunDir.value.copy(s.sunDir).normalize(),s.sunColor&&H.uSunCol.value.set(s.sunColor).multiplyScalar(s.sunIntensity??1.2),s.skyColor&&H.uSkyCol.value.set(s.skyColor),s.shadeColor&&H.uShadeCol.value.set(s.shadeColor)},setBurst(s){rt=s},update(s,y,M){H.uTime.value=y,Ie&&(Ie.material.uniforms.uBurstT.value=rt>=0?Math.min(rt,1)*Nt:y%ne,e.renderer&&M&&M.isPerspectiveCamera&&(e.renderer.getDrawingBufferSize(ut),Ie.material.uniforms.uPx.value=2*Math.tan(M.fov*Math.PI/360)/Math.max(ut.y,1)))},dispose(){},ground:!0,groundY:-.6};if(gt){const s=[0,.5,.2,.85][gt],y=tt(s),M=Math.hypot(y.x,y.z);at.center=new n.Vector3(y.x*(1-7/M),y.y,y.z*(1-7/M)),at.radius=-2,at.height=4}return at}export{Ze as LIGHT_GLSL,Ht as buildHero};
