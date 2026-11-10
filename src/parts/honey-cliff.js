import*as w from"three";const rt=["#D01F2B","#2E5C8A","#C08A4A","#F2A51E","#1E1712","#EADBA8","#DCE8F2"],ye=210,Te=110,Je=-70,ht=300,Qe=330,Ve=38,Ze=34,ve=26,ft=22,Be=Math.PI/2,de=80,K=(e,t,o)=>{const c=Math.min(1,Math.max(0,(o-e)/(t-e)));return c*c*(3-2*c)};function ae(e){const t=Math.cos(Math.min(1,Math.max(-1,e/260))*Be);return-40*t*t}function dt(e){return Math.abs(e)>=260?0:40*(Be/260)*Math.sin(2*e/260*Be)}function Fe(e){return .22+.78*(1-K(215,300,Math.abs(e)))}const Me=`
uniform vec3 uSunDir, uSunL, uSunCol, uSkyCol, uBounceCol;
uniform float uTime, uCalm, uShadowK;
uniform vec4 uWave[4];
uniform vec2 uAbs;
float hash11(float n){ return fract(sin(n*12.9898)*43758.5453); }
float hash21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
float zBackF(float x){ float c = cos(clamp(x/260., -1., 1.)*1.5707963); return -40.*c*c; }
float jutG(float x){ return 0.22 + 0.78*(1. - smoothstep(215., 300., abs(x))); }
// 1 = sunlit, 0 = in the shadow of a roof (hero-local point)
float roofLit(vec3 p){
  float j = jutG(p.x), zb = zBackF(p.x);
  float hU = ${ye}. - p.y, dU = max(zb + ${Ve}.*j - p.z, 0.);
  float lU = smoothstep(-1.6, 1.6, hU - dU*uShadowK);
  lU = mix(lU, 1., step(hU, -1.));
  float hL = ${Te}. - p.y, dL = max(zb + ${Ze}.*j - p.z, 0.);
  float lL = smoothstep(-1.6, 1.6, hL - dL*uShadowK);
  lL = mix(lL, 1., step(hL, -1.));
  return mix(lU*lL, 1., smoothstep(332., 350., abs(p.x)));
}
// defence wave: 0..1 abdomen flip at a hero-local point; jit delays one bee against its neighbours
float waveAt(vec2 p, float jit){
  float f = 0.;
  for (int i = 0; i < 4; i++){
    vec4 w = uWave[i];
    float x = w.w*45. - distance(p, w.xy) - jit*1.6;
    float pulse = smoothstep(0., 2., x)*(1. - smoothstep(5.5, 11., x));
    f = max(f, pulse*step(0., w.w)*(1. - smoothstep(420., 560., w.w*45.)));
  }
  return f;
}
vec3 sunShade(vec3 alb, vec3 N, vec3 V, float lit, float gloss, float spec){
  float ndl = max(dot(N, uSunDir), 0.);
  vec3 amb = mix(uBounceCol, uSkyCol, N.y*0.5 + 0.5) + uSunCol*vec3(0.075, 0.066, 0.058)*(1. - lit);   // under a roof the sunlit rock below throws warm light up
  vec3 H = normalize(uSunDir + V + vec3(0., 1e-4, 0.));
  return alb*(uSunCol*ndl*lit + amb) + uSunCol*spec*pow(max(dot(N, H), 0.), gloss)*lit*step(0.001, ndl);
}
`,pt=`
// c = (cx, d, side, rho); k = (index, seed, crown depth, coverage)
float curtain(vec4 c, vec4 k, float bareTop){
  float wob = 0.05*sin(c.x*0.31 + k.y*17.) + 0.04*sin(c.y*0.42 + k.y*31. + c.x*0.11) + 0.03*sin(c.x*0.9 - c.y*0.7 + k.y*5.);
  float edge = 0.87 + 0.8*wob - (1. - k.w)*0.22 - (1. - c.z)*0.03;
  float m = 1. - smoothstep(edge - 0.045, edge + 0.045, c.w);
  float top = bareTop*(1. + 1.5*wob);
  m *= smoothstep(top - 1.6, top + 1.6, c.y + 0.01);
  float fr = uAbs.y*(60.) - 6.;
  m *= mix(1., smoothstep(fr, fr + 5., c.y), step(abs(k.x - uAbs.x), 0.5));
  return m;
}
`;function mt(e,t,o,c,d){const s=d.seed,a=.05*Math.sin(e*.31+s*17)+.04*Math.sin(t*.42+s*31+e*.11)+.03*Math.sin(e*.9-t*.7+s*5),h=.87+.8*a-(1-d.cover)*.22-(1-o)*.03;let n=1-K(h-.045,h+.045,c);const p=d.bareTop*(1+1.5*a);return n*=K(p-1.6,p+1.6,t+.01),n}function ut(e,t){const o=[180,108,38,-42,-116,-184],c=[30,30,28.5,26,28.5,30],d=[];for(let s=0;s<12;s++){const a=s<6,h=a?o[s]:216-(s-6)*72+e.range(-4,4),n=a?c[s]+e.range(-.8,.8):e.range(22,31),p=a?e.range(38,42):e.range(28,41),i=dt(h),b=1/Math.hypot(1,i),l={index:s,tier:a?0:1,x:h,hw:n,dep:p,top:(a?ye:Te)+1.2,z:ae(h)+(a?ve:ft),t:new w.Vector3(b,0,i*b),n:new w.Vector3(-i*b,0,b),seed:e(),lop:e.range(-.07,.07),ph:[e.range(0,6.28),e.range(0,6.28),e.range(0,6.28)],crown:(a?e.range(13,17):e.range(9,14))*(t==="autumn"?1.6:1),cover:e.range(.72,1),bareTop:(e.chance(.45)?e.range(10.5,13.5):e.range(8.5,11))*(a?1:.7),age:e.range(0,1)};s===3&&(l.bareTop=e.range(13,15.5),l.crown=Math.max(l.crown,17),l.cover=.95,l.age=.15),s===5&&(l.crown=Math.max(l.crown,19),l.bareTop=7+e.range(0,3),l.cover=.9),s<=2&&(l.cover=s?e.range(.9,1):Math.max(l.cover,.9),l.bareTop=Math.min(l.bareTop,10.5)),d.push(l)}return d}function Le(e,t){const o=Math.cos(t),c=Math.sin(t),s=1+(1+.035*Math.sin(3*t+e.ph[0])+.025*Math.sin(5*t+e.ph[1])+.012*Math.sin(11*t+e.ph[2])-1)*Math.min(1,c*4),a=e.dep*c*s;return[e.hw*Math.sign(o)*Math.pow(Math.abs(o),1.24)*s+e.lop*a,a]}function we(e,t,o,c){const d=1-K(e.crown*.55,e.crown*1.2,c),s=.12*Math.sin(o*.55+e.seed*40)*Math.sin(c*.47+e.seed*9),a=.8+2.3*d+s,h=Math.sqrt(Math.max(0,1-Math.pow(t,6)));return .16+a*h*(.35+.65*K(0,3,c+1.2))}function Pe(e,t,o){if(o<=.001)return Math.abs(t)/e.hw;let c=5e-4,d=Math.PI-5e-4;for(let a=0;a<22;a++){const h=(c+d)/2,n=Le(e,h);t*n[1]-o*n[0]>0?d=h:c=h}const s=Le(e,(c+d)/2);return Math.hypot(t,o)/Math.max(.001,Math.hypot(s[0],s[1]))}function ee(e,t,o,c,d){return d.set(e.x+e.t.x*t+e.n.x*c,e.top-o,e.z+e.t.z*t+e.n.z*c)}function Ie(e,t){return e.r*(1+.11*Math.sin(3*t+e.p1)+.07*Math.sin(7*t+e.p2)+.035*Math.sin(13*t+e.p3)+.38*K(.3,1,Math.sin(t)))}function vt(){const e=[],o=ae(-140)+ve+90,c=38,d=ae(38)+ve,s=Math.hypot(c- -140,d-o),a=[(c- -140)/s,(d-o)/s],h=[-140-a[0]*254,o-a[1]*254],p=[(u=>[h[0]+a[0]*u,180.3,h[1]+a[1]*u])(130),[-230,181.5,152],[-218,183.5,129],[-211,185.5,108],[-204,187,91],[-190,188,76],[-166,187.5,65],[-130,184,56],[-88,175.5,49],[-46,166,46],[-4,159.5,46],[32,157,47],[60,156.5,50],[99.3,155,76],[138.6,151,102],[177.9,146,127.9],[217.2,140,153.9],[260,134,182],[283,131,188],[302,129.5,176],[306.5,130,154],[288,141,126],[268,155,102],[249,169,80],[234,180,62.5],[223,185.4,49.5],[213,187.1,40],[203,187.45,34.94]];for(const u of p)e.push([u[0],u[1],u[2]]);const i={comb6:4,north:7,tiers:12,vista:15,far:20,ladder:e.length-3,pass:e.length},b=u=>ae(u)+ve,l=(u,j,W)=>e.push([u,j,b(u)+W]),v=(u,j,W,z,R)=>(u+j)/2+(u-j)/2*Math.cos(Math.PI*(W-R)/(W-z)),m=u=>u>203?13.5-16*K(203,243,u):u>176?v(13.5,9,203,176,u):u>140?v(9,19.5,176,140,u):u>104?v(19.5,8.5,140,104,u):u>70?v(8.5,19.5,104,70,u):v(19.5,8.8,70,34,u);let f=e.length;for(let u=194;u>=34;u-=9)u===140&&(f=e.length),l(u,187+2.6*K(240,100,u),m(u));l(34,189.6,8.8),l(21,189.7,8.2),l(8.5,190.2,5),l(-3,191.2,-.5),l(-13.5,192.6,-7.5),l(-25,193.8,-13.6),l(-40,194.6,-15.8),l(-56,193.6,-12.5),l(-68,192,-8),l(-78,190.3,0),l(-87,189.2,7.5),l(-96,188.2,12.5),l(-106,187.6,15),l(-119,187.8,15.8),l(-132,188.6,17.5);const g=Math.cos(18*Math.PI/180),P=Math.sin(18*Math.PI/180),T=82*Math.PI/180,V=new w.Vector3(-Math.cos(T)*g,-P,-Math.sin(T)*g),D=-190,F=new w.Vector3(D,182.5,ae(D)),N=-42,C=new w.Vector3().copy(F).addScaledVector(V,N),X=V.x/g,Y=V.z/g,Q=24,M=[C.x-Y*Q,C.z+X*Q];[[132,.5],[99,2.6],[66,3.4],[33,2.2]].forEach(([u,j])=>{const W=u*Math.PI/180,z=Math.cos(W),R=Math.sin(W),_=C.x-M[0],G=C.z-M[1];e.push([M[0]+_*z+G*R,C.y+j,M[1]-_*R+G*z])});for(const u of[N,-26,-10,6,24,42,60,de])e.push([F.x+V.x*u,F.y+V.y*u,F.z+V.z*u]);return{pts:e,secondPassStart:f,mouth:F,dir:V,portal:new w.Vector3().copy(F).addScaledVector(V,de),entry:{S:h,d0:a},route:i}}function Ce(e={}){const t=[],o=[],c={};for(const d in e)c[d]=[];return{pos:t,idx:o,att:c,extra:e,v(d,s,a,h={}){t.push(d,s,a);for(const n in e){const p=h[n];for(let i=0;i<e[n];i++)c[n].push(p?p[i]??0:0)}return t.length/3-1},tri(d,s,a){o.push(d,s,a)},quad(d,s,a,h){o.push(d,s,a,d,a,h)},geometry(d=!0){const s=new w.BufferGeometry;s.setAttribute("position",new w.Float32BufferAttribute(t,3));for(const a in e)s.setAttribute(a,new w.Float32BufferAttribute(c[a],e[a]));return s.setIndex(o),d&&s.computeVertexNormals(),s}}}function wt(e,t){const o=t-180;return 7*K(-12,12,e-150-.25*o)-9*K(-13,13,e+20+.35*o)+6*K(-11,11,e+262-.2*o)}function Ae(e,t){return t+.06*e+5.5*Math.sin(e*.0113+1.3)+2.4*Math.sin(e*.031+.4)+wt(e,t)}function qe(e){return e*.15+.964*Math.sin(e*.112+.935)+.084*Math.sin(e*.19+2.1)}function et(e){return .15+.108*Math.cos(e*.112+.935)+.016*Math.cos(e*.19+2.1)}function je(e){return .62*Math.sin(e*2.399+.5)+.38*Math.sin(e*5.71+1.9)}function tt(e,t,o){const c=Ae(e,t),d=qe(c),s=Math.floor(d),a=d-s,h=1/Math.max(et(c),.03);return o[0]=1.9*je(s)-1.1*(1-K(0,Math.min(.14,3/h),a))-.7*K(1-Math.min(.18,3/h),1,a),o[1]=s,o[2]=a,o[3]=0,o}const xt=`
float bedO(float i){ return 0.62*sin(i*2.399 + 0.5) + 0.38*sin(i*5.71 + 1.9); }
float bedWarp(vec3 P){ float k = P.y - 180.;
  return P.y + 0.06*P.x + 5.5*sin(P.x*0.0113 + 1.3) + 2.4*sin(P.x*0.031 + 0.4)
    + 7.*smoothstep(-12., 12., P.x - 150. - 0.25*k) - 9.*smoothstep(-13., 13., P.x + 20. + 0.35*k) + 6.*smoothstep(-11., 11., P.x + 262. - 0.2*k); }
float bedC(float yw){ return yw*0.15 + 0.964*sin(yw*0.112 + 0.935) + 0.084*sin(yw*0.19 + 2.1); }
float bedDc(float yw){ return 0.15 + 0.108*cos(yw*0.112 + 0.935) + 0.016*cos(yw*0.19 + 2.1); }
`;function ke(e){const t=Math.cos(e),o=Math.sin(e),c=o>0?15.5:21;return 1/Math.pow(Math.pow(Math.abs(t/12.5),2.2)+Math.pow(Math.abs(o/c),2.2),1/2.2)*(1+.085*Math.sin(3*e+.7)+.06*Math.sin(5*e+2.1)+.04*Math.sin(9*e+4)+.03*Math.sin(14*e+1.3))}const bt=`
float holeR(float phi){
  float c = cos(phi), si = sin(phi), b = si > 0. ? 15.5 : 21.;
  float r = 1./pow(pow(abs(c/12.5), 2.2) + pow(abs(si/b), 2.2) + 1e-9, 1./2.2);
  return r*(1. + 0.085*sin(3.*phi + 0.7) + 0.06*sin(5.*phi + 2.1) + 0.04*sin(9.*phi + 4.) + 0.03*sin(14.*phi + 1.3));
}
`;function Ee(e){const t=Fe(e),o=Ze*t,c=Ve*t;return[[26,Je],[14,-35],[5,0],[1,35],[0,70],[0,100],[.3,108.5],[o*.25,110.2],[o*.6,110.6],[o*.92,111.6],[o+.5,115.5],[o*.9,122],[o*.55,128],[o*.2,135],[.5,145],[0,160],[0,185],[0,203],[.3,208.6],[c*.25,210.2],[c*.6,210.6],[c*.93,211.8],[c+1,216.5],[c-1.5,228],[c-6,250],[c-13,275],[c-22,ht]]}const ot=[10,10,10,10,9,3,2,1,2,2,5,6,7,8,8,14,10,3,2,1,2,2,4,6,7,7];function at(e,t,o,c,d,s,a){const h=Math.max(0,-d),n=1-K(.45,.95,Math.abs(d)),p=e.fbm3(t*.011,o*.022,c*.02,4),i=e.ridged2(t*.016+7,o*.0035,3),b=e.n3(t*.07,o*.11,c*.07),l=1+1.7*K(222,262,o)+1.3*K(100,55,o),v=tt(t,o,gt);let m=(3.4*p*l+2.6*(i-.4)*l+.5*b)*(1-.72*h)+v[0]*(.25+.75*n)*(1-h);const f=Ae(t,o),g=1/Math.max(.075,et(f));m+=K(.3,.62,d)*(v[2]-.5)*Math.min(g,9)*.6;const P=Math.max(0,1-Math.abs(o-ye)/7)+Math.max(0,1-Math.abs(o-Te)/7);return m*=1-.55*Math.min(1,P),a&&(a[0]=(3.4*p*l+2.6*(i-.4)*l)*(1-.72*h)*(1-.55*Math.min(1,P))*s),m*s}const gt=[0,0,0,0];async function yt(e,t,o,c){const s=Ce({color:3}),a=[],h=[0],n=ot.reduce((b,l)=>b+l,0)+1;for(let b=0;b<=176;b++){const l=-Qe+2*Qe*b/176,v=Ee(l),m=ae(l);for(let f=0;f<v.length;f++){const g=f===v.length-1,P=g?1:ot[f];for(let T=0;T<P;T++){const V=g?0:T/P,D=v[f],F=g?v[f]:v[f+1],N=D[0]+(F[0]-D[0])*V,C=D[1]+(F[1]-D[1])*V,X=v[Math.max(0,f-(T===0?1:0))],Y=v[Math.min(v.length-1,f+1)];let Q=Y[0]-X[0],M=Y[1]-X[1];const u=Math.hypot(Q,M)||1;Q/=u,M/=u;const j=M,W=-Q,z=Math.max(0,-W),R=o(l,C);let _=at(t,l,C,N,W,R,h);const G=_;if(C>150&&C<218&&R>.5)for(let H=0;H<4;H++){const B=c(l,C+W*_,m+N+j*_);if(B>=7.2)break;_-=(7.3-B)*1.15}const J=.5+.5*t.fbm2(l*.008+3,C*.012,3),q=.5+.5*t.n2(l*.05,C*.012+9);s.v(l,C+W*_,m+N+j*_,{color:[J,q,z]});const U=h[0]+_-G;a.push(l,C+W*U,m+N+j*U)}}await e.yield()}for(let b=0;b<176;b++)for(let l=0;l<n-1;l++){const v=b*n+l,m=v+n;s.quad(v,m,m+1,v+1)}await e.yield();const p=s.geometry(!1);await e.yield();const i=new w.BufferGeometry;return i.setAttribute("position",new w.Float32BufferAttribute(a,3)),i.setIndex(p.index),await e.yield(),i.computeVertexNormals(),await e.yield(),p.setAttribute("normal",i.attributes.normal),p}function _e(e,t,o){const c=9.8+4.2*(1-K(0,60,t)),d=9.8+9.5*(1-K(0,66,t)),s=Math.cos(o),a=Math.sin(o),h=1/Math.pow(Math.pow(Math.abs(s/c),2.6)+Math.pow(Math.abs(a/d),2.6),1/2.6),n=e.fbm3(s*2.2+11,a*2.2,t*.09,3);return h+2.4*Math.abs(n)*K(-3,6,t)+.5*Math.abs(e.n3(s*2.6,a*2.6+5,t*.4))}function Mt(e,t,o){return ke(o)+(_e(e,t,o)-ke(o))*K(1,11,t)}function De(e){const t=e.dir,o=new w.Vector3().crossVectors(t,new w.Vector3(0,1,0)).normalize(),c=new w.Vector3().crossVectors(o,t).normalize();return{d:t,r:o,u:c,at:(s,a,h,n)=>n.copy(e.mouth).addScaledVector(t,s).addScaledVector(o,Math.cos(a)*h).addScaledVector(c,Math.sin(a)*h)}}function Pt(e,t){const o=new w.Vector3;return(c,d)=>{let s=0;for(let a=0;a<5;a++)e.at(s,c,d,o),s+=(o.z-t(o.x,o.y))/Math.max(.3,-e.d.z);return s}}async function kt(e,t,o,c){const d=De(o),s=Ce({color:3}),a=48,h=new w.Vector3,n=[[4.6,1.2],[3,-.7],[1.5,-1.5],[.3,-1],[-.15,.6]],p=[];for(let m=16;m<=de+4.01;m+=3)p.push(m);const i=n.length+3+p.length,b=[];for(let m=0;m<a;m++){const f=m/a*Math.PI*2;b.push(c(f,ke(f)))}await e.yield();for(let m=0;m<i;m++)for(let f=0;f<=a;f++){const g=f%a/a*Math.PI*2,P=Math.cos(g),T=Math.sin(g),V=ke(g),D=b[f%a];let F,N;if(m<n.length)N=V+n[m][0]+(m>0&&m<4?.5*t.n3(P*3,T*3,m*.7):0),F=D+n[m][1];else if(m<n.length+3){const C=(m-n.length+1)/3;F=D+.6+(13-D-.6)*C,N=V-.15+(_e(t,F,g)-V+.15)*K(0,1,C)}else F=p[m-n.length-3],N=_e(t,F,g);d.at(F,g,N,h),s.v(h.x,h.y,h.z,{color:[.45+.25*t.n3(P*1.5,T*1.5,F*.08),.5+.5*t.n3(P*2,T*2+9,F*.05),0]}),f===a&&(m&3)===3&&await e.yield()}for(let m=0;m<i-1;m++)for(let f=0;f<a;f++){const g=m*(a+1)+f,P=g+a+1;s.quad(g,g+1,P+1,P)}await e.yield();const l=s.v(o.mouth.x+d.d.x*(de+7),o.mouth.y+d.d.y*(de+7),o.mouth.z+d.d.z*(de+7),{color:[.1,.5,0]}),v=(i-1)*(a+1);for(let m=0;m<a;m++)s.tri(v+m,v+m+1,l);return s.geometry()}const Re=`
attribute vec3 color;
varying vec3 vLocal, vWorld, vN, vNL, vTone;
#include <fog_pars_vertex>
void main(){
  vLocal = position; vTone = color; vNL = normal;
  vec4 wp = modelMatrix*vec4(position, 1.);
  vWorld = wp.xyz; vN = mat3(modelMatrix)*normal;
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Ke=`
${Me}
${xt}
${bt}
uniform vec3 uRock, uPale, uPortalPos, uPortalCol, uGlowPos, uGlowCol, uWinPos, uWinCol, uMouth, uMr, uMu, uMd;
uniform vec4 uCombA[12];
uniform vec4 uCleft, uHaze, uSea;               // uCleft: 1 = the cliff (cut the mouth), how strongly the beds show, 1 = the cleft mesh. uHaze: aerial haze (rock beyond the slab)
uniform float uWet;
varying vec3 vLocal, vWorld, vN, vNL, vTone;
#include <fog_pars_fragment>
float vnoise(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  float n = dot(i, vec3(1., 57., 113.));
  return mix(mix(mix(hash11(n), hash11(n + 1.), f.x), mix(hash11(n + 57.), hash11(n + 58.), f.x), f.y),
             mix(mix(hash11(n + 113.), hash11(n + 114.), f.x), mix(hash11(n + 170.), hash11(n + 171.), f.x), f.y), f.z);
}
float fbm(vec3 p){ return 0.5*vnoise(p) + 0.25*vnoise(p*2.03 + 3.1) + 0.125*vnoise(p*4.1 + 7.7) + 0.0625*vnoise(p*8.3 + 1.3); }
vec2 vor(vec2 p){   // x: half the gap between the two nearest cell centres (0 on a cell's edge); y: the cell's own number
  vec2 ip = floor(p), fp = p - ip; float d1 = 8., d2 = 8., id = 0.;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){
    vec2 g = vec2(float(i), float(j));
    float hh = hash21(ip + g);
    float d = length(g + vec2(hh, fract(hh*57.31 + 0.37)) - fp);
    float n = step(d, d1);
    d2 = min(d2, max(d, d1)); id = mix(id, hh, n); d1 = min(d1, d);
  }
  return vec2(0.5*(d2 - d1), id);
}
void main(){
  vec3 P = vLocal;
  // the mouth of the cleft is a ragged crack; the collar of the cleft mesh covers the cut
  vec3 qm = P - uMouth; vec2 mb = vec2(dot(qm, uMr), dot(qm, uMu));
  float mrho = length(mb), mEdge = mrho - holeR(atan(mb.y, mb.x + step(mrho, 1e-4)*1e-3));
  float mAx = dot(qm, uMd), nearMouth = step(abs(mAx), 16.);
  if (uCleft.x > 0.5 && mEdge < 1.3 && nearMouth > 0.5) discard;
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vWorld + vec3(0., 1e-4, 0.));
  float under = smoothstep(0.35, 0.8, -N.y), top = smoothstep(0.35, 0.8, N.y);
  float bedK = uCleft.y, wallW = (1. - under)*(1. - 0.7*top)*bedK;
  float fwP = length(fwidth(P)) + 1e-5;
  float lod1 = 1. - smoothstep(0.25, 1.1, fwP), lod2 = 1. - smoothstep(0.08, 0.4, fwP), lod3 = 1. - smoothstep(0.015, 0.07, fwP);
  float lodB = 1. - smoothstep(0.6, 2.4, fwP);                                       // far away the beds melt into an average
  // ---- the beds: tone bed by bed, bedding planes, joints, laminae ----
  float yw = bedWarp(P) + 1.2*(vnoise(P*vec3(0.05, 0.02, 0.05)) - 0.5);
  float bc = bedC(yw), bedI = floor(bc), bedF = bc - bedI;
  float T = 1./max(bedDc(yw), 0.03);                                                // thickness of this bed, metres
  float massive = smoothstep(7., 15., T);                                           // the 20 to 30 m beds are plain; the thin stacks are laminated
  float bedVis = 1. - smoothstep(0.1, 0.4, fwP/T);                                  // a bed under three pixels thick melts into the face: from far off only the great beds show
  float wE = max(0.16, fwP*1.3);
  float pxB = fwidth(bc)*T + 1e-4;                                                  // one pixel, measured ACROSS the beds, in metres
  // tone bed by bed, eased across each bedding plane so the edge never stair-steps
  float eF = clamp(wE*1.3/T, 0.004, 0.45), tUp = smoothstep(1. - eF, 1., bedF)*0.5, tDn = (1. - smoothstep(0., eF, bedF))*0.5;
  float hb1r = hash11(bedI*1.31 + 7.);
  float hb1 = mix(mix(hb1r, hash11((bedI + 1.)*1.31 + 7.), tUp), hash11((bedI - 1.)*1.31 + 7.), tDn);
  float hb2 = mix(mix(hash11(bedI*2.17 + 3.), hash11((bedI + 1.)*2.17 + 3.), tUp), hash11((bedI - 1.)*2.17 + 3.), tDn);
  hb1 = mix(0.42, hb1, bedVis); hb2 = mix(0.55, hb2, bedVis);
  float sideF = 1. - 0.9*smoothstep(0.6, 0.9, abs(normalize(vNL + vec3(0., 1e-5, 0.)).x));                             // a face seen end-on to the beds (a buttress side) carries no painted courses
  wallW *= sideF;
  float shade0 = 1. - roofLit(P);                                                    // under a roof everything is softer
  // (how strongly a bedding plane is cracked belongs to the PLANE, not to the bed on either side of it: a value that
  // changed at the plane itself cut every crack in two along its middle, and the bump made dashes of the cut)
  float planeI = floor(bc + 0.5);
  float alongK = (0.5 + 0.5*smoothstep(0.3, 0.62, vnoise(vec3(P.x*0.07, planeI*3.1, 1.))))*(0.6 + 0.4*step(0.35, hash11(planeI*5.3 + 2.)))*bedVis;
  float crackD = min(bedF, 1. - bedF)*T, crackW = max(wE*(1.5 + 2.*shade0), 2.2*pxB);
  float crack = (1. - smoothstep(min(wE*0.4, crackW*0.3), crackW, crackD))*lodB*alongK*(1. - 0.35*shade0);
  // THE BUMP IS BAND-LIMITED. Screen derivatives are taken per 2x2 block of pixels, so any feature of the height field
  // narrower than about four pixels shades as a row of dashes. Every line that goes into the height is therefore a
  // groove at least 4.5 px wide on each side (crackH, jointH, the lamina steps, the plate edges); the thin lines
  // themselves (cracks, partings, hairlines, pocks) are drawn in the colour only, where each pixel is its own.
  float crackH = (1. - smoothstep(0., max(crackW, 4.5*pxB), crackD))*lodB*alongK*(1. - 0.35*shade0);
  // joints: no blocks. In the thicker beds a few short cracks open, each leaning 10 to 25 degrees its own way, wandering,
  // and dying out inside the bed well short of its bedding planes: nothing ever meets a bedding plane, least of all squarely
  float hgt = (bedF - 0.5)*T;
  float jLean = mix(0.19, 0.46, hash11(bedI*3.7 + 1.))*(hash11(bedI*1.9 + 4.) < 0.3 ? -1. : 1.);
  float jq = (P.x + jLean*hgt + 3.2*vnoise(vec3(P.x*0.021, P.y*0.1, bedI*1.3)))*0.019 + 3.1*sin(bedI*4.3);
  jq += 0.3*sin(jq*2.3 + bedI*2.1);
  float jI = floor(jq + 0.5), jd = abs(jq - jI)/0.019;
  float jOn = step(0.5, hash11(jI*7.3 + bedI*1.7)), jA = hash11(jI*3.1 + bedI*5.9);
  float jFade = smoothstep(0.08 + 0.3*jA, 0.3 + 0.3*jA, bedF)*(1. - smoothstep(0.55 + 0.25*jA, 0.8 + 0.18*jA, bedF));
  float jK = jOn*jFade*lodB*smoothstep(4.5, 9., T)*0.8, jPx = min(fwidth(jq), 0.03)/0.019;
  float joint = (1. - smoothstep(wE*0.4, max(wE*1.6, 2.2*jPx), jd))*jK, jointH = (1. - smoothstep(0., max(wE*1.6, 4.5*jPx), jd))*jK;
  // master joints: a few wandering cracks that run through many beds, each leaning 10 to 23 degrees, fading in and out
  float mjx = P.x + 0.3*(P.y - 180.) + 9.*vnoise(vec3(P.x*0.006, P.y*0.035, 1.)) + 2.6*vnoise(vec3(P.x*0.03, P.y*0.16, 5.));
  float mjc = mjx/72. + 0.33*sin(mjx*0.031), mjI = floor(mjc + 0.5);
  float mjs = (mjc - mjI)*72. + 0.12*(2.*hash11(mjI*5.3 + 1.) - 1.)*(P.y - 180.), mjd = abs(mjs);
  float mjOn = step(0.3, hash11(mjI*7.1 + 2.))*smoothstep(0.3, 0.55, vnoise(vec3(mjI*3.3, P.y*0.013, 8.)));
  float master = (1. - smoothstep(wE*0.6, wE*2.4 + 0.25, mjd))*mjOn*uCleft.y*sideF*(1. - smoothstep(1.2, 4., fwP));
  joint = max(joint, master)*(1. - 0.3*shade0); jointH = max(jointH, master)*(1. - 0.3*shade0);
  float hk = 0.5;
  float mTone = (hash11((mjI - step(mjs, 0.))*3.1 + 5.) - 0.5)*mjOn*(1. - smoothstep(8., 28., mjd));   // the rock weathers a little differently either side of one
  float thin = 1. - massive;
  // laminae: near-level, calm (no loops), with a crisp parting here and there
  float lamY = yw + 0.25*vnoise(vec3(P.x*0.035, P.y*0.05, bedI));
  float lamQ = lamY*(0.8 + 1.5*hb1r);
  // (each lamina is one crisp course with its own tone and its own small step in the face: nothing soft, nothing stretched)
  float lq = lamQ*1.3 + 0.4*sin(lamQ*0.83 + bedI*2.);
  float lqf = min(fwidth(lq), 1.);
  float lI = floor(lq), lF = lq - lI, lw = clamp(max(fwP*(1.1 + 2.*hb1r)*1.6 + 0.03, 1.5*lqf), 0.03, 1.), lwH = clamp(max(lw*1.6, 4.5*lqf), 0.08, 1.);
  float ltA = hash11(lI*1.7 + bedI*3.1), ltB = hash11((lI + 1.)*1.7 + bedI*3.1);
  float lt = mix(ltA, ltB, smoothstep(1. - lw, 1., lF)), ltH = mix(ltA, ltB, smoothstep(1. - lwH, 1., lF));
  // the laminae of one bed are not those of the next: they fade out toward both of its bedding planes, so nothing jumps there
  float eL = clamp(max(wE*2.2, 0.22)/T, 0.02, 0.5), lamWin = smoothstep(0., eL, bedF)*(1. - smoothstep(1. - eL, 1., bedF));
  float lamK = mix(0.3, 1., thin)*(1. - smoothstep(0.3, 0.9, lw))*lamWin;
  float lam = mix(0.5, lt, lamK), lamH = mix(0.5, ltH, lamK*(1. - smoothstep(0.45, 1., lwH)));
  // a parting runs along the MIDDLE of its own course (the course number is the same on both sides of the line), at least 1.5 px wide
  float lpQ = lamQ*0.5 + 0.3*hb1r, lpI = floor(lpQ), lpD = abs(lpQ - lpI - 0.5), lpW = max(fwidth(lpQ)*1.5, 0.012);
  float parting = (1. - smoothstep(lpW*0.35, lpW, lpD))*step(0.45, hash11(lpI*3.7 + bedI))*lod2*(0.35 + 0.65*thin)*lamWin*(1. - smoothstep(0.3, 0.5, lpW))
    *smoothstep(0.3, 0.6, vnoise(vec3(P.x*0.05, lpI, 3.)));
  float fineLo = vnoise(P*vec3(0.45, 1.2, 0.45));
  float fine = 0.62*fineLo + 0.38*mix(0.5, vnoise(P*vec3(1.3, 3.1, 1.3) + 5.), lod2);
  float grain = mix(0.5, 0.6*vnoise(P*vec3(4.1, 9., 4.1) + 2.) + 0.4*vnoise(P*13.7), lod3);
  float big = fbm(P*vec3(0.011, 0.017, 0.011) + 5.);
  float flake = vnoise(P*vec3(0.16, 0.5, 0.16) + 9.);                               // roof undersides spall in scallops
  // close to, the stone is crisp: hairline cracks along the iso-lines of two noises, pock marks, and on the roof undersides
  // the edges of spalled plates (drawn in the plane of the roof, so they never stretch)
  // (each hairline is sized from the pixel footprint of its OWN coordinate: never under 1.5 px wide, and it thins out to
  // nothing as its true width falls below a pixel, far off or at a grazing angle, instead of breaking into dots)
  float hn1 = vnoise(P*vec3(0.31, 0.47, 0.31) + 41.) - 0.5, hn2 = vnoise(P*vec3(1.05, 1.6, 1.05) + 23.) - 0.5;
  float hf1 = fwidth(hn1) + 1e-5, hf2 = fwidth(hn2) + 1e-5;
  float hw1 = max(0.03, hf1*1.5), hw2 = max(0.045, hf2*1.5);
  float hair = (1. - smoothstep(hw1*0.3, hw1, abs(hn1)))*lod2*smoothstep(0.35, 0.6, vnoise(P*0.06 + 77.))*clamp(0.045/hw1, 0., 1.)
    + 0.7*(1. - smoothstep(hw2*0.3, hw2, abs(hn2)))*lod3*clamp(0.07/hw2, 0., 1.);
  float pn = vnoise(P*2.6 + 13.), pf = fwidth(pn);
  float pock = smoothstep(0.71, 0.77 + pf, pn)*lod3*(1. - smoothstep(0.03, 0.1, pf));
  vec2 pw2 = P.xz*vec2(0.6, 1.) + 3.2*vec2(vnoise(vec3(P.xz*0.11, 2.)), vnoise(vec3(P.xz*0.11, 6.)));
  vec2 v1 = vor(pw2*0.21), v2 = vor(pw2*0.83 + 3.7);
  float plateE = (1. - smoothstep(0., (0.05 + fwP*0.8)*0.21, v1.x))*lod1 + 0.55*(1. - smoothstep(0., (0.02 + fwP*0.8)*0.83, v2.x))*lod2;
  float plateK = 0.25 + 0.75*smoothstep(0.32, 0.56, vnoise(vec3(P.xz*0.075, 14.)));           // the cracks come and go: never a whole paving
  float plateH = ((1. - smoothstep(0., (0.12 + fwP*3.2)*0.21, v1.x))*lod1 + 0.55*(1. - smoothstep(0., (0.06 + fwP*3.2)*0.83, v2.x))*lod2)*plateK;
  plateE *= plateK;
  // (a plate's own tone and level ease to the mean at its edge, where the crack is: no step under the crack)
  float plateT = mix(0.5, v1.y, lod1*smoothstep(0., (0.05 + fwP*0.8)*0.42, v1.x))*0.6 + mix(0.5, v2.y, lod2*smoothstep(0., (0.02 + fwP*0.8)*1.66, v2.x))*0.4;
  // a massive bed is not blank: it weathers in broad hollows and spalled plates
  float plate = fbm(P*vec3(0.06, 0.09, 0.06) + 17.), spall = smoothstep(0.46, 0.5, plate)*massive*uCleft.y;
  // the cleft: water-worn strata of uneven thickness that dip across the tunnel, cupped with scallops
  float cz = uCleft.z, sAx = mAx;
  float ys = P.y*0.94 + P.x*0.31 + 1.6*vnoise(P*vec3(0.07, 0.05, 0.07) + 3.) + 0.5*sin(sAx*0.21);
  float sc0 = ys*0.42 + 0.75*sin(ys*0.33 + 1.) + 0.4*sin(ys*0.9 + 2.);
  float sI = floor(sc0), sF = sc0 - sI, sE = clamp(fwP*2.2 + 0.03, 0.03, 0.4);
  float sT = hash11(sI*1.7 + 3.), sT2 = hash11(sI*3.3 + 9.);
  float sEdge = smoothstep(0., sE, sF)*(1. - smoothstep(1. - sE, 1., sF));
  float cupA = abs(2.*vnoise(vec3(mb*0.33, sAx*0.2) + 11.) - 1.), cupB = abs(2.*vnoise(vec3(mb*0.8, sAx*0.46) + 4.) - 1.);
  float scallop = smoothstep(0., 0.42, cupA)*0.7 + smoothstep(0., 0.5, cupB)*0.3*lod1;
  float h = -wallW*lodB*(crackH + jointH)*0.8 + (lamH - 0.5)*0.5*wallW + fine*0.45*lod1 + (grain - 0.5)*0.3 + (flake - 0.5)*1.2*under*lod1
    - under*(plateH*0.9 - plateT*0.7*lod1)
    + spall*0.5*wallW*lod1 + cz*((sT - 0.5)*1.5*sEdge - (1. - sEdge)*0.5 - scallop*1.3);
  // bump from the height field (derivatives taken once, outside any loop)
  vec3 dpx = dFdx(vWorld), dpy = dFdy(vWorld);
  float hx = dFdx(h), hy = dFdy(h);
  vec3 r1 = cross(dpy, N), r2 = cross(N, dpx);
  float det = dot(dpx, r1);
  vec3 g = (hx*r1 + hy*r2)/(abs(det) + 1e-5)*sign(det + 1e-9);
  N = normalize(N - clamp(g*0.9, -1., 1.)*mix(0.08, 1., lod1) + vec3(0., 1e-5, 0.));
  // ---- colour: a dull ochre that goes buff and grey bed by bed, darker toward the foot ----
  vec3 grey = vec3(dot(uRock, vec3(0.3, 0.55, 0.15)))*vec3(1.0, 0.97, 0.9);
  vec3 base = mix(uRock*vec3(0.95, 0.88, 0.78), grey, clamp(0.2 + 0.45*hb1*hb1 + 0.32*(big - 0.5) + 0.09*(hk - 0.5) + 0.12*mTone, 0.05, 0.9));
  float val = mix(0.82, mix(0.6, 1.05, 0.88*hb2 + 0.12*hk), lodB*bedK*(1. - 0.45*massive))*mix(0.8, 1.12, vTone.x)*(0.84 + 0.32*lam)*(0.84 + 0.32*grain)*(1. + 0.1*spall - 0.12*massive*(plate - 0.5));
  // From far off, where the single beds have melted into the face, the wall is a few GREAT beds (four courses each, so
  // their planes are bedding planes close to): each its own tone, a crisp shadow line at least 2 px deep under its lip.
  float gq = bc*0.25, gI = floor(gq), gF = gq - gI, Tg = 4.*T;
  float farB = (1. - bedVis)*bedK*(1. - under)*(1. - 0.7*top)*sideF*(1. - uCleft.z);
  float gE = clamp(wE*1.3/Tg, 0.002, 0.3), gUp = smoothstep(1. - gE, 1., gF)*0.5, gDn = (1. - smoothstep(0., gE, gF))*0.5;
  float gTone = mix(mix(hash11(gI*1.9 + 11.), hash11((gI + 1.)*1.9 + 11.), gUp), hash11((gI - 1.)*1.9 + 11.), gDn);
  float gProud = hash11(gI*3.3 + 2.);                                               // which lips stand proud enough to throw a shadow
  float gWl = max(1.3, 2.3*fwP), gLip = (1. - smoothstep(gWl*0.55, gWl, (1. - gF)*Tg))*step(0.3, gProud)*farB;
  float gLedge = (1. - smoothstep(gWl*0.5, gWl*0.95, (1. - gF)*Tg))*step(gProud, 0.3)*farB;      // the great beds that stand back show the lit top of the bed below instead
  val *= mix(1., 0.72 + 0.58*gTone, farB)*(1. - 0.6*gLip)*(1. + 0.3*gLedge);
  // provinces of the face: rust where iron has bled, cream where lime has washed it
  float prov = fbm(P*vec3(0.0052, 0.011, 0.0052) + 31.);
  base = mix(base, base*vec3(1.1, 0.8, 0.6), smoothstep(0.5, 0.7, prov)*0.6*bedK);
  base = mix(base, mix(base, uPale*0.66, 0.6), (1. - smoothstep(0.3, 0.46, prov))*0.55*bedK);
  vec3 alb = base*val*mix(0.62, 1., smoothstep(40., 175., P.y));
  alb *= (1. - 0.5*hair*(1. - under))*(1. - 0.35*pock*(1. - under))*(1. - 0.42*parting*wallW);
  alb *= mix(1., (0.84 + 0.3*plateT)*(1. - 0.6*plateE), under*(1. - cz));
  // the rock of the cleft: bands of ochre, cream and umber with dark partings, polished pale on the lips of the scallops
  vec3 strat = mix(mix(uRock*0.62, uPale*0.5, smoothstep(0.35, 0.75, sT)), vec3(0.085, 0.05, 0.03), smoothstep(0.72, 0.9, sT2));
  strat *= (0.72 + 0.28*sEdge)*(0.8 + 0.4*fine)*(0.72 + 0.5*(1. - smoothstep(0., 0.3, cupA)));
  alb = mix(alb, strat, cz);
  // seepage: dark varnish streaks hang from the lips and ledges, broad stains under them, pale lime streaks between
  // (they are laid out along the face, round the horns as well: sC runs with the rock where it turns; and each hangs from the
  // lip of its own great bed and is gone by the next, so no streak runs the height of the wall)
  float sC = P.x - P.z*clamp(P.x/200., -1., 1.), hangA = 0.16 + 0.84*gF*gF;
  float sx = vnoise(vec3(sC*0.33 + gI*5.3, yw*0.016, 3.)), sx2 = mix(0.5, vnoise(vec3(sC*1.1, yw*0.05, 7.)), 1. - smoothstep(0.1, 0.45, fwP));   // (a streak narrower than a pixel is left out)
  float streak = smoothstep(0.55, 0.7, sx*0.75 + sx2*0.25)*(1. - under)*smoothstep(0.15, 0.6, vTone.y + 0.2)*(1. - smoothstep(0.5, 1.7, fwP))*hangA;
  float wide = smoothstep(0.56, 0.68, vnoise(vec3(sC*0.085 + 13. + gI*7.31, yw*0.006, 5.)))*(1. - under)*(0.6 + 0.4*sx2)*(1. - uCleft.z)*hangA;
  float limeS = smoothstep(0.62, 0.8, vnoise(vec3(sC*0.21 + 40. + gI*3.7, yw*0.02, 11.)))*(1. - under)*hangA;
  alb = mix(alb, alb*vec3(0.4, 0.42, 0.47), max(streak*0.75, wide*0.62));
  alb = mix(alb, uPale*0.6, limeS*0.3*(0.5 + 0.5*fine));
  // lichen: grey-green sheets, a sulphur crust; rubble, moss and leaf mould on the ledge tops; soot under the roofs
  float lich = smoothstep(0.57, 0.68, fbm(P*0.035 + 9.))*smoothstep(0.3, 0.55, fine + 0.25*lam)*(1. - under);
  alb = mix(alb, vec3(0.2, 0.25, 0.17)*(0.7 + 0.6*grain), lich*(0.72 + 0.16*shade0)*(1. - uCleft.z));
  float crust = smoothstep(0.7, 0.8, vnoise(P*0.19 + 23.))*smoothstep(0.4, 0.7, grain + 0.2*top)*(1. - under);
  alb = mix(alb, vec3(0.42, 0.4, 0.16), crust*0.45*(1. - uCleft.z));
  float veg = top*smoothstep(0.22, 0.55, 0.55*fine + 0.45*vnoise(P*0.11 + 3.) + 0.25*(big - 0.5))*bedK;
  alb = mix(alb, mix(vec3(0.07, 0.11, 0.035), vec3(0.17, 0.15, 0.08), fine)*(0.6 + 0.8*grain), veg*0.88);
  alb *= 1. - 0.35*under*smoothstep(0.4, 0.75, vnoise(P*0.07 + 31.));
  alb *= (1. - crack*0.5*wallW)*(1. - joint*0.4*wallW);
  float pxF = clamp(1.5*pxB/T, 0.001, 0.2);                                          // a pixel and a half, as a fraction of this bed
  alb *= 1. - 0.4*wallW*lodB*bedVis*(1. - smoothstep(0., min(0.16, 2.2/T), bedF))*smoothstep(0., pxF, bedF);                      // the undercut foot of every bed sits in its own shade
  // ---- light: roof shadow, the shadow line under every bed that stands proud, comb shadows, old wax scars ----
  float inT = uCleft.z*smoothstep(2., 16., mAx);                                    // down the cleft the day is left behind
  float lit = (1. - shade0)*(1. - inT);
  float dUp = 1.9*(bedO(bedI + 1.) - bedO(bedI)), reach = max(dUp, 0.)*uShadowK;
  lit *= 1. - 0.85*wallW*lodB*bedVis*smoothstep(0.1, 0.7, dUp)*(1. - smoothstep(reach*0.8, reach*1.15 + 0.5, (1. - bedF)*T))*(1. - smoothstep(1. - pxF, 1., bedF));
  // the top of a bed that stands proud of the one above is a ledge in the sun: a pale line, at least a pixel and a half deep
  float ledge = smoothstep(0.1, 0.7, -dUp)*(1. - smoothstep(0., max(min(-dUp*0.9, 1.4), 1.6*pxB), (1. - bedF)*T))*wallW*lodB*bedVis;
  alb *= 1. + 0.38*ledge;
  float scar = 0., fill = 0.;
  float lz = max(uSunL.z, 0.08);
  for (int i = 0; i < 12; i++){
    vec4 c = uCombA[i];
    float top2 = i < 6 ? ${ye}. : ${Te}.;
    float t = (c.y - P.z)/lz;
    vec3 hp = P + uSunL*t;
    float e = length(vec2((hp.x - c.x)/c.z, (top2 - hp.y)/c.w));
    lit *= 1. - step(0., t)*step(hp.y, top2 + 1.)*(1. - smoothstep(0.9, 1.06, e))*0.92;
    // ghost of an abandoned comb beside this one, and the attachment line on the roof
    float ge = length(vec2((P.x - c.x - 37.)/(c.z*0.62), (top2 - P.y)/(c.w*0.7)));
    float on = step(P.y, top2)*step(top2 - 40., P.y)*(1. - under);
    scar = max(scar, (1. - smoothstep(0.0, 0.09, abs(ge - 1.)))*on);
    fill = max(fill, (1. - smoothstep(0.7, 1., ge))*on);
    scar = max(scar, under*(1. - smoothstep(1.5, 4.5, abs(P.z - c.y)))*(1. - smoothstep(c.z, c.z + 5., abs(P.x - c.x)))*step(abs(P.y - top2), 6.));
  }
  alb = mix(alb, uPale*0.5*(0.7 + 0.6*fine), fill*0.42*smoothstep(0.25, 0.6, lam + 0.3*fine));
  alb = mix(alb, uPale*0.62, scar*(0.35 + 0.4*fine));
  // old wax crusts the lip of the cleft and runs down the wall below it
  float crustM = uCleft.x*nearMouth*(1. - smoothstep(1.5, 8., mEdge + 6.*(fineLo - 0.5)));
  float dripM = uCleft.x*nearMouth*step(mb.y, 0.)*(1. - smoothstep(4., 14., abs(mb.x)))*smoothstep(0.42, 0.7, vnoise(vec3(P.x*0.9, 5., 1.)))*(1. - smoothstep(0., 30., mEdge));
  float collar = uCleft.z*(1. - smoothstep(-1., 5., mAx + 5.*(fineLo - 0.5)));
  alb = mix(alb, uPale*0.64*(0.72 + 0.5*lam)*vec3(1., 0.93, 0.8), clamp(crustM*0.85 + dripM*0.5 + collar*0.8, 0., 0.88));
  alb *= mix(1., 0.68, uWet);
  vec3 alb0 = alb;
  alb = mix(alb, vec3(dot(alb, vec3(0.35, 0.5, 0.15)))*vec3(1.0, 0.93, 0.92), (1. - lit)*0.36);   // ochre in shade goes brown, not red
  vec3 col = sunShade(alb, N, V, lit, mix(18., 40., uWet), 0.03 + 0.2*uWet)*mix(1., 0.42, inT);
  vec3 NL = normalize(mix(normalize(vNL + vec3(0., 1e-5, 0.))*(gl_FrontFacing ? 1. : -1.), N, 0.6*uCleft.z) + vec3(0., 1e-5, 0.));
  vec3 toP = uPortalPos - P; float dp = length(toP) + 1e-3;
  float ndP = max(dot(NL, toP/dp), 0.), ndPb = max(dot(N, toP/dp), 0.);
  col += alb0*uPortalCol*mix(0.2 + 0.4*ndP, 0.26 + 0.5*ndP + 0.75*ndPb, uCleft.z)/(1. + dp*dp/mix(500., 2800., uCleft.z)) + alb0*uPortalCol*0.06*inT;
  vec3 toG = uGlowPos - P; float dg = length(toG) + 1e-3;                             // the light that spills out of the mouth
  col += alb0*uGlowCol*(0.3 + 0.7*max(dot(NL, toG/dg), 0.))/(1. + dg*dg/mix(900., 220., uCleft.z));
  vec3 toW = uWinPos - P; float dw = length(toW) + 1e-3;                              // amber thrown on the wall behind the window comb
  col += alb0*uWinCol*max(dot(NL, toW/dw), 0.)/(1. + dw*dw/300.);
  col = mix(col, uHaze.rgb, (1. - exp(-max(distance(cameraPosition, vWorld) - 150., 0.)*uHaze.w))*smoothstep(330., 520., abs(P.x)));
  col = mix(col, uSea.rgb, uSea.w*(1. - smoothstep(-25., 75., vWorld.y)));           // the foot of the rock is lost in the cloud it stands in
  gl_FragColor = vec4(max(col, 0.), 1.);
  #include <fog_fragment>
}`;async function zt(e,t){const d=Ce({aC:4,aK:4,aT:3}),s=new w.Vector3;for(const a of t){const h=[a.index,a.seed,a.crown,a.cover],n=l=>{const v=d.pos.length/3;for(let m=0;m<=12;m++){const f=1-Math.pow(1-m/12,1.6);for(let g=0;g<=36;g++){const P=Le(a,g/36*Math.PI),T=P[0]*f,V=P[1]*f,D=we(a,f,T,V);ee(a,T,V,l*D,s),d.v(s.x,s.y,s.z,{aC:[T,V,l,f],aK:h,aT:[D,a.bareTop,a.age]})}}return v},p=n(1),i=n(-1);for(let l=0;l<12;l++)for(let v=0;v<36;v++){const m=l*37+v,f=m+36+1;d.quad(p+m,p+f,p+f+1,p+m+1),d.quad(i+m,i+m+1,i+f+1,i+f)}const b=d.pos.length/3;for(let l=0;l<=36;l++){const v=Le(a,l/36*Math.PI),m=we(a,1,v[0],v[1]);for(const f of[1,-1])ee(a,v[0]*1.004,v[1]*1.004,f*m,s),d.v(s.x,s.y,s.z,{aC:[v[0],v[1],0,1],aK:h,aT:[m,a.bareTop,a.age]})}for(let l=0;l<36;l++){const v=b+l*2;d.quad(v,v+1,v+3,v+2)}await e.yield()}return d.geometry()}async function Ct(e,t,o,c,d,s,a,h){const n=Ce({color:3,aW:4}),p=c[5],i=new w.Vector3,b=new w.Vector3,l=[],v=[],m=120;let f=null,g=0;for(let M=0;M<=m;M++){const u=M/m*Math.PI*2,j=Ie(d,u),W=d.cx+j*Math.cos(u),z=d.d+j*Math.sin(u),R=z>.4?Pe(p,W,z):2;if(R>.992){f=null;continue}const _=we(p,R,W,z),G=1-K(p.crown*.8,p.crown*1.05,z);g+=j*(Math.PI*2/m);const J=[];for(let q=0;q<=4;q++){const U=q/2-1,H=q===0||q===4?0:t.range(.05,.55)*(.4+.6*Math.abs(Math.sin(M*1.7+q))),B=W-Math.cos(u)*H,I=z-Math.sin(u)*H;ee(p,B,I,U*_,i);const S=.75+.25*t();J.push(n.v(i.x,i.y,i.z,{color:[a.wax.r*S,a.wax.g*S,a.wax.b*S],aW:[g,U*_,1,G]}))}if(f)for(let q=0;q<4;q++)n.quad(f[q],J[q],J[q+1],f[q+1]);f=J,Math.sin(u)<-.15&&G>.4&&l.push({cx:W,d:z,ht:_,th:u}),v.push({cx:W,d:z,th:u,rho:R})}for(let M=0;M<44;M++){const u=t.range(0,Math.PI*2),j=Ie(d,u),W=d.cx+j*Math.cos(u),z=d.d+j*Math.sin(u);if(z<.5||Pe(p,W,z)>.97)continue;const R=we(p,Pe(p,W,z),W,z),_=t.sign(),G=t.range(.5,1.5),J=t.range(.35,.9),q=t.range(.4,1.3),U=-Math.sin(u),H=Math.cos(u),B=[];for(let I=0;I<=3;I++){const S=I/3,O=G*S*.75,xe=G*S*S*.5,ne=J*(1-.3*S*S)*(.8+.4*Math.abs(Math.sin(M*3.1+I*1.9))),he=[];for(const te of[-1,1]){const pe=W-Math.cos(u)*O+U*ne*te,be=z-Math.sin(u)*O+H*ne*te+xe;ee(p,pe,be,_*(R*.9+q*S*S),i);const le=.8+.2*S;he.push(n.v(i.x,i.y,i.z,{color:[a.wax.r*le*.6,a.wax.g*le*.55,a.wax.b*le*.45],aW:[S,te,0,.3]}))}B.push(he)}for(let I=0;I<3;I++)n.quad(B[I][0],B[I][1],B[I+1][1],B[I+1][0])}await e.yield();const P=De(s),T=new w.Vector3,V=new w.Vector3,D=new w.Vector3,F=[[-.34,-1,0,.34],[.04,-.66,.04,.44],[.42,-.48,.22,.58],[.82,-.33,.7,.8],[1,0,1,1],[.84,.29,.8,.8],[.45,.44,.25,.52],[.04,.62,.04,.42],[-.34,1,0,.32]],N=(M,u,j,W,z,R,_,G)=>{const q=[],U=t.range(0,1),H=t.range(1.4,2.8),B=t.range(.82,1.08),I=t.range(.3,.42);for(let S=0;S<=14;S++){const O=S/14,xe=Math.sin(Math.PI*O);M(O,T),u(O,V),j(O,D);const ne=Math.sqrt(Math.abs(Math.sin(Math.PI*(O*H+U)))),he=Math.min(z*Math.pow(xe,.5)*(1-I+I*ne),G(O)),te=R*(.35+.65*Math.sqrt(xe)),pe=[];for(const[be,le,me,ze]of F){const ie=le*te*Math.min(1,.35+he/Math.max(.2,z))+_*me*me*Math.min(1,he/Math.max(.2,z));i.copy(T).addScaledVector(V,be*Math.max(he,.5)).addScaledVector(D,ie);const ge=ze*B*(.88+.12*o.n3(i.x*.4,i.y*.4,i.z*.4));pe.push(n.v(i.x,i.y,i.z,{color:[(a.pale.r*.7+.3)*ge,(a.pale.g*.7+.3)*ge*.9,(a.pale.b*.7+.3)*ge*.72],aW:[O*W,Math.max(0,be),0,0]}))}q.push(pe)}for(let S=0;S<14;S++)for(let O=0;O<F.length-1;O++)n.quad(q[S][O],q[S+1][O],q[S+1][O+1],q[S][O+1])},C=(M,u)=>u.copy(P.r).multiplyScalar(-Math.cos(M)).addScaledVector(P.u,-Math.sin(M)),X=(M,u,j,W,z,R)=>{for(let _=0;_<R;_++){const G=M+_*t.range(.75,1.15)*(z<0?-1:1),J=j*(1-.1*_),q=u+t.range(-.1,.1)*_,U=B=>q+(B-.5)*J,H=B=>{let I=0;for(let S=-3;S<=3;S++)I+=Mt(o,G,U(B+S*.07));return I/7+.4};N((B,I)=>P.at(G,U(B),H(B),I),(B,I)=>C(U(B),I),(B,I)=>I.copy(P.d),J*12,(W+.6)*(1-.24*_),.5+.42*W,z,B=>H(B)-7.6)}},Y=(M,u,j,W)=>{for(let z=0;z<W;z++){const R=u*(1-.12*z),_=M+t.range(-.08,.08)*z,G=.6-.22*z,J=Math.cos(G),q=Math.sin(G),U=H=>_+(H-.5)*R;N((H,B)=>{const I=U(H),S=ke(I);return P.at(h(I,S)-1.1+.3*z,I,S+1+.95*z,B)},(H,B)=>C(U(H),B).multiplyScalar(q).addScaledVector(P.d,-J),(H,B)=>C(U(H),B).multiplyScalar(-J).addScaledVector(P.d,-q),R*13,j*(1-.2*z),.5+.34*j,.5,()=>(1+.95*z)/q)}};for(let M=0;M<10;M++)Y(M/10*6.283+t.range(-.12,.12),t.range(.6,.9),t.range(2.2,3.8),M%3===0?3:2);await e.yield();for(let M=0;M<22;M++)X(5+(M+t())*(de-12)/22,M*2.4+t.range(-.5,.5),t.range(.7,1.35),t.range(1.5,2.9),t.range(-1,1),M%3===0?3:2),await e.yield();await e.yield();for(let M=0;M<12;M++)X(de-1.8+M%3*.7,M/12*6.283+t.range(-.1,.1),t.range(.75,1.1),t.range(1.6,2.6),t.range(-1.4,-.5),2);await e.yield();const Q=n.geometry(!1);return await e.yield(),Q.computeVertexNormals(),{geometry:Q,ropeSeats:l,walkSeats:v}}const St=`
attribute vec3 color; attribute vec4 aW;
varying vec3 vLocal, vWorld, vN, vNL, vCol; varying vec4 vW;
#include <fog_pars_vertex>
void main(){
  vLocal = position; vCol = color; vW = aW; vNL = normal;
  vec4 wp = modelMatrix*vec4(position, 1.);
  vWorld = wp.xyz; vN = mat3(modelMatrix)*normal;
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Lt=`
${Me}
uniform vec3 uHoney, uPortalPos, uPortalCol, uGlowPos, uGlowCol, uMouth, uMd;
varying vec3 vLocal, vWorld, vN, vNL, vCol; varying vec4 vW;
#include <fog_pars_fragment>
void main(){
  float face = gl_FrontFacing ? 1. : -1.;
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.))*face;
  vec3 V = normalize(cameraPosition - vWorld + vec3(0., 1e-4, 0.));
  vec3 alb = vCol; float gloss = 14., spec = 0.06;
  float cut = step(0.5, vW.z);
  // cut face of the comb: cells seen side-on (tubes across the thickness, a midrib), honey glazing the crown part
  float fwu = fwidth(vW.x);
  float cell = abs(fract(vW.x/0.22) - 0.5);
  float wall = smoothstep(0.34 - fwu*2.3, 0.34 + fwu*2.3, cell)*(1. - smoothstep(0.1, 0.3, fwu));
  float mid = 1. - smoothstep(0.03, 0.09, abs(vW.y));
  vec3 cutCol = mix(vCol*0.34, vCol*1.05, max(wall, mid));
  float drip = smoothstep(0.35, 0.75, sin(vW.x*1.9)*0.5 + 0.5)*vW.w;
  cutCol = mix(cutCol, uHoney*0.85, clamp(vW.w*0.55 + drip*0.4, 0., 0.9));
  alb = mix(alb, cutCol, cut);
  gloss = mix(gloss, 70., cut*vW.w); spec = mix(spec, 0.9, cut*vW.w);
  // old flange wax: a honey-tan body with growth ridges parallel to the lip, and a pale rolled lip
  float fl = 1. - cut, fg = clamp(vW.y, 0., 1.);
  float ridge = sin(vW.y*26. + sin(vW.x*0.5)*1.4)*(1. - smoothstep(0.1, 0.5, fwidth(vW.y)*26.));
  // the ghost of the cells the wax was built in: a faint net of hexagons across the body of the flange
  vec2 hp = vec2(vW.x*2.2*1.1547, vW.y*5.5); hp.y += mod(floor(hp.x), 2.)*0.5; hp = abs(fract(hp) - 0.5);
  float cellE = (1. - smoothstep(0.03, 0.17, abs(max(hp.x*1.5 + hp.y, hp.y*2.) - 1.)))*(1. - smoothstep(0.1, 0.4, fwidth(vW.x)*2.5))*smoothstep(0.06, 0.25, fg)*(1. - smoothstep(0.68, 0.86, fg));
  alb = mix(alb, alb*vec3(0.62, 0.47, 0.3)*(0.8 + 0.25*ridge)*(0.55 + 0.45*smoothstep(0., 0.6, fg))*(0.9 + 0.14*sin(vW.x*2.3 + vW.y*3.))*(1. - 0.3*cellE), fl);
  alb = mix(alb, vCol*vec3(1., 0.9, 0.7), smoothstep(0.78, 0.96, fg)*fl);
  float inT = fl*smoothstep(2., 16., dot(vLocal - uMouth, uMd));                    // down the cleft the day is left behind
  float lit = roofLit(vLocal)*(1. - inT);
  vec3 col = sunShade(alb*mix(1., 0.55, fl*lit), N, V, lit, gloss, spec)*mix(1., 0.36, inT);
  // thin wax lets the sun through
  float back = max(dot(-N, uSunDir), 0.);
  col += uSunCol*alb*vec3(1., 0.72, 0.3)*back*lit*mix(0.3*smoothstep(0.4, 1., fg), 0.3, cut);
  vec3 toP = uPortalPos - vLocal; float dp = length(toP) + 1e-3;
  vec3 NL = normalize(vNL + vec3(0., 1e-5, 0.))*face;
  float nP = dot(NL, toP/dp);
  float pk = mix(0.5*(0.12 + 0.9*max(nP, 0.) + 0.3*max(-nP, 0.)*smoothstep(0.3, 1., fg)), 0.3 + 0.5*abs(nP) + 0.6*max(-nP, 0.), cut);
  col += alb*uPortalCol*vec3(1., 0.86, 0.6)*pk/(1. + dp*dp/mix(1200., 300., cut));
  // a flange between us and the portal is a sheet of old wax with the light behind it: amber, deepest at the thick root
  col += alb*uPortalCol*vec3(1., 0.6, 0.22)*fl*max(-nP, 0.)*mix(0.22, 1.25, smoothstep(0.05, 0.9, fg))/(1. + dp*dp/2200.);
  // the lip of a flange glows with the light behind it: the portal down the cleft, the glow in the mouth
  float lipT = fl*smoothstep(0.6, 0.98, fg);
  col += alb*uPortalCol*vec3(1., 0.62, 0.25)*lipT*(0.35 + 0.65*pow(1. - abs(dot(N, V)), 2.))*2.2/(1. + dp*dp/2600.);
  vec3 toG = uGlowPos - vLocal; float dg = length(toG) + 1e-3;
  col += alb*uGlowCol*vec3(1., 0.8, 0.5)*fl*(0.25 + 0.5*max(dot(NL, toG/dg), 0.) + 0.9*lipT)/(1. + dg*dg/260.);
  col += alb*uSkyCol*fl*inT*max(dot(NL, toG/dg), 0.)*1.5/(1. + dg*dg/1600.);          // daylight from the mouth behind us models the near side
  gl_FragColor = vec4(max(col, 0.), 1.);
  #include <fog_fragment>
}`,Nt=`
attribute vec4 aC, aK; attribute vec3 aT;
varying vec4 vC, vK; varying vec3 vT, vLocal, vWorld, vN;
#include <fog_pars_vertex>
void main(){
  vC = aC; vK = aK; vT = aT; vLocal = position;
  vec4 wp = modelMatrix*vec4(position, 1.);
  vWorld = wp.xyz; vN = mat3(modelMatrix)*normal;
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Wt=`
${Me}
${pt}
uniform vec3 uHoney, uPale, uRock, uBeeDark;
uniform vec4 uBite; uniform vec3 uBiteP;
varying vec4 vC, vK; varying vec3 vT, vLocal, vWorld, vN;
#include <fog_pars_fragment>
vec4 hexCell(vec2 p){
  const vec2 s = vec2(1., 1.7320508);
  vec4 hC = floor(vec4(p, p - vec2(0.5, 1.))/s.xyxy) + 0.5;
  vec4 h = vec4(p - hC.xy*s, p - (hC.zw + 0.5)*s);
  return dot(h.xy, h.xy) < dot(h.zw, h.zw) ? vec4(h.xy, hC.xy) : vec4(h.zw, hC.zw + 0.5);
}
float hexDist(vec2 p){ p = abs(p); return max(dot(p, vec2(0.5, 0.8660254)), p.x); }
float vnoise2(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y);
}
void main(){
  float cx = vC.x, d = vC.y, rho = vC.w;
  float isRim = 1. - smoothstep(0.02, 0.98, abs(vC.z));
  float side = vC.z < 0. ? -1. : 1.;
  vec2 q = vec2(cx, d);
  float fw = max(fwidth(cx), fwidth(d)) + 1e-5;
  float lowN = vnoise2(q*0.23 + vK.y*50.);
  // the bite
  float bare = 0.;
  if (abs(vK.x - uBite.w) < 0.5){
    vec2 bp = q - uBite.xy; bp.x += step(dot(bp, bp), 1e-8)*1e-3;
    float th = atan(bp.y, bp.x);
    float R = uBite.z*(1. + 0.11*sin(3.*th + uBiteP.x) + 0.07*sin(7.*th + uBiteP.y) + 0.035*sin(13.*th + uBiteP.z) + 0.38*smoothstep(0.3, 1., sin(th)));
    float bl = length(bp);
    if (bl < R) discard;
    bare = 1. - smoothstep(R + 2., R + 7., bl + 3.*lowN);
  }
  vec3 Ng = normalize(vN + vec3(0., 1e-5, 0.));
  if (!gl_FrontFacing) Ng = -Ng;
  vec3 V = normalize(cameraPosition - vWorld + vec3(0., 1e-4, 0.));
  vec3 T = normalize(vec3(Ng.z, 0., -Ng.x) + vec3(1e-4, 0., 0.))*side;
  vec3 Dn = vec3(0., -1., 0.);
  float m = curtain(vec4(cx, d, side, rho), vK, vT.y)*(1. - isRim)*(1. - bare);
  float mOther = curtain(vec4(cx, d, -side, rho), vK, vT.y)*(1. - bare);
  float lit = roofLit(vLocal);

  // ---------- wax ----------
  float crown = 1. - smoothstep(vK.z*0.82, vK.z*1.05, d + 2.5*(lowN - 0.5));
  vec2 hp = q/0.22;
  vec4 hc = hexCell(hp);
  float e = hexDist(hc.xy), hid = hash21(hc.zw + vK.y*7.);
  float aa = fw/0.22;
  float cellLod = (1. - smoothstep(0.09, 0.32, aa))*(1. - isRim);                     // no cells on the rim: seen edge-on they were a dotted strip
  float wall = smoothstep(0.39 - aa, 0.39 + aa, e);
  vec2 vt = vec2(dot(V, T), dot(V, Dn));
  float vn = max(abs(dot(V, Ng)), 0.3);
  float floorVis = 1. - smoothstep(0.33 - aa, 0.33 + aa, hexDist(hc.xy - vt/vn*0.6));
  float newWax = smoothstep(0.82, 1., rho);
  vec3 waxBase = mix(mix(uPale, uHoney, 0.8)*0.54, mix(uRock, uHoney, 0.5)*0.5, clamp(0.25 + 0.6*vT.z - newWax + 0.3*lowN, 0., 1.)*(1. - crown*0.5));
  // capped honey: dull pale domes, with patches of openH, glistening cells
  float fineK = 1. - smoothstep(0.2, 0.6, fw);                                          // detail finer than a pixel or two is left to the average
  float openH = mix(0.3, smoothstep(0.58, 0.66, 0.6*vnoise2(q*0.5 + 19.) + 0.4*vnoise2(q*1.7 + 7.)), fineK)*crown + bare*mix(0.6, step(0.35, hid), cellLod);
  openH = clamp(openH, 0., 1.);
  vec3 capCol = mix(uPale*0.52, uHoney*0.7, 0.5 + 0.25*hid + 0.2*lowN)*(0.78 + 0.4*hid*cellLod)*(1.0 - 0.3*e*e*4.*cellLod);
  capCol = mix(capCol, capCol*0.5, wall*cellLod);
  vec3 cellIn = mix(waxBase*0.5, waxBase*0.13, floorVis);
  vec3 honeyIn = mix(uHoney*0.8, uHoney*0.4, floorVis);
  vec3 openCol = mix(mix(cellIn, honeyIn, crown), waxBase*1.12, wall);
  vec3 detail = mix(mix(openCol, capCol, crown*(1. - openH)), openCol, 1. - crown);
  vec3 avg = mix(waxBase*0.62, mix(uPale*0.56, uHoney*0.74, 0.62), crown*(1. - openH*0.5));
  vec3 wax = mix(avg, detail, cellLod);
  float wGloss = mix(12., 90., openH*crown), wSpec = mix(0.05, 0.9*floorVis*cellLod + 0.1, openH*crown);
  vec3 Nw = normalize(Ng + (T*hc.x + Dn*hc.y)*0.9*cellLod*crown*(1. - openH) + vec3(0., 1e-5, 0.));

  // ---------- the curtain, far level: one painted bee per tile ----------
  vec2 g = vec2(0.6, 0.95);
  vec2 qw = q + 0.55*vec2(vnoise2(q*0.31 + 3.), vnoise2(q*0.31 + 41.));
  vec2 tq = qw/g; float row = floor(tq.y);
  tq.x += 0.5*mod(row, 2.) + 0.37*hash11(row*1.7 + vK.y*91.);
  vec2 id = floor(tq), f = fract(tq) - 0.5;
  float h1 = hash21(id + vK.y*13. + side*3.), h2 = fract(h1*37.7), h3 = fract(h1*91.3);
  vec2 pc = vLocal.xy + vec2(-f.x*g.x, f.y*g.y);
  float beeLod = 1. - smoothstep(0.07, 0.2, fw);                                         // single bees are painted only while each is four pixels or more
  float flipB = waveAt(pc, h1);
  float flipS = waveAt(vLocal.xy, lowN*0.6);
  float present = step(h3, m*1.03 - 0.02);
  float ang = (h2 - 0.5)*1.1 + 0.13*sin(uTime*1.3*uCalm + h1*50.) + 0.06*sin(uTime*3.1*uCalm + h2*50.);
  float ca = cos(ang), sa = sin(ang);
  vec2 p = (f + (vec2(h1, h2) - 0.5)*vec2(0.34, 0.24))*g;
  p = vec2(ca*p.x + sa*p.y, -sa*p.x + ca*p.y);
  float ab = fw/0.17 + 0.04;
  float breathe = 1. + 0.05*sin(uTime*4.*uCalm + h1*40.);
  vec2 ra = vec2(0.165*breathe, 0.40*(1. - 0.5*flipB));
  vec2 pa = (p - vec2(0., 0.14 - 0.12*flipB))/ra;
  float ea = length(pa);
  float abd = 1. - smoothstep(1. - ab, 1. + ab, ea);
  float tho = 1. - smoothstep(1. - ab, 1. + ab, length((p - vec2(0., -0.3))/0.165));
  float hed = 1. - smoothstep(1. - ab, 1. + ab, length((p - vec2(0., -0.5))/vec2(0.115, 0.095)));
  float fan = step(0.86, h3)*0.5 + flipB;
  vec2 wq = vec2(abs(p.x), p.y) - vec2(0.1 + 0.1*fan, 0.1 - 0.12*flipB);
  float wr = 0.3 + 0.5*fan; float cw = cos(wr), sw = sin(wr);
  wq = vec2(cw*wq.x - sw*wq.y, sw*wq.x + cw*wq.y);
  float wing = 1. - smoothstep(1. - ab, 1. + ab, length(wq/vec2(0.085, 0.36)));
  float bandP = fract((p.y - 0.14 + 0.4)/0.8*5.2 + 0.25);
  float band = smoothstep(0.8, 0.87, bandP)*(1. - smoothstep(0.94, 1., bandP));
  vec3 paleB = uPale*0.56;
  vec3 abdCol = mix(uBeeDark, uPale*0.36, band*0.85);
  abdCol = mix(abdCol, vec3(0.2, 0.11, 0.035), smoothstep(0.0, -0.16, p.y)*0.8);
  abdCol = mix(abdCol, paleB, flipB*0.8);
  vec3 thoCol = vec3(0.14, 0.078, 0.021)*(0.75 + 0.5*h2);
  vec3 beeCol = uBeeDark*0.45;
  float cov = 0.;
  beeCol = mix(beeCol, abdCol, abd); cov = max(cov, abd);
  beeCol = mix(beeCol, mix(vec3(0.07, 0.058, 0.05), paleB*1.1, flipB*0.8), wing*0.62); cov = max(cov, wing*0.85);
  beeCol = mix(beeCol, thoCol, tho); cov = max(cov, tho);
  beeCol = mix(beeCol, uBeeDark*0.7, hed); cov = max(cov, hed);
  cov *= present;
  // packed bees below show through the gaps as darkness
  float under = smoothstep(0.35, 0.6, m);
  vec3 Nb = normalize(Ng + (T*pa.x + Dn*pa.y)*0.75*abd + (T*p.x*3.)*tho + vec3(0., 1e-5, 0.));
  // far average of the same curtain: dark, mottled, with the pale wave running through it
  // (every term here is filtered by the pixel's footprint on the comb: from 150 to 300 m the cloak is smooth satin, not speckle)
  float mott = mix(0.5, vnoise2(q*1.3 + vec2(0., uTime*0.05*uCalm)), 1. - smoothstep(0.16, 0.5, fw));
  float mf = 1. - smoothstep(0.2, 0.6, fw);
  // (a cloak of dark bodies, tawny thoraxes and smoky wings: umber, stirring, with the sun glancing off the wings)
  float stir = vnoise2(q*0.42 + vec2(uTime*0.11*uCalm, uTime*0.07*uCalm) + vK.y*9.);
  vec3 cloak = mix(uBeeDark*1.15, vec3(0.062, 0.03, 0.009), 0.25 + 0.45*mott)*mix(0.72 + 0.4*stir, 0.5 + 0.95*stir, fineK);
  vec3 farCol = mix(cloak, uPale*0.36, flipS*0.85);
  float sheen = pow(vnoise2(q*1.9 + vec2(uTime*0.35*uCalm, -uTime*0.22*uCalm)), 5.)*2.2*mf;
  float twk = pow(vnoise2(q*2.3 + vec2(uTime*0.5*uCalm, -uTime*0.31*uCalm)), 7.)*smoothstep(0.35, 0.7, stir + 0.2)*(1. - smoothstep(0.12, 0.4, fw));

  // ---------- compose ----------
  vec3 albNear = mix(mix(wax, uBeeDark*0.3, under), beeCol, cov);
  vec3 albFar = mix(wax, farCol, m);
  vec3 alb = mix(albFar, albNear, beeLod);
  float beeAmt = mix(m, max(cov, under), beeLod);
  vec3 N = normalize(mix(Nw, mix(Ng, Nb, beeLod), beeAmt) + vec3(0., 1e-5, 0.));
  // from far off the curtain is one dark umber cloak, mottled and stirring; the wave lifts it
  float nearB = mix(0.3, 1., beeLod);
  float gloss = mix(wGloss, 52., beeAmt), spec = mix(wSpec, (0.04 + 0.22*wing*beeLod*cov + sheen*0.08)*nearB + 0.05*flipS, beeAmt);
  vec3 col = sunShade(alb, N, V, lit, gloss, spec);
  // sun rim on bee backs so they stand out of the dark
  float rimL = pow(1. - max(dot(N, V), 0.), 3.)*max(dot(Ng, uSunDir), 0.)*lit;
  col += uSunCol*rimL*beeAmt*vec3(0.5, 0.36, 0.2)*0.3*nearB;
  // wings catching the sun here and there over the whole cloak (a slow glitter, never a flash)
  col += uSunCol*vec3(0.62, 0.5, 0.34)*twk*beeAmt*max(dot(Ng, uSunDir), 0.)*lit*mix(0.5, 0.22, beeLod);
  // ---------- honey: the capped crown holds the light and glows, runs of it creep down the wax ----------
  float bareK = (1. - beeAmt)*(1. - isRim);
  float cellGlow = mix(0.62, (1. - 0.75*wall)*(0.55 + 0.6*hid), cellLod);
  float inner = crown*(0.5 + 0.5*smoothstep(0., 3.5, d))*(0.75 + 0.5*lowN);
  vec3 amber = mix(vec3(1., 0.44, 0.07), vec3(1., 0.62, 0.17), hid*cellLod);
  col += uSunCol*amber*inner*cellGlow*bareK*mix(0.34, 0.4, lit);
  float runN = vnoise2(vec2(cx*1.15 + vK.y*37., d*0.07 + vK.y*11.));
  float runW = smoothstep(0.66, 0.74, runN)*smoothstep(vK.z*0.35, vK.z*0.9, d)*(1. - smoothstep(vK.z*1.25, vK.z*2.1, d + 6.*(lowN - 0.5)))*(1. - smoothstep(0.2, 0.7, fw));
  float runG = pow(0.5 + 0.5*sin(d*1.7 - uTime*0.9 + hash11(floor(cx*1.15 + vK.y*37.))*40.), 10.);
  col = mix(col, uSunCol*vec3(0.95, 0.5, 0.09)*(0.26 + 0.34*lit), runW*bareK*0.85);
  col += uSunCol*vec3(1., 0.85, 0.6)*runW*bareK*runG*(0.25 + 0.75*lit)*0.6;
  // ---------- light through wax and honey ----------
  float thick = 2.*vT.x;
  vec3 sig = mix(vec3(0.06, 0.2, 0.7), vec3(0.09, 0.36, 1.3), crown);
  vec3 Tm = exp(-sig*max(thick, 0.)*0.85)*vec3(1., 0.66, 0.26);
  float back = max(dot(-Ng, uSunDir), 0.);
  float fwd = max(dot(-V, uSunDir), 0.); fwd *= fwd; fwd *= fwd;
  // The curtains are a stained-glass window from behind: the far curtain dims the light in soft blotches, this one is
  // a crawling silhouette; light leaks between the bodies, pricks through the gaps and glows in the wings.
  vec2 pq = q/0.5 + 0.3*vec2(vnoise2(q*0.9 + 3.), vnoise2(q*0.9 + 31.));
  float prick = step(0.5, hash21(floor(pq) + 5.))*(1. - smoothstep(0.16, 0.46, length(fract(pq) - 0.5)))*(0.6 + 0.4*sin(uTime*2.3*uCalm + hash21(floor(pq))*30.));
  float blockO = 1. - mOther*(0.42 + 0.32*vnoise2(q*1.7 + vec2(17., uTime*0.07*uCalm)));
  float bodyS = max(max(abd, tho), hed)*present, wingS = wing*present*(1. - bodyS);
  float leakNear = (1. - 0.96*bodyS)*(0.4 + 0.75*prick)*(1. - 0.35*wingS);
  float leakFar = 0.26 + 0.16*mott + 0.3*prick*mf*mf;
  float blockS = mix(1., mix(leakFar, leakNear, beeLod), smoothstep(0.3, 0.6, m));
  vec3 trans = uSunCol*Tm*back*(0.42 + 0.62*fwd)*mix(0.45, 1., lit)*blockO*blockS;
  trans *= mix(1., 0.62 + 0.55*wall + 0.3*(hid - 0.5), cellLod*(1. - beeAmt))*(0.8 + 0.4*lowN);     // the cells show in the light
  // amber held in the fur and the wings of the bees that stand against the light
  trans += vec3(0.75, 0.42, 0.13)*back*beeAmt*(0.085 + 0.3*pow(1. - max(dot(N, V), 0.), 2.5) + 0.22*wingS*beeLod);
  // the thin rim scatters whatever sun reaches it
  trans += uSunCol*mix(uPale, uHoney, 0.6)*isRim*lit*(0.25 + 1.2*fwd)*0.28;
  col += trans;
  gl_FragColor = vec4(max(col, 0.), 1.);
  #include <fog_fragment>
}`;function He(e,t,o,c,d){const s=[];t.forEach((h,n)=>{s.push(e.pos.length/3);for(let p=0;p<o;p++){const i=p/o*Math.PI*2+(c===0?.3:0);e.v(Math.cos(i)*h.rx,h.y,h.zc+Math.sin(i)*h.rz,{aP:[c,h.w??1,0,h.b??n/(t.length-(d?0:1))]})}});const a=t[1].y>t[0].y;for(let h=0;h<t.length-1;h++)for(let n=0;n<o;n++){const p=s[h]+n,i=s[h]+(n+1)%o,b=s[h+1]+(n+1)%o,l=s[h+1]+n;a?e.quad(p,l,b,i):e.quad(p,i,b,l)}if(d){const h=e.v(0,d.y,d.zc,{aP:[c,1,0,1]}),n=s[t.length-1];for(let p=0;p<o;p++)a?e.tri(n+p,h,n+(p+1)%o):e.tri(n+p,n+(p+1)%o,h)}}function Tt(){const e=Ce({aP:4});He(e,[{y:.1,rx:.06,rz:.05,zc:.17,b:0},{y:-.03,rx:.16,rz:.13,zc:.18,b:.18},{y:-.24,rx:.19,rz:.16,zc:.19,b:.48},{y:-.46,rx:.14,rz:.12,zc:.18,b:.78}],5,0,{y:-.66,zc:.16}),He(e,[{y:.12,rx:.08,rz:.07,zc:.19,w:0,b:0},{y:.28,rx:.18,rz:.16,zc:.21,w:0,b:0},{y:.43,rx:.08,rz:.08,zc:.19,w:0,b:0}],5,1,null),He(e,[{y:.44,rx:.07,rz:.06,zc:.18,w:0,b:0},{y:.53,rx:.12,rz:.09,zc:.17,w:0,b:0}],4,2,{y:.61,zc:.15});for(const t of[-1,1]){const o=[[.07,.34,.37,0],[.27,-.08,.385,.6],[.2,-.56,.37,1],[.05,-.2,.375,.5]].map(n=>e.v(n[0]*t,n[1],n[2],{aP:[3,n[3],t,n[3]]}));t>0?e.quad(o[0],o[3],o[2],o[1]):e.quad(o[0],o[1],o[2],o[3]);const c=[.36,.28,.2],d=[.5,.27,.04],s=[.64,.25,-.17],a=[.42,.55,.5];for(let n=0;n<3;n++){const p=(n+(t>0?1:0))%2*.5,i=[[.1,c[n],.12,0],[.34,d[n],.27,.5],[a[n],s[n],0,1]],b=[];for(const l of i)for(const v of[-1,1])b.push(e.v(l[0]*t,l[1]+v*.028*(1.3-l[3]*.6),l[2],{aP:[4,l[3],p,0]}));for(let l=0;l<2;l++){const v=l*2;t>0?e.quad(b[v],b[v+1],b[v+3],b[v+2]):e.quad(b[v],b[v+2],b[v+3],b[v+1])}}const h=[[.04,.58,.2],[.085,.6,.2],[.2,.84,.1]].map(n=>e.v(n[0]*t,n[1],n[2],{aP:[4,0,0,0]}));e.tri(h[0],h[1],h[2])}return e.geometry()}function It(){const e=Ce({aP:4}),t=(n,p,i,b,l,v)=>[[-p,i],[0,b],[p,i]].map(m=>e.v(m[0],n,m[1],{aP:[l,l===0?1:0,0,v]})),o=t(.1,.07,.1,.22,0,0),c=t(-.2,.19,.08,.36,0,.42),d=e.v(0,-.66,.14,{aP:[0,1,0,1]});e.quad(o[0],c[0],c[1],o[1]),e.quad(o[1],c[1],c[2],o[2]),e.tri(c[0],d,c[1]),e.tri(c[1],d,c[2]);const s=t(.12,.09,.1,.3,1,0),a=t(.38,.16,.1,.39,1,.1),h=e.v(0,.62,.15,{aP:[1,0,0,1]});e.quad(s[0],s[1],a[1],a[0]),e.quad(s[1],s[2],a[2],a[1]),e.tri(a[0],a[1],h),e.tri(a[1],a[2],h);for(const n of[-1,1]){const p=[[.05,.32,.38,0],[.29,-.14,.385,.6],[.1,-.57,.37,1]].map(i=>e.v(i[0]*n,i[1],i[2],{aP:[3,i[3],n,i[3]]}));n>0?e.tri(p[0],p[2],p[1]):e.tri(p[0],p[1],p[2])}return e.geometry()}const At=`
${Me}
attribute vec4 aP, aInfo; attribute vec3 aWhere;
uniform float uPx;
varying vec3 vLocal, vWorld, vN; varying vec4 vP; varying vec3 vI; varying float vBack;
#include <fog_pars_vertex>
void main(){
  vec3 p = position, n = normal;
  vec3 ip = instanceMatrix[3].xyz;
  // a bee under about a pixel and a half across is not drawn (it was sparkle on the far curtains): the painted cloak stands for it
  float pxw = 0.42*projectionMatrix[1][1]*uPx*0.5/max(distance(cameraPosition, (modelMatrix*vec4(ip, 1.)).xyz), 0.5);
  float seed = aInfo.x, part = aP.x, ct = uTime*uCalm;
  float flip = waveAt(ip.xy, seed);
  float isLeg = step(3.5, part), isWing = step(2.5, part)*(1. - isLeg), isAbd = 1. - step(0.5, part);
  // abdomen: pitch up about the petiole (the defence flip), and a breathing pump
  float ang = isAbd*(flip*1.48 + 0.06*sin(ct*4. + seed*40.));
  vec3 piv = vec3(0., 0.1, 0.17);
  float ca = cos(ang), sa = sin(ang);
  vec3 q = p - piv; q.y *= 1. + isAbd*0.05*sin(ct*5.3 + seed*17.);
  p = piv + vec3(q.x, ca*q.y + sa*q.z, -sa*q.y + ca*q.z);
  n = vec3(n.x, ca*n.y + sa*n.z, -sa*n.y + ca*n.z);
  // wings: lift with the flip, spread and shimmer when fanning
  float fanner = aInfo.y;
  vec3 root = vec3(0.07*aP.z, 0.34, 0.37);
  float spread = isWing*aP.z*(0.85*fanner + 0.55*flip), lift = isWing*(0.75*flip + 0.25*fanner);
  float cs = cos(spread), ss = sin(spread), cl = cos(lift), sl = sin(lift);
  q = p - root; q = vec3(cs*q.x - ss*q.y, ss*q.x + cs*q.y, q.z);
  q = vec3(q.x, cl*q.y + sl*q.z, -sl*q.y + cl*q.z);
  q.z += isWing*aP.y*fanner*0.06*sin(uTime*11. + seed*30.);
  p = root + q;
  // walkers: the body advances at v; a foot in stance moves back at exactly v, so it stays put on the wax
  float v = aInfo.z, L = max(aInfo.w, 1.);
  float walk = step(0.001, v);
  float tu = fract(uTime*v/L + seed*7.);
  float ph = fract(uTime*2. + aP.z + seed*3.);            // 0.5 s cycle, half of it in stance
  float S = v*0.25;
  float sw = clamp((ph - 0.5)*2., 0., 1.); sw = sw*sw*(3. - 2.*sw);
  float fy = ph < 0.5 ? S*(0.5 - ph*2.) : S*(sw - 0.5);
  float fz = ph < 0.5 ? 0. : 0.11*sin(3.14159*clamp((ph - 0.5)*2., 0., 1.));
  p.y += walk*isLeg*aP.y*fy; p.z += walk*isLeg*aP.y*fz;
  // everyone else shuffles on the spot: the body turns a little, feet stay where they are
  float tw = (1. - walk)*(0.12*sin(ct*1.3 + seed*50.) + 0.05*sin(ct*3.1 + seed*90.))*(1. - isLeg*aP.y);
  float ct2 = cos(tw), st2 = sin(tw);
  p = vec3(ct2*p.x - st2*p.y, st2*p.x + ct2*p.y, p.z + (1. - isLeg*aP.y)*0.015*sin(ct*2.3 + seed*70.));
  n = vec3(ct2*n.x - st2*n.y, st2*n.x + ct2*n.y, n.z);
  float sc = mix(1., smoothstep(0., 0.07, tu)*(1. - smoothstep(0.93, 1., tu)), walk);
  float fr = uAbs.y*60. - 6.;
  sc *= 1. - step(abs(aWhere.x - uAbs.x), 0.5)*(1. - smoothstep(fr, fr + 5., aWhere.y));
  sc *= smoothstep(1.1, 2.2, pxw);
  p = p*sc + vec3(0., walk*(tu - 0.5)*L, 0.);
  vec4 lp = instanceMatrix*vec4(p, 1.);
  vLocal = lp.xyz;
  vec4 wp = modelMatrix*lp;
  vWorld = wp.xyz;
  vN = mat3(modelMatrix)*(mat3(instanceMatrix)*n);
  vP = aP; vI = vec3(flip, seed, fanner); vBack = step(aWhere.z, 0.);
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Vt=`
${Me}
uniform vec3 uPale, uBeeDark;
varying vec3 vLocal, vWorld, vN; varying vec4 vP; varying vec3 vI; varying float vBack;
#include <fog_pars_fragment>
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vWorld + vec3(0., 1e-4, 0.));
  float part = vP.x, flip = vI.x, b = vP.w;
  vec3 paleB = uPale*0.56;
  float bp = fract(b*4.7 + 0.12);
  float band = smoothstep(0.78, 0.86, bp)*(1. - smoothstep(0.93, 1., bp));
  vec3 abd = mix(uBeeDark, uPale*0.36, band*0.85);
  abd = mix(abd, vec3(0.2, 0.11, 0.035), (1. - smoothstep(0.06, 0.24, b))*0.8);
  abd = mix(abd, paleB, flip*0.8);
  vec3 tho = mix(vec3(0.14, 0.078, 0.021)*(0.75 + 0.5*fract(vI.y*7.3)), uBeeDark*0.7, smoothstep(0.45, 0.62, b));
  vec3 wing = mix(vec3(0.045, 0.038, 0.033), paleB*1.1, max(flip*0.8, vI.z*0.25));
  vec3 alb = part < 0.5 ? abd : part < 1.5 ? tho : part < 2.5 ? uBeeDark*0.7 : part < 3.5 ? wing : uBeeDark*0.8;
  float isWing = step(2.5, part)*(1. - step(3.5, part));
  // beyond 30 m a bee is a dark body in a dark cloak: wings, fur and rim are left to the close pass; a flipped abdomen stays pale
  float nearK = 1. - smoothstep(26., 75., distance(cameraPosition, vWorld));
  alb = mix(mix(uBeeDark*0.8, alb, max(flip*step(part, 0.5), flip*isWing*0.7)), alb, nearK);
  float lit = roofLit(vLocal);
  vec3 col = sunShade(alb, N, V, lit, mix(26., 90., isWing), mix(0.05, 0.16, isWing)*mix(0.15, 1., nearK));
  float rim = pow(1. - max(dot(N, V), 0.), 3.)*(0.35 + 0.65*max(dot(N, uSunDir), 0.))*lit;
  col += uSunCol*rim*vec3(0.5, 0.36, 0.2)*0.32*mix(0.1, 1., nearK);
  col += uSkyCol*isWing*pow(1. - max(dot(N, V), 0.), 4.)*mix(0.08, 0.3, flip)*nearK;
  float shadeSide = smoothstep(0.2, -0.3, dot(N, uSunDir));
  col += vec3(0.62, 0.4, 0.16)*max(1. - lit, shadeSide)*(0.03 + 0.2*pow(1. - max(dot(N, V), 0.), 2.5));   // fur catching the amber of the combs in shade
  col += vec3(0.8, 0.44, 0.13)*shadeSide*vBack*(0.05 + 0.13*isWing + 0.2*pow(1. - max(dot(N, V), 0.), 2.));   // against the light of the comb behind them
  gl_FragColor = vec4(max(col, 0.), 1.);
  #include <fog_fragment>
}`,Bt=`
${Me}
attribute vec3 aBase; attribute vec4 aR;
varying vec3 vLocal, vWorld, vN; varying float vS;
#include <fog_pars_vertex>
void main(){
  float s = position.x, a = position.y;
  float len = aR.x*(1. + 0.05*sin(uTime*0.4 + aR.z));
  float k = len*0.55;
  float coil = aR.w*s*s*(0.4 + 0.6*s), dcoil = aR.w*(0.8*s + 1.8*s*s);
  float th = s*k - uTime*1.5 + aR.z;
  vec3 sway = vec3(sin(uTime*0.6 + aR.z*2.), 0., cos(uTime*0.47 + aR.z))*0.35*s*s;
  vec3 c = aBase + vec3(cos(th)*coil, -s*len, sin(th)*coil) + sway;
  vec3 tg = normalize(vec3(-sin(th)*coil*k + cos(th)*dcoil, -len, cos(th)*coil*k + sin(th)*dcoil));
  vec3 b1 = normalize(cross(tg, vec3(0., 0., 1.)) + vec3(1e-4, 0., 0.));
  vec3 b2 = cross(tg, b1);
  float bead = pow(0.5 + 0.5*sin(s*len*1.25 - uTime*2.1 + aR.z*3.), 8.);
  float r = aR.y*(0.36 + 0.64*exp(-s*9.))*(1. + 1.5*bead*(0.25 + s));
  r += aR.y*0.9*(1. - smoothstep(0., 0.03, s));             // the root flares where it leaves the comb
  vec4 wc = modelMatrix*vec4(c, 1.);
  r = max(r, distance(cameraPosition, wc.xyz)*0.0016)*(1. - smoothstep(0.93, 1., s));
  vec3 nl = b1*cos(a) + b2*sin(a);
  vec3 lp = c + nl*r;
  vLocal = lp; vS = s*len - uTime*2.1;
  vec4 wp = modelMatrix*vec4(lp, 1.);
  vWorld = wp.xyz; vN = mat3(modelMatrix)*nl;
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Ft=`
${Me}
uniform vec3 uHoney;
varying vec3 vLocal, vWorld, vN; varying float vS;
#include <fog_pars_fragment>
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  vec3 V = normalize(cameraPosition - vWorld + vec3(0., 1e-4, 0.));
  float lit = mix(0.3, 1., roofLit(vLocal));
  float fwd = max(dot(-V, uSunDir), 0.); fwd *= fwd;
  float fres = pow(1. - max(dot(N, V), 0.), 3.);
  vec3 col = sunShade(uHoney*0.5, N, V, lit, 110., 1.2);
  col += uSunCol*uHoney*vec3(1., 0.85, 0.6)*(0.34 + 1.2*fwd + 0.1*sin(vS*1.3))*lit*(1. - 0.5*fres);   // sun held inside the honey
  col += uSkyCol*fres*0.8;
  gl_FragColor = vec4(max(col, 0.), 1.);
  #include <fog_fragment>
}`;function qt(e){const o=[],c=[],d=[],s=[];e.forEach(h=>{const n=h.seg||36,p=o.length/3;for(let i=0;i<=n;i++)for(let b=0;b<5;b++)o.push(i/n,b/5*Math.PI*2,0),c.push(h.p.x,h.p.y,h.p.z),d.push(h.len,h.r0,h.phase,h.coil);for(let i=0;i<n;i++)for(let b=0;b<5;b++){const l=p+i*5+b,v=p+i*5+(b+1)%5,m=l+5,f=v+5;s.push(l,m,v,v,m,f)}});const a=new w.BufferGeometry;return a.setAttribute("position",new w.Float32BufferAttribute(o,3)),a.setAttribute("aBase",new w.Float32BufferAttribute(c,3)),a.setAttribute("aR",new w.Float32BufferAttribute(d,4)),a.setIndex(s),a}async function jt(e,t,o,c,d,s,a){const h=[],n=[],p=[],i=new w.Vector3,b=(m,f,g,P,T)=>{const V=Pe(f,g,P);V>.97||P<.8||mt(g,P,T,V,f)<.6||f.index===5&&Math.hypot(g-c.cx,P-c.d)<c.r*1.15+5||(ee(f,g,P,T*(we(f,V,g,P)+.04),i),m.push({p:i.clone(),side:T,c:f,d:P,rot:t.range(-.5,.5),s:t.range(.9,1.14),seed:t(),fan:t.chance(.09)?1:0,v:0,L:0,dir:null}))},l=(m,f,g,P,T,V,D,F)=>{for(let N=V;N<D;N+=T)for(let C=-f.hw;C<f.hw;C+=P){const X=N+t.range(-.4,.4)*T,Y=C+t.range(-.4,.4)*P;F&&F(X)||b(m,f,Y,X,g)}};for(const m of[0,1,2]){const f=o[m];l(h,f,1,m?1.22:1.5,m?1.55:1.8,f.top-195.8,f.top-183.2)}await e.yield();for(let m=0;m<6;m++){const f=o[m],g=P=>m<=2&&P>f.top-195.8&&P<f.top-183.2;l(n,f,1,1.6,1.75,1.5,f.dep,g),await e.yield()}l(n,o[3],-1,1.7,1.9,1.5,o[3].dep,null),l(n,o[2],-1,3.2,3.2,1.5,o[2].dep,null),l(n,o[4],-1,3.2,3.2,1.5,o[4].dep,null),t.shuffle(h),t.shuffle(n),h.length=Math.min(h.length,s),n.length=Math.min(n.length,a);const v=o[5];for(let m=0;m<400&&p.length<26&&d.length;m++){const f=t.pick(d),g=t.range(1.6,6),P=t.range(5,9),T=t.chance(.7)?1:-1,V=t.sign(),D=t.range(-.35,.35);let F=-Math.sin(f.th)*V+Math.cos(f.th)*D,N=Math.cos(f.th)*V+Math.sin(f.th)*D;const C=Math.hypot(F,N);F/=C,N/=C;const X=f.cx+Math.cos(f.th)*g,Y=f.d+Math.sin(f.th)*g;let Q=!0;for(let j=-.5;j<=.5001&&Q;j+=.25){const W=X+F*P*j,z=Y+N*P*j,R=Math.atan2(z-c.d,W-c.cx);(z<1||Pe(v,W,z)>.9||Math.hypot(W-c.cx,z-c.d)<Ie(c,R)+1.1)&&(Q=!1)}if(!Q)continue;const M=Pe(v,X,Y);ee(v,X,Y,T*(we(v,M,X,Y)+.03),i);const u=new w.Vector3(v.t.x*F,-N,v.t.z*F).normalize();p.push({p:i.clone(),side:T,c:v,d:Y,rot:0,s:t.range(.95,1.1),seed:t(),fan:0,v:t.range(.7,1.15),L:P,dir:u})}return{near:h.concat(p),mid:n,walkers:p.length}}function st(e,t,o){const c=new w.InstancedMesh(e,t,Math.max(1,o.length));c.count=o.length;const d=new Float32Array(Math.max(1,o.length)*4),s=new Float32Array(Math.max(1,o.length)*3),a=new w.Vector3,h=new w.Vector3,n=new w.Vector3,p=new w.Vector3(0,1,0),i=new w.Matrix4;return o.forEach((b,l)=>{n.copy(b.c.n).multiplyScalar(b.side),b.dir?h.copy(b.dir):(a.crossVectors(p,n).normalize(),h.copy(p).multiplyScalar(Math.cos(b.rot)).addScaledVector(a,Math.sin(b.rot))),a.crossVectors(h,n).normalize(),i.makeBasis(a,h,n).scale(new w.Vector3(b.s,b.s,b.s)).setPosition(b.p),c.setMatrixAt(l,i),d.set([b.seed,b.fan,b.v,b.L],l*4),s.set([b.c.index,b.d,b.side],l*3)}),e.setAttribute("aInfo",new w.InstancedBufferAttribute(d,4)),e.setAttribute("aWhere",new w.InstancedBufferAttribute(s,3)),c.instanceMatrix.needsUpdate=!0,c.computeBoundingSphere(),c.boundingSphere&&(c.boundingSphere.radius+=12),c}function Et(e,t,o){let c=1/0;for(const d of e){const s=o.x-d.x,a=o.z-d.z,h=s*d.t.x+a*d.t.z,n=s*d.n.x+a*d.n.z,p=d.top-o.y;if(Math.abs(n)>40||Math.abs(h)>d.hw+40)continue;const i=Math.max(p,.01),b=Pe(d,h,i),l=Math.hypot(h,i);let v=b>1?l*(1-1/b):0;p<0&&(v=Math.hypot(v,-p)*0);const m=we(d,Math.min(b,1),h,i)+.7;let f=Math.hypot(v,Math.max(0,Math.abs(n)-m));if(d.index===5){const g=Math.hypot(h-t.cx,i-t.d),P=Ie(t,Math.atan2(i-t.d,h-t.cx));g<P&&(f=Math.hypot(P-g-.6,Math.max(0,Math.abs(n)-m)))}p>-2&&(c=Math.min(c,f))}return c}const Ne=(e,t)=>e&&e.isColor?e.clone():new w.Color(e??t);async function Rt(e,t={}){const o=e.rng.fork?e.rng.fork("honey-cliff-hero"):e.rng,c=e.noise,d=e.quality?.detail??1,s=(t.palette&&t.palette.length>=7?t.palette:rt).map(r=>new w.Color(r)),a=t.hour==="night"?"dawn":t.hour||"morning",h=a==="dawn"||a==="golden",n={rock:s[2],honey:s[3],dark:s[4],pale:s[5],wax:s[5].clone().lerp(s[3],.45)},p=ut(o,t.season||"spring"),i=vt(),b=new w.CatmullRomCurve3(i.pts.map(r=>new w.Vector3(r[0],r[1],r[2])),!1,"centripetal"),l=520,v=b.getSpacedPoints(l),m=(r,x,y,A=0)=>{let k=1/0;for(let L=A;L<=l;L++){const E=v[L],$=E.x-r,Z=E.y-x,oe=E.z-y,se=$*$+Z*Z+oe*oe;se<k&&(k=se)}return Math.sqrt(k)},f=p[5],g={cx:6,d:26,r:12.6,p1:o.range(0,6.28),p2:o.range(0,6.28),p3:o.range(0,6.28)};for(let r=Math.floor(l*.6);r<l;r++){const x=v[r],y=v[r+1],A=(x.x-f.x)*f.n.x+(x.z-f.z)*f.n.z,k=(y.x-f.x)*f.n.x+(y.z-f.z)*f.n.z;if(A>0&&k<=0&&Math.abs((x.x-f.x)*f.t.x+(x.z-f.z)*f.t.z)<f.hw){const L=A/(A-k),E=x.x+(y.x-x.x)*L,$=x.z+(y.z-x.z)*L;g.cx=(E-f.x)*f.t.x+($-f.z)*f.t.z,g.d=f.top-(x.y+(y.y-x.y)*L);break}}const P=ee(f,g.cx,g.d,0,new w.Vector3);await e.yield();const T=new w.Vector3().fromArray(t.sunDir||(h?[-.33,.21,.92]:[-.29,.53,.8])).normalize(),V=Ne(t.sunColor,h?"#ffbe8f":"#fff3df").multiplyScalar(t.sunIntensity??(h?2.3:2.5)),D=Ne(t.skyColor,s[1].clone().lerp(s[6],.42)).multiplyScalar(t.skyIntensity??.6),F=Ne(t.bounceColor,s[2].clone().lerp(s[1].clone().lerp(s[6],.5),.6)).multiplyScalar(.34),N={uSunDir:{value:T.clone()},uSunL:{value:T},uSunCol:{value:V},uSkyCol:{value:D},uBounceCol:{value:F},uTime:{value:0},uCalm:{value:h?.45:1},uShadowK:{value:.66},uWave:{value:[0,1,2,3].map(()=>new w.Vector4(0,0,0,-1))},uAbs:{value:new w.Vector2(-5,0)},uPx:{value:450},uHoney:{value:n.honey},uPale:{value:n.pale},uRock:{value:n.rock},uBeeDark:{value:n.dark.clone().multiplyScalar(1.7).add(new w.Color(.006,.0045,.004))},uPortalPos:{value:i.portal.clone()},uPortalCol:{value:n.honey.clone().lerp(n.pale,.5).multiplyScalar(1.6)},uCombA:{value:p.map(r=>new w.Vector4(r.x,r.z,r.hw,r.dep))},uWet:{value:t.weather==="rain"?1:0},uHaze:{value:new w.Vector4(0,0,0,0)},uSea:{value:new w.Vector4(0,0,0,0)},uBite:{value:new w.Vector4(g.cx,g.d,g.r,5)},uBiteP:{value:new w.Vector3(g.p1,g.p2,g.p3)},uMouth:{value:i.mouth.clone()},uMr:{value:new w.Vector3},uMu:{value:new w.Vector3},uMd:{value:i.dir.clone()},uGlowPos:{value:i.mouth.clone().addScaledVector(i.dir,5)},uGlowCol:{value:n.honey.clone().lerp(n.pale,.4).multiplyScalar(1.5)},uWinPos:{value:new w.Vector3},uWinCol:{value:new w.Color(0,0,0)}},C=De(i);N.uMr.value.copy(C.r),N.uMu.value.copy(C.u);const X=p[3],Y=()=>{N.uWinPos.value.copy(ee(X,0,12,-3,new w.Vector3)),N.uWinCol.value.setRGB(1,.5,.13).multiplyScalar(.5*Math.max(0,X.n.dot(T))*Math.max(V.r,.2))};Y();const Q=()=>{N.uShadowK.value=Math.min(4,Math.max(0,T.y)/Math.max(T.z,.08))};Q();const M=(r,x,y={},A=w.DoubleSide)=>new w.ShaderMaterial({uniforms:{...w.UniformsUtils.clone(w.UniformsLib.fog),...N,...y},vertexShader:r,fragmentShader:x,side:A,fog:!0}),u=new w.Group;u.name="honey-cliff-hero";const j=(r,x)=>K(.55,1.1,Math.hypot((r-i.mouth.x)/26,(x-i.mouth.y)/30))*.9+.1,W=Math.floor(l*.5),z=await yt(e,c,j,(r,x,y)=>m(r,x,y,W)),R=new w.Mesh(z,M(Re,Ke,{uCleft:{value:new w.Vector4(1,1,0,0)}}));u.add(R),await e.yield();const _=(r,x,y=[])=>{const A=Ee(r);let k=0;for(;k<A.length-2&&x>A[k+1][1];)k++;const L=A[k],E=A[k+1],$=Math.min(1,Math.max(0,(x-L[1])/Math.max(.001,E[1]-L[1]))),Z=L[0]+(E[0]-L[0])*$;let oe=E[0]-L[0],se=E[1]-L[1];const ue=Math.hypot(oe,se)||1;oe/=ue,se/=ue;const ce=se,re=-oe,Oe=j(r,x),$e=ae(r);let Se=at(c,r,x,Z,re,Oe);if(x>150&&x<218&&Oe>.5)for(let Xe=0;Xe<4;Xe++){const Ye=m(r,x+re*Se,$e+Z+ce*Se,W);if(Ye>=7.2)break;Se-=(7.3-Ye)*1.15}return y[0]=r,y[1]=x+re*Se,y[2]=$e+Z+ce*Se,y[3]=re,y[4]=ce,y},G=(r,x,y)=>{const A=[];let k=Math.floor(qe(Ae(r,x)));for(let L=x+.25;L<y;L+=.25){const E=Math.floor(qe(Ae(r,L)));if(E!==k){const $=1.9*(je(k)-je(E));$>.5&&A.push({y:L-.12,width:$}),k=E}}return A},J=[],q=Pt(C,(r,x)=>_(r,Math.min(x,203),J)[2]),U=await kt(e,c,i,q);u.add(new w.Mesh(U,M(Re,Ke,{uCleft:{value:new w.Vector4(0,0,1,0)}}))),await e.yield();const H=await zt(e,p);u.add(new w.Mesh(H,M(Nt,Wt))),await e.yield();const B=await Ct(e,o,c,p,g,i,n,q);u.add(new w.Mesh(B.geometry,M(St,Lt))),await e.yield();const I=[],S=new w.Vector3,O=o.shuffle(B.ropeSeats.slice());for(const r of O){if(I.length>=8)break;const x=o.pick([-.9,-.5,0,.5,.9])*r.ht;if(ee(f,r.cx-Math.cos(r.th)*.25,r.d-Math.sin(r.th)*.25,x,S),I.some(k=>k.p.distanceTo(S)<2.4))continue;const y=o.range(.5,1.4);let A=o.range(15,36);for(let k=0;k<=10;k++){const L=k/10;if(m(S.x,S.y-L*A,S.z,300)<6.5+y*L*L+.6){A=A*(L-.1);break}}A<5||I.push({p:S.clone(),len:A,r0:o.range(.26,.48),phase:o.range(0,6.28),coil:y})}for(const r of p){const x=r.tier?3:5;for(let y=0;y<x;y++){const A=Math.PI*(.5+(y-(x-1)/2)*.13+o.range(-.035,.035)),k=Le(r,A),L=y%2?-.5:.6,E=k[0]*.992,$=k[1]*.992;ee(r,E,$,L*we(r,.99,E,$),S);let Z=(r.tier?o.range(6,13):o.range(8,19))*(y===(x-1)/2?1.25:1);const oe=o.range(.12,.4),se=o.range(.24,.4),ue=o.range(0,6.28);if(!(r.index===5&&Math.hypot(E-g.cx,$-g.d)<g.r*1.5)){for(let ce=0;ce<=8;ce++){const re=ce/8;if(m(S.x,S.y-re*Z,S.z,200)<7+oe){Z=Z*(re-.13);break}}Z<3||I.push({p:S.clone(),len:Z,r0:se,phase:ue,coil:oe,seg:14})}}await e.yield()}const xe=new w.Mesh(qt(I),M(Bt,Ft));xe.frustumCulled=!1,u.add(xe),await e.yield();const ne=await jt(e,o,p,g,B.walkSeats,560,Math.round(2700*(.5+.5*d)));await e.yield();const he=M(At,Vt);u.add(st(Tt(),he,ne.near)),await e.yield(),u.add(st(It(),he,ne.mid)),await e.yield();const te={combs:1/0,rock:1/0,wax:1/0};for(let r=0;r<=l;r+=2){const x=Et(p,g,v[r]);x<te.combs&&(te.combs=x,te.combsAt=v[r].toArray().map(y=>Math.round(y)))}await e.yield();const pe=async(r,x)=>{const y=r.attributes.position.array;let A=1/0;for(let k=0;k<y.length;k+=3){const L=y[k],E=y[k+1],$=y[k+2];if(k%12e3===0&&await e.yield(),E<150||E>216)continue;if(x){const oe=L-i.mouth.x,se=E-i.mouth.y,ue=$-i.mouth.z,ce=oe*C.r.x+se*C.r.y+ue*C.r.z,re=oe*C.u.x+se*C.u.y+ue*C.u.z;if(Math.abs(oe*C.d.x+se*C.d.y+ue*C.d.z)<16&&Math.hypot(ce,re)<ke(Math.atan2(re,ce))+1.3)continue}const Z=m(L,E,$);Z<A&&(A=Z)}return A};te.rock=await pe(z,!0),await e.yield(),te.rock=Math.min(te.rock,await pe(U,!1)),await e.yield(),te.wax=await pe(B.geometry,!1);let be=t.journeySeconds??41.6;const le=p[4];let me=(t.waves||[{u:.3,x:-215,y:190},{u:.645,x:p[3].x,y:194},{u:.84,x:le.x+8,y:190},{u:.872,x:le.x-10,y:184},{u:.905,x:P.x,y:P.y}]).slice().sort((r,x)=>r.u-x.u);const ze=[];for(let r=0;r<9;r++){const x=p[o.int(0,11)];ze.push({x:x.x+o.range(-20,20),y:x.top-o.range(8,30)})}ze[0]={x:-215,y:190};const ie=[];let ge=-1,Ge=0;const nt=r=>{const x=N.uWave.value;let y=0;const A=(k,L,E)=>{y<4&&E>=0&&E<14&&x[y++].set(k,L,0,E)};for(let k=ie.length-1;k>=0;k--){const L=r-ie[k].t0;L>14||L<0?ie.splice(k,1):A(ie[k].x,ie[k].y,L)}if(ge>=0)for(let k=me.length-1;k>=0;k--)A(me[k].x,me[k].y,(ge-me[k].u)*be);else{const k=Math.floor(r/6.5);for(let L=0;L<3;L++){const E=k-L;if(E>=0){const $=ze[E%ze.length];A($.x,$.y,r-E*6.5)}}}for(;y<4;)x[y++].w=-1},fe=(r,x,y)=>new w.Vector3(r,x,y),We=p[3],lt=ee(We,0,We.top-194.5,-15.8,new w.Vector3),it={flyThrough:i.pts.map(r=>fe(r[0],r[1],r[2])),secondPassStart:i.secondPassStart,entry:i.entry,route:i.route,portalSeat:{position:i.portal.clone(),direction:i.dir.clone(),facing:i.dir.clone().negate(),radius:7},cleftMouth:i.mouth.clone(),combs:p.map(r=>({index:r.index,tier:r.tier,center:ee(r,0,r.dep*.45,0,new w.Vector3),normal:r.n.clone(),tangent:r.t.clone(),halfWidth:r.hw,depth:r.dep,top:r.top})),tear:{position:P.clone(),radius:g.r},window:{position:lt,lookAt:ee(We,-3,9.5,0,new w.Vector3),lookAtSouth:ee(We,-17,10,0,new w.Vector3)},buzzardLine:[fe(-250,192,ae(-250)+ve+25),fe(-110,190,ae(-110)+ve+25),fe(40,190,ae(40)+ve+25),fe(250,192,ae(250)+ve+25)],hornetStation:ee(le,0,le.top-188,8,new w.Vector3),ladderSeat:fe(242,ye-.5,22),torchSeat:fe(259,ye-.5,12.5),roofLip:Array.from({length:20},(r,x)=>{const y=-285+x*30;return fe(y,ye+3,ae(y)+Ve*Fe(y))}),sunDir:T.clone()},ct=fe(0,165,0),Ue={object:u,radius:340,height:200,center:ct,anchors:it,ground:!1,groundY:Je,uniforms:N,clearance:te,combs:p,info:{triangles:0,ropes:I.length,nearBees:ne.near.length,midBees:ne.mid.length,walkers:ne.walkers},setProgress(r){ge=Math.min(1,Math.max(0,r))},setSchedule(r,x){me=r.slice().sort((y,A)=>y.u-A.u),x&&(be=x)},launchWave(r,x){ie.push({x:r,y:x,t0:Ge}),ie.length>3&&ie.shift()},setAbscond(r,x=2){N.uAbs.value.set(r>0?x:-5,Math.min(1,Math.max(0,r)))},setSun(r,x,y,A){r&&(T.copy(r).normalize(),Q()),x&&V.copy(x),y&&D.copy(y),A&&F.copy(A),Y()},rockMaterial(r){return M(Re,Ke,{uCleft:{value:new w.Vector4(0,1,0,0)},uHaze:{value:new w.Vector4().fromArray(r||[0,0,0,0])}})},profileAt:Ee,zBack:ae,jutF:Fe,wallPoint:_,ledgesAt:G,holeR:ke,lipS:q,cleftFrame:C,cleftLength:de,bedDisp:tt,setPortalLight(r,x=1.6,y=x*.8){N.uPortalCol.value.copy(Ne(r)).multiplyScalar(x),N.uGlowCol.value.copy(Ne(r)).multiplyScalar(y)},update(r,x,y){Ge=x,N.uTime.value=x,u.updateMatrixWorld(),N.uSunDir.value.copy(T).transformDirection(u.matrixWorld),nt(x)},dispose(){}};return u.traverse(r=>{if(r.isMesh){const x=r.geometry,y=(x.index?x.index.count:x.attributes.position.count)/3;Ue.info.triangles+=y*(r.isInstancedMesh?r.count:1)}}),Ue}export{Rt as buildHero,vt as makeFlyThrough};
