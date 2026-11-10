import*as t from"three";import{clamp as D,lerp as ie,smoothstep as U}from"../kit/core.js";const Ie=["#061A33","#0E4C7A","#2FBF9A","#6FE6F2","#DDF3F6","#B58A3C","#E8452C"],te=88,se=768,le=32,ce=40,Pe=30,_e=.36,ue=`
float bh(vec3 p){ p = fract(p*0.3183099 + vec3(0.71, 0.113, 0.419)); p *= 17.0; return fract(p.x*p.y*p.z*(p.x + p.y + p.z)); }
float bn(vec3 x){
  vec3 i = floor(x), f = fract(x); f = f*f*(3.0 - 2.0*f);
  return mix(mix(mix(bh(i), bh(i + vec3(1,0,0)), f.x), mix(bh(i + vec3(0,1,0)), bh(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(bh(i + vec3(0,0,1)), bh(i + vec3(1,0,1)), f.x), mix(bh(i + vec3(0,1,1)), bh(i + vec3(1,1,1)), f.x), f.y), f.z);
}
`,ve=`
uniform float uTipY;
uniform float uH;
float brRadius(float y){
  float L = max(uH - uTipY, 1.0);
  float d = clamp((y - uTipY)/L, 0.0001, 1.0);
  float dm = max(y - uTipY, 0.0);
  return (1.0 + 2.6*pow(d, 0.8))*(1.0 + 0.32*exp(-dm*0.8));
}
`,pe=`
uniform sampler2D uFrostMap;
uniform vec4 uFrostRect;   // x0, z0, 1/width, 1/length
uniform float uFront;
vec4 frostField(vec2 xz){
  vec2 uv = vec2((xz.x - uFrostRect.x)*uFrostRect.z, (uFrostRect.y - xz.y)*uFrostRect.w);
  return textureLod(uFrostMap, clamp(uv, 0.0, 1.0), 0.0);
}
float frostArrive(vec2 xz, vec4 f){ return length(xz) + f.g*${ce}.0; }
`,Ae=`
float fogKeep(){
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      return exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
    #else
      return 1.0 - smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #else
    return 1.0;
  #endif
}
`;function Fe(a){return new t.Color(a)}function nt(a){return t.UniformsUtils.merge([t.UniformsLib.fog,a])}async function Re(a,o,d){const l=a.noise,s=16,c=d+20,g=new Uint8Array(te*se*4),C=o.range(0,500),F=o.range(0,500),b=o.range(0,500),A=o.range(3.5,6),M=o.range(13,19),v=o.range(4,5.5),i=o.range(6,8.5),y=z=>(A*l.n2(z/90+C,3.1)+2*l.n2(z/31+C,9.7))*U(8,60,z),x=z=>(v+i*(.5+.5*l.n2(z/70+F,1.7)))*(.55+.45*U(0,50,z)),w=z=>M*l.n2(z/58+b,5.3);for(let z=0;z<se;z++){const _=s-(z+.5)/se*c,W=-_,H=y(Math.max(W,0)),O=x(Math.max(W,0)),q=w(Math.max(W,0)),Z=U(-2,7,W),L=U(4.5,8,Math.abs(q))*U(25,60,W);for(let T=0;T<te;T++){const k=-le+(T+.5)/te*le*2,p=k+3.2*l.n2(k/13+F,_/13),u=1-Math.abs(l.n2(p/8+C,_/30+7)),n=1-Math.abs(l.n2(p/3.5+20,_/12+b)),h=u*.7+n*.3,I=l.n2(k/6+50+b,_/9);let e=Math.max(1-Math.abs(k-H)/O,(.8-Math.abs(k-H-q)/3.4)*L);e+=1.6*(h-.7)-.9*U(.5,.8,I),e=ie(-1,e,Z);const r=Math.hypot(k,_);if(r<18){const R=Math.atan2(_,k),S=1-Math.abs(l.n2(Math.cos(R)*2.2+3+C,Math.sin(R)*2.2+r/14));e=Math.max(e,1-r/6.5+1.5*(S-.72))}e-=2*U(26,31,Math.abs(k));const f=D(.5+1.4*(e-.1),0,1),V=D(3.5+8*(1-D(e*1.3,0,1))+5*l.n2(k/11+90,_/34+F),0,ce),Y=D(.5+.6*l.n2(k/2.4+30,_/2.4+C)+.25*(h-.6),0,1),G=(z*te+T)*4,j=T===0||T===te-1||z===0||z===se-1?0:1;g[G]=Math.round(f*255)*j,g[G+1]=Math.round(V/ce*255),g[G+2]=Math.round(Y*255),g[G+3]=255}z%24===23&&await a.yield()}const m=new t.DataTexture(g,te,se,t.RGBAFormat,t.UnsignedByteType);m.magFilter=t.LinearFilter,m.minFilter=t.LinearFilter,m.wrapS=m.wrapT=t.ClampToEdgeWrapping,m.generateMipmaps=!1,m.needsUpdate=!0;const B=(z,_,W)=>{const H=D((z+le)/(le*2),0,1)*te-.5,O=D((s-_)/c,0,1)*se-.5,q=D(Math.floor(H),0,te-1),Z=D(Math.floor(O),0,se-1),L=Math.min(q+1,te-1),T=Math.min(Z+1,se-1),k=D(H-q,0,1),p=D(O-Z,0,1),u=g[(Z*te+q)*4+W],n=g[(Z*te+L)*4+W],h=g[(T*te+q)*4+W],I=g[(T*te+L)*4+W];return ie(ie(u,n,k),ie(h,I,k),p)/255},K=(z,_)=>B(z,_,0),E=(z,_)=>B(z,_,0)>.5?Math.hypot(z,_)+B(z,_,1)*ce:1/0,N=new t.Vector4(-le,s,1/(le*2),1/c);return{map:m,rect:N,sample:B,coverage:K,arrive:E,centre:z=>y(Math.max(z,0)),z0:s,flen:c}}async function Ke(a,o,d){const l=a.noise,s=48,c=Math.PI*2,g=o.range(0,300),C=o.range(0,300),F=o.range(.7,1.5),b=o.range(.1,.2),A=o.range(.3,.75),M=u=>{const n=D(u/d,0,1),h=4*n*(1-n)*F;return[l.n2(u/22+g,1.3)*h,l.n2(u/22+g,47.9)*h]},v=u=>1+2.6*Math.pow(D(u/d,1e-4,1),.8),i=[],y=[],x=[],w=[],m=[],B=[],K=[];{let u=d;for(;u>.01;){let n=o.range(.6,1.2);u-n<.45&&(n=u),K.push({top:u,h:n,flare:b*o.range(.25,1)*(o.chance(.22)?2.1:1),seed:o.range(0,100),tx:o.range(-1,1),tz:o.range(-1,1),kn:o.chance(A)?o.int(1,3):0,ka:o.range(0,c),kw:o.range(.22,.42),kh:o.range(.18,.42)}),u-=n}}const E=[[0,.84,1,.25],[.26,.97,1,.3],[.52,1.08,.75,.45],[.76,1.14,.45,.75],[.98,1.13,.2,1],[.9,.9,.7,.35]];let N=0;const z=[];for(let u=0;u<K.length;u++){const n=K[u];for(let h=0;h<E.length;h++){const[I,e,r,f]=E[h],V=h===3?.45:h===4?1:0,Y=n.top-I*n.h;for(let G=0;G<=s;G++){const j=G%s/s*c,R=Math.cos(j),S=Math.sin(j),P=1+.11*l.n3(R*1.3+C,Y*.22,S*1.3)+.05*l.n3(R*3.1,Y*.6+C,S*3.1),oe=l.n3(R*2.4+n.seed,n.seed*.37,S*2.4),Q=l.n3(R*3.6+n.seed,9.1,S*3.6);let $=e*P+V*n.flare*Math.max(0,.9+1.3*oe+.25*Q);if(n.kn&&h>=1&&h<=4)for(let ee=0;ee<n.kn;ee++){let ne=j-(n.ka+ee*2.3);ne=Math.atan2(Math.sin(ne),Math.cos(ne)),$+=n.kh*Math.exp(-(ne*ne)/(n.kw*n.kw))*(h===2||h===3?1:.55)}let J=Y+(n.tx*R+n.tz*S)*.1*n.h-V*n.h*(.1+.55*Math.max(0,.5*Q+oe));J=D(J,0,d);const X=U(d-6.5,d,J);$*=1+1.25*X*X;const ae=M(J),re=v(J);i.push(ae[0]+R*$*re,J,ae[1]+S*$*re),y.push(R*$,S*$),x.push(ae[0],ae[1]),w.push(r*(1-.6*X)),m.push(D(f+.25*Q,0,1))}N++}z.push({y:n.top-.95*n.h,flare:n.flare}),u%3===2&&await a.yield()}const _=s+1;for(let u=0;u<N-1;u++){for(let n=0;n<s;n++){const h=u*_+n,I=h+1,e=h+_,r=e+1;B.push(h,I,e,I,r,e)}u%60===59&&await a.yield()}const W=N*_;await a.yield();const H=o.int(46,72),O=6,q=6;for(let u=0;u<H;u++){const n=o.range(5,d-5),h=o.range(0,c),I=Math.cos(h),e=Math.sin(h),r=M(n),f=v(n),V=o.range(.16,.34),Y=o.range(.9,2.2)+1.3*o()*(n/d),G=o.range(.25,.85),j=o.range(-.5,.5),R=i.length/3;for(let S=0;S<=q;S++){const P=S/q,oe=f*.9+G*(1-(1-P)*(1-P)),Q=Y*Math.pow(P,1.35),$=r[0]+I*oe-e*j*P*P,J=r[1]+e*oe+I*j*P*P,X=n-Q,ae=G*2*(1-P)+.05,re=Y*1.35*Math.pow(Math.max(P,.02),.35),ee=Math.hypot(ae,re),ne=I*ae/ee,ye=-re/ee,Te=e*ae/ee,fe=-e,de=I,Ce=ye*de,Se=Te*fe-ne*de,Be=-ye*fe,ge=S===q?.02:V*Math.pow(1-P,.75)*(1+.45*l.n2(u*3.1+P*5,77.7))+.03;for(let me=0;me<O;me++){const xe=me/O*c,we=Math.cos(xe)*ge,he=Math.sin(xe)*ge,be=$+fe*we+Ce*he,ke=D(X+Se*he,0,d),Me=J+de*we+Be*he;i.push(be,ke,Me),y.push((be-r[0])/f,(Me-r[1])/f),x.push(r[0],r[1]),w.push(.1+.25*P),m.push(.6+.4*P)}}for(let S=0;S<q;S++)for(let P=0;P<O;P++){const oe=R+S*O+P,Q=R+S*O+(P+1)%O,$=oe+O,J=Q+O;B.push(oe,$,Q,Q,$,J)}u%12===11&&await a.yield()}await a.yield();const Z=i.length/3,L=new Float32Array(i),T=new Uint32Array(B);await a.yield();const k=new t.BufferGeometry;k.setAttribute("position",new t.BufferAttribute(L,3)),k.setAttribute("aRel",new t.BufferAttribute(new Float32Array(y),2)),await a.yield(),k.setAttribute("aAxis",new t.BufferAttribute(new Float32Array(x),2)),k.setAttribute("aThin",new t.BufferAttribute(new Float32Array(w),1)),await a.yield(),k.setAttribute("aTone",new t.BufferAttribute(new Float32Array(m),1)),k.setIndex(new t.BufferAttribute(T,1)),await a.yield();const p=new Float32Array(Z*3);for(let u=0,n=T.length;u<n;u+=3){const h=T[u]*3,I=T[u+1]*3,e=T[u+2]*3,r=L[e]-L[I],f=L[e+1]-L[I+1],V=L[e+2]-L[I+2],Y=L[h]-L[I],G=L[h+1]-L[I+1],j=L[h+2]-L[I+2],R=f*j-V*G,S=V*Y-r*j,P=r*G-f*Y;p[h]+=R,p[h+1]+=S,p[h+2]+=P,p[I]+=R,p[I+1]+=S,p[I+2]+=P,p[e]+=R,p[e+1]+=S,p[e+2]+=P,u%18e3===17997&&await a.yield()}await a.yield();for(let u=0;u<Z;u++){const n=u*3,h=Math.hypot(p[n],p[n+1],p[n+2]);h>0&&(p[n]/=h,p[n+1]/=h,p[n+2]/=h),u%8e3===7999&&await a.yield()}for(let u=0;u<N;u++){const n=u*_*3,h=n+s*3,I=p[n]+p[h],e=p[n+1]+p[h+1],r=p[n+2]+p[h+2],f=Math.hypot(I,e,r)||1;p[n]=p[h]=I/f,p[n+1]=p[h+1]=e/f,p[n+2]=p[h+2]=r/f}for(let u=W;u<Z;u++){const n=u*3;Math.hypot(p[n],p[n+1],p[n+2])>.5||(p[n]=0,p[n+1]=-1,p[n+2]=0)}return k.setAttribute("normal",new t.BufferAttribute(p,3)),await a.yield(),k.boundingSphere=new t.Sphere(new t.Vector3(0,d/2,0),d*.6),{geometry:k,axisAt:M,rref:v,lipY:z,triangles:B.length/3}}const Ne=`
attribute vec2 aRel; attribute vec2 aAxis; attribute float aThin; attribute float aTone;
varying vec3 vN; varying vec3 vW; varying vec3 vP; varying float vD; varying float vThin; varying float vTone;
#include <fog_pars_vertex>
${ve}
void main(){
  float R = brRadius(position.y);
  vec3 p = vec3(aAxis.x + aRel.x*R, position.y, aAxis.y + aRel.y*R);
  vD = position.y - uTipY; vP = position; vThin = aThin; vTone = aTone;
  vec4 w = modelMatrix*vec4(p, 1.0); vW = w.xyz;
  vN = mat3(modelMatrix)*normal;
  vec4 mvPosition = viewMatrix*w;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,De=`
