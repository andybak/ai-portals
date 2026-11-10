import*as n from"three";import{clamp as ae,lerp as ue,smoothstep as ee}from"../kit/core.js";const ge=["#1A2130","#2A3152","#56607A","#9AA6BC","#F2A53A","#F5F1E6","#E5432F"],W=20,re=-20,Q=-46,de=-45,ne=2.5,te=12,pe=-3,E=new n.Vector3(0,388,-84),T=new n.Vector3(0,-20,-55);function K(t,e){return e>re?Math.hypot(t,e-re)-W:Math.max(Math.abs(t)-W,Q-e)}const oe=t=>15+19*(1-ee(18,75,t)),we=(t,e)=>-.7*(1-ee(0,12,K(t,e)));function me(t,e){if(e<-64)return t<36?11:ne;if(e<Q)return t<-36?11:t>36?ne:pe;const o=oe(e);return t<-o-4?11:pe+(ne-pe)*ee(o-3,o+5,t)}function ve(t){const e=re-Q,o=Math.PI*W,l=e*2+o,y=[];for(let p=0;p<=t;p++){const v=p/t*l;let c,f,h,u;if(v<e)c=-W,f=Q+v,h=1,u=0;else if(v<e+o){const i=Math.PI-(v-e)/W;c=W*Math.cos(i),f=re+W*Math.sin(i),h=-Math.cos(i),u=-Math.sin(i)}else c=W,f=re-(v-e-o),h=-1,u=0;y.push({x:c,z:f,nx:h,nz:u,s:p/t})}return y}function H(t,e,o,l){const y=new n.BoxGeometry(t,e,o,3,3,3),p=y.attributes.position,v=y.attributes.normal,c=t/2,f=e/2,h=o/2;l=Math.min(l,c*.9,f*.9,h*.9);const u=(b,w)=>Math.abs(b)>w*.5?Math.sign(b)*w:Math.sign(b)*(w-l),i=new n.Vector3,s=new n.Vector3;for(let b=0;b<p.count;b++)i.set(u(p.getX(b),c),u(p.getY(b),f),u(p.getZ(b),h)),s.set(ae(i.x,-c+l,c-l),ae(i.y,-f+l,f-l),ae(i.z,-h+l,h-l)),i.sub(s),i.lengthSq()>1e-9&&(i.normalize(),v.setXYZ(b,i.x,i.y,i.z),p.setXYZ(b,s.x+i.x*l,s.y+i.y*l,s.z+i.z*l));return y}function ce(){const t=new n.SphereGeometry(1,10,5,0,Math.PI*2,0,Math.PI/2),e=t.attributes.position;for(let o=0;o<e.count;o++){let l=e.getX(o),y=e.getY(o),p=e.getZ(o);const v=Math.hypot(l,p);if(v>1e-5){const c=v/Math.pow(Math.pow(Math.abs(l),4)+Math.pow(Math.abs(p),4),.25);l*=c,p*=c}e.setXYZ(o,l*.5,Math.pow(Math.max(y,0),.55),p*.5)}return t.computeVertexNormals(),t}function fe(t,e=40,o=[.5,.9,1]){const l=[],p=[];for(let i=0;i<e;i++)p.push(t());for(let i=0;i<e;i++){const s=i/e*Math.PI*2,b=(s/(Math.PI*2)*5+.5)%1,w=Math.pow(Math.abs(Math.cos(b*Math.PI)),.7),C=.55+.45*Math.cos(s-Math.PI/2)*.5+.2,P=(.2+.32*w+.05*Math.sin(s*17))*C*(.9+.2*p[i]);l.push(new n.Vector2(Math.cos(s)*P,Math.sin(s)*P))}const v=[0,0,0],c=[0,0],f=[],h=o.length;for(let i=0;i<e;i++){const s=l[i],b=Math.atan2(s.y,s.x),w=Math.pow(Math.abs(Math.cos(((b/(Math.PI*2)+1)*5+.5)%1*Math.PI)),.7),C=Math.max(0,Math.sin(b*1.5+.9))*w*w;for(let P=0;P<h;P++){const x=o[P],F=s.x*x,g=-s.y*x;v.push(F,.2*(F*F+g*g)+.02*Math.sin(F*9+g*7)*x+.2*C*x*x*x-(P===h-1?.008*(1-C):0),g),c.push(x,C)}}for(let i=0;i<e;i++){const s=1+i*h,b=1+(i+1)%e*h;f.push(0,s,b);for(let w=0;w<h-1;w++)f.push(s+w,s+w+1,b+w,b+w,s+w+1,b+w+1)}const u=new n.BufferGeometry;return u.setAttribute("position",new n.Float32BufferAttribute(v,3)),u.setAttribute("uv",new n.Float32BufferAttribute(c,2)),u.setIndex(f),u.computeVertexNormals(),u}function be(){let t=3e5,e=0,o=new Float32Array(t*3),l=new Float32Array(t*3),y=new Float32Array(t*3),p=new Float32Array(t);const v=()=>{t*=2;const s=(b,w)=>{const C=new Float32Array(t*w);return C.set(b),C};o=s(o,3),l=s(l,3),y=s(y,3),p=s(p,1)},c=(s,b,w,C,P,x,F,g,d,z)=>{e>=t&&v();const M=e*3;o[M]=s,o[M+1]=b,o[M+2]=w,l[M]=C,l[M+1]=P,l[M+2]=x,y[M]=F,y[M+1]=g,y[M+2]=d,p[e++]=z},f=new n.Vector3,h=new n.Vector3,u=new n.Matrix3,i={add(s,b,w,C,P={}){const x=s.attributes.position,F=s.attributes.normal,g=s.index;u.getNormalMatrix(b);const d=b.determinant()<0!=!!P.inside,z=g?g.count:x.count,M=typeof w=="function",r=a=>{const S=g?g.getX(a):a;f.fromBufferAttribute(x,S).applyMatrix4(b),h.fromBufferAttribute(F,S).applyMatrix3(u).normalize(),P.inside&&h.negate();const m=P.shade?P.shade(f.x,f.y,f.z):1,k=M?w(f):w;c(f.x,f.y,f.z,h.x,h.y,h.z,k.r*m,k.g*m,k.b*m,C)};for(let a=0;a<z;a+=3)r(a),d?(r(a+2),r(a+1)):(r(a+1),r(a+2));P.double&&i.add(s,b,w,C,{shade:P.shade,inside:!P.inside})},quad(s,b,w,C,P,x,F){const g=b[0]-s[0],d=b[1]-s[1],z=b[2]-s[2],M=w[0]-s[0],r=w[1]-s[1],a=w[2]-s[2],S=(d*a-z*r)*P[0]+(z*M-g*a)*P[1]+(g*r-d*M)*P[2]<0;for(const m of S?[s,w,b,s,C,w]:[s,b,w,s,w,C])c(m[0],m[1],m[2],P[0],P[1],P[2],x.r,x.g,x.b,F)},build(){const s=new n.BufferGeometry;return s.setAttribute("position",new n.BufferAttribute(o.slice(0,e*3),3)),s.setAttribute("normal",new n.BufferAttribute(l.slice(0,e*3),3)),s.setAttribute("color",new n.BufferAttribute(y.slice(0,e*3),3)),s.setAttribute("aRough",new n.BufferAttribute(p.slice(0,e),1)),s}};return i}const Se=new n.Matrix4,ye=new n.Quaternion,xe=new n.Euler,Le=new n.Vector3,Pe=new n.Vector3;function R(t,e,o,l=0,y=0,p=0,v=1,c=v,f=v){return Se.compose(Le.set(t,e,o),ye.setFromEuler(xe.set(l,y,p,"YXZ")),Pe.set(v,c,f)).clone()}const I=`
uniform vec3 uCamL; uniform vec3 uLampPos; uniform vec3 uLampCol; uniform vec3 uPortalPos; uniform vec3 uPortalCol;
uniform float uTime; uniform float uProg; uniform vec3 uShopP; uniform vec3 uShopC;      // (polish 2) the corner shop's window light, set by the world
// smoothstep that is also defined for reversed edges
float pbSq(float x){ return x * x; }
float pbSS(float a, float b, float x){ float t = clamp((x - a) / (b - a), 0.0, 1.0); return t * t * (3.0 - 2.0 * t); }
float pbHash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float pbNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(pbHash(i), pbHash(i+vec2(1,0)), f.x), mix(pbHash(i+vec2(0,1)), pbHash(i+vec2(1,1)), f.x), f.y); }
float pbFbm(vec2 p){ return 0.6*pbNoise(p) + 0.3*pbNoise(p*2.13+7.1) + 0.1*pbNoise(p*4.7+3.3); }
float pbSdU(vec2 p){ return p.y > -20.0 ? length(p - vec2(0.0,-20.0)) - 20.0 : max(abs(p.x) - 20.0, -46.0 - p.y); }
float pbChan(float z){ return 15.0 + 19.0 * (1.0 - pbSS(18.0, 75.0, z)); }
// lamp light reaching a point: distance falloff, and inside the chamber only what comes down through the horseshoe
float pbLampVis(vec3 p, vec3 L){
  float inPit = pbSS(-1.5, -5.0, p.y);
  vec3 q = p + L * ((-2.0 - p.y) / max(L.y, 0.05));
  float open = 1.0 - pbSS(-3.0, 2.5, pbSdU(q.xz));
  return mix(1.0, open, inPit);
}
float pbLampAtt(float d){ float k = d / 430.0; return 1.0 / (1.0 + k*k*k*k); }
`;function Me(t,e){const o=[],l=[],y=e.length;for(const u of t)for(const[i,s]of e)o.push(u.x-u.nx*i,s,u.z-u.nz*i);for(let u=0;u<t.length-1;u++)for(let i=0;i<y-1;i++){const s=u*y+i,b=s+y;l.push(s,b,s+1,b,b+1,s+1)}const p=new n.Vector3(o[0],o[1],o[2]),v=new n.Vector3(o[y*3],o[y*3+1],o[y*3+2]),c=new n.Vector3(o[3],o[4],o[5]),f=v.sub(p).cross(c.sub(p));if(f.x*t[0].nx+f.z*t[0].nz<0)for(let u=0;u<l.length;u+=3){const i=l[u+1];l[u+1]=l[u+2],l[u+2]=i}const h=new n.BufferGeometry;return h.setAttribute("position",new n.Float32BufferAttribute(o,3)),h.setIndex(l),h.computeVertexNormals(),h}function Ce(t,e,o,l){const y=t.attributes.position,p=t.attributes.normal;for(let v=0;v<y.count;v++){const c=o+y.getX(v)/e,f=e+y.getY(v),h=Math.sin(c),u=Math.cos(c),i=p.getX(v),s=p.getY(v);y.setXYZ(v,T.x+f*h,T.y+f*u,l+y.getZ(v)),p.setXYZ(v,i*u+s*h,-i*h+s*u,p.getZ(v))}return t}async function ze(t,e,o,l,y,p){const v=new n.Matrix4,c=new n.Color,f=-126,h=-126,u=4,i=63,s=68,b=[],w=[];await y();for(let r=0;r<=s;r++){r%23===22&&await y();for(let a=0;a<=i;a++){const S=f+a*u,m=h+r*u;b.push(S,me(S,m)+o.n2(S*.09,m*.09)*.35,m)}}for(let r=0;r<s;r++)for(let a=0;a<i;a++){const S=f+(a+.5)*u,m=h+(r+.5)*u;if(K(S,m)<2)continue;const k=r*(i+1)+a,B=k+1,U=k+i+1,A=U+1;w.push(k,U,B,B,U,A)}await y();const C=new n.BufferGeometry;C.setAttribute("position",new n.Float32BufferAttribute(b,3)),C.setIndex(w),await y(),C.computeVertexNormals(),await y();const P=r=>{const a=ee(-.15,.45,o.fbm2(r.x*.035,r.z*.035,3))*(r.y>0?1:.35);return c.copy(l.dirt).lerp(l.moss,a*l.mossAmt)};for(let r=0,a=Math.ceil(w.length/12)*3;r<w.length;r+=a){const S=new n.BufferGeometry;S.setAttribute("position",C.attributes.position),S.setAttribute("normal",C.attributes.normal),S.setIndex(w.slice(r,r+a)),t.add(S,v,P,.75),await y()}for(let r=-36;r<36;r+=2)for(let a=-56;a<8;a+=2)K(r+1,a+1)<1||t.quad([r,-6,a],[r+2,-6,a],[r+2,-6,a+2],[r,-6,a+2],[0,-1,0],l.mortar,.7);if(l.apron){const a=l.dirt.clone().multiplyScalar(1.5),S=l.flag.clone().multiplyScalar(.8),m=[0,1,0];t.quad([126,2.4,-1500],[126,2.4,1500],[1500,2.4,1500],[1500,2.4,-1500],m,a,.4),t.quad([36,2.4,146],[36,2.4,1500],[126,2.4,1500],[126,2.4,146],m,a,.4),t.quad([36,2.4,-1500],[36,2.4,-126],[126,2.4,-126],[126,2.4,-1500],m,a,.4),t.quad([-15,0,146],[-15,0,1500],[36,0,1500],[36,0,146],m,l.dirt,.2),t.quad([-1500,11.6,-1500],[-1500,11.6,1500],[-126,11.6,1500],[-126,11.6,-1500],m,S,.45),t.quad([-126,11.6,146],[-126,11.6,1500],[-15,11.6,1500],[-15,11.6,146],m,S,.45),t.quad([-126,11.6,-1500],[-126,11.6,-126],[36,11.6,-126],[36,11.6,-1500],m,S,.45),t.quad([-15,11.6,146],[-15,11.6,1500],[-15,-3,1500],[-15,-3,146],[1,0,0],S,.45),t.quad([36,11.6,-126],[36,11.6,-1500],[36,2.4,-1500],[36,2.4,-126],[1,0,0],S,.45)}await y();const x=ce(),F=10.6;for(let r=0,a=-122;a<146;a+=F,r++){r%4===0&&await y();for(let S=12+r%2*F*.5;S<124;S+=F){const m=S+e.range(-.5,.5),k=a+e.range(-.5,.5);if(k<Q?m<42:m<oe(k)+1.5)continue;const B=me(m,k),U=e.range(9,10.1),A=e();c.copy(l.cobble).lerp(A<.5?l.violet:l.pale,e.range(0,.28)).multiplyScalar(e.range(.75,1.15)),t.add(x,R(m,B-1.3,k,e.range(-.05,.05),e.range(-.12,.12),e.range(-.05,.05),U,e.range(3,3.6),U*e.range(.94,1.04)),c.clone(),e.range(.28,.5))}}await y();const g=(r,a,S,m,k)=>{c.copy(l.granite).multiplyScalar(e.range(.82,1.15)),t.add(H(m,15.6,k,1.3),R(r,te-7.8+e.range(-.25,.1),a,e.range(-.012,.012),S,e.range(-.01,.01)),c.clone(),2+e.range(.4,.6),{shade:(B,U)=>.72+.28*ee(-1,6,U)})};for(let r=146;r>Q+4;){const a=Math.min(e.range(34,50),r-Q+1),S=r-a/2,m=oe(r),k=oe(r-a),B=Math.atan2(k-m,a);g(-(m+k)/2-6.4,S,Math.PI/2+B,a-.9,12),r-=a}for(let r=-64.5;r>-126;){const a=Math.min(e.range(30,44),r+127);g(30,r-a/2,Math.PI/2,a-.9,12),r-=a}await y();const d=(r,a,S,m)=>{c.copy(l.flag).lerp(l.pale,e.range(0,.2)).multiplyScalar(e.range(.8,1.12)),t.add(H(a-r-.9,2.2,m-S-.9,.5),R((r+a)/2,te-1.1+e.range(-.25,.12),(S+m)/2,e.range(-.006,.006),0,e.range(-.006,.006)),c.clone(),e.range(.3,.55))};for(let r=-126;r<146;r+=34){const a=Math.min(r+34,146);let S;a<=-64?S=24:r<Q?S=-37.5:S=-Math.max(oe(r),oe(a))-12.6,r<-64&&a>-64?(z(r,-64,24),z(-64,a,-37.5)):z(r,a,S)}function z(r,a,S){for(let m=S;m>-126;){const k=Math.min(e.range(26,44),m+126.5);k>4&&d(m-k,m,r,a),m-=k}}const M=e.int(4,9);for(let r=0;r<M;r++){const a=e.chance(.6),S=a?e.range(46,110):e.range(-110,-52),m=e.range(-110,130),k=e.range(13,19);c.copy(l.leaf).multiplyScalar(e.range(.7,1.2)),t.add(fe(p,20,[.88,1]),R(S,a?ne+2.15:te+.25,m,e.range(-.08,.08),e.range(0,6.28),e.range(-.08,.08),k,k*.5,k),c.clone(),.42,{double:!0})}c.copy(l.leaf).multiplyScalar(1.1),t.add(fe(p,20,[.88,1]),R(e.range(-26,26),te+.3,-57,.03,e.range(0,6.28),.05,16,8,16),c.clone(),.4,{double:!0})}async function ke(t,e,o,l){const y=new n.Matrix4,p=new n.Color;t.add(Me(ve(72),[[-.7,-7.6],[-.7,-2.4],[-.25,-1.75],[.6,-1.45],[4.6,-1.45],[5.3,-1.95],[5.3,-3.6]]),y,o.iron,.3);const v=14,c=4.5,f=7,h=14.7,u=5.2,i=new Map,s=g=>{const d=Math.round(g*4);return i.has(d)||i.set(d,H(d/4,c,f,.55)),i.get(d)},b=(g,d,z,M,r,a,S)=>{const m=Math.hypot(z-g,M-d),k=(z-g)/m,B=(M-d)/m,U=Math.atan2(-B,k);for(let A=1;A<9;A++){const le=-52.8+u*(A+.5);for(let L=-(A%2*h)/2;L<m;L+=h){const N=Math.max(L,0),_=Math.min(L+v,m),V=_-N;if(V<2.5||e.chance(.025))continue;const q=(N+_)/2,X=g+k*q,Z=d+B*q;if(S){const D=ae(T.x,X-V/2,X+V/2),G=ae(T.y,le-c/2,le+c/2);if(Math.hypot(D-T.x,G-T.y)<15.7)continue}const Y=e.chance(.07)?e.range(.8,1.6):e.range(-.35,.35);p.copy(o.brick).lerp(o.brick2,e()).multiplyScalar(e.range(.7,1.2)),e.chance(.12)&&p.lerp(o.moss,.5),t.add(s(V),R(X-r*(f/2-Y),le+e.range(-.15,.15),Z-a*(f/2-Y),e.range(-.015,.015),U+e.range(-.012,.012),e.range(-.012,.012)),p.clone(),e.range(.22,.5))}}};await l(),b(-35,-55,35,-55,0,1,!0),await l(),b(35,-55,35,6,-1,0,!1),await l(),b(35,6,-35,6,0,-1,!1),await l(),b(-35,6,-35,-55,1,0,!1),await l(),t.quad([35.9,-53,-55],[35.9,-53,6],[35.9,-6,6],[35.9,-6,-55],[-1,0,0],o.mortar,.8),t.quad([-35.9,-53,-55],[-35.9,-53,6],[-35.9,-6,6],[-35.9,-6,-55],[1,0,0],o.mortar,.8),t.quad([-36,-53,6.9],[36,-53,6.9],[36,-6,6.9],[-36,-6,6.9],[0,0,-1],o.mortar,.8);for(let g=-36;g<36;g+=3)for(let d=-54;d<-6;d+=3)Math.hypot(g+1.5-T.x,d+1.5-T.y)<9.5||t.quad([g,d,-55.7],[g+3,d,-55.7],[g+3,d+3,-55.7],[g,d+3,-55.7],[0,0,1],o.mortar,.8);const w=(g,d,z,M,r)=>{const a=(d+z)/2,S=Math.PI*2*a/g-.55;for(let m=0;m<g;m++){p.copy(o.brick2).lerp(o.pale,e.range(.05,.3)).multiplyScalar(e.range(.8,1.25));const k=Ce(H(S,z-d,8,.5),a,r+m/g*Math.PI*2,M-4+e.range(-.3,.3));t.add(k,y,p.clone(),e.range(.16,.3))}};await l(),w(14,7.1,11.3,-53.3,e.range(0,.4)),w(18,11.8,15.4,-54.2,e.range(0,.3)),await l();const C=new n.CylinderGeometry(7.15,7.15,40,28,8,!0);t.add(C,R(0,T.y,-76,Math.PI/2,0,0),g=>{const d=Math.sin(Math.floor(g.z/5)*12.9898+Math.floor(Math.atan2(g.y-T.y,g.x)*2.2)*78.233)*43758.5453;return p.copy(o.brick).multiplyScalar(.6+.5*(d-Math.floor(d)))},.3,{inside:!0});const P=e.chance(.5)?1:-1,x=new n.TorusGeometry(3.4,.55,6,12,Math.PI),F=new n.Matrix4;for(let g=0;g<5;g++)F.makeBasis(new n.Vector3(1,0,0),new n.Vector3(0,0,1),new n.Vector3(0,-1,0)).setPosition(P*26,-10.5-g*7.6,-55.2),t.add(x,F,o.rust,.35);return P}function Ae(t,e,o){const l=new n.Color,y=ce(),p=()=>l.copy(o.iron).lerp(o.rust,e.range(0,.35)).multiplyScalar(e.range(.85,1.2)).clone();t.add(H(75,4.2,21,1.1),R(0,9.9,-56.2),p(),.3),t.add(H(73,15.8,2.6,.7),R(0,.3,-47.1),p(),.28),t.add(H(72,14,9.5,.8),R(0,1,-61),p(),.4);for(const f of[-1,1])t.add(H(3.4,17.5,21,.9),R(f*36.6,3.4,-56.2),p(),.32);const v=e.int(4,7);for(const f of[-1,1])for(let h=0;h<v;h++){const u=f*(14.5+(h+.5)*(19.5/v));t.add(H(1.7,12.5,1.5,.45),R(u,1.6,-45.5),p(),.26)}t.add(H(23,7.4,1.3,.45),R(0,3.9,-45.6),p(),.24);const c=e.int(2,3);for(let f=0;f<c;f++)t.add(H(e.range(11,18),.9,.7,.25),R(e.range(-1.5,1.5),2.2+f*(3.4/Math.max(c-1,1)),-44.85),p(),.2);for(const f of[-1,1])for(const h of[0,1])t.add(y,R(f*10.2,1.3+h*5.2,-45,Math.PI/2,0,0,1.3,.7,1.3),p(),.2);for(let f=0;f<3;f++)for(let h=0;h<13;h++){const u=-30+h*5+f%2*2.5;t.add(H(3.6,.7,.9,.25),R(u,12.2,-50.5-f*4.6,0,(f%2?1:-1)*.6,0),p(),.25)}for(const f of[-1,1])for(const h of[-48.5,-64])t.add(y,R(f*34,12,h,0,0,0,2.2,1,2.2),p(),.2)}function Fe(t,e,o,l){const y=new n.Color,p=E.x,v=E.z,c=te,f=()=>y.copy(o.iron).lerp(o.rust,e.range(0,.2)).multiplyScalar(e.range(.9,1.15)).clone(),h=(d,z,M,r,a,S)=>t.add(new n.CylinderGeometry(d,z,M,r,1),R(p,a+M/2,v,0,S||0,0),f(),.3),u=(d,z,M)=>t.add(new n.TorusGeometry(d,z,8,20),R(p,M,v,Math.PI/2,0,0),f(),.25);h(16.5,18.5,2.5,8,c-.5,Math.PI/8),h(15,16.5,8,8,c+2,Math.PI/8),u(14.2,1.3,c+10.4),h(11,13.2,13,8,c+10,Math.PI/8),u(11,1.7,c+23.5),h(7.6,9.6,40,16,c+23),u(8,1.5,c+63.5),u(7.2,.9,c+67);const i=283,s=new n.CylinderGeometry(4.3,7,i,32,14,!0),b=s.attributes.position;for(let d=0;d<b.count;d++){const z=b.getX(d),M=b.getZ(d),r=Math.atan2(M,z),a=1-.075*Math.pow(Math.abs(Math.cos(r*4)),.6);b.setX(d,z*a),b.setZ(d,M*a)}s.computeVertexNormals(),t.add(s,R(p,c+63+i/2,v),f(),.3),u(6.2,.9,c+140),u(5.3,1.1,c+296),u(5,.7,c+300),t.add(H(46,2.2,2.2,.7),R(p,c+312,v),f(),.3);for(const d of[-1,1])t.add(new n.SphereGeometry(2.3,10,8),R(p+d*23.5,c+312,v),f(),.25);const w=c+346,C=Math.PI/l;h(9,4.3,10,16,w),u(9,1,w+10),h(10.5,10.5,2.6,l,w+10.5,C);const P=w+13,x=P+30,F=9,g=15.5;for(let d=0;d<l;d++){const z=C+d/l*Math.PI*2,M=Math.sin(z),r=Math.cos(z),a=Math.hypot(x-P,g-F),S=Math.atan2(g-F,x-P),m=new n.Matrix4().makeRotationY(z).multiply(new n.Matrix4().makeTranslation(0,(P+x)/2,(F+g)/2)).multiply(new n.Matrix4().makeRotationX(S));m.premultiply(new n.Matrix4().makeTranslation(p,0,v)),t.add(H(1.3,a,1.3,.35),m,f(),.3)}return h(17.5,16.5,1.8,l,x,C),t.add(new n.ConeGeometry(17.5,14,l,1),R(p,x+1.8+7,v,0,C,0),f(),.3),h(3.5,5.5,3,10,x+14.5),t.add(new n.SphereGeometry(2.8,12,8),R(p,x+19.5,v),f(),.22),t.add(new n.ConeGeometry(1.1,9,8,1),R(p,x+26,v),f(),.25),{yb:P,yt:x,rb:F,rt:g,rot:C}}function Ne(t){const e=new n.MeshStandardMaterial({vertexColors:!0,roughness:1,metalness:0});return e.onBeforeCompile=o=>{Object.assign(o.uniforms,t),o.vertexShader=o.vertexShader.replace("#include <common>",`#include <common>
attribute float aRough; varying float vRough; varying vec3 vLp; varying vec3 vLn;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vLp = position; vLn = normal; vRough = aRough;`),o.fragmentShader=o.fragmentShader.replace("#include <common>",`#include <common>
varying float vRough; varying vec3 vLp; varying vec3 vLn; uniform vec3 uSkyHi;
`+I).replace("#include <color_fragment>",`#include <color_fragment>
        float pbM = pbFbm(vLp.xz * 0.9 + vLp.y * 0.7) ;
        float pbG = pbNoise(vLp.xz * 6.0 + vLp.yy * 5.0);
        diffuseColor.rgb *= (0.72 + 0.5 * pbM) * (0.9 + 0.2 * pbG);
        // (polish 3) kerb stones (aRough 2..3): speckled granite, drip streaks down the face, a rain-glazed top
        float pbStone = step(1.5, vRough), pbRr = vRough - 2.0 * pbStone; vec3 pbThrown = vec3(0.0);
        if (pbStone > 0.5) {
          vec3 pbSn = normalize(vLn);
          float pf1 = pbNoise(vLp.xz * 7.0 + vLp.y * 5.3), pf2 = pbNoise(vLp.zx * 13.0 - vLp.y * 9.1 + 31.0), pmt = pbFbm(vLp.xz * 0.22 + vLp.y * 0.31);
          float pface = 1.0 - smoothstep(0.3, 0.7, abs(pbSn.y)), pal = vLp.z + vLp.x * 0.35;
          float pdrip = pbSS(0.56, 0.8, pbNoise(vec2(pal * 0.5, 2.7))) * pbSS(0.2, 0.6, pbNoise(vec2(pal * 0.5 + 40.0, vLp.y * 0.1))) * pface;
          diffuseColor.rgb *= (0.7 + 0.62 * pmt) * (1.0 - 0.55 * pbSS(0.64, 0.8, pf1)) * (1.0 + 1.1 * pbSS(0.68, 0.86, pf2));
          diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(0.42, 0.45, 0.55), pdrip * 0.85);
          pbRr *= mix(1.0, 0.25, max(pdrip, (1.0 - pface) * (0.5 + 0.5 * pmt)));
          // (repair 2) the same kerb as up the street: the basin's lit water throws a slow rippling net of lamp
          // light up the face (strongest at the waterline), the tooled face has a darker soaked foot, and the
          // rounded arris along the top carries a wet amber line; so the kerb is never one dark tone
          float phw = vLp.y, ptool = pbFbm(vec2(pal * 1.3, vLp.y * 0.7 + 9.0));
          float pn1 = pbNoise(vec2(pal * 0.42 + uTime * 0.45, vLp.y * 0.5 - uTime * 0.3)), pn2 = pbNoise(vec2(pal * 0.3 - uTime * 0.35 + 17.0, vLp.y * 0.36 + uTime * 0.2));
          float pnet = pbSS(0.1, 0.0, abs(pn1 - pn2)) + 0.4 * pbSS(0.07, 0.0, abs(pn1 + pn2 - 1.0));
          float preach = pface * pbSS(10.0, 0.4, phw) * pbSS(-0.6, 0.6, phw);
          diffuseColor.rgb *= (0.88 + 0.24 * ptool) * mix(1.0, 0.62, pface * pbSS(2.6, 0.2, phw + 1.2 * (pmt - 0.5)));
          pbThrown = uLampCol * pbLampAtt(distance(uLampPos, vLp)) * (diffuseColor.rgb * preach * (0.5 + 0.8 * pnet * preach)
            + 0.42 * pbSS(0.3, 0.55, pbSn.y) * pbSS(0.97, 0.8, pbSn.y) * pbSS(-1.0, 1.0, phw) * (0.5 + 0.8 * pf2));
        }`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
        roughnessFactor = clamp(pbRr * (0.6 + 0.9 * pbM), 0.08, 1.0);`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        {
          vec3 pN = normalize(vLn); vec3 pV = normalize(uCamL - vLp);
          float pR = clamp(pbRr * (0.6 + 0.9 * pbM), 0.08, 1.0);
          float pSp = mix(260.0, 10.0, sqrt(pR)); float pSk = (1.0 - pR) * (1.0 - pR) * 3.2;
          vec3 pAcc = vec3(0.0);
          // street lamp
          vec3 pL = uLampPos - vLp; float pd = length(pL); pL /= pd;
          float pvis = pbLampVis(vLp, pL) * pbLampAtt(pd);
          float pnl = max(dot(pN, pL), 0.0);
          vec3 pH = normalize(pL + pV);
          pAcc += uLampCol * pvis * (diffuseColor.rgb * pnl + pow(max(dot(pN, pH), 0.0), pSp) * pSk * step(0.0, pnl));
          // light spilling from the culvert, and amber bounce off the mist inside the chamber
          vec3 pP = uPortalPos - vLp; float pq = length(pP); pP /= pq;
          float patt = 1.0 / (1.0 + pq * pq / 240.0) * pbSS(1.0, -4.0, vLp.y);
          float pnp = max(dot(pN, pP) * 0.75 + 0.25, 0.0);
          vec3 pH2 = normalize(pP + pV);
          pAcc += uPortalCol * patt * (diffuseColor.rgb * pnp + pow(max(dot(pN, pH2), 0.0), pSp) * pSk * 0.8);
          float pit = pbSS(-3.0, -9.0, vLp.y);
          float pIn = pbSS(24.0, 4.0, uCamL.z) * pbSS(12.0, 5.5, uCamL.y);
          pAcc += uLampCol * diffuseColor.rgb * pit * (0.02 + 0.05 * pbSS(-48.0, -8.0, vLp.y)) * (0.8 + 0.4 * pbNoise(vLp.xy * 0.2 + uTime * 0.25)) * (1.0 - 0.6 * pIn);
          pAcc += uSkyHi * diffuseColor.rgb * pit * pIn * 0.55;
          // (repair 3) the mouth glows: the lit steam in the shaft throws its amber up onto the wet iron and stone
          // that stand round the opening (the hood's fascia and ribs, the rim, the kerb's return, the lamp's foot)
          vec3 pG = vec3(0.0, -5.0, -22.0) - vLp; float pgd = length(pG); pG /= pgd;
          float pgl = pbSS(-9.0, -2.5, vLp.y) / (1.0 + pgd * pgd / 1100.0) * (0.85 + 0.3 * pbNoise(vec2(vLp.x * 0.15 + uTime * 0.3, vLp.y * 0.2 - uTime * 0.5)));
          pAcc += (uPortalCol * 0.3 + uLampCol * 0.34) * pgl * (diffuseColor.rgb + 0.03 * (1.0 - pR)) * max(dot(pN, pG) * 0.75 + 0.25, 0.0) * 1.6;
          // (repair 3) the lamp's amber pooled on the wet road and the flags round its foot: a wet stone gives back a
          // broad soft share of the lamp over it, not only the one glint
          float pPool = exp(-(pbSq(vLp.x - 10.0) + pbSq(vLp.z + 70.0)) / 22500.0) * pbSS(0.45, 0.85, pN.y) * pbSS(-1.0, 1.5, vLp.y);
          pAcc += uLampCol * pPool * 0.05 * (1.0 - pR) * (0.5 + pbM);
          // the corner shop's window, up the street on the pavement side (zero unless the world sets it)
          vec3 pS = uShopP - vLp; float psd = length(pS); pS /= max(psd, 1e-3);
          float psk = psd / 300.0, psn = max(dot(pN, pS), 0.0);
          pAcc += uShopC / (1.0 + psk * psk * psk * psk) * pbSS(-4.0, 1.0, vLp.y) * (diffuseColor.rgb * psn + pow(max(dot(pN, normalize(pS + pV)), 0.0), pSp) * pSk * step(0.0, psn));
          totalEmissiveRadiance += pAcc + pbThrown;
        }`)},e}const ie=`#include <common>
#include <fog_pars_vertex>
`,J=`#include <common>
#include <fog_pars_fragment>
`,Ve=ie+I+`
varying vec3 vLp;
void main(){
  vec3 p = position; float sd = pbSdU(p.xz);
  float near = 1.0 - pbSS(0.0, 12.0, sd);
  p.y = -0.7 * near + sin(sd * 1.1 - uTime * 5.0) * 0.13 * near * pbSS(-1.0, 3.0, sd)
      + (pbNoise(p.xz * 0.11 + vec2(0.0, uTime * 0.9)) - 0.5) * 0.55 * (1.0 - near);
  vLp = p;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Re=J+I+`
