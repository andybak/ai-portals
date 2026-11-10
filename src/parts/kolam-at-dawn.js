import*as o from"three";import{clamp as pe,lerp as K,smoothstep as Y}from"../kit/core.js";const ee=40,me=ee*.35355339,F=2400,be=[[1,0],[0,1],[-1,0],[0,-1]],Me=["#1B2942","#3E5C8A","#A9B9D6","#F4F2EA","#E7B48B","#D8A23F","#C3352D"];function Se(a){const g=[],G=new Map;for(let s=-2;s<=2;s++)for(let e=-2;e<=2;e++)Math.abs(e)+Math.abs(s)<=2&&(G.set(e+","+s,g.length),g.push([e,s]));const P=(s,e)=>{const f=G.get(g[s][0]+be[e][0]+","+(g[s][1]+be[e][1]));return f===void 0?-1:f},d=g.map((s,e)=>[0,1,2,3].map(f=>P(e,f)<0)),C=s=>{const[e,f,c]=s;if(!c){const i=f+1&3;if(d[e][i])return[e,i,!1,!0];const w=i+2&3;return[P(e,i),w+3&3,!0,!1]}const r=f;return d[e][r]?[e,f+3&3,!0,!0]:[P(e,r),r+2&3,!1,!1]},S=()=>{const s=new Int16Array(g.length*4).fill(-1),e=[];for(let f=0;f<s.length;f++){if(s[f]>=0)continue;const c=[];let r=[f>>2,f&3,!1,!1];for(let i=0;i<400&&!(s[r[0]*4+r[1]]>=0);i++)s[r[0]*4+r[1]]=e.length,c.push(r),r=C(r);e.push(c)}return{seen:s,loops:e}};let v=S(),z=0;for(let s=0;s<24&&v.loops.length>1;s++){const e=[];for(let r=0;r<g.length;r++)for(let i=0;i<2;i++)d[r][i]||v.seen[r*4+(i+3&3)]!==v.seen[r*4+i]&&e.push([r,i]);if(!e.length)break;const[f,c]=e[Math.floor(a()*e.length)%e.length];d[f][c]=!0,d[P(f,c)][c+2&3]=!0,z++,v=S()}let h=v.loops[0];for(const s of v.loops)s.length>h.length&&(h=s);const x=[],t=(s,e)=>{const f=Math.PI*.25+e*Math.PI*.5;return[g[s][0]*ee+Math.cos(f)*me,g[s][1]*ee+Math.sin(f)*me,f]};for(let s=0;s<h.length;s++){const e=h[s],f=C(e),c=t(e[0],e[1]);if(f[3]){const r=g[e[0]][0]*ee,i=g[e[0]][1]*ee,w=e[2]?-1:1;for(let L=0;L<22;L++){const u=c[2]+w*(L/22)*Math.PI*.5;x.push([r+Math.cos(u)*me,i+Math.sin(u)*me])}}else{const r=t(f[0],f[1]);for(let i=0;i<28;i++)x.push([K(c[0],r[0],i/28),K(c[1],r[1],i/28)])}}return{dots:g.map(s=>[s[0]*ee,s[1]*ee]),strokes:[{pts:x,closed:!0}],turned:z,loops:v.loops.length}}function Pe(a){const g=[];for(let h=-2;h<=2;h++)for(let x=-2;x<=2;x++)Math.abs(x)+Math.abs(h)<=2&&g.push([x*ee,h*ee]);const G=(h,x)=>{const t=(h&1)===0,s=t?93:79,e=(t?21.5:16.5)*Math.PI/180,f=h*Math.PI/4,c=22,r=[],i=(w,L)=>{const u=K(9,s,w),p=e*(1-Math.pow(w,2.2))*L;return[Math.cos(f+p)*u,Math.sin(f+p)*u]};for(let w=0;w<=c;w++)r.push(i(w/c,x?-1:1));for(let w=c-1;w>=0;w--)r.push(i(w/c,x?1:-1));return{pts:r,closed:!1}},P=[G(3,a()<.5),G(2,!0),G(6,!0),G(1,!1)],d=[0,4,5,7];for(let h=d.length-1;h>0;h--){const x=Math.floor(a()*(h+1))%(h+1),t=d[h];d[h]=d[x],d[x]=t}const C=d.findIndex(h=>h===5||h===7);d.push(d.splice(C,1)[0]);const S=P.concat(d.map(h=>G(h,a()<.5))),v=h=>{let x=0;for(let t=1;t<h.pts.length;t++)x+=Math.hypot(h.pts[t][0]-h.pts[t-1][0],h.pts[t][1]-h.pts[t-1][1]);return x},z=S.reduce((h,x)=>h+v(x),0);return{dots:g,strokes:S,turned:0,loops:1,frac:(v(S[0])+v(S[1])*.66)/z}}function Ce(a,g,G,P,d){let C=a.frac||.22;const S=a.strokes.map(i=>{let w=i.pts.slice();if(i.closed){const u=g()<.5,p=w.length;let b=null;for(const q of[u,!u]){const k=q?w.slice().reverse():w;let M=0,_=1e9;for(let l=0;l<p;l++){const T=Math.hypot(k[l][0]+20,k[l][1]-66);T<_&&(_=T,M=l)}for(let l=.17;l<.295;l+=.02){const T=((M-Math.round(p*l))%p+p)%p,m=k[T][1]+.35*Math.abs(k[T][0])+60*Math.abs(l-.22);(!b||m<b.cost-1e-6)&&(b={cost:m,q:k,start:T,f:l})}}C=b.f,w=b.q.map((q,k)=>b.q[(b.start+k)%p]),w.push(w[0])}const L=[0];for(let u=1;u<w.length;u++)L.push(L[u-1]+Math.hypot(w[u][0]-w[u-1][0],w[u][1]-w[u-1][1]));return{p:w,cum:L,len:L[L.length-1],closed:i.closed}}),v=S.length===1&&S[0].closed,z=S.reduce((i,w)=>i+w.len,0),h=v?z/F:z/(F-S.length),x=new Float32Array(F),t=new Float32Array(F),s=new Float32Array(F),e=new Float32Array(F);let f=0;S.forEach((i,w)=>{let L=v?F:Math.round(i.len/h)+1;!v&&w===S.length-1&&(L=F-f),L=Math.min(L,F-f);let u=0;for(let p=0;p<L;p++){const b=v?p/L*i.len:p/Math.max(1,L-1)*i.len;for(;u<i.cum.length-2&&i.cum[u+1]<b;)u++;const q=pe((b-i.cum[u])/Math.max(1e-6,i.cum[u+1]-i.cum[u]),0,1);let k=K(i.p[u][0],i.p[u+1][0],q),M=K(i.p[u][1],i.p[u+1][1],q);const _=v?.9:.5;k+=G.n2(k*.021+7.3,M*.021)*_,M+=G.n2(k*.021,M*.021-4.1)*_,x[f]=k,t[f]=M,e[f]=w,s[f]=v?1:Y(0,5,Math.min(p,L-1-p)),f++}});const c=v?F*h:(F-1)*h;let r=null;if(d){const i=C*c+205;let w=i,L=1e9;for(const b of a.dots){if(Math.abs(Math.abs(b[0])+Math.abs(b[1])-2*ee)>1)continue;let q=-1,k=0;for(let M=1;M<=F;M++){if(M<F&&Math.hypot(x[M]-b[0],t[M]-b[1])<me+2.2){k||(q=M),k++;continue}if(k*h>50){const l=(q+k*.5)*h,T=Math.abs(l-i)/60+(b[0]>1?2:0)+(b[1]>1?1.5:0)+(l<C*c+150||l>C*c+330?50:0);T<L&&(L=T,w=l)}k=0}}const u=Math.round((w-25)/h),p=Math.round((w+25)/h);for(let b=u-6;b<=p+6;b++){const q=pe(b,0,F-1);s[q]=Math.min(s[q],1-Y(0,6,Math.min(b-(u-6),p+6-b)))}for(let b=1;b<=12;b++){const q=.75*Math.exp(-(((b-4)/3.2)**2));for(const k of[u-6-b,p+6+b]){const M=pe(k,0,F-1);s[M]*=1+q}}r={s0:u*h,s1:p*h}}return{X:x,Z:t,W:s,ID:e,ds:h,L:c,closed:v,gap:r,dots:a.dots,look:P,frac:C}}const Ge=512,ue=128,ve=10;async function Te(a,g){const G=new Float32Array(F*4),P=new Float32Array(F).fill(1);if(!a.closed){let e=0;for(let f=1;f<=F;f++)if(f===F||a.ID[f]!==a.ID[e]){for(let c=e;c<f;c++)P[c]=Y(0,36,Math.min(c-e,f-1-c)*a.ds);e=f}}for(let e=0;e<F;e++)G[e*4]=a.X[e],G[e*4+1]=a.Z[e],G[e*4+2]=a.W[e],G[e*4+3]=a.ID[e]+.45*P[e];const d=new o.DataTexture(G,F,1,o.RGBAFormat,o.FloatType);d.minFilter=d.magFilter=o.NearestFilter,d.generateMipmaps=!1,d.needsUpdate=!0;const C=Ge,S=2*ue/C,v=new Float32Array(C*C).fill(ve),z=new Float32Array(C*C).fill(-2),h=(e,f,c,r,i)=>{const w=(e+ue)/S,L=(f+ue)/S,u=Math.ceil(i/S),p=Math.max(0,Math.floor(w-u)),b=Math.min(C-1,Math.ceil(w+u)),q=Math.max(0,Math.floor(L-u)),k=Math.min(C-1,Math.ceil(L+u));for(let M=q;M<=k;M++)for(let _=p;_<=b;_++){const l=Math.max(0,Math.hypot((_+.5-w)*S,(M+.5-L)*S)-r),T=M*C+_;l<v[T]&&(v[T]=l,z[T]=c)}};for(let e=0;e<F;e+=3)a.W[e]>.5&&h(a.X[e],a.Z[e],e*a.ds,0,ve),e%150===0&&await g.yield();for(const e of a.dots)h(e[0],e[1],-1,2.2,ve);await g.yield();const x=new Uint16Array(C*C*4),t=o.DataUtils.toHalfFloat;for(let e=0;e<C;e++){let f=-1,c=-2;for(let r=C-1;r>=0;r--){const i=e*C+r;v[i]<.9&&(f=r,c=z[i]);const w=i*4;x[w]=t(v[i]),x[w+1]=t(z[i]),x[w+2]=t(f<0?120:Math.min(120,(f-r)*S)),x[w+3]=t(c)}(e&63)===0&&await g.yield()}const s=new o.DataTexture(x,C,C,o.RGBAFormat,o.HalfFloatType);return s.minFilter=s.magFilter=o.LinearFilter,s.wrapS=s.wrapT=o.ClampToEdgeWrapping,s.generateMipmaps=!1,s.needsUpdate=!0,{kTex:d,dTex:s}}const te=`
uniform float uTime, uLand, uHead, uL, uDs, uSun, uSunEdgeX, uClosed;
uniform vec3 uSunDir, uSunCol, uSkyTop, uSkyLow, uHouse, uFlour, uPeach;
float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y); }
float sunAt(vec3 wp){ float e = wp.x + .14 * wp.z - uSunEdgeX; return uSun * smoothstep(-13., 13., e); }
// light from the dawn sky on a surface with normal n: blue-violet from above, pale from the street (+z),
// near dark from the house (-z) and from below
vec3 skyLight(vec3 n){
  float up = clamp(n.y * .5 + .5, 0., 1.), st = clamp(n.z * .5 + .5, 0., 1.);
  vec3 side = mix(uHouse * 1.6, uSkyLow * .9, st);
  return mix(side * .55, uSkyLow * (1.12 + .2 * st) + uSkyTop * .6, up * up);
}
// the oil lamps on the step (xyz, w = how bright this instant): warm light that falls off within a few lamp widths
uniform vec3 uLampCol; uniform vec4 uLamps[11];
vec3 lampLight(vec3 P, vec3 n){
  float a = 0.;
  for (int i = 0; i < 11; i++) { vec3 d = uLamps[i].xyz - P; float r2 = dot(d, d) + 1e-3; a += uLamps[i].w * (.3 + .7 * max(dot(n, d) * inversesqrt(r2), 0.)) / (1. + r2 * .012); }
  return uLampCol * a;
}
`,ge=`
uniform sampler2D uKTex;
// K(s): xz position, z = width scale, w = stroke id. Manual lerp between nearest lookups.
vec4 Kat(float s){
  float f = s / uDs, i0 = floor(f), t = f - i0;
  float n = ${F}.;
  float a = mix(clamp(i0, 0., n - 1.), mod(i0, n), uClosed), b = mix(clamp(i0 + 1., 0., n - 1.), mod(i0 + 1., n), uClosed);
  vec4 A = texelFetch(uKTex, ivec2(int(a), 0), 0), B = texelFetch(uKTex, ivec2(int(b), 0), 0);
  if (abs(A.w - B.w) > .5) return A;
  return mix(A, B, t);
}
`,he=`
#include <fog_vertex>
`,ce=`
#include <fog_fragment>
`;function fe(){return o.UniformsUtils.clone(o.UniformsLib.fog)}async function Ae(a,g,G,P){const d=[[-1,1,1],[-1,1,.45],[-1,1,0],[-1,.75,0],[-1,.5,0],[-1,.25,0],[1,0,0],[1,.25,0],[1,.5,0],[1,.75,0],[1,1,0],[1,1,.45],[1,1,1]],C=d.length-1,S=a.closed?F+1:F,v=S*(C+1),z=28,h=10,x=a.dots.length*(z*h+1),t=new Float32Array((v+x)*3),s=new Float32Array(v+x),e=new Float32Array((v+x)*3),f=new Float32Array(v+x),c=[];for(let u=0;u<S;u++){const p=u%F,b=a.closed?(p+1)%F:Math.min(p+1,F-1),q=a.closed?(p+F-1)%F:Math.max(p-1,0);let k=a.X[b]-a.X[q],M=a.Z[b]-a.Z[q];a.ID[b]!==a.ID[p]?(k=a.X[p]-a.X[q],M=a.Z[p]-a.Z[q]):a.ID[q]!==a.ID[p]&&(k=a.X[b]-a.X[p],M=a.Z[b]-a.Z[p]);const _=Math.hypot(k,M)||1,l=-M/_,T=k/_,m=u*a.ds,y=p*a.ds,J=(1.4+.3*P.n2(y*.11,3.7)+.16*P.n2(y*.33,9.1)+.1*P.n2(y*.9,1.3))*a.W[p],Z=(1.6+.28*P.n2(y*.07,21.3)+.14*P.n2(y*.3,5.5)+.1*P.n2(y*.85,8.8))*a.W[p],W=.35*P.n2(y*.05,40.2);for(let D=0;D<=C;D++){const E=d[D][0],R=d[D][1],X=d[D][2],I=E*R,Q=(u*(C+1)+D)*3,U=1+.2*P.n2(y*.3+13.1,I*1.3)+.1*P.n2(y*1.1+3.1,E*4.7),N=Math.cos(R*Math.PI*.5),V=.17+(Z-.17)*Math.pow(Math.max(N,0),.72)*(1+.07*P.n2(y*.42,I*1.5+11)+.05*P.n2(y*1.3,I*4.1+2)),O=(.9+1.7*Math.max(0,.25+P.n2(y*.16,E*9.3))+.9*Math.max(0,P.n2(y*.75,E*3.7)))*a.W[p],$=I*J*U*(1+.25*(1-N))+W*N+E*X*O;t[Q]=a.X[p]+l*$,t[Q+1]=X>.99?-.1:(X>0?.11:V)*Math.min(1,a.W[p]*3)-(a.W[p]<.02?.3:0),t[Q+2]=a.Z[p]+T*$,s[u*(C+1)+D]=m,f[u*(C+1)+D]=X,e[Q]=a.X[p],e[Q+1]=-.4,e[Q+2]=a.Z[p]}if(u<S-1&&a.ID[p]===a.ID[(u+1)%F])for(let D=0;D<C;D++){const E=u*(C+1)+D,R=E+C+1;c.push(E,E+1,R,E+1,R+1,R)}(u&255)===0&&await G.yield()}let r=v;a.dots.forEach((u,p)=>{const b=r,q=p*2.39;t[r*3]=u[0],t[r*3+1]=2.4+.2*Math.sin(q*3.1),t[r*3+2]=u[1],s[r]=-1e3,e[r*3]=u[0],e[r*3+1]=0,e[r*3+2]=u[1],r++;for(let k=1;k<=h;k++)for(let M=0;M<z;M++){const _=k/h,l=M/z*Math.PI*2,T=1+.16*P.n2(Math.cos(l)*1.6+q,Math.sin(l)*1.6+_*2.2)+.05*P.n2(Math.cos(l)*3.3+q,Math.sin(l)*3.3+_*3),m=2.55*_*(k===h?1.12:1)*T,y=k===h?-.12:(2.4+.2*Math.sin(q*3.1))*Math.pow(Math.cos(_*Math.PI*.5),.8)*(.92+.12*T)+.25*Math.exp(-_*_*60);t[r*3]=u[0]+Math.cos(l)*m,t[r*3+1]=y,t[r*3+2]=u[1]+Math.sin(l)*m,s[r]=-1e3,e[r*3]=u[0],e[r*3+1]=0,e[r*3+2]=u[1],r++}for(let k=0;k<z;k++)c.push(b,b+1+(k+1)%z,b+1+k);for(let k=0;k<h-1;k++)for(let M=0;M<z;M++){const _=b+1+k*z+M,l=b+1+k*z+(M+1)%z,T=_+z,m=l+z;c.push(_,l,T,l,m,T)}}),await G.yield();const i=new o.BufferGeometry;i.setAttribute("position",new o.BufferAttribute(t,3)),i.setAttribute("aS",new o.BufferAttribute(s,1)),i.setAttribute("aC",new o.BufferAttribute(e,3)),i.setAttribute("aT",new o.BufferAttribute(f,1)),i.setIndex(c),i.computeVertexNormals(),await G.yield();const w=new o.ShaderMaterial({fog:!0,uniforms:{...fe(),...g},vertexShader:`
      #include <fog_pars_vertex>
      ${te}
      uniform vec2 uBites[12];
      attribute float aS, aT; attribute vec3 aC;
      varying vec3 vW, vN; varying float vFresh, vH, vT;
      void main(){
        float g = aS < -1. ? 1. : smoothstep(0., 6., uLand - aS);
        float fresh = aS < -1. ? 0. : (1. - smoothstep(0., 40., uLand - aS)) * g;
        float bite = 0.;
        for (int i = 0; i < 12; i++) { float r = max(uBites[i].y, .01); bite = max(bite, (1. - smoothstep(r * .45, r, abs(aS - uBites[i].x))) * step(.02, uBites[i].y)); }
        g *= 1. - .93 * bite;
        vec3 p = mix(aC, position, g);
        p.y = mix(aC.y, position.y * (1. + .12 * fresh), g);     // fresh flour stands a little prouder, then settles
        vec3 n = normalize(mix(vec3(0., 1., 0.), normal, clamp(g * 1.4, 0., 1.)));
        vec4 wp = modelMatrix * vec4(p, 1.);
        vW = wp.xyz; vN = normalize(mat3(modelMatrix) * n); vFresh = fresh; vH = p.y; vT = aT * step(.5, g) + (1. - step(.5, g)) * 2.;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        ${he}
      }`,fragmentShader:`
      #include <fog_pars_fragment>
      ${te}
      uniform vec3 uGoldCol;
      varying vec3 vW, vN; varying float vFresh, vH, vT;
      void main(){
        float dist = length(cameraPosition - vW), near = 1. - smoothstep(35., 170., dist);
        vec2 q = vW.xz + vW.y * .7; float close = 1. - smoothstep(12., 60., dist), midd = 1. - smoothstep(30., 260., dist);
        // the apron crumbles: clumps near the ridge, single grains further out (far away it is a soft pale fringe)
        if (vT > 1.5) discard;
        float crumb = vnoise(q * 1.3) * mix(.5, .34, close) + vnoise(q * 3.7) * .3 + vnoise(q * 9.) * (.2 * (close + .4) + .14 * close);
        if (vT > .02 && crumb < mix(.34, .8, vT) + .12 * (1. - midd) + close * (.05 + .3 * vT)) discard;      // from close by the fringe is grains, not shapes
        float g1 = vnoise(q * 5.5), g2 = vnoise(q * 5.5 + 31.7), h1 = vnoise(q * 16.), h2 = vnoise(q * 16. + 11.3), g3 = vnoise(q * 1.1);
        float c1 = vnoise(q * 1.9 + 7.), c2 = vnoise(q * 1.9 + 23.);                         // clumps: loose flour is lumpy at half a metre
        vec3 n = normalize(vN + (vec3(c1, .5, c2) - .5) * .55 * midd + (vec3(g1, .5, g2) - .5) * .6 * near + (vec3(h1, .5, h2) - .5) * .7 * close + vec3(0., 1e-3, 0.));
        vec2 sq = q * 11.; float spark = step(.955, hash21(floor(sq) + 5.1)) * (1. - smoothstep(.12, .3, length(fract(sq) - .5))) * close;
        vec3 light = skyLight(n); light = mix(light, vec3(dot(light, vec3(.3, .5, .2))), .45) * 1.12;      // flour is white: it takes the sky's brightness more than its blue
        // sunrise: the flank that faces the sun glows peach-gold, the crest stays white, the far flank goes blue-grey
        vec3 sh = normalize(vec3(uSunDir.x, 0., uSunDir.z));
        float sun = sunAt(vW), face = dot(normalize(vN), sh) * .75 + dot(n, sh) * .25, nl = smoothstep(-.22, .22, face), lee = smoothstep(.06, .42, -face);
        vec3 gold = mix(uSunCol, uPeach, .45) * 1.5 + uGoldCol * .2;
        light = mix(light, light * vec3(1.14, 1., .8), sun * .7);                                         // the whole ridge warms a little
        light = mix(light, light * vec3(.42, .54, .84), sun * lee * .92);
        light = mix(light, gold * (.78 + .22 * nl) + light * .14, sun * nl);
        float ao = .56 + .44 * smoothstep(-.1, 1.1, vH);
        float pit = smoothstep(.3, .62, c1 * .6 + g1 * .4);                                  // shaded hollows between the clumps
        vec3 col = uFlour * light * ao * (.84 + .1 * g1 * near + .1 * h1 * close + .08 * g3) * (1. - .2 * (1. - pit) * midd);
        col += uFlour * spark * (.14 + sun * uSunCol * 1.2 * nl);                               // single bright grains
        col += uFlour * vFresh * .07;
        gl_FragColor = vec4(col, 1.);
        ${ce}
      }`}),L=new o.Mesh(i,w);return L.frustumCulled=!1,L.name="kolam-flour",L}function Le(a){const g=(C,S)=>{const v=new o.PlaneGeometry(1,1,C,S);return v.translate(.5,.5,0),v},G={fog:!0,transparent:!0,depthWrite:!1,side:o.DoubleSide},P=new o.Mesh(g(140,2),new o.ShaderMaterial({...G,uniforms:{...fe(),...a},vertexShader:`
      #include <fog_pars_vertex>
      ${te}
      ${ge}
      uniform float uGust, uRope; uniform vec3 uGustDir;
      varying vec3 vW; varying vec2 vQ; varying float vMask;
      vec3 ropeAt(float a){
        float s = uHead - 72. + a * 72.; vec4 k = Kat(s);
        vec3 p = vec3(k.x, 60. * a, k.y);
        p.xz += vec2(sin(a * 9. + uTime * 2.1), cos(a * 7. - uTime * 1.7)) * .9 * a;   // the hand trembles
        p += uGustDir * uGust * (20. * pow(max(1. - a, 0.), .8) + 3. * sin(a * 11. - uTime * 5.) * (1. - a));   // a gust carries the falling grains downwind
        return p;
      }
      void main(){
        float a = position.x, c = position.y * 2. - 1.;
        float s = uHead - 72. + a * 72.; vec4 k = Kat(s);
        vec3 p = ropeAt(a), t = ropeAt(a + .01) - ropeAt(a - .01);
        vec4 wp = modelMatrix * vec4(p, 1.);
        vec3 tw = mat3(modelMatrix) * t, toCam = cameraPosition - wp.xyz;
        vec3 side = cross(tw, toCam); side = side / max(length(side), 1e-4);
        float halfW = mix(1.7, .9, a) * (1. + .25 * sin(a * 31. - uTime * 9.)) * uRope;
        halfW = max(halfW, length(toCam) * .0016 * step(.01, uRope));
        wp.xyz += side * c * halfW;
        vMask = step(0., s) * step(s, uL) * max(step(.5, k.z), uClosed);     // over the loop the gust leaves open the grains still fall: they are blown away
        vW = wp.xyz; vQ = vec2(a, c);
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        ${he}
      }`,fragmentShader:`
      #include <fog_pars_fragment>
      ${te}
      varying vec3 vW; varying vec2 vQ; varying float vMask;
      void main(){
        float a = vQ.x, c = vQ.y;
        float fall = a * 46. + uTime * 16.;                                   // grain bunches running down
        float cw = c + (vnoise(vec2(a * 19., uTime * 1.1)) - .5) * .7 * smoothstep(.2, .8, a), core = max(1. - cw * cw, 0.) * (1. - smoothstep(.5, 1., abs(c)));      // toward its top the stream wanders and frays
        float streak = vnoise(vec2(c * 5., fall * .35)) * .6 + vnoise(vec2(c * 13. + 3., fall)) * .4;
        float grains = smoothstep(.35, .65, vnoise(vec2(c * 9., fall * 2.4)));
        float alpha = core * (.42 + .75 * streak) * mix(1., grains, .3 + .5 * abs(c));
        float loose = smoothstep(.28, .8, a);                                 // and breaks up into single bunches of grains before it is lost in the haze
        alpha *= mix(1., smoothstep(.42, .7, vnoise(vec2(c * 6., fall * 1.5)) * .6 + streak * .4) * 1.15, loose) * (1. - .45 * loose);
        alpha *= (1. - smoothstep(.5, .96, a + (streak - .5) * .3)) * smoothstep(0., .03, a) * vMask;
        alpha *= smoothstep(28., 62., distance(cameraPosition, vW));       // never a pale band across the lens
        if (alpha < .004) discard;
        float sun = sunAt(vW);
        vec3 col = uFlour * (skyLight(vec3(0., .5, .6)) * (1.05 + .25 * streak) + uSunCol * sun * 1.3);
        gl_FragColor = vec4(col, clamp(alpha, 0., .96));
        ${ce}
      }`})),d=new o.Mesh(g(240,8),new o.ShaderMaterial({...G,uniforms:{...fe(),...a},vertexShader:`
      #include <fog_pars_vertex>
      ${te}
      ${ge}
      uniform float uGust; uniform vec3 uGustDir;
      varying vec3 vW; varying vec4 vQ; varying float vMask;
      void main(){
        float a = position.x, b = position.y;
        float s = uHead - a * 272., tau = a * 272. / 30.;
        vec4 k = Kat(s);
        float top = clamp(60. - 8. * tau, 0., 60.), bot = max(60. - 25. * tau, 0.);
        float y = mix(bot, top, b);
        vec3 p = vec3(k.x, y, k.y);
        float age = clamp(tau / 7.5, 0., 1.), hang = clamp(y / 60., 0., 1.);
        // the dust billows more the longer it has hung
        p.xz += vec2(vnoise(vec2(s * .04, y * .05 - uTime * .25)), vnoise(vec2(s * .04 + 9., y * .05 + uTime * .2))) * 7. * age - 3.5 * age;
        float fallen = clamp(1. - hang, 0., 1.);
        p += uGustDir * uGust * (30. * pow(fallen, .75) + 5. * sin(s * .08 + y * .11 - uTime * 3.5) * fallen);   // the rare gust: the curtain streams downwind
        vMask = step(0., s) * step(s, uL) * max(step(.5, k.z) * smoothstep(0., .44, fract(k.w)), uClosed);      // a stroke's first and last metres of curtain thin away: no upright edge
        vec4 wp = modelMatrix * vec4(p, 1.);
        vW = wp.xyz; vQ = vec4(s, y, tau, b);
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        ${he}
      }`,fragmentShader:`
      #include <fog_pars_fragment>
      ${te}
      uniform float uVeilK; uniform vec2 uVeilT;
      varying vec3 vW; varying vec4 vQ; varying float vMask;
      void main(){
        float s = vQ.x, y = vQ.y, tau = vQ.z, b = vQ.w;
        float fallY = y + uTime * 8.;
        float streak = vnoise(vec2(s * .9, fallY * .06)) * .55 + vnoise(vec2(s * 2.7 + 5., fallY * .16)) * .45;
        float cloud = vnoise(vec2(s * .06 + uTime * .05, fallY * .035));
        float dens = smoothstep(.36, .95, streak * .7 + cloud * .5);
        // its edges wander: the rope side, the top and the newest end are frayed by slow billows, never straight
        float wn = vnoise(vec2(s * .13 + 7., y * .07 - uTime * .3)), wn2 = vnoise(vec2(s * .045, uTime * .17 + 3.)), bb = b + (wn - .5) * .36;
        float edge = smoothstep(.02, .36, bb) * (1. - smoothstep(.6, .98, bb));
        vec2 vg = vec2(s * 2.6, fallY * 2.6); float grain = step(.8, hash21(floor(vg))) * (1. - smoothstep(.18, .42, length(fract(vg) - .5)));   // single grains at the frayed edges
        float alpha = mix(grain * .55, dens * .62 + grain * .42 * (1. - dens), edge) * (.2 + .8 * edge);      // a see-through fall: thin streaks with single grains between them
        alpha *= (1. - smoothstep(uVeilT.x, uVeilT.y, tau)) * smoothstep(.12, 1.3 + 1.3 * vnoise(vec2(y * .09, s * .05 + uTime * .4)), tau) * (1. - smoothstep(22., 54., y + (wn2 - .5) * 24. + (wn - .5) * 12.)) * vMask;      // its newest end and its top dissolve: no fan with an edge beside the rope
        vec3 vv = cameraPosition - vW; float vd = length(vv);
        vec3 fn = cross(dFdx(vW), dFdy(vW)); float facing = abs(dot(fn / max(length(fn), 1e-6), vv / max(vd, 1e-4)));
        // no hard pane where the curtain turns edge-on, and no sheet at the lens: within some twenty metres the
        // fall is only its single grains (the sprites), so it never lies over the picture as a smear
        alpha = min(alpha * .5 * uVeilK * smoothstep(.02, .4, facing) * smoothstep(26., 120., vd), .72);
        if (alpha < .004) discard;
        float sun = sunAt(vW);
        vec3 col = uFlour * skyLight(vec3(0., .4, .7)) * (.8 + .35 * streak) * (.85 + .15 * uVeilK);
        col += uSunCol * sun * (.45 + 1.6 * grain * streak);                                // gold sparks in the first sun
        gl_FragColor = vec4(col, alpha);
        ${ce}
      }`}));return P.frustumCulled=d.frustumCulled=!1,P.renderOrder=6,d.renderOrder=5,P.name="kolam-rope",d.name="kolam-veil",{rope:P,veil:d}}function Fe(a,g,G){const P=Math.round(5200*G),d=260,C=Math.round(520*G),S=Math.round(900*G),v=P+d+C+S,z=new Float32Array(v*4),h=new Float32Array(v);for(let e=0;e<v;e++)z[e*4]=g(),z[e*4+1]=g(),z[e*4+2]=g(),z[e*4+3]=g(),h[e]=e<P?0:e<P+d?1:e<P+d+C?2:3;const x=new o.InstancedBufferGeometry;x.setAttribute("position",new o.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),x.setIndex([0,1,2,0,2,3]),x.setAttribute("aSeed",new o.InstancedBufferAttribute(z,4)),x.setAttribute("aKind",new o.InstancedBufferAttribute(h,1)),x.instanceCount=v;const t=new o.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,uniforms:{...fe(),...a},vertexShader:`
      #include <fog_pars_vertex>
      ${te}
      ${ge}
      uniform float uGust, uPxK, uGold; uniform vec3 uGustDir, uGoldCol;
      attribute vec4 aSeed; attribute float aKind;
      varying vec2 vC; varying vec4 vCol; varying float vSoft;
      void main(){
        vec3 p = vec3(0.); float size = .3, alpha = 1., soft = 0., gold = 0.;
        if (aKind < .5) {                                  // falling: poured at sp, age tau
          float off = mod(uHead - aSeed.x * 272., 272.), sp = uHead - off, tau = off / 30.;
          float v = mix(8., 25., aSeed.y * aSeed.y);       // most of it is slow dust
          float y = 60. - v * tau; vec4 k = Kat(sp);
          float spread = .7 + (25. - v) * .16 * tau;
          vec2 j = (aSeed.zw - .5) * 2. * spread + vec2(sin(uTime * 1.3 + aSeed.z * 40.), cos(uTime * 1.1 + aSeed.w * 40.)) * .5 * tau;
          p = vec3(k.x + j.x, y, k.y + j.y) + uGustDir * uGust * 30. * pow(clamp(1. - y / 60., 0., 1.), .75) * (.55 + .9 * aSeed.z);
          size = mix(.07, .17, aSeed.w) * (1. + .6 * step(.9, aSeed.y)) * (1. + 1.3 * uGust);
          alpha = step(0.3, y) * step(0., sp) * step(sp, uL) * max(step(.5, k.z), uClosed) * (1. - smoothstep(46., 60., y)) * (.55 + .45 * aSeed.z);
        } else if (aKind < 1.5) {                           // the rolling collar round the burst
          vec4 k = Kat(uLand - 1.5), k2 = Kat(uLand - 3.);
          float th = aSeed.x * 6.2832, roll = uTime * (2.5 + aSeed.y * 2.) + aSeed.z * 6.2832, life = fract(roll / 6.2832);
          float rad = 1.2 + 5.2 * pow(life, .8) + .8 * sin(roll);
          p = vec3(k.x + cos(th) * rad, .5 + (1.2 + 5. * aSeed.w * aSeed.w) * sin(life * 3.1416) * (1. - .5 * life), k.y + sin(th) * rad);   // a mound of dust: high at the heart, low and wide at the rim
          p.xz += (k2.xy - k.xy) * life * 1.5;             // it trails behind the landing point
          size = mix(1.2, 3.2, aSeed.z) * (.5 + .9 * life); soft = 1.;
          alpha = .19 * sin(life * 3.1416) * step(uLand, uL - .5) * max(step(.5, k.z), uClosed);
          alpha *= smoothstep(26., 62., distance(cameraPosition, p));   // no soft puffs against the lens
        } else if (aKind < 2.5) {                           // grains thrown out of the burst, bouncing, then left lying
          float off = mod(uLand - aSeed.x * 46., 46.), se = uLand - off, t = off / 30.;
          vec4 k = Kat(se); float th = aSeed.y * 6.2832, reach = (2. + 6.5 * aSeed.z) * (1. - exp(-3.5 * t));
          p = vec3(k.x + cos(th) * reach, .12 + abs(sin(t * 11. + aSeed.w * 3.)) * 1.7 * exp(-3. * t), k.y + sin(th) * reach) + uGustDir * uGust * t * 34. * (.4 + aSeed.z);
          size = mix(.07, .16, aSeed.w);
          alpha = step(0., se) * step(.5, k.z) * (1. - smoothstep(1.2, 1.53, t));
        } else {                                            // gold motes over the finished knot
          float th = aSeed.x * 6.2832, rad = sqrt(aSeed.y) * 88.;
          float y = mod(aSeed.z * 46. - uTime * (.5 + aSeed.w), 46.) + 1.;
          p = vec3(cos(th) * rad + sin(uTime * .3 + aSeed.z * 30.) * 2., y, sin(th) * rad + cos(uTime * .27 + aSeed.w * 30.) * 2.);
          size = mix(.2, .42, aSeed.w); gold = 1.;
          alpha = .7 * uGold * smoothstep(1., 4., y) * (1. - smoothstep(30., 47., y)) * (.4 + .6 * sin(uTime * (2. + aSeed.x * 3.) + aSeed.y * 50.));
        }
        vec4 wp = modelMatrix * vec4(p, 1.);
        float sun = sunAt(wp.xyz);
        vec4 mvPosition = viewMatrix * wp;
        float px = -mvPosition.z * uPxK;                   // world size of 1.6 pixels at this depth
        float sz = min(max(size, px * (1. - soft)), mix(px * 5., size, soft));
        alpha *= smoothstep(2., 9., -mvPosition.z);
        alpha *= clamp(size / max(sz, 1e-4), .16, 1.);
        mvPosition.xy += position.xy * sz * step(.004, alpha);
        gl_Position = projectionMatrix * mvPosition;
        vec3 col = uFlour * skyLight(vec3(0., .6, .5)) * (.85 + .3 * aSeed.w);
        col = mix(col + uSunCol * sun * (.35 + 1.5 * step(.86, aSeed.z) * (1. - soft)), uGoldCol * 2.6, gold);
        vCol = vec4(col, alpha * mix(1., sun, gold)); vC = position.xy; vSoft = soft;
        ${he}
      }`,fragmentShader:`
      #include <fog_pars_fragment>
      varying vec2 vC; varying vec4 vCol; varying float vSoft;
      void main(){
        float r2 = dot(vC, vC);
        float a = mix(1. - smoothstep(.45, 1., r2), exp(-r2 * 3.2) * (1. - smoothstep(.7, 1., r2)), vSoft) * vCol.a;
        if (a < .004) discard;
        gl_FragColor = vec4(vCol.rgb, a);
        ${ce}
      }`}),s=new o.Mesh(x,t);return s.frustumCulled=!1,s.renderOrder=7,s.name="kolam-grains",s}function De(a,g){const G=new o.PlaneGeometry(g,g,1,1);G.rotateX(-Math.PI/2);const P=new o.ShaderMaterial({fog:!0,uniforms:{...fe(),...a},vertexShader:`
      #include <fog_pars_vertex>
      varying vec3 vW;
      void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition; ${he} }`,fragmentShader:`
      #include <fog_pars_fragment>
      ${te}
      uniform sampler2D uDTex;
      uniform vec3 uStoneA, uStoneB, uMoss, uGoldCol, uCellCol[3];
      uniform vec4 uCells[17], uPourer;
      uniform vec2 uBites[12];
      uniform float uEarth, uFest, uGlint, uGold; uniform vec2 uShadowLen, uGapDot, uGapK, uVeilT; uniform vec4 uGap, uGapEnds; uniform vec3 uGustDir, uKaavi, uRose;
      uniform vec4 uFoot, uStep; uniform vec3 uLime, uOchre, uGlintAt; uniform float uDawn;
      varying vec3 vW;
      // the sky as the wet ground mirrors it: blue overhead, pale up the street, the dark house, and to the east
      // the rose and the wide peach band, which is what the stone shows most of
      vec3 skyRefl(vec3 R){
        float h = clamp(R.y, 0., 1.), street = clamp(R.z * .5 + .5, 0., 1.), east = R.x / max(length(R.xz), 1e-3);
        vec3 top = mix(uSkyTop, vec3(dot(uSkyTop, vec3(.3, .5, .2))) * vec3(.96, 1., 1.1), mix(.45, .15, uEarth)) * .9;        // overhead the film shows a grey-blue, not the sky's full ultramarine
        vec3 low = mix(uSkyLow, mix(uSkyLow, uSkyTop, .66) * .86, uEarth);                                  // the damp yard is a darker mirror: it shows the sky's blue, not the pale of the horizon
        vec3 c = mix(low, top, pow(h, .45));
        c = mix(c, uSkyLow * 1.08, (1. - h) * (1. - h) * street * .7 * (1. - .7 * uEarth));
        c = mix(c, uHouse * 1.5 + uSkyLow * .11 + uSkyTop * .2 * uEarth, smoothstep(0., .7, -R.z) * (1. - smoothstep(.1, .6, h)) * .86);      // the house: dark at its foot, haze above
        float e = smoothstep(-.35 - .25 * uDawn, .85 - .1 * uDawn, east);
        float sunG = uSun * (1. - smoothstep(60., 250., uSunEdgeX));        // the mirrored band brightens as the sun's edge comes onto the knot, not before: the first warm ground is the edge itself
        c = mix(c, uRose, e * smoothstep(.1, .4, h) * (1. - smoothstep(.4, .85, h)) * (.28 + .16 * sunG));
        c = mix(c, uPeach * (1.05 + .4 * sunG + .25 * uDawn), e * e * (1. - smoothstep(.06, .55 + .3 * uDawn, h)) * (.55 + .3 * sunG + uEarth * (.12 * sunG - .17 * (1. - sunG)) + .2 * uDawn));     // (the damp earth is a dark mirror until the sun's edge is on it: before that it shows little of the band)   // (uDawn: the band has grown; the film toward the street shows more of it)
        return c;
      }
      void main(){
        vec3 P = vW, toCam = cameraPosition - P; float dist = length(toCam); vec3 V = toCam / max(dist, 1e-4);
        float near = 1. - smoothstep(30., 150., dist), mid = 1. - smoothstep(150., 600., dist);
        // flags and joints
        vec2 fp = P.xz / 120. + .5, fid = floor(fp), fl = abs(fract(fp) - .5) * 120.;
        float jd = 60. - max(fl.x, fl.y), wob = (vnoise(P.xz * .35) - .5) * .7;
        float joint = (1. - smoothstep(.55, 1.25, jd + wob)) * (1. - uEarth), fv = mix(hash21(fid), .35, uEarth);
        float n1 = vnoise(P.xz * .03 + fv * 20.), n2 = vnoise(P.xz * .37 + 5.), n3 = vnoise(P.xz * 2.6);
        // (the yard's earth is one even tone: only a slow drift of it and a fine grain, no patches)
        vec3 alb = mix(uStoneA, uStoneB, clamp(mix(n1 * .55 + n2 * .4 * mid + fv * .35 - .1, .34 + (n1 - .5) * .22 + (n2 - .5) * .12 * mid, uEarth), 0., 1.)) * mix(.72 + .56 * n3 * near, .9 + .2 * n3 * near, uEarth);
        alb *= 1. + (1. - uEarth) * (.3 * (vnoise(P.xz * .12 + 31.) - .5) + .34 * smoothstep(.6, .85, vnoise(P.xz * vec2(.05, .09) + fv * 9.)) * mid);   // granite: cloudy grain and paler veins
        // broom (or finger) arcs of fine silt, two families
        float r1 = length(P.xz - vec2(-310., 430.)), r2 = length(P.xz - vec2(390., 280.));
        float fam = smoothstep(.4, .6, vnoise(P.xz * .009 + 3.));
        float arcs = mix(vnoise(vec2(r1 * .33, 2.)) * .6 + vnoise(vec2(r1 * 1.3, 7.)) * .4 * near, vnoise(vec2(r2 * .33, 4.)) * .6 + vnoise(vec2(r2 * 1.3, 1.)) * .4 * near, fam);
        float sweep = smoothstep(.45, .8, arcs) * (.4 + .6 * vnoise(P.xz * .05 + 11.)), silt = sweep * (1. - smoothstep(70., 280., dist));
        alb *= 1. + silt * .85 * (1. - uEarth);                 // stone: pale silt left by the broom
        // earth: swept with four fingers in long arcs. Fine dark grooves in sets of four, crisp from near and gone
        // before they could shimmer; the earth between them is left plain
        float rq = (fam > .5 ? r2 : r1) * .19 + (vnoise(P.xz * .028 + 5.) - .5) * 1.1, gph = fract(rq), gfr = fract(gph * 8.) - .5;
        float gcut = step(gph, .5) * (1. - smoothstep(.3, 1.1, fwidth(rq) * 8.)) * uEarth, groove = (1. - smoothstep(.2, .62, abs(gfr) * 2.)) * gcut;
        alb *= 1. - .24 * groove;
        alb *= 1. + uEarth * (.1 * (vnoise(P.xz * .9 + 3.) - .5) * near + .2 * smoothstep(.62, .82, vnoise(P.xz * 4.3)) * (1. - smoothstep(12., 70., dist)));   // a few crumbs
        // where the sun has reached it the earth shows how it was swept and where it is still damp: broad arcs left
        // by the hand, darker patches that have not begun to dry (before sunrise it is one even dark mirror)
        float sunE = sunAt(P) * uEarth, damp = smoothstep(.42, .7, vnoise(P.xz * .017 + 50.) * .7 + vnoise(P.xz * .06 + 8.) * .3);
        alb *= 1. + sunE * ((arcs - .5) * .85 + .26 * (smoothstep(.2, .8, fract(rq * .5)) - .5) - .42 * damp);
        // on the stone the film has begun to dry where the sun is: paler, matt islands of dry granite among the wet
        float dryN = vnoise(P.xz * .031 + 90.) * .6 + vnoise(P.xz * .11 + 14.) * .28 + vnoise(P.xz * .43) * .12 + .12 * (arcs - .5);
        float dry = sunAt(P) * (1. - uEarth) * smoothstep(.5, .58, dryN) * (1. - joint);
        alb *= 1. + dry * (.2 + .25 * silt);
        // the kaavi: bands of red ochre painted by hand round the drawing, a broad one between two thin ones, with
        // a row of flour dots along the broad band
        float kq = max(abs(P.x), abs(P.z)) + (vnoise(P.xz * .045 + 9.) - .5) * 2.2 + (vnoise(P.xz * .4) - .5) * .5, kal = abs(P.x) > abs(P.z) ? P.z : P.x;
        float kband = smoothstep(108.5, 109.3, kq) * (1. - smoothstep(117.2, 118., kq)) + smoothstep(103.4, 103.9, kq) * (1. - smoothstep(105.3, 105.8, kq)) + smoothstep(121., 121.5, kq) * (1. - smoothstep(122.9, 123.4, kq));
        float brush = vnoise(vec2(kal * .07, kq * 2.2)) * .6 + vnoise(vec2(kal * .5, kq * 5.)) * .4;
        float kaavi = kband * (.66 + .34 * smoothstep(.2, .5, brush));
        alb = mix(alb, uKaavi * (.7 + .6 * brush) * (.85 + .3 * n3 * near), kaavi);
        float kdot = (1. - smoothstep(.95, 1.4, length(vec2(mod(kal + 4.5, 9.) - 4.5, kq - 113.3)))) * step(abs(kal), 110.);
        alb = mix(alb, uMoss * (.6 + .8 * n3), joint);
        vec2 fq = P.xz * 9.; float fleck = step(.975, hash21(floor(fq))) * (1. - smoothstep(.1, .22, length(fract(fq) - .5))) * (1. - smoothstep(12., 70., dist)) * (1. - joint);
        // the line: distance, s, sun-side caster
        vec2 uv = (P.xz + ${ue}.) / ${2*ue}.;
        float inb = step(abs(uv.x - .5), .498) * step(abs(uv.y - .5), .498);
        vec4 d0 = textureLod(uDTex, clamp(uv, 0., 1.), 0.);
        float dr = mix(${ve}., d0.r, inb), ls = d0.g;
        float bitten = 0., cb = 0.;
        for (int i = 0; i < 12; i++) { float on = step(.02, uBites[i].y);
          bitten = max(bitten, on * step(abs(ls - uBites[i].x), uBites[i].y * .8)); cb = max(cb, on * step(abs(d0.a - uBites[i].x), uBites[i].y * .8)); }
        float drawn = max(step(ls, -.5) * step(-1.5, ls), smoothstep(0., 6., uLand - ls) * step(-.5, ls) * (1. - bitten)) * inb;
        float contact = drawn * (1. - smoothstep(0., 5.5, dr));
        // what a laid ridge or a dot shades when the sun is on it
        float cdrawn = max(step(d0.a, -.5) * step(-1.5, d0.a), step(d0.a, uLand) * step(-.5, d0.a) * (1. - cb)) * inb;
        float len = mix(uShadowLen.x, uShadowLen.y, step(d0.a, -.5));
        float shadow = cdrawn * (1. - smoothstep(len * mix(.55, .45, uEarth), len, d0.b)) * smoothstep(.3, 1.3, d0.b + dr);      // crisp at the ridge, soft at its far end
        // rare: where the gust tore the line open, a fan of spilled flour lies downwind of the gap
        vec2 gd = P.xz - uGap.xy, gdir = normalize(uGustDir.xz + vec2(1e-4, 0.)); float al = dot(gd, gdir), ac = dot(gd, vec2(-gdir.y, gdir.x)), fw = 11. + max(al, 0.) * .42;
        float fan = uGap.z * smoothstep(-12., 4., al) * (1. - smoothstep(30., 84., al)) * exp(-ac * ac / (fw * fw)) * smoothstep(6., 13., length(P.xz - uGapDot));   // the dot the line went round stays clear in dark stone
        vec2 sg = P.xz * 5.3 + vnoise(P.xz * 2.) * 2.; float stray = step(1. - mix(.34, .17, uEarth) * exp(-dr * .4) * drawn - .6 * fan, hash21(floor(sg) + 3.)) * (1. - smoothstep(.14, .32, length(fract(sg) - .5))) * (1. - smoothstep(20., 110., dist));
        // festival: coloured powder floods the cells outward from their centres once the line has passed
        // (each is a low mound of powder: thick and bright at its heart, thinning to a ragged, grainy edge)
        float fill = 0., fh = 0.; vec3 fcol = vec3(0.); vec2 fdd = vec2(0.);
        if (uFest > .5) {
          float fn = (vnoise(P.xz * .33) - .5) * 3., fe = fn * .7 + (vnoise(P.xz * 1.3) - .5) * 2.6 + (vnoise(P.xz * 5.5) - .5) * 1.1;
          for (int i = 0; i < 17; i++) {
            vec4 c = uCells[i]; vec2 dd = P.xz - c.xy; float m = abs(dd.x) + abs(dd.y), rr = length(dd);
            float dia = step(9.5, c.w), edge = mix(min(13.6 - rr, (19.2 - m) * .707), (19.2 - m) * .707, dia) + fe;     // metres inside the cell's edge
            float prog = clamp((uHead - 132. - c.z) / 150., 0., 1.);
            float f = smoothstep(0., 2.2, edge) * (1. - smoothstep(prog * 21. - 2.5, prog * 21., rr + fn)) * step(.001, prog);
            int ci = int(mod(c.w, 3.) + .5);
            if (f > fill) { fill = f; fh = clamp(edge / 7.5, 0., 1.); fdd = dd / max(rr, .5); fcol = ci == 0 ? uCellCol[0] : (ci == 1 ? uCellCol[1] : uCellCol[2]); }
          }
          fill *= smoothstep(1.9, 3.3, dr) * inb * smoothstep(.25, .6, vnoise(P.xz * 4.3 + 7.) * .7 + vnoise(P.xz * 11. + 2.) * .3 + fh * 1.7);
          fcol = mix(fcol, vec3(dot(fcol, vec3(.3, .5, .2))), .24);
        }
        // wet film
        float pn2 = vnoise(P.xz * .017 + 70.) * .68 + vnoise(P.xz * .07 + 20.) * .32 + .1 * exp(-dr * .2) * drawn;
        float pud = smoothstep(.6, .63, pn2) * (1. - joint) * (1. - uEarth);                // flat puddles standing on the film (the earth is evenly wet: no puddles)
        float rim = (smoothstep(.57, .6, pn2) - smoothstep(.6, .64, pn2)) * (1. - joint) * mid * (1. - uEarth);
        float wv = vnoise(P.xz * .022 + 40.), wet = mix(.8 * (.7 + .3 * wv), .87 + .08 * wv, uEarth) * (1. - .7 * joint);
        wet = mix(wet, 1., pud) * (1. - fill * .95) * (1. - .4 * kaavi) * (1. - kdot) * (1. - .55 * dry * (1. - pud)); alb *= 1. - .3 * pud;
        float close = 1. - smoothstep(10., 55., dist), m1 = vnoise(P.xz * 9.), m2 = vnoise(P.xz * 9. + 23.);
        alb *= 1. + (m1 - .5) * mix(.5, .3, uEarth) * close;
        vec2 ad = (fam > .5 ? (P.xz - vec2(390., 280.)) / max(r2, 1.) : (P.xz - vec2(-310., 430.)) / max(r1, 1.)) * gfr * groove * .24;   // each groove tilts the sheen a little
        vec3 n = normalize(vec3((n3 - .5) * .05 * near + (m1 - .5) * .09 * close + ad.x, 1., (vnoise(P.xz * 2.6 + 9.) - .5) * .05 * near + (m2 - .5) * .09 * close + ad.y));
        vec3 R = reflect(-V, n); R.y = abs(R.y);
        float cosv = clamp(dot(V, n), 0., 1.), F = min(mix(mix(.085, .2, uEarth), 1., pow(1. - cosv, mix(3.7, 3., uEarth))), mix(.7, .8, uEarth)) * wet;   // the damp earth is a dark mirror, evenly wet
        F *= 1. - sunE * (1. - shadow) * (.74 - .62 * damp) * (.8 + .4 * arcs);                                                            // sunlit earth is earth-coloured, not a sheet of sky; its damp patches still shine a little
        vec3 refl = skyRefl(R) * (1. + .1 * pud) + uSkyLow * .16 * rim;
        // the pourer: a soft dark shape sliding over the stone ahead of the line
        vec2 pd = P.xz - uPourer.xy; float pn = vnoise(P.xz * .03 + uTime * .1);
        refl *= 1. - .6 * uPourer.z * exp(-dot(pd, pd) / (1500. + 900. * pn));
        // mirror of the veil, rope, ridge and dots: march the reflected ray over the distance texture
        float rl = max(length(R.xz), 1e-4), slope = R.y / rl; vec2 rd = R.xz / rl;
        float mir = 0., t = 1.4;
        for (int i = 0; i < 9; i++) {
          vec2 q = P.xz + rd * t; vec2 quv = (q + ${ue}.) / ${2*ue}.;
          float qin = step(abs(quv.x - .5), .498) * step(abs(quv.y - .5), .498);
          vec4 d = textureLod(uDTex, clamp(quv, 0., 1.), 0.);
          float h = t * slope, tau = (uHead - d.g) / 30., live = step(-.5, d.g);
          float top = clamp(60. - 8. * tau, 0., 60.), bot = max(60. - 25. * tau, 0.);
          float inLine = 1. - smoothstep(.8, 2. + t * .08, d.r);
          float veil = live * step(0., tau) * smoothstep(bot - 3., bot, h) * (1. - smoothstep(top - 5., top + .01, h)) * .62 * (1. - smoothstep(uVeilT.x, uVeilT.y, tau));
          float rope = live * step(0., tau) * step(tau, 2.4) * (1. - smoothstep(1., 4.5, abs(h - bot))) * .85;
          float ridge = max(step(d.g, -.5) * step(-1.5, d.g) * (1. - smoothstep(1.6, 2.6, h)), live * smoothstep(0., 6., uLand - d.g) * (1. - smoothstep(1., 1.9, h)));
          mir = max(mir, inLine * qin * max(max(veil, rope), ridge * .8));
          t *= 1.55;
        }
        mir *= 1. - smoothstep(.34, .66, cosv);                                                        // looking steeply down there is no curtain in the film, only sky
        refl = mix(refl, uFlour * (skyLight(vec3(0., .5, .6)) * .8 + uSunCol * sunAt(P) * .5), mir * .85);
        // the falling line itself: a pale streak of reflection that runs from the foot of the fall toward us
        { vec2 Df = uFoot.xy - P.xz; float dhf = max(length(Df), 1.), latf = rd.x * Df.y - rd.y * Df.x, hf = dhf * slope, wf = 2.6 + dhf * .02 + hf * .13;
          float wav = (vnoise(vec2(P.x * .21 + P.z * .13, P.z * .19 - uTime * .22)) - .5) * (1.2 + dhf * .03), lw2 = (latf + wav) * (latf + wav) / (wf * wf);
          float colm = step(0., dot(rd, Df)) * (exp(-lw2) + .3 * exp(-lw2 / 12.)) * (1. - smoothstep(34., 74., hf)) * smoothstep(3., 16., dhf);
          colm *= .68 + .32 * vnoise(vec2(latf * .7 + 3., hf * .22 + uTime * 1.6));
          refl = mix(refl, uFlour * (skyLight(vec3(0., .5, .6)) * 1.12 + uSunCol * sunAt(P) * .5), min(colm * uFoot.z * .95, .95)); }
        // the house: its lime-washed step stands in the wet stone as pale and ochre upright bands, drawn out toward us
        // and wavering with the film (uStep: the riser's z, its height, the width of a band, how strongly)
        { float rz = min(R.z, -1e-3), ts = (uStep.x - P.z) / rz; vec3 hs = P + R * ts;
          hs.x += (vnoise(vec2(P.x * .09 + 5., P.z * .07 - uTime * .12)) - .5) * (1.5 + ts * .05) + (vnoise(vec2(P.x * .5, P.z * .4 + uTime * .3)) - .5) * ts * .012;
          float ph = hs.x / uStep.z + .5, bi = floor(ph), wj = (hash21(vec2(bi, 3.)) - .5) * .3, tri = abs(fract((ph + wj) * .5) - .5) * 2., bth = mix(.5, .76, hash21(vec2(floor(ph * .5), 9.)));
          float band = smoothstep(bth - .06, bth + .06, tri), sof = 1. + ts * .012;
          float mR = step(R.z, -.02) * step(uStep.x, P.z) * smoothstep(-.6 * sof, .8 * sof, hs.y) * (1. - smoothstep(uStep.y - 2.2 * sof, uStep.y + .6 * sof, hs.y));
          float sunS = sunAt(hs);
          vec3 lw = mix(uLime * 1.12, uOchre * .9, band) * (skyLight(vec3(0., .15, 1.)) + uSunCol * sunS * .95) * (.55 + .45 * smoothstep(0., 9., hs.y));
          lw = mix(lw, uSkyLow * .5, smoothstep(360., 1150., dist + ts));
          // the film is not glass: every white band runs on toward us as a pale streak, breaking up as it thins
          float tl = max(hs.y - uStep.y, 0.) / (uStep.y * 2.4), brk = vnoise(vec2(hs.x * .33, P.z * .06 - uTime * .25)) * .6 + vnoise(vec2(hs.x * .9 + 4., P.z * .17 + uTime * .2)) * .4;
          float tail = step(R.z, -.02) * step(uStep.x, P.z) * step(uStep.y, hs.y) * (1. - band) * exp(-tl * .9) * (1. - smoothstep(.9, 2.2, tl)) * smoothstep(.15 + .4 * tl, .45 + .4 * tl, brk + .3) * (1. - smoothstep(300., 900., dist + ts));
          refl = mix(refl, lw * (1. + .25 * step(mR, tail)), min(max(mR * .95, tail * .9), 1.) * uStep.w);
          // above it the sunlit door: a warm upright glow in the wet once the sun is on the house
          float td = (uStep.x - 70. - P.z) / rz; vec3 hd = P + R * td;
          float mD = step(R.z, -.02) * step(uStep.x, P.z) * smoothstep(uStep.y + 2., uStep.y + 9., hd.y) * (1. - smoothstep(60., 190., hd.y)) * (1. - smoothstep(92., 112., abs(hd.x))) * smoothstep(7., 12., abs(hd.x));
          refl += uSunCol * vec3(.5, .3, .16) * sunAt(hd) * mD * uStep.w * .5; }
        // light: the blue hour (the stone keeps its own colour under it), then the lamps, then the sun
        vec3 up = vec3(0., 1., 0.), sl0 = skyLight(up);
        vec3 slf = mix(sl0, vec3(dot(sl0, vec3(.3, .5, .2))), .45) * 1.1; sl0 = mix(sl0, vec3(dot(sl0, vec3(.3, .5, .2))), .46 + .16 * uEarth);
        float sun = sunAt(P);
        vec3 dif = alb * sl0 * (1. - .5 * contact) * mix(1., mix(.58, 1., sun), uEarth);              // damp earth is dark until the sun is on it
        vec3 flourLit = uFlour * slf * .95;
        vec3 powder = fcol * sl0 * (.24 + .62 * fh + .62 * fh * fh) * (.82 + .3 * n3 + .3 * (m1 - .5) * close) * (1. - .35 * contact) * (.84 + .32 * vnoise(P.xz * 1.3 + 11.));
        powder *= 1. + (.5 * fdd.x - .16 * fdd.y) * (1. - fh * fh) * smoothstep(0., .2, fh);                               // a heap: its slope toward the pale east is lighter, the other darker
        powder *= 1. + .4 * sun * fdd.x * (1. - fh);                                                    // the mound's sunward slope
        dif = mix(dif, powder, fill);
        dif = mix(dif, flourLit, max(stray, kdot) * (1. - fill));
        float splay = 1. / (1. + max(al, 0.) * .035);
        float fst = smoothstep(.38, .7, vnoise(vec2(ac * .8 * splay, al * .04 + 3.)) * .58 + vnoise(vec2(ac * 2.3 * splay + 5., al * .1)) * .26 + vnoise(P.xz * 1.7) * .16);      // thrown out in streaks that splay downwind
        float dust = min(sqrt(fan) * (.07 + 1.45 * fst) + fan * .6 * smoothstep(.58, .72, vnoise(P.xz * .45 + 17.)), 1.) * step(.002, fan);   // and in clumps
        vec2 e0 = P.xz - uGapEnds.xy, e1 = P.xz - uGapEnds.zw; float hw = (vnoise(P.xz * .9 + 5.) - .5) * 1.4;
        float heap = max(uGapK.x * (1. - smoothstep(1.4, 4.4, length(e0) + hw)), uGapK.y * (1. - smoothstep(1.4, 4.4, length(e1) + hw)));          // each loose end finishes in a small heap
        dust = max(dust, heap);
        dif = mix(dif, flourLit * (1. + .22 * heap), dust);
        vec3 col = dif * (1. - F * .85 * (1. - dust)) + refl * F * (1. - dust);
        col += uSkyLow * fleck * .22;                                                                   // mica takes the sky before it takes the sun
        // the lamps on the step stand in the wet stone as long wavering streaks
        float lampS = 0.;
        for (int i = 0; i < 11; i++) {
          vec3 Lp = uLamps[i].xyz; vec2 D = Lp.xz - P.xz; float dh = max(length(D), 1.), lat = rd.x * D.y - rd.y * D.x, sl = Lp.y / dh, w = .9 + dh * .016, sg = .04 + .4 * sl;
          lampS += uLamps[i].w * step(0., dot(rd, D)) * exp(-lat * lat / (w * w)) * exp(-(slope - sl) * (slope - sl) / (sg * sg)) * (1. - smoothstep(.45, .7, sl));
        }
        col += uLampCol * lampS * 1.5 * wet * max(F, .3) * (1. - dust) * (.75 + .5 * m1);
        // sunrise. Lit ground is the same stone (or earth) lifted and a little warmed; what a ridge or a dot shades is a
        // darker, cooler tone of it; the lit flank of each ridge throws a little of its peach back on the ground.
        float lightK = 1. - shadow, bright = max(max(fill, dust), max(stray, kdot));
        vec3 liftC = mix(mix(vec3(1.62, 1.45, 1.25), vec3(1.3, 1.13, .78), uEarth), vec3(1.3, 1.17, 1.), bright), shadeC = mix(vec3(.86, .85, .92), vec3(.74, .82, 1.06), uEarth);     // (on the earth: a warm olive-brown in the sun, long blue shadows)
        col *= mix(vec3(1.), mix(shadeC, liftC, lightK), sun);
        float bounce = drawn * exp(-max(dr - 1.2, 0.) * .4) * smoothstep(dr + .6, dr + 3.6, d0.b);
        col += mix(uSunCol, uPeach, .5) * sun * lightK * (.24 * bounce + .012 + .012 * n1);
        vec3 sdir = normalize(uSunDir + vec3(0., .1, 0.));
        col += uSunCol * sun * lightK * (fleck * .9 + F * (.22 * smoothstep(-.2, .9, R.x) + 1.5 * pow(max(dot(R, sdir), 0.), 40.)));        // mica flashes, and the sun's own path in the film
        vec2 sq = P.xz * .7 + 13.; float sph = hash21(floor(sq)), sparkle = step(.968, sph) * (1. - smoothstep(.1, .25, length(fract(sq) - .5))) * (.5 + .5 * sin(uTime * (2. + 3. * sph) + sph * 60.));
        col += uGoldCol * 1.7 * sparkle * uGold * sun * lightK * (1. - joint) * (1. - smoothstep(120., 420., dist));                         // gold sparks in the lit stone
        float edgeD = (P.x + .14 * P.z - uSunEdgeX) / 17.;
        col += (uSunCol * .5 + uGoldCol * .5) * uSun * exp(-edgeD * edgeD) * (.085 + .1 * fleck + .05 * n3 * near) * lightK;   // the sun's edge: a soft glowing band
        // dawn mist streaming low over the wet ground with the wind: soft streaks, none over the knot; seen from
        // above it thins to nothing; where the sun has reached, it lights up
        vec2 mq = vec2(dot(P.xz, uGustDir.xz), dot(P.xz, vec2(-uGustDir.z, uGustDir.x))) * vec2(.016, .07) - vec2(uTime * .22, uTime * .02);
        float mist = smoothstep(.54, .74, vnoise(mq) * .45 + vnoise(mq * 2.9 + 7. + vec2(uTime * .25, -uTime * .1)) * .55) * smoothstep(80., 150., length(P.xz)) * (1. - smoothstep(450., 850., dist)) * (1. - .45 * smoothstep(.8, 1., uLand / uL)) * (1. - .78 * smoothstep(.22, .62, V.y)) * (1. - .8 * uEarth);
        col = mix(col, mix(uSkyLow * .82, uSunCol * 1.15 + uPeach * .35, sun * .85), mist * (.3 + .22 * sun));
        // gold glint streak in the stone
        // (it lies where the film shows the glint to this eye: on the line from us to the point under it, narrow, drawn out toward us)
        vec2 gc = mix(cameraPosition.xz, uGlintAt.xz, clamp(cameraPosition.y / max(cameraPosition.y + uGlintAt.y, 1.), 0., 1.));
        vec2 gv = P.xz - gc, gdv = uGlintAt.xz - cameraPosition.xz; gdv /= max(length(gdv), 1e-3);
        float along = dot(gv, gdv), gp2 = max(dot(gv, gv) - along * along, 0.), gw = .8 + length(P.xz - cameraPosition.xz) * .012;
        col += uGoldCol * uGlint * 2.2 * exp(-gp2 / (gw * gw)) * exp(-along * along / 1500.) * smoothstep(8., 40., length(P.xz - cameraPosition.xz)) * wet;
        gl_FragColor = vec4(col, 1.);
        ${ce}
      }`}),d=new o.Mesh(G,P);return d.frustumCulled=!1,d.name="kolam-ground",d.renderOrder=-.5,d}async function Ee(a,g,G,P,d,C,S){const v=[],z=[],h=[],x=[],t=(l,T,m,y,J,Z,W,D,E,R)=>{const X=v.length/3,I=5,Q=Math.cos(y),U=Math.sin(y);for(let N=0;N<=I;N++){const V=N/I,O=W*Math.sin(Math.PI*Math.min(1,V*.8+.18))*(1-.75*V*V*V),$=J-D*V,de=Z*V*Math.cos($*.5+.2),ie=Z*V*Math.sin(J)-D*Z*.35*V*V;for(let A=-1;A<=1;A++){const ne=de,ae=A*O,le=ie+(A===0?0:W*.22);v.push(l+ne*Q-ae*U,T+le,m+ne*U+ae*Q);const se=(.72+.28*V)*(A===0?.82:1);z.push(K(E.r,R.r,V*V)*se,K(E.g,R.g,V*V)*se,K(E.b,R.b,V*V)*se),h.push(V,y*7.3+l)}if(N<I){const A=X+N*3;x.push(A,A+3,A+1,A+1,A+3,A+4,A+1,A+4,A+2,A+2,A+4,A+5)}}},s=new o.Color(C[5]),e=new o.Color("#e0701c"),f=new o.Color("#8f300a"),c=new o.Color("#f0c63a"),r=new o.Color("#5d7d2c"),i=[],w=(l,T,m,y,J,Z,W,D,E)=>{const R=v.length/3,X=4,I=Math.cos(y),Q=Math.sin(y),U=Math.cos(J),N=Math.sin(J);for(let V=0;V<=X;V++){const O=V/X,$=W*(.35+.65*Math.sin(Math.PI*Math.min(1,O*.62+.12)))*(V===X?.72:1),de=Z*O,ie=.55*Z*O*O*O;for(let A=-1;A<=1;A++){const ne=V===X?A===0?-.1*Z:.03*Z:0,ae=(de+ne)*U-ie*N*.4,le=(de+ne)*N-ie*U+(A===0?-.12*W:.1*W)*(1-.5*O),se=A*$;v.push(l+ae*I-se*Q,T+le,m+ae*Q+se*I);const re=(.42+.58*O)*(A===0?.86:1);z.push(K(D.r,E.r,O*O)*re,K(D.g,E.g,O*O)*re,K(D.b,E.b,O*O)*re),h.push(O,y*7.3+l)}if(V<X){const A=R+V*3;x.push(A,A+3,A+1,A+1,A+3,A+4,A+1,A+4,A+2,A+2,A+4,A+5)}}};for(const l of a.dots){const T=Math.round((Math.abs(l[0])+Math.abs(l[1]))/ee);if(T===2){const m=d()<.5?s:e,y=d()*6.28,J=v.length/3;for(let Z=0;Z<9;Z++){const W=Z/8,D=Math.round(27-19*W),E=.04+1.36*Math.pow(W,.85),R=4.9-3.5*W,X=1.7+2.5*Math.sin(W*1.5),I=f.clone().lerp(e,.25+.5*W),Q=m.clone().lerp(c,.15+.6*W*W);for(let U=0;U<D;U++){const N=.82+.3*d();w(l[0],X,l[1],y+(U+(Z&1)*.5+(d()-.5)*.35)/D*6.2832,E+(d()-.5)*.16,R*(.86+.28*d()),.62+.22*(1-W),I.clone().multiplyScalar(N),Q.clone().multiplyScalar(N))}}i.push([J,v.length/3,l[0],1.2,l[1]]),await S.yield()}else if(T===0){const m=d()*6.28;for(let y=0;y<5;y++)t(l[0],2.3,l[1],m+y*1.2566,.42,8.2,3.3,.75,s,c),t(l[0],2.2,l[1],m+(y+.5)*1.2566,.1,5.2,.8,.3,r,r);for(let y=0;y<9;y++)t(l[0],2.6,l[1],y*.698,1.25,2.6,.45,.2,e,c)}}await S.yield();const L=new o.BufferGeometry;L.setAttribute("position",new o.Float32BufferAttribute(v,3)),L.setAttribute("color",new o.Float32BufferAttribute(z,3)),L.setAttribute("aT",new o.Float32BufferAttribute(h,2)),L.setIndex(x),L.computeVertexNormals();{const l=L.getAttribute("normal").array;for(const[T,m,y,J,Z]of i)for(let W=T;W<m;W++){let D=l[W*3],E=l[W*3+1],R=l[W*3+2];E<0&&(D=-D,E=-E,R=-R);const X=v[W*3]-y,I=v[W*3+1]-J,Q=v[W*3+2]-Z,U=Math.hypot(X,I,Q)||1;D=D*.4+X/U*.6,E=E*.4+I/U*.6,R=R*.4+Q/U*.6;const N=Math.hypot(D,E,R)||1;l[W*3]=D/N,l[W*3+1]=E/N,l[W*3+2]=R/N}}const u=new o.Mesh(L,new o.ShaderMaterial({fog:!0,side:o.DoubleSide,uniforms:{...fe(),...g},vertexShader:`
      #include <fog_pars_vertex>
      ${te}
      attribute vec3 color; attribute vec2 aT; varying vec3 vW, vN, vC;
      void main(){
        vec3 p = position; p.y += sin(uTime * 2.3 + aT.y + aT.x * 4.) * .16 * aT.x * aT.x;     // petal tips shiver
        vec4 wp = modelMatrix * vec4(p, 1.); vW = wp.xyz; vN = mat3(modelMatrix) * normal; vC = color;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition; ${he}
      }`,fragmentShader:`
      #include <fog_pars_fragment>
      ${te}
      varying vec3 vW, vN, vC;
      void main(){
        vec3 n = normalize(vN + vec3(0., 1e-3, 0.)); if (n.y < 0.) n = -n;
        float sun = sunAt(vW);
        float rib = vnoise(vW.xz * 2.3 + vW.y * 1.7) * .6 + vnoise(vW.xz * 7. + vW.y * 5.) * .4;
        vec3 col = vC * (.62 + .6 * rib) * (skyLight(n) * 1.15 + uSunCol * sun * (max(dot(n, uSunDir), 0.) * 1.4 + .35));
        gl_FragColor = vec4(col, 1.); ${ce}
      }`}));u.name="kolam-festival-flowers",u.frustumCulled=!1;const p=[],b=[],q=[],k=[];G.forEach((l,T)=>{const m=P[Math.round(l.w)%3];for(let y=0;y<3;y++){const J=y*1.047+T,Z=Math.cos(J)*7.5,W=Math.sin(J)*7.5,D=p.length/3;for(const[E,R]of[[-1,0],[1,0],[1,1],[-1,1]])p.push(l.x+Z*E,R*58,l.y+W*E),b.push(m.r,m.g,m.b),q.push(E,R,l.z,T*3.7+y);k.push(D,D+1,D+2,D,D+2,D+3)}});const M=new o.BufferGeometry;M.setAttribute("position",new o.Float32BufferAttribute(p,3)),M.setAttribute("color",new o.Float32BufferAttribute(b,3)),M.setAttribute("aQ",new o.Float32BufferAttribute(q,4)),M.setIndex(k);const _=new o.Mesh(M,new o.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:o.DoubleSide,uniforms:{...fe(),...g},vertexShader:`
      #include <fog_pars_vertex>
      ${te}
      attribute vec3 color; attribute vec4 aQ; varying vec3 vC, vW; varying vec4 vQ; varying float vProg;
      void main(){
        vProg = clamp((uHead - 132. - aQ.z) / 150., 0., 1.);
        vec3 p = position; p.xz += vec2(sin(uTime * .9 + aQ.w), cos(uTime * .7 + aQ.w)) * 2.5 * aQ.y;
        vec4 wp = modelMatrix * vec4(p, 1.); vW = wp.xyz; vC = color; vQ = aQ;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition; ${he}
      }`,fragmentShader:`
      #include <fog_pars_fragment>
      ${te}
      varying vec3 vC, vW; varying vec4 vQ; varying float vProg;
      void main(){
        float on = smoothstep(0., .08, vProg) * (1. - smoothstep(.8, 1., vProg));
        float fall = vQ.y * 58. + uTime * 11.;
        float st = vnoise(vec2(vQ.x * 6. + vQ.w, fall * .07)) * .6 + vnoise(vec2(vQ.x * 17. + vQ.w, fall * .2)) * .4;
        float a = on * (1. - vQ.x * vQ.x) * smoothstep(.3, .8, st) * (1. - smoothstep(.55, 1., vQ.y)) * .5;
        // a fall is a thin sheet of powder: seen from the side it is a streaked curtain; looked down on, from above the
        // knot, it thins to a haze over its cell (it must not stand up the picture as a solid stripe across ridge and
        // stone), and in the sun it pales
        float sun = sunAt(vW), down = smoothstep(.12, .4, normalize(cameraPosition - vec3(vW.x, 0., vW.z) + vec3(0., 1e-3, 0.)).y);     // (how steeply we look down on the foot of the fall, so the whole height of the sheet thins together)
        a *= (1. - .92 * down) * (1. - .3 * sun);
        if (a < .004) discard;
        gl_FragColor = vec4(mix(vC, vec3(dot(vC, vec3(.3, .5, .2))), .25 * sun) * (skyLight(vec3(0., .6, .5)) * .9 + uSunCol * sun * .5), a * .8); ${ce}
      }`}));return _.name="kolam-festival-falls",_.frustumCulled=!1,_.renderOrder=4,{flowers:u,falls:_}}function We(a){const g=new o.Mesh(new o.PlaneGeometry(2,2),new o.ShaderMaterial({transparent:!0,depthWrite:!1,blending:o.AdditiveBlending,uniforms:a,vertexShader:`
      uniform vec4 uPourer; uniform float uGlint; varying vec2 vC;
      uniform vec3 uGlintAt;
      void main(){ vC = position.xy; vec4 mv = viewMatrix * modelMatrix * vec4(uGlintAt, 1.);
        mv.xy += position.xy * min(5. + 5. * uGlint, -mv.z * .06) * step(.003, uGlint); gl_Position = projectionMatrix * mv; }`,fragmentShader:`
      uniform vec3 uGoldCol; uniform float uGlint; varying vec2 vC;
      void main(){ float r2 = dot(vC, vC); float star = exp(-r2 * 9.) * 1.6 + exp(-abs(vC.y) * 26.) * exp(-abs(vC.x) * 2.6) + exp(-abs(vC.x) * 26.) * exp(-abs(vC.y) * 4.) * .6;
        gl_FragColor = vec4(uGoldCol * star * uGlint * 4.5 * (1. - smoothstep(.6, 1., r2)), 1.); }`}));return g.frustumCulled=!1,g.renderOrder=8,g.name="kolam-glint",g}async function _e(a,g={}){const G=a.rng.fork?a.rng.fork("kolam-hero"):a.rng,P=a.noise,d=a.vary||{},C=g.detail??a.quality?.detail??1,S=(g.palette&&g.palette.length>=7?g.palette:Me).slice(),v=Math.floor(G()*3)%3;let z=g.look??(d.hour==="day"?1:d.hour==="golden"?2:d.hour==="dawn"||d.hour==="night"?0:v);typeof z=="string"&&(z=Math.max(0,["loop","festival","yard"].indexOf(z)));const h=g.rare??!!d.rare,x=z===2?Pe(G):Se(G),t=Ce(x,G,P,z,h&&z!==2),s=t.L;await a.yield();const{kTex:e,dTex:f}=await Te(t,a);await a.yield();const c=n=>new o.Color(n),r=(n,B,j)=>c(n).lerp(c(B),j),i=(G()-.5)*.12,w=r(S[1],"#5a4fa0",.18+i),L=c(S[2]),u=c(S[0]).multiplyScalar(.42);let p=r(S[0],"#2c2723",.5).multiplyScalar(1.02),b=r(S[1],"#625a50",.55).multiplyScalar(.86),q=c("#22401f");z===2&&(p=c("#3a2f20"),b=c("#5a4a2e"),q=c("#3a3a1c"));const k=[r("#d6557c",S[6],.25),c(S[5]),c("#5f9a3c")],M=[],_=Math.floor(G()*3)%3,l=(n,B)=>{let j=0;for(let H=0;H<F;H+=4)Math.abs(t.X[H]-n)+Math.abs(t.Z[H]-B)<30&&(j=Math.max(j,H*t.ds));return j};for(const n of t.dots){const B=Math.round((Math.abs(n[0])+Math.abs(n[1]))/ee);M.push(new o.Vector4(n[0],n[1],l(n[0],n[1]),(B+_)%3))}for(const n of[-1,1])for(const B of[-1,1])M.push(new o.Vector4(n*20,B*20,l(n*20,B*20),12+(_+2)%3));await a.yield();const T=[];for(let n=0;n<12;n++)T.push(new o.Vector2(0,0));const m={uTime:{value:0},uLand:{value:0},uHead:{value:72},uL:{value:s},uDs:{value:t.ds},uClosed:{value:t.closed?1:0},uSun:{value:0},uSunEdgeX:{value:300},uSunDir:{value:new o.Vector3(.99,.06,.12).normalize()},uSunCol:{value:c(S[4]).multiplyScalar(1)},uPeach:{value:c(S[4])},uGoldCol:{value:c(S[5])},uSkyTop:{value:w},uSkyLow:{value:L},uHouse:{value:u},uFlour:{value:c(S[3]).multiplyScalar(.86)},uStoneA:{value:p},uStoneB:{value:b},uMoss:{value:q},uKTex:{value:e},uDTex:{value:f},uBites:{value:T},uVeilK:{value:1},uVeilT:{value:z===2?new o.Vector2(1.7,3.9):new o.Vector2(4.2,8.2)},uGust:{value:0},uGustDir:{value:new o.Vector3(-.97,0,-.243)},uRope:{value:1},uGlint:{value:0},uGold:{value:0},uPourer:{value:new o.Vector4(0,0,1,0)},uShadowLen:{value:z===2?new o.Vector2(19,16):new o.Vector2(14.5,14)},uPxK:{value:.004},uGap:{value:new o.Vector4(0,0,0,0)},uKaavi:{value:c("#8f3320")},uRose:{value:c("#d48a92")},uGapDot:{value:new o.Vector2(1e4,1e4)},uGapEnds:{value:new o.Vector4(1e4,1e4,1e4,1e4)},uGapK:{value:new o.Vector2(0,0)},uLampCol:{value:c("#ff9a3c")},uLamps:{value:Array.from({length:11},()=>new o.Vector4(0,30,-1e4,0))},uDawn:{value:0},uGlintAt:{value:new o.Vector3(0,66,0)},uFoot:{value:new o.Vector4(0,0,1,0)},uStep:{value:new o.Vector4(-200,24,20,0)},uLime:{value:c("#b6bac2")},uOchre:{value:c("#743f36")},uEarth:{value:z===2?1:0},uFest:{value:z===1?1:0},uCells:{value:M},uCellCol:{value:k}},y=new o.Group;y.name="kolam-at-dawn-hero";const J=await Ae(t,m,a,P);y.add(J),await a.yield();const{rope:Z,veil:W}=Le(m);y.add(W,Z),await a.yield();const D=Fe(m,G,C);y.add(D),await a.yield();const E=We(m);y.add(E);let R=null;g.ground!==!1&&(R=De(m,g.groundSize||2400),y.add(R)),await a.yield();const X=await Ee(t,m,M,k,G,S,a);X.flowers.visible=X.falls.visible=z===1,y.add(X.flowers,X.falls),await a.yield();const I=(n,B=new o.Vector3)=>{let j=n/t.ds;j=t.closed?(j%F+F)%F:pe(j,0,F-1);const H=Math.floor(j),oe=t.closed?(H+1)%F:Math.min(H+1,F-1),ye=t.ID[H]===t.ID[oe]?j-H:0;return B.set(K(t.X[H],t.X[oe],ye),0,K(t.Z[H],t.Z[oe],ye))},Q=n=>s*(t.frac+(1-t.frac)*(n/.74));let U=Q(0),N=!1,V=!1,O=!1;const $=new o.Vector3,de=new o.Vector2,ie=n=>{U=n,m.uHead.value=n+72,m.uLand.value=Math.min(n,t.closed?s+10:s),I(Math.min(n+72,s),$);const B=Y(s-20,s+60,n);m.uPourer.value.set($.x+14,$.z+26,1-B,0),O||m.uGlintAt.value.set($.x+14,66,$.z+26),m.uRope.value=1-.85*Y(s-110,s-10,n),I(Math.min(n,s),$),m.uFoot.value.set($.x,$.z,1-Y(s-60,s-5,n),0),m.uGust.value=t.gap?Y(t.gap.s0-105,t.gap.s0-25,n)*(1-Y(t.gap.s1+60,t.gap.s1+175,n)):0,t.gap&&(m.uGap.value.z=Y(t.gap.s0-30,t.gap.s1+20,n),m.uGapK.value.set(Y(t.gap.s0-2,t.gap.s0+10,n),Y(t.gap.s1+2,t.gap.s1+14,n)))},A=(n,B)=>{m.uSun.value=n,B!==void 0&&(m.uSunEdgeX.value=B)},ne=n=>{m.uGlint.value=n},ae=n=>{ie(Q(n));const B=n<.675?K(290,110,pe((n-.66)/.015,0,1)):n<.765?K(110,-110,(n-.675)/.09):K(-110,-320,pe((n-.765)/.03,0,1));A(Y(.655,.675,n),B),ne(Y(.188,.196,n)*(1-Y(.2,.222,n))),m.uGold.value=Y(.67,.74,n)*(1-.75*Y(.86,.98,n))};if(t.gap){I((t.gap.s0+t.gap.s1)/2,$),m.uGap.value.set($.x,$.z,0,0),I(t.gap.s0,$),m.uGapEnds.value.x=$.x,m.uGapEnds.value.y=$.z,I(t.gap.s1,$),m.uGapEnds.value.z=$.x,m.uGapEnds.value.w=$.z;let n=1e9;for(const B of t.dots){const j=Math.hypot(B[0]-$.x,B[1]-$.z);j<n&&(n=j,m.uGapDot.value.set(B[0],B[1]))}}ae(0);const le=[],se=Q(.05)-30,re=new o.Vector3,we=22;for(let n=se;n<=se+300.01;n+=25){let B=0,j=0,H=0;for(let oe=-we;oe<=we;oe+=2)I(Math.min(n+oe,s-.01),re),B+=re.x,j+=re.z,H++;le.push([B/H,8,j/H])}const xe=I(Q(.28)+24,new o.Vector3);xe.y=20;const ke=[[-30,8,185],[-30,8,150],...le,[55,30,180],[30,62,240],[-25,90,262],[-60,104,235],[-35,63,112],[-10,22,-10],[8,9,-75],[4,20,-150],[0,34,-210],[0,34,-270]],ze={entry:new o.Vector3(-30,8,185),entryHeading:new o.Vector3(0,0,-1),portalSeat:{position:new o.Vector3(0,34,-270),facing:new o.Vector3(0,0,1)},flyThrough:ke,chase:le,center:new o.Vector3(0,0,0),dots:t.dots.map(n=>new o.Vector3(n[0],0,n[1])),gap:t.gap?{s0:t.gap.s0,s1:t.gap.s1,at:I((t.gap.s0+t.gap.s1)/2)}:null,viewpoints:{lookDown:new o.Vector3(-60,104,235),lowPass:new o.Vector3(8,9,-75),under:xe}};return{object:y,radius:80,height:44,center:new o.Vector3(0,6,0),anchors:ze,ground:!1,groundY:0,look:z,lookName:["loop","festival","yard"][z],rare:!!t.gap,L:s,frac:t.frac,uniforms:m,distTex:f,kTex:e,curve:{X:t.X,Z:t.Z,W:t.W,ds:t.ds,L:s,closed:t.closed,count:F},info:{turnedBack:x.turned,loops:x.loops,strokes:x.strokes.length},pointAt:I,landAt:Q,landing(n=new o.Vector3){return I(Math.min(U,s),n)},setProgress(n){N=!0,V=!1,ae(n)},setLand(n){V=!0,ie(n)},setSun:A,setGlint:ne,setGlintAt(n,B,j){O=!0,m.uGlintAt.value.set(n,B,j)},setBite(n,B,j){n>=0&&n<12&&T[n].set(B,j)},update(n,B,j){if(m.uTime.value=B,!N){const H=(.05+B*.0225)%.96;if(ae(H),H>.8&&!V){const oe=Y(.8,.9,H);T[0].set(s*.31,7*oe),T[1].set(s*.64,6*oe)}else V||(T[0].set(0,0),T[1].set(0,0))}if(j){let H=900;a.renderer&&a.renderer.getDrawingBufferSize&&(H=a.renderer.getDrawingBufferSize(de).y||900),m.uPxK.value=.85*2/(Math.max(.2,j.projectionMatrix.elements[5])*H)}},dispose(){e.dispose(),f.dispose()}}}export{te as GLSL_COMMON,_e as buildHero};