uniform vec3 uKeyDir; uniform vec3 uKeyCol; uniform vec3 uFillCol; uniform vec3 uIce; uniform vec3 uShade; uniform vec3 uCore;
uniform float uTime; uniform float uCoreI;
varying vec3 vN; varying vec3 vW; varying vec3 vP; varying float vD; varying float vThin; varying float vTone;
#include <fog_pars_fragment>
${ue}
void main(){
  float rag = bn(vec3(vP.x*1.9, 3.7, vP.z*1.9))*0.9 + bn(vec3(vP.x*5.0, 1.3, vP.z*5.0))*0.5;
  if (vD < rag - 0.05) discard;
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0)); if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vW + vec3(0.0, 1e-4, 0.0));
  vec3 q = vP*4.3; float c1 = bn(q), c2 = bn(q + vec3(7.3, 1.1, 3.7)), c3 = bn(q*2.6 + 11.0), n1 = bn(vP*vec3(1.3, 0.8, 1.3));
  N = normalize(N + 0.42*vec3(c1 - 0.5, (c3 - 0.5)*0.7, c2 - 0.5));
  float ndv = clamp(abs(dot(N, V)), 0.0, 1.0), fres = (1.0 - ndv)*(1.0 - ndv);
  float ndl = dot(N, uKeyDir), wrap = clamp(ndl*0.68 + 0.32, 0.0, 1.0); wrap *= wrap;
  float frost = clamp(vTone*0.8 + n1*0.55 + c3*0.25 - 0.42, 0.0, 1.0);
  vec3 alb = mix(uShade*0.4, uIce*0.7, frost);
  vec3 col = alb*(uKeyCol*wrap*1.25 + uFillCol*0.9);
  // brine streaming down inside the hollow core, seen through the thin wall
  float st = bn(vec3(vP.x*0.9, vP.y*0.26 + uTime*1.5, vP.z*0.9)), st2 = bn(vec3(vP.x*2.7, vP.y*0.9 + uTime*2.6, vP.z*2.7));
  float core = vThin*ndv*ndv*sqrt(ndv)*(0.14 + 0.86*smoothstep(0.38, 0.72, st))*(0.55 + 0.75*st2)*(1.0 - 0.7*frost);
  col = col*(1.0 - 0.5*core) + mix(uCore, uShade, 0.35)*uCoreI*core*0.95;
  // rim light from the key side, cyan-white; a little ice sparkle
  col += mix(uIce, uCore, 0.45)*fres*(0.07 + 0.8*clamp(ndl + 0.3, 0.0, 1.0));
  vec3 Hh = normalize(uKeyDir + V);
  col += uIce*pow(clamp(dot(N, Hh), 0.0, 1.0), 40.0)*step(0.55, c3)*1.4*clamp(ndl*3.0, 0.0, 1.0);
  // the newest collar still condensing
  float fresh = exp(-max(vD, 0.0)*0.75);
  col += uCore*2.3*fresh*(0.55 + 0.45*st2);
  if (!gl_FrontFacing) col = uCore*(0.35 + 1.5*st)*(0.6 + 1.2*fresh) + alb*uFillCol;
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;function Ee(a,o,d,l){const s=new t.InstancedBufferGeometry,c=[0,0,0,.085,.3,.02,0,1,0,-.085,.3,.02,0,.05,0,.02,.28,.07,0,.8,0,.02,.28,-.07];s.setAttribute("position",new t.Float32BufferAttribute(c,3)),s.setIndex([0,1,2,0,2,3,4,5,6,4,6,7]),s.computeVertexNormals();const g=new Float32Array(l*4),C=new Float32Array(l*4);for(let F=0;F<l;F++){let b,A,M,v;if(a()<.74){const x=o.lipY[Math.floor(a()*o.lipY.length)];b=x.y+a.range(-.08,.14),A=1.08+x.flare*a.range(.5,1),M=a.range(.7,1.45),v=a.range(.3,.8)}else b=a.range(1,d-2),A=a.range(.92,1.02),M=a.range(0,.9),v=a.range(.22,.6);b=D(b,.3,d-.5);const i=U(d-6.5,d,b);A*=1+.7*i*i;const y=o.axisAt(b);g.set([b,a.range(0,Math.PI*2),A,v*(1+.5*(b/d))],F*4),C.set([y[0],y[1],M,a()],F*4)}return s.setAttribute("iA",new t.InstancedBufferAttribute(g,4)),s.setAttribute("iB",new t.InstancedBufferAttribute(C,4)),s.instanceCount=l,s.boundingSphere=new t.Sphere(new t.Vector3(0,d/2,0),d*.6),s}const We=`
attribute vec4 iA; attribute vec4 iB; uniform vec3 uKeyDir;
varying vec3 vN; varying vec3 vW; varying float vTipK; varying float vD; varying float vSeed; varying float vSide;
#include <fog_pars_vertex>
${ve}
void main(){
  float y = iA.x, R = brRadius(y), d = y - uTipY;
  float grow = smoothstep(0.5, 3.6, d);
  vec3 o = vec3(cos(iA.y), 0.0, sin(iA.y)), sd = vec3(-o.z, 0.0, o.x);
  vec3 dir = o*cos(iB.z) - vec3(0.0, 1.0, 0.0)*sin(iB.z);
  vec3 th = cross(sd, dir);
  float ro = iB.w*6.2832, cr = cos(ro), sr = sin(ro);
  vec3 s2 = sd*cr + th*sr, t2 = th*cr - sd*sr;
  vec3 base = vec3(iB.x + o.x*R*iA.z, y, iB.y + o.z*R*iA.z);
  vec3 p = base + (s2*position.x + dir*position.y + t2*position.z)*iA.w*grow;
  vec3 n = s2*normal.x + dir*normal.y + t2*normal.z;
  vTipK = position.y; vD = d; vSeed = iB.w;
  vSide = clamp(dot(normalize(mat3(modelMatrix)*o), uKeyDir)*0.6 + 0.5, 0.0, 1.0);
  vec4 w = modelMatrix*vec4(p, 1.0); vW = w.xyz; vN = mat3(modelMatrix)*n;
  vec4 mvPosition = viewMatrix*w;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Le=`