uniform vec3 uSkyLo; uniform vec3 uSkyHi; uniform vec3 uDeep; uniform vec3 uCream;
uniform vec3 uHull[3]; uniform vec3 uHullD[3];      // (polish 3) floating hulls: (x, z, half width), (cos yaw, -sin yaw, width / length)
uniform float uSwirl;
varying vec3 vLp;
vec2 pbFlow(vec2 p, float sd, out float spd){
  vec2 e = vec2(0.6, 0.0);
  vec2 g = normalize(vec2(pbSdU(p + e.xy) - pbSdU(p - e.xy), pbSdU(p + e.yx) - pbSdU(p - e.yx)) + 1e-4);
  float k = 1.0 - pbSS(3.0, 42.0, sd);
  spd = 10.0 + 24.0 * (1.0 - pbSS(0.0, 30.0, sd));
  // (repair 3) the water does not run straight at the rim: it turns as it is drawn in (which way round is the seed's)
  return normalize(mix(vec2(0.0, -1.0), -g + uSwirl * 0.8 * vec2(-g.y, g.x), k));
}
float pbRings(vec2 p){
  vec2 c = floor(p / 15.0), f = p / 15.0 - c;
  float h = pbHash(c), t = fract(uTime * 0.6 + h);
  vec2 o = vec2(pbHash(c + 3.1), pbHash(c + 7.7)) * 0.5 + 0.25;
  float d = length(f - o) * 15.0, r = t * 6.5;
  return sin((d - r) * 2.4) * exp(-abs(d - r) * 0.9) * (1.0 - t) * (1.0 - t);
}
float pbH(vec2 p, vec2 f, float spd){
  float t = uTime * 0.8, a = fract(t), b = fract(t + 0.5), w = abs(1.0 - 2.0 * a);
  vec2 q1 = p - f * spd * (a - 0.5) * 1.25, q2 = p - f * spd * (b - 0.5) * 1.25 + 17.3;
  float h1 = pbFbm(q1 * 0.2) + 0.35 * pbNoise(q1 * 0.75);
  float h2 = pbFbm(q2 * 0.2) + 0.35 * pbNoise(q2 * 0.75);
  return mix(h1, h2, w) + 0.3 * pbRings(p);
}
void main(){
  vec2 p = vLp.xz; float sd = pbSdU(p);
  if (sd < -0.35) discard;
  float spd; vec2 f = pbFlow(p, sd, spd);
  float e = 0.35, h0 = pbH(p, f, spd);
  float near = 1.0 - pbSS(0.0, 14.0, sd);
  float str = 0.75 + 1.1 * near;
  vec3 N = normalize(vec3(-(pbH(p + vec2(e, 0.0), f, spd) - h0) / e * str, 1.0, -(pbH(p + vec2(0.0, e), f, spd) - h0) / e * str));
  // surface tension: the water bulges up against kerb and cobbles
  float edge = pbChan(p.y) - abs(p.x);
  float men = pbSS(2.2, 0.2, edge) * step(-46.0, p.y);
  N = normalize(N + vec3(sign(p.x) * men * 0.9, 0.0, 0.0));
  vec3 V = normalize(uCamL - vLp);
  float fr = 0.035 + 0.965 * pow(clamp(1.0 - max(dot(N, V), 0.0), 0.0, 1.0), 5.0);
  vec3 R = reflect(-V, N); R.y = abs(R.y);
  vec3 col = mix(uDeep * (0.55 + 0.5 * h0), mix(uSkyLo, uSkyHi, clamp(R.y * 1.3, 0.0, 1.0)), fr);
  // the lamp: one broken golden ribbon laid along the water toward the viewer, plus hard glints
  vec3 Lv = uLampPos - vLp; float ld = length(Lv); vec3 L = Lv / ld;
  vec3 az = normalize(vec3(L.x, 0.0, L.z)), lat = vec3(az.z, 0.0, -az.x);
  float dl = dot(R, lat) - dot(L, lat), dv = R.y - L.y;
  float ribbon = exp(-dl * dl * 190.0) * exp(-dv * dv * 1.3) * step(0.0, dot(R, az));
  float glint = pow(max(dot(R, L), 0.0), 220.0);
  // (polish 3) a hull stands in front of the ribbon: dark water round it and a bright meniscus line,
  // so a boat on the gold is a solid thing and not a ghost in the glare
  float occ = 1.0, hring = 0.0;
  for (int i = 0; i < 3; i++) {
    vec2 hv = vLp.xz - uHull[i].xy;
    float hr = length(vec2(dot(hv, uHullD[i].xy) * uHullD[i].z, dot(hv, vec2(-uHullD[i].y, uHullD[i].x)))) + 1e-3;
    occ *= 1.0 - 0.8 * pbSS(uHull[i].z * 2.2, uHull[i].z * 1.2, hr);      // (repair 3) a hull darkens the water close round it and no further (it was three and a half hull lengths: from close astern the whole ribbon between the lens and the lip lay in the boats' dark, and the setPiece wants 'The lamp's reflection ... runs to the lip')
    hring += exp(-pbSq((hr - uHull[i].z) / 1.1));
  }
  col += uLampCol * ((ribbon * 1.0 + glint * 3.0) * occ + 0.012) * pbLampAtt(ld) * 1.3 * mix(0.6, 1.0, pbSS(8.0, 45.0, distance(uCamL, vLp)));
  col += (uSkyHi * 0.5 + uLampCol * 0.1 * pbLampAtt(ld)) * hring;
  // foam: streaks accelerating over the rim, flecks along the banks
  float along = p.y > -20.0 ? atan(p.x, p.y + 20.0) * 20.0 : sign(p.x) * (31.4 + (-20.0 - p.y));
  float lipFoam = pbSS(9.0, 0.5, sd) * pbSS(0.55, 0.85, pbNoise(vec2(along * 0.9, sd * 0.32 + uTime * (3.0 + 2.0 * uProg))));      // (repair 3) streaks with dark water between, not a pale band
  float bankFoam = men * pbSS(0.5, 0.8, pbNoise(p * 0.8 + vec2(0.0, uTime * 2.0)));
  // (repair 3) the motion: 'eddies, foam lines'. Foam lines drawn in on the turning water: a few long arms that
  // follow the flow's own curve in toward the rim (sph is constant along a line of flow), each broken into runs
  // that slide inward along it, soft at both edges, fading out up the channel
  float lr = log(20.0 + max(sd, 0.0)), sph = along * 0.4 - uSwirl * 6.4 * lr;
  float sw = sph + 2.2 * (pbNoise(vec2(along * 0.06, lr * 2.0)) - 0.5), wpu = (20.0 + max(sd, 0.0)) / 10.2;      // wpu: world units to one radian of sph
  float d1 = abs(fract(sw / 6.2832) - 0.5) * 6.2832 * wpu, d2 = abs(fract(sw / 3.1416 + 0.31) - 0.5) * 3.1416 * wpu;      // distance to the nearest arm, and to the nearest of the finer lines between
  float runs = pbSS(0.3, 0.62, pbNoise(vec2(sph * 0.8, lr * 5.0 + uTime * (0.55 + 0.25 * uProg))));
  float runs2 = pbSS(0.45, 0.7, pbNoise(vec2(sph * 1.7 + 9.0, lr * 7.0 + uTime * (0.7 + 0.3 * uProg))));
  float spiral = (pbSS(0.95, 0.2, d1) * runs + 0.6 * pbSS(0.55, 0.1, d2) * runs2) * pbSS(64.0, 28.0, sd) * pbSS(0.3, 3.0, sd);
  float foam = clamp(lipFoam * 0.7 + bankFoam * 0.5 + spiral * 0.7, 0.0, 1.0);
  // the lit steam in the mouth mirrored on the water: a broken amber road from the rim toward the viewer
  // (the setPiece: 'The lamp's reflection, which has led us down the whole street, runs to the lip')
  { vec3 Gv = vec3(0.0, 16.0, -24.0) - vLp; float gl = length(Gv); vec3 Gd = Gv / gl;
    vec3 gaz = normalize(vec3(Gd.x, 0.0, Gd.z) + 1e-5), glat = vec3(gaz.z, 0.0, -gaz.x);
    float gdl = dot(R, glat) - dot(Gd, glat), gdv = R.y - Gd.y;
    col += (uPortalCol * 0.3 + uLampCol * 0.34) * exp(-gdl * gdl * 26.0) * exp(-gdv * gdv * 5.0) * step(0.0, dot(R, gaz)) * fr * occ * (0.5 + 0.5 * uProg) * pbSS(150.0, 60.0, gl) * 1.5;
  }
  { vec3 Sv = uShopP - vLp; float sl = length(Sv); vec3 Sd = Sv / max(sl, 1e-3);
    vec3 saz = normalize(vec3(Sd.x, 0.0, Sd.z) + 1e-5), slat = vec3(saz.z, 0.0, -saz.x);
    float sdl = dot(R, slat) - dot(Sd, slat), sdv = R.y - Sd.y, sk = sl / 520.0;
    col += uShopC * exp(-sdl * sdl * 40.0) * exp(-sdv * sdv * 1.3) * step(0.0, dot(R, saz)) * 0.6 / (1.0 + sk * sk * sk * sk); }
  col = mix(col, uCream * 0.3 + uLampCol * 0.16, foam);
  col += uSkyHi * men * 0.22;
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,_e=ie+I+`
attribute vec2 aIn; varying vec3 vLp; varying vec2 vUv;
void main(){
  vec3 p = position; vUv = uv;
  float wob = (pbNoise(vec2(uv.x * 34.0, uv.y * 2.4 - uTime * 1.3)) - 0.5) * 2.6 * uv.y;
  p.xz += aIn * wob;
  vLp = p;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ge=J+I+`
uniform vec3 uSkyHi; uniform vec3 uSkyLo; uniform vec3 uDeep; uniform vec3 uCream;
varying vec3 vLp; varying vec2 vUv;
void main(){
  float s = vUv.x, v = vUv.y, t = uTime * (1.2 + 0.5 * uProg);
  float st1 = pbNoise(vec2(s * 170.0, v * 3.0 - t * 2.1));
  float st2 = pbNoise(vec2(s * 52.0, v * 5.5 - t * 2.7));
  float clump = pbNoise(vec2(s * 15.0, v * 2.3 - t * 1.4));
  float streak = st1 * 0.55 + st2 * 0.65;
  float inP = pbSS(24.0, 4.0, uCamL.z) * pbSS(12.0, 5.5, uCamL.y);          // (polish 2) the viewer is down in the chamber
  // (polish 3) seen from inside, the sheet is combed into falling ribbons instead of standing as a pane
  float comb = pbSS(0.34, 0.86, streak);
  // (repair 3) the fall is drawn: whole and glassy where it bends over the lip, then torn into ropes of water
  // about a unit across (gathered in clumps, fine threads between) with the dark of the chamber in the gaps;
  // each rope is the lamp's amber where it leaves the lip ('the falling sheet lit amber from behind') and goes
  // down into the dark. Before, the whole curtain was one pale cream surface from lip to pool
  // (r5) the fall stays whole as far down as the iron skirt stands behind it and tears below the skirt's foot:
  // 7.6 is the foot of the iron rim's skirt under the basin's level (the rim's profile, its first point
  // [-0.7, -7.6]); 0.7 and 45.5 are the fall's own law (its height is -0.7 - 45.5 v v). So the tearing starts at
  // the v at which the water has fallen to the skirt's foot
  float rope = pbSS(0.36, 0.6, st2 * 0.62 + clump * 0.38), thread = pbSS(0.6, 0.86, st1), torn = pbSS(sqrt((7.6 - 0.7) / 45.5), 0.5, v), deep = pbSS(0.0, 0.85, v);
  float alpha = mix(0.92, 0.06 + 0.86 * max(rope, 0.5 * thread), torn);
  vec3 Lv = uLampPos - vLp; float ld = length(Lv); vec3 L = Lv / ld;
  float lit = pbLampVis(vLp, L) * pbLampAtt(ld);
  vec3 col = mix(uLampCol * (0.07 + 0.16 * st2 + 0.2 * thread) * (0.5 + 0.5 * lit), uDeep * 0.9 + uSkyLo * 0.6, deep) * (0.4 + 0.8 * rope);
  // (polish 3) inside the chamber the culvert's warm light rakes across the ropes, and clots of foam go down
  vec3 Pq = uPortalPos - vLp; float pk = 1.0 / (1.0 + dot(Pq, Pq) / 2600.0);
  col += inP * (uPortalCol * 0.16 + uLampCol * 0.3) * (0.01 + 0.16 * comb * comb) * pk * (0.3 + 0.7 * rope);
  col += (uCream * 0.08 + uLampCol * 0.1) * inP * pbSS(0.74, 0.96, st1) * (0.3 + 0.7 * clump) * (1.0 - 0.7 * deep);
  float clot = pbSS(0.7, 0.9, pbNoise(vec2(s * 46.0, v * 7.0 - t * 2.4))) * pbSS(0.25, 0.6, clump) * pbSS(0.1, 0.35, v);
  col += (uCream * 0.12 + uLampCol * 0.12) * inP * clot * (1.0 - 0.6 * deep);
  // the lamp's reflection runs to the lip and goes over the edge with the water
  float rib = exp(-vLp.x * vLp.x / 14.0) * pbSS(-26.0, -6.0, vLp.z) * (1.0 - 0.75 * v);
  col += uLampCol * rib * (0.12 + 0.5 * st1);
  vec3 Pv = uPortalPos - vLp; col += uPortalCol * (0.04 + 0.3 * st2) / (1.0 + dot(Pv, Pv) / 300.0);
  col += uSkyHi * 0.6 * pbSS(0.07, 0.0, v) * (1.0 - 0.6 * inP);
  col += (uPortalCol * 0.55 + uLampCol * 0.18) * pbSS(0.12, 0.0, v) * (0.6 + 0.6 * st2);     // the back-lit lip: a glowing horseshoe line
  // (polish 3) the curl at the lip: a bright rolled shoulder, the darker hollow under it, then the fall
  float curl = exp(-pbSq((v - 0.045) / 0.028)), hollow = exp(-pbSq((v - 0.15) / 0.05));
  col += uLampCol * curl * (0.12 + 0.25 * st2) * (0.6 + 0.4 * inP);
  col *= 1.0 - 0.5 * hollow * (0.5 + 0.5 * st2);
  col += (uCream * 0.3 + uLampCol * 0.25) * pbSS(0.6, 0.85, pbNoise(vec2(s * 90.0, v * 14.0 - t * 3.0))) * pbSS(0.2, 0.06, v) * pbSS(0.0, 0.03, v);
  // the spray at its foot: where the ropes strike the pool they burst into fine drops (amber-grey, never white)
  float drops = pbSS(0.5, 0.78, pbNoise(vec2(s * 300.0, v * 70.0 - t * 6.0))), foam = pbSS(0.72, 1.0, v) * (0.25 + 0.75 * drops) * (0.5 + 0.5 * st2);
  col = mix(col, uCream * 0.13 + uLampCol * (0.05 + 0.14 * lit + 0.09 * inP), foam * 0.85);
  alpha = max(alpha, foam * 0.6) * (1.0 - pbSS(0.95, 1.03, v)) * pbSS(0.0, 0.035, s) * pbSS(1.0, 0.965, s);
  gl_FragColor = vec4(col, alpha);
  #include <fog_fragment>
}`,Te=J+I+`
uniform vec3 uSkyHi; uniform vec3 uDeep; uniform vec3 uCream;
varying vec3 vLp;
void main(){
  vec2 p = vLp.xz; float sd = pbSdU(p);
  float band = exp(-pbSq((sd + 8.0) / 4.5));
  float n = pbFbm(p * 0.33 + uTime * vec2(0.7, -0.9)), n2 = pbFbm(p * 0.6 - uTime * vec2(0.5, 0.8) + 9.0);
  float rip = sin((sd + 8.0) * 0.8 - sign(sd + 8.0) * uTime * 5.0 + n * 5.0) * exp(-abs(sd + 8.0) * 0.07);
  vec3 N = normalize(vec3((n - 0.5) * 1.6 + rip * 0.35, 1.0, (n2 - 0.5) * 1.6));
  vec3 V = normalize(uCamL - vLp), R = reflect(-V, N);
  vec3 Lv = uLampPos - vLp; float ld = length(Lv); vec3 L = Lv / ld;
  float lit = pbLampVis(vLp, L) * pbLampAtt(ld);
  float foam = clamp(band * (0.4 + 0.8 * n) + pbSS(0.25, 0.95, n * n2 * 2.4) * 0.3, 0.0, 1.0);
  vec3 col = uDeep * 0.5;
  col += uLampCol * lit * (0.05 + pow(max(dot(R, L), 0.0), 60.0) * 2.5);
  vec3 Pv = uPortalPos - vLp; float pd = length(Pv);
  col += uPortalCol * (0.05 + 1.2 * pow(max(dot(R, Pv / pd), 0.0), 24.0)) / (1.0 + pd * pd / 1500.0);
  col = mix(col, uCream * 0.16 + uLampCol * (0.04 + 0.25 * lit), foam);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,se=ie+`
varying vec3 vLp; varying vec3 vLn; varying vec2 vUv;
void main(){ vLp = position; vLn = normal; vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,qe=ie+I+`
attribute vec4 aSeed; varying vec3 vLp; varying vec2 vUv; varying float vA; varying vec2 vS; varying float vH;
void main(){
  float ph = fract(uTime * (0.05 + 0.03 * aSeed.y) + aSeed.x);
  // the setPiece: 'mist boiling up out of it into the lamp cone in slow rolling billows'. Most billows boil in
  // the mouth of the drain (up from the chamber to a little over the lip, lit gold from below); about four in
  // ten climb on into the lamp cone, and those drift out to one side or the other and back toward the hood
  // as they rise, so no column ever stands in front of the lamp post
  float tall = step(0.6, aSeed.w), side = aSeed.y < 0.5 ? -1.0 : 1.0;
  vec3 c = vec3((aSeed.y - 0.5) * 30.0, -40.0, -23.0 + (aSeed.z - 0.5) * 36.0);
  c.y += pow(ph, 0.7) * mix(48.0, 57.0, aSeed.z) + tall * ph * ph * (70.0 + 50.0 * aSeed.x);
  c.x += sin(uTime * 0.23 + aSeed.z * 20.0) * 5.0 * ph + tall * side * (5.0 + 34.0 * ph * ph);
  c.z -= tall * ph * 30.0 + (1.0 - tall) * ph * ph * 8.0;
  float size = mix(14.0, mix(36.0, 58.0, tall), ph) * (0.8 + 0.5 * aSeed.z);      // separate billows, not one sheet of haze
  float rot = aSeed.w * 6.283 + uTime * 0.12 * (aSeed.x - 0.5);
  vec2 q = mat2(cos(rot), -sin(rot), sin(rot), cos(rot)) * position.xy * size;
  vec3 fw = normalize(c - uCamL), rt = normalize(cross(fw, vec3(0.0, 1.0, 0.0))), up = cross(rt, fw);
  vec3 p = c + rt * q.x + up * q.y;
  vLp = p; vUv = position.xy * 2.0; vS = aSeed.xy; vH = 2.0 * q.y / size;      // vH: -1 at a billow's foot, +1 at its crown
  vA = pbSS(0.0, 0.1, ph) * (1.0 - pbSS(0.4, 1.0, ph)) * (0.55 + 0.6 * uProg);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,He=J+I+`
uniform vec3 uFogCol;
varying vec3 vLp; varying vec2 vUv; varying float vA; varying vec2 vS; varying float vH;
void main(){
  float d = length(vUv);
  float soft = pbSS(1.0, 0.15, d);
  float n = pbFbm(vUv * 1.7 + vS * 31.0 + vec2(0.0, -uTime * 0.07));
  float cd = distance(vLp, uCamL);
  // thin from up the street (the lamp post and the drain stay readable), thickening as we arrive
  float puff = pbSS(0.38, 0.76, n * (0.5 + 0.95 * soft));                 // a lumpy head with gaps round it
  float a = soft * puff * vA * 0.5 * mix(1.0, 0.4, pbSS(120.0, 250.0, cd)) * mix(1.0, 0.4, pbSS(240.0, 300.0, vLp.y));
  float sd = pbSdU(vLp.xz);
  a *= pbSS(5.0, 40.0, cd) * mix(0.35, 1.0, pbSS(-14.0, 4.0, vLp.y)) * mix(1.0, 0.14, pbSS(24.0, 4.0, uCamL.z) * pbSS(12.0, 5.5, uCamL.y));     // (polish 2, 3) thin once the viewer is inside it
  // the design: 'mist boiling up out of it into the lamp cone in slow rolling billows'. The billows climb the
  // whole cone again; one rule in space keeps them off the boats: outside the horseshoe opening itself nothing
  // of them hangs lower than the kerb top, which is above a boat's peak and the lens that rides behind it
  a *= mix(1.0, pbSS(11.5, 34.0, vLp.y), pbSS(-4.0, 1.0, sd));      // (this also keeps a billow from cutting a hard line into the street)
  // at the level of the lip the falling water drags the mist thin: the horseshoe, its rim and the foot of the
  // lamp post show through it; it thickens again in the chamber below and in the lamp cone above
  a *= 1.0 - 0.3 * pbSS(-14.0, -2.0, vLp.y) * (1.0 - pbSS(24.0, 58.0, vLp.y));
  if (a < 0.003) discard;
  vec3 Lv = uLampPos - vLp; float ld = length(Lv); vec3 L = Lv / ld;
  float cone = pbSS(0.55, 0.97, L.y);
  float att = 1.0 / (1.0 + ld * ld / 90000.0);
  float fs = pow(max(dot(normalize(vLp - uCamL), L), 0.0), 3.0);
  // mist is water in the air: it has no colour of its own, only the light that falls into it. Pale amber and
  // luminous where the lamp cone lights it, nearly nothing outside it (no slate or brown body); each billow
  // is lit from above (a bright crown over a dimmer foot), which is what makes it a rolling billow and not a
  // veil. In the mouth of the drain the light wells up from below instead, and there the foot is the bright part
  float crown = 0.5 + 0.5 * clamp(vH + 0.35 * (n - 0.5), -1.0, 1.0);
  float lit = pbLampVis(vLp, L) * att * cone;
  vec3 Pv = uPortalPos - vLp; float gold = 1.0 / (1.0 + dot(Pv, Pv) / 1500.0);
  // (repair 3) the steam is the lamp's amber, not cream: so bright that it burnt out to white puffs, it is now
  // dim enough to keep its colour (the journey: 'mist glowing ahead under the lamp', 'the amber mist')
  vec3 pale = uLampCol * 0.3 + dot(uLampCol, vec3(0.3333)) * vec3(0.06, 0.04, 0.02);
  vec3 col = pale * lit * (0.75 + 0.5 * fs) * (0.5 + 0.9 * n * soft) * mix(0.5, 1.6, crown * crown);
  // (the gold from below lights the mist in the mouth and over the lip. Below the lip, inside the shaft, the
  // falling sheets drag the mist down with them and it holds little of that light: thin veils there, the same
  // from wherever they are seen, with the fall, the chamber's pool and the culvert's ring behind them; deep in
  // the chamber the gold gives out)
  gold *= pbSS(-34.0, -8.0, vLp.y) * mix(0.35, 1.0, pbSS(-12.0, 2.0, vLp.y));
  // (repair 3) lit amber from below: the light in the shaft is the lamp's amber gone down with the water and come
  // back up through the spray, and it reaches a billow's foot before its crown
  col += (uPortalCol * 0.3 + uLampCol * 0.34) * gold * mix(1.5, 0.3, crown) * (0.6 + 0.6 * n);
  float seen = clamp(lit * 2.6 + gold * 1.2, 0.0, 1.0);
  a *= 0.06 + 0.94 * seen;
  #ifdef USE_FOG
    col = mix(col, fogColor, (1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth)) * 0.6);
  #endif
  gl_FragColor = vec4(col * a, a * 0.22);      // premultiplied: the billow adds its light and hides little of what stands behind it
}`,Ie=J+I+`
varying vec3 vLp; varying vec3 vLn;
void main(){
  vec3 N = normalize(vLn), V = normalize(uCamL - vLp);
  float core = pow(max(abs(dot(N, V)), 0.0), 5.0);
  float bars = 0.85 + 0.15 * pbSS(0.0, 0.5, abs(fract(vLp.y * 0.1) - 0.5));
  gl_FragColor = vec4(uLampCol * (0.55 + 1.9 * core) * bars, 1.0);
  #include <fog_fragment>
}`,Ue=ie+I+`
uniform vec3 uCentre; uniform float uSize; varying vec2 vUv;
void main(){ vUv = position.xy * 2.0;
  vec4 mvPosition = modelViewMatrix * vec4(uCentre, 1.0);
  float sc = length(modelMatrix[0].xyz);
  mvPosition.xyz += normalize(-mvPosition.xyz) * 24.0 * sc;
  mvPosition.xy += position.xy * uSize * sc;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Be=J+I+`
varying vec2 vUv;
void main(){ float d = length(vUv);
  float e = pbSS(1.0, 0.0, d); float g = 0.5 * exp(-d * d * 16.0) + 0.075 * e * e;
  gl_FragColor = vec4(uLampCol * g, 1.0);
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      gl_FragColor.rgb *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      gl_FragColor.rgb *= 1.0 - smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #endif
}`,De=J+I+`
varying vec3 vLp; varying vec3 vLn;
void main(){
  vec3 N = normalize(vLn), V = normalize(uCamL - vLp);
  float rim = pbSq(abs(dot(N, V)));
  float h = clamp((uLampPos.y - vLp.y) / 400.0, 0.0, 1.0);
  float ang = atan(vLp.x - uLampPos.x, vLp.z - uLampPos.z);
  float needles = pbSS(0.62, 1.0, pbNoise(vec2(ang * 330.0, vLp.y * 0.022 + uTime * 4.0)))
                + 0.6 * pbSS(0.66, 1.0, pbNoise(vec2(ang * 610.0 + 9.0, vLp.y * 0.03 + uTime * 5.5)));   // rain crossing the light
  float fade = pbSS(1.0, 0.8, h) * pbSS(0.0, 0.05, h);
  float g = rim * fade * (0.008 + 0.03 * (1.0 - h) * (1.0 - h) + needles * 0.03 * (1.0 - 0.5 * h));
  gl_FragColor = vec4(uLampCol * g, 1.0);
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      gl_FragColor.rgb *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      gl_FragColor.rgb *= 1.0 - smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #endif
}`,Ee=J+I+`
varying vec2 vUv;
void main(){ vec2 q = vUv * 2.0 - 1.0; float d = length(q);
  float sw = pbFbm(q * 2.4 + vec2(uTime * 0.15, -uTime * 0.22));
  gl_FragColor = vec4(uPortalCol * (0.45 + 0.9 * sw) * (1.15 - 0.5 * d) * (0.8 + 0.4 * uProg), 1.0);
  #include <fog_fragment>
}`;async function Xe(t,e={}){const o=t.rng.fork?t.rng.fork("storm-drain"):t.rng,l=t.noise,y=(e.palette&&e.palette.length>=7?e.palette:ge).map(L=>new n.Color(L)),[p,v,c,f,h,u]=y,i=(L,N,_,V=1)=>L.clone().lerp(N,_).multiplyScalar(V),s=o.range(.1,.3),b=o.pick([4,6,6,8]),w={violet:v,pale:f,dirt:i(p,c,.25,.55),moss:new n.Color("#3A4A44").multiplyScalar(.75),mossAmt:o.range(.45,1),mortar:i(p,c,.3,.5),cobble:i(c,v,o.range(.15,.45),.62),granite:i(c,f,o.range(.25,.5),.6),flag:i(c,v,.3,.52),brick:i(i(v,c,.4),h,s,.6),brick2:i(i(c,f,.25),h,s*1.3,.62),iron:i(p,c,.22,.75),rust:i(p,h,.3,.6),apron:e.apron!==!1,leaf:i(h,f,o.range(.4,.6),.3)},C=h.clone().lerp(u,o.range(0,.18)).multiplyScalar(3*(e.lampGain??1)),P=new n.Color(e.portalColor||"#FFD9A0").multiplyScalar(1.2),x={uCamL:{value:new n.Vector3(0,60,200)},uLampPos:{value:E.clone()},uLampCol:{value:C.clone()},uPortalPos:{value:new n.Vector3(T.x,T.y,T.z+15)},uPortalCol:{value:P},uTime:{value:0},uProg:{value:.6},uSkyLo:{value:i(v,p,.2,.5)},uSkyHi:{value:i(c,f,.15,.55)},uDeep:{value:i(p,v,.4,.3)},uCream:{value:u.clone()},uFogCol:{value:i(c,v,.3,.9)},uShopP:{value:new n.Vector3(-200,120,190)},uShopC:{value:new n.Color(0,0,0)},uHull:{value:[0,1,2].map(()=>new n.Vector3(1e5,1e5,4))},uHullD:{value:[0,1,2].map(()=>new n.Vector3(1,0,1))},uSwirl:{value:1}},F=(L,N,_={},V={})=>new n.ShaderMaterial({uniforms:{...n.UniformsUtils.clone(n.UniformsLib.fog),...x,...V},vertexShader:L,fragmentShader:N,fog:!0,..._}),g=new n.Group;g.name="storm-drain";const d=(L,N,_=0)=>{const V=new n.Mesh(L,N);return V.renderOrder=_,V.frustumCulled=!1,g.add(V),V},z=be(),M=L=>t.core.makeRng(t.core.hashSeed(L+":"+t.seed));x.uSwirl.value=M("paper-boat-rapids:drain-swirl")()<.5?-1:1,await ze(z,o.fork?o.fork("street"):o,l,w,()=>t.yield(),M("paper-boat-rapids:plastered-leaf-shapes")),await t.yield();const r=await ke(z,o.fork?o.fork("chamber"):o,w,()=>t.yield());await t.yield(),Ae(z,o.fork?o.fork("hood"):o,w),await t.yield();let a=null;e.lamp!==!1&&(a=Fe(z,o.fork?o.fork("lamp"):o,w,b)),await t.yield(),d(z.build(),Ne(x)),await t.yield();const S=new n.PlaneGeometry(74,193,50,96);S.rotateX(-Math.PI/2),S.translate(0,0,49),d(S,F(Ve,Re),1);{const _=ve(110),V=[],q=[],X=[],Z=[];for(let D=0;D<=110;D++){const G=_[D],j=5+4.5*Math.sin(Math.PI*G.s);for(let O=0;O<=24;O++){const $=O/24*1.03,he=-.35+j*$;V.push(G.x+G.nx*he,-.7-45.5*$*$,G.z+G.nz*he),q.push(G.s,$),X.push(G.nx,G.nz)}}for(let D=0;D<110;D++)for(let G=0;G<24;G++){const j=D*25+G,O=j+24+1;Z.push(j,O,j+1,O,O+1,j+1)}const Y=new n.BufferGeometry;Y.setAttribute("position",new n.Float32BufferAttribute(V,3)),Y.setAttribute("uv",new n.Float32BufferAttribute(q,2)),Y.setAttribute("aIn",new n.Float32BufferAttribute(X,2)),Y.setIndex(Z),d(Y,F(_e,Ge,{transparent:!0,depthWrite:!1,side:n.DoubleSide}),3)}const m=new n.PlaneGeometry(71.8,62.6);m.rotateX(-Math.PI/2),m.translate(0,de,-24.4),d(m,F(se,Te),1);{const L=Math.max(8,Math.round((e.mist??60)*o.range(.9,1.1))),N=new Float32Array(L*4);for(let q=0;q<L*4;q++)N[q]=o();const _=new n.InstancedBufferGeometry,V=new n.PlaneGeometry(1,1);_.index=V.index,_.setAttribute("position",V.attributes.position),_.setAttribute("aSeed",new n.InstancedBufferAttribute(N,4)),_.instanceCount=L,d(_,F(qe,He,{transparent:!0,depthWrite:!1,premultipliedAlpha:!0}),5)}if(a){const L=new n.CylinderGeometry(a.rt-.4,a.rb-.4,a.yt-a.yb,b,1,!0);L.rotateY(a.rot),L.translate(E.x,(a.yb+a.yt)/2,E.z),d(L,F(se,Ie,{side:n.DoubleSide}),0),d(new n.PlaneGeometry(1,1),F(Ue,Be,{transparent:!0,depthWrite:!1,blending:n.AdditiveBlending},{uCentre:{value:E.clone()},uSize:{value:160}}),6);const N=new n.CylinderGeometry(16,170,400,40,1,!0);N.translate(E.x,E.y-206,E.z+30),d(N,F(se,De,{transparent:!0,depthWrite:!1,blending:n.AdditiveBlending,side:n.DoubleSide}),4)}if(e.portalGlow!==!1){const L=new n.CircleGeometry(7.2,36);L.translate(T.x,T.y,-59),d(L,F(se,Ee),0)}const k=new n.Matrix4,B=o.range(0,100);let U=.6;const A=(L,N,_)=>new n.Vector3(L,N,_);return{object:g,radius:110,height:150,center:A(0,-4,-22),ground:!1,groundY:ne,uniforms:x,anchors:{portalSeat:{position:A(T.x,T.y,-55.5),facing:A(0,0,1),radius:7},flyThrough:[A(0,7,146),A(0,7,80),A(0,7,30),A(0,6,8),A(0,2.5,-4),A(0,-5,-14),A(0,-12.5,-25),A(0,-17.5,-36),A(0,-19.6,-45),A(0,-20,-55.5)],lip:A(0,-.7,0),gutterIn:{position:A(0,0,146),direction:A(0,0,-1),halfWidth:15},lampHead:E.clone(),lampBase:A(E.x,te,E.z),mistTop:A(8,95,-55),viewpoints:{approach:{from:A(0,9,135),at:A(0,20,-40)},brink:{from:A(0,8,22),at:A(0,-14,-40)},inside:{from:A(0,-10,-20),at:A(0,-20,-55)}},stepIronSide:r,poolY:de,waterY:0,kerbTopY:te,roadY:ne+2},waterHeight:(L,N)=>we(L,N),channelHalfWidth:L=>oe(L),flow(L,N,_=new n.Vector3){const V=K(L,N),q=.6,X=K(L+q,N)-K(L-q,N),Z=K(L,N+q)-K(L,N-q),Y=Math.hypot(X,Z)||1,D=1-ee(3,42,V),G=.8*x.uSwirl.value,j=ue(0,(-X+G*-Z)/Y,D),O=ue(-1,(-Z+G*X)/Y,D),$=Math.hypot(j,O)||1;return _.set(j/$,10+24*(1-ee(0,30,V)),O/$)},setProgress(L){U=ae(L,0,1)},update(L,N,_){g.updateWorldMatrix(!0,!1),k.copy(g.matrixWorld).invert(),_&&(_.matrixWorld?x.uCamL.value.setFromMatrixPosition(_.matrixWorld):x.uCamL.value.copy(_.position)).applyMatrix4(k),x.uTime.value=N,x.uProg.value=U;const V=N+B,q=1+.07*Math.sin(V*11.3)*Math.sin(V*3.1)+.04*Math.sin(V*23.7+1.3)+.05*l.n2(V*1.7,3.3);x.uLampCol.value.copy(C).multiplyScalar(q)},dispose(){}}}export{I as GLSL_COMMON,Xe as buildHero,H as chamferBox,ce as domeGeo,fe as leafGeo,be as makeAcc,R as trs};
