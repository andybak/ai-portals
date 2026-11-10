import*as a from"three";import{mergeGeometries as ge}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as $,lerp as Q,smoothstep as X,makeNoise as we}from"../kit/core.js";const U=Math.PI*2,le=["#E6DCC3","#EADFC6","#F2C566","#7C8F5E","#C8642A","#5B5A6B","#3A3B33"];function ee(e,s={}){const o=s.height??e.range(5,8),h=(s.thick??(.3+.1*o)*e.range(.92,1.1))*.5,M=.8+.2*Math.min(1,o/6),T=[];let y=s.fallen?.02:e.range(.3,.45);for(;y<o+.9;)T.push({w:y,s:1+$(e.gauss()*.03,-.055,.06),ox:e.gauss()*(s.fallen?.034:.022),oz:e.gauss()*(s.fallen?.034:.022),g:e()<.3?e.range(.008,.02):e.range(.03,.06)}),y+=e.range(.25,.5)*M;const L=o<2.6;return{H:o,r0:h,drums:T,young:L,taper:s.taper??(L?e.range(.8,.92):e.range(.5,.7)),lean:(s.lean??e.range(3,9))*Math.PI/180,leanAz:s.leanAz??e.range(0,U),curve:s.curve??e.range(-.2,.5),flare:s.flare??(s.fallen?0:L?e.range(.2,.34):e.range(.6,.95)),toes:e.int(4,7),toePh:e()*U,lobeA:[e.range(.07,.15),e.range(.04,.09),e.range(.02,.045)],lobeP:[e()*U,e()*U,e()*U],twist:e.range(-.12,.12),top:s.top??(L?"dome":e.pick(["slant","notch","hollow"])),topAz:s.topAz??e()*U,topSlope:e.range(.7,2.1),notchAz:s.notchAz??e()*U,notchW:e.range(.55,.95),notchD:e.range(.07,.13)*o,hollowD:e.range(.07,.12)*o,seed:e()*97,baseCap:!!s.baseCap||!!s.fallen}}function ue(e,s){const{H:o,r0:h,drums:M}=e;let T=0;const y=h*e.taper,L=Math.cos(e.leanAz),p=Math.sin(e.leanAz),x=Math.tan(e.lean),D=r=>{for(;T>0&&M[T].w>r;)T--;for(;T<M.length-1&&M[T+1].w<=r;)T++;return T},w=(r,c)=>(.045*Math.sin(c-e.lobeP[0]+r*.9)+.035*s.n3(Math.cos(c)*.8+e.seed,r*.5,Math.sin(c)*.8))*Math.min(1,Math.max(r,0)/.8),f={x:0,y:0,z:0,ao:1},A=(r,c,v)=>{const F=Math.max(r,0),O=$(r/o,0,1);let B=h*(1-(1-e.taper)*Math.pow(O,1.5));B*=1+e.flare*.42*Math.exp(-F/.6);const I=Math.pow(Math.abs(Math.sin(c*e.toes*.5+e.toePh)),.6)-.6;if(B*=1+e.flare*.26*Math.exp(-F/.9)*I,B*=1+.06*Math.sin(r*.85+e.seed*3)*Math.min(1,F),B*=1+e.lobeA[0]*Math.cos(2*c+e.lobeP[0]+e.twist*r)+e.lobeA[1]*Math.cos(3*c+e.lobeP[1]-e.twist*1.7*r)+e.lobeA[2]*Math.cos(5*c+e.lobeP[2]+r*.3),B*=1+.075*s.n3(Math.cos(c)*1.1+e.seed,r*.33,Math.sin(c)*1.1),e.top==="dome"){const V=X(o-1.6*y,o,r);B*=1-.3*V*V}const E=D(r),t=M[E],z=M[Math.min(E+1,M.length-1)];let l=0,g=t.w-r,k=t.g;if(r>=t.w){const V=Math.max(z.w-t.w,.05);l=$((r-t.w)/V,0,1);const C=z.w-r;g=r-t.w,C<g&&(g=C,k=z.g)}const u=X(.66,1,l),i=Q(t.s,z.s,u),d=Math.exp(-(g*g)/(.046*.046))*(.3+.7*X(-.45,.25,s.n3(Math.cos(c)*1.4,r*1.1+e.seed,Math.sin(c)*1.4)));B*=i*(1+.022*Math.sin(Math.PI*l))*(1-.7*k*d);const b=x*(v+e.curve*v*v/o)/(1+e.curve),n=.035*(o/8)*Math.sin(v*.9+e.seed);return f.x=L*b-p*n+Q(t.ox,z.ox,u)+B*Math.cos(c),f.z=p*b+L*n+Q(t.oz,z.oz,u)+B*Math.sin(c),f.y=v,f.ao=1-Math.min(.55,k*7.5)*d*Math.exp(-(g*g)/(.07*.07)),f},m=(r,c)=>{let v=(r-c)%U;return v>Math.PI&&(v-=U),v<-Math.PI&&(v+=U),v},S=r=>.15*s.n3(Math.cos(r)*2.6,e.seed*3.1,Math.sin(r)*2.6)+.025*Math.sin(5*r+e.seed);return{at:A,warp:w,yTop:r=>{if(e.top==="dome")return o;let c=o-e.topSlope*(e.top==="slant"?1:.35)*y*Math.cos(r-e.topAz)+S(r)*(e.top==="hollow"?1.5:1);if(e.top==="notch"){const v=m(r,e.notchAz)/e.notchW;if(Math.abs(v)<1){const F=1-v*v;c-=e.notchD*F*F}}return c},centre:r=>{const c=x*(r+e.curve*r*r/o)/(1+e.curve),v=.035*(o/8)*Math.sin(r*.9+e.seed);return[L*c-p*v,p*c+L*v]},rTop:y,breakY:r=>$(.16+.1*Math.cos(r-e.seed*2.4)+.03*s.n3(Math.cos(r)*.5,e.seed*5.3,Math.sin(r)*.5),0,.32)}}function*ce(e,s,o=2){const h=ue(e,s),{H:M,drums:T}=e,y=!!e.baseCap&&o===2,L=o===-1||o===-.5,p=o===2?y?40:56:o===1?22:o===.5?16:o===0?9:o===-.25?10:o===-.5?9:7,x=p+1,D=e.baseCap?[0,.36]:o<0?[-.3,.12]:o===0?[-.3,.02,.2]:[-.3,0,.1,.24],w=o===2?.034:.06;for(let u=0;u<T.length;u++){const i=T[u].w;if(i>M+.4)break;if(L&&u%2===1)continue;const d=u+1<T.length?T[u+1].w:i+.4;o>=0&&D.push(i-(o===0?.075:w)),D.push(i),o===2?(D.push(i+w),y||D.push((i+d)*.5)):o===1&&D.push((i+d)*.5)}D.push(M+.7);const f=[],A=[],m=[],S=[],K=()=>(S.push(f.length/3),f.length/3),W=f.length/3;for(let u=0;u<D.length;u++){K();for(let i=0;i<x;i++){const d=i%p/p*U,b=D[u],n=h.warp(b,d),V=h.yTop(d);let C=b-n,P=b;C>V&&(C=V,P=V+n),e.baseCap&&u===0&&(C=h.breakY(d),P=C);const G=h.at(P,d,C);f.push(G.x,G.y,G.z),A.push(P,i/p,G.ao,0)}(o===2?u%2===1:u%5===4)&&(yield)}yield;for(let u=0;u<D.length-1;u++)for(let i=0;i<p;i++){const d=W+u*x+i,b=d+x,n=d+1,V=b+1;m.push(d,b,n,b,V,n)}const N=[];let r=0,c=0,v=0;for(let u=0;u<p;u++){const i=u/p*U,d=h.yTop(i),b=h.at(d+h.warp(M,i),i,d);N.push([b.x,b.y,b.z]),r+=b.x/p,v+=b.y/p,c+=b.z/p}const F=e.top==="dome",O=e.top==="hollow",B=O?o===2?[1,.9,.82,.68,.42,.16]:[1,.86,.66,.3]:o===2?[1,.93,.78,.56,.3]:o<0?[1,.45]:[1,.75,.38];yield;const I=f.length/3;for(let u=0;u<B.length;u++){K();const i=B[u];for(let d=0;d<x;d++){const b=N[d%p],n=r+(b[0]-r)*i,V=c+(b[2]-c)*i;let C,P=.9;if(F)C=M+.42*h.rTop*(1-i*i);else if(O){const G=1-X(.66,.88,i);C=b[1]-e.hollowD*G*(.9+.2*s.n2(n*5+e.seed,V*5))-(1-i)*.03,P=Q(1,.28,G)}else C=v+(b[1]-v)*i-.07*(1-i*i)+.03*(1-i*i*i)*s.n2(n*9+e.seed,V*9),P=.72+.2*i;f.push(n,C,V),A.push(C,d/p,P,1+i)}}for(let u=0;u<B.length-1;u++)for(let i=0;i<p;i++){const d=I+u*x+i,b=d+x,n=d+1,V=b+1;m.push(d,b,n,b,V,n)}const E=f.length/3,t=B[B.length-1],z=I+(B.length-1)*x,l=F?M+.42*h.rTop:O?v-e.hollowD-.03:v-.07;f.push(r,l,c),A.push(l,0,O?.25:.72,1);for(let u=0;u<p;u++)m.push(z+u,E,z+u+1);if(yield,e.baseCap){const u=f.length/3,i=o===2?[1,.9,.885,.76,.745,.62,.605,.47,.455,.35,.3,.14]:[1,.86,.84,.6,.58,.36,.3,.14],[d,b]=h.centre(0),n=i.length/2-1,V=[0,.1,.03,.15,.07,.12],C=(_,R)=>h.breakY(R)*(1-.16*_)+V[_%V.length]+.004*s.n3(Math.cos(R)*3.1,_*7.3+e.seed,Math.sin(R)*3.1);for(let _=0;_<i.length;_++){K();const R=Math.min(_>>1,n),H=_>=i.length-2,Y=i[_];for(let j=0;j<x;j++){const Z=j%p/p*U,ie=h.breakY(Z),oe=_===0?h.at(ie,Z,ie):h.at(0,Z,0),me=_===0?oe.x:d+(oe.x-d)*Y,pe=_===0?oe.z:b+(oe.z-b)*Y;let se=_===0?h.breakY(Z):C(R,Z)+(_%2===1?0:-.012),re=_%2===0&&_>0?.74:.95;H&&(se=C(n,Z)+(_===i.length-1?.085:.05),re=_===i.length-1?.7:.82),f.push(me,se,pe),A.push(0,j/p,re,-1-Y)}_%3===2&&(yield)}for(let _=0;_<i.length-1;_++)for(let R=0;R<p;R++){const H=u+_*x+R,Y=H+x,j=H+1,Z=Y+1;m.push(H,j,Y,Y,j,Z)}const P=f.length/3,G=u+(i.length-1)*x;{let _=0;for(let R=0;R<p;R++)_+=f[(G+R)*3+1]/p;f.push(d,_+.02,b),A.push(0,0,.66,-1)}for(let _=0;_<p;_++)m.push(G+_,G+_+1,P)}yield;const g=new a.BufferGeometry;g.setAttribute("position",new a.Float32BufferAttribute(f,3)),g.setAttribute("aData",new a.Float32BufferAttribute(A,4)),g.setIndex(m),yield;{const u=new Float32Array(f.length);for(let i=0;i<m.length;i+=3){const d=m[i]*3,b=m[i+1]*3,n=m[i+2]*3,V=f[n]-f[b],C=f[n+1]-f[b+1],P=f[n+2]-f[b+2],G=f[d]-f[b],_=f[d+1]-f[b+1],R=f[d+2]-f[b+2],H=C*R-P*_,Y=P*G-V*R,j=V*_-C*G;u[d]+=H,u[d+1]+=Y,u[d+2]+=j,u[b]+=H,u[b+1]+=Y,u[b+2]+=j,u[n]+=H,u[n+1]+=Y,u[n+2]+=j,i%6e3===5997&&(yield)}for(let i=0;i<u.length;i+=3){const d=Math.hypot(u[i],u[i+1],u[i+2])||1;u[i]/=d,u[i+1]/=d,u[i+2]/=d}g.setAttribute("normal",new a.BufferAttribute(u,3))}yield;const k=g.attributes.normal;for(const u of S){const i=u,d=u+p,b=k.getX(i)+k.getX(d),n=k.getY(i)+k.getY(d),V=k.getZ(i)+k.getZ(d),C=Math.hypot(b,n,V)||1;k.setXYZ(i,b/C,n/C,V/C),k.setXYZ(d,b/C,n/C,V/C)}return g.computeBoundingSphere(),g.userData={top:[r,v,c],rTop:h.rTop,height:M,triangles:m.length/3},g}function ae(e,s,o=2){const h=ce(e,s,o);let M=h.next();for(;!M.done;)M=h.next();return M.value}async function te(e,s,o,h){const M=ce(e,s,o);let T=M.next();for(;!T.done;)await h(),T=M.next();return T.value}const q=(e,s=1)=>{const o=new a.Color(e);return new a.Vector3(o.r*s,o.g*s,o.b*s)};function xe(e=le){return{uTime:{value:0},uSunDir:{value:new a.Vector3(-.6,.7,.4).normalize()},uSunCol:{value:q("#FFE2B0",1.25)},uSky:{value:q("#CFC9B8",.5)},uFill:{value:q("#8E8A93",.52)},uWarm:{value:q("#EADFC6",.3)},uRim:{value:q("#F2C566",.55)},uSea:{value:new a.Vector3(.3,0,1).normalize()},uSun:{value:1},uSunDown:{value:1},uSmoke:{value:1},uWet:{value:0},uVeilGain:{value:1},uVeilEven:{value:0},uVeilLow:{value:0},uAxis:{value:new a.Vector3(-.83,.13,.55).normalize()},uWindSpeed:{value:2.6},uBone:{value:q(e[0],.8)},uTan:{value:q("#B9A27C",.9)},uGold:{value:q(e[2])},uRust:{value:q(e[4],.7)},uLichen:{value:q("#8C9A7A",.75)},uDark:{value:q(e[6],.55)},uGreen:{value:q(e[3],.8)},uCover:{value:null},uMap:{value:null},uMapRect:{value:new a.Vector4(0,0,0,28)},uSpore:{value:new a.Vector3(.41,.185,.078)},uFogS:{value:new a.Vector3(.8,.72,.55)},uFogA:{value:new a.Vector3(.45,.43,.4)},uFogG:{value:new a.Vector3(1,.9,.7)},uFogK:{value:0}}}const be=`
varying vec3 vFogDir; uniform vec3 uFogS, uFogA, uFogG, uFogSunD; uniform float uFogK;
vec3 dfogC(){
  vec3 d = vFogDir / max(length(vFogDir), 1e-4);
  vec2 sh = uFogSunD.xz / max(length(uFogSunD.xz), 1e-4);
  float side = .5 + .5 * dot(d.xz / max(length(d.xz), 1e-4), sh);
  float g = max(dot(d, uFogSunD), 0.), g2 = g * g, g8 = g2 * g2; g8 *= g8;
  vec3 f = mix(uFogA, uFogS, side * mix(side, 1., .35)) + uFogG * (.05 + .95 * side) * (.05 + .13 * g2 + .3 * g8);
  return mix(fogColor, f, clamp(uFogK, 0., 1.));
}
#define fogColor dfogC()
`;function Te(e,s){if(!e||!e.isShaderMaterial||!e.fog||e.userData.dirFog)return!1;const o=e.vertexShader,h=e.fragmentShader;return!o.includes("#include <fog_pars_vertex>")||!o.includes("#include <fog_vertex>")||!h.includes("#include <fog_pars_fragment>")?!1:(e.vertexShader=o.replace("#include <fog_pars_vertex>",`#include <fog_pars_vertex>
varying vec3 vFogDir;`).replace("#include <fog_vertex>",`#include <fog_vertex>
  vFogDir = transpose(mat3(viewMatrix)) * mvPosition.xyz;`),e.fragmentShader=h.replace("#include <fog_pars_fragment>",`#include <fog_pars_fragment>
`+be),e.uniforms.uFogS=s.uFogS,e.uniforms.uFogA=s.uFogA,e.uniforms.uFogG=s.uFogG,e.uniforms.uFogK=s.uFogK,e.uniforms.uFogSunD=s.uSunDir,e.userData.dirFog=!0,!0)}const ne=`
float h31(vec3 p){ p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yxz + 33.33); return fract((p.x + p.y) * p.z); }
float vn(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(mix(h31(i), h31(i + vec3(1,0,0)), f.x), mix(h31(i + vec3(0,1,0)), h31(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h31(i + vec3(0,0,1)), h31(i + vec3(1,0,1)), f.x), mix(h31(i + vec3(0,1,1)), h31(i + vec3(1,1,1)), f.x), f.y), f.z); }
float fbm3(vec3 p){ return .5 * vn(p) + .3 * vn(p * 2.1 + 7.) + .2 * vn(p * 4.3 + 13.); }
`,ye=`
attribute vec4 aData;
#ifdef USE_INSTANCING
attribute vec2 iSeed;
#endif
uniform float uSeed, uH;
varying vec3 vWp, vN, vOp; varying vec4 vData; varying vec2 vSeedH;
#include <fog_pars_vertex>
void main(){
  #ifdef USE_INSTANCING
    mat4 M = modelMatrix * instanceMatrix; vSeedH = vec2(iSeed.x, uH);
  #else
    mat4 M = modelMatrix; vSeedH = vec2(uSeed, uH);
  #endif
  vec4 wp = M * vec4(position, 1.);
  vWp = wp.xyz; vOp = position; vData = aData;
  vN = mat3(M) * normal;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Me=`