uniform vec3 uKeyDir; uniform vec3 uKeyCol; uniform vec3 uFillCol; uniform vec3 uIce; uniform vec3 uShade; uniform vec3 uCore;
varying vec3 vN; varying vec3 vW; varying float vTipK; varying float vD; varying float vSeed; varying float vSide;
#include <fog_pars_fragment>
void main(){
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0));
  vec3 V = normalize(cameraPosition - vW + vec3(0.0, 1e-4, 0.0));
  float ndl = dot(N, uKeyDir), lit = 0.3 + 0.7*abs(ndl);
  float side = vSide;
  vec3 alb = mix(uShade*0.55, uIce*0.7, 0.45 + 0.4*vTipK + 0.15*vSeed);
  vec3 col = alb*(uKeyCol*lit*(0.25 + 1.2*side) + uFillCol*1.15);
  vec3 Hh = normalize(uKeyDir + V);
  col += uIce*pow(clamp(abs(dot(N, Hh)), 0.0, 1.0), 26.0)*1.3*side;
  col += uCore*(0.06*(1.0 - vTipK) + 1.6*exp(-max(vD, 0.0)*0.7));
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;function ze(a,o,d,l){const s=Math.cos(d),c=Math.sin(d),g=Math.exp(-Math.pow((o-8.2)/2.7,2))*(2.6+1.3*a.n2(s*1.6+l,c*1.6)),C=.55*(.5+.5*a.n2(s*o*.45+l,c*o*.45))+.25*a.n2(s*o*1.3,c*o*1.3+l);return Math.max(0,(g+C)*(1-U(12,17.5,o)))}function Ve(a,o,d){const l=a.noise,s=56,c=18,g=o.range(0,200),C=[],F=[],b=[];for(let v=0;v<=c;v++){const i=3.6+Math.pow(v/c,1.15)*14.4;for(let y=0;y<=s;y++){const x=y%s/s*Math.PI*2,w=ze(l,i,x,g);C.push(Math.cos(x)*i,d-w-(v===0?1.2:0)+.02,Math.sin(x)*i),F.push(.5+.5*l.n2(Math.cos(x)*i*.16+g,Math.sin(x)*i*.16),.5+.5*l.n2(Math.cos(x)*i*.33+60,Math.sin(x)*i*.33+g),w/3.5,1-U(12.5,17.5,i))}}const A=s+1;for(let v=0;v<c;v++)for(let i=0;i<s;i++){const y=v*A+i,x=y+1,w=y+A,m=w+1;b.push(y,w,x,x,w,m)}const M=new t.BufferGeometry;return M.setAttribute("position",new t.Float32BufferAttribute(C,3)),M.setAttribute("aPar",new t.Float32BufferAttribute(F,4)),M.setIndex(b),M.computeVertexNormals(),{geometry:M,drop:(v,i)=>ze(l,v,i,g)}}const Ge=`
attribute vec4 aPar; varying vec4 vPar; varying vec3 vP; varying vec3 vN; varying vec3 vW;
#include <fog_pars_vertex>
void main(){
  vPar = aPar; vP = position; vN = mat3(modelMatrix)*normal;
  vec4 w = modelMatrix*vec4(position, 1.0); vW = w.xyz;
  vec4 mvPosition = viewMatrix*w;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Ue=`
