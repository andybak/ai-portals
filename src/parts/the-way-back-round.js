import*as x from"three";import{makeNoise as ke,makeRng as Pe,smoothstep as E,lerp as K,clamp as ce}from"../kit/core.js";const Se=["#EAF2F5","#F6B8C8","#FFFFFF","#5C7F8A","#2C3E46","#E9C46A","#A7D8D0"],U=Math.PI*2,c=(e,t,b)=>new x.Vector3(e,t,b);function Ce(){return{pos:[],nor:[],bark:[],idx:[],idxTwig:[],n:0}}function he(e,t,b,r,A,M,p){const w=new x.CatmullRomCurve3(t,!1,"centripetal"),S=e.n,y=c(0,1,0),o=c(),i=c(),g=c(),d=c(),l=c();let s=c(1,0,0),C=0;const m=c(),z=Math.max(5,Math.round(U*A(.3)/.42));for(let a=0;a<=b;a++){const n=a/b;w.getPoint(n,d),w.getTangent(n,o),a===0&&Math.abs(o.dot(s))>.9&&s.set(0,0,1),M===2&&n<.34&&Math.abs(o.y)<.85?i.copy(y).addScaledVector(o,-o.y):i.copy(s).addScaledVector(o,-s.dot(o)),i.lengthSq()<1e-6&&i.copy(y).addScaledVector(o,-y.dot(o)),i.normalize(),g.crossVectors(o,i).normalize(),s.copy(i),a>0&&(C+=d.distanceTo(m)),m.copy(d);const v=A(n);for(let f=0;f<=r;f++){const F=f/r*U,T=Math.cos(F),_=Math.sin(F);l.copy(i).multiplyScalar(T).addScaledVector(g,_);const R=p?p(F,n,l):1;e.pos.push(d.x+l.x*v*R,d.y+l.y*v*R,d.z+l.z*v*R),e.nor.push(l.x,l.y,l.z),e.bark.push(f/r,C,z,M)}}const h=r+1;for(let a=0;a<b;a++)for(let n=0;n<r;n++){const v=S+a*h+n,f=v+h;e.idx.push(v,f,v+1,v+1,f,f+1)}return e.n+=(b+1)*h,w}function Ae(e){const t=new x.BufferGeometry;t.setAttribute("position",new x.Float32BufferAttribute(e.pos,3)),t.setAttribute("normal",new x.Float32BufferAttribute(e.nor,3)),t.setAttribute("aBark",new x.Float32BufferAttribute(e.bark,4)),t.setIndex(e.idx.concat(e.idxTwig));const b=new x.BufferGeometry;for(const r of["position","normal","aBark"])b.setAttribute(r,t.getAttribute(r));return b.setIndex(e.idx),[t,b]}const $=(e,t,b)=>c(-e,t,b),re={x:-46,z:15},me=-8;function Fe(e){return(t,b)=>{const r=b>0?b/200:b/60,M=40-(t<0?4*Math.exp(-((b-me)*(b-me))/160):0)+5*e.n2(b*.021,3.7),p=.62*Math.exp(-((t-re.x)*(t-re.x)+(b-re.z)*(b-re.z))/120),w=1-Math.sqrt(t*t/(M*M)+r*r)+.1*e.n2(t*.045+9,b*.045)+p,S=Math.exp(-(t*t+b*b)/900);if(w<=0)return-2.6*E(0,-.22,w);const y=1-Math.abs(e.n2(t*.06,b*.035+20));return(2.4+5.2*S+1.4*y*y)*E(0,.28,w)+.5*e.n2(t*.19,b*.19+50)*E(0,.1,w)}}async function Ne(e,t,b){const r=Ce(),A=[],M=[],p=t.range(-1,1)*2.5,w=t()*U,S=h=>{const a=h/64;return c(Math.cos(w)*p*a*a+Math.sin(a*3.1+w)*.9,h,Math.sin(w)*p*a*a+Math.cos(a*2.3)*.9-.9)},y=9,o=[],i=Math.atan2(-36,-26);for(let h=0;h<y;h++)o.push(i+h/y*U+(h?t.range(-.16,.16):0));const g=[];for(let h=0;h<=8;h++)g.push(S(1+h*7.9));he(r,g,32,40,h=>K(7.6,2.6,Math.pow(h,1.4))+2.2*Math.pow(1-h,4),0,(h,a)=>{let n=0;for(let f=0;f<y;f++){const F=Math.cos(-h-o[f]);F>0&&(n=Math.max(n,F*F*F*F))}return 1+Math.pow(1-a,4)*(.42*n-.04)+.05*Math.sin(h*5+a*9)*(1-a)}),await e.yield();const l=(h,a,n,v,f)=>{const F=c(-a.z,0,a.x).normalize(),T=t.range(-1,1)*n*.12,_=f===1?t.range(.1,.34):t.range(0,.3),R=[h.clone()];for(let k=1;k<=3;k++){const u=k/3;R.push(h.clone().addScaledVector(a,n*u).addScaledVector(F,T*Math.sin(u*3.1)).add(c(0,n*(_*Math.sin(u*2.2)-(f===2?.16:.08)*u*u),0)))}const I=r.idx;r.idx=r.idxTwig;const L=he(r,R,f===1?7:4,f===1?6:4,k=>v*(1-.85*k)+.07,1);return r.idx=I,L},s=5+Math.floor(t()*2),C=4,m=s+C,z=t()*U;for(let h=0;h<m;h++){const a=h>=s,n=z+(a?(h-s)/C+.13:h/s)*U+t.range(-.22,.22),v=a?t.range(49,60):t.range(33,43),f=a&&h===m-1,F=f?t.range(12,18):a?t.range(32,46):t.range(52,66),T=f?t.range(44,50):a?t.range(30,42):t.range(12,22),_=c(Math.cos(n),0,Math.sin(n)),R=c(-_.z,0,_.x),I=t.range(-1,1)*F*.16,L=S(v),k=[L];for(let B=1;B<=5;B++){const V=B/5,q=a?.04:.34;k.push(L.clone().addScaledVector(_,F*(V*.92+.08)).addScaledVector(R,I*Math.sin(V*2.6)).add(c(0,T*(Math.sin(V*1.75)/.984)-q*F*V*V*V,0)))}const u=a?1.7:2.4,P=he(r,k,14,10,B=>u*Math.pow(1-B,.75)+.22+.9*Math.pow(1-B,8),1),W=P.getPoint(1);A.push({c:W,r:t.range(7.5,10)});for(const B of[.45,.8]){const V=P.getPoint(B);M.push(new x.Vector4(V.x,V.y,V.z,a?20:26))}const j=f?3:a?4:6;for(let B=0;B<j;B++){const V=K(.3,.94,(B+t.range(.2,.8))/j),q=P.getPoint(V),J=P.getTangent(V),N=B%2?1:-1,D=N*t.range(.7,1.25),H=Math.cos(D),G=Math.sin(D),O=c(J.x*H-J.z*G,0,J.x*G+J.z*H).normalize(),oe=(a?t.range(13,22):t.range(16,28))*(1.1-.45*V),ae=l(q,O,oe,u*Math.pow(1-V,.75)*.55+.16,1);A.push({c:ae.getPoint(1),r:t.range(6.5,9)}),A.push({c:ae.getPoint(.55).add(c(0,2.5,0)),r:t.range(5,7)});const pe=2+Math.floor(t()*2);for(let ie=0;ie<pe;ie++){const ve=t.range(.35,.9),ue=ae.getPoint(ve),Y=ae.getTangent(ve),ge=(ie%2?1:-1)*t.range(.6,1.3),we=Math.cos(ge),be=Math.sin(ge),ze=c(Y.x*we-Y.z*be,0,Y.x*be+Y.z*we).normalize(),Me=l(ue,ze,t.range(6,12),.2,2);A.push({c:Me.getPoint(1),r:t.range(4.5,7)})}}await e.yield()}return{G:r,lobes:A,boughShade:M,rootAng:o,axis:S}}const Q={x:-26,z:-36,half:9.6,top:16.6,y0:1.4};async function Ie(e,t,b,r,A){const M=[],p=Pe(Math.floor(Math.abs(A[1]*7919+A[3]*104729)*1e3)>>>0),w=(S,y,o)=>Math.max((r(S,y)*2+r(S+2.5,y)+r(S-2.5,y)+r(S,y+2.5)+r(S,y-2.5))/6,-.5)+o*.45;for(let S=0;S<A.length;S++){const y=A[S],o=c(Math.cos(y),0,Math.sin(y)),i=c(-o.z,0,o.x),g=t.range(26,40),d=t.range(2,5)*t.sign(),l=t()*U,s=t.range(1,1.3),C=w(o.x*11,o.z*11,s)+1.9,m=r(o.x*6,o.z*6),z=[c(o.x*3.5,m+9.5,o.z*3.5),c(o.x*7.4,K(m+9.5,C,.55),o.z*7.4),c(o.x*11,C,o.z*11)],h=d*(.1+.9*t.range(.25,.5)),a=t()*U,n=(_,R,I,L)=>{for(let k=1;k<=I;k++){const u=K(_,R,k/I),P=(d*Math.sin(u*.13+l)+h*Math.sin(u*.3+a))*E(9,17,u),W=o.x*u+i.x*P,j=o.z*u+i.z*P,B=r(W,j);z.push(c(W,L&&k===I?B>0?B-1.5:B-3.2:L&&k===I-1?B>0?w(W,j,s)-.55:Math.min(B,.4)-.5:w(W,j,s),j))}};let v=_=>.86*s*(1-.8*_)+.4*Math.pow(1-_,6)+.1,f=40;if(S===0){z.push(c(-10,w(-10,-20,s),-20));const _=Q.x+Q.half,R=Q.x-Q.half;z.push(c(_+1.5,w(_+1.5,-31,s)+.4,-31));for(const I of[8,32,60,90,120,148,172]){const L=I*Math.PI/180;z.push(c(Q.x+Q.half*Math.cos(L),Q.y0+Q.top*Math.pow(Math.sin(L),.85),Q.z+.8*Math.sin(L*2)))}z.push(c(R-2.5,-.6,Q.z-1.5),c(R-8,-1.8,Q.z-4)),v=I=>1.12*(1-.3*I)+.5*Math.pow(1-I,8)-.5*Math.pow(I,6),f=60,M.push({c:c(Q.x,9,Q.z),span:Q.half*2,height:Q.y0+Q.top})}else if(S===2||S===4){const _=t.range(13,16),R=t.range(10,13),I=t.range(7.5,10.5);n(11,_+2,2,!1);const L=z[z.length-1];for(const W of[.18,.5,.82]){const j=_+R*W;z.push(c(o.x*j+(L.x-o.x*_),L.y+I*Math.pow(Math.sin(Math.PI*W),.8),o.z*j+(L.z-o.z*_)))}const k=_+R,u=o.x*k+(L.x-o.x*_),P=o.z*k+(L.z-o.z*_);z.push(c(u,w(u,P,s)-.3,P),c(u+o.x*7,-1.6,P+o.z*7)),M.push({c:c((L.x+u)/2,L.y+I*.5,(L.z+P)/2),span:R,height:I}),f=44}else n(11,g,11,!0);const T=he(b,z,f,12,v,2,(_,R,I)=>{const L=Math.pow(1-R,5);return(1+1.55*L*I.y*I.y-.22*L*(1-I.y*I.y))*(1+.07*Math.sin(R*8+S*2.1)+.03*Math.sin(R*15+S))});if(S!==0&&S!==2&&S!==4){const _=p.range(.3,.5),R=T.getPoint(_),I=T.getTangent(_),L=p.sign()*p.range(.45,.8),k=Math.cos(L),u=Math.sin(L),P=c(I.x*k-I.z*u,0,I.x*u+I.z*k).normalize(),W=c(-P.z,0,P.x),j=p.range(10,17),B=p.range(1,2.4)*p.sign(),V=p()*U,q=v(_)*.62,J=[R.clone().add(c(0,-.1,0))];for(let N=1;N<=7;N++){const D=j*N/7,H=B*Math.sin(D*.42+V)*Math.min(D/4,1),G=R.x+P.x*D+W.x*H,O=R.z+P.z*D+W.z*H,oe=r(G,O);J.push(c(G,N===7?oe>0?oe-1.2:oe-2.5:N===6?oe>0?w(G,O,q)-.4:Math.min(oe,.3)-.4:w(G,O,q*.8),O))}he(b,J,22,8,N=>q*(1-.8*N)+.07,2,(N,D)=>1+.06*Math.sin(D*7+S))}S%3===2&&await e.yield()}return M}function _e(e){const w=new Float32Array(18375),S=[];for(let o=0;o<=124;o++)for(let i=0;i<=48;i++){const g=K(-55,55,i/48),d=K(-74,214,o/124),l=(o*49+i)*3;w[l]=g,w[l+1]=e(g,d),w[l+2]=d}for(let o=0;o<124;o++)for(let i=0;i<48;i++){const g=o*49+i,d=g+48+1;w[g*3+1]<-2.5&&w[(g+1)*3+1]<-2.5&&w[d*3+1]<-2.5&&w[(d+1)*3+1]<-2.5||S.push(g,d,g+1,g+1,d,d+1)}const y=new x.BufferGeometry;return y.setAttribute("position",new x.BufferAttribute(w,3)),y.setIndex(S),y.computeVertexNormals(),y}const xe=12,X=`
#define NSH ${xe}
uniform float uTime, uWash, uFogAmt, uProgress, uMist;
uniform vec3 uSky, uBounce, uWashCol, uPink, uWhite, uSlate, uChar, uGold, uMint, uPearl;
uniform vec4 uShade[NSH];
// boughs sway 2 degrees on a 9 s period; a function of place only, so wood and blossom move as one
vec3 swayOf(vec3 p){
  float w = max(length(p.xz) - 9., 0.) * 0.035 * smoothstep(22., 40., p.y);
  float ph = uTime * 0.698 + p.x * 0.045 + p.z * 0.037;
  return vec3(sin(ph * 0.83 + 1.3) * 0.35, sin(ph), cos(ph * 0.71) * 0.35) * w;
}
float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y); }
// shadowless light: form comes from occlusion. Soft ellipsoids at the crown and each great bough.
float canopy(vec3 p){
  float o = 0.;
  for (int i = 0; i < NSH; i++) { vec4 s = uShade[i]; vec2 d = (p.xz - s.xz) / max(s.w, 1.); o += smoothstep(-2., 14., s.y - p.y) * exp(-dot(d, d) * 1.5); }
  return mix(1., 0.35, clamp(o * 0.85, 0., 1.));
}
// the far image stands in a band of mist: its lowest few metres (set metres, so a mountain's foot) dissolve
float washAt(float y){ return max(uWash, uMist * exp(-max(y, 0.) * 0.3)); }
vec3 hemi(vec3 n){ return mix(uBounce, uSky, clamp(n.y * 0.5 + 0.5, 0., 1.)); }
// the proofs (cranes, the gold sail) take only a share k of the far image's wash, so they stay findable
vec3 lessWash(vec3 c, float k){ return (mix(c, uWashCol, uWash * k) - uWashCol * uWash) / max(1. - uWash, 0.25); }
`,ne=`#include <fog_pars_vertex>
`,se=`#include <fog_pars_fragment>
`,fe=`
  col = mix(col, uWashCol, uWash);
  gl_FragColor = vec4(col, 1.);
  vec3 pre = gl_FragColor.rgb;
  #include <fog_fragment>
  gl_FragColor.rgb = mix(pre, gl_FragColor.rgb, uFogAmt);
`,de=fe.replace("uWash)","washAt(vP.y))"),Re=X+ne+`
attribute vec4 aBark; varying vec3 vP, vN; varying vec4 vBark;
void main(){
  vP = position; vN = normal; vBark = aBark;
  vec4 mvPosition = modelViewMatrix * vec4(position + swayOf(position), 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ve=X+se+`