uniform vec3 uSunDir, uSunCol, uSky, uFill, uWarm, uRim, uSea, uBone, uTan, uGold, uRust, uLichen, uDark;
uniform float uSun, uSunDown, uSmoke, uWet, uTime, uFlutes, uBands, uWaterY, uLie; uniform vec3 uAxis;
varying vec3 vWp, vN, vOp; varying vec4 vData; varying vec2 vSeedH;
#include <common>
#include <fog_pars_fragment>
${ne}
void main(){
  float w = vData.x, th = vData.y * 6.2831853, ao = vData.z, cap = vData.w, seed = vSeedH.x;
  ao *= 1. - uBands * .15 * smoothstep(.55, 1., fract(w * 2.7 + seed + .4 * vn(vec3(w * 1.3, seed, 3.)))) * (1. - step(.5, abs(cap)));      // far meshes carry no drum rows: the shade under each drum is drawn
  float tN = clamp(w / max(vSeedH.y, .1), 0., 1.);
  vec2 cs = vec2(cos(th), sin(th));
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  vec3 V = cameraPosition - vWp; float dist = length(V); V /= max(dist, 1e-4);
  float body = 1. - step(.5, abs(cap));
  float lod = 1. / (1. + dist * dist * .0022);
  // fluting and fine growth lines, in the normal
  // n4: the flutes run along the pillar's own axis (uAxis: straight up for one that stands, so live's line to the letter;
  // along the trunk for the one that lies, whose back faces the sky: the old cross with 'up' had no direction there and
  // lit the back in broad zebra stripes)
  vec3 T = cross(uAxis, N); T /= max(length(T), 1e-3);
  float wob = vn(vec3(cs * 3. + seed, w * .7));
  float ph = th * uFlutes + wob * 5.;
  float ph2 = th * (floor(uFlutes * .5) + 3.) + wob * 7. + 1.3;        // whole numbers of flutes: no seam
  float fl = sin(ph) * .65 + sin(ph2) * .35;
  float dfl = cos(ph) * .65 + cos(ph2) * .3;
  // n4: on the lying trunk a flute narrower than a pixel or two is not drawn (by the flute phase's own screen derivative):
  // 84 flutes under-sampled read as a few broad stripes that swim as the lens comes over
  { float flK = mix(1., 1. - smoothstep(1., 2.6, fwidth(ph)), uLie); fl *= flK; dfl *= flK; }
  float gl = sin(w * 70. + wob * 9.);
  float upK = uLie * smoothstep(.1, .9, N.y);                              // the back of the one that lies (0 on every pillar that stands)
  N = normalize(N + body * mix(.55, 1., lod) * (T * dfl * .42 + uAxis * gl * .08));
  // albedo
  vec3 q = vOp + seed;
  float big = fbm3(q * .8), fine = vn(q * 22.);
  vec3 alb = uBone * mix(.8, 1.05, big) * mix(.92, 1.04, fine);
  alb *= mix(.88, 1.06, vn(vec3(w * 2.6, seed, 1.))) * vec3(1., mix(.96, 1.01, vn(vec3(w * 1.1, seed, 7.))), mix(.9, 1.02, big));
  alb *= 1. - body * lod * .16 * smoothstep(.68, .9, vn(q * 55.));
  alb *= 1. + body * mix(.5, 1., lod) * fl * .17;
  // k1b: soft-edged bands of ochre, pale rust and slate lying round the drums (their edges wander with the girth), and close
  // to, a fibrous grain running up the flank: fine tubes, not wood
  float bw = w + .22 * vn(vec3(cs * 1.7 + seed, w * .5));
  float bn = vn(vec3(bw * 1.25, seed * 1.7, 2.)), bn2 = vn(vec3(bw * .62 + 5., seed, 9.)), bn3 = vn(vec3(bw * 2.9, seed * .7, 4.));
  vec3 bandT = mix(vec3(1.1, .95, .7), vec3(.8, .83, .93), smoothstep(.3, .7, bn));
  bandT = mix(bandT, vec3(1.14, .8, .6), smoothstep(.55, .85, bn2) * .7);
  alb *= mix(vec3(1.), bandT, body * .62) * (1. - body * .16 * smoothstep(.45, .8, bn3));
  float nearK = 1. / (1. + dist * dist * .012);
  float fib = vn(vec3(cs * 46. + seed, w * 1.7)) * .6 + vn(vec3(cs * 110. - seed, w * 3.1)) * .4;
  alb *= 1. + body * nearK * (fib - .5) * .5;
  float strk = vn(vec3(cs * 6.5 + seed, w * .22)); strk = smoothstep(.5, .78, strk) * (.3 + .7 * vn(vec3(cs * 2. - seed, w * .9)));
  // n4: on a pillar that lies (uLie) rain runs round the girth, not along it: fine streaks down each flank from the back
  float strkL = smoothstep(.46, .8, vn(vec3(w * 7.5 + seed, cs * .8))) * (.35 + .65 * vn(vec3(w * 1.9 - seed, cs * 2.))) * smoothstep(-.75, .35, 1. - abs(N.y) * 1.2);
  strk = mix(strk, strkL, uLie);
  strk = clamp(strk + (1. - ao) * .35 + uWet * .35 * vn(vec3(cs * 3., w * .3 + seed)), 0., 1.) * body;
  float zone = smoothstep(.6, .73, tN + .09 * (vn(vec3(cs * 3.5 + seed, w * 1.3)) - .5)) * body * (1. - uLie);      // n4: the one that lies grows no more: no pale velvet top (it was the white tongue under the lens), no gold fuzz
  alb = mix(alb, uDark + alb * .3, strk * mix(.5, .8, uLie) * (1. - zone * .6));
  float seaward = smoothstep(-.15, .75, dot(N, uSea));
  float cr = fbm3(q * 1.5 + 31.);
  float crust = smoothstep(.55, .62, cr * (.5 + .62 * seaward) + .04 * (1. - smoothstep(0., 2.2, w)) + (fine - .5) * .06 + .27 * upK) * (1. - zone) * body;      // a lying one carries its grey-green crust in broad patches along the whole of its back, where rain stands
  vec3 crustCol = mix(mix(uLichen, alb, .35), mix(uRust * vec3(1.25, 1.5, 1.6), alb, .5), smoothstep(.6, .7, vn(q * 1.1 + 57.)) * smoothstep(.5, 1.6, w)) * mix(.82, 1.1, vn(q * 13.)) * mix(.88, 1.06, fine);
  alb = mix(alb, crustCol, crust * .8);
  // n4: the back of the lying trunk is weathered: greyer and a tone down from the flanks' bone (it was the palest thing
  // in the frame, a white tongue at the bottom edge as the lens came over), rust bleeding from the seams between drums
  { float seam = smoothstep(.72, .98, 1. - ao) + .5 * smoothstep(.6, .8, vn(vec3(w * 3.3 + seed, cs * 1.4)));
    float rustK = upK * body * clamp(seam, 0., 1.) * smoothstep(.38, .62, vn(q * 2.3 + 71.)) * (1. - crust * .7);
    alb = mix(alb, alb * vec3(.64, .66, .62) + uDark * .1, upK * body * (.5 + .4 * big) * (1. - crust));
    alb = mix(alb, uRust * mix(.8, 1.15, fine), rustK * .6); }
  vec3 velvet = uTan * mix(.82, 1.08, vn(q * 34.)) * mix(.88, 1.06, big);
  alb = mix(alb, velvet, zone * .9);
  // the broken top and the sawn end: pale flesh with growth rings
  float rho = abs(cap) - 1.;
  float ringW = mix(sin(rho * 56.5 + 2. * vn(q * 2.5)) * .5 + .5, sin(rho * 251.3 + 4. * vn(q * 2.5)) * .5 + .5, 1. - smoothstep(1.4, 3.2, dist));     // forty rings close to, a dozen bold ones from further off (no moire)
  vec3 flesh = mix(uBone * 1.04, uTan, .35 + .3 * step(cap, -.5)) * mix(.85, 1., ringW) * mix(.85, 1.05, fine);
  // n4: the broken end of the fallen pillar: growth rings.  Mend 2: the forty fine rings are gathered in six broad bands of
  // bone and tan (decades of growth: six and a half turns of the same radius), which are there at every distance and
  // never move: they are what the end shows from the first sight of it (from 30 m a band is still three pixels wide;
  // the forty fell under a pixel there and the end was one flat tone with lobes).  The fine rings ride on the bands only
  // where the lens resolves them (by their phase's own screen derivative), as a finer grain of the same circles: nothing
  // fades in or out but that grain.  Both are circles round the pith (the phase's wobble is a hundredth of the radius).
  float endK = step(cap, -.5) * (1. - body);
  { float rr = clamp(rho, 0., 1.), wob = vn(q * 2.5);
    float rph = rr * 251.3 + 2.2 * wob, rfw = fwidth(rph), bph = rr * 40.8 + .36 * wob, bfw = fwidth(bph);
    float fineR = (sin(rph) * .5) * (1. - smoothstep(1.1, 2.8, rfw));
    float band = mix(.5, smoothstep(-.45, .45, sin(bph)), 1. - smoothstep(1.1, 2.8, bfw));
    float years = vn(vec3(rr * 11., seed, 5.));
    vec3 fleshE = mix(uBone * 1.07, uBone * vec3(.84, .69, .5), clamp(.12 + .56 * band + .3 * fineR, 0., 1.)) * mix(.9, 1.05, years) * mix(.92, 1.04, fine);
    flesh = mix(flesh, fleshE, endK); }
  alb = mix(alb, flesh, 1. - body);
  float footK = (1. - smoothstep(.0, .5, w + .25 * (vn(vec3(cs * 5. + seed, 3.)) - .5))) * body;      // k1b: the foot: a damp ragged tide mark with crust on it, not a dark boot
  alb = mix(alb, mix(alb * .62, uLichen * .8, smoothstep(.45, .7, vn(q * 4.3 + 9.))), footK * .55);
  alb *= mix(.84, 1., ao);
  { float wl = 1. - smoothstep(uWaterY + .03, uWaterY + .3 + .08 * vn(vec3(vWp.xz * 3., 1.)), vWp.y);      // k1b: a pillar lying in the stream: dark and wet to a ragged line above the water, green just over it
    alb = mix(alb, alb * vec3(.36, .37, .33), wl * .85);
    alb = mix(alb, uLichen * .55, (1. - smoothstep(uWaterY + .2, uWaterY + .46, vWp.y)) * (1. - wl) * .5 * smoothstep(.35, .6, vn(q * 3.7 + 5.))); }
  alb *= mix(1., mix(.3, 1., smoothstep(.2, .9, ao)), 1. - body);
  // light
  vec3 L = uSunDir; float ndl = dot(N, L);
  float sunMask = uSun * smoothstep(0., .22, tN + (1. - body) - (1. - uSunDown * 1.25));
  float diff = clamp((ndl + .08) / 1.08, 0., 1.); diff = mix(diff, smoothstep(0., .45, diff), .55);
  vec3 Lh = L * vec3(1., 0., 1.); Lh /= max(length(Lh), 1e-3);
  float side = .5 + .5 * dot(N, Lh);
  vec3 amb = mix(uFill, uSky, .5 + .5 * N.y) * (1. - .45 * side) + uWarm * side * side;
  amb *= mix(vec3(1.), vec3(.74, .76, 1.12), uSun * (1. - diff) * (1. - .5 * side) * (1. - endK));     // in sunlight the shaded flank goes violet
  amb = mix(amb, dot(amb, vec3(.3, .5, .2)) * vec3(1.16, 1., .8) * 1.12, endK * .85);          // n4: the ringed end is lit by the pale gravel in front of it: bone and tan, never blue
  vec3 col = alb * (uSunCol * diff * sunMask * 1.08 + amb * mix(.62, 1., ao));
  float fres = 1. - max(dot(N, V), 0.); float f3 = fres * fres * fres;
  col += alb * uRim * f3 * smoothstep(-.25, .55, ndl) * (1. + .5 * sunMask);
  float agl = max(-dot(V, L), 0.);                                         // looking toward the sun, light wraps round every edge
  col += alb * uSunCol * fres * fres * agl * agl * smoothstep(-.7, .1, ndl) * sunMask * 1.5;
  // velvet: the smoking zone catches the sun as a soft gold fuzz at its edge
  float breath = vn(vec3(cs * 3. + seed, w * 1.6 - uTime * .7));
  col += zone * uGold * (f3 * .5 + fres * .12 + .1 * breath * breath) * (.25 + .75 * uSmoke) * (.35 + sunMask * smoothstep(-.6, .3, ndl)) * mix(.6, 1.5, breath);
  vec3 Hv = L + V; Hv /= max(length(Hv), 1e-3);
  float sp = max(dot(N, Hv), 0.); sp *= sp; sp *= sp; sp *= sp; sp *= sp;
  col += uSunCol * sp * sunMask * (strk * .5 + uWet * .3) * .5;
  col += (uWarm + uSky * .5) * footK * (.25 + .75 * fres * fres) * .22;                    // the wet sheen at the waterline of the foot
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`;function J(e,{seed:s=0,height:o=8,flutes:h=34,bands:M=0}={}){return new a.ShaderMaterial({uniforms:{...a.UniformsUtils.clone(a.UniformsLib.fog),...e,uSeed:{value:s},uH:{value:o},uFlutes:{value:h},uBands:{value:M},uWaterY:{value:-1e3},uLie:{value:0},uAxis:{value:new a.Vector3(0,1,0)}},vertexShader:ye,fragmentShader:Me,fog:!0})}const fe=`
uniform vec3 uAxis; uniform float uTime, uSmoke, uWindSpeed, uVeilEven, uVeilLow;
attribute vec3 iTop; attribute vec4 iA; attribute vec3 iB;
float amountOf(float delay){ return smoothstep(delay * .7, delay * .7 + .3, uSmoke); }
`,de=`
#ifdef USE_FOG
  #ifdef FOG_EXP2
    float fogF = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #else
    float fogF = smoothstep(fogNear, fogFar, vFogDepth);
  #endif
  gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor * gl_FragColor.a * uFogKeep, fogF);
  gl_FragColor *= 1. - fogF * .55;