uniform vec3 uTeal; uniform vec3 uJade; uniform vec3 uOchre; uniform vec3 uCore; uniform vec3 uKeyDir; uniform float uTime; uniform float uCeil;
varying vec4 vPar; varying vec3 vP; varying vec3 vN; varying vec3 vW;
#include <fog_pars_fragment>
${ue}
void main(){
  float n = bn(vP*vec3(0.9, 1.4, 0.9)), f = bn(vP*3.1 + 5.0), pl = bn(vP*7.0);
  // transmitted daylight: bright where the ice is thin (little drop), dim under the hanging rim
  float thinIce = clamp(1.0 - vPar.z*0.75, 0.0, 1.0);
  float side = clamp(dot(normalize(vec3(vP.x, 0.0, vP.z) + vec3(1e-4, 0.0, 0.0)), uKeyDir)*0.5 + 0.5, 0.0, 1.0);
  vec3 col = mix(uTeal*0.55, uJade*0.8, clamp(vPar.x*0.9 + n*0.5 - 0.25, 0.0, 1.0)*thinIce);
  col *= uCeil*(0.45 + 0.75*thinIce)*(0.6 + 0.8*side)*(0.75 + 0.5*f);
  col = mix(col, uOchre*(0.22 + 0.2*f), smoothstep(0.55, 0.8, vPar.y + n*0.25)*0.6);
  col += uCore*0.16*smoothstep(0.72, 0.95, pl)*(0.5 + 0.5*side);
  vec3 N = normalize(vN + vec3(0.0, -1e-5, 0.0));
  col += uCore*0.10*clamp(dot(N, uKeyDir) + 0.2, 0.0, 1.0);
  gl_FragColor = vec4(col, vPar.w);
  #include <fog_fragment>
}`;function He(a,o,d,l){const s=new t.InstancedBufferGeometry,c=[];for(let F=0;F<6;F++){const b=F/6*Math.PI*2;c.push(Math.cos(b),Math.sin(b),0)}s.setAttribute("position",new t.Float32BufferAttribute(c,3)),s.setIndex([0,1,2,0,2,3,0,3,5,3,4,5]);const g=new Float32Array(l*4),C=new Float32Array(l*4);for(let F=0;F<l;F++){const b=3.8+12.5*Math.pow(a(),.85),A=a.range(0,Math.PI*2),M=o.drop(b,A);g.set([Math.cos(A)*b,d-M-a.range(0,.5)*(.4+M),Math.sin(A)*b,a.range(.22,.6)*(.7+.35*Math.min(M,2.5))],F*4),C.set([a.range(0,Math.PI*2),a.range(1.15,2),a(),a()],F*4)}return s.setAttribute("iA",new t.InstancedBufferAttribute(g,4)),s.setAttribute("iB",new t.InstancedBufferAttribute(C,4)),s.instanceCount=l,s}const Oe=`
attribute vec4 iA; attribute vec4 iB; uniform float uTime;
varying vec3 vN; varying vec3 vW; varying float vSeed; varying vec2 vL;
#include <fog_pars_vertex>
void main(){
  float yaw = iB.x, pit = iB.y + 0.05*sin(uTime*0.6 + iB.z*40.0);
  vec3 n = vec3(sin(pit)*cos(yaw), cos(pit), sin(pit)*sin(yaw));
  vec3 t = normalize(vec3(-sin(yaw), 0.0, cos(yaw)));
  vec3 b = cross(n, t);
  vec3 p = iA.xyz + (t*position.x*(0.7 + 0.6*iB.w) + b*position.y*(1.0 + 0.9*iB.z))*iA.w;
  vSeed = iB.z; vL = position.xy;
  vec4 w = modelMatrix*vec4(p, 1.0); vW = w.xyz; vN = mat3(modelMatrix)*n;
  vec4 mvPosition = viewMatrix*w;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,qe=`
uniform vec3 uTeal; uniform vec3 uJade; uniform vec3 uCore; uniform vec3 uIce; uniform vec3 uKeyDir; uniform float uCeil;
varying vec3 vN; varying vec3 vW; varying float vSeed; varying vec2 vL;
#include <fog_pars_fragment>
void main(){
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0));
  vec3 V = normalize(cameraPosition - vW + vec3(0.0, 1e-4, 0.0));
  vec3 Hh = normalize(uKeyDir + V);
  float gl = pow(clamp(abs(dot(N, Hh)), 0.0, 1.0), 18.0);
  float edge = smoothstep(0.55, 0.95, length(vL));
  float band = 0.82 + 0.18*sin(vL.y*13.0 + vL.x*4.0 + vSeed*40.0);
  vec3 col = mix(uTeal*1.1, uJade*0.62, 0.3 + 0.45*vSeed*vSeed)*uCeil*(0.7 + 0.3*abs(dot(N, uKeyDir)))*band*(1.0 - 0.25*(1.0 - edge)*vSeed);
  col += mix(uCore, uJade, 0.4)*(0.10*edge + 0.6*gl);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;function Ye(){const a=[],o=[],d=(s,c,g)=>{const C=a.length/3;for(let F=0;F<=c;F++)for(let b=0;b<=s;b++)a.push(b/s*2-1,F/c,g);for(let F=0;F<c;F++)for(let b=0;b<s;b++){const A=C+F*(s+1)+b,M=A+1,v=A+s+1,i=v+1;o.push(A,M,v,M,i,v)}};d(6,40,0),d(2,16,1);const l=new t.BufferGeometry;return l.setAttribute("position",new t.Float32BufferAttribute(a,3)),l.setIndex(o),l}const je=`
uniform vec3 uTip; uniform float uFall; uniform float uTime; uniform float uSplash;
varying vec2 vUv; varying float vKind; varying float vHw;
#include <fog_pars_vertex>
${ve}
void main(){
  float kind = position.z, v = position.y; vec3 c; float hw;
  if (kind < 0.5) {
    c = vec3(uTip.x + sin(v*4.0 - uTime*1.1)*0.45*v + sin(v*9.0 + uTime*1.7)*0.14*v, uTip.y + 0.6 - v*uFall, uTip.z + cos(v*3.3 - uTime*0.9)*0.4*v);
    hw = 0.95 + 1.25*v + uSplash*v*v*v*v*0.8;
  } else {
    float y = mix(uTip.y - 3.0, uH, v);
    c = vec3(uTip.x*(1.0 - v), y, uTip.z*(1.0 - v));
    hw = brRadius(max(y, uTip.y))*2.4 + 1.8;
  }
  vec4 cw = modelMatrix*vec4(c, 1.0);
  vec3 tc = cameraPosition - cw.xyz;
  vec3 right = normalize(vec3(tc.z, 0.0, -tc.x) + vec3(1e-4, 0.0, 0.0));
  cw.xyz += right*hw*position.x;
  vUv = vec2(position.x, v); vKind = kind; vHw = hw;
  vec4 mvPosition = viewMatrix*cw;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,$e=`
uniform vec3 uCore; uniform vec3 uIce; uniform float uTime; uniform float uFall; uniform float uSplash; uniform float uBrine;
varying vec2 vUv; varying float vKind; varying float vHw;
#include <fog_pars_fragment>
${ue}
${Ae}
void main(){
  float u = vUv.x, v = vUv.y; vec3 rgb; float al;
  if (vKind < 0.5) {
    float a = abs(u)*vHw/(0.75 + 0.55*v*vHw*0.5);
    float coreMask = 1.0 - smoothstep(0.5, 1.0, a);
    float yy = v*uFall, xx = u*vHw;
    float warp = bn(vec3(xx*0.7, yy*0.25 - uTime*0.9, 1.0));
    float s = bn(vec3(xx*2.6 + warp*1.9, yy*0.45 - uTime*2.4, uTime*0.25));
    float s2 = bn(vec3(xx*6.0 - warp*1.5, yy*0.9 - uTime*4.0, 4.0));
    float schl = smoothstep(0.5, 0.8, s)*0.75 + smoothstep(0.55, 0.85, s2)*0.5;
    float dark = smoothstep(0.52, 0.2, s);
    rgb = (uCore*0.85*schl + mix(uIce, uCore, 0.5)*0.09)*coreMask; al = (0.06 + 0.26*dark)*coreMask;
    float edgeMask = smoothstep(0.45, 1.0, a)*(1.0 - smoothstep(0.7, 1.0, abs(u)));
    float sp = bn(vec3(xx*2.2 + warp, yy*0.9 - uTime*0.9, uTime*0.4)); sp = sp*sp;
    rgb += uIce*0.2*sp*edgeMask + uIce*0.02*edgeMask;
    float fade = smoothstep(0.0, 0.05, v)*mix(1.0 - smoothstep(0.65, 1.0, v), 1.0 - smoothstep(0.9, 1.0, v), uSplash)*uBrine;
    rgb *= fade; al *= fade;
  } else {
    float g = 1.0 - abs(u); g = g*g*sqrt(g);
    g *= smoothstep(0.0, 0.14, v)*(1.0 - smoothstep(0.8, 1.0, v));
    rgb = uCore*0.05*g*(0.8 + 0.4*bn(vec3(u*2.0, v*22.0 + uTime*0.6, 0.0))); al = 0.0;
  }
  float fk = fogKeep();
  gl_FragColor = vec4(rgb*fk, al*fk);
}`,Je=`
attribute vec4 iA; attribute vec4 iB;
uniform vec3 uTip; uniform float uTime; uniform float uTouch; uniform float uFront; uniform float uSplash;
varying vec2 vUv; varying float vKind; varying float vBright;
#include <fog_pars_vertex>
${ve}
void main(){
  float kind = iB.x, size = iB.y, bright = 0.0; vec3 c;
  if (kind < 0.5) {
    float dirn = iA.z > 0.5 ? 1.0 : -1.0;
    float ang = iA.x*6.2832 + uTime*(0.5 + iA.y)*dirn;
    float rad = brRadius(uTip.y)*(0.85 + 1.2*iA.y) + 0.3*sin(uTime*2.0 + iA.w*30.0);
    c = uTip + vec3(cos(ang)*rad, (iA.z - 0.3)*2.8 - fract(uTime*0.25*(0.5 + iA.w) + iA.x)*1.3 + 0.6, sin(ang)*rad);
    size *= 0.6 + 0.4*sin(uTime*5.0 + iA.w*50.0);
    bright = 1.7*(1.0 - 0.85*uSplash);
  } else if (kind < 1.5) {
    float k = uTouch, e = 1.0 - (1.0 - k)*(1.0 - k), ang = iA.x*6.2832 + iA.w*0.6*e;
    float rad = 1.2 + e*(8.0 + 7.0*iA.y);
    c = vec3(cos(ang)*rad, 0.35 + e*(0.25 + 2.1*iA.z*iA.z*iA.z), sin(ang)*rad);
    size *= 0.45 + 1.0*e;
    bright = 0.15*smoothstep(0.0, 0.08, k)*(1.0 - k)*sqrt(max(1.0 - k, 0.0));
  } else {
    float k = uFront - iB.z;
    float vis = smoothstep(-3.0, 0.5, k)*exp(-max(k, 0.0)/8.0);
    // behind the front the lobes go on smoking: a wisp of ice dust rises and thins, again and again
    float cyc = fract(uTime*0.12 + iA.w*7.0), late = smoothstep(10.0, 30.0, k), kk = min(max(k, 0.0), 40.0);
    c = iA.xyz + vec3(sin(iA.w*40.0)*1.6*cyc*late, mix(0.7 + kk*0.11, 0.9 + cyc*5.0, late), 0.0);
    size *= mix(0.6 + 0.05*kk, 0.8 + 1.4*cyc, late);
    bright = 0.20*vis + 0.10*late*sin(cyc*3.1416);
  }
  if (bright < 0.003) size = 0.0;
  vUv = position.xy; vKind = kind; vBright = bright;
  vec4 mvPosition = viewMatrix*modelMatrix*vec4(c, 1.0);
  mvPosition.xy += position.xy*size;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Xe=`
uniform vec3 uCore; uniform vec3 uIce; uniform vec3 uShade;
varying vec2 vUv; varying float vKind; varying float vBright;
#include <fog_pars_fragment>
${Ae}
void main(){
  float d = length(vUv), a = clamp(1.0 - d, 0.0, 1.0); a *= a;
  if (vKind < 0.5) a = a*a + 0.15*a;
  vec3 c = vKind < 0.5 ? mix(uIce, uCore, 0.45) : (vKind < 1.5 ? mix(uIce, uCore, 0.25) : mix(uCore, uShade, 0.5));
  gl_FragColor = vec4(c*a*vBright*fogKeep(), 0.0);
}`;async function Ze(a,o,d,l){const F=-(l+4),b=new Float32Array(41*381*3),A=new Float32Array(41*381*3),M=new Float32Array(41*381);let v=0;for(let w=0;w<=380;w++){const m=ie(14,F,w/380),B=o.centre(-m)*.8;for(let K=0;K<=40;K++,v++){const E=K/40*2-1,N=B+E*26,z=d(N,m),_=(d(N+.5,m)-z)*2,W=(d(N,m+.5)-z)*2,H=Math.hypot(_,1,W);b[v*3]=N,b[v*3+1]=z,b[v*3+2]=m,A[v*3]=-_/H,A[v*3+1]=1/H,A[v*3+2]=-W/H,M[v]=(1-U(.82,1,Math.abs(E)))*U(0,.02,w/380)*(1-U(.985,1,w/380))}w%60===59&&await a.yield()}const i=new Uint32Array(40*380*6);let y=0;for(let w=0;w<380;w++)for(let m=0;m<40;m++){const B=w*41+m,K=B+1,E=B+40+1,N=E+1;i[y++]=B,i[y++]=K,i[y++]=E,i[y++]=K,i[y++]=N,i[y++]=E}const x=new t.BufferGeometry;return x.setAttribute("position",new t.BufferAttribute(b,3)),x.setAttribute("normal",new t.BufferAttribute(A,3)),x.setAttribute("aEdge",new t.BufferAttribute(M,1)),x.setIndex(new t.BufferAttribute(i,1)),x}const Qe=`
attribute float aEdge;
varying vec2 vXZ; varying vec3 vW; varying vec3 vN; varying float vEdge;
#include <fog_pars_vertex>
${pe}
void main(){
  vec4 f = frostField(position.xz);
  float k = uFront - frostArrive(position.xz, f);
  float frozen = smoothstep(0.42, 0.6, f.r)*smoothstep(0.0, 5.0, k);
  vec3 p = position + normal*(0.07 + frozen*(0.22 + 0.95*f.b*f.r));
  vXZ = position.xz; vEdge = aEdge; vN = mat3(modelMatrix)*normal;
  vec4 w = modelMatrix*vec4(p, 1.0); vW = w.xyz;
  vec4 mvPosition = viewMatrix*w;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,et=`
uniform vec3 uKeyDir; uniform vec3 uKeyCol; uniform vec3 uFillCol; uniform vec3 uIce; uniform vec3 uShade; uniform vec3 uCore; uniform vec3 uJade;
uniform float uTime; uniform float uBed; uniform float uEdgeI;
varying vec2 vXZ; varying vec3 vW; varying vec3 vN; varying float vEdge;
#include <fog_pars_fragment>
${ue}
${pe}
float crustH(vec4 f){ return smoothstep(0.42, 0.6, f.r)*(0.22 + 0.95*f.b*f.r); }
void main(){
  vec2 xz = vXZ;
  vec4 f = frostField(xz);
  float e1 = bn(vec3(xz*1.6, 0.0)), e2 = bn(vec3(xz*5.3, 3.0)), e3 = bn(vec3(xz*13.0, 7.0));
  float cov = f.r + (e1 - 0.5)*0.17 + (e2 - 0.5)*0.09;
  float k = uFront - frostArrive(xz, f) + (e1 - 0.5)*3.0 + (e2 - 0.5)*1.2;
  float inWeb = smoothstep(0.47, 0.54, cov);
  float frozen = inWeb*smoothstep(0.0, 2.2, k);
  float rim = inWeb*smoothstep(-0.9, 0.0, k)*exp(-max(k, 0.0)*0.6);
  // new ice is thin and clear and lit from within: for some twelve metres behind the edge it is deep cyan, whitening into
  // crust as it thickens. It is made by taking light out of the ice (red first), not by adding glow: anything brighter
  // tone-maps to the same pale as the crust. Only the edge itself is a hot line.
  float band = inWeb*smoothstep(-0.9, 0.4, k)*exp(-max(k, 0.0)*0.10), fresh = inWeb*exp(-max(k, 0.0)*0.08);
  // relief from the crust height stored in the field, plus crystal facets
  float hx = crustH(frostField(xz + vec2(0.8, 0.0))) - crustH(frostField(xz - vec2(0.8, 0.0)));
  float hz = crustH(frostField(xz + vec2(0.0, 0.8))) - crustH(frostField(xz - vec2(0.0, 0.8)));
  vec2 cell = floor(xz*1.9 + vec2(e1, e2)*1.3);
  float fa = bh(vec3(cell, 1.0)), fb = bh(vec3(cell, 5.0));
  vec3 N = normalize(vN + vec3(-hx*1.1 + (fa - 0.5)*0.5 + (e3 - 0.5)*0.3, 0.0, -hz*1.1 + (fb - 0.5)*0.5 + (e2 - 0.5)*0.3) + vec3(0.0, 1e-4, 0.0));
  vec3 V = normalize(cameraPosition - vW + vec3(0.0, 1e-4, 0.0));
  float ndl = clamp(dot(N, uKeyDir), 0.0, 1.0);
  float nearK = 1.0 - smoothstep(35.0, 150.0, length(cameraPosition - vW));
  float dn = bn(vec3(xz*vec2(0.9, 0.5) + vec2(e1*1.5, 0.0), 11.0 + uTime*0.07)), den = 1.0 - smoothstep(0.0, 0.035, abs(dn - 0.5));
  float dn2 = bn(vec3(xz*vec2(2.6, 1.5) + vec2(0.0, e1*2.0), 17.0)); den = max(den, (1.0 - smoothstep(0.0, 0.03, abs(dn2 - 0.5)))*0.85*nearK);
  vec3 alb = mix(uShade*0.42, uIce*(0.42 + 0.3*mix(0.5, fa, nearK)), clamp(0.35 + f.b*0.7 + (e3 - 0.5)*0.4*nearK - den*0.4, 0.0, 1.0));
  vec3 frost = alb*(uKeyCol*ndl*1.15 + uFillCol*1.25);
  vec3 Hh = normalize(uKeyDir + V);
  // the river shimmers after it has set: facets twinkle, glints run down it, the marbling crawls (dn above)
  float tw = 0.5 + 0.5*sin(uTime*(1.4 + 3.2*fa) + fb*70.0);
  frost += uIce*pow(clamp(dot(N, Hh), 0.0, 1.0), 34.0)*step(0.6, fb)*(0.45 + 1.1*tw)*nearK;
  frost += uIce*step(0.9, fa)*tw*tw*tw*0.16*nearK;
  float run = bn(vec3(xz*vec2(0.55, 0.16) + vec2(e1*1.5, uTime*1.1), uTime*0.23)); run *= run; run *= run;
  frost += uCore*run*0.20;
  frost += mix(uCore, uShade, 0.3)*(0.16*exp(-max(k, 0.0)/22.0) + 0.04);
  // the bed in front of the ice: black gravel (viewer only) and brine fanning out ahead of the front
  float pool = smoothstep(0.45, 0.8, bn(vec3(xz*0.045, uTime*0.04)));
  vec3 bed = vec3(0.010, 0.014, 0.020)*(0.5 + 1.0*e2 + 0.6*e3) + uJade*0.03*pool*(0.4 + e1);
  bed *= 0.75 + 0.5*sin(xz.y*1.9 + e1*5.0 + xz.x*0.4)*0.5;
  float ahead = smoothstep(-13.0, -0.5, k)*(1.0 - smoothstep(-0.5, 0.5, k))*smoothstep(0.3, 0.5, cov);
  float sh = bn(vec3(xz*vec2(1.7, 0.4) + vec2(e1*2.0, uTime*2.6), uTime*0.7)); sh *= sh;
  float sh2 = bn(vec3(xz*vec2(4.6, 1.1) - vec2(e1*3.0, uTime*4.2), uTime*1.1));
  vec3 wet = mix(uCore, uShade, 0.6)*(0.16 + 0.60*sh + 0.40*sh*smoothstep(0.45, 0.8, sh2));
  vec3 col = mix(bed*uBed, wet, ahead);
  // gaps and islands inside the river are gravel dusted with rime, with a cyan shoreline: never a black hole
  float near4 = max(max(frostField(xz + vec2(3.0, 0.0)).r, frostField(xz - vec2(3.0, 0.0)).r), max(frostField(xz + vec2(0.0, 3.5)).r, frostField(xz - vec2(0.0, 3.5)).r));
  float dustK = smoothstep(0.0, 6.0, k)*(1.0 - inWeb)*smoothstep(0.30, 0.62, max(near4, cov*1.3));
  float dust = dustK*(0.34 + 0.5*smoothstep(0.35, 0.75, e2*0.6 + e3*0.5));
  float shore = dustK*smoothstep(0.28, 0.47, cov);
  vec3 rime = uIce*(0.30 + 0.12*e3)*(uKeyCol*ndl*0.9 + uFillCol*1.3) + mix(uCore, uShade, 0.4)*0.34*shore;
  col = mix(col, rime, clamp(dust*5.0, 0.0, 1.0));
  rim *= 0.84 + 0.28*sin(uTime*2.6 + e1*9.0 + xz.y*0.3);
  col = mix(col, frost*mix(vec3(1.0), vec3(0.02, 0.24, 0.52), fresh), frozen) + uCore*uEdgeI*0.42*rim + uShade*uEdgeI*0.10*band*(0.8 + 0.2*sin(uTime*3.3 + e2*12.0 + xz.x*0.7));
  float al = max(uBed, max(max(frozen, max(dust, shore*0.7)), max(rim, ahead*0.7)))*vEdge;
  gl_FragColor = vec4(col, al);
  #include <fog_fragment>
}`;async function tt(a,o,d,l,s,c){const g=new t.InstancedBufferGeometry,C=[],F=[];for(let M=0;M<4;M++){const v=o.range(0,Math.PI),i=M===0?0:o.range(-.45,.45),y=M===0?0:o.range(-.45,.45),x=M===0?1:o.range(.45,.85),w=.13*x+.03,m=o.range(-.22,.22)*x,B=o.range(-.22,.22)*x,K=Math.cos(v),E=Math.sin(v);C.push(i-K*w,0,y-E*w,i+K*w,0,y+E*w,i+m,x,y+B),F.push(0,0,1),C.push(i+E*w*.6,0,y-K*w*.6,i-E*w*.6,0,y+K*w*.6,i+m,x,y+B),F.push(0,0,1)}g.setAttribute("position",new t.Float32BufferAttribute(C,3)),g.setAttribute("aK",new t.Float32BufferAttribute(F,1)),g.computeVertexNormals();const b=new Float32Array(c*4),A=new Float32Array(c*4);for(let M=0;M<c;M++){let v=0,i=0,y=!1;const x=[o(),o(),o(),o(),o(),o(),o(),o()];for(let B=0;B<4&&!y;B++){const K=x[B*2],E=x[B*2+1];if(M%16===0){const N=2.6+7*K,z=E*Math.PI*2;v=Math.cos(z)*N,i=Math.sin(z)*N}else{const N=4+Math.pow(K,1.12)*(s-6);i=-N,v=d.centre(N)+(E+x[(B*2+3)%8]+x[(B*2+5)%8]-1.5)*13}y=d.coverage(v,i)>.64&&Math.hypot(v,i)>2.4}const w=y?.5+1*x[7]*x[7]+.35*d.sample(v,i,2):0,m=.07+(.22+.95*d.sample(v,i,2)*d.sample(v,i,0))*.75;b.set([v,l(v,i)+m,i,w],M*4),A.set([x[6]*Math.PI*2,Math.hypot(v,i)+d.sample(v,i,1)*ce,x[5],0],M*4),M%400===399&&await a.yield()}return g.setAttribute("iA",new t.InstancedBufferAttribute(b,4)),g.setAttribute("iB",new t.InstancedBufferAttribute(A,4)),g.instanceCount=c,g}const ot=`
attribute vec4 iA; attribute vec4 iB; attribute float aK; uniform float uFront;
varying vec3 vN; varying vec3 vW; varying float vK; varying float vBehind; varying float vSeed;
#include <fog_pars_vertex>
void main(){
  float k = uFront - iB.y, g = clamp(k/4.5, 0.0, 1.0);
  float grow = g*g*(3.0 - 2.0*g)*(1.0 + 0.6*sin(g*3.1416)*(1.0 - g));
  float cy = cos(iB.x), sy = sin(iB.x), wd = min(grow*3.0, 1.0)*iA.w;
  vec3 q = vec3(position.x*wd, position.y*iA.w*grow, position.z*wd);
  vec3 p = iA.xyz + vec3(q.x*cy - q.z*sy, q.y, q.x*sy + q.z*cy);
  vec3 n = vec3(normal.x*cy - normal.z*sy, normal.y, normal.x*sy + normal.z*cy);
  vK = aK; vBehind = k; vSeed = iB.z;
  vec4 w = modelMatrix*vec4(p, 1.0); vW = w.xyz; vN = mat3(modelMatrix)*n;
  vec4 mvPosition = viewMatrix*w;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,at=`
uniform vec3 uKeyDir; uniform vec3 uKeyCol; uniform vec3 uFillCol; uniform vec3 uIce; uniform vec3 uShade; uniform vec3 uCore; uniform float uTime;
varying vec3 vN; varying vec3 vW; varying float vK; varying float vBehind; varying float vSeed;
#include <fog_pars_fragment>
void main(){
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0));
  vec3 V = normalize(cameraPosition - vW + vec3(0.0, 1e-4, 0.0));
  float ndl = abs(dot(N, uKeyDir));
  vec3 alb = mix(uShade*0.5, uIce*0.7, 0.3 + 0.55*vK + 0.15*vSeed);
  vec3 col = alb*(uKeyCol*(0.3 + 0.75*ndl) + uFillCol*1.2)*(0.6 + 0.4*vK);
  vec3 Hh = normalize(uKeyDir + V);
  // each blade twinkles on its own clock, and its tip flares now and then
  float tw = 0.5 + 0.5*sin(uTime*(1.6 + 3.5*vSeed) + vSeed*140.0), fl = tw*tw; fl *= fl;
  col += uIce*pow(clamp(abs(dot(N, Hh)), 0.0, 1.0), 22.0)*(0.5 + 0.9*tw);
  col += uCore*vK*(0.10 + 0.30*fl*vK + 1.25*exp(-max(vBehind, 0.0)/10.0));
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;async function rt(a,o={}){const d=a.rng.fork("brinicle-ice-finger"),l=a.quality?.detail??1,s=(o.palette&&o.palette.length>=6?o.palette:Ie).map(Fe),c=o.height??64,g=o.startLength??30,C=o.riverLength??620,F=42,b=Math.tan(18*Math.PI/180),A=o.groundAt||((e,r)=>{const f=-r-F;return f<=-8?0:-b*(f<8?(f+8)*(f+8)/32:f)}),M=(o.keyDir?o.keyDir.clone():new t.Vector3(-.56,.8,.2)).normalize(),v=new t.Group;v.name="brinicle-ice-finger";const i={uTime:{value:0},uTipY:{value:c-g},uH:{value:c},uTip:{value:new t.Vector3(0,c-g,0)},uFall:{value:15},uSplash:{value:0},uBrine:{value:1},uTouch:{value:0},uFront:{value:0},uKeyDir:{value:M.clone()},uKeyCol:{value:s[2].clone().lerp(s[3],.55).lerp(s[4],.35).multiplyScalar(1.25)},uFillCol:{value:s[1].clone().multiplyScalar(1.3).add(s[0])},uIce:{value:s[4].clone()},uShade:{value:Fe("#2AA6C8")},uCore:{value:s[3].clone()},uTeal:{value:s[1].clone()},uJade:{value:s[2].clone()},uOchre:{value:s[5].clone()},uCoreI:{value:o.coreIntensity??2.2},uEdgeI:{value:o.edgeIntensity??1.6},uCeil:{value:o.ceilingGlow??1},uBed:{value:o.bed===!1?0:1},uFrostMap:{value:null},uFrostRect:{value:new t.Vector4}},y=(...e)=>{const r=t.UniformsUtils.clone(t.UniformsLib.fog);for(const f of e)r[f]=i[f];return r},x={transparent:!0,depthWrite:!1,blending:t.CustomBlending,blendEquation:t.AddEquation,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,blendSrcAlpha:t.OneFactor,blendDstAlpha:t.OneMinusSrcAlphaFactor},w=(e,r=0)=>(e.frustumCulled=!1,e.renderOrder=r,e.matrixAutoUpdate=!1,v.add(e),e),m=await Re(a,d,C);i.uFrostMap.value=m.map,i.uFrostRect.value.copy(m.rect),await a.yield();const B=await Ke(a,d,c);w(new t.Mesh(B.geometry,new t.ShaderMaterial({uniforms:y("uTime","uTipY","uH","uKeyDir","uKeyCol","uFillCol","uIce","uShade","uCore","uCoreI"),vertexShader:Ne,fragmentShader:De,fog:!0,side:t.DoubleSide}))),await a.yield();const K=Math.round(1900*l);await a.yield(),w(new t.Mesh(Ee(d,B,c,K),new t.ShaderMaterial({uniforms:y("uTipY","uH","uKeyDir","uKeyCol","uFillCol","uIce","uShade","uCore"),vertexShader:We,fragmentShader:Le,fog:!0,side:t.DoubleSide}))),await a.yield();const E=Math.round(1100*l),N=d.fork("crater");if(o.crater!==!1){const e=Ve(a,N,c);w(new t.Mesh(e.geometry,new t.ShaderMaterial({uniforms:y("uTime","uTeal","uJade","uOchre","uCore","uKeyDir","uCeil"),vertexShader:Ge,fragmentShader:Ue,fog:!0,side:t.DoubleSide,transparent:!0,depthWrite:!1})),-2),await a.yield(),w(new t.Mesh(He(N,e,c,E),new t.ShaderMaterial({uniforms:y("uTime","uTeal","uJade","uCore","uIce","uKeyDir","uCeil"),vertexShader:Oe,fragmentShader:qe,fog:!0,side:t.DoubleSide}))),await a.yield()}const z=d.fork("river"),_=Math.round(3200*l);if(o.river!==!1){const e=await Ze(a,m,A,C),r=w(new t.Mesh(e,new t.ShaderMaterial({uniforms:y("uTime","uFront","uFrostMap","uFrostRect","uKeyDir","uKeyCol","uFillCol","uIce","uShade","uCore","uJade","uBed","uEdgeI"),vertexShader:Qe,fragmentShader:et,fog:!0,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),-1);r.material.uniforms.uFrostMap=i.uFrostMap,await a.yield();const f=await tt(a,z,m,A,C,_);await a.yield(),w(new t.Mesh(f,new t.ShaderMaterial({uniforms:y("uTime","uFront","uKeyDir","uKeyCol","uFillCol","uIce","uShade","uCore"),vertexShader:ot,fragmentShader:at,fog:!0,side:t.DoubleSide}))),await a.yield()}w(new t.Mesh(Ye(),new t.ShaderMaterial({uniforms:y("uTime","uTipY","uH","uTip","uFall","uSplash","uBrine","uCore","uIce"),vertexShader:je,fragmentShader:$e,fog:!0,side:t.DoubleSide,...x})),3);{const e=d.fork("sprites"),r=Math.round(200*l),f=Math.round(130*l),V=Math.round(170*l),Y=r+f+V,G=new Float32Array(Y*4),j=new Float32Array(Y*4);for(let S=0;S<Y;S++){const P=e(),oe=e(),Q=e(),$=e(),J=e();if(S<r)G.set([P,oe,Q,$],S*4),j.set([0,.14+.36*J*J,0,0],S*4);else if(S<r+f)G.set([P,oe,Q,$*2-1],S*4),j.set([1,.7+1.3*J,0,0],S*4);else{const X=6+P*(C-10),ae=m.centre(X)+(oe-.5)*16,re=m.centre(X)+(Q-.5)*16,ee=m.coverage(ae,-X)>m.coverage(re,-X)?ae:re,ne=m.coverage(ee,-X)>.55;G.set([ee,A(ee,-X),-X,$],S*4),j.set([2,ne?2.2+2.6*J:0,Math.hypot(ee,X)+m.sample(ee,-X,1)*ce,0],S*4)}}const R=new t.InstancedBufferGeometry;R.setAttribute("position",new t.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),R.setIndex([0,1,2,0,2,3]),R.setAttribute("iA",new t.InstancedBufferAttribute(G,4)),R.setAttribute("iB",new t.InstancedBufferAttribute(j,4)),R.instanceCount=Y,w(new t.Mesh(R,new t.ShaderMaterial({uniforms:y("uTime","uTipY","uH","uTip","uTouch","uFront","uSplash","uCore","uIce","uShade"),vertexShader:Je,fragmentShader:Xe,fog:!0,...x})),4)}await a.yield();let W=!1,H=g,O=0,q=0;const Z=e=>c-e-1.4*U(c-6,c,e),L=()=>{const e=Z(H),r=B.axisAt(Math.max(e,0));i.uTipY.value=e,i.uTip.value.set(r[0],e,r[1]),i.uFall.value=D(e+.5,.5,15),i.uSplash.value=1-U(4,15,e),i.uBrine.value=U(.1,1.6,e),i.uTouch.value=O,i.uFront.value=q};L();const T=(e,r,f)=>new t.Vector3(e,r,f),k=[T(0,c-16,128),T(0,c-16,64),T(7,c-16,30)];for(let e=0;e<=10;e++){const r=e/10,f=r*Math.PI*2.5;k.push(T(Math.cos(f)*17,ie(c-16,c-46,r),-Math.sin(f)*17))}for(let e=1;e<=4;e++){const r=e/4,f=Math.PI*(2.5+r),V=ie(17,11,r);k.push(T(Math.cos(f)*V,ie(c-46,6,r),-Math.sin(f)*V))}k.push(T(-7,5.6,6),T(-9,5.2,-2),T(-6,A(-6,-30)+4.8,-30));for(let e=70;e<=C-20;e+=50){const r=m.centre(e)*.7;k.push(T(r,A(r,-e)+4.8,-e))}let p=-.6,u=1e9;for(let e=0;e<12;e++){const r=-.15-e*.1;let f=0;for(let V=-1;V<=1;V++)f+=m.coverage(Math.cos(r+V*.12)*8,Math.sin(r+V*.12)*8);f<u&&(u=f,p=r)}const n=C-18,h=m.centre(n),I={root:T(0,c,0),touchdown:T(0,0,0),starHuddle:T(Math.cos(p)*8,A(Math.cos(p)*8,Math.sin(p)*8),Math.sin(p)*8),flyThrough:k,viewpoints:{entry:T(0,c-16,128),shaft:T(17,c-30,0),tip:T(0,14,-13),touchdown:T(0,6,11),chase:T(m.centre(120)*.7,A(0,-120)+4.8,-120)},portalSeat:{position:T(h,A(h,-n)+3,-n),normal:T(0,A(h,-n+1)-A(h,-n-1),2).normalize(),radius:7},keyDir:M.clone()};return{object:v,radius:Pe,height:c,center:new t.Vector3(0,c*_e,0),anchors:I,ground:!1,groundY:0,frost:{map:m.map,rect:m.rect,glsl:pe,uniforms:{uFrostMap:i.uFrostMap,uFrostRect:i.uFrostRect,uFront:i.uFront},arrive:m.arrive,coverage:m.coverage,centre:m.centre,lagMetres:ce},uniforms:i,groundAt:A,startLength:g,setLength(e){W=!0,H=D(e,1,c)},setProgress(e){W=!0,H=ie(g,c,D(e,0,1))},setTouch(e){W=!0,O=D(e,0,1)},setFront(e){W=!0,q=Math.max(0,e)},setLight(e,r){i.uKeyDir.value.copy(e).normalize(),r&&i.uKeyCol.value.copy(r)},tipPosition(e=new t.Vector3){const r=Math.max(Z(H),0),f=B.axisAt(r);return e.set(f[0],r,f[1])},update(e,r){if(i.uTime.value=r,!W){const f=r%44;H=ie(g,c,U(0,16,f)*.4+D(f/16,0,1)*.6),O=D((f-16)/2.2,0,1),q=f<16?0:Math.min(C+60,9*(f-16)+1.6*(f-16)*(f-16))}L()},dispose(){}}}export{rt as buildHero};