uniform vec3 uPetalA;
varying vec3 vP, vN; varying vec4 vBark;
void main(){
  vec3 n = normalize(vN + vec3(0., 1e-4, 0.));
  // deep vertical plates 0.4 m wide, staggered, with lichen in the furrows
  float pl = vBark.x * vBark.z, id = floor(pl), u = fract(pl);
  float isRoot = step(1.5, vBark.w);
  float v = vBark.y / 2.8 + hash21(vec2(id, 7.)) * 5., fv = fract(v), tone = mix(hash21(vec2(id, floor(v))), vnoise(vec2(id * 3.1, v * 0.35)), isRoot);
  float plate = smoothstep(0.5, 0.3, abs(u - 0.5)) * mix(smoothstep(0., 0.07, fv) * smoothstep(1., 0.93, fv), 1., isRoot);   // no ring seams on roots
  float crack = smoothstep(0.42, 0.5, abs(u - 0.5)) * mix(1., 0.4, isRoot);
  float detail = clamp(1.5 - fwidth(pl) * 2.2, 0., 1.) * clamp(1. - uWash * 1.6, 0., 1.);
  plate = mix(0.62, plate, detail); crack *= detail;
  float grain = vnoise(vec2(pl * 3., vBark.y * 0.9));
  vec3 bark = mix(uChar * 2.1, vec3(0.2, 0.185, 0.165), tone * 0.5 + grain * 0.4) * (0.7 + 0.6 * grain);
  float lich = smoothstep(0.38, 0.62, vnoise(vec2(pl * 0.45, vBark.y * 0.22) + 3.)) * (1. - plate * 0.8);
  vec3 col = mix(uChar * 0.6, bark, plate * (0.75 + 0.25 * smoothstep(0.5, 0.2, abs(u - 0.5))));
  col = mix(col, uMint * mix(0.4, 0.75, grain), lich * 0.8);
  col *= 1. - 0.7 * crack;
  // moss collars on every bough top and root back; a moss skirt round the foot of the trunk
  float mossy = vBark.w > 0.5 ? smoothstep(mix(0.35, 0.05, isRoot), 0.95, n.y + (grain - 0.5) * 0.8 + (vnoise(vP.xz * 0.6) - 0.5) * mix(0.7, 1.3, isRoot)) : smoothstep(15., 5., vP.y) * smoothstep(0.4, 0.75, vnoise(vP.xz * 0.35 + vP.y * 0.2));
  vec3 moss = mix(uMint * 0.42, vec3(0.19, 0.3, 0.12), mix(0.45, 0.7, isRoot) + mix(0.4, 0.3, isRoot) * vnoise(vP.xz * 1.7)) * (0.7 + 0.6 * grain);
  col = mix(col, moss, mossy * 0.92);
  // root backs and bough tops seen at a glance: moss in clumps, lichen, and the petals that have settled there
  // roots are sinew: long ridges that wander round them, lit on their backs, dark between
  float sinew = sin(vBark.x * 6.283 * 3. + 5. * vnoise(vec2(vBark.y * 0.16, vBark.x * 3.)) + vBark.y * 0.21) * (0.4 + 0.6 * vnoise(vec2(vBark.y * 0.3, 5.)));
  col *= mix(1., 0.93 + 0.12 * smoothstep(-0.5, 0.6, sinew), isRoot * clamp(1. - uWash * 1.5, 0., 1.));
  col = mix(col, mix(uMint * 0.5, vec3(0.2, 0.27, 0.16), 0.6) * (0.6 + 0.5 * grain), isRoot * smoothstep(0.3, 0.9, sinew + (grain - 0.5)) * 0.16 * clamp(1. - uWash * 1.5, 0., 1.));   // lichen along the ridges
  float topness = smoothstep(0.4, 0.85, n.y) * step(0.5, vBark.w) * clamp(1. - uWash * 1.5, 0., 1.);
  float clump = vnoise(vP.xz * 2.3) * 0.6 + vnoise(vP.xz * 6.7) * 0.4;
  col = mix(col, mix(vec3(0.13, 0.24, 0.11), uMint * mix(0.78, 0.6, isRoot), smoothstep(0.35, 0.75, clump)), topness * 0.75 * smoothstep(0.32, 0.6, clump + 0.12 * sinew * isRoot));
  vec2 pc = vP.xz * 4.2, pid = floor(pc), pf = fract(pc) - 0.5;
  float ph = hash21(pid), pet = step(0.86, ph) * smoothstep(0.34, 0.24, length(pf * vec2(1., 1.6) + (vec2(hash21(pid + 5.), hash21(pid + 8.)) - 0.5) * 0.3));
  col = mix(col, uPetalA * 0.85, pet * topness);
  float hollow = mix(mix(0.5, 0.85, isRoot), 1., smoothstep(1., 13., vP.y + length(vP.xz) * 0.3));
  col *= hemi(n) * mix(1., canopy(vP), mix(0.8, 0.55, isRoot)) * hollow * mix(1., 0.66 + 0.5 * smoothstep(-0.8, 0.9, n.y), isRoot);
  col *= smoothstep(-1.5, 0.3, vP.y) * 0.6 + 0.4;       // wet and dark at the waterline
${de}}`,We=X+ne+`
varying vec3 vP, vN;
void main(){
  vP = position; vN = normal;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Te=X+se+`
varying vec3 vP, vN;
// one fallen petal per cell, turned and nudged; returns cover
float petalAt(vec2 p, float density){
  vec2 id = floor(p), f = fract(p) - 0.5;
  float h = hash21(id), a = h * 6.283;
  vec2 c = (vec2(hash21(id + 7.3), hash21(id + 3.1)) - 0.5) * 0.5, d = f - c;
  d = vec2(d.x * cos(a) + d.y * sin(a), -d.x * sin(a) + d.y * cos(a));
  float e = d.x * d.x / 0.085 + d.y * d.y / 0.03;
  return step(e, 1.) * step(hash21(id + 11.7), density);
}
void main(){
  if (vP.y < -1.1) discard;
  vec3 n = normalize(vN + vec3(0., 1e-4, 0.));
  float detail = clamp(1. - uWash * 1.3, 0., 1.);
  float px = fwidth(vP.x) + fwidth(vP.z);
  float fine = detail * clamp(1.4 - px * 5., 0., 1.), mid = detail * clamp(1.4 - px * 0.9, 0., 1.);
  float n1 = vnoise(vP.xz * 0.11), n2 = vnoise(vP.xz * 0.9 + 11.), n3 = vnoise(vP.xz * 4.3), n4 = vnoise(vP.xz * 17.);
  // wet dark rock with tilted strata, paler where it has dried on the ridges
  float strata = smoothstep(0.35, 0.65, fract(vP.y * 0.9 + vP.x * 0.07 + n2 * 0.6));
  vec3 rock = mix(uChar * 1.1, uSlate * 0.55, n1 * 0.6 + strata * 0.3 * detail) * mix(1., 0.6 + 0.8 * n3, mid);
  // cushion moss: rounded mounds half a metre across, dark in the seams between them
  vec2 cp = vP.xz * 1.6 + (vec2(n2, n3) - 0.5) * 1.1, ci = floor(cp), cf = fract(cp); float cd = 1., cd2 = 1.;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j)), o = vec2(hash21(ci + g), hash21(ci + g + 5.7));
    float dd = length(g + o - cf); if (dd < cd) { cd2 = cd; cd = dd; } else cd2 = min(cd2, dd);
  }
  float cush = mix(0.6, smoothstep(0.7 + 0.2 * n3, 0.05, cd) * (0.5 + 0.5 * smoothstep(0.0, 0.16, cd2 - cd)), mid);   // domes with crisp dark seams
  float m = smoothstep(0.5, 0.75, n.y * 0.75 + n1 * 0.5 + n2 * 0.25 * detail) * smoothstep(0.1, 0.75, vP.y + (n3 - 0.5) * 0.3);
  vec3 moss = mix(vec3(0.1, 0.19, 0.1), mix(uMint * 0.6, vec3(0.27, 0.4, 0.22), 0.1 + 0.5 * n2 * n1 * 2.), cush * (0.75 + 0.25 * n2));
  moss *= mix(1., (0.74 + 0.52 * n4) * (0.84 + 0.32 * hash21(floor(vP.xz * 41.))), fine);     // star-moss stipple, crisp up close
  // hummocks: the carpet rises and falls, darker in its hollows, with bare strata showing between
  float hum = vnoise(vP.xz * 0.42 + 17.), relief = (vnoise(vP.xz * 0.42 + vec2(17.35, 17.)) - vnoise(vP.xz * 0.42 + vec2(16.65, 17.))) * 1.6;
  moss *= mix(1., (0.7 + 0.5 * hum) * clamp(1. + relief, 0.45, 1.6), detail);
  m *= mix(1., smoothstep(0.22, 0.42, hum + 0.25 * n2), detail * 0.85);
  vec3 col = mix(rock, moss, m);
  // drifts of fallen petals in the hollows, and a scatter everywhere under the crown
  float drift = smoothstep(0.45, 0.8, vnoise(vP.xz * 0.16 + 31.)) * smoothstep(110., 60., length(vP.xz));
  float dens = 0.07 + 0.8 * drift;
  float pet = max(petalAt(vP.xz * 4.2, dens), petalAt(vP.xz * 4.9 + 13.37, dens * 0.8));
  vec3 pcol = mix(uPink * 0.9, uWhite * 0.82, n4 * 0.6) * (0.78 + 0.2 * n3);
  col = mix(col, pcol, mix(drift * 0.45 * detail, pet, fine) * step(0.25, vP.y));
  col *= hemi(n) * canopy(vP);
  col *= mix(0.66, 1., smoothstep(-0.2, 0.9, vP.y + (n2 - 0.5) * 0.7));     // the wet band, ragged, and slate under the water
  col = mix(mix(uChar, uSlate, 0.6) * 0.72, col, smoothstep(-2.2, 0.1, vP.y + (n3 - 0.5) * 0.5));
${de}}`;function ye(e,t,b,r,A={}){return new x.ShaderMaterial({vertexShader:e,fragmentShader:t,fog:!0,uniforms:Object.assign({},x.UniformsUtils.clone(x.UniformsLib.fog),b,r,A.uniforms||{}),side:A.side??x.FrontSide,transparent:!!A.transparent,depthWrite:A.depthWrite??!0,alphaToCoverage:!!A.a2c})}async function ot(e,t={}){const b=e.rng,r=(t.palette&&t.palette.length>=7?t.palette:Se).map(N=>new x.Color(N)),A=ce(t.detail??e.quality?.detail??1,.6,1),M=t.lap??1600,p=t.bigS??24,w=t.wash??.7,S=ke(Math.floor(b()*1e9)),y=Fe(S),o=new x.Group;o.name="sky-tree";const i=await Ne(e,b,y),g=await Ie(e,b,i.G,y,i.rootAng),[d,l]=Ae(i.G);await e.yield();const s=_e(y);await e.yield();const C=[new x.Vector4(0,62,0,46)];for(let N=0;N<i.boughShade.length&&C.length<xe;N+=2)C.push(i.boughShade[N+1]);for(;C.length<xe;)C.push(new x.Vector4(0,-500,0,1));const m={uTime:{value:0},uProgress:{value:.12},uSky:{value:r[0].clone().multiplyScalar(1)},uBounce:{value:r[3].clone().multiplyScalar(.85)},uWashCol:{value:new x.Color("#E9EEF1")},uShade:{value:C},uPearl:{value:r[0]},uPink:{value:r[1]},uWhite:{value:r[2]},uSlate:{value:r[3]},uChar:{value:r[4]},uGold:{value:r[5]},uMint:{value:r[6]},uPetalA:{value:new x.Color(t.petalA??r[1])},uPetalB:{value:new x.Color(t.petalB??r[2])},uLeaf:{value:new x.Vector4(.3,.5,.2,0)},uCamL:{value:new x.Vector3},uRes:{value:new x.Vector2(1280,720)}};if(t.leaf){const N=new x.Color(t.leaf);m.uLeaf.value.set(N.r,N.g,N.b,t.leafAmount??.3)}const z=[{name:"bark",geo:d,reflGeo:l,vs:Re,fs:Ve,refl:!0},{name:"rock",geo:s,vs:We,fs:Te,refl:!1}],h=await Le(b,e);await e.yield();const a=await Be(e,b,i.lobes,A);z.push({name:"blossom",geo:a.full,reflGeo:a.third,vs:je,fs:De,refl:!0,extra:{a2c:!0,side:x.DoubleSide,uniforms:{uAtlas:{value:h}}}}),await e.yield(),z.push({name:"petals",geo:Ee(b,A),vs:Ge,fs:Oe,refl:!1,extra:{side:x.DoubleSide}});const n=He(),v=Qe(n,b,y,r);await e.yield();const f=qe(n,b,y,r),F=new x.BufferGeometry;F.setAttribute("position",new x.Float32BufferAttribute(n.pos,3)),F.setAttribute("normal",new x.Float32BufferAttribute(n.nor,3)),F.setAttribute("color",new x.Float32BufferAttribute(n.col,3)),F.setAttribute("aB",new x.Float32BufferAttribute(n.ab,4)),F.setIndex(n.idx),z.push({name:"built",geo:F,vs:$e,fs:Xe,refl:!0,extra:{side:x.DoubleSide,uniforms:{uSkiff:{value:f.skiff}}}}),await e.yield();const T=r.slice();t.birds==="egret"&&(T[3]=new x.Color("#F1F3EE"),T[4]=new x.Color("#C9CED0"));const _=Ze(T),R=et(b,_,y);z.push({name:"cranes",geo:_,vs:Ye,fs:Je,refl:!0,extra:{side:x.DoubleSide}}),R.update(.12,0),await e.yield();const I={};for(const N of[{name:"A",mx:1,my:1},{name:"FAR",mx:-1,my:1},{name:"FARr",mx:-1,my:-1},{name:"Ar",mx:1,my:-1}]){const D=new x.Group;D.name="set-"+N.name;const H={uWash:{value:0},uMist:{value:0},uFogAmt:{value:1},uRefl:{value:N.my<0?1:0},uFar:{value:N.name[0]==="F"?1:0},uScale:{value:1},uStretch:{value:1},uCamSet:{value:new x.Vector3}};for(const G of z){if(N.my<0&&!G.refl)continue;const O=new x.Mesh(N.my<0&&G.reflGeo?G.reflGeo:G.geo,ye(G.vs,G.fs,m,H,G.extra));O.name=G.name,O.frustumCulled=!1,O.renderOrder=G.order??0,D.add(O)}D.userData={def:N,grp:H},I[N.name]=D,o.add(D),await e.yield()}if(t.water!==!1){const N=new x.Mesh(new x.CircleGeometry(8e3,48),ye(Ue,Ke,m,{},{transparent:!0,depthWrite:!1}));N.rotation.x=-Math.PI/2,N.name="viewer-water",N.frustumCulled=!1,N.renderOrder=2,o.add(N)}let L=.12;const k=new x.Vector3,u=new x.Vector3,P=new x.Vector2,W=74,j={S:p,a:W,wash:.7,farZ:0};function B(N){N.getWorldPosition(k),u.copy(k),o.worldToLocal(u);const D=L,H=E(.07,.68,D),G=1+1.15*E(.3,.46,D)*(1-E(.76,.9,D)),O=K(p,1,H),oe=K(W,535,Math.pow(E(.1,.68,D),1.5)),ae=K(u.z+O*oe,M,E(.92,1,H)),pe=1-E(.1,.6,D);j.S=O,j.a=oe,j.farZ=ae,j.wash=w*pe*Math.sqrt(pe)+.1*E(.1,.5,D)*(1-E(.62,.9,D));for(const ve of["FAR","FARr"]){const ue=I[ve],Y=ue.userData;ue.position.set(0,0,ae),ue.scale.set(-O,Y.def.my*O*(Y.def.my<0?G:1),O),Y.grp.uWash.value=j.wash*(Y.def.my<0?.6:1),Y.grp.uMist.value=.92*(1-E(.3,.56,D)),Y.grp.uFogAmt.value=0,Y.grp.uScale.value=O,Y.grp.uStretch.value=Y.def.my<0?G:1}I.A.userData.grp.uCamSet.value.copy(u),I.FAR.userData.grp.uCamSet.value.set(-u.x/O,u.y/O,(u.z-ae)/O);const ie=D<.3;I.A.visible=ie,I.Ar.visible=ie,m.uProgress.value=D,m.uCamL.value.copy(u)}const V=N=>new x.Vector3(-N.x,N.y,M+N.z),q=g[0],J={toB:V,entry:{position:$(26,10,-70),direction:c(0,0,1)},portalSeat:{position:V(q.c),facing:c(0,0,1),radius:7,local:q.c.clone(),archSpan:q.span,archHeight:q.height},flyOut:[$(26,10,-70),$(26,10,-10),$(26,10,40),$(26,11,100),$(24,14,150),$(20,18.5,215),$(12,23,300)],flyIn:[V($(22,12,-330)),V($(26,11,-200)),V($(26,10,-120)),V($(26,9.5,-60)),V(q.c)],pavilion:v.c.clone(),pavilionTop:v.top,sail:f.sail.clone(),skiff:f.skiff.clone(),jetty:f.jetty.clone(),cranesStand:c(-35,1,128),cranesLand:c(-36,1,-68),rootArches:g.map(N=>({center:N.c.clone(),span:N.span,height:N.height})),trunkTop:i.axis(64),crownCenter:c(0,62,0),crownRadius:62,hemY:30,islandNorthTip:c(0,0,200),islandSouthTip:c(0,0,-60),viewpoints:[$(26,10,-30),$(60,40,-190),$(-120,30,60)]};return{object:o,radius:75,height:120,center:new x.Vector3(0,50,0),anchors:J,groups:I,uniforms:m,state:j,heightAt:y,glsl:{COMMON:X,FOG_V:ne,FOG_F:se,FINISH:fe,FINISH_Y:de},makeSetMaterial(N,D,H,G){return ye(D,H,m,I[N].userData.grp,G)},setProgress(N){L=ce(N,0,1)},imageAt(N,D){const H=E(.07,.68,N),G=K(p,1,H),O=K(W,535,Math.pow(E(.1,.68,N),1.5));return{S:G,a:O,z:K(D+G*O,M,E(.92,1,H))}},setCraneCourse(N,D){R.setCourse(N,D)},craneCourse:()=>({keys:R.keys(),at:R.at}),update(N,D,H){m.uTime.value=D,e.renderer&&(e.renderer.getDrawingBufferSize(P),m.uRes.value.copy(P)),B(H),R.update(L,D)},dispose(){},ground:!1,groundY:0}}async function Le(e,t){const A=document.createElement("canvas");A.width=A.height=1024;const M=A.getContext("2d");for(let w=0;w<4;w++){const S=w%2*512,y=Math.floor(w/2)*512;M.save(),M.beginPath(),M.rect(S,y,512,512),M.clip();const o=46;for(let i=0;i<o;i++){const g=i<o*.4,d=e()*U,l=Math.sqrt(e())*(512*.5-44),s=S+512/2+Math.cos(d)*l,C=y+512/2+Math.sin(d)*l*.92,m=g?e.range(20,27):e.range(27,36),z=e()*U,h=g?e.range(.5,.72):e.range(.85,1),a=Math.round(h*255);for(let n=0;n<5;n++){const v=z+n/5*U+e.range(-.08,.08),f=s+Math.cos(v)*m*.56,F=C+Math.sin(v)*m*.56,T=M.createRadialGradient(s,C,m*.1,s,C,m*1.05);T.addColorStop(0,`rgb(255,0,${a})`),T.addColorStop(.45,`rgb(120,0,${a})`),T.addColorStop(1,`rgb(0,0,${a})`),M.fillStyle=T,M.beginPath(),M.ellipse(f,F,m*.52,m*.36,v,0,U),M.fill()}M.fillStyle=`rgb(200,255,${a})`;for(let n=0;n<7;n++){const v=z+n*.9,f=m*(.12+.1*(n%2));M.beginPath(),M.arc(s+Math.cos(v)*f,C+Math.sin(v)*f,Math.max(1.6,m*.055),0,U),M.fill()}}M.restore(),await t.yield()}const p=new x.CanvasTexture(A);return p.colorSpace=x.NoColorSpace,p.generateMipmaps=!0,p.minFilter=x.LinearMipmapLinearFilter,p.anisotropy=4,p}async function Be(e,t,b,r){const A=Math.round(9600*r),M=[],p=[];let w=0;for(const a of b)w+=a.r*a.r;const S=c(0,58,0),y=c(),o=c();for(let a=0;a<b.length;a++){const n=b[a],v=Math.max(6,Math.round(A*n.r*n.r/w));for(let f=0;f<v;f++){const F=t.range(-1,1),T=t()*U,_=Math.sqrt(1-F*F),R=n.r*t.range(.62,1.04);y.set(_*Math.cos(T),F*.72,_*Math.sin(T));const I=n.c.x+y.x*R,L=n.c.y+y.y*R+1.5,k=n.c.z+y.z*R;o.set(I-S.x,(L-S.y)*1.3,k-S.z).normalize();const u=.5+.5*(o.x*y.x+o.y*y.y/.72*.8+o.z*y.z),P=ce(.08+.95*(.5*E(.15,.85,u)+.5*E(-.75,.65,y.y/.72))*(.8+.2*t()),0,1);M.push(I,L,k,t.range(4.2,6)),p.push(Math.floor(t()*4),P,t()*U,t())}a%40===39&&await e.yield()}const i=M.length/4,g=t.shuffle(Array.from({length:i},(a,n)=>n)),d=new Float32Array(i*4),l=new Float32Array(i*4);for(let a=0;a<i;a++)for(let n=0;n<4;n++)d[a*4+n]=M[g[a]*4+n],l[a*4+n]=p[g[a]*4+n];const s=a=>{const n=new x.InstancedBufferGeometry;return n.setAttribute("position",new x.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),n.setIndex([0,1,2,0,2,3]),n.instanceCount=a,n},C=s(i),m=s(Math.floor(i/3)),z=new x.InstancedBufferAttribute(d,4),h=new x.InstancedBufferAttribute(l,4);for(const a of[C,m])a.setAttribute("aC",z),a.setAttribute("aD",h);return{full:C,third:m,count:i}}const je=X+ne+`
attribute vec4 aC, aD; uniform float uScale, uRefl;
varying vec2 vUv, vQ; varying vec3 vL;   // vL: baked shade, seen-from-below, seed
void main(){
  vec3 c = aC.xyz; c += swayOf(c);
  float tr = uTime * 1.7 + aD.w * 40.;
  c += vec3(sin(tr), sin(tr * 1.31 + 1.), cos(tr * 0.87)) * 0.07;            // clusters tremble
  vec4 mvPosition = modelViewMatrix * vec4(c, 1.);
  float ro = aD.z + sin(tr * 0.6) * 0.06, cs = cos(ro), sn = sin(ro);
  float grow = aC.w * uScale * (1. + 0.7 * uWash) * (1. + 0.6 * uRefl);
  mvPosition.xy += mat2(cs, -sn, sn, cs) * position.xy * grow;
  gl_Position = projectionMatrix * mvPosition;
  vQ = position.xy;
  vUv = (position.xy + 0.5) * 0.5 + vec2(mod(aD.x, 2.), floor(aD.x * 0.5)) * 0.5;
  vec3 toC = (modelMatrix * vec4(c, 1.)).xyz - cameraPosition;
  float below = clamp(toC.y * (1. - 2. * uRefl) / max(length(toC), 1e-3), 0., 1.);
  vL = vec3(aD.y, below, aD.w);
  #include <fog_vertex>
}`,De=X+se+`
uniform sampler2D uAtlas; uniform vec3 uPetalA, uPetalB; uniform vec4 uLeaf;
varying vec2 vUv, vQ; varying vec3 vL;
void main(){
  vec4 t = texture2D(uAtlas, vUv);
  // far off, and in the washed sky image, sprays close up into cloud: a ragged disc of their mean tone
  float texels = fwidth(vUv.x) * 1024.;
  float soft = clamp(max((texels - 1.6) / 3.5, uWash * 1.5), 0., 1.);
  float r = length(vQ) * 2. + (vnoise(vQ * 5. + vL.z * 30.) - 0.5) * 0.55;
  float disc = smoothstep(1.0, 0.6, r);
  float a = mix(t.a, disc, soft);
  if (a < 0.42) discard;
  float mott = 0.6 * vnoise(vQ * 9. + vL.z * 20.) + 0.4 * vnoise(vQ * 23. + vL.z * 7.);
  float tone = mix(t.r, 0.25 + 0.6 * mott, soft), depth = mix(mix(0.55, 1., t.b), 0.74 + 0.26 * mott, soft);
  vec3 petal = mix(uPetalA * 0.86, uPetalB * 0.8, tone * tone * 0.85 + 0.1);
  petal = mix(petal, uGold * 0.62, t.g * (1. - soft) * 0.75);
  petal = mix(petal, uLeaf.rgb * (0.6 + 0.5 * mott), step(0.001, uLeaf.a) * mix(step(t.b, 0.62), smoothstep(0.45, 0.6, mott), soft) * min(uLeaf.a * 2.6, 1.));   // season: new leaf among the blossom
  // baked gradient: luminous at the crown's skin, dusky inside, the shade tinted rose and never grey
  float light = mix(0.4, 1., vL.x) * depth * mix(0.82, 1.06, vQ.y + 0.5);
  vec3 tint = mix(uPetalA * 0.86, vec3(1.), vL.x);        // the shade takes the season's own colour, never grey
  // petals transmit: from below the crown glows pink against the sky
  light = mix(light, 0.92 * depth, vL.y * 0.8);
  vec3 col = petal * tint * light * uSky;
  col = mix(col, uPetalA * 0.8 * depth * uSky, vL.y * 0.45);
  col = lessWash(col, 0.62);                                          // the giant's crown holds its colour
${fe}  gl_FragColor.a = a;
}`;function Ee(e,t){const b=Math.round(3800*t),r=new Float32Array(b*4);for(let M=0;M<b*4;M++)r[M]=e();const A=new x.InstancedBufferGeometry;return A.setAttribute("position",new x.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),A.setIndex([0,1,2,0,2,3]),A.instanceCount=b,A.setAttribute("aP",new x.InstancedBufferAttribute(r,4)),A}const Ge=X+ne+`
attribute vec4 aP; uniform float uScale, uFar; uniform vec3 uCamSet; uniform vec2 uRes;
varying vec2 vQ; varying vec3 vL;
void main(){
  float near = step(0.5, fract(aP.w * 7.31));                        // which population
  // the lens box shrinks with the far image's size so that giant petals still pass close by
  float b = 1. / (1. + 7. * (uScale - 1.) / 23.);
  vec3 box = mix(vec3(250., 130., 250.), vec3(56., 60., 56.) * b, near);
  vec3 o = vec3(aP.x, aP.y, aP.z) * box;
  o.y -= uTime * 1.1;                                                 // 1.1 m/s, in the set's own metres
  float fl = uTime * (0.5 + aP.w * 0.4) + aP.w * 50.;
  o.xz += vec2(sin(fl), cos(fl * 0.83)) * 0.6 + vec2(sin(fl * 0.31), cos(fl * 0.27)) * 1.5;
  vec3 mid = mix(vec3(0., 65., 0.), uCamSet, near);
  vec3 c = mid + mod(o - mid + box * 0.5, box) - box * 0.5;          // wraps top to bottom, never lands
  float keep = step(length(c.xz), 124.) * step(0.2, c.y) * step(c.y, 128.);
  // tumbling: a slow roll round a drifting axis
  float a1 = aP.w * 40. + uTime * (0.7 + aP.x), a2 = aP.z * 30. + uTime * (0.45 + aP.y * 0.5);
  vec3 nn = vec3(cos(a1) * sin(a2), cos(a2) * 0.6 + 0.5, sin(a1) * sin(a2));
  nn = normalize(nn + vec3(0., 1e-3, 0.));
  vec3 t1 = normalize(cross(nn, vec3(0.3, 0.1, 0.9)) + vec3(1e-4)), t2 = cross(nn, t1);
  vec4 mvc = modelViewMatrix * vec4(c, 1.);
  float size = 0.15;
  float px = size * uScale * projectionMatrix[1][1] * uRes.y * 0.5 / max(-mvc.z, 0.1);
  size *= max(1., 1.7 / max(px, 1e-3));                               // never thinner than about 1.7 pixels
  // the giant's petals reach us only once we are out from under the real crown (u 0.06 to 0.1)
  float come = mix(1., smoothstep(0.065, 0.11, uProgress + 0.03 * (aP.x - 0.5)), uFar * near * step(1.5, uScale));
  vec3 p = c + (t1 * position.x * 0.8 + t2 * position.y) * size * come;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  // the far image's petals keep 6 m clear of the lens
  if (keep < 0.5 || come < 0.02 || (uFar > 0.5 && -mvc.z < 6. + 2. * uScale * 0.15)) gl_Position = vec4(2., 2., 2., 1.);
  vQ = position.xy;
  vL = vec3(nn.y, canopy(c), aP.w);
  #include <fog_vertex>
}`,Oe=X+se+`
uniform vec3 uPetalA, uPetalB;
varying vec2 vQ; varying vec3 vL;
void main(){
  // one petal: a broad oval, pinched at the base, notched at the tip
  vec2 q = vQ * 2.; float w = 0.95 * sqrt(max(1. - q.y * q.y, 0.)) * (0.62 + 0.38 * q.y);
  float notch = smoothstep(0.0, 0.22, abs(q.x)) + step(q.y, 0.62);
  if (abs(q.x) > w || notch < 0.5) discard;
  float under = gl_FrontFacing ? 0. : 1.;
  vec3 col = mix(uPetalA * 0.92, uPetalB * 0.84, 0.4 * under + 0.4 * (q.y * 0.5 + 0.5)) * (0.9 + 0.1 * smoothstep(0.0, 0.25, abs(q.x)));
  col *= uSky * mix(0.72, 1., abs(vL.x)) * mix(1., vL.y, 0.6);
  col = lessWash(col, 0.55);                                          // the giant's petals keep some of their rose
${fe}}`,Ue=X+ne+`
varying vec3 vW;
void main(){ vW = (modelMatrix * vec4(position, 1.)).xyz; vec4 mvPosition = viewMatrix * vec4(vW, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ke=X+se+`
varying vec3 vW;
void main(){
  vec3 v = cameraPosition - vW; float d = length(v); v /= max(d, 1e-3);
  float rip = vnoise(vW.xz * 0.35 + uTime * vec2(0.11, 0.07)) - 0.5;
  float f = 1. - clamp(abs(v.y) + rip * 0.06, 0., 1.); f = f * f * f;
  vec3 col = mix(uChar * 0.9, uPearl * 0.8, f);
  gl_FragColor = vec4(col, mix(0.62, 0.5, f));
  #include <fog_fragment>
}`;function He(){return{pos:[],nor:[],col:[],ab:[],idx:[],n:0}}function ee(e,t,b,r,A,M,p,w){const S=c().subVectors(b,t).cross(c().subVectors(A,t)).normalize(),y=e.n;[t,b,r,A].forEach((o,i)=>{e.pos.push(o.x,o.y,o.z),e.nor.push(S.x,S.y,S.z),e.col.push(M.r,M.g,M.b),e.ab.push(p,0,w?w[i*2]:0,w?w[i*2+1]:0)}),e.idx.push(y,y+1,y+2,y,y+2,y+3),e.n+=4}function Z(e,t,b,r,A,M,p=0,w=0,S=0){const y=Math.cos(w),o=Math.sin(w),i=(z,h,a)=>{const n=h>0?1-S:1;return z*=n,a*=n,c(t.x+z*y+a*o,t.y+h,t.z-z*o+a*y)},g=b/2,d=r/2,l=A/2,s=[i(-g,-d,-l),i(g,-d,-l),i(g,d,-l),i(-g,d,-l),i(-g,-d,l),i(g,-d,l),i(g,d,l),i(-g,d,l)],C=M.clone().multiplyScalar(1.08),m=M.clone().multiplyScalar(.8);ee(e,s[4],s[5],s[6],s[7],M,p),ee(e,s[1],s[0],s[3],s[2],M,p),ee(e,s[5],s[1],s[2],s[6],M,p),ee(e,s[0],s[4],s[7],s[3],M,p),ee(e,s[7],s[6],s[2],s[3],C,p),ee(e,s[0],s[1],s[5],s[4],m,p)}function te(e,t,b,r,A,M,p,w=0){const S=c().subVectors(b,t).normalize(),y=Math.abs(S.y)>.9?c(1,0,0):c(0,1,0),o=c().crossVectors(S,y).normalize(),i=c().crossVectors(S,o),g=e.n;for(let d=0;d<=M;d++){const l=d/M*U,s=Math.cos(l),C=Math.sin(l);for(const[m,z]of[[t,r],[b,A]])e.pos.push(m.x+(o.x*s+i.x*C)*z,m.y+(o.y*s+i.y*C)*z,m.z+(o.z*s+i.z*C)*z),e.nor.push(o.x*s+i.x*C,o.y*s+i.y*C,o.z*s+i.z*C),e.col.push(p.r,p.g,p.b),e.ab.push(w,0,d/M,0)}for(let d=0;d<M;d++){const l=g+d*2;e.idx.push(l,l+2,l+1,l+1,l+2,l+3)}e.n+=(M+1)*2}function Qe(e,t,b,r){const A=c(re.x,0,re.z),M=Math.max(b(A.x,A.z),2.6),p=t.range(-.25,.25),w=new x.Color("#e9e6dc"),S=r[3].clone().lerp(r[0],.45),y=new x.Color("#7d8580"),o=Math.cos(p),i=Math.sin(p),g=(a,n,v)=>c(A.x+a*o+v*i,M+n,A.z-a*i+v*o);Z(e,g(0,-1,0),9.6,3,9.6,S.clone().multiplyScalar(.8),0,p,.04),Z(e,g(0,.62,0),8.2,.36,8.2,S,0,p,.02);const d=.8;for(let a=-1;a<=1;a++)for(let n=-1;n<=1;n++){if(!a&&!n)continue;const v=a*3.1,f=n*3.1;Z(e,g(v,d+.12,f),.6,.24,.6,S,0,p,.15),Z(e,g(v,d+2.35,f),.3,4.3,.3,w,0,p,.12),Z(e,g(v,d+4.4,f),.7,.22,.7,w,0,p,-.25)}for(const a of[-1,1])Z(e,g(0,d+4.7,a*3.1),7.4,.36,.3,w,0,p),Z(e,g(a*3.1,d+4.7,0),.3,.36,7.4,w,0,p),Z(e,g(a*3.1,d+.75,0),.1,.1,6,w,0,p);Z(e,g(0,d+.75,3.1),6,.1,.1,w,0,p);const l=10,s=d+4.85,C=5,m=3.1,z=(a,n)=>{const v=1-Math.max(Math.abs(a),Math.abs(n));return g(a*C,s+m*Math.pow(v,1.55)+.75*Math.pow(Math.abs(a*n),2.2),n*C)};for(let a=0;a<l;a++)for(let n=0;n<l;n++){const v=-1+2*a/l,f=-1+2*(a+1)/l,F=-1+2*n/l,T=-1+2*(n+1)/l,_=(R,I)=>1-Math.max(Math.abs(R),Math.abs(I));ee(e,z(v,T),z(f,T),z(f,F),z(v,F),y,1,[_(v,T),0,_(f,T),0,_(f,F),0,_(v,F),0])}const h=r[5].clone().multiplyScalar(.55);te(e,g(0,s+m-.1,0),g(0,s+m+.35,0),.34,.2,8,h),te(e,g(0,s+m+.35,0),g(0,s+m+1.25,0),.2,.02,8,h),Z(e,g(.3,d+.42,-.2),1.5,.08,.85,new x.Color("#5a3d2c"),3,p);for(const a of[-1,1])Z(e,g(.3+a*.6,d+.19,-.2),.1,.38,.7,new x.Color("#4a3024"),3,p),te(e,g(.3+a*.3,d+.46,-.2+a*.12),g(.3+a*.3,d+.56,-.2+a*.12),.045,.06,7,r[2].clone().multiplyScalar(.8));return{c:c(A.x,M+d,A.z),top:M+s+m+1.25}}function qe(e,t,b,r){const A=new x.Color("#6b5a4a"),M=new x.Color("#33291f"),p=me;let w=-8;for(;w>-50&&b(w,p)>.5;)w-=.5;const S=w-12,y=.95;for(let k=0;k<29;k++){const u=w+1.2-k*.455;Z(e,c(u,y+t.range(-.015,.015),p+t.range(-.05,.05)),.42,.07,1.5+t.range(-.08,.08),A.clone().multiplyScalar(t.range(.75,1.15)),3,t.range(-.02,.02))}for(const k of[-1,1])Z(e,c((w+S)/2+.6,y-.14,p+k*.55),13.2,.16,.12,M,3);for(let k=0;k<6;k++)for(const u of[-1,1]){const P=w-.3-k*2.3,W=k===5&&u===1?2.1:y+.02;te(e,c(P+t.range(-.1,.1),-2.6,p+u*.78),c(P,W,p+u*.66),.1,.085,6,M,3)}const o=S-2.9,i=p+1.85,g=10,d=e.n,l=13,s=new x.Color("#2f3a3d"),C=new x.Color("#8a7358"),m=k=>{const u=-1+2*k/g,P=Math.abs(u),W=(u<0?.92-.42*P*P*P:.92*Math.pow(1-Math.pow(P,2.4),.7))+.02,j=.52+.3*u*u+(u>0?.25*u*u*u:0),B=-.16+.42*P*P*P;return{z:i+u*3.75,b:W,yg:j,yk:B}};for(let k=0;k<g;k++){const u=m(k),P=m(k+1);for(const W of[-1,1]){const j=[c(o+W*u.b,u.yg,u.z),c(o+W*u.b*.82,K(u.yk,u.yg,.3),u.z),c(o,u.yk,u.z)],B=[c(o+W*P.b,P.yg,P.z),c(o+W*P.b*.82,K(P.yk,P.yg,.3),P.z),c(o,P.yk,P.z)];for(let V=0;V<2;V++)W>0?ee(e,j[V+1],j[V],B[V],B[V+1],V?s.clone().multiplyScalar(.8):s,l):ee(e,B[V+1],B[V],j[V],j[V+1],V?s.clone().multiplyScalar(.8):s,l);Z(e,c(o+W*(u.b+P.b)/2,(u.yg+P.yg)/2+.03,(u.z+P.z)/2),.09,.08,.78,C,l,Math.atan2(W*(P.b-u.b),.75))}ee(e,c(o-u.b*.8,u.yk+.14,u.z),c(o-P.b*.8,P.yk+.14,P.z),c(o+P.b*.8,P.yk+.14,P.z),c(o+u.b*.8,u.yk+.14,u.z),C.clone().multiplyScalar(.7),l)}const z=m(0);ee(e,c(o-z.b,z.yg,z.z),c(o+z.b,z.yg,z.z),c(o,z.yk,z.z),c(o,z.yk,z.z),s,l);for(const k of[-.45,.2])Z(e,c(o,.42,i+k*3.75),1.7,.05,.3,C,l);const h=new x.Color("#c9b27a"),a=c(o+.3,.45,i-.45*3.75);te(e,a,a.clone().add(c(0,.03,0)),.36,.3,10,h,14),te(e,a.clone().add(c(0,.03,0)),a.clone().add(c(0,.2,0)),.3,.04,10,h,14),te(e,c(o+.35,.75,i-.6),c(o-.25,1.5,i-6.6),.04,.03,5,A,l);const n=i+.5;te(e,c(o,0,n),c(o,7.9,n),.085,.05,7,A,l);const v=c(o+.1,1.25,n+1.5),f=c(o+.1,1.55,n-3),F=c(o+.1,8.2,n-2.5),T=c(o+.1,5.7,n+1.9);te(e,T.clone().lerp(F,-.08),F.clone().lerp(T,-.06),.05,.04,6,A,l),te(e,v.clone().lerp(f,-.05),f.clone().lerp(v,-.05),.045,.04,6,A,l);const _=r[5],R=8,I=10,L=e.n;for(let k=0;k<=I;k++)for(let u=0;u<=R;u++){const P=u/R,W=k/I,j=v.clone().lerp(f,P).lerp(T.clone().lerp(F,P),W),B=Math.sin(Math.PI*Math.min(P*1.15,1))*Math.sin(Math.PI*(.08+.84*W));e.pos.push(j.x,j.y,j.z),e.nor.push(1,0,0),e.col.push(_.r,_.g,_.b),e.ab.push(12,B,P,W)}for(let k=0;k<I;k++)for(let u=0;u<R;u++){const P=L+k*(R+1)+u,W=P+R+1;e.idx.push(P,P+1,W,P+1,W+1,W)}e.n+=(R+1)*(I+1);for(let k=d;k<e.n;k++){const u=e.pos[k*3]-o,P=e.pos[k*3+2]-i,W=e.nor[k*3],j=e.nor[k*3+2];e.pos[k*3]=o-P,e.pos[k*3+2]=i+u,e.nor[k*3]=-j,e.nor[k*3+2]=W}return te(e,c(S-.3,y+1.1,p+.66),c(o+3,.95,i-.5),.03,.03,4,h.clone().multiplyScalar(.7),3),{jetty:c((w+S)/2,y,p),skiff:c(o,.2,i),sail:c(o+.1,4.6,i+.1),shoreX:w}}const $e=X+ne+`
attribute vec3 color; attribute vec4 aB; uniform vec3 uSkiff;
varying vec3 vP, vN, vC; varying vec4 vB;
void main(){
  vec3 p = position, n = normal; float kind = aB.x, ride = step(9.5, kind); kind -= 10. * ride;
  if (kind > 1.5 && kind < 2.5) {
    // the lugsail: a standing belly, and a luff that runs up the cloth
    float lf = sin(uTime * 2.3 - aB.w * 5. + aB.z * 2.5) * 0.16 + sin(uTime * 0.6) * 0.1;
    p.z -= aB.y * (0.55 + lf);
    n = normalize(vec3((aB.z - 0.5) * 0.9, 0.25 * cos(uTime * 2.3 - aB.w * 5. + aB.z * 2.5), -1.));
  }
  // the skiff rocks and tugs at her line
  vec3 d = p - uSkiff; float ro = 0.04 * sin(uTime * 0.83), pi = 0.012 * sin(uTime * 0.61 + 1.);
  d.zy = mat2(cos(ro), -sin(ro), sin(ro), cos(ro)) * d.zy; d.yx += vec2(-d.x, d.y) * pi;
  d.y += 0.05 * sin(uTime * 1.07); d.x += 0.12 * sin(uTime * 0.37);
  p = mix(p, uSkiff + d, ride);
  vP = p; vN = n; vC = color; vB = vec4(kind, aB.yzw);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Xe=X+se+`
varying vec3 vP, vN, vC; varying vec4 vB;
void main(){
  vec3 n = normalize(vN + vec3(0., 1e-4, 0.)); if (!gl_FrontFacing) n = -n;
  float detail = clamp(1. - uWash * 1.3, 0., 1.), k = vB.x;
  vec3 col = vC; float light = 1.;
  if (k > 0.5 && k < 1.5) {            // shingles in courses, each a little different; pale boards beneath
    float row = vB.z * 16., fr = fract(row), id = floor(row);
    if (!gl_FrontFacing) { col = vec3(0.62, 0.6, 0.55); detail = 0.; }
    float sh = hash21(vec2(floor((vP.x + vP.z) * 2.2 + id * 0.5), id));
    col *= mix(1., (0.72 + 0.5 * sh) * mix(0.62, 1.1, fr), detail);
    col = mix(col, uMint * 0.4, smoothstep(0.55, 0.8, vnoise(vP.xz * 0.9)) * 0.5 * detail);   // moss on the roof
  } else if (k > 1.5 && k < 2.5) {     // sailcloth: seamed panels, light coming through
    float seam = smoothstep(0.04, 0.0, abs(fract(vB.w * 6.) - 0.5) - 0.46) ;
    col *= 0.86 + 0.14 * vnoise(vB.zw * vec2(30., 90.)) - 0.25 * (1. - seam) * detail;
    light = 1.18 + 0.25 * vB.y;
  } else if (k > 2.5) {                // bare timber and straw: grain
    col *= mix(1., 0.75 + 0.5 * vnoise(vec2(vP.x * 9. + vP.z * 9., vP.y * 30. + vP.z * 2.)), detail);
  } else col *= mix(1., 0.93 + 0.14 * vnoise(vP.xy * 6. + vP.z * 5.), detail);
  col *= hemi(n) * mix(1., canopy(vP), 0.75) * light;
  col *= mix(0.45, 1., smoothstep(-0.3, 0.5, vP.y));
  if (k > 1.5 && k < 2.5) col = lessWash(col, 0.5);
${de}}`;function Ze(e){const t={pos:[],nor:[],col:[],k:[],idx:[],n:0},b=e[3],r=e[4].clone().multiplyScalar(.8),A=e[2].clone().multiplyScalar(.85),M=e[3].clone().lerp(e[0],e[3].r>.8?.35:.08),p=(i,g,d,l,s,C,m,z,h)=>(t.pos.push(i,g,d),t.nor.push(l,s,C),t.col.push(m.r,m.g,m.b),t.k.push(z,h,0,0),t.n++),w=(i,g,d)=>{const l=t.n;for(const[s,C,m,z,h,a]of i)for(let n=0;n<=g;n++){const v=n/g*U,f=Math.cos(v),F=Math.sin(v);p(f*m,C+F*z,s,f,F,0,typeof h=="function"?h(v):h,d,a)}for(let s=0;s<i.length-1;s++)for(let C=0;C<g;C++){const m=l+s*(g+1)+C,z=m+g+1;t.idx.push(m,m+1,z,m+1,z+1,z)}},S=i=>Math.sin(i)<-.3?M:b;w([[-.5,.02,.01,.01,r,0],[-.4,.02,.075,.05,r,0],[-.24,0,.125,.1,S,0],[-.02,-.01,.16,.135,S,0],[.2,0,.145,.125,S,0],[.34,.03,.09,.085,b,0],[.4,.05,.055,.055,r,0]],7,0);const y=i=>Math.abs(Math.cos(i))>.55&&Math.sin(i)>-.5?A:r;w([[.38,.05,.05,.05,r,0],[.6,.07,.04,.04,r,.25],[.84,.08,.034,.034,y,.52],[1.02,.085,.036,.036,y,.72],[1.1,.09,.05,.047,y,.82],[1.17,.085,.036,.034,r,.9],[1.2,.08,.02,.018,e[5].clone().multiplyScalar(.45),.93],[1.36,.065,.004,.004,e[5].clone().multiplyScalar(.4),1]],6,1);for(const i of[-1,1]){w([[-.2,-.07,.03,.03,b,0],[-.55,-.05,.016,.016,r,.33],[-1.12,-.03,.013,.013,r,.85],[-1.3,-.035,.022,.008,r,1]].map(d=>d.slice()),4,3);const g=20;for(let d=t.n-g;d<t.n;d++)t.pos[d*3]+=i*.06}for(const i of[-1,1]){const d=t.n;for(let l=0;l<=6;l++){const s=l/6,C=i*(.12+s*.98),m=.26-.13*s*s,z=.44-.12*s-.1*s*s*s;p(C,.06,m,0,1,0,b,2,i*s),p(C,.085,m-z*.42,0,1,0,b.clone().lerp(r,.25),2,i*s),p(C,.05,m-z*(1+.08*Math.sin(s*20)),0,1,0,r,2,i*s)}for(let l=0;l<6;l++)for(let s=0;s<2;s++){const C=d+l*3+s,m=C+3;t.idx.push(C,m,C+1,C+1,m,m+1)}for(let l=0;l<5;l++){const s=-.25+l*.3,C=.9,m=i*(.12+C*.98),z=.13-l*.055,h=.36-l*.03,a=.032,n=Math.cos(s)*i,v=-Math.sin(s),f=-v*a*i,F=n*a*i,T=p(m-f,.06,z-F,0,1,0,r,2,i*C),_=p(m+f,.06,z+F,0,1,0,r,2,i*C),R=p(m+n*h+f*.5,.06,z+v*h+F*.5,0,1,0,r,2,i*1.22),I=p(m+n*h-f*.5,.06,z+v*h-F*.5,0,1,0,r,2,i*1.22);t.idx.push(T,_,R,T,R,I)}}const o=new x.InstancedBufferGeometry;return o.setAttribute("position",new x.Float32BufferAttribute(t.pos,3)),o.setAttribute("normal",new x.Float32BufferAttribute(t.nor,3)),o.setAttribute("color",new x.Float32BufferAttribute(t.col,3)),o.setAttribute("aK",new x.Float32BufferAttribute(t.k,4)),o.setIndex(t.idx),o}const le=12,Ye=X+ne+`
uniform float uStretch;
attribute vec3 color; attribute vec4 aK, aI0, aI1, aI2;   // aI0 = place, yaw; aI1 = pitch, bank, phase, flap; aI2 = stand, cup, size
varying vec3 vP, vN, vC;
void main(){
  vec3 p = position, n = normal; float part = aK.x, flap = aI1.w, stand = aI2.x, cup = aI2.y;
  float ph = uTime * 7.5 + aI1.z;
  if (part > 1.5 && part < 2.5) {
    float w = abs(aK.y), sd = aK.y < 0. ? -1. : 1., r = abs(p.x) - 0.12;
    // the stroke: the hand lags the arm; cupped and held high when landing; folded when standing
    float ang = flap * ((0.58 * sin(ph) + 0.1) * min(w, 1.) + 0.2 * sin(ph - 1.2) * w * w) + cup * (0.38 + 0.22 * w);
    p.x = sd * (0.12 + r * cos(ang)); p.y += r * sin(ang); n = vec3(-sd * sin(ang), cos(ang), 0.);
    vec3 folded = vec3(sd * (0.13 + r * 0.05), position.y + 0.04 - r * 0.07, position.z - r * 0.52);
    p = mix(p, folded, stand);
  } else if (part > 0.5 && part < 1.5) {
    float a = stand * 1.3 * pow(max(aK.y, 1e-4), 0.6) - cup * 0.25 * aK.y; vec2 d = p.zy - vec2(0.38, 0.05);
    p.zy = vec2(0.38, 0.05) + mat2(cos(a), sin(a), -sin(a), cos(a)) * d;
    p.z -= stand * 0.22 * sin(aK.y * 3.14) ;                                   // the S of a standing neck
  } else if (part > 2.5) {
    float a = (stand * 1.5 + cup * 0.9) * smoothstep(0., 0.3, aK.y); vec2 d = p.zy - vec2(-0.2, -0.07);
    p.zy = vec2(-0.2, -0.07) + mat2(cos(a), sin(a), -sin(a), cos(a)) * d;
  }
  p.y -= flap * 0.035 * sin(ph);                                              // the body answers the stroke
  float pi = aI1.x + stand * 0.25, bk = aI1.y, yw = aI0.w;
  p.zy = mat2(cos(pi), sin(pi), -sin(pi), cos(pi)) * p.zy; n.zy = mat2(cos(pi), sin(pi), -sin(pi), cos(pi)) * n.zy;
  p.xy = mat2(cos(bk), sin(bk), -sin(bk), cos(bk)) * p.xy; n.xy = mat2(cos(bk), sin(bk), -sin(bk), cos(bk)) * n.xy;
  p.xz = vec2(p.x * cos(yw) + p.z * sin(yw), -p.x * sin(yw) + p.z * cos(yw)); n.xz = vec2(n.x * cos(yw) + n.z * sin(yw), -n.x * sin(yw) + n.z * cos(yw));
  p = p * aI2.z * vec3(1., 1. / uStretch, 1.) + aI0.xyz;                        // aI2.z: size (a little larger on the wing); a drawn-out reflection keeps the bird's own shape
  vP = p; vN = n; vC = color;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Je=X+se+`
varying vec3 vP, vN, vC;
void main(){
  vec3 n = normalize(vN + vec3(0., 1e-4, 0.)); if (!gl_FrontFacing) n = -n;
  vec3 col = mix(vC, vec3(dot(vC, vec3(0.3, 0.5, 0.2))), 0.3) * mix(uBounce, uSky * 0.8, clamp(n.y * 0.5 + 0.5, 0., 1.)) * mix(1., canopy(vP), 0.6);
  col = lessWash(col, 0.6);
${fe}}`;function et(e,t,b){let r=[.063,.08,.093,.113,.134,.158,.19,.215,.245,.275,.31,.36,.42,.48,.56,.64,.7,.76,.8,.84,.88,.93],A=null;const M=(h,a)=>{r=h.slice(),A=new x.CatmullRomCurve3(a.map(n=>n.isVector3?n.clone():c(n[0],n[1],n[2])),!1,"catmullrom",.5)};M(r,[[-35,1,128],[-31,9,136],[-25,17,152],[-17,27,190],[-22,36,240],[-62,36,272],[-104,31,200],[-110,26,80],[-72,19,-72],[0,13,-104],[85,26,-55],[95,38,30],[40,45,92],[-50,42,88],[-100,36,10],[-70,30,-75],[10,28,-112],[62,26,-200],[4,21,-318],[-37,10.5,-262],[-38,7,-196],[-36,1,-68]]);const p=(h,a)=>{const n=ce(h,r[0],r[r.length-1]);let v=0;for(;v<r.length-2&&n>r[v+1];)v++;return A.getPoint((v+(n-r[v])/(r[v+1]-r[v]))/(r.length-1),a)},w=h=>{let a=-8;for(;a>-60&&b(a,h)>-.25;)a-=.5;return a},S=[];for(let h=0;h<le;h++){const a=Math.ceil(h/2),n=h%2?1:-1;S.push({lag:a*.0016+e.range(0,6e-4),lat:n*a*2.7+e.range(-.6,.6),up:e.range(-1.2,1.2)+a*.25,phase:e()*U,a:c(0,.98,142-h*2.6+e.range(-1,1)),ya:e()*U,b:c(-35+e.range(-5,4),.98,-64-a*2.6+e.range(-1,1)),yb:e()*U})}for(const h of S)h.a.x=w(h.a.z)-1.2-e.range(0,3.2);const y=new Float32Array(le*4),o=new Float32Array(le*4),i=new Float32Array(le*4),g=new x.InstancedBufferAttribute(y,4),d=new x.InstancedBufferAttribute(o,4),l=new x.InstancedBufferAttribute(i,4);for(const h of[g,d,l])h.setUsage(x.DynamicDrawUsage);t.setAttribute("aI0",g),t.setAttribute("aI1",d),t.setAttribute("aI2",l),t.instanceCount=le;const s=c(),C=c(),m=c(),z=h=>h-U*Math.round(h/U);return{birds:S,at:p,setCourse:M,keys:()=>r.slice(),update(h,a){for(let n=0;n<le;n++){const v=S[n],f=h-v.lag;let F,T=0,_=0,R=0,I=1,L=0;if(f<=r[0])s.copy(v.a),F=v.ya+.15*Math.sin(a*.3+n),T=.06*Math.sin(a*.45+n*2.1);else if(f>=.93)s.copy(v.b),F=v.yb+.15*Math.sin(a*.3+n),T=.06*Math.sin(a*.45+n*2.1);else{p(f,s),p(f+.003,C),p(f+.006,m);const k=C.x-s.x,u=C.z-s.z,P=Math.hypot(k,u)+1e-4;F=Math.atan2(k,u),T=ce(Math.atan2(C.y-s.y,P),-.5,.6),_=ce(z(Math.atan2(m.x-C.x,m.z-C.z)-F)*-5,-.5,.5);const W=E(.39,.44,f)*(1-E(.895,.925,f)),j=K(K(.42,1,E(.135,.17,f)),.3,W),B=E(.422,.452,f)*(1-E(.875,.9,f));F+=z(-F)*B,T*=1-.8*B,_=K(_,.5*Math.sin(Math.PI*E(.422,.452,f)),B),s.x+=u/P*v.lat*j,s.z+=-k/P*v.lat*j,s.y+=v.up;const V=r[0],q=E(V,V+.022,f),J=E(.895,.93,f);s.lerpVectors(v.a,s,q).lerp(v.b,J),I=Math.max(1-E(V,V+.008,f),E(.918,.93,f)),L=E(.865,.9,f)*(1-E(.915,.93,f));const N=.5+.5*E(-.3,.5,Math.sin(f*60+n*1.7));R=K(K(.95,.85*N+.08,E(.125,.21,f)),.3,L)*(1-I),F=K(F,F+z(v.yb-F),E(.915,.93,f)),F=K(v.ya+z(F-v.ya),F,E(V,V+.01,f)),T*=1-I}y[n*4]=s.x,y[n*4+1]=s.y,y[n*4+2]=s.z,y[n*4+3]=F,o[n*4]=T,o[n*4+1]=_,o[n*4+2]=v.phase,o[n*4+3]=R,i[n*4]=I,i[n*4+1]=L,i[n*4+2]=K(1.38,1.12,I)}g.needsUpdate=d.needsUpdate=l.needsUpdate=!0}}}export{ot as buildHero};