#endif
`;function he(e,s,{rng:o,perPillar:h=20,motes:M=40,detail:T=1}={}){const y=Math.max(8,Math.round(h*T)),L=Math.max(10,Math.round(M*T)),p=s.length,x=new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),D=[0,1,2,0,2,3],w=(c,v)=>{const F=new a.InstancedBufferGeometry;F.setAttribute("position",new a.BufferAttribute(x,3)),F.setIndex(D);const O=new Float32Array(c*3),B=new Float32Array(c*4),I=new Float32Array(c*3);let E=0;for(let t=0;t<p;t++){const z=s[t];for(let l=0;l<c/p;l++,E++)O[E*3]=z.pos[0],O[E*3+1]=z.pos[1],O[E*3+2]=z.pos[2],v(B,E*4,z,l),I[E*3]=z.length??45,I[E*3+1]=z.radius??.3,I[E*3+2]=z.gain??1}return F.setAttribute("iTop",new a.InstancedBufferAttribute(O,3)),F.setAttribute("iA",new a.InstancedBufferAttribute(B,4)),F.setAttribute("iB",new a.InstancedBufferAttribute(I,3)),F.instanceCount=c,F},f=w(p*y,(c,v,F,O)=>{c[v]=F.delay??0,c[v+1]=Math.pow((O+.35+.3*o())/y,1.25),c[v+2]=o(),c[v+3]=o.range(.85,1.2)}),A=w(p*L,(c,v,F)=>{c[v]=F.delay??0,c[v+1]=o(),c[v+2]=o(),c[v+3]=o()}),m=()=>a.UniformsUtils.clone(a.UniformsLib.fog),S=new a.ShaderMaterial({uniforms:{...m(),...e,uFogKeep:{value:1}},fog:!0,transparent:!0,depthWrite:!1,blending:a.CustomBlending,blendSrc:a.OneFactor,blendDst:a.OneMinusSrcAlphaFactor,vertexShader:`
${fe}
varying vec2 vC; varying vec3 vWp; varying vec3 vK;
#include <fog_pars_vertex>
void main(){
  // n4 (K1): uVeilLow (0 through the foggy opening, 1 once the sun is back after the shower): in the washed air the veil is
  // the short one of the live morning (a third of the opening's long pennant) and its dust SINKS as it drifts: it hangs
  // from the top down toward the plain and lies low among the trunks, never as a streak across the mountain wall
  float f = iA.y, L = iB.x * mix(1., .33, uVeilLow), s = f * L, amt = amountOf(iA.x);
  vec3 side = cross(uAxis, vec3(0., 1., 0.)); side /= max(length(side), 1e-3);
  vec3 lift = cross(side, uAxis);
  float ph = iA.z * 6.283 + iTop.x * .37;
  vec3 c = (modelMatrix * vec4(iTop, 1.)).xyz + uAxis * (s + iB.y)
    + side * (sin(uTime * .55 + s * .13 + ph) * .06 + sin(uTime * .23 - s * .05 + ph * 2.) * .04) * s
    + lift * ((sin(uTime * .41 + s * .11 + ph * 1.7) * .04 + .035) * s + .25)
    + vec3(0., .3, 0.) * sqrt(max(s, 0.)) * (1. - uVeilEven) * (1. - uVeilLow) - vec3(0., .3, 0.) * s * uVeilLow;              // k1: a veil that slants away downwind along the axis (the brief), lifting only a little off the top
  float size = (.34 + iB.y * 1.1 + s * mix(.022, .012, uVeilEven)) * iA.w;
  vec3 R = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), Uv = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec3 ax = cross(uAxis, c - cameraPosition); float axl = length(ax) / max(length(c - cameraPosition), 1e-3);
  float rb = smoothstep(.2, .6, axl);                         // seen side-on: a ribbon along the wind; seen end-on: a round card
  vec3 X = mix(R, uAxis * mix(5., 2.4, uVeilEven), rb), Y = mix(Uv, ax / max(length(ax), 1e-4), rb);
  vec3 wp = c + (X * position.x + Y * position.y) * size;
  vC = position.xy; vWp = wp;
  // thin with distance downwind, unroll from the top as the pillar starts to smoke
  float thin = (1. - f) * mix(1., .7, smoothstep(0., .5, f)) * mix(.2, 1., max(rb, uVeilEven)) * (1. + 1.2 * (1. - smoothstep(0., .25, f)) * (1. - uVeilEven));      // k1: densest where it leaves the top: a pennant on its pillar, not a band of haze
  thin = mix(thin, .62 * (1. - smoothstep(.55, 1., f)), uVeilEven);
  vK = vec3(thin * amt * smoothstep(0., .18, amt * 1.2 - f) * mix(clamp(L / 36., .3, 1.), 1.3, uVeilEven) * iB.z, f, size);
  vec4 mvPosition = viewMatrix * vec4(wp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
uniform vec3 uAxis, uSunDir, uSunCol, uGold, uWarm; uniform float uTime, uSun, uWindSpeed, uFogKeep, uVeilGain, uVeilEven, uVeilLow;
varying vec2 vC; varying vec3 vWp; varying vec3 vK;
#include <common>
#include <fog_pars_fragment>
${ne}
void main(){
  float fx = clamp(1. - vC.x * vC.x, 0., 1.), fy = clamp(1. - vC.y * vC.y, 0., 1.); float fall = fx * fx * fy * fy * mix(fy, 1., uVeilEven);      // k1: a streak along the wind, soft at both ends, never a round puff
  vec3 p = vWp - uAxis * uTime * uWindSpeed;
  // the wisps are drawn in the plume's own frame (along the wind, up across it, and only weakly in depth), so the
  // twenty cards agree with one another and the veil streams in threads instead of averaging to a blur
  vec3 sdv = cross(uAxis, vec3(0., 1., 0.)); sdv /= max(length(sdv), 1e-3); vec3 lft = cross(sdv, uAxis);
  float al = dot(p, uAxis), hl = dot(p, lft), sl = dot(p, sdv);
  vec3 q = vec3(al * .1, hl * .8, sl * .22);
  float wisp = .6 * vn(q) + .4 * vn(q * 2.7 + 9.);
  float fine = vn(vec3(al * .12, hl * 2.6, sl * .5) + 3.);
  float torn = vn(q * .31 + vec3(al * .05, 0., 0.) + 21.);
  float fil = smoothstep(.4, .8, vn(vec3(al * .22, hl * 2.1, sl * .9) + 11.));           // soft streaming strands (polish 4: no fine level stripes, which read as a banded patch on the hills)
  float root = 1. - smoothstep(0., .07, vK.y);                 // at the top itself the veil is a soft whole breath, never a gap
  float body = (.3 + .95 * smoothstep(.36, .76, wisp + (torn - .5) * .55 * smoothstep(.04, .3, vK.y))) * mix(.5, 1.3, fine) * mix(.5 + .8 * fil, .6 + 1.1 * fil, uVeilEven);   // threads, not a soft body
  float dens = fall * mix(body, mix(.75, .3, uVeilEven), root);
  vec3 ray = vWp - cameraPosition; float dist = length(ray); ray /= max(dist, 1e-4);
  float c = dot(ray, uSunDir), fw = max(c, 0.); fw *= fw; fw *= fw;
  float lit = mix(mix(.42, .06, uVeilLow) + mix(.58, .94, uVeilLow) * smoothstep(mix(.15, .45, uVeilLow), .96, c), 1., uVeilEven);                      // dust in light: brightest where the sun stands behind it; in the washed air it shows there only (live's law)
  // n4 (K4): the card's edge.  The amount was capped AFTER the falloff, so a dense card was one flat tone to its very edge:
  // a lit square.  Now every card ends in a round soft rim of its own (nothing is left at the inscribed circle), whatever its density.
  vec2 cc = clamp(vC, -1., 1.); float rim = 1. - smoothstep(.3, 1., dot(cc, cc));
  float farK = mix(mix(1., .72, smoothstep(40., 200., dist)), mix(1., .1, smoothstep(15., 58., dist)), uVeilLow);      // n4: in the washed air, live's own law: far off only the glitter is left, never a pale smear across the hills
  float a = min(mix(.62, .2, uVeilEven) * dens * clamp(vK.x, 0., 4.) * uVeilGain, mix(.17, .2, uVeilEven)) * rim * lit * smoothstep(1.2, mix(9., 7., uVeilEven), dist) * mix(farK, mix(1., .5, smoothstep(40., 170., dist)), uVeilEven) * mix(.5, 1., smoothstep(7., 34., dist));
  float core = (1. - vK.y); core *= core;
  vec3 gold = mix(uGold, vec3(1., .76, .3), .7) * 1.5;      // pale gold dust, not orange, under an amber sun too
  vec3 lightc = mix(uSunCol, vec3(dot(uSunCol, vec3(.3333))), .5);
  float fw1 = max(c, 0.);
  vec3 col = gold * lightc * (.8 + .5 * (c * .5 + .5) + 1.2 * fw1 * fw1 + 3.2 * fw + .45 * core * min(dens, 1.5)) * mix(.55, 1., uSun) + uWarm * .3 * gold;
  col = min(col, gold * 2.3);                                          // backlit it burns gold, never white
  gl_FragColor = vec4(col * a, a * mix(.5, .9, uVeilEven));          // sunlit dust: it glows more than it hides
  ${de}
}`}),K=new a.ShaderMaterial({uniforms:{...m(),...e,uFogKeep:{value:0}},fog:!0,transparent:!0,depthWrite:!1,blending:a.CustomBlending,blendSrc:a.OneFactor,blendDst:a.OneFactor,vertexShader:`
${fe}
varying vec2 vC; varying float vI;
#include <fog_pars_vertex>
void main(){
  float L = iB.x * mix(1., .33, uVeilLow), amt = amountOf(iA.x);            // n4 (K3): the glitter streams close off each top, as in the live morning
  float a = fract(uTime * uWindSpeed / L * mix(.8, 1.2, iA.w) + iA.y), s = a * L;
  vec3 side = cross(uAxis, vec3(0., 1., 0.)); side /= max(length(side), 1e-3);
  vec3 lift = cross(side, uAxis);
  float ang = iA.z * 6.283 * 7., rad = sqrt(fract(iA.z * 13.7)) * (.3 + iB.y + s * .085);
  vec3 c = (modelMatrix * vec4(iTop, 1.)).xyz + uAxis * (s + iB.y) + lift * (.035 * s + .25)
    + (side * cos(ang) + lift * sin(ang)) * rad
    + (side * sin(uTime * .9 + iA.w * 40.) + lift * cos(uTime * .7 + iA.z * 31.)) * (.08 + .012 * s);
  vec4 mvPosition = viewMatrix * vec4(c, 1.);
  float d = -mvPosition.z;
  float size = max(.03, d * .0027);
  mvPosition.xy += position.xy * size;
  float tw = .5 + .5 * sin(uTime * (2.2 + 3. * iA.w) + iA.z * 50.); tw *= tw;
  vI = (.25 + .75 * tw) * amt * smoothstep(0., .05, a) * (1. - a) * smoothstep(0., .25, amt * 1.25 - a) * smoothstep(.6, 3., d) * min(1., .03 / size * 4.5);
  vC = position.xy;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
uniform vec3 uGold, uSunCol; uniform float uSun, uFogKeep;
varying vec2 vC; varying float vI;
#include <common>
#include <fog_pars_fragment>
void main(){
  float r2 = dot(vC, vC); float f = clamp(1. - r2, 0., 1.); f *= f * f;
  vec3 col = mix(uGold, vec3(.96, .66, .22), .55) * mix(uSunCol, vec3(dot(uSunCol, vec3(.3333))), .5) * 4.6 * mix(.35, 1., uSun) * f * vI;
  gl_FragColor = vec4(col, 1.);
  ${de}
}`}),W=new a.Mesh(f,S),N=new a.Mesh(A,K);W.frustumCulled=N.frustumCulled=!1,W.renderOrder=6,N.renderOrder=7;const r=new a.Group;return r.add(W,N),r.name="veils",{object:r,veil:W,mote:N,triangles:(p*y+p*L)*2}}function ve(e,s,o){const h=[],M=[],T=[],y=[[-1,0],[-.5,1],[.5,1],[1,0]],L=8;for(const w of s){const f=ue(w.spec,o),A=w.scale??1,m=Math.cos(w.rotY??0),S=Math.sin(w.rotY??0),K=w.spec.H,W=h.length/3,N=w.rows??L;for(let r=0;r<=N;r++){const c=r/N,v=c*K,F=f.centre(v),O=(w.girth??1)*w.spec.r0*(1-(1-w.spec.taper)*Math.pow(c,1.5))*(1+w.spec.flare*Math.exp(-v/.34))*(r===N?.55:1),B=(F[0]*m+F[1]*S)*A+w.x,I=(-F[0]*S+F[1]*m)*A+w.z;for(const[E,t]of y)h.push(B,v*A,I),M.push(E,O*A,c,t*(r===N?.4:1)*(w.gain??1))}for(let r=0;r<N;r++)for(let c=0;c<3;c++){const v=W+r*4+c,F=v+4;T.push(v,F,v+1,F,F+1,v+1)}}const p=new a.BufferGeometry;p.setAttribute("position",new a.Float32BufferAttribute(h,3)),p.setAttribute("aS",new a.Float32BufferAttribute(M,4)),p.setIndex(T);const x=new a.ShaderMaterial({uniforms:{...a.UniformsUtils.clone(a.UniformsLib.fog),...e,uShade:{value:q("#39344F",1)},uLift:{value:.05}},fog:!0,transparent:!0,depthWrite:!1,side:a.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,blending:a.CustomBlending,blendSrc:a.DstColorFactor,blendDst:a.ZeroFactor,blendSrcAlpha:a.ZeroFactor,blendDstAlpha:a.OneFactor,vertexShader:`
attribute vec4 aS; uniform vec3 uSunDir; uniform float uLift; uniform sampler2D uCover; uniform vec4 uMapRect; varying float vA; varying vec2 vXZ;
#include <fog_pars_vertex>
void main(){
  vec4 base = modelMatrix * vec4(position.x, 0., position.z, 1.);
  float h = position.y, ly = max(uSunDir.y, .14);
  vec2 d = -uSunDir.xz; float dl = length(d); d = dl > 1e-3 ? d / dl : vec2(1., 0.);
  // where the sward stands the shadow lies ON it, at knee height (it used to darken only the soil between the stems, as brown strips)
  vec2 g0 = base.xz + d * dl / ly * h;
  float lift = uLift + .32 * smoothstep(.04, .35, textureLod(uCover, clamp((g0 - uMapRect.xy) * uMapRect.z, .002, .998), 0.).r) * step(1e-6, uMapRect.z);
  vec3 wp = base.xyz; wp.xz += d * dl / ly * max(h - lift, 0.); wp.y += lift;
  float wide = aS.y * 1.25 + .1 + h * .075;                 // penumbra widens with height
  wp.xz += vec2(-d.y, d.x) * aS.x * wide;
  vA = aS.w * mix(1., .16, aS.z * aS.z) * mix(1., aS.y / max(wide * .9, 1e-3), .7); vXZ = wp.xz;
  vec4 mvPosition = viewMatrix * vec4(wp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
uniform vec3 uShade; uniform float uSun; uniform sampler2D uMap; uniform vec4 uMapRect; varying float vA; varying vec2 vXZ;
#include <common>
#include <fog_pars_fragment>
void main(){
  float wd = mix(9., texture2D(uMap, clamp((vXZ - uMapRect.xy) * uMapRect.z, .002, .998)).r, step(1e-6, uMapRect.z));
  float va = clamp(vA, 0., 1.); float a = va * va * (3. - 2. * va) * .54 * uSun * uSun * mix(.28, 1., smoothstep(-.5, .3, wd));
  float ff = 0.;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      ff = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      ff = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #endif
  a *= 1.5 * (1. - clamp(ff, 0., 1.));
  gl_FragColor = vec4(mix(vec3(1.), vec3(.56, .56, .7), clamp(a, 0., 1.)), 1.);
}`}),D=new a.Mesh(p,x);return D.frustumCulled=!1,D.renderOrder=2,D.name="pillarShadows",D}async function Le(e,s={}){const o=e.rng.fork?e.rng.fork("elder"):e.rng,h=e.noise??we(Math.floor(o()*1e9)),M=s.palette??le,T=$(s.detail??e.quality?.detail??1,.6,1),y=s.shared??xe(M),L=new a.Group;L.name="pillars-before-trees-hero";let p=0;const x=ee(o,{height:s.height??8.8,thick:1.3,lean:o.range(3.5,6),taper:o.range(.52,.58),leanAz:o.range(-2.4,-.7),top:s.top});await e.yield();const D=await te(x,h,2,e.yield);await e.yield();const w=J(y,{seed:x.seed,height:x.H,flutes:38}),f=new a.Mesh(D,w);f.name="elder",L.add(f),p+=D.userData.triangles,await e.yield();const A=o.int(4,6),m=[],S=[],K=o.range(.2,.45);for(let n=0;n<A;n++){const V=ee(o,{height:o.range(1,2.3),lean:o.range(2,7)}),C=$(K+(n-A/2)*o.range(.2,.3),-.5,1),P=o.range(2.5,4.3)+n%2*.9,G=Math.sin(C)*P,_=Math.cos(C)*P,R=await te(V,h,1,e.yield);R.translate(G,0,_);const H=R.attributes.aData;for(let Y=0;Y<H.count;Y++)H.setX(Y,H.getX(Y)*8/V.H);S.push(R),m.push({spec:V,x:G,z:_,top:[R.userData.top[0]+G,R.userData.top[1],R.userData.top[2]+_],rTop:R.userData.rTop}),p+=R.userData.triangles,await e.yield()}const W=new a.Mesh(ge(S),J(y,{seed:x.seed+11,height:8,flutes:22}));W.name="young",L.add(W),S.forEach(n=>n.dispose());const N=D.userData.top,r=s.veilLength??o.range(46,58),c=[];for(let n=0;n<2;n++)c.push({pos:N,length:r,delay:0,radius:D.userData.rTop,gain:.55});for(const n of m)c.push({pos:n.top,length:o.range(7,12),delay:o.range(.25,.9),radius:n.rTop,gain:.45});const v=he(y,c,{rng:o,perPillar:22,motes:60,detail:T});L.add(v.object),p+=v.triangles,await e.yield();const F=ve(y,[{spec:x,x:0,z:0,gain:.85},...m.map(n=>({spec:n.spec,x:n.x,z:n.z,gain:.45}))],h);L.add(F),p+=F.geometry.index.count/3,await e.yield();const O=await ke(e,o,h,y,{detail:T,young:m,elderSpec:x,apron:s.apron!==!1,sward:s.sward!==!1,swardCount:s.swardCount});O.object&&(L.add(O.object),p+=O.triangles);const B=s.field??null,I=B?await Fe(e,y,B,{rng:o,noise:h,detail:T}):null;I&&(L.add(I.object),p+=I.triangles);let E=!s.light,t=null,z=!1,l=!1;const g=new a.Vector3,k=new a.Vector3,u=(n={})=>{E=!1,n.sunDir&&y.uSunDir.value.copy(n.sunDir).normalize(),n.sunColor&&y.uSunCol.value.copy(n.sunColor),n.sky&&y.uSky.value.copy(n.sky),n.fill&&y.uFill.value.copy(n.fill),n.warm&&y.uWarm.value.copy(n.warm),n.rim&&y.uRim.value.copy(n.rim),n.sea&&y.uSea.value.copy(n.sea).normalize()};s.light&&u(s.light);const i=(n,V,C=2.6,P=.13)=>{const G=Math.hypot(n,V)||1;y.uAxis.value.set(n/G*(1-P),P,V/G*(1-P)).normalize(),y.uWindSpeed.value=C};s.wind&&i(s.wind[0],s.wind[1],s.windSpeed,s.rise);const d=(n={})=>{l=!0,n.sun!==void 0&&(y.uSun.value=n.sun),n.sunDown!==void 0&&(y.uSunDown.value=n.sunDown),n.smoke!==void 0&&(y.uSmoke.value=n.smoke),n.wet!==void 0&&(y.uWet.value=n.wet)},b=n=>d({sun:X(.44,.6,n),sunDown:X(.455,.57,n),smoke:X(.46,.58,n)});return s.state&&d(s.state),{object:L,radius:7,height:x.H,center:new a.Vector3(0,x.H*.56,0),shared:y,setLight:u,setWind:i,setState:d,setProgress:b,elderSpec:x,field:I,triangles:p,anchors:{top:new a.Vector3(N[0],N[1],N[2]),flyThrough:[[30,2,48],[22,3.2,32],[15.5,5.2,17],[10.6,7.6,3],[8.5,9,-12],[0,10.4,-27],[-14,11,-38]].map(n=>new a.Vector3(...n)),viewpoints:{approach:new a.Vector3(22,3.2,32),beside:new a.Vector3(10.6,7.6,3),reveal:new a.Vector3(0,10.4,-27)},young:m.map(n=>new a.Vector3(n.x,0,n.z)),veilAxis:y.uAxis.value,portalSeat:{position:new a.Vector3(-120,7.5,-120),facing:new a.Vector3(.707,0,.707)},clearRadius:9.5},update(n,V,C){if(y.uTime.value=V,E){if(!z&&L.parent){z=!0;let P=L.parent;for(;P.parent;)P=P.parent;P.traverse(G=>{G.isDirectionalLight&&(!t||G.intensity>t.intensity)&&(t=G)})}if(t){t.getWorldPosition(g),t.target.getWorldPosition(k),g.sub(k),g.lengthSq()>1e-6&&y.uSunDir.value.copy(g).normalize();const P=t.intensity/Math.PI*1.05;y.uSunCol.value.set(t.color.r*P,t.color.g*P,t.color.b*P)}}},dispose(){},ground:!0,groundY:0}}function Se(e,{stems:s=5,height:o=.6}={}){const h=[],M=[],T=[],y=[],L=(w,f,A,m,S,K)=>{const W=[f[0]-w[0],f[1]-w[1],f[2]-w[2]],N=Math.hypot(W[0],W[1],W[2])||1,r=h.length/3;for(const[c,v]of[[w,A],[f,m]])for(const F of[-1,1])h.push(c[0],c[1],c[2]),M.push(W[0]/N,W[1]/N,W[2]/N,F),T.push(v,S,$(c[1]/o,0,1.3),K);y.push(r,r+1,r+2,r+1,r+3,r+2)},p=(w,f,A)=>{const m=e.range(.05,.08)*o/.6,S=[w[0]+f[0]*m*.3,w[1]-m*.5,w[2]+f[2]*m*.3],K=[w[0]+f[0]*m*.36,w[1]-m,w[2]+f[2]*m*.36];L(w,S,.004,.013,1,A),L(S,K,.013,.002,1,A)},x=(w,f,A,m,S,K)=>{const W=[w[0]+f[0]*A,w[1]+f[1]*A,w[2]+f[2]*A];if(L(w,W,S,S*.8,0,K),m===0){const c=e()*U,v=[Math.cos(c),0,Math.sin(c)];p(W,v,K),p(W,[-v[0],0,-v[2]],K);return}const N=e()*U,r=e.range(.28,.5);for(const c of[-1,1]){const v=[f[0]+Math.cos(N)*r*c,f[1]*(m===1?.38:1),f[2]+Math.sin(N)*r*c],F=Math.hypot(v[0],v[1],v[2]);x(W,[v[0]/F,v[1]/F,v[2]/F],A*e.range(.55,.75),m-1,S*.8,K)}};for(let w=0;w<s;w++){const f=e()*U,A=e.range(.05,.3),m=e.range(0,.12),S=[Math.cos(f)*A,1,Math.sin(f)*A],K=Math.hypot(S[0],1,S[2]);x([Math.cos(f)*m,-.03,Math.sin(f)*m],[S[0]/K,1/K,S[2]/K],o*e.range(.36,.5),2,.0075,e())}const D=new a.BufferGeometry;return D.setAttribute("position",new a.Float32BufferAttribute(h,3)),D.setAttribute("aTan",new a.Float32BufferAttribute(M,4)),D.setAttribute("aK",new a.Float32BufferAttribute(T,4)),D.setIndex(y),D}function ze(e){return new a.ShaderMaterial({uniforms:{...a.UniformsUtils.clone(a.UniformsLib.fog),...e},fog:!0,side:a.DoubleSide,vertexShader:`
attribute vec4 aTan, aK; uniform vec3 uAxis; uniform float uTime, uWindSpeed;
varying vec3 vWp; varying vec3 vK; varying float vGust;
#include <fog_pars_vertex>
void main(){
  #ifdef USE_INSTANCING
    mat4 M = modelMatrix * instanceMatrix;
  #else
    mat4 M = modelMatrix;
  #endif
  vec4 wp = M * vec4(position, 1.);
  vec3 T = mat3(M) * aTan.xyz; float sc = length(T); T /= max(sc, 1e-4);
  // wind: gusts run through the sward downwind; tips move most, tassels nod on top of that
  vec2 wd = uAxis.xz; float wl = length(wd); wd = wl > 1e-3 ? wd / wl : vec2(1., 0.);
  float run = dot(wp.xz, wd) * .35 - uTime * uWindSpeed * .45;
  float gust = sin(run) * .6 + sin(run * 2.3 + wp.x * .7) * .4;
  float h = aK.z * aK.z;
  wp.xz += wd * (.07 + .1 * gust) * h * sc + vec2(-wd.y, wd.x) * sin(uTime * 2.1 + wp.x * 3. + aK.w * 20.) * .012 * h;
  wp.xz += aK.y * vec2(sin(uTime * 3.1 + aK.w * 40. + wp.z * 5.), cos(uTime * 2.6 + aK.w * 33.)) * .012;
  vec3 ray = wp.xyz - cameraPosition; float d = length(ray);
  vec3 S = cross(T, ray); S /= max(length(S), 1e-4);
  float halfW = max(aK.x * sc, d * .0009);          // never thinner than about a pixel and a half
  wp.xyz += S * aTan.w * halfW;
  vWp = wp.xyz; vK = vec3(aK.y, aK.z, min(1., aK.x * sc / halfW)); vGust = gust * h;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
uniform vec3 uSunDir, uSunCol, uSky, uFill, uWarm, uGreen, uRust, uSpore; uniform float uSun;
varying vec3 vWp; varying vec3 vK; varying float vGust;
#include <common>
#include <fog_pars_fragment>
void main(){
  vec3 green = uGreen * mix(.62, 1.18, vK.y);
  vec3 alb = mix(green, mix(uSpore * vec3(.8, 1.12, 1.1), green, .3), vK.x * mix(.3, 1., vK.z));
  vec3 ray = normalize(vWp - cameraPosition + vec3(0., 1e-5, 0.));
  float back = max(dot(ray, uSunDir), 0.); back *= back;
  vec3 col = alb * (uSunCol * uSun * (.34 + .8 * back) * mix(.5, 1., vK.y) + (uSky + uFill) * .85 + uWarm * .6);
  gl_FragColor = vec4(col * mix(.8, 1., vK.z) * (1. + .22 * vGust), 1.);
  #include <fog_fragment>
}`})}function Ae(e,s,o,h=10){const y=[],L=[],p=[];for(let f=0;f<=24;f++){const A=.25+(h-.25)*Math.pow(f/24,1.35);for(let m=0;m<=60;m++){const S=m%60/60*U,K=Math.cos(S)*A,W=Math.sin(S)*A;let N=0;for(const c of o){const v=Math.max(Math.hypot(K-c.x,W-c.z)-c.r,0);N+=c.h*Math.exp(-v/(c.r*1.1+.25))}const r=1-X(h*.62,h,A);y.push(K,.03+(N+.05*e.fbm2(K*.5,W*.5,3)+.03)*r,W),L.push(r,Math.min(1,N*4))}}for(let f=0;f<24;f++)for(let A=0;A<60;A++){const m=f*61+A,S=m+60+1;p.push(m,m+1,S,S,m+1,S+1)}const x=new a.BufferGeometry;x.setAttribute("position",new a.Float32BufferAttribute(y,3)),x.setAttribute("aE",new a.Float32BufferAttribute(L,2)),x.setIndex(p),x.computeVertexNormals();const D=new a.ShaderMaterial({uniforms:{...a.UniformsUtils.clone(a.UniformsLib.fog),...s},fog:!0,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1,vertexShader:`
attribute vec2 aE; varying vec3 vWp, vN; varying vec2 vE;
#include <fog_pars_vertex>
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.); vWp = wp.xyz; vN = mat3(modelMatrix) * normal; vE = aE;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
uniform vec3 uSunDir, uSunCol, uSky, uFill, uWarm, uDark, uGreen, uRust, uBone; uniform float uSun;
varying vec3 vWp, vN; varying vec2 vE;
#include <common>
#include <fog_pars_fragment>
${ne}
vec3 pebble(vec2 p, float k){                       // one rounded stone per cell: rgb = colour key, shade, mask
  vec2 c = floor(p); float h = h31(vec3(c, k)), h2 = h31(vec3(c, k + 5.));
  vec2 f = fract(p) - .5 - (vec2(h, h2) - .5) * .36;
  float d = length(f * vec2(1., .8 + .4 * h2));
  return vec3(h, 1. - d * 1.6, 1. - smoothstep(.3, .4, d));
}
void main(){
  vec2 p = vWp.xz;
  vec2 pw = p + .22 * vec2(vn(vec3(p * 1.7, 0.)), vn(vec3(p * 1.7, 5.))) + .05 * vec2(vn(vec3(p * 9., 2.)), vn(vec3(p * 9., 8.)));
  vec3 a = pebble(pw * 6.3, 1.), b = pebble(mat2(.8, .6, -.6, .8) * pw * 10.7 + 3.7, 2.);
  vec3 pb = a.z > .5 ? a : b; float on = max(a.z, b.z);
  vec3 ochre = vec3(.42, .31, .16), slate = vec3(.2, .21, .25);
  vec3 stone = pb.x < .45 ? ochre : (pb.x < .8 ? slate : uRust * .8);
  stone *= mix(.75, 1.1, pb.x * 7. - floor(pb.x * 7.));
  float nearK = 1. / (1. + length(vWp - cameraPosition) * .03);
  vec3 alb = mix(vec3(.4, .34, .25), mix(vec3(.38, .32, .24), stone * (.75 + .5 * pb.y), .35 + .65 * nearK), on);
  float crust = smoothstep(.5, .62, fbm3(vec3(p * .45, 3.)));
  alb = mix(alb, uDark * 1.6 * mix(.7, 1.3, vn(vec3(p * 5., 1.))), crust * .45);
  float damp = smoothstep(.35, .65, fbm3(vec3(p * .3 + 20., 7.)) + vE.y * .5);
  alb = mix(alb, uGreen * .62 * mix(.7, 1.2, vn(vec3(p * 9., 4.))), damp * .5);
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
  float ndl = max(dot(N, uSunDir), 0.);
  vec3 col = alb * (uSunCol * ndl * uSun * mix(.75, 1.1, pb.y * on) + mix(uFill, uSky, .5 + .5 * N.y) + uWarm * .5);
  gl_FragColor = vec4(col, smoothstep(0., .6, vE.x));
  #include <fog_fragment>
}`}),w=new a.Mesh(x,D);return w.renderOrder=1,w.name="apron",w}async function ke(e,s,o,h,M){const T=new a.Group;T.name="surround";let y=0;const p=[{x:0,z:0,r:M.elderSpec.r0*(1+M.elderSpec.flare)*1.12,h:.3},...M.young.map(x=>({x:x.x,z:x.z,r:x.spec.r0*1.7,h:.14}))];if(M.apron){const x=Ae(o,h,p);T.add(x),y+=x.geometry.index.count/3}if(await e.yield(),M.sward){const x=ze(h),D=new a.Object3D,w=Math.round((M.swardCount??170)*M.detail);for(let f=0;f<2;f++){const A=Se(s,{stems:f?4:6,height:f?.5:.62}),m=new a.InstancedMesh(A,x,w);let S=0;for(let K=0;S<w&&K<w*12;K++){const W=Math.sqrt(s.range(1.2100000000000002,88.36000000000001)),N=s()*U,r=Math.cos(N)*W,c=Math.sin(N)*W,v=s.range(.7,1.3),F=s()*U,O=s();let B=o.fbm2(r*.22+9,c*.22,3)>-.12-.35*Math.exp(-W/3)&&O>X(6.5,9.6,W)*.85;for(const E of p)Math.hypot(r-E.x,c-E.z)<E.r+.12&&(B=!1);if(!B)continue;let I=0;for(const E of p){const t=Math.max(Math.hypot(r-E.x,c-E.z)-E.r,0);I+=E.h*Math.exp(-t/(E.r*1.1+.25))}D.position.set(r,.03+I*(1-X(6.2,10,W)),c),D.rotation.set(0,F,0),D.scale.setScalar(v*(1-.35*X(7,9.6,W))),D.updateMatrix(),m.setMatrixAt(S++,D.matrix),(S&63)===0&&await e.yield()}m.count=S,m.instanceMatrix.needsUpdate=!0,m.computeBoundingSphere(),m.name="psilophyton"+f,T.add(m),y+=S*A.index.count/3,await e.yield()}}return{object:T,triangles:y}}async function Fe(e,s,o,{rng:h=e.rng,noise:M=e.noise,variants:T=6,detail:y=1,pool:L=13,nearRadius:p=32}={}){const x=new a.Group;x.name="pillarField";const D=[],w=[],f=[],A=[];let m=0;const S=new a.Object3D,K=new a.Vector3,W=new a.Matrix4().makeScale(0,0,0),N=(t,z)=>{const l=h()*U,g=(t.height??5)/z.H,k=t.rotY??(t.leanTo!==void 0?z.leanAz-t.leanTo:l),u=t.thick?$(t.thick/(2*z.r0),g*.7,g*2.6):g;return S.position.set(t.x,t.y??0,t.z),S.rotation.set(0,k,0),S.scale.set(u,g,u),S.updateMatrix(),{sc:g,sg:u,ry:k}},r=(t,z,l,g,k)=>{K.fromArray(l.userData.top).applyMatrix4(S.matrix),t.veil!==0&&D.push({pos:K.toArray(),length:t.veil??h.range(30,60),delay:t.delay??h(),radius:l.userData.rTop*g.sg,gain:t.gain??1.25}),w.push({spec:z,x:t.x,z:t.z,rotY:g.ry,scale:g.sc,girth:g.sg/g.sc,rows:(t.lod??0)<0?4:void 0}),f.push({item:t,spec:z,scale:g.sc,mesh:k,top:K.toArray()})},c=o.filter(t=>(t.lod??0)<0&&!t.fallen),v=Math.min(T,c.length);for(let t=0;t<v;t++){const z=c.filter((i,d)=>d%v===t),l=ee(h,{height:6.5,top:t%3===2?"hollow":void 0}),g=ae(l,M,-1),k=new a.InstancedMesh(g,J(s,{seed:l.seed,height:l.H,flutes:26,bands:1}),z.length),u=new Float32Array(z.length*2);z.forEach((i,d)=>{const b=N(i,l);k.setMatrixAt(d,S.matrix),u[d*2]=h()*97,r(i,l,g,b)}),g.setAttribute("iSeed",new a.InstancedBufferAttribute(u,2)),k.instanceMatrix.needsUpdate=!0,k.frustumCulled=!1,x.add(k),m+=g.userData.triangles*z.length,await e.yield()}const F=o.filter(t=>(t.lod??0)>=0&&(t.lod??0)<2&&!t.fallen);if(F.length){const t=[],z=async(l,g)=>{const k=ee(h,l),u=await te(k,M,1,e.yield);await e.yield();const i=ae(k,M,-.5),d=ae(k,M,-.25);t.push({sp:k,g1:u,g1b:null,g0:i,gm:d,kind:g,mine:[]}),await e.yield()};for(let l=0;l<L;l++)await z({height:Q(5.2,8.8,l/Math.max(L-1,1)),top:["slant","notch","hollow","slant"][l%4]},"tall");for(let l=0;l<3;l++)await z({height:1.3+.45*l,lean:h.range(2,7)},"young");for(let l=0;l<2;l++)await z({height:2.2+.7*l,thick:1.15,top:"hollow",taper:.86},"stump");for(const l of F){const g=l.height??6,k=l.top==="hollow"&&g<4?"stump":g<2.6?"young":"tall",u=t.filter(i=>i.kind===k).sort((i,d)=>Math.abs(i.sp.H-g)-Math.abs(d.sp.H-g)).slice(0,k==="tall"?4:3);u[Math.floor(h()*u.length)%u.length].mine.push(l)}for(const l of t){if(!l.mine.length){l.g1.dispose(),l.g0.dispose(),l.gm.dispose();continue}const k=l.mine.filter(d=>(d.lod??0)>=.5),u=l.mine.filter(d=>(d.lod??0)<.5);k.some(d=>d.lod<1)&&(l.g1b=await te(l.sp,M,.5,e.yield),await e.yield());const i=J(s,{seed:l.sp.seed,height:l.sp.H,flutes:30});for(const[d,b]of[[k,l.g0],[u,l.gm]]){if(!d.length){b.dispose();continue}const n=new a.InstancedMesh(b,J(s,{seed:l.sp.seed,height:l.sp.H,flutes:26,bands:1}),d.length),V=new Float32Array(d.length*2);d.forEach((C,P)=>{const G=N(C,l.sp),_=h()*97;if(n.setMatrixAt(P,S.matrix),V[P*2]=_,b===l.gm){r(C,l.sp,l.g1,G,null);return}const R=C.lod<1?l.g1b:l.g1,H=new a.Mesh(R,i);H.onBeforeRender=()=>{i.uniforms.uSeed.value=_,i.uniformsNeedUpdate=!0},H.matrixAutoUpdate=!1,H.matrix.copy(S.matrix),H.visible=!1,x.add(H),r(C,l.sp,R,G,H),A.push({near:H,farMesh:n,i:P,m:S.matrix.clone(),x:C.x,z:C.z,on:!1})}),b.setAttribute("iSeed",new a.InstancedBufferAttribute(V,2)),n.instanceMatrix.needsUpdate=!0,n.frustumCulled=!1,x.add(n),m+=b.userData.triangles*d.length}await e.yield()}}for(const t of o){if(!(t.lod>=2)&&!t.fallen)continue;const z=ee(h,{height:t.height??7,top:t.top,fallen:t.fallen,thick:t.thick,lean:t.lean,leanAz:t.leanAz,curve:t.curve}),l=await te(z,M,t.fallen?t.lod??2:2,e.yield),g=new a.Mesh(l,J(s,{seed:z.seed,height:z.H,flutes:38})),k=t.rotY??h()*U;if(t.fallen?(g.rotation.set(0,k,-Math.PI/2+.03,"YXZ"),g.position.set(t.x,(t.y??0)+z.r0*.92,t.z)):(g.rotation.y=k,g.position.set(t.x,t.y??0,t.z)),g.updateMatrix(),x.add(g),m+=l.userData.triangles,!t.fallen){if(K.fromArray(l.userData.top).applyMatrix4(g.matrix),t.veil!==0){const u={pos:K.toArray(),length:t.veil??h.range(30,60),delay:t.delay??h(),radius:l.userData.rTop,gain:t.gain??1.6};D.push(u,{...u})}w.push({spec:z,x:t.x,z:t.z,rotY:k,scale:1})}f.push({item:t,spec:z,scale:1,mesh:g}),await e.yield()}if(D.length){const t=he(s,D,{rng:h,perPillar:12,motes:30,detail:y});x.add(t.object),m+=t.triangles}if(await e.yield(),w.length){const t=ve(s,w,M);x.add(t),m+=t.geometry.index.count/3}await e.yield();const O=p*p,B=(p+5)*(p+5),I=new Set;return{object:x,tops:D,specs:f,triangles:m,update:(t,z)=>{for(const l of A){const g=(l.x-t)*(l.x-t)+(l.z-z)*(l.z-z),k=l.on?g<B:g<O;k!==l.on&&(l.on=k,l.near.visible=k,l.farMesh.setMatrixAt(l.i,k?W:l.m),I.add(l.farMesh))}if(I.size){for(const l of I)l.instanceMatrix.needsUpdate=!0;I.clear()}}}}export{le as PILLAR_PALETTE,Le as buildHero,Te as dirFog,Fe as makePillarField,ve as makeShadows,xe as makeShared,he as makeVeils,ae as pillarGeometry,te as pillarGeometryAsync,J as pillarMaterial,ee as pillarSpec,Se as psilophytonGeometry,ze as swardMaterial};
